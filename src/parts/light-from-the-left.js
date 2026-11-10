import*as F from"three";const ae=["#E9E6D8","#E6CE58","#2B4A8C","#8D9AA3","#A3352B","#86A5CC","#1C1A1A"],ne={slate:"#5B6570",tile:"#B5472E",ochre:"#B98A3E",sand:"#C8A982",green:"#4C6A72",umber:"#5A4632",cream:"#E4E2D2"},oe=n=>{const e=parseInt(n.slice(1),16);return new F.Vector3((e>>16&255)/255,(e>>8&255)/255,(e&255)/255)},G=n=>{const e=oe(n);return[e.x,e.y,e.z]},ye=()=>({uRoomFromWorld:{value:new F.Matrix4},uEye:{value:new F.Vector3(0,3.3,-20)},uCloud:{value:0},uStrip:{value:new F.Vector4(.86,.97,.55,0)},uToneK:{value:.6},uFlat:{value:0},uTime:{value:0},uLive:{value:0},uBank:{value:new F.Vector4(300,112,0,0)},uPhase:{value:new F.Vector4(0,0,0,0)},uPool:{value:new F.Vector2(.22,1)},uCloth:{value:0},uPx:{value:1/900},uPxLo:{value:1/900},uWhite:{value:oe(ae[0])},uShade:{value:oe(ae[3])},uLemon:{value:oe(ae[1])},uUltra:{value:oe(ae[2])},uRed:{value:oe(ae[4])},uSky:{value:oe(ae[5])},uBlack:{value:oe(ae[6])},uLeafA:{value:new F.Vector4(1,0,0,0)},uOccMin:{value:[new F.Vector3(3,0,15),new F.Vector3(-4.1,0,8.9),new F.Vector3(-9,0,1)]},uOccMax:{value:[new F.Vector3(7.5,2.3,27),new F.Vector3(-1.9,3.4,11.1),new F.Vector3(-4,10.5,6)]}}),pe=(()=>{const n=e=>new F.Matrix3().fromArray(e).invert().elements.map(a=>a.toFixed(6)).join(",");return{inI:n([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]),outI:n([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602])}})(),ie=`
uniform mat4 uRoomFromWorld;
uniform vec3 uEye, uWhite, uShade, uLemon, uUltra, uRed, uSky, uBlack;
uniform vec4 uStrip, uLeafA;
uniform float uCloud, uToneK, uTime, uPx, uPxLo, uFlat, uCloth, uLive;
uniform vec4 uBank, uPhase; uniform vec2 uPool;
uniform vec3 uOccMin[3], uOccMax[3];

// display colour (sRGB 0..1, what the picker will read) -> scene-linear value for the engine's ACES + sRGB
vec3 toScene(vec3 D){
  vec3 d = clamp(D, 0., 1.);
  vec3 lin = mix(d/12.92, pow((d + 0.055)/1.055, vec3(2.4)), step(0.04045, d));
  if (uFlat > 0.5) return lin;
  vec3 y = clamp(mat3(${pe.outI})*clamp(lin, 0., 0.95), 0.0004, 0.97);
  vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, Cc = 0.238081*y + 0.000090537;
  vec3 v = (-B - sqrt(max(B*B - 4.*A*Cc, 0.)))/(2.*A);
  return max(mat3(${pe.inI})*v, 0.)*uToneK;
}
float vhash(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(vhash(i), vhash(i + vec2(1., 0.)), f.x), mix(vhash(i + vec2(0., 1.)), vhash(i + vec2(1., 1.)), f.x), f.y); }

// THE CLOUD FIELD: one smooth periodic function of place (room z) sliding with uCloud. x = the sun strip
// outdoors (0 shade .. 1 struck), y = the indoor window light (uStrip.z .. 1). A gap stands at z 96 when uCloud = 570.
// THE POOLS' RULE, the same in every weather: each of the pools' two waves stands at the three windows a fixed share of
// its own period apart, the share the windows' own places (z 7.5, 29, 49) are of the wave's period where it is not
// slowed: 21.5/64 and 41.5/64 of the first wave's period (about a third and two thirds, so one pool is always up),
// 21.5/106.6667 and 41.5/106.6667 of the second's. A slowed weather stretches a wave about each window's own place and
// not about one point of the room, so the pools keep their turns; where a wave is not slowed the added phase is exactly
// nothing and the field is the plain function of place. The start is the field's own (its anchor 474 and its two waves).
float poolPlace(float z){ return 7.5 + 21.5*smoothstep(14., 22., z) + 20.*smoothstep(36., 43., z); }   // the window a place belongs to; it steps in the bare piers
vec2 cloudField(float z){
  float q = z - uCloud + 474.;
  float c = 0.5 + 0.5*cos(6.2831853*q/320.);
  float pb = mix(106.6667, 320., step(1.5, uPool.y)), w = 6.2831853*poolPlace(z);
  float a = 0.5 + 0.5*cos(6.2831853*q/(64.*uPool.y) + 4.67 + w*(uPool.y - 1.)/(64.*uPool.y)), b = 0.5 + 0.5*cos(6.2831853*q/pb + 4. + w*(pb - 106.6667)/(106.6667*pb));
  float f = smoothstep(0.2, 0.62, a + 0.18*(b - 0.5));
  return vec2(smoothstep(uStrip.x, uStrip.y, c), mix(uStrip.z, 1., f));
}
// a window's pool under the field: the room's wash only sinks to uStrip.z, the pool itself nearly goes out, so its
// soft edge is seen travelling along wall and floor
float poolField(float z){ return mix(uPool.x, 1., clamp((cloudField(z).y - uStrip.z)/max(1. - uStrip.z, 0.05), 0., 1.)); }
float occBox(vec3 p, vec3 d, vec3 mn, vec3 mx){
  vec3 inv = 1./d;                                        // d has no zero component by construction (see roomPool)
  vec3 t0 = (mn - p)*inv, t1 = (mx - p)*inv;
  vec3 a = min(t0, t1), b = max(t0, t1);
  float tn = max(max(a.x, a.y), max(a.z, 0.06)), tf = min(b.x, min(b.y, b.z));
  return 1. - smoothstep(0., 0.5 + 0.12*tn, tf - tn);
}
float winRect(vec2 h, float z0, float z1, float soft){
  return smoothstep(z0 - soft, z0 + soft, h.x)*(1. - smoothstep(z1 - soft, z1 + soft, h.x))
       * smoothstep(2. - soft, 2. + soft, h.y)*(1. - smoothstep(10. - soft, 10. + soft, h.y));
}
// the soft pools each window lays. His light is a wash from the north sky, not a beam, so a window is imaged twice:
// down a 35 degree slant (17 m of floor, the table) and along a low 9 degree slant (the pool on the wall that faces
// the windows: at three times life the steep ray alone never reaches that wall). Each ray is tested against the
// three window rectangles in the plane x = 9 with soft edges (0.3 m plus 4 percent of distance) and the three box
// occluders; the cloud is read where the ray meets the glass, so a pool fills from one side and the light travels.
float winAll(vec3 p, vec3 d, out float t){
  t = max(9. - p.x, 0.)/d.x;
  vec2 h = vec2(p.z + d.z*t, p.y + d.y*t);
  float soft = 0.3 + 0.075*t;
  return (winRect(h, 3., 12., soft) + winRect(h, 24., 34., soft) + winRect(h, 45., 53., soft))*poolField(h.x);
}
float occAll(vec3 p, vec3 d){ return occBox(p, d, uOccMin[0], uOccMax[0])*occBox(p, d, uOccMin[1], uOccMax[1])*occBox(p, d, uOccMin[2], uOccMax[2]); }
// wrapK 0: a wall or floor takes the pool by its facing; 1: a round thing in the pool is lit most of the way round
float roomPoolN(vec3 p, vec3 n, float wrapK){
  vec3 dS = vec3(0.7094, 0.5736, 0.4096), dL = vec3(0.9877, 0.1564, 0.0001);
  float tS, tL;
  float s = winAll(p, dS, tS)*occAll(p, dS), l = winAll(p, dL, tL)*occAll(p, dL);
  float lo = mix(-0.2, -0.95, wrapK), hi = mix(0.55, 0.25, wrapK);
  s *= smoothstep(lo, hi, dot(n, dS)); l *= smoothstep(lo, hi, dot(n, dL))*mix(1., 0.45, smoothstep(0.3, 0.9, n.y));
  // and the far window's light slanting onto the closed back wall, across the map
  vec3 dB = vec3(0.8, 0.2, -0.566); float tB;
  float b = winAll(p, dB, tB)*occAll(p, dB)*smoothstep(lo, hi, dot(n, dB))*smoothstep(0.2, 0.7, -n.z + 0.6*wrapK)*smoothstep(40., 46., p.z);
  return clamp(max(max(s, l), b), 0., 1.)*step(p.x, 8.99);
}
float roomPool(vec3 p){ return roomPoolN(p, vec3(0.6, 0.8, 0.), 0.); }
// the wall grade: sky light spreading from the three windows, falling without a step with distance from the
// nearest jamb (faster along the room than across it, so the wall facing a window is lighter than the wall between
// two); surfaces turned to the window take more, the window wall itself (normal -x) almost none; the corner where
// the facing wall meets the closed wall, and the wall under the ceiling, sink to the shade.
float gGrade0;
float roomGrade(vec3 p, vec3 n){
  vec3 w1 = vec3(9., 6., clamp(p.z, 3., 12.)) - p, w2 = vec3(9., 6., clamp(p.z, 24., 34.)) - p, w3 = vec3(9., 6., clamp(p.z, 45., 53.)) - p;
  float d1 = length(w1), d2 = length(w2), d3 = length(w3);
  vec3 an = vec3(0.25, 1.0, 1.6);
  float f1 = cloudField(clamp(p.z, 3., 12.)).y/(1. + dot(w1*w1, an)*0.004), f2 = cloudField(clamp(p.z, 24., 34.)).y/(1. + dot(w2*w2, an)*0.004), f3 = cloudField(clamp(p.z, 45., 53.)).y/(1. + dot(w3*w3, an)*0.004);
  float g = max(f1, max(f2, f3))*0.8 + (f1 + f2 + f3)*0.1;
  vec3 dir = (w1*f1/max(d1, 0.01) + w2*f2/max(d2, 0.01) + w3*f3/max(d3, 0.01))/max(f1 + f2 + f3, 0.01);
  dir = dir + vec3(0.4, 0.22, 0.); dir /= max(length(dir), 1e-3);
  float face = 0.5 + 0.5*dot(n, dir);
  float corner = mix(0.03, 1., smoothstep(0., 6.5, max(p.x + 9., 0.) + max(54. - p.z, 0.)))*mix(0.34, 1., smoothstep(0., 3.4, 11. - p.y + 1.6*smoothstep(-0.5, -0.9, n.y)));
  gGrade0 = g*corner;
  float jz = min(max(abs(p.z - 7.5) - 4.5, 0.), min(max(abs(p.z - 29.) - 5., 0.), max(abs(p.z - 49.) - 4., 0.)));
  float jy = max(max(2. - p.y, p.y - 10.), 0.);
  float bounce = 0.2*smoothstep(-0.2, -0.9, n.x)*smoothstep(0.3, 6.5, jz + 0.8*jy)*(0.55 + 0.45*cloudField(p.z).y)*mix(0.5, 1., smoothstep(0.2, 5., 11. - p.y))*mix(1.75, 0.8, smoothstep(0.4, 8., p.y));   // the window wall takes the floor's light: palest at the skirting
  // the window wall is dark against its glass, but each reveal throws its light back on the plaster beside the jamb
  // (and under the sill, over the head): brightest at the arris, gone into shade two metres along the pier
  float zn = clamp(p.z, 7.5 - 4.5, 7.5 + 4.5); if (abs(p.z - 29.) - 5. < abs(p.z - zn)) zn = clamp(p.z, 24., 34.); if (abs(p.z - 49.) - 4. < abs(p.z - zn)) zn = clamp(p.z, 45., 53.);
  float jamb = smoothstep(-0.2, -0.9, n.x)*exp(-jz*1.05 - jy*1.2)*poolField(zn)*0.5;
  float inner = clamp(g*corner*mix(0.05, 1.1, smoothstep(0.1, 0.6, face))*mix(1., 0.3, smoothstep(-0.3, -0.9, n.x)) + bounce + jamb, 0., 1.);
  // inside the opening itself (reveals, sill, frame) the sky lies on everything turned to it
  return mix(inner, cloudField(p.z).y*mix(0.55, 1., smoothstep(-0.9, 0.3, n.x + 0.6*n.y)), smoothstep(9.02, 9.3, p.x));
}
// obj 0 = the room's own surfaces; 1 = a thing standing in the room: the pool wraps it and the white walls give it back some light
float roomLightK(vec3 p, vec3 n, float obj){
  vec3 ng = n + obj*vec3(0.38, 0.12, 0.); ng /= max(length(ng), 1e-3);            // a thing in the room is lit a little way round: white jug, blue-grey shade side
  float g = roomGrade(p, ng);
  float fill = obj*0.34*gGrade0*(0.7 + 0.3*n.y);
  float pool = roomPoolN(p, n, obj);
  float wash = 0.76*(1. - exp(-2.4*g))*mix(1.0, 0.8, n.y*n.y*step(0., n.y));          // the white wall is the room's sky: light almost everywhere, shade only where the grade sinks
  return clamp(wash + fill*0.5 + pool*(0.58 + 0.3*g), 0., 1.);
}
float roomLight(vec3 p, vec3 n){ return roomLightK(p, n, 0.); }
// how far a pigment is one of the WHITE things (plaster, whitewash, cap, jug, stone): 1 for them, 0 for every coloured thing
float whiteness(vec3 alb){
  float mx = max(alb.r, max(alb.g, alb.b)), mn = min(alb.r, min(alb.g, alb.b));
  return smoothstep(0.42, 0.62, mn)*(1. - smoothstep(0.16, 0.34, (mx - mn)/max(mx, 0.05)));
}
// light 0..1 -> the painted colour: full light shows the pigment. Shade: a WHITE thing is broken with ultramarine and
// black and lands exactly on uShade; a COLOURED thing keeps its pigment and only sinks in value, with a trace of
// ultramarine in it (carpet a deep red, velvet a deep blue, oak a dark umber); never pale grey, never black or brown.
vec3 paint(vec3 alb, float light){
  vec3 k = uShade/max(uWhite, vec3(0.01));
  vec3 shW = alb*k*0.92 + 0.045*uUltra*(1. - alb);
  shW = mix(shW, vec3(dot(shW, vec3(0.3, 0.5, 0.2)))*vec3(0.93, 1., 1.1), 0.12);
  vec3 shC = alb*vec3(0.54, 0.57, 0.64) + 0.04*uUltra*(1. - alb);
  return mix(mix(shC, shW, whiteness(alb)), alb, light);
}
// the bare wall's tone at a point: what contours melt into
vec3 wallTone(vec3 p){ return paint(uWhite, roomGrade(vec3(clamp(p.x, -8.9, 8.9), p.y, p.z), vec3(-0.6, 0., -0.8))); }
// soft contour: mix toward the local wall tone as the normal turns from the eye; the rim widens as the eye nears
vec3 melt(vec3 col, vec3 p, vec3 n, float amount){
  vec3 v = uEye - p; float dist = length(v); v /= max(dist, 1e-3);
  float rim = 1. - abs(dot(n, v));
  float wide = mix(0.78, 0.3, smoothstep(2.5, 40., dist));
  return mix(col, wallTone(p), amount*smoothstep(1. - wide, 1.02, rim)*0.9);
}
// OUTDOORS: the near band in the slate cloud's shade, one strip of the far roofs and the tower struck.
// The slate bank's shadow ends on a slanted plane behind the first row of fronts (the sun is low behind us): every
// wall, gate and roof this side of it stands in shade, the roofs behind and the tower are struck where the field's
// gap lies on them. The bank's edge is not straight: under every second gap of the field it draws back over the
// bridge (arch at 150, 96, its own axes zb into the town and xb to port), and while that gap lies there the gates'
// ridges and spire tips and the yellow wall behind them (zb 15), from its foot, are struck with the roofs.
const float SHADE_X0 = 171., SHADE_X1 = 184.;   // room x: between these two lines the slate bank's shadow ends on the ground
float townSun(vec3 p){
  vec2 q = p.xz - vec2(150., 96.);
  float zb = q.x*0.8988 + q.y*0.4384, xb = q.x*0.4384 - q.y*0.8988;
  float a = p.z - 0.95*max(p.x - 163.5, 0.);
  float far = smoothstep(SHADE_X0, SHADE_X1, p.x + 0.3*max(p.y, 0.));
  float gate = smoothstep(11.5, 15., zb + 1.6*max(p.y - 9., 0.))*(1. - smoothstep(36., 52., abs(xb)));
  float land = smoothstep(0.78, 0.96, 0.5 + 0.5*cos(6.2831853*(a - uCloud + 474.)/640.));
  return cloudField(a).x*max(far, gate*land);
}
vec3 paintOut(vec3 alb, float sun, float up){
  float warm = clamp((alb.g - alb.b)*2.5 - 0.5, 0., 1.);                       // the lemon of the yellow wall
  float tile = clamp((alb.r - alb.g)*3. - 0.3, 0., 1.)*(1. - warm);
  // shade under the bank: a coloured thing keeps its pigment and sinks in value with a trace of ultramarine (brick a
  // deep red, tile a dark red, the limes a dark blue-green, the yellow wall a dark ochre); only the white things
  // (whitewash, stone) go to the blue-grey shade tone
  vec3 shC = mix(alb, vec3(0.725, 0.54, 0.24)*1.06, min(1., 1.5*warm))*mix(0.6, 0.72, up)*mix(vec3(0.97, 0.99, 1.07), vec3(1.04, 0.98, 0.94), warm) + 0.035*uUltra*(1. - alb)*(1. - warm);
  vec3 shW = alb*(uShade/max(uWhite, vec3(0.01)))*mix(0.9, 1.04, up);
  vec3 sh = mix(shC, shW, whiteness(alb));
  // struck: the strip is lemon-cream light lying ON the thing. Whitewash and stone go to warm white, tile to lemon
  // broken with white (never orange), slate to a pale cream-grey, the limes to a pale lemon-green, what is yellow
  // lands on the lemon; each keeps a little of its own colour, stains and modelling, and what is dark stays dark.
  vec3 lem = mix(uLemon, vec3(0.725, 0.54, 0.24), uStrip.w);
  float la = dot(alb, vec3(0.3, 0.5, 0.2));
  float pale = smoothstep(0.45, 0.7, min(alb.r, min(alb.g, alb.b)));
  vec3 lc = mix(lem, uWhite, mix(mix(0.62, 0.34, tile), 0.86, pale)*(1. - warm));
  float keep = mix(0.8, mix(0.3, 0.16, tile), smoothstep(0.14, 0.36, la))*(1. - warm);
  vec3 lit = mix(lc*(0.8 + 0.42*la), min(alb*vec3(1.2, 1.17, 1.08) + 0.03, vec3(1.)), keep);
  lit = mix(lit, lem*clamp(0.5 + 0.5*la/max(dot(uLemon, vec3(0.3, 0.5, 0.2)), 0.05), 0.6, 1.03), min(1., 1.6*warm));
  lit = mix(lit, lit*vec3(1.04, 0.97, 0.8), 0.5*uStrip.w);
  lit *= 1. + 0.06*uBank.z;                                                    // after rain the strip is narrower and brighter
  return mix(sh, min(lit, vec3(1.)), sun);
}
`,re={object:0,plaster:1,floor:2,carpet:3,tiles:4,wood:5,pane:6,leaf:7,brick:8,roof:9,water:10,sand:11,hull:12,wash:13,ceil:14,tree:15,far:17},de=`
uniform mat4 uRoomFromWorld; uniform float uTime; uniform vec4 uPhase;
attribute vec4 aCol; attribute float aKind;
varying vec3 vP, vN; varying vec4 vC; varying vec2 vUv; varying float vKind;
void main(){
  vec4 lp = vec4(position, 1.); vec3 ln = normal;
  #ifdef USE_INSTANCING
    lp = instanceMatrix*lp; ln = mat3(instanceMatrix)*ln;
  #endif
  #ifdef CROWN
    lp.xyz += ln/max(length(ln), 1e-4)*(1.25 + 0.3*sin((uTime + uPhase.w)*0.5 + position.x*0.37 + position.z*0.29 + position.y*0.2));
  #endif
  vec4 w = modelMatrix*lp;
  vP = (uRoomFromWorld*w).xyz; vN = mat3(uRoomFromWorld)*(mat3(modelMatrix)*ln);
  // the double is one piece from the waterline down, drawn out toward us by 14 in a hundred (the share the sky's own double
  // is drawn out by, in the water and on the dome, so town and sky stay one picture), and it sways slowly as a whole: a
  // drift across the course that grows evenly with the depth under the waterline (2 cm a metre at most) and is the same
  // for neighbouring places (two slow waves 300 and 185 m long across the course), so every edge stays one straight piece
  if (vP.y < -11.02) { float dp = -11. - vP.y; float tw = uTime + uPhase.x, wc = vP.x*0.4384 - vP.z*0.8988; w.xz += vec2(0.4384, -0.8988)*(0.02*dp*(0.6*sin(tw*0.5 + wc*0.021) + 0.4*sin(tw*0.31 - wc*0.034 + 1.7))); w.y -= 0.14*dp; }
  vC = aCol; vUv = uv; vKind = aKind;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,ge=`
