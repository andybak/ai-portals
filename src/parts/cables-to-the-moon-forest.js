import*as g from"three";import{cmStream as P,crownSites as te,crownTop as oe,CM_GLSL as k,withShared as D,Geo as B,bound as K,peakH as V,peakLump as ae,crownSize as ne,clamp as M,lerp as C,sstep as j,ROOF_Y as Y}from"./cables-to-the-moon-common.js";const $=`
// x: the shadow of high cloud, drifting, an edge to it; y: the sun between clouds; z: the old patches of forest
// (-0.5 .. 0.5); w: a rift, a long dark valley of leaf. fw, the pixel's reach, WIDENS THE RIFT'S EDGE ONE WAY
// (outward: 0.014 + fw * 0.0003), so the rift's mean over the land RISES with the footprint (mend U, the code
// reader's count: 0.037 near; 0.28 to 0.30 at a reach of 460 to 490 m): it darkens far wood under flat
// rays. Said, not mended: it is named for the first polish round.
vec4 cnLandAt(vec2 p, float fw){
  float cloud = smoothstep(0.52, 0.62, cmF((p + uTime*vec2(7.0, 2.2))*0.0009 + 4.0));
  float bright = smoothstep(0.56, 0.64, cmF((p + uTime*vec2(7.0, 2.2))*0.0013 + 31.0))*(1.0 - cloud);
  float rf = abs(cmF(p*0.00055 + 7.0) - 0.5);
  return vec4(cloud, bright, cmF(p*0.0021 + 3.0) - 0.5, 1.0 - smoothstep(0.006, 0.014 + fw*0.0003, rf));
}
// what they do to a leaf's openness
float cnLandAo(vec4 L){ return (1.0 - 0.24*smoothstep(0.0, -0.3, L.z))*(1.0 - 0.8*L.w)*(1.0 - 0.5*L.x); }
// THE LAND'S LARGE RELIEF TELLS (the basins lie in a little shade, the ridges catch the sun); THE ROOF STANDS IN
// RANKS (the long swells are darker where they rise); LONG DARKER VALLEYS run through the forest (a pattern of
// the land drawn out one way, 2.5 km long and 600 m across); and THE STEAM BANKS THROW THEIR SHADE on the leaves
// under them (cmSteam's own banks, drifting with them; read at the roof itself, wherever it has sunk to).
// The ranks and the valleys are light and shade about the wood's own mean (each over its own mean over the
// land, 0.87 and 0.95: mend S); wRank, wVale: how much of each is drawn (the sheet's footprint fades; 1 near).
float cnLandLight(vec2 p, float wRank, float wVale){
  float rel = cmRelief(p), rank = cmN(p*0.0019 + 5.0);
  float valley = smoothstep(0.5, 0.74, cmN(vec2(p.x*0.0004 + p.y*0.00022, p.y*0.0017 - p.x*0.0006) + 21.0));
  float bankS = clamp((cmSteam(vec3(p.x, -cmDrop(p), p.y)) - 0.2)/0.5, 0.0, 1.0);
  return mix(0.64, 1.0, smoothstep(-7.0, 1.0, rel))*(1.0 + 0.22*smoothstep(2.0, 8.0, rel))*mix(1.0, (1.0 - 0.3*smoothstep(0.4, 0.66, rank))/0.87, wRank)*mix(1.0, (1.0 - 0.2*valley)/0.95, wVale)*(1.0 - 0.15*bankS);
}
`,Q=`
${$}
// nearest and second nearest point of a scatter: x = F1, y = F2 - F1, zw = vector to the nearest
vec4 cnCell(vec2 p, out float id){
  vec2 n = floor(p), f = fract(p); float d1 = 8.0, d2 = 8.0; vec2 r1 = vec2(0.0); id = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)), o = cmH2(n + g), r = g + o - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; r1 = r; id = cmH(n + g + 7.7); } else if (d < d2) d2 = d;
  }
  return vec4(sqrt(d1), sqrt(d2) - sqrt(d1), r1);
}
// THE ROOF SEEN FROM ABOVE, at four sizes: leaves (a third of a metre: never drawn one by one here, only as the
// glitter and grain of thousands, each tilted its own way), a tuft (the end of a bough, a clump of some hundreds of
// leaves, 6 m), a crown (34 m, dark between crowns where the depth goes down), the country (stands of forest,
// rifts, the shadows of cloud). p: metres on the roof; n0: the normal of the ground it lies on; tx, tz: where the
// pattern's two axes point in the world; v: to the eye; fw: metres a pixel covers; crownK: 1 where p lies on a
// roof of many crowns, 0 where the whole thing drawn is one crown (kindT: its own number then). The stands'
// tone, the old patches' shade, the cloud's shadow and the sun between clouds are the same at every distance.
// A CROWN'S ROUND (its dome's light, the gap round it, its lit and shaded sides, the shade it throws, its lit
// edge) and its KIND (its colour: new leaf, bronze, flower, dead, old, yellowing) go to their means by ONE
// weight, wCrown (wRound is the same number): by the pixel's reach on the crowns' relief on the sheet, by
// fw on every other thing that calls canopy(). (Mend R's cnRound, a fade by the smaller reach, is gone.)
// (mend T, T1) THE SHEET DRAWS THE CROWNS AS RELIEF (SHEET_FRAG) and hands canopy() two footprints of its own:
// cnCrown, the pixel's reach ON THAT RELIEF (a crown's round goes to its mean by it), and cnFine, the pixel's
// reach on a crown's own surface (its tufts, sprigs and leaves go by it). Under 0: the caller has none, and
// both are fw (the hills' cloth).
float cnCrown = -1.0, cnFine = -1.0;
// cnHid: HOW MUCH OF THE GAPS BETWEEN CROWNS THE RAY CANNOT SEE. The painted sheet sets it by the angle the ray
// makes with the roof (SHEET_FRAG); every other thing that calls canopy() leaves it 0. It is read in ONE
// place, the mean of the rounds (cnMean, below): where it is 1 a crown's sides are as open as its top,
// where it is 0 they are CN_FLK of it. (Mends S and S2 shaded the whole round by it and ended the round's
// fade at two counted numbers, CN_MEAN and CN_MEAN_TOPS, with CN_TOPS for a side's shade: all three are
// gone. In mend T the relief hides the gaps from a flat ray by itself, and the fade's end is cnMean.)
float cnHid = 0.0;
const float CN_GAP = 0.45, CN_GIANT = -0.06;
const vec3 CN_KIND = vec3(1.07, 0.94, 1.45);
// (mend T, T1 a) THE CROWNS' RELIEF AS IT IS DRAWN: the common part's cmCrownH (each crown's dome by the one
// rule of size, its top its own height over the swell, 7 m down in the gaps), with EVERY CROWN'S EDGE ROUNDED
// DOWN INTO THE GAP between it and the next: over the last 0.45 of a crown's lead over its neighbour (some 8 m
// on the map) what is left of its side falls to the gap's floor. Where two crowns of unlike height or size
// meet, cmCrownH has a cliff; drawn, that was a wall with the paint run down it. cnEdge: how much of the
// dome is left at a point by that fall (1 inside, 0 on the line between two crowns); cnSide: how far down
// its side the point lies with it, 0 on the top .. 1 on the gap's floor.
float cnEdge(float lead){ return smoothstep(0.0, 0.45, lead); }
float cnSide(float f1, float lead){ return 1.0 - (1.0 - cmSide(f1))*cnEdge(lead); }
float cnH(vec2 p){ float id; vec2 sq; vec4 c = cmCrownQ(p, id, sq); float s = cnSide(c.x/cmSize(id, sq), c.y); return cmTop(id)*(1.0 - s) - 7.0*s; }
// (mend T, T1 b, with the reader's R1) THE MEAN OF WHAT THE RAY SEES OF THE ROUNDS, DECLARED ONCE, HERE. Where a
// crown is no longer drawn singly (wRound 0) the wood is not the level roof with a number for its shade: it
// is the light of A DOME'S SEVEN FACES, its top and six sides (60 degrees apart round it, the first toward
// the eye: each tilted CN_TILT from the roof's own normal, and wider by CN_GS of the spread of the grain
// that has gone to its mean), every face lit by the leaf's own law (cmLeaf: the sun on it, its shade, and
// the light that comes THROUGH a face turned from the sun, by the ray's turn to the sun), and each counted
// by how much of it the ray sees: its share of the dome (the top CN_TOPW, the sides the rest) times how
// squarely it faces the eye; a face turned from the eye is not seen. WHAT THE FADE TAKES AWAY IT GIVES BACK,
// LIGHT AS WELL AS SHADE: a side has the whole round's own turn-to-the-sun factor (1 + flank (0.5 t - 0.1),
// t the side's turn to the sun's bearing: CN_FLKL is the flank's mean over a side) and the mean of a
// crown's lit-through edge (CN_EDGE of a side turned to the sun: cnEdgeM, added with the tufts' edges by
// the same turn of the ray to the sun). So the wood toward the sun keeps the glow of its lit-through
// sides at every distance and in every size of picture, and away from the sun its lit sides. The sides'
// openness: CN_FLK of the top's where the ray sees the gaps (cnHid 0), the top's own where it sees none;
// the whole by CN_SHD, the mean of the shade a crown throws and of its flanks (the map's count: 0.900 x
// 0.973). The numbers were settled BY COUNT against the whole rounds, in the page, on chance points of the
// map, never at a still (shots/cables-to-the-moon/fix14/cables-to-the-moon-meancal.js: the report's table,
// rays of 2 to 70 degrees, bearings every 10 degrees from the sun's to 60, then 75, 90, 135, 180, 270).
const float CN_TILT = 0.8, CN_TOPW = 0.36, CN_FLK = 0.8, CN_SHD = 0.876, CN_FLKL = 0.25, CN_GS = 0.5, CN_EDGE = 0.46;
// (mend T, the reader's R1, for the GRAIN) WHERE LEAVES, SPRIGS AND TUFTS GO TO THEIR MEANS, THEIR LIGHT GOES TO ITS
// MEAN: the leaf's light (cmLeaf) over the spread of tilts the grain gave the roof, not the light of the one
// flat face left. The tilt a leaf, a sprig or a tuft gives, along one axis, deviates by CN_SL, CN_SS, CN_ST
// (the roof's own unit: a tilt of 1 is 45 degrees); sg is root three times the deviation of all that has
// gone to its mean, and the light is taken at the face and at sg to each side of it ALONG THE SUN'S BEARING
// (the one axis the sun's light and the lit-through light go by), weighed 2/3, 1/6, 1/6: the three-point
// rule for a spread. The numbers were settled by count (fix14/cables-to-the-moon-graincal.js).
const float CN_SL = 0.43, CN_SS = 0.2, CN_ST = 0.31;
// (and what the spread does not give back, counted the same way: a leaf's holes, its young leaves and its
// glitter, a tuft's own lit and shaded sides: the wood with the leaves at their mean stood at 0.93 of the
// wood with them drawn, with the tufts at 0.92: CN_GL, CN_GT are those two made up)
const float CN_GL = 1.075, CN_GT = 1.09;
vec3 cnLeafG(vec3 nU, vec3 ax, float sg, vec3 v, float tone, float ao, float wax){
  vec3 c = cmLeaf(normalize(nU), v, tone, 0.85, ao, wax);
  if (sg > 0.03) c = c*0.6666667 + (cmLeaf(normalize(nU + ax*sg), v, tone, 0.85, ao, wax) + cmLeaf(normalize(nU - ax*sg), v, tone, 0.85, ao, wax))*0.1666667;
  return c;
}
// (mend T, T1 c) NO BLACK HOLES: LEAF IN DEEP SHADE IS DARK GREEN WITH FORM. The shades that lie on the roof (a
// crown's own, a giant's, the hills', the cloud's, the steam banks', the basins', the valleys', the ranks')
// each take their share of a leaf's WHOLE light, and where two or three of them met on a crown's side
// turned from the sun the product fell under the picture's own black (counted with a ramp drawn on the
// sheet: the engine's grade shows a linear green of 0.045 and all under it as black, 0.06 as 30 of 255,
// 0.07 as 44): a hole in the wood, and whole fields of them where the land lies in shade. But a shade
// takes the sun's light, not the sky's: so no leaf PAINTED on the roof's sheet or on a hill's cloth (the two
// that take the floor: mend U; the BUILT crowns and the twigs' leaves take none) is drawn darker than cnFloor, the leaf's
// own darkest green (uLeafD) times CN_DEEP, a little lighter where the leaf's face looks up at the sky
// and by the leaf's own tone and the grain's openness (0.79 to 1.27 of it: the dark keeps the grain's and
// the crown's form).
// cnDeep(): what is drawn comes down to that floor smoothly and never under it (the floor and a soft step
// up from it an eighth of the floor wide: a colour of one and a quarter floors is left as it is within
// an eightieth). The two that call canopy() (the sheet, the hills' cloth) pass their own last shades
// through it; the floor goes to its mean with the round and the grain that form it. CN_DEEP was set on
// the whole field, by the grade's black: the floor shows as 5 to 50 of 255 in green.
const float CN_DEEP = 1.45;
vec3 cnFloor = vec3(0.0);
vec3 cnDeep(vec3 col){ vec3 f = max(cnFloor, vec3(1e-5)), x = 8.0*(col - f)/f; return f + 0.125*f*mix(log(1.0 + exp(min(x, 20.0))), x, step(20.0, x)); }
float cnEdgeM = 0.0;       // (cnMean leaves the lit-through edge's mean over the same faces here)
vec3 cnMean(vec3 nG, vec3 n0, vec3 tx, vec3 tz, vec3 v, float tone, float ao, float wax, float sg){
  vec2 eb = vec2(dot(v, tx), dot(v, tz)); eb /= max(length(eb), 1e-4);          // the eye's bearing on the roof
  vec2 sb = normalize(vec2(dot(uSunDir, tx), dot(uSunDir, tz)) + 1e-4);          // and the sun's
  // (the sides' tilt with the grain's spread in it: the two spreads add by their squares)
  float tl = sqrt(CN_TILT*CN_TILT + CN_GS*sg*sg/3.0), aoS = ao*mix(CN_FLK, 1.0, cnHid), wS = (1.0 - CN_TOPW)/(6.0*sqrt(1.0 + tl*tl));
  float w = CN_TOPW*max(dot(n0, v), 0.0), ws = w, ed = 0.0;
  vec3 c = w*cnLeafG(nG, tx*sb.x + tz*sb.y, sg, v, tone, ao, wax);
  for (int i = 0; i < 6; i++) {
    // (the six sides stand 60 degrees apart round the dome, the first toward the eye)
    float ca = i == 0 ? 1.0 : (i == 3 ? -1.0 : (i == 1 || i == 5 ? 0.5 : -0.5)), sa = i == 0 || i == 3 ? 0.0 : (i < 3 ? 0.8660254 : -0.8660254);
    vec2 d2 = vec2(eb.x*ca - eb.y*sa, eb.x*sa + eb.y*ca); vec3 d = (tx*d2.x + tz*d2.y)*tl;
    w = wS*max(dot(n0 + d, v), 0.0);
    if (w > 0.0) {
      float ts = dot(d2, sb);
      c += w*cmLeaf(normalize(nG + d), v, tone, 0.85, aoS, wax)*(1.0 + CN_FLKL*(0.5*ts - 0.1));
      ed += w*CN_EDGE*max(ts, 0.0); ws += w;
    }
  }
  ws = max(ws, 1e-4); cnEdgeM = ed/ws;
  return c*(CN_SHD/ws);
}
vec3 canopy(vec2 p, vec3 n0, vec3 tx, vec3 tz, vec3 v, float fw, float crownK, float kindT){
  vec2 p0 = p;
  // CRISP AT THE SIZE IT IS SEEN (antialiasing by the pixel's footprint; nothing here blurs wider than it).
  // EVERY SIZE GOES TO ITS MEAN BY THE FOOTPRINT, never by metres from the eye. fw is the pixel's LARGER reach
  // on the thing's own map (round Q, R4 a: seen at a low angle a pixel is long along the line from the eye,
  // and a flat pattern drawn whole where the pixel was already longer than it ran into streaks).
  // A giant's light and shade is whole while fw is under 0.16 of 90 m and at its mean past 0.42 of it; the
  // stands from 0.25 to 0.8 of 420 m. A crown and its grain go by the two footprints below (on the sheet the
  // pixel's reach on the relief and its width where the ray meets a crown; elsewhere fw): a tuft's grain is
  // whole while its footprint is under 0.15 of 6 m and gone past 0.6 of it; sprigs and leaves from 0.25 to
  // 0.9 of 1.5 m and 0.34 m.
  // (mend T, T1 b) A CROWN IS CRISP WHILE IT IS MORE THAN ABOUT TWO PIXELS ACROSS: whole while the pixel's reach
  // (fc) is under 0.4 of 34 m (two and a half pixels to a crown) and at its mean past 0.8 of it (one and a
  // quarter). It was whole only to 6 pixels and, on the sheet, gone under 17 by the smaller reach (mend R).
  float fc = cnCrown < 0.0 ? fw : cnCrown;
  float wCrown = 1.0 - smoothstep(0.4, 0.8, fc/34.0), wLand = 1.0 - smoothstep(0.25, 0.8, fw/420.0);
  float wRound = wCrown;
  float gust = cmGust(p, uTime);
  float idT = 0.0, idS = 0.0, idC, idL;
  vec4 ct = vec4(0.3, 0.3, 0.0, 0.0), cs = vec4(0.3, 0.3, 0.0, 0.0);
  vec2 sqC; vec4 cc = cmCrownQ(p, idC, sqC);
  // (THE ONE RULE OF SIZE, cmSize in the common part: the built crowns call its JS twin)
  float kSz = mix(1.0, cmSize(idC, sqC), crownK);
  float f1s = cc.x/kSz, side = mix(clamp(2.3*f1s*f1s, 0.0, 1.0), cnSide(f1s, cc.y), crownK)*crownK;
  // (mend T, T1 a and c) A CROWN'S SIDE IS LIT LEAF LIKE ITS TOP, down to the GAP between it and the next: leaf in
  // shade (CN_GAP of the top's openness, never a black hole), taken up over the lower half of the side. (It
  // darkened from the top down to 0.07: a painted crown was a bright spot in a wide dark ring, and the wood
  // stood far under the built crowns beside it.) The dome's slope is the relief's own: it falls (top + 7 m)
  // x 2.3 x (r / (34 m x size))^2, so a metre out it tilts 4.6 (top + 7) r / (34 size)^2; its edge tilts more.
  float domeAo = mix(1.0, CN_GAP, smoothstep(0.5, 1.0, side));
  float domeK = mix(1.3/kSz, min(4.6*(cmTop(idC) + 7.0)/(34.0*kSz*kSz), 2.2), crownK), bs = (1.0 - cnEdge(cc.y))*crownK;
  vec2 domeW = cc.zw*domeK*step(side, 0.999) + cc.zw/max(cc.x, 1e-3)*5.0*bs*(1.0 - bs), dome = domeW*wRound;
  // THE GRAIN'S FOOTPRINT (fd): the caller's (fw), or on the sheet's relief the pixel's width where the ray
  // meets the crown (cnFine) over how squarely it meets the crown's own surface there
  float fd = cnFine < 0.0 ? fw : min(fw, cnFine/max(dot(normalize(n0 - tx*dome.x - tz*dome.y), v), 0.05));
  float wLeaf = 1.0 - smoothstep(0.25, 0.9, fd/0.34), wSprig = 1.0 - smoothstep(0.25, 0.9, fd/1.5), wTuft = 1.0 - smoothstep(0.15, 0.6, fd/6.0);
  // (mend T, T1 a: THE GRAIN IS THE MAP'S, on the relief as on the level. A trial that moved it outward by the
  // depth fallen, to lay it on the crown's own surface, drew the tufts and sprigs two to three times too
  // small round every lesser crown, in fine lines of equal height: taken out. On a steep side a leaf is
  // drawn as long as the side is steep.)
  if (wTuft > 0.002) ct = cnCell(p/6.0 + 5.0, idT);
  if (wSprig > 0.002) cs = cnCell(p/1.5 + 11.0, idS);
  vec2 wv = vec2(cmN(p*0.0021 + 1.0), cmN(p*0.0021 + 9.3)) - 0.5;
  vec4 cl = cnCell((p + 200.0*wv)/420.0 + 3.0, idL);
  // leaves: each cell of a third of a metre is one leaf's worth of roof, tilted its own way, some of them holes
  vec2 lc = floor(p/0.34); float id1 = cmH(lc + 3.1), id2 = cmH(lc + 47.7);
  vec2 tilt = (vec2(id1, id2) - 0.5)*1.5;
  tilt += gust*0.5*sin(uTime*(5.0 + 4.0*id2) + id1*40.0)*vec2(id1 - 0.5, id2 - 0.5);
  float hole = step(0.84, fract(id1*7.7 + id2*3.1));
  float young = step(0.93, fract(id1*31.7));
  float leafAo = mix(1.0, 0.25, hole);
  // a sprig and a tuft: mounds of leaves, shaded between mounds
  float sprigAo = 0.55 + 0.45*smoothstep(0.0, 0.3, cs.y);
  // (a tuft is a soft billow of leaf, lit on its sun side: never a dark-edged scale)
  float tuftAo = 0.62 + 0.38*smoothstep(0.0, 0.5, ct.y);
  // the country: whole stands paler or darker, older forest in patches, rifts where a river runs under the roof
  float land = 0.5 + 0.5*cos(idL*6.2831853), landEdge = smoothstep(0.0, 0.25, cl.y);
  // A CROWN IS A DOME OF ITS OWN SIZE: 0.72 to 1.28 of the room the pattern gives it by its own number; a lesser
  // tree is 0.62 to 0.48 of that, ringed by the dim understory it stands in (one in ten, and seven in ten in a
  // drift of small trees); and the one in 25 that stands over the rest (cmTop) fills its room to the edge. Its sides fall into the gap between it and the next
  // (leaf in shade, never a black hole). (The painted look alone:
  // what stands on the roof stands on cmRoof, unchanged.)
  vec2 grain = tilt*wLeaf - cs.zw*0.7*wSprig - ct.zw*1.1*wTuft, bump = grain - dome;
  vec3 nG = n0 + tx*grain.x + tz*grain.y, n = normalize(nG - tx*domeW.x - tz*domeW.y);     // (n: the WHOLE round's)
  vec4 LD = cnLandAt(p0, fw);                       // the land's own shades at the place (LAND_GLSL)
  float cloud = LD.x, bright = LD.y, patchy = LD.z, rift = LD.w;
  float kindC = mix(kindT, fract(idC*3.3), crownK);
  // WHAT KIND OF TREE A CROWN IS (the built crowns read the same two numbers: roofCrowns): in new leaf, bronzed,
  // and of the rest one in ten in flower, one in 17 dead, one in six an older green, one in 18 yellowing
  float kq = fract(idC*29.9), mid_ = step(0.07, kindC)*step(kindC, 0.88)*crownK;
  float kFlower = mid_*step(kq, 0.1), kDead = mid_*step(0.1, kq)*step(kq, 0.16), kOld = mid_*step(0.16, kq)*step(kq, 0.33);
  // THE SHADE OF A CROWN (a rule of the place: the sun stands 15 degrees up on the visit's own bearing): a crown
  // that stands taller toward the sun throws its shade on the roof behind it
  vec2 sx = normalize(vec2(dot(uSunDir, tx), dot(uSunDir, tz)) + 1e-4);
  float shade = 0.0;
  if (wRound*crownK > 0.01) {
    float sd0 = cmSide(cc.x/kSz), hp = cmTop(idC)*(1.0 - sd0) - 7.0*sd0;
    for (int i = 0; i < 3; i++) {
      float L = i == 0 ? 9.0 : (i == 1 ? 18.0 : 30.0), ids; vec2 sqN; vec4 cq = cmCrownQ(p + sx*L, ids, sqN); float sq = cmSide(cq.x/cmSize(ids, sqN));   // (T5: the neighbour's dome by the crowns' one rule of size, as this crown's own is)
      shade = max(shade, smoothstep(0.0, 3.0, cmTop(ids)*(1.0 - sq) - 7.0*sq - hp - 0.268*L));
    }
  }
  float tone = clamp(0.3 + 0.5*(fract(id1*7.1) - 0.3)*wLeaf + 0.3*(fract(idS*3.7) - 0.5)*wSprig + 0.3*(fract(idT*5.3) - 0.5)*wTuft + 0.8*(kindC - 0.5)*wCrown
    + ((land - 0.5)*0.8*wLand + patchy*1.1)*0.75 + 0.3*rift, 0.0, 1.0);
  // (aoG: the openness of the grain and the stands, without the round; ao: with the WHOLE round's)
  float aoG = mix(0.88, leafAo, wLeaf)*mix(0.847, sprigAo, wSprig)*mix(0.805, tuftAo, wTuft)*mix(1.0, 0.8 + 0.2*landEdge, 0.6*wLand);
  float ao = aoG*mix(1.0, domeAo, crownK);
  // GIANTS (a few stand over the rest: three in ten of the 130 m cells hold one, its dome 70 to 110 m across):
  // lit on its sun side and shaded on the other, a dark cleft round its foot, its shade thrown 45 to 85 m on the
  // roof behind it (the sun's bearing); the common crowns' clefts are only creases between its great boughs.
  // It goes to its mean by the footprint as the crowns do (whole at 6 pixels across, gone under 2.4).
  float idG; vec4 cg = cnCell(p0/130.0 + 31.0, idG);
  float wG0 = 1.0 - smoothstep(0.16, 0.42, fw/90.0), wG = wG0*crownK, gR = 0.27 + 0.15*fract(idG*3.7);
  float gIs = step(fract(idG*7.31), 0.3), gIn = gIs*(1.0 - smoothstep(gR - 0.05, gR, cg.x));
  float gRing = gIs*smoothstep(gR - 0.05, gR, cg.x)*(1.0 - smoothstep(gR + 0.01, gR + 0.09, cg.x));
  float gShade = 0.0;
  if (wG > 0.01) for (int i = 0; i < 2; i++) {
    float i2; vec4 c2 = cnCell((p0 + sx*(i == 0 ? 45.0 : 85.0))/130.0 + 31.0, i2); float r2 = 0.27 + 0.15*fract(i2*3.7);
    gShade = max(gShade, step(fract(i2*7.31), 0.3)*(1.0 - smoothstep(r2 - 0.04, r2 + 0.03, c2.x)));
  }
  vec2 og = -cg.zw/max(cg.x, 1e-3);
  ao = mix(ao, max(ao, 0.62*mix(0.847, sprigAo, wSprig)*mix(0.805, tuftAo, wTuft)), gIn*wG);
  float giant = 1.0 + crownK*mix(CN_GIANT, gIn*(0.1 + 0.34*dot(og, sx)*smoothstep(0.1, 0.7, cg.x/gR)) - 0.6*gRing - 0.42*gShade*(1.0 - gIn), wG0);
  float aoL = cnLandAo(LD);                         // the land's own shades
  ao *= aoL*(1.0 - 0.62*shade);
  // THE SUN'S SIDE OF EVERY CROWN IS LIT AND ITS FAR SIDE IS IN SHADE (the sun stands low on the visit's bearing):
  // by where on the dome the point lies, and a little the same for each tuft; it goes to its mean with the crown
  vec2 od = -cc.zw/max(cc.x, 1e-3), ot = -ct.zw/max(ct.x, 1e-3);
  float flank = smoothstep(0.1, 0.6, f1s)*(1.0 - side*side);
  float toward = clamp(dot(-v, uSunDir), 0.0, 1.0), wax = (0.9*wLeaf + 0.15)*(1.0 - 0.6*cloud);
  // each leaf throws the sun back its own way: a glitter, never a broad shine
  // THE WHOLE ROUND: the leaf's light on the dome's own face, its sun side and its far side, its lit-through edge
  // (sg: the spread of the grain that has gone to its mean; ax: the sun's bearing on the roof: cnLeafG, above)
  float sg = sqrt(3.0*((1.0 - wLeaf)*CN_SL*CN_SL + (1.0 - wSprig)*CN_SS*CN_SS + (1.0 - wTuft)*CN_ST*CN_ST));
  vec3 ax = tx*sx.x + tz*sx.y;
  vec3 col = cnLeafG(nG - tx*domeW.x - tz*domeW.y, ax, sg, v, tone, ao, wax)*(1.0 + crownK*flank*(0.5*dot(od, sx) - 0.1));
  col += uLeafT*uSunCol*(clamp(dot(-cc.zw, sx)*1.6, 0.0, 1.0)*side*(1.0 - side)*4.0*crownK)*toward*toward*0.2*(1.0 - 0.7*cloud);
  // AND ITS MEAN, where a crown is no longer drawn singly (cnMean, above)
  float aoM = aoG*aoL;
  float edgeM = 0.0;
  if (crownK*(1.0 - wRound) > 0.004) { col = mix(cnMean(nG, n0, tx, tz, v, tone, aoM, wax, sg), col, mix(1.0, wRound, crownK)); edgeM = cnEdgeM*crownK*(1.0 - wRound); }
  col *= (1.0 + 0.4*young*wLeaf + 0.2*gust*wTuft)*(1.0 + 0.22*bright)*(1.0 + 0.2*wTuft*smoothstep(0.1, 0.5, ct.x)*dot(ot, sx))*giant;
  col *= mix(CN_GL, 1.0, wLeaf)*mix(CN_GT, 1.0, wTuft);
  // (a crown's KIND goes to its mean with the crown: CN_KIND, the mean of the kinds' colours over the pattern)
  col *= mix(vec3(1.0), mix(CN_KIND, vec3(1.0), wCrown), crownK);
  // a crown now and then in new leaf (pale, yellow), bronzed to copper, in flower (pale gold or white, in dabs on
  // its tufts), dead (grey), or an older darker green: each tells from far off
  float lum = dot(col, vec3(0.3, 0.5, 0.2));
  col = mix(col, col*vec3(1.25, 1.12, 0.62), (step(0.88, kindC)*0.7*wCrown + young*wLeaf*0.6)*(1.0 - side));
  col = mix(col, lum*vec3(2.1, 1.02, 0.42), step(kindC, 0.07)*crownK*0.75*wCrown);
  col = mix(col, lum*(kq < 0.05 ? vec3(2.0, 1.9, 1.5) : vec3(2.1, 1.6, 0.62)), kFlower*wCrown*(1.0 - 0.7*side)*mix(0.6, step(0.4, fract(idT*9.7)), wTuft));
  col = mix(col, lum*vec3(0.62, 0.59, 0.54), kDead*0.85*wCrown);
  col = mix(col, col*vec3(1.3, 1.1, 0.5), mid_*step(0.4, kq)*step(kq, 0.455)*0.8*wCrown*(1.0 - side));       // a yellowing crown
  col = mix(col, col*vec3(0.6, 0.68, 0.55), kOld*0.8*wCrown);
  // the hard light of the swollen sun: the far side of every crown and tuft is lit through, its top glares
  // (the tufts' lit-through edges, and where they are at their mean its mean, 0.1; the crowns' edges' mean, cnMean's)
  col += uLeafT*uSunCol*(mix(0.1, clamp(dot(-ct.zw, sx)*2.0, 0.0, 1.0)*0.5, wTuft) + edgeM)*toward*toward*0.2*(1.0 - 0.7*cloud);
  // (mend T, R1: THE FAR SHEEN IS TAKEN OUT. "Far off the glitter of a million leaves runs together into a sheen":
  // it came on as the sprigs went to their mean and so was a light by the footprint, a fifth of the wood's
  // light straight toward the sun that the near wood and the built crowns never had.)
  // (a rift is a long dark valley of leaf: nothing in this forest shines as open water)
  cnFloor = uLeafD*(CN_DEEP*(0.8 + 0.3*clamp(normalize(nG - tx*dome.x - tz*dome.y).y, 0.0, 1.0))*mix(0.93, 1.07, tone)*mix(0.9, 1.08, aoG));
  return col;
}
`,se=`
uniform vec3 uCentre;
varying vec3 vW;
${k}
void main(){
  vec2 xz = position.xz + uCentre.xz;
  // THE SHEET'S OWN MESH (a rule of cost of this one mesh; no thing stands on it): its cells are 0.055 of their
  // distance from its middle across (its middle goes with the eye: the one reading of the eye's map place
  // here). (Mend T) IT CARRIES NO CROWN: it lies at the crowns' mean, 2.7 m under the swell, and the crowns
  // are relief drawn by the ray on it (SHEET_FRAG). It carries the swells while its cells are under 60 m
  // (1,100 m from its middle) and lies at the roof's level where they are past 130 m (2,400 m). Only the
  // mesh's drawn height: what stands on the roof stands on cmRoof and does not move.
  float r = length(position.xz), cell = 0.055*r;
  float amp = 1.0 - smoothstep(60.0, 130.0, cell);
  float y = mix(${Y.toFixed(1)}, cmHump(xz, uTime) - 2.7, amp) - cmDrop(xz);
  vW = vec3(xz.x, y, xz.y);
  gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0);
}`,re=`
varying vec3 vW;
${k}
${Q}
void main(){
  vec3 v = normalize(cameraPosition - vW);
  vec2 p = vW.xz;
  // THE PIXEL'S TWO REACHES ON THE MAP: the larger (fw) and the smaller (fs: the footprint's area over fw)
  vec2 pdx = dFdx(p), pdy = dFdy(p);
  float fw = max(max(length(pdx), length(pdy)), 1e-4), fs = max(abs(pdx.x*pdy.y - pdx.y*pdy.x)/fw, 1e-4);
  float e = 3.0;
  float h0 = cmHump(p, uTime), hx = cmHump(p + vec2(e, 0.0), uTime), hz = cmHump(p + vec2(0.0, e), uTime);
  vec3 n0 = normalize(vec3(-(hx - h0)/e, 1.0, -(hz - h0)/e));
  // (mend T, T1 a and b) THE CROWNS ARE RELIEF, DRAWN BY THE RAY. The sheet's mesh carries the swells and lies
  // at the crowns' mean, 2.7 m under the swell; the crowns stand on it as the common part's cmCrownH has them
  // (tops to 6 m over the swell, the gaps 7 m under it: the heights everything stands on; drawn with each
  // crown's edge rounded into the gap, canopy()'s cnH). The ray is walked
  // down from 7 m over the swell to the gaps' floor and the first crown THE WALK FINDS is the crown drawn, at
  // the place on it where the ray meets it: so a ray that lies flat along the roof meets the near sides and
  // the tops of crowns standing one behind another and (as far as the walk reaches) not the gaps between
  // them, and a ray from above sees rounds with their gaps. THE WALK'S REACH, AS IT IS (mend U): one step to
  // each 7 m of map and 20 at the most, so under rays flatter than about 5.7 degrees a step is longer than
  // 7 m of map and a nearer crown's edge can be stepped over (the code reader's count: 13 rays in 100 under
  // 5.7 degrees, 22 to 23 under 4, 37 under 2): there the crown drawn is not always the first on the ray.
  // AND NOT ONLY UNDER FLAT RAYS (mend V, the same reader's count): under steeper rays too a crown is stepped
  // over now and then, 1.7 to 1.9 rays in 100 at 15 degrees (a step of 7 m of map can still pass a crown's
  // edge that stands into the ray by less than the step).
  // Said, not mended: named for the first polish round.
  // No pattern is laid flat and left to foreshorten into streaks (the cause of the
  // streaks: SHEET_FRAG's note below). A crown that stands higher than 7 m (one in 25) is drawn from where
  // the ray comes under 7 m.
  // THE PIXEL'S REACH ON THAT RELIEF (fr): never more than its larger reach on the map, and never more than
  // its smaller reach over 0.12: a crown's cap stands some 4 m over the crown before it, 0.12 of its 34 m,
  // and that cap is what a flat ray sees of it. A crown's round is whole while fr is under 0.4 of 34 m and at
  // its mean past 0.8 of it (canopy()'s wCrown; the same two numbers flatten the relief here, so the crowns
  // sink to the level as they go to their mean and nothing is cut off).
  float fr = 1.0/(1.0/fw + 0.12/fs), wRel = 1.0 - smoothstep(0.4, 0.8, fr/34.0);
  vec2 q = p;
  if (wRel > 0.01) {
    // sg: the ray's height over the swell, in the relief's own metres (9.7 = 7 m over the swell, counted
    // from the mesh 2.7 m under it; -4.3 = the gaps' floor); dq: the way on the map for a metre of it
    vec2 dq = v.xz*(wRel*n0.y/max(dot(v, n0), 0.015));
    float nSt = clamp(ceil(14.0*length(dq)/7.0), 3.0, 20.0), ds = 14.0/nSt, sHit = 9.7, sPrev = 9.7;
    // fA, fB: the ray's height over the relief at the last place found above it and the first found under it;
    // the meeting is where the straight line between the two crosses nought, so the place drawn goes
    // smoothly from pixel to pixel (halving alone left steps of a third of a metre: lines of equal height
    // on every near crown)
    float fA = 9.7 - cnH(p + dq*9.7) - 2.7, fB = -1.0;
    if (fA > 0.0) {
      sHit = -4.3;
      for (int i = 1; i <= 20; i++) {
        float sg = 9.7 - ds*float(i), f = sg - cnH(p + dq*sg) - 2.7;
        if (float(i) >= nSt || f <= 0.0) { sHit = max(sg, -4.3); sPrev = sHit + ds; fB = min(f, 0.0); break; }
        fA = f;
      }
      for (int i = 0; i < 4; i++) {
        float sm = 0.5*(sHit + sPrev), f = sm - cnH(p + dq*sm) - 2.7;
        if (f <= 0.0) { sHit = sm; fB = f; } else { sPrev = sm; fA = f; }
      }
      sHit = mix(sHit, sPrev, clamp(-fB/max(fA - fB, 1e-4), 0.0, 1.0));
    }
    q = p + dq*sHit;
  }
  cnCrown = fr;
  // (the grain on a crown goes by the pixel's width there over how squarely the ray meets the crown's own
  // surface: canopy()'s fd; fs is that width)
  cnFine = fs;
  // HOW MUCH OF THE GAPS BETWEEN CROWNS THE RAY CANNOT SEE (cnHid: read only by cnMean, where the rounds are at
  // their mean, for the openness of a crown's sides): a ray under 7 degrees to the roof sees none of the gaps
  // between the crowns before it, one steeper than 30 degrees sees them all (v.y: the sine of the ray's
  // angle to the level roof). Where the rounds are drawn the relief itself hides the gaps from a flat ray.
  cnHid = 1.0 - smoothstep(0.12, 0.5, v.y);
  vec3 col = canopy(q, n0, vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), v, fw, 1.0, 0.5);
  col *= 1.0 - 0.4*cmHillShade(p);                            // the hills' own shade lies on the roof
  // (round Q, R4 b) SEEN FROM A HEIGHT THE ROOF READS BY ITS FORM. The land's swells and the roof's own humps
  // (the heights this sheet is built to: n0 is their slope) are LIT ON THE SUN'S SIDE AND SHADED ON THE OTHER as
  // a slope under a sun 15 degrees up is: the light on a slope s toward the sun is (sin 15 - s cos 15)/sin 15 =
  // 1 - 3.7 s of the light on the level; here 3.0 of it, held within 0.28 either way. It is a function of the
  // place alone and its mean is the level's: where crowns have gone to their mean the land still has its relief.
  // (mend S, part 2 c: NO STRETCHED STRIPES. The swells are 75 to 315 m from crest to crest, the ranks about 500 m,
  // the long valleys 600 m across: seen at a grazing angle a pixel reaches farther than that along the ray
  // and they ran into dark parallel bands. Each goes to its mean by the pixel's larger reach, as every
  // pattern of the roof does: the swells' light whole while the reach is under a quarter of 150 m and at its
  // mean, the level's, past 0.8 of it; the ranks the same by 520 m; the valleys by 600 m: to 1, see below.)
  float wSwell = 1.0 - smoothstep(0.25, 0.8, fw/150.0), wRank = 1.0 - smoothstep(0.25, 0.8, fw/520.0), wVale = 1.0 - smoothstep(0.25, 0.8, fw/600.0);
  col *= 1.0 + wSwell*clamp(3.0*dot(n0.xz, normalize(uSunDir.xz + 1e-5)), -0.28, 0.28);
  // (a built crown stands on the painted crown it is a nearer look at, as tall as it, and covers it; the shade a
  // crown throws is the pattern's own, by the sun's bearing: nothing here is shaded by the road's line)
  // the land's large relief, its ranks, its long valleys and the steam banks' shade (LAND_GLSL's cnLandLight:
  // the same sum the built crowns take)
  col *= cnLandLight(p, wRank, wVale);
  col = cnDeep(col);                                          // (no black holes: canopy()'s cnFloor)
  // (round Q, R1: NO MIST LIES IN THE HOLLOWS. A hollow is darker leaf, as above; the air's own haze along the
  // ray, below, and the banks at the world's edge are all the air there is.)
  // the roof's own haze along the ray (seen from high over it the ray crosses the layer steeply, and the land
  // keeps its green and its relief: see cmHaze)
  col = cmHaze(col, vW, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;function Se(l,i,o={}){const d=o.radius??5600,c=Math.pow(d/4,1/149),x=new Float32Array(19201*3),w=[];for(let t=0;t<150;t++){const r=4*Math.pow(c,t);for(let f=0;f<128;f++){const a=(f+t%2*.5)/128*Math.PI*2,m=(1+t*128+f)*3;x[m]=Math.cos(a)*r,x[m+2]=Math.sin(a)*r}}for(let t=0;t<128;t++)w.push(0,1+(t+1)%128,1+t);for(let t=0;t<149;t++)for(let r=0;r<128;r++){const f=1+t*128+r,a=1+t*128+(r+1)%128,m=f+128,S=a+128;w.push(f,a,m,a,S,m)}const s=new g.BufferGeometry;s.setAttribute("position",new g.BufferAttribute(x,3)),s.setIndex(w);const y={uCentre:{value:new g.Vector3}},v=new g.ShaderMaterial({uniforms:D(i.U,y),vertexShader:se,fragmentShader:re,side:g.DoubleSide,fog:!1}),h=new g.Mesh(s,v);h.frustumCulled=!1,h.name="canopy-sheet";const n=new g.Vector3;return{object:h,triangles:w.length/3,update(t){t.getWorldPosition(n),y.uCentre.value.set(n.x,0,n.z)}}}const ie=`
