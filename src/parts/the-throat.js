import*as e from"three";const L=1e-4,me=14,n=256,C=64,ye=10;async function Ge(R,d){const k=n/2,h=128,D=400,v=new Float64Array(n*C),w=new Float64Array(n),t=(a,c)=>{if(c<=0)return 0;const u=Math.max(1-a*a,1e-12),i=Math.asinh(c/Math.sqrt(u)),s=i/h;let x=0;for(let r=0;r<h;r++){const l=Math.exp((r+.5)*s),p=.5*(l-1/l);x+=1/Math.sqrt(u*p*p+1)}return a*x*s},V=(a,c)=>{const u=Math.sqrt(Math.max(a*a-1,1e-12));if(c<=u)return 0;const i=Math.acosh(c/u),s=i/h,x=u*u;let r=0;for(let l=0;l<h;l++){const p=Math.exp((l+.5)*s),F=.5*(p+1/p);r+=1/Math.sqrt(x*F*F+1)}return a*r*s};for(let a=0;a<n;a++){const c=a<k,u=(c?a:a-k)/(k-1),i=c?Math.pow(L,u):L*Math.pow(me/L,u),s=c?1-i:1+i;w[a]=s;const x=(c?t(s,D):V(s,D))+s/D;for(let r=0;r<C;r++){const l=r/(C-1)*d,p=Math.sqrt(l*l+1);c?v[r*n+a]=x+t(s,l):v[r*n+a]=s<p?x+V(s,l):-1}a%6===5&&await R.yield()}const T=new Uint16Array(n*C*4),A=e.DataUtils.toHalfFloat,U=3*Math.PI;for(let a=0;a<C;a++){const c=a/(C-1)*d,u=Math.sqrt(c*c+1);for(let i=0;i<n;i++){const s=i<k,x=s?0:k,r=s?k-1:n-1,l=a*n+i,p=w[i];let F=0,H=1;if(v[l]>=0){let z=Math.max(x,i-1),g=Math.min(r,i+1);for(;g>i&&v[a*n+g]<0;)g--;const K=w[g]-w[z],$=K!==0?Math.abs((v[a*n+g]-v[a*n+z])/K):1;H=Math.min(400,$*Math.sqrt(Math.max(u*u-p*p,0))),F=Math.min(s?v[l]:Math.max(v[l]-(Math.PI-Math.asin(Math.min(1,p/u))),0),U),s||(H=Math.max(H,0))}const W=Math.floor(F*8)/8;T[l*4]=A(W),T[l*4+1]=A(H),T[l*4+2]=A(F-W),T[l*4+3]=A(1)}a%16===15&&await R.yield()}const S=new e.DataTexture(T,n,C,e.RGBAFormat,e.HalfFloatType);return S.minFilter=S.magFilter=e.LinearFilter,S.wrapS=S.wrapT=e.ClampToEdgeWrapping,S.generateMipmaps=!1,S.needsUpdate=!0,{tex:S,phi:v,xs:w}}const Re=`
uniform sampler2D tFeed; uniform vec3 uGain; uniform float uLive;
varying vec2 vNdc;
flat varying vec3 vFeedMean;   // flat-ok: worked out from uniforms and fixed texture taps only, the same at all three corners
flat varying vec3 vMeanT;      // flat-ok: the same, the mean of the picture's upper part
flat varying vec3 vMeanB;      // flat-ok: the same, the mean of the picture's lower part
vec3 band(float y, float dx) {
  vec3 m = vec3(0.);
  for (int i = 0; i < 5; i++) m += min(textureLod(tFeed, vec2(.14 + .18 * float(i) + dx, y + .05 * (mod(float(i), 2.) - .5)), 0.).rgb, vec3(3.));
  return m * .2;
}
void main() {
  vec3 mt = .5 * (band(.80, 0.) + band(.66, .07)), mb = .5 * (band(.20, .05) + band(.34, -.03)), mm = band(.5, .02);
  vec3 all = (mt + mb + mm) / 3.;
  // the light the far picture falls away to at its edge: mostly the whole picture's mean, leaning to its sky above
  // and its ground below, so the ball's outer tenth is a soft bowl of that world's own light and never a flat card
  vFeedMean = all * uGain;
  vMeanT = mix(all, mt, .7) * uGain;
  vMeanB = mix(all, mb, .7) * uGain;
  vNdc = position.xy;
  gl_Position = vec4(position.xy, 0., 1.);
}`,Ie=`
precision highp float;
#define PI 3.14159265
#define NL ${ye}
uniform mat4 uCam, uFeedPV;
uniform vec4 uProj;                       // projection m00, m11, m02, m12
uniform vec3 uC, uFeedPos, uGain;
uniform float uA, uTabL, uTime, uPx, uEase, uLive, uSide, uStars, uThreadPx, uSwells, uZoom, uZoomS, uDeep;
uniform vec3 uThread;                     // the thread: gain, how fast the ember dies off the level, how fast the teal does
uniform vec3 uGlow;                       // ember strength, teal strength, half width of the afterglow in radians
uniform mat3 uStandRot;
uniform sampler2D tTable, tFeed;
uniform vec4 uLampP[NL];                  // xyz world position, w base angular size (radians)
uniform vec4 uLampC[NL];                  // rgb emissive, w 1 for the dark hull
uniform vec4 uBoat;                       // the trawler: x, y of its keel line, z of its plane, boom length (m)
uniform vec2 uBoatR;                      // its roll (radians) and the boom tips' height in boom lengths
uniform vec3 uLamp;                       // lamps: least separation in lamp widths, least brightness, clearance of the rim
uniform vec4 uDusk;                       // (polish1) sin and cos of the afterglow's turn toward the bow, how far the dusk has deepened (0..1), the wake's strength
uniform float uWarm;                      // (polish2) the last of the sunset. (lead4) 0 for every u: one hour for the whole flight
uniform float uHeart;                     // (lead4) the lamps' hearts: 1 from u 0, 0 from u 0.22 on
uniform vec4 uWake;                       // (polish1) the boat's wake on the sea: x where she began, x where she is, z of her track, her course (+1 | -1)
varying vec2 vNdc;
flat varying vec3 vFeedMean;              // flat-ok: the same value at all three corners (see the vertex shader)
flat varying vec3 vMeanT;                 // flat-ok: the same value at all three corners (see the vertex shader)
flat varying vec3 vMeanB;                 // flat-ok: the same value at all three corners (see the vertex shader)

// the brief's colours as the linear values the tone map SHOWS as those colours (a dark blue written as its plain
// linear value comes out of the tone map with no red or green in it at all)
const vec3 INDIGO = vec3(.0130, .0178, .0519);    // #0B1230
const vec3 SEA    = vec3(.0186, .0269, .0481);    // #131C2E
const vec3 EMBER  = vec3(.80, .129, .037);        // #E8743A
const vec3 TEAL   = vec3(.041, .218, .212);       // #2E8C8A
const vec3 STARW  = vec3(.716, .791, 1.);         // #DCE6FF
const float STARG = 1.6;                          // (lead4) the stars' gain: under the bloom threshold with the cap in sky()

float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash12(i), hash12(i + vec2(1., 0.)), f.x), mix(hash12(i + vec2(0., 1.)), hash12(i + vec2(1., 1.)), f.x), f.y);
}
vec4 hash42(vec2 p) { vec4 p4 = fract(vec4(p.xyxy) * vec4(.1031, .1030, .0973, .1099)); p4 += dot(p4, p4.wzxy + 33.33); return fract((p4.xxyz + p4.yzzw) * p4.zywx); }

// one layer of stars on a latitude and longitude grid; rad is the star's radius in radians of the sky it sits in
vec3 starLayer(vec3 f, float cells, float dens, float rad, float base, float seed, float fitAt) {
  float lat = asin(clamp(f.y, -1., 1.));
  float lon = (abs(f.x) + abs(f.z) > 1e-5) ? atan(f.z, f.x) : 0.;
  vec2 gs = vec2(2. * cells, cells);
  vec2 gp = vec2(lon / (2. * PI) + .5, lat / PI + .5) * gs;
  vec2 id = min(floor(gp), gs - 1.);
  vec4 h = hash42(id + seed);
  vec2 sp = (id + .24 + .52 * h.xy) / gs;
  float slon = (sp.x - .5) * 2. * PI, slat = (sp.y - .5) * PI, cl = cos(slat);
  vec3 sd = vec3(cl * cos(slon), sin(slat), cl * sin(slon));
  vec3 dv = f - sd;
  float cell = PI / cells;
  float fit = 1. - smoothstep(fitAt, fitAt * 1.6, rad / (cell * max(cl, .05)));          // too big for its cell: gone
  float on = clamp((dens * cl - h.z) * 14. + .5, 0., 1.) * fit;        // (polish1) a star comes out over a breath, not at a stroke
  float tw = 1. + .15 * sin(uTime * (1.9 + 5. * h.w) + 40. * h.z);            // 0.3 to 1.1 Hz
  float dim = clamp(3. * base * base / max(rad * rad, 1e-9), .36, 1.);
  float mag = .25 + 1.75 * h.w * h.w;
  vec3 tint = mix(STARW, vec3(1., .72, .5), step(.82, h.x));
  return tint * (exp(-dot(dv, dv) / max(rad * rad, 1e-9)) * on * tw * dim * mag);
}

// this side's sky: a function of direction. q is the squeeze (stars are drawn out into arcs, gone by q = 30); ev is the elevation, in
// radians, that one pixel holds here: the ember line is never thinner than a pixel and a half, and where the ray's
// plane lies along the horizon (ev near 0) it stays a line however hard the sky is squeezed along it
vec3 sky(vec3 g, float q, float ev) {
  float h = max(g.y, 0.);
  float hl = length(g.xz);
  float ca = hl > 1e-4 ? (g.x * uSide * uDusk.y - g.z * uDusk.x) / hl : 0.;     // (polish1) the afterglow's heart stands uDusk.x forward of abeam
  float az = acos(clamp(ca, -1., 1.));
  float w = exp(-az * az / max(2. * uGlow.z * uGlow.z, 1e-6));
  float w2 = exp(-az * az / max(3.6 * uGlow.z * uGlow.z, 1e-6));               // the teal reaches further round than the ember
  // the vault: indigo overhead, a little lighter and bluer low down, a breath of violet opposite the afterglow
  vec3 col = INDIGO * (.74 + .55 * exp(-h / .26) + .85 * exp(-h / .075)) + vec3(.0012, .0065, .011) * exp(-h / .12);
  col += vec3(.008, .004, .015) * exp(-h / .10) * (1. - w2);
  col *= mix(.98, .40, uDusk.z);                                   // (polish1) the vault darkens as the dusk deepens (polish2: 1.0 to .52; night by the hold)
  col += w * vec3(.004, .030, .046) * ((1. - uDusk.z) * (1. - uDusk.z) * exp(-h / .36) * (1. - exp(-h / .09)) * min(uGlow.x + .4 * uGlow.y, 1.3));   // (polish2) early, the sky over the afterglow is still luminous
  // (polish0) the belt of Venus: opposite the afterglow a band of dusty rose stands a few degrees up, over the
  // slate blue of the earth's own shadow on the sea line
  float ahead = hl > 1e-4 ? smoothstep(.72, .96, -g.z / hl) : 0.;      // (polish2) the sky dead ahead, behind the exit: no glow, no rose there, only the dusk and its stars (they are the ball's crown)
  float bv = (h - .105) / .060;
  col += vec3(.050, .017, .026) * (exp(-bv * bv) * (1. - w2) * (.5 + .5 * min(uGlow.x, 1.2)) * (1. - .85 * ahead));
  // The afterglow. A pixel that holds ev radians of elevation shows the AVERAGE of the line over them (the line's
  // light spread over the pixel, so it thins honestly to nothing where the sky is squeezed across the horizon),
  // times the licence's 2.2 once it is squeezed at all. Along the horizon (ev near 0) it stays a line.
  float eh = max(.030, 1.5 * ev), low = exp(-h / eh);
  float keep = (.030 / eh) * mix(1., 2.2, smoothstep(.030, .10, eh));
  float mid = exp(-h / max(.062, eh));
  // (lead3) the ember line takes the cut the rose has dead ahead (the sun set abeam, never behind the exit), so the
  // sea line the ball lifts over its top is dusk and only the dome's flank on the afterglow's side takes the glow.
  // Where the line is cut the vault no longer gives way to it: the dusk stands there, not a dark gap.
  // (lead4) the cut is let go on the afterglow's own side of the bow (by 8 degrees): the dome's flank and the sea line
  // beside it keep their ember, and only the sea line dead ahead (the dome's top) and to port of it is cut
  float aheadE = hl > 1e-4 ? ahead * (1. - smoothstep(.03, .14, g.x * uSide / hl)) : 0.;
  float aft = 1. - .8 * aheadE, eln = max(low, .8 * mid);
  col *= 1. - .66 * min(1.35 * w, 1.) * exp(-h / .15) * min(keep * 2., 1.) * (1. - (1. - aft) * eln);        // (polish1 second pass) under the afterglow the vault's own pale blue gives way: ember, orange and rose keep their colour
  float th = max(.15, eh), tk = (.15 / th) * mix(1., 1.6, smoothstep(.15, .5, th));
  col *= 1. - .94 * min(1.7 * w, 1.) * eln * min(keep, 1.) * min(uGlow.x, 1.) * aft;       // the ember line is its own colour, not ember over blue
  // (lead4) the ember line is ember: the line's summed light (the ember and the orange over it) is held at linear 1.6 on
  // its brightest channel, its hue kept, so it comes out of the tone map saturated ember and never peach-white
  vec3 line = w * aft * (EMBER * (1.45 * uGlow.x * low * keep) + vec3(.66, .165, .040) * (.95 * (mix(2.7, .55, uDusk.z) + 2.4 * uWarm * w) * uGlow.x * mid * (1. - low) * keep));
  col += line * min(1., 1.6 / max(max(line.r, line.g), max(line.b, 1e-3)));
  // (lead4) where the ember is cut the rose does not stop short of the sea line: it stands down to it at its own
  // brightness (.42 of its full term is the band's own peak), so the cut line is never darker than the sky over it
  col += w * vec3(.200, .040, .046) * ((mix(2.5, .32, uDusk.z) + 1.5 * uWarm * w * w) * (1. - .8 * ahead) * uGlow.x * exp(-h / max(mix(.115, .085, uDusk.z), eh)) * (1. - mid * (1. - .42 * aheadE)) * min(keep * 2., 1.));   // (polish0b) rose standing over the ember, up to ten degrees
  col += w * vec3(.03, .42, .30) * (max(uGlow.y - uGlow.x, 0.) * low * keep);      // late: the line itself goes green
  col += w2 * TEAL * (mix(1.45, .6, uDusk.z) * (1. - .88 * min(1.5 * w, 1.) * exp(-h / .11) * min(keep * 2., 1.))) * (1.95 * uGlow.y * tk * exp(-h / th) * (1. - mid * min(1.5 * w, 1.)) + 1.5 * uGlow.y * (1. - exp(-h / .07)) * exp(-h / .135) * min(keep * 2., 1.));   // (polish1) the teal stands clear of the rose, 6 to 16 degrees up
  col += w2 * vec3(.030, .012, .034) * (exp(-h / .34) * min(uGlow.x, 1.2));      // (polish0) a breath of violet where the teal gives out
  // the last of the light, faint, all round the sea line: so the horizon can be followed everywhere
  float lh = max(.014, 1.5 * ev);
  col += vec3(.118, .044, .034) * (exp(-h / lh) * (.014 / lh) * mix(1., 2.2, smoothstep(.014, .05, lh)) * (1. - .7 * w));
  // stars: on the side away from the afterglow. Squeezed, each is drawn out into an arc round the ball and dims;
  // they are only let go where an arc would be longer than its cell of sky
  float sq = 1. - smoothstep(10., 25., q);
  if (sq > 0. && g.y > 0.) {
    // (polish1) the stars come out as the dusk deepens (uStars rises along the flight), everywhere but in the
    // afterglow itself, the brightest first; a coarse layer of the brightest keeps its long arcs round the ball
    float port = (1. - smoothstep(.05, .80, ca * (1. - .45 * uDusk.z) + .9 * exp(-g.y / .16) * smoothstep(.45, .92, ca) - .55)) * smoothstep(.0, .045, g.y);   // (polish2) low stars are let through everywhere but near the afterglow's heart: the ones behind the ball are its crown
    float crown = (1. + .4 * smoothstep(1.3, 3., q) * (1. - smoothstep(3.5, 7., q))) * (1. - .78 * smoothstep(4., 9., q));
    port = max(port, .8 * ahead * smoothstep(.0, .045, g.y));       // dead ahead the stars are out from the first frame, in every hour
    float sd = uStars * (1. + .6 * ahead * (1. - uDusk.z));                  // (polish2) the throat gathers a star's light as it draws it out: the arcs round the ball are the brightest stars in the sky
    float rad = max(.0013, .82 * uPx * q);
    // (lead4) no star blooms: the gain is cut (it was 2.8) and a star's light, summed with the sky it stands in, is
    // held just under 1.0 on its brightest channel, its colour kept: crisp points and crisp arcs
    vec3 stl = STARG * sq * port * crown * (starLayer(g, 26., sd, rad, .0013, 3., .2) + starLayer(g, 11., sd * 1.5, rad * 1.2, .0016, 11., .3) * 1.7
         + starLayer(g, 58., sd * .8, rad * .8, .0011, 17., .2) * .55 + starLayer(g, 7., sd * 1.7, rad * 1.35, .0018, 23., .3) * 2.2
         + starLayer(g, 16., sd * 1.15, rad * 1.1, .0014, 31., .3) * 1.25);
    col += stl * min(1., max(.96 - max(col.r, max(col.g, col.b)), 0.) / max(max(stl.r, stl.g), max(stl.b, 1e-4)));
  }
  // (polish0) the evening star: one steady planet, bent like the rest. (lead4) It stands on the port side, away from
  // the afterglow, as the brightest of the stars: under the bloom threshold, with a small soft halo
  {
    vec3 dv = g - vec3(-uSide * .516, .225, -.826);
    float rad = max(.0021, .95 * uPx * q), d2 = dot(dv, dv);
    vec3 pl = vec3(1., .92, .78) * ((1. - smoothstep(12., 30., q)) * step(0., g.y) * (3.2 * exp(-d2 / (rad * rad)) * clamp(3. * .0021 * .0021 / (rad * rad), .3, 1.) + .035 * exp(-sqrt(max(d2, 0.)) / .012)));
    col += pl * min(1., max(.97 - max(col.r, max(col.g, col.b)), 0.) / max(max(pl.r, pl.g), max(pl.b, 1e-4)));
  }
  return col;
}

// THE LICENCE. Where this side is squeezed past what pixels can hold, it is drawn as its own average, 2.2 times
// brighter. The average is taken where the light really comes from: along the great circle of this side's sky
// that lies in the ray's own plane (e, n), which is what the ray winds round. A level plane (the ball's left and
// right) holds the whole sea line and so the afterglow; an upright plane (top and bottom) holds zenith and sea and
// no afterglow at all. So the thread is ember at the sides and dies to indigo above and below: it is the horizon.
// x: how much of the afterglow the thread holds where its plane has the outward direction n (1 at the ball's flanks,
// 0 over its top and bottom); y: the rose it cools through on the way
vec2 threadHot(vec3 n) {
  float ay = abs(n.y), lev = 1. - smoothstep(.04, max(uThread.y, .041), ay);
  float hot = mix(.85, 1., smoothstep(-.3, .3, n.x * uSide)) * (.78 + .22 * min(uGlow.x, 1.2));
  return vec2(lev * lev * hot, lev * (1. - lev) * (1. - smoothstep(.3, .9, ay)) * hot * 2.);
}
vec3 threadCol(vec3 e, vec3 n) {
  // The plane's great circle lies along the sea line when n is level, and then holds the whole afterglow. Tilted, it
  // meets the sea line only fore and aft and climbs to the elevation of n on one side, n's side, and dips under the
  // sea on the other: so on the afterglow's side the thread reads off the sky's own profile, ember, then teal, then
  // indigo, as it leaves the level; on the other side it goes straight to the dusk. It is the horizon, wrapped.
  // (fix0) ember, hot enough to bloom, only where the plane is near level (the ball's flanks); it cools through rose
  // and is gone over the top and bottom quarters, where the band is no more than the dusk beside it
  vec2 th = threadHot(n);
  vec3 dusk = INDIGO * .55 + SEA * .25;
  vec3 glow = EMBER * (2.9 * th.x) + vec3(.03, .42, .30) * (.30 * max(uGlow.y - uGlow.x, 0.) * th.x) + vec3(.34, .085, .060) * th.y;
  return 1.25 * dusk * (1. - .8 * th.x) + glow * uThread.x;
}`,De=`
uniform vec3 uFeedR, uFeedU;              // the feed camera's right and up, in this world's axes
uniform vec2 uCheap;                      // phones: ripple trains to draw, feed taps to take
uniform vec2 uPool;                       // the lamps' light pooled on the water: strength, 1 / (2 r^2)
uniform float uRingK, uColK, uColW, uColB;
uniform float uRing;                      // 1 while the boat is dead behind the ball (the ring), else 0
uniform vec3 uFeedTan;                    // tan of half the feed's vertical and horizontal field, and the fold margin
vec3 gN = vec3(0., 1., 0.), gE = vec3(0., 0., -1.);   // (polish2) this pixel's ray plane (set in main): the direction away from the axis, and the axis

// the sea: plane y = 0. Three swells running toward the camera from 20 degrees to port (their crests come and go
// along their length), and a wind ripple of six trains, each bent by the ones before it so that no lattice shows.
// P is where the ray meets the plane, rd its direction there, dist how far the light has come, q the squeeze.
// It is lit by nothing but what it reflects: the sky function, the far side's light (ballCol) and the two lamps.
// (fix0) a field of glints on the water where the ripple is far below a pixel: cells a few pixels across at any
// distance (two octaves of cell size, cross-faded, so nothing pops as we fly), each with one short dash of light that
// comes and goes on its own clock. dens is the share of cells that are lit. Anchored to the water, not the screen.
vec2 glints(vec2 P, float cross, float dens, float seed) {
  float L = log2(max(cross, 1e-3)), L0 = floor(L), fL = L - L0, acc0 = 0., acc1 = 0.;
  for (int i = 0; i < 2; i++) {
    float sc = exp2(L0 + float(i));
    vec2 cs = vec2(6. * sc, 3.1 * sc * sc / max(uPx * 80., 1e-6));
    vec2 gp = P / cs, id = floor(gp);
    vec4 h = hash42(id + seed + 17. * float(i));
    vec2 dv = (gp - id - (.3 + .4 * h.xy)) * vec2(1.9, 2.7);
    float fl = smoothstep(.35, 1., sin(uTime * (1.1 + 2.3 * h.z) + 6.283 * h.w));
    float v = (i == 0 ? 1. - fL : fL) * exp(-dot(dv, dv) * 3.) * fl * step(h.z * .999, dens) * (.45 + .9 * h.x);
    if (h.y < .58) acc0 += v; else acc1 += v;                     // two kinds of glint (ember and teal), one colour to a glint
  }
  return vec2(acc0, acc1);
}
// a light's hue kept and deepened, its brightest channel held under 1 so that it never clips to white
vec3 vivid(vec3 c) {
  float l = dot(c, vec3(.3, .55, .15));
  c = max(mix(vec3(l), c, 2.5), vec3(0.)) * 1.9;
  return c * min(1., .95 / max(max(c.r, c.g), max(c.b, 1e-3)));
}
vec3 sea(vec2 P, vec3 rd, float dist, float q, vec3 eBall, vec3 ballCol) {
  float fp = uPx * q * dist / max(-rd.y, .02);                     // a pixel's footprint on the water, metres
  vec2 sl = vec2(0.);
  vec2 k1 = vec2(.342, .940), k2 = vec2(.292, .956), k3 = vec2(.391, .920);   // (fix0) within 3 degrees of each other: crossing trains chopped the crests into blocks
  float gust = .5 + .5 * sin(dot(P, vec2(.0061, .0043)) + 1.7 * sin(dot(P, vec2(-.0037, .0052)) + uTime * .05) + uTime * .04);
  float c1 = .62 + .38 * sin(dot(P, vec2(.0121, -.0044)) + 1.3 * sin(dot(P, vec2(.0043, .0071)) - uTime * .06));
  float c2 = .58 + .42 * sin(dot(P, vec2(-.0237, .0146)) + 1.6 * sin(dot(P, vec2(.0091, .0113)) + uTime * .09) + 2.);
  float p1 = dot(P, k1) * .0449 - uTime * .664, p2 = dot(P, k2) * .1047 - uTime * 1.016 + .8 * c1;
  sl += k1 * (.082 * c1 * cos(p1)) * (1. - smoothstep(28., 70., fp));
  sl += k2 * (.074 * c2 * cos(p2)) * (1. - smoothstep(12., 30., fp));
  float hgt = .55 * c1 * sin(p1) + .45 * c2 * sin(p2);              // (polish0) the swell's height, -1..1: where its crests are
  sl += k3 * (.058 * (1.2 - c2) * cos(dot(P, k3) * .273 - uTime * 1.64 + 1.5 * c2)) * (1. - smoothstep(4.6, 11.5, fp)) * uSwells;
  vec2 slS = sl;                                                   // the swell's share of the slope
  // the wind ripple: wavelengths from 11 m down to 0.9 m, each train's phase pushed about by the trains before it
  vec2 pw = P, dirw = vec2(.81, .59);
  float fr = .57, am = .060, wsum = 0.;
  for (int i = 0; i < 6; i++) {
    if (float(i) >= uCheap.x) break;
    float ph = dot(pw, dirw) * fr + uTime * (1.1 + .55 * float(i)) + wsum;
    float keepw = 1. - smoothstep(.22, .55, fp * fr);              // gone once a pixel holds a fifth of its wavelength
    float cw = cos(ph), sw = sin(ph);
    sl += dirw * (am * (.55 + .9 * gust) * cw * keepw);
    wsum += 1.9 * sw + .7 * cw;
    pw += vec2(-dirw.y, dirw.x) * (sw * .9 / fr);
    dirw = vec2(dirw.x * .309 - dirw.y * .951, dirw.x * .951 + dirw.y * .309) * vec2(1., 1.);   // turn 72 degrees
    fr *= 1.62; am *= .88;
  }
  vec3 n = normalize(vec3(-sl.x, 1., -sl.y));
  float lost = smoothstep(.4, 4.5, fp);                             // how much of the ripple is below a pixel
  vec3 r = reflect(rd, n); r.y = abs(r.y) + .004 + lost * (.030 + .05 * gust); r = normalize(r);
  float c = clamp(dot(-rd, n), 0., 1.), k = 1. - c, k2f = k * k;
  float F = .02 + .98 * k2f * k2f * k;
  F = mix(F, min(F, .62), lost);                                    // a rough far sea is never a perfect mirror
  F = mix(F, min(F, .42), lost * smoothstep(1.5, 4., q));           // squeezed sea: a dark floor under the sea line
  // what the water mirrors: the sky, blurred by the roughness a pixel holds (the afterglow lies down on the far sea)
  vec3 refl = sky(r, 40., .010 + .034 * lost + .012 * gust);
  // its own body: the sky's light scattered back, a little more on faces turned to the afterglow
  float face = clamp(.5 + 5. * (sl.x * uSide * .8 - sl.y * .6), 0., 1.);
  vec3 body = SEA * ((.70 + .28 * gust) * (.62 + .76 * face)) + vec3(.0020, .0078, .0090) * (uGlow.y + .5 * uGlow.x) * face * face;
  vec3 col = body + F * refl;
  // (fix0) the swell, shown the way a swell shows at dusk: faces leaning away from the eye lie nearer to grazing and
  // mirror the bright band along the sea line (the afterglow's colours on its side, pale blue elsewhere); faces
  // leaning to the eye mirror the dark overhead. Long lines of light and dark that march toward us.
  float hl = max(length(rd.xz), 1e-4);
  vec2 vd = rd.xz / hl;
  float sv = dot(slS, vd);
  float gx = vd.x * uSide * uDusk.y - vd.y * uDusk.x;                // (polish1) toward the afterglow's heart
  float wA = smoothstep(.05, .90, gx);                             // the afterglow's side of the sea
  float unsq = 1. - smoothstep(2., 6., q);
  float graze = exp(rd.y / (.20 * hl));                             // 1 at the sea line, falling as we look down
  vec3 band = mix(vec3(.024, .046, .118), EMBER * (.34 * uGlow.x) + TEAL * (.26 * uGlow.y), wA);
  col += band * (.95 * smoothstep(0., .10, -sv) * (.45 + .75 * graze));
  col *= 1. - .40 * smoothstep(0., .11, sv);
  // (polish0b) the far sea lies near grazing and is a mirror of the light along the sea line: ember and rose on the
  // afterglow's side, the pale slate of the low sky on the other; it lies in the swell's far faces and thins toward us
  {
    float wS = smoothstep(.10, .97, gx); wS *= wS;
    vec3 sheen = mix(vec3(.012, .026, .070), EMBER * (.80 * uGlow.x) + vec3(.30, .05, .05) * (.20 * uGlow.x) + TEAL * (.10 * uGlow.y), wS);
    col += sheen * ((mix(1.75, .42, uDusk.z) + .5 * uWarm) * exp(rd.y / (.085 * hl)) * (.12 + .88 * smoothstep(-.01, .09, -sv)) * mix(1., .45, smoothstep(2., 6., q)));
  }
  // glints: ripple faces steep enough to throw the low afterglow at the eye. Where the ripple is resolved they are
  // its own faces; beyond, a field of glints as dense as such faces are likely, bunched on the swell's far faces
  vec2 rp = sl - slS + .35 * slS;                                   // the ripple's own faces, leaning a little with the swell
  vec2 rq = sl - slS;                                              // (fix0) the ripple alone: with the swell's lean in it whole swell faces lit up as boxes
  float gl = smoothstep(.045, .13, rq.x * uSide + .3 * abs(rq.y)) * (1. - lost);
  float gs = smoothstep(.05, .15, -rq.y + .3 * abs(rq.x)) * (1. - .8 * lost);       // and the pale low sky ahead
  col += (vec3(.74, .22, .07) * (.22 * uGlow.x) + vec3(.10, .20, .22) * (.24 * uGlow.y)) * gl + vec3(.020, .032, .066) * gs;
  float cross = uPx * dist;
  float bunch = .40 + 1.2 * clamp(.5 - sv * 9., 0., 1.);
  vec2 gA = min(glints(P, cross, wA * (.16 + .80 * graze) * bunch, 3.), vec2(1.)) * (lost * unsq);
  vec2 gB = glints(P, cross, (1. - wA) * (.10 + .40 * graze) * bunch, 41.);
  col += vec3(.74, .27, .085) * ((.72 + .6 * uWarm) * uGlow.x * gA.x) + vec3(.20, .26, .30) * (.95 * uGlow.y * gA.y) + vec3(.062, .092, .185) * ((gB.x + gB.y) * lost * unsq);   // (polish2) the afterglow's glints are ember-gold and pale sky: red dashes beside teal ones read as a colour fringe
  // (polish0) broken crests: pale flecks riding the tops of the swell, torn by the wind, each lit by the sky on its
  // own side (ember toward the afterglow, slate and lilac away from it); beyond a pixel they are the crest's own pale line
  {
    float fo = smoothstep(.34, .80, hgt) * (1. - smoothstep(24., 60., fp)) * unsq;
    float fl1 = vnoise(P * vec2(.42, .30) + vec2(uTime * .22, -uTime * .31)), fl2 = vnoise(P * 1.9 + vec2(-uTime * .5, uTime * .4));
    float fleck = smoothstep(.50, .78, fl1 * (.55 + .75 * fl2));
    vec3 foamC = mix(vec3(.060, .078, .135), EMBER * (.20 * uGlow.x) + TEAL * (.10 * uGlow.y) + vec3(.045, .045, .060), wA);
    col += foamC * (fo * mix(fleck * 1.5, .34, smoothstep(.35, 2.5, fp)) * (.55 + .65 * gust));
  }
  // the far side's light on the water. (polish0b) It is the ball's own image in this sea: a facet throws the ball at
  // the eye where its tilt halves the angle between them, so the light lies where such tilts are likely: one road
  // from under the ball to our own foot, long and thin while the ball is far and low, a broad pool as it nears;
  // its far end mirrors that world's ground, its near end that world's sky. Never broken, no edge anywhere.
  if (ballCol.r + ballCol.g + ballCol.b > 0.) {
    vec3 Pw = vec3(P.x, 0., P.y), toE = uCam[3].xyz - Pw, toB = uC - Pw;
    float dE = max(length(toE), 1.), dB = max(length(toB), 1.);
    vec3 Hh = toE / dE + toB / dB;
    float need = max(length(Hh.xz) / max(Hh.y, .05) - .5 * uA / dB, 0.);        // the tilt wanted, less what the ball's own width forgives
    float road = exp(-need * need / (2. * (.030 + .012 * lost))), pool = exp(-need * need / .34);
    float dC = max(length(uC.xz - uCam[3].xz), 1.), angB = uA / dC;
    float near = clamp(dot(P - uCam[3].xz, uC.xz - uCam[3].xz) / (dC * dC), 0., 1.), near0 = uCam[3].y / max(uCam[3].y + uC.y, 1.);
    vec2 g1 = glints(P, cross, .85, 71.), g2 = glints(P * 1.7 + 31., cross * 1.7, .8, 97.), g3 = glints(P * .6 - 13., cross * .6, .8, 113.);
    float far = clamp(.5 - sv * 9., 0., 1.);                          // the swell's far faces
    vec2 gg = min(g1 + g2 + .7 * (g3), vec2(1.2));
    // the smooth light is that world's mean where the water mirrors it (ground by the ball, sky by us); the glints
    // are of two kinds, one throwing that world's sky at us and one its ground
    vec3 cT = vivid(mix(ballCol, vMeanT * 1.6, .8 * uLive)), cB = vivid(mix(ballCol * vec3(.7, 1.1, 1.3), vMeanB * 1.6, .8 * uLive));
    vec3 rc = mix(cT, cB, smoothstep(near0 - .22, near0 + .30, near)) * (.20 + .62 * far) + (cT * gg.x + cB * gg.y) * 1.2;
    float grow = min(angB * 2.4, 1.);                               // the nearer the ball, the more of that world's light lies on this sea
    // while the boat stands dead behind the ball her lamps' two columns lie in this same water: the road gives way to them
    col += ((rc * road * (.42 + .68 * grow) + mix(cT, cB, .5) * pool * (.035 + .11 * grow) * (.45 + 1.2 * far)) * (1. - .7 * smoothstep(2., 6., q)) * (1. - .78 * uRing));
  }
  float pl = (1. - uRing) * (1. - smoothstep(5., 14., q));           // (polish1) 1 in the plain view and where the sea is only gently drawn in toward the ball: no ring, no hard squeeze
  // (polish1) the trawler's wake: the pale line she has drawn on the sea, widening and dying behind her. It lies on
  // the water, so where she has passed behind the ball it is bent round the ball like the sea line itself.
  {
    float tb = (uWake.y - P.x) * uWake.w;                           // metres astern of her
    float len = abs(uWake.y - uWake.x) + 1.;
    float wd = 3.0 + .012 * max(tb, 0.), wde = max(wd, 1.05 * fp);      // (polish2) never thinner than a pixel and a half
    float dz = (P.y - uWake.z) / wde;
    float torn = .62 + .38 * vnoise(vec2(P.x * .045 - uTime * .05, P.y * .2));
    float wk = exp(-dz * dz * 1.4) * smoothstep(0., 30., tb) * (1. - smoothstep(.45 * len, len, tb)) * exp(-max(tb, 0.) / 1150.) * max(wd / wde, .7) * torn;
    vec3 foam = mix(vec3(.30, .38, .58), EMBER * (.80 * uGlow.x) + vec3(.30, .26, .30), wA) * 1.2;   // (lead4) a line, not a fan of light: 0.012 m of width per metre astern (was .034), foam gain 1.2 (was 2.3 to 1.7)
    col += foam * (wk * uDusk.w * (1. - smoothstep(1.5, 3.5, q)));     // (guard1) no wake where the squeeze is hard: the hold's margins hold sea, glow, stars and lamps only (lead4: gone by squeeze 3.5, so the ball does not draw it up into a fan)
    // and her own dark shape on the water, toward us, between the two lamps' columns
    vec2 wb = P - vec2(uBoat.x, uBoat.z), de = uCam[3].xz - vec2(uBoat.x, uBoat.z); de /= max(length(de), 1.);
    float al = dot(wb, de), ac = (wb.x * de.y - wb.y * de.x) / max(.42 * uBoat.w, 1e-6);
    col *= 1. - .5 * pl * exp(-ac * ac) * smoothstep(0., 12., al) * exp(-max(al, 0.) / max(5. * uBoat.w, 1e-6));
  }
  col *= 1. - uRingK * uRing * smoothstep(1.5, 3.0, q);            // (guard1) while the ring stands the drawn-in sea behind its arcs is held at its old darkness: red stays red, green green
  vec3 P3 = vec3(P.x, 0., P.y);
  // the two lamps' light on the water: the chance that a facet here is tilted to throw the lamp at the eye
  float var = (.0012 + .013 * lost) * (1. + uColW * pl);
  float cellS = exp2(floor(log2(max(cross, 1e-3)) + .5));        // (polish2) the lanes' level dashes: a few pixels long at any distance
  for (int i = 0; i < 2; i++) {
    vec3 Lv = uLampP[i].xyz - P3; float dl = max(length(Lv), 1.);
    vec3 H = Lv / dl - rd; H /= max(length(H), 1e-4);
    vec2 df = H.xz / max(H.y, .03) + .28 * rq + .2 * slS;      // the ripple's faces only: a swell's whole face must not flash the lamp a field away
    // (polish0b) a lamp's reflection: one long column from the boat toward us, as long as it was (the ring's lower
    // arcs and the proof of two lamps are made of it). In the plain view it is broken into the water's own dashes,
    // which come and go, so that the red column and the green one are two lights on a sea and not a colour fringe;
    // where the throat squeezes it (the ring, the copies) it is the smooth band it always was
    // (polish1) in the plain view the column is water, not a ruled line: brightest at her waterline, wavering with
    // the swell, falling away over a few hundred metres to scattered sparks. Ring and squeeze: as it always was.
    df.x += pl * lost * .045 * sin(dl * .017 - uTime * 1.1 + 2.4 * float(i));
    float stk = exp(-dot(df, df) / max(2. * var, 1e-6)) * (.56 + .90 * uRing + uColK * pl) / (1. + dl * dl / 3.6e5);   // (guard1) as long as it always was: each lamp's own long reflection leads the eye to her
    if (stk > .002) {
      vec2 gk = glints(P + 23. * float(i + 1), cross, .85, 131. + 17. * float(i)), gh = glints(P * 1.7 - 11. * float(i + 1), cross * 1.7, .80, 157. + 13. * float(i));
      // (polish2) in the plain view a lane is a pillar of the lamp's own light: a soft glow all the way down, laid in
      // level dashes that slide and come and go with the water, a few sparks on top; never a cloud of loose specks
      float dsh = .5 + .5 * sin(dot(P, vec2(.21, 1.3)) / cellS + 5.5 * vnoise(P * vec2(.33, .9) / cellS + vec2(float(i) * 7., uTime * .35)) - uTime * 1.7);
      float lane = uColB + (1. - uColB) * smoothstep(.15, .95, dsh) * 1.3 + 1.1 * min(gk.x + gk.y + gh.x + gh.y, 1.3);
      stk *= mix(1., mix(.34 + 2.2 * min(gk.x + gk.y + gh.x + gh.y, 1.3), lane, pl), lost * unsq * mix(1., smoothstep(40., 380., dl), pl));
      stk *= 1. - .55 * pl * smoothstep(.6, 1., dl / max(length(uLampP[i].xz - uCam[3].xz), 1.));   // (polish2) a pillar dies away toward our own foot; it does not run off the frame as a stripe
    }
    // (polish2) the ring's arcs that are the lamps' light on the bent sea: like the lamps' own images they are cut to
    // the plane that holds the (mirrored) lamp and the axis, so red and green stand apart with dark between, and
    // each has a warm-white core inside its colour
    vec3 vam = vec3(uLampP[i].x - uC.x, -uLampP[i].y - uC.y, uLampP[i].z - uC.z), vpm = vam - gE * dot(vam, gE);
    float bent = uRing * smoothstep(1.5, 3., q);
    stk *= mix(1., smoothstep(.42, .76, abs(dot(gN, vpm)) / max(length(vpm), 1e-3)), bent);
    float hot = smoothstep(.30, .78, stk); hot *= hot;
    col += uLampC[i].rgb * (stk + uPool.x * exp(-dl * dl * uPool.y)) + vec3(1.5, 1.2, .78) * (bent * hot);
  }
  return max(col, vec3(.0085, .012, .024));
}

// the far side while there is no picture of the next world: a denser, stranger night than ours, slowly turning.
// Its stars are fine points (half a pixel in radius, whatever the squeeze) and a river of light crosses it, so that
// even in a ball 70 pixels wide it is a sky and not a marble with bubbles in it
vec3 standIn(vec3 f0, float q, float keep) {
  vec3 f = uStandRot * f0;
  float rad = max(.0011, .5 * uPx * q);
  float dz = dot(f, vec3(.262, .943, .204));
  float lump = .62 + .38 * sin(f.x * 3.1 + f.z * 2.3 + 1.3 * sin(f.y * 4.1 - f.x * 1.7));
  float band = exp(-dz * dz * 14.) * lump * (.3 + .7 * keep);
  vec3 col = vec3(.008, .026, .042) + (vec3(.045, .240, .250) + vec3(.170, .050, .200) * lump) * band;
  float dn = .30 + .70 * exp(-dz * dz * 5.);                 // far more stars along the river
  float fine = keep * (1. - smoothstep(.022, .075, uPx * q));            // squeezed toward the rim the points melt into the night's mean
  col += fine * (1.3 + 1.2 * band) * (2.6 * starLayer(f, 9., .8 * dn, rad, .0011, 1., .2) + 2.0 * starLayer(f, 22., .6 * dn, rad, .0011, 5., .2)
              + 1.6 * starLayer(f, 44., .4 * dn, rad, .0011, 7., .2) + 1.2 * starLayer(f, 90., .3 * dn, rad, .0011, 9., .2));
  return col;
}

// the next world's picture in the far direction at angle ph from e toward n. One camera cannot hold a whole sky, so
// past the feed camera's field the direction is held at the field's edge (the brief's clamp, eased in from a knee)
// and the colour goes to the picture's mean (see engine-need.md)
vec3 feedTap(vec3 e, vec3 n, float ph, float fold) {
  float knee = fold * mix(.80, 1., uEase), room = max(fold - knee, 1e-3);
  float p = ph < knee ? ph : knee + room * (1. - exp(-(ph - knee) / room));
  vec3 f = e * cos(p) + n * sin(p);
  vec4 c = uFeedPV * vec4(uFeedPos + f * 2000., 1.);
  vec2 uv = c.xy / max(c.w, 1e-3) * .5 + .5;
  return min(textureLod(tFeed, clamp(uv, .003, .997), 0.).rgb, vec3(4.));
}`,Ve=`
// the lamps' licence: where the squeeze would lay the red lamp and the green one on the same pixel (and make one
// white spark of them) they are kept uLamp.x lamp widths apart, in their true order, and clear of the rim, so a
// copy of the boat is still a boat with two lamps
float lampApart(float mi, float mc, float sig, float s0) {
  float dm = mi - mc, ad = abs(dm);
  float S = clamp(uLamp.x * sig / max(ad, 1e-6), 1., max(1., uLamp.x * sig / max(s0, 1e-6)));
  return mc + dm * S - (S - 1.) * ad - uLamp.z * sig * clamp(S - 1., 0., 1.);
}
void main() {
  vec3 eye = uCam[3].xyz;
  vec3 d = normalize(mat3(uCam) * vec3((vNdc.x + uProj.z) / max(uProj.x, 1e-6), (vNdc.y + uProj.w) / max(uProj.y, 1e-6), -1.));
  vec3 ce = uC - eye; float l = length(ce);
  vec3 fwd = -uCam[2].xyz / max(length(uCam[2].xyz), 1e-6);
  vec3 e = l > 1e-3 ? ce / l : fwd;
  float cp = clamp(dot(d, e), -1., 1.), psi = acos(cp);
  vec3 nn = d - e * cp; float sp = length(nn);
  vec3 n = sp > 1e-5 ? nn / sp : uCam[0].xyz / max(length(uCam[0].xyz), 1e-6);
  float A = max(uA, 1e-6);                                                   // the throat's radius, never zero (Direct3D)
  float r0 = sqrt(l * l + A * A), x = r0 * sp / A;                          // x = b / a
  float row = (.5 + ${C-1}. * clamp(l / A / max(uTabL, 1e-6), 0., 1.)) / ${C}.;
  gN = n; gE = e;
  vec3 ballCol = vFeedMean * mix(.15, 1., uLive) * 1.6;    // (lead4) the far world's light on the sea arrives with the uncovering: no stand-in share, a floor of .15 of the feed's own mean
  float rim = asin(clamp(A / max(r0, 1e-6), 0., 1.));
  vec3 col;
  if (x < 1. && cp > 0.) {
    // ---- the ray passes the throat: it ends on the far side
    float t = log(max(1. - x, ${L})) / log(${L});
    vec4 tab = textureLod(tTable, vec2((.5 + 127. * t) / 256., row), 0.);
    float PHI = mix(tab.r + tab.b, psi, uEase), q = mix(tab.g, 1., uEase);
    // uZoom (under 1 while the ball is small, 1 from the hold on): the far side drawn larger about the axis, as a
    // window shows what is beyond it, or the next world would be a pixel high inside a 70 pixel ball
    float zq = uZoom * q, Pz = PHI * uZoom, Pzs = PHI * uZoomS;
    // the stand-in is held to one sky, as the feed is to its camera's field: past 68 degrees from the axis the
    // direction eases to a stop at 109 and the stars melt away, so no second, wrapped copy of it rings the ball
    float held = Pzs < 1.18 ? 1. : exp(-(Pzs - 1.18) / .72);
    float Ps = Pzs < 1.18 ? Pzs : 1.18 + .72 * (1. - held);
    vec3 far = standIn(e * cos(Ps) + n * sin(Ps), uZoomS * q * held, smoothstep(.25, .8, held));
    if (uLive > 0.) {
      float nx = abs(dot(n, uFeedR)), ny = abs(dot(n, uFeedU));
      float fold = atan(min(uFeedTan.x / max(ny, 1e-3), uFeedTan.y / max(nx, 1e-3))) * uFeedTan.z;
      float spread = .5 * uPx * min(zq, 40.);
      vec3 fd = vec3(0.);
      for (int i = 0; i < 4; i++) { if (float(i) >= uCheap.y) break; fd += feedTap(e, n, max(Pz + spread * (float(i) - .5 * (uCheap.y - 1.)) * (2. / max(uCheap.y, 1.)) * .5, 0.), fold); }
      fd *= uGain / max(uCheap.y, 1.);
      float turns = Pz / max(fold, .05);
      // past the picture's edge nothing of it is kept (a held edge is a streak): it falls away, over the ball's last
      // tenth, into that world's own light, its sky's above and its ground's below
      float cu = dot(n, uFeedU);
      vec3 edge = cu > 0. ? mix(vFeedMean, vMeanT, smoothstep(0., .8, cu)) : mix(vFeedMean, vMeanB, smoothstep(0., .8, -cu));
      float wash = max(smoothstep(.25, .6, uPx * zq), smoothstep(mix(1.02, 1.1, uEase), mix(1.55, 1.6, uEase), turns));
      fd = mix(fd, edge, wash * (1. - uEase));
      far = mix(far, fd, uLive);
    }
    col = far;
  } else {
    // ---- the ray stays here: it leaves along a line through Q with direction g
    float s = x - 1.;
    float t = log(clamp(s, ${L}, ${me}.) / ${L}) / log(${me}. / ${L});
    vec4 tab = textureLod(tTable, vec2((128.5 + 127. * t) / 256., row), 0.);
    float alpha = cp > 0. ? tab.r + tab.b : 0., q = cp > 0. ? max(tab.g, 1e-3) : 1.;
    float PHI = alpha + PI - psi, cP = cos(PHI), sP = sin(PHI);
    vec3 g = normalize(-e * cP + n * sP), hh = n * cP + e * sP;
    vec3 Q = uC - hh * (A * x);
    float tca = max(l * cp, 1.);
    // sea met before the ball is ordinary sea, on the straight ray; sea met beyond it is found on the bent one
    // (fix0) Where both the straight ray and the bent one meet the sea, there is ONE sea: its meeting point is eased
    // from the bent ray's to the straight ray's. (Cross-fading two pictures of the swell, a few metres apart, cut
    // every crest in two along the line where they met.)
    float wS = 0., t0 = 0.;
    if (d.y < -1e-4) {
      t0 = eye.y / max(-d.y, 1e-4);
      wS = cp > 0. ? 1. - smoothstep(.75, 1.15, t0 / tca) : 1.;
    }
    float tsea = 1e9;
    bool seaB = g.y < -1e-4;
    if (seaB) tsea = max(Q.y, 0.) / max(-g.y, 1e-4);
    if (seaB && wS > 0.) {
      col = sea(mix(Q.xz + g.xz * tsea, eye.xz + d.xz * t0, wS), normalize(mix(g, d, wS)), mix(tsea + tca, t0, wS), mix(q, 1., wS), e, ballCol * wS);
    } else {
      vec3 colB;
      if (seaB) colB = sea(Q.xz + g.xz * tsea, g, tsea + tca, q, e, vec3(0.));
      else colB = sky(g, q, uPx * q * abs(hh.y));               // hh = dg/dPHI: how fast the squeeze climbs the sky
      col = colB;
      if (wS > 0.) col = mix(colB, sea(eye.xz + d.xz * t0, d, t0, 1., e, ballCol), wS);
    }
    // the licence: where this side is squeezed past what pixels can hold, its own blurred average, 2.2 times brighter
    float band = cp > 0. ? 1. - smoothstep(.6, 1., (psi - rim) / max(uThreadPx * uPx, 1e-6)) : 0.;
    float sq = max(smoothstep(.12, .45, uPx * q) * (1. - wS), band);
    col = mix(col, threadCol(e, n), sq);
    // the lamps, the hull and the fireball: how far each lies from this pixel's outgoing line
    vec3 add = vec3(0.), heart = vec3(0.); float dark = 0., seat = 0.;
    float sun = uHeart;   // (lead3, lead4) the lamps' hearts: keyed on the flight, not on the hour (uHeart: 1 from u 0 while the two images are points and young arcs, 0 from u 0.22 on, so never where the ring stands)
    float sig = 1.7 * uPx * q;
    float lk = mix(mix(.84, 1., max(smoothstep(1.3, 3., q), uRing)), 1., uHeart);     // (polish1) in the plain view a lamp is a point 3 px across, not 5. (lead4) From u 0 to 0.2, where the hearts stand, the scale is 1.0; from u 0.22 on it is as it was
    vec3 o = cross(e, n);
    vec3 vc = uLampP[2].xyz - Q; float tlc = max(dot(vc, g), 1.);
    float mc = dot(vc - g * tlc, hh) / tlc;                       // the boat's own miss, along the squeeze
    // the trawler itself, seen from astern: where this pixel's outgoing line crosses the plane the boat stands in,
    // tested against her outline (hull, wheelhouse, mast, the two booms out to the lamps, their stays)
    float hullA = 0.; vec3 hullC = vec3(.0015, .0021, .0037);
    if (abs(g.z) > 1e-4) {
      float tz = (uBoat.z - Q.z) / g.z;
      if (tz > 1. && tz < tsea) {
        vec2 bp = (Q.xy + g.xy * tz - uBoat.xy) / max(uBoat.w, 1e-6);
        bp.y += bp.x * uBoatR.x;
        float aa = max(1.3 * uPx * tz * max(q, 1.) / max(uBoat.w, 1e-6), 1e-4), ax = abs(bp.x);
        float dHull = max(ax - (.36 + .10 * clamp(bp.y / .30, 0., 1.)), max(-bp.y, bp.y - .30));
        float dHouse = max(ax - .21, max(.24 - bp.y, bp.y - .76));
        float dMast = max(ax - max(.030, .7 * aa), max(.70 - bp.y, bp.y - 1.62));
        vec2 pa = vec2(ax, bp.y) - vec2(0., .98), ba = vec2(1., uBoatR.y - .98);
        float dBoom = length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)) - max(.026, .7 * aa);
        vec2 pb = vec2(ax, bp.y) - vec2(0., 1.62), bb = vec2(1., uBoatR.y - 1.62);
        float dStay = length(pb - bb * clamp(dot(pb, bb) / dot(bb, bb), 0., 1.)) - max(.010, .6 * aa);
        float dAll = min(min(dHull, dHouse), min(dMast, dBoom));
        float crisp = 1. - smoothstep(.26, .70, aa);                  // squeezed past a pixel a boom, she is only her dark
        hullA = max(1. - smoothstep(-aa, aa, dAll), .8 * (1. - smoothstep(-aa, aa, dStay))) * crisp;
        hullC += (uLampC[0].rgb * clamp(.45 - bp.x, 0., 1.) + uLampC[1].rgb * clamp(.45 + bp.x, 0., 1.)) * (.016 * smoothstep(.05, .40, bp.y));      // (polish1) her house and mast lit red to port, green to starboard, by her own lamps
      }
    }
    float cover = 0.;
    for (int i = 0; i < NL; i++) {
      vec3 v = uLampP[i].xyz - Q; float tl = dot(v, g);
      vec3 va = uLampP[i].xyz - uC; float rho = length(va - e * dot(va, e));        // the lamp's distance off the axis
      float s0 = max(uLampP[i].w, 1e-6);
      float sr = max(s0, sig * lk), st = max(s0, 1.7 * lk * uPx * rho / (max(abs(tl), 1.) * max(sp, 1e-3)));
      if (i < 2) st *= 1. - .12 * uRing;                 // the ring: four arcs with dark between them, not one band (polish2: .12, red lay against green)
      float deep = smoothstep(.10, .17, sig) * uDeep;
      if (tl > 1. && tl < tsea) {
        vec3 m = v - g * tl;
        float mi = dot(m, hh) / tl, mo = dot(m, o) / tl;
        if (uLampC[i].w > .5) {
          // the hull: a dark body, wider than tall, at least a pixel and a half across
          float ex = (mi * mi) / (sr * sr * 2.) + (mo * mo) / (st * st * 2.);
          dark = max(dark, exp(-ex * 1.5));
        } else {
          if (i < 2) mi = lampApart(mi, mc, sig, s0);
          float I = exp(-.5 * (mi * mi / (sr * sr) + mo * mo / (st * st)));
          // the ring: a lamp's images lie in the one plane that holds the lamp and the axis; the glare's long tail
          // round the ring is cut there, so the four arcs stand apart with dark between them
          float inPl = mix(1., smoothstep(.60, .85, abs(dot(n, va - e * dot(va, e))) / max(rho, 1e-3)), i < 2 ? uRing : 0.);
          float amp = inPl * (1. - deep) * clamp(3. * s0 * s0 / (sr * st), uLamp.y, 1.);
          // (polish2) drawn out by the throat a lamp's image is still a lamp: a warm-white core, its colour round it,
          // and a soft glow of that colour falling off to the dark (two hard-edged bands of flat colour read as a fringe)
          float arcK = i < 2 ? smoothstep(2.5, 7., q) : 0.;
          float I2 = I * I, halo = exp(-.5 * (mi * mi / (sr * sr * 7.) + mo * mo / (st * st * 1.25)));
          // (polish2) in the plain view a lamp point keeps its hue through the tone map: its two weak channels are cut
          vec3 lc = uLampC[i].rgb, lq = lc * lc * (.68 / max(max(lc.r, lc.g), max(lc.b, 1e-3)));
          if (i < 2) lc = mix(lq * mix(1., 1. / .68, uHeart), lc, max(smoothstep(1.3, 3., q), uRing));   // (lead4) from u 0 to 0.2 the hue cut is 1.0 (the point as bright as the lamp); from u 0.22 on it is .68, as it was
          add += lc * (amp * (I + arcK * .22 * halo)) + vec3(2.6, 2.1, 1.35) * (amp * arcK * I2 * I2 * I2);
          if (i < 2) {
            // (lead3) while the sunset act runs the sky and sea behind a lamp are as bright as the lamp, and light laid
            // over them comes out of the tone map pink-white and mint. So the heart of each lamp point (her own, and
            // her copy's by the rim) stands on its own dark, three pixels across or the lamp's own width, and is held at
            // the level the tone map still shows as red and as green. Outside the heart nothing is changed.
            float hr = max(1.6 * uPx * (q + tca / tl), sr), ht = max(1.6 * uPx * rho / (tl * max(sp, 1e-3)), st);   // 1.6 px on the screen, radially and round the ball
            float pt = sun * inPl * (1. - deep) * (1. - smoothstep(1., 1.4, sqrt(mi * mi / (hr * hr) + mo * mo / (ht * ht))));
            seat = max(seat, pt); heart += lq * ((i == 0 ? .49 : .205) * pt);
          }
        }
      }
      if (i < 2 && g.y < -1e-4) {
        // (fix0) a ray that meets the sea before it reaches the lamp ends on the water, and the water mirrors the lamp:
        // the same test against the lamp's image under the surface, widened by the swell. Under the ball, where the
        // sea hides the lower half of the ring, this is the lamps' light on the bent sea and it closes the ring.
        vec3 vm = vec3(v.x, -uLampP[i].y - Q.y, v.z); float tm = dot(vm, g);
        if (tm > tsea && tm > 1.) {
          vec3 m = vm - g * tm;
          float mi = lampApart(dot(m, hh) / tm, mc, sig, s0), mo = dot(m, o) / tm;
          float wr = 1.45 + .22 * sin(uTime * 2.1 + 1.7 * mo / max(st, 1e-5)), sr2 = sr * wr, st2 = st;
          float I = exp(-.5 * (mi * mi / (sr2 * sr2) + mo * mo / (st2 * st2)));
          vec3 vam = vec3(va.x, -uLampP[i].y - uC.y, va.z), vpm = vam - e * dot(vam, e);
          float inPl = smoothstep(.60, .85, abs(dot(n, vpm)) / max(length(vpm), 1e-3));
          add += uLampC[i].rgb * (I * inPl * (1. - deep) * uRing * .75 * clamp(3. * s0 * s0 / (sr * st), uLamp.y, 1.));
        }
      }
      if (i < 2 && cp > 0.) {
        // Deep in the thread, from the hold on, there is no room across it at all. Every plane through a lamp
        // holds images of it without end, crowding to the rim on both sides: they are drawn as one spark in the
        // middle of the thread where that plane cuts it, the red and the green side by side along the thread
        float ln = max(length(v), 1.), sD = max(s0, 1.7 * uPx * rho / (ln * max(sp, 1e-3)));
        float sd = dot(v, o) / ln - (i == 0 ? 2.1 : -2.1) * sD;
        float rr = (psi - rim) / max(uPx, 1e-6) - .55 * uThreadPx;
        float Id = exp(-.5 * (sd * sd / (.9 * sD * sD) + rr * rr / 6.)) * uDeep;
        cover = max(cover, exp(-.5 * (sd * sd / (2.6 * sD * sD) + rr * rr / 12.)) * uDeep);    // a dark setting for the bead
        add += uLampC[i].rgb * (Id * 2.8 / max(max(uLampC[i].r, uLampC[i].g), max(uLampC[i].b, .1)));
      }
    }
    col *= 1. - .93 * cover;
    col *= 1. - seat * (1. - wS); add = add * (1. - seat) + heart;      // (lead3) the lamps' hearts: their own dark, their own colour
    col = mix(col * (1. - .96 * dark * (1. - wS)), hullC, hullA * (1. - wS)) + add * (1. - wS);
  }
  // the thread's own glow: the ember of the flanks spilling a few pixels outward from the rim. (lead4) On this side of
  // the rim only (x >= 1): inside it every pixel is the far world's
  if (cp > 0. && x >= 1.) col += EMBER * (.75 * uThread.x * threadHot(n).x * exp(-abs(psi - rim) / max(1.3 * uThreadPx * uPx, 1e-6)));
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 61.) - .5) / 255.;
  gl_FragColor = vec4(max(col, vec3(0.)), 1.);
}`;async function We(R,d){const{C:k,a:h,dir:D,length:v}=d,w=R.portalView,t=d.boat,V=v*1.12/h,T=await Ge(R,V);await R.yield();const A=.5227,U=57*Math.PI/180,S=.5,a=Math.min(Math.max(.55*d.stars,.4),.52),c=a+(Math.min(Math.max(2.3*d.stars,.8),1.45)-a)*A,u=Math.min(d.glow[2]*S*(1.16-.42*A),.5),i=[],s=[];for(let M=0;M<ye;M++)i.push(new e.Vector4(0,-1e5,0,.0035)),s.push(new e.Vector4(0,0,0,0));const x=new e.Vector3(1,.03,.02).multiplyScalar(3.6),r=new e.Vector3(.02,.8,.33).multiplyScalar(3.6),l=new e.Vector3(.55,1,.72),p={uCam:{value:new e.Matrix4},uProj:{value:new e.Vector4(1,1,0,0)},uC:{value:k.clone()},uA:{value:h},uTabL:{value:V},uTime:{value:0},uPx:{value:.002},uEase:{value:0},uLive:{value:0},uSide:{value:d.side},uStars:{value:c},uThreadPx:{value:1.5},uSwells:{value:(d.detail||1)<.7?0:1},uGlow:{value:new e.Vector3(d.glow[0],d.glow[1],u)},uStandRot:{value:new e.Matrix3},tTable:{value:T.tex},tFeed:{value:w.texture},uFeedPV:{value:w.matrix},uGain:{value:w.gain},uFeedPos:{value:new e.Vector3},uFeedR:{value:new e.Vector3(1,0,0)},uFeedU:{value:new e.Vector3(0,1,0)},uFeedTan:{value:new e.Vector3(1,1.78,.94)},uLampP:{value:i},uLampC:{value:s},uLamp:{value:new e.Vector3(2,.55,1.2)},uBoat:{value:new e.Vector4(0,0,t.z,t.half)},uBoatR:{value:new e.Vector2(0,.2)},uCheap:{value:new e.Vector2((d.detail||1)<.7?4:6,(d.detail||1)<.7?2:4)},uZoom:{value:1},uZoomS:{value:1},uRing:{value:0},uRingK:{value:.75},uColK:{value:1.35},uColW:{value:1.1},uColB:{value:.42},uDeep:{value:0},uThread:{value:new e.Vector3(.85,.8,.45)},uPool:{value:new e.Vector2(.16,1/1800)},uWarm:{value:0},uHeart:{value:1},uDusk:{value:new e.Vector4(Math.sin(U),Math.cos(U),A,0)},uWake:{value:new e.Vector4(0,0,t.z,t.sign)}},F=new e.BufferGeometry;F.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const H=new e.ShaderMaterial({uniforms:p,vertexShader:Re,fragmentShader:Ie+De+Ve,depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1}),W=new e.Mesh(F,H);W.frustumCulled=!1,W.renderOrder=0,await R.yield();const z=(M,B,q)=>{const f=Math.min(1,Math.max(0,(q-M)/(B-M)));return f*f*(3-2*f)},g=new e.Vector2,K=new e.Vector3,$=new e.Quaternion,ke=new e.Vector3,ze=new e.Quaternion().setFromRotationMatrix(new e.Matrix4().lookAt(new e.Vector3,D,new e.Vector3(0,1,0))),_=new e.Quaternion,ee=new e.Vector3,ce=new e.Matrix4,Pe=new e.Vector3(1,1,1),ue=new e.Matrix4,Me=new e.Vector3(.35,.9,.26).normalize(),He=new e.Vector3,N=d.portal,fe=.8*h,pe=92,le=104,we=.29,qe=4.5*h,Ce=1.9*h,Le=.955;let ie=0;const Te=Math.log(L),ve=n/2,Se=(M,B)=>{const q=Math.log(Math.max(1-M,L))/Te*(ve-1),f=Math.min(ve-2,Math.floor(q)),O=q-f,o=Math.min(1,Math.max(0,B/V))*(C-1),b=Math.min(C-2,Math.floor(o)),m=o-b,P=T.phi,X=P[b*n+f]*(1-O)+P[b*n+f+1]*O,E=P[(b+1)*n+f]*(1-O)+P[(b+1)*n+f+1]*O;return X*(1-m)+E*m},I={l:v,ease:0,live:0,feedFov:pe,boatX:0,zoom:we};function Fe(M,B,q,f,O){const o=p,b=q.projectionMatrix.elements;o.uCam.value.copy(q.matrixWorld),o.uProj.value.set(b[0],b[5],b[8],b[9]),O.getDrawingBufferSize(g),o.uPx.value=2/(Math.max(b[5],.001)*Math.max(g.y,1)),o.uTime.value=B,q.matrixWorld.decompose(K,$,ke);const m=v*(1-f);I.l=m,o.uThreadPx.value=(1.6+(1-z(2*h,3.2*h,m))*2.1)*Math.max(1,g.y/450)**.5,o.uDeep.value=1-z(2*h,3.2*h,m);const P=1-z(14,fe,m);o.uEase.value=I.ease=P,o.uHeart.value=1-z(.212,.22,f);const X=Math.min(1,Math.max(-1,(f-.275)/.225)),E=t.sign*t.sweep*X*(.35+.65*X*X);I.boatX=E;const te=.45*Math.sin(B*.66),he=.7*Math.sin(B*.52+1);i[0].set(E-t.half,t.lampY+te+he,t.z,t.glare),s[0].set(x.x,x.y,x.z,0),i[1].set(E+t.half,t.lampY+te-he,t.z,t.glare),s[1].set(r.x,r.y,r.z,0),o.uBoat.value.set(E,te-1,t.z,t.half),o.uBoatR.value.set(he/t.half,(t.lampY+1)/t.half),i[2].set(E,2.6+te,t.z,.5*t.half/Math.abs(t.z-k.z)),s[2].set(0,0,0,1);const ae=1-z(.035,.13,Math.abs(f-.275));o.uRing.value=ae,o.uLamp.value.y=.55+.45*ae,o.uPool.value.x=.16*(1-.85*ae),o.uWake.value.set(-t.sign*t.sweep*1.9,E,t.z,t.sign),o.uDusk.value.w=(1-.75*ae)*z(2.2*h,3.2*h,m);for(let y=0;y<7;y++){const G=(f-.5)/.1-y*.016,ne=d.rare&&G>0&&G<1?Math.sin(Math.PI*G)**.7:0,Y=(-46+34*G)*Math.PI/180*d.side,j=(19.5-8*G)*Math.PI/180,Q=3e4;i[3+y].set(k.x+Q*Math.cos(j)*Math.sin(Y),Q*Math.sin(j),k.z-Q*Math.cos(j)*Math.cos(Y),.0052-y*5e-4);const J=ne*(y===0?5:2.2*(1-y/7)**1.5),se=y===0?.3:0;s[3+y].set((l.x+se*(1-l.x))*J,l.y*J,(l.z+se*(1-l.z))*J,0)}ue.makeRotationAxis(Me,B*.4*Math.PI/180),o.uStandRot.value.setFromMatrix4(ue),o.tFeed.value=w.texture,o.uFeedPV.value=w.matrix,o.uGain.value=w.gain,w.live&&f>0&&(ie=M>0&&M<.5?ie+M:1.6),o.uLive.value=I.live=z(0,1.6,ie);const xe=z(Ce,qe,m);o.uZoomS.value=1+(we-1)*xe;const oe=m>fe?le+(pe-le)*xe:q.fov+(le-q.fov)*(1-P);I.feedFov=oe;{const y=Math.tan(oe*Math.PI/360),G=g.x/Math.max(g.y,1),ne=.94+.06*P,Y=1/Math.max(b[5],.001),j=1/Math.max(b[0],.001),Q=Math.sqrt(m*m+h*h)/h,J=m/h,se=1+.05*(1-P);let re=1;for(let Z=0;Z<3;Z++){const Ae=Z===0?y:Z===1?y*G:y*Math.hypot(1,G),de=Z===0?Y:Z===1?j:Math.hypot(Y,j),be=Math.min(Le,Q*de/Math.sqrt(1+de*de)*se),Be=Math.asin(Math.min(1,be/Q)),Ee=Se(be,J)*(1-P)+Be*P;re=Math.min(re,Math.atan(Ae)*ne/Math.max(Ee,.001))}o.uZoom.value=I.zoom=re}m>6?(ee.copy(k).addScaledVector(D,-Math.min(m,12)),_.slerpQuaternions(ze,$,1-z(12,20,m)),ce.compose(ee,_,Pe),N.feedPose=ce,N.feedFov=oe,N.show=!1):(ee.copy(K),_.copy($),N.feedPose=null,N.feedFov=void 0,N.show=!!w.live),o.uFeedPos.value.copy(ee),o.uFeedR.value.set(1,0,0).applyQuaternion(_),o.uFeedU.value.set(0,1,0).applyQuaternion(_);const ge=Math.tan((m>6?oe:q.fov)*Math.PI/360);o.uFeedTan.value.set(ge,ge*g.x/Math.max(g.y,1),.94+.06*P)}return{object:W,uniforms:p,update:Fe,state:I,table:T,dispose(){}}}export{We as buildThroat};