${ie}
varying vec3 vP, vN; varying vec4 vC; varying vec2 vUv; varying float vKind;
float chequer(vec2 xz, float soft){
  vec2 c = vec2(xz.x + xz.y, xz.x - xz.y)*(0.70711/1.5);
  c += 0.035*sin(c.yx*0.83 + vec2(0.4, 2.1));                       // the hand: not quite square
  vec2 fw = max(fwidth(c), vec2(soft));                               // a joint is never a ruled line: blended over 4 cm far off, 14 cm under the eye
  vec2 i = 2.*(abs(fract((c - 0.5*fw)*0.5) - 0.5) - abs(fract((c + 0.5*fw)*0.5) - 0.5))/fw;
  return 0.5 - 0.5*i.x*i.y;
}
#define CS(e, x) smoothstep((e) - sw, (e) + sw, (x))
vec3 carpetAt(vec2 uv, out float knot){
  float fwk = sqrt(max(length(dFdx(uv))*length(dFdy(uv)), 1e-10));     // the footprint's mean, so a grazing view of the near pile is not smeared along the gaze
  knot = mix(vhash(floor(uv/0.014)), 0.5, smoothstep(0.004, 0.009, fwk));
  // the weave: small motifs drawn knot-sharp, then softened over a centimetre or two (wool pile, his blended
  // contour); the rows run a little out of true (a slow wander, never a noise blur); far off it sinks to its mean
  vec2 q = uv + 0.016*sin(uv.yx*vec2(2.3, 1.7) + vec2(0.6, 2.2));
  float sw = 0.012 + 0.8*fwk;
  vec3 och = vec3(0.725, 0.54, 0.24), red = mix(uRed, uUltra*0.92, uCloth), blue = mix(uUltra*0.86, och*0.82, uCloth), blk = uBlack*1.3;
  vec3 cream = mix(uWhite, och, 0.5)*0.86, deep = red*0.62 + 0.02*uUltra;
  float W = 6.6, L = 13.;
  float e = min(min(q.y, W - q.y), min(q.x, L - q.x));               // distance in from the edge
  vec3 col = red;
  // field: a lozenge lattice in ochre thread; in each lozenge a deep red star ringed with ochre, a small blue or
  // ochre heart; a small blue note where the threads cross
  float G = 0.62;
  vec2 g = (q - vec2(L*0.5, W*0.5))/G; vec2 gi = floor(g + 0.5), gf = g - gi;
  float dia = abs(gf.x) + abs(gf.y), sq = max(abs(gf.x), abs(gf.y));
  float odd = mod(gi.x + gi.y, 2.);
  sw /= G;
  col = mix(col, mix(red, och, 0.5), CS(0.455, dia)*(1. - CS(0.5, dia)));
  float star = min(dia, sq*1.3);
  col = mix(col, deep, 1. - CS(0.34, star));
  col = mix(col, och, (1. - CS(0.25, star))*CS(0.2, star)*0.7);
  col = mix(col, mix(blue, och*1.08, odd), 1. - CS(0.1, star));
  float nt = min(abs(abs(gf.x) - 0.5) + abs(gf.y), abs(gf.x) + abs(abs(gf.y) - 0.5));
  col = mix(col, blue, 1. - CS(0.075, nt));
  vec2 hk = abs(abs(gf) - 0.29);
  col = mix(col, blk, (1. - CS(0.035, max(hk.x, hk.y)))*CS(0.36, star)*0.55);
  sw *= G;
  // borders, from the field outward: a cream thread, a deep red band of ochre rosettes with blue hearts, ochre and red guards, black edge
  float along = (min(q.y, W - q.y) < min(q.x, L - q.x)) ? q.x : q.y;
  float ro = abs(fract(along/0.42) - 0.5)*0.42, rb = abs(e - 0.62);
  vec3 band = mix(deep, mix(deep, och, 0.75), 1. - CS(0.15, ro + rb));
  band = mix(band, blue, 1. - CS(0.06, ro + rb));
  band = mix(band, mix(deep, och, 0.5), 1. - CS(0.035, abs(ro - 0.21) + rb*0.5));
  col = mix(col, cream, 1. - CS(1.0, e)); col = mix(col, band, 1. - CS(0.955, e));
  col = mix(col, mix(red, och, 0.6), 1. - CS(0.3, e)); col = mix(col, red*0.9, 1. - CS(0.235, e)); col = mix(col, blk, 1. - CS(0.09, e));
  return col;
}
void main(){
  vec3 n = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) n = -n;
  vec3 alb = vC.rgb; float meltK = vC.a, k = vKind, lightAdd = 0.;
  vec3 p = vP;
  if (k > 0.5 && k < 1.5) {                                          // plaster: seamless, the faintest trowel
    vec2 s = abs(n.x) > 0.5 ? p.zy : (abs(n.z) > 0.5 ? p.xy : p.xz);
    alb = uWhite*(1. + 0.022*(vnoise(s*0.55) - 0.5) + 0.012*(vnoise(s*2.3 + 9.) - 0.5));
  } else if (k < 2.5 && k > 1.5) {                                   // marble chequer
    float ch = chequer(p.xz, 0.028 + 0.065*smoothstep(20., 3.5, length(p - uEye)));
    float vein = vnoise(p.xz*vec2(0.9, 2.3) + 3.*vnoise(p.xz*0.35));
    vec3 wm = uWhite*(0.97 - 0.09*smoothstep(0.5, 0.75, vein)), bm = uBlack*1.8 + 0.06*smoothstep(0.62, 0.8, vein);
    alb = mix(bm, wm, ch);
    vec3 v = p - uEye; vec3 r = vec3(v.x, -v.y, v.z);                 // dull polish: the window's own light lying in the stone
    float t = (9. - p.x)/max(r.x, 1e-3);
    vec2 h = vec2(p.z + r.z*t, r.y*t);
    float wl = winRect(h, 3., 12., 0.9)*poolField(7.5) + winRect(h, 24., 34., 0.9)*poolField(29.) + winRect(h, 45., 53., 0.9)*poolField(49.);
    wl *= 0.78 + 0.44*vnoise(p.xz*vec2(0.5, 0.33) + (uTime + uPhase.z)*vec2(0.45, -0.3));   // the polish trembles: the light in the stone is never still
    float fres = 1. - abs(v.y)/max(length(v), 1e-3);
    lightAdd = step(0., r.x)*wl*fres*fres*mix(0.5, 0.14, ch);
    alb = mix(alb, uShade*0.82, fres*fres*0.6*(1. - ch));        // far off the black tiles take the pale room into their polish
  } else if (k < 3.5 && k > 2.5) {                                   // the Turkey carpet
    float knot; alb = carpetAt(vUv, knot); alb *= 0.95 + 0.1*knot;
  } else if (k < 4.5 && k > 3.5) {                                   // blue and white tile skirting
    vec2 t = vUv/0.42; vec2 ti = floor(t), tf = fract(t) - 0.5; float fw = max(fwidth(t.x), fwidth(t.y));
    float fig = vnoise(tf*7. + ti*13.7)*smoothstep(0.34, 0.1, length(tf)) + 0.6*smoothstep(0.1, 0.04, length(abs(tf) - 0.42));
    vec3 tile = mix(uWhite*vec3(0.95, 0.97, 1.), uUltra*1.15, smoothstep(0.3, 0.42, fig)*0.85);
    float grout = smoothstep(0.5 - 0.03 - fw, 0.5 - 0.03, max(abs(tf.x), abs(tf.y)));
    alb = mix(tile, uShade*0.9, grout);
    alb = mix(alb, mix(uWhite, uUltra, 0.2), smoothstep(0.15, 0.4, fw));
  } else if (k > 13.5) {                                             // the ceiling: pale limed boards; the beams are quiet bars with a blended edge
    float bz = abs(mod(p.z + 40.875, 5.75) - 2.875), fz = max(fwidth(p.z), 1e-4);
    float beam = 1. - smoothstep(0.1 - 0.5*fz, 0.5 + 0.5*fz, bz + 0.05*(vnoise(vec2(p.x*0.7, p.z*0.3)) - 0.5));
    vec3 boards = uWhite*(0.93 + 0.03*vnoise(vec2(p.x*0.9, p.z*0.22)) - 0.025*smoothstep(0.42, 0.5, abs(fract(p.x/1.1) - 0.5))*(1. - smoothstep(0.02, 0.06, fwidth(p.x))));
    boards *= 1. - 0.1*(1. - smoothstep(0.3, 1.5, bz));                // the beam's own soft shade on the boards beside it
    alb = mix(boards, alb*(0.94 + 0.12*vnoise(vec2(p.x*0.35, p.z*3.))), beam);
  } else if (k < 5.5 && k > 4.5) {                                   // wood: beams, frames
    alb *= 0.94 + 0.14*vnoise(vec2(dot(p, vec3(0.3, 0.3, 0.9))*0.35, dot(p, vec3(4., 5., 0.6))));
  }
  float light = clamp(roomLightK(p, n, (k < 0.5 || (k > 2.5 && k < 3.5)) ? 1. : 0.) + lightAdd, 0., 1.);
  if (k > 2.5 && k < 3.5) light = clamp(light*1.3, 0., 1.);            // wool in the pool shows its madder at full strength
  if (k > 1.5 && k < 2.5) light *= mix(0.6, 1., smoothstep(0.4, 0.85, light));   // the marble shows where each pool lies: between the pools it sinks to the shade
  vec3 col = paint(alb, light);
  col = melt(col, p, n, meltK);
  gl_FragColor = vec4(toScene(col), 1.);
}`,me=`
// THE SKY, in the world's own metres (room coordinates), so it has parallax as we cross and the water doubles it by
// geometry. o = where the ray starts, d = its unit direction with d.y > 0.
// TEN CUMULUS or so stand beyond the town in two ranks (the planes x = 850 and x = 1500, the further ones larger and
// lower in the picture): to every cell of a rank one heap of round puffs, wider than tall, on a level blue-grey base,
// cream on top (lit from behind us); one cell in four is open sky. The ranks slide to starboard with the cloud field.
vec2 heap(vec2 p, float id, float k, float base){   // p = (z from the cell's middle, y), metres -> (cover, tone)
  float h1 = vhash(vec2(id, 3.7)), h2 = vhash(vec2(id, 9.1)), h3 = vhash(vec2(id, 17.3));
  float W = k*(60. + 40.*h1), H = k*(68. + 56.*h2), yb = base + 40.*k*h3;
  vec2 q = vec2(p.x + 16.*(h3 - 0.5), p.y - yb);
  float bil = vnoise(q*0.04/k + id*7.3), bi2 = vnoise(q*0.13/k + id*3.1);
  q += k*vec2(10.*(bil - 0.5), 8.*(bi2 - 0.5));
  float dd = length(q - vec2(0.2*W*(h3 - 0.5), 0.5*H)) - 0.46*H;
  dd = min(dd, length(q - vec2(-0.56*W, 0.3*H)) - 0.3*H*(0.75 + 0.5*h1));
  dd = min(dd, length(q - vec2(0.54*W, 0.28*H)) - 0.28*H*(0.75 + 0.5*h2));
  dd = min(dd, length(q - vec2(-0.96*W, 0.13*H)) - 0.15*H);
  dd = min(dd, length(q - vec2(0.96*W, 0.12*H)) - 0.14*H);
  dd = min(dd, length(q - vec2(0.7*W*(h1 - 0.5), 0.78*H)) - 0.2*H);
  float cover = smoothstep(3.*k, -3.*k, dd)*smoothstep(-5.*k, 7.*k, q.y)*step(vhash(vec2(id, 23.9)), 0.74);
  float tone = smoothstep(0.0, 0.4, q.y/H + 0.16*(bil - 0.5)) - 0.2*smoothstep(-4.*k, -32.*k, dd)*smoothstep(0.6, 0.15, q.y/H) + 0.1*(bi2 - 0.5);
  return vec2(cover, clamp(tone, 0., 1.));
}
vec2 rank(vec3 o, vec3 d, float X, float cw, float k, float base){
  float t = max(X - o.x, 1.)/d.x;
  vec2 hp = vec2(o.z + d.z*t - uCloud, o.y + d.y*t);
  float cell = hp.x/cw, id = floor(cell);
  return heap(vec2((cell - id - 0.5)*cw, hp.y), id + X, k, base);
}
// THE SLATE BANK: one drawn cloud lying level over the near water, the quay and the near town for the town's whole
// length (z -60 to 260), its belly at y uBank.y, its far edge (the edge toward the town's back, paler) over x uBank.x. It reaches behind the town, so slate stands above the roofs from every eye on the harbour: that edge lies 36 m beyond the town's far edge (the back row and the nave's back wall at x 264; 264 + 36 = 300); the rim's own line stands 11 m short of it (the lobes swell over the last 20 m before that line and none passes it, so sky stands over the roofs under the lip); after rain it hangs lower and reaches further (335), the pearl overcast reaches further still (350): settings of the weather.
// ONE BODY: where the cloud field's own gap stands the bank THINS and does not open: through its whole depth its tone
// goes to a paler slate (the design's blue-grey) and the cover stays cloud. The field's fully struck stretch is 72 to 89 m
// of z in the three weathers, never narrower than a tenth of the mass beside it (231 to 248 m), so no blue stands
// through the bank anywhere; the thin place slides to starboard with the field as the break did.
// A FORM: the far rim is drawn in lobes (discs of radius 17 to 26 m at a pitch of 42 m along the town, swelling over
// the last 20 m before the rim's line, their tips at that line and never beyond it), the cloud ending in sky over a rim 6 m deep;
// A LIT LOWER PART: slate is the cloud's top; from the line where its own shadow ends on the ground to that rim its tone rises
// to the warm white at the lip (see the lines below), lobe by lobe, and rides with the rim; the belly is modelled in lobes about 44 m deep
// and 60 m long, each darker slate on the side toward us and paler toward the town (the bright sky lies beyond it),
// meeting its neighbour over a soft edge of about 6 m. Returns the tone and the cover.
vec4 bankAt(vec3 o, vec3 d){
  float t = max(uBank.y - o.y, 1.)/max(d.y, 0.02);
  vec2 h = o.xz + d.xz*t;
  float n1 = vnoise(h*0.012 + vec2(3., 7.)), n2 = vnoise(h*0.04 + 11.);
  float xe = uBank.x - 11. + 26.*(n1 - 0.5);                                         // the rim's line: 11 m short of the bank's far edge, wandering by 13 m either way, so that half the cover stands about 19 to 21 m beyond the town's far edge at x 264
  float dd = h.x - (xe - 20.), ci = floor(h.y/42.);                                // the far rim: the body, and the lobes that swell from it to the edge
  for (int j = -1; j <= 1; j++) {
    float id = ci + float(j), ha = vhash(vec2(id, 4.3)), hb = fract(ha*57.3), rr = 17. + 9.*ha;
    dd = min(dd, length(h - vec2(xe - rr - 6.*hb, (id + 0.5 + 0.5*(hb - 0.5))*42.)) - rr);
  }
  float cx = smoothstep(3., -3., dd);
  float cz = smoothstep(-126., -60., h.y + 30.*(n2 - 0.5))*(1. - smoothstep(260., 326., h.y + 30.*(n1 - 0.5)));
  float g = 0.5 + 0.5*cos(6.2831853*(h.y - uCloud + 474.)/320.);
  float brk = smoothstep(0.9, 0.985, g + 0.06*(n2 - 0.5));                         // where the field's gap stands the bank thins, its whole depth
  float cover = cx*cz;                                                            // one body: the thin place stays cloud
  vec2 bc = vec2(44., 60.), bi = floor(h/bc); float ws = 0., lobe = 0.;           // the belly's lobes: each darker toward us, paler toward the town
  for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) {
    vec2 id = bi + vec2(float(a), float(b)); float hj = vhash(id + 3.1);
    vec2 e = h - (id + 0.5 + 0.6*(vec2(hj, fract(hj*57.3)) - 0.5))*bc;
    float wl = exp(-(e.x*e.x + 0.54*e.y*e.y)/130.);
    ws += wl; lobe += wl*e.x;
  }
  lobe = clamp(lobe/max(ws, 1e-20)/24., -1., 1.);
  vec3 slate = vec3(0.357, 0.396, 0.439);
  vec3 tone = slate*(1.03 + 0.2*lobe + 0.1*(n1 - 0.5));
  tone = mix(tone, uShade*(1. + 0.07*lobe), 0.85*brk);                            // the thin place: a paler slate, still modelled, no blue through it
  // THE LIT LOWER PART: the slate is the cloud's TOP. Over what the bank shades the cloud stays slate as above, lobe by
  // lobe; from the line where its shadow ends on the ground (SHADE_X1, townSun's own) to the rim the tone rises without a
  // step through the blue-grey shade (halfway) to the warm white at the lip. By the place on the cloud alone: its distance
  // to the rim as a share of the way from that line to the rim (85 m in passing cloud, 120 m after rain, 135 m under the
  // pearl overcast, whose own grey lies over it below). The belly's lobes ride on it, fainter as it lightens.
  // RIDING on the shade's own line: a cloud is dark over what it shades, so the tone reads the place where townSun ends
  // the shadow on the ground, from the one constant both now read (the two numbers are the ones townSun had typed). It is
  // the GROUND line (height 0) of the shade's straight edge: townSun's slant with height (a roof's shade ends nearer) and
  // its bay at the gate are not followed by the cloud's tone.
  float sg = clamp(1. + dd/max(xe - 20. - SHADE_X1, 1.), 0., 1.); sg = sg*sg*(3. - 2.*sg);
  tone = mix(tone, uShade*(1. + 0.07*lobe), min(1., 2.*sg));
  tone = mix(tone, uWhite*(1. + 0.04*lobe), max(0., 2.*sg - 1.));
  tone = mix(tone, vec3(0.76, 0.775, 0.78)*(0.96 + 0.1*(n2 - 0.5)), 0.7*uBank.w); // pearl overcast: never dim
  return vec4(tone, cover);
}
vec3 skyTone(vec3 o, vec3 d){
  float e = d.y/max(length(d.xz), 1e-3);
  vec3 cream = vec3(0.895, 0.885, 0.825);
  // blue paling to cream toward the horizon, without a step; a little deeper overhead
  vec3 col = mix(cream, uSky, smoothstep(-0.02, 0.36, e)*0.98);
  col = mix(col, uSky*vec3(0.86, 0.92, 1.02), 0.6*smoothstep(0.3, 0.95, e));
  col = mix(col, vec3(0.86, 0.865, 0.845), 0.55*uBank.w*smoothstep(0.5, 0.05, e));
  if (d.x > 0.02) {
    vec2 c = rank(o, d, 1500., 320., 1.25, 196.);
    col = mix(col, mix(vec3(0.66, 0.71, 0.775), vec3(0.955, 0.95, 0.915), c.y), c.x);
    c = rank(o, d, 850., 260., 1., 148.);
    col = mix(col, mix(vec3(0.6, 0.66, 0.735), vec3(0.975, 0.965, 0.925), c.y), c.x);
  }
  vec4 bank = bankAt(o, d);
  return mix(col, bank.rgb, bank.a);
}
vec3 outsideTone(vec3 p, vec3 d){
  float e = d.y/max(length(d.xz), 1e-3);
  vec3 col = skyTone(p, d);
  float tz = p.z + d.z/max(d.x, 0.05)*(175. - p.x);
  float sun = cloudField(tz).x;
  float roofs = 0.085 + 0.05*vnoise(vec2(tz*0.045, 1.)) + 0.035*vnoise(vec2(tz*0.19, 5.)) + 0.3*smoothstep(7., 2., abs(tz - 150.))*step(0.12, 1.);
  vec3 town = mix(vec3(0.38, 0.36, 0.37), mix(uLemon, uWhite, 0.4), 0.8*sun*smoothstep(0.02, 0.07, e));
  col = mix(col, town, smoothstep(roofs, roofs - 0.012, e));
  vec3 water = mix(vec3(0.62, 0.64, 0.62), town, 0.35*smoothstep(-0.2, -0.05, e));
  col = mix(col, water, smoothstep(-0.055, -0.07, e));
  col = mix(col, vec3(0.6, 0.53, 0.44), smoothstep(-0.42, -0.5, e));
  return col;
}`,ke=`
${ie}
${me}
varying vec3 vP, vN; varying vec4 vC; varying vec2 vUv; varying float vKind;
void main(){
  vec3 n = vN/max(length(vN), 1e-4);
  vec3 v = vP - uEye; float dist = length(v); v /= max(dist, 1e-3);
  vec2 cell = vec2(0.42, 0.62), g = vUv/cell, gi = floor(g), gf = fract(g);
  float h1 = vhash(gi + 3.7), h2 = vhash(gi*1.7 + 11.3);
  if (vKind < 6.5) {                                               // fixed leaded light, milky: glass and leads as paint
    float fw = max(max(fwidth(vUv.x), fwidth(vUv.y)), 1e-4);
    float cl = cloudField(vP.z).y;
    vec3 d = v; if (d.x < 0.) d.x = -d.x;                           // from outside, the glass holds the sky behind the viewer
    vec3 glass = mix(mix(uSky, vec3(0.985, 0.992, 0.985), 0.8 + 0.1*clamp(1. - d.y*2., 0., 1.)), outsideTone(vP, d), 0.05)*(0.95 + 0.05*cl)*(0.985 + 0.03*h1);
    glass = mix(glass, glass*vec3(0.965, 1., 0.975), h2*0.5);
    vec2 ed = min(gf, 1. - gf)*cell; float de = min(ed.x, ed.y);
    float w = max(0.019, 0.7*fw);
    float lead = 1. - smoothstep(w - 0.6*fw, w + 0.6*fw, de);
    lead = mix(lead, 0.11, smoothstep(0.1, 0.16, fw));              // under 3 px a quarrel: the flat mean
    vec3 col = mix(glass, uBlack*1.25 + 0.05*glass, lead);
    gl_FragColor = vec4(toScene(col), 1.);
    return;
  }
  // the open leaf: each quarrel sits a hair out of true, so the room it holds is broken pane by pane and slides
  float fwl = max(max(fwidth(vUv.x), fwidth(vUv.y)), 1e-4);
  vec3 nn = n + vec3(h1 - 0.5, h2 - 0.5, h1*h2 - 0.25)*0.0025 + 0.004*sin((uTime + uPhase.z)*vec3(0.7, 0.9, 0.5) + vP.y*0.6);
  nn /= max(length(nn), 1e-4);
  if (dot(nn, v) > 0.) nn = -nn;
  vec3 r = reflect(v, nn); r += vec3(1e-4)*(1. - 2.*step(r, vec3(0.)));
  vec3 tb = (mix(vec3(-9., 0., -6.), vec3(9., 11., 54.), step(vec3(0.), r)) - vP)/r;
  float t = min(tb.x, min(tb.y, tb.z));
  vec3 hit = vP + r*t;
  vec3 pf = vP + r*tb.y;
  vec2 c = vec2(pf.x + pf.z, pf.x - pf.z)*(0.70711/1.5);
  float ch = mod(floor(c.x) + floor(c.y), 2.);
  vec3 col;
  if (t == tb.x) {
    if (r.x > 0.) {
      float wr = max(winRect(hit.zy, 3., 12., 0.2), max(winRect(hit.zy, 24., 34., 0.2), winRect(hit.zy, 45., 53., 0.2)));
      col = mix(paint(uWhite, roomGrade(hit, vec3(-1., 0., 0.))), mix(uSky, vec3(0.93, 0.935, 0.9), 0.55 + 0.25*smoothstep(0.5, 0., r.y)), wr);
    } else col = paint(uWhite, roomLight(hit, vec3(1., 0., 0.)));
  } else if (t == tb.y) {
    col = r.y < 0. ? paint(mix(uBlack*1.25, uWhite*0.95, ch), roomLight(hit, vec3(0., 1., 0.))) : paint(vec3(0.353, 0.275, 0.196), 0.35);
  } else col = paint(uWhite, roomLight(hit, vec3(0., 0., -sign(r.z))));
  float tab = 1. - occBox(vP, r, uOccMin[0], uOccMax[0] + vec3(0., 1.2, 0.));
  col = mix(col, paint(mix(uRed, uUltra, uCloth), roomLight(vec3(5., 3., 21.), vec3(0.5, 0.8, 0.))), tab*0.9);
  float cs = abs(dot(nn, v));
  float fres = (1. - cs)*(1. - cs);
  col = mix(col, vec3(0.78, 0.83, 0.85), 0.22)*mix(vec3(0.9), vec3(0.7, 0.76, 0.81), vC.a)*(1. + 0.03*h1);
  col = mix(mix(col, vec3(0.9, 0.935, 0.94), 0.62), col, vC.a);          // the near leaf is bright milk-blue glass: the window as light   // the far leaf is a dim sheet of glass holding the room
  vec2 ed = min(gf, 1. - gf)*cell; float de = min(ed.x, ed.y), lw = max(0.022, 0.8*fwl);     // the leads, as paint, over the real bars
  float lead = 1. - smoothstep(lw - 0.6*fwl, lw + 0.6*fwl, de);
  lead = mix(lead, 0.15, smoothstep(0.1, 0.16, fwl));
  col = mix(col, uBlack*1.25 + 0.05*col, lead);
  // vC.a 1 = the far leaf, a sheet holding the room; 0 = the near leaf, looked through to the town
  float al = mix(clamp(0.24 + 0.5*fres, 0., 0.9), 0.86, vC.a);
  gl_FragColor = vec4(toScene(col), max(al, lead));
}`,ze=`
${ie}
attribute vec3 iPos, iNrm, iCol, iBase; attribute vec2 iSize;
varying vec3 vCol, vBase; varying vec2 vQ; varying float vSoft;
void main(){
  vec4 w = modelMatrix*vec4(iPos, 1.);
  vec3 rp = (uRoomFromWorld*w).xyz, rn = mat3(uRoomFromWorld)*(mat3(modelMatrix)*iNrm);
  rn /= max(length(rn), 1e-4);
  vec3 ev = uEye - rp; float dist = max(length(ev), 0.05);
  float far = smoothstep(8., 30., dist);
  float light = rp.x < 9.3 ? roomLight(rp, rn) : 0.8;
  float size = iSize.x*mix(1., 1.6, far)*iSize.y;
  size *= smoothstep(-0.25, 0.2, dot(rn, ev)/dist)*mix(0.35, 1., smoothstep(0.25, 0.7, light));
  // the floor: 3 px near to 1.7 px far of a picture of 720 lines or more, and not under 2.2 px near (1.7 px far) of the
  // picture as it is; the 0.25 m ceiling and the cap of the unswollen (9 px of the 720 picture) overrule both, and a
  // dot under 2 cm has no floor
  float fl = mix(3., 1.7, smoothstep(45., 170., dist));
  size = min(max(size, max(fl*dist*uPx, min(fl, 2.2)*dist*uPxLo)*step(0.02, size)), 0.25);
  if (iSize.y < 1.05) size = min(size, 9.*dist*uPx);
  vSoft = max(far, clamp(iSize.y - 1., 0., 1.));
  vCol = paint(iCol, max(light, 0.8)); vBase = paint(iBase, light);
  vQ = position.xy*2.;
  vec4 mv = viewMatrix*w;
  mv.xy += position.xy*size; mv.z += 0.04;
  gl_Position = projectionMatrix*mv;
}`,Me=`
${ie}
varying vec3 vCol, vBase; varying vec2 vQ; varying float vSoft;
void main(){
  float r = length(vQ);
  if (r > 1.) discard;
  gl_FragColor = vec4(toScene(mix(vCol, vBase, vSoft*0.75*smoothstep(0.4, 1., r))), 1.);
}`,Se=`
${ie}
${me}
varying vec3 vP, vN; varying vec4 vC; varying vec2 vUv; varying float vKind;
#ifdef FAR
// THE FAR SIDE OF THE ARCH: the canal that runs on behind the bridge between two rows of house fronts to a gabled
// front and a low further bridge 95 m in, painted along the ray in the arch's own axes (x to port, z into the
// town), so it has depth and parallax in the opening. It stands in the bank's shade until the gap of the field that
// lands on the yellow wall lies on it, and then turns to lit fronts over cream-gold water.
float farSun(vec3 q){
  vec3 P = vec3(150. + q.z*0.8988 + q.x*0.4384, q.y, 96. + q.z*0.4384 - q.x*0.8988);
  float a = P.z - 0.95*max(P.x - 163.5, 0.);
  return cloudField(a).x*smoothstep(0.78, 0.96, 0.5 + 0.5*cos(6.2831853*(a - uCloud + 474.)/640.));
}
vec3 farFronts(vec3 q, vec3 e, vec3 P0, vec3 D){
  float ex = abs(e.x) < 1e-3 ? 1e-3 : e.x;
  float tx = ((ex > 0. ? 7. : -7.) - q.x)/ex, te = (95. - q.z)/max(e.z, 1e-3);
  vec3 h = q + e*min(tx, te);
  float sun = farSun(h);
  if (tx < te) {                                                    // a side: fronts 9.5 m wide, each its own height and wall
    float hz = h.z/9.5, id = floor(hz) + (ex > 0. ? 31. : 0.), fx = (hz - floor(hz))*9.5;
    float h1 = vhash(vec2(id, 2.3)), h2 = vhash(vec2(id, 7.9)), eave = 4.5 + 6.*h1;
    if (h.y > eave + 5.5) return skyTone(P0, D);
    if (h.y > eave) return paintOut(mix(vec3(0.71, 0.278, 0.18), vec3(0.357, 0.396, 0.439), step(0.6, h2))*(0.9 + 0.2*vnoise(vec2(h.z*0.9, h.y*1.3))), sun, 0.9);
    vec3 alb = h2 < 0.3 ? vec3(0.84, 0.83, 0.78) : (h2 < 0.75 ? vec3(0.71, 0.278, 0.18) : vec3(0.56, 0.27, 0.19));
    alb *= 0.88 + 0.2*vnoise(vec2(h.z*0.5 + id, h.y*0.7)) + 0.06*vnoise(vec2(h.z*3.1, h.y*4.3));
    alb *= 1. - 0.3*smoothstep(0.42, 0.5, abs(fx/9.5 - 0.5));                                    // the joint between two fronts
    alb = mix(alb, vec3(0.74, 0.72, 0.65), step(abs(h.y - eave + 0.5), 0.22) + step(abs(h.y + 2.1), 0.14));   // eaves cornice, string course
    alb = mix(alb, vec3(0.6, 0.59, 0.54)*0.8, smoothstep(-8.6, -9., h.y));                       // the quay's damp stone foot
    float lights = step(abs(abs(fx - 4.75) - 2.2), 0.75)*(step(abs(h.y + 4.4), 1.4) + step(abs(h.y - 1.), 1.3)*step(1., eave - 4.));
    alb = mix(alb, vec3(0.17, 0.19, 0.22), lights*0.9);
    return paintOut(alb, ex > 0. ? sun : 0., 0.5)*(ex > 0. ? 1.04 : 0.92);      // the sun stands behind us a little to starboard: the port fronts are struck, the starboard fronts keep their own shade
  }
  // the end: a whitewashed front under a stepped gable, a low dark bridge at its foot, the sky above
  float top = 3. + 1.7*floor((7. - abs(h.x))/1.2);
  if (h.y > top) return skyTone(P0, D);
  vec3 alb = vec3(0.86, 0.85, 0.8)*(0.92 + 0.14*vnoise(h.xy*0.6));
  alb = mix(alb, vec3(0.17, 0.19, 0.22), step(abs(abs(h.x) - 2.6), 0.7)*step(abs(h.y - 1.5), 1.5)*0.9);
  alb = mix(alb, vec3(0.6, 0.59, 0.54), step(h.y, -7.2));
  alb = mix(alb, vec3(0.13, 0.15, 0.18), step(h.y, -8.8 + sqrt(max(10.5 - h.x*h.x, 0.)))*step(abs(h.x), 3.24));
  return paintOut(alb, sun, 0.5);
}
// the barrel of the bridge (a half-round of radius 6 about y -8 on piers at x +-6, z 0 to 7): where a ray from q leaves it
// through the stone, the stone's paint (a = 1): courses along the vault, darker toward the middle, the water's light on it
vec4 barrel(vec3 q, vec3 e){
  vec3 b = q + e*((7. - q.z)/e.z);
  if (q.z >= 7. || (abs(b.x) <= 6. && b.y <= -8. + sqrt(max(36. - b.x*b.x, 0.)))) return vec4(0.);
  float ex = abs(e.x) < 1e-3 ? 1e-3 : e.x;
  float t = ((ex > 0. ? 6. : -6.) - q.x)/ex;
  if (t < 0. || q.y + e.y*t > -8.) {
    float A = max(e.x*e.x + e.y*e.y, 1e-5), B = 2.*(q.x*e.x + (q.y + 8.)*e.y), Cq = q.x*q.x + (q.y + 8.)*(q.y + 8.) - 36.;
    t = (-B + sqrt(max(B*B - 4.*A*Cq, 0.)))/(2.*A);
  }
  vec3 h = q + e*t;
  float su = h.y > -8. ? 6.*atan(h.y + 8., abs(h.x) + 1e-3) : h.y + 8.;
  float course = su/0.5, zj = h.z/1.2 + 0.5*mod(floor(course), 2.);
  float joint = max(smoothstep(0.4, 0.5, abs(fract(course) - 0.5)), smoothstep(0.44, 0.5, abs(fract(zj) - 0.5)));
  vec3 alb = vec3(0.74, 0.72, 0.65)*(0.86 + 0.2*vhash(floor(vec2(course, zj))))*(1. - 0.28*joint);
  alb = mix(alb, alb*vec3(0.62, 0.68, 0.66), smoothstep(-9.3, -10.6, h.y));                       // the damp foot
  float mouth = 0.5 + 0.5*max(smoothstep(3.6, 0., h.z), smoothstep(3.4, 7., h.z));
  float tv = uTime + uPhase.y, wav = sin(h.z*1.7 + su*0.9 + tv*0.9 + 3.*vnoise(vec2(su*0.4, h.z*0.5 - tv*0.2)));
  return vec4(paintOut(alb, 0., 0.4)*mouth*(1. + 0.1*wav*smoothstep(-2., -9., h.y)), 1.);
}
vec3 farSide(vec3 p, vec3 d){
  vec2 dp = p.xz - vec2(150., 96.);
  vec3 q = vec3(dp.x*0.4384 - dp.y*0.8988, p.y, dp.x*0.8988 + dp.y*0.4384);
  vec3 e = vec3(d.x*0.4384 - d.z*0.8988, d.y, max(d.x*0.8988 + d.z*0.4384, 0.03));
  float tw = e.y < -1e-3 ? (-11. - q.y)/e.y : 1e6;
  vec3 hw = q + e*min(tw, 1e4);
  bool under = tw < 1e5 && hw.z < 7. && abs(hw.x) < 6.;               // the water under the barrel itself
  if (!under) {
    vec4 bb = barrel(q, e); if (bb.a > 0.5) return bb.rgb;
    float ex = abs(e.x) < 1e-3 ? 1e-3 : e.x;
    if (tw > min(((ex > 0. ? 7. : -7.) - q.x)/ex, (95. - q.z)/e.z)) return farFronts(q, e, p, d);
  }
  // the canal's water: the vault, the fronts and the sky doubled in it, in level trembling ripples; cream-gold where the strip lies
  float tt = uTime + uPhase.x;
  float rip = vnoise(vec2(hw.x*0.3 + tt*0.2, hw.z*1.1 - tt*0.6)) - 0.5 + 0.5*(vnoise(vec2(hw.x*0.8 - tt*0.3, hw.z*3.1 + tt*0.9)) - 0.5);
  vec3 e2 = vec3(e.x, -e.y*0.86 + 0.02 + 0.08*rip, e.z); e2 /= max(length(e2), 1e-3);
  vec4 bb = barrel(hw, e2);
  vec3 col = (bb.a > 0.5 ? bb.rgb : farFronts(hw, e2, p, vec3(d.x, abs(d.y) + 0.02, d.z)))*vec3(0.86, 0.89, 0.93);
  float sun = farSun(hw)*smoothstep(4., 9., hw.z);
  col = mix(col, vec3(0.9, 0.84, 0.6)*(0.95 + 0.3*rip), 0.42*sun);
  return col*(0.94 + 0.3*rip)*mix(0.74, 1., sun);
}
#endif
void main(){
  vec3 n = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) n = -n;
  vec3 p = vP, alb = vC.rgb; float k = vKind;
  vec3 v = p - uEye; float dist = length(v); v /= max(dist, 1e-3);
  float fw = max(max(fwidth(vUv.x), fwidth(vUv.y)), 1e-4);
  // the double under the water is lit as the thing it doubles: pr and nr are the place and normal above the surface
  float mir = step(p.y, -11.02);
  vec3 pr = vec3(p.x, abs(p.y + 11.) - 11., p.z), nr = vec3(n.x, n.y*(1. - 2.*mir), n.z);
  #ifdef FAR
  {
    vec3 eye = vec3(uEye.x, mir > 0.5 ? -22. - uEye.y : uEye.y, uEye.z);
    vec3 dr = pr - eye; dr /= max(length(dr), 1e-3);
    vec3 fc = farSide(pr, dr);
    fc = mix(fc, fc*0.8*vec3(0.96, 0.99, 1.05), mir);
    // within the last metres before the bridge the painted far side gives way to the opening itself, once the next
    // world's picture stands in it (the portal); until there is one it holds
    float zbE = (uEye.x - 150.)*0.8988 + (uEye.z - 96.)*0.4384;
    gl_FragColor = vec4(toScene(fc), mix(1. - uLive*smoothstep(-27., -11., zbE), 1., mir));
    return;
  }
  #endif
  if (k > 9.5 && k < 10.5) {                                        // still harbour water: grey-gold, the sky and the town doubled soft, broken by fine level ripples
    // ripples lie across the course (the last straight's heading), so they read level in the picture; each octave
    // sinks to its mean where it is finer than the pixel
    vec2 w = vec2(p.x*0.4384 - p.z*0.8988, p.x*0.8988 + p.z*0.4384);
    float fwa = max(fwidth(w.y), 1e-4);
    float tw = uTime + uPhase.x;
    // the ripples have no lattice in them: three trains of sines along the course (3.6 m, 1.05 m and 0.38 m from crest to
    // crest, travelling as they did), whose phase wanders across the course and whose strength swells and dies across it
    // (a band is about 14 m, 5.3 m, 2.2 m long and tapers to nothing at its ends)
    float pa = 1.3*sin(w.x*0.071 + 0.4*tw) + 0.9*sin(w.x*0.173 - w.y*0.045 - 0.27*tw + 2.1);
    float pb = 1.2*sin(w.x*0.29 + w.y*0.11 + 0.33*tw + 0.7) + 0.8*sin(w.x*0.53 - w.y*0.07 - 0.21*tw + 4.);
    float r1 = 0.5*sin(w.y*1.75 + tw*1.59 + pa)*(0.55 + 0.45*sin(w.x*0.22 + w.y*0.13 - tw*0.17 + 1.3))*(1. - smoothstep(0.6, 1.8, fwa));
    float r2 = 0.5*sin(w.y*6. - tw*2.5 + 1.7*pb + 0.6*pa)*(0.5 + 0.5*sin(w.x*0.59 - w.y*0.31 + tw*0.23 + 2.9))*(1. - smoothstep(0.12, 0.45, fwa));
    float r3 = 0.5*sin(w.y*16.5 + tw*4.36 + 2.3*pb - 1.1*pa)*(0.5 + 0.5*sin(w.x*1.43 + w.y*0.67 - tw*0.31 + 5.2))*(1. - smoothstep(0.04, 0.16, fwa));
    float rip = r1 + 0.6*r2 + 0.4*r3;
    vec3 r = vec3(v.x, abs(v.y)*0.86 + 0.015 + 0.075*rip, v.z + 0.045*(r2 + r3)); r /= max(length(r), 1e-3);   // doubled a little stretched downward
    // the sky's double: under the bank the water is dark (the bank's own belly lies in it), beyond its edge blue and cream
    vec3 col = skyTone(p, r)*vec3(0.9, 0.95, 1.);
    // where the struck strip's double lies it is cream-gold: the ray's landing on the far roofs reads the same field
    float er = r.y/max(length(r.xz), 1e-3);
    float tz = p.z + r.z/max(r.x, 0.05)*(190. - p.x);
    float gold = cloudField(tz - 25.).x*smoothstep(0.015, 0.06, er)*(1. - smoothstep(0.13, 0.34, er))*step(0., r.x);
    col = mix(col, vec3(0.9, 0.84, 0.6)*(0.94 + 0.3*rip), 0.5*gold);
    col *= 0.97 + 0.24*rip;
    float fres = 1. - abs(v.y);
    float sq = max(r2, 0.), streak = min(1., sq*sq/(0.5*(sq + 0.06)));   // the surface's own light lies across the doubles in level bands with no edge: one train carries it (a band half a metre deep, 5 m long), each band rising from nothing over the whole flank of its crest (a third of its depth and more) and never flat-topped; the two other trains only tremble the double
    gl_FragColor = vec4(toScene(col), clamp(mix(0.3, 0.2, smoothstep(0.2, 0.7, fres)) + 0.3*streak - 0.07*gold, 0.05, 1.));   // thin enough that every double is read, down to the lower edge
    return;
  }
  if (k > 7.5 && k < 8.5) {                                         // brick: sandy, granular, the courses only a breath; mortar is beaded by the bead layer
    vec2 b = vec2(vUv.x/0.66, vUv.y/0.21); b.x += 0.5*mod(floor(b.y), 2.);
    vec2 bf = abs(fract(b) - 0.5); float h = vhash(floor(b));
    float mort = max(smoothstep(0.5 - 0.05 - fw/0.66, 0.5 - 0.02, bf.x), smoothstep(0.5 - 0.11 - fw/0.21, 0.5 - 0.05, bf.y));
    float fine = smoothstep(0.035, 0.07, fw);
    mort = mix(mort, 0.3, fine); h = mix(h, 0.5, fine);
    float grain = vnoise(vUv*7.) + 0.5*vnoise(vUv*19. + 5.), ptc = vnoise(vUv*0.16 + 3.) + 0.5*vnoise(vUv*0.47);
    alb = mix(alb*(0.88 + 0.18*h), vec3(0.74, 0.7, 0.63), mort*0.17);
    alb *= 0.84 + 0.2*mix(grain, 0.75, smoothstep(0.02, 0.06, fw));
    alb = mix(alb, mix(vec3(0.42, 0.36, 0.34), vec3(0.66, 0.5, 0.36), smoothstep(0.5, 1.1, ptc)), 0.3*abs(ptc - 0.75));
    // weathered: soot and damp run down from eaves and sills in soft streaks, and the fired colour wanders course by course
    float run = vnoise(vec2(vUv.x*0.75, vUv.y*0.07 + 3.))*vnoise(vec2(vUv.x*0.23 + 7., vUv.y*0.05));
    alb = mix(alb, alb*vec3(0.7, 0.72, 0.76), smoothstep(0.22, 0.62, run)*0.7);
    alb *= 0.86 + 0.28*vnoise(vec2(vUv.x*0.31 + 2., vUv.y*0.9));
    alb = mix(alb, alb*vec3(1.1, 0.96, 0.86) + vec3(0.03, 0.015, 0.), smoothstep(0.55, 0.9, vnoise(vUv*vec2(0.9, 1.6) + 13.))*0.5);   // harder-fired batches
  } else if (k > 8.5 && k < 9.5) {                                  // pantiles or slates in rows
    float row = abs(fract(vUv.x/0.8) - 0.5), h = vhash(floor(vUv/vec2(0.8, 1.1)));
    float rib = mix(smoothstep(0.1, 0.45, row), 0.5, smoothstep(0.13, 0.27, fw));
    alb *= (0.84 + 0.2*rib)*(0.92 + 0.16*mix(h, 0.5, smoothstep(0.13, 0.27, fw)));
    float mend = vnoise(vUv*vec2(0.21, 0.3) + 4.) + 0.5*vnoise(vUv*vec2(0.6, 0.8) + 9.);
    alb = mix(alb, alb*vec3(0.8, 0.84, 0.86), smoothstep(0.7, 1.15, mend)*0.75);                 // weathered courses
    alb = mix(alb, mix(alb, vec3(0.62, 0.6, 0.5), 0.34), smoothstep(0.52, 0.2, mend));           // lichen, pale
    alb *= 0.93 + 0.14*vnoise(vec2(vUv.x*1.3, vUv.y*0.35 + 6.));
  } else if (k > 10.5 && k < 11.5) {                                // sand
    float rip = vnoise(vec2(p.z*0.42 + 2.2*vnoise(p.xz*0.13), p.x*1.5)), fws = max(fwidth(p.x), fwidth(p.z));
    alb *= 0.985 + 0.07*(vnoise(p.xz*0.3) - 0.5) + 0.09*(mix(rip, 0.5, smoothstep(0.25, 0.6, fws)) - 0.5) + 0.05*(mix(vnoise(p.xz*2.3), 0.5, smoothstep(0.1, 0.25, fws)) - 0.5);
    // the strand's own drawing: long drifts of blown sand lying along the quay, and two dark wrack lines the tide left
    float drift = vnoise(vec2(p.z*0.085 + 2.6*vnoise(p.xz*0.045), p.x*0.36 + 3.));
    alb *= 0.9 + 0.22*mix(drift, 0.5, smoothstep(0.5, 1.5, fws));
    float lvl = p.y + 0.09*(vnoise(vec2(p.z*0.27, 5.)) - 0.5);
    float wrack = (1. - smoothstep(0.012, 0.05, abs(lvl + 10.36)))*step(0.38, vnoise(p.xz*vec2(1.3, 0.7))) + (1. - smoothstep(0.008, 0.035, abs(lvl + 10.16)))*step(0.5, vnoise(p.xz*vec2(0.9, 1.9) + 7.));
    alb = mix(alb, vec3(0.3, 0.27, 0.2), 0.55*wrack*(1. - smoothstep(0.08, 0.3, fws)));
    float wet = smoothstep(-10.45, -10.93, p.y + 0.2*(vnoise(vec2(p.z*0.33, 2.)) - 0.5));
    alb = mix(alb, alb*vec3(0.66, 0.68, 0.7), wet);
    alb = mix(alb, vec3(0.86, 0.85, 0.8), 0.5*smoothstep(-10.78, -10.95, p.y)*smoothstep(-11.12, -10.98, p.y));     // a pale lip of foam where it meets the water
  } else if (k > 5.5 && k < 6.5) {                                  // a leaded light seen from the harbour: dark glass holding a little sky, quarrel by quarrel, in its lattice
    vec2 cell = vec2(0.42, 0.62), gq = vUv/cell, gf = fract(gq); float h1 = vhash(floor(gq) + 3.7);
    vec2 ed = min(gf, 1. - gf)*cell; float lw = max(0.034, 0.8*fw);
    float lead = 1. - smoothstep(lw - 0.6*fw, lw + 0.6*fw, min(ed.x, ed.y));
    lead = mix(lead, 0.2, smoothstep(0.1, 0.16, fw));
    alb = mix(mix(vec3(0.2, 0.225, 0.26), uSky*0.86, 0.2 + 0.45*h1*h1), vec3(0.07, 0.07, 0.08), lead);
  } else if (k > 14.5 && k < 15.5) {                                // lime crowns: soft masses, no facets
    alb *= 0.92 + 0.16*vnoise(p.xz*0.23 + p.y*0.19) + 0.08*vnoise(p.zy*0.9 + p.x*0.7);
    float gap = vnoise(vec2(p.z*0.42 + p.x*0.31, p.y*0.5 + p.x*0.17)) + 0.5*vnoise(vec2(p.z*1.05 - p.x*0.4, p.y*1.2) + 5.);
    alb = mix(alb, alb*vec3(0.5, 0.56, 0.62), smoothstep(0.62, 0.36, gap)*0.85);                 // the dark between the boughs
    alb = mix(alb, alb*vec3(1.3, 1.34, 1.2), smoothstep(1.0, 1.3, gap)*smoothstep(-0.2, 0.5, dot(nr, vec3(-0.8053, 0.5197, -0.2841))));   // leaves turned to the light
  } else if (k > 12.5) {                                            // limewash on brick: patched where it has fallen, stained under every ledge
    float ptc = vnoise(vUv*0.33 + 11.) + 0.5*vnoise(vUv*1.1 + 2.) + 0.25*vnoise(vUv*3.7);
    float streak = vnoise(vec2(vUv.x*1.9, vUv.y*0.16 + 4.))*vnoise(vec2(vUv.x*0.5 + 9., vUv.y*0.07));
    vec3 base = alb*(0.9 + 0.12*vnoise(vUv*5.));
    base = mix(base, base*vec3(0.8, 0.83, 0.82), smoothstep(0.2, 0.6, streak));
    float yel = clamp((alb.g - alb.b)*2.5 - 0.5, 0., 1.);            // the yellow wall is kept clean: his lemon, a little weathered, never mouldy
    base = mix(base, alb*(0.93 + 0.1*vnoise(vUv*1.3)), 0.3*yel);                               // weathered like the rest, only less
    alb = mix(base, mix(base*0.72, vec3(0.6, 0.4, 0.32), 0.45)*(0.9 + 0.2*vnoise(vUv*8.)), smoothstep(1.16, 1.34, ptc)*0.6*(1. - 0.6*yel));
  } else if (k > 11.5) {                                            // tarred hull: strakes
    float st = abs(fract(vUv.y/0.9) - 0.5);
    alb = mix(alb, alb*1.7 + 0.03, smoothstep(0.42 - fw, 0.47, st)*0.6)*(0.9 + 0.2*vnoise(vUv*vec2(0.4, 3.)));
  }
  alb *= 0.9 + 0.2*vnoise(vec2(p.z + p.x, p.y)*0.11);                 // weather: broad patches, and the damp foot above the water
  float damp = smoothstep(-7.2, -11., pr.y)*step(40., p.x)*(step(k, 9.5) + step(12.5, k)*step(k, 14.5));
  alb = mix(alb, alb*0.6 + vec3(0.02, 0.035, 0.03), damp*0.6);
  float sun = townSun(pr)*smoothstep(-0.25, 0.45, dot(nr, vec3(-0.8053, 0.5197, -0.2841)));   // the sun: behind us, 6.6 degrees to starboard of the course's line over the harbour
  vec3 col = paintOut(alb, sun, 0.5 + 0.5*nr.y);
  col *= 1. + (k > 14.5 && k < 15.5 ? 0.3 : 0.11)*dot(nr, vec3(-0.75, 0.3, -0.59))*(1. - sun);       // the open sky over the harbour models what stands in shade
  if (k > 11.5 && k < 12.5) col = mix(col, alb*0.8 + 0.012, 0.78);   // tar is bone black, also in shade
  if (uBank.z > 0. && ((k > 8.5 && k < 9.5) || (k > 10.5 && k < 11.5))) {     // after rain: wet tile, slate and sand are deeper and hold the sky
    vec3 rr = reflect(v, nr); rr.y = abs(rr.y) + 0.03; rr /= max(length(rr), 1e-3);
    float fr = 1. - abs(dot(nr, v));
    col = mix(col*0.84, skyTone(pr, rr), uBank.z*(0.14 + 0.5*fr*fr));
  }
  // the water's light trembling on whatever stands over it: a slow soft waver, strongest at the waterline
  // (two slow sine trains whose phases wander, so it reads neither as blocks nor as stripes)
  float tv = uTime + uPhase.y;
  float wq = vnoise(vec2(p.y*0.37 + tv*0.21, (p.x - p.z)*0.23)), wr = vnoise(vec2((p.x + p.z)*0.19 - tv*0.17, p.y*0.31 + 4.));
  float wav = sin((p.x + p.z)*0.33 + tv*0.8 + 5.*wq)*sin(p.y*0.8 - tv*1.0 + 5.*wr);
  col *= 1. + 0.2*wav*smoothstep(3., -9.5, p.y)*step(40., p.x)*step(-11.01, p.y);
  float rim = 1. - abs(dot(n, v));
  if (k < 14.5) col = mix(col, col*1.16 + 0.012, vC.a*smoothstep(0.55, 1., rim));   // a contour melts into the thing's own paint, a little lighter, never into grey
  col = mix(col, col*mix(0.84, 0.7, smoothstep(-16., -44., p.y))*vec3(0.96, 0.99, 1.05), mir);   // under the surface: the double keeps the thing's pigment, a little deeper, never as bright as the thing
  if (mir > 0.5) {
    // each double is one soft streak: toward its lower end it melts into the water's own tone (the sky's double that lies
    // beside it, as the dome paints it): nothing in the first 10 m under the waterline, four parts in ten from 50 m down;
    // and it melts into the same tone wherever its surface turns more than 60 degrees from the eye: the last 30 degrees
    // of a round side, and likewise a flat face seen at such a slant (the same test from every eye)
    float mk = max(0.4*smoothstep(10., 50., -11. - p.y), k < 14.5 ? 0.6*max(vC.a, 0.5)*smoothstep(0.5, 1., rim) : 0.);
    if (mk > 0.004) {
      vec3 vw = vec3(p.x, p.y - 0.14*(-11. - p.y), p.z) - uEye; vw /= max(length(vw), 1e-3);     // the eye's ray to where the drawn-out double stands
      float dn = max(-vw.y, 0.);
      vec3 dw = vec3(vw.x, abs(vw.y)*0.86 + 0.015, vw.z); dw /= max(length(dw), 1e-4);
      vec3 wt = skyTone(vec3(uEye.x, -22. - uEye.y, uEye.z), dw);
      wt = mix(wt, vec3(0.67, 0.65, 0.55), 0.3)*0.9;
      wt = mix(wt, vec3(0.43, 0.46, 0.49)*(0.78 + 0.6*dot(wt, vec3(0.3, 0.5, 0.2))), 0.34*smoothstep(0.04, 0.4, dn));
      col = mix(col, wt, mk);
    }
  }
  #ifdef CROWN
    // a lime's outer veil: the crown's own paint thinning to nothing at the outline, so the mass has no edge
    float gapV = vnoise(vec2(p.z*0.42 + p.x*0.31, p.y*0.5 + p.x*0.17)) + 0.5*vnoise(vec2(p.z*1.05 - p.x*0.4, p.y*1.2) + 5.);
    float body = (1. - smoothstep(0.12, 0.84, rim))*(0.7 + 0.5*vnoise(p.xz*0.45 + p.y*0.37))*mix(0.35, 1., smoothstep(0.36, 0.7, gapV));
    gl_FragColor = vec4(toScene(col), clamp(body, 0., 0.92));
  #else
    gl_FragColor = vec4(toScene(col), 1.);
  #endif
}`,qe=`
uniform mat4 uRoomFromWorld; varying vec3 vD;
void main(){ vD = mat3(uRoomFromWorld)*(mat3(modelMatrix)*position); gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position, 1.); }`,Pe=`
${ie}
${me}
varying vec3 vD;
void main(){
  vec3 d = vD/max(length(vD), 1e-4); float down = max(-d.y, 0.); d.y = abs(d.y)*0.86 + 0.015;      // below the horizon the dome is the sky's own double, seen through the water
  d /= max(length(d), 1e-4);
  vec3 col = skyTone(vec3(uEye.x, down > 0. ? -22. - uEye.y : uEye.y, uEye.z), d);
  // that double is water: grey-gold, and darker and greyer the steeper we look down into it, under the slate cloud near us
  col = mix(col, mix(col, vec3(0.67, 0.65, 0.55), 0.3)*0.9, step(1e-4, down));
  col = mix(col, vec3(0.43, 0.46, 0.49)*(0.78 + 0.6*dot(col, vec3(0.3, 0.5, 0.2))), 0.34*smoothstep(0.04, 0.4, down));
  gl_FragColor = vec4(toScene(col), 1.);
}`,ce=(n,e)=>({...n,...e||{}});function Ae(n,e={}){return new F.ShaderMaterial({uniforms:ce(n),vertexShader:de,fragmentShader:ge,side:e.side??F.FrontSide})}function ue(n,e={}){return new F.ShaderMaterial({uniforms:ce(n),vertexShader:de,fragmentShader:ke,side:F.DoubleSide,transparent:!!e.leaf,depthWrite:!e.leaf})}function we(n,e={}){const a=!!(e.water||e.crown||e.far);return new F.ShaderMaterial({uniforms:ce(n),vertexShader:de,fragmentShader:Se,side:e.side??F.FrontSide,defines:e.crown?{CROWN:1}:e.far?{FAR:1}:{},transparent:a,depthWrite:!a})}function Be(n){return new F.ShaderMaterial({uniforms:ce(n),vertexShader:qe,fragmentShader:Pe,side:F.BackSide,depthWrite:!1})}function Fe(n){return new F.ShaderMaterial({uniforms:ce(n),vertexShader:ze,fragmentShader:Me})}function Ee(n,e){const a=new F.InstancedBufferGeometry;a.setAttribute("position",new F.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),a.setIndex([0,1,2,0,2,3]);const t=n.length,m=new Float32Array(t*3),p=new Float32Array(t*3),u=new Float32Array(t*3),f=new Float32Array(t*3),h=new Float32Array(t*2);for(let g=0;g<t;g++){const c=n[g];m.set([c[0],c[1],c[2]],g*3),p.set([c[3],c[4],c[5]],g*3),u.set([c[6],c[7],c[8]],g*3),f.set([c[9],c[10],c[11]],g*3),h[g*2]=c[12],h[g*2+1]=c[13]??1}const A=(g,c)=>new F.InstancedBufferAttribute(g,c);a.setAttribute("iPos",A(m,3)),a.setAttribute("iNrm",A(p,3)),a.setAttribute("iCol",A(u,3)),a.setAttribute("iBase",A(f,3)),a.setAttribute("iSize",A(h,2)),a.instanceCount=t;const R=new F.Mesh(a,e);return R.frustumCulled=!1,R}const He=new F.Matrix4,Ie=new F.Vector3;function We(n,e,a,t){a.updateWorldMatrix(!0,!1),n.uRoomFromWorld.value.copy(a.matrixWorld).invert(),n.uEye.value.setFromMatrixPosition(e.matrixWorld).applyMatrix4(n.uRoomFromWorld.value);const m=e.projectionMatrix.elements;n.uPx.value=2/(Math.max(m[5],.1)*720),n.uPxLo.value=n.uPx.value,n.uTime.value=t}function be(n,{exposure:e,cloud:a,stripLo:t,stripHi:m,indoorFloor:p,golden:u,flat:f}={}){f!=null&&(n.uFlat.value=f?1:0),e!=null&&(n.uToneK.value=.6/e),a!=null&&(n.uCloud.value=a),t!=null&&(n.uStrip.value.x=t),m!=null&&(n.uStrip.value.y=m),p!=null&&(n.uStrip.value.z=p),u!=null&&(n.uStrip.value.w=u)}class se{constructor(){this.p=[],this.n=[],this.t=[],this.c=[],this.k=[],this.i=[],this.xf=null}get count(){return this.p.length/3}v(e,a,t,m,p,u,f,h,A,R,g){if(this.xf){const c=this.xf.elements,b=c[0]*e+c[4]*a+c[8]*t+c[12],M=c[1]*e+c[5]*a+c[9]*t+c[13],s=c[2]*e+c[6]*a+c[10]*t+c[14],l=c[0]*m+c[4]*p+c[8]*u,q=c[1]*m+c[5]*p+c[9]*u,S=c[2]*m+c[6]*p+c[10]*u;e=b,a=M,t=s,m=l,p=q,u=S}return this.p.push(e,a,t),this.n.push(m,p,u),this.t.push(f,h),this.c.push(A[0],A[1],A[2],R),this.k.push(g),this.p.length/3-1}quad(e,a,t,m,p,u=0,f=0,h=null){const A=a[0]-e[0],R=a[1]-e[1],g=a[2]-e[2],c=m[0]-e[0],b=m[1]-e[1],M=m[2]-e[2];let s=R*M-g*b,l=g*c-A*M,q=A*b-R*c;const S=Math.hypot(s,l,q)||1;s/=S,l/=S,q/=S;const z=[e,a,t,m].map((k,T)=>this.v(k[0],k[1],k[2],s,l,q,h?h[T*2]:0,h?h[T*2+1]:0,p,f,u));this.i.push(z[0],z[1],z[2],z[0],z[2],z[3])}box(e,a,t,m,p,u,f,h={}){const A=Math.min(h.bevel??.04,m*.45,p*.45,u*.45),R=h.kind??0,g=h.melt??.5,c=m/2,b=p/2,M=u/2,s={},l=(r,y,o,i)=>r+y+","+o+","+i;for(const r of[0,1,2])for(const y of[-1,1])for(const o of[-1,1])for(const i of[-1,1]){const x=e+y*(c-(r===0?0:A)),d=a+o*(b-(r===1?0:A)),L=t+i*(M-(r===2?0:A)),W=r===0?L:x,U=r===1?L:d;s[l(r,y,o,i)]=this.v(x,d,L,r===0?y:0,r===1?o:0,r===2?i:0,W,U,f,g,R)}let q=e,S=a,z=t;if(this.xf){const r=this.xf.elements;q=r[0]*e+r[4]*a+r[8]*t+r[12],S=r[1]*e+r[5]*a+r[9]*t+r[13],z=r[2]*e+r[6]*a+r[10]*t+r[14]}const k=this.p,T=(r,y,o)=>{const i=k[r*3]-q,x=k[r*3+1]-S,d=k[r*3+2]-z,L=k[y*3]-k[r*3],W=k[y*3+1]-k[r*3+1],U=k[y*3+2]-k[r*3+2],X=k[o*3]-k[r*3],J=k[o*3+1]-k[r*3+1],H=k[o*3+2]-k[r*3+2];(W*H-U*J)*i+(U*X-L*H)*x+(L*J-W*X)*d>=0?this.i.push(r,y,o):this.i.push(r,o,y)},E=(r,y,o,i)=>{T(r,y,o),T(r,o,i)};for(const r of[-1,1]){E(s[l(0,r,-1,-1)],s[l(0,r,1,-1)],s[l(0,r,1,1)],s[l(0,r,-1,1)]),E(s[l(1,-1,r,-1)],s[l(1,1,r,-1)],s[l(1,1,r,1)],s[l(1,-1,r,1)]),E(s[l(2,-1,-1,r)],s[l(2,1,-1,r)],s[l(2,1,1,r)],s[l(2,-1,1,r)]);for(const y of[-1,1]){E(s[l(0,r,y,-1)],s[l(0,r,y,1)],s[l(1,r,y,1)],s[l(1,r,y,-1)]),E(s[l(0,r,-1,y)],s[l(0,r,1,y)],s[l(2,r,1,y)],s[l(2,r,-1,y)]),E(s[l(1,-1,r,y)],s[l(1,1,r,y)],s[l(2,1,r,y)],s[l(2,-1,r,y)]);for(const o of[-1,1])T(s[l(0,r,y,o)],s[l(1,r,y,o)],s[l(2,r,y,o)])}}}grid(e,a,t,m,p={}){const u=p.kind??0,f=p.melt??.5,h=this.count,A=[],R=p.flip?-1:1;for(let b=0;b<=a;b++)for(let M=0;M<=e;M++)A.push(t(M/e,b/a));const g=(b,M)=>p.ext&&(b<0||b>e||M<0||M>a)?t(b/e,M/a):A[Math.min(a,Math.max(0,M))*(e+1)+Math.min(e,Math.max(0,b))],c=[];for(let b=0;b<=a;b++)for(let M=0;M<=e;M++){const s=g(M-1,b),l=g(M+1,b),q=g(M,b-1),S=g(M,b+1),z=l[0]-s[0],k=l[1]-s[1],T=l[2]-s[2],E=S[0]-q[0],r=S[1]-q[1],y=S[2]-q[2];let o=(k*y-T*r)*R,i=(T*E-z*y)*R,x=(z*r-k*E)*R;const d=Math.hypot(o,i,x)||1,L=g(M,b),W=M/e,U=b/a,X=p.uvf?p.uvf(W,U):[W,U];c.push([o/d,i/d,x/d]),this.v(L[0],L[1],L[2],o/d,i/d,x/d,X[0],X[1],typeof m=="function"?m(W,U):m,f,u)}for(let b=0;b<a;b++)for(let M=0;M<e;M++){const s=h+b*(e+1)+M,l=s+1,q=s+e+1,S=q+1;R>0?this.i.push(s,l,S,s,S,q):this.i.push(s,S,l,s,q,S)}return{pts:A,nrm:c,nu:e,nv:a}}lathe(e,a,t,m,p,u,f={}){const h=m.length-1;return this.grid(p,h,(A,R)=>{const g=Math.round(R*h),c=-A*Math.PI*2,b=m[g][0]*(f.squash?f.squash(c,m[g][1]):1);return[e+Math.cos(c)*b,a+m[g][1],t+Math.sin(c)*b]},u,f)}build(){const e=new F.BufferGeometry;return e.setAttribute("position",new F.Float32BufferAttribute(this.p,3)),e.setAttribute("normal",new F.Float32BufferAttribute(this.n,3)),e.setAttribute("uv",new F.Float32BufferAttribute(this.t,2)),e.setAttribute("aCol",new F.Float32BufferAttribute(this.c,4)),e.setAttribute("aKind",new F.Float32BufferAttribute(this.k,1)),e.setIndex(this.i),e.computeBoundingSphere(),e}}const _={z0:24,z1:34,y0:2,y1:10,transom:8,post:.4,wallT:1.3,frameX:9.85},D=(n,e)=>[n[0]*e,n[1]*e,n[2]*e],he=(n,e,a)=>[n[0]+(e[0]-n[0])*a,n[1]+(e[1]-n[1])*a,n[2]+(e[2]-n[2])*a];function Le(n,e,a,t,m){const{z0:p,z1:u,y0:f,y1:h,wallT:A,frameX:R}=_,g=re,c=[1,1,1],b=m.wallZ0,M=m.wallZ1,s=9,l=9+A,q=(o,i,x,d,L)=>n.quad([s,x,o],[s,x,i],[s,d,i],[s,d,o],c,L,0,[o,x,i,x,i,d,o,d]);q(b,M,0,.44,g.tiles),q(b,M,.44,f,g.plaster),q(b,p,f,h,g.plaster),q(u,M,f,h,g.plaster),q(b,M,h,11,g.plaster),n.box(s-.03,.47,(b+M)/2,.06,.06,M-b,t.umber,{kind:g.wood,bevel:.02,melt:.3}),n.quad([s,f,p],[R,f,p],[R,h,p],[s,h,p],c,g.plaster),n.quad([R,f,u],[s,f,u],[s,h,u],[R,h,u],c,g.plaster),n.quad([s,h,p],[R,h,p],[R,h,u],[s,h,u],c,g.plaster),n.box((s+R)/2-.12,f-.06,(p+u)/2,R-s+.3,.12,u-p+.3,t.umber,{kind:g.wood,bevel:.035,melt:.6});const S=R+.1,z=t.frame,k={kind:g.wood,bevel:.07,melt:.65};for(const o of[p+.2,u-.2])n.box(S,(f+h)/2,o,.34,h-f,.4,z,k),n.box(S-.2,(f+h)/2,o+(o<29?.16:-.16),.1,h-f-.3,.1,D(z,1.15),k);n.box(S,h-.17,29,.34,.34,u-p,z,k),n.box(S,f+.11,29,.36,.22,u-p,z,k),n.box(S,_.transom+.18,29,.4,.36,u-p-.6,z,k),n.box(S-.22,_.transom+.3,29,.12,.1,u-p-.7,D(z,1.2),k),n.box(S,(_.transom+h)/2,29,.34,h-_.transom-.5,.34,z,k);for(const o of[p+.2,u-.2])for(const i of[2.9,5,7.1])n.box(S-.21,i,o+(o<29?.2:-.2),.09,.26,.09,t.black,{bevel:.03,melt:.4});const T=_.transom+.36,E=h-.34;for(const[o,i]of[[p+.4,29-.17],[29+.17,u-.4]])a.quad([S,T,o],[S,T,i],[S,E,i],[S,E,o],c,g.pane,0,[0,0,i-o,0,i-o,E-T,0,E-T]),n.box(S-.06,(T+E)/2,(o+i)/2,.05,.05,i-o,t.black,{bevel:.02,melt:.3});const r=t.brick,y=(o,i,x,d)=>e.quad([l,x,i],[l,x,o],[l,d,o],[l,d,i],r,g.brick,.3,[i,x,o,x,o,d,i,d]);y(b,M,m.outY0,f),y(b,p,f,h),y(u,M,f,h),y(b,M,h,11.6),e.box(l+.1,f-.14,29,.5,.28,u-p+.8,t.stone,{bevel:.05,melt:.4}),e.box(l+.06,h+.2,29,.3,.4,u-p+.8,t.stone,{bevel:.05,melt:.4}),e.quad([l,f,p],[S,f,p],[S,h,p],[l,h,p],t.white,0,.3),e.quad([S,f,u],[l,f,u],[l,h,u],[S,h,u],t.white,0,.3),e.quad([S,h,p],[l,h,p],[l,h,u],[S,h,u],t.white,0,.3);for(const[o,i]of[[p-2.4,1],[u+2.4,-1]]){e.box(l+.12,(f+_.transom)/2,o,.14,_.transom-f,4.4,t.green,{bevel:.04,melt:.4});for(let x=0;x<3;x++)e.box(l+.21,f+.8+x*2.2,o,.06,.18,4.2,D(t.black,1.4),{bevel:.02,melt:.2});for(let x=0;x<5;x++)e.box(l+.2,(f+_.transom)/2,o-1.76+x*.88,.03,_.transom-f-.2,.04,D(t.green,.7),{bevel:.01,melt:.2})}}function Re(n,e,a,t,m){const f=_.transom-.02,h=.24,A=.13,R=re,g={kind:R.wood,bevel:.055,melt:.65},c=y=>y*t;n.box(0,(2.24+f)/2,c(h/2+.03),A,f-2.24,h,a.frame,g),n.box(0,(2.24+f)/2,c(4.58-h/2),A,f-2.24,h,a.frame,g),n.box(0,2.24+h/2,c(4.58/2),A,h,4.58-.1,a.frame,g),n.box(0,f-h/2,c(4.58/2),A,h,4.58-.1,a.frame,g);const b=h+.03,M=4.58-h,s=2.24+h,l=f-h,q=D(a.black,2.1),S={bevel:.01,melt:.2},z=Math.round((M-b)/.42),k=Math.round((l-s)/.62),T=(M-b)/z,E=(l-s)/k;for(let y=1;y<z;y++)n.box((m()-.5)*.012,(s+l)/2,c(b+y*T),.024,l-s,.032,q,S);for(let y=1;y<k;y++)n.box((m()-.5)*.012,s+y*E,c((b+M)/2),.024,.032,M-b,q,S);for(const y of[s+(l-s)*.33,s+(l-s)*.67])n.box(-.06,y,c((b+M)/2),.045,.06,M-b+.1,a.black,S);n.box(-.1,2.24+2.3,c(4.58-.13),.07,.5,.09,a.black,{bevel:.03,melt:.3}),n.box(-.19,2.24+2.42,c(4.58-.13),.2,.07,.07,a.ochre,{bevel:.03,melt:.3});for(const y of[2.9,5,7.1])n.box(0,y,c(.3),A+.04,.12,.6,a.black,{bevel:.03,melt:.3});const r=[0,0,(M-b)*.42/T,0,(M-b)*.42/T,(l-s)*.62/E,0,(l-s)*.62/E];return e.quad([0,s,c(b)],[0,s,c(M)],[0,l,c(M)],[0,l,c(b)],[1,1,1],R.leaf,t<0?1:0,r),{tip:4.58,beadsAt:{ja:s,jb:l,ia:b,ib:M,cz:T,cy:E,nz:z,ny:k}}}async function Te(n,e,a,t,m,p){const u=re,f=2.3,h=[t()*6.28,t()*6.28,t()*6.28,t()*6.28],A=19.1+t()*.8,R=1.4+t()*.2,g=(w,v,P,B,O,I=1)=>m.push([w[0]+v[0]*.025,w[1]+v[1]*.025,w[2]+v[2]*.025,v[0],v[1],v[2],P[0],P[1],P[2],B[0],B[1],B[2],O,I]),c=()=>.045+.075*t()*t(),b={kind:u.wood,bevel:.09,melt:.8};e.box(5.25,f-.1,21,4.5,.2,12,a.umber,b),e.box(5.25,f-.42,21,3.9,.44,11.4,D(a.umber,.85),b);const M=[[.26,0],[.3,.1],[.24,.24],[.15,.34],[.14,.6],[.2,.72],[.31,.95],[.34,1.18],[.27,1.4],[.16,1.52],[.2,1.6],[.2,1.68]];for(const w of[3.5,7])for(const v of[15.6,26.4])e.lathe(w,0,v,M,14,a.umber,{kind:u.wood,melt:.7});await n.yield();for(const w of[3.5,7])e.box(w,.42,21,.2,.2,10.6,a.umber,b);e.box(5.25,.42,21,3.4,.16,.2,a.umber,b);const s=13,l=11.5,q=(w,v)=>{const P=S(w,v),B=14.93-P[2];if(B>0){const O=Math.min(B/.22,1)*Math.PI/2,I=Math.max(B-.22,0);P[2]=14.93-.14*Math.sin(O)-.05*I*(1+Math.sin(P[0]*3.1+h[1])),P[1]=Math.max(.07,P[1]-.14*(1-Math.cos(O))-I*1.25)}return P},S=(w,v)=>{const P=w*13,B=v*6.6;let O=s+P*(l/13);const I=A+.8*Math.sin(B*.55+h[0])-.1*B,K=O-I,N=K<0?.6:1.05,Y=R*(.8+.2*Math.sin(B*.9+h[1]))*Math.exp(-(K/N)*(K/N))*(1-.66*Math.exp(-(((B-3)/1.05)**2))),le=.42*Math.exp(-(((K-2.2)/.5)**2))*(.6+.4*Math.sin(B*1.3+h[2]))+.3*Math.exp(-(((K+1.7)/.4)**2))*(.5+.5*Math.sin(B*1.7+h[3])),ee=Y+le+.035*Math.sin(O*2.3+B*1.1+h[2])+.03;if(O-=.3*Y,B<4.25)return[7.35-B,f+.03+ee,O,ee];const V=B-4.25,C=Math.min(V/.32,1)*Math.PI/2,$=Math.min(V/1.5,1);let Z=3.1-.2*Math.sin(C)-ee*.55*Math.exp(-V*.3)-(.13*Math.sin(O*1.7+h[3])+.07*Math.sin(O*4.1+h[0]))*$-.1*$,Q=f+.03-.2*(1-Math.cos(C))-Math.max(V-.32,0)+ee*.5*Math.exp(-V*.9);return Q<.07&&(Z-=(.07-Q)*.9,Q=.07+.02*Math.sin(O*3)),[Z,Q,O,ee]},z=Math.round(140*p),k=Math.round(72*p);await n.yield();for(let w=0;w<10;w++)e.grid(Math.round(z/10),k,(v,P)=>q((w+v)/10,P),a.red,{kind:u.carpet,melt:.07,flip:!0,ext:!0,uvf:(v,P)=>[(w+v)/10*13,P*6.6]}),await n.yield();const T=(w,v)=>{const B=q(w,v),O=q(w+.004,v),I=q(w,v+.004),K=O[0]-B[0],N=O[1]-B[1],Y=O[2]-B[2],le=I[0]-B[0],ee=I[1]-B[1],V=I[2]-B[2];let C=-(N*V-Y*ee),$=-(Y*le-K*V),Z=-(K*ee-N*le);const Q=Math.hypot(C,$,Z)||1;return[B,[C/Q,$/Q,Z/Q]]},E=(w,v=0)=>{const P=w*6.6,B=(A+v+.8*Math.sin(P*.55+h[0])-.1*P-s)/l;let O=B,I=-1;for(let K=-12;K<=12;K++){const N=B+K*.004,Y=S(N,w)[3];Y>I&&(I=Y,O=N)}return O},r=()=>(t()+t()+t()+t()-2)*.87;for(const[w,v]of[[.1+t()*.05,0],[.56+t()*.03,0],[.63+t()*.025,0],[.69+t()*.02,0],[.25+t()*.04,0],[.4+t()*.05,2.2],[.53+t()*.03,2.2],[.61+t()*.02,2.2]]){const P=t()<.3;for(let B=0,O=Math.round((34+t()*14)*(.6+.4*p));B<O;B++){const I=w+r()*.022,[K,N]=T(E(I,v)+r()*.0035,I);K[3]>.18&&g(K,N,P&&t()<.6?a.lemon:a.white,a.red,.045+.05*t()*t())}}for(const[w,v,P]of[[1,.12+t()*.08,.2],[1,.36+t()*.06,.2],[1,.56+t()*.05,.2],[0,.5+t()*.1,-.06],[0,.2+t()*.1,-.06]])for(let B=0,O=Math.round((30+t()*8)*(.6+.4*p));B<O;B++){const I=q(w,Math.min(.63,Math.max(.01,v+r()*.03)));g([I[0],I[1]+(w?0:.05+.1*t()),I[2]+P*(.3+t())],w?[0,1,0]:[-.3,.3,-.9],a.white,w?a.white:a.red,.045+.04*t()*t())}await n.yield(),e.grid(Math.round(40*p),2,(w,v)=>{const P=q(1,w*4.2/6.6);return[P[0],P[1]-.02-v*.03,P[2]+v*(.3+.06*Math.sin(w*90))]},D(a.white,.96),{melt:.6,flip:!0}),e.grid(Math.round(40*p),2,(w,v)=>{const P=q(0,w*.64);return[P[0],Math.max(.03,P[1]-.05)+.02*(1-v),P[2]-.03-v*(.26+.07*Math.sin(w*83))]},D(a.white,.96),{melt:.6});const y=5.75,o=A+3.3,i=q((o-s)/l,1.6/6.6)[1],x=[[.02,0],[.2,0],[.215,.035],[.18,.09],[.2,.16],[.27,.27],[.325,.4],[.34,.5],[.315,.62],[.25,.73],[.17,.83],[.135,.93],[.13,1],[.15,1.06],[.165,1.085]],d=e.lathe(y,i,o,x,28,D(a.white,1.05),{melt:.3});e.lathe(y,i+1.085,o,[[.172,0],[.165,.035],[.11,.075],[.05,.1],[.035,.13],[.05,.155],[0,.17]],20,a.pewter,{melt:.7}),e.grid(14,8,(w,v)=>{const P=w*Math.PI,B=v*Math.PI*2,O=.036+.012*Math.sin(P),I=.2+.2*Math.sin(P),K=.98-.52*w-.03*Math.sin(P*2),N=Math.cos(B)*O,Y=Math.sin(B)*O*.8;return[y-(I+N*Math.sin(P))*.8-0,i+K+N*Math.cos(P)*.6,o-(I+N*Math.sin(P))*.6+Y]},a.white,{melt:.12});for(let w=0;w<80;w++){const v=t()*6.28;if(t()<.62)g([y+Math.cos(v)*.168,i+1.09,o+Math.sin(v)*.168],[Math.cos(v)*.5,.86,Math.sin(v)*.5],a.white,a.white,c()*.8);else{const B=Math.floor(t()*6),O=5+Math.floor(t()*5),I=O*29+(27+B)%28;g(d.pts[I],d.nrm[I],a.white,D(a.white,.9),c()*.8)}}await n.yield();const L=6.45,W=Math.min(o+1.75,24.6),U=q((W-s)/l,.9/6.6)[1]-.01,X=[[.02,.02],[.36,.02],[.4,.06],[.47,.2],[.55,.36],[.6,.46],[.63,.5],[.6,.53],[.55,.5]],J=(w,v)=>1+.022*Math.sin(w*22+Math.round(v*16)%2*3.14)*(v>.04&&v<.47?1:.2),H=e.lathe(L,U,W,X,88,(w,v)=>D(a.ochre,.82+.3*(Math.sin(w*22*6.28+Math.round(v*8)*3.14)>0?1:.55)*.5),{melt:.65,squash:J});for(let w=0;w<150;w++){const v=(6+Math.floor(t()*2))*89+Math.floor(t()*88),P=c(),B=t()<.55?a.lemon:a.white;g(H.pts[v],H.nrm[v],B,a.ochre,P)}const j=[[L-.12,U+.52,W-.14,.4,.22,.3,.5],[L+.2,U+.5,W+.2,.3,.2,.26,2.1],[L-.75,U+.14-0,W+.5,.26,.17,.2,1.2]];for(const[w,v,P,B,O,I,K]of j){const N=t()*6.28,Y=Math.cos(K),le=Math.sin(K),ee=e.grid(20,12,(V,C)=>{const $=V*Math.PI*2,Z=(C-.5)*Math.PI,Q=1+.09*Math.sin($*3+N)*Math.cos(Z*2)+.05*Math.sin($*7+Z*5+N),fe=Math.cos($)*Math.cos(Z)*B*Q,xe=Math.sin(Z)*O*(Z<0?.55:1)*Q,ve=Math.sin($)*Math.cos(Z)*I*Q;return[w+fe*Y-ve*le,v+xe,P+fe*le+ve*Y]},(V,C)=>he(a.crust,a.ochre,Math.max(0,Math.min(1,C*1.6-.5+.3*Math.sin(V*19+N)))),{melt:.75,flip:!0});for(let V=0;V<110;V++){const C=(5+Math.floor(t()*7))*21+Math.floor(t()*20),$=c(),Z=t()<.6?a.lemon:a.white;g(ee.pts[C],ee.nrm[C],Z,a.ochre,$*.9)}}return{carpet:q,jug:[y,i,o],basket:[L,U,W],ridgeZ:A,ridgeH:R}}function Ue(n,e,a,t,m){const h=a()*6.28,A=.9+a()*.8,R=.4+a()*.4,g=o=>{const i=Math.min(Math.max(o,0)/.25,1)*Math.PI/2;return[.16*Math.sin(i),.16*(1-Math.cos(i))+Math.max(o-.25,0)]},c=(o,i)=>{const x=g(o-3.4),d=g(i-1.62),L=o<3.4&&i<1.62?1:0;let W=6.4-Math.min(o,3.4)-x[0],U=25.4+Math.min(i,1.62)+d[0];const X=Math.min(o,i,.5)/.5,J=(o-A)*(o-A)+(i-R)*(i-R);let H=2.3+.025-Math.max(x[1],d[1])+L*X*(.05+.045*Math.sin(o*3.1+i*2.2+h)*Math.sin(i*4.3+h)+.24*Math.exp(-J/.22)+.1*Math.exp(-((o-i*1.3-1.4)**2)/.05));const j=Math.min(x[1]/.8,1),w=Math.min(d[1]/.8,1);return W-=(.09*Math.sin(U*5.2+h)+.05)*j,U+=(.09*Math.sin(W*5.2+h*2)+.05)*w,[W,H,U]},b=Math.round(46*m),M=Math.round(30*m),s=n.grid(b,M,(o,i)=>c(o*4.75,i*2.95),(o,i)=>D(e.ultra,1+.12*Math.sin(o*40+i*23)),{melt:.7}),l=(o,i)=>c(6.4-o,i-25.4),q=.058,S=[];for(let o=0;o<=5;o++){const i=(o/5-.5)*Math.PI;S.push([Math.cos(i)*q,Math.sin(i)*q+q])}const z=4.55+a()*.4,k=26.05+a()*.25,T=a()*6.28,E=Math.round(38*(.5+.5*m));for(let o=0;o<E;o++){const i=o/E*5.4+T,x=.42+.14*Math.sin(i*2+T),d=z+Math.cos(i)*x*1.25+(o/E-.5)*.5,L=k+Math.sin(i)*x*.72,W=l(d,L);n.lathe(W[0],W[1]-.01,W[2],S,8,he(e.white,e.shade,.18),{melt:.85}),t.push([W[0]+.035,W[1]+.085,W[2]-.01,.6,.75,-.1,...e.white,...e.white,.045+a()*.02,1])}const r=k-.55,y=a()*6.28;n.grid(Math.round(34*m),2,(o,i)=>{const x=.9+o*3.3,d=r-25.4+.35*Math.sin(o*5+y)+o*.3+(i-.5)*.16,L=c(x,d),W=.02+.06*Math.abs(Math.sin(o*9+y))*(x<3.4?1:.3);return[L[0]-(x>3.4?W:0),L[1]+(x<3.4?W:0),L[2]]},e.lemon,{melt:.5});for(let o=0,i=Math.round(60*m);o<i;o++){const x=Math.floor(a()*M*.5)*(b+1)+Math.floor(a()*b*.7),d=s.pts[x],L=s.nrm[x],W=.045+a()*.03;d[1]>2.3+.13&&t.push([d[0],d[1]+.02,d[2],L[0],L[1],L[2],...e.white,...e.ultra,W,1])}}async function je(n,e,a,t,m,p){const u=re,f=-11,h=(s,l,q,S,z,k,T,E,r,y)=>{const o=s-S/2,i=s+S/2,x=l-q/2,d=l+q/2,L=.35,W=E[1]>.7?u.object:u.brick;if(e.quad([o,f,d],[o,f,x],[o,z,x],[o,z,d],E,W,L,[d,f,x,f,x,z,d,z]),e.quad([o,f,x],[i,f,x],[i,z,x],[o,z,x],E,W,L,[o,f,i,f,i,z,o,z]),e.quad([i,f,d],[o,f,d],[o,z,d],[i,z,d],E,W,L,[i,f,o,f,o,z,i,z]),T){const U=Math.hypot(S/2,k-z);e.quad([o-.4,z-.3,d],[o-.4,z-.3,x],[s,k,x],[s,k,d],r,u.roof,L,[d,0,x,0,x,U,d,U]),e.quad([i,z,x],[i,z,d],[s,k,d],[s,k,x],r,u.roof,L,[x,0,d,0,d,U,x,U]),e.quad([o,z,x],[i,z,x],[s,k,x],[s,k,x],E,W,L),e.quad([i,z,d],[o,z,d],[s,k,d],[s,k,d],E,W,L)}else{const U=Math.hypot(q/2,k-z);if(e.quad([o,z,x],[i,z,x],[i,k,l],[o,k,l],r,u.roof,L,[o,0,i,0,i,U,o,U]),e.quad([i,z,d],[o,z,d],[o,k,l],[i,k,l],r,u.roof,L,[i,0,o,0,o,U,i,U]),y)for(let J=0;J<4;J++){const H=J/4,j=q*(1-H)+.6,w=z+(k-z)*H,v=z+(k-z)*(H+1/4)+.5;e.quad([o-.05,w,l+j/2],[o-.05,w,l-j/2],[o-.05,v,l-j/2],[o-.05,v,l+j/2],E,W,L,[l+j/2,w,l-j/2,w,l-j/2,v,l+j/2,v])}else e.quad([o,z,d],[o,z,x],[o,k,l],[o,k,l],E,W,L)}if(m()<.6){const U=l+(m()-.5)*q*.5;e.box(s+(T?.8:(m()-.5)*S*.5),k+.2,U,1.3,3.2,1.3,t.brick,{bevel:.1,melt:.3,kind:u.brick})}},A=[t.brick,D(t.brick,.8),he(t.brick,t.ochre,.5),D(t.white,.93),D(t.white,.86),he(t.brick,t.umber,.5)],R=[t.brick,t.brick,D(t.brick,1.1),he(t.brick,t.ochre,.3),t.slate,he(t.slate,t.umber,.3)],g=Math.round(150*p);for(let s=0;s<g;s++){const l=s%3,q=-70+s/g*340+(m()-.5)*5,S=7+m()*7,z=10+m()*6,k=3+l*4+m()*9,T=k+6+m()*9+l*3,E=157+l*17+m()*6,r=m()<.9?1:0,y=A[Math.floor(m()*A.length)],o=R[Math.floor(m()*R.length)],i=m()<.5;Math.abs(q-96)<9&&l===0||(h(E,q,r?S*2.4:S,z,k,r?k+(T-k)*.62:T,r,y,o,i),s%40===39&&await n.yield())}const c=(s,l,q,S)=>e.quad([150,f,l],[150,f,s],[150,q,s],[150,q,l],S,u.brick,.3,[l,f,s,f,s,q,l,q]);c(-70,60,-5.5,t.brick),c(130,270,-5,D(t.brick,.9)),c(60,90,-3,t.brick),c(102,130,-3,t.brick),e.box(153,-1.4,96,7,1.6,12.6,t.stone,{bevel:.25,melt:.4}),c(90,102,-.6,t.stone),h(156,74,26,11,6,19,1,t.brick,t.slate,!1),h(153.5,84,6,6,9,17,0,D(t.white,.9),t.brick,!0),h(157,116,16,12,8,17,1,t.brick,t.brick,!1);for(const s of[109,123])e.lathe(151.5,f,s,[[2.6,0],[2.6,17],[2.9,17.4],[2.9,18.4],[.3,27],[0,27.4]],10,(l,q)=>q>.55?t.slate:t.brick,{kind:u.object,melt:.4});e.box(170,3,96,2,28,17,t.lemon,{bevel:.2,melt:.3}),e.quad([168.9,3,99.5],[168.9,3,93],[168.9,11,93],[168.9,11,99.5],[1,1,1],u.pane,0,[0,0,6.5,0,6.5,8,0,8]);let b=f;const M=[[13,46],[11,20],[9,16],[6.5,12]];for(const[s,l]of M)e.box(215,b+l/2,150,s,l,s,t.stone,{bevel:.5,melt:.5}),e.box(215,b+l,150,s+1.2,1.2,s+1.2,D(t.stone,.9),{bevel:.3,melt:.5}),b+=l;e.lathe(215,b,150,[[3.4,0],[3,4],[1.2,12],[.25,16.5],[0,17]],8,t.slate,{melt:.5});for(const[s,l]of[[-5,-5],[5,-5],[-5,5],[5,5]])e.lathe(215+s,f+46,150+l,[[1.2,0],[1.1,5],[0,10]],6,t.stone,{melt:.5});a.quad([10.3,-10,-90],[10.3,-10,150],[31,-10,150],[31,-10,-90],t.sand,u.sand,0),a.quad([31,-10,-90],[31,-10,150],[37,-11.3,150],[37,-11.3,-90],t.sand,u.sand,0)}const te=[9,0,29],Oe=n=>[n[2]-te[2],n[1]-te[1],te[0]-n[0]],Ke=n=>[te[0]-n[2],n[1]+te[1],n[0]+te[2]];async function De(n,e={}){const a=n.rng,t=Math.min(1,Math.max(.6,e.detail??1)),m=ye(),p=e.palette&&e.palette.length>=7?e.palette:ae;[m.uWhite,m.uLemon,m.uUltra,m.uShade,m.uRed,m.uSky,m.uBlack].forEach((H,j)=>H.value.copy(oe(p[j])));const u={white:G(p[0]),lemon:G(p[1]),ultra:G(p[2]),shade:G(p[3]),red:G(p[4]),sky:G(p[5]),black:G(p[6]),umber:G(ne.umber),ochre:G(ne.ochre),green:G(ne.green),brick:G(ne.tile),sand:G(ne.sand),slate:G(ne.slate),frame:[.2,.165,.14],pewter:G("#9BA3A6"),crust:G("#8A5A2C"),stone:G("#BDB7A6")},f=e.weather??(a()<.6?"cloud":a()<.6?"rain":"pearl");be(m,f==="rain"?{stripLo:.9,stripHi:.975,indoorFloor:.56}:f==="pearl"?{stripLo:.92,stripHi:.99,indoorFloor:.74}:{stripLo:.86,stripHi:.97,indoorFloor:.6}),be(m,{golden:e.golden??(a()<.15?.6:0),exposure:e.exposure??1,flat:e.flat??!1});const h=new F.Group;h.name="light-from-the-left-hero";const A=new F.Group;A.rotation.y=Math.PI/2,A.position.set(-te[2],-te[1],te[0]),h.add(A);const R=Ae(m),g=we(m),c=ue(m),b=ue(m,{leaf:!0}),M=Fe(m),s=[],l=new se,q=new se,S=new se,z=e.wallZ0??18,k=e.wallZ1??40;if(Le(l,q,S,u,{wallZ0:z,wallZ1:k,outY0:e.outY0??-10}),e.floor!==!1){const H=e.floorZ0??12,j=e.floorZ1??42;l.quad([-9,0,H],[-9,0,j],[9,0,j],[9,0,H],[1,1,1],re.floor)}await n.yield();let T=null;e.table!==!1&&(T=await Te(n,l,u,a,s,t),await n.yield(),Ue(l,u,a,s,t),await n.yield());const E=(H,j,w=A)=>{const v=new F.Mesh(H.build(),j);return v.frustumCulled=!1,w.add(v),v},r=E(l,R);E(q,g),E(S,c),await n.yield();const y=[],o=n.core.makeRng(n.core.hashSeed("leafPhase:"+n.seed));for(const[H,j,w]of[[_.z0+.4,1,-(98+a()*8)*Math.PI/180],[_.z1-.4,-1,(70+a()*10)*Math.PI/180]]){const v=new F.Group;v.position.set(_.frameX-.14,0,H),v.rotation.y=w,A.add(v);const P=new se,B=new se;Re(P,B,u,j,a),E(P,R,v);const O=E(B,b,v);O.renderOrder=5,y.push({piv:v,open:w,dir:j,ph:a()*6.28,ph2:o()*6.28})}await n.yield();let i=null;if(e.vista!==!1){const H=new se,j=new se,w=new se;await je(n,H,j,u,a,t),await n.yield();const v=E(H,g);E(j,g);const P=new F.Mesh(v.geometry,g);P.scale.y=-1,P.position.y=-22,P.frustumCulled=!1,A.add(P),w.quad([36,-11,-400],[36,-11,600],[420,-11,600],[420,-11,-400],[1,1,1],re.water);const B=E(w,we(m,{water:!0}));B.renderOrder=3,await n.yield()}(e.sky??e.vista!==!1)&&(i=new F.Mesh(new F.SphereGeometry(2600,24,12),Be(m)),i.renderOrder=-1,i.frustumCulled=!1,h.add(i));const x=Ee(s,M);A.add(x);const d=(H,j,w)=>new F.Vector3(...Oe([H,j,w])),L={placement:{position:new F.Vector3(...te),rotationY:-Math.PI/2},gap:d(9.9,4.8,29),gapOut:new F.Vector3(0,0,-1),flyThrough:[d(-2,3.3,0),d(1.5,3.3,14),d(1.5,3.3,20),d(4.6,4,23.8),d(9.9,4.8,29),d(20,2.5,35.5),d(45,-7,49),d(69,-7,61),d(150,-6.5,96)],portalSeat:{position:d(150,-6.5,96),facing:new F.Vector3(-.4384,0,.8988)},viewpoints:{first:d(-2,3.3,0),reveal:d(.8,3.3,11),closest:d(1.5,3.3,19),threshold:d(8,4.6,27.8)},carpetRidge:T?d(5.2,2.3+T.ridgeH,T.ridgeZ):null,jug:T?d(...T.jug):null,basket:T?d(...T.basket):null,leafHinges:[d(_.frameX-.14,5,_.z0+.4),d(_.frameX-.14,5,_.z1-.4)]},W=null;let U=-1;const X=new F.Vector2;return{object:h,room:A,radius:W?W.radius:9,height:W?.5:11,center:W?W.center:new F.Vector3(0,4.6,2.5),anchors:L,ground:!1,groundY:0,weather:f,materials:{room:R,outdoor:g,pane:c,leaf:b,bead:M},uniforms:m,setProgress(H){U=H},update(H,j,w){if(We(m,w,A,j),n.renderer){n.renderer.getDrawingBufferSize(X);const v=Math.max(w.projectionMatrix.elements[5],.1);m.uPxLo.value=2/(v*Math.max(X.y,100)),m.uPx.value=2/(v*Math.max(X.y,720))}i&&(i.position.setFromMatrixPosition(w.matrixWorld),h.worldToLocal(i.position)),m.uCloud.value=U>=0?570*U:j*6.6;for(const v of y)v.piv.rotation.y=v.open+(v.dir<0?.07:.025)*Math.sin(j*.5+v.ph)+.02*Math.sin(j*1.3+v.ph*2)+(v.dir<0?.1:.02)*Math.sin(j*.9+v.ph2)},dispose(){}}}export{se as Geo,re as KIND,ne as MIXES,ae as PALETTE,ie as STYLE_GLSL,de as STYLE_VERT,Fe as beadMaterial,De as buildHero,G as disp,ue as glassMaterial,Ke as localToRoom,Ee as makeBeads,ye as makeStyleUniforms,we as outdoorMaterial,Ae as roomMaterial,Oe as roomToLocal,be as setStyle,Be as skyMaterial,We as updateStyle};
