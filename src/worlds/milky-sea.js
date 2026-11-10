import*as e from"three";import{makePath as v0,clamp as Me,lerp as I,smoothstep as ne}from"../kit/core.js";import{makeSky as w0}from"../kit/sky.js";import*as Ce from"../kit/fauna.js";import*as pt from"../kit/fx.js";import{buildHero as g0}from"../parts/milky-sea.js";const H=50,Nt=[{key:"edge",title:"The Edge of the Milky Sea",pal:["#A4ECEE","#4DBCC8","#0D3E4C","#06061C","#2E2C4E","#020506","#FF3B2A"],pattern:0,edge:1,haze:0,cast:"dolphin",birds:"tropic",horizon:"#081920",portal:"#CFF4F7",dusk:"#4A4152"},{key:"snow",title:"The Milky Sea: Snowfield",pal:["#D8F0E6","#93C9B6","#1D4B49","#08071C","#35314C","#020506","#FF3B2A"],pattern:1,edge:0,haze:1,cast:"manta",birds:"tern",horizon:"#1F4541",portal:"#E6F6F0",dusk:"#504453"},{key:"jade",title:"The Milky Sea",pal:["#B8F2D6","#5FCBA4","#124A45","#07061A","#302B4A","#020506","#FF3B2A"],pattern:0,edge:0,haze:0,cast:"shark",birds:"booby",horizon:"#10282A",portal:"#CFF7E6",dusk:"#4E4152"}],st=`
float qH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float qN(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(qH(i), qH(i + vec2(1.,0.)), f.x), mix(qH(i + vec2(0.,1.)), qH(i + vec2(1.,1.)), f.x), f.y);
}
float qF2(vec2 p){ return 0.62*qN(p) + 0.38*qN(p*2.07 + 9.1); }
float qF3(vec2 p){ return 0.55*qN(p) + 0.28*qN(p*2.03 + 17.3) + 0.17*qN(p*4.1 + 31.7); }
`,y0=t=>`
${t}
uniform float uRadius;
varying vec3 vW;
void main(){
  vec3 wp = vec3(position.x + cameraPosition.x, 0.0, position.z + cameraPosition.z);
  float r = length(position.xz);
  wp.y = msSwell(wp.xz)*(1.0 - smoothstep(600.0, 1500.0, r));
  wp.y = mix(wp.y, cameraPosition.y, step(uRadius*0.97, r)*step(0.0, cameraPosition.y));      // above water the last ring rises to eye level: no gap under the horizon (under water it would be an edge-on bright sliver)
  vW = wp;
  gl_Position = projectionMatrix*viewMatrix*vec4(wp, 1.0);
}`,b0=t=>`
${t}
${st}
uniform float uTime, uPattern, uRadius, uStroke, uUnder;      // uUnder: 1 while the camera is below the surface (set in update)
uniform vec3 uBright, uLane, uFar, uPortalCol;
uniform vec4 uUFog;      // rgb underwater haze, a density
uniform vec4 uEdge;      // xy centre, z radius, w on
uniform vec4 uBoat;      // x, z, on, -
uniform vec4 uSwim;      // x, z, heading, strength
uniform vec4 uSwimK;     // kind (0 shark, 1 mantas), -, -, -
uniform vec4 uPortal;    // x, y, z, radius
uniform vec4 uWheel;     // hub x, hub z, amount, phase
uniform vec2 uWind, uOff;
uniform vec4 uDh[6];                     // the six vessels: x, z, cos(heading)/k, sin(heading)/k (k: the size of her slick and rings, 1 for a full-size dhow)
uniform vec3 uBlue, uWarm, uTrough;      // the second colours: disturbed water (blue-white), lantern light (amber); uTrough: the jade-blue that pools in the troughs (wind-row mood)
uniform vec4 uLamp[8];                   // lanterns whose light lies on the water: xyz, strength
uniform vec4 uSpl[6];                    // where the three whales leave and re-enter the sea: x, z, age (s), size
varying vec3 vW;

// 1 = bright milky water, 0 = dark eddy lane
float seaMask(vec2 p, float fp){
  p += uOff;
  vec2 dr = vec2(uTime*0.0035, -uTime*0.0026);
  vec2 w = vec2(qF2(p/640.0 + dr), qF2(p/640.0 + 5.2 - dr));
  float f = qF3(p/430.0 + 1.9*(w - 0.45) + vec2(0.0, 3.1));
  float g = qF2(p/52.0 - 1.4*w + uTime*0.005);
  float gf = 1.0 - smoothstep(6.0, 40.0, fp);                 // the 52 m break-up fades with the pixel footprint
  float v = f + 0.085*(g - 0.5)*gf;
  float wid = 0.014 + 0.042*qN(p/520.0 + 7.7), we = 0.004*fp + 0.011*uUnder;   // band edges soften both ways with the footprint (keeps the mean); from below a lane is a gap in a glowing layer 5 m thick, so its edge is wide and soft
  float b1 = smoothstep(wid*0.55 - we, wid*1.1 + we, abs(v - 0.455));
  float b2 = smoothstep(wid*0.25 - we, wid*0.6 + we, abs(v - 0.60));
  float braid = min(b1, b2);
  // WIND-ROWS (pattern 1): slicks that wander, fork and die out. The row coordinate is read in a domain warped at
  // three scales, so no row runs straight for more than a ship's length; where fk opens a row splits into two
  // about its own centre (a fork), every row fades in and out along its length, and whole reaches of sea carry none
  vec2 wd = uWind, wn = vec2(-wd.y, wd.x);
  vec2 pw = p + 44.0*(vec2(qF2(p/240.0 + 3.1), qF2(p/240.0 + 8.6)) - 0.5) + 26.0*(vec2(qN(p/117.0 + 4.4), qN(p/117.0 + 2.9)) - 0.5) + 16.0*(vec2(qN(p/63.0 + 1.7), qN(p/63.0 + 6.3)) - 0.5);
  float s = dot(pw, wn)/22.0 + 0.5*(qN(p/29.0) - 0.5), rid = floor(s), rx = fract(s) - 0.5, al = dot(pw, wd);
  float fk = 0.25*smoothstep(0.42, 0.7, qN(vec2(al/90.0 + rid*1.9, rid*5.1)));
  float rr = abs(abs(rx) - fk)*2.0;
  float brk = smoothstep(0.2, 0.52, qN(vec2(al/70.0 + rid*3.7, rid*7.3)))*smoothstep(0.2, 0.44, qF2(p/330.0 + 12.0));
  float soft = 1.0 - smoothstep(2.5, 11.0, fp);
  float rw = 0.12 + 0.28*qN(p/83.0 + 4.0);                                              // uneven width
  float rows = 1.0 - (0.6*(1.0 - smoothstep(0.02, rw, rr))*brk*soft + 0.06*(1.0 - soft));
  float m = mix(braid, min(rows, mix(1.0, b2, 0.9)), uPattern);
  m *= 1.0 - 0.14*gf*(1.0 - smoothstep(0.3, 0.7, g));
  // fine marbling inside the bright water: thin dark filaments that curl in patches (melt with the footprint)
  vec2 w2 = vec2(qN(p/57.0 + 3.7), qN(p/57.0 + 9.2)) - 0.5;
  float hf = qF2(p/88.0 + 1.6*w2 + 0.8*w + dr*3.0);
  float fil = max(1.0 - smoothstep(0.010, 0.032, abs(hf - 0.5)), 0.7*(1.0 - smoothstep(0.008, 0.024, abs(hf - 0.62))));
  m *= 1.0 - 0.5*fil*(1.0 - smoothstep(1.5, 9.0, fp))*smoothstep(0.3, 0.62, qN(p/150.0 + 2.0))*(1.0 - 0.6*uPattern);
  // far away the lanes average out: radiance settles to the mean
  m = mix(m, 0.7, smoothstep(22.0, 160.0, fp));
  return m;
}
// x: 1 inside the dark lane the portal stands in: a small pool under and to port of the jib-boom (it backs the
// headsails seen from the swoop, which comes down their starboard side), a thread of two strands weaving round bright eyes along the final run, swelling by the ring
// into a river 60 m wide that runs on past it toward the horizon, braiding round islands, with a tributary
// coming in from starboard. y: 1 where the water is kept bright (both banks, round the longboat and her trail)
vec2 portalLane(vec2 p){
  if (p.y > 4.0 || p.y < -1000.0 || abs(p.x) > 420.0) return vec2(0.0);
  vec2 ws = vec2(qN(p/23.0) - 0.5, qN(p/23.0 + 4.7) - 0.5)*13.0;
  vec2 wl = vec2(qF2(p/105.0 + 3.3) - 0.5, qF2(p/105.0 + 8.1) - 0.5)*56.0;
  vec2 a = p + ws; float z = a.y;
  float wide = smoothstep(-84.0, -132.0, z), bey = smoothstep(-190.0, -290.0, z);
  float cx = 2.0 + 5.0*sin(z/27.0 + 0.6)*(1.0 - bey) + bey*(30.0*sin((z + 205.0)/135.0) + 0.45*wl.x);
  float d = a.x - cx + 0.3*wl.x*wide*(1.0 - bey);
  float wv = 4.6*sin(z/9.5 + 1.0 + 3.0*qN(vec2(z/29.0, 2.7)))*(1.0 - wide), wv2 = 4.0*sin(z/12.7 + 2.2 + 3.0*qN(vec2(z/23.0, 8.1)))*(1.0 - wide);
  float hw = mix(2.6 + 1.2*sin(z/13.0), 29.0 + 7.0*sin(z/47.0 + 1.0), wide), sf = 1.4 + 6.0*wide + 9.0*bey;
  float river = max(1.0 - smoothstep(hw, hw + sf, abs(d - wv)), 1.0 - smoothstep(hw*0.7, hw*0.7 + sf, abs(d + wv2)));
  river *= smoothstep(-50.0, -58.0, z)*(1.0 - smoothstep(-560.0, -900.0, z));
  float zc = (z + 215.0)/118.0, zz = fract(zc) - 0.5, ox = (qH(vec2(floor(zc), 3.0)) - 0.5)*24.0;
  vec2 ei = vec2((d - ox)/(0.42*hw), zz/0.36);
  river *= 1.0 - 0.92*(1.0 - smoothstep(0.55, 1.0, dot(ei, ei)))*smoothstep(-200.0, -230.0, z);       // islands: the river braids
  vec2 pq = (a - vec2(-3.5, -45.0))/vec2(10.0, 14.5);
  float pool = 1.0 - smoothstep(0.55, 1.1, dot(pq, pq));
  float tx = a.x - 14.0, tz = z + 124.0 - 0.0011*tx*tx, tw = 5.0*sin(tx/15.0);
  float trib = max(1.0 - smoothstep(3.5, 7.5, abs(tz - tw)), 1.0 - smoothstep(2.5, 6.0, abs(tz + tw + 2.0)))*smoothstep(0.0, 16.0, tx)*(1.0 - smoothstep(170.0, 330.0, tx));
  float lane = max(max(river, pool), 0.9*trib)*(0.84 + 0.16*qN(p/31.0 + 2.2));
  float bank = (1.0 - smoothstep(hw + 16.0, hw + 44.0, abs(d)))*smoothstep(-50.0, -72.0, z)*smoothstep(-330.0, -230.0, z);
  vec2 bq = (a - vec2(-17.0, -68.0))/vec2(15.0, 48.0); bq *= bq;
  float boat = exp(-bq.x - bq.y*bq.y);
  return vec2(lane, max(bank, boat)*(1.0 - lane));
}
// the dark slick a becalmed dhow lies in (1 inside)
float dhowSlick(vec2 p, vec4 dh){
  vec2 q = p - dh.xy; q = vec2(dh.z*q.x - dh.w*q.y, dh.w*q.x + dh.z*q.y)/vec2(5.2, 17.0);
  return 1.0 - smoothstep(0.5, 1.25, dot(q, q));
}
// forced dark braided lanes (1 inside): two cross the entry corridor between the entry point and the hull,
// each two strands that weave round bright eyes. They keep clear of everything forward of the surface
// break (z < 30), which must stay bright for the break frame and the flying fish's scratches.
float strand(float d, float hw, float fp){ return 1.0 - smoothstep(hw - 1.6*uUnder, hw + 2.2 + fp + 5.5*uUnder, abs(d)); }      // (from below: soft over 9 m)
float entryLane(vec2 p, float fp){
  if (abs(p.x + 45.0) > 150.0 || abs(p.y - 50.0) > 110.0) return 0.0;
  vec2 a = p + (vec2(qN(p/17.0 + 2.3), qN(p/17.0 + 7.9)) - 0.5)*6.0 + (vec2(qF2(p/61.0 + 1.7), qF2(p/61.0 + 6.1)) - 0.5)*9.0;
  float wv = 5.0*sin(a.x/12.5), wv2 = 5.0*sin(a.x/12.5 + 0.9);
  float x1 = a.x + 56.0, x2 = a.x + 22.0;
  float d1 = (a.y - (92.0 - 0.197*x1 - 0.157*(sqrt(x1*x1 + 900.0) - 30.0)))*0.95;      // bends from E-W to run in toward the stern
  float d2 = (a.y - (61.0 + 0.38*(sqrt(x2*x2 + 484.0) - 22.0) - 0.04*x2))*0.93;         // a shallow V with its point astern of the break
  float l1 = max(strand(d1 - wv, 3.0, fp), strand(d1 + wv2, 2.1, fp))*smoothstep(-185.0, -130.0, a.x)*(1.0 - smoothstep(35.0, 80.0, a.x));
  float l2 = max(strand(d2 + wv, 3.1, fp), strand(d2 - wv2, 2.2, fp))*smoothstep(-150.0, -105.0, a.x)*(1.0 - smoothstep(25.0, 60.0, a.x));
  return max(l1, l2)*(1.0 - smoothstep(4.0, 14.0, fp));
}
// distance from a dhow for the rings that run out from her (slightly long ellipses that round off with distance)
float dhowRing(vec2 p, vec4 dh){
  vec2 q = p - dh.xy; q = vec2(dh.z*q.x - dh.w*q.y, dh.w*q.x + dh.z*q.y);
  return length(vec2(q.x*1.35, q.y) ) + 1e-3;
}
// THE EDGE of the milky sea ('edge' mood, uEdge.w): how much of the glow is left, 1 inside .. 0 black water. There is
// no line anywhere: the front wanders by a couple of hundred metres, across it the milk thins over some 500 m
// (from 190 m off the port quarter) and opens into holes of darker water, and beyond it the glow lives on in
// drifting patches and streamers for another few hundred metres (main() adds a few wave tops that still catch light out there, and a far field decided by direction)
float seaEdge(vec2 p, float t, float fp, float dist){
  float near = 1.0 - smoothstep(25.0, 110.0, fp), mid = 1.0 - smoothstep(350.0, 900.0, dist);      // (mid: the wander and the patches live within some 600 m of the lens; further off one pixel row is deeper than they are, and they drew slivers one pixel tall on the black water beyond the front)
  float ew = 170.0*(qF2(p/460.0 + vec2(t*0.003, 0.0)) - 0.5)*(1.0 - smoothstep(30.0, 120.0, fp))*mid + 60.0*(qF2(p/140.0 - vec2(0.0, t*0.005)) - 0.5)*near*mid;
  float ed = length(p - uEdge.xy) - uEdge.z + ew;
  float fall = 1.0 - smoothstep(-110.0, 380.0, ed);
  float pn = qF2(p/110.0 + vec2(-t*0.006, t*0.004) + 31.0);
  float pat = smoothstep(0.5, 0.72, pn)*(1.0 - smoothstep(60.0, 760.0, ed))*near*mid;
  float mot = mix(1.0, 0.45 + 0.9*smoothstep(0.3, 0.62, pn), smoothstep(-80.0, 200.0, ed)*near);
  return clamp(max(fall*mot, 0.8*pat), 0.0, 1.0);
}
// wind ripples. Each octave is read on its own turned grid (31 and 74 degrees off the keel line): value noise keeps a
// trace of its lattice, and on an unturned grid that trace is a set of lines parallel to the ship, which from the
// masthead beat against the pixels into ruler-straight bands fanning to the horizon
// RELIEF near the lens: a low short sea, three trains 6 to 10 m long with bent crests (0..1). main() reads its slope
// along the line of sight
float seaRel(vec2 p, float t){
  float a = sin(dot(p, vec2(0.52, 0.31)) - t*1.25 + 2.0*qN(p/19.0)), b = sin(dot(p, vec2(-0.21, 0.78)) - t*1.5 + 2.0*qN(p/13.0 + 4.0)), c = sin(dot(p, vec2(0.95, -0.55)) - t*1.9 + 1.7);
  return 0.5 + 0.22*a + 0.17*b + 0.11*c;
}
float rip(vec2 p, float n1, float n2, float t){
  vec2 pa = vec2(0.857*p.x - 0.515*p.y, 0.515*p.x + 0.857*p.y), pb = vec2(0.276*p.x - 0.961*p.y, 0.961*p.x + 0.276*p.y);
  return n1*qN(pa*0.85 + vec2(t*0.5, t*0.12)) + 0.55*n2*qN(pb*2.9 - vec2(t*0.3, t*0.8));
}
void main(){
  vec2 p = vW.xz; float t = uTime;
  float fp = max(length(dFdx(p)), length(dFdy(p)));
  vec3 Vv = vW - cameraPosition; float dist = length(Vv); vec3 Vd = Vv/max(dist, 1e-3);
  float m = seaMask(p, fp);
  vec2 pl = portalLane(p);
  // the underwater corridor stays luminous (only the two entry lanes cross it) and so does the sea at the break
  vec2 cq = p - vec2(-88.0, 154.0), cdir = vec2(0.4845, -0.8748);
  float corr = 1.0 - smoothstep(30.0, 68.0, length(cq - cdir*clamp(dot(cq, cdir), 0.0, 165.0)) + 16.0*(qN(p/43.0 + 5.5) - 0.5));
  m = max(m, 0.8*corr);
  m = min(m, 1.0 - mix(0.93, 0.8, uUnder)*entryLane(p, fp));
  m = max(m, 0.85*(1.0 - smoothstep(14.0, 28.0, length(p - vec2(-21.0, 36.0)))));
  m = max(m, 0.9*pl.y);
  m = min(m, 1.0 - 0.96*pl.x);
  float fl = min(length(dFdx(p)), length(dFdy(p)));              // the footprint across the line of sight
  float n1 = (1.0 - smoothstep(0.5, 2.4, fp))*(1.0 - smoothstep(0.2, 0.42, fl)), n2 = 1.0 - smoothstep(0.12, 0.7, fp);      // the ripples melt before their grid can beat against the pixels
  vec2 e2 = Vv.xz/max(length(Vv.xz), 1e-3);
  float cat = smoothstep(0.5, 0.68, qF2(p/78.0 + vec2(t*0.019, t*0.006) + 9.0));
  float h0 = rip(p, n1, n2, t), h1 = rip(p + e2*0.4, n1, n2, t);
  float slope = (h1 - h0)/0.4;
  vec3 col;
  if (uUnder < 0.5) {            // by which side the camera is on, never per fragment (under MSAA a sample past the horizon ring's top edge would take the other branch: a dashed teal hairline)
    // ---------------- from above: the sea is the light
    col = mix(uLane, uBright, m);
    float nf = 1.0 - smoothstep(9.0, 45.0, fp);                 // 70-80 m features melt before they can alias at the horizon
    col *= 1.0 - (0.3 + 0.1*uPattern)*cat*nf;
    col *= 1.0 + (0.26 + 0.4*cat)*clamp(slope*1.25, -1.0, 0.6);
    col *= 1.0 + 0.22*msSwell(p)*nf;
    // WATER, not snow: two crossing trains of swell lines travel through the glow (crests catch it, troughs
    // fall blue), and slow patches of brighter blue-white breathe through the milk
    // (the crests are read in a warped domain, so no line is straight, and each train comes in sets a few crests
    // long that travel with it at the group speed; in the wind-row mood they bend more)
    float bend = 1.0 + 0.6*uPattern;
    vec2 ps = p + bend*(17.0*(vec2(qN(p/97.0 + 2.0), qN(p/97.0 + 7.4)) - 0.5) + 5.0*(vec2(qN(p/33.0 + 5.0), qN(p/33.0 + 1.2)) - 0.5));
    float wq = 2.4*(qN(p/47.0 + 2.0) - 0.5);
    float w1 = 0.5 + 0.5*sin(dot(ps, vec2(0.19, 0.53)) - t*0.95 + wq), w2 = 0.5 + 0.5*sin(dot(ps, vec2(0.262, 0.262)) - t*0.7 - 1.7*wq);
    float g1 = smoothstep(0.28, 0.6, qN(vec2(dot(ps, vec2(0.19, 0.53))/31.0 - t*0.015, dot(ps, vec2(-0.53, 0.19))/40.0) + 3.0));
    float g2 = smoothstep(0.28, 0.6, qN(vec2(dot(ps, vec2(0.262, 0.262))/22.0 - t*0.013, dot(ps, vec2(-0.262, 0.262))/36.0) + 8.0));
    float am = smoothstep(0.35, 0.65, qN(p/83.0 + 6.0));              // the two short trains take turns (crossing at full strength they bead into an egg-crate)
    // the long swell is three trains 25 degrees apart (crests across the keel line), read in a domain that wanders by more than a wavelength: their
    // crests are short, they fork where one train slips past another and they come in sets (one straight train
    // would rule the whole sea into parallel bands fanning to the horizon)
    vec2 p3 = ps + 52.0*(vec2(qF2(p/330.0 + 15.0), qF2(p/330.0 + 19.4)) - 0.5);
    float Lw = 0.5*sin(dot(p3, vec2(0.042, 0.181)) - t*0.52 + 1.3*wq) + 0.38*sin(dot(p3, vec2(0.088, 0.123)) - t*0.47 + 1.7) + 0.32*sin(dot(p3, vec2(-0.052, 0.207)) - t*0.58 + 4.1);
    float w3 = smoothstep(-0.8, 0.8, Lw);
    float l3 = (1.0 - smoothstep(5.0, 20.0, fp))*(0.45 + 0.55*smoothstep(0.25, 0.7, qN(p/140.0 + 3.0)));
    float swl = 0.9*am*g1*(1.0 - smoothstep(1.2, 4.5, fp))*(w1*w1 - 0.375) + 0.8*(1.0 - am)*g2*(1.0 - smoothstep(2.0, 7.5, fp))*(w2*w2 - 0.375) + 0.5*l3*(w3*w3 - 0.375);
    swl *= 1.0 - 0.5*cat;
    col *= 0.9*(1.0 + 0.52*swl);
    // RELIEF: near the lens the milk is water with a surface. The short sea is read as slope along the line of sight:
    // faces tilted toward the eye are lighter, their backs fall darker and bluer, and every crest carries a thin
    // brighter line (it melts with the footprint, so from the masthead the sea is the marbled sheet again)
    float rn = (1.0 - smoothstep(0.22, 1.7, fp))*(1.0 - 0.5*cat);
    vec2 prl = 0.5*(ps + p);
    float hA = seaRel(prl, t), rs = (seaRel(prl + e2*0.9, t) - hA)/0.9;
    col *= 1.0 + rn*(0.36*clamp(rs*1.5, -1.0, 1.0) + 0.15*smoothstep(0.66, 0.95, hA));
    col = mix(col, col*vec3(0.68, 0.94, 1.15), rn*clamp(-rs*1.3, 0.0, 0.55));
    // troughs fall blue; in the wind-row mood darker jade-blue water pools in the troughs of the long swell
    float tpool = uPattern*l3*smoothstep(-0.15, -0.7, Lw)*(0.55 + 0.45*smoothstep(0.3, 0.62, qF2(p/115.0 + vec2(t*0.006, 0.0) + 21.0)));
    col = mix(col, col*vec3(0.62, 0.92, 1.2), clamp(-swl*2.2, 0.0, 0.75));
    col = mix(col, uTrough*(0.8 + 0.3*h0), clamp(0.75*tpool + uPattern*clamp(-swl*1.3, 0.0, 0.3), 0.0, 0.66)*m);
    col *= mix(vec3(1.0), vec3(0.84, 1.0, 1.1), smoothstep(0.3, 0.8, qN(p/270.0 + 11.0))*nf);                 // slow drift of hue: jade here, bluer there
    // slow patches of brighter blue-white breathe through the milk, and broken ribbons of light curl round them
    // (open arcs: a ribbon dies out before it can close into a loop)
    vec2 pq2 = p/41.0 + 0.9*(vec2(qN(p/88.0 + 14.0), qN(p/88.0 + 3.0)) - 0.5);
    float pu = qF2(pq2 + vec2(t*0.03, -t*0.021) + 4.0);
    float ribbon = (1.0 - smoothstep(0.012, 0.05 + 0.004*fp, abs(pu - 0.5)))*smoothstep(0.42, 0.62, qN(p/31.0 + vec2(-t*0.02, t*0.013) + 13.0));
    float pulse = max(0.6*smoothstep(0.56, 0.72, pu), ribbon);
    pulse *= (0.55 + 0.45*sin(t*0.45 + 6.0*qN(p/190.0)))*m*(1.0 - smoothstep(6.0, 30.0, fp));
    col = mix(col, mix(uBlue, vec3(1.0), 0.38)*(0.86 + 0.2*h0), 0.55*pulse);
    float blue = 0.0;
    // phosphorescent wheel (rare): twelve broad curved spokes turning about a hub off the starboard bow
    vec2 hv = p - uWheel.xy; float hr = length(hv), ha = atan(hv.y, hv.x + 1e-4);
    float sp = smoothstep(0.4, 0.74, 0.5 + 0.5*cos(12.0*ha + hr/220.0 - uWheel.w)), wk = uWheel.z*smoothstep(30.0, 160.0, hr);
    sp = mix(sp, 0.4, smoothstep(14.0, 70.0, fp));               // the spokes melt into their mean before they can alias
    col *= 1.0 - 0.42*wk*(1.0 - sp);
    col *= 1.0 + 0.32*wk*sp*(1.0 - pl.x);                         // a spoke is brighter WATER: a gain, so ripples, swell lines, troughs and cat's-paws show through it
    // soft multiply decals: longboat slick, the two dotted rows of oar pools, the swimmer 2 m down
    float dark = 0.0;
    vec2 bq = p - uBoat.xy;
    dark += uBoat.z*0.5*exp(-(bq.x*bq.x)/5.3 - (bq.y*bq.y)/30.0);
    float cz = bq.y/4.3 - uStroke, lz = (fract(cz + 0.5) - 0.5)*4.3;
    float age = clamp(bq.y/60.0, 0.0, 1.0), pr = 0.75*(1.0 + 0.9*age);
    float px = abs(bq.x) - 2.9 - 0.8*age;
    float pool = exp(-(px*px + lz*lz)/(pr*pr))*(1.0 - age)*step(0.5, bq.y);
    dark += uBoat.z*0.72*pool;
    float pr2 = sqrt(px*px + lz*lz) - pr;
    blue += uBoat.z*0.9*exp(-pr2*pr2/0.1)*(1.0 - age)*(1.0 - age)*step(0.5, bq.y)*n1;       // each oar pool is rimmed blue where the blade stirred it
    float ch = cos(uSwim.z), sh = sin(uSwim.z);
    vec2 sq = p - uSwim.xy; sq = vec2(ch*sq.x - sh*sq.y, sh*sq.x + ch*sq.y);       // x across, y along (head at -y)
    float kind = uSwimK.x, body, spots;
    if (kind < 0.5) {
      float lx = sq.x + 0.7*sin(t*1.25 - sq.y*0.55)*smoothstep(0.5, 4.6, sq.y);
      float zz = clamp(sq.y/4.7, -1.0, 1.0);
      float hw2 = 1.2*pow(max(1.0 - zz*zz, 0.0), 0.62)*(1.0 - 0.35*smoothstep(0.0, 1.0, zz));
      float fin = max(0.0, 1.0 - abs(sq.y + 1.1 - 0.45*abs(lx))/0.75)*step(abs(lx), 2.9);
      float tail = max(0.0, 1.0 - abs(sq.y - 4.4)/0.9)*step(abs(lx), 1.5 - 0.6*abs(sq.y - 4.4));
      body = max(max(smoothstep(hw2 + 0.3, hw2 - 0.3, abs(lx))*step(abs(sq.y), 4.7), fin*0.85), tail*0.8);
      vec2 g2 = vec2(lx, sq.y)*1.9; float ds = length(fract(g2) - 0.5);
      spots = (1.0 - smoothstep(0.12, 0.26, ds))*smoothstep(hw2, hw2*0.3, abs(lx));
    } else {
      float fl = 1.0 + 0.1*sin(t*1.9);
      vec2 a = vec2(sq.x - 3.6, sq.y), b = vec2(sq.x + 3.4, sq.y - 5.0);
      float xa = min(abs(a.x)/(2.7*fl), 1.0), xb = min(abs(b.x)/(2.6*fl), 1.0);
      float ma = smoothstep(0.0, 0.3, a.y + 1.05 - 0.95*xa*sqrt(xa))*smoothstep(0.0, 0.3, 1.0 - 1.1*sqrt(xa) - a.y)*step(abs(a.x), 2.7*fl);
      float mb = smoothstep(0.0, 0.3, b.y + 1.0 - 0.9*xb*sqrt(xb))*smoothstep(0.0, 0.3, 0.95 - 1.05*sqrt(xb) - b.y)*step(abs(b.x), 2.6*fl);
      float ta = exp(-a.x*a.x/0.012)*smoothstep(0.6, 1.0, a.y)*(1.0 - smoothstep(2.6, 3.4, a.y));
      float tb2 = exp(-b.x*b.x/0.012)*smoothstep(0.6, 1.0, b.y)*(1.0 - smoothstep(2.4, 3.2, b.y));
      body = max(max(ma, mb), 0.6*max(ta, tb2)); spots = 0.0;
    }
    dark += uSwim.w*body*(0.86 - 0.38*spots);
    float dsl = 0.0, rdh = 1.0e5;
    for (int i = 0; i < 6; i++) { dsl = max(dsl, dhowSlick(p, uDh[i])); if (i < 5) rdh = min(rdh, dhowRing(p, uDh[i])); }      // (the tender, the last, lies in a slick but sends out no rings of her own)
    dark += 0.66*dsl;
    blue += 2.2*dsl*(1.0 - dsl)*(0.55 + 0.45*sin(t*0.62 + p.x*0.37 + 4.0*qN(p*0.21)));           // the slick's rim brightens blue as the hull rolls
    // the barque: every roll sends a blue ripple out from her waterline
    float hf = pow(abs(p.x)/5.3, 2.2) + pow(abs(p.y + 0.3)/29.5, 2.6);
    float hd = (pow(max(hf, 1e-4), 0.42) - 1.0)*5.3;
    blue += 0.38*smoothstep(0.55, 1.0, sin(hd*2.1 - t*1.6 + 2.5*qN(p*0.27)))*smoothstep(1.0, 4.0, hd)*(1.0 - smoothstep(4.0, 11.0, hd))*n1;
    // and soft, widening rings run on out from her and from every dhow (each filtered by its own phase footprint)
    // (a distance from her middle in a slowly bent field, all but circles: seen from astern or from the masthead,
    // any stretch of ring that ran straight along her side would fan out in perspective like ruled rays)
    vec2 pr1 = vec2(p.x, p.y + 0.3) + 10.0*(vec2(qN(p/47.0 + 5.3), qN(p/47.0 + 9.1)) - 0.5);
    float hc = length(vec2(pr1.x, max(abs(pr1.y) - 3.0, 0.0)));
    // (the phase runs on the root of the distance: the rings widen as they travel, 5 m apart by the hull, 13 m
    // apart 100 m out, and reach far enough to be seen from the masthead, curving round the bows)
    float ph1 = 10.0*sqrt(hc + 4.0) - t*1.4 + 1.6*qN(p*0.09 + 3.0);
    float arc1 = 0.5 + 0.5*smoothstep(0.3, 0.62, qN(p/57.0 + vec2(0.0, t*0.02) + 17.0));      // long arcs: cut short they stop reading as rings and turn into streaks
    // she pitches, so the ripples leave her ahead and astern and die out abeam: from astern and from the masthead
    // the steep flanks of rings centred under the lens would read as rays fanning from the hull, their crowns as arcs
    arc1 *= smoothstep(0.3, 0.72, abs(pr1.y)/max(hc, 1.0));
    // (on the white 'snow' sea evenly ruled rings read as contour lines: there each crest has its own weight, some
    // are missing, the arcs are cut shorter and they die out within 75 m)
    float crw = mix(1.0, smoothstep(0.22, 0.6, qH(vec2(floor(ph1/6.2832)*3.7, 1.0)))*(0.45 + 0.75*qN(p/23.0 + 41.0)), uPattern);
    arc1 = mix(arc1, arc1*smoothstep(0.42, 0.6, qN(p/37.0 + vec2(t*0.02, 0.0) + 29.0)), uPattern);
    float ring1 = smoothstep(0.5, 0.97, sin(ph1))*smoothstep(13.0, 19.0, hc)*(1.0 - smoothstep(40.0, mix(112.0, 75.0, uPattern), hc))*arc1*crw*(1.0 - smoothstep(1.2, 2.8, fwidth(ph1)));
    float ph2 = rdh*0.32 - t*0.8 + 1.4*qN(p*0.05 + 6.0);
    float arc2 = 0.3 + 0.7*smoothstep(0.28, 0.58, qN(p/41.0 + vec2(t*0.03, 0.0) + 23.0));
    float crw2 = mix(1.0, smoothstep(0.25, 0.65, qH(vec2(floor(ph2/6.2832 + 0.25)*5.3, 2.0)))*(0.45 + 0.75*qN(p/29.0 + 53.0)), uPattern);       // (snow: the same for the dhows' rings)
    arc2 = mix(arc2, arc2*smoothstep(0.4, 0.6, qN(p/43.0 - vec2(t*0.02, 0.0) + 37.0)), uPattern);
    float ring2 = smoothstep(-0.1, 0.9, sin(ph2))*smoothstep(13.0, 19.0, rdh)*(1.0 - smoothstep(mix(50.0, 36.0, uPattern), mix(135.0, 82.0, uPattern), rdh))*arc2*crw2*(1.0 - smoothstep(1.2, 2.8, fwidth(ph2)));
    // (her rings cross the dark lane ahead of the bows, so each arc is seen whole; the dhows' stay out of it and
    // are softer over the dark lanes, where blue on black would stripe)
    float r1 = (0.6 + 0.2*uPattern)*ring1, r2 = ring2*(1.0 - 0.8*pl.x), rgs = r1 + r2;
    blue += 0.46*(r1*(0.6 + 0.4*m) + r2*(0.4 + 0.6*m));
    // where a whale leaves the sea and where it falls back: churned blue-white water and rings running out
    float spn = qN(p*0.8 + vec2(t*0.5, -t*0.3));
    for (int i = 0; i < 6; i++) {
      float a = uSpl[i].z, sz = uSpl[i].w, r = length(p - uSpl[i].xy);
      float on = step(0.0, a)*(1.0 - smoothstep(10.0, 16.0, a));
      float R = sz*(2.0 + 5.2*sqrt(max(a, 0.0))), wd = 0.7 + 0.3*max(a, 0.0);
      float d1 = (r - R)/wd, d2 = (r - 0.55*R)/wd;
      float core = exp(-r*r/(sz*sz*(5.0 + 6.0*max(a, 0.0))))*(0.5 + 0.6*spn);
      blue += on*((1.3*exp(-d1*d1) + 0.8*exp(-d2*d2))*exp(-max(a, 0.0)*0.17) + 2.1*core*exp(-max(a, 0.0)*0.2));
      dark += on*0.3*exp(-d1*d1*0.16)*exp(-max(a, 0.0)*0.2)*step(r, R);
    }
    col *= 1.0 - clamp(dark, 0.0, 0.9);
    col = mix(col, uBlue*(1.0 + 0.3*spn), clamp(blue, 0.0, 0.92));
    // on the snow-white sea a mix toward light blue burns out to white again: there the rings are deeper blue water
    col = mix(col, uBlue*vec3(0.5, 0.66, 0.85)*(0.85 + 0.3*h0), 0.8*uPattern*clamp(rgs, 0.0, 1.0)*m);
    // lantern light lying on the water: the glitter path of each lamp, long toward the eye, broken into wavering bars
    vec2 e2p = vec2(-e2.y, e2.x); float ea = dot(p, e2), eb = dot(p, e2p), wsum = 0.0;
    float bars = mix(1.0, 0.3 + 1.4*qN(vec2(ea*1.5 - t*1.1, eb*0.22 + t*0.2)), n1);
    float wob = 0.022*sin(ea*0.9 - t*2.0) + 0.013*sin(ea*2.3 + t*2.7);
    for (int i = 0; i < 8; i++) {
      vec3 L = uLamp[i].xyz - vW; float dl = max(length(L), 1e-3); L /= dl;
      vec3 Hh = L - Vd; vec2 tl = Hh.xz/max(Hh.y, 1e-3);                 // the facet slope that would mirror this lamp into the eye
      float ta = dot(tl, e2), tb = dot(tl, e2p) + wob;
      wsum += uLamp[i].w*exp(-ta*ta/0.0128 - tb*tb/0.0036)/(1.0 + dl*0.012);
    }
    col = mix(col, uWarm*(1.05 + 0.3*h0), 0.85*clamp(wsum*bars, 0.0, 1.0));
    // the portal ring mirrored in rippled water
    vec3 Nw = normalize(vec3(-e2.x*slope*0.22 + 0.05*sin(p.y*1.7 + t*1.3), 1.0, -e2.y*slope*0.22 + 0.05*sin(p.x*2.1 - t*1.1)));
    vec3 R = reflect(Vd, Nw); R.y = abs(R.y);
    float rz = min(R.z, -1e-3), tt = (uPortal.z - vW.z)/rz;
    vec3 hp = vW + R*tt;
    float pd = length(hp.xy - uPortal.xy);
    float rg = (pd - uPortal.w)/0.8;
    float ring = exp(-rg*rg) + 0.22*(1.0 - smoothstep(0.0, uPortal.w, pd));
    float om = 1.0 - clamp(dot(-Vd, Nw), 0.0, 1.0), fres = 0.06 + 0.94*om*om*om;
    col += uPortalCol*ring*fres*step(0.0, tt)*step(uPortal.z, vW.z)*(1.0 - smoothstep(60.0, 150.0, tt))*0.6;
    col = mix(col, uFar, smoothstep(0.3, 0.9, dist/uRadius));
    // the edge of the milky sea: beyond the front the ocean is black
    float inside = seaEdge(p, t, min(fp, 200.0), dist);                       // (the footprint is unbounded on the horizon ring: clamp it)
    // far away the glow is decided by direction alone (the same turn of the compass as the sky's glow in makeStarBand),
    // over a third of the horizon, mottled: it sweeps out to the horizon as a wide soft falling-off, never a wedge
    float farIn = smoothstep(-0.30, 0.34, dot(e2, vec2(0.7071, -0.7071)) + 0.16*(qF2(p/1400.0) - 0.5)*(1.0 - smoothstep(3000.0, 9000.0, dist)));      // (the mottling dies out with distance: on the horizon one pixel row spans kilometres, and a noise read there once per row drew a ruled streak)
    inside = mix(inside, farIn, smoothstep(700.0, 2400.0, dist));
    float tops = smoothstep(0.66, 0.97, w3)*l3*(1.0 - inside)*(1.0 - smoothstep(350.0, 900.0, dist));           // beyond the edge a few tops of the long swell still catch light
    col *= mix(1.0, 0.012 + 0.988*inside + 0.085*tops, uEdge.w);
    col = min(col, vec3(0.93));
  } else {
    // ---------------- from below: the same mask as a luminous ceiling, brighter toward grazing
    float mu = abs(Vd.y);
    // ripple light breaks the lanes' outlines: along every edge of the mask the facets and the caustic web carry the
    // glow a few metres into the dark water and the dark into the glow (no lane ends in a drawn line)
    vec2 cwe = p*0.5 + 0.7*vec2(qN(p*0.19 + t*0.07), qN(p*0.19 + 3.3 - t*0.06));
    float web = 1.0 - abs(2.0*qN(cwe + vec2(t*0.2, 0.0)) - 1.0);
    m = clamp(m + 4.0*m*(1.0 - m)*(0.42*(h0 - 0.62) + 0.42*(web*web - 0.3) + 0.26*(qN(p*0.13 + vec2(-t*0.05, t*0.04)) - 0.5))*(1.0 - smoothstep(3.0, 16.0, fp)), 0.0, 1.0);
    col = mix(uLane*0.46, uBright, m);
    float gz = clamp(1.0 - mu, 0.0, 1.0);
    col *= 0.5 + 0.75*gz*sqrt(gz);
    col *= 0.86 + 0.5*h0;
    col *= 0.88 + 0.26*qN(p*0.31 + vec2(t*0.4, -t*0.25));
    col *= 1.0 - 0.3*cat;
    // unmistakably the underside of water: close overhead the ripple facets stand out and a web of caustic
    // light crawls across the ceiling
    float tex = 0.5*(h0 - 0.75)*(1.0 - smoothstep(4.0, 14.0, dist));
    vec2 cw = p*0.5 + 0.7*vec2(qN(p*0.19 + t*0.07), qN(p*0.19 + 3.3 - t*0.06));
    float c1 = 1.0 - abs(2.0*qN(cw + vec2(t*0.2, 0.0)) - 1.0), c2 = 1.0 - abs(2.0*qN(cw*1.8 + 4.1 - vec2(0.0, t*0.27)) - 1.0);
    c1 *= c1; c2 *= c2;
    tex += (0.6*c1*c1 + 0.4*c2*c2 - 0.14)*(1.0 - smoothstep(0.25, 1.5, fp))*(0.4 + 0.6*m);
    vec2 cf = p*2.3 + 0.5*vec2(qN(p*0.9 + t*0.2), qN(p*0.9 + 5.1 - t*0.17));                  // and a finer one for the last metres before the break
    float f1 = 1.0 - abs(2.0*qN(cf + vec2(t*0.5, 0.0)) - 1.0), f2 = 1.0 - abs(2.0*qN(cf*2.1 + 1.7 - vec2(0.0, t*0.6)) - 1.0);
    f1 *= f1; f2 *= f2;
    tex += (0.6*f1*f1 + 0.45*f2*f2 - 0.3)*(1.0 - smoothstep(0.03, 0.22, fp))*(1.0 - smoothstep(4.0, 16.0, dist));
    // the 20 m marble octave: darker veins curling through the bright water (fades with the footprint)
    float mb = qF2(p/21.0 + 1.5*(vec2(qN(p/47.0 + 3.1), qN(p/47.0 + 8.7)) - 0.5) + vec2(t*0.004, -t*0.003));
    float vein = 1.0 - smoothstep(0.012, 0.045, abs(mb - 0.47));
    col *= 1.0 - (0.28*(1.0 - smoothstep(0.34, 0.56, mb)) + 0.55*vein)*(1.0 - smoothstep(3.0, 14.0, fp));
    col *= mix(1.0, 0.02 + 0.98*seaEdge(p, t, min(fp, 200.0), dist), uEdge.w);
    col = min(col, vec3(0.95))*(1.0 + tex);                     // (after the clamp, so the facets and the web also show where the ceiling is brightest)
    float fd = dist*uUFog.a, fg = 1.0 - exp(-fd*fd);
    col = mix(col, uUFog.rgb*2.0, fg);                          // far away: the luminous seam at the horizon (matches makeBackdrop)
  }
  gl_FragColor = vec4(col, 1.0);
}`,Ut=`
uniform vec3 uGlow, uSkyFill;
vec3 qLit(vec3 alb, vec3 N, float wy){
  float dn = clamp(0.5 - 0.5*N.y, 0.0, 1.0); dn = dn*dn*(3.0 - 2.0*dn);
  vec3 air = uGlow*dn + uSkyFill*(1.0 - dn);
  vec3 sea = uGlow*(0.1 + 0.55*clamp(0.5 + 0.5*N.y, 0.0, 1.0));
  return alb*mix(air, sea, step(wy, -0.05));
}`,ut=`#include <fog_pars_vertex>
`,mt=`#include <fog_pars_fragment>
`,x0=(t,a="")=>`
${st}
${Ut}
uniform float uTime;
${a}
varying vec3 vWp, vN, vCol, vL;
${mt}
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 alb = vCol, emi = vec3(0.0);
  ${t}
  gl_FragColor = vec4(qLit(alb, N, vWp.y) + emi, 1.0);
  #include <fog_fragment>
}`,nt=`
  vec4 wp = modelMatrix*vec4(P, 1.0); vWp = wp.xyz;
  vN = normalize(mat3(modelMatrix)*Nn); vCol = aCol;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,rt=`
