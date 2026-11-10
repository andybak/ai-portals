import*as T from"three";const et=Math.PI/180,mt=27*et,X=Math.sin(mt),Q=Math.cos(mt),ot=Math.tan(mt),s={PHI:mt,SP:X,CP:Q,TP:ot,HW:14,SW:9,PH:8,ZTOP:500,ZEND:530,ARCH:{z:392,w:9,s:6.4,h:22},QC:{y:287*ot,z:287},QR:150,QW:11,FINT:4,FINA:159,FARCH:[[66,9,5,15],[101,11,12,37],[134,11,24,72]],KZ:515,KPX:11,KPZ:12,KPR:1.25,SLABH:13.5,DRUM:4.2,DOMEK:1.22,DOMER:15,BOWL:{x:110,z:60,r:40}};s.PLAT=s.ZTOP*ot-s.PH,s.FING=s.QC.y/Q,s.SLABY=s.PLAT+31,s.DOMEY=s.SLABY+1.4+s.DRUM,s.DOMETOP=s.DOMEY+s.DOMER*s.DOMEK*Math.sin(1.5)+4.2,s.DIAL=new T.Vector3(0,s.KZ*ot-3,s.KZ),s.MINI=[[-300,330,170,6.5],[-70,30,92,4.2],[330,130,118,5],[-380,262,84,4],[-110,-205,84,4],[-10,-222,110,4.8],[118,-200,92,4.2],[182,-190,100,4.5],[318,-84,132,5.5],[236,560,170,6.5]],s.FAR=[[-560,560,300,10],[-250,820,240,8],[470,620,340,11],[160,900,250,9],[-690,40,320,10.5],[-520,-340,240,8],[-250,-650,260,9],[130,-720,300,10],[470,-540,280,9.5],[650,140,320,10.5],[610,-210,220,8]],s.NEAR=[[182,262,46,2.4],[128,222,34,2],[205,196,40,2.2]],s.MINI=s.MINI.concat(s.NEAR,s.FAR),s.miniArch=(t,e)=>[t+.72*e,.045*e,.05*e,.15*e],s.RAM=[[120,440,46,32],[238,470,46,32]],s.COMPASS=[[155,60,104,6,236],[-150,610,76,5,150],[96,624,58,5,118]],s.RAMP=.3,s.BOWL2={x:200,z:60,r:40},s.FLANKQ=[[92,40,33,1],[156,40,33,-1],[196,72,52,1],[288,72,52,-1]];const pt=t=>Math.sqrt(Math.max(0,4-(1+Math.min(1,Math.abs(t)))**2))/Math.sqrt(3),nt=[0,.185,.27,.54,1],dt=[8.5,9+20/60,11+28/60,12,13.5],wt=(()=>{const t=nt.length,e=[],n=[];for(let a=0;a<t-1;a++)e.push((dt[a+1]-dt[a])/(nt[a+1]-nt[a]));n[0]=e[0],n[t-1]=e[t-2];for(let a=1;a<t-1;a++)n[a]=e[a-1]*e[a]<=0?0:2*e[a-1]*e[a]/(e[a-1]+e[a]);return n})();function gt(t){t=Math.min(1,Math.max(0,t));let e=0;for(;e<nt.length-2&&t>nt[e+1];)e++;const n=nt[e+1]-nt[e],a=(t-nt[e])/n,f=a*a,o=f*a;return(2*o-3*f+1)*dt[e]+(o-2*f+a)*n*wt[e]+(-2*o+3*f)*dt[e+1]+(o-f)*n*wt[e+1]}const At=-23.44*et;function bt(t,e=new T.Vector3){const n=(t-12)*15*et,a=Math.cos(At),f=Math.sin(At);return e.set(-a*Math.sin(n),f*X+a*Math.cos(n)*Q,f*Q-a*Math.cos(n)*X).normalize()}const A={PLASTER:0,STONE:1,SCALE:2,FLOOR:3,MARBLE:4,LEAD:5,DARK:6,NOSING:7,BOWL:8,TREAD:9,BAND:10,DOME:11},G={NONE:0,BODY:1,PARW:2,PARE:3,PLAT:4,TUNNEL:5,FINW:6,FINE:7},Mt=["#E0B45A","#9E4A32","#F5F2EA","#5B5F8C","#5E9BD1","#6B6E73","#7DAA3C"],vt=t=>(t*(t+.0245786)-90537e-9)/(t*(.983729*t+.432951)+.238081);function zt(t){const e=t[0]/.6,n=t[1]/.6,a=t[2]/.6,f=vt(.59719*e+.35458*n+.04823*a),o=vt(.076*e+.90834*n+.01566*a),p=vt(.0284*e+.13383*n+.83777*a);return[1.60475*f-.53108*o-.07367*p,-.10208*f+1.10813*o-.00605*p,-.00327*f-.07276*o+1.07602*p].map(g=>Math.min(1,Math.max(0,g)))}function st(t){const e=[t.r,t.g,t.b];let n=e.slice();for(let a=0;a<40;a++){const f=zt(n);n=n.map((o,p)=>Math.max(1e-4,o*(.5+.5*(e[p]+.002)/(f[p]+.002))))}return new T.Color(n[0],n[1],n[2])}function Nt(t={}){const e=(t.palette||Mt).map(o=>new T.Color(o)),n=t.colourway==="delhi",a={uSun:{value:bt(8.5)},uSunCol:{value:new T.Color(1,1,1)},uSunI:{value:1},uWash:{value:st(n?e[1].clone().lerp(e[0],.14):e[0])},uFloorCol:{value:st(e[0].clone().lerp(e[2],1/3))},uStone:{value:st(e[1])},uMarble:{value:e[2].clone()},uShade:{value:st(e[3])},uSky:{value:st(e[4])},uLead:{value:st(e[5])},uGreen:{value:st(e[6])},uWhiteBoost:{value:st(e[2]).clone().multiply(new T.Color(1/e[2].r,1/e[2].g,1/e[2].b))},uHazeCol:{value:st(e[2].clone().lerp(e[0],.3))},uHaze:{value:17e-5*(1+1.6*(t.haze||0))},uSoft:{value:.003*(1+2*(t.haze||0))},uGain:{value:1},uShadeK:{value:1},uTime:{value:0},uU:{value:0},uSeed:{value:(t.seed??0)%97},uMx:{value:t.mirror?-1:1},uTickRate:{value:0},uNosing:{value:1},uEcl:{value:0},uPxK:{value:.00278},uBirds:{value:Array.from({length:8},()=>new T.Vector4(0,-1e4,0,.5))},uFlank:{value:0}},f={uniforms:a,palette:e,hours:8.5,setSun(o){f.hours=o,bt(o,a.uSun.value);const p=1-Math.min(1,Math.max(0,a.uSun.value.y/.5));a.uSunCol.value.setRGB(1,.995-.04*p,.98-.11*p)},setProgress(o){a.uU.value=o,f.setSun(gt(o))},setTime(o){a.uTime.value=o}};return f.setProgress(0),f}const x=t=>Number(t).toFixed(4),J=s.FARCH,yt=`
uniform vec3 uSun, uSunCol, uWash, uFloorCol, uStone, uMarble, uShade, uSky, uLead, uGreen, uHazeCol;
uniform float uSunI, uHaze, uSoft, uTime, uU, uSeed, uTickRate, uNosing, uPxK, uEcl;
uniform vec4 uBirds[8];
uniform float uFlank;
const float SPc = ${x(X)}, CPc = ${x(Q)}, TPc = ${x(ot)};
const float HW = ${x(s.HW)}, SW = ${x(s.SW)}, PH = ${x(s.PH)}, ZTOP = ${x(s.ZTOP)}, ZEND = ${x(s.ZEND)}, PLAT = ${x(s.PLAT)};
const float AZ = ${x(s.ARCH.z)}, AW = ${x(s.ARCH.w)}, AS = ${x(s.ARCH.s)}, AH = ${x(s.ARCH.h)};
const float QCY = ${x(s.QC.y)}, QCZ = ${x(s.QC.z)}, QR = ${x(s.QR)}, QW = ${x(s.QW)}, FINT = ${x(s.FINT)}, FINA = ${x(s.FINA)}, FING = ${x(s.FING)};
const float KZ = ${x(s.KZ)}, KPX = ${x(s.KPX)}, KPZ = ${x(s.KPZ)}, KPR = ${x(s.KPR)}, DOMER = ${x(s.DOMER)}, SLABY = ${x(s.SLABY)};
uniform float uMx;   // +1 forenoon yard, -1 the yard mirrored east for west (afternoon)
#define BOWL vec3(uMx * ${x(s.BOWL.x)}, ${x(s.BOWL.z)}, ${x(s.BOWL.r)})
// the bowl a point belongs to: the first (with the slot) or its pair to the east
vec3 bowlAt(float x){ return vec3(uMx * (uMx * x > ${x((s.BOWL.x+s.BOWL2.x)/2)} ? ${x(s.BOWL2.x)} : ${x(s.BOWL.x)}), ${x(s.BOWL.z)}, ${x(s.BOWL.r)}); }
const vec3 POLE = vec3(0., SPc, CPc);     // the one axis
const vec3 DOWNQ = vec3(0., -CPc, SPc);   // down the quadrant's plane (square to the pole)

float h11(float n){ return fract(sin(n * 12.9898) * 43758.5453); }
float h21(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float vnoise(vec2 p){ vec2 i = floor(p), q = fract(p); q = q*q*(3. - 2.*q);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), q.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), q.x), q.y); }

float archH(float t){ t = clamp(abs(t), 0., 1.); return sqrt(max(4. - (1. + t)*(1. + t), 0.)) / 1.7320508; }
// pointed opening standing on the floor: < 0 inside the opening
float sdArch(float x, float h, float w, float s, float H){ return max(abs(x) - w, h - (s + (H - s) * archH(x / w))); }

void cutP(float dist, float dn, inout float tE, inout float tX){
  float sdn = abs(dn) < 1e-6 ? 1e-6 : dn;
  float t = -dist / sdn;
  if (sdn < 0.) tE = max(tE, t); else tX = min(tX, t);
}
// convex prism x0..x1, z0..z1, y >= y0, under the plane dot(nT, p) <= dT. Returns (chord length, distance to entry).
vec2 prism(vec3 o, vec3 s, float x0, float x1, float z0, float z1, float y0, vec3 nT, float dT){
  float tE = 0., tX = 1e5;
  cutP(o.x - x1, s.x, tE, tX); cutP(x0 - o.x, -s.x, tE, tX);
  cutP(o.z - z1, s.z, tE, tX); cutP(z0 - o.z, -s.z, tE, tX);
  cutP(y0 - o.y, -s.y, tE, tX);
  cutP(dot(nT, o) - dT, dot(nT, s), tE, tX);
  return vec2(tX - tE, tE);
}
float pen(vec2 gt, float px){ return 1. - smoothstep(0., max(gt.y * uSoft * 2., px), gt.x); }
// the sandstone coping that oversails a flank of the great wall by 0.35 m, as a caster: a slab between two planes parallel to
// the pole. Near noon, when the sun rakes the flank, its shadow comes down the plaster as one straight edge parallel to the stair.
vec2 copingSlab(vec3 o, vec3 s, float x0, float x1){
  vec3 nT = vec3(0., CPc, -SPc); float tE = 0., tX = 1e5, dn = dot(nT, s), d0 = dot(nT, o);
  cutP(o.x - x1, s.x, tE, tX); cutP(x0 - o.x, -s.x, tE, tX);
  cutP(o.z - ZTOP, s.z, tE, tX); cutP(2.4 - o.z, -s.z, tE, tX);
  cutP(d0, dn, tE, tX); cutP(-1.2 * CPc - d0, -dn, tE, tX);
  return vec2(tX - tE, tE);
}

float tunnelSd(vec3 o, vec3 s, float xf){
  float sx = abs(s.x) < 1e-4 ? 1e-4 : s.x;
  float t = (xf - o.x) / sx; vec3 q = o + s * t;
  return t < 0. ? -1. : sdArch(q.z - AZ, q.y, AW, AS, AH);
}
float finSd(vec2 ab){
  float sd = max(max(QR + 0.6 - length(ab), -ab.x), max(ab.x - FINA, max(-ab.y, ab.y - FING)));
  float h = FING - ab.y;
  sd = max(sd, -sdArch(ab.x - ${x(J[0][0])}, h, ${x(J[0][1])}, ${x(J[0][2])}, ${x(J[0][3])}));
  sd = max(sd, -sdArch(ab.x - ${x(J[1][0])}, h, ${x(J[1][1])}, ${x(J[1][2])}, ${x(J[1][3])}));
  sd = max(sd, -sdArch(ab.x - ${x(J[2][0])}, h, ${x(J[2][1])}, ${x(J[2][2])}, ${x(J[2][3])}));
  return sd;
}
float finVis(vec3 o, vec3 s, float side, float px){
  vec3 q = o - vec3(side * HW, QCY, QCZ);
  float sp = dot(s, POLE); sp = abs(sp) < 1e-4 ? 1e-4 : sp;
  float ax = dot(q, POLE), vis = 1.;
  for (int i = 0; i < 4; i++){
    float t = (FINT * (float(i) / 1.5 - 1.) - ax) / sp;
    vec3 h = q + s * t;
    float w = max(t * uSoft, px);
    float v = smoothstep(-w, w, finSd(vec2(side * h.x, dot(h, DOWNQ))));
    vis = min(vis, t > 0.05 ? v : 1.);
  }
  return vis;
}
float bandHit(float t, vec2 p2, vec2 d2, float ax, float sa, float px){
  vec2 h = p2 + d2 * t; float w = max(t * uSoft, px);
  float sd = max(abs(ax + sa * t) - QW, max(-h.x, -h.y));
  return t < 0.6 ? 1. : smoothstep(-w, w, sd);
}
float bandVis(vec3 o, vec3 s, float side, float px){
  vec3 q = o - vec3(side * HW, QCY, QCZ);
  float ax = dot(q, POLE), sa = dot(s, POLE);
  vec2 p2 = vec2(side * q.x, dot(q, DOWNQ)), d2 = vec2(side * s.x, dot(s, DOWNQ));
  float A = max(dot(d2, d2), 1e-5), B = dot(p2, d2), disc = B * B - A * (dot(p2, p2) - QR * QR);
  float sq = sqrt(max(disc, 0.));
  float v = min(bandHit((-B - sq) / A, p2, d2, ax, sa, px), bandHit((-B + sq) / A, p2, d2, ax, sa, px));
  return disc <= 0. ? 1. : v;
}
float pillarVis(vec3 o, vec3 s, vec2 c, float r, float y0, float y1, float px){
  float t = max(dot(c - o.xz, s.xz) / max(dot(s.xz, s.xz), 1e-5), 0.);
  vec3 h = o + s * t; float w = max(t * uSoft, min(px, t * 0.2)) + 1e-4;
  return smoothstep(-w, w, max(length(h.xz - c) - r, max(y0 - h.y, h.y - y1)));
}
float sphereVis(vec3 o, vec3 s, vec3 c, float r, float px){
  float t = max(dot(c - o, s), 0.); float w = max(t * uSoft, min(px, t * 0.2)) + 1e-4;
  return smoothstep(-w, w, length(o + s * t - c) - r);
}
// a creature's shadow (uBirds: xyz centre, w = k + r). k 0: a round blob of radius r (a perched bird). k 1..16: a flying bird heading
// (k - 1) sixteenths of a turn from north, r its size (0.36 = life): two ellipses, body with tail and spread wings, so that on a tread
// or a slab it reads as a bird's shadow and not as a speck. The creature shader sets gBirdShape 0 and keeps the round blob (a wing
// must not shade itself).
float gBirdShape = 1.;
float birdVis(vec3 o, vec3 s, vec4 b, float px){
  float k = floor(b.w), r = b.w - k;
  if (k < 0.5 || gBirdShape < 0.5) return sphereVis(o, s, b.xyz, r, px);
  float a = (k - 1.) * 0.3926991, sc = r / 0.36; vec2 f = vec2(sin(a), cos(a));
  vec3 d = o - b.xyz;
  vec3 q = vec3(dot(d.xz, f), d.y, d.x * f.y - d.z * f.x), e = vec3(dot(s.xz, f), s.y, s.x * f.y - s.z * f.x);   // into the bird's own frame: along its heading, up, along its wings
  float t0 = max(-dot(d, s), 0.), w = max(t0 * uSoft, min(px, t0 * 0.2)) + 1e-4;
  vec3 R1 = vec3(2.5, 0.42, 0.42) * sc, q1 = (q + vec3(0.8 * sc, 0., 0.)) / R1, e1 = e / R1;
  float d1 = (length(q1 + e1 * max(-dot(q1, e1) / dot(e1, e1), 0.)) - 1.) * 0.42 * sc;
  vec3 R2 = vec3(0.7, 0.3, 2.7) * sc, q2 = q / R2, e2 = e / R2;
  float d2 = (length(q2 + e2 * max(-dot(q2, e2) / dot(e2, e2), 0.)) - 1.) * 0.3 * sc;
  return smoothstep(-w, w, min(d1, d2));
}
// a cylinder of slotted wall (twelve piers): the ray is stopped where it crosses the wall below its top and on a pier
float ramHit(float t, vec3 o, vec3 s, vec2 c, float R, float H, float px){
  vec3 h = o + s * t; float w = max(t * uSoft, px);
  vec2 e = h.xz - c; float a = atan(e.y, abs(e.x) + abs(e.y) < 1e-4 ? 1e-4 : e.x);
  float m = abs(fract(a * 1.9098593 + .5) - .5) * R * 0.5235988;          // metres along the wall from the middle of the nearest pier
  float sd = max(m - ${x(s.RAMP)} * R * 0.5235988, h.y - H);
  return t < 0.6 ? 1. : smoothstep(-w, w, sd);
}
float ramVis(vec3 o, vec3 s, vec2 c, float R, float H, float px){
  vec2 q = o.xz - c; float A = max(dot(s.xz, s.xz), 1e-5), B = dot(q, s.xz), disc = B * B - A * (dot(q, q) - R * R);
  float sq = sqrt(max(disc, 0.));
  float v = min(ramHit((-B - sq) / A, o, s, c, R, H, px), ramHit((-B + sq) / A, o, s, c, R, H, px));
  return disc <= 0. ? 1. : v;
}
// a small gnomon's shadow, with the light that comes through its pierced arch (taken where the ray crosses the wall's middle)
float miniVis(vec3 o, vec3 s, float cx, float hw, float z0, float len, vec4 ar, float px){
  float b = pen(prism(o, s, cx - hw, cx + hw, z0, z0 + len, -1e4, vec3(0., CPc, -SPc), -SPc * z0), px);
  if (b < 1.) { float sx = abs(s.x) < 1e-4 ? 1e-4 : s.x; float t = (cx - o.x) / sx; vec3 q = o + s * t; float w = max(px, max(t, 0.) * uSoft * 2.);
    b = max(b, t < 0. ? 0. : 1. - smoothstep(-w, w, sdArch(q.z - ar.x, q.y, ar.y, ar.z, ar.w) + hw * 0.35)); }
  return b;
}
// the further instruments of the yard: small gnomons (wedges under the same pole plane) and the paired cylinders
float familyVis(vec3 o, vec3 s, float px){
  vec3 nT = vec3(0., CPc, -SPc); float v = 1.;
${s.MINI.map(([t,e,n,a])=>`  v = min(v, miniVis(o, s, uMx * ${x(t)}, ${x(a)}, ${x(e)}, ${x(n)}, vec4(${s.miniArch(e,n).map(x).join(", ")}), px));`).join(`
`)}
${s.RAM.map(([t,e,n,a])=>`  v = min(v, ramVis(o, s, vec2(uMx * ${x(t)}, ${x(e)}), ${x(n)}, ${x(a)}, px));`).join(`
`)}
  return v;
}
// (round "adds 1") THE FLANK QUADRANTS THROW THEIR SHADOWS: the four ruled marble arcs each flank of the great wall carries (G.FLANKQ) and the
// sandstone peg at each arc's centre, as casters. A plate casts as a slab 0.3 m thick lying on the plaster (so its shade starts at the plate's own
// edge), a peg as the box it is. Nothing is sampled: the ray's whole track through the slab is tested at once, so a raking sun leaves no stripes.
// flankPlate: e0, ed = the ray's track in the arc's plane, e = ((z - zc) * dir, yc - y); t1 = the ray's length inside the slab; lt = the track's
// length for one unit of t. The plate is the quarter (e.x and e.y not negative) of the ring R - 3 .. R + 3. Returns 1 lit, 0 shade.
float flankPlate(vec2 e0, vec2 ed, float t1, float lt, float R, float px){
  float ta = 0., tb = t1;
  cutP(-e0.x, -ed.x, ta, tb); cutP(-e0.y, -ed.y, ta, tb);          // the track clipped to the quarter the plate fills
  float sd = (ta - tb) * lt;                                      // above nought: the track misses the quarter by that many metres
  if (ta <= tb) {
    float tp = clamp(-dot(e0, ed) / max(dot(ed, ed), 1e-8), ta, tb);   // the foot of the perpendicular from the arc's centre, kept on the track
    float least = length(e0 + ed * tp), most = max(length(e0 + ed * ta), length(e0 + ed * tb));
    sd = max(sd, max(least - (R + 3.), (R - 3.) - most));
  } else {   // a near miss of the quarter is a near miss of the plate only where the ring is: the ring's own measure at the place of the miss
    float rr = length(e0 + ed * clamp(0.5 * (ta + tb), 0., t1));
    sd = max(sd, max(rr - (R + 3.), (R - 3.) - rr));
  }
  float w = max(t1 * uSoft, px);
  return smoothstep(-w, w, sd);
}
// one arc of a flank: its plate, then its peg (the box ox 0 .. 3.2, y within 0.5 of yc, z within 0.5 of zc; six cuts, as copingSlab)
float flankRow(vec3 o, vec3 s, float ox, float sx, float zc, float yc, float R, float dir, float px){
  float v = 1., t1 = (0.3 - ox) / sx;
  if (t1 > 0.) v = flankPlate(vec2((o.z - zc) * dir, yc - o.y), vec2(s.z * dir, -s.y), t1, length(s.yz), R, px);
  float tE = 0., tX = 1e5;
  cutP(ox - 3.2, sx, tE, tX); cutP(-ox, -sx, tE, tX);
  cutP(o.y - yc - 0.5, s.y, tE, tX); cutP(yc - 0.5 - o.y, -s.y, tE, tX);
  cutP(o.z - zc - 0.5, s.z, tE, tX); cutP(zc - 0.5 - o.z, -s.z, tE, tX);
  return min(v, pen(vec2(tX - tE, tE), px));
}
// side: which flank (both carry the same four, so no uMx); ox: metres out from the plaster; sx: how fast the ray to the sun leaves the flank.
// From inside the wall, from beyond the pegs' reach (3.2 m: with sx above nought the ray only goes further out) or with the sun not on this
// flank's side there is nothing to meet.
float flankVis(vec3 o, vec3 s, float px){
  float side = o.x < 0. ? -1. : 1., ox = side * o.x - HW, sx = side * s.x;
  if (ox < 0. || ox > 3.2 || sx <= 1e-4) return 1.;
  float v = 1.;
${s.FLANKQ.map(([t,e,n,a])=>`  v = min(v, flankRow(o, s, ox, sx, ${x(t)}, ${x(e)}, ${x(n)}, ${x(a)}, px));`).join(`
`)}
  return v;
}
// fraction of the sun's disc seen from P (1 lit, 0 shade). self = SELF id of the convex piece the fragment is on.
float sunVis(vec3 P, vec3 N, float self, float px){
  vec3 s = uSun; vec3 o = P + N * 0.04;
  vec3 nT = vec3(0., CPc, -SPc);
  float v = smoothstep(0., 0.02, s.y);
  if (abs(self - 5.) < .5) {
    v = min(v, 1. - smoothstep(-px, px, tunnelSd(o, s, s.x > 0. ? HW : -HW)));
  } else if (abs(self - 1.) > .5) {
    float b = pen(prism(o, s, -HW, HW, 0., ZTOP, -1e4, nT, -PH * CPc), px);
    if (b < 1.) { float w = max(px, 0.3); b = max(b, 1. - smoothstep(-w, w, max(tunnelSd(o, s, -HW), tunnelSd(o, s, HW)))); }
    v = min(v, b);
  }
  if (abs(self - 2.) > .5) v = min(v, pen(prism(o, s, -HW, -SW, 0., ZTOP, -1e4, nT, 0.), px));
  if (abs(self - 3.) > .5) v = min(v, pen(prism(o, s, SW, HW, 0., ZTOP, -1e4, nT, 0.), px));
  if (abs(self - 2.) > .5 && abs(self - 3.) > .5) v = min(v, min(pen(copingSlab(o, s, -HW - 0.35, -HW), px), pen(copingSlab(o, s, HW, HW + 0.35), px)));
  if (abs(self - 4.) > .5) v = min(v, pen(prism(o, s, -HW, HW, ZTOP, ZEND, -1e4, vec3(0., 1., 0.), PLAT), px));
  if (abs(self - 6.) > .5) v = min(v, finVis(o, s, -1., px));
  if (abs(self - 7.) > .5) v = min(v, finVis(o, s, 1., px));
  v = min(v, min(bandVis(o, s, -1., px), bandVis(o, s, 1., px)));
  // kiosk: four pillars, slab, dome
  v = min(v, min(min(pillarVis(o, s, vec2(-KPX, KZ - KPZ), KPR * 0.85, PLAT, SLABY, px), pillarVis(o, s, vec2(KPX, KZ - KPZ), KPR * 0.85, PLAT, SLABY, px)),
                 min(pillarVis(o, s, vec2(-KPX, KZ + KPZ), KPR * 0.85, PLAT, SLABY, px), pillarVis(o, s, vec2(KPX, KZ + KPZ), KPR * 0.85, PLAT, SLABY, px))));
  v = min(v, pen(prism(o, s, -${x(s.SLABH)}, ${x(s.SLABH)}, KZ - ${x(s.SLABH)}, KZ + ${x(s.SLABH)}, SLABY, vec3(0., 1., 0.), SLABY + 1.4), px));
  v = min(v, sphereVis(o, s, vec3(0., ${x(s.DOMEY+1)}, KZ), DOMER - 0.15, px));
  for (int i = 0; i < 8; i++) v = min(v, birdVis(o, s, uBirds[i], px));
  if (P.y < 170.) v = min(v, familyVis(o, s, px));
  if (uFlank > 0.5) v = min(v, flankVis(o, s, px));
  // the bowl: inside it the sun must come in through the rim, past the crosswire and its ring
  if (P.y < -0.02 && s.y > 1e-3) {
    float t = -o.y / s.y; vec3 h = o + s * t; float w = max(t * uSoft, px);
    vec3 BW = bowlAt(P.x); float first = step(abs(BW.x - BOWL.x), 1.);
    vec2 d = h.xz - BW.xy; float r = length(d);
    float open = min(r - BW.z, mix(1e3, max(abs(d.x) - 7., max(-d.y, d.y - 70.)), first));   // the bowl's mouth and the slot in the first one's north rim
    v = min(v, 1. - smoothstep(-w, w, open));
    float wire = min(min(abs(d.x), abs(d.y)) - 0.22, abs(r - 4.) - 0.7);   // two wires and the ring plate where they cross
    v = min(v, max(smoothstep(-w, w, wire), step(BW.z, r)));
    if (abs(d.x) < 7. && d.y > 0.) v = max(v, 0.);
  }
  return v;
}
`,Pt=`
uniform float uGain, uShadeK; uniform vec3 uWhiteBoost;
float gShadeKeep = 0.;
float gTone = 1.;        // THE HAND: how much lighter or darker than its plain pigment the mason left this fragment; yardLight keeps it in shade
float gBounce = 0.;      // warm light thrown up from sunlit ochre (set by the plaster)
float lum3(vec3 c){ return dot(c, vec3(0.3, 0.55, 0.15)); }
float gLead = 0.;        // lead coverage of the fragment: lead stays dark in shade, so a tick still reads on shaded marble   // creatures set this: how much of their own pigment survives in shade
// one level of the ruled scale. s arc coordinate, k metres per unit of s, fs = fwidth(s). Returns lead coverage 0..1.
float tick(float s, float pitch, float hwm, float len, float w, float fw, float k, float fs, float boost){
  float x = s / pitch, idx = floor(x + .5);
  float d = abs(x - idx) * pitch * k, pxm = max(fs * k, 1e-5);
  float hw = max(hwm, 0.75 * pxm);
  float a = (1. - smoothstep(hw - pxm * .5, hw + pxm * .5, d)) * sqrt(hwm / hw);
  float hsh = h11(idx * 0.731 + pitch + uSeed);
  a *= hsh < 0.045 ? 0.22 : 1.;                                   // a few ticks have lost their lead
  float avg = min(1., boost * 2. * hwm / (pitch * k));            // below 6 px a pitch: the flat average tint
  a = mix(avg, a, smoothstep(3., 6., pitch * k / pxm));
  float L = len * (0.94 + 0.12 * hsh);                           // the hand: lengths vary 6 percent
  return a * (1. - smoothstep(L - fw, L + fw, w)) * step(0., w);
}
float lineAA(float d, float hwm, float pxm){ pxm = max(pxm, 1e-5); float hw = max(hwm, 0.75 * pxm);
  return (1. - smoothstep(hw - pxm * .5, hw + pxm * .5, abs(d))) * sqrt(hwm / hw); }
vec2 faceUV(vec3 P, vec3 N){ return abs(N.x) > 0.7 ? P.zy : (abs(N.y) > 0.75 ? P.xz : P.xy); }

vec2 gArc = vec2(0., -9.);   // the mesh's arc attribute: on a jamb x > 50 marks an arris strip (x - 100 = half width, y = metres from the middle)
float patchBox(vec2 q, vec2 lo, vec2 hi, vec2 e){
  return smoothstep(lo.x - e.x, lo.x + e.x, q.x) * (1. - smoothstep(hi.x - e.x, hi.x + e.x, q.x)) * smoothstep(lo.y - e.y, lo.y + e.y, q.y) * (1. - smoothstep(hi.y - e.y, hi.y + e.y, q.y));
}
// lime plaster as the mason left it: the float's blotches, a trowel wave every metre or so, two generations of squarish
// patches of newer wash, rain streaks under ledges and under every putlog hole, a rubbed pale arris. All of it is one
// factor (gTone) on the pigment, so it survives in shade as well as in sun.
vec3 plasterAlb(vec3 base, vec3 P, vec3 N, float drip, float px){
  float holes = step(-0.5, drip); drip = clamp(drip, 0., 1.);   // drip -1: a shell with no putlog holes (the dome)
  vec2 fc = faceUV(P, N) + uSeed * 7.3;
  float det = 1. - smoothstep(2.5, 11., px), close = 1. - smoothstep(0.15, 0.7, px);
  float vert = 1. - smoothstep(0.3, 0.6, abs(N.y));
  float wave = (vnoise(fc * vec2(0.085, 1.05) + 3.) - .5) * 2.2 * (0.35 + 0.65 * vnoise(fc * 0.09 + 21.));   // the trowel's lifts: long soft bands a metre or so apart, never regular
  float tone = 1. + (vnoise(fc * 0.33) - .5) * 0.16 * det + wave * 0.04 * (0.3 + 0.7 * close) * det + (vnoise(fc * vec2(0.05, 0.6)) - .5) * 0.12 * (0.4 + 0.6 * det)
    + (vnoise(fc * 0.021) - .5) * 0.18 + (vnoise(fc * 0.006 + 9.) - .5) * 0.12;
  { float ly = (fc.y + 1.6 * vnoise(vec2(fc.x * 0.045, 4.4)) + 0.25 * vnoise(vec2(fc.x * 0.6, 8.8))) / 8.4, li = floor(ly), lf = (fract(ly) - .5) * 8.4;
    tone *= 1. + vert * ((h11(li * 3.17 + 0.71) - .5) * 0.11 * (1. - smoothstep(4., 14., px)) - 0.2 * (1. - smoothstep(0.1, 0.1 + px, 4.2 - abs(lf))) * (1. - smoothstep(0.25, 1.4, px))); }
  // squarer patches of newer, brighter wash
  vec2 wob = (vec2(vnoise(fc * 0.55 + 31.), vnoise(fc * 0.55 + 77.)) - .5) * (1. - smoothstep(1., 4., px));
  vec2 g = fc / vec2(29., 17.); g.x += 0.37 * floor(g.y); vec2 id = floor(g), q = fract(g) + wob * 0.03;
  vec2 lo = vec2(0.08 + 0.45 * h21(id + 9.1), 0.1 + 0.4 * h21(id + 5.3)), hi = lo + vec2(0.12 + 0.3 * h21(id + 6.2), 0.16 + 0.3 * h21(id + 1.9));
  float pm = patchBox(q, lo, hi, (0.18 + px * 1.2) / vec2(29., 17.)) * step(0.5, h21(id + 3.7));
  tone = mix(tone, 1.19 + 0.08 * h21(id + 7.7) + 0.4 * (tone - 1.), pm * 0.9);
  // a second, smaller generation: repairs a hand's breadth lighter or darker
  vec2 g2 = fc / vec2(8.5, 6.5) + 5.5; g2.y += 0.43 * floor(g2.x); vec2 id2 = floor(g2), q2 = fract(g2) + wob * 0.1;
  vec2 lo2 = vec2(0.06 + 0.3 * h21(id2 + 2.1), 0.08 + 0.3 * h21(id2 + 8.3)), hi2 = lo2 + vec2(0.3 + 0.3 * h21(id2 + 4.2), 0.3 + 0.3 * h21(id2 + 6.9));
  float h2 = h21(id2 + 13.7);
  float pm2 = patchBox(q2, lo2, hi2, (0.16 + px * 1.2) / vec2(8.5, 6.5)) * step(0.58, h2) * (1. - smoothstep(2., 6., px));
  tone = mix(tone, (h2 > 0.8 ? 0.89 : 1.11) + 0.4 * (tone - 1.), pm2 * 0.85);
  // dark rain streaks under every ledge
  float sx = fc.x * 0.9; float st = smoothstep(0.42, 0.8, vnoise(vec2(sx, 3.3))) * (0.45 + 0.55 * vnoise(vec2(sx * 4.1, fc.y * 0.12)));
  tone *= 1. - 0.6 * st * drip * vert * (0.45 + 0.55 * det);
  tone *= 1. - 0.12 * drip * drip * vert;
  // putlog holes in rows, and the streak that runs down from each
  vec2 ph = fc / vec2(6.4, 10.5); float row = floor(ph.y); ph.x += h11(row + 0.37); vec2 pq = (fract(ph) - .5) * vec2(6.4, 10.5);
  float keep = step(0.3, h11(row * 1.7 + 4.1)) * step(0.22, h21(floor(ph) + 31.)) * vert * step(5., P.y) * holes;
  float hole = (1. - smoothstep(0.27 - px, 0.27 + px, max(abs(pq.x), abs(pq.y)))) * (1. - smoothstep(0.2, 0.6, px)) * keep;
  float run = (1. - smoothstep(0.16, 0.4 + px, abs(pq.x + 0.12 * sin(pq.y * 1.9)))) * step(pq.y, 0.) * (1. - smoothstep(0.3, 4.8, -pq.y));
  tone *= 1. - 0.26 * run * keep * (1. - smoothstep(1.2, 4., px));
  // the arris of a jamb: rubbed pale and rounded, never a crease
  if (gArc.x > 50.) { float d = (gArc.x - 100.) - abs(gArc.y); tone *= 1. + 0.17 * (1. - smoothstep(0.0, 0.38 + 0.2 * vnoise(fc * 0.7) + px, d)); }
  tone *= 0.9 + 0.1 * smoothstep(0., 5., P.y + vnoise(fc * 0.2) * 3.);   // grime at the foot
  tone *= 1. - 0.72 * hole;
  gTone = tone; gBounce = vert * exp(-max(P.y, 0.) / 8.);
  return mix(base * tone, uShade * 0.28, hole * 0.9);
}
vec3 stoneAlb(vec3 P, vec3 N, float px){
  vec2 fc = faceUV(P, N); vec2 g = fc / vec2(2.6, 1.3); g.x += 0.5 * floor(g.y);
  float hb = h21(floor(g) + 11.);
  vec2 q = (fract(g) - .5) * vec2(2.6, 1.3);
  float j = max(lineAA(abs(q.x) - 1.3, 0.02, px), lineAA(abs(q.y) - 0.65, 0.02, px)) * (1. - smoothstep(0.15, 0.5, px));
  return uStone * (0.9 + 0.2 * hb + (vnoise(fc * 3.) - .5) * 0.08 * (1. - smoothstep(0.2, 1., px))) * (1. - 0.3 * j);
}
vec3 marbleAlb(vec2 sc, float px){   // sc in metres: along, across
  vec2 g = sc / vec2(3., 2.5); float hs = h21(floor(g) + 23.);
  vec2 q = (fract(g) - .5) * vec2(3., 2.5);
  float j = max(lineAA(abs(q.x) - 1.5, 0.02, px), lineAA(abs(q.y) - 1.25, 0.02, px)) * (1. - smoothstep(0.15, 0.6, px));
  vec3 c = uMarble * (0.865 + 0.14 * hs) * vec3(1., 1. - 0.018 * h21(floor(g) + 5.), 1. - 0.045 * h21(floor(g) + 8.));   // slabs 3 m long, each a slightly different white (told apart in full sun too: the band is a pavement, not a blank)
  c *= 1. + (vnoise(sc * 1.7) - .5) * 0.03 * (1. - smoothstep(0.3, 1.5, px));
  gTone = 1. + 1.9 * (hs - .5) * 0.105 + (vnoise(sc * 0.23) - .5) * 0.05;       // each slab its own white, and the stone's own cloud, kept in shade
  return mix(c, uLead * 1.25, j * 0.75);
}
float gBold = 1.;
float scaleLead(vec2 uv2, float k, float fs, float fw){
  float s = uv2.x, w = uv2.y, pxm = fs * k;
  float jd = abs(fract(s * k / 3.) - .5) * 3.;                                     // slab joints interrupt the ticks
  float cut = smoothstep(1.5 - 0.05 - pxm, 1.5 - 0.03, jd);
  float L = tick(s, 39.2699, 0.13 * gBold, 6.0, w, fw, k, fs, 1.);                           // hour: right across the strip
  L = max(L, tick(s, 3.27249, 0.045 * gBold, 3.3, w, fw, k, fs, 2.2));                       // every fifth minute, half as long again
  L = max(L, tick(s, 0.654498, 0.02 * gBold, 2.2, w, fw, k, fs, 2.2) * (1. - cut));          // minute
  L = max(L, tick(s, 0.0218166, 0.0035, 0.7, w, fw, k, fs, 1.) * (1. - cut) * (1. - smoothstep(14., 20., uTickRate))); // two seconds
  L = max(L, max(lineAA(w, 0.03, fw), lineAA(w - 5., 0.03, fw)) * step(-0.2, w));     // the two ruled borders of the strip
  return L;
}
// the quadrant band: the scale we dive. Hour lines right across the band, five-minute and minute ticks bold enough to
// read from a hand's height, the finest divisions only close; far off each level melts to its grey ribbon.
float bandLead(vec2 uv2, float k, float fs, float fw){
  float s = uv2.x, w = uv2.y, pxm = fs * k;
  float jd = abs(fract(s * k / 3.) - .5) * 3.;
  float cut = smoothstep(1.5 - 0.05 - pxm, 1.5 - 0.03, jd);
  float L = tick(s, 39.2699, 0.26, 10.4, w, fw, k, fs, 1.);
  L = max(L, 0.8 * tick(s, 9.81748, 0.06, 10.4, w, fw, k, fs, 1.));
  L = max(L, 0.5 * tick(s, 3.27249, 0.045, 10.4, w, fw, k, fs, 1.));
  L = max(L, tick(s, 3.27249, 0.085, 3.4, w, fw, k, fs, 2.3));
  L = max(L, tick(s, 0.654498, 0.042, 2.2, w, fw, k, fs, 2.3) * (1. - cut));
  L = max(L, tick(s, 0.0218166, 0.0045, 0.7, w, fw, k, fs, 1.) * (1. - cut) * (1. - smoothstep(14., 20., uTickRate)));
  L = max(L, max(lineAA(w, 0.05, fw), lineAA(w - 5., 0.04, fw)) * step(-0.2, w));
  // from across the yard the ticks are one soft grey ribbon along each margin
  L = max(L, 0.5 * smoothstep(0.25, 0.9, pxm) * (1. - smoothstep(3.4 - fw - 1e-4, 3.4 + fw + 1e-4, w)) * step(0., w));
  return L;
}
// stair treads and risers: plaster worn pale up the middle, trowel streaks along the climb, damp blots, dark by the
// parapets (nothing across the climb, so nothing strobes)
vec3 treadAlb(vec3 P, vec3 N, float px){
  // limewashed masonry steps: matte ochre, a paler worn path up the middle, squarish patches of brighter wash and damp
  // blots that each span a few steps. Nothing runs lengthwise for more than two steps (that would be wood grain).
  float sl = P.z / CPc;                                              // metres up the slope
  vec2 fc = vec2(P.x, sl) + uSeed * 3.1;
  float nearK = 1. - smoothstep(0.5, 2.5, px), close = 1. - smoothstep(0.06, 0.35, px);
  float wob = (vnoise(vec2(sl * 0.045, 3.)) - .5) * 3.;
  float wear = (1. - smoothstep(1.2, 5.4, abs(P.x + wob))) * (0.75 + 0.5 * vnoise(fc * vec2(0.2, 0.12)));
  float tone = 1. + (vnoise(fc * 0.12) - .5) * 0.15 + (vnoise(fc * 0.5) - .5) * 0.08 * nearK + (vnoise(fc * vec2(2.6, 3.4)) - .5) * 0.06 * close;
  vec2 g = fc / vec2(7.5, 9.9); g.x += 0.41 * floor(g.y); vec2 id = floor(g), q = fract(g);
  vec2 lo = vec2(0.08 + 0.3 * h21(id + 9.1), 0.08 + 0.3 * h21(id + 5.3)), hi = lo + vec2(0.3 + 0.28 * h21(id + 6.2), 0.3 + 0.3 * h21(id + 1.9));
  float pm = patchBox(q, lo, hi, (0.08 + px * 1.2) / vec2(7.5, 9.9)) * step(0.52, h21(id + 3.7));
  tone = mix(tone, 1.13 + 0.05 * h21(id + 7.7), pm * 0.9);
  float blot = smoothstep(0.55, 0.7, vnoise(fc * vec2(0.17, 0.11) + 17.));
  tone *= 1. - 0.19 * blot;
  tone *= 1. + (h11(floor(sl / 3.3041) * 1.37 + uSeed) - .5) * 0.10 * nearK;   // each step was washed on its own day
  gTone = tone;
  return mix(uWash * tone, uFloorCol * (1.02 * tone), 0.3 * wear);
}
// an azimuth circle let into the floor: a marble ring ruled on its inner margin between two sandstone kerbs, and eight marble rays to the cardinal points
vec3 floorCompass(vec3 c, vec3 P, vec2 ctr, float R0, float W, float far, float px){
  vec2 cc = P.xz - ctr; float cr = length(cc);
  if (cr < R0 - 3. || cr > far + 3.) return c;
  float ca = atan(cc.y, cc.x), w = cr - R0;
  float ring = smoothstep(-px * .5, px * .5, w) * (1. - smoothstep(W - px * .5, W + px * .5, w));
  float seg = abs(fract(ca * 1.2732395 + .5) - .5) * 0.7853982 * cr;                      // metres from the nearest of eight rays
  float ray = (1. - smoothstep(1.1 - px * .5, 1.1 + px * .5, seg)) * step(R0 + W, cr) * (1. - smoothstep(far - px, far + px, cr));
  float kerbR = (1. - smoothstep(0.5 - px * .5, 0.5 + px * .5, abs(w + 0.6))) + (1. - smoothstep(0.5 - px * .5, 0.5 + px * .5, abs(w - W - 0.6)));
  c = mix(c, uStone * (0.92 + 0.16 * h21(floor(P.xz / 2.4))), clamp(kerbR, 0., 1.) * (1. - smoothstep(2., 6., px)));
  float m = max(ring, ray);
  if (m > 0.001) {
    vec3 mb = marbleAlb(vec2(ca * R0, cr), px);
    float L = ring * scaleLead(vec2(ca * R0, w), 1., px, px) * (1. - smoothstep(0.5, 2.5, px));
    L = max(L, ray * lineAA(seg, 0.05, px));
    mb = mix(mb, uLead, clamp(L, 0., 1.) * 0.9);
    c = mix(c, mb, m);
  }
  return c;
}
vec3 floorAlb(vec3 P, float px){
  vec2 g = P.xz / vec2(56., 42.) + .5; vec2 q = (fract(g) - .5) * vec2(56., 42.);
  vec3 c = plasterAlb(uFloorCol * (0.87 + 0.26 * h21(floor(g) + 2.)), P, vec3(0., 1., 0.), 0., px);
  { vec2 tg = P.xz / 13. + uSeed; vec2 ti = floor(tg + (vnoise(P.xz * 0.09) - .5) * 0.5);
    float ang = h21(ti + 1.3) * 3.1416; vec2 dir = vec2(cos(ang), sin(ang));
    float along = dot(P.xz, dir), across = dot(P.xz, vec2(-dir.y, dir.x));
    float det2 = 1. - smoothstep(0.2, 1.3, px);
    float pass = vnoise(vec2(across * 1.3, along * 0.09 + h21(ti) * 9.)) - .5;          // one pass of the float: long, soft, half a metre wide
    float lap = smoothstep(0.82, 1., fract(across / 3.1 + h21(ti + 6.))) ;               // the lap where two passes meet
    c *= 1. + (0.11 * pass - 0.05 * lap) * det2 + 0.035 * (h21(ti + 4.4) - .5) * (1. - smoothstep(1., 4., px)); }
  { vec2 bg = P.xz / vec2(14., 10.5) + .5; vec2 bq = (fract(bg) - .5) * vec2(14., 10.5);
    c *= 0.955 + 0.09 * h21(floor(bg) + 41.);
    float bj = min(7. - abs(bq.x), 5.25 - abs(bq.y));
    c *= 1. - 0.3 * (1. - smoothstep(0.035, 0.035 + px, bj)) * (1. - smoothstep(0.25, 1.1, px)); }
  gTone = clamp(lum3(c) / max(lum3(uFloorCol), 1e-3), 0.6, 1.4); gBounce = 0.;
  float kd = min(28. - abs(q.x), 21. - abs(q.y));
  float kerb = 1. - smoothstep(0.7 - px * .5, 0.7 + px * .5, kd);
  kerb = mix(0.03, kerb, 1. - smoothstep(2.5, 8., px));        // far off: its flat average
  c = mix(c, uStone * (0.92 + 0.16 * h21(floor(P.xz / 2.4))), kerb);
  float md = abs(P.x);                                           // the one marble meridian line
  float mer = 1. - smoothstep(1.6 - px * .5, 1.6 + px * .5, md);
  c = mix(c, marbleAlb(P.zx, px), mer);
  c = mix(c, uLead, lineAA(md, 0.06, px) * mer);
${s.COMPASS.map(([t,e,n,a,f])=>`  c = floorCompass(c, P, vec2(uMx * ${x(t)}, ${x(e)}), ${x(n)}, ${x(a)}, ${x(f)}, px);`).join(`
`)}
  return c;
}
// the bowl engraved with the sky: altitude circles every ten degrees, hour lines every fifteen, a ruled meridian
vec3 bowlAlb(vec3 P, float px){
  vec3 BW = bowlAt(P.x); vec3 d = P - vec3(BW.x, 0., BW.y); float r = max(length(d), 1e-3);
  float zen = acos(clamp(-d.y / r, -1., 1.)), sz = max(sin(zen), 1e-3);
  float az = atan(d.x, abs(d.z) + abs(d.x) < 1e-4 ? 1e-4 : d.z);
  vec3 c = marbleAlb(vec2(az * BW.z * max(sz, 0.3), zen * BW.z), px);
  float cm = zen * BW.z, pitch = BW.z * 0.1745329;
  float L = lineAA((fract(cm / pitch + .5) - .5) * pitch, 0.07, px);                       // altitude circles
  L = max(L, 0.8 * lineAA((fract(cm / pitch) - .5) * pitch, 0.04, px));                       // and the five-degree circles between them
  float pm = pitch / 10.; float fine = mix(0.06, lineAA((fract(cm / pm + .5) - .5) * pm, 0.022, px), 1. - smoothstep(0.1, 0.3, px));
  float hs2 = h21(floor(vec2(az * 9.5493, cm / (pitch * 0.5))) + 61.);                           // the bowl's own slabs: one per half band and hour sixth
  c *= 0.965 + 0.07 * hs2; gTone += 2.6 * (hs2 - .5) * 0.07;
  float am = BW.z * sz, hp = 0.2617994;
  float hl = lineAA((fract(az / hp + .5) - .5) * hp * am, 0.07, px) * step(4., cm);        // hour lines
  hl = max(hl, 0.7 * lineAA((fract(az / hp) - .5) * hp * am, 0.035, px) * step(14., cm));     // and the half hours
  float mer = abs(d.x);
  float md = max(lineAA(mer - 0.9, 0.05, px), lineAA(mer, 0.03, px));                      // the meridian, ruled double
  float tk = max(fine * (1. - smoothstep(0.9, 0.9 + px, mer)), 0.55 * fine);               // degree circles: bold as ticks along the meridian, fine everywhere else
  float hsh = h21(floor(vec2(cm / pitch, az / hp)) + 3.);
  L = max(max(L, hl) * (hsh < 0.06 ? 0.3 : 1.), max(md, tk));
  return mix(c, uLead, clamp(L, 0., 1.));
}
vec3 surfaceAlb(float mat, vec3 P, vec3 N, vec2 uv2, vec4 info, float px, float fs, float fw){
  // the nosing's height on screen in pixels, from the distance alone (the same on tread, riser and nosing, so it melts evenly):
  // one whole red line while it is over about three pixels, then thinner, then one even tint of tread and nosing
  float nosK = smoothstep(1.2, 3.2, 0.62 / max(length(P - cameraPosition) * uPxK, 1e-5));
  gArc = uv2;
  if (mat > 10.5) {   // the ribbed dome: plaster, a soft dark groove between each pair of ribs
    vec3 c = plasterAlb(uWash, P, N, -1., px);
    float g = 1. - smoothstep(0.02, 0.36, abs(fract(uv2.x) - .5));
    g = mix(g, 0.36, smoothstep(0.12, 0.4, fs));
    return c * mix(1.08, 0.6, g);
  }
  if (mat > 9.5) {    // the quadrant band: ruled marble between two red sandstone margins
    vec3 m = marbleAlb(vec2(uv2.x * info.z, uv2.y + 40.), px);
    float L = bandLead(uv2, info.z, fs, fw); gLead = L;
    vec3 c = mix(m, uLead, L);
    return mix(c, stoneAlb(P, N, px), 1. - smoothstep(-0.32 - fw - 1e-4, -0.32 + fw + 1e-4, uv2.y));
  }
  if (mat > 8.5) return mix(treadAlb(P, N, px), uStone, uNosing * 0.17 * (1. - nosK));
  if (mat > 7.5) return bowlAlb(P, px);
  if (mat < 0.5) return plasterAlb(uWash, P, N, info.w, px);
  if (mat < 1.5) return stoneAlb(P, N, px);
  if (mat < 2.5) {
    vec3 m = marbleAlb(vec2(uv2.x * info.z, uv2.y + 40.), px); float L;
    if (info.w < -1.5) {   // the dial ring: 24 bold hour bars, a short bar at each half hour, two ruled borders
      L = tick(uv2.x, 39.2699, 0.30, 4.2, uv2.y - 0.7, fw, info.z, fs, 1.);
      L = max(L, tick(uv2.x + 19.63495, 39.2699, 0.13, 2.3, uv2.y - 0.7, fw, info.z, fs, 1.));
      L = max(L, max(lineAA(uv2.y - 0.45, 0.2, fw), lineAA(uv2.y - 4.8, 0.2, fw)));
    } else { gBold = 1. + info.w; L = scaleLead(uv2, info.z, fs, fw); }
    gLead = L; return mix(m, uLead, L);
  }
  if (mat < 3.5) return floorAlb(P, px);
  if (mat < 4.5) return marbleAlb(faceUV(P, N), px);
  if (mat < 5.5) return uLead;
  if (mat < 6.5) return uShade * 0.25;
  vec3 tr = treadAlb(P, N, px); float nk = uNosing * mix(0.17, 1., nosK);
  gTone = mix(gTone, 1., nk);
  return mix(tr, uStone * (0.95 + 0.1 * h21(floor(vec2(P.x / 3.1 + 0.5 * floor(P.z / 2.944), P.z / 2.944)) + 11.)), nk);   // step nosing: dressed sandstone in three-metre lengths
}
// the one light: a sun term, a shade term that is a colour, and the low dust haze. Returns scene-linear colour.
vec3 yardLight(vec3 alb, vec3 P, vec3 N, float self, float px){
  float ndl = dot(N, uSun);
  float vis = ndl > 0. ? sunVis(P, N, self, px) * smoothstep(0., 0.018, ndl) : 0.;
  float white = smoothstep(0.45, 0.8, min(alb.r, min(alb.g, alb.b)));
  vec3 sunC = alb * mix(vec3(1.), uWhiteBoost, white) * uSunCol * (0.85 + 0.21 * ndl) * uSunI;
  float lum = dot(alb, vec3(0.3, 0.55, 0.15));
  float L = clamp(lum / 0.42, 0., 1.);
  vec3 shC = mix(alb * mix(1., 0.5, L), uShade * 1.5, mix(0.62, 0.79, L) * (1. - gShadeKeep)) * (0.55 + 0.45 * clamp(lum / 0.42, 0.25, 1.45));   // shade is a colour, and the surface still shows in it
  shC *= uShadeK * (0.92 + 0.12 * N.y) * (0.3 + 0.7 * uSunI) * mix(vec3(1.), vec3(0.88, 0.97, 1.14), max(N.y, 0.));   // what faces the sky is bluer
  shC *= clamp(1. + 1.15 * (gTone - 1.), 0.4, 1.6);                // the mason's hand shows in the shade as it does in the sun
  shC *= 1. + 0.3 * max(-N.y, 0.) * uSunI;                          // under a soffit: light thrown up from the sunlit floor, in the shade's own blue-violet (never pink)
  if (gBounce > 0.02) {                                             // the foot of a shaded wall glows where the floor before it lies in the sun
    vec3 fp = vec3(P.x + N.x * 7., 0.3, P.z + N.z * 7.);
    float lit = pen(prism(fp, uSun, -HW, HW, 0., ZTOP, -1e4, vec3(0., CPc, -SPc), -PH * CPc), 1.) * smoothstep(0., 0.08, uSun.y);
    shC *= 1. + 0.3 * gBounce * lit * uSunI;
  }
  shC *= 1. - 0.5 * gLead;                                         // lead keeps its dark in shade
  sunC = mix(sunC, shC * 1.5 + sunC * 0.15, 0.7 * uEcl);          // in the eclipse the lit ochre goes to slate, not to brown
  vec3 c = mix(shC, sunC, vis);
  float dist = length(P - cameraPosition);
  float hz = (1. - exp(-dist * uHaze)) * exp(-max(P.y, 0.) / 90.);
  return mix(c, uHazeCol * (0.3 + 0.7 * uSunI), hz) * uGain;
}
`,qt=`
attribute vec4 aInfo; attribute vec2 aArc;
varying vec3 vW, vN; varying vec2 vArc; varying vec4 vInfo;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix) * normal; vArc = aArc; vInfo = aInfo;
  gl_Position = projectionMatrix * viewMatrix * w; }`;function Et(t,e={}){return new T.ShaderMaterial({uniforms:t.uniforms,side:e.side??T.FrontSide,vertexShader:qt,fragmentShader:yt+Pt+`
varying vec3 vW, vN; varying vec2 vArc; varying vec4 vInfo;
void main(){
  vec3 N = vN / max(length(vN), 1e-5); if (!gl_FrontFacing) N = -N;
  float px = clamp(length(fwidth(vW)) * 0.7, 0.002, 60.);
  float fs = fwidth(vArc.x), fw = fwidth(vArc.y);
  vec3 alb = surfaceAlb(vInfo.x, vW, N, vArc, vInfo, px, fs, fw);
  gl_FragColor = vec4(yardLight(alb, vW, N, vInfo.y, px), 1.);
}`})}function Rt(t,e={}){const n=e.vertex||"vec3 animate(vec3 p, float ph){ float a = (sin(uTime * (5. + 3. * fract(ph * 7.1)) + ph * 40.) * 0.2 + sin(uTime * 1.3 + ph * 13.) * 0.14) * p.y; return p + vec3(a, 0., a * 0.6 * cos(ph * 9.)); }";return new T.ShaderMaterial({uniforms:t.uniforms,side:e.side??T.DoubleSide,vertexShader:`
uniform float uTime; attribute vec3 color; attribute float aPhase; varying vec3 vW, vN, vCol;
${n}
void main(){ vec3 p = animate(position, aPhase);
#ifdef USE_INSTANCING
  mat4 m = modelMatrix * instanceMatrix;
#else
  mat4 m = modelMatrix;
#endif
  vec4 w = m * vec4(p, 1.); vW = w.xyz; vN = mat3(m) * normal; vCol = color; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:yt+Pt+`
varying vec3 vW, vN, vCol;
void main(){
  vec3 N = vN / max(length(vN), 1e-5); if (!gl_FrontFacing) N = -N;
  float px = clamp(length(fwidth(vW)) * 0.7, 0.002, 60.);
  if (dot(N, uSun) < 0.) N = normalize(mix(N, uSun, 0.35));       // thin leaves and feathers let some sun through
  gShadeKeep = 0.72; gBirdShape = 0.;
  gl_FragColor = vec4(yardLight(vCol, vW, N, 0., px), 1.);
}`})}class St{constructor(){this.pos=[],this.nor=[],this.arc=[],this.info=[],this.m=0,this.s=0,this.k=1}v(e,n,a,f,o,p,g){this.pos.push(e[0],e[1],e[2]),this.nor.push(n[0],n[1],n[2]),this.arc.push(a[0],a[1]),this.info.push(f,o,p,g)}q(e,n,a,f,o={}){const p=o.m??this.m,g=o.s??this.s,l=o.k??this.k,M=a[0]-e[0],b=a[1]-e[1],E=a[2]-e[2],r=f[0]-n[0],y=f[1]-n[1],W=f[2]-n[2];let D=b*W-E*y,K=E*r-M*W,Y=M*y-b*r;const Z=Math.hypot(D,K,Y)||1;let v=[D/Z,K/Z,Y/Z],q=o.arc||kt,z=Array.isArray(o.d)?o.d:[o.d||0,o.d||0,o.d||0,o.d||0],V=[e,n,a,f],H=o.n?Array.isArray(o.n[0])?o.n:[o.n,o.n,o.n,o.n]:null;o.out&&v[0]*o.out[0]+v[1]*o.out[1]+v[2]*o.out[2]<0&&(v=[-v[0],-v[1],-v[2]],V=[e,f,a,n],q=[q[0],q[3],q[2],q[1]],z=[z[0],z[3],z[2],z[1]],H&&(H=[H[0],H[3],H[2],H[1]])),H||(H=[v,v,v,v]);for(const B of Tt)this.v(V[B],H[B],q[B],p,g,l,z[B])}get triangles(){return this.pos.length/9}geometry(){const e=new T.BufferGeometry;return e.setAttribute("position",new T.Float32BufferAttribute(this.pos,3)),e.setAttribute("normal",new T.Float32BufferAttribute(this.nor,3)),e.setAttribute("aArc",new T.Float32BufferAttribute(this.arc,2)),e.setAttribute("aInfo",new T.Float32BufferAttribute(this.info,4)),e.computeBoundingSphere(),e.computeBoundingBox(),e}}const Tt=[0,1,2,0,2,3],kt=[[0,-9],[0,-9],[0,-9],[0,-9]],rt=t=>{const e=Math.hypot(t[0],t[1],t[2])||1;return[t[0]/e,t[1]/e,t[2]/e]};async function Bt(t,e){const{HW:n,SW:a,PH:f,ZTOP:o,ZEND:p,PLAT:g,ARCH:l}=s,M=c=>c*ot,b=[];for(let c=2.4;c<p-.6;c+=9.8)Math.abs(c-l.z)>l.w+.1&&b.push(c);for(let c=0;c<=18;c++)b.push(l.z-l.w+c*(2*l.w/18));b.push(o,p-.6),b.sort((c,h)=>c-h);const E=c=>c<=o+1e-6?M(c)-1.2:g,r=c=>Math.abs(c-l.z)<l.w-1e-6?l.s+(l.h-l.s)*pt((c-l.z)/l.w):0,y=c=>c/Q;for(const c of[-1,1]){const h=c*n,w=[c,0,0],d=c<0?G.PARW:G.PARE;for(let m=0;m<b.length-1;m++){const i=b[m],u=b[m+1],R=(i+u)/2,I=Math.abs(R-l.z)<l.w,$=i>o-1e-6?g:E(i),F=u>o+1e-6?g:E(u),U=I?r(i)||l.s:0,j=I?r(u)||l.s:0,tt=Math.max(U,$-16),lt=Math.max(j,F-16),ft=1-($-tt)/16,ut=1-(F-lt)/16;if(t.q([h,U,i],[h,j,u],[h,lt,u],[h,tt,i],{out:w,m:A.PLASTER,s:G.BODY,d:[0,0,ut*0,ft*0]}),t.q([h,tt,i],[h,lt,u],[h,F,u],[h,$,i],{out:w,m:A.PLASTER,s:G.BODY,d:[0,0,1,1]}),!I&&$>7&&F>7){const ct=c*(n+.55),xt=rt([c*.8,.6,0]);t.q([ct,0,i],[ct,0,u],[ct,2.6,u],[ct,2.6,i],{out:w,m:A.PLASTER,s:G.BODY,d:-1}),t.q([ct,2.6,i],[ct,2.6,u],[h,3.5,u],[h,3.5,i],{out:xt,n:[[c,0,0],[c,0,0],xt,xt],m:A.PLASTER,s:G.BODY,d:-1})}}await e();const S=.35,L=c*(n+S),k=c*(a-S),O=c*a;for(let m=2.4;m<o-1e-6;m+=9.952){const i=Math.min(o,m+9.952),u=M(m),R=M(i),I=y(m),$=y(i),F={s:d};t.q([h,u-1.2,m],[h,R-1.2,i],[L,R-1.2,i],[L,u-1.2,m],{...F,m:A.STONE,out:[0,-1,0]}),t.q([L,u-1.2,m],[L,R-1.2,i],[L,R-.45,i],[L,u-.45,m],{...F,m:A.STONE,out:w}),t.q([L,u-.45,m],[L,R-.45,i],[L,R,i],[L,u,m],{...F,m:A.MARBLE,out:w}),t.q([L,u,m],[L,R,i],[k,R,i],[k,u,m],{...F,m:A.SCALE,out:[0,1,0],arc:[[I,5.2],[$,5.2],[$,-.5],[I,-.5]],d:2.6}),t.q([k,u-.45,m],[k,R-.45,i],[k,R,i],[k,u,m],{...F,m:A.MARBLE,out:[-c,0,0]}),t.q([k,u-1.2,m],[k,R-1.2,i],[k,R-.45,i],[k,u-.45,m],{...F,m:A.STONE,out:[-c,0,0]}),t.q([O,u-1.2,m],[O,R-1.2,i],[k,R-1.2,i],[k,u-1.2,m],{...F,m:A.STONE,out:[0,-1,0]});const U=Math.max(0,u-f),j=Math.max(0,R-f);t.q([O,U,m],[O,j,i],[O,R-1.2,i],[O,u-1.2,m],{...F,m:A.PLASTER,out:[-c,0,0],d:[0,0,.8,.8]})}await e();const C=2.4,_=M(C);t.q([L,0,C],[k,0,C],[k,_,C],[L,_,C],{m:A.STONE,s:d,out:[0,0,-1]});const N=M(o);t.q([L,g,o],[k,g,o],[k,N-1.2,o],[L,N-1.2,o],{m:A.PLASTER,s:d,out:[0,0,1],d:[0,0,1,1]}),t.q([L,N-1.2,o],[k,N-1.2,o],[k,N-.45,o],[L,N-.45,o],{m:A.STONE,s:d,out:[0,0,1]}),t.q([L,N-.45,o],[k,N-.45,o],[k,N,o],[L,N,o],{m:A.MARBLE,s:d,out:[0,0,1]});const P=rt([c,0,1]);t.q([h,0,p-.6],[c*(n-.6),0,p],[c*(n-.6),g,p],[h,g,p-.6],{m:A.PLASTER,s:G.BODY,out:P,n:[[c,0,0],[0,0,1],[0,0,1],[c,0,0]],d:[0,0,1,1]}),ht(t,[c*(n-.5),g+.6,(o+p)/2],[.9,1.2,p-o],A.STONE,G.PLAT)}ht(t,[0,g+.6,p-.45],[2*n-1.8,1.2,.9],A.STONE,G.PLAT);for(let c=0;c<2;c++){const h=c?g-20:0,w=c?g:g-20,d=n-.6;t.q([d,h,p],[-d,h,p],[-d,w,p],[d,w,p],{m:A.PLASTER,s:G.BODY,out:[0,0,1],d:[0,0,c,c]})}t.q([-n,g,o],[n,g,o],[n,g,p],[-n,g,p],{m:A.FLOOR,s:G.PLAT,out:[0,1,0]});const W=1.5,D=W/ot,K=f/ot,Y=Math.ceil(g/W),Z=[0,Q,-X],v=rt([0,Q+.14,-X]),q=rt([0,Q,-X-.14]);for(let c=0;c<Y;c++){c%30===29&&await e();const h=K+c*D,w=Math.min(o,h+D),d=c*W,S=Math.min(g,d+W),L={s:G.BODY};t.q([-a,d,h],[a,d,h],[a,S-.3,h],[-a,S-.3,h],{...L,m:A.TREAD,n:q,out:[0,0,-1]}),t.q([-a,S-.3,h],[a,S-.3,h],[a,S,h],[-a,S,h],{...L,m:7,n:Z,out:[0,0,-1]}),t.q([-a,S,h],[a,S,h],[a,S,h+.5],[-a,S,h+.5],{...L,m:7,n:Z,out:[0,1,0]}),t.q([-a,S,h+.5],[a,S,h+.5],[a,S,w],[-a,S,w],{...L,m:A.TREAD,n:v,out:[0,1,0]})}await e();const z=(c,h,w)=>{const d=[[-c,0],[-c,h]];for(let S=1;S<16;S++){const L=-1+S/8;d.push([L*c,h+(w-h)*pt(L)])}return d.push([c,h],[c,0]),d},V=z(l.w,l.s,l.h),H=z(l.w+2.4,l.s+.6,l.h+3.4),B=n+.35;for(let c=0;c<V.length-1;c++){const h=V[c],w=V[c+1],d=H[c],S=H[c+1],k=[0,[0,7,l.z][1]-(h[1]+w[1])/2,-(h[0]+w[0])/2];t.q([-B,h[1],l.z+h[0]],[B,h[1],l.z+h[0]],[B,w[1],l.z+w[0]],[-B,w[1],l.z+w[0]],{m:A.PLASTER,s:G.TUNNEL,out:k,d:.35,arc:[[100+B,-B],[100+B,B],[100+B,B],[100+B,-B]]});for(const O of[-1,1]){const C=O*B,_={m:A.STONE,s:G.BODY};t.q([C,h[1],l.z+h[0]],[C,w[1],l.z+w[0]],[C,S[1],l.z+S[0]],[C,d[1],l.z+d[0]],{..._,out:[O,0,0]}),t.q([C,d[1],l.z+d[0]],[C,S[1],l.z+S[0]],[O*n,S[1],l.z+S[0]],[O*n,d[1],l.z+d[0]],{..._,out:[0,-k[1],-k[2]]})}}}function ht(t,e,n,a,f,o=a){const[p,g,l]=e,M=n[0]/2,b=n[1]/2,E=n[2]/2,r={m:a,s:f},y=(W,D,K)=>[p+W*M,g+D*b,l+K*E];t.q(y(-1,-1,1),y(1,-1,1),y(1,1,1),y(-1,1,1),{...r,out:[0,0,1]}),t.q(y(-1,-1,-1),y(1,-1,-1),y(1,1,-1),y(-1,1,-1),{...r,out:[0,0,-1]}),t.q(y(1,-1,-1),y(1,-1,1),y(1,1,1),y(1,1,-1),{...r,out:[1,0,0]}),t.q(y(-1,-1,-1),y(-1,-1,1),y(-1,1,1),y(-1,1,-1),{...r,out:[-1,0,0]}),t.q(y(-1,1,-1),y(1,1,-1),y(1,1,1),y(-1,1,1),{...r,m:o,out:[0,1,0]}),t.q(y(-1,-1,-1),y(1,-1,-1),y(1,-1,1),y(-1,-1,1),{...r,out:[0,-1,0]})}const at=(t,e,n,a=0)=>[t*(s.HW+e),s.QC.y-n*Q+a*X,s.QC.z+n*X+a*Q];async function Lt(t,e,n,a){const{QR:f,QW:o,FINT:p,FINA:g,FING:l,FARCH:M}=s,b=1.5,E=e<0?G.FINW:G.FINE,r=(v,q,z)=>at(e,v,q,z),y=[0,X,Q],W=[0,-X,-Q];for(let v=0;v<n;v++){v%20===19&&await a();const q=v/n*Math.PI/2,z=(v+1)/n*Math.PI/2,V=f*q,H=f*z,B=Math.cos(q),c=Math.sin(q),h=Math.cos(z),w=Math.sin(z),d=(N,P)=>rt([-e*P,N*Q,-N*X]),S=d(B,c),L=d(h,w),k=S.map(N=>-N),O=L.map(N=>-N),C=(N,P,m,i)=>r(N*m,N*P,i),_=[[-o,0,-1,o-1],[0,o,o-1,-1]];for(const[N,P,m,i]of _)t.q(C(f,B,c,N),C(f,B,c,P),C(f,h,w,P),C(f,h,w,N),{m:A.BAND,s:0,out:S,n:[S,S,L,L],arc:[[V,m],[V,i],[H,i],[H,m]]});t.q(C(f+b,B,c,-o),C(f+b,B,c,o),C(f+b,h,w,o),C(f+b,h,w,-o),{m:A.PLASTER,s:0,out:k,n:[k,k,O,O],d:.5});for(const N of[-1,1])t.q(C(f,B,c,N*o),C(f+b,B,c,N*o),C(f+b,h,w,N*o),C(f,h,w,N*o),{m:A.STONE,s:0,out:N>0?y:W})}t.q(r(f,0,-o),r(f,0,o),r(f+b,0,o),r(f+b,0,-o),{m:A.STONE,s:0,out:[0,Q,-X]}),t.q(r(.6,f,-o-.8),r(.6,f,o+.8),r(.6,f-1.7,o+.8),r(.6,f-1.7,-o-.8),{m:A.STONE,s:0,out:[e,0,0]}),t.q(r(0,f-1.7,-o-.8),r(0,f-1.7,o+.8),r(.6,f-1.7,o+.8),r(.6,f-1.7,-o-.8),{m:A.STONE,s:0,out:[0,Q,-X]}),await a();const D=[];for(let v=0;v<g;v+=3.9)D.push(v);for(const[v,q]of M)for(let z=0;z<=14;z++)D.push(v-q+z/14*2*q);D.push(f+.6,g),D.sort((v,q)=>v-q);const K=f+.6,Y=v=>v<K?Math.sqrt(K*K-v*v):0,Z=v=>{for(const[q,z,V,H]of M)if(Math.abs(v-q)<z+1e-6)return V+(H-V)*pt((v-q)/z);return 0};for(let v=0;v<D.length-1;v++){v%30===29&&await a();const q=D[v],z=D[v+1];if(z-q<1e-4)continue;const V=(q+z)/2,H=Z(V)>0,B=l-(H?Z(q):0),c=l-(H?Z(z):0),h=Y(q),w=Y(z),d=Math.min(B,h+18),S=Math.min(c,w+18);for(const L of[-1,1]){const k={m:A.PLASTER,s:E,out:L>0?y:W},O=L*p;t.q(r(q,h,O),r(z,w,O),r(z,S,O),r(q,d,O),{...k,d:[1,1,0,0]}),(B-d>.01||c-S>.01)&&t.q(r(q,d,O),r(z,S,O),r(z,c,O),r(q,B,O),k)}q>=K-1e-6&&t.q(r(q,0,-p),r(z,0,-p),r(z,0,p),r(q,0,p),{m:A.STONE,s:E,out:[0,Q,-X]})}t.q(r(g,0,-p),r(g,0,p),r(g,l,p),r(g,l,-p),{m:A.PLASTER,s:E,out:[e,0,0],d:[1,1,.9,.9]});for(const[v,q,z,V]of M){await a();const H=(w,d,S)=>{const L=[[-w,0],[-w,d]];for(let k=1;k<14;k++){const O=-1+k/7;L.push([O*w,d+(S-d)*pt(O)])}return L.push([w,d],[w,0]),L},B=H(q,z,V),c=H(q+2,z+.5,V+3),h=p+.3;for(let w=0;w<B.length-1;w++){const d=B[w],S=B[w+1],L=c[w],k=c[w+1],O=r(v+d[0],l-d[1],-h),C=r(v+d[0],l-d[1],h),_=r(v+S[0],l-S[1],h),N=r(v+S[0],l-S[1],-h),P=r(v,l-z*.8,0),m=[(O[0]+_[0])/2,(O[1]+_[1])/2,(O[2]+_[2])/2];t.q(O,C,_,N,{m:A.PLASTER,s:E,out:[P[0]-m[0],P[1]-m[1],P[2]-m[2]],d:.3,arc:[[100+h,-h],[100+h,h],[100+h,h],[100+h,-h]]});for(const i of[-1,1])t.q(r(v+d[0],l-d[1],i*h),r(v+S[0],l-S[1],i*h),r(v+k[0],l-k[1],i*h),r(v+L[0],l-L[1],i*h),{m:A.STONE,s:E,out:i>0?y:W}),t.q(r(v+L[0],l-L[1],i*h),r(v+k[0],l-k[1],i*h),r(v+k[0],l-k[1],i*p),r(v+L[0],l-L[1],i*p),{m:A.STONE,s:E,out:[m[0]-P[0],m[1]-P[1],m[2]-P[2]]})}}}async function Ot(t,e){const{KZ:n,KPX:a,KPZ:f,KPR:o,PLAT:p,SLABY:g,DOMER:l}=s,M=(P,m,i,u,R,I,$,F)=>{for(let U=0;U<$;U++){const j=U/$*Math.PI*2,tt=(U+1)/$*Math.PI*2,lt=(u-I)/Math.max(.001,R-i),ft=rt([Math.cos(j),lt,Math.sin(j)]),ut=rt([Math.cos(tt),lt,Math.sin(tt)]);t.q([P+u*Math.cos(j),i,m+u*Math.sin(j)],[P+u*Math.cos(tt),i,m+u*Math.sin(tt)],[P+I*Math.cos(tt),R,m+I*Math.sin(tt)],[P+I*Math.cos(j),R,m+I*Math.sin(j)],{m:F,s:0,out:ft,n:[ft,ut,ut,ft]})}};for(const P of[-1,1])for(const m of[-1,1]){const i=P*a,u=n+m*f,R=g-p;ht(t,[i,p+1.1,u],[3.6,2.2,3.6],A.STONE,0),M(i,u,p+2.2,o*1.25,p+3.2,o,12,A.STONE),M(i,u,p+3.2,o,p+R-3.6,o*.88,12,A.STONE),M(i,u,p+R-3.6,o*.88,p+R-2.4,o*1.35,12,A.STONE),ht(t,[i,p+R-1.2,u],[4.4,2.4,4.4],A.STONE,0)}await e();const b=s.SLABH;ht(t,[0,g+.7,n],[2*b,1.4,2*b],A.STONE,0,A.PLASTER),t.q([-b,g-.02,n-b],[b,g-.02,n-b],[b,g-.02,n+b],[-b,g-.02,n+b],{m:A.PLASTER,s:0,out:[0,-1,0],d:-1});const E=b,r=b+3.2,y=g+1.35,W=g+.25;for(let P=0;P<4;P++){const m=Math.cos(P*Math.PI/2),i=Math.sin(P*Math.PI/2),u=(R,I,$)=>[R*m-I*i,$,n+R*i+I*m];t.q(u(E,-E,y),u(E,E,y),u(r,r,W),u(r,-r,W),{m:A.STONE,s:0,out:[m,2,i]}),t.q(u(E,-E,y-.5),u(E,E,y-.5),u(r,r,W-.35),u(r,-r,W-.35),{m:A.PLASTER,s:0,out:[-m,-2,-i],d:-1}),t.q(u(r,-r,W-.35),u(r,r,W-.35),u(r,r,W),u(r,-r,W),{m:A.STONE,s:0,out:[m,0,i]})}const D=g+1.4,K=s.DOMEY,Y=s.DOMEK;M(0,n,D,l+.7,D+.9,l+.5,48,A.STONE),M(0,n,D+.9,l+.25,K-.8,l+.2,48,A.PLASTER),M(0,n,K-.8,l+.6,K,l+.45,48,A.STONE);const Z=16,v=64,q=12,z=(P,m)=>{const i=l*Math.cos(m)**.9*(1+.075*Math.abs(Math.cos(P*Z/2))**2.2*Math.cos(m)**.5);return[i*Math.cos(P),K+l*Y*Math.sin(m),n+i*Math.sin(P)]},V=(P,m)=>{const u=z(P,m),R=z(P+.001,m),I=z(P,Math.min(m+.001,1.5699)),$=[R[0]-u[0],R[1]-u[1],R[2]-u[2]],F=[I[0]-u[0],I[1]-u[1],I[2]-u[2]],U=rt([F[1]*$[2]-F[2]*$[1],F[2]*$[0]-F[0]*$[2],F[0]*$[1]-F[1]*$[0]]);return U[1]<-.2?[0,1,0]:U};for(let P=0;P<q;P++){P%4===0&&await e();for(let m=0;m<v;m++){const i=m/v*Math.PI*2,u=(m+1)/v*Math.PI*2,R=P/q*1.5,I=(P+1)/q*1.5,$=i*8/Math.PI,F=u*8/Math.PI;t.q(z(i,R),z(u,R),z(u,I),z(i,I),{m:A.DOME,s:0,out:[Math.cos(i),.5,Math.sin(i)],n:[V(i,R),V(u,R),V(u,I),V(i,I)],d:-1,arc:[[$,R],[F,R],[F,I],[$,I]]})}}await e();const H=K+l*Y*Math.sin(1.5);M(0,n,H-.3,1.5,H+1.2,.9,10,A.STONE),M(0,n,H+1.2,.9,H+4.2,.02,10,A.STONE);const B=s.DIAL,c=7.7,h=9.9,w=.7,d=72,S=39.2699,L=2*Math.PI*(c+h)/2/24/S,k=[1,0,0],O=[0,Q,-X],C=[0,X,Q],_=[0,-X,-Q],N=(P,m,i)=>[B.x+P*(Math.cos(m)*k[0]+Math.sin(m)*O[0])+i*C[0],B.y+P*Math.sin(m)*O[1]+i*C[1],B.z+P*Math.sin(m)*O[2]+i*C[2]];for(let P=0;P<d;P++){const m=P/d*Math.PI*2,i=(P+1)/d*Math.PI*2,u=P/d*24*S,R=(P+1)/d*24*S,I=[Math.cos(m),Math.sin(m)*O[1],Math.sin(m)*O[2]],$=[Math.cos(i),Math.sin(i)*O[1],Math.sin(i)*O[2]];t.q(N(c,m,-w),N(h,m,-w),N(h,i,-w),N(c,i,-w),{m:A.SCALE,s:0,k:L,d:-2,out:_,arc:[[u,-.3],[u,5.3],[R,5.3],[R,-.3]]}),t.q(N(c,m,w),N(h,m,w),N(h,i,w),N(c,i,w),{m:A.SCALE,s:0,k:L,d:-2,out:C,arc:[[u,-.3],[u,5.3],[R,5.3],[R,-.3]]}),t.q(N(h,m,-w),N(h,m,w),N(h,i,w),N(h,i,-w),{m:A.MARBLE,s:0,out:I,n:[I,I,$,$]});const F=I.map(j=>-j),U=$.map(j=>-j);t.q(N(c,m,-w),N(c,m,w),N(c,i,w),N(c,i,-w),{m:A.STONE,s:0,out:F,n:[F,F,U,U]})}for(const P of[-1,1]){const m=Math.PI/2+P*.55,i=N(h-.3,m,0),u=g-i[1];ht(t,[i[0],i[1]+u/2,i[2]],[.5,u,.5],A.LEAD,0)}}function Wt(t){const e=[[0,0],[.2,-.06],[.42,.1],[.5,.36],[.38,.66],[.16,.95],[.03,1.32],[-.03,1.32],[-.16,.95],[-.38,.66],[-.5,.36],[-.42,.1],[-.2,-.06]],n=[],a=[],f=[],o=[0,.42,0],p=(l,M)=>{n.push(l[0],l[1],Math.abs(l[0])*.28),f.push(-Math.sign(l[0])*.27,0,.96),a.push(t.r*M,t.g*M,t.b*M)};for(let l=0;l<e.length;l++){const M=e[l],b=e[(l+1)%e.length];p(o,.8),p(M,1.06),p(b,1.06)}const g=new T.BufferGeometry;return g.setAttribute("position",new T.Float32BufferAttribute(n,3)),g.setAttribute("normal",new T.Float32BufferAttribute(f,3)),g.setAttribute("color",new T.Float32BufferAttribute(a,3)),g}function Ct(t){const{HW:e,ZTOP:n,FINT:a,FING:f,FARCH:o,QR:p,ARCH:g}=s,l=[];for(let b=0;b<16;b++){const E=t.chance(.5)?1:-1,r=t.range(50,n-15);l.push({p:[E*(e+.1),r*ot-1.5-t.range(0,2.5),r],n:[E,0,0]})}for(let b=0;b<9;b++){const E=t.chance(.5)?1:-1,r=t.chance(.5)?1:-1,y=t.range(15,140),W=Math.sqrt((p+.6)**2-y*y)+t.range(1.2,4);l.push({p:at(E,y,W,r*(a+.1)),n:[0,r*X,r*Q]})}for(let b=0;b<10;b++){const E=t.chance(.5)?1:-1,r=t.pick(o),y=t.chance(.5)?1:-1;l.push({p:at(E,r[0]+y*(r[1]-.1),f-r[2]-t.range(-2,3),t.range(-a,a)),n:[-E*y,.2,0]})}for(let b=0;b<5;b++){const E=t.chance(.5)?1:-1,r=t.chance(.5)?1:-1;l.push({p:[E*t.range(e-3,e+.3),g.s+t.range(-1.5,3),g.z+r*(g.w-.1)],n:[0,.2,-r]})}const M=o[1];for(const[b,E,r,y,W]of[[1,-1,3,-3.2,2.3],[1,1,7,-2.6,2],[1,1,-4,2.8,1.7],[-1,1,4,-3,1.9]])l.push({p:at(b,M[0]+E*(M[1]-.1),f-M[2]-r,y),n:[-b*E,.2,0],size:W});return l}function Ht(t,e,n){const a=Ct(t),f=Math.max(8,Math.round(20*n)),o=a.length*f,p=new T.InstancedMesh(Wt(e.uniforms.uGreen.value),Rt(e),o),g=new Float32Array(o),l=new T.Matrix4,M=new T.Quaternion,b=new T.Vector3(0,1,0),E=new T.Vector3,r=new T.Quaternion;let y=0;for(const W of a){const D=W.size??t.range(.7,1.5);for(let K=0;K<f;K++,y++){const Y=K/f;E.set(W.n[0]*t.range(.3,1.3)+t.range(-.8,.8),W.n[1]+t.range(-.5,1.2),W.n[2]*t.range(.3,1.3)+t.range(-.8,.8)).normalize();const Z=D*(.25+1.1*Y)*t.range(.7,1.1),v=new T.Vector3(E.x,E.y-.9-t.range(0,.8),E.z).normalize();M.setFromUnitVectors(b,v),r.setFromAxisAngle(v,t.range(0,6.283)),M.premultiply(r);const q=t.range(.55,.95)*(.7+.3*D);l.compose(new T.Vector3(W.p[0]+E.x*Z,W.p[1]+E.y*Z,W.p[2]+E.z*Z),M,new T.Vector3(q,q,q)),p.setMatrixAt(y,l),g[y]=t()}}return p.geometry.setAttribute("aPhase",new T.InstancedBufferAttribute(g,1)),p.instanceMatrix.needsUpdate=!0,p.frustumCulled=!1,{mesh:p,sites:a}}function It(t,e){const a=[0,60,220,520,e];for(let f=0;f<a.length-1;f++)for(let o=0;o<48;o++){const p=o/48*Math.PI*2,g=(o+1)/48*Math.PI*2,l=a[f],M=a[f+1];t.q([l*Math.sin(p),0,265+l*Math.cos(p)],[l*Math.sin(g),0,265+l*Math.cos(g)],[M*Math.sin(g),0,265+M*Math.cos(g)],[M*Math.sin(p),0,265+M*Math.cos(p)],{m:A.FLOOR,s:0,n:[0,1,0],out:[0,1,0]})}}const Ft=t=>s.QR*Math.max(0,12-gt(t))*15*et,it=(t,e,n=0,a=0)=>{const f=e/s.QR,o=s.QR-a;return at(t,o*Math.sin(f),o*Math.cos(f),n)};async function $t(t,e={}){const n=t.rng,a=d=>new T.Vector3(d[0],d[1],d[2]),f=new URLSearchParams(""),o=e.detail??t.quality?.detail??1,p=n.chance(.25)?"delhi":"jaipur",g=n.chance(.3)?n.range(.35,1):0,l=Math.floor(n()*1e3),M=e.style||Nt({palette:e.palette,colourway:e.colourway??f.get("stairCW")??p,haze:e.haze??g,seed:l}),b=new T.Group;b.name="stair-that-points-at-the-pole";const E=Et(M),r=new St,y=()=>t.yield();await Bt(r,y),await t.yield();const W=Math.round(96*(.5+.5*o));await Lt(r,-1,W,y),await t.yield(),await Lt(r,1,W,y),await t.yield(),await Ot(r,y),await t.yield();const D=new T.Mesh(r.geometry(),E);D.frustumCulled=!1,b.add(D),await t.yield();let K=null;if(e.floor!==!1){const d=new St;It(d,1100),K=new T.Mesh(d.geometry(),E),K.frustumCulled=!1,b.add(K)}await t.yield();const Y=Ht(n,M,o);b.add(Y.mesh),await t.yield();const Z=new T.Vector3(0,X,Q),v=[];for(let d=40;d<=s.KZ+1e-6;d+=47.5)v.push(new T.Vector3(0,d*ot-3,d));const q=[];for(let d=8;d<=11.75;d+=.75)q.push(a(it(-1,s.QR*(12-d)*15*et,-5.6,3.5)));const z=s.FARCH[1],V={portalSeat:{position:s.DIAL.clone(),facing:Z.clone().negate(),axis:Z.clone(),radius:7,tilt:mt},pole:Z,entry:{position:new T.Vector3(-170,150,-110),heading:new T.Vector3(.105,0,.994)},flyThrough:v,dive:q,squirrel:{position:a(it(-1,s.QR*15*et,-6.3,0)),normal:a(it(-1,s.QR*15*et,-6.3,1)).sub(a(it(-1,s.QR*15*et,-6.3,0))),downScale:a(it(-1,s.QR*14*et,-6.3,0)).sub(a(it(-1,s.QR*15*et,-6.3,0))).normalize()},greatArch:[new T.Vector3(-45,10,s.ARCH.z),new T.Vector3(0,10,s.ARCH.z),new T.Vector3(45,10,s.ARCH.z)],finArchEast:[a(at(1,z[0],s.FING-16,30)),a(at(1,z[0],s.FING-16,0)),a(at(1,z[0],s.FING-16,-30))],quadrantEndWest:a(at(-1,s.QR,0,0)),quadrantEndEast:a(at(1,s.QR,0,0)),reveal:{position:new T.Vector3(0,14,-90),lookAt:s.DIAL.clone()},toe:new T.Vector3(0,0,0),kioskTop:new T.Vector3(0,s.SLABY+22,s.KZ),bowl:new T.Vector3(s.BOWL.x,0,s.BOWL.z),seedlings:Y.sites.map(d=>a(d.p))};let H=!1;const B=f.get("stairU"),c=Number(f.get("stairR"))||300,h=f.get("stairC"),w=h?a(h.split(",").map(Number)):new T.Vector3(0,125,285);return{object:b,radius:c,height:h?c:300,center:w,anchors:V,style:M,stats:{triangles:r.triangles+(K?384:0)+Y.mesh.count*13},shadowArc:Ft,scalePoint:it,setProgress(d){H=!0,M.setProgress(d)},update(d,S,L){M.setTime(S),H||M.setProgress(B!=null?Number(B):.02+.25*(.5-.5*Math.cos(S*.1)))},dispose(){},ground:!1,groundY:0}}export{St as Builder,s as G,A as MAT,G as SELF,yt as STYLE_GLSL,Pt as SURFACE_GLSL,pt as archH,$t as buildHero,Rt as creatureMaterial,Nt as makeStyle,Et as masonryMaterial,at as quadPoint,it as scalePoint,Ft as shadowArc,bt as sunDirAt,gt as sunTimeAt,st as toScene};
