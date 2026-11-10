import*as y from"three";const l0=3.2,W=Math.SQRT1_2,H=[null,{c:[0,2.2,0],n:[0,0,1],r:[1,0,0],foot:2.7,top:10.6},{c:[-22,3.2,-205],n:[0,0,1],r:[1,0,0],foot:2.7,top:10.6},{c:[98,1.2,-304.7],n:[-W,0,-W],r:[W,0,-W],foot:2.7,top:10.6}],S0=[{o:[0,0,0],ry:0},{o:[-22,1,-205],ry:0},{o:[98,-1,-304.7],ry:225},{o:[158.7,-15.7,-174.6],ry:185}],c0=[6.73,1.14,12.2],A0=(e,t)=>{const o=S0[e],n=o.ry*Math.PI/180,a=Math.cos(n),r=Math.sin(n);return[o.o[0]+t[0]*a+t[2]*r,o.o[1]+t[1],o.o[2]-t[0]*r+t[2]*a]},k0=e=>A0(e,c0),h0=-5;function P0(e,t,o){const n=H[e];return!(Math.abs(t)>l0||o<-n.foot||o>n.top)}const s0=(e,t,o,n)=>{const a=H[e];return(t-a.c[0])*a.n[0]+(o-a.c[1])*a.n[1]+(n-a.c[2])*a.n[2]};function N0(e,t,o){return s0(1,e,t,o)>0?0:s0(2,e,t,o)>0?t<h0?3:1:s0(3,e,t,o)>0?2:3}function d0(e,t,o,n){const a=H[e],r=(t[0]-a.c[0])*a.n[0]+(t[1]-a.c[1])*a.n[1]+(t[2]-a.c[2])*a.n[2],l=o[0]*a.n[0]+o[1]*a.n[1]+o[2]*a.n[2];if(r*l>=0)return-1;const h=-r/l;if(h>n)return-1;const w=t[0]+o[0]*h-a.c[0],u=t[1]+o[1]*h-a.c[1],v=t[2]+o[2]*h-a.c[2];return P0(e,w*a.r[0]+v*a.r[2],u)?h:-1}function oe(e,t,o=1){const n=N0(e[0],e[1],e[2]);return n<3&&d0(n+1,e,t,o)>=0?n+1:n>0&&d0(n,e,t,o)>=0?n-1:n}const j=e=>{const t=Number(e).toFixed(8);return t.indexOf(".")<0?t+".0":t},O=e=>"vec3("+e.map(j).join(", ")+")",M0=[1,2,3].map(e=>{const t=H[e];return"const vec3 PC"+e+" = "+O(t.c)+", PN"+e+" = "+O(t.n)+", PR"+e+" = "+O(t.r)+`;
const vec4 PO`+e+" = vec4("+[t.foot,t.top,0,0].map(j).join(", ")+");"}).join(`
`),f0=`
${M0}
const float OUT_HW = ${j(l0)}, FLOOR_Y = ${j(h0)};
bool inOutline(float a, float b, vec4 o){
  return !(abs(a) > OUT_HW || b < -o.x || b > o.y);
}
bool crossIn(vec3 e, vec3 d, float tmax, vec3 pc, vec3 pn, vec3 pr, vec4 po, out float t){
  float se = dot(e - pc, pn), sd = dot(d, pn);
  t = 0.0;
  if (se * sd >= 0.0) return false;
  t = -se / sd;
  if (t > tmax) return false;
  vec3 q = e + d * t - pc;
  return inOutline(dot(q, pr), q.y, po);
}
// THE PIXEL'S OWN SIGHT LINE (round three, the lead's D1). The law is asked along the line through the middle of the
// pixel, made from the pixel's own place in the buffer (uVP: the viewport, set before every drawing of the scene), the
// projection and the view. (The interpolated vW will not do near an outline: far triangles drawn in single precision
// stray up to a sixtieth of a pixel from the pixel's middle, enough to put a pixel whose middle lies just outside an
// outline on the far side of it.) Before the first viewport is known the interpolated line stands in.
uniform vec4 uVP;
uniform mat4 projectionMatrix;
vec3 lawRay(vec3 fallback){
  if (uVP.z < 0.5) return normalize(fallback);
  vec2 n = (gl_FragCoord.xy - uVP.xy) / uVP.zw * 2.0 - 1.0;
  vec3 c = vec3((n.x + projectionMatrix[2][0]) / projectionMatrix[0][0], (n.y + projectionMatrix[2][1]) / projectionMatrix[1][1], -1.0);
  return normalize((vec4(c, 0.0) * viewMatrix).xyz);
}
float eyePlace(vec3 e){
  if (dot(e - PC1, PN1) > 0.0) return 0.0;
  if (dot(e - PC2, PN2) > 0.0) return e.y < FLOOR_Y ? 3.0 : 1.0;
  if (dot(e - PC3, PN3) > 0.0) return 2.0;
  return 3.0;
}
// THE LAW'S OWN COLOURS (uShow 1, set only by the measuring scripts; 0 on every visit): each pixel shows the PLACE the
// law gave it as a flat colour (lake red, garden green, sea blue, stars yellow; a sky at 0.45 of it), so that the law's
// seam can be compared pixel by pixel with the same test worked on the processor.
vec3 lawShow(float pl){ return pl < 0.5 ? vec3(1.0, 0.0, 0.0) : (pl < 1.5 ? vec3(0.0, 1.0, 0.0) : (pl < 2.5 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 1.0, 0.0))); }
float seenPlace(vec3 e, vec3 d, float tmax, out float tq){
  float k = eyePlace(e), t = 0.0;
  tq = 0.0;
  if (k < 0.5) {
    if (crossIn(e, d, tmax, PC1, PN1, PR1, PO1, t)) { tq = t; return 1.0; }
    return 0.0;
  }
  if (k < 1.5) {
    if (crossIn(e, d, tmax, PC2, PN2, PR2, PO2, t)) { tq = t; return 2.0; }
    if (crossIn(e, d, tmax, PC1, PN1, PR1, PO1, t)) { tq = t; return 0.0; }
    return 1.0;
  }
  if (k < 2.5) {
    if (crossIn(e, d, tmax, PC3, PN3, PR3, PO3, t)) { tq = t; return 3.0; }
    if (crossIn(e, d, tmax, PC2, PN2, PR2, PO2, t)) { tq = t; return 1.0; }
    return 2.0;
  }
  if (crossIn(e, d, tmax, PC3, PN3, PR3, PO3, t)) { tq = t; return 2.0; }
  return 3.0;
}
`,u0=`
float h21(vec2 p){ return fract(sin(dot(p, vec2(61.83, 157.29))) * 27183.461); }
float vn(vec2 p){
  vec2 i = floor(p), q = fract(p);
  q = q * q * (3.0 - 2.0 * q);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), q.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), q.x), q.y);
}
float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return s;
}
float fbm2(vec2 p){ return 0.6667 * vn(p) + 0.3333 * vn(p * 2.07 + 5.3); }
`,$=(e,t)=>{const o=e*Math.PI/180,n=t*Math.PI/180;return[Math.sin(o)*Math.cos(n),Math.sin(n),-Math.cos(o)*Math.cos(n)]},z0=(e,t=1)=>{const o=new y.Color(e);return[o.r*t,o.g*t,o.b*t]},ae=(e,t=1)=>O(z0(e,t)),L0=e=>(e*(e+.0245786)-90537e-9)/(e*(.983729*e+.432951)+.238081),T0=e=>{const t=[.59719*e[0]+.35458*e[1]+.04823*e[2],.076*e[0]+.90834*e[1]+.01566*e[2],.0284*e[0]+.13383*e[1]+.83777*e[2]].map(a=>L0(a/.6)),o=[1.60475*t[0]-.53108*t[1]-.07367*t[2],-.10208*t[0]+1.10813*t[1]-.00605*t[2],-.00327*t[0]-.07276*t[1]+1.07602*t[2]].map(a=>Math.min(1,Math.max(0,a))),n=.2126*o[0]+.7152*o[1]+.0722*o[2];return o.map(a=>{const r=Math.min(1,Math.max(0,n+(a-n)*1.04));return 255*(r<.0031308?r*12.92:1.055*Math.pow(r,1/2.4)-.055)})},v0=new Map,I0=(e,t=1)=>{let o=v0.get(e);if(!o){const n=[1,3,5].map(a=>parseInt(e.slice(a,a+2),16));o=n.map(a=>Math.pow(a/255,2.2)*.8+.002);for(let a=0;a<1500;a++){const r=T0(o);if(Math.max(Math.abs(n[0]-r[0]),Math.abs(n[1]-r[1]),Math.abs(n[2]-r[2]))<.005)break;for(let l=0;l<3;l++)o[l]=Math.max(1e-5,o[l]*(1+.03*Math.sign(n[l]-r[l])*Math.min(1,Math.abs(n[l]-r[l])/6)))}v0.set(e,o)}return[o[0]*t,o[1]*t,o[2]*t]},k=(e,t=1)=>O(I0(e,t)),p0=[140,-240],m0=1400,w0=[Math.sin(178*Math.PI/180),-Math.cos(178*Math.PI/180)],x0=[p0[0]+m0*w0[0],p0[1]+m0*w0[1]],F={lake:$(0,11),moon:$(338,17),garden:$(67,24),sea:$(57,5),stars:$(255,9),planet:$(178,-7),seamoon:$(148,14)},D=[{along:0,halfAlong:26,halfAcross:30},{along:120,halfAlong:30,halfAcross:24},{along:240,halfAlong:28,halfAcross:22},{along:360,halfAlong:38,halfAcross:22}],E0=4,q0=.22,g0=`
uniform float uTime, uRare;
uniform vec4 uDeal;
const vec3 SUN_LAKE = ${O(F.lake)}, MOON_LAKE = ${O(F.moon)}, SUN_GARDEN = ${O(F.garden)}, SUN_SEA = ${O(F.sea)}, SUN_STARS = ${O(F.stars)};
const vec3 PLANET_DIR = ${O(F.planet)}, MOON_SEA = ${O(F.seamoon)}, RARE_DIR = ${O($(128,23))};
const float PLANET_ANG = 0.61087, PLANET_COS = 0.81915, PLANET_DIST = 1.74345;
const vec2 RING_C = vec2(${x0[0].toFixed(2)}, ${x0[1].toFixed(2)});
${[1,2,3].map(e=>"const vec3 LAMP"+e+" = "+O(k0(e))+";").join(`
`)}
struct PL { vec3 sd; vec3 sc; vec3 sky; vec3 gnd; };
PL placeLight(float pl){
  if (pl < 0.5) return PL(SUN_LAKE, vec3(0.30, 0.10, 0.04), vec3(0.060, 0.080, 0.160), vec3(0.045, 0.045, 0.060));
  if (pl < 1.5) return PL(SUN_GARDEN, vec3(1.00, 0.90, 0.70) * 2.6, vec3(0.26, 0.34, 0.52), vec3(0.22, 0.24, 0.16));
  if (pl < 2.5) return PL(SUN_SEA, vec3(1.00, 0.60, 0.28) * 1.9, vec3(0.27, 0.24, 0.37), vec3(0.08, 0.075, 0.11));
  return PL(SUN_STARS, vec3(1.00, 0.95, 0.82) * 2.1, vec3(0.012, 0.016, 0.030), vec3(0.15, 0.28, 0.62));
}
// stars as points of a fixed angular size, never thinner than a pixel and then no brighter (px: the angle of one pixel)
float starField(vec3 d, float cells, float keep, float px){
  vec2 g = vec2(atan(d.x, d.z + 1e-6), asin(clamp(d.y, -1.0, 1.0)) * 1.9) * cells;
  vec2 ci = floor(g), cf = fract(g);
  float h = h21(ci);
  if (h < keep) return 0.0;
  vec2 sp = 0.2 + 0.6 * vec2(h21(ci + 7.3), h21(ci + 19.1));
  float rad = 0.0010 * cells * (0.6 + 0.8 * h21(ci + 3.7)), rp = max(rad, 1.2 * px * cells);
  float dd = length((cf - sp) * vec2(max(cos(g.y / (1.9 * cells)), 0.2), 1.0 / 1.9));
  float tw = 0.78 + 0.22 * sin(uTime * (1.3 + 2.0 * h21(ci + 1.1)) + h * 60.0);
  return smoothstep(rp, rp * 0.35, dd) * (rad * rad) / (rp * rp) * tw * (0.5 + 1.5 * (h - keep) / max(1.0 - keep, 1e-3));
}
// LAKE: the blue hour of a summer evening: deep blue overhead, first stars, a thin moon, orange and rose low in the north
vec3 skyLake(vec3 d, float px){
  float el = max(d.y, 0.0), az = clamp(-d.z / max(length(d.xz), 1e-4), -1.0, 1.0);
  float t = clamp(1.0 - el, 0.0, 1.0); t = t * t * t; t = t * t;
  vec3 col = mix(${k("#0c1638")}, ${k("#24386c")}, t);
  // (round two: the afterglow stronger and broader, orange at the hills rising into rose)
  float north = smoothstep(-0.40, 0.95, az); north = north * sqrt(north);
  vec3 glow = mix(${k("#f49040",1.15)}, ${k("#d05880",.9)}, smoothstep(0.03, 0.26, el));
  col = mix(col, glow, north * exp(-el / 0.155));
  float st = starField(d, 46.0, 0.955, px) * smoothstep(0.12, 0.5, d.y - 0.2 * north);
  col += vec3(0.9, 0.95, 1.0) * st * 1.6;
  float md = acos(clamp(dot(d, MOON_LAKE), -1.0, 1.0)), mr = 0.0125;
  vec3 mo = normalize(MOON_LAKE + vec3(0.0105, 0.0035, 0.0));
  float cres = smoothstep(mr, mr - 1.5 * px - 0.0006, md) * smoothstep(mr * 0.97 - 1.5 * px, mr * 0.97 + 0.0006, acos(clamp(dot(d, mo), -1.0, 1.0)));
  col += vec3(1.0, 0.96, 0.84) * cres * 2.2 + vec3(0.5, 0.6, 0.9) * 0.05 * exp(-md * md / 0.004);
  // the rare visit: northern lights low over the hills
  if (uRare > 0.5) {
    float cur = fbm2(vec2(atan(d.x, -d.z + 1e-6) * 5.0 + uTime * 0.03, 1.7)), ray = vn(vec2(atan(d.x, -d.z + 1e-6) * 60.0, uTime * 0.2));
    float h0 = 0.12 + 0.10 * cur, a = smoothstep(h0, h0 + 0.03, d.y) * exp(-max(d.y - h0, 0.0) / 0.16) * north;
    col += (${k("#40f0a0",.5)} + ${k("#9060e0",.5)} * smoothstep(0.0, 0.3, d.y - h0)) * a * (0.45 + 0.55 * ray);
  }
  return col;
}
// GARDEN: a June morning about seven: clear pale blue, small white clouds, the sun in the east-north-east 22 degrees up
vec3 skyGarden(vec3 d, float px){
  float el = max(d.y, 0.0);
  // (round two: a deeper blue overhead, paling to a warm white at the horizon)
  float t = clamp(1.0 - el, 0.0, 1.0), t3 = t * t * t;
  vec3 col = mix(${k("#3f7fd6")}, ${k("#8fb8ea")}, t * t);
  col = mix(col, ${k("#f6f0e0")}, t3 * t3 * t);
  float sd = max(dot(d, SUN_GARDEN), 0.0), s2 = sd * sd, s8 = s2 * s2 * s2 * s2;
  col += vec3(1.0, 0.92, 0.72) * (0.35 * s8 + 1.6 * s8 * s8 * s8 * s8);
  col += vec3(1.0, 0.96, 0.86) * 30.0 * smoothstep(0.99955, 0.99985, sd);
  // small clouds, each with a side lit by the sun and a side in its own shade
  vec2 cp = d.xz / max(d.y + 0.12, 0.05) * 0.9 + vec2(uTime * 0.004, uTime * 0.0015);
  float cl = fbm(cp * 1.3 + 3.0), cover = smoothstep(0.55, 0.66, cl) * smoothstep(0.03, 0.16, d.y);
  float toSun = fbm(cp * 1.3 + 3.0 + 0.22 * normalize(SUN_GARDEN.xz)), lit = smoothstep(-0.02, 0.07, cl - toSun);
  float body = smoothstep(0.55, 0.80, cl);
  vec3 cc = mix(${k("#fff7e6",1.05)}, ${k("#8c9cbc")}, clamp(0.25 + 0.75 * (1.0 - lit) * (0.45 + 0.55 * body), 0.0, 1.0));
  col = mix(col, cc, cover * 0.95);
  return col;
}
// SEA: sunset after showers: the sun 5 degrees up on bearing 57 (round two: ahead and to the right out of the
// harbour's mouth, behind the islet's hut), towers of cloud rose and gold, the far side deep blue, a pale moon
vec3 skySea(vec3 d, float px){
  float el = max(d.y, 0.0), sd = max(dot(d, SUN_SEA), 0.0);
  float t = clamp(1.0 - el, 0.0, 1.0); t = t * t * t;
  float w = 0.5 + 0.5 * dot(normalize(d.xz + 1e-5), normalize(SUN_SEA.xz));
  vec3 col = mix(mix(${k("#2c4078",.9)}, ${k("#5868a0",.9)}, w), mix(${k("#4a5a90",.9)}, ${k("#f08060",1.1)}, w * w), t);
  float s2 = sd * sd, s8 = s2 * s2 * s2 * s2;
  col += ${k("#ffc878",1.2)} * (0.5 * s8 + 0.9 * s8 * s8 * s8);
  col += ${k("#fff0c0",7)} * smoothstep(0.9990, 0.9996, sd);
  vec2 cp = vec2(atan(d.x, -d.z + 1e-6) * 2.2, d.y * 7.0);
  float tow = fbm(cp + vec2(uTime * 0.002, 0.0)) * 0.7 + 0.3 * fbm(cp * 3.1 + 9.0);
  float top = 0.05 + 0.34 * smoothstep(0.30, 0.75, fbm2(vec2(cp.x * 0.7 + 4.0, 2.0)));
  float cover = smoothstep(top, top - 0.10, d.y - 0.10 * (tow - 0.5)) * smoothstep(0.42, 0.62, tow + 0.25 * (1.0 - d.y / max(top, 0.05)));
  vec3 cc = mix(${k("#6c5c88",.8)}, mix(${k("#ffd0b0",1.05)}, ${k("#ffc878",1.25)}, w), smoothstep(0.45, 0.8, tow) * (0.35 + 0.65 * w));
  col = mix(col, cc, cover * smoothstep(0.0, 0.03, d.y));
  col = mix(col, ${k("#5a3a70",.7)}, 0.55 * w * smoothstep(0.035, 0.012, abs(d.y - 0.045 - 0.02 * vn(vec2(cp.x * 1.3, 1.0)))));
  float md = acos(clamp(dot(d, MOON_SEA), -1.0, 1.0));
  col += vec3(0.95, 0.93, 0.85) * 0.9 * smoothstep(0.014, 0.014 - 1.5 * px - 0.0006, md) * (1.0 - cover);
  return col;
}
// STARS: a very dense sky, the pale band of the galaxy, one soft far cloud; THE PLANET behind the last hut (round two):
// a lit globe 70 degrees wide whose middle stands on bearing 178, seven degrees under the plain's horizon: worked as a
// true ball seen from 1.74 of its radii (each sight line meets it, and the place met is lit by the small sun on bearing
// 255): soft bands that curl, slow storms, the ring's shadow in fine dark lines, a dim blue night side with lightning;
// the small sun; two moons as crescents, left of the globe and clear of it
vec3 skyStars(vec3 d, float px){
  vec3 col = ${k("#02030a",1)};
  vec3 gn = normalize(vec3(0.35, 0.62, 0.70));
  float gq = dot(d, gn) / 0.22, gb = exp(-gq * gq), gf = fbm(vec2(atan(d.x, d.z + 1e-6) * 3.0, d.y * 4.0) + 2.0);
  col += vec3(0.50, 0.55, 0.72) * 0.045 * gb * (0.5 + gf);
  float cd = max(dot(d, normalize(vec3(-0.5, 0.45, 0.72))), 0.0), cl = cd * cd; cl = cl * cl * cl * cl;
  col += mix(${k("#2c8c94",.5)}, ${k("#6c4cb0",.5)}, vn(d.xy * 6.0 + 1.0)) * cl * cl * (0.25 + 0.75 * fbm(d.xz * 9.0 + 4.0)) * 0.5;
  float st = starField(d, 90.0, 0.80, px) + starField(d.zxy, 37.0, 0.80, px) * 1.6 + 0.45 * starField(d.yzx, 160.0, 0.86 - 0.5 * gb, px);
  vec3 tint = mix(vec3(1.0, 0.91, 0.78), vec3(0.78, 0.85, 1.0), h21(floor(d.xy * 400.0)));
  col += tint * st * 1.5;
  // a low thin haze of ice dust where the far ice meets the sky, a little warmer toward the sun
  float hz = exp(-abs(d.y - 0.05) / 0.045), sunSide = 0.5 + 0.5 * dot(normalize(d.xz + 1e-5), normalize(SUN_STARS.xz));
  col += mix(vec3(0.10, 0.14, 0.24), vec3(0.30, 0.27, 0.22), sunSide * sunSide) * 0.16 * hz;
  // THE PLANET
  float pc0 = dot(d, PLANET_DIR);
  if (pc0 > PLANET_COS - 0.03) {
    float bq = PLANET_DIST * pc0, disc = bq * bq - (PLANET_DIST * PLANET_DIST - 1.0);
    float pa = acos(clamp(pc0, -1.0, 1.0)), edge = smoothstep(PLANET_ANG, PLANET_ANG - 1.5 * px - 0.0012, pa);
    if (disc > 0.0) {
      vec3 n = normalize(d * (bq - sqrt(disc)) - PLANET_DIR * PLANET_DIST);
      float lt = asin(clamp(n.y, -1.0, 1.0)), lon = atan(n.x, -n.z) - uTime * 0.0035;
      float warp = fbm(vec2(lon * 2.4, lt * 6.5)) - 0.5, curl = vn(vec2(lon * 10.0 + 4.0 * warp, lt * 30.0)) - 0.5;
      float y = lt + 0.075 * warp + 0.011 * curl;
      float b1 = 0.5 + 0.5 * sin(y * 17.0 + 1.6 * vn(vec2(y * 6.0, 1.0))), b2 = vn(vec2(y * 33.0, 4.0 + 0.6 * warp));
      vec3 pc = mix(${k("#ecdcae",.95)}, ${k("#d6a868",.95)}, smoothstep(0.18, 0.82, b1));
      pc = mix(pc, ${k("#a8c0d8",.9)}, smoothstep(0.50, 0.92, vn(vec2(y * 4.3, 3.0))) * 0.62);
      pc *= 0.84 + 0.32 * b2;
      // two slow storms: an oval with a pale collar, drifting with the bands
      vec2 s1 = vec2((lon + 0.55 + 0.03 * sin(uTime * 0.01)) * cos(lt), lt - 0.44) / vec2(0.15, 0.058);
      vec2 s2 = vec2((lon - 0.42) * cos(lt), lt - 0.70) / vec2(0.075, 0.034);
      float d1 = length(s1 + 0.25 * warp), d2 = length(s2 + 0.2 * warp);
      pc = mix(pc, ${k("#c8744c",.9)}, 0.78 * smoothstep(1.0, 0.45, d1));
      pc = mix(pc, ${k("#f4ecd8",.9)}, 0.35 * smoothstep(0.30, 0.0, abs(d1 - 1.05)) + 0.6 * smoothstep(1.0, 0.4, d2));
      float mu = clamp(dot(n, -d), 0.0, 1.0), sun = dot(n, SUN_STARS), day = smoothstep(-0.45, 0.30, sun);
      // the ring's shadow: fine dark lines along the low latitudes of the day side
      float rs = smoothstep(0.46, 0.60, vn(vec2(lt * 230.0, 2.0))) * smoothstep(0.215, 0.235, lt) * smoothstep(0.37, 0.34, lt);
      vec3 lit = pc * (1.35 * day * (0.30 + 0.70 * pow(mu, 0.55)) * (0.72 + 0.28 * clamp(sun, 0.0, 1.0))) * (1.0 - 0.62 * rs);
      lit += vec3(0.55, 0.72, 1.0) * 0.38 * pow(1.0 - mu, 3.0) * day;
      // the night side: dim blue by the ring's own light, with small flickers of lightning
      vec3 night = pc * vec3(0.060, 0.100, 0.190) * (0.45 + 0.55 * mu) + vec3(0.012, 0.022, 0.050) * pow(1.0 - mu, 2.0);
      vec2 lq = vec2(lon * 13.0, lt * 19.0), lc = floor(lq);
      float tk = floor(uTime * 2.6), fl = step(0.955, h21(lc + tk * 0.371)) * step(0.5, h21(lc + 3.1)) * smoothstep(0.13, 0.02, length(fract(lq) - 0.5 - 0.5 * (vec2(h21(lc + tk), h21(lc - tk)) - 0.5)));
      night += vec3(0.60, 0.74, 1.0) * 0.9 * fl;
      col = mix(col, lit + night * (1.0 - day), edge);
    }
    // a thin air glow just outside the sunward limb
    col += vec3(0.45, 0.60, 1.0) * 0.10 * smoothstep(PLANET_ANG + 0.018, PLANET_ANG, pa) * smoothstep(PLANET_ANG - 0.004, PLANET_ANG, pa) * smoothstep(-0.2, 0.5, dot(normalize(d - PLANET_DIR * pc0), normalize(SUN_STARS - PLANET_DIR * dot(SUN_STARS, PLANET_DIR))));
  }
  float sa = acos(clamp(dot(d, SUN_STARS), -1.0, 1.0));
  col += vec3(15.0, 14.2, 12.6) * smoothstep(0.0075, 0.0075 - 1.5 * px - 0.0004, sa) + vec3(1.0, 0.93, 0.8) * 0.06 * exp(-sa / 0.05);
  for (int i = 0; i < 2; i++) {
    // (their places are dealt by the seed: the larger about bearing 120, 13 degrees up; the smaller about bearing 139, 20 up)
    float maz = i == 0 ? 2.094 + 0.07 * uDeal.z : 2.426 + 0.03 * uDeal.w, mel = i == 0 ? 0.227 + 0.03 * uDeal.w : 0.349 + 0.025 * uDeal.z;
    vec3 mdir = vec3(sin(maz) * cos(mel), sin(mel), -cos(maz) * cos(mel)) + 0.0 * d;
    vec3 rel = d - mdir, sdir = normalize(SUN_STARS - mdir * dot(SUN_STARS, mdir)), tdir = cross(mdir, sdir);
    float mr = i == 0 ? 0.020 : 0.012, ma = length(rel), uu = dot(rel, sdir), vv = dot(rel, tdir);
    // a crescent: the lit limb toward the sun, its inner edge the half of an oval
    float cres = smoothstep(-0.8 * px - 0.0003, 0.8 * px + 0.0003, uu - 0.42 * sqrt(max(mr * mr - vv * vv, 0.0)));
    col = mix(col, vec3(0.86, 0.87, 0.90) * (0.035 + 1.15 * cres * (0.55 + 0.45 * clamp(uu / mr, 0.0, 1.0))), smoothstep(mr, mr - 1.5 * px - 0.0004, ma));
  }
  // the comet (its place dealt by the seed): a small head and a long thin tail that points away from the sun
  vec3 cdir = vec3(sin(uDeal.x) * cos(uDeal.y), sin(uDeal.y), -cos(uDeal.x) * cos(uDeal.y));
  vec3 tdir = normalize(cdir - SUN_STARS * dot(cdir, SUN_STARS) + vec3(0.0, 0.35, 0.0));
  vec3 crel = d - cdir;
  float calong = dot(crel, tdir), cacross = length(crel - tdir * calong), cw = 0.0012 + 0.010 * max(calong, 0.0) + px;
  col += vec3(0.80, 0.90, 1.0) * (1.8 * smoothstep(0.0035, 0.0035 - 1.5 * px - 0.0004, length(crel)) + 0.45 * smoothstep(-0.002, 0.012, calong) * exp(-calong / 0.085) * exp(-cacross * cacross / (cw * cw)) * 0.0022 / cw);
  if (uRare > 0.5) {
    // the rare visit: a second ringed planet, small and far (bearing 128, 23 degrees up, between the moons): a cream disc lit from the
    // sun's side, its ring a flat ellipse across it, the ring's far half hidden behind the disc
    float c2 = dot(d, RARE_DIR);
    if (c2 > 0.995) {
      vec3 e1 = normalize(cross(vec3(0.0, 1.0, 0.0), RARE_DIR)), e2 = cross(RARE_DIR, e1);
      vec2 q = vec2(dot(d, e1), dot(d, e2));
      q = vec2(q.x * 0.94 + q.y * 0.342, q.y * 0.94 - q.x * 0.342);
      float disc = smoothstep(0.011, 0.011 - 1.5 * px - 0.0004, length(q));
      vec2 sq = normalize(vec2(dot(SUN_STARS, e1), dot(SUN_STARS, e2)) + 1e-5);
      col = mix(col, ${k("#e8d0a0",1.3)} * (0.22 + 0.78 * smoothstep(-0.009, 0.006, dot(q, sq))) * (0.85 + 0.15 * sin(q.y * 1500.0)), disc);
      float rl = length(q * vec2(1.0, 3.4));
      float ring = smoothstep(0.0032 + px, 0.0, abs(rl - 0.0205)) + 0.6 * smoothstep(0.0022 + px, 0.0, abs(rl - 0.0158));
      col += ${k("#f0e0c0",.9)} * min(ring, 1.0) * (q.y < 0.0 ? 1.0 : 1.0 - disc);
    }
  }
  return col;
}
vec3 skyOf(float pl, vec3 d, float px){
  if (pl < 0.5) return skyLake(d, px);
  if (pl < 1.5) return skyGarden(d, px);
  if (pl < 2.5) return skySea(d, px);
  return skyStars(d, px);
}
// EACH PLACE'S AIR, laid only over the part of a sight line that lies in that place: len metres of it, its middle at pm
vec3 placeAir(float pl, vec3 col, vec3 dir, float len, vec3 pm){
  float ym = max(pm.y, 0.0);
  if (pl < 0.5) {
    float sheet = 0.45 + 1.1 * fbm2(pm.xz * 0.013 + vec2(uTime * 0.006, uTime * 0.003));
    float od = len * (0.00085 * exp(-ym / 90.0) + 0.0011 * sheet * exp(-ym / 2.6));
    float north = smoothstep(-0.35, 1.0, clamp(-dir.z / max(length(dir.xz), 1e-4), -1.0, 1.0));
    vec3 fc = mix(${k("#5a6c98",.62)}, ${k("#b87c78",.62)}, north * north * 0.45 * exp(-max(dir.y, 0.0) / 0.12));
    return mix(fc, col, exp(-od));
  }
  if (pl < 1.5) {
    // clear to about 120 m, then the morning's haze gathers low over the far end, the belt and the hills
    float od = len * 0.00016 * exp(-ym / 160.0) + (len * 0.00030 + 0.85 * smoothstep(120.0, 380.0, len)) * exp(-ym / 14.0);
    float sd = max(dot(dir, SUN_GARDEN), 0.0);
    return mix(mix(${k("#d4e2ee",.8)}, ${k("#f8f1dc",.92)}, 0.10 + 0.90 * sd * sd) + vec3(0.20, 0.15, 0.06) * sd * sd, col, exp(-od));
  }
  if (pl < 2.5) {
    float od = len * 0.00075 * exp(-ym / 90.0);
    float w = 0.5 + 0.5 * dot(normalize(dir.xz + 1e-5), normalize(SUN_SEA.xz));
    return mix(mix(${k("#4a5a90",.85)}, ${k("#f0a070",1)}, w * w), col, exp(-od));
  }
  // the ring: no air, only a thin haze of ice dust over the far sheet (nothing within 300 m is touched)
  return mix(vec3(0.030, 0.042, 0.075), col, exp(-max(len - 300.0, 0.0) * 0.00022));
}
// THE LIGHT OF THE NEXT PLACE AT THIS PLACE'S OPENING: a fixed light at a fixed place (the opening's own middle), read
// from the lit surface's place and facing alone. It does not know the eye.
vec3 doorGlow(float pl, vec3 w, vec3 N){
  // (round four: the opening is the box's doorway, 6.4 m by 13.3 m: c is its middle, 3.95 m over the line; hgt is half
  // its height; dep is the depth of the doorway before the plane, where the open doors and the head's soffit stand)
  vec3 c, n, lc; float area, hgt = 6.65, dep = 3.4;
  if (pl < 0.5) { c = vec3(PC1.x, PC1.y + 3.95, PC1.z); n = PN1; lc = vec3(1.9, 1.25, 0.55); area = 60.0; }
  else if (pl < 1.5) { c = vec3(PC2.x, PC2.y + 3.95, PC2.z); n = PN2; lc = vec3(1.7, 0.95, 0.42); area = 60.0; }
  else if (pl < 2.5) { c = vec3(PC3.x, PC3.y + 3.95, PC3.z); n = PN3; lc = vec3(0.26, 0.33, 0.50); area = 60.0; }
  else return vec3(0.0);
  vec3 v = w - c;
  float r = length(v), dn = dot(v, n);
  if (dn < -0.02 || r > 60.0) return vec3(0.0);
  // the opening as a lit area seen from the surface: its own cosine, the surface's cosine, its size over the distance
  vec3 vd = v / max(r, 1e-3);
  float cosE = clamp(dn / max(r, 1e-3), 0.0, 1.0), cosS = clamp(dot(N, -vd), 0.0, 1.0);
  float far = cosE * cosS * area / (r * r + 0.6 * area) * smoothstep(30.0, 10.0, r);
  // the frame's own reveals (within its depth, facing the opening's axis) see the inner place's whole brightness
  // (a jamb faces the doorway's upright middle band, the head's soffit its level middle band)
  vec3 ax = v - n * dn;
  float hl = length(ax.xz);
  ax.xz *= max(hl - 2.2, 0.0) / max(hl, 1e-3);
  ax.y = sign(ax.y) * max(abs(ax.y) - (hgt - 1.0), 0.0);
  float inward = clamp(dot(N, -ax / max(length(ax), 1e-3)), 0.0, 1.0);
  float rev = inward * smoothstep(dep + 0.35, dep + 0.05, dn) * smoothstep(4.2, 3.4, hl) * step(abs(v.y), hgt + 0.2);
  return lc * (1.5 * far + 1.5 * rev);
}
// THE LANTERN on the jetties of the garden's, the sea's and the last hut: a small warm light at a fixed place, with a
// small steady flicker on the clock; its light lies on planks, water, ice and the hut's flank by where they stand and
// how they face (pale by the garden's day). The lake's hut has none, and no light stands beside it (the brief's never
// list, item 5).
vec3 lampGlow(float pl, vec3 w, vec3 N){
  if (pl < 0.5) return vec3(0.0);
  vec3 lp = pl < 1.5 ? LAMP1 : (pl < 2.5 ? LAMP2 : LAMP3);
  vec3 v = lp - w;
  float r2 = dot(v, v);
  if (r2 > 400.0) return vec3(0.0);
  float fl = 0.86 + 0.09 * sin(uTime * 5.3 + lp.x) + 0.05 * sin(uTime * 12.7 + lp.z);
  float k = pl < 1.5 ? 0.10 : (pl < 2.5 ? 0.55 : 1.5);
  return vec3(1.0, 0.60, 0.24) * k * fl * (0.25 + 0.75 * clamp(dot(N, v) / sqrt(r2 + 1e-4), 0.0, 1.0)) * 1.9 / (1.0 + r2 * 0.55) * smoothstep(400.0, 120.0, r2);
}
uniform sampler2D tShade;
uniform vec4 uShadeBox;
// whether the place's sun reaches a point: the place's shadow-height map (the height up to which each spot of the
// plan lies in shadow, made at the build from where things stand), and in the garden the slow shadows of the clouds
// THE GARDEN'S FAIR-WEATHER CLOUDS (CLOUDS): the shadows of four clouds crossing the ground toward the west-north-west
// at 4 m a second on the clock; along the wind they stand evenly round the 480 m after which each comes round again, a
// quarter of it (120 m) apart. Across the wind their lanes (uCloudAc) are laid by the world at the build, clear of the
// canal and of the garden hut (the world's cloudLanes, which the build tests).
uniform vec4 uCloudAc;
float cloudOne(float al, float ac, float wob, vec4 k){
  return smoothstep(1.0, 0.5, length(vec2((mod(al - k.x + 240.0, 480.0) - 240.0) / k.z, (ac - k.y) / k.w)) + wob);
}
float cloudShade(vec2 p){
  float al = -0.941 * p.x - 0.339 * p.y - ${E0.toFixed(1)} * uTime, ac = 0.339 * p.x - 0.941 * p.y;
  float wob = ${q0.toFixed(2)} * (fbm(vec2(al, ac) * 0.03) - 0.5);
  return max(max(cloudOne(al, ac, wob, vec4(${D[0].along.toFixed(1)}, uCloudAc.x, ${D[0].halfAlong.toFixed(1)}, ${D[0].halfAcross.toFixed(1)})), cloudOne(al, ac, wob, vec4(${D[1].along.toFixed(1)}, uCloudAc.y, ${D[1].halfAlong.toFixed(1)}, ${D[1].halfAcross.toFixed(1)}))),
             max(cloudOne(al, ac, wob, vec4(${D[2].along.toFixed(1)}, uCloudAc.z, ${D[2].halfAlong.toFixed(1)}, ${D[2].halfAcross.toFixed(1)})), cloudOne(al, ac, wob, vec4(${D[3].along.toFixed(1)}, uCloudAc.w, ${D[3].halfAlong.toFixed(1)}, ${D[3].halfAcross.toFixed(1)}))));
}
float sunSeen(float pl, vec3 w){
  vec2 sq = (w.xz - uShadeBox.xy) * uShadeBox.zw;
  // (beyond the map's own box nothing is shadowed)
  float h = (sq.x < 0.0 || sq.x > 1.0 || sq.y < 0.0 || sq.y > 1.0) ? -100.0 : texture2D(tShade, sq).r;
  float s = smoothstep(-0.10, 0.32, w.y - h + 0.05);
  if (pl > 0.5 && pl < 1.5) s *= 1.0 - 0.45 * cloudShade(w.xz);
  return s;
}
vec3 shadeIt(float pl, vec3 alb, vec3 N, vec3 w, vec3 dir, float sv, float gloss, float trans){
  PL L = placeLight(pl);
  float ndl = max(dot(N, L.sd), 0.0);
  vec3 col = alb * (L.sc * ndl * sv + mix(L.gnd, L.sky, N.y * 0.5 + 0.5));
  float thr = max(dot(dir, L.sd), 0.0);
  col += alb * L.sc * sv * trans * (0.25 + 0.75 * thr * thr) * (1.0 - ndl);
  float sp = max(dot(N, normalize(L.sd - dir)), 0.0), sp2 = sp * sp, sp8 = sp2 * sp2 * sp2 * sp2;
  col += L.sc * sv * gloss * sp8 * sp8 * sp8 * sp8;
  col += alb * (doorGlow(pl, w, N) + lampGlow(pl, w, N));
  return col;
}
// THE LOOK OF THE RING'S SHEET: fine lanes that run with the ring's own circles, a grain of packed ice, small glints
// (more of them toward the low sun), and the pale light of its countless faces
void ringLook(vec3 w, float sv, inout vec3 alb, inout vec3 emi){
  float fw3 = fwidth(w.x) + fwidth(w.z), rho = length(w.xz - RING_C);
  float k1 = smoothstep(26.0, 7.0, fw3), k2 = smoothstep(7.0, 1.6, fw3), k3 = smoothstep(1.6, 0.3, fw3);
  float lane = 1.0 + k1 * 0.50 * (vn(vec2(rho * 0.085, 3.0)) - 0.5) + k2 * 0.44 * (vn(vec2(rho * 0.43, 7.0)) - 0.5) + k3 * 0.36 * (vn(vec2(rho * 2.1, 11.0)) - 0.5);
  alb *= lane;
  alb *= mix(1.0, 0.74 + 0.52 * vn(w.xz * 2.7), smoothstep(0.50, 0.08, fw3)) * mix(1.0, 0.86 + 0.28 * vn(w.xz * 0.31 + 5.0), smoothstep(5.0, 1.0, fw3));
  vec3 vd = normalize(w - cameraPosition);
  float toSun = max(dot(normalize(vd.xz), normalize(SUN_STARS.xz)), 0.0), swath = 0.35 + 0.65 * toSun * toSun;
  vec2 g1 = w.xz * 6.0, i1 = floor(g1), g2 = w.xz * 1.3, i2 = floor(g2);
  float tw1 = 0.5 + 0.5 * sin(uTime * (0.7 + 1.6 * h21(i1 + 3.0)) + 40.0 * h21(i1 + 9.0)), tw2 = 0.5 + 0.5 * sin(uTime * (0.6 + 1.2 * h21(i2 + 3.0)) + 40.0 * h21(i2 + 9.0));
  float gl = step(0.975, h21(i1)) * smoothstep(0.34, 0.08, length(fract(g1) - 0.5)) * tw1 * smoothstep(0.16, 0.03, fw3)
           + step(0.955, h21(i2)) * smoothstep(0.30, 0.06, length(fract(g2) - 0.5)) * tw2 * smoothstep(1.3, 0.35, fw3) * smoothstep(0.05, 0.2, fw3);
  emi += vec3(1.0, 0.97, 0.90) * gl * sv * swath * 1.5;
  emi += alb * vec3(0.50, 0.55, 0.64) * (0.20 + 0.24 * sv);
}
// WHAT A SURFACE IS MADE OF, by the kind its vertices carry (uv in metres on the face)
void surface(float kind, float ex, vec2 uv, vec3 w, float sv, inout vec3 alb, inout float gloss, inout vec3 emi, inout float trans){
  vec2 fw2 = fwidth(uv);
  float fw = max(fw2.x, fw2.y);
  if (kind < 0.5) return;
  if (kind < 1.5) {                                   // tarred boards, 0.19 m wide along uv.x
    float pk = uv.x / 0.19, id = floor(pk), e = abs(fract(pk) - 0.5), keep = smoothstep(0.55, 0.12, fw / 0.19);
    alb *= mix(1.0, (0.78 + 0.40 * h21(vec2(id, 3.0))) * (1.0 - 0.6 * smoothstep(0.43, 0.5, e)) * (0.86 + 0.28 * vn(vec2(pk * 7.0, uv.y * 1.1 + id * 5.3))), keep);
    return;
  }
  if (kind < 2.5) {                                   // turf and long grass, with small flowers
    alb *= 0.62 + 0.76 * fbm(uv * 1.9);
    float sp = step(0.988, h21(floor(uv * 11.0))) * smoothstep(0.10, 0.03, fw);
    alb = mix(alb, mix(vec3(0.85, 0.80, 0.45), vec3(0.80, 0.78, 0.86), h21(floor(uv * 11.0) + 2.0)), sp * ex);
    trans = 0.25;
    return;
  }
  if (kind < 3.5) {                                   // rough stone in courses
    float row = floor(uv.y / 0.34);
    vec2 q = vec2(uv.x / 0.62 + 0.5 * mod(row, 2.0) + 0.3 * h21(vec2(row, 1.0)), uv.y / 0.34);
    vec2 e = abs(fract(q) - 0.5);
    float keep = smoothstep(0.30, 0.08, fw);
    alb *= mix(1.0, (0.72 + 0.5 * h21(floor(q))) * (1.0 - 0.5 * smoothstep(0.44, 0.5, max(e.x, e.y))), keep) * (0.85 + 0.3 * vn(uv * 6.0));
    return;
  }
  if (kind < 4.5) {                                   // brick in running bond, 0.225 by 0.075
    float row = floor(uv.y / 0.075);
    vec2 q = vec2(uv.x / 0.225 + 0.5 * mod(row, 2.0), uv.y / 0.075);
    vec2 e = abs(fract(q) - 0.5);
    float keep = smoothstep(0.075, 0.02, fw);
    float mort = smoothstep(0.455, 0.5, e.x) + smoothstep(0.40, 0.5, e.y);
    alb = mix(alb * (0.90 + 0.2 * vn(uv * 1.3)), mix(alb * (0.74 + 0.5 * h21(floor(q))), vec3(0.62, 0.58, 0.52), clamp(mort, 0.0, 1.0) * 0.8), keep);
    return;
  }
  if (kind < 5.5) {                                   // clipped yew and box: a close dark fleece
    alb *= 0.50 + 0.95 * fbm(uv * 4.5) * (0.7 + 0.6 * vn(uv * 19.0));
    trans = 0.12;
    return;
  }
  if (kind < 6.5) {                                   // gravel
    alb *= mix(1.0, 0.78 + 0.44 * vn(uv * 26.0), smoothstep(0.08, 0.02, fw)) * (0.92 + 0.16 * fbm(uv * 0.7));
    return;
  }
  if (kind < 7.5) {                                   // lawn: mown stripes, dew that glints
    float stripe = smoothstep(-0.2, 0.2, sin(uv.x * 2.85)) * smoothstep(0.9, 0.3, fw);
    alb *= (0.84 + 0.30 * fbm(uv * 0.8)) * (0.95 + 0.10 * stripe) * (0.80 + 0.40 * fbm2(uv * 0.045 + 7.0)) * mix(1.0, 0.86 + 0.28 * vn(uv * 30.0), smoothstep(0.07, 0.02, fw));
    float dew = step(0.9965, h21(floor(uv * 34.0))) * smoothstep(0.05, 0.015, fw);
    emi += vec3(1.0, 0.97, 0.85) * dew * sv * 1.6 * (0.5 + 0.5 * sin(uTime * 2.0 + 40.0 * h21(floor(uv * 34.0) + 1.0)));
    trans = 0.2;
    return;
  }
  if (kind < 8.5) {                                   // tilled soil in rows
    alb *= (0.74 + 0.5 * vn(uv * 9.0)) * (0.88 + 0.2 * sin(uv.x * 10.5) * smoothstep(0.3, 0.1, fw));
    return;
  }
  if (kind < 9.5) {                                   // lime-washed panes: milky, white bars, plants pressing from inside
    vec2 q = vec2(uv.x / 0.62, uv.y / 1.45);
    vec2 e = abs(fract(q) - 0.5);
    float bar = max(smoothstep(0.455, 0.475, e.x), smoothstep(0.482, 0.492, e.y)) * smoothstep(0.30, 0.08, fw);
    float plant = smoothstep(0.42, 0.62, fbm(uv * vec2(0.55, 0.42) + 3.0) + 0.30 - 0.11 * uv.y) * (0.75 + 0.25 * vn(uv * 5.0));
    vec3 glass = mix(alb * (0.90 + 0.12 * vn(uv * 1.7)), mix(vec3(0.07, 0.17, 0.08), vec3(0.20, 0.36, 0.14), vn(uv * 2.6)), plant * 0.70);
    alb = mix(glass, vec3(0.90, 0.90, 0.86), bar);
    gloss = 0.55 * (1.0 - bar);
    return;
  }
  // a lit window
  if (kind < 10.5) { emi += alb * ex * (0.85 + 0.15 * sin(uTime * 1.7 + w.x * 0.37)); alb *= 0.2; return; }
  if (kind < 11.5) {                                  // leaves in a crown
    alb *= 0.55 + 0.9 * fbm(uv * 2.6) * (0.75 + 0.5 * vn(uv * 11.0));
    trans = 0.45;
    return;
  }
  if (kind < 12.5) {                                  // paving flags and copings, 0.9 m slabs
    vec2 q = uv / 0.9; q.x += 0.5 * mod(floor(q.y), 2.0);
    vec2 e = abs(fract(q) - 0.5);
    alb *= mix(1.0, (0.86 + 0.26 * h21(floor(q))) * (1.0 - 0.4 * smoothstep(0.465, 0.5, max(e.x, e.y))), smoothstep(0.5, 0.12, fw)) * (0.9 + 0.2 * vn(uv * 3.0));
    return;
  }
  // far wooded hills
  if (kind < 13.5) { alb *= 0.72 + 0.56 * fbm(uv * 0.035); return; }
  // bark
  if (kind < 14.5) { alb *= 0.70 + 0.6 * vn(vec2(uv.x * 14.0, uv.y * 1.3)); trans = 0.3; return; }
  // petals
  if (kind < 15.5) { trans = 0.7; return; }
  // a thing that glows
  if (kind < 16.5) { emi += alb * ex; alb *= 0.0; return; }
  if (kind < 17.5) {                                  // ice, rock of the ring: facets that glint
    alb *= 0.8 + 0.4 * vn(uv * 0.9);
    // (great ice, ex 1: old layers and cracks across its faces, by height)
    if (ex > 0.5) alb *= (0.80 + 0.14 * vn(vec2(w.y * 0.55 + 0.12 * (w.x + w.z), 3.0)) + 0.06 * vn(vec2(w.y * 2.3, w.x * 0.2 + w.z * 0.2))) * mix(1.0, 0.86 + 0.28 * vn(w.xz * 1.7 + w.y * 1.3), smoothstep(0.5, 0.1, fw));
    vec2 gq = uv * 2.2 + w.xz * 0.37, gi = floor(gq);
    float gl = step(0.985, h21(gi)) * smoothstep(0.30, 0.05, length(fract(gq) - 0.5)) * (0.5 + 0.5 * sin(uTime * (0.8 + 1.5 * h21(gi + 3.0)) + 40.0 * h21(gi + 9.0)));
    emi += vec3(1.0, 0.97, 0.90) * gl * gl * sv * 1.4 * smoothstep(0.5, 0.1, fw);
    // (light that has gone into the block comes out of every face of it: its shaded faces are a deep blue, never grey)
    emi += alb * vec3(0.05, 0.10, 0.21) * (0.7 + 0.6 * vn(uv * 0.9 + 3.0));
    gloss = 0.6;
    trans = 0.24;
    return;
  }
  // rough rock and cliff: beds that dip a little, paler and darker by turns, dark seams between them; with ex (a rock
  // that stands in the sea) a dark wet foot, a pale line of barnacles at the tide's height
  if (kind < 18.5) {
    float by = w.y + 0.07 * w.x - 0.04 * w.z + 1.3 * vn(w.xz * 0.06) + 0.35 * vn(w.xz * 0.5);
    float bed = 0.6 * vn(vec2(by * 0.75, 3.0)) + 0.4 * vn(vec2(by * 2.9, 9.0));
    float seam = smoothstep(0.40, 0.5, abs(fract(by * 0.62 + 0.3 * vn(vec2(by * 0.2, 5.0))) - 0.5)) * smoothstep(1.0, 0.25, fwidth(by) * 0.62);
    alb *= (0.62 + 0.72 * bed) * (1.0 - 0.38 * seam) * (0.85 + 0.3 * fbm(uv * 0.5));
    if (ex > 0.5) {
      // (the sea stands at y -1: wet and dark to 1.5 m over it, a pale line of barnacles 0.9 m over it)
      float tide = w.y + 1.0 - 0.25 * vn(w.xz * 0.9);
      alb *= mix(0.42, 1.0, smoothstep(0.3, 1.5, tide));
      alb = mix(alb, vec3(0.42, 0.40, 0.33), 0.38 * smoothstep(0.28, 0.0, abs(tide - 0.9)));
      gloss = 0.35 * smoothstep(1.2, 0.2, tide);
    }
    return;
  }
  if (kind < 19.5) {                                  // a jet of water: white, beads running along it with the clock (ex: their speed, metres a second along uv.y)
    float bead = 0.5 + 0.5 * sin((uv.y - uTime * ex) * 9.0 + 3.0 * sin(uv.x * 40.0));
    alb *= 0.72 + 0.28 * bead;
    emi += alb * 0.25 * bead;
    gloss = 0.9;
    trans = 0.6;
    return;
  }
  if (kind < 20.5) {                                  // a cut bed of flowers: heads of the bed's colour set close among dark leaves, by the ground's own place
    float c = 0.6 * vn(w.xz * 2.6) + 0.4 * vn(w.xz * 6.5 + 7.0);
    float keep = smoothstep(1.1, 0.3, (fwidth(w.x) + fwidth(w.z)) * 2.6);
    alb = mix(alb * 0.74, mix(vec3(0.035, 0.11, 0.03), alb, smoothstep(0.36, 0.52, c)), keep) * (0.8 + 0.4 * vn(w.xz * 1.7));
    trans = 0.5;
    return;
  }
  if (kind < 21.5) {                                  // a lamp that flashes on its own slow rhythm of the world's clock (by where it stands)
    float cell = h21(floor(w.xz / 6.0) + 0.5), per = 2.6 + 3.2 * cell, ph = fract(uTime / per + cell * 7.0);
    emi += alb * ex * (0.05 + smoothstep(0.0, 0.03, ph) * smoothstep(0.34, 0.26, ph));
    alb *= 0.08;
    return;
  }
  if (kind < 22.5) {                                  // a net hung to dry: a dark mesh of diamonds
    vec2 q = vec2(uv.x + uv.y, uv.x - uv.y) / 0.14, e = abs(fract(q) - 0.5);
    alb *= mix(0.62, 0.30 + 0.75 * smoothstep(0.30, 0.46, max(e.x, e.y)), smoothstep(0.12, 0.03, fw)) * (0.8 + 0.4 * vn(uv * 2.0));
    trans = 0.35;
    return;
  }
  if (kind < 23.5) {                                  // the ring's sheet of ice: its bands are the geometry's own colours; here the lanes, the grain, the glints
    // (ex 1: the far side of the ring, beyond the planet: it is hidden where the globe stands before it)
    if (ex > 0.5 && dot(normalize(w - cameraPosition), PLANET_DIR) > PLANET_COS) discard;
    ringLook(w, sv, alb, emi);
    return;
  }
  if (kind < 24.5) {                                  // a sail: canvas in cloths 0.6 m wide, the low sun coming through it
    float e = abs(fract(uv.x / 0.6) - 0.5);
    alb *= (0.90 + 0.16 * vn(uv * 0.9)) * (1.0 - 0.22 * smoothstep(0.44, 0.5, e) * smoothstep(0.4, 0.1, fw));
    trans = 0.75;
    return;
  }
  if (kind > 27.5) {                                  // (28) THE BOX'S LAMP: a slow pulse on the world's clock (ex: the box's dealt phase, in turns); it never reads the eye
    emi += alb * (0.72 + 0.28 * sin(uTime * 0.9 + ex * 6.2832));
    alb *= 0.0;
    return;
  }
  if (kind > 26.5) {                                  // (27) THE BOX'S BLUE: paint on wood, a little grain, pale wear in patches
    float keep = smoothstep(0.30, 0.06, fw);
    alb *= mix(1.0, 0.90 + 0.20 * vn(vec2(uv.x * 11.0, uv.y * 0.8)), keep);
    float worn = smoothstep(0.56, 0.86, vn(uv * 0.9 + 3.7)) * (0.5 + 0.5 * vn(uv * 5.0));
    alb = mix(alb, alb * 1.3 + vec3(0.03, 0.05, 0.07), 0.45 * worn * keep);
    // ITS OWN LIGHT ANSWER (round four): the paint gives back a deep royal blue of its own in every place, the same
    // in all four, so that the box reads blue at the blue hour and under the stars too, where the place's own light
    // would leave it black; the place's light is added to it where it strikes. By the paint alone: never the eye.
    emi += vec3(0.0018, 0.0530, 0.1290) * (alb.b / 0.30);
    gloss = 0.10;
    return;
  }
  if (kind > 25.5) {                                  // (26) THE LEADS of the pack ice: dark clear new ice, with white cracks and bubbles
    // (its colour is the sheet's own band there; ex: 0 within the pack, 1 toward the field's far rim, where it is the
    // sheet again by an uneven edge; uv.x: a contact shade. Round three b: only the leads are drawn so; the last hut's
    // floe is a plate of the pack's own ice, KIND.ICE, like the others)
    float fw4 = fwidth(w.x) + fwidth(w.z);
    float rim = smoothstep(0.30, 0.70, ex + 0.40 * (vn(w.xz * 0.7 + 2.0) - 0.5) + 0.22 * (vn(w.xz * 2.6) - 0.5));
    vec3 sheet = alb, sheetE = vec3(0.0);
    ringLook(w, sv, sheet, sheetE);
    vec3 deep = vec3(0.040, 0.105, 0.140) * uv.x * (0.70 + 0.60 * vn(w.xz * 0.35));
    float cr = min(abs(vn(w.xz * 0.42 + 3.0) - 0.5), 0.6 * abs(vn(w.xz * 1.3 + 9.0) - 0.5) + 0.012);
    float crack = smoothstep(0.022, 0.004, cr) * smoothstep(0.9, 0.2, fw4);
    vec2 bc = w.xz * 4.3, bi = floor(bc);
    float bub = step(0.90, h21(bi)) * smoothstep(0.26, 0.10, length(fract(bc) - 0.5 - 0.3 * (vec2(h21(bi + 5.0), h21(bi + 11.0)) - 0.5))) * smoothstep(0.35, 0.10, fw4);
    deep = mix(deep, vec3(0.50, 0.60, 0.68) * (0.4 + 0.6 * uv.x), max(0.60 * crack, 0.30 * bub));
    // (frost blown over it in thin drifts)
    deep = mix(deep, sheet * 0.8, 0.30 * smoothstep(0.55, 0.80, vn(w.xz * 0.23 + 17.0)) * smoothstep(0.3, 0.6, vn(w.xz * 1.1)));
    alb = mix(deep, sheet, rim);
    emi += sheetE * rim;
    gloss = 0.5 * (1.0 - rim);
    return;
  }
  // (25) a wall with small windows, some of them lit (ex: the lit share)
  vec2 q = vec2(uv.x / 2.3, uv.y / 2.7), cf = fract(q);
  float win = step(abs(cf.x - 0.5), 0.17) * step(abs(cf.y - 0.52), 0.19) * smoothstep(1.2, 0.5, fw);
  float lit = step(1.0 - ex, h21(floor(q) + floor(w.xz / 7.0)));
  alb = mix(alb * (0.88 + 0.24 * vn(uv * 1.4)), vec3(0.03, 0.035, 0.05), win);
  emi += vec3(1.0, 0.70, 0.32) * win * lit * 1.9 * (0.9 + 0.1 * sin(uTime * 1.3 + 9.0 * h21(floor(q))));
}
`,_0=`
attribute vec3 aC;
attribute vec2 aUV;
attribute vec3 aK;
uniform float uTime;
varying vec3 vW, vN, vC, vK;
varying vec2 vUV;
void main(){
  vec3 p = position, n = normal, c = aC;
#ifdef USE_INSTANCING
  p = (instanceMatrix * vec4(p, 1.0)).xyz;
  n = mat3(instanceMatrix) * n;
  #ifdef USE_INSTANCING_COLOR
  c *= instanceColor;
  #endif
#endif
  vec4 w = modelMatrix * vec4(p, 1.0);
  n = normalize(mat3(modelMatrix) * n);
  // the breeze: a thing that sways carries its reach in metres in aK.y
  float sw = aK.y;
  if (sw > 0.0) {
    float ph = w.x * 0.21 + w.z * 0.17;
    w.x += sw * (0.6 * sin(uTime * 1.3 + ph) + 0.4 * sin(uTime * 2.9 + ph * 2.3));
    w.z += sw * 0.5 * sin(uTime * 1.7 + ph * 1.4 + 1.0);
  }
  vW = w.xyz; vN = n; vC = c; vUV = aUV; vK = aK;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,O0=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;
}`,R0=`
uniform float uPlace, uBare, uShow;
varying vec3 vW, vN, vC, vK;
varying vec2 vUV;
`+u0+f0+g0,C0=`
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  // (rock is lit face by face, each face flat, so that a crag reads as rock and not as a soft mound)
  if (vK.x > 17.5 && vK.x < 18.5) { vec3 fn = normalize(cross(dFdx(vW), dFdy(vW))); N = normalize(mix(N, dot(fn, N) < 0.0 ? -fn : fn, 0.85)); }
  vec3 dir = normalize(vW - cameraPosition);
  vec3 alb = vC, emi = vec3(0.0);
  float gloss = 0.0, trans = 0.0, alpha = 1.0, airK = 1.0;
  float sv = sunSeen(uPlace, vW);
  surface(vK.x, vK.z, vUV, vW, sv, alb, gloss, emi, trans);
  vec3 col = shadeIt(uPlace, alb, N, vW, dir, sv, gloss, trans) + emi;
  // (great ice: where the low sun stands behind a thin edge, its light comes through clear green-blue)
  if (vK.x > 16.5 && vK.x < 17.5 && vK.z > 0.5) {
    vec3 sdI = placeLight(uPlace).sd;
    float thru = max(dot(dir, sdI), 0.0), thin = 1.0 - abs(dot(N, dir));
    col += vec3(0.10, 0.62, 0.56) * 1.5 * thru * thru * thru * thin * thin * (1.0 - max(dot(N, sdI), 0.0)) * sv;
  }
`,D0=`
  vec3 lawD = lawRay(vW - cameraPosition) * length(vW - cameraPosition);
  float lawT;
  float lawP = seenPlace(cameraPosition, lawD, 1.0, lawT);
  col = placeAir(uPlace, col, normalize(lawD), (1.0 - lawT) * length(lawD) * airK, cameraPosition + lawD * (0.5 + 0.5 * lawT));
  gl_FragColor = vec4(col, alpha);
  if (uBare < 0.5 && abs(lawP - uPlace) > 0.5) discard;
`,B0=`
varying vec3 vDir;
uniform float uShow;
`+u0+f0+g0+`
void main(){
  vec3 d = lawRay(vDir);
  float px = length(fwidth(d)) * 0.7071;
  float tq;
  float pl = seenPlace(cameraPosition, d, 1.0e9, tq);
  gl_FragColor = vec4(skyOf(pl, d, px), 1.0);
  if (uShow > 0.5) gl_FragColor = vec4(lawShow(pl) * 0.45, 1.0);
}`,U0=`
attribute vec3 iPos;
attribute vec4 iSeed;
uniform float uTime, uSize, uWander, uBlink;
varying vec3 vW, vN, vC, vK;
varying vec2 vUV;
void main(){
  float t = uTime;
  vec3 c = iPos + uWander * vec3(sin(t * (0.31 + 0.4 * iSeed.x) + iSeed.y * 6.28), 0.45 * sin(t * (0.53 + 0.3 * iSeed.z) + iSeed.x * 6.28), cos(t * (0.27 + 0.4 * iSeed.y) + iSeed.z * 6.28));
  c += 0.22 * uWander * vec3(sin(t * 1.7 + iSeed.w * 9.0), sin(t * 2.3 + iSeed.x * 9.0), cos(t * 1.9 + iSeed.y * 9.0));
  float bl = mix(1.0, smoothstep(0.25, 0.8, sin(t * (0.9 + 1.2 * iSeed.w) + iSeed.z * 6.28)), uBlink);
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float sz = uSize * (0.7 + 0.6 * iSeed.w), k = max(sz, length(c - cameraPosition) * 0.0016);
  vec3 w = c + (right * position.x + up * position.y) * k;
  vW = w; vN = vec3(0.0, 1.0, 0.0); vC = vec3(bl * sz * sz / (k * k)); vK = vec3(0.0); vUV = position.xy;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,$0=`
  float r2 = dot(vUV, vUV), alpha = 1.0, airK = 0.0;
  vec3 col = uColor * exp(-r2 * 4.5) * step(r2, 1.0) * vC.x;
