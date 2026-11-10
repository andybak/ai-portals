import*as R from"three";import{makePath as _i}from"../kit/core.js";import{makeSky as Ii}from"../kit/sky.js";import{buildHero as Ki,ROOF_Y as Ne,CRACK_GLSL as Zi,DOME_GLSL as Yi,OWL_GLSL as $i}from"../parts/under-the-snow-roof.js";const b=R.Vector3,T=Math.PI*2,Jn=Math.PI/180,Vt=(y,_,vt)=>Math.min(vt,Math.max(_,y)),it=(y,_,vt)=>y+(_-y)*vt,z=(y,_,vt)=>{const mt=Vt((vt-y)/(_-y),0,1);return mt*mt*(3-2*mt)},tr=Math.sin(65*Jn),er=Math.cos(65*Jn),ve=-Ne*er/tr,_o=(y,_,vt=!1)=>{if(_<=y[0][0])return y[0][1];for(let mt=1;mt<y.length;mt++)if(_<=y[mt][0]){const lt=(_-y[mt-1][0])/(y[mt][0]-y[mt-1][0]);return it(y[mt-1][1],y[mt][1],vt?lt*lt*(3-2*lt):lt)}return y[y.length-1][1]},et=y=>{const _=new R.Color(y);return[_.r,_.g,_.b]},Pt=(y,_,vt)=>[it(y[0],_[0],vt),it(y[1],_[1],vt),it(y[2],_[2],vt)],Sa=`
float h11(float n){ return fract(sin(n*127.1+1.7)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float h31(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7)))*43758.5453); }
float vn2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float a=mix(mix(h31(i),h31(i+vec3(1.,0.,0.)),f.x), mix(h31(i+vec3(0.,1.,0.)),h31(i+vec3(1.,1.,0.)),f.x), f.y);
  float b=mix(mix(h31(i+vec3(0.,0.,1.)),h31(i+vec3(1.,0.,1.)),f.x), mix(h31(i+vec3(0.,1.,1.)),h31(i+vec3(1.,1.,1.)),f.x), f.y);
  return mix(a,b,f.z); }
`,Vs=`
uniform vec4 uPatch[32]; uniform vec4 uHoof[4]; uniform vec4 uPool0, uPool1, uPool2, uPool3, uPool4, uAur; uniform vec3 uHoleR; uniform vec2 uHoleR2; uniform vec4 uWell;
uniform vec3 uTurq, uCobalt, uDayCol, uShadowCol, uLeeCol; uniform vec4 uLee;
uniform float uTime, uGlow, uGreen, uBand, uSeedF, uDay, uLobe, uGrey, uThickOff, uThickAmp, uPatchK, uGreenThin, uDim, uSwell, uAurBand;
uniform float uDome;
const vec3 AXG = vec3(0.0, ${tr.toFixed(5)}, ${(-er).toFixed(5)});
float rfFbm(vec2 p){ return 0.57*vn2(p) + 0.29*vn2(p*2.03+17.1) + 0.14*vn2(p*4.07+5.3); }
${Yi}
// snow thickness over a point of the floor plan, 0.06 (a skin) .. 1 (a deep drift)
float rfThick(vec2 p){
  // the patches where the roof is thin (w > 0) or deep (w < 0). Under a thin patch the drift's own swells lie nearly flat, so that the
  // patch is thin, and glows, whatever the drift does on this seed
  float pk = 0., pn = 0.;
  for (int i = 0; i < 32; i++) { vec2 d = p - uPatch[i].xy; float e = uPatch[i].w*exp(-dot(d,d)/max(uPatch[i].z*uPatch[i].z, 1.)); pk += max(e, 0.); pn += min(e, 0.); }
  float hold = 1. - min(3.*pk, 0.9);
  float th = 0.56 + uThickOff + hold*uThickAmp*(rfFbm(p*0.045+uSeedF) - 0.5);
  // the drift lies in long swells: deep (dim cobalt) here, a clear blue-turquoise skin there; none of it over the strike gallery
  { vec2 dh = p - vec2(0., ${ve.toFixed(3)}); th += hold*uSwell*(vn2(p*0.0125 + uSeedF*1.7 + 3.1) - 0.56)*(1. - exp(-dot(dh, dh)/2500.)); }
  th -= uPatchK*(pk + pn);
  return clamp(th, 0.06, 1.);
}
// what stands or passes on the snow above: hooves (compressed columns) and the owl's shadow
// x: the pressed column under a hoof (dark), y: the ring of snow squeezed thin round it (bright)
vec2 hoofCR(vec2 p){
  vec2 cr = vec2(0.);
  for (int i = 0; i < 4; i++) {
    vec2 d = p - uHoof[i].xy; float r = length(d) - 5.3; d.x = abs(d.x) - uLobe;
    cr += uHoof[i].z*vec2(exp(-dot(d,d)/11.), exp(-r*r/2.2));
  }
  return min(cr, vec2(1.));
}
// the owl's shadow on the snow above (owlShaded: the hero's own shape and shade, which its roof disc draws too)
${$i}
// the light of snow of middling depth, which the owl's shade is measured against (0.47: what such snow lets through, exp(-1.5*0.5))
float owlRef(){ return dot(mix(uTurq, uCobalt, 0.5), vec3(0.3, 0.5, 0.2))*uGlow*0.47; }
float rfDim(vec2 p){
  return 1. - 0.2*hoofCR(p).x;                                                    // what lies under a hoof-fall dims a little; the roof itself goes dark (ROOF_FS)
}
// light leaving the roof underside above p (linear HDR): thin snow is bright turquoise, thick is dim cobalt. rfLightBare: all of it
// but the owl's shade; rfLight (below it): with the shade, which everything under the roof takes
vec3 rfLightBare(vec2 p){
  float th = rfThick(p);
  vec3 c = mix(uTurq, uCobalt, smoothstep(0.2, 0.8, th))*uGlow*exp(-1.5*th);
  // the green of the aurora comes through in slow bands (uAurBand), whole again over the strike gallery; a thaw is green-white where the roof is thin
  float aur = 1.;
  if (uAurBand > 0.) { vec2 dh = p - vec2(0., ${ve.toFixed(3)}); float bn = smoothstep(0.3, 0.7, vn2(vec2(p.x*0.021 + p.y*0.012 + uTime*0.03, p.y*0.019 - p.x*0.008) + 31.)); aur = mix(mix(1., bn*1.7, uAurBand), 1., exp(-dot(dh, dh)/3600.)); }
  c = mix(c, vec3(c.g*0.9, c.g*1.25, c.g*0.8), min(max(uGreen*aur, uGreenThin*(1. - smoothstep(0.08, 0.34, th))), 1.));
  c = mix(c, vec3(dot(c, vec3(0.3, 0.5, 0.2)))*vec3(0.92, 1.0, 1.1), uGrey);
  { vec2 da = p - uAur.xy; float ka = uAur.w*exp(-dot(da, da)/max(uAur.z*uAur.z, 1.)); c = mix(c, vec3(0.16, 1.0, 0.4)*(c.g*2.3 + 0.22), ka); }   // the aurora, where it stands over thin snow (night)
  // as the owl's weight comes onto the roof the pressed snow round the bulge darkens: by at most 0.07 of itself (the greatest
  // the hero gives uDim) at the hole's centre, falling to 1/e of that 60 m out
  { vec2 dh = p - vec2(0., ${ve.toFixed(3)}); c *= 1. - uDim*exp(-dot(dh, dh)/3600.); }                  // the pressed snow round the bulge darkens
  // the paling dome brightens the roof round it: the roof's own light is multiplied by 1 + domeGain (DOME_GAIN at the hole's
  // centre, falling by the distance in plan from it to 1/e 30 m out) times uDome (0 before the bulge, 1 when the dome has paled,
  // 0 again once the roof is through). It is applied here, after the dim above: at the hole's centre, with the dome fully paled
  // and the dim at its greatest, the roof stands (1 + DOME_GAIN)*(1 - 0.07) times itself, so that it grows brighter there while
  // it is pressed when that product is over 1. The bands, the hoof-falls and the well's shade below are factors on
  // it like the rest; the well's daylight is added after and does not take it; the owl's shade is laid last of all, in rfLight,
  // as the lesser of all this and its one even tone. (The strike's roof disc applies the same gain before its own dim.)
  { vec2 dh = p - vec2(0., ${ve.toFixed(3)}); c *= 1. + domeGain(dot(dh, dh))*uDome; }
  c *= 0.8 + 0.2*sin(p.x*0.2 + p.y*0.08 + rfFbm(p*0.04)*6. - uTime*0.4*uBand);
  c *= rfDim(p);
  vec2 dw = p - uWell.xy; float rw = length(dw)/max(uWell.z, 0.5);
  c *= 1. - 0.8*(1. - uWell.w)*exp(-rw*rw*1.6)*step(1., uWell.z);
  c += uDayCol*uWell.w*(3.2*(1. - smoothstep(0.75, 1.1, rw)) + 0.14*exp(-rw*rw*0.07));
  return c;
}
// (under the owl's whole shade the light is the lesser of rfLightBare's and the shade's one even tone: owlShaded)
vec3 rfLight(vec2 p){ return owlShaded(rfLightBare(p), p, owlRef()); }
// pools of daylight under the smaller openings: the ptarmigan's plunge hole, the fox's dig, the gap beside the boulder (x, z, radius, open)
float poolAt(vec2 p, vec4 q){ vec2 d = p - q.xy; return q.w*exp(-dot(d, d)/max(q.z*q.z, 1.)); }
// daylight let in by the strike (a cone down the shaft axis) and by the rare second well
vec3 dayAt(vec3 wp){
  vec3 q = wp - AXG*dot(wp, AXG); float cone = exp(-dot(q,q)/156.)*(1. - smoothstep(${(Ne+1).toFixed(1)}, ${(Ne+6).toFixed(1)}, wp.y));
  float amb = 0.16*exp(-dot(wp.xz, wp.xz)/2600.);
  vec2 dw = wp.xz - uWell.xy; float well = uWell.w*exp(-dot(dw,dw)/650.);
  // the light that comes down the gap in the boulder's lee (uLee: x, z, radius, strength; uLeeCol: its colour by the hour): a pool
  // on the floor where the shaft lands and on what stands low in it, fading up the walls
  vec2 dl = wp.xz - uLee.xy; vec3 lee = uLeeCol*uLee.w*exp(-dot(dl, dl)/max(uLee.z*uLee.z, 1.))*(1. - 0.75*smoothstep(3., 14., wp.y));
  return uDayCol*(uDay*(1.5*cone + amb) + well*0.4 + 0.85*(poolAt(wp.xz, uPool0) + poolAt(wp.xz, uPool1) + poolAt(wp.xz, uPool2) + poolAt(wp.xz, uPool3) + poolAt(wp.xz, uPool4))) + lee;
}
// the roof itself where something has opened it (0..1): a ragged disc of plain daylight
float holeAt(vec2 p, vec4 q, float rh){ float r = length(p - q.xy)/max(rh, 0.5) + 0.3*(vn2(p*0.55 + q.xy) - 0.5); return q.w*(1. - smoothstep(0.78, 1.02, r)); }
float holesAt(vec2 p){ return max(holeAt(p, uPool0, uHoleR.x), max(holeAt(p, uPool1, uHoleR.y), holeAt(p, uPool2, uHoleR.z))); }
// windows of clear ice in the roof with the moon behind them (night)
float lensAt(vec2 p){ return min(max(holeAt(p, uPool3, uHoleR2.x), holeAt(p, uPool4, uHoleR2.y)), 1.); }
// a surface lit by the roof: vivid keeps some of the albedo's own hue under the blue-green light
vec3 shade(vec3 alb, vec3 L, vec3 D, float kd, float vivid){
  vec3 Lv = mix(L, vec3(dot(L, vec3(0.25, 0.55, 0.2)))*vec3(1.04, 1.0, 0.92), vivid);
  vec3 c = alb*(Lv*kd*2.5 + uShadowCol*2.4 + D);
  return c + uShadowCol*0.55*exp(-dot(c, vec3(4., 8., 4.)));          // shadows fall to navy (#0E1E4A), never to black
}
`,Ds="#include <fog_pars_vertex>",ji="#include <fog_vertex>",Bs="#include <fog_pars_fragment>",ye="#include <fog_fragment>",or=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogF = 1.0 - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    float fogF = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  gl_FragColor.rgb *= 1.0 - fogF;
#endif`,ae=`vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
${ji}
`,Ts=()=>R.UniformsUtils.clone(R.UniformsLib.fog);function Te(y,_){return new R.ShaderMaterial({uniforms:{...Ts(),...y,..._.uniforms||{}},fog:!0,side:_.side??R.DoubleSide,transparent:!!_.transparent,depthWrite:_.depthWrite??!0,blending:_.blending??R.NormalBlending,vertexShader:`${Ds}
${Sa}
${Vs}
${_.vs}`,fragmentShader:`${Bs}
${Sa}
${Vs}
${_.fs}`})}class ze{constructor(){this.p=[],this.c=[],this.a=[],this.i=[],this.k=0}v(_,vt,mt,lt,Bt){return this.p.push(_,vt,mt),this.c.push(lt[0],lt[1],lt[2]),this.a.push(Bt?Bt[0]:0,Bt?Bt[1]:0,Bt?Bt[2]:0,Bt?Bt[3]:0),this.k++}tri(_,vt,mt){this.i.push(_,vt,mt)}quad(_,vt,mt,lt){this.i.push(_,vt,mt,_,mt,lt)}loft(_,vt=!0){for(let mt=0;mt+1<_.length;mt++){const lt=_[mt],Bt=_[mt+1],Xt=lt.length,ue=vt?Xt:Xt-1;for(let Ot=0;Ot<ue;Ot++){const te=(Ot+1)%Xt;this.quad(lt[Ot],lt[te],Bt[te],Bt[Ot])}}}tube(_,vt,mt,lt,Bt,Xt=!0){const ue=_.length,Ot=[],te=new b,ct=new b(0,1,0),be=new b,ie=new b;for(let Lt=0;Lt<ue;Lt++){te.copy(_[Math.min(Lt+1,ue-1)]).sub(_[Math.max(Lt-1,0)]).normalize(),Lt===0&&Math.abs(te.y)>.9&&ct.set(1,0,0),ct.addScaledVector(te,-ct.dot(te)).normalize(),be.crossVectors(te,ct);const re=Lt/(ue-1),Oe=vt(re),Zt=[],_t=Bt?Bt(re):null;for(let $t=0;$t<mt;$t++){const i=$t/mt*T,ut=vt.length>1?vt(re,i):Oe;ie.copy(_[Lt]).addScaledVector(ct,Math.cos(i)*ut).addScaledVector(be,Math.sin(i)*ut),Zt.push(this.v(ie.x,ie.y,ie.z,lt(re,i),_t))}Ot.push(Zt)}if(this.loft(Ot,!0),Xt){const Lt=_[ue-1],re=this.v(Lt.x,Lt.y,Lt.z,lt(1,0),Bt?Bt(1):null),Oe=Ot[ue-1];for(let Zt=0;Zt<mt;Zt++)this.tri(re,Oe[Zt],Oe[(Zt+1)%mt])}}ball(_,vt,mt,lt,Bt,Xt,ue,Ot){const te=[];for(let ct=0;ct<=Xt;ct++){const be=-Math.PI/2+Math.PI*ct/Xt,ie=Math.sin(be),Lt=Math.max(Math.cos(be),.02),re=[];for(let Oe=0;Oe<Bt;Oe++){const Zt=Oe/Bt*T;re.push(this.v(_.x+Math.cos(Zt)*Lt*vt,_.y+ie*mt,_.z+Math.sin(Zt)*Lt*lt,ue(ie,Zt),Ot))}te.push(re)}this.loft(te,!0)}build(){const _=new R.BufferGeometry;return _.setAttribute("position",new R.Float32BufferAttribute(this.p,3)),_.setAttribute("color",new R.Float32BufferAttribute(this.c,3)),_.setAttribute("aA",new R.Float32BufferAttribute(this.a,4)),_.setIndex(this.i),_.computeVertexNormals(),_}}const Xi=`
attribute float aG; attribute vec2 aZ; attribute vec4 aW;
varying vec3 vW; varying vec3 vN; varying float vG; varying vec2 vZ; varying vec4 vY;
void main(){
  vec3 p = position; vG = aG; vZ = aZ; vY = aW;
  float k = clamp(aG/3., 0., 1.);
  for (int i = 0; i < 4; i++) { vec2 d = p.xz - uHoof[i].xy; p.y -= 2.1*uHoof[i].w*k*exp(-dot(d,d)/15.); }
  // drifted walls: they belly in and out along their length (not at the foot, which the floor's bank takes)
  float wl = aZ.y*(1. - smoothstep(0.35, 0.8, abs(normal.y)))*clamp(aG/1.5, 0., 1.);
  p += normal*wl*(1.3*(vn3(p*0.19 + 3.) - 0.5) + 0.6*(vn3(p*0.41) - 0.5));
  vW = p; vN = normal;
  vec4 wp = vec4(p, 1.);
  ${ae}
}`,Qi=`
uniform float uCrGrow, uHole;
varying vec3 vW; varying vec3 vN; varying float vG; varying vec2 vZ; varying vec4 vY;
${Zi}
// a wall of drifted snow in section (q: metres along it, metres up): lenses of clear ice lie in it, each a thin level band that pinches
// out at both ends. x: 1 inside one, y: 0 at its skin .. 1 at its heart; soft over a pixel (px) at its skin
vec2 iceLens(vec2 q, float px){
  float wv = q.y/0.85 + 0.45*vn2(vec2(q.x*0.09, 3.)), row = floor(wv), fy = fract(wv) - 0.5;
  float c = q.x/3.6 + h11(row)*9.3, id = floor(c), fa = fract(c) - 0.5, hh = h21(vec2(id, row)), hb = fract(hh*9.7);
  float a0 = 0.26 + 0.2*hb, t0 = (0.11 + 0.16*hh)*sqrt(max(1. - fa*fa/(a0*a0), 0.)), d = t0 - abs(fy - (hb - 0.5)*0.3);
  return vec2(step(0.42, hh)*smoothstep(0., 0.035 + px*1.2, d), clamp(d/max(t0, 1e-3), 0., 1.));
}
// drifted snow on a wall: rounded pillows, each lit from above and dark beneath, with a crease between neighbours (x: light, y: 0 in a crease)
vec2 pillows(vec2 q){
  vec2 i = floor(q), f = fract(q); float d1 = 8., d2 = 8., ry = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y)); vec2 c = i + g;
    vec2 r = g + vec2(h21(c), h21(c+17.3)) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; ry = r.y; } else if (d < d2) { d2 = d; } }
  d1 = sqrt(d1); d2 = sqrt(d2);
  return vec2(clamp(0.55 - 1.15*ry - 0.3*d1, 0., 1.), smoothstep(0., 0.2, d2 - d1));
}
float worley(vec2 p){ vec2 i = floor(p), f = fract(p); float d = 1.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y));
    vec2 r = g + vec2(h21(i+g), h21(i+g+17.3)) - f; d = min(d, dot(r, r)); }
  return sqrt(d); }
// nearest and second nearest cell point, and a hash of the nearest cell
vec3 wor3(vec2 p){ vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8., id = 0.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) { vec2 g = vec2(float(x), float(y)); vec2 c = i + g;
    vec2 r = g + vec2(h21(c), h21(c+17.3)) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; id = h21(c + 5.1); } else if (d < d2) { d2 = d; } }
  return vec3(sqrt(d1), sqrt(d2), id); }
// cupped depth hoar: thin bright cup centres, thick dark ribs between them, at two sizes; close to the eye it resolves into
// separate crystals, each a flat facet of its own brightness with a dark seam round it
float cups(vec2 q, float fine){
  float cup = worley(q*0.3 + uSeedF), cup2 = worley(q*0.95 + 3.7);
  float c = (1.28 - 0.95*smoothstep(0.08, 0.62, cup))*(1.1 - 0.46*smoothstep(0.1, 0.6, cup2));
  if (fine > 0.01) { vec3 w = wor3(q*3.1 + 9.1); c *= mix(1., (0.8 + 0.42*w.z)*(0.7 + 0.3*smoothstep(0., 0.42, w.y - w.x)), fine*0.85); }
  return c;
}
void main(){
  vec2 e = (vW.xz - vec2(0., ${ve.toFixed(3)}))/vec2(14.5, 16.);
  if (dot(e, e) < 1. && vW.y > ${(Ne-1.6).toFixed(1)}) discard;                       // the hero's disc and shaft take over here
  vec3 N = normalize(vN); float down = abs(N.y);
  vec3 V = normalize(cameraPosition - vW);
  float pwc = min(fwidth(vW.x), 1.2);                                                        // a pixel's width here, for the fractures (taken outside any loop)
  float pwy = fwidth(vW.y), pwl = 0.6*(pwc + pwy);                                           // and its height, for what the walls show by the rooms
  vec3 Lb = rfLightBare(vW.xz);                                                              // the roof's light here without the owl's shade (the shade is laid below, on the roof's face with its cups)
  float nearK = 1. - smoothstep(10., 34., length(cameraPosition - vW));                      // grain of the hoar, only where it is close enough to resolve
  float kSt = 1. - smoothstep(70., 105., length(vW.xz));                                     // the strike gallery, whose walls are bare snow
  // the cups are laid on the roof in plan and on the walls in elevation (two wall projections blended by the normal),
  // so that they do not smear down a steep wall
  float wr = smoothstep(0.3, 0.7, down), wx = N.x*N.x, wz = N.z*N.z, ws = max(wx + wz, 1e-4);
  wx *= (1. - wr)/ws; wz *= (1. - wr)/ws;
  float cell = 0.;
  float fine = 1. - smoothstep(5., 16., length(cameraPosition - vW));
  if (wr > 0.004) cell += wr*cups(vW.xz + vec2(vW.y*0.35), fine);
  if (wx > 0.004) cell += wx*cups(vec2(vW.z + 31., vW.y*1.15), fine);
  if (wz > 0.004) cell += wz*cups(vec2(vW.x + 57., vW.y*1.15), fine);
  float grain = vn2((vW.xz + vec2(vW.y*0.8))*1.1 + 5.);
  float strata = 0.5 + 0.5*sin(vW.y*4.2 + vn2(vW.xz*0.4)*5.);
  // wind crust seen from below: where the snow above was ribbed by the wind the roof is ribbed too, thick blue ridges and thin pale troughs
  float rph = dot(vW.xz, vec2(0.83, 0.56))*4.6 + 3.4*vn2(vW.xz*0.085 + 3.) + 1.1*vn2(vW.xz*0.33);
  float ribW = vZ.x*wr*(1. - smoothstep(0.5, 1.5, fwidth(rph))), rfr = fract(rph/6.2832), ribT = smoothstep(0., 0.14, rfr)*(1. - smoothstep(0.14, 0.92, rfr));
  cell *= mix(1., 0.5 + 0.95*ribT, ribW);
  Lb = mix(Lb, mix(Lb*vec3(0.6, 0.8, 1.15), Lb*vec3(1.05, 1.1, 1.0) + vec3(0.02, 0.04, 0.04), ribT), ribW*0.6);
  vec2 hcr = hoofCR(vW.xz);
  // the owl's shade: on the light the wall's grain takes (L) as everything under the roof takes it, and on the roof's own face
  // with its cups (em), as the hero's disc takes it: the tone there is the tone of the snow without its cups, times the cups
  // evened, times the grain; a cup's bright centre comes down to it, a rib already dimmer than it stays as it is, and no point of
  // the face has more light under the bird than without it (the part's owlShadedFace)
  float owlK = owlShade(vW.xz), lSnow = dot(Lb, vec3(0.3, 0.5, 0.2));
  vec3 L = owlShadedK(Lb, owlK, owlTone(lSnow, owlRef()));
  vec3 em = Lb*cell*(0.82 + 0.36*grain)*(1. + nearK*(0.5*vn3(vW*2.9) + 0.35*vn3(vW*8.3) - 0.42))*max(1. - 0.95*hcr.x, 0.2)*(1. + 2.2*hcr.y);
  em = owlShadedFace(em, owlK, lSnow, cell, owlRef());
  em *= mix(1., 0.72 + 0.4*strata, 1. - wr);
  float roofK = mix(mix(0.34, 0.6, kSt), 1., smoothstep(0.25, 0.8, down))*mix(0.35, 1., smoothstep(0.4, 3.6, vG));
  vec3 col = em*roofK;
  // relief of the cups under the light that falls down and across the walls (derivatives taken here, outside any loop)
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); float hx = dFdx(cell), hy = dFdy(cell);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 Nb = normalize(N*(abs(det) + 1e-7) + 0.55*sign(det)*(hx*r1 + hy*r2));
  float rel = clamp(0.4 + 1.1*dot(Nb, normalize(N*0.5 + vec3(0., 1., 0.01))), 0.12, 1.7);
  vec3 dd = vec3(-vW.x, ${(Ne*.7).toFixed(1)} - vW.y, ${(ve*.5).toFixed(2)} - vW.z);
  float relD = 0.25 + 1.2*max(dot(Nb, dd/max(length(dd), 0.5)), 0.);
  // granular depth hoar of the walls: strata, pockets and grains, lit from across the gallery
  float gr = vn3(vW*2.3), gr2 = vn3(vW*7.1);
  float pock = worley(vec2(vW.x + vW.z*0.7, vW.y*1.3)*0.75);
  vec3 alb = vec3(0.44, 0.56, 0.70)*(0.42 + 0.4*gr + 0.3*gr2)*(0.7 + 0.3*strata)*(0.45 + 0.85*smoothstep(0.05, 0.55, pock));
  alb *= mix(1., 0.45 + 0.8*clamp((cell - 0.25)/1.1, 0., 1.), 1. - wr);
  col += alb*(L*0.5*(1. - roofK*0.85)*rel*(1. + 0.9*kSt) + uShadowCol*(0.6 + 1.3*(1. - wr)) + dayAt(vW)*(0.45 + 0.55*down)*relD);
  float litW = 0.5;                                                                          // how a wall's pillows take the light here (for the wet walls below)
  { float wallW = max(max(1. - wr, 1. - smoothstep(0.6, 0.9, down)), 1. - smoothstep(2.5, 6., vG))*vZ.y;   // the walls, the roof where it leans, and the low roof that comes down to them
    if (wallW > 0.004) {
      vec2 pa = vec2(vW.z + 31., vW.y*1.25), pb = vec2(vW.x + 57., vW.y*1.25), pc = vW.xz + vec2(vW.y*0.5);
      vec2 pl = vec2(0.);
      if (wx > 0.004) pl += wx*(0.7*pillows(pa*0.5) + 0.3*pillows(pa*1.2 + 7.));
      if (wz > 0.004) pl += wz*(0.7*pillows(pb*0.5) + 0.3*pillows(pb*1.2 + 7.));
      if (wr > 0.004) pl += wr*(0.7*pillows(pc*0.5) + 0.3*pillows(pc*1.2 + 7.));
      float lit = pl.x*(0.25 + 0.75*pl.y);
      // close to the eye every pillow is itself a drift of smaller ones, each lit from above with its own crease, and the snow is grainy:
      // no wall is ever one flat tone across more than a hand's breadth of the frame
      float nearW = 1. - smoothstep(10., 26., length(cameraPosition - vW));
      if (nearW > 0.01) {
        vec2 pf = vec2(0.);
        if (wx > 0.004) pf += wx*pillows(pa*2.6 + 3.);
        if (wz > 0.004) pf += wz*pillows(pb*2.6 + 3.);
        if (wr > 0.004) pf += wr*pillows(pc*2.6 + 3.);
        lit = mix(lit, (0.3*lit + 0.7*lit*(0.4 + 1.2*pf.x))*(0.3 + 0.7*pf.y), nearW*0.9);
        lit *= 1. + nearW*(0.6*vn3(vW*5.3) + 0.3*vn3(vW*13.) - 0.45);
      }
      vec3 Lw = mix(L, vec3(dot(L, vec3(0.3, 0.5, 0.2)))*vec3(0.82, 0.95, 1.12), 0.45);                 // snow, not glass: paler and less green than the roof's own glow
      vec3 albW = vec3(0.52, 0.62, 0.74)*(0.72 + 0.3*gr + 0.22*gr2)*(0.84 + 0.16*strata);
      vec3 wallC = albW*(Lw*(0.07 + 1.4*lit)*mix(0.45, 1., smoothstep(0.1, 2.6, vG)) + uShadowCol*(0.4 + 1.4*lit) + dayAt(vW)*(0.25 + 0.75*lit)) + em*0.05;
      col = mix(col, wallC, wallW); litW = mix(litW, lit, wallW);
    } }
  // what the walls show by the rooms (vY; all of it is skipped where the weights are nought)
  { float wallF = max(1. - wr, 1. - smoothstep(2.5, 6., vG));
    if (vY.x > 0.004 && wx + wz > 0.004) {
      // lenses of clear ice: the roof's own light comes down through them, so they glow where the roof above is thin; crazed, with a glassy skin
      vec2 ln = (wx*iceLens(vec2(vW.z + 31., vW.y), pwl) + wz*iceLens(vec2(vW.x + 57., vW.y), pwl))/(wx + wz);
      float craze = smoothstep(0.03, 0.4, worley(vec2(vW.x + vW.z, vW.y*2.)*1.3));
      vec3 ice = L*vec3(0.5, 0.95, 1.12)*(0.3 + 0.75*ln.y)*(0.7 + 0.5*craze) + uShadowCol*0.5 + L*0.5*pow(clamp(1. - abs(dot(N, V)), 0., 1.), 3.);
      col = mix(col, ice, vY.x*ln.x*min((wx + wz)*1.5, 1.));
    }
    if (vY.y*wallF > 0.004) {
      // wet walls: the snow is soaked dark and glazed, and trickles run down it catching the roof's light. The glaze lies on the
      // crowns of the pillows in patches and leaves their creases dark, so that a wet wall keeps its drifted form however flat to
      // the eye's line it stands; each trickle runs in a dark soaked streak of its own
      vec2 wq = wx > wz ? vec2(vW.z + 31., vW.y) : vec2(vW.x + 57., vW.y);
      float trN = vn2(vec2(wq.x*2.4, wq.y*0.16 + 3.)), tr = smoothstep(0.62, 0.8, trN)*(1. - wr), trD = smoothstep(0.5, 0.62, trN)*(1. - wr);
      float bead = 0.5 + 0.5*sin(wq.y*5. + uTime*1.6 + vn2(vec2(wq.x*2.4, 7.))*20.);
      float fr = pow(clamp(1. - abs(dot(N, V)), 0., 1.), 3.);
      float crown = smoothstep(0.3, 0.85, litW)*(0.35 + 0.65*smoothstep(0.3, 0.7, vn2(wq*0.9 + 13.)));
      col = mix(col, col*vec3(0.5, 0.62, 0.7)*(0.55 + 0.75*litW)*(1. - 0.4*trD) + L*(0.03 + 0.5*fr*crown) + L*tr*(0.14 + 0.6*bead*bead), vY.y*wallF);
    }
    if (vY.z > 0.004) {
      // moss on the foot of the walls, in cushions: highest where the wall is rough (vG: the roof's height over the floor, low at a wall's foot)
      float mh = 1. - smoothstep(0.6, 3.4, vG - 1.6*(vn2(vW.xz*0.45 + 9.) - 0.5) - 0.8*(gr - 0.5));
      float cu = worley(vec2(vW.x + 0.6*vW.y, vW.z - 0.4*vW.y)*1.4);
      float tip = 0.55 + 0.6*vn3(vW*9.) + 0.5*vn3(vW*21.)*(1. - smoothstep(0.02, 0.09, pwl));                // frond tips, gone before a pixel outgrows them
      vec3 mossC = mix(vec3(0.03, 0.09, 0.025), vec3(0.14, 0.27, 0.06), smoothstep(0.15, 0.7, 1. - cu))*tip;
      col = mix(col, shade(mossC, L*mix(0.45, 1., smoothstep(0.3, 2.6, vG)), dayAt(vW), 0.35 + 0.5*(1. - cu), 0.55), vY.z*smoothstep(0.35, 0.6, mh + 0.25*(1. - cu) - 0.2));
    }
    if (vY.w*(1. - wr) > 0.004) {
      // bare wind crust: in patches hard layers stand out of the wall as ledges two thirds of a metre apart, each with a pale lip and its
      // own shade under it (faded out before a pixel is as tall as a lip); the wall is paler and less green than drifted snow
      float cy = vW.y*1.5 + 1.6*vn2(vec2(vW.x + vW.z, vW.y*0.25)*0.35) + 0.5*vn2(vW.xz*1.3), cf = fract(cy);
      float kc = (1. - smoothstep(0.03, 0.09, pwy))*smoothstep(0.3, 0.55, vn2(vec2(vW.x - vW.z, vW.y*0.6)*0.3 + 7.));
      vec3 cc = col*(1. + kc*(0.8*smoothstep(0.78, 0.9, cf)*(1. - smoothstep(0.93, 1., cf)) - 0.45*(1. - smoothstep(0., 0.28, cf))));
      col = mix(col, mix(cc, vec3(dot(cc, vec3(0.3, 0.5, 0.2)))*vec3(1.04, 1.15, 1.3), 0.45), vY.w*(1. - wr));
    } }
  col += uShadowCol*0.5*exp(-dot(col, vec3(4., 8., 4.)));
  { float hg = holesAt(vW.xz)*smoothstep(0.35, 0.75, down)*step(4.5, vG); col = mix(col, uDayCol*2.7, hg); }
  { float hl = lensAt(vW.xz)*smoothstep(0.35, 0.75, down)*step(4.5, vG), ck = worley(vW.xz*0.8 + 3.);                 // an ice lens: blue, crazed, brightest between the cracks
    col = mix(col, uDayCol*vec3(0.46, 0.78, 1.6)*(0.5 + 1.75*smoothstep(0.04, 0.5, ck))*(0.75 + 0.25*grain), hl); }
  // the fractures that run out from the bulge along the roof toward us: gaps in a dark seam of sheared snow, their broken edge a pale
  // lip. Until the roof goes through a gap is mixed toward near black and then, where its measure is over 0.5, toward daylight
  // (the two mixes below); once the roof is through it is mixed half way to near black where its measure is 1
  if (uCrGrow > 0.004) {
    vec3 gcr = galleryCracks(vW.xz - vec2(0., ${ve.toFixed(3)}), uCrGrow, pwc)*smoothstep(0.18, 0.5, down)*step(3., vG);
    float lit = 1. - uHole;                                                                  // once the roof has gone through they close to dark seams
    col *= 1. - min(gcr.y, 1.)*(0.5*lit + 0.3*uHole);
    col = mix(col, col*0.12 + vec3(0.008, 0.02, 0.05), min(gcr.x, 1.)*(0.9*lit + 0.5*uHole));
    // until the roof goes through, a gap is open to the day: where the gap's measure (gcr.x) is over 0.5 the colour is mixed
    // toward LEAK_GAP times the leak's colour, by a smoothstep of gcr.x from 0.5 to 1, times lit. galleryCracks gives 1 across a
    // gap's breadth and less over its soft edge (a pixel and a centimetre wide), where a gap's half breadth is under three
    // quarters of a pixel, in the spurs (0.8 at most) and between 1 and 5 m along the gallery from the hole's centre; the
    // caller's factors above (down, vG) lessen it too. Where gcr.x is under 0.5 the gap keeps the mix toward near black of the
    // line above. Nothing is added to the sheared snow either side
    col = mix(col, leakCol(uDayCol, uTurq)*LEAK_GAP, smoothstep(0.5, 1., gcr.x)*lit);
    col += mix(uDayCol, uTurq*1.3 + uDayCol*0.35, 0.3)*0.6*min(gcr.z, 1.)*lit;
  }
  // facets of hoar catching the eye
  vec3 q = vW*2.2, c = floor(q); float h = h31(c);
  vec3 dgl = vec3(h31(c+3.1), h31(c+7.7), h31(c+11.3))*2. - 1.;
  float s = max(0., sin(dot(dgl, V)*9. + h*40. + uTime*1.3)); s *= s; s *= s; s *= s;
  float m = 1. - smoothstep(0.08, 0.3, length(fract(q) - 0.5));
  col += (L*1.8 + vec3(0.02, 0.05, 0.08) + uDayCol*uDay*0.6)*s*s*step(0.78, h)*m;
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,Ji=`
attribute float aG; attribute vec2 aZ; attribute vec4 aW;
varying vec3 vW; varying vec3 vN; varying float vG; varying float vBank; varying float vWet; varying float vStr;
void main(){
  vec3 p = position; vWet = aW.y; vStr = aW.x;
  // the snow slumps off the wall onto the floor: a bank of uneven height that buries the line where they meet
  vBank = aZ.y*(1. - smoothstep(0.3, 3.2, aG))*(0.35 + 0.9*vn2(p.xz*0.16 + 5.));
  p.y += 0.95*vBank;
  vW = p; vN = normal; vG = aG; vec4 wp = vec4(p, 1.); ${ae} }`,tl=`
uniform vec4 uBlob[10]; uniform float uWet, uWaterY; uniform vec3 uMossA, uMossB;
varying vec3 vW; varying vec3 vN; varying float vG; varying float vBank; varying float vWet; varying float vStr;
// a scatter of straight needles and straws: one to a cell, each at its own angle. x: coverage, y: a hash
vec2 needles(vec2 q, float w, float aa){
  vec2 c = floor(q), f = fract(q) - 0.5; float h = h21(c), a = h*6.2832;
  vec2 d = vec2(cos(a), sin(a)), o = (vec2(h21(c + 3.1), h21(c + 7.7)) - 0.5)*0.2;
  float al = dot(f - o, d), ac = abs(dot(f - o, vec2(-d.y, d.x)));
  return vec2((1. - smoothstep(w, w + aa, ac))*(1. - smoothstep(0.3, 0.34, abs(al)))*step(0.3, fract(h*7.3)), fract(h*13.7));
}
// grains of hoar: lozenges of every size, each turned its own way and pushed off its cell's centre; most cells are empty
float hoar(vec2 q, float cov, float aa, out float hh){
  vec2 c = floor(q), f = fract(q) - 0.5; float h = h21(c + 4.4), h2 = h21(c + 9.7), a = h2*6.2832;
  vec2 d = f - (vec2(h21(c + 1.3), h21(c + 8.1)) - 0.5)*0.5;
  d = vec2(d.x*cos(a) - d.y*sin(a), d.x*sin(a) + d.y*cos(a));
  float r = 0.06 + 0.14*h2*h2;
  hh = h; return (1. - smoothstep(r, r + aa, abs(d.x) + 0.6*abs(d.y)))*step(h, cov*0.6);
}
void main(){
  vec2 p = vW.xz;
  float dist = length(cameraPosition - vW), far = 1. - smoothstep(18., 60., dist);        // fine detail fades before it can alias
  // metres to a pixel here (taken before any branch). On a floor seen at a slant a pixel is many times longer away from the eye than
  // it is wide, and a grain finer than its length would be drawn as streaks lying across the view; so the measure leans to the
  // pixel's long side, and every layer of the floor's grain, the coarse ones too, goes to its mean before it is finer than that
  float fx = length(dFdx(p)), fy = length(dFdy(p)), pw = mix(min(fx, fy), max(fx, fy), 0.6);
  float k13 = 1. - smoothstep(0.2, 0.5, pw*13.), k23 = 1. - smoothstep(0.2, 0.5, pw*23.), k41 = 1. - smoothstep(0.2, 0.5, pw*41.), kn = 1. - smoothstep(0.02, 0.07, pw);
  float k2 = 1. - smoothstep(0.2, 0.5, pw*1.7), k5 = 1. - smoothstep(0.2, 0.5, pw*5.3), k9 = 1. - smoothstep(0.2, 0.5, pw*9.);
  float n1 = rfFbm(p*0.33), n2 = mix(0.5, vn2(p*1.7 + 3.), k2), n3 = mix(0.5, vn2(p*5.3), k5), n4 = mix(0.5, vn2(p*13.), k13), n5 = mix(0.5, vn2(p*5.3 + 7.), k5);
  float n6 = mix(0.5, vn2(p*23. + 1.7), k23), n7 = mix(0.5, vn2(p*41. + 5.1), k41), n8 = mix(0.5, vn2(p*41. + 19.3), k41);
  // moss or litter: the fine octaves break the boundary into a ragged edge of single fronds; close to, nothing is a soft fade
  float mossK = smoothstep(0.455, 0.525, n1 + 0.25*(n3 - 0.5) + 0.16*(n4 - 0.5) + 0.12*(n6 - 0.5));
  vec3 moss = mix(uMossA, uMossB, smoothstep(0.3, 0.75, n2*0.6 + n3*0.4));
  moss *= 0.5 + 1.0*smoothstep(0.36, 0.64, n6*0.55 + n7*0.45);                            // lit frond tips over the dark between them
  moss = mix(moss, uMossB*1.45, smoothstep(0.62, 0.7, n8)*0.55*k41);                      // pale new growth
  vec3 litter = mix(vec3(0.10, 0.065, 0.04), vec3(0.30, 0.22, 0.12), n3*n3 + 0.3*n4);
  litter *= 0.66 + 0.7*smoothstep(0.38, 0.62, n6);                                         // crumbs of leaf and bark
  litter = mix(litter, vec3(0.04, 0.03, 0.022), smoothstep(0.62, 0.7, n8)*0.65*k41);
  vec3 alb = mix(litter, moss, mossK);
  alb *= 0.6 + 0.5*n4*n3 + 0.3*n2;
  // straw chaff pressed into it, then single needles and straws lying on it
  float ch = vn2(vec2(p.x*1.3 + p.y*3.1, p.y*9. - p.x*4.)), ch2 = vn2(vec2(p.x*8. + p.y*2.3, p.y*1.1 - p.x*3.3));
  alb = mix(alb, vec3(0.40, 0.32, 0.17), (smoothstep(0.80, 0.9, ch) + smoothstep(0.82, 0.9, ch2))*0.6*far*k9);
  vec2 nd = needles(p*1.9, 0.03, pw*1.9), nd2 = needles(p*3.3 + 17., 0.035, pw*3.3);
  alb = mix(alb, mix(vec3(0.46, 0.37, 0.19), vec3(0.2, 0.12, 0.06), step(0.6, nd.y))*(0.8 + 0.4*n6), nd.x*kn*0.9);
  alb = mix(alb, mix(vec3(0.05, 0.04, 0.03), vec3(0.36, 0.3, 0.17), step(0.55, nd2.y)), nd2.x*kn*0.85);
  // rime: close to, separate grains of hoar, thick where the soft field says frost lies; far off, the field itself
  float cov = smoothstep(0.5, 0.9, vn2(p*0.55 + 11.)*0.7 + n2*0.25 + n3*0.15);
  float gh = 0., gh2 = 0., kg = 1. - smoothstep(0.2, 0.5, pw*9.1);
  float grain = max(hoar(mat2(0.878, 0.479, -0.479, 0.878)*p*5.3, cov, pw*5.3, gh), hoar(mat2(0.622, -0.783, 0.783, 0.622)*p*9.1 + 7., cov, pw*9.1, gh2));
  gh = max(gh, gh2);
  float frost = mix(cov*(0.2 + 0.3*smoothstep(0.4, 0.6, n3)), grain, kg);
  alb = mix(alb, vec3(0.44, 0.55, 0.66)*(0.75 + 0.5*gh*kg), frost*0.72);
  float bank = smoothstep(0.1, 0.34, vBank + 0.22*(n3 - 0.5) + 0.14*(n6 - 0.5));
  // (the bank is slumped lumps of snow with dark creases between them, never one pale sheet)
  float lump = smoothstep(0.18, 0.5, vn2(p*0.75 + 11.))*(0.6 + 0.4*smoothstep(0.2, 0.55, mix(0.5, vn2(p*2.3 + 3.), 1. - smoothstep(0.2, 0.5, pw*2.3))));
  alb = mix(alb, vec3(0.50, 0.61, 0.73)*(0.78 + 0.26*n4 + 0.2*n7)*(0.42 + 0.75*lump), bank);
  float kSt = 1. - smoothstep(20., 40., length(p));                     // round the strike only: a little darker and bluer, so that the pool of daylight is the brightest thing on the floor
  alb *= mix(vec3(1.), vec3(0.45, 0.58, 0.8), kSt);
  vec3 N = normalize(vN + vec3(n3 - 0.5, 0., n5 - 0.5)*0.8*far + vec3(n7 - 0.5, 0., n8 - 0.5)*1.1);
  vec3 L = rfLight(p); float ao = mix(0.25, 1., smoothstep(0.3, 4.5, vG));
  float sh = 1.;
  for (int i = 0; i < 10; i++) { vec2 d = p - uBlob[i].xy; sh *= 1. - uBlob[i].w*exp(-dot(d,d)/max(uBlob[i].z*uBlob[i].z, 0.01)); }
  // runnels of meltwater by the fox's room and the meltwater (vWet): narrow winding threads no finer than a pixel, the litter soaked dark
  // under them, with a glint that runs along them
  float runK = 0.;
  if (vWet > 0.004) {
    float rw = 0.02 + 0.22*pw, ra = abs(vn2(p*0.19 + 21.) - 0.5);
    runK = vWet*(1. - smoothstep(rw*0.5, rw*1.2, ra))*(1. - bank)*(1. - smoothstep(0.25, 0.6, pw));
    alb *= 1. - 0.5*vWet*(1. - smoothstep(rw, rw*3.5, ra))*(1. - bank);
  }
  // the stream's margin (vStr: where the meltwater runs): the bank goes down into the water through a band of soaked ground, dark
  // and smooth, its edge ragged, three quarters of a metre up from the water's level, and a lace of thin shelf ice lies along the
  // waterline itself; so the floor has no hard edge at the stream. hW: metres above the water's level
  float hW = vW.y - uWaterY + 0.3*(n3 - 0.5) + 0.16*(n4 - 0.5), wetM = vStr*(1. - smoothstep(0.1, 0.8, hW));
  float lace = vStr*(1. - smoothstep(0.05, 0.2, abs(vW.y - uWaterY - 0.05 + 0.14*(n3 - 0.5))))*(0.45 + 0.55*n6);
  alb = mix(alb, vec3(0.05, 0.047, 0.04)*(0.7 + 0.6*n4), 0.8*wetM);
  N = normalize(mix(N, normalize(vN), 0.7*wetM));
  vec3 col = shade(alb, L*ao*sh, dayAt(vW)*sh, 0.45 + 0.4*N.y, mix(0.6, 0.28, kSt));
  vec3 V = normalize(cameraPosition - vW); float fres = pow(clamp(1. - dot(N, V), 0., 1.), 4.);
  col += L*ao*sh*wetM*(0.05 + 1.1*fres);                                                    // the soaked ground shines back the roof
  col = mix(col, vec3(0.52, 0.64, 0.74)*(0.6 + 0.5*n2)*(L*1.5 + uShadowCol*2. + dayAt(vW)), 0.8*lace);
  col += L*ao*sh*runK*(0.22 + 0.9*fres + 0.7*pow(max(sin(dot(p, vec2(3.1, 2.3)) - uTime*2.6), 0.), 6.));
  float tw = step(0.7, gh)*pow(max(sin(gh*40. + dot(V.xz, vec2(7., 5.))*4. + uTime), 0.), 12.);
  col += L*ao*sh*(grain*tw*2.2*kg + 0.25*fres*frost);                                      // a grain here and there catches the eye
  col += L*ao*sh*uWet*(0.08 + 0.6*fres)*(1. - smoothstep(0.3, 0.55, n1))*(0.8 + 0.2*sin(uTime*2. + n2*20.));   // meltwater film
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,el=`
attribute vec3 aUv; attribute vec2 aRnd; attribute vec3 aSide; attribute vec4 aSt;
uniform vec4 uVole;
varying vec3 vW; varying vec3 vN; varying vec3 vS; varying vec3 vL; varying vec3 vD; varying vec3 vUv; varying vec2 vR; varying vec4 vSt;
void main(){
  vec3 p = position;
  float fr = 0.25 + aUv.y*aUv.y;
  vec3 dv = p - uVole.xyz; float wake = uVole.w*exp(-dot(dv, dv)/70.);
  p += normal*(sin(uTime*2.6 + aRnd.x*40. + aUv.y*5.)*0.045 + sin(uTime*13. + aRnd.x*17. + aUv.y*9.)*0.3*wake)*fr*(1. - 0.6*aSt.y);   // a wet blade is heavy
  vW = p; vN = normal; vS = aSide; vUv = aUv; vR = aRnd; vSt = aSt; vL = rfLight(p.xz); vD = dayAt(p);
  vec4 wp = vec4(p, 1.);
  ${ae}
}`,ol=`
uniform vec3 uStraw, uStraw2, uGreenBase;
varying vec3 vW; varying vec3 vN; varying vec3 vS; varying vec3 vL; varying vec3 vD; varying vec3 vUv; varying vec2 vR; varying vec4 vSt;
void main(){
  float x = vUv.x, ax = abs(x), v = vUv.y, dm = vUv.z, h = vR.x, h2 = fract(h*13.7), h3 = fract(h*71.3);
  float fwx = fwidth(x);                                                   // 2 / (width of the blade in pixels)
  float fwd = fwidth(dm);                                                  // metres along the blade to a pixel
  float near = 1. - smoothstep(9., 28., length(cameraPosition - vW));
  float notch = smoothstep(0.62, 0.9, vn2(vec2(dm*1.9 + h*31., h*5.)))*near;
  float fray = smoothstep(0.7, 1., v)*step(0.45, h3)*vn2(vec2(dm*6. + h*70., x*1.3 + h*9.));
  if (ax > 1. - 0.42*notch - 0.75*fray) discard;
  // the blade's state by its place along the way (stateAt): rimed, bleached to a pale warm straw, wet, mossed at the foot; all nought
  // off the way. No state makes the blade darker than it is plain
  float stR = max(vSt.x, 0.), stG = max(-vSt.x, 0.), stW = vSt.y, stM = vSt.z, mk = 0.;
  bool way = stR + stG + stW + stM > 0.;
  // broken short: a ragged end of splinters (as broad as the footprint lets them be drawn)
  if (vSt.w < 0.999 && v > vSt.w - 0.012 - 0.05*abs(fract(x*1.7 + h*9.) - 0.5)*(1. - smoothstep(0.25, 0.7, fwx*1.7))) discard;
  vec3 N0 = normalize(vN), S = normalize(vS + vec3(1e-4, 0., 0.)), V = normalize(cameraPosition - vW);
  float sg = dot(N0, V) < 0. ? -1. : 1.;
  float hs = clamp(x*5., -1., 1.);
  vec3 N = normalize(N0 - S*hs*0.8)*sg;                                    // the keel fold: one half takes the light, the other is in shade
  vec3 alb = mix(uStraw, uStraw2, h);
  alb = mix(alb, vec3(0.62, 0.52, 0.28), step(0.78, h2)*0.8);              // bleached leaves
  alb = mix(alb, vec3(0.17, 0.085, 0.035), step(h2, 0.16)*0.75);           // weathered russet ones
  alb = mix(alb, uGreenBase, (1. - smoothstep(0.0, 0.45, v))*vR.y);
  float fib = vn2(vec2(x*5. + h*30., dm*0.7)), fib2 = vn2(vec2(x*2.2 + h*11., dm*3.1));
  alb *= 0.66 + 0.36*fib + 0.2*fib2;
  alb *= 1. - 0.3*(1. - smoothstep(0.045, 0.11, fwx))*(0.5 + 0.5*sin(x*18.85 + h*40.));   // parallel veins, gone before they can alias
  alb *= 1. - 0.5*(1. - smoothstep(0.02, 0.13, ax));                       // the crease of the keel
  alb *= 1. - 0.5*near*smoothstep(0.74, 0.86, vn2(vec2(x*1.8 + h*50., dm*2.3)));   // mould specks
  alb *= mix(0.45, 1., smoothstep(0., 0.3, v));                            // dark where it roots in the pack
  alb *= 1. - 0.45*step(0.9, N0.y);                                        // trodden litter is darker
  if (way) {
    float lum = dot(alb, vec3(0.3, 0.55, 0.15));
    // wet straw is deeper in colour, toward amber, and as light as it is dry
    { vec3 wetC = alb*vec3(1.2, 0.95, 0.5); alb = mix(alb, wetC*(lum/max(dot(wetC, vec3(0.3, 0.55, 0.15)), 1e-4)), stW); }
    // moss for the first metres up from the root, a velvet of small cushions with a ragged upper edge
    mk = stM*(1. - smoothstep(1.8 + 3.2*h3, 3.6 + 5.*h3, dm + 1.6*(fib2 - 0.5)));
    float cu = vn2(vec2(x*2.6 + h*17., dm*3.4)), cuK = 1. - smoothstep(0.3, 0.8, fwd*3.4);
    alb = mix(alb, mix(vec3(0.045, 0.12, 0.028), vec3(0.20, 0.34, 0.07), mix(0.5, cu, cuK))*(0.75 + 0.5*fib), mk*0.92);
    alb = mix(alb, (lum*0.9 + 0.2)*vec3(1.24, 1.0, 0.56), 0.86*stG);                                        // bleached by wind and sun to a pale warm straw, lighter than the plain blade
    alb = mix(alb, (vec3(lum)*1.1 + 0.07)*vec3(0.86, 0.96, 1.07), 0.5*stR);                                 // pale under its rime
  }
  // rime: broken crystals along both edges, patches on the face, a frosted tip
  float c1 = vn2(vec2(dm*6.5 + h*90., x*2.)), c2 = vn2(vec2(dm*17. + h*33., x*4.));
  float fr = smoothstep(0.55, 0.9, ax)*mix(0.5, smoothstep(0.4, 0.62, c1)*(0.55 + 0.9*c2), near);
  fr += 0.32*smoothstep(0.66, 0.84, vn2(vec2(dm*0.8 + h*20., x*0.6 + h*3.)))*(0.5 + 0.5*c1) + 0.3*smoothstep(0.8, 1., v);
  fr = clamp(fr, 0., 1.);
  float glit = 0.;
  if (way) {
    // rimed: frost stands broad along both edges and in patches on the face; a thin glaze of it only on a wet blade, little on moss
    float c1K = 1. - smoothstep(0.25, 0.7, fwd*6.5);
    float rimed = smoothstep(0.32, 0.8, ax + 0.5*(c1 - 0.5)*c1K) + 0.4*smoothstep(0.46, 0.74, vn2(vec2(dm*1.1 + h*20., x*0.9 + h*3.)));
    fr = clamp(max(fr, stR*min(rimed, 1.)*(0.78 + 0.44*mix(0.5, c2, c1K)))*(1. - 0.65*stW)*(1. - 0.7*mk), 0., 1.);
    // a cold glitter: one crystal to a cell of 14 cm, each turning its face to the eye in its own time; cells smaller than a pixel
    // give their mean instead
    vec2 gq = vec2(dm*7. + h*31., x*2.5 + h*7.), gi = floor(gq), gf = fract(gq) - 0.5;
    float gh = h11(gi.x*17.3 + gi.y*71.7 + h*113.), gK = 1. - smoothstep(0.3, 0.85, fwd*7. + fwx*2.5);
    float gl1 = pow(max(sin(gh*61. + dot(V, vec3(5., 3., 4.))*6.), 0.), 24.)*(1. - smoothstep(0.12, 0.42, length(gf)));
    glit = stR*fr*mix(0.045, gl1*1.9, gK);
  }
  alb = mix(alb, vec3(0.66, 0.76, 0.84), fr*0.78);
  if (way) alb = mix(alb, vec3(0.78, 0.9, 1.), fr*0.45*stR);               // thick rime is whiter
  float kd = 0.42 + 0.22*N.y + 0.34*max(dot(N, V), 0.);
  float lumL = dot(vL, vec3(0.25, 0.55, 0.2));
  float sp = pow(max(dot(N, normalize(V + vec3(0., 0.7, 0.))), 0.), 14.)*(1. - fr)*0.2;      // dry straw has a sheen
  vec3 col = shade(alb, vL, vD, kd, 0.9) + alb*(vL*0.4*(1. - abs(dot(N0, V))) + vec3(1.0, 0.84, 0.56)*(0.10*lumL + 0.01)*(1. + 1.2*max(vSt.y, 0.)));   // straw lets a little light through, wet straw more
  col += (vL + vD)*vec3(1., 0.9, 0.7)*sp;
  float tw = pow(max(sin(c2*37. + dot(V, vec3(5., 3., 4.))*5. + h*20.), 0.), 12.);
  col += (vL*1.2 + vD*2.)*tw*fr*near*0.8;                                  // crystals catching the eye
  if (way) {
    col += (vL*1.1 + vD*2.)*vec3(0.84, 0.96, 1.1)*glit;
    // a wet blade shines: a narrow light off its face and the roof's light along its edge-on parts
    col += stW*vL*vec3(0.9, 1., 1.05)*(0.55*pow(max(dot(N, normalize(V + vec3(0., 0.7, 0.))), 0.), 44.) + 0.2*pow(max(1. - abs(dot(N0, V)), 0.), 3.));
  }
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,al=`
attribute vec2 aUv; attribute vec2 aRnd;
varying vec3 vW; varying vec3 vL; varying vec3 vD; varying vec2 vUv; varying vec2 vR;
void main(){
  vec3 p = position;
  p += normal*sin(uTime*3.1 + aRnd.x*50.)*0.035*aUv.y;
  vW = p; vUv = aUv; vR = aRnd; vL = rfLight(p.xz); vD = dayAt(p);
  vec4 wp = vec4(p, 1.);
  ${ae}
}`,sl=`
varying vec3 vW; varying vec3 vL; varying vec3 vD; varying vec2 vUv; varying vec2 vR;
void main(){
  float x = vUv.x*2. - 1., ax = abs(x), v = vUv.y, pxv = fwidth(vUv.y);
  if (vR.y > 0.5) {
    // on a wet blade: a bead of water hanging at the blade's edge instead of a feather. vR.y - 1 is the quad's half breadth over its
    // length, so the bead is round; it is widened by half the pixel's footprint and left out when it would be under half a pixel
    float a = vR.y - 1., r = min(0.13, 0.6*a)*(0.82 + 0.18*sin(uTime*0.9 + vR.x*40.));
    vec2 q = vec2(x*a, v - r)/(r + 0.5*pxv); float dd = dot(q, q);
    if (dd > 1. || pxv > 2.*r) discard;
    // water: dark where we look through it, the roof's light gathered on its far side, a thin bright rim and one point of light
    vec2 qh = q - vec2(-0.34, -0.3);
    float hl = exp(-dot(qh, qh)*24.), low = smoothstep(0., 0.95, q.y)*(1. - dd*dd*dd);
    vec3 Lb = mix(vL, vec3(dot(vL, vec3(0.25, 0.55, 0.2))), 0.5);
    vec3 colB = vL*(0.03 + 0.5*low*low) + Lb*(0.4*dd*dd*dd*dd + 2.4*hl) + vD*(0.3 + 2.5*hl) + uShadowCol*0.12;
    gl_FragColor = vec4(colB*min(r/(r + 0.5*pxv) + 0.25, 1.), 1.);
    ${ye}
    return;
  }
  float w = sin(3.14159*pow(clamp(v, 0., 1.), 0.65))*0.92;
  float cb = v*13. - ax*3.4 + vR.x*7.;
  float barb = mix(smoothstep(0.1, 0.45, abs(fract(cb) - 0.5)*2.), 0.62, smoothstep(0.18, 0.4, fwidth(cb)));   // too fine to draw: a plain feather
  float m = step(ax, w*(0.3 + 0.7*barb)) + step(ax, 0.07)*step(v, 0.97);
  if (m < 0.5) discard;
  vec3 V = normalize(cameraPosition - vW);
  float tw = pow(max(sin(vR.x*60. + dot(V, vec3(5., 3., 4.))*4. + floor(v*13.)*2.1), 0.), 10.);
  vec3 alb = vec3(0.62, 0.72, 0.80)*(0.7 + 0.3*barb);
  vec3 Lw = mix(vL, vec3(dot(vL, vec3(0.25, 0.55, 0.2))), 0.55);
  vec3 col = alb*(Lw*(0.8 + 1.4*tw) + uShadowCol*0.6 + vD*(1. + 2.*tw));
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,nl=`
attribute vec2 aUv; attribute vec2 aRnd;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vD; varying vec2 vUv; varying vec2 vR;
void main(){
  vec3 p = position;
  p += normal*(sin(uTime*2.3 + aRnd.x*50. + aUv.y*4.)*0.03 + sin(uTime*5.7 + aRnd.x*23.)*0.012)*aUv.y*aUv.y;
  vW = p; vN = normal; vUv = aUv; vR = aRnd; vL = rfLight(p.xz); vD = dayAt(p);
  vec4 wp = vec4(p, 1.);
  ${ae}
}`,rl=`
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vD; varying vec2 vUv; varying vec2 vR;
void main(){
  float x = vUv.x*2. - 1., ax = abs(x), v = clamp(vUv.y, 0., 1.), h = vR.x, h2 = fract(h*17.31);
  float cb = v*42. - ax*9. + h*7., ct = v*13. - ax*2.6 + h2*5.;
  float fb = fwidth(cb), ft = fwidth(ct);                                       // how many barbs, how many teeth, to a pixel
  float kb = smoothstep(0.16, 0.36, fb), kt = smoothstep(0.2, 0.42, ft);       // 1: too fine to draw, so a plain blade
  float w = pow(clamp(v, 0., 1.), 0.55)*pow(clamp(1. - v, 0., 1.), 0.8)*2.25;                                 // a lance, broadest two fifths of the way up
  float tooth = abs(fract(ct) - 0.5)*2.;
  float wt = w*mix(0.5 + 0.5*tooth, 0.8, kt);
  float needle = 1. - smoothstep(0.3 - fb, 0.3 + fb, abs(fract(cb) - 0.5));     // one barb, soft over a pixel
  float solid = mix(0.34 + 0.66*needle, 0.9, kb);                                // the barbs stand apart toward the edge; the shaft side is whole
  if (ax > wt*max(solid, step(ax, 0.3*wt)) && ax > 0.05*(1. - v)) discard;
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN);
  float ndv = abs(dot(N, V)), e = clamp(ax/max(wt, 0.03), 0., 1.);
  // ice: the roof's light comes through it, most where it is thinnest (the barbs and the tip); the shaft is a darker line
  vec3 Lw = mix(vL, vec3(dot(vL, vec3(0.25, 0.55, 0.2))), 0.6);
  float thin = 0.5 + 0.55*e*e + 0.3*v;
  float tone = (0.8 + 0.45*h2)*(0.66 + 0.34*ndv)*mix(0.45, 1., smoothstep(0.0, 0.3, v));
  tone *= 1. - 0.3*(1. - smoothstep(0.03, 0.1, ax))*(1. - kb);
  tone *= mix(0.86 + 0.28*needle, 1., kb);
  float tw = pow(max(sin(h*60. + dot(V, vec3(5., 3., 4.))*4. + floor(cb)*2.1 + uTime*0.6), 0.), 14.)*(1. - 0.6*kb);
  vec3 col = vec3(0.62, 0.74, 0.82)*(Lw*thin*tone + uShadowCol*0.7 + vD*(0.7 + 0.5*e)*tone);
  col += (Lw*1.3 + vD*2. + vec3(0.02, 0.05, 0.06))*tw*(0.35 + 0.65*e);
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,il=`
attribute float aSeed; attribute vec3 color;
varying vec3 vW; varying vec3 vL; varying vec3 vD; varying float vS; varying vec3 vC; varying vec3 vO; varying vec3 vNs;
void main(){
  vC = color; vO = position; vNs = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*normal + vec3(0., 1e-5, 0.));
  vec4 wp = modelMatrix*instanceMatrix*vec4(position, 1.);
  vec3 o = (modelMatrix*instanceMatrix*vec4(0., 0., 0., 1.)).xyz;
  float a = sin(uTime*2.3 + aSeed*40.)*0.04 + sin(uTime*5.1 + aSeed*17.)*0.02;
  vec3 r = wp.xyz - o; wp.xyz = o + vec3(r.x + r.y*a, r.y, r.z + r.y*a*0.7);
  vW = wp.xyz; vS = aSeed; vL = rfLight(wp.xz); vD = dayAt(wp.xyz);
  ${ae}
}`,ll=`
uniform vec3 uSparkCol; uniform float uSpark;
varying vec3 vW; varying vec3 vL; varying vec3 vD; varying float vS; varying vec3 vC; varying vec3 vO; varying vec3 vNs;
void main(){
  vec3 c = cross(dFdx(vW), dFdy(vW)); float l = length(c); vec3 F = l > 1e-12 ? c/l : vec3(0., 1., 0.);
  vec3 V = normalize(cameraPosition - vW); if (dot(F, V) < 0.) F = -F;
  vec3 Ns = normalize(vNs); if (dot(Ns, V) < 0.) Ns = -Ns;
  vec3 Nm = normalize(mix(F, Ns, 0.45));                                                // a facet is not one flat tone: it rounds a little toward its edges
  float fres = pow(clamp(1. - dot(Nm, V), 0., 1.), 2.);
  float rim = vC.r, inner = vC.g*(1. - vC.r);
  // stepped growth: the wall is a stair of treads, each lighter toward its lip, with a dark riser under it; gone before it can alias
  float fw = fwidth(vO.y)*17., kf = max(smoothstep(0.3, 0.8, fw), step(1.5, vS));        // (an icicle, seed over 1, is smooth)
  float stp = fract(vO.y*17. + vS*3.);
  float band = mix((0.74 + 0.3*stp)*(1. - 0.3*smoothstep(0.86, 0.97, stp)), 0.88, kf);
  float lip = smoothstep(0.62, 0.8, stp)*(1. - smoothstep(0.84, 0.9, stp))*(1. - kf);
  float ph = dot(F, vec3(17., 31., 23.)) + vS*6.283 + dot(V, vec3(5., 3., 4.))*3. + uTime*0.35;
  float g = pow(max(sin(ph), 0.), 22.);
  float lum = dot(vL, vec3(0.25, 0.55, 0.2));
  // thin glassy walls: the roof's light comes through them, most where a wall is seen edge on; the hollow is in its own shade
  vec3 col = vL*vec3(0.78, 0.95, 1.)*(0.14 + 0.8*fres + 0.22*max(-Nm.y, 0.))*band*(1. - 0.78*inner) + uShadowCol*mix(0.6, 1.1, inner);
  col += vL*vec3(0.6, 1.0, 0.98)*(rim*(0.6 + 0.9*fres) + lip*0.22*(1. - inner));          // the rim and the lip of every step catch the turquoise
  col += vD*(0.5 + 3.*g)*(1. - 0.5*inner) + (mix(vL, vec3(lum), 0.6)*2.6*uSpark + uSparkCol*lum)*g*(1. - 0.7*inner);
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,cl=`
attribute vec4 aA; attribute vec3 color;
uniform vec4 uVole;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying vec3 vD; varying vec4 vA; varying vec3 vO;
void main(){
  vec4 wp = vec4(position, 1.); vec3 n = normal; float ph = aA.w*20.;
  #ifdef USE_INSTANCING
    wp = instanceMatrix*wp; n = mat3(instanceMatrix)*n; ph = dot(instanceMatrix[3].xz, vec2(0.7, 1.3));
  #endif
  wp = modelMatrix*wp;
  vec2 dv = wp.xz - uVole.xz; float wake = uVole.w*exp(-dot(dv, dv)/70.);
  float b = aA.y;
  wp.x += b*(sin(uTime*1.3 + ph)*0.06 + sin(uTime*11. + ph)*0.5*wake);
  wp.z += b*(cos(uTime*1.1 + ph*1.7)*0.06 + cos(uTime*9. + ph)*0.4*wake);
  vW = wp.xyz; vO = position; vN = normalize(n + vec3(0., 1e-5, 0.)); vC = color; vA = aA; vL = rfLight(wp.xz); vD = dayAt(wp.xyz);
  ${ae}
}`,hl=`
uniform vec2 uBirch;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying vec3 vD; varying vec4 vA; varying vec3 vO;
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW); if (dot(N, V) < 0.) N = -N;
  float pw = length(fwidth(vW)), fwAz = fwidth(vA.z);                               // a pixel's width here in metres (taken outside the branches)
  float m = vA.x; vec3 alb = vC; float top = 0.5 + 0.5*N.y, kd = 0.3 + 0.7*top, vivid = 0.5; vec3 add = vec3(0.);
  float fres = pow(clamp(1. - dot(N, V), 0., 1.), 3.);
  vec3 R = reflect(-V, N); float up = smoothstep(0.1, 0.9, R.y);
  if (m < 0.5) { alb *= 0.75 + 0.5*vn3(vW*3.); }
  else if (m < 1.5) {
    alb *= 0.7 + 0.5*vn2(vO.xz*3. + vO.y);
    alb *= 0.75 + 0.25*smoothstep(0.02, 0.12, abs(vA.z));                         // midrib
    alb = mix(alb, vec3(0.66, 0.78, 0.84), smoothstep(0.72, 1., abs(vA.z) + 0.2*vn2(vO.xz*9.))*0.75);   // rimed edge
    add = vL*(0.14*up + 0.4*fres*up); vivid = 0.4;
  } else if (m < 2.5) {
    float cap = smoothstep(0.55, 0.9, N.y + 0.25*vn3(vW*4.));
    alb = mix(alb, vec3(0.70, 0.79, 0.86), cap*0.85); vivid = mix(0.9, 0.3, cap); kd = 0.5 + 0.5*top;
    add = vL*(0.3*pow(max(R.y, 0.), 8.) + 0.25*fres) + alb*0.05;
  } else if (m < 3.5) {
    // a frond of feather moss: a stem with close pinnae either side, cut out of its ribbon (vA.z along, vA.w across)
    float v = vA.z, ax = abs(vA.w);
    float env = min(pow(max(v, 0.), 0.45)*pow(max(1. - v, 0.), 0.55)*2.1, 1.);
    float pin = abs(fract(v*10. - ax*1.6) - 0.5)*2., kp = smoothstep(0.2, 0.5, fwAz*10.);                // kp 1: the pinnae are too fine to draw, so a plain lance
    if (ax > max(env*mix(0.3 + 0.7*smoothstep(0.15, 0.6, pin), 0.72, kp), 0.12*(1. - v))) discard;
    alb *= (0.55 + 0.65*v)*(0.7 + 0.3*smoothstep(0.0, 0.25, ax))*mix(0.78 + 0.4*pin, 1., kp);
    alb = mix(alb, vec3(0.6, 0.72, 0.78), smoothstep(0.75, 1., v)*0.4); vivid = 0.45; kd = 0.45 + 0.55*top;
    add = alb*vL*0.2*fres;
  } else if (m < 4.5) {
    alb *= 0.7 + 0.5*vn3(vW*5.); kd = 0.42 + 0.58*top; vivid = 0.3; add = alb*vL*0.35*fres;
  } else if (m < 5.5) {
    alb *= 0.8 + 0.4*vn3(vW*12.); add = vL*0.7*pow(clamp(1. - dot(N, V), 0., 1.), 1.6); vivid = 0.3;   // silver fuzz
  } else if (m < 6.5) {
    float fur = vn3(vec3(vW.x*2.6, vW.y*0.22, vW.z*2.6)), len = vn3(vec3(vW.x*8., vW.y*0.7, vW.z*8.) + 4.);
    float lent = smoothstep(0.78, 0.9, vn3(vec3(vW.x*1.5, vW.y*3.5, vW.z*1.5) + 9.));          // lenticels
    alb *= (0.16 + 0.75*smoothstep(0.25, 0.75, fur))*(0.6 + 0.5*len);
    alb = mix(alb, vC*1.5, lent*0.6);
    // rime on the upper side: a granular crust in patches with a sharp edge and the bark's shadow under it. A stem that stands up
    // through the hall into the snow (vA.z: how far up it, 0 at the foot and 1 at the roof; nought on a bough or a root) is rimed
    // all round in patches from a little above its foot, and takes the roof's light along its edge: a pale column with dark bark
    // showing through, never a dark bar
    float fis6 = abs(vn3(vec3(vW.x*3.3, vW.y*0.4, vW.z*3.3) + 2.) - 0.5);
    alb *= 0.3 + 0.7*smoothstep(0.0, 0.06, fis6);
    float rg6 = vn3(vW*19.)*(1. - smoothstep(0.02, 0.09, pw)), rn6 = vn3(vW*0.9 + 31.) - 0.5, rv6 = N.y + 0.3*fur + 0.2*len + 0.5*rn6 - 0.2;
    rv6 = max(rv6, 0.33 + 0.12*smoothstep(0.04, 0.4, vA.z)*step(0.001, vA.z) + 0.3*rn6 + 0.55*(fur - 0.5) + 0.3*(len - 0.5));
    float rc6 = smoothstep(0.4, 0.44, rv6);
    alb *= 1. - 0.55*smoothstep(0.28, 0.4, rv6)*(1. - rc6);
    alb = mix(alb, vec3(0.50, 0.60, 0.68)*(0.6 + 0.5*rg6 + 0.3*len), rc6*0.88);
    // a standing stem is lit by the whole hall's roof round it, not only by the snow right above, which is thick where a stem goes
    // into it: its rime, and its bark the more for being so dark
    add = vL*(0.12 + 0.5*step(0.001, vA.z))*fres + alb*mix(uTurq, uCobalt, 0.5)*uGlow*(0.12 + 0.2*top)*mix(4., 1., rc6)*step(0.001, vA.z); vivid = 0.8;
  } else if (m < 7.5) {
    // birch. vA.z = 0 on the trunk: white paper bark in lapping sheets, thin dark lenticels of every length, a rough black collar at
    // the foot. vA.z = 1 on the roots: russet, fluted (the geometry), cracked into flakes, pale where a flake has gone, mossy low down
    float g1 = vn3(vW*1.7), g2 = vn3(vW*5.3);
    vec2 bd = vW.xz - uBirch; float arc = atan(bd.y, -bd.x)*2.8, hy = vW.y;
    vec3 bark = mix(vec3(0.58, 0.57, 0.54), vec3(0.76, 0.73, 0.68), vn2(vec2(arc*0.5, hy*1.3)));
    bark = mix(bark, vec3(0.66, 0.50, 0.44), smoothstep(0.58, 0.8, vn2(vec2(arc*0.35 + 7., hy*0.7 + 3.)))*0.5);     // pink where the outer sheet has peeled
    bark *= 0.85 + 0.15*vn2(vec2(arc*1.3, hy*13.));
    float sheet = abs(fract(hy*0.8 + 0.4*vn2(vec2(arc*0.6, hy*0.2))) - 0.5);
    bark *= 1. - 0.32*(1. - smoothstep(0.0, 0.035 + pw, sheet));                                                    // the edge of one sheet over the next
    float row = floor(hy/0.5), cx = arc/1.7 + h11(row)*7., id = floor(cx);
    float hA = h21(vec2(id, row)), hB = h21(vec2(id + 3.7, row + 1.3));
    float hl = 0.07 + 0.28*hB*hB, ht = 0.07 + 0.09*hA;
    float ldx = fract(cx) - 0.5 - (hA - 0.5)*0.24, ldy = fract(hy/0.5) - 0.5 - (hB - 0.5)*0.4;
    float lval = abs(ldy)/ht + ldx*ldx/(hl*hl), lw = clamp(pw/(ht*0.5), 0.02, 0.6);
    bark = mix(bark, vec3(0.04, 0.035, 0.03), (1. - smoothstep(1. - lw, 1. + lw, lval))*step(0.22, hA)*0.92);        // lenticels: lens-shaped dashes
    float collar = 1. - smoothstep(3.0, 6.4, hy + 2.2*(vn2(vec2(arc*0.8, 3.)) - 0.5));
    float fis = vn2(vec2(arc*3.2, hy*0.5)), fis2 = vn2(vec2(arc*9., hy*1.6));
    bark = mix(bark, mix(vec3(0.03, 0.028, 0.025), vec3(0.2, 0.18, 0.16), smoothstep(0.35, 0.7, fis*0.7 + fis2*0.3)), collar*0.94);
    float rk = vn3(vW*2.0 + 3.), rk2 = vn3(vW*5.1 + 1.), fib = vn3(vW*vec3(11., 11., 11.));
    float crack = (1. - smoothstep(0.0, 0.03 + pw*0.5, abs(rk - 0.5)))*0.75 + (1. - smoothstep(0.0, 0.035 + pw, abs(rk2 - 0.5)))*0.4;
    vec3 root = vC*(0.55 + 0.6*g1)*(0.8 + 0.3*fib)*(1. - min(crack, 0.85));
    root = mix(root, vec3(0.30, 0.22, 0.14)*(0.8 + 0.3*fib), smoothstep(0.66, 0.71, vn3(vW*2.3 + 8.))*0.55);            // paler wood where a flake has gone
    root = mix(root, vec3(0.13, 0.24, 0.07)*(0.5 + 1.0*g2), smoothstep(0.5, 0.75, vn3(vW*0.8 + 21.) + 0.45*(1. - smoothstep(0.2, 4.5, hy)))*0.85);   // moss in the forks
    alb = mix(bark, root, vA.z);
    // rime on what faces up: on the roots a granular crust in patches, sharp at its edge, with the wood's shadow under it
    float rg7 = vn3(vW*21.)*(1. - smoothstep(0.02, 0.09, pw)), rv7 = N.y + 0.3*g1 + 0.3*g2 - 0.2;
    float rc7 = mix(smoothstep(0.55, 0.85, rv7), smoothstep(0.6, 0.64, rv7 + 0.12*(fib - 0.5)), vA.z);
    alb *= 1. - 0.5*vA.z*smoothstep(0.46, 0.6, rv7)*(1. - rc7);
    alb = mix(alb, vec3(0.56, 0.67, 0.76)*mix(1., 0.5 + 0.5*rg7 + 0.3*g2, vA.z), rc7*mix(0.7*(0.55 + 0.45*step(0.45, fib)), 0.86, vA.z));
    add = vL*0.1*fres*(1. - 0.7*vA.z); vivid = mix(0.85, 0.95, vA.z); kd = 0.34 + 0.66*top;
  } else if (m < 8.5) {
    // granite: speckle, a dark joint or two, map lichen in yellow-green islands, grey and rust crusts, moss at the foot, rime above
    float g1 = vn3(vW*0.33), g2 = vn3(vW*1.5), g3 = vn3(vW*3.1), sp = vn3(vW*9.);
    alb = mix(vec3(0.17, 0.17, 0.19), vec3(0.40, 0.38, 0.37), g1*0.55 + g2*0.45)*(0.72 + 0.56*sp);
    alb = mix(alb, vec3(0.48, 0.37, 0.33), step(0.74, vn3(vW*6.3 + 2.))*0.5);
    alb *= 0.4 + 0.6*smoothstep(0.0, 0.03, abs(vn3(vW*0.42 + 7.) - 0.5));
    float l1 = vn3(vW*0.5 + 11.) + 0.1*(g3 - 0.5), lm = smoothstep(0.57, 0.6, l1);
    alb *= 1. - 0.65*smoothstep(0.535, 0.57, l1)*(1. - lm);
    alb = mix(alb, vec3(0.34, 0.40, 0.12)*(0.65 + 0.6*g3), lm*0.92);
    alb = mix(alb, vec3(0.58, 0.61, 0.58)*(0.8 + 0.3*sp), smoothstep(0.66, 0.7, vn3(vW*1.1 + 51.) + 0.08*(sp - 0.5))*0.8);
    alb = mix(alb, vec3(0.46, 0.24, 0.07), smoothstep(0.71, 0.75, vn3(vW*0.85 + 31.) + 0.06*(g3 - 0.5))*0.8);
    alb = mix(alb, vec3(0.12, 0.22, 0.07)*(0.5 + 1.0*g3), (1. - smoothstep(0.4, 4.2, vW.y + 2.5*g2 - 1.))*0.85);
    alb = mix(alb, vec3(0.46, 0.56, 0.66), smoothstep(0.5, 0.85, N.y + 0.3*g2 - 0.12)*0.6);
    kd = 0.28 + 0.72*top; vivid = 0.85; add = vL*0.05*fres;
  } else if (m < 9.5) {
    // feathers: overlapping scallops in rows, each with a soft shadow under its tip; vA.z is the size of one feather
    float fs = max(vA.z, 0.2), rad = length(vO.xy) + 1e-3;
    rad = length(vO.xz) + 1e-3;
    vec2 fq = vec2(atan(vO.x, vO.z + 1e-4)*rad/fs*0.55, vO.y/fs + 0.3*vn2(vO.xz*0.25)); fq.x += 0.5*floor(fq.y);
    vec2 ff = fract(fq) - vec2(0.5, 0.); float tipD = ff.y - 2.2*ff.x*ff.x;
    float edge = smoothstep(0.08, 0.0, tipD) + 0.5*smoothstep(0.3, 0.0, tipD);
    float barb = 0.5 + 0.5*sin((ff.x*9. + ff.y*5.)*6.2832/ (1. + 3.*fwidth(fq.x)));
    alb *= (1. - 0.24*edge)*(0.9 + 0.1*barb*(1. - smoothstep(0.02, 0.2, fwidth(fq.x))))*(0.9 + 0.2*h21(floor(fq)));
    kd = 0.2 + 0.8*top; vivid = 0.75; add = alb*(vL + vD)*(0.22 + 0.5*fres);
  } else if (m < 10.5) {
    // fallen snow: clods and powder
    float g1 = vn3(vW*1.3), g2 = vn3(vW*4.7);
    alb = vec3(0.58, 0.68, 0.78)*(0.72 + 0.3*g1 + 0.2*g2); kd = 0.3 + 0.7*top; vivid = 0.5; add = alb*(vL*0.25 + vD*0.3)*fres;
  } else {
    // a curl of birch paper (vA.z across -1..1, vA.w along 0..1, vC three hashes): white outside, pink-tan within, torn at its edges
    float ax = abs(vA.z), v = vA.w;
    float rag = vn2(vec2(v*5. + vC.r*40., vA.z*2. + vC.g*9.)), tear = vn2(vec2(vA.z*3.5 + vC.g*30., 3.));
    if (ax > 1. - 0.34*rag*smoothstep(0.05, 0.5, v) || v > 1. - 0.3*tear) discard;
    float inner = gl_FrontFacing ? 0. : 1.;
    vec3 outC = vec3(0.74, 0.72, 0.67)*(0.84 + 0.16*vn2(vec2(v*3., vA.z*13.)));
    outC = mix(outC, vec3(0.05, 0.045, 0.04), (1. - smoothstep(0.035, 0.06 + fwAz, abs(vA.z - 0.6*(vC.b - 0.5))))*step(0.15, v)*step(v, 0.25 + 0.5*vC.r)*0.85);
    vec3 inC = mix(vec3(0.62, 0.38, 0.27), vec3(0.72, 0.55, 0.40), vn2(vec2(v*8., vA.z*4. + vC.r*5.)));
    alb = mix(outC, inC, inner); kd = 0.3 + 0.7*top; vivid = 0.9; add = alb*vL*0.3;                                    // the light comes through the paper
  }
  vec3 col = shade(alb, vL, vD, kd, vivid) + add;
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,fl=`
attribute vec4 aA;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vD; varying vec4 vA;
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.);
  vW = wp.xyz; vN = normalize(normal + vec3(0., 1e-5, 0.)); vA = aA; vL = rfLight(wp.xz); vD = dayAt(wp.xyz);
  ${ae}
}`,vl=`
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vD; varying vec4 vA;
vec3 h33(vec3 p){ return fract(sin(vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6))))*43758.5453); }
// value noise with no lattice to be seen: two lattices, each turned off the world's axes, the second finer
float rn3(vec3 p){
  vec3 a = vec3(0.80*p.y + 0.60*p.z, -0.80*p.x + 0.36*p.y - 0.48*p.z, -0.60*p.x - 0.48*p.y + 0.64*p.z);
  vec3 b = vec3(0.80*a.y + 0.60*a.z, -0.80*a.x + 0.36*a.y - 0.48*a.z, -0.60*a.x - 0.48*a.y + 0.64*a.z)*1.31 + 3.7;
  return 0.5*(vn3(a) + vn3(b));
}
// the nearest of the points scattered one to a cell, among the eight cells about p: xyz from that point to p (in cells), w its number
vec4 near3(vec3 p){
  vec3 b = floor(p - 0.5), f = p - b; vec4 best = vec4(0.); float bd = 99.;
  for (int i = 0; i < 8; i++) {
    float fi = float(i); vec3 o = vec3(mod(fi, 2.), mod(floor(fi*0.5), 2.), floor(fi*0.25));
    vec3 hh = h33(b + o), d = f - o - 0.25 - 0.5*hh; float dd = dot(d, d);
    if (dd < bd) { bd = dd; best = vec4(d, fract(hh.x*7.13 + hh.y*3.71)); }
  }
  return best;
}
void main(){
  vec3 N0 = normalize(vN); vec3 V = normalize(cameraPosition - vW); if (dot(N0, V) < 0.) N0 = -N0;
  float pw = length(fwidth(vW));                                                    // a pixel's footprint on the stone, metres
  float fine = 1. - smoothstep(0.015, 0.07, pw), mid = 1. - smoothstep(0.07, 0.35, pw);
  float snowK = step(9., vA.x), size = max(vA.y, 0.4);
  vec3 q = vW + vec3(vA.z, vA.z*0.37, vA.z*0.71);
  // (the two finest grains go to their mean before a pixel is half their wavelength)
  float g1 = vn3(q*0.33), g2 = rn3(q*1.5), g3 = rn3(q*3.1), sp = mix(0.5, rn3(q*9.), 1. - smoothstep(0.02, 0.06, pw)), gr = mix(0.5, rn3(q*23.), 1. - smoothstep(0.008, 0.022, pw));
  // joints, hair cracks and areoles: the lines where a field crosses its middle (fc, fa: that field's change across one pixel)
  float nj = vn3(q*0.42 + 7.), nc = rn3(q*1.1 + 13.), na = rn3(q*7.3 + 3.), fj = fwidth(nj), fc = fwidth(nc), fa = fwidth(na);
  float j1 = abs(nj - 0.5), j2 = abs(nc - 0.5);
  float crack = 0.5*(1. - smoothstep(0.003 + 0.5*fc, 0.008 + 1.5*fc, j2))*(1. - smoothstep(0.06, 0.2, fc))*smoothstep(0.47, 0.6, g2);
  float joint = max(1. - smoothstep(0.0, 0.035, j1), crack);
  float l1 = 0.72*vn3(q*0.5 + 11.) + 0.28*rn3(q*2.3 + 17.) + 0.1*(g3 - 0.5), lm = smoothstep(0.57, 0.6, l1), fl = fwidth(l1);
  float areole = (1. - smoothstep(0.5*fa, 0.04 + 1.5*fa, abs(na - 0.5)))*(1. - smoothstep(0.1, 0.3, fa));
  // What the height field may carry. Its slope is taken across the screen, where it is one value for each block of two pixels by
  // two: a bump narrower than some four pixels would show as a grid of such blocks. So each grain goes out of the height before a
  // pixel is a quarter of its wavelength (k3, kS, kG), an edge in it is at least three pixels wide (jointH, lmH, the rosettes'
  // e), and the hair cracks and areoles, which are a pixel wide, are in the colour alone
  float k3 = 1. - smoothstep(0.04, 0.09, pw), kS = 1. - smoothstep(0.014, 0.03, pw), kG = 1. - smoothstep(0.005, 0.012, pw);
  float jointH = 1. - smoothstep(0.0, 0.035 + 3.*fj, j1), lmH = smoothstep(0.57 - 1.5*fl, 0.6 + 1.5*fl, l1);
  // lichen rosettes of two sizes (2.4 m and 0.9 m apart): grey-green ones (crust) and orange ones (rust), each with five to eight
  // lobes round its edge, a furrow between two lobes and a margin (rimK)
  vec3 t1 = normalize(cross(N0, vec3(0.31, 0.95, 0.08)) + 1e-4), t2 = cross(N0, t1);
  float crust = 0., rust = 0., rimK = 0., furrow = 0.;
  for (int i = 0; i < 2; i++) {
    float sc = i == 0 ? 0.42 : 1.15; vec4 ro = near3(q*sc + (i == 0 ? 51. : 87.)); vec3 d = ro.xyz/sc; float hR = ro.w;
    // (measured across the face from the point's foot on it; a point that lies more than a quarter of a cell off the face grows nothing)
    vec3 dt = d - N0*dot(d, N0); float off = abs(dot(d, N0))*sc;
    float aX = dot(dt, t1), aY = dot(dt, t2);                                     // (at a rosette's exact middle both are nought: the angle is nought there)
    float r0 = (0.2 + 0.2*fract(hR*7.3))/sc, th = atan(aY, aX + step(abs(aX) + abs(aY), 0.)*1e-6), n1 = 5. + floor(fract(hR*13.7)*4.), ph = sin(th*n1 + hR*40.);
    float rim = length(dt)/(r0*(1. + 0.13*ph + 0.07*sin(th*(2.*n1 + 3.) + hR*70.) + 0.2*(g3 - 0.5))), e = max(2.5*pw/r0, 0.03);
    float kR = 1. - smoothstep(0.04, 0.1, pw/r0);                                 // its furrows and its margin: only while it is 20 pixels across and more
    float ins = (1. - smoothstep(1. - e, 1. + e, rim))*step(i == 0 ? 0.25 : 0.5, hR)*(1. - smoothstep(0.2, 0.28, off)), orange = step(0.7, fract(hR*3.1));
    crust = max(crust, ins*(1. - orange)); rust = max(rust, ins*orange); rimK = max(rimK, ins*kR*smoothstep(0.55, 0.95, rim));
    furrow = max(furrow, ins*kR*smoothstep(0.5, 0.95, rim)*(1. - smoothstep(-0.99, -0.86, ph)));
  }
  float capv = N0.y + 0.6*(g2 - 0.5) + 0.4*(g3 - 0.5) - 0.12*jointH;
  float cap = max(smoothstep(0.74, 0.78, capv), snowK);
  float under = smoothstep(0.58, 0.74, capv)*(1. - cap);
  float clod = 0.5, clod2 = 0.5;
  if (snowK > 0.5) { clod = abs(vn3(q*2.3 + 5.) - 0.5); clod2 = abs(vn3(q*5.9 + 9.) - 0.5); }
  // crystals: laths of feldspar and flakes of mica, each lying its own way (kF, kM: how much of each a pixel can still show)
  vec4 fe = near3(q*5. + 11.), mi = near3(q*14. + 4.);
  vec3 aF = normalize(fract(fe.w*vec3(5.3, 11.7, 17.9)) - 0.5 + 1e-3), aM = normalize(fract(mi.w*vec3(7.1, 13.3, 19.7)) - 0.5 + 1e-3);
  float eF = max(pw*5., 1e-6), kF = 1. - smoothstep(0.2, 0.55, eF), dF = sqrt(dot(fe.xyz, fe.xyz) + 3.*dot(fe.xyz, aF)*dot(fe.xyz, aF)), rF = 0.2 + 0.2*fe.w;
  float feld = mix(0.16, (1. - smoothstep(rF - eF, rF + eF, dF))*step(0.3, fe.w), kF);
  // and the large crystals of the granite, 0.5 m apart (in the height they are low cones, so their edges are never a pixel sharp)
  vec4 ph2 = near3(q*2.1 + 31.); vec3 aP = normalize(fract(ph2.w*vec3(3.7, 9.1, 15.3)) - 0.5 + 1e-3);
  float eP = max(pw*2.1, 1e-6), dP = sqrt(dot(ph2.xyz, ph2.xyz) + 4.*dot(ph2.xyz, aP)*dot(ph2.xyz, aP)), rP = 0.2 + 0.22*ph2.w;
  float phen = (1. - smoothstep(rP - eP, rP + eP, dP))*step(0.35, ph2.w)*(1. - smoothstep(0.25, 0.6, eP)), phenH = max(1. - dP/rP, 0.)*step(0.35, ph2.w)*(1. - smoothstep(0.03, 0.07, eP));
  float eM = max(pw*14., 1e-6), kM = 1. - smoothstep(0.2, 0.55, eM), dM = sqrt(dot(mi.xyz, mi.xyz) + 5.*dot(mi.xyz, aM)*dot(mi.xyz, aM)), rM = 0.16 + 0.18*mi.w;
  float mica = mix(0.08, (1. - smoothstep(rM - eM, rM + eM, dM))*step(0.45, mi.w), kM);
  float hRock = 0.07*g3*k3 + 0.05*sp*kS + 0.016*gr*kG + 0.02*phenH - 0.12*jointH + (0.05*lmH + (0.045*crust + 0.03*rust)*(1. + 0.5*rimK - 0.6*furrow))*(0.7 + 0.6*mix(0.5, sp, kS));
  float hSnow = 0.17 + 0.07*g3*k3 + 0.03*sp*kS + 0.016*gr*kG + snowK*(0.5*min(clod, 0.16) + 0.2*min(clod2, 0.1)*mid);
  float h = mix(hRock, hSnow, cap);
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); float dhx = dFdx(h), dhy = dFdy(h);
  vec3 r1 = cross(dpy, N0), r2 = cross(N0, dpx); float det = dot(dpx, r1);
  vec3 N = normalize(abs(det)*N0 - sign(det)*(dhx*r1 + dhy*r2)*2.6 + N0*1e-6);
  float top = 0.5 + 0.5*N.y, yb = (vW.y + 0.12)/size;
  vec3 alb = mix(vec3(0.10, 0.10, 0.12), vec3(0.30, 0.28, 0.27), g1*0.55 + g2*0.45)*(0.45 + 1.1*sp);
  alb = mix(alb, vec3(0.46, 0.35, 0.31)*(0.8 + 0.5*fract(fe.w*9.1)), 0.65*feld);
  alb = mix(alb, vec3(0.50, 0.40, 0.36)*(0.8 + 0.4*fract(ph2.w*9.1)), 0.6*phen);
  alb = mix(alb, vec3(0.5, 0.5, 0.48), smoothstep(0.58, 0.7, gr)*0.45);                                     // quartz, glassy grey
  alb = mix(alb, vec3(0.03), 0.65*mica);
  alb *= 1. - 0.78*joint;
  alb *= 1. - 0.6*smoothstep(0.535, 0.57, l1)*(1. - lm);
  alb = mix(alb, vec3(0.30, 0.36, 0.10)*(0.5 + 0.9*g3)*(0.75 + 0.5*sp), lm*0.95);
  alb = mix(alb, vec3(0.44, 0.47, 0.44)*(0.6 + 0.7*sp)*(1. + 0.3*rimK), crust*0.85);
  alb = mix(alb, vec3(0.46, 0.24, 0.07)*(0.6 + 0.7*sp)*(1. + 0.3*rimK), rust*0.8);
  alb *= (1. - 0.4*furrow)*(1. - 0.4*areole*max(lm, max(crust, rust)));
  alb = mix(alb, vec3(0.10, 0.20, 0.06)*(0.5 + 1.0*g3), (1. - smoothstep(0.12, 0.7, yb + 0.5*(g2 - 0.5)))*0.85);
  alb *= 0.4 + 0.6*smoothstep(0.0, 0.22, yb);
  vec3 snow = vec3(0.60, 0.70, 0.80)*(0.76 + 0.2*g2 + 0.14*sp)*(0.84 + 0.3*gr*fine);
  snow *= 1. - snowK*(0.42*(1. - smoothstep(0.0, 0.05, clod)) + 0.25*(1. - smoothstep(0.0, 0.04, clod2))*mid);
  alb = mix(alb, snow, cap);
  alb *= 1. - 0.62*under*(1. - snowK);
  float fres = pow(clamp(1. - dot(N, V), 0., 1.), 3.);
  float glint = step(0.8, mi.w)*(1. - smoothstep(0.1, 0.2 + eM, length(mi.xyz)))*fine*cap;                 // a crystal of the cap catching the light
  vec3 add = vL*(0.05*fres + 0.5*glint) + alb*(vL*0.2 + vD*0.25)*fres*cap;
  vec3 col = shade(alb, vL, vD, 0.12 + 0.88*top*top*1.3, mix(0.85, 0.5, cap)) + add;
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,ul=`
attribute vec2 aUv; attribute vec2 aRnd;
varying vec3 vW; varying vec3 vL; varying vec3 vD; varying vec2 vUv; varying vec2 vR;
void main(){
  vec3 p = position;
  if (aRnd.y > 3.5) p.y += 0.05*sin(uTime*3.1 + aRnd.x*50.)*(0.5 + 0.5*aUv.x);       // down stirs in the draught (the kinds are listed at LEAF_FS)
  vW = p; vUv = aUv; vR = aRnd; vL = rfLight(p.xz); vD = dayAt(p); vec4 wp = vec4(p, 1.); ${ae} }`,dl=`
varying vec3 vW; varying vec3 vL; varying vec3 vD; varying vec2 vUv; varying vec2 vR;
void main(){
  vec2 q = vUv; float seed = step(0.75, vR.y);
  float fq = max(fwidth(q.x), fwidth(q.y));
  if (vR.y > 3.5) {
    float h = vR.x, xx = clamp(q.x*0.5 + 0.5, 0., 1.);
    float w = 0.62*sin(3.14159*pow(xx, 0.6)), ay = abs(q.y), cb = q.x*9. - ay*5. + h*7.;
    float wisp = mix(smoothstep(0.08, 0.5, abs(fract(cb) - 0.5)*2.), 0.6, smoothstep(0.2, 0.5, fq*9.));
    if (ay > max(w*(0.25 + 0.75*wisp), 0.05*step(q.x, 0.9))) discard;
    vec3 alb = vec3(0.70, 0.75, 0.80)*(0.78 + 0.22*wisp)*(1. - 0.25*(1. - smoothstep(0.0, 0.08, ay)));
    gl_FragColor = vec4(shade(alb, vL, vD, 0.9, 0.85) + alb*vL*0.15, 1.);
    ${ye}
    return;
  }
  // birch leaf: ovate, pointed, doubly toothed; q.x runs base (-1) to tip (+1). Seeds are small two-winged ovals.
  float xx = clamp(q.x*0.5 + 0.5, 0., 1.);
  float w = 0.78*pow(xx, 0.42)*pow(1. - xx, 0.8)*1.75;
  w *= 1. + 0.07*sin(xx*46. + vR.x*9.) + 0.035*sin(xx*131.);
  w = mix(w, 0.5*sqrt(max(1. - q.x*q.x, 0.))*(0.45 + 0.55*abs(q.x)), seed);
  float d = abs(q.y) - w;
  if (d > 0. || abs(q.x) > 0.98) discard;
  vec3 alb = mix(vec3(0.13, 0.05, 0.02), vec3(0.30, 0.13, 0.045), vR.x);
  alb = mix(alb, vec3(0.36, 0.30, 0.18), seed);
  float vein = (1. - smoothstep(0.0, 0.035, abs(q.y))) + 0.6*(1. - smoothstep(0.0, 0.05, abs(fract(q.x*3.4 - abs(q.y)*2.6) - 0.5) - 0.42));
  alb *= 1. - 0.4*clamp(vein, 0., 1.)*(1. - seed);
  alb *= 0.75 + 0.5*vn2(vW.xz*6.);
  alb = mix(alb, vec3(0.55, 0.65, 0.74), (1. - smoothstep(0.0, 0.16, -d))*0.6 + 0.25*smoothstep(0.55, 0.8, vn2(vW.xz*3. + 9.)));   // frozen rim, rime patches
  vec3 col = shade(alb, vL, vD, 0.8, 0.85);
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,ar=`
attribute vec4 aA; attribute vec3 color;
uniform float uTailDrop, uPhase, uRun, uSit, uStride, uLift, uArch, uLen, uSnout, uHipZ, uHipY, uNeckZ, uWhip, uT0, uDuty, uKick, uFootRot, uBob, uRoll, uArchZ, uLook, uHaunch, uTailUp;
uniform vec4 uAnk; uniform vec2 uFootL; uniform vec2 uAhead;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying vec3 vD; varying vec4 vA; varying vec3 vO; varying vec3 vLa; varying float vTh;
vec3 rotX(vec3 p, vec3 piv, float a){ p -= piv; float c = cos(a), s = sin(a); return vec3(p.x, p.y*c - p.z*s, p.y*s + p.z*c) + piv; }
vec3 rotY(vec3 p, vec3 piv, float a){ p -= piv; float c = cos(a), s = sin(a); return vec3(p.x*c + p.z*s, p.y, p.z*c - p.x*s) + piv; }
float footA;                                                                  // how far this vertex's foot is rolled up on its toes (radians)
vec3 pose(vec3 p){
  float kind = aA.x, zf = clamp(position.z/uLen + 0.5, 0., 1.), tt = uTime + uT0, legK = 0.; footA = 0.;
  if (kind > 0.5 && kind < 1.5) {
    // aA.w: 0 hind leg, 1 hind foot, 2 fore leg, 3 fore foot. A foot in stance is pinned (it moves back at body speed);
    // at the end of the stance it rolls up onto its toes, and it trails sole-up into the swing
    legK = aA.y;
    float f = fract(uPhase/6.28318 + aA.z), st = step(f, uDuty);
    float fs = f/uDuty, fw = clamp((f - uDuty)/(1. - uDuty), 0., 1.), fe = fw*fw*(3. - 2.*fw);
    float fore = step(1.5, aA.w), foot = step(0.5, aA.w - 2.*fore);
    float ang = uFootRot*uRun*mix(1. - smoothstep(0.2, 0.7, fw), smoothstep(0.5, 1., fs), st);
    vec2 piv = mix(uAnk.xy, uAnk.zw, fore); float fl = mix(uFootL.x, uFootL.y, fore);
    if (foot > 0.5) { p = rotX(p, vec3(p.x, piv.x, piv.y), ang); footA = ang; }
    float kb = fw - 0.22;
    float dz = mix(mix(-0.5, 0.5, fe), mix(0.5, -0.5, fs), st)*uStride*uDuty - (1. - st)*uKick*smoothstep(0., 0.12, fw)*exp(-kb*kb/0.03);
    p.z += (dz + fl*(1. - cos(ang)))*aA.y*uRun;
    p.y += ((1. - st)*sin(fw*3.14159)*uLift + fl*sin(ang))*aA.y*uRun;
    p.yz += vec2(0.6, 2.0)*fore*aA.y*uSit;                                   // sitting up, the forepaws come up to the mouth
  } else {
    p.y += uBob*sin(uPhase*2.)*uRun;
    p.x += 0.12*sin(uPhase + zf*5.)*uRun;
    p.y += p.x*uRoll*sin(uPhase)*(1. - zf)*uRun;                              // the haunches rock from foot to foot
    if (uHaunch > 0.) {
      // (the animal we follow) and each thigh works with its own hind foot, on that foot's phase of the stride: forward as the foot
      // comes down, back as it pushes off, up as it swings through
      float fh = 6.28318*(uPhase/6.28318 + (p.x < 0. ? 0. : 0.5)), wq = smoothstep(0.3, 1.4, abs(p.x))*(1. - smoothstep(0.1, 0.44, zf))*uRun*uHaunch;
      p.z += wq*cos(fh); p.y -= 0.55*wq*sin(fh); p.x += sign(p.x)*0.35*wq*cos(fh);
    }
  }
  float arch = uArch*(0.5 + 0.5*sin(uPhase + 0.6))*uRun, az = (zf - uArchZ)/0.2;
  p.y += arch*exp(-az*az)*(1. - legK); p.z += arch*0.55*sin(6.28318*zf);   // the back humps between the leg pairs and the ends draw together; paws stay down
  if (kind > 1.5 && kind < 2.5) { float w = aA.y; p.x += sin(uPhase*1.0 - w*2.5 + tt*2.)*(0.35 + uWhip)*w; p.y += w*w*uWhip*1.6*sin(uPhase + 2.2 - w*2.) - w*w*uTailDrop*uSit;
    if (uTailUp > 0.) p.y += w*uTailUp*(0.6 + 0.4*sin(uPhase*2. - w*2.))*uRun; }      // (the animal we follow) carried up at the run, bobbing with each footfall
  if (kind > 2.5 && kind < 3.5) { float tw = pow(max(sin(tt*1.9 + aA.z*2.3), 0.), 14.); p.z -= aA.y*0.35*tw; p.x += aA.y*0.2*tw*aA.z; p.y += 0.5*uSit; }
  float hw = smoothstep(uNeckZ - 0.06, uNeckZ + 0.1, zf);
  p.x += hw*sin(tt*13.)*uSnout*smoothstep(uNeckZ, 1., zf);                                  // twitching snout
  if (kind > 4.5 && kind < 5.5) p = mix(vec3(0., uHipY*1.3, (uNeckZ - 0.5)*uLen + 1.), p, uSit);
  // sitting up: the trunk shortens and curls up over the haunches, which spread on the ground (a pear, not a leaning tube); the
  // head comes level again on top of it, nodding as it gnaws
  float zN = (uNeckZ - 0.5)*uLen;
  p.z -= 0.32*uSit*max(min(p.z, zN) - uHipZ, 0.);
  p.x *= 1. + 0.2*uSit*(1. - smoothstep(0.15, 0.55, zf));
  p.y = uHipY + (p.y - uHipY)*(1. + 0.3*uSit*smoothstep(0.02, 0.2, zf)*(1. - smoothstep(0.4, 0.66, zf))*step(abs(kind - 2.) , 2.5)*step(0.5, abs(kind - 1.)));
  float nib = uSit*(0.86 + 0.06*sin(tt*9.)) + 0.10*sin(uPhase*2. + 1.)*uRun;
  p = rotX(p, vec3(0., uHipY*1.25, zN - 0.32*uSit*(zN - uHipZ)), nib*hw);
  p = rotX(p, vec3(0., uHipY, uHipZ), -1.08*uSit*smoothstep(0.1, 0.62, zf));
  // a glance back over the shoulder (uLook, radians, to its left when positive): the trunk bends aside from behind the
  // shoulders and the head turns further on the neck, so that from behind we see its cheek, eye, ear and whiskers
  if (abs(uLook) > 0.001) {
    vec3 pb = vec3(0., 0., -0.12*uLen);
    p = rotY(p, pb, uLook*0.25*smoothstep(0.38, uNeckZ, zf));
    p = rotY(p, rotY(vec3(0., 0., zN), pb, uLook*0.25), uLook*0.5*hw);
  }
  return p;
}
void main(){
  vec3 p = pose(position);
  vec4 wp = modelMatrix*vec4(p, 1.);
  float zf = clamp(position.z/uLen + 0.5, 0., 1.);
  vec3 nl = rotY(normal, vec3(0.), uLook*(0.25*smoothstep(0.38, uNeckZ, zf) + 0.5*smoothstep(uNeckZ - 0.06, uNeckZ + 0.1, zf)));
  if (uHaunch > 0.) nl = rotX(nl, vec3(0.), footA);                             // (the animal we follow) a sole that is turned to the eye is lit as it faces
  vec3 n = normalize(mat3(modelMatrix)*nl + vec3(0., 1e-5, 0.));
  n = normalize(mix(n, mat3(modelMatrix)*rotX(normal, vec3(0.), uSit*(0.86*smoothstep(uNeckZ - 0.06, uNeckZ + 0.1, zf) - 1.08*smoothstep(0.1, 0.62, zf))), step(0.01, uSit)));
  vW = wp.xyz; vN = n; vC = color; vA = aA; vO = position; vL = rfLight(wp.xz); vD = dayAt(wp.xyz); vLa = rfLight(wp.xz + uAhead); vTh = rfThick(wp.xz);
  { vec2 dw = wp.xz - uWell.xy; float rw = length(dw)/max(uWell.z, 0.5); vL = max(vL - uDayCol*uWell.w*3.2*(1. - smoothstep(0.75, 1.1, rw)), vec3(0.)); vD = max(vD - uDayCol*uWell.w*0.3*exp(-dot(dw, dw)/650.), vec3(0.)); }
  ${ae}
}`,sr=`
uniform float uRimK, uVivid, uFillK, uGain, uUnder, uFurK, uFurC, uStripe, uHipY, uKnee, uLen, uRimA, uFringe, uSoft, uLemStripe, uHaunch, uSit;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying vec3 vD; varying vec4 vA; varying vec3 vO; varying vec3 vLa; varying float vTh;
void main(){
  float kind = vA.x, isFin = step(3.5, kind)*step(kind, 4.5), isBody = step(kind, 0.5), coat = isFin + isBody, tip = 0.;
  tip = vA.y*isFin;
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW); if (isFin < 0.5 && dot(N, V) < 0.) N = -N;
  // the cards of the soft outline (uFringe): hairs 5 cm apart along a card, raked back on the lengthwise rows; the derivatives are
  // taken here, outside any branch
  float lonF = step(1.5, vA.w), ucF = (vA.z + lonF*vA.y*0.3)/0.055, fwU = fwidth(ucF), awF = clamp(fwU*0.8, 0., 1.);
  vec3 fNF = cross(dFdx(vW), dFdy(vW)); float faceF = abs(dot(fNF/max(length(fNF), 1e-9), V)), silF = 1. - smoothstep(0.3, 0.78, abs(dot(N, V)));
  float dist = length(cameraPosition - vW), nearK = 1. - smoothstep(12., 40., dist);
  // the lie of the coat: streaks that run back along the body and gather at the tail root (th: 0 over the spine, +-pi under the belly)
  float th = atan(vO.x, vO.y - uHipY + 1e-4), rad = length(vec2(vO.x, vO.y - uHipY)), fl = vO.z*0.55 - rad*0.9;
  // (uSoft, the animal we follow: hairs of one width all over, measured round the body in metres, so they do not fan out of the tail root)
  float arcS = th*max(rad, 0.4);
  float st1 = vn2(vec2(mix(th*17., arcS*8., uSoft), fl*mix(3.4, 2.4, uSoft))), st2 = mix(0.5, vn2(vec2(mix(th*41. + 9., arcS*21. + 9., uSoft), fl*mix(7.3, 5.2, uSoft) + 3.)), nearK), clump = vn2(vec2(mix(th*5. + 2., arcS*2.1 + 2., uSoft), fl*1.1));
  float furB = mix(0.5, st1*0.6 + st2*0.4, smoothstep(0.1, mix(0.5, 1.5, uSoft), rad));
  float fur = mix(vn3(vec3(vO.x*7., vO.y*7., vO.z*1.4)), furB, coat), fur2 = mix(vn3(vec3(vO.x*19., vO.y*19., vO.z*4.) + 5.), st2, coat);
  // (own, the animal we follow: the one whose haunches work) where it turns its face to the eye it is pale, in the buff of its own
  // kind: the muzzle, the cheeks under the eye, the chin, the throat and the belly between the legs; the fur's streaks and locks lie
  // over the pale as over the rest. syH: the height on the body at this place along it, -1 under it and 1 over it (the head is
  // carried above the line of the back); the pale's edge is ragged, as fur parts
  float own = uSoft*step(0.01, uHaunch), zfB = vO.z/uLen + 0.5;
  float cyH = uHipY*(1. + 0.53*smoothstep(0.6, 0.8, zfB) - 0.2*smoothstep(0.88, 1., zfB)), syH = (vO.y - cyH)/(0.8*uHipY) + 0.3*(vn2(vec2(th*6., zfB*40.)) - 0.5);
  float paleK = own*coat*max(max(smoothstep(0.91, 0.97, zfB)*(1. - smoothstep(0.1, 0.55, syH)), smoothstep(0.75, 0.82, zfB)*(1. - smoothstep(-0.3, 0.08, syH))), smoothstep(0.3, 0.5, zfB)*(1. - smoothstep(-0.8, -0.4, syH)));
  vec3 vCp = mix(vC, mix(vec3(0.58, 0.47, 0.31), vec3(0.62, 0.48, 0.27), uLemStripe), 0.85*paleK);   // the pale is a warm cream
  vec3 alb = vCp*mix(0.62 + 0.5*fur + 0.3*fur2, (1. + uFurC*0.52*(furB - 0.5))*(1. + uFurC*0.36*(clump - 0.5)), coat*uFurK);
  alb *= 1. - 0.5*uStripe*coat*exp(-th*th/0.09)*smoothstep(0.05 + 0.13*uSoft, 0.3 + 0.14*uSoft, vO.z/uLen + 0.5);   // the darker stripe down the spine (on the animal we follow it dies out on the lower back)
  // (uSoft, the animal we follow) fur that is fur from 20 m behind. The coat lies back toward the tail in locks, 50 round the body and
  // 0.8 m long, with a finer set among them; each is pointed and ends at a place of its own, so the line of the tips is broken; a
  // lock is lit toward its tip, rounded across, and lies in the shadow of the one before it at its root. Measured round the body in
  // radians and along the coat in metres from the tail root, and faded out by the pixel's footprint in both (fwA, fwM: taken here,
  // outside the branch) before a lock is narrower than three pixels, so nothing shimmers
  float mL = vO.z + 0.5*uLen + 0.9*rad, fwA = length(fwidth(vO.xy))/max(rad, 0.08), fwM = fwidth(mL);
  if (uSoft > 0.5 && coat > 0.5) {
    float lk = 0.;
    for (int i = 0; i < 2; i++) {
      float nc = i == 0 ? 50. : 84., lr = i == 0 ? 0.8 : 0.5, cc = th*nc/6.28318 + float(i)*0.37 + 0.3*sin(mL*2.1 + th*3. + float(i)), id = floor(cc), f = fract(cc) - 0.5;
      float hc = h11(id*1.31 + float(i)*7.7), rr = mL/lr + hc*3.7 - 0.5*abs(f), v = fract(rr), hl = h11(id*3.17 + floor(rr)*5.91 + float(i));
      float fc = fwA*nc/6.28318, fr = fwM/lr, keep = (1. - smoothstep(0.3, 0.75, fc))*(1. - smoothstep(0.3, 0.75, fr));
      lk += (i == 0 ? 0.52 : 0.48)*keep*(mix(-1., 1. - 1.7*v, smoothstep(0., max(fr*1.5, 0.06), v)) - 0.5*smoothstep(0.55, 1., abs(f)*2.) + 0.5*(hl - 0.5));
    }
    alb *= 1. + 0.36*lk;
  }
  // the lemming's black stripe (uLemStripe): broad between the shoulders, it narrows down the back, breaks up and ends on the lower back,
  // so that the rump is one tawny mass
  if (uLemStripe > 0.) {
    float bw = mix(0.05, 0.3, smoothstep(0.2, 0.56, zfB)), ends = smoothstep(0.17, 0.3, zfB + 0.07*(vn2(vec2(th*9., zfB*14.)) - 0.5));
    float gaps = smoothstep(0.35, 0.55, vn2(vec2(zfB*23. + 3., 1.7)) + 0.9*smoothstep(0.3, 0.42, zfB));
    float band = (1. - smoothstep(bw*0.6, bw, abs(th) + 0.05*(vn2(vec2(zfB*31., th*7.)) - 0.5)))*ends*gaps;
    alb = mix(alb, vec3(0.012, 0.011, 0.012), 0.92*uLemStripe*coat*band);
  }
  // a tail that is not the followed animal's (the ermine's brush): long hairs lying back along it, dark between them
  float tailK = step(1.5, kind)*step(kind, 2.5)*(1. - uSoft);
  alb *= mix(1., 0.34 + 0.7*vn3(vec3(vO.x*24., vO.y*24., vO.z*0.8) + 3.) + 0.5*vn3(vec3(vO.x*60., vO.y*60., vO.z*2.) + 7.)*nearK, tailK);
  alb *= mix(1., mix((0.66 + 0.5*tip)*(0.86 + 0.28*h11(vA.w*17.3)), 0.96 + 0.2*tip, uFringe), isFin);
  float isEar = step(2.5, kind)*step(kind, 3.5), earIn = isEar*smoothstep(0.08, 0.7, vA.w);                // the bare inside of an ear, out to its furred rim
  float earEdge = isEar*(1. - smoothstep(-0.9, -0.2, vA.w));                                                // the rim of the cup itself (aA.w -1 there)
  alb = mix(alb, vec3(0.36, 0.2, 0.18)*(0.45 + 0.75*vA.y)*(0.85 + 0.3*fur2)*(1. - 0.6*smoothstep(0.7, 1., vA.w))*(1. + 0.35*uSoft), earIn);
  float top = 0.5 + 0.5*N.y;
  // the animal we follow (own): its rump is a round end under a glowing roof, lightest on top and darker toward the belly and the
  // ground. Where the coat closes behind, the light is taken by the height on the body, as on a ball. Forward of the shoulders
  // (frontK) it is lit as a face is: the roof's light rims its whole outline, muzzle, cheek and throat, and the daylight reaches
  // what is turned down, so that a head turned to the eye stands off the floor
  float yB = clamp((vO.y - uHipY)/max(uHipY, 0.1), -1., 1.), frontK = smoothstep(0.5, 0.72, zfB), ownB = own*(1. - frontK);
  top = mix(top, 0.5 + 0.5*yB, 0.8*own*coat*(1. - smoothstep(0.1, 0.36, zfB))*(1. - uSit));   // (sitting up, its height on the body is no longer its height over the ground)
  float topR = mix(0.35 + 0.65*top, smoothstep(0.2, 0.7, top), ownB*(1. - uSit));   // at the run, behind the shoulders, its rim of light stands over the back and down the flanks: none on what is turned to the ground
  float rim = pow(clamp(1. - abs(dot(N, V)), 0., 1.), mix(2.2, 3.6, uSoft));
  rim = mix(rim, max(rim, 0.38*smoothstep(0.45, 0.95, top)), own*coat);    // (own) the roof's glow lies on all that faces up, whichever way it is seen from
  rim *= 1. - isEar*mix(0.45, 0.85, earIn);                                 // an ear takes the light along its edge, not as a sheet over its face
  float kd = mix(0.22 + 0.78*top, 0.05 + 0.95*top*top, uUnder);            // uUnder: a white coat needs a real shadow side to have volume
  // the animal we follow (uSoft) takes its tone from the roof over its own place: under a thin bright roof, where the ground about
  // it glows, it goes down to a dark shape; under deep dim snow, where the floor is dark, its coat is lifted clear of the floor's
  // tone and keeps its own hue. Daylight that falls on it (a pool, a moonbeam) never washes it pale
  float deep = uSoft*smoothstep(0.22, 0.7, clamp(vTh, 0., 1.));
  float lumL = dot(vL, vec3(0.25, 0.55, 0.2));
  // (uSoft) a head, and the pale of the animal we follow, are lit by the roof and not dyed by it: the light that fills them and rims
  // them keeps a quarter of the roof's hue and is a warm cream for the rest (headSel: where; vLh: the roof's light so tempered)
  float headSel = uSoft*max(frontK, paleK);
  vec3 vLh = mix(vL, mix(vec3(lumL)*vec3(1.08, 1., 0.8), vL, 0.25), headSel);
  vec3 Dk = mix(vD, vD/(1. + 2.4*dot(vD, vec3(0.25, 0.55, 0.2))), uSoft), DkR = Dk;
  // (own) daylight comes from above and leaves the coat its hue: no blue wash over the faces turned to the eye (the rim of light
  // along its outline keeps the daylight's own colour: DkR)
  Dk = mix(Dk, vec3(dot(Dk, vec3(0.25, 0.55, 0.2)))*vec3(1.05, 0.96, 0.8)*mix(0.3 + 0.7*top, 1., frontK), 0.75*own*coat);
  vec3 Lk = vL*uGain*mix(1., mix(0.68, 1.8, deep), uSoft)/(1. + uKnee*lumL);
  vec3 col = shade(alb, Lk, Dk, kd, mix(uVivid, 0.94, deep)) + alb*(vLh + Dk)*uFillK*mix(1., 0.4 + 0.8*top, ownB);
  // (own) its shadow side keeps the coat's hue: as dark as the shade makes it, in the fur's own colour and not in the shadow's blue
  col = mix(col, alb*(dot(col, vec3(0.25, 0.55, 0.2))/max(dot(alb, vec3(0.25, 0.55, 0.2)), 1e-3)), 0.62*own*coat);
  float darkF = uSoft*(1. - smoothstep(0.012, 0.05, max(alb.r, alb.g)));                           // black fur stays black: no navy floor under it
  col = max(col - uShadowCol*0.47*darkF, vec3(0.));
  rim *= mix(0.55 + 0.9*fur2, 0.35 + 1.3*furB, coat);
  float isTail = step(1.5, kind)*step(kind, 2.5);
  vec3 Lr = mix(vL, Lk, step(0.01, uKnee)) + Dk;
  // the glow of the roof ahead of a running animal rims its back, ears and haunches (uRimA: how much)
  Lr = max(Lr, vLa*uRimA);
  // (uSoft) the rim is the roof's own light over the animal, in the roof's hue and never fainter than a part of its full glow, so
  // that it draws the back, the ears, the tail and the heels where the snow is deep and the ground dark; black fur takes a thread of it
  vec3 Lroof = max(vL*max(lumL, 0.13*uGlow)/max(lumL, 1e-3), vLa*uRimA) + DkR*0.5;
  Lr = mix(Lr, Lroof, uSoft);
  // (the rim of a head keeps a quarter of the roof's hue, the rim of the back behind it a little over half: one animal from nose to rump)
  Lr = mix(Lr, mix(vec3(dot(Lr, vec3(0.25, 0.55, 0.2)))*vec3(1.08, 1., 0.8), Lr, mix(0.58, 0.25, max(frontK, paleK))), uSoft);
  float rimS = mix(1. - 0.35*uSoft, (0.9 + 1.5*deep)*(1. - 0.86*darkF), uSoft);
  // (own: a tuft of the outline has the coat's colour at its root and takes the light at its tip alone)
  col += Lr*rim*uRimK*topR*mix(alb*3.5, vec3(1.), mix(0.22, 0.5 - 0.14*ownB, uSoft))*(1. - 0.5*isTail)*(1. - isFin*(1. - 0.3*uFringe*mix(1., 0.6 + 1.2*tip*tip, own)))*rimS;
  col += Lr*pow(clamp(1. - abs(dot(N, V)), 0., 1.), 4.5)*0.5*darkF*(0.3 + 0.7*top)*(1. - uFringe);       // and takes a hair-thin edge of the roof's light
  // a black head has a form all the same: the roof's light lies as a dim sheen on its crown and on what else of it faces up, along
  // the lie of the fur, and a broader edge of light draws its outline, so that it is a head and not a dark shape
  // (the tufts of its outline are tipped with that light)
  { float headK = darkF*smoothstep(0.5, 0.62, zfB);
    col += Lr*headK*(1. - uFringe)*(0.13*smoothstep(0.3, 0.9, top)*(0.5 + 1.0*furB) + 0.34*pow(clamp(1. - abs(dot(N, V)), 0., 1.), 2.4)*(0.35 + 0.65*top));
    col += Lr*headK*uFringe*0.3*tip*tip*isFin; }
  // a black tail tip keeps a thin lit edge, so that it shows against a dark wall
  col += Lr*pow(rim, 0.7)*0.55*isTail*(1. - smoothstep(0.02, 0.08, vC.r));
  col += Lr*uRimK*0.3*tip*tip*isFin*mix(0.4 + 0.6*top, topR, own)*mix(alb*3.5, vec3(1.), 0.3)*(1. - 0.75*uFringe)*mix(1., (1. + 1.2*deep)*(1. - 0.8*darkF), uSoft);        // light caught in the fur tips
  col += Lr*earEdge*0.32*(0.4 + 0.6*vA.y)*mix(alb*3.5, vec3(1.), 0.45)*(1. - 0.75*darkF);                     // the lit rim of the ear's cup
  col += vec3(0.85, 0.36, 0.3)*dot(vL + Dk, vec3(0.25, 0.55, 0.2))*0.1*earIn*(0.3 + 0.7*vA.y)*(1. + 0.5*uSoft);  // the roof's light comes through the thin ear
  if (kind > 5.5) { vec3 R = reflect(-V, N); col = vec3(0.004, 0.006, 0.012) + (vL + vD)*pow(max(R.y, 0.), 14.)*1.2; }
  float alpha = 1.;
  if (uFringe > 0.5) {
    float v = vA.y, hs = vA.w - 2.*lonF, id = floor(ucF), f = fract(ucF) - 0.5, h = h11(id*1.37 + hs*91.);
    float Ls = 0.42 + 0.58*h;                                                                    // each hair its own length
    float hair = (1. - smoothstep(0.14, 0.46, abs(f + (h - 0.5)*0.4)))*(1. - smoothstep(Ls*0.6, Ls, v));
    float soft = 0.6*(1. - smoothstep(0.15, 0.95, v));                                           // what the hairs come to where they are too fine to be told apart
    // there they stand in tufts, 0.3 m of the row each, pointed and of their own lengths, which is what makes the outline ragged
    // from far behind; a tuft narrower than two pixels goes back into the soft edge
    float tc = ucF*0.19 + hs*3.3, tH = h11(floor(tc)*2.13 + hs*57.), tv = v/(0.4 + 0.6*tH), fT = max(fwU*0.19, 1e-6), tw = 0.5*(1. - 0.9*clamp(tv, 0., 1.));
    float tuft = (1. - smoothstep(tw - fT, tw + fT, abs(fract(tc) - 0.5 + (tH - 0.5)*0.25*tv)))*step(tv, 1.);
    soft = mix(max(tuft, 0.25*soft), soft, smoothstep(0.3, 0.8, fT));
    alpha = max(1. - smoothstep(0.04, 0.26, v), mix(hair, soft, awF))*silF*smoothstep(0.12, 0.45, faceF);
    alpha *= mix(1., 0.45 + 0.55*smoothstep(0.15, 0.6, top), own);                               // (own) the outline is thinner where the body is in its own shade
  }
  gl_FragColor = vec4(col, alpha);
  ${ye}
}`,pl=y=>`
varying vec4 vCol;
void main(){
  vec2 d = gl_PointCoord - 0.5; float r = dot(d, d)*4.;
  float a = exp(-r*3.5)*(1. - smoothstep(0.6, 1., r))*vCol.a;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vCol.rgb, a);
  ${y?or:ye}
}`,ml=`
attribute vec3 aBN; attribute vec4 aF;
varying vec3 vW; varying vec3 vN; varying vec3 vBN; varying vec3 vL; varying vec3 vD; varying vec4 vF;
void main(){
  vec3 p = position; float isF = step(0.5, aF.w)*step(aF.w, 2.5);
  float shiver = pow(max(sin(uTime*0.8 + position.z*0.3 + position.y*0.2), 0.), 10.);          // a ruffle runs through the plumage now and then
  p += aBN*(sin(uTime*1.9 + aF.z*40.)*0.03 + 0.15*shiver)*aF.y*isF;
  vec4 wp = modelMatrix*vec4(p, 1.);
  mat3 m3 = mat3(modelMatrix);
  vN = normalize(m3*normal + vec3(0., 1e-5, 0.)); vBN = normalize(m3*aBN + vec3(0., 1e-5, 0.));
  vW = wp.xyz; vF = aF; vL = rfLight(wp.xz); vD = dayAt(wp.xyz);
  ${ae}
}`,wl=`
uniform vec3 uKey;
varying vec3 vW; varying vec3 vN; varying vec3 vBN; varying vec3 vL; varying vec3 vD; varying vec4 vF;
void main(){
  float kind = vF.w, x = vF.x, ax = abs(x), v = vF.y, h = vF.z;
  float isF = step(0.5, kind)*step(kind, 2.5);
  vec3 V = normalize(cameraPosition - vW);
  vec3 Ng = normalize(vN); if (dot(Ng, V) < 0.) Ng = -Ng;
  vec3 Nb = normalize(vBN);
  vec3 N = normalize(mix(Ng, Nb, 0.72*isF));
  vec3 alb = vec3(0.79, 0.775, 0.74); float occ = 1., edge = 0.;
  if (isF > 0.5) {
    // the vane: full a seventh of the way out, round at the tip, its last third loosening into separate barbs when seen close
    float w = sqrt(clamp(v/0.14, 0., 1.))*sqrt(max(1. - pow(max(v - 0.3, 0.)/0.7, 2.), 0.));
    float near = 1. - smoothstep(16., 42., length(cameraPosition - vW));
    float rag = max(vn2(vec2(v*17. + h*40., x*2.3 + h*7.)) - 0.4, 0.)*0.5*smoothstep(0.3, 1., v)*near;
    if (ax > w*(0.97 - rag)) discard;
    edge = clamp(ax/max(w, 0.05), 0., 1.);
    occ = mix(0.46, 1., smoothstep(0.0, 0.6, v));                                            // its root lies under the feather in front
    alb *= 0.9 + 0.1*smoothstep(0.4, 1., v);
    alb *= 1. - 0.09*(1. - smoothstep(0.02, 0.09, ax))*near*step(v, 0.9);                     // the shaft
    alb *= mix(1., 0.9 + 0.2*vn2(vec2(x*3.1 + h*9., (v - ax*0.35)*22.)), near);              // barbs, as soft streaks
    alb *= 0.93 + 0.12*h;
    if (kind > 1.5) alb = mix(vec3(0.02, 0.02, 0.026)*(0.7 + 0.6*edge), vec3(0.6, 0.6, 0.58), smoothstep(0.94, 0.975, v));
  } else if (kind < 0.5) { alb *= 0.6; }
  else if (kind < 3.5) { alb = vec3(0.028, 0.027, 0.03); }
  else if (kind < 4.5) { alb = vec3(0.004, 0.005, 0.008); }
  else { alb = vec3(0.50, 0.02, 0.03); }
  float up = N.y*0.5 + 0.5, kk = dot(N, uKey);
  float kdDay = smoothstep(-0.3, 0.9, kk);
  vec3 roof = vL*vec3(0.58, 1.0, 1.12)*(0.26 + 0.5*up);                                      // the roof's turquoise fills the shadow side
  vec3 col = alb*occ*(vD*kdDay*1.6*vec3(1.05, 1.0, 0.9) + roof + uShadowCol*1.4);
  col += alb*(vD*0.35 + vL*0.12)*isF*(0.3 + 0.7*edge)*pow(clamp(1. - abs(dot(Ng, V)), 0., 1.), 1.5);        // light in the feather edges along the outline
  if (kind > 2.5) { vec3 R = reflect(-V, Ng); col += (vL + vD)*pow(max(R.y, 0.), 16.)*(kind < 4.5 ? 0.8 : 0.25); }
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,gl=`
attribute vec3 aBN; attribute vec4 aF; attribute vec3 color;
uniform float uPx;
varying vec3 vW; varying vec3 vN; varying vec3 vBN; varying vec3 vC; varying vec3 vL; varying vec3 vD; varying vec3 vO; varying vec4 vF;
void main(){
  vec3 p = position; float kind = aF.w;
  float isT = step(0.5, kind)*step(kind, 1.5), isW = step(3.5, kind)*step(kind, 4.5);
  p += aBN*(sin(uTime*2.1 + aF.z*40.)*0.05 + sin(uTime*6.3 + aF.z*23.)*0.02)*aF.y*isT;                 // the tips of the fur stir
  p.y += isW*aF.y*aF.y*(0.22*sin(uTime*7.3 + aF.z*30.) + 0.3*pow(max(sin(uTime*1.7 + aF.z*3.), 0.), 8.)); // whiskers tremble as it snuffs
  vec4 wp = modelMatrix*vec4(p, 1.);
  mat3 m3 = mat3(modelMatrix);
  vec3 n = normalize(m3*normal + vec3(0., 1e-5, 0.)), bn = normalize(m3*aBN + vec3(0., 1e-5, 0.));
  if (isW > 0.5) {
    // a whisker is a ribbon turned to the eye and never thinner than a pixel and a half
    vec3 Vv = cameraPosition - wp.xyz; float d = max(length(Vv), 0.1);
    vec3 S = cross(bn, Vv); S /= max(length(S), 1e-4);
    wp.xyz += S*aF.x*max(0.035*(1. - 0.6*aF.y), 0.8*d/max(uPx, 1.));
    n = Vv/d;
  }
  vW = wp.xyz; vN = n; vBN = bn; vC = color; vO = position; vF = aF; vL = rfLight(wp.xz); vD = dayAt(wp.xyz);
  ${ae}
}`,xl=`
uniform float uFoxHoleY;
varying vec3 vW; varying vec3 vN; varying vec3 vBN; varying vec3 vC; varying vec3 vL; varying vec3 vD; varying vec3 vO; varying vec4 vF;
void main(){
  float kind = vF.w, h = vF.z;
  vec3 V = normalize(cameraPosition - vW);
  vec3 Ng = normalize(vN); if (dot(Ng, V) < 0.) Ng = -Ng;
  vec3 Nb = normalize(vBN);
  float dist = length(cameraPosition - vW), near = 1. - smoothstep(22., 60., dist);
  float lum = dot(vL, vec3(0.25, 0.55, 0.2));
  vec3 Lv = mix(vL, vec3(lum)*vec3(1.05, 1.0, 0.9), 0.9);                                  // russet keeps its own hue under the blue-green roof
  vec3 alb = vC, N = Ng, add = vec3(0.); float occ = 1., gloss = 0., snowK = 0.;
  float fwX = fwidth(vF.x) + 1e-4, fwY = fwidth(vF.y) + 1e-4;                                // taken here, outside the branches
  if (kind < 0.5) {
    // skin: the short coat as fine streaks lying back from the nose, the dark line of the lips, the rows of dark pits the whiskers grow from
    float th = atan(vO.x, vO.y + 0.4), fl = vO.z*1.7 - length(vO.xy)*0.5;
    float st1 = vn2(vec2(th*26., fl*1.9)), st2 = mix(0.5, vn2(vec2(th*70. + 9., fl*4.6 + 3.)), near);
    alb *= 0.62 + 0.42*st1 + 0.3*st2;
    float sA = vF.x, z = vO.z;
    float sLip = -0.34 + 0.3*smoothstep(5.3, 6.6, z) - 0.1*smoothstep(3.6, 2.5, z);
    float dl = abs(sA - sLip), fw = fwX;
    float lip = (1. - smoothstep(0.035, 0.05 + fw, dl))*smoothstep(2.3, 2.9, z)*step(z, 6.9);
    alb = mix(alb, vec3(0.012, 0.01, 0.01), lip*0.92);
    alb *= 1. - 0.35*(1. - smoothstep(0.05, 0.2, dl))*smoothstep(2.3, 2.9, z);              // the shadow the upper lip throws
    vec2 wc = vec2(z*2.1, (sA - 0.02)*9.), wf = fract(wc) - 0.5;
    float pad = smoothstep(3.5, 3.9, z)*(1. - smoothstep(5.5, 5.8, z))*step(-0.26, sA)*step(sA, 0.2);
    alb *= 1. - 0.75*pad*(1. - smoothstep(0.12, 0.2, length(wf)));
    snowK = smoothstep(0.62, 0.8, vn3(vO*1.4 + 3.) + 0.25*Ng.y)*smoothstep(0.1, 0.6, Ng.y);
  } else if (kind < 1.5) {
    // a lock of fur: pointed, parting from a little above its root into three strands and each strand into hairs, so that its end
    // is a wisp and not a flat blade; dark at the root where the lock in front lies over it
    float x = vF.x, ax = abs(x), v = vF.y;
    float wv = pow(max(1. - v, 0.), 0.6), comb = (0.5 + 0.5*cos(x*9.42 + h*6.283))*(0.4 + 0.6*(0.5 + 0.5*cos(x*24. + h*17.))), part = smoothstep(0.14, 0.8, v);
    if (ax > wv*(1. - part*0.9*(1. - comb))) discard;
    N = normalize(mix(Ng, Nb, 0.74));
    occ = mix(0.4, 1., smoothstep(0., 0.55, v));
    alb *= (0.8 + 0.4*h)*(0.84 + 0.32*vn2(vec2(x*4. + h*31., v*2.3)))*(0.9 + 0.3*v);
    add = alb*(vD*0.5 + Lv*0.5)*v*v*pow(clamp(1. - abs(dot(Ng, V)), 0., 1.), 1.5);                         // light caught in the tips along the outline
    snowK = step(0.82, fract(h*7.31))*smoothstep(0.25, 0.6, Nb.y)*smoothstep(0.2, 0.7, v);  // powder clinging to the fur that faces up
  } else if (kind < 2.5) {
    // the nose: wet black leather, pebbled, with two comma nostrils and the groove below them
    vec3 q = vF.xyz; float axn = abs(q.x);
    float dn = length(vec2((axn - 0.44)/0.2, (q.y + 0.02 - 0.5*(axn - 0.44))/0.13));
    float nost = (1. - smoothstep(0.7, 1.05, dn))*step(0., q.z);
    float groove = (1. - smoothstep(0.02, 0.07, axn))*step(q.y, 0.05)*step(0., q.z);
    float peb = vn3(vO*13.), peb2 = vn3(vO*31.);
    alb = vec3(0.016, 0.014, 0.015)*(0.6 + 0.8*peb)*(1. - 0.9*nost)*(1. - 0.6*groove);
    N = normalize(Ng + (vec3(peb, peb2, vn3(vO*13. + 7.)) - 0.5)*0.5*near);
    gloss = 1. - nost;
  } else if (kind < 3.5) {
    // an eye: amber iris with a dark upright slit, a black rim, lids that blink, and a glint
    float u = vF.x, v = vF.y;
    float open = 1. - 0.97*pow(max(sin(uTime*0.83 + 1.3), 0.), 70.);
    float lidU = 0.56*pow(max(1. - u*u*1.1, 0.), 0.6)*open, lidL = -0.4*pow(max(1. - u*u*1.1, 0.), 0.7)*open;
    float fw = fwY;
    float inEye = smoothstep(lidL - fw, lidL + fw, v)*(1. - smoothstep(lidU - fw, lidU + fw, v));
    float r = length(vec2(u, v));
    vec3 iris = mix(vec3(0.42, 0.17, 0.02), vec3(0.95, 0.56, 0.08), smoothstep(0.1, 0.5, r))*(0.75 + 0.5*vn2(vec2(atan(v, u)*9., r*4.)));
    iris *= 1. - 0.75*smoothstep(0.46, 0.6, r);
    float pup = 1. - smoothstep(0.85, 1.1, length(vec2(u/0.14, v/0.4)));
    vec3 eye = mix(iris, vec3(0.004), pup);
    eye = mix(vec3(0.02, 0.012, 0.008), eye, 1. - smoothstep(0.58, 0.66, r));
    eye *= 0.45 + 0.55*smoothstep(lidU, lidU - 0.3, v);                                      // the shadow of the upper lid
    alb = mix(vec3(0.012, 0.01, 0.01), eye, inEye);
    gloss = 0.6 + 0.4*inEye;
    float gl = (1. - smoothstep(0.05, 0.1, length(vec2(u + 0.14, v - 0.2))))*inEye;
    add = (vD*2.2 + Lv*3. + vec3(0.25))*gl + alb*(vD*0.5 + Lv*0.6)*inEye;                    // the iris glows a little, like a held lamp
  } else if (kind < 4.5) {
    alb = vec3(0.6, 0.58, 0.52)*(0.6 + 0.4*smoothstep(0., 0.3, vF.y)); N = normalize(V + vec3(0., 0.6, 0.));
    add = alb*(vD*0.5 + Lv*0.5);
  } else if (kind < 5.5) {
    alb *= 0.7 + 0.5*vn2(vO.xy*2.3); add = vec3(0.5, 0.2, 0.14)*(vD*0.16 + Lv*0.2);          // the light through the thin ear
  } else { alb = vec3(0.11, 0.1, 0.09); gloss = 0.5; }
  alb = mix(alb, vec3(0.6, 0.7, 0.8), snowK*0.85);
  float up = N.y*0.5 + 0.5, kdDay = smoothstep(-0.35, 0.8, N.y);
  vec3 col = alb*occ*(Lv*(0.5 + 2.0*up) + uShadowCol*2.0 + vD*(0.3 + 1.0*kdDay));
  col += uShadowCol*0.4*exp(-dot(col, vec3(4., 8., 4.)));
  vec3 R = reflect(-V, N); float sp = max(pow(max(R.y, 0.), 20.), 0.7*pow(max(dot(N, normalize(V + vec3(0., 0.9, 0.))), 0.), 40.)), fres = pow(clamp(1. - dot(N, V), 0., 1.), 3.);
  col += (vD*1.6 + vL*1.2)*(sp*1.5 + 0.25*fres)*gloss;
  col += add;
  // the neck and the leg pass into the shadow of the hole they come through: the fur darkens over the last four metres under the roof
  col *= 1. - 0.85*smoothstep(uFoxHoleY - 4.6, uFoxHoleY - 0.6, vW.y + 0.8*(vn3(vO*0.9) - 0.5));
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`;function Aa(y){const _=new ze,vt=y.len,mt=y.rows,lt=y.sides||16,Bt=[],Xt=mt.length,ue=y.haunch||0,Ot=y.rings||26,te=(W,dt)=>{const gt=Math.sin(W*12.9898+dt*78.233)*43758.5453;return gt-Math.floor(gt)},ct=W=>{for(let dt=1;dt<Xt;dt++)if(W<=mt[dt][0]){const gt=mt[dt-1],ft=mt[dt],Wt=ft[0]-gt[0],yt=(W-gt[0])/Wt;if(!y.smooth)return[W,it(gt[1],ft[1],yt),it(gt[2],ft[2],yt),it(gt[3],ft[3],yt)];const $=mt[Math.max(dt-2,0)],Ht=mt[Math.min(dt+1,Xt-1)],X=yt*yt,kt=X*yt,Yt=Rt=>(2*kt-3*X+1)*gt[Rt]+(kt-2*X+yt)*Wt*(ft[Rt]-$[Rt])/Math.max(ft[0]-$[0],1e-4)+(3*X-2*kt)*ft[Rt]+(kt-X)*Wt*(Ht[Rt]-gt[Rt])/Math.max(Ht[0]-gt[0],1e-4);return[W,Yt(1),Math.max(Yt(2),.03),Math.max(Yt(3),.03)]}return mt[Xt-1]},be=[];for(let W=0;W<=Ot;W++)be.push(ct(z(0,1,W/Ot)*.35+W/Ot*.65));let ie=.1;for(const W of mt)ie=Math.max(ie,W[3]);const Lt=(W,dt,gt)=>ue*(1-z(.02,.2,W))*Math.exp(-(gt*gt)/.07)*(dt<.35?1:.2),re=(W,dt,gt=0)=>{const ft=dt/lt*T,Wt=Math.sin(ft),yt=Math.cos(ft),$=W[0],Ht=ue*z(0,.07,$)*(1-z(.2,.42,$)),X=Math.exp(-(yt*yt)/.07),kt=W[2]*(Wt<0?.82:1)+gt,Yt=(W[3]+gt)*(1+.26*Ht*Math.exp(-((Wt+.4)**2)/.2)*Math.abs(yt));return[yt*Yt,W[1]+Wt*kt+Ht*X*(Wt<0?.32:-.09)*W[2],($-.5)*vt+.4*Lt($,Wt,yt)]};for(const W of be){const dt=[];for(let gt=0;gt<lt;gt++){const ft=gt/lt*T,Wt=re(W,gt),yt=Math.sin(ft),$=Math.cos(ft),Ht=1-.32*Lt(W[0],yt,$),X=y.coat(W[0],yt,$);dt.push(_.v(Wt[0],Wt[1],Wt[2],[X[0]*Ht,X[1]*Ht,X[2]*Ht],[0,W[0],0,0]))}Bt.push(dt)}_.loft(Bt,!0);const Oe=y.fin??0;if(Oe>0){const W=y.tufts||4,dt=new b,gt=new b,ft=new b,Wt=new b,yt=new b,$=new b;for(let Ht=1;Ht<be.length-2;Ht++)for(let X=0;X<lt;X++)for(let kt=0;kt<W;kt++){const Yt=te(Ht+kt*17.3,X),Rt=te(X+3.7+kt*5.1,Ht+9.1),jt=te(Ht+5.3,X+1.9+kt*7.7),he=te(kt+1.1+Ht*.37,X*2.3+.7),ee=Vt(be[Ht][0]+(Yt-.5)*.045,.02,.975),fe=X+Rt,ke=ct(ee),At=ct(Math.max(ee-.03,.004)),ot=fe/lt*T;if(Math.sin(ot)<-.62)continue;const j=re(ke,fe),wt=re(At,fe),Tt=re(ke,fe+.5);dt.set(j[0],j[1],j[2]),gt.set(wt[0]-j[0],wt[1]-j[1],wt[2]-j[2]).normalize(),Wt.set(Tt[0]-j[0],Tt[1]-j[1],Tt[2]-j[2]).normalize(),ft.crossVectors(Wt,gt).normalize();const Gt=ft.x*j[0]+ft.y*(j[1]-ke[1])<0;Gt&&ft.negate();const Q=Oe*(.5+.5*Math.min(ke[3]/(.6*ie),1))*(ee>y.neckZ?.5:1)*(.6+.8*jt),Ft=.16+.34*he,Qt=Q*(.13+.09*Yt);yt.copy(gt).multiplyScalar(Math.cos(Ft)).addScaledVector(ft,Math.sin(Ft)).addScaledVector(Wt,(Rt-.5)*.7).normalize();const Jt=y.coat(ee,Math.sin(ot),Math.cos(ot));$.copy(dt).addScaledVector(Wt,-Qt).addScaledVector(ft,-.04);const se=_.v($.x,$.y,$.z,Jt,[4,0,0,Yt]);$.copy(dt).addScaledVector(Wt,Qt).addScaledVector(ft,-.04);const de=_.v($.x,$.y,$.z,Jt,[4,0,1,Yt]);$.copy(dt).addScaledVector(yt,Q);const pe=_.v($.x,$.y,$.z,Jt,[4,1,.5,Yt]);Gt?_.tri(de,se,pe):_.tri(se,de,pe)}}const Zt=y.ear;for(const W of[-1,1]){const dt=ct(Zt.z),gt=W*Zt.x,ft=dt[1]+dt[2]*Zt.up,Wt=(Zt.z-.5)*vt,yt=Zt.seg||10,$=Math.cos(Zt.yaw||0),Ht=Math.sin(Zt.yaw||0),X=Zt.r,kt=(ot,j,wt,Tt,Gt,Q=0)=>_.v(gt+ot*$+W*wt*Ht,ft+j,Wt+wt*$-W*ot*Ht,Tt,[3,Gt,W,Q]),Yt=(ot,j)=>[ot[0]*j,ot[1]*j,ot[2]*j],Rt=[],jt=[],he=[],ee=[],fe=[];for(let ot=0;ot<yt;ot++){const j=ot/yt*T,wt=Math.cos(j),Tt=Math.sin(j),Gt=.85*(1+.15*W*wt),Q=.5+.5*Tt;Rt.push(kt(wt*X*Gt,X*.45+Tt*X,.12*X*Math.abs(wt),y.earOut,Q,-1)),jt.push(kt(wt*X*Gt*.8,X*.45+Tt*X*.8,-.14*X,y.earIn,Q,.75)),he.push(kt(wt*X*Gt*.45,X*.42+Tt*X*.45,-.34*X,Yt(y.earIn,.7),Q,1)),ee.push(kt(wt*X*Gt*.86,X*.45+Tt*X*.86,-.22*X,y.earOut,Q)),fe.push(kt(wt*X*Gt*.5,X*.43+Tt*X*.5,-.44*X,Yt(y.earOut,.85),Q))}const ke=kt(0,X*.36,-.42*X,Yt(y.earIn,.4),.4,1),At=kt(0,X*.4,-.54*X,Yt(y.earOut,.8),.4);for(let ot=0;ot<yt;ot++){const j=(ot+1)%yt;_.tri(ke,he[ot],he[j]),_.quad(he[ot],jt[ot],jt[j],he[j]),_.quad(jt[ot],Rt[ot],Rt[j],jt[j]),_.tri(At,fe[j],fe[ot]),_.quad(fe[ot],fe[j],ee[j],ee[ot]),_.quad(ee[ot],ee[j],Rt[j],Rt[ot])}if(Zt.fur)for(let ot=0,j=yt*(Zt.furN||2);ot<j;ot++){const wt=(ot+.5*te(ot,W+2))/j*T,Tt=Math.cos(wt),Gt=Math.sin(wt),Q=.85*(1+.15*W*Tt),Ft=.5+.5*Gt,Qt=te(ot+.3,W+5),Jt=Zt.fur*X*(.6+.8*Qt),se=.5*T/j;if(Gt<-.55)continue;const de=kt(Math.cos(wt-se)*X*Q*.94,X*.45+Math.sin(wt-se)*X*.94,.06*X,y.earOut,Ft),pe=kt(Math.cos(wt+se)*X*Q*.94,X*.45+Math.sin(wt+se)*X*.94,.06*X,y.earOut,Ft),a0=kt(Tt*(X*Q+Jt),X*.45+Gt*(X+Jt),-.1*X-.25*Jt,y.earOut,Ft);_.tri(de,pe,a0)}}for(const W of[-1,1]){const dt=ct(y.eye.z);_.ball(new b(W*dt[3]*.78,dt[1]+dt[2]*.42,(y.eye.z-.5)*vt),y.eye.r,y.eye.r,y.eye.r,6,4,()=>[.01,.01,.015],[6,0,0,0])}const _t=y.tail,$t=[],i=ct(.02);for(let W=0;W<=9;W++){const dt=W/9;$t.push(new b(0,i[1]-i[2]*.4-_t.droop*Math.sin(dt*1.4)+_t.lift*dt*dt,-.5*vt+.3-dt*_t.len))}if(_t.curl){let W=$t[0].y,dt=$t[0].z;for(let gt=1;gt<=9;gt++){const ft=_t.curl*(gt-.5)/9;W+=Math.sin(ft)*_t.len/9,dt-=Math.cos(ft)*_t.len/9,$t[gt].set(0,W,dt)}}_.tube($t,W=>_t.r*(1-.55*W)*(_t.point?1-.92*z(.62,1,W):1)*(_t.brush?1+_t.brush*z(.45,.8,W)*(1-z(.9,1,W)):1),7,W=>W>(_t.tipFrom??2)?_t.tip:_t.col,W=>[2,W,0,0]);for(const W of y.legs)for(const dt of[-1,1]){const gt=(W.z-.5)*vt,ft=dt*W.x,Wt=W.ph+(dt>0?W.alt:0),yt=W.z>.4?2:0,$=[1,1,Wt,yt+1],Ht=new b(ft*1.05,W.r*.9,gt+W.knee*.3),X=new b(ft*1.08,W.r*.55,gt+W.foot),kt=[new b(ft*.8,W.hip,gt),new b(ft,W.hip*.55,gt+W.knee),Ht,X],Yt=W.toes?.95:.55,Rt=y.legSub?new R.CatmullRomCurve3(kt).getPoints(10):kt;if(_.tube(Rt,jt=>W.r*(1.25-Yt*jt),y.legSub?9:7,jt=>jt>(y.legSub?.78:.6)?y.paw:y.legCoat||y.coat(W.z,-1,0),jt=>[1,z(0,.75,jt),Wt,yt+(jt>.5?1:0)]),W.sole){const jt=W.foot-W.knee*.3,he=Ht.clone().lerp(X,.56).add(new b(0,-W.r*.3,0));_.ball(he,W.sole,W.r*(W.toes?.36:.5),jt*(W.toes?.5:.62),8,5,ee=>ee<.25?y.sole:y.paw,$);for(let ee=0;ee<(W.toes||0);ee++){const fe=W.toes>1?ee/(W.toes-1)-.5:0,ke=fe*.95,At=jt*.3*(1-.5*fe*fe),ot=new b(he.x+fe*W.sole*1.5,he.y-W.r*.02,he.z+jt*.4),j=ot.clone().add(new b(Math.sin(ke)*At,-W.r*.1,Math.cos(ke)*At));_.tube([ot,ot.clone().lerp(j,.55).add(new b(0,W.r*.1,0)),j],wt=>W.sole*(.3-.13*wt),5,wt=>wt>.7?y.sole:y.toe||y.paw,()=>$,!0)}}}if(y.stem){const W=(y.neckZ-.5)*vt,dt=[.62,.52,.3],gt=[.5,.4,.2];_.tube([new b(.4,.7,W+2.1),new b(.3,1.1,W+2.4),new b(.1,1.5,W+2.7),new b(-.3,2.6,W+3.5),new b(-.6,3.5,W+4.3)],ft=>.17-.07*ft,5,()=>dt,()=>[5,0,0,0]),_.ball(new b(-.65,3.75,W+4.5),.3,.5,.3,6,4,()=>gt,[5,0,0,0])}const ut=_.build();if(y.fringe){const W=y.fringe,dt=[],gt=[],ft=[],Wt=[],yt=[];let $=0;const Ht=W.rings||40,X=W.sides||lt,kt=new b,Yt=new b,Rt=new b,jt=new b,he=j=>{const wt=j/Ht;return Vt(z(0,1,wt)*.3+wt*.7,.012,.992)},ee=(j,wt)=>{const Tt=ct(j),Gt=ct(Math.max(j-.025,.004)),Q=re(Tt,wt),Ft=re(Gt,wt),Qt=re(Tt,wt+.4);return kt.set(Q[0],Q[1],Q[2]),Yt.set(Ft[0]-Q[0],Ft[1]-Q[1],Ft[2]-Q[2]).normalize(),jt.set(Qt[0]-Q[0],Qt[1]-Q[1],Qt[2]-Q[2]).normalize(),Rt.crossVectors(jt,Yt).normalize(),Rt.x*Q[0]+Rt.y*(Q[1]-Tt[1])<0&&Rt.negate(),Tt},fe=(j,wt)=>W.len*(.55+.45*Math.min(wt[3]/(.6*ie),1))*(j>y.neckZ?.6:1)*(1-.6*z(.9,.99,j)),ke=(j,wt,Tt,Gt,Q)=>{const Ft=ee(j,wt),Qt=wt/lt*T,Jt=y.coat(j,Math.sin(Qt),Math.cos(Qt)),se=fe(j,Ft)*(.8+.4*te(wt*3.1+.7,j*91.3)),de=Math.cos(Q),pe=Math.sin(Q);return dt.push(kt.x-Rt.x*.03,kt.y-Rt.y*.03,kt.z-Rt.z*.03,kt.x+(Rt.x*de+Yt.x*pe)*se,kt.y+(Rt.y*de+Yt.y*pe)*se,kt.z+(Rt.z*de+Yt.z*pe)*se),gt.push(Rt.x,Rt.y,Rt.z,Rt.x,Rt.y,Rt.z),ft.push(Jt[0],Jt[1],Jt[2],Jt[0],Jt[1],Jt[2]),Wt.push(4,0,Tt,Gt,4,1,Tt,Gt),$+=2,$-2},At=j=>Math.sin(j/lt*T)<-.72;for(let j=1;j<Ht;j++){const wt=he(j),Tt=te(j+.37,5.1),Gt=ct(wt);let Q=0,Ft=-1,Qt=0,Jt=0;for(let se=0;se<=X;se++){const de=se/X*lt,pe=re(Gt,de);if(se>0&&(Q+=Math.hypot(pe[0]-Qt,pe[1]-Jt)),Qt=pe[0],Jt=pe[1],At(de)){Ft=-1;continue}const a0=ke(wt,de,Q,Tt,.9);Ft>=0&&yt.push(Ft,a0,a0+1,Ft,a0+1,Ft+1),Ft=a0}}for(let j=0;j<X;j++){const wt=(j+.5)/X*lt,Tt=2+te(j+.91,3.3);if(At(wt))continue;let Gt=-1;for(let Q=0;Q<=Ht;Q++){const Ft=he(Q),Qt=ke(Ft,wt,(Ft-.5)*vt,Tt,.3);Gt>=0&&yt.push(Gt,Qt,Qt+1,Gt,Qt+1,Gt+1),Gt=Qt}}const ot=new R.BufferGeometry;ot.setAttribute("position",new R.Float32BufferAttribute(dt,3)),ot.setAttribute("normal",new R.Float32BufferAttribute(gt,3)),ot.setAttribute("color",new R.Float32BufferAttribute(ft,3)),ot.setAttribute("aA",new R.Float32BufferAttribute(Wt,4)),ot.setIndex(yt),ut.userData.fringe=ot}return ut}const yl=`
attribute float aD;
varying vec3 vW; varying float vDp;
void main(){ vW = position; vDp = aD; vec4 wp = vec4(position, 1.); ${ae} }`,bl=`
uniform vec4 uDrip[4]; uniform float uRoofH;
varying vec3 vW; varying float vDp;
void main(){
  vec2 p = vW.xz; float t = uTime;
  // (the water ends a little short of the bank, at a ragged line: the soaked margin of the floor lies between them)
  float sh = vDp + 0.22*(vn2(p*1.3 + 3.) - 0.5) + 0.1*(vn2(p*4.1) - 0.5);
  if (sh < 0.05) discard;
  float far = 1. - smoothstep(25., 70., length(cameraPosition - vW));
  vec2 n2 = 0.5*(vec2(vn2(p*0.45 + vec2(0., t*0.3)), vn2(p*0.45 + vec2(7.3, t*0.26))) - 0.5);
  n2 += 0.22*far*(vec2(vn2(p*1.9 - vec2(t*0.7, 0.)), vn2(p*1.9 + vec2(3.1, t*0.6))) - 0.5);
  for (int i = 0; i < 4; i++) {
    vec2 d = p - uDrip[i].xy; float r = length(d), ph = fract(t*uDrip[i].z + uDrip[i].w), rr = r - ph*7.5;
    n2 += d/max(r, 0.05)*sin(rr*4.2)*exp(-rr*rr/1.6)*(1. - ph)*0.42;
  }
  vec3 N = normalize(vec3(n2.x, 1., n2.y));
  vec3 V = normalize(cameraPosition - vW);
  float fres = 0.05 + 0.95*pow(clamp(1. - dot(N, V), 0., 1.), 3.5);
  vec3 R = reflect(-V, N);
  vec2 rp = p + R.xz/max(R.y, 0.12)*uRoofH;
  vec3 Lr = rfLight(rp); float cup = 0.62 + 0.75*vn2(rp*0.33 + 2.)*vn2(rp*0.9);
  float hr = max(holesAt(rp), lensAt(rp));
  vec3 Lh = rfLight(p);
  float peb = vn2(p*1.1 + 5.)*vn2(p*2.9);
  vec3 deep = uShadowCol*0.35 + Lh*(vec3(0.016, 0.03, 0.035) + vec3(0.11, 0.09, 0.05)*peb*(1. - smoothstep(0.1, 0.9, sh)));
  vec3 col = mix(deep, mix(Lr*cup, uDayCol*2.7, hr), fres) + dayAt(vW)*(0.03 + 0.5*fres);
  float gl = smoothstep(0.6, 0.92, vn2(p*3.3 + n2*9. + vec2(t*0.5, 0.)));
  col += Lr*gl*0.3*far*max(R.y, 0.);
  // shelf ice round the edge: white where it is thick, glassy where it thins over the water
  float ice = 1. - smoothstep(0.1, 0.34, sh);
  vec3 iceC = vec3(0.52, 0.64, 0.74)*(0.6 + 0.5*vn2(p*2.3))*(Lh*1.5 + uShadowCol*2. + dayAt(vW));
  col = mix(col, iceC, ice*0.9);
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`,Ml=`
attribute float aOpen;
varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying float vOpen;
void main(){ vec4 wp = modelMatrix*vec4(position, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); vUv = uv; vOpen = aOpen; ${ae} }`,zl=`
uniform float uOpen, uSoft; uniform vec3 uTint;
varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying float vOpen;
void main(){
  vec3 V = normalize(cameraPosition - vW); float f = abs(dot(normalize(vN), V));
  // (the streaks and the dust are laid round the shaft by its angle, whole round it: there is no seam down its side)
  float ang = vUv.x*6.28318; vec2 cs = vec2(cos(ang), sin(ang)), cs2 = vec2(cos(ang + uTime*0.021), sin(ang + uTime*0.021));
  float streak = 0.55 + 0.45*vn3(vec3(cs*4.14, vUv.y*1.5 + uTime*0.05));
  float dust = pow(vn3(vec3(cs2*9.55, vUv.y*40. - uTime*0.6)), 5.)*2.5*(1. + uSoft);
  // (uSoft 1: a shaft seen from far off against a tall wall goes out toward its edge with no line there: its edge is ragged, further
  // in here and further out there up its height, drifting slowly, and thins into the air)
  float fe = clamp(f + 0.4*uSoft*(vn3(vec3(cs*2.1, vUv.y*6. - uTime*0.04)) - 0.5), 0., 1.);
  float a = mix(f*f, fe*fe*fe*fe*1.6, uSoft)*(0.25 + 0.75*vUv.y)*smoothstep(0., 0.12, vUv.y)*(1. - smoothstep(0.9, 1., vUv.y))*(streak + dust)*uOpen;
  a *= vOpen*vOpen*(3. - 2.*vOpen);                                     // (it goes out before the snow it enters: aOpen)
  a *= smoothstep(2., 7., length(cameraPosition - vW));
  gl_FragColor = vec4(uDayCol*uTint*0.16*a, 1.);
  ${or}
}`,kl={noon:{thick:0,hour:"noon",weather:"clear",turq:"#3FC9C4",cobalt:"#2456B8",glow:2.5,green:0,grey:0,band:1,wet:0,fog:"#1b4c98",fogD:.0072,exposure:.86,spark:"#000000",title:"Under the Snow Roof"},twilight:{thick:.12,hour:"twilight",weather:"clear",turq:"#52B8D8",cobalt:"#5B30C8",glow:3.4,green:0,grey:0,band:.7,wet:0,fog:"#2e2a8c",fogD:.0072,exposure:1.1,spark:"#000000",title:"Under the Snow Roof, Polar Twilight"},night:{thick:.04,hour:"night",weather:"clear",turq:"#3FC9A8",cobalt:"#20409C",glow:1.62,green:.35,grey:0,band:.6,wet:0,fog:"#0c2562",fogD:.0066,exposure:1.2,spark:"#3FD98A",title:"Under the Snow Roof, Aurora Night"},thaw:{thick:.05,hour:"noon",weather:"thaw",turq:"#7CEBB4",cobalt:"#0F6C80",glow:2.05,green:.04,greenThin:.62,amp:.9,patchK:1.1,grey:0,band:1.2,wet:1,fog:"#0b4a5c",fogD:.0074,exposure:.72,spark:"#000000",shadow:"#0A2C40",title:"Under the Snow Roof, Thaw"},blizzard:{thick:.03,hour:"noon",weather:"blizzard",turq:"#74C0C8",cobalt:"#3A5E9E",glow:2.3,green:0,grey:.4,band:5,wet:0,fog:"#2b5390",fogD:.0076,exposure:.92,spark:"#000000",title:"Under the Snow Roof, Ground Blizzard"}};var Rl={id:"under-the-snow-roof",name:"Under the Snow Roof",category:"wilderness",weirdness:.05,media:["tiny","interior","snow"],async build(y){const _=y.rng,vt=y.noise,mt=y.vary||{hour:"any",rare:!1,density:1,mood:.5},lt=y.quality?.detail??1,Bt=Vt(mt.density??1,.7,1.3),Xt=_.fork("snow-roof-look"),ue=Xt();let Ot=ue<.3?"noon":ue<.48?"twilight":ue<.62?"thaw":ue<.76?"blizzard":ue<.9?"night":"noon";const te=Xt()<.5?"noon":"thaw";mt.hour==="night"?Ot="night":mt.hour==="dawn"||mt.hour==="golden"?Ot="twilight":mt.hour==="day"&&(Ot==="night"||Ot==="twilight")&&(Ot=te);const ct=kl[Ot],be={noon:{c:[1,.7,.36],k:1.5,shaft:2.4},thaw:{c:[1,.78,.46],k:1.1,shaft:1.9},blizzard:{c:[.8,.85,.92],k:.45,shaft:1.4},twilight:{c:[1,.8,.72],k:.45,shaft:1.1},night:{c:[.5,.72,1.2],k:.3,shaft:1.5}}[Ot],ie=Ot==="thaw"?"april":Xt.pick(["mid","mid","early","april"]),Lt=Xt.chance(.3),re=Xt.chance(.35),Oe=Xt.chance(.3),Zt=!!mt.rare,_t=(t,e=1)=>new R.Color(t).multiplyScalar(e),$t=t=>y.core.makeRng(y.core.hashSeed("snow-roof-"+t+":"+y.seed));let i=$t("homes");const ut=t=>(i=$t(t),i),W=new R.Scene,dt=_t(ct.fog);W.fog=new R.FogExp2(dt.clone(),ct.fogD),W.background=dt.clone().multiplyScalar(.6);const gt=["#0E1E4A",ct.cobalt,ct.turq,"#D6F6F2","#B4975A","#C21F2E","#F7FBFF"],ft=await Ki(y,{palette:gt,hour:ct.hour,weather:ct.weather,roofGlow:ct.glow});W.add(ft.object);const Wt=ft.anchors,yt=ft.object.children[0].material.uniforms;await y.yield();const $={uTime:{value:0},uPatch:{value:Array.from({length:32},()=>new R.Vector4(0,0,1,0))},uHoof:{value:Array.from({length:4},()=>new R.Vector4(0,0,0,0))},uShadow:yt.uShadow,uShadowN:yt.uShadowN,uShadowW:yt.uShadowW,uWell:{value:new R.Vector4(0,0,0,0)},uTurq:{value:_t(ct.turq)},uCobalt:{value:_t(ct.cobalt)},uDayCol:yt.uDayCol,uShadowCol:{value:_t(ct.shadow||"#0E1E4A")},uThickAmp:{value:ct.amp??.48},uPatchK:{value:ct.patchK??1},uGreenThin:{value:ct.greenThin||0},uSwell:{value:ct.swell??.42},uAurBand:{value:Ot==="night"?.85:0},uDim:yt.uDim,uCrGrow:yt.uCrGrow,uCrA:yt.uCrA,uHole:yt.uHole,uGlow:{value:ct.glow},uGreen:{value:ct.green},uBand:{value:ct.band},uSeedF:{value:$t("drift").range(0,40)},uDay:yt.uDay,uPool0:{value:new R.Vector4(0,1e4,1,0)},uPool1:{value:new R.Vector4(0,1e4,1,0)},uPool2:{value:new R.Vector4(0,1e4,1,0)},uHoleR:{value:new b(4.6,6.6,3.4)},uPool3:{value:new R.Vector4(0,1e4,1,0)},uPool4:{value:new R.Vector4(0,1e4,1,0)},uHoleR2:{value:new R.Vector2(3,1.8)},uAur:{value:new R.Vector4(0,1e4,1,0)},uLobe:{value:Oe?.3:1.15},uGrey:{value:ct.grey},uThickOff:{value:ct.thick},uVole:{value:new R.Vector4(0,0,1e4,0)},uDome:{value:0},uLee:{value:new R.Vector4(0,1e4,1,0)},uLeeCol:{value:new b(...be.c)}},Ht=-Xt.range(.3,.42),X=Xt.range(.4,.52),kt=-Xt.range(.24,.34),Yt=Xt.range(.26,.36),Rt=[[0,Ht],[140,Ht],[270,X],[352,X],[412,kt],[452,kt],[512,Yt],[530,Yt],[585,0],[672,0]],jt=672,he=new Float32Array(jt+1),ee=new Float32Array(jt+1);ee[jt]=6.24;for(let t=jt;t>0;t--){const e=_o(Rt,t-.5,!0);he[t-1]=he[t]-Math.sin(e),ee[t-1]=ee[t]+Math.cos(e)}const fe=[[0,3],[150,3],[185,3.5],[255,3.5],[290,3.3],[540,3.2],[576,Wt.flyThrough[0].y]],ke=[];for(let t=0;t<=576;t+=12)ke.push([he[t],_o(fe,t,!0),ee[t]]);for(const t of Wt.flyThrough)ke.push([t.x,t.y,t.z]);const At=_i(ke),ot=At.length,j=ot-73.6;ft.setClimb((ot-60)/ot),await ft.clearSedge(At);const wt=[[.392,-1],[.486,.8],[.582,-.8],[.651,0]],Tt=wt.map(([t])=>t*ot+19.5),Gt=t=>Tt.some(e=>Math.abs(t-e)<11),Q=-24,Ft=Math.floor(j)-2,Qt=Ft+58,Jt=Qt-Q+1,se=new Float32Array(Jt),de=new Float32Array(Jt),pe=new Float32Array(Jt),a0=new Float32Array(Jt);{const t=new b,e=new b;for(let o=0;o<Jt;o++){const a=Q+o;if(a<=Ft){At.posAtDist(a,t),At.tangentAtDist(Math.max(a,0),e);const s=Math.hypot(e.x,e.z)||1;se[o]=t.x,de[o]=t.z,pe[o]=e.x/s,a0[o]=e.z/s}else{const s=Ft-Q;se[o]=se[s],de[o]=de[s]-(a-Ft),pe[o]=0,a0[o]=-1}}}const tt={x:0,z:0,tx:0,tz:-1},Ke=t=>{const e=Vt(t-Q,0,Jt-1.001),o=Math.floor(e),a=e-o;return tt.x=it(se[o],se[o+1],a),tt.z=it(de[o],de[o+1],a),tt.tx=it(pe[o],pe[o+1],a),tt.tz=it(a0[o],a0[o+1],a),tt},g={x:0,z:0},I=(t,e)=>(Ke(t),g.x=tt.x-tt.tz*e,g.z=tt.z+tt.tx*e,g),Os=205,Hs=9,Fo=29,nr=Xt.range(0,T);I(Os,Hs);const Us=g.x,Gs=g.z,Io=Math.round(.755*ot+15),Ze=(t,e,o,a,s,l,n=0)=>{Ke(t);let r=Math.atan2(tt.tx,-tt.tz)+e*o,h=tt.x,d=tt.z;const v=[[h,d]];for(let u=0;u<a;u+=3)r+=e*n*3,h+=Math.sin(r)*3,d-=Math.cos(r)*3,v.push([h,d]);return{s0:t,side:e,len:a,w:s,H:l,P:v,sMin:t-16-(o>1.6?a:0),sMax:t+a+16}},Ko=[Ze(233,-1,1.25,42,6.2,9.6,-.004),Ze(224,1,1.3,42,5.6,9),Ze(146,-1,1.3,26,3,4.2),Ze(158,1,1.9,20,3,4.2),Ze(296,-1,1.1,22,4,4.6),Ze(494,-1,1.35,30,3.8,5.6),Ze(360,1,1.25,20,4,4.6),Ze(486,1,1.2,30,3.8,5.6),Ze(314,1,1.3,18,3,4.2),Ze(Io,1,.85,24,3.6,5.6),Ze(205,1,1.5,48,5.6,9),Ze(398,-1,1.5,20,3,4.2)],b0=[{id:"thicket",s:77,t:3,R:17,H:10.5,mound:0,sprigs:46,moss:120,thin:[3,0,20,.16]},{id:"cellar",s:100,t:5,R:16,H:12.5,mound:0,sprigs:10,moss:80,thin:[0,0,15,.22]},{id:"ice",s:138,t:-2,R:18,H:15.5,mound:0,fans:250,crystals:320,thin:[0,0,25,.44]},{id:"cross",s:236,t:-4,R:17,H:13.5,mound:0},{id:"foxAnte",s:246,t:2,R:13,H:10,mound:0,fans:46,crystals:50,sprigs:10,moss:100,thin:[0,0,19,.24]},{id:"fox",s:272,t:-2,R:21,H:15.5,mound:0,sprigs:8,moss:70,thin:[0,0,26,.16]},{id:"melt",s:313,t:1,R:14,H:9.5,mound:0,moss:150,thin:[13,-1,30,.3]},{id:"melt2",s:338,t:-1,R:14,H:10.5,mound:0,moss:150},{id:"grotto",s:368,t:-2,R:14,H:10,mound:2,moss:520,sprigs:14,lichen:9,thin:[0,0,18,.26]},{id:"rockAnte",s:398,t:0,R:13,H:10,mound:0,stones:14,moss:120,sprigs:6,thin:[10,0,30,.28]},{id:"rock",s:424,t:5,R:20,H:17,mound:0,moss:100},{id:"lichenAnte",s:456,t:0,R:13,H:10,mound:1.6,lichen:14,moss:80,thin:[0,0,16,.2]},{id:"lichen",s:481,t:1,R:17,H:11.5,mound:2.4,lichen:30,moss:80,thin:[0,0,25,.34]},{id:"iceAnte",s:508,t:-1,R:12,H:11,mound:0,fans:90,crystals:120,thin:[0,0,16,.3]},{id:"ptar",s:534,t:15,R:25,H:28,mound:0,crystals:40,thin:[7,3,27,.14]},{id:"last",s:572,t:0,R:12,H:9.5,mound:1.4,sprigs:18,moss:220,lichen:6,thin:[0,0,15,.26]}];for(const t of b0)I(t.s,t.t),t.x=g.x,t.z=g.z,t.ph=$t("room-"+t.id).range(0,T);const Es=Object.fromEntries(b0.map(t=>[t.id,t]));await y.yield();const rr=t=>Math.max(.62,1-.38*z(50,62,t),.85*z(170,178,t)*(1-z(246,254,t)),z(578,590,t)),ir=(t,e)=>{e[0]=z(114,122,t)*(1-z(166,170,t)),e[1]=z(254,258,t)*(1-z(350,358,t)),e[2]=z(350,358,t)*(1-z(442,450,t)),e[3]=z(442,450,t)*(1-z(552,560,t))},M0=(t,e,o,a=8)=>z(t,t+a,o)*(1-z(e-a,e,o)),_s=[[[240.3,-22],[236.3,-10],[235.4,0],[232.6,9],[229.4,20]],[[497.3,-14.6],[493,-8],[489,-1],[488.2,5.5],[489.3,8.4],[491.4,14]]],Fa=[[210.1,10.65],[207.6,14.3],[199.5,20],[213,21.5],[222.5,21],[218,24.5],[228,9.5],[206,22.5],[224,14.5]],Is=(t,e,o)=>{let a=1e9;for(let s=0;s+1<t.length;s++){const l=t[s][0],n=t[s][1],r=t[s+1][0]-l,h=t[s+1][1]-n,d=Vt(((e-l)*r+(o-n)*h)/(r*r+h*h),0,1),v=l+r*d-e,u=n+h*d-o;a=Math.min(a,v*v+u*u)}return Math.sqrt(a)},s0=(t,e)=>Math.min(Is(_s[0],t,e),Is(_s[1],t,e)),lr=(t,e)=>{let o=s0(t,e);for(const a of Fa)o=Math.min(o,Math.hypot(t-a[0],e-a[1])+2);return 1-z(5,9.5,o)},La=(t,e)=>s0(t,e)<9,Ce={s:100,t:13},C0={s:104,t:7.6},zt={s:276,t:-3},n0={s:434,t:20.5},Ye={s:425.5,t:7.5},$e={s:423.5,t:5},Se={s:545,t:21},Wa=[[196,11],[176,21],[226,28],[183,-12],[238,12]],Ks=[[3.45,15,3.8,1.6,1.1],[4.45,7,3.2,1.2,1],[2.7,12,3.4,1.4,.95],[1.9,9,2.6,1,.8],[5.8,9,2.8,1.1,.8],[.6,8,2.4,.9,.7],[3.95,4.6,2.2,.5,.6]],cr=[[Ce.s,Ce.t,8.5],[C0.s,C0.t,4.4],[91,10.2,3.6],[zt.s,zt.t,8.6],[n0.s,n0.t,16.6],[Se.s,Se.t,11],...Wa.map(([t,e])=>[t,e,2.6]),...Fa.map(([t,e])=>[t,e,4])],I0=new Float32Array(600),Me=t=>{const e=Vt(t,0,598.99),o=Math.floor(e);return it(I0[o],I0[o+1],e-o)},Lo=[[303.5,-15.5],[300.5,-9],[300,-4],[305,-.8],[315,.9],[324,2.4],[332,.4],[340,-2.2],[348,-.3],[354,3.2],[359.5,7],[363,11.5],[365,16]],Ra={d:0,s:0},hr=(t,e)=>{let o=1e9,a=0;for(let s=0;s+1<Lo.length;s++){const l=Lo[s][0],n=Lo[s][1],r=Lo[s+1][0]-l,h=Lo[s+1][1]-n,d=Vt(((t-l)*r+(e-n)*h)/(r*r+h*h),0,1),v=l+r*d-t,u=n+h*d-e,f=v*v+u*u;f<o&&(o=f,a=l+r*d)}return Ra.d=Math.sqrt(o),Ra.s=a,Ra},fr=t=>2.3+.9*z(304,314,t)*(1-z(352,360,t))+1.8*Math.exp(-(((t-316)/6)**2))+3.3*Math.exp(-(((t-338)/7)**2)),Wo=-.62,Na={d:0,k:0},vr=(t,e,o)=>{let a=1e9,s=0;const l=t.P,n=l.length-1;for(let r=0;r<n;r++){const h=l[r][0],d=l[r][1],v=l[r+1][0]-h,u=l[r+1][1]-d,f=Vt(((e-h)*v+(o-d)*u)/(v*v+u*u),0,1),c=h+v*f-e,p=d+u*f-o,m=c*c+p*p;m<a&&(a=m,s=(r+f)/n)}return Na.d=Math.sqrt(a),Na.k=s,Na},z0=40,St=2*z0+1,He=1.25,Ae=12,k0=t=>t*.55+Math.sign(t)*.0135*t*t,Zs=t=>Math.sign(t)*(-.55+Math.sqrt(.3025+.054*Math.abs(t)))/.027,Zo=Math.ceil((Qt-Q)/He/Ae/2)*2,Ue=Zo*Ae+1,Ca=Zo*He,K0=Q+(Ue-1)*He,It=t=>Vt(Math.floor((t-Q)/Ca),0,Ae-1),r0=Array.from({length:Ae},(t,e)=>({s0:Q+e*Ca,s1:Q+(e+1)*Ca,objs:[],det:[]})),lo=new Float32Array(Ue*St),co=new Float32Array(Ue*St),u0=new Float32Array(Ue*St),Et=new Float32Array(Ue*St),Pa=new Float32Array(Ue*St),Yo=ie==="april"?.94:1,Ys=12.5,ur=26,dr=I(427,9.5).x,pr=g.z,qa=[],$o=[],$s=[],jo=new Float32Array(Ue*St),ho=t=>{for(let e=0;e<qa.length;e++)Et[qa[e]]=t?$s[e]:$o[e]},mr=[[Q,10],[-1,10],[17,4.7],[560,4.6],[598,10.2],[Ft+30,10.2],[Ft+55,.3]],wr=[[Q,12],[-1,12],[17,7],[560,6.9],[598,Ne+1.3]],gr=[[Q,2.6],[560,2.6],[598,4.2]];for(let t=0;t<Ue;t++){const e=Math.min(Q+t*He,Qt-.01),o=_o(mr,e)*(1+.12*vt.n2(e*.035,3.1)),a=_o(wr,e)*(1+.07*vt.n2(e*.05,9.2))*Yo,s=_o(gr,e),l=.5*vt.n2(e*.03,5.5)*(1-z(540,570,e));Ke(e);const n=tt.x,r=tt.z,h=-tt.tz,d=tt.tx;for(let v=0;v<St;v++){const u=k0(v-z0),f=n+h*u,c=r+d*u,p=t*St+v;lo[p]=f,co[p]=c;const m=f-Us,w=c-Gs,x=Math.hypot(m,w),k=x<Fo*1.3,A=Math.hypot(f,c-ve),L=z(46,30,A);let M=-.08+.2*vt.fbm2(f*.1,c*.1,2)*z(2,6,Math.abs(u));k&&(M+=3*Math.max(0,vt.fbm2(f*.045+31,c*.045,2)+.12)*z(7,15,Math.abs(u))*z(Fo*1.3,Fo*.9,x)*(1-.88*lr(e,u))),M=it(M,-.08,L);const C=it(o,10.6,L),F=it(a,Ne+2.6,L),N=it(s,7,L);let V=C>.35?F*(1-Math.pow(Math.abs(u-l)/C,N)):-1;if(k){const P=Fo*(1+.1*Math.sin(3*Math.atan2(w,m)+nr)+.07*vt.n2(f*.06,c*.06));x<P*1.05&&(V=Math.max(V,18.5*Yo*(1-Math.pow(x/P,2.4))-(M+.08)))}for(const P of b0){if(Math.abs(e-P.s)>P.R*1.45)continue;const J=f-P.x,pt=c-P.z,xt=Math.hypot(J,pt);if(xt>P.R*1.3)continue;const Nt=P.R*(1+.1*Math.sin(3*Math.atan2(pt,J)+P.ph)+.07*vt.n2(f*.06+P.s,c*.06));if(P.mound){const qt=P.mound*Math.max(0,vt.fbm2(f*.07+11,c*.07,2)+.15)*z(4.5,10,Math.abs(u))*z(P.R*1.25,P.R*.85,xt);M+=qt,Pa[p]+=qt}xt<Nt*1.05&&(V=Math.max(V,P.H*Yo*(1-Math.pow(xt/Nt,2.4))-(M+.08)))}let G=0;if(V>8){const P=f-dr,J=c-pr,pt=Math.hypot(P,J);if(pt<Ys){const xt=ur*Yo*(1-Math.pow(pt/Ys,2.4))-(M+.08);xt>V&&(G=(xt-V)*z(8,15.5,V))}}for(const P of Ko){if(e<P.sMin||e>P.sMax)continue;const J=vr(P,f,c),pt=P.w*(1-z(.6,1,J.k));pt>.3&&J.d<pt*1.2&&(V=Math.max(V,P.H*(.55+.45*(1-z(.5,1,J.k)))*(1-Math.pow(J.d/pt,2.4))))}if(V>0&&(V+=(vt.n2(f*.33,c*.33)*.36+vt.n2(f*.9,c*.9)*.13)*Vt(V/2.5,0,1)),e>290&&e<372){const P=hr(e,u),J=1-(P.d/fr(P.s))**2;if(J>0){const pt=1.3*J*(2-J);M-=pt,V>0&&(V+=pt)}}{const P=4.8*(1-z(1,17,e));P>0&&(M-=P,V>0&&(V+=P))}u0[p]=M,Et[p]=Math.max(V,-.6),G>0&&(qa.push(p),$o.push(Et[p]),Et[p]=V+G,$s.push(Et[p]),jo[p]=Et[p]-$o[$o.length-1])}await y.yield()}const Ro=(t,e,o)=>{const a=Vt((e-Q)/He,0,Ue-1.001),s=Vt(Zs(o)+z0,0,St-1.001),l=Math.floor(a),n=Math.floor(s),r=a-l,h=s-n,d=l*St+n;return it(it(t[d],t[d+1],h),it(t[d+St],t[d+St+1],h),r)},rt=(t,e)=>Ro(Et,t,e),Z=(t,e)=>Ro(u0,t,e);{const e=new Float32Array(600),o=new Float32Array(600),a=new Float32Array(600),s=new Float32Array(600),l=(f,c)=>{if(rt(f,c-1.8)<4.4||rt(f,c+1.8)<4.4||f>290&&f<372&&Z(f,c)<Wo+.3)return!1;for(const p of cr)if((f-p[0])*(f-p[0])+(c-p[1])*(c-p[1])<p[2]*p[2])return!1;return!0};let n=-1,r=1;for(let f=0;f<600;f++){let c=0,p=0,m=-1e9,w=0,x=!1;for(let k=0;k<=85;k++){const A=-10.5+k*.25,L=k<=84&&l(f,A);if(L&&!x)w=A,x=!0;else if(!L&&x){x=!1;const M=A-.25,C=Math.min(M,r)-Math.max(w,n)+.02*(M-w);C>m&&(m=C,c=w,p=M)}}m>-1e8&&(n=c,r=p),e[f]=.5*(n+r),o[f]=.5*(r-n),(f&63)===63&&await y.yield()}const h=(f,c,p)=>{for(let m=0;m<600;m++){let w=0,x=0;for(let k=Math.max(0,m-p);k<=Math.min(599,m+p);k++)w+=f[k],x++;c[m]=w/x}};for(let f=0;f<600;f++){let c=1e9;for(let p=Math.max(0,f-5);p<=Math.min(599,f+5);p++)c=Math.min(c,o[p]);a[f]=c}h(a,o,4),h(e,a,5),h(a,s,5);const d=Math.tan(.85);let v=0,u=0;for(let f=0;f<600;f++){const c=Math.min(o[f],5.5),p=.8*Math.sin(v+.6)+.2*Math.sin(v*2.3+2.1);let m=(s[f]+c*p)*z(24,40,f);m=it(m,Math.max((f-Io-1.5)*d,-3),z(Io-6,Io+6,f)),I0[f]=m;const w=Math.hypot(1,m-u);v+=T*w/(26+5*c),u=m}for(let f=0;f<2;f++){let c=I0[0];for(let p=1;p<599;p++){const m=I0[p];I0[p]=.25*c+.5*m+.25*I0[p+1],c=m}}await y.yield();for(let f=0;f<Ue;f++){const c=Math.min(Q+f*He,Qt-.01),p=Me(c);for(let m=0;m<St;m++){const w=f*St+m;if(Pa[w]<=0)continue;const x=Pa[w]*.85*(1-z(2.6,5.6,Math.abs(k0(m-z0)-p)));u0[w]-=x,Et[w]>0&&(Et[w]+=x)}}}await y.yield();const xr=t=>1-z(98,106,t)*(1-z(300,310,t)),yr=t=>z(30,40,t)*(1-z(96,104,t))+z(430,438,t)*(1-z(470,478,t)),br=(t,e)=>{e.push(Math.max(M0(118,170,t),.7*M0(296,354,t)),M0(254,354,t),M0(354,446,t),M0(446,566,t))},js=async(t,e,o)=>{for(let a=0;a<Ae;a++){const s=a*Zo,l=(a+1)*Zo,n=(l-s)/e+1,r=(St-1)/e+1,h=new Int32Array(n*r).fill(-1),d=[],v=[],u=[],f=[],c=[],p=[],m=(A,L)=>u0[A*St+L]+(t?Et[A*St+L]:0),w=(A,L)=>{const M=(A-s)/e*r+L/e;if(h[M]>=0)return h[M];const C=A*St+L,F=Math.max(A-e,0),N=Math.min(A+e,Ue-1),V=Math.max(L-e,0),G=Math.min(L+e,St-1),P=lo[N*St+L]-lo[F*St+L],J=m(N,L)-m(F,L),pt=co[N*St+L]-co[F*St+L],xt=lo[A*St+G]-lo[A*St+V],Nt=m(A,G)-m(A,V),qt=co[A*St+G]-co[A*St+V];let D=J*qt-pt*Nt,E=pt*xt-P*qt,q=P*Nt-J*xt;const B=Math.hypot(D,E,q)||1,K=E<0===t?1:-1;return d.push(lo[C],m(A,L),co[C]),v.push(D/B*K,E/B*K,q/B*K),u.push(Et[C]),f.push(yr(Q+A*He),xr(Q+A*He)),br(Q+A*He,c),t||(c[c.length-4]=M0(288,373,Q+A*He,3)),h[M]=d.length/3-1};for(let A=s,L=0;A<l;A+=e,L++){for(let M=0;M<St-1;M+=e){if(Math.max(Et[A*St+M],Et[(A+e)*St+M],Et[A*St+M+e],Et[(A+e)*St+M+e])<-.25)continue;const F=w(A,M),N=w(A+e,M),V=w(A+e,M+e),G=w(A,M+e);p.push(F,N,V,F,V,G)}(L&7)===7&&await y.yield()}if(await y.yield(),!p.length)continue;const x=new R.BufferGeometry;x.setAttribute("position",new R.Float32BufferAttribute(d,3)),x.setAttribute("normal",new R.Float32BufferAttribute(v,3)),x.setAttribute("aG",new R.Float32BufferAttribute(u,1)),x.setAttribute("aZ",new R.Float32BufferAttribute(f,2)),x.setAttribute("aW",new R.Float32BufferAttribute(c,4)),x.setIndex(p),x.computeBoundingSphere();const k=new R.Mesh(x,o);k.matrixAutoUpdate=!1,W.add(k),r0[a].objs.push(k),await y.yield()}},fo=ie==="early"?1:0,Mr=Te($,{vs:Xi,fs:Qi}),Ge=Array.from({length:10},()=>new R.Vector4(0,1e4,1,0)),zr=Te($,{vs:Ji,fs:tl,uniforms:{uBlob:{value:Ge},uWet:{value:ct.wet},uWaterY:{value:Wo},uMossA:{value:_t(ct.wet?"#1d4418":"#22381c")},uMossB:{value:_t(ct.wet?"#5c8a2a":fo?"#5d7a2c":"#55682e")}}});await js(!0,1,Mr),await js(!1,2,zr),await y.yield();const Xs=(I(Se.s,Se.t),[g.x,g.z]),vo=(t,e)=>Math.hypot(t-Xs[0],e-Xs[1])<15,uo={x:0,z:0,l:0},Sl=(t,e)=>{const o=(rt(t+.8,e)-rt(t-.8,e))/1.6,a=rt(t,e+.5)-rt(t,e-.5);return Ke(t),uo.x=tt.tx*o-tt.tz*a,uo.z=tt.tz*o+tt.tx*a,uo.l=Math.hypot(uo.x,uo.z),uo},Z0=()=>{const t=i.range(0,T),e=Fo*Math.sqrt(i())*.97;return[Os+Math.sin(t)*e,Hs+Math.cos(t)*e]},kr=Lt?Math.round(2+(Bt-.7)/.6*7):3,Va=[];for(let t=0;t<kr;t++){const e=Fa[t%9];Va.push([e[0]+i.range(-.4,.4),e[1]+i.range(-.4,.4)])}const Y0=[],Da=[],d0=[];{const t=$t("stones");for(let o=0;o<11;o++){const a=t.range(410,444),s=t.range(5.6,11),l=t.range(.7,2.2),n=t.range(.55,.85),r=t.range(0,50),h=t.range(.8,1.2);rt(a,s)<2||Math.hypot(a-$e.s,s-$e.t)<3.2||Math.abs(s-Me(a))<l*1.25+1.3||Y0.push([a,s,l,n,h,r,.45])}for(let o=0;o<Es.rockAnte.stones;o++){const a=t.range(386,411),s=t.range(4.8,11.5)*t.sign(),l=t.range(.8,2.6),n=t.range(.5,.85),r=t.range(0,50),h=t.range(.8,1.2);rt(a,s)<2||Math.abs(s-Me(a))<l*1.25+1.3||Y0.push([a,s,l,n,h,r,.4])}const e=$t("fox-heap");for(let o=0;o<16;o++){const a=e.range(0,T),s=e.range(1,6.5);Da.push([zt.s+Math.cos(a)*s,zt.t+Math.sin(a)*s,e.range(.4,1),e.range(.8,1.2),e.range(0,50),s])}for(const o of Y0)d0.push([o[0],o[1],o[2]]);for(let o=0;o<28;o++){const a=o/28*T;d0.push([n0.s+Math.cos(a)*16.3,n0.t+Math.sin(a)*13.8,.5])}for(let o=0;o<6;o++){const a=o/6*T;d0.push([Ce.s+Math.cos(a)*4.5,Ce.t+Math.sin(a)*4.5,.4])}for(const[o,a,,,s]of Ks)for(const l of[.45,1])d0.push([Ce.s+Math.cos(o)*(1.6+a*l),Ce.t+Math.sin(o)*(1.6+a*l),s*(1-.68*l)]);d0.push([Ce.s+Math.cos(4.52)*23.3,Ce.t+Math.sin(4.52)*23.3,.5]);for(const[o,a]of Wa)d0.push([o,a,.9]);d0.push([191.5,-13.5,.4]);for(let o=0;o<12;o++){const a=o/12*T;d0.push([zt.s+Math.cos(a)*5.3,zt.t+Math.sin(a)*4.8,.5])}for(const o of Da)d0.push([o[0],o[1],o[2]])}const No=(t,e)=>((t-n0.s)/16.3)**2+((e-n0.t)/13.8)**2<.94||Math.hypot(t-Ce.s,e-Ce.t)<4.2||Y0.some(o=>Math.hypot(t-o[0],e-o[1])<o[2]*.85),Xo=(t,e,o)=>{for(const[a,s,l]of d0)if(!(Math.abs(s)-l>12))for(let n=0,r=Math.floor(e*(1+l)+t());n<r;n++){const h=t.range(0,T),d=l+t.range(.1,1.25),v=a+Math.cos(h)*d,u=s+Math.sin(h)*d;Math.abs(u)<2.9||rt(v,u)<1.5||Z(v,u)<-.5||No(v,u)||Math.abs(u-Me(v))<1.5||s0(v,u)<4.5||(I(v,u),!vo(g.x,g.z)&&o(v,u,t))}},Ba=()=>Array.from({length:Ae},()=>({P:[],N:[],UV:[],R:[],I:[]})),Ta=Ba(),Sr=[["P",3],["N",3],["S",3],["UV",3],["R",2],["St",4]],Oa=Array.from({length:Ae},()=>({P:new Float32Array(3*32768),N:new Int8Array(3*32768),S:new Int8Array(3*32768),UV:new Float32Array(3*32768),R:new Float32Array(2*32768),St:new Int8Array(4*32768),I:new Uint32Array(3*32768),nv:0,ni:0,cap:32768,capI:3*32768})),Ar=(t,e,o)=>{if(t.nv+e>t.cap){const a=t.cap*2;for(const[s,l]of Sr){const n=new t[s].constructor(a*l);n.set(t[s]),t[s]=n}t.cap=a}if(t.ni+o>t.capI){const a=t.capI*2,s=new Uint32Array(a);s.set(t.I),t.I=s,t.capI=a}},Qo={P:[],N:[],UV:[],R:[],I:[]};let P0=-1,Ha=!1;const $0=[0,0,0,0],Fr=.06*(ie==="early"?.55:1)*lt,Ee=new Float32Array(14),Pe=new Float32Array(14),_e=new Float32Array(14),je=new Float32Array(14),Xe=new Float32Array(14),Qe=new Float32Array(14),po=new Float32Array(14);let Ua=!1,Ga=!1;const Lr=[0,1,2].map(t=>{const e=t/3,o=e*e,a=o*e;return[-.5*a+o-.5*e,1.5*a-2.5*o+1,-1.5*a+2*o+.5*e,.5*a-.5*o,e]}),q0=3,V0=48,i0=new Float32Array(V0),l0=new Float32Array(V0),c0=new Float32Array(V0),Ea=new Float32Array(V0),_a=new Float32Array(V0),Ia=new Float32Array(V0),S0=new Float32Array(V0),Co=new Int16Array(V0),Ka=(t,e,o,a,s,l,n=!1)=>{const r=n?.13:.085,h=n?2*q0:q0;if(t<3)return;for(let q=0;q<3;q++){let B=Ee[0],K=Pe[0],H=_e[0],O=je[0],Y=Xe[0],at=Qe[0];for(let nt=1;nt<t-1;nt++){const st=Ee[nt],S=Pe[nt],U=_e[nt];Ee[nt]=(B+2*st+Ee[nt+1])*.25,Pe[nt]=(K+2*S+Pe[nt+1])*.25,_e[nt]=(H+2*U+_e[nt+1])*.25,B=st,K=S,H=U;const ht=je[nt],bt=Xe[nt],Dt=Qe[nt];je[nt]=(O+2*ht+je[nt+1])*.25,Xe[nt]=(Y+2*bt+Xe[nt+1])*.25,Qe[nt]=(at+2*Dt+Qe[nt+1])*.25,O=ht,Y=bt,at=Dt}}const d=(t-1)*q0+1;for(let q=0;q<t-1;q++){const B=Math.max(q-1,0),K=q+1,H=Math.min(q+2,t-1);for(let O=0;O<q0;O++){const Y=Lr[O],at=Y[0],nt=Y[1],st=Y[2],S=Y[3],U=Y[4],ht=q*q0+O;i0[ht]=at*Ee[B]+nt*Ee[q]+st*Ee[K]+S*Ee[H],l0[ht]=at*Pe[B]+nt*Pe[q]+st*Pe[K]+S*Pe[H],c0[ht]=at*_e[B]+nt*_e[q]+st*_e[K]+S*_e[H],Ea[ht]=je[q]+(je[K]-je[q])*U,_a[ht]=Xe[q]+(Xe[K]-Xe[q])*U,Ia[ht]=Qe[q]+(Qe[K]-Qe[q])*U}}i0[d-1]=Ee[t-1],l0[d-1]=Pe[t-1],c0[d-1]=_e[t-1],Ea[d-1]=je[t-1],_a[d-1]=Xe[t-1],Ia[d-1]=Qe[t-1];let v=1,u=0,f=0,c=i0[1]-i0[0],p=l0[1]-l0[0],m=c0[1]-c0[0],w=Math.sqrt(c*c+p*p+m*m)||1e-6;Co[0]=0,S0[0]=0;for(let q=1;q<d;q++){if(S0[q]=S0[q-1]+w,q===d-1){Co[v++]=q;break}const B=i0[q+1]-i0[q],K=l0[q+1]-l0[q],H=c0[q+1]-c0[q],O=Math.sqrt(B*B+K*K+H*H)||1e-6;u+=Math.sqrt(Math.max(2-2*(c*B+p*K+m*H)/(w*O),0)),f++,c=B,p=K,m=H,w=O,(u>r||f>=h)&&(Co[v++]=q,u=0,f=0)}const x=S0[d-1];if(x<.5)return;let k=0,A=0,L=0,M=127,C=0,F=!1,N=0;P0>=0&&(ir(P0,$0),k=Math.round(($0[0]-$0[3])*127),A=Math.round($0[1]*127),L=Math.round($0[2]*127),C=$0[1],Ha&&o*37.1%1<$0[3]*.85&&(M=Math.round((.3+.4*(o*91.7%1))*127)));const V=M/127,G=Oa[s];Ar(G,v*2,(v-1)*6);const P=G.nv,J=G.P,pt=G.N,xt=G.S,Nt=G.UV,qt=G.R,D=G.I,E=G.St;for(let q=0;q<v;q++){const B=Co[q],K=Math.max(B-1,0),H=Math.min(B+1,d-1);let O=i0[H]-i0[K],Y=l0[H]-l0[K],at=c0[H]-c0[K];const nt=Math.sqrt(O*O+Y*Y+at*at)||1;O/=nt,Y/=nt,at/=nt;let st=Ea[B],S=_a[B],U=Ia[B];const ht=Math.sqrt(st*st+S*S+U*U)||1;st/=ht,S/=ht,U/=ht;let bt=Y*U-at*S,Dt=at*st-O*U,Ct=O*S-Y*st;const Ve=Math.sqrt(bt*bt+Dt*Dt+Ct*Ct)||1;bt/=Ve,Dt/=Ve,Ct/=Ve;const De=S0[B]/x,We=Math.max(e*.5*Math.pow(1-De,.62)*(.55+.45*Math.min(De*7,1)),.012);let v0=0;if(Ua){const Mt=Math.min(Math.floor(B/q0),t-1),ce=Math.min(Mt+1,t-1);v0=po[Mt]+(po[ce]-po[Mt])*(B-Mt*q0)/q0}if(!F){const Mt=(P+q*2)*3,ce=(P+q*2)*2,xe=ce*2;if(J[Mt]=i0[B]-bt*We,J[Mt+1]=l0[B]-Dt*We+v0,J[Mt+2]=c0[B]-Ct*We,J[Mt+3]=i0[B]+bt*We,J[Mt+4]=l0[B]+Dt*We+v0,J[Mt+5]=c0[B]+Ct*We,pt[Mt]=pt[Mt+3]=st*127,pt[Mt+1]=pt[Mt+4]=S*127,pt[Mt+2]=pt[Mt+5]=U*127,xt[Mt]=xt[Mt+3]=bt*127,xt[Mt+1]=xt[Mt+4]=Dt*127,xt[Mt+2]=xt[Mt+5]=Ct*127,Nt[Mt]=-1,Nt[Mt+1]=De,Nt[Mt+2]=S0[B],Nt[Mt+3]=1,Nt[Mt+4]=De,Nt[Mt+5]=S0[B],qt[ce]=qt[ce+2]=o,qt[ce+1]=qt[ce+3]=a,E[xe]=E[xe+4]=k,E[xe+1]=E[xe+5]=A,E[xe+2]=E[xe+6]=L,E[xe+3]=E[xe+7]=M,N++,V<1&&De>=V)F=!0;else if(q<v-1){const Ut=P+q*2,Be=G.ni;D[Be]=Ut,D[Be+1]=Ut+1,D[Be+2]=Ut+3,D[Be+3]=Ut,D[Be+4]=Ut+3,D[Be+5]=Ut+2,G.ni+=6}}if(l&&q>0&&De<.9&&i()<Fr*(S0[B]-S0[Co[q-1]])/1.2){const Mt=De>V-.03?Qo:Ta[s],ce=Mt.P.length/3,xe=i()<.5?-1:1,Ut=i.range(.12,.25),Be=i.range(.3,.72);let y0=st*.8+bt*xe*.5+i.range(-.3,.3),ro=S*.8+Dt*xe*.5-.25,io=U*.8+Ct*xe*.5+i.range(-.3,.3);const Rs=Math.sqrt(y0*y0+ro*ro+io*io)||1;y0*=Be/Rs,ro*=Be/Rs,io*=Be/Rs;const Ma=i0[B]+bt*xe*We,za=l0[B]+Dt*xe*We+v0,ka=c0[B]+Ct*xe*We,Xn=i();Mt.P.push(Ma-O*Ut,za-Y*Ut,ka-at*Ut,Ma+O*Ut,za+Y*Ut,ka+at*Ut,Ma+O*Ut+y0,za+Y*Ut+ro,ka+at*Ut+io,Ma-O*Ut+y0,za-Y*Ut+ro,ka-at*Ut+io);const Ns=Y*io-at*ro,Cs=at*y0-O*io,Ps=O*ro-Y*y0,qs=Math.sqrt(Ns*Ns+Cs*Cs+Ps*Ps)||1,Ei=C>0&&Xn*7.3%1<C?1+Ut/Be:0;for(let Qn=0;Qn<4;Qn++)Mt.N.push(Ns/qs,Cs/qs,Ps/qs),Mt.R.push(Xn,Ei);Mt.UV.push(0,0,1,0,1,1,0,1),Mt.I.push(ce,ce+1,ce+2,ce,ce+2,ce+3)}}G.nv+=N*2},me={g:0,f:0,gs:0,gt:0},Qs=(t,e)=>{const o=Vt((t-Q)/He,0,Ue-1.001),a=Vt(Zs(e)+z0,1,St-2.001),s=Math.floor(o),l=Math.floor(a),n=o-s,r=a-l,h=s*St+l,d=h+St,v=Et[h],u=Et[h+1],f=Et[d],c=Et[d+1],p=v+(u-v)*r,m=f+(c-f)*r;me.g=p+(m-p)*n,me.gs=(m-p)/He;const w=(Et[h-1]+(v-Et[h-1])*r)*(1-n)+(Et[d-1]+(f-Et[d-1])*r)*n,x=(u+(Et[h+2]-u)*r)*(1-n)+(c+(Et[d+2]-c)*r)*n,k=a-z0;me.gt=(x-w)/(k0(k+1)-k0(k-1));const A=u0[h]+(u0[h+1]-u0[h])*r,L=u0[d]+(u0[d+1]-u0[d])*r;me.f=A+(L-A)*n},Jo=(t,e,o,a,s,l,n,r=7,h=99)=>{const d=Math.abs(e)>6;d&&(r=Math.min(r,Math.abs(e)>14?5:6));const v=s/r,u=It(t),f=Math.cos(o),c=Math.sin(o);let p=0,m=0,w=!1,x=0;for(let k=0;k<=r;k++){Qs(t,e);const A=me.g,L=me.f;if(A<.05)break;const M=A>h;I(t,e);const C=tt.tx*me.gs-tt.tz*me.gt,F=tt.tz*me.gs+tt.tx*me.gt,N=Math.sqrt(C*C+F*F),V=tt.tx*a,G=tt.tz*a;let P=p,J=m;if(N>.03){const E=M?-.0891:f,q=M?.996:c;P=C/N*E+V*q,J=F/N*E+G*q}w&&(P*p+J*m<.2?(P=p,J=m):(P=p*.5+P*.5,J=m*.5+J*.5));const pt=Math.sqrt(P*P+J*J);if(pt<1e-4)break;P/=pt,J/=pt,p=P,m=J,w=!0;const xt=Math.sqrt(C*C+1+F*F),Nt=n*(.6+.4*Math.min(k,2)/2);if(A>5.6&&g.x*g.x+(g.z-ve)*(g.z-ve)<256||(je[x]=C/xt,Xe[x]=-1/xt,Qe[x]=F/xt,Ee[x]=g.x+je[x]*Nt,Pe[x]=Math.max(L+A+Xe[x]*Nt,L+.05),_e[x]=g.z+Qe[x]*Nt,Math.abs(e)<3.4&&Pe[x]<6.8&&!At.isClear(Ee[x],Pe[x],_e[x],l*.5,2.5)))break;Ga&&t>408&&t<446?(po[x]=Ro(jo,t,e),po[x]>0&&(Ua=!0)):po[x]=0,x++;const qt=C*P+F*J,D=v/Math.sqrt(1+qt*qt);if(t+=(P*tt.tx+J*tt.tz)*D,e+=(-P*tt.tz+J*tt.tx)*D,t<Q+1||t>K0-2||Math.abs(e)>42)break}Ka(x,l,i(),fo*i(),u,!0,d),Ua=!1},Za=(t,e,o,a,s,l,n=i)=>{const r=It(t);let h=0;Ke(t);const d=Math.sin(o),v=-Math.cos(o),u=(d*tt.tx+v*tt.tz)*a/4,f=(-d*tt.tz+v*tt.tx)*a/4;for(let c=0;c<=4&&!(rt(t,e)<.6);c++)I(t,e),Ee[h]=g.x,Pe[h]=Z(t,e)+.06+l*(.3+Math.sin(c/4*Math.PI)),_e[h]=g.z,je[h]=0,Xe[h]=1,Qe[h]=0,h++,t+=u,e+=f;Ka(h,s,n(),fo*n(),r,!1)},Po=(t,e,o)=>{const a=Vt((t-Q)/He,0,Ue-1.001),s=Math.floor(a),l=a-s,n=s*St+z0;let r=Et[n+e]*(1-l)+Et[n+e+St]*l;if(r<o)return NaN;for(let h=2;h<z0;h++){const d=n+e*h,v=Et[d]*(1-l)+Et[d+St]*l;if(v<o){const u=(r-o)/Math.max(r-v,.001);return e*(k0(h-1)+(k0(h)-k0(h-1))*u)}r=v}return NaN};ut("thatch");const Wr=Math.round(13500*lt*(.85+.15*Bt));let Ya=0;const Js=(t,e)=>{if(i()>rr(t))return;const o=i();if(P0=t,Ha=!0,o<.04&&!Gt(t)?Jo(t,e,i.range(.05,.45),i.sign(),i.range(13,20),i.range(.2,.36),i.range(.1,.4),13):Jo(t,e,i.range(.85,1.45),i.sign(),i.range(8,16),.17+.25*i()*(.5+.5*i()),i.range(.08,.6),9,2.2+2.6*i()*i()),Ya++,P0=-1,Ha=!1,Qo.P.length)for(const a in Qo)Qo[a].length=0};ho(!1),Ga=!0;for(let t=0;t<5e5&&Ya<Wr;t++){const e=i();if(e<.6){const o=i.range(Q+3,K0-8),a=Po(o,i.sign(),i.range(.15,2.2));a===a&&Math.abs(a)<42&&Js(o,a)}else{let o,a;const s=e<.72;s?[o,a]=Z0():(o=i.range(Q+3,K0-6),a=i.range(-42,42));const l=rt(o,a);l>.15&&l<1.8?Js(o,a):l>1.6&&i()<(s?.03:.2)&&Math.abs(a)>1.2&&(P0=o,Za(o,a,i.range(0,T),i.range(3,8),i.range(.18,.34),i()*i()*.35),P0=-1,Ya++)}(t&3)===3&&await y.yield()}ho(!0),Ga=!1,ut("strike-thatch");for(let t=0,e=Math.round(900*lt);t<e;t++){const o=i.range(596,Ft+40),a=Po(o,i.sign(),i.range(.2,3.2));a===a&&Jo(o,a,i.range(.1,.75),i.sign(),i.range(7,13),.15+.2*i(),i.range(.08,.5),9,3.2+2.6*i()),(t&127)===127&&await y.yield()}ut("arch");for(let t=0;t<30;t++){const e=i.range(27,36),o=i.sign();let a=o*.5;for(;Math.abs(a)<12&&rt(e,a)>.9;)a+=o*.25;Jo(e,a,i.range(-.12,.12),1,i.range(15,21),i.range(.3,.5),i.range(.15,.6),13)}ut("strike-litter");const ta=588,ea=Ft+44,$a=()=>i()<.5?i.gauss()*5.2:i.range(-9.6,9.6);for(let t=0,e=Math.round(520*lt);t<e;t++){const o=i.range(ta,ea),a=$a();rt(o,a)>1.6&&Za(o,a,i.range(0,T),i.range(3,8),i.range(.18,.34),i()*i()*.4,i),(t&31)===31&&await y.yield()}ut("foot-blades"),Xo(i,1.7,(t,e,o)=>{const a=rt(t,e),s=Math.min(o.range(.9,2.3),a*.6),l=o.range(0,T),n=o.range(.08,.4),r=o.range(.3,1),h=Math.cos(l),d=Math.sin(l),v=o.range(.14,.26);let u=g.x,f=Z(t,e)-.06,c=g.z;if(At.isClear(u,f+s*.6,c,s*.6,2.6)){for(let p=0;p<=5;p++){const m=p/5,w=n+r*m*m,x=Math.sin(w),k=Math.cos(w);Ee[p]=u,Pe[p]=f,_e[p]=c,je[p]=k*h,Xe[p]=-x,Qe[p]=k*d,u+=x*h*s/5,f+=k*s/5,c+=x*d*s/5}P0=t,Ka(6,v,o(),fo*o(),It(t),!0),P0=-1}}),await y.yield(),ut("stone-frost");for(const[t,e,o,a]of Y0)for(let s=0,l=Math.round(3+o*3);s<l;s++){const n=i.range(0,T),r=o*.55*Math.sqrt(i()),h=t+Math.cos(n)*r,d=e+Math.sin(n)*r,v=i.range(0,T),u=i.range(.12,.24),f=i.range(.3,.7),c=i();I(h,d);const p=Ta[It(h)],m=p.P.length/3,w=g.x,x=g.z,k=Z(t,e)+o*a*(.42+Math.sqrt(Math.max(1-r/o*(r/o),.2)))-.14,A=Math.cos(v),L=Math.sin(v),M=-L*.35*f+i.range(-.1,.1),C=f,F=A*.35*f+i.range(-.1,.1);p.P.push(w-A*u,k,x-L*u,w+A*u,k,x+L*u,w+A*u+M,k+C,x+L*u+F,w-A*u+M,k+C,x-L*u+F);const N=-L*C,V=L*M-A*F,G=A*C,P=Math.hypot(N,V,G)||1;for(let J=0;J<4;J++)p.N.push(N/P,V/P,G/P),p.R.push(c,0);p.UV.push(0,0,1,0,1,1,0,1),p.I.push(m,m+1,m+2,m,m+2,m+3)}await y.yield(),ut("heaps");for(const[t,e]of Va)for(let o=0;o<26;o++)Za(t+i.range(-2.5,2.5)+4,e+i.range(-2.5,2.5),i.range(0,T),i.range(2,4.5),i.range(.2,.34),i.range(.2,1.4));await y.yield();const tn=[[0,1.45,.05,.05],[.02,1.5,.8,.85],[.06,1.58,1.22,1.42],[.13,1.64,1.52,1.84],[.24,1.7,1.68,2.02],[.38,1.76,1.72,2],[.52,1.82,1.6,1.86],[.63,2,1.48,1.72],[.72,2.5,1.4,1.56],[.8,2.9,1.44,1.56],[.88,2.88,1.24,1.32],[.94,2.7,.9,.94],[.985,2.5,.44,.48],[1,2.44,.06,.06]],en=.5,on=1,an=.3,mo=(Math.max(...tn.map(t=>t[3]))+en)*(1+.26*on)+an,sn=Ba(),ja=(t,e,o,a,s,l)=>{I(t,e);const n=sn[It(t)],r=Z(t,e)-.06,h=g.x,d=g.z,v=c=>{const p=Math.sin(c*12.9898+l*78.233)*43758.5453;return p-Math.floor(p)},u=5+Math.floor(v(1.3)*3.99),f=4;for(let c=0;c<u;c++){const p=a+c*2.39996+(v(c+2.1)-.5)*.9,m=c===0?.06:.12+.5*v(c+5.7),w=c===0?.5:.6+.9*v(c+9.3),x=o*(c===0?1:.55+.42*v(c+13.1)),k=x*(.125+.07*v(c+17.9)),A=(v(c+23.3)-.5)*1.3,L=v(c+31.7),M=Math.cos(p),C=Math.sin(p),F=n.P.length/3;let N=h+M*.08+s*o*.1,V=r,G=d+C*.08;for(let P=0;P<=f;P++){const J=P/f,pt=m+w*J*J,xt=Math.sin(pt)*M,Nt=Math.cos(pt),qt=Math.sin(pt)*C,D=p+Math.PI/2+A*(.4+.6*J),E=Math.cos(D),q=Math.sin(D);let B=Nt*q,K=qt*E-xt*q,H=-Nt*E;const O=Math.hypot(B,K,H)||1;if(B/=O,K/=O,H/=O,n.P.push(N-E*k,V,G-q*k,N+E*k,V,G+q*k),n.N.push(B,K,H,B,K,H),n.UV.push(0,J,1,J),n.R.push(L,x,L,x),P<f){const Y=F+P*2;n.I.push(Y,Y+1,Y+3,Y,Y+3,Y+2)}N+=xt*x/f,V+=Nt*x/f,G+=qt*x/f}}};ut("plumes");for(const t of b0){if(!t.fans)continue;const e=t.H/15.5;for(let o=0,a=Math.round(t.fans*lt);o<a;o++){const s=i.range(0,T),l=t.R*i.range(.42,.98),n=t.s+Math.cos(s)*l,r=t.t+Math.sin(s)*l,h=rt(n,r),d=Math.min(i.range(1.6,4.6)*e,h*.8),v=i.range(0,T),u=i.range(-.3,.3),f=i();Math.abs(r)<4.6||h<1.2||Math.abs(r-Me(n))<2.8||(ja(n,r,Math.min(.95+.26*d/e,h*.7),v,u,f),(o&31)===31&&await y.yield())}for(let o=0,a=Math.round(t.fans*.5*lt);o<a;o++){const s=i.range(0,T),l=t.R*i.range(.26,1),n=t.s+Math.cos(s)*l,r=t.t+Math.sin(s)*l,h=i.range(.55,1.25),d=i.range(0,T),v=i(),u=rt(n,r);Math.abs(r)<3.4||u<1||Math.abs(r-Me(n))<2.8||(ja(n,r,Math.min(h,u*.7),d,0,v),(o&31)===31&&await y.yield())}}{const t=$t("last-hoar");for(let e=566,o=0;e<640;e+=.7){(++o&15)===15&&await y.yield();const a=e+.7*t(),s=t.sign()*t.range(3,8.5),l=t.range(.45,1),n=t.range(0,T),r=t();rt(a,s)<1.6||Math.abs(s)<2.7+.8*l||Math.abs(s-Me(a))<mo+.8*l||No(a,s)||(I(a,s),At.isClear(g.x,Z(a,s)+.5*l,g.z,.9*l,2.5)&&ja(a,s,l,n,0,r))}}await y.yield();const Xa=(t,e,o)=>Te($,{vs:t,fs:e,uniforms:o}),Rr=Xa(el,ol,{uStraw:{value:_t("#BC9C5A")},uStraw2:{value:_t("#8f7a50")},uGreenBase:{value:_t("#5f7a34")}}),Nr=Xa(al,sl),Cr=Xa(nl,rl);await y.yield();const Qa=async(t,e)=>{for(let o=0;o<t.length;o++){const a=t[o];if(!a.I.length)continue;const s=new R.BufferGeometry;s.setAttribute("position",new R.Float32BufferAttribute(a.P,3)),s.setAttribute("normal",new R.Float32BufferAttribute(a.N,3)),s.setAttribute("aUv",new R.Float32BufferAttribute(a.UV,2)),s.setAttribute("aRnd",new R.Float32BufferAttribute(a.R,2)),s.setIndex(a.I),s.computeBoundingSphere();const l=new R.Mesh(s,e);l.matrixAutoUpdate=!1,W.add(l),r0[o].det.push(l),await y.yield()}};for(let t=0;t<Ae;t++){const e=Oa[t];if(!e.ni)continue;const o=new R.BufferGeometry,a=e.nv;await y.yield(),o.setAttribute("position",new R.BufferAttribute(e.P.slice(0,a*3),3)),o.setAttribute("normal",new R.BufferAttribute(e.N.slice(0,a*3),3,!0)),o.setAttribute("aSide",new R.BufferAttribute(e.S.slice(0,a*3),3,!0)),o.setAttribute("aUv",new R.BufferAttribute(e.UV.slice(0,a*3),3)),o.setAttribute("aRnd",new R.BufferAttribute(e.R.slice(0,a*2),2)),o.setAttribute("aSt",new R.BufferAttribute(e.St.slice(0,a*4),4,!0)),o.setIndex(new R.BufferAttribute(e.I.slice(0,e.ni),1)),o.computeBoundingSphere();const s=new R.Mesh(o,Rr);s.matrixAutoUpdate=!1,W.add(s),r0[t].det.push(s),Oa[t]=null,await y.yield()}await y.yield(),await Qa(Ta,Nr),await y.yield(),await Qa(sn,Cr),await y.yield();const Pr=t=>{const e=new ze,o=[],a=t?[[.04,0,0,0],[.18,-.14,0,0],[.23,-.27,0,0],[.37,-.4,0,0],[.42,-.56,0,0],[.57,-.7,0,0],[.66,-.86,1,0],[.57,-.848,1,1],[.36,-.52,0,1]]:[[.05,0,0,0],[.24,-.2,0,0],[.45,-.55,0,0],[.66,-.86,1,0],[.56,-.845,1,1],[.34,-.5,0,1]],s=t?12:6,l=a.length-1;a.forEach(([h,d,v,u],f)=>{const c=[];for(let p=0;p<s;p++){const m=t?(Math.floor(p/2)+(p%2?.11:-.11)+.03*f)/6*T:(p+.08*f)/6*T;c.push(e.v(Math.cos(m)*h,d,Math.sin(m)*h,[v,u,0]))}o.push(c)}),e.loft(o,!0);const n=e.v(0,.04,0,[0,0,0]);for(let h=0;h<s;h++)e.tri(n,o[0][h],o[0][(h+1)%s]);const r=e.v(0,-.16,0,[0,1,0]);for(let h=0;h<s;h++)e.tri(r,o[l][(h+1)%s],o[l][h]);return e.build()},Ja=Array.from({length:Ae},()=>({M:[],S:[]})),nn=Array.from({length:Ae},()=>({M:[],S:[]})),p0=new R.Matrix4,m0=new R.Quaternion,wo=new R.Euler,A0=new b,qo=new b,Vo=.8,j0=(t,e,o,a,s,l=.6,n=i,r=4.7,h=0)=>{const d=At.distanceTo(t,e-a*.5,o);if(d<3.2+a*.6)return;wo.set(n.range(-l,l),n.range(0,T),n.range(-l,l)),m0.setFromEuler(wo),p0.compose(A0.set(t,e+h,o),m0,qo.set(a,a*n.range(.9,1.5),a));const v=n();if(vo(t,o)||d<r+a*.9)return;const u=(d<8.6?nn:Ja)[It(s)];for(let f=0;f<16;f++)u.M.push(p0.elements[f]);u.S.push(v)};ut("chandeliers"),ho(!1);const qr=Math.round(125*Bt*lt*(ie==="early"?.45:1));for(let t=0,e=0;t<qr&&e<4e3;e++){(e&31)===31&&await y.yield();let o,a;i()<.45?[o,a]=Z0():(o=i.range(Q+6,Ft-30),a=i.range(-30,30));const s=rt(o,a);if(s<4.6)continue;const l=i.range(1.3,3),n=i.range(.5,2.6)*(s>12?2.2:1),r=i.int(6,12);t++;for(let h=0;h<r;h++){const d=i.range(0,T),v=l*Math.sqrt(i()),u=o+Math.cos(d)*v,f=a+Math.sin(d)*v,c=rt(u,f);c<3.5||(I(u,f),j0(g.x,Z(u,f)+c-.1-(1-v/l)*n*i(),g.z,i.range(.5,1.05),u,.6,i,4.7,Ro(jo,u,f)))}}ho(!0),ut("strike-crystals");for(let t=0,e=0,o=Math.round(18*Bt*lt);t<o&&e<600;e++){const a=i.range(600,Ft+34),s=i.range(6.6,9.7)*i.sign(),l=rt(a,s);if(I(a,s),l<5||Math.hypot(g.x,g.z-ve)<17)continue;(t&3)===3&&await y.yield();const n=i.range(1.2,2.4),r=i.range(1,3.5),h=i.int(7,12);t++;for(let d=0;d<h;d++){const v=i.range(0,T),u=n*Math.sqrt(i()),f=a+Math.cos(v)*u,c=s+Math.sin(v)*u,p=rt(f,c);p<4||(I(f,c),j0(g.x,Z(f,c)+p-.1-(1-u/n)*r*i(),g.z,i.range(.5,1.05),f))}}const ts=197;ut("bough-chandelier");for(let t=0;t<44;t++){const e=i.range(0,T),o=2.7*Math.sqrt(i());I(ts+Math.cos(e)*o,Math.sin(e)*o),j0(g.x,9.5-(1-o/2.7)*1.7*i()-.2*i(),g.z,i.range(.6,1.1),ts,.35,i,0)}ut("vault-crystals");for(const t of b0)if(t.crystals){for(let e=0,o=Math.round(t.crystals*lt);e<o;e++){const a=i.range(0,T),s=t.R*Math.sqrt(i())*.98,l=t.s+Math.cos(a)*s,n=t.t+Math.sin(a)*s,r=rt(l,n),h=(.62+.45*(i.range(1,2.5)-1)/1.5)*(.75+.25*s/t.R),d=i()*i()*2.5;r<4||(I(l,n),j0(g.x,Z(l,n)+r-.1-d,g.z,h,l,.5),(e&63)===63&&await y.yield())}for(let e=0,o=Math.round(t.crystals*.6*lt);e<o;e++){const a=i.range(0,T),s=t.R*Math.sqrt(i())*.98,l=t.s+Math.cos(a)*s,n=t.t+Math.sin(a)*s,r=rt(l,n),h=i.range(.42,.95),d=i()*i()*i()*4.5;r<4||(I(l,n),j0(g.x,Z(l,n)+r-.1-d,g.z,h,l,.5,i),(e&63)===63&&await y.yield())}}ut("icicles");for(let t=0;t<90;t++){const e=i.range(302,356),o=i.range(-11,11),a=rt(e,o),s=i.range(1.2,3.6),l=i();if(a<5)continue;I(e,o);const n=Z(e,o)+a+.1;if(At.distanceTo(g.x,n-s,g.z)<3.8)continue;p0.compose(A0.set(g.x,n-s,g.z),m0.identity(),qo.set(s*.3,-s/.84,s*.3));const r=Ja[It(e)];for(let h=0;h<16;h++)r.M.push(p0.elements[h]);r.S.push(l+2)}if(ut("lens-crystals"),Ot==="night")for(const[t,e,o]of[[335.5,-1,3.6],[403.5,-3.4,2.4]])for(let a=0;a<26;a++){const s=a/26*T+i.range(-.1,.1),l=o+i.range(0,1.2),n=t+Math.cos(s)*l,r=e+Math.sin(s)*l,h=rt(n,r),d=i()<.3?i.int(2,4):1;if(h<4)continue;I(n,r);const v=g.x,u=g.z,f=Z(n,r)+h-.15;for(let c=0;c<d;c++)j0(v+i.range(-.1,.1)*c,f-c*.62,u+i.range(-.1,.1)*c,i.range(.45,.8)*(1-.12*c),n,.5,i,3.4)}await y.yield(),ho(!1);{const t=$t("chains"),e=4;for(let o=20+t.range(0,12);o<Ft-60;o+=t.range(12,18)){const a=t.sign(),s=t.int(4,7),l=.1+(s-1)*.55+.1*(s-1)*(s-1)/s+e;let n=0;for(;n<z0&&rt(o,a*k0(n+1))>=l;)n++;const r=a*t.range(0,k0(n)),h=rt(o,r);if(h<l)continue;I(o,r);const d=g.x,v=g.z,u=Z(o,r)+h-.1;for(let f=0;f<s;f++){const c=t.range(.5,.75)*(1-.08*f),p=d+t.range(-.12,.12)*f,m=u-f*.55-.1*f*f/s,w=v+t.range(-.12,.12)*f;At.isClear(p,m-c*.5,w,c*.9,3.3)&&j0(p,m,w,c,o,.45,t,3.3,Ro(jo,o,r))}}}ho(!0),await y.yield();const Vr=Te($,{vs:il,fs:ll,uniforms:{uSparkCol:{value:_t(ct.spark,2.5)},uSpark:{value:ie==="early"?.8:1}}});for(let t=0;t<2*Ae;t++){const e=t>=Ae,o=(e?nn:Ja)[t%Ae],a=o.S.length;if(!a)continue;const s=Pr(e);s.setAttribute("aSeed",new R.InstancedBufferAttribute(new Float32Array(o.S),1));const l=new R.InstancedMesh(s,Vr,a);l.instanceMatrix.array.set(o.M),l.instanceMatrix.needsUpdate=!0,l.computeBoundingSphere(),l.matrixAutoUpdate=!1,W.add(l),r0[t%Ae].det.push(l),await y.yield()}await y.yield();const rn={value:new R.Vector2(0,1e4)},Do=Te($,{vs:cl,fs:hl,uniforms:{uBirch:rn}}),ln=(t,e,o)=>{if(!e.length)return;const a=new R.InstancedMesh(t,Do,e.length/16);a.instanceMatrix.array.set(e),a.instanceMatrix.needsUpdate=!0,a.computeBoundingSphere(),a.matrixAutoUpdate=!1,W.add(a),r0[o].det.push(a)},Dr=(t,e)=>e.forEach((o,a)=>ln(t,o,a)),go=(t,e,o,a,s,l,n=0,r=0)=>{wo.set(n,s,r),m0.setFromEuler(wo),p0.compose(A0.set(e,o,a),m0,qo.set(l,l,l));for(let h=0;h<16;h++)t.push(p0.elements[h])},cn=(()=>{const t=new ze,e=et("#6e4332"),o=et("#2a5226"),a=et("#55803a"),s=et("#C21F2E"),l=[];for(let m=0;m<=7;m++){const w=m/7;l.push(new b(Math.sin(w*1.5)*2,w*6.5-w*w*1,Math.sin(w*2.6)*.5))}const n=(m,w)=>{const x=Vt(m,0,.999)*7,k=Math.floor(x);return w.copy(l[k]).lerp(l[k+1],x-k)};t.tube(l,m=>.13-.07*m,5,()=>e,m=>[0,m*m,0,0],!1);const r=new b,h=new b,d=new b,v=new b,u=new b(0,1,0),f=new b,c=[0,.3,.68,1],p=[.12,.8,.7,.04];for(let m=0;m<10;m++){const w=.2+m*.082,x=m*2.4+.5;n(w,r),h.set(Math.cos(x),.4,Math.sin(x)).normalize(),d.crossVectors(h,u).normalize(),v.crossVectors(d,h);const k=1.5*(1-.25*w)*(.85+.3*(m*.37%1)),A=Pt(o,a,m*.61%1),L=m*.173%1,M=[];for(let C=0;C<4;C++){const F=c[C],N=p[C]*k*.5,V=[];for(const G of[-1,0,1])f.copy(r).addScaledVector(h,.1+F*k).addScaledVector(d,G*N).addScaledVector(v,(G===0?-.1:.04)*N*2-.3*F*F),V.push(t.v(f.x,f.y,f.z,A,[1,w*w,G*(C===0||C===3?.3:1),L]));M.push(V)}t.loft(M,!1)}for(let m=0;m<3;m++){n(.8+m*.07,r);const w=r.clone().add(new b(Math.cos(m*2.1+1)*.55,-.6-.15*m,Math.sin(m*2.1+1)*.55));t.tube([r.clone(),r.clone().lerp(w,.5).add(new b(0,.12,0)),w.clone().add(new b(0,.36,0))],()=>.035,3,()=>e,()=>[0,.8,0,0],!1),t.ball(w,.42,.4,.42,8,5,()=>s,[2,.8,0,0])}return t.build()})(),Bo=Array.from({length:Ae},()=>[]),Br=[],es=new Map;{const t=new b;for(let e=0;e<=ot;e+=.25){At.posAtDist(e,t);const o=Math.floor(t.x/6)*4096+Math.floor(t.z/6);let a=es.get(o);a||es.set(o,a=[]),a.push(t.x,t.y,t.z)}}const Tr=(t,e,o)=>{let a=1e9;const s=Math.floor(t/6),l=Math.floor(o/6);for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++){const h=es.get((s+n)*4096+l+r);if(h)for(let d=0;d<h.length;d+=3){const v=h[d]-t,u=h[d+1]-e,f=h[d+2]-o,c=v*v+u*u+f*f;c<a&&(a=c)}}return a},D0=cn.attributes.position.array;let os=0;for(let t=0;t<D0.length;t+=3)os=Math.max(os,Math.hypot(D0[t],D0[t+1],D0[t+2]));const Or=(t,e,o,a,s,l,n)=>{if(At.distanceTo(t,e,o)-1.2>2.3+os*s)return s;for(wo.set(l,a,n),m0.setFromEuler(wo);s>.05;s*=.85){p0.compose(A0.set(t,e,o),m0,qo.set(s,s,s));const r=p0.elements;let h=!0;for(let d=0;d<D0.length&&h;d+=3){const v=D0[d],u=D0[d+1],f=D0[d+2];h=Tr(r[0]*v+r[4]*u+r[8]*f+r[12],r[1]*v+r[5]*u+r[9]*f+r[13],r[2]*v+r[6]*u+r[10]*f+r[14])>2.3*2.3}if(h)break}return s},oa=(t,e,o,a,s,l,n,r)=>go(t,e,o,a,s,Or(e,o,a,s,l,n,r),n,r);ut("sprigs");const Hr=Math.round(140*Bt*(.7+.3*lt));for(let t=0,e=0;t<Hr&&e<2e4;e++){(e&127)===127&&await y.yield();let o,a;i()<.5?[o,a]=Z0():(o=i.range(Q+8,Ft-20),a=i.range(3,9)*i.sign());const l=rt(o,a),n=Math.abs(a);if(l<2.6||n<3||Z(o,a)<-.45)continue;let r=Vt((l-.9)/6.2,.4,1.25)*i.range(.8,1);if((s0(o,a)<7||La(o,a)||Math.abs(a-Me(o))<3.2)&&(r=Math.min(r,.3)),n<3+2.6*r&&r>.55)continue;Ke(o);const h=-tt.tz*Math.sign(a),d=tt.tx*Math.sign(a),v=n>9?i.range(0,T):Math.atan2(-d,h)+i.range(-.7,.7);I(o,a),oa(vo(g.x,g.z)?Br:Bo[It(o)],g.x,Z(o,a)-.1,g.z,v,r,i.range(-.12,.12),i.range(-.12,.12)),t++}ut("strike-sprigs");for(let t=0,e=0,o=Math.round(7*Bt);t<o&&e<400;e++){const a=i.range(ta+10,ea-4),s=i.range(6.6,9.3)*i.sign(),l=rt(a,s);I(a,s),!(l<3||Math.hypot(g.x,g.z)<17)&&(oa(Bo[It(a)],g.x,Z(a,s)-.1,g.z,i.range(0,T),Vt((l-.9)/6.2,.45,1.1)*i.range(.75,1),i.range(-.12,.12),i.range(-.12,.12)),t++)}ut("room-sprigs");for(const t of b0)if(t.sprigs)for(let e=0,o=0,a=Math.round(t.sprigs*(.7+.3*lt));e<a&&o<900;o++){const s=i.range(0,T),l=t.R*i.range(.3,.96),n=t.s+Math.cos(s)*l,r=t.t+Math.sin(s)*l,h=rt(n,r);let d=Vt((h-.9)/5.2,.4,1.3)*i.range(.75,1);(s0(n,r)<7||La(n,r)||Math.abs(r-Me(n))<3.2)&&(d=Math.min(d,.3)),!(h<2.2||Math.abs(r)<3.2+1.6*d||Z(n,r)<-.45||Math.hypot(n-104,r-7.6)<4.5)&&(I(n,r),!vo(g.x,g.z)&&(oa(Bo[It(n)],g.x,Z(n,r)-.1,g.z,i.range(0,T),d,i.range(-.12,.12),i.range(-.12,.12)),e++))}ut("foot-sprigs"),Xo(i,.32,(t,e,o)=>{oa(Bo[It(t)],g.x,Z(t,e)-.1,g.z,o.range(0,T),o.range(.22,.36),o.range(-.14,.14),o.range(-.14,.14))}),await y.yield(),Dr(cn,Bo),await y.yield();const Ur=(()=>{const t=new ze,e=et(ct.wet?"#1d4016":fo?"#22381a":"#1c2e18"),o=et(ct.wet?"#668c2c":fo?"#5d7a30":"#4f6030");for(let l=0;l<6;l++){const n=l/6*T+l%2*.4,r=.8+.55*(l*.41%1),h=Math.cos(n),d=Math.sin(n),v=[],u=.3+.08*(l*.63%1);for(let f=0;f<3;f++){const c=f/2,p=c*r*.8,m=Math.sin(c*2.2)*r*.42;v.push([t.v(h*p-d*u,m,d*p+h*u,Pt(e,o,c),[3,c*c,c,-1]),t.v(h*p+d*u,m,d*p-h*u,Pt(e,o,c),[3,c*c,c,1])])}t.loft(v,!1)}const a=t.build(),s=a.attributes.normal;for(let l=0;l<s.count;l++){let n=s.getX(l)*.4,r=s.getY(l)*.4+.75,h=s.getZ(l)*.4;const d=Math.hypot(n,r,h)||1;s.setXYZ(l,n/d,r/d,h/d)}return a})(),B0=Array.from({length:Ae},()=>[]);ut("moss");const Gr=Math.round(2600*lt*Bt);for(let t=0,e=0;t<Gr&&e<3e4;e++){(e&255)===255&&await y.yield();let o,a;i()<.2?[o,a]=Z0():(o=i.range(Q+4,K0-10),a=i.gauss()*3.2),!(rt(o,a)<1.4||Math.abs(a)>42)&&(I(o,a),go(B0[It(o)],g.x,Z(o,a)-.03,g.z,i.range(0,T),i.range(.32,.8),i.range(-.2,.2),i.range(-.2,.2)),t++)}ut("room-moss");for(const t of b0){if(!t.moss)continue;const e=t.moss>300?1.45:1;for(let o=0,a=Math.round(t.moss*lt);o<a;o++){const s=i.range(0,T),l=t.R*Math.sqrt(i()),n=t.s+Math.cos(s)*l,r=t.t+Math.sin(s)*l;rt(n,r)<1.4||Z(n,r)<-.5||(I(n,r),go(B0[It(n)],g.x,Z(n,r)-.03,g.z,i.range(0,T),i.range(.45,1)*e,i.range(-.2,.2),i.range(-.2,.2)))}await y.yield()}ut("strike-moss");for(let t=0,e=Math.round(760*lt*Bt);t<e;t++){const o=i.range(ta,ea),a=$a();rt(o,a)<1.4||(I(o,a),go(B0[It(o)],g.x,Z(o,a)-.03,g.z,i.range(0,T),i.range(.36,.9),i.range(-.2,.2),i.range(-.2,.2)),(t&255)===255&&await y.yield())}ut("near-moss");for(let t=0,e=Math.round(1300*lt);t<e;t++){const o=i.range(Q+4,K0-10),a=i.gauss()*2.4,s=i.range(.26,.5),l=i.range(0,T),n=i.range(-.2,.2),r=i.range(-.2,.2);(t&255)===255&&await y.yield(),!(rt(o,a)<1.4||Z(o,a)<-.5)&&(I(o,a),go(B0[It(o)],g.x,Z(o,a)-.02,g.z,l,s,n,r))}ut("foot-moss"),Xo(i,1.3,(t,e,o)=>{go(B0[It(t)],g.x,Z(t,e)-.03,g.z,o.range(0,T),o.range(.4,.85),o.range(-.2,.2),o.range(-.2,.2))}),await y.yield();{const t=$t("way-moss"),e=new b(0,1,0),o=new b,a=new R.Quaternion,s=new Float32Array(28);for(let l=354;l<446;l+=.7){const n=t.sign(),r=.5+3.6*t()*t(),h=t.int(4,7),d=t(),v=l+.7*t(),u=Po(v,n,r);for(let f=0;f<28;f++)s[f]=t();if(!(u!==u||Math.abs(u)<3.2||Math.abs(u)>40||d>M0(354,446,v,6)))for(let f=0;f<h;f++){const c=f*4,p=v+(s[c]-.5)*1.5,m=u+(s[c+1]-.5)*1;if(Qs(p,m),me.g<.15||me.g>5)continue;I(p,m);const w=tt.tx*me.gs-tt.tz*me.gt,x=tt.tz*me.gs+tt.tx*me.gt,k=Math.sqrt(w*w+1+x*x),A=1+.9*s[c+3];if(o.set(w/k,-1/k,x/k),A0.set(g.x,me.f+me.g,g.z),!At.isClear(A0.x,A0.y,A0.z,1.6*A,2.5)||Math.abs(m)<2.5+1.15*A||Math.abs(m-Me(p))<mo+1.15*A)continue;m0.setFromUnitVectors(e,o),a.setFromAxisAngle(e,s[c+2]*T),m0.multiply(a),p0.compose(A0,m0,qo.set(A,A,A));const L=B0[It(p)];for(let M=0;M<16;M++)L.push(p0.elements[M])}}}await y.yield();for(let t=0;t<B0.length;t++)ln(Ur,B0[t],t),(t&3)===3&&await y.yield();await y.yield();const xo=Ba();ut("leaves");const Er=Math.round(2400*lt);for(let t=0,e=0;t<Er&&e<4e4;e++){(e&255)===255&&await y.yield();let o,a;if(i()<.15?[o,a]=Z0():(o=i.range(Q+4,K0-10),a=i.gauss()*3.4),rt(o,a)<1||Math.abs(a)>42)continue;I(o,a);const s=xo[It(o)],l=s.P.length/3,n=Z(o,a)+.05+i()*.07,r=i.range(0,T),h=i()<.22,d=h?i.range(.25,.4):i.range(.4,.62),v=i(),u=Math.cos(r)*d,f=Math.sin(r)*d,c=i.range(-.12,.12);s.P.push(g.x-u+f,n-c,g.z-f-u,g.x+u+f,n+c,g.z+f-u,g.x+u-f,n+c,g.z+f+u,g.x-u-f,n-c,g.z-f+u);for(let p=0;p<4;p++)s.N.push(0,1,0),s.R.push(v,h?1:.3);s.UV.push(-1,-1,1,-1,1,1,-1,1),s.I.push(l,l+2,l+1,l,l+3,l+2),t++}ut("strike-leaves");for(let t=0,e=Math.round(620*lt);t<e;t++){const o=i.range(ta,ea),a=$a();if(rt(o,a)<1)continue;I(o,a);const s=xo[It(o)],l=s.P.length/3,n=Z(o,a)+.05+i()*.07,r=i.range(0,T),h=i()<.22,d=h?i.range(.25,.4):i.range(.4,.62),v=i(),u=Math.cos(r)*d,f=Math.sin(r)*d,c=i.range(-.12,.12);s.P.push(g.x-u+f,n-c,g.z-f-u,g.x+u+f,n+c,g.z+f-u,g.x+u-f,n+c,g.z+f+u,g.x-u-f,n-c,g.z-f+u);for(let p=0;p<4;p++)s.N.push(0,1,0),s.R.push(v,h?1:.3);s.UV.push(-1,-1,1,-1,1,1,-1,1),s.I.push(l,l+2,l+1,l,l+3,l+2)}ut("cellar-leaves");for(let t=0;t<230;t++){const e=t<60,o=i.range(0,T),a=e?3.2*Math.sqrt(i()):12*Math.sqrt(i()),s=(e?104:99)+Math.cos(o)*a,l=(e?7.6:10)+Math.sin(o)*a,n=i.range(0,T),r=e||i()<.2,h=r?i.range(.3,.46):i.range(.45,.7),d=i(),v=i.range(-.14,.14),u=i();if(rt(s,l)<1)continue;I(s,l);const f=xo[It(s)],c=f.P.length/3,p=Z(s,l)+.06+u*(e?.5:.1),m=Math.cos(n)*h,w=Math.sin(n)*h;f.P.push(g.x-m+w,p-v,g.z-w-m,g.x+m+w,p+v,g.z+w-m,g.x+m-w,p+v,g.z+w+m,g.x-m-w,p-v,g.z-w+m);for(let x=0;x<4;x++)f.N.push(0,1,0),f.R.push(d,r?1:.3);f.UV.push(-1,-1,1,-1,1,1,-1,1),f.I.push(c,c+2,c+1,c,c+3,c+2)}ut("foot-leaves"),Xo(i,1.6,(t,e,o)=>{const a=xo[It(t)],s=a.P.length/3,l=Z(t,e)+.05+o()*.1,n=o.range(0,T),r=o()<.2,h=r?o.range(.25,.4):o.range(.4,.62),d=o(),v=o.range(-.14,.14),u=Math.cos(n)*h,f=Math.sin(n)*h;a.P.push(g.x-u+f,l-v,g.z-f-u,g.x+u+f,l+v,g.z+f-u,g.x+u-f,l+v,g.z+f+u,g.x-u-f,l-v,g.z-f+u);for(let c=0;c<4;c++)a.N.push(0,1,0),a.R.push(d,r?1:.3);a.UV.push(-1,-1,1,-1,1,1,-1,1),a.I.push(s,s+2,s+1,s,s+3,s+2)}),await y.yield();const hn=(t,e,o,a,s,l,n,r,h)=>{if(Math.abs(e)<2.6+a||rt(t,e)<1||Z(t,e)<-.45||Math.abs(e-Me(t))<1.2+a||s0(t,e)<3.5||No(t,e))return;I(t,e);const d=Z(t,e)+.07+h;if(!At.isClear(g.x,d,g.z,a*1.42,2.5))return;const v=xo[It(t)],u=v.P.length/3,f=Math.cos(s)*a,c=Math.sin(s)*a;v.P.push(g.x-f+c,d-l-n,g.z-c-f,g.x+f+c,d+l-n,g.z+c-f,g.x+f-c,d+l+n,g.z+c+f,g.x-f-c,d-l+n,g.z-c+f);for(let p=0;p<4;p++)v.N.push(0,1,0),v.R.push(r,o);v.UV.push(-1,-1,1,-1,1,1,-1,1),v.I.push(u,u+2,u+1,u,u+3,u+2)};{const t=$t("way-down");for(let e=500;e<606;e+=.4){const o=t.range(0,T),a=12+15*Math.sqrt(t()),s=t.range(.3,.6),l=t.range(0,T),n=t.range(-.25,.3),r=t.range(-.2,.2),h=t(),d=t()<.35,v=t.gauss()*4.5,u=e+.4*t();e>=566&&(!d||h>1-(u-566)/40)||(d?hn(u,v,4,s,l,n*s,r*s,h,.25*s):hn(Se.s+Math.cos(o)*a,Se.t+Math.sin(o)*a,4,s,l,n*s,r*s,h,.25*s))}}await Qa(xo,Te($,{vs:ul,fs:dl})),await y.yield();const h0=new ze,as=et("#4c3a2c"),ss=et("#7a644c"),aa=et("#a9b3b8"),ns=et("#4a3324");ut("stems");const fn=[],vn=[];Wa.forEach(([t,e],o)=>{I(t,e);const a=g.x,s=g.z,l=Z(t,e)-.6,n=t+i.range(-3,3),r=e+(o===0?i.range(2.5,4.5):i.range(-4,4));I(n,r);const h=Z(n,r)+Math.max(rt(n,r),6)+2.5,d=g.x,v=g.z,u=[];for(let f=0;f<=10;f++){const c=f/10,p=c*c*(1.6-.6*c);u.push(new b(it(a,d,p)+Math.sin(c*5+o)*.25,it(l,h,c),it(s,v,p)+Math.cos(c*4+o*2)*.25))}h0.tube(u,f=>.66-.2*f+.45*Math.exp(-f*7)+.05*Math.sin(f*31+o)+.04*Math.sin(f*73),12,(f,c)=>Pt(as,ss,.5+.5*Math.sin(c*3+f*9+o)),f=>[6,0,Math.max(f,.002),o*.2],!1),fn.push([d,v]),o===0&&vn.push(...u);for(let f=0;f<5;f++){const c=i.range(.3,.8),p=u[Math.round(c*10)],m=i.range(0,T),w=p.clone().add(new b(Math.cos(m)*1.5,i.range(.6,1.4),Math.sin(m)*1.5));At.distanceTo(w.x,w.y,w.z)<5||(h0.tube([p.clone(),p.clone().lerp(w,.55).add(new b(0,.25,0)),w],x=>.1-.05*x,4,()=>ns,()=>[0,.5,0,0],!1),h0.ball(w.clone().add(new b(0,.45,0)),.26,.62,.26,6,4,()=>aa,[5,.6,0,0]))}}),await y.yield(),ut("bough");{const t=(a,s,l)=>(I(a,s),new b(g.x,l,g.z)),o=new R.CatmullRomCurve3([vn[7].clone(),t(198.5,4,12),t(ts,0,10.5),t(195,-5,8),t(193,-10,3.8),t(191.5,-13.5,.1)]).getPoints(18);h0.tube(o,a=>.4-.2*a,8,(a,s)=>Pt(as,ss,.5+.5*Math.sin(s*3+a*14)),()=>[6,0,0,.9]);for(let a=1;a<17;a++){const s=o[a],l=a%2?1:-1,n=s.clone().add(new b(i.range(-.5,.5),i.range(.5,1),l*i.range(.3,.9)));h0.tube([s.clone(),n],()=>.06,4,()=>ns,()=>[0,.4,0,0],!1),h0.ball(n.clone().add(new b(0,.4,0)),.24,.6,.24,6,4,()=>aa,[5,.5,0,0])}}await y.yield();const rs=et("#6c7c70"),is=et("#d4dfcd");let T0=h0;const X0=(t,e,o,a,s)=>{const l=t.clone().addScaledVector(e,o),n=t.clone().lerp(l,.5).add(new b(i.range(-1,1),i.range(-.4,.4),i.range(-1,1)).multiplyScalar(o*.14));if(T0.tube([t,n,l],h=>a*(1-.3*h),3,h=>Pt(rs,is,Vt((3-s+h)/3.6,0,1)),()=>[4,(3-s)*.12,0,0],s===0),s===0)return;const r=s===3?3:i.int(2,3);for(let h=0;h<r;h++){const d=e.clone().add(new b(i.range(-1,1),i.range(-.15,.5),i.range(-1,1)).multiplyScalar(.85)).normalize();X0(l,d,o*.66,a*.62,s-1)}};ut("hall-lichen");const _r=Math.round(22*(.7+.3*lt));for(let t=0,e=0;t<_r&&e<2e3;e++){(e&3)===3&&await y.yield();let o,a;i()<.8?[o,a]=Z0():(o=i.pick([350,452,545])+i.range(-8,8),a=i.range(4.5,7)*i.sign());const s=rt(o,a);if(s<5.5||Math.abs(a)<6.5+(s<9?-2:2)||s0(o,a)<6)continue;I(o,a);const l=Math.min(i.range(1.5,2),(s-1)/2.6);X0(new b(g.x,Z(o,a)-.2,g.z),new b(i.range(-.2,.2),1,i.range(-.2,.2)).normalize(),l,l*.13,3),t++}await y.yield();{const t=new R.Mesh(h0.build(),Do);t.geometry.computeBoundingSphere(),t.matrixAutoUpdate=!1,W.add(t)}await y.yield();const Kt=(t,e,o)=>(I(t,e),new b(g.x,o,g.z)),Q0=(t,e,o=Do)=>{const a=new R.Mesh(t.build(),o);return a.geometry.computeBoundingSphere(),a.matrixAutoUpdate=!1,W.add(a),r0[It(e)].det.push(a),a},Ir=et("#C21F2E"),ls=[1,1,1];ut("willow-lattice");for(const t of["melt2","grotto","rockAnte"]){const e=Es[t],o=new ze;for(let a=0;a<6;a++){const s=(a%2?.5:-.45)+i.range(-.35,.35)+(a>3?1.2:0),l=Math.cos(s),n=Math.sin(s),r=(a-2.5)*2.6+i.range(-1,1),h=i.range(0,T),d=[];for(let u=0;u<=14;u++){const f=(u/14*2-1)*e.R*.92,c=Math.sin(u*.9+h)*.7,p=e.s+l*f-n*(r+c),m=e.t+n*f+l*(r+c),w=rt(p,m);if(w<2.2){if(d.length>3)break;d.length=0;continue}d.push(Kt(p,m,Z(p,m)+w-.22-.25*Math.abs(Math.sin(u*1.7+h))))}if(d.length<4)continue;d[0].y+=.7,d[d.length-1].y+=.7;const v=i.range(.13,.24);o.tube(d,u=>v*(.4+.6*Math.sin(Math.PI*u))+.02*Math.sin(u*40+h),6,(u,f)=>Pt(as,ss,.5+.5*Math.sin(f*3+u*17+h)),()=>[6,0,0,h],!1);for(let u=1;u<d.length-1;u++){if(i()<.3)continue;const f=d[u],c=i.range(.8,2.3),p=f.clone().add(new b(i.range(-.7,.7),-c,i.range(-.7,.7)));At.distanceTo(p.x,p.y,p.z)<4.2||(o.tube([f.clone(),f.clone().lerp(p,.5).add(new b(i.range(-.25,.25),.1,i.range(-.25,.25))),p],m=>.085-.045*m,4,()=>ns,()=>[0,.5,0,0],!1),o.ball(p.clone().add(new b(0,-.2,0)),.2,.42,.2,6,4,()=>aa,[5,.6,0,0]))}await y.yield()}Q0(o,e.s),await y.yield()}ut("cellar");{const t=new ze,e=Ce.s,o=Ce.t,a=Z(e,o),s=et("#a8683c"),l=(v,u)=>(I(e+Math.sin(v*2.1)*.5,o+Math.cos(v*1.7)*.4),u.set(g.x,a-.6+v*18,g.z)),n=v=>2.5+2*Math.exp(-v*6)+.12*Math.sin(v*23),r=[];for(let v=0;v<=21;v++)r.push(l(v/21,new b));t.tube(r,(v,u)=>n(v)*(1+.035*Math.cos(3*u+v*5)+.02*Math.cos(7*u-v*9)+.14*Math.exp(-v*9)*Math.cos(5*u+1.3)),28,()=>ls,()=>[7,0,0,0],!1),I(e,o),rn.value.set(g.x,g.z);{const v=new b,u=new b,f=(()=>{const c=I(e,0),p=c.x,m=c.z;return I(e,o),Math.atan2(m-g.z,p-g.x)})();for(let c=0;c<52;c++){const p=3+10.5*i(),m=(p-(a-.6))/18,w=f+Vt(i.gauss()*1,-2.4,2.4),x=i()<.5?-1:1,k=i.range(1.6,3.8),A=i.range(.3,.85),L=i.range(2.4,5.4),M=[i(),i(),i()];l(m,v);const C=Math.cos(w),F=Math.sin(w),N=-F*x,V=C*x,G=12;u.set(v.x+C*(n(m)*1.02+.05),p,v.z+F*(n(m)*1.02+.05));let P=-1,J=-1;for(let pt=0;pt<=G;pt++){const xt=pt/G,Nt=L*Math.pow(z(.08,1,xt),1.4),qt=A*(1-.35*xt),D=u.y-.2*k*xt*xt,E=t.v(u.x,D-qt,u.z,M,[11,0,-1,xt]),q=t.v(u.x,D+qt,u.z,M,[11,0,1,xt]);P>=0&&(x>0?(t.tri(P,q,E),t.tri(P,J,q)):(t.tri(P,E,q),t.tri(P,q,J))),P=E,J=q;const B=k/G;u.x+=(N*Math.cos(Nt)+C*Math.sin(Nt))*B,u.z+=(V*Math.cos(Nt)+F*Math.sin(Nt))*B}}}const h=(v,u,f)=>(c,p)=>v*(1-u*c)*(1+.1*Math.sin(c*17+f))*(1+.14*Math.cos(4*p+f*1.7+c*3)+.07*Math.cos(9*p+f)+.3*Math.exp(-(((c-.33-.07*(f%3))/.045)**2))*(.5+.5*Math.cos(p-f))+.22*Math.exp(-(((c-.68)/.04)**2))*(.5+.5*Math.cos(p+2+f))),d=v=>(u,f)=>{const c=.74+.26*Math.cos(4*f+v*1.7+u*3);return[s[0]*c,s[1]*c,s[2]*c]};Ks.forEach(([v,u,f,c,p],m)=>{const w=[],x=Math.cos(v),k=Math.sin(v);for(let A=0;A<=9;A++){const L=A/9,M=1.6+u*L,C=e+x*M+Math.sin(L*5+m)*.5*L,F=o+k*M+Math.cos(L*4+m*2)*.5*L;w.push(Kt(C,F,Z(C,F)+f*(1-L)*(1-L)+c*Math.sin(Math.PI*Math.min(L*1.5,1))*(1-.5*L)+.25-.9*z(.8,1,L)))}t.tube(new R.CatmullRomCurve3(w).getPoints(22),h(p,.68,m),14,d(m),A=>[7,0,z(0,.07,A),0]);for(let A=0;A<2;A++){const L=.3+.3*A+.1*(m*.37%1),M=w[Math.round(L*9)],C=(m+A)%2?1:-1,F=Kt(e+x*(1.6+u*L)-k*C*2.6+x*1.4,o+k*(1.6+u*L)+x*C*2.6+k*1.4,0);F.y=M.y*.2+.1,t.tube(new R.CatmullRomCurve3([M.clone(),M.clone().lerp(F,.5).add(new b(0,.3,0)),F]).getPoints(8),h(p*.28,.6,m+A+3),8,d(m+A),()=>[7,0,1,0])}}),await y.yield();{const v=[],f=Math.cos(4.52),c=Math.sin(4.52);for(let p=0;p<=12;p++){const m=p/12,w=1.8+21.5*m,x=e+f*w,k=o+c*w;v.push(Kt(x,k,Z(x,k)+5.2*(1-m)+22*m*(1-m)-.5*m))}t.tube(new R.CatmullRomCurve3(v).getPoints(30),h(1,.45,5),16,d(5),p=>[7,0,z(0,.05,p),0])}for(let v=0;v<34;v++){const u=i.range(0,T),f=2.3*Math.sqrt(i()),c=C0.s+Math.cos(u)*f,p=C0.t+Math.sin(u)*f,m=i.range(.42,.56);t.ball(Kt(c,p,Z(c,p)+m*.8+(1-f/2.3)*1.5*i()),m,m*.95,m,8,5,()=>Ir,[2,0,0,0])}for(let v=0;v<4;v++){const u=i.range(0,T),f=Kt(C0.s+Math.cos(u)*1.6,C0.t+Math.sin(u)*1.6,Z(C0.s,C0.t)+1.5+.2*v),c=f.clone().add(new b(Math.cos(u*2.3)*1.5,.3,Math.sin(u*2.3)*1.5));t.tube([f,f.clone().lerp(c,.5).add(new b(0,.15,0)),c],p=>.36*Math.sin(Math.PI*(.12+.8*p)),7,()=>aa,()=>[5,0,0,0])}Q0(t,98)}await y.yield();const To=Te($,{vs:fl,fs:vl}),un=(t,e,o,a)=>1+.22*vt.fbm3(t*1.5+a,e*1.5,o*1.5,3)+.07*vt.n3(t*4.6,e*4.6+a,o*4.6)-.1*Math.abs(vt.n3(t*2.3+7,e*2.3,o*2.3+a)),J0=(t,e,o,a,s,l,n,r,h,d,v,u,f,c)=>{const p=[],m=[];for(let w=0;w<c;w++){const x=Math.sin(u*12.9898+w*78.233)*43758.5453,k=Math.sin(u*39.3468+w*11.135)*24634.6345,A=(x-Math.floor(x))*T,L=.2+.95*(k-Math.floor(k));m.push([Math.cos(A)*Math.cos(L),Math.sin(L),Math.sin(A)*Math.cos(L),.8+.12*((w*.618+u)%1)])}for(let w=0;w<=d;w++){const x=-Math.PI/2+Math.PI*w/d,k=Math.sin(x),A=Math.max(Math.cos(x),.015),L=[];for(let M=0;M<v;M++){const C=M/v*T,F=Math.cos(C)*A,N=Math.sin(C)*A;let V=un(F,k,N,u);for(const G of m){const P=F*G[0]+k*G[1]+N*G[2];P*V>G[3]&&(V=G[3]/P)}L.push(t.v(e+(s*F*n-l*N*h)*V,o+k*r*V,a+(l*F*n+s*N*h)*V,ls,f))}p.push(L)}t.loft(p,!0)};{const t=new ze,e=Kt(zt.s,zt.t,Z(zt.s,zt.t)+.1);Ke(zt.s);const o=tt.tx,a=tt.tz;J0(t,e.x,e.y,e.z,o,a,5,1.5,4.5,12,26,7.7,[10,3,7.7,0],0);for(const[s,l,n,r,h,d]of Da)I(s,l),J0(t,g.x,e.y+n*.5+Math.max(0,1.2-d*.25),g.z,o,a,n,n*.75,n*r,8,12,h,[10,n,h,0],2);Q0(t,zt.s,To),I(zt.s,zt.t),$.uPool1.value.set(g.x,g.z,10,0)}await y.yield();{const t=$t("last-drifts"),e=new ze;let o=0;for(let a=566;a<640;a+=2.2){const s=a+2.2*t(),l=t.sign()*t.range(3.6,8.5),n=t.range(1.1,2.4),r=n*t.range(.5,.8),h=t.range(.4,.7),d=t.range(0,50),v=t.range(-.5,.5),u=n*1.2;if(rt(s,l)<1.6||Math.abs(l)<2.6+u||Math.abs(l-Me(s))<mo+u||No(s,l))continue;I(s,l);const f=g.x,c=g.z,p=Z(s,l);if(!At.isClear(f,p,c,u,2.5))continue;const m=Math.cos(v),w=Math.sin(v);J0(e,f,p-.06,c,tt.tx*m-tt.tz*w,tt.tx*w+tt.tz*m,n,h,r,6,12,d,[10,n,d,0],0),o++,(o&3)===3&&await y.yield()}o&&(Q0(e,600,To).name="drifts")}await y.yield();const Kr=Te($,{vs:yl,fs:bl,uniforms:{uDrip:{value:[[337,-1.5,.31,.1],[341,1,.27,.6],[334,-3.5,.23,.35],[316,1,.37,.8]].map(([t,e,o,a])=>(I(t,e),new R.Vector4(g.x,g.z,o,a)))},uRoofH:{value:9}}}),Zr=(()=>{const t=[],e=[],o=[];for(let v=0;v<54;v++)for(let u=0;u<35;u++){const f=290+v*1.5,c=-17+u;I(f,c),t.push(g.x,Wo,g.z),e.push(rt(f,c)>.3?Wo-Z(f,c):-1)}for(let v=0;v+1<54;v++)for(let u=0;u+1<35;u++){const f=v*35+u,c=f+35;Math.max(e[f],e[f+1],e[c],e[c+1])<-.3||o.push(f,c,c+1,f,c+1,f+1)}const h=new R.BufferGeometry;h.setAttribute("position",new R.Float32BufferAttribute(t,3)),h.setAttribute("aD",new R.Float32BufferAttribute(e,1)),h.setIndex(o),h.computeBoundingSphere();const d=new R.Mesh(h,Kr);return d.matrixAutoUpdate=!1,W.add(d),d})();await y.yield();const sa=[],na=t=>{const e=It(t);return sa[e]||(sa[e]=new ze)};{const t=new ze,e=na(428),o=[],a=Kt(n0.s,n0.t,3);Ke(n0.s);const s=tt.tx,l=tt.tz;J0(t,a.x,a.y,a.z,s,l,16,15.5,13.5,36,56,3.1,[8,5,3.1,0],0),await y.yield();let n=0;for(const[r,h,d,v,u,f,c]of Y0)I(r,h),J0(t,g.x,Z(r,h)+d*v*c,g.z,s,l,d,d*v,d*u,12,18,f,[8,d,f,0],3),(++n&7)===7&&await y.yield();await y.yield(),ut("stone-lichen"),T0=e;for(const[r,h,d,v,,,u]of Y0){if(d<1||i()<.3)continue;const f=i.range(0,T),c=d*i.range(.3,.6),p=i.range(.4,.75);I(r+Math.cos(f)*c,h+Math.sin(f)*c),X0(new b(g.x,Z(r,h)+d*v*(u+Math.sqrt(1-c/d*(c/d)))-.25,g.z),new b(i.range(-.3,.3),1,i.range(-.3,.3)).normalize(),p,p*.13,2)}for(let r=0;r<9;r++){const h=-Math.PI/2+i.range(-.9,.9),d=i.range(-.12,.3),v=Math.sin(d),u=Math.cos(d),f=Math.cos(h)*u,c=Math.sin(h)*u,p=un(f,v,c,3.1)*.98,m=i.range(.6,1.1),w=new b(a.x+(s*f*16-l*c*13.5)*p,a.y+v*15.5*p,a.z+(l*f*16+s*c*13.5)*p);X0(w,new b(s*f-l*c,.9,l*f+s*c).normalize(),m,m*.13,2)}{const r=$t("way-stones"),h=i,d=It(428);i=r;for(let v=356;v<446;v+=2.2){const u=r.sign(),f=r.range(1.4,2.8),c=r.range(.45,1.05),p=r.range(.55,.85),m=r.range(.8,1.2),w=r.range(0,50),x=r()<.6,k=r.range(0,T),A=r.range(.5,.9),L=r(),M=v+2.2*r(),C=Po(M,u,f),F=C-u*c*.6;if(C!==C||Math.abs(F)<3.4+c||Math.abs(F)>40||L>M0(354,446,M,6)||rt(M,F)<1.2||Z(M,F)<-.45||Math.abs(F-Me(M))<mo+c*1.3+A*1.6||s0(M,F)<4.5||No(M,F))continue;I(M,F);const N=Z(M,F)+c*p*.45,V=g.x,G=g.z;if(!x||!At.isClear(V,N,G,c*1.3+A*1.6,2.5))continue;const P=It(M);T0=na(M),J0(P<d?o[P]||(o[P]=new ze):t,V,N,G,s,l,c,c*p,c*m,8,12,w,[8,c,w,0],2),X0(new b(V+Math.cos(k)*c*.35,N+c*p*.7,G+Math.sin(k)*c*.35),new b(Math.cos(k)*.25,1,Math.sin(k)*.25).normalize(),A,A*.13,2),await y.yield()}i=h}T0=h0,Q0(t,428,To),o.forEach((r,h)=>Q0(r,r0[h].s0+1,To)),I(Ye.s,Ye.t),$.uPool2.value.set(g.x,g.z,7.5,.7),I($e.s,$e.t),$.uLee.value.set(g.x,g.z,6.5,be.k)}await y.yield();const dn=async(t,e)=>{let o=null;const a=$t("way-lichen-"+t),s=i,l=new Float32Array(24),n=(r,h,d,v,u,f)=>{const c=[];for(let p=0;p<6;p++){const m=u+p/6*T;c.push(o.v(d+Math.cos(m)*r,h,v+Math.sin(m)*r,f,[4,0,0,0]))}return c};i=a;for(let r=t;r<e;r+=1.6){const h=a.sign(),d=a.range(2.4,4.2),v=a.range(1.1,2),u=a.range(-.25,.25),f=a.range(-.25,.25),c=a.int(3,6),p=a(),m=r+1.6*a();for(let A=0;A<24;A++)l[A]=a();const w=Po(m,h,d),x=w-h*.6;if(w!==w||Math.abs(x)<4.2||Math.abs(x)>40||p>M0(446,566,m,6))continue;o=T0=na(m);for(let A=0;A<c;A++){const L=A*4,M=m+(l[L]-.5)*3,C=x-h*(1+2.2*l[L+1]),F=.7+.9*l[L+2],N=F*.3;if(Math.abs(C)<3.6||rt(M,C)<3.4||Z(M,C)<-.4||s0(M,C)<4.5||Math.abs(C-Me(M))<mo+N)continue;I(M,C);const V=g.x,G=g.z,P=Z(M,C)-.05,J=l[L+3]*T,pt=Pt(rs,is,.25),xt=Pt(rs,is,.8);vo(V,G)||!At.isClear(V,P+F,G,N,2.5)||o.loft([n(N*.22,P,V,G,J,pt),n(N*.2,P+F*.5,V,G,J,pt),n(N*.42,P+F*.78,V,G,J,xt),n(N,P+F,V,G,J,xt),n(N*.84,P+F*.97,V,G,J,xt),n(N*.12,P+F*.7,V,G,J,pt)],!0)}if(rt(m,x)<2.2||Z(m,x)<-.4||s0(m,x)<4.5)continue;I(m,x);const k=Math.min(v,(rt(m,x)-.6)/2.2);Math.abs(x-Me(m))<mo+k*1.5||vo(g.x,g.z)||!At.isClear(g.x,Z(m,x)+k,g.z,k*1.5,2.5)||(X0(new b(g.x,Z(m,x)+.1,g.z),new b(u,1,f).normalize(),k,k*.13,k>1.5?3:2),await y.yield())}i=s,T0=h0};ut("lichen-garden");for(const t of b0)if(t.lichen){T0=na(t.s);for(let e=0,o=0,a=Math.round(t.lichen*(.7+.3*lt));e<a&&o<1500;o++){const s=i.range(0,T),l=t.R*Math.sqrt(i())*.95,n=t.s+Math.cos(s)*l,r=t.t+Math.sin(s)*l,h=rt(n,r),d=i.range(1.6,2.9),v=[i.range(-.25,.25),i.range(-.25,.25)];if(h<4||Math.abs(r)<5.4||Z(n,r)<-.4||s0(n,r)<4.5)continue;I(n,r);const u=Math.min(d,(h-1)/2.6,La(n,r)||Math.abs(r-Me(n))<3.6?.5:9);X0(new b(g.x,Z(n,r)-.2,g.z),new b(v[0],1,v[1]).normalize(),u,u*.13,3),e++,(e&3)===3&&await y.yield()}t.id==="lichen"?await dn(446,506):t.id==="last"&&await dn(506,566),T0=h0}for(let t=0;t<sa.length;t++){const e=sa[t];e&&e.k&&(Q0(e,r0[t].s0+1).name="lichen",await y.yield())}await y.yield(),ut("ptarmigan");const Fe=new R.Group,Oo=new R.Group,w0={s:542,t:18.5},pn=new b(0,1,0);{const t=()=>{const D=[],E=[],q=[],B=[];let K=0;return{v(H,O,Y,at,nt,st){return D.push(H.x,H.y,H.z),E.push(O.x,O.y,O.z),q.push(Y,at,nt,st),K++},tri(H,O,Y){B.push(H,O,Y)},build(){const H=new R.BufferGeometry;return H.setAttribute("position",new R.Float32BufferAttribute(D,3)),H.setAttribute("aBN",new R.Float32BufferAttribute(E,3)),H.setAttribute("aF",new R.Float32BufferAttribute(q,4)),H.setIndex(B),H.computeVertexNormals(),H.computeBoundingSphere(),H}}},e=new b,o=new b,a=new b,s=new b,l=new b,n=new b,r=new b,h=new b,d=new b,v=new b,u=new b(0,1,0),f=(D,E,q,B,K,H,O,Y,at,nt=.14)=>{e.crossVectors(B,q).normalize(),e.dot(K)<0&&e.negate();const st=[];for(let S=0;S<3;S++)for(let U=-1;U<=1;U++){const ht=S*.5;o.copy(E).addScaledVector(q,H*ht).addScaledVector(B,O*U).addScaledVector(e,(U===0?nt*O:0)-.1*H*ht*ht),a.copy(K).addScaledVector(B,.3*U).addScaledVector(q,.22*(ht-.3)).normalize(),st.push(D.v(o,a,U,ht,at,Y))}for(let S=0;S<2;S++)for(let U=0;U<2;U++){const ht=st[S*3+U],bt=st[S*3+U+1],Dt=st[(S+1)*3+U],Ct=st[(S+1)*3+U+1];D.tri(ht,bt,Ct),D.tri(ht,Ct,Dt)}},c=(D,E,q,B,K)=>{const H=new b,O=new b(0,1,0),Y=new b,at=[],nt=E.length;for(let st=0;st<nt;st++){H.copy(E[Math.min(st+1,nt-1)]).sub(E[Math.max(st-1,0)]).normalize(),Math.abs(H.dot(O))>.9&&O.set(1,0,0),O.addScaledVector(H,-O.dot(H)).normalize(),Y.crossVectors(H,O);const S=q(st/(nt-1)),U=[];for(let ht=0;ht<B;ht++){const bt=ht/B*T;a.copy(O).multiplyScalar(Math.cos(bt)).addScaledVector(Y,Math.sin(bt)),o.copy(E[st]).addScaledVector(a,S),U.push(D.v(o,a,0,0,0,K))}at.push(U)}for(let st=0;st+1<nt;st++)for(let S=0;S<B;S++){const U=(S+1)%B;D.tri(at[st][S],at[st][U],at[st+1][U]),D.tri(at[st][S],at[st+1][U],at[st+1][S])}},p=(D,E,q,B)=>{const K=[];for(let H=0;H<=6;H++){const O=-Math.PI/2+Math.PI*H/6,Y=[];for(let at=0;at<8;at++){const nt=at/8*T;a.set(Math.cos(nt)*Math.cos(O),Math.sin(O),Math.sin(nt)*Math.cos(O)),o.copy(E).addScaledVector(a,q),Y.push(D.v(o,a,0,0,0,B))}K.push(Y)}for(let H=0;H<6;H++)for(let O=0;O<8;O++){const Y=(O+1)%8;D.tri(K[H][O],K[H][Y],K[H+1][Y]),D.tri(K[H][O],K[H+1][Y],K[H+1][O])}},m=[[-12.6,-1.2,.05,.05],[-11,-.9,2.6,3.4],[-8.2,-.3,5.3,6],[-4.2,0,7.3,7.9],[.2,.2,8.2,8.6],[4,.8,8.4,8.3],[7,1.8,7.8,7.1],[9.4,2.8,6.3,5.6],[11.1,3.5,4,3.5],[12,3.8,.05,.05]],w=D=>{const E=m.length,q=Vt(D,0,1)*(E-1),B=Math.min(Math.floor(q),E-2),K=q-B,H=K*K,O=H*K,Y=m[Math.max(B-1,0)],at=m[B],nt=m[B+1],st=m[Math.min(B+2,E-1)],S=[0,0,0,0];for(let U=0;U<4;U++)S[U]=.5*(2*at[U]+(nt[U]-Y[U])*K+(2*Y[U]-5*at[U]+4*nt[U]-st[U])*H+(3*at[U]-3*nt[U]+st[U]-Y[U])*O);return S[2]=Math.max(S[2],.04),S[3]=Math.max(S[3],.04),S},x=(D,E,q)=>{const B=w(D),K=Math.cos(E),H=Math.sin(E),O=1+.05*Math.exp(-((H-.2)**2)/.12)*z(.15,.3,D)*(1-z(.62,.8,D));return q.set(K*B[3]*O,Math.max(B[1]+H*B[2]*(H<0?.9:1),-7.55),B[0])},k=2.9,A=(D,E,q)=>{const B=-3.05+6.1*Vt(D,0,1),K=k*Math.sqrt(Math.max(1-(B/3.1)**2,4e-4)),H=Math.sin(E);return q.set(Math.cos(E)*K*.96,H*K*(H>0?.95:1),B)},L=(D,E,q,B)=>{D(E,q,s),D(E-.012,q,d),D(E,q+.03,v),l.copy(d).sub(s),l.lengthSq()<1e-9&&l.set(0,0,-1),l.normalize(),n.copy(v).sub(s),n.lengthSq()<1e-9&&n.set(1,0,0),n.normalize(),r.crossVectors(n,l),r.lengthSq()<1e-9&&r.set(0,1,0),r.normalize(),r.x*s.x+r.y*(s.y-B)<0&&r.negate(),n.crossVectors(l,r).normalize()},M=(D,E,q,B,K)=>{const H=[];for(let O=0;O<=q;O++){const Y=O/q,at=[];for(let nt=0;nt<B;nt++)L(E,Y,nt/B*T,K(Y)),at.push(D.v(s,r,0,0,0,0));H.push(at)}for(let O=0;O<q;O++)for(let Y=0;Y<B;Y++){const at=(Y+1)%B;D.tri(H[O][Y],H[O][at],H[O+1][at]),D.tri(H[O][Y],H[O+1][at],H[O+1][Y])}},C=t();M(C,x,36,30,D=>w(D)[1]),await y.yield();const F=34;for(let D=0;D<F;D++){const E=.035+.955*(D/(F-1)),q=w(E),B=z(.6,.9,E),K=it(2.9,1.9,B),H=Math.max(6,Math.round(Math.PI*(q[2]+q[3])/(K*.5)));for(let O=0;O<H;O++){const Y=(O+D%2*.5+i.range(-.25,.25))/H*T,at=i(),nt=K*i.range(.8,1.2),st=it(.2,.42,B)+i.range(-.08,.12),S=i.range(-.3,.3);Math.sin(Y)<-.78||(L(x,E,Y,q[1]),h.copy(l).multiplyScalar(Math.cos(st)).addScaledVector(r,Math.sin(st)).addScaledVector(n,S).normalize(),d.crossVectors(r,h).normalize(),s.addScaledVector(r,.04),f(C,s,h,d,r,nt,nt*.42,1,at))}(D&3)===3&&await y.yield()}for(const D of[-1,1])[[.62,.74,.34,7,3.6,1.5,.14],[.36,.68,.22,8,5.6,1.7,.1],[.12,.52,.14,6,7.2,1.45,.07]].forEach(([E,q,B,K,H,O,Y],at)=>{for(let nt=0;nt<K;nt++){const st=it(q,B,nt/(K-1)),S=w(st);L(x,st,(D>0?E:Math.PI-E)+i.range(-.04,.04),S[1]),h.copy(l).multiplyScalar(Math.cos(Y)).addScaledVector(r,Math.sin(Y)).addScaledVector(n,-D*(at===2?.25:.06)).normalize(),d.crossVectors(r,h).normalize(),s.addScaledVector(r,.22+.06*at),f(C,s,h,d,r,H*i.range(.92,1.08),O,1,i(),.1)}});for(let D=-6;D<=6;D++){const E=D*.085;h.set(Math.sin(E),-.1,-Math.cos(E)).normalize(),d.crossVectors(u,h).normalize(),s.set(D*.45,-1.5-.03*D*D,-10.6),f(C,s,h,d,u,7.4-.9*Math.abs(D)/6,1.05,2,i(),.08)}for(let D=-3;D<=3;D++){const E=D*.1;h.set(Math.sin(E),-.13,-Math.cos(E)).normalize(),d.crossVectors(u,h).normalize(),s.set(D*.7,-.75-.05*D*D,-9.6),f(C,s,h,d,u,5.4-.25*Math.abs(D),1.3,1,i(),.12)}await y.yield();for(const D of[-1,1]){const E=new b(D*2.9,-3.2,7.4),q=new b(D*3,-7,8.7);c(C,[E,E.clone().lerp(q,.5).add(new b(0,0,.3)),q],B=>1.25-.3*B,8,0);for(let B=0;B<4;B++)for(let K=0;K<7;K++){const H=(K+.5*(B%2))/7*T,O=B/4;r.set(Math.cos(H),0,Math.sin(H)),s.copy(E).lerp(q,O).addScaledVector(r,1.2-.3*O),h.set(r.x*.3,-1,r.z*.3+.3).normalize(),d.crossVectors(r,h).normalize(),f(C,s,h,d,r,i.range(1.5,2),.7,1,i())}for(const B of[-.55,0,.55]){const K=B+D*.2,H=Math.sin(K),O=Math.cos(K),Y=B===0?3.6:3,at=new b(q.x+H*Y,-7.5,q.z+O*Y),nt=q.clone().lerp(at,.5);nt.y=-7.25,c(C,[q.clone().add(new b(0,-.2,0)),nt,at],st=>.72-.3*st,7,0),c(C,[at.clone(),new b(at.x+H*.55,-7.5,at.z+O*.55),new b(at.x+H*.95,-7.7,at.z+O*.95)],st=>.26*(1-.85*st),5,3);for(let st=0;st<5;st++)for(const S of[-1,0,1]){const U=st/5;s.copy(q).lerp(at,U),s.y+=.5-.2*U+(S===0?.15:-.2),s.x+=O*S*.5,s.z-=H*S*.5,r.set(O*S*.7,1,-H*S*.7).normalize(),h.set(H+O*S*.45,-.12,O-H*S*.45).normalize(),d.crossVectors(r,h).normalize(),f(C,s,h,d,r,i.range(1.1,1.5),.5,1,i())}}}await y.yield();const N=t(),V=[new b(-2.52,.45,1.25),new b(2.52,.45,1.25)],G=[new b(-2.4,1.4,1.3),new b(2.4,1.4,1.3)];M(N,A,14,20,()=>0);for(let D=0;D<13;D++){const E=.06+.9*(D/12),q=-3.05+6.1*E,B=k*Math.sqrt(Math.max(1-(q/3.1)**2,.01)),K=1-z(.1,.45,E),H=it(1.25,2.6,K),O=Math.max(5,Math.round(T*B/(H*.54)));for(let Y=0;Y<O;Y++){const at=(Y+D%2*.5+i.range(-.2,.2))/O*T,nt=i(),st=H*i.range(.85,1.15),S=.2+i.range(-.05,.12);L(A,E,at,0),h.copy(l).multiplyScalar(Math.cos(S)).addScaledVector(r,Math.sin(S)).normalize(),d.crossVectors(r,h).normalize(),s.addScaledVector(r,.03),v.copy(s).addScaledVector(h,st*.6),!(Math.min(s.distanceTo(V[0]),s.distanceTo(V[1]),v.distanceTo(V[0]),v.distanceTo(V[1]))<.68||Math.min(v.distanceTo(G[0]),v.distanceTo(G[1]))<.6)&&f(N,s,h,d,r,st,st*.45,1,nt)}}c(N,[new b(0,-.4,2.6),new b(0,-.5,3.45),new b(0,-.8,4),new b(0,-1.25,4.35)],D=>.6*(1-.88*D*D),8,3);for(const D of[-1,1])p(N,V[D<0?0:1],.38,4),c(N,[new b(D*2.25,1.2,2),new b(D*2.5,1.5,1.3),new b(D*2.4,1.3,.6)],E=>.2*Math.sin(Math.PI*(.15+.7*E))+.05,5,5);await y.yield();const P=Te($,{vs:ml,fs:wl,uniforms:{uKey:{value:pn}}}),J=new R.Mesh(C.build(),P);J.frustumCulled=!1,Fe.add(J),await y.yield();const pt=new R.Mesh(N.build(),P);pt.frustumCulled=!1,Oo.add(pt),Oo.position.set(0,10.2,8.9),Fe.add(Oo);const xt=Z(Se.s,Se.t);I(Se.s,Se.t),Fe.position.set(g.x,xt+7.5*Vo,g.z),Fe.scale.setScalar(Vo),Ke(Se.s);const Nt=.35,qt=-.94;Fe.rotation.y=Math.atan2(tt.tx*Nt-tt.tz*qt,tt.tz*Nt+tt.tx*qt),W.add(Fe),r0[It(Se.s)].det.push(Fe),I(w0.s,w0.t),$.uPool0.value.set(g.x,g.z,15,1),pn.set(g.x-Fe.position.x,Z(w0.s,w0.t)+rt(w0.s,w0.t)-Fe.position.y,g.z-Fe.position.z).normalize()}await y.yield();const mn=new b(.62,.86,1.7).multiplyScalar(2.6),Yr=Ot==="night"?mn:new b(1,1,1),Ho=(t,e,o,a,s,l=Yr,n=0,r=null)=>{const d=r?16:1,v=[],u=[],f=[],c=[],p=[];for(let x=0;x<=d;x++)for(let k=0;k<=24;k++){const A=k/24*T,L=x/d,M=it(a,o,L),C=it(e.y,t.y,L),F=Math.cos(A),N=Math.sin(A);let V=it(e.x,t.x,L)+F*M,G=it(e.z,t.z,L)+N*M,P=F,J=N,pt=1;if(r){const xt=it(r.s0,r.s1,L),Nt=it(r.t0,r.t1,L);I(xt,Nt);const qt=g.x,D=g.z;I(xt+F*M,Nt+N*M),V=g.x,G=g.z;const E=Math.hypot(V-qt,G-D)||1;P=(V-qt)/E,J=(G-D)/E,pt=Vt((Math.min(Ie(xt+F*M,Nt+N*M),Ie(xt+F*(M+.8),Nt+N*(M+.8)))-C-.2)/1.4,0,1)}v.push(V,C,G),u.push(P,0,J),f.push(k/24,L),c.push(pt)}for(let x=0;x<d;x++)for(let k=0;k<24;k++){const A=x*25+k,L=A+24+1;p.push(A,A+1,L+1,A,L+1,L)}const m=new R.BufferGeometry;m.setAttribute("position",new R.Float32BufferAttribute(v,3)),m.setAttribute("normal",new R.Float32BufferAttribute(u,3)),m.setAttribute("uv",new R.Float32BufferAttribute(f,2)),m.setAttribute("aOpen",new R.Float32BufferAttribute(c,1)),m.setIndex(p),m.computeBoundingSphere();const w=new R.Mesh(m,Te($,{vs:Ml,fs:zl,transparent:!0,depthWrite:!1,blending:R.AdditiveBlending,uniforms:{uOpen:{value:1},uTint:{value:l},uSoft:{value:n}}}));return w.matrixAutoUpdate=!1,w.renderOrder=3,W.add(w),r0[It(s)].det.push(w),w},Ie=(t,e)=>Z(t,e)+rt(t,e),$r=Ho(Kt(zt.s,zt.t,Ie(zt.s,zt.t)+.5),Kt(zt.s,zt.t,0),4.2,6.5,zt.s);{const t=$.uDayCol.value;Ho(Kt(Ye.s,Ye.t,Ie(Ye.s,Ye.t)+.5),Kt($e.s,$e.t+.2,0),2.3,3.6,425,new b(be.c[0]/Math.max(t.r,.05),be.c[1]/Math.max(t.g,.05),be.c[2]/Math.max(t.b,.05)).multiplyScalar(be.shaft),1,{s0:$e.s,t0:$e.t+.2,s1:Ye.s,t1:Ye.t})}Ho(Kt(w0.s,w0.t,Ie(w0.s,w0.t)+.5),Kt(Se.s-.8,Se.t-.6,4),4,10,545);const jr=Ot==="night"?1:0,F0={s:335.5,t:-1},L0={s:403.5,t:-3.4};jr&&(I(F0.s,F0.t),$.uPool3.value.set(g.x,g.z,9.5,1.9),Ho(Kt(F0.s,F0.t,Ie(F0.s,F0.t)+.5),Kt(F0.s+1,F0.t+2,Wo),2.6,6,F0.s),I(L0.s,L0.t),$.uPool4.value.set(g.x,g.z,7.5,2),Ho(Kt(L0.s,L0.t,Ie(L0.s,L0.t)+.5),Kt(L0.s-.6,L0.t-.6,0),1.6,3.6,L0.s,mn.clone().multiplyScalar(2.2)),I(481,1),$.uAur.value.set(g.x,g.z,30,.8)),await y.yield();const yo=(t,e,o,a,s)=>$.uPatch.value[t].set(e,o,a,s);yo(0,Us,Gs,30,.3),fn.forEach(([t,e],o)=>yo(1+o,t,e,3.6,.3)),yo(6,0,ve,46,.5);{let t=7;const e=(o,a,s,l)=>{I(o,a),yo(t,g.x,g.z,s,l),t+=t===10?2:1};e(64,0,28,.36),e(Ft-62,0,36,.2),e(10,0,40,.1),e(-8,0,20,.06);for(const o of b0)o.thin&&e(o.s+o.thin[0],o.t+o.thin[1],o.thin[2],o.thin[3]);e(Ce.s,Ce.t,5,.3),e(426,9,7,.3);{const o=Ko[0].P[10];yo(t++,o[0],o[1],15,-.38)}}const O0=(I(214,17),{x:g.x,z:g.z,y:Z(214,17)+rt(214,17)});Zt&&(yo(11,O0.x,O0.z,11,.3),$.uWell.value.set(O0.x,O0.z,3.4,0));let W0=null;if(Zt){const t=new ze,e=[.03,.03,.04],o=(a,s)=>{const l=.8+.2*Math.sin(s*7+a*23);return[.86*l,.9*l,.95*l]};t.tube([new b(0,13,-1.5),new b(0,6,-.6),new b(0,1.6,0)],a=>1.25-.35*a,9,o,null,!1);for(const a of[-.6,0,.6,Math.PI]){const s=a>3?1.5:3.1,l=Math.sin(a),n=Math.cos(a);t.tube([new b(0,1.6,0),new b(l*s*.45,1,n*s*.45),new b(l*s,.55,n*s)],r=>.85-.3*r,7,o,null,!0),t.tube([new b(l*s,.6,n*s),new b(l*(s+.5),.5,n*(s+.5)),new b(l*(s+.9),.1,n*(s+.9))],r=>.2*(1-.8*r),5,()=>e,null,!0)}W0=new R.Mesh(t.build(),Do),W0.frustumCulled=!1,W0.visible=!1,W0.scale.setScalar(.8),W0.rotation.y=2.2,W0.position.set(O0.x,O0.y,O0.z),W.add(W0),await y.yield()}const cs=et("#74502f"),Xr=et("#6e5a48"),Qr=et("#857b70"),Jr=et("#c08a34"),hs=et("#8e5c22"),bo=et("#15110e"),ra=et("#c3ccd2"),ti=et("#a9a78e"),ei=et("#3c2a1c"),oi=et("#a89a78"),ai=et("#b3a48e"),wn=t=>(e,o,a=0)=>{let s=Pt(Pt(oi,Jr,z(-.95,-.6,o)),hs,.45*z(-.2,.8,o));if(t){const n=1-z(.2,.44,e);s=Pt(Pt(s,et("#a4692a"),n*z(-.7,-.2,o)),et("#c9a868"),.75*n*(1-z(-.9,-.45,o)))}else s=Pt(s,bo,.92*Math.exp(-(a*a)/.085)*z(0,.4,o));const l=z(.5,.6,e+.04*o)*z(-.42,-.08,o+.2*z(.56,.74,e));return s=t?Pt(s,et("#6a4218"),.5*l):Pt(s,bo,l),e>.97?Pt(s,et("#6a4a40"),.7):s},qe={len:11,stride:6,lift:1.15,rim:.9,vivid:.78,neckZ:.72,hipY:1.9,hipZ:-3.3,stem:!0,fin:0,sides:28,rings:40,smooth:!0,fringe:{len:en,rings:40,sides:28},soft:1,furC:.4,haunch:on,knee:.5,gain:Lt?1:1.2,under:Lt?.6:.55,furK:1,stripe:Lt?0:1,snout:.03,kick:2,footRot:1.05,bob:.3,roll:.13,haunchK:an,tailUp:Lt?.45:.75,band:Lt?1:0,rows:tn,coat:Lt?wn(!0):(t,e)=>Pt(Pt(Pt(Pt(Qr,Xr,z(-.95,-.55,e)),cs,z(-.45,.15,e)),ei,z(.4,1,e)*.6),ai,.8*z(.46,.58,t)*z(.84,.76,t)*z(-.15,-.6,e)),ear:Lt?{z:.775,x:1.3,up:.86,r:.7,yaw:.9,seg:18,fur:0}:{z:.775,x:1.34,up:.94,r:.92,yaw:.9,seg:22,fur:0},earIn:et(Lt?"#7a564c":"#c8a295"),earOut:Lt?bo:et("#6f5646"),eye:{z:.87,r:Lt?.29:.28},tail:{len:Lt?1.5:2.4,r:.24,droop:.35,lift:.1,point:!0,col:et(Lt?"#b08a52":"#8a705c"),tip:et(Lt?"#c9ad7c":"#a58c78")},legs:[{z:.16,x:1.5,hip:1.3,knee:.5,foot:1.5,r:.4,ph:0,alt:.5,sole:.33,toes:4},{z:.63,x:1.25,hip:1.1,knee:.3,foot:.85,r:.3,ph:.5,alt:.5,sole:.2,toes:3}],paw:et("#8a6a62"),sole:et("#e6c4b6"),toe:et("#d6b0a2")},gn={coat:Lt?wn(!1):qe.coat,lift:1.75,footRot:1.5,roll:.09,haunchK:0,tailUp:0,band:0,sole:et("#d2b4aa"),toe:et("#c9aaa0"),tail:{...qe.tail,r:.2,point:!1,col:Lt?hs:cs,tip:Lt?hs:cs},legs:[{...qe.legs[0],sole:.38,foot:1.9},qe.legs[1]]},fs={len:25,stride:30,lift:1.5,duty:.16,rim:.4,vivid:.72,neckZ:.78,hipY:3.2,hipZ:-8,fin:.36,tufts:2,fill:.12,gain:.9,under:1,furK:1,furC:2.3,whip:1,snout:.02,kick:.6,legSub:!0,legCoat:et("#bcc5cb"),footRot:1.1,bob:.1,roll:.03,archZ:.4,rows:[[0,3.2,.3,.3],[.04,3.3,1.5,1.4],[.12,3.4,2.1,1.95],[.24,3.35,1.95,1.8],[.4,3.3,1.55,1.45],[.55,3.35,1.7,1.55],[.66,3.45,2,1.8],[.76,3.95,1.5,1.35],[.85,4.35,1.5,1.5],[.93,4.2,1.1,1.15],[.98,4,.55,.6],[1,3.95,.1,.1]],coat:(t,e)=>t>.985?bo:Pt(ti,ra,z(-.5,.25,e)),ear:{z:.835,x:1.1,up:.8,r:.72,yaw:.5},earIn:et("#b9a6a0"),earOut:ra,eye:{z:.915,r:.27},tail:{len:9,r:.8,droop:.2,lift:1.2,curl:2.5,col:ra,tip:re?ra:bo,tipFrom:.42,brush:1.2},legs:[{z:.12,x:1.55,hip:3,knee:1,foot:2.5,r:.66,ph:0,alt:.05,sole:.55},{z:.66,x:1.4,hip:3,knee:.5,foot:1.7,r:.6,ph:.5,alt:.05,sole:.5}],paw:et("#b9bcc0"),sole:et("#8f8a8c")},vs={len:7.2,stride:1.5,lift:.3,rim:1.1,vivid:.9,neckZ:.62,hipY:1,hipZ:-2.2,fin:.24,tufts:2,furK:1,furC:.45,under:.45,snout:.2,rows:[[0,1,.15,.15],[.05,1.05,.75,.8],[.17,1.1,1.05,1.15],[.34,1.1,1.1,1.2],[.5,1.05,1,1.05],[.6,1,.82,.8],[.7,.92,.6,.55],[.8,.84,.4,.36],[.9,.78,.24,.22],[.97,.76,.15,.14],[1,.76,.05,.05]],coat:(t,e)=>t>.93?et("#b98c82"):Pt(Pt(et("#b4babc"),et("#26221f"),z(-.42,-.22,e)),et("#b4babc"),.85*z(.6,.64,t)*z(.7,.66,t)*z(-.1,.1,e)*z(.55,.35,e)),ear:{z:.6,x:.62,up:.6,r:.2},earIn:et("#7a625c"),earOut:et("#26221f"),eye:{z:.69,r:.13},tail:{len:4.6,r:.17,droop:.3,lift:.5,col:et("#3a332e"),tip:et("#3a332e")},legs:[{z:.16,x:.85,hip:.5,knee:.15,foot:.5,r:.17,ph:0,alt:.5,sole:.14,toes:3},{z:.5,x:.7,hip:.5,knee:.1,foot:.34,r:.15,ph:.5,alt:.5,sole:.12,toes:3}],paw:et("#a98a84"),sole:et("#b79a94")},si=[],Uo=(t,e,o=1,a=0)=>{const s=new R.Vector4,l=new R.Vector2;if(t.legs&&t.legs.length){const[d,v]=t.legs,u=f=>(f.z-.5)*t.len+f.knee*.3;s.set(d.r*.9,u(d),v.r*.9,u(v)),l.set(d.foot-d.knee*.3,v.foot-v.knee*.3)}const n=Te($,{vs:ar,fs:sr,uniforms:{uPhase:{value:0},uRun:{value:0},uSit:{value:0},uStride:{value:t.stride},uLift:{value:t.lift},uArch:{value:0},uLen:{value:t.len},uSnout:{value:t.snout},uHipZ:{value:t.hipZ},uHipY:{value:t.hipY},uNeckZ:{value:t.neckZ},uWhip:{value:t.whip||0},uT0:{value:a},uRimK:{value:t.rim},uVivid:{value:t.vivid},uFillK:{value:t.fill||0},uGain:{value:t.gain??1},uUnder:{value:t.under||0},uDuty:{value:t.duty||.5},uTailDrop:{value:t.tail?t.tail.lift:0},uKnee:{value:t.knee||0},uFurK:{value:t.furK??0},uFurC:{value:t.furC??1},uStripe:{value:t.stripe||0},uKick:{value:t.kick||0},uFootRot:{value:t.footRot||0},uBob:{value:t.bob??.1},uRoll:{value:t.roll||0},uArchZ:{value:t.archZ??.5},uAnk:{value:s},uFootL:{value:l},uLook:{value:0},uAhead:{value:new R.Vector2},uRimA:{value:0},uFringe:{value:0},uSoft:{value:t.soft||0},uHaunch:{value:t.haunchK||0},uTailUp:{value:t.tailUp||0},uLemStripe:{value:t.band||0}}}),r=new R.Mesh(e,n);if(r.frustumCulled=!1,r.scale.setScalar(o),W.add(r),e.userData.fringe){const d=Te($,{vs:ar,fs:sr,transparent:!0,depthWrite:!1,uniforms:{...n.uniforms,uFringe:{value:1}}}),v=new R.Mesh(e.userData.fringe,d);v.frustumCulled=!1,v.renderOrder=6,r.add(v)}const h={mesh:r,u:n.uniforms,spec:t,scale:o};return si.push(h),h},ia=(t,e,o,a,s,l)=>{t.mesh.position.set(e,o,a),t.mesh.rotation.y=Math.atan2(s,l)},xn=t=>{const e=new R.CatmullRomCurve3(t.map(o=>new b(o[0],o[2]??0,o[1])));return e.arcLengthDivisions=120,{cv:e,len:e.getLength()}},Je=(t,e)=>(I(t,e),[g.x,g.z,Z(t,e)]),Re=(t,e)=>{const o=Ko[t].P[Math.min(e,Ko[t].P.length-1)];return[o[0],o[1],-.08]},ne=new b,H0=new b,ni=(t,e,o)=>{const a=Vt(o/e.len,0,1);return e.cv.getPointAt(a,ne),e.cv.getTangentAt(a,H0),ia(t,ne.x,ne.y,ne.z,H0.x,H0.z),ne},ri=Aa(qe);await y.yield();const t0=Uo(qe,ri);t0.mesh.name="followed";const yn=(t,e)=>{const o=t.length,a=new Float64Array(o),s=new Float64Array(o-1);for(let l=0;l+1<o;l++)s[l]=(t[l+1][e]-t[l][e])/(t[l+1][0]-t[l][0]);for(let l=1;l+1<o;l++)a[l]=s[l-1]*s[l]<=0?0:2*s[l-1]*s[l]/(s[l-1]+s[l]);return a[0]=s[0],a[o-1]=s[o-2],l=>{if(l<=t[0][0])return t[0][e];if(l>=t[o-1][0])return t[o-1][e];let n=0;for(;l>t[n+1][0];)n++;const r=t[n+1][0]-t[n][0],h=(l-t[n][0])/r,d=h*h,v=d*h;return(2*v-3*d+1)*t[n][e]+(v-2*d+h)*r*a[n]+(3*d-2*v)*t[n+1][e]+(v-d)*r*a[n+1]}},bn=(t,e=.05)=>{const o=yn(t,1),a=yn(t,2),s=t[0][0],l=t[t.length-1][0],n=Math.ceil((l-s)/25e-5)+2,r=(l-s)/(n-1),h=new Float32Array(n),d=new Float32Array(n),v=new Float32Array(n),u=new Float32Array(n),f=new Float32Array(n),c=new Float32Array(n),p=new Float32Array(n);let m=0,w=0,x=0,k=-1;for(let M=0;M<n;M++){const C=s+r*M,F=o(C),N=a(C);if(I(F,N),h[M]=g.x,v[M]=g.z,d[M]=Z(F,N)+e,M>0){const V=h[M]-h[M-1],G=v[M]-v[M-1],P=Math.hypot(V,G);x+=P,p[M]=P/(r*ot),P>.012&&(m=V/P,w=G/P,k<0&&(k=M))}u[M]=m,f[M]=w,c[M]=x}for(let M=0;M<Math.max(k,0);M++)u[M]=u[k],f[M]=f[k];const A=new Float32Array(n),L=new Float32Array(n);for(let M=0;M<n;M++){let C=0,F=0;for(let V=-8;V<=8;V++){const G=Vt(M+V,0,n-1);C+=u[G],F+=f[G]}const N=Math.hypot(C,F)||1;A[M]=C/N,L[M]=F/N}return{u0:s,u1:l,at(M,C){const F=Vt((M-s)/r,0,n-1.001),N=Math.floor(F),V=F-N;return C.x=it(h[N],h[N+1],V),C.y=it(d[N],d[N+1],V),C.z=it(v[N],v[N+1],V),C.hx=it(A[N],A[N+1],V),C.hz=it(L[N],L[N+1],V),C.d=it(c[N],c[N+1],V),C.v=it(p[N],p[N+1],V),C}}},ii=t=>21.6+22.4*z(.232,.266,t)*(1-z(.28,.345,t))+18*z(.585,.612,t)*(1-z(.622,.675,t))+2.5*z(.7,.752,t),Mn=[[0,24,0],[.012,24,0]];for(let t=30;t<=589.5;t=t<588?Math.min(t+3,588):t+1.5){let e=.012,o=.9;for(let a=0;a<30;a++){const s=(e+o)/2;s*ot+ii(s)<t?e=s:o=s}Mn.push([(e+o)/2,t,Me(t)])}const R0=bn(Mn);await y.yield();const oe={x:0,y:0,z:0,hx:0,hz:-1,d:0,v:0},us=re?.88:1,U0=Uo(fs,Aa(fs),us,2);U0.mesh.name="ermine",await y.yield();const zn=(t,e,o,a,s)=>{const l=xn(s),n=new Float32Array(201),r=new Float32Array(201);let h=0,d=1e9;for(let v=0;v<=200;v++){l.cv.getPointAt(v/200,ne),n[v]=ne.x,r[v]=ne.z;const u=Math.hypot(ne.x-e[0],ne.z-e[1]);u<d&&(d=u,h=v/200)}return{u0:t-h*o,u1:t+(1-h)*o,arch:a,R:l,X:n,Z:r,at:e}},to=[zn(.27,Je(235.4,0),.07,4.9,[Re(0,11),Re(0,9),Re(0,7),Je(236.3,-10),Je(235.4,0),Je(232.6,9),Je(229.4,20),Re(1,8),Re(1,10),Re(1,13)]),zn(.6175,Je(489,-1),.085,3.4,[Re(5,9),Re(5,7),Re(5,5),Je(493,-8),Je(489,-1),Je(488.2,5.5),Re(7,3),Re(7,5),Re(7,8)])],kn=(t,e,o,a)=>{const s=Vt((e-t.u0)/(t.u1-t.u0),0,1);return t.R.cv.getPointAt(s,o),t.R.cv.getTangentAt(s,a),s};await y.yield();const li=Aa({...qe,...gn,fringe:null,smooth:!1,rings:26,fin:.4,tufts:2,sides:16,ear:{...qe.ear,fur:Lt?.3:.16}}),ci={...qe,...gn,soft:0,furC:1,gain:.85,under:0};await y.yield();const Sn=[];let hi=0;ut("hall-voles");for(const[t,e]of Va){const o=hi++,a=1.05+.08*(i.range(1.08,1.2)-1.08)/.12,s=Uo(ci,li,o===0?1.1:o===1?1:a,o*3.7+1),l=Je(t,e),n=(t+206.5)/2+(o%3-1)*1.6,r=(e+31)/2,h=to[0];s.home=l,s.ub=h.u1;for(let d=0;d<=200;d++)if(Math.hypot(h.X[d]-l[0],h.Z[d]-l[1])<34){s.ub=it(h.u0,h.u1,d/200);break}s.yaw=Math.atan2(r-e,n-t)+i.range(-.5,.5)*.6,s.R=xn([l,Je(n,r),Re(10,11),Re(10,13),Re(10,15)]),s.u.uGain.value=.85,s.u.uKnee.value=.7,Ke(t),s.dir=[tt.tx,tt.tz],Sn.push(s),o%3===2&&await y.yield()}await y.yield();const G0=Uo(vs,Aa(vs),1.3,5),la=[337,5.2],fi=68.5,An=16,vi=[[344,4.8,An],[348.5,4.4,14.5],[352.5,7,13.3],[356,11,12.3]],Mo=bn([[(la[0]-fi)/ot,...la],[(la[0]-An)/ot,...la],...vi.map(([t,e,o])=>[(t-o)/ot,t,e])],.02),Fn=Je(337.6,-3);G0.u.uGain.value=1.7,G0.u.uRimK.value=1.7,await y.yield();const ds={value:400},ca=et("#b4521a"),Ln=et("#cc7a2e"),Wn=et("#2c1a10"),ui=et("#6a3212"),ha=et("#c8c6ba"),E0=et("#120e0b"),Rn=et("#bcae96"),di=et("#8c5a50"),Nn=()=>{const t=[],e=[],o=[],a=[],s=[];let l=0;return{v(n,r,h,d,v,u,f){return t.push(n.x,n.y,n.z),e.push(r.x,r.y,r.z),o.push(h,d,v,u),a.push(f[0],f[1],f[2]),l++},tri(n,r,h){s.push(n,r,h)},build(){const n=new R.BufferGeometry;return n.setAttribute("position",new R.Float32BufferAttribute(t,3)),n.setAttribute("aBN",new R.Float32BufferAttribute(e,3)),n.setAttribute("aF",new R.Float32BufferAttribute(o,4)),n.setAttribute("color",new R.Float32BufferAttribute(a,3)),n.setIndex(s),n.computeVertexNormals(),n.computeBoundingSphere(),n}}},we=new b,zo=new b,fa=new b,eo=new b,oo=new b,le=new b,e0=new b,ge=new b,ko=new b,g0=new b,ps=new b(0,0,1),Cn=new b(0,1,0),f0=(t,e)=>{const o=Math.sin(t*12.9898+e*78.233)*43758.5453;return o-Math.floor(o)},ms=(t,e,o=0)=>{const a=t.length,s=[0,0,0,0,0],l=h=>{let d=0;for(;d<a-2&&h>t[d+1][0];)d++;const v=Vt((h-t[d][0])/(t[d+1][0]-t[d][0]),0,1),u=v*v,f=u*v,c=t[Math.max(d-1,0)],p=t[d],m=t[d+1],w=t[Math.min(d+2,a-1)];for(let x=1;x<5;x++)s[x]=Math.max(.5*(2*p[x]+(m[x]-c[x])*v+(2*c[x]-5*p[x]+4*m[x]-w[x])*u+(3*p[x]-3*m[x]+w[x]-c[x])*f),x===1?-99:.03);return s},n=(h,d,v)=>{const u=l(h),f=Math.cos(d),c=Math.sin(d),p=1+(e?e(h,d):0);return v.set(o+Math.sign(f)*Math.pow(Math.abs(f),.9)*u[4]*p,u[1]+Math.sign(c)*Math.pow(Math.abs(c),.9)*(c>0?u[2]:u[3])*p,h)};return{pt:n,frame:(h,d)=>{n(h,d,we),n(h-.06,d,zo),n(h,d+.03,fa);const v=l(h)[1];eo.copy(zo).sub(we),eo.lengthSq()<1e-10&&eo.set(0,0,-1),eo.normalize(),oo.copy(fa).sub(we),oo.lengthSq()<1e-10&&oo.set(1,0,0),oo.normalize(),le.crossVectors(oo,eo),le.lengthSq()<1e-10&&le.set(0,1,0),le.normalize(),le.x*(we.x-o)+le.y*(we.y-v)<0&&le.negate(),oo.crossVectors(eo,le).normalize()},rowAt:l,z0:t[0][0],z1:t[a-1][0]}},ws=(t,e,o,a,s,l,n,r,h,d)=>{const v=[];for(let u=0;u<3;u++)for(const f of[-1,1]){const c=u*.5;ge.copy(e).addScaledVector(o,l*c).addScaledVector(a,n*f).addScaledVector(s,-.05-.16*l*c*c),v.push(t.v(ge,s,f,c,r,1,u===2&&d?d:h))}t.tri(v[0],v[1],v[3]),t.tri(v[0],v[3],v[2]),t.tri(v[2],v[3],v[5]),t.tri(v[2],v[5],v[4])},gs=async(t,e,o)=>{const a=[];for(let n=0;n<=o.NZ;n++){const r=o.zOf(n/o.NZ),h=[];for(let d=0;d<o.NA;d++){const v=d/o.NA*T;e.frame(r,v),h.push(t.v(we,le,Math.sin(v),0,f0(n,d),0,o.coat(r,v,we)))}a.push(h)}for(let n=0;n<o.NZ;n++)for(let r=0;r<o.NA;r++){const h=(r+1)%o.NA;t.tri(a[n][r],a[n][h],a[n+1][h]),t.tri(a[n][r],a[n+1][h],a[n+1][r])}let s=e.z1-.05,l=0;for(;s>e.z0+.1;){const n=Math.max(o.len(s,1.2),o.len(s,0),o.len(s,-1.2),.3),r=e.rowAt(s),h=Math.PI*(.5*(r[2]+r[3])+r[4]),d=Math.max(6,Math.round(h/(n*.36)));for(let v=0;v<d;v++){const u=f0(l*1.37+3.1,v+.7),f=f0(v*2.11+9.3,l+5.1),c=f0(l+.37,v*1.7+2.9),p=(v+l%2*.5+(u-.5)*.6)/d*T,m=s+(f-.5)*n*.3,w=o.len(m,p);if(w<=0)continue;const x=w*(.75+.5*c),k=o.lift(m,p)+(f-.5)*.14;e.frame(m,p),e0.copy(eo).multiplyScalar(Math.cos(k)).addScaledVector(le,Math.sin(k)).addScaledVector(oo,(u-.5)*.5).normalize(),ko.crossVectors(le,e0).normalize(),g0.copy(we).addScaledVector(e0,x*.75),!(o.skip&&o.skip(we,g0,m,p))&&ws(t,we,e0,ko,le,x,x*(.2+.1*u),u,o.coat(m,p,we),o.tip?o.tip(m,p):null)}s-=n*(o.step||.3),l++,(l&3)===3&&await y.yield()}},pi=await(async()=>{const t=Nn(),e=.72,o=-.25,a=.98,s=(c,p)=>{let m=c-p;return m-=Math.round(m/T)*T,m},n=ms([[-11,.7,4.7,4.5,4.6],[-8,.7,4.8,4.5,4.8],[-5.5,.6,4.6,4.3,4.9],[-3.2,.35,4.3,4,5],[-1.4,.1,3.9,3.6,4.5],[-.2,-.15,3.3,3.3,3.7],[1,-.5,2.5,2.8,2.75],[2.3,-.78,1.95,2.25,2.1],[3.8,-.9,1.7,1.9,1.75],[5.2,-.95,1.5,1.6,1.45],[6.1,-.95,1.22,1.3,1.15],[6.6,-.9,.8,.85,.8],[6.9,-.88,.1,.1,.1]],(c,p)=>{let m=0;for(const w of[e,Math.PI-e]){const x=s(p,w)*(w<1.57?1:-1);m-=.07*Math.exp(-(((c-o)/.8)**2)-(x/.2)**2),m+=.075*Math.exp(-(((c+.95)/.9)**2)-((x-.3)/.2)**2)}return m}),r=[e,Math.PI-e].map((c,p)=>{n.frame(o,c);const m=le.clone().multiplyScalar(.8).addScaledVector(ps,.5).addScaledVector(Cn,.12).normalize(),w=we.clone().addScaledVector(le,-.06),x=ps.clone().addScaledVector(m,-m.z).normalize(),k=new b().crossVectors(m,x);return k.y<0&&k.negate(),x.addScaledVector(k,-.3).normalize(),k.crossVectors(m,x),k.y<0&&k.negate(),{c:w,e:m,ex:x,ey:k,sd:p?-1:1}}),h=c=>Math.min(c.distanceTo(r[0].c),c.distanceTo(r[1].c)),d=c=>-.34+.3*z(5.3,6.6,c)-.1*z(3.6,2.5,c),v=(c,p,m)=>{const w=Math.sin(p),x=.5+.5*vt.n3(c*.45,w*2.2,Math.cos(p)*2.2+7);let k=Pt(ca,Ln,x);k=Pt(k,ui,.4*z(.6,.98,w)*z(-7,-2,c)*(1-z(0,1.5,c))),k=Pt(k,Wn,.8*z(.3,.8,w)*z(1,5,c)),k=Pt(k,Wn,.85*Math.exp(-(((w-.36)/.2)**2))*z(0,.9,c)*(1-z(3,4.4,c)));const A=c>2.2?it(0,.12,z(2.2,4.5,c)):c>-1.5?it(-.22,0,z(-1.5,2.2,c)):it(-.5,-.22,z(-7,-1.5,c));return k=Pt(k,ha,1-z(A-.1,A+.14,w+.14*(x-.5))),k=Pt(k,E0,Math.max(z(6.2,6.5,c),m?1-z(.85,1.5,h(m)):0)),k},u=(c,p)=>z(.3,.8,Math.abs(Math.cos(p)))*(1-z(.1,.65,Math.sin(p)))*z(.9,-1.2,c)*(1-z(-6,-9.5,c));await gs(t,n,{NZ:46,NA:30,zOf:c=>n.z0+(n.z1-n.z0)*(1-Math.pow(1-c,1.5)),coat:v,len:(c,p)=>c>6.2?0:(c>2.6?.62:c>0?it(1.2,.62,c/2.6):it(1.2,1.9,z(0,-7,c)))*(1+.2*u(c,p)),lift:(c,p)=>.2+.16*u(c,p)+.14*z(-4,-8,c),skip:(c,p,m,w)=>h(c)<a*1.04||h(p)<a*.98||h(ge.copy(c).lerp(p,.5))<a||m>2.5&&Math.abs(Math.sin(w)-d(m))<.075,tip:(c,p)=>u(c,p)>.5?Rn:null});for(const c of r){const p=[];for(let m=0;m<=5;m++){const w=m/5,x=[];for(let k=0;k<18;k++){const A=k/18*T,L=Math.cos(A)*w,M=Math.sin(A)*w;ge.copy(c.c).addScaledVector(c.ex,L*a).addScaledVector(c.ey,M*a).addScaledVector(c.e,a*(.34*(1-w*w)-.04*w)),x.push(t.v(ge,c.e,L,M,c.sd,3,E0))}p.push(x)}for(let m=0;m<5;m++)for(let w=0;w<18;w++){const x=(w+1)%18;t.tri(p[m][w],p[m][x],p[m+1][x]),t.tri(p[m][w],p[m+1][x],p[m+1][w])}}{const c=new b(0,-.84,6.3),p=[];for(let m=0;m<=10;m++){const w=-Math.PI/2+Math.PI*m/10,x=Math.sin(w),k=Math.max(Math.cos(w),.02),A=[];for(let L=0;L<20;L++){const M=L/20*T,C=Math.cos(M)*k,F=Math.sin(M)*k;ge.set(c.x+C*1.04,c.y+x*.86,c.z+F*.9),A.push(t.v(ge,zo.set(C,x,F),C,x,F,2,E0))}p.push(A)}for(let m=0;m<10;m++)for(let w=0;w<20;w++){const x=(w+1)%20;t.tri(p[m][w],p[m][x],p[m+1][x]),t.tri(p[m][w],p[m+1][x],p[m+1][w])}}for(const c of[-1,1]){n.frame(-3.5,c>0?1.02:Math.PI-1.02);const p=we.clone().addScaledVector(le,-.5),m=new b(c*.36,1,-.5).normalize(),w=new b(c*.5,.2,1);w.addScaledVector(m,-w.dot(m)).normalize();const x=new b().crossVectors(m,w).normalize(),k=4.9,A=w.clone().negate(),L=[],M=[],C=(F,N,V)=>{const G=1.8*Math.pow(1-F,.8)*(.78+.34*Math.sin(Math.PI*Math.min(F*2,1)));return V.copy(p).addScaledVector(m,k*F).addScaledVector(x,G*N).addScaledVector(w,.6*G*N*N-.3*F*F)};for(let F=0;F<=7;F++){const N=F/7*.985,V=[],G=[];for(let P=-3;P<=3;P++){const J=P/3;C(N,J,ge),V.push(t.v(ge,w,J,N,.3,5,Pt(Rn,di,(1-Math.abs(J))*(1-.6*N)))),ge.addScaledVector(w,-.12),G.push(t.v(ge,A,0,0,.6,0,Pt(ca,E0,z(.12,.42,N))))}L.push(V),M.push(G)}for(let F=0;F<7;F++)for(let N=0;N<6;N++)t.tri(L[F][N],L[F][N+1],L[F+1][N+1]),t.tri(L[F][N],L[F+1][N+1],L[F+1][N]),t.tri(M[F][N],M[F+1][N+1],M[F][N+1]),t.tri(M[F][N],M[F+1][N],M[F+1][N+1]);for(let F=0;F<26;F++){const N=F%2?1:-1,V=.04+.8*(F/26),G=f0(F,c+3);C(V,N*.96,we),e0.copy(x).multiplyScalar(-N*.75).addScaledVector(m,.55).addScaledVector(w,.3).normalize(),ko.crossVectors(w,e0).normalize(),ws(t,we,e0,ko,w,1.5*(1-.5*V)*(.8+.4*G),.3,G,ha,null)}for(let F=0;F<9;F++)for(let N=-2;N<=2;N++){const V=.03+.1*F+.03*f0(F,N),G=(N+.5*(F%2)-.25)/2.6,P=f0(F*3.1+N,c+7);Math.abs(G)>.95||(C(V,G,we).addScaledVector(w,-.14),e0.copy(m).multiplyScalar(.92).addScaledVector(w,-.3).normalize(),ko.crossVectors(A,e0).normalize(),ws(t,we,e0,ko,A,.95*(.8+.4*P),.3,P,Pt(ca,E0,z(.12,.42,V)),null))}}const f=(c,p,m,w,x)=>{let k=-1,A=-1;for(let L=0;L<=7;L++){const M=L/7;ge.copy(c).addScaledVector(p,m*M),ge.y-=w*m*M*M,ge.z-=.12*m*M*M,g0.copy(p).multiplyScalar(m),g0.y-=2*w*m*M,g0.z-=.24*m*M,g0.normalize();const C=t.v(ge,g0,-1,M,x,4,ha),F=t.v(ge,g0,1,M,x,4,ha);k>=0&&(t.tri(k,A,F),t.tri(k,F,C)),k=C,A=F}};for(const c of[-1,1])for(let p=0;p<2;p++)for(let m=0;m<(p?2:3);m++){const w=3.95+.7*m+.35*p,x=.03-.2*p,k=c>0?Math.asin(x):Math.PI-Math.asin(x),A=f0(m+p*7,c+11),L=f0(m*3+p,c+23),M=1-m/2.5;n.frame(w,k),e0.copy(le).multiplyScalar(.9).addScaledVector(ps,-.1-.5*M+(L-.5)*.5).addScaledVector(Cn,.2-.45*p+(A-.5)*.5).normalize(),f(we.clone().addScaledVector(le,-.05),e0.clone(),(1.5+1.3*M)*(.8+.4*A),.1+.16*p+.1*L,A)}return t.build()})();await y.yield();const mi=await(async()=>{const t=Nn(),e=ms([[-6,0,1.3,1.3,1.3],[-2,0,1.2,1.2,1.2],[1.2,0,1.02,1.05,1.08],[2.8,-.1,1,1.05,1.5],[4,-.2,.98,1,1.85],[5,-.3,.8,.8,1.6],[5.5,-.35,.25,.25,.8]],null);await gs(t,e,{NZ:22,NA:16,zOf:a=>e.z0+(e.z1-e.z0)*a,coat:(a,s)=>Pt(Pt(ca,Ln,.5+.5*vt.n3(a*.5,Math.sin(s)*2,Math.cos(s)*2)),E0,z(-4.6,-1.6,a+.5*Math.sin(s*3))),len:(a,s)=>.8+.5*z(.2,-.8,Math.sin(s))*z(3,0,a),lift:()=>.26});for(let a=0;a<4;a++){const s=a-1.5,l=-.28*Math.abs(s),n=s*.84,r=ms([[4.7+l,-.3,.42,.42,.4],[5.5+l,-.32,.54,.5,.5],[6.2+l,-.4,.44,.46,.43],[6.65+l,-.5,.1,.1,.1]],null,n);await gs(t,r,{NZ:7,NA:10,zOf:v=>r.z0+(r.z1-r.z0)*v,coat:()=>E0,len:()=>.5,lift:()=>.3});const h=[new b(n,-.5,6.45+l),new b(n,-.72,6.95+l),new b(n,-1.1,7.3+l),new b(n,-1.5,7.42+l)],d=[];for(let v=0;v<4;v++){const u=.2*(1-.3*v),f=[];g0.copy(h[Math.min(v+1,3)]).sub(h[Math.max(v-1,0)]).normalize(),zo.set(1,0,0),fa.crossVectors(g0,zo).normalize();for(let c=0;c<6;c++){const p=c/6*T;le.copy(zo).multiplyScalar(Math.cos(p)).addScaledVector(fa,Math.sin(p)),ge.copy(h[v]).addScaledVector(le,v===3?.02:u),f.push(t.v(ge,le,0,0,0,6,E0))}d.push(f)}for(let v=0;v<3;v++)for(let u=0;u<6;u++){const f=(u+1)%6;t.tri(d[v][u],d[v][f],d[v+1][f]),t.tri(d[v][u],d[v+1][f],d[v+1][u])}}return t.build()})();await y.yield();const Pn={value:1e3},wi=Te($,{vs:gl,fs:xl,uniforms:{uPx:ds,uFoxHoleY:Pn}}),qn=(t,e)=>{const o=new R.Mesh(t,wi);return o.frustumCulled=!1,o.scale.setScalar(e),W.add(o),{mesh:o}},ao=qn(pi,1.2),Go=qn(mi,1);ut("fox-rim");const gi=(()=>{const t=new ze;for(let o=0;o<22;o++){const a=o/22*T+i.range(-.1,.1),s=6.1+i.range(-.7,.9),l=zt.s+Math.cos(a)*s,n=zt.t+Math.sin(a)*s,r=i.range(.5,1.3);t.ball(Kt(l,n,Z(l,n)+rt(l,n)-r*i.range(.1,.7)),r,r*i.range(.6,.9),r*i.range(.8,1.2),8,5,()=>ls,[10,0,0,0])}const e=new R.Mesh(t.build(),Do);return e.frustumCulled=!1,e.matrixAutoUpdate=!1,e.visible=!1,W.add(e),e})(),va=new b,ua=new b;ao.mesh.rotation.order="YXZ",Go.mesh.rotation.order="YXZ",ao.mesh.visible=!1,Go.mesh.visible=!1;const so=Kt(zt.s,zt.t,Ie(zt.s,zt.t)),xs=Kt(zt.s+2.5,zt.t+4.6,Ie(zt.s+2.5,zt.t+4.6)),da=(()=>{Ke(zt.s);const t=-1,e=.55;return Math.atan2(tt.tx*t-tt.tz*e,tt.tz*t+tt.tx*e)})(),xi=(()=>{const t=$t("fox-collar"),e=new ze,o=Math.sin(da),a=Math.cos(da);for(let l=0;l<22;l++){const n=l/22*T+t.range(-.14,.14),r=t.range(.96,1.3),h=t(),d=t(),v=t.range(0,50),u=t.range(.6,1.3),f=t(),c=Math.pow(Math.abs(Math.sin(n)),1.5),p=(.55+.45*h)*(.75+1.95*c),m=it(.05+.3*d,.3+1*d,c);if(f>.45+.55*c)continue;const w=Math.cos(n)*7.6*r,x=Math.sin(n)*5.7*r,k=so.x+o*w+a*x,A=so.z+a*w-o*x,L=so.y-p*m;At.isClear(k,L,A,p*1.3,2.5)&&J0(e,k,L,A,Math.cos(v),Math.sin(v),p,p*(.45+.3*d),p*u,7,10,v,[10,p,v,0],3)}const s=new R.Mesh(e.build(),To);return s.frustumCulled=!1,s.matrixAutoUpdate=!1,s.visible=!1,s.name="fox-collar",W.add(s),s})();Pn.value=so.y;const yi=(()=>{const t=new ze,e=48,o=[0,0,0],a=Math.hypot(1,.55),s=-1/a,l=.55/a,n=[[],[],[],[],[],[]],r=(f,c)=>{const p=Math.cos(c)*9.2*f,m=Math.sin(c)*7.2*f;return[zt.s+s*p+l*m,zt.t+l*p-s*m]},h=(f,c,p,m,w)=>{const[x,k]=r(f,c);return I(x,k),t.v(g.x,Ie(x,k)-.25-p,g.z,o,[m,w,0,0])},d=h(0,0,0,0,0);for(let f=0;f<e;f++){const c=f/e*T,p=1+.16*(f0(f,3.7)-.5);let m=3*z(.3,.8,.5-.5*Math.cos(c))*(.7+.6*f0(f,9.1));for(n[0].push(h(.25,c,0,0,0)),n[1].push(h(.5,c,0,0,0)),n[2].push(h(.75,c,0,.1,0)),n[3].push(h(p,c,0,.25,0));m>0;m-=.4){const[w,x]=r(p*1.12,c);if(I(w,x),At.isClear(g.x,Ie(w,x)-.25-m,g.z,.4,2.5))break}m=Math.max(m,0),n[4].push(h(p*1.05,c,.55*m,.6,.5)),n[5].push(h(p*1.12,c,m+.3,1,1))}for(let f=0;f<e;f++)t.tri(d,n[0][f],n[0][(f+1)%e]);t.loft(n,!0);const v=Te($,{vs:`
attribute vec4 aA; varying vec3 vW; varying vec3 vL; varying vec2 vK;
void main(){ vec4 wp = vec4(position, 1.); vW = position; vK = aA.xy; vL = rfLight(position.xz); ${ae} }`,fs:`
varying vec3 vW; varying vec3 vL; varying vec2 vK;
void main(){
  // vK.x: 0 deep in the mouth, 1 at the lip's lower edge; vK.y: 0 within, 1 at the outer edge, which is torn by a grain
  if (vK.y > 0.3 + 0.75*vn3(vW*0.9 + 4.) - 0.2*vn3(vW*3.1)) discard;
  float f = 0.5 + 0.6*vn3(vW*1.3) + 0.4*vn3(vW*4.1);
  vec3 col = mix(vec3(0.004, 0.007, 0.016)*f, vec3(0.5, 0.62, 0.78)*f*(vL*0.55 + uShadowCol*1.4), 0.85*smoothstep(0.4, 1., vK.x));
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`}),u=new R.Mesh(t.build(),v);return u.frustumCulled=!1,u.matrixAutoUpdate=!1,u.visible=!1,u.name="fox-mouth",W.add(u),u})();await y.yield();const x0=(()=>{const t=new ze,e=et("#2a1f16"),o=et("#5a4630");t.ball(new b(0,0,0),.16,.15,.42,7,5,()=>e,[0,0,0,0]),t.ball(new b(0,.05,.5),.13,.12,.2,6,4,()=>e,[0,0,0,0]),t.ball(new b(0,.02,.74),.1,.1,.1,6,4,()=>bo,[0,0,0,0]);for(let h=0;h<6;h++){const d=h%2?1:-1,v=[.35,.05,-.25][h>>1],u=(h%2+(h>>1))%2*.5+(h>>1)*.12;t.tube([new b(d*.1,0,v),new b(d*.75,.55,v*1.6),new b(d*1.25,-.5,v*2.4+.1)],()=>.035,4,()=>o,f=>[1,f*f,u,0],!1)}const a=t.build();ut("fly");const s=Uo({stride:.5,lift:.25,len:1.6,snout:0,hipZ:0,hipY:0,neckZ:.95,rim:.8,vivid:.5},a,1.3,0),l=52,n=i.sign();let r=n*.5;for(;Math.abs(r)<12&&rt(l,r)>3.4;)r+=n*.2;return I(l,r),s.base=[g.x,Z(l,r)+rt(l,r)-.75,g.z],Ke(l),s.dir=[tt.tx,tt.tz],s.u.uRun.value=1,s})(),no=(t,e,o,a,s)=>{const l=new R.BufferGeometry;for(const h in e)l.setAttribute(h,new R.Float32BufferAttribute(e[h],e[h].length/t));const n=new R.ShaderMaterial({uniforms:{...Ts(),...$,uPx:ds,...a},fog:!0,transparent:!0,depthWrite:!1,blending:s?R.AdditiveBlending:R.NormalBlending,vertexShader:`${Ds}
${Sa}
${Vs}
${o}`,fragmentShader:`${Bs}
${pl(s)}`}),r=new R.Points(l,n);return r.frustumCulled=!1,r.renderOrder=4,W.add(r),r},pa={value:0},Vn={value:new R.Vector4(-1,-1,-1,-1)};ut("sift");const bi=Math.round(3400*lt*(ie==="early"?.6:1)),ys=[],Dn=[],Bn=[];for(let t=0,e=0;t<bi&&e<6e4;e++){(e&511)===511&&await y.yield();let o,a;i()<.25?[o,a]=Z0():(o=i.range(Q+4,K0-10),a=i.gauss()*4);const s=rt(o,a);if(s<2||Math.abs(a)>42)continue;I(o,a);const l=Z(o,a);ys.push(g.x,l+s-.2,g.z),Dn.push(l),Bn.push(i(),i.range(.25,.9),i.range(.07,.16),i()),t++}const Al=no(ys.length/3,{position:ys,aBase:Dn,aR:Bn},`
attribute float aBase; attribute vec4 aR;
uniform float uPx, uSift, uFall; uniform vec3 uSparkCol;
varying vec4 vCol;
void main(){
  float span = max(position.y - aBase, 0.5);
  float f = fract(aR.x*7. + uTime*aR.y*uFall/span);
  vec3 p = vec3(position.x + sin(uTime*0.7 + aR.x*30.)*0.25, position.y - f*span, position.z + cos(uTime*0.6 + aR.x*17.)*0.25);
  vec4 wp = vec4(p, 1.);
  ${ae}
  float dist = -mvPosition.z;
  float tw = 0.3 + 0.7*pow(max(sin(uTime*3. + aR.x*60.), 0.), 6.);
  vec3 Lc = rfLight(p.xz) + dayAt(p)*3.;
  gl_PointSize = min(aR.z*uPx/max(dist, 0.5), uPx*0.03);
  float a = step(aR.w, 0.3 + 0.7*uSift)*smoothstep(1.0, 3.5, dist)*smoothstep(0., 0.08, f)*(1. - smoothstep(0.92, 1., f));
  vCol = vec4((mix(Lc, vec3(dot(Lc, vec3(0.3, 0.5, 0.2))), 0.4)*1.1 + uSparkCol*0.25)*tw*(1. + uSift), a);
}`,{uSift:pa,uFall:{value:ct.wet?7:1},uSparkCol:{value:_t(ct.spark)}},!0);ut("springtails");const Mi=Math.round((ie==="april"?2400:620)*lt),bs=[],Tn=[];for(let t=0,e=0;t<Mi&&e<4e4;e++){const o=i.range(Q+4,Ft-10),a=i.gauss()*2.6;rt(o,a)<1.5||Math.abs(a)>12||(I(o,a),bs.push(g.x,Z(o,a)+.1,g.z),Tn.push(i(),i.range(1.4,4.5),i.range(0,T),i.range(.12,.2)),t++)}no(bs.length/3,{position:bs,aR:Tn},`
attribute vec4 aR;
uniform float uPx;
varying vec4 vCol;
void main(){
  float c = (uTime + aR.x*aR.y*7.)/aR.y, id = floor(c), hop = clamp(fract(c)/0.2, 0., 1.);
  float fwd = mod(id, 2.) < 0.5 ? hop : 1. - hop;
  vec3 p = position + vec3(cos(aR.z)*1.5*fwd, 4.*hop*(1. - hop)*1.2, sin(aR.z)*1.5*fwd);
  vec4 wp = vec4(p, 1.);
  ${ae}
  float dist = -mvPosition.z;
  gl_PointSize = min(aR.w*uPx/max(dist, 0.5), uPx*0.02);
  vCol = vec4(vec3(0.010, 0.014, 0.035) + rfLight(p.xz)*0.03, 0.92*smoothstep(0.8, 2.5, dist)*(1. - smoothstep(60., 90., dist)));
}`,{},!1),await y.yield();{const t=$t("lee-dust"),e=Math.round(260*(.6+.4*lt)),o=[],a=[],s=Kt(Ye.s,Ye.t,Ie(Ye.s,Ye.t)),l=Kt($e.s,$e.t+.2,Z($e.s,$e.t)+.3);for(let n=0;n<e;n++){const r=t.range(0,T),h=Math.sqrt(t());o.push(Math.cos(r)*h,t(),Math.sin(r)*h),a.push(t(),t.range(.35,1),t.range(.05,.12),t())}no(e,{position:o,aR:a},`
attribute vec4 aR;
uniform float uPx; uniform vec3 uLeeTop, uLeeBot;
varying vec4 vCol;
void main(){
  float f = fract(position.y + uTime*aR.y*0.022);                              // 0 at the gap, 1 at the floor
  vec3 ax = mix(uLeeTop, uLeeBot, f); float rr = mix(2.1, 3.4, f);
  vec3 p = ax + vec3(position.x*rr + sin(uTime*0.5 + aR.x*30.)*0.35, 0., position.z*rr + cos(uTime*0.43 + aR.w*23.)*0.35);
  vec4 wp = vec4(p, 1.);
  ${ae}
  // the mote's size is by its depth, as every point cloud's; it thins out near the eye by its distance from where the eye IS
  // (gone at 1.5 m, whole from 4 m), whichever way the eye looks
  float dist = -mvPosition.z, eyeD = length(cameraPosition - p);
  float tw = 0.25 + 0.75*pow(max(sin(uTime*2.1 + aR.x*60. + f*40.), 0.), 4.);
  gl_PointSize = min(aR.z*uPx/max(dist, 0.5), uPx*0.02);
  vCol = vec4(uLeeCol*uLee.w*1.5*tw, smoothstep(1.5, 4., eyeD)*smoothstep(0., 0.06, f)*(1. - smoothstep(0.94, 1., f))*(1. - 0.6*length(position.xz)));
}`,{uLeeTop:{value:s},uLeeBot:{value:l}},!0)}const On=wt.map(([t,e],o)=>{const a=Tt[o];return I(a,e),{u:t,x:g.x,z:g.z,y:Z(a,e)+rt(a,e),f:Z(a,e)}}),Ms=[],Hn=[];ut("curtains");const zi=Math.round(400*(.6+.4*lt));On.forEach((t,e)=>{for(let o=0;o<zi;o++){const a=Tt[e]+i.range(-9,10),s=i.range(-4.2,4.2),l=rt(a,s),n=Z(a,s);I(a,s),Ms.push(g.x,n+Math.max(l,2.5)-.2-i()*i()*3,g.z),Hn.push(i(),e,i.range(.09,.2),i())}}),no(Ms.length/3,{position:Ms,aR:Hn},`
attribute vec4 aR;
uniform float uPx; uniform vec4 uHoofT;
varying vec4 vCol;
void main(){
  float t0 = aR.y < 0.5 ? uHoofT.x : aR.y < 1.5 ? uHoofT.y : aR.y < 2.5 ? uHoofT.z : uHoofT.w;
  float t = t0*1.5 - aR.x*0.85, fall = max(t, 0.);
  vec3 p = position; p.y -= 2.4*fall + 5.5*fall*fall*(0.6 + 0.4*aR.w); p.x += sin(aR.w*40. + fall*3.)*0.3*fall;
  vec4 wp = vec4(p, 1.);
  ${ae}
  float dist = -mvPosition.z;
  gl_PointSize = min(aR.z*uPx/max(dist, 0.5), uPx*0.035);
  float tw = 0.35 + 0.65*pow(max(sin(fall*11. + aR.w*60. + uTime*5.), 0.), 3.);
  vec3 Lc = rfLight(p.xz + vec2(11., 0.));
  vCol = vec4((Lc*0.9 + vec3(0.3, 0.5, 0.55))*tw*2.3, step(0., t)*smoothstep(0.05, 0.5, p.y)*smoothstep(1., 3., dist));
}`,{uHoofT:Vn},!0);const Un={value:0};ut("fox-snow");{const e=[],o=[],a=Ie(zt.s,zt.t);for(let s=0;s<110;s++){const l=i.range(0,T),n=5.4+2.4*i();I(zt.s+Math.cos(l)*n,zt.t+Math.sin(l)*n),e.push(g.x,a,g.z),o.push(i(),i.range(.5,1.1),i()<.25?i.range(.5,.9):i.range(.14,.34),i())}no(110,{position:e,aR:o},`
attribute vec4 aR;
uniform float uPx, uFoxT;
varying vec4 vCol;
void main(){
  float f = fract(uTime*aR.y*0.55 + aR.x);
  vec3 p = position; p.y -= f*f*${a.toFixed(1)}; p.x += sin(aR.w*40. + f*5.)*0.5*f; p.z += cos(aR.w*31. + f*4.)*0.5*f;
  vec4 wp = vec4(p, 1.);
  ${ae}
  float dist = -mvPosition.z;
  gl_PointSize = min(aR.z*uPx/max(dist, 0.5), uPx*0.05);
  vec3 Lc = rfLight(p.xz)*0.5 + dayAt(p)*1.3 + uShadowCol;
  vCol = vec4(Lc*0.8, 0.85*uFoxT*step(aR.w, uFoxT + 0.15)*smoothstep(0., 0.06, f)*(1. - smoothstep(0.9, 1., f))*smoothstep(1.5, 4., dist));
}`,{uFoxT:Un},!1)}const Gn={value:0},ma=t=>Math.abs(t-Math.floor(t)-.5)*4-1;ut("veil");{const t=[],e=[],o=yt.uCrA.value,a=Math.round(900*(.6+.4*lt)),s=Math.round(200*(.6+.4*lt));for(let n=0;n<a;n++){const r=i.gauss()*5,h=ve+1.5+i.gauss()*5,d=r*r+(h-ve)*(h-ve);t.push(r,Ne-.6-4.2*Math.exp(-d/70),h),e.push(i(),i.range(3.5,8),i.range(.1,.24),0)}for(let n=0;n<7;n++)for(let r=0;r<s;r++){const h=o[n],d=i()**.8,v=3+d*(h.y-3),u=h.x*(1-Math.exp(-v/11))+h.w*(Math.sin(v*.19+h.z)+.45*Math.sin(v*.53+h.z*2.7)+.5*ma(v*.115+h.z*1.9)+.2*ma(v*.37+h.z*4.3))+i.gauss()*.25,f=ve+v,c=j+6.24-f,p=rt(c,u),m=i(),w=i.range(3.5,8),x=i.range(.09,.2);p<3||(t.push(u,Math.min(Z(c,u)+p-.15,v<26?Ne-.5:99),f),e.push(m,w,x,1+v/h.y))}const l=(n,r)=>n.x*(1-Math.exp(-r/11))+n.w*(Math.sin(r*.19+n.z)+.45*Math.sin(r*.53+n.z*2.7)+.5*ma(r*.115+n.z*1.9)+.2*ma(r*.37+n.z*4.3));for(let n=0,r=Math.round(500*(.6+.4*lt));n<7;n++)for(let h=0;h<r;h++){const d=o[n],v=3+i()*(d.y-3),u=l(d,v)+i.gauss()*.1,f=ve+v,c=j+6.24-f,p=rt(c,u);p<3||(t.push(u,Math.min(Z(c,u)+p-.15,v<26?Ne-.5:99),f),e.push(i(),i.range(2.5,6),i.range(.06,.13),1+v/d.y))}no(t.length/3,{position:t,aR:e},`
attribute vec4 aR;
uniform float uPx, uVeil, uCrGrow;
varying vec4 vCol;
void main(){
  float span = max(position.y, 1.), f = fract(aR.x*7.3 + uTime*aR.y/span);
  vec3 p = vec3(position.x + sin(uTime*0.9 + aR.x*31.)*0.22, position.y*(1. - f*(0.7 + 0.3*f)), position.z + cos(uTime*0.7 + aR.x*17.)*0.22);
  vec4 wp = vec4(p, 1.);
  ${ae}
  float dist = -mvPosition.z;
  float tw = 0.3 + 0.7*pow(max(sin(uTime*4.1 + aR.x*60.), 0.), 3.);
  gl_PointSize = clamp(aR.z*uPx/max(dist, 0.5), 2.4, uPx*0.03);
  float on = aR.w < 0.5 ? uVeil : uVeil*step(aR.w - 1., uCrGrow);
  vCol = vec4((uDayCol*1.9 + rfLight(p.xz)*0.5)*tw, on*smoothstep(0., 0.05, f)*(1. - smoothstep(0.86, 1., f))*smoothstep(1., 3.5, dist));
}`,{uVeil:Gn},!0)}ut("heel-frost");const Eo=72,En=4,zs=3+Eo+En,ki=new Float32Array(zs*3),Si=new Float32Array(zs*4),Le=new Float32Array(Eo*8);for(let t=0;t<Eo;t++){const e=t*8,o=i()<.22;Le[e]=i()*.16,Le[e+1]=i.range(.2,.46),Le[e+2]=i.gauss()*.34,Le[e+3]=i.range(.5,1.15),Le[e+4]=.12+1.25*i()*i(),Le[e+5]=o?i.range(.2,.32):i.range(.07,.17),Le[e+6]=i.range(.5,1.15),Le[e+7]=i.range(-.5,.5)}const _n=no(zs,{position:ki,aC:Si},`
attribute vec4 aC;
uniform float uPx;
varying vec4 vCol;
void main(){
  vec4 wp = vec4(position, 1.);
  ${ae}
  gl_PointSize = min(aC.x*uPx/max(-mvPosition.z, 0.5), uPx*0.12);
  vec3 Lp = rfLight(position.xz) + dayAt(position);
  vCol = vec4(mix(Lp, vec3(dot(Lp, vec3(0.3, 0.5, 0.2))), 0.65)*aC.z + uShadowCol, aC.y*smoothstep(1.5, 4., -mvPosition.z));
}`,{},!1);await y.yield();const Ai={noon:{preset:"day",zenith:"#2B6FD6",sunElevation:13,sunAzimuth:-100,clouds:!1,clouds2:!1},thaw:{preset:"day",zenith:"#3b7fd8",sunElevation:17,sunAzimuth:-100,clouds:!1},twilight:{preset:"dawn",zenith:"#5a66c0",horizon:"#f0b9a4",sunElevation:1.5,sunAzimuth:-100,clouds:!1,clouds2:!1},night:{preset:"polar",bake:!0,renderer:y.renderer},blizzard:{preset:"overcast"}}[Ot];await y.yield();const N0=Ii({rng:_,...Ai});W.add(N0.object),N0.object.visible=!1,await y.yield();const Fi=N0.fogColor.clone(),Li=(()=>{const t=new R.RingGeometry(27,3400,72,16),e=t.attributes.position;for(let s=0;s<e.count;s++){const l=e.getX(s),n=e.getY(s),r=Math.hypot(l,n),h=27+3373*Math.pow(Math.max(0,(r-27)/3373),2.6),d=h/r,v=l*d,u=n*d,f=z(500,1900,h)*(60+260*Math.max(0,vt.fbm2(v*.0011+5,u*.0011,3)+.25))+.6*vt.n2(v*.05,u*.05)*z(30,80,h);e.setXYZ(s,v,58.05+f,u-27)}t.computeVertexNormals();const o=new R.ShaderMaterial({uniforms:{...Ts(),uSun:{value:Wt.sunDir.clone()},uSunCol:{value:N0.lightColor.clone().multiplyScalar(ct.hour==="night"?.5:1.9)},uAmb:{value:N0.ambientColor.clone().multiplyScalar(ct.hour==="night"?.25:.5)}},fog:!0,side:R.DoubleSide,vertexShader:`varying vec3 vW; varying vec3 vN;
${Ds}
void main(){ vW = position; vN = normal; vec4 wp = vec4(position, 1.); ${ae} }`,fragmentShader:`uniform vec3 uSun, uSunCol, uAmb; varying vec3 vW; varying vec3 vN;
${Bs}
${Sa}
void main(){
  vec3 N = normalize(vN); if (N.y < 0.) N = -N;
  float n = vn2(vec2(vW.x*0.03 + vW.z*0.09, vW.z*0.02)) + 0.5*vn2(vW.xz*0.31);
  N = normalize(N + vec3(n - 0.75, 0., vn2(vW.xz*0.11 + 4.) - 0.5)*0.4);
  vec3 col = vec3(0.70, 0.76, 0.84)*(uAmb + uSunCol*max(dot(N, uSun), 0.));
  gl_FragColor = vec4(col, 1.);
  ${ye}
}`}),a=new R.Mesh(t,o);return a.frustumCulled=!1,a.visible=!1,W.add(a),a})();await y.yield(),await N0.prewarm(y.renderer,null,W),await y.yield();const In=46,So=new b,Wi=new R.Vector2,Ri=new b(0,3,0),Ni=new b,wa=new b,Ci=At.pointAt(1),Kn=Kt(n0.s,n0.t,0),Pi=Kt(Se.s-3,Se.t-5,6.5),Zn=Kt(424,6.5,5),qi=new b,ks=new b,Ss=new b,Yn=new b,o0={d:0,side:0,turn:0,long:1,half:1,soft:1,dark:0,lift:0,tilt:0},As={...o0},Fs=new b,Vi=(t,e)=>(ft.owlShadowAt(e,As)?(I(j+6.24-ve-As.d,As.side),Fs.set(g.x,Ne,g.z)):Fs.copy(Wt.lookAt),Fs),ga=_n.geometry.attributes.position,xa=_n.geometry.attributes.aC;wa.set(to[0].at[0],4,to[0].at[1]);const ya=wa.clone(),_0={x:0,y:0,z:0,hx:0,hz:-1,d:0,v:0},ba=new b,Ls=new b,Di=(t,e)=>(R0.at(e,_0),Ri.set(_0.x,_0.y+2.4,_0.z)),Bi=(t,e)=>{const o=to[0];if(e<=o.u0)return wa.copy(ya);const a=z(0,.2,kn(o,e,ba,Ls));return wa.set(it(ya.x,ba.x+Ls.x*5,a),it(ya.y,ba.y+4.2,a),it(ya.z,ba.z+Ls.z*5,a))},Ti=(t,e)=>(Mo.at(e,_0),Ni.set(_0.x,_0.y+1.2,_0.z)),$n=(Wt.timeline.bulge-Wt.timeline.burst)*Wt.timeline.secondsPerU,Ws=$t("vole-glance"),Oi=Ws.range(58,74),Hi=Ws(),Ui=Ws.range(0,50),Gi=qe.len,Ao={...oe},jn=(t,e,o,a)=>{$.uTime.value=e,o.getWorldPosition(So),ds.value=y.renderer.getDrawingBufferSize(Wi).y*.5*o.projectionMatrix.elements[5],ft.setProgress(a),ft.update(t,e,o);const s=a*ot,l=So.y>Ne+8;for(const S of r0){const U=!l&&S.s1>s-30&&S.s0<s+215,ht=U&&S.s0<s+150;for(const bt of S.objs)bt.visible=U;for(const bt of S.det)bt.visible=ht}Zr.visible=!l&&s>140&&s<390;let n=z(.714,.726,a)*(1-z(.75,.79,a));if(On.forEach((S,U)=>{const ht=z(S.u,S.u+.011,a);$.uHoof.value[U].set(S.x,S.z,ht,ht*(1-.3*z(S.u+.02,S.u+.07,a))),Vn.value.setComponent(U,ht>0?(a-S.u)*In:-1),n=Math.max(n,.6*ht*(1-z(S.u+.03,S.u+.07,a)))}),ft.owlShadowAt(a,o0)){I(j+6.24-ve-o0.d,o0.side);const S=Math.cos(o0.turn),U=Math.sin(o0.turn);$.uShadow.value.set(g.x,g.z,o0.dark,o0.long),$.uShadowN.value.set(tt.tx*S-tt.tz*U,tt.tx*U+tt.tz*S,o0.half,o0.soft),$.uShadowW.value.set(o0.lift,o0.tilt)}else $.uShadow.value.z=0;if(Zt){const S=z(.232,.243,a);$.uWell.value.w=S*(1-.3*z(.25,.3,a)),n=Math.max(n,S*(1-z(.28,.34,a))),W0.visible=a>.23&&a<.266,W0.position.y=O0.y+1.5-6.5*z(.232,.241,a)*(1-z(.247,.264,a))}pa.value=n,Gn.value=z($n*.98,$n*.55,ft.state.t)*(1-z(.05,.95,ft.state.t)),$.uDome.value=Math.min(ft.state.bulge*1.25,1)*(1-ft.state.hole),Ot==="night"&&($.uGreen.value=.35*(.6+.4*Math.sin(e*.45)),$.uAur.value.w=.82*(.8+.2*Math.sin(e*.6+1)));const r=z(Ne-4,Ne+6,So.y);W.fog.color.copy(dt).lerp(Fi,r),W.fog.density=it(ct.fogD,4e-4,r);const h=ft.state.hole>0||So.y>Ne-3;N0.object.visible=h,Li.visible=h,N0.update(t,e,o);let d=!1,v=0,u=0,f=1e4,c=0,p=-1,m=0,w=0,x=0;a<=R0.u1&&(R0.at(a,oe),d=!0,v=oe.x,u=oe.y,f=oe.z,c=oe.hx,p=oe.hz,w=oe.d/qe.stride,m=z(.06,.45,oe.v),x=1-z(R0.u1-.004,R0.u1,a));const k=1-z(.003,.012,a),A=k,L=Math.atan2(c,p)+2*k;t0.mesh.position.set(v,u,f),t0.mesh.rotation.y=L,t0.mesh.scale.setScalar(Math.max(x,.001)),t0.mesh.visible=d,t0.u.uSit.value=k,t0.u.uRun.value=m,t0.u.uRimK.value=it(1.7,qe.rim+.45*m,Math.max(m,1-k)),t0.u.uPhase.value=w*T;let M=R0.u0,C=R0.u1;for(let S=0;S<16;S++){const U=(M+C)/2;R0.at(U,Ao).d<oe.d+Gi?M=U:C=U}R0.at(C,Ao);const F=Math.atan2(Ao.hx*p-Ao.hz*c,Ao.hx*c+Ao.hz*p),N=oe.d/Oi-Hi,V=Math.floor(N),G=Math.sin(V*12.9898+Ui)*43758.5453,P=V+.5+.3*(G-Math.floor(G)-.5),J=z(P-.11,P-.05,N)*(1-z(P+.05,P+.11,N)),pt=m*(1-k)*(F+.1*Math.sin(w*T)+1.15*J*(V&1?-1:1));t0.u.uLook.value=pt,t0.u.uAhead.value.set(c*20,p*20),t0.u.uRimA.value=1.5*m,$.uVole.value.set(v,u+1.5,f,d?m:0),Ge[0].set(v,f,3,d?.72:0);const xt=m>.5?.4:.6,Nt=m>.5?w/3%1:(e*.3+.97)%1,qt=Vt(Nt/xt,0,1),D=k,E=pt*.75,q=it(c,Math.sin(L),A),B=it(p,Math.cos(L),A),K=q*Math.cos(E)+B*Math.sin(E),H=B*Math.cos(E)-q*Math.sin(E),O=Math.abs(pt),Y=v+q*it(5.6,2.6,Math.max(D,O*.75))+K*3.1*O,at=u+it(1.9,5,D)+.5*O,nt=f+B*it(5.6,2.6,Math.max(D,O*.75))+H*3.1*O;for(let S=0;S<3;S++)ga.setXYZ(S,Y+K*qt*1.4-H*(S-1)*.5*qt,at+qt*(.8+.5*S),nt+H*qt*1.4+K*(S-1)*.5*qt),xa.setXYZW(S,.5+1.5*qt+.5*O,d&&Nt<xt?it(.3,.46,Math.max(A,O))*(1-qt)*z(0,.15,qt):0,.8+.5*O,0);for(let S=0;S<Eo;S++){const U=S*8,ht=S&1,bt=Le[U+1],Dt=((w-(ht?0:.5)-Le[U])%1+1)%1,Ct=Math.min(Dt/bt,1),Ve=Vt(Le[U+2],-.62,.62),De=Le[U+3]*Dt*qe.stride,We=(ht?1.5:-1.5)+Le[U+7]*.7+Math.sin(Ve)*(.25+De*.75),v0=-5.1-De*Math.cos(Ve),Mt=.12+Le[U+4]*4*Ct*(1-Ct)*(1-.35*Ct);ga.setXYZ(S+3,v+p*We+c*v0,u+Mt,f-c*We+p*v0),xa.setXYZW(S+3,Le[U+5]*(1.35+.6*Ct),d&&Ct<1?.9*(1-Ct)*Math.sqrt(1-Ct)*z(0,.1,Ct)*m:0,2.3*Le[U+6],0)}ga.needsUpdate=!0,xa.needsUpdate=!0,Sn.forEach((S,U)=>{let ht=S.home[0],bt=S.home[1],Dt=!0;if(a<S.ub){const Ct=Math.cos(S.yaw),Ve=Math.sin(S.yaw);ia(S,ht,S.home[2],bt,S.dir[0]*Ct-S.dir[1]*Ve,S.dir[0]*Ve+S.dir[1]*Ct),S.u.uSit.value=(.5+.5*Math.sin(e*.5+U*2.1))*(1-z(S.ub-.004,S.ub,a)),S.u.uRun.value=0}else{const Ct=(a-S.ub)*ot*1.35;ni(S,S.R,Ct),ht=ne.x,bt=ne.z,Dt=Ct<S.R.len-2,S.u.uSit.value=0,S.u.uRun.value=1,S.u.uPhase.value=Ct/(qe.stride*S.scale)*T}S.mesh.visible=Dt,U<5&&Ge[3+U].set(ht,bt,3.2*S.scale,Dt?.55:0)});let st=!1;for(const S of to)if(a>S.u0&&a<S.u1){const U=kn(S,a,ne,H0),ht=U*S.R.len;ia(U0,ne.x,ne.y,ne.z,H0.x,H0.z),U0.u.uPhase.value=ht/(fs.stride*us)*T,U0.u.uArch.value=S.arch,U0.u.uRun.value=1,U0.mesh.scale.setScalar(us*z(0,.05,U)*(1-z(.95,1,U))+.001),st=!0;const bt=U0.mesh.scale.x,Dt=H0.x*7.2*bt,Ct=H0.z*7.2*bt;Ge[1].set(ne.x-Dt,ne.z-Ct,4.4*bt,.62),Ge[8].set(ne.x+Dt*.75,ne.z+Ct*.75,4.2*bt,.62),Ge[9].set(ne.x-Dt*.1,ne.z-Ct*.1,5.5*bt,.3)}U0.mesh.visible=st,st||(Ge[1].w=0,Ge[8].w=0,Ge[9].w=0);{const S=a>Mo.u0&&a<Mo.u1;if(G0.mesh.visible=S,S){Mo.at(a,oe);const U=z(.06,.4,oe.v);let ht=Math.atan2(oe.hx,oe.hz),bt=Math.atan2(Fn[0]-oe.x,Fn[1]-oe.z)-ht;bt-=Math.round(bt/T)*T,ht+=bt*(1-U)*(1-z(.44,.449,a)),G0.mesh.position.set(oe.x,oe.y,oe.z),G0.mesh.rotation.y=ht,G0.mesh.scale.setScalar(1.3*(1-z(Mo.u1-.004,Mo.u1,a))+.001),G0.u.uPhase.value=oe.d/(vs.stride*1.3)*T,G0.u.uRun.value=U,Ge[2].set(oe.x,oe.z,2.4,.5)}else Ge[2].w=0}{const S=z(.292,.304,a),U=z(.306,.322,a)*(1-z(.343,.357,a)),ht=z(.316,.328,a)*(1-z(.34,.352,a));$.uPool1.value.w=S,$r.material.uniforms.uOpen.value=S,Un.value=S*(1-.6*z(.38,.42,a)),pa.value=Math.max(pa.value,.8*S*(1-z(.38,.42,a)));const bt=.82+.07*Math.sin(e*2.3),Dt=da+.12*Math.sin(e*1.1),Ct=-11+19.8*U+.5*Math.sin(e*4.1)*U,Ve=Math.cos(bt);ao.mesh.rotation.set(bt,Dt,0),ao.mesh.position.set(so.x+Math.sin(Dt)*Ve*Ct,so.y-Math.sin(bt)*Ct,so.z+Math.cos(Dt)*Ve*Ct),ao.mesh.visible=U>.002,gi.visible=xi.visible=yi.visible=S>.3&&s>150&&s<330,ao.mesh.updateMatrixWorld(),va.set(0,-.8,7.3).applyMatrix4(ao.mesh.matrixWorld),ua.set(Math.sin(Dt)*Ve,-Math.sin(bt),Math.cos(Dt)*Ve);for(let ce=0;ce<En;ce++){const xe=(e*.85+ce*.11)%1,Ut=Math.min(xe/.7,1),Be=3+Eo+ce,y0=(ce%2?1:-1)*(.45+.9*Ut);ga.setXYZ(Be,va.x+ua.x*(.5+3.4*Ut)+Math.cos(Dt)*y0,va.y+ua.y*(.5+2*Ut)+1.6*Ut*Ut,va.z+ua.z*(.5+3.4*Ut)-Math.sin(Dt)*y0),xa.setXYZW(Be,1.3+3.2*Ut,U>.6&&xe<.7?.34*(1-Ut)*z(0,.12,Ut):0,1,0)}const De=1.2+.28*Math.sin(e*5.3),We=da-.3,v0=-9+11.5*ht+.9*Math.sin(e*5.3+1)*ht,Mt=Math.cos(De);Go.mesh.rotation.set(De,We,0),Go.mesh.position.set(xs.x+Math.sin(We)*Mt*v0,xs.y-Math.sin(De)*v0,xs.z+Math.cos(We)*Mt*v0),Go.mesh.visible=ht>.002}{const S=z(.6,.65,a),U=Math.sin(e*1.3);Fe.scale.set(Vo*(1+.006*U),Vo*(1+.012*U),Vo);let ht=Math.atan2(So.x-Fe.position.x,So.z-Fe.position.z)-Fe.rotation.y;ht-=Math.round(ht/T)*T,Oo.rotation.set(.5*(1-S)+.04*Math.sin(e*.9),Vt(ht*.7,-.5,.5)*S+.08*Math.sin(e*.6),0),Oo.position.y=10.2-2*(1-S),a>.45&&(Ge[3].set(Fe.position.x,Fe.position.z,9.5,.6),Ge[4].set(Kn.x,Kn.z,15,.5))}{const S=Math.sin(e*.13)*1.4;ia(x0,x0.base[0]+x0.dir[0]*S,x0.base[1],x0.base[2]+x0.dir[1]*S,x0.dir[0]*Math.cos(e*.13),x0.dir[1]*Math.cos(e*.13)+1e-4),x0.u.uPhase.value=e*1.7,x0.mesh.visible=s<140}};{const t=new R.PerspectiveCamera(62,1.7777777777777777,.2,6e3);At.pointAt(0,t.position),t.updateMatrixWorld(!0),jn(0,0,t,0)}return{scene:W,path:At,duration:In,title:ct.title,pace:t=>1-.18*z(.19,.23,t)*(1-z(.335,.37,t))-.12*z(.64,.68,t)*(1-z(.73,.76,t))-.4*z(.765,.805,t)*(1-z(.882,.9,t)),camera:{fov:62,near:.2,far:6e3,lookAhead:22,sway:.6,bank:1},pois:[{at:Di,from:0,to:.05,weight:.3},{at:Kt(102,10.5,4),from:.07,to:.15,weight:.5},{at:Bi,from:to[0].u0,to:to[0].u1,weight:.7},{at:Kt(zt.s-5,zt.t+1,9),from:.275,to:.372,weight:.6},{at:Ti,from:.385,to:.465,weight:.3},{at:(t,e)=>(At.posAtDist(Math.min(e*ot+48,ot-1),ks),ks.y+=1,ks.lerp(qi.set(Zn.x,it(5,17,z(.48,.545,e)),Zn.z),1-z(.553,.577,e))),from:.465,to:.6,weight:.5},{at:(t,e)=>(At.posAtDist(Math.min(e*ot+48,ot-1),Ss),Ss.y+=1,Ss.lerp(Pi,1-z(.7,.722,e))),from:.64,to:.745,weight:.62},{at:Wt.lookAt.clone(),from:.735,to:.905,weight:.75},{at:Vi,from:.748,to:.792,weight:.6},{at:(t,e)=>ft.owlAt(e,Yn)?Yn:Ci,from:.9,to:.975,weight:.3}],portal:{shape:"circle",radius:7,tilt:!0,color:ct.hour==="twilight"?"#ffd9c6":ct.hour==="night"?"#bfe9d6":"#cfe6ff",glow:1,revealDistance:220},post:{exposure:ct.exposure,bloom:{strength:.2,radius:.6,threshold:1},grade:{saturation:1.08,contrast:1.05,tint:"#ffffff",shadowTint:"#0a1638",vignette:.36,grain:.02,aberration:0}},ride:"none",update:jn,dispose(){N0.dispose?.(),ft.dispose?.()}}}};export{Rl as default};
