import*as o from"three";import{makePath as Gs,makeRng as nt,clamp as Ne,lerp as Q,smoothstep as Jr}from"../kit/core.js";import*as ei from"../kit/water.js";import*as Sn from"../kit/terrain.js";import*as Pt from"../kit/flora.js";import*as ko from"../kit/fauna.js";import*as na from"../kit/fx.js";import{makeSky as ti,makeLightRig as oi}from"../kit/sky.js";import{buildHero as ai,makeBuilder as Wo,salmonGeometry as Da,salmonColours as ni,GLSL_SALMON_SKIN as Cn}from"../parts/salmon-falls.js";const St=["#C4262E","#8C8A3A","#2E5E4C","#E2B13C","#1E3A2D","#F1F5F2","#3A2A1F"],Ie=6,Ra=45,Fn=[1,3],qa=[3,7],Va=[.4,.56,.5],Ks=`mix(vec3(1.), vec3(${Va.map(a=>a.toFixed(3)).join(", ")}), smoothstep(${qa[0].toFixed(1)}, ${qa[1].toFixed(1)}, DEPTH))`,z=Jr,Xt=a=>{const b=new o.Color(a);return[b.r,b.g,b.b]},ut=(a,b)=>[a[0]*b,a[1]*b,a[2]*b],Te=(a,b,q)=>[Q(a[0],b[0],q),Q(a[1],b[1],q),Q(a[2],b[2],q)],La={september:{title:"Against the Falls",hour:"day",season:"september",weather:"clear",preset:"day",sun:[-.816,.574,-.071],sky:{zenith:"#3f6fb4",horizon:"#b9cfe0",clouds:{coverage:.3,scale:1.5,softness:.25}},air:"#a9c0cf",airK:.0019,vol:[.07,.19,.125],birch:!0,gold:"#E2B13C",leaf:.5,mist:.1,exposure:1,sat:1.1,tint:"#fffaf2",shadow:"#0a1420",light:1,amb:1},evening:{title:"Against the Falls, Evening",hour:"evening",season:"september",weather:"clear",preset:"goldenHour",sun:[.6,.26,.76],sky:{clouds:{coverage:.36,scale:1.4}},air:"#c9a488",airK:.0024,vol:[.05,.17,.14],birch:!0,gold:"#E8A13A",leaf:.5,mist:.16,exposure:1,sat:1.08,tint:"#fff2e0",shadow:"#0c1428",light:1,amb:1.25,uw:{keep:.24,shaft:.85}},dawn:{title:"Against the Falls, First Light",hour:"dawn",season:"september",weather:"clear",preset:"dawn",sun:[-.95,.12,-.28],sky:{},air:"#d8b8b4",airK:.0026,vol:[.07,.165,.135],birch:!0,gold:"#D9A848",leaf:.4,mist:.5,exposure:1.05,sat:1.05,tint:"#fff0ec",shadow:"#141228",light:1,amb:1.2,uw:{keep:.3,shaft:.8}},july:{title:"Against the Falls, July",hour:"day",season:"july",weather:"clear",preset:"day",sun:[-.816,.574,-.071],sky:{zenith:"#3a6cba",horizon:"#bcd4e6",clouds:{coverage:.42,scale:1.3}},air:"#a8c4d4",airK:.0019,vol:[.06,.19,.135],birch:!0,gold:"#6FA53A",leaf:.08,mist:.08,exposure:1,sat:1.1,tint:"#fbfff6",shadow:"#0a1620",light:1,amb:1},october:{title:"Against the Falls, First Snow",hour:"day",season:"october",weather:"clear",preset:"day",sun:[-.86,.36,-.36],sky:{zenith:"#5b7fae",horizon:"#c9d3dc",clouds:{coverage:.55,scale:1.2,softness:.4}},air:"#b6c2cc",airK:.0026,vol:[.07,.155,.12],birch:!1,gold:"#B89A58",leaf:.12,mist:.22,snow:1,exposure:.95,sat:1,tint:"#f4f8ff",shadow:"#0e1626",light:.85,amb:1},rain:{title:"Against the Falls, Soft Rain",hour:"day",season:"september",weather:"rain",preset:"overcast",sun:[-.816,.574,-.071],sky:{},air:"#9aa8a6",airK:.0032,vol:[.065,.145,.105],birch:!0,gold:"#C9A244",leaf:.4,mist:.4,rain:1,exposure:1.36,sat:.98,tint:"#f2f8f4",shadow:"#0c1618",light:1,amb:1.1},night:{title:"Against the Falls, Moonlight",hour:"night",season:"september",weather:"clear",preset:"night",sun:[-.6,.6,-.5],sky:{},air:"#1c2a44",airK:.0024,vol:[.03,.06,.06],birch:!0,gold:"#8f8a66",leaf:.3,mist:.3,exposure:1.35,sat:.9,tint:"#e8f0ff",shadow:"#060a18",light:1,amb:1.3}},pt=`
uniform float uTime; uniform vec3 uSun, uSunCol, uSkyCol, uGndCol, uCam;
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float fbm(vec2 p){ return vn(p)*.5 + vn(p*2.03+7.1)*.3 + vn(p*4.1+13.7)*.2; }
vec3 safeN(vec3 v){ return v / max(length(v), 1e-5); }
vec3 hemi(vec3 n){ return mix(uGndCol, uSkyCol, n.y*.5+.5); }
`,si=`
#include <fog_pars_vertex>
uniform float uTime; uniform vec4 uWave;
attribute vec4 aD; attribute float aBed;
varying vec3 vP; varying vec4 vD; varying float vBed;
void main(){
  vBed = aBed;
  vec3 p = position;
  float amp = (.3 + 1.5*aD.y)*(1. - .8*aD.w);
  p.y += (sin(p.x*.55 + p.z*.31 - uTime*1.7)*.03 + sin(p.x*.19 - p.z*.47 + uTime*1.1)*.035)*amp;
  float rw = length(p.xz - uWave.xy) - uWave.z;
  p.y += uWave.w*exp(-rw*rw*.03)*(1. - aD.w);
  vP = p; vD = aD;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ri=`
#include <fog_pars_fragment>
${pt}
uniform vec3 uPool, uAmber, uWhite, uGold, uHorizon, uSkyHor, uVol, uBedCol, uCeil;
uniform float uLeaf, uRain, uGoldAmt, uGlint, uWK;
uniform float uDusk;          // 0..1: how far the eye has gone down into the dusk (DUSK_EYE): the sky's share of the mirror's sheen falls with it
uniform vec4 uComp[8]; uniform float uCompS[8]; uniform vec3 uSunAir, uSkyAir;
uniform vec4 uRing[8];        // where a companion last left or met the water on an arc: (x, z, seconds since, strength)
uniform vec4 uHole; uniform vec3 uHoleAx; uniform float uHoleK; uniform vec4 uRaft;
uniform float uJetX[24];      // where the jets of the falls drive down into the pool (x; unused entries far away)
// uSubm = is the eye under water in the lower river (x) or the upper (y): 1 yes, 0 no, .5 right at the surface (then the
// fragment's own height decides). uLedge = the lip bears as the pool mirrors them (x, half width, top y, 0..1).
uniform vec2 uSubm; uniform vec4 uWave; uniform vec3 uDrown; uniform vec4 uLedge[16]; uniform float uMirK;
// the mergansers' runs: uDuck = (start x, z, the second it starts, heading), uDuckT = the ducks' clock
uniform vec4 uDuck[8]; uniform float uDuckT; uniform float uDuckL[8];      // (uDuckL = how far each has run when it leaves the water)
// the forest as the water mirrors it: tTrees = the canopy of the banks seen from above (r = height over the water / 80,
// g = 1 where it is birch, poplar, alder or reedgrass and 0 where it is spruce), uTreeMap = (x0, z0, 1/width, 1/length);
// uGoldRef = the lit gold as the water gives it back, uPortalR = the portal (x, y, z, radius), uPortalCol its glow
uniform sampler2D tTrees; uniform vec4 uTreeMap, uPortalR; uniform vec3 uGoldRef, uSpruceRef, uPortalCol; uniform float uHazeK;
uniform vec3 uSpruceLit;      // the colour of a spruce bough's lit needles
varying vec3 vP; varying vec4 vD; varying float vBed;
// Seen from below, the forest stands round the rim of Snell's window. ax = 0..1 round the window, y = height in it.
// spires: one spruce in most of N cells, each with its own place, width, height and tiers of boughs (some cells are
// gaps of sky); lobes: round birch crowns. Three ranks of spires with different N never line up into a pattern.
// Each also gives, of the tree that covers the place most, where in that tree the place is. spires, s = (across the
// tree, -1 at the side of its outline toward lesser ax and 1 at the other; the place in a tier of boughs, 0 at a
// tier's widest and 1 at the next widest above; the height in the tree, 0 at its foot and 1 at its top). lobes,
// s = the place in the crown in its own half width and half height from its middle.
float spires(float ax, float y, float N, float seed, float hLo, float hHi, float wK, out vec3 s){
  float x = ax*N, i0 = floor(x), cov = 0.; s = vec3(0.);
  for (int k = -1; k <= 1; k++) {
    float ci = mod(i0 + float(k), N), r1 = h11(ci*1.31 + seed), r2 = h11(ci*2.17 + seed*1.7 + 5.), r3 = h11(ci*.73 + seed*2.3 + 9.);
    float cx = i0 + float(k) + .5 + (r1 - .5)*.7, h = mix(hLo, hHi, r3*r3), w = wK*(.5 + r2);
    float d = abs(x - cx)/w, yy = clamp(y/max(h, 1e-3), 0., 1.), tq = fract(yy*(4. + 3.*r1) + r3*3.);
    float prof = (1. - yy)*(.68 + .32*abs(tq - .5)*2.) + .05;
    float cv = step(.2, r2)*(1. - smoothstep(prof - .12, prof + .12, d))*(1. - smoothstep(h*.94, h, y));
    if (cv > cov) { cov = cv; s = vec3(clamp((x - cx)/(w*prof), -1., 1.), tq, yy); }
  }
  return cov;
}
float lobes(float ax, float y, float N, float seed, out vec2 s){
  float x = ax*N, i0 = floor(x), cov = 0.; s = vec2(0.);
  for (int k = -1; k <= 1; k++) {
    float ci = mod(i0 + float(k), N), r1 = h11(ci*1.91 + seed), r2 = h11(ci*3.07 + seed*1.3 + 2.), r3 = h11(ci*.57 + seed*2.9 + 4.);
    float cx = i0 + float(k) + .5 + (r1 - .5)*.8;
    vec2 d = vec2((x - cx)/(.13 + .11*r2), (y - .045 - .07*r3)/(.045 + .04*r2));
    float bump = .13*sin(atan(d.y, abs(d.x) + 1e-4)*5. + r1*20.);
    float cv = (1. - smoothstep(.8, 1.05, length(d) + bump))*step(.42, r3 + r2*.5);
    if (cv > cov) { cov = cv; s = d; }
  }
  return cov;
}
// a standing bear side on, in its own measure (sx: along it from its middle, in 1.25 times uLedge's half width, the
// head toward +; by: 0 at 5.2 m over the pool, 1 at its top): the long barrel of the body, the shoulders' hump, two legs, the head
float lipBear(float sx, float by){
  float bx = abs(sx);
  float bodyM = 1. - smoothstep(.82, 1.08, length(vec2(bx/.98, (by - .62)/.36)) - .1*smoothstep(.5, .0, bx)*step(.62, by));
  float legM = (1. - smoothstep(.13, .27, abs(bx - .56)))*smoothstep(-.06, .06, by)*(1. - smoothstep(.45, .6, by));
  float headM = 1. - smoothstep(.2, .32, length(vec2(sx - 1.02, (by - .6)*.9)));
  return max(max(bodyM, legM), headM);
}
// a strand of the falls as the window shows them: the same rule as the ledge's own sheet (parts, sheetMaterial). xc =
// the place across the fall in strand widths, tc = the fall clock in strand lengths; every strand has a clock of its own
// and surges of a length of its own (no rows, so no cells) and is a file of surges coming down head first. Returns
// (how much water, its slope across).
vec2 fallStrand(float xc, float tc, float sd, float k){
  float i = floor(xc), f = fract(xc), w = f*f*(3. - 2.*f);
  vec2 hh = vec2(h11(i*.731 + sd), h11((i + 1.)*.731 + sd)), ph = hh*23. + tc*(.8 + .4*fract(hh*7.3));
  vec2 j = floor(ph), g = fract(ph), e = smoothstep(.55, 1., g);
  float a = mix(h21(vec2(i, j.x) + sd)*(.75 + .5*g.x), h21(vec2(i, j.x + 1.) + sd)*.75, e.x);
  float b = mix(h21(vec2(i + 1., j.y) + sd)*(.75 + .5*g.y), h21(vec2(i + 1., j.y + 1.) + sd)*.75, e.y);
  return vec2(.5 + (mix(a, b, w) - .451)*k, (b - a)*6.*f*(1. - f)*k);     // (.451: the mean of a and b by the two lines above)
}
// a pavement of clots (the rafts of froth are crowds of them): x = each clot's own number, y = 1 on a clot, 0 in the
// dark between clots
vec2 cobbles(vec2 p){
  vec2 g = p*.95 + vec2(vn(p*.6), vn(p*.6 + 9.))*.7, gi = floor(g), gf = fract(g);
  float dm = 9., id = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)), cc = o + .5 + (vec2(h21(gi + o), h21(gi + o + 37.)) - .5)*.7 - gf;
    float dd = dot(cc, cc); if (dd < dm) { dm = dd; id = h21(gi + o + 71.); }
  }
  return vec2(id, 1. - smoothstep(.09, .3, dm));
}
// the bed's cobbles as the mirror shows them, by the count and the sizes the world deals them on the bed: scattered, not
// a pavement (a stone in two of three cells of 1.3 m), each .4 to 1.3 m across. Returns (metres to the nearest stone's
// rim, below 0 on the stone; how pale that stone is; the way out from its middle).
vec4 bedStones(vec2 p){
  vec2 g = p/1.3, gi = floor(g), gf = fract(g), dv = vec2(0., 1.);
  float dm = 9., id = 0.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 o = vec2(float(i), float(j)), cc = (o + .5 + (vec2(h21(gi + o + 3.7), h21(gi + o + 41.)) - .5)*.62 - gf)*1.3;
    float r3 = h21(gi + o + 71.), lc = max(length(cc), 1e-3);
    float an = atan(cc.y, cc.x + 1e-5);
    float dd = lc*(1. + .1*sin(an*3. + r3*40.) + .06*sin(an*5. + r3*71.)) - (.2 + .46*r3*r3) + 9.*step(h21(gi + o + 17.), .34);
    if (dd < dm) { dm = dd; id = fract(r3*7.3); dv = -cc/lc; }
  }
  return vec4(dm, id, dv);
}
// how high over the land a ray that leaves the water through the window points (the sine of its rise), from its upward
// cosine c in the water. The window is drawn wider than the true cone (its rim at the cosine .33, 71 degrees from
// straight up, where the true rim stands at 48.6), so that a level eye has its near rim across the top of the frame:
// the land's level lies on that rim, the zenith stays the zenith, and the rise between them is spread over the wider span
float skyRise(float c){
  return pow(clamp((c - .33)/(1. - .33), 0., 1.), .8);
}
void main(){
  float t = uTime, dep = vD.x, rif = vD.y, calm = vD.w;
  vec2 q = vP.xz;
  float fl = mix(1., 2.2, rif)*(1. - .7*calm);
  float n1 = fbm(vec2(q.x*.35, q.y*.12 - t*.33*fl));
  float n2 = fbm(vec2(q.x*1.3 + n1, q.y*.5 - t*1.05*fl));
  float n3 = vn(vec2(q.x*4.2, q.y*1.6 - t*2.5*fl));
  float k = mix(.34, .7, rif)*(1. - .6*calm);
  // the pool under the face is choppy: dark troughs between the lights, and short wavelets that run across the
  // current (seen from the swing along the lip they lie across the view, and break the mirrored falls into bands)
  float chop = (1. - calm)*smoothstep(5., 10., q.y)*(1. - smoothstep(34., 48., q.y));
  k += .3*chop;
  vec3 n = safeN(vec3((n2 - .5)*k + (n3 - .5)*k*.5, 1., (n1 - .5)*k + (vn(q*2.3 + t*.3) - .5)*k*.5
    + ((vn(vec2(q.x*.7 + n1*2., q.y*2.3 - t*1.5)) - .5)*.62 + (vn(vec2(q.x*1.9 - n2, q.y*5.1 - t*2.3)) - .5)*.3)*chop));
  // rain: expanding rings in a grid of cells
  float ring = 0.;
  if (uRain > 0.) {
    vec2 rc = q*.8, ri = floor(rc), rf = fract(rc) - .5; float rh = h21(ri), rr = fract(t*.8 + rh*7.);
    vec2 ro = rf - (vec2(h21(ri + 1.7), h21(ri + 5.3)) - .5)*.5;
    ring = (1. - smoothstep(0., .05, abs(length(ro) - rr*.42)))*(1. - rr)*uRain;
    n = safeN(n + vec3(ro.x, 0., ro.y)*ring*1.5);
  }
  // drifting birch leaves
  float dist = length(uCam - vP);
  // (pxA: the breadth of one pixel as an angle, taken from the picture itself, whatever its size and its lens)
  float pxA = min(length(dFdx(vP)), length(dFdy(vP)))/max(dist, .05);
  vec2 qdx = dFdx(q), qdy = dFdy(q);
  vec2 lc = vec2(q.x*.9, (q.y - t*(.45 + 1.3*(1. - calm)))*.9), li = floor(lc);
  vec2 lf = fract(lc) - .5 - (vec2(h21(li + 3.1), h21(li + 7.7)) - .5)*.6;
  // (each is a birch leaf lying on the water: ovate, pointed, turned its own way, a midrib and veins, rust at its edge)
  float la = h21(li + 4.4)*6.2832, lca = cos(la), lsa = sin(la);
  vec2 lp = vec2(lf.x*lca + lf.y*lsa, lf.y*lca - lf.x*lsa)/(.085 + .05*h21(li + 2.9));
  float lu = clamp(lp.x, -1., 1.), lw = .64*sqrt(max(1. - lu, 0.)*.5)*smoothstep(-1., -.5, lu)*(1. + .07*sin(lu*38.));
  float leafSh = (1. - smoothstep(lw - .1, lw + .02, abs(lp.y)))*step(abs(lp.x), 1.);
  float leaf = step(1. - uLeaf*(.5 + n1), h21(li))*leafSh*(1. - smoothstep(22., 55., dist));
  float leafRib = (1. - smoothstep(.02, .07, abs(lp.y)))*.45 + (1. - smoothstep(.06, .16, abs(fract((lu + abs(lp.y)*.9)*4.) - .5)))*.2 + smoothstep(.35, .0, lw - abs(lp.y))*.35;
  vec3 col; float a = 1., wz = 0., fzFar = 0., farK = 1.;
  float eyeSub = vD.w > .5 ? uSubm.y : uSubm.x;
  bool below = eyeSub > .75 || (eyeSub > .25 && uCam.y < vP.y);
  if (!below && vD.w > .5 && uCam.y < vP.y - .04) {
    // the upper river seen from the air under the lip (both leaps): not the ceiling a drowned eye sees, but the root
    // of the falls, green glass drawn out into white as it bends over the rock
    float lipK = smoothstep(-6., -.62, vP.z);
    float fz = vn(vec2(q.x*2.6, q.y*.7 - t*2.4))*.6 + vn(vec2(q.x*8., q.y*1.8 - t*3.6))*.4;
    vec3 green = mix(uPool*2.2, uAmber*1.2, .25)*(uSunCol*.4 + uSkyCol*.5);
    vec3 wht = uWhite*(uSunCol*.3 + uSkyCol*.42 + .03);
    col = mix(green*.9, wht, smoothstep(.55, .8, fz)*.55);
    a = .92*lipK*smoothstep(-.62, -1. - .9*fz, vP.z);          // thinning away to the lip's edge in fibres
  } else if (!below) {
    // the companions' wakes: behind every back that breaks the surface a slim V of two ripple lines, carried by the
    // normal (the reflections bend along them) with only a thread of foam on their crests; the water between and
    // around them stays clear. Never thinner than a pixel and a half.
    // Right under the eye a ripple line would be a broad pale band, so they fade out inside 5 m.
    // And where the eye looks down through the surface at a companion's drowned flank (bodyK), the water's own veil
    // thins: the body just under the surface shows dark red, not as a pale shape the colour of the veil.
    float wake = 0., bodyK = 0., wfoam = 0.; vec2 wn = vec2(0.);
    vec3 V = safeN(uCam - vP);
    vec2 sm = -V.xz/max(V.y, .12)*.5;
    float nearK = mix(.12, 1., smoothstep(1.4, 5., dist));
    for (int i = 0; i < 8; i++) {
      vec4 cp = uComp[i]; vec2 dq = q - cp.xy;
      float al = -dot(dq, cp.zw), ac = dq.x*cp.w - dq.y*cp.z;
      float arm = abs(ac) - (.1 + al*.3), wd = max(.04 + al*.024, dist*.004);
      float e = exp(-arm*arm/(wd*wd))*smoothstep(.05, .7, al)*exp(-max(al, 0.)/3.2)*uCompS[i]*nearK;
      wake += e;
      wn += vec2(cp.w, -cp.z)*(sign(ac)*(-arm/wd)*e);
      vec2 d1 = dq + sm*.15, d2 = dq + sm*.5, d3 = dq + sm*.85;
      float l1 = length(d1 - cp.zw*clamp(dot(d1, cp.zw), -.92, .92)), l2 = length(d2 - cp.zw*clamp(dot(d2, cp.zw), -.92, .92)), l3 = length(d3 - cp.zw*clamp(dot(d3, cp.zw), -.92, .92));
      bodyK = max(bodyK, (1. - smoothstep(.2, .44, min(l1, min(l2, l3))))*uCompS[i]);
      // where the back breaks the surface: a thread of foam along the body's waterline, and a bow ripple pushed
      // ahead of the nose
      float sK = uCompS[i]*nearK;
      vec2 db = dq - cp.zw*clamp(dot(dq, cp.zw), -.8, .8);
      wfoam += (1. - smoothstep(0., .08 + dist*.004, abs(length(db) - .27)))*sK*.55;
      vec2 dn = dq - cp.zw*.78; float rb = max(length(dn), .03), bowK = smoothstep(-.1, .5, dot(dn, cp.zw)/rb)*sK;
      float bw = sin((rb - .2)*10. - t*8.)*exp(-rb*1.9)*bowK;
      wn += dn/rb*bw*1.1;
      wfoam += (1. - smoothstep(0., .07 + dist*.004, abs(rb - .36)))*bowK*.6;
    }
    wake = clamp(wake, 0., 1.);
    // (a drowned flank shows through the water to an eye that looks down on it; at a grazing look the surface is a
    // mirror over it, and only the back that is out of the water is seen, with its wake)
    bodyK *= smoothstep(.05, .22, V.y);
    n = safeN(n + vec3(wn.x, 0., wn.y)*.6);
    // close under the eye the lower river carries a finer ripple on its chop: the lights that the white sheet and the
    // sky lay on the water are broken into small moving facets, never a pane with an edge
    float fineK = (1. - calm)*smoothstep(5., 10., q.y)*(1. - smoothstep(80., 110., q.y))*(1. - smoothstep(5., 16., dist))*mix(.55, 1., chop);
    n = safeN(n + (vec3(vn(q*vec2(5.2, 7.4) + vec2(t*1.1, -t*1.9)) - .5, 0., vn(q*vec2(6.1, 9.3) + vec2(-t*1.3, -t*2.2) + 5.) - .5)*.42
      + vec3(vn(q*vec2(12.3, 15.1) + vec2(-t*1.7, -t*2.6)) - .5, 0., vn(q*vec2(13.7, 17.9) + vec2(t*1.5, -t*2.9) + 3.) - .5)*.2)*fineK);
    // THE POOL UNDER THE FACE (z 6 to 40), where the route swings along the lip half a metre above the water: rings
    // where leapers have fallen back (one every few seconds in each 4.6 m cell that has a fish in it, a train of
    // ripples running out from a white patch where it went in), and the ring thrown by the bear that loses the fight
    float poolK = (1. - vD.w)*smoothstep(5., 10., q.y)*(1. - smoothstep(34., 48., q.y)), ringFoam = 0.;
    if (poolK > .001) {
      vec2 rc = vec2(q.x, q.y - t*.5)/4.6, ri = floor(rc);
      float ph = fract(t*.37 + h21(ri + 3.3)*9.), on = step(.38, h21(ri + 8.8))*poolK*(1. - ph)*(1. - ph);
      vec2 ro = (fract(rc) - .5 - (vec2(h21(ri + 1.7), h21(ri + 5.3)) - .5)*.44)*4.6;
      float dl = length(ro), rr = ph*2.5, dr = dl - rr + (n2 - .5)*.3 + (n3 - .5)*.12, rag0 = .3 + .7*smoothstep(.3, .62, vn(ro*2.3 + ri*3.7 + t*.2));
      float wv = sin(dr*5.6)*exp(-abs(dr)*1.5)*(1. - smoothstep(.2, .6, dr));
      n = safeN(n + vec3(ro.x, 0., ro.y)/max(dl, .05)*(wv*on*.28*rag0));
      float rag = smoothstep(.3, .62, vn(ro*2.3 + ri*3.7 + t*.2));
      ringFoam = on*((1. - smoothstep(.0, .13 + dist*.012, abs(dr)))*.3*smoothstep(.42, .72, n3)*rag + (1. - smoothstep(.08, .5, dl + (n3 - .5)*.3))*(1. - smoothstep(.0, .25, ph))*(.3 + .6*n2));
    }
    if (uWave.w > .001) {
      vec2 wd = q - uWave.xy; float wl = length(wd), rw = wl - uWave.z, e = exp(-rw*rw*.55)*min(uWave.w*1.4, 1.)*(1. - vD.w);
      n = safeN(n + vec3(wd.x, 0., wd.y)/max(wl, .05)*(-rw*e*.9));
      ringFoam += e*(.45 + .5*n3) + exp(-wl*wl*.02)*min(uWave.w*2., 1.)*(1. - vD.w)*(.5 + .5*n2);      // and the churned patch where it went in
    }
    // and the rings where the companions' arcs left the water and met it again: a white patch that thins, ripples
    // running out from it
    for (int i = 0; i < 8; i++) {
      vec4 rg = uRing[i];
      vec2 rq = q - rg.xy; float rl2 = length(rq), rr2 = .25 + rg.z*1.7, dr2 = rl2 - rr2 + (n3 - .5)*.12 + (n2 - .5)*.2;
      float wv2 = sin(dr2*7.)*exp(-abs(dr2)*2.2);
      n = safeN(n + vec3(rq.x, 0., rq.y)/max(rl2, .05)*(wv2*rg.w*.35));
      ringFoam += rg.w*((1. - smoothstep(0., .1 + dist*.01, abs(dr2)))*.55*smoothstep(.4, .7, n3) + (1. - smoothstep(.1, .6, rl2 + (n3 - .5)*.3))*(1. - smoothstep(0., .55, rg.z))*(.5 + .5*n2));
    }
    float ndv = max(dot(n, V), 0.), F = .04 + .96*pow(1. - ndv, 3.6);
    vec3 R = reflect(-V, n); R.y = abs(R.y);
    float treeH = .13 + .13*vn(vec2(R.x*7. + 3., R.z*7.));
    float tree = (1. - smoothstep(treeH - .08*chop, treeH + .07 + .22*chop, R.y));       // (in the chop the forest's edge is a soft one: no dark outlines round the lights)
    // THE BANKS IN THE WATER. The mirrored ray is walked over the canopy map until it runs in under a crown: what it
    // finds there is that tree (a gold streak under a birch, a dark one under a spruce, straw under the reedgrass),
    // drawn out toward the eye as long as the tree is tall, tapering with its crown, and broken and bent by the ripples
    // because the ray is thrown by the rippled normal. Far trees are paled by the air between; within 12 m of the eye
    // the forest fades from the water and only the sky and the bed are left.
    // The ray is thrown by the wave normal itself (in full near the eye, eased far off where one pixel holds many
    // ripples), and its foot rides the swell, so that no edge in the water is straight or still.
    float damp = mix(.9, .36, smoothstep(5., 60., dist));
    vec3 Rt = reflect(-V, safeN(vec3(n.x*damp, n.y, n.z*damp))); Rt.y = abs(Rt.y);
    vec2 rd = Rt.xz; float rl = max(length(rd), 1e-3); rd /= rl;
    vec2 q0 = q + vec2(n2 - .5, n1 - .5)*(1.5 + dist*.14) + vec2(n3 - .5, 0.)*min(dist*.05, 1.2);
    float slope = Rt.y/rl, sw = 3.6, hitK = 0., goldK = 0., sHit = 0., topK = 0., sLo = 3.6, lodF = 0., mapK = 1.;
    for (int i = 0; i < 16; i++) {
      // a long stride first, tested against the map's coarser levels (each holds the tallest crown of the ground it
      // covers, so no tree is stepped over); where something stands in the stride, four short steps find it
      float s2 = sw*1.3, len = s2 - sw;
      float tall = textureLod(tTrees, (q0 + rd*(sw + len*.5) - uTreeMap.xy)*uTreeMap.zw, log2(max(len, 2.)*.5) + .5).r*80.;
      if (hitK < .5 && tall > slope*sw) {
        float lf = max(log2(len*.125) - 1., 0.);
        for (int j = 0; j < 4; j++) {
          float sf = sw + len*(float(j) + .5)*.25;
          vec4 tm = textureLod(tTrees, (q0 + rd*sf - uTreeMap.xy)*uTreeMap.zw, lf);
          float over = tm.r*80. - slope*sf;
          if (hitK < .5) { if (over > 0.) { hitK = 1.; goldK = tm.g; sHit = sf; topK = over; lodF = lf; } else sLo = sf; }
        }
      }
      if (hitK < .5) sLo = max(sLo, sw);
      sw = s2;
    }
    // (the crown's edge is then found between the last clear step and the first one under it, so that the outline
    // drawn in the water is the tree's own and not the stride's)
    if (hitK > .5) {
      for (int j = 0; j < 3; j++) {
        float sm2 = (sLo + sHit)*.5;
        vec4 tm = textureLod(tTrees, (q0 + rd*sm2 - uTreeMap.xy)*uTreeMap.zw, lodF);
        if (tm.r*80. - slope*sm2 > 0.) { sHit = sm2; goldK = tm.g; } else sLo = sm2;
      }
      // how deep under the crowns the ray runs on beyond the rim: a ray that only clips a tip is mostly sky (a soft
      // rim, not a cut one); and toward the end of the map the forest fades out of the water over 10 m
      vec2 u1 = (q0 + rd*(sHit + 2.5) - uTreeMap.xy)*uTreeMap.zw, u2 = (q0 + rd*(sHit + 6.5) - uTreeMap.xy)*uTreeMap.zw;
      topK = max(textureLod(tTrees, u1, lodF + 1.).r*80. - slope*(sHit + 2.5), textureLod(tTrees, u2, lodF + 1.5).r*80. - slope*(sHit + 6.5));
      vec2 eu = min(u1, 1. - u1)/(uTreeMap.zw*10.);
      mapK = clamp(min(eu.x, eu.y), 0., 1.);
    }
    float brk = .4 + .6*smoothstep(.2, .7, n2)*(.55 + .9*n3);                 // the ripples let the sky in between the streaks
    float hazeR = 1. - exp(-sHit*sHit*uHazeK*uHazeK);
    float treeM = hitK*smoothstep(0., 4.5, topK)*mapK*smoothstep(.45, 1.7, dist)*clamp(brk, 0., 1.)*.94*(1. - .35*smoothstep(45., 110., sHit))*(1. - .5*hazeR);
    float goldM = smoothstep(.2, .9, goldK)*uGoldAmt*smoothstep(.6, 2.4, dist)*(.45 + .55*smoothstep(.3, .62, vn(vec2(q.x*.9 + n1*2., q.y*.33))));
    vec3 treeCol = mix(uSpruceRef*(.7 + .6*n3), uGoldRef*(.7 + .6*n1), goldM);
    vec3 sky = mix(uSkyHor, uSkyCol*1.2, smoothstep(0., .6, R.y));
    treeCol = mix(treeCol, sky*.8, hazeR*.5 + .05);
    vec3 refl = mix(sky, mix(treeCol, uHorizon, chop), mix(treeM, tree, chop));
    // and the portal's pale glow, a wavering column under it
    if (vD.w > .5 && R.z < -.05) {
      float tp = (uPortalR.z - vP.z)/R.z; vec2 ph = vec2(vP.x + R.x*tp - uPortalR.x, vP.y + R.y*tp - uPortalR.y);
      float pg = exp(-dot(ph, ph)/(uPortalR.w*uPortalR.w*.55))*step(0., tp)*(1. - smoothstep(60., 130., tp));
      refl = mix(refl, uPortalCol, clamp(pg*1.15, 0., .9));
    }
    // the ledge in the pool: where the mirrored ray runs to the face it finds the white sheet, the bears standing dark
    // on it. The image is taken with half of the ripples' tilt, so that it is a
    // broken band and not a scatter, and drawn at a fifth of its height (uMirK): the eye is half a metre above the
    // water, and a true mirror would lay the sheet over all the water there is and push the bears out of the frame
    float mirDark = 0.;
    if (vD.w < .5 && q.y > 2.5 && q.y < 80.) {
      vec3 Rl = reflect(-V, safeN(vec3(n.x*.5, n.y, n.z*.5)));
      float face = smoothstep(.03, .2, -Rl.z)*(1. - smoothstep(50., 80., q.y)), tl = (q.y - 1.5)/max(-Rl.z, .03);
      float hy = abs(Rl.y)*tl/uMirK, hx = q.x + Rl.x*tl;
      float fb = vn(vec2(hx*1.4, hy*.35 - t*1.5))*.6 + vn(vec2(hx*4.5, hy*.9 - t*2.4))*.4;
      float inSheet = (1. - smoothstep(3.6, 7.6, hy + (n3 - .5)*1.6 + (n2 - .5)*2.2))*(.5 + .5*smoothstep(.34, .58, n2));     // broken by the troughs
      vec3 sheetC = uWhite*(uSunCol*.24 + uSkyCol*.42 + .03)*mix(vec3(.5, .66, .74), vec3(1.), smoothstep(.3, .62, fb))*.88;
      float bearM = 0.;
      for (int i = 0; i < 16; i++) {
        vec4 lb = uLedge[i];
        float bx = abs(hx - lb.x)/max(lb.y*1.25, .1), by = (hy - 5.2)/max(lb.z - 5.2, .1);
        bearM = max(bearM, (1. - smoothstep(.3, 1., bx))*smoothstep(-.12, .12, by)*(1. - smoothstep(.45, 1., by + .3*bx*bx))*lb.w);
      }
      bearM *= (.35 + .65*smoothstep(.25, .6, n2 + (n3 - .5)*.4))*smoothstep(4., 14., dist);      // (and not in the facets right under the eye, where each would be a dark outline)
      refl = mix(refl, sheetC, face*inSheet);
      refl = mix(refl, vec3(.03, .024, .02)*(uSkyCol + .3), face*bearM*(1. - inSheet*.6)*.8);
      mirDark = face*bearM*(1. - inSheet*.6)*.7;
    }
    // reflections bend round a body that lies just under the surface; they do not paint it
    refl = mix(refl, uDrown*(uSunCol*.14 + uSkyCol*.5), bodyK*.85);
    vec3 lit = uSunCol*.26*max(uSun.y, 0.) + uSkyCol*.55 + .05;
    vec3 body = mix(uAmber*(.7 + .5*n1), uPool*1.05, smoothstep(.5, 4.2, dep))*lit;
    body = mix(body, vec3(.07, .24, .17)*lit*2.1, calm*.45);
    col = mix(body, refl, mix(F, max(F, .6*smoothstep(1.5, 9., dist)*(1. - smoothstep(45., 110., sHit))), treeM*(1. - chop)));
    col = mix(col, vec3(.03, .026, .02)*(uSkyCol + .3), mirDark*.5);
    col += pow(max(dot(R, uSun), 0.), 150.)*uSunCol*uGlint*(.6 + 2.*rif)*(1. - bodyK);
    float lines = smoothstep(.6, .74, fbm(vec2(q.x*.33 + n1*1.3, q.y*.045 - t*.13)))*(.3 + .7*n3)*smoothstep(55., 80., q.y)*(1. - smoothstep(150., 260., q.y))*.5;
    // in the riffles, close under the eye: threads of foam drawn out along the current, and broader pale streaks
    float nearR = smoothstep(.12, .45, rif + .25*(1. - calm)*smoothstep(150., 100., q.y)*smoothstep(60., 80., q.y))*(1. - smoothstep(9., 20., dist));
    float thr = vn(vec2(q.x*8.5 + n1*3., q.y*2.4 - t*2.6*fl)), thr2 = vn(vec2(q.x*2.6 - n2*2., q.y*.8 - t*1.5*fl));
    float threads = nearR*(smoothstep(.72, .84, thr)*smoothstep(.4, .65, thr2)*.6 + smoothstep(.7, .84, thr2)*smoothstep(.45, .75, n3)*.3);
    float foam = rif*smoothstep(.5, .78, n2*.62 + n3*.5)*.9 + (1. - smoothstep(.04, .5, dep))*(.25 + .5*n3) + lines + ring*.5 + wake*.3*(.45 + .55*n3) + wfoam*smoothstep(.3, .62, n3) + threads;
    // rafts of foam and long streak lines that ride down the pool from the boil
    if (poolK > .001) {
      vec2 qd = vec2(q.x, q.y - t*.8);
      float rf = fbm(vec2(qd.x*.2 + n1*.9, qd.y*.23));
      vec2 clot = cobbles(qd*3.6 + vec2(n2, n1)*.8);                     // a raft is a crowd of clots of froth with dark water between them, never a pale patch
      float lace = clot.y*(.45 + .55*clot.x)*(.5 + .5*smoothstep(.3, .6, vn(qd*1.3 + 5.)))*(.3 + .7*smoothstep(.3, .7, vn(qd*9. + n3*2.)));
      float sl = fbm(vec2(q.x*.85 + n1*1.6, q.y*.06 - t*.085));
      foam += poolK*(smoothstep(.57, .65, rf)*lace + smoothstep(.585, .7, sl)*(.25 + .75*smoothstep(.35, .7, n3))*(.4 + .6*clot.y)*.8);
    }
    foam += ringFoam;
    // where the mergansers have run: from every footfall a ring spreads and fades, white at its middle while it is new
    if (uDuckT > 0. && vD.w > .5) {
      float lw = max(.06, dist*.0035);
      for (int i = 0; i < 8; i++) {
        vec4 dk = uDuck[i]; float sd = uDuckT - dk.z;
        vec2 dir = vec2(sin(dk.w), cos(dk.w)), dq = q - dk.xy;
        float al = dot(dq, dir), ac = dq.x*dir.y - dq.y*dir.x, run = 2.5*sd + 1.6*sd*sd;
        if (sd <= 0. || al < -1.6 || al > run + 1.6 || abs(ac) > 2.2) continue;
        float c0 = floor((al - .4)/1.25 + .5);
        for (int j = -1; j <= 1; j++) {
          float cell = c0 + float(j), rk = .4 + 1.25*cell;
          if (cell < 0. || rk > run || rk > uDuckL[i]) continue;
          float age = sd - (-2.5 + sqrt(6.25 + 6.4*rk))/3.2;
          vec2 dd = vec2(al - rk, ac - .2*(mod(cell, 2.)*2. - 1.));
          float dl = length(dd), rr = .22 + age*.62, fade = 1. - smoothstep(.4, 1.9, age);
          foam += fade*((1. - smoothstep(0., lw, abs(dl - rr)))*.6 + (1. - smoothstep(.12, .42, dl + (n3 - .5)*.2))*(1. - smoothstep(0., .8, age))*.9);
        }
      }
    }
    foam = clamp(foam, 0., 1.);
    vec3 white = uWhite*(uSunCol*(.2 + .16*max(n.x*uSun.x + uSun.y, 0.)) + uSkyCol*.42 + .03);
    col = mix(col, white*(.75 + .3*n3), foam);
    col = mix(col, mix(uGold*(.62 + .5*h21(li + 9.)), vec3(.3, .15, .04), clamp(leafRib + .5*step(.7, h21(li + 6.1)), 0., .85))*(uSunCol*.3 + uSkyCol*.5)*(.85 + .3*n3), leaf);
    a = clamp(max(max(F*1.7, (1. - exp(-dep*.4))*mix(.62, 1., smoothstep(3., 26., dist))), max(foam, leaf)), .28, 1.);
    a *= 1. - .64*bodyK*(1. - foam);
  } else {
    // FROM BELOW. Straight overhead is Snell's window: a bright round opening of sky (drawn wider than the true 48
    // degrees, so that a level eye has its near rim across the top of the frame), netted with light by the ripples,
    // the spruce tops and birch crowns of the banks standing bent round its rim, the sun's glare in it on the sun's
    // side, and (from the pool) the white of the falls with the bears dark on the lip. Outside the window the
    // surface is a mirror: the lit bed upside down in the bed's own light, crossed by the bright crests of the ripples
    // that slide with the current, and torn by foam wherever the water breaks above.
    vec3 Vd = safeN(vP - uCam);
    vec2 rp = vec2((n2 - .5) + (n3 - .5)*.6, (n1 - .5) + (vn(q*2.3 + t*.3) - .5)*.6);
    float rk = mix(.55, 1., rif)*(1. - .4*calm);
    // (far off one pixel holds many ripples: there a ripple's tone goes to its mean, and what a threshold cuts out of it
    // is cut with as soft an edge: pw2, pw3 = how many of the middle and of the small ripples one pixel holds)
    float pw3 = max(length(qdx*vec2(4.2, 1.6)), length(qdy*vec2(4.2, 1.6))), pw2 = max(length(qdx*vec2(1.3, .5)), length(qdy*vec2(1.3, .5)));
    float wF = smoothstep(.15, .6, pw3), n3f = mix(n3, .5, wF), n2f = mix(n2, .5, smoothstep(.15, .6, pw2));
    float c = clamp(Vd.y + (rp.x + rp.y)*.2*rk, 0., 1.);
    // (rpL: the slow swells, wider than a stone and wider than a tree stands in the window: they rock what the mirror and
    // the window show as a whole. cW: the calmer cosine the window is drawn by, the swells in full and a fifth of the
    // small ripples: its rim, at the cosine .33, is one clean line that rocks, and what stands in the window rocks with
    // it and is not torn)
    vec2 rpL = vec2(vn(vec2(q.x*.42 + 7., q.y*.3 - t*.45*fl)) - .5, n1 - .5);
    float cW = clamp(Vd.y + ((rpL.x + rpL.y)*.07 + (rp.x + rp.y)*.04)*rk, 0., 1.);
    float win = smoothstep(.33 - .012, .33 + .012, cW);
    vec2 hz = Vd.xz/max(length(Vd.xz), 1e-4);
    float se = skyRise(cW), ce = sqrt(max(1. - se*se, 0.));
    vec3 Rr = vec3(hz.x*ce, se, hz.y*ce);
    // the ripples as lenses: a net of bright lines that crawls over the window and, fainter, over the mirror; it is
    // drawn only where a line is wider than a pixel
    float fine = 1. - smoothstep(.1, .45, dist*.0022/max(Vd.y, .05));
    float l1 = vn(vec2(q.x*1.5 + n1*1.6, q.y*1.1 - t*.9*fl)), l2 = vn(vec2(q.x*3.4 - n2*1.2, q.y*2.6 - t*1.6*fl + 7.));
    float c1 = clamp(1. - abs(l1*2. - 1.), 0., 1.), c2 = clamp(1. - abs(l2*2. - 1.), 0., 1.);
    float lines = (c1*c1*c1 + .6*c2*c2*c2)*fine;
    vec3 sky = mix(uSkyHor*1.15, uSkyAir*1.35, smoothstep(0., .55, se));
    float cloud = smoothstep(.45, .7, fbm(Rr.xz/(se + .35)*1.4 + vec2(t*.012, 3.)));
    sky = mix(sky, uSkyHor*1.25 + uSunAir*.1, cloud*.7);
    // from the pool the window looks out at the ledge: the white sheet in its fibres up to the lip, the bears standing
    // dark on it against the sky (the same bears the pool mirrors from above: uLedge)
    float ledgeK = 0., mist = 0.;
    vec2 sh = uSun.xz/max(length(uSun.xz), 1e-4);
    if (vD.w < .5 && vP.z > 0. && vP.z < 90. && Rr.z < -.04 && win > .001) {
      float tl = (vP.z + 1.5)/(-Rr.z), hy = Rr.y*tl, hx = vP.x + Rr.x*tl, fk = 1. - smoothstep(70., 120., tl);
      // (the bears are looked up along a ray of their own, c0, which the ripples bend a third as much as they bend the
      // mirror's, c: the bears rock, they are not torn)
      float c0 = clamp(Vd.y + (rp.x + rp.y)*.065*rk, 0., 1.), se0 = skyRise(c0), ce0 = sqrt(max(1. - se0*se0, 0.));
      vec3 Rb = vec3(hz.x*ce0, se0, hz.y*ce0);
      float tlb = (vP.z + 1.5)/max(-Rb.z, .04), hyb = Rb.y*tlb, hxb = vP.x + Rb.x*tlb;
      // THE FALL IN THE WINDOW FALLS IN FIBRES, by the sheet's own rule: strands on the fall clock (tf = the root of the
      // drop from the lip at 6 m, running at 2.215 a second: free fall), ropes .77 m and strands .2 m wide that run down
      // the whole face; they are looked up along the bears' ray (they rock, they are not torn into pieces), and no strand
      // is drawn narrower than a pixel (.0022 of the way to it, as the ripples' lines above); the ropes are drawn at
      // every distance, as in the sheet
      float fallW = sqrt(clamp(6. - hyb, 0., 7.) + .04) - t*2.215, pxw = (dist + tlb)*.0022;
      float kw2 = 1. - smoothstep(.4, 1., pxw*5.), ww1 = sqrt(.1156 + (1. - kw2*kw2)*.158);
      vec2 w1 = fallStrand(hxb*1.3, fallW*.6, 3., 1.), w2 = fallStrand(hxb*5., fallW*.6, 11., kw2);
      // (the sheet's own sum where its fibres and threads are not drawn: they are narrower than a pixel here and hand
      // their share to the strands, .397 = the root of .3, .22 and .14 squared, and the strands theirs to the ropes
      // where they are too)
      float fb = .5 + (w1.x - .5)*ww1 + (w2.x - .5)*.397;
      float sheetK = (1. - smoothstep(5.3, 6.5, hy + (n3 - .5)*1.2))*fk*(1. - smoothstep(72., 78., abs(hx)));
      vec3 sheetC = uWhite*(uSunAir*.22 + uSkyAir*.42 + .03)*mix(vec3(.42, .6, .68), vec3(1.), smoothstep(.3, .62, fb));
      // the lip bears: each is the shape of lipBear in its own place and size. rimB = how much less of the shape
      // there is 0.28 m toward the sun (the sun's x and height) than here: the side of its outline that faces the
      // sun. Of the bear that covers the place most: rndB = how high on the barrel the place is (0 a quarter of the
      // barrel's half height under its middle, 1 at its top), legB = the height in the bear (0 at 5.2 m, 1 its top)
      float bearM = 0., rimB = 0., rndB = 0., legB = 1.;
      vec2 s2 = uSun.xy/max(length(uSun.xy), 1e-4)*.28;
      for (int i = 0; i < 16; i++) {
        vec4 lb = uLedge[i];
        float wB = max(lb.y*1.25, .1), hB = max(lb.z - 5.2, .1), fc = fract(lb.x*.37) > .5 ? 1. : -1.;
        float sxh = (hxb - lb.x)/wB*fc, by = (hyb - 5.2)/hB;
        float m = lipBear(sxh, by)*lb.w;
        rimB = max(rimB, clamp(m - lipBear(sxh + s2.x/wB*fc, by + s2.y/hB)*lb.w, 0., 1.));
        if (m > bearM) { bearM = m; rndB = smoothstep(-.25, 1., (by - .62)/.36); legB = by; }
      }
      sky = mix(sky, sheetC, sheetK);
      // umber-black, a lighter umber up the barrel by the sun and the sky, and on the rim the sun's own colour warmed
      vec3 bearC = vec3(.035, .028, .022)*(uSkyAir + .3) + vec3(.2, .11, .05)*(uSunAir*.3 + uSkyAir*.4)*rndB + uSunAir*vec3(1., .72, .4)*(.75*rimB);
      // (by the sheet's own share sheetK its white stands before the legs: under 0.04 of the bear's height the sheet
      // alone, over 0.18 the bear alone, both 0.075 of its height higher where fb is 1 and as much lower where it is 0)
      sky = mix(sky, bearC, bearM*fk*(1. - sheetK*(1. - smoothstep(.04, .18, legB - (fb - .5)*.15))));
      ledgeK = max(sheetK, bearM*fk);
      // (the trees that stand behind the ledge are seen through the wall of spray that rises behind the bears: mist)
      mist = fk*(1. - smoothstep(72., 78., abs(hx)))*(1. - smoothstep(22., 44., hy));
    }
    float cover = 0.;
    // THE TREELINE SEEN UP THROUGH THE WATER: every tree is found along the window's own calm ray (cW): it rocks
    // as a whole, it is not torn. Its outline is one clean shape; inside it the tone is by the sun's bearing about
    // the window (front: 1 where the eye looks straight away from the sun, -1 where it looks toward it; sideS: 1
    // where the sun stands a quarter turn toward greater ax, -1 the other way; back: 0 while front is over -0.1, 1
    // when it is under -0.8), in nothing finer than a bough. A spruce is lit as a cone (nl: the sun's bearing on its
    // face at the place across it), each tier of boughs light on its upper side and dark under (bl, one wave a
    // tier): from uSpruceRef, 1 to 1.8 times by bl, to uSpruceLit in the sun's and the sky's light; and by back its
    // sides (from 0.84 of the way out) and its top (from 0.82 of its height) are brightened by up to half the sun's
    // colour times the sum of its lit green and half the gold. A birch crown is lit as a ball (nlb, the sun's height counted) in
    // clumps of leaf (clump), from the gold under the sky alone to the gold in the sun; and by back all of it is
    // brightened by 0.12 of the sun's colour times the gold, and from 0.72 of its radius out by up to 0.92 of it.
    // The far rank goes from twice uSpruceRef to the same lit green by front and its own grain (tex), and 0.45 of
    // the way to 0.8 of the sky's colour at the horizon.
    if (se < .62 && win > .001) {
      float ax = atan(hz.x, hz.y + 1e-5)/6.2832 + .5 + rpL.x*.004*rk, ys = se;
      float tex = vn(vec2(ax*150., ys*11.));
      vec3 sF, sA, sB; vec2 cA, cB;
      float far = max(spires(ax, ys, 96., 3.3, .05, .13, .5, sF), 1. - smoothstep(0., .02, ys - .03 - .02*vn(vec2(ax*260., 3.))));
      float bA = lobes(ax, ys*.62, 21., 7.7, cA), bB = lobes(ax, ys*.8, 33., 2.9, cB);
      float birch = max(bA, bB)*uGoldAmt;
      birch *= smoothstep(.3, .5, vn(vec2(ax*420., ys*30.))*.55 + tex*.45 + .1);                    // (a crown is clumps of leaf with the sky between them)
      float nA = spires(ax, ys, 23., 1.7, .17, .46, .3, sA), nB = spires(ax, ys, 31., 5.1, .11, .32, .26, sB);
      float near = max(nA, nB);
      vec3 sp = nA > nB ? sA : sB; vec2 cr = bA > bB ? cA : cB;
      float front = -dot(hz, sh), sideS = sh.x*hz.y - sh.y*hz.x, back = smoothstep(.1, .8, -front);
      float nl = sqrt(1. - sp.x*sp.x)*front + sp.x*sideS, bl = .5 + .5*cos(6.2832*(sp.y - .2));
      vec3 sprC = mix(uSpruceRef*(1. + .8*bl), uSpruceLit*(uSunAir*.26 + uSkyAir*.22), smoothstep(-.15, .55, nl)*(.2 + .8*bl));
      sprC += (uSpruceLit + uGold*.5)*uSunAir*(.5*back*max(smoothstep(.84, .99, abs(sp.x)), smoothstep(.82, .93, sp.z)));
      float rr = min(length(cr), 1.), nlb = length(uSun.xz)*(sqrt(1. - rr*rr)*front + cr.x*sideS) + uSun.y*cr.y;
      float clump = vn(vec2(ax*200., ys*22.));
      vec3 birC = mix(uGold*uSkyAir*(.25 + .2*clump), uGold*(uSunAir*.44 + uSkyAir*.3), smoothstep(-.2, .6, nlb)*(.45 + .55*clump));
      birC += uGold*uSunAir*(back*(.12 + .8*smoothstep(.72, .98, rr)));
      vec3 forest = mix(mix(uSpruceRef*2., uSpruceLit*(uSunAir*.26 + uSkyAir*.22), smoothstep(-.5, .6, front)*(.6 + .4*tex)), uSkyHor*.8, .45);
      forest = mix(forest, birC, birch);
      forest = mix(forest, sprC, near);
      forest = mix(forest, uSkyHor*1.1, .62*mist);          // (paled by the spray: the bears on the lip stay dark on pale)
      cover = max(max(far, birch), near)*(1. - ledgeK);
      sky = mix(sky, forest, cover);
    }
    // the sun: its disc where it stands in the window, and on the sun's side of the window a broad glare that the
    // ripples break into running lines
    float sd = max(dot(Rr, uSun), 0.);
    float az = max(dot(hz, sh), 0.), glare = az*az*az*(1. - .6*se);
    sky += uSunAir*(pow(sd, 40.)*1.4*(.5 + n3) + pow(sd, 6.)*.14 + glare*(.07 + .45*lines))*uGlint*(1. - cover)*(1. - ledgeK);
    float lens = vn(q*1.25 + vec2(t*.55, -t*.4))*vn(q*2.7 - vec2(t*.45, t*.6));
    sky *= (.7 + (.9*lens + .45*lines)*mix(1., .5, calm))*mix(.78, 1., smoothstep(0., .5, se));
    // THE MIRROR, BY THE PLACE. Outside the window the surface gives back all the light that meets it from below: what
    // stands in it is the bed itself upside down, as an eye as far above the surface as ours is under it would see it.
    // The mirrored ray is followed down to the bed (tbT: its way from the surface to the bed; way: the whole way from
    // the eye) and the bed is drawn where it lands, as it lies there: beds of olive algae and bars of clean gravel, the
    // scattered pale cobbles with the sun on one flank and the dark at their feet, the caustic net over all. It is as
    // sharp as one pixel and the small ripples in it leave it on the bed at that distance (fAc across the line of
    // sight, fAl along it, in metres; nothing is blurred beyond that), it is lit as the bed is, and the water on the
    // whole way takes it as the scene's haze takes the bed below: far off both are the water's own colour and meet in
    // it. The ripples rock the picture as a whole (the slow swells, wider than a stone) and shiver it a little (the
    // small ones): they do not tear it.
    // (depB: the depth of the bed the mirror shows, the same law in both rivers: the lower river's own depth, and under
    // the glass of the upper river the depth of the ledge's rock, 3 m, where the world's terrain lies 14 m down in a pit)
    float depB = vBed;
    // (rpB: the ripples one pixel holds, too small to rock the picture, soften it instead, by twice their tilt over the
    // mirrored way: little in the glide of a run, more over a riffle, most in the chop under the falls)
    float vy = max(Vd.y, .03), tbT = max(depB, .4)/vy, way = dist + tbT, rpB = tbT*(.006 + .012*rif + .03*chop)*(1. - .6*calm);
    float fAc = length(vec2(way*pxA, rpB)), fAl = fAc/vy;
    vec2 bq = vP.xz + Vd.xz*tbT + (rpL*.2 + rp*.025)*min(tbT, 4.)*(1. - .2*calm);
    // (what one pixel can hold: a stone, the caustic net, the fine gravel, a ripple's face; what it cannot hold goes to its mean)
    float sStone = 1. - smoothstep(.15, .6, fAl), sNet = 1. - smoothstep(.25, .9, fAl), sFine = 1. - smoothstep(.04, .16, fAl);
    vec4 st = bedStones(bq);
    float ew = length(vec2(dot(st.zw, hz)*fAl, (st.z*hz.y - st.w*hz.x)*fAc)) + .004;        // (one pixel across the stone's rim, m)
    float stoneM = (1. - smoothstep(-ew, ew, st.x))*sStone, inS = -st.x, onTop = smoothstep(.04, .3, inS);
    vec2 sunH = uSun.xz/max(length(uSun.xz), 1e-4);
    float bars = smoothstep(.34, .66, fbm(vec2(bq.x*.31, bq.y*.14) + 4.7));
    // (the bed's ground: pale gravel, and on it the dark tufts of algae, thick in its beds and thin on its bars)
    float tuft = mix(.5, smoothstep(.4, .6, vn(bq*3.3 + 3.)*.6 + vn(bq*7.7 + 9.)*.4), 1. - smoothstep(.08, .32, fAl));
    vec3 gcol = mix(uBedCol*vec3(.78, .83, .64), vec3(.12, .14, .05), tuft*(.75 - .35*bars))*(.9 + .2*mix(.5, vn(bq*15.), sFine));
    // (a stone seen from above and aslant: its top in the light, pale, a little algae on it; the flank it turns to the
    // eye in its own shade, the sun's flank brighter; and the dark at its foot, deepest on the eye's side and away from the sun)
    float flank = dot(st.zw, sunH), nearK = max(-dot(st.zw, hz), 0.), wall = nearK*(1. - smoothstep(.02, .24, inS));
    gcol *= 1. - (.34 + .3*nearK - .18*flank)*exp(-max(st.x, 0.)/.14)*sStone;
    // (and it is a lumpy thing: its faces lighter and darker, its skin grained)
    float lump = mix(.5, vn(st.zw*1.6 + st.y*37. + inS*4.), sStone), grain = mix(.5, vn(bq*17.), sFine);
    vec3 scol = uBedCol*(2.1 + .45*st.y)*mix(vec3(1., 1.03, .82), vec3(.86, .97, .7), .3*onTop)*(mix(.8, 1.06, smoothstep(0., .2, inS)) + .2*flank*(1. - onTop))*(1. - .5*wall)*(.84 + .32*lump)*(.93 + .14*grain);
    vec3 alb = mix(gcol, scol, stoneM) + (uBedCol*1.5 - gcol)*.17*(1. - sStone);
    // (the caustic net as it lies on the bed: bright threads with the dark of the water's shade between them)
    float k1 = vn(bq*.9 + vec2(t*.5, -t*.35)), k2 = vn(bq*1.7 - vec2(t*.4, t*.3));
    k1 = clamp(1. - abs(k1*2. - 1.), 0., 1.); k2 = clamp(1. - abs(k2*2. - 1.), 0., 1.);
    float net = k1*k1*k1 + .6*k2*k2*k2;
    // (its light is the bed's own: the measure .46, .46, .45 brings the mirror's gravel, tufts and cobbles to the tones
    // the bed below has in the picture, in the rose light of a dawn and in September's alike)
    vec3 bed = alb*(uSunCol*(.2 + .75*mix(.4, net, sNet))*.6 + uSkyCol*.34)*vec3(.46, .46, .45);
    // (the longer way through the water takes a little of it, the red first, toward the water's own tint of what lies deep)
    bed *= mix(vec3(1.), vec3(.55, .86, .8), 1. - exp(-tbT*.09));
    // (the bed in the mirror is lit by its own depth, as the bed itself is: DUSK_BED, DEEP_LIGHT)
    bed *= ${Ks.replace("DEPTH","depB")};
    // (under the glass of the upper river the mirror is a clean one: the bed's image keeps the bed's own pale light)
    bed *= mix(vec3(1.), vec3(1.3, 1.1, 1.14), calm);
    // (the water on the mirrored way dims the picture by the law the scene's haze has under water, with the water's own
    // density, uWK, at every depth of the eye: the scene's haze thins to the air's as the eye comes up through the last
    // of the water, and the mirror keeps its tone there; the way up to the surface is laid on with the surface's own
    // haze, below. farK: only a ray that climbs to the ceiling finds the glow of the light that comes down through it;
    // a level ray finds the water's own colour, the colour the far bed goes into under water: uCeil is one and a half
    // times that colour, and it is taken from uCeil at every depth of the eye, since the scene's haze colour turns to
    // the air's in the last of the water)
    float img = exp(-uWK*uWK*tbT*(tbT + 2.*dist));
    farK = smoothstep(.02, .3, Vd.y);
    vec3 mirror = mix(mix(uCeil/1.5, uCeil*.85, farK), bed, img);
    // the ripples' own faces: lit and shaded sides, and the bright crests
    mirror *= (.86 + .4*(n2f - .45)*mix(1., .4, calm))*(1. - .22*smoothstep(.33 - .19, .33, c));
    // (the sky's light in the crests and in the sheen falls as the eye goes down into the dusk: skyK)
    float skyK = 1. - .8*uDusk;
    mirror += (uSkyHor*.22*skyK + uCeil*.5)*lines*(.3 + .7*n3)*mix(.8, .3, calm);
    // (a mirror of moving water is silver where it has no picture to show: a third of it is the water's own sheen
    // there, and a fourteenth where the cobbles stand in it)
    mirror = mix(mirror, (uSkyHor*.3*skyK + uCeil*.8)*(.7 + .6*n2f), mix(.32, .07, img)*mix(.3, 1., farK));
    col = mix(mirror, sky*vec3(.66, .86, .9), win);
    col += uSkyHor*smoothstep(.25, .33, c)*(1. - win)*smoothstep(.74, .88, vn(q*vec2(9., 3.5) + vec2(t*.7, -t*1.3)))*.4;      // slivers of sky tipped through by the ripples
    col = mix(col, uGold*(uSunCol*.05 + uSkyCol*.14), leaf*.9*win);                    // leaves ride over as silhouettes
    col += uWhite*ring*.3*(.3 + win);
    // under the boil: a churning ceiling of aerated water, bright clouds of bubbles with dark water between them
    float b1 = fbm(q*.35 + vec2(t*.21, -t*.5)), b2 = fbm(q*1.1 + b1*2. - vec2(0., t*1.1));
    vec3 glow = uWhite*(uSunCol*.15 + uSkyCol*.3)*vec3(.72, 1., .88);
    float clotK = smoothstep(.45, .7, b2*.7 + n3*.3);
    vec3 foamU = mix(uVol*.7 + glow*.04, glow*1.22, clotK)*(.72 + .6*vn(q*3.1 + vec2(t*.9, -t*1.7)));
    foamU += uWhite*(uSunCol*.1 + uSkyCol*.12)*smoothstep(.62, .8, b1)*smoothstep(.35, .7, n3);
    float fz = step(0., vP.z)*smoothstep(.22, .6, exp(-max(vP.z, 0.)/9.)*1.35 + (b2 - .5)*.55);
    fz = max(fz, step(0., vP.z)*(1. - smoothstep(42., 100., vP.z))*smoothstep(.51, .63, b1 + (b2 - .5)*.35)*.9);      // and rafts of it ride down the pool
    // over the riffle bars the water breaks: patches of the same foam, torn out along the current
    // (in patches, and in long trains that ride down from each bar)
    float train = smoothstep(.6, .7, vn(vec2(q.x*1.4 + n1*1.3, q.y*.19 - t*.4*fl)))*(.4 + .6*smoothstep(.3, .62, n3f));
    // (the trains ride on down the deeper channel between the bars as well, thinner there)
    float reach = (1. - calm)*smoothstep(76., 92., q.y)*(1. - smoothstep(166., 182., q.y));
    float fzR = max(rif*max(smoothstep(.54 - .15*wF, .64 + .15*wF, n2f*.62 + n3f*.5)*(.5 + .5*smoothstep(.3, .6, n1)), train), reach*train*.6*smoothstep(.35, .6, n2f))*.92;
    // the left of the pool, between the pool bear and the falls, is roofed with drifting rafts of the same foam (uRaft
    // = centre x, z and radii)
    vec2 rq = (vP.xz - uRaft.xy)/uRaft.zw;
    fz = max(fz, (1. - smoothstep(.45, 1., length(rq)))*smoothstep(.34, .5, b1*.55 + b2*.45 + (n3 - .5)*.1)*.94);
    // (inside the window the dark between the clouds of foam is not water but the opening itself: the sky, the falls
    // and the bears show there)
    col = mix(col, foamU, max(vD.z, fz)*(1. - .9*win*(1. - clotK)));
    // (the riffle's foam is thin: white where the light comes down through it, in patches with clean water between)
    col = mix(col, glow*(1.25 + .9*n3f) + uSkyHor*.12, fzR*(1. - .5*win));
    fzFar = max(max(vD.z, fz)*clotK, fzR);
    // right under the falls the ceiling is the white of the plunging jets themselves (wz, laid on after the haze
    // below): thick under each jet of the falls (uJetX), thinner between them, where the green shows
    float jd = 1e3;
    if (vP.z > 0. && vP.z < 14.) for (int i = 0; i < 24; i++) jd = min(jd, abs(q.x - uJetX[i]));
    float jetK = 1. - smoothstep(1.1, 3.6, jd + (b2 - .5)*2.2);
    wz = step(0., vP.z)*(1. - smoothstep(6., 10.5, vP.z + (b2 - .5)*3.4 + (n3 - .5)*1.2 + (1. - jetK)*2.6))*mix(.5, 1., jetK);
    // THE POOL BEAR wades in a patch of its own froth: where the eye's ray runs on above the surface to its back and
    // head the surface is broken open (uHole = the middle of what stands above the water and the opening's radius,
    // uHoleAx = half the length of the back), a ragged opening torn by the clots of the froth, never an outline; behind
    // the bear hangs the glow of that froth ('poolWindow'), and round the opening the ceiling is froth too
    vec3 hb = uHole.xyz - uCam; float ht = max(dot(hb, Vd), 0.);
    vec3 h1 = hb - uHoleAx, h2 = hb + uHoleAx, h3 = hb - uHoleAx*.5, h4 = hb + uHoleAx*.5;
    float hd = min(min(length(hb - Vd*ht), min(length(h1 - Vd*dot(h1, Vd)), length(h2 - Vd*dot(h2, Vd)))), min(length(h3 - Vd*dot(h3, Vd)), length(h4 - Vd*dot(h4, Vd))));
    hd += (rp.x + rp.y)*.55 + (b2 - .5)*1.5 + (n3 - .5)*.5;
    float hin = step(dist, ht + length(uHoleAx) + 1.);
    col = mix(col, foamU*1.15, uHoleK*(1. - smoothstep(uHole.w*.9, uHole.w*2., hd))*hin*(.35 + .65*clotK));
    a = 1. - uHoleK*(1. - smoothstep(uHole.w*.3, uHole.w*1.05, hd))*hin;
  }
  gl_FragColor = vec4(max(col, 0.), a);
  // fog: the scene's from above; from below the far ceiling glows with the light that comes down through it
  float ff = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  // (far off the ceiling is not one flat tone: the swells of the surface cross it as long light and dark bands that
  // slide with the current, and where the water breaks the foam still shows pale through the haze)
  vec3 ceilC = uCeil;
  if (below) {
    float sw = vn(vec2(q.x*.11 + n1*.8, q.y*.42 - t*.25))*.6 + vn(vec2(q.x*.3 - n2*.5, q.y*1.1 - t*.5))*.4;
    ceilC = uCeil*(.72 + .56*sw) + (uSkyHor*.12 + uCeil*.22)*smoothstep(.6, .8, sw);
    ceilC = mix(ceilC, uWhite*(uSunCol*.15 + uSkyCol*.3)*vec3(.74, 1., .9), fzFar*.6);
    // (and toward the far end the ceiling is the mirror of far water: it goes into the water's own colour, uCeil over
    // one and a half, as the far bed does, so that the two meet in it; farK, above)
    ceilC = mix(uCeil/1.5, ceilC, farK);
  }
  gl_FragColor.rgb = mix(gl_FragColor.rgb, below ? ceilC : fogColor, ff);
  // (the same white, gain and half share of the haze as the hero's bubble wall, so that the two are one tone in every look)
  // and it is streaked: fibres of white driven down, the green of the pool in the gaps between them
  if (wz > .001) {
    float wf = vn(vec2(q.x*5.5, q.y*1.4 + t*3.))*.55 + vn(vec2(q.x*13., q.y*3.1 + t*4.4))*.45;
    vec3 wc = uWhite*(uSunCol*.3 + uSkyCol*.5)*vec3(.8, 1., .92)*(.3 + 1.05*smoothstep(.25, .7, wf))*1.3;
    gl_FragColor.rgb = mix(gl_FragColor.rgb, mix(wc, fogColor, ff*.5), wz*(.5 + .42*smoothstep(.3, .62, wf)));
  }
}`,Io=`
#include <fog_pars_vertex>
${pt}
attribute vec4 aAux, iA, iB, iC;
uniform vec2 uFan;       // (roll onto its side, radians; more sweep to the tail): a female fanning her redd
uniform float uGrow;     // 0..1: the whole lot drawn small to nothing (a lot that the eye, under the falls, has no sight of)
varying vec3 vP, vN, vC, vB; varying float vFin, vSeed;
void main(){
  float ph = iA.w, t = uTime, sc = iB.x*uGrow;
  vB = position; vSeed = iC.x;
  vec3 home = iA.xyz;
  home.x += sin(t*.23 + ph*17.)*.4*iC.w; home.y += sin(t*.37 + ph*9.)*.14*iC.w; home.z += sin(t*.29 + ph*40.)*.8*iC.w;
  if (iB.z > 0.) { float tr = mod(t*iB.z + ph*iB.w, iB.w); home.z -= tr; sc *= smoothstep(0., 6., tr)*(1. - smoothstep(iB.w - 6., iB.w, tr)); }
  float b = aAux.x, w = t*iC.z + ph*30.;
  vec3 lp = position;
  lp.x += sin(w - b*2.6)*(.13 + uFan.y)*b*b + sin(w*.5)*.04*(b - .35);
  vec3 ln = normal; ln.x += cos(w - b*2.6)*(.22 + uFan.y)*b*step(.001, abs(normal.x));
  lp *= sc;
  // (a fish that holds its station, iB.z 0, may look about it: iB.w - 1 = how far it swings its head and body round, radians)
  float yw = iB.y + (iB.z > 0. ? 0. : (iB.w - 1.)*sin(t*.55 + ph*11.));
  float cy = cos(yw), sy = sin(yw), cp = cos(iC.y), sp = sin(iC.y);
  vec3 f = vec3(-sy*cp, sp, -cy*cp), r = vec3(cy, 0., -sy), u = cross(r, f);
  float cr = cos(uFan.x), sr = sin(uFan.x); vec3 r2 = r*cr + u*sr; u = u*cr - r*sr; r = r2;
  vec3 wp = home + r*lp.x + u*lp.y + f*lp.z;
  vN = safeN(r*ln.x + u*ln.y + f*ln.z); vP = wp; vFin = aAux.y;
  vC = color*(.78 + .4*h11(iC.x*3.))*mix(vec3(1.), vec3(1.1, .92, .84), h11(iC.x*7.));
  vec4 mvPosition = modelViewMatrix*vec4(wp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Bn=`
// light under water: steeper, netted with caustics, and red goes first with depth
vec3 wetLight(vec3 P, vec3 n, out float under){
  float wl = P.z < -.6 ? ${Ie.toFixed(1)} : 0., depth = max(wl - P.y, 0.);
  under = step(.001, depth);
  vec3 Ld = safeN(mix(uSun, vec3(uSun.x*.5, 1., uSun.z*.5), under*.7));
  float ca = vn(P.xz*.9 + vec2(uTime*.5, -uTime*.35))*vn(P.xz*1.7 - vec2(uTime*.4, uTime*.3));
  vec3 l = uSunCol*(max(dot(n, Ld)*.65 + .35, 0.)*(.55 + under*(ca*2.4 - .25)*max(n.y, 0.)) + .45*(1. - under)*max(dot(n, Ld), 0.)) + hemi(n)*.9;
  // (and by its own depth: DUSK_BED, DEEP_LIGHT)
  return l*mix(vec3(1.), vec3(.6, .84, .7), under*(1. - exp(-depth*.35)))*${Ks.replace("DEPTH","depth")};
}`,sa=`
#include <fog_pars_fragment>
${pt}${Cn}
uniform vec3 uVolC; uniform float uAbove, uFogF, uGainF, uGainR, uFarK; uniform vec4 uBoil;      // uBoil = (the boil hides drowned bodies from the air nearer the face than x..y, bodies are cut off this deep, and this dark below the surface)
uniform vec3 uShaftD;      // the way the sun's shafts run down through the water
varying vec3 vP, vN, vC, vB; varying float vFin, vSeed;
void main(){
  float gloss, cut;
  vec3 alb = salmonSkin(vC, vB, vFin, vSeed, gloss, cut);
  // to the eye in the water with it a sockeye is not one red: the head is a clear olive green back to the gill cover,
  // the belly paler than the flank (the back is dark already)
  float body = 1. - step(.05, vFin), hdK = smoothstep(.27, .33, vB.z/1.8)*body, rel = salmonRel(vB);
  alb = mix(alb, alb*2.2 + vec3(.016, .046, .006), hdK*.92*(1. - uAbove));
  alb = mix(alb, alb*.85 + vec3(.11, .06, .05), (1. - smoothstep(.03, .3, rel))*(1. - hdK)*body*.6*(1. - uAbove));
  // TO THE EYE IN THE AIR a spawning sockeye is red over its back as well: the dark maroon back is how the eye in the
  // water sees it, against the bright ceiling. So the back that rides out of the water, and the fish on its arc, take
  // the sun as the flank does: crimson where the sun reaches, a deep red in their own shade, never black.
  alb = mix(alb, vC*vec3(.84, .8, .8), smoothstep(.55, .8, rel)*(1. - .55*smoothstep(.3, .335, vB.z/1.8))*body*.82*uAbove);
  float depth = max((vP.z < -.6 ? ${Ie.toFixed(1)} : 0.) - vP.y, 0.), under = step(.001, depth);
  float boilK = uAbove*under*(1. - smoothstep(uBoil.x, uBoil.y, vP.z))*step(-.6, vP.z);
  if (boilK > .5 || cut > .5 || uAbove*depth > uBoil.z) discard;                      // the boil is opaque from the air; fins end raggedly
  vec3 V = safeN(uCam - vP), n = safeN(vN); if (dot(n, V) < 0.) n = -n;
  // light: the sun above water; under it the light comes steeply down, netted with caustics, and red goes first with depth
  vec3 Ld = safeN(mix(uSun, vec3(uSun.x*.5, 1., uSun.z*.5), under*.7));
  float ca = vn(vP.xz*.9 + vec2(uTime*.5, -uTime*.35))*vn(vP.xz*1.7 - vec2(uTime*.4, uTime*.3));
  // the caustic net crawls over the back and over the flank that is turned to the sun; and where one of the sun's
  // shafts comes down through the water (sb: the place on the surface the light came in by) the fish it crosses is lit
  float eyeW = under*(1. - uAbove);
  float sunSide = max(dot(n.xz, uSun.xz)/max(length(uSun.xz), 1e-4), 0.)*(1. - abs(n.y));
  vec2 shq = vP.xz - uShaftD.xz*((vP.y - (vP.z < -.6 ? ${Ie.toFixed(1)} : 0.))/min(uShaftD.y, -.2));
  float sb = smoothstep(.6, .78, vn(shq*.4 + vec2(uTime*.05, -uTime*.09)))*eyeW;
  float form = salmonForm(n, Ld, mix(.3, .38, under))*(1. + under*(ca*2.2 - .3)*(max(n.y, 0.)*.8 + sunSide*.7*eyeW));
  // to the eye under water the light comes from above: a lit back and upper flank over a belly in its own shade
  form *= mix(1., .34 + .66*smoothstep(-.8, .15, n.y), under*(1. - uAbove));
  form *= 1. + sb*.9*smoothstep(-.3, .5, n.y + sunSide);
  vec3 E = (uSunCol*.3 + uSkyCol*.5 + uGndCol*.2)*mix(vec3(1.), vec3(.86, .84, .72), under*(1. - exp(-depth*.35)));
  float fr = 1. - max(dot(n, V), 0.), back = max(dot(-V, uSun), 0.); back *= back;
  vec3 col = salmonLit(alb*(1. + vFin*(.7 + back*2.2*(1. - under))), E, form);       // crimson that keeps its shading in any light
  col += alb*uSunCol*fr*fr*(.04 + .2*back)*(1. - under);
  // a soft sheen along the lit upper flank (wet skin, not paint), and the water's own green light on every edge that turns away
  float sheen = max(dot(n, safeN(Ld + V)), 0.); sheen *= sheen; sheen *= sheen;
  col += (uSunCol*.05*sheen*sheen*(.4 + .6*smoothstep(.2, .8, rel)) + uVolC*fr*fr*.55)*body*eyeW;
  float sp = pow(max(dot(n, safeN(Ld + V)), 0.), 160.) + .6*pow(max(dot(n, safeN(V + vec3(0., 1.3, 0.) + uSun*.6)), 0.), 260.);
  col += uSunCol*sp*(.3 + .5*gloss)*(1. - vFin)*mix(1., .22, under) + uSkyCol*fr*fr*mix(.09, .03, under);   // one small wet glint
  // THE RUN'S RED, BY THE METRES OF WATER BETWEEN THE FISH AND THE EYE (one rule for every reach and both tiers; the
  // brief's 60 m of visibility): a fish keeps its own colours, the crimson plain, out to 30 m, and goes over to the
  // water's colour between 30 and 60 m (the haze of the water itself, the fog below, lies over that as over everything)
  { float wd = length(uCam - vP), wet = (1. - uAbove)*uFarK;
    col = mix(col, fogColor*mix(.3, .46, smoothstep(-.3, .5, n.y)), smoothstep(30., 60., wd)*wet); }
  // seen from the air, by the depth of water over it: the part of a body that lies within 0.4 m of the surface keeps
  // its red; below that it goes down into the water's own colour, a dark shape and not a pale one. Where a body breaks
  // the surface a thread of light lies along its waterline, so that a back that is out of the water is seen to be out
  // (and from the waterline down the body is in the water: it takes the water's own tint at once, a deeper red than the
  // back that is out in the sun, so that a fish awash is seen to lie in the river and not on it)
  col = mix(col, col*vec3(.6, .68, .64) + uVolC*.1, uAbove*smoothstep(.0, .1, depth)*.42);
  col = mix(col, col*vec3(.7, .64, .6) + uVolC*.04, uAbove*smoothstep(.4, 1.8, depth)*.85);
  col = mix(col, uVolC*.5, uAbove*smoothstep(.4, 2.2, depth)*.56);
  { float sLv = (vP.z < -.6 ? ${Ie.toFixed(1)} : 0.) - vP.y;
    col = mix(col, uSunCol*.3 + uSkyCol*.5, uAbove*(1. - smoothstep(.0, .018 + length(uCam - vP)*.0024, abs(sLv)))*.55*(step(16., vP.z) + step(vP.z, -12.))); }
  // (uGainR lifts the red of the flank alone: the dark back, the olive head and the fins stay dark)
  gl_FragColor = vec4(max(col, 0.)*uGainF*mix(1., uGainR, smoothstep(.12, .3, alb.r - max(alb.g, alb.b)))*mix(1., uBoil.w, uAbove*under), 1.);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth*uFogF));
}`,Es=`
#include <fog_pars_vertex>
${pt}
attribute vec3 aQ; attribute vec4 iA, iB, iC;
varying vec3 vQ, vP; varying float vSeed, vEnd;
void main(){
  float ph = iA.w, t = uTime, sc = iB.x;
  vec3 home = iA.xyz;
  home.x += sin(t*.23 + ph*17.)*.4*iC.w; home.y += sin(t*.37 + ph*9.)*.14*iC.w; home.z += sin(t*.29 + ph*40.)*.8*iC.w;
  if (iB.z > 0.) { float tr = mod(t*iB.z + ph*iB.w, iB.w); home.z -= tr; sc *= smoothstep(0., 6., tr)*(1. - smoothstep(iB.w - 6., iB.w, tr)); }
  float b = clamp((.45 - position.z)/1.35, 0., 1.);
  vec3 lp = position; lp.x += sin(t*iC.z + ph*30. - b*2.6)*.23*b*b + sin(t*iC.z*.5 + ph*30.)*.05*(b - .35);
  lp *= sc;
  float cy = cos(iB.y), sy = sin(iB.y), cp = cos(iC.y), sp = sin(iC.y);
  vec3 f = vec3(-sy*cp, sp, -cy*cp), r = vec3(cy, 0., -sy), u = cross(r, f);
  // seen nose-on or tail-on a fish is slight: the flat card narrows and the head's colour goes
  vEnd = smoothstep(.72, .96, abs(dot(f, safeN(uCam - home))));
  lp.x *= 1. - .62*vEnd*aQ.z;
  vec3 wp = home + r*lp.x + u*lp.y + f*lp.z;
  vQ = aQ; vP = wp; vSeed = iC.x;
  vec4 mvPosition = modelViewMatrix*vec4(wp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ns=`
#include <fog_pars_fragment>
${pt}${Cn}
uniform vec3 uRed, uOlive, uVolC, uShaftD; uniform float uAbove, uFogF, uGainF, uGainR, uFarK;
varying vec3 vQ, vP; varying float vSeed, vEnd;
void main(){
  float x = vQ.x, y = vQ.y, top = vQ.z;
  float bx = clamp((x + .68)/1.68, 0., 1.);
  // the outline of a sockeye, not an oval: a slim wrist before the tail, the back humped ahead of the dorsal fin, a
  // flatter belly, the dorsal, pelvic and anal fins standing out of it (the flat card, the fish from above, is slimmer)
  float prof0 = pow(max(sin(3.1416*pow(bx, .8)), 0.), .75)*step(-.68, x)*mix(.5, 1., smoothstep(.02, .32, bx));
  float hump = exp(-(bx - .63)*(bx - .63)*22.);
  float finT = max(1. - abs(bx - .5)/.085, 0.)*.26, finB = max(max(1. - abs(bx - .4)/.06, 0.)*.17, max(1. - abs(bx - .2)/.07, 0.)*.2);
  float bodyE = prof0*mix(y > 0. ? .76*(1. + .2*hump) : .7, .5, top);
  float prof = bodyE + mix(y > 0. ? finT : finB, 0., top)*step(.05, prof0);
  float finK = (1. - top)*smoothstep(bodyE - .02, bodyE + .03, abs(y));
  float tl = clamp((-.64 - x)/.36, 0., 1.);
  float tail = step(x, -.64)*mix(step(abs(y), .14 + .82*tl)*step(max(tl - .55, 0.)*1.3, abs(y)), step(abs(y), .16), top);
  float depth = max((vP.z < -.6 ? ${Ie.toFixed(1)} : 0.) - vP.y, 0.), under = step(.001, depth);
  float boilK = uAbove*under*(1. - smoothstep(15., 34., vP.z))*step(-.6, vP.z);
  if (max(step(abs(y), prof), tail) < .5 || boilK > .5) discard;
  vec3 base = uRed*(.78 + .4*h11(vSeed*3.))*mix(vec3(1.), vec3(1.1, .92, .84), h11(vSeed*7.));
  float eyeW = under*(1. - uAbove), headK = smoothstep(.56, .7, x);
  base = mix(base, mix(uOlive, uOlive*1.9 + vec3(.012, .024, .004), eyeW), max(headK, step(x, -.64)*.8)*(1. - .85*vEnd));
  float yy = mix(y, .75, top);                                 // the flat card shows the dark back
  // across the upright card the body is round: yn = -1 at the belly line, 1 at the back line. The flank faces the eye,
  // the back and the belly turn away from it; the belly is paler, the back dark
  float yn = clamp(y/max(bodyE, .06), -1., 1.), rnd = mix(sqrt(max(1. - yn*yn, 0.)), 1., top);
  base = mix(base, uOlive*.8, finK*.85);
  base = mix(base, base*.85 + vec3(.11, .06, .05), (1. - smoothstep(-.85, -.35, yn))*(1. - headK)*(1. - top)*.6*eyeW*step(-.64, x));
  float backK = mix(smoothstep(.12, .5, yy), smoothstep(.3, .7, mix(yn, 1., top)), eyeW)*.94;
  base = mix(base, base*.13 + vec3(.016, .018, .01), backK);
  float ca = vn(vP.xz*.9 + vec2(uTime*.5, -uTime*.35))*vn(vP.xz*1.7 - vec2(uTime*.4, uTime*.3));
  vec2 shq = vP.xz - uShaftD.xz*((vP.y - (vP.z < -.6 ? ${Ie.toFixed(1)} : 0.))/min(uShaftD.y, -.2));
  float sb = smoothstep(.6, .78, vn(shq*.4 + vec2(uTime*.05, -uTime*.09)))*eyeW;
  float form = mix(.36, 1., smoothstep(-1., .15, yy))*(1. + under*(ca*2.2 - .3)*max(yy, 0.)*.8)*mix(1., .5 + .5*rnd, eyeW)*(1. + sb*.9*smoothstep(-.3, .5, yy));
  vec3 E = (uSunCol*.3 + uSkyCol*.5 + uGndCol*.2)*mix(vec3(1.), vec3(.86, .84, .72), under*(1. - exp(-depth*.35)));
  vec3 col = salmonLit(base, E, form);
  col += uVolC*(1. - rnd)*.45*eyeW;
  // the run's red by the metres of water between the fish and the eye, the same rule as the modelled fish (FISH_FRAG):
  // its own colours out to 30 m, over to the water's colour between 30 and 60 m
  float wd = length(uCam - vP), wet = (1. - uAbove)*uFarK, farK = smoothstep(30., 60., wd)*wet;
  col = mix(col, fogColor*mix(.28, .46, smoothstep(-.6, .5, yy)*(1. - backK)), farK);
  // (and from the air by the depth of water over it, as the modelled fish)
  col = mix(col, col*vec3(.7, .64, .6) + uVolC*.04, uAbove*smoothstep(.4, 1.8, depth)*.85);
  col = mix(col, uVolC*.5, uAbove*smoothstep(.4, 2.2, depth)*.56);
  gl_FragColor = vec4(max(col, 0.)*uGainF*mix(uGainR, 1., max(backK, farK)), 1.);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth*uFogF));
}`,Tn=`
uniform float uTime, uSurfY, uLen, uRange, uWK, uShort; uniform vec2 uWd; uniform vec3 uCam, uDir, uAvoid;
attribute vec4 iS;
varying vec2 vQ; varying float vA;
void main(){
  vec2 c = mod(iS.xy - uCam.xz + uRange, 2.*uRange) - uRange;
  float edge = 1. - smoothstep(.7, 1., max(abs(c.x), abs(c.y))/uRange);
  float s = position.y*.5 + .5;
  float L = uLen*mix(uShort, 1., fract(iS.w*7.3)), wd = min(uWd.x + uWd.y*iS.z, max(.5, .25*L));
  vec3 p = vec3(uCam.x + c.x, uSurfY, uCam.z + c.y) + uDir*(L*s);
  p.x += sin(uTime*.3 + iS.w*40.)*.3*s;
  vec4 mv = viewMatrix*vec4(p, 1.);
  vec3 dv = (viewMatrix*vec4(uDir, 0.)).xyz;
  vec2 sd = vec2(-dv.y, dv.x); float sl = length(sd); sd = sl > 1e-3 ? sd/sl : vec2(1., 0.);
  mv.xy += sd*position.x*wd*(.75 + .5*s);
  vQ = vec2(position.x, s);
  float flick = .6 + .4*sin(uTime*(.5 + iS.w) + iS.w*50.)*sin(uTime*.23 + iS.w*17.);
  float fd = uWK*max(-mv.z, 0.);
  vA = edge*flick*smoothstep(1.5, 7., -mv.z)*smoothstep(.15, .5, sl)*exp(-fd*fd);
  // none on the sight line to the sitting bear, nor on the bear itself (uAvoid = its x, z and the clear radius)
  vec2 sa = uAvoid.xy - uCam.xz, sq = vec2(uCam.x + c.x, uCam.z + c.y) + uDir.xz*(uLen*.4) - uCam.xz;
  float st = clamp(dot(sq, sa)/max(dot(sa, sa), 1e-3), 0., 1.25);
  vA *= smoothstep(uAvoid.z*.55, uAvoid.z, length(sq - sa*st));
  gl_Position = projectionMatrix*mv;
}`,Pn=`
uniform vec3 uShaftCol; uniform float uGain, uThin;
varying vec2 vQ; varying float vA;
void main(){
  float across = 1. - vQ.x*vQ.x; across *= across;
  float along = smoothstep(0., .12, vQ.y)*pow(max(1. - vQ.y, 0.)/.88, uThin);
  gl_FragColor = vec4(uShaftCol*(across*along*vA*uGain), 1.);
}`,ii=`
#include <fog_pars_vertex>
uniform float uGrow;
varying vec3 vP, vN, vC, vL;
void main(){
  vec4 wp = vec4(position*uGrow, 1.); vec3 nn = normal;
  #ifdef USE_INSTANCING
    wp = instanceMatrix*wp; nn = mat3(instanceMatrix)*nn;
  #endif
  wp = modelMatrix*wp;
  vP = wp.xyz; vL = position; vN = mat3(modelMatrix)*nn; vC = color;
  #ifdef USE_INSTANCING_COLOR
    vC *= instanceColor;
  #endif
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Hs=`
#include <fog_pars_fragment>
${pt}${Bn}
uniform vec4 uGrain;        // (frequency x, y, strength, rim)
uniform float uFogK, uTone;  // how much of the water's or the air's haze it takes, and a plain gain
uniform float uAlgae;        // drowned wood: its upper sides are furred green and take the light
varying vec3 vP, vN, vC, vL;
void main(){
  vec3 V = safeN(uCam - vP), n = safeN(vN); if (dot(n, V) < 0.) n = -n;
  float g = fbm(vec2(vL.x*uGrain.x + vL.z*uGrain.x*.7, vL.y*uGrain.y + vL.z*uGrain.y*.4));
  float g2 = vn(vec2(vL.x + vL.y, vL.z - vL.y)*uGrain.x*3.1);
  vec3 alb = vC*(1. + uGrain.z*(g*1.5 + g2*.5 - 1.));
  float under; vec3 lgt = wetLight(vP, n, under);
  float up = smoothstep(.05, .75, n.y)*uAlgae*under;
  alb = mix(alb, alb*vec3(.62, .8, .42) + vec3(.01, .024, .008)*(.4 + 1.2*g), up*(.45 + .55*g2));
  vec3 col = alb*lgt*(1. + .3*up);
  // (from afar drowned wood stands dark against the lit water behind it: its own colours come up as the eye nears)
  col *= mix(1., mix(.14, 1., 1. - smoothstep(13., 36., length(uCam - vP))), uAlgae*under);
  float fr = 1. - max(dot(n, V), 0.), back = max(dot(-V, uSun), 0.);
  col += uSunCol*fr*fr*fr*uGrain.w*(.15 + back*back)*(1. - under) + uSkyCol*fr*fr*.05;
  gl_FragColor = vec4(max(col, 0.)*uTone, 1.);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth*uFogK));
}`,li=`
#include <fog_pars_vertex>
attribute vec4 aAux;
varying vec3 vP, vN, vC, vL; varying vec4 vA;
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.);
  vP = wp.xyz; vL = position; vN = mat3(modelMatrix)*normal; vC = color; vA = aAux;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,hi=`
#include <fog_pars_fragment>
${pt}${Bn}
uniform float uFogK, uBedY;
varying vec3 vP, vN, vC, vL; varying vec4 vA;
float pn(vec2 p, float per){
  vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  float x0 = mod(i.x, per), x1 = mod(i.x + 1., per);
  return mix(mix(h21(vec2(x0, i.y)), h21(vec2(x1, i.y)), f.x), mix(h21(vec2(x0, i.y + 1.)), h21(vec2(x1, i.y + 1.)), f.x), f.y);
}
void main(){
  vec3 V = safeN(uCam - vP), n = safeN(vN); if (dot(n, V) < 0.) n = -n;
  float kind = vA.w, isBark = 1. - step(.5, kind), isSoil = step(.5, kind)*(1. - step(1.5, kind)), isStone = step(1.5, kind)*(1. - step(2.5, kind)), isCut = step(2.5, kind);
  float dist = length(uCam - vP), nearK = 1. - smoothstep(9., 26., dist);
  // a limb's width in pixels (wpx): twice its radius over its distance times the angle between the rays of two
  // pixels side by side AT THE PICTURE'S MIDDLE, one angle for the whole of the picture being drawn, whatever its
  // size. pc is the fragment's place in the space of the camera that draws it; the ray to it turns, from this
  // pixel to the next across, by this pixel's own angle (the length of dFdx of the ray), which for the ray
  // through (X, Y, -1) is the middle's angle times sqrt(1 + Y*Y)/(1 + X*X + Y*Y): divided out, it is the
  // middle's. So a limb is as wide in the picture's corner as in its middle at the same distance, and turning
  // the gaze in place changes no limb's wpx.
  // From 0.6 to 1.8 pixels wide bark and broken wood are thin (1 to 0). From 0.6 down to 0.4 of a pixel a limb
  // goes out piece by piece and under that none of it is drawn: it is told off along its own length in pieces
  // six of its radii long, each piece has a number of its own from 0 to 1 (a hash of which piece it is along
  // the limb, nothing of the screen), and a piece is left out once (wpx - 0.4)/0.2 is under its number.
  vec3 pc = (viewMatrix*vec4(vP, 1.)).xyz; float dc = max(length(pc), 1e-3); vec2 xy = pc.xy/max(-pc.z, 1e-3);
  float mid = length(dFdx(pc/dc))*(1. + dot(xy, xy))/sqrt(1. + xy.y*xy.y);
  float wpx = 2.*vA.z/(dc*max(mid, 1e-6)), thin = (isBark + isCut)*(1. - smoothstep(.6, 1.8, wpx));
  if (isBark + isCut > .5 && (wpx - .4)/.2 < h21(vec2(floor(vA.y/(6.*max(vA.z, 1e-3))), 3.))) discard;
  // bark: ridges and furrows along the limb, broken into plates by cross cracks
  float big = step(.4, vA.z), per = mix(8., 22., big);
  vec2 bq = vec2(vA.x*per, vA.y*mix(.9, .5, big));
  float r1 = pn(bq, per), r2 = pn(bq*vec2(2., 2.3) + vec2(3., 7.), per*2.);
  float ridge = smoothstep(0., .55, abs(2.*r1 - 1.))*(.72 + .28*r2);
  float crack = smoothstep(.06, .2, abs(fract(vA.y*mix(1.3, .7, big) + r2*.9) - .5));
  float hBark = ridge*(.6 + .4*crack);
  // the plate: roots matted in the bed, running out from its middle, gravel caught between them
  float ay = abs(vL.y) < 1e-4 ? 1e-4 : vL.y, ang = atan(vL.z, ay), rad = length(vL.yz);
  float seam = smoothstep(2.6, 3.1, abs(ang));
  float fib = mix(vn(vec2(ang*7., rad*.9 + vL.x*1.5)), vn(vec2(rad*.9, vL.x*1.5 + 4.)), seam), fib2 = mix(vn(vec2(ang*23. + 3., rad*2.1)), vn(vec2(rad*2.1, 9.)), seam);
  float matt = smoothstep(.3, .7, fib)*.6 + smoothstep(.35, .7, fib2)*.4;
  vec2 pq = vL.yz*2.6 + vec2(vL.x*.7, 0.), ci = floor(pq), cf = fract(pq) - .5;
  float hh = h21(ci), pr = .16 + .22*h21(ci + 7.);
  float peb = (1. - smoothstep(pr - .07, pr, length((cf + (vec2(h21(ci + 3.), h21(ci + 5.)) - .5)*.5)*vec2(1., .7 + .6*h21(ci + 9.)))))*step(.7, hh);
  float hSoil = matt*.7 + peb*.9 + .4*vn(vL.yz*5.3);
  float grain = vn(vec2(vL.y*26. + vL.x*9., vL.z*26.));
  // (in the plate's earth the matted roots are the dark: 1.1 of its colour where there is no mat, 0.4 where the mat
  // is thickest; its pebbles are a pale grey)
  vec3 alb = vC*(isBark*(.4 + .9*hBark) + isSoil*(1.1 - .7*matt) + isStone*(.8 + .3*grain) + isCut*(.65 + .6*grain));
  alb = mix(alb, vec3(.4, .39, .34)*(.6 + .7*h21(ci + 11.)), isSoil*peb);
  alb *= mix(vec3(1.), vec3(1.28, .96, .7), isBark + isSoil*.6*(1. - peb));
  // relief from the same patterns (near the eye only)
  float h = (isBark*hBark*.05 + isSoil*hSoil*.09)*nearK;
  vec3 sx = dFdx(vP), sy = dFdy(vP), R1 = cross(sy, n), R2 = cross(n, sx);
  float det = dot(sx, R1);
  vec3 grad = sign(det)*(dFdx(h)*R1 + dFdy(h)*R2);
  n = safeN(abs(det)*n - clamp(grad, -1., 1.)*step(1e-9, abs(det)));
  float under; vec3 lgt = wetLight(vP, n, under);
  // algae on every upper side, in streaks down the current
  float up = smoothstep(-.05, .7, n.y), st = vn(vec2(vP.x*2.9 + vP.y*2.1, vP.z*.4)), fz = vn(vP.xz*8. + vP.y*3.);
  float alg = up*smoothstep(.3, .72, st)*(1. - .8*isCut);
  alb = mix(alb, vec3(.05, .058, .026)*(.6 + 1.1*fz)*(.7 + .5*hBark*isBark + .3*(1. - isBark)), alg*.5);
  // the undersides: the pale bed's light from below, and the water's own light from every side
  vec3 bounce = (uSunCol*.2 + uSkyCol*.34)*vec3(.56, .6, .36)*(.5 - .5*n.y)*(.7 + .6*(1. - smoothstep(0., 7., vP.y - uBedY)));
  // (the sun's and the sky's light on it falls to 0.16 of itself from 30 to 45 m from the eye; the bed's light from
  // below and the water's own light do not)
  vec3 col = alb*(lgt*(1. + .15*alg)*mix(.16, 1., 1. - smoothstep(30., 45., dist)) + bounce + fogColor*.3*under);
  float fr = 1. - max(dot(n, V), 0.);
  col += fogColor*fr*fr*.06*under;
  gl_FragColor = vec4(max(col, 0.), 1.);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth*uFogK));
  // (by thin a limb goes up to 0.8 of the way to the fog's colour)
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, thin*.8);
}`,ci=`
#include <fog_pars_vertex>
uniform float uTime; uniform vec4 uGait;
attribute vec4 aAux;
varying vec3 vP, vN, vC, vL;
void rotYZ(inout vec3 p, inout vec3 n, vec2 piv, float a){
  float c = cos(a), s = sin(a); vec2 d = p.yz - piv;
  p.yz = piv + vec2(d.x*c - d.y*s, d.x*s + d.y*c); n.yz = vec2(n.y*c - n.z*s, n.y*s + n.z*c);
}
void main(){
  vec3 p = position, nn = normal;
  float ph = 6.2832*(uGait.x + aAux.x), lw = smoothstep(0., .3, aAux.y);
  // legs: forward and back from the joint, the lower leg folding a little as it comes forward
  float pz = position.z > -.3 ? .8 : -1.45;
  rotYZ(p, nn, vec2(2.05, pz), -uGait.y*sin(ph)*lw);
  float fold = max(cos(ph), 0.)*uGait.y*aAux.y*aAux.y;
  p.y += fold*.75; p.z -= fold*.5*smoothstep(.5, 1., aAux.y);
  // the back rides the stride twice a cycle, and breathes
  float body = 1. - lw;
  p.y += body*(uGait.y*.16*sin(12.566*uGait.x) + .012*sin(uTime*1.9));
  // head and neck: turn (yaw) and nod (pitch) about the base of the neck
  float hw = aAux.z;
  { float a = uGait.z*hw, c = cos(a), sn = sin(a); vec2 d = p.xz - vec2(0., 1.3);
    p.xz = vec2(0., 1.3) + vec2(d.x*c + d.y*sn, -d.x*sn + d.y*c); nn.xz = vec2(nn.x*c + nn.z*sn, -nn.x*sn + nn.z*c); }
  rotYZ(p, nn, vec2(2.3, 1.3), -uGait.w*hw);
  // tail
  p.x += aAux.w*(sin(uTime*1.3)*.1 + sin(6.2832*uGait.x)*uGait.y*.6)*(2.3 - position.y);
  vec4 wp = modelMatrix*vec4(p, 1.);
  vP = wp.xyz; vL = position; vN = mat3(modelMatrix)*nn; vC = color;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Us=`
#include <fog_pars_vertex>
uniform float uTime, uPx; uniform vec3 uCam;
attribute vec4 aL;
varying float vT;
void main(){
  vec3 p = position;
  float sw = aL.x*aL.x;
  p.x += sin(uTime*1.1 + aL.z*6.3 + p.y*.4)*.45*sw + sin(uTime*.37 + aL.z*11.)*.3*sw;
  p.z += cos(uTime*.83 + aL.z*9.)*.3*sw;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  float w = max(aL.w*(1. - .75*aL.x), -mvPosition.z*uPx*1.6);
  mvPosition.x += aL.y*w*.5;
  vT = aL.x;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ws=`
#include <fog_pars_fragment>
uniform vec3 uSunCol, uSkyCol, uTint;
varying float vT;
void main(){
  gl_FragColor = vec4(uTint*(uSunCol*.22 + uSkyCol*.55)*(1.1 - .5*vT), 1.);
  #include <fog_fragment>
}`,ui=`
#include <fog_pars_vertex>
${pt}
uniform float uGo, uSize;
attribute vec4 aAux, iA, iB;      // iB = (wing phase 0..1, beats a second x 6.28, how high it has lifted off, the second it lifts)
varying vec3 vP, vN, vC;
void main(){
  float ph = iA.z, s = max(uGo - ph*1.1, 0.), go = smoothstep(0., .25, s);
  vec3 lp = position;
  float a = mix(-1.25, (sin(uTime*iB.y + iB.x*6.2832 - aAux.y*1.1)*1.02 + .1)*(1. + .4*aAux.y), go)*aAux.x;
  if (abs(aAux.x) > .5) { float c = cos(a), sn = sin(a); vec2 d = lp.xy - vec2(.22*aAux.x, .3); d = vec2(d.x*c - d.y*sn, d.x*sn + d.y*c); lp.xy = d + vec2(.22*aAux.x, .3); }
  float dive = smoothstep(0., .6, sin(uTime*.35 + ph*31.) - .82)*(1. - go);
  float pitch = -dive*1.1 + go*.22, cpi = cos(pitch), spi = sin(pitch);
  lp.yz = vec2(lp.y*cpi + lp.z*spi, -lp.y*spi + lp.z*cpi);
  float run = 2.5*s + 3.2*s*s*.5; run = min(run, 2.5*s + 60.);
  float h = iA.w, ch = cos(h), sh = sin(h);
  vec3 f = vec3(sh, 0., ch), r = vec3(ch, 0., -sh);
  vec3 base = vec3(iA.x, ${Ie.toFixed(1)} + .02 + sin(uTime*1.3 + ph*9.)*.04 - dive*1.6 + go*.25 + min(s*.22, 1.4)*go + iB.z*smoothstep(iB.w, iB.w + 1.1, s), iA.y) + f*run;
  base.x += sin(uTime*.2 + ph*5.)*.6*(1. - go);
  vec3 wp = base + (r*lp.x + vec3(0., lp.y, 0.) + f*lp.z)*uSize;
  vN = safeN(r*normal.x + vec3(0., normal.y, 0.) + f*normal.z); vP = wp; vC = color;
  vec4 mvPosition = modelViewMatrix*vec4(wp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fi=`
#include <fog_pars_fragment>
${pt}
varying vec3 vP, vN, vC;
void main(){
  if (uCam.y > ${Ie.toFixed(1)} && vP.y < ${Ie.toFixed(1)} - .05) discard;
  vec3 V = safeN(uCam - vP), n = safeN(vN); if (dot(n, V) < 0.) n = -n;
  vec3 col = vC*(uSunCol*max(dot(n, uSun)*.7 + .3, 0.)*.75 + hemi(n)*.9);
  float fr = 1. - max(dot(n, V), 0.);
  col += uSkyCol*fr*fr*.12;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,di=`
#include <fog_pars_vertex>
${pt}
attribute vec4 aAux, iA, iB;
varying vec3 vP, vN, vC;
void main(){
  float ph = iB.x, s = mod(uTime + ph*iB.y, iB.y);
  float flare = max(smoothstep(0., .18, s)*(1. - smoothstep(1.7, 2.3, s)), iB.w);
  float peck = smoothstep(.5, .9, sin(uTime*1.7 + ph*40.))*(1. - flare);
  vec3 lp = position, ln = normal;
  { float a = (peck*.95 - flare*.25)*aAux.z, c = cos(a), sn = sin(a); vec2 d = lp.yz - vec2(.55, .3); lp.yz = vec2(d.x*c - d.y*sn, d.x*sn + d.y*c) + vec2(.55, .3); ln.yz = vec2(ln.y*c - ln.z*sn, ln.y*sn + ln.z*c); }
  float wing = step(.5, abs(aAux.x));
  vec3 piv = vec3(.2*aAux.x, .7, .16);
  // the spread wing beats from the shoulder, the outer half lagging; the folded one lies still
  float beat = sin(uTime*13. + ph*20. - aAux.y*1.1)*mix(.42, .62, iB.w) + mix(.5, .3, iB.w);
  float a = beat*aAux.x*aAux.w, c = cos(a), sn = sin(a);
  vec3 d = (lp - piv)*mix(1. - flare, flare, aAux.w);
  d.xy = vec2(d.x*c - d.y*sn, d.x*sn + d.y*c); ln.xy = mix(ln.xy, vec2(ln.x*c - ln.y*sn, ln.x*sn + ln.y*c), wing);
  lp = mix(lp, piv + d, wing);
  lp *= iB.z;
  float h = iA.w + sin(uTime*.4 + ph*9.)*.3, ch = cos(h), sh = sin(h);
  vec3 f = vec3(sh, 0., ch), r = vec3(ch, 0., -sh);
  vec3 wp = iA.xyz + vec3(0., mix(flare*abs(sin(s*7.))*.5, .28*sin(uTime*2.1 + ph*13.), iB.w), 0.) + f*(flare*.45*(1. - iB.w) + lp.z) + r*lp.x + vec3(0., lp.y, 0.);
  wp.x += iB.w*.35*sin(uTime*.9 + ph*21.);
  vN = safeN(r*ln.x + vec3(0., ln.y, 0.) + f*ln.z); vP = wp; vC = color;
  vec4 mvPosition = modelViewMatrix*vec4(wp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,mi=`
#include <fog_pars_fragment>
${pt}
varying vec3 vP, vN, vC;
void main(){
  vec3 V = safeN(uCam - vP), n = safeN(vN); if (dot(n, V) < 0.) n = -n;
  // a white bird in shade is grey, not blue: the fill is the sky's with most of its colour taken out, and the gravel throws light up
  vec3 hm = hemi(n), fill = mix(hm, vec3(dot(hm, vec3(.3, .5, .2)))*vec3(1.03, 1., .95), .62);
  float ndl = dot(n, uSun);
  vec3 col = vC*(uSunCol*(max(ndl*.62 + .38, 0.)*.6) + fill*1.45 + uGndCol*(.5 - .5*n.y)*.9);
  float fr = 1. - max(dot(n, V), 0.);
  col += uSkyCol*fr*fr*.05;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,pi=`
uniform float uT, uVH;
attribute vec4 iP, iV;
varying vec2 vQ; varying float vA, vBig;
void main(){
  float s = uT - iP.w, life = .55 + iV.w*9.;
  float a = step(0., s)*step(s, life);
  vec3 pos = iP.xyz + iV.xyz*s - vec3(0., 11.*s*s, 0.);
  vec3 vel = iV.xyz - vec3(0., 22.*s, 0.);
  vec4 mv = modelViewMatrix*vec4(pos, 1.);
  vec3 vv = (modelViewMatrix*vec4(vel, 0.)).xyz; float sp = length(vv.xy);
  vec2 dir = sp > 1e-3 ? vv.xy/sp : vec2(0., 1.);
  float px = 2.*max(-mv.z, .1)/(projectionMatrix[1][1]*uVH);
  float size = max(iV.w*(1. - .35*s/life), px*.62)*a;
  mv.xy += (dir*position.y*(1. + min(sp*.22, 4.2)) + vec2(dir.y, -dir.x)*position.x)*size;
  vQ = position.xy; vA = a*(1. - smoothstep(.6, 1., s/life)); vBig = smoothstep(.03, .046, iV.w);
  gl_Position = projectionMatrix*mv;
}`,vi=`
uniform vec3 uSunCol, uSkyCol;
varying vec2 vQ; varying float vA, vBig;
void main(){
  float d = dot(vQ, vQ); if (d > 1.) discard;
  float core = 1. - smoothstep(0., .6, d), body = 1. - smoothstep(.5, 1., d);
  vec3 col = mix(uSkyCol*.3, uSunCol*(.26 + .5*vBig) + uSkyCol*.45, core);
  gl_FragColor = vec4(col*body*vA, body*vA*(.35 + .55*core));
}`,Is=`
#include <fog_pars_vertex>
uniform float uT, uVH, uFloor;
attribute vec4 iP, iV;
varying vec2 vQ; varying float vA;
void main(){
  float s = uT - iP.w, life = 1.6 + min(iV.w, .7)*4.;
  float a = step(0., s)*step(s, life);
  vec3 pos = iP.xyz + iV.xyz*s - vec3(0., 11.*s*s, 0.);
  vec4 mvPosition = modelViewMatrix*vec4(pos, 1.);
  float px = 2.*max(-mvPosition.z, .1)/(projectionMatrix[1][1]*uVH);
  float size = max(iV.w*(1. + s*1.5), px*1.2)*a;
  mvPosition.xy += position.xy*size;
  vQ = position.xy; vA = a*(1. - s/life)*smoothstep(uFloor, uFloor + .7, pos.y)*mix(1., .5, smoothstep(.7, 1.2, iV.w));
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,js=`
uniform vec3 uSunCol, uSkyCol; uniform float uWhiteK;
varying vec2 vQ; varying float vA;
void main(){
  float d = dot(vQ, vQ); if (d > 1.) discard;
  float k = 1. - smoothstep(.1, 1., d);
  // (uWhiteK 1: white water thrown up, lit; 0: the ducks' drops, which thin to grey as they fade)
  gl_FragColor = vec4((uSunCol*.34 + uSkyCol*.5)*mix(k*vA*.9, .8 + .14*k, uWhiteK), k*vA*mix(.75, .9, uWhiteK));
}`,gi=`
varying vec2 vUv;
void main(){ vUv = position.xy; gl_Position = vec4(position.xy, 0., 1.); }`,wi=`
${pt}
uniform vec2 uVeil;      // (how far the sheet has come down over the lens 0..1, its strength 0..1)
uniform vec3 uWhite;
varying vec2 vUv;
// a strand of the veil, by the rule of the ledge's own falling sheet (parts, sheetMaterial, strand, with its k at 1). xc =
// the place across the frame in strand widths, tc = the fall clock, sd = a seed. Every strand (one to a width) has a
// clock of its own (23 times its own draw, plus tc at .8 to 1.2 of its pace) and is a file of surges, one to each whole
// number of its clock: a surge's water is its own draw times .75 where its clock's fraction is 0, rising to 1.25 as the
// fraction rises, and over the last .45 of the fraction it goes over to .75 of the next surge's draw. Across a width
// the water goes from one strand's to the next's. Returns .5 + that water - .451.
float veilStrand(float xc, float tc, float sd){
  float i = floor(xc), f = fract(xc), w = f*f*(3. - 2.*f);
  vec2 hh = vec2(h11(i*.731 + sd), h11((i + 1.)*.731 + sd)), ph = hh*23. + tc*(.8 + .4*fract(hh*7.3));
  vec2 j = floor(ph), g = fract(ph), e = smoothstep(.55, 1., g);
  float a = mix(h21(vec2(i, j.x) + sd)*(.75 + .5*g.x), h21(vec2(i, j.x + 1.) + sd)*.75, e.x);
  float b = mix(h21(vec2(i + 1., j.y) + sd)*(.75 + .5*g.y), h21(vec2(i + 1., j.y + 1.) + sd)*.75, e.y);
  return .5 + mix(a, b, w) - .451;
}
void main(){
  // three sizes of strand, 17, 43 and 5 to half the frame's width. Their fall clocks do not change on places that come
  // down the frame at 5.3/4, 7/9 and 3.1/1.6 of half its height a second, and at a place fall by 1 in .75 s, .56 s
  // and .75 s (the times the sheet's surges take to pass its lip, parts, sheetMaterial); they rise towards the frame's foot
  float f2 = veilStrand(vUv.x*17., -(vUv.y*4. + uTime*5.3)/(5.3*.75), 11.), f3 = veilStrand(vUv.x*43., -(vUv.y*9. + uTime*7.)/(7.*.56), 19.);
  float f1 = veilStrand(vUv.x*5., -(vUv.y*1.6 + uTime*3.1)/(3.1*.75), 3.);
  float fib = f1*.4 + f2*.36 + f3*.24;
  vec3 col = uWhite*(uSunCol*.2 + uSkyCol*.42 + .03)*mix(vec3(.55, .72, .78), vec3(1.), smoothstep(.3, .65, fib));
  // it comes down over the frame from the top, its lower edge a fringe of fibres (never a pane with an edge)
  float cover = smoothstep(-.3, .4, vUv.y - 1.35 + 2.7*uVeil.x + (fib - .5)*1.5);
  float a = uVeil.y*cover*(.6 + .4*smoothstep(.25, .7, fib));
  gl_FragColor = vec4(col, clamp(a, 0., .94));
}`,yi=`
varying vec3 vRay;
void main(){
  gl_Position = vec4(position.xy, 0., 1.);
  vec4 v = inverse(projectionMatrix)*vec4(position.xy, -1., 1.);
  vRay = transpose(mat3(viewMatrix))*(v.xyz/v.w);
}`,bi=`
${pt}
uniform float uSurfH, uNearD, uGoldAmt; uniform vec3 uVol, uSkyHor, uSkyAir, uSunAir, uHorizon, uGold, uSpruceRef, uGoldRef;
varying vec3 vRay;
// one rank of the forest's wall: a tree in most of N cells round the horizon, each its own height under top (the sine
// of the wall's height at this bearing); k = 1 a spruce's cone with its boughs, k = 0 a birch's round crown
float rank(float ax, float el, float N, float seed, float top, float k){
  float sp = ax*N, si = floor(sp), sf = abs(fract(sp) - .5)*2.;
  float hs = top*(.55 + .45*h11(si*1.7 + seed))*step(.2, h11(si*.61 + seed*2.3));
  float cone = hs*(1. - sf*(1.02 + .09*sin(el*150. + si*2.1)));
  float crown = hs*sqrt(max(1. - sf*sf*1.1, 0.))*(.92 + .08*sin(sf*17. + si));
  return 1. - smoothstep(-.012, .012, el - mix(crown, cone, k));
}
void main(){
  vec3 d = safeN(vRay); float h = uSurfH - cameraPosition.y;
  float t = h/(abs(d.y) > 1e-4 ? d.y : 1e-4);
  // (glass: the line barely moves)
  t *= 1. + .02*sin(d.x*23. + uTime*4.)*sin(d.z*31. - uTime*3.);
  float reach = uNearD*1.45;
  if (t <= 0. || t > reach*1.25) discard;
  float w = clamp(fwidth(t)*1.5, 1e-4, reach*.2);
  float beyond = 1. - smoothstep(reach - w, reach + w, t);
  float line = 1. - smoothstep(w*.5, w*2., abs(t - reach));
  vec3 col; float a;
  if (h < 0.) {
    // the eye in the air: below the line the lens is in the water
    col = uVol*1.15;
    a = beyond*mix(.7, .46, smoothstep(0., reach*.8, reach - t));
  } else {
    // the eye in the water: above the line the lens is in the air
    float el = clamp(d.y, 0., 1.);
    vec2 hz = d.xz/max(length(d.xz), 1e-4);
    float side = abs(hz.x), ax = atan(hz.x, hz.y + 1e-5)/6.2832 + .5;
    float top = .1 + .72*side*side;
    float tex = vn(vec2(ax*900., el*60.));
    float spruce = max(rank(ax, el, 44., 3., top, 1.), rank(ax + .013, el, 29., 8., top*.82, 1.));
    float birch = max(rank(ax + .007, el, 37., 5., top*.6, 0.), rank(ax + .021, el, 23., 11., top*.48, 0.));
    float wall = 1. - smoothstep(-.02, .02, el - top*.3*(.75 + .5*vn(vec2(ax*80., 2.))));
    vec3 sky = mix(uSkyHor*1.15, uSkyAir*1.35, smoothstep(0., .55, el));
    // (the spruce and the birch in the colours the world makes for its own trees in this look, uSpruceRef and uGoldRef,
    // with the grain the water's mirror gives the same two colours, .7 to 1.3)
    vec3 gold = uGoldRef*(.7 + .6*tex);
    vec3 forest = mix(uSpruceRef*(.7 + .6*tex), mix(uSpruceRef*(.7 + .6*tex), gold, uGoldAmt), birch*(1. - spruce*.6));
    // (the air between: the far wall up and down the river is paler than the near wall along the banks)
    forest = mix(forest, uSkyHor*.9, (1. - side)*.3);
    col = mix(sky, forest, max(max(spruce, birch), wall));
    a = beyond*.94;
  }
  col = mix(col, uSkyHor*1.1 + uSunAir*.22, line);
  gl_FragColor = vec4(col, max(a, line*.95));
}`,xi=`
#include <fog_pars_vertex>
uniform float uTime; uniform vec3 uCam;
attribute vec4 iP, iQ;
varying vec2 vQ; varying vec3 vK;
varying vec3 vW;       // the place of this point of the strip in the world
void main(){
  float y = position.y, sd = iP.w;
  vec3 c = vec3(iP.x, mix(iQ.x, iQ.y, y), iP.y);
  c.x += sin(y*3.1 + uTime*.7 + sd*9.)*.22*y + sin(y*7. - uTime*1.3 + sd*4.)*.07;
  c.z += cos(y*2.3 + uTime*.5 + sd*5.)*.3*y;
  vec2 to = uCam.xz - c.xz; float tl = max(length(to), 1e-3); to /= tl;
  vec3 wp = c + vec3(-to.y, 0., to.x)*(position.x*iP.z*2.3);
  vQ = position.xy; vK = vec3(sd, iQ.z, iP.z);
  vW = wp;
  vec4 mvPosition = modelViewMatrix*vec4(wp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ki=`
#include <fog_pars_fragment>
${pt}
uniform vec3 uWhite; uniform float uShow;
varying vec2 vQ; varying vec3 vK;
varying vec3 vW;
// the bubbles of one size: p = the place in cells of that size, sd = a seed. A cell holds one bubble, of its own radius
// (.1 to .32 of the cell, more of them small than large) and at its own place in the cell, wholly inside it; the cells
// whose own draw is under fill hold one (by stages, over .1 either side of fill). e = half the breadth of a pixel in
// cells: the disc's edge is softened over a pixel. Returns (the disc, the disc's rim: nothing over the inner half of
// its radius, rising from there to the edge)
vec2 colmBub(vec2 p, float sd, float fill, float e){
  vec2 i = floor(p), q = fract(p) - .5;
  float rh = h21(i + sd), r = .1 + .22*rh*rh, on = smoothstep(-.1, .1, fill - h21(i + sd + 7.3));
  q -= (vec2(h21(i + sd + 3.1), h21(i + sd + 5.7)) - .5)*(1. - 2.*r);
  float d = length(q), disc = 1. - smoothstep(r - e, r + e, d);
  return vec2(disc, disc*smoothstep(r*.5, r, d))*on;
}
void main(){
  float x = vQ.x*2.3, y = vQ.y, sd = vK.x, t = uTime;
  // the outline: flared where it leaves the ceiling, slimmer with depth, its two edges wandering on their own
  float w = mix(1., .62, smoothstep(.05, .8, y)) + .5*(1. - smoothstep(0., .16, y));
  float e1 = (vn(vec2(sd*9. + y*3.3 - t*.5, 2.)) - .5)*.95, e2 = (vn(vec2(sd*5. + y*3.9 - t*.6, 7.)) - .5)*.95;
  float fine = (vn(vec2(sd*3. + x*3., y*13. - t*3.2)) - .5)*.26;
  float ax = (x > 0. ? x + e1 : -x + e2)/w + fine;
  float core = 1. - smoothstep(.5, 1., ax);
  // fibres that run down, parting to let the dark through
  float f1 = vn(vec2(x*6. + sd*13., y*2.4 - t*2.7)), f2 = vn(vec2(x*17. + sd*7., y*5.5 - t*4.6)), fib = f1*.56 + f2*.44;
  // the foot: it thins from two thirds of the way down and breaks into single bubbles
  float foot = 1. - smoothstep(.6, 1., y + (vn(vec2(sd*3. + x*1.5, t*.8)) - .5)*.34);
  float beads = smoothstep(.36, .74, vn(vec2(x*5. + sd, y*9. + t*2.6))*.62 + vn(vec2(x*11. + sd*3., y*21. + t*3.4))*.38);
  foot *= mix(1., beads, smoothstep(.56, .9, y));
  float a = core*(.62 + .38*smoothstep(.24, .62, fib))*foot;
  // and round it a loose sleeve of fine bubbles
  float sleeve = (1. - smoothstep(.75, 1.65, ax))*smoothstep(.5, .86, vn(vec2(x*6. + sd*3., y*13. + t*1.9))*.6 + vn(vec2(x*13., y*27. + t*2.7))*.4)*(1. - .7*y);
  a = max(a, sleeve*.5);
  vec3 col = uWhite*(uSunCol*.3 + uSkyCol*.5)*vec3(.8, 1., .92)*(.6 + .8*fib)*(1.1 - .4*y)*1.34;
  col = mix(col*vec3(.62, .86, .76), col, smoothstep(.0, .5, core));           // green where it thins at the edges
  float fogK = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  // (its sides thin away into the water before the strip ends: a veil, never a block with an edge)
  a *= 1. - smoothstep(.62, 1., abs(vQ.x));
  // NEAR THE EYE A COLUMN IS CLOUDS OF BUBBLES. By the true distance from the eye to this point of the strip, with no
  // step: beyond 26 m the strength and the colour are the lines above; from 26 m in they go over, wholly by 12 m, to
  // the lines below (12 and 26 m: the distances between which the ledge's froth skirt comes into sight, parts,
  // bubbleMaterial). px = the height of the world one pixel spans here (the sum of its change across and down the
  // frame), and no less than .00001
  float dist = length(uCam - vW), nearK = 1. - smoothstep(12., 26., dist), px = max(fwidth(vW.y), 1e-5);
  if (nearK > 0.) {
    // wd = iP.z, no less than .05. m = this point in metres (across from the strip's middle, the world's height); uq =
    // the same with the height in wd's (across, x is already so). Two fields of uq, both turned by 37 degrees: qs, which
    // sinks half a wd a second, and qr, which rises .32 of a wd a second; up = .28 of a wd upward, in the fields
    float wd = max(vK.z, .05);
    vec2 m = vec2(x*wd, vW.y), uq = vec2(x, vW.y/wd);
    mat2 R = mat2(.8, .6, -.6, .8);
    vec2 qs = R*(uq + vec2(0., t*.5)), qr = R*(uq - vec2(0., t*.32)), up = R*vec2(0., .28);
    // q = the place across as the outline above measures it, without its fine grain, except that the wander added to
    // it goes over from e2 (the outline's where x is under 0) to e1 (the outline's where x is over 0) between x -.35
    // and x .35, so that q has no jump at the strip's middle; rimK = 0 where q is under .3, 1 where over 1
    float q = (abs(x) + mix(e2, e1, smoothstep(-.35, .35, x)))/w, rimK = smoothstep(.3, 1., q);
    // (each field is shifted each way by a noise of its own: qs by up to .35, qr by up to .3)
    qs += (vec2(vn(qs*.6 + sd*3.), vn(qs*.6 + sd*3. + 19.)) - .5)*.7; qr += (vec2(vn(qr*.8 + sd*7.), vn(qr*.8 + sd*7. + 13.)) - .5)*.6;
    // the cloud: three sizes of noise (shares .5, .32, .18), read in the sinking field where rimK is 0 and in the rising
    // one where it is 1; cUp = its two larger sizes (shares .6, .4) read the step up higher; lit = 0 where the cloud is
    // .22 under cUp, 1 where it is .22 over it
    float cIn = vn(qs*1.15 + sd*17.)*.5 + vn(qs*3. + sd*5. + 7.)*.32 + vn(qs*7.3 + 11.)*.18, cOut = vn(qr*1.5 + sd*23.)*.5 + vn(qr*3.6 + 3.)*.32 + vn(qr*8.1 + 5.)*.18;
    float cloud = mix(cIn, cOut, rimK), cUp = mix(vn((qs + up)*1.15 + sd*17.)*.6 + vn((qs + up)*3. + sd*5. + 7.)*.4, vn((qr + up)*1.5 + sd*23.)*.6 + vn((qr + up)*3.6 + 3.)*.4, rimK);
    float lit = smoothstep(-.22, .22, cloud - cUp);
    // its body: whole where q less 1.5 times what the cloud lacks of .5 is under .45, none where that is over 1.4;
    // a quarter of that where the cloud is under .38, the whole of it where over .62 (lump); it thins out from .6 of
    // the strip's height down to its end, the cloud moving that by up to a quarter of the height either way, and what
    // is then left of it fades out over the last fifth of the strip's height, to nothing at the strip's end; and it
    // has no strength at the height where the lower river's surface is laid over the boil (ceilY: the rule of the
    // surface's own mesh, the river's level being 0) or above it, and its whole strength .14 to .7 of a wd under it
    // (by the cloud)
    float dens = 1. - smoothstep(.45, 1.4, q + (cloud - .5)*1.5);
    float ceilY = -.78*exp(-max(vW.z, 0.)/6.5)*smoothstep(-.6, 1.5, vW.z);
    float topK = smoothstep(0., 1., (ceilY - vW.y)/((.14 + .56*cloud)*wd));
    float footN = (1. - smoothstep(.6, 1., y + (cloud - .5)*.5))*(1. - smoothstep(.8, 1., y));
    float lump = smoothstep(.38, .62, cloud), body = dens*(.25 + .75*lump)*footN*topK;
    // bubbles of three sizes, in cells of .05, .1 and .19 m: the smallest sink .6 m a second, the others rise .3 and
    // .5 m a second. The two smaller fill .8 and .55 of their cells where q plus .8 of the cloud's excess over .5 is
    // under .5; where that is over 1.9 their fill is 0 (densW), and then only the cells whose own draw is under .1 hold
    // a bubble, at half its strength or less (colmBub's stages). The largest fill .3 of theirs where q plus .6 of that
    // excess is under .8, and their fill is 0, in the same way, where it is over 2.2. A size fades out as a pixel grows
    // from .22 to .5 of its cell. The two smaller
    // are drawn as discs (.6 and .75), the largest as a rim (.85) on a faint disc (.3); all take the body's rule at
    // the surface (topK) and fade out over the last fifth of the strip's height
    float densW = 1. - smoothstep(.5, 1.9, q + (cloud - .5)*.8);
    vec2 b1 = colmBub((m + vec2(0., t*.6))/.05, sd, .8*densW, .5*px/.05)*(1. - smoothstep(.22, .5, px/.05));
    vec2 b2 = colmBub((m - vec2(0., t*.3))/.1 + 31., sd, .55*densW, .5*px/.1)*(1. - smoothstep(.22, .5, px/.1));
    vec2 b3 = colmBub((m - vec2(0., t*.5))/.19 + 67., sd, .3*(1. - smoothstep(.8, 2.2, q + (cloud - .5)*.6)), .5*px/.19)*(1. - smoothstep(.22, .5, px/.19));
    float bubs = max(max(b1.x*.6, b2.x*.75), b3.y*.85 + b3.x*.3)*topK*(1. - smoothstep(.8, 1., y));
    // the strength: the body's (.92 of it) or a bubble's, whichever is more, thinning to the strip's sides as above
    float aN = max(body*.92, bubs)*(1. - smoothstep(.62, 1., abs(vQ.x)));
    // the colour: the white above without its fibres, at .4 to 1.2 of it by lit and lump; greener where the body is
    // under .6, wholly so where under .1 (the green of the column's edges above); a bubble takes it .8 of its own
    // strength of the way to 1.25 of the white
    vec3 wht = uWhite*(uSunCol*.3 + uSkyCol*.5)*vec3(.8, 1., .92)*(1.1 - .4*y)*1.34;
    vec3 colN = wht*(.4 + .55*lit + .25*lump);
    colN = mix(colN*vec3(.62, .86, .76), colN, smoothstep(.1, .6, body));
    colN = mix(colN, wht*1.25, bubs*.8);
    a = mix(a, aN, nearK); col = mix(col, colN, nearK);
  }
  gl_FragColor = vec4(mix(col, fogColor, fogK*.5), clamp(a*vK.y*uShow, 0., .96));
}`,Mi=`
#include <fog_pars_vertex>
uniform float uTime, uVH, uTop, uKind; uniform vec2 uGo;
attribute vec4 iP, iV; attribute vec4 iL;
varying vec2 vQ; varying float vA;
void main(){
  float life = iL.x, s = fract(uTime/life + iP.w)*life, k = s/life;
  vec3 pos = iP.xyz + iV.xyz*s;
  pos.x += sin(s*3.1 + iP.w*40.)*iL.y; pos.z += cos(s*2.3 + iP.w*23.)*iL.y;
  pos.xz += iV.xz/max(length(iV.xz), 1e-3)*iL.w*sqrt(k);
  vec4 mvPosition = modelViewMatrix*vec4(pos, 1.);
  float px = 2.*max(-mvPosition.z, .1)/(projectionMatrix[1][1]*uVH);
  float size = max(iV.w*(1. + iL.z*2.5*k), px*1.3);
  mvPosition.xy += position.xy*size;
  vQ = position.xy;
  vA = smoothstep(0., .12, k)*(1. - smoothstep(.7, 1., k))*(1. - smoothstep(uTop - .25, uTop, pos.y))*smoothstep(.5, 2., -mvPosition.z)*uGo.x;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ai=`
#include <fog_pars_fragment>
uniform vec3 uSunCol, uSkyCol, uTint; uniform float uKind;
varying vec2 vQ; varying float vA;
void main(){
  float d = length(vQ); if (d > 1.) discard;
  float rim = smoothstep(.55, .86, d)*(1. - smoothstep(.9, 1., d)), glint = 1. - smoothstep(0., .2, length(vQ - vec2(-.35, .4)));
  float a = mix(rim*.8 + glint*.9 + .26, (1. - d*d)*.52, uKind);
  vec3 col = uTint*(uSunCol*.3 + uSkyCol*.55)*mix(1.2, .6, uKind);
  float fogK = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  gl_FragColor = vec4(mix(col, fogColor, fogK*.6), a*vA);
}`,zi=`
#include <fog_pars_vertex>
uniform float uTime, uVH, uSurf;
attribute vec4 iP, iV;
varying vec2 vQ; varying float vA, vLeaf, vPh;
void main(){
  vec2 p = vec2(iP.x + sin(uTime*.4 + iP.w*40.)*.35, iP.z + uTime*iV.x);
  vec2 c = mod(p - cameraPosition.xz + 13., 26.) - 13.;
  float edge = 1. - smoothstep(9., 13., max(abs(c.x), abs(c.y)));
  vec3 w = vec3(cameraPosition.x + c.x, uSurf - .3 - iP.y*5. + sin(uTime*.7 + iP.w*23.)*.15, cameraPosition.z + c.y);
  vec4 mvPosition = viewMatrix*vec4(w, 1.);
  float px = 2.*max(-mvPosition.z, .1)/(projectionMatrix[1][1]*uVH);
  float size = max(iV.y, px*1.1);
  float a = uTime*iV.w + iP.w*60., ca = cos(a), sa = sin(a);
  vec2 q = position.xy; q.x *= mix(1., .3 + .7*abs(sin(a*.7)), iV.z); q.y *= mix(1., .62, iV.z);
  mvPosition.xy += vec2(q.x*ca - q.y*sa, q.x*sa + q.y*ca)*size;
  vQ = position.xy; vLeaf = iV.z; vPh = iP.w;
  vA = edge*smoothstep(.7, 2.4, -mvPosition.z);
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Si=`
#include <fog_pars_fragment>
uniform vec3 uSunCol, uSkyCol;
varying vec2 vQ; varying float vA, vLeaf, vPh;
void main(){
  float d = length(vQ); if (d > 1.) discard;
  vec3 leaf = mix(vec3(.5, .37, .09), vec3(.36, .2, .06), fract(vPh*7.)), silt = vec3(.6, .64, .5);
  vec3 col = mix(silt, leaf*(.75 + .5*smoothstep(-.2, .2, vQ.y)), vLeaf)*(uSunCol*.45 + uSkyCol*.6);
  float a = mix((1. - d*d)*.42, 1. - smoothstep(.82, 1., d), vLeaf);
  float fogK = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  gl_FragColor = vec4(mix(col, fogColor, fogK*.7), a*vA);
}`,Ci=`
#include <fog_pars_vertex>
varying vec3 vN, vP;
void main(){
  vec4 wp = instanceMatrix*vec4(position, 1.);
  vN = normal; vP = wp.xyz;
  vec4 mvPosition = viewMatrix*wp;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Fi=`
#include <fog_pars_fragment>
${pt}${Bn}
uniform float uEgg;
varying vec3 vN, vP;
void main(){
  vec3 n = safeN(vN), V = safeN(uCam - vP);
  float under; vec3 lit = wetLight(vP, n, under);
  float fr = 1. - max(dot(n, V), 0.);
  vec3 col = vec3(.84, .43, .3)*lit*uEgg*(1. + .35*fr*fr);
  col += vec3(.3)*pow(max(dot(n, safeN(V + vec3(0., 1., 0.))), 0.), 60.);
  gl_FragColor = vec4(min(col, vec3(.8)), 1.);
  float fogK = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogK*.6);
}`,Bi=`
#include <fog_pars_fragment>
${pt}${Cn}
uniform vec3 uVolC; uniform float uAbove, uFogF, uGainF;
varying vec3 vP, vN, vC, vB; varying float vFin, vSeed;
void main(){
  vec3 s = vB/1.8;
  float dz = s.z - .12, wT = dz < 0. ? .3 : .23, dzb = s.z - .1;
  float top = .05 + .17*exp(-dz*dz/(wT*wT)), bot = -.05 - .105*exp(-dzb*dzb/.09);
  float rel = clamp((s.y - bot)/max(top - bot, 1e-3), 0., 1.);
  vec3 alb = mix(vec3(.46, .47, .42), vec3(.25, .29, .23), smoothstep(.1, .42, rel));
  float body = smoothstep(-.43, -.32, s.z)*(1. - smoothstep(.36, .47, s.z));
  alb = mix(alb, vec3(.6, .3, .33), (1. - smoothstep(.06, .2, abs(rel - .44)))*body*.9);
  // (the back is olive, not black: seen from above, over pale gravel, a trout is a green fish peppered with dark spots)
  alb = mix(alb, vec3(.1, .125, .058), smoothstep(.54, .76, rel));
  float spk = smoothstep(.56, .7, vn(vec2(s.z*70. + vSeed*31., s.y*85. + abs(s.x)*40.)))*smoothstep(.3, .6, rel);
  alb *= 1. - .72*spk;
  float de = length(vec2(s.z - .428, s.y - .022));
  alb = mix(alb, vec3(.01), (1. - smoothstep(.012, .017, de))*smoothstep(.006, .02, abs(s.x)));
  alb = mix(alb, vec3(.13, .15, .1), step(.05, vFin));
  float depth = max((vP.z < -.6 ? ${Ie.toFixed(1)} : 0.) - vP.y, 0.), under = step(.001, depth);
  vec3 V = safeN(uCam - vP), n = safeN(vN); if (dot(n, V) < 0.) n = -n;
  vec3 Ld = safeN(mix(uSun, vec3(uSun.x*.5, 1., uSun.z*.5), under*.7));
  float ca = vn(vP.xz*.9 + vec2(uTime*.5, -uTime*.35))*vn(vP.xz*1.7 - vec2(uTime*.4, uTime*.3));
  float form = salmonForm(n, Ld, mix(.3, .38, under))*(1. + under*(ca*2.2 - .3)*max(n.y, 0.)*.8);
  form *= mix(1., .34 + .66*smoothstep(-.8, .15, n.y), under*(1. - uAbove));
  vec3 E = (uSunCol*.3 + uSkyCol*.5 + uGndCol*.2)*mix(vec3(1.), vec3(.86, .84, .72), under*(1. - exp(-depth*.35)));
  vec3 col = salmonLit(alb, E, form);
  float fr = 1. - max(dot(n, V), 0.);
  col += uSunCol*pow(max(dot(n, safeN(Ld + V)), 0.), 160.)*.07*(1. - step(.05, vFin)) + uSkyCol*fr*fr*.03;
  col *= mix(vec3(1.), vec3(.74, .82, .74), (1. - uAbove)*(1. - exp(-length(uCam - vP)*.014)));
  col = mix(col, col*vec3(.7, .64, .6) + uVolC*.04, uAbove*(1. - exp(-depth*.7))*.85);
  gl_FragColor = vec4(max(col, 0.)*uGainF, 1.);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth*uFogF));
}`,vt=[1,0,0],Ct=[0,1,0],Nt=[0,0,1],Os=ni;function Ti(a,b){const q=Wo(),X=1.8,E=Os(a,b),I=ce=>Ne((.25*X-ce)/(.75*X),0,1),ne=[[-.45,.05,-.05,.02],[-.25,.1,-.095,.058],[-.03,.175,-.142,.088],[.14,.215,-.155,.095],[.31,.142,-.13,.085],[.44,.08,-.085,.054],[.515,-.01,-.045,.014]],D=(ce,Y)=>{let x=Te(Te(E.red,E.belly,z(-.2,-.9,Y)),E.back,z(.55,1,Y)*.8);return x=Te(x,Te(E.olive,E.jaw,z(-.1,-.8,Y)*.7),z(.27*X,.33*X,ce[2])),Te(x,E.olive,z(-.36*X,-.44*X,ce[2])*.8)};q.loft(ne.map(ce=>({c:[0,(ce[1]+ce[2])*.5*X,ce[0]*X],rx:ce[3]*X,ry:(ce[1]-ce[2])*.5*X,e:2.2,k:[I(ce[0]*X),0,0,0]})),vt,Ct,6,1,D);const N=Te(E.olive,E.fin,.5),se=(ce,Y)=>{const x=q.v(ce[0],Y,[I(ce[0][2]),.3,0,0]);for(let ie=1;ie<ce.length;ie++)q.v(ce[ie],Y,[I(ce[ie][2]),1,0,0]);for(let ie=1;ie<ce.length-1;ie++)q.tri(x,x+ie,x+ie+1)};return se([[0,0,-.42*X],[0,.175*X,-.6*X],[0,0,-.53*X],[0,-.175*X,-.6*X]],N),se([[0,.2*X,.03*X],[0,.285*X,-.06*X],[0,.165*X,-.12*X]],E.fin),q.build()}function Pi(a){const b=new o.OctahedronGeometry(1,2),q=b.getAttribute("position"),X=b.getAttribute("normal"),E=new Float32Array(q.count*3);for(let I=0;I<q.count;I++){let ne=q.getX(I),D=q.getY(I),N=q.getZ(I);const se=1+.26*a.n3(ne*1.1+15,D*1.1,N*1.1+3)+.12*a.n3(ne*2.7,D*2.7+19,N*2.7)+.05*a.n3(ne*6.1+7,D*6.1,N*6.1);ne*=se,D=Math.min(D*se,.72+.1*a.n3(ne*2.2,5,N*2.2))*.74,N*=se*.9,q.setXYZ(I,ne,D+.22,N);const ce=Math.hypot(ne,D/.5,N)||1;X.setXYZ(I,ne/ce,D/.5/ce,N/ce);const Y=z(.15,.5,D),x=.8+.35*a.n3(ne*2.4+3,D*2.4,N*2.4+7),ie=Te(Te([.07,.075,.07],[.2,.2,.18],z(-.6,.3,D)),[.26,.29,.2],Y*.4*z(-.1,.25,a.n3(ne*3.3,11,N*3.3)));E[I*3]=ie[0]*x,E[I*3+1]=ie[1]*x,E[I*3+2]=ie[2]*x}return b.setAttribute("color",new o.BufferAttribute(E,3)),b}function Qs(a,b=1){const q=new o.OctahedronGeometry(1,b),X=q.getAttribute("position"),E=q.getAttribute("normal"),I=new Float32Array(X.count*3);for(let ne=0;ne<X.count;ne++){let D=X.getX(ne),N=X.getY(ne),se=X.getZ(ne);const ce=1+.22*a.n3(D*1.3+5,N*1.3,se*1.3)+.08*a.n3(D*3.1,N*3.1+9,se*3.1);D*=ce,N*=ce*.58,se*=ce*.86,X.setXYZ(ne,D,N+.2,se);const Y=Math.hypot(D,N/.34,se)||1;E.setXYZ(ne,D/Y,N/.34/Y,se/Y);const x=z(.1,.5,N),ie=.85+.25*a.n3(D*2+3,N*2,se*2+7),me=Te(Te([.2,.19,.16],[.5,.47,.4],z(-.5,.15,N)),[.3,.31,.14],x*.55);I[ne*3]=me[0]*ie,I[ne*3+1]=me[1]*ie,I[ne*3+2]=me[2]*ie}return q.setAttribute("color",new o.BufferAttribute(I,3)),q}function Ys(a,b,q){const X=Wo(),E=q.length,I=q.radius,ne=[],D=(x,ie)=>{const me=.7+.5*b.n3(x[0]*.35,x[1]*1.6,x[2]*1.6)+.25*b.n2(x[0]*2.2,ie*3);return ut(Te([.1,.085,.07],[.2,.19,.17],z(-.2,.9,ie)*.6+.2),me)},N=[],se=x=>-q.sag*Math.sin(Math.PI*x)+.25*b.n2(x*4,3.3),ce=x=>.5*b.n2(x*3,9.1);for(let x=0;x<=14;x++){const ie=x/14;N.push({c:[ie*E,se(ie),ce(ie)],rx:I*(1-.82*ie)*(1+.5*Math.exp(-ie*14))*(1+.08*b.n2(ie*9,1)),ry:I*(1-.82*ie)*(1+.5*Math.exp(-ie*14))})}if(q.noTrunk||X.loft(N,Ct,Nt,9,2,D),q.roots){const x=q.roots,ie=(te,fe)=>ut(Te([.06,.045,.035],[.16,.13,.1],.5+.5*b.n3(te[0]*1.5,te[1]*1.5,te[2]*1.5)),.7+.3*fe*fe);X.loft([{c:[-.75,0,0],rx:x*.3,ry:x*.3},{c:[-.55,0,0],rx:x*.74,ry:x*.7,e:2.6},{c:[-.1,0,0],rx:x*.8,ry:x*.78,e:2.4},{c:[.4,0,0],rx:x*.42,ry:x*.42},{c:[1.3,0,0],rx:I*1.3,ry:I*1.3}],Ct,Nt,14,2,(te,fe,oe)=>ie(te,fe));const me=15;for(let te=0;te<me;te++){const fe=te/me*6.283+a.range(-.15,.15),oe=x*a.range(.85,1.45),ge=Math.cos(fe),J=Math.sin(fe),Ae=a.range(-.5,.5),he=a.range(.2,.34),xe=[];for(let Z=0;Z<=4;Z++){const ye=Z/4,Pe=fe+Ae*ye*ye,j=x*.35+oe*ye;xe.push({c:[-.35-.5*ye*ye+a.range(-.1,.1),Math.cos(Pe)*j,Math.sin(Pe)*j],rx:he*(1-.86*ye),ry:he*(1-.86*ye)})}X.loft(xe,vt,[0,-J,ge],5,2,(Z,ye)=>ut(D(Z,ye),.75),2)}}const Y=q.branches||0;for(let x=0;x<Y;x++){const ie=Q(q.span?q.span[0]:.22,q.span?q.span[1]:.96,(x+a())/Y),me=ie*E,te=se(ie),fe=ce(ie),oe=q.hang?a.range(-.9,.9)+(a()<.3?a.sign()*1.2:0):a.range(0,6.283),ge=(q.lenAt?q.lenAt(ie):(q.branchLen||4)*(1-.45*ie))*a.range(.6,1.2),J=Math.max(.07,I*.22*(1-.5*ie)),Ae=a.range(-.35,.35),he=-Math.cos(oe),xe=Math.sin(oe),Z=[];for(let ye=0;ye<=3;ye++){const Pe=ye/3,j=q.hang?0:-.25*Pe*Pe*ge;Z.push({c:[me+Ae*ge*Pe,te+he*ge*Pe+j+(q.hang?.18*ge*Pe*Pe*Math.abs(xe)*-1:0),fe+xe*ge*Pe],rx:J*(1-.7*Pe),ry:J*(1-.7*Pe)})}X.loft(Z,vt,[0,xe,-he],4,1,(ye,Pe)=>ut(D(ye,Pe),.8),2);for(let ye=1;ye<=3;ye++)a()<.8&&ne.push([Z[ye].c[0],Z[ye].c[1]-J,Z[ye].c[2]]);for(let ye=0;ye<2;ye++){const Pe=a.range(.35,.8),j=[me+Ae*ge*Pe,te+he*ge*Pe,fe+xe*ge*Pe],rt=ge*a.range(.25,.45),Zt=a.sign();X.loft([{c:j,rx:J*.5,ry:J*.5},{c:[j[0]+Zt*rt*.8,j[1]+he*rt*.6-.1*rt,j[2]+xe*rt*.6],rx:J*.16,ry:J*.16}],[0,xe,-he],vt,3,1,(Ft,Mo)=>ut(D(Ft,Mo),.7),0),ne.push([j[0]+Zt*rt*.5,j[1]+he*rt*.4,j[2]+xe*rt*.4])}}return{geometry:X.build(),anchors:ne}}async function Di(a,b,q,X){const E=[],I=[],ne=[],D=[],N=[],se=[],ce=[],Y=q.plate,x=q.length,ie=q.trunk,me=_=>{const U=Math.hypot(_[0],_[1],_[2])||1;return[_[0]/U,_[1]/U,_[2]/U]},te=(_,U)=>[_[1]*U[2]-_[2]*U[1],_[2]*U[0]-_[0]*U[2],_[0]*U[1]-_[1]*U[0]],fe=(_,U,pe,ve,le,ae,de)=>(E.push(_[0],_[1],_[2]),I.push(U[0],U[1],U[2]),ne.push(pe[0],pe[1],pe[2]),D.push(ve,le,ae,de),E.length/3-1);let oe=1e9;const ge=(_,U)=>{const pe=q.clear(_[0],_[1],_[2])-U;return pe<4.15||_[1]+U>=q.top?!1:(pe<oe&&(oe=pe),!0)},J=[.42,.33,.2],Ae=(_,U,pe,ve,le)=>{const ae=_.length,de=E.length/3;let ue=0,we=null;for(let be=0;be<ae;be++){const ke=_[Math.max(be-1,0)].c,Me=_[Math.min(be+1,ae-1)].c,De=me([Me[0]-ke[0],Me[1]-ke[1],Me[2]-ke[2]]);if(!we)we=me(te(De,Math.abs(De[1])<.8?[0,1,0]:[1,0,0]));else{const Ke=we[0]*De[0]+we[1]*De[1]+we[2]*De[2];we=me([we[0]-De[0]*Ke,we[1]-De[1]*Ke,we[2]-De[2]*Ke])}const Ue=te(De,we),Se=_[be].c,Re=_[be].r;be&&(ue+=Math.hypot(Se[0]-_[be-1].c[0],Se[1]-_[be-1].c[1],Se[2]-_[be-1].c[2]));const je=ve(Se,ue,be/(ae-1));for(let Ke=0;Ke<=U;Ke++){const ze=Ke/U*6.2832,Fe=Math.cos(ze),Le=Math.sin(ze),et=[we[0]*Fe+Ue[0]*Le,we[1]*Fe+Ue[1]*Le,we[2]*Fe+Ue[2]*Le];fe([Se[0]+et[0]*Re,Se[1]+et[1]*Re,Se[2]+et[2]*Re],et,je,Ke/U,ue,Re,pe)}if(be){const Ke=de+(be-1)*(U+1),ze=Ke+U+1;for(let Fe=0;Fe<U;Fe++)N.push(Ke+Fe,ze+Fe,Ke+Fe+1,Ke+Fe+1,ze+Fe,ze+Fe+1)}if(be===ae-1&&le){const Ke=E.length/3,ze=.5*Re;for(let Le=0;Le<=U;Le++){const et=Le/U*6.2832,Ao=Math.cos(et),st=Math.sin(et),_e=ze*(Le*7%3)*.5;fe([Se[0]+(we[0]*Ao+Ue[0]*st)*Re*.9+De[0]*_e,Se[1]+(we[1]*Ao+Ue[1]*st)*Re*.9+De[1]*_e,Se[2]+(we[2]*Ao+Ue[2]*st)*Re*.9+De[2]*_e],De,J,Le/U,ue,Re,3)}const Fe=fe([Se[0]+De[0]*ze,Se[1]+De[1]*ze,Se[2]+De[2]*ze],De,ut(J,.7),.5,ue,Re,3);for(let Le=0;Le<U;Le++)N.push(Ke+Le,Ke+Le+1,Fe)}}},he=_=>(U,pe)=>ut(Te([.15,.1,.058],[.27,.2,.115],.5+.5*b.n3(U[0]*.5+3,U[1]*.5,U[2]*.5)),_*(.8+.35*b.n3(U[0]*1.7,U[1]*1.7+9,U[2]*1.7))),xe=44,Z=6,ye=new Float32Array(xe),Pe=(_,U)=>{const pe=Math.cos(_)*U,ve=Math.sin(_)*U;if(!ge([0,pe,ve],.55))return!1;for(let le=0;le<Z;le++){const ae=le/Z;if(!ge([1.25,pe*ae,ve*ae],0)||!ge([-1.25,pe*ae,ve*ae],0))return!1}return!0};for(let _=0;_<xe;_++){const U=_/xe*6.2832;let pe=Y*(.88+.2*b.n2(Math.cos(U)*1.6+5,Math.sin(U)*1.6+11)+.07*b.n2(Math.cos(U)*5.1,Math.sin(U)*5.1+3));for(;pe>1.5&&!Pe(U,pe);)pe-=.25;ye[_]=pe}const j=(_,U)=>(.5*Math.pow(Math.max(1-U*U,0),.55)+.1)*(1+.45*b.n2(Math.cos(_)*2.3*U+7,Math.sin(_)*2.3*U+2)),rt=_=>ut(Te([.21,.18,.13],[.42,.37,.27],.5+.5*b.n3(_[0]*.9+4,_[1]*.9,_[2]*.9)),.8+.4*b.n3(_[0]*2.6,_[1]*2.6,_[2]*2.6+5)),Zt=E.length/3;{const _=le=>{const ae=fe([le*j(0,0),0,0],[le,0,0],rt([le,0,0]),0,0,0,1),de=[];for(let ue=1;ue<Z;ue++){const we=ue/Z,be=[];for(let ke=0;ke<xe;ke++){const Me=ke/xe*6.2832,De=ye[ke]*we,Ue=Math.cos(Me)*De,Se=Math.sin(Me)*De,Re=.22*b.n3(Ue*.8+le*9,Se*.8,4)+.1*b.n3(Ue*2.1,Se*2.1,le*6),je=[le*(j(Me,we)+Re*(.4+.6*we)),Ue,Se];be.push(fe(je,[le,0,0],rt(je),ke/xe,De,0,1))}de.push(be)}for(let ue=0;ue<xe;ue++)N.push(ae,de[0][ue],de[0][(ue+1)%xe]);for(let ue=0;ue+1<de.length;ue++)for(let we=0;we<xe;we++){const be=(we+1)%xe;N.push(de[ue][we],de[ue+1][we],de[ue][be],de[ue][be],de[ue+1][we],de[ue+1][be])}return de[de.length-1]},U=_(1),pe=_(-1),ve=[];for(let le=0;le<xe;le++){const ae=le/xe*6.2832,de=ye[le],ue=[.12*b.n2(le*.9,3),Math.cos(ae)*de,Math.sin(ae)*de];ve.push(fe(ue,[0,Math.cos(ae),Math.sin(ae)],ut(rt(ue),.85),le/xe,de,0,1)),le%2===0&&ce.push({c:ue,d:[-.2,Math.cos(ae),Math.sin(ae)],r:.05})}for(let le=0;le<xe;le++){const ae=(le+1)%xe;N.push(U[le],ve[le],U[ae],U[ae],ve[le],ve[ae],pe[le],ve[le],pe[ae],pe[ae],ve[le],ve[ae])}}const Ft=E.length/3,Mo=N.length;{for(let _=Zt*3;_<Ft*3;_++)I[_]=0;for(let _=0;_<Mo;_+=3){const U=N[_]*3,pe=N[_+1]*3,ve=N[_+2]*3,le=te([E[pe]-E[U],E[pe+1]-E[U+1],E[pe+2]-E[U+2]],[E[ve]-E[U],E[ve+1]-E[U+1],E[ve+2]-E[U+2]]),ae=(E[U]+E[pe]+E[ve])/3,de=le[0]*ae>=0?1:-1;for(const ue of[U,pe,ve])I[ue]+=le[0]*de,I[ue+1]+=le[1]*de,I[ue+2]+=le[2]*de}for(let _=Zt;_<Ft;_++){const U=me([I[_*3],I[_*3+1],I[_*3+2]]);I[_*3]=U[0],I[_*3+1]=U[1],I[_*3+2]=U[2]}}X&&await X();const He=_=>{const U=(_/6.2832%1+1)%1*xe,pe=Math.floor(U)%xe;return Q(ye[pe],ye[(pe+1)%xe],U-Math.floor(U))},bt=(_,U,pe,ve,le,ae,de,ue)=>{const we=[{c:_,r:le}],be=ve/ae,ke=2+Math.floor(a()*(ae-2)),Me=a.sign()*a.range(.25,.6),De=a.range(.1,.22),Ue=a()*6.283;let Se=_,Re=U;for(let je=1;je<=ae;je++){const Ke=je/ae,ze=Math.max(le*Math.pow(1-Ke*.93,.6),.028);Re+=De*Math.sin(Ue+je*1.7)+(je===ke?Me:0);let Fe=null;for(const Le of[0,.5,-.5,1,-1,1.5,-1.5]){const et=[Se[0]+(pe-Math.abs(Le)*.3)*be,Se[1]+Math.cos(Re+Le)*be,Se[2]+Math.sin(Re+Le)*be];if(ge(et,ze)&&et[1]-ze>q.bed(et[0],et[2])-.5){Fe=et,Re+=Le;break}}if(!Fe)break;Se=Fe,we.push({c:Se,r:ze})}return we.length>1&&Ae(we,de,0,he(ue),!0),we},ho=(_,U)=>{const pe=_[Math.max(U-1,0)].c,ve=_[Math.min(U+1,_.length-1)].c;return Math.atan2(ve[2]-pe[2],ve[1]-pe[1])},L=(_,U)=>{for(let pe=U;pe<_.length;pe++){const ve=ho(_,pe);ce.push({c:_[pe].c,d:[-.15,Math.cos(ve),Math.sin(ve)],r:_[pe].r})}},co=q.count;for(let _=0;_<co;_++){X&&(_&1)===1&&await X();const U=_/co*6.2832+a.range(-.22,.22),pe=He(U),ve=pe*.7+a.range(1.5,4.2),le=bt([.3+a.range(-.1,.15),Math.cos(U)*pe*.3,Math.sin(U)*pe*.3],U,a.range(-.12,.03),ve,.25*a.range(.82,1),10,7,1),ae=le.length;if(ae<4)continue;se.push(le[ae-1].c,le[Math.max(1,ae-3)].c),L(le,Math.min(ae-1,6));const de=a.sign(),ue=Math.min(ae-2,a.int(4,5)),we=ho(le,ue)+de*a.range(.45,.85),be=bt(le[ue].c,we,a.range(-.15,.1),ve*a.range(.32,.5),le[ue].r*.78,6,5,.92);be.length>2&&(se.push(be[be.length-1].c),L(be,2));const ke=Math.min(ae-2,a.int(6,8)),Me=ho(le,ke)-de*a.range(.4,.9),De=bt(le[ke].c,Me,a.range(-.15,.1),ve*a.range(.18,.3),le[ke].r*.8,4,4,.9);if(De.length>2&&L(De,2),be.length>4){const Ue=a.int(2,3),Se=bt(be[Ue].c,we-de*a.range(.5,1),a.range(-.1,.1),ve*a.range(.12,.22),be[Ue].r*.8,3,4,.88);Se.length>2&&L(Se,2)}}X&&await X();for(let _=0;_<(q.sinkers||0);_++){const U=a()*6.2832,pe=Math.sqrt(a())*.7,ve=He(U)*pe,le=[-.3,Math.cos(U)*ve,Math.sin(U)*ve],ae=a.range(.7,1.9),de=a.range(.12,.2),ue=a.range(-.35,.15),we=a.range(-.25,.25),be=[{c:le,r:de}];for(let ke=1;ke<=3;ke++){const Me=ke/3,De=[le[0]-ae*Me,le[1]+ue*ae*Me*Me,le[2]+we*ae*Me];if(!ge(De,de))break;be.push({c:De,r:de*(1-.45*Me)})}if(be.length>1){Ae(be,5,0,he(.9),!0);const ke=be[be.length-1];ce.push({c:ke.c,d:[-1,0,0],r:ke.r}),_%2===0&&se.push(ke.c)}}const xt=q.stream;for(let _=0,U=0,pe=ce.length;pe&&U<(q.rootlets||0)&&_<(q.rootlets||0)*3;_++){X&&(_&63)===63&&await X();const ve=ce[Math.floor(a()*pe)],le=a.range(.35,1.05),ae=me([ve.d[0]+a.range(-.8,.8),ve.d[1]+a.range(-.8,.8),ve.d[2]+a.range(-.8,.8)]),de=[ve.c[0]+ae[0]*ve.r*.6,ve.c[1]+ae[1]*ve.r*.6,ve.c[2]+ae[2]*ve.r*.6],ue=[{c:de,r:.036}];let we=!0;for(let be=1;be<=3;be++){const ke=be/3,Me=[de[0]+(ae[0]+xt[0]*.55*ke)*le*ke,de[1]+(ae[1]-.3*ke)*le*ke,de[2]+(ae[2]+xt[2]*.55*ke)*le*ke];if(!ge(Me,.05)){we=!1;break}ue.push({c:Me,r:.036*(1-.75*ke)})}we&&(Ae(ue,3,0,he(.8),!1),U++)}if(X&&await X(),q.cobble){const _=q.cobble.getAttribute("position"),U=q.cobble.getAttribute("normal"),pe=q.cobble.getAttribute("color"),ve=q.cobble.index,le=new o.Matrix4,ae=new o.Quaternion,de=new o.Euler,ue=new o.Vector3,we=new o.Vector3;for(let be=0;be<(q.stones||0);be++){const ke=a()*6.2832,Me=Math.pow(a(),.45)*.97,De=He(ke)*Me,Ue=a()<.6?1:-1,Se=a.range(.2,.42)*(a()<.22?1.7:1),Re=[Ue*j(ke,Me)*.8,Math.cos(ke)*De,Math.sin(ke)*De],je=a.range(.75,1.15);if(de.set(a.range(-.5,.5),a()*6.283,-Ue*1.5708+a.range(-.4,.4)),ae.setFromEuler(de),!ge(Re,Se))continue;le.compose(ue.set(Re[0],Re[1],Re[2]),ae,we.set(Se,Se,Se));const Ke=E.length/3;for(let ze=0;ze<_.count;ze++){ue.fromBufferAttribute(_,ze).applyMatrix4(le);const Fe=ue.x,Le=ue.y,et=ue.z;ue.fromBufferAttribute(U,ze).applyQuaternion(ae),fe([Fe,Le,et],[ue.x,ue.y,ue.z],[pe.getX(ze)*je,pe.getY(ze)*je,pe.getZ(ze)*je],0,0,Se,2)}if(ve)for(let ze=0;ze<ve.count;ze++)N.push(Ke+ve.getX(ze));else for(let ze=0;ze<_.count;ze++)N.push(Ke+ze)}}X&&await X();{const _=q.bed(x*.6,0)+ie*.5,U=[],pe=ae=>ie*(1-.8*ae)*(1+.3*Math.exp(-ae*14)),ve=(ae,de)=>ut(Te([.17,.13,.085],[.3,.26,.19],.5+.5*b.n3(ae[0]*.3+3,ae[1]*.8,ae[2]*.8)),.8+.35*b.n3(ae[0]*1.1,ae[1]*1.7+9,ae[2]*1.7));for(let ae=0;ae<=14;ae++){const de=ae/14,ue=.2+de*x,we=.45*b.n2(de*3,9.1)*z(0,.2,de),be=pe(de),ke=[ue,Math.max(q.bed(ue,we)+.8*be,Q(0,_,z(0,.6,de))+.2*b.n2(de*4,3.3)*z(0,.2,de)),we];if(!ge(ke,be))break;U.push({c:ke,r:be})}const le=U.length-1;le>=1&&Ae(U,12,0,ve,!0);for(let ae=0;ae<(q.stubs||0)&&le>=1;ae++){const de=a.range(.1,.86),ue=de*le,we=Math.min(le-1,Math.floor(ue)),be=U[we],ke=U[we+1],Me=ue-we,De=Q(be.r,ke.r,Me),Ue=a.range(-1.9,1.9),Se=a.range(.7,2.6),Re=.1+.07*(1-de),je=a.range(-.35,.35),Ke=[Q(be.c[0],ke.c[0],Me),Q(be.c[1],ke.c[1],Me)+Math.cos(Ue)*De*.8,Q(be.c[2],ke.c[2],Me)+Math.sin(Ue)*De*.8],ze=[{c:Ke,r:Re}];for(let Fe=1;Fe<=2;Fe++){const Le=Fe/2,et=[Ke[0]+je*Se*Le,Ke[1]+Math.cos(Ue)*Se*Le,Ke[2]+Math.sin(Ue)*Se*Le];if(!ge(et,Re))break;ze.push({c:et,r:Re*(1-.3*Le)})}ze.length>1&&Ae(ze,5,0,ve,!0)}}const ft=new o.BufferGeometry;return ft.setAttribute("position",new o.Float32BufferAttribute(E,3)),ft.setAttribute("normal",new o.Float32BufferAttribute(I,3)),ft.setAttribute("color",new o.Float32BufferAttribute(ne,3)),ft.setAttribute("aAux",new o.Float32BufferAttribute(D,4)),ft.setIndex(N),ft.computeBoundingSphere(),{geometry:ft,tips:se,near:oe}}function Dn(a,b,q,X,E,I,ne,D,N,se=[0,0,0,0]){const ce=N?[.2,.21,.23]:[.13,.012,.015],Y=N?[.03,.05,.06]:[.035,.02,.016],x=N?[.05,.08,.09]:[.035,.045,.02],ie=[.3,.16,.12],me=[[-.5,.02,.012],[-.44,.05,.02],[-.3,.085,.04],[-.1,.15,.065],[.08,.185,.075],[.24,.17,.07],[.36,.125,.06],[.45,.07,.04],[.5,.02,.015]],te=(ge,J)=>{const Ae=-ne*(ge*2)*(ge*2);return[b[0]+q[0]*ge*I+X[0]*(Ae+J),b[1]+q[1]*ge*I+X[1]*(Ae+J),b[2]+q[2]*ge*I+X[2]*(Ae+J)]};a.loft(me.map(ge=>({c:te(ge[0],0),rx:ge[2]*I,ry:ge[1]*I,e:2.2,k:se})),E,X,7,1,(ge,J,Ae,he)=>{const xe=he-.5;let Z=Te(Te(ce,Y,z(.35,.95,J)*.75),ut(ce,.7),z(-.3,-.9,J));return Z=Te(Z,x,Math.max(z(.26,.34,xe),z(-.36,-.44,xe)*.8)),D&&xe>-.12&&xe<.16&&J<.2&&Ae>0&&(Z=Te(Z,ie,.85)),Z});const fe=te(-.46,0),oe=a.v(fe,Y,se);a.v(te(-.62,.15*I),Y,se),a.v(te(-.55,0),ut(Y,.8),se),a.v(te(-.62,-.15*I),Y,se),a.tri(oe,oe+1,oe+2),a.tri(oe,oe+2,oe+3)}function $s(a,b){const q=Wo(),X=[.215,.2,.17],E=[.125,.122,.118],I=[.05,.048,.05],ne=[.012,.012,.013],D=(x,ie)=>{const me=z(-2,-1.3,x[2])*z(2.5,1.9,x[2]);let te=Te(E,I,z(.3,.9,ie)*me*.9);return te=Te(te,X,Math.max(z(-.3,-.85,ie)*.9,z(2.3,2.7,x[2])*z(.45,-.25,ie))),Te(te,ne,z(3.1,3.16,x[2]))},N=x=>[0,0,x,0],se=[0,0,1,0];q.loft([{c:[0,2.2,-1.85],rx:.24,ry:.3},{c:[0,2.25,-1.5],rx:.5,ry:.6},{c:[0,2.2,-.8],rx:.5,ry:.58},{c:[0,2.12,-.1],rx:.55,ry:.7},{c:[0,2.05,.6],rx:.6,ry:.86},{c:[0,2.2,1.15],rx:.56,ry:.8,k:N(.1)},{c:[0,2.36,1.6],rx:.47,ry:.62,k:N(.45)},{c:[0,2.46,1.95],rx:.4,ry:.48,k:N(.85)},{c:[0,2.5,2.3],rx:.37,ry:.36,k:se},{c:[0,2.44,2.58],rx:.27,ry:.25,k:se},{c:[0,2.35,2.85],rx:.16,ry:.15,k:se},{c:[0,2.3,3.08],rx:.125,ry:.115,k:se},{c:[0,2.3,3.18],rx:.07,ry:.06,k:se}],vt,Ct,10,2,D);const ce=x=>Te(Te(X,E,z(1.3,2.1,x[1])*.85),ut(X,.8),z(.5,.05,x[1]));for(const x of[-1,1]){const ie=x<0?.25:.75,me=x<0?.75:.25,te=(fe,oe)=>[fe,oe,0,0];q.loft([{c:[x*.3,2,.8],rx:.26,ry:.38,k:te(ie,0)},{c:[x*.32,1.3,.78],rx:.17,ry:.22,k:te(ie,.5)},{c:[x*.32,.7,.86],rx:.12,ry:.14,k:te(ie,1)},{c:[x*.32,.16,.84],rx:.12,ry:.15,k:te(ie,1)},{c:[x*.32,0,.97],rx:.14,ry:.23,k:te(ie,1)}],vt,Nt,7,2,ce,2),q.loft([{c:[x*.3,2.2,-1.45],rx:.3,ry:.5,k:te(me,0)},{c:[x*.33,1.5,-1.3],rx:.21,ry:.31,k:te(me,.5)},{c:[x*.33,.82,-1.62],rx:.12,ry:.16,k:te(me,1)},{c:[x*.33,.18,-1.5],rx:.12,ry:.16,k:te(me,1)},{c:[x*.33,0,-1.4],rx:.14,ry:.23,k:te(me,1)}],vt,Nt,7,2,ce,2),q.loft([{c:[x*.2,2.78,2.2],rx:.13,ry:.07,k:se},{c:[x*.25,3,2.16],rx:.1,ry:.055,k:se},{c:[x*.28,3.18,2.13],rx:.03,ry:.025,k:se}],vt,Nt,5,1,(fe,oe)=>oe>.2?ut(X,.7):I,2),q.loft([{c:[x*.2,2.61,2.5],rx:.02,ry:.02,k:se},{c:[x*.235,2.6,2.55],rx:.045,ry:.04,k:se},{c:[x*.22,2.58,2.6],rx:.02,ry:.02,k:se}],vt,Ct,5,1,()=>[.12,.085,.02])}const Y=x=>[0,0,0,x];return q.loft([{c:[0,2.2,-1.8],rx:.14,ry:.14,k:Y(0)},{c:[0,1.95,-2.14],rx:.24,ry:.24,k:Y(.3)},{c:[0,1.5,-2.4],rx:.3,ry:.3,k:Y(.65)},{c:[0,1.05,-2.5],rx:.2,ry:.2,k:Y(.9)},{c:[0,.8,-2.5],rx:.04,ry:.04,k:Y(1)}],vt,Nt,7,2,x=>Te(Te(E,I,.35),ut(I,.5),z(1.5,.95,x[1]))),a&&Dn(q,[.04,1.82,3],vt,Ct,Nt,1.9,.5,!1,b,se),q.build()}function Ri(){const a=Wo(),b=[.3,.3,.29],q=[.195,.205,.22],X=[.07,.075,.085],E=[.4,.27,.025],I=[.36,.04,.025],ne=[.19,.125,.115],D=[.22,.225,.23],N=Y=>[0,0,Y,0];a.loft([{c:[0,1.03,-.98],rx:.03,ry:.015},{c:[0,1.01,-.7],rx:.16,ry:.06},{c:[0,.97,-.38],rx:.24,ry:.19},{c:[0,.94,-.06],rx:.295,ry:.28},{c:[0,.95,.2],rx:.275,ry:.285},{c:[0,1.04,.38],rx:.2,ry:.22,k:N(.25)},{c:[0,1.2,.48],rx:.125,ry:.13,k:N(.75)},{c:[0,1.36,.55],rx:.135,ry:.13,k:N(1)},{c:[0,1.41,.66],rx:.125,ry:.115,k:N(1)},{c:[0,1.4,.77],rx:.085,ry:.085,k:N(1)},{c:[0,1.38,.86],rx:.045,ry:.058,k:N(1)},{c:[0,1.365,.98],rx:.036,ry:.052,k:N(1)},{c:[0,1.33,1.07],rx:.024,ry:.04,k:N(1)},{c:[0,1.285,1.1],rx:.008,ry:.012,k:N(1)}],vt,Ct,9,2,(Y,x)=>{if(Y[2]>.84)return Y[2]>.96&&Y[2]<1.06&&x<-.25?I:E;let ie=Te(b,D,z(-.2,-.95,x)*.5);return ie=Te(ie,q,z(.2,.55,x)*z(.36,.2,Y[2])*z(-.78,-.6,Y[2])),ie});for(const Y of[-1,1]){const x=[Y,0,0,0];a.loft([{c:[Y*.2,1.1,.32],rx:.04,ry:.07,k:x},{c:[Y*.285,1.07,.12],rx:.07,ry:.19,k:x},{c:[Y*.31,1.03,-.2],rx:.065,ry:.215,k:x},{c:[Y*.26,1.02,-.52],rx:.05,ry:.16,k:x},{c:[Y*.15,1.05,-.84],rx:.035,ry:.085,k:x},{c:[Y*.07,1.085,-1.08],rx:.02,ry:.035,k:x},{c:[Y*.05,1.1,-1.2],rx:.006,ry:.01,k:x}],vt,Ct,6,1,(te,fe)=>{let oe=Te(q,ut(q,.8),z(.3,-.8,fe)*.6);return oe=Te(oe,b,z(-.72,-.92,fe)*z(-.75,-.3,te[2])*.9),oe=Te(oe,X,z(-.66,-.86,te[2])),Te(oe,b,z(-1.1,-1.16,te[2])*.8)});const ie=6,me=[];for(let te=0;te<=ie;te++){const fe=te/ie;me.push({c:[Y*(.2+1.34*fe),1.1+.1*Math.sin(Math.PI*Math.min(fe*1.2,1)),.1-.34*fe*fe],rx:.045*(1-.8*fe)+.006,ry:(.27+.06*Math.sin(Math.PI*fe))*(1-Math.pow(fe,2.6))+.012,k:[Y,fe,0,1]})}a.loft(me,Ct,Nt,6,1,(te,fe,oe,ge)=>{let J=oe>0?q:Te(b,D,.35);return J=Te(J,b,z(-.74,-.95,fe)*.9),J=Te(J,X,z(.68,.84,ge)),Te(J,b,z(.95,.99,ge)*.7)}),a.loft([{c:[Y*.1,.4,-.02],rx:.045,ry:.045},{c:[Y*.1,.22,0],rx:.03,ry:.03},{c:[Y*.1,.05,.02],rx:.03,ry:.035},{c:[Y*.1,.012,.21],rx:.085,ry:.014}],vt,Nt,5,1,()=>ne,2),a.loft([{c:[Y*.098,1.435,.67],rx:.01,ry:.01,k:N(1)},{c:[Y*.118,1.435,.7],rx:.03,ry:.03,k:N(1)},{c:[Y*.1,1.435,.735],rx:.01,ry:.01,k:N(1)}],vt,Ct,5,1,()=>[.012,.011,.01])}const se=a.build(),ce=se.getAttribute("position");for(let Y=0;Y<ce.count;Y++)ce.getY(Y)>.55&&ce.setY(Y,ce.getY(Y)-.4);return se}function qi(){const a=Wo(),b=[.035,.04,.045],q=[.62,.62,.58],X=[.02,.07,.045],E=[.5,.09,.03];a.loft([{c:[0,.12,-.92],rx:.04,ry:.03},{c:[0,.14,-.6],rx:.25,ry:.19},{c:[0,.15,-.1],rx:.35,ry:.27},{c:[0,.16,.38],rx:.31,ry:.26},{c:[0,.24,.66],rx:.17,ry:.19},{c:[0,.5,.8],rx:.1,ry:.1},{c:[0,.72,.9],rx:.13,ry:.13},{c:[0,.72,1.08],rx:.085,ry:.08},{c:[0,.69,1.28],rx:.035,ry:.03},{c:[0,.68,1.46],rx:.018,ry:.014}],vt,Ct,7,1,(I,ne)=>I[2]>1.1?E:I[1]>.4&&I[2]>.7?X:Te(q,b,z(.5,.9,ne)));for(const I of[-1,1]){const ne=[I,0,0,0],D=[I,.5,0,0],N=[I,1,0,0],se=[.6,.6,.58],ce=[.16,.17,.19],Y=a.v([I*.22,.3,.36],ce,ne);a.v([I*.85,.3,.38],se,D),a.v([I*.85,.3,-.3],se,D),a.v([I*.22,.3,-.36],se,ne),a.v([I*1.55,.3,.12],b,N),a.v([I*1.3,.3,-.28],ce,N),a.tri(Y,Y+1,Y+2),a.tri(Y,Y+2,Y+3),a.tri(Y+1,Y+4,Y+5),a.tri(Y+1,Y+5,Y+2)}return a.build()}function gt(a,b,q,X){const E=new o.InstancedBufferGeometry;E.index=a.index;for(const I of["position","normal","color","aAux"])E.setAttribute(I,a.getAttribute(I));for(const I in q)E.setAttribute(I,new o.InstancedBufferAttribute(q[I]instanceof Float32Array?q[I]:new Float32Array(q[I]),4));return E.instanceCount=b,X&&(E.boundingSphere=X),E}const jo=[.15,.208,.2525],Xs=11,Vi=-.74,_a=-7.5,Ga=[29,24,23];function Zs(a,b,q,X,E){const I=a+6,ne=[],D=Y=>{let x=Vi;for(const ie of jo){const me=(Y-ie*X)/Xs;if(Math.abs(me)<1){const te=Math.cos(me*Math.PI*.5);x+=1.74*te*te}}return x};ne.push([I,_a,q],[I,_a,q-22],[I-1.2,-5.7,q-33],[I-2.4,-3,q-44],[I-2.2,-1.25,q-55]);const N=jo[2]*X+Xs+2;for(let Y=66;Y<=N;Y+=5.5)ne.push([Q(I-1.8,a+2.6,z(60,170,Y)),D(Y),q-Y]);ne.push([a+2,-1.9,64],[a+1,-3,51],[a+.3,-3.4,37],[a,-3.1,24.5]),ne.push([a,0,16],[a,3.8,8.6],[a+1.5,2.3,6.6],[a+4,-1.8,9.5]),ne.push([a+9.5,-3.3,15],[a+12,-3.5,27],[a+8,-2.8,42],[a+1,-1.5,56],[a-4,.4,67]),ne.push([a-3,.5,77],[a+3,.5,83.5],[a+11,.5,81.5],[a+16.5,.5,73]);const se=a+16.5,ce=b-2;return ne.push([a+17.5,.5,61],[a+18.4,.5,49],[a+14.8,.5,38.5],[se,.5,Ga[0]],[Q(se,ce,.5),.5,Ga[1]],[ce,.5,Ga[2]]),ne.push([b+3.2,.2,21.6],[b+4.2,-1.5,18.6],[b+2.4,-2.6,16],[b+.7,-2.8,13.2],[b+.1,.3,8.2]),ne.push([b,5.5,3.4],[b,8.6,0],[b,8,-4.5],[b,6,-9],[b,5.25,-14],[b,5.7,-18.5],[b,6.5,-23.5]),ne.push([b,6.5,-42],[b,6.5,-75],[b,6.5,-115-E]),ne}const Li=2.6;function _i(a){const X=Math.ceil(a.length/.05),E=new Float64Array((X+1)*3),I=new Map,ne=new o.Vector3;for(let N=0;N<=X;N++){a.posAtDist(Math.min(N*.05,a.length),ne),E[N*3]=ne.x,E[N*3+1]=ne.y,E[N*3+2]=ne.z;const se=Math.floor(ne.z/2);I.has(se)||I.set(se,[]),I.get(se).push(N*3)}const D=(N,se,ce,Y,x=0,ie=0,me=0)=>{let te=1/0;for(let fe=0;fe<N.length;fe+=3){const oe=Math.max(Math.abs(N[fe]-se)-x,0),ge=Math.max(Math.abs(N[fe+1]-ce)-ie,0),J=Math.max(Math.abs(N[fe+2]-Y)-me,0),Ae=oe*oe+ge*ge+J*J;Ae<te&&(te=Ae)}return Math.sqrt(te)};return{clear:Li,dist:D,near(N,se,ce,Y,x,ie){const me=[];for(let te=Math.floor(x/2);te<=Math.floor(ie/2);te++){const fe=I.get(te);if(fe)for(const oe of fe)E[oe]>=N&&E[oe]<=se&&E[oe+1]>=ce&&E[oe+1]<=Y&&E[oe+2]>=x&&E[oe+2]<=ie&&me.push(E[oe],E[oe+1],E[oe+2])}return me},body(N,se,ce,Y,x,ie,me,te,fe=0,oe=0,ge=0,J=te,Ae=0){let he=1/0;for(let xe=-2;xe<=2;xe++){const Z=xe*.25*(te+J),ye=Math.abs(xe*.25*(J-te));he=Math.min(he,D(N,se+x*Z,ce+ie*Z,Y-Ae/2+me*Z,fe+Math.abs(x)*ye,oe+Math.abs(ie)*ye,ge+Math.abs(me*xe*.5*(J-te)-Ae)/2))}return he-.17*Math.max(te,J)}}}function Gi(a,b,q,X,E,I,ne,D){const N=a.clear,se=.4*.35,ce=.14*.35,Y=.8*.35,x=Math.cos(ne),ie=-Math.sin(I)*x,me=Math.sin(ne),te=-Math.cos(I)*x,fe=N+1.17*E,oe=(xe,Z)=>a.near(b-se-fe,b+se+fe,q-ce-fe,q+ce+fe,X-Z-Y-fe,X-xe+Y+fe);if(!oe(0,D).length)return D;let ge=null,J=-1;const Ae=(xe,Z)=>{J=-1;for(let ye=xe;ye<Z;){if(ye>=J-1e-6&&(J=Math.min(ye+8,Z),ge=oe(ye,J)),!ge.length){ye=J;continue}const Pe=a.dist(ge,b,q,X-ye,se,ce,Y)-fe;if(Pe>.1){ye=Math.min(ye+Pe,J);continue}const j=Math.min(ye<6||ye>Z-6-1e-6?.1:Math.min(.5,Z-6-ye),J-ye),rt=ye+j;if(a.body(ge,b,q,X-ye,ie,me,te,E*z(0,6,ye)*(1-z(Z-6,Z,ye)),se,ce,Y,E*z(0,6,rt)*(1-z(Z-6,Z,rt)),j)<N)return ye;ye=rt}return-1};let he=0;for(let xe=D;xe>=32;){const Z=Ae(Math.min(he,xe-6),xe);if(Z<0)return xe;if(Z<6)return 0;he=Math.max(he,Math.min(Z,xe-6)),xe=Math.min(xe-.25,Math.ceil((Z+6.5)*4)/4-.25)}return 0}function Js(a){const b=(q,X,E=.012)=>z(q-E,q+E,a)*(1-z(X-E,X+E,a));return 1-.14*b(0,.075,.02)-.28*b(.385,.425)+.5*b(.44,.525,.015)-.18*b(.545,.6)-.3*b(.605,.728,.015)+.4*b(.74,.755,.007)-.58*b(.762,.797,.008)+.06*b(.84,.9,.02)}var Ui={id:"salmon-falls",name:"Against the Falls",category:"wilderness",weirdness:.05,media:["water","underwater"],async build(a){const b=a.rng,q=a.noise,X=a.vary||{},E=a.quality?.detail??1,I=b();let ne=I<.14?"dawn":I<.3?"july":I<.44?"october":I<.62?"evening":I<.92?"september":"rain";X.hour==="night"?ne="night":X.hour==="dawn"?ne="dawn":X.hour==="golden"?ne=I<.3?"dawn":"evening":X.hour==="day"&&(ne==="dawn"||ne==="evening")&&(ne=I<.14?"july":"september");const D=La[ne],N=ne==="night",se=Ne(X.density??1,.7,1.3),ce=!!X.rare,Y={secondWolf:b()<.3,otters:b()<.35,gulls:Math.round(b.range(10,16)),eagles:b()<.5?2:3},x=new o.Scene,ie=nt(((a.seed??1)|0)*6007+911>>>0),me=nt(((a.seed??1)|0)*7919+4243>>>0),te=nt(((a.seed??1)|0)*9173+7757>>>0),fe=e=>a.core.makeRng(a.core.hashSeed(e+":"+a.seed));await a.yield();const oe=await ai(a,{palette:St,hour:D.hour,season:D.season,weather:D.weather,density:se,water:!1,duration:Ra,strikeU:.77,plumeOpacity:.72});x.add(oe.object);const ge=oe.anchors,J=ge.failX,Ae=ge.leapX,he=oe.uniforms;D.weather==="rain"&&he.uSkyCol.value.multiplyScalar(1.3),N&&(he.uSunCol.value.multiplyScalar(1.5),he.uSkyCol.value.multiplyScalar(2.2));const xe=oe.object.getObjectByName("bubbleWall")||null;xe&&xe.material.uniforms.uBub.value.set(.5,1.3),await a.yield();let Z=238,ye=5,Pe=574,j=null;const rt=new o.Vector3,Zt=(e,t)=>{let n=null;for(let s=0;s<=240;s++){const l=e+(t-e)*s/240;j.pointAt(l,rt);const d=rt.y>0;if(n===!1&&d&&rt.z<30&&rt.z>0)return l;n=d}return(e+t)/2};for(let e=0;e<7;e++){await a.yield(),j=Gs(Zs(J,Ae,Z,Pe,ye)),Pe=j.length,await a.yield();const t=Zt(.3,.5);await a.yield();const n=Zt(.66,.9);if(Math.abs(t-.397)<.001&&Math.abs(n-.767)<.001&&e>1)break;Z+=(.397-t)*Pe/.61,ye=Ne(ye+(n-.767)*Pe/.767,-6,26)}await a.yield(),j=Gs(Zs(J,Ae,Z,Pe,ye)),Pe=j.length;const Ft=-115-ye;await a.yield();const Mo=_i(j);await a.yield(),await oe.offRoute(Mo,a.yield),await a.yield();const He=new o.Vector3,bt=(e,t,n,s=0,l=1)=>{let d=1e9,p=s;for(let h=0;h<=300;h++){const u=s+(l-s)*h/300;j.pointAt(u,He);const c=(He.x-e)**2+(He.y-t)**2+(He.z-n)**2;c<d&&(d=c,p=u)}return p},ho=(e,t,n)=>{let s=e;for(let l=1;l<=240;l++){const d=e+(t-e)*l/240;j.pointAt(d,He);const p=He.y>n;if(j.pointAt(s,He),He.y>n!==p)return d;s=d}return t};await a.yield();const L={look:ne,rare:ce,length:Math.round(Pe),Z0:Math.round(Z),E:Math.round(ye),arc1:jo[0],arc2:jo[1],arc3:jo[2],missBreak:ho(.36,.42,0),missTop:bt(J,3.8,8.6,.36,.46),tailUp:bt(J-4,.4,67,.45,.6),wolf:bt(J+3,.5,83.5,.45,.65),slantFrom:bt(J+16.5,.5,73,.5,.7),shoal:bt(J+18,.5,52,.55,.72),slantTo:bt(Ae-2,.5,Ga[2],.6,.78),leapBreak:bt(Ae+.1,.3,8.2,.65,.85),apex:bt(Ae,8.6,0,.7,.88),splash:bt(Ae,6,-9,.7,.9)};await a.yield(),L.missFall=ho(L.missTop,L.missTop+.05,0),L.surface=ho(L.splash+.004,L.splash+.07,5.97),L.snap=Q(L.leapBreak,L.apex,.42),L.eagle=Q(L.slantFrom,L.slantTo,.5),L.fx=+J.toFixed(2),L.lx=+Ae.toFixed(2);const co=new Float32Array(257);{let e=0;for(let t=1;t<=256;t++)e+=1/Ne(Js((t-.5)/256),.35,2.5),co[t]=e;for(let t=1;t<=256;t++)co[t]*=Ra/e}const xt=e=>{const t=Ne(e,0,1)*256,n=Math.min(255,Math.floor(t));return Q(co[n],co[n+1],t-n)},ft=1200,_=24,U=-360,pe=-460,ve=34,le=42,ae=new Array(ve*le).fill(null),de=new Float32Array(ft+1),ue=new Float32Array(ft+1),we=new Float32Array(ft+1),be={dist:0,y:0};await a.yield();for(let e=0;e<=ft;e++){j.pointAt(e/ft,He),de[e]=He.x,ue[e]=He.y,we[e]=He.z;const t=Ne(Math.floor((He.z-pe)/_),0,le-1)*ve+Ne(Math.floor((He.x-U)/_),0,ve-1);(ae[t]||(ae[t]=[])).push(e),(e&127)===127&&await a.yield()}const ke=(e,t)=>{const n=Math.floor((e-U)/_),s=Math.floor((t-pe)/_);let l=1e12,d=-1;if(n>=0&&s>=0&&n<ve&&s<le)for(let p=Math.max(0,s-1);p<=Math.min(le-1,s+1);p++)for(let h=Math.max(0,n-1);h<=Math.min(ve-1,n+1);h++){const u=ae[p*ve+h];if(u!==null)for(let c=0;c<u.length;c++){const i=u[c],f=de[i]-e,m=we[i]-t,B=f*f+m*m;B<l&&(l=B,d=i)}}if(d<0||l>_*_)for(let p=0;p<=ft;p+=12){const h=de[p]-e,u=we[p]-t,c=h*h+u*u;c<l&&(l=c,d=p)}return be.dist=Math.sqrt(l),be.y=ue[d],be};await a.yield();const Me=J+6,De=e=>e>=-40?75-5*z(30,180,e)+4*Math.sin(e*.011+1.3)*z(40,120,e):e>Ft-14?Q(75,13,z(-40,-96,e)):Q(13,170,z(Ft-14,Ft-115,e)),Ue=e=>e>=-40?e>240?.0028*(e-240)*(e-240):0:Ae*z(-40,-96,e),Se=(e,t)=>Math.abs(e-Ue(t))-De(t),Re=e=>e<-.6?Ie:0,je={x:J+22,z:99,rx:21,rz:10},Ke={x:J-1.5,z:90.4,rx:5.6,rz:4.8},ze={x:64,z:44,rx:10,rz:17},Fe={x:J-9.5,z:36},Le={x:J+33,z:46.5,rx:6,rz:5},et=b.range(0,100),Ao=(e,t,n)=>{const s=((e-Ke.x)/Ke.rx)**2+((t-Ke.z)/Ke.rz)**2;return s<1.6?Math.max(n,Q(n,Ne(.62+.16*(t-Ke.z),.1,1.4)+.1*q.n2(e*.3,t*.3),z(1.5,.55,s))):n},st=(e,t)=>{const n=Se(e,t),s=6*z(9,-3,t);if(n>0){const i=1.9*z(.5,3.5,n),f=1.3*q.fbm2(e*.02+et,t*.02,3)*z(2,30,n),m=5.6*z(-66,-92,t)*z(Ft-24,Ft+2,t)*z(.5,6,n);return s+.5+i+m+f+n*.02+28*z(35,250,n)*(.6+.4*q.fbm2(e*.006+9,t*.006+et,2))}const l=-n;if(t<-.5){const i=Ie+.5-3.3*z(0,12,l)-.3*q.n2(e*.08+et,t*.08);return t>-47?Q(-8.2,i,z(-43,-47,t)):i}const d=z(74,52,t),p=z(182,168,t)*z(76,90,t);let u=.5-((Q(Q(2.9,1.05,p),7,d)+11.2*z(Z-80,Z-36,t))*z(0,Q(16,9,d),l)+.28*q.fbm2(e*.07+et,t*.07,2)*(1-.5*p)),c=((e-je.x)/je.rx)**2+((t-je.z)/je.rz)**2;return c<1.6&&(u=Q(u,1.25+.3*q.n2(e*.15,t*.15),z(1.5,.72,c))),u=Ao(e,t,u),c=((e-ze.x)/ze.rx)**2+((t-ze.z)/ze.rz)**2,c<1.6&&(u=Q(u,.6+.15*q.n2(e*.2,t*.2),z(1.5,.7,c))),c=((e-Fe.x)**2+(t-Fe.z)**2)/90,c<1.6&&(u=Q(u,-3.75+.12*q.n2(e*.35,t*.35),z(1.5,.3,c))),c=((e-Le.x)/Le.rx)**2+((t-Le.z)/Le.rz)**2,c<1.6&&(u=Q(u,-.5+.12*q.n2(e*.3,t*.3),z(1.5,.5,c))),t<14.5?Q(-8.2,u,z(11,14.5,t)):u},_e=(e,t,n)=>{let s=st(e,t);if(Se(e,t)<9){const l=ke(e,t);if(l.dist<11){const d=Math.min(l.y,Re(t))-2.05,p=z(68,78,t)*z(116,106,t)*z(J+4,J+8,e);d<s&&(s=Q(d,s,z(Q(4.5,3.4,p),Q(11,7.2,p),l.dist)))}}if(t>80&&t<100){const l=Ao(e,t,s);l>s&&(s=n?l:Q(s,l,z(1.6,3.4,ke(e,t).dist)))}return s},uo=(e,t)=>_e(e,t,!0),Ht=new o.Vector3(D.sun[0],D.sun[1],D.sun[2]).normalize(),Rn=Math.asin(Ht.y)*180/Math.PI,qn=Math.atan2(Ht.x,-Ht.z)*180/Math.PI,Vt=ti(N?{rng:b,preset:"night",bake:!0,renderer:a.renderer,bodyOverrides:{0:{elevation:Rn,azimuth:qn,size:2.6}},...D.sky}:{rng:b,preset:D.preset,sunElevation:Rn,sunAzimuth:qn,...D.sky});x.add(Vt.object);const ra=new o.Color(D.air),Jt=new o.Color(D.vol[0],D.vol[1],D.vol[2]),Vn=D.airK,zo=.0155,er=new o.Color(St[2]).multiplyScalar((.2126*D.vol[0]+.7152*D.vol[1]+.0722*D.vol[2])/(.2126*La.september.vol[0]+.7152*La.september.vol[1]+.0722*La.september.vol[2])),Ka=Jt.clone();x.fog=new o.FogExp2(ra.clone(),Vn),x.background=ra.clone();const Dt=oi(Vt,{intensity:D.light,ambient:D.amb,bounce:.35});x.add(Dt.object),await a.yield();const ia=Xt("#c2bba4"),tr=Xt("#77803f"),or=Xt("#a8a294"),ar=Xt(D.season==="july"?"#3c5428":"#3a4428"),Ln=Xt(D.season==="july"?"#7c8a3a":D.snow?"#9a8c5c":"#9a8236"),nr=Xt(D.season==="july"?"#5c6a34":"#7c3626"),sr=[.74,.77,.82],rr=Xt("#3c352a"),ir=(e,t,n,s,l)=>{const d=Se(e,t),p=Re(t),h=q.fbm2(e*.05+3,t*.05,3),u=q.n2(e*.4,t*.4);let c;if(d<0&&n<p+.3){c=ut(Te(ia,tr,Ne(.12+.6*h,0,.7)),.84+.16*u),c=Te(c,[.12,.17,.11],Ne((p-n)/7,0,1)*(t>150?.25:.42));{const i=z(qa[0],qa[1],p-n);c=[c[0]*Q(1,Va[0],i),c[1]*Q(1,Va[1],i),c[2]*Q(1,Va[2],i)]}}else d<0?c=Te(ut(or,.85+.15*u),Ln,z(.75,1.25,n-p)*.75):(c=Te(ar,Ln,z(16,4,d)*.85+.1*h),c=Te(c,nr,z(90,230,d)*(.55+.45*h)),c=Te(c,rr,z(1.2,.2,d)));return D.snow&&(d>1||n>p+.8)&&(c=Te(c,sr,z(.6,.85,s)*z(-.35,.2,h+.25*u)*.92)),l.setRGB(c[0],c[1],c[2])},Ut=[-300,-400,350,450],eo=3,la=eo*32,_n=Math.round((Ut[2]-Ut[0])/la),Gn=Math.round((Ut[3]-Ut[1])/la),Ea=(Ut[0]+Ut[2])/2-_n*la/2,Na=(Ut[1]+Ut[3])/2-Gn*la/2,Ha=_n*32,Ua=Gn*32,Wa=Ha+1,Oo=new Float32Array(Wa*(Ua+1)).fill(NaN);{let e=0;for(let t=0;t<Ua;t+=8)for(let n=0;n<Ha;n+=8){const s=ke(Ea+(n+4)*eo,Na+(t+4)*eo).dist-17,l=s<52?1:s<100?2:s<190?4:8;for(let d=0;d<=8;d+=l)for(let p=0;p<=8;p+=l){const h=(t+d)*Wa+n+p;Oo[h]!==Oo[h]&&(Oo[h]=_e(Ea+(n+p)*eo,Na+(t+d)*eo),e++)}e>500&&(e=0,await a.yield())}}const lr=(e,t)=>{const n=(e-Ea)/eo,s=(t-Na)/eo,l=Math.round(n),d=Math.round(s);if(Math.abs(n-l)>.001||Math.abs(s-d)>.001||l<0||d<0||l>Ha||d>Ua)return _e(e,t);const p=d*Wa+l,h=Oo[p];return h===h?h:Oo[p]=_e(e,t)};await a.yield();const hr=Sn.makeDetailTexture({rng:b.fork("detail"),size:96,anisotropy:4});await a.yield();const ha=await Sn.makeTerrainAsync({rng:b.fork("terrain"),noise:q,height:lr,path:j,corridor:!1,bounds:Ut,cell:eo,near:40,levels:5,maxTriangles:44e3,detailTexture:hr,biome:"tundra",palette:{snow:null,rock:"#4a4034",rockB:"#3a3228",rockSlope:[.45,.75],strata:.1,pebbles:.9,cracks:.05,tufts:.5,clouds:N?0:.4,patchAmount:.12},color:ir,sunDir:Ht,skirt:20},a.yield);x.add(ha.object),await a.yield();const Ge={...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:he.uTime,uSun:he.uSun,uSunCol:he.uSunCol,uSkyCol:he.uSkyCol,uGndCol:he.uGndCol,uCam:he.uCam,uWave:{value:new o.Vector4(0,0,-100,0)},uDusk:{value:0},uPool:{value:new o.Color(St[2])},uAmber:{value:new o.Color(St[1])},uWhite:{value:new o.Color(St[5])},uGold:{value:new o.Color(D.gold)},uHorizon:oe.waterUniforms.uHorizon,uSkyHor:{value:Vt.horizonColor.clone().multiplyScalar(N?1:.85)},uVol:{value:Jt},uBedCol:{value:new o.Color(ia[0],ia[1],ia[2])},uLeaf:{value:D.leaf*.11},uRain:{value:D.rain?1:0},uGoldAmt:{value:D.birch?1:.3},uGlint:{value:D.weather==="rain"?.25:N?.8:1.5},uCeil:{value:Jt.clone().multiplyScalar(1.5)},uWK:{value:zo},uComp:{value:Array.from({length:8},()=>new o.Vector4(0,0,0,1))},uCompS:{value:[0,0,0,0,0,0,0,0]},uRing:{value:Array.from({length:8},()=>new o.Vector4(0,0,0,0))},uSunAir:{value:he.uSunCol.value.clone()},uSkyAir:{value:he.uSkyCol.value.clone()},uDuck:{value:Array.from({length:8},()=>new o.Vector4(0,0,99,0))},uDuckT:{value:-1},uDuckL:{value:[99,99,99,99,99,99,99,99]},uSubm:{value:new o.Vector2(0,0)},uDrown:{value:new o.Color(.2,.02,.02)},uMirK:{value:.2},uLedge:{value:Array.from({length:16},()=>new o.Vector4(0,1,6,0))},uJetX:{value:new Array(24).fill(1e4)},uHole:{value:new o.Vector4(0,-100,0,1)},uHoleAx:{value:new o.Vector3(1,0,0)},uHoleK:{value:.95},uRaft:{value:new o.Vector4(Fe.x-9,21,23,18)},tTrees:{value:null},uTreeMap:{value:new o.Vector4(-210,-400,1/420,1/850)},uGoldRef:{value:new o.Color(.3,.18,.02)},uSpruceRef:{value:new o.Color(.02,.04,.03)},uSpruceLit:{value:new o.Color(.11,.24,.1)},uHazeK:{value:D.airK*1.15},uPortalR:{value:new o.Vector4(Ae,6.5,Ft,6)},uPortalCol:{value:new o.Color(N?"#b8ccff":"#d4ecff").multiplyScalar(N?.5:.8)}},to={nx:210,nz:425,x0:-210,z0:-400,cell:2,data:new Uint8Array(210*425*4)};oe.waterUniforms.uUnder.value.copy(Jt),he.uUnderC.value.copy(Jt);const Kn=new o.ShaderMaterial({uniforms:Ge,vertexShader:si,fragmentShader:ri,fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide});{const e=[],t=[],n=[],s=[];let l=0;const d=(i,f,m,B)=>{for(let S=0;S<i.length;S++){const r=i[S],M=Math.min(De(r)+7,190),C=Ue(r);for(let v=0;v<=f;v++){const k=v/f*2-1,w=C+Math.sign(k)*Math.pow(Math.abs(k),1.25)*M,y=m(w,r),g=Math.max(0,y-_e(w,r)),F=r>0?z(182,168,r)*z(76,90,r)*z(2.6,1.2,g):0,P=r>0?Math.exp(-Math.max(r,0)/6.5)*z(-.6,1.5,r):0;e.push(w,y-.78*P,r),t.push(g,F,z(.25,.8,P),B),s.push(B&&r>-47?Math.max(0,y-oe.rockTop(w,r)):g)}}for(let S=0;S<i.length-1;S++)for(let r=0;r<f;r++){const M=l+S*(f+1)+r,C=M+f+1;n.push(M,C,M+1,M+1,C,C+1)}l+=i.length*(f+1)},p=[];for(let i=0;i<=104;i++){const f=i/104;p.push(.35+449*(.35*f+.65*f*f))}d(p.slice(0,36),52,()=>0,0),await a.yield(),d(p.slice(35,71),52,()=>0,0),await a.yield(),d(p.slice(70),52,()=>0,0),await a.yield();const h=[];for(let i=0;i<=62;i++){const f=i/62;h.push(-.62-399*(.3*f+.7*f*f))}d(h,40,(i,f)=>(f>-12?oe.surfaceAt(i,f):Ie)-.03,1);const u=new o.BufferGeometry;u.setAttribute("position",new o.Float32BufferAttribute(e,3)),u.setAttribute("aD",new o.Float32BufferAttribute(t,4)),u.setAttribute("aBed",new o.Float32BufferAttribute(s,1)),u.setIndex(n);const c=new o.Mesh(u,Kn);c.name="river",c.renderOrder=0,c.frustumCulled=!1,x.add(c)}await a.yield();const wt=ei.makeUnderwater({rng:b.fork("uw"),sky:Vt,surfaceY:0,floorY:-7,water:"#62a878",deep:"#1f5a44",fogDensity:zo,rays:!1,particles:{count:Math.round(520*E),range:36,size:.045,color:"#d8e8c8",glowFraction:0},bubbles:{count:Math.round(450*E),size:.03,sources:[[J-6,-6.5,7],[J+7,-6.5,8],[J+16,-6.5,9],[Ae+12,-6.5,8],[Ae+5,-6.5,9.5],[J+1,-6.5,12]]},caustics:{scale:3.4,intensity:5.2,speed:.6,color:"#f6ffd8"}});wt.surface&&(wt.surface.visible=!1),x.add(wt.object),wt.applyCaustics(ha.material);const cr=1,ur=2.4;{const e=ha.material,t=e.onBeforeCompile,n=e.customProgramCacheKey(),s=["#include <color_fragment>","#include <roughnessmap_fragment>"],l=["diffuseColor","vTWorld","vKitWorld","uKitAbsorb","uKitAbsorbK","uCausSurf","uTWetTint","gTWet","gTGrad"];e.onBeforeCompile=(d,p)=>{t.call(e,d,p);const h=d.fragmentShader;typeof h!="string"||!s.every(u=>h.includes(u))||!l.every(u=>new RegExp("\\b"+u+"\\b").test(h))||(d.fragmentShader=h.replace(s[0],s[0]+`
 vec3 bedOwn = diffuseColor.rgb;`).replace(s[1],`{ float ease = smoothstep(${cr.toFixed(1)}, ${ur.toFixed(1)}, (vTWorld.z < -.6 ? ${Ie.toFixed(1)} : 0.) - vTWorld.y);
  vec3 own = bedOwn*mix(vec3(1.), uKitAbsorb, 1. - exp(-max(uCausSurf - vKitWorld.y, 0.)*uKitAbsorbK))*mix(vec3(1.), uTWetTint, gTWet);
  diffuseColor.rgb = mix(diffuseColor.rgb, own, ease); gTGrad *= 1. - ease; }
`+s[1]))},e.customProgramCacheKey=()=>n+"|bed-runs",e.needsUpdate=!0}const fr=[wt.rays,wt.particles,wt.bubbles].filter(Boolean).map(e=>e.material.uniforms.uSurf);await a.yield();const fo=new o.Vector3(-Ht.x*.62,-Math.sqrt(Math.max(1-(1-Ht.y*Ht.y)*.565,.05)),-Ht.z*.62).normalize(),At={uTime:he.uTime,uSun:he.uSun,uSunCol:he.uSunCol,uSkyCol:he.uSkyCol,uGndCol:he.uGndCol,uCam:he.uCam},dt={...o.UniformsUtils.clone(o.UniformsLib.fog),...At,uVolC:{value:Jt},uAbove:{value:0},uFogF:{value:1},uGainF:{value:1},uGainR:{value:1},uFarK:{value:1},uGrow:{value:1},uFan:{value:new o.Vector2(0,0)},uBoil:{value:new o.Vector4(15,34,99,1)},uShaftD:{value:fo}},Wt=new o.ShaderMaterial({uniforms:dt,vertexShader:Io,fragmentShader:sa,fog:!0,vertexColors:!0,side:o.DoubleSide});await a.yield();const It=Da(St,D.season);await a.yield();const En=Da(St,D.season,8,1);await a.yield();const oo=Ti(St,D.season),jt=Os(St,D.season);Ge.uDrown.value.setRGB(jt.red[0]*.66,jt.red[1]*.66,jt.red[2]*.66),await a.yield();const Ia={...o.UniformsUtils.clone(o.UniformsLib.fog),...At,uShaftD:dt.uShaftD,uVolC:{value:Jt},uAbove:dt.uAbove,uFogF:{value:1},uGainF:dt.uGainF,uGainR:dt.uGainR,uFarK:dt.uFarK,uRed:{value:new o.Color(jt.red[0],jt.red[1],jt.red[2])},uOlive:{value:new o.Color(jt.olive[0],jt.olive[1],jt.olive[2])}},dr=new o.ShaderMaterial({uniforms:Ia,vertexShader:Es,fragmentShader:Ns,fog:!0,side:o.DoubleSide}),Lt=new o.BufferGeometry;Lt.setAttribute("position",new o.Float32BufferAttribute([0,-.36,-1.08,0,-.36,.93,0,.36,.93,0,.36,-1.08,-.19,.02,-1.08,-.19,.02,.93,.19,.02,.93,.19,.02,-1.08],3)),Lt.setAttribute("aQ",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0,-1,-1,1,1,-1,1,1,1,1,-1,1,1],3)),Lt.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);const ja=e=>e>64?Q(Me-1.8,J+2.6,z(Z-60,Z-170,e)):J+2,mr=e=>[Me+3.9+5.4*z(Z-46,Z+8,e)+2.6*Math.sin(e*.045+1)*z(Z-50,Z-90,e),Q(Q(-8.6,-2.5,z(Z-4,Z-38,e)),-1.5,z(Z-44,Z-72,e))],Nn=[{name:"entry",z0:170,z1:Z+36,cx:ja,spread:13,far:3e3,mid:470,ribbon:.62,burst:.3},{name:"riffle",z0:78,z1:170,cx:ja,spread:9,far:1200,mid:172,ribbon:0,burst:.15},{name:"pool",z0:15.5,z1:76,cx:()=>J+10,alt:Ae+6,spread:22,far:2800,mid:330,ribbon:0,burst:0},{name:"foot",z0:9.8,z1:17,cx:()=>Ae+1,spread:13,far:500,mid:92,ribbon:0,burst:0},{name:"upper",z0:-96,z1:-13,cx:()=>Ae,spread:5,far:700,mid:82,ribbon:0,burst:0}];let kt=0;const Oa=(e,t)=>{const n=e-Fe.x,s=t-Fe.z;return n*n+s*s<56||n>-3.5&&e<J+1.4&&s>-6.5-.4*n&&s<6.5+4.4*n},pr=async(e,t,n,s,l,d,p)=>{const h=new Float32Array(t*4),u=new Float32Array(t*4),c=new Float32Array(t*4);let i=0;for(let f=0;i<t&&f<t*14;f++){(f&(p?63:15))===(p?63:15)&&await a.yield();const m=b.range(e.z0,e.z1),B=!p&&b()<e.ribbon,S=B?mr(m):null,r=e.alt!==void 0&&b()<.45?e.alt:e.cx(m);let M=B?(m>Z-44&&b()<.45?2*Me-1-S[0]:S[0])+b.gauss()*1.7:r+Ne(b.gauss(),-2.6,2.6)*e.spread*l*(e.name==="upper"&&m<-50?1.6:1);if(Se(M,m)>-4)continue;const C=m<9.7&&m>-47.5;if(C&&Math.abs(M-Ae)>6)continue;const v=C?4:m<14.5?-6.6:uo(M,m),k=Re(m)-d-(m>0?1.3*z(42,24,m):0),w=v+.42;if(k-w<.25)continue;const y=B?Math.min(k,S[1]+b.gauss()*.75):Q(w,k,Math.pow(b(),.8));if(y<w)continue;const g=m>Z-28?Math.max(s,7.5):s;if(!B&&m>Z-46&&m<Z+30){const P=(Z-m)/42;if(Math.hypot(M-(Me+4*P),y-(_a-1.4*P))<4.5+3*Ne(P,0,1))continue}if(m>Z-12&&Math.hypot(M-Me,y-_a,Math.max(m-Z-22,Z-m,0))<(p?15:5))continue;if(p){const P=ke(M,m);if(Math.hypot(P.dist,y-P.y)<g)continue}else if(j.distanceTo(M,y,m)<g)continue;const F=b()<e.burst&&m>e.z0+45;if(h[i*4]=M,h[i*4+1]=y,h[i*4+2]=m,h[i*4+3]=b(),u[i*4]=Q(.85,1.15,(b.range(.82,1.22)-.82)/.4)*n*(m<90&&m>15&&Oa(M,m)?0:1),u[i*4+1]=p?Ne(b.gauss()*.42,-1.2,1.2):b.range(-.16,.16)*(e.name==="pool"?1.8:1),u[i*4+2]=F?b.range(3.5,7):0,u[i*4+3]=F?b.range(32,m-e.z0-6):1,c[i*4]=b(),c[i*4+1]=b.range(-.07,.07),c[i*4+2]=F?b.range(11,15):b.range(4.5,7.5),c[i*4+3]=F?.35:1,F){const P=Gi(Mo,h[i*4],h[i*4+1],h[i*4+2],u[i*4],u[i*4+1],c[i*4+1],u[i*4+3]);P>0?u[i*4+3]=P:(u[i*4+2]=0,u[i*4+3]=1,c[i*4+2]=4.5+(c[i*4+2]-11)*.75,c[i*4+3]=1)}i++}return{iA:h,iB:u,iC:c,count:i}},ca=[];for(const e of Nn){const t=(e.z0+e.z1)/2,n=new o.Sphere(new o.Vector3(e.cx(t),e.name==="upper"?4:-4,t),(e.z1-e.z0)/2+e.spread*2.6+30);for(const[s,l,d,p,h,u]of[[!0,Math.round(e.far*se*(.4+.6*E)),1,13,1,.98],[!1,Math.round(e.mid*se*(.6+.4*E)),1,2.8,.46,.78]]){const c=await pr(e,l,d,p,h,u,s),i=Math.min(c.count,Math.round(l*Math.min(1,1.15/se)));let f;if(s){f=new o.InstancedBufferGeometry,f.index=Lt.index,f.setAttribute("position",Lt.getAttribute("position")),f.setAttribute("aQ",Lt.getAttribute("aQ"));for(const B of["iA","iB","iC"])f.setAttribute(B,new o.InstancedBufferAttribute(c[B],4));f.instanceCount=i,f.boundingSphere=n}else f=gt(oo,i,{iA:c.iA,iB:c.iB,iC:c.iC},n);const m=new o.Mesh(f,s?dr:Wt);m.name=(s?"shoal-far-":"shoal-")+e.name,m.userData.airBack=e.name==="entry"?10:0,m.userData.uMax=e.name==="upper"?2:L.leapBreak+.0015,m.userData.zr=[e.z0-(e.name==="entry"?10:e.name==="riffle"?48:56),e.name==="upper"?13:e.z1+(e.name==="pool"?16:62)],x.add(m),ca.push(m),kt+=i,await a.yield()}}{const e=Me+4.5,t=[[[Me+10,-10.6,Z-2],[Me+9.5,-8.6,Z-16],[Me+8,-6,Z-30],[Me+5.2,-1.9,Z-41.5],[Me+2.6,-2.3,Z-55],[Me+2.2,-1.7,Z-70]],[[Me-9,-10.6,Z-4],[Me-6.5,-10.9,Z-14],[Me-1,-10.7,Z-24],[Me+3.4,-7.6,Z-34],[e+.6,-2,Z-42],[Me+3.2,-2.4,Z-56],[Me+2.6,-1.8,Z-70]]],n=Math.round(150*se*(.6+.4*E)),s=new Float32Array(n*4),l=new Float32Array(n*4),d=new Float32Array(n*4),p=new o.Vector3,h=new o.Vector3;let u=0;const c=t.map(f=>new o.CatmullRomCurve3(f.map(m=>new o.Vector3(m[0],m[1],m[2])),!1,"centripetal"));await a.yield();for(let f=0;u<n&&f<n*8;f++){(f&31)===31&&await a.yield();const m=c[f&1],B=Math.pow(me(),.8)*.97;m.getPoint(B,p),m.getPoint(B+.02,h),h.sub(p).normalize();const S=p.x+me.gauss()*1.05,r=p.y+me.gauss()*.55,M=p.z+me.gauss()*1.6;r>-1.15||r<_e(S,M)+.5||j.distanceTo(S,r,M)<3.8||j.distanceTo(S,r+1.6,M)<3.8||(s.set([S,r,M,me()],u*4),l.set([Q(.9,1.15,(me.range(1.12,1.5)-1.12)/.38),Math.atan2(-h.x,-h.z)+me.range(-.12,.12),0,1],u*4),d.set([me(),Math.asin(Ne(h.y,-.8,.8)),me.range(5,8),.7],u*4),u++)}const i=new o.Mesh(gt(oo,u,{iA:s,iB:l,iC:d},new o.Sphere(new o.Vector3(Me+3,-6,Z-36),60)),Wt);i.name="ribbon",i.userData.zr=[Z-120,Z+60],x.add(i),ca.push(i),kt+=u,await a.yield()}const Bt=[],ua=60,Hn=20,Un=[],So=e=>{const t=e.isInstancedMesh,n=t?e.instanceMatrix.array:e.geometry.getAttribute("iA").array,s=t?null:e.geometry.getAttribute("iB").array,l=t?e.count:e.geometry.instanceCount;let d=1/0,p=-1/0;for(let h=0;h<l;h++){if(s&&s[h*4]===0)continue;const u=t?n[h*16+14]:n[h*4+2];d=Math.min(d,u),p=Math.max(p,u)}if(!t){const h=e.geometry.getAttribute("iC").array,u=[1/0,1/0,1/0],c=[-1/0,-1/0,-1/0];let i=-1/0;const f=e.geometry.getAttribute("position");let m=0,B=0;for(let S=0;S<f.count;S++)m=Math.max(m,Math.abs(f.getZ(S))),B=Math.max(B,f.getY(S));for(let S=0;S<l;S++)if(s[S*4]!==0){for(let r=0;r<3;r++){const M=n[S*4+r];u[r]=Math.min(u[r],r===2&&s[S*4+2]>0?M-s[S*4+3]:M),c[r]=Math.max(c[r],M)}i=Math.max(i,n[S*4+1]+.14*h[S*4+3]+s[S*4]*(m*Math.abs(Math.sin(h[S*4+1]))+B))}u[2]<=c[2]&&!e.geometry.boundingSphere&&(e.geometry.boundingSphere=new o.Sphere(new o.Vector3((u[0]+c[0])/2,(u[1]+c[1])/2,(u[2]+c[2])/2),Math.hypot(c[0]-u[0],c[1]-u[1],c[2]-u[2])/2+2.4),e.frustumCulled=!0),e.userData.boiled=i<0&&c[2]+2.4<e.material.uniforms.uBoil.value.x}if(!t&&e.material.uniforms.uGrow===dt.uGrow){const h=e.material;e.material=new o.ShaderMaterial({uniforms:{...h.uniforms,uGrow:{value:0}},vertexShader:h.vertexShader,fragmentShader:h.fragmentShader,fog:h.fog,vertexColors:h.vertexColors,side:h.side})}e.userData.sight=[d,p],Un.push(e)},vr=15,fa=.125*Pe,Qa=[],Co=(e,t,n,s,l)=>{let d=1e9;for(let p=-2;p<=2;p++){const h=p*.5*s;d=Math.min(d,j.distanceTo(e-Math.sin(l)*h,t,n-Math.cos(l)*h))}return d-.17*s},Ya=async(e,t)=>{for(const n of ca){if(n.name.startsWith("shoal-far"))continue;const s=n.geometry.getAttribute("iA").array,l=n.geometry.getAttribute("iB"),d=n.geometry.instanceCount;let p=!1;for(let h=0;h<d;h++){const u=s[h*4],c=s[h*4+1],i=s[h*4+2];for(const f of e)if(Math.abs(i-f[2])<t&&Math.abs(u-f[0])<t&&Math.hypot(u-f[0],c-f[1],i-f[2])<t){l.array[h*4]=0,p=!0;break}}p&&(l.needsUpdate=!0),await a.yield()}};{const e=[[.04,.125,18],[L.arc3+.035,L.missBreak-.01,18],[L.missFall+.01,L.tailUp-.02,10],[L.slantTo+.02,L.leapBreak-.008,7],[L.splash+.006,L.surface-.004,4],[L.slantTo+.03,L.leapBreak-.006,9,b.fork("dive")]],t=new o.Vector3,n=new o.Vector3;for(const[s,l,d,p=b]of e){const h=new Float32Array(d*4),u=new Float32Array(d*4),c=new Float32Array(d*4);let i=0;for(let m=0;i<d&&m<400;m++){(m&15)===15&&await a.yield();const B=p.range(s,l);j.pointAt(B,t),j.tangentAt(B,n);const S=p.sign()*p.range(2.7,5.2),r=t.x-n.z*S,M=t.z+n.x*S,C=t.y+p.range(-1.5,.5);Se(r,M)>-4||C>Re(M)-.45||C<uo(r,M)+.45||j.distanceTo(r,C,M)<2.6||M<9.7&&M>-47.5&&(Math.abs(r-Ae)>6||C<4.45)||M<14.5&&M>=9.7&&C<-6.2||(h[i*4]=r,h[i*4+1]=C,h[i*4+2]=M,h[i*4+3]=p(),u[i*4]=p.range(.9,1.15)*(M<90&&M>15&&Oa(r,M)?0:1),u[i*4+1]=p.range(-.2,.2),u[i*4+2]=0,u[i*4+3]=1,c[i*4]=p(),c[i*4+1]=p.range(-.06,.06),c[i*4+2]=p.range(5,8),c[i*4+3]=.6,i++)}const f=new o.Mesh(gt(It,i,{iA:h,iB:u,iC:c}),Wt);if(f.name="neighbours",f.frustumCulled=!1,f.userData.ur=[s-(s>.6?.02:.006),l+.07],s>.4&&(x.add(f),Bt.push(f),kt+=i),!f.parent){const m=f.geometry,B={iA:[],iB:[],iC:[]};for(let r=0;r<i;r++)if(u[r*4]!==0)for(const M in B)B[M].push(...m.getAttribute(M).array.subarray(r*4,r*4+4));const S=B.iB.length/4;for(const r in B)m.setAttribute(r,new o.InstancedBufferAttribute(new Float32Array(B[r]),4));m.instanceCount=S,S&&(x.add(f),So(f),kt+=S)}for(let m=0;m<i;m++)Qa.push([h[m*4],h[m*4+1],h[m*4+2]]);await a.yield()}{const s=nt(((a.seed??1)|0)*4409+1553>>>0),l=vr,d=fa,p=Math.round((d-l)/3.4),h=[0,1].map(()=>({iA:[],iB:[],iC:[]}));for(let c=0;c<p;c++){const i=c%3===1?1:0,f=c%2?1:-1;for(let m=0;m<14;m++){const B=l+(d-l)*(c+s.range(.2,.8))/p;j.posAtDist(B,t),j.tangentAtDist(B,n);const S=Math.hypot(n.x,n.z)||1,r=f*s.range(2.65,3.4),M=t.x-n.z/S*r,C=t.z+n.x/S*r,v=t.y+s.range(-.85,.3),k=s.range(.97,1.15),w=s.range(-.12,.12),y=s(),g=s(),F=s.range(-.05,.05),P=s.range(5,7.5);if(!(v>Re(C)-.5||v<_e(M,C)+.45||Co(M,v,C,k,w)<2.6||i&&(Co(M,v,C,k,w+.26)<2.6||Co(M,v,C,k,w-.26)<2.6))){h[i].iA.push(M,v,C,y),h[i].iB.push(k,w,0,i?1.26:1),h[i].iC.push(g,F,P,.3);for(let H=-1;H<=1;H++)Qa.push([M-Math.sin(w)*H*.6*k,v,C-Math.cos(w)*H*.6*k]);break}}}await a.yield();const u=Da(St,D.season,12,2,{male:1.7});await a.yield();for(let c=0;c<2;c++){const i=h[c].iA.length/4;if(!i)continue;const f=new o.Mesh(gt(c?u:It,i,{iA:h[c].iA,iB:h[c].iB,iC:h[c].iC}),Wt);f.name=c?"entry-males":"entry-file",f.frustumCulled=!1,x.add(f),So(f),kt+=i}await a.yield()}await Ya(Qa,1.15)}{const e=b.fork("queue"),t=Math.round(58*Math.min(se,1)),n=[0,1].map(()=>({iA:new Float32Array(t*4),iB:new Float32Array(t*4),iC:new Float32Array(t*4),c:0}));let s=0;for(let l=0;s<t&&l<600;l++){(l&31)===31&&await a.yield();const d=Ae+e.range(-10,7),p=e.range(10.3,17.5),h=e.range(-5.4,-.95),u=j.distanceTo(d,h,p);if(u<2.6)continue;const c=n[u<5.5?0:1];c.iA.set([d,h,p,e()],c.c*4),c.iB.set([e.range(.9,1.15),e.range(-.4,.4),0,1],c.c*4),c.iC.set([e(),e.range(.3,.95),e.range(6,9),.5],c.c*4),c.c++,s++}for(let l=0;l<2;l++){const d=n[l];if(!d.c)continue;const p=new o.Mesh(gt(l?En:It,d.c,{iA:d.iA,iB:d.iB,iC:d.iC}),Wt);p.name=l?"queue-far":"queue",p.frustumCulled=!1,p.userData.ur=[L.slantTo+.014,L.leapBreak+.0015],x.add(p),Bt.push(p)}kt+=s,await a.yield()}{const e=nt(((a.seed??1)|0)*5021+17>>>0),t=Math.round(13*Math.min(se,1)),n=new Float32Array(t*4),s=new Float32Array(t*4),l=new Float32Array(t*4);let d=0;for(let h=0;d<t&&h<300;h++){const u=J+e.range(10.5,31),c=9.9+e()*Math.min(5.5,.42*(u-J-8.5)),i=e.range(-4.6,-1.5),f=e(),m=e.range(.9,1.15),B=e.range(-.35,.35),S=e(),r=e.range(.08,.55),M=e.range(6,9);j.distanceTo(u,i,c)<2.9||(n.set([u,i,c,f],d*4),s.set([m,B,0,1],d*4),l.set([S,r,M,.5],d*4),d++)}await a.yield();const p=new o.Mesh(gt(It,d,{iA:n,iB:s,iC:l}),Wt);p.name="boilHolders",p.frustumCulled=!1,p.userData.ur=[L.missFall-.002,L.tailUp-.02],x.add(p),Bt.push(p),kt+=d,await a.yield()}const gr=[[7,-3,-.62],[7.4,3.1,-.66],[3.7,-2.45,-.72],[3.9,2.5,-.75],[11.5,-5.2,-.8],[11,5.4,-.86],[15.5,-3.4,-.7],[16,3.8,-.74]],$a=[[7.7,-2.7,-.82],[8.1,2.8,-.86]],ao=new Float32Array(32),mo=new Float32Array(32),da=new Float32Array(32);for(let e=0;e<8;e++)ao[e*4+3]=b(),mo[e*4]=b.range(.95,1.12),mo[e*4+3]=1,da[e*4]=b(),da[e*4+2]=b.range(8.5,10.5);const Wn=Da(St,D.season,16);await a.yield();const po=gt(Wn,8,{iA:ao,iB:mo,iC:da});po.getAttribute("iA").setUsage(o.DynamicDrawUsage),po.getAttribute("iB").setUsage(o.DynamicDrawUsage),po.getAttribute("iC").setUsage(o.DynamicDrawUsage);const ma=new o.Mesh(po,Wt);ma.name="companions",ma.frustumCulled=!1,x.add(ma),await a.yield();const Xa=[];{const e=L.shoal+.035,t=L.slantTo-.012,n=new o.Vector3,s=(t-e)*Pe,l=new o.ShaderMaterial({uniforms:{...dt,uBoil:{value:new o.Vector4(5,11,.55,.6)}},vertexShader:Io,fragmentShader:sa,fog:!0,vertexColors:!0,side:o.DoubleSide}),d=Math.max(6,Math.round(s/3)),p=Math.round(9*se);for(const[h,u,c]of[[!0,d,Wn],[!1,p,oo]]){const i=new Float32Array(u*4),f=new Float32Array(u*4),m=new Float32Array(u*4);let B=0;for(let r=0;r<u;r++){const M=h?e+(t-e)*(r+.2+.6*te())/u:te.range(e,t);j.pointAt(M,n);const C=h?te.range(2.9,3.9):te.range(5.8,11.5),v=h?te.range(1,1.15):te.range(.9,1.15),k=n.x+te.range(-1,1)*(h?.5:2.5),w=n.z-C,y=(h?.13:.03)-.37*v,g=te(),F=te(),P=h?(r%2?1:-1)*te.range(.4,.75):te.range(-.28,.28),H=te.range(5,7.5);w<12.5||w>40||Math.abs(k)>60||j.distanceTo(k,y,w)<2.9||(i.set([k,y,w,g],B*4),f.set([v,P,0,1],B*4),m.set([F,.03,H,.32],B*4),B++,Xa.push([k,w]))}const S=new o.Mesh(gt(c,B,{iA:i,iB:f,iC:m}),l);S.name=h?"holders":"holders-far",S.frustumCulled=!1,S.userData.ur=[L.shoal-.01,L.leapBreak-.01],x.add(S),Bt.push(S),kt+=B,await a.yield()}{const h=nt(((a.seed??1)|0)*6151+4409>>>0),u=Math.round(84*Math.min(se,1)),c=L.splash+.002,i=.9,f=new Float32Array(u*4),m=new Float32Array(u*4),B=new Float32Array(u*4);let S=0;for(let M=0;M<u*3&&S<u;M++){const C=c+(i-c)*Math.pow(h(),1.7);j.pointAt(C,n);const v=(h()<.5?-1:1)*(6.2+9*Math.pow(h(),1.4)),k=h.range(.9,1.15),w=n.x+v,y=n.z+h.range(-3,3),g=Ie+.15-.37*k,F=h(),P=h(),H=h.range(-.3,.3),K=h.range(5,7.5);y>-11||Se(w,y)>-2.2||(y>-47.5?oe.rockTop(w,y):_e(w,y))>5.05||j.distanceTo(w,g,y)<5.6||(f.set([w,g,y,F],S*4),m.set([k,H,0,1],S*4),B.set([P,.03,K,.32],S*4),S++)}const r=new o.Mesh(gt(oo,S,{iA:f,iB:m,iC:B}),l);r.name="holders-upper",r.frustumCulled=!1,r.userData.ur=[L.leapBreak,1.01],x.add(r),Bt.push(r),kt+=S,await a.yield()}}const Mt=new o.Vector3,ct=new o.Vector3,wr=Ge.uComp.value,yr=Ge.uCompS.value,pa=[0,0,0],vo=4.5,In=[.62,.98],br=.24,va=[],jn=Ge.uRing.value,Za=new Float32Array(8),Ja=new Float32Array(8);{let e=null;const t=Math.ceil(Pe/.3);for(let n=0;n<=t;n++){const s=Math.min(n*.3,Pe);j.posAtDist(s,Mt);const l=Mt.y-(Mt.z<-.6?Ie:0)>.8;e!==null&&l!==e&&va.push(s),e=l,(n&255)===255&&await a.yield()}}let no=null;const Qo=(e,t)=>{const n=e*Pe,s=z(L.leapBreak-.055,L.leapBreak-.012,e)*(1-z(L.splash,L.splash+.02,e)),l=z(L.leapBreak-.03,L.leapBreak-.005,e)*(1-z(L.snap+.003,L.apex-.001,e)),d=L.surface,p=z(d+.03,d+.085,e),h=1-z(L.slantTo-.035,L.slantTo-.005,e),u=xt(e),c=Ge.uDuck.value,i=Ge.uDuckL.value;for(let f=0;f<8;f++){const m=gr[f],B=ao[f*4+3]*6.283,S=f<2?h:0;pa[0]=f<2?Q(m[0],$a[f][0],S):m[0],pa[1]=f<2?Q(m[1],$a[f][1],S):m[1],pa[2]=f<2?Q(m[2],$a[f][2],S):m[2];const r=pa;let M=Q(r[0]+Math.sin(t*.31+B)*.5,-6-f*.7,r[1]<0&&f!==2?s:0)-(f===2?1.3*l:0);f<2&&(M=Q(M,5.4+.5*f,p)),j.posAtDist(Math.max(n+M,0),Mt),j.tangentAtDist(Math.max(n+M,0),ct);const C=(r[1]+Math.sin(t*.43+B*2)*.22)*(f<2?Q(1,.56,p):1),v=Math.hypot(ct.x,ct.z)||1,k=Mt.z<-.6?Ie:0,w=G=>{const $=Mt.z+ct.x/v*C*G;return($>14.5||$<-47)&&_e(Mt.x-ct.z/v*C*G,$)>k-.8};let y=1;if(w(1)){let G=.4,$=1;for(let O=0;O<6;O++){const ee=(G+$)*.5;w(ee)?$=ee:G=ee}y=G}const g=C*y,F=Mt.x-ct.z/v*g,P=Mt.z+ct.x/v*g;let H=Mt.y+r[2]+Math.sin(t*.6+B*3)*.08-(f===2?1.9*l:0);if(P<-30){let G=0;for(let $=0;$<8;$++){const O=c[$],ee=Math.max(u-O.z,0),Ce=2.5*ee+1.6*ee*ee;Ce<i[$]&&(G=Math.max(G,z(2.6,1.5,Math.hypot(O.x+Math.sin(O.w)*Ce-F,O.y+Math.cos(O.w)*Ce-P))))}H-=1.5*G}const K=P<-.6?(P>-12?oe.surfaceAt(F,P):Ie)-.03:-.78*Math.exp(-Math.max(P,0)/6.5)*z(-.6,1.5,P),V=Mt.y-K,T=z(In[0],In[1],V),W=K+br-.37*mo[f*4]+Math.sin(t*.6+B*3)*.03;H=Q(H>=W?W:Q(H,W,z(W-1.1,W-.5,H)),H+.45*T,T),Za[f]=Math.max(n+M,0),Ja[f]=g,P>14.5||P<-47?H=Math.max(H,_e(F,P)+.5):P<-6&&(H=Math.max(H,4.45)),ao[f*4]=F,ao[f*4+1]=H,ao[f*4+2]=P,mo[f*4+1]=Math.atan2(-ct.x,-ct.z)+(f===2?-.36:f===3?.36:0)*z(.6,2.2,H-(P<-.6?Ie:0)),da[f*4+1]=Math.asin(Ne(ct.y,-.95,.95))*.9*(V>-.15?Q(.3,1,T):1);const A=K,R=H+.37*mo[f*4];if(wr[f].set(F,P,ct.x/v,ct.z/v),yr[f]=z(-.14,.1,R-A)*(1-z(.25,.7,H-A))*(P>16||P<-4?1:0),no){const G=no,$=H-K>.25?1:0,O=ct.x/v,ee=ct.z/v,Ce=mo[f*4],Ve=G.P.array,lt=G.V.array;for(let Be=0;Be<G.ND;Be++){const re=f*G.ND+Be,qe=G.loc[re*7]*Ce,yt=G.loc[re*7+1],We=G.loc[re*7+3],$e=G.loc[re*7+4];Ve[re*4]=F+O*qe-ee*yt,Ve[re*4+1]=H+G.loc[re*7+2],Ve[re*4+2]=P+ee*qe+O*yt,Ve[re*4+3]=$*G.loc[re*7+6],lt[re*4]=-O*We-ee*$e,lt[re*4+1]=G.loc[re*7+5],lt[re*4+2]=-ee*We+O*$e}}}for(let f=0;f<8;f++){let m=-1;for(let v=0;v<va.length&&va[v]<=Za[f];v++)m=va[v];const B=Za[f]-m;if(m<0||B>26){jn[f].w=0;continue}const S=xt(e)-xt(e-B/Pe);j.posAtDist(m,Mt),j.tangentAtDist(m,ct);const r=Math.hypot(ct.x,ct.z)||1,M=Mt.x-ct.z/r*Ja[f],C=Mt.z+ct.x/r*Ja[f];jn[f].set(M,C,S,Ne(1-S/1.8,0,1)*(C>16||C<-4?1:0))}no&&(no.P.needsUpdate=!0,no.V.needsUpdate=!0),po.getAttribute("iA").needsUpdate=!0,po.getAttribute("iB").needsUpdate=!0,po.getAttribute("iC").needsUpdate=!0};Qo(0,0),await a.yield();const so=(e,t=o.DoubleSide,n=1,s=1,l=0)=>new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...At,uGrain:{value:new o.Vector4(e[0],e[1],e[2],e[3])},uFogK:{value:n},uTone:{value:s},uAlgae:{value:l},uGrow:{value:1}},vertexShader:ii,fragmentShader:Hs,fog:!0,vertexColors:!0,side:t});let Yo=null,ga=null;const wa=[];{const e=Qs(q),t=so([2.2,2.2,.3,0],o.FrontSide);Yo=e;const n=new o.Matrix4,s=new o.Quaternion,l=new o.Euler,d=new o.Vector3,p=new o.Vector3,h=new o.Color,u=new o.Vector3,c=new o.Vector3,i=1,f=.1,m=2,B=1;ga=(()=>{const r=e.getAttribute("position"),M=r.count,C=new Float32Array(M*3),v=new o.Vector3,k=new Int32Array(ft+1);let w=0;for(let y=0;y<M;y++)w=Math.max(w,Math.hypot(r.getX(y),r.getY(y),r.getZ(y)));return y=>{const g=y.elements,F=w*Math.sqrt(Math.max(g[0]*g[0]+g[1]*g[1]+g[2]*g[2],g[4]*g[4]+g[5]*g[5]+g[6]*g[6],g[8]*g[8]+g[9]*g[9]+g[10]*g[10])),P=F+m+f;if(ke(g[12],g[14]).dist>=P)return!0;let H=0,K=-1/0,V=!1;for(let A=0;A<=ft;A++){const R=de[A]-g[12],G=ue[A]-g[13],$=we[A]-g[14];if(!(R*R+G*G+$*$>=P*P)){if(!H)for(let O=0;O<M;O++)v.fromBufferAttribute(r,O).applyMatrix4(y),C[O*3]=v.x,C[O*3+1]=v.y,C[O*3+2]=v.z,v.y>K&&(K=v.y);k[H++]=A,K>ue[A]-B&&(V=!0)}}const T=(V?m:i)+f,W=(F+T)*(F+T);for(let A=0;A<H;A++){const R=k[A],G=de[R]-g[12],$=ue[R]-g[13],O=we[R]-g[14];if(G*G+$*$+O*O>=W)continue;let ee=1/0,Ce=0,Ve=0,lt=0;for(let qe=0;qe<M;qe++){const yt=C[qe*3]-de[R],We=C[qe*3+1]-ue[R],$e=C[qe*3+2]-we[R],Ze=yt*yt+We*We+$e*$e;Ze<ee&&(ee=Ze,Ce=yt,Ve=We,lt=$e)}const Be=Math.sqrt(ee);let re=Be;if(Be>0)for(let qe=0;qe<M;qe++)re=Math.min(re,((C[qe*3]-de[R])*Ce+(C[qe*3+1]-ue[R])*Ve+(C[qe*3+2]-we[R])*lt)/Be);if(re<T)return!1}return!0}})();const S=[];for(let r=0;r<9;r++){const M=r<6?b.range(.01,.12):b.range(L.surface,.93);j.pointAt(M,u),S.push([u.x+b.range(-5,5),u.z,b.range(1.6,2.6)])}S.forEach((r,M)=>wa.push({x:r[0],z:r[1],ra:r[2]*1.48,rc:r[2],reach:M<6?"entry":"upper"}));for(const[r,M,C,v=b,k=1,w=1]of[[0,.128,560],[.128,L.arc3+.05,370],[L.splash,.93,320],[.205,L.arc3+.04,290,ie,.62,1.25]]){const y=Math.round(C*(.5+.5*E)),g=new o.InstancedMesh(e,t,y);let F=0,P=0;for(let H=0;F<y&&H<y*6;H++){(H&127)===127&&await a.yield();const K=v.range(r,M);j.pointAt(K,u),j.tangentAt(K,c);const V=r===0?1.6:1,T=Ne(v.gauss()*4.6*V*k,-13*V,13*V),W=u.x-c.z*T+v.range(-1,1),A=u.z+c.x*T+v.range(-3,3);if(A<15&&A>-3)continue;const R=A<=-3&&A>-47?oe.rockTop(W,A):_e(W,A);if((A>80&&A<100?uo(W,A):R)>Re(A)-.5)continue;let G=0;for(const Ve of S)G=Math.max(G,1-((W-Ve[0])**2/(Ve[2]*Ve[2])+(A-Ve[1])**2/(Ve[2]*Ve[2]*2.2)));const $=z(0,.3,G),O=(.2+.46*v()*v())*w*Q(1,.5,$)*(1+1.5*z(-5,-12,R));l.set(v.range(-.2,.2),v()*6.283,v.range(-.2,.2)),s.setFromEuler(l),d.set(W,R-.12*O,A),p.set(O*v.range(.8,1.35),O*v.range(.7,1.15),O*v.range(.8,1.2)),n.compose(d,s,p);const ee=v.range(.7,1.15)*Q(1,1.4,$),Ce=v.range(-.06,.06);ga(n)&&(g.setMatrixAt(P,n),g.setColorAt(P,h.setRGB(ee*(1+Ce),ee,ee*(1-Ce))),P++),F++}g.count=P,g.instanceMatrix.needsUpdate=!0,g.instanceColor&&(g.instanceColor.needsUpdate=!0),g.name="cobbles",g.userData.ur=[r-.1,M+.12],x.add(g),Bt.push(g),await a.yield()}{const r=fe("barCobbles"),M=.2,C=4.6*Math.sqrt(2*Math.PI);let v=fa;for(;v<j.length&&j.posAtDist(v,u).z>15;)v+=1;const k=Math.round(M*C*(v-fa)*(.5+.5*E)),w=new o.InstancedMesh(e,so([2.2,2.2,.3,0],o.FrontSide),k);let y=0,g=0;for(let F=0;y<k&&F<k*6;F++){(F&127)===127&&await a.yield();const P=r.range(fa,v);j.posAtDist(P,u),j.tangentAtDist(P,c);const H=Ne(r.gauss()*4.6,-13,13),K=u.x-c.z*H+r.range(-1,1),V=u.z+c.x*H+r.range(-3,3);if(V<15)continue;const T=_e(K,V),W=V>80&&V<100?uo(K,V):T;if(W>Re(V)-.5||r()>.2+.8*z(3,1.5,Re(V)-W))continue;let A=0;for(const ee of S)A=Math.max(A,1-((K-ee[0])**2/(ee[2]*ee[2])+(V-ee[1])**2/(ee[2]*ee[2]*2.2)));const R=z(0,.3,A),G=(.2+.46*r()*r())*1.2*Q(1,.5,R)*(1+1.5*z(-5,-12,T));l.set(r.range(-.2,.2),r()*6.283,r.range(-.2,.2)),s.setFromEuler(l),d.set(K,T-.12*G,V),p.set(G*r.range(.8,1.35),G*r.range(.7,1.15),G*r.range(.8,1.2)),n.compose(d,s,p);const $=r.range(.7,1.15)*Q(1,1.4,R),O=r.range(-.06,.06);ga(n)&&(w.setMatrixAt(g,n),w.setColorAt(g,h.setRGB($*(1+O),$,$*(1-O))),g++),y++}w.count=g,w.instanceMatrix.needsUpdate=!0,w.instanceColor&&(w.instanceColor.needsUpdate=!0),w.name="cobbles-bars",x.add(w),So(w),await a.yield()}{const r=nt(((a.seed??1)|0)*3571+1289>>>0),M=Math.round(320*(.5+.5*E)),C=new o.InstancedMesh(e,t,M);let v=0;for(let k=0;v<M&&k<M*5;k++){(k&63)===63&&await a.yield();let w,y;if(k%3){const K=r()*6.283,V=12.5*Math.sqrt(r());w=Fe.x+Math.cos(K)*V,y=Fe.z+Math.sin(K)*V}else y=r.range(20,72),w=J+1.5+Ne(r.gauss()*5,-11,12);const g=_e(w,y);if(g>-.8||y<15.5||j.distanceTo(w,g+.3,y)<1.5)continue;const F=(.2+.36*r()*r())*(1+.8*z(-4.5,-6.5,g));l.set(r.range(-.2,.2),r()*6.283,r.range(-.2,.2)),s.setFromEuler(l),d.set(w,g-.12*F,y),p.set(F*r.range(.8,1.35),F*r.range(.7,1.15),F*r.range(.8,1.2)),C.setMatrixAt(v,n.compose(d,s,p));const P=r.range(.62,1.02),H=r.range(-.02,.1);C.setColorAt(v,h.setRGB(P*(1+H),P,P*(1-1.6*H))),v++}C.count=v,C.instanceMatrix.needsUpdate=!0,C.instanceColor&&(C.instanceColor.needsUpdate=!0),C.name="cobbles-pool",C.userData.ur=[L.arc3+.012,L.tailUp+.012],x.add(C),Bt.push(C),await a.yield()}{const r=nt(((a.seed??1)|0)*7919+311>>>0),M=Pi(q),C=60,v=150,k=so([2.2,2.2,.34,0],o.FrontSide,.5,.8),w=new o.InstancedMesh(M,k,C),y=new o.InstancedMesh(e,k,v),g=(F,P)=>P<13.6?-7+.25*q.fbm2(F*.1,P*.1+31,2):Math.max(_e(F,P),-7.2);for(const[F,P,H,K,V,T]of[[w,C,.3,.7,9,15.6],[y,v,.14,.3,8.5,16.5]]){let W=0;for(let A=0;W<P&&A<P*6;A++){const R=J+r.range(F===w?8:5,F===w?32:35),G=F!==w&&r()<.6?r.range(13.2,15.2):r.range(V,T),$=Q(H,K,r()*r()),O=g(R,G);if(j.distanceTo(R,O+.5*$,G)<(F===w?vo:1.4)+$)continue;l.set(r.range(-.25,.25),r()*6.283,r.range(-.25,.25)),s.setFromEuler(l),d.set(R,O-.2*$,G),p.set($*r.range(.85,1.4),$*r.range(.75,1.2),$*r.range(.85,1.25)),F.setMatrixAt(W,n.compose(d,s,p));const ee=F===w?r.range(.5,.85):r.range(.22,.45),Ce=r.range(-.03,.06);F.setColorAt(W,h.setRGB(ee*(1+Ce),ee,ee*(1-Ce))),W++}F.count=W,F.instanceMatrix.needsUpdate=!0,F.instanceColor&&(F.instanceColor.needsUpdate=!0),F.name=F===w?"boulders-foot":"cobbles-foot",F.userData.ur=[L.missTop-.01,L.tailUp-.01],x.add(F),Bt.push(F),await a.yield()}}{const r=nt(((a.seed??1)|0)*2843+977>>>0),M=Math.round(560*(.5+.5*E)),C=(w,y)=>.5+.28*Math.sin(w*.52+1.2*Math.sin(y*.19+1))+.22*Math.sin(w*1.23-y*.11+2.4*Math.sin(w*.2)),v=new o.InstancedMesh(e,so([2.2,2.2,.3,0],o.FrontSide,.5,.85),M);let k=0;for(let w=0;k<M&&w<M*4;w++){(w&127)===127&&await a.yield();const y=J+r.range(5,35),g=r.range(8.6,15.4),F=C(y,g),P=z(.52,.6,F),H=1-z(.36,.44,F),K=Q(Q(.07+.1*r()*r(),.17+.2*r(),P),.03+.035*r(),H),V=g<13.6?-7+.25*q.fbm2(y*.1,g*.1+31,2):Math.max(_e(y,g),-7.2),T=Q(r.range(.5,1.15)*(r()<.3?.62:1),r.range(1,1.3),H),W=r.range(-.04,.08);l.set(r.range(-.3,.3),r()*6.283,r.range(-.3,.3)),s.setFromEuler(l),d.set(y,V-.1*K,g),p.set(K*r.range(.8,1.5),K*r.range(.7,1.1),K*r.range(.8,1.3)),!(j.distanceTo(y,V+.2,g)<1.3)&&(v.setMatrixAt(k,n.compose(d,s,p)),v.setColorAt(k,h.setRGB(T*(1+W),T,T*(1-W))),k++)}v.count=k,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),v.name="gravel-foot",x.add(v),So(v),await a.yield()}{const r=nt(((a.seed??1)|0)*4621+2203>>>0),M=200,C=90,v=new o.InstancedMesh(e,t,M+C);let k=0,w=1,y=0,g=0,F=0;const P=1.7,H=3.2;for(let V=0;V<12;V++){const T=L.tailUp+.006-V*.003;j.pointAt(T,u),j.tangentAt(T,c);const W=Math.hypot(c.x,c.z)||1;if(w=c.x/W,y=c.z/W,g=u.x-y*2.3,F=u.z+w*2.3,_e(g,F)<-.9)break}w=0,y=1,wa.push({x:g,z:F,ra:H,rc:P,reach:"tail"});for(let V=0;k<M&&V<M*6;V++){(V&127)===127&&await a.yield();const T=r.range(L.tailUp-.06,L.tailUp+.02);j.pointAt(T,u),j.tangentAt(T,c);const W=Ne(r.gauss()*4.4,-12,12),A=u.x-c.z*W+r.range(-1,1),R=u.z+c.x*W+r.range(-2,2),G=_e(A,R),$=R>80?uo(A,R):G;if($>-.55||R<15.5||j.distanceTo(A,$+.3,R)<1.2)continue;const O=A-g,ee=R-F,Ce=(O*w+ee*y)/H,Ve=(-O*y+ee*w)/P;if(Ce*Ce+Ve*Ve<1.15)continue;const lt=(.2+.4*r()*r())*(1+.6*z(-3,-6,G));l.set(r.range(-.2,.2),r()*6.283,r.range(-.2,.2)),s.setFromEuler(l),d.set(A,G-.12*lt,R),p.set(lt*r.range(.8,1.35),lt*r.range(.7,1.15),lt*r.range(.8,1.2)),v.setMatrixAt(k,n.compose(d,s,p));const Be=r.range(.5,.92),re=r.range(-.02,.1);v.setColorAt(k,h.setRGB(Be*(1+re),Be,Be*(1-1.6*re))),k++}const K=k;for(let V=0;k<K+C&&V<C*4;V++){const T=r()*6.283,W=Math.sqrt(r()),A=Math.cos(T)*W*H,R=Math.sin(T)*W*P,G=g+A*w-R*y,$=F+A*y+R*w,O=_e(G,$);if(O>-.45)continue;const ee=r.range(.1,.19);l.set(r.range(-.2,.2),r()*6.283,r.range(-.2,.2)),s.setFromEuler(l),d.set(G,O-.1*ee,$),p.set(ee*r.range(.9,1.4),ee*r.range(.6,.9),ee*r.range(.9,1.3)),v.setMatrixAt(k,n.compose(d,s,p));const Ce=r.range(1.25,1.6),Ve=r.range(0,.06);v.setColorAt(k,h.setRGB(Ce*(1+Ve),Ce,Ce*(1-Ve))),k++}v.count=k,v.instanceMatrix.needsUpdate=!0,v.instanceColor&&(v.instanceColor.needsUpdate=!0),v.name="cobbles-tail",v.userData.ur=[L.tailUp-.085,L.tailUp+.05],x.add(v),Bt.push(v),await a.yield()}}const On=[],go=(e,t,n,s,l)=>{const d=e.length,p=new Float32Array(d*4),h=new Float32Array(d*4),u=new Float32Array(d*4);for(let m=0;m<d;m++)p.set(e[m].p,m*4),h.set(e[m].v,m*4),u.set(e[m].l,m*4);const c=new o.InstancedBufferGeometry;c.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),c.setIndex([0,1,2,0,2,3]),c.setAttribute("iP",new o.InstancedBufferAttribute(p,4)),c.setAttribute("iV",new o.InstancedBufferAttribute(h,4)),c.setAttribute("iL",new o.InstancedBufferAttribute(u,4)),c.instanceCount=d;const i={...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:he.uTime,uVH:{value:450},uTop:{value:s},uGo:{value:new o.Vector2(1,0)},uSunCol:he.uSunCol,uSkyCol:he.uSkyCol,uTint:{value:new o.Color(n[0],n[1],n[2])},uKind:{value:t}},f=new o.Mesh(c,new o.ShaderMaterial({uniforms:i,vertexShader:Mi,fragmentShader:Ai,fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide}));return f.frustumCulled=!1,f.renderOrder=6,f.name=l,f.visible=!1,x.add(f),On.push(i),{mesh:f,U:i}},xr={...o.UniformsUtils.clone(o.UniformsLib.fog),...At,uWhite:{value:new o.Color(St[5])},uShow:{value:1}};let Ot=null,Qn=null;{const e=g=>Math.exp(-Math.max(g,0)/6.5)*z(-.6,1.5,g),t=nt(((a.seed??1)|0)*3167+59>>>0),n=[],s=Ge.uJetX.value;let l=0;for(let g=-70.3;g<70;g+=7.4){let F=g,P=-1;for(let T=0;T<8;T++){const W=g+7.4*(T+.5)/8,A=oe.flowAt(W);A>P&&(P=A,F=W)}const H=4.3+4.6*t(),K=(.9+.75*P)*t.range(.8,1.05),V=.86+.12*P;P<.25||(l<24&&(s[l++]=F),!(j.distanceTo(F,-.8,H)<vo||j.distanceTo(F,-3,H)<vo||j.distanceTo(F,-5.5,H)<vo)&&n.push([F,H,K,V]))}{const g=nt(((a.seed??1)|0)*5519+211>>>0),F=n.length;for(let P=-70.3;P<70;P+=3.7){const H=P+3.7*g(),K=3.4+6.2*g(),V=g.range(.28,.72),T=g.range(.7,.92),W=oe.flowAt(H);W<.2||g()>.4+W||j.distanceTo(H,-.8,K)<vo||j.distanceTo(H,-3,K)<vo||j.distanceTo(H,-5.5,K)<vo||n.some(A=>Math.hypot(A[0]-H,(A[1]-K)*.5)<1.7+A[2])||n.push([H,K,V,T])}for(let P=F;P<n.length;P++)n[P].push(g())}await a.yield();const d=n.length,p=new Float32Array(d*4),h=new Float32Array(d*4),u=[],c=[],i=10;for(let g=0;g<d;g++){const F=n[g];p.set([F[0],F[1],F[2],F.length>4?F[4]:t()],g*4),h.set([-.78*e(F[1])+.12,-6.95,F[3],0],g*4)}for(let g=0;g<=i;g++)u.push(-1,g/i,0,1,g/i,0);for(let g=0;g<i;g++){const F=g*2;c.push(F,F+1,F+2,F+1,F+3,F+2)}const f=new o.InstancedBufferGeometry;f.setAttribute("position",new o.Float32BufferAttribute(u,3)),f.setIndex(c),f.setAttribute("iP",new o.InstancedBufferAttribute(p,4)),f.setAttribute("iQ",new o.InstancedBufferAttribute(h,4)),f.instanceCount=d,Ot=new o.Mesh(f,new o.ShaderMaterial({uniforms:xr,vertexShader:xi,fragmentShader:ki,fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide})),Ot.frustumCulled=!1,Ot.renderOrder=2.5,Ot.name="plungeColumns",Ot.visible=!1,x.add(Ot),await a.yield();const m=n.map((g,F)=>[j.distanceTo(g[0],-3,g[1]),F]).sort((g,F)=>g[0]-F[0]).map(g=>g[1]),B=[],S=d?Math.round(280*(.5+.5*E)):0;for(let g=0;g<S;g++){const F=n[t()<.7?m[Math.min(d-1,Math.floor(t()*4))]:Math.floor(t()*d)],P=t.range(3,6.5),H=.016+.05*Math.pow(t(),2.2);B.push({p:[F[0]+t.gauss()*1.5,t.range(-6.7,-1.6),F[1]+t.range(-.6,3.2),t()],v:[t.range(-.12,.12),t.range(.45,1.15),t.range(.25,.75),H],l:[P,t.range(.04,.12),0,0]})}B.length||B.push({p:[J+20,-4,8,0],v:[0,.6,.4,.02],l:[4,.05,0,0]}),Qn=go(B,0,[.9,1,.95],-.35,"wallBubbles"),await a.yield();const r=new o.ShaderMaterial({uniforms:{...dt,uGainF:{value:N?.9:.5},uGainR:{value:1},uGrow:{value:0}},vertexShader:Io,fragmentShader:sa,fog:!0,vertexColors:!0,side:o.DoubleSide}),M=5,C=new Float32Array(M*4),v=new Float32Array(M*4),k=new Float32Array(M*4);let w=0;for(let g=0;w<M&&g<120;g++){const F=J+t.range(10.5,31),P=7.8+t()*Math.min(4.2,.42*(F-J-8.5)),H=t.range(-4.6,-1.5),K=t(),V=t.range(.9,1.15),T=t.range(-.2,.2),W=t(),A=t.range(.1,.3),R=t.range(6,8);j.distanceTo(F,H,P)<2.9||(C.set([F,H,P,K],w*4),v.set([V,T,0,1],w*4),k.set([W,A,R,.3],w*4),w++)}const y=new o.Mesh(gt(It,w,{iA:C,iB:v,iC:k}),r);y.name="wallHolders",y.frustumCulled=!1,x.add(y),So(y),kt+=w}await a.yield();let ya=null;const $o=oe.object.getObjectByName("drops")||null;if($o){const n=nt(((a.seed??1)|0)*7919+389>>>0),s=$o.geometry,l=new o.InstancedBufferGeometry;l.setIndex(s.index),l.setAttribute("position",s.getAttribute("position"));const d=new Float32Array(960),p=new Float32Array(960),h=new Float32Array(960),u=new Float32Array(1680);for(let m=0;m<240;m++){const B=n.range(.24,.42),S=B+n.range(.02,.2);p[m*4+3]=n.range(.02,.045),h[m*4]=S,h[m*4+1]=n.range(0,S),u[m*7]=n.range(-1,.45),u[m*7+1]=n.range(-.2,.2),u[m*7+2]=n.range(-.32,.1),u[m*7+3]=n.range(.3,1.8),u[m*7+4]=n.range(-.7,.7),u[m*7+5]=n.range(-.2,1.4),u[m*7+6]=B}const c=new o.InstancedBufferAttribute(d,4),i=new o.InstancedBufferAttribute(p,4);c.setUsage(o.DynamicDrawUsage),i.setUsage(o.DynamicDrawUsage),l.setAttribute("iP",c),l.setAttribute("iV",i),l.setAttribute("iT",new o.InstancedBufferAttribute(h,4)),l.instanceCount=240;const f=new o.Mesh(l,$o.material);f.name="companionDrops",f.frustumCulled=!1,f.renderOrder=6,x.add(f),no={mesh:f,P:c,V:i,loc:u,ND:30}}{const e=nt(((a.seed??1)|0)*3511+641>>>0),t=[];for(const n of ge.bears){const s=n.scale||1,l=Math.cos(n.yaw),d=Math.sin(n.yaw);for(let p=0;p<14;p++){const h=e.range(-1.25,1.25)*s,u=e.range(-2.1,2.3)*s,c=n.position.x+l*h+d*u,i=n.position.z-d*h+l*u,f=Math.max(n.position.y,Ie-.2)+e.range(-.05,.22)*s,m=e.range(.6,1.1),B=e.range(.2,.36)*s,S=e();j.distanceTo(c,f,i)<18||t.push({p:[c,f,i,S],v:[e.range(-.2,.2),e.range(.1,.45),e.range(.4,1.2),B],l:[m,.06,.16,.2]})}}t.length&&(ya=go(t,1,[1.75,1.8,1.8],99,"legFoam"),ya.mesh.renderOrder=3)}await a.yield();const Yn=new o.Vector2(1.1,.14),$n=[],Fo=[];{const e=nt(((a.seed??1)|0)*8191+127>>>0),t=(S,r)=>r<=-3&&r>-47?oe.rockTop(S,r):_e(S,r),n=new o.Matrix4,s=new o.Quaternion,l=new o.Euler,d=new o.Vector3,p=new o.Vector3,h=new o.Color,u=so([2.2,2.2,.3,0],o.FrontSide),c=new o.IcosahedronGeometry(1,0),i=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...At,uEgg:{value:.5}},vertexShader:Ci,fragmentShader:Fi,fog:!0}),f=new o.ShaderMaterial({uniforms:{...dt,uFan:{value:Yn}},vertexShader:Io,fragmentShader:sa,fog:!0,vertexColors:!0,side:o.DoubleSide}),m=new o.ShaderMaterial({uniforms:{...dt},vertexShader:Io,fragmentShader:Bi,fog:!0,vertexColors:!0,side:o.DoubleSide}),B=[];for(const S of["entry","tail","upper"]){const r=wa.filter(re=>re.reach===S),M=r.length;if(!M)continue;const C=34,v=18,k=3,w=new o.InstancedMesh(Yo,u,M*C),y=new o.InstancedMesh(c,i,M*v),g=[],F=[],P=[],H=[],K=[],V=[],T=[],W=[],A=[];let R=0,G=0,$=0,O=0;for(const re of r){await a.yield(),$+=re.x/M,O+=re.z/M;const qe=t(re.x,re.z),yt=Re(re.z);if(!(qe>yt-.6)){S!=="upper"&&Fo.push([re.x,re.z,yt-qe]);for(let We=0;We<C;We++){const $e=e()*6.283,Ze=Math.sqrt(e()),Je=Math.cos($e)*Ze,Oe=re.x+Math.sin($e)*Ze*re.rc,at=re.z+Je*re.ra,Qe=e.range(.09,.17)*(1+.9*z(.55,1,Je));l.set(e.range(-.3,.3),e()*6.283,e.range(-.3,.3)),s.setFromEuler(l),d.set(Oe,t(Oe,at)-.05*Qe+.1*z(.5,1,Je),at),p.set(Qe*e.range(.9,1.4),Qe*e.range(.7,1),Qe*e.range(.9,1.3)),w.setMatrixAt(R,n.compose(d,s,p));const ht=e.range(1,1.3),Tt=e.range(0,.06);w.setColorAt(R,h.setRGB(ht*(1+Tt),ht,ht*(1-Tt))),R++}for(let We=0;We<v;We++){const $e=We%3===0,Ze=e()*6.283,Je=Math.pow(e(),.8)*($e?.3:.6),Oe=re.x+Math.sin(Ze)*Je*re.rc,at=re.z+(Math.cos(Ze)*Je-($e?.15:0))*re.ra,Qe=e.range(.06,.09);d.set(Oe,t(Oe,at)+.13+e.range(0,.08),at),p.setScalar(Qe),s.identity(),y.setMatrixAt(G++,n.compose(d,s,p))}{const We=e.range(1,1.12),$e=e.range(.5,.95),Ze=e(),Je=e(),Oe=re.z-re.ra*.3,at=qe+.62;let Qe=null;if(at<yt-.35)for(const ht of[0,.45,-.45,.85,-.85])for(const Tt of[1,-1]){const Et=re.x+ht*re.rc,Xe=Tt*$e,$t=Co(Et,at,Oe,We,Xe);$t>=2.6&&(!Qe||Math.abs(ht)<Qe[3]-.01)&&(Qe=[Et,Xe,$t,Math.abs(ht)])}if(Qe){g.push(Qe[0],at,Oe,Ze),F.push(We,Qe[1],0,1),P.push(Je,-.08,15,.05),B.push([Qe[0],at,Oe]);const ht=Qe[0]+Math.sin(Qe[1])*.9*We,Tt=Oe+Math.cos(Qe[1])*.9*We;for(let Et=0;Et<14;Et++)H.push({p:[ht+e.range(-.4,.4),qe+e.range(.1,.3),Tt+e.range(-.4,.4),e()],v:[e.range(-.15,.15),e.range(.1,.36),e.range(.5,1.1),e.range(.16,.3)],l:[e.range(2.4,4),.06,1,0]})}}for(let We=0,$e=0;We<k&&$e<60;$e++){const Ze=e()<.5?1:-1,Je=re.x+Ze*e.range(.3,re.rc+1.3),Oe=re.z+re.ra+e.range(1,1.9),at=t(Je,Oe)+e.range(.42,.85),Qe=e(),ht=e.range(.66,.78),Tt=e(),Et=e.range(5.5,8),Xe=Ze*e.range(.1,.46),$t=Math.sin(Xe),zn=-Math.cos(Xe);if(at>Re(Oe)-.5||j.distanceTo(Je,at,Oe)<2.85||j.distanceTo(Je+$t*.7,at,Oe+zn*.7)<2.75)continue;let _s=!0;for(let Pa=W.length/4-We;Pa<W.length/4;Pa++)Math.hypot(W[Pa*4]-Je,W[Pa*4+2]-Oe)<1&&(_s=!1);_s&&(W.push(Je,at,Oe,Qe),A.push($t,zn),K.push(Je,at,Oe,Qe),V.push(ht,Math.atan2(-$t,-zn),0,1),T.push(Tt,-.05,Et,.3),B.push([Je,at,Oe]),We++)}}}w.count=R,w.instanceMatrix.needsUpdate=!0,w.instanceColor&&(w.instanceColor.needsUpdate=!0),w.name="nest-gravel-"+S,y.count=G,y.instanceMatrix.needsUpdate=!0,y.name="eggs-"+S;const ee=[w,y],Ce=g.length/4,Ve=K.length/4,lt=S==="upper";if(Ce){const re=new o.Mesh(gt(It,Ce,{iA:new Float32Array(g),iB:new Float32Array(F),iC:new Float32Array(P)}),f);re.name="nestFemales-"+S,re.frustumCulled=!1,ee.push(re),kt+=Ce}const Be={up:lt,cx:$,cz:O,rad:0,meshes:ee,puffs:null,tm:null,attr:null,home:new Float32Array(W),dart:new Float32Array(A),n:Ve};for(const re of r)Be.rad=Math.max(Be.rad,Math.hypot(re.x-$,re.z-O));if(Ve){const re=gt(oo,Ve,{iA:new Float32Array(K),iB:new Float32Array(V),iC:new Float32Array(T)});re.getAttribute("iA").setUsage(o.DynamicDrawUsage);const qe=new o.Mesh(re,m);qe.name="trout-"+S,qe.frustumCulled=!1,ee.push(qe),Be.tm=qe,Be.attr=re.getAttribute("iA")}for(const re of ee)re.visible=!1,x.add(re);H.length&&(Be.puffs=go(H,1,[.5,.48,.36],(lt?Ie:0)-.2,"siltPuffs-"+S)),$n.push(Be),await a.yield()}await Ya(B,1.1)}await a.yield();let en=null,wo=null,ro=null;const tn={...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:he.uTime,uVH:{value:450},uSurf:{value:0},uSunCol:he.uSunCol,uSkyCol:he.uSkyCol};{const e=nt(((a.seed??1)|0)*7541+1013>>>0),t=[],n=Math.round(520*(.5+.5*E)),s=new o.Vector3,l=new o.Vector3;let d=0;for(;d<j.length&&j.posAtDist(d,s).z>60;)d+=1;for(let i=0;t.length<n&&i<n*8;i++){(i&255)===255&&await a.yield();const f=e.range(0,d);j.posAtDist(f,s),j.tangentAtDist(f,l);const m=e.gauss()*6,B=s.x-l.z*m,S=s.z+l.x*m,r=Re(S)-uo(B,S);if(r<.5||e()>z(2.2,1.1,r))continue;const M=e.range(1.3,2.6),C=e.range(.1,.9)*Math.min(r-.3,1.2);t.push({p:[B,-.08-C*e(),S,e()],v:[e.range(-.2,.2),-C/M*.5+e.range(-.1,.25),e.range(.9,2),.012+.04*Math.pow(e(),2.4)],l:[M,e.range(.05,.16),0,0]})}t.length&&(en=go(t,0,[.95,1,.96],-.03,"riffleBubbles")),await a.yield();{const i=nt(((a.seed??1)|0)*4637+83>>>0),f=[],m=10,B=[],S=[];for(let v=0;f.length<46&&v<900;v++){(v&127)===127&&await a.yield();const k=i.range(0,d);j.posAtDist(k,s),j.tangentAtDist(k,l);const w=i.sign()*i.range(3.2,15),y=s.x-l.z*w,g=s.z+l.x*w,F=Re(g)-uo(y,g),P=i.range(.2,.55),H=i.range(.55,.85),K=i(),V=i.range(.6,1.3);F<.55||F>1.9||j.distanceTo(y,-.5,g)<3||f.some(T=>Math.hypot(T[0]-y,T[1]-g)<1.6)||f.push([y,g,P,K,-.02,-Math.min(F-.1,V),H])}const r=f.length,M=new Float32Array(r*4),C=new Float32Array(r*4);for(let v=0;v<r;v++){const k=f[v];M.set([k[0],k[1],k[2],k[3]],v*4),C.set([k[4],k[5],k[6],0],v*4)}for(let v=0;v<=m;v++)B.push(-1,v/m,0,1,v/m,0);for(let v=0;v<m;v++){const k=v*2;S.push(k,k+1,k+2,k+1,k+3,k+2)}if(r&&Ot){const v=new o.InstancedBufferGeometry;v.setAttribute("position",new o.Float32BufferAttribute(B,3)),v.setIndex(S),v.setAttribute("iP",new o.InstancedBufferAttribute(M,4)),v.setAttribute("iQ",new o.InstancedBufferAttribute(C,4)),v.instanceCount=r,ro=new o.Mesh(v,Ot.material),ro.frustumCulled=!1,ro.renderOrder=2.5,ro.name="riffleCurtains",ro.visible=!1,x.add(ro)}}await a.yield();const p=Math.round(300*(.5+.5*E)),h=new Float32Array(p*4),u=new Float32Array(p*4);for(let i=0;i<p;i++){const f=i%7===0;h.set([e.range(-13,13),Math.pow(e(),f?1.6:1),e.range(-13,13),e()],i*4),u.set([e.range(.9,1.9),f?e.range(.03,.055):e.range(.008,.022),f?1:0,f?e.range(.6,1.8)*(e()<.5?-1:1):0],i*4)}const c=new o.InstancedBufferGeometry;c.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),c.setIndex([0,1,2,0,2,3]),c.setAttribute("iP",new o.InstancedBufferAttribute(h,4)),c.setAttribute("iV",new o.InstancedBufferAttribute(u,4)),c.instanceCount=p,wo=new o.Mesh(c,new o.ShaderMaterial({uniforms:tn,vertexShader:zi,fragmentShader:Si,fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide})),wo.frustumCulled=!1,wo.renderOrder=6,wo.name="drift",wo.visible=!1,x.add(wo)}await a.yield();const Xn=so([.35,3.2,.4,.25]);let ba=null,on=null,an=null,Zn=0;await a.yield();{const e=Me+4.5,t=Z-42,n=_e(e,t)+4.1,s=-.96,l=Math.cos(s),d=Math.sin(s),p=240,h=new Float32Array((p+1)*3),u=Z-t+76;for(let y=0;y<=p;y++)j.posAtDist(u*y/p,He),h[y*3]=He.x,h[y*3+1]=He.y,h[y*3+2]=He.z;await a.yield();const c=(y,g,F)=>{const P=e+l*y+d*F,H=n+g,K=t-d*y+l*F;let V=1e9;for(let T=0;T<=p;T++){const W=h[T*3]-P,A=h[T*3+1]-H,R=h[T*3+2]-K,G=W*W+A*A+R*R;G<V&&(V=G)}return Math.sqrt(V)},i=await Di(b.fork("drowned"),q,{length:36,trunk:.72,plate:5.2,count:11,sinkers:8,rootlets:120,stones:26,stubs:11,cobble:Yo,clear:c,bed:(y,g)=>_e(e+l*y+d*g,t-d*y+l*g)-n,top:-.9-n,stream:[-d,0,l]},a.yield);L.tree=[+n.toFixed(2),+i.near.toFixed(2),i.geometry.index.count/3],await a.yield();const f=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...At,uFogK:{value:.34},uBedY:{value:n-4.1}},vertexShader:li,fragmentShader:hi,fog:!0,vertexColors:!0,side:o.DoubleSide}),m=new o.Mesh(i.geometry,f);m.position.set(e,n,t),m.rotation.set(0,s,0),m.name="drownedSpruce",m.userData.info=L.tree,x.add(m),m.updateMatrixWorld(!0),await a.yield();const B=[],S=[],r=[],M=new o.Vector3,C=b.fork("weed");let v=0;for(const y of i.tips){M.set(y[0],y[1],y[2]).applyMatrix4(m.matrixWorld);const g=C.range(1.2,3.2),F=C(),P=C.range(.09,.17),H=C.range(-.5,.5);for(let K=0;K<=4;K++){const V=K/4;for(const T of[-1,1])B.push(M.x+H*V,M.y-g*.45*V*V-.1*V,M.z+g*.85*V),S.push(V,T,F,P)}for(let K=0;K<4;K++){const V=v*10+K*2;r.push(V,V+1,V+2,V+1,V+3,V+2)}v++}const k=new o.BufferGeometry;k.setAttribute("position",new o.Float32BufferAttribute(B,3)),k.setAttribute("aL",new o.Float32BufferAttribute(S,4)),k.setIndex(r),ba=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:he.uTime,uCam:he.uCam,uSunCol:he.uSunCol,uSkyCol:he.uSkyCol,uPx:{value:.003},uTint:{value:new o.Color(.04,.07,.03)}},vertexShader:Us,fragmentShader:Ws,fog:!0,side:o.DoubleSide});const w=new o.Mesh(k,ba);w.name="weed",x.add(w),await a.yield();{const y=nt(((a.seed??1)|0)*5303+389>>>0),g=9,F=new Float32Array(g*4),P=new Float32Array(g*4),H=new Float32Array(g*4),K=[],V=[];let T=0;for(let W=0;T<g&&W<400&&i.tips.length;W++){const A=i.tips[Math.floor(y()*i.tips.length)];M.set(A[0],A[1],A[2]).applyMatrix4(m.matrixWorld);const R=M.x+y.range(-1.3,1.3),G=M.y+y.range(-.4,.9),$=M.z+y.range(-.6,2.2),O=y.range(.9,1.12),ee=y.range(-.35,.35);G>-.7||G<_e(R,$)+.5||Co(R,G,$,O,ee)<2.6||K.some(Ce=>Math.hypot(Ce[0]-R,Ce[1]-G,Ce[2]-$)<1.25)||(F.set([R,G,$,y()],T*4),P.set([O,ee,0,1],T*4),H.set([y(),y.range(-.05,.1),y.range(5,7),.3],T*4),K.push([R,G,$]),T++)}if(T){const W=new o.Mesh(gt(It,T,{iA:F,iB:P,iC:H}),Wt);W.name="rootFish",W.frustumCulled=!1,x.add(W),an=W,Zn=t,kt+=T,await Ya(K,1)}for(let W=0;W<70&&i.tips.length;W++){const A=i.tips[Math.floor(y()*i.tips.length)];M.set(A[0],A[1],A[2]).applyMatrix4(m.matrixWorld);const R=y.range(3.5,7);V.push({p:[M.x+y.range(-.5,.5),M.y+y.range(-.6,.2),M.z+y.range(-.5,.5),y()],v:[y.range(-.05,.05),y.range(.5,.95),y.range(.15,.4),.014+.04*Math.pow(y(),2)],l:[R,y.range(.04,.1),0,0]})}V.length&&(on=go(V,0,[.92,1,.95],-.3,"rootBubbles"))}}await a.yield();const kr=Ft+11,Mr=13.7;let xa=null;{const e=Ys(b.fork("fallen"),q,{length:47,radius:1.12,sag:.8,roots:2.5,branches:26,hang:!0,span:[.2,.93],lenAt:m=>Q(1.15,6.2,z(6,14,Math.abs(m*47-23.5)))}),t=new o.Mesh(e.geometry,Xn);t.position.set(Ae-23.5,Mr,kr),t.rotation.set(.12,0,-.025),t.name="fallenSpruce",x.add(t),t.updateMatrixWorld(!0),await a.yield();const n=Ys(nt(((a.seed??1)|0)*6703+331>>>0),q,{length:47,radius:1.12,sag:.8,branches:24,hang:!0,span:[.14,.96],noTrunk:!0,lenAt:m=>Q(.7,7.4,z(6.4,15,Math.abs(m*47-23.5)))}),s=new o.Mesh(n.geometry,Xn);s.position.copy(t.position),s.rotation.copy(t.rotation),s.name="fallenComb",x.add(s);const l=nt(((a.seed??1)|0)*6703+977>>>0);await a.yield();const d=[],p=[],h=[],u=new o.Vector3;let c=0;for(const m of e.anchors){if(b()>.8)continue;u.set(m[0],m[1],m[2]).applyMatrix4(t.matrixWorld);let B=b.range(1.3,3.1);const S=b(),r=b.range(.22,.4),M=b.range(-.3,.3);if(!(Math.abs(u.x-Ae)<7.2&&(B=Math.min(B,u.y-12.1),B<.45))){for(let C=0;C<=4;C++){const v=C/4;for(const k of[-1,1])d.push(u.x+M*v*v,u.y-B*v,u.z),p.push(v,k,S,r)}for(let C=0;C<4;C++){const v=c*10+C*2;h.push(v,v+1,v+2,v+1,v+3,v+2)}c++}}for(const m of n.anchors){u.set(m[0],m[1],m[2]).applyMatrix4(t.matrixWorld);let B=l.range(1.4,3.6);const S=l(),r=l.range(.22,.42),M=l.range(-.3,.3);if(!(Math.abs(u.x-Ae)<7.2&&(B=Math.min(B,u.y-12.1),B<.45))){for(let C=0;C<=4;C++){const v=C/4;for(const k of[-1,1])d.push(u.x+M*v*v,u.y-B*v,u.z),p.push(v,k,S,r)}for(let C=0;C<4;C++){const v=c*10+C*2;h.push(v,v+1,v+2,v+1,v+3,v+2)}c++}}const i=new o.BufferGeometry;i.setAttribute("position",new o.Float32BufferAttribute(d,3)),i.setAttribute("aL",new o.Float32BufferAttribute(p,4)),i.setIndex(h),xa=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:he.uTime,uCam:he.uCam,uSunCol:he.uSunCol,uSkyCol:he.uSkyCol,uPx:{value:.003},uTint:{value:new o.Color("#a9b596")}},vertexShader:Us,fragmentShader:Ws,fog:!0,side:o.DoubleSide});const f=new o.Mesh(i,xa);f.name="lichen",x.add(f)}await a.yield();const Jn=Z-jo[1]*Pe,es={x:ja(Jn)-16,z:Jn-22},Bo=[{x:es.x,z:es.z,yaw:1.9,scale:1.04,girth:1.1,phase:b(),tint:.35,period:8.5,offset:b.range(0,8)},{x:Fe.x,z:Fe.z,yaw:1.45,scale:1.08,girth:1.14,phase:b(),tint:.6,period:11,offset:b.range(0,11)},{x:ze.x,z:ze.z,yaw:-1.9,scale:.94,girth:1.05,phase:b(),tint:.75,period:23,offset:b.range(0,20)},{x:ze.x-4.2,z:ze.z+5,yaw:-2.5,scale:.42,girth:1.1,phase:b(),tint:.85,period:6.5,offset:b.range(0,6)},{x:ze.x-2.2,z:ze.z+7.6,yaw:.7,scale:.4,girth:1.1,phase:b(),tint:.9,period:7.5,offset:b.range(0,7)}];Bo.push({x:Le.x-1.7,z:Le.z+1,yaw:-2.1,scale:1.1,girth:1.12,phase:me(),tint:.5,period:9.5,offset:me.range(0,9)},{x:Le.x+2.7,z:Le.z-1.7,yaw:2.3,scale:.84,girth:1.06,phase:me(),tint:.8,period:13,offset:me.range(0,13)});for(const e of Bo)e.y=_e(e.x,e.z)-.05;const ts=Bo.map(e=>[e.x,e.z]),yo=Bo.splice(1,1)[0],nn=2.1,To=[Math.sin(nn),Math.cos(nn)];yo.yaw=nn,yo.x=Fe.x,yo.z=Fe.z,yo.y=_e(Fe.x,Fe.z)-.05,yo.scale=1.26,yo.girth=1.1;const os=oe.addBears(Bo.splice(0,1),{own:!0,name:"riffleBear",subK:.6,silK:.3});os.mesh.userData.ur=[-1,.46],Bt.push(os.mesh),oe.addBears(Bo,{own:!0,name:"riverBears",subK:.6,silK:.3}),await a.yield();const as=Ge.uLedge.value;let Ar=0;const ka=(e,t,n,s)=>{const l=Math.min(Ar++,15);return as[l].set(e,n*(1.35+1.9*Math.abs(Math.sin(t))),s+4.6*n,1),as[l]};for(const e of ge.bears)ka(e.position.x,e.yaw,e.scale,e.position.y);let Ma=null;if(D.season!=="october"){let e=J+14;for(const n of ge.bears)n.position.x>J+1&&n.position.x<e&&(e=n.position.x);const t={x:J+Ne((e-J)*.5,5.4,6.6),z:-1.5,yaw:-.42,scale:.84,girth:1.04,phase:te(),tint:.55,period:12.5,offset:te.range(0,12)};t.y=oe.crestAt(t.x)-.06,Ma=t.x,oe.addBears([t],{name:"thirdBear"}),ka(t.x,t.yaw,t.scale,t.y)}await a.yield();const ns=oe.addBears([yo],{own:!0,name:"poolBear",subK:.8,silK:.3});await a.yield();const sn=[],ss=new o.Frustum,zr=new o.Matrix4;{const e=fe("runStones"),t=.8,n=8,s=15,l=1,d=2,p=12,h=15,u=2.5,c=new o.Matrix4,i=new o.Quaternion,f=new o.Euler,m=new o.Vector3,B=new o.Vector3,S=Qs(q,0),r=Yo.getAttribute("position"),M=r.count;let C=0;for(let T=0;T<M;T++)C=Math.max(C,Math.hypot(r.getX(T),r.getY(T),r.getZ(T)));let v=0;for(;v<ft&&we[v]>h;)v++;const k=(T,W)=>{let A=1/0;for(let R=0;R<=v;R++){const G=de[R]-T,$=we[R]-W,O=G*G+$*$;O<A&&(A=O)}return Math.sqrt(A)};let w=1/0,y=-1/0,g=-1/0;for(let T=0;T<=v;T++)w=Math.min(w,de[T]),y=Math.max(y,de[T]),g=Math.max(g,we[T]);const F=w-s,P=Math.ceil((y-w+2*s)/l),H=Math.ceil((g+s-h)/l),K=t*l*l/d*(.5+.5*E),V=new Map;for(let T=0;T<H;T++){await a.yield();for(let W=0;W<P;W++)for(let A=0;A<d;A++){const R=e(),G=e(),$=e(),O=e(),ee=e(),Ce=e(),Ve=e(),lt=e(),Be=e(),re=e(),qe=e(),yt=e(),We=e();if(R>=K)continue;const $e=F+(W+G)*l,Ze=h+(T+$)*l;if(R>=K*(1-z(n,s,k($e,Ze))))continue;const Je=_e($e,Ze);if(Re(Ze)-Je<.5)continue;const Oe=(.2+.46*O*ee)*(1+1.5*z(-5,-12,Je));if(wa.some(Xe=>(($e-Xe.x)/(Xe.rc+Oe))**2+((Ze-Xe.z)/(Xe.ra+Oe))**2<1)||ts.some(Xe=>Math.hypot(Xe[0]-$e,Xe[1]-Ze)<u)||(f.set(Q(-.2,.2,Ce),Ve*6.283,Q(-.2,.2,lt)),i.setFromEuler(f),m.set($e,Je-.12*Oe,Ze),B.set(Oe*Q(.8,1.35,Be),Oe*Q(.7,1.15,re),Oe*Q(.8,1.2,qe)),c.compose(m,i,B),!ga(c)))continue;const at=C*Math.max(B.x,B.y,B.z),Qe=Math.floor(($e-F)/p)+4096*Math.floor((Ze-h)/p);let ht=V.get(Qe);ht||V.set(Qe,ht={m:[],c:[],lo:[1/0,1/0,1/0],hi:[-1/0,-1/0,-1/0]});for(let Xe=0;Xe<16;Xe++)ht.m.push(c.elements[Xe]);for(let Xe=0;Xe<3;Xe++){const $t=m.getComponent(Xe);ht.lo[Xe]=Math.min(ht.lo[Xe],$t-at),ht.hi[Xe]=Math.max(ht.hi[Xe],$t+at)}const Tt=Q(.7,1.15,yt),Et=Q(-.06,.06,We);ht.c.push(Tt*(1+Et),Tt,Tt*(1-Et))}}await a.yield();for(const T of V.values()){const W=T.c.length/3,A=new o.InstancedMesh(Yo,so([2.2,2.2,.3,0],o.FrontSide),W),R=[1/0,-1/0,1/0,-1/0];A.instanceMatrix.array.set(T.m),A.instanceColor=new o.InstancedBufferAttribute(new Float32Array(T.c),3);for(let $=0;$<W;$++){const O=T.m[$*16+12],ee=T.m[$*16+14];R[0]=Math.min(R[0],O),R[1]=Math.max(R[1],O),R[2]=Math.min(R[2],ee),R[3]=Math.max(R[3],ee)}A.name="cobbles-run",A.userData.box=R,A.userData.bounds=new o.Box3(new o.Vector3(T.lo[0],T.lo[1],T.lo[2]),new o.Vector3(T.hi[0],T.hi[1],T.hi[2]));const G=new o.InstancedMesh(S,A.material,W);G.instanceMatrix.array.set(T.m),G.instanceColor=new o.InstancedBufferAttribute(new Float32Array(T.c),3),G.name="cobbles-run-far",G.visible=!1,A.userData.air=G,x.add(A,G),sn.push(A),(sn.length&7)===7&&await a.yield()}}await a.yield();let _t=null;{const e=fe("runFile"),t=1.5,n=[6.3,12],s=7.5,l=new o.Vector3,d=new o.Vector3,p=[],h=[],u=[];let c=0,i=16;for(let m=L.missFall*Pe;m<L.leapBreak*Pe;m+=t){const B=e(),S=e(),r=e(),M=e(),C=e(),v=e(),k=e();if(j.posAtDist(m,l),l.y<-.3||l.z<16)continue;j.tangentAtDist(m,d);const w=Math.hypot(d.x,d.z)||1,y=(c++%2?1:-1)*Q(n[0],n[1],B*B),g=l.x-d.z/w*y,F=l.z+d.x/w*y+(S-.5)*1.2,P=Q(.9,1.15,r),H=Q(.04,.16,M)-.37*P;F<16||Se(g,F)>-4||_e(g,F)>-.8||j.distanceTo(g,H,F)<n[0]-.2||ts.some(K=>Math.hypot(K[0]-g,K[1]-F)<s)||Xa.some(K=>Math.hypot(K[0]-g,K[1]-F)<2.2)||(Xa.push([g,F]),i=Math.max(i,F),p.push(g,H,F,C),h.push(P,(v-.5)*.56,0,1),u.push(k,.03,Q(5,7.5,S),.32))}await a.yield();const f=p.length/4;if(f){const m=new o.ShaderMaterial({uniforms:{...dt,uBoil:{value:new o.Vector4(5,11,.55,.6)},uGrow:{value:0}},vertexShader:Io,fragmentShader:sa,fog:!0,vertexColors:!0,side:o.DoubleSide});_t=new o.Mesh(gt(oo,f,{iA:new Float32Array(p),iB:new Float32Array(h),iC:new Float32Array(u)}),m),_t.name="runFile",_t.frustumCulled=!1,_t.userData.zMax=i,_t.userData.grow=m.uniforms.uGrow,x.add(_t),kt+=f}}const rs=[],is=[-.25,0];{const e=fe("poolHolders"),t=1.5,n=Nn.find(K=>K.name==="pool"),s=[n.z0,n.z1],l=[3,7],d=-2,p=3.25,h=4,u=10,c=[1,.7,2.4],i=new o.Vector3,f=new o.Vector3,m=new Map,B=new Map,S=(K,V,T,W=m,A=0,R=0,G=0)=>{const $=Math.floor(T/3);let O=W.get($);O||W.set($,O=[]),O.push(K,V,T,A,R,G)},r=(K,V,T,W=m,A=1)=>{const R=Math.floor(T/3);for(let G=R-A;G<=R+A;G++){const $=W.get(G);if($)for(let O=0;O<$.length;O+=6){const ee=Math.max(Math.abs(K-$[O])-$[O+3],0)/c[0],Ce=Math.max(Math.abs(V-$[O+1])-$[O+4],0)/c[1],Ve=Math.max(Math.abs(T-$[O+2])-$[O+5],0)/c[2];if(ee*ee+Ce*Ce+Ve*Ve<1)return!0}}return!1};{const K=[];x.traverse(V=>{const T=V.geometry;V.isMesh&&V!==ma&&T&&T.getAttribute("iA")&&T.getAttribute("iB")&&T.getAttribute("iC")&&!V.name.startsWith("shoal-far")&&K.push(V)});for(const V of K){const T=V.geometry.getAttribute("iA").array,W=V.geometry.getAttribute("iB").array,A=V.geometry.instanceCount;for(let R=0;R<A;R++){const G=T[R*4+2];W[R*4]!==0&&G>s[0]-4&&G<s[1]+4&&S(T[R*4],T[R*4+1],G)}await a.yield()}}const M=4,C=.16,v=2,k=192;{const K=Math.floor(s[0]/3)-v,V=Math.floor(s[1]/3)+v,T=xt(0),W=xt(1),A=new Float32Array(24),R=new Float32Array(24),G=(Math.sqrt(5)-1)/2,$=()=>{for(let O=0;O<24;O++){const ee=ao[(O/3|0)*4+O%3];A[O]=Math.min(A[O],ee),R[O]=Math.max(R[O],ee)}};for(let O=0,ee=0,Ce=0;O<=Pe;O+=Math.min(...c)/2){Ce>=k&&(Ce=0,await a.yield()),Qo(O/Pe,xt(O/Pe)),Ce++;let Ve=!1;for(let Be=0;Be<8;Be++){const re=Math.floor(ao[Be*4+2]/3);Ve=Ve||re>=K&&re<=V}if(!Ve)continue;A.fill(1/0),R.fill(-1/0),$();const lt=++ee*G%1;for(let Be=0;Be<M;Be++)Qo(O/Pe,Q(T,W,(Be+lt)/M)),$(),Ce++;for(let Be=0;Be<24;Be+=3)S((A[Be]+R[Be])/2,(A[Be+1]+R[Be+1])/2,(A[Be+2]+R[Be+2])/2,B,(R[Be]-A[Be])/2+C,(R[Be+1]-A[Be+1])/2+C,(R[Be+2]-A[Be+2])/2+C)}}Qo(0,0);const w=new Map,y=1/t;let g=0,F=0;for(let K=0,V=0;K<Pe;K+=y,V++){if((V&255)===255&&await a.yield(),j.posAtDist(K,i),i.z<s[0]||i.z>s[1]||i.y>-Fn[0])continue;j.tangentAtDist(K,f),F+=y;const T=Math.hypot(f.x,f.z)||1,W=g++%2?1:-1;(g&3)===3&&await a.yield();for(let A=0;A<6;A++){const R=e(),G=e(),$=e(),O=e(),ee=e(),Ce=e(),Ve=e(),lt=e(),Be=W*(A<3?1:-1)*Q(l[0],l[1],Math.pow(R,1.3)),re=i.x-f.z/T*Be,qe=i.z+f.x/T*Be+(G-.5)*1.2;if(qe<s[0]||qe>s[1]||Se(re,qe)>-4||Oa(re,qe))continue;const yt=_e(re,qe)+.6;if(d-yt<.3)continue;const We=Q(yt,d,$),$e=Q(.9,1.15,O),Ze=(ee-.5)*.32,Je=j.distanceTo(re,We,qe);if(Je<l[0]||Co(re,We,qe,$e,Ze)<2.6||r(re,We,qe)||r(re,We,qe,B,v))continue;S(re,We,qe);const Oe=Je<p?0:Je<h?1:2,at=Oe+":"+Math.floor(qe/u);let Qe=w.get(at);Qe||w.set(at,Qe={tier:Oe,iA:[],iB:[],iC:[]}),Qe.iA.push(re,We,qe,Ce),Qe.iB.push($e,Ze,0,1),Qe.iC.push(Ve,(lt-.5)*.1,Q(5,7.5,G),.5);break}}await a.yield();const P=Es.replace("attribute vec3 aQ;","uniform float uGrow; attribute vec3 aQ;").replace("sc = iB.x;","sc = iB.x*uGrow;"),H=[0,0,0];for(const K of w.values()){const V=K.iA.length/4,T=[1e9,1e9,1e9],W=[-1e9,-1e9,-1e9];for(let O=0;O<V;O++)for(let ee=0;ee<3;ee++){const Ce=K.iA[O*4+ee];T[ee]=Math.min(T[ee],Ce),W[ee]=Math.max(W[ee],Ce)}const A=new o.Sphere(new o.Vector3((T[0]+W[0])/2,(T[1]+W[1])/2,(T[2]+W[2])/2),Math.hypot(W[0]-T[0],W[1]-T[1],W[2]-T[2])/2+2.4),R=new o.Mesh(gt([It,En,oo][K.tier],V,{iA:K.iA,iB:K.iB,iC:K.iC},A),Wt);R.name="poolHolders",x.add(R),So(R),kt+=V,H[K.tier]+=V;const G=new o.InstancedBufferGeometry;G.index=Lt.index,G.setAttribute("position",Lt.getAttribute("position")),G.setAttribute("aQ",Lt.getAttribute("aQ"));for(const O of["iA","iB","iC"])G.setAttribute(O,R.geometry.getAttribute(O));G.instanceCount=V,G.boundingSphere=A;const $=new o.Mesh(G,new o.ShaderMaterial({uniforms:{...Ia,uGrow:{value:0}},vertexShader:P,fragmentShader:Ns,fog:!0,side:o.DoubleSide}));$.name="poolHolders-air",$.visible=!1,x.add($),rs.push({body:R,cards:$}),await a.yield()}L.holders=H,L.holdMetres=Math.round(F)}ns.rear2.value.set(0,.3,0,0);let rn=null,ln=null;{const e=nt(((a.seed??1)|0)*2477+31>>>0),t=[],n=Fe.x+To[0]*4,s=Fe.z+To[1]*4;for(let d=0;d<110;d++){const p=e()*6.283,h=e.range(.1,1),u=.07+.2*Math.pow(e(),2);t.push({p:[n+Math.cos(p)*h,e.range(-3.1,-2.1),s+Math.sin(p)*h,e()],v:[Math.cos(p)*e.range(.05,.4),e.range(.55,1.25),Math.sin(p)*e.range(.05,.4),u],l:[e.range(1.5,2.5),e.range(.05,.14),0,e.range(.2,.9)]})}rn=go(t,0,[1,1,.97],-.12,"muzzleBubbles");const l=[];for(let d=0;d<22;d++){const p=e()*6.283,h=e.range(0,.8);l.push({p:[n+Math.cos(p)*h,e.range(-3,-2),s+Math.sin(p)*h,e()],v:[Math.cos(p)*.2,e.range(.3,.7),Math.sin(p)*.2,e.range(.4,.75)],l:[e.range(1.4,2.4),.05,.5,.3]})}ln=go(l,1,[1,1,.96],-.1,"muzzleFoam")}const Xo=new o.Vector3(Fe.x+To[0]*.6,.75,Fe.z+To[1]*.6);Ge.uHole.value.set(Xo.x,Xo.y,Xo.z,2.25),Ge.uHoleAx.value.set(To[0]*3.9,0,To[1]*3.9);const Sr={...At,uWinTint:{value:new o.Color(...ne==="dawn"?[.97,.92,.88]:ne==="evening"?[1,.92,.82]:[.86,.95,.95])},uAt:{value:new o.Vector3(Xo.x,.16,Xo.z)},uSkyHor:Ge.uSkyHor,uSkyAir:Ge.uSkyAir,uCeil:Ge.uCeil,uWK:Ge.uWK},Po=new o.Mesh(new o.PlaneGeometry(2,1,1,1),new o.ShaderMaterial({uniforms:Sr,transparent:!0,depthWrite:!1,side:o.DoubleSide,fog:!1,vertexShader:`
uniform vec3 uCam, uAt; varying vec3 vW; varying vec2 vQ;
void main(){
  vec2 to = uAt.xz - uCam.xz; to /= max(length(to), 1e-3);
  vec3 w = uAt + vec3(to.x, 0., to.y)*5.5 + vec3(-to.y, 0., to.x)*(position.x*11.) + vec3(0., (position.y + .5)*8., 0.);
  vW = w; vQ = vec2(position.x, position.y + .5);
  gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.);
}`,fragmentShader:`
${pt}
uniform vec3 uSkyHor, uSkyAir, uCeil, uWinTint; uniform float uWK;
varying vec3 vW; varying vec2 vQ;
void main(){
  vec2 q = vec2(vW.x + vW.z, vW.y*1.3);
  float lens = vn(q*.9 + vec2(uTime*.5, -uTime*.35))*vn(q*2.1 - vec2(uTime*.4, uTime*.5));
  float net = smoothstep(.3, .75, vn(q*1.6 + vec2(-uTime*.3, uTime*.45)));
  // (what shows through the opening is the light of the froth round the bear: clots of white foam and bubbles with
  // green water between them, never a sheet of one colour)
  float b1 = vn(q*2.9 + vec2(uTime*.7, -uTime*1.1)), b2 = vn(q*6.1 - vec2(uTime*.5, uTime*1.5));
  float clot = smoothstep(.36, .7, b1*.66 + b2*.5);
  vec3 lightC = mix(uSkyHor*.9, uSkyAir*1.2, clamp(smoothstep(.0, .5, vQ.y) + .35*net, 0., 1.))*uWinTint;
  vec3 sky = mix(uCeil*1.35 + lightC*.12, lightC*(.6 + 1.2*lens), clot);
  float fd = uWK*length(uCam - vW)*.75;
  gl_FragColor = vec4(mix(uCeil, sky, exp(-fd*fd)), 1.);
}`}));Po.frustumCulled=!1,Po.renderOrder=-1,Po.visible=!1,Po.name="poolWindow",x.add(Po),await a.yield();let tt=null;const zt=[.906,-.423];if(ce){L.fall=L.slantTo-.0305,j.pointAt(L.fall,He);const e=Math.min(He.x-8.5,ge.bears[ge.apexBear].position.x-26);let t=0,n=-1;for(let k=e-14;k<=e+14;k+=1){if(k>ge.bears[ge.apexBear].position.x-24||k<-62)continue;let w=1e9;for(const g of ge.bears)w=Math.min(w,Math.abs(g.position.x-k),Math.abs(g.position.x-k-3));Ma!==null&&(w=Math.min(w,Math.abs(Ma-k)+1.5,Math.abs(Ma-k-3)+1.5));const y=Math.min(w,11)-Math.abs(k-e)*.2;y>n&&(n=y,t=k)}const s=oe.crestAt(t)-.06,l=-2.2,d=3.3,p=oe.addBears([{x:t,y:s,z:l,yaw:Math.atan2(zt[0],zt[1]),scale:1.3,girth:1.12,phase:.3,tint:.3,period:60,offset:30}],{own:!0,name:"defender"}),h=oe.addBears([{x:t+zt[0]*d,y:s,z:l+zt[1]*d,yaw:Math.atan2(-zt[0],-zt[1]),scale:1.36,girth:1.16,phase:.7,tint:.15,period:60,offset:30}],{own:!0,name:"boar"});for(let k=0;k<1300;k++)b();const u=nt(((a.seed??1)|0)*4513+291>>>0),c=440,i=new Float32Array(c*4),f=new Float32Array(c*4),m=t+.9,B=3.7;for(let k=0;k<c;k++){const w=u()*6.283,y=k<320?0:k<400?1:2,g=y===0?u.range(2.2,8.5):y===1?u.range(0,1.6):u.range(.3,4.5),F=y===0?u.range(10,23)*(1-g/17):y===1?u.range(15,25):u.range(6,15),P=y===2?u.range(.75,1.3):u.range(.2,.5);i.set([m+Math.cos(w)*(1.2+g*.14),.15,B+Math.sin(w)*(1.2+g*.14),u()*(y===2?.3:.22)],k*4),f.set([Math.cos(w)*g,F,Math.sin(w)*g*.8+1.2,P],k*4)}const S=new o.InstancedBufferGeometry;S.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),S.setIndex([0,1,2,0,2,3]),S.setAttribute("iP",new o.InstancedBufferAttribute(i,4)),S.setAttribute("iV",new o.InstancedBufferAttribute(f,4)),S.instanceCount=c;const r=new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uT:{value:-1},uVH:{value:450},uFloor:{value:-.25},uWhiteK:{value:1},uSunCol:he.uSunCol,uSkyCol:he.uSkyCol},vertexShader:Is,fragmentShader:js,fog:!0,transparent:!0,depthWrite:!1}),M=new o.Mesh(S,r);M.frustumCulled=!1,M.renderOrder=7,M.name="fightSplash",x.add(M);const C=ka(t,1.2,1.3,s),v=ka(t+zt[0]*d,1.2,1.36,s);v.w=0,tt={dfn:p,atk:h,splash:r,xD:t,zD:l,sxc:m,szc:B,mD:C,mA:v,yC:s,SEP:d},L.rareX=t,L.bearsX=ge.bears.map(k=>Math.round(k.position.x))}const Cr=(e,t)=>{if(!tt)return;const n=e+3.4,s=z(-1.9,-.5,n),l=z(-.4,.3,n),d=z(0,.6,e),p=Math.max(0,e-.42),h=1-z(.5,1.6,e),u=1-z(-4.6,-.9,n),c=Math.abs(Math.sin(n*6.5))*u*(1-u)*4,i=z(.7,3.4,e),f=1.3*z(-.25,.4,e)+3.3*i+.25*Math.abs(Math.sin(e*5.5))*i*(1-i)*4;tt.atk.rear.value.set(s*h*(1.3+.05*Math.sin(t*5.1)*l)+.14*c,zt[0]*(21*u-f)+Math.sin(t*3.3)*.22*l*h,-2.1*u*u+.5*c,zt[1]*(21*u-f)),tt.atk.rear2.value.set(0,0,l*h,0);const m=5.4*z(.05,1,e);tt.dfn.rear.value.set(s*(1.3+.05*Math.sin(t*4.3+1)*l*(1-d))+d*.55,-zt[0]*1.5*d+.42*m-Math.sin(t*3.3)*.22*l*(1-d),-Math.min(11*p*p,13),-zt[1]*1.5*d+.9*m),tt.dfn.rear2.value.set(d*.95,0,l*(1-.6*d),z(.05,.45,e));const B=e-1;tt.splash.uniforms.uT.value=B,Ge.uWave.value.set(tt.sxc,tt.szc,B>0?1.5+7.5*B:-100,B>0?.9*Math.exp(-B*.55)*z(0,.25,B):0),tt.mD.set(tt.xD+.42*m-zt[0]*1.5*d,1.9,tt.yC+Q(6,10.5,s),1-z(.25,.8,e)),tt.mA.set(tt.xD+zt[0]*(tt.SEP+21*u-f),1.9,tt.yC+Q(6,10.5,s*h),1-u)},Fr=so([5.5,2.2,.3,.12]),mt=[Ke.x+.6,Ke.z-1.6];for(let e=0;e<12&&ke(mt[0],mt[1]).dist<5.3;e++)mt[0]-=.25;const bo=.75,Zo=24,ls=2,Br=7.25,hs=3.2,Ye=[0,0],it=[0,0],Gt=[0,0];let hn=0,cs=0;{const e=j.pointAt(L.wolf,new o.Vector3),t=(k,w)=>{const y=st(k+.4,w)-st(k-.4,w),g=st(k,w+.4)-st(k,w-.4),F=Math.hypot(y,g)||1e-6;return[y/F,g/F,F/.8]},n=(k,w)=>{for(let y=0;y<6;y++){const g=t(k,w),F=Ne((st(k,w)-bo)/Math.max(g[2],.08),-.7,.7);k-=g[0]*F,w-=g[1]*F}return[k,w]};let s=null,l=null,d=0;for(let k=0;k<=720;k++){const w=k/720*6.2832,y=e.x+Math.cos(w)*Zo,g=e.z+Math.sin(w)*Zo,F=st(y,g)>bo&&Se(y,g)<0;if(l!==null&&F!==l){const P=(w+d)*.5,H=n(e.x+Math.cos(P)*Zo,e.z+Math.sin(P)*Zo);(!s||H[1]<s[1])&&(s=H)}l=F,d=w}s||(s=n(je.x,je.z-je.rz)),await a.yield();const p=t(s[0],s[1]),h=-p[1]*(s[0]-mt[0])+p[0]*(s[1]-mt[1])>0?1:-1,u=.25,c=[];let i=s[0],f=s[1];for(let k=0;k<12;k++){const w=t(i,f);[i,f]=n(i+w[1]*h*u,f-w[0]*h*u)}for(let k=0;k<100;k++){const w=t(i,f);c.push([i+w[0]*ls,f+w[1]*ls,w[0],w[1]]),[i,f]=n(i-w[1]*h*u,f+w[0]*h*u)}await a.yield();let m=0,B=1e9;for(let k=0;k<25;k++){const w=Math.abs(Math.hypot(c[k][0]-e.x,c[k][1]-e.z)-Zo);w<B&&(B=w,m=k)}const S=fe("wolf2"),r=m+Math.round(Br/u),M=Math.min(c.length-1,r+Math.round(S.range(3.5,6.5)/u));Ye[0]=c[m][0],Ye[1]=c[m][1],it[0]=c[r][0],it[1]=c[r][1],Gt[0]=c[M][0],Gt[1]=c[M][1];const C=Math.atan2(it[0]-Ye[0],it[1]-Ye[1]);let v=Math.atan2(-c[m][2],-c[m][3])-C;v-=Math.round(v/6.2832)*6.2832,hn=C+v,cs=Math.atan2(it[0]-Gt[0],it[1]-Gt[1])+S.range(-.3,.3)}const cn=[],Tr=Math.atan2(it[0]-Ye[0],it[1]-Ye[1]),Pr=Math.hypot(it[0]-Ye[0],it[1]-Ye[1]),Dr=()=>new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...At,uGrain:{value:new o.Vector4(5.5,2.2,.3,N?1.6:0)},uFogK:{value:1},uTone:{value:N?1.5:1},uAlgae:{value:0},uGait:{value:new o.Vector4(0,0,0,0)}},vertexShader:ci,fragmentShader:Hs,fog:!0,vertexColors:!0,side:o.DoubleSide}),us=(e,t,n,s,l)=>{const d=new o.Group,p=new o.Mesh(e,Dr());return p.name="wolf",d.add(p),d.position.set(t,_e(t,n)-.06,n),d.rotation.y=s,d.scale.setScalar(l),x.add(d),d.userData.gait=p.material.uniforms.uGait.value,d};await a.yield();const Rr=$s(!0,D.season==="july");await a.yield();const Qt=us(Rr,Ye[0],Ye[1],hn,1),qr=Qt.position.y,Vr=_e(it[0],it[1])-.06,Lr=Qt.userData.gait;let un=null,Aa=null;if(Y.secondWolf){const e=$s(!1);await a.yield(),Aa=us(e,Gt[0],Gt[1],cs,.9),un=Aa.userData.gait}await a.yield();{const e=Wo();Dn(e,[0,.15,0],vt,Nt,Ct,2.1,0,!0,D.season==="july"),Dn(e,[.7,.14,1.5],[.5,0,.866],[-.866,0,.5],Ct,1.8,0,!0,D.season==="july");const t=new o.Mesh(e.build(),Fr);t.position.set(mt[0],_e(mt[0],mt[1])+.03,mt[1]),t.rotation.set(-.16,.35,0),t.name="carcass",cn.push(t),x.add(t),await a.yield();const n=b.fork("standing"),s=10,l=new Float32Array(s*4),d=new Float32Array(s*4),p=[[.3,1.9],[-1,2.9],[-2.5,1.8],[-3.1,-.5],[-2.2,-2.6],[.2,-1.5],[-1.3,.7]],h=[[-4,.6,1.25],[-1.2,-1.6,2.35],[.6,-3.4,1.75]];for(let i=0;i<s;i++){const f=i>=7,m=f?h[i-7]:p[i],B=mt[0]+m[0]+(f?0:n.range(-.25,.25)),S=mt[1]+m[1]+(f?0:n.range(-.25,.25));l.set([B,Math.max(_e(B,S),-.06)-.02+(f?m[2]:0),S,Math.atan2(mt[0]-B,mt[1]-S)+n.range(-.4,.4)],i*4),d.set([n(),n.range(3.2,6.5),n.range(.9,1.08),f?1:0],i*4)}await a.yield();const u=Ri();await a.yield();const c=new o.Mesh(gt(u,s,{iA:l,iB:d}),new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),...At},vertexShader:di,fragmentShader:mi,fog:!0,vertexColors:!0,side:o.DoubleSide}));c.frustumCulled=!1,c.name="gulls",cn.push(c),x.add(c)}await a.yield();const Do={...o.UniformsUtils.clone(o.UniformsLib.fog),...At,uGo:{value:-10},uSize:{value:1.05}},_r=e=>2.5*e+1.6*e*e,Gr=Ge.uDuck.value;let fn=1e9;{const t=new Float32Array(32),n=new Float32Array(32),s=[],l=[],d=Ge.uDuckL.value,p=[],h=nt(((a.seed??1)|0)*6689+53>>>0),u=23;for(let m=0;m<8;m++){const B=b(),S=b(),r=b(),M=b();let C=Ae+3.5+11.5*B,v=-48-28*S;for(let V=0;V<30&&p.some(T=>Math.hypot(T[0]-C,T[1]-v)<2.4);V++)C=Ae+h.range(3.5,15),v=h.range(-76,-48);p.push([C,v]);let k=1;for(let V=0;V<=400;V++){const T=L.splash+(1-L.splash)*V/400;if(j.pointAt(T,He),Math.hypot(He.x-C,He.z-v)<u){k=T;break}}const w=xt(k)+.05+.45*r,y=1.93+(M-.5)*.6,g=Math.sin(y),F=Math.cos(y);let P=5;for(;P<70&&Se(C+g*(P+9),v+F*(P+9))<0;)P+=1.5;const H=(-2.5+Math.sqrt(6.25+6.4*P))/3.2,K=h.range(1.5,3.2);fn=Math.min(fn,w),L.ducks=Math.min(L.ducks??1,k),t.set([C,v,w/1.1,y],m*4),Gr[m].set(C,v,w,y),n.set([h(),h.range(21,30),K,H],m*4),d[m]=_r(H+.25);for(let V=0;V<20;V++){const T=.4+1.25*V,W=(-2.5+Math.sqrt(6.25+6.4*T))/3.2,A=V%2?.2:-.2,R=T>d[m];for(let G=0;G<4;G++)s.push(C+g*T+F*A+h.range(-.2,.2),Ie+.1,v+F*T-g*A+h.range(-.2,.2),(R?999:0)+w+W+h.range(0,.06)),l.push(-g*h.range(.3,1.6)+h.range(-.9,.9),h.range(3.2,6.2),-F*h.range(.3,1.6)+h.range(-.9,.9),h.range(.09,.2))}}const c=new o.Mesh(gt(qi(),8,{iA:t,iB:n}),new o.ShaderMaterial({uniforms:Do,vertexShader:ui,fragmentShader:fi,fog:!0,vertexColors:!0,side:o.DoubleSide}));c.frustumCulled=!1,c.name="mergansers",x.add(c),await a.yield();const i=new o.InstancedBufferGeometry;i.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]),i.setAttribute("iP",new o.InstancedBufferAttribute(new Float32Array(s),4)),i.setAttribute("iV",new o.InstancedBufferAttribute(new Float32Array(l),4)),i.instanceCount=s.length/4,Do.uSprayVH={value:450};const f=new o.Mesh(i,new o.ShaderMaterial({uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uT:Do.uGo,uVH:Do.uSprayVH,uFloor:{value:Ie-.35},uWhiteK:{value:.8},uSunCol:he.uSunCol,uSkyCol:he.uSkyCol},vertexShader:Is,fragmentShader:js,fog:!0,transparent:!0,depthWrite:!1}));f.frustumCulled=!1,f.renderOrder=7,f.name="duckSpray",f.userData.ur=[L.ducks-.004,1.01],x.add(f),Bt.push(f)}await a.yield();const Ro=ko.makeFauna(x,{light:ko.lightFrom(x)});Ro.add(ko.makeFlock({rng:b.fork("gulls"),species:"gulls",count:Math.max(5,Math.round(Y.gulls*.5)),size:2.2,center:[mt[0]-13,13,mt[1]+3],radius:6,spread:[5,1.5,6],speed:6,wander:[1.5,.7,1.5,.5]})),await a.yield(),await a.yield(),Ro.add(ko.makeFlock({rng:b.fork("gulls2"),species:"gulls",count:14,size:3,center:[(J+Ae)*.5,22,6],radius:30,spread:[26,5,10]})),await a.yield(),Ro.add(ko.makeFlock({rng:fe("poolGulls"),species:"gulls",count:9,size:3,center:[Ue(46),12,46],radius:22,spread:[20,3,14]})),await a.yield(),Ro.add(ko.makeFlock({rng:b.fork("eagles"),species:"eagles",count:Y.eagles,size:3,center:[10,64,30],radius:55})),await a.yield(),Ro.add(ko.makeFlock({rng:b.fork("stoop"),species:"eagles",count:1,size:3.4,speed:20,cross:{path:j,u:L.eagle,lead:26,angle:112,side:-1,height:8,span:170,sag:6.5,duration:Ra}})),await a.yield();const ot=b.fork("flora"),fs=Pt.makeWind({direction:[.85,.5],strength:D.rain?1.4:1}),ds={size:512,alphaTest:.4,anisotropy:2};await Pt.prepareLeafTexture(ds,a.yield);const Kr=Pt.makeLeafTexture(ds);await a.yield();const Er=Pt.windMaterial({wind:fs,map:Kr,backlight:1,backlightTint:D.season==="july"?"#d8ff7a":"#ffd468"});await a.yield();const za={leaf:"#24452f",leafLight:"#5d8658",leafDark:"#0c1f16",bark:"#4a3a2c",barkDark:"#241a12",snow:D.snow?.75:0,slim:1.12},ms=new o.Color(D.gold),ps="#"+ms.clone().lerp(new o.Color("#fff2a8"),.45).getHexString(),Nr="#"+ms.clone().multiplyScalar(.45).getHexString(),Sa=!D.birch,vs=Sa?{leaf:"#6e5c48",leafLight:"#9a8870",leafDark:"#3a3028"}:{leaf:D.gold,leafLight:ps,leafDark:Nr},gs=[],dn=[],ws=[],ys=[];for(const e of[16,18.5,21])gs.push(Pt.coniferGeometry({rng:ot,height:e,detail:0,...za})),await a.yield();for(const e of[17,20])dn.push(Pt.coniferGeometry({rng:ot,height:e,detail:1,...za})),await a.yield();for(const e of[12.5,14.5])ws.push(Pt.cypressGeometry({rng:ot,height:e,detail:0,girth:Sa?.07:.115,...vs,bark:"#b8b0a0"})),await a.yield();for(const e of[13,15])ys.push(Pt.birchGeometry({rng:ot,height:e,detail:0,autumn:D.season!=="july",foliage:!Sa,...D.season==="july"||Sa?{}:vs})),await a.yield();const qo=e=>Ne((445-e)/840,0,.999),mn=[],pn=[],Ca=[],vn=[],Fa=[];let Hr=0;for(let e=-390;e<440;e+=17)for(let t=-275;t<325;t+=17){(++Hr&127)===0&&await a.yield();const n=t+ot.range(-6.5,6.5),s=e+ot.range(-6.5,6.5),l=Se(n,s);if(l<7||l>100||ot()>(l<36?.96:.96*Math.exp(-(l-36)/30)))continue;const d=ke(n,s).dist;if(d<23)continue;const p={x:n,y:st(n,s),z:s,s:3*ot.range(.85,1.18),rot:ot()*6.283,d,u:qo(s)};ot()>(l<24?.5:.24)?mn.push(p):d<120&&Ca.length<42?Ca.push(p):pn.push(p)}await a.yield();for(let e=-385;e<440;e+=13)for(const t of[-1,1]){const n=Ue(e)+t*(De(e)+ot.range(1.5,8)),s=ke(n,e).dist;s<15||e<16&&e>-48&&Math.abs(n)<92||vn.push({x:n,y:st(n,e),z:e,s:ot.range(2.6,4.3),rot:ot()*6.283,d:s,u:qo(e)})}await a.yield();const Ur=Math.round(3300*(.45+.55*E));for(let e=0;e<Ur;e++){(e&255)===255&&await a.yield();let t,n;if(e%9===0){const l=ot()*6.283,d=Math.sqrt(ot())*.95,p=e%27===0?ze:je;t=p.x+Math.cos(l)*d*p.rx,n=p.z+Math.sin(l)*d*p.rz}else if(n=ot.range(-385,440),t=Ue(n)+ot.sign()*(De(n)+.3+12.5*Math.pow(ot(),1.6)),n<16&&n>-48&&Math.abs(t)<90)continue;const s=st(t,n);s<Re(n)+.7||Math.abs(t)<110&&ke(t,n).dist<8.5||t>J+3&&t<J+25&&n>82&&n<98.5||((t-J-21)/11.5)**2+((n-99.6)/5.6)**2<1||Math.hypot(t-ze.x+2,n-ze.z-4)<9||Math.hypot(t-Ye[0],n-Ye[1])<hs||Math.hypot(t-Gt[0],n-Gt[1])<hs||Fa.push({x:t,y:s,z:n,s:ot.range(.72,1.25),rot:ot()*6.283,d:50,u:qo(n)})}for(let e=0;e<54;e++){const t=e>=20,n=me()*6.283,s=Math.sqrt(me())*(t?2.9:2.3)+(t?0:.5),l=t?me.range(.62,1.12):me.range(-.05,.5),d=Q(Ye[0],it[0],l),p=Q(Ye[1],it[1],l),h=d+Math.cos(n)*s*(t?1:.8),u=p+Math.sin(n)*s*(t?.75:.8),c=st(h,u);c<.75||Fa.push({x:h,y:c,z:u,s:t?me.range(.5,.72):me.range(.3,.46),rot:me()*6.283,d:50,u:qo(u)})}const bs=D.season==="july"?["#4a6a2a","#b4c45c"]:D.snow?["#7a6a44","#e6d8a4"]:["#6a5626","#e0bc5c"];await a.yield();const Wr=[0,1].map(e=>Pt.grassTuftGeometry({rng:ot,cards:3,width:3.1+e*.7,height:4+e*.7,root:bs[0],tip:bs[1]}));await a.yield();const xs=[],Rt=[];{const e=b.fork("clump"),t=it[0]-Ye[0],n=it[1]-Ye[1];for(let h=0;h<90&&Rt.length<18;h++){const u=Rt.length<6,c=e()*6.283,i=Math.sqrt(e()),f=J+21+Math.cos(c)*i*9.5,m=99.6+Math.sin(c)*i*4.2,B=u?e.range(.8,1.25):e.range(.36,.6),S=e()*6.283,r=Ne(((f-Ye[0])*t+(m-Ye[1])*n)/(t*t+n*n),0,1.3);if(Math.hypot(f-Ye[0]-t*r,m-Ye[1]-n*r)<2.6||Math.hypot(f-J-21,m-94)<3.2)continue;let M=!0;for(const C of Rt)Math.hypot(C.x-f,C.z-m)<(u?3.2:1.7)&&(M=!1);M&&Rt.push({x:f,y:st(f,m)-.12,z:m,s:B,rot:S,d:30,u:qo(m)})}const s=fe("barSpruce"),l=Rt.length,d=3,p=(h,u)=>st(h,u)>bo+.2&&st(h+d,u)>bo&&st(h-d,u)>bo&&st(h,u+d)>bo&&st(h,u-d)>bo;for(let h=0;h<160&&Rt.length<l+16;h++){const u=Rt.length<l+7,c=s()*6.283,i=Math.sqrt(s()),f=je.x+Math.cos(c)*i*je.rx,m=je.z+Math.sin(c)*i*je.rz,B=u?s.range(.8,1.2):s.range(.36,.6),S=s()*6.283,r=Ne(((f-Ye[0])*t+(m-Ye[1])*n)/(t*t+n*n),0,1.3);if(!p(f,m)||Math.hypot(f-Ye[0]-t*r,m-Ye[1]-n*r)<2.6||Math.hypot(f-Gt[0],m-Gt[1])<3.2)continue;let M=!0;for(const C of Rt)Math.hypot(C.x-f,C.z-m)<(u?3:1.7)&&(M=!1);M&&Rt.push({x:f,y:st(f,m)-.12,z:m,s:B,rot:S,d:30,u:qo(m)})}}const Vo=(e,t,n={})=>{if(!t.length)return;const s=Pt.makeScatter({rng:ot,variants:e,points:t,material:Er,chunks:5,tint:.16,hue:.05,...n});x.add(s.object),xs.push(s)};for(const[e,t]of[[-1e4,-60],[-60,150],[150,1e4]])Vo(dn,mn.filter(n=>n.z>=e&&n.z<t),{farVariants:gs,farDistance:78,chunks:2}),await a.yield();Vo(dn,Rt,{chunks:1,tint:.1}),await a.yield(),Vo(ws,pn,{tint:.22}),await a.yield(),Vo(ys,Ca,{tint:.2}),await a.yield();const Ir=[0,1].map(()=>Pt.bushGeometry({rng:ot,size:1.7,detail:0,leaf:D.season==="july"?"#4f7a30":"#9a8a2c",leafLight:D.season==="july"?"#9ab84e":"#e0c850",leafDark:"#3a3a16"}));await a.yield(),Vo(Ir,vn,{tint:.22}),await a.yield();for(const[e,t]of[[-1e4,-20],[-20,130],[130,1e4]])Vo(Wr,Fa.filter(n=>n.z>=e&&n.z<t),{tint:.22,tilt:.14,sink:.02,chunks:2}),await a.yield();{const e=to.data,t=to.nx,n=to.nz,s=(B,S,r,M,C,v)=>{const k=(B-to.x0)/to.cell-.5,w=(S-to.z0)/to.cell-.5,y=M/to.cell+.6,g=Math.max(1,Math.floor(k-y)),F=Math.min(t-2,Math.ceil(k+y)),P=Math.max(1,Math.floor(w-y)),H=Math.min(n-2,Math.ceil(w+y));for(let K=P;K<=H;K++)for(let V=g;V<=F;V++){const T=Math.hypot(V-k,K-w)/y;if(T>=1)continue;const W=r*(v===0?Math.pow(1-T,.8):v===1?Math.sqrt(1-T*T):1-.35*T),A=Math.min(255,Math.round(W*255/80)),R=(K*t+V)*4;A>e[R]&&(e[R]=A,e[R+1]=C,e[R+3]=255)}},l=async(B,S,r,M,C,v=0)=>{let k=0;for(const w of B){const y=S*w.s;s(w.x,w.z,Math.max(w.y-Re(w.z),0)+y,Math.max(r*y,v),M,C),(++k&63)===0&&await a.yield()}await a.yield()},d=D.birch?255:120;await l(mn,18.5,.15,0,0),await l(Rt,18.5,.16,0,0),await l(pn,13.5,.1,d,1),await l(Ca,14,.2,d,1),await l(vn,2.1,.75,D.season==="july"?100:135,1),await l(Fa,4.2,0,D.snow?90:115,2,2.3);const p=[{data:e,width:t,height:n}];for(let B=1;B<7;B++){const S=p[B-1],r=Math.max(1,S.width>>1),M=Math.max(1,S.height>>1),C=new Uint8Array(r*M*4);for(let v=0;v<M;v++)for(let k=0;k<r;k++){let w=0,y=0;for(let F=2*v-1;F<=2*v+2;F++)for(let P=2*k-1;P<=2*k+2;P++){if(P<0||F<0||P>=S.width||F>=S.height)continue;const H=(F*S.width+P)*4;S.data[H]>w&&(w=S.data[H],y=S.data[H+1])}const g=(v*r+k)*4;C[g]=w,C[g+1]=y,C[g+3]=255}p.push({data:C,width:r,height:M}),await a.yield()}const h=new o.DataTexture(e,t,n,o.RGBAFormat);h.mipmaps=p,h.magFilter=o.LinearFilter,h.minFilter=o.LinearMipmapNearestFilter,h.generateMipmaps=!1,h.wrapS=h.wrapT=o.ClampToEdgeWrapping,h.needsUpdate=!0,Ge.tTrees.value=h;const u=new o.Color(D.gold),c=he.uSunCol.value,i=he.uSkyCol.value,f=D.season==="july"?.5:1;Ge.uGoldRef.value.setRGB(u.r*(c.r*.2+i.r*.55)*f,u.g*(c.g*.2+i.g*.55)*f,u.b*(c.b*.2+i.b*.55)*f);const m=new o.Color(za.leaf);Ge.uSpruceRef.value.setRGB(m.r*(c.r*.16+i.r*.95)+.004,m.g*(c.g*.16+i.g*.95)+.005,m.b*(c.b*.16+i.b*.95)+.005),Ge.uSpruceLit.value.set(za.leafLight)}await a.yield();const jr={...At,uHaze:{value:Vt.horizonColor.clone()},uHazeK:{value:Ne(.36+D.mist*.7,.36,.85)}};let Jo;{const t=45*Math.PI/180,n=Math.min(5e3,3600),s=1500,l=1050,d=-Math.sin(t)*n,p=-Math.cos(t)*n,h=56,u=12,c=[],i=[],f=[],m=Xt(D.season==="july"?"#55683a":"#8a3c2a"),B=Xt("#1c3024");for(let r=0;r<=u;r++)for(let M=0;M<=h;M++){const C=M/h*6.283,v=r/u,k=Math.cos(C),w=Math.sin(C),y=s*v*(1+.16*q.n2(k*1.3+7,w*1.3)),g=l*Math.pow(1-v*v,1.35)*(.84+.2*q.fbm2(k*v*2.3+3,w*v*2.3+5,3))*(1-.1*Math.abs(q.n2(k*4,w*4))*v);c.push(d+k*y,-30+g,p+w*y);const F=z(.6,.76,g/l+.07*q.n2(k*v*9,w*v*9))*(D.season==="july"?.25:1),P=Te(Te(B,m,z(.08,.3,g/l)),[.78,.81,.87],Math.max(F,D.snow?.55*z(.15,.4,g/l):0));i.push(P[0],P[1],P[2])}for(let r=0;r<u;r++)for(let M=0;M<h;M++){const C=r*(h+1)+M,v=C+h+1;f.push(C,C+1,v,C+1,v+1,v)}const S=new o.BufferGeometry;S.setAttribute("position",new o.Float32BufferAttribute(c,3)),S.setAttribute("color",new o.Float32BufferAttribute(i,3)),S.setIndex(f),S.computeVertexNormals(),Jo=new o.Mesh(S,new o.ShaderMaterial({uniforms:jr,vertexColors:!0,side:o.DoubleSide,vertexShader:"varying vec3 vN, vC; void main(){ vN = normal; vC = color; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }",fragmentShader:"uniform vec3 uSun, uSunCol, uSkyCol, uHaze; uniform float uHazeK; varying vec3 vN, vC; void main(){ vec3 n = vN/max(length(vN), 1e-5); if (n.y < 0.) n = -n; vec3 c = vC*(uSunCol*max(dot(n, uSun)*.8 + .2, 0.)*.75 + uSkyCol*.8); gl_FragColor = vec4(mix(c, uHaze, uHazeK), 1.); }"})),Jo.name="dumpling",Jo.renderOrder=-.5,x.add(Jo)}const gn=Sn.makeHorizonRidges({rng:b.fork("ridges"),layers:3,radius:[1300,3300],height:[70,250],colorNear:D.season==="july"?"#2c4030":"#4a3028",fog:x.fog,sunDir:Ht,sunColor:Vt.lightColor,snow:D.season!=="july",snowLine:.72,rim:.3});x.add(gn.object),await a.yield();const Lo={value:0},_o=[];!D.snow&&D.leaf>.1&&_o.push(na.makeParticles({rng:b.fork("leaves"),preset:"leaves",time:Lo,count:Math.round(560*E*D.leaf),box:[80,34,80],size:[.2,.4],colors:[D.gold,ps,"#c8742a"]})),_o.push(na.makeParticles({rng:b.fork("fluff"),preset:"pollen",time:Lo,count:Math.round(650*E),box:[58,24,58],size:[.05,.11],colors:N?["#8fa0c8","#7888b0","#a0b0d0"]:["#ffffff","#f4f0e0","#e8ecf0"]})),D.snow&&_o.push(na.makeParticles({rng:b.fork("snow"),preset:"snow",time:Lo,count:Math.round(2400*E)})),D.rain&&_o.push(na.makeParticles({rng:b.fork("rain"),preset:"rain",time:Lo,count:Math.round(4500*E)}));for(const e of _o)x.add(e.object);await a.yield();const wn=[];for(let e=0;e<30;e++){const t=-52-290*b(),n=Ue(t)+b.range(-.8,.8)*De(t);wn.push([n,Ie+b.range(2.5,7),t])}if(D.mist>.3)for(let e=0;e<18;e++){const t=-4-150*b();wn.push([Ue(t)+b.range(-.9,.9)*De(t),Ie+b.range(3,8),t])}const ks=na.makeMist({rng:b.fork("mist"),time:Lo,positions:wn,size:[22,46],color:"#"+ra.clone().lerp(new o.Color(N?"#5a6a90":"#ffffff"),.5).getHexString(),opacity:.07+.3*D.mist});x.add(ks.object);const Ms={...At,uVeil:{value:new o.Vector2(0,0)},uWhite:{value:new o.Color(St[5])}},Go=new o.Mesh(new o.PlaneGeometry(2,2),new o.ShaderMaterial({uniforms:Ms,vertexShader:gi,fragmentShader:wi,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1}));Go.frustumCulled=!1,Go.renderOrder=55,Go.visible=!1,Go.name="veil",x.add(Go);const yn={...At,uSurfH:{value:Ie},uNearD:{value:.2},uGoldAmt:Ge.uGoldAmt,uVol:Ge.uVol,uSkyHor:Ge.uSkyHor,uSkyAir:Ge.uSkyAir,uSunAir:Ge.uSunAir,uHorizon:Ge.uHorizon,uGold:Ge.uGold,uSpruceRef:Ge.uSpruceRef,uGoldRef:Ge.uGoldRef},Ko=new o.Mesh(new o.PlaneGeometry(2,2),new o.ShaderMaterial({uniforms:yn,vertexShader:yi,fragmentShader:bi,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1}));Ko.frustumCulled=!1,Ko.renderOrder=50,Ko.visible=!1,Ko.name="glassLine",x.add(Ko),await a.yield();const Yt={uTime:he.uTime,uCam:he.uCam,uSurfY:{value:0},uLen:{value:8},uGain:{value:1},uRange:{value:30},uWK:{value:zo},uShort:{value:.6},uThin:{value:1},uWd:{value:new o.Vector2(0,1)},uDir:{value:fo},uAvoid:{value:new o.Vector3(Fe.x,Fe.z,7.5)},uShaftCol:{value:he.uSunCol.value.clone().multiply(new o.Color(.62,1,.78)).multiplyScalar(N?.11:D.weather==="rain"?.05:.085)}};let Kt;{const e=Math.round(52*(.6+.4*E)),t=new Float32Array(e*4),n=b.fork("shafts");for(let l=0;l<e;l++)t.set([n()*60,n()*60,n.range(.4,1.5),n()],l*4);const s=new o.InstancedBufferGeometry;s.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),s.setIndex([0,1,2,0,2,3]),s.setAttribute("iS",new o.InstancedBufferAttribute(t,4)),s.instanceCount=e,Kt=new o.Mesh(s,new o.ShaderMaterial({uniforms:Yt,vertexShader:Tn,fragmentShader:Pn,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,side:o.DoubleSide,fog:!1})),Kt.frustumCulled=!1,Kt.renderOrder=4,Kt.name="shafts",x.add(Kt)}await a.yield();const As={...Yt,uSurfY:{value:0},uLen:{value:12.5},uGain:{value:0},uRange:{value:5e3},uWK:{value:zo*.5},uShort:{value:.75},uWd:{value:new o.Vector2(0,.5)},uAvoid:{value:new o.Vector3(0,9e3,1)}};let xo;{const e=new Float32Array([Me-8.5,Z-17,1.7,.21,Me-12.5,Z-25,2.3,.57,Me-9.5,Z-33,1.8,.83]),t=new o.InstancedBufferGeometry;t.setAttribute("position",Kt.geometry.getAttribute("position")),t.setIndex(Kt.geometry.getIndex()),t.setAttribute("iS",new o.InstancedBufferAttribute(e,4)),t.instanceCount=3,xo=new o.Mesh(t,new o.ShaderMaterial({uniforms:As,vertexShader:Tn,fragmentShader:Pn,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,side:o.DoubleSide,fog:!1})),xo.frustumCulled=!1,xo.renderOrder=4,xo.name="entryShafts",xo.visible=!1,x.add(xo)}let io=null;const zs={...Yt,uSurfY:{value:0},uLen:{value:4},uGain:{value:N?1.5:2.1},uRange:{value:5e3},uWK:{value:zo*.5},uShort:{value:0},uThin:{value:.5},uWd:{value:new o.Vector2(0,1)},uAvoid:{value:new o.Vector3(0,9e3,1)}};if(Fo.length){const e=[[.1,-.5,.5],[-.6,.7,.38]],t=new Float32Array(Fo.length*8);let n=1;for(const l of Fo)n=Math.max(n,l[2]/-fo.y);Fo.forEach((l,d)=>{const p=l[2]/-fo.y;for(let h=0;h<2;h++)t.set([l[0]+e[h][0]-fo.x*p,l[1]+e[h][1]-fo.z*p,e[h][2],(d*2+h+.999*p/n)/7.3],(d*2+h)*4)}),zs.uLen.value=n;const s=new o.InstancedBufferGeometry;s.setAttribute("position",Kt.geometry.getAttribute("position")),s.setIndex(Kt.geometry.getIndex()),s.setAttribute("iS",new o.InstancedBufferAttribute(t,4)),s.instanceCount=Fo.length*2,io=new o.Mesh(s,new o.ShaderMaterial({uniforms:zs,vertexShader:Tn,fragmentShader:Pn,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,side:o.DoubleSide,fog:!1})),io.frustumCulled=!1,io.renderOrder=4,io.name="nestShafts",io.visible=!1,x.add(io)}await a.yield();const bn={uT:{value:-9},uVH:{value:450},uSunCol:he.uSunCol,uSkyCol:he.uSkyCol};let ea;{const e=b.fork("halo"),t=Math.round(104*(.6+.4*E)),n=new Float32Array(t*4),s=new Float32Array(t*4),l=ge.apexMouth;j.pointAt(L.snap,He);const d=[He.x-l.x,He.y-l.y,He.z-l.z],p=Math.hypot(d[0],d[1],d[2])||1;d[0]/=p,d[1]/=p,d[2]/=p;const h=Math.hypot(d[0],d[2])||1,u=[d[2]/h,0,-d[0]/h],c=[d[1]*u[2],d[2]*u[0]-d[0]*u[2],-d[1]*u[0]],i=.91,f=[Ae-2.6,-1,7.2],m=[(l.x-f[0])/i,(l.y-f[1])/i+11*i,(l.z-f[2])/i];for(let S=0;S<t;S++){const r=.007+.052*Math.pow(e(),3.4),M=r>.03;if(S<t*.78){const C=Ne(2.25+e.gauss()*.5,1.2,3.35),v=(1.6+9.5*Math.pow(e(),2.1))*(M?1.25:1),k=e.range(-.6,2.6),w=e.range(-.45,.45),y=Math.cos(C)*v,g=Math.sin(C)*v+1.4;n.set([l.x+u[0]*w+d[0]*.3,l.y+e.range(-.25,.2),l.z+u[2]*w+d[2]*.3,S<t*.6?-e.range(.02,.3):e.range(0,.22)],S*4),s.set([u[0]*y+c[0]*g+d[0]*k,u[1]*y+c[1]*g+d[1]*k,u[2]*y+c[2]*g+d[2]*k,r],S*4)}else{const C=i-e.range(.04,.42),v=e.range(.35,.7);n.set([f[0]+m[0]*C+e.range(-.2,.2),f[1]+m[1]*C-11*C*C+e.range(-.2,.2),f[2]+m[2]*C+e.range(-.2,.2),C-i-.02],S*4),s.set([m[0]*v+e.range(-1.2,1.2),(m[1]-22*C)*v+e.range(.5,3),m[2]*v+e.range(-1.2,1.2),r*.8],S*4)}}const B=new o.InstancedBufferGeometry;B.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),B.setIndex([0,1,2,0,2,3]),B.setAttribute("iP",new o.InstancedBufferAttribute(n,4)),B.setAttribute("iV",new o.InstancedBufferAttribute(s,4)),B.instanceCount=t,ea=new o.Mesh(B,new o.ShaderMaterial({uniforms:bn,vertexShader:pi,fragmentShader:vi,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,fog:!1,side:o.DoubleSide})),ea.frustumCulled=!1,ea.renderOrder=9,ea.name="halo",x.add(ea)}await a.yield();const Eo=e=>.2126*e.r+.7152*e.g+.0722*e.b,ta=(e,t,n)=>new o.Color(t[0],t[1],t[2]).multiplyScalar(Eo(e)*.95).lerp(e,n),qt=D.uw||null,Ba=(e,t)=>e.multiplyScalar(t/Math.max(Eo(e),1e-4)),No=he.uSun.value.clone(),Ss=No.clone();if(qt){const e=Math.hypot(No.x,No.z),t=e/1.333,n=e>1e-4?t/e:0;Ss.set(No.x*n,Math.sqrt(1-t*t),No.z*n).normalize()}const Ho={sun:2.18,sky:.4,rigSun:1.52,rigHemi:.945},Ta=he.uSunCol.value.clone(),Cs=he.uSkyCol.value.clone(),oa=ta(Ta,[.8,1,.9],qt?qt.keep:.15),xn=ta(Cs,[.78,1,.95],.2);qt&&(Ba(oa,Ho.sun*.9),Eo(xn)<Ho.sky&&Ba(xn,Ho.sky));const Fs=N?.11:D.weather==="rain"?.05:.085;qt?Yt.uShaftCol.value.copy(Ta).multiplyScalar(Eo(oa)/Math.max(Eo(Ta),1e-4)).lerp(oa,.5).multiplyScalar(Fs*qt.shaft):Yt.uShaftCol.value.copy(oa).multiply(new o.Color(.7,1,.84)).multiplyScalar(Fs);const Bs=wt.light.sunColor.clone(),Or=ta(Bs,[.8,1,.9],.15),Ts=Dt.sun.color.clone(),Ps=Dt.hemi.color.clone(),Ds=ta(Ts,[.8,1,.9],qt?qt.keep:.15),kn=ta(Ps,[.78,1,.95],.2),Uo=Dt.direction.clone(),Mn=Uo.clone();if(qt){const e=Math.hypot(Uo.x,Uo.z),t=e/1.333,n=e>1e-4?t/e:0;Mn.set(Uo.x*n,Math.sqrt(1-t*t),Uo.z*n).normalize(),Ba(Ds,Ho.rigSun/Math.max(Dt.sun.intensity*Mn.y,.2)),Eo(kn)*Dt.hemi.intensity<Ho.rigHemi&&Ba(kn,Ho.rigHemi/Math.max(Dt.hemi.intensity,.2))}const Ki=ge.bears[0].head,An=ge.apexMouth,Rs=new o.Vector3,Qr=new o.Vector3,aa=new o.Vector3,Yr=[{at:[J+8,9,0],from:.12,to:.3,weight:.3},{at:[Fe.x+.6,-.9,Fe.z],from:.285,to:L.missBreak-.03,weight:.45},{at:(e,t)=>{const n=z(L.missFall+.0015,L.missFall+.0085,t);return j.pointAt(Ne(t,0,1),aa),aa.set(Q(J+1.5,aa.x+19,n),Q(Ie+2.6,aa.y-3.4,n),Q(-4.5,aa.z-7,n))},from:L.missBreak-.04,to:L.missFall+.062,weight:.76,fade:.25},{at:(e,t)=>{const n=z(L.wolf-.018,L.wolf+.004,t),s=z(L.wolf,L.wolf+.03,t)*.6;return Rs.set(Q(mt[0]-.3,Q(Ye[0],it[0],s),n),Q(1.5,2.8,n),Q(mt[1],Q(Ye[1],it[1],s),n))},from:L.tailUp-.014,to:L.slantFrom+.004,weight:.75,fade:.25},{at:[Le.x+.4,2.4,Le.z-.2],from:L.slantFrom-.012,to:L.shoal+.022,weight:.5},{at:(e,t)=>Rs.set(Q(J+15,Ae-11,z(L.shoal+.05,L.slantTo-.012,t)),6.5,-1),from:L.shoal-.01,to:L.leapBreak-.03,weight:.55},...tt?[{at:(e,t)=>{const n=z(L.fall+.006,L.fall+.021,t);return Qr.set(Q(tt.xD+1.9,tt.sxc+2.5,n),Q(9.6,4.6,n),Q(-2.6,tt.szc,n))},from:L.shoal+.012,to:L.fall+.056,weight:.85,fade:.2}]:[],{at:[An.x,An.y-.3,An.z],from:L.leapBreak-(tt?.037:.045),to:L.apex+.004,weight:.78}];await a.yield(),await Vt.prewarm(a.renderer,null,x);const Ee=new o.Vector3,qs=new o.Vector2,$r=[wt.rays,wt.particles,wt.bubbles].filter(Boolean),Vs=wt.waterline.material.uniforms,Ls=xt(L.snap),Xr=xt(L.wolf),Zr=xt(L.fall??.7),lo=L.missFall;return{scene:x,path:j,duration:Ra,pace:Js,title:D.title,beats:L,camera:{fov:62,near:.2,far:4e3,lookAhead:20,sway:.8,bank:.3},pois:Yr,portal:{shape:"circle",radius:6,color:N?"#b8ccff":"#d4ecff",glow:1,revealDistance:240},post:{exposure:D.exposure,bloom:{strength:ne==="evening"?.22:.3,radius:.6,threshold:ne==="evening"?1.1:.93},grade:{saturation:D.sat,contrast:1.05,tint:D.tint,shadowTint:D.shadow,vignette:.3,grain:.02,aberration:0}},ride:"none",companion:"none",update(e,t,n,s){n.getWorldPosition(Ee);const l=Ee.z<-.6,d=l?0:Math.exp(-Math.max(Ee.z,0)/6.5)*z(-.6,1.5,Ee.z),p=l?oe.surfaceAt(Ee.x,Ee.z)-.03:-.78*d,h=s===0,u=p-Ee.y,c=u>0,i=h?c?1:0:z(-.02,.3,u),f=x.fog;Ge.uDusk.value=z(Fn[0],Fn[1],u),Ka.copy(Jt).lerp(er,Ge.uDusk.value),Ge.uCeil.value.copy(Ka).multiplyScalar(1.5),f.color.copy(ra).lerp(Ka,h?i:z(-.04,.07,u)),f.density=Q(Vn,zo,i),he.uSunCol.value.copy(Ta).lerp(oa,i),he.uSkyCol.value.copy(Cs).lerp(xn,i),Dt.sun.color.copy(Ts).lerp(Ds,i),Dt.hemi.color.copy(Ps).lerp(kn,i),qt&&(he.uSun.value.copy(No).lerp(Ss,i).normalize(),Dt.direction.copy(Uo).lerp(Mn,i).normalize()),x.background.copy(f.color),Kn.depthWrite=c,dt.uAbove.value=1-i;const m=!h&&Math.abs(u)<.08?.5:c?1:0;Ge.uSubm.value.set(l?0:m,l?m:0),oe.waterUniforms.uEye.value.set(!l&&c?1:0,l&&c?1:0),dt.uFogF.value=Q(1,h?.3:.78,i),Ia.uFogF.value=Q(1,h?.3:1,i),dt.uGainF.value=(h&&c?1.45:1)*(N?2:1),dt.uGainR.value=qt&&!h?1+.2*i:1,dt.uFarK.value=h?.15:1;for(const A of ca)A.visible=Ee.z>A.userData.zr[0]+(c?0:A.userData.airBack||0)&&Ee.z<A.userData.zr[1]&&!(s>A.userData.uMax);for(const A of Bt)A.visible=s>=A.userData.ur[0]&&s<=A.userData.ur[1];for(const A of Un){const R=A.userData.sight,G=Math.max(R[0]-Ee.z,Ee.z-R[1],0),$=l||A.userData.boiled&&!c?0:1-z(ua-Hn,ua,G);A.material.uniforms.uGrow.value=$,A.visible=$>0}ss.setFromProjectionMatrix(zr.copy(n.matrixWorld).invert().premultiply(n.projectionMatrix));for(const A of sn){const R=A.userData.box,G=Math.max(R[2]-Ee.z,Ee.z-R[3],0),$=l||!ss.intersectsBox(A.userData.bounds)?0:1-z(ua-Hn,ua,G);A.material.uniforms.uGrow.value=$,A.visible=$>0&&c,A.userData.air.visible=$>0&&!c}{const A=z(is[0],is[1],-u);for(const R of rs){const G=R.body.material.uniforms.uGrow,$=R.cards.material.uniforms.uGrow,O=G.value;G.value=O*(1-A),$.value=O*A,R.body.visible=G.value>0,R.cards.visible=$.value>0}}_t&&(_t.visible=Ee.z>14.5&&Ee.z<_t.userData.zMax+70,_t.userData.grow.value=z(14.5,19,Ee.z)),oe.object.visible=!(c&&Ee.z>150),Vt.object.visible=!c,Jo.visible=!c,gn.object.visible=!c,ks.object.visible=!c;for(const A of xs)A.object.visible=!c;for(const A of $r)A.visible=i>0;wo.visible=i>0&&!h,tn.uSurf.value=l?Ie:0,en&&(en.mesh.visible=i>0&&!l&&Ee.z>60),ro&&(ro.visible=i>0&&!l&&Ee.z>60),on&&(on.mesh.visible=i>0&&!l&&Ee.z>120),an&&(an.visible=Ee.z>Zn-16),ya&&(ya.mesh.visible=i<1&&Ee.z<110),$o&&($o.visible=Ee.z<125);const B=Ee.z>-.6;for(const A of cn)A.visible=B;no&&(no.mesh.visible=!c),Kt.visible=i>0,Yt.uSurfY.value=l?Ie:0,xe&&(xe.visible=i>0&&!l,xe.material.uniforms.uJet.value=z(lo-.004,lo+.004,s)*(1-z(L.tailUp-.03,L.tailUp,s))),Po.visible=i>.5&&!l&&s>.2&&s<L.missBreak+.01;const S=i>0&&!l;Ot.visible=S,Qn.mesh.visible=S&&Ee.z<100;const r=z(.295,.325,s)*(1-z(.372,.39,s));ns.rear2.value.y=.3+r*(.42+.08*Math.sin(t*1.6)),rn.mesh.visible=ln.mesh.visible=S&&r>.01,rn.U.uGo.value.x=r,ln.U.uGo.value.x=r*.8,Yn.set(1.08+.14*Math.sin(t*2.3),.13+.04*Math.sin(t*3.1)),io&&(io.visible=S);for(const A of $n){const R=(A.up||!l)&&Math.hypot(Ee.x-A.cx,Ee.z-A.cz)<A.rad+60;for(const G of A.meshes)G.visible=R;if(A.puffs&&(A.puffs.mesh.visible=R&&i>0&&A.up===l),R&&A.tm){const G=A.attr.array,$=A.home,O=A.dart;for(let ee=0;ee<A.n;ee++){const Ce=(t/(4.6+3*$[ee*4+3])+$[ee*4+3]*7)%1,Ve=.7*z(0,.045,Ce)*(1-z(.07,.4,Ce));G[ee*4]=$[ee*4]+O[ee*2]*Ve,G[ee*4+2]=$[ee*4+2]+O[ee*2+1]*Ve}A.attr.needsUpdate=!0}}const M=Ee.z<14.5&&Ee.z>-47?l?3.2:-7:_e(Ee.x,Ee.z);Yt.uLen.value=Ne(((l?Ie:0)-M)/-fo.y,2,24),As.uGain.value=(N?1.8:3.1)*(1-z(.035,.085,s)),xo.visible=i>0&&s<.085,Yt.uGain.value=Math.max((1+.75*z(13,3.5,Yt.uLen.value))*(h?2.3:1),N?1.5:2.1);const C=n.near??.2,v=l?Ie:0;wt.waterline.visible=!h&&!l&&Math.abs(u)<C*2.2,Vs.uSurfH.value=p,Vs.uNearD.value=C,Ko.visible=l&&Math.abs(u)<C*2.2,yn.uSurfH.value=p,yn.uNearD.value=C;for(const A of fr)A.value=v;wt.causticUniforms.uCausSurf.value=v;for(const A of _o)A.setOpacity(1-i);a.renderer.getDrawingBufferSize(qs);const k=n.projectionMatrix.elements[5]||1.66,w=Math.max(qs.y,1);xa&&(xa.uniforms.uPx.value=2/(k*w)),ba&&(ba.uniforms.uPx.value=2/(k*w)),tt&&(tt.splash.uniforms.uVH.value=w),bn.uVH.value=w;for(const A of On)A.uVH.value=w;tn.uVH.value=w,Lo.value=t,oe.update(e,t,n);const y=xt(s);oe.setStrikeClock(y-Ls),bn.uT.value=y-Ls,Qo(s,t),Cr(y-Zr,t);{const A=z(L.missBreak-.035,L.missBreak-.008,s)*(1-z(lo+.004,lo+.02,s)),R=z(L.leapBreak-.06,L.leapBreak-.025,s)*(1-z(L.apex+.004,L.apex+.02,s));R>0?oe.bearTurn.value.set(Ae,12,.62*R,.14*R):oe.bearTurn.value.set(J+2.4,17,.66*A,.1*A)}Do.uGo.value=y,Ge.uDuckT.value=y>fn?y:-1,Do.uSprayVH.value=w;const g=y-Xr,F=Ne((g+.3)/2.1,0,1),P=Ne((g-.9)/4.1,0,1),H=F*F*(3-2*F),K=P*P*(3-2*P);Qt.rotation.y=Q(hn,Tr,H)+Math.sin(t*.5)*.05*(1-H),Qt.position.set(Q(Ye[0],it[0],K),Q(qr,Vr,K),Q(Ye[1],it[1],K));let V=Math.atan2(Ee.x-Qt.position.x,Ee.z-Qt.position.z)-Qt.rotation.y;V-=Math.round(V/6.2832)*6.2832,Lr.set((K*Pr+H*1.9)/2.9,.36*Math.sqrt(4*P*(1-P))+.15*Math.sqrt(4*F*(1-F))*(1-4*P*(1-P)),Ne(V,-.62,.62)*(1-K)*(1-.5*H)+Math.sin(t*.9)*.04,.05+.05*Math.sin(t*.6)-.12*Math.sqrt(4*P*(1-P))),Qt.visible=B,Aa&&(Aa.visible=Qt.visible),un&&un.set(0,0,Math.sin(t*.31)*.4,.06+.06*Math.sin(t*.47));const T=z(lo+3e-4,lo+.0045,s),W=T*(1-z(lo+.005,lo+.0085,s));Go.visible=W>.002,Ms.uVeil.value.set(T,W),Vt.update(e,t,n),Dt.update(e,t,n),ha.update(e,t),gn.update(e,t,n),wt.update(e,t,n),Ro.update(e,t,n,s),Pt.updateWind(fs,t),wt.light.sunColor.copy(Bs).lerp(Or,i)},dispose(){Vt.dispose(),It.dispose(),oo.dispose(),Lt.dispose()}}}};export{Ui as default};
