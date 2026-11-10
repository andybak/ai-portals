import*as t from"three";const K=["#EFE4CC","#CDB894","#D9A873","#D9A5A0","#EBCBC2","#1F2F5E","#4C6A9E"],I=e=>new t.Color(e);function le(e){const a=e||K;return{uTime:{value:0},uCream:{value:I(a[0]||K[0])},uGroove:{value:I(a[1]||K[1])},uBeech:{value:I(a[2]||K[2])},uRose:{value:I(a[3]||K[3])},uPale:{value:I(a[4]||K[4])},uIndigo:{value:I(a[5]||K[5])},uBlue:{value:I(a[6]||K[6])},uFade:{value:new t.Vector3(250,600,900)},uVanish:{value:new t.Vector2(250,410)}}}function ke(e,a){const m=["uCream","uGroove","uBeech","uRose","uPale","uIndigo","uBlue"];for(let s=0;s<7;s++)a&&a[s]&&e[m[s]].value.set(a[s])}const j=`
uniform float uTime, uGW, uPly; uniform vec3 uFine; uniform float uRim, uTone, uTideJ, uKeep; uniform vec2 uScal, uLens; uniform vec3 uCream, uGroove, uBeech, uRose, uPale, uIndigo, uBlue, uFade; uniform vec2 uVanish;
float sHash(float n){ return fract(sin(n*127.1+3.7)*43758.5453); }
float sHash2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float sNoise(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(sHash(i), sHash(i+1.), f); }
// the void: one matte gradient. dir = normalised view ray (world).
vec3 voidColor(vec3 dir){
  float h = dir.y;
  vec3 c = mix(uRose, uPale, smoothstep(0.02, 0.75, h));
  vec3 grey = mix(uRose, vec3(dot(uRose, vec3(0.33))), 0.3) * 0.97;
  c = mix(c, grey, (1. - smoothstep(0.0, 0.07, abs(h))) * 0.8);
  return c;
}
// distance is the void: cord pales into it (no fog). wpos world, cam world.
vec3 styleDistance(vec3 c, vec3 wpos, vec3 cam){
  vec3 v = wpos - cam; float d = length(v); vec3 dir = v / max(d, 1e-4);
  vec3 vc = voidColor(dir);
  vec3 thread = mix(vc, uPale * 1.04, mix(0.4, 0.45, uKeep));
  // three planes, not one long gradient: near cord is full cream, the middle ranks are a clear step paler and
  // rosier (from about 125 m), the far ranks are thread (from about 400 m). uKeep 1 (the Knot): it holds its tone
  // about twice as far, so the two great bundles are the most toned things in the forest from the first second
  float k = 1. + 1.6 * uKeep;
  float a = 0.46 * smoothstep(uFade.x * 0.5 * k, uFade.x * 0.78 * k, d) + 0.42 * smoothstep(uFade.y * 0.62 * k, uFade.y * 0.9 * k, d);
  // (fix 6) distance is the void, used to the full: whatever is not the Knot pales in four plain steps, so a near
  // rope stands in front of a rosier rank at 100 m, that in front of a flat rose tint at 250 m, and that in front
  // of thread barely off the void (uFade.x 250: steps from 0.38 x, 0.68 x, x and 1.5 x)
  // (fix 7) but a hanging between 60 and 250 m keeps its cream and its knot tone (no paler than the three planes):
  // the steps start at 0.5 x, 0.8 x, 1.2 x and 1.6 x
  float a0 = 0.2 * smoothstep(uFade.x * 0.5, uFade.x * 0.7, d) + 0.26 * smoothstep(uFade.x * 0.8, uFade.x * 1.05, d)
    + 0.24 * smoothstep(uFade.x * 1.2, uFade.x * 1.5, d) + 0.2 * smoothstep(uFade.x * 1.6, uFade.x * 2., d);
  c = mix(c, thread, mix(a0, a, uKeep));
  float g = max(smoothstep(uFade.y * (1. + 0.25 * uKeep), uFade.z, d), smoothstep(uVanish.x, uVanish.y, wpos.y));
  return mix(c, vc, g);
}
float styleDetail(vec3 wpos, vec3 cam){ return 1. - smoothstep(uFade.x * 0.55, uFade.x, distance(wpos, cam)); }
// fuzz rim: pale on every outline, a little brighter on the upper left of the screen. nv = view-space normal.
float fuzzRim(vec3 nv){
  float e = 1. - abs(nv.z);
  // a thin pale line of fuzz on the outline: its width is set in pixels (fwidth), so on a rope at arm's length
  // and on a bundle 22 m thick it is the same line about a pixel and a half wide, never a gradient across the cord
  float w = max(fwidth(e), 1e-4);
  float line = smoothstep(1. - mix(3.4, 2.2, uRim) * w, 1. - mix(1.9, 1.2, uRim) * w, e) * smoothstep(0.42, 0.56, e);   // (thinner as a valley line)
  return line * mix(0.55 + 0.45 * clamp(dot(nv.xy, vec2(-0.707, 0.707)), 0., 1.), 1., uRim);
}
// a drawn line of the lay: 1 inside a groove of width gw (share of one period), 0 on the crown. f = 0 crown .. 1
// groove centre; d = screen derivative of the period coordinate. Never thinner than 1.5 px (it pales instead), and
// under about 3 px a period it is the flat average.
float layLine(float f, float gw, float d){
  d = max(d, 1e-4);
  float g = max(gw, 1.5 * d);
  float l = smoothstep(1. - g - d, 1. - g + d, f) * (gw / max(g, 1e-4));
  return mix(gw, l, 1. - smoothstep(0.2, 0.38, d));
}
// a drawn line that keeps its FULL tone while its period can be drawn (never thinner than 1.5 px) and is the flat
// average gw from about 3 px a period down. f = 0 crown .. 1 line centre; gw = the line's share of a period.
float crispLine(float f, float gw, float d){
  d = max(d, 1e-4);
  float g = max(gw, 1.5 * d);
  return mix(smoothstep(1. - g - d, 1. - g + d, f), gw, smoothstep(0.24, 0.36, d));
}
float gLR = 0.;   // (fix 7) which way across the cords is the lower right of the screen (set by cordShade)
float gGapW = 0., gGapG = 0.;   // (fix 8) the Knot near the lens: how much wider the valley between two cords is drawn (share of a cord), and 1 where the valley is the plain groove tint
// one level of a great bundle's cords: m ropes drawn as one cord (c = rope coordinate round the bundle, tw = ropes
// the pattern turns per metre of arc, wr = a rope's width m). Returns (gap line between neighbours, lay across it).
// The lay crosses the cord at about 50 degrees, counter to the bundle's own twist (as the yarns of a laid rope run
// nearly along the rope), one line to 0.6 of the cord's width.
vec2 cordLevel(float c, float m, float dA, float dArc, float arc, float tw, float wr, float seed){
  float cm = c / m, d = (dA + dArc * abs(tw)) / m, x = fract(cm), cell = floor(cm);
  // (fix 6) each cord is drawn as the round three-ply rope it is: across it (lat -1..1, flank to flank) the lay
  // runs as it lies on a cylinder, an S that crosses the crown and turns along the cord into both flanks, where it
  // narrows to nothing; the valley between two cords is one unbroken line of the cord-on-cord tone whose two
  // edges are scalloped by the plies of the cords it lies between
  float lat = 2. * x - 1., al = abs(lat), cph = sqrt(max(1. - lat * lat, 0.));
  float sg = tw < 0. ? 1. : -1.;
  float pR = max(1.25 * wr * m, 1e-3);
  float base = arc / pR + sHash(cell * 1.31 + seed * 7. + m) * 5.;
  float dP = max(length(vec2(uPly * 2. * d / (6.2831853 * max(cph, 0.3)), dArc / pR)), 1e-5);
  // (near, a groove is a lens-shaped mark, widest on the crown and pointed towards each flank; where a cord is only
  // a few pixels wide it is a plain line of the same slant, never under 1.5 px)
  float tk = 1. - smoothstep(0.05, 0.12, dP);
  float g = mix(max(0.2, 1.5 * dP), 0.27 * cph * cph, tk);
  float lay = smoothstep(1. - g - dP, 1. - g + dP, abs(fract(sg * uPly * asin(lat) / 6.2831853 + base) - 0.5) * 2.) * mix(1., smoothstep(dP, 1.6 * dP, g), tk);
  lay = mix(lay, 0.2, smoothstep(0.24, 0.36, dP));
  float GR = 0.5 + 0.5 * cos(6.2831853 * (sg * uPly * (lat < 0. ? -0.25 : 0.25) + base));
  float sc = 1. - smoothstep(0.08, 0.16, d);            // scallops while a cord is seven pixels wide or more
  // (fix 7) the valley between two cords is a steady line of the cord-on-cord tone, its edges bulging ply by ply,
  // and it is wider on the flank that faces the lower right: each cord reads as a round rope beside the next
  float sh = smoothstep(0.2, 0.9, gLR * (lat < 0. ? -1. : 1.));
  float gw = max(mix(0.15 / m, 0.12 + 0.07 * GR * GR + 0.2 * sh * (0.6 + 0.4 * GR), sc) + gGapW, 1.5 * d);
  float gap = smoothstep(1. - gw - d, 1. - gw + d, al);
  return vec2(gap, lay);
}
// THE ROUND ROPE (fix 6). A material that knows the centreline of its cord (ctr: world centre under this fragment,
// w = the cord's radius m; w 0 = not known) calls ropeRound() before cordShade(). It works out where this fragment
// lies across the cord as the eye sees it (lat -1..1, flank to flank, whatever the tube's side count) and from that
// the angle a true round rope would show there, so the lay is drawn as it lies on a cylinder: each groove an S that
// crosses the crown and turns along the rope into both flanks, where it narrows to nothing; and the outline is
// scalloped ply by ply (the fragment is cut away where a groove meets the flank).
// gRope = (lat, how much of this is on 0..1, true angle in turns, 1 where the outline is cut)
vec4 gRope = vec4(0.); float gRopeW = 1e-3, gRopeR = 0.3, gRopePx = 0., gRopeLR = 0., gShade = 0.;
void ropeRound(vec4 ctr, vec3 wpos, vec3 cam, float ang, float front){
  // (no branch anywhere: every derivative is taken in uniform control flow, and every division is guarded)
  float r = max(ctr.w, 1e-4);
  vec3 dcx = dFdx(ctr.xyz), dcy = dFdy(ctr.xyz);
  vec3 t = mix(dcy, dcx, step(dot(dcy, dcy), dot(dcx, dcx))); float tl = length(t);
  t = t / max(tl, 1e-7) + vec3(0., 1., 0.) * step(tl, 1e-7);
  vec3 v = cam - wpos; float vl = length(v); v = v / max(vl, 1e-4) + vec3(0., 0., 1.) * step(vl, 1e-4);
  vec3 s = cross(t, v); float sl = length(s); s = s / max(sl, 1e-4) + vec3(1., 0., 0.) * step(sl, 1e-4);
  vec3 f = cross(s, t);                                   // across the axis, towards the eye
  vec3 o = wpos - ctr.xyz; float ls = dot(o, s), lf = dot(o, f);
  // lat runs the way the cord's own angle runs
  float a = ang * 6.2831853; vec2 cs = vec2(cos(a), sin(a));
  vec2 ga = vec2(cs.x * dFdx(cs.y) - cs.y * dFdx(cs.x), cs.x * dFdy(cs.y) - cs.y * dFdy(cs.x));
  float sg = dot(ga, vec2(dFdx(ls), dFdy(ls))) < 0. ? -1. : 1.;
  float lat = clamp(sg * ls / r, -1., 1.);
  float thc = atan(sg * ls, max(lf, 1e-3 * r));
  float px = max(min(length(dFdx(wpos)), length(dFdy(wpos))), 1e-6);
  float wpx = 2. * r / px;                                // the cord's width in pixels
  float on = smoothstep(5.5, 9., wpx) * step(1e-4, ctr.w) * step(1e-7, tl) * step(0.05, sl);
  gRope = vec4(lat, on, ang + (asin(lat) - thc) / 6.2831853 * on * front, front);
  gRopeW = max(fwidth(ls) / r, 1e-4); gRopeR = r; gRopePx = wpx;
  // (fix 7) volume by the ply: which way across the rope is the lower right of the screen (the groove tone gathers
  // on that flank, the pale fuzz stays on the upper left)
  vec2 sv = (viewMatrix * vec4(s, 0.)).xy; gRopeLR = sg * dot(sv / max(length(sv), 1e-4), vec2(0.707, -0.707));
}
// three-ply cotton. arc: metres along the cord; ang: 0..1 round it; dAng: screen derivative of ang (seam-safe);
// hanks: how many hanks the strands of a bundle are gathered in (0 for none);
// gauge: diameter m (the ply pitch is 2.6 gauges); strands: ropes drawn side by side round the tube (1 = a single
// rope); twist: lay of the bundle (turns of the strand pattern per metre); dip: metres below the tide line (>0 dyed);
// seed: per-cord random; flatK: 1 where the cord is combed out (a tassel): no plies, a few combed lines;
// lie: 1 where this cord lies on another (the cord-on-cord tone, flat, hard-edged).
vec3 cordShade(float arc, float ang, float dAng, float gauge, float strands, float twist, float hanks, float dip, float seed,
               vec3 nv, vec3 wpos, vec3 cam, float flatK, float lie, float bear, float ride){
  // bear: 0..1, how much cord bears on this surface (the crossings of a knot): the crowns go to the groove tint and
  // the lay deeper, flat. ride: +-1 for a rope riding a great bundle (sign = the hand of the bundle's lay), else 0.
  float det = styleDetail(wpos, cam);
  seed = floor(seed * 256. + 0.5) / 256.;
  float dArc = fwidth(arc);
  float c = ang * strands + arc * twist + seed;
  float cell = floor(c), x = fract(c);
  float dC = dAng * strands + dArc * abs(twist);
  float single = step(strands, 1.5);
  float rs = mix(sHash(cell * 1.31 + seed * 7.), 0.5, single);
  // plies: a helical stripe, three to a rope; flat cream crowns, a thin crisp groove between
  float pitch = max(gauge * 2.6, 1e-3);
  float s = mix(x * 1.6, ang * uPly, single) + arc / pitch + rs * 5.;
  // across a single rope the angle and the arc run at right angles on screen: the true slope of the stripe
  float dS = mix(dC * 1.6 + dArc / pitch, length(vec2(dAng * uPly, dArc / pitch)), single);
  float f = abs(fract(s) - 0.5) * 2.;
  // a rope too narrow to draw (under about five pixels across) is the flat average: no lay, no valley line
  float thin = smoothstep(0.05, 0.085, dAng) * single * (1. - abs(ride));
  float groove = mix(uGW, layLine(f, uGW, dS), det * (1. - thin));
  // a rope near enough to count its plies (uFine: lay pitch m, lines round the rope, bow; 0 = off): the lay is drawn
  // close, crisp groove lines crossing the rope at about 50 degrees, two or three to a rope's width of length; farther off, where
  // that would be finer than a few pixels, the long lay above takes over
  float pf = max(uFine.x, 1e-3);
  // bow: on a rope whose uv.y = 0 faces out of its strand the lines are drawn as a round rope shows them, squarer
  // across the crown and turning along the rope towards its flanks
  float bw = 1. - 12.566371 * uFine.z * cos(12.566371 * ang);
  float dF = max(length(vec2(dAng * uFine.y * bw, dArc / pf)), 1e-4);
  float fF = abs(fract((ang - uFine.z * sin(12.566371 * ang)) * uFine.y + arc / pf + seed * 3.) - 0.5) * 2.;
  float nearK = (1. - smoothstep(0.2, 0.36, dF)) * single * step(1e-4, uFine.x) * (1. - thin) * (1. - abs(ride));
  // a rope riding a great bundle carries the lay of the cords drawn beside it: the same lines at the same spacing
  // and angle, handed from one size to the next where the bundle's own cords are (never a blank tape on rope)
  if (abs(ride) > 0.5) {
    float dCr = dArc / 0.642;
    float dPR = length(vec2(4. * dAng, 1.99 * dArc));
    groove = mix(0.2, mix(0.2, crispLine(abs(fract(sign(ride) * 4. * ang + 1.99 * arc + seed * 5.) - 0.5) * 2., 0.2, dPR), step(dCr, 0.3)), det);
  }
  float gF = max(0.24, 1.5 * dF);
  float lineF = smoothstep(1. - gF - dF, 1. - gF + dF, fF) * (0.24 / gF);
  groove = mix(groove, lineF, nearK);
  // (fix 6) the round rope: three plies, each groove an S across the crown that turns along the rope into both
  // flanks and narrows to nothing there (see ropeRound)
  float rOn = gRope.y * gRope.w * single;
  float pR = max(mix(1.7, 2.5, abs(ride)) * gRopeR, 1e-3), cph = sqrt(max(1. - gRope.x * gRope.x, 0.));
  float baseR = arc / pR + seed * 3.;
  float dR = max(length(vec2(uPly * gRopeW / (6.2831853 * max(cph, 0.3)), dArc / pR)), 1e-5);
  // (a groove is widest on the crown and narrows to a point towards each flank: a lens-shaped mark, like a drawn ply)
  float gR = uLens.x * cph * cph + uLens.y * smoothstep(0.1, 0.75, gRope.x * gRopeLR);   // (fix 7) the lay's marks broaden towards the lower-right flank, where the plies turn away
  float lineR = smoothstep(1. - gR - dR, 1. - gR + dR, abs(fract(uPly * gRope.z + baseR) - 0.5) * 2.) * smoothstep(dR, 1.6 * dR, gR);
  groove = mix(groove, lineR, rOn);
  // its outline: where a groove meets the flank the rope is cut in, so each ply bulges (uScal: where the crowns'
  // outline stands in lat, and how deep the notch between two plies is)
  float angF = gRope.z - asin(gRope.x) / 6.2831853;
  float GR = 0.5 + 0.5 * cos(6.2831853 * (uPly * (angF + (gRope.x < 0. ? -0.25 : 0.25)) + baseR));
  float sOn = gRope.y * single * smoothstep(8., 12., gRopePx) * (1. - clamp(flatK, 0., 1.));
  float thrR = mix(1.5, uScal.x - uScal.y * mix(1., GR * GR, gRope.w), sOn);
  float cutR = step(thrR, abs(gRope.x));
  // a tassel: combed, a few clean lines down it
  float fc = abs(fract(ang * 5. + seed * 3.) - 0.5) * 2.;
  groove = mix(groove, layLine(fc, 0.2, dAng * 5.), clamp(flatK, 0., 1.));
  // cord on cord: the gap between neighbouring ropes of a bundle
  float gb = abs(x - 0.5) * 2.;
  float gap = layLine(gb, 0.15, dC) * (1. - single);
  // hanks: the ropes of a great bundle lie in a few hanks, and the valley between two hanks is cord on cord
  float hOn = step(0.5, hanks), hq = max(hanks, 1.) / max(strands, 1.);
  float hc = c * hq + 0.5, hx = abs(fract(hc) - 0.5) * 2., dH = dC * hq;
  // (drawn at full tone, never under 2 px, while a hank is three pixels wide or more: the hanks of the two great
  // bundles count from the entry, 340 m off)
  float gv = max(0.03, 2. * dH);   // (fix 7: near, the hank valley is one deep line, never a broad straight band)
  float valley = mix(smoothstep(1. - gv - dH, 1. - gv + dH, hx), 0.12, smoothstep(0.3, 0.45, dH)) * hOn;
  // between hank and rope: every third rope of a great bundle parts a little wider, so ropes still count at 100 m
  float mid = layLine(abs(fract(c / 3. + 0.5) - 0.5) * 2., 0.07, dC / 3.) * hOn * 0.85;
  float ht = sHash(floor(hc) * 3.17 + seed * 5.) * hOn;
  // a great bundle (hanks > 0): its cords are drawn at EVERY distance. Near, every rope with a groove line between
  // neighbours and its lay crossing it; farther, where a rope would be under four pixels, the ropes are drawn two as
  // one cord, then four as one, each level with its own lay, so the bundle is never a flat slab with hairlines
  float gapG = 0.;
  { vec2 csA = vec2(cos(6.2831853 * ang), sin(6.2831853 * ang));
    vec2 gA = vec2(csA.x * dFdx(csA.y) - csA.y * dFdx(csA.x), csA.x * dFdy(csA.y) - csA.y * dFdy(csA.x)) / 6.2831853 * strands + vec2(dFdx(arc), dFdy(arc)) * twist;
    gLR = dot(gA / max(length(gA), 1e-6), vec2(0.707, -0.707)); }
  if (hOn > 0.5) {
    float wr = gauge * 1.07;
    float dA = dAng * strands, atw = abs(twist);
    // one size of cord at a time: a hard hand-over from every rope to two as one to four as one (never two sets
    // of lines crossing each other as a lattice)
    float v1 = step(dC, 0.3), v2 = (1. - v1) * step(dC * 0.5, 0.3), v4 = (1. - v1) * (1. - v2) * (1. - smoothstep(0.28, 0.36, dC * 0.25));
    vec2 l1 = cordLevel(c, 1., dA, dArc, arc, twist, wr, seed), l2 = cordLevel(c, 2., dA, dArc, arc, twist, wr, seed), l4 = cordLevel(c, 4., dA, dArc, arc, twist, wr, seed);
    // (the lay is drawn on true ropes only, near the lens; two-as-one and four-as-one cords are counted by the
    // lines between them and carry the flat tone: a calm surface from afar, no tread)
    // (fix 5) every size of cord carries its lay, one size at a time: a surface of twisted cord, never combed hair
    groove = mix(0.2, l1.y * v1 + l2.y * v2 + mix(0.2, l4.y, v4) * (1. - v1) * (1. - v2), det);
    gapG = l1.x * v1 + l2.x * v2 + mix(0.15, l4.x, v4) * (1. - v1) * (1. - v2);
    gap = 0.; mid = 0.;
  }
  vec3 crown = mix(uCream, uGroove, (0.10 * rs * det + 0.12 * ht) * (1. - single) * (1. - hOn));
  float tone = max(uTone, bear);
  // (fix 7) volume without light: on whatever is too small or too many-stranded to be drawn round, the cord-on-cord
  // tone gathers in one flat band down the flank that faces the lower right (a comb on a sinnet, rope by rope)
  float lrN = dot(nv.xy, vec2(0.707, -0.707)), wN = max(fwidth(lrN), 1e-4), thN = mix(0.42 + (rs - 0.5) * 0.2, 0.52, single);
  float shN = smoothstep(thN - wN, thN + wN, lrN) * (1. - smoothstep(0.3, 0.55, wN)) * (1. - hOn) * (1. - abs(ride)) * (1. - rOn) * (1. - clamp(flatK, 0., 1.));
  tone = max(tone, max(0.8 * shN, gShade));
  crown = mix(crown, uGroove, tone);
  vec3 lieC = mix(uGroove, uBeech, 0.4) * 0.9;
  vec3 colr = mix(crown, mix(uGroove, lieC, tone), groove * mix(1., mix(0.62, 0.92, gGapG), max(hOn, abs(ride))));
  // (fix 8) near the lens the Knot is ROPES: cream crowns, and every gap between two ropes the full groove tint (wider
  // where cord bears on cord), nothing darker
  colr = mix(colr, mix(lieC, uGroove, gGapG), max(max(gap, valley), max(mid, max(lie, gapG * mix(0.9, 1., gGapG)))));
  // the dip: indigo at the tip, blue above, a hard uneven tide line, then cream
  float tl = dip + ((sNoise(ang * 9. + seed * 13. + cell) - 0.5) * 1.6 + (sHash(cell + seed * 3.) - 0.5) * 2.2 * (1. - single)) * uTideJ
    ;   // (a great bundle's hanks each took the dye to their own height: the Knot's own shader adds that to dip)
  float dyed = smoothstep(0., max(fwidth(tl), 0.02), tl);
  vec3 dye = mix(uBlue, uIndigo, smoothstep(2.5, 6.5, tl));
  dye = mix(dye, mix(dye, uIndigo * 0.82, 0.62), max(groove, max(gap, gapG)));
  colr = mix(colr, dye, dyed);
  float rim = fuzzRim(nv);
  rim = mix(rim, (1. - smoothstep(1.2 * gRopeW, 2.4 * gRopeW, thrR - abs(gRope.x))) * mix(0.55 + 0.45 * clamp(dot(nv.xy, vec2(-0.707, 0.707)), 0., 1.), 1., uRim), sOn);
  // uRim 1: a rope laid among others in a hawser. Its outline is where it beds on its neighbour, so the line there
  // is the cord-on-cord tone (the thin valley between two ropes), not pale fuzz
  vec3 rimC = mix(mix(colr, vec3(1.0, 0.985, 0.95), 0.6 - 0.25 * dyed), lieC, uRim * (1. - dyed));
  colr = mix(colr, rimC, rim * mix(0.7, 1., uRim) * (1. - lie) * (1. - dyed) * (1. - uRim * smoothstep(0.07, 0.11, dArc)));   // (no pale rim on dyed cord: blue stays blue)   // (a hawser rope under about six pixels across has no valley line)   // no fuzz line where cord lies on cord
  if (cutR > 0.5) discard;
  return styleDistance(colr, wpos, cam);
}
vec3 beechShade(float band, vec3 nv, vec3 wpos, vec3 cam){
  vec3 c = mix(uBeech, mix(uBeech, uCream, 0.5), smoothstep(0.42, 0.44, band) * (1. - smoothstep(0.56, 0.58, band)));
  return styleDistance(c, wpos, cam);
}
`,O=`
precision highp float;
`,_=(e,a={})=>Object.assign({},e||le(),{uGW:{value:.16},uPly:{value:3},uFine:{value:new t.Vector3(0,0,0)},uRim:{value:0},uTone:{value:0},uTideJ:{value:1},uKeep:{value:0},uScal:{value:new t.Vector2(.79,.12)},uLens:{value:new t.Vector2(.27,.5)}},a);function Se(e={}){const{gauge:a=.6,strands:m=1,twist:s=0,hanks:i=0,tide:b=7,seed:p=0,pitch:w=0,vertexHead:C="",vertexBody:R="",side:c=t.FrontSide}=e;return new t.ShaderMaterial({side:c,uniforms:_(e.style,{uScal:{value:new t.Vector2(e.crown||.79,e.notch??.12)},uLens:{value:new t.Vector2(...e.lens||[.27,.5])},uGW:{value:e.grooveW??.16},uPly:{value:e.plies??3},uFine:{value:new t.Vector3(e.fine?e.finePitch||a*.4:0,e.fine?e.fineN||7:0,e.fineBow||0)},uRim:{value:e.valleyRim?1:0},uTone:{value:e.tone||0},uClip:{value:e.clip||1e3},uPitch:{value:w||a*2.6},uGauge:{value:a},uFlank:{value:new t.Vector2(e.flank?.21:0,e.flank||0)},uStrands:{value:m},uTwist:{value:s},uHanks:{value:i},uTide:{value:b},uSeed:{value:p}}),vertexShader:`
      uniform float uTime, uSeed; varying vec2 vUv; varying vec3 vW, vNv; varying float vSeed, vFlat, vLie, vDipE, vShd; varying vec4 vCtr;
      ${C}
      void main(){
        vec3 p = position; vec3 n = normal; float vArcAdd = 0.; float sd = uSeed; float flatK = 0.; float lieD = 1000.; float dipE = -1000.;   // dipE: metres into a dipped end (a tassel dipped before it was hung)
        float shd = -1.;   // (fix 7) -1..1: how far this cord's place in its strand faces the lower right of the screen (the strand's flank that takes the tone)
        vec4 ctrL = vec4(0.);   // (fix 6) the cord's centreline under this vertex (local, like p) and its radius; w 0 = not known
        #ifdef USE_INSTANCING
          sd += fract(dot(instanceMatrix[3].xyz, vec3(0.131, 0.071, 0.113)));
        #endif
        ${R}
        #ifdef USE_INSTANCING
          p = (instanceMatrix * vec4(p, 1.)).xyz; n = mat3(instanceMatrix) * n;
          ctrL = vec4((instanceMatrix * vec4(ctrL.xyz, 1.)).xyz, ctrL.w * length(instanceMatrix[0].xyz));
        #endif
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vCtr = vec4((modelMatrix * vec4(ctrL.xyz, 1.)).xyz, ctrL.w);
        vec3 nw = mat3(modelMatrix) * n;
        vNv = mat3(viewMatrix) * nw; vUv = uv + vec2(vArcAdd, 0.); vSeed = sd; vFlat = flatK; vLie = lieD; vDipE = dipE; vShd = shd;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:O+j+`
      uniform float uGauge, uPitch, uStrands, uTwist, uTide, uHanks, uClip; uniform vec2 uFlank; varying vec2 vUv; varying vec3 vW, vNv; varying float vSeed, vFlat, vLie, vDipE, vShd; varying vec4 vCtr;
      void main(){
        float a = vUv.y * 6.2831853; vec2 cs = vec2(cos(a), sin(a));
        float dAng = length(fwidth(cs)) / 6.2831853;
        vec3 nv = vNv / max(length(vNv), 1e-4);
        float fw = max(fwidth(vLie), 1e-3); float lie = 1. - smoothstep(-fw, fw, vLie);
        // ropes laid side by side (uFlank: half width in turns, 0 = off): one thin line of the cord-on-cord tone down
        // each flank, where a rope beds on its neighbour
        float fd = abs(abs(vUv.y - 0.5) - uFlank.x), ffw = max(dAng, 1e-4);
        lie = max(lie, (1. - smoothstep(uFlank.y - ffw, uFlank.y + ffw, fd)) * step(1e-4, uFlank.y));
        ropeRound(vCtr, vW, cameraPosition, vUv.y, gl_FrontFacing ? 1. : 0.);
        { float fs = max(fwidth(vShd), 1e-3); gShade = 0.7 * smoothstep(0.34 - fs, 0.34 + fs, vShd); }
        vec3 c = cordShade(vUv.x, vUv.y, dAng, uPitch / 2.6, uStrands, uTwist, uHanks, max(uTide - vW.y - 100. * step(1.5, vFlat), vDipE), vSeed, nv, vW, cameraPosition, vFlat, lie, 0., 0.);
        // (fix 7) a tube of few sides is cut round: whatever stands further from the cord's centreline than uClip radii goes
        if (vCtr.w > 1e-4 && distance(vW, vCtr.xyz) > vCtr.w * uClip) discard;
        gl_FragColor = vec4(c, 1.);
      }`})}function Ce(e={}){return new t.ShaderMaterial({side:e.side??t.FrontSide,uniforms:_(e.style),vertexShader:`
      varying vec2 vUv; varying vec3 vW, vNv;
      void main(){ vec3 p = position; vec3 n = normal;
        #ifdef USE_INSTANCING
          p = (instanceMatrix * vec4(p, 1.)).xyz; n = mat3(instanceMatrix) * n;
        #endif
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vNv = mat3(viewMatrix) * (mat3(modelMatrix) * n); vUv = uv;
        gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:O+j+`
      varying vec2 vUv; varying vec3 vW, vNv;
      void main(){ vec3 nv = vNv / max(length(vNv), 1e-4);
        gl_FragColor = vec4(beechShade(vUv.y, nv, vW, cameraPosition), 1.); }`})}function fe(e={}){const a=[],m=[];for(let s=0;s<8;s++)a.push(new t.Vector4(0,0,1,0));for(let s=0;s<6;s++)m.push(new t.Vector4(0,0,1,0));return new t.ShaderMaterial({uniforms:_(e.style,{uWake:{value:a},uPlop:{value:m},uRing:{value:new t.Vector4(0,0,300,0)},uRingCut:{value:new t.Vector4(1e5,2e5,0,1)}}),vertexShader:"varying vec3 vW; varying vec2 vL; void main(){ vL = position.xz; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:O+j+`
      uniform vec4 uWake[8]; uniform vec4 uPlop[6]; uniform vec4 uRing, uRingCut; varying vec3 vW; varying vec2 vL;
      // a drawn ring: a flat pale line, never thinner than a pixel and a half, gone where rings would crowd a pixel.
      // dr = metres of ring distance one pixel covers (worked out from derivatives taken before the loops)
      float seaLine(float dist, float hw, float dr){
        float h = max(hw, 0.95 * dr);
        return (1. - smoothstep(h - 0.5 * dr, h + 0.5 * dr, abs(dist))) * (1. - smoothstep(2.2, 4.5, dr));
      }
      void main(){
        vec3 v = vW - cameraPosition; float d = length(v); vec3 dir = v / max(d, 1e-4);
        vec2 gx = dFdx(vL), gy = dFdy(vL);
        float ring = 0.;
        for (int i = 0; i < 8; i++) {
          vec4 k = uWake[i]; vec2 q = vL - k.xy; float r = length(q); vec2 g = q / max(r, 1e-3);
          float dr = max(abs(dot(g, gx)) + abs(dot(g, gy)), 1e-4);
          for (int j = 0; j < 6; j++) {
            float ph = fract(uTime * 0.04 + float(j) / 6. + float(i) * 0.21);
            float rr = k.z * 0.6 + ph * 62.;
            ring = max(ring, seaLine(r - rr, 0.05 + 0.2 * (1. - ph), dr) * k.w * step(ph, 0.9));
          }
        }
        for (int i = 0; i < 6; i++) {
          vec4 k = uPlop[i]; vec2 q = vL - k.xy; float r = length(q); vec2 g = q / max(r, 1e-3);
          float dr = max(abs(dot(g, gx)) + abs(dot(g, gy)), 1e-4);
          ring = max(ring, max(seaLine(r - k.z, 0.09, dr), seaLine(r - k.z * 0.55, 0.07, dr)) * step(0.5, k.w));
        }
        // (fix 6) one more source, set by the world (uRing: x, z local, reach m, strength; off by default): wide slow
        // rings that open from where a great tassel touches the sea and are seen from high up, far out over the
        // open water; uRingCut (world z from, z to, |x| from, |x| to) keeps them out of a strip that has its own marks
        { vec2 q = vL - uRing.xy; float r = length(q); vec2 g = q / max(r, 1e-3);
          float dr = max(abs(dot(g, gx)) + abs(dot(g, gy)), 1e-4), wide = 0.;
          for (int j = 0; j < 11; j++) {
            float ph = fract(uTime * 0.007 + float(j) / 11.), rr = 5. + ph * uRing.z, h = max(0.1 + 0.3 * (1. - ph), 0.95 * dr);
            wide = max(wide, (1. - smoothstep(h - 0.5 * dr, h + 0.5 * dr, abs(r - rr))) * (1. - smoothstep(0.8, 1., ph)) * smoothstep(0., 0.03, ph));
          }
          float keep = (1. - smoothstep(5., 9., dr)) * (1. - smoothstep(uRingCut.x, uRingCut.y, vW.z) * (1. - smoothstep(uRingCut.z, uRingCut.w, abs(vW.x))));
          ring = max(ring, wide * keep * uRing.w); }
        vec3 c = mix(uIndigo, uBlue, ring);
        // greying to the horizon, and at the sea line it IS the void's own grey: a soft seam, no edge
        vec3 vh = voidColor(vec3(dir.x, 0., dir.z));
        // flat indigo to within a few degrees of the sea line, greying there; then a clean seam under the void's
        // own greyer band (never a wide blurred band, from whatever height it is seen)
        // (fix 6) greying, not purpling: the far sea goes to a greyed blue of its own (the dip colour, half drained),
        // and only the last degree under the line takes the void's grey, so the seam is rose-grey on blue-grey and
        // nowhere indigo mixed with rose
        // (fix 7) the soft haze band is back: the far sea greys through the void's own grey laid over the indigo, a
        // wide band that gives the floor its distance (the seam itself stays clean)
        vec3 hor = mix(vh, uIndigo, 0.36);
        c = mix(c, hor, (1. - smoothstep(0.004, 0.125, -dir.y)) * 0.84);
        float sw = max(fwidth(dir.y), 1e-5);
        c = mix(c, vh, 1. - smoothstep(0., 1.5 * sw, -dir.y));
        gl_FragColor = vec4(c, 1.);
      }`})}function ue(e={}){return new t.ShaderMaterial({side:t.BackSide,depthWrite:!1,depthTest:!0,uniforms:_(e.style),vertexShader:`varying vec3 vD; void main(){ vD = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.);
      if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:O+j+`
      varying vec3 vD; void main(){ vec3 d = vD / max(length(vD), 1e-4); gl_FragColor = vec4(voidColor(d), 1.); }`})}const ae=`
uniform vec4 uCP[28];   // xyz centre (local m), w arc length from the anchor (m)
uniform vec4 uCN[28];   // xyz transported normal, w radius scale (the squeeze)
uniform vec4 uKink;     // x arc position of the kink (m from the anchor), y amplitude m, z width m
float vHash(float n){ return fract(sin(n*127.1+3.7)*43758.5453); }
float vNoise(float x){ float i=floor(x), f=fract(x); f=f*f*(3.-2.*f); return mix(vHash(i), vHash(i+1.), f); }
void knotCurve(float t, float b, out vec3 C, out vec3 T, out vec3 N, out float arc, out float rs){
  float fi = clamp(floor(t), 0., 12.); float f = clamp(t - fi, 0., 1.);
  int o = int(b + 0.5) * 14; int i1 = int(fi);
  int i0 = o + max(i1 - 1, 0), i2 = o + i1 + 1, i3 = o + min(i1 + 2, 13); i1 += o;
  vec3 p0 = uCP[i0].xyz, p1 = uCP[i1].xyz, p2 = uCP[i2].xyz, p3 = uCP[i3].xyz;
  float f2 = f * f, f3 = f2 * f;
  C = 0.5 * (2. * p1 + (p2 - p0) * f + (2. * p0 - 5. * p1 + 4. * p2 - p3) * f2 + (3. * p1 - p0 - 3. * p2 + p3) * f3);
  vec3 d = 0.5 * ((p2 - p0) + 2. * (2. * p0 - 5. * p1 + 4. * p2 - p3) * f + 3. * (3. * p1 - p0 - 3. * p2 + p3) * f2);
  T = d / max(length(d), 1e-4);
  vec3 n = mix(uCN[i1].xyz, uCN[i2].xyz, f * f * (3. - 2. * f));
  n -= T * dot(n, T); n += vec3(0.0013, 0.0007, 0.0011) * step(dot(n, n), 1e-6);
  N = n / max(length(n), 1e-4);
  arc = mix(uCP[i1].w, uCP[i2].w, f); rs = mix(uCN[i1].w, uCN[i2].w, f);
  float k = (arc - uKink.x) / max(uKink.z, 1e-3);
  C += N * (uKink.y * exp(-k * k));
}
`;function ve(e,a){return new t.ShaderMaterial({side:t.DoubleSide,uniforms:_(e,a),vertexShader:ae+`
      attribute vec4 aCurve;  // t (0..13), bundle (0|1), phi0 (turns), rho (0 core, 1 a rope riding the surface)
      attribute vec3 aTube;   // theta (turns round its own tube), tube radius m, seed
      uniform float uR, uTwistB, uSlide, uDipLen, uTime, uHanks, uTideK, uNS; uniform vec2 uDrawP;
      varying float vArc, vAng, vSeed, vKind, vDip, vTip, vHk; varying vec3 vW, vNv, vNc; varying vec2 vBear, vTail; varying vec4 vCtr;
      vec3 crPos(int o, float t){
        float fi = clamp(floor(t), 0., 12.); float f = clamp(t - fi, 0., 1.); int i1 = int(fi);
        int i0 = o + max(i1 - 1, 0), i2 = o + i1 + 1, i3 = o + min(i1 + 2, 13); i1 += o;
        vec3 p0 = uCP[i0].xyz, p1 = uCP[i1].xyz, p2 = uCP[i2].xyz, p3 = uCP[i3].xyz; float f2 = f * f, f3 = f2 * f;
        return 0.5 * (2. * p1 + (p2 - p0) * f + (2. * p0 - 5. * p1 + 4. * p2 - p3) * f2 + (3. * p1 - p0 - 3. * p2 + p3) * f3);
      }
      void main(){
        vec3 C, T, N; float arc, rs; knotCurve(aCurve.x, aCurve.y, C, T, N, arc, rs);
        float tipD = uCP[int(aCurve.y + 0.5) * 14 + 13].w - arc;
        float band = smoothstep(5., 6.2, tipD) * (1. - smoothstep(11.3, 12.5, tipD));   // the neck of the tassel, bound
        vec3 B = cross(T, N);
                float arcS = arc + uSlide * (0.6 + 0.8 * vHash(aTube.z * 5.3)) * step(0.5, aCurve.w) + uSlide * (1. - step(0.5, aCurve.w));
        float Rb = uR * rs;
        float phi = 6.2831853 * (aCurve.z + uTwistB * arcS);
        vec3 er = N * cos(phi) + B * sin(phi), ep = B * cos(phi) - N * sin(phi);
        float th = 6.2831853 * aTube.x;
        // a rope tied a little slack lifts off the bundle here and there
        float slack = vNoise(arcS * 0.045 + aTube.z * 31.) ; slack = slack * slack * slack * 1.5 * step(0.7, vHash(aTube.z * 9.1));
        float arcC = arc + uSlide;
        float scR = 1. + 0.05 * cos(6.2831853 * uHanks * (aCurve.z + uTwistB * (arcS - arcC)));
        float scC = 1. + 0.05 * cos(6.2831853 * uHanks * (aTube.x - uTwistB * arcS));
        scC = mix(scC, 1.07, band);
        vec3 prc = C + er * (Rb * scR + 0.5 + slack * (1. - band) - 1.6 * band);
        vec3 pr = prc + (er * cos(th) + ep * sin(th)) * aTube.y;
        vec3 nr = er * cos(th) + ep * sin(th);
        vec3 nc = N * cos(th) + B * sin(th);
        vec3 pc = C + nc * (Rb * scC);
        float k = step(0.5, aCurve.w);
        vec3 p = mix(pc, pr, k), n = mix(nc, nr, k);
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vNv = mat3(viewMatrix) * (mat3(modelMatrix) * n);
        vCtr = vec4((modelMatrix * vec4(prc, 1.)).xyz, aTube.y * k);   // (fix 6) a riding rope's own centreline: it is drawn round
        vArc = arcS; vAng = aTube.x; vSeed = aTube.z; vKind = k; vTip = tipD;
        // the dip (static, it never climbs). The tail: blue from a hard tide line for most of its hauled run, indigo
        // towards the tip. The knot itself: whatever stood in the sea when the eye was tied (height in the open-eye
        // pose, worked back from the draw: uDrawP = scale, centre y), so the feet and the sill come up blue.
        // The tail lay awash before it was hauled: its belly is blue to a tide line that runs along it, its back is cream
        // (while it hangs plumb from the hand it is dipped all round); the last metres to the tip are dipped whole.
        float dT = uDipLen - tipD;   // (one tide height for the core and the ropes that ride it)
        float belly = mix(3., 3.6 - (p.y - C.y), 1. - smoothstep(0.3, 0.7, abs(T.y)));
        float dipTail = max(dT * 0.45, mix(-50., belly * 0.9, smoothstep(11.3, 11.9, aCurve.x)));
        float y4 = 36. + (C.y - uDrawP.y) / max(uDrawP.x, 0.2) + (p.y - C.y) / max(rs, 0.3);
        float inKnot = smoothstep(2.6, 3., aCurve.x) * (1. - smoothstep(11., 11.4, aCurve.x));
        vDip = max(dipTail, mix(-50., (uTideK - y4) * 0.8, inKnot));
        // tone is how much cord lies on cord. Where this bundle bears on the other (its surface within a few metres
        // of the other's: the crossings) and round the inside of the eye, the surface takes the groove tint; the
        // Knot as a whole sits a tone under a plain hanging run. (Distance to the other bundle's centreline, on the
        // same curve; the fragment shader steps it from hank to hank.)
        int ob = (1 - int(aCurve.y + 0.5)) * 14;
        float dmin = 1e4; vec3 qa = crPos(ob, 2.);
        for (int i = 1; i <= 30; i++) { vec3 qb = crPos(ob, 2. + float(i) * 0.33333);
          vec3 ab = qb - qa; float hh = clamp(dot(p - qa, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
          dmin = min(dmin, length(p - qa - ab * hh)); qa = qb; }
        float contact = 1. - smoothstep(5., 19., dmin - uR * 0.9);
        vec3 ncore = mix(nc, er, k);
        vec3 toEye = vec3(0., uDrawP.y, 0.) - C; toEye = toEye / max(length(toEye), 1e-3);
        float inner = smoothstep(0.0, 0.5, dot(ncore, toEye)) * inKnot;
        vBear = vec2(max(contact, 0.8 * inner) * (1. - smoothstep(11.3, 11.9, aCurve.x)), (0.9 + 0.06 * inKnot) * (1. - 0.75 * smoothstep(11.3, 11.9, aCurve.x)));   // (fix 8: a great bundle is a thousand ropes, cord on cord, all the way up: plainly darker than a single strand from the first frame)   // (a hauled tail: a cream back, a blue belly)
        vNc = mat3(viewMatrix) * (mat3(modelMatrix) * ncore);
        // which hank this is (a riding rope: the hank it lies on), for the tide line and the tone step
        float sq = floor((aCurve.y * 0.37 + 0.11) * 256. + 0.5) / 256.;
        vHk = (mix(aTube.x, aCurve.z + uTwistB * arcS, k) - uTwistB * arcC) * uHanks + sq * uHanks / max(uNS, 1.) + 0.5;
        vTail = vec2(smoothstep(11.3, 11.9, aCurve.x), aCurve.y);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:O+j+`
      uniform float uNS, uTwistB, uHanks;
      varying float vArc, vAng, vSeed, vKind, vDip, vTip, vHk; varying vec3 vW, vNv, vNc; varying vec2 vBear, vTail; varying vec4 vCtr;
      void main(){
        float a = vAng * 6.2831853; vec2 cs = vec2(cos(a), sin(a));
        float dAng = length(fwidth(cs)) / 6.2831853;
        vec3 nv = vNv / max(length(vNv), 1e-4);
        float kind = step(0.5, vKind);
        // each hank took the dye to its own height (the tail's belly: one line, a little uneven), and takes the
        // bearing tone or not as a whole: both step from hank to hank, hard-edged
        float hk = floor(vHk), hj = sHash(hk * 7.1 + vTail.y * 3.3) - 0.5, hj2 = sHash(hk * 3.9 + vTail.y * 5.1 + 0.7) - 0.5;
        // (fix 8) the cord under this fragment (the same count cordShade makes), how wide it is on screen, and the dip
        // taken at the cord's own middle: the dye then ends square across each rope, at that rope's own place
        float sdq = floor(vSeed * 256. + 0.5) / 256., cc = vAng * uNS - vArc * uTwistB * uNS + sdq, cellK = floor(cc);
        vec2 gA2 = vec2(dFdx(vArc), dFdy(vArc)), gC2 = vec2(cs.x * dFdx(cs.y) - cs.y * dFdx(cs.x), cs.x * dFdy(cs.y) - cs.y * dFdy(cs.x)) / 6.2831853 * uNS - gA2 * uTwistB * uNS, gD2 = vec2(dFdx(vDip), dFdy(vDip));   /* (the cord count's own slope on screen, without the seam of the angle) */
        float detK = gA2.x * gC2.y - gA2.y * gC2.x, dC1 = abs(gC2.x) + abs(gC2.y);
        float BcK = (gD2.y * gA2.x - gD2.x * gA2.y) / (abs(detK) > 1e-9 ? detK : 1e9);
        float dipC = vDip + clamp(BcK * (cellK + 0.5 - cc), -1.5, 1.5) * (1. - kind);
        float nearK = 1. - smoothstep(0.2, 0.34, dC1);
        float fwB = max(fwidth(vBear.x), 1e-3);
        // (fix 6) and each cord takes it to its own length along the bundle: the bearing tone ends as a comb, cord by
        // cord, like the dip, never along the straight edge of a facet
        float cq1 = mix(floor(vAng * uNS - vArc * uTwistB * uNS + vSeed), floor(vSeed * 977.), kind);
        float bq = smoothstep(0.5 - fwB, 0.5 + fwB, vBear.x + (sHash(cq1 * 2.17 + 0.9) - 0.5) * 0.6);
        // the pale rim: along the outline of a great bundle the outermost cords stay crown cream, a broad band on
        // the upper left and a thin one elsewhere
        vec3 ncv = vNc / max(length(vNc), 1e-4);
        float e = 1. - abs(ncv.z), fwE = max(fwidth(e), 1e-3);
        float thr = mix(0.88, 0.42, clamp(dot(ncv.xy, vec2(-0.707, 0.707)) * 1.5, 0., 1.));
        float cj = sHash(cq1 * 1.7 + 3.1) - 0.5;
        float rimBand = smoothstep(thr - fwE, thr + fwE, e + cj * 0.1);
        // (fix 7) the tail's cream back begins cord by cord (a comb, not a gradient), and each bundle's flank that
        // faces the lower right sits a tone deeper, cord by cord: a round mass without any light
        float fwT = max(fwidth(vTail.x), 1e-3), tailK = smoothstep(0.5 - fwT, 0.5 + fwT, vTail.x + cj * 0.7);
        float lrC = dot(ncv.xy, vec2(0.707, -0.707)), fwL = max(fwidth(lrC), 1e-3);
        float shadeC = smoothstep(0.4 - fwL, 0.4 + fwL, lrC + cj * 0.2);
        float bear = max(mix(vBear.y / max(1. - 0.75 * vTail.x, 0.25) * (1. - 0.75 * tailK), 0.92, bq), 0.8 * shadeC) * (1. - rimBand);
        // (fix 8) NEAR THE LENS THE KNOT IS ROPES, and its darkness is the groove tint in every gap between them: the
        // crowns stay cream, the valley between two ropes widens with how much cord bears there (a smooth measure:
        // no patch edge), deepest where the bundles bear on each other and round the inside of the eye
        gGapG = nearK; gGapW = nearK * (0.2 * vBear.y / max(1. - 0.75 * vTail.x, 0.25) * (1. - 0.75 * tailK) + 0.17 * smoothstep(0.15, 0.9, vBear.x));
        bear = mix(bear, 0.12 + 0.34 * bear, nearK);
        float strands = mix(uNS, 1., kind);
        float tw = mix(-uTwistB * uNS, 0., kind);
        // the binding at the neck of the tassel: nine turns laid round the bundle
        float band = step(5.6, vTip) * (1. - step(11.9, vTip)) * (1. - kind);
        float arcIn = mix(vArc, vAng * 69., band), angIn = mix(vAng, clamp((vTip - 5.6) / 6.3, 0., 1.), band);
        float dIn = mix(dAng, fwidth(vTip) / 6.3, band);
        strands = mix(strands, 9., band); tw *= 1. - band;
        // (fix 5) and within a hank each cord took it to its own height: the tide line is a comb, strand by strand,
        // at every distance (cords of four ropes), never a paint cut
        float cq = floor((vAng * strands + vArc * tw + vSeed) / 4.);
        // (fix 8) THE TIDE LINE IS DRAWN ROPE BY ROPE: each rope took the dye to its own height (a rope's width or two
        // apart), the dye ends square across it, and the line between a blue rope and a cream one is the valley
        // between them; no step from hank to hank, no slanted cut across the bundle
        float dip = dipC + ((sHash(cellK * 1.37 + 2.3 + vTail.y * 5.) - 0.5) * mix(1.5, 0.8, vTail.x) * (1. - kind) + (sHash(floor(vSeed * 977.) * 0.73 + 1.9) - 0.5) * 1.2 * kind + 0.9 * sin(vHk * 2.1 + vTail.y * 2.) * (1. - vTail.x)) * (1. - band);   // (fix 7: the tide line wanders along the bundle and combs rope by rope; no square teeth)
        ropeRound(vCtr, vW, cameraPosition, vAng, gl_FrontFacing ? 1. : 0.);
        vec3 c = cordShade(arcIn, angIn, dIn, 0.9, strands, tw, uHanks * (1. - kind) * (1. - band), dip, vSeed, nv, vW, cameraPosition, 0., 0., bear * (1. - band), kind * (uTwistB > 0. ? 1. : -1.));
        // (fix 7) the wall's outline against the void is scalloped rope by rope: near the lens the core is cut in along
        // its limb where a ply's groove meets the flank of the outermost cord (about a fifth of a rope deep; riding
        // ropes stand proud of it), which also hides the facets of the tube
        float sG = 0.5 + 0.5 * cos(6.2831853 * (vArc / 0.8 + sHash(cq1 * 1.31 + 0.7)));
        if (kind < 0.5 && band < 0.5 && abs(ncv.z) < (0.07 + 0.06 * sG * sG) * (1. - smoothstep(0.08, 0.22, dAng * uNS))) discard;
        gl_FragColor = vec4(c, 1.);
      }`})}async function pe(e,a,m){const s=[],i=[],b=[],p=x=>{const h=[];for(let y=0;y<13;y++){const o=x[y];for(let l=0;l<o;l++)h.push(y+l/o)}return h.push(13),h},w=p([6,8,12,18,18,18,18,18,18,18,18,18,12]),C=p([4,5,8,12,12,12,12,12,12,12,12,12,8]),R=(x,h,y,o,l,f,g)=>{const T=s.length/4;for(let A=0;A<x.length;A++)for(let P=0;P<=h;P++)s.push(x[A],y,o,l),i.push(P/h,f,g);return T},c=(x,h,y)=>{for(let o=0;o<h-1;o++)for(let l=0;l<y;l++){const f=x+o*(y+1)+l,g=f+y+1;b.push(f,f+1,g,f+1,g+1,g)}},r=(x,h,y,o,l,f,g)=>c(R(x,h,y,o,l,f,g),x.length,h);await e.yield();for(let x=0;x<2;x++){{const h=R(w,36,x,0,0,0,x*.37+.11);await e.yield(),c(h,w.length,36)}await e.yield();for(let h=0;h<m;h++){const y=(h+a.range(-.3,.3))/m;r(C,5,x,y,1,a.range(.3,.38),a()),h%3===2&&await e.yield()}await e.yield()}const n=new t.BufferGeometry;return n.setAttribute("aCurve",new t.BufferAttribute(new Float32Array(s),4)),await e.yield(),n.setAttribute("aTube",new t.BufferAttribute(new Float32Array(i),3)),n.setAttribute("position",new t.BufferAttribute(new Float32Array(s.length/4*3),3)),await e.yield(),n.setIndex(b),n.boundingSphere=new t.Sphere(new t.Vector3(0,200,0),520),await e.yield(),n}const me=[[-150,420,0],[-121,250,5],[-92,112,11],[-60,50,13],[-30,62,5],[0,77,-13],[38,84,-3],[66,36,13],[38,-12,-3],[0,-5,-13],[-30,10,5],[-60,22,13],[-92,3,18],[-114,-3,60]],oe=[0,36,0],re=-13,de=(e,a,m)=>{const s=Math.min(12,Math.max(0,Math.floor(a))),i=Math.min(1,Math.max(0,a-s)),b=e[Math.max(s-1,0)],p=e[s],w=e[s+1],C=e[Math.min(s+2,13)],R=i*i,c=R*i;for(let r=0;r<3;r++)m[r]=.5*(2*p[r]+(w[r]-b[r])*i+(2*b[r]-5*p[r]+4*w[r]-C[r])*R+(3*p[r]-b[r]-3*w[r]+C[r])*c);return m},J=(e,a,m)=>{const s=Math.min(1,Math.max(0,(m-e)/(a-e)));return s*s*(3-2*s)},Q=[4,13,21,29,35,39.2,44];function ne(e){if(e<=Q[0])return 0;for(let a=0;a<6;a++)if(e<Q[a+1])return a+(e-Q[a])/(Q[a+1]-Q[a]);return 6}function ge(e){const s=me.map((o,l)=>l<1?o.slice():[o[0]+e.range(-2.5,2.5),o[1]+e.range(-2,2)*(l>2&&l<12?1:.3),o[2]+e.range(-1,1)*(l>12?6:0)]),i=new Float32Array(393),b=new Float32Array(131),p=[0,0,0];for(let o=0;o<131;o++)de(s,o/10,p),i.set(p,o*3),b[o]=o?b[o-1]+Math.hypot(p[0]-i[o*3-3],p[1]-i[o*3-2],p[2]-i[o*3-1]):0;const w=[];for(let o=0;o<14;o++)w.push(b[o*10]);const C=[0,5,7.5,9,13],R=[];for(let o=0;o<14;o++)R.push([0,0,0]);const c=new Float32Array(393),r=[0,0,0],n=[0,0,0],x=e.range(0,6.28),h=e.range(-.3,.3);function y(o,l,f,g,T,A){const P=Math.min(4,Math.max(0,o)),M=Math.min(3,Math.floor(P)),z=C[M]+(C[M+1]-C[M])*J(0,1,P-M),u=Math.min(129,Math.floor(z*10)),G=z*10-u,D=b[u]+(b[u+1]-b[u])*G,F=i[u*3]+(i[u*3+3]-i[u*3])*G,L=i[u*3+1]+(i[u*3+4]-i[u*3+1])*G,U=i[u*3+2]+(i[u*3+5]-i[u*3+2])*G,B=f?1-2*J(11,12,z):1,E=J(4,5,o),N=Math.max(0,o-5)*4.8,v=E+(o>5?Math.exp(-N*3.2)*Math.sin(N*10)*.035:0),Y=1-.6*v,$=1-.3*v,X=oe[1]-5*v,ce=Math.sin(l*6.2831853/25+x+f*.9)*.035,he=Math.cos(l*6.2831853/19+x*1.7+f)*.02;for(let d=0;d<14;d++){const k=R[d],S=s[d];let V=1;if(w[d]<=D+.001)k[0]=S[0],k[1]=S[1],k[2]=S[2],d>=3&&d<=11?(k[0]=S[0]*Y,k[1]=X+(S[1]-oe[1])*Y,k[2]=S[2]*$,V=1-.27*v):d===2?(k[0]=S[0]+22*v,k[1]=S[1]-14*v):d===12?(k[0]=S[0]+(-46-S[0])*v,k[1]=S[1]+(27-S[1])*v,k[2]=S[2]+(66-S[2])*v,V=1-.3*v):d===13&&(k[0]=S[0]+(-56-S[0])*v,k[1]=S[1]+(26-S[1])*v,k[2]=S[2]+(150-S[2])*v),f&&d>=12&&(k[2]=-k[2]);else{const W=w[d]-D;let ee=L-W,te=0;ee<re&&(te=re-ee,ee=re);const se=W-te;k[0]=F+(ce+h*.02)*se+te*.25,k[1]=ee,k[2]=U*B+he*se+te*.5*B}d===13&&(V*=.62-.2*v);const q=(f*14+d)*4,H=f?-1:1;g[q]=k[0]*H,g[q+1]=k[1],g[q+2]=k[2]*H,T[q+3]=V}const Z=f?-1:1;let ie=0;r[0]=0,r[1]=0,r[2]=1;for(let d=0;d<131;d++)de(R,d/10,p),c[d*3]=p[0]*Z,c[d*3+1]=p[1],c[d*3+2]=p[2]*Z;for(let d=0;d<131;d++){const k=Math.max(0,d-1)*3,S=Math.min(130,d+1)*3;n[0]=c[S]-c[k],n[1]=c[S+1]-c[k+1],n[2]=c[S+2]-c[k+2];const V=Math.hypot(n[0],n[1],n[2])||1;n[0]/=V,n[1]/=V,n[2]/=V;const q=r[0]*n[0]+r[1]*n[1]+r[2]*n[2];r[0]-=n[0]*q,r[1]-=n[1]*q,r[2]-=n[2]*q;let H=Math.hypot(r[0],r[1],r[2]);if(H<1e-4&&(r[0]=n[1],r[1]=-n[0],r[2]=.01,H=Math.hypot(r[0],r[1],r[2])||1),r[0]/=H,r[1]/=H,r[2]/=H,d&&(ie+=Math.hypot(c[d*3]-c[d*3-3],c[d*3+1]-c[d*3-2],c[d*3+2]-c[d*3-1])),d%10===0){const W=(f*14+d/10)*4;g[W+3]=ie,T[W]=r[0],T[W+1]=r[1],T[W+2]=r[2]}}A&&(A.q=D,A.hand=[F*Z,L,U*Z],A.draw=v,A.arcKnot=g[(f*14+3)*4+3])}return{solve:y,F:s,arcF:w,cur:c,NS:131}}function we(e,a){return new t.ShaderMaterial({side:t.DoubleSide,uniforms:_(e,a),vertexShader:ae+`
      attribute vec4 aCurve;  // phiDisc (turns), bundle, radial place 0..1, strand length m
      attribute vec4 aTube;   // theta (turns), radius m, seed, l 0..1 along the strand
      uniform float uR, uTime;
      varying float vArc, vAng, vSeed, vDip; varying vec3 vW, vNv;
      void main(){
        vec3 C, T, N; float arc, rs; knotCurve(13., aCurve.y, C, T, N, arc, rs);
        vec3 B = cross(T, N);
        float ph = 6.2831853 * aCurve.x; vec3 er = N * cos(ph) + B * sin(ph);
        float up = smoothstep(-11., -5., C.y);   // a tail lying on the sea bed keeps its tassel under
        float s = aTube.w * aCurve.w * up, sd = aTube.z;
        vec3 p = C + er * (uR * rs * aCurve.z * 0.92) - T * 1.5;
        p += T * s * 0.8 + er * (s * 0.22 * aCurve.z);          // combed out
        p.y -= 0.016 * s * s;                                     // gravity is the ruler
        float fl = 0.12 + sd * 0.3;                                // the sea: strands float and trail
        float wet = 1. - smoothstep(fl, fl + 3., p.y);
        p.xz += wet * s * 0.035 * vec2(sin(uTime * 0.5 + sd * 40. + s * 0.2), cos(uTime * 0.41 + sd * 23. + s * 0.17));
        p.xz += (1. - wet) * s * 0.02 * vec2(sin(uTime * 0.9 + sd * 17.), cos(uTime * 0.8 + sd * 11.));
        p.y = max(p.y, fl);
        float th = 6.2831853 * aTube.x; vec3 n = N * cos(th) + B * sin(th);
        n = mix(n, vec3(cos(th), abs(sin(th)), 0.), wet);
        p += n * aTube.y * up;
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vNv = mat3(viewMatrix) * (mat3(modelMatrix) * n);
        vArc = s; vAng = aTube.x; vSeed = sd; vDip = 1.2 + s * 0.2;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:O+j+`
      varying float vArc, vAng, vSeed, vDip; varying vec3 vW, vNv;
      void main(){
        float a = vAng * 6.2831853; vec2 cs = vec2(cos(a), sin(a));
        float dAng = length(fwidth(cs)) / 6.2831853;
        vec3 nv = vNv / max(length(vNv), 1e-4);
        gl_FragColor = vec4(cordShade(vArc, vAng, dAng, 0.6, 1., 0., 0., vDip, vSeed, nv, vW, cameraPosition, 0., 0., 0., 0.), 1.);
      }`})}function xe(e,a){const m=[],s=[],i=[];for(let C=0;C<2;C++)for(let R=0;R<a;R++){const c=e(),r=Math.sqrt(e()),n=e.range(16,30)*(e.chance(.15)?.6:1),x=e.range(.26,.34),h=e(),y=m.length/4;for(let o=0;o<=9;o++)for(let l=0;l<=4;l++)m.push(c,C,r,n),s.push(l/4,x*(o===9?.5:1),h,o/9);for(let o=0;o<9;o++)for(let l=0;l<4;l++){const f=y+o*5+l,g=f+4+1;i.push(f,f+1,g,f+1,g+1,g)}}const w=new t.BufferGeometry;return w.setAttribute("aCurve",new t.BufferAttribute(new Float32Array(m),4)),w.setAttribute("aTube",new t.BufferAttribute(new Float32Array(s),4)),w.setAttribute("position",new t.BufferAttribute(new Float32Array(m.length/4*3),3)),w.setIndex(i),w.boundingSphere=new t.Sphere(new t.Vector3(0,200,0),520),w}function ye(e,a){return new t.ShaderMaterial({side:t.DoubleSide,uniforms:_(e,a),vertexShader:ae+`
      attribute vec4 aCurve;  // t along the tail, bundle, place across the underside 0..1, seed
      attribute vec2 aDrop;   // which drop of its string (0..1), or -1 for the ring on the sea; reach along the tassel m
      uniform float uR, uTime, uDrip, uPxK;
      varying vec2 vQ; varying float vRing, vPh;
      void main(){
        vec3 C, T, N; float arc, rs; knotCurve(aCurve.x, aCurve.y, C, T, N, arc, rs);
        float sd = aCurve.w;
        vec3 sideV = cross(T, vec3(0., 1., 0.)); sideV.y = 0.; sideV += vec3(0.0013, 0., 0.0007) * step(dot(sideV, sideV), 1e-6);
        sideV = sideV / max(length(sideV), 1e-4);
        vec3 cw = (modelMatrix * vec4(C, 1.)).xyz;
        sideV *= dot(sideV, cameraPosition - cw) < 0. ? -1. : 1.;
        // a drop lets go at the belly of the tail on the eye's side (where it is first seen it is already clear
        // of the cream), or from the lowest strands of the tassel
        float Rr = uR * rs, ext = aDrop.y, tas = step(0.01, ext), a = mix(1.02 + 0.62 * aCurve.z, aCurve.z - 0.4, tas);   // shed off the flank, clear of it
        vec3 o = C + sideV * (Rr * a) + T * (ext * 0.8);
        o.y = mix(C.y - Rr * max(0.8, sqrt(max(1. - a * a, 0.))) - 0.2, C.y - (Rr * 0.92 + 0.22 * ext) * 0.9 - 0.016 * ext * ext - 0.3, tas);
        // one clock for every string (2.8 s a drop, five to a string): a drop is gone when it reaches the sea,
        // and the ring starts from that instant
        float y0 = max(o.y, 0.6);
        float ring = step(aDrop.x, -0.5);
        // (fix 5) a string is five tears let go one after the other, a drop's length or two apart, falling together
        // as one plumb column; its ring opens where the first of them lands
        float age = fract(uTime / 2.8 + max(aDrop.x, 0.) + sd * 7.) * 2.8;   // (fix 8: the five tears of a string are let go evenly, so a string is a dotted plumb line from the tail to its ring, never a peg)
        float tq = age / 2.8, yd = y0 * (1. - (0.6 * tq + 0.4 * tq * tq));
        float on = step(sd, uDrip) * step(1., o.y) * mix(step(0.05, yd), 1., ring);
        vec3 pw = (modelMatrix * vec4(o.x, mix(max(yd, 0.), 0.07, ring), o.z, 1.)).xyz;
        float px = distance(pw, cameraPosition) * uPxK, rad = clamp(0.42, 3.1 * px, 5. * px);   // 4 to 5 px across
        pw += vec3(position.x, 0., position.y) * (7. * on * ring);
        vec4 mv = viewMatrix * vec4(pw, 1.); mv.xy += position.xy * (rad * on * (1. - ring));
        vQ = position.xy * 7.; vRing = ring; vPh = fract(uTime / 2.8 + sd * 7.);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:O+j+`
      varying vec2 vQ; varying float vRing, vPh;
      void main(){
        float r = length(vQ), dr = max(fwidth(r), 1e-4), hw = max(0.09, 0.95 * dr);
        float rr = 0.8 + 5.6 * vPh;
        float line = max(1. - smoothstep(hw - 0.5 * dr, hw + 0.5 * dr, abs(r - rr)), 1. - smoothstep(hw - 0.5 * dr, hw + 0.5 * dr, abs(r - 0.55 * rr)));
        if (vRing > 0.5 && line < 0.5) discard;
        gl_FragColor = vec4(uBlue, 1.); }`})}function be(e,a,m){let s=0;const i=()=>(s++,e());i.range=(n,x)=>n+(x-n)*i();const b=[[0,1.9],[-.66,.72],[-1,0],[-.71,-.71],[0,-1],[.71,-.71],[1,0],[.66,.72]],p=5,w=[],C=[],R=[],c=[];for(let n=0;n<a;n++){const x=Math.max(1,Math.floor(a/2)),h=n>>1,y=h%4===3,o=n&1,l=y?13:12.7-.55*((h+.5+.3*(i()-.5))/x),f=i(),g=i(),T=y?4+13*((h+i())/x):0;let A=y?f:(h%4===0?.12:.8)+.15*(f-.5),P=g,M=l;if(!y&&h%4===1){const u=h>>2;M=11.56+.14*u,A=.15+.3*u+.1*(f-.5),P=.3*g}if(!y&&h%4!==1){const u=(h>>2)*2+(h%4===2?1:0);u<6?(M=12.28+.125*u+.02*(f-.5),A=.22+.19*u+.08*(g-.5)):(M=12.04+.1*(u-6),A=.3+.5*(u-6))}for(let u=0;u<p;u++){const G=w.length/3;w.push(0,0,0),C.push(M,o,A,P),R.push(u/p,T);for(const D of b)w.push(D[0],D[1],0),C.push(M,o,A,P),R.push(u/p,T);for(let D=0;D<8;D++)c.push(G,G+1+D,G+1+(D+1)%8)}const z=w.length/3;for(const u of[[-1,-1],[1,-1],[1,1],[-1,1]])w.push(u[0],u[1],0),C.push(M,o,A,P),R.push(-1,T);c.push(z,z+1,z+2,z,z+2,z+3)}for(;s<m;)i();const r=new t.BufferGeometry;return r.setAttribute("position",new t.BufferAttribute(new Float32Array(w),3)),r.setAttribute("aCurve",new t.BufferAttribute(new Float32Array(C),4)),r.setAttribute("aDrop",new t.BufferAttribute(new Float32Array(R),2)),r.setIndex(c),r.boundingSphere=new t.Sphere(new t.Vector3(0,200,0),520),r}async function Re(e,a={}){const m=e.rng.fork?e.rng.fork("the-knot"):e.rng,s=Math.min(1,Math.max(.6,a.detail??e.quality?.detail??1)),i=a.style||le(a.palette||K),b=new t.Group;b.name="the-knot";const p=ge(m);await e.yield();const w=30,C=11,R=(m.chance(.5)?1:-1)/m.range(70,115),c=new Float32Array(112),r=new Float32Array(112),n={uCP:{value:c},uCN:{value:r},uKink:{value:new t.Vector4(0,0,14,0)},uR:{value:C},uTwistB:{value:R},uSlide:{value:0},uDipLen:{value:m.range(11,16)},uTideK:{value:11},uDrawP:{value:new t.Vector2(1,36)},uNS:{value:72},uHanks:{value:9},uTideJ:{value:.22},uDrip:{value:0},uFine:{value:new t.Vector3(.24,7,0)},uPxK:{value:.0012},uKeep:{value:1}};await e.yield();const x=new t.Mesh(await pe(e,m,w),ve(i,n));x.frustumCulled=!1,b.add(x),await e.yield();const h=xe(m,Math.round(110*s));await e.yield();const y=new t.Mesh(h,we(i,n));y.frustumCulled=!1,b.add(y),await e.yield();const o=new t.Mesh(be(m,32,Math.round(320*s)*3),ye(i,n));o.frustumCulled=!1,b.add(o),await e.yield();let l=null,f=null;a.backdrop!==!1&&(l=new t.Mesh(new t.CircleGeometry(3200,48).rotateX(-Math.PI/2),fe({style:i})),l.name="sea",b.add(l),f=new t.Mesh(new t.SphereGeometry(10,24,12),ue({style:i})),f.frustumCulled=!1,f.renderOrder=-1,b.add(f));const g={},T=l?l.material.uniforms.uWake.value:null;let A=-1,P=-1;const M=new t.Vector2,z=(F,L)=>{for(let B=0;B<2;B++)if(p.solve(F,L,B,c,r,g),T){const E=p.cur;let N=0;for(let v=1;v<p.NS&&N<4;v++){const Y=E[v*3-2],$=E[v*3+1];if(Y>0!=$>0){const X=Y/(Y-$);T[B*4+N].set(E[v*3-3]+(E[v*3]-E[v*3-3])*X,E[v*3-1]+(E[v*3+2]-E[v*3-1])*X,12,1),N++}}if(g.draw>.05&&N<4){const v=(B*14+13)*4;T[B*4+N].set(c[v],c[v+2],9,J(.2,.8,g.draw)),N++}for(const v of[117,124])g.draw>.05&&N<4&&(T[B*4+N].set(E[v*3],E[v*3+2],6,J(.12,.5,g.draw)),N++);for(;N<4;N++)T[B*4+N].w=0}const U=Math.max(0,F-5)*4.8;n.uKink.value.set(g.arcKnot-U*120,F>5?3.5*Math.min(1,U*6):0,14,0),n.uDrip.value=J(4.15,4.6,F),n.uDrawP.value.set(1-.6*g.draw,oe[1]-5*g.draw),P=F};z(4,0);const u=Math.sin(11*Math.PI/180),G=Math.cos(11*Math.PI/180),D={eye:new t.Vector3(0,30,0),flyThrough:[[0,9,-100],[0,12,-70],[0,19,-40],[0,26,-18],[0,30,0],[0,34,20],[0,40,50],[0,46,80]].map(F=>new t.Vector3(...F)),portalSeat:{position:new t.Vector3(0,46,80),facing:new t.Vector3(0,-u,-G)},viewpoints:{approach:new t.Vector3(0,9,-100),hero:new t.Vector3(0,16,-62),wide:new t.Vector3(40,60,-230)},tops:[new t.Vector3(-150,420,0),new t.Vector3(150,420,0)],tailTips:[new t.Vector3(p.F[13][0],0,p.F[13][2]),new t.Vector3(-p.F[13][0],0,p.F[13][2])]};return{object:b,radius:120,height:110,center:new t.Vector3(0,42,0),anchors:D,ground:!1,groundY:0,sea:l,voidDome:f,uniforms:n,style:i,clockAtSeconds:ne,setClock(F){A=Math.min(6,Math.max(0,F))},setSeconds(F){A=ne(F)},update(F,L,U){i.uTime.value=L,n.uSlide.value=L*.5,e.renderer&&(e.renderer.getDrawingBufferSize(M),n.uPxK.value=.96/Math.max(M.y,200));const B=A>=0?A:ne((L+22.5)%50);z(B,L)},dispose(){}}}export{ae as CURVE_GLSL,K as PALETTE,j as STYLE_GLSL,Ce as beechMaterial,Re as buildHero,ne as clockAtSeconds,Se as cordMaterial,le as makeStyleUniforms,fe as seaMaterial,ke as setStylePalette,ue as voidMaterial};
