import*as n from"three";const Ze=["#0F5FB4","#1FA88A","#F2C62E","#D4581C","#C9CCD1","#FFE9C4","#1B222E"],ve=24,Qe=`
float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3. - 2.*f);
  return mix(mix(hash12(i), hash12(i + vec2(1., 0.)), u.x), mix(hash12(i + vec2(0., 1.)), hash12(i + vec2(1., 1.)), u.x), u.y); }
float fbm2(vec2 p){ return vnoise(p)*.6667 + vnoise(p*2.07 + 17.13)*.3333; }
float fbm3(vec2 p){ return vnoise(p)*.5714 + vnoise(p*2.07 + 17.13)*.2857 + vnoise(p*4.19 + 41.7)*.1429; }
float fbm4(vec2 p){ return vnoise(p)*.5333 + vnoise(p*2.07 + 17.13)*.2667 + vnoise(p*4.19 + 41.7)*.1333 + vnoise(p*8.31 + 7.9)*.0667; }
// band-limited noise: an octave whose lattice cell (cell, metres) shrinks under about three pixels (px = metres per pixel) is
// replaced by its mean, so nothing in the ground turns into per-pixel speckle from the air
float bnz(vec2 q, float cell, float px){ return mix(0.5, vnoise(q), 1. - smoothstep(cell*0.2, cell*0.45, px)); }
float fbm2b(vec2 q, float cell, float px){ return bnz(q, cell, px)*.6667 + bnz(q*2.07 + 17.13, cell/2.07, px)*.3333; }
float fbm3b(vec2 q, float cell, float px){ return bnz(q, cell, px)*.5714 + bnz(q*2.07 + 17.13, cell/2.07, px)*.2857 + bnz(q*4.19 + 41.7, cell/4.19, px)*.1429; }
// tone of the meadow floor (a multiplier on the meadow colour): tussock mottling, darker sedge hollows, thatch up close.
// The world's grass tufts take the same tone at their feet, so ground and tufts read as one carpet.
vec3 meadowTone(vec2 p, float px){
  float t = 0.65 + 0.5*fbm3b(p*0.25 + 77., 4., px) + 0.25*(bnz(p*vec2(5., 1.7), 0.2, px) - 0.5);
  t += 0.22*(bnz(p*vec2(21., 6.3) + 3., 0.048, px) + bnz(p*vec2(6.7, 24.) + 11., 0.042, px) - 1.);
  t *= 0.84;                                    // the floor of a meadow lies in the shade of its own blades
  return mix(vec3(t), t*vec3(0.74, 0.66, 0.58), smoothstep(0.52, 0.72, fbm3(p*0.035 + 19.))*0.65);
}
`,K=`
uniform float uTime;
uniform vec4 uRiver;
uniform vec3 uSunDir, uSunCol, uSkyCol, uZenith, uHorizon;
uniform vec2 uSunXZ;
uniform float uShadowY, uShadowLen, uNight;
uniform vec4 uSeed, uRingA, uRingB, uGey;
uniform vec2 uWind;
uniform vec4 uCast[${ve}];
${Qe}
// warped radius of the Eye (metres) and the radial "flame" field of its skirt
float eyeD(vec2 p, out float tend){
  float r = length(p);
  float k = smoothstep(6., 60., r);
  float n1 = fbm3(p*0.021 + uSeed.xy) - 0.5;
  float n2 = fbm2(p*0.085 + uSeed.zw) - 0.5;
  vec2 dir = p / max(r, 1e-3);
  tend = fbm3(dir*(13. + r*0.035) + uSeed.yx*3.);
  return r + n1*15.*k + n2*5.*k*k;
}
// soft shadows of thin vertical casters (snags, animals): sun-aligned capsule test
float castShadow(vec2 p, float px){
  vec2 pr = vec2(-uSunXZ.y, uSunXZ.x);
  float sh = 0.;
  for (int i = 0; i < ${ve}; i++){
    vec4 c = uCast[i];
    vec2 q = p - c.xy;
    float s = -dot(q, uSunXZ), t = abs(dot(q, pr));
    // a pole's shadow is sharp at its foot and gone into its own penumbra within some forty metres (never a ruled scratch)
    float L = max(min(c.z*uShadowLen, 26. + c.z*2.4), 0.02), w = max(c.w, 0.02);
    float blur = 0.2 + max(s, 0.)*0.034 + px*0.9;
    float m = (1. - smoothstep(max(w - blur, 0.), w + blur, t)) * (2.*w/(2.*w + blur));
    m *= smoothstep(-w, w, s) * (1. - smoothstep(L*0.8, L, s));
    sh = max(sh, m);
  }
  return sh;
}
// the jet's own long shadow (keyed to the current jet height)
float geyShadow(vec2 p){
  vec2 q = p - uGey.xy;
  float s = -dot(q, uSunXZ), t = dot(q, vec2(-uSunXZ.y, uSunXZ.x));
  float H = max(uGey.z, 0.5), h = s/max(uShadowLen, 0.01);
  float v = clamp(h/H, 0., 1.4);
  float wob = fbm2(vec2(s*0.014 - uTime*0.06, t*0.04 + 3.)) - 0.5;
  float w = 1.6 + 5.5*v + 8.*smoothstep(0.55, 1.1, v);
  float m = 1. - smoothstep(w*0.45, w*1.5 + 1.2 + max(s, 0.)*0.012, abs(t + wob*w*1.6));
  m *= smoothstep(0., 4., s) * (1. - smoothstep(0.85, 1.3, v));
  return m*(0.7 + 0.25*fbm2(vec2(s*0.05 - uTime*0.35, t*0.2)));
}
float sunGate(float y){ return smoothstep(uShadowY - 0.7, uShadowY + 0.7, y); }
// 0..1: how nearly the line of sight through pv (view space) passes through the heart of the jet (y: local height of the vapour)
float jetThick(vec3 pv, float y){
  float H = max(uGey.z, 0.3), v = clamp(y/H, 0., 1.5), k = sqrt(clamp(H/60., 0.01, 1.3)), ln = min(v*v, 1.6)*2.2*k;
  vec3 g = (viewMatrix*vec4(uGey.x + uWind.x*ln, y, uGey.y + uWind.y*ln, 1.)).xyz;
  vec3 c = cross(normalize(pv), (viewMatrix*vec4(0., 1., 0., 0.)).xyz);
  float d = abs(dot(g, c))/max(length(c), 1e-3), R = (2.5 + 6.*v)*k;
  return (1. - smoothstep(R*0.8, R*1.9, d))*smoothstep(0.03, 0.5, uGey.w)*(1. - smoothstep(H*1.05, H*1.4, y));
}
// signed distance (m, negative inside) to the world's river: centre x = uRiver.x + s*s/(s + uRiver.z), s = max(0, uRiver.y - z)
float riverD(vec2 p){
  float s = max(uRiver.y - p.y, 0.), q = s + uRiver.z;
  float xc = uRiver.x + s*s/q, dx = (s*s + 2.*s*uRiver.z)/(q*q);
  return abs(p.x - xc)/sqrt(1. + dx*dx) - uRiver.w;
}
// Sinter flats from the air: low stepped terraces. A riser that faces the low sun is a bright line, one that faces away is a
// dark line with its shadow on the tread below, and water stands behind every lip. Returns (multiplier on the sunlit colour,
// pond 0..1, lip line 0..1, position across the tread 0..1). Lines are never under 1.6 pixels and fade out before they merge.
vec4 terraces(vec2 p, float px){
  vec2 q = p*0.035 + 7.3;
  float h0 = fbm3(q), hx = fbm3(q + vec2(0.035, 0.)), hz = fbm3(q + vec2(0., 0.035));
  vec2 g = vec2(hx - h0, hz - h0);
  float gl = max(length(g), 1e-5), f = fract(h0*6.5);
  float w0 = 1.6*px*gl*6.5, w = clamp(w0, 0.03, 0.5), amp = 1. - smoothstep(0.2, 0.5, w0);
  float line = (1. - smoothstep(w*0.5, w, min(f, 1. - f)))*amp;
  float facing = dot(-g/gl, uSunXZ)*clamp(1.4 - 2.5*uSunDir.y, 0.3, 1.);
  float shadow = smoothstep(0.8 - w, 1. - w, f)*max(-facing, 0.)*amp;
  float pond = (1. - smoothstep(0.06, 0.3, f))*smoothstep(0., w, f)*amp;
  return vec4(1. + 0.55*line*max(facing, 0.) - 0.5*shadow - 0.25*line*max(-facing, 0.), pond, line, f);
}
// The Eye's overflow creek: an arc of braided strands that leaves the pool at its south-west rim and swings out round the south
// side toward the runoff fan (uCreek: centre x, z, radius, strength). Returns (metres along it, metres across it, how much of it is here)
uniform vec4 uCreek;
vec3 creekST(vec2 p){
  vec2 q = p - uCreek.xy;
  float r = length(q), phi = atan(q.x, max(q.y, 1e-3));
  float k = smoothstep(-1.36, -1.22, phi)*(1. - smoothstep(0.12, 0.42, phi))*step(1., q.y)*uCreek.w;
  return vec3(phi*uCreek.z, r - uCreek.z, k);
}
`,$e=`
vec2 braid(float v1, float v2){
  float a1 = abs(v1 - 0.5), a2 = abs(v2 - 0.5);
  float f1 = max(fwidth(v1), 1e-5), f2 = max(fwidth(v2), 1e-5);
  float o1 = max(0.07, 1.7*f1), o2 = max(0.05, 1.7*f2);
  float k2 = 0.8*(1. - smoothstep(0.14, 0.32, f2));
  float ch = max((1. - smoothstep(max(0.015, 0.5*f1), o1, a1))*clamp(0.12/o1, 0.45, 1.), (1. - smoothstep(max(0.0075, 0.5*f2), o2, a2))*clamp(0.09/o2, 0.45, 1.)*k2);
  float halo = max(1. - smoothstep(0.04, 0.18, a1), (1. - smoothstep(0.025, 0.13, a2))*k2);
  return vec2(ch, halo);
}
`;function O(h){return new n.Color(h)}function Xe(h,d,t){const F=Math.min(1,Math.max(0,(t-h)/(d-h)));return F*F*(3-2*F)}function mt(h){return new n.Vector3(h.r,h.g,h.b)}function pe(h,d,t){return h.clone().lerp(d,t)}const Je=`
varying vec3 vP, vW;
uniform vec3 uCSinter, uCYel, uCOra, uCRust, uCMeadow, uCFrost, uCDark, uCMoss;
uniform vec3 uFan;
uniform vec4 uHoof;
uniform float uFrost, uHaze, uSteamK, uEdge;
#include <fog_pars_fragment>
${K}
${$e}
void main(){
  vec2 p = vP.xz;
  vec2 dpx = dFdx(p), dpy = dFdy(p);
  float px = max(length(dpx), length(dpy));
  float tend0; float d = eyeD(p, tend0);
  if (d < 40.) discard;
  float rr = length(p); vec2 dirp = p/max(rr, 1e-3);
  // the skirt's flame field, band-limited. Its lookup slides with the radius and wanders with a slow warp, so the tongues of
  // mat are short curling lobes a few metres wide, never rays drawn out from the vent
  vec2 sw = vec2(fbm2(p*0.045 + 3.), fbm2(p*0.045 + 37.)) - 0.5;
  float tfq = 13. + rr*0.035;
  float tend = 0.6*fbm3b(dirp*tfq + sw*1.6 + vec2(rr*0.17, -rr*0.11) + uSeed.yx*3., rr/tfq, px) + 0.4*fbm2b(dirp*tfq*1.5 + sw*2.6 - vec2(rr*0.14, rr*0.21) + 9., rr/(tfq*1.5), px);
  tend = clamp(0.5 + (tend - 0.5)*1.35, 0., 1.);
  vec2 gq = p - uGey.xy; float gd = length(gq);
  float a = dot(p, uFan.xy), c = dot(p, vec2(-uFan.y, uFan.x));
  float nA = fbm3(p*0.013 + uSeed.zw*1.7);
  float nB = vnoise(p*0.07 + 9.);
  // footprint: spring apron + geyser apron + runoff fan, ragged edge, fades to nothing
  float sFan = max(max(abs(c) - (12. + max(a, 0.)*0.24), a - 205.), -a);
  float sR = min(min(d - 116., gd - 46.), sFan) + (nA - 0.5)*30. + (nB - 0.5)*10.;
  float alpha = 1. - smoothstep(20., 38., sR);
  float rvd = uRiver.w > 0. ? riverD(p) : 99.;
  alpha *= smoothstep(-0.6, 2.4, rvd);
  if (alpha < 0.004) discard;
  // every detail term is faded out before its feature is smaller than about three pixels: from 100 m up a pixel is 0.3 m
  float mid = 1. - smoothstep(0.6, 3.0, px);
  float rel = 1. - smoothstep(0.07, 0.22, px);           // relief shading only where the relief itself is resolved
  float n1 = fbm3(p*0.06 + 3.1);
  float n2 = fbm3b(p*0.33 + 11., 3.03, px);
  float n3 = bnz(p*2.6, 0.385, px);
  // sinter: pale crust, low stepped terracettes, cool damp hollows
  float st = n1*2.75, stf = fract(st), fst = fwidth(st);
  float T0 = floor(st) + smoothstep(0.7, 1., stf);
  float stx = fbm3((p + vec2(0.5, 0.))*0.06 + 3.1)*2.75, stz = fbm3((p + vec2(0., 0.5))*0.06 + 3.1)*2.75;
  vec2 gT = (vec2(floor(stx) + smoothstep(0.7, 1., fract(stx)), floor(stz) + smoothstep(0.7, 1., fract(stz))) - T0)*(0.07/0.5);
  float wst = max(0.1, 2.5*fst);
  float tline = smoothstep(1. - wst, 1. - wst*0.35, stf)*(1. - smoothstep(1. - clamp(fst, 0.002, 0.3), 1., stf))*(0.1/wst)*(1. - smoothstep(0.12, 0.3, fst));
  float H = (n3 - 0.5)*0.008 + (n2 - 0.5)*0.03;
  vec3 colr = uCSinter*(0.64 + 0.32*n1 + 0.10*(n2 - 0.5)*mid);
  colr = mix(colr, colr*vec3(0.78, 0.87, 1.0), (1. - smoothstep(0.22, 0.5, n1))*0.8);
  colr *= 1. - 0.22*tline*mid;
  vec4 ter = terraces(p, px);
  colr = mix(colr, colr*vec3(0.6, 0.73, 0.94), ter.y*0.6);
  // bacterial mats: yellow shelf, orange, rust skirt with flame tendrils
  float tfl = smoothstep(0.28, 0.80, tend);
  float lobe = fbm2(dirp*2.6 + uSeed.zw*0.7 + rr*0.004);
  float m = d - ((lobe - 0.45)*30. + (tfl - 0.35)*(7. + 15.*lobe))*smoothstep(52., 76., d);
  float e1 = (bnz(p*0.45 + 5., 2.2, px) - 0.5)*2.6 + (n2 - 0.5)*4.;
  float wY = 1. - smoothstep(uRingA.w - 0.5, uRingA.w + 4., d + e1);
  float wO = 1. - smoothstep(uRingB.x - 4., uRingB.x + 6., m + e1*1.5);
  float wR = 1. - smoothstep(uRingB.y - 14., uRingB.y + 10., m + e1*2. + (n1 - 0.5)*16.);
  float ffq = 31. + rr*0.06;
  float fil = fbm2b(dirp*ffq + sw*3. + vec2(rr*0.2, -rr*0.13) + 7., rr/ffq, px);
  vec3 rust = mix(uCRust*0.62, uCRust*1.15, n2);
  rust = mix(rust, uCOra*0.9, smoothstep(0.5, 0.85, fil)*0.55);
  rust = mix(rust, uCDark*1.6 + uCRust*0.2, (1. - smoothstep(0.3, 0.62, fil))*0.35*n1);
  vec3 ora = mix(uCOra, mix(uCOra, uCYel, 0.45), smoothstep(0.35, 0.8, fil)*0.6)*(0.9 + 0.2*n2);
  vec3 yel = uCYel*(0.92 + 0.16*n2);
  float matA = max(wR*(0.8 + 0.2*n2), max(wO, wY));
  colr = mix(colr, rust, wR*(0.82 + 0.18*n2));
  colr = mix(colr, ora, wO);
  colr = mix(colr, yel, wY);
  float streak = smoothstep(0.60, 0.88, tend)*(1. - smoothstep(86., 138., d))*(1. - wR);
  colr = mix(colr, mix(uCRust, uCOra, 0.4), streak*0.3);
  H += matA*0.03 + wR*n2*0.03;
  // rimstone scallops on the shelf and the inner skirt: concentric lips whose spacing doubles with distance (two levels
  // cross-faded), so a lip is always at least 2.5 pixels wide and the lips at least 7 pixels apart
  float tz = smoothstep(44., 49., d)*(1. - smoothstep(58., 70., m));
  float sc0 = d*0.55 + vnoise(p*0.33 + 2.)*3.0 + bnz(p*0.9, 1.1, px)*1.2;
  float fsc = max(px*0.9, 1e-4);
  float lvl = clamp(log2(fsc*7.), 0., 5.), l0 = floor(lvl), lf = lvl - l0;
  float ka = exp2(-l0), kb = ka*0.5, fa = fsc*ka, fb = fsc*kb;
  float da = abs(fract(sc0*ka - 0.35) - 0.5), db = abs(fract(sc0*kb - 0.35) - 0.5);
  float ha = max(0.085, 1.25*fa), hb = max(0.085, 1.25*fb);
  float lipA = 1. - smoothstep(ha - fa*0.75, ha + fa*0.75, da), lipB = 1. - smoothstep(hb - fb*0.75, hb + fb*0.75, db);
  float dkA = (1. - smoothstep(ha, ha + 0.16, da))*(1. - lipA), dkB = (1. - smoothstep(hb, hb + 0.16, db))*(1. - lipB);
  float far5 = 1. - smoothstep(4.4, 5., lvl);
  float lip = mix(lipA, lipB, lf)*tz*far5, lipDk = mix(dkA, dkB, lf)*tz*far5;
  H += lip*0.05;
  colr = mix(colr, colr*1.22 + 0.05, lip*mix(0.8, 0.4, rel));
  colr *= 1. - 0.14*lipDk;
  // braided rivulets fanning away, and fine drainage threads all round the skirt. Channels are drawn as the distance to an
  // isoline measured in pixels: never thinner than 2.5 pixels, losing contrast instead of breaking into dashes
  float fang = atan(c, abs(a) + 1e-3);
  float fanW = uFan.z*(0.8 + 0.45*nA);
  float fanM = (1. - smoothstep(fanW*0.8, fanW*1.5, abs(fang)))*smoothstep(0., 20., a)*smoothstep(52., 80., d)*(1. - smoothstep(198., 232., a));
  vec2 bq = vec2(rr*0.13, fang*34.);
  vec2 bw = vec2(fbm2(p*0.035 + 21.), fbm2(p*0.035 + 57.)) - 0.5;
  vec2 brF = braid(vnoise(bq + bw*3.2 + uSeed.xy), vnoise(bq*vec2(2.1, 2.6) + bw*4.5 + uSeed.zw + 13.));
  // the same strands drain the skirt all the way round, in the sectors where the ground falls away (a lookup on the direction
  // circle that slides with the radius: no seam and no straight rays)
  vec2 rq = dirp*21. + vec2(rr*0.085, -rr*0.055) + bw*5. + uSeed.xy;
  vec2 brA = braid(vnoise(rq), vnoise(rq*2.3 + bw*3.5 + 13.));
  float allM = smoothstep(58., 84., d)*(1. - smoothstep(150., 215., d))*smoothstep(0.4, 0.62, fbm2(dirp*2.1 + uSeed.xy + 5.))*(1. - fanM)*0.9;
  // and the overflow creek: three strands weaving down one stained bed
  vec3 ck = creekST(p);
  float cS = ck.x, cT = ck.y, cw = max(0.32, 1.6*px), creekCh = 0., creekE = 9.;
  for (int i = 0; i < 3; i++){
    float fi = float(i), mainK = step(fi, 0.5);
    float ti = (2.7*sin(cS*0.15 + fi*2.1 + uSeed.x) + 1.1*sin(cS*0.43 + fi*4.3) + (vnoise(vec2(cS*0.3, fi*7.3 + 2.)) - 0.5)*2.2)*mix(1., 0.5, mainK);
    float ce = abs(cT - ti);
    creekCh = max(creekCh, (1. - smoothstep(cw*0.55, cw*1.3, ce))*(1. - mainK));
    if (i == 0) creekE = ce - (1.5 + 0.6*sin(cS*0.07 + 2.) + (n2 - 0.5)*0.5);
  }
  creekCh *= clamp(0.45/cw, 0.4, 1.)*ck.z;
  float creekW = (1. - smoothstep(-0.2, 0.15 + px, creekE))*ck.z;     // the main channel: two to four metres of clear hot water
  float creekH = (1. - smoothstep(3.2, 7.5, abs(cT) + (n2 - 0.5)*2.5))*ck.z;
  float halo = max(max(brF.y*fanM, brA.y*allM), creekH);
  float haloM = halo, chM = max(max(brF.x*fanM, brA.x*allM), creekCh);
  // green margins where the creek's bed cools
  colr = mix(colr, uCMoss*(0.7 + 0.5*n2), ck.z*smoothstep(3., 5.5, abs(cT) + (n2 - 0.5)*2.)*(1. - smoothstep(6.5, 10., abs(cT) + (n2 - 0.5)*3.))*0.75*(1. - uNight*0.5));
  colr = mix(colr, mix(uCRust*1.1, uCOra, halo), haloM*0.85);
  float flow = mix(bnz(vec2(rr*0.9 - uTime*1.4, fang*rr*0.5), 1.1, px), bnz(vec2(cS*0.9 + uTime*1.6, cT*1.2), 1.1, px), creekH);
  vec3 film = mix(uCYel, vec3(0.85, 0.88, 0.8), 0.18 + 0.22*flow);
  colr = mix(colr, film, chM*0.9);
  vec3 cwat = mix(vec3(0.34, 0.74, 0.70), vec3(0.05, 0.40, 0.62), smoothstep(0.1, 0.9, clamp(-creekE/1.6, 0., 1.)))*(0.85 + 0.3*flow);
  colr = mix(colr, vec3(0.95, 0.88, 0.66), smoothstep(-0.3, 0., creekE)*(1. - smoothstep(0.1, 0.7, creekE))*ck.z*0.85);   // a cream lip of fresh sinter along the water
  colr = mix(colr, cwat, creekW*0.94);
  float af = abs(fil - 0.5), ff = max(fwidth(fil), 1e-5), ot = max(0.05, 1.7*ff);
  float tch = (1. - smoothstep(max(0.01, 0.5*ff), ot, af))*clamp(0.08/ot, 0.35, 1.)*(1. - smoothstep(0.10, 0.26, ff))*smoothstep(50., 58., d)*(1. - smoothstep(92., 120., m));
  colr = mix(colr, mix(uCYel, uCOra, 0.35), tch*0.4);
  H -= chM*0.05 + tch*0.03;
  float wet = max(max(chM, creekW*0.55), tch*0.7);
  wet = max(wet, wY*0.3 + lip*0.4*(0.5 + 0.5*sin(uTime*1.7 + sc0*6.)));
  // the geyser's apron: wet where the curtain falls, stained by its own runoff
  vec2 gdir = gq/max(gd, 1e-3);
  float gfq = 10. + gd*0.05;
  float gst = fbm2b(gdir*gfq + sw*2. + vec2(gd*0.09, -gd*0.05) + 31., gd/gfq, px);
  float gdw = length(gq - uWind*4.);
  float gwet = (1. - smoothstep(10., 34., gdw))*(0.25 + 0.75*uGey.w);
  float gmat = 1. - smoothstep(14., 40., gd + (gst - 0.5)*18.);
  colr = mix(colr, mix(uCRust, uCOra, gst)*0.9, gmat*smoothstep(0.45, 0.8, gst)*0.7);
  colr *= 1. - 0.35*gwet*(0.6 + 0.4*n2);
  wet = max(wet, gwet*0.8);
  // the apron's outer terraces are painted here (the cone mesh fades out by 14 m): stepped geyserite lips that break up into
  // the mats over the last eight metres, so the cone never sits on a disc
  float ap = 1. - smoothstep(12., 23., gd + (gst - 0.5)*10. + (n2 - 0.5)*5.);
  float at0 = gd*0.8 + vnoise(gq*0.19 + 5.)*2.6 + bnz(gq*0.8 + 2., 1.25, px)*0.9;
  float fat = max(fwidth(at0), 1e-4), ae = abs(fract(at0) - 0.5), aw = max(0.09, 1.3*fat);
  float alip = (1. - smoothstep(aw - fat*0.75, aw + fat*0.75, ae))*(1. - smoothstep(0.22, 0.5, fat));
  vec3 apc = uCSinter*(0.66 + 0.24*gst + 0.14*(n2 - 0.5)*mid);
  apc = mix(apc, mix(uCRust, uCOra, gst)*0.9, smoothstep(0.5, 0.8, gst)*0.55);
  apc *= 1. - 0.3*gwet*(0.6 + 0.4*n2);
  colr = mix(colr, apc, ap*0.92);
  colr = mix(colr, colr*1.25 + 0.04, alip*ap*0.65);
  colr *= 1. - 0.16*ap*(1. - alip)*(1. - smoothstep(aw, aw + 0.22, ae));
  H += alip*ap*0.045;
  float bankW = 1. - smoothstep(1.5, 9., rvd);
  colr = mix(colr, mix(uCRust*0.7, uCDark*1.4 + uCRust*0.25, n2), bankW*0.3);
  wet = max(wet, bankW*0.7);
  // ---- close range. The breakout flies 6 to 20 m above the fan, where a pixel is 3 to 15 cm of ground: rimstone dams stepping
  // across the flow, rust filaments streaming down it, moss on the cool edge of every rivulet, sinter nodules with their own
  // little shadows. Every term is gated by the pixel footprint (no screen derivatives in here), so none of it reaches the air
  float near = 1. - smoothstep(0.09, 0.30, px), near2 = 1. - smoothstep(0.035, 0.13, px);
  float matK = clamp(max(max(matA, haloM), gmat*0.7), 0., 1.)*(1. - ap*0.7);
  float edge = smoothstep(0.05, 0.2, halo)*(1. - smoothstep(0.28, 0.6, halo));
  float mossN = smoothstep(0.38, 0.62, bnz(p*0.7 + 23., 1.43, px));
  colr = mix(colr, uCMoss*(0.62 + 0.5*n2), edge*mossN*(0.3 + 0.5*near)*(1. - uNight*0.5));
  // along the creek the dams step across its own flow and the filaments stream down it; elsewhere both follow the vent's rings.
  // The two patterns fade out toward the line where one takes over from the other
  float inCreek = step(0.5, creekH), selK = smoothstep(0., 0.5, abs(creekH - 0.5)*2.);
  vec2 fq = mix(vec2(rr, fang*rr), vec2(cS, cT), inCreek);
  float dm0 = rr*1.15 + vnoise(fq*vec2(0.33, 0.5) + 4.)*2.8 + vnoise(fq*vec2(1.1, 1.7) + 9.)*0.7;
  float fdm = 1.7*px;          // the dams' own footprint: they run across the view, where a pixel is longest
  if (near > 0.004){
    float fw1 = vnoise(fq*0.27 + 31.)*3.;
    float dl = clamp(log2(max(fdm*7., 1.)), 0., 4.), d0 = floor(dl), df = dl - d0;
    float qa = exp2(-d0), qb = qa*0.5;
    float fa = fract(dm0*qa), ea = abs(fa - 0.5), eb = abs(fract(dm0*qb) - 0.5);
    float wa = max(0.085, 1.3*fdm*qa), wb = max(0.085, 1.3*fdm*qb);
    float damA = 1. - smoothstep(wa - fdm*qa, wa + fdm*qa, ea), damB = 1. - smoothstep(wb - fdm*qb, wb + fdm*qb, eb);
    float dam = mix(damA, damB, df);
    float bead = 0.6 + 0.4*bnz(vec2(fq.y*7., fq.x*2.) + 3., 0.14, px);
    float damK = matK*near*(1. - 0.6*chM)*(1. - creekW)*mix(0.2 + 0.8*smoothstep(0.3, 0.62, vnoise(p*0.085 + 40.)), 0.5, inCreek)*selK;       // in patches: smooth films lie between the terraced reaches
    float pond = smoothstep(0.5 - wa - 0.32, 0.5 - wa, fa)*step(fa, 0.5)*(1. - damA)*(1. - df);
    colr *= 1. - 0.22*pond*damK;
    colr = mix(colr, mix(uCSinter*0.9, uCYel, 0.35)*bead, dam*damK*0.8);
    H += dam*damK*0.04*bead;
    wet = max(wet, pond*damK*0.8);
    float fl1 = bnz(vec2(fq.y*3.6 + fw1, fq.x*0.95 - uTime*0.04), 0.28, px);
    float fl2 = bnz(vec2(fq.y*9.5 + fw1*2. + 5., fq.x*2.4 - uTime*0.09), 0.105, px);
    float fila = smoothstep(0.5, 0.78, fl1*0.62 + fl2*0.38)*selK*(1. - creekW);
    colr = mix(colr, uCRust*0.5 + uCDark*0.35, fila*matK*near*0.6*(1. - dam));
    float pale = smoothstep(0.6, 0.86, fl2*0.7 + fl1*0.3)*near2;
    colr = mix(colr, mix(uCYel, vec3(0.86, 0.84, 0.76), 0.45), pale*matK*0.35);
    colr = mix(colr, mix(uCOra, uCYel, 0.6)*(0.85 + 0.3*fl2), chM*near*0.45*smoothstep(0.35, 0.65, fl1));
    H += (fl2 - 0.5)*0.012*wet*near2;
    // sinter nodules and stones: only where each is four pixels or more across, soft-edged, in the mats' own warm tones
    vec2 nc = p*1.05 + 7.3, ni = floor(nc), nf = fract(nc);
    float nh = hash12(ni + 17.3), nk = step(mix(0.9, 0.66, n1), nh)*step(creekW, 0.5), nearN = 1. - smoothstep(0.035, 0.085, px);
    vec2 no = vec2(hash12(ni + 3.1), hash12(ni + 9.7))*0.4 + 0.3;
    float nr = 0.15 + 0.14*hash12(ni + 31.7), nsoft = clamp(px*1.05*2.5/nr, 0.12, 0.6);
    float nd = length(nf - no)/nr, dome = sqrt(max(1. - nd*nd, 0.));
    float nod = nk*(1. - smoothstep(1. - nsoft, 1., nd))*nearN;
    float nsh = nk*(1. - smoothstep(0.5, 1.9, length(nf - no + uSunXZ*nr*1.5)/nr))*(1. - nod)*nearN*sunGate(vP.y);
    vec3 ncol = mix(mix(uCSinter*0.8, uCYel*0.75, 0.3 + 0.4*hash12(ni + 5.9)), uCRust*0.8, step(0.72, hash12(ni + 41.3))*0.6);
    colr = mix(colr, ncol*(0.75 + 0.3*nh)*(0.8 + 0.25*dome), nod*0.92);
    colr *= 1. - 0.45*nsh;
    H += nod*dome*0.09;
  }
  // one stitched line of hoofprints across the skirt
  vec2 hd = uHoof.zw - uHoof.xy; float hl = max(length(hd), 1.); hd /= hl;
  vec2 hq = p - uHoof.xy; float hs = dot(hq, hd), ht = dot(hq, vec2(-hd.y, hd.x));
  ht += 2.2*sin(hs*0.045 + uSeed.x) + 0.5*sin(hs*0.21 + uSeed.y);
  float hOn = smoothstep(0., 4., hs)*(1. - smoothstep(hl - 4., hl, hs));
  float side = step(0., ht)*2. - 1.;
  float stp = fract(hs/0.95 + 0.25*side + 0.25) - 0.5;
  float prints = 1. - smoothstep(0.10, 0.19, length(vec2(stp*0.95, abs(ht) - 0.24)));
  float lw = max(0.5, px*1.5);
  float trail = 1. - smoothstep(lw*0.6, lw, abs(ht));
  float lod = smoothstep(0.05, 0.25, px);
  float hoof = mix(prints, trail*min(1., 0.6/lw)*(0.65 + 0.35*step(0.35, fract(hs/1.9))*(1. - smoothstep(0.3, 0.6, px))), lod)*hOn;
  colr = mix(colr, colr*0.38 + uCSinter*0.08, hoof*(0.55 + 0.4*matA));
  H -= hoof*0.04*(1. - lod);
  // cold ground: hoar frost outside the warm halos, frosted meadow at the rim
  float warm = max(max(1. - smoothstep(92., 128., m + (nA - 0.5)*20.), haloM), 1. - smoothstep(22., 46., gd));
  float frost = (1. - warm)*uFrost;
  float meadow = smoothstep(-6., 8., sR);
  // green summer grass against pale sinter: the edge is broken at tussock scale (clumps three metres and half a metre
  // across) and is a metre wide, not a fourteen-metre fade
  float eM = max(0.8, px*1.6);
  meadow = mix(meadow, smoothstep(-eM, eM, sR - 1. + (n2 - 0.5)*9. + (n3 - 0.5)*3.5), uEdge);
  vec3 grass = uCMeadow*meadowTone(p, px);
  colr = mix(colr, mix(grass, uCMoss*(0.8 + 0.4*n2), warm*0.8), meadow);
  float fr = clamp(frost*(0.28 + 0.35*n1 + 0.25*meadow), 0., 0.6);
  colr = mix(colr, uCFrost*(0.80 + 0.15*n3), fr);
  // relief from the height field (screen-space gradient mapped back to metres), close range only
  float dhx = dFdx(H), dhy = dFdy(H);
  float det = dpx.x*dpy.y - dpx.y*dpy.x;
  det = (det < 0. ? -1. : 1.)*max(abs(det), 1e-9);
  vec2 g = vec2(dhx*dpy.y - dhy*dpx.y, dhy*dpx.x - dhx*dpy.x)/det;
  float aniso = px*px/max(abs(det), 1e-9);
  g = clamp(g*rel*(1. - smoothstep(3., 12., aniso)), -0.5, 0.5)*1.3;
  g += clamp(gT, -0.2, 0.2)*rel*1.5;
  vec3 N = normalize(vec3(-g.x, 1., -g.y));
  vec3 V = normalize(cameraPosition - vW);
  float lit = sunGate(vP.y);
  float sh = max(castShadow(p, px), geyShadow(p));
  float along = -dot(p, uSunXZ), across = dot(p, vec2(-uSunXZ.y, uSunXZ.x));
  float veil = fbm2(vec2(along*0.011 - uTime*0.02, across*0.045) + 40.);
  sh = max(sh, smoothstep(0.52, 0.85, veil)*smoothstep(-20., 60., along)*(1. - smoothstep(60., 110., abs(across)))*0.5*min(uSteamK, 1.5));
  // the grazing sun exaggerates slopes threefold up close; from the air the gain falls and the flat tone stays the same
  float ndl = max(dot(N, uSunDir), 0.), n0 = max(uSunDir.y, 0.);
  float sunT = clamp(min(n0*3. + 0.07, 0.85) + (ndl - n0)*mix(1.5, 3., rel), 0.07, 0.85);
  float terK = (1. - matA)*(1. - ap*0.9)*(1. - meadow)*(1. - haloM);
  wet = max(wet, ter.y*terK*0.6);
  vec3 E = uSunCol*sunT*lit*(1. - sh*0.92)*mix(1., ter.x, terK) + uSkyCol*(0.8 + 0.2*N.y);
  vec3 c3 = colr*E;
  vec3 R = reflect(-V, N);
  float fres = pow(1. - max(dot(N, V), 0.), 4.);
  c3 += wet*mix(uHorizon, uZenith, clamp(R.y*1.5, 0., 1.))*(0.04 + 0.5*fres);
  c3 += wet*uSunCol*pow(max(dot(R, uSunDir), 0.), 90.)*1.6*lit*(1. - sh);
  vec2 cell = floor(p*7.);
  float tw = hash12(cell + floor(dot(V.xz, vec2(37., 23.)) + V.y*31.)*vec2(1.3, 2.7));
  c3 += uSunCol*step(0.994, tw)*clamp(fr*1.6, 0., 1.)*lit*(1. - sh)*(1. - smoothstep(0.07, 0.22, px))*2.0;
  // wet films sparkle: glint cells that blink as the film crawls
  vec2 gc = floor(p*8.5);
  float gsp = hash12(gc + floor(uTime*2.2 + hash12(gc + 5.)*9.)*vec2(3.1, 1.7));
  c3 += uSunCol*step(0.972, gsp)*wet*(1. - smoothstep(0.03, 0.11, px))*lit*(1. - sh)*(0.35 + 0.65*max(dot(-V, uSunDir), 0.))*1.3;
  // in summer the sheet ends at that broken edge: beyond it the world's own ground decides between sinter and grass, so no
  // green fades away across the flats
  gl_FragColor = vec4(max(c3, 0.), alpha*(1. - uEdge*meadow));
  vec3 pre = gl_FragColor.rgb;
  #include <fog_fragment>
  gl_FragColor.rgb = mix(gl_FragColor.rgb, pre, uHaze*max(matA, haloM));
}`,et=`
varying vec3 vP, vW;
#include <fog_pars_vertex>
void main(){
  vP = position;
  vec4 w = modelMatrix*vec4(position, 1.);
  vW = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,_e=`
