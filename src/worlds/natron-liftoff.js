import*as s from"three";import{makePath as z0,clamp as Ie,lerp as Ne,smoothstep as p}from"../kit/core.js";import{makeSky as M0,makeLightRig as k0}from"../kit/sky.js";import*as Ua from"../kit/fauna.js";import*as q from"../kit/fx.js";import{buildHero as A0,BIRD_CLOCK as zs}from"../parts/natron-liftoff.js";const qt=["#9E1B2C","#5C0F1E","#F3A0B4","#D81E3A","#F2EEE6","#CBDDE3","#6E6F73"],Ka=["#9E1B2C","#5C0F1E","#F9C4D0","#D81E3A","#F2EEE6","#CBDDE3","#6E6F73"],Va=40,gt=36,Qe={dist:3400,H:560,Rb:1050,t0:.055,k:1.55},Ha=z=>Qe.H*Math.pow(1-Math.max(z,Qe.t0),Qe.k),F0={morning:{preset:"day",el:18,az:-128,sky:{zenith:"#4f80b4",mid:"#97bcd3",horizon:"#d2dcde",scatter:.2,scatterColor:"#ffe9cf",sunIntensity:9,clouds2:{coverage:.46,softness:.36,scale:.9,opacity:.74,stretch:1,haze:.3,lit:"#fff1e8",shade:"#c3cedb"}},sun:"#ffeeda",sunI:3,fill:"#c6d9e2",fillI:1.18,bounce:.9,fog:"#cfdadc",fogD:42e-5,hor:"#cdd9dd",zen:"#7fa0bb",lum:.8,ripple:.22,wet:0,salt:1.5,exposure:1,sat:1.03,tint:"#fff9f4",shadowTint:"#1a0a14",coneHaze:.2,wallHaze:.6,portal:"#ffd9e2"},dawn:{preset:"dawn",el:3.5,az:-130,sky:{zenith:"#6f86b4",mid:"#c3a9bd",horizon:"#eac4ab",sunIntensity:9,clouds2:{coverage:.36,softness:.5,scale:.8,opacity:.55,stretch:1,haze:.35,lit:"#ffd9c4",shade:"#a995b4"}},sun:"#ffc09a",sunI:2.7,fill:"#d2bcd0",fillI:1.15,bounce:.8,fog:"#dcbcae",fogD:48e-5,hor:"#ecc9b0",zen:"#8793b8",lum:.8,ripple:.16,wet:0,salt:2,exposure:1.05,sat:1.1,tint:"#fff4ec",shadowTint:"#1c1030",coneHaze:.3,wallHaze:.62,portal:"#ffd0b8"},evening:{preset:"goldenHour",el:9,az:76,sky:{zenith:"#41609f",mid:"#b596a6",horizon:"#f2bd7c",horizonPow:5.5,midPow:1.25,scatter:.34,scatterColor:"#ffac5c",scatterPow:4,sunIntensity:11,sunSize:1.7,sunGlow:.85,clouds2:{coverage:.5,softness:.3,scale:1,opacity:.86,stretch:1,haze:.22,detail:.7,lit:"#ffc4b0",shade:"#9d86ac"}},sun:"#ffc48a",sunI:3.2,fill:"#bfbde0",fillI:1.08,bounce:1,fog:"#e2b888",fogD:46e-5,hor:"#eebd84",zen:"#6680b4",rim:[1.9,1.6],glit:1,wallHaze:.4,lum:.8,ripple:.2,wet:0,salt:1.7,exposure:1,sat:1.06,tint:"#fff3e2",shadowTint:"#180c2a",coneHaze:.27,portal:"#ffdcae"},moon:{preset:"night",el:46,az:-125,sky:{},sun:"#c3d0ff",sunI:2.1,fill:"#4c5788",fillI:1.3,bounce:.5,fog:"#161d34",fogD:4e-4,hor:"#33406c",zen:"#0e1430",lum:.55,ripple:.2,wet:0,salt:1,exposure:1.5,sat:1,tint:"#eef2ff",shadowTint:"#0a0c22",coneHaze:.5,wallHaze:.62,portal:"#cfd8ff"},rains:{preset:"day",el:24,az:-134,sky:{zenith:"#6f8496",mid:"#a3b0b8",horizon:"#c3ccce",scatter:.05,sunIntensity:5,clouds:{coverage:.7,softness:.4,scale:1.3,lit:"#e4e4e0",shade:"#6f7a88"}},sun:"#fff2e2",sunI:2.2,fill:"#bccbd4",fillI:1.5,bounce:.8,fog:"#b9c4c8",fogD:6e-4,hor:"#c5cfd2",zen:"#8497a6",lum:.85,ripple:.42,wet:.85,salt:1.2,exposure:1,sat:1.08,tint:"#f6f8ff",shadowTint:"#140a18",coneHaze:.5,wallHaze:.8,portal:"#e6eeff"},noon:{preset:"day",el:58,az:-122,sky:{zenith:"#6d95be",mid:"#b5cbd6",horizon:"#d7dedb",scatter:.06,sunIntensity:9,clouds2:{coverage:.4,softness:.5,scale:.8,opacity:.5,stretch:1,haze:.5,lit:"#ffffff",shade:"#c5ced4"}},sun:"#fffaf0",sunI:2.5,fill:"#d3dee2",fillI:1.25,bounce:1,fog:"#d2d9d6",fogD:62e-5,hor:"#d9e0de",zen:"#84a5c0",lum:.95,ripple:.34,wet:0,salt:.92,exposure:.98,sat:1.08,tint:"#fffdf6",shadowTint:"#1a0a12",coneHaze:.55,wallHaze:.8,portal:"#ffe6ea"}},Ms=`
#ifndef NATRON_RAFT
#define NATRON_RAFT
uniform vec4 uCause;          // the entry lead: centre x, z where its banks end, half width, amount
uniform vec4 uRoute[34];      // the route's first half, tabulated every 16 m of -z: x, cos(heading), path distance, sin(heading)
uniform vec4 uGrp[${Va}];     // where the feeding groups of the approach wade, by the route: path distance, metres right of the line, half length along it, half width across it (unused slots lie far away)
vec2 gRt;                     // set by crustExtra: routeAt(q), for whoever draws next (metres right of the line, path distance)
float gAwash;                 // set by crustExtra: how far this place is one of the plates awash beside the route
vec2 gRouteN;                 // set by routeAt: the unit vector across the route there (to its right)
// where a place lies by the route: metres right of its line, path distance (m). Good to some 30 m either side of the line.
vec2 routeAt(vec2 q){
  float f = clamp(-q.y/16., 0., 32.999); int i = int(f);
  vec4 r = mix(uRoute[i], uRoute[i + 1], f - float(i));
  float dx = q.x - r.x; gRouteN = vec2(r.y, r.w);
  return vec2(dx*r.y, r.z + dx*r.w + min(-q.y, 0.) + max(-q.y - 528., 0.));
}
// the baked field (10 m texels), read through a cubic B-spline (four bilinear taps): a smooth surface with a smooth
// slope, so that no shore, shallow or clearing drawn from it can follow a texel's straight edge or step at its border
vec4 fieldTap(vec2 q){
  vec2 st = (q - uFieldRect.xy)*uFieldRect.z*384. - 0.5, i = floor(st), f = st - i, f2 = f*f, f3 = f2*f;
  vec2 w0 = (1. - 3.*f + 3.*f2 - f3)/6., w1 = (4. - 6.*f2 + 3.*f3)/6., w3 = f3/6., g0 = w0 + w1, g1 = 1. - g0;
  vec2 h0 = (i - 0.5 + w1/max(g0, 1e-4))/384., h1 = (i + 1.5 + w3/max(g1, 1e-4))/384.;
  return (textureLod(uField, h0, 0.)*g0.x + textureLod(uField, vec2(h1.x, h0.y), 0.)*g1.x)*g0.y
       + (textureLod(uField, vec2(h0.x, h1.y), 0.)*g0.x + textureLod(uField, h1, 0.)*g1.x)*g1.y;
}
// PLATES AWASH beside the route, by path distance and metres from its line, from the entry lead to the band's own
// feeding parties without a gap. Two rows on each side of the wheels, the two sides out of step:
//   the inner row: one plate (often with a smaller one off its end) in every 22 m of path, its heart 4.4 to 5.6 m off
//     the line, 5 to 12 m long and 2.2 to 3.8 m across, lying a little askew to the route; never on the line itself
//     (the cone's reflection lies there: nothing nearer than 2.9 m);
//   the outer row: one larger plate in every 30 m of path, its heart 13 to 18 m off the line, 8 to 18 m long and 4.5
//     to 8.5 m across, askew: the plates the lower corners of the picture pass over.
// No plate lies where a feeding group wades (uGrp: the groups' own places), so every bird keeps its ring and its dark
// copy. Returns a level: over 0 inside a plate, falling away outside it.
float plateOne(float along, float across, float c, float sd){
  float h1 = hash11(c*7.13 + sd), h2 = hash11(c*3.91 + sd + 5.), h3 = hash11(c*17.7 + sd + 9.), h4 = hash11(c*5.3 + sd + 13.), h5 = hash11(c*9.7 + sd + 21.);
  float th = (h1 - 0.5)*0.8, ct = cos(th), st = sin(th);
  vec2 d = vec2(along - (c + 0.3 + 0.4*h1)*22., across - (4.4 + 1.2*h2));
  vec2 e = vec2(d.x*ct + d.y*st, d.y*ct - d.x*st)/vec2(2.5 + 3.5*h3, 1.1 + 0.8*h4);
  float lev = 1. - dot(e, e);
  // its companion: a smaller plate lying off one end of it, a little further out
  vec2 e2 = vec2((d.x - (h5 > 0.5 ? 1. : -1.)*(4.8 + 3.6*h3))/(1.3 + 1.5*h4), (across - (4.6 + 1.3*h1))/(0.75 + 0.4*h2));
  lev = max(lev, (1. - dot(e2, e2))*step(0.3, fract(h5*2.)) - 3.*(1. - step(0.3, fract(h5*2.))));
  return h5 > 0.1 && h5 < 0.93 ? lev : -3.;
}
float plateTwo(float along, float across, float c, float sd){
  float h1 = hash11(c*4.37 + sd + 31.), h2 = hash11(c*8.11 + sd + 37.), h3 = hash11(c*13.3 + sd + 43.), h4 = hash11(c*6.7 + sd + 47.), h5 = hash11(c*11.9 + sd + 53.);
  float th = (h1 - 0.5)*1.5, ct = cos(th), st = sin(th);
  vec2 d = vec2(along - (c + 0.25 + 0.5*h5)*30., across - (13. + 5.*h2));
  vec2 e = vec2(d.x*ct + d.y*st, d.y*ct - d.x*st)/vec2(4. + 5.*h3, 2.2 + 2.*h4);
  return h5 > 0.08 ? 1. - dot(e, e) : -3.;
}
float gHalo;                  // set by crustExtra: the shallow round a plate awash (1 at its shore, 0 a metre and a half out)
float gLev;                   // set by crustExtra: the plates' own level without the finest of its three noises (over 0 inside a plate awash, falling away outside it; -9 where none can lie): smooth across a hand-span tile
float crustExtra(vec2 q, float fb, float fa){
  float r = 0.8*fb*smoothstep(0.66, 0.74, vnoise(q*0.055 + 17.) + 0.25*vnoise(q*0.21 + 5.) + 0.11*(vnoise(q*0.83 + 3.) - 0.5));
  vec2 rt = routeAt(q); float al = abs(rt.x); gRt = rt;
  float along = smoothstep(22., 46., rt.y)*(1. - smoothstep(386., 414., rt.y));      // to path distance 414, where the feeding groups' rule ends too (GRP_END)
  gAwash = 0.; gHalo = 0.; gLev = -9.;
  if (along > 0.002 && al < 27.) {
    float sd = (rt.x >= 0. ? 3.7 : 41.3) + uFieldRect.w, s = rt.y + (rt.x >= 0. ? 11. : 0.), c0 = floor(s/22.), c1 = floor(s/30.);
    float lev = max(max(plateOne(s, al, c0 - 1., sd), plateOne(s, al, c0, sd)), plateOne(s, al, c0 + 1., sd));
    lev = max(lev, max(max(plateTwo(s, al, c1 - 1., sd), plateTwo(s, al, c1, sd)), plateTwo(s, al, c1 + 1., sd)));
    // a ragged shore: the level is broken by noise a hand to a stride across, so no plate ends in a ruled or rounded edge
    lev += 1.1*(vnoise(q*0.37 + 11.) - 0.5) + 0.5*(vnoise(q*1.13 + 3.) - 0.5) + 0.2*(vnoise(q*3.9 + 7.) - 0.5) + 0.08;
    // (the stretch, the side band and the clearings only lower the level, so a plate always ends in its own ragged
    // shore, never in a soft ramp; fa is the bake's fourth channel: 0 round the courting block's feeders; uGrp clears
    // the water each feeding group wades in)
    float clr = smoothstep(0.3, 0.7, fa + 0.36*(vnoise(q*0.31 + 9.) - 0.5));
    float gd = 1e4;
    for (int i = 0; i < ${Va}; i++) { vec4 gp = uGrp[i]; gd = min(gd, (length(vec2(rt.y - gp.x, rt.x - gp.y)/gp.zw) - 1.)*gp.w); }
    clr *= smoothstep(-0.4, 1.4, gd + 1.2*(vnoise(q*0.45 + 23.) - 0.5));
    lev -= 1.6*(1. - along*clr*smoothstep(2.9, 3.6, al)*(1. - smoothstep(23., 26.5, al)));
    gAwash = smoothstep(-0.03, 0.03, lev);
    gHalo = smoothstep(-0.95, -0.1, lev);
    gLev = lev - 0.2*(vnoise(q*3.9 + 7.) - 0.5);
  }
  r += min(2.2*gAwash, 0.78);
  float hw = uCause.z*(0.93 + 0.16*vnoise(vec2(q.y*0.045, 9.)));
  float cx = abs(q.x - uCause.x) + 1.6*(vnoise(vec2(q.y*0.11, 3. + step(0., q.x - uCause.x)*40.)) - 0.5) + 0.8*(vnoise(vec2(q.y*0.43, 7.) + q.x*0.2) - 0.5);
  float c = smoothstep(-1.6, 1.6, cx - hw)*smoothstep(uCause.y, uCause.y + 26., q.y)*(1. - smoothstep(40., 60., q.y));
  return r + 0.95*c*uCause.w;
}
#endif
`,ks=`
uniform vec4 uShadow;         // the eye's ground point x, z; the route's heading there as -sin, -cos
uniform vec4 uShadow2;        // strength on crust, strength on brine, the eye's height (m), penumbra half-width per metre of height
uniform vec4 uShadow3;        // the down-sun vector on the ground per metre of height, in the plane's frame (x across to the right, y along, nose -y)
float sdBoxS(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.)) + min(max(d.x, d.y), 0.); }
float sdSegS(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba*clamp(dot(pa, ba)/max(dot(ba, ba), 1e-4), 0., 1.)); }
float planeShadow(vec2 q, float softK){
  vec2 sp = q - uShadow.xy; sp = vec2(sp.x*uShadow.w - sp.y*uShadow.z, sp.x*uShadow.z + sp.y*uShadow.w);
  float h = uShadow2.z; vec2 D = uShadow3.xy;
  vec2 far = sp - D*h; if (dot(far, far) > 400.) return 0.;      // nothing of the airframe falls further than 20 m from the eye's own shadow point
  float hU = max(h + 1.24, 0.2), hL = max(h - 0.98, 0.2), hF = max(h - 1.05, 0.2), hT = max(h - 0.75, 0.2);      // upper wing, lower wing, fuselage, tailplane above the water
  vec2 pU = sp - vec2(0., -1.92) - D*hU, pL = sp - vec2(0., -1.3) - D*hL, pF = sp - vec2(0., 0.9) - D*hF, pT = sp - vec2(0., 4.05) - D*hT;
  float sU = softK*(0.03 + uShadow2.w*hU), sL = softK*(0.03 + uShadow2.w*hL);
  float dU = sdBoxS(pU, vec2(4.3, 0.55)) - 0.15, dL = sdBoxS(pL, vec2(3.9, 0.5)) - 0.15;
  float dF = sdBoxS(pF, vec2(mix(0.42, 0.13, clamp((pF.y + 3.5)/7., 0., 1.)), 3.5)) - 0.06, dT = sdBoxS(pT, vec2(1.35, 0.32)) - 0.1;
  float sh = 1. - smoothstep(-sU, sU, dU);
  sh = max(sh, 1. - smoothstep(-sL, sL, dL));
  sh = max(sh, 1. - smoothstep(-sL, sL, min(dF, dT)));
  // the interplane struts, front and rear as one streak at each of the four stations: under a low sun the two wing
  // bars lie metres apart, and these tie them into one airframe (a box kite's shadow, not two loose bars)
  vec2 aL = vec2(0., -1.3) + D*hL, aU = vec2(0., -1.92) + D*hU;
  float dS = min(min(sdSegS(sp, aL + vec2(1.3, 0.), aU + vec2(1.3, 0.)), sdSegS(sp, aL - vec2(1.3, 0.), aU - vec2(1.3, 0.))),
                 min(sdSegS(sp, aL + vec2(3.2, 0.), aU + vec2(3.2, 0.)), sdSegS(sp, aL - vec2(3.2, 0.), aU - vec2(3.2, 0.)))) - 0.09;
  return max(sh, 0.8*(1. - smoothstep(-sU, sU, dS)));
}`,C0=`
varying vec3 vP;
${q.GLSL_FOG_PARS_VERT}
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.); vP = wp.xyz;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,R0=`
uniform sampler2D uField;
uniform vec4 uFieldRect;      // origin x, z, 1/size
uniform vec3 uCam, uShallow, uDeep, uOrange, uSaltCol, uSkyHor, uSkyZen, uSunDir, uSunCol, uFill, uConeCol, uPinkCol;
uniform float uCrim;          // 1 by day: the brine keeps its crimson far out and gives back the sky only near the horizon; 0 by moon and in the rains
uniform vec4 uCone;           // tan half width of the base, tan summit elevation, t0, profile power
uniform float uTime, uRipple, uLum, uWet, uSaltGain, uSaltBias, uMirage, uGlit, uPix;
uniform vec4 uMass;           // the flock's mass in the mirror: dark rose (rgb), amount
uniform vec4 uFrontP;         // the liftoff line: point on the band's axis (x, z) and the axis direction there (x, z)
uniform vec4 uFrontK;         // axis curvature there (right +), band half width, strength of the pattering line, strength of the flock's mirror
uniform vec4 uMar[3];         // marabou on the crust: x, z, height, 0
uniform vec3 uFlockCol;       // the lit pink of the birds overhead, as the mirror gives it back
uniform vec4 uPools[${gt}];      // pools standing in the crust: x, z, radius, 0 (unused slots lie far away)
uniform vec4 uCloud;          // the cirrus as the mirror gives it back: colour, amount
varying vec3 vP;
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
${q.GLSL_VORONOI}
${Ms}
${q.GLSL_FOG_PARS_FRAG}
uniform sampler2D uSites;
// polygon plates from the baked site grid: (distance to the plate's site, distance to its nearest edge, plate id); eN = unit vector toward that edge
vec2 gSite = vec2(0.);        // set by plates: from x to the plate's own site
vec3 plates(vec2 x, out vec2 eN){
  vec2 n = floor(x), f = x - n, mg = vec2(0.), mr = vec2(0.); float md = 8., id = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j));
    vec4 t = textureLod(uSites, (n + g + 0.5)/64., 0.);
    vec2 r = g + 0.5 + (t.xy - 0.5)*0.6 - f; float d = dot(r, r);
    if (d < md) { md = d; mr = r; mg = g; id = t.z; }
  }
  float me = 8.; eN = vec2(0., 1.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = mg + vec2(float(i), float(j));
    vec4 t = textureLod(uSites, (n + g + 0.5)/64., 0.);
    vec2 r = g + 0.5 + (t.xy - 0.5)*0.6 - f, dr = r - mr; float l2 = dot(dr, dr);
    if (l2 > 1e-5) { float l = sqrt(l2), e = dot(0.5*(mr + r), dr)/l; if (e < me) { me = e; eN = dr/l; } }
  }
  gSite = mr;
  return vec3(sqrt(md), me, id);
}
// a band of a shore between a and b metres in from its waterline, drawn from the footprint e a pixel has across it:
// a band narrower than a pixel keeps a pixel's width and pales by its share of it
float shoreBand(float s, float a, float b, float e){ return smoothstep(a - e, a + e, s)*(1. - smoothstep(b - e, b + e, s))*min((b - a)/(1.2*e), 1.); }
float gFloorLip = 0.; vec3 gFloorCol = vec3(0.);      // set by the floor of the approach: the rims that break the surface
float rip(vec2 q){ return vnoise(q*2.1 + uTime*vec2(0.62, 0.38)) + 0.5*vnoise(q*5.3 - uTime*vec2(0.5, 0.75)); }
${ks}
// what the mirror sees: the sky gradient with its cirrus, and the cone standing at infinity on the -Z axis
vec4 mirrorSky(vec3 R){
  float up = clamp(R.y, 0., 1.);
  vec3 sky = mix(uSkyHor, uSkyZen, sqrt(up));
  vec2 cq = R.xz/(up + 0.16);
  float cl = vnoise(cq*vec2(0.45, 1.25) + vec2(7.3, uTime*0.004))*0.62 + vnoise(cq*vec2(1.1, 3.1) + 2.7)*0.38;
  sky = mix(sky, uCloud.rgb, smoothstep(0.5, 0.78, cl)*uCloud.a*smoothstep(0.015, 0.14, up));
  float fz = max(-R.z, 1e-4);
  float t = abs(R.x)/fz/uCone.x;
  float prof = uCone.y*pow(max(1. - max(t, uCone.z), 0.), uCone.w)/pow(1. - uCone.z, uCone.w);
  float el = R.y/fz;
  float inside = (1. - smoothstep(prof - 0.004, prof + 0.004, el))*step(0., -R.z)*step(t, 1.);
  inside *= smoothstep(0., 0.012 + uMirage*0.05, el);
  return vec4(mix(sky, mix(uConeCol, uSkyHor, 0.12 + 0.5*exp(-max(el, 0.)*40.)), inside*0.94), inside);
}
void main(){
  vec3 V = uCam - vP; float dist = max(length(V), 1e-3); V /= dist;
  vec2 q = vP.xz;
  float latM = dist*uPix, fp = latM/max(V.y, 0.03);             // metres one pixel covers on the sheet: across the view, along it
  vec2 vh = V.xz/max(length(V.xz), 1e-4);                       // the view's direction over the sheet
  // ---- where crust lies: a baked field (10 m) broken up by finer noise ----
  vec4 fld = fieldTap(q);
  float field = fld.r;
  float n1 = vnoise(q*0.021 + 3.1), n2 = vnoise(q*0.083 + 11.7), n3 = vnoise(q*0.31);
  float sd = field + uSaltBias + (n1 - 0.5)*0.22 + (n2 - 0.5)*0.12 + (n3 - 0.5)*0.05*(1. - smoothstep(1., 6., fp));
  sd += 0.6*fld.g*smoothstep(0.7, 0.79, vnoise(q*0.12 + 31.) + 0.2*vnoise(q*0.47 + 3.));   // crust islets and pancakes out in the leads
  sd += crustExtra(q, fld.b, fld.a);                             // rafts in the band, the banks of the entry lead, the plates awash beside the route
  // ---- THE CRUST'S EDGE: ONE LAW FOR EVERY SHORE ON THE LAKE (bank, raft, islet, plate awash), keyed to nothing but
  //      the edge itself: metres in from the waterline, the way the shore faces, the sun. A raft of trona is a slab
  //      that ends in a shore, not a cut: the brine shoals and pales for two or three hands off it; its outermost tiles
  //      are broken away one by one, so the outline is ragged at the scale of the plates' own hand-span tiles and their
  //      cracks stand open and full of brine: these are the wet apron, a hand or two wide, where the brine laps (darker,
  //      pinker, glossy); a thin broken frost line at the top of it; and the slab's raised rim: bright on the shores
  //      that face the sun, dim on those turned from it, its shadow thrown down-sun over the apron and the water or
  //      back over the plate. Every band is drawn from the footprint a pixel has across the shore (shoreBand). ----
  // metres from the shoreline (+ on the crust, - in the brine), from the field's own slope on the screen
  // (the slope is never taken as flatter than 0.04 a metre: where the field lies nearly level just under the shore's
  // value the "shore" is far away, and the shallows and the foam flecks below fade out by the field's own
  // smooth value instead of spreading over the flat as a pale patch)
  vec2 gsd = vec2(dFdx(sd), dFdy(sd)); float gl = max(length(gsd), 1e-5); gsd /= gl;
  float mpp = max(sqrt(gsd.x*gsd.x*latM*latM + gsd.y*gsd.y*fp*fp), 1e-5);
  float dSh = (sd - 0.5)/max(gl/mpp, 0.04);
  // for the edge's own bands: metres in from the waterline (dE) and the unit vector into the crust (nE), from the
  // level's true slope over the sheet (the screen's two differences carried back to metres on the lake). The plates
  // awash are measured by their own level (gLev), every other shore by the field's (sd without the plates' step: a
  // step has no slope to measure by). The slope is taken down to 0.012 a metre for the field and 0.15 for a plate, so
  // on a gently shelving shore the bands keep their width in metres and no nearly level crust is eaten away. A plate
  // counts only where the level's own rule lets its crust show (the field over -0.28).
  vec2 qdx = dFdx(q), qdy = dFdy(q); float qdet = qdx.x*qdy.y - qdx.y*qdy.x; qdet = abs(qdet) < 1e-9 ? 1e-9 : qdet;
  float sd0 = sd - min(2.2*gAwash, 0.78);
  vec2 gA = vec2(qdy.y*dFdx(sd0) - qdx.y*dFdy(sd0), qdx.x*dFdy(sd0) - qdy.x*dFdx(sd0))/qdet;
  vec2 gB = vec2(qdy.y*dFdx(gLev) - qdx.y*dFdy(gLev), qdx.x*dFdy(gLev) - qdy.x*dFdx(gLev))/qdet;
  float gAl = max(length(gA), 0.012), dEA = (sd0 - 0.5)/gAl, dEB = min(gLev/clamp(length(gB), 0.15, 4.), (sd0 + 0.28)/gAl);
  float dE = max(dEA, dEB);
  vec2 nE = dEA > dEB ? gA : gB; nE /= max(length(nE), 1e-6);
  float shK = 1. - smoothstep(0.35, 1.6, fp);                    // how well a shoreline a metre wide can be drawn here
  float eaS = dot(nE, vh), wSh = sqrt(eaS*eaS*fp*fp + (1. - eaS*eaS)*latM*latM), eSh = max(0.012, 0.6*wSh);      // a pixel's footprint across the shore
  // how deep the shore is broken (stretch by stretch), and the shore line itself: the level's own line bitten back by
  // up to 0.22 m in bays a stride across, and then tile by tile by up to nib (0.11 to 0.25 m: a tile or so). On every
  // shore of the field the crust only loses tiles to the brine, so nothing that keeps off dry crust by the level alone
  // (a reflection, a spray crown) comes to lie on a tile; a plate awash is measured without the finest noise of its
  // level (0.26 m: a tile cannot follow it), so its tile line stands within a tile's width of the level's own.
  float rag = 0.2 + 0.25*vnoise(q*0.29 + 51.), nib = 0.55*rag, sW = dE - 0.5*rag*vnoise(q*1.3 + 7.);
  // the hand-span tiles the plates are crazed into (0.19 m; turned and warped against the plates, so the tiles never
  // line up in rows): found here once, for the shore and for the crazing below. A tile stands or is gone whole, by the
  // shore's distance at the tile's own site and the tile's own number: no outline cuts through a tile.
  vec3 pc = vec3(0.5); vec2 eC = vec2(0., 1.); float dC = 1., wC = fp, sTile = sW - nib/3.;
  if (fp < 0.8 && dE > -0.8) {
    mat2 RC = mat2(0.82, 0.57, -0.57, 0.82);
    pc = plates(RC*q*5.2 + 0.8*vec2(vnoise(q*1.7 + 3.), vnoise(q*1.7 + 41.)) + vec2(37.7, 11.3), eC); eC = eC*RC;
    vec2 tq = (gSite*RC)/5.2;                                    // from here to the tile's site, metres
    float ca = dot(eC, vh); dC = pc.y/5.2; wC = sqrt(ca*ca*fp*fp + (1. - ca*ca)*latM*latM);
    sTile = dE + dot(nE, tq) - 0.5*rag*vnoise((q + tq)*1.3 + 7.) - nib*pc.z*pc.z;
  }
  // the shore's bands, in metres in from the line: the apron's inner limit (the apron is the outermost tiles, the
  // tile or so that the brine laps: 0.16 to 0.22 m), the frost line on it, the rim's two flanks; and the shelf under
  // the brine off it
  float aprIn = 0.5*nib + 0.1;
  // the apron's tiles are cut free of their neighbours, their cracks open to the brine; the last tile before the
  // brine is worn down to a stump
  float gapH = 0.004 + 0.02*(1. - smoothstep(0., 0.2, sTile)) + 0.08*(1. - smoothstep(0., 0.05, sTile));
  float mTile = step(0., sTile)*(1. - (1. - smoothstep(aprIn - 0.04, aprIn + 0.1, sW))*(1. - smoothstep(gapH, gapH + max(0.8*wC, 0.004), dC)));
  // where a tile is smaller than a pixel: the share of the tiles that stand
  float mSoft = smoothstep(-nib/3. - eSh, nib/3. + eSh, sW - nib/3.);
  float crustK = mix(mSoft, mTile, 1. - smoothstep(0.07, 0.22, fp));
  float apron = (1. - smoothstep(aprIn - eSh, aprIn + eSh, sW))*shK;
  float frost = shoreBand(sW, aprIn - 0.02, aprIn + 0.03, eSh)*(0.4 + 0.6*smoothstep(0.3, 0.6, vnoise(q*1.9 + 13.)))*shK;
  float rimH = (0.3 + 0.7*smoothstep(0.3, 0.65, vnoise(q*2.6 + 29.)))*shK;      // the rim stands higher in some stretches than in others
  float rimOut = shoreBand(sW, aprIn + 0.02, aprIn + 0.1, eSh)*rimH, rimIn = shoreBand(sW, aprIn + 0.1, aprIn + 0.22, eSh)*rimH;
  float shelf = smoothstep(-0.45, 0., sW)*shK;
  // ---- pools standing in the crust (where the feeding parties wade): a crisp, broken shoreline drawn from the pool's own centre ----
  float dP = 1e4;
  for (int i = 0; i < ${gt}; i++) { vec4 pl = uPools[i]; dP = min(dP, length(q - pl.xy) - pl.z); }
  dP += (vnoise(q*0.5 + 5.) - 0.5)*1.7 + (vnoise(q*2.1 + 9.) - 0.5)*0.4*(1. - smoothstep(0.5, 3., fp));
  float aaP = 0.03 + 0.6*fp, pIn = 1. - smoothstep(-aaP, aaP, dP);
  float wasCrust = smoothstep(0.48, 0.56, sd);                   // a pool is drawn only where it stands in crust
  float pShal = pIn*(1. - smoothstep(0.15, 1.7, -dP))*wasCrust;  // its orange shallows
  // wind: soda dust streaming low over the crust, ruffled bands running down the leads
  vec2 wq = vec2(q.x*0.342 - q.y*0.94, q.x*0.94 + q.y*0.342);
  float gust = vnoise(vec2(wq.x*0.2, wq.y*0.028 - uTime*0.5))*vnoise(vec2(wq.x*0.05 + 5., wq.y*0.011 - uTime*0.17));
  gust = smoothstep(0.1, 0.42, gust)*(1. - smoothstep(6., 40., fp));
  float salt = crustK*(1. - pIn);
  float shore = max(1. - smoothstep(0., 0.13, abs(sd - 0.5)), (1. - smoothstep(0., 0.4, abs(dP)))*wasCrust);       // band around the waterline
  // ---- the wave on the water: where the liftoff line is, measured along and across the band ----
  vec2 fq = q - uFrontP.xy; float fds = dot(fq, uFrontP.zw), flat0 = fq.x*-uFrontP.w + fq.y*uFrontP.z;
  flat0 -= 0.5*uFrontK.x*fds*fds;
  float inBand = (1. - smoothstep(uFrontK.y*0.75, uFrontK.y*1.45, abs(flat0)))*step(abs(fds), 400.);
  float clump = 0.55 + 0.45*smoothstep(0.25, 0.7, vnoise(q*0.045 + 4.7));
  float runZ = smoothstep(-3., 7., fds)*(1. - smoothstep(38., 58., fds))*inBand*clump*uFrontK.z;      // birds pattering here
  float wakeZ = smoothstep(-150., -30., fds)*(1. - smoothstep(0., 30., fds))*inBand*uFrontK.z;        // rings settling behind the line
  // ---- brine ----
  float paw = max(max(smoothstep(0.5, 0.78, vnoise(q*0.03 + uTime*vec2(0.06, 0.035))), gust*0.8), max(0.12*wakeZ, 0.7*runZ));
  float r0 = rip(q); vec2 g = vec2(rip(q + vec2(0.3, 0.)) - r0, rip(q + vec2(0., 0.3)) - r0);
  float fine = 1. - smoothstep(0.02, 0.12, fp);                    // close under the wheels: wavelets a hand wide
  float r1 = vnoise(q*11. + uTime*vec2(1.1, 0.7)) + 0.6*vnoise(q*23. - uTime*vec2(0.9, 1.4));
  g += vec2(vnoise(q*11. + vec2(0.05, 0.) + uTime*vec2(1.1, 0.7)), vnoise(q*11. + vec2(0., 0.05) + uTime*vec2(1.1, 0.7)))*fine*1.6 - vnoise(q*11. + uTime*vec2(1.1, 0.7))*fine*1.6;
  float amp = uRipple*(0.1 + 0.75*paw)/(1. + dist*0.035);
  vec3 N = normalize(vec3(-g.x*amp, 1., -g.y*amp));
  float cv = clamp(dot(N, V), 0., 1.), m = 1. - cv;
  float m2 = m*m, Fr = mix(0.03 + 0.9*m2*m2*sqrt(max(m, 0.)), 0.06 + 0.9*m2*m2*m2*m2, uCrim);                  // a dense, dark brine: crimson from above and far out over the lake, paling to the sky only in the last few degrees above the horizon
  Fr = mix(Fr, max(Fr, 0.13), pIn*wasCrust*(1. - smoothstep(0.4, 3.2, -dP)));      // water over pale mud shows a little more sky: along a pool's own shore only (its middle is as deep as the lead it opens into, so no tone steps along the bank's line)
  // THE BRINE IS A MIRROR FROM SOME FORTY METRES OUT, wherever it lies and from wherever it is seen: looked into steeply,
  // close to, it shows its own red body and what lies under it; looked along, from 24 m on, the surface takes over, and
  // from 56 m at least 0.58 of what it gives back is what stands over it (the sky, stained; the cone; the flock).
  // 0.58: enough that the pale sky wins over the crimson body, so the lead pales toward the horizon and anything dark
  // in the mirror stands out against it, and little enough that the water is still a crimson mirror.
  Fr = mix(Fr, max(Fr, 0.58), smoothstep(24., 56., dist));
  vec3 R = reflect(-V, N); R.y = abs(R.y);
  vec4 mSky = mirrorSky(R); vec3 refl = mSky.rgb;
  refl *= mix(vec3(1.), mix(vec3(1., 0.8, 0.83), vec3(0.62, 0.44, 0.47), mSky.a), uCrim);      // the sky comes back off the brine a little stained; the cone's grey, a dark thing in dark red water, comes back darker and redder: grey-crimson
  float mot = 0.55*vnoise(q*0.018) + 0.3*vnoise(q*0.09 + 7.) + 0.15*vnoise(q*0.6);
  vec3 body = mix(uDeep*1.45, uShallow*1.1, smoothstep(0.25, 0.9, mot));
  body = mix(body, uOrange, max(max(mix(smoothstep(0.34, 0.5, sd), 1. - smoothstep(0.1, 1.5, -dSh), shK), 0.8*gHalo*(1. - gAwash))*0.62*(1. - pIn), pShal*0.85));    // soft orange shallows hugging every shore, a metre and a half wide
  // just off the shore the crust runs on under the brine for two or three hands: shallower still, and a little paler
  body = mix(body, mix(uOrange*1.1, uSaltCol*(uFill*0.92 + uSunCol*uSunDir.y)*0.3183*uSaltGain*vec3(1., 0.62, 0.58), 0.22), 0.4*shelf*shelf*(1. - pIn));
  // ---- THE LAKE'S FLOOR UNDER THE APPROACH: salt polygons seen through the shallow brine. The same plates the crust
  //      is crazed into (one site in every 3.7 m, so they are 2 to 6 m across) run on under the water: each lies at
  //      its own depth and every one is crimson (a third of them deep: the brine's deep crimson; the rest a crimson a
  //      little lighter and warmer the shallower they lie; none rose, none pale), its raised rim shows
  //      as a pale line that breaks the surface here and there in a thread of wet white salt. Laid in the lake's own
  //      coordinates, so close to the rims converge on the cone and streak under the wheels. By path distance and
  //      metres from the route's line (gRt), from behind the entry to the band; the ripple bends them. The floor is
  //      seen only near the eye (to some 40 m): further out the water is mirror and carries the sky and the cone. ----
  {
    float fAl = smoothstep(-60., -20., gRt.y)*(1. - smoothstep(404., 450., gRt.y));
    float fAc = 1. - smoothstep(19., 30., abs(gRt.x) + 7.*(vnoise(q*0.06 + 41.) - 0.5));
    // (the footprint a pixel really has here, from the picture itself: seen small through the previous world's ring a
    // pixel covers more water than the lens's own figure says, and the floor must melt into the crimson there too)
    float sK = clamp(max(length(dFdx(q)), length(dFdy(q)))/max(fp, 1e-4), 1., 8.), fpS = fp*sK, latS = latM*sK;
    float fNear = 1. - smoothstep(0.45, 1.5, fpS*0.27);
    // the floor shows only near the eye, where the look into the brine is steep: fading from 16 m, and gone by 40 m,
    // where the water is mirror (above). Its rims go with it: a rim is 5 cm high, and no net of them lies on the far lead.
    float fEye = 1. - smoothstep(16., 40., dist);
    float fK = fAl*fAc*fNear*fEye*(1. - salt)*(1. - pIn);
    if (fK > 0.004) {
      vec2 qf = q + 0.22*g*(0.5 + 2.*uRipple);                                  // the ripple bends what lies under it
      vec2 eF = vec2(0., 1.); vec3 pf = plates(qf*0.27, eF);
      float deF = pf.y/0.27, idF = pf.z;
      // shoals and leads: the floor comes up in shoals some tens of metres long, lying down the lake; between them leads
      float shoal = smoothstep(0.24, 0.48, vnoise(vec2(q.x*0.085, q.y*0.036) + 61. + uFieldRect.w*vec2(1.37, 0.71)) + 0.34*(vnoise(q*0.21 + 13.) - 0.5) + 0.12*(idF - 0.5));
      shoal *= 0.6 + 0.4*smoothstep(1.4, 5.0, abs(gRt.x) + 1.6*(vnoise(vec2(gRt.y*0.09, 5.)) - 0.5));      // deeper under the route's line
      shoal = max(0.3 + 0.7*shoal, 0.75*gHalo);      // in the leads the floor lies deeper but its rims still show faintly; round every plate awash it is close under the surface
      // EACH CELL LIES AT ITS OWN DEPTH (by its own number, idF) AND EVERY CELL IS CRIMSON: a third of the cells lie deep,
      // and the brine over them keeps its deep crimson; the rest lie nearer the surface, and the nearer a cell lies the
      // more the brine over it takes of a crimson a little lighter and warmer than its own body (below: under). No
      // cell is rose and none is pale: the polygons belong to the white crust, the water between is red.
      float topF = smoothstep(0.333, 0.39, idF)*(0.5 + 0.5*smoothstep(0.39, 1., idF));      // how near the surface this cell lies (0: deep)
      float eaF = dot(eF, vh), wF = sqrt(eaF*eaF*fpS*fpS + (1. - eaF*eaF)*latS*latS);      // a pixel's footprint across this rim
      float rH = 0.1 + 0.07*idF, rD = max(rH, 0.8*wF);
      // a rim narrower than a pixel keeps a pixel's width and pales by its share of it (so many of them never sum to a
      // net), and is gone when a pixel is a stride across it; one that runs with the view stays a line a little longer
      float rimF = (1. - smoothstep(rD*0.45, rD, deF))*min(rH/rD, 1.)*(1. - smoothstep(0.35, 1.3, wF));
      float glowF = 1. - smoothstep(0., 0.55 + 1.5*wF, deF);                     // the rim's flank falling away into the red
      vec3 floorLit = uSaltCol*(uFill*0.92 + uSunCol*uSunDir.y)*0.3183*uSaltGain;
      vec3 under = mix(uShallow*1.3, uOrange, 0.1);                              // the shallowest cells: the brine's own crimson, a little lighter (uShallow x 1.3, where the body's lightest is uShallow x 1.1) and a tenth toward the orange of the shallows (warmer)
      float washF = 1. - smoothstep(0.2, 1.0, fpS);                                // each cell's own tone only while a cell is far bigger than a pixel
      body = mix(body, uDeep*1.2, 0.5*fK*washF*(1. - smoothstep(0.3, 0.36, idF)));      // the deep third: the darkest crimson of the brine
      body = mix(body, under, fK*(0.7 + 0.3*shoal)*washF*topF*(0.5 + 0.34*glowF));
      body = mix(body, floorLit*vec3(1., 0.66, 0.62)*0.86, fK*shoal*rimF*(0.4 + 0.4*topF));
      // where a rim stands proud of the water: short threads of wet white salt, with the brine dark against them
      float proud = smoothstep(0.6, 0.8, vnoise(q*0.8 + idF*37.) + 0.25*topF)*smoothstep(0.55, 0.9, shoal)*smoothstep(0.35, 0.6, vnoise(q*0.13 + 83.));
      gFloorLip = fK*proud*rimF;
      gFloorCol = floorLit*1.02;
    }
  }
  // pink scum lying in the shallows: drifts a few metres long, their place and their outline bent by noise at three
  // sizes and the shallow's own limit broken the same way, so that no drift ends in a level band or a ruled edge
  float scW = vnoise(q*0.16 + 31.), scV = vnoise(q*0.13 + 17.), scF = vnoise(q*0.9 + 5.);
  vec2 sq = q + vec2(7.*(scW - 0.5), 6.*(scV - 0.5)) + 1.2*vec2(scF - 0.5, vnoise(q*0.7 + 23.) - 0.5);
  float scum = 0.66*vnoise(sq*vec2(0.07, 0.26) + vec2(uTime*0.03, 0.)) + 0.34*vnoise(sq*vec2(0.31, 0.57) + 3.);
  scum = smoothstep(0.55, 0.8, scum)*smoothstep(0.25, 0.45, sd + 0.16*(scW - 0.5) + 0.1*(scF - 0.5))*(1. - smoothstep(2., 9., fp))*(0.5 + 0.5*scF);
  body = mix(body, uPinkCol*0.55, scum*0.5);
  body *= uLum*(0.9 + 0.2*vnoise(q*vec2(0.012, 0.11) + vec2(uTime*0.006, 0.)));
  body *= 1. + (0.16 + 0.2*paw)*(r0 - 0.75)*(1. - smoothstep(0.4, 3., fp))*(1. - 0.6*fine) + 0.14*(r1 - 0.8)*fine;        // moving ripple texture in the brine itself
  // the flock overhead, given back by the mirror as short trembling pink dashes that point at the eye
  vec2 vq = q - uCam.xz; float vr = max(length(vq), 0.5), va = vr > 0.5 ? atan(vq.x, -vq.y) : 0.;
  float stk = vnoise(vec2(va*90., log(vr)*13. - uTime*0.3))*0.6 + vnoise(vec2(va*210. + 7., log(vr)*27. + uTime*0.5))*0.4;      // short dashes, broken across the view: never long streaks down the picture
  float flk = smoothstep(0.6, 0.8, stk + 0.06*(r0 - 0.75))*uFrontK.w*smoothstep(9., 30., vr)*(1. - smoothstep(60., 150., vr))*inBand;
  flk *= 1. - smoothstep(-25., 25., fds);                                 // only behind the liftoff line: there is nothing aloft ahead of it
  // Under the wave the mirror does not see the sky: it sees the wall. Its mass darkens the water to crimson and rose from
  // the eye out to the pattering line, and the birds themselves are short strokes darker than the brine, pointing at the
  // eye, broken by the ripple and thinning toward the lens. (When the flock has parted, in the lane, the sky comes back.)
  float mEdge = fds + 16.*(vnoise(q*0.045 + 3.) - 0.5) + 7.*(vnoise(q*0.21 + uTime*0.15) - 0.5);      // no ruled edge: the mass thins out raggedly either side of the line
  float wallM = uMass.a*inBand*(1. - smoothstep(-52., 34., mEdge))*smoothstep(3., 14., vr);
  refl = mix(refl, uFlockCol, flk*0.72*(1. - uMass.a));
  refl = mix(refl, uMass.rgb, wallM*0.74);
  // the cone in the mirror: a dark grey wedge on the axis, stronger than the sky around it (a dark thing in a mirror
  // reads: under its image no sky lights the surface, so four fifths of what the water gives back there is the cone's grey)
  float FrC = mix(Fr, max(Fr, 0.8), mSky.a*(1. - wallM));
  // cat's paws drifting over the mirror: far off a ruffled patch gives back less sky (a darker crimson streak on the
  // pale water), close under the wheels it is a lighter, cooler patch alive with wavelets
  float pawS = smoothstep(0.5, 0.78, vnoise(q*0.03 + uTime*vec2(0.06, 0.035)));
  vec3 water = mix(body, refl, FrC*(1. - 0.3*pawS*(1. - mSky.a))) + paw*0.045*refl;
  water += pawS*uSkyZen*max(0.075 + 0.09*(r0 - 0.75) + 0.06*(r1 - 0.8)*fine, 0.)*(1. - smoothstep(0.5, 4., fp));
  water += uSkyZen*vec3(0.015, 0.03, 0.035)*uCrim;                    // the sky's own light in the brine: crimson, never a flat red
  float strokes = smoothstep(0.58, 0.78, stk + 0.1*(r0 - 0.75))*wallM*smoothstep(10., 34., vr)*(1. - smoothstep(60., 130., vr));
  water = mix(water, mix(uDeep*0.7, uFlockCol*0.45, 0.35), strokes*0.46);
  // the sun's path: a column of light under the sun, sparks where a wavelet is bigger than a pixel, long broken streaks far off
  {
    vec3 R0 = reflect(-V, vec3(0., 1., 0.)); R0.y = abs(R0.y);
    vec2 sh = uSunDir.xz/max(length(uSunDir.xz), 1e-3), rh = R0.xz/max(length(R0.xz), 1e-3);
    float daz = 1. - dot(sh, rh), del = R0.y - uSunDir.y;
    float lobe = exp(-daz/(0.0035 + 0.03*uRipple + 0.012*paw))*exp(-del*del/(del < 0. ? 0.03 : 0.12));
    if (lobe > 0.002) {
      float spk = vnoise(q*7. + uTime*vec2(1.3, 0.9))*vnoise(q*13. - uTime*vec2(1.1, 1.7));
      float spark = smoothstep(0.3, 0.6, spk)*(1. - smoothstep(0.12, 1.1, fp));
      float lane = dot(q - uCam.xz, vec2(-sh.y, sh.x));
      float strk = smoothstep(0.3, 0.7, vnoise(vec2(lane*0.8, dot(q, sh)*0.045 - uTime*0.25))*0.7 + vnoise(vec2(lane*2.3 + 5., dot(q, sh)*0.11 + uTime*0.4))*0.3);
      water += uSunCol*vec3(1., 0.84, 0.66)*uGlit*lobe*(0.06 + 0.18*strk + 0.9*spark);
    }
  }
  // ---- windrows: thin broken lines of soda foam lying down the wind on the open brine, each a string of pale clots,
  //      gathered where the wind has herded them and thick along the lee shores ----
  vec3 saltLit = uSaltCol*(uFill*0.92 + uSunCol*uSunDir.y)*0.3183*uSaltGain;
  float wx = wq.x + 1.7*vnoise(q*0.11 + 31.) + 0.5*vnoise(q*0.47 + 5.);          // the rows wander: never a ruled line
  float rowN = vnoise(vec2(wx*1.7, wq.y*0.04 + uTime*0.02))*0.62 + vnoise(vec2(wx*4.9 + 3., wq.y*0.12 - uTime*0.03))*0.38;
  float rowZ = 0.25 + 0.75*smoothstep(0.38, 0.66, vnoise(q*0.021 + 17.)) + 0.6*smoothstep(0.36, 0.48, sd);
  float clot = smoothstep(0.36, 0.8, vnoise(q*2.3 + vec2(uTime*0.05, 0.)) + 0.4*vnoise(q*6.7 - vec2(0., uTime*0.04)));
  float rows = smoothstep(0.62, 0.82, rowN)*min(rowZ, 1.)*mix(clot, 0.55, smoothstep(0.08, 0.5, fp))*(1. - smoothstep(0.7, 4., fp))*(1. - pIn);
  water = mix(water, mix(saltLit, uPinkCol*(uFill + uSunCol*0.4)*0.3183, 0.35)*0.92, rows*(0.015 + 0.525*smoothstep(18., 70., vr)));      // not under the wheels: seen from three metres a clot is a pale smear
  // ---- scum lines running with the route (by path distance and metres from its line, from the entry to path
  //      distance 446 to 486, among the band's first runners): each a broken string of pale soda foam, runs a stride or two long with gaps between them, a few pixels
  //      wide close to with a soft ragged edge, a little pinker and dimmer than a plate's lip, thinning to nothing far
  //      off. They wander, converge on the cone, streak under the wheels and slide slowly along. ----
  {
    vec2 rt = routeAt(q);
    float sAl = smoothstep(2., 30., rt.y)*(1. - smoothstep(446., 486., rt.y))*(1. - smoothstep(16., 24., abs(rt.x)))*(1. - smoothstep(20., 58., vr));
    if (sAl > 0.003) {
      float lw = rt.x + 1.7*(vnoise(vec2(rt.y*0.03, 3.)) - 0.5) + 0.7*(vnoise(vec2(rt.y*0.13, 7.)) - 0.5) + 0.2*(vnoise(vec2(rt.y*0.7, 11.)) - 0.5);
      float li = floor(lw/3.3), hs = hash11(li*17.3 + 3.), lf = (fract(lw/3.3) - 0.5)*3.3 - (hs - 0.5)*1.6;
      float ea = dot(gRouteN, vh), wE = sqrt(ea*ea*fp*fp + (1. - ea*ea)*latM*latM);      // a pixel's footprint across the line
      float sl = rt.y - uTime*(0.45 + 0.9*hs) + hs*37.;                                   // metres along the line, sliding
      // runs: one in every 5.5 m of a line, 1.4 to 3.6 m long, tapering at both ends; a quarter of the places are empty
      float rc = floor(sl/5.5), rf = sl/5.5 - rc, r1 = hash11(rc*3.7 + li*11.1), r2 = hash11(rc*9.1 + li*5.3 + 2.), r3 = hash11(rc*5.9 + li*7.7 + 4.);
      float tr = (rf - 0.06 - 0.3*r1)/(0.25 + 0.4*r2);
      float run = smoothstep(0., 0.22, tr)*(1. - smoothstep(0.78, 1., tr))*step(0.25, r3)*step(0.4, hash11(li*9.7 + 2.));
      if (run > 0.003) {
        // clots: the string is thick and thin, and broken again at every stride
        float clt = (0.45 + 0.55*smoothstep(0.3, 0.7, vnoise(vec2(sl*1.9, li*3.1 + lf*9.))))*smoothstep(0.24, 0.42, vnoise(vec2(sl*2.3 + 5., li*5.3)));
        float hw0 = (0.02 + 0.02*hash11(li*5.1 + 1.))*(0.55 + 0.9*vnoise(vec2(sl*1.3, li*4.3)))*(0.4 + 0.6*run);
        float hw = max(hw0*(0.7 + 0.6*vnoise(vec2(sl*6.3, li*1.7))), 0.8*wE);      // never drawn narrower than a pixel and a half: below that it pales instead
        float ln = (1. - smoothstep(hw*0.3, hw, abs(lf)))*min(hw0/max(hw, 1e-4), 1.)*run*clt*sAl*(1. - pIn);
        water = mix(water, mix(saltLit, uPinkCol*(uFill + uSunCol*0.45)*0.3183, 0.55)*0.78, ln*0.62);
      }
    }
  }
  water = mix(water, gFloorCol, 0.8*gFloorLip);      // the rims that stand proud of the brine (the floor, above)
  // the pattering line: far off a broken white band, close to a field of footfalls each flashing and fading
  float patFar = smoothstep(0.2, 0.9, fp);
  float brk = smoothstep(0.3, 0.62, vnoise(q*vec2(0.42, 0.42) + uTime*vec2(0.5, 0.3)) + 0.25*vnoise(q*1.9 + uTime*2.1) - 0.12);
  float fdl = fds + 7.*(vnoise(q*0.09 + 23.) - 0.5) + 2.5*(vnoise(q*0.37 + uTime*0.3) - 0.5);          // the line wanders and frays: parties run, not a ruled arc
  float lineZ = smoothstep(-15., -8., fdl)*(1. - smoothstep(-4., 2., fdl))*inBand*uFrontK.z;     // a band ten metres deep on the eye's side of the liftoff line: seen UNDER the wall's lowest rank, over the dark water
  // broken twice over: into runs some metres long, and each run into dashes that flash and fade
  float brk2 = smoothstep(0.3, 0.52, vnoise(q*vec2(0.22, 0.22) + uTime*vec2(0.4, 0.3)) + 0.2*vnoise(q*1.3 - uTime*1.2))
    *(0.5 + 0.5*smoothstep(0.34, 0.6, vnoise(q*1.6 + uTime*vec2(1.7, -1.2))));
  float line = lineZ*brk2*patFar;
  float foam = max(runZ*0.3*brk*patFar, line);     // close to, the hero's spray crowns alone mark the footfalls (no pale patches on the brine)
  water = mix(water, uSaltCol*(uFill + uSunCol*(uSunDir.y + 0.3))*0.3183*(1.4 + 0.55*line), clamp(foam, 0., 0.86));
  // ---- crust: plates 3.7 m across (the same sites the rim ridges are built on), each with a thin raised rim and the
  //      rim's thin shadow, each crazed into hand-sized tiles; wet seams between rafts to the middle distance (9 m), old
  //      red seams far out (23 m). Every line is drawn from the footprint a pixel has ACROSS it (long along the view,
  //      short across it): a line narrower than a pixel and a half keeps that width and pales; none widens into a wedge. ----
  float w1 = fp*0.27, nearK = 1. - smoothstep(0.12, 0.5, w1);
  vec2 eN = vec2(0., 1.); vec3 pv = vec3(0.5, 0.5, 0.5);
  if (nearK > 0.003 && salt > 0.003) pv = plates(q*0.27, eN);
  float de = pv.y/0.27, cell = pv.z;                                // metres to the nearest plate edge, plate id
  float sunH = max(length(uSunDir.xz), 1e-3);
  float ea = dot(eN, vh), wE = sqrt(ea*ea*fp*fp + (1. - ea*ea)*latM*latM);      // a pixel's footprint across this edge
  float rimHalf = 0.06 + 0.025*n3, rimD = max(rimHalf, 0.75*wE);
  float rim = (1. - smoothstep(rimD*0.5, rimD, de))*pow(min(rimHalf/rimD, 1.), 0.6)*nearK;
  float facing = dot(-eN, uSunDir.xz)/sunH;                          // this flank of the rim looks at the sun (+) or away (-)
  float shW = min(0.05*abs(dot(eN, uSunDir.xz))/max(uSunDir.y, 0.07), 0.1), shD = max(shW, 0.6*wE);       // the rim's shadow on the plate behind it: no wider than a hand
  float rimSh = smoothstep(0.05, 0.4, -facing)*smoothstep(rimD*0.7, rimD, de)*(1. - smoothstep(rimD + shD*0.5, rimD + shD, de))*pow(min(shW/max(shD, 1e-4), 1.), 0.7)*nearK;
  vec3 vm = voronoi(q*0.105 + 9.3);
  float w2 = fp*0.105, plate = (1. - smoothstep(0.014 + w2*0.3, 0.04 + w2*0.9, vm.y))*(1. - smoothstep(0.15, 0.6, w2))*(1. - 0.9*nearK);
  float big = voronoi(q*0.043 + 5.).y;
  float w3 = fp*0.043, seam = (1. - smoothstep(0.01 + w3*0.3, 0.02 + w3*0.9, big))*(1. - smoothstep(0.2, 0.75, w3))*(1. - 0.9*nearK);
  float pl = hash11(vm.z*57.3);
  vec3 alb = uSaltCol*(0.9 + 0.1*n2)*(1. - 0.2*cell*nearK)*(0.93 + 0.09*pl);
  float margin = (1. - smoothstep(rimD, rimD + 0.55, de))*nearK;     // each plate is a shallow dish: its edge curls up to the rim
  float damp = smoothstep(0.7, 0.76, cell)*nearK*smoothstep(0.25, 0.55, de)*smoothstep(0.34, 0.5, vnoise(q*0.9 + cell*40.));   // plates still damp: pink, glossy
  alb = mix(alb, uPinkCol, 0.03 + 0.1*n1*pl + 0.3*damp);                       // pink staining, plate by plate
  float zone = smoothstep(0.46, 0.62, vnoise(q*0.037 + 21.))*(0.6 + 0.4*pl);     // rafts where the algae have come up through the salt: rose, rust at the wet edge
  alb = mix(alb, mix(uOrange*1.5, uPinkCol*1.05, smoothstep(0.52, 0.62, sd)), zone*0.3);
  alb *= 1. - 0.1*smoothstep(0.5, 0.8, vnoise(q*0.011 + 2.))*(1. - nearK*0.5);    // old grey crust in broad patches
  alb *= 0.93 + 0.07*vnoise(q*5.)*nearK;
  // Each plate is crazed into hand-sized tiles (a hand's span, 0.19 m), every tile its own shade and a shallow saucer: the
  // cracks dark and fine, the tile's lip bright where it faces the sun and dim where it turns away. Held out to twenty
  // metres and more: the cracks that run with the view stay lines, those across it melt into the plate's tone.
  float crzK = (1. - smoothstep(0.25, 0.8, fp))*salt*nearK, bev = 0.;
  if (crzK > 0.003) {      // (the tiles themselves were found above, with the shore: pc, eC, dC, wC)
    float cD = max(0.009, 0.7*wC), onPlate = smoothstep(rimD, rimD + 0.1, de);
    float crack = (1. - smoothstep(cD*0.45, cD, dC))*pow(min(0.009/cD, 1.), 0.45)*crzK*onPlate;
    float tK = crzK*(1. - smoothstep(0.05, 0.2, fp));                // a tile's own shade and lip only while a tile is bigger than a pixel
    alb *= 1. + 0.2*(pc.z - 0.5)*tK;
    bev = dot(-eC, uSunDir.xz)/sunH*(1. - smoothstep(cD, cD + 0.025 + wC, dC))*tK*onPlate;
    alb *= 1. - 0.55*crack;
  }
  float nearD = 1. - smoothstep(0.07, 0.4, fp);                     // salt nodules and popcorn crystals, crisp
  float b0 = vnoise(q*9.) + 0.5*vnoise(q*23.), b1 = vnoise(q*9. + uSunDir.xz*0.4) + 0.5*vnoise(q*23. + uSunDir.xz*0.6);
  float nod = smoothstep(1.04, 1.14, b0);
  alb = mix(alb, uSaltCol*1.08, nod*0.55*nearD);
  alb = mix(alb, alb*vec3(0.86, 0.8, 0.8), smoothstep(0.5, 1.5, de)*0.45*nearK);   // dished, dirtier centres
  alb = mix(alb, uSaltCol*1.16, rim*0.75);
  float wetEdge = 1. - smoothstep(0.5, 0.56, sd);                        // damp, darker margin
  float poolDamp = (1. - smoothstep(0.5, 2.4, dP))*(1. - pIn);            // the wet halo round a pool
  float poolRim = (1. - smoothstep(0.12, 0.5 + fp, dP))*(1. - pIn);       // and its pale lip of fresh salt
  alb = mix(alb, mix(uShallow, uOrange, 0.45)*1.25, clamp(plate*0.42 + seam*0.5 + wetEdge*0.5 + poolDamp*0.1, 0., 0.85));
  alb = mix(alb, uSaltCol*1.2, poolRim*0.9);
  // the crust's edge (see the law above): the slab's raised rim of clean salt, lit on the shores that face the sun and
  // dim on those turned from it; the wet apron outside it, darker and pinker; the frost line at the apron's top; and
  // the rim's shadow: back over the plate on the sunward shores (castIn), out over the apron and the brine on the
  // others (castOut, laid on below). Its length is the rim's height (0.07 m) over the tangent of the sun's elevation.
  float sunS = dot(-nE, uSunDir.xz)/sunH, shLen = min(0.07*sunH/max(uSunDir.y, 0.07), 0.45)*abs(sunS);
  float castIn = shoreBand(sW, aprIn + 0.22, aprIn + 0.22 + shLen, eSh)*smoothstep(0.05, 0.35, sunS)*shK;
  float castOut = shoreBand(sW, aprIn + 0.02 - shLen, aprIn + 0.02, eSh)*smoothstep(0.05, 0.35, -sunS)*shK;
  alb = mix(alb, uSaltCol*1.14, 0.6*min(rimOut + rimIn, 1.));
  alb = mix(alb, alb*vec3(0.6, 0.43, 0.47) + 0.05*uPinkCol, 0.85*apron);
  alb = mix(alb, uSaltCol*1.2, 0.8*frost);
  float ndl = clamp(uSunDir.y*(1. - 0.5*rim)*(1. - 0.4*rimOut) + facing*(rim*0.62 + margin*0.1) + sunS*(0.75*rimOut - 0.35*rimIn) + (b0 - b1)*0.4*nearD + 0.26*bev, 0.02, 1.5);
  vec3 lit = alb*(uFill*(0.92 - 0.2*rim*smoothstep(0., 0.3, -facing) - 0.12*rimSh - 0.3*rimOut*smoothstep(0., 0.3, -sunS) - 0.14*castIn) + uSunCol*ndl*(1. - 0.7*rimSh)*(1. - 0.8*castIn))*0.3183*uSaltGain;
  // soda dust streaming over the plates in long streaks
  float streak = vnoise(vec2(wq.x*0.9, wq.y*0.07 - uTime*0.62))*0.65 + vnoise(vec2(wq.x*2.6 + 4., wq.y*0.16 - uTime*1.1))*0.35;
  float dust = gust*smoothstep(0.42, 0.78, streak)*(1. - smoothstep(0.1, 0.7, fp));
  lit = mix(lit*(1. + 0.14*gust), uSaltCol*(uFill + uSunCol*(uSunDir.y + 0.25))*0.3183*uSaltGain*0.98, dust*0.42);
  lit = mix(lit, lit*vec3(0.86, 0.7, 0.72) + 0.3*water, 0.5*gAwash);      // a plate awash: thin, wet, stained through by the brine under it
  float wet = clamp(uWet + wetEdge*0.35 + seam*0.3 + plate*0.4 + damp*0.5 + poolDamp*0.5*(1. - poolRim) + 0.45*gAwash + 0.5*apron, 0., 1.);
  vec3 Rs = reflect(-V, vec3(0., 1., 0.)); Rs.y = abs(Rs.y);
  float ms = 1. - clamp(V.y, 0., 1.); float ms2 = ms*ms;
  lit = mix(lit, mirrorSky(Rs).rgb, wet*(0.08 + 0.22*uWet + 0.7*ms2*ms2*ms));
  // ---- foam and pink scum line where brine meets crust ----
  float lace = shore*smoothstep(0.35, 0.7, vnoise(q*1.3 + uTime*0.05))*(1. - smoothstep(1.5, 8., fp))*(1. - 0.8*shK);       // far off only: close to, the lip is drawn below
  vec3 c = mix(water, lit, salt);
  c = mix(c, uSaltCol*(uFill + uSunCol*uSunDir.y)*0.3183*0.9, lace*0.3*(1. - salt*0.6));
  // the shoreline close to (the "lip" of the line above is now the crust's own edge): the rim's shadow thrown out over
  // the apron and the brine on the shores turned from the sun, and foam flecks riding the brine against the crust (the
  // rim, the apron and the frost line are in the crust's own light, above; no line is drawn round a raft)
  {
    float open = (1. - pIn)*shK;
    float fleck = smoothstep(0.66, 0.9, vnoise(q*2.4 + uTime*vec2(0.08, 0.05)) + 0.22*vnoise(q*5.3 - uTime*0.1))*(1. - smoothstep(0.1, 1.0, -dSh))*(1. - smoothstep(-0.1, -0.02, dSh))*open*(1. - smoothstep(0.1, 0.5, fp));
    vec3 saltTop = uSaltCol*(uFill*0.95 + uSunCol*(uSunDir.y + 0.22))*0.3183*uSaltGain;
    c *= 1. - 0.42*castOut*(1. - pIn);
    c = mix(c, saltTop*0.8, fleck*0.4);
  }
  // ---- the biplane's shadow, thrown from its real shape by the real sun (GLSL_PLANE_SHADOW): crisp and cool on the
  //      crust, softer and fainter in the brine's body, never on the mirror ----
  c = mix(c, c*vec3(0.44, 0.48, 0.6), mix(planeShadow(q, 5.)*uShadow2.y*(1. - Fr), planeShadow(q, 1.)*uShadow2.x, salt));
  // the marabou throw long soft shadows down-sun over the plates (legs, body, hunched head)
  vec2 sdn = -uSunDir.xz/max(length(uSunDir.xz), 1e-3); float cot = min(length(uSunDir.xz)/max(uSunDir.y, 0.06), 9.);
  float msh = 0.;
  for (int i = 0; i < 3; i++) {
    vec2 d = q - uMar[i].xy; float al = dot(d, sdn)/cot, ac = d.x*-sdn.y + d.y*sdn.x, h = uMar[i].z;     // al: height of the point on the bird that shades here
    float t = al/max(h, 0.1);
    float wd = mix(0.07, 0.44, smoothstep(0.4, 0.56, t)*(1. - smoothstep(0.8, 0.92, t))) + 0.17*smoothstep(0.86, 0.93, t)*(1. - smoothstep(0.97, 1.02, t));
    float soft = 0.03 + 0.07*t*cot*0.3;
    msh = max(msh, (1. - smoothstep(wd - soft, wd + soft, abs(ac)))*smoothstep(-0.02, 0.03, t)*(1. - smoothstep(0.98, 1.06, t)));
  }
  c *= 1. - msh*mix(0.5, 0.68, salt);
  gl_FragColor = vec4(fxApplyFog(c), 1.);
}`,L0=`
attribute vec3 color;
varying vec3 vN, vCol, vL;
void main(){
  vN = normal; vCol = color; vL = position;
  gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position, 1.);
}`,P0=`
uniform vec3 uSunDir, uSunCol, uFill, uHaze;
uniform float uHazeAmt, uMirage, uTime;
varying vec3 vN, vCol, vL;
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.));
  float ang = atan(vL.x, vL.z + 1e-4);
  float streak = vnoise(vec2(ang*46., vL.y*0.004)) - 0.5;
  vec3 alb = vCol*(1. + 0.3*streak);
  float sd = dot(N, uSunDir), ndl = clamp(sd*1.2 + 0.05, 0., 1.);
  float away = 1. - smoothstep(-0.5, 0.25, sd);                             // flank and gully walls turned from the sun: less sky, cooler
  vec3 c = alb*(uFill*(0.5 + 0.35*N.y)*mix(vec3(1.), vec3(0.4, 0.46, 0.62), away) + uSunCol*ndl)*0.3183;
  float hz = clamp(uHazeAmt*(1. - 0.25*away) + 0.36*exp(-vL.y/110.), 0., 1.);
  c = mix(c, uHaze, hz);
  float lift = uMirage*(42. + 14.*sin(ang*90. + uTime*1.7) + 10.*sin(ang*37. - uTime*1.1));   // the foot floats on a band of sky
  c = mix(c, uHaze, uMirage*(1. - smoothstep(lift*0.7, max(lift, 1e-3), vL.y)));
  gl_FragColor = vec4(c, 1.);
}`,As=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position, 1.); }`,Fs=`
uniform vec3 uCol; uniform float uTime, uAmt;
varying vec2 vUv;
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
void main(){
  // a plume rooted at (0.12, 0.1) leaning down-wind (+u) as it rises and thins
  float h = vUv.y, x = vUv.x - 0.12 - h*h*0.62;
  float w = 0.03 + 0.2*h;
  float core = exp(-x*x/(w*w));
  vec2 p = vec2(vUv.x*5. - uTime*0.05, vUv.y*4. - uTime*0.085);
  float n = vnoise(p)*0.6 + vnoise(p*2.3 + 3.)*0.4;
  float a = core*smoothstep(0.28, 0.75, n + 0.25*(1. - h))*smoothstep(0.0, 0.08, h)*(1. - smoothstep(0.55, 1., h))*(1. - smoothstep(0.7, 1., vUv.x));
  gl_FragColor = vec4(uCol, a*uAmt);
}`,E0=`
attribute vec4 aInfo;     // along (0..1), up (0..1), haze added (0 the near scarp .. 1 the furthest), how squarely the face takes the sun
varying vec4 vInfo; varying float vH;
void main(){ vInfo = aInfo; vH = position.y; gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position, 1.); }`,q0=`
uniform vec3 uCol, uHaze, uSunCol, uFill; uniform float uHazeAmt;
varying vec4 vInfo; varying float vH;
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
void main(){
  // a fault scarp: a hard cap-rock rim, bedded cliff bands under it, gullies cut down the face, talus fans at the foot
  float gul = vnoise(vec2(vInfo.x*620., vInfo.y*1.6)), gul2 = vnoise(vec2(vInfo.x*1900., vInfo.y*3.));
  float cap = smoothstep(0.8, 0.86, vInfo.y);
  float beds = 0.5 + 0.5*sin(vH*0.085 + 1.5*vnoise(vec2(vInfo.x*70., 3.)));
  float cliff = smoothstep(0.42, 0.6, vInfo.y)*(1. - cap);
  vec3 alb = uCol*(0.7 + 0.3*gul + 0.16*gul2)*(1. - 0.2*cap)*(0.86 + 0.2*beds*cliff);
  float specks = step(0.8, hash12(floor(vec2(vInfo.x*2600., vInfo.y*22.))))*(1. - smoothstep(0.08, 0.36, vInfo.y));   // thorn trees on the fans
  alb *= 1. - 0.35*specks;
  float shade = smoothstep(0.35, 0.62, gul)*cliff;                         // the gully walls turned from the light
  vec3 c = alb*(uFill*(0.78 - 0.2*shade) + uSunCol*vInfo.w*(0.25 + 0.75*(1. - shade))*(0.6 + 0.5*gul2))*0.3183;
  float hz = clamp(uHazeAmt*(0.82 + 0.3*vInfo.z) + 0.34*exp(-max(vH, 0.)/38.), 0., 0.96);
  gl_FragColor = vec4(mix(c, uHaze, hz), 1.);
}`,ot="uniform vec3 uSunDir, uSunCol, uFill, uBounce; uniform float uTime;",T0=`
${ot}
attribute vec4 iN, iM; attribute vec3 color; attribute vec2 aPart;
varying vec3 vC;
${q.GLSL_FOG_PARS_VERT}
void main(){
  vec3 p = position; float bird = step(0.5, aPart.x);
  float tA = uTime*(0.4 + iM.x*0.5) + iM.x*60.;
  p.x += aPart.y*(sin(tA)*0.05 + 0.03*sin(tA*2.7));
  p.z += aPart.y*0.04*sin(tA*0.6 + 1.3);
  p.y += bird*0.012*sin(tA*0.8);
  p *= mix(1., iM.y, bird);
  float cy = cos(iN.z), sy = sin(iN.z);
  vec3 w = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy)*iN.w + vec3(iN.x, 0., iN.y);
  vec3 n = vec3(normal.x*cy + normal.z*sy, normal.y, -normal.x*sy + normal.z*cy);
  float ndl = clamp((dot(n, uSunDir) + 0.25)/1.25, 0., 1.);
  vec3 alb = color*mix(0.86 + 0.28*fract(iM.x*7.31), 1., bird);
  vC = alb*(mix(uBounce, uFill, n.y*.5 + .5) + uSunCol*ndl)*0.3183;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,Cs=`
