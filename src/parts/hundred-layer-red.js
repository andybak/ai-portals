import*as y from"three";import"three/addons/utils/BufferGeometryUtils.js";const ke=47,ae=63*Math.PI/180,he=8,ge=40.5,Be=[.34,.4,.46,.52,.58,.64,.7,.76,.82],I=[[64,9.5,26,5,26,16],[56.5,12.5,25,13,26,14],[49,16.5,24,20,25,13],[41.5,20.5,23,28,24,12],[34,24.5,21,36,22,11],[27,28.5,20,44,24,9],[20.5,32.5,15,53,20,8],[15.4,36,11.5,60,17,7],[11.4,39,8.2,66,14,6]],et=`
// the glow of a lit lip peaks here: the brief's lightest orange, #F07F45, written as the linear colour that this world's
// lift (uLift) and last pass (exposure 0.92, the tone curve, saturation and contrast 1.05) bring to exactly that value in
// the middle of the frame; a lip in full glow is this colour and nothing of the lacquer is lighter
#define GLOW_PEAK vec3(.919, .128, .034)
uniform vec3 cRed, cRed2, cGreen, cBuff, cBlack, cCap;
uniform float uMarble, uCap;
// level: 1 where the surface lies nearly level, where a coat would spread into a broad band, so there it is left out
vec3 stackColorS(float d, float fw, float level) {
  vec3 red = mix(cRed, cRed2, clamp(d / 40., 0., 1.));
  // coat lines: every coat, and every tenth more strongly, each fading to its mean tone before it can crawl
  float t1 = abs(fract(d / .4) - .5) * 2., t10 = abs(fract(d / 4.) - .5) * 2.;
  float f1 = 1. - smoothstep(.06, .15, fw), f10 = 1. - smoothstep(.8, 1.8, fw);
  // a coat line is a crisp hair: 7 cm of the coat or a little over a pixel, whichever is wider
  float hw = max(.035, 1.2 * fw);
  float l1 = 1. - smoothstep(hw * .5, hw * 1.5, (1. - t1) * .2), l10 = smoothstep(.72, .97, t10);
  // variations of the stack: marbled (one thin black coat laid into every two metres of red), or a black cap over the
  // red. A black coat is a fine level line that follows the carved form, with the red on either side of it left bright
  // where the knife turned; far off the lines melt into their mean tone and never stand as bands.
  // A black coat is never a void: its coat lines are drawn in vermilion, so it reads as a dark line ruled in red
  float mf = abs(fract(d / 2.) - .5) * 2., mfar = smoothstep(.4, 1.4, fw);
  float mk = mix(clamp((.11 - mf) / fw + .5, 0., 1.), .14, mfar);
  float me = uMarble * (1. - mfar) * clamp(1. - abs(mf - .2) / max(.06, fw), 0., 1.);
  me *= 1. - level;
  float dark = max(uMarble * mk * (1. - level), clamp((uCap - d) / fw + .5, 0., 1.));
  red = mix(red, mix(cCap, red, mix(.8, .62, step(0., uCap)) * mix(mix(.22, .1, step(0., uCap)), l1, f1) + .2 * mix(mix(.16, .08, step(0., uCap)), l10, f10)), dark);
  vec3 c = mix(cBuff, cGreen, clamp((56.2 - d) / fw + .5, 0., 1.));
  float inRed = clamp((40.25 - d) / fw + .5, 0., 1.);
  c = mix(c, red, inRed);
  c *= 1. - (.42 * mix(.22, l1, f1) + .3 * mix(.16, l10, f10)) * (1. - dark * inRed);
  c *= 1. + .5 * me * inRed;
  // black guide hairlines: keep their width and lose their ink with distance
  hw = max(.25, .6 * fw); float ink = min(1., .25 / hw);
  float g = max(1. - smoothstep(hw - fw * .5, hw + fw * .5, abs(d - 40.25)),
                1. - smoothstep(hw - fw * .5, hw + fw * .5, abs(d - 56.2)));
  return mix(c, cBlack, g * ink);
}
vec3 stackColor(float d, float fw) { return stackColorS(d, fw, 0.); }
// the tone the shade of a layer lands on: a share of the layer's own plain colour (uToe: for red, green and buff; of the
// red only its red, so its shade keeps its hue); zero: none
uniform vec3 uToe;
vec3 stackToe(float d, float fw) {
  float inRed = clamp((40.25 - d) / fw + .5, 0., 1.), inGreen = clamp((56.2 - d) / fw + .5, 0., 1.);
  float red = mix(mix(cRed.r, cRed2.r, clamp(d / 40., 0., 1.)), cCap.r * 2., .5 * clamp((uCap - d) / fw + .5, 0., 1.));
  vec3 k = mix(mix(vec3(0., 0., 1.), vec3(0., 1., 0.), inGreen), vec3(1., 0., 0.), inRed);
  return vec3(red * uToe.x * k.x, 0., 0.) + cGreen * (uToe.y * k.y) + cBuff * (uToe.z * k.z);
}
// shade is never black: under the whole tone scale lies a toe in the layer's own colour, so the deepest shade lands on it
// and everything above keeps its order (the toe fades out as the tone rises; exp of a negative number, nothing to clamp)
vec3 shadeToe(vec3 col, vec3 toe) {
  float lt = max(dot(toe, vec3(.3, .6, .1)), 1e-5);
  return col + toe * exp(-max(dot(col, vec3(.3, .6, .1)), 0.) / (1.5 * lt));
}`,tt=`
attribute vec3 aPivot; attribute vec4 aData; attribute vec3 aUv; attribute float aShadeA;
uniform float uProg, uKeyMix;
varying vec3 vW, vN, vK; varying vec4 vD; varying vec2 vUv;
#include <fog_pars_vertex>
void main() {
  float kind = aUv.z, tier = aData.x, seq = aData.y;
  vec3 p = position, n = normal;
  float T = (uProg - (.34 + .06 * tier)) / .05;          // -1: groove starts, 0: first petal goes, 1: all settled
  float x = clamp((T - seq * .7) / .3, 0., 1.);
  float tip = kind < .5 ? (1. - exp(-5. * x) * cos(7.5 * x)) * .0698 : 0.;
  vec3 ax = vec3(aPivot.z, 0., -aPivot.x); ax /= max(length(ax), 1e-4);
  float c = cos(tip), s = sin(tip);
  vec3 q = p - aPivot;
  p = aPivot + q * c + cross(ax, q) * s + ax * dot(ax, q) * (1. - c);
  n = n * c + cross(ax, n) * s + ax * dot(ax, n) * (1. - c);
  vec4 w = modelMatrix * vec4(p, 1.);
  vW = w.xyz; vN = mat3(modelMatrix) * n;
  // fresh cut: bright matte band where the groove head has just passed this root
  float head = T + 1. - seq;
  vK = vec3(kind, tier, clamp(head * 6., 0., 1.) * (1. - smoothstep(.25, 1.6, head)));
  vD = aData; vD.w = mix(aShadeA, aData.w, uKeyMix); vUv = aUv.xy;
  vec4 mvPosition = viewMatrix * w;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,at=`
