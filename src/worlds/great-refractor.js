import*as l from"three";import{makePath as Le,makeRng as Rt,hashSeed as qt}from"../kit/core.js";import*as it from"../kit/interior.js";import*as Ie from"../kit/fx.js";import{buildHero as Ve}from"../parts/great-refractor.js";const U=Math.PI*2,ae="#74706e",lt=["#0A1020","#3A4B66","#EEF2F6","#A9C6F2","#D8263A","#3FBF7A","#B08A4A"],z=(v,t,o)=>{const e=Math.min(1,Math.max(0,(o-v)/(t-v)));return e*e*(3-2*e)},Be=(v,t,o)=>{const e=(o-v)/(t-v);if(e<=0||e>=1)return 0;const T=Math.sin(Math.PI*e);return T*T},Fe=[{key:"summer",star:"#A9C6F2",domeL:[.17,.3],starHi:2.2,starLo:.9,mw:.85,core:0,lmc:1,cloud:0,dawn:0,comet:0,vap:0,frost:0,ruby:1,rubyGain:5,sconce:2.6,deckKey:.36,domeK:.16,ambSky:[.19,.235,.34],ambGnd:[.07,.085,.13],amb:[.3,.42,1,.22],fill:.17,fog:"#0c162c",fogD:.0014,bg:"#050912",tint:"#f1f5ff",shadow:"#02040c",sat:1.1,kitSky:"#6f84b4",kitGnd:"#303a58"},{key:"winter",star:"#c6d8fa",domeL:[.1,.17],starHi:2.3,starLo:1,mw:.62,core:.75,lmc:.3,cloud:0,dawn:0,comet:0,vap:.5,frost:1.25,ruby:.9,rubyGain:4.2,sconce:2,deckKey:.44,domeK:.26,ambSky:[.25,.305,.42],ambGnd:[.1,.12,.17],amb:[.42,.55,1,.28],fill:.2,fog:"#16233e",fogD:.0021,bg:"#070c18",tint:"#e9f1ff",shadow:"#04070f",sat:.98,kitSky:"#8ea2c8",kitGnd:"#3f4a68"},{key:"moon",star:"#dde2ec",domeL:[.17,.32],dome:"#bccbe8",starHi:2.35,starLo:1.05,mw:.6,core:0,lmc:.7,cloud:1,dawn:0,comet:0,vap:0,frost:0,ruby:1,rubyGain:5.2,sconce:2.9,deckKey:.9,domeK:.2,ambSky:[.2,.232,.315],ambGnd:[.074,.084,.118],amb:[.3,.41,.96,.22],fill:.17,fog:"#10182c",fogD:.0015,bg:"#060a13",tint:"#f5f6ff",shadow:"#03040d",sat:1.08,kitSky:"#8792b2",kitGnd:"#383f56"},{key:"dawn",star:"#8fd0dc",domeL:[.15,.26],starHi:2.1,starLo:.95,mw:.35,core:0,lmc:.55,cloud:0,dawn:1,comet:1,vap:0,frost:0,ruby:.72,rubyGain:4.8,sconce:3.3,deckKey:.3,dome:"#8fb4e6",domeK:.42,ambSky:[.115,.225,.305],ambGnd:[.044,.09,.125],amb:[.17,.3,1,.16],fill:.2,fog:"#0b1f2b",fogD:.0016,bg:"#031110",tint:"#e8f8f8",shadow:"#020f12",sat:1.12,kitSky:"#58a59e",kitGnd:"#244a48"}],Re=`
varying vec3 vW; varying vec3 vL;
void main(){ vL = position; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,qe=`
uniform mat3 uRot; uniform float uTime; uniform vec4 uLook; uniform vec4 uLook2; uniform vec3 uMetA; uniform vec3 uMetB; uniform vec4 uMet; uniform vec3 uMoon; uniform vec2 uMet2; uniform vec2 uSwing;
varying vec3 vW; varying vec3 vL;
// The sky's own chart. LMC is the point of the sky the slit is set on (the world turns the sky so that it stands in the opening);
// everything else is laid out from it in two directions: across the slit (west positive) and up it (toward the crown).
const vec3 LMC = vec3(0.213, 0.793, 0.570); const vec3 MWP = vec3(0.963, -0.114, -0.245);
const vec3 COMET = vec3(0.30, 0.53, 0.79); const vec3 CT = vec3(-0.12, 0.66, -0.74);
// every charted thing (all that is drawn with AT) stands this far up the slit from where it was drawn; the Milky Way's spine keeps its own line (see the note above the swing)
const float LIFT = 0.040;
#define AT(a, b) normalize(A0 + Bv * (a) + T * ((b) + LIFT))
float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y);
  float b = mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y);
  return mix(a, b, f.z); }