varying vec3 vC;
${q.GLSL_FOG_PARS_FRAG}
void main(){ gl_FragColor = vec4(fxApplyFog(vC), 1.); }`,_0=`
${ot}
attribute vec4 iN, iM; attribute vec2 aBlade;   // height 0..1, blade phase
varying vec3 vC;
${q.GLSL_FOG_PARS_VERT}
void main(){
  vec3 p = position; float h = aBlade.x;
  float gust = sin(uTime*1.6 + iN.x*0.21 + iN.y*0.17) + 0.5*sin(uTime*3.7 + aBlade.y*6.3 + iM.x*20.);
  p.x += h*h*(0.09*gust + 0.05); p.z += h*h*0.04*sin(uTime*2.3 + aBlade.y*4.);
  float cy = cos(iN.z), sy = sin(iN.z);
  vec3 w = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy)*iN.w + vec3(iN.x, 0., iN.y);
  vec3 straw = mix(vec3(0.5, 0.42, 0.25), vec3(0.72, 0.66, 0.46), h);
  vec3 green = mix(vec3(0.2, 0.26, 0.17), vec3(0.42, 0.47, 0.3), h);
  vec3 alb = mix(straw, green, iM.y*(1. - 0.5*h))*(0.8 + 0.4*fract(iM.x*5.7));
  vC = alb*(uFill*(0.45 + 0.55*h) + uSunCol*(0.25 + 0.5*h))*0.3183;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,I0=`
${ot}
uniform vec3 uCam; uniform vec2 uDrift; uniform float uPix;
attribute vec4 iN, iM;
varying vec2 vUv; varying vec3 vK;
${q.GLSL_FOG_PARS_VERT}
void main(){
  float walk = uTime*(0.75 + 0.3*iM.x) + iN.z*6.283;
  vec2 g = iN.xy + uDrift*uTime*(0.85 + 0.3*iM.x) + vec2(sin(walk*0.21 + iM.x*9.), cos(walk*0.17 + iM.x*5.))*0.6;
  vec3 base = vec3(g.x, 0., g.y);
  vec3 vd = uCam - base; float dist = max(length(vd), 1e-3);
  vec3 rgt = cross(vec3(0., 1., 0.), vd); rgt /= max(length(rgt), 1e-4);
  float sz = max(iN.w, 2.2*uPix*dist);
  vec3 w = base + rgt*(position.x*sz*0.5) + vec3(0., (position.y*0.5 + 0.5)*sz + abs(sin(walk*3.))*0.02, 0.);
  vUv = position.xy; vK = vec3(iM.y, sin(walk*3.), 0.6 + 0.4*fract(iM.x*13.7));
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,G0=`
${ot}
uniform vec3 uPink;
varying vec2 vUv; varying vec3 vK;
${q.GLSL_FOG_PARS_FRAG}
float seg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-6), 0., 1.); return length(pa - ba*h); }
void main(){
  vec2 p = vUv; float ad = vK.x;
  float body = length((p - vec2(-0.05, mix(-0.1, 0.05, ad)))/vec2(mix(0.5, 0.36, ad), mix(0.36, 0.2, ad))) - 1.;
  vec2 hd = vec2(0.3 + 0.03*vK.y, mix(0.52, 0.86, ad));
  float neck = seg(p, vec2(0.22, mix(0.02, 0.1, ad)), hd) - mix(0.11, 0.05, ad);
  float head = length(p - hd) - mix(0.15, 0.08, ad);
  float leg = min(seg(p, vec2(-0.08 + 0.1*vK.y, -0.3), vec2(-0.1 + 0.16*vK.y, -1.)), seg(p, vec2(0.02 - 0.1*vK.y, -0.3), vec2(0.02 - 0.16*vK.y, -1.))) - mix(0.05, 0.03, ad);
  float d = min(min(body, neck*8.), min(head*8., leg*8.));
  if (d > 0.) discard;
  vec3 alb = mix(vec3(0.5, 0.47, 0.46)*vK.z, uPink, ad);
  if (leg < 0. && body > 0.) alb *= 0.45;
  vec3 c = alb*(uFill*(0.7 + 0.3*p.y) + uSunCol*(0.45 + 0.25*p.y))*0.3183;
  gl_FragColor = vec4(fxApplyFog(c), 1.);
}`,D0=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position, 1.); }`,B0=`
uniform vec3 uCol; uniform float uTime;
varying vec2 vUv;
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
void main(){
  float x = vUv.x*2. - 1.;
  float streak = vnoise(vec2(vUv.x*9. + vUv.y*2.5, vUv.y*1.2 + uTime*0.25));
  float a = (1. - x*x)*(1. - x*x)*(1. - smoothstep(0.55, 1., vUv.y))*smoothstep(0., 0.12, vUv.y)*(0.5 + 0.5*streak);
  gl_FragColor = vec4(uCol, a*0.5);
}`,O0=`
${ot}
uniform vec3 uCam; uniform float uPix;
attribute vec4 iA, iB, iC;
varying vec2 vUv; varying vec3 vK;
${q.GLSL_FOG_PARS_VERT}
void main(){
  float al = mod(iB.x + uTime*iB.w, iA.w), e = al/iA.w;
  vec2 dir = vec2(sin(iA.z), -cos(iA.z)), prp = vec2(-dir.y, dir.x);
  float sw = iC.y*(sin(al*0.0085 + iC.x) + 0.45*sin(al*0.023 + iC.x*2.3 + uTime*0.05));
  vec3 base = vec3(iA.xy + dir*(al - iA.w*0.5) + prp*(sw + iB.y), 0.).xzy;
  base.y = iB.z + iC.z*(sin(al*0.0062 + iC.x*1.7) + 0.4*sin(al*0.019 + iC.x)) + 0.6*sin(uTime*0.8 + iC.w*40.);
  vec3 vd = uCam - base; float dist = max(length(vd), 1e-3);
  vec3 rgt = cross(vec3(0., 1., 0.), vd); rgt /= max(length(rgt), 1e-4);
  vec3 up = cross(vd/dist, rgt);
  float ends = smoothstep(0., 0.08, e)*(1. - smoothstep(0.92, 1., e));
  float sz = max(0.7, 1.5*uPix*dist)*ends;
  vec3 w = base + (rgt*position.x + up*position.y)*sz;
  vUv = position.xy; vK = vec3(sin(uTime*18.8*(0.9 + 0.2*iC.w) + iC.w*61.), iC.w, sz/max(uPix*dist, 1e-5));
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,N0=`
${ot}
uniform vec3 uPink, uDark;
varying vec2 vUv; varying vec3 vK;
${q.GLSL_FOG_PARS_FRAG}
void main(){
  // two wing strokes from the shoulder, a body between; drawn fat when the bird is only a couple of pixels
  float th = 0.75*vK.x + 0.1; vec2 wv = vec2(cos(th), sin(th))*0.92, p = vec2(abs(vUv.x), vUv.y);
  float t = clamp(dot(p, wv)/dot(wv, wv), 0., 1.), fat = mix(0.36, 0.11, smoothstep(2., 9., vK.z));
  float dW = length(p - wv*t) - fat*(1. - 0.5*t), dB = length(vUv*vec2(1.6, 1.)) - 0.24 - fat*0.5;
  if (min(dW, dB) > 0.) discard;
  vec3 alb = dB < 0. ? uPink : mix(uPink, uDark, smoothstep(0.5, 0.62, t)*smoothstep(2.5, 7., vK.z));   // black wing tips only once the wing is wide enough to carry them
  vec3 c = alb*(uFill*0.9 + uBounce*0.4 + uSunCol*0.6)*0.3183*(0.85 + 0.3*fract(vK.y*7.3));
  gl_FragColor = vec4(fxApplyFog(c), 1.);
}`,ya=`
${Ms}
float crustSd(vec2 q, float fp){
  vec4 fld = fieldTap(q);
  float n1 = vnoise(q*0.021 + 3.1), n2 = vnoise(q*0.083 + 11.7), n3 = vnoise(q*0.31);
  float sd = fld.r + uSaltBias + (n1 - 0.5)*0.22 + (n2 - 0.5)*0.12 + (n3 - 0.5)*0.05*(1. - smoothstep(1., 6., fp));
  sd += 0.6*fld.g*smoothstep(0.7, 0.79, vnoise(q*0.12 + 31.) + 0.2*vnoise(q*0.47 + 3.));   // crust islets and pancakes out in the leads
  sd += crustExtra(q, fld.b, fld.a);
  return sd;
}`,Rs=`
${ot}
uniform vec3 uCam; uniform float uPix, uRipple;
uniform vec4 uFrontP;     // the liftoff line: point on the axis (x, z), axis direction (x, z)
uniform vec4 uWall;       // station of the line (m), axis curvature, amount 0..1, depth of the body behind the line (m)
uniform vec2 uWall2;      // half width of the lane the birds leave open, how high the birds climb (1 = as built)
attribute vec4 iW;
varying vec2 vUv, vQ; varying vec4 vK; varying float vF;
${q.GLSL_FOG_PARS_VERT}
void main(){
  vF = 0.;
  float b = mod(iW.x + 0.559*uWall.x, uWall.w), fds = -b;
  // (the sheet is laid as the build fills iW: 64 in 100 of the risers dealt round 44 loose parties, the rest strewn singly and low; this shader gathers them no further and thins no window in it)
  float lat0 = iW.y + sign(iW.y)*uWall2.x, hc = 0.8 + iW.z*uWall2.y;
  float lat = lat0 + 0.7*sin(uTime*0.4 + iW.w*40.);
  float L = lat + 0.5*uWall.y*fds*fds;
  vec2 dir = uFrontP.zw, rg = vec2(-dir.y, dir.x), g = uFrontP.xy + dir*fds + rg*L;
  float h = 0.8 + (hc - 0.8)*(1. - exp(-b/(4. + 6.*fract(iW.w*7.3)))) + 0.25*sin(uTime*0.9 + iW.w*17.);
  vec3 base = vec3(g.x, h, g.y);
  vec3 vd = uCam - base; float dist = max(length(vd), 1e-3);
  vec3 rgt = cross(vec3(0., 1., 0.), vd); rgt /= max(length(rgt), 1e-4);
  vec3 up = cross(vd/dist, rgt);
  float appear = smoothstep(4.5, 10.5, b)*(1. - smoothstep(uWall.w - 5., uWall.w, b));      // none low over the pattering line itself: the white line shows under the wall
  float sz = max(0.5 + 0.26*fract(iW.w*23.3), 1.5*uPix*dist)*appear*smoothstep(11., 17., dist)*smoothstep(0., 0.1, uWall.z*1.1 - fract(iW.w*13.7));
  float ph = uTime*18.8*(0.92 + 0.16*fract(iW.w*3.1)) + iW.w*61.;
  float tl = (fract(iW.w*31.7) - 0.5)*0.9 + 0.2*sin(uTime*0.7 + iW.w*50.), ct = cos(tl), st = sin(tl);      // each banks its own way
#ifdef MIRROR
  vec3 w = base + (rgt*(position.x*0.8) + up*(position.y*(0.75 + 0.7*fract(iW.w*17.3))))*sz;      // the ripple draws each reflection out a little along the eye's ray: a dab, not a copy and not a streak
#else
  vec3 w = base + (rgt*(position.x*ct - position.y*st) + up*(position.x*st + position.y*ct - 0.06*sin(ph)))*sz;
#endif
  vUv = position.xy;
  // wing phase, seed, pixels the half quad covers, which wing takes the sun (-1 left .. 1 right)
  vK = vec4(sin(ph), iW.w, sz/max(uPix*dist, 1e-5), clamp(dot(rgt, uSunDir)*1.6, -1., 1.));
#ifdef MIRROR
  float hh = max(w.y, 0.);
  vec3 m = vec3(w.x, -hh, w.z);
  m.xz += vec2(sin(w.z*2.3 + uTime*1.7 + hh*2.9), cos(w.x*2.1 - uTime*1.4 + hh*3.3))*(0.04 + 0.03*hh)*(0.6 + 2.*uRipple);
  float ch = max(uCam.y, 0.05);
  w = uCam + (m - uCam)*(ch/(ch + hh));
  w.y = 0.03 + 0.0005*length(w.xz - uCam.xz);
  vK.z *= 1. - 0.5*smoothstep(6., 22., hh);
  vF = dot(w.xz - uFrontP.xy, uFrontP.zw);            // metres past the liftoff line, on the water
#endif
  vQ = w.xz;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,Ls=`
${ot}
uniform vec3 uPink, uScarlet, uDeep, uCam;
uniform vec4 uStream;        // w: how strong the reflections are (full under the wall's mass, faint where the sky has come back)
uniform sampler2D uField; uniform vec4 uFieldRect; uniform float uSaltBias;
varying vec2 vUv, vQ; varying vec4 vK; varying float vF;
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
${ya}
${q.GLSL_FOG_PARS_FRAG}
void main(){
  // two wings from the shoulder, each bent at the wrist, a body between them, the neck's stub above it
  float th = 0.8*vK.x + 0.1; vec2 p = vec2(abs(vUv.x), vUv.y);
  vec2 w1 = vec2(cos(th), sin(th))*0.46, w2 = w1 + vec2(cos(th*0.45 - 0.2), sin(th*0.45 - 0.2))*0.46;
  float fat = mix(0.3, 0.085, smoothstep(2.5, 10., vK.z));
  vec2 pa = p - w1*clamp(dot(p, w1)/dot(w1, w1), 0., 1.), d2 = w2 - w1, pb = p - w1 - d2*clamp(dot(p - w1, d2)/dot(d2, d2), 0., 1.);
  float t = dot(pa, pa) < dot(pb, pb) ? 0.5*clamp(dot(p, w1)/dot(w1, w1), 0., 1.) : 0.5 + 0.5*clamp(dot(p - w1, d2)/dot(d2, d2), 0., 1.);
  float dW = min(length(pa), length(pb)) - fat*(1. - 0.55*t);
  float dB = length(vUv*vec2(1.5, 1.) - vec2(0., 0.02)) - 0.2 - fat*0.5;
#ifdef MIRROR
  { float sx = vUv.x*2.5 + 0.45*sin(vUv.y*5. + vK.y*40.); if (sx*sx + vUv.y*vUv.y > 1.) discard; }      // in the mirror a bird is a short stroke, not its own shape
#else
  if (min(dW, dB) > 0.) discard;
#endif
  float wide = smoothstep(2.5, 6., vK.z);        // black and scarlet only once the wing is wide enough to carry them
  vec3 alb = uPink;
  if (dB >= 0.) alb = mix(mix(uPink, uScarlet, smoothstep(0.28, 0.5, t)*0.8*wide), vec3(0.04, 0.03, 0.04), smoothstep(0.66, 0.76, t)*smoothstep(4., 8., vK.z)*0.85);
  float sunW = 0.5 + 0.5*vK.w*sign(vUv.x)*step(0., dB);
  vec3 c = alb*(uFill*0.85 + uBounce*0.55 + uSunCol*(0.3 + 0.55*sunW))*0.3183*(0.86 + 0.28*fract(vK.y*7.3));
#ifdef MIRROR
  // The wall given back by the brine: each bird a short stroke, dark rose, darker than the water it lies on, broken by
  // the ripple; thick under the wall, thinning toward the lens (close to, the eye looks down into the brine and sees
  // crimson, not sky); none on the pattering line itself, none on dry crust.
  float brk = smoothstep(0.34, 0.62, vnoise(vQ*vec2(0.9, 0.9) + uTime*vec2(1.3, 0.9)) + 0.4*vnoise(vQ*2.9 - uTime*1.7));
  if (crustSd(vQ, 0.) > 0.48) discard;
  float dm = length(uCam.xz - vQ);
  float a = 0.62*smoothstep(7., 30., dm)*(1. - smoothstep(-26., -10., vF + 8.*(vnoise(vQ*0.11 + 5.) - 0.5)))*mix(1., brk, 0.85)*uStream.w;
  if (a < 0.02) discard;
  gl_FragColor = vec4(fxApplyFog(uDeep*0.7 + c*vec3(0.4, 0.1, 0.13)*0.45), a);
#else
  gl_FragColor = vec4(fxApplyFog(c), 1.);
#endif
}`,U0=`
uniform vec3 uCam; uniform float uPix;
uniform vec4 uFrontP, uWall;      // as for the wave's body
uniform vec4 uCrown;              // amount 0..1, period (m), 0, 0
attribute vec4 iK;
varying vec2 vUv, vQ; varying vec3 vK;
${q.GLSL_FOG_PARS_VERT}
void main(){
  float a = mod(uWall.x + 3. - iK.x, uCrown.y), fds = 3. - a, life = clamp(a/16., 0., 1.);
  float L = iK.y + 0.5*uWall.y*fds*fds;
  vec2 dir = uFrontP.zw, rg = vec2(-dir.y, dir.x), g = uFrontP.xy + dir*fds + rg*L;
  float alpha = smoothstep(0., 0.08, life)*(1. - life*life)*uCrown.x*step(a, 16.);
  vec3 base = vec3(g.x, 0., g.y);
  vec3 vd = uCam - base; float dist = max(length(vd), 1e-3);
  vec3 rgt = cross(vec3(0., 1., 0.), vd); rgt /= max(length(rgt), 1e-4);
  float sz = max(iK.w*(0.5 + 0.7*sqrt(life))*mix(0.42, 1., smoothstep(14., 50., dist)), 2.4*uPix*dist)*smoothstep(9., 16., dist);
  vec3 w = base + rgt*(position.x*sz*0.62) + vec3(0., (position.y + 1.)*0.5*sz*(1.25 - 0.35*life), 0.);
  if (alpha < 0.01) w.y = -6.;
  vUv = position.xy; vQ = g; vK = vec3(alpha, iK.z*40., life);
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,K0=`
uniform vec3 uCol;
uniform sampler2D uField; uniform vec4 uFieldRect; uniform float uSaltBias;
varying vec2 vUv, vQ; varying vec3 vK;
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
${ya}
${q.GLSL_FOG_PARS_FRAG}
void main(){
  // a burst of spray: thin uneven jets from the foot, opening upward, broken into beads close to; one soft fleck far off
  float r = length(vUv*vec2(1., 0.85)), fw = fwidth(r), ang = atan(vUv.x, vUv.y + 1.3);
  float jets = 0.5 + 0.5*sin(ang*15. + vK.y), beads = 0.5 + 0.5*sin(r*11. - vK.y*2.3 + ang*5.);
  float fan = 1. - smoothstep(0.45, 1., abs(vUv.x)/(0.28 + 0.5*(vUv.y + 1.)));
  float small = smoothstep(0.05, 0.2, fw);
  float jet = smoothstep(0.3, 0.8, jets*0.62 + beads*0.5)*(1. - smoothstep(0.25, 1., r))*fan*smoothstep(-1., -0.75, vUv.y);
  float fleck = 0.62*(1. - smoothstep(0.25, 1., length(vec2(vUv.x*1.15, (vUv.y + 0.72)*3.4))));      // lying along the waterline
  float a = mix(jet, fleck, small)*vK.x;
  if (a < 0.01 || crustSd(vQ, 0.) > 0.48) discard;
  gl_FragColor = vec4(fxApplyFog(uCol), a);
}`,Ps=`
${ot}
uniform vec3 uCam; uniform float uRipple;
attribute vec4 iP, iQ, iR;        // x, y, z, wing phase | yaw, pitch, roll, size | beat amplitude, tuck, 0, seed
attribute vec3 color, aCol2, aW;  // aW: wing side (0 = body), span 0..1, half span in metres
attribute vec2 aUV;               // wings: span 0..1, chord 0 (leading edge) .. 1 (trailing edge)
varying vec3 vC1, vC2, vN; varying vec4 vK; varying vec2 vQ, vUV;
${q.GLSL_FOG_PARS_VERT}
void main(){
  vec3 p = position, n = normal; float wing = step(0.5, abs(aW.x));
  if (wing > 0.5) {
    float sd = aW.x, u = aW.y, S = aW.z, amp = iR.x, tuck = iR.y;
    float th1 = amp*sin(iP.w) + 0.2 - 0.3*tuck, th2 = amp*0.75*sin(iP.w - 1.1) - 0.36 - 0.55*tuck;
    float u2 = max(u - 0.45, 0.), u1 = u - u2;
    float tho = u > 0.45 ? th1 + th2 : th1;
    float root = abs(position.x) - S*u;
    p.x = sd*(root + S*(u1*cos(th1) + u2*cos(th1 + th2))*(1. - 0.22*tuck));
    p.y = position.y + S*(u1*sin(th1) + u2*sin(th1 + th2));
    p.z = position.z - tuck*S*(u2*1.25 + u1*0.2) + tuck*0.12;
    // the wing is cambered: its leading edge looks forward and up, its trailing edge back and up
    n = normalize(vec3(-sd*sin(tho), cos(tho), (0.36 - aUV.y)*0.85));
  }
  p *= iQ.w;
  float cr = cos(iQ.z), sr = sin(iQ.z), cp = cos(iQ.y), sp = sin(iQ.y), cy = cos(iQ.x), sy = sin(iQ.x);
  p = vec3(p.x*cr - p.y*sr, p.x*sr + p.y*cr, p.z); n = vec3(n.x*cr - n.y*sr, n.x*sr + n.y*cr, n.z);
  p = vec3(p.x, p.y*cp + p.z*sp, p.z*cp - p.y*sp); n = vec3(n.x, n.y*cp + n.z*sp, n.z*cp - n.y*sp);
  p = vec3(p.x*cy + p.z*sy, p.y, -p.x*sy + p.z*cy); n = vec3(n.x*cy + n.z*sy, n.y, -n.x*sy + n.z*cy);
  vec3 w = iP.xyz + p;
  vK = vec4(wing, aW.y, 1., iR.w); vC1 = color; vC2 = aCol2; vN = n; vUV = aUV;
#ifdef MIRROR
  // the bird's reflection: flipped about the water, set trembling by the ripple, and slid along the eye's ray onto the sheet
  float hh = max(w.y, 0.);
  vec3 m = vec3(w.x, -hh, w.z);
  m.xz += vec2(sin(w.z*2.3 + uTime*1.7 + hh*2.9), cos(w.x*2.1 - uTime*1.4 + hh*3.3))*(0.05 + 0.05*hh)*(0.6 + 2.*uRipple);
  float ch = max(uCam.y, 0.05);
  w = uCam + (m - uCam)*(ch/(ch + hh));
  float dm = length(w.xz - uCam.xz);
  w.y = 0.03 + 0.0005*dm;
  vK.z = (1. - smoothstep(160., 320., dm))*(1. - 0.4*smoothstep(4., 14., hh));
#endif
  vQ = w.xz;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,Es=`
${ot}
uniform vec3 uDeep, uCam; uniform sampler2D uField; uniform vec4 uFieldRect; uniform float uSaltBias;
varying vec3 vC1, vC2, vN; varying vec4 vK; varying vec2 vQ, vUV;
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
${ya}
${q.GLSL_FOG_PARS_FRAG}
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-4, 0.)); vec3 alb = vC1;
  bool under = !gl_FrontFacing;
#ifdef MIRROR
  under = !under;                     // the mirror shows the bird from below
#endif
  if (under) { N = -N; alb = vC2; }
  float blk = 0.;
  if (vK.x > 0.5) {
    // the wing's outline is cut here, not left to the mesh: a rounded tip, the primaries spread like fingers with slots
    // between them, and a trailing edge scalloped feather by feather
    float u = vUV.x, c = vUV.y;
    float tip = 1. - 0.17*pow(abs(c*2. - 0.86), 2.2);
    float fing = abs(fract(c*5.4 + 0.3) - 0.5)*2.;
    float slot = smoothstep(0.8, 0.99, u)*0.74;
    float scal = 0.5 + 0.5*cos(u*163.);
    if (u > tip || fing > 1. - slot || c > 1. - 0.055*scal*(1. - smoothstep(0.72, 0.86, u))) discard;
#ifdef PELICAN
    // white coverts; black flight feathers: a trailing band on the arm that widens to take the whole hand, its edge
    // following the wing and stepped by the tips of the coverts. Underneath the band is broader and the lining white.
    float cb = (under ? mix(0.46, 0.14, smoothstep(0.5, 0.92, u)) : mix(0.72, 0.3, smoothstep(0.5, 0.95, u))) + 0.022*sin(u*82.);
    blk = smoothstep(cb - 0.035, cb + 0.035, c);
    float shaft = smoothstep(0.55, 1., cos(u*163.));                       // pale shafts down the flight feathers
    float rows = smoothstep(0.62, 1., abs(fract(c/max(cb, 0.1)*2.6 + 0.1*sin(u*61.)) - 0.5)*2.);   // rows of coverts, each casting a soft line on the next
    alb *= 1. - 0.13*rows*(1. - blk);
    alb = mix(alb, (under ? vec3(0.07, 0.065, 0.075) : vec3(0.04, 0.038, 0.045))*(1. + 0.9*shaft), blk);
    alb *= 0.8 + 0.2*smoothstep(0., 0.16, u);                              // shaded where the wing meets the body
#else
    alb *= 1. - 0.1*(0.5 + 0.5*sin(u*86.));                                // feather shafts across the wing
#endif
  }
  float ndl = dot(N, uSunDir), dif = clamp((ndl + 0.2)/1.2, 0., 1.);
#ifdef PELICAN
  dif = clamp((ndl + 0.9)/1.9, 0., 1.);       // white plumage scatters: the light wraps right round the body, so a pelican seen against the sun is still a white bird
  vec3 hemi = mix(uBounce*1.6 + uFill*0.5, uFill*1.3 + uSunCol*0.24, smoothstep(-0.65, 0.6, N.y));     // warm white above, rose bounce off the brine below
#else
  vec3 hemi = mix(uBounce*1.5 + uFill*0.22, uFill, N.y*.5 + .5)*1.15;                  // bright salt and brine below: bellies are well lit
#endif
  vec3 c = alb*(hemi + uSunCol*dif)*0.3183;
  c += alb*uSunCol*(vK.x*0.22*max(-ndl, 0.)*0.3183)*(1. - blk);    // a little light through the spread wing
#ifdef MIRROR
  // A reflection in the brine is the bird's own shape, wings spread, but dark, dim and stained by the water, broken into
  // strokes by the ripple and strongest where the eye meets the sheet at a low angle; no reflection lies on dry crust.
  vec3 Vw = uCam - vec3(vQ.x, 0., vQ.y); float m = 1. - clamp(Vw.y/max(length(Vw), 1e-3), 0., 1.), m2 = m*m;
  float F = 0.03 + 0.9*m2*m2*m*sqrt(m);
  float brk = smoothstep(0.22, 0.6, vnoise(vQ*5.5 + uTime*vec2(1.3, 0.9)) + 0.4*vnoise(vQ*14. - uTime*1.7));
  float a = vK.z*(1. - smoothstep(0.46, 0.5, crustSd(vQ, 0.)))*(0.34 + 0.66*F)*mix(1., brk, 0.55);
  if (a < 0.02) discard;
  vec3 lit = alb*(uFill*0.6 + uBounce*0.5 + uSunCol*0.4)*0.3183;
  gl_FragColor = vec4(fxApplyFog(uDeep*0.55 + lit*vec3(1., 0.4, 0.46)*0.24), a*0.92);
#else
  gl_FragColor = vec4(fxApplyFog(c), 1.);
#endif
}`,V0=`
${ot}
uniform vec3 uSaltCol; uniform float uSaltGain;
attribute vec2 aR;
varying vec3 vC; varying vec2 vQ;
${q.GLSL_FOG_PARS_VERT}
void main(){
  vec3 n = normalize(normal);
  float ndl = max(dot(n, uSunDir), 0.);
  vec3 alb = uSaltCol*(0.86 + 0.14*aR.y)*(0.92 + 0.24*aR.x);
  vC = alb*(uFill*(0.5 + 0.42*n.y) + uSunCol*ndl)*0.3183*uSaltGain;
  vQ = position.xz;
  vec4 mvPosition = viewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition;
  ${q.GLSL_FOG_VERT}
}`,H0=`
uniform sampler2D uField; uniform vec4 uFieldRect; uniform float uSaltBias; uniform vec4 uPools[${gt}];
varying vec3 vC; varying vec2 vQ;
${ks}
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
${ya}
${q.GLSL_FOG_PARS_FRAG}
void main(){
  float dP = 1e4;
  for (int i = 0; i < ${gt}; i++) { vec4 pl = uPools[i]; dP = min(dP, length(vQ - pl.xy) - pl.z); }
  dP += (vnoise(vQ*0.5 + 5.) - 0.5)*1.7;
  if (crustSd(vQ, 0.) < 0.6 + 0.05*vnoise(vQ*1.7) || dP < 0.45) discard;      // no ridge runs out onto the lip of the crust: the lip is the lake's own thin white line
  gl_FragColor = vec4(fxApplyFog(vC*(0.92 + 0.16*vnoise(vQ*9.))*mix(vec3(1.), vec3(0.44, 0.48, 0.6), planeShadow(vQ, 1.)*uShadow2.x)), 1.);      // the biplane's shadow lies over the ridges as over the plates
}`;function W0(z){const L=[],ce=[],ge=[],st=[],ye=[],Ge=[],O=[],dt=[],ae=(H,$=.8)=>new s.Color(H).multiplyScalar($),xe=(H,$,N,I,ne,Le,U,ue,de,_t=0,pt=0)=>(L.push(H,$,N),ce.push(I,ne,Le),ge.push(U.r,U.g,U.b),st.push(ue.r,ue.g,ue.b),ye.push(de[0],de[1],de[2]),Ge.push(_t,pt),L.length/3-1),X=(H,$,N,I)=>{O.push(H,$,N),dt.push(I)},Pe=(H,$)=>{const N=[];for(const[I,ne,Le,U,ue,de]of H){const _t=L.length/3;N.push(_t);for(let pt=0;pt<$;pt++){const bt=(pt+.5)/$*Math.PI*2,St=Math.sin(bt),zt=Math.cos(bt),Mt=Math.hypot(St*Le,zt*U)||1,Ee=de.clone().lerp(ue,p(-.5,.6,zt));xe(St*U,ne+zt*Le,I,St*Le/Mt,zt*U/Mt,0,Ee,Ee,[0,0,0])}}for(let I=0;I<H.length-1;I++)for(let ne=0;ne<$;ne++){const Le=N[I]+ne,U=N[I]+(ne+1)%$,ue=N[I+1]+(ne+1)%$,de=N[I+1]+ne;X(Le,U,ue,1),X(Le,ue,de,1)}},Xe=z==="pelican",ze=ae("#f6f1e8",.84),Ve=ae("#ead9d4",.76),xa=ae("#17161a",1),Wa=ae("#3a363a",1);let yt,Wt,xt,Je,$t,Tt;if(Xe){Pe([[-.64,.02,.008,.008,ze,ze],[-.52,.02,.07,.09,ze,Ve],[-.3,0,.15,.16,ze,Ve],[0,-.01,.19,.19,ze,Ve],[.25,0,.17,.17,ze,Ve],[.42,.04,.125,.12,ze,Ve],[.52,.09,.09,.085,ze,ze],[.61,.135,.078,.066,ze,ze],[.7,.14,.06,.055,ze,ae("#f1d9c8")],[.77,.135,.036,.04,ae("#f0d6c0"),ae("#f0d6c0")]],8);const H=ae("#e9dcae",.85),$=ae("#e2813a",.9),N=ae("#f2c23e",.95),I=ae("#e8a530",.9),ne=ae("#e89355",.85);Pe([[.74,.14,.028,.042,H,H],[.96,.108,.016,.036,H,H],[1.16,.078,.011,.024,H,$],[1.215,.06,.004,.006,$,$]],5),Pe([[.7,.1,.03,.03,N,N],[.84,.05,.072,.034,N,I],[1,.045,.052,.028,N,I],[1.15,.062,.012,.014,N,N]],5);for(const Le of[-1,1]){const U=L.length/3;Pe([[-.46,-.1,.02,.03,ne,ne],[-.62,-.085,.022,.05,ne,ne],[-.74,-.07,.004,.01,ne,ne]],4);for(let ue=U;ue<L.length/3;ue++)L[ue*3]+=Le*.075}yt=1.31,Wt=.14,xt=.68,Je=.07,$t=.27,Tt=[-.5,-.8,.11,.2]}else{const H=ae("#f7f3ea",.86),$=ae("#7a4226",.95),N=ae("#4c3024",1),I=ae("#f3c636",.95);Pe([[-.36,0,.008,.008,N,$],[-.25,0,.075,.085,N,$],[0,-.01,.12,.125,N,$],[.14,0,.112,.108,ae("#8a7a70"),ae("#b99a86")],[.2,.005,.1,.095,H,H],[.3,.025,.074,.07,H,H],[.38,.04,.06,.055,H,H],[.445,.04,.036,.036,H,I]],8),Pe([[.43,.036,.03,.024,I,I],[.49,.026,.022,.016,I,ae("#3a3026")],[.525,-.004,.007,.006,ae("#2a221e"),ae("#2a221e")]],5);for(const ne of[-1,1]){const Le=L.length/3;Pe([[-.02,-.11,.03,.03,$,$],[-.14,-.15,.028,.03,I,I],[-.24,-.16,.03,.04,I,I],[-.3,-.17,.004,.006,ae("#2a221e"),ae("#2a221e")]],4);for(let U=Le;U<L.length/3;U++)L[U*3]+=ne*.06}yt=.95,Wt=.1,xt=.46,Je=.05,$t=.2,Tt=[-.27,-.6,.1,.27]}{const H=Xe?ze:ae("#f7f3ea",.86),[$,N,I,ne]=Tt,Le=L.length/3;for(const[U,ue]of[[$,I],[($+N)/2,(I+ne)/2*1.08],[N,ne]])for(const de of[-1,-.33,.33,1])xe(de*ue,.02-Math.abs(de)*.012,U-(1-de*de)*.035*(U===N?1:0),0,1,0,H,H,[0,0,0]);for(let U=0;U<2;U++)for(let ue=0;ue<3;ue++){const de=Le+U*4+ue;X(de,de+1,de+5,2),X(de,de+5,de+4,2)}}const V=[0,.08,.17,.3,.45,.58,.7,.8,.87,.93,.97,1],jt=[0,.14,.3,.48,.66,.83,1],G=Xe?ze:ae("#7e4628",1),Z=Xe?ae("#ece6dc",.74):ae("#7a4226",.95),ft=Xe?ze:ae("#1e1917",1),nt=Xe?Z:ae("#2a2422",1);for(const H of[1,-1]){const $=[];for(let N=0;N<V.length;N++){const I=V[N],ne=xt*(I<.14?.8+I*1.43:1-.24*(I-.14)),Le=$t-.15*I*I-.05*p(.8,1,I);$.push([]);for(const U of jt){const ue=!Xe&&U>.42-Math.max(I-.6,0)*.9,de=Je+.062*Math.sin(Math.PI*Math.pow(U,.6))*(1-.55*I)-.03*U;$[N].push(xe(H*(Wt+yt*I),de,Le-U*ne,0,1,0,ue?ft:G,ue?nt:Z,[H,I,yt],I,U))}}for(let N=0;N<V.length-1;N++)for(let I=0;I<jt.length-1;I++){const ne=$[N][I],Le=$[N+1][I],U=$[N+1][I+1],ue=$[N][I+1];X(ne,Le,U,2),X(ne,U,ue,2)}}const mt=new s.Vector3,be=new s.Vector3,b=new s.Vector3,B=new s.Vector3;for(let H=0;H<O.length;H+=3){const $=O[H],N=O[H+1],I=O[H+2];mt.set(L[$*3],L[$*3+1],L[$*3+2]),be.set(L[N*3],L[N*3+1],L[N*3+2]),b.set(L[I*3],L[I*3+1],L[I*3+2]),B.copy(be).sub(mt).cross(b.sub(mt)),(dt[H/3]===2?B.y:B.x*(ce[$*3]+ce[N*3]+ce[I*3])+B.y*(ce[$*3+1]+ce[N*3+1]+ce[I*3+1])+B.z*(ce[$*3+2]+ce[N*3+2]+ce[I*3+2]))<0&&(O[H+1]=I,O[H+2]=N)}const et=new s.BufferGeometry;return et.setAttribute("position",new s.Float32BufferAttribute(L,3)),et.setAttribute("normal",new s.Float32BufferAttribute(ce,3)),et.setAttribute("color",new s.Float32BufferAttribute(ge,3)),et.setAttribute("aCol2",new s.Float32BufferAttribute(st,3)),et.setAttribute("aW",new s.Float32BufferAttribute(ye,3)),et.setAttribute("aUV",new s.Float32BufferAttribute(Ge,2)),et.setIndex(O),et}function $0(z){const L=z.rng.fork("look"),ce=L(),ge=L(),st=L(),ye=z.vary||{};let Ge=ce<.12?"noon":ce<.27?"morning":ce<.4?"evening":ce<.55?"morning":ce<.7?"dawn":ce<.82?"rains":ce<.92?"moon":"morning";ye.hour==="dawn"?Ge="dawn":ye.hour==="golden"?Ge="evening":ye.hour==="night"?Ge="moon":ye.hour==="day"&&(Ge==="dawn"||Ge==="evening"||Ge==="moon")&&(Ge=st<.5?"morning":st<.75?"rains":"noon");const O=ge<.22?"dry":ge<.34?"december":ge<.45?"dry":ge<.62?"october":ge<.8?"december":"october";return{id:Ge,season:O,look:F0[Ge]}}async function j0(z){const L=z.rng,ce=z.noise,ge=z.quality?.detail??1,st=z.vary||{},{id:ye,season:Ge,look:O}=$0(z),dt=Ie(st.density??1,.7,1.3),ae=!!st.rare,xe=new s.Scene,X=e=>new s.Color(e),Pe=38,Xe=L.range(.9,1.12),ze=L.range(2.9,3.3),Ve=e=>e*Xe,xa=29*Xe,Wa=25*Xe,yt=38,Wt=e=>xa*p(190,480,e),xt=e=>Wt(e)-(xa+Wa)*p(590,770,e)+(Wa+yt)*p(848,984,e)-yt*p(1016,1130,e),Je=[[0,8.8],[60,8.3],[130,6.1],[200,4.7],[295,ze+.25],[362,ze-.25],[440,ze+.1],[600,ze],[740,ze+.15],[830,ze-.15],[960,ze+.05],[1040,4.5],[1100,6],[1140,6.5],[1300,6.5]],$t=e=>{let t=0;for(;t<Je.length-2&&e>Je[t+1][0];)t++;const o=Ie((e-Je[t][0])/(Je[t+1][0]-Je[t][0]),0,1);return Ne(Je[t][1],Je[t+1][1],o*o*(3-2*o))},Tt=[];{let e=0,t=0;for(let o=0;o<=600;o++){const a=o*2;(a<300||a>780?o%15===0:o%30===0)&&Tt.push([e,$t(a),t]);const h=xt(a+1)*Math.PI/180;e+=Math.sin(h)*2,t-=Math.cos(h)*2}}const V=z0(Tt),jt=[];{let e=0,t=0,o=0;for(let a=0;a<34;a++){const h=-16*a;for(;t>h;){const l=xt(o+.5)*Math.PI/180;e+=Math.sin(l),t-=Math.cos(l),o+=1}const n=xt(o)*Math.PI/180,i=(h-t)/Math.cos(n);jt.push(new s.Vector4(e-Math.sin(n)*i,Math.cos(n),o-i,Math.sin(n)))}}await z.yield();const G=V.length,Z=318,ft=G-Z,nt=ft+60,mt=420,be=new s.Vector3,b=new s.Vector3,B=new s.Vector3,et=V.posAtDist(G,new s.Vector3),H=Object.assign({rng:L,preset:O.preset,clouds:!1,clouds2:!1,ground:O.fog,renderer:z.renderer},O.sky);st.mood!==void 0&&st.mood>.8&&(H.clouds2=!1);const $=ye==="evening"?xa+48.5:O.az;ye==="moon"?(H.bake=!0,H.bodyOverrides={0:{elevation:O.el,azimuth:$}}):(H.sunElevation=O.el,H.sunAzimuth=$),await z.yield();const N=M0(H);xe.add(N.object),xe.fog=new s.FogExp2(X(O.fog),O.fogD),await z.yield();const I=k0(N,{bounce:.45});xe.add(I.object);const ne=O.el*Math.PI/180,Le=$*Math.PI/180,U=new s.Vector3(Math.sin(Le)*Math.cos(ne),Math.sin(ne),-Math.cos(Le)*Math.cos(ne)).normalize(),ue=X(O.sun).multiplyScalar(O.sunI),de=X(O.fill).multiplyScalar(O.fillI),_t=X(qt[0]),pt=X(qt[1]),bt=X(qt[2]),St=X(qt[4]),zt=X(qt[6]),Mt=bt.clone().lerp(_t,.15).multiplyScalar(O.bounce*.95),Ee={uSunDir:{value:U},uSunCol:{value:ue},uFill:{value:de},uBounce:{value:Mt},uTime:{value:0}};await z.yield();const Qt=[];for(let e=-60;e<=G+mt+60;e+=22){V.posAtDist(e,be),V.tangentAtDist(e,b);const t=Math.hypot(b.x,b.z)||1;Qt.push({x:be.x,z:be.z,tx:b.x/t,tz:b.z/t,d:e})}const qs=(e,t)=>{let o=1e18,a=0;for(let l=0;l<Qt.length;l++){const v=e-Qt[l].x,w=t-Qt[l].z,g=v*v+w*w;g<o&&(o=g,a=l)}const h=Qt[a],n=e-h.x,i=t-h.z;return{d:h.d+n*h.tx+i*h.tz,lat:n*-h.tz+i*h.tx}};V.posAtDist(Z,be),V.tangentAtDist(Z,b);const rt={x:be.x,z:be.z,fx:b.x,fz:b.z,lx:b.z,lz:-b.x},ba=[];for(let e=0;e<=760;e+=40){const t=45e-5*e*e-8;ba.push([rt.x+rt.lx*e+rt.fx*t,rt.z+rt.lz*e+rt.fz*t])}const Ro=L.range(0,60),Ts=L.range(0,60),Zt=Ge==="dry"?.2:0,_s=L.range(10,14),$a=[];let It=1,ja=0,Qa=1,Yt=!1;const kt={x:0,zEnd:-121,hw:13.2},Is=(e,t)=>p(-1.2,1.2,Math.abs(e-kt.x)-kt.hw-.4)*p(kt.zEnd,kt.zEnd+26,t)*(1-p(40,60,t)),Oe=(e,t,o=new s.Vector3)=>{V.posAtDist(e,o),V.tangentAtDist(e,b);const a=Math.hypot(b.x,b.z)||1;return o.x+=-b.z/a*t,o.z+=b.x/a*t,o.y=0,o},At=.25*G,Lo=-1,Ze=Oe(At+L.range(30,38),L.range(17,20)),Po=Oe(At+L.range(12,14),Lo*L.range(7.6,8.4)),Sa=Oe(L.range(210,235),L.range(44,52)),lt=z.core.makeRng((z.seed>>>0^49734321)>>>0),Eo=At+lt.range(12.3,12.9),qo=lt.range(4.1,4.3),To=6.4,Gs=15,_o=2.9,Ds=.9,Io=Oe(Eo,qo),Go=Oe(At+7.5,6.8),Xt=[{x:Ze.x,z:Ze.z,r:13},{x:Po.x,z:Po.z,r:11},{x:Go.x,z:Go.z,r:8.5}],Bs=[{x:Io.x,z:Io.z,r:_o*1.1+1.9},Xt[0],Xt[1]];Ge==="december"&&Xt.push({x:Sa.x,z:Sa.z,r:34});const Jt=(e,t)=>{let o=.53+.4*ce.fbm2(e*.0085+Ro,t*.0085+Ts,3);It=1,ja=0,Qa=1;const a=e-Ve(90),h=t+560;if(a*a+h*h<1500*1500){const i=qs(e,t),l=Math.abs(i.lat),v=i.d-Z,w=1-p(216,250,i.d),g=_s+2+5*ce.n2(i.d*.02,Ro)+9*p(104,140,i.d)*(1-p(224,248,i.d));o+=.2*(1-p(60,190,l))*(1-p(-40,20,v)),o+=.6*p(236,256,i.d)*(1-p(326,348,i.d))*(1-p(26,44,l)),o-=.8*w*(1-p(g,g+10,l));const M=p(8,36,v)*(1-p(nt+mt-80,nt+mt+40,v));o-=.95*M*(1-p(36,54,l)),It=1-p(-30,20,v)*(1-p(46,64,l));{const u=e-et.x,c=t-et.z,x=(15-5.2)*p(.91*G-40,.91*G,i.d);ja=p(i.lat<-8?120:50,i.lat<-8?160:90,v)*(1-p(ft+30,ft+90,v))*p(5.2+x,8.5+x,l)*(1-p(44,60,l))*p(16,30,Math.sqrt(u*u+c*c))}It*=1-w*(1-p(g-3,g+5,l)),o+=.75*p(8,60,v)*(1-p(nt+150,nt+330,v))*p(44,56,-i.lat)*(1-p(118,140,-i.lat));let y=1e9;for(let u=0;u<ba.length;u++){const c=e-ba[u][0],x=t-ba[u][1];y=Math.min(y,c*c+x*x)}y=Math.sqrt(y),o-=.85*(1-p(30,48,y)),It*=p(40,60,y),o+=.5*(1-p(36,60,Math.abs(y-88)))*p(60,110,rt.lx*(e-rt.x)+rt.lz*(t-rt.z));for(let u=0;u<Xt.length;u++){const c=Xt[u],x=e-c.x,m=t-c.z;o+=.7*(1-p(c.r*.6,c.r*1.25,Math.sqrt(x*x+m*m)))}if(i.d<300){let u=0;for(let c=0;c<so.length;c++){const x=so[c],m=e-x.x,d=t-x.z;u=Math.max(u,1-p(x.r-4,x.r+12,Math.sqrt(m*m+d*d)))}o=Ne(o,Math.min(o,-.3),u),It*=1-u}if(i.d<520&&l<40)for(let u=0;u<Fa.length;u++){const c=Fa[u],x=e-c.x,m=t-c.z;Qa*=p(c.r,c.r+6,Math.sqrt(x*x+m*m))}Yt||(o+=.95*Is(e,t));for(let u=0;u<$a.length;u++){const c=$a[u];if(c.open||Yt&&!c.bake)continue;const x=e-c.x,m=t-c.z,d=Math.sqrt(x*x+m*m);o-=1.3*(1-(Yt?p(c.R-5,c.R+7,d):p(c.R-.3,c.R+1.2,d)))}}const n=Math.max(Math.abs(e-Ve(90)),Math.abs(t+560));return Ie(Ne(o,.3,p(1500,1900,n)),0,1)},Za=(e,t,o=.08)=>Jt(e,t)+Zt>.5+o,Os=(e,t,o=.1)=>Jt(e,t)+Zt<.5-o,Ns={near:268,mid:Math.round(860*Math.min(dt,1.1)),far:Math.round(7400*Math.min(dt,1.2)),mirror:1060,sprites:1400,farMirror:3e3,midMirror:700},za=L.range(0,2)+.3475*G-Z,Ya=38,Do=ae?.668:.612,Bo=2.4+L.range(5.2,5.8),ea=(e,t)=>{const o=Ie((e-66)/160,0,1);let a=-78+118*(.6*o+.4*o*o*(3-2*o));return a=Ne(a,58,p(.6,.72,t)),a=Ne(a,40,p(.8,.93,t)),a},Ft=15,Oo=40,ta=Ft+8+9+7+6+Oo,Ma=72,Xa=ta+Ma,Ja=9,ka=36,aa=(e,t)=>(o,a)=>{const h=Ie((o+Z-20)/G,0,1),n=o>ft-40?a.range(-14,4):a.range(e,t);return Ie((ea(o-20,h)-n)/Ya,0,3)},Gt=.615*G-Z,eo=[];for(let e=0;e<gt;e++)eo.push(new s.Vector4(0,1e6,0,0));const to=[];for(let e=0;e<Va;e++)to.push(new s.Vector4(1e6,0,1,1));const it={uField:{value:null},uFieldRect:{value:new s.Vector4(0,0,1,0)},uSaltBias:{value:Zt},uPools:{value:eo},uCause:{value:new s.Vector4(kt.x,kt.zEnd,kt.hw,1)},uRoute:{value:jt},uGrp:{value:to}},Us={uniforms:it,pars:`
uniform sampler2D uField; uniform vec4 uFieldRect; uniform float uSaltBias; uniform vec4 uPools[${gt}];
${q.GLSL_HASH}
${q.GLSL_VALUE_NOISE}
${ya}
float mirrorOnWater(vec2 q){
  float dP = 1e4;
  for (int i = 0; i < ${gt}; i++) { vec4 pl = uPools[i]; dP = min(dP, length(q - pl.xy) - pl.z); }
  dP += (vnoise(q*0.5 + 5.) - 0.5)*1.7;
  return max(1. - smoothstep(0.46, 0.5, crustSd(q, 0.)), 1. - smoothstep(-0.25, 0.05, dP));
}`},Aa=e=>V.posAtDist(Ie(e,0,G),be).y,ao=5.2,tt=z.core.makeRng((z.seed>>>0^128130141)>>>0),Ks=tt.fork("wave-body"),Vs=tt.fork("blizzard"),Hs=tt.fork("early-wall"),Ws=tt.fork("stream"),$s=Math.floor(tt.fork("plates")()*97),Ke=tt.fork("groups"),oo=tt.fork("riser-stand"),No=[],so=[],Fa=[],Uo=[],no=[],Dt=[],js=92,Ko=96;await z.yield();const Qs=Z+Ko,Zs=Ke()<.5?-1:1,ro=Z+za,Ys=Aa(0);for(let e=0,t=18+Ke.range(0,6);t<Qs;e++,t+=e===1?Ke.range(1,5):15.2*(.45+.55*Aa(t)/Ys)+Ke.range(-2,2)){const o=(e%2?-1:1)*Zs,a=4+Math.floor(Ke()*3.999),h=Ke.range(1.2,1.7),n=7.2+Ke.range(0,.8);Oe(t+(a-1)*.4,o*(n+1.8),B);const i=Jt(B.x,B.z)+Zt>.4,l=i?.8:h,v=i?2.6:4;let w=!1;for(const y of Bs)Math.hypot(B.x-y.x,B.z-y.z)<y.r+Gs+Math.max(.5*(a-1)*l,.5*v)&&(w=!0);if(w||o<0&&Math.abs(t+5-ro)<22)continue;let g=0,M=0;for(let y=0;y<a;y++){const u=t+y*l+Ke.range(-.5,.5),c=o*(n+(i?.5:0)+v*((y*.618+Ke()*.5)%1)),x=Ke(),m=y===0?1:x<.42?0:x<.6?1:x<.74?3:x<.87?2:5,d=Ke.range(.9,1),C=(Ke()<.5?-1:1)*Ke.range(.9,2.2),k=Ke.range(-3.1,3.1);u>Z-6?no.push({s:u-Z,lat:c,beh:m,size:d,hold:.05+.55*Ke()}):No.push({s:u-Z,lat:c,size:d,beh:m,yaw:m===0?k:C}),g+=u/a,M+=c/a}Oe(g,M,B),i&&Uo.push({x:B.x,z:B.z,r:3.5,pool:!0}),g<216&&so.push({x:B.x,z:B.z,r:8}),Dt.push([g,M,1.6+.5*a*l,3.1])}for(let e=0;e<Math.min(Va,Dt.length);e++)to[e].set(Dt[e][0],Dt[e][1],Dt[e][2],Dt[e][3]);await z.yield();for(let e=0;e<12;e++){const t=e%2?1:-1,o=e>>1;o%3===1&&(Oe(ro+t*(14.8+1.5*o),-9,B),Fa.push({x:B.x,z:B.z,r:4.5})),o<3&&(Oe(ro+t*5*o,-13,B),Fa.push({x:B.x,z:B.z,r:5})),no.push({s:za+t*(14.8+1.5*o+tt.range(-.4,.4)),lat:-(6.5+5*((o*.618+.3*tt())%1)),beh:[0,0,3,0,1,5][o],size:tt.range(.9,1),hold:.3+.6*tt()})}const Vo=Oe(Z+za,-Bo),Xs=new s.Vector3(Vo.x,.7,Vo.z),io=new s.Vector3,lo=new s.Vector3,ho=new s.Vector3,co=new s.Vector3,Ho=ae?.701:.62,Js=[{at:(e,t)=>(V.posAtDist(Math.min(t*G+30,G),lo),lo.y=-2.5,lo),from:.02,to:.3,weight:.36,fade:.2},{at:Xs,from:.26,to:.385,weight:.62,fade:.3},{at:(e,t)=>(V.posAtDist(Math.min(t*G+70,G),io),io.y+=1,io),from:.4,to:.6,weight:.4,fade:.3},{at:(e,t)=>(V.posAtDist(Math.min(t*G+26,G),ho),ho.y=.4,ho),from:Ho-.055,to:Ho+.065,weight:.32,fade:.3},{at:(e,t)=>(V.posAtDist(Math.min(t*G+45,G),co),co.y=1,co),from:.85,to:.93,weight:.3,fade:.3}],e0=e=>{if(e.march||e.s<1e4&&e.cruise<2)return;const t=e.s<1e4,o=Z+(t?e.s:e.s0);if(!(o<Z+240))return;let a=e.lat;const h=t&&e.s>-20?To:ao;Math.abs(a)<h&&(a=(a<0?-1:1)*(h+1.3*(e.seed*17.3%1))),a!==e.lat&&(Oe(o,a,B),e.x=B.x,e.z=B.z,e.lat=a)};await z.yield();const uo=e=>.5*(e+Math.sqrt(e*e+.16)),oa=.98,sa=ao,Ca=(e,t,o,a)=>{const h=(o-e.uc)*Pe,n=e.hang??1.5,i=e.slow??2,l=o*G,v=(e.a0??6.8)-i*h+(18.4-i)*uo(-h-n)-((e.low?8:14)-i)*uo(h-n)+.5*Math.sin(t*.4+e.ph*2.9),w=e.low?0:p(5.6,2,v);V.posAtDist(l,be);const g=be.y;V.posAtDist(Math.min(l+v,G+30),a),V.tangentAtDist(Math.min(l+v,G),b);const M=Math.hypot(b.x,b.z)||1,y=e.lat+(e.vlat??0)*h+.4*Math.sin(t*.6+e.ph)+Math.sign(e.lat)*(1.3*w+(e.swing?e.swing*p(10.5,4.5,v):0))+(e.low?(e.lat<0?-1:1)*4.2*uo(h-n+.1):0);a.y=Math.max(g+e.up+(e.climb??0)*h+.28*Math.sin(t*.8+e.ph*2.3)+2.7*w*(e.up>.2?1:0),1.3);const u=(e.lat<0?-1:1)*Math.hypot(y,sa*p(0,oa,g-a.y));return a.x+=-b.z/M*u,a.z+=b.x/M*u,a.w=v,a},qe=new s.Vector4,Wo=[],fo=3,t0=1.5,Ra=e=>{const t=e*G-Z;return t+ea(t,e)},$o=e=>{const t=Math.min(e,2.1);return .5*7.143*t*t+15*Math.max(e-2.1,0)},jo=e=>((e+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI,Qo=[];await z.yield();{const e=Hs,t=12,o=45,a=25,h=31,n=.62,i=[.9,1.3],l=c=>ea(c*G-Z,c),v=c=>{let x=0,m=1;for(let d=0;d<30;d++){const C=.5*(x+m);Ra(C)<c?x=C:m=C}return .5*(x+m)};let w=.2,g=n;for(let c=0;c<30;c++){const x=.5*(w+g);l(x)<t+fo+1?w=x:g=x}const M=Ra(g),y=Math.max(Ra(n-(i[0]+i[1])/Pe),M+1),u=(c,x)=>Ca(c,0,x,qe).w-.5*Math.sin(c.ph*2.9);for(let c=0;c<Ma;c++){(c&7)===7&&await z.yield();const x=M+(c+e())/Ma*(y-M),m=v(x),d=l(m),C=Aa(m*G),k=e(),R=Ne(1.6,a-2,k*k),K=R-C,j=Ne(t,Math.max(Math.min(d,o)-fo-1,t),Ie(.08+.72*k+e.range(-.16,.2),0,1));let T=(e()<.5?-1:1)*h*Math.pow(e(),1.5);Math.abs(T)<1.6&&(T=(T<0?-1:1)*e.range(1.6,2.4));const te=j>=26&&e()<.25,f={uc:m,a0:j,lat:T,up:K,climb:K>1?e.range(.15,.5):0,slow:1.5,hang:e.range(i[0],i[1]),low:!1,swing:K<.5?6:0,rise:(zs.climb+zs.climbPerM*R)/Pe,size:te?e.range(1.3,1.4):e.range(.96,1.08),ph:e.range(0,6.28),s:x,gone:1};w=m-.03,g=m+.25;for(let W=0;W<26;W++)f.uc=.5*(w+g),u(f,m)<d-fo?w=f.uc:g=f.uc;f.uc=.5*(w+g),w=f.uc,g=f.uc+.4;for(let W=0;W<26;W++){const re=.5*(w+g);u(f,re)>-6.5?w=re:g=re}f.gone=g;const E=(T<0?-1:1)*Math.hypot(T,sa*p(0,oa,-K))+.4*Math.sin(f.ph);Oe(Z+x,E,B),V.tangentAtDist(Math.min(Z+x,G),b);const _=Math.hypot(b.x,b.z)||1,Q=oo();f.gx=B.x,f.gz=B.z,f.fx=b.x/_,f.fz=b.z/_,f.yawF=Math.atan2(b.x,b.z),f.rest=f.yawF+oo.range(-2.6,2.6),f.beh=Q<.5?0:Q<.68?1:Q<.8?3:Q<.92?2:5,Qo.push({x:f.gx,z:f.gz,yaw:f.yawF,s:f.s,size:f.size,seed:oo()}),Wo.push(f)}}await z.yield();const Te=await A0(z,{adjust:e0,escorts:Xa+Ja+ka,stragglers:[{count:Math.round(118*(.75+.25*ge)),from:js,to:250,lat:[.8,8.5],cruise:[.45,.95],jit:aa(-12,30)},{count:Math.round(86*(.75+.25*ge)),from:250,to:Gt,lat:[.6,10],cruise:[.55,1.25],jit:aa(-12,34)},{count:Math.round(56*(.75+.25*ge)),from:Gt,to:.73*G-Z,lat:[.6,10],cruise:[.55,1.35],jit:aa(-12,34)},{count:Math.round(72*(.75+.25*ge)),from:.73*G-Z,to:ft-5,jit:aa(-12,34)}],calm:[{count:40,from:Ko,to:330,lat:[6.6,11.5],hold:[0,.6]}],calmPlace:no,wall:[{count:Math.round(330*(.7+.3*ge)),from:150,to:Gt+70,lat:15,high:.34,low:7.5},{count:Math.round(92*(.7+.3*ge)),from:Gt+70,to:ft-185,lat:16,high:.3,low:7.5},{count:Math.round(92*(.7+.3*ge)),from:170,to:Gt+30,lat:8.5,high:.4,low:7.5},{count:Math.round(108*(.7+.3*ge)),from:236,to:Gt+40,lat:14,latMin:6.4,cruise:[2.7,4.6],jit:aa(8,40)}],mirrorClip:Us,spriteBirds:Qo,palette:Ka,nearBias:[nt*.3,nt*.74,.55],length:nt,tail:mt,vF:Ya,path:V,pathFrom:Z,water:!1,counts:Ns,density:1,season:Ge,weather:ye==="rains"?"rains":ye==="noon"?"noon":"calm",skyHorizon:O.hor,skyZenith:O.zen,light:{sunDir:U,sunColor:ue,sky:de,ground:Mt},marchStation:za,marchGap:Bo,marchCount:333,marchRadius:19,marchHold:1.1,marchLead:0,outliers:{mid:Math.round(250*Math.min(dt,1.1)),far:Math.round(2400*dt*(.5+.5*ge)),from:-Z,horn:700,keep:(e,t)=>Os(e,t,.04),avoid:[At-34-Z,At+52-Z],minLat:To,pool:[{s:Eo-Z,lat:qo,r:_o,n:10,size:.97,minLat:ao,along:.95,across:Ds}],place:No}});xe.add(Te.object),xe.userData.natron={marabou:null};{let e=0;for(const t of Uo.concat(Te.outlierGroups||[]))t.R=t.pool?t.r*1.1+1.9:t.r*1.5+2.2,t.open||(e<gt?eo[e++].set(t.x,t.z,t.R,0):t.bake=!0),$a.push(t)}Te.uniforms.uRipple.value=O.ripple,O.rim&&Te.uniforms.uRim.value.set(O.rim[0],O.rim[1]),Te.uniforms.uOver.value.set(118,.86*G-Z);const mo=5+.3+.035+.35*1.02,po=5.5;Te.uniforms.uOverH.value.set(3.2+mo,po),await z.yield();const ht=384,na=3840,Zo=Ve(90)-na/2,Yo=-560-na/2,ra=new Uint8Array(ht*ht*4);Yt=!0;for(let e=0;e<ht;e++){for(let t=0;t<ht;t++){const o=Jt(Zo+(t+.5)/ht*na,Yo+(e+.5)/ht*na),a=(e*ht+t)*4;ra[a]=Math.round(o*255),ra[a+1]=Math.round(It*255),ra[a+2]=Math.round(ja*255),ra[a+3]=Math.round(Qa*255)}e%4===3&&await z.yield()}Yt=!1;const Bt=new s.DataTexture(ra,ht,ht,s.RGBAFormat,s.UnsignedByteType);Bt.magFilter=Bt.minFilter=s.LinearFilter,Bt.wrapS=Bt.wrapT=s.ClampToEdgeWrapping,Bt.needsUpdate=!0;const $e=64,Ot=.27,Ct=new Uint8Array($e*$e*4);{const e=lt.fork("sites");for(let t=0;t<$e*$e;t++)Ct[t*4]=e.int(0,255),Ct[t*4+1]=e.int(0,255),Ct[t*4+2]=e.int(0,255),Ct[t*4+3]=255}const Nt=new s.DataTexture(Ct,$e,$e,s.RGBAFormat,s.UnsignedByteType);Nt.magFilter=Nt.minFilter=s.NearestFilter,Nt.wrapS=Nt.wrapT=s.RepeatWrapping,Nt.needsUpdate=!0,it.uField.value=Bt,it.uFieldRect.value.set(Zo,Yo,1/na,$s);const vo=X(O.fog),a0=zt.clone().multiply(de.clone().multiplyScalar(.7).add(ue.clone().multiplyScalar(.45))).multiplyScalar(.3183),D={...q.fogUniforms(),...Ee,uField:it.uField,uSites:{value:Nt},uFieldRect:it.uFieldRect,uCause:it.uCause,uRoute:it.uRoute,uGrp:it.uGrp,uCam:{value:new s.Vector3},uShallow:{value:_t.clone()},uDeep:{value:pt.clone()},uOrange:{value:X("#c4541f").multiplyScalar(.75)},uSaltCol:{value:St.clone().multiplyScalar(.82)},uSkyHor:{value:X(O.hor)},uSkyZen:{value:X(O.zen)},uCrim:{value:ye==="moon"||ye==="rains"?0:1},uConeCol:{value:a0.clone().lerp(vo,O.coneHaze)},uPinkCol:{value:bt.clone().multiplyScalar(.8)},uCone:{value:new s.Vector4(Qe.Rb/Qe.dist,Ha(0)/Qe.dist,Qe.t0,Qe.k)},uShadow:{value:new s.Vector4(0,0,0,1)},uShadow2:{value:new s.Vector4(0,0,6,.015)},uShadow3:{value:new s.Vector4(0,0,0,0)},uPools:it.uPools,uGlit:{value:O.glit??(ye==="dawn"?1:ye==="rains"?.25:.6)},uCloud:{value:new s.Vector4(1,1,1,0)},uRipple:{value:O.ripple},uLum:{value:O.lum},uWet:{value:O.wet},uSaltGain:{value:O.salt},uSaltBias:it.uSaltBias,uMirage:{value:ye==="noon"?1:0},uFrontP:{value:new s.Vector4(0,1e5,0,-1)},uFrontK:{value:new s.Vector4(0,30,0,0)},uMar:{value:[new s.Vector4(0,1e5,2,0),new s.Vector4(0,1e5,2,0),new s.Vector4(0,1e5,2,0)]},uFlockCol:{value:X(Ka[2]).multiplyScalar(.82).multiply(de.clone().multiplyScalar(.75).add(Mt.clone().multiplyScalar(.5)).add(ue.clone().multiplyScalar(.5))).multiplyScalar(.3183)},uPix:{value:.0027},uMass:{value:new s.Vector4(.18,.04,.055,0)}};{const e=pt.clone().multiplyScalar(1.15*O.lum/.8).lerp(D.uFlockCol.value,.1);D.uMass.value.set(e.r,e.g,e.b,0)}{const e=H.clouds2||null,t=H.clouds||null,o=X(e?e.lit:t?t.shade:"#ffffff").multiplyScalar(.92);D.uCloud.value.set(o.r,o.g,o.b,ye==="moon"?0:e?.55:t?.6:0)}const wo=new s.CircleGeometry(4300,72);wo.rotateX(-Math.PI/2),wo.translate(Ve(90),0,-560);const La=new s.Mesh(wo,new s.ShaderMaterial({uniforms:D,vertexShader:C0,fragmentShader:R0,fog:!0}));La.frustumCulled=!1,La.matrixAutoUpdate=!1,La.name="lake",xe.add(La),await z.yield();{const e=[],t=[],o=[],a=[],h=lt.fork("rims"),n=(u,c)=>{const x=((c%$e+$e)%$e*$e+(u%$e+$e)%$e)*4;return[u+.5+(Ct[x]/255-.5)*.6,c+.5+(Ct[x+1]/255-.5)*.6]},i=[[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]],l=Z+64,v=new Set,w=[];for(let u=-14;u<=l;u+=3){V.posAtDist(Math.max(u,0),be),V.tangentAtDist(Math.max(u,0),b);const c=be.x+b.x*Math.min(u,0),x=be.z+b.z*Math.min(u,0);for(let m=-20;m<=20;m+=3){const d=Math.floor((c-b.z*m)*Ot),C=Math.floor((x+b.x*m)*Ot),k=d+":"+C;v.has(k)||(v.add(k),w.push([d,C]))}}await z.yield();let g=0;for(let u=0;u<w.length;u++){const[c,x]=w[u],m=n(c,x);let d=[[m[0]-2,m[1]-2,-1],[m[0]+2,m[1]-2,-1],[m[0]+2,m[1]+2,-1],[m[0]-2,m[1]+2,-1]];for(let C=0;C<8&&d.length>2;C++){const k=n(c+i[C][0],x+i[C][1]),R=k[0]-m[0],K=k[1]-m[1],j=R*(m[0]+k[0])*.5+K*(m[1]+k[1])*.5,T=[];for(let te=0;te<d.length;te++){const f=d[te],E=d[(te+1)%d.length],_=R*f[0]+K*f[1]-j,Q=R*E[0]+K*E[1]-j;if(_<=0&&T.push(f),_<=0!=Q<=0){const W=_/(_-Q);T.push([f[0]+(E[0]-f[0])*W,f[1]+(E[1]-f[1])*W,_<=0?C:f[2]])}}d=T}for(let C=0;C<d.length;C++){const k=d[C],R=d[(C+1)%d.length],K=k[2];if(K<0||K>3)continue;const j=k[0]/Ot,T=k[1]/Ot,te=(R[0]-k[0])/Ot,f=(R[1]-k[1])/Ot,E=Math.hypot(te,f);if(E<.45)continue;const _=j+te*.5,Q=T+f*.5,W=V.nearestXZ(_,Q);if(W.dist>17.5||Jt(_,Q)+Zt<.36)continue;const re=1-p(11.5,17.5,W.dist),ee=-f/E,he=te/E,oe=Math.max(1,Math.round(E/.9)),Me=(.085+.06*h())*re,fe=.18+.05*h(),Ae=h();let Se=-1;for(let He=0;He<=oe;He++){const Ye=He/oe,se=.55+.45*Math.sin(Math.PI*Ye),le=(h()-.5)*.07*Math.sin(Math.PI*Ye),Y=Math.max(Me*se*(.7+.6*h()),.004),we=j+te*Ye,Fe=T+f*Ye,me=Math.hypot(Y,fe),pe=e.length/3;e.push(we+ee*fe,.004,Fe+he*fe,we+ee*le,Y,Fe+he*le,we+ee*le,Y,Fe+he*le,we-ee*fe,.004,Fe-he*fe),t.push(ee*Y/me,fe/me,he*Y/me,ee*Y/me,fe/me,he*Y/me,-ee*Y/me,fe/me,-he*Y/me,-ee*Y/me,fe/me,-he*Y/me),o.push(0,Ae,1,Ae,1,Ae,0,Ae),Se>=0&&(a.push(Se,pe,pe+1,Se,pe+1,Se+1,Se+2,pe+2,pe+3,Se+2,pe+3,Se+3),g++),Se=pe}}u%50===49&&await z.yield()}await z.yield();const M=new s.BufferGeometry;M.setAttribute("position",new s.Float32BufferAttribute(e,3)),M.setAttribute("normal",new s.Float32BufferAttribute(t,3)),M.setAttribute("aR",new s.Float32BufferAttribute(o,2)),M.setIndex(a);const y=new s.Mesh(M,new s.ShaderMaterial({vertexShader:V0,fragmentShader:H0,fog:!0,side:s.DoubleSide,uniforms:{...q.fogUniforms(),...Ee,uSaltCol:D.uSaltCol,uSaltGain:D.uSaltGain,uField:D.uField,uFieldRect:D.uFieldRect,uSaltBias:D.uSaltBias,uPools:D.uPools,uCause:D.uCause,uRoute:D.uRoute,uGrp:D.uGrp,uShadow:D.uShadow,uShadow2:D.uShadow2,uShadow3:D.uShadow3}}));y.frustumCulled=!1,y.matrixAutoUpdate=!1,xe.add(y)}await z.yield();const Xo=(e,t)=>{const o=W0(e),a=new Float32Array(t*4),h=new Float32Array(t*4),n=new Float32Array(t*4),i={iP:new s.InstancedBufferAttribute(a,4),iQ:new s.InstancedBufferAttribute(h,4),iR:new s.InstancedBufferAttribute(n,4)};for(const y in i)i[y].setUsage(s.DynamicDrawUsage);for(let y=0;y<t;y++)a[y*4+1]=-60,n[y*4+3]=lt();const l=new s.InstancedBufferGeometry;l.index=o.index;for(const y in o.attributes)l.setAttribute(y,o.attributes[y]);for(const y in i)l.setAttribute(y,i[y]);l.instanceCount=t;const v=()=>({...q.fogUniforms(),...Ee,uCam:D.uCam,uRipple:D.uRipple,uDeep:D.uDeep,uField:D.uField,uFieldRect:D.uFieldRect,uSaltBias:D.uSaltBias,uCause:D.uCause,uRoute:D.uRoute,uGrp:D.uGrp}),w=e==="pelican"?{PELICAN:1}:{},g=new s.Mesh(l,new s.ShaderMaterial({uniforms:v(),vertexShader:Ps,fragmentShader:Es,fog:!0,side:s.DoubleSide,defines:{...w}})),M=new s.Mesh(l,new s.ShaderMaterial({uniforms:v(),vertexShader:Ps,fragmentShader:Es,fog:!0,side:s.DoubleSide,defines:{...w,MIRROR:1},transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}));return g.frustumCulled=M.frustumCulled=!1,g.matrixAutoUpdate=M.matrixAutoUpdate=!1,M.renderOrder=1,g.name=e==="pelican"?"pelicans":e,xe.add(g,M),{n:t,iP:a,iQ:h,iR:n,tris:o.index.count/3,set(y,u,c,x,m,d,C,k,R,K,j){const T=y*4;a[T]=u,a[T+1]=c,a[T+2]=x,a[T+3]=m,h[T]=d,h[T+1]=C,h[T+2]=k,h[T+3]=R,n[T]=K,n[T+1]=j},commit(){i.iP.needsUpdate=i.iQ.needsUpdate=i.iR.needsUpdate=!0}}},Ut=new s.Group;xe.add(Ut);{const o=[],a=[],h=[],n=X("#a9a6a0"),i=zt.clone().multiplyScalar(.74),l=L.range(0,50);for(let f=0;f<=30;f++){const E=Qe.t0+(1-Qe.t0)*Math.pow(f/30,1.45);for(let _=0;_<96;_++){const Q=_/96*Math.PI*2,W=Math.cos(Q),re=Math.sin(Q),ee=ce.n2(W*1.7+l,re*1.7),he=Math.pow(Math.abs(Math.sin(Q*11+ee*2.4)),.7),oe=Math.pow(Math.abs(Math.sin(Q*29+ee*5+1.3)),.8),Me=p(.04,.3,E)*(1-.5*p(.6,1,E)),fe=Qe.Rb*E*(1+.07*ee-Me*(.13*(1-he)+.05*(1-oe))),Ae=f===30?-30:Ha(E)*(1+.035*ce.n2(W*4+l,re*4+E*3))+(f===0?10*ce.n2(Q*3,l):0);o.push(re*fe,Ae,W*fe);const Se=p(.1,.7,ce.n2(Q*9+l,E*2.5))*(1-p(.08,.5,E)),He=i.clone().multiplyScalar(.82+.3*he*Me+.12*ee).lerp(n,.75*Se+.25*(1-p(.05,.16,E)));a.push(He.r,He.g,He.b)}await z.yield()}for(let f=0;f<30;f++)for(let E=0;E<96;E++){const _=f*96+E,Q=f*96+(E+1)%96,W=_+96,re=Q+96;h.push(_,W,Q,Q,W,re)}const v=o.length/3;o.push(0,Ha(0)-26,0),a.push(i.r*.6,i.g*.6,i.b*.6);for(let f=0;f<96;f++)h.push(v,f,(f+1)%96);const w=new s.BufferGeometry;w.setAttribute("position",new s.Float32BufferAttribute(o,3)),w.setAttribute("color",new s.Float32BufferAttribute(a,3)),w.setIndex(h),await z.yield(),w.computeVertexNormals(),await z.yield();const g=new s.ShaderMaterial({vertexShader:L0,fragmentShader:P0,uniforms:{...Ee,uHaze:{value:vo.clone()},uHazeAmt:{value:O.coneHaze},uMirage:{value:ye==="noon"?1:0}}}),M=new s.Mesh(w,g);M.position.set(0,0,-Qe.dist),M.frustumCulled=!1,Ut.add(M),await z.yield();const y=new s.PlaneGeometry(900,420),u=X("#f1eee8").multiply(de.clone().add(ue.clone().multiplyScalar(.55))).multiplyScalar(.3183*.9),c=new s.Mesh(y,new s.ShaderMaterial({vertexShader:As,fragmentShader:Fs,transparent:!0,depthWrite:!1,uniforms:{uCol:{value:u},uTime:Ee.uTime,uAmt:{value:ye==="moon"?.6:.85}}}));c.position.set((.5-.12)*900,Ha(0)+(.5-.1)*420-14,-Qe.dist+70),c.frustumCulled=!1,c.renderOrder=1,Ut.add(c),await z.yield();const x=[],m=[],d=[],C=L.range(0,40),k=Math.hypot(U.x,U.z)||1,R=(f,E,_,Q,W,re)=>{const ee=x.length/3;for(let he=0;he<=_;he++){const oe=he/_,Me=(f+(E-f)*oe)*Math.PI/180,fe=Q(oe),Ae=Math.sin(Me),Se=-Math.cos(Me),He=Ie((-Ae*U.x-Se*U.z)/k*.75+.3,.04,1)*Ie(U.y*2.4+.45,.5,1),Ye=[[-12,1,0],[fe*.38,1.02,.4],[fe*.9,1.028,.86],[fe,1.05,1]];for(const[se,le,Y]of Ye)x.push(Ae*re*le,se,Se*re*le),m.push(oe,Y,W,He)}for(let he=0;he<_;he++)for(let oe=0;oe<3;oe++){const Me=ee+he*4+oe,fe=Me+4;d.push(Me,fe,Me+1,Me+1,fe,fe+1)}},K=(f,E,_)=>{const Q=ce.n2(f*E+C+_,1.5),W=ce.n2(f*E*3.1+_,C+4.2),re=ce.n2(f*E*13+_,7);return .5+.26*p(-.25,-.12,Q)+.22*p(.18,.3,Q+.3*W)-.14*p(.42,.5,W)+.035*re},j=(f,E,_)=>p(0,E,f)*(1-p(1-_,1,f));R(21,172,190,f=>330*K(f,7,0)*j(f,.07,.14),1,3900),R(27,150,150,f=>118*K(f,11,31)*j(f,.12,.2),.55,3600),R(-112,-21,130,f=>105*K(f,9,57)*j(f,.2,.1)*(.55+.45*p(.1,.6,f)),1.55,3850),R(-170,-116,44,f=>250*Math.pow(Math.sin(Math.PI*f),1.4)*(.94+.06*ce.n2(f*7,C)),1.5,3950),await z.yield();const T=new s.BufferGeometry;T.setAttribute("position",new s.Float32BufferAttribute(x,3)),T.setAttribute("aInfo",new s.Float32BufferAttribute(m,4)),T.setIndex(d);const te=new s.Mesh(T,new s.ShaderMaterial({vertexShader:E0,fragmentShader:q0,side:s.DoubleSide,uniforms:{uCol:{value:X("#a8998e")},uHaze:{value:vo.clone()},uSunCol:Ee.uSunCol,uFill:Ee.uFill,uHazeAmt:{value:O.wallHaze}}}));if(te.frustumCulled=!1,Ut.add(te),await z.yield(),ye==="rains"){const f=new s.ShaderMaterial({vertexShader:D0,fragmentShader:B0,transparent:!0,depthWrite:!1,side:s.DoubleSide,uniforms:{uCol:{value:X("#77828c").multiply(de).multiplyScalar(.35013000000000005)},uTime:Ee.uTime}}),E=[],_=[],Q=[];for(const[ee,he,oe]of[[52,1500,900],[84,1900,1050],[118,1400,850],[-64,1300,800],[20,700,620]]){const Me=ee*Math.PI/180,fe=new s.PlaneGeometry(he,oe),Ae=E.length/3;fe.rotateY(-Me),fe.translate(Math.sin(Me)*3300,oe*.5-20,-Math.cos(Me)*3300);for(const Se of fe.attributes.position.array)E.push(Se);for(const Se of fe.attributes.uv.array)_.push(Se);for(const Se of fe.index.array)Q.push(Ae+Se);fe.dispose()}const W=new s.BufferGeometry;W.setAttribute("position",new s.Float32BufferAttribute(E,3)),W.setAttribute("uv",new s.Float32BufferAttribute(_,2)),W.setIndex(Q);const re=new s.Mesh(W,f);re.frustumCulled=!1,re.renderOrder=1,Ut.add(re)}}await z.yield();const go=(e,t,o,a)=>{const h=new s.InstancedBufferGeometry;h.index=e.index;for(const n in e.attributes)h.setAttribute(n,e.attributes[n]);return h.setAttribute("iN",new s.InstancedBufferAttribute(o.subarray(0,t*4),4)),h.setAttribute("iM",new s.InstancedBufferAttribute(a.subarray(0,t*4),4)),h.instanceCount=t,h},Pa=(e,t,o={},a={})=>new s.ShaderMaterial(Object.assign({vertexShader:e,fragmentShader:t,fog:!0,uniforms:{...q.fogUniforms(),...Ee,...o}},a));{const e=[],t=[],o=[],a=[],h=[],n=(se,le,Y,we,Fe,me,pe,Ce,De)=>{e.push(se,le,Y);const _e=Math.hypot(we,Fe,me)||1;return t.push(we/_e,Fe/_e,me/_e),o.push(pe.r,pe.g,pe.b),a.push(Ce,De),e.length/3-1},i=X("#8d8479"),l=X("#b9b2a6"),v=X("#3d3733"),w=bt.clone().multiplyScalar(.82),g=w.clone().lerp(St,.3),M=w.clone().lerp(X(qt[3]),.45),y=X("#141214"),u=5,c=[];for(let se=0;se<u;se++){const le=se/u*Math.PI*2,Y=Math.cos(le),we=Math.sin(le);c.push([n(Y*.36,0,we*.36,Y,.5,we,i,0,0),n(Y*.16,.3,we*.16,Y,.9,we,l,0,0)])}const x=n(0,.25,0,0,1,0,v,0,0);for(let se=0;se<u;se++){const le=c[se],Y=c[(se+1)%u];h.push(le[0],le[1],Y[1],le[0],Y[1],Y[0],x,Y[1],le[1])}const m=n(0,.42,.2,0,.3,1,g,1,0),d=n(0,.45,-.27,0,.3,-1,y,1,0),C=n(0,.56,-.03,0,1,0,w,1,0),k=n(0,.3,-.02,0,-1,0,M,1,0),R=n(.12,.42,-.03,1,.2,0,M,1,0),K=n(-.12,.42,-.03,-1,.2,0,M,1,0);h.push(m,R,C,m,C,K,d,C,R,d,K,C,m,k,R,m,K,k,d,R,k,d,k,K);const j=[[.45,.17,.035],[.6,.23,.028],[.74,.2,.024],[.82,.25,.03]];let T=null;for(let se=0;se<j.length;se++){const[le,Y,we]=j[se],Fe=se/(j.length-1),me=n(we,le,Y,.7,.4,.6,g,2,Fe),pe=n(-we,le,Y,-.7,.4,.6,g,2,Fe);T&&h.push(T[0],me,pe,T[0],pe,T[1]),T=[me,pe]}const te=n(0,.86,.24,0,1,.3,g,2,1),f=n(0,.8,.36,0,.5,1,M,2,1),E=n(0,.72,.38,0,0,1,y,2,1);h.push(T[0],te,f,T[1],f,te,T[0],f,E,T[1],E,f);const _=new s.BufferGeometry;_.setAttribute("position",new s.Float32BufferAttribute(e,3)),_.setAttribute("normal",new s.Float32BufferAttribute(t,3)),_.setAttribute("color",new s.Float32BufferAttribute(o,3)),_.setAttribute("aPart",new s.Float32BufferAttribute(a,2)),_.setIndex(h);const Q=se=>{const le=[],Y=[],we=[],Fe=[],me=[],pe=(De,_e,We,fa,Pt,Et,r)=>{le.push(De,_e,We);const F=Math.hypot(fa,.7,Pt);return Y.push(fa/F,.7/F,Pt/F),we.push(Et.r,Et.g,Et.b),Fe.push(r,0),le.length/3-1};for(let De=0;De<2;De++){const _e=De===0?1:0,We=1-_e;(se||De===0)&&me.push(pe(-.4*_e,0,-.4*We,We,_e,i,0),pe(0,.36,0,We,_e,l,0),pe(.4*_e,0,.4*We,We,_e,i,0)),(se||De===1)&&me.push(pe(-.22*_e,.3,-.27*We,We,_e,M,1),pe(0,.62,.02,We,_e,De===0?g:w,1),pe(.22*_e,.3,.27*We,We,_e,M,1))}const Ce=new s.BufferGeometry;return Ce.setAttribute("position",new s.Float32BufferAttribute(le,3)),Ce.setAttribute("normal",new s.Float32BufferAttribute(Y,3)),Ce.setAttribute("color",new s.Float32BufferAttribute(we,3)),Ce.setAttribute("aPart",new s.Float32BufferAttribute(Fe,2)),Ce.setIndex(me),Ce},W=Q(!0),re=Q(!1),ee=Math.round(2e3*(.6+.4*ge)),he=Math.round(100*(.75+.25*ge)),oe=[],Me=new Set,fe=Ge==="october"?.8:Ge==="dry"?.6:.22,Ae=L.fork("nests");await z.yield();for(let se=ee*9;oe.length<ee&&se>0;se--){(se&63)===0&&await z.yield();const le=Ae.range(14,nt+110),Y=-(46.5+86*Math.pow(Ae(),1.5));if(Oe(Z+le,Y,B),.5+.5*ce.fbm2(B.x*.035,B.z*.035,2)<.26+.3*Ae())continue;const we=Math.round(B.x/1.3)+":"+Math.round(B.z/1.3);Me.has(we)||!Za(B.x,B.z,.1)||(Me.add(we),oe.push([-Y,B.x,B.z,Ae.range(0,6.283),Ae.range(.85,1.2),Ae(),Ae()<fe?1:0]))}oe.sort((se,le)=>se[0]-le[0]),await z.yield();const Se=Pa(T0,Cs,{},{side:s.DoubleSide}),He=Math.min(he,oe.length),Ye=Math.min(he+500,oe.length);for(const[se,le,Y]of[[0,He,_],[He,Ye,W],[Ye,oe.length,re]]){const we=le-se,Fe=new Float32Array(Math.max(we,1)*4),me=new Float32Array(Math.max(we,1)*4);for(let Ce=0;Ce<we;Ce++){const De=oe[se+Ce];Fe[Ce*4]=De[1],Fe[Ce*4+1]=De[2],Fe[Ce*4+2]=De[3],Fe[Ce*4+3]=De[4]*(Y===_?1:1.15),me[Ce*4]=De[5],me[Ce*4+1]=De[6]}const pe=new s.Mesh(go(Y,we,Fe,me),Se);pe.frustumCulled=!1,pe.matrixAutoUpdate=!1,xe.add(pe),await z.yield()}}await z.yield();let Ea=null;{const e=[],t=[],o=[],a=L.fork("grass");for(let y=0;y<7;y++){const u=y/7*Math.PI*2+a.range(-.3,.3),c=a.range(.05,.28),x=a.range(.32,.5),m=Math.cos(u),d=Math.sin(u),C=e.length/3;for(let k=0;k<3;k++){const R=k/2,K=.03+c*R*R,j=.02*(1-R*.85),T=x*R;e.push(m*K-d*j,T,d*K+m*j,m*K+d*j,T,d*K-m*j),t.push(R,y/7,R,y/7)}for(let k=0;k<2;k++){const R=C+k*2;o.push(R,R+1,R+3,R,R+3,R+2)}}const h=new s.BufferGeometry;h.setAttribute("position",new s.Float32BufferAttribute(e,3)),h.setAttribute("aBlade",new s.Float32BufferAttribute(t,2)),h.setIndex(o);const n=Math.round(220*(.6+.4*ge)),i=new Float32Array(n*4),l=new Float32Array(n*4);Ea=Oe(Z+L.range(90,150),-L.range(52,60));let v=0;for(let y=n*10;v<n&&y>0;y--){(y&127)===0&&await z.yield();const u=v<n*.62?Ze:Ea,c=Math.abs(a.gauss())*6.5,x=a.range(0,6.283),m=u.x+Math.cos(x)*c*1.5,d=u.z+Math.sin(x)*c;!Za(m,d,.02)||V.nearestXZ(m,d).dist<8.5||(i[v*4]=m,i[v*4+1]=d,i[v*4+2]=a.range(0,6.283),i[v*4+3]=a.range(.8,1.5),l[v*4]=a(),l[v*4+1]=Ie(1-c/9+a.range(-.3,.3),0,1),v++)}const w=new s.Mesh(go(h,v,i,l),Pa(_0,Cs,{},{side:s.DoubleSide}));w.frustumCulled=!1,w.matrixAutoUpdate=!1,xe.add(w),await z.yield();const g=X("#f1eee8").multiply(de.clone().add(ue.clone().multiplyScalar(.55))).multiplyScalar(.3183*.9),M=new s.ShaderMaterial({vertexShader:As,fragmentShader:Fs,transparent:!0,depthWrite:!1,uniforms:{uCol:{value:g},uTime:Ee.uTime,uAmt:{value:ye==="moon"?.3:.46}}});for(const[y,u,c,x,m]of[[Ze,0,0,8,11.5],[Ze,4.5,-5,6,8],[Ze,-5.5,3.5,9.5,14],[Ea,0,0,9,13],[Ea,-6,-4,7,9.5]]){const d=new s.Mesh(new s.PlaneGeometry(x,m),M);d.position.set(y.x+u+(.5-.12)*x,m*.4,y.z+c),d.frustumCulled=!1,d.renderOrder=2,xe.add(d)}}await z.yield();let Rt=null;{const e=lt.fork("ribbons"),t=[[Ve(90)+e.range(-80,80),-2050,e.range(78,100),1500,e.range(26,40),60,14,9,430],[Ve(90)+e.range(380,470),-720,e.range(150,172),900,e.range(36,52),50,18,8,350],[Ve(90)-e.range(360,440),-640,e.range(8,30),820,e.range(28,40),44,14,8,310],[Ve(150)+e.range(-60,60),-1560,e.range(48,70),1100,e.range(78,100),80,24,10,310]];let o=0;for(const w of t)o+=Math.round(w[8]*(.6+.4*ge));const a=new Float32Array(o*4),h=new Float32Array(o*4),n=new Float32Array(o*4);let i=0;for(const w of t){const g=Math.round(w[8]*(.6+.4*ge)),M=e.range(0,6.28),y=e.range(13,16)*(e()<.5?-1:1);for(let u=0;u<g;u++,i++){const c=Math.floor(e()*9)/9+.03*Math.sin(i),x=((c+e.gauss()*.05+e()*e()*.4)%1+1)%1;a[i*4]=w[0],a[i*4+1]=w[1],a[i*4+2]=w[2]*Math.PI/180,a[i*4+3]=w[3],h[i*4]=x*w[3],h[i*4+1]=e.gauss()*w[7],h[i*4+2]=w[4]+e.gauss()*w[7]*(.5+1.1*e()*e()),h[i*4+3]=y*e.range(.92,1.08),n[i*4]=M,n[i*4+1]=w[5],n[i*4+2]=w[6],n[i*4+3]=e()}await z.yield()}const l=new s.BufferGeometry;l.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),l.setIndex([0,1,2,0,2,3]);const v=new s.InstancedBufferGeometry;v.index=l.index,v.setAttribute("position",l.attributes.position),v.setAttribute("iA",new s.InstancedBufferAttribute(a,4)),v.setAttribute("iB",new s.InstancedBufferAttribute(h,4)),v.setAttribute("iC",new s.InstancedBufferAttribute(n,4)),v.instanceCount=o,Rt=new s.Mesh(v,Pa(O0,N0,{uCam:D.uCam,uPix:{value:.0027},uPink:{value:X(Ka[2]).multiplyScalar(.95)},uDark:{value:X("#3a1420")}},{side:s.DoubleSide})),Rt.frustumCulled=!1,Rt.matrixAutoUpdate=!1,Rt.name="ribbons",xe.add(Rt)}await z.yield();const Lt=46,ct={...Ee,uCam:D.uCam,uPix:{value:.0027},uRipple:D.uRipple,uFrontP:D.uFrontP,uWall:{value:new s.Vector4(0,0,0,Lt)},uWall2:{value:new s.Vector2(0,1)},uPink:{value:X(Ka[2]).multiplyScalar(.84)},uScarlet:{value:X(qt[3]).multiplyScalar(.88)},uDeep:D.uDeep,uField:D.uField,uFieldRect:D.uFieldRect,uSaltBias:D.uSaltBias,uCause:D.uCause,uRoute:D.uRoute,uGrp:D.uGrp,uStream:{value:new s.Vector4(0,3.1,0,1)}};{const e=Ks,t=Math.round(3600*(.6+.4*ge)),o=new Float32Array(t*4),a=[];for(let v=0;v<44;v++)a.push([(e()+e()-1)*50,e()*Lt,1.5+21*Math.pow(e(),2.4),3+4*e()]);for(let v=0;v<t;v++){let w,g,M;if(v<t*.64){const y=a[v%44];w=y[0]+e.gauss()*y[3],g=((y[1]+e.gauss()*5)%Lt+Lt)%Lt,M=y[2]*(.45+.8*e())}else w=(e()+e()-1)*54,g=e()*Lt,M=1.2+20*Math.pow(e(),3.5);Math.abs(w)<1.5&&(w=w<0?-1.5:1.5),o[v*4]=g,o[v*4+1]=w,o[v*4+2]=M,o[v*4+3]=e(),(v&1023)===1023&&await z.yield()}const h=new s.BufferGeometry;h.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),h.setIndex([0,1,2,0,2,3]);const n=new s.InstancedBufferGeometry;n.index=h.index,n.setAttribute("position",h.attributes.position),n.setAttribute("iW",new s.InstancedBufferAttribute(o,4)),n.instanceCount=t;const i=new s.Mesh(n,new s.ShaderMaterial({vertexShader:Rs,fragmentShader:Ls,fog:!0,side:s.DoubleSide,uniforms:{...q.fogUniforms(),...ct}})),l=new s.Mesh(n,new s.ShaderMaterial({vertexShader:Rs,fragmentShader:Ls,fog:!0,side:s.DoubleSide,defines:{MIRROR:1},uniforms:{...q.fogUniforms(),...ct},transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}));i.frustumCulled=l.frustumCulled=!1,i.matrixAutoUpdate=l.matrixAutoUpdate=!1,l.renderOrder=1,i.name="wave-body",l.name="wave-mirror",xe.add(i,l)}await z.yield();const Jo={...q.fogUniforms(),uCam:D.uCam,uPix:ct.uPix,uFrontP:D.uFrontP,uWall:ct.uWall,uCrown:{value:new s.Vector4(0,48,0,0)},uCol:{value:St.clone().multiply(de.clone().multiplyScalar(.9).add(ue.clone().multiplyScalar(.75))).multiplyScalar(.3183*1.2)},uField:D.uField,uFieldRect:D.uFieldRect,uSaltBias:D.uSaltBias,uCause:D.uCause,uRoute:D.uRoute,uGrp:D.uGrp};{const e=z.core.makeRng((z.seed>>>0^85723703)>>>0),t=640,o=new Float32Array(t*4),a=[];for(let l=0;l<14;l++)a.push([(e()+e()-1)*27,e()*48,1.2+2.6*e()]);for(let l=0;l<t;l++){let v,w;if(l<t*.66){const g=a[l%14];v=g[0]+e.gauss()*g[2],w=((g[1]+e.gauss()*6)%48+48)%48}else v=(e()+e()-1)*34,w=e()*48;o[l*4]=w,o[l*4+1]=v,o[l*4+2]=e(),o[l*4+3]=.9+.8*e()}const h=new s.BufferGeometry;h.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),h.setIndex([0,1,2,0,2,3]);const n=new s.InstancedBufferGeometry;n.index=h.index,n.setAttribute("position",h.attributes.position),n.setAttribute("iK",new s.InstancedBufferAttribute(o,4)),n.instanceCount=t;const i=new s.Mesh(n,new s.ShaderMaterial({vertexShader:U0,fragmentShader:K0,fog:!0,side:s.DoubleSide,transparent:!0,depthWrite:!1,uniforms:Jo}));i.frustumCulled=!1,i.matrixAutoUpdate=!1,i.renderOrder=2,i.name="wave-crowns",xe.add(i)}await z.yield();let Kt=null;if(Ge==="december"){const e=L.fork("creche"),t=Math.round(1700*(.6+.4*ge))+9,o=new Float32Array(t*4),a=new Float32Array(t*4);V.tangentAtDist(240,b);const h=b.x*.8+b.z*.6,n=b.z*.8-b.x*.6;for(let l=0;l<t;l++){const v=l>=t-9,w=(v?e.range(-1,1):e.gauss()*.45)*30,g=(v?(e()<.5?-1:1)*e.range(11,15):e.gauss()*6.5)*(1-.4*Math.abs(w)/30);o[l*4]=Sa.x+h*w-n*g,o[l*4+1]=Sa.z+n*w+h*g,o[l*4+2]=e(),o[l*4+3]=v?e.range(1.15,1.3):e.range(.5,.74),a[l*4]=e(),a[l*4+1]=v?1:0}const i=new s.BufferGeometry;i.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]),Kt=new s.Mesh(go(i,t,o,a),Pa(I0,G0,{uCam:D.uCam,uDrift:{value:new s.Vector2(h*.42,n*.42)},uPix:{value:.0027},uPink:{value:bt.clone().multiplyScalar(.82)}},{side:s.DoubleSide})),Kt.frustumCulled=!1,Kt.matrixAutoUpdate=!1,xe.add(Kt)}await z.yield();const o0={sunDir:U,sunColor:X(O.sun),sunIntensity:O.sunI,sky:X(O.fill),skyIntensity:O.fillI,ground:Mt.clone(),groundIntensity:1},qa=Ua.makeFauna(xe,{light:o0});await z.yield();const yo=L()<.75?-1:1;qa.add(Ua.makeFlock({rng:L.fork("skein"),species:"flamingos",count:L.int(18,26),size:1.25,cross:{path:V,u:.022,lead:36,angle:80,side:yo,height:5+.35+1.1+(yo>0?.45:0),span:380,duration:Pe}}),{always:!0}),await z.yield();const ia=Math.round(Ne(7,15,Ie((dt-.7)/.6*.6+L()*.4,0,1))),xo=-yo,s0=L.int(1,1e9),es=Xo("pelican",ia);await z.yield();const ts=.16,n0=16,r0=17,as=Ie(28/Math.max(ia-1,1),2.2,3.6),i0=(ia-1)/2*as,os=42*Math.PI/180,Ta=30,bo=new s.Vector3,_a=new s.Vector3,la=new s.Vector3,ha=[],So=e=>os/(1+e/Ta*(e/Ta));{const e=[],t=[];let o=0,a=0;for(let n=0;n<=90;n++){e.push([o,a]);const i=So(n+.5);o+=Math.cos(i),a+=Math.sin(i)}o=0,a=0;for(let n=0;n<=90;n++){t.push([o,a]);const i=So(-(n+.5));o-=Math.cos(i),a-=Math.sin(i)}for(let n=90;n>=1;n--)ha.push(t[n]);for(let n=0;n<=90;n++)ha.push(e[n]);const h=ts*G+n0-ha[Math.round(90-i0)][0];V.posAtDist(h,bo),V.tangentAtDist(h,b),b.y=0,b.normalize(),_a.copy(b),la.set(-b.z,0,b.x).multiplyScalar(xo),bo.addScaledVector(la,1)}const Ia=s0%628/100;let Vt=0;const l0=(e,t,o,a)=>{Vt=Ie(r0*(o-ts)*Pe-(e-(ia-1)/2)*as+.5*Math.sin(t*.31+e*1.9),-89.9,89.9);const h=Math.floor(Vt+90),n=Vt+90-h,i=ha[h],l=ha[h+1];return a.copy(bo).addScaledVector(_a,Ne(i[0],l[0],n)).addScaledVector(la,Ne(i[1],l[1],n)+.45*Math.sin(t*.43+e*2.3+Ia)),a.y=2.3+.3*Math.sin(Vt*.05+Ia)+.18*Math.sin(t*.6+e*1.3),a},h0=(e,t)=>{const o=p(.002,.03,t)*(1-p(.265,.285,t));for(let a=0;a<ia;a++){l0(a,e,t,B);const h=Vt/Ta,n=So(Vt),i=-os*2*h/Ta/((1+h*h)*(1+h*h)),l=_a.x*Math.cos(n)+la.x*Math.sin(n),v=_a.z*Math.cos(n)+la.z*Math.sin(n),w=p(.1,.7,Math.sin(e*.95-a*.62+Ia)),g=e*7.6-a*.5;es.set(a,B.x,o>.01?B.y+.07*w*Math.sin(g-1.4):-60,B.z,g,Math.atan2(l,v)+.03*Math.sin(e*.5+a),.05,Ie(i*30,-.6,.6)*xo+.05*Math.sin(e*.43+a*2.3+Ia),o,.2+.32*w,0)}es.commit()},c0={species:"eagles",body:"#5c3420",belly:"#6c3c22",wingC:"#2c2523",trail:"#1e1a19",tip:"#141212",head:"#f4efe6",tailC:"#f4efe6",beak:"#f0c030"},ss=Oe(Z+L.range(180,330),-L.range(70,130)),u0=L.range(42,60),d0=L.fork("eagle");ae||qa.add(Ua.makeFlock({...c0,rng:d0,count:1,size:2.1,center:[ss.x,u0,ss.z],radius:60,soarRadius:34}),{always:!0}),await z.yield();let zo=null;if(ae){const e=Xo("eagle",1),t=.62,o=[-7,-4,-2.2,-1.5,0,1.5,2.4,3.6],a=[150,85,46,32,11.5,8.6,7.2,3],h=[-95,-58,-31,-18.5,0,8.6,15,26],n=[52,36,19,12.5,-2.6,-3.4,-3.3,-2.4],i=(y,u)=>{if(y<=o[0])return u[0];if(y>=o[7])return u[7];let c=0;for(;y>o[c+1];)c++;const x=o[c+1]-o[c],m=(y-o[c])/x,d=c>0?(u[c+1]-u[c-1])/(o[c+1]-o[c-1]):(u[1]-u[0])/x,C=c<6?(u[c+2]-u[c])/(o[c+2]-o[c]):(u[7]-u[6])/x,k=m*m,R=k*m;return(2*R-3*k+1)*u[c]+(R-2*k+m)*x*d+(-2*R+3*k)*u[c+1]+(R-k)*x*C},l=(y,u)=>{const c=(y-t)*Pe,x=y*G,m=i(c,a);V.posAtDist(x,be);const d=be.y;V.posAtDist(x+m,u),V.tangentAtDist(x+m,b);const C=Math.hypot(b.x,b.z)||1,k=i(c,h);return u.x+=-b.z/C*k,u.z+=b.x/C*k,u.y=Math.max(d+i(c,n),1.6),u},v=new s.Vector3,w=new s.Vector3,g=new s.Vector3;zo=(y,u)=>{const c=(u-t)*Pe,x=p(-7,-6,c)*(1-p(3,3.6,c));l(u-.002,v),l(u+.002,w),g.subVectors(w,v),g.y<0&&(g.y*=2.2),g.normalize(),l(u,v);const m=p(-4.4,-2.6,c)*(1-p(.1,1.5,c)),d=p(.9,2,c),C=p(-2.6,-1,c)*(1-p(.1,1.3,c)),k=p(-2.6,-1,c)*(1-p(.05,1,c));{const T=Math.hypot(b.x,b.z)||1,te=b.x/T,f=b.z/T,E=.8*k;g.multiplyScalar(1-E),g.x+=E*(.35*te-.55*f),g.y+=E*-.76,g.z+=E*(.35*f+.55*te)}g.y=Ie(g.y,-.8,.3),g.normalize();const R=Math.atan2(g.x,g.z),K=Math.asin(Ie(g.y,-1,1)),j=1.85*C;e.set(0,v.x,x>.01?v.y:-60,v.z,y*13.5,R,K,j+.06*Math.sin(y*.9),1.4*x,.07+.45*d,.2*m*(1-C)),e.commit()},await z.yield();const M=.6*G-Z;Te.uniforms.uLane.value.set(M,M+70,7,14)}const ca=[];{const e=lt.fork("escorts");let t=0,o=0;const a=e()<.5?-1:1;for(let d=0;d<Ft+8;d++){const C=d%9,k=C===0||C===2||C===4||C===6||C===7,R=C===3||C===8,K=C===8,j=k?(t++*3%5<2?-1:1)*a:e()<.5?-1:1;let T=k?e.range(1,2.7):R?e.range(6.2,8.5):e.range(4.4,6),te=k?e.range(.6,2.2):R?e.range(-1.6,.8):e.range(0,2);const f=d>=Ft,E=(f?.868+(d-Ft+.5)/8*.066:Do+(d+.5)/Ft*(.868-Do))+e.range(-.006,.006);f&&(T=e.range(1.7,3.6),te=e.range(1.8,3.2));const _={uc:E,lat:(f?d%2?1:-1:j)*T,up:te+(K?.3:0),size:K?e.range(1.3,1.4):e.range(.95,1.05),ph:e.range(0,6.28)};f&&(d-Ft===2||d-Ft===5)&&(_.lat=(d%2?1:-1)*e.range(.8,1.4),_.up=e.range(2.6,3.2)),!f&&k&&E>.64&&E<.725&&o<4&&(_.a0=4.6+.5*(o%2),_.lat=-(1.5+.55*o),_.up=[.5,1,.7,1.2][o],o++),ca.push(_)}const h=ae?.701:.62,n=[[3.7,-2.3,-1.5],[4.5,.5,-1.62],[5.3,2.7,-1.45],[6.6,-3.7,-1.3],[7.6,1.3,-1.5],[9.2,-1.6,-1.25],[10.8,3.8,-1.2],[12.8,-.3,-1.05],[15.5,2.2,-.9]],i=10,l=d=>Math.hypot(Math.max(Math.abs(d.a0)-d.slow*d.hang,0),Math.hypot(d.lat,sa*p(0,oa,-d.up)),d.up),v=(d,C)=>{const k=d.filter(R=>l(R)>=i).sort((R,K)=>l(K)-l(R)).slice(0,C);for(const R of d)R.size=k.includes(R)?e.range(1.3,1.38):e.range(.95,1.05),R.ph=e.range(0,6.28),ca.push(R)},w=[],g=[];for(let d=0;d<9;d++)w.push({uc:h+d*8e-4,a0:n[d][0],lat:n[d][1],up:n[d][2],vlat:.9,slow:2.2,hang:1.35,low:!0});v(w,2);for(let d=0;d<7;d++)g.push({uc:.79+d*.002,a0:5.4+2.3*d,lat:2+.45*d,up:-2-.1*d+.15*Math.sin(d*1.7),slow:2.2,hang:1.6,low:!0});v(g,2);for(let d=0;d<6;d++)ca.push({uc:.868+d*.014+(d>2?.006:0),a0:7.6+d%3*2,lat:(d%2?1:-1)*(1.7+.9*(d%3)),up:-1.85-.2*(d%3),slow:1.6,hang:2,low:!0,size:d===5?e.range(1.3,1.38):e.range(.95,1.05),ph:e.range(0,6.28)});const M=Vs,y=.62*G,u=.76*G,c=8,x=Math.floor(Oo/c),m=Math.cos(25*Math.PI/180);for(let d=0,C=0;d<x;d++){const k=Ne(y,u,d/Math.max(x-1,1));for(let R=0;R<c;R++){const K=Ie(k+M.range(-4.5,4.5),y,u),j=Aa(K);let T=0,te=0,f=0;for(let Q=0;Q<24;Q++){const W=M.range(5.5,11.5),re=M.range(-1,1)*m,ee=W*Math.sqrt(Math.max(1-re*re,0)),he=M.range(0,6.2832);if(T=W*re,te=ee*Math.cos(he),f=ee*Math.sin(he),!(j+f<1.6)&&!(f>-oa&&f<1.24&&Math.abs(te)<sa)&&Math.hypot(T,Math.hypot(te,sa*p(0,oa,-f)),f)<=11.5)break}f=Math.max(f,1.6-j);const E={uc:K/G,a0:T,lat:te,up:f,slow:1.3,hang:1.5,low:f<-1},_=C<3&&l(E)>=i&&M()<.3;_&&C++,E.size=_?M.range(1.3,1.38):M.range(.98,1.08),E.ph=M.range(0,6.28),ca.push(E)}}}const Mo=e=>Ne(1.12,.84,p(.27,.42,e))-.1*p(.54,.6,e)*(1-p(.82,.89,e))+.16*p(.88,.95,e);let ns=0;for(let e=0;e<64;e++)ns+=1/Mo((e+.5)/64)/64;const ko=[];{const e=lt.fork("wall-escorts"),t=new s.Vector3,o=new s.Vector3,a=new s.Vector3,h=new s.Vector3,n=(i,l,v)=>{const w=i*G;V.posAtDist(w,t),V.posAtDist(w+30,o),o.sub(t).normalize(),a.set(-o.z,0,o.x).normalize(),h.crossVectors(a,o);const g=Pe/(Mo(i)*ns);for(const[M,y,u]of v){const c=M>=17?e.range(1.3,1.4):e.range(.96,1.08),x=(typeof l=="function"?l(y):l)+e.range(-4,4),m=x*Math.PI/180,d=t.x+o.x*M+a.x*M*y*1.068+h.x*M*u*.6,C=t.z+o.z*M+a.z*M*y*1.068+h.z*M*u*.6,k=Math.max(t.y+o.y*M+h.y*M*u*.6,.62*c+.35);ko.push({uk:i,x:d,y:k,z:C,vx:Math.sin(m)*15*g,vz:-Math.cos(m)*15*g,yaw:Math.PI-m,size:c,ph:e.range(0,6.28),rate:c>1.2?.82:e.range(.98,1.1)})}};n(.7,24,[[3.9,-.62,.3],[4.6,.1,-.42],[5.2,.78,.5,1],[5.6,-.25,.62],[6.2,-.86,-.25,1],[6.4,.42,-.5],[7.5,-.45,-.1],[8.2,.6,-.2],[8.8,-.05,.28,1],[9.5,.9,.12],[10.5,-.72,.42],[11,.25,.6],[12,-.3,-.22],[13,.72,-.12],[7,.16,.12],[7.8,-.9,.16,1],[9.2,-.4,.5],[10,.5,.36],[10.8,.05,-.3],[11.6,-.62,-.26],[12.6,.94,.4],[15,-.55,.12],[17,.05,.05],[19,-.15,.3],[21,.5,.33]]),n(.79,-4,[[3.8,.36,.44,1],[4.4,-.2,-.45],[5,-.7,.42],[5.6,.1,.66],[6,.88,-.32,1],[6.6,-.5,.14],[7.6,.35,-.12],[8.4,-.05,.3,1],[9,.6,0],[9.8,-.88,-.18],[10.5,.12,-.3],[11.5,.46,.56],[12.5,-.3,.52],[13.5,.95,.5],[5.6,-.56,-.42],[7.2,-.82,.2,1],[8,-.32,-.26],[9.4,.2,.14],[10.2,-.6,.36],[11,-.72,-.15],[12,.74,-.14],[15,.3,.2],[17,-.15,.12],[19,.52,.06],[22,.05,.3]]),n(.84,i=>i<0?2:20,[[4,.3,.42,1],[4.8,-.15,-.5],[5.5,.75,-.2],[6.2,-.8,.45],[7,.1,.2,1],[7.8,.55,.5],[8.6,-.2,-.28],[9.5,.88,.15],[10.5,.4,-.25],[11.5,-.9,-.12],[12.5,0,.5],[13.5,.66,-.05]]),n(.87,i=>i<0?-6:15,[[4.2,.45,.4,1],[5,-.82,.35],[5.6,.85,-.3],[6.5,.15,-.5,1],[7.5,.6,.05],[8.5,-.7,-.2],[9.5,.3,.58],[11,.9,.3],[12,-.62,.5],[14,.4,-.15]])}const rs=[];{const e=Ws,t=[3.19,1.08,-.05,2.06];for(let o=0;o<ka;o++){const a=o%2===0,h=t[o%4]+e.range(-.3,.3),n=e.range(4.8,9.2);let i=e.range(4.2,9.4),l=i*Math.cos(h),v=a?-e.range(.4,2.3):Math.min(i*Math.sin(h),.5*n);l=Math.sign(l||1)*Ie(Math.abs(l),2.2,.9*n);const w=Math.hypot(n,l,v);w>12&&(l*=12/w,v*=12/w),rs.push({uc:.622+(o+.5)/ka*.288+e.range(-.003,.003),a0:n*Math.min(1,12/w),lat:l,up:v,low:a,hang:e.range(1.5,2.1),slow:e.range(1.2,2),size:e.range(.97,1.07),ph:e.range(0,6.28)})}}const f0=.09*(G-15*Pe),m0=3.4,p0=4.2,v0=2.4,w0=-xo,is=lt.range(0,6.28),g0=(e,t)=>{const o=Ra(t);for(let a=0;a<ta;a++){const h=ca[a];Ca(h,e,t,qe);const n=qe.w,i=n>-6&&n<78;Te.escorts.set(a,qe.x,i?qe.y:-60,qe.z,Math.atan2(b.x,b.z)+(h.vlat?-.085:0)+.04*Math.sin(e*.6+h.ph+1.57),.03,h.size*(1-p(62,78,n)),h.size>1.2?.8:1.08)}for(let a=0,h=Math.min(Ma,ko.length);a<h;a++){const n=Wo[a];if(n&&t<n.gone){const m=(o-n.s)/Ya,d=n.size,C=n.size>1.2?.8:1.08;if(m<=0){const ee=$o(Math.max(m+1.4,0)),he=p(-2.2,-1.5,m),oe=p(0,.5,ee);Te.escorts.set(ta+a,n.gx+n.fx*ee,Ne(.5,.45,oe)*n.size,n.gz+n.fz*ee,n.rest+jo(n.yawF-n.rest)*he,Ne(.14,-.04,oe),d,C,m,n.beh,ee);continue}Ca(n,e,t,qe);const k=qe.w,R=$o(m+1.4),K=p(0,t0,m),j=p(0,n.rise*Pe,m),T=Math.atan2(b.x,b.z);let te=Ne(n.gx+n.fx*R,qe.x,K),f=Ne(.45*n.size,qe.y,j),E=Ne(n.gz+n.fz*R,qe.z,K);const _=te-Ue.x,Q=f-Ue.y,W=E-Ue.z,re=Math.hypot(_,Q,W);if(re<2.6){const ee=(2.6-re)/Math.max(re,.05);te+=_*ee,f+=re<.05?2.6:Q*ee,E+=W*ee}Te.escorts.set(ta+a,te,k>-6||K<1?f:-60,E,n.yawF+jo(T-n.yawF)*K+.04*Math.sin(e*.6+n.ph+1.57)*K,.03+(n.climb?.09:0)+.9*j*(1-j),d,C,Math.min(m,5),1,60);continue}const i=ko[a],l=t-i.uk,v=l>-.15&&l<.035;let w=i.x+i.vx*l+.3*Math.sin(e*.5+i.ph),g=i.y+.22*Math.sin(e*.8+i.ph*2.3),M=i.z+i.vz*l+.3*Math.cos(e*.43+i.ph*1.7);const y=w-Ue.x,u=g-Ue.y,c=M-Ue.z,x=Math.hypot(y,u,c);if(x<2.6){const m=(2.6-x)/Math.max(x,.05);w+=y*m,g+=x<.05?2.6:u*m,M+=c*m}Te.escorts.set(ta+a,w,v?Math.max(g,.9):-60,M,i.yaw+.04*Math.sin(e*.6+i.ph),.03,i.size*p(-.15,-.125,l),i.rate)}for(let a=0;a<Ja;a++){const h=f0+a*m0+(a>6?3.5:0)+15*Pe*t+.6*Math.sin(e*.5+a*1.7);V.posAtDist(Math.min(h,G),qe),V.tangentAtDist(Math.min(h,G),b);const n=Math.hypot(b.x,b.z)||1,i=w0*(p0+.5*Math.sin(a*2.1+is)+.35*Math.sin(e*.45+a*1.3)),l=1-p(.2,.24,t);Te.escorts.set(Xa+a,qe.x-b.z/n*i,l>.01?Math.max(qe.y-v0,2.2)+.45*Math.sin(a*1.3+is)+.2*Math.sin(e*.7+a*2.2):-60,qe.z+b.x/n*i,Math.atan2(b.x,b.z)+.03*Math.sin(e*.5+a),.02,(.92+.12*(a*7%5)/4)*l,1.02)}for(let a=0;a<ka;a++){const h=rs[a];Ca(h,e,t,qe);const n=qe.w,i=n>-6&&n<78;let l=qe.x,v=qe.y,w=qe.z;const g=l-Ue.x,M=v-Ue.y,y=w-Ue.z,u=Math.hypot(g,M,y);if(u<3.2){const c=(3.2-u)/Math.max(u,.05);l+=g*c,v+=u<.05?3.2:M*c,w+=y*c}Te.escorts.set(Xa+Ja+a,l,i?Math.max(v,1.3):-60,w,Math.atan2(b.x,b.z)+.04*Math.sin(e*.6+h.ph+1.57),.03,h.size*(1-p(62,78,n)),1.08)}Te.escorts.commit()};await z.yield();const ua=[];{const e=[],t=L.fork("marabou");for(let o=0;o<3;o++){const a=t.range(-1,1)*.4,h=t.range(-.5,.5)*.6;Oe(At+[9.6,11.6,13][o]+a*.3,Lo*([3.5,5.2,4][o]+h*.15),B),e.push([B.x,0,B.z]),ua.push(B.x,B.z)}for(let o=0,a=60;o<3&&a>0;a--)Oe(Z+t.range(60,170),-t.range(47,56),B),Za(B.x,B.z,.05)&&(e.push([B.x,0,B.z]),o++);qa.add(Ua.makeWaders({rng:t,species:"stork",positions:e,count:e.length,level:0,depth:0,size:1.95,oneLeg:.2,active:.35,peckRate:.25,body:"#454a54",wing:"#26282e",belly:"#e6e2d8",neckC:"#d9aea4",cap:"#cdb2aa",beakC:"#b7a88c",legC:"#d2ccc0"}),{always:!0})}await z.yield(),xe.userData.natron.marabou=ua;for(let e=0;e<3&&e*2+1<ua.length;e++)D.uMar.value[e].set(ua[e*2],ua[e*2+1],2.24,0);const Ht=q.fxGroup();xe.add(Ht.object);const vt=ye==="moon";Ht.add(q.makeParticles({rng:L.fork("dust"),preset:"dust",time:Ee.uTime,count:Math.round(1100*ge),box:[64,24,64],size:[.025,.07],colors:vt?["#9aa6d8","#c6ccf0","#8088b8"]:["#efe2d6","#eed2d4","#e6dfd4"],intensity:vt?.5:.6,opacity:vt?.5:.32,additive:vt?.5:0,twinkle:vt?.5:.15,velocity:[.5,.05,-.2]})),await z.yield();const ls=Ht.add(q.makeParticles({rng:L.fork("down"),preset:"petals",time:Ee.uTime,count:Math.round(340*ge),box:[54,22,54],size:[.05,.12],colors:["#f6c9d2","#f2eee6","#f3a0b4"],velocity:[.6,-.35,-.3],lightDir:[U.x,U.y,U.z],intensity:vt?.45:.9}));ls.setOpacity(0),await z.yield(),Ht.add(q.makeMist({rng:L.fork("seep"),time:Ee.uTime,positions:[[Ze.x,1.1,Ze.z],[Ze.x+4,1.6,Ze.z-5],[Ze.x-5,1.3,Ze.z+3]],size:[5,9],color:X("#eef0ee").multiply(de).multiplyScalar(.3),opacity:.16,drift:[.5,0,.2]})),await z.yield();const y0=[];if(ye==="noon")for(const[e,t]of[[L.range(330,420),L.range(95,130)],[L.range(640,760),L.range(150,210)]])Oe(e,t,B),y0.push(Ht.add(q.makeDustDevil({rng:L.fork("devil"+e),time:Ee.uTime,position:[B.x,0,B.z],height:L.range(38,56),radius:[1,8.5],wander:5,color:"#e6dfd2",colorTop:"#f1ece2",shadowColor:"#a79c90",opacity:.36,sunDir:[U.x,U.y,U.z]}))),await z.yield();const Ao=V.posAtDist(G,new s.Vector3),hs=V.tangentAtDist(G,new s.Vector3),da=new s.Mesh(new s.PlaneGeometry(19,19),new s.ShaderMaterial({transparent:!0,depthWrite:!1,depthTest:!1,blending:s.AdditiveBlending,uniforms:{uCol:{value:X(O.portal)},uTime:Ee.uTime,uAmt:{value:vt?.5:.62}},vertexShader:"varying vec2 vL; varying float vY; void main(){ vL = position.xy; vec4 w = modelMatrix*vec4(position, 1.); vY = w.y; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:`uniform vec3 uCol; uniform float uTime, uAmt; varying vec2 vL; varying float vY;
      void main(){
        vec2 p = vL; p.x += (sin(p.y*1.9 + uTime*2.1)*0.16 + sin(p.y*4.3 - uTime*3.)*0.07)*(1. + max(-vY, 0.)*0.12);
        float r = length(p);
        float ring = smoothstep(6.1, 6.9, r)*(1. - smoothstep(7.2, 8.4, r));
        float a = (ring*1.3 + 0.16*(1. - smoothstep(2., 6.6, r)))*(1. - smoothstep(-0.5, 0.05, vY))*(1. - smoothstep(8.5, 14.5, -vY));
        gl_FragColor = vec4(uCol*a*uAmt, 1.);
      }`}));da.position.set(Ao.x,-Ao.y,Ao.z),da.rotation.y=Math.atan2(-hs.x,-hs.z),da.renderOrder=3,da.frustumCulled=!1,xe.add(da);const cs=new s.Vector2,Ue=new s.Vector3,Fo=1/Math.max(Math.tan(ne),.03),x0=.0047/Math.max(Math.sin(ne),.06);await z.yield();{const n=Te.uniforms,i=n.uVF.value,l=n.uLane.value,v=n.uOver.value,w=n.uMarchW.value,g=(r,F,S)=>{const A=Math.min(1,Math.max(0,(S-r)/(F-r)));return A*A*(3-2*A)},M=r=>{const F=Math.min(r,2.1);return .5*7.143*F*F+15*Math.max(r-2.1,0)},y=(r,F)=>{const S=1.3+r*.09,A=Math.min(1,Math.max(0,F/S));return r*A*A*(3-2*A)},u=Math.floor(G/.05)+2,c=new Float64Array(u),x=new Float64Array(u),m=new Float64Array(u),d=new Float64Array(u),C=new Float64Array(u),k=new Float64Array(u),R=new Float64Array(u);for(let r=0;r<u;r++){const F=Math.min(r*.05,G);V.posAtDist(F,be),V.tangentAtDist(F,b);const S=Math.hypot(b.x,b.z)||1;c[r]=be.x,x[r]=be.y,m[r]=be.z,d[r]=b.x/S,C[r]=b.z/S,k[r]=F-Z+ea(F-Z,F/G),R[r]=be.y+mo,(r&511)===511&&await z.yield()}let K=0;for(let r=1;r<u-1;r++){const F=(k[r]-k[r-1])/.05;F>K&&(K=F)}let j=0,T=0,te=0,f=0,E=0,_=0,Q=0,W=0,re=0,ee=0,he=0,oe=0;const Me=r=>{const F=Math.min(Math.max(r,0),G)/.05,S=Math.min(Math.floor(F),u-2),A=F-S,P=S+1;j=S,T=A,te=c[S]+(c[P]-c[S])*A,f=x[S]+(x[P]-x[S])*A,E=m[S]+(m[P]-m[S])*A,_=k[S]+(k[P]-k[S])*A,Q=R[S]+(R[P]-R[S])*A},fe=r=>{if(k[0]>=r)return 0;if(k[u-1]<r)return 1/0;let F=0,S=u-1;for(;S-F>1;){const A=F+S>>1;k[A]>=r?S=A:F=A}return Math.min(G,(F+(r-k[F])/(k[S]-k[F]))*.05)},Ae=r=>fe(r.s+i*(r.jit-.5*r.over)),Se=(r,F,S)=>g(8.5,9.5,F)*(r.s>=v.x?1:0)*(r.s<=v.y?1:0)*(Math.abs(S)<=13.5?1:0),He=(r,F,S)=>{const A=F*4,P=r.iPos.array[A+2],Re=r.iA.array[A+3],ie=r.iB.array[A+1],J={s:r.iA.array[A],seed:r.iA.array[A+1],cz:r.iA.array[A+2],lat:Re,size:ie,jit:r.iB.array[A+2],Gx:r.iPos.array[A],Gz:r.iPos.array[A+1],f0x:Math.sin(P),f0z:Math.cos(P),k:r.iPos.array[A+3],march:r.iC.array[A+2]>.5,mcx:r.iC.array[A],mcz:r.iC.array[A+1],mr:r.iC.array[A+2],ma:r.iC.array[A+3],sg:Re>=0?1:-1,reach:(S?1.1:.8)*ie,low:0,over:0};return J.r0x=-J.f0z,J.r0z=J.f0x,J.low=1-g(2,2.6,J.cz),J.over=Se(J,J.cz,Re),J},Ye=(r,F)=>{const S={...r};return S.cz=r.cz+F,S.low=1-g(2,2.6,S.cz),S.over=Se(r,S.cz,r.lat),S},se=(r,F)=>{const S={...r},A=r.r0x*r.sg*F,P=r.r0z*r.sg*F;return S.Gx=r.Gx+A,S.Gz=r.Gz+P,S.mcx=r.mcx+A,S.mcz=r.mcz+P,S.lat=r.lat+r.sg*F,S.over=Se(r,r.cz,S.lat),S},le=r=>{oe++;const F=(_-r.s)/i-r.jit+.5*r.over;let S=r.Gx,A=r.Gz;if(r.march){const ut=Math.min(_/i,r.s/i+r.jit-2.3),Oa=r.ma+w*ut;S=r.mcx+r.mr*Math.cos(Oa),A=r.mcz+r.mr*Math.sin(Oa)}const P=M(Math.max(F+1.4,0)),Re=g(0,.5,P),ie=g(0,.6,F),J=g(l.x,l.y,r.s+P),Be=l.z*(1-r.over),ke=(Be+(l.w-Be)*J)*(1-r.low),ve=.07*Math.max(P-7,0)+.5*ie,wt=1.6*J*ie,je=r.sg,at=r.lat,ma=at-ve-at+je*Math.max(ke-je*(at-ve),0)*wt,Ga=at+ve-at+je*Math.max(ke-je*(at+ve),0)*wt,Da=je*ke;let pa=ma,va=ma;if(Ga<pa&&(pa=Ga),Ga>va&&(va=Ga),Da>at-ve&&Da<at+ve){const ut=Da-at+je*Math.max(ke-je*Da,0)*wt;ut<pa&&(pa=ut),ut>va&&(va=ut)}const us=.5*r.k*P*P,ds=(.5-.05*Re)*r.size;let wa,ga;if(r.over>0){const ut=r.cz+(Q-r.cz)*r.over,Oa=r.cz+(Q+po-r.cz)*r.over;wa=1/0,ga=-1/0;for(let Co=0;Co<=4;Co++){const Na=y(ut+(Oa-ut)*Co/4,F);Na<wa&&(wa=Na),Na>ga&&(ga=Na)}}else wa=ga=y(r.cz,F);const fs=.3*g(.3,2.2,F)+.035*ie,ms=us+pa,ps=us+va,vs=ds+wa-fs,ws=ds+ga+fs,gs=te-S,ys=E-A,S0=gs*r.f0x+ys*r.f0z,Ba=gs*r.r0x+ys*r.r0z,xs=S0-P,bs=Ba<ms?ms-Ba:Ba>ps?Ba-ps:0,Ss=f<vs?vs-f:f>ws?f-ws:0;W=Math.sqrt(xs*xs+bs*bs+Ss*Ss)-r.reach,re=F,ee=P,he=ve},Y=K/i,we=7.143*2.1,Fe=1.5*15/(l.y-l.x),me=(r,F=5)=>{let S=Ae(r);if(!(S<G))return!1;const A=r.over>0?Math.max(r.cz,20):r.cz,P=Math.min(16.7,A*1.5/(1.3+.09*A))+.3,Re=Math.abs(r.k);for(;;){if(Me(S),le(r),W<F)return!0;if(S>=G)return!1;const ie=re<.7?2.5:0,J=r.s+ee+40>l.x?3.2+(l.w+he+1)*1.6*(Fe+ie):0,Be=Re*(ee+3)*15+.07*15+1.25+J;let ke=(W-F)/(1+.06+Y*Math.sqrt(225+Be*Be+P*P));if(ke<.01)ke=.01;else if(ke>2){const ve=ee+we*Y*ke,wt=r.s+ve+40>l.x?3.2+(l.w+.07*Math.max(ve-7,0)+.5+1)*1.6*(Fe+ie):0,je=Re*(ve+3)*15+.07*15+1.25+wt,at=(W-F)/(1+.06+Y*Math.sqrt(225+je*je+P*P))-2;for(let ma=2;ma<=at;ma+=2)if(S=Math.min(G,S+2),S>=G)return!1;ke=2}S=Math.min(G,S+ke)}},pe=async r=>(oe>2e3&&(oe=0,await z.yield()),me(r)),Ce=async(r,F,S)=>{if(!(S>F+1e-9))return null;let A=F,P=-1;for(let Re=1;;Re++){let ie=F+.25*Re;const J=ie>=S-1e-9;if(J&&(ie=S),!await pe(Ye(r,ie))){P=ie;break}if(A=ie,J)break}if(P<0)return null;for(let Re=0;Re<6;Re++){const ie=(A+P)/2;await pe(Ye(r,ie))?A=ie:P=ie}return P},De=async r=>{let F=0,S=-1;for(let A=.5;A<=40+1e-9;A+=.5){if(!await pe(se(r,A))){S=A;break}F=A}if(S<0)return 1/0;for(let A=0;A<7;A++){const P=(F+S)/2;await pe(se(r,P))?F=P:S=P}return S},_e=r=>{const F=Math.min(G,Ae(r));let S=0,A=1/0;for(;Me(S),le(r),W<A&&(A=W),!(S>=F);)S=Math.min(F,S+(W>12?Math.max(.1,(W-11)/2.2):.1));return A},We=r=>{let F=0;for(let S=Math.max(0,Z+r.s-80);S<=G;S+=.25){Me(S),oe++;const A=(_-r.s)/i-r.jit+.5*r.over;if(A>=0)return!1;let P=r.Gx,Re=r.Gz;if(r.march){const ke=Math.min(_/i,r.s/i+r.jit-2.3),ve=r.ma+w*ke;P=r.mcx+r.mr*Math.cos(ve),Re=r.mcz+r.mr*Math.sin(ve)}const ie=M(Math.max(A+1.4,0)),J=.5*r.k*ie*ie,Be=(P+r.f0x*ie+r.r0x*J-te)*(d[j]+(d[j+1]-d[j])*T)+(Re+r.f0z*ie+r.r0z*J-E)*(C[j]+(C[j+1]-C[j])*T);if(F>0&&Be<=0)return!0;F=Be}return!1},fa=["near","mid","far"].map(r=>Te.object.getObjectByName(r).geometry),Pt=[];for(let r=0;r<3;r++){const F=fa[r].attributes,S=fa[r].instanceCount;for(let A=0;A<S;A++){if(oe>2e3&&(oe=0,await z.yield()),!(F.iA.array[A*4]<1e4))continue;const P=He(F,A,r===2),Re=P.cz<2;if(Re&&We(P)){if(_e(P)<2||me(P,2))for(let Be=.1;Be<=20;Be+=.1){oe>2e3&&(oe=0,await z.yield());const ke=se(P,Be);if(_e(ke)>=2&&!me(ke,2)){Pt.push({b:P,cz:NaN,dl:Be});break}}continue}if(!me(P))continue;let ie=null;if(!Re){const Be=P.s>=v.x&&P.s<=v.y&&Math.abs(P.lat)<=13.5;P.over===0?(ie=await Ce(P,0,Be?8.5-P.cz:16),ie===null&&Be&&(ie=await Ce(P,Math.max(8.5-P.cz,0),9.5-P.cz))):P.over<1&&(ie=await Ce(P,0,9.5-P.cz))}if(ie!==null){Pt.push({b:P,cz:P.cz+ie,dl:0});continue}const J=await De(P);J<1/0&&Pt.push({b:P,cz:NaN,dl:J})}}await z.yield();const Et=new Map;for(const r of Pt){const F=Et.get(r.b.seed);F?F.push(r):Et.set(r.b.seed,[r])}for(const r of["near","mid","far","mirror","farMirror","splash"]){const F=Te.object.getObjectByName(r).geometry,S=F.attributes.iPos,A=F.attributes.iA,P=F.attributes.iC,Re=F.instanceCount;for(let ie=0,J=0;ie<Re;ie++,J+=4){const Be=Et.get(A.array[J+1]);if(Be)for(const ke of Be){const ve=ke.b;if(!(A.array[J]!==ve.s||A.array[J+2]!==ve.cz||A.array[J+3]!==ve.lat||S.array[J]!==ve.Gx||S.array[J+1]!==ve.Gz)){if(ke.dl===0)A.array[J+2]=ke.cz;else{const wt=ve.r0x*ve.sg*ke.dl,je=ve.r0z*ve.sg*ke.dl;S.array[J]=ve.Gx+wt,S.array[J+1]=ve.Gz+je,A.array[J+3]=ve.lat+ve.sg*ke.dl,ve.march&&(P.array[J]=ve.mcx+wt,P.array[J+1]=ve.mcz+je)}break}}}S.needsUpdate=A.needsUpdate=P.needsUpdate=!0}}await z.yield(),await N.prewarm(z.renderer,null,xe);function b0(e,t,o,a){Ee.uTime.value=t;const h=a*G,n=h-Z,i=ea(n,a);Te.setFront(n+i),Te.uniforms.uOverH.value.set(V.posAtDist(h,be).y+mo,po),Te.update(e,t,o),N.update(e,t,o),I.update(e,t,o),qa.update(e,t,o,a,a<.9),Ue.setFromMatrixPosition(o.matrixWorld),h0(t,a),g0(t,a),zo&&zo(t,a),Ht.update(e,t,o),ls.setOpacity(p(.4,.56,a)*(1-.5*p(.9,1,a))),Ut.position.set(Ue.x,0,Ue.z),D.uCam.value.copy(Ue);const l=Math.max(Ue.y,.5),v=l*Fo,w=Math.hypot(U.x,U.z)||1;V.tangentAtDist(h,b);const g=Math.hypot(b.x,b.z)||1,M=b.x/g,y=b.z/g,u=-U.x/w*Fo,c=-U.z/w*Fo;D.uShadow.value.set(Ue.x,Ue.z,-M,-y),D.uShadow3.value.set(u*-y+c*M,-(u*M+c*y),0,0);const x=(z.through?0:vt?.5:ye==="rains"?.38:1)*(1-p(14,42,v));D.uShadow2.value.set(x,.42*x,l,x0);const m=Ie(Z+n+i,0,G-6);V.posAtDist(m,be),V.tangentAtDist(m-5,b);const d=Math.atan2(b.x,b.z);V.tangentAtDist(m+5,b);let C=Math.atan2(b.x,b.z)-d;C=((C+Math.PI)%(2*Math.PI)+2*Math.PI)%(2*Math.PI)-Math.PI,V.tangentAtDist(m,b);const k=Math.hypot(b.x,b.z)||1;D.uFrontP.value.set(be.x,be.z,b.x/k,b.z/k),D.uFrontK.value.set(-C/10,31,p(-30,25,n+i)*(1-.5*p(.84,.95,a)),p(.42,.53,a)*(1-.35*p(.93,1,a)));const R=z.renderer?z.renderer.getDrawingBufferSize(cs).y:1080;if(Rt.material.uniforms.uPix.value=2/(Math.max(o.projectionMatrix.elements[5],.05)*Math.max(R,1)),ct.uPix.value=Rt.material.uniforms.uPix.value,ct.uWall.value.set(n+i,D.uFrontK.value.x,p(.4,.47,a)*(1-.5*p(.71,.79,a))*(1-p(.9,.955,a)),Lt),ct.uWall2.value.set(15*p(.74,.86,a),.9+.5*p(.6,.68,a)),D.uPix.value=ct.uPix.value,D.uMass.value.w=p(.42,.5,a)*(1-p(.7,.8,a)),Jo.uCrown.value.x=p(.41,.46,a)*(1-.6*p(.84,.92,a))*(1-p(.95,.985,a)),ct.uStream.value.w=.4+.6*D.uMass.value.w,Kt){const K=z.renderer?z.renderer.getDrawingBufferSize(cs).y:1080;Kt.material.uniforms.uPix.value=2/(Math.max(o.projectionMatrix.elements[5],.05)*Math.max(K,1))}}return{scene:xe,path:V,duration:Pe,pace:Mo,title:ye==="moon"?"The Lake Takes Flight, by Moonlight":"The Lake Takes Flight",camera:{fov:62,near:.3,nearThrough:.3,far:5600,lookAhead:30,sway:1,bank:1.4},pois:Js,portal:{shape:"circle",radius:7,color:O.portal,glow:.8,style:"ring",revealDistance:300,dewash:0},post:{exposure:O.exposure,bloom:{strength:.2,radius:.55,threshold:1.22},grade:{saturation:O.sat,contrast:1.05,tint:O.tint,shadowTint:O.shadowTint,vignette:.3,grain:.02,aberration:0}},ride:"biplane",update:b0,dispose(){N.dispose()}}}var X0={id:"natron-liftoff",name:"The Lake Takes Flight",category:"wilderness",weirdness:.05,media:["open","air"],build:j0};export{X0 as default};