#define RUN_CAP .5
uniform vec3 uKey, uKeyCol, cGlow, cJade, cFar, cFresh, cHi, cBounce, cHoney, cDeep, uPortal, uMouth, uLift;
uniform float uTop, uTime, uFill, uGlow, uUnder;
varying vec3 vW, vN, vK; varying vec4 vD; varying vec2 vUv;
#include <fog_pars_fragment>
${et}
float scaleH(vec2 q) {                       // wave diaper: overlapping scale arcs, front rows cover those behind
  float h = 0., done = 0., r0 = floor(q.y * 2.) + 2.;
  for (int j = 0; j < 4; j++) {
    float row = r0 - float(j), off = mod(row, 2.) * .5;
    float cx = floor(q.x - off + .5) + off;
    float dd = length(q - vec2(cx, row * .5)) / .56;
    float hit = step(dd, 1.) * (1. - done);
    h += hit * (1. - smoothstep(.8, 1., dd)) * (.58 + .42 * cos(dd * 15.7));
    done += hit;
  }
  return h;
}
float fretH(vec2 q) {                        // square meander: nested squares, each broken and linked to the next
  vec2 f = fract(q) - .5;
  float m = max(abs(f.x), abs(f.y)) * 6.;
  float gap = step(0., f.x) * (1. - smoothstep(.03, .07, abs(f.y + (mod(floor(m), 2.) - .5) * .12)));
  float band = smoothstep(.12, .3, abs(fract(m) - .5));
  return max(band, gap) * step(m, 2.95) + step(2.95, m) * .0;
}
float relief(float kind, vec2 uv, float d, float flag) {   // metres, out of the surface
  if (kind < .5) {                                         // petal: fluted veins fanning from the root, a mid crease
    float fl = .5 + .5 * cos(uv.x * 56.55);
    return (.15 * fl * fl) * smoothstep(.02, .3, uv.y) * (1. - .6 * smoothstep(.8, 1., uv.y));
  } else if (kind < 1.5) {                                 // core: fret band on the riser faces
    return .0;
  } else if (kind < 2.5) {                                 // well: green scales in the green band, fret on the floor
    float band = smoothstep(40.6, 41.4, d) * (1. - smoothstep(55.2, 56., d));
    float tt = uTime * .5 - uv.y * .04, sh = (floor(tt) + smoothstep(0., .35, fract(tt))) * .5;
    return mix(.7 * band * scaleH(vec2(uv.x + sh * 3.14, uv.y) / 3.14), .5 * fretH(uv / 5.), flag);
  } else if (kind < 3.5) {                                 // water: scale cells 6 m, shifting half a cell every 2 s
    float tt = uTime * .5 - length(uv) * .012, sh = (floor(tt) + smoothstep(0., .35, fract(tt))) * .5;
    return 1.2 * scaleH(vec2(uv.x + sh * 6., uv.y) / 6.);
  }
  float rib = exp(-uv.x * uv.x * 180.);                    // leaf: midrib and six side veins
  float sv = .5 + .5 * cos(6.2832 * (uv.y * 6.5 - abs(uv.x) * 1.6));
  return .32 * rib + .2 * sv * sv * sv * (1. - rib) * (1. - smoothstep(.7, 1., abs(uv.x))) - .25 * abs(uv.x);
}
void main() {
  float kind = vK.x;
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  float d = uTop - vW.y, fw = max(fwidth(d), 1e-4);
  // relief by bump: gradient of the uv chart in world space (derivatives all taken here, outside any branch or loop)
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); vec2 dux = dFdx(vUv), duy = dFdy(vUv);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  det = (det < 0. ? -1. : 1.) * max(abs(det), 1e-7);
  vec3 gU = (r1 * dux.x + r2 * duy.x) / det, gV = (r1 * dux.y + r2 * duy.y) / det;
  float cell = kind < .5 ? .18 : (kind < 2.5 ? 1. : (kind < 3.5 ? 3.5 : .15));
  float fade = 1. - smoothstep(.25, .7, (length(dux) + length(duy)) / cell);
  float e = kind < .5 || kind > 3.5 ? .004 : .06;
  float h0 = relief(kind, vUv, d, vD.z), hu = relief(kind, vUv + vec2(e, 0.), d, vD.z), hv = relief(kind, vUv + vec2(0., e), d, vD.z);
  vec3 bump = (gU * (hu - h0) + gV * (hv - h0)) / e;
  bump *= fade * min(1., 2.5 / max(length(bump), 1e-4));
  // the six flutes of a petal are modelled in the light as well as in the mesh, so each has a lighter and a darker side
  // from as far off as the flower can be seen whole, and the underside of the canopy is a fluted ceiling
  float level = 1. - smoothstep(.1, .38, 1. - N.y * N.y);
  // the underside of the canopy tier. From far off it is one smooth coat (the stack's soft coat bands would stripe it).
  // Near the lens (within 45 m, gone by 75) it is RULED: a hair at every coat of the stack and a stronger one at every
  // tenth, each drawn at one width on the surface whatever its slope (3 cm, or a pixel), so the ruling is as crisp where
  // the petal rolls level overhead as on its steep root; the broad flutes, which read there as soft stripes, are eased
  float under6 = step(kind, .5) * step(4.5, vK.y) * step(vK.y, 5.5) * clamp(-N.y * 1.6 + .1, 0., 1.);
  float nearU = under6 * (1. - smoothstep(45., 75., dist));
  float gS = sqrt(max(1. - N.y * N.y, 0.));                                  // 0 level, 1 upright
  float hwU = max(.03 * max(gS, .05), .9 * fw);
  float ruleU = (1. - smoothstep(hwU, hwU + fw, (.5 - abs(fract(d / .4) - .5)) * .4)) * (1. - smoothstep(.07, .13, fw));
  float ruleX = (1. - smoothstep(hwU * 2.2, hwU * 2.2 + fw, (.5 - abs(fract(d / 4.) - .5)) * 4.)) * (1. - smoothstep(.5, 1.2, fw));
  vec3 gUn = gU / max(length(gU), 1e-5);
  float flf = step(kind, .5) * (1. - smoothstep(.06, .22, length(dux) + length(duy))) * smoothstep(.05, .3, vUv.y);
  vec3 N0 = N;
  N = N - bump + gUn * (.42 * sin(vUv.x * 18.85) * flf * (1. - .55 * nearU)); N /= max(length(N), 1e-4);
  // (under multisampling a varying is extrapolated past the triangle at a silhouette: lip and shade are held to 0..1 there,
  // or a lip of -2 cubed gives a negative colour and a black pixel on the glowing edge)
  float lip = (kind < .5 || kind > 3.5) ? clamp(vD.z, 0., 1.) : 0.;
  // the incandescent lip is a hair, not a band: the last 0.3 m of the petal and never more than a few pixels of it
  float lipPx = (1. - lip) / max(fwidth(lip), 1e-5);
  float hair = smoothstep(.72, 1., lip) * (1. - smoothstep(1.5, 4.5, lipPx));
  float isWell = step(1.5, kind) * step(kind, 2.5);
  if (kind > 2.5 && kind < 3.5) d -= (h0 - .6) * fade;

  vec3 alb = stackColorS(d, fw, level);
  alb = mix(alb, mix(cRed, cRed2, clamp(d / 40., 0., 1.)) * (.94 - nearU * (.5 * ruleU + .26 * ruleX * (1. - ruleU))), .9 * under6);
  float cav = kind < 3.5 && kind > .5 ? 1. : mix(1., (kind < .5 ? .66 : .86) + (kind < .5 ? .34 : .14) * smoothstep(0., .12, h0), fade);
  float ao = kind < .5 ? (.62 + .38 * (.5 + .5 * cos(vUv.x * 18.85))) * (.55 + .45 * smoothstep(0., .5, vUv.y)) : 1.;
  float root = kind < .5 ? 1. - smoothstep(.03, .12, vUv.y) : (kind < 1.5 ? clamp(vD.z, 0., 1.) : 0.);
  float fresh = clamp(vK.z, 0., 1.);
  alb = mix(alb * cav, cFresh, .75 * fresh * root);

  float S = clamp(vD.w, 0., 1.) * mix(1., 1. - smoothstep(2., 15., vUv.y), isWell);
  float w = clamp((dot(N, uKey) + .25) / 1.25, 0., 1.);
  w = mix(w, 1. - (1. - w) * (1. - w), .55);              // waxy, but a raked face is still plainly darker than one square to the key
  // shade keeps its ruling: on a petal's shaded face near the lens (within 45 m, gone by 75) every coat of the stack is a
  // hair and every tenth a stronger one, drawn as on the canopy's underside, and the coat between the hairs is as much
  // lighter as they take away: red shade ruled by its own coats, never one dark mass
  float shadeK = step(kind, .5) * (1. - under6) * (1. - smoothstep(.12, .45, w * S)) * (1. - smoothstep(45., 75., dist));
  alb *= 1. + shadeK * (.1 - .5 * ruleU - .26 * ruleX * (1. - ruleU));
  vec3 fill = mix(cBounce, cHoney, N.y * .5 + .5) * uFill * mix(1., .35, isWell);
  // shade is modelled too: the lit land opposite the key throws its red back, so a shaded form still has two faces
  vec3 Bd = vec3(-uKey.x, .3, -uKey.z); Bd /= max(length(Bd), 1e-4);
  float bw = clamp(dot(N, Bd) * .5 + .5, 0., 1.);
  fill *= mix(1., .62 + .7 * bw * bw, 1. - isWell);
  // three tones in the shade: faces turned up to the vault are the lightest, walls between, undercuts the deepest red
  fill *= mix(1., .4 + 1.25 * smoothstep(-.55, .75, N.y), 1. - isWell);
  vec3 col = alb * ao * (uKeyCol * w * S + fill);
  vec3 Hh = uKey + V; Hh /= max(length(Hh), 1e-4);
  float nh = max(dot(N, Hh), 0.); nh *= nh; nh = nh * nh * nh; nh *= nh;
  col += .16 * nh * S * (cHi * step(kind, 1.5) * step(d, 40.) + alb * 2.2);   // waxy: the sheen keeps the layer's hue
  float rim = 1. - max(dot(N, V), 0.); rim = rim * rim * rim;
  col += .35 * rim * alb * (.45 + .75 * w * S) + .45 * lip * lip * alb * w * S;   // rim, and the lit bevel of a lip
  // rain on the lacquer: beads run down the flute valleys of every petal near the lens, each a bright head with a wet
  // trail (they fade out with distance and before they are finer than a pixel, so the far flower is unchanged)
  float fxr = vUv.x * 9., fhr = fract(sin(floor(fxr) * 12.9898 + vD.y * 78.233 + vK.y * 37.7) * 43758.5453);
  float runr = fract(vW.y * .4 + uTime * (.33 + .2 * fhr) + fhr * 9.);
  float wet = smoothstep(0., .08, runr) * (1. - smoothstep(.08, .55, runr)) * (1. - smoothstep(.08, .2, abs(fract(fxr) - .5)));
  wet *= step(kind, .5) * (1. - smoothstep(40., 85., dist)) * (1. - smoothstep(.02, .07, fw * .4)) * smoothstep(.1, .25, vUv.y) * (1. - smoothstep(.85, .97, lip));
  // (the head is held under the brief's lightest red: a wet line in the lacquer's own colour, never a sparkle)
  col *= min(1. + .8 * wet, max(1., RUN_CAP / max(col.r, 1e-4)));
  // buff in the cuts: where a petal runs down into the cut behind the tier in front, the knife has gone through red, black
  // and green to the buff at the bottom of the stack: the stack's own buff under the same light as the vault behind
  vec3 ground = cBuff * (uKeyCol * (w * S) + cHoney * (uFill * 1.25)) * (1. + .2 * rim);
  float cut = step(kind, .5) * (1. - smoothstep(.05, .2, vUv.y)) * (1. - .7 * fresh);
  col = mix(col, ground, cut);
  // a petal is thin toward its tip: with the key behind it the outer half passes a little of it, warm, so a back-lit
  // petal runs from a deep root to a lighter tip instead of standing as one dark shape
  float thru = step(kind, .5) * smoothstep(.3, 1., vUv.y) * clamp(-dot(N, uKey), 0., 1.) * S;
  col += alb * uKeyCol * (.34 * thru);
  // the ceiling of the trough: the underside of the canopy tier takes the red light thrown up from the lit tiers beneath
  // it (the land's own bounce), so close overhead it is a lit, fluted ceiling and not a dark slab
  float ceil6 = step(kind, .5) * step(4.5, vK.y) * step(vK.y, 5.5) * clamp(-N.y * 1.6 + .1, 0., 1.);
  col += alb * (cRed * 1.4 + uKeyCol * .22) * (.6 * ceil6 * (1. - uUnder * nearU));
  col /= 1. + 1.1 * max(col.r - .58, 0.);
  // thin lips pass the key: orange when they stand between us and it
  float tow = clamp(.5 - dot(V, uKey) * .7, 0., 1.);
  vec3 glow = cGlow * (uGlow * tow * tow * (kind > 3.5 ? .12 * lip * lip * lip : 1.5 * hair + .1 * lip * lip * lip));
  // and a lip that simply catches the key is a bright hairline too: lit, or lit through from behind
  glow += cGlow * (step(kind, .5) * hair * (.3 + .75 * w * S + 1.1 * clamp(.15 - dot(N, uKey), 0., 1.) * tow));
  // the glow peaks at the brief's lightest orange: it fills what is left under that peak and never stacks over it
  col = min(col + glow, max(col, GLOW_PEAK));
  // down the well the key is lost and the portal's pale jade takes over, as a rim
  vec3 tp = uPortal - vW; float jd = length(tp); tp /= max(jd, 1e-4);
  float jw = clamp(dot(N, tp) * .5 + .5, 0., 1.);
  vec3 jade = cJade * (.16 + .5 * jw * jw + .9 * rim) * (.3 + .9 * exp(-jd / 38.));
  // (the well's floor flag is 0 or 1: held there, for under multisampling a varying runs on past its range at an edge)
  float wellFloor = clamp(vD.z, 0., 1.);
  col += isWell * (alb * jade * mix(1.1, .3, wellFloor) + cJade * rim * .2 * (.3 + .7 * exp(-jd / 38.)));
  // the mouth of the well lights the petals standing round it with that jade: a light on their own lacquer and a rim on
  // their edges, never a colour laid over them
  vec3 tm = uMouth - vW; float md = length(tm); tm /= max(md, 1e-4);
  float mj = step(kind, 1.5) * (1. - smoothstep(8., 24., md)) * clamp(dot(N0, tm) * .6 + .4, 0., 1.);
  vec3 jadeG = cJade * vec3(.72, 1., .8);
  col += jadeG * (mj * mj) * (alb * .45 + .3 * rim);
  // and the lip of the bore keeps its own ruled red, the black hairline and the green below it: there too the jade is
  // only a rim light on the ledges
  float mg = isWell * (1. - wellFloor) * (1. - smoothstep(1.5, 6.5, vUv.y));
  col += jadeG * (.4 * mg * rim);
  float low = clamp(1. - col.r / .13, 0., 1.);
  col += cDeep * (low * low * step(d, 40.25) * (1. - isWell) * (1. - .8 * w * S));     // red shade is never a void: the deepest tone of the lacquer
  col = mix(col, shadeToe(col, stackToe(d, fw)), 1. - isWell);
  float t = 1. - exp(-dist / 700.);
  col = mix(col, cFar, .5 * t * (1. - isWell));
  gl_FragColor = vec4(clamp(col, 0., 40.) + uLift, 1.);
  #include <fog_fragment>
}`,xe=(e,t)=>({pos:new Float32Array(e*3),nor:new Float32Array(e*3),piv:new Float32Array(e*3),dat:new Float32Array(e*4),uv:new Float32Array(e*3),idx:new Uint32Array(t),n:0,ni:0});function fe(e,t,a,c,p,u,w,g,m,f,v,l){const s=t*3,h=t*4;e.piv[s]=a,e.piv[s+1]=c,e.piv[s+2]=p,e.dat[h]=u,e.dat[h+1]=w,e.dat[h+2]=g,e.dat[h+3]=m,e.uv[s]=f,e.uv[s+1]=v,e.uv[s+2]=l}function oe(e,t,a,c,p,u){const w=e.n,g=a+1,m=(v,l)=>(Math.min(a,Math.max(0,v))+Math.min(c,Math.max(0,l))*g)*3;for(let v=0;v<=c;v++)for(let l=0;l<=a;l++){const s=m(l-1,v),h=m(l+1,v),r=m(l,v-1),n=m(l,v+1),i=m(l,v),d=t[h]-t[s],M=t[h+1]-t[s+1],b=t[h+2]-t[s+2],N=t[n]-t[r],x=t[n+1]-t[r+1],U=t[n+2]-t[r+2];let F=x*b-U*M,W=U*d-N*b,S=N*M-x*d;const z=p/Math.max(Math.hypot(F,W,S),1e-6),V=e.n++,C=V*3;e.pos[C]=t[i],e.pos[C+1]=t[i+1],e.pos[C+2]=t[i+2],e.nor[C]=F*z,e.nor[C+1]=W*z,e.nor[C+2]=S*z,u(l,v,e,V)}let f=e.ni;for(let v=0;v<c;v++)for(let l=0;l<a;l++){const s=w+l+v*g,h=s+1,r=s+g,n=r+1;p>0?(e.idx[f]=s,e.idx[f+1]=r,e.idx[f+2]=h,e.idx[f+3]=h,e.idx[f+4]=r,e.idx[f+5]=n):(e.idx[f]=s,e.idx[f+1]=h,e.idx[f+2]=r,e.idx[f+3]=h,e.idx[f+4]=n,e.idx[f+5]=r),f+=6}return e.ni=f,w}async function ot(e,t,a,c,p,u,w,g){const m=e.n,f=a+1,v=(s,h)=>(Math.min(a,Math.max(0,s))+Math.min(c,Math.max(0,h))*f)*3;for(let s=0;s<=c;s++){s&&s%g===0&&await w.yield();for(let h=0;h<=a;h++){const r=v(h-1,s),n=v(h+1,s),i=v(h,s-1),d=v(h,s+1),M=v(h,s),b=t[n]-t[r],N=t[n+1]-t[r+1],x=t[n+2]-t[r+2],U=t[d]-t[i],F=t[d+1]-t[i+1],W=t[d+2]-t[i+2];let S=F*x-W*N,z=W*b-U*x,V=U*N-F*b;const C=p/Math.max(Math.hypot(S,z,V),1e-6),ie=e.n++,q=ie*3;e.pos[q]=t[M],e.pos[q+1]=t[M+1],e.pos[q+2]=t[M+2],e.nor[q]=S*C,e.nor[q+1]=z*C,e.nor[q+2]=V*C,u(h,s,e,ie)}}await w.yield();let l=e.ni;for(let s=0;s<c;s++)for(let h=0;h<a;h++){const r=m+h+s*f,n=r+1,i=r+f,d=i+1;p>0?(e.idx[l]=r,e.idx[l+1]=i,e.idx[l+2]=n,e.idx[l+3]=n,e.idx[l+4]=i,e.idx[l+5]=d):(e.idx[l]=r,e.idx[l+1]=n,e.idx[l+2]=i,e.idx[l+3]=n,e.idx[l+4]=d,e.idx[l+5]=i),l+=6}return e.ni=l,m}async function de(e,t,a){if(e instanceof t)return e;const c=e.length,p=new t(c);for(let u=0;u<c;u+=4e4){const w=Math.min(c,u+4e4);for(let g=u;g<w;g++)p[g]=e[g];a&&await a.yield()}return p}async function nt(e,t){const a=new y.BufferGeometry;a.setAttribute("position",new y.BufferAttribute(await de(e.pos,Float32Array,t),3)),a.setAttribute("normal",new y.BufferAttribute(await de(e.nor,Float32Array,t),3)),a.setAttribute("aPivot",new y.BufferAttribute(await de(e.piv,Float32Array,t),3)),a.setAttribute("aData",new y.BufferAttribute(await de(e.dat,Float32Array,t),4)),a.setAttribute("aUv",new y.BufferAttribute(await de(e.uv,Float32Array,t),3));const c=e.pos.length/3,p=e.shA||new Float32Array(c);if(!e.shA)for(let u=0;u<c;u++)p[u]=e.dat[u*4+3];return a.setAttribute("aShadeA",new y.BufferAttribute(p,1)),a.setIndex(new y.BufferAttribute(await de(e.idx,Uint32Array,t),1)),a.boundingSphere=new y.Sphere(new y.Vector3(0,10,0),260),a}const X=(e,t,a)=>{const c=Math.min(1,Math.max(0,(a-e)/(t-e)));return c*c*(3-2*c)},R=30,K=9,At={nu:R,nv:K,counts:I.map(e=>e[5]),roots:I.map(e=>[e[0],e[1]])};function it(e,t){const c=new Float32Array(33),p=new Float32Array(33),u=new Float32Array(33);let w=t.R0-2.2,g=t.Y0-.4;for(let n=0;n<=32;n++){const i=n/32,d=t.elev+t.cup*Math.sin(Math.PI*Math.min(1,i/.8)*.9)-t.roll*X(.62,1.05,i);c[n]=w,p[n]=g,u[n]=d,w+=Math.cos(d)*(t.L+2.2)/32,g+=Math.sin(d)*(t.L+2.2)/32}const m=new Float32Array((R+1)*(K+1)*3),f=new Float32Array(m.length),v=new Float32Array((R+1)*(K+1)),l=Math.sin(t.th0)*t.R0,s=Math.cos(t.th0)*t.R0;for(let n=0;n<=K;n++)for(let i=0;i<=R;i++){const d=i/R*2-1,M=Math.pow(n/K,.85),b=(i+n*(R+1))*3,N=(.74+.26*Math.sqrt(1-d*d*.97))*(1+t.scal*(Math.pow(Math.abs(Math.cos(d*Math.PI*1.5)),.55)-.62)),x=Math.min(1,M*N),U=x*32,F=Math.min(31,Math.floor(U)),W=U-F,S=c[F]+(c[F+1]-c[F])*W,z=p[F]+(p[F+1]-p[F])*W,V=u[F]+(u[F+1]-u[F])*W,C=t.W*.5*(.4+.6*Math.pow(Math.sin(Math.PI*.5*Math.min(1,x/.62)),.8))*(1-.1*X(.7,1,x)),ie=d*C,q=t.cup2*d*d*C*(.25+.75*X(0,.5,x))+t.flute*.5*Math.cos(d*Math.PI*6)*X(.12,.7,x)+t.ruf*x*x*x*Math.sin(d*Math.PI*t.nr+t.ph1),E=S-q*Math.sin(V),re=z+q*Math.cos(V),H=re>45.6?45.6+1.3*(1-Math.exp(-(re-45.6)/1.3)):re,le=t.th0+ie/Math.max(E,9)*.92;m[b]=Math.sin(le)*E,m[b+1]=H,m[b+2]=Math.cos(le)*E;const Fe=Math.min((1-n/K)*t.L,n/K>.22?(1-Math.abs(d))*C:99);v[i+n*(R+1)]=1-Math.min(1,Fe/1.5)}const h=(n,i,d,M)=>fe(d,M,l,t.Y0,s,t.tier,t.seq,v[n+i*(R+1)],1,n/R*2-1,i/K,0),r=oe(e,m,R,K,1,h);for(let n=0;n<=K;n++)for(let i=0;i<=R;i++){const d=i/R*2-1,M=n/K,b=(i+n*(R+1))*3,N=(r+i+n*(R+1))*3,x=t.thick*Math.pow(1-M,.7)*Math.sqrt(1-d*d*d*d)*(.55+.45*(1-M));f[b]=m[b]-e.nor[N]*x,f[b+1]=m[b+1]-e.nor[N+1]*x,f[b+2]=m[b+2]-e.nor[N+2]*x}oe(e,f,R,K,-1,h)}const rt=he,lt=he/Math.sin(ae),Ge=e=>1/Math.sqrt((Math.sin(e)/rt)**2+(Math.cos(e)/lt)**2);async function st(e,t,a){const c=[[74,-3,-1,0,0],[72.6,.4,-1,0,0],[70.6,3.4,-1,0,0]];for(let l=0;l<9;l++){const[s,h]=I[l],r=l?I[l-1][1]:3.6;c.push([s-4.4,r+1.7,l,0,0],[s-5.2,h-2.3,l,0,0],[s-1.6,h-.9,l,1,0],[s+.1,h-.1,l,1,0]),l<8&&c.push([s-2.4,h+.9,l,0,0])}c.push([1.13,40.1,8,0,1],[1.07,ge,8,0,1],[1.01,ge-.3,8,0,1],[.99,ge-1.6,8,0,1]);const p=[],u=2;for(let l=0;l<c.length-1;l++)for(let s=0;s<u;s++){const h=s/u,r=c[Math.max(0,l-1)],n=c[l],i=c[l+1],d=c[Math.min(c.length-1,l+2)],M=n[4]||i[4],b=(N,x,U,F)=>M?x+(U-x)*h:.5*(2*x+(U-N)*h+(2*N-5*x+4*U-F)*h*h+(3*x-N-3*U+F)*h*h*h);p.push([b(r[0],n[0],i[0],d[0]),b(r[1],n[1],i[1],d[1]),n[2],n[3]+(i[3]-n[3])*h,n[4]&&i[4]?1:i[4]?-1:0,n[0],i[0]])}const w=c[c.length-1];p.push([w[0],w[1],8,0,1,w[0]]);const g=96,m=p.length-1,f=new Float32Array((g+1)*(m+1)*3);for(let l=0;l<=m;l++)for(let s=0;s<=g;s++){s===0&&l%20===19&&await a.yield();const h=s/g*Math.PI*2,r=p[l],n=(s+l*(g+1))*3;let i=r[0];r[4]===1?i=Ge(h)*r[0]:r[4]===-1?i=r[5]+(Ge(h)*r[6]-r[5])*(l%u)/u:i*=1+.012*Math.sin(h*t+r[1]*.3)+(r[3]>0?0:.008*Math.cos(h*(r[2]<0?28:I[r[2]][5]*3))),f[n]=Math.sin(h)*i,f[n+1]=r[1],f[n+2]=Math.cos(h)*i}await a.yield();const v=xe((g+1)*(m+1),g*m*6);return await ot(v,f,g,m,-1,(l,s,h,r)=>{const n=p[s],i=Math.max(0,n[2]),d=l/g+e[i];fe(h,r,1,0,0,i,d-Math.floor(d),n[2]<0?0:n[3],1,l/g*6.2832*n[0],n[1],1)},a,6),v}const ne=[0,-Math.sin(ae),-Math.cos(ae)],Ie=[0,-Math.cos(ae),Math.sin(ae)],ue=76,He=62,ct=12.5,Ee=e=>he+(ct-he)*X(56.6,61,e)-4*X(ue-2.5,ue,e)**2;function Ye(e,t,a,c,p){const u=Math.cos(a)*t,w=Math.sin(a)*t;c[p]=u+ne[0]*e,c[p+1]=ge+ne[1]*e+Ie[1]*w,c[p+2]=ne[2]*e+Ie[2]*w}function ht(){const c=xe(2499,14112),p=new Float32Array(2205*3),u=new Float32Array(2205);for(let m=0;m<=44;m++)for(let f=0;f<=48;f++){const v=f/48*Math.PI*2,l=-he*Math.cos(ae)*Math.sin(v)/Math.sin(ae)+.3,s=m/44,h=l+(ue-l)*(.35*s+.65*s*s*(3-2*s));u[f+m*49]=h,Ye(h,Ee(h),v,p,(f+m*49)*3)}oe(c,p,48,44,1,(m,f,v,l)=>fe(v,l,1,0,0,-9,0,0,1,m/48*Math.PI*2*he,u[m+f*49],2));const w=new Float32Array(294*3),g=Ee(ue);for(let m=0;m<=5;m++)for(let f=0;f<=48;f++)Ye(ue,g*(1-m/5),f/48*Math.PI*2,w,(f+m*49)*3);oe(c,w,48,5,1,(m,f,v,l)=>{const s=m/48*Math.PI*2,h=g*(1-f/5);fe(v,l,1,0,0,-9,0,1,1,Math.cos(s)*h,Math.sin(s)*h,2)});for(let m=c.nor.length-294*3;m<c.nor.length;m+=3)c.nor[m]=-ne[0],c.nor[m+1]=-ne[1],c.nor[m+2]=-ne[2];return c}function ft(e,t,a,c,p,u,w,g){const v=new Float32Array(210),l=new Float32Array(v.length),s=new Float32Array(70);for(let n=0;n<=9;n++)for(let i=0;i<=6;i++){const d=i/6*2-1,M=n/9,b=(i+n*7)*3,N=p*.5*Math.pow(Math.sin(Math.PI*Math.pow(.08+.92*M,.72)),.85)*(1+.07*Math.sin(M*21+w)),x=a-2+(c+2)*M,U=d*N+Math.sin(M*2.4+w)*1.6*M,F=.75+u*Math.pow(1-M,1.5)+1.7*Math.sin(Math.PI*M)+g*Math.abs(d)*N*.22+.35*Math.sin(d*5+M*9+w)*M,W=t+U/x;v[b]=Math.sin(W)*x,v[b+1]=F,v[b+2]=Math.cos(W)*x,s[i+n*7]=1-Math.min(1,Math.min((1-Math.abs(d))*N,(1-M)*c)/1.2)}const h=(n,i,d,M)=>fe(d,M,1,0,0,-9,0,s[n+i*7],1,n/6*2-1,i/9,4),r=oe(e,v,6,9,1,h);for(let n=0;n<=9;n++)for(let i=0;i<=6;i++){const d=i/6*2-1,M=n/9,b=(i+n*7)*3,N=(r+i+n*7)*3,x=1.3*Math.sqrt(Math.max(0,1-d*d))*Math.sqrt(1-M);l[b]=v[b]-e.nor[N]*x,l[b+1]=v[b+1]-e.nor[N+1]*x,l[b+2]=v[b+2]-e.nor[N+2]*x}oe(e,l,6,9,-1,h)}function dt(e){const c=xe(2619,14976),p=new Float32Array(2619*3);for(let u=0;u<=26;u++)for(let w=0;w<=96;w++){const g=w/96*Math.PI*2,m=60+(e-60)*Math.pow(u/26,1.5),f=(w+u*97)*3;p[f]=Math.sin(g)*m,p[f+1]=0,p[f+2]=Math.cos(g)*m}return oe(c,p,96,26,1,(u,w,g,m)=>{const f=(u+w*97)*3;fe(g,m,1,0,0,-9,0,0,1,p[f],p[f+2],3)}),c}const L=160,Q=104;async function ut(e,t){const a=new Float32Array(9*L*L).fill(-1e9),c=new Float32Array(9*L*L).fill(1e9),p=new Float32Array(L*L).fill(-1e9),u=e.pos.length/3;for(let w=0;w<u;w++){w%500===499&&await t.yield();const g=e.dat[w*4],m=e.pos[w*3],f=e.pos[w*3+1],v=e.pos[w*3+2],l=Math.round((m+Q)/(2*Q)*L),s=Math.round((v+Q)/(2*Q)*L);for(let h=-1;h<=1;h++)for(let r=-1;r<=1;r++){const n=l+r,i=s+h;if(n<0||i<0||n>=L||i>=L)continue;const d=(i*L+n)*9+g;f>a[d]&&(a[d]=f),f<c[d]&&(c[d]=f),f>p[i*L+n]&&(p[i*L+n]=f)}}return{H:a,U:c,HM:p}}function mt(e){if(e<4)return 71;if(e>39)return e<40.3?11:0;const t=(e-4.5)/4,a=Math.min(8,Math.max(0,Math.floor(t)));return I[a][0]-3}async function Ne(e,t,a,c,p,u=22){const{H:w,U:g,HM:m}=t,f=e.pos.length/3,v=Math.max(Math.hypot(a[0],a[2]),1e-4),l=a[0]/v,s=a[2]/v,h=a[1]/v;for(let r=0;r<f;r++){r%400===399&&await c.yield();let n=e.pos[r*3]+e.nor[r*3]*.7,i=e.pos[r*3+1]+e.nor[r*3+1]*.7,d=e.pos[r*3+2]+e.nor[r*3+2]*.7,M=0,b=1.1;for(let N=0;N<u&&M<1&&(n+=l*b,d+=s*b,i+=h*b,b*=1.11,!(i>50));N++){if(N>1){const S=mt(i);if(S>0&&n*n+d*d<S*S*1.000001){const z=Math.hypot(n,d);if(z<S){M=Math.max(M,Math.min(1,(S-z)/2));continue}}}const x=Math.round((n+Q)/(2*Q)*L),U=Math.round((d+Q)/(2*Q)*L);if(x<0||U<0||x>=L||U>=L)break;if(i>m[U*L+x]-.45)continue;const F=(U*L+x)*9,W=p?e.dat[r*4]:-1;for(let S=0;S<9;S++){const z=w[F+S];if(z<-1e8)continue;const V=S===W;if(V&&N<4)continue;const C=V?Math.min(z-1.6-i,i-g[F+S]-1.2):Math.min(z-.45-i,i-g[F+S]+.3);C>0&&(M=Math.max(M,Math.min(1,C/1.2)))}}e.dat[r*4+3]=1-M}}const pt=`
attribute vec4 iA, iB; attribute vec3 iC;      // iA: tier (-1 = already flying), seq, length, phase; iB: three randoms, turns; iC: r, y, angle
uniform float uProg, uTime;
varying vec3 vW, vN; varying vec2 vT;
#include <fog_pars_vertex>
void main() {
  float t = position.x, wd = position.y, tier = iA.x;
  float head = tier < -.5 ? 40. : (uProg - (.34 + .06 * tier)) / .05 + 1. - iA.y;
  float age = max(head, 0.) * 2.3;
  float grow = smoothstep(0., .3, age), free = smoothstep(.35, 1.1, age), k = 1. - exp(-age * .45);
  float th = iC.z + k * (.7 + iB.z) + uTime * .05 * free;
  float r = iC.x + 3. + k * (16. + 24. * iB.x) + 2.5 * sin(uTime * .31 + iA.w) * free;
  float y = iC.y + 1.5 + k * (9. + 20. * iB.y) + 3. * sin(uTime * .4 + th * 2.) * free;
  vec3 rad = vec3(sin(th), 0., cos(th)), tan_ = vec3(cos(th), 0., -sin(th));
  vec3 A = tan_ * (.25 + .75 * free) + vec3(0., 1., 0.) * (1. - free) + rad * .3 * sin(iA.w * 3.); A /= max(length(A), 1e-4);
  vec3 Bv = rad - A * dot(rad, A); Bv /= max(length(Bv), 1e-4);
  vec3 Cv = cross(A, Bv);
  float flex = 1. + .32 * sin(uTime * 9.42 + iA.w) * free;                 // opening and closing 1.5 times a second
  float ang = (t - .5) * iB.w * 6.2832 * flex + iA.w;
  float rho = iA.z * .13 / flex;
  float w = wd * .62 * smoothstep(0., .1, t) * (1. - smoothstep(.86, 1., t));
  vec3 nrm = Bv * cos(ang) + Cv * sin(ang);
  // near the lens a shaving is finer, and every other one is gone: a ribbon is never broad against the lens
  vec3 c0 = vec3(rad * r) + vec3(0., y, 0.);
  float dn = length(cameraPosition - (modelMatrix * vec4(c0, 1.)).xyz);
  float nearK = (.55 + .45 * smoothstep(16., 60., dn)) * smoothstep(8., 13., dn);
  // released curls fly on for the whole flight, thinned by nothing but their distance from the lens (above)
  vec3 p = c0 + (A * ((t - .5) * iA.z * .5 * flex + w) + nrm * rho) * (grow * nearK);
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz; vN = mat3(modelMatrix) * nrm; vT = vec2(t, wd * 2.);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,vt=`
uniform vec3 uKey, uKeyCol, cRed, cRed2, cBuff, cGlow, cBounce, cHoney, cFar, uLift;
uniform float uFill, uGlow;
varying vec3 vW, vN; varying vec2 vT;
#include <fog_pars_fragment>
void main() {
  vec3 N = vN / max(length(vN), 1e-4);
  vec3 Vv = cameraPosition - vW; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-4);
  float face = gl_FrontFacing ? 1. : 0.;
  if (face < .5) N = -N;
  float tri = abs(fract(clamp(vT.x, 0., 1.) * 9.) - .5) * 2.;      // (along and across are held to the ribbon's own range: a varying runs past it at a silhouette)
  vec3 alb = mix(mix(cRed, cBuff, .28), cRed, face) * (1. - .14 * smoothstep(.5, .95, tri) * face);
  float w = clamp((dot(N, uKey) + .35) / 1.35, 0., 1.);
  vec3 col = alb * (uKeyCol * w + mix(cBounce, cHoney, N.y * .5 + .5) * uFill);
  float rim = 1. - max(dot(N, V), 0.); col += .35 * rim * rim * rim * alb;
  float edge = smoothstep(.78, 1., min(abs(vT.y), 1.)), tow = clamp(.45 - dot(V, uKey) * .7, 0., 1.);
  col += cGlow * (uGlow * edge * tow * tow);
  col = mix(col, cFar, .75 * (1. - exp(-dist / 700.)));
  gl_FragColor = vec4(clamp(col, 0., 40.) + uLift, 1.);
  #include <fog_fragment>
}`,wt=`
attribute vec4 iP;
uniform float uTime;
varying float vL;
#include <fog_pars_vertex>
void main() {
  vec3 c = vec3(iP.x, mod(iP.y - uTime * (2.7 + .6 * iP.w), 78.) - 6., iP.z);
  vec4 wc = modelMatrix * vec4(c, 1.);
  float dist = length(cameraPosition - wc.xyz);
  vec3 side = vec3(cameraPosition.z - wc.z, 0., wc.x - cameraPosition.x); side /= max(length(side), 1e-4);
  vec4 wp = wc + vec4(side * position.x * max(.06, dist * .0007) + vec3(0., position.y * max(.25, dist * .0034), 0.), 0.);
  vL = 1. - .7 * position.x * position.x - .25 * position.y;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,yt=`
uniform vec3 cRed, uKeyCol, uLift;
varying float vL;
#include <fog_pars_fragment>
void main() {
  // a bead is the lit vermilion at its tail and the brief's highlight (#DB4A34) at its head, never lighter (vL runs .25 to
  // 1.25 over a bead and is held there: under multisampling a varying runs on past its range on so thin a quad)
  gl_FragColor = vec4(cRed * (uKeyCol * (.5 + .216 * clamp(vL, .25, 1.25))) + uLift, 1.);
  #include <fog_fragment>
}`;function gt(e){const a=[],c=[];for(let u=0;u<=28;u++)if(a.push(u/28,-.5,0,u/28,.5,0),u<28){const w=u*2;c.push(w,w+1,w+2,w+1,w+3,w+2)}const p=new y.InstancedBufferGeometry;return p.setAttribute("position",new y.Float32BufferAttribute(a,3)),p.setIndex(c),p.instanceCount=e,p.boundingSphere=new y.Sphere(new y.Vector3(0,20,0),220),p}const xt=["#B3261E","#7A1712","#3F6B4A","#D9B77A","#16110F","#E86A3A"];async function kt(e,t={}){const a=e.rng,c=(t.palette&&t.palette.length>=6?t.palette:xt).map(o=>new y.Color(o)),p=Math.min(1,Math.max(.6,t.detail??e.quality?.detail??1)),u=Math.PI/180,w=a.range(-4,4)*u,g=a.range(.95,1.6),m=a.range(.85,1.2),f=a.int(5,9),v=[],l=[];for(let o=0;o<9;o++)v.push(a()),l.push(o*.5+a.range(-.18,.18));const s=new y.Vector3().fromArray(t.keyDir||[-.894,.309,.325]).normalize(),h=I.reduce((o,A)=>o+A[5],0),r=xe(h*2*(R+1)*(K+1),h*2*R*K*6),n=[],i=[],d=typeof t.canopyAz=="number"?t.canopyAz:null;let M=-1,b=-1;if(d!==null){let o=9;for(let A=0;A<I[5][5];A++){const k=(A+l[5])/I[5][5]*Math.PI*2-d,j=Math.abs(Math.atan2(Math.sin(k),Math.cos(k)));j<o&&(o=j,M=A)}}for(let o=0;o<9;o++){const[A,k,j,T,D,B]=I[o],G=o/8;for(let P=0;P<B;P++){const J=(P+l[o])/B*Math.PI*2+a.range(-.035,.035),we=J/(Math.PI*2)+v[o],ye=r.n,_={R0:A,Y0:k,tier:o,th0:J,seq:we-Math.floor(we),thick:4,L:j*a.range(.93,1.07),W:D*a.range(.94,1.04),elev:T*u+w*(.4+.6*G)+(P%2?2.6:-2.6)*u+a.range(-1.5,1.5)*u,cup:(15+12*G)*u*m,roll:((o===0?62:38)-16*G)*u*a.range(.85,1.15),cup2:a.range(.3,.46),ruf:g*(D/26)*a.range(.8,1.4),nr:a.range(1.1,2.3),scal:a.range(.1,.16),flute:D/26*a.range(.45,.7),ph1:a.range(0,6.28)},$=d===null?9:Math.abs(Math.atan2(Math.sin(J-d),Math.cos(J-d))),ce=o===5&&P===M;if(ce)_.L*=1.55,_.elev=36*u,_.roll=104*u,_.W*=1.12,_.ruf=Math.min(_.ruf,1.1)*.5,_.cup=17*u,_.thick=3.2,b=ye;else if(o===4&&$<1.1){const te=1-X(.72,1.1,$);_.elev-=27*u*te,_.L*=1-.1*te,_.roll*=1+.5*te,_.cup2*=1-.6*te}else if(o===3&&$<1){const te=1-X(.6,1,$);_.elev-=8*u*te,_.cup2*=1-.5*te}it(r,_);const ee=(ye+R/2+K*(R+1))*3,Ae=new y.Vector3(r.pos[ee],r.pos[ee+1],r.pos[ee+2]);P===0&&n.push({r:Math.hypot(Ae.x,Ae.z),y:Ae.y}),o===5&&i.push({lip:Ae,azimuth:J,canopy:ce}),await e.yield()}await e.yield()}let N=null;if(t.keyFor){const o=t.keyFor(i);Array.isArray(o)?s.fromArray(o).normalize():(s.fromArray(o.key).normalize(),N=new y.Vector3().fromArray(o.early).normalize().toArray())}await e.yield();const x=await ut(r,e);await e.yield();const U=[s.x,s.y,s.z],F=async(o,A)=>{await Ne(r,x,o,e,!0,A);const k=R+1,j=K+1,T=k*j,D=new Float32Array(T),B=r.pos.length/3/T;for(let G=0;G<B;G++){for(let P=0;P<T;P++)D[P]=r.dat[(G*T+P)*4+3];for(let P=0;P<j;P++)for(let J=0;J<k;J++){let we=0,ye=0;for(let _=-1;_<=1;_++)for(let $=-1;$<=1;$++){const ce=J+$,ee=P+_;ce>=0&&ee>=0&&ce<k&&ee<j&&(we+=D[ce+ee*k],ye++)}r.dat[(G*T+J+P*k)*4+3]=we/ye}G%4===3&&await e.yield()}};if(N){await F(N,14),r.shA=new Float32Array(r.pos.length/3);for(let o=0;o<r.shA.length;o++)r.shA[o]=r.dat[o*4+3];await e.yield()}await F(U,22),await e.yield();const W=await st(v,f,e);await e.yield(),await Ne(W,x,U,e,!1);const S=ht();await e.yield();const z=15,V=xe(z*2*2*70,z*2*2*324),C=a();for(let o=0;o<z*2;o++){const A=o%2===0,k=(o*.5+C)/z*Math.PI*2+a.range(-.05,.05);ft(V,k,A?69.5:70.5,A?a.range(19,24):a.range(11,15),A?a.range(14,17):a.range(9,11),A?5.2:3.2,a.range(0,6.28),a.range(.7,1.3))}await e.yield(),await Ne(V,x,U,e,!1);const ie=t.apron!==!1,q=dt(t.apronRadius||210);await e.yield(),await Ne(q,x,U,e,!1),await e.yield();const E=o=>new y.Color(o),re=(o,A)=>o.lerp(new y.Color(1,1,1),A),H={cRed:{value:re(c[0].clone().multiplyScalar(1.1),.01)},cRed2:{value:re(c[0].clone().lerp(c[1],.34),.008)},cGreen:{value:c[2].clone().multiplyScalar(1.35)},cBuff:{value:c[3].clone()},cBlack:{value:c[4].clone()},cGlow:{value:c[5].clone()},cJade:{value:E("#DDF6E4")},cFar:{value:E("#5A100E")},cFresh:{value:E("#D2382A")},cHi:{value:E("#FF7A5A")},cBounce:{value:c[0].clone().multiplyScalar(.26).lerp(new y.Color(.13,.13,.13),.55)},cHoney:{value:c[3].clone().multiplyScalar(.2).lerp(new y.Color(.16,.16,.16),.5)},uKey:{value:s.clone()},uKeyCol:{value:E("#FFF0DC").multiplyScalar(1.2)},uPortal:{value:new y.Vector3},uMouth:{value:new y.Vector3},uTop:{value:ke},uTime:{value:0},uProg:{value:0},uKeyMix:{value:1},uFill:{value:2.4},uGlow:{value:2.2},uLift:{value:new y.Color().fromArray(t.lift||[.024,.042,.04])},cCap:{value:E("#1B1513")},cDeep:{value:new y.Color(.05,.006,.005)},uMarble:{value:t.marble?1:0},uCap:{value:t.cap??-100},uToe:{value:new y.Vector3(0,0,0)},uUnder:{value:0}},le=(o,A,k)=>new y.ShaderMaterial({uniforms:{...y.UniformsUtils.clone(y.UniformsLib.fog),...H},vertexShader:o,fragmentShader:A,fog:!0,side:k}),Fe=le(tt,at,y.FrontSide),Y=new y.Group;Y.name="peony-boss";const We={};for(const[o,A]of[["petals",r],["core",W],["well",S],["leaves",V],["apron",q]]){const k=new y.Mesh(await nt(A,e),Fe);k.name=o,k.frustumCulled=!1,o==="apron"&&(k.visible=ie),Y.add(k),We[o]=k,await e.yield()}const me=Math.max(6,Math.round(12*p)),Oe=Math.round(28*p),pe=me*9+Oe,Ue=new Float32Array(pe*4),Ke=new Float32Array(pe*4),Re=new Float32Array(pe*3),Je=a.range(0,6.28);for(let o=0;o<pe;o++){const A=o<me*9?Math.floor(o/me):-1;if(A>=0){const k=(o%me+a.range(.1,.9))/me;Ue.set([A,k,a.range(4.2,5.6),a.range(0,6.28)],o*4),Re.set([I[A][0]+1,I[A][1],(k-v[A])*Math.PI*2],o*3)}else Ue.set([-1,0,a.range(2.4,5),a.range(0,6.28)],o*4),Re.set([a.range(62,84),a.range(2,16),Je+a.gauss()*.42],o*3);Ke.set([a(),a(),a.range(0,.6),a.range(2,3)],o*4)}const be=gt(pe);be.setAttribute("iA",new y.InstancedBufferAttribute(Ue,4)),be.setAttribute("iB",new y.InstancedBufferAttribute(Ke,4)),be.setAttribute("iC",new y.InstancedBufferAttribute(Re,3));const Te=new y.Mesh(be,le(pt,vt,y.DoubleSide));Te.name="shavings",Te.frustumCulled=!1,Y.add(Te),await e.yield();const Se=Math.round(900*p),Ve=new Float32Array(Se*4);for(let o=0;o<Se;o++){const A=a.range(0,6.2832),k=150*Math.sqrt(a());Ve.set([Math.sin(A)*k,a.range(0,78),Math.cos(A)*k,a()],o*4)}const ve=new y.InstancedBufferGeometry;ve.setAttribute("position",new y.Float32BufferAttribute([0,1,0,-1,.2,0,1,.2,0,0,-1,0],3)),ve.setIndex([0,1,2,2,1,3]),ve.setAttribute("iP",new y.InstancedBufferAttribute(Ve,4)),ve.instanceCount=Se;const Me=new y.Mesh(ve,le(wt,yt,y.DoubleSide));Me.name="rain",Me.frustumCulled=!1,Me.visible=t.rain!==!1,Y.add(Me);const O=(o,A,k)=>new y.Vector3(o,A,k),ze=O(...ne),Ce=O(0,ge,0),Z=o=>Ce.clone().addScaledVector(ze,o),qe={position:Z(He),normal:ze.clone().negate()},Xe=Z(7),Pe=[];for(let o=5;o<9;o++)Pe.push(O(0,n[o].y+8+(o===5?1:0),n[o].r+(o===5?9:2)));Pe.push(Z(-22),Z(-8),Ce.clone(),Z(30),Z(He));let se=i[0];for(const o of i)Math.abs(Math.sin((o.azimuth-2.2)/2))<Math.abs(Math.sin((se.azimuth-2.2)/2))&&(se=o);const _e=O(Math.sin(se.azimuth),0,Math.cos(se.azimuth));let je=null;if(b>=0){const o=i.find(T=>T.canopy),A=(R+1)*(K+1);let k=99,j=-99;for(let T=b;T<b+2*A;T++){const D=Math.hypot(r.pos[T*3],r.pos[T*3+2]);D>40&&D<47&&Math.abs((T-b)%(R+1)-R/2)<R*.375&&(k=Math.min(k,r.pos[T*3+1]))}for(let T=0;T<r.pos.length/3;T++){if(r.dat[T*4]!==4)continue;const D=r.pos[T*3],B=r.pos[T*3+2],G=Math.hypot(D,B);if(G<39||G>49)continue;const P=Math.atan2(D,B)-o.azimuth;Math.abs(Math.atan2(Math.sin(P),Math.cos(P)))<.5&&(j=Math.max(j,r.pos[T*3+1]))}je={azimuth:o.azimuth,lip:o.lip.clone(),under:k,floor:j}}const $e={portalSeat:qe,wellAxis:{mouth:Ce,dir:ze},chamberFloor:Z(ue),flyThrough:Pe,underPetal:{position:se.lip.clone().addScaledVector(_e,1).add(O(0,-6,0)),look:O(_e.z,0,-_e.x),lip:se.lip.clone()},tierSix:i.map(o=>({lip:o.lip.clone(),azimuth:o.azimuth,canopy:o.canopy})),tierLips:n.map(o=>({r:o.r,y:o.y})),canopy:je,viewpoints:{flank:O(104,14,0),crown:O(0,62,40),bridgeSide:O(0,9,200)},tierU:Be.slice(),waterY:0,topY:ke,keyDir:s.clone()};let Le=null;const Qe=new y.Vector3,Ze=new y.Vector3;function De(o,A){if(Y.updateWorldMatrix(!0,!1),H.uTime.value=A,H.uTop.value=Qe.setFromMatrixPosition(Y.matrixWorld).y+ke,H.uPortal.value.copy(qe.position).applyMatrix4(Y.matrixWorld),H.uMouth.value.copy(Xe).applyMatrix4(Y.matrixWorld),H.uKey.value.copy(Ze.copy(s).transformDirection(Y.matrixWorld)),Le===null){const k=A%46/46;H.uProg.value=k<.84?.27+k/.84*.64:.91-X(.84,1,k)*.64}else H.uProg.value=Le}return De(0,0),{object:Y,radius:92,height:ke,center:O(0,22,0),anchors:$e,update:De,uniforms:H,setProgress(o){Le=o},setKey(o){s.copy(o).normalize()},parts:We,dispose(){},ground:!1,groundY:0}}export{vt as CURL_FRAG,At as PETAL_GRID,et as STACK,kt as buildHero,de as typed};