attribute vec3 aCol; attribute vec4 aAnim;
uniform float uTime;
varying vec3 vWp, vN, vCol, vL;
${ut}
`,z0=rt+`
void main(){
  vec3 P = position, Nn = normal; vL = position;
  float w = smoothstep(2.2, -4.6, P.z);
  P.x += 0.8*w*w*sin(uTime*1.25 + P.z*0.55) - 0.07*sin(uTime*1.25 + 2.4)*(1.0 - w);
  P.y += aAnim.x*0.25*sin(uTime*0.9 + P.z);
`+nt,q0=`
  float top = smoothstep(-0.25, 0.45, N.y);
  vec2 g = vec2(atan(vL.y + 0.3, vL.x)*1.15*2.3, vL.z*2.0); g.x += 0.5*floor(g.y);      // the lattice wraps the girth: spots on the flanks too, never bars
  float sp = 1.0 - smoothstep(0.13, 0.24, length(fract(g) - 0.5));
  float bar = 1.0 - smoothstep(0.02, 0.07, abs(fract(vL.z*1.0 + 0.25) - 0.5));
  float finM = step(vCol.g*1.25, vCol.b)*step(vCol.g, 0.12);                               // fins are flagged by their colour
  top = max(max(top, 0.8*finM), 0.62*smoothstep(-0.8, -0.15, N.y));      // the flanks carry spots too, dimmer: they read from the side and from a little below
  vec2 gf = vL.yz*2.1; gf.x += 0.5*floor(gf.y);
  sp = mix(sp, 1.0 - smoothstep(0.12, 0.22, length(fract(gf) - 0.5)), finM);
  alb += vec3(0.34, 0.42, 0.38)*max(sp, bar*0.12)*top*step(vCol.g, 0.12);
  emi += finM*uGlow*vec3(0.012, 0.022, 0.022)*(0.7 + 0.3*sin(dot(vL.yz, vec2(9.0, 17.0))));     // thin: the ceiling's light comes through, in rays
  float gz = (2.75 - vL.z)/0.17;                                                           // five gill slits on each flank (for the close pass)
  alb *= 1.0 - 0.75*(1.0 - smoothstep(0.12, 0.3, abs(fract(gz) - 0.5)))*step(0.0, gz)*step(gz, 5.0)*(1.0 - smoothstep(0.25, 0.7, abs(N.y)))*step(abs(vL.y + 0.1), 0.62);
`,M0=rt+`
void main(){
  vec3 P = position, Nn = normal; vL = position;
  float a = aAnim.x, ph = uTime*1.9 + aAnim.y;
  P.y += 1.0*a*sqrt(a)*sin(ph - a*1.7) + 0.12*sin(ph + 1.0);
  P.x *= 1.0 - 0.1*a*(0.5 + 0.5*sin(ph - 1.0));
  P.x += aAnim.z*0.35*sin(uTime*1.3 + P.z*0.9);
`+nt,k0=rt+`
uniform float uStroke;
void main(){
  vec3 P = position, Nn = normal; vL = position;
  float kind = aAnim.w, ph = 6.2832*uStroke;
  vec3 q = P - aAnim.xyz;
  if (kind > 0.5 && kind < 1.5) {            // rower: swing from the hips
    float th = 0.42*cos(ph + 0.35), c = cos(th), s = sin(th);
    q = vec3(q.x, c*q.y - s*q.z, s*q.y + c*q.z); Nn = vec3(Nn.x, c*Nn.y - s*Nn.z, s*Nn.y + c*Nn.z);
    P = aAnim.xyz + q;
  } else if (kind > 1.5) {                   // oar: sweep about the oarlock, dip on the drive
    float sd = kind > 2.5 ? 1.0 : -1.0;
    float al = -sd*0.52*cos(ph), be = sd*(0.17 + 0.15*sin(ph));
    float c = cos(al), s = sin(al);
    q = vec3(c*q.x + s*q.z, q.y, -s*q.x + c*q.z);
    c = cos(be); s = sin(be);
    q = vec3(c*q.x + s*q.y, -s*q.x + c*q.y, q.z);
    P = aAnim.xyz + q;
  }
`+nt;function je(){return{p:[],c:[],a:[],i:[],n:0}}function ke(t,a,s,f,c,l){return t.p.push(a,s,f),t.c.push(c[0],c[1],c[2]),t.a.push(l[0],l[1],l[2],l[3]),t.n++}function me(t,a,s,f,c,l,z=!0,g=!0){const x=t.n,m=(h,d)=>typeof c=="function"?c(h,d):c,y=(h,d,w)=>typeof l=="function"?l(h,d,w):l;for(let h=0;h<=a;h++)for(let d=0;d<s;d++){const w=f(h,d);ke(t,w[0],w[1],w[2],m(h,d),y(h,d,w))}for(let h=0;h<a;h++)for(let d=0;d<s;d++){const w=x+h*s+d,q=x+h*s+(d+1)%s,n=w+s,p=q+s;t.i.push(w,q,n,q,p,n)}for(const[h,d]of[[z,0],[g,a]]){if(!h)continue;let w=0,q=0,n=0;for(let i=0;i<s;i++){const u=f(d,i);w+=u[0]/s,q+=u[1]/s,n+=u[2]/s}const p=ke(t,w,q,n,m(d,0),y(d,0,[w,q,n]));for(let i=0;i<s;i++){const u=x+d*s+i,A=x+d*s+(i+1)%s;d===0?t.i.push(p,A,u):t.i.push(p,u,A)}}}function le(t,a,s,f,c,l,z){const g=d=>typeof z=="function"?z(d):z,x=ke(t,a[0],a[1],a[2],l,g(a)),m=ke(t,s[0],s[1],s[2],l,g(s)),y=ke(t,f[0],f[1],f[2],l,g(f)),h=ke(t,c[0],c[1],c[2],l,g(c));t.i.push(x,m,y,x,y,h)}function We(t,a,s,f,c,l){const z=y=>typeof l=="function"?l(y):l,g=ke(t,a[0],a[1],a[2],c,z(a)),x=ke(t,s[0],s[1],s[2],c,z(s)),m=ke(t,f[0],f[1],f[2],c,z(f));t.i.push(g,x,m)}function Z(t,a,s,f,c,l,z){const g=[s[0]-a[0],s[1]-a[1],s[2]-a[2]],x=Math.hypot(g[0],g[1],g[2])||1;g[0]/=x,g[1]/=x,g[2]/=x;let m=Math.abs(g[1])>.9?[1,0,0]:[0,1,0];const y=[g[1]*m[2]-g[2]*m[1],g[2]*m[0]-g[0]*m[2],g[0]*m[1]-g[1]*m[0]],h=Math.hypot(y[0],y[1],y[2]);y[0]/=h,y[1]/=h,y[2]/=h,m=[y[1]*g[2]-y[2]*g[1],y[2]*g[0]-y[0]*g[2],y[0]*g[1]-y[1]*g[0]];const d=[[-1,-1],[1,-1],[1,1],[-1,1]];me(t,1,4,(w,q)=>{const n=w?s:a,p=d[q];return[n[0]+y[0]*p[0]*f+m[0]*p[1]*c,n[1]+y[1]*p[0]*f+m[1]*p[1]*c,n[2]+y[2]*p[0]*f+m[2]*p[1]*c]},l,z)}function $e(t){const a=new e.BufferGeometry;return a.setAttribute("position",new e.Float32BufferAttribute(t.p,3)),a.setAttribute("aCol",new e.Float32BufferAttribute(t.c,3)),a.setAttribute("aAnim",new e.Float32BufferAttribute(t.a,4)),a.setIndex(t.i),a.computeVertexNormals(),a}const vt=()=>e.UniformsUtils.clone(e.UniformsLib.fog);function it(t,a,s,f={},c={},l=""){return new e.ShaderMaterial({vertexShader:a,fragmentShader:x0(s,l),uniforms:{...vt(),uTime:t.uTime,uGlow:t.uGlow,uSkyFill:t.uSkyFill,...f},fog:!0,side:e.DoubleSide,...c})}function Ft(t,a,s){for(let f=0;f<t.length-1;f++)if(a<=t[f+1][0]){const c=ne(t[f][0],t[f+1][0],a);return I(t[f][s],t[f+1][s],c*.6+.4*Me((a-t[f][0])/(t[f+1][0]-t[f][0]),0,1))}return t[t.length-1][s]}function A0(t,a){const s=[0];for(let x=1;x<=34;x++)s.push(x*1.4);for(;s[s.length-1]<a.uRadius.value;)s.push(s[s.length-1]*1.078);const f=96,c=[],l=[];s.forEach(x=>{for(let m=0;m<f;m++){const y=m/f*Math.PI*2;c.push(Math.cos(y)*x,0,Math.sin(y)*x)}});for(let x=0;x<s.length-1;x++)for(let m=0;m<f;m++){const y=x*f+m,h=x*f+(m+1)%f;l.push(y,h,y+f,h,h+f,y+f)}const z=new e.BufferGeometry;z.setAttribute("position",new e.Float32BufferAttribute(c,3)),z.setIndex(l);const g=new e.Mesh(z,new e.ShaderMaterial({vertexShader:y0(t.swellGLSL),fragmentShader:b0(t.swellGLSL),uniforms:a,side:e.DoubleSide}));return g.frustumCulled=!1,g.renderOrder=1,g}function S0(t){const a=new e.Mesh(new e.SphereGeometry(1,24,12),new e.ShaderMaterial({uniforms:{uUFog:t.uUFog,uDeep:{value:new e.Color("#010504")}},side:e.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }",fragmentShader:"uniform vec4 uUFog; uniform vec3 uDeep; varying vec3 vD; void main(){ float y = vD.y/max(length(vD), 1e-3); float s = smoothstep(-0.13, 0.0, y), d = max(-y, 0.0); vec3 deep = uUFog.rgb*vec3(0.85, 1.0, 0.8)*1.45*exp(-d*2.5); gl_FragColor = vec4(uDeep + max(uUFog.rgb*2.0*s*sqrt(s), deep), 1.0); }"}));return a.frustumCulled=!1,a.renderOrder=-5,a.scale.setScalar(3e3),a}function P0(t){const a=je(),s=[.042,.066,.07],f=[.2,.25,.23],c=[.04,.056,.078],l=[[0,1.16,.26,.22],[.05,1.36,.4,.34],[.14,1.42,.56,.5],[.3,1.24,.86,.72],[.5,.84,.82,.62],[.7,.46,.52,.4],[.86,.17,.22,.17],[.93,.09,.14,.1]],z=22,g=14;me(a,z,g,(y,h)=>{const d=y/z*.93,w=h/g*Math.PI*2,q=Math.cos(w),n=Math.sin(w),p=Ft(l,d,1),i=Ft(l,d,2),u=Ft(l,d,3),A=n>0?1+.07*Math.max(0,Math.cos(w*6))*ne(.1,.3,d):1;return[p*Math.sign(q)*Math.pow(Math.abs(q),.8),(n>0?i*A:u)*Math.sign(n)*Math.pow(Math.abs(n),.8),4.5-9*d]},(y,h)=>Math.sin(h/g*Math.PI*2)<-.35?f:s,[0,0,0,0]);const x=[0,0,0,0];le(a,[0,.8,.5],[0,.78,-1],[0,1.75,-1.5],[0,1.5,-.95],c,x),We(a,[0,.5,-1.9],[0,.45,-2.6],[0,.95,-2.75],c,x),le(a,[0,.12,-3.5],[0,0,-3.95],[0,1.5,-5],[0,1,-4.15],c,x),We(a,[0,0,-3.5],[0,-1.05,-4.45],[0,-.05,-3.95],c,x);for(const y of[-1,1])le(a,[y*1.15,-.3,2.3],[y*1.05,-.32,1.25],[y*3,-1.25,-.3],[y*2.6,-1.1,.55],c,h=>[Math.max(0,Math.abs(h[0])-1)*.5,0,0,0]),We(a,[y*.5,-.5,-1.3],[y*.42,-.5,-1.95],[y*.95,-.82,-2.15],c,x);for(const[y,h,d,w]of[[.35,-.8,1.2,.1],[-.45,-.74,-.4,-.15],[1.25,-.5,1.5,.3],[-.2,-.56,-2,0]])me(a,6,5,(q,n)=>{const p=q/6,i=.075*Math.pow(Math.sin(Math.PI*Math.min(.97,p*.9+.06)),.7),u=n/5*Math.PI*2,A=.35-.7*p;return[y+Math.cos(u)*i+A*Math.sin(w),h+Math.sin(u)*i*.8,d+A*Math.cos(w)]},[.07,.085,.08],[0,0,0,0]);const m=new e.Mesh($e(a),it(t,z0,q0));return m.frustumCulled=!1,m}function N0(t){const a=je(),s=[.028,.04,.046],f=[.22,.26,.25];for(const[l,z,g,x]of[[0,0,0,0],[3.6,1.3,-5.2,2.1]]){const h=(d,w,q)=>{const n=(d/14*2-1)*2.5,p=Math.abs(n)/2.5,i=1-1.15*Math.pow(p,1.25),u=-.95+.75*Math.pow(p,.8),A=w/5,P=I(u,i,A),D=(q?.3:-.16)*Math.pow(1-p,1.3)*Math.pow(Math.sin(Math.PI*Me(A*.86+.07,0,1)),.7);return[l+n,z+D,g+P,p]};for(const d of[1,0])for(let w=0;w<14;w++)for(let q=0;q<5;q++){const n=[h(w,q,d),h(w+1,q,d),h(w+1,q+1,d),h(w,q+1,d)],p=i=>[Math.abs(i[0]-l)/2.5,x,0,0];d?le(a,n[0],n[3],n[2],n[1],s,p):le(a,n[0],n[1],n[2],n[3],f,p)}for(const d of[-1,1])le(a,[l+d*.28,z,g+.9],[l+d*.5,z,g+.95],[l+d*.42,z-.08,g+1.45],[l+d*.3,z-.05,g+1.4],s,[.05,x,0,0]);me(a,6,3,(d,w)=>{const q=d/6,n=.05*(1-q)+.008,p=w/3*Math.PI*2;return[l+Math.cos(p)*n,z+Math.sin(p)*n,g-.9-3.2*q]},s,d=>[0,x,d/6,0],!1,!1)}const c=new e.Mesh($e(a),it(t,M0,""));return c.frustumCulled=!1,c}function F0(t,a,s,f){const c=je(),l=[.02,.03,.03];me(c,5,5,(q,n)=>{const p=q/5,i=.075*Math.sin(Math.PI*(.16+.62*(1-p))),u=n/5*Math.PI*2;return[Math.cos(u)*i,Math.sin(u)*i,-.04+.36*p]},l,[0,0,0,0]);for(const q of[-1,1])We(c,[q*.03,0,.32],[q*.03,0,.16],[q*.17,0,.2],l,[0,0,0,0]);for(let q=0;q<6;q++){const n=q/6*Math.PI*2,p=Math.cos(n),i=Math.sin(n),u=.018;le(c,[p*.04-i*u,i*.04+p*u,-.04],[p*.04+i*u,i*.04-p*u,-.04],[p*.07,i*.07,-.34],[p*.065,i*.065,-.34],l,A=>[Me((-A[2]-.04)/.3,0,1),0,0,0])}const z=$e(c),g=new e.InstancedBufferGeometry;g.index=z.index;for(const q of["position","normal","aCol","aAnim"])g.setAttribute(q,z.attributes[q]);const x=new Float32Array(f*4),m=new Float32Array(f*4),y=new e.Vector3,h=new e.Vector3;for(let q=0;q<f;q++){const n=a.range(.015,.2);s.pointAt(n,y),s.tangentAt(n,h);const p=a.sign()*a.range(3.5,17),i=a.range(0,6.283);x.set([y.x+h.z*p,a.range(-4.6,-1.2),y.z-h.x*p,i],q*4),m.set([a.range(-.25,.25),a.range(1.6,3.2),a.range(0,1),a.range(.8,1.5)],q*4)}g.setAttribute("iA",new e.InstancedBufferAttribute(x,4)),g.setAttribute("iB",new e.InstancedBufferAttribute(m,4)),g.instanceCount=f;const d=rt+`
attribute vec4 iA, iB;
void main(){
  vec3 P = position*iB.w*1.2, Nn = normal; vL = position;
  float cyc = uTime*0.55*iB.w + iB.z*7.0, c = fract(cyc), jet = 1.0 - (1.0 - c)*(1.0 - c);
  float run = 26.0, d = mod((floor(cyc) + jet)*iB.y, run), q = d/run;
  float sc = smoothstep(0.0, 0.1, q)*(1.0 - smoothstep(0.9, 1.0, q));
  P.xy *= 1.0 + aAnim.x*(0.3 + 1.3*c);
  P *= sc;
  float cy = cos(iA.w), sy = sin(iA.w), cp = cos(iB.x), sp = sin(iB.x);
  vec3 fw = vec3(sy*cp, sp, cy*cp), rt = vec3(cy, 0.0, -sy), up = cross(fw, rt);
  vec3 O = iA.xyz + fw*(d - run*0.5);
  O.y = clamp(O.y, -4.9, -0.7);
  P = O + rt*P.x + up*P.y + fw*P.z;
  Nn = rt*normal.x + up*normal.y + fw*normal.z;
`+nt,w=new e.Mesh(g,it(t,d,""));return w.frustumCulled=!1,w}function B0(t,a,s,f){const c=je(),l=[.045,.065,.06],z=[.13,.19,.17];me(c,6,5,(u,A)=>{const P=u/6,D=.045*Math.pow(Math.sin(Math.PI*Me(P*.9+.06,0,1)),.75),L=A/5*Math.PI*2;return[Math.cos(L)*D*.8,Math.sin(L)*D,.3-.54*P]},l,[0,0,0,0]),We(c,[0,0,-.2],[0,.09,-.36],[0,0,-.27],l,[2,0,0,0]),We(c,[0,0,-.2],[0,0,-.27],[0,-.13,-.43],l,[2,0,0,0]);for(const u of[-1,1])le(c,[u*.035,.015,.15],[u*.035,.015,-.03],[u*.37,.05,-.22],[u*.34,.05,-.1],z,A=>[1,Math.abs(A[0]),0,0]),We(c,[u*.03,-.01,-.08],[u*.03,-.01,-.17],[u*.18,0,-.26],z,A=>[1,Math.abs(A[0]),0,0]);const g=4;for(let u=0;u<g;u++)le(c,[-1,0,u/g],[1,0,u/g],[1,0,(u+1)/g],[-1,0,(u+1)/g],l,[3,0,0,0]);const x=$e(c),m=new e.InstancedBufferGeometry;m.index=x.index;for(const u of["position","normal","aCol","aAnim"])m.setAttribute(u,x.attributes[u]);const y=f.reduce((u,A)=>u+A.n,0),h=new Float32Array(y*4),d=new Float32Array(y*4);let w=0;f.forEach((u,A)=>{for(let P=0;P<u.n;P++,w++){const D=u.both?P%2?1:-1:s.sign(),L=s.range(u.fan[0],u.fan[1])*D,F=u.forward+L,B=u.both?D*s.range(u.lat[0],u.lat[1]):s.range(-u.lat[1],u.lat[1]),N=s.range(u.ahead[0],u.ahead[1]),J=Math.sin(u.forward),U=-Math.cos(u.forward);h.set([u.origin[0]+J*N+-U*B,u.origin[1]+U*N+J*B,F,s.range(0,u.spreadT??.8)],w*4),d.set([s.range(6,20),s.range(34,46),s(),A],w*4)}}),m.setAttribute("iO",new e.InstancedBufferAttribute(h,4)),m.setAttribute("iP",new e.InstancedBufferAttribute(d,4)),m.instanceCount=y;const q={...vt(),uTime:t.uTime,uGlow:t.uGlow,uSkyFill:t.uSkyFill,uMsTime:a.uniforms.uMsTime,uMsAmp:a.uniforms.uMsAmp,uBlue:t.uBlue,uBurstA:{value:new e.Vector4(-9,-9,-9,-9)},uBurstB:{value:new e.Vector4(-9,-9,-9,-9)}},n=`
${a.swellGLSL}
attribute vec3 aCol; attribute vec4 aAnim, iO, iP;
uniform float uTime; uniform vec4 uBurstA, uBurstB;
varying vec3 vWp, vN, vCol; varying vec4 vS;
${ut}
void main(){
  float bi = iP.w;
  vec4 sA = vec4(equal(vec4(bi), vec4(0.0, 1.0, 2.0, 3.0))), sB = vec4(equal(vec4(bi), vec4(4.0, 5.0, 6.0, 7.0)));
  float tl = dot(uBurstA, sA) + dot(uBurstB, sB) - iO.w;
  float v = 11.0, Ls = iP.x, Lg = iP.y, Tt = Lg/v;
  float d = clamp(tl, 0.0, Tt)*v;
  vec2 f = vec2(sin(iO.z), -cos(iO.z)), r = vec2(-f.y, f.x);
  float part = aAnim.x;
  vec3 wpos; vec3 Nn = normal;
  if (part > 2.5) {
    float a = min(position.z*Ls, d), age = tl - a/v;
    float heal = clamp(1.0 - age/5.0, 0.0, 1.0)*step(0.0, tl)*step(0.01, d);
    vec2 xz = iO.xy + f*a + r*(position.x*(0.3 + 0.1*age)*(1.3 - 0.75*position.z) + 0.22*sin(a*0.9 + iP.z*20.0));
    wpos = vec3(xz.x, msSwell(xz) + 0.06, xz.y);
    vS = vec4(position.x, heal*(0.3 + 0.7*smoothstep(-0.5, 0.6, sin(a*2.3 + iP.z*40.0)))*smoothstep(0.0, 1.5, a)*(1.0 - smoothstep(0.55, 1.0, position.z)), 1.0, 1.0 - smoothstep(0.2, 2.0, age));
    Nn = vec3(0.0, 1.0, 0.0);
  } else {
    float live = step(0.0, tl)*step(tl, Tt);
    float sc = 1.5*live*smoothstep(0.0, 0.12, tl)*(1.0 - smoothstep(Tt - 0.25, Tt, tl));
    float g = clamp((d - Ls)/max(Lg - Ls, 1.0), 0.0, 1.0);
    float y = 0.1 + 0.12*clamp(d/Ls, 0.0, 1.0) + (0.34 + 0.2*iP.z)*sqrt(max(sin(3.1416*g), 0.0)) + 0.05*sin(uTime*3.0 + iP.z*50.0);
    y += sA.x*(2.8 + 2.2*iP.z)*sin(3.1416*clamp(d/18.0, 0.0, 1.0));     // the burst at the surface break leaps into the frame
    y += (sA.z + sA.w + sB.x)*(0.5 + 2.3*iP.z*iP.z)*sqrt(max(sin(3.1416*g), 0.0));      // on the final run (the three bursts of 41.5 to 44.5 s) some glide a man's height up, toward the lens
    y *= 1.0 - smoothstep(0.93, 1.0, g);
    vec3 P = position;
    float taxi = 1.0 - smoothstep(Ls*0.8, Ls*1.1, d);
    if (part > 1.5) P.x += (0.05 + 0.07*taxi)*sin(uTime*38.0 + iP.z*30.0)*(-P.z - 0.1)*6.0;
    if (part > 0.5 && part < 1.5) P.y += aAnim.y*(0.25 - 0.2*taxi) + 0.02*aAnim.y*sin(uTime*30.0 + iP.z*9.0)*taxi;
    float pt = 0.1*taxi + 0.03, cp = cos(pt), sp = sin(pt);
    P = vec3(P.x, cp*P.y + sp*P.z, -sp*P.y + cp*P.z)*sc;
    Nn = vec3(Nn.x, cp*Nn.y + sp*Nn.z, -sp*Nn.y + cp*Nn.z);
    vec2 xz = iO.xy + f*(d + P.z) + r*P.x;
    wpos = vec3(xz.x, msSwell(xz) + y + P.y, xz.y);
    Nn = vec3(r.x*Nn.x + f.x*Nn.z, Nn.y, r.y*Nn.x + f.y*Nn.z);
    vS = vec4(0.0, 1.0, 0.0, 0.0);
  }
  vWp = wpos; vN = Nn; vCol = aCol;
  vec4 mvPosition = viewMatrix*vec4(wpos, 1.0); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,p=`
${Ut}
uniform vec3 uBlue;
varying vec3 vWp, vN, vCol; varying vec4 vS;
${mt}
void main(){
  if (vS.z > 0.5) {
    float a = vS.y*0.42*(1.0 - smoothstep(0.0, 1.0, abs(vS.x)));
    gl_FragColor = vec4(uBlue*(1.6*a*vS.w), a);                  // fresh, the scratch is a smear of blue light; it heals dark
  } else {
    vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
    gl_FragColor = vec4(qLit(vCol, N, 1.0), 1.0);
    #include <fog_fragment>
  }
}`,i=new e.Mesh(m,new e.ShaderMaterial({vertexShader:n,fragmentShader:p,uniforms:q,fog:!0,side:e.DoubleSide,transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3}));return i.frustumCulled=!1,i.renderOrder=3,{mesh:i,uniforms:q,count:y}}function T0(t,a,s,f,c){const l=[],z=[],g=[],x=[];let m=0;const y=(n,p,i,u,A)=>(l.push(n,p,i),z.push(u[0],u[1],u[2],u[3]),g.push(A[0],A[1],A[2],A[3]),m++);for(const n of f){const p=[n.x,n.z,n.r,s.range(0,50)],i=16,u=y(n.x,0,n.z,p,[0,0,0,0]);for(let P=0;P<i;P++){const D=P/i*Math.PI*2;y(n.x+Math.cos(D)*n.r,0,n.z+Math.sin(D)*n.r,p,[0,0,0,0])}for(let P=0;P<i;P++)x.push(u,u+1+(P+1)%i,u+1+P);const A=Math.round(c*(.6+n.r/8));for(let P=0;P<A;P++){const D=s.range(0,6.283),L=Math.sqrt(s())*n.r*.8,F=n.x+Math.cos(D)*L,B=n.z+Math.sin(D)*L,N=s.range(0,3.14),J=s.range(.1,.24),U=s.range(.7,1.7),C=s.range(0,6.283),j=Math.cos(N)*J,pe=Math.sin(N)*J,ce=3,V=m;for(let $=0;$<=ce;$++){const R=$/ce,ve=1-.55*R;y(F-j*ve,-U*R,B-pe*ve,p,[1,R,C,-1]),y(F+j*ve,-U*R,B+pe*ve,p,[1,R,C,1])}for(let $=0;$<ce;$++){const R=V+$*2;x.push(R,R+1,R+2,R+1,R+3,R+2)}}}const h=new e.BufferGeometry;h.setAttribute("position",new e.Float32BufferAttribute(l,3)),h.setAttribute("aC",new e.Float32BufferAttribute(z,4)),h.setAttribute("aK",new e.Float32BufferAttribute(g,4)),h.setIndex(x);const d=`
${a.swellGLSL}
attribute vec4 aC, aK; uniform float uTime;
varying vec2 vUv; varying vec4 vK; varying float vSeed, vR;
${ut}
void main(){
  vec3 P = position;
  if (aK.x < 0.5) P.y = msSwell(P.xz) + 0.04;
  else {
    P.y += msSwell(aC.xy) + 0.02;
    P.xz += vec2(sin(uTime*0.7 + aK.z + aK.y*2.2), cos(uTime*0.6 + aK.z*1.3 + aK.y*1.7))*0.17*aK.y;
  }
  vUv = (position.xz - aC.xy)/aC.z; vK = aK; vSeed = aC.w; vR = aC.z;
  vec4 mvPosition = viewMatrix*vec4(P, 1.0); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,w=`
${st}
uniform vec3 uGlow;
varying vec2 vUv; varying vec4 vK; varying float vSeed, vR;
${mt}
void main(){
  float a; vec3 col = vec3(0.012, 0.014, 0.008);
  if (vK.x < 0.5) {
    vec2 q = vUv*vR; float r = length(vUv);
    float n = qF2(q*0.95 + vSeed), n2 = qN(q*0.42 + vSeed*3.0), w = max(0.035, fwidth(n)*1.3);
    float a0 = 1.0 - smoothstep(0.62, 0.98, r + 0.5*(qN(vUv*2.6 + vSeed) - 0.5));
    float strand = max(1.0 - smoothstep(w, 2.0*w, abs(n - 0.5)), 1.0 - smoothstep(w, 2.0*w, abs(n - 0.36)));
    float clump = smoothstep(0.5, 0.6, n2 + 0.25*(n - 0.5));
    a = a0*clamp(max(clump, strand*0.9), 0.0, 1.0);
    col += vec3(0.05, 0.04, 0.012)*step(0.86, qH(floor(q*9.0)))*clump;
  } else {
    a = (1.0 - smoothstep(0.45, 1.0, abs(vK.w) + 0.6*(qN(vec2(vK.y*6.0, vK.z*9.0)) - 0.5)))*(1.0 - smoothstep(0.85, 1.0, vK.y));
    col += uGlow*0.012*(1.0 - vK.y);
  }
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`,q=new e.Mesh(h,new e.ShaderMaterial({vertexShader:d,fragmentShader:w,uniforms:{...vt(),uTime:t.uTime,uGlow:t.uGlow,uMsTime:a.uniforms.uMsTime,uMsAmp:a.uniforms.uMsAmp},fog:!0,side:e.DoubleSide,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));return q.frustumCulled=!1,q.renderOrder=2,q}function C0(t,a){const s=je(),f=[0,0,0,0],c=[.2,.17,.13],l=[.26,.22,.17],z=[.03,.03,.035],g=[.3,.26,.2],x=n=>1.05*(n<.45?I(.62,1,ne(0,.45,n)):Math.pow(Math.cos((n-.45)/.55*Math.PI/2),.65)),m=n=>.5+.28*(2*n-1)*(2*n-1),y=n=>-.42+.55*ne(.8,1,n),h=(n,p,i,u=0)=>[i*(x(n)*Math.pow(p,.5)+u),y(n)+(m(n)-y(n))*Math.pow(p,1.5),4-8*n],d=14,w=7;for(const n of[-1,1])for(let p=0;p<d;p++)for(let i=0;i<w;i++){const u=p/d,A=(p+1)/d,P=i/w,D=(i+1)/w,L=i>0?.035:0,F=[h(u,P,n,L),h(A,P,n,L),h(A,D,n),h(u,D,n)];n>0?le(s,F[0],F[1],F[2],F[3],i%2?c:l,f):le(s,F[0],F[3],F[2],F[1],i%2?c:l,f)}for(let n=0;n<w;n++)le(s,h(0,n/w,-1),h(0,n/w,1),h(0,(n+1)/w,1),h(0,(n+1)/w,-1),c,f);for(const n of[-1,1])for(let p=0;p<d;p++)Z(s,h(p/d,1,n),h((p+1)/d,1,n),.035,.03,l,f);Z(s,[0,m(1)+.25,-4.02],[0,y(.9),-3.7],.04,.05,c,f);for(let n=0;n<6;n++){const p=-2.25+n*.86,i=(4-p)/8,u=x(i)*.93,A=n%2?-1:1,P=-A*.26,D=[P,.3,p];Z(s,[-u,.24,p],[u,.24,p],.11,.02,c,f);const L=[D[0],D[1],D[2],1];me(s,2,6,(N,J)=>{const U=N/2,C=J/6*Math.PI*2;return[P+Math.cos(C)*I(.19,.24,U),.3+.58*U,p+Math.sin(C)*I(.13,.12,U)+.05*U]},z,L),me(s,3,6,(N,J)=>{const U=N/3,C=J/6*Math.PI*2,j=.115*Math.sin(Math.PI*(.12+.76*U));return[P+Math.cos(C)*j,.9+.26*U,p+.07+Math.sin(C)*j]},z,L);for(const N of[-1,1])Z(s,[P+N*.22,.84,p+.04],[P+N*.14,.58,p+.5],.045,.045,z,L),Z(s,[P+N*.1,.32,p+.02],[P+N*.12,.12,p+.6],.06,.055,z,f);const F=[A*x(i),m(i)+.06,p+.42],B=[F[0],F[1],F[2],A<0?2:3];Z(s,[F[0]-A*.95,F[1]+.07,F[2]],[F[0]+A*2.3,F[1]-.16,F[2]],.028,.028,g,B),Z(s,[F[0]+A*2.25,F[1]-.16,F[2]],[F[0]+A*3,F[1]-.21,F[2]],.085,.014,g,B)}me(s,2,6,(n,p)=>{const i=n/2,u=p/6*Math.PI*2;return[Math.cos(u)*I(.2,.25,i),.38+.62*i,3.25+Math.sin(u)*.13-.06*i]},z,f),me(s,3,6,(n,p)=>{const i=n/3,u=p/6*Math.PI*2,A=.12*Math.sin(Math.PI*(.12+.76*i));return[Math.cos(u)*A,1.02+.27*i,3.18+Math.sin(u)*A]},z,f),Z(s,[.2,.82,3.25],[.1,.62,3.75],.045,.045,z,f),Z(s,[.1,.62,3.75],[0,.66,4.05],.025,.025,g,f),Z(s,[-.003,.5,4.08],[0,-.5,4.12],.02,.16,c,f),Z(s,[-.7,.3,3.2],[.7,.3,3.2],.3,.02,c,f),Z(s,[0,.55,-3.9],[0,1.6,-3.9],.022,.022,c,f),Z(s,[0,1.6,-3.9],[0,1.92,-3.9],.085,.085,[.95,.5,.15],f);const q=new e.Mesh($e(s),it(t,k0,`alb *= 0.8 + 0.4*qN(vL.xz*vec2(14.0, 2.0) + vL.y*5.0);
  vec3 ld = vec3(0.0, 1.76, -3.9) - vL; float lr = dot(ld, ld);
  emi = (vCol*1.2 + 0.006)*uWarm*(1.7*(0.35 + 0.65*max(dot(N, ld)/sqrt(max(lr, 1e-4)), 0.0))/(1.0 + lr*0.16));
  if (vCol.r > 0.9) emi = vCol*3.6;`,{uStroke:a,uWarm:t.uWarm},{},"uniform vec3 uWarm;"));return q.frustumCulled=!1,q}function L0(t,a,s,f,c){const z=[],g=[];for(let d=0;d<=48;d++)for(const w of[-1,1])z.push(d/48,w,0);for(let d=0;d<48;d++){const w=d*2;g.push(w,w+1,w+2,w+1,w+3,w+2)}const x=new e.BufferGeometry;x.setAttribute("position",new e.Float32BufferAttribute(z,3)),x.setIndex(g);const m=`
uniform vec3 uA, uB; uniform float uStroke, uTime; uniform vec2 uRes;
varying float vX, vY;
${ut}
vec3 hw(float s){
  float lift = 0.5 + 0.5*sin(6.2832*uStroke - 1.2);
  float sag = 4.9 - 2.5*lift*lift;
  vec3 P = mix(uA, uB, s);
  P.y -= sag*4.0*s*(1.0 - s)*(0.75 + 0.5*s);
  P.x += 0.25*sin(uTime*0.9 + s*5.0)*s*(1.0 - s);
  return P;
}
void main(){
  float s = position.x;
  vec3 P = hw(s), T = normalize(hw(s + 0.01) - hw(s - 0.01));
  vec3 toC = cameraPosition - P; float dist = length(toC);
  vec3 sdv = normalize(cross(T, toC/max(dist, 1e-3)) + vec3(1e-5));
  float px = 2.0*dist/(projectionMatrix[1][1]*uRes.y);
  P += sdv*position.y*max(0.045, px*0.9);
  vX = position.y; vY = P.y;
  vec4 mvPosition = viewMatrix*vec4(P, 1.0); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,y=`
uniform vec3 uGlow;
varying float vX, vY;
${mt}
void main(){
  float drip = smoothstep(1.6, 0.0, vY);
  vec3 col = vec3(0.03, 0.028, 0.022) + uGlow*(0.02 + 0.07*drip)*(0.5 - 0.5*vX);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,h=new e.Mesh(x,new e.ShaderMaterial({vertexShader:m,fragmentShader:y,fog:!0,side:e.DoubleSide,uniforms:{...vt(),uA:{value:a.clone()},uB:{value:s.clone()},uStroke:f,uTime:t.uTime,uRes:c,uGlow:t.uGlow}}));return h.frustumCulled=!1,h}function E0(t,a,s,f){const c=new e.BufferGeometry;c.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const l={uSheet:{value:new e.Vector3(0,0,0)},uRes:a,uGlow:t.uGlow,uBody:{value:s},uDeepC:{value:f},uTime:t.uTime},z=new e.Mesh(c,new e.ShaderMaterial({uniforms:l,transparent:!0,depthTest:!1,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,vertexShader:"void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:`
${st}
uniform vec3 uSheet; uniform vec2 uRes; uniform vec3 uGlow, uBody, uDeepC; uniform float uTime;     // uSheet: x = seconds since the lens broke the surface, y = how far the water has closed over the lens just before it (0..1), z = the horizon's height on the screen (0 bottom .. 1 top)
void main(){
  vec2 uv = gl_FragCoord.xy/max(uRes, vec2(1.0));
  float asp = uRes.x/max(uRes.y, 1.0), x = uv.x*asp, tb = max(uSheet.x, 0.0), t = uTime;
  float s = clamp(tb/0.62, 0.0, 1.0); s = s*s*(3.0 - 2.0*s);
  float E = 1.3 - 1.45*s + 0.11*sin(x*2.0 + 0.9) + 0.03*sin(x*5.1 + tb*7.0) + 0.014*(qN(vec2(x*8.0, tb*4.0)) - 0.5);      // the waterline: one broad rounded crest
  float d = uv.y - E;                                         // > 0: the glass is clear of the sea here
  float below = 1.0 - smoothstep(-0.008, 0.003, d);
  float rim = exp(-(d + 0.004)*(d + 0.004)/0.00011);          // the meniscus
  float gather = exp(-max(-d, 0.0)/0.09)*below;               // light gathered under the crest
  // THE WATER STILL OVER THE LENS has depth: it is the glowing layer seen from inside, brightest just under the crest
  // and falling to deep teal toward the bottom of the frame. Light stands in it as long soft streaks that slant up to
  // the crest and slide with the water; the ceiling's caustic web is drawn stretched along the run of the water and
  // broken by a second layer, so it is an irregular net of pinched bright strokes, never a closed ring; and a few
  // bubbles run down as short blurred streaks. Close under the crest the water is thin and the scene shows through it.
  float deep = clamp(-d/0.9, 0.0, 1.0);
  float sl = x + 0.42*uv.y;
  float st = 0.62*qN(vec2(sl*11.0, uv.y*1.1 - tb*2.4 + 3.0)) + 0.38*qN(vec2(sl*26.0 + 5.0, uv.y*2.2 - tb*4.2));
  st = smoothstep(0.38, 0.86, st);
  vec2 q = vec2(x*6.0, (uv.y + 0.55*tb)*2.4);
  vec2 cw = q + 2.0*(vec2(qN(q*0.33 + t*0.07), qN(q*0.33 + 3.3 - t*0.06)) - 0.5);
  float r1 = 1.0 - abs(2.0*qN(cw + vec2(t*0.2, 0.0)) - 1.0), r2 = 1.0 - abs(2.0*qN(cw*1.7 + 4.1 - vec2(0.0, t*0.27)) - 1.0);
  float wb = r1*(0.4 + 0.6*r2); wb *= wb; float web = wb*wb;
  vec2 bq = vec2(x*8.0, uv.y*3.0); float bx = floor(bq.x), bs = 2.4 + 2.8*qH(vec2(bx, 5.0));
  bq.y += tb*bs + 9.0*qH(vec2(bx, 23.0)); float by = floor(bq.y), bh = qH(vec2(bx, by) + 3.0);
  vec2 bf = vec2(fract(bq.x) - 0.5 - 0.3*(qH(vec2(by, bx) + 9.0) - 0.5), fract(bq.y) - 0.5);
  float bub = step(0.8, bh)*exp(-bf.x*bf.x/0.012)*(1.0 - smoothstep(0.08, 0.42, abs(bf.y)));
  float lum = (0.5 + 0.38*web + 0.28*st*(1.0 - 0.5*deep) + 0.08*(qN(q*0.31 + vec2(t*0.11, -t*0.07)) - 0.5))*(1.22 - 0.72*deep) + 0.24*gather*gather;
  vec3 col = (mix(uBody, uDeepC, 0.6*deep)*lum + uGlow*0.2*bub*(1.0 - 0.5*deep))*below;
  float al = below*(0.74 + 0.26*smoothstep(0.0, 0.2, -d));
  // the wet glass above the line: a film that thins with height above the crest and with time
  float dry = 1.0 - smoothstep(0.3, 0.65, tb), bdry = 1.0 - smoothstep(0.5, 0.7, tb);
  float film = 0.1*exp(-max(d, 0.0)/0.16)*(0.6 + 0.4*qN(vec2(x*6.0, uv.y*2.0 + tb*2.5)))*(1.0 - below)*dry;
  // beads: about one cell in four of a grid a ninth of the frame high, only in the strip of frame under the horizon
  // (uSheet.z) and never above 0.4 of its height; each column slides down at its own speed, each bead is thrown about
  // inside its cell and is a small lens (dark top, the sea turned over as a bright crescent below, a glint)
  float zone = (1.0 - smoothstep(uSheet.z - 0.035, uSheet.z - 0.008, uv.y))*(1.0 - smoothstep(0.34, 0.4, uv.y));
  vec2 gq = vec2(x*9.0 + 0.3*sin(uv.y*23.0), uv.y*9.0); float cx = floor(gq.x), sp = 0.35 + 0.9*qH(vec2(cx, 3.0));
  gq.y += tb*sp + 7.0*qH(vec2(cx, 17.0)); float cy = floor(gq.y), hh = qH(vec2(cx, cy) + 7.0);
  vec2 f = vec2(fract(gq.x), fract(gq.y)) - 0.5 - 0.5*(vec2(qH(vec2(cx, cy) + 1.3), qH(vec2(cy, cx) + 5.1)) - 0.5);
  float r = 0.045 + 0.03*qH(vec2(cx, cy) + 11.0), rr = length(f*vec2(1.0, 0.85))/r;
  float bead = step(0.72, hh)*(1.0 - smoothstep(0.7, 1.0, rr))*smoothstep(0.0, 0.04, d)*bdry*zone;
  float cres = smoothstep(0.3, 1.0, rr)*smoothstep(-0.3, 0.9, -f.y/r);                         // the sea, turned over inside the bead
  float glint = exp(-dot(f - vec2(-0.3, 0.35)*r, f - vec2(-0.3, 0.35)*r)/(0.05*r*r + 1e-5));
  col += uGlow*(0.5*rim*(1.0 - 0.5*below) + 0.42*film) + uBody*bead*(0.1 + 0.8*cres + 0.6*glint);
  al = max(al, clamp(0.6*rim + 0.5*film + 0.7*bead, 0.0, 0.9));
  float cover = uSheet.x < 0.0 ? uSheet.y : 1.0;             // just before the break: the sea closing over the lens
  gl_FragColor = vec4(col*cover, al*cover);
}`}));return z.frustumCulled=!1,z.renderOrder=999,z.visible=!1,{mesh:z,uniforms:l}}const Bt=[[0,8.4,12.5,2.2],[-.7,19.3,-5.3,1.5]];async function V0(t,a,s,f){const c=je(),l=[.02,.018,.016],z=[.06,.05,.036],g=[.11,.09,.06],x=[.19,.18,.155],m=[.95,.5,.15],y=[.5,.25,.07],h=[],d=[];for(let B=0;B<s.length;B++){const N=s[B],J=Math.cos(N.h),U=Math.sin(N.h),C=N.s,j=[N.x,N.z,N.h,0],pe=[N.x,N.z,N.h,1],ce=c.n,V=(E,ee,W)=>[N.x+C*(J*E+U*W),C*ee,N.z+C*(-U*E+J*W)],$=E=>3.5*Math.pow(Math.sin(Math.PI*Me(E*.9+.075,0,1)),.6),R=E=>2.1+2.5*Math.pow(Math.abs(2*E-1),2.2)*(E<.5?1.5:1.05),ve=E=>-2+2.9*ne(.74,1,E)+.9*(1-ne(0,.14,E));me(c,14,12,(E,ee)=>{const W=E/14,_=ee/12*Math.PI*2,oe=Math.cos(_),we=Math.sin(_),ge=$(W),Le=we<0?I(R(W),ve(W),Math.pow(-we,.75)):R(W)+.12*we;return V(ge*Math.sign(oe)*Math.pow(Math.abs(oe),we<0?.55:1)*(we<0?1:.97),Le,12.5-27*W)},(E,ee)=>Math.sin(ee/12*Math.PI*2)>-.45?z:l,j);const X=[0,R(.03)+.75,12],Pe=[0,R(.2)+.7,6.4];Z(c,V(...X),V(...Pe),2*C,.7*C,l,j),Z(c,V(0,R(.99)-.2,-14.3),V(0,R(.99)+2.4,-15.9),.16*C,.2*C,z,j);for(const E of[-1,1])for(const ee of[.28,.62]){const W=I(X[1],Pe[1],ee)+.12,_=I(X[2],Pe[2],ee),oe=E*2.06;le(c,V(oe,W-.26,_-.5),V(oe,W-.26,_+.5),V(oe,W+.26,_+.5),V(oe,W+.26,_-.5),y,pe),h.push({p:new e.Vector3(...V(oe+E*.15,W,_)),d:B,size:.42,sea:0})}Z(c,V(0,X[1]+.6,12.5),V(0,Bt[0][1]-.3,12.5),.05*C,.05*C,g,j);for(const[E,ee,W,_]of Bt)Z(c,V(E,ee-.28,W),V(E,ee+.28,W),.17*C,.17*C,m,pe),h.push({p:new e.Vector3(...V(E,ee,W)),d:B,size:_>2?1:.8,sea:_>2?1:0,w:_});for(const[E,ee,W,_,oe,we,ge,Le]of[[[0,2.3,-1.5],[0,21.5,-5.6],.3,[0,4.8,-15.2],[0,31.5,5.8],[0,4.6,-14.6],[0,3.6,9.6],1],[[0,3.6,7.6],[0,15.5,5.6],.2,[0,6,1.2],[0,20.5,11.4],[0,5.9,1.7],[0,4.9,13.4],-1]]){Z(c,V(...E),V(...ee),W*C,W*C,g,j),Z(c,V(..._),V(...oe),.2*C,.2*C,g,j);const Ye=12,Ne=7,Ie=(ue,Y)=>{const K=ue/Ye,re=Y/Ne,he=Math.sin(Math.PI*K)*Math.sin(Math.PI*Math.min(1,re*1.15)),ye=I(_[1],oe[1],K)-.35,Re=I(_[2],oe[2],K),lt=I(we[1],ge[1],K)-1.6*Math.sin(Math.PI*K),Fe=I(we[2],ge[2],K),Ze=V(Le*(1.9*he+.22*Math.sin(K*23)*re),I(ye,lt,re),I(Re,Fe,re));return Ze.w=he,Ze};for(let ue=0;ue<Ye;ue++)for(let Y=0;Y<Ne;Y++){const K=[Ie(ue,Y),Ie(ue+1,Y),Ie(ue+1,Y+1),Ie(ue,Y+1)],re=c.n;for(const he of K)ke(c,he[0],he[1],he[2],x,[N.x,N.z,N.h,10+he.w]);c.i.push(re,re+1,re+2,re,re+2,re+3)}}for(let E=ce;E<c.n;E++)d.push(B);await f()}const w=$e(c),q=w.attributes.position.array,n=w.attributes.normal.array,p=w.attributes.aAnim.array,i=w.attributes.position.count,u=new Float32Array(i);await f();const A=h.filter(B=>B.w);for(let B=0;B<i;B++){B%800===799&&await f();const N=p[B*4+3]>=10,J=s[d[B]].s;let U=0;for(const C of A){if(C.d!==d[B])continue;const j=C.p.x-q[B*3],pe=C.p.y-q[B*3+1],ce=C.p.z-q[B*3+2],V=j*j+pe*pe+ce*ce,$=(n[B*3]*j+n[B*3+1]*pe+n[B*3+2]*ce)/Math.sqrt(Math.max(V,1e-4));U+=C.w*(N?.45+.55*Math.abs($):.12+.88*Math.max($,0))/(1+V*(N?.22:.075)/(J*J))}u[B]=U}w.setAttribute("aWarm",new e.Float32BufferAttribute(u,1));const P=a.swellGLSL+rt+`
attribute float aWarm; varying float vWarm, vKind; uniform vec3 uHide;      // uHide: x, z of one vessel, and 1 while she is folded away (every vertex on her pivot: no pixels)
void main(){
  vec3 P = position, Nn = normal; vL = position; vWarm = aWarm; vKind = aAnim.w;
  vec3 pv = vec3(aAnim.x, 0.0, aAnim.y);
  P = mix(P, pv, uHide.z*step(abs(aAnim.x - uHide.x) + abs(aAnim.y - uHide.y), 0.5));
  vec3 q = P - pv, fw = vec3(-sin(aAnim.z), 0.0, -cos(aAnim.z));
  float ph = aAnim.x*0.37, ang = 0.05*sin(uTime*0.62 + ph) + 0.018*sin(uTime*1.31 + ph*2.0);
  P += ang*vec3(-fw.z*q.y, fw.z*q.x - fw.x*q.z, fw.x*q.y);                                  // roll about the keel line
  P += vec3(-fw.z, 0.0, fw.x)*0.8*max(aAnim.w - 10.0, 0.0)*step(9.5, aAnim.w)*sin(uTime*0.62 + ph + 1.2);       // the lateens slat as she rolls
  P.y += msSwell(pv.xz);
`+nt,D=`
  if (vKind > 9.5) {                        // dark, thin canvas: only the foot catches the sea, the head is dusk; cloth seams
    float h = clamp((vWp.y - 3.5)/27.0, 0.0, 1.0);
    alb *= (1.0 - 0.8*h)*(0.8 + 0.2*smoothstep(0.08, 0.2, abs(fract(vL.y*0.8 + vL.z*0.3) - 0.5)));
    N = normalize(N + vec3(0.0, -0.9, 0.0));
    emi = uWarm*vWarm*0.3*(0.75 + 0.25*sin(uTime*7.0 + vL.x));
  } else if (vKind > 0.5) emi = vCol*3.4*(0.9 + 0.1*sin(uTime*9.0 + vL.z));        // lantern lens, lit panes
  else emi = uWarm*vWarm*(vCol*2.2 + 0.012);`,L={value:new e.Vector3(0,0,0)},F=new e.Mesh(w,it(t,P,D,{uMsTime:a.uniforms.uMsTime,uMsAmp:a.uniforms.uMsAmp,uWarm:t.uWarm,uHide:L},{},"uniform vec3 uWarm; varying float vWarm, vKind;"));return F.frustumCulled=!1,{mesh:F,lamps:h,hide:L}}function D0(t,a,s,f,c){const l=a.x*.37,z=.05*Math.sin(s*.62+l)+.018*Math.sin(s*1.31+l*2),g=-Math.sin(a.h),x=-Math.cos(a.h),m=t.x-a.x,y=t.y,h=t.z-a.z;return c.set(t.x+z*(-x*y),t.y+z*(x*m-g*h)+f.swellHeight(a.x,a.z,s),t.z+z*(g*y))}function W0(t,a){const s=new e.Vector3().crossVectors(a.pole,new e.Vector3(0,1,0)).normalize(),f=new e.Vector3().crossVectors(a.pole,s);f.y<0&&f.negate();const c={uTime:t.uTime,uPole:{value:a.pole},uE1:{value:s},uE2:{value:f},uBandCol:{value:a.color},uSeaCol:{value:a.sea},uEdgeD:{value:a.edge},uAmt:{value:a.amount},uPx:{value:.0024}},l=new e.Mesh(new e.SphereGeometry(1,32,16),new e.ShaderMaterial({uniforms:c,side:e.BackSide,depthWrite:!1,depthTest:!1,blending:e.AdditiveBlending,transparent:!1,fog:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }",fragmentShader:`
${st}
uniform float uTime, uPx; uniform vec3 uPole, uE1, uE2, uBandCol, uSeaCol; uniform vec4 uEdgeD; uniform vec3 uAmt;      // amount: stars, haze, horizon glow
varying vec3 vD;
float sH(vec3 p){ p = fract(p*vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y)*p.z); }
// one layer of stars: S cells per radian. Returns brightness; h3 (0..1) comes back for the tint
float starLayer(vec3 d, float S, float dens, out float tint){
  vec3 q = d*S, id = floor(q), f = fract(q) - 0.5;
  float h = sH(id), h2 = sH(id + 7.7), h3 = sH(id + 3.1), hb = sH(id + 11.3);
  float r = clamp(0.62*uPx*S, 0.07, 0.2);                                   // at least ~1.2 px across, never past its cell
  float dd = length(f - (vec3(h2, h3, sH(id + 5.3)) - 0.5)*0.6);
  float e = min(0.16/r, 2.0);
  tint = h3;
  return step(h, dens)*(0.16 + 0.84*hb*hb*hb)*(1.0 - smoothstep(0.3*r, r, dd))*e*e*(0.8 + 0.2*sin(uTime*(1.5 + 4.0*h3) + h*50.0))*(1.0 - smoothstep(0.42, 0.55, uPx*S));
}
void main(){
  vec3 d = normalize(vD);
  float x = atan(dot(d, uE2), dot(d, uE1) + 1e-5);
  if (x < -1.5708) x += 6.2832;      // (the angle's seam is turned away under the sea, off the band: at the band's foot off the port bow it cut a straight crease through the glow)
  // along the band: 0 at its foot on the starboard quarter, pi/2 at the top of the arch, 2.4 over the ring, pi at its foot off the port bow
  float lat = dot(d, uPole) + 0.03*sin(x*3.0 + 0.7) + 0.016*sin(x*7.0 + 1.0);
  float B = exp(-lat*lat/0.022) + 0.3*exp(-lat*lat/0.16);
  float core = 0.5 + 0.5*smoothstep(0.6, 2.4, x);
  vec2 bq = vec2(x*4.6, lat*17.0);
  float dl = qF3(bq + 1.3*vec2(qN(vec2(x*2.1, lat*5.0) + 7.0), qN(vec2(x*2.1, lat*5.0) + 2.0)));
  float lane = smoothstep(0.45, 0.64, dl)*exp(-lat*lat/0.008)*smoothstep(0.8, 1.4, x);        // the dark rift along the spine
  float cl = qF3(bq*0.6 + 5.0 + 0.8*vec2(qN(bq*0.31 + 1.0), qN(bq*0.31 + 4.0)));               // star clouds
  vec2 bg = vec2((x - 2.76)/0.36, lat/0.17);
  float bulge = exp(-dot(bg, bg));                                                           // the bright heart, low to the left of the ring
  float dens = (B*core + 0.8*bulge)*(1.0 - 0.8*lane)*(0.5 + 1.0*cl);
  float up = smoothstep(0.0, 0.14, d.y);
  // each layer in its own frame
  vec3 d1 = vec3(0.7071*d.x - 0.7071*d.y, 0.5*d.x + 0.5*d.y - 0.7071*d.z, 0.5*d.x + 0.5*d.y + 0.7071*d.z);
  vec3 d2 = vec3(0.3536*d.x + 0.6124*d.y + 0.7071*d.z, -0.8660*d.x + 0.5*d.y, -0.3536*d.x - 0.6124*d.y + 0.7071*d.z);
  vec3 d3 = vec3(0.8138*d.x - 0.4698*d.y + 0.3420*d.z, 0.5438*d.x + 0.8232*d.y - 0.1632*d.z, -0.2049*d.x + 0.3188*d.y + 0.9254*d.z);
  vec3 d4 = vec3(0.4330*d.x + 0.75*d.y - 0.5*d.z, -0.4356*d.x + 0.6597*d.y + 0.6124*d.z, 0.7891*d.x - 0.0474*d.y + 0.6124*d.z);
  float t0, t1, t2, t3, t4;
  float s0 = starLayer(d + 0.13, 300.0, 0.5*dens, t0), s1 = starLayer(d1 + 0.37, 210.0, 0.5*dens, t1), s2 = starLayer(d2 + 0.71, 150.0, 0.5*dens + 0.004, t2),
    s3 = starLayer(d3 + 0.29, 96.0, 0.42*dens + 0.01, t3), s4 = starLayer(d4 + 0.53, 56.0, 0.15*dens + 0.006, t4);
  float st = 0.5*s0 + 0.55*s1 + 0.65*s2 + 0.8*s3 + 0.9*s4;
  float tn = (0.5*s0*t0 + 0.55*s1*t1 + 0.65*s2*t2 + 0.8*s3*t3 + 0.9*s4*t4)/max(st, 1e-4);
  vec3 col = mix(vec3(0.78, 0.86, 1.0), vec3(1.0, 0.9, 0.8), tn*tn)*st*uAmt.x;
  // the unresolved light: violet-grey, a little warmer in the heart, mottled, cut by the rift
  float glow = (0.04*B*core*(0.45 + 1.1*cl) + 0.034*bulge*(0.6 + 0.8*cl))*(1.0 - 0.72*lane);
  col += mix(uBandCol, vec3(0.92, 0.84, 0.86), 0.5*bulge)*(glow*uAmt.y);
  col *= up;
  float el = max(d.y, 0.0);
  float ef = mix(1.0, smoothstep(-0.30, 0.34, dot(d.xz/max(length(d.xz), 1e-3), uEdgeD.xy)), uEdgeD.w);      // (the same wide falling-off as the sea's far field in SEA_FS)
  col += uSeaCol*(uAmt.z*ef*(0.36*exp(-el/0.018) + 0.09*exp(-el/0.075)));
  gl_FragColor = vec4(col, 1.0);
}`}));return l.frustumCulled=!1,l.renderOrder=-.9,l.scale.setScalar(3e3),l.userData.uPx=c.uPx,l}function I0(t,a,s,f,c){const l=c*6,z=new e.InstancedBufferGeometry;z.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),z.setIndex([0,1,2,0,2,3]);const g=new Float32Array(l*4),x=new Float32Array(l*4);for(let y=0;y<l;y++){const h=a.range(0,6.283),d=Math.floor(y/c),w=d%2,q=Math.pow(a(),1.3),n=a()<(w?.12:.17),p=(w?3.5:4.5)+(w?5.5:7.5)*q,i=(w?.75:.42)+a.range(-.14,.2);g.set([Math.cos(h),Math.sin(h),p*i*(n?.5:1),p*(n?.55:1)],y*4),x.set([a.range(0,w?.3:1.5)*(.4+.6*(1-q)),n?-a.range(1.3,w?2.4:3):a.range(.07,.19),a(),d],y*4)}z.setAttribute("iA",new e.InstancedBufferAttribute(g,4)),z.setAttribute("iB",new e.InstancedBufferAttribute(x,4)),z.instanceCount=l;const m=new e.Mesh(z,new e.ShaderMaterial({uniforms:{uSpl:s,uSplV:f,uBlue:t.uBlue},transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,vertexShader:`
attribute vec4 iA, iB;
uniform vec4 uSpl[6]; uniform vec4 uSplV[6];
varying vec2 vC; varying vec3 vA; varying float vY;
vec3 fly(vec4 S, vec4 D, float a, float k){
  vec3 v = vec3(iA.x*iA.z + D.x*D.z*(0.4 + 0.6*iB.z), iA.w, iA.y*iA.z + D.y*D.z*(0.4 + 0.6*iB.z))*sqrt(S.w);
  vec3 P = vec3(S.x, 0.3, S.y) + vec3(iA.x, 0.0, iA.y)*S.w*1.5*iB.z + v*a*(1.0 - 0.18*k);
  P.y = max(P.y - 4.9*a*a, 0.12);
  return P;
}
void main(){
  int si = int(iB.w + 0.5);
  vec4 S = uSpl[si], D = uSplV[si];
  float mist = step(iB.y, 0.0), size = abs(iB.y), lv = 1.0 - mod(iB.w, 2.0);        // lv: 1 at the two sites where a whale leaves the sea
  float a = S.z - iB.x, life = mix(1.9 + 2.2*iB.z, 3.6 + 1.5*iB.z, mist), k = clamp(a/life, 0.0, 1.0);
  float alive = step(0.0, a)*step(a, life);
  vec3 P = fly(S, D, a, k), P2 = fly(S, D, a + 0.05, k);
  vec4 mv = viewMatrix*vec4(P, 1.0), mv2 = viewMatrix*vec4(P2, 1.0);
  vec2 dv = mv2.xy - mv.xy; float dl = length(dv);
  vec2 ax = dl > 1e-4 ? dv/dl : vec2(0.0, 1.0), sd = vec2(ax.y, -ax.x);      // (sd, ax) right-handed: the quad keeps facing the lens
  float sz = size*sqrt(S.w)*mix(0.8 + 0.5*k, 0.7 + 1.6*k, mist)*alive;
  float stretch = mix(1.0 + min(dl*9.0, 3.2), 1.0, mist);                   // a droplet is a streak along its flight
  vec2 off = (sd*position.x + ax*position.y*stretch)*sz;
  mv.xy += off;
  vC = position.xy;
  vY = P.y + off.x*viewMatrix[1][0] + off.y*viewMatrix[1][1];      // this corner's height above the sea
  vA = vec3(alive*smoothstep(0.0, 0.05, k)*(1.0 - k)*mix(0.95*smoothstep(0.12, 0.5, P.y), (0.2 + 0.28*lv)*(1.0 - 0.5*k), mist), clamp(P.y/(9.0*sqrt(S.w)), 0.0, 1.0), mist);
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
uniform vec3 uBlue;
varying vec2 vC; varying vec3 vA; varying float vY;
void main(){
  float r2 = dot(vC, vC), core = exp(-r2*mix(5.5, 2.6, vA.z)), al = vA.x*core*(1.0 - smoothstep(0.7, 1.0, r2));
  al *= mix(1.0, smoothstep(0.0, 1.1, vY), vA.z);      // the mist thins into the water: the sea never cuts a veil along a straight line (seen from 7 m up beside the bull)
  vec3 c = mix(uBlue*1.25, vec3(0.86, 0.97, 1.0), 0.25 + 0.5*vA.y*vA.y);          // lit blue from below, paling as it climbs out of the light
  gl_FragColor = vec4(c*(mix(2.9, 1.9, vA.z)*al), mix(0.7, 0.5, vA.z)*al);      // brighter than the sea that lights it: the droplets glitter
}`}));return m.frustumCulled=!1,m.renderOrder=5,m}var O0={id:"milky-sea",name:"The Milky Sea",category:"ocean",weirdness:.3,media:["air","underwater"],async build(t){const{rng:a}=t,s=t.quality?.detail??1,f=t.vary||{},c=f.density??1,l=Nt[Math.min(Nt.length-1,Math.floor(a()*Nt.length))],z=f.hour==="dawn",g=!!f.rare,x=l.pal.map(o=>new e.Color(o)),m=new e.Scene,y=l.pal.slice();y[4]=l.dusk;const h=await g0(t,{palette:y,sea:!1,contact:!0});m.add(h.object);const d=h.anchors;await t.yield();const w=16,q=[[-73+w*.5,-12,128.1-w*.866],d.viewpoints.underKeel,...d.flyThrough],n=t.core.makeRng("milky-sea-extras:"+t.seed),p=o=>t.core.makeRng(t.core.hashSeed("milky-sea-"+o+":"+t.seed)),i=v0(q),u=i.length+w,A=o=>(o*u-w)/i.length;await t.yield();let P=.15,D=.3;const L=new e.Vector3,F=new e.Vector3;for(let o=0;o<24;o++){const r=(P+D)/2;i.pointAt(r,L).y<0?P=r:D=r}const B=(P+D)/2,N=o=>{const r=i.points[o],v=i.length;let b=0,M=1/0;for(let T=0;T<=v;T+=.5){const G=i.posAtDist(T,L).distanceToSquared(r);G<M&&(M=G,b=T)}let S=Math.max(0,b-.5),k=Math.min(v,b+.5);for(let T=0;T<24;T++){const G=S+(k-S)/3,ie=k-(k-S)/3;i.posAtDist(G,L).distanceToSquared(r)<i.posAtDist(ie,L).distanceToSquared(r)?k=ie:S=G}return(S+k)/2/v},J=(o,r,v)=>{let b=N(r),M=N(v);const S=Math.sign(i.pointAt(b,L).z-o);for(let k=0;k<30;k++){const T=(b+M)/2;Math.sign(i.pointAt(T,L).z-o)===S?b=T:M=T}return(b+M)/2},U=[-14,3,19],C=42.3,j=Math.PI/180,pe=N(9),ce=N(18);await t.yield();const V=J(U[0],17,18);await t.yield();const $={value:0},R={value:0},ve={value:new e.Vector2(800,450)},X={uTime:$,uGlow:h.uniforms.uMsGlow,uSkyFill:h.uniforms.uMsSky,uBlue:{value:new e.Color("#62B6FF")},uWarm:h.uniforms.uMsWarm},Pe=x[0].clone().multiplyScalar(.87),E=x[2].clone().lerp(x[1],.1),ee=E.clone().lerp(Pe,.6).multiplyScalar(l.haze?.95:.8),W={color:new e.Color(l.haze?"#12302E":"#0A1E1E"),density:l.haze?.0032:.0019},_={color:x[1].clone().lerp(x[2],.45).multiplyScalar(.4),density:.005};_.color.r*=.8,_.color.b*=1.25;const oe=new e.Color("#020208"),we=new e.Color("#010504");m.fog=new e.FogExp2(W.color.clone(),W.density),m.background=oe.clone(),m.add(new e.HemisphereLight("#0A0A1E","#7FE0BE",1.6));const ge="#"+x[0].clone().lerp(x[1],.45).getHexString();await t.yield();const Le={sunDir:[0,-1,0],sunColor:ge,sunIntensity:2.2,sky:"#0A0A1E",skyIntensity:.25,ground:ge,groundIntensity:2.4},Ye={sunDir:[0,1,0],sunColor:ge,sunIntensity:1,sky:ge,skyIntensity:.7,ground:"#03100e",groundIntensity:.4},Ne=w0({rng:a,preset:"night",bodies:[],key:"sun",clouds:!1,clouds2:!1,zenith:l.pal[3],mid:l.pal[3],horizon:l.horizon,ground:l.edge?"#020406":ee,horizonPow:l.haze?9:l.edge?7:16,groundFalloff:90,stars:l.haze?.5:1,twinkle:.45,milkyWay:0,milkyAxis:[.906,0,-.423],milkyAngle:148,milkyColor:"#8a86a0",milkyCore:"#b4acc4",scatter:z?.8:0,scatterColor:"#16324A",scatterPow:1.2,scatterHigh:0,scatterFall:16,sunAzimuth:180,sunElevation:-8,sunIntensity:0,sunGlow:0,bake:!0,bakeSize:512,renderer:t.renderer});m.add(Ne.object),await t.yield();const Ie=pt.makeShootingStars({rng:n.fork("met"),time:$,count:9,period:[6,15],duration:1.4,minElevation:.22,intensity:2.4,color:"#e6f2ff",tailColor:"#8fb4c4"});m.add(Ie.object),await t.yield();const ue=a.range(0,6.283),Y={uTime:$,uMsTime:h.uniforms.uMsTime,uMsAmp:h.uniforms.uMsAmp,uPattern:{value:l.pattern},uRadius:{value:2e4},uStroke:R,uUnder:{value:0},uBright:{value:Pe},uLane:{value:E},uFar:{value:ee},uPortalCol:{value:new e.Color(l.portal).multiplyScalar(1.15)},uUFog:{value:new e.Vector4(_.color.r,_.color.g,_.color.b,_.density)},uEdge:{value:new e.Vector4(6152,-6152,9e3,l.edge)},uBoat:{value:new e.Vector4(-17,-92,1,0)},uSwim:{value:new e.Vector4(16,-46,.25,0)},uSwimK:{value:new e.Vector4(l.cast==="manta"?1:0,0,0,0)},uPortal:{value:new e.Vector4(d.portalSeat.position.x,d.portalSeat.position.y,d.portalSeat.position.z,d.portalSeat.radius)},uWheel:{value:new e.Vector4(300,-260,g?1:0,0)},uWind:{value:new e.Vector2(Math.cos(ue),Math.sin(ue))},uOff:{value:new e.Vector2(a.range(-4e3,4e3),a.range(-4e3,4e3))},uDh:{value:[0,1,2,3,4,5].map(()=>new e.Vector4)},uBlue:X.uBlue,uWarm:X.uWarm,uTrough:{value:x[1].clone().lerp(new e.Color("#3E9FD0"),.42).multiplyScalar(.62)},uLamp:{value:[0,1,2,3,4,5,6,7].map(()=>new e.Vector4(0,5,0,0))},uSpl:{value:[0,1,2,3,4,5].map(()=>new e.Vector4(0,0,-1,1))}},K=[{x:-62,z:-296,h:2.25,s:1},{x:152,z:-402,h:-.85,s:1.12},{x:-171,z:-16,h:.45,s:1.05},{x:72,z:22,h:-.52,s:1.4},{x:50,z:150,h:-.9,s:1.15},{x:66,z:-6,h:-.3,s:.45}];K.forEach((o,r)=>{const v=r<3?1:o.s;Y.uDh.value[r].set(o.x,o.z,Math.cos(o.h)/v,Math.sin(o.h)/v)}),await t.yield();const re=A0(h,Y);m.add(re),await t.yield();const he=S0(Y);he.visible=!1,m.add(he),await t.yield();const ye=await V0(X,h,K,()=>t.yield());m.add(ye.mesh),ye.hide.value.set(K[4].x,K[4].z,0),await t.yield();const Re=W0(X,{pole:new e.Vector3(.472,-.817,-.331).normalize(),color:new e.Color("#b9b4d6"),sea:Pe.clone(),edge:new e.Vector4(.7071,-.7071,0,l.edge),amount:new e.Vector3(l.haze?.7:1,l.haze?.85:1,l.haze?.75:1)});m.add(Re),await t.yield();const lt=l.cast==="manta",Fe=lt?N0(X):P0(X);l.cast!=="manta"&&Fe.scale.setScalar(1.25),m.add(Fe),await t.yield();const Ze=i.pointAt(0,new e.Vector3),_e=i.tangentAt(0,new e.Vector3);_e.y=0,_e.normalize();const Tt=new e.Vector3(_e.z,0,-_e.x),Ge=lt?{a0:36,v:3.4,s0:10,s1:6.5,y0:-9.2,y1:-11.6}:{a0:33,v:3.6,s0:13,s1:6,y0:-8.5,y1:-12.3},wt=(o,r)=>{const v=Ge.a0+Ge.v*o,b=I(Ge.s0,Ge.s1,ne(0,3.8,o));return r.set(Ze.x+_e.x*v+Tt.x*b,I(Ge.y0,Ge.y1,ne(.4,3.6,o))+1.6*ne(5.5,8,o),Ze.z+_e.z*v+Tt.z*b)},Ae=new e.Vector3,Oe=new e.Vector3,Kt=new e.Vector3;Fe.rotation.order="YXZ",m.add(F0(X,a.fork("squid"),i,Math.max(24,Math.round(60*c*s)))),await t.yield();const Ee=Ce.makeFauna(m,{});Ee.add(Ce.makeFishSchool({rng:a.fork("cloud"),species:"mackerel",form:"baitball",count:Math.max(180,Math.round(480*c*s)),size:2.4,spread:[8.5,2.8],center:[-8,-5.6,9],top:"#2c5246",belly:"#101a18",fin:"#0a1212",spec:0,caustics:0,light:Ye}),{light:!1,always:!0}),await t.yield();const gt=pt.makeParticles({rng:a.fork("snow"),preset:"dust",count:Math.round(1500*s),box:[30,20,34],size:[.035,.13],colors:["#9fd8c4","#cdeee2","#6aa894"],intensity:.8,opacity:.8,additive:.5,velocity:[.05,-.2,.02],twinkle:.15,time:$});m.add(gt.object),await t.yield();const Ct={top:"#b4ecd6",belly:"#14302a",fin:"#0e1a18",spec:.12,caustics:0,light:{...Ye,sunIntensity:2.4,skyIntensity:1}};Ee.add(Ce.makeFishSchool({rng:n.fork("ball"),species:"sardines",count:Math.max(600,Math.round(1600*c*s)),size:3.4,spread:[10.5,7.5],center:[-27.7,-22,75.7],spin:1.1,...Ct}),{light:!1,always:!0}),await t.yield(),Ee.add(Ce.makeFishSchool({rng:n.fork("river"),species:"mackerel",count:Math.max(240,Math.round(640*c*s)),size:1.9,spread:[9,3,190],speed:3.4,route:[[-72,-20,120],[-46,-20,84],[-30,-18.5,58],[-15,-16,34],[2,-15,24],[12,-18,46],[-6,-23,76],[-34,-27,112],[-60,-24,130]],closed:!0,...Ct}),{light:!1,always:!0}),await t.yield();for(const o of[{position:[-48,-.4,88],radius:62,count:30,length:36,width:[1.4,5.5],intensity:.42},{position:[-30,-.4,64],radius:150,count:26,length:64,width:[5,16],intensity:.3}]){const r=pt.makeGodRays({rng:n.fork("rays"),time:$,direction:[.1,-1,-.06],color:ge,falloff:1.2,speed:.8,near:[.8,3.5],fogAmount:.7,...o});r.object.frustumCulled=!1,m.add(r.object),await t.yield()}const fe=new e.Vector3(-17,0,-92),Xe=[{x:-26.5,z:46.5,r:3.4},{x:-46,z:105,r:6.5},{x:-49.7,z:69,r:5},{x:-33.5,z:28,r:4},{x:-12.5,z:30,r:3.2},{x:-26.5,z:22,r:5},{x:19,z:-112,r:6},{x:-34,z:-134,r:5}],Qe=a.fork("weed"),jt=Math.round(20*c),$t=[[-80,-290],[152,-402],[-168,6],[176,58]];for(let o=0;o<400&&Xe.length<jt;o++){const r=Qe.range(0,6.283),v=Qe.range(40,250),b=Math.cos(r)*v,M=Math.sin(r)*v,S=Qe.range(3,12)*(Qe()<.6?.6:1);i.distanceTo(b,0,M)<S+9||Math.abs(b)<14+S&&Math.abs(M+8)<48+S||Math.abs(b-2)<48+S&&M<-28||$t.some(k=>Math.hypot(k[0]-b,k[1]-M)<34+S)||Math.abs(b-fe.x)<8+S&&M>fe.z-10&&M<fe.z+70||Xe.some(k=>Math.hypot(k.x-b,k.z-M)<k.r+S+6)||Xe.push({x:b,z:M,r:S})}for(const o of Xe)for(const r of K){const v=o.x-r.x,b=o.z-r.z,M=Math.hypot(v,b),S=26*r.s+o.r;if(M<S){const k=S/Math.max(M,1);o.x=r.x+v*k,o.z=r.z+b*k}}await t.yield(),m.add(T0(X,h,Qe,Xe,Math.round(26*s))),await t.yield();const He=C0(X,R);He.position.copy(fe),m.add(He),await t.yield(),m.add(L0(X,d.hawse,new e.Vector3(fe.x,.5,fe.z+4.05),R,ve)),await t.yield();const Je=pt.makeGlows({rng:n.fork("glow"),time:$,positions:[...ye.lamps.map(o=>o.p),new e.Vector3(fe.x,1.8,fe.z-3.9)],sizes:[...ye.lamps.map(o=>o.size*K[o.d].s),.5],color:"#ffb056",size:5.5,intensity:2.6,flicker:.18,minAngle:.006,fogAmount:.5});Je.object.frustumCulled=!1,m.add(Je.object),await t.yield(),i.tangentAt(B,F),i.pointAt(B,L);const be=[{u:B-.008,origin:[L.x,L.z],forward:Math.atan2(F.x,-F.z)-.4,n:120,fan:[0,.48],lat:[0,7],ahead:[8,18],spreadT:1,both:!1}];for(const o of[.8,.835,.862,.885,.905,.925,.945]){const r=A(o);i.pointAt(r,L);const v=o>.82&&o<.9;be.push({u:r,origin:[0,L.z],forward:0,n:v?40:26,fan:[.5,.95],lat:v?[3,9]:[4,9],ahead:o>.9?[10,16]:v?[10,24]:[13,24],spreadT:.6,both:!0})}const yt=B0(X,h,a.fork("fish"),be);m.add(yt.mesh),await t.yield();const bt=13,Lt=i.points[20],Be=[{u:.703,apex:[26,6.5,-54],dir:[-.92,0,.38],len:18.5,span:80,sag:34,size:[1.9,2.5],bow:-8,bank:100},{leave:V,wait:0,apex:[-37,3.6,-120],dir:[-1,0,-.12],len:13,span:66,sag:29,size:[1.45,1.9],bow:0,bank:18},{leave:C/H,apex:[Lt.x+22,7.2,Lt.z-34],dir:[-Math.cos(30*j),0,Math.sin(30*j)],len:15.5,span:68,sag:31,size:[1.25,1.3],bow:-6,bank:80}];for(const o of Be)o.h0=Math.sqrt(o.apex[1]/(4*o.sag))*o.span,o.up=(o.h0+.45*o.len)/(bt*H),o.down=(o.h0-.2*o.len)/(bt*H),o.wait!==void 0&&(o.leave=o.leave+Be[o.wait].up+Be[o.wait].down),o.u===void 0?o.u=o.leave+o.up:o.leave=o.u-o.up,o.back=o.u+o.down;const ae={booby:{size:1.3,n:10,n2:4,s2:.9},tern:{size:.85,n:16,n2:0,s2:.8},tropic:{size:1,n:8,n2:6,s2:1.25}}[l.birds],Yt={body:"#f4f4ee",belly:"#ffffff",wingC:"#ecece6",trail:"#17171b",tip:"#0e0e12",head:"#f4f4ee",beak:"#d8c860",tailC:"#141418"},Ve=o=>Ee.add(Ce.makeFlock({species:"gulls",light:Le,...Yt,...o}),{light:!1,always:!0}),ct=[],Et=.25;for(let o=0;o<i.length;o+=Et)ct.push(i.posAtDist(o,new e.Vector3));ct.push(i.posAtDist(i.length,new e.Vector3));const xt=Ce.BIRD_PRESETS.gulls,Vt=2.3+Et/2,zt=(.5*xt.girth+xt.span)*1.12,Zt=1.45*1.25,Dt=.4,Wt=(o,r,v,b,M)=>{let S=1/0;const k=Vt+M;for(const T of ct){const G=Math.max(0,v-T.y,T.y-b);G<k&&(S=Math.min(S,Math.hypot(T.x-o,T.z-r)-Math.sqrt(k*k-G*G)))}return S},Xt=(o,r,v,b)=>{let M=1/0;const S=Vt+b;for(const k of ct){const T=Math.max(0,Math.hypot(k.x-o,k.z-r)-v);T<S&&(M=Math.min(M,k.y-Math.sqrt(S*S-T*T)))}return M},It=(o,r)=>({radius:o/10,wobble:0,height:0,spread:[0,r,0],soarRadius:.9*o/Zt,soarLift:r,wander:[.6,Dt,.6,xt.wander[3]]}),et=o=>2*o+Dt;Ve({rng:a.fork("b1"),form:"soar",count:Math.max(5,Math.round(ae.n*c)),size:ae.size,center:[-3,40,-4],...It(Wt(-3,-4,40-et(1.5),40+et(1.5),ae.size*zt),1.5)}),await t.yield(),ae.n2&&Ve({rng:a.fork("b2"),form:"soar",count:ae.n2,size:ae.s2,center:[4,45,10],...It(Wt(4,10,45-et(1),45+et(1),ae.s2*zt),1),trail:"#d8d8d2",tip:"#2a2a30"}),await t.yield();const Qt=a.fork("b4");Ve({rng:n.fork("b5"),count:5,size:ae.size*1.15,form:"loose",spread:[5,1.6,7],maxSigma:3,wander:[.7,.4,.7,.3],cross:{path:i,u:.243,lead:15,angle:62,side:-1,height:5.5,span:150,duration:H}}),await t.yield(),l.cast==="dolphin"&&Ee.add(Ce.makeDolphins({rng:a.fork("dol"),count:6,center:[-50,-.6,-52],radius:17,height:0,level:0,top:"#06090a",belly:"#121a1c",fin:"#06090a",light:Le}),{light:!1,always:!0}),await t.yield();const qt=(o,r)=>({length:i.length,posAtDist:(v,b)=>b.copy(o),tangentAtDist:(v,b)=>b.copy(r)});{const o=new e.Vector3(12,15,U[1]),r=K[3],v=new e.Vector3(r.x-r.s*Math.sin(r.h)*5.6,r.s*21.5,r.z-r.s*Math.cos(r.h)*5.6),b=v.distanceTo(o)/4,M=b/10,S=1.45*1.25,k=1.5,T=(o.x+v.x)/2,G=(o.z+v.z)/2,ie=Math.min(v.y,Xt(T,G,b,ae.size*1.2*zt)-et(k));Ve({rng:n.fork("b6"),form:"soar",count:3,size:ae.size*1.2,center:[T,ie,G],radius:M,wobble:0,height:0,spread:[0,k,0],wander:[.6,.4,.6,.3],soarRadius:(b-M)/S,soarLift:k})}await t.yield();{const o=K[4],r=-5.6,v=Bt[0][2],b=31.5,M=21,S=o.s*(r+v)/2,k=3,T=1,G=1.5;Ve({rng:p("b7"),form:"soar",count:3,size:ae.size*1.3,center:[o.x+Math.sin(o.h)*S,o.s*b+k+G+1.2*T+1,o.z+Math.cos(o.h)*S],radius:o.s*(v-r)/2,height:T,spread:[o.s*3.5,G,o.s*3.5],soarRadius:o.s*M/2,soarLift:k})}await t.yield(),Ve({rng:p("b8"),count:5,size:ae.size*1.5,form:"loose",spread:[4,1.4,7],wander:[.6,.4,.6,.3],cross:{path:qt(new e.Vector3(18,38,U[2]),new e.Vector3(0,0,-1)),u:pe,lead:0,angle:0,side:1,height:0,span:170,bow:0,duration:H}}),await t.yield();{const r=[[1.3,.4,0],[-1.3,-.35,.9],[-3.6,.25,-1.1]],v=new e.Vector3,b=(O,qe,te,se)=>{const Ke=i.posAtDist(O*i.length+qe,new e.Vector3),Te=i.tangentAtDist(O*i.length+qe,new e.Vector3);Te.y=0,Te.normalize();const dt=se*j,Pt=new e.Vector3(Te.x*Math.cos(dt)+Te.z*Math.sin(dt),0,Te.z*Math.cos(dt)-Te.x*Math.sin(dt));return Ke.y+=te,{u:O,P:Ke,d:Pt,bx:new e.Vector3(-Pt.z,0,Pt.x)}},M=(O,qe,te,se,Ke,Te=1)=>Ve({count:1,form:"loose",spread:[0,0,0],wander:[.25,.15,.25,.3],...se,cross:{path:qt(O.P.clone().addScaledVector(O.d,r[qe][0]).addScaledVector(O.bx,r[qe][2]-te).setY(O.P.y+r[qe][1]*Te),O.d),u:O.u,lead:0,angle:0,side:1,height:0,span:150,bow:te,duration:H,...Ke}}),S=10.5,k=b(30/H,7,-.3,50),T={size:1.15,speed:S,bank:17,head:"#24242b",beak:"#f2c64a",trail:"#0c0c10",tip:"#060608"},G=(i.pointAt(31/H,v).y-i.pointAt(30/H,L).y)*150/S;M(k,0,-12,{rng:Qt,...T},{rise:G},.4),await t.yield(),M(k,1,-12,{rng:p("b4b"),...T},{rise:G},.4),await t.yield();const ie=b(ce,10,.5,-18);i.tangentAt(ce,v);const at=v.y/Math.hypot(v.x,v.z)*150;for(let O=0;O<3;O++)M(ie,O,-10,{rng:p("fl1"+O),size:ae.size*1.3,speed:10,bank:12},{rise:at}),await t.yield();const ze=d.portalSeat,Ue={u:Be[2].u,P:new e.Vector3(ze.position.x,ze.position.y+ze.radius,ze.position.z+4*ze.radius),d:new e.Vector3(-1,0,0),bx:new e.Vector3(0,0,-1)};for(let O=0;O<3;O++)M(Ue,O,-12,{rng:p("fl2"+O),size:1.45+.3*ae.size,speed:11,bank:17},{}),await t.yield()}const Mt=[],Rt={value:[]};for(let o=0;o<Be.length;o++){const r=Be[o],v=new e.Vector3(...r.dir).normalize(),b=new e.Vector3(-v.z,0,v.x),M=r.h0,S=new e.Vector3(...r.apex).addScaledVector(b,-r.bow),k=new e.Vector3(...r.apex).addScaledVector(b,-4*r.bow*(M/r.span)**2),T=Ce.makeWhale({rng:o<2?n.fork("whale"+o):p("whale"+o),length:r.len,speed:bt,bank:r.bank,top:"#1d3436",belly:"#c4e4d8",glow:"#8cc8ff",glowIntensity:.9,caustics:0,light:Le,cross:{path:qt(S,v),u:r.u,lead:0,angle:0,side:1,height:0,span:r.span,sag:-r.sag,bow:r.bow,duration:H}});{const G=T.geometry.getAttribute("iTint");for(let ie=0;ie<G.array.length;ie++)G.array[ie]=Math.min(G.array[ie],1)}Ee.add(T,{light:!1,always:!0}),Mt.push(r.leave,r.back),Y.uSpl.value[o*2].set(k.x-v.x*M,k.z-v.z*M,-1,r.size[0]),Y.uSpl.value[o*2+1].set(k.x+v.x*M,k.z+v.z*M,-1,r.size[1]),Rt.value.push(new e.Vector4(v.x,v.z,8.5,0),new e.Vector4(v.x,v.z,6.5,0)),await t.yield()}m.add(I0(X,n.fork("spray"),Y.uSpl,Rt,Math.round(440*(.6+.4*s)))),await t.yield();const kt=E0(X,ve,Pe,x[1].clone().lerp(x[2],.5).multiplyScalar(.8));m.add(kt.mesh),await t.yield();const _t=new e.Vector3(-4,5,-6),Jt=new e.Vector3,ht=Math.PI/180,e0=new e.Vector3(K[3].x,13,K[3].z),t0=h.center.clone().setY(22),o0=new e.Vector3(Be[0].apex[0]-8,15,Be[0].apex[2]-6),a0=new e.Vector3(-3,10,-146),s0=new e.Vector3(0,7.2,-146),Se=new e.Vector3,xe=new e.Vector3,n0=new e.Vector3,r0=new e.Vector3,de=[0,0],De=(o,r,v)=>Me((o-r)/(v-r),0,1),Gt=(o,r)=>I(o,o*o*(3-2*o),r),tt=o=>{xe.copy(o).sub(Se),de[0]=Math.atan2(xe.z,xe.x),de[1]=Math.atan2(xe.y,Math.hypot(xe.x,xe.z))},Ot=(o,r,v)=>o.set(Se.x+Math.cos(r)*Math.cos(v)*100,Se.y+Math.sin(v)*100,Se.z+Math.sin(r)*Math.cos(v)*100),ft=o=>o-2*Math.PI*Math.round(o/(2*Math.PI)),i0=(o,r)=>{i.pointAt(Me(r,0,1),Se);let v=-62*ht,b=I(25,14,De(r,.215,.255))*ht;if(tt(e0),v+=Math.pow(De(r,.245,.365),.85)*ft(de[0]-v),b=I(b,de[1],De(r,.255,.365)),r>.367){tt(t0);let M=de[0]-v;for(;M<0;)M+=2*Math.PI;const S=Gt(De(r,.367,.432),.25);v+=S*M,b=I(b,de[1],S)}if(r>.545){xe.set(Se.x*.3,Se.y-36,Se.z-78),tt(xe);const M=Gt(De(r,.545,.6),1);v+=M*ft(de[0]-v),b=I(b,de[1],M)}if(r>.63){tt(o0);const M=De(r,.63,.695);v+=M*ft(de[0]-v),b=I(b,de[1],M)}if(r>.7){xe.copy(a0).lerp(s0,ne(.8,.9,r)),tt(xe);const M=De(r,.7,.84);v+=(1-Math.pow(1-M,2.5))*ft(de[0]-v),b=I(b,de[1],1-Math.pow(1-M,1.8))}return Ot(n0,v,b)},ot=[-21.3,13.4,-3.2,11.4,3.1,10.2,7.7,9,12.2,8,16.4,6.9,20.3,5.8,24.1,4.7,27.8,3.7,30.5,2.8,33.2,1.9,35.9,1.1,38.7,.2,41.5,-.6,44.4,-1.4,47.3,-2.2,50.2,-2.8,53.1,-3.4,55.8,-3.8,58.5,-4.2,65.7,-2.4,72.7,-.6,78.2,.4,80.5,1.2,82,1.9,82.8,2.4,83,2.9,82.6,3.2,82,3.5,81.3,3.6,80.8,3.7,80.8,3.7,81.5,3.6,83.2,3.4,85.8,3.1,90.5,2.6,95.7,1.9,100.6,1.2,105.1,.4,109.1,-.3,113.1,-.8,117.3,-1.2,122.1,-1.3,127.8,-1.2,134.6,-.9,142.2,-.7,150.4,-.5,158.9,-.3,167.5,-.2,176.2,-.7,185,-1.2,193.6,-1.6,202.4,-2,211.2,-2.3,220.1,-2.6,229.2,-2.8,238.5,-2.9,248,-2.8,248.8,-2.7,249.9,-2.4,251.2,-2.2,252.6,-2.2,253.8,-2.3,255,-2.8,256.3,-3.4,257.6,-4.2,259,-5.1,260.6,-6,262.5,-6.7,262.4,-7.5,262.4,-8.2,262.4,-9,262.5,-9.8,262.7,-10.6,263,-11.4,263.3,-12.1,263.5,-12.8,263.7,-13.5,263.7,-14.2,263.7,-14.9,263.6,-15.5,263.4,-16.2,263.3,-16.8,263.1,-17.4,263,-17.9,262.8,-18.4,262.7,-18.8,262.5,-19,262.4,-19.1,262.3,-19.1,262.3,-18.9,262.2,-18.6,262.1,-18.2,262.1,-17.6,262.1,-17,262.1,-16.4,262.2,-15.7,262.3,-15.1,262.5,-14.4,262.7,-13.7,263,-12.9,263.3,-12.2,263.6,-11.5,263.9,-10.8,264.2,-10.2,264.5,-9.5,264.9,-8.8,265.2,-8.1,265.5,-7.4,265.8,-6.7,266.1,-6,266.4,-5.3,266.7,-4.7,267,-4,267.4,-3.4,267.7,-2.8,267.9,-2.3,268.2,-1.8,268.5,-1.4,268.7,-1,269,-.7,269.3,-.5,269.5,-.4,269.6,-.3,269.8,-.2,270,-.1],l0=.26,c0=.005;await t.yield();const h0=(o,r)=>{i.pointAt(Me(r,0,1),Se);const v=Me((r-l0)/c0,0,ot.length/2-1.001),b=Math.floor(v),M=v-b;return Ot(r0,I(ot[b*2],ot[b*2+2],M)*ht,I(ot[b*2+1],ot[b*2+3],M)*ht)},At=()=>({at:h0,from:.262,to:.88,weight:1,fade:.02/.618}),f0=[{at:(o,r)=>Jt.copy(_t).lerp(d.mainTop,ne(.15,A(.218),r)),from:.02,to:A(.32),weight:.6,fade:.167},{at:(o,r)=>wt(r*H,Kt).lerp(_t,.5*ne(.085,.125,r)),from:.03,to:.125,weight:.55,fade:.37},At(),At(),At(),{at:i0,from:.215,to:1.2,weight:1,fade:.035/.985}];await Ne.prewarm(t.renderer,null,m),await t.yield();const d0=new e.Vector3,Q=new e.Vector3,St=new e.Vector2,p0=Math.atan2(260,-300),u0=Math.hypot(300,260);let Ht=null;function m0(o,r,v,b){$.value=r;const M=b*H;h.update(o,r,v),t.renderer&&(t.renderer.getDrawingBufferSize(St),ve.value.copy(St));const S=d0.setFromMatrixPosition(v.matrixWorld),k=S.y<h.swellHeight(S.x,S.z,r);Y.uUnder.value=k?1:0,ye.hide.value.z=k?1:0,k!==Ht&&(Ht=k,m.fog.color.copy(k?_.color:W.color),m.fog.density=k?_.density:W.density,m.background.copy(k?we:oe),Ne.object.visible=!k,Re.visible=!k,he.visible=k,gt.setOpacity(k?.85:0)),he.position.copy(S),Re.position.copy(S),Ne.update(o,r,v),Re.userData.uPx.value=2/(Math.max(v.projectionMatrix.elements[5],.1)*Math.max(St.y,1)),Fe.visible=M<7.8,wt(M,Ae),wt(M+.25,Oe),Fe.position.set(Ae.x,Ae.y+.25*Math.sin(r*.4),Ae.z),Fe.rotation.set(Math.atan2(Ae.y-Oe.y,Math.hypot(Oe.x-Ae.x,Oe.z-Ae.z)),Math.atan2(Oe.x-Ae.x,Oe.z-Ae.z),0);const T=b>0?(b*i.length+w)/u*H:0;Y.uSwim.value.set(16.5-.1*(T-28),-46-.4*(T-28),.25+.1*Math.sin(r*.2),ne(17,23,T));const G=yt.uniforms.uBurstA.value,ie=yt.uniforms.uBurstB.value;G.set((b-be[0].u)*H,(b-be[1].u)*H,(b-be[2].u)*H,(b-be[3].u)*H),ie.set((b-be[4].u)*H,(b-be[5].u)*H,(b-be[6].u)*H,(b-be[7].u)*H),R.value=r*28/60;const at=R.value*6.2832;if(He.position.set(fe.x,h.swellHeight(fe.x,fe.z,r)+.03*Math.sin(at),fe.z-.22*Math.sin(at-.6)),He.rotation.set(.03*Math.sin(at+.5),0,.045*Math.sin(r*1.3)),g){const te=r*6.2832/8;Y.uWheel.value.w=te;const se=(te-12*p0-u0/220)/6.2832+.5,Ke=se-Math.floor(se);h.setGlowWave(.45,-.4+1.8*Ke)}const ze=(b-B)*H,Ue=v.matrixWorld.elements,O=Me(-Ue[9]/Math.max(Math.hypot(Ue[8],Ue[9],Ue[10]),1e-6),-.95,.95);kt.mesh.visible=b>0&&ze>-.14&&ze<.72,kt.uniforms.uSheet.value.set(ze,ne(-.13,-.07,ze),.5-.5*(O/Math.sqrt(1-O*O))*v.projectionMatrix.elements[5]);const qe=Y.uLamp.value;for(let te=0;te<ye.lamps.length;te++){const se=ye.lamps[te];D0(se.p,K[se.d],r,h,Q),Je.setPosition(te,Q.x,Q.y,Q.z),se.sea&&qe[se.d<4?se.d:se.d+2].set(Q.x,Q.y,Q.z,se.d===5?.6:1)}h.toWorld(d.lamps[0],Q),qe[4].set(Q.x,Q.y,Q.z,.9),He.updateMatrixWorld(),Q.set(0,1.76,-3.9).applyMatrix4(He.matrixWorld),Je.setPosition(ye.lamps.length,Q.x,Q.y,Q.z),qe[5].set(Q.x,Q.y,Q.z,.55),Je.update(o,r);for(let te=0;te<Mt.length;te++)Y.uSpl.value[te].z=b>0?(b-Mt[te])*H:-1;Ee.update(o,r,v,b),gt.update(o,r,v)}return{scene:m,path:i,duration:H,title:l.title,camera:{fov:62,near:.3,far:26e3,lookAhead:20,sway:.5,bank:.07},pois:f0,portal:{shape:"circle",radius:7,color:l.portal,glow:.55,revealDistance:260},post:{exposure:1.15,bloom:{strength:.25,radius:.6,threshold:1},grade:{saturation:1.06,contrast:1.04,tint:"#f1fff8",shadowTint:"#0b0915",vignette:.4,grain:.02,aberration:0}},ride:"none",style:"none",update:m0,dispose(){Ne.dispose()}}}};export{O0 as default};