float fbm(vec3 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }
// one layer of stars. ex steepens the spread of brightness: a few brilliant, many faint; the brightest carry a soft glow
vec3 starField(vec3 d, float sc, float pix, float seed, float boost, float spread, float ex){
  vec3 g = d * sc; vec3 id = floor(g); vec3 f = g - id - 0.5;
  float h = clamp(h31(id + seed), 0.0, 1.0);
  vec3 o = (vec3(h31(id + seed + 11.3), h31(id + seed + 23.7), h31(id + seed + 37.1)) - 0.5) * spread;
  float m = pow(h, ex);
  float r0 = 0.035 + 0.09 * m; float r = max(r0, 1.2 * pix * sc);
  float dd = length(f - o); float k = r0 / r;
  float tw = 1.0 - (0.16 + 0.3 * m) * (0.5 + 0.5 * sin(uTime * (2.0 + 5.0 * h) + h * 90.0));
  float hc = h31(id + seed + 5.0);
  vec3 tint = mix(vec3(0.62, 0.78, 1.0), vec3(0.92, 0.96, 1.0), step(0.5, hc)); tint = mix(tint, vec3(1.0, 0.76, 0.52), step(0.93, hc));
  float core = 1.0 - smoothstep(0.0, r, dd);
  return tint * (boost * tw * m * (core * core * k * k + 0.12 * m * exp(-dd * dd * 60.0)));
}
// one of the sky's few brilliant stars: a hard point, a soft glow round it, a slow twinkle
vec3 bstar(vec3 s, vec3 F, float mag, vec3 tint, float pix, float ph){
  float dd = length(s - F); float r = max(0.0016, 1.3 * pix); float k = 0.0016 / r;
  float tw = 0.8 + 0.2 * sin(uTime * (2.3 + ph) + ph * 40.0) * sin(uTime * 0.9 + ph * 17.0);
  return tint * (mag * tw * (9.0 * exp(-dd * dd / (r * r)) * max(k * k, 0.4) + 0.24 * exp(-dd / 0.0045) + 0.03 * exp(-dd / 0.02)));
}
void main(){
  vec3 d = normalize(vW - cameraPosition);
  float pix = length(fwidth(d));
  vec3 s0 = uRot * d;
  vec3 A0 = normalize(LMC); vec3 T = normalize(cross(A0, MWP)); vec3 Bv = cross(A0, T);
  // The sky turns: a slow swing about the point the slit is set on, 0.018 rad across the slit and 0.014 rad along it, each on a phase
  // of its own drawn from the world's seed (no clock is special); a third of a degree a second where both are at their quickest.
  // The chart is one constant, pinned to the slit, the same at every hour. What the eye is meant to find in it (the Cross and its two
  // pointers, the Coalsack, the Large Cloud) is drawn, in the chart's own measure across the slit, from 0.176 east of the pinned point
  // (the Coalsack's rim) to 0.041 west of it (the Large Cloud's rim). The rule for its place: it stands centred in the cut of the
  // dome's skin as the approach has it. LIFT moves every charted thing (all that is drawn with AT) up the slit together. It was
  // set, when the cut was 80 m wide, to the thousandth of a radian at which the group's least margin to the east edge of the cut
  // and its least margin to the west edge were nearest to equal, from eyes two metres apart along the route between 310 m (where
  // the shutters stand open) and 642 m (past the lens cell), at every stand of the swing, with the dome's whole creep (2.5 degrees
  // either way) and the pin's whole wobble (0.012 rad). The cut now stands 112 m wide and the lift is kept: measured the same way,
  // the least margin to the east edge is 0.0792 rad (the Coalsack's rim, 364 m along the route) and to the west edge 0.0796 rad
  // (the Large Cloud's rim, 342 m along it); the lift at which the two are nearest to equal is now 0.041, a thousandth further.
  // The least clear sky between the group and the telescope is 0.71 m, between the Large Cloud's rim and the lens cell with its
  // bolt heads, 542 m along the route. What the rule does not cover, as facts: the edges are those of the cut in the skin (112 m
  // wide at radius 160); the west curb hangs 4.2 m inside the skin and, from the west wall, stands before that edge (at the 80 m
  // cut the least sky west of the Large Cloud's rim was 0.0166 rad there; not measured again); the Milky Way's spine keeps its own
  // line, so the group stands a hundredth of a radian further in on the band's shoulder than it was drawn; the Carina knot at the
  // top of the chart is not of the group and goes up to 0.03 rad behind the head of the opening at the far stands of the swing,
  // about 364 m along the route; and past 642 m, down the east flank of the room, the east edge of the cut may cross the group (at
  // the 80 m cut it did from 672 m to 890 m; not measured again). The figure belongs to this route and pin.
  vec3 wv = T * (0.018 * sin(uTime * 0.25 + uSwing.x)) - Bv * (0.014 * sin(uTime * 0.17 + uSwing.y));
  vec3 s = normalize(s0 + cross(wv, s0));
  // ---- the Milky Way: a spine of star clouds running up the slit along its east side, the pointers, the Coalsack and the Cross on
  // its inner shoulder, split by a long dark lane, ragged with dust
  float coreL = uLook2.w;
  vec3 Fl = AT(-0.01, 0.31); vec3 dl = s - Fl; vec2 lp = vec2(dot(dl, Bv), dot(dl, T));
  float lr2 = dot(lp, lp); float lk = 0.45 + 0.55 * uLook.y;      // (the Clouds hold in every look: fainter on a winter or a dawn sky, never gone)
  float clr = 1.0 - 0.95 * lk * exp(-lr2 / 0.0075);      // the Large Cloud stands in a clearing: dark sky on every side of it
  vec3 P = Bv * 0.969 + T * 0.247;
  float n1 = fbm(s * 3.2 + 2.0), n2 = fbm(s * 8.5 + vec3(5.0, 1.0, 3.0)), n3 = fbm(s * 23.0 + vec3(9.0, 4.0, 7.0));
  float b = dot(s, P) + 0.0735 - 0.09 * coreL;
  float bw = b + 0.05 * (n1 - 0.5);
  float spine = exp(-bw * bw * (300.0 - 320.0 * coreL)), halo = exp(-b * b * 14.0);
  vec3 Fc = AT(-0.142, 0.383); float dc = length(s - Fc);           // the Coalsack: a hole in the spine, the Cross beside it
  float knots = n2 * n2 * (0.5 + 1.6 * n3) + 0.3 * exp(-dc * dc / 0.004);      // (the star clouds crowd brightest round the Coalsack, so the hole reads)
  float rift = mix(smoothstep(0.006, 0.03, abs(bw + 0.02 + 0.07 * (n2 - 0.47))), 1.0, exp(-dc * dc / 0.004));
  float dustN = fbm(s * 12.0 + vec3(2.0, 7.0, 1.0));
  float dust = smoothstep(0.36, 0.6, dustN + abs(bw) * 2.2 + 0.3 * exp(-dc * dc / 0.004));
  float coal = 1.0 - smoothstep(0.013, 0.034, dc + 0.034 * (n3 - 0.5) + 0.024 * (n2 - 0.47));      // ragged, soft at the rim
  float lanes = mix(0.07, 1.0, rift) * mix(0.16, 1.0, dust) * (1.0 - 0.97 * coal);
  vec3 Fh = AT(-0.02, 0.04);
  float coreK = exp(-(1.0 - dot(s, Fh)) * 9.0) * coreL;            // winter: the bright heart of it fills the slit
  float mwv = (spine * (0.24 + 3.2 * knots) + halo * (0.32 - 0.27 * coreL) * (0.4 + n1)) * lanes * (1.0 + 2.2 * coreK) * clr;
  vec3 col = vec3(0.006, 0.011, 0.029);
  vec3 mwc = mix(vec3(0.46, 0.66, 1.0), vec3(0.9, 0.95, 1.0), smoothstep(0.2, 0.8, knots));      // pale blue haze, cold white where the star clouds crowd
  mwc = mix(mwc, vec3(1.0, 0.9, 0.74), 0.4 * coreK);
  col += mwc * (0.4 * (uLook.x + 0.5 * (1.0 - uLook.x) * exp(-dc * dc / 0.006)) * mwv);      // (round the Coalsack the star clouds keep half their light on the faintest night, so the hole reads)
  // nebulae strung along the band: rose knots, a teal veil beside them
  float nb = smoothstep(0.5, 0.78, fbm(s * 11.0 + vec3(9.0, 3.0, 1.0))) * smoothstep(0.25, 0.9, halo) * (0.25 + 2.6 * n1 * n1) * (0.6 + 0.8 * vn(s * 47.0));
  float nt = smoothstep(0.5, 0.82, fbm(s * 7.0 + vec3(1.0, 17.0, 5.0))) * smoothstep(0.06, 0.6, halo) * (1.0 - nb);
  col += (vec3(1.0, 0.2, 0.42) * (nb * 0.32) + vec3(0.08, 0.72, 0.66) * (nt * 0.15)) * (0.4 + 0.6 * uLook.x) * (1.0 - 0.9 * coal) * clr;
  // the colour this sky had before the chart was drawn, in the same sky coordinates, so it stands where it stood in the slit (it
  // swings with the chart): along the earlier band that sky's rose knots and teal veil by its own lines, its blue haze round them
  // only, and its gold dust as a turning of the light and not as light added.
  // As 12c's own rose knots and teal veil it is thinned in the Coalsack and in the clearing round the Large Cloud, so the chart reads
  // as it does; the earlier sky's own Coalsack hole and its winter heart are not brought back (one sky, one Coalsack, one heart).
  float b0 = dot(s, MWP) + 0.05; float band0 = exp(-b0 * b0 * 15.0);
  float cl0 = fbm(s * 5.0 + 2.0); float lane0 = smoothstep(0.34, 0.6, fbm(s * 9.0 + vec3(5.0, 1.0, 3.0)) + abs(b0) * 0.9);
  float gd0 = fbm(s * 3.1 + vec3(1.7, 9.2, 4.4));
  float kn0 = smoothstep(0.5, 0.78, fbm(s * 11.0 + vec3(9.0, 3.0, 1.0))) * smoothstep(0.25, 0.9, band0);      // where a rose knot stands
  float kt0 = smoothstep(0.5, 0.82, fbm(s * 7.0 + vec3(1.0, 17.0, 5.0))) * smoothstep(0.06, 0.6, band0);      // where the teal veil lies
  float nb0 = kn0 * (0.25 + 2.6 * cl0 * cl0) * (0.6 + 0.8 * vn(s * 47.0));
  float nt0 = kt0 * (1.0 - nb0);
  // the blue haze stands at its strength where the knots and the veil are (full where either is a quarter grown) and is nothing
  // away from them: there the night is the chart's own. The gold dust adds no light of its own: where it lies (at most 85 parts in
  // 100) it turns the light gathered so far to gold at about the brightness it had (1.08 times), as dust colours what shines
  // through it, and the blue haze is kept out of it; the rose knots and the teal veil are laid after it in their own colours
  float gk0 = smoothstep(0.46, 0.68, gd0) * smoothstep(0.1, 0.7, band0);
  float th0 = (1.0 - 0.9 * coal) * clr;
  col += vec3(0.4, 0.58, 1.0) * ((1.0 - gk0) * smoothstep(0.0, 0.25, max(kn0, kt0)) * 0.26 * uLook.x * band0 * (0.22 + 1.7 * cl0 * cl0) * mix(0.12, 1.0, lane0) * th0);
  col = mix(col, vec3(1.0, 0.66, 0.26) * (dot(col, vec3(0.3, 0.59, 0.11)) * 1.5), 0.85 * gk0 * th0 * (0.4 + 0.6 * uLook.x));
  col += (vec3(1.0, 0.2, 0.42) * (nb0 * 0.32) + vec3(0.08, 0.72, 0.66) * (nt0 * 0.15)) * ((0.4 + 0.6 * uLook.x) * th0);
  vec3 Fe = AT(-0.185, 0.54); float de = length(s - Fe);      // the great nebula in Carina, further up the spine
  col += (vec3(1.0, 0.5, 0.62) * exp(-de * de / 0.0005) * (0.3 + 0.9 * n3) + vec3(1.0, 0.9, 0.95) * exp(-de * de / 0.00005)) * (0.5 * uLook.x);
  // ---- the Magellanic Clouds. The Large one in the middle of the slit: a detached pale cloud a fist wide, a brighter bar across it,
  // one rose knot and two star knots; the Small one lower left, a third its size
  float lm = fbm(s * 30.0 + 3.0);
  float lq = max(lr2 * (1.0 + 0.9 * (n3 - 0.5) + 0.7 * (n2 - 0.47)), 0.0) / 0.0026; float lbody = exp(-lq * sqrt(lq));      // full to the shoulder, then a quick fall to dark
  vec2 bp = vec2(0.82 * lp.x + 0.57 * lp.y, -0.57 * lp.x + 0.82 * lp.y);
  float lbar = exp(-(bp.x * bp.x / 0.0011 + bp.y * bp.y / 0.00009));
  vec2 kp = lp - vec2(0.027, 0.03), kp2 = lp + vec2(0.02, 0.008), kp3 = lp - vec2(-0.008, 0.026);
  float lknot = exp(-dot(kp, kp) / 0.00004), lk2 = exp(-dot(kp2, kp2) / 0.00002) + 0.7 * exp(-dot(kp3, kp3) / 0.000015);
  vec3 Fs = AT(-0.05, 0.195); vec3 dsv = s - Fs; vec2 sp2 = vec2(dot(dsv, Bv), dot(dsv, T));
  float l2 = exp(-(sp2.x * sp2.x / 0.00028 + sp2.y * sp2.y / 0.00048) * (1.0 + 0.8 * (n3 - 0.5)));
  vec3 mag = vec3(0.62, 0.78, 1.0) * (lk * (lbody * (0.34 + 0.56 * lm + 0.26 * smoothstep(0.5, 0.75, lm)) + lbar * (0.2 + 0.3 * lm) + 0.5 * lk2 + l2 * (0.24 + 0.46 * lm)))
    + vec3(1.0, 0.7, 0.86) * (lk * 0.6 * lknot);
  // ---- stars. Under everything a dense field of faint cold ones; over it three sizes, crowded along the spine and in the Clouds and
  // thinned by the dust; then the few brilliant ones, each charted by hand
  float dens = 1.0 + (3.0 * spine * lanes + 0.6 * halo) * uLook.x * (1.0 + coreK) * clr + 2.2 * lbody * lk + 1.5 * l2 * lk;
  vec3 st = starField(s, 20.0, pix, 80.0, 14.0, 0.7, 10.0) + starField(s, 44.0, pix, 0.0, 10.0 * dens, 0.6, 4.5) + starField(s, 90.0, pix, 40.0, 4.5 * dens, 0.4, 2.5);
  st += (starField(s, 61.0, pix, 120.0, 24.0, 0.6, 3.0) + starField(s, 127.0, pix, 160.0, 19.0, 0.5, 3.0)) * (0.85 + 0.3 * dens) * (0.5 + 0.5 * clr) * (1.0 - 0.5 * coreL);
  st *= (1.0 - 0.8 * coal) * (1.0 - 0.8 * lk * exp(-lr2 / 0.0075) * (1.0 - lbody));      // few stars in the Coalsack, and in the moat of dark sky round the Large Cloud
  vec3 cb = vec3(0.66, 0.82, 1.0), cw = vec3(0.95, 0.97, 1.0), co = vec3(1.0, 0.72, 0.46);
  // the Cross (foot, east arm, head, west arm) and the two pointers below it along the spine
  st += bstar(s, AT(-0.108, 0.388), 2.2, cb, pix, 0.3) + bstar(s, AT(-0.130, 0.420), 1.8, cb, pix, 1.1)
      + bstar(s, AT(-0.106, 0.448), 1.5, co, pix, 1.9) + bstar(s, AT(-0.087, 0.415), 1.1, cb, pix, 2.6)
      + bstar(s, AT(-0.133, 0.314), 2.4, cw, pix, 3.4) + bstar(s, AT(-0.128, 0.342), 1.8, cb, pix, 4.2)
      + bstar(s, AT(0.040, 0.130), 2.5, cw, pix, 5.1) + bstar(s, AT(-0.030, 0.520), 1.5, cb, pix, 5.9)
      + bstar(s, AT(-0.110, 0.200), 1.4, co, pix, 6.7);
  // the hour before dawn: teal at the foot, and a comet standing with its tail upward
  float el = smoothstep(0.2, 0.85, d.y);
  col = mix(col, mix(vec3(0.014, 0.085, 0.1), vec3(0.006, 0.022, 0.065), el) + col * 0.6, uLook.w);
  st *= mix(1.0, mix(0.15, 0.9, el), uLook.w);
  col += mag;
  vec3 cv = s - normalize(COMET); vec3 ct3 = normalize(CT); float ct = dot(cv, ct3); float cs = length(cv - ct3 * ct);
  float cw2 = 0.006 + 0.13 * max(ct, 0.0);
  float tail = exp(-cs * cs / (cw2 * cw2)) * exp(-max(ct, 0.0) * 6.0) * smoothstep(0.0, 0.015, ct);
  col += vec3(0.6, 0.92, 1.0) * (uLook2.x * (exp(-dot(cv, cv) * 30000.0) * 5.0 + exp(-dot(cv, cv) * 1800.0) * 0.5 + tail * 0.55));
  col += st;
  // racing cloud under a moon that stands just outside the slit: dark rags that blot the stars out, silver only on the edge that faces the moon
  vec3 cq = d * vec3(4.4, 2.6, 4.4) + vec3(uTime * 0.15, uTime * 0.03, uTime * 0.07);
  float cbase = fbm(cq);
  float cn = cbase + 0.2 * (vn(cq * 5.3) - 0.5) + 0.13 * (vn(cq * 13.0) - 0.5) + 0.09 * (vn(cq * 31.0) - 0.5) + 0.05 * (vn(cq * 67.0) - 0.5);
  vec3 cq2 = cq + uMoon * 0.05; float cm = fbm(cq2) + 0.2 * (vn(cq2 * 5.3) - 0.5) + 0.12 * (vn(cq2 * 13.0) - 0.5);      // the same cloud a little way toward the moon
  float gap = 0.12 + 0.88 * smoothstep(0.13, 0.22, length(s - AT(-0.07, 0.37)));      // the rags thin to a veil where the Cross, the Coalsack and the Large Cloud stand: a part of the sky chart, the same at every hour
  float cc = smoothstep(0.515, 0.615, cn); cc = cc * cc * (3.0 - 2.0 * cc) * uLook.z * gap;      // soft-edged rags: thin veils at the rim, stars dim through them, most of the sky open
  float lit = clamp((cn - cm) * 13.0, 0.0, 1.0);                                  // thinning toward the moon: a lit edge
  float edge = smoothstep(0.518, 0.536, cn) * (1.0 - smoothstep(0.542, 0.572, cn)) * lit * uLook.z * gap * smoothstep(0.5, 0.56, cbase);      // a thin silver line on the side that faces the moon, only where a rag really ends (no marks on stray wisps in open sky)
  float mg = exp(-(1.0 - dot(d, uMoon)) * 5.0);
  vec3 body = mix(vec3(0.034, 0.042, 0.064), vec3(0.007, 0.009, 0.016), smoothstep(0.56, 0.7, cn)) + vec3(0.3, 0.36, 0.5) * (0.07 * lit * (1.0 - smoothstep(0.55, 0.68, cn)));
  col = mix(col, body, cc * 0.96);      // grey veils against the bright sky, dark at their hearts
  col += vec3(0.62, 0.72, 0.92) * (edge * (0.24 + 0.5 * mg));
  col += vec3(0.5, 0.62, 0.85) * (uLook.z * 0.05 * mg);
  // winter: vapour curling in at the foot of the slit
  float vf = (1.0 - smoothstep(0.0, 75.0, vL.y)) * smoothstep(0.3, 0.75, fbm(vec3(vL.x * 0.07, vL.y * 0.05 - uTime * 0.25, uTime * 0.07)));
  col += vec3(0.07, 0.095, 0.15) * (uLook2.y * vf);
  // meteor / fireball: a streak between two directions
  vec3 ab = uMetB - uMetA; float hh = clamp(dot(d - uMetA, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  float md = length(d - normalize(uMetA + ab * hh)); float mw = max(0.0035, 1.2 * pix) * uMet.a;      // the ends are far apart on the sky: measure to the arc, not the chord
  vec3 dh = d - uMetB;
  float trail = exp(-md * md / (mw * mw)) * hh * hh + uMet2.y * exp(-md * md / (mw * mw * 12.0)) * hh * hh * hh;
  col += uMet.rgb * (trail + uMet2.x * exp(-dot(dh, dh) / (mw * mw * 3.0)) + uMet2.y * 0.5 * exp(-dot(dh, dh) / (mw * mw * 40.0)));
  gl_FragColor = vec4(col * uLook2.z, 1.0);
}`,We=`
attribute vec3 aW; attribute float aPh; attribute float aTone;
uniform float uTime; uniform float uFlap;
varying vec2 vUv; varying vec3 vWp; varying float vPart; varying float vShade; varying float vSeed;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  float fl = sin(uTime * uFlap + aPh * 6.2832);
  float lag = sin(uTime * uFlap + aPh * 6.2832 - 0.9 * aW.y);
  float ang = (0.2 + 0.66 * mix(fl, lag, aW.y)) * aW.x * step(0.5, aW.z) * (1.0 - 0.25 * step(1.5, aW.z));
  float c = cos(ang), s = sin(ang); p.xy = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  p.y += 0.06 * fl * (1.0 - step(0.5, aW.z));
  vec4 wp = modelMatrix * instanceMatrix * vec4(p, 1.0);
  vUv = uv; vWp = wp.xyz; vPart = aW.z; vSeed = aPh; vShade = aTone * (1.0 - 0.3 * step(0.5, aW.z) * (0.5 - 0.5 * fl));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ke=v=>`
uniform vec3 uColA; uniform vec3 uColB; uniform vec3 uColC; uniform float uPlume;
varying vec2 vUv; varying vec3 vWp; varying float vPart; varying float vShade; varying float vSeed;
#include <fog_pars_fragment>
${v}
void main(){
  float wing = step(0.5, vPart), hind = step(1.5, vPart);
  float n = vnoise(vec3(vUv * 9.0, vSeed * 13.0)), n2 = vnoise(vec3(vUv * 31.0, vSeed * 7.0));
  // forewing: a mottled buff ground, three wavy cross bars, a pale spot ringed dark, a dark margin with a pale fringe
  float wav = vUv.x + 0.05 * sin(vUv.y * 11.0 + vSeed * 6.0) + 0.03 * (n - 0.5);
  float bars = (1.0 - smoothstep(0.0, 0.04, abs(wav - 0.3))) + 0.8 * (1.0 - smoothstep(0.0, 0.05, abs(wav - 0.53))) + 0.9 * (1.0 - smoothstep(0.0, 0.035, abs(wav - 0.72)));
  float margin = smoothstep(0.86, 0.97, vUv.x);
  vec2 sd = (vUv - vec2(0.46, 0.66)) * vec2(1.0, 0.6); float sr = length(sd);
  vec3 fore = mix(uColA, uColB, clamp(0.55 * bars + 0.3 * (n - 0.35) + 0.75 * margin, 0.0, 1.0));
  fore = mix(fore, uColB * 0.5, (1.0 - smoothstep(0.055, 0.075, sr)) * 0.9); fore = mix(fore, uColA * 1.25, 1.0 - smoothstep(0.025, 0.04, sr));
  fore = mix(fore, uColA * 1.1, smoothstep(0.985, 1.0, vUv.x) * 0.6);
  // hindwing: a rose flush near the body, an eye of dark and pale blue, a dark band along the edge
  vec2 ed = (vUv - vec2(0.5, 0.02)) * vec2(1.0, 0.75); float er = length(ed);
  vec3 hw = mix(uColC, uColA * 0.8, smoothstep(0.25, 0.8, vUv.x));
  hw = mix(hw, uColB * 0.45, (1.0 - smoothstep(0.14, 0.17, er)) * smoothstep(0.06, 0.09, er));
  hw = mix(hw, vec3(0.42, 0.56, 0.8), 1.0 - smoothstep(0.05, 0.075, er));
  hw = mix(hw, uColB * 0.6, smoothstep(0.74, 0.9, vUv.x + 0.25 * (0.3 - vUv.y)));
  vec3 alb = mix(fore, hw, hind);
  // the pale cast (ghost moths): the same bars and eyes, half washed out under fine ribs
  alb = mix(alb, mix(uColA * 1.05, uColB, 0.3 * margin + 0.22 * step(0.5, fract(vUv.y * 9.0 + vUv.x * 3.0))), uPlume * 0.45);
  alb *= 0.86 + 0.28 * n2;
  // body: pale fur on the thorax, a banded abdomen, lighter along the back
  float seg = smoothstep(0.3, 0.7, 0.5 + 0.5 * sin(vUv.x * 44.0));
  vec3 body = mix(uColA * 1.05, mix(uColB * 0.8, uColC * 1.1, seg), smoothstep(0.42, 0.56, vUv.x));
  body *= (0.62 + 0.5 * sin(vUv.y * 3.1416)) * (0.8 + 0.4 * n2) * 0.55;
  alb = mix(alb, alb * alb * 3.2, 0.6);      // deeper bars, paler ground
  alb *= 1.0 + 0.5 * smoothstep(0.9, 1.0, vUv.x) * (1.0 - hind);      // the pale fringe catches the light
  alb = mix(body, alb, wing);
  // light: the room's cold ambient, every lamp in reach, the bar of starlight, and inside the tube the colours of the lens
  vec3 lit = mix(uAmbGnd, uAmbSky, 0.65) * 1.15;
  for (int i = 0; i < 8; i++) {
    vec3 d = uLampPos[i].xyz - vWp; float r2 = dot(d, d); float rr = uLampPos[i].w;
    float att = max(1.0 - r2 / max(rr * rr, 1.0), 0.0); att = att * att / (1.0 + r2 * 10.8 / max(rr * rr, 1.0));
    vec3 lc = uLampCol[i]; lc = mix(lc, vec3(dot(lc, vec3(0.3, 0.55, 0.15))) * vec3(1.0, 0.95, 0.82), 0.8);      // pale wings take a lamp's tint, not its whole colour
    lit += lc * (att * 0.4);
  }
  {
    float sg = 6.2832 / max(uRing.w, 1.0); float la = floor(atan(vWp.x, vWp.z + (abs(vWp.z) < 1e-4 ? 2e-4 : 0.0)) / sg + 0.5) * sg;
    vec3 d = vec3(sin(la) * uRing.x, uRing.y, cos(la) * uRing.x) - vWp; float r2 = dot(d, d);
    float att = max(1.0 - r2 / max(uRing.z * uRing.z, 1.0), 0.0); lit += uRingCol * (att * att / (1.0 + r2 * 0.0065) * 0.45);
  }
  lit += uStarCol * (uStar * 0.26 * slitMask(vWp) * tubeShadow(vWp));
  vec3 pa = vWp - uCtr; float sx = dot(pa, uKeyDir); float inT = step(dot(pa, pa) - sx * sx, 110.0) * step(-91.0, sx) * step(sx, 113.0);
  lit += tubeRings(sx, vSeed * 6.0) * (inT * uTube.x * (0.22 + 0.8 * smoothstep(-100.0, 112.0, sx)));
  float pale = step(1.6, vShade);      // (the moths that climb the bar of starlight: pale wings that hold the light)
  lit += uStarCol * (uStar * 0.2 * pale * slitMask(vWp));
  vec3 col = max(alb * lit * vShade, vec3(0.0)); col = col / (1.0 + (0.9 - 0.45 * pale) * dot(col, vec3(0.3, 0.55, 0.15)));      // tinted by whatever lights them, never white
  col = mix(col, uFlash.rgb * (dot(col, vec3(0.3, 0.55, 0.15)) * 1.7), uFlash.a);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ce=`
attribute vec2 aK;
uniform float uTime;
varying vec2 vUv; varying vec3 vWp; varying float vKind; varying float vLift;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  float l = aK.y * aK.y;
  float gust = 0.5 + 0.5 * sin(uTime * 0.9 + aK.x * 2.3) + 0.25 * sin(uTime * 2.7 + aK.x * 5.0 + position.x * 0.4);
  p.y += l * (0.25 + 1.3 * max(gust, 0.0));
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vUv = uv; vWp = wp.xyz; vKind = aK.x; vLift = l * gust;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,De=`
uniform vec4 uLamp; uniform vec3 uLampCol; uniform vec3 uAmb; uniform float uHand;
varying vec2 vUv; varying vec3 vWp; varying float vKind; varying float vLift;
#include <fog_pars_fragment>
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float ln(float d, float w, float aa){ return 1.0 - smoothstep(w, w + aa, abs(d)); }
void main(){
  vec2 uv = vUv; float aa = max(fwidth(uv.x), fwidth(uv.y)) * 1.5;
  vec3 paper = vec3(0.74, 0.76, 0.74); vec3 ink = vec3(0.04, 0.06, 0.12); float k = 0.0; float gl = 0.0;
  if (vKind < 1.5) {
    // star charts: 0 a polar chart (rings and hour lines), 1 a ruled zone chart; both sown with ink stars
    vec2 c = uv - 0.5; float r = length(c);
    if (vKind < 0.5) {
      float rr = r * 10.0; k = max(k, ln(fract(rr + 0.5) - 0.5, 0.012, aa * 10.0) * step(r, 0.455) * 0.55);
      float a = atan(c.y, c.x + (abs(c.x) < 1e-5 ? 1e-4 : 0.0)) / 6.2832 * 24.0; k = max(k, ln(fract(a + 0.5) - 0.5, 0.004 / max(r, 0.03), aa * 4.0 / max(r, 0.03)) * step(r, 0.455) * step(0.05, r) * 0.45);
      k = max(k, ln(r - 0.455, 0.004, aa)); k = max(k, ln(r - 0.47, 0.0015, aa) * 0.8);
    } else {
      vec2 g = uv * vec2(12.0, 9.0); k = max(k, max(ln(fract(g.x + 0.5) - 0.5, 0.012, aa * 12.0), ln(fract(g.y + 0.5) - 0.5, 0.012, aa * 9.0)) * 0.45);
      k *= step(0.04, uv.x) * step(uv.x, 0.96) * step(0.05, uv.y) * step(uv.y, 0.95);
      k = max(k, ln(max(abs(c.x) - 0.46, abs(c.y) - 0.45), 0.003, aa));
    }
    vec2 sg = uv * 34.0; vec2 si = floor(sg); vec2 sf = fract(sg) - 0.5; float sh = h21(si + vKind * 17.0);
    vec2 so = (vec2(h21(si + 3.1), h21(si + 7.7)) - 0.5) * 0.6;
    float sr = 0.05 + 0.3 * sh * sh * sh; float star = (1.0 - smoothstep(sr, sr + aa * 34.0, length(sf - so))) * step(0.62, sh) * step(r, 0.445 + vKind);
    k = max(k, star);
    k = mix(0.1, k, 1.0 - smoothstep(0.012, 0.045, aa));      // far off the rulings and ink stars melt into one tone
    paper *= 0.94 + 0.06 * h21(floor(uv * 3.0));
  } else if (vKind < 2.5) {
    // the logbook: ruled lines, a margin, and rows of dots and dashes where the night has been written down
    float page = step(0.5, uv.x); vec2 q = vec2(fract(uv.x * 2.0), uv.y);
    float li = floor(q.y * 22.0); float lf = fract(q.y * 22.0);
    k = max(k, ln(lf - 0.5, 0.03, aa * 22.0) * 0.3 * step(0.06, q.x) * step(q.x, 0.95));
    k = max(k, ln(q.x - 0.14, 0.004, aa * 2.0) * 0.35);
    float filled = step(li, 21.0) * step(8.0 - page * 14.0, li);
    float cell = floor(q.x * 46.0); float wr = step(0.38, h21(vec2(cell + page * 50.0, li))) * step(0.17, q.x) * step(q.x, 0.2 + 0.7 * h21(vec2(li, 3.0 + page)));
    k = max(k, wr * filled * ln(lf - 0.3, 0.09, aa * 22.0) * 0.8 * step(0.2, fract(q.x * 46.0)));
    k = max(k, ln(uv.x - 0.5, 0.004, aa) * 0.7);
    paper = vec3(0.7, 0.71, 0.66) * (1.0 - 0.25 * exp(-abs(uv.x - 0.5) * 30.0));
  } else {
    // the chronometer: enamel dial, sixty ticks, a seconds hand that steps
    vec2 c = uv - 0.5; float r = length(c); float a = atan(c.x, c.y + (abs(c.y) < 1e-5 ? 1e-4 : 0.0));
    float t60 = a / 6.2832 * 60.0; float tick = ln(fract(t60 + 0.5) - 0.5, 0.07, aa * 60.0 / max(r, 0.05) * 0.16);
    float five = ln(fract(t60 / 5.0 + 0.5) - 0.5, 0.035, aa * 12.0 / max(r, 0.05) * 0.16);
    k = max(k, tick * step(0.36, r) * step(r, 0.4)); k = max(k, five * step(0.33, r) * step(r, 0.4));
    float da = a - uHand; da = da - 6.2832 * floor(da / 6.2832 + 0.5);
    k = max(k, ln(da * r, 0.006, aa) * step(r, 0.37) * step(abs(da), 1.5));
    k = max(k, 1.0 - smoothstep(0.02, 0.02 + aa, r));
    vec2 c2 = c - vec2(0.0, -0.17); float r2 = length(c2); k = max(k, ln(r2 - 0.09, 0.003, aa) * 0.7);
    float brass = smoothstep(0.42, 0.42 + aa, r); paper = mix(vec3(0.8, 0.82, 0.8), vec3(0.5, 0.39, 0.2), brass); gl = brass; k *= 1.0 - brass;
    if (r > 0.5) discard;
  }
  vec3 alb = mix(paper, ink, clamp(k, 0.0, 1.0));
  vec3 dl = uLamp.xyz - vWp; float r2l = dot(dl, dl);
  float att = max(1.0 - r2l / (uLamp.w * uLamp.w), 0.0); att = att * att / (1.0 + r2l * 0.006);
  float ndl = clamp(dl.y * inversesqrt(max(r2l, 1e-3)) + 0.25, 0.0, 1.0);
  vec3 col = alb * (uAmb * (1.0 + 0.6 * vLift) + uLampCol * (att * ndl)) + uLampCol * (gl * att * 0.25);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Ue=`
attribute vec3 aS;
uniform float uTime; uniform vec3 uBase; uniform float uSize;
varying vec2 vQ; varying float vA;
void main(){
  float t = fract(uTime * (0.1 + 0.05 * aS.y) + aS.x);
  vec3 c = uBase + vec3(sin(uTime * 0.7 + aS.x * 30.0) * 0.5 * t + (aS.z - 0.5) * 0.5, t * 6.5 * uSize, cos(uTime * 0.5 + aS.x * 17.0) * 0.5 * t + (aS.y - 0.5) * 0.5);
  float sz = uSize * (0.5 + 1.9 * t);
  vec4 mvPosition = viewMatrix * vec4(c, 1.0);
  mvPosition.xy += position.xy * sz;
  vQ = position.xy; vA = smoothstep(0.0, 0.15, t) * (1.0 - t) * (1.0 - t);
  gl_Position = projectionMatrix * mvPosition;
}`,Ee=`
uniform vec3 uCol;
varying vec2 vQ; varying float vA;
void main(){
  float r = dot(vQ, vQ); float a = (1.0 - smoothstep(0.1, 1.0, r)) * vA;
  gl_FragColor = vec4(uCol * a, 1.0);
}`,se=v=>`
#define BEAM_STEPS 4
attribute vec4 aS;
uniform vec3 uBox; uniform float uSizeK; uniform float uDustGain; uniform vec3 uPiv; uniform vec3 uAx; uniform vec3 uE1; uniform vec3 uE2;
varying vec2 vQ; varying vec3 vCol;
${v}
void main(){
#ifdef TUBE
  // motes inside the telescope: they drift up the tube in the beam
  float sAx = mod(aS.x * 204.0 + uTime * 1.2 * (0.5 + aS.w), 204.0) - 91.0;
  float ang = aS.y * 6.2832 + uTime * 0.12 * (aS.w - 0.5); float rad = 8.5 * aS.z;
  vec3 P = uPiv + uAx * sAx + (uE1 * cos(ang) + uE2 * sin(ang)) * rad;
  vec3 rel = P - cameraPosition; float dist = length(rel);
  float fade = smoothstep(1.5, 7.0, dist) * (1.0 - smoothstep(110.0, 190.0, dist));
  // brightest in the cone of light down the axis; nearer the lens they take its blue and gold
  float gT = smoothstep(-100.0, 112.0, sAx);
  vec3 lit = (uStarCol * 0.55 + tubeRings(sAx, ang) * (0.25 + 0.75 * gT)) * (uStar * (0.45 + 0.55 * uTube.y) * (0.08 + 2.0 * exp(-rad * rad / 18.0)) * 1.5);
#elif defined(BAR)
  // motes in the bar of starlight round the upper tube: they climb slowly toward the slit, and each flashes as it turns
  float sAx = mod(aS.x * 150.0 + uTime * 0.7 * (0.4 + aS.w), 150.0) + 4.0;
  float ang = aS.y * 6.2832 + uTime * 0.05 * (aS.w - 0.5) + 0.25 * sin(uTime * 0.2 + aS.w * 30.0); float rad = 13.6 + 8.0 * aS.z * aS.z;      // a sleeve of air close round the tube, where the bar of light lies
  vec3 P = uPiv + uAx * sAx + (uE1 * cos(ang) + uE2 * sin(ang)) * rad;
  vec3 rel = P - cameraPosition; float dist = length(rel);
  float fade = smoothstep(6.0, 20.0, dist) * (1.0 - smoothstep(170.0, 260.0, dist)) * smoothstep(4.0, 22.0, sAx) * (1.0 - smoothstep(138.0, 154.0, sAx));
  vec3 lit = mix(uStarCol, vec3(0.7, 0.84, 1.0), 0.5) * (uStar * slitMask(P) * smoothstep(0.0, 22.0, uSlit.x));
#else
  vec3 drift = vec3(0.6, 0.18, 0.32) * uTime + vec3(sin(uTime * 0.31 + aS.w * 40.0), sin(uTime * 0.23 + aS.w * 70.0), cos(uTime * 0.27 + aS.w * 55.0)) * 1.8;
  vec3 rel = mod(aS.xyz * uBox + drift - cameraPosition, uBox) - 0.5 * uBox;
  vec3 P = cameraPosition + rel;
  vec3 e = 0.5 * uBox - abs(rel); float fade = clamp(min(min(e.x, e.y), e.z) / 6.0, 0.0, 1.0);
  float dist = length(rel); fade *= smoothstep(5.0, 16.0, dist);
  vec3 pc = P - uCtr; float inDome = step(dot(pc, pc), uSlit.w * uSlit.w) * smoothstep(0.0, 22.0, uSlit.x);
  vec3 lit = uStarCol * (uStar * slitMask(P) * inDome * tubeShadow(P));
  for (int i = 0; i < 8; i++) { vec3 d = uLampPos[i].xyz - P; float r2 = dot(d, d); float rr = uLampPos[i].w * 0.6; float att = max(1.0 - r2 / max(rr * rr, 1.0), 0.0); lit += uLampCol[i] * (att * att / (1.0 + r2 * 0.03) * 0.6); }
  { vec3 pa = P - uCtr; float sa = dot(pa, uKeyDir); vec3 qa = pa - uKeyDir * sa; float wq = max(uShaft.y, 1.0);      // motes in the shaft round the tube
    lit += uStarCol * (uStar * uShaft.x * 7.0 * exp(-dot(qa, qa) / (wq * wq)) * smoothstep(uShaft.z, uShaft.z + 30.0, sa) * (1.0 - smoothstep(uShaft.w - 14.0, uShaft.w + 4.0, sa))); }
#endif
  lit = mix(lit, uFlash.rgb * dot(lit, vec3(0.5)), uFlash.a);
  float tw = 0.3 + 0.7 * pow(0.5 + 0.5 * sin(uTime * (1.5 + 3.0 * fract(aS.w * 7.0)) + aS.w * 90.0), 4.0);
#ifdef BAR
  { float sp = clamp(0.5 + 0.5 * sin(uTime * (1.1 + 2.6 * fract(aS.w * 7.0)) + aS.w * 90.0), 0.0, 1.0); sp *= sp; sp *= sp; sp *= sp; tw = 0.02 + 2.6 * sp * sp; }      // dark between flashes: a glitter, not a haze
#endif
#ifdef TUBE
  float s0 = 0.03 + 0.07 * fract(aS.w * 13.0); fade *= smoothstep(8.0, 30.0, dist);
#elif defined(BAR)
  float s0 = 0.035 + 0.06 * fract(aS.w * 13.0);
#else
  float s0 = 0.02 + 0.045 * fract(aS.w * 13.0);
#endif
  float s = max(s0, dist * uSizeK); float k = s0 / s;
  vCol = lit * (tw * fade * max(k * k, 0.05) * uDustGain);
  vec4 mv = viewMatrix * vec4(P, 1.0); mv.xy += position.xy * s;
  vQ = position.xy; gl_Position = projectionMatrix * mv;
}`,ne=`
varying vec2 vQ; varying vec3 vCol;
void main(){ float a = 1.0 - smoothstep(0.0, 1.0, dot(vQ, vQ)); gl_FragColor = vec4(vCol * (a * a), 1.0); }`;async function Ye(v,t,o,e){const S=()=>v.yield();e.rand=.3,e.uvOn=!0,e.set(12,o.brick),e.lathe([[160,-1,.45],[160,44,.5],[160,51,.55],[160,64,.85],[160,100,1],[160,135.8,.85]],96,{inward:!0,rRef:160}),e.set(13,o.flag),e.lathe([[160,0,.5],[142,0,.55],[125.6,0,.9]],96,{rRef:142}),e.set(12,o.brick,.7),e.lathe([[125.6,-16,.15],[125.6,0,.8]],96,{inward:!0,rRef:125.6}),await S(),e.uvOn=!1,e.rand=.4,e.set(8,o.deck),e.lathe([[160,50],[148,50],[137,50],[126.4,50]],96),e.uvOn=!0,e.rand=.6,e.set(0,o.iron),e.lathe([[127.6,45.2],[125.9,45.4],[125.9,46.1],[126.4,46.3],[126.4,49.3],[125.9,49.5],[125.9,50.3],[126.4,50.3]],96,{inward:!0,rRef:126.4}),e.uvOn=!1,e.set(0,o.ironDark),e.lathe([[127.6,45.2,.5],[160,45.2,.3]],96);for(let c=0;c<48;c++)e.push().rotY(c/48*U).move(0,44.3,143.8),e.box(.45,.9,16,.1),e.pop();await S();for(let c=0;c<24;c++){e.push().rotY(c/24*U).move(0,0,129.6),e.rand=.2+.03*(c%7),e.set(0,o.iron,.9+.2*(c*5%3)/3),e.lathe([[2.5,0],[2.5,1],[2,1.5],[1.6,2.6],[1.3,3.4],[1.3,4.2],[1.55,4.4],[1.55,5],[1.2,5.3],[1.1,37.6],[1.4,38],[1.4,38.8],[1.15,39.2],[1.9,41.4],[2.6,42.4],[2.6,43.4]],12);for(const V of[-1,1])e.push().move(V*3.4,40.6,0).rotZ(-V*.9),e.box(.28,4.6,.3,.08),e.pop();e.push().move(0,41,-2.3).rotX(.8),e.box(.3,3.2,.32,.08),e.pop(),e.pop(),(c&7)===7&&await S()}e.set(0,o.iron,1.15),e.rand=.5;for(let c=0;c<96;c++)e.push().rotY((c+.5)/96*U).move(0,53,127.3),e.box(.22,3,.22,.06),e.pop();e.set(1,o.brassV),e.push().move(0,56.1,0),e.torus(127.3,.4,96,5),e.pop(),e.set(0,o.iron,1.15),e.push().move(0,53.2,0),e.torus(127.3,.26,96,4),e.pop(),await S(),e.set(0,o.stone),e.rand=.7,e.lathe([[160,60.6],[158.7,61.2],[158.7,62.6],[159.3,63.1],[160,63.6]],96,{inward:!0}),e.lathe([[160,125],[158.6,126.4],[158.6,128.6],[157.2,130.2],[157.2,132.8],[155.8,134.2],[155.8,135.8]],96,{inward:!0});for(let c=0;c<24;c++)e.push().rotY(c/24*U),e.uvOn=!0,e.set(12,o.brick,1.08),e.rand=.1*(c%5),e.push().move(0,88.5,159.1),e.box(2.6,36.5,1,.2),e.pop(),e.uvOn=!1,e.set(0,o.stone,.95),e.push().move(0,51.3,158.9),e.box(3.1,1.3,1.3,.25),e.pop(),e.push().move(0,124.3,158.8),e.box(3.2,.9,1.4,.25),e.pop(),e.pop();await S();for(let c=0;c<24;c++){e.push().rotY((c+.5)/24*U),e.uvOn=!1,e.rand=.15+.033*c,e.set(4,o.black),e.poly([[-7,66,159.75],[7,66,159.75],[7,96,159.75],[-7,96,159.75]],[0,0,-1]),e.set(0,o.stone,1);for(const d of[-1,1])e.push().move(d*7.6,77,159.1),e.box(.95,11,.9,.2),e.pop();for(let d=0;d<10;d++){const b=(d+.5)/10*Math.PI;e.push().move(0,88,159.1).rotZ(b).move(7.6,0,0),e.box(.95,1.28,.9,0),e.pop()}e.push().move(0,96.3,158.8),e.box(1.1,1.5,1.2,.2),e.pop(),e.push().move(0,65.2,158.7),e.box(9.4,.8,1.3,.25),e.pop();const V=c*7%11===3?.35:0;e.set(3,o.shutter,.85+.25*(c*3%4)/4);for(const d of[-1,1]){e.push().move(d*6.65,0,159.45).rotY(-d*V*(d>0?1:0)).move(-d*3.32,0,0);for(const b of[-1,1])e.push().move(b*3.05,77,0),e.box(.28,11,.22,0),e.pop();for(let b=0;b<12;b++)e.push().move(0,67+b*1.75,0).rotX(.6),e.box(2.8,.1,.55,0),e.pop();e.pop()}const n=[[0,88,159.4]];for(let d=0;d<=8;d++){const b=d/8*Math.PI;n.push([6.65*Math.cos(b),88+6.65*Math.sin(b),159.4])}e.uvOn=!0,e.poly(n,[0,0,-1],n.map(d=>[d[1],d[0]*3])),e.uvOn=!1,e.push().move(0,88,159.3),e.box(6.65,.3,.2,0),e.pop(),e.pop(),(c&3)===3&&await S()}e.uvOn=!0,e.set(0,o.iron,.9),e.rand=.45,e.lathe([[160,110],[152,110]],96,{rRef:156}),e.lathe([[152,109.3],[152,110]],96,{inward:!0,rRef:152}),e.uvOn=!1,e.set(0,o.ironDark),e.lathe([[152,109.3,.6],[160,109.3,.4]],96),e.set(0,o.iron,1);for(let c=0;c<48;c++)e.push().rotY(c/48*U).move(0,106.4,156.6).rotX(-.62),e.box(.22,.28,4.6,.06),e.pop();for(let c=0;c<96;c++)e.push().rotY((c+.5)/96*U).move(0,112.6,152.3),e.box(.2,2.6,.2,.05),e.pop();e.push().move(0,115.3,0),e.torus(152.3,.36,96,5),e.pop(),e.push().move(0,112.7,0),e.torus(152.3,.24,96,4),e.pop(),await S();for(let c=0;c<4;c++){e.push().rotY(Math.PI/4+c*Math.PI/2+.065),e.uvOn=!1,e.rand=.3+.1*c,e.set(0,o.iron,1.1);for(const V of[-1,1])e.tube([[V*3.4,50,137],[V*1.2,69,124.4]],.5,6),e.tube([[V*3.4,50,131],[V*1.2,69,124.4]],.34,5);e.tube([[-2.4,59.5,131],[2.4,59.5,131]],.3,5),e.tube([[-1.3,69,124.4],[1.3,69,124.4]],.32,6),e.set(1,o.brassV),e.push().move(0,69,124.4).rotZ(Math.PI/2),e.lathe([[.3,-.45],[2.3,-.38],[1.9,0],[2.3,.38],[.3,.45]],18),e.pop(),e.set(0,o.ironDark,1.6),e.push().move(0,51.6,139),e.box(2.2,1.6,2,.3),e.pop(),e.set(6,o.steel),e.push().move(0,53.6,139).rotZ(Math.PI/2),e.lathe([[1.5,-1.9],[1.5,-1.7],[1.1,-1.6],[1.1,1.6],[1.5,1.7],[1.5,1.9]],14),e.pop(),e.set(10,o.rope),e.tube([[0,67.2,122.5],[0,34,122.5],[0,.4,122.5]],.34,5),e.tube([[0,70.6,125.6],[0,54.6,139]],.3,5),e.pop()}await S();for(let c=0;c<12;c++)e.push().rotY((c+.5)/12*U).move(0,56.2,156.9),e.uvOn=!1,e.rand=.4,e.set(0,o.ironDark,1.6),e.push().move(0,.2,.7),e.box(.22,.22,.9,.06),e.pop(),e.push().move(0,-1.3,1).rotX(-.8),e.box(.16,.16,1.2,.05),e.pop(),e.set(1,o.brassV),e.lathe([[.12,0],[.85,.12],[.85,.35],[.55,.5]],10),e.lathe([[.55,2.3],[.9,2.45],[.6,2.9],[.14,3.3],[.01,3.36]],10),e.set(5,o.sconce,1),e.ao=.8,e.rand=0,e.lathe([[.55,.5],[.72,1.4],[.55,2.3]],10,{smooth:!0}),e.ao=1,e.pop();await S()}function _e(v,t,o){const e=[],T=(i,h,f,g,w)=>[i+g*Math.cos(f)+w*Math.sin(f),h-g*Math.sin(f)+w*Math.cos(f)],S=[],c=(i,h,f,g,w=0,m=.5,p=3)=>S.push([i,h,f,g,w,m,p]),V=(i,h,f,g,w)=>{t.uvOn=!0,t.rand=.5,t.set(14,v.paper),t.push().move(i,.07,h).rotY(w),t.poly([[-f/2,0,-g/2],[f/2,0,-g/2],[f/2,0,g/2],[-f/2,0,g/2]],[0,1,0],[[0,0],[1,0],[1,1],[0,1]]),t.pop(),t.uvOn=!1},n=i=>{t.set(1,v.brassV),t.lathe([[.1,i],[.75,i+.1],[.75,i+.3],[.5,i+.42]],10),t.lathe([[.5,i+1.9],[.8,i+2],[.55,i+2.4],[.12,i+2.75],[.01,i+2.8]],10),t.set(5,v.rubyGlass,1),t.ao=.75,t.rand=0,t.lathe([[.5,i+.42],[.62,i+1.15],[.5,i+1.9]],10,{smooth:!0}),t.ao=1,t.rand=.5},d=(i,h,f)=>{t.push().move(i,0,h),t.set(0,v.ironDark,1.8),t.lathe([[1.3,0],[1.3,.3],[.5,.7],[.3,1.2],[.3,f-.7],[.55,f-.5],[.55,f]],8),n(f),t.pop(),e.push([i,f+1.15,h]),c(i,h,1.3,1.3,0,.45,2)},b=(i,h,f)=>{t.set(3,v.wood,1.15),t.push().move(0,f-.3,0),t.box(i,.3,h,.12),t.pop(),t.set(3,v.wood,.8),t.push().move(0,f-1.1,0),t.box(i-.6,.5,h-.6,.1),t.pop();for(const g of[-1,1])for(const w of[-1,1])t.push().move(g*(i-.9),0,w*(h-.9)),t.lathe([[.5,0],[.5,.5],[.3,.9],[.42,f*.45],[.28,f*.6],[.45,f-1.6]],8),t.pop();t.push().move(0,1.6,0),t.box(i-1,.16,.22,.05),t.pop()},A=(i,h,f,g,w,m,p,W)=>{t.set(3,v.wood,W),t.push().move(i,h+w,f).rotY(p),t.box(g,w,m,.14),t.set(3,v.wood,W*.7);for(const R of[-1,1])t.push().move(0,R*(w-.35),0),t.box(g+.08,.22,m+.08,.05),t.pop();t.pop(),h===0&&c(i,f,g,m,p,.6,2.5)};t.uvOn=!1,t.rand=.5,V(o[0],o[1],29,45.6,o[2]);{V(19.8,-78.7,16,25,-.75+Math.PI/2),t.push().move(19.8,0,-78.7).rotY(-.75),b(8,4.6,8.5),c(19.8,-78.7,8,4.6,-.75,.5,4);for(let p=0;p<4;p++)t.set(3,v.paper,.8+.1*p),t.push().move(-4.5+p*.5,9+(p===3?.75:0),-2.6+p*.85-(p===3?1.2:0)).rotY(.12*p).rotZ(Math.PI/2),t.lathe([[.01,-3.4],[.42,-3.4],[.42,3.4],[.01,3.4]],8),t.pop();const g=[v.navy,v.bookRed,v.bookGreen,v.navy];for(let p=0;p<4;p++)t.set(3,g[p],1.2),t.push().move(3.2,8.75+p*.5,2.2).rotY(.3*p-.4),t.box(1.5-.1*p,.24,1.1,.06),t.pop();t.set(1,v.brassV),t.push().move(.4,8.6,1.4).rotY(.5);for(const p of[-1,1])t.push().rotY(p*.22),t.box(.07,.07,1.9,.02),t.pop();t.push().move(0,.1,-1.8),t.lathe([[.01,0],[.26,.05],[.26,.22],[.01,.3]],8),t.pop(),t.pop(),t.push().move(5.6,8.5,-2.4),t.set(0,v.ironDark,1.8),t.lathe([[.8,0],[.8,.2],[.3,.4]],8),n(.3),t.pop(),t.pop();const w=T(19.8,-78.7,-.75,5.6,-2.4);e.push([w[0],10,w[1]]);const m=T(19.8,-78.7,-.75,-2,-8.5);t.set(3,v.wood,.85),t.push().move(m[0],0,m[1]),t.lathe([[2,5.2],[2,5.6],[.01,5.6]],14);for(let p=0;p<3;p++){const W=p/3*U;t.tube([[Math.cos(W)*1.9,0,Math.sin(W)*1.9],[Math.cos(W)*1.2,5.3,Math.sin(W)*1.2]],.22,5)}t.pop(),c(m[0],m[1],2,2,0,.5,2.5)}{c(29,-72.5,3.3,3.3,.6,.5,3),t.push().move(29,0,-72.5).rotY(.6),t.set(3,v.wood,.9);for(let i=0;i<3;i++){const h=i/3*U;t.tube([[Math.cos(h)*3.2,.2,Math.sin(h)*3.2],[Math.cos(h)*1.4,1.6,Math.sin(h)*1.4],[0,2.6,0]],f=>.42-.12*f,6)}t.lathe([[.7,2.2],[.5,2.8],[.34,3.4],[.5,4.2],[.3,4.8],[.3,5.6],[1.6,6],[3.9,6.5]],12),t.set(1,v.brassV),t.push().move(0,6.7,0),t.torus(4.15,.22,36,6),t.pop(),t.push().move(0,6.7,0).rotZ(.41),t.push().rotX(Math.PI/2),t.torus(3.85,.16,36,6),t.pop(),t.set(3,v.globe,1),t.rand=.8,t.ball(3.6,24,14),t.set(1,v.brassV,1.1);for(const i of[-1,1])t.push().move(0,i*3.7,0),t.lathe([[.01,-.25],[.3,-.2],[.3,.2],[.01,.25]],8),t.pop();t.pop(),t.pop(),t.rand=.5}{c(-80,-22,5,5,-.5,.4,4),t.push().move(-80,0,-22).rotY(-.5),t.set(3,v.wood,1);for(let i=0;i<3;i++){const h=i/3*U+.3;t.tube([[Math.cos(h)*5.2,0,Math.sin(h)*5.2],[Math.cos(h)*.5,11.6,Math.sin(h)*.5]],f=>.5-.15*f,6),t.tube([[Math.cos(h)*3,4.9,Math.sin(h)*3],[Math.cos(h+2.094)*3,4.9,Math.sin(h+2.094)*3]],.16,5)}t.set(1,v.brassV),t.lathe([[.9,11.4],[1.1,11.8],[1.1,12.4],[.5,12.7],[.5,13.6]],12);for(const i of[-1,1])t.push().move(i*2.2,14.6,0),t.box(.22,1.5,.5,.1),t.pop();t.push().move(0,13.4,0),t.box(2.5,.25,.7,.1),t.pop(),t.push().move(0,15.6,0).rotX(-.9),t.lathe([[.01,-6.6],[.5,-6.6],[.5,-5.6],[.7,-5.2],[.7,5.6],[1,6],[1,7.4],[.8,7.4],[.01,7.3]],14),t.push().rotZ(Math.PI/2),t.lathe([[.01,-2.3],[.4,-2.3],[.4,2.3],[.01,2.3]],10),t.pop(),t.push().move(1.9,0,0).rotZ(Math.PI/2),t.lathe([[.01,-.12],[2,-.1],[2,.1],[.01,.12]],24),t.pop(),t.pop(),t.pop(),A(-70,0,-30,4.2,1.5,1.6,.5,.9),A(-69,3,-30.5,1.6,.9,1.2,.9,1.1),d(-71,-13,5.4)}{c(-60,60,5.2,2.4,2.3,.6,3),t.push().move(-60,0,60).rotY(2.3),t.set(3,v.wood,.95),t.push().move(0,6.2,0),t.box(5.2,6.2,2.4,.2),t.pop(),t.push().move(0,12.6,0),t.box(5.5,.3,2.7,.12),t.pop();for(let i=0;i<4;i++)for(let h=0;h<3;h++)t.set(3,v.wood,1.15+.1*((h+i)%2)),t.push().move(-3.3+h*3.3,1.9+i*2.9,2.45),t.box(1.45,1.2,.1,.06),t.set(1,v.brassV),t.push().move(0,0,.2).rotX(Math.PI/2),t.lathe([[.01,-.1],[.24,-.08],[.24,.1],[.01,.16]],8),t.pop(),t.pop();t.pop(),A(-49,0,66,2.8,1.9,2.2,.3,.85),A(-45.5,0,61,2,1.4,2,1.1,1),A(-49.4,3.8,66.3,1.9,1.2,1.6,.7,1.1),c(-56,72,2.7,2.7,0,.5,2),t.set(10,v.rope),t.push().move(-56,.4,72);for(let i=0;i<4;i++)t.push().move(0,i*.62,0),t.torus(2.4-.15*i,.36,24,5),t.pop();t.pop(),d(-52,53,5.4)}const q=[58,17.6,-22];{c(58,-22,3.3,2,-Math.PI/2-.3,.6,3),c(49,-34,7.5,2.2,.25,.5,3),t.push().move(58,0,-22).rotY(-Math.PI/2-.3),t.set(3,v.wood,.9),t.push().move(0,1.6,0),t.box(3.3,1.6,2,.2),t.pop();for(const i of[-1,1])t.push().move(i*2.45,11,0),t.box(.35,7.9,1.6,.1),t.pop();t.push().move(0,11,-1.4),t.box(2.2,7.9,.2,.05),t.pop(),t.push().move(0,21.6,0),t.box(3.2,2.9,1.9,.25),t.pop(),t.push().move(0,24.9,0),t.box(3.5,.4,2.2,.15),t.pop(),t.set(1,v.brassV,1.1),t.push().move(0,21.6,1.92).rotX(Math.PI/2),t.lathe([[2.35,-.1],[2.35,0],[2.2,.08],[.01,.08]],28),t.pop(),t.set(3,v.paper,1.25),t.push().move(0,21.6,2.02).rotX(Math.PI/2),t.lathe([[1.95,.02],[.01,.02]],28),t.pop(),t.set(0,v.ironDark,.6),t.push().move(0,21.6,2.08),t.push().rotZ(.9),t.push().move(0,.65,0),t.box(.07,.75,.03,0),t.pop(),t.pop(),t.push().rotZ(-2.2),t.push().move(0,.45,0),t.box(.09,.5,.03,0),t.pop(),t.pop(),t.pop(),t.pop(),t.bone=19,t.push().move(58,0,-22).rotY(-Math.PI/2-.3),t.set(6,v.steel,.9),t.push().move(0,12.4,.2),t.box(.09,5.2,.06,.02),t.pop(),t.set(1,v.brassV,1.2),t.push().move(0,7,.2).rotX(Math.PI/2),t.lathe([[.01,-.28],[1.25,-.12],[1.25,.12],[.01,.28]],20),t.pop(),t.pop(),t.bone=0,t.push().move(49,0,-34).rotY(.25),t.set(3,v.wood,.85),t.push().move(0,4.4,0),t.box(7.5,.3,2.2,.1),t.pop();for(const i of[-1,1])t.push().move(i*6.4,2.1,0),t.box(.3,2.1,1.9,.08),t.pop();t.pop(),A(46,4.7,-35,2.2,1,1.4,.4,1.1),A(52.5,4.7,-33,1.5,1.6,1.3,.1,.75),t.set(1,v.brassV),t.push().move(49.5,5.6,-34).rotY(.25).rotZ(Math.PI/2-.2),t.lathe([[.01,-2.4],[.5,-2.4],[.5,-1.6],[.62,-1.4],[.62,2],[.8,2.2],[.8,2.8],[.01,2.8]],12),t.pop(),d(51,-12,5.4)}return{lamps:e,pend:q,feet:S}}function Oe(v,t,o,e,T){const S=[],c=(n,d,b,A,q=0,i=.5,h=3)=>S.push([n,d,b,A,q,i,h]);e.half&&c(e.x,e.z,e.half[0],e.half[1],e.rot||0,.5,4),T&&c(T.x,T.z,T.w/2,T.d/2,T.ry,.55,2.5),o.uvOn=!1,o.rand=.55,c(17,-65,3,5.8,Math.PI/2-.25,.45,3),o.push().move(17,0,-65).rotY(Math.PI/2-.25),o.rand=.5625,o.set(3,t.wood);for(const n of[-1,1])o.push().move(n*2.6,1.9,0),o.box(.35,.35,5.6,.1),o.pop(),o.push().move(n*2.2,12.1,-.2).rotX(-.3),o.box(.3,10.9,.5,.1),o.pop(),o.push().move(n*2.6,11.6,-4.4),o.box(.3,9.9,.3,.08),o.pop(),o.push().move(n*2.6,8.5,-1.2).rotX(.62),o.box(.16,.25,5.4,.05),o.pop();for(const n of[-5.2,5.2])o.push().move(0,1.9,n),o.box(2.9,.35,.35,.1),o.pop();for(let n=0;n<13;n++){const d=3.3+n*1.48;o.push().move(0,d,3.1-(d-1.9)*.309),o.box(2.2,.14,.48,.04),o.pop()}o.push().move(0,21.6,-3.5),o.box(3,.22,2.4,.08),o.pop();for(const n of[-1,1])for(const d of[-1.3,-5.6])o.push().move(n*2.8,21.8,d),o.set(0,t.ironDark,1.9),o.lathe([[.42,0],[.42,.3],[.26,.5],[.2,2],[.28,2.2],[.2,2.4],[.2,4]],8),o.set(1,t.brassV),o.lathe([[.2,4],[.36,4.1],[.4,4.45],[.24,4.75],[.01,4.8]],8),o.pop();o.set(0,t.ironDark,2.6);for(const n of[-1,1])o.push().move(n*2.8,26.05,-3.45).rotX(Math.PI/2),o.lathe([[.3,-2.2],[.3,2.2]],8),o.pop();o.push().move(0,26.05,-5.6).rotZ(Math.PI/2),o.lathe([[.3,-2.85],[.3,2.85]],8),o.pop(),o.set(3,t.wood,1.1);for(const n of[-1,1])o.push().move(n*2.8,23.9,-3.45),o.box(.12,.26,2.15,.05),o.pop();o.push().move(0,23.9,-5.6),o.box(2.8,.26,.12,.05),o.pop(),o.set(0,t.ironDark,1.8);for(const n of[-1,1])for(const d of[-4.6,4.6])o.push().move(n*3.05,1,d).rotZ(Math.PI/2),o.lathe([[.25,-.3],[1,-.25],[1,.25],[.25,.3]],12),o.pop();o.pop(),o.rand=.55,c(27,-58,2,2,0,.5,2.5),c(39.5,-63,3.6,2.4,.4,.6,2.5),c(34,52,5,3,.7,.45,3),o.set(3,t.wood,.85),o.push().move(27,0,-58),o.lathe([[2,3.6],[2,4],[.01,4]],14);for(let n=0;n<3;n++){const d=n/3*U;o.tube([[Math.cos(d)*1.7,0,Math.sin(d)*1.7],[Math.cos(d)*1.2,3.7,Math.sin(d)*1.2]],.22,5)}o.pop(),o.push().move(39.5,1.5,-63).rotY(.4),o.box(3.6,1.5,2.4,.15),o.set(1,t.brassV);for(let n=0;n<4;n++)o.push().move(-2.2+n*1.45,1.5,n%2*.5-.3),o.lathe([[.5,0],[.5,1],[.35,1.2],[.35,1.8],[.01,1.85]],10),o.pop();o.pop(),o.push().move(34,0,52).rotY(.7),o.set(3,t.wood,.9),o.push().move(0,5.2,0),o.box(5,.3,3,.1),o.pop(),o.push().move(0,2,0),o.box(4.6,.2,2.6,.08),o.pop();for(const n of[-1,1])for(const d of[-1,1])o.push().move(n*4.4,2.8,d*2.5),o.box(.25,2.6,.25,.06),o.pop();o.set(1,t.brassV),o.push().move(-1,6.6,0).rotZ(Math.PI/2-.25),o.lathe([[.9,-3.4],[1.1,-3.2],[1.1,-2.2],[.8,-2],[.8,2.6],[1.3,2.9],[1.3,3.6],[.9,3.6]],14),o.pop(),o.push().move(2.6,5.5,.6),o.lathe([[1.2,0],[1.2,.3],[.3,.6],[.3,2],[.9,2.3],[.9,2.9],[.01,3]],12),o.pop(),o.pop(),o.set(0,t.ironDark,1.8);for(let n=0;n<4;n++)o.push().rotY(Math.PI/4+n*Math.PI/2+.065).move(0,.5,122.5),o.box(.9,.5,.9,.15),o.pop();const V=e.top;o.push().move(e.x,V,e.z).rotY(e.rot||0),o.set(1,t.brassV);for(const n of e.weights)o.push().move(n[0],.03,n[1]),o.lathe([[.75,0],[.8,.12],[.8,.5],[.55,.62],[.2,.66],[.2,.95],[.32,1.1],[.01,1.2]],12),o.pop();o.set(3,t.wood,.8),o.push().move(e.chrono[0],.75,e.chrono[1]).rotY(.3),o.box(1.9,.75,1.9,.12),o.push().move(0,2.2,-2.05).rotX(-.18),o.box(1.9,1.75,.14,.05),o.pop(),o.set(1,t.brassV);for(const n of[-1,1])o.push().move(n*1.92,.2,1.3),o.box(.06,.35,.25,0),o.pop();if(o.pop(),o.pop(),T){o.push().move(T.x,0,T.z).rotY(T.ry),o.rand=.9;const n=T.w*.44,d=-T.d*.5+.2,b=T.h+.25,A=[[d+1.7,b-6.6],[d+1.4,b-5],[d+1.15,b-3.2],[d+.95,b-1.5],[d+.75,b-.35],[d+.3,b+.05],[d-.3,b-.1],[d-.75,b-1],[d-.95,b-2.6],[d-1.05,b-4.4],[d-1.2,b-6.2],[d-1.45,b-7.9],[d-1.8,b-9.3]],q=14,i=A.length,h=5,f=(w,m)=>{const p=w/q*2-1,W=A[m],R=Math.abs(m-h)/(i-1-h),O=.06+.5*R*R,Y=m>h?-1:1,y=Math.sin(w*1.75+.6*Math.sin(m*.7))+.4*Math.sin(w*3.1+m*.5);return[p*n*(1+.16*R)+.12*O*Math.cos(w*1.75),W[1]-.35*p*p*(1-R)+.25*O*Math.sin(w*.9+m),W[0]+Y*O*(.7+.7*y)]},g=(w,m)=>{const p=Math.abs(m-h)/(i-1-h);return .62+.38*(.5+.5*Math.sin(w*1.75+.6*Math.sin(m*.7)))*(.4+.6*p)+.38*(1-p)*.6};for(let w=0;w<i-1;w++)for(let m=0;m<q;m++){const p=f(m,w),W=f(m+1,w),R=f(m+1,w+1),O=f(m,w+1),Y=A[w+1][0]-A[w][0],y=-(A[w+1][1]-A[w][1]),L=Math.hypot(Y,y)||1,V0=[0,-Y/L,-y/L],l0=[R[0]-p[0],R[1]-p[1],R[2]-p[2]],e0=[O[0]-W[0],O[1]-W[1],O[2]-W[2]];let j=[l0[1]*e0[2]-l0[2]*e0[1],l0[2]*e0[0]-l0[0]*e0[2],l0[0]*e0[1]-l0[1]*e0[0]];const v0=Math.hypot(j[0],j[1],j[2])||1;j=j.map(c0=>c0/v0),j[0]*V0[0]+j[1]*V0[1]+j[2]*V0[2]<0&&(j=j.map(c0=>-c0)),o.set(3,t.coat,g(m+.5,w+.5)),o.poly([p,W,R,O],j)}for(const w of[-1,1]){o.set(3,t.coat,.85);const m=[w*n*.98,b-.5,d-.5],p=[w*n*1.12,b-2.6,d-1.1],W=Math.hypot(p[0]-m[0],p[1]-m[1],p[2]-m[2]),R=O=>m.map((Y,y)=>Y-(p[y]-Y)/W*O);o.tube([R(.5),R(.42),R(.22),m,p,[w*n*1.1,b-5,d-1.25],[w*n*1.02,b-7.4,d-1.1]],O=>{const Y=Math.round(O*6);return Y<3?[.06,.36,.62][Y]:.7-.22*(Y-3)/3},7,{u0:-.5}),o.set(3,t.coat,1.5),o.push().move(w*n*1.02,b-7.3,d-1.1),o.lathe([[.52,-.5],[.56,.1],[.5,.2]],8),o.pop()}o.set(3,t.coat,2.4),o.tube([[-n*.8,b+.12,d+.5],[0,b+.4,d+.3],[n*.8,b+.12,d+.5]],.42,6),o.push().move(0,b-4,d-1.32),o.box(n*.5,.26,.08,.03),o.pop(),o.set(1,t.brassV);for(const w of[-1,1])o.push().move(w*n*.42,b-4,d-1.42).rotX(Math.PI/2),o.lathe([[.01,0],[.2,.02],[.2,.08],[.01,.12]],8),o.pop();o.pop()}return S}function je(v){const t=[],o=[],e=[],T=[],S=(i,h,f)=>{const g=t.length/3;for(const w of i)t.push(h*w[0],.02*(f===2?-1:1)+.05*w[0]*w[0],w[1]),o.push(h,Math.min(1,w[0]/.8),f),e.push(w[0]/.86,w[1]*1.6+.5);for(let w=1;w<i.length-1;w++)T.push(g,g+w,g+w+1)},c=v?[[.05,.14],[.3,.27],[.6,.35],[.82,.34],[.9,.27],[.84,.12],[.7,-.02],[.5,-.1],[.3,-.12],[.05,-.08]]:[[.05,.16],[.3,.3],[.58,.36],[.78,.33],[.86,.26],[.84,.14],[.74,0],[.6,-.1],[.34,-.14],[.05,-.08]],V=v?[[.05,-.02],[.3,-.07],[.52,-.12],[.62,-.24],[.6,-.4],[.5,-.56],[.36,-.66],[.2,-.56],[.05,-.32]]:[[.05,-.02],[.32,-.08],[.56,-.14],[.68,-.26],[.66,-.42],[.52,-.54],[.32,-.58],[.14,-.5],[.05,-.34]];for(const i of[-1,1])S(V,i,2),S(c,i,1);const n=v?.85:1,d=[[.42,0],[.38,.07],[.24,.14],[.04,.13],[-.25,.105],[-.5,.06],[-.64,0]],b=8,A=t.length/3;for(let i=0;i<d.length;i++)for(let h=0;h<=b;h++){const f=h/b*Math.PI*2,g=d[i][1]*n;t.push(Math.sin(f)*g,-Math.cos(f)*g*.9+.01,d[i][0]),o.push(0,0,0),e.push(.5-d[i][0],h/b)}for(let i=0;i<d.length-1;i++)for(let h=0;h<b;h++){const f=A+i*(b+1)+h,g=f+b+1;T.push(f,g,f+1,f+1,g,g+1)}for(const i of[-1,1]){const h=t.length/3,f=v?.05:.06;for(const g of[[.04,.38,-f],[.04,.38,f],[.22,.66,f*.5],[.19,.69,-f*.5]])t.push(i*(g[0]+g[2]*.8),.05+(g[1]-.38)*.35,g[1]-g[2]*.5),o.push(0,0,0),e.push(.3,.5);T.push(h,h+1,h+2,h,h+2,h+3)}const q=new l.BufferGeometry;return q.setAttribute("position",new l.Float32BufferAttribute(t,3)),q.setAttribute("aW",new l.Float32BufferAttribute(o,3)),q.setAttribute("uv",new l.Float32BufferAttribute(e,2)),q.setIndex(T),q}function Xe(v){const t=[],o=[],e=[],T=[];for(const c of v){const V=c.n??1,n=t.length/3,d=Math.cos(c.rot||0),b=Math.sin(c.rot||0);for(let A=0;A<=V;A++)for(let q=0;q<=V;q++){const i=q/V,h=A/V,f=(i-.5)*c.w,g=(h-.5)*c.d;t.push(c.x+d*f+b*g,c.y,c.z-b*f+d*g),o.push(i,1-h);const w=c.corner?c.corner[0]>0?i:1-i:0,m=c.corner?c.corner[1]>0?h:1-h:0;e.push(c.kind,c.corner?Math.max(0,(w+m-1.15)/.85):0)}for(let A=0;A<V;A++)for(let q=0;q<V;q++){const i=n+A*(V+1)+q,h=i+V+1;T.push(i,h,i+1,i+1,h,h+1)}}const S=new l.BufferGeometry;return S.setAttribute("position",new l.Float32BufferAttribute(t,3)),S.setAttribute("uv",new l.Float32BufferAttribute(o,2)),S.setAttribute("aK",new l.Float32BufferAttribute(e,2)),S.setIndex(T),S}var Qe={id:"great-refractor",name:"The Dome Opens",category:"interior",weirdness:.1,media:["air","tiny","interior"],async build(v){const t=v.rng,o=v.quality?.detail??1,e=v.vary||{},T=e.density??1,S=()=>v.yield(),c=v.seed>>>0;let V=(c*7+(c>>>2))%4;e.hour==="dawn"&&(V=3);const n=Fe[V],d=!!e.rare,b=t.fork("cast"),A=b.chance(.45),q=Math.max(10,Math.round(18*T)),i=b.range(0,U),h=new l.Scene;h.background=new l.Color(n.bg),h.fog=new l.FogExp2(n.fog,n.fogD);const f=[62.8,20,-130.4],g=[-.776,.63],w=(()=>{const a=f[0]*g[0]+f[2]*g[1],s=f[0]*f[0]+f[2]*f[2]-24649,r=-a+Math.sqrt(a*a-s);return Math.atan2(f[0]+g[0]*r,f[2]+g[1]*r)*180/Math.PI})(),m=await Ve(v,{palette:lt,star:n.starHi,starLow:n.starLo,frost:n.frost,beam:.002,lampGain:n.rubyGain,clockAt:[.11,.17],portalRadius:6,track:0,cloud:n.cloud?.9:0,creep:2.5,creepRate:.17,creepEarly:1.5,flicker:.3,deckKey:n.deckKey,fill:n.fill,deckColor:ae,domeTurn:w,domeEase:"cubic",fittings:"brass"});m.setStarColor(n.star,n.dome??n.star),m.setLampGlow(n.ruby,n.rubyGain);const p=m.lit.uniforms,W=p.uSlit.value.x;p.uDomeL.value.x=n.domeL[0],p.uDomeL.value.y=n.domeL[1],m.setAmbientShare(n.amb[0],n.amb[1]*1.45,n.amb[2],n.amb[3]),p.uAmbSky.value.set(n.ambSky[0],n.ambSky[1],n.ambSky[2]),p.uAmbGnd.value.set(n.ambGnd[0],n.ambGnd[1],n.ambGnd[2]),h.add(m.object);const R=m.anchors,O=m.floorGroup,Y=m.object.getObjectByName("machine").material;await S();const y=R.axis,L=R.pivot,V0=a=>[L.x+y.x*a,L.y+y.y*a,L.z+y.z*a],l0=R.portalSeat.position,e0=(a,s,r=0)=>[f[0]+g[0]*a-.63*r,s,f[2]+g[1]*a-.776*r],j=(a,s,r)=>[L.x+y.x*a+s,L.y+y.y*a+y.z*r,L.z+y.z*a-y.y*r],v0=Le([f,e0(24,20),e0(50,20.5),e0(76,22),e0(96,26.5),[-24,33,-60],[-44,46,-66],[-54,58,-58],[-52,65,-46],[-56,68,-20],[-62,72,0],[-80,82,10],[-104,97,8],[-126,103,-14],[-130,102,-45],[-116,97,-73],[-66,142,-18],[-50,172,14],[-28,192,34],[0,206,22],[32,178,6],[58,134,-10],[74,98,-30],[74,80,-62],[50,70,-94],[15,62,-109],[0,61.5,-97],V0(-115),V0(-91),j(-55,2.4,-1.2),j(-15,3.2,-1),j(30,1.5,0),V0(70),[l0.x,l0.y,l0.z]]),c0=v0.length,B=(a,s,r)=>new l.Color(a,s,r),ct={brick:B(.36,.28,.27),flag:B(.3,.31,.34),deck:new l.Color(ae),iron:B(.2,.25,.34),ironDark:B(.085,.1,.14),stone:B(.44,.47,.52),shutter:B(.2,.29,.42),brassV:B(.46,.46,.46),steel:B(.42,.45,.5),black:B(.02,.022,.03),rope:new l.Color("#8f8468").multiplyScalar(.6),wood:B(.3,.21,.14),coat:B(.036,.04,.06),sconce:B(.78,.075,.04),rubyGlass:new l.Color(lt[4]),paper:B(.52,.53,.5),navy:B(.028,.05,.14),globe:B(.035,.05,.1),bookRed:B(.26,.03,.045),bookGreen:B(.03,.13,.08),rail:B(.56,.35,.09)},{Geo:xt}=m.lit,z0=(a,s,r,x,M)=>{const I=new l.Mesh(s,r);return I.name=x,I.frustumCulled=!1,M!=null&&(I.renderOrder=M),a.add(I),I};{const a=new xt(48e3);await Ye(v,m,ct,a),await S();const s=a.build();await S(),z0(h,s,Y,"drum")}await S();const D0=-24,U0=-66,A0=12,_=9,B0=Math.atan2(g[0],g[1]),Wt=Math.cos(B0),Kt=Math.sin(B0),b0=(a,s)=>[D0+a*Wt+s*Kt,U0-a*Kt+s*Wt],o0=new l.Group;o0.name="desk",o0.position.set(D0,0,U0),o0.rotation.y=B0,O.add(o0);const H0=it.makeLightRig({scale:A0,sunIntensity:0,ambient:2.6,ambientSky:n.kitSky,ambientGround:n.kitGnd,bounce:0,fill:0,aoStrength:.7}),P0={x:-9.5,z:-9.8,ry:.4},gt=[8.5,_,3.4],yt=[-12.4,_,3.5];await S();const kt=it.makeFurniture({rig:H0,rng:t.fork("desk"),scale:A0,sway:{amp:.035,freq:1.6},items:[{kind:"table",position:[0,0,0],opts:{width:2.5,depth:1,height:_/A0,legs:"turned",color:"#6b4a35"}},{kind:"lamp",position:gt,rotation:Math.PI,opts:{kind:"desk",shadeColor:"#1c8a50",glow:.8},light:{color:"#46d68c",intensity:15,range:70}}]});o0.add(kt.object),await S();const Mt=it.makeFurniture({rig:H0,rng:t.fork("desk1"),scale:A0,items:[{kind:"chair",position:[P0.x,0,P0.z],rotation:P0.ry,opts:{style:"arm",color:"#5a4334",seatColor:"#3f6a56"}}]});o0.add(Mt.object),await S();const Ct=it.makeFurniture({rig:H0,rng:t.fork("desk2"),scale:A0,sway:{amp:.035,freq:1.6},items:[{kind:"cup",position:yt,opts:{color:"#dfe6ea",tea:"#2a1a12"}},{kind:"bookStack",position:[12.6,_,-1.6],rotation:-.3,opts:{count:4}},{kind:"bookStack",position:[12.4,_,3.6],rotation:.5,opts:{count:2}}]});o0.add(Ct.object),await S();const Dt=it.makeFurniture({rig:H0,rng:t.fork("desk3"),scale:A0,sway:{amp:.035,freq:1.6},items:[{kind:"plant",position:[-13,_,-3],opts:{kind:"fern",height:.52,potColor:"#6d7f95"}}]});o0.add(Dt.object),await S();const ht=Mt.items.find(a=>a.kind==="chair"),re=kt.items.find(a=>a.kind==="lamp"),Q0=new l.Vector3(gt[0],_+(re?.size?.[1]??4.8)*.78,gt[2]-.8),E0=new l.Vector3(b0(Q0.x,Q0.z)[0],Q0.y,b0(Q0.x,Q0.z)[1]),ie=[{kind:1,x:4.2,y:_+.03,z:-.6,w:10.5,d:8.6,rot:.16,n:8,corner:[1,-1]},{kind:0,x:-2.6,y:_+.06,z:-.2,w:11.6,d:10.6,rot:-.1,n:10,corner:[-1,-1]},{kind:2,x:-9.6,y:_+.5,z:-1.2,w:5.2,d:3.6,rot:-.12,n:1},{kind:3,x:-9.2,y:_+1.53,z:3.4,w:3.3,d:3.3,rot:.3,n:1}],pt={uTime:{value:0},uLamp:{value:new l.Vector4(0,0,0,46)},uLampCol:{value:new l.Color("#46d68c").multiplyScalar(3.4)},uAmb:{value:new l.Vector3(n.ambSky[0],n.ambSky[1],n.ambSky[2]).multiplyScalar(.5)},uHand:{value:0}},le=new l.ShaderMaterial({uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...pt},vertexShader:Ce,fragmentShader:De,fog:!0,side:l.DoubleSide});z0(o0,Xe(ie),le,"papers");const Y0=new l.Group;Y0.position.set(-4.2,_+.2,-3.4),Y0.rotation.y=-.5,o0.add(Y0);let T0=null;await S();{const a=new xt(12e3),s=Oe(m,ct,a,{x:D0,z:U0,rot:B0,top:_,half:[A0*2.5/2,A0*1/2],weights:[[9,3.2],[-.4,-4.9],[2.4,4.3],[-7.6,4.6],[3,-4.6]],chrono:[-9.2,3.4]},ht?{x:b0(P0.x,P0.z)[0],z:b0(P0.x,P0.z)[1],ry:P0.ry+B0,w:ht.size[0],d:ht.size[2],h:ht.size[1]}:null);await S(),a.set(3,B(.1,.13,.2)),a.push().move(b0(-9.6,-1.2)[0],_+.24,b0(-9.6,-1.2)[1]).rotY(B0-.12),a.box(2.75,.24,1.95,.08),a.pop(),await S(),T0=_e(ct,a,[b0(-1.5,-3)[0],b0(-1.5,-3)[1],B0+Math.PI/2]);{const x=s.concat(T0.feet).slice(0,p.uFootA.value.length);x.forEach((M,I)=>{p.uFootA.value[I].set(M[0],M[1],Math.cos(M[4]),Math.sin(M[4])),p.uFootB.value[I].set(M[2],M[3],M[6],Math.min(.85,M[5]*1.5))}),p.uFootN.value=x.length}await S(),z0(O,a.build(),Y,"deck-set");const r=new xt(300);r.set(3,B(.5,.36,.1)),r.push().rotZ(Math.PI/2),r.lathe([[.01,-2.2],[.13,-1.8],[.13,1.9],[.01,1.9]],6),r.set(4,ct.black),r.lathe([[.02,-2.25],[.05,-2.1],[.01,-2.1]],5),r.pop(),z0(Y0,r.build(),Y,"pencil")}await S();const N={uRot:{value:new l.Matrix3},uTime:{value:0},uLook:{value:new l.Vector4(n.mw,n.lmc,n.cloud,n.dawn)},uLook2:{value:new l.Vector4(n.comet,n.vap,1,n.core)},uMetA:{value:new l.Vector3(0,1,0)},uMetB:{value:new l.Vector3(0,1,.01)},uMet:{value:new l.Vector4(0,0,0,1)},uMoon:{value:new l.Vector3(.5,.7,.42).normalize()},uMet2:{value:new l.Vector2(2,0)},uSwing:{value:new l.Vector2(0,0)}};{const r=Math.PI/2+Math.asin(.20625)+.06,x=30,M=8,I=W+9,K=[],E=[];for(let k0=0;k0<=x;k0++)for(let d0=0;d0<=M;d0++){const G=-I+2*I*d0/M,t0=-.06+(r- -.06)*k0/x,I0=Math.sqrt(163.6*163.6-G*G);K.push(G,I0*Math.sin(t0),I0*Math.cos(t0))}for(let k0=0;k0<x;k0++)for(let d0=0;d0<M;d0++){const G=k0*(M+1)+d0,t0=G+M+1;E.push(G,G+1,t0,G+1,t0+1,t0)}const Z0=new l.BufferGeometry;Z0.setAttribute("position",new l.Float32BufferAttribute(K,3)),Z0.setIndex(E),z0(m.domeGroup,Z0,new l.ShaderMaterial({uniforms:N,vertexShader:Re,fragmentShader:qe,side:l.DoubleSide,fog:!1}),"sky-in-slit",2)}const ut=[[0,0,14],[.08,0,32],[.14,0,40],[.24,0,45],[.6,0,48],[.75,-8,34],[1,-8,34]],Ut=(a,s)=>{let r=0;for(;r<ut.length-2&&a>ut[r+1][0];)r++;const x=ut[r],M=ut[r+1];return x[s]+(M[s]-x[s])*z(x[0],M[0],a)},a0=new l.Vector3(.213,.793,.57).normalize(),h0=new l.Vector3().crossVectors(a0,new l.Vector3(.963,-.114,-.245)).normalize(),w0=new l.Vector3().crossVectors(a0,h0),St=new l.Color(n.star),zt=new l.Color(.08,1,.24).multiplyScalar(2.3),$0=Math.PI/180,Et=163.6;await S();const dt=[],Yt=a=>v0.distanceTo(a.x,a.y,a.z)>16&&v0.distanceTo(a.x,a.y+50,a.z)>16;for(const a of R.lamps)a.ridesFloor&&Yt(a.position)&&dt.push(a.position);for(const a of T0.lamps){const s=new l.Vector3(a[0],a[1],a[2]);Yt(s)&&dt.push(s)}const _t=26,At=6,ce=2,F0=q+2,J0=F0+_t,G0=J0+ce,p0=G0+dt.length*2,R0=7,he={uFlap:{value:A?15:11},uColA:{value:B(A?.5:.52,.47,.38)},uColB:{value:A?B(.2,.2,.24):B(.17,.14,.12)},uColC:{value:A?B(.3,.4,.52):B(.55,.26,.27)},uPlume:{value:A?1:0}},Pt=je(A);{const a=new Float32Array(p0+R0),s=new Float32Array(p0+R0);for(let r=0;r<p0;r++)a[r]=b(),s[r]=.9+.25*(r*7%5)/4;for(let r=p0;r<p0+R0;r++)a[r]=r*.618034%1,s[r]=2.6;Pt.setAttribute("aPh",new l.InstancedBufferAttribute(a,1)),Pt.setAttribute("aTone",new l.InstancedBufferAttribute(s,1))}const _0=new l.InstancedMesh(Pt,new l.ShaderMaterial({uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...p,...he},vertexShader:We,fragmentShader:Ke(m.lit.lightGLSL),defines:{BEAM_STEPS:4},fog:!0,side:l.DoubleSide}),p0+R0);_0.name="moths",_0.frustumCulled=!1,h.add(_0);const s0=[];for(let a=0;a<p0;a++)s0.push({r:b.range(3.6,10.5),w:b.range(.5,1.1)*(b.chance(.5)?1:-1),a:b.range(0,U),h:b.range(-1.8,4.6),wob:b.range(.6,1.6),size:b.range(.85,1.1)});for(let a=2;a<F0;a++){const s=s0[a],r=a%3===0;s.r=r?6+.7*s.r:2.6+.3*s.r,s.h=r?.6+1*Math.abs(s.h):s.h*.6,s.size*=(r?1.3:1.1)*(.74+.13*(a*3%5)),r&&(s.w*=.55)}s0[0].size=1.15,s0[1].size=1.1;for(let a=F0;a<J0;a++){const s=s0[a];s.s=-86+84*(a-F0+b())/_t,s.r=b.range(14.5,19),s.w*=.6,s.a=b.range(-1,1),s.size*=1.15,a<F0+At&&(s.a=b.range(-.75,.25),s.size*=.9)}for(let a=J0;a<G0;a++)s0[a].size*=1.45;for(let a=G0;a<p0;a++){const s=s0[a];s.r=1.6+.22*s.r,s.h=.4*s.h,s.size*=.95}const Ot={value:0},pe=Math.round(5e3*o*T),Tt={...p,uBox:{value:new l.Vector3(96,64,96)},uSizeK:{value:.0028},uDustGain:{value:1.7},uPiv:{value:L.clone()},uAx:{value:y.clone()},uE1:{value:new l.Vector3(1,0,0)},uE2:{value:new l.Vector3(0,y.z,-y.y)}};{const a=t.fork("dust"),s=[-1,-1,0,1,-1,0,1,1,0,-1,1,0];for(const[r,x]of[[pe,!1],[Math.round(2400*o),!0]]){const M=new l.InstancedBufferGeometry;M.instanceCount=r,M.setAttribute("position",new l.Float32BufferAttribute(s,3)),M.setIndex([0,1,2,0,2,3]);const I=new Float32Array(r*4);for(let K=0;K<r*4;K++)I[K]=a();M.setAttribute("aS",new l.InstancedBufferAttribute(I,4)),z0(h,M,new l.ShaderMaterial({uniforms:Tt,vertexShader:se(m.lit.lightGLSL),fragmentShader:ne,defines:x?{TUBE:""}:{},transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,fog:!1}),x?"tube-dust":"dust",6)}}const ue=Rt(qt("great-refractor:starlit:"+c));{const a=Math.round(2400*o),s=new l.InstancedBufferGeometry;s.instanceCount=a,s.setAttribute("position",new l.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),s.setIndex([0,1,2,0,2,3]);const r=new Float32Array(a*4);for(let x=0;x<a*4;x++)r[x]=ue();s.setAttribute("aS",new l.InstancedBufferAttribute(r,4)),z0(h,s,new l.ShaderMaterial({uniforms:Tt,vertexShader:se(m.lit.lightGLSL),fragmentShader:ne,defines:{BAR:""},transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,fog:!1}),"bar-dust",6)}await S();const O0=[],tt=[],et=[],ot=[];for(const a of R.lamps)O0.push({base:a.position.clone(),rides:a.ridesFloor}),tt.push(a.position.clone()),et.push(new l.Color(lt[4]).multiplyScalar(.25+.75*n.ruby)),ot.push(a.ridesFloor?1:.8);O0.push({base:E0.clone(),rides:!0}),tt.push(E0.clone()),et.push(new l.Color("#46d68c")),ot.push(1.7);for(const a of T0.lamps){const s=new l.Vector3(a[0],a[1],a[2]);O0.push({base:s,rides:!0}),tt.push(s.clone()),et.push(new l.Color(lt[4]).multiplyScalar(.25+.75*n.ruby)),ot.push(.9)}for(let a=0;a<12;a++){const s=(a+.5)/12*U,r=new l.Vector3(Math.sin(s)*156.9,57.6,Math.cos(s)*156.9);O0.push({base:r,rides:!1}),tt.push(r),et.push(new l.Color(1,.16,.07).multiplyScalar(.3+.7*n.ruby)),ot.push(1)}const Lt=Ie.makeGlows({rng:t.fork("glows"),positions:tt,colors:et,sizes:ot,size:5.5,intensity:.8,time:Ot,flicker:.25,halo:1,core:.6,fogAmount:.6});h.add(Lt.object);{const a=Rt(qt("great-refractor:sky-swing:"+c));N.uSwing.value.set(a.range(0,U),a.range(0,U))}const de=44,jt=[],Xt=Y.uniforms.uBone.value[2];{const a=Rt(qt("great-refractor:risers:"+c)),s=a();for(let r=0;r<R0;r++)jt.push({ph:s+(r+.5*a())/R0,a:.8+(a.range(.35,1.25)-.35)*(.5/.9),w:a.range(.5,1),wob:a.range(.7,1.5),r:17.45+(a.range(15.4,17.6)-15.4)*(.4/2.2),size:a.range(.85,.92)})}const It={uTime:{value:0},uBase:{value:new l.Vector3},uSize:{value:.9},uCol:{value:B(.1,.13,.17)}};{const s=new l.InstancedBufferGeometry;s.instanceCount=14,s.setAttribute("position",new l.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),s.setIndex([0,1,2,0,2,3]);const r=new Float32Array(42);for(let x=0;x<42;x++)r[x]=b();s.setAttribute("aS",new l.InstancedBufferAttribute(r,3)),z0(h,s,new l.ShaderMaterial({uniforms:It,vertexShader:Ue,fragmentShader:Ee,transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,fog:!1}),"steam",5)}await S();const P=l.Vector3,Nt=new P(0,1,0),x0=new P().copy(E0),Z=new P,L0=new P,n0=new P,Ne=new P,r0=new P,H=new P,g0=new P,i0=new P,$=new P,ft=new l.Matrix4,Zt=new P,Ht=new l.Vector2,fe=v.renderer,q0=new P(0,0,1),W0=new P(1,0,0),K0=new P(0,1,0),mt=new P,X=new P,J=new P,u0=new P,j0=new P,X0=new P,vt=new P;let Qt=!1,at=1,st=0;const nt=(a,s,r)=>{const x=Math.sqrt(Et*Et-a*a),M=x*Math.sin(s),I=x*Math.cos(s);return r.set(a*at+I*st-vt.x,L.y+M-vt.y,-a*st+I*at-vt.z).normalize()};m.setLamp(7,x0,"#46d68c",76,6.4);const rt=T0.lamps.slice(0,4),Vt=[];for(let a=0;a<rt.length;a++)m.setLamp(3+a,new l.Vector3(rt[a][0],rt[a][1],rt[a][2]),lt[4],34,n.rubyGain*.85,.3),Vt.push(m.state.userLamps[3+a]);p.uRing.value.z=54,p.uRing2Col.value.set(1,.2,.09).multiplyScalar(n.sconce),p.uRing2.value.z=50,n.dawn?p.uWinCol.value.set(.16,.7,.66).multiplyScalar(.6):n.cloud?p.uWinCol.value.set(.56,.68,1).multiplyScalar(1.7):p.uWinCol.value.set(.2,.4,1).multiplyScalar(.8+.5*n.frost);const me=p.uWinCol.value.clone();p.uBounce.value.set(1,.4,.22,0).multiplyScalar(.2*(.35+.65*n.ruby)),p.uDomeK.value.y=70,p.uDomeK.value.z=.45,p.uWarm.value.set(.05,.026,.008).multiplyScalar(.6+.4*n.ruby),p.uDomeWarm.value.set(1,.36,.2).multiplyScalar(.3*(.35+.65*n.ruby));{const a=m.lens.uniforms;a.uLensLook.value.set(Math.max(n.mw,.6)+.5*n.core,n.lmc,0,n.dawn),a.uLensLook2.value.set(n.core,n.comet,0,0)}const N0=new l.Vector3(T0.pend[0],T0.pend[1],T0.pend[2]),ve=new l.Vector3(Math.sin(-Math.PI/2-.3),0,Math.cos(-Math.PI/2-.3)),be=p.uBone.value[19],we=new l.Matrix4,xe=new l.Matrix4,$t=b0(yt[0],yt[2]),ge=.3,ye=m.state.userLamps[7],ke=Y0.children[0];let Jt=-1;const bt=(a,s,r,x,M)=>{if(i0.copy(r).normalize(),H.crossVectors(Nt,i0),H.lengthSq()<1e-6&&H.set(1,0,0),H.normalize(),g0.crossVectors(i0,H),M){const I=Math.cos(M),K=Math.sin(M);n0.copy(H).multiplyScalar(I).addScaledVector(g0,K),g0.multiplyScalar(I).addScaledVector(H,-K),H.copy(n0)}ft.makeBasis(H,g0,i0).scale(Zt.setScalar(x)).setPosition(s),_0.setMatrixAt(a,ft)},Me=(a,s,r,x)=>{const M=s0[a],I=M.a+i+s*M.w,K=M.r*(.8+.25*Math.sin(s*M.wob+a));r.set(x0.x+Math.cos(I)*K,x0.y+M.h+.9*Math.sin(s*M.wob*1.7+a*2.1),x0.z+Math.sin(I)*K);const E=M.w>0?1:-1;x.set(-Math.sin(I)*E,.3*Math.cos(s*M.wob*1.7+a*2.1),Math.cos(I)*E)},Gt=Math.tan(58*Math.PI/360)/Math.tan(70*Math.PI/360),te=Math.tan(35*Math.PI/360)/Math.tan(70*Math.PI/360),Se=a=>1-(1-Gt)*z(.75,.79,a)+(te-Gt)*z(.875,.945,a)+(1-te)*z(.945,.997,a);function ze(a,s,r,x){Ot.value=s;const M=v.through?1:Se(x);M<.999&&r.isPerspectiveCamera&&(r.fov=2*Math.atan(Math.tan(r.fov*Math.PI/360)*M)*180/Math.PI,r.updateProjectionMatrix()),m.setProgress(x),m.setIris(1-z(Bt,Ft,x));const I=n.cloud?.84+.3*Math.sin(s*.47)+.09*Math.sin(s*1.13+1.3):1;n.cloud&&p.uWinCol.value.copy(me).multiplyScalar(.55+.5*I),m.setStar(I),m.setFlash(d?.55*Be(.3045,.3225,x):0),m.update(a,s,r),r.getWorldPosition($);{const u=m.domeAngle();at=Math.cos(u),st=Math.sin(u)}const K=($.x-L.x)*y.x+($.y-L.y)*y.y+($.z-L.z)*y.z;{const u=(1-z(.6*W,W+34,Math.abs(at*$.x-st*$.z)))*z(.36,.46,x),C=Math.hypot($.x-L.x-y.x*K,$.y-L.y-y.y*K,$.z-L.z-y.z*K),k=z(18,44,$.x)*z(50,66,$.y);m.setBeam(.003*(1-.82*z(.25,.9,m.slitOpen()))*(1-.5*z(.24,.3,x))*(1-.9*u)*(1-.9*k)),m.setRim(.55+.6*k),p.uShaft.value.x=ge*z(.2,.3,x)*(.1+.9*z(13,62,C))*(1-z(.765,.8,x))*(1-.9*k),p.uSlitGlow.value=(.4+1.3*(1-z(0,.05,x)))*(1-z(.02,.14,x));{const F=1-z(.1,.27,x),D=0;p.uDomeK.value.x=n.domeK+.14+.44*F+.3*D,p.uAmbK.value.y=n.amb[1]*1.45*(1+.8*F),p.uAmbK.value.x=n.amb[0]*(1+.8*F)}N.uLook2.value.z=1.25+2.2*(1-z(.03,.18,x))}const E=m.floorY();x0.set(E0.x,E0.y+E,E0.z),ye.y=x0.y,p.uBounce.value.w=E;for(let u=0;u<Vt.length;u++)Vt[u].y=rt[u][1]+E;be.makeTranslation(N0.x,N0.y,N0.z).multiply(we.makeRotationAxis(ve,.075*Math.sin(s*2.6))).multiply(xe.makeTranslation(-N0.x,-N0.y,-N0.z)),H0.update(s,o0),kt.update(a,s,r),Mt.update(a,s,r),Ct.update(a,s,r),Dt.update(a,s,r),pt.uTime.value=s,pt.uLamp.value.set(x0.x,x0.y,x0.z,46);const Z0=Math.floor(s),k0=s-Z0;pt.uHand.value=(Z0+z(0,.12,k0))*U/60;const d0=.85*Math.sin(s*.55)+.2*Math.sin(s*1.7);if(Y0.position.z=-3.4+d0,ke.rotation.x=d0/.13,It.uTime.value=s,It.uBase.value.set($t[0],_+1+E,$t[1]),Math.abs(E-Jt)>.001){Jt=E;for(let u=0;u<O0.length;u++){const C=O0[u];C.rides&&Lt.setPosition(u,C.base.x,C.base.y+E,C.base.z)}}if(Lt.update(a,s),fe.getDrawingBufferSize(Ht),Tt.uSizeK.value=1.26*M/Math.max(Ht.y,1),r.getWorldDirection(mt),!Qt||q0.dot(mt)<.8)q0.copy(mt),W0.setFromMatrixColumn(r.matrixWorld,0),K0.setFromMatrixColumn(r.matrixWorld,1),Qt=!0;else{const u=1-Math.exp(-4*Math.min(a,.1));q0.lerp(mt,u).normalize(),W0.lerp(L0.setFromMatrixColumn(r.matrixWorld,0),u).normalize(),K0.lerp(L0.setFromMatrixColumn(r.matrixWorld,1),u).normalize()}v0.posAtDist(x*c0,vt);const G=Ut(x,2)*$0+.012*Math.sin(s*.05);nt(Ut(x,1),G,X);for(let u=0;u<p0;u++){let C=s0[u].size;if(u>=G0){const k=s0[u],F=dt[u-G0>>1],D=k.a+s*k.w*1.3,f0=k.r*(.8+.3*Math.sin(s*k.wob+u)),Q=k.w>0?1:-1;Z.set(F.x+Math.cos(D)*f0,F.y+E+.3+k.h+.6*Math.sin(s*k.wob*1.7+u*2.1),F.z+Math.sin(D)*f0),r0.set(-Math.sin(D)*Q,.3*Math.cos(s*k.wob*1.7+u*2.1),Math.cos(D)*Q),bt(u,Z,r0,C,.25*Math.sin(s*2.3+u*1.7));continue}if(u>=J0){const k=u-J0,F=z(.6,.64,x),D=z(.745,.8,x),f0=v.through?0:z(.6,.61,x)*(1-z(.895,.93,x)),Q=K+27+8*k+2*Math.sin(s*.7+k*2)+90*z(.88,.93,x),M0=3.5+1.4*k+.45*Math.sin(s*.5+k*1.7),m0=3.6+.8*k+.5*Math.sin(s*1.1+k*3),C0=Math.cos(M0),S0=Math.sin(M0);Z.set(L.x+y.x*Q+C0*m0,L.y+y.y*Q+S0*y.z*m0,L.z+y.z*Q-S0*y.y*m0),r0.copy(y).multiplyScalar(.4).addScaledVector(K0,1+.2*Math.cos(s*1.9+k)).addScaledVector(W0,.2*Math.cos(s*1.3+k*2)),D<1&&(L0.copy($).addScaledVector(q0,24+3*k-30*(1-F)+.6*Math.sin(s*.8+k)).addScaledVector(W0,6+3*k+.6*Math.sin(s*1.3+k*2)).addScaledVector(K0,-(4.5+1.2*k)+.5*Math.sin(s*1.9+k*1.3)),n0.copy(q0).multiplyScalar(.3).addScaledVector(K0,1+.2*Math.cos(s*1.9+k*1.3)).addScaledVector(W0,.25*Math.cos(s*1.3+k*2)),Z.lerp(L0,1-D),r0.lerp(n0,1-D)),bt(u,Z,r0,Math.max(C*f0*(.85+.15*D),1e-4),.3*Math.sin(s*2+k*1.9));continue}if(u>=F0){const k=s0[u],F=u-F0,D=s*k.w+u*1.9,f0=k.a+(F<At?.6:1)*Math.sin(D),Q=F<At?Math.max(K-14-7*F+3*Math.sin(s*.21*k.wob+u),-86+4*F):k.s+5*Math.sin(s*.21*k.wob+u),M0=Math.cos(f0),m0=Math.sin(f0),C0=k.r+1.2*Math.sin(s*k.wob+u*2.3),S0=Math.cos(D)*k.w>=0?1:-1;Z.set(L.x+y.x*Q-M0*C0,L.y+y.y*Q+m0*y.z*C0,L.z+y.z*Q-m0*y.y*C0),r0.set(m0*S0,M0*y.z*S0+.3*Math.cos(s*k.wob+u*2.3),-M0*y.y*S0),bt(u,Z,r0,Math.max(C*z(.3,.36,x),1e-4),.3*Math.sin(s*2.1+u));continue}if(Me(u,s,Z,r0),u<2){const k=v.through?0:z(.06,.115,x);if(k>0)if(L0.copy($).addScaledVector(q0,15+2.2*u+.5*Math.sin(s*.8+u)).addScaledVector(W0,-(4.4+2.6*u)+.5*Math.sin(s*1.3+u*2)).addScaledVector(K0,-(2.2+1*u)+.4*Math.sin(s*1.9+u*1.3)),n0.copy(q0).multiplyScalar(.3).addScaledVector(K0,1+.2*Math.cos(s*1.9+u*1.3)).addScaledVector(W0,.25*Math.cos(s*1.3+u*2)),u===0){const F=z(.25,.33,x),D=z(.33,.42,x);L0.addScaledVector(X,F*F*110+D*420),n0.lerp(X,F),C*=(1-.3*F)*(1-D),Z.lerp(L0,k),r0.lerp(n0,k)}else{const F=k*(1-z(.23,.3,x));Z.lerp(L0,F),r0.lerp(n0,F)}}bt(u,Z,r0,Math.max(C,1e-4),.5*Math.sin(s*(1.7+.13*(u%5))+u*1.7)+.35*Math.sin(u*2.4))}for(let u=0;u<R0;u++){const C=jt[u],k=(s/de+C.ph)%1,F=26+136*k,D=z(124,156,F),f0=C.a+.3*Math.sin(s*C.w+u*2.1),Q=(C.r+.75*Math.sin(s*C.wob+u*1.7))*(1-.75*D),M0=Math.cos(f0),m0=Math.sin(f0);Z.set(L.x+y.x*F+m0*Q,L.y+y.y*F+M0*y.z*Q,L.z+y.z*F-M0*y.y*Q),i0.copy(y).addScaledVector(Nt,.9+.2*Math.cos(s*C.wob*1.7+u)),i0.x+=.3*Math.cos(s*C.w+u*2.1)-.4*D*m0,i0.normalize(),g0.copy(y).multiplyScalar(-1).addScaledVector(i0,y.dot(i0)).normalize(),H.crossVectors(g0,i0);{const S0=.35*Math.sin(s*1.9+u*2.3),ee=Math.cos(S0),oe=Math.sin(S0);n0.copy(H).multiplyScalar(ee).addScaledVector(g0,oe),g0.multiplyScalar(ee).addScaledVector(H,-oe),H.copy(n0)}const C0=z(143.9,153.2,n0.copy(Z).applyMatrix4(Xt).distanceTo(L));ft.makeBasis(H,g0,i0).scale(Zt.setScalar(Math.max(C.size*z(0,.05,k)*(1-C0),1e-4))).setPosition(Z),_0.setMatrixAt(p0+u,ft.premultiply(Xt))}_0.instanceMatrix.needsUpdate=!0,J.set(-Math.sin(G)*st,Math.cos(G),-Math.sin(G)*at),J.addScaledVector(X,-J.dot(X)).normalize(),u0.crossVectors(X,J),N.uRot.value.set(a0.x*X.x+h0.x*J.x+w0.x*u0.x,a0.x*X.y+h0.x*J.y+w0.x*u0.y,a0.x*X.z+h0.x*J.z+w0.x*u0.z,a0.y*X.x+h0.y*J.x+w0.y*u0.x,a0.y*X.y+h0.y*J.y+w0.y*u0.y,a0.y*X.z+h0.y*J.z+w0.y*u0.z,a0.z*X.x+h0.z*J.x+w0.z*u0.x,a0.z*X.y+h0.z*J.y+w0.z*u0.y,a0.z*X.z+h0.z*J.z+w0.z*u0.z),N.uTime.value=s;const t0=(x-.2965)/.007,I0=d?(x-.305)/.015:-1;if(t0>0&&t0<1){const u=Math.sin(Math.PI*t0);nt(-22,46*$0,j0),nt(-10,24*$0,X0),N.uMetB.value.lerpVectors(j0,X0,t0).normalize(),N.uMetA.value.lerpVectors(j0,X0,Math.max(0,t0-.3)).normalize(),N.uMet.value.set(St.r*4*u,St.g*4*u,St.b*4*u,1),N.uMet2.value.set(2,0)}else if(I0>0&&I0<1){const u=Math.sqrt(Math.sin(Math.PI*I0));nt(6,64*$0,j0),nt(-18,12*$0,X0),N.uMetB.value.lerpVectors(j0,X0,I0).normalize(),N.uMetA.value.lerpVectors(j0,X0,Math.max(0,I0-.55)).normalize(),N.uMet.value.set(zt.r*u,zt.g*u,zt.b*u,2.4),N.uMet2.value.set(1.3,.4)}else N.uMet.value.set(0,0,0,1)}const Ae=a=>.95-.3*z(.13,.16,a)+.3*z(.19,.22,a)-.4*z(.26,.3,a)+.55*z(.36,.4,a)+.2*z(.53,.58,a)-.55*z(.66,.7,a)+.35*z(.73,.78,a)-.1*z(.87,.93,a),y0=(a,s,r,x,M,I)=>{const K=[];for(let E=0;E<M;E++)K.push({at:a,from:s,to:r,weight:x,fade:I});return K},Pe=new P,Te=()=>Pe.set(D0,_+2+m.floorY(),U0);let wt=0;{const a=new P,s=Math.hypot(f[0]-D0,f[2]-U0)/2;for(let r=0;r<c0&&!wt;r+=.25)v0.posAtDist(r,a),Math.hypot(a.x-D0,a.z-U0)<=s&&(wt=r/c0)}let Bt=0,Ft=0;{const a=new P;for(let s=c0;s>0&&!Bt;s-=.25){v0.posAtDist(s,a);const r=(a.x-L.x)*y.x+(a.y-L.y)*y.y+(a.z-L.z)*y.z;!Ft&&r<=R.irisS-26&&(Ft=s/c0),r<=R.irisS-65&&(Bt=s/c0)}}return{scene:h,path:v0,duration:58,pace:Ae,camera:{fov:70,near:.4,far:3e3,lookAhead:30,sway:.8,bank:.14},pois:[...y0(Te,0,.125,.8,2,.25),...wt>0?y0(L,0,wt,.5,1,.5):[],...y0(R.governor.clone().add(new P(-7,3,5)),.1,.215,.85,8,.3),...y0(new P(0,145,3),.195,.3,.85,8,.25),...y0(new P(4,176,38),.275,.39,.85,8,.2),...y0(new P(-6,192,36),.385,.475,.8,6,.3),...y0(new P(0,240,78),.46,.545,.8,6,.25),...y0(R.tail.clone().add(new P(-4,-4,2)),.53,.735,.85,7,.14),...y0(new P(-20,69,-69),.708,.782,.8,3,.5)],portal:{shape:"circle",radius:6,color:"#A9C6F2",glow:.6,halo:!1,tilt:!0},post:{exposure:1.02,bloom:{strength:.42,radius:.6,threshold:1},grade:{saturation:n.sat,contrast:1,tint:n.tint,shadowTint:n.shadow,vignette:.34,grain:.03,aberration:0}},ride:"none",update:ze,dispose(){m.dispose()}}}};export{Qe as default};