`,F0=`
  float r2 = dot(vUV, vUV), airK = 1.0, alpha = smoothstep(1.0, 0.55, r2) * min(vC.x, 1.0);
  PL L = placeLight(uPlace);
  vec3 col = uColor * (L.sc * 0.5 * sunSeen(uPlace, vW) + L.sky);
`,G0=`
attribute vec3 aC;
attribute vec2 aUV;
attribute vec3 aK;
uniform float uTime;
varying vec3 vW, vN, vC, vK;
varying vec2 vUV;
void main(){
  vec3 p = position, c = aC;
  float beat = 0.0;
#ifdef USE_INSTANCING_COLOR
  beat = sin(uTime * instanceColor.b * 20.0 + instanceColor.g * 6.2832);
  c *= instanceColor.r;
#endif
  p.y += aK.z * (0.42 * beat - 0.10 * aK.z);
  p.x *= 1.0 - 0.22 * aK.z * abs(beat);
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vW = w.xyz; vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * vec3(0.0, 1.0, 0.0)); vC = c; vUV = aUV; vK = vec3(0.0);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,K0=`
attribute vec3 aC;
attribute vec2 aUV;
attribute vec3 aK;
uniform float uTime;
varying vec3 vW, vN, vC, vK;
varying vec2 vUV;
void main(){
  vec3 p = position, n = normal, c = aC;
  float g = 0.5, dr = 0.0;
#ifdef USE_INSTANCING_COLOR
  c *= instanceColor.r; g = instanceColor.g; dr = instanceColor.b;
#endif
  // (a block frozen into the pack ice carries -1 in blue: it neither turns nor drifts)
  float run = step(-0.5, dr);
  dr = max(dr, 0.0);
  float sg = fract(g * 7.0), an = run * uTime * (0.05 + 0.22 * fract(g * 13.0)) * (sg < 0.5 ? 1.0 : -1.0) + g * 40.0;
  vec3 ax = normalize(vec3(cos(g * 19.0), 0.35 + sin(g * 31.0), sin(g * 19.0)));
  float ca = cos(an), sa = sin(an);
  p = p * ca + cross(ax, p) * sa + ax * dot(ax, p) * (1.0 - ca);
  n = n * ca + cross(ax, n) * sa + ax * dot(ax, n) * (1.0 - ca);
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
  n = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * n);
  float ph = uTime * (0.07 + 0.08 * fract(g * 5.0)) + g * 90.0;
  w.xz += vec2(-0.087, 0.996) * dr * sin(ph);
  w.y += 0.12 * dr * sin(ph * 1.3 + 1.0);
  vW = w.xyz; vN = n; vC = c; vUV = aUV; vK = aK;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;function V0(e){const t=!!(e.vary&&e.vary.rare),o={uTime:{value:0},uRare:{value:t?1:0},uBare:{value:0},uShow:{value:0},uDeal:{value:new y.Vector4(2.5,.31,0,0)},uCloudAc:{value:new y.Vector4(-1e4,-1e4,-1e4,-1e4)},uVP:{value:new y.Vector4(0,0,0,0)}},n=new y.DataTexture(new Uint16Array([y.DataUtils.toHalfFloat(-100)]),1,1,y.RedFormat,y.HalfFloatType);n.needsUpdate=!0;const a=[0,1,2,3].map(()=>({tShade:{value:n},uShadeBox:{value:new y.Vector4(0,0,1,1)}})),r=[];function l(s,p={}){const f=new y.ShaderMaterial({uniforms:{...o,uPlace:{value:s},tShade:a[s].tShade,uShadeBox:a[s].uShadeBox,...p.uniforms||{}},vertexShader:p.vertex||_0,fragmentShader:R0+(p.defs||"")+`
