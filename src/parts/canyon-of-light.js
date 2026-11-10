import*as o from"three";import{clamp as Te,lerp as I,smoothstep as p}from"../kit/core.js";const Fo=["#f7e3c0","#ff9d4d","#d95f2b","#8f2f1e","#4a1a2c","#1e0f1c","#6fd6ff"],kt=`
float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
float h31(vec3 p){ p = fract(p*0.3183099 + vec3(0.71,0.113,0.419)); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float vn3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(h31(i), h31(i+vec3(1,0,0)), f.x), mix(h31(i+vec3(0,1,0)), h31(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i+vec3(0,0,1)), h31(i+vec3(1,0,1)), f.x), mix(h31(i+vec3(0,1,1)), h31(i+vec3(1,1,1)), f.x), f.y), f.z); }
float fbm3(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++){ s += a*vn3(p); p = p*2.03 + 7.1; a *= 0.5; } return s/0.875; }
float n1(float y){ float i = floor(y), f = fract(y); f = f*f*(3.0-2.0*f); return mix(h11(i), h11(i+1.0), f); }
float vn2(vec2 x){ vec2 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
  float a = h11(i.x + i.y*57.0), b = h11(i.x+1.0 + i.y*57.0), c = h11(i.x + (i.y+1.0)*57.0), d = h11(i.x+1.0 + (i.y+1.0)*57.0);
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y); }
`,Eo=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 color;
attribute vec3 aShade;           // x ambient occlusion, y baked sun visibility, z sand amount
uniform float uBufH;              // height of the picture in pixels
varying vec3 vP, vN, vCol, vShade;
varying float vPix;               // the angle one pixel spans
#ifdef CANYON
attribute vec4 aSlot;            // x slot amount, y swept bedding coordinate, z slot-floor flag, w metres along the canyon
attribute vec3 aLd;              // where the slot's bounce light mostly comes from (unit direction times how one-sided it is)
attribute vec2 aFar;             // set at the build, by place: x 1 where no pool's warm glow can reach any point of the triangles this corner belongs to, y 1 where none of them lies in the hall's round (0 where the answer is yes or not known)
varying vec4 vSlot;
varying vec3 vLd;
varying vec2 vFar;
#endif
void main(){
  vP = position; vN = normal; vCol = color; vShade = aShade;
  vPix = 2.0/(max(projectionMatrix[1][1], 0.05)*max(uBufH, 16.0));
  #ifdef CANYON
  vSlot = aSlot; vLd = aLd; vFar = aFar;
  #endif
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Go=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSun, uSunCol, uSkyCol, uBounceCol, uCam, uPortalCol, uPortalPos;
uniform vec3 uCream, uOrange, uRed, uDeep, uPlum, uDark;
uniform float uPortalGlow, uStrataPhase, uBed, uTime, uShimmer;
uniform vec2 uWind;
varying vec3 vP, vN, vCol, vShade;
varying float vPix;
#ifdef CANYON
varying vec4 vSlot;
varying vec3 vLd;
varying vec2 vFar;               // (see aFar: exactly 0 all over every triangle that a glow, or the hall's round, can reach)
uniform vec4 uPools[6];          // beams standing in the slot: x, z of the foot, radius, y of the foot
uniform vec3 uBeamDir;
uniform vec4 uCourtC;            // the open court's sunbeam: x, y, z of the middle of its patch on the floor; w how bright the patch is on sand
uniform vec4 uCourtA;            // the patch's long axis (x, z, unit), its half length and half width
uniform vec3 uCourtD;            // the direction that light comes from
uniform vec4 uCourtS;            // the sapling's shadow on the court's patch: x, z of the crown's shadow, its radius, its strength
uniform vec3 uCourtT;            // x, z of the trunk's foot and the trunk shadow's strength
uniform vec3 uHeroF[8];          // the hero beam, the soft ray beside it, the smaller pillars and the thin blades: the foot of each shaft's axis on the sand
uniform vec4 uHeroE1[8];         // the long axis of the shaft's section (unit, square to the shaft) and its half length
uniform vec4 uHeroE2[8];         // the short axis and its half width
uniform vec2 uHeroK[8];          // how fast the spill of light round each pool dies out, and how strong it is
uniform vec3 uHeroA;             // the direction the shafts climb in (unit)
uniform vec3 uHallF[3];          // the hall's three shafts: the same four things as above for each
uniform vec4 uHallE1[3];
uniform vec4 uHallE2[3];
uniform vec2 uHallK[3];
uniform vec4 uHallC;             // the middle of the hall (world space) and the radius of its round, in plan: its pools are drawn inside it only
uniform vec4 uGlowP[12];         // every pool that throws a warm glow round itself, in one list (the eight places of the hero beam's kind: the hero beam, the pillars, the blades and, last, the first slot's lesser shaft; the hall's three; the court's patch): the pool's middle on the sand, and the square of the distance beyond which its glow is exactly nothing
uniform vec4 uGlowE[12];         // .. its long axis and half length
uniform float uGlowS[12];        // .. and how strong its glow is (by the pool's kind)
uniform vec4 uGlyphC;            // the blade of sun on the petroglyph wall: the middle of its patch, and its radius
uniform vec3 uGlyphL;            // the direction that light comes from (unit)
uniform sampler2D uGlyphTex;     // the petroglyphs: the marks' coverage in its alpha
uniform vec4 uGlyphU, uGlyphV;   // the panel's axes on the wall (unit: along the wall, up it) and its half length and half height
uniform vec3 uGlyphN;            // the way the panel's rock faces (unit)
uniform vec4 uHoo[3];            // the hoodoos on the plain: x, y of the foot, z, height
uniform vec3 uHooR[3];           // radius at the foot, 1 if it carries a cap
uniform float uMouthD;           // metres along the canyon at which the slot's mouth lies
uniform vec4 uAmp;               // the amphitheatre's floor: the phase of its wash, and the seed of its benches
#endif
uniform vec3 uGlowCol;
${kt}
// strata with crisp edges: a value that steps from one hashed level to the next, the step antialiased by e (half its
// width in periods; at e = 0.5 it is plain value noise, so far beds melt into soft bands instead of aliasing)
// Returns the value and its slope per unit of p: the slope goes straight into the bump, so a bed's edge is shaded per pixel
// (screen-space derivatives of a step this sharp come out in 2 x 2 pixel blocks).
vec2 bandS(float p, float e){
  float i = floor(p), f = fract(p), a = h11(i), b = h11(i + 1.0);
  float t = clamp((f - 0.5 + e)/(2.0*e), 0.0, 1.0);
  return vec2(mix(a, b, t*t*(3.0 - 2.0*t)), (b - a)*3.0*t*(1.0 - t)/e);
}
// a term of the relief or the colour with c cells to the pixel: whole while a cell spans four pixels or more, gone before it
// spans two. Every noise the bump differentiates is weighted by this, because screen-space derivatives of noise a pixel
// cannot resolve come out as a quilt of 2 x 2 pixel blocks (and the colour terms would sparkle).
float seen(float c){ return 1.0 - smoothstep(0.15, 0.42, c); }
// the height the bump is taken from by screen-space derivatives: rounded lumps drawn out along the beds, and grain.
// fp: how much of p one pixel covers. (The beds' own steps are not in here: their slopes are known exactly, see bandS.)
float rockH(vec3 p, float fp){
  float h = 0.0, a = 0.5, f = 0.55;
  vec3 q = p*0.55;
  for (int i = 0; i < 3; i++){ h += a*(vn3(q) - 0.5)*seen(fp*f); q = q*2.03 + 7.1; f *= 2.03; a *= 0.5; }
  return h*0.9/0.875;
}
// the grain: its slope is taken per pixel, from the pixel's own footprint on the rock (a screen-space derivative of anything
// this fine comes out as a quilt of 2 x 2 pixel blocks in the shaded hollows)
float rockG(vec3 p){ return (vn3(p*5.5) - 0.5)*0.08; }
#ifdef CANYON
// The lie of the amphitheatre's floor, in levels: lowest along the dry wash that runs from under the pour-off, rising away
// from it toward the cliffs and up the amphitheatre (a round-bottomed valley, never a plain V), bent by the ground's own swells
// at the scale of a terrace and of several. Its level lines are the edges of the slickrock benches, which step down toward the
// wash in curved terraces that close into lobes and bays.
float benchE(vec2 p, float o1){
  float wX = 16.0*sin(p.y*0.03 + o1)*(1.0 - smoothstep(150.0, 200.0, p.y));
  float dW = p.x - wX;
  return 0.045*sqrt(dW*dW + 400.0) + 0.02*(p.y - 40.0) + 4.0*(vn2(p*0.017 + 3.0) - 0.5) + 1.3*(vn2(p*0.043 + 29.0) - 0.5) + 0.5*(vn2(p*0.06 + 11.0) - 0.5);
}
// The beds inside one set of the slot's rock (sid: the set; sf: the place in it, 0 at its foot .. 1 at its top; wS1: sets under
// one pixel; dFl: what the bedding coordinate changes by across the pixel, along each of its axes; dxz: the pixel's two axes on
// the rock, in plan; lenPx: the longer of them in metres). Three to five thick beds to a
// set, of unequal thickness, lying at the set's own low angle and bending along the wall; most of them built of three thin
// ones. Returns the bed's tone (0 soft and red .. 1 hard and pale), how far the beds are resolved by this pixel, the metres of
// bedding from here to the middle of the bed, and the shade under the nose of a bed harder than the one beneath it and in
// the parting between two beds; and in
// crisp how far an edge is a crisp one here (1 while a bed spans many pixels, 0 before its edge is a soft ramp): x for the
// thick beds, y for the thin ones inside them (nothing where a thick bed has none).
vec4 setBeds(float sid, float sf, vec3 P, float ysv, float wS1, vec2 dFl, vec4 dxz, float lenPx, out vec2 crisp){
  float sm = mod(sid, 113.0);
  float hA = h11(sm*1.93 + 0.7), hB = h11(sm*3.11 + 5.3), hC = h11(sm*0.57 + 2.9), hD = h11(sm*2.37 + 8.1), hE = h11(sm*4.71 + 1.3);
  float nb = floor(mix(3.0, 5.99, hA));                        // thick beds in this set: 31 cm down to 19 cm apiece, before they swell and pinch
  float massive = step(hB, 0.1);                               // one set in ten: a massive bed of one tone, not split into beds
  float gam = mix(0.62, 1.0, smoothstep(0.35, 0.7, hC));      // beds that sweep down to lie along the set's foot, or plane ones
  float dip = 0.1*hE*sqrt(hE);                                  // how far they lean from the set (metres per metre), and which way
  vec2 dr = vec2(cos(hD*6.2832), sin(hD*6.2832));
  float sfc = clamp(sf, 0.03, 1.0), Gp = gam*pow(sfc, gam - 1.0);
  float ph = nb*(pow(sfc, gam) + dip*dot(P.xz, dr)/0.93) + 1.1*(vn3(vec3(P.x*0.16, ysv*0.8, P.z*0.16) + sm*3.7) - 0.5) + hB*7.0;
  // beds under one pixel: the bed phase's own change across it, signed along each axis (a wall seen along its length has a
  // long pixel, but its beds run with that length: only what the pixel crosses of them counts), and the slow wander's share
  float fbx = nb*(Gp*1.07*dFl.x + dip/0.93*dot(dxz.xy, dr)), fby = nb*(Gp*1.07*dFl.y + dip/0.93*dot(dxz.zw, dr));
  float fph = abs(fbx) + abs(fby) + 0.2*lenPx;
  // unequal thickness: the beds' own count is drawn out here and crowded there
  float a1 = hA*6.2832, a2 = hC*6.2832;
  float Jp = 1.0 + 0.46*cos(2.3*ph + a1) + 0.37*cos(5.3*ph + a2);
  float pq = ph + 0.2*sin(2.3*ph + a1) + 0.07*sin(5.3*ph + a2), fpq = fph*Jp;
  float bi = floor(pq), bfr = pq - bi, e = clamp(0.5*fpq, 0.01, 0.5);
  float tt = clamp((bfr - 0.5 + e)/(2.0*e), 0.0, 1.0); tt = tt*tt*(3.0 - 2.0*tt);
  float bm = mod(bi, 97.0), sd1 = sm*17.3;
  float t0 = h11(bm*7.31 + sd1), t1 = h11((bm + 1.0)*7.31 + sd1);
  // (a bed's tone is drawn while its edge is a small part of it; before the edge is a ramp as wide as the bed, the bed is gone)
  float kIn = (1.0 - smoothstep(0.2, 0.4, fpq))*(1.0 - massive), kSet = (1.0 - smoothstep(0.2, 0.4, wS1))*massive;
  // the thin beds, three to a thick one (their edges fall on the thick ones' edges); some thick beds have none
  float q3 = 3.0*pq - 1.0, b3 = floor(q3), f3 = q3 - b3, e3 = clamp(1.0*fpq, 0.01, 0.5);
  float t3 = clamp((f3 - 0.5 + e3)/(2.0*e3), 0.0, 1.0); t3 = t3*t3*(3.0 - 2.0*t3);
  float m3 = mod(b3, 89.0);
  float th0 = smoothstep(0.2, 0.8, h11(m3*3.97 + sd1 + 5.0)), th1 = smoothstep(0.2, 0.8, h11((m3 + 1.0)*3.97 + sd1 + 5.0));   // (a hard pale bed or a soft red one, seldom between)
  float thin = mix(th0, th1, t3);
  float lam = mix(step(0.28, h11(bm*2.13 + sd1 + 3.0)), step(0.28, h11((bm + 1.0)*2.13 + sd1 + 3.0)), tt);
  float k3 = lam*(1.0 - smoothstep(0.3, 0.6, 3.0*fpq));       // (the thin beds are drawn while one is two pixels thick, then melt into the thick bed's tone)
  crisp = vec2(1.0 - smoothstep(0.14, 0.3, fpq), lam*(1.0 - smoothstep(0.2, 0.42, 3.0*fpq)))*(1.0 - massive);   // (a massive bed keeps the even partings and laminae: it is never barer than the rock was)
  float tone = smoothstep(0.06, 0.94, mix(t0, t1, tt));
  tone = 0.5 + (tone - 0.5)*mix(1.0, 0.5, k3) + (thin - 0.5)*k3;
  tone = mix(tone, 0.2 + 0.6*hE, massive);
  float dq = mix((tt - bfr)/max(Jp*nb*Gp*1.07, 0.5), (0.5 - sf)/1.07, massive);
  // (the shade: some centimetres deep, soft below, never a line; gone before it is thinner than a pixel)
  float wsh = 0.03*nb*Gp*1.07*Jp, Dsh = min(3.0*wsh, 0.5);
  float sh = (1.0 - tt)*(1.0 - smoothstep(0.0, max(Dsh, 1e-3), 0.5 - bfr))*clamp((t1 - t0 - 0.12)*2.4, 0.0, 1.0)*clamp(Dsh/max(2.4*fpq, 1e-3), 0.0, 1.0)*kIn;
  float w3 = 0.016*3.0*nb*Gp*1.07*Jp, D3 = min(3.0*w3, 0.5);  // .. and the same under a thin hard bed, in little
  float sh3 = (1.0 - t3)*(1.0 - smoothstep(0.0, max(D3, 1e-3), 0.5 - f3))*clamp((th1 - th0 - 0.15)*2.2, 0.0, 1.0)*clamp(D3/max(7.2*fpq, 1e-3), 0.0, 1.0)*k3*kIn;
  // the parting between two beds: a thin dark seam where the softer rock has weathered back, a centimetre or two of it and
  // never under a pixel and a half, crisp on both sides; some seams strong, some faint. (Shade in a recess, never a line of light.)
  float bpm = nb*Gp*1.07*Jp;                                   // beds to the metre here
  float pwk = max(0.014*bpm, 0.7*fpq);
  float part = (1.0 - smoothstep(pwk - e, pwk + e, abs(bfr - 0.5)))*mix(0.4, 1.0, h11(bm*5.13 + sd1 + 9.0))*crisp.x;
  float e3p = clamp(1.5*fpq, 0.01, 0.5), pw3 = max(0.024*bpm, 2.1*fpq);   // .. and a fainter one between the thin beds
  float part3 = (1.0 - smoothstep(pw3 - e3p, pw3 + e3p, abs(f3 - 0.5)))*mix(0.2, 0.8, h11(m3*2.71 + sd1 + 13.0))*crisp.y;
  return vec4(tone, kIn + kSet, dq, max(max(sh, 0.8*sh3), max(part, part3)));
}
#endif
#ifdef CANYON
// The warm light a pool of sun throws back on the rock and the sand round it: by the pool's place alone (d: from the pool's
// middle on the sand to this point; e1: the pool's long axis and half length), falling off with the distance from the pool
// (taken to the nearest point of its long middle line) and gone at some three times its reach, strongest on faces that look
// at the pool. Added light and nothing else.
float poolGlow(vec3 d, vec4 e1, vec3 n, float sandK){
  float hl = min(e1.w, 3.2), R = 2.2 + 1.2*hl;
  vec3 tp = e1.xyz*clamp(dot(d, e1.xyz), -0.8*e1.w, 0.8*e1.w) + vec3(0.0, 0.4, 0.0) - d;
  float r2 = dot(tp, tp);
  if (r2 > 10.24*R*R) return 0.0;
  float r = sqrt(r2), fc = clamp(dot(n, tp/max(r, 1e-3))*1.3 + 0.2, 0.0, 1.0);
  return mix(fc, 0.55, sandK)/(1.0 + r2/(R*R))*(1.0 - smoothstep(1.8*R, 3.2*R, r));
}
#endif
void main(){
  vec3 N = normalize(vN);
  vec3 toCam = uCam - vP;
  float dist = length(toCam);
  vec3 rd = -toCam/max(dist, 1e-3);
  // The ripK of rock under this pixel, worked out from the smooth normal and the camera. Every fade below is driven by it
  // and not by fwidth(): screen-space derivatives are constant over 2 x 2 pixels, and where the rock turns away from the eye
  // (the lip of a wall against the sky) they jump from one block to the next and turn every threshold into a plaid.
  // (the rock is drawn unrotated: object space and world space share their axes)
  vec3 camR = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), camU = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float nr = dot(N, rd); nr = (nr < 0.0 ? -1.0 : 1.0)*max(abs(nr), 0.04);
  vec3 dPx = dist*vPix*(camR - rd*(dot(N, camR)/nr)), dPy = dist*vPix*(camU - rd*(dot(N, camU)/nr));
  float fw = length(dPx) + length(dPy);                    // metres of rock under one pixel
  float sl = 0.0, flr = 0.0, hiW = 0.0;
  #ifdef CANYON
  hiW = clamp(-vSlot.z, 0.0, 1.0);                         // high on the slot's walls, where the mesh's rows stand metres apart
  // (what the vertices carry is held in its range: with multisampling on, a pixel on the edge of a sliver of rock seen edge-on
  // reads it extrapolated far outside, and one such pixel "ten times in the sun" blooms into a small bright square)
  sl = clamp(vSlot.x, 0.0, 1.0); flr = clamp(vSlot.z, 0.0, 1.0);
  float sideW = step(2048.0, vSlot.w), dAl = vSlot.w - 4096.0*sideW;   // which of the slot's two walls this is, and the metres along the canyon
  float mwS = sl*smoothstep(uMouthD - 62.0, uMouthD - 34.0, dAl);   // the walls that frame the mouth (all that are in the picture as the mouth is)
  #else
  float mwS = 0.0;
  #endif
  float fine = 1.0 - smoothstep(22.0, mix(220.0, 120.0, sl), dist);   // (fine beds carry further on the open cliffs)
  float sandy = clamp(vShade.z, 0.0, 1.0);
  // open, level ground is either drifted sand or bare slickrock, with an edge between them that wanders at its own scale
  // (not a soft blend that follows the mesh)
  {
    float lvl = smoothstep(0.78, 0.95, N.y)*(1.0 - sl);
    float sEdge = sandy + 0.3*(vn3(vP*0.33 + 5.0) - 0.5) + 0.12*(vn3(vP*1.4) - 0.5)*seen(fw*1.4);
    float sw_ = clamp(0.12 + fw*0.6, 0.12, 0.5);
    sandy = mix(sandy, smoothstep(0.5 - sw_, 0.5 + sw_, sEdge), lvl);
  }
  // The amphitheatre's floor is slickrock and sand, not one sheet. Benches of banded slickrock step down toward the wash in
  // curved terraces (each bench its own bed of red, orange or cream, the beds' outcrop drawn along its level lines; a riser
  // of thin beds at each step, lit where it looks to the sun and in short hard shade where it looks away, with shade at its
  // foot); sand lies in the wash, against the cliffs' feet, in a drift below each step and in tongues laid down the wind
  // across the benches, the broader tongues in dunes with a long lit back and a short shaded slip face; the wash keeps cut
  // banks and cobbles; patches of the pavement are dark with varnish. All of it is placed by the lie of the ground (world
  // metres), the same from everywhere; each part is drawn while the pixel resolves it.
  float amph = 0.0, amRock = 0.0, amShade = 1.0, amSlip = 0.0, desF = 0.0;
  vec3 amCol = vec3(0.0), amG = vec3(0.0);
  #ifdef CANYON
  amph = (1.0 - sl)*step(vSlot.w, -500.0)*step(-1500.0, vSlot.w)*smoothstep(0.62, 0.86, N.y);
  desF = (1.0 - sl)*step(vSlot.w, -1500.0);
  if (amph > 0.001) {
    vec2 p = vP.xz;
    float o1 = uAmp.x;
    float E0 = benchE(p, o1);
    vec2 gE = vec2(benchE(p + vec2(0.8, 0.0), o1) - E0, benchE(p + vec2(0.0, 0.8), o1) - E0)/0.8;
    float gl = max(length(gE), 0.01);
    float Jq = 1.0 + 0.44*cos(2.2*E0 + 1.0), Eq = E0 + 0.2*sin(2.2*E0 + 1.0);   // benches of unequal width
    float fE = (abs(dot(gE, dPx.xz)) + abs(dot(gE, dPy.xz)))*Jq;          // levels under one pixel
    float bi = floor(Eq + 0.5), fr = Eq - bi;                             // the step nearest, and how far above (+) or below (-) it this is, in levels
    float bm = mod(bi, 53.0), bl = mod(bi - 1.0, 53.0);
    float eE = clamp(0.7*fE, 0.004, 0.5);
    float stp = smoothstep(-eE, eE, fr);                                   // 0 on the bench below the step, 1 on the bench above
    float tone = mix(h11(bl*3.1 + 2.0 + uAmp.y), h11(bm*3.1 + 2.0 + uAmp.y), stp);
    float hr = h11(bm*5.7 + 9.0 + uAmp.y);                                 // how high this step is (some are hardly a ramp)
    float rw = clamp(2.2*gl*Jq, 0.03, 0.34)*mix(0.5, 1.3, hr);            // the riser's width in plan, in levels
    float ris = stp*(1.0 - smoothstep(rw - eE, rw + eE, fr))*clamp(rw/max(1.3*fE, 1e-4) - 0.35, 0.0, 1.0);
    float tR = clamp(fr/max(rw, 1e-3), 0.0, 1.0);
    vec2 sunH = normalize(uSun.xz + vec2(1e-4, 0.0));
    float face = dot(-gE/gl, sunH);                                        // the riser looks toward the sun (+) or away from it (-)
    float rbed = bandS(tR*3.0 + bm*7.0, clamp(2.1*fE/max(rw, 1e-3), 0.04, 0.5)).x;
    vec3 risCol = mix(mix(uRed*0.8, uDeep, 0.45), mix(uOrange, uCream, 0.5)*0.9, rbed)*mix(0.46, 1.08, smoothstep(-0.4, 0.4, face))*(1.0 - 0.5*(1.0 - smoothstep(0.0, 0.3, tR)));
    // (the shade a riser that looks away from the sun lays on the bench below it)
    float swE = 1.1*gl*Jq*mix(0.5, 1.3, hr);
    float shCast = (1.0 - stp)*(1.0 - smoothstep(0.0, max(swE, 1e-3), -fr))*(1.0 - smoothstep(-0.4, 0.1, face))*clamp(swE/max(1.3*fE, 1e-4) - 0.3, 0.0, 1.0);
    vec3 bcol = mix(mix(mix(uRed*0.62, uDeep, 0.35), uOrange*0.6, 0.35), uOrange*0.7, smoothstep(0.34, 0.6, tone));
    bcol = mix(bcol, mix(uOrange, uCream, 0.5)*0.74, smoothstep(0.72, 0.94, tone));
    float cb = bandS(E0*4.3 + 3.0, clamp(3.4*fE/Jq, 0.03, 0.5)).x;         // the beds' outcrop along the level
    bcol *= mix(1.0, 0.64 + 0.72*cb, 1.0 - smoothstep(0.3, 0.7, 4.3*fE/Jq));
    float pv = smoothstep(0.6, 0.68, vn2(p*0.03 + 71.0) + 0.25*(vn2(p*0.21 + 5.0) - 0.5)*seen(fw*0.21));
    // (the benches are light ground on every visit: no bed lies darker than a set share of the sand's own light, whatever the rock's red)
    bcol *= max(1.0, 0.72*dot(uCream, vec3(0.3, 0.59, 0.11))/max(dot(bcol, vec3(0.3, 0.59, 0.11)), 1e-3));
    // (.. and a bench is weathered pavement, never one flat sheet of a colour: held up to that light, its beds still outcrop
    // along its level lines, the harder ones as paler, creamier lines and the rock between them redder at the bench's own
    // light, and the wind scours it paler in broad patches; drawn while a pixel resolves a bed, none of it under the floor above)
    { float cbK = 1.0 - smoothstep(0.3, 0.7, 4.3*fE/Jq), bY = dot(bcol, vec3(0.3, 0.59, 0.11));
      vec3 bHot = mix(uOrange, uCream, 0.6), bRed = mix(uRed, uOrange, 0.3);
      bcol = mix(bcol, bRed*(bY/max(dot(bRed, vec3(0.3, 0.59, 0.11)), 1e-3)), 0.4*(1.0 - cb)*cbK);
      bcol = mix(bcol, bHot*(1.24*bY/max(dot(bHot, vec3(0.3, 0.59, 0.11)), 1e-3)), 0.6*cb*cbK);
      bcol *= 1.0 + 0.14*smoothstep(0.4, 0.75, vn2(p*0.085 + 53.0)); }
    bcol = mix(bcol, uPlum*0.55 + uDeep*0.35, 0.62*pv*(0.75 + 0.5*mix(0.5, vn2(p*1.9), seen(fw*1.9))));
    // (.. and a riser in shade stays a line of warm shade, never a black one)
    risCol *= max(1.0, 0.5*dot(uCream, vec3(0.3, 0.59, 0.11))/max(dot(risCol, vec3(0.3, 0.59, 0.11)), 1e-3));
    amCol = mix(bcol, risCol, ris);
    amShade = 1.0 - 0.45*shCast;
    // where the sand lies
    float wX = 16.0*sin(p.y*0.03 + o1)*(1.0 - smoothstep(150.0, 200.0, p.y)), wd = (p.x - wX)/(8.0*(0.65 + 0.7*vn2(vec2(p.y*0.031, 7.0)))), wk = smoothstep(46.0, 92.0, p.y);   // (the bed narrows and widens down its length)
    float inW = exp(-wd*wd*0.7)*wk;
    float sdR = min(length(vec2(p.x, p.y - 85.0)) - 118.0, max(abs(p.x) - 124.0, p.y - 85.0));   // metres inside the cliffs (negative on the floor)
    float dwv = vn2(p*0.045 + 23.0), dw = 0.08 + 0.5*dwv*dwv;             // how far the drift lies out from the foot of a step, in levels
    float drift = (1.0 - stp)*(1.0 - smoothstep(0.4*dw, dw, -fr));
    vec2 wdir = -sunH;                                                     // (the wind comes from under the sun: the slip faces look away from it)
    float tng = vn2(vec2(dot(p, wdir)*0.013, dot(p, vec2(-wdir.y, wdir.x))*0.045) + 31.0);
    float sF = 0.7*(clamp(vShade.z, 0.0, 1.0) - 0.62) + 1.2*inW + 0.9*smoothstep(-26.0, -5.0, sdR) + 0.7*drift + 1.2*(tng - 0.5)
      + 0.25*(vn2(p*0.37 + 3.0) - 0.5)*seen(fw*0.37) + 1.5*exp(-(p.x*p.x + (p.y - 192.0)*(p.y - 192.0))/200.0)
      + 0.5*(vn2(p*0.12 + 19.0) - 0.5)                         // (.. in lobes a few metres across: where sand meets a bench the line wanders, it is never ruled)
      + 0.45*(vn2(vec2(dot(p, wdir)*0.07, dot(p, vec2(-wdir.y, wdir.x))*1.3) + 61.0) - 0.5)*seen(fw*1.3);   // (.. and in streaks laid down the wind: a bench's edge under sand is feathered, not cut)
    float sw2 = clamp(0.03 + fw*0.25, 0.03, 0.3);
    float sandA = smoothstep(0.3 - sw2, 0.3 + sw2, sF);
    sandy = mix(sandy, sandA, amph);
    amRock = amph*(1.0 - sandA);
    // dunes on the broader tongues: a long back up the wind, a short slip face down it
    float pd = dot(p, wdir)/10.0 + 3.2*vn2(p*0.028 + 5.0) + 0.9*vn2(p*0.09 + 15.0);   // (crests that bend: none runs straight)
    float fP = (abs(dot(wdir, dPx.xz)) + abs(dot(wdir, dPy.xz)))/10.0 + 0.12*fw;
    float sdn = fract(pd), ed = clamp(fP, 0.03, 0.3);
    float slip = smoothstep(0.74 - ed, 0.74 + ed, sdn)*(1.0 - smoothstep(1.0 - ed, 1.0, sdn));
    float dz = smoothstep(0.56, 0.74, tng)*sandA*(1.0 - inW)*(1.0 - smoothstep(0.25, 0.6, fP))*amph;
    // (each crest runs some tens of metres and dies out into flat sand)
    dz *= smoothstep(0.35, 0.6, vn2(vec2(floor(pd)*7.3, dot(p, vec2(-wdir.y, wdir.x))*0.05)));
    amG = vec3(wdir.x, 0.0, wdir.y)*mix(0.13, -0.3, slip)*dz;
    amSlip = slip*dz;
    // the wash: cut banks, cobbles in its bed
    // (a bank is a face a metre or two high that looks across the wash: the one that looks away from the sun is in shade, the other lit)
    float bkw = 0.14 + 0.1*vn2(p*0.09 + 13.0);
    // (each bank wanders on its own and is cut only here and there: never two lines running side by side)
    float bank = (1.0 - smoothstep(0.5*bkw, bkw, abs(abs(wd) - 1.25 - 1.0*(vn2(p*0.05 + 27.0) - 0.5))))*wk*clamp(bkw*8.0/max(1.5*fw, 1e-3) - 0.3, 0.0, 1.0)*smoothstep(0.34, 0.56, vn2(p*0.041 + 47.0));
    float bface = -sign(wd)*sunH.x;
    float cob = (1.0 - smoothstep(0.16, 0.27, vn2(p*1.5 + 9.0)))*exp(-wd*wd*1.6)*wk*seen(fw*1.5);
    amShade *= (1.0 - bank*mix(0.5, -0.08, smoothstep(-0.3, 0.3, bface)))*(1.0 - 0.42*cob);
  }
  #endif
  // warped height coordinate: bedding with a little cross-bed tilt
  // (where the slot's rock flares out toward level, the short waves of the warp are held down: on a low slope a bed's outcrop
  // wanders a metre for every half metre of warp, and the beds would smear into wavy contour lines)
  float lvl2 = smoothstep(0.3, 0.8, abs(N.y));
  float wob = (vn3(vP*0.028 + 3.7) - 0.5)*5.0 + (vn3(vP*0.11) - 0.5)*1.1*(1.0 - 0.75*lvl2*sl)*(1.0 - 0.7*hiW);   // (.. and high on the slot's walls, where the wander would kink at every facet)
  float ys = vP.y + wob + 0.05*vP.x + uStrataPhase;
  // The slot's scoops: shallow bowls that water has plucked out of the face, here and there, in patches: each its own size
  // (one to three metres long, longer along the canyon than tall), many places with none, smooth rock between. A field of
  // the rock itself, in metres, the same from every distance. A scoop is shown by its dish alone: the beds' outcrop lines
  // bow as they cross it (below), its slope goes into the normal wherever a pixel resolves it, its roof keeps a little shade. Where two
  // bowls cut into each other the slope turns over; nothing is drawn along that edge.
  float bowlD = 0.0;                                       // metres the face lies back in a bowl
  vec3 bowlG = vec3(0.0);                                  // .. and the slope of the face there (world space)
  #ifdef CANYON
  {
    float zone = sl*(1.0 - flr)*(1.0 - sandy)*smoothstep(0.38, 0.62, vn3(vP*0.085 + 41.0));   // scooped stretches of wall (two fifths of it or so), and smooth ones between
    if (zone > 0.0) {
      vec3 SC = vec3(0.36, 0.6, 0.36);
      // (the rock's own slow fields bend the bowls' places, so no two neighbours stand in a row)
      vec3 pw = vP + 1.5*vec3(vn3(vP*0.2 + 61.0) - 0.5, 0.6*(vn3(vP*0.17 + 83.0) - 0.5), vn3(vP*0.19 + 107.0) - 0.5);
      vec3 qs = pw*SC + vec3(3.3, 0.0, 7.1);
      vec3 ci = floor(qs - 0.5), cf = qs - ci;
      for (int ia = 0; ia < 2; ia++) for (int ib = 0; ib < 2; ib++) for (int ic = 0; ic < 2; ic++) {
        vec3 o = vec3(float(ia), float(ib), float(ic));
        float hc = h31(ci + o);
        vec3 r = o + 0.5 + 0.7*(fract(hc*vec3(1.0, 61.7, 127.3)) - 0.5) - cf;
        float sz = fract(hc*337.1);
        // (four places in ten hold no bowl; the others a bowl of their own radius, as deep as it is wide)
        float Ri = mix(0.26, 0.63, fract(sz*7.3))*step(0.4, sz);
        // (a bowl with a soft lip: its slope is nothing at its middle and at its edge, steepest between)
        float ti = max(1.0 - dot(r, r)/max(Ri*Ri, 1e-3), 0.0);
        float di = 0.62*Ri*zone*ti*ti;
        if (di > bowlD) { bowlD = di; bowlG = (-2.48*zone*ti/max(Ri, 1e-3))*r*SC; }
      }
    }
  }
  // in the slot the beds follow the water-carved flutes (the swept coordinate the geometry was cut with), and dip a little
  // into the rock: where a bowl cuts the face back their outcrop lines bow round it
  ys = mix(ys, vSlot.y + wob*0.8 + uStrataPhase, sl) + bowlD;
  #endif
  // metres of bedding under one pixel: the level part exactly, the warp (and the slot's sweep) as its typical slope
  // (in the slot the beds dip along the canyon with the sweep: a wall seen at a slant covers more bedding per pixel than its height alone says)
  float fy = abs(dPx.y + 0.05*dPx.x) + abs(dPy.y + 0.05*dPy.x) + (0.03 + 0.02*sl)*fw + 0.07*sl*(length(dPx.xz) + length(dPy.xz)) + abs(dot(bowlG, dPx)) + abs(dot(bowlG, dPy));
  float lam = 1.0 - 0.6*sl;                                // hairline laminae: fewer on the slot's water-smoothed walls
  // flowing strata: massive beds (outside the slot), beds, partings and laminae, each with a crisp edge. In the slot they
  // run with the flutes. (a little short-wave wander where the rock flares out toward level, so beds crossing a low wall
  // foot or a boulder's shoulder curl like water-cut stone instead of following the mesh's facets)
  float wand = 0.06*(1.0 - 0.8*lvl2)*seen(fw*0.9);
  // (out in the open the beds lie level, as laid down: crisp ledges and bands. Only the slot's water-cut walls swirl)
  float flow = ys + mix(0.12, 1.0, sl)*(1.0 - 0.7*hiW)*((0.6 - 0.52*lvl2)*(vn3(vec3(vP.x*0.21, ys*0.45, vP.z*0.21) + 17.0) - 0.5) + wand*(vn3(vec3(vP.x*0.9, ys*0.6, vP.z*0.9)) - 0.5));
  float ff = fy + 0.15*wand*fw;
  float p0 = flow*0.31 + 7.0, p1 = flow*1.07 + 3.0, p2 = flow*3.6 + 11.0, p3 = flow*11.5 + 5.0;
  float w0 = ff*0.31, w1 = ff*1.07, w2 = ff*3.6, w3 = ff*11.5;
  // The slot's rock at the rock's own scale. Each bed of about a metre drawn below (a set) is itself built of beds a hand to
  // a forearm thick, each of ONE tone with a crisp edge: harder pale ones, softer red ones, of unequal thickness. In most
  // sets they lie at a low angle to the set and are cut off by the next one (a bed thins to nothing against the set's foot
  // or its top); they swell and pinch along the wall and change tone along their length; now and then a set is one massive
  // bed of one tone. Between two beds runs a thin dark parting; a harder bed stands a little proud of a softer one beneath
  // it, which keeps a soft shade under its nose. This is a level of the rock's own field, drawn by the pixel's footprint on
  // the rock: whole while a bed's edge is crisp (a small part of the bed), and given back to the even partings and laminae
  // before that edge would be a soft ramp, level by level (so no wall is softer or barer for it, and nothing can shimmer).
  float bedK = 0.0, bedT = 0.5, bedSh = 0.0, ysB = ys, bedX = 0.0, bedL = 0.0;   // (bedX: where the thick beds stand in for the even partings; bedL: where the thin ones stand in for the laminae)
  #ifdef CANYON
  // (the bedding coordinate is smooth: what one pixel covers of it is read off it directly, taken outside every branch)
  vec2 dFl = vec2(dFdx(flow), dFdy(flow));
  float gFl = length(dFl);
  {
    float rk0 = sl*(1.0 - flr)*(1.0 - sandy)*(1.0 - hiW);
    if (rk0 > 0.001) {
      float sid = floor(p1 + 0.5), sf = p1 + 0.5 - sid;         // the set, and the place in it from its foot (0) to its top (1)
      float wS1 = gFl*1.07, lenPx = max(length(dPx), length(dPy)), up = step(0.5, sf);
      vec4 dxz = vec4(dPx.xz, dPy.xz);
      vec2 c0 = vec2(0.0), c1 = vec2(0.0);
      vec4 b0 = setBeds(sid, sf, vP, ys, wS1, dFl, dxz, lenPx, c0);
      // (at a set's edge the next set's own first bed is read too: the edge is a step from one bed to another, never a break in the field)
      vec4 b1 = setBeds(sid + 2.0*up - 1.0, 1.0 - up, vP, ys, wS1, dFl, dxz, lenPx, c1);
      float own = 0.5 + 0.5*smoothstep(0.0, clamp(wS1, 0.008, 0.25), min(sf, 1.0 - sf));
      bedK = rk0*mix(b1.y, b0.y, own);
      // (the even lines are handed over to the beds level by level, and only where that bed's own edge is still crisp: the
      // partings to the thick beds, the laminae to the thin ones. A wall is never softer, and never barer, for its beds)
      bedX = rk0*mix(b1.y*c1.x, b0.y*c0.x, own);
      bedL = rk0*mix(b1.y*c1.y, b0.y*c0.y, own);
      bedT = mix(b1.x, b0.x, own);
      // the broad bands are read at the middle of the bed: each bed takes ONE tone from them, and steps to the next at its edge
      ysB = ys + clamp(b0.z, -0.45, 0.45)*rk0*b0.y*(2.0*own - 1.0);
      bedSh = b0.w*rk0*(2.0*own - 1.0);
      // (.. and the parting between two sets, as between two beds: a thin dark seam, crisp, where the beds are)
      float eS = clamp(0.5*wS1, 0.004, 0.25), pS = max(0.017, 0.7*wS1);
      bedSh = max(bedSh, (1.0 - smoothstep(pS - eS, pS + eS, min(sf, 1.0 - sf)))*mix(0.5, 1.0, h11(mod(sid + up, 61.0)*3.7 + 1.1))*bedX);
    }
  }
  #endif
  // (a set of lines fades out before its period nears two pixels: no moire on walls seen at a slant or from afar)
  float k0 = (1.0 - smoothstep(0.3, 0.75, w0))*(1.0 - sl), k1 = 1.0 - smoothstep(0.3, 0.75, w1), k2 = (1.0 - smoothstep(0.32, 0.78, w2))*(1.0 - bedX), k3 = (1.0 - smoothstep(mix(0.18, 0.12, mwS), mix(0.5, 0.36, mwS), w3))*(1.0 - bedL);   // (where the set's own beds are drawn crisp, the even partings and laminae that stood in for them are not)   // (round the mouth the finest set goes sooner on grazing faces: no dotted line along a ledge)
  vec2 s0 = bandS(p0, clamp(w0*0.8, 0.02, 0.5)), s1 = bandS(p1, clamp(w1*0.8, 0.035, 0.5)), s2 = bandS(p2, clamp(w2*0.8, 0.05, 0.5)), s3 = bandS(p3, clamp(w3*0.8, 0.08, 0.5));
  float st0 = mix(0.5, s0.x, k0), st1 = mix(0.5, s1.x, k1), st2 = mix(0.5, s2.x, k2), st3 = mix(0.5, s3.x, k3);
  float strata = mix(st0*0.34 + st1*0.3 + st2*0.24 + st3*0.12, st1*0.42 + st2*0.38 + st3*0.2, sl);
  // the relief of those beds, as a slope along the flow coordinate (metres of height per metre). The slope is exact and per
  // pixel, so a bed is embossed for as long as it is drawn: that is what makes a thin lamina read as a hairline
  float dStrata = 0.5*k0*s0.y*0.31 + 0.32*k1*s1.y*1.07*(1.0 - bedX) + 0.2*k2*s2.y*3.6 + 0.06*k3*s3.y*11.5;   // (where the beds are drawn crisp, a set's edge is a step of tone with a dark seam, not an embossed line)
  float ledgeSh = 1.0;
  {                                                        // bedding ledges of the open cliffs and the Arch: a rounded step at the foot and the top of each bed
    float fb = fract(ys/uBed), wb = fy/uBed, eb = max(0.12, 1.3*wb);
    float ta = clamp(fb/eb, 0.0, 1.0), tb = clamp((fb - 0.5)/eb, 0.0, 1.0);
    dStrata += 0.7*(1.0 - sl)*(6.0*ta*(1.0 - ta) - 6.0*tb*(1.0 - tb))/(eb*uBed)*(1.0 - smoothstep(0.34, 0.6, wb));   // (drawn until a bed is two pixels thick: the far cliffs keep their ledges)
    // the thin line of shade under each ledge, as colour (no screen-space derivative): what makes a far cliff read as stepped
    float lw = max(wb, 0.004);
    ledgeSh = 1.0 - 0.3*(1.0 - sl)*smoothstep(0.0, lw, fb)*(1.0 - smoothstep(0.03 + lw, 0.09 + 2.0*lw, fb))*(1.0 - smoothstep(0.26, 0.5, wb));
    float fh = fract(ys/uBed + 0.5);                       // and a fainter one at the half-bed parting
    ledgeSh *= 1.0 - 0.16*(1.0 - sl)*smoothstep(0.0, lw, fh)*(1.0 - smoothstep(0.02 + lw, 0.06 + 2.0*lw, fh))*(1.0 - smoothstep(0.2, 0.4, wb));
  }
  // ---- albedo
  // (each band of colour melts into its own average before it is thinner than a couple of pixels: far mesas keep the
  // broad banding and lose the fine beds, instead of showing them as a grid)
  float bA = n1(ysB*0.21 + 1.3), bB = n1(ysB*mix(0.83, 0.55, sl) + 9.1), bC = n1(ys*2.9), bD = n1(ysB*mix(0.47, 0.4, sl) + 21.0);
  float bE = mix(0.5, n1(ysB*1.25 + 4.0), seen(fy*1.25));   // the slot's own bands, 0.4-1.5 m, soft-edged
  float kB = seen(fy*0.83*mix(0.45, 0.6, sl)), kD = seen(fy*0.47*mix(0.45, 0.6, sl)), kC = seen(fy*2.9);
  float fineA = fine*kC*(1.0 - bedX);
  vec3 alb = mix(uRed, uOrange, smoothstep(0.15, 0.85, bA));
  alb = mix(alb, uDeep, mix(0.25, smoothstep(mix(mix(0.62, 0.5, sl), 0.64, mwS), mix(0.9, 0.76, mwS), bD), kD)*mix(0.75, 0.62, sl));   // (round the mouth a dark bed has an edge: a band, never a smudge)
  alb = mix(alb, uCream, mix(0.22, smoothstep(mix(0.66, 0.56, sl), mix(0.92, 0.96, sl), bB), kB)*mix(0.6, 0.36, sl));
  alb *= 0.86 + 0.28*bC*fineA*lam + 0.14*(1.0 - fineA*lam);
  // grain and hairline laminae, as colour: drawn per pixel with no screen-space derivative, so there is nothing to quilt
  alb *= 1.0 + fine*(0.12*(vn3(vP*6.3) - 0.5)*seen(fw*6.3*0.5) + 0.16*(n1(ys*23.0 + 2.0) - 0.5)*seen(fy*23.0*0.8)*(1.0 - sandy)*(1.0 - bedL));
  alb *= mix(1.0, 0.9 + 0.2*bE, sl)*mix(0.6 + 0.8*strata, 0.64 + 0.72*strata, sl);
  alb = mix(alb, uCream*0.9, smoothstep(0.8, 0.95, st1)*0.22);       // now and then a pale bed
  alb = mix(alb, mix(mix(uDeep, uRed, 0.45), uDeep, sl), (1.0 - smoothstep(0.06, 0.2, st1))*mix(0.44, 0.5, sl));     // and a dark iron-rich one
  alb = mix(alb, mix(uDeep, uRed, 0.4), (1.0 - smoothstep(0.1, 0.3, st0))*0.42); // (out of the slot) a massive dark bed, a massive pale one
  alb = mix(alb, mix(uOrange, uCream, 0.6), smoothstep(0.75, 0.95, st0)*0.24);
  alb *= ledgeSh;
  #ifdef CANYON
  {                                                        // the beds of each set: a tone apiece (hard beds pale, soft beds red), and the shade under a proud one
    float tq = clamp(bedT, 0.0, 1.0);
    alb *= mix(1.0, mix(0.64, 1.34, tq), bedK);
    alb = mix(alb, uCream*0.78, 0.22*smoothstep(0.62, 1.0, tq)*bedK);
    alb = mix(alb, uDeep*0.95, 0.36*(1.0 - smoothstep(0.0, 0.38, tq))*bedK);
    alb *= mix(vec3(1.0), vec3(0.52, 0.4, 0.47), bedSh);
  }
  #endif
  float vert = 1.0 - abs(N.y);
  // desert varnish: dark plum curtains hanging from the tops of vertical faces
  // (in the slot they are thin crisp streaks, and few: never soft brown stains metres wide)
  float vsc = mix(0.42, 1.1, sl);
  float streak = vn3(vec3(vP.x*vsc, vP.y*0.028, vP.z*vsc)) * 0.65 + mix(0.5, vn3(vec3(vP.x*1.7, vP.y*0.06, vP.z*1.7)), seen(fw*1.7*0.6))*0.35;
  float varn = smoothstep(mix(0.46, 0.56, sl), mix(0.68, 0.64, sl), streak) * smoothstep(0.35, 0.8, vert) * (0.45 + 0.55*vn3(vP*0.045 + 11.0)) * seen(fw*vsc*0.5);
  alb = mix(alb, uPlum*0.8 + uDark*0.3, varn*0.72*(1.0 - 0.65*sl));
  #ifdef CANYON
  {
    // Desert varnish down the slot's walls, ACROSS the beds: dark plum curtains that hang from a seep or a ledge and fray out
    // downward, and narrow tears beside and between them, each running plumb down the face (along the wall's own upright
    // section), a few metres apart and uneven: some stretches of wall streaked, some clean. Placed by metres along the canyon
    // and metres above the floor; drawn while a streak is wider than a pixel or two.
    float rkV = sl*(1.0 - flr)*(1.0 - sandy)*smoothstep(0.3, 0.7, vert);
    if (rkV > 0.001) {
      float hF = vP.y - (14.5 + 7.0*smoothstep(262.0, 600.0, vP.z));      // metres above the slot's floor
      float fa = length(dPx.xz) + length(dPy.xz) + 0.25*(abs(dPx.y) + abs(dPy.y));   // the pixel's run along the wall
      float aW = dAl + sideW*37.7;
      float zoneV = smoothstep(0.42, 0.7, vn3(vec3(aW*0.045, sideW*9.0 + 3.0, vP.y*0.02)));   // (streaked stretches, and clean wall between them)
      float vv = 0.0;
      {                                                                    // curtains: solid under the seep, in fewer and fewer threads further down
        float ca = aW/3.4, ci = floor(ca), cf = ca - ci, cm = mod(ci, 211.0) + sideW*211.0;
        float h1 = h11(cm*1.7 + 9.0), h2 = h11(cm*2.9 + 4.0), h3 = h11(cm*0.83 + 7.0), h4 = h11(cm*3.7 + 1.0), h5 = h11(cm*5.3 + 2.0);
        float hT = mix(8.0, 27.0, h4), len = mix(6.0, 24.0, h5), hBm = hT - len;
        float dn = clamp((hT - hF)/len, 0.0, 1.0);                         // 0 at its top .. 1 at its lowest thread's end
        float fray = smoothstep(0.35, 1.0, dn);
        float hw = mix(0.03, 0.1, h3)*(1.0 - 0.3*fray)*(0.8 + 0.4*vn2(vec2(hF*0.5 + cm*7.0, cm)));
        float cx = 0.5 + 0.5*(h2 - 0.5) + 0.03*(vn2(vec2(hF*0.23, cm*3.0)) - 0.5);
        float ew = clamp(0.8*fa/3.4, 0.008, 0.2);
        float m = 1.0 - smoothstep(hw - ew, hw + ew, abs(cf - cx));
        float thn = vn2(vec2(aW*4.3 + 0.2*vn2(vec2(hF*0.35, cm)), cm*1.3 + hF*0.02));
        float thE = 0.1 + fa*4.3;
        float thr = mix(1.0 - 0.8*fray, smoothstep(mix(-0.4, 0.8, fray) - thE, mix(-0.4, 0.8, fray) + thE, thn), seen(fa*4.3));
        // (shown while its body is some pixels wide: a curtain whose edge would be a blur is not drawn at all; each of its own darkness)
        vv = m*thr*step(0.62, h1)*(1.0 - smoothstep(hT - 0.4, hT, hF))*step(hBm, hF)*clamp(hw*3.4/max(2.5*fa, 1e-3) - 0.5, 0.0, 1.0)*mix(0.3, 0.6, h3)*mix(1.0, 0.8, fray);
      }
      {                                                                    // tears
        float ta = aW/1.27 + 0.31, ti = floor(ta), tf = ta - ti, tm = mod(ti, 173.0) + sideW*173.0;
        float h1 = h11(tm*2.3 + 5.0), h2 = h11(tm*1.3 + 8.0), h3 = h11(tm*3.1 + 2.0), h4 = h11(tm*0.7 + 6.0), h5 = h11(tm*4.3 + 3.0);
        float hT = mix(3.5, 30.0, h4), len = mix(3.0, 13.0, h5), hBm = hT - len;
        float tap = smoothstep(hBm, hBm + 0.8*len, hF);
        float hw = mix(0.04, 0.09, h3)*(0.25 + 0.75*tap);
        float cx = 0.5 + 0.6*(h2 - 0.5) + 0.07*(vn2(vec2(hF*0.4, tm*5.0)) - 0.5);
        float ew = clamp(0.8*fa/1.27, 0.008, 0.3);
        float m = 1.0 - smoothstep(hw - ew, hw + ew, abs(tf - cx));
        vv = max(vv, m*step(0.5, h1)*(1.0 - smoothstep(hT - 0.2, hT, hF))*smoothstep(hBm, hBm + 0.3*len, hF)*clamp(hw*1.27/max(0.6*fa, 1e-3) - 0.2, 0.0, 1.0)*0.75);
      }
      // (the rock's own colour gone dark, with a breath of plum; lighter on rock that is dark already: a streak, never a black bar)
      alb = mix(alb, alb*0.2 + uPlum*0.3 + uDark*0.25, vv*zoneV*rkV*mix(0.55, 1.0, smoothstep(0.08, 0.3, dot(alb, vec3(0.3, 0.5, 0.2)))));
    }
  }
  #endif
  // slickrock tops: swirling cross-bedding
  // (the cross-beds run one way, their lines bent but never closed: no bullseye rings on the ground)
  float sw = fbm3(vec3(vP.x*0.022, vP.y*0.09, vP.z*0.03) + 2.0)*6.0 + vP.x*0.33 + vP.z*0.13 + vP.y*1.4;
  float swe = clamp(fw*1.2, 0.08, 0.3);
  float swl = smoothstep(-swe, swe, sin(sw)) * (0.6 + 0.4*n1(sw*0.16));
  alb = mix(alb, mix(uRed*0.85, mix(uOrange, uCream, 0.45), swl), smoothstep(0.5, 0.9, N.y)*0.7*seen(fw*0.35));
  // sun-bleached tops, mottling
  alb = mix(alb, uCream*0.85, smoothstep(0.55, 0.95, N.y)*0.1);
  #ifdef CANYON
  alb = mix(alb, amCol*(0.86 + 0.28*swl), amRock);          // the amphitheatre's benches (their cross-beds' lines kept, in little)
  #endif
  // mottling, drawn out along the beds
  alb *= mix(0.8, 0.9, mwS) + mix(0.4, 0.2, mwS)*mix(0.5, fbm3(mix(vP*0.19, vec3(vP.x*0.17, ysB*0.5, vP.z*0.17), sl) + 5.0), seen(mix(0.19*fw, fy*0.5 + fw*0.17, sl)));
  alb *= mix(1.0, 0.88 + 0.24*fbm3(vec3(vP.x*0.09, ysB*0.36, vP.z*0.09) + 9.0), sl);
  // the slot's walls, near the eye: upright flutes and scoops that cut ACROSS the beds (leaning a little, as water leaves them),
  // in tone here and in relief below, so a wall seen along its length is never beds alone, drawn out into streaks
  float flu = 0.0, xbG = 0.0;
  vec3 xbN = vec3(0.0, 1.0, 0.0);
  vec3 gA = vec3(0.0);                                     // the slot's small relief (its scoops): its slope in metres per metre, world space
  float nCrest = 0.0, nHol = 0.0;                          // .. and how far this pixel lies on a small lit edge, or in a small hollow (under a ledge, in the roof of a scoop)
  #ifdef CANYON
  {
    vec3 pf = vec3(vP.x + 0.22*vP.y, vP.y, vP.z + 0.16*vP.y);
    float fa = vn3(vec3(pf.x*0.78, pf.y*0.17, pf.z*0.78) + 3.0), fb = vn3(vec3(pf.x*2.3, pf.y*0.42, pf.z*2.3) + 11.0);
    flu = sl*(1.0 - flr)*(1.0 - smoothstep(30.0, 70.0, dist))*((smoothstep(0.15, 0.85, fa) - 0.5)*seen(fw*0.78) + 0.5*(fb - 0.5)*seen(fw*2.3));
    alb *= 1.0 + 0.42*flu;
  }
  // The slot's rock within a few metres of the eye. Beds alone, seen along a wall, are drawn out into long streaks: what holds
  // at one or two metres is what cuts ACROSS them, in world space. Cross-bedding: inside each bed a set of foresets, a hand apart,
  // dipping its own way and cut off at the bed's top and foot. Pits eaten into the softer beds. Grain. Each is faded by the
  // pixel's own footprint across it (worked out from the rock's plane, no screen-space derivative), so nothing sparkles.
  {
    float nearW = sl*(1.0 - flr)*(1.0 - sandy)*(1.0 - smoothstep(16.0, 38.0, dist));
    float bid = floor(p1 + 0.5), bf = fract(p1 + 0.5);
    float az = h11(bid*1.37 + 3.1)*6.2832, dipS = mix(0.24, 0.6, h11(bid*2.11 + 9.0)), fq = mix(3.6, 6.4, h11(bid*0.73 + 0.5));
    xbN = vec3(cos(az)*dipS, 1.0, sin(az)*dipS);
    float cph = dot(vP, xbN)*fq + 1.4*vn3(vP*0.33 + bid*3.0);       // (foresets that curve a little: swept in by wind, never ruled)
    float fc = (abs(dot(dPx, xbN)) + abs(dot(dPy, xbN)))*fq;
    float sx = sin(6.2832*cph), cx = cos(6.2832*cph);
    // (laminae of unequal thickness, in sets that come and go along the bed: never a ruled hatch)
    float sx2 = sin(6.2832*cph*2.37 + bid*1.9)*(1.0 - smoothstep(0.2, 0.46, fc*2.37));
    float setK = 0.3 + 0.7*smoothstep(0.3, 0.64, vn3(vP*0.27 + bid*5.0));
    float sb = smoothstep(0.26, 0.5, h11(bid*3.3 + 1.7))*smoothstep(0.0, 0.1, bf)*(1.0 - smoothstep(0.9, 1.0, bf))*k1*(1.0 - smoothstep(0.2, 0.46, fc))*nearW*setK*(1.0 - bedX);
    alb *= 1.0 + 0.19*(0.62*sx + 0.38*sx2)*sb;
    xbG = 0.0034*fq*6.2832*cx*sb;                                    // their relief, as an exact slope along xbN
    float fiso = sqrt(max(length(dPx)*length(dPy), 1e-8));
    float pz = smoothstep(0.42, 0.68, vn3(vec3(vP.x*0.5, ys*1.3, vP.z*0.5) + 23.0));   // pitted zones run with certain beds
    float pit = (1.0 - smoothstep(0.14, 0.3, vn3(vP*4.6 + 13.0)))*pz*seen(fiso*4.6*1.3)*nearW;
    alb *= 1.0 - 0.45*pit;
    alb *= 1.0 + 0.2*(vn3(vP*13.0 + 5.0) - 0.5)*seen(fiso*13.0*0.8)*nearW;
    // The scoops' own slope goes into the normal (gA), and the partings between sets keep a soft shade:
    float rockK = sl*(1.0 - flr)*(1.0 - sandy);
    // (1) the scoops' slope (the field worked out above), as far as the eye can read it
    vec3 gS = bowlG*seen(fiso*0.8);
    gA = gS - N*dot(gS, N);
    nHol += 0.7*clamp(gS.y*1.6, 0.0, 1.0);                               // (the roof of a scoop looks down: it keeps a little shade ..
    nCrest += 0.55*clamp(-gS.y*1.6, 0.0, 1.0);                           // .. and its floor looks up at the slit: a dish, lit from above)
    // (2) the partings between sets: where a harder set lies over a much softer one it overhangs, with a soft band of shade beneath
    {
      float hsA = h11(bid*5.7 + 2.0), hsB = h11((bid + 1.0)*5.7 + 2.0), hsC = h11((bid - 1.0)*5.7 + 2.0);
      float pw = clamp(0.6*w1, 0.12, 0.25);                               // (a soft band a hand wide, never a hairline)
      float parting = (1.0 - smoothstep(0.0, pw, min(bf, 1.0 - bf)))*(1.0 - smoothstep(0.16, 0.4, w1))*rockK;
      float dl = bf > 0.5 ? hsA - hsB : hsC - hsA;
      float partN = parting;
      nHol += 0.5*partN*clamp(-dl*2.2 - 0.35, 0.0, 1.0);
      alb *= 1.0 + 0.16*(hsA - 0.5)*rockK*k1;   // (hard sets weather pale, soft ones darker)
    }
  }
  {                                                                  // the petroglyphs: marks pecked through a skin of desert varnish into the rock itself
    vec3 dg = vP - uGlyphC.xyz;
    vec2 guv = vec2(dot(dg, uGlyphU.xyz)/max(uGlyphU.w, 0.01), dot(dg, uGlyphV.xyz)/max(uGlyphV.w, 0.01));
    float gon = sl*(1.0 - flr)*(1.0 - sandy)*(1.0 - smoothstep(1.6, 3.2, abs(dot(dg, uGlyphN))));
    // the panel: a face of rock under dark varnish, its outline uneven, streaked down from above
    float gr = length(guv*vec2(0.86, 0.9)) + 0.34*(vn3(vP*0.45 + 31.0) - 0.5) + 0.2*(vn3(vec3(vP.x*1.9, vP.y*0.12, vP.z*1.9)) - 0.5);
    float gv = (1.0 - smoothstep(0.82, 1.3, gr))*gon;
    alb = mix(alb, (uPlum*0.7 + uDark*0.3)*(0.75 + 0.5*strata), 0.72*gv);
    // the marks: the paler rock under that skin, dinted by the stone that pecked it (lighter than the varnish, darker than sand)
    float lod = clamp(log2(max(fw*512.0/max(uGlyphU.w, 0.01), 1.0)) - 0.6, 0.0, 7.0);
    float gm = textureLod(uGlyphTex, clamp(guv*0.5 + 0.5, 0.0, 1.0), lod).a*step(abs(guv.x), 1.0)*step(abs(guv.y), 1.0)*gon;
    float fisoG = sqrt(max(length(dPx)*length(dPy), 1e-8));
    alb = mix(alb, mix(uOrange, uCream, 0.5)*0.92*(1.0 + 0.3*(vn3(vP*17.0) - 0.5)*seen(fisoG*17.0)), smoothstep(0.25, 0.7, gm)*0.9);
  }
  #endif
  // wind-blown sand: ripples across the wind, a finer set riding them near the camera
  float rpo = vP.x*3.1 + vP.z*1.3 + 6.0*vn3(vP*0.21) + 9.0*vn3(vP*0.05 + 4.0);
  float ripK = smoothstep(0.25, 0.7, vn3(vP*0.06 + 13.0));           // ripple fields between smooth, wind-swept sand
  float rip = mix(0.5, sin(rpo)*0.5 + 0.5, 1.0 - smoothstep(1.0, 2.4, abs(3.1*dPx.x + 1.3*dPx.z) + abs(3.1*dPy.x + 1.3*dPy.z) + 0.5*fw));
  float rpb = vP.x*1.15 + vP.z*0.42 + 5.0*vn3(vP*0.07 + 9.0);        // broad ripples, about 5 m apart: these carry to the middle distance
  float ripB = mix(0.5, sin(rpb)*0.5 + 0.5, (1.0 - smoothstep(1.0, 2.4, abs(1.15*dPx.x + 0.42*dPx.z) + abs(1.15*dPy.x + 0.42*dPy.z) + 0.15*fw))*(1.0 - flr));
  float rpf = vP.x*2.3 - vP.z*10.5 + 5.0*vn3(vP*0.5 + 3.0);
  float ripF = mix(0.5, sin(rpf)*0.5 + 0.5, (1.0 - smoothstep(1.0, 2.4, abs(2.3*dPx.x - 10.5*dPx.z) + abs(2.3*dPy.x - 10.5*dPy.z) + 1.0*fw))*(1.0 - flr));
  rip = rip*rip*(3.0 - 2.0*rip);
  #ifdef CANYON
  {                                                                  // the slot's floor: wind ripples across the canyon
    float rph = dAl*14.0 + 6.0*vn3(vP*0.27) + 1.6*vn3(vP*1.3);
    float rf = 1.0 - smoothstep(0.5, 1.9, 16.0*length(dPy) + 6.0*length(dPx));
    float r2 = sin(rph + 0.55*sin(rph))*0.5 + 0.5;                   // skewed: a long windward back, a short lee face
    // and a broader set, a metre and a half from crest to crest, that carries on down the canyon
    float rpw = dAl*4.1 + 4.0*vn3(vP*0.11 + 2.0) + 1.2*vn3(vP*0.6);
    float rfw = 1.0 - smoothstep(0.5, 1.9, 4.7*length(dPy) + 1.8*length(dPx));
    float r3 = sin(rpw + 0.6*sin(rpw))*0.5 + 0.5;
    rip = mix(rip, 0.58*mix(0.5, r2*r2*(3.0 - 2.0*r2), rf) + 0.42*mix(0.5, r3, rfw), flr);
  }
  #endif
  float ripN = 1.0 - smoothstep(25.0, 60.0, dist), ripA = mix(0.2, 0.36, ripN);   // (near the eye the ripples are crisp and deep)
  vec3 sand = mix(uOrange, uCream, 0.5 + 0.2*vn3(vP*0.3) + 0.22*(vn3(vP*0.043 + 7.0) - 0.5)*(1.0 - flr))
    * mix(0.94 - 0.5*ripA + ripA*mix(0.5, rip, ripK*(1.0 - 0.5*sl)) + mix(0.1, 0.2, ripN)*(ripF - 0.5)*ripK*(1.0 - 0.6*sl) + 0.26*(ripB - 0.5)*(1.0 - sl), 0.72 + 0.46*rip, flr);   // (no broad ripples on the drift banked up a slot wall)
  alb = mix(alb, sand, sandy);
  // wind-driven sand streamers snaking over the flats
  vec2 wd = normalize(uWind + 1e-4);
  float al = dot(vP.xz, wd), ac = dot(vP.xz, vec2(-wd.y, wd.x));
  float sn = vn2(vec2(al*0.06 - uTime*0.5, ac*0.3 + 4.0*vn2(vec2(al*0.025, ac*0.045))));
  sn = smoothstep(0.62, 0.84, sn) * (0.45 + 0.55*vn2(vec2(al*0.45 - uTime*2.6, ac*1.8)));
  alb += sand * sn * mix(0.42, 0.24, smoothstep(30.0, 90.0, dist)) * smoothstep(0.7, 0.95, N.y);   // (stronger near the eye: sand on the move under the low pass)
  alb *= clamp(vCol, 0.0, 3.4) * mix(0.6, 0.44, sandy) * mix(1.0, 0.86, smoothstep(0.6, 0.95, N.y));
  #ifdef CANYON
  alb *= mix(1.0, amShade*(1.0 - 0.16*amSlip), amph);
  if (desF > 0.5) {
    // The open desert beyond the rim is not one pale plain: flats of red earth, dark flats of scrub and varnished pavement,
    // pale dune fields with their slip faces in shade, and a dry river winding away to the horizon. Seen from the rim these
    // lie one behind another in bands that close up with distance. Zones of the land itself, in world metres.
    vec2 p = vP.xz;
    float zA = vn2(p*0.0011 + 3.0), zB = mix(0.5, vn2(p*0.0037 + 17.0), seen(fw*0.0037*0.6)), zC = mix(0.5, vn2(p*0.012 + 5.0), seen(fw*0.012*0.6));
    float red = smoothstep(0.44, 0.58, 0.55*zA + 0.3*zB + 0.15*zC);
    float dark = smoothstep(0.52, 0.66, 0.5*vn2(p*0.0019 + 41.0) + 0.35*zB + 0.15*zC);
    alb = mix(alb, mix(uRed, uDeep, 0.35)*0.4, 0.72*red);
    alb *= 1.0 - 0.4*dark*(1.0 - 0.5*red);
    vec2 wdr = -normalize(uSun.xz + vec2(1e-4, 0.0));
    float pdn = dot(p, wdr)/64.0 + 2.2*vn2(p*0.0027 + 9.0);
    float fPd = (abs(dot(wdr, dPx.xz)) + abs(dot(wdr, dPy.xz)))/64.0;
    float sq = fract(pdn), eq = clamp(fPd, 0.03, 0.3);
    float slipD = smoothstep(0.7 - eq, 0.7 + eq, sq)*(1.0 - smoothstep(1.0 - eq, 1.0, sq));
    alb *= 1.0 + (0.1 - 0.36*slipD)*(1.0 - red)*(1.0 - dark)*(1.0 - smoothstep(0.2, 0.5, fPd))*smoothstep(0.35, 0.6, vn2(p*0.0016 + 55.0));
    float rvx = 150.0*sin(p.y*0.0033 + uAmp.x) + 48.0*sin(p.y*0.0109 + 1.7) + 30.0 + 22.0*(vn2(p*0.011 + 61.0) - 0.5);
    float rvw = 9.0 + 16.0*vn2(vec2(p.y*0.012, 3.0)), rvf = abs(dPx.x) + abs(dPy.x) + 0.3*(abs(dPx.z) + abs(dPy.z));   // (narrow, then wide)
    float rvE = max(rvf, 1e-3);
    float rv = (1.0 - smoothstep(rvw - rvE, rvw + rvE, abs(p.x - rvx)))*(1.0 - smoothstep(-420.0, -180.0, p.y))*clamp(rvw/rvE, 0.0, 1.0);
    alb = mix(alb, mix(uOrange, uCream, 0.7)*0.4, 0.5*rv);
  }
  #endif
  float heroB = 0.0, heroH = 0.0;
  #ifdef CANYON
  if (sl > 0.0) {                                          // the hero beam's pool: the shape of the slit it comes through, burnt onto the sand
    for (int i = 0; i < 8; i++) {
      float fi = float(i);
      // (the smaller pillars' pools drift slowly round their feet, as the patches of the version before did: the design's 'slow drift of the beams' light patches')
      vec3 d = vP - uHeroF[i] - step(1.5, fi)*vec3(0.3*sin(uTime*0.13 + fi*2.1), 0.0, 0.3*cos(uTime*0.11 + fi*1.3));
      if (dot(d, d) > 2500.0) continue;
      // (the pool is a third larger than the shaft's section, so the foot of the shaft stands inside it and never ends on a patch of its own width)
      vec2 q = vec2(dot(d, uHeroE1[i].xyz)/max(uHeroE1[i].w, 0.01), dot(d, uHeroE2[i].xyz)/max(uHeroE2[i].w, 0.01))/1.32;
      float r = length(q), rs = r, al = dot(d, uHeroA);
      vec2 qn = q/max(r, 0.01);
      // (a lobed, notched outline that breathes slowly, pinched across its middle: a slit's shadow, never a disc)
      r *= 1.0 + 0.62*(vn3(vec3(qn*1.7, 3.0 + fi*7.0 + uTime*0.02)) - 0.5) + 0.16*(vn3(vec3(q*2.3, 9.0 + fi)) - 0.5) + 0.3*exp(-q.x*q.x*14.0)*abs(qn.y);
      float ew = clamp(1.5*fw/max(uHeroE2[i].w, 0.01), 0.06, 0.16);
      heroB = max(heroB, (1.0 - smoothstep(1.0 - ew, 1.0 + ew, r))*step(-2.5, al)*(1.0 - 0.75*smoothstep(20.0, 34.0, al))*(1.0 - 0.6*step(0.5, fi)*step(fi, 1.5)));   // (the soft ray beside the hero beam lays a faint patch, never a pale plinth)
      // the spill of light round it: on the sand, and on the rock beside it that faces it
      vec3 tp = vec3(0.0, 0.4, 0.0) - d;
      float fcp = clamp(dot(N, tp/max(length(tp), 1e-3))*1.4 + 0.1, 0.0, 1.0);
      heroH = max(heroH, exp(-max(rs*1.32 - 1.0, 0.0)*uHeroK[i].x)*step(-2.5, al)*(1.0 - smoothstep(1.0, 8.0, al))*uHeroK[i].y*mix(fcp, 1.0, max(flr, sandy)));
    }
    heroB *= sl; heroH *= sl;
  }
  // THE HALL'S POOLS: the pillars' pool, as above, for the three shafts that stand in the hall (lobed, breathing, drifting
  // slowly round its foot; its spill on the sand and on the rock that faces it), inside the hall's own round in plan and
  // exactly nothing outside it
  if (sl > 0.0) {
    vec2 dhc = vP.xz - uHallC.xz;
    float hwn = 1.0 - smoothstep(0.7, 1.0, dot(dhc, dhc)/max(uHallC.w*uHallC.w, 1.0));
    if (hwn > 0.0) {
      float hB = 0.0, hH = 0.0;
      int nH = vFar.y > 0.0 ? 0 : 3;                        // (a triangle the hall's round cannot reach walks none of its pools)
      for (int i = 0; i < nH; i++) {
        float fi = float(i) + 8.0;
        vec3 d = vP - uHallF[i] - vec3(0.3*sin(uTime*0.13 + fi*2.1), 0.0, 0.3*cos(uTime*0.11 + fi*1.3));
        vec2 q = vec2(dot(d, uHallE1[i].xyz)/max(uHallE1[i].w, 0.01), dot(d, uHallE2[i].xyz)/max(uHallE2[i].w, 0.01))/1.32;
        float r = length(q), rs = r, al = dot(d, uHeroA);
        vec2 qn = q/max(r, 0.01);
        r *= 1.0 + 0.62*(vn3(vec3(qn*1.7, 3.0 + fi*7.0 + uTime*0.02)) - 0.5) + 0.16*(vn3(vec3(q*2.3, 9.0 + fi)) - 0.5) + 0.3*exp(-q.x*q.x*14.0)*abs(qn.y);
        float ew = clamp(1.5*fw/max(uHallE2[i].w, 0.01), 0.06, 0.16);
        hB = max(hB, (1.0 - smoothstep(1.0 - ew, 1.0 + ew, r))*step(-2.5, al)*(1.0 - 0.75*smoothstep(20.0, 34.0, al)));
        vec3 tp = vec3(0.0, 0.4, 0.0) - d;
        float fcp = clamp(dot(N, tp/max(length(tp), 1e-3))*1.4 + 0.1, 0.0, 1.0);
        hH = max(hH, exp(-max(rs*1.32 - 1.0, 0.0)*uHallK[i].x)*step(-2.5, al)*(1.0 - smoothstep(1.0, 8.0, al))*uHallK[i].y*mix(fcp, 1.0, max(flr, sandy)));
      }
      heroB = max(heroB, hB*hwn*sl); heroH = max(heroH, hH*hwn*sl);
    }
  }
  // (the first slot's lesser shaft has no pool code of its own: its pool is the last of the eight places above, a pillar's pool like the others)
  #endif
  // ---- bump: the lumps and grain from the procedural height, the beds from their exact slopes
  float bs = mix(1.0, mix(0.75, 0.55, flr), sandy) * (0.45 + 0.55*fine) * (1.0 + 0.8*heroB*flr);   // (in the hero pool every ripple throws a shadow)
  // (the lumps of the relief are drawn out along the beds: flutes and scallops, not pillows)
  vec3 pR = mix(vP, vec3(vP.x*0.7, ys*1.7, vP.z*0.7), sl);
  float fpR = mix(fw, 0.7*fw + 1.7*fy, sl);
  float hr = rockH(pR, fpR) + 0.62*flu
    + sl*0.3*mix(0.5, n1(ys*mix(0.83, 0.55, sl) + 9.1), kB)   // (the broad band itself, smooth: the relief is taken by screen-space derivatives, and a bed's step would come out dotted)
    + (1.0 - sl)*fine*fine*lam*0.1*(vn3(vec3(vP.x*0.45, ys*8.0, vP.z*0.45)) - 0.5)*seen(8.0*fy + 0.45*fw);
  // (open sand: the ripples are relief the low sun can model)
  float h = mix(hr, mix((rip*mix(0.22, 0.34, ripN) + ripF*mix(0.04, 0.08, ripN))*ripK*(1.0 - 0.6*sl) + ripB*0.45*(1.0 - sl), rip*0.17, flr), sandy);
  vec3 Ng = N;
  vec3 dpx = dFdx(vP), dpy = dFdy(vP);
  float hx = dFdx(h), hy = dFdy(h);
  {
    float gk = fine*fine*seen(fpR*5.5)*(1.0 - sandy), g0 = rockG(pR);
    vec3 qx = mix(dPx, vec3(dPx.x*0.7, (dPx.y + 0.05*dPx.x)*1.7, dPx.z*0.7), sl), qy = mix(dPy, vec3(dPy.x*0.7, (dPy.y + 0.05*dPy.x)*1.7, dPy.z*0.7), sl);
    hx += gk*(rockG(pR + qx) - g0); hy += gk*(rockG(pR + qy) - g0);
  }
  { float ds = dStrata*(1.0 - sandy); hx += ds*dFdx(flow); hy += ds*dFdy(flow); }
  hx += xbG*dot(xbN, dpx); hy += xbG*dot(xbN, dpy);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx);
  float det = dot(dpx, r1);
  vec3 grad = sign(det)*(hx*r1 + hy*r2);
  N = normalize(max(abs(det), 1e-6)*N - 0.95*bs*grad);
  N = normalize(N - gA - amG);                                    // (the scoops of the slot's rock: an exact slope, no screen-space derivative)
  #ifdef CANYON
  // (the slot's rock is a sheet with two sides: a crest that stands beyond the open court shows its far side over the low
  // wall. That side is rock too, lit by the way IT looks: it keeps its beds and stands warm in the shade of its own crest,
  // and is not the sunlit face seen through from behind, a pale lobe on the sky)
  if (!gl_FrontFacing && sl > 0.5) { N = -N; Ng = -Ng; }
  #endif
  // ---- light: noon sun, sky fill, bounce that grades orange -> red -> plum into the folds
  float ao = clamp(vShade.x, 0.0, 1.0), vis = clamp(vShade.y, 0.0, 1.0);
  // slow cloud shadows drifting over the open ground and the cliffs
  vis *= 1.0 - 0.4*(1.0 - sl)*smoothstep(0.43, 0.63, vn2(vP.xz*0.0042 + uTime*vec2(0.03, 0.011)) + 0.25*vn2(vP.xz*0.013 - uTime*vec2(0.018, 0.035)) - 0.125);
  float relief = 1.0, courtB = 0.0, courtH = 0.0;
  vec3 sunTint = vec3(1.0);
  #ifdef CANYON
  if (sl < 0.5) {                                                    // the hoodoos' shadows, thrown across the sand and whatever stands on it
    vec2 sh = uSun.xz; float shl = max(length(sh), 1e-3); sh /= shl;
    float tanE = uSun.y/shl, hsd = 0.0;
    for (int i = 0; i < 3; i++) {
      vec2 dxz = uHoo[i].xz - vP.xz;
      float s0 = dot(dxz, sh), t = (vP.y + s0*tanE - uHoo[i].y)/max(uHoo[i].w, 1.0);
      float rr = uHooR[i].x*(1.0 - 0.48*pow(clamp(t, 0.0, 1.0), 0.8))*(1.0 + 0.25*uHooR[i].y*step(0.8, t));
      float pen = 0.2 + 0.04*max(s0, 0.0);                           // (the penumbra widens down the shadow)
      hsd = max(hsd, (1.0 - smoothstep(rr*0.88 - pen, rr*0.88 + pen, length(dxz - sh*s0)))*smoothstep(rr*1.1, rr*1.7, s0)*step(-0.15, t)*(1.0 - smoothstep(0.95, 1.03, t)));
    }
    vis *= 1.0 - 0.92*hsd*(1.0 - sl);
  }
  {                                                                  // the fine relief, modelled by the light that reaches this wall
    float ldl = length(vLd);
    relief = clamp(1.0 + 1.5*min(ldl, 1.0)*dot(N - Ng, vLd/max(ldl, 1e-3)), 0.45, 1.75);
    // (where the light has no side to rake from, the slit above is what the small edges catch: a lit edge on top, shade beneath)
    // (.. and only as far as there is light to catch: in the dark of a fold or of the entry hall no edge glows)
    float catchL = smoothstep(0.2, 0.6, ao);
    relief *= 1.0 + (0.14 + 0.3*(1.0 - min(ldl*1.4, 1.0)))*(1.1*min(nCrest, 1.0)*catchL - min(nHol, 1.0)*(0.45 + 0.55*catchL));
  }
  // (sun on the slot's walls has a hard edge: the baked value is cut per pixel along a slightly uneven line)
  vis = mix(vis, smoothstep(0.46, 0.54, vis + 0.05*(vn3(vP*0.7 + 21.0) - 0.5)), sl);
  if (sl > 0.0) {                                                    // pools of sun where a beam comes down the slot
    {                                                                // the open court's sunbeam: a hard-edged patch on the floor, and on whatever rock stands in it
      vec3 e3 = vP - uCourtD*((vP.y - uCourtC.y)/max(uCourtD.y, 0.2));
      vec2 e = e3.xz - uCourtC.xz;
      vec2 q = vec2(dot(e, uCourtA.xy)/max(uCourtA.z, 0.01), dot(e, vec2(-uCourtA.y, uCourtA.x))/max(uCourtA.w, 0.01));
      float r = length(q);
      // (the slit's own shape thrown on the sand: long, lobed and notched, never a disc)
      r *= 1.0 + 0.46*(vn3(vec3(q/max(r, 0.01)*1.7, 3.0 + uTime*0.012)) - 0.5) + 0.14*(vn3(vec3(e*0.4, 9.0)) - 0.5);
      float ew = clamp(1.5*fw/max(uCourtA.w, 0.01), 0.02, 0.07);
      // (the shaft is drawn from the low rim down: rock that stands higher in its line keeps the baked light, or a fin would blaze white in the sky)
      float cb = (1.0 - smoothstep(1.0 - ew, 1.0 + ew, r))*step(uCourtC.y - 2.5, vP.y)*(1.0 - smoothstep(13.0, 20.0, vP.y - uCourtC.y));
      {                                                              // the sapling's shadow on its patch: trunk and a crown of shivering leaves
        vec2 sc = e3.xz - uCourtS.xy, sa = uCourtS.xy - uCourtT.xy, pt = e3.xz - uCourtT.xy;
        float crown = 1.0 - smoothstep(0.55, 1.0, length(sc)/max(uCourtS.z, 0.01));
        float dap = smoothstep(0.3, 0.62, 0.6*vn3(vec3(sc*2.6, uTime*0.45)) + 0.4*vn3(vec3(sc*7.0 + 3.0, uTime*0.8)));
        float tk = clamp(dot(pt, sa)/max(dot(sa, sa), 1e-3), 0.0, 1.0);
        float trunk = 1.0 - smoothstep(0.07, 0.13 + 1.5*fw, length(pt - sa*tk));
        cb *= 1.0 - max(0.74*crown*(0.4 + 0.6*dap), 0.7*trunk*uCourtT.z)*uCourtS.w;
      }
      vis = max(vis, cb*sl*smoothstep(-0.1, 0.2, dot(normalize(vN), uCourtD))*mix(0.8, uCourtC.w, max(flr, sandy)));
      sunTint = mix(sunTint, vec3(1.24, 0.62, 0.2), cb*max(flr, sandy));   // (the court's shaded sand is baked cool: in the patch it is sunlit gold)
      courtB = cb*max(flr, sandy);
      {                                                              // the light that patch throws back: on the sand round it and up the rock beside it that faces it, gone within a few metres
        vec2 eh = vP.xz - uCourtC.xz;
        float rh = length(vec2(dot(eh, uCourtA.xy)/max(uCourtA.z, 0.01), dot(eh, vec2(-uCourtA.y, uCourtA.x))/max(uCourtA.w, 0.01)));
        vec2 pn = eh/max(rh, 1.0);                                   // (the part of the patch that lies nearest, more or less)
        vec3 tp = vec3(pn.x - eh.x, uCourtC.y + 0.3 - vP.y, pn.y - eh.y);
        float tl = length(tp);
        float fcp = clamp(dot(N, tp/max(tl, 1e-3))*1.3 + 0.15, 0.0, 1.0);
        courtH = exp(-tl/4.0)*mix(fcp, 0.3, max(flr, sandy))*sl*step(uCourtC.y - 2.5, vP.y);   // (on the sand only a breath of it: the patch keeps its hard edge)
      }
    }
    heroB *= smoothstep(-0.15, 0.25, dot(normalize(vN), uHeroA));
    vis = max(vis, heroB*mix(1.0, 0.74, flr));
    heroB *= max(flr, sandy);
    sunTint = mix(sunTint, vec3(1.3, 0.72, 0.29), heroB);          // (burning gold on the sand, never a pale blob)
  }
  #endif
  float ndl = max(dot(N, uSun), 0.0);
  float up = N.y*0.5 + 0.5, down = 1.0 - up;
  // (a patch of sun on the slot's floor shows every ripple; the hero pool deeper still, and mottled like trodden sand)
  vec3 light = uSunCol * sunTint * mix(ndl, 0.35 + 0.65*ndl, heroB) * vis * mix(1.0, mix(0.45 + 1.1*rip, 1.4*(0.36 + 1.28*rip)*(0.82 + 0.36*vn3(vP*1.3 + 31.0)), heroB), flr) * mix(1.0, 0.52 + 0.96*rip, courtB);   // (.. and the court's patch is warm rippled sand)
  float ss = sl * sandy;                                   // sand in the slot: floor and banked drift lit as one body
  #ifdef CANYON
  {                                                        // the hero pool's spill: the sand round it glows, and the rock beside it that faces it
    light += uSunCol*vec3(1.2, 0.6, 0.24)*1.15*heroH*(1.0 - 0.8*heroB);
    light += uSunCol*vec3(1.2, 0.62, 0.26)*(0.9*courtH*(1.0 - courtB) + 0.45*courtB*(0.75 + 0.5*rip));   // (.. and the court's patch, in little: a hot pool with warm rock beside it)
    // the blade of sun that picks out the petroglyphs: a lobed patch on the rock of their wall, raking down it
    vec3 dg = vP - uGlyphC.xyz;
    if (dot(dg, dg) < 900.0) {
      vec3 pg = dg - uGlyphL*dot(dg, uGlyphL);
      float rg = length(pg);
      float rgn = rg/max(uGlyphC.w, 0.01)*(1.0 + 0.5*(vn3(pg/max(rg, 0.01)*1.6 + vec3(5.0 + uTime*0.015)) - 0.5) + 0.12*(vn3(vP*1.1 + 3.0) - 0.5));
      float eg = clamp(1.5*fw/max(uGlyphC.w, 0.01), 0.04, 0.14);
      light += uSunCol*vec3(0.62, 0.4, 0.22)*(1.0 - smoothstep(1.0 - eg, 1.0 + eg, rgn))*sl*(1.0 - flr)*(1.0 - sandy)*(0.3 + 0.7*max(dot(N, uGlyphL), 0.0))*(1.0 - smoothstep(6.0, 9.0, dot(dg, uGlyphL)))*smoothstep(-6.5, -3.0, dot(dg, uGlyphL));   // (a blade raking down the face: it dies away above and below the panel)
    }
  }
  #endif
  light += uSkyCol * mix(0.25 + 0.75*up*up, 0.2, ss) * (0.35 + 0.65*ao);
  vec3 bounceTint = mix(vec3(0.36, 0.16, 0.22), uBounceCol, smoothstep(0.25, 0.78, ao));
  bounceTint = mix(bounceTint, uBounceCol*vec3(1.0, 0.62, 0.5), (1.0 - smoothstep(0.35, 0.85, ao))*0.5);
  bounceTint = mix(bounceTint, uBounceCol*vec3(1.0, 0.9, 0.75), ss);
  light += bounceTint * mix(0.3*(1.0 - 0.55*up*up) + 1.0*pow(max(down, 0.0), 1.35), 0.6, ss) * (0.3 + 0.7*ao) * mix(1.12, 0.82, smoothstep(0.0, 60.0, vP.y)) * relief * mix(1.06, 1.0, sl);
  // rock that looks straight down at lit sand (the underside of the span, of an overhang, of a bed) glows orange with it
  light += uGlowCol*mix(0.9, 0.7, sl) * down*down*down * (1.0 - ss) * (0.3 + 0.7*ao) * relief;
  // sand in the open shade (the Arch's shadow on its sill) keeps a warm violet, never grey
  light += uBounceCol*vec3(1.0, 0.6, 0.72)*0.16*(1.0 - vis)*sandy*(1.0 - sl);
  // grazing warm scatter so shaded faces keep a glow at their edges
  vec3 V = normalize(uCam - vP);
  float fr = pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 3.0);
  light += uBounceCol * fr * 0.22 * ao * (1.0 - ss);
  // inside the slot (z > 200) the bounce light breathes as dust drifts through the beams that feed it
  float slot = smoothstep(203.0, 216.0, vP.z) * uShimmer;
  if (slot > 0.0) {
    float dn = vn3(vec3(vP.x*0.11, vP.y*0.09 - uTime*0.22, vP.z*0.11 + uTime*0.45))*0.62
             + vn3(vec3(vP.x*0.31 + uTime*0.2, vP.y*0.25 - uTime*0.5, vP.z*0.31))*0.38;
    light *= 1.0 + slot*(dn - 0.5)*1.7;
  }
  vec3 Lp = uPortalPos - vP; float dp = length(Lp);
  vec3 col = alb * light;
  #ifdef CANYON
  {                                                                  // the deepest folds go violet-plum, never black-red
    // (a darkening tint, never brighter than the rock it stands in for)
    // (open shade is the rock's own colour turned toward deep red and held as dark as the plum it used to be; only where the
    // light is lowest, in the hollows of the flutes, does it go over into plum and near-black)
    float fold = sl * (1.0 - smoothstep(0.14, 0.32, ao)) * (1.0 - sandy);
    float deep = 1.0 - smoothstep(0.15, 0.26, ao);
    float lum = dot(col, vec3(0.3, 0.55, 0.15));
    // (it follows the rock's own light and dark up to twice its base value: a fold keeps its beds, it is never one flat tone)
    float kl = clamp(lum/0.05, 0.4, 2.0);
    vec3 redSh = col*vec3(1.0, 0.6, 0.5) + uDeep*0.02;
    redSh *= 0.031*kl/max(dot(redSh, vec3(0.3, 0.55, 0.15)), 1e-4);
    vec3 plumSh = mix(uPlum*vec3(1.0, 0.95, 1.45), uDark*1.9, 0.25)*kl;
    col = mix(col, mix(redSh, plumSh, deep), fold*0.85);
    // (the small hollows grade the same way, in little: the shade under a ledge and in the roof of a scoop is red, then violet-plum,
    // cool against the edge that catches the light, which is gold)
    float hk = clamp(nHol, 0.0, 1.0), ck = clamp(nCrest, 0.0, 1.0)*smoothstep(0.2, 0.6, ao);
    col *= mix(vec3(1.0), vec3(0.86, 0.6, 0.86), hk*(1.0 - fold))*mix(vec3(1.0), vec3(1.1, 1.02, 0.86), ck);
    // .. and so does the underside of an overhang, where no pool lights it from below
    float under = sl*(1.0 - sandy)*smoothstep(0.3, 0.72, -Ng.y)*(1.0 - smoothstep(0.2, 0.42, ao))*(1.0 - fold);
    col = mix(col, vec3(0.3, 0.13, 0.3)*(lum/0.19), 0.32*under);
    // THE WARM GLOW ROUND EACH POOL OF SUN: where a beam meets the sand, the sand and the rock within some metres of the pool
    // take warm light from it, by the pool's place: the hero beam's, each pillar's and blade's, the first slot's lesser shaft's,
    // the hall's three, the court's patch. The glow lies where the pool's light falls and does not move or change (what
    // drifts in it is the dust: the world's own motes). Light ADDED to what the rock already shows, in the rock's own colour (so every bed
    // and ledge is still drawn in it, the ledges' undersides turned to the pool the brightest); no shade is changed by it, and
    // where the deepest folds stand in their own shade (fold) it adds nothing at all.
    if (sl > 0.0) {
      float pg = 0.0, sk = max(flr, sandy);
      vec2 dhc = vP.xz - uHallC.xz;
      float hwn = 1.0 - smoothstep(0.7, 1.0, dot(dhc, dhc)/max(uHallC.w*uHallC.w, 1.0));
      // (its cost, cured by place: the build marks every triangle that no pool's glow can reach, and such a triangle walks no
      // pool at all; a triangle in reach first notes which pools this point lies in reach of, a subtraction and a comparison
      // for each, and then works out the glow of those alone, in the list's own order: the same sums as walking them all)
      int nG = vFar.x > 0.0 ? 0 : 12, nc = 0;
      ivec3 ca = ivec3(0), cb2 = ivec3(0);
      for (int i = 0; i < nG; i++) {
        vec3 d = vP - uGlowP[i].xyz;
        if (dot(d, d) < uGlowP[i].w) {
          if (nc == 0) ca.x = i; else if (nc == 1) ca.y = i; else if (nc == 2) ca.z = i; else if (nc == 3) cb2.x = i; else if (nc == 4) cb2.y = i; else if (nc == 5) cb2.z = i;
          nc++;
        }
      }
      if (nc > 6) nc = 6;
      for (int j = 0; j < nc; j++) {
        int i = j == 0 ? ca.x : j == 1 ? ca.y : j == 2 ? ca.z : j == 3 ? cb2.x : j == 4 ? cb2.y : cb2.z;
        vec3 d = vP - uGlowP[i].xyz;
        float g = poolGlow(d, uGlowE[i], N, sk)*uGlowS[i];
        if (i >= 8 && i <= 10) g *= hwn;                                 // (the hall's three, inside the hall's own round)
        if (i == 11) g *= 1.0 - 0.8*courtB;                              // (the court's patch)
        pg += g;
      }
      col += alb*uSunCol*vec3(1.2, 0.6, 0.24)*pg*sl*(1.0 - 0.8*heroB)*(1.0 - fold);
    }
  }
  #endif
  col += (alb*0.45 + 0.2) * uPortalCol * uPortalGlow * (0.3 + 0.7*max(dot(N, Lp/max(dp, 1e-3)), 0.0)) * 1000.0/(dp*dp + 500.0);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Pt=`
uniform float uTime;
uniform vec2 uWind;
vec3 fallPos(vec3 o, float v, float L, float seed){
  vec3 p = o;
  p.y -= v*L;
  float gust = 0.6 + 0.4*sin(uTime*0.35 + seed*6.0) + 0.25*sin(uTime*0.9 + v*5.0 + seed*3.0);
  p.xz += uWind * (v*v) * L * 0.19 * gust * (1.0 + floor(seed)*0.55);
  p.z += sqrt(v) * 1.6 * min(L/40.0, 1.0);                   // thrown clear of the lip
  p.x += sin(v*7.0 - uTime*1.1 + seed*10.0) * 0.4 * v * min(L/40.0, 1.0);
  return p;
}`,Vo=`
#include <common>
#include <fog_pars_vertex>
attribute vec2 aUV;
attribute vec4 aStrip;           // angle about Y, seed, half width at the foot, length
${Pt}
varying vec2 vUV; varying vec2 vInfo;
void main(){
  float v = aUV.y, L = aStrip.w;
  vec3 p = fallPos(position, v, L, aStrip.y);
  float w = mix(0.3, 1.0, pow(v, 0.55)) * aStrip.z;
  p.xz += vec2(cos(aStrip.x), sin(aStrip.x)) * aUV.x * w;
  vUV = aUV; vInfo = vec2(aStrip.y, L);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ro=`