attribute vec4 aI0, aI1, aI2; attribute vec2 aI3;
varying vec3 vW, vN; varying vec2 vUv; varying vec4 vK;
${k}
void main(){
  float u = position.x, s = position.z;                 // u 0..1 from the stalk to the tip, s -1..1 across
  float kind = aI1.y, L = aI1.x;
  // half width along the blade, by shape
  float wFig = 0.42*pow(max(sin(3.14159*pow(u, 0.8)), 0.0), 0.7)*(1.0 - 0.45*u) + 0.02;
  float wPad = 0.5*sqrt(max(1.0 - (2.0*u - 1.0)*(2.0*u - 1.0), 0.0)) + 0.02;
  float wStr = 0.13*pow(max(sin(3.14159*pow(u, 0.6)), 0.0), 0.5) + 0.01;
  float w = kind < 0.5 ? wFig : (kind < 1.5 ? wPad : wStr);
  float gust = cmGust(aI0.xz, uTime);
  // the blade in its own frame: x along, z across, y up; cupped across, drooping to the tip, lifting in a gust
  float cup = (kind < 1.5 ? 0.22 : 0.5)*s*s*w*L;
  float droop = -0.10*L*u*u*(kind > 1.5 ? 1.6 : 1.0) + gust*0.05*L*u*sin(uTime*(3.0 + 3.0*aI2.y) + aI2.y*31.0);
  vec3 q = vec3((u - 0.12)*L, cup + droop, s*w*L);
  vec3 n = normalize(vec3(0.2*u*(kind > 1.5 ? 1.6 : 1.0), 1.0, -(kind < 1.5 ? 0.44 : 1.0)*s));
  float roll = aI1.w + gust*0.3*sin(uTime*(4.0 + 3.0*aI2.y) + aI2.y*17.0), pitch = aI1.z, yaw = aI0.w;
  float cr = cos(roll), sr = sin(roll), cpi = cos(pitch), spi = sin(pitch), cy = cos(yaw), sy = sin(yaw);
  q = vec3(q.x, q.y*cr - q.z*sr, q.y*sr + q.z*cr); n = vec3(n.x, n.y*cr - n.z*sr, n.y*sr + n.z*cr);          // roll about the midrib
  q = vec3(q.x*cpi - q.y*spi, q.x*spi + q.y*cpi, q.z); n = vec3(n.x*cpi - n.y*spi, n.x*spi + n.y*cpi, n.z);   // pitch: tip up
  q = vec3(q.x*cy + q.z*sy, q.y, -q.x*sy + q.z*cy); n = vec3(n.x*cy + n.z*sy, n.y, -n.x*sy + n.z*cy);        // yaw
  // it stands on the crown its twig grows from: aI3 is that crown's place, and the crown rides the swell of the
  // roof there (or, on the hill, stands at the fixed height aI2.w)
  vec3 base = vec3(aI0.x, (aI2.w > 0.5 ? aI2.w : cmHump(aI3, uTime)) + aI0.y - cmDrop(aI3), aI0.z);
  vW = base + q; vN = n; vUv = vec2(u, s); vK = vec4(kind, aI2.x, aI2.y, aI2.z);
  gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0);
}`,he=`
varying vec3 vW, vN; varying vec2 vUv; varying vec4 vK;
${k}
void main(){
  float u = clamp(vUv.x, 0.0, 1.0), s = clamp(vUv.y, -1.0, 1.0), as = abs(s), kind = vK.x, ph = vK.z;
  // the outline inside the grid: scallops, a notch at the stalk of a pad, a tear here and there
  float fw = fwidth(s) + 1e-4, pxL = cmPx(vW);              // (the footprint, taken before any branch)
  float rim = 1.0;
  if (kind > 0.5 && kind < 1.5) {
    float ang = atan(s*sqrt(max(1.0 - (2.0*u - 1.0)*(2.0*u - 1.0), 0.0)), (2.0*u - 1.0) + 1e-5);
    rim = 0.93 + 0.07*sin(ang*11.0 + ph*20.0);
    if (3.14159 - abs(ang) < 0.10) discard;                 // the notch where the stalk joins
  } else if (kind < 0.5) rim = 0.94 + 0.06*sin(u*38.0 + ph*9.0);
  float tear = smoothstep(0.80, 0.86, cmN(vec2(u*5.0 + ph*13.0, s*1.5 + ph*7.0)))*smoothstep(0.35, 0.6, as)*step(0.55, fract(ph*7.3));
  if (as > rim + fw*0.5 || tear > 0.5) discard;
  vec3 v = normalize(cameraPosition - vW);
  // veins: a midrib, side veins leaving it at an angle
  float rib = 1.0 - smoothstep(0.03, 0.03 + fw*1.5 + 0.02, as);
  float sv = abs(fract(u*(kind > 1.5 ? 14.0 : 7.0) - as*1.4) - 0.5);
  float side = (1.0 - smoothstep(0.03, 0.09, sv))*(1.0 - smoothstep(0.75, 1.0, as));
  float lod = 1.0 - smoothstep(0.12, 0.44, pxL);               // veins and grain go to their mean under the pixel's footprint
  float vein = mix(0.10, max(rib, side*0.6), lod);             // (0.10: the share of a leaf that is vein, weighed as here)
  vec3 n = normalize(vN);
  n = normalize(n + 0.12*lod*vec3(cmN(vUv*vec2(9.0, 3.0) + ph*40.0) - 0.5, 0.0, cmN(vUv*vec2(9.0, 3.0) + 19.0 + ph*40.0) - 0.5));
  float young = step(0.88, fract(ph*3.7));
  float deep = vK.w;
  float ao = (0.55 + 0.45*smoothstep(0.0, 0.3, u))*(1.0 - 0.5*deep)*(0.8 + 0.2*smoothstep(1.0, 0.7, as));
  float thin = (1.0 - 0.55*vein)*(0.8 + 0.2*young);
  vec3 col = cmLeaf(n, v, vK.y, thin, ao, 1.0);
  col *= 1.0 - 0.2*vein + 0.35*young;
  col = mix(col, col*vec3(1.12, 1.06, 0.72), young*0.6);
  // a dry brown edge on old leaves
  col = mix(col, col*vec3(1.1, 0.8, 0.45), smoothstep(0.82, 1.0, as/max(rim, 0.01))*0.5*step(fract(ph*5.1), 0.4));
  col *= 1.0 - 0.4*cmHillShade(vW.xz);                        // the hills' shade, as on the crown it stands on
  col = cmHaze(col, vW, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;function le(){const o=[],e=[];for(let p=0;p<=4;p++)for(let u=0;u<=2;u++)o.push(p/4,0,u/2*2-1);for(let p=0;p<4;p++)for(let u=0;u<2;u++){const d=p*3+u,c=d+2+1;e.push(d,d+1,c,d+1,c+1,c)}return{p:new Float32Array(o),idx:e}}function ce(l,i,o,e,p){const u=le(),d=i.length,c=new g.InstancedBufferGeometry;c.instanceCount=d,c.setAttribute("position",new g.BufferAttribute(u.p,3)),c.setIndex(u.idx);const x=new Float32Array(d*4),w=new Float32Array(d*4),s=new Float32Array(d*4),y=new Float32Array(d*2);i.forEach((h,n)=>{x.set([h.x,h.y,h.z,h.yaw],n*4),w.set([h.len,h.kind,h.pitch,h.roll],n*4),s.set([h.tone,h.phase,h.deep,h.fixed||0],n*4),y.set([h.ax??h.x,h.az??h.z],n*2)}),c.setAttribute("aI3",new g.InstancedBufferAttribute(y,2)),c.setAttribute("aI0",new g.InstancedBufferAttribute(x,4)),c.setAttribute("aI1",new g.InstancedBufferAttribute(w,4)),c.setAttribute("aI2",new g.InstancedBufferAttribute(s,4)),K(c,e[0],e[1],e[2],p);const v=new g.Mesh(c,l);return v.name=o,v}function de(l){return new g.ShaderMaterial({uniforms:D(l.U),vertexShader:ie,fragmentShader:he,side:g.DoubleSide,fog:!1})}const F=Math.fround,q=l=>l-Math.floor(l);function fe(l,i,o){l=q(F(l*.1031)),i=q(F(i*.1031)),o=q(F(o*.1031));const e=l*(o+31.32)+i*(i+31.32)+o*(l+31.32);return l+=e,i+=e,o+=e,q(F((l+i)*o))}function Z(l,i,o){const e=Math.floor(l),p=Math.floor(i),u=Math.floor(o);let d=l-e,c=i-p,x=o-u;d=d*d*(3-2*d),c=c*c*(3-2*c),x=x*x*(3-2*x);const w=(v,h,n)=>fe(e+v,p+h,u+n),s=C(C(w(0,0,0),w(1,0,0),d),C(w(0,1,0),w(1,1,0),d),c),y=C(C(w(0,0,1),w(1,0,1),d),C(w(0,1,1),w(1,1,1),d),c);return C(s,y,x)}const we=(l,i,o,e)=>.44*(Z(l*1.9+e*37,i*1.9+e*37,o*1.9+e*37)-.5)+.2*(Z(l*4.3+e*11,i*4.3+e*11,o*4.3+e*11)-.5);async function be(l,i,o){const e=P(i,o.rng,"twigs",l),p=l.quality?.detail??1,u=de(i),d=new g.Group;d.name="twigs";const c=t=>(t.hill?t.foot:i.hump(t.x,t.z,0))+t.trunk,x=o.crowns||[],w=Math.atan2(i.sunDir.z,i.sunDir.x),s=[];x.forEach((t,r)=>{const f=t.id>.46&&t.id<=.52,a=t.id>.22&&t.id<=.36;for(let m=0;m<(f?0:a?2:1);m++)s.push(r)});const y=6,v=Array.from({length:y},()=>[]);let h=0,n=0;for(let t=0;t<s.length;t++){const r=x[s[t]],f=w+e.range(-1.2,1.2),a=e.range(.25,1),m=Math.sqrt(1-a*a),S=Math.cos(f)*m,b=Math.sin(f)*m,E=e.int(9,13),T=e.range(0,Math.PI*2),L=e()<.5?0:e()<.6?1:2,N=M(.45+e.gauss()*.2,0,1),z=1+we(S,a,b,r.id)+.02,A=r.x+S*r.R*z,R=r.z+b*r.R*z,I=r.trunk+a*r.R*r.sq*z,H=c(r)-r.trunk+I,G=Math.min(y-1,Math.floor(t/s.length*y)),J=o.path.distanceTo(A,H+1,R)>=9,ee=J?v[G]:[];for(let W=0;W<E;W++){const _=T+W/E*Math.PI*2+e.gauss()*.3,U=e.range(.1,1);ee.push({x:A+Math.cos(_)*U,z:R+Math.sin(_)*U,ax:r.x,az:r.z,y:I+e.range(.1,1.3),yaw:-_+e.gauss()*.25,len:L===2?e.range(.7,1):e.range(.5,.85),kind:L,pitch:e.range(.1,.85),roll:e.gauss()*.3,tone:M(N+e.gauss()*.1,0,1),phase:e(),deep:e()*.5,fixed:r.hill?r.foot:0})}h++,h%40===0&&await l.yield()}for(let t=0;t<y;t++){if(!v[t].length)continue;const r=v[t].length,f=ce(u,v[t],"twigs-"+t,[0,0,0],1);f.frustumCulled=!1,d.add(f),n+=r*16,await l.yield()}return{object:d,material:u,triangles:n}}const me=`
attribute vec4 aP; attribute float aS;
uniform vec4 uPeak; uniform vec2 uPeakS;       // x, z, height, radius; power, ribs
varying vec3 vW, vN; varying vec4 vP; varying float vS;
${k}
float ph(float r01, float rib){ return uPeak.z*pow(max(1.0 - r01, 0.0), uPeakS.x)*(1.0 + rib*0.10*r01*(1.0 - r01)*4.0); }
void main(){
  float a = aP.x, r01 = aP.y, r = r01*uPeak.w;
  vec2 dir = vec2(cos(a), sin(a)), xz = uPeak.xy + dir*r;
  float skirt = smoothstep(0.55, 1.0, r01);
  float base = mix(cmRoof(xz, uTime) - 0.6, ${Y.toFixed(1)}, smoothstep(1.0, 0.75, r01));
  float h = ph(r01, aP.z) + base*skirt + aP.w;
  // slope for the normal
  float e = 0.02, h2 = ph(r01 + e, aP.z), dh = (h2 - ph(r01, aP.z))/(e*uPeak.w);
  vN = normalize(vec3(-dir.x*dh, 1.0, -dir.y*dh));
  // the hill is crown on crown too: the same crowns, laid along the slope (aS: metres down it from the top), their
  // sides falling 7 m into the hill; they give way to the roof's own crowns at the hill's foot
  float id; vec4 c = cmCrown(uPeak.xy + dir*aS, id);
  vec3 w = vec3(xz.x, h, xz.y) - vN*2.5*cmSide(c.x)*(1.0 - skirt)*smoothstep(0.0, 0.04, r01);
  w.y -= cmDrop(xz);
  vW = w; vP = aP; vS = aS;
  gl_Position = projectionMatrix*viewMatrix*vec4(vW, 1.0);
}`,pe=`
uniform vec4 uPeak; uniform vec2 uPeakS;
varying vec3 vW, vN; varying vec4 vP; varying float vS;
${k}
${Q}
void main(){
  vec3 v = normalize(cameraPosition - vW);
  // the roof's own pattern, laid along the slope: its distance from the middle is the length down the slope, so
  // crowns, tufts and leaves keep their size however steep the hill is
  float a = vP.x; vec2 dir = vec2(cos(a), sin(a));
  vec2 p = uPeak.xy + dir*vS;
  float fw = max(length(dFdx(p)), length(dFdy(p)));
  vec3 n0 = normalize(vN), ar = vec3(-dir.y, 0.0, dir.x), dn = -normalize(cross(ar, n0));     // round the hill, down the hill
  vec3 col = canopy(p, n0, dn*dir.x - ar*dir.y, dn*dir.y + ar*dir.x, v, fw, 1.0, 0.5);
  col *= 0.6;                                                            // what shows of the hill between its crowns lies in their shade
  col *= 1.0 - 0.4*smoothstep(0.45, 1.0, vP.y);                          // and a hill stands in its own shade at its foot
  // a hill has form: the flank toward the sun is lit, the flank turned from it lies in shade
  vec2 sxz = uSunDir.xz/max(length(uSunDir.xz), 1e-4);
  col *= 0.72 + 0.56*smoothstep(-0.7, 0.7, dot(dir, sxz));
  col = cnDeep(col);                                                     // (no black holes: canopy()'s cnFloor)
  col = cmHaze(col, vW, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`;function Te(l,i,o,e={}){const p=l.noise,u=e.sect??144,d=e.rings??84,c=new B({aP:4,aS:1}),x=n=>Math.pow(n/d,1.25)*1.06,w=[0];for(let n=1,t=0;n<=d;n++){const r=x(n-1),f=x(n);for(let a=0;a<6;a++){const m=r+(f-r)*(a+.5)/6;t+=Math.hypot(o.r,o.h*o.p*Math.pow(Math.max(1-m,0),o.p-1))*(f-r)/6}w.push(t)}for(let n=0;n<=d;n++){const t=x(n);c.set("aS",w[n]);for(let r=0;r<=u;r++){const f=r/u*Math.PI*2,a=Math.cos(f),m=Math.sin(f),S=Math.max(0,p.n2(a*3.1+o.x*.01,m*3.1+o.z*.01)*1.3+.5*Math.cos(f*(o.ribs??9))),b=(p.n2(a*9+7,m*9+t*6)*2.2+p.n2(a*23,m*23+t*15)*1)*j(.02,.2,t)*j(1.05,.7,t)*(o.ragged??1);c.set("aP",f,t,S,b+ae(o,a*t,m*t)),c.v(0,0,0)}}c.stitch(0,d+1,u,!0);const s=K(c.geometry(),o.x,o.h*.4,o.z,o.r*1.2+700),y={uPeak:{value:new g.Vector4(o.x,o.z,o.h,o.r)},uPeakS:{value:new g.Vector2(o.p,o.ribs??9)}},v=new g.ShaderMaterial({uniforms:D(i.U,y),vertexShader:me,fragmentShader:pe,side:g.DoubleSide,fog:!1}),h=new g.Mesh(s,v);return h.name="peak",h.frustumCulled=!1,{object:h,triangles:c.triangles}}const X=`
vec3 trH3(vec3 q){ return vec3(cmH3(q), cmH3(q + 17.1), cmH3(q + 43.7)); }
// billows: the nearest of a scatter of points in space. xyz = from that point to p, w = how much nearer it is than the next
vec4 trBillow(vec3 p){
  vec3 n = floor(p), f = fract(p), r1 = vec3(0.0); float d1 = 8.0, d2 = 8.0;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 g = vec3(float(i), float(j), float(k)), r = g + trH3(n + g) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; r1 = r; } else if (d < d2) d2 = d;
  }
  return vec4(-r1, sqrt(d2) - sqrt(d1));
}
// the lobes of a crown: how far the surface stands out along the unit direction p (about -0.2 .. 0.25 radii)
float trLobe(vec3 p, float id){ return 0.44*(cmN3(p*1.9 + id*37.0) - 0.5) + 0.2*(cmN3(p*4.3 + id*11.0) - 0.5); }
`,ue=`
attribute vec4 aT0, aT1; attribute float aK;
varying vec3 vW, vN, vL; varying vec4 vT; varying vec2 vK;
${k}
${X}
void main(){
  vec3 p = position, n = normal; float R = aT0.z, sq = aT1.y;
  if (aK < 0.5) {
    p *= 1.0 + trLobe(p, aT1.x);
    // it stirs in a gust
    p.xz += 0.03*cmGust(aT0.xy, uTime)*sin(uTime*1.3 + aT1.x*40.0 + p.y*2.0)*max(p.y + 0.4, 0.0);
  }
  float foot = mix(cmHump(aT0.xy, uTime), aT1.z, aT1.w);
  vec3 w = vec3(aT0.x, foot + aT0.w, aT0.y) + vec3(p.x*R, p.y*R*sq, p.z*R);
  w.y -= cmDrop(aT0.xy);
  vW = w; vN = normalize(vec3(n.x, n.y/max(sq, 0.2), n.z)); vL = position; vT = vec4(aT0.xy, R, aT1.x); vK = vec2(aK, sq);
  gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.0);
}`,ve=`
#define CM_FOLLOW 1.0
varying vec3 vW, vN, vL; varying vec4 vT; varying vec2 vK;
${k}
${$}
${X}
void main(){
  vec3 v = normalize(cameraPosition - vW);
  vec3 n0 = normalize(vN), col;
  float R = vT.z, id = vT.w, sq = max(vK.y, 0.2);
  float px = cmPx(vW);                 // metres of the crown a pixel covers here (taken before the branch below)
  // (mend T, T1 c) A BUILT CROWN STANDS IN THE LAND'S OWN LIGHT AND SHADE, as the painted roof under it does
  vec4 LD = cnLandAt(vW.xz, px);
  if (vK.x < 0.5) {
    vec3 lp = vL/max(length(vL), 1e-3);
    // ONE RULE OF SIZE FOR EVERY CROWN, great or small: billows 4.2 m across, sprigs of a metre and a half,
    // leaves of a third of a metre, each measured in metres on the crown's true surface (its squash and its
    // lobes counted: mq is the point in the crown's own metres). So no crown's leaf is larger than its
    // neighbour's and no pattern is pulled long down a steep flank. Each goes to its mean under 3 pixels.
    vec3 mq = vec3(vL.x, vL.y*sq, vL.z)*R*(1.0 + trLobe(vL, id));
    float wB = 1.0 - smoothstep(0.3, 1.0, px/4.2);
    vec4 b = trBillow(mq/4.2 + id*17.0);
    vec3 bn = normalize(b.xyz + 1e-4);
    // sprigs and leaves: soft dabs of light and shade, each tilted its own way, with holes between them that go
    // down into the dark of the crown
    vec3 mp = mq + id*31.0;
    float wS = 1.0 - smoothstep(0.3, 1.0, px/1.5), wL = 1.0 - smoothstep(0.3, 1.0, px/0.36);
    vec3 j1 = vec3(cmN3(mp/1.5), cmN3(mp/1.5 + 7.3), cmN3(mp/1.5 + 13.9)) - 0.5;
    vec3 j0 = vec3(cmN3(mp/0.36), cmN3(mp/0.36 + 5.1), cmN3(mp/0.36 + 11.7)) - 0.5;
    float hole = smoothstep(0.16, 0.3, j0.x + 0.5*j1.x);
    vec3 n = normalize(n0*0.6 + bn*0.8*wB + j1*0.9*wS + j0*0.8*wL);
    float crease = smoothstep(0.0, 0.3, b.w);
    float ao = mix(0.75, mix(0.36, 1.0, crease), wB)*mix(0.9, 0.8 + 0.6*j1.x, wS)*mix(0.92, mix(1.0, 0.55, hole), wL);
    ao *= mix(0.14, 1.0, smoothstep(-0.5, 0.3, lp.y));                      // its underside is in its own shade
    ao *= cnLandAo(LD);
    // a crown is one kind of tree: its green is its own; a few are in new leaf (pale, yellow) or old and bronzed
    // (its kind is its number: under 0.08 bronzed to copper, to 0.22 an older darker green, 0.22 to 0.36 in new
    // leaf, 0.36 to 0.46 in flower (white, or pale gold), 0.46 to 0.52 dead: bare grey limbs, the rest full green)
    float kind = id, copper = step(kind, 0.08), old = step(0.08, kind)*step(kind, 0.22), young = step(0.22, kind)*step(kind, 0.36), flower = step(0.36, kind)*step(kind, 0.46), dead = step(0.46, kind)*step(kind, 0.52);
    float tone = clamp(0.3 + 0.35*fract(id*7.3) - 0.22*old + 0.3*young + 0.5*j1.y*wS + 0.6*j0.z*wL + 0.825*LD.z + 0.3*LD.w, 0.0, 1.0);
    col = cmLeaf(n, v, tone, 0.85, ao, (0.15 + 0.25*wL)*(1.0 - 0.6*LD.x));
    col = mix(col, col*vec3(0.6, 0.68, 0.55), old*0.8);
    col = mix(col, col*vec3(1.25, 1.12, 0.62), young*0.7);
    col = mix(col, dot(col, vec3(0.3, 0.5, 0.2))*vec3(2.1, 1.02, 0.42), copper*0.75);
    // (and of the full green ones the painted roof's yellowing crowns, one in 18: 0.570 to 0.610 here)
    col = mix(col, col*vec3(1.3, 1.1, 0.5), step(0.5701, kind)*step(kind, 0.6096)*0.8);
    vec3 lit = uSunCol*clamp(dot(n, uSunDir)*0.6 + 0.4, 0.0, 1.0)*0.3 + cmAmb(n)*0.75;
    // in flower: every other billow is a mass of bloom, white or pale gold, over the whole upper crown
    float bloom = smoothstep(-0.1, 0.06, j1.x + 0.3*j0.y*wL)*smoothstep(-0.3, 0.3, lp.y);
    col = mix(col, (kind < 0.41 ? vec3(0.92, 0.9, 0.76) : vec3(0.96, 0.74, 0.3))*lit*(0.55 + 0.45*ao), flower*bloom*0.9);
    // dead: the leaves are gone; bare grey limbs run out from its middle and fork (five great boughs, eleven
    // lesser ones from half way out, twenty-three twigs at its edge) over the dark of the empty crown
    float azL = atan(lp.z, lp.x)/6.2831853, rr = acos(clamp(lp.y, -1.0, 1.0)), girth = 6.2831853*max(sin(rr), 0.05)*R;
    float wob = 0.5*(cmN3(mp/7.0 + 3.0) - 0.5);
    float d1 = abs(fract(azL*5.0 + wob) - 0.5)*girth/5.0, d2 = abs(fract(azL*11.0 + 2.0*wob + 0.3) - 0.5)*girth/11.0, d3 = abs(fract(azL*23.0 + 3.0*wob + 0.7) - 0.5)*girth/23.0;
    float limbs = max((1.0 - smoothstep(0.45, 0.5 + px, d1))*(1.0 - smoothstep(0.9, 1.2, rr)), max((1.0 - smoothstep(0.2, 0.24 + px, d2))*smoothstep(0.3, 0.5, rr), (1.0 - smoothstep(0.1, 0.13 + px, d3))*smoothstep(0.75, 0.95, rr)));
    limbs = mix(limbs, 0.3, smoothstep(0.3, 1.2, px));
    vec3 bare = mix(vec3(0.17, 0.16, 0.13)*(1.0 + 0.9*j1.x)*mix(1.0, 0.45, hole), vec3(0.4, 0.38, 0.34), limbs*0.85)*lit*(0.7 + 0.3*ao);
    col = mix(col, bare, dead*0.92);
    // the low sun behind it comes through its edge
    float toward = clamp(dot(-v, uSunDir), 0.0, 1.0), ndv = abs(dot(n0, v));
    col += uLeafT*uSunCol*pow(clamp(1.0 - ndv, 0.0, 1.0), 2.0)*toward*toward*0.16*ao;
    // ragged against the sky: at its edge the leaves stand apart
    float cut = 0.5 + 1.6*j1.z + 1.2*j0.y*wL;
    if (ndv < 0.3*wS && cut > ndv/0.3 + 0.2) discard;
  } else {
    // wood: bark that runs up it, moss on the weather side
    float g = 0.55 + 0.6*cmN(vec2(atan(vL.z, vL.x + 1e-5)*7.0 + id*20.0, vW.y*0.35));
    vec3 alb = mix(vec3(0.22, 0.19, 0.13), vec3(0.12, 0.2, 0.06), smoothstep(0.45, 0.75, cmN(vW.xz*0.4 + vW.y*0.3)));
    col = alb*g*(uSunCol*max(dot(n0, uSunDir), 0.0)*0.45 + cmAmb(n0)*0.7);
  }
  col *= 1.0 - 0.4*cmHillShade(vW.xz);                                  // the hills' shade lies on a built crown as on the painted roof
  col *= (1.0 + 0.22*LD.y)*cnLandLight(vW.xz, 1.0, 1.0);
  col = cmHaze(col, vW, 1.0);
  gl_FragColor = vec4(col, 1.0);
}`,O=115;function Ee(l,i,o){let e=1/0,p=-1/0,u=1/0,d=-1/0;for(const s of i)e=Math.min(e,s[0]),p=Math.max(p,s[0]),u=Math.min(u,s[1]),d=Math.max(d,s[1]);const c=(s,y,v,h)=>{const n=h[0]-v[0],t=h[1]-v[1],r=M(((s-v[0])*n+(y-v[1])*t)/Math.max(n*n+t*t,1e-6),0,1);return Math.hypot(s-v[0]-n*r,y-v[1]-t*r)},x=s=>s-Math.floor(s),w=[];for(const s of te(e-O,p+O,u-O,d+O)){let y=1/0;for(let N=0;N+1<i.length;N++)y=Math.min(y,c(s.x,s.z,i[N],i[N+1]));if(y>O||V(o,s.x,s.z)>.5)continue;const v=x(s.id*3.3),h=x(s.id*91.73),n=x(s.id*29.9),t=h<.04,r=oe(s.id),f=M(.525*(s.r+s.room),7,22)*(t?1.2:1),a=M(f*(r+7)/251,.34,1),m=r+.6+.12*f*a,S=v>=.88?.22+.14*n:v<=.07?.08*n:n<.1?.36+n:n<.16?.46+(n-.1):n<.33?.08+.14*(n-.16)/.17:.52+.48*(n-.33)/.67,b=ne(s.id,s.qx,s.qz),E=f*Math.min(b,1),T=M(E*(r+7)/(251*b*b),.34,1),L=r+.6+.12*E*T;w.push({x:s.x,z:s.z,R:E,sq:T,top:L,trunk:L-E*T,y:l(s.x,s.z,0)+L-E*T,id:S,emergent:t,nx:s.nx,nz:s.nz})}return w}const Ne=(l,i)=>{const o=l.x-i.x,e=l.z-i.z,p=(l.y-i.y)/i.sq;return i.sq*(Math.sqrt(o*o+p*p+e*e)-i.R*1.28)};function ge(l,i,o,e,p,u,d=175){const c=[],x=Math.PI*2;let w=0,s=1/0;for(let y=0,v=0;y<d&&v<7e3;v++){const h=e()*x,n=e()<.3?e.range(.03,.3):Math.sqrt(e.range(.02,.95)),t=e.range(8,15)*C(.6,1,n),r=i.x+Math.cos(h)*n*i.r,f=i.z+Math.sin(h)*n*i.r,a=V(i,r,f)+l(r,f,0)*j(.55,1,n),m=t*e.range(-.3,.05),S=e.range(.65,.9),b=p();if(c.some(T=>Math.hypot(T.x-r,T.z-f)<(T.R+t)*.55))continue;const E=o.distanceTo(r,a+m,f)-t*1.28;if(E<u){w++;continue}s=Math.min(s,E),c.push({x:r,z:f,R:t,trunk:m,sq:S,foot:a,hill:1,id:b}),y++}return{list:c,lost:w,least:s}}async function Le(l,i,o){const e=new B({aK:1}),p=o.peak,u=Math.PI*2;{const S=e.count;e.set("aK",0);for(let b=0;b<=8;b++){const E=b/8*2.15,T=Math.sin(E),L=Math.cos(E),N=b===8?.4:1;for(let z=0;z<=16;z++){const A=(z+b%2*.5)/16*u;e.v(Math.cos(A)*T*N,L*N,Math.sin(A)*T*N,Math.cos(A)*T,L,Math.sin(A)*T)}}e.stitch(S,9,16,!0)}const d=(a,m,S,b,E,T,L,N,z)=>{const A=e.count;e.set("aK",1);for(let R=0;R<=1;R++)for(let I=0;I<=z;I++){const H=I/z*u,G=R?N:L;e.v((R?b:a)+Math.cos(H)*G,R?E:m,(R?T:S)+Math.sin(H)*G,Math.cos(H),0,Math.sin(H))}e.stitch(A,2,z,!0)};d(0,-.2,0,.05,-2.4,.03,.12,.19,7);for(let a=0;a<5;a++){const m=a/5*u+.4,S=.5+.09*(a%3);d(Math.cos(m)*S,-.35,Math.sin(m)*S,Math.cos(m)*(S+.07),-2.4,Math.sin(m)*(S+.07),.014,.02,4)}const c=e.geometry(),x=e.triangles,w=[],s=new g.Vector3,y=new g.Vector3;for(const a of o.roof||[])w.push({x:a.x,z:a.z,R:a.R,trunk:a.trunk,sq:a.sq,foot:0,hill:0,id:a.id});await l.yield();const v=ge(i.hump,p,o.path,P(i,o.hillRng,"crowns-hill",l),P(i,o.kindRng,"crown-kinds",l),o.keep??22,o.hill??175);for(const a of v.list)w.push(a);await l.yield();const h=w.length,n=new g.InstancedBufferGeometry;n.instanceCount=h;for(const a of["position","normal","aK"])n.setAttribute(a,c.getAttribute(a));n.setIndex(c.getIndex());const t=new Float32Array(h*4),r=new Float32Array(h*4);w.forEach((a,m)=>{t.set([a.x,a.z,a.R,a.trunk],m*4),r.set([a.id,a.sq,a.foot,a.hill],m*4)}),n.setAttribute("aT0",new g.InstancedBufferAttribute(t,4)),n.setAttribute("aT1",new g.InstancedBufferAttribute(r,4)),K(n,p.x,40,p.z+150,1e3);const f=new g.Mesh(n,new g.ShaderMaterial({uniforms:D(i.U),vertexShader:ue,fragmentShader:ve,fog:!1}));return f.name="crowns",f.frustumCulled=!1,{object:f,triangles:x*h,list:w,lost:v.lost,least:v.least}}export{O as LOD_M,Ne as crownGap,we as crownLobe,ge as hillCrowns,Se as makeCanopy,Le as makeCrownTrees,de as makeLeafMaterial,ce as makeLeafMesh,be as makeLeaves,Te as makePeakMesh,Ee as roofCrowns};