float waterH(vec2 p, float t){
  float r = length(p);
  float dome = 0.72*exp(-r*r/22.)*(0.76 + 0.24*sin(t*1.1) + 0.14*sin(t*2.7 + 1.));
  float rip = 0.065*sin(r*1.15 - t*1.7)*exp(-r*0.03)*smoothstep(1., 6., r);
  return dome + rip;
}`,tt=`
varying vec3 vP, vW;
uniform float uTime;
${_e}
#include <fog_pars_vertex>
void main(){
  vec3 q = position; q.y += waterH(q.xz, uTime);
  vP = q;
  vec4 w = modelMatrix*vec4(q, 1.);
  vW = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ot=`
varying vec3 vP, vW;
uniform vec3 uCSapph, uCTurq, uCEmer, uCDeep, uPortalPos, uPortalN;
uniform vec4 uPortalCol;
uniform float uHaze, uPoolGain;
#include <fog_pars_fragment>
${K}
${_e}
float waterHf(vec2 p){
  float r = length(p); vec2 dr = p/max(r, 1e-3);
  float boil = (vnoise(p*0.55 + vec2(uTime*0.23, -uTime*0.19)) + vnoise(p*1.3 - vec2(uTime*0.31, uTime*0.27)))*exp(-r*r/240.);
  return waterH(p, uTime) + 0.15*boil + 0.022*vnoise(dr*9. + vec2(r*0.55 - uTime*0.75)) + 0.008*vnoise(p*2.3 + uTime*0.4);
}
void main(){
  vec2 p = vP.xz;
  float px = max(length(dFdx(p)), length(dFdy(p)));
  float tend; float d = eyeD(p, tend);
  float rr = length(p); vec2 dirp = p/max(rr, 1e-3);
  float e = (vnoise(p*0.3 + 3.) - 0.5)*2.5;
  float sc = mix(fract(d*0.55 + vnoise(p*0.33 + 2.)*3.0 + bnz(p*0.9, 1.1, px)*1.2), 0.5, smoothstep(0.08, 0.24, px));
  float aEdge = 1. - smoothstep(uRingA.w - 3.5, uRingA.w + 0.5, d + e*0.6 + sc*1.2);
  if (aEdge < 0.004) discard;
  float t1 = smoothstep(uRingA.x - 6., uRingA.x + 6., d + e);
  float t2 = smoothstep(uRingA.y - 3.5, uRingA.y + 2., d + e);
  float t3 = smoothstep(uRingA.z - 2.5, uRingA.z + 2.5, d + e);
  float core = 1. - smoothstep(2., 14., d);
  vec3 body = mix(uCSapph, uCTurq, t1);
  body = mix(body, uCEmer, t2);
  body = mix(body, uCDeep, core*mix(0.7, 1., uNight));
  float ledge = smoothstep(0.7, 1., fract(d*0.21 + e*0.25))*smoothstep(18., 28., d)*(1. - t3);
  body *= 1. + 0.2*ledge;
  float up = fbm2(dirp*7. + vec2(rr*0.12 - uTime*0.10) + uSeed.xy);
  body *= 0.86 + 0.3*up;
  body *= 1. + 0.16*sin(rr*1.15 - uTime*1.7)*exp(-rr*0.03)*smoothstep(1., 6., rr);
  float boil = vnoise(p*0.55 + vec2(uTime*0.23, -uTime*0.19))*vnoise(p*1.3 - vec2(uTime*0.31, uTime*0.27));
  body = mix(body, uCTurq*1.5 + 0.12, clamp(boil*3.4*exp(-rr*rr/110.), 0., 0.62)*(1. - uNight));   // the boil: pale water welling up and rolling outward
  // ripple normal
  float h0 = waterHf(p), hx = waterHf(p + vec2(0.2, 0.)), hz = waterHf(p + vec2(0., 0.2));
  vec2 g = vec2(hx - h0, hz - h0)/0.2;
  g *= 1. - smoothstep(0.3, 1.6, px)*0.85;
  vec3 N = normalize(vec3(-g.x, 1., -g.y));
  vec3 V = normalize(cameraPosition - vW);
  float lit = sunGate(vP.y);
  float sh = max(castShadow(p, px), geyShadow(p));
  vec3 E = uSunCol*0.34*lit*(1. - sh*0.8) + uSkyCol;
  vec3 c3 = body*E*uPoolGain;
  c3 *= 1. + clamp(-dot(g, uSunXZ)*5., -0.3, 0.6)*lit;
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  vec3 sky = mix(uHorizon, uZenith, pow(clamp(R.y, 0., 1.), 0.6));
  float F = 0.02 + 0.98*pow(1. - max(dot(N, V), 0.), 5.);
  c3 = mix(c3, sky, F*0.85);
  c3 += uSunCol*pow(max(dot(R, uSunDir), 0.), 220.)*1.5*lit*(1. - sh);
  // the exit portal mirrored as a glow under it
  float dn = dot(R, uPortalN); dn = (dn < 0. ? -1. : 1.)*max(abs(dn), 1e-3);
  float tt = dot(uPortalPos - vP, uPortalN)/dn;
  vec3 hit = vP + R*tt;
  float pr = length(hit - uPortalPos)/max(uPortalCol.w, 0.1);
  float pg = step(0., tt)*(1. - smoothstep(0.6, 1.5, pr))*(0.35 + 0.65*smoothstep(0.3, 1.0, pr));
  c3 += uPortalCol.rgb*pg*(0.10 + F);
  gl_FragColor = vec4(max(c3, 0.), aEdge*(1. - 0.55*t3));
  vec3 pre = gl_FragColor.rgb;
  #include <fog_fragment>
  gl_FragColor.rgb = mix(gl_FragColor.rgb, pre, uHaze);
}`,Ve=`
attribute vec4 aCol;
#ifdef SNAG
attribute vec3 aCenter;
uniform float uPxAngle;
#endif
#ifdef CONE
attribute float aFade;
varying float vFade;
#endif
varying vec3 vP, vW, vN;
varying vec4 vC;
#include <fog_pars_vertex>
void main(){
  vec3 q = position;
  #ifdef CONE
  vFade = aFade;
  #endif
  #ifdef SNAG
  vec3 off = q - aCenter;
  float rad = length(off);
  float dist = length(cameraPosition - (modelMatrix*vec4(aCenter, 1.)).xyz);
  float want = max(rad, 0.8*aCol.a*dist*uPxAngle);
  q = aCenter + off*(want/max(rad, 1e-4));
  #endif
  vP = q; vC = aCol;
  vN = normalize(mat3(modelMatrix)*normal + vec3(0., 1e-5, 0.));
  vec4 w = modelMatrix*vec4(q, 1.);
  vW = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ee=`
varying vec3 vP, vW, vN;
varying vec4 vC;
#ifdef CONE
varying float vFade;
#endif
#include <fog_pars_fragment>
${K}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  float nz = fbm3(vP.xz*1.4 + vP.y*0.9);
  float bead = vnoise(vP.xz*6. + vP.y*5.);
  vec3 alb = vC.rgb*(0.78 + 0.3*nz + 0.14*(bead - 0.5));
  float lit = sunGate(vP.y);
  float ndl = max(dot(N, uSunDir), 0.);
  float sunT = mix(ndl*0.85 + 0.04, min(ndl*3. + 0.07, 0.85), smoothstep(0.3, 0.9, N.y));
  vec3 E = uSunCol*sunT*lit + uSkyCol*(0.55 + 0.45*N.y);
  vec3 c3 = alb*E;
  vec3 R = reflect(-V, N);
  #ifdef SNAG
  float wet = 0.;
  #else
  float wet = vC.a*(0.3 + 0.7*uGey.w);
  float gdr = length(vP.xz - uGey.xy);
  c3 *= 1. - 0.3*(1. - smoothstep(10., 34., length(vP.xz - uGey.xy - uWind*4.)))*(0.25 + 0.75*uGey.w)*smoothstep(5., 12., gdr);
  #endif
  c3 *= 1. - 0.3*wet;
  c3 += wet*(uSunCol*pow(max(dot(R, uSunDir), 0.), 40.)*0.9*lit + mix(uHorizon, uZenith, clamp(R.y, 0., 1.))*0.10);
  float rim = pow(1. - max(dot(N, V), 0.), 3.)*max(dot(-V, uSunDir), 0.);
  c3 += uSunCol*rim*0.35*lit;
  gl_FragColor = vec4(max(c3, 0.), 1.);
  #ifdef CONE
  gl_FragColor.a = vFade;
  #endif
  #include <fog_fragment>
}`;function De(h,d,t){const F=h/d,D=F-Math.floor(F);return(Math.floor(F)+Math.min(1,Math.max(0,(D-(1-t))/t)))*d}async function at(h,d,t,F,D,C){const Y=[];for(let r=0;r<5;r++)Y.push(.75*r/5);for(let r=0;r<4;r++)Y.push(.75+.4*r/4);for(let r=0;r<18;r++)Y.push(1.15+3.35*Math.pow(r/18,.9));for(let r=0;r<6;r++)Y.push(4.5+2.5*r/6);for(let r=0;r<=7;r++)Y.push(7+7*Math.pow(r/7,1.15));const oe=Y.length,ae=d.range(0,6.28),ie=d.range(0,6.28),le=d.range(0,6.28),v=d.range(0,90),Z=d.range(0,90),M=new Float32Array(oe*96*3),G=new Float32Array(oe*96*4),z=new Float32Array(oe*96),T=[],ee=C.sinter,Q=C.rust,ne=C.orange,$=C.dark,w=new n.Color;for(let r=0;r<oe;r++)for(let S=0;S<96;S++){S===0&&(r&1)===1&&await h.yield?.();const b=S/96*Math.PI*2,k=Y[r],q=Math.cos(b),V=Math.sin(b),L=1+.12*Math.cos(b-ae)+.07*Math.cos(2*b+ie),U=t.fbm2(q*2.2+v,V*2.2+Z+k*.35,3),X=k/(L*(1+.1*U*Math.min(1,k/2))),ce=4*(1+.1*Math.cos(b-le));let R;if(X<.75)R=ce-.12-2.6*Math.pow(1-X/.75,.7);else if(X<4.5){const _=(X-.75)/3.75;R=.55+(ce-.55)*(1-Math.pow(_,1.55))-.18*Math.exp(-_*30),R=R*.5+De(R,.42,.45)*.5}else{const _=Math.min(1,(X-4.5)/18.5);R=.55*Math.pow(1-_,1.7)*(1-_*.2)-.09*_,R=R*.3+De(R+.03*U,.075,.3)*.7}const y=k*q,H=k*V,be=Math.min(1,Math.max(0,(k-.6)/.8))*Math.min(1,Math.max(0,(9-k)/4));R+=be*(t.fbm2(y*.9+v,H*.9+Z,3)*.22+t.n2(y*4.5+Z,H*4.5+v)*.05);const ue=(r*96+S)*3;M[ue]=F+y,M[ue+1]=R,M[ue+2]=D+H;const ge=t.fbm2(q*5+Z,V*5+v+k*.08,2)*.5+.5,I=Math.min(1,Math.max(0,R/4));w.copy(ee).multiplyScalar(.72+.2*ge+.12*I),w.lerp(pe(Q,ne,ge),Math.max(0,ge-.46)*2.2*(1-I*.6)*(k<20?1:.4)),X<.75&&w.lerp($,.85*(1-X/.75)+.1);const fe=(r*96+S)*4;z[r*96+S]=1-Math.min(1,Math.max(0,(k-9-1.2*U)/4.6)),G[fe]=w.r,G[fe+1]=w.g,G[fe+2]=w.b,G[fe+3]=Math.min(1,Math.max(0,I*.9+(k<9?.25:.1)*ge))}for(let r=0;r<oe-1;r++)for(let S=0;S<96;S++){const b=(S+1)%96,k=r*96+S,q=r*96+b,V=(r+1)*96+S,L=(r+1)*96+b;T.push(k,q,V,q,L,V)}const m=new n.BufferGeometry;return m.setAttribute("position",new n.BufferAttribute(M,3)),m.setAttribute("aCol",new n.BufferAttribute(G,4)),m.setAttribute("aFade",new n.BufferAttribute(z,1)),await h.yield?.(),m.setIndex(T),m.computeVertexNormals(),m}function nt(h,d,t){const F=[],D=[],C=[],he=[],Y=t.snag,oe=t.sock,ae=new n.Color,ie=(M,G,z,T,ee,Q)=>{const ne=F.length/3,$=M.length;for(let w=0;w<$;w++){const m=M[w],r=(w<$-1?M[w+1].clone().sub(m):m.clone().sub(M[w-1])).normalize(),S=T.clone().cross(r).normalize(),b=r.clone().cross(S);for(let k=0;k<z;k++){const q=k/z*Math.PI*2,V=Math.cos(q)*G[w],L=Math.sin(q)*G[w];F.push(m.x+S.x*V+b.x*L,m.y+S.y*V+b.y*L,m.z+S.z*V+b.z*L),D.push(m.x,m.y,m.z);const U=Math.min(1,Math.max(0,(1.35-m.y)/.45));ae.copy(Y).multiplyScalar(ee*(.8+.25*((k*7+w*3)%5)/4)).lerp(oe,U),C.push(ae.r,ae.g,ae.b,Q)}}for(let w=0;w<$-1;w++)for(let m=0;m<z;m++){const r=(m+1)%z,S=ne+w*z+m,b=ne+w*z+r,k=S+z,q=b+z;he.push(S,b,k,b,q,k)}},le=new n.Vector3(0,0,1),v=new n.Vector3(0,1,0);for(const M of d){const G=.15+.013*M.h,z=new n.Vector3(h.range(-.06,.06),0,h.range(-.06,.06)),T=h.range(-.5,.5),ee=m=>new n.Vector3(M.x+z.x*m*M.h+T*m*m*.5,m*M.h,M.z+z.z*m*M.h-T*m*m*.3),Q=[],ne=[],$=8;for(let m=0;m<$;m++){const r=Math.pow(m/($-1),.9);Q.push(ee(r)),ne.push(G*(1-.82*r)*(m===0?1.7:m===1?1.15:1))}Q[0].y=-.3,Q[1].y=Math.max(Q[1].y*.35,.35),ie(Q,ne,7,le,h.range(.85,1.05),1);const w=h.int(5,10);for(let m=0;m<w;m++){const r=h.range(.3,.95),S=h.range(0,6.283),b=h.range(.5,2)*(1.15-r*.6),k=G*(1-.82*r)*.42,q=ee(r),V=new n.Vector3(Math.cos(S),h.range(-.25,.3),Math.sin(S)),L=q.clone().addScaledVector(V,b*.55),U=L.clone().addScaledVector(V,b*.45);U.y+=h.range(-.25,.12)*b,ie([q,L,U],[k,k*.6,.012],4,v,h.range(.7,1),.4)}}const Z=new n.BufferGeometry;return Z.setAttribute("position",new n.Float32BufferAttribute(F,3)),Z.setAttribute("aCenter",new n.Float32BufferAttribute(D,3)),Z.setAttribute("aCol",new n.Float32BufferAttribute(C,4)),Z.setIndex(he),Z.computeVertexNormals(),Z}const st=`
varying vec3 vP, vW, vN, vQ;
#include <fog_pars_vertex>
${K}
void main(){
  float ang = position.x, v = position.y, shell = position.z;
  float H = max(uGey.z, 0.3)*(1. - 0.07*shell), y = v*H;
  float k = sqrt(clamp(H/60., 0.01, 1.3));
  vec2 cs = vec2(cos(ang), sin(ang));
  float pulse = vnoise(cs*1.4 + vec2(y*0.06 - uTime*1.2, y*0.09 - uTime*1.7) + shell*7.);
  float r = (0.7 + 2.3*pow(v, 1.3))*k*(1. + 0.7*shell)*(0.75 + 0.55*pulse);
  float top = smoothstep(0.72, 1., v);
  float lobe = vnoise(cs*1.1 + uSeed.xy + uTime*0.12);
  r += top*top*(1. + 3.5*lobe)*k*(1. + 0.5*shell);
  y -= top*top*H*0.06*(1. - lobe);
  vec3 q = vec3(uGey.x + cs.x*r, y, uGey.y + cs.y*r);
  q.xz += uWind*(v*v*2.2*k) + vec2(sin(uTime*0.5 + v*3.), cos(uTime*0.4 + v*2.))*v*0.6*k;
  vP = q; vQ = vec3(ang, y, shell);
  vN = normalize(vec3(cs.x, -0.2 - top, cs.y));
  vec4 w = modelMatrix*vec4(q, 1.);
  vW = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,rt=`
varying vec3 vP, vW, vN, vQ;
uniform vec3 uSteamShade;
#include <fog_pars_fragment>
${K}
void main(){
  float y = vQ.y, shell = vQ.z, v = clamp(y/max(uGey.z, 0.3), 0., 1.);
  vec2 cs = vec2(cos(vQ.x), sin(vQ.x));
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 V = normalize(cameraPosition - vW);
  // the water itself: rolling knots climbing the jet, broad and soft. It is solid (no gaps to see through) and is lost in the
  // billows from two thirds of its height
  float s1 = fbm3(cs*1.6 + vec2(y*0.21 - uTime*2.4, y*0.26 - uTime*3.1) + shell*3.);
  float nv = abs(dot(N, V));
  float bk1 = max(dot(-V, uSunDir), 0.), bk = bk1*bk1;
  float lit = sunGate(vP.y);
  float a = smoothstep(0.04, 0.5, nv + (s1 - 0.5)*0.45)*(1. - smoothstep(0.6, 0.9, v))*mix(1., 0.55, shell);
  if (a < 0.004) discard;
  float wrap = clamp(dot(N, uSunDir)*0.75 + 0.35, 0., 1.);
  // under a high sun (the day look) the side away from it is a darker, greyer blue than the pale sky behind, and the lit
  // side is whiter
  float hiSun = smoothstep(0.3, 0.7, uSunDir.y)*(1. - uNight);
  vec3 shd = mix(uSteamShade, dot(uSteamShade, vec3(0.3333))*vec3(0.86, 0.93, 1.08), 0.5*hiSun)*(1. - 0.34*hiSun);
  float wr2 = mix(wrap*wrap, clamp(dot(cs, uSunXZ)*0.6 + 0.55, 0., 1.), hiSun);
  vec3 c3 = shd*(0.5 + 0.3*s1) + uSunCol*wr2*mix(0.4, 0.52, hiSun)*lit;
  c3 *= (0.8 + 0.4*s1)*(1. - 0.78*bk*lit*(1. - 0.5*hiSun));
  c3 = mix(c3, shd*(0.55 + 0.3*s1), 0.6*bk*lit*hiSun);              // seen against the sun the heart of the column is blue-grey
  gl_FragColor = vec4(max(c3, 0.), a);
  #include <fog_fragment>
}`,it=`
attribute vec4 aA, aB;
uniform vec4 uCloud;
uniform float uPxAngle;
varying vec2 vUv;
varying vec4 vS;
varying vec3 vMV;
varying float vTh;
#include <fog_pars_vertex>
${K}
void main(){
  float kind = aB.x, T = aB.z, ph = fract(uTime/T + aB.w), t = ph*T;
  float H = max(uGey.z, 0.3), gk = clamp(H/60., 0.03, 1.2), sg = sqrt(gk);
  vec3 c = vec3(uGey.x + aA.x*sg, aA.y*gk, uGey.y + aA.z*sg);
  vec2 hw = vec2(aB.y);
  vec2 al = vec2(0., 1.);
  float alpha;
  if (kind < 0.5){
    c.y -= 5.*ph*gk; c.xz += uWind*t*0.55 + vec2(sin(t*0.4 + aA.w*30.), cos(t*0.33 + aA.w*17.))*1.5;
    hw *= mix(0.45, 1., gk)*(0.75 + 0.5*ph);
    alpha = smoothstep(0., 0.2, ph)*(1. - smoothstep(0.6, 1., ph));
  } else {
    float fall = 7.5*t;
    c.y = max(c.y - fall, 0.) + 0.4; c.xz += uWind*t*0.85;
    alpha = smoothstep(0., 0.08, ph)*smoothstep(0.3, 3., aA.y*gk - fall);
  }
  vec4 w = modelMatrix*vec4(c, 1.);
  vec4 mvPosition = viewMatrix*w;
  float dist = max(-mvPosition.z, 0.1);
  if (kind > 0.5){
    vec2 vv = (viewMatrix*modelMatrix*vec4(uWind.x*0.85, -7.5, uWind.y*0.85, 0.)).xy;
    float vl = length(vv); al = vl > 1e-3 ? vv/vl : vec2(0., -1.);
    float wpx = 0.8*dist*uPxAngle;                       // half of 1.6 pixels, in metres at this distance
    alpha *= min(1., hw.x/max(wpx, 1e-4))*0.75 + 0.25;
    hw = vec2(max(hw.x, wpx), hw.x*(7. + 6.*aA.w));
  }
  mvPosition.xy += al*position.y*hw.y + vec2(-al.y, al.x)*position.x*hw.x;
  vUv = position.xy; vMV = mvPosition.xyz;
  vTh = jetThick(mvPosition.xyz, c.y);
  alpha *= smoothstep(0.03, 0.55, uGey.w)*uCloud.z*smoothstep(3., kind < 0.5 ? 20. : 9., dist);
  vS = vec4(alpha, aA.w, c.y, kind);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,lt=`
varying vec2 vUv;
varying vec4 vS;
varying vec3 vMV;
varying float vTh;
uniform vec3 uSteamShade;
#include <fog_pars_fragment>
${K}
void main(){
  float r2 = dot(vUv, vUv), lit = sunGate(vS.z);
  vec3 Vr = normalize(vMV), sv = normalize((viewMatrix*vec4(uSunDir, 0.)).xyz);
  float ca = dot(Vr, -sv), fw = max(-ca, 0.);
  // the primary bow, 42 degrees from the antisolar point: red outside, violet inside, about two degrees across
  float tb = (acos(clamp(ca, -1., 1.)) - 0.733)/0.034;
  vec3 bow = max(vec3(smoothstep(-0.7, 0.6, tb), 1. - abs(tb + 0.05)*0.85, smoothstep(0.45, -0.85, tb)), 0.)*exp(-tb*tb*1.3);
  bow *= uSunCol*0.42*lit*(1. - uNight*0.75);
  float a; vec3 c3, add;
  if (vS.w < 0.5){
    if (r2 > 1.) discard;
    float body = 1. - r2, n = fbm3(vUv*1.7 + vS.y*vec2(31., 57.) + vec2(0., uTime*0.05));
    float soft = body*body*smoothstep(0.15, 0.75, body*0.7 + n*0.6);
    a = soft*vS.x*0.04*(1. - 0.85*vTh);
    c3 = uSteamShade*0.85 + uSunCol*lit*(0.1 + 0.3*fw*fw*fw);
    add = bow*soft*vS.x*0.34;
  } else {
    float ax = 1. - vUv.x*vUv.x, ay = 1. - vUv.y*vUv.y;
    a = ax*ay*ay*vS.x*0.24*(1. - 0.9*vTh);
    c3 = uSteamShade*0.9 + uSunCol*lit*(0.2 + 0.55*fw*fw);
    add = bow*a*2.2;
  }
  if (a < 0.002 && dot(add, vec3(1.)) < 0.004) discard;
  gl_FragColor = vec4(max(c3, 0.)*a + add, a);
  #ifdef USE_FOG
  float ff = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor*a, ff);
  #endif
}`,ct=`
attribute vec4 aA, aB;
uniform vec4 uCloud;
varying vec2 vUv;
varying vec4 vS;
varying float vTh;
#include <fog_pars_vertex>
${K}
void main(){
  float T = aB.y, ph = fract(uTime/T + aB.x), t = ph*T;
  float H = max(uGey.z, 0.3), k = sqrt(clamp(H/60., 0.01, 1.3));
  float tau = 1.3, vt = 6.5, ex = exp(-t/tau), kk = tau*(1. - ex);
  vec2 dir = vec2(cos(aA.x), sin(aA.x));
  float vh = aA.z*k, vy = aA.w*k;
  vec3 c = vec3(uGey.x, H*aA.y, uGey.y);
  c.xz += dir*(1.2*k + vh*kk) + uWind*(t - kk);
  c.y += (vy + vt)*kk - vt*t;
  vec3 vel = vec3(dir.x*vh*ex + uWind.x*(1. - ex), (vy + vt)*ex - vt, dir.y*vh*ex + uWind.y*(1. - ex));
  vec4 w = modelMatrix*vec4(c, 1.);
  vec4 mvPosition = viewMatrix*w;
  vec2 al = (viewMatrix*modelMatrix*vec4(vel, 0.)).xy;
  float sl = length(al); al = sl > 1e-3 ? al/sl : vec2(0., -1.);
  float sz = aB.z*(0.9 + 1.3*ph)*mix(0.45, 1., k);
  float len = sz*(1.0 + 0.05*length(vel));
  mvPosition.xy += al*position.y*len + vec2(-al.y, al.x)*position.x*sz*0.55;
  vUv = position.xy;
  float alpha = smoothstep(0., 0.06, ph)*smoothstep(0., 5.*k + 0.3, c.y)*(1. - smoothstep(0.9, 1., ph))*smoothstep(4., 24., -mvPosition.z);
  vec3 toP = w.xyz - cameraPosition;
  float fw = max(dot(toP/max(length(toP), 1e-3), uSunDir), 0.);
  vS = vec4(alpha*uCloud.z, aB.w, c.y, fw*fw*fw);
  vTh = jetThick(mvPosition.xyz, c.y);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ut=`
varying vec2 vUv;
varying vec4 vS;
varying float vTh;
uniform vec3 uSteamShade;
#include <fog_pars_fragment>
${K}
void main(){
  float r2 = dot(vUv, vUv);
  if (r2 > 1.) discard;
  float body = 1. - r2, ax = body, ay = body;
  float n = vnoise(vUv*1.6 + vS.y*vec2(31., 17.)), n2 = vnoise(vUv*3.4 + vS.y*vec2(5., -9.));
  float a = body*smoothstep(0.3, 0.8, body*0.75 + n*0.4 + n2*0.2)*vS.x*0.3*(1. - 0.6*vTh);
  if (a < 0.003) discard;
  float lit = sunGate(vS.z);
  float th = vTh*vS.w;
  vec3 c3 = (uSteamShade*0.7*(1. - 0.6*th) + uSunCol*0.2*lit*(1. - 0.95*th + (0.6*vS.w + 1.5*vS.w*vS.w*vS.w*vS.w)*(1. - th)*(1. - th))*(1. - 0.5*vS.w*ax*ay))*(0.75 + 0.5*n2);
  gl_FragColor = vec4(max(c3, 0.), a);
  #include <fog_fragment>
}`,Ge=`
attribute vec3 aO, aTint;
attribute vec4 aP, aQ;
uniform float uSteamK, uVeilK;
uniform vec4 uCloud;
varying vec2 vUv;
varying vec4 vS;
varying vec3 vTint, vSunS;
varying float vY, vR, vSoft, vTh, vColL;
#include <fog_pars_vertex>
${K}
void main(){
  float ph = fract(uTime/aP.y + aP.x), t = ph*aP.y;
  float kind = aQ.y, gk = 1., al = aQ.w;
  vec3 c = aO;
  bool gey = kind > 1.5 && kind < 2.5;
  float grow = sqrt(ph), drift = 0.3 + 0.7*ph, szk = 1., rise = 1.;
  if (gey){
    gk = clamp(max(uGey.z, 0.3)/60., 0.03, 1.2);
    float sg = sqrt(gk);
    c = vec3(uGey.x + aO.x*sg, aO.y*gk, uGey.y + aO.z*sg);
    // the cloud above the jet (rise > 40 m) stays a column, opens out only toward its top and leans away late;
    // uCloud = (its alpha, size of all the jet's vapour, alpha of spray and veil) lets the world draw the eruption
    // tighter while the camera crosses its lee
    float hi = step(40., aQ.x);
    al *= mix(0.3, 1., smoothstep(0.03, 0.6, uGey.w))*mix(1., uCloud.x, hi);
    grow = mix(grow, ph, hi);
    drift = mix(drift, (0.05 + 0.95*ph*ph)*(1. - 0.7*uCloud.w), hi);
    szk = uCloud.y*(1. - 0.34*hi*uCloud.w);
    rise = 1. - 0.74*hi*uCloud.w;
    // the tower's own billows (rise under 40 m) lean with the jet, drift little, and are lit as one column: bright on the
    // side of the axis that faces the sun, blue-grey on the other
    float vv = aO.y/60.;
    c.xz += uWind*(vv*vv*2.2*sg)*(1. - hi);
    drift *= mix(0.5, 1., hi);
    vColL = mix(clamp(dot(aO.xz/max(length(aO.xz), 1e-3), uSunXZ)*smoothstep(0.2, 2., length(aO.xz))*0.5 + 0.5, 0., 1.), -1., hi);
  } else {
    vColL = -1.;
    if (kind < 0.9) al *= uVeilK;                 // the spring's veil and column: the world thins them while it flies low across the pool
  }
  float sk = gey ? mix(0.3, 1., gk) : 1.;
  float size = mix(aP.z, aP.w, grow)*sk*szk;
  c.y += aQ.x*sk*rise*(1. - pow(1. - ph, 1.6));
  c.xz += uWind*t*drift + vec2(sin(t*0.37 + aQ.z*40.), cos(t*0.31 + aQ.z*23.))*size*0.12;
  vec4 w = modelMatrix*vec4(c, 1.);
  vec4 mvPosition = viewMatrix*w;
  float ra = aQ.z*6.283 + t*0.04*(aQ.z - 0.5);
  float cr = cos(ra), sr = sin(ra);
  vec2 off = vec2(cr*position.x - sr*position.y, sr*position.x + cr*position.y);
  mvPosition.xy += off*size;
  vec3 sv = (viewMatrix*vec4(uSunDir, 0.)).xyz;
  vSunS = vec3(cr*sv.x + sr*sv.y, -sr*sv.x + cr*sv.y, sv.z);
  vUv = position.xy;
  vY = c.y + off.y*size*0.9;
  vR = size;
  vSoft = step(kind, 0.5) + step(2.5, kind);
  float alpha = al*smoothstep(0., 0.12, ph)*(1. - smoothstep(0.5, 1., ph))*smoothstep(2., 12. + size*2., -mvPosition.z);
  vec3 toP = w.xyz - cameraPosition;
  float fw = max(dot(toP/max(length(toP), 1e-3), uSunDir), 0.);
  // thin summer steam is for the fumaroles and the spring's veil: the tower's own billows never fall below their dawn
  // weight, and the cloud standing above it thins only a little
  float stK = gey ? max(uSteamK, mix(1., 0.8, step(40., aQ.x))) : uSteamK;
  vS = vec4(min(alpha*stK, 0.9), aQ.z, c.y, fw*fw);
  vTh = gey ? jetThick(mvPosition.xyz, c.y)*smoothstep(0.25, 0.8, fw*fw) : 0.;
  vTint = mix(vec3(1.), aTint, (1. - smoothstep(2., 27., c.y))*step(kind, 0.5) + 0.25*step(0.5, kind)*step(kind, 1.5)*(1. - smoothstep(10., 60., c.y)) + step(2.5, kind));
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,He=`
uniform vec3 uSteamShade;
varying vec2 vUv;
varying vec4 vS;
varying vec3 vTint, vSunS;
varying float vY, vR, vSoft, vTh, vColL;
#include <fog_pars_fragment>
${K}
void main(){
  float r2 = dot(vUv, vUv);
  if (r2 > 1.) discard;
  float body = 1. - r2;
  float n = fbm4(vUv*2.3 + vS.y*vec2(37., 91.) + vec2(0., -uTime*0.035));
  float core = smoothstep(mix(0.25, 0.06, vSoft), mix(0.62, 0.92, vSoft), body*0.85 + (n - 0.5)*mix(1.25, 0.5, vSoft));
  float a = core*smoothstep(0., 0.35, body)*mix(1., body, vSoft*0.65)*vS.x*smoothstep(0., min(3., vR*0.4), vY);
  if (a < 0.003) discard;
  vec3 nrm = normalize(vec3(vUv*0.95, 0.5));
  float ndl = clamp(dot(nrm, vSunS)*0.6 + 0.4, 0., 1.);
  float lit = sunGate(vS.z);
  vec3 c3 = mix(uSteamShade, uSteamShade*0.45 + uSunCol*0.3, ndl*lit);
  // under a high sun the sky behind the tower is pale, so its shaded side is drawn a darker, greyer blue than the sky
  float hiSun = smoothstep(0.3, 0.7, uSunDir.y)*(1. - uNight);
  vec3 shd = mix(uSteamShade, dot(uSteamShade, vec3(0.3333))*vec3(0.86, 0.93, 1.08), 0.5*hiSun)*(1. - 0.34*hiSun);
  if (vColL >= 0.){
    // the tower: each billow is round (its own shading) and the column as a whole has a sunlit flank and a blue-grey one
    float nd2 = clamp(mix(ndl, vColL, 0.6)*1.15 - 0.05, 0., 1.);
    nd2 = mix(nd2, smoothstep(0.3, 0.9, nd2), hiSun);      // midday: every billow has a lit crown and a clear blue-grey underside
    c3 = mix(shd*(0.5 + 0.2*body), uSteamShade*0.3 + uSunCol*mix(0.5, 0.62, hiSun), nd2*lit);
  }
  c3 *= (0.8 + 0.36*n)*vTint;
  float f6 = vS.w*vS.w*vS.w; f6 *= f6;             // straight toward the sun: a dim blue-grey heart inside a burning edge
  float dk = max(0.45*f6*core*body, 0.86*vTh)*lit;
  c3 = mix(c3*(1. - dk), mix(c3, shd*0.72, dk*0.85), hiSun);
  c3 += uSunCol*lit*(vS.w*0.5 + f6*0.7)*(1. - core*body)*(1. - 0.6*core*vS.w)*(1. - vTh)*(1. - vTh);
  a = min(a*(1. + 0.8*vTh), 0.95);                       // and it closes up: no bright sky through the column's heart
  // the torn fringe round that dark heart burns gold. It is added light (the output is premultiplied), so it shows however
  // thin the vapour is there
  float band = 4.*vTh*(1. - vTh);
  vec3 add = uSunCol*lit*f6*band*(0.08 + 0.24*(1. - core))*smoothstep(0., 0.3, body);
  gl_FragColor = vec4(max(c3, 0.)*a + add, a);
  #ifdef USE_FOG
  float ff = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor*a, ff);
  #endif
}`,ht=`
attribute vec3 aO;
attribute vec4 aP;
uniform vec2 uPx;
varying vec2 vUv;
varying float vA;
${K}
void main(){
  float t = uTime + aP.x*40.;
  vec3 c = aO;
  c.y = aO.y - mod(t*aP.z, 60.) + 30.;
  c.xz += uWind*mod(t, 30.)*0.6 + vec2(sin(t*0.6 + aP.w*20.), cos(t*0.5 + aP.w*31.))*2.;
  vec4 w = modelMatrix*vec4(c, 1.);
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  gl_Position.xy += position.xy*uPx*1.8*gl_Position.w;
  float tw = max(sin(t*aP.y + aP.w*50.), 0.); tw *= tw; tw *= tw; tw *= tw;
  float dz = -mvPosition.z;
  vA = tw*smoothstep(1.5, 6., dz)*(1. - smoothstep(60., 130., dz))*sunGate(c.y)*smoothstep(4., 12., c.y)*(1. - uNight*0.6);
  vUv = position.xy;
}`,ft=`
varying vec2 vUv;
varying float vA;
${K}
void main(){
  float d = max(1. - dot(vUv, vUv), 0.);
  gl_FragColor = vec4(uSunCol*1.3*d*d*max(vA, 0.), 1.);
}`;function ye(h){const d=h?new n.InstancedBufferGeometry:new n.BufferGeometry;return d.setAttribute("position",new n.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),d.setIndex([0,1,2,2,1,3]),d}function W(h,d,t,F){h.setAttribute(d,new n.InstancedBufferAttribute(new Float32Array(t),F))}async function dt(h,d={}){const t=h.rng.fork("prismatic-eye"),F=h.noise,D=h.quality?.detail??1,C=(d.palette&&d.palette.length>=7?d.palette:Ze).map(O),he=d.hour||"dawn",Y=d.season||"autumn",oe=d.weather||"breeze",ae=he==="night",ie=Y==="winter",le=Y==="summer"||he==="day";C[0].offsetHSL(t.range(-.015,.015),0,0),C[3].offsetHSL(t.range(-.012,.014),0,0);const v={sapph:C[0].clone(),emer:C[1].clone(),yel:C[2].clone(),orange:pe(C[3],C[2],.16),sinter:C[4].clone(),cream:C[5].clone(),dark:C[6].clone(),turq:pe(pe(C[0],C[1],.5),O("#35c2e0"),.3),deep:pe(C[0],C[6],.55),rust:pe(C[3],C[6],.38),meadow:O("#A8925A"),moss:O("#5E7A34"),frost:O("#D2DAE6"),snag:O("#8E8A82"),sock:O("#E9E7E0")};ie&&(v.yel.lerp(O("#4d6b2f"),.75),v.orange.lerp(O("#8a4a22"),.7),v.rust.lerp(O("#3a2416"),.5),v.meadow.lerp(v.frost,.6)),le&&(v.orange.offsetHSL(0,.05,.03),v.meadow.copy(O("#6f8a3c")));const M={dawn:{dir:[Math.cos(.0873),Math.sin(.0873),0],sun:["#FFDDAE",2.6],sky:["#6F93C8",1.1],zen:"#2A4E86",hor:"#E8B9A0"},evening:{dir:[-Math.cos(.105),Math.sin(.105),.05],sun:["#FFC58A",2.6],sky:["#6A86C0",1],zen:"#27437A",hor:"#F0A878"},day:{dir:[.45,.8,.4],sun:["#FFF3DC",1.5],sky:["#86AEE6",1],zen:"#2F68C0",hor:"#BFD8F0"},night:{dir:[-.5,.62,.6],sun:["#A9BEEA",.55],sky:["#22345C",.6],zen:"#050A18",hor:"#16233F"}}[he]||null||{dir:[Math.cos(.0873),Math.sin(.0873),0],sun:["#FFDDAE",2.6],sky:["#6F93C8",1.1],zen:"#2A4E86",hor:"#E8B9A0"},G=d.geyser||[111,58],z=G[0],T=G[1],ee=d.jetHeight??60,Q=d.surge||[.16,.23],ne=(d.steam??1)*(ie?3:1)*(le?.5:1),$=oe==="still"?0:t.range(1.7,2.3),w=new n.Vector2(t.range(-.22,.22)*$,$),m=1+t.range(-.035,.035),r={sapphire:30*m,turquoise:42*m*t.range(.97,1.03),emerald:48*m,yellow:54*m,orange:66*m*t.range(.97,1.04),rust:90*m},S=(36+t.range(-5,5))*Math.PI/180,b=[Math.cos(S),Math.sin(S)],k=t.range(.22,.29),q=t.range(-1.25,-.4),V=q+Math.PI/2+t.range(-.3,.3),L=r.orange+t.range(3,9),U=[Math.cos(q)*L,Math.sin(q)*L],X=[Math.cos(V)*72,Math.sin(V)*72],ce=new n.Vector4(U[0]-X[0],U[1]-X[1],U[0]+X[0],U[1]+X[1]),R=[];for(let e=0;e<ve;e++)R.push(new n.Vector4(1e5,1e5,0,.02));const y={uTime:{value:0},uSunDir:{value:new n.Vector3(1,.09,0).normalize()},uSunCol:{value:new n.Vector3(2.6,2,1.3)},uSkyCol:{value:new n.Vector3(.18,.32,.63)},uZenith:{value:new n.Vector3},uHorizon:{value:new n.Vector3},uSunXZ:{value:new n.Vector2(1,0)},uShadowY:{value:-100},uShadowLen:{value:11.4},uNight:{value:ae?1:0},uSeed:{value:new n.Vector4(t.range(0,50),t.range(0,50),t.range(0,50),t.range(0,50))},uRingA:{value:new n.Vector4(r.sapphire,r.turquoise,r.emerald,r.yellow)},uRingB:{value:new n.Vector4(r.orange,r.rust,0,0)},uGey:{value:new n.Vector4(z,T,ee,1)},uWind:{value:w},uCast:{value:R},uSteamK:{value:ne},uEdge:{value:le?1:0},uVeilK:{value:1},uCloud:{value:new n.Vector4(1,1,1,0)},uSteamShade:{value:new n.Vector3(.3,.42,.7)},uHaze:{value:d.hazeExempt??.7},uFrost:{value:le?0:ie?1.3:1},uPoolGain:{value:ae?.9:1.55},uCSinter:{value:v.sinter},uCYel:{value:v.yel},uCOra:{value:v.orange},uCRust:{value:v.rust},uCMeadow:{value:v.meadow},uCFrost:{value:v.frost},uCDark:{value:v.dark},uCMoss:{value:v.moss},uCSapph:{value:v.sapph},uCTurq:{value:v.turq},uCEmer:{value:v.emer},uCDeep:{value:v.deep},uFan:{value:new n.Vector3(b[0],b[1],k)},uHoof:{value:ce},uRiver:{value:new n.Vector4(...d.river||[0,0,90,-1])},uPortalPos:{value:new n.Vector3(0,9,0)},uPortalN:{value:new n.Vector3(.4545,.766,-.4545).normalize()},uCreek:{value:new n.Vector4(...d.creek||[38.6,16.6,86.9,1])},uPortalCol:{value:new n.Vector4(1,.88,.7,7)},uPx:{value:new n.Vector2(.0025,.0044)},uPxAngle:{value:.0027}},H=new n.Vector3;function be(e={}){if(e.sunDir){const a=e.sunDir.isVector3?e.sunDir:new n.Vector3(e.sunDir[0],e.sunDir[1],e.sunDir[2]);H.copy(a).normalize(),y.uSunDir.value.copy(H);const o=Math.hypot(H.x,H.z);o>.001&&y.uSunXZ.value.set(H.x/o,H.z/o),y.uShadowLen.value=Math.min(19,1/Math.tan(Math.max(.052,Math.asin(Math.min(1,Math.max(0,H.y))))))}const l=(a,o,f=1)=>{if(o==null)return;const c=o.isColor?o:Array.isArray(o)?new n.Color(o[0],o[1],o[2]):O(o);a.value.set(c.r*f,c.g*f,c.b*f)};if(l(y.uSunCol,e.sunColor,e.sunIntensity??1),l(y.uSkyCol,e.skyColor,e.skyIntensity??1),l(y.uZenith,e.zenith),l(y.uHorizon,e.horizon),e.skyColor!=null){const a=y.uSkyCol.value,o=(a.x+a.y+a.z)/3;y.uSteamShade.value.set(a.x+(o-a.x)*.45,a.y+(o-a.y)*.45,a.z+(o-a.z)*.45).multiplyScalar(1.45)}e.shadowY!=null&&(y.uShadowY.value=e.shadowY)}be({sunDir:d.sunDir||M.dir,sunColor:M.sun[0],sunIntensity:M.sun[1],skyColor:M.sky[0],skyIntensity:M.sky[1],zenith:M.zen,horizon:M.hor});const ue=new n.Group;ue.name="prismatic-eye";const ge=()=>n.UniformsUtils.clone(n.UniformsLib.fog),I=(e,l,a={})=>new n.ShaderMaterial({uniforms:{...ge(),...y},vertexShader:e,fragmentShader:l,fog:!0,...a});let fe=0;const _=(e,l,a=!1)=>{e.renderOrder=l,e.frustumCulled=a,ue.add(e);const o=e.geometry,f=(o.index?o.index.count:o.attributes.position.count)/3;return fe+=f*(o.isInstancedBufferGeometry?o.instanceCount:1),e};{const e=new n.BufferGeometry,l=-195,a=292,o=-195,f=258;e.setAttribute("position",new n.Float32BufferAttribute([l,0,o,a,0,o,l,0,f,a,0,f],3)),e.setIndex([0,2,1,1,2,3]),_(new n.Mesh(e,I(et,Je,{transparent:!0})),-6)}{const a=r.yellow+12,o=[],f=[];for(let i=0;i<=40;i++)for(let s=0;s<96;s++){const u=a*Math.pow(i/40,1.35),g=s/96*Math.PI*2;o.push(Math.cos(g)*u,.08,Math.sin(g)*u)}for(let i=0;i<40;i++)for(let s=0;s<96;s++){const u=(s+1)%96,g=i*96+s,p=i*96+u,A=g+96,re=p+96;f.push(g,p,A,p,re,A)}const c=new n.BufferGeometry;c.setAttribute("position",new n.Float32BufferAttribute(o,3)),c.setIndex(f),_(new n.Mesh(c,I(tt,ot,{transparent:!0,depthWrite:!1})),-5)}await h.yield?.(),_(new n.Mesh(await at(h,t.fork("cone"),F,z,T,v),I(Ve,Ee,{defines:{CONE:1},transparent:!0})),0,!0),await h.yield?.();const E=[[131,3,268],[131,3,213],[131,3,158],[z+34,7,T+62]],Be=w.y*1.45,Se=37.2-Be*.7,Te=55,Oe=[12,16.5,21,26,31.5,37,43,52,62,73,84,92.5,97,97];for(let e=0;e<=13;e++){const l=e*30,a=l*Math.PI/180,o=l<=150?Se:l>=300?Te:Se+(Te-Se)*(.5-.5*Math.cos((l-150)/150*Math.PI));E.push([z+o*Math.cos(a),Oe[e],T-o*Math.sin(a)])}const me=E[E.length-1].slice();{const e=Math.PI/3,l=45,a=9+70*Math.sin(50*Math.PI/180),o=[[me[0],me[2]]];let f=me[0],c=me[2];for(let s=0;s<4e3&&Math.hypot(f,c)>l;s++){const u=Math.atan2(-c,-f)+e*(.22+.78*Xe(l+4,110,Math.hypot(f,c)));f+=Math.cos(u)*.25,c+=Math.sin(u)*.25,o.push([f,c])}const i=Math.round((o.length-1)*.25/21);for(let s=1;s<=i;s++){const u=s/i,g=o[Math.round(u*(o.length-1))];E.push([g[0],me[1]+(a-me[1])*u*(.4+.6*u),g[1]])}}const xe=E[E.length-1],ke=70,B=new n.Vector3(-xe[0],0,-xe[2]).normalize().multiplyScalar(Math.cos(50*Math.PI/180));B.y=-Math.sin(50*Math.PI/180);const j=new n.Vector3(0,9,0);xe[0]=j.x-B.x*ke,xe[1]=j.y-B.y*ke,xe[2]=j.z-B.z*ke,E.push([j.x-B.x*35,j.y-B.y*35,j.z-B.z*35],[j.x,j.y,j.z]),y.uPortalPos.value.copy(j),y.uPortalN.value.copy(B).negate();const We=(e,l,a)=>{let o=1e9;for(let f=0;f<E.length-1;f++){const c=E[f],i=E[f+1];for(let s=0;s<=8;s++){const u=s/8,g=c[0]+(i[0]-c[0])*u-e,p=c[1]+(i[1]-c[1])*u-l,A=c[2]+(i[2]-c[2])*u-a;o=Math.min(o,Math.hypot(g,p,A))}}return o};await h.yield?.();const se=[];if(d.snags!==!1){const e=t.int(11,14),l=d.snagCount??e,a=t.fork("snags"),o=d.route||null,f=(c,i,s)=>{if(!o)return We(c,i,s);let u=1e9;for(let g=0;g<o.length-1;g++){const p=o[g],A=o[g+1];for(let re=0;re<4;re++){const te=re/4,x=p[0]+(A[0]-p[0])*te-c,P=p[1]+(A[1]-p[1])*te-i,N=p[2]+(A[2]-p[2])*te-s;u=Math.min(u,Math.hypot(x,P,N))}}return u};for(let c=0;c<900&&se.length<l;c++){let i,s;const u=a();if(u<.3){const p=a.range(70,150),A=a.range(-1,1)*(8+p*.2);i=b[0]*p-b[1]*A,s=b[1]*p+b[0]*A}else if(u<.62||se.length<12){const p=a()<.7?a.range(-1,1.3):a.range(1.3,5.2),A=a.range(r.rust-8,r.rust+34);i=Math.cos(p)*A,s=Math.sin(p)*A}else{const p=a.range(1.75,5.76),A=a.range(124,186);i=Math.cos(p)*A,s=Math.sin(p)*A}const g=a.range(6.5,14);i>86||Math.hypot(i-z,s-T)<56||Math.hypot(i,s)<r.orange+10||se.some(p=>Math.hypot(p.x-i,p.z-s)<7)||f(i,g*.5,s)<13||f(i,g,s)<13||(se.push({x:i,z:s,height:g,h:g}),c%60===59&&await h.yield?.())}await h.yield?.(),se.length&&_(new n.Mesh(nt(a,se,v),I(Ve,Ee,{defines:{SNAG:1}})),0),se.forEach((c,i)=>{i<ve-10&&R[i].set(c.x,c.z,c.h,.17+.012*c.h)})}const qe=Math.min(se.length,ve-10);(d.casters||[]).slice(0,ve-10-qe).forEach((e,l)=>R[qe+l].set(e.x,e.z,e.height??2,e.radius??.6)),await h.yield?.();const ze={transparent:!0,depthWrite:!1,side:n.DoubleSide};{const a=[],o=[];for(let c=0;c<2;c++){const i=a.length/3;for(let s=0;s<=44;s++)for(let u=0;u<=24;u++)a.push(u/24*Math.PI*2,s/44,c);for(let s=0;s<44;s++)for(let u=0;u<24;u++){const g=i+s*25+u,p=g+1,A=g+24+1,re=A+1;o.push(g,A,p,p,A,re)}}const f=new n.BufferGeometry;f.setAttribute("position",new n.Float32BufferAttribute(a,3)),f.setIndex(o),_(new n.Mesh(f,I(st,rt,ze)),2)}await h.yield?.();const Ce=$>0?Math.atan2(w.y,w.x):t.range(0,6.283);{const e=t.fork("veil"),l=Math.round(64*D),a=Math.round(420*D),o=[],f=[];for(let i=0;i<l;i++){const s=4+22*Math.sqrt(e()),u=e()<.45?Ce+e.gauss()*.9:e.range(0,6.283);o.push(Math.cos(u)*s,e.range(5,46),Math.sin(u)*s,e()),f.push(0,e.range(7,12),e.range(9,14),e())}for(let i=0;i<a;i++){const s=4+15*Math.pow(e(),.7),u=e()<.62?Ce+e.gauss()*.8:e.range(0,6.283),g=60*e.range(.35,.98);o.push(Math.cos(u)*s,g,Math.sin(u)*s,e()),f.push(1,e.range(.035,.06),g/7.5+e.range(.2,1.4),e())}const c=ye(!0);W(c,"aA",o,4),W(c,"aB",f,4),c.instanceCount=l+a,_(new n.Mesh(c,I(it,lt,{...ze,premultipliedAlpha:!0})),6)}await h.yield?.();{const e=Math.round(520*D),l=[],a=[],o=t.int(6,8),f=[];let c=0;for(let s=0;s<o;s++){const u=s/o*6.283+t.range(-.3,.3),p=.6+1.6*(.5+.5*Math.cos(u-Ce));c+=p,f.push({az:u,vh:t.range(5,10.5),vy:t.range(3,9),w:p})}for(let s=0;s<e;s++){if(t()<.16)l.push(t.range(0,6.283),t.range(.88,1),t.range(.4,2),t.range(8,14));else{let u=t()*c,g=f[0];for(const p of f)if(u-=p.w,u<=0){g=p;break}l.push(g.az+t.gauss()*.2,t.range(.72,.98),g.vh*t.range(.6,1.15),g.vy*t.range(.6,1.2))}a.push(t(),t.range(9,12),t.range(1.5,3.2),t())}const i=ye(!0);W(i,"aA",l,4),W(i,"aB",a,4),i.instanceCount=e,_(new n.Mesh(i,I(ct,ut,ze)),6)}await h.yield?.();{const e=[],l=[],a=[],o=[],f=O("#ffffff"),c=(x,P)=>{const N=pe(x,f,P),J=Math.max(N.r,N.g,N.b,.001);return[N.r/J*1.1,N.g/J*1.1,N.b/J*1.1]},i={blue:c(v.sapph,.3),green:c(v.emer,.25),amber:c(v.yel,.2),orange:c(v.orange,.22),pale:c(v.turq,.75)};let s=0;const u=(x,P,N,J)=>{e.push(...x),l.push(...P),a.push(...N),o.push(...J),s++},g=Math.round(210*D),p=Math.round(90*D),A=Math.round(105*D),re=Math.round(120*D);for(let x=0;x<g;x++){const P=Math.sqrt(t())*(r.rust-4),N=t.range(0,6.283),J=Math.cos(N)*P,Ne=Math.sin(N)*P;if(J>0&&Ne<0&&t()<.4||P<r.turquoise&&t()<.45)continue;const Ye=P<r.sapphire?i.blue:P<r.emerald?i.green:P<r.yellow+3?i.amber:i.orange,Fe=t.range(4,7);u([J,t.range(1.5,3),Ne],[t(),t.range(7,11),Fe,Fe*t.range(2,2.6)],[t.range(14,30),0,t(),t.range(.09,.15)*(P<r.turquoise?.65:1)],Ye)}for(let x=0;x<p;x++){const P=t.range(8,13);u([t.gauss()*11-w.x*4,t.range(8,18),12+t.gauss()*12],[t(),t.range(22,30),P,t.range(26,40)],[t.range(115,150),.75,t(),t.range(.14,.21)],i.pale)}for(let x=0;x<A;x++){const P=t.range(5,9);u([t.gauss()*2,60*t.range(.7,1.02),t.gauss()*2],[t(),t.range(16,24),P,t.range(22,36)],[t.range(55,100),2,t(),t.range(.22,.32)],[1,1,1])}{const x=t.fork("tower");for(let P=0;P<re;P++){const N=x.range(.02,1),J=.7+2.3*N;u([x.gauss()*J,60*N,x.gauss()*J],[x(),x.range(3.2,5.4),1.5+2.6*N,(4.2+5.2*N)*x.range(.85,1.2)],[x.range(9,16),2,x(),x.range(.5,.78)],[1,1,1])}for(let P=0;P<14;P++)u([x.gauss()*2.6,1.2,x.gauss()*2.6],[x(),x.range(5,7.5),2.4,x.range(7,10)],[x.range(15,24),0,x(),x.range(.16,.24)],i.blue)}for(let x=0;x<16;x++)u([z+t.gauss()*.7,t.range(3.6,5),T+t.gauss()*.7],[t(),t.range(6,9),1.6,t.range(7,11)],[t.range(12,22),1.2,t(),t.range(.22,.32)],[1,1,1]);const te=ye(!0);W(te,"aO",e,3),W(te,"aP",l,4),W(te,"aQ",a,4),W(te,"aTint",o,3),te.instanceCount=s,_(new n.Mesh(te,I(Ge,He,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0})),5)}await h.yield?.();{const e=Math.round(260*D),l=[],a=[];for(let c=0;c<e;c++)l.push(t.range(-70,175),t.range(30,130),t.range(-90,110)),a.push(t(),t.range(2.5,7),t.range(.25,.8),t());const o=ye(!0);W(o,"aO",l,3),W(o,"aP",a,4),o.instanceCount=e;const f=new n.ShaderMaterial({uniforms:y,vertexShader:ht,fragmentShader:ft,transparent:!0,depthWrite:!1,blending:n.AdditiveBlending});_(new n.Mesh(o,f),7)}await h.yield?.();function Le(e,l=5){const a=[],o=[],f=[],c=[];for(const s of e){a.push(s.o[0],s.o[1],s.o[2]),o.push(s.p[0],s.p[1],s.p[2],s.p[3]),f.push(s.q[0],s.q[1],s.q[2],s.q[3]);const u=s.tint||[1,1,1];c.push(u[0],u[1],u[2])}const i=ye(!0);return W(i,"aO",a,3),W(i,"aP",o,4),W(i,"aQ",f,4),W(i,"aTint",c,3),i.instanceCount=e.length,_(new n.Mesh(i,I(Ge,He,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0})),l)}let Me=null,Ae=null;const we=new n.Vector2,Ue=(e,l,a)=>{const o=Math.min(1,Math.max(0,(a-e)/(l-e)));return o*o*(3-2*o)};function Re(e,l,a){y.uTime.value=l;const o=Ae??(Me==null?1:Ue(Q[0],Q[1],Me)),c=3+5*Math.pow(.5+.5*Math.sin(l*1.9+2*Math.sin(l*.7)),2),i=ee*(.955+.03*Math.sin(l*.83)+.015*Math.sin(l*2.1));y.uGey.value.z=c+(i-c)*o,y.uGey.value.w=o,a&&h.renderer&&(h.renderer.getDrawingBufferSize(we),we.x>0&&we.y>0&&(y.uPx.value.set(2/we.x,2/we.y),y.uPxAngle.value=2/(Math.max(.2,a.projectionMatrix.elements[5])*we.y)))}Re(0,0,null);function Ie(e=[]){for(let l=0;l<10;l++){const a=e[l],o=R[ve-10+l];a?o.set(a.x,a.z,a.height??2,a.radius??.6):o.set(1e5,1e5,0,.02)}}function je(e={}){if(e.position&&y.uPortalPos.value.copy(e.position.isVector3?e.position:new n.Vector3(...e.position)),e.normal&&y.uPortalN.value.copy(e.normal.isVector3?e.normal:new n.Vector3(...e.normal)).normalize(),e.radius&&(y.uPortalCol.value.w=e.radius),e.color!=null||e.strength!=null){const l=e.color!=null?e.color.isColor?e.color:O(e.color):null,a=(e.strength??1)*1.5,o=y.uPortalCol.value;if(l)o.set(l.r*a,l.g*a,l.b*a,o.w);else{const f=Math.max(o.x,o.y,o.z,.001);o.set(o.x/f*a,o.y/f*a,o.z/f*a,o.w)}}}const de=e=>e.slice(),Ke={portalSeat:{position:[j.x,j.y,j.z],facing:[-B.x,-B.y,-B.z],heading:[B.x,B.y,B.z],radius:7,tilt:50},flyThrough:E.map(de),viewpoints:{bull:[131,3,268],firstSpray:[z+36,10,T+44],north:de(E[7]),backlit:de(E[10]),south:de(E[13]),crest:de(me),tipOver:de(E[E.length-5]),dive:de(xe)},vent:[0,0,0],rings:r,geyser:{base:[z,0,T],vent:[z,4,T],top:[z,ee,T],coneRadius:4.5,coneHeight:4.4,apronRadius:16,sprayRadius:14,sprayDownwind:20},fan:{direction:b.slice(),halfAngle:k,length:205},hoofprints:{from:[ce.x,0,ce.y],to:[ce.z,0,ce.w]},snags:se.map(e=>({x:e.x,z:e.z,height:e.h})),wind:[w.x,w.y],sunDir:[H.x,H.y,H.z],columnTop:[w.x*26,150,10+w.y*26],blend:{fadeStart:136,sinter:"#"+v.sinter.getHexString(),meadow:"#"+v.meadow.getHexString(),frost:"#"+v.frost.getHexString()}},Pe={c:new n.Vector3(35,40,20),r:105,h:160};return{object:ue,radius:Pe.r,height:Pe.h,center:Pe.c,anchors:Ke,update:Re,dispose(){},ground:!0,groundY:-.3,setProgress(e){Me=e},setEruption(e){Ae=e==null?null:Math.min(1,Math.max(0,e))},setLight:be,setShadowLine(e){y.uShadowY.value=e},setCasters:Ie,setPortal:je,addSteam:Le,uniforms:y,colors:v,get stats(){return{triangles:Math.round(fe),drawCalls:ue.children.length}}}}export{$e as GLSL_BRAID,K as GLSL_COMMON,dt as buildHero};