#include <common>
#include <fog_pars_fragment>
uniform float uTime, uSurge, uFall;
uniform vec3 uSandLit, uSandShade;
varying vec2 vUV; varying vec2 vInfo;
${kt}
void main(){
  float u = vUV.x, v = vUV.y, seed = vInfo.x;
  float big = step(30.0, vInfo.y);
  float q = sqrt(v + 0.012) * uFall * sqrt(vInfo.y/55.0) - uTime;        // constant on a falling parcel
  float s1 = vn2(vec2(u*2.6 + seed*17.0, q*0.8));
  float s2 = vn2(vec2(u*9.0 + seed*31.0, q*2.1 + 4.0));
  float s3 = vn2(vec2(u*31.0 + seed*7.0, q*4.6));
  float dens = s1*0.5 + s2*0.32 + s3*0.18;
  float pulse = 0.6 + 0.4*smoothstep(0.25, 0.75, vn2(vec2(seed*3.0, q*0.4)));
  float edge = pow(max(1.0 - u*u, 0.0), 1.3);
  float a = edge * smoothstep(0.3, 0.85, dens*(0.6 + 0.9*edge)) * pulse * 1.35;
  float sv = (v - (uSurge*1.25 - 0.2))/0.17;
  a *= 1.0 + big*uSurge*2.2*exp(-sv*sv) * edge;
  a *= smoothstep(0.0, 0.035, v) * (1.0 - smoothstep(mix(0.72, 0.7, big), 1.0, v)) * mix(1.0, 0.6, v);
  // (the thin trickles on the legs fall through the Arch's own shade: faint threads of dim sand, not bright sticks)
  a = clamp(a, 0.0, 0.9) * mix(0.3, 0.92, big) / (1.0 + floor(seed)*0.7);
  vec3 col = mix(uSandLit, uSandShade, smoothstep(0.35, 1.0, a)*0.8);
  col *= (0.8 + 0.5*s2) * mix(0.6, 1.0, big);
  col += uSandLit * pow(s3, 5.0) * 0.9 * big;                            // glints
  if (a < 0.004) discard;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,Lo=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aSeed;
uniform vec3 uOrigin; uniform float uLen, uHalfW, uFall, uPx;
${Pt}
varying float vA;
void main(){
  float ph = fract(uTime/(uFall*1.05) + aSeed.x);
  float v = ph*ph;
  vec3 p = fallPos(uOrigin, v, uLen, 0.0);
  float w = mix(0.3, 1.0, pow(v, 0.55)) * uHalfW;
  float ang = aSeed.y*6.2832, rad = sqrt(aSeed.z)*w*1.2;
  p.xz += vec2(cos(ang), sin(ang)*0.6)*rad;
  p.xz += normalize(uWind + 1e-4) * aSeed.w*aSeed.w * v * 7.0 * length(uWind);   // the wind's fringe
  vA = smoothstep(0.0, 0.05, v) * (1.0 - smoothstep(0.86, 1.0, v)) * (0.45 + 0.55*aSeed.w);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float px = uPx * (0.5 + aSeed.z) / max(-mvPosition.z, 1.0);
  vA *= clamp(px, 0.25, 1.0);
  gl_PointSize = clamp(px, 1.0, 3.0);
  #include <fog_vertex>
}`,Do=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSandLit;
varying float vA;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float a = vA * (1.0 - smoothstep(0.15, 0.5, length(d)));
  gl_FragColor = vec4(uSandLit*1.25, a);
  #include <fog_fragment>
}`,Oo=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aSeed;
uniform vec3 uOrigin; uniform float uLen, uBoost, uCrest;
${Pt}
varying vec2 vQ; varying float vA; varying float vS;
void main(){
  float life = mix(5.0, 9.0, aSeed.w);
  float ph = fract(uTime/life + aSeed.x);
  float v0 = aSeed.y;
  float base = step(0.93, v0);
  vec3 c = fallPos(uOrigin, min(v0, 0.985), uLen, 0.0);
  vec2 wd = normalize(uWind + 1e-4); float ws = length(uWind);
  c.xz += wd * ph * mix(12.0, 24.0, aSeed.z) * ws + (vec2(aSeed.z, fract(aSeed.w*7.3)) - 0.5) * mix(2.5, 6.0, base);
  c.y += mix(-ph*7.0, 0.6 + ph*(2.0 - ph)*mix(3.0, 9.0, fract(aSeed.z*5.1)), base);
  float size = mix(1.0, mix(3.0, 8.5, aSeed.w), sqrt(ph));
  vA = pow(sin(ph*3.14159), 1.3) * mix(0.04, 0.06, base) * (1.0 + base*uBoost*1.6);
  if (v0 > 1.5) {                                          // spindrift blowing off the top of the span
    float xs = (aSeed.z*2.0 - 1.0) * 46.0;
    c = vec3(xs, uCrest - smoothstep(26.0, 50.0, abs(xs))*10.0, (fract(aSeed.w*13.7) - 0.5)*8.0);
    c.xz += wd * ph * mix(10.0, 22.0, fract(aSeed.x*7.7)) * ws;
    c.y += ph*4.0 - ph*ph*7.0;
    size = mix(1.0, mix(2.5, 6.0, aSeed.w), sqrt(ph));
    vA = pow(sin(ph*3.14159), 1.3) * 0.055;
  }
  vQ = position.xy; vS = aSeed.x*37.0;
  vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
  mvPosition.xy += position.xy * size;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_o=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uDustCol;
varying vec2 vQ; varying float vA; varying float vS;
${kt}
void main(){
  float r = length(vQ);
  float a = 1.0 - smoothstep(0.0, 1.0, r); a *= a;
  a *= 0.55 + 0.75*vn2(vQ*1.7 + vS);
  a *= vA;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uDustCol, a);
  #include <fog_fragment>
}`,Wo=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aSeed;            // phase, speed, x radius, height
attribute float aWing;
uniform float uTime; uniform vec3 uCenter;
varying float vShade;
vec3 orbit(float th, vec4 s){
  float ry = 2.0 + 3.0*fract(s.x*9.7);
  return uCenter + vec3(cos(th)*s.z, s.w + sin(th*2.0 + s.x*20.0)*ry, sin(th)*mix(26.0, 46.0, fract(s.x*3.3)) + 4.0);
}
void main(){
  float dirn = aSeed.y > 0.0 ? 1.0 : -1.0;
  float th = uTime*aSeed.y + aSeed.x*6.2832 + 0.35*sin(uTime*0.23 + aSeed.x*40.0);
  vec3 c = orbit(th, aSeed);
  vec3 fwd = normalize(orbit(th + 0.02*dirn, aSeed) - c);
  vec3 fw2 = normalize(orbit(th + 0.10*dirn, aSeed) - c);
  vec3 right = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  float bank = clamp(dot(fw2 - fwd, right)*9.0, -1.1, 1.1);
  vec3 upv = normalize(cross(right, fwd));
  vec3 r2 = right*cos(bank) + upv*sin(bank);
  vec3 u2 = upv*cos(bank) - right*sin(bank);
  float gate = smoothstep(-0.2, 0.3, sin(uTime*1.7 + aSeed.x*50.0));                // flicker, then glide
  float flap = sin(uTime*34.0 + aSeed.x*100.0) * 0.55 * gate - 0.12*(1.0 - gate);
  vec3 l = position * 0.55;
  l.y += aWing * abs(l.x) * flap;
  vec3 p = c + r2*l.x + u2*l.y + fwd*l.z;
  vShade = 0.5 + 0.5*u2.y;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Io=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uBody;
varying float vShade;
void main(){
  gl_FragColor = vec4(uBody * (0.6 + 0.8*vShade), 1.0);
  #include <fog_fragment>
}`;async function Ko(L,g){const a=L.attributes.position.array,w=L.index.array,b=a.length,u=new Float32Array(b);for(let k=0,B=w.length;k<B;k+=3){const P=w[k]*3,z=w[k+1]*3,M=w[k+2]*3,Z=a[z],$=a[z+1],Q=a[z+2],y=a[M]-Z,F=a[M+1]-$,O=a[M+2]-Q,K=a[P]-Z,we=a[P+1]-$,ie=a[P+2]-Q,ee=F*ie-O*we,be=O*K-y*ie,xe=y*we-F*K,Ue=u[P]+ee,Ye=u[P+1]+be,He=u[P+2]+xe,ge=u[z]+ee,de=u[z+1]+be,N=u[z+2]+xe,E=u[M]+ee,Fe=u[M+1]+be,te=u[M+2]+xe;u[P]=Ue,u[P+1]=Ye,u[P+2]=He,u[z]=ge,u[z+1]=de,u[z+2]=N,u[M]=E,u[M+1]=Fe,u[M+2]=te,k%3e3===2997&&await g.yield()}for(let k=0;k<b;k+=3){const B=u[k],P=u[k+1],z=u[k+2],M=1/(Math.sqrt(B*B+P*P+z*z)||1);u[k]=B*M,u[k+1]=P*M,u[k+2]=z*M,k%6e3===5997&&await g.yield()}await g.yield(),L.setAttribute("normal",new o.BufferAttribute(u,3)),await g.yield()}async function jo(L,g){const a=L.attributes.position.array,w=L.attributes.position.count*3;let b=1/0,u=1/0,k=1/0,B=-1/0,P=-1/0,z=-1/0;for(let y=0;y<w;y+=3){const F=a[y],O=a[y+1],K=a[y+2];b=Math.min(b,F),u=Math.min(u,O),k=Math.min(k,K),B=Math.max(B,F),P=Math.max(P,O),z=Math.max(z,K),y%1500===1497&&await g.yield()}await g.yield();const M=(b+B)*.5,Z=(u+P)*.5,$=(k+z)*.5;let Q=0;for(let y=0;y<w;y+=3){const F=M-a[y],O=Z-a[y+1],K=$-a[y+2];Q=Math.max(Q,F*F+O*O+K*K),y%1500===1497&&await g.yield()}L.boundingSphere=new o.Sphere(new o.Vector3(M,Z,$),Math.sqrt(Q)),await g.yield()}async function Yo(L,g={}){const a=L.rng,w=L.noise,b=g.yield||(()=>L.yield()),u={yield:b},k=(g.palette&&g.palette.length>=7?g.palette:Fo).map(e=>new o.Color(e)),[B,P,z,M,Z,$,Q]=k,y=32,F=48,O=.85,K=a.range(3,3.7),we=a.range(2.35,2.8),ie=y+a.range(27,33),ee=y+a.range(19,24),be=a.range(-1.5,3),xe=a.range(2,6),Ue=a.range(-5,-1),Ye=a.range(7,8.4),He=a.range(12,14.5),ge=a.range(2,2.8),de=a.range(0,40),N=a.range(0,100),E=a.range(0,100),Fe=a.range(-.45,.45),te=g.wind?new o.Vector2(g.wind[0],g.wind[1]):new o.Vector2(-Math.cos(Fe),Math.sin(Fe)).multiplyScalar(a.range(.8,1.1)),T=new o.Vector3().fromArray(g.sunDir||[-.36,.86,-.36]).normalize(),G=[],St=[],Ct=[],A=[];let fe=0;const ye=(e,t,n,s,i,l,r,d)=>(G.push(e,t,n),St.push(s,i,l),Ct.push(r,1,d),fe++),zt=(e,t,n,s,i)=>{const l=n?t:t-1;for(let r=s;r<i;r++)for(let d=0;d<l;d++){const h=e+r*t+d,c=e+r*t+(d+1)%t,v=h+t,x=c+t;A.push(h,c,x,h,x,v)}},At=(e,t,n,s)=>{const i=A.length;zt(e,n,s,0,t-1),po(i,e,t,n)},Mt=async(e,t,n,s,i)=>{const l=A.length;for(let h=0;h<t-1;h+=i)zt(e,n,s,h,Math.min(t-1,h+i)),await b();const r=Bt(e,t,n);await b();let d=0;for(let h=l;h<A.length;h+=6e3)d=Nt(h,Math.min(A.length,h+6e3),r[0],r[1],r[2],d),await b();if(d<0)for(let h=l;h<A.length;h+=3){const c=A[h+1];A[h+1]=A[h+2],A[h+2]=c}await b()},Bt=(e,t,n)=>{let s=0,i=0,l=0;const r=t*n;for(let d=e;d<e+r;d++)s+=G[d*3],i+=G[d*3+1],l+=G[d*3+2];return[s/r,i/r,l/r]},po=(e,t,n,s)=>{const i=Bt(t,n,s);if(Nt(e,A.length,i[0],i[1],i[2],0)<0)for(let r=e;r<A.length;r+=3){const d=A[r+1];A[r+1]=A[r+2],A[r+2]=d}},Nt=(e,t,n,s,i,l)=>{for(let r=e;r<t;r+=3){const d=A[r]*3,h=A[r+1]*3,c=A[r+2]*3,v=G[d]-n,x=G[d+1]-s,f=G[d+2]-i,m=G[h]-n,S=G[h+1]-s,q=G[h+2]-i,V=G[c]-n,R=G[c+1]-s,j=G[c+2]-i;l+=v*(S*j-q*R)+x*(q*V-m*j)+f*(m*R-S*V)}return l},mo=e=>{const t=Math.sin(e*127.1+de*3.3)*43758.5453;return t-Math.floor(t)};let ce=.5;const Ee=(e,t,n,s)=>{const i=w.fbm3(e*.016+N,t*.016+E,n*.016,2)*2.8,l=t+w.n3(e*.028+N,t*.028,n*.028+E)*2.5+.05*e+de,r=l/ge,d=Math.floor(r),h=r-d,c=mo(d),v=p(0,.14,h)*(1-p(.55,.75,h)),x=p(.02,.4,w.n2(l*.075+E,N*.37)),f=w.n2(l*.105+N,2.3)*1.5+w.n3(e*.045+E,t*.045,n*.045+N)*1.3,m=((v*(.3+.95*c)-.45)*I(.14,.95,x)+f)*s,S=1-Math.abs(w.n3(e*.055+E,t*.04,n*.055+N)),q=-S*S*S*1.7,V=w.n3(e*.22,t*.22,n*.22)*.3;return ce=Te(.66+(m-f*s)*.5+f*s*.1+q*.22+i*.04,0,1),i+m+q+V},Xe=e=>{const t=Math.sin(e);return[-y*Math.cos(e),t>=0?F*Math.pow(t,O):F*t]},qt=e=>F+12-be*Te(e/y,-1.6,1.6)*p(4,20,Math.abs(e))+(e<0?xe:Ue)*p(14,34,Math.abs(e))+1.6*w.n2(e*.06+N,5.5)*p(5,18,Math.abs(e)),uo=(e,t)=>{const n=e<0?K:we;return Math.pow(Math.abs(e)/(e<0?ie:ee),n)+Math.pow(Math.max(t,0)/qt(e),n)},Tt=e=>{const t=Math.min(1,Math.pow(Math.max(e,0)/F,1/O));return I(He,Ye,p(0,.9,t))*(1+.35*(1-p(0,18,e)))},vo=e=>2.2*w.n2(e*.9+E,7.7),Ge=-16,Je=272,Ze=76,wo=-.13,bo=Math.PI+.13,xo=fe;let Ht=null,Ft=-1e9,ke=0,Et=null,Gt=-1e9;const $e=[];for(let e=0;e<=Je;e++){const t=I(wo,bo,e/Je),n=Math.sin(t),[s,i]=Xe(t),[l,r]=Xe(t-.004),[d,h]=Xe(t+.004);let c=d-l,v=h-r;const x=Math.hypot(c,v)||1;c/=x,v/=x;const f=-v,m=c;let S=2,q=90;for(let _=0;_<22;_++){const re=(S+q)*.5;uo(s+f*re,i+m*re)<1?S=re:q=re}let V=Math.max(11,S*(1+.08*w.n2(t*2.2+N,3.1)));i<0&&(V*=1.06);const R=V*.5,j=Tt(i)*(1+.06*w.n2(t*3.1+E,1.7)),se=s+f*R,X=i+m*R,ne=vo(t),le=I(3.3,2.6,p(.2,.95,Math.max(n,0)));for(let _=0;_<Ze;_++){const re=_/Ze*Math.PI*2,vt=Math.cos(re),Ke=Math.sin(re),wt=Ke<0?j*.93:j,lo=1/Math.pow(Math.pow(Math.abs(vt)/R,le)+Math.pow(Math.abs(Ke)/wt,le),1/le),bt=vt*lo,io=Ke*lo;let je=Math.sign(vt)*Math.pow(Math.abs(bt)/R,le-1)/R,xt=Math.sign(Ke)*Math.pow(Math.abs(io)/wt,le-1)/wt;const ro=Math.hypot(je,xt)||1;je/=ro,xt/=ro;const ho=f*je,he=m*je,qe=xt;let D=se+f*bt,H=X+m*bt,W=ne+io;const To=Math.hypot(ho,qe),fo=p(.3,.8,-he)*p(.3,.8,Math.max(n,0)),gt=Ee(D,H,W,To)*(1-.55*fo);if(D+=ho*gt,H+=he*gt,W+=qe*gt,he>.3){const ve=Math.exp(-Math.pow((D-Ge)/2.4,2))*p(-4,2,W-ne)*p(.3,.7,he);H-=4.6*ve}if(qe>.25&&he>-.2){const ve=Math.exp(-Math.pow((D-Ge)/2,2))*p(.25,.7,qe);W-=1.3*ve;const co=W*1+H*.35-Math.abs(D-Ge)*3-(he<.25?6:0);co>Ft&&(Ft=co,Ht=new o.Vector3(Ge,H,W))}if(Math.abs(D)<4&&H>ke&&(ke=H),he>.55&&D>20&&D<36&&W>ne){const ve=W+H*.2;ve>Gt&&(Gt=ve,Et=new o.Vector3(D,H,W))}qe>.85&&Math.abs(D)>37&&H>18&&H<44&&(e*7+_)%5===0&&$e.push([D,H,W]);const yt=.92+.16*w.n3(D*.03+E,H*.03,W*.03),Ho=I(ce*I(.5,1,p(-2,10,H)),Math.max(ce,.92),fo);ye(D,H,W,yt,yt*(.97+.05*w.n2(t*9,_*.2)),yt,Ho,0)}await b()}await b(),await Mt(xo,Je+1,Ze,!0,8);const U=Ht.clone().add(new o.Vector3(0,.3,.5)),Vt=a.range(88,96),Rt=a.range(38,44),Lt=a.range(32,35),Y=8,Ve=(e,t)=>1/Math.pow(Math.pow(Math.abs(e)/Vt,2.7)+Math.pow(Math.abs(t)/(t>0?Rt:Lt),2.7),.37037037037037035)*(1+.06*w.n2(e*1.6+N,t*1.6+E)+.03*w.n2(e*5+E,t*5+N)),Pe=-(y+(ie-y)*.5),Se=y+(ee-y)*.5,pe=new o.Vector2(U.x+te.x*6.3,U.z+1.6+te.y*6.3);let Qe=0;const et=(e,t,n)=>{let s=I(1,-2.2,p(.6,1,n));s+=3.4*Math.exp(-((e-Pe)**2+t*t*1.3)/500)+3*Math.exp(-((e-Se)**2+t*t*1.3)/420),s+=.9*w.fbm2(e*.02+N,t*.02+E,3);const i=s/.7,l=Math.floor(i);s=I(s,(l+p(.3,.7,i-l))*.7,.65);const r=p(.2,.62,w.fbm2(e*.035+E,t*.05+N,3)+.25*(1-p(0,30,Math.abs(e)))),d=Math.hypot(e-pe.x,t-pe.y),h=Math.exp(-d*d/30);return s+=.35*r+2.6*h+.6*Math.exp(-d*d/160),Qe=Te(r*.85+p(.05,.3,h+.3*Math.exp(-d*d/160)),0,1),s},me=(e,t)=>{const n=e,s=t-Y,i=Math.hypot(n,s)||.001;return et(e,t,Math.min(1,i/Ve(n/i,s/i)))},tt=240,Ce=34,ot=20,go=52,yo=fe;for(let e=0;e<=Ce+ot;e++){for(let t=0;t<tt;t++){const n=t/tt*Math.PI*2,s=Math.cos(n),i=Math.sin(n),l=Ve(s,i);if(e<=Ce){const r=Math.pow(e/Ce,.85),d=s*l*r,h=Y+i*l*r,c=et(d,h,r),v=Math.min(Math.hypot(d-Pe,h),Math.hypot(d-Se,h)),x=I(.55,1,p(10,30,v))*(.85+.15*Qe),f=.95+.14*w.n2(d*.05+N,h*.05);ye(d,c,h,f,f,f,x,Math.max(Qe*(1-p(.9,1,r)),.92*p(.8,.9,r)))}else{const r=(e-Ce)/ot,d=et(s*l,Y+i*l,1),h=Math.pow(p(.6,1,r),1.4),c=d-go*Math.pow(r,1.05);let v=l+1.4*Math.sqrt(r)+h*17;const x=s*v,f=Y+i*v;v+=(Ee(x,c,f,1)*1.35+1.2*w.n2(n*14+N,c*.03))*(1-h)*p(0,.12,r);const m=.9+.14*w.n3(x*.03,c*.03,f*.03+N);ye(s*v,c,Y+i*v,m,m,m,ce*I(1,.6,p(.3,1,r)),h*.9)}}await b()}await b(),await Mt(yo,Ce+ot+1,tt,!0,3);const Dt=async(e,t,n,s,i)=>{const d=fe,h=me(e,t)-2.5,c=a.range(0,6.28),v=a.range(.1,.3);for(let x=0;x<=30;x++){const f=x/30,m=h+(n+2.5)*f;let S=s*(1-.5*Math.pow(f,.8))*(1+.5*(1-p(0,.16,f)));i&&(S*=1-.3*p(.6,.74,f)*(1-p(.8,.85,f))+.1*p(.82,.87,f)),S*=Math.sqrt(Math.max(0,1-Math.pow(p(.9,1,f),2)));for(let q=0;q<18;q++){const V=q/18*Math.PI*2,R=Math.cos(V),j=Math.sin(V),se=1+v*Math.cos(2*(V-c));let X=e+R*S*se,ne=t+j*S/se;const le=Ee(X*1.7,m*1.3,ne*1.7,1)*.55*Math.min(1,S/2.5);X+=R*le,ne+=j*le;const _=.92+.14*w.n3(X*.06,m*.06,ne*.06);ye(X,m,ne,_,_,_,ce*I(.6,1,p(0,.2,f)),0)}x%3===2&&await b()}At(d,31,18,!0)},ko=(e,t,n,s)=>{const r=fe,d=a.range(.8,1.35),h=a.range(.55,.9),c=a.range(.8,1.3),v=a.range(0,50);for(let x=0;x<=6;x++){const f=(x/6-.5)*Math.PI,m=Math.cos(f),S=Math.sin(f);for(let q=0;q<9;q++){const V=q/9*Math.PI*2,R=m*Math.cos(V),j=m*Math.sin(V),se=s*(1+.32*w.n3(R*1.3+v,S*1.3,j*1.3+v)),X=.85+.2*w.n2(v,q*.4+x);ye(e+R*se*d,t+S*se*h,n+j*se*c,X,X*.96,X*.94,I(.5,1,S*.5+.5),0)}}At(r,7,9,!0)},Ot=a.chance(.6),_t=[],Wt=async(e,t)=>{const n=e*a.range(70,80),s=a.range(-12,4),i=t?a.range(22,30):a.range(10,15),l=t?a.range(4.2,5.4):a.range(3.4,4.4);await Dt(n,s,i,l,t),_t.push(new o.Vector3(n,i,s)),a.chance(.7)&&await Dt(n+e*a.range(-9,-6),s+a.range(6,10),i*a.range(.3,.45),l*.7,!1)};await Wt(-1,Ot),await b(),await Wt(1,!Ot),await b();const Po=a.int(30,40);for(let e=0;e<Po;e++){const t=a.sign(),n=t<0?Pe:Se,s=a.range(0,6.28),i=a.range(15,30);let l=n+Math.cos(s)*i*1.1+t*6,r=Math.sin(s)*i;Math.abs(l)<24&&(l=t*a.range(24,30));const d=Math.pow(a(),2.2)*2.8+.5,h=Math.hypot(l,r-Y)||1;h/Ve(l/h,(r-Y)/h)>.86||(ko(l,me(l,r)+d*.25,r,d),e%4===3&&await b())}await b();const oe=new o.BufferGeometry,Re=new Float32Array(G),at=new Float32Array(Ct);oe.setAttribute("position",new o.BufferAttribute(Re,3)),await b(),oe.setAttribute("color",new o.BufferAttribute(new Float32Array(St),3)),oe.setIndex(new o.BufferAttribute(new Uint32Array(A),1)),await b(),await Ko(oe,u);const st=oe.attributes.normal.array,It=new Float32Array(321),Kt=new Float32Array(101);for(let e=0;e<=320;e++)It[e]=qt(-80+e*.5);for(let e=0;e<=100;e++)Kt[e]=Tt(e*.5)*.92;const So=(e,t,n)=>{const s=Kt[Math.min(100,Math.max(0,t*2|0))]-Math.abs(n);if(s<-4)return s;const i=e<0?K:we,l=It[Math.min(320,Math.max(0,(e+80)*2|0))];let r=(.95-Math.pow(Math.abs(e)/(e<0?ie:ee),i)-Math.pow(Math.max(t,0)/l,i))*20;return Math.abs(e)<y&&(r=Math.min(r,t-F*Math.pow(1-e/y*(e/y),O*.5)-.8)),Math.min(r,s,t+6)},jt=-(ie+3),Ut=ee+3,Co=-6,zo=70,nt=He*1.4+3;for(let e=0;e<fe;e++){e%64===63&&await b();const t=st[e*3],n=st[e*3+1],s=st[e*3+2];if(t*T.x+n*T.y+s*T.z<-.05){at[e*3+1]=0;continue}const i=Re[e*3]+t*1.8,l=Re[e*3+1]+n*1.8,r=Re[e*3+2]+s*1.8;if(l<-8)continue;let d=1.5,h=150;if(Math.abs(T.x)>1e-5){const f=(jt-i)/T.x,m=(Ut-i)/T.x;d=Math.max(d,Math.min(f,m)),h=Math.min(h,Math.max(f,m))}else if(i<jt||i>Ut)continue;{const f=(Co-l)/T.y,m=(zo-l)/T.y;d=Math.max(d,Math.min(f,m)),h=Math.min(h,Math.max(f,m))}if(Math.abs(T.z)>1e-5){const f=(-nt-r)/T.z,m=(nt-r)/T.z;d=Math.max(d,Math.min(f,m)),h=Math.min(h,Math.max(f,m))}else if(Math.abs(r)>nt)continue;if(d>=h)continue;const c=Math.min(22,Math.ceil((h-d)/2.2)),v=(h-d)/c;let x=-9;for(let f=0;f<c&&x<2;f++){const m=d+(f+.5)*v,S=So(i+T.x*m,l+T.y*m,r+T.z*m);S>x&&(x=S)}at[e*3+1]=1-p(-1.6,1.6,x)}oe.setAttribute("aShade",new o.BufferAttribute(at,3)),await b(),await jo(oe,u);const ze=()=>o.UniformsUtils.clone(o.UniformsLib.fog),lt=new o.Color(g.sunColor||"#fff0d8").multiplyScalar(g.sunIntensity??2.3),Ao=(g.skyColor?new o.Color(g.skyColor):new o.Color("#3a6fd0").lerp(Q,.25)).multiplyScalar(g.skyIntensity??.65),Mo=P.clone().lerp(B,.75).multiplyScalar(2.2*(g.bounce??1)),Yt=B.clone().lerp(P,.2).multiply(lt).multiplyScalar(.56),Bo=P.clone().lerp(B,.4).multiplyScalar(.85),J=new o.Group;J.name="canyon-of-light:arch";const ae=new o.ShaderMaterial({uniforms:Object.assign(ze(),{uShimmer:{value:g.shimmer??0},uSun:{value:T.clone()},uSunCol:{value:lt},uSkyCol:{value:Ao},uBounceCol:{value:Mo},uCam:{value:new o.Vector3(0,30,200)},uPortalCol:{value:new o.Color(g.portalColor||k[6])},uPortalPos:{value:new o.Vector3(0,22,0)},uPortalGlow:{value:g.portalGlow??0},uCream:{value:B.clone()},uOrange:{value:P.clone().lerp(B,.3)},uRed:{value:z.clone().lerp(B,.24)},uDeep:{value:M.clone().lerp(z,.3)},uPlum:{value:Z.clone()},uDark:{value:$.clone()},uStrataPhase:{value:de},uBed:{value:ge},uTime:{value:0},uWind:{value:te},uBufH:{value:900},uPools:{value:Array.from({length:6},()=>new o.Vector4(0,0,.001,-1e4))},uBeamDir:{value:new o.Vector3(0,-1,0)},uHeroF:{value:Array.from({length:8},()=>new o.Vector3(0,-1e4,0))},uHeroE1:{value:Array.from({length:8},()=>new o.Vector4(1,0,0,.01))},uHeroE2:{value:Array.from({length:8},()=>new o.Vector4(0,0,1,.01))},uHeroK:{value:Array.from({length:8},()=>new o.Vector2(1,0))},uHeroA:{value:new o.Vector3(0,1,0)},uHallF:{value:Array.from({length:3},()=>new o.Vector3(0,-1e4,0))},uHallE1:{value:Array.from({length:3},()=>new o.Vector4(1,0,0,.01))},uHallE2:{value:Array.from({length:3},()=>new o.Vector4(0,0,1,.01))},uHallK:{value:Array.from({length:3},()=>new o.Vector2(1,0))},uHallC:{value:new o.Vector4(0,-1e4,0,1)},uGlowP:{value:Array.from({length:12},()=>new o.Vector4(0,-1e4,0,0))},uGlowE:{value:Array.from({length:12},()=>new o.Vector4(1,0,0,.01))},uGlowS:{value:new Array(12).fill(0)},uGlyphTex:{value:null},uGlyphU:{value:new o.Vector4(1,0,0,1)},uGlyphV:{value:new o.Vector4(0,1,0,1)},uGlyphN:{value:new o.Vector3(0,0,1)},uHoo:{value:Array.from({length:3},()=>new o.Vector4(0,-1e4,0,1))},uHooR:{value:Array.from({length:3},()=>new o.Vector3(.01,0,0))},uAmp:{value:new o.Vector4(0,0,0,0)},uGlyphC:{value:new o.Vector4(0,-1e4,0,1)},uGlyphL:{value:new o.Vector3(0,1,0)},uMouthD:{value:1e6},uCourtC:{value:new o.Vector4(0,-1e4,0,.7)},uCourtA:{value:new o.Vector4(1,0,.01,.01)},uCourtD:{value:new o.Vector3(0,1,0)},uCourtS:{value:new o.Vector4(0,0,1,0)},uCourtT:{value:new o.Vector3(0,0,0)},uGlowCol:{value:new o.Color("#ff9d4d").lerp(new o.Color("#f7e3c0"),.75).multiplyScalar(2.2).multiply(new o.Color(1.05,.7,.4))}}),vertexShader:Eo,fragmentShader:Go,fog:!0}),Xt=new o.Mesh(oe,ae);Xt.name="arch-rock",J.add(Xt),await b();const Jt=me(pe.x,pe.y)-.4,ue=U.y-Jt,Zt=[],$t=[],Qt=[],eo=[];let to=0;const Le=(e,t,n,s,i,l,r)=>{const d=to;for(let h=0;h<=r;h++)for(let c=0;c<=l;c++)Zt.push(e.x,e.y,e.z),$t.push(c/l*2-1,h/r),Qt.push(t,n,s,i),to++;for(let h=0;h<r;h++)for(let c=0;c<l;c++){const v=d+h*(l+1)+c;eo.push(v,v+1,v+l+2,v,v+l+2,v+l+1)}},Ae=a.range(2.5,3.1);Le(U,0,a(),Ae,ue,6,48),Le(U,1.05,a(),Ae*.8,ue,4,48),Le(U,-1.05,a(),Ae*.8,ue,4,48);for(let e=1;e<=4;e++)Le(U,a.range(-.35,.35),e+a(),Ae*a.range(.55,.8),ue,3,40);const it=[];for(let e=0,t=0;e<4&&t<60&&$e.length;t++){const n=a.pick($e);if(it.some(d=>Math.abs(d.x-n[0])<7))continue;const s=new o.Vector3(n[0],n[1],n[2]+.5),i=Math.min(a.range(10,22),n[1]-3),l=a.range(.35,.6),r=a();it.push(s),e++}const Me=new o.BufferGeometry;Me.setAttribute("position",new o.Float32BufferAttribute(Zt,3)),Me.setAttribute("aUV",new o.Float32BufferAttribute($t,2)),Me.setAttribute("aStrip",new o.Float32BufferAttribute(Qt,4)),Me.setIndex(eo),await b();const oo=4.2,rt=new o.ShaderMaterial({uniforms:Object.assign(ze(),{uTime:{value:0},uWind:{value:te},uSurge:{value:0},uFall:{value:oo},uSandLit:{value:Yt},uSandShade:{value:Bo}}),vertexShader:Vo,fragmentShader:Ro,fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide}),De=new o.Mesh(Me,rt);De.frustumCulled=!1,De.renderOrder=2,De.name="sandfall-veil",J.add(De),await b();const ht=2600,ao=new Float32Array(ht*4);for(let e=0;e<ht*4;e++)ao[e]=a();const dt=new o.BufferGeometry;dt.setAttribute("position",new o.BufferAttribute(new Float32Array(ht*3),3)),dt.setAttribute("aSeed",new o.BufferAttribute(ao,4));const ft=new o.ShaderMaterial({uniforms:Object.assign(ze(),{uTime:{value:0},uWind:{value:te},uOrigin:{value:U},uLen:{value:ue},uHalfW:{value:Ae},uFall:{value:oo},uPx:{value:170},uSandLit:{value:Yt}}),vertexShader:Lo,fragmentShader:Do,fog:!0,transparent:!0,depthWrite:!1}),Oe=new o.Points(dt,ft);Oe.frustumCulled=!1,Oe.renderOrder=3,Oe.name="sandfall-grains",J.add(Oe),await b();const ct=300,Be=new Float32Array(ct*4);for(let e=0;e<ct;e++)Be[e*4]=a(),Be[e*4+1]=e<70?2:a.chance(.5)?a.range(.95,1):a.range(.3,.9),Be[e*4+2]=a(),Be[e*4+3]=a();const Ne=new o.InstancedBufferGeometry;Ne.setAttribute("position",new o.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),Ne.setIndex([0,1,2,0,2,3]),Ne.setAttribute("aSeed",new o.InstancedBufferAttribute(Be,4)),Ne.instanceCount=ct;const pt=new o.ShaderMaterial({uniforms:Object.assign(ze(),{uTime:{value:0},uWind:{value:te},uOrigin:{value:U},uLen:{value:ue},uBoost:{value:0},uCrest:{value:ke+.5},uDustCol:{value:B.clone().lerp(P,.15).multiply(lt).multiplyScalar(.36)}}),vertexShader:Oo,fragmentShader:_o,fog:!0,transparent:!0,depthWrite:!1}),_e=new o.Mesh(Ne,pt);_e.frustumCulled=!1,_e.renderOrder=4,_e.name="sandfall-dust",J.add(_e),await b();const We=g.swifts??16;let Ie=null;if(We>0){const e=[0,0,.42,-.06,0,-.3,.06,0,-.3,-.06,0,-.3,-.1,0,-.55,0,0,-.32,.06,0,-.3,0,0,-.32,.1,0,-.55],t=[0,0,0,0,0,0,0,0,0];for(const l of[-1,1])e.push(l*.03,0,.2,l*.03,0,-.06,l*.45,0,.03,l*.45,0,.03,l*.03,0,-.06,l*.4,0,-.1,l*.45,0,.03,l*.4,0,-.1,l*.86,0,-.4),t.push(0,0,.6,.6,0,.6,.6,.6,1);const n=new Float32Array(We*4);for(let l=0;l<We;l++)n[l*4]=a(),n[l*4+1]=a.sign()*a.range(.34,.6),n[l*4+2]=a.range(13,21),n[l*4+3]=a.range(-8,4);const s=new o.InstancedBufferGeometry;s.setAttribute("position",new o.Float32BufferAttribute(e,3)),s.setAttribute("aWing",new o.Float32BufferAttribute(t,1)),s.setAttribute("aSeed",new o.InstancedBufferAttribute(n,4)),s.instanceCount=We,Ie=new o.ShaderMaterial({uniforms:Object.assign(ze(),{uTime:{value:0},uCenter:{value:new o.Vector3(0,24,0)},uBody:{value:$.clone().lerp(Z,.3).multiplyScalar(.6)}}),vertexShader:Wo,fragmentShader:Io,fog:!0,side:o.DoubleSide});const i=new o.Mesh(s,Ie);i.frustumCulled=!1,i.name="swifts",J.add(i)}await b();const C=(e,t,n)=>new o.Vector3(e,t,n),so=C(0,26,0),No={portalSeat:{position:C(0,22,0),normal:C(0,0,1),radius:10},flyThrough:[C(0,22,200),C(0,22,140),C(0,22,80),C(0,22,30),C(0,22,0),C(0,22,-40)],viewpoints:{slotMouth:C(0,22,200),burstOut:C(0,24,150),lowLeft:C(-70,8,95),underSpan:C(14,6,26),behind:C(40,30,-120)},lookAt:so.clone(),sandfallTop:U.clone(),sandfallBase:C(pe.x,Jt+.4,pe.y),trickles:it,apex:C(0,ke,0),leftFoot:C(Pe,me(Pe,20),20),rightFoot:C(Se,me(Se,20),20),ravenPerch:{position:(Et||C(30,50,6)).clone(),normal:C(0,1,0)},swiftCenter:C(0,24,0),spires:_t,sunDir:T.clone(),rimEdgeZ:Y-Lt,blockHalfWidth:Vt,blockFrontZ:Y+Rt};let mt=null;const ut=new o.Vector3,qo=new o.Vector2,no=[ae,rt,ft,pt];return Ie&&no.push(Ie),{object:J,radius:62,height:Math.ceil(ke+1),center:so,anchors:No,ground:!0,groundY:-50,rockMaterial:ae,palette:k,strata:{bed:ge,phase:de},sculpt:{cav:.5,at(e,t,n,s=1){const i=Ee(e,t,n,s);return this.cav=ce,i}},groundAt:me,blockE(e,t){const n=e,s=t-Y,i=Math.hypot(n,s)||.001;return i/Ve(n/i,s/i)},update(e,t,n){for(const l of no)l.uniforms.uTime.value=t;let s,i;if(mt===null?(s=t%20/14,i=p(.6,.85,s)*(1-p(1.05,1.4,s))):(s=Te((mt-.25)/.55,0,1),i=p(.6,.9,s)),rt.uniforms.uSurge.value=s,pt.uniforms.uBoost.value=i,L.renderer){const l=L.renderer.getDrawingBufferSize(qo).y;ft.uniforms.uPx.value=l*.38,ae.uniforms.uBufH.value=l}n&&(J.updateWorldMatrix(!0,!1),ae.uniforms.uCam.value.copy(J.worldToLocal(ut.setFromMatrixPosition(n.matrixWorld))))},setProgress(e){mt=e==null?null:Te(e,0,1)},setPortalGlow(e,t=1){e!=null&&ae.uniforms.uPortalCol.value.set(e),ae.uniforms.uPortalGlow.value=t},setSun(e){const t=Array.isArray(e)?ut.fromArray(e):ut.copy(e);ae.uniforms.uSun.value.copy(t).normalize()},dispose(){}}}export{jo as boundingSphereInSteps,Yo as buildHero,Ko as computeNormalsInSteps};