void main(){
`+(p.body||C0)+D0+(p.transparent?`  if (uShow > 0.5) discard;
`:`  if (uShow > 0.5) gl_FragColor = vec4(lawShow(uPlace), 1.0);
`)+"}",side:p.side??y.FrontSide,transparent:!!p.transparent,depthWrite:p.depthWrite??!p.transparent,blending:p.blending??y.NormalBlending});return f.userData.law=!0,f.userData.place=s,f.name=p.tag||p.name||"place"+s,r.push(f),f}function h(){const s=new y.ShaderMaterial({uniforms:{...o},vertexShader:O0,fragmentShader:B0,side:y.BackSide,depthTest:!1,depthWrite:!1});s.userData.law=!0,s.userData.place=-1,s.name="skies",r.push(s);const p=new y.Mesh(new y.IcosahedronGeometry(1,4),s);return p.frustumCulled=!1,p.renderOrder=-10,p.name="skies",p}function w(s){const p=[];if(s.traverse(f=>{if(f.isMesh||f.isPoints||f.isLine||f.isSprite)for(const x of Array.isArray(f.material)?f.material:[f.material])(!x||!x.userData||!x.userData.law)&&p.push(f.name||f.type)}),p.length)throw new Error("boathouse: a mesh without the law: "+p.slice(0,5).join(", "))}const u=new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]);function v(s,p,f,x){const b=new y.InstancedBufferGeometry,m=p.length,z=new Float32Array(m*3),S=new Float32Array(m*4);for(let I=0;I<m;I++){z.set(p[I],I*3);for(let P=0;P<4;P++)S[I*4+P]=x()}b.setAttribute("position",new y.BufferAttribute(u,3)),b.setIndex([0,1,2,0,2,3]),b.setAttribute("iPos",new y.InstancedBufferAttribute(z,3)),b.setAttribute("iSeed",new y.InstancedBufferAttribute(S,4)),b.instanceCount=m;const E=l(s,{vertex:U0,body:f.dot?F0:$0,defs:`uniform vec3 uColor;
`,transparent:!0,depthWrite:!1,blending:f.dot?y.NormalBlending:y.AdditiveBlending,side:y.DoubleSide,tag:f.tag||"sparks",uniforms:{uColor:{value:new y.Vector3(...f.color)},uSize:{value:f.size},uWander:{value:f.wander??.6},uBlink:{value:f.blink??0}}}),L=new y.Mesh(b,E);return L.frustumCulled=!1,L.name=f.tag||"sparks",L.userData.kind="medium",L}const g=[0,1,2,3].map(s=>l(s,{vertex:G0,side:y.DoubleSide,name:"winged"+s})),c=[0,1,2,3].map(s=>l(s,{name:"solid"+s})),d=[0,1,2,3].map(s=>l(s,{name:"solid2s"+s,side:y.DoubleSide})),i=l(3,{vertex:K0,tag:"ice blocks"});return{U:o,shade:a,mat:l,sky:h,check:w,sparks:v,bird:g,solid:c,solid2:d,ice:i,mats:r,rare:t}}const M={PLAIN:0,BOARDS:1,TURF:2,STONE:3,BRICK:4,YEW:5,GRAVEL:6,LAWN:7,SOIL:8,PANE:9,LIT:10,LEAVES:11,FLAGS:12,HILL:13,BARK:14,PETAL:15,GLOW:16,ICE:17,ROCK:18,JET:19,BED:20,FLASH:21,NET:22,RING:23,SAIL:24,WINDOWS:25,FLOE:26,BOX:27,BOXLAMP:28},X=new y.Vector3,Y=new y.Vector3,J=new y.Matrix3;class n0{constructor(){this.P=[],this.N=[],this.C=[],this.UV=[],this.K=[],this.I=[],this.col=[1,1,1],this.kind=0,this.sway=0,this.ex=0,this.m=null,this.stack=[]}get tris(){return this.I.length/3}c(t,o=0,n=0,a=0){return this.col=t,this.kind=o,this.ex=n,this.sway=a,this}push(t){return this.stack.push(this.m),this.m=this.m?this.m.clone().multiply(t):t.clone(),J.setFromMatrix4(this.m),this.nm=J.clone(),this}pop(){return this.m=this.stack.pop()||null,this.m&&(J.setFromMatrix4(this.m),this.nm=J.clone()),this}v(t,o,n,a,r,l,h,w,u=this.sway,v=this.col){return this.m&&(X.set(t,o,n).applyMatrix4(this.m),Y.set(a,r,l).applyMatrix3(this.nm).normalize(),t=X.x,o=X.y,n=X.z,a=Y.x,r=Y.y,l=Y.z),this.P.push(t,o,n),this.N.push(a,r,l),this.C.push(v[0],v[1],v[2]),this.UV.push(h,w),this.K.push(this.kind,u,this.ex),this.P.length/3-1}quad(t,o,n,a,r=0,l=0,h=null){const w=o[0]-t[0],u=o[1]-t[1],v=o[2]-t[2],g=a[0]-t[0],c=a[1]-t[1],d=a[2]-t[2];let i=u*d-v*c,s=v*g-w*d,p=w*c-u*g;const f=Math.hypot(i,s,p)||1;i/=f,s/=f,p/=f;const x=Math.hypot(w,u,v),b=Math.hypot(g,c,d),m=h||[this.sway,this.sway,this.sway,this.sway],z=this.v(t[0],t[1],t[2],i,s,p,r,l,m[0]),S=this.v(o[0],o[1],o[2],i,s,p,r+x,l,m[1]),E=this.v(n[0],n[1],n[2],i,s,p,r+x,l+b,m[2]),L=this.v(a[0],a[1],a[2],i,s,p,r,l+b,m[3]);return this.I.push(z,S,E,z,E,L),this}tri(t,o,n,a=null){const r=o[0]-t[0],l=o[1]-t[1],h=o[2]-t[2],w=n[0]-t[0],u=n[1]-t[1],v=n[2]-t[2];let g=l*v-h*u,c=h*w-r*v,d=r*u-l*w;const i=Math.hypot(g,c,d)||1;g/=i,c/=i,d/=i;const s=Math.hypot(r,l,h)||1,p=a||[this.sway,this.sway,this.sway],f=(w*r+u*l+v*h)/s,x=Math.sqrt(Math.max(0,w*w+u*u+v*v-f*f)),b=this.v(t[0],t[1],t[2],g,c,d,0,0,p[0]),m=this.v(o[0],o[1],o[2],g,c,d,s,0,p[1]),z=this.v(n[0],n[1],n[2],g,c,d,f,x,p[2]);return this.I.push(b,m,z),this}box(t,o,n,a,r,l,h=""){return h.includes("Z")||this.quad([t,o,l],[a,o,l],[a,r,l],[t,r,l],t,o),h.includes("z")||this.quad([a,o,n],[t,o,n],[t,r,n],[a,r,n],-a,o),h.includes("X")||this.quad([a,o,l],[a,o,n],[a,r,n],[a,r,l],-l,o),h.includes("x")||this.quad([t,o,n],[t,o,l],[t,r,l],[t,r,n],n,o),h.includes("Y")||this.quad([t,r,l],[a,r,l],[a,r,n],[t,r,n],t,-l),h.includes("y")||this.quad([t,o,n],[a,o,n],[a,o,l],[t,o,l],t,n),this}cyl(t,o,n,a,r,l,h=10,w="Y",u=this.sway,v=0,g=Math.PI*2){const c=this.P.length/3,d=(n-a)/Math.max(1e-6,l-r);for(let i=0;i<=h;i++){const s=v+(g-v)*i/h,p=Math.cos(s),f=Math.sin(s),x=Math.hypot(1,d);this.v(t+p*n,r,o+f*n,p/x,d/x,f/x,s*(n+a)*.5,r,this.sway),this.v(t+p*a,l,o+f*a,p/x,d/x,f/x,s*(n+a)*.5,l,u)}for(let i=0;i<h;i++){const s=c+i*2;this.I.push(s,s+1,s+3,s,s+3,s+2)}for(const i of w){const s=i==="Y",p=s?l:r,f=s?a:n,x=this.v(t,p,o,0,s?1:-1,0,0,0,s?u:this.sway),b=this.P.length/3;for(let m=0;m<=h;m++){const z=v+(g-v)*m/h;this.v(t+Math.cos(z)*f,p,o+Math.sin(z)*f,0,s?1:-1,0,Math.cos(z)*f,Math.sin(z)*f,s?u:this.sway)}for(let m=0;m<h;m++)s?this.I.push(x,b+m+1,b+m):this.I.push(x,b+m,b+m+1)}return this}tube(t,o,n=6,a=null){const r=this.P.length/3,l=t.length,h=typeof o=="function"?o:()=>o;let w=0;const u=new y.Vector3,v=new y.Vector3,g=new y.Vector3,c=new y.Vector3;for(let d=0;d<l;d++){const i=t[d],s=t[Math.max(0,d-1)],p=t[Math.min(l-1,d+1)];u.set(p[0]-s[0],p[1]-s[1],p[2]-s[2]).normalize(),c.set(0,1,0),Math.abs(u.y)>.92&&c.set(1,0,0),v.crossVectors(u,c).normalize(),g.crossVectors(v,u).normalize(),d&&(w+=Math.hypot(i[0]-t[d-1][0],i[1]-t[d-1][1],i[2]-t[d-1][2]));const f=h(d/(l-1)),x=a?a(d/(l-1)):this.sway;for(let b=0;b<=n;b++){const m=b/n*Math.PI*2,z=Math.cos(m),S=Math.sin(m),E=v.x*z+g.x*S,L=v.y*z+g.y*S,I=v.z*z+g.z*S;this.v(i[0]+E*f,i[1]+L*f,i[2]+I*f,E,L,I,m*f,w,x)}}for(let d=0;d<l-1;d++)for(let i=0;i<n;i++){const s=r+d*(n+1)+i;this.I.push(s,s+n+1,s+n+2,s,s+n+2,s+1)}return this}blob(t,o,n,a,r,l,h=10,w=7,u=null,v=0,g=this.sway){const c=this.P.length/3;for(let d=0;d<=w;d++){const i=-Math.PI/2+Math.PI*d/w,s=Math.cos(i),p=Math.sin(i);for(let f=0;f<=h;f++){const x=f/h*Math.PI*2,b=s*Math.cos(x),m=s*Math.sin(x),z=p,S=1+(u?v*u(t+b*a,o+z*r,n+m*l):0),E=Math.hypot(b/a,z/r,m/l)||1;this.v(t+b*a*S,o+z*r*S,n+m*l*S,b/a/E,z/r/E,m/l/E,x*(a+l)*.5,(z+1)*r,this.sway+(g-this.sway)*(z*.5+.5))}}for(let d=0;d<w;d++)for(let i=0;i<h;i++){const s=c+d*(h+1)+i;this.I.push(s,s+h+1,s+h+2,s,s+h+2,s+1)}return this}geo(){const t=new y.BufferGeometry;t.setAttribute("position",new y.BufferAttribute(new Float32Array(this.P),3)),t.setAttribute("normal",new y.BufferAttribute(new Float32Array(this.N),3)),t.setAttribute("aC",new y.BufferAttribute(new Float32Array(this.C),3)),t.setAttribute("aUV",new y.BufferAttribute(new Float32Array(this.UV),2)),t.setAttribute("aK",new y.BufferAttribute(new Float32Array(this.K),3));const o=this.P.length/3;return t.setIndex(new y.BufferAttribute(o>65535?new Uint32Array(this.I):new Uint16Array(this.I),1)),t.computeBoundingSphere(),t.computeBoundingBox(),t}mesh(t,o){const n=new y.Mesh(this.geo(),t);return n.name=o||"",n}}n0.prototype.face=function(e,t,o){const n=e.map(a=>{const r=o(a);return this.v(a[0],a[1],a[2],t[0],t[1],t[2],r[0],r[1])});for(let a=1;a<e.length-1;a++)this.I.push(n[0],n[a],n[a+1]);return this};function se(e,t={}){const o=new n0,n=t.wide?.3:.16,a=t.wide?-.05:-.2;o.c(e,0);const r=(v,g,c,d)=>(o.ex=d,o.v(v,g,c,0,1,0,v,c)),l=r(0,0,.26,0),h=r(-.05,0,.02,0),w=r(.05,0,.02,0),u=r(0,0,-.26,0);if(o.I.push(l,w,h,h,w,u),t.fork){const v=r(-.09,0,-.42,0),g=r(.09,0,-.42,0),c=r(0,0,-.2,0);o.I.push(c,v,u,c,u,g)}for(const v of[-1,1]){const g=r(v*.04,0,n*.5,0),c=r(v*.04,0,-n*.5,0),d=r(v*.5,0,a,1),i=r(v*.26,0,n*.45+a*.3,.5);o.I.push(g,i,c,i,d,c)}return o.geo()}const q={hw:4.7,w:4.25,front:3.4,back:-5.1,plinth:.5,post:.8,proud:.12,head:12.8,top:14.3,peak:17.45,r:3.2,foot:-.5,mid:3.15,inside:2.7},y0={cz:(q.front+q.back)/2,cornice:[q.w+.07,q.top+.2],tier1:[4,q.top+.65],tier2:[3.6,q.top+1.05],pyr:[3.45,.5,q.top+1.85],lamp:[.45,q.top+2.1,q.top+2.75]};function W0(){const e=q.hw-q.w;return{x0:-q.hw,x1:q.hw,z0:q.back-e,z1:q.front+e}}function ne(e,t){const o=y0,n=W0(),a=Math.max(Math.abs(e),Math.abs(t-o.cz));return e<n.x0||e>n.x1||t<n.z0||t>n.z1?-100:a>q.w+.3?q.plinth:a>o.tier1[0]?o.cornice[1]:a>o.tier2[0]?o.tier1[1]:a>o.pyr[0]?o.tier2[1]:a>o.pyr[1]?o.tier2[1]+(o.pyr[2]-o.tier2[1])*(o.pyr[0]-a)/(o.pyr[0]-o.pyr[1]):a>o.lamp[0]?o.pyr[2]:q.peak-.15}const C=[.004,.085,.3],H0=[.01,.01,.013],j0=[.49,.68,1.14],X0=[1.16,1.44,2.32],Y0=[.4,.43,.46],J0=[.62,.93,1.8],U=(e,t)=>[e[0]*t,e[1]*t,e[2]*t];function Q(e,t,o,n,a,r={}){const w=a==="l"?.3:.25,u=a==="l"?.25:.3,v=.45,g=.32,c=.35,d=(n-v-c-3*g)/4,i=.1,s=w,p=o-u,f=x=>[x[0],x[1]];e.push(t),e.c(C,M.BOX),e.face([[0,0,0],[o,0,0],[o,v,0],[0,v,0]],[0,0,1],f);for(let x=0;x<4;x++){const b=v+x*(d+g),m=b+d,z=x<3?m+g:n;e.c(C,M.BOX),e.face([[0,b,0],[s,b,0],[s,m,0],[0,m,0]],[0,0,1],f),e.face([[p,b,0],[o,b,0],[o,m,0],[p,m,0]],[0,0,1],f),e.face([[0,m,0],[o,m,0],[o,z,0],[0,z,0]],[0,0,1],f);const S=s+i,E=p-i,L=b+i,I=m-i;if(e.c(U(C,.55),M.BOX),e.quad([s,b,0],[p,b,0],[E,L,-i],[S,L,-i]),e.quad([p,b,0],[p,m,0],[E,I,-i],[E,L,-i]),e.quad([p,m,0],[s,m,0],[S,I,-i],[E,I,-i]),e.quad([s,m,0],[s,b,0],[S,L,-i],[S,I,-i]),x<3){if(e.c(U(C,.78),M.BOX),e.face([[S,L,-i],[E,L,-i],[E,I,-i],[S,I,-i]],[0,0,1],f),x===2&&r.plaque){const P=(S+E)/2,A=(L+I)/2;e.c(Y0,M.GLOW,1),e.face([[P-.75,A-.5,-i+.012],[P+.75,A-.5,-i+.012],[P+.75,A+.5,-i+.012],[P-.75,A+.5,-i+.012]],[0,0,1],f)}}else{e.c(j0,M.GLOW,1),e.face([[S,L,-i],[E,L,-i],[E,I,-i],[S,I,-i]],[0,0,1],f);const P=.05,A=-i+.02;e.c(U(C,1.15),M.BOX);for(const _ of[1/3,2/3]){const T=S+(E-S)*_;e.face([[T-P,L,A],[T+P,L,A],[T+P,I,A],[T-P,I,A]],[0,0,1],f)}const R=(L+I)/2;e.face([[S,R-P,A],[E,R-P,A],[E,R+P,A],[S,R+P,A]],[0,0,1],f)}}if(r.handle){const x=a==="l"?o-.125:.125,b=n*.44;e.c([.02,.02,.024],M.PLAIN),e.box(x-.045,b-.22,0,x+.045,b+.22,.08,"z")}e.pop()}function Q0(e,t={}){const o=q,n=o.w,a=o.hw,r=o.front,l=o.back,h=o.post,w=o.proud,u=o.plinth,v=o.head,g=o.top,c=o.r-.001,d=-.75,i=y0,s=i.cz,p=a-n,f=n-h,x=t.inside?-o.inside:0,b=T=>[T[0],T[1]],m=(T,N,B)=>new y.Vector3(T,N,B),z=(T,N,B,Z,V)=>new y.Matrix4().makeBasis(T,m(0,1,0),N).setPosition(B,Z,V);e.c(U(C,.6),M.BOX),e.box(-a,d,l-p,-c,u,r+p,"y"),e.box(c,d,l-p,a,u,r+p,"y"),e.box(-c,d,l-p,c,u,l+h,"yxX"),e.c(U(C,1.08),M.BOX);for(const T of[-1,1])for(const N of[r-h,l])e.box(T>0?f:-n,u,N,T>0?n:-f,g,N+h,"yY");const S=v-u;[[m(0,0,-1),m(1,0,0),[n-w,u,s]],[m(-1,0,0),m(0,0,-1),[0,u,l+w]],[m(0,0,1),m(-1,0,0),[-(n-w),u,s]],[m(1,0,0),m(0,0,1),[0,u,r-w]]].forEach(([T,N,B],Z)=>{const V=z(T,N,B[0],B[1],B[2]),e0=Z===3;if(e0||(Q(e,z(T,N,B[0]-T.x*f,B[1],B[2]-T.z*f),f,S,"l"),Q(e,V,f,S,"r")),e.push(V),e.c(C,M.BOX),e0)for(const b0 of[-1,1])e.face(b0>0?[[c,0,0],[f,0,0],[f,S,0],[c,S,0]]:[[-f,0,0],[-c,0,0],[-c,S,0],[-f,S,0]],[0,0,1],b);const r0=e0?S-.001:S,t0=g-u;e.face([[-f,r0,0],[f,r0,0],[f,t0,0],[-f,t0,0]],[0,0,1],b);const o0=S+.2,a0=t0-.2,G=f-.15,K=.3;e.c(H0,M.PLAIN),e.box(-G,o0,0,G,a0,K,"z"),e.c(X0,M.GLOW,1),e.face([[-G+.3,o0+.27,K+.006],[G-.3,o0+.27,K+.006],[G-.3,a0-.27,K+.006],[-G+.3,a0-.27,K+.006]],[0,0,1],b),e.pop()});const L=o.r,I=r-w;Q(e,z(m(0,0,-1),m(1,0,0),-c,u,L),L,S-.001,"l",{plaque:!0}),Q(e,z(m(0,0,1),m(-1,0,0),c,u,0),L,S-.001,"r",{handle:!0}),e.c(C,M.BOX);for(const T of[-1,1]){const N=T*c;e.quad(T>0?[N,u,L]:[N,u,I],T>0?[N,u,I]:[N,u,L],T>0?[N,v-.001,I]:[N,v-.001,L],T>0?[N,v-.001,L]:[N,v-.001,I],0,u)}if(e.c(U(C,.8),M.BOX),e.quad([-c,v-.001,0],[c,v-.001,0],[c,v-.001,I],[-c,v-.001,I]),t.inside){const N=v-.001;e.c([.0035,.0045,.008],M.PLAIN),e.quad([-c,d,x],[c,d,x],[c,N,x],[-c,N,x]),e.quad([-c,.02,0],[c,.02,0],[c,.02,x],[-c,.02,x]),e.quad([-c,N,x],[c,N,x],[c,N,0],[-c,N,0]),e.quad([-c,d,0],[-c,d,x],[-c,N,x],[-c,N,0]),e.quad([c,d,x],[c,d,0],[c,N,0],[c,N,x])}e.c(U(C,.95),M.BOX),e.box(-i.cornice[0],g,l-.07,i.cornice[0],i.cornice[1],r+.07),e.box(-i.tier1[0],i.cornice[1],s-i.tier1[0],i.tier1[0],i.tier1[1],s+i.tier1[0],"y"),e.box(-i.tier2[0],i.tier1[1],s-i.tier2[0],i.tier2[0],i.tier2[1],s+i.tier2[0],"y");const P=i.pyr[0],A=i.pyr[1],R=i.tier2[1],_=i.pyr[2];e.c(U(C,.9),M.BOX),e.quad([-P,R,s+P],[P,R,s+P],[A,_,s+A],[-A,_,s+A]),e.quad([P,R,s-P],[-P,R,s-P],[-A,_,s-A],[A,_,s-A]),e.quad([P,R,s+P],[P,R,s-P],[A,_,s-A],[A,_,s+A]),e.quad([-P,R,s-P],[-P,R,s+P],[-A,_,s+A],[-A,_,s-A]),e.quad([-A,_,s+A],[A,_,s+A],[A,_,s-A],[-A,_,s-A]),e.cyl(0,s,i.lamp[0],.42,_,i.lamp[1],12,"Y"),e.c(J0,M.BOXLAMP,t.phase||0),e.cyl(0,s,.33,.33,i.lamp[1],i.lamp[2],12,""),e.c(U(C,.95),M.BOX);for(let T=0;T<4;T++){const N=T*Math.PI/2+.785;e.tube([[.365*Math.cos(N),i.lamp[1],s+.365*Math.sin(N)],[.365*Math.cos(N),i.lamp[2],s+.365*Math.sin(N)]],.028,4)}return e.cyl(0,s,.43,.27,i.lamp[2],i.lamp[2]+.22,12,"Yy"),e.cyl(0,s,.1,.06,i.lamp[2]+.22,o.peak,6,"Y"),e}const Z0=[.34,.22,.13],ee=(()=>{const e=q.hw+.25;return{x0:e,x1:e+1.8,z0:-9,z1:12}})(),i0={out:.15,r:.12};function te(e,t,o=!0){const{x0:n,x1:a,z0:r,z1:l}=ee,h=.55;e.c([.11,.085,.066],M.BOARDS),e.face([[n,h,l],[a,h,l],[a,h,r],[n,h,r]],[0,1,0],c=>[c[2],c[0]]),e.c(Z0,M.BOARDS),e.box(n,h-.22,r,n+.12,h-.001,l,"Y"),e.box(a-.12,h-.22,r,a,h-.001,l,"Y"),e.quad([n,h-.07,l],[a,h-.07,l],[a,h,l],[n,h,l]),e.c([.075,.058,.046],M.BARK);for(let c=l-.3,d=0;c>r;c-=3.05,d++)for(const i of[n+.02,a-.02])e.cyl(i,c,.12,.105,-1.9,i>n+1&&d%2===0?1.45:.62,7,"Y");for(let c=0;c<3;c++){const d=1.6+3.4*c+.5*t(),i=h-.06-.08*t(),s=.42;e.c([.3,.23,.15],M.BARK),e.tube([[a-.25,h+.02,d],[a+.02,h+.05,d],[a+.13,i+.05,d]],.018,4),e.c([.4,.31,.2],M.NET),e.blob(a+i0.out,i-s/2,d,i0.r,s/2,i0.r,7,5)}e.c([.42,.36,.25],M.PLAIN);const w=[];for(let c=0;c<=44;c++){const d=c*.62,i=.34-.0035*c;w.push([a-.55+Math.cos(d)*i,h+.04+c*.0042,6.3+Math.sin(d)*i])}if(e.tube(w,.035,5),e.c([.2,.22,.24],M.PLAIN),e.cyl(n+.5,-1.2,.13,.17,h,h+.32,9,"y"),!o)return{x0:n,x1:a,z0:r,z1:l,y:h};const[u,v,g]=c0;e.c([.035,.035,.04],M.PLAIN),e.tube([[a-.02,1.42,l-.3],[u,1.5,g-.2],[u,1.48,g]],.022,4),e.tube([[u,1.48,g],[u,v+.2,g]],.012,3),e.cyl(u,g,.11,.035,v+.14,v+.21,6,"Y"),e.cyl(u,g,.1,.1,v-.17,v-.14,6,"Yy");for(let c=0;c<4;c++){const d=c*Math.PI/2+.785;e.tube([[u+.095*Math.cos(d),v-.14,g+.095*Math.sin(d)],[u+.095*Math.cos(d),v+.14,g+.095*Math.sin(d)]],.009,3)}return e.c([1,.62,.26],M.LIT,7),e.blob(u,v,g,.062,.105,.062,6,4),{x0:n,x1:a,z0:r,z1:l,y:h}}function ie(e,t=[.1,.09,.08]){const a=r=>{const l=.68*Math.pow(Math.sin(Math.PI*Math.min(1,.06+.94*Math.pow(r,.85))),.62),h=.46+.16*Math.pow(Math.abs(r-.45)/.55,2.2),w=(r-.5)*4.3;return[[0,.02,w],[l*.55,.06,w],[l*.9,.24,w],[l,h,w]]};for(const r of[-1,1])for(let l=0;l<12;l++){const h=a(l/12),w=a((l+1)/12);for(let u=0;u<3;u++){const v=[r*h[u][0],h[u][1],h[u][2]],g=[r*h[u+1][0],h[u+1][1],h[u+1][2]],c=[r*w[u][0],w[u][1],w[u][2]],d=[r*w[u+1][0],w[u+1][1],w[u+1][2]];e.c(t,M.BOARDS),r>0?e.quad(v,g,d,c):e.quad(v,c,d,g),e.c([.3,.31,.27],M.BOARDS);const i=.03,s=p=>[p[0]*.94,p[1]+i,p[2]];r>0?e.quad(s(v),s(c),s(d),s(g)):e.quad(s(v),s(g),s(d),s(c))}}e.c([.34,.27,.19],M.BOARDS);for(const r of[.3,.56,.9]){const l=a(r),h=l[3][0]*.93,w=l[0][2];e.box(-h,.3,w-.12,h,.335,w+.12)}return e.c([.36,.27,.17],M.BARK),e.tube([[.25,.37,-1.5],[.32,.4,1.3]],.03,5),e.tube([[-.25,.37,-1.5],[-.32,.4,1.3]],.03,5),e}async function re(e,t={}){const o=t.kit||V0(e);t.kit||(o.U.uBare.value=1);const n=e.rng?e.rng.fork("hut"):(()=>.5),a=new n0,r=-(q.front+q.back)/2;a.push(new y.Matrix4().makeTranslation(0,.75,r)),Q0(a,{inside:!0}),te(a,n),a.pop();const l=new y.Group;return l.add(a.mesh(o.solid2[1],"hut")),{object:l,radius:9,height:18.6,center:new y.Vector3(0,9,0),anchors:{door:new y.Vector3(0,.75+q.mid,r)},update(h,w){o.U.uTime.value=w},ground:!0,groundY:0}}export{n0 as Bld,D as CLOUDS,E0 as CLOUD_WIND,q0 as CLOUD_WOB,i0 as FENDER,h0 as FLOOR_Y,q as HUT,S0 as HUTS,l0 as HW,ee as JETTY_PLAN,M as KIND,c0 as LAMP,f0 as LAW_GLSL,g0 as LIGHT_GLSL,u0 as NOISE_GLSL,H as PLANES,x0 as RING_C,m0 as RING_D,w0 as RING_DIR,p0 as RING_V,F as SUN,ie as buildBoat,re as buildHero,Q0 as buildHut,te as buildJetty,d0 as crossIn,$ as dirOf,N0 as eyePlace,I0 as feed,A0 as hutPoint,W0 as hutRoofPlan,ne as hutTopAt,P0 as inOutline,k0 as lampAt,z0 as lin,V0 as makeKit,oe as seenPlace,se as wingedGeo};
