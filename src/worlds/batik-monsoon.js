import*as n from"three";import{makePath as ia,clamp as $,lerp as B,smoothstep as O}from"../kit/core.js";import{makeGlows as Mo}from"../kit/fx.js";import{buildHero as la,shiftAt as Ao,BATIK_GLSL as et,BATIK_FADE_GLSL as tt}from"../parts/batik-monsoon.js";const G=Math.PI*2,_e=36,Et=Math.SQRT1_2,Wt=Math.SQRT1_2,zo=Math.SQRT1_2,So=-Math.SQRT1_2,ko=6,Vo={day:{title:"Mega Mendung",ground:"#7A5A48",outline:0,portal:"#F4E3B0",lamps:0,post:{exposure:1,sat:1.07,con:1.05,tint:"#ffffff",shadow:"#05040a",vig:.2}},golden:{title:"Mega Mendung: Bang-Bangan",ground:"#78603E",outline:0,portal:"#FFE9B8",lamps:0,post:{exposure:.98,sat:.8,con:1.04,tint:"#fff6ee",shadow:"#0a0204",vig:.24}},night:{title:"Mega Mendung: Wedelan",ground:"#674B31",outline:1,portal:"#F4E3B0",lamps:1,post:{exposure:1.12,sat:1.1,con:1.04,tint:"#f2f4ff",shadow:"#02030a",vig:.3}},dawn:{title:"Mega Mendung: Pesisir",ground:"#7A5A48",outline:0,portal:"#FFF0C8",lamps:0,post:{exposure:1,sat:1.08,con:1.04,tint:"#fff1ec",shadow:"#0a0610",vig:.2}}};function ca(a,h){return Vo[a]?a:h<.2?"night":h<.42?"dawn":h<.62?"golden":"day"}const ot=`
#ifdef USE_FOG
varying float vFogDepth;
#endif
`,To=`
uniform vec2 uOrigin; uniform float uMarch, uW, uAmp, uFadeR, uYOff; uniform vec3 uCamW;
varying vec3 vPp; varying vec3 vW;
${ot}
void main(){
  vec2 pp = position.xz + uOrigin;                    // pattern space: x along the band, y across it
  float c = pp.y + uMarch;
  vec3 w = vec3(pp.x*${zo.toFixed(6)} + c*${Et.toFixed(6)}, 0., pp.x*(${So.toFixed(6)}) + c*${Wt.toFixed(6)});
  // THE SWELL: a rounded crest on the dot-foam row (v = 8/9) with a smooth leading face three cells long. (It was a
  // sawtooth whose two-metre cliff, looked along end-on where the bands run straight away from the lens, cut the
  // pattern like a seam: there is now no slope over about 17 degrees and no crease.)
  float f = fract(pp.y/uW - .2222222);
  // (its short face, which carries the gold zigzag, is one straight ramp: no fold lies under the zigzag)
  float tooth = f < .6666667 ? .5 - .5*cos(f*4.712389) : 3. - 3.*f;
  float k = 1. - smoothstep(uFadeR*.5, uFadeR*.9, distance(w.xz, uCamW.xz));
  // NO SEAM: where the lens looks straight along the bands a swell is seen end-on, in profile, and its face reads as a
  // fold that offsets the stripes. In that narrow wedge (3 to 19 degrees either side of the band line through the
  // camera) the swell is eased flat; the pattern itself has no wrap, tile or snap to show (the grid re-snaps by whole
  // cells of pattern space).
  vec2 sv = w.xz - uCamW.xz;
  k *= smoothstep(.06, .32, abs(sv.x + sv.y)*.7071068/max(length(sv), 1e-3));
  w.y = uAmp*tooth*k + uYOff;      // (uYOff: the flat floor under the sea is this same shader with no swell, 2.4 m down)
  vPp = vec3(pp.x, 0., pp.y); vW = w;
  vec4 mv = viewMatrix*vec4(w, 1.);
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix*mv;
}`,Fo=`
${et}
${tt}
uniform float uW, uShelf, uOutline, uDotT; uniform vec3 uGround, uCamW; uniform vec4 uBoat[4]; uniform vec3 uOff[6];
varying vec3 vPp; varying vec3 vW;
// the area of a stripe of half-width hw (centred on .5 of every band) to the left of x: its difference over one
// pixel's span of the band coordinate is that pixel's exact share of the stripe (a box filter)
float seaStripe(float x, float hw){ return floor(x)*2.*hw + clamp(fract(x) - (.5 - hw), 0., 2.*hw); }
void main(){
  float px = max(max(length(dFdx(vW.xz)), length(dFdy(vW.xz))), 1e-4);
  float pw = px/uW;
  float q = vPp.z/uW, band = floor(q), v = fract(q), a = vPp.x/uW;
  // THE BAND EDGE: how far the band coordinate itself moves across one pixel (not the pixel's longest footprint, which
  // at a grazing angle is metres long ALONG the line of sight): edges are measured with these two, so a band's edge
  // is one pixel wide on screen at any angle and any distance
  float fq = max(fwidth(vPp.z)/uW, 1e-5), fa = max(fwidth(vPp.x)/uW, 1e-5);
  // crackle, and the overdye that wicks south from under the shelf as a band about 60 m deep in which cells stand in
  // three stages at once: veins run ahead as ink lines (vs), then a cell takes a half-wash from its veins inward
  // (hwash), then the ink wash follows the same way (od). r runs 0 -> 1.6 over 80 m, offset +-20 m by the cell.
  float vd, ch; float vein = bkVeins(vPp, px, 14., vd, ch);
  float r = (uShelf - vW.z)/50. + (ch - .5)*.8;
  float vs = smoothstep(-.5, 0., r)*vein;
  float hwash = smoothstep(vd - .12, vd + .02, r*1.6);
  float od = smoothstep(vd - .12, vd + .02, r - .6);
  float kf = mix(1., .85, od);
  // GRAZING FADE: motif drawn on a plane seen at a low angle smears into long streaks, so the blades, lozenges and
  // filler are kept only where the sea is seen from more than about 10 degrees above it (within 3-6 camera heights);
  // further out the bands calm to their two flat tones, which is all a squashed motif can honestly show
  float sinEl = (uCamW.y - vW.y)/max(distance(uCamW, vW), 1.);
  float graze = smoothstep(.075, .19, sinEl);
  // the S-blades themselves only where the sea is looked down on from well above the motif's own size (the climb and
  // after); from the low opening the sea is drawn as plain bands with round filler, which a low angle cannot smear
  float kb = (1. - smoothstep(.085*kf, .24*kf, pw))*smoothstep(.2, .4, sinEl)*smoothstep(1.2, 2.5, uCamW.y/uW);   // (later than it was: on a tall screen the wider lens saw them half-drawn from 0.7 band widths up)
  // THE TROUGH ROW: ONE gold wax zigzag, a triangle wave about the row's centre line, drawn in row coordinates that
  // are continuous right across the row. (The row straddles the line between two bands; it used to take its phase
  // from floor(q), which changes on that very line, so its two halves were drawn half a period apart: half-lozenges
  // cut flat along the centre, and seen end-on a dark sliver with a zigzag on each side that did not meet. THAT was
  // the sea seam. The row now has its own index, floor(q + .5), which is constant across it.)
  // Its amplitude eases to nothing where a pixel spans too much of the band to hold a tooth (far off, or looking
  // along the bands), so the zigzag runs out to the horizon as one straight gold thread; the line is box-filtered
  // over the pixel like the stripes. The dark soga lozenges are small diamonds nested in the teeth, alternately
  // either side, with their edges parallel to the line; they are drawn only where the sea is looked down on (the climb).
  float rowB = floor(q + .5), nb = q - rowB;
  float ph = a*2. + .5*mod(rowB, 2.);
  float m = fract(ph) - .5, m2 = fract(ph + .5) - .5;
  float zA = .06*(1. - smoothstep(.035, .11, fa))*(1. - smoothstep(.03, .075, fq));
  float zd = abs(nb - zA*(4.*abs(m) - 1.)), zp = fq + 8.*zA*fa + 1e-4;
  float zig = clamp((.016 - zd)/zp + .5, 0., min(1., .032/zp));
  float zpool = clamp((.034 - zd)/zp + .5, 0., 1.)*(1. - smoothstep(.02, .05, zp)) - zig;
  float lzE = (.48*fa + fq)*.6 + .002;
  float lozIn = 1. - smoothstep(.054 - lzE, .054 + lzE, min(abs(m2)*.24 + abs(nb + .034), abs(m)*.24 + abs(nb - .034)));
  float lozGate = smoothstep(.2, .4, sinEl)*smoothstep(1.2, 2.5, uCamW.y/uW)*(1. - smoothstep(.3, .7, lzE/.054))*smoothstep(.045, .059, zA);
  // the blades: slanted S-curved cream knives with a soga spine
  float w = (v - .5)/.36;
  float zone = 1. - smoothstep(1. - pw*3., 1. + pw*3., abs(w));
  float s = a*1.25 - .5*w + .31*band;
  float f = fract(s) - .5, c0 = .17*sin(w*2.3), hw = .3*(1. - .5*w*w);
  float d = abs(f - c0) - hw;
  float e2 = pw*1.6 + .004;
  // metre-scale filler for the widest sea (parang barong, 30 m bands): rows of resist dots 1.2 m apart tracing every
  // blade (four rows on the ground side, one inside), so there is fine work near the lens whatever the band width
  float dm = min(d, min(abs(f - c0 - 1.), abs(f - c0 + 1.)) - hw)*uW*.8, rr = abs(dm);
  float rowI = floor((rr - .4)/1.2), rowF = (fract((rr - .4)/1.2) - .5)*1.2;
  float gz = (fract(vPp.z/1.2 + .5*mod(rowI, 2.)) - .5)*1.2;
  float fil = (1. - smoothstep(.2 - min(px, .2), .2 + px, length(vec2(gz, rowF))))*smoothstep(21., 28., uW)*(1. - smoothstep(.1, .28, px))*graze
    *step(.4, rr)*step(rr, dm > 0. ? 5.8 : 1.7);
  float blade = 1. - smoothstep(-e2, e2, d);
  blade *= mix(1., smoothstep(-.085 - e2, -.085 + e2, d), uOutline);
  float sp = (1. - smoothstep(.024, .024 + e2, abs(f - c0)))*(1. - smoothstep(.45, .7, abs(w)))*(1. - uOutline);
  float eye = 1. - smoothstep(.05, .05 + e2, length(vec2(f - c0 - .11, (w - .62)*.36)));
  float inner = (1. - smoothstep(.011, .011 + e2, abs(d + .085)))*(1. - uOutline);
  float cream = mix(blade*(1. - max(max(sp, eye), inner)), step(0., dm), fil*.9)*zone;
  // THE BANDS AS SEEN FROM LOW DOWN: one cream stripe a quarter of the width with a row of soga dots down its middle,
  // soga flanks each with a row of cream dots, the lozenge row (gold wax zigzag) in the trough, dot foam on the crest:
  // a brown sea with cream drawn on it
  // CRISP BANDS: each cream stripe is box-filtered over the pixel's own span of the band coordinate, so it has a hard
  // one-pixel edge near and far, stays a distinct stripe as it recedes, and settles by itself to the mean of the two
  // flat tones (a fifth cream) where several bands share a pixel at the horizon. Beside each edge the soga is drawn
  // one step darker in a band half a metre wide (dye pooled against the wax), so the stripe reads as drawn, not washed.
  float x0 = v - .5*fq, x1 = v + .5*fq, pw2 = max(.5/uW, .022);
  float bandC = clamp((seaStripe(x1, .125) - seaStripe(x0, .125))/fq, 0., 1.);
  float poolC = clamp((seaStripe(x1, .125 + pw2) - seaStripe(x0, .125 + pw2))/fq - bandC, 0., 1.);
  float tone = bandC*.8;
  float ir = .024*uW, dotK = 1. - smoothstep(.5, 1.6, px/ir);
  float dS = length(vec2((fract(a*6. + .25*band) - .5)*uW/6., (v - .5)*uW));
  float dC = length(vec2((fract(a*6. + .5 + .25*band) - .5)*uW/6., min(abs(v - .27), abs(v - .73))*uW));
  float sogaDot = (1. - smoothstep(ir - min(px, ir), ir + px, dS))*dotK;
  float creamDot = (1. - smoothstep(ir*.8 - min(px, ir*.8), ir*.8 + px, dC))*dotK;
  float flatP = max(tone*(1. - .85*sogaDot), creamDot*.9);
  float creamAmt = mix(flatP, cream, kb);
  float indAmt = lozIn*lozGate;
  // white dot foam streaming along the crest row
  float am = vPp.x*.7 + uDotT*(1. + .3*sin(band*2.1)) + band*.37;
  vec2 dg = vec2((fract(am) - .5)/.7, (v - .885)*uW);
  float keep = step(.28, bkHash3(vec3(floor(am), band, 1.)).x);
  float dr = .016*uW + .1;
  float dots = (1. - smoothstep(dr - px, dr + px, length(dg)))*keep*(1. - smoothstep(.25, .8, px));
  // hulls: a ring of white dots breathing round each boat (they lie hove-to: no wake)
  float foam = 0.;
  for(int i = 0; i < 4; i++){
    vec4 b = uBoat[i]; vec2 dl = vW.xz - b.xy; float cs = cos(b.z), sn = sin(b.z);
    vec2 l = vec2(dl.x*cs - dl.y*sn, dl.x*sn + dl.y*cs);
    float rl = length(l/vec2(3.5, 5.7)), rw = .5 + .5*sin(uTime*.9 + b.z*7.);
    float ring = max(1. - smoothstep(.1, .2, abs(rl - 1.)), (1. - smoothstep(.06, .13, abs(rl - 1.32 - .1*rw)))*(.9 - .5*rw));
    vec2 g = fract(l/.95) - .5;
    float rd = 1. - smoothstep(.27 - px, .27 + px, length(g)*.95);
    // the slick each hove-to hull leaves down-swell: two spreading rows of dots that thin out over 16 m
    float dt = (dl.x + dl.y)*.7071068, ds = (dl.x - dl.y)*.7071068, kt = clamp((dt - 8.)/16., 0., 1.);
    vec2 sg = vec2(abs(ds) - (.7 + .09*(dt - 8.)), (fract(dt/1.5 - uTime*.35) - .5)*1.5);
    float sr = .3*(1. - .75*kt);
    foam = max(foam, (1. - smoothstep(sr - min(px, sr), sr + px, length(sg)))*step(8., dt)*step(dt, 24.)*b.w*.9);
    foam = max(foam, ring*rd*b.w);
  }
  // floating offerings (uOff = x, z, phase): each rides in two breathing rings of small dots
  for(int i = 0; i < 6; i++){
    vec2 dl = vW.xz - uOff[i].xy; float rl = length(dl), rw = .5 + .5*sin(uTime*1.1 + uOff[i].z);
    float ring = max(1. - smoothstep(.16, .3, abs(rl - 1.7)), (1. - smoothstep(.12, .24, abs(rl - 2.7 - .35*rw)))*(.9 - .5*rw));
    vec2 g = fract(dl/.6) - .5;
    foam = max(foam, ring*(1. - smoothstep(.2 - min(px, .2), .2 + px, length(g)*.6)));
  }
  foam *= 1. - smoothstep(.2, .6, px);
  // SOGA AND CREAM, never navy: the overdye over soga is a near-black brown, the cream under it a washed tan, and the
  // trough row is dark soga lozenges outlined in the gold wax line
  creamAmt *= 1. - od*.28; dots *= 1. - .35*od;
  vec3 deep = mix(uOverdye, uGround, .2);
  vec3 ground = mix(mix(uGround, uGround*.72, hwash), deep, od);
  vec3 col = ground*(1. - .16*(1. - smoothstep(0., .07, d))*zone*step(0., d)*kb)*(1. - .42*poolC*(1. - kb));
  col = mix(col, ground*.55, vein*.8);
  col = mix(col, uOverdye, vs*.85*(1. - od));
  col = mix(col, mix(uGround*.36, uOverdye*.7, od), indAmt);
  vec3 cr = mix(mix(uLine, mix(uLine, uGround, .22), hwash), mix(uLine, uGround, .4), od); cr = mix(cr, mix(cr, uGround, .4), vein*.7);
  cr *= mix(vec3(1.), vec3(.94, .78, .56), uOutline);       // on the night cloth the bands are tan, never grey
  col = mix(col, cr, creamAmt);
  col *= 1. - .3*max(zpool, 0.);
  col = mix(col, bkGild(uGold*.85, vW), zig*(1. - .35*od));
  col = mix(col, mix(uLine*1.05, mix(uLine, uGround, .3), .6*od), max(dots, foam));
  col *= bkCloth(vPp, px);
  #ifdef USE_FOG
  col = bkFade(col, vFogDepth);
  col = mix(col, uCloth, smoothstep(3300., 4600., vFogDepth));
  #endif
  gl_FragColor = vec4(col, 1.);
}`,ha=`
attribute vec4 aDat; attribute vec2 aAni; attribute vec2 aBoat;
uniform float uTime;
varying vec4 vC; varying vec3 vP; varying vec3 vW;
${ot}
void main(){
  vec3 p = position; float ph = aBoat.x;
  vP = p + vec3(ph*37., ph*11., ph*23.);
  p.z += aAni.x*(.22*sin(uTime*1.7 + ph) + .09*sin(uTime*4.3 + p.y*1.3 + ph));
  p.x += aAni.y*sin(uTime*8. - aAni.y*5. + ph)*.3; p.y += aAni.y*sin(uTime*6.3 - aAni.y*4. + ph)*.12;
  vec4 w = instanceMatrix*vec4(p, 1.);
  vC = aDat; vW = w.xyz;
  vec4 mv = viewMatrix*w;
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix*mv;
}`,fa=`
${et}
${tt}
uniform vec3 uMadder, uSail, uSailLine; uniform float uShelf, uMotif, uLamp;   // (uSail cream, uSailLine madder: the stripe, the dots and the rim)
varying vec4 vC; varying vec3 vP; varying vec3 vW;
void main(){
  float px = max(max(length(dFdx(vP)), length(dFdy(vP))), 1e-4);
  float fu = fwidth(vC.y), fv = fwidth(vC.z), fe = fwidth(vC.w);
  float id = floor(vC.x + .5), u = vC.y, v = vC.z, e = vC.w;
  vec3 col = uRamp[0], lineCol = uLine; float line = 0., keepCream = 0.;
  if(id < .5){
    col = mix(uRamp[0], uMadder, smoothstep(.8 - fv, .8 + fv, v));
    line = 1. - smoothstep(.05, .05 + fv, abs(v - .72));
    float kd = length(vec2((fract(u*1.5) - .5)/1.5, (v - .42)*.8));
    line = max(line, (1. - smoothstep(.1 - px, .1 + px, kd))*(1. - smoothstep(.05, .12, px)));
  } else if(id < 1.5){
    col = uLine; keepCream = 1.; lineCol = uSoga;
    vec2 g = fract(vec2(u, v)*3.2) - .5;
    line = (1. - smoothstep(.065 - px, .065 + px, length(g)/3.2))*(1. - smoothstep(.03, .08, px));
  } else if(id < 2.5){
    col = uSail; lineCol = uSailLine;
    float aa = max(fu*5., fv*8.);
    vec2 g = fract(vec2(u*5., v*8. + .5*floor(u*5.))) - .5;
    float fil = (1. - smoothstep(.15 - aa, .15 + aa, length(g)))*(1. - smoothstep(.12, .3, aa));
    float sb = 1. - smoothstep(.075 - fv, .075 + fv, abs(v - .55));
    float mo = uMotif < .5 ? step(.5, fract(u*7. + v*11.)) : (uMotif < 1.5 ? step(.3, length(fract(vec2(u*9., v*14.)) - .5)) : step(.03, abs(v - .55)));
    mo = mix(1., mo, 1. - smoothstep(.1, .25, aa));
    float rim = 1. - smoothstep(.13, .13 + max(fe, .02), e);
    line = max(max(fil*.9*(1. - sb), sb*mo), rim);
    float gl = (1. - smoothstep(.014, .014 + fv, abs(abs(v - .55) - .112)))*(1. - smoothstep(.02, .06, fv));
    col = mix(col, uGold*.9, gl); line *= 1. - gl;
  } else if(id < 3.5){ col = uSoga*.45;
  } else if(id < 4.5){ col = uMadder;
  } else if(id < 5.5){ col = uLine; keepCream = 1.; lineCol = uSoga; line = 1. - smoothstep(.07, .07 + fv, abs(fract(v*2.5) - .5));
  } else if(id < 6.5){ col = mix(uSoga, uGold*3., uLamp); keepCream = uLamp;
  } else { col = uGold*.9; keepCream = 1.; }
  float vd, ch; float vein = bkVeins(vP, px, 14., vd, ch);
  col = mix(col, col*.6, vein*.7);
  col = mix(col, lineCol, line);
  float od = smoothstep(0., 36., uShelf - vW.z)*.8*(1. - .7*keepCream);
  col = mix(col, uOverdye + col*.3, od);
  col *= bkCloth(vP, px);
  #ifdef USE_FOG
  col = bkFade(col, vFogDepth);
  #endif
  gl_FragColor = vec4(col, 1.);
}`,da=`
attribute vec4 aDat; attribute vec2 aAni; attribute vec2 aBird;
uniform float uTime;
varying float vId;
${ot}
void main(){
  vec3 p = position;
  float ph = fract(uTime*.31 + aBird.x);
  float fl = ph < .4 ? sin(ph*31.416)*sin(ph*7.854) : 0.;
  float s = aAni.x, sd = aAni.y;
  if(abs(sd) > .5){
    float t1 = .3 + .7*fl + .05*sin(uTime*1.3 + aBird.x*40.), t2 = t1 - .6 - .55*fl;
    float s1 = min(s, .48), s2 = max(s - .48, 0.);
    p.x = sd*(cos(t1)*s1 + cos(t2)*s2); p.y += sin(t1)*s1 + sin(t2)*s2;
  }
  vId = aDat.x;
  vec4 mv = viewMatrix*(instanceMatrix*vec4(p, 1.));
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix*mv;
}`,ua=`
${et}
${tt}
uniform vec3 uBody, uRim, uBelly, uThroat;
varying float vId;
void main(){
  float id = floor(vId + .5);
  vec3 col = id < .5 ? uBody : (id < 1.5 ? uRim : (id < 2.5 ? uBelly : uThroat));
  #ifdef USE_FOG
  col = bkFade(col, vFogDepth);
  #endif
  gl_FragColor = vec4(col, 1.);
}`,pa=`
attribute vec4 aS;
varying vec2 vQ; varying vec4 vS; varying float vDist; varying vec3 vWp;
${ot}
void main(){
  vQ = vec2((uv.x - .5)*aS.x, uv.y*aS.y); vS = aS;
  vec4 wp = instanceMatrix*vec4(position, 1.);
  vWp = wp.xyz;                                                     // where the stroke stands in the world
  vec4 mv = viewMatrix*wp;
  vDist = length(mv.xyz);
  #ifdef USE_FOG
  vFogDepth = -mv.z;
  #endif
  gl_Position = projectionMatrix*mv;
}`,ma=`
${et}
${tt}
uniform float uSheetA; uniform vec4 uTubeA; uniform vec3 uTubeB;
varying vec2 vQ; varying vec4 vS; varying float vDist; varying vec3 vWp;
void main(){
  float px = max(max(length(dFdx(vQ)), length(dFdy(vQ))), 1e-4);
  float bw = vS.z, lw = bw*.5;
  float q = (vQ.x + vQ.y*.364)/bw, band = floor(q), bf = fract(q);
  vec3 hh = bkHash3(vec3(band, vS.w*17., 3.));
  float lane = floor(bf*2.), lf = (fract(bf*2.) - .5)*lw;
  float lng = step(vS.y, 80.);                          // the sheets under the shelf (seen from afar) carry longer strokes
  float per = mix(24. + 14.*hh.x, 62. + 40.*hh.x, lng);  // canyon sheets: 11-17 m of each 24-38 m period drawn (in five lengths); under the shelf 53-87 m
  float sy = (vQ.y + uTime*25.*(.7 + .5*hh.y))/per + lane*.37 + hh.z;
  float res = 1. - smoothstep(.05, .16, px/lw);            // far sheets are one flat pale wash, never a barcode
  float bare = step(.34, hh.z);                         // a third of the bands are left bare
  // strokes are never wider than 3 px on screen, and the canyon sheets (the ones we fly through) draw under half of
  // each period, cut again into short lengths: thin broken dashes near the lens, never a bar across the frame
  float wd = min(max(.09, px*.8), px*1.5), on = step(mix(.55, .15, lng), fract(sy))*mix(step(.24, fract(sy*5.)), 1., lng)*bare;   // canyon sheets: under half of each period, cut again into short lengths
  float core = (1. - smoothstep(wd, wd + px, abs(lf)))*on;
  float halo = (1. - smoothstep(wd*2.4, wd*2.4 + px, abs(lf)))*on;
  if(hh.x > .75){
    float dd = length(vec2(lf, (fract(sy*10.) - .5)*per/10.)), rr = max(.2, px*.9);
    core = (1. - smoothstep(rr, rr + px, dd))*bare; halo = (1. - smoothstep(rr*1.8, rr*1.8 + px, dd))*bare;
  }
  float wash = 0.;
  float ink = core;
  float a = mix(.1, max(max(ink, halo*.45), wash), res)*(1. - .45*smoothstep(120., 420., vDist));
  vec3 col = mix(uRamp[4], uLine, ink*res);
  // THE RAIN THINS OVER THE GREAT CURL'S APPROACH, in the world: a stroke is drawn at a quarter strength by its own
  // distance in metres from the line that runs from the canyon's end (uTubeA.xyz) to the great curl's mouth (uTubeB),
  // inside a tube of the rim's radius (uTubeA.w) round that line, easing back to full just outside it. The same
  // stroke is thinned alike from every eye.
  vec3 tb = uTubeB - uTubeA.xyz;
  float clearW = mix(.25, 1., smoothstep(uTubeA.w*.8, uTubeA.w*1.25, distance(vWp, uTubeA.xyz + tb*clamp(dot(vWp - uTubeA.xyz, tb)/dot(tb, tb), 0., 1.))));
  float ex = min(vQ.x + vS.x*.5, vS.x*.5 - vQ.x), ey = min(vQ.y, vS.y - vQ.y);
  a *= smoothstep(0., vS.x*.22, ex)*smoothstep(0., vS.y*.2, ey)*smoothstep(10., 40., vDist)*uSheetA*clearW;
  #ifdef USE_FOG
  col = bkFade(col, vFogDepth);
  #endif
  gl_FragColor = vec4(col, a);
}`,va=`
attribute vec3 aOff; attribute float aR;
uniform float uTime, uPix, uRain; uniform vec3 uCamW; uniform vec4 uTubeA; uniform vec3 uTubeB;
varying vec2 vUv; varying float vA;
void main(){
  vec3 box = vec3(46., 38., 46.), dir = vec3(.342, -.94, 0.);
  vec3 c = aOff*box + dir*(uTime*25.*(.8 + .4*aR));
  c = uCamW + mod(c - uCamW, box) - box*.5;
  vec4 mc = viewMatrix*vec4(c, 1.);
  vec3 dv = mat3(viewMatrix)*dir;
  vec2 d2 = dv.xy; float l = length(d2); d2 = l > 1e-4 ? d2/l : vec2(0., 1.);
  float dist = max(-mc.z, .1);
  float hw = max(.03, dist*uPix*.75);
  vec3 pv = mc.xyz + dv*(position.y*.9*(1. + .5*aR)) + vec3(-d2.y, d2.x, 0.)*(position.x*hw*3.);     // 0.9-1.35 m long
  vUv = position.xy*2.;
  vA = .9*uRain*smoothstep(3., 6., dist)*(1. - smoothstep(15., 22., dist))*clamp(.05/hw, .4, 1.);
  // thinned to a quarter by the dash's own distance in metres from the line from the canyon's end to the great
  // curl's mouth (see the sheets: THE RAIN THINS)
  vec3 tb = uTubeB - uTubeA.xyz;
  vA *= mix(.25, 1., smoothstep(uTubeA.w*.8, uTubeA.w*1.25, distance(c, uTubeA.xyz + tb*clamp(dot(c - uTubeA.xyz, tb)/dot(tb, tb), 0., 1.))));
  gl_Position = projectionMatrix*vec4(pv, 1.);
}`,wa=`
uniform vec3 uCream, uEdge;
varying vec2 vUv; varying float vA;
void main(){
  vec3 col = mix(uCream, uEdge, smoothstep(.5, .7, abs(vUv.x)));
  gl_FragColor = vec4(col, vA*(1. - smoothstep(.8, 1., abs(vUv.y))));
}`;function Dt(){const a=[],h=[],z=[],m=(p,M)=>{a.push(p[0],p[1],p[2]),h.push(M,p[3]||0,p[4]||0,p[5]===void 0?9:p[5]),z.push(p[6]||0,p[7]||0)},l=(p,M,A,C)=>{m(p,C),m(M,C),m(A,C)},b=(p,M,A,C,w)=>{l(p,M,A,w),l(p,A,C,w)},s=(p,M,A=!0)=>{for(let C=0;C<p.length-1;C++){const w=p[C],N=p[C+1],Y=w.length;for(let R=0;R<(A?Y:Y-1);R++){const Z=(R+1)%Y;b(w[R],w[Z],N[Z],N[R],typeof M=="function"?M(C,R):M)}}},f=new n.Vector3,c=new n.Vector3,y=new n.Vector3,v=new n.Vector3;return{tri:l,quad:b,loft:s,tube:(p,M,A,C,w=null)=>{const N=[];let Y=0;for(let R=0;R<p.length;R++){const Z=p[Math.max(R-1,0)],ie=p[Math.min(R+1,p.length-1)],J=p[R],fe=R/(p.length-1);R&&(Y+=Math.hypot(J[0]-p[R-1][0],J[1]-p[R-1][1],J[2]-p[R-1][2])),f.set(ie[0]-Z[0],ie[1]-Z[1],ie[2]-Z[2]).normalize(),v.set(0,1,0),Math.abs(f.y)>.9&&v.set(1,0,0),c.crossVectors(v,f).normalize(),y.crossVectors(f,c);const Se=typeof M=="function"?M(fe):M,de=[];for(let K=0;K<A;K++){const qe=K/A*G+.5,le=Math.cos(qe)*Se,ke=Math.sin(qe)*Se;de.push([J[0]+c.x*le+y.x*ke,J[1]+c.y*le+y.y*ke,J[2]+c.z*le+y.z*ke,Y,K/A,9,0,w?w(fe):0])}N.push(de)}s(N,C,!0)},build:()=>{const p=new n.BufferGeometry;return p.setAttribute("position",new n.Float32BufferAttribute(a,3)),p.setAttribute("aDat",new n.Float32BufferAttribute(h,4)),p.setAttribute("aAni",new n.Float32BufferAttribute(z,2)),p},tris:()=>a.length/9}}const Bo=(a,h,z)=>m=>{const l=1-m;return[l*l*a[0]+2*m*l*h[0]+m*m*z[0],l*l*a[1]+2*m*l*h[1]+m*m*z[1],l*l*a[2]+2*m*l*h[2]+m*m*z[2]]},at=(a,h)=>{const z=[];for(let m=0;m<=h;m++)z.push(a(m/h));return z};function ga(a,h,z,m,l,b){const s=[],f=[];for(const c of[-1,-.86,-.62,-.32,0,.32,.62,.86,1]){const y=c*h,v=Math.abs(c),V=z*Math.pow(Math.max(1-v*v*.94,.01),.6),E=-m*.4+l*v*v*v,p=m*.6+b*Math.pow(v,2.6),M=B(E,p,.42);s.push([[-V,p,y,y,1],[-V*.84,M,y,y,.5],[0,E,y,y,0],[V*.84,M,y,y,.5],[V,p,y,y,1]]),f.push([[-V,p-.07,y],[V,p-.07,y]])}a.loft(s,0,!1),a.loft(f,3,!1)}function ba(a,h,z,m,l,b,s,f,c){const y=(v,V)=>{const E=v*(1-b*Math.sin(Math.PI*V)),p=h(E),M=z(E),A=Math.sin(Math.PI*V)*Math.pow(v,.8),C=s*A,w=Math.hypot(M[0]-p[0],M[1]-p[1],M[2]-p[2]);return[B(p[0],M[0],V)+f[0]*C,B(p[1],M[1],V)+f[1]*C,B(p[2],M[2],V)+f[2]*C,V,v,Math.min(Math.min(V,1-V)*w,(1-v)*c),A,0]};for(let v=0;v<m;v++)for(let V=0;V<l;V++)a.quad(y(v/m,V/l),y((v+1)/m,V/l),y((v+1)/m,(V+1)/l),y(v/m,(V+1)/l),2)}function Co(a,h,z,m,l){const b=(f,c,y,v)=>{const V=[];for(let E=0;E<6;E++){const p=E/6*G;V.push([h+Math.cos(p)*c*l,z+f*l,m+Math.sin(p)*y*l,E/6*1.2,v])}return V};a.loft([b(0,.24,.22,0),b(.35,.22,.16,.35),b(.72,.27,.15,.72),b(.9,.1,.09,.9),b(1,.13,.13,1),b(1.16,.11,.11,1.16)],1,!0);const s=[h,z+1.42*l,m,0,0];for(let f=0;f<8;f++){const c=f/8*G,y=(f+1)/8*G;a.tri(s,[h+Math.cos(c)*.42*l,z+1.14*l,m+Math.sin(c)*.42*l,0,1],[h+Math.cos(y)*.42*l,z+1.14*l,m+Math.sin(y)*.42*l,0,1],5)}a.tube([[h-.25*l,z+.68*l,m],[h-.42*l,z+.45*l,m+.18*l],[h-.36*l,z+.3*l,m+.42*l]],.055*l,4,1),a.tube([[h+.25*l,z+.68*l,m],[h+.42*l,z+.45*l,m+.18*l],[h+.36*l,z+.3*l,m+.42*l]],.055*l,4,1)}function xa(){const a=Dt();ga(a,4,.42,.7,.85,1);for(const b of[-1,1])a.tube([[0,1.15,b*3.75],[0,1.6,b*4.3],[0,2.35,b*4.6]],s=>.11*(1-s)+.02,5,0),a.tube(at(s=>{const f=B(-3.3,3.5,s),c=Math.abs(s*2-1);return[b*2.45,.1+.4*c*c*c,f]},8),s=>.16*(1-.6*Math.pow(Math.abs(s*2-1),3)),5,1),a.tube(at(s=>{const f=B(-2.45,2.45,s),c=Math.abs(f/2.45);return[f,.18+.8*(1-c*c*c*c),b>0?1.5:-1.2]},8),.06,4,3);a.tube([[0,.3,.6],[0,2.6,.62],[0,5.1,.65]],.085,5,3);const h=[0,2.3,.75],z=Bo(h,[-2.5,3.9,.9],[-2.9,7.9,.5]),m=Bo(h,[2.3,3.6,1],[2.7,6.6,.8]);a.tube(at(z,6),.06,4,3),a.tube(at(m,6),.06,4,3),ba(a,z,m,7,6,.26,.7,[0,-.1,1],5.6);const l=z(1);for(let b=0;b<5;b++){const s=b/5,f=(b+1)/5,c=.2*(1-s)+.02,y=.2*(1-f)+.02;a.quad([l[0],l[1]+c,l[2]+s*1.9,0,0,9,0,s],[l[0],l[1]-c,l[2]+s*1.9,0,0,9,0,s],[l[0],l[1]-y,l[2]+f*1.9,0,0,9,0,f],[l[0],l[1]+y,l[2]+f*1.9,0,0,9,0,f],4)}return Co(a,0,.36,-2.3,1),Co(a,0,.34,2.1,.85),a.tube([[0,2.35,4.6],[0,2.57,4.62]],b=>.13-.1*Math.abs(b-.5),5,6),a.build()}function ya(){const a=Dt(),h=.75,z=.12,m=.3,l=[[-h,z,-h,0,0],[h,z,-h,1,0],[h,z,h,1,1],[-h,z,h,0,1]],b=[[-h*1.12,m,-h*1.12,0,0],[h*1.12,m,-h*1.12,1,0],[h*1.12,m,h*1.12,1,1],[-h*1.12,m,h*1.12,0,1]];a.quad(l[0],l[1],l[2],l[3],5);for(let f=0;f<4;f++){const c=(f+1)%4;a.quad([l[f][0],l[f][1],l[f][2],f,.3],[l[c][0],l[c][1],l[c][2],f+1,.3],[b[c][0],b[c][1],b[c][2],f+1,.7],[b[f][0],b[f][1],b[f][2],f,.7],5)}const s=[0,.7,0];for(let f=0;f<8;f++){const c=f/8*G,y=(f+1)/8*G;a.tri(s,[Math.cos(c)*.5,z+.03,Math.sin(c)*.5],[Math.cos(y)*.5,z+.03,Math.sin(y)*.5],4)}a.tube([[.1,.5,.05],[.14,1.25,.08]],.035,4,3);for(const[f,c]of[[-h,-h],[h,-h],[h,h],[-h,h]])a.tube([[f*1.12,m,c*1.12],[f*1.3,m+.32,c*1.3]],y=>.07*(1-y)+.015,4,7);return a.build()}function Ma(){const a=Dt(),h=[.5,.36,.22,0,-.22,-.42],z=[.006,.03,.075,.1,.07,.02],m=[-.035,-.01,.01,0,0,.01],l=h.map((b,s)=>{const f=[];for(let c=0;c<6;c++){const y=c/6*G;f.push([Math.cos(y)*z[s],m[s]+Math.sin(y)*z[s]*.85,b])}return f});a.loft(l,(b,s)=>s===3||s===4?b===1?3:b===2||b===3?2:0:0,!0);{const b=[[.44,.012,-.03],[.38,.1,-.11],[.3,.16,-.175],[.2,.165,-.18],[.11,.115,-.135],[.05,.02,-.06]];a.loft(b.map(([s,f,c])=>{const y=[];for(let v=0;v<6;v++){const V=v/6*G;y.push([Math.cos(V)*f*.85,c+Math.sin(V)*f,s])}return y}),3,!0)}for(const b of[-1,1]){const s=(R,Z=0)=>[b*R[0],Z,R[1],0,0,9,R[0],b],f=[.04,.2],c=[.48,.36],y=[1.1,-.1],v=[.04,-.16],V=[.48,.05];a.quad(s(f,.045),s(c,.045),s(V),s(v),0),a.tri(s(c,.045),s(y,.01),s(V),0),a.quad(s(f,-.025),s(c,-.025),s(V),s(v),0),a.tri(s(c,-.025),s(y,-.01),s(V),0),a.quad(s(f,.045),s(c,.045),s(c,-.025),s(f,-.025),0),a.quad(s(c,.045),s(y,.01),s(y,-.01),s(c,-.025),0);const E=[.04,.32],p=[.5,.49],M=[1.26,-.13],A=[.04,-.28],C=[.46,-.08];a.quad(s(f),s(c),s(p),s(E),1),a.quad(s(c),s(y),s(M),s(p),1),a.quad(s(v),s(V),s(C),s(A),1),a.quad(s(V),s(y),s(M),s(C),1),a.quad(s(A),s(C),s(C,-.1),s(A,-.1),1),a.quad(s(C),s(M),s(M,-.1),s(C,-.1),1);const w=(R,Z)=>[b*R,0,Z];a.tri(w(0,-.36),w(.1,-.38),w(.22,-1.02),0),a.quad(w(.1,-.38),w(.22,-1.02),w(.32,-1.1),w(.2,-.36),1),a.quad(w(0,-.44),w(.22,-1.02),w(.2,-1.15),w(0,-.56),1);const N=[0,-.11,-.04],Y=[[0,-.095,.16],[.13,-.09,.09],[.21,-.06,-.03],[.14,-.075,-.22],[0,-.07,-.4]];for(let R=0;R<4;R++)a.tri(N,[b*Y[R][0],Y[R][1],Y[R][2]],[b*Y[R+1][0],Y[R+1][1],Y[R+1][2]],2);a.quad(s([.04,.17],-.034),s([.42,.29],-.034),s([.42,.14],-.034),s([.04,-.13],-.034),2)}return a.build()}function Ro(a,h,z,m,l){const b=z+m,s=1.8,f=(A,C)=>{const w=Math.abs(A);if(w<=z)return A*C;const N=z*C;return Math.sign(A)*(N+(l-N)*(Math.pow(s,w-z)-1)/(Math.pow(s,m)-1))},c=2*b+1,y=new Float32Array(c*c*3),v=new Float32Array(c),V=new Float32Array(c);for(let A=0;A<c;A++)v[A]=f(A-b,a),V[A]=f(A-b,h);for(let A=0;A<c;A++)for(let C=0;C<c;C++){const w=(A*c+C)*3;y[w]=v[C],y[w+2]=V[A]}const E=new Uint32Array((c-1)*(c-1)*6);let p=0;for(let A=0;A<c-1;A++)for(let C=0;C<c-1;C++){const w=A*c+C;E[p++]=w,E[p++]=w+c,E[p++]=w+1,E[p++]=w+1,E[p++]=w+c,E[p++]=w+c+1}const M=new n.BufferGeometry;return M.setAttribute("position",new n.BufferAttribute(y,3)),M.setIndex(new n.BufferAttribute(E,1)),M}const Aa=(a,h=.86)=>{const z=new n.Color(a);return new n.Vector3(z.r*h,z.g*h,z.b*h)};var Ea={id:"batik-monsoon",name:"Mega Mendung",category:"sky",weirdness:.4,media:["air","open"],async build(a){const h=a.rng,z=a.quality?.detail??1,m=a.vary||{},l=$(m.density??1,.7,1.3),b=ca(m.hour,h()),s=Vo[b],f=h.pick([{W:10,amp:.6},{W:18,amp:1.2},{W:18,amp:1.2},{W:30,amp:2}]),c=$(h()*.55+(m.mood??.5)*.45,0,1),y=h.fork("motif").int(0,2),v=h.fork("world"),V=await la(a,{colourway:b,prada:!!m.rare,farSea:!1,boltEvery:(b==="night"?2:4)*B(1.3,.7,m.mood??.5)});await a.yield();const E=V.palette,p=V.uniforms,M=V.anchors,A=new n.Scene,C=new n.Color().setRGB(E.cloth.x,E.cloth.y,E.cloth.z);A.background=C,A.fog=new n.FogExp2(C.clone(),22e-5),A.add(V.object);const w=ia(M.flyThrough),N=M.portalSeat;await a.yield();const Y=()=>n.UniformsUtils.clone(n.UniformsLib.fog),R=(e,t,o,r={})=>new n.ShaderMaterial({uniforms:{...Y(),...p,...o},vertexShader:e,fragmentShader:t,fog:!0,side:n.DoubleSide,...r}),Z={value:new n.Vector3(0,5,420)},ie=f.W,J=ie/9,fe=J*1.5,Se=60,de=Se*J,K={uOrigin:{value:new n.Vector2},uMarch:{value:0},uW:{value:ie},uAmp:{value:f.amp},uFadeR:{value:de},uYOff:{value:0},uCamW:Z,uShelf:{value:70},uOutline:{value:s.outline},uDotT:{value:0},uGround:{value:Aa(s.ground)},uBoat:{value:[new n.Vector4,new n.Vector4,new n.Vector4,new n.Vector4]},uOff:{value:[0,1,2,3,4,5].map(()=>new n.Vector3(0,-9999,0))}},qe=Ro(fe,J,Se,11,5200);await a.yield();const le=new n.Mesh(qe,R(To,Fo,K));le.frustumCulled=!1,le.name="parang-sea",A.add(le);{const e=new n.Mesh(Ro(40,40,8,9,5e3),R(To,Fo,{...K,uAmp:{value:0},uYOff:{value:-2.4}}));e.frustumCulled=!1,e.name="sea-floor",A.add(e)}const ke=e=>e-Math.floor(e),Ve=(e,t,o,r,g)=>{const x=ke((e*Et+t*Wt-ko*o)/ie-.2222222222222222),i=x<2/3?.5-.5*Math.cos(x*1.5*Math.PI):3-3*x,k=Math.max(Math.hypot(e-r,t-g),.001);return f.amp*i*(1-O(de*.5,de*.9,k))*O(.06,.32,Math.abs(e-r+t-g)*Math.SQRT1_2/k)};await a.yield();const Eo={uMadder:{value:E.madder},uSail:{value:E.line},uSailLine:{value:E.madder},uShelf:K.uShelf,uMotif:{value:y},uLamp:{value:s.lamps}},Ot=R(ha,fa,Eo),nt=w.nearestXZ(0,120).u*w.length,st=new n.Vector3,Te=new n.Vector3,Pt=(e,t)=>{w.posAtDist(e,st),w.tangentAtDist(e,Te);const o=Math.hypot(Te.x,Te.z)||1;return{x:st.x-Te.z/o*t,z:st.z+Te.x/o*t}},Ne=32,Wo=7.9,ee=[{scale:1.3,yaw:Math.PI+.1,off:-7.5,d:52},{scale:1.45,yaw:Math.PI-.14,off:9,d:72},{scale:1.7,yaw:Math.PI+.08,off:-9.5,d:131}];ee.forEach(e=>{e.side=Math.sign(e.off),Object.assign(e,Pt(e.d,e.off))}),ee.forEach(e=>{e.ph=v.range(0,G),e.pos=new n.Vector3,e.yawNow=e.yaw});const rt=((e,t)=>{const o=new n.InstancedMesh(e,Ot,t),r=new Float32Array(t*2);for(let g=0;g<t;g++)r[g*2]=v.range(0,G);return e.setAttribute("aBoat",new n.InstancedBufferAttribute(r,2)),o.frustumCulled=!1,A.add(o),o})(xa(),ee.length);rt.name="jukung",await a.yield();const Ue=a.core.makeRng(a.core.hashSeed("canang:"+a.seed)>>>0),Gt=190/6,ue=[0,1,2,3,4,5].map(e=>{const t=40+Gt*e+Ue.range(0,Gt-22),o=Ue.range(3,7);let r=e%2?-1:1;return ee.some(g=>g.side===r&&Math.abs(g.d-t)<14)&&(r=-r),{...Pt(t,r*o),ph:Ue.range(0,G),sc:Ue.range(.9,1.15)}}),Lt=ya(),Fe=new n.InstancedMesh(Lt,Ot,ue.length);{const e=new Float32Array(ue.length*2);ue.forEach((t,o)=>{e[o*2]=t.ph}),Lt.setAttribute("aBoat",new n.InstancedBufferAttribute(e,2))}Fe.frustumCulled=!1,Fe.name="offerings",A.add(Fe),ue.forEach((e,t)=>K.uOff.value[t].set(e.x,e.z,e.ph)),await a.yield();const pe=new n.Euler(0,0,0,"YXZ"),it=new n.Quaternion,Be=new n.Vector3,se=new n.Matrix4,Do=(e,t,o,r,g,x,i)=>{const k=e.yaw+.07*Math.sin(r*.31+e.ph),T=e.x+.5*Math.sin(r*.23+e.ph*2),d=e.z+.6*Math.sin(r*.19+e.ph),u=Math.sin(k)*i,F=Math.cos(k)*i,P=Ve(T,d,r,g,x),D=Ve(T+u,d+F,r,g,x),L=Ve(T-u,d-F,r,g,x);e.pos.set(T,(P+D+L)/3*.8+.05,d),e.yawNow=k,pe.set(-Math.atan2(D-L,2*i)*.8,k,.09*Math.sin(r*.9+e.ph)+.04*Math.sin(r*1.7+e.ph*3)),se.compose(e.pos,it.setFromEuler(pe),Be.setScalar(e.scale)),t.setMatrixAt(o,se)};await a.yield();const ae=7,lt=Math.round(33*l),ct=ae+lt,Oo={uBody:{value:E.ramp[0]},uRim:{value:b==="night"?E.line.clone().multiplyScalar(1.15):E.line},uBelly:{value:new n.Vector3(.8,.78,.72)},uThroat:{value:E.madder.clone().multiplyScalar(1.12)}};await a.yield();const It=Ma(),me=new n.InstancedMesh(It,R(da,ua,Oo),ct);{const e=new Float32Array(ct*2);for(let t=0;t<ct;t++)e[t*2]=v();It.setAttribute("aBird",new n.InstancedBufferAttribute(e,2))}me.frustumCulled=!1,me.name="frigatebirds",A.add(me),await a.yield();const Po=e=>e-Math.floor(e),Q=w.length,ve=a.core.makeRng(a.core.hashSeed("flock:"+a.seed)>>>0),Go=ve.range(0,G),He=ve.range(0,G),_t=1.1*(ve.chance(.5)?1:-1),Lo=ve.shuffle([0,1,2,3,4,5,6]),Ce=[],ht=[];for(let e=0;e<ae;e++)Ce.push(ve.range(0,G)),ht.push(ve.range(.85,1.15));const U=M.greatCurl,we=U.arcStart,ft=e=>U.radii[e]*(1-B(.105,.045,e/7))-5;await a.yield();const dt=ee[2].d,te=w.nearestXZ(M.lipNotch.x,M.lipNotch.z).u*Q,ut=U.arcStart,Io=Q-62,Re=new n.Vector3;w.tangentAtDist(te,Re),Re.y=0,Re.normalize();const qt=M.heroBolt.u,Nt=M.heroBolt.life,je=M.heroBolt.channel,Ut=12;await a.yield();const Ht=1.65,jt=2.2*Ht,Qe=9,Qt=.52,$t=2*jt/Qt,$e=8.4,Ee=5.9,_o=Math.sqrt($e*$e-Ee*Ee)/Ee,Ye=new n.Vector3(0,1,0),Ke=new n.Vector3,_=new n.Vector3,X=new n.Vector3,ge=new n.Vector3,I=new n.Vector3,ne=new n.Vector3,Xe=new n.Vector3,We=new n.Vector3,W=new n.Vector3,Sa=new n.Vector3,ka=new n.Vector3,Va=new n.Vector3,Ta=new n.Vector3,ce=new n.Vector3,Yt=new n.Vector3;await a.yield();const Kt=()=>{const t=new Float32Array(257);let o=1;return{set(r,g){o=0;for(let x=1;x<=256;x++){const i=(x-.5)/256*G;o+=Math.hypot(r*Math.sin(i),g*Math.cos(i)),t[x]=o}},at(r){const g=Po(r)*o;let x=0,i=256;for(;i-x>1;){const k=x+i>>1;t[k]<=g?x=k:i=k}return(Math.floor(r)+(x+(g-t[x])/Math.max(t[i]-t[x],1e-6))/256)*G}}},Xt=Kt(),Zt=Kt();Zt.set($e,Ee);const q={a0:0,r0:0,h0:0,La:0,Lr:0,Lh:0,tip:0,kS:0},Jt=(e,t,o)=>{const r=O(Ne-30,Ne+6,e),g=O(dt-5,dt+30,e),x=O(nt-25,nt+25,e),i=O(te-180,te-130,e),k=O(dt,nt,e);let T=B(Ne-e,23,r),d=0,u=B(2.5,5,r),F=B(8,5,r),P=B(9,6.5,r),D=B(3,3.5,r);T=B(T,17,g),u=B(u,5.5+2*k,g),F=B(F,4.5,g),P=B(P,8.5,g),D=B(D,3.5,g),T=B(T,13,x),u=B(u,4.5,x),F=B(F,4.2,x),P=B(P,9,x),D=B(D,2.5,x),T=B(T,14,i),u=B(u,4.5,i),F=B(F,4.2,i),P=B(P,10,i),D=B(D,2.5,i),d=6.5*i*O(te-180,te-100,e);const L=1+.08*Math.sin(t*.31+He)*r;return o.a0=T,o.r0=d+1.2*Math.sin(t*.19+He)*g,o.h0=u+.4*Math.sin(t*.23+He+1)*r,o.La=F,o.Lr=P*L,o.Lh=D*L,o.kS=r,o.tip=.42*Math.sin(t*.23+He+2)*x*(1-i),o},Ze=(e,t,o,r)=>{e=$(e,.5,Q-.5),w.posAtDist(e,r),w.tangentAtDist(e,_);const g=Math.hypot(_.x,_.z)||1;return r.x+=-_.z/g*t,r.z+=_.x/g*t,r.y+=o,r};await a.yield();const qo=(e,t,o,r)=>{for(let g=0;g<ee.length;g++){const x=ee[g],i=(1-O(6,34,Math.abs(e-x.d)))*r;if(i<=0)continue;const k=t*x.side-(Math.abs(x.off)-2.9*x.scale-jt*.5-.8),T=Wo*x.scale+1.2-(w.posAtDist($(e,.5,Q-.5),We).y+o);k>-2.5&&T>0&&(o+=i*O(-2.5,1.5,k)*T)}return o},he=M.arrivals.filter(e=>e.kind==="arrival"||e.kind==="herald").map(e=>({p:e.position,u:e.u})),No=new n.Vector3;w.tangentAtDist(Math.min(we+U.lipDist[0],Q-1),_),No.set(-_.z,0,_.x).normalize();const eo=U.mouth.clone();eo.y+=U.radii[0];const H={r:0,h:0},Uo=(e,t)=>{let o=0;for(;o<5&&e>U.lipDist[o+1];)o++;const r=$((e-U.lipDist[o])/(U.lipDist[o+1]-U.lipDist[o]),0,1),g=(o<5?B(ft(o+1),ft(o+2),r):ft(6))+200*(1-O(60,95,e)),x=-B(U.lipOff[o],U.lipOff[o+1],r),i=-B(U.lipDrop[o],U.lipDrop[o+1],r);let k=H.r-x,T=H.h-i,d=Math.hypot(k,T);if(d>g&&(k*=g/d,T*=g/d,H.r=x+k,H.h=i+T),d=Math.hypot(H.r,H.h),d<t){d>.01?(H.r*=t/d,H.h*=t/d):H.h=t;const u=Math.hypot(x,i);Math.hypot(H.r-x,H.h-i)>g&&u>.5&&(H.r=t*x/u,H.h=t*i/u)}},pt=we+U.lipDist[6]-4,S={s0:0,kA:0,kOpen:0,common:0,rho:0,RA:0,RB:0,kR:0,wB:0,np:0,pr:new Float32Array(he.length),ph:new Float32Array(he.length)},be=new n.Vector3,xe=new n.Vector3,mt=new n.Vector3,to=new n.Vector3,oo=new n.Vector3,De=new n.Vector3,ao=new n.Vector3,ye=new n.Vector3,Ho=e=>O(te-95,te-45,e),no=e=>O(ut-33,ut+33,e),so=e=>{const t=no(e),o=O(Io,Q,e);Ze(e+Qe,0,0,be);const r=_.x,g=_.y,x=_.z;xe.set(r,g,x),W.subVectors(U.core,be);const i=W.length();i>.001?W.multiplyScalar(1/i):W.set(r,g,x);const k=1-O(20,60,i);W.x=B(W.x,r,k),W.y=B(W.y,g,k),W.z=B(W.z,x,k),oo.subVectors(U.mouth,be).normalize().lerp(W,t).normalize(),xe.lerp(W,t).normalize(),mt.crossVectors(xe,Ye).normalize(),to.crossVectors(mt,xe);const T=e+Qe+B(22,14,t),d=pt-6;S.rho=d-12*Math.log(1+Math.exp(Math.min((d-T)/12,60)))-e-Qe,S.RA=B($t,$e*(1+.5*o),t),S.RB=B($t,Ee*(1+.5*o),t),S.kR=t};await a.yield();const vt=(e,t)=>{const o=$(e,0,1)*Q;if(S.s0=o,Jt(o,t,q),Xt.set(q.Lr,Math.hypot(q.La,q.Lh)),S.kA=Ho(o),S.kOpen=S.kA*(1-no(o)),S.common=Go+_t*t,w.tangentAtDist($(o,.5,Q-.5),De),ao.set(-De.z,0,De.x).normalize(),S.kA>0&&so(o),S.np=0,S.kA<1){Ze(o+q.a0,q.r0,q.h0,ye);const r=-_.z,g=_.x,x=Math.hypot(r,g)||1;for(let i=0;i<he.length;i++){const k=(e-he[i].u)*_e;if(k<=0||k>=5)continue;const T=.5-.5*Math.cos(k*G/5),d=he[i].p.x-ye.x,u=he[i].p.y-ye.y,F=he[i].p.z-ye.z,P=(d*r+F*g)/x,D=Math.hypot(P,u)||1;S.pr[S.np]=T*P/D,S.ph[S.np]=T*u/D,S.np++}}S.kA<=0?Me.copy(ye):(Me.copy(be).addScaledVector(xe,S.rho),S.kA<1&&Me.lerpVectors(ye,Me,S.kA));{const r=(e-qt)*_e;S.wB=O(-1,0,r)*(1-O(Nt,Nt+1,r))}},wt=(e,t,o)=>{const r=S.s0,g=(S.common+3*G/7+(Lo[e]-3)*B(G/7,Qt,S.kOpen))/G,x=Math.sin(t*.5*ht[e]+Ce[e]),i=Math.sin(t*.37*ht[e]+Ce[e]*2),k=Math.sin(t*.33+Ce[e]*3);if(S.kA<1){const T=Xt.at(g),d=Math.cos(T),u=Math.sin(T);let F=q.a0-q.La*u+.8*k,P=q.r0+q.Lr*d*Math.cos(q.tip)+.5*x,D=q.h0+q.Lh*u+q.Lr*d*Math.sin(q.tip)+.45*i;for(let L=0;L<S.np;L++){const Ie=Math.max(0,d*S.pr[L]+u*S.ph[L]),j=5*Ie*Ie/Math.max(Math.hypot(S.pr[L],S.ph[L]),.001);P+=j*S.pr[L],D+=j*S.ph[L]}D=qo(r+F,P,D,q.kS),Ze(r+F,P,D,o)}if(S.kA>0){const T=B(G*g,Zt.at(g),S.kR),d=1+.05*Math.sin(t*.41+e*G*3/7)*S.kR;ne.copy(be).addScaledVector(xe,S.rho+1.2*k*(1-S.kR)+(e%2?1.5:-1.5)*(1-S.kR)-_o*S.RB*d*Math.sin(T)*S.kR).addScaledVector(mt,S.RA*d*Math.cos(T)+.5*x).addScaledVector(to,S.RB*d*Math.sin(T)+.45*i);const u=r+Qe+S.rho;if(u>we+40){let F=$(u,1,pt);w.posAtDist(F,W),w.tangentAtDist(F,_),F=$(F+(ne.x-W.x)*_.x+(ne.y-W.y)*_.y+(ne.z-W.z)*_.z,1,pt),w.posAtDist(F,W),w.tangentAtDist(F,_),X.set(-_.z,0,_.x).normalize(),H.r=(ne.x-W.x)*X.x+(ne.z-W.z)*X.z,H.h=ne.y-W.y,Uo(Math.max(F-we,0),(F>r?9*(F-r)/Math.max(Q-r,20)+2.5:0)*O(60,95,F-we)),W.addScaledVector(X,H.r),W.y+=H.h,ne.lerp(W,O(40,70,u-we))}S.kA<1?o.lerp(ne,S.kA):o.copy(ne)}if(S.wB>0){let T=1e12;for(let u=0;u<je.length-1;u++){Xe.subVectors(je[u+1],je[u]),We.subVectors(o,je[u]);const F=We.addScaledVector(Xe,-$(We.dot(Xe)/Math.max(Xe.lengthSq(),1e-6),0,1)).lengthSq();F<T&&(T=F,W.copy(We))}const d=Math.sqrt(T);d<Ut&&(d>.01?W.multiplyScalar(1/d):W.copy(ao).multiplyScalar(-1),o.addScaledVector(W,(Ut-d)*S.wB))}return o},gt=new n.Vector3,ro=new n.Vector3;await a.yield();const jo=(e,t)=>{const o=$(t,0,1)*Q,r=O(te-190,te-20,o);return Jt(o,e,q),Ze(o+q.a0,0,q.h0,gt),r>0&&(so(o),ro.copy(be).addScaledVector(oo,Math.max(S.rho,6)),gt.lerp(ro,r)),gt};await a.yield();const Qo=[new n.Vector3(66+Ao(-22,M.shift),96,-22),new n.Vector3(-74+Ao(-168,M.shift),198,-168)],io=[];for(let e=0;e<lt;e++){const t=v.range(14,44);io.push({k:e%2,rad:t,h:v.range(-14,44),a0:v.range(0,G),w:11/t*(e%2?1:-1)*v.range(.85,1.15),sc:v.range(1,1.35),ph:v.range(0,G)})}const $o=(e,t,o,r,g)=>{X.crossVectors(Ye,o),X.lengthSq()<1e-6&&X.set(1,0,0),X.normalize(),ge.crossVectors(o,X);const x=Math.cos(r),i=Math.sin(r);X.multiplyScalar(x).addScaledVector(ge,i),ge.crossVectors(o,X),se.makeBasis(X,ge,o).scale(Be.setScalar(g)).setPosition(t),me.setMatrixAt(e,se)};await a.yield();const Me=new n.Vector3,re=.09,bt=9,xt=[],yt=[],Mt=[],At=[],zt=new Float32Array(ae),St=new Float32Array(ae);let kt=-1;const lo=new n.Vector3,co=new n.Vector3,Vt=new n.Vector3,Yo=e=>{const t=(e.x-M.lipNotch.x)*Re.x+(e.z-M.lipNotch.z)*Re.z;return 5.2*O(-60,0,t)*(1-O(0,40,t))};for(let e=0;e<ae;e++)xt.push(new n.Vector3),yt.push(new n.Vector3),Mt.push(new n.Vector3),At.push(new n.Vector3(0,0,-1));const Ko=(e,t,o)=>{const r=kt>=0&&Math.abs(e-kt)<.002,g=o>0&&o<.2&&r?1-Math.exp(-o*5):1;kt=e;const x=re/_e*O(0,.004,e);vt(e-x,t-re);for(let i=0;i<ae;i++)wt(i,t-re,xt[i]);lo.copy(Me),vt(e+x,t+re);for(let i=0;i<ae;i++)wt(i,t+re,yt[i]);co.copy(Me),vt(e,t);for(let i=0;i<ae;i++)wt(i,t,Mt[i]);Vt.set(De.x,0,De.z).normalize();for(let i=0;i<ae;i++){const k=Mt[i],T=xt[i],d=yt[i];I.subVectors(d,T).sub(co).add(lo).multiplyScalar(1/(2*re)),I.y*=.35;const u=I.length();I.addScaledVector(Vt,bt*(1-O(.2*bt,.7*bt,u)));{const j=Math.hypot(I.x,I.z);j<3&&I.addScaledVector(Vt,3-j)}const F=Math.hypot(I.x,I.z)||1;let P=$((I.y-Yo(k))/F,-.84,.84),D=I.x/F,L=I.z/F;if(r&&o>0&&o<.2){const j=At[i],Rt=Math.atan2(j.x*L-j.z*D,j.x*D+j.z*L),go=3.5*o;if(P=St[i]+$(P-St[i],-1.2*o,1.2*o),Math.abs(Rt)>go){const bo=(Math.abs(Rt)>3.1?Math.sign(_t):Math.sign(Rt))*go,xo=Math.cos(bo),yo=Math.sin(bo);D=j.x*xo-j.z*yo,L=j.x*yo+j.z*xo}}At[i].set(D,0,L),St[i]=P,I.set(D,P,L).normalize(),W.copy(T).add(d).addScaledVector(k,-2).multiplyScalar(1/(re*re)),W.y=0,W.addScaledVector(I,-W.dot(I)),ce.crossVectors(Ye,I),ce.lengthSq()<1e-6&&ce.set(1,0,0),ce.normalize();{const j=($(-Math.atan2(W.dot(ce),9.8),-1.13,1.13)-zt[i])*g;zt[i]+=g<1?$(j,-2.4*o,2.4*o):j}const Ie=zt[i]+.11*Math.cos(t*.5+Ce[i]);Yt.crossVectors(I,ce),X.copy(ce).multiplyScalar(Math.cos(Ie)).addScaledVector(Yt,Math.sin(Ie)),ge.crossVectors(I,X),me.setMatrixAt(i,se.makeBasis(X,ge,I).scale(Be.setScalar(Ht)).setPosition(k))}for(let i=0;i<lt;i++){const k=io[i],T=k.a0+k.w*t,d=Qo[k.k],u=Math.sign(k.w);Ke.set(d.x+Math.cos(T)*k.rad,d.y+k.h+2.5*Math.sin(t*.3+k.ph),d.z+Math.sin(T)*k.rad*.8),I.set(-Math.sin(T)*u,.04*Math.cos(t*.3+k.ph),Math.cos(T)*.8*u).normalize(),$o(ae+i,Ke,I,u*.55,k.sc)}me.instanceMatrix.needsUpdate=!0};await a.yield();const Oe=[],Xo=Math.round(B(4,30,c)*l);for(let e=0;e<Xo;e++){const t=v.range(-1500,1500)*(e<6?.25:1),o=v.range(.1,.92),r=-(t/3e3)*(t/3e3)*520-o*380,g=36+30*o;Oe.push({x:t,y:g*.5-2,z:r,yaw:v.range(-.3,.3),w:v.range(110,200),h:g,bw:v.range(14,20)})}const Tt=new n.Vector3;for(const e of[.605,.633,.661]){const t=w.pointAt(e);w.tangentAt(e,Tt),Oe.push({x:t.x,y:t.y-6,z:t.z,yaw:Math.atan2(Tt.x,Tt.z),w:104,h:104,bw:v.range(8,10.5)})}await a.yield();const ho=new n.PlaneGeometry(1,1),fo={value:new n.Vector4(M.canyon.to.x,M.canyon.to.y,M.canyon.to.z,M.greatCurl.radii[0])},uo={value:M.greatCurl.mouth.clone()},Zo={uSheetA:{value:.85},uTubeA:fo,uTubeB:uo},Pe=new n.InstancedMesh(ho,R(pa,ma,Zo,{transparent:!0,depthWrite:!1}),Oe.length);{const e=new Float32Array(Oe.length*4);Oe.forEach((t,o)=>{pe.set(0,t.yaw,0),se.compose(Ke.set(t.x,t.y,t.z),it.setFromEuler(pe),Be.set(t.w,t.h,1)),Pe.setMatrixAt(o,se),e[o*4]=t.w,e[o*4+1]=t.h,e[o*4+2]=t.bw,e[o*4+3]=v()}),ho.setAttribute("aS",new n.InstancedBufferAttribute(e,4))}Pe.frustumCulled=!1,Pe.renderOrder=3,Pe.name="udan-liris",A.add(Pe),await a.yield();const Je=Math.round(1200*z),Ae=new n.InstancedBufferGeometry;{const e=new n.PlaneGeometry(1,1);Ae.setIndex(e.getIndex()),Ae.setAttribute("position",e.getAttribute("position"));const t=new Float32Array(Je*3),o=new Float32Array(Je);for(let r=0;r<Je;r++)t[r*3]=v(),t[r*3+1]=v(),t[r*3+2]=v(),o[r]=v();Ae.setAttribute("aOff",new n.InstancedBufferAttribute(t,3)),Ae.setAttribute("aR",new n.InstancedBufferAttribute(o,1)),Ae.instanceCount=Je}const Ft={uTime:p.uTime,uPix:{value:.0027},uRain:{value:0},uCamW:Z,uTubeA:fo,uTubeB:uo,uCream:{value:E.line},uEdge:{value:E.ramp[3]}},Ge=new n.Mesh(Ae,new n.ShaderMaterial({uniforms:Ft,vertexShader:va,fragmentShader:wa,transparent:!0,depthWrite:!1,side:n.DoubleSide}));Ge.frustumCulled=!1,Ge.renderOrder=5,Ge.name="rain-dashes",A.add(Ge),await a.yield();const Bt=9,po=[];for(let e=0;e<Bt;e++)po.push([N.position.x,N.position.y,N.position.z]);const Ct=Mo({positions:po,color:"#E3A72A",size:1.5,intensity:2,halo:.35,core:1,fogAmount:0,sizeJitter:.3,rng:v});A.add(Ct.object);const mo=new n.Vector3().crossVectors(Ye,N.normal).normalize(),Jo=new n.Vector3().crossVectors(N.normal,mo).normalize();let Le=null;if(s.lamps){const e=[];for(let t=0;t<ee.length;t++)e.push([0,-50,0]);Le=Mo({positions:e,color:"#FFC25A",size:2.4,intensity:1.8,halo:.5,core:1,fogAmount:.3,rng:v}),A.add(Le.object)}const vo=new n.Vector3,ea=new n.Vector3(M.shift+30,285,-346),ta=new n.Vector3,oa=U.lipDist[6],aa=(te-95)/Q,na=(te-45)/Q,sa=[{at:jo,from:Ne/Q,to:(ut+40)/Q,weight:.45,fade:.12},{at:ea,from:.33,to:.46,weight:.35},{at:eo,from:aa,to:qt,weight:.25,fade:.4},{at:(e,t)=>w.posAtDist(Math.min(t*Q+oa,Q),ta),from:na,to:.96,weight:.9,fade:.4}],ze=s.post,ra={exposure:ze.exposure,bloom:{strength:.3,radius:.5,threshold:1.1},grade:{saturation:ze.sat,contrast:ze.con,tint:ze.tint,shadowTint:ze.shadow,vignette:ze.vig,grain:.035,aberration:0}},oe=Z.value,wo=new n.Vector2;return{scene:A,path:w,duration:_e,title:s.title,camera:{fov:62,near:.5,far:5200,lookAhead:30,sway:.5,bank:.6},pois:sa,portal:{shape:"circle",radius:7,color:s.portal,glow:1,revealDistance:450},post:ra,ride:"none",style:"none",update(e,t,o,r){r=$(r||0,0,1);const g=r*_e;V.setProgress(r),V.update(e,t,o),oe.setFromMatrixPosition(o.matrixWorld);const x=ko*t,i=oe.x*zo+oe.z*So,k=oe.x*Et+oe.z*Wt-x;K.uMarch.value=x,K.uOrigin.value.set(Math.round(i/fe)*fe,Math.round(k/J)*J),K.uDotT.value=t*2.2,K.uShelf.value=70+45*O(.05,.3,r);for(let d=0;d<ee.length;d++){const u=ee[d];Do(u,rt,d,t,oe.x,oe.z,2.4),K.uBoat.value[d].set(u.pos.x,u.pos.z,u.yawNow,1)}rt.instanceMatrix.needsUpdate=!0;for(let d=0;d<ue.length;d++){const u=ue[d],F=u.x+.4*Math.sin(t*.17+u.ph),P=u.z+.5*Math.sin(t*.13+u.ph*2),D=Ve(F,P,t,oe.x,oe.z),L=Ve(F+.5,P+.5,t,oe.x,oe.z);pe.set((L-D)*.9,u.ph+t*.12,(D-L)*.9+.05*Math.sin(t*1.3+u.ph)),se.compose(Ke.set(F,D*.92+.02,P),it.setFromEuler(pe),Be.setScalar(u.sc)),Fe.setMatrixAt(d,se),K.uOff.value[d].set(F,P,u.ph)}if(Fe.instanceMatrix.needsUpdate=!0,Le){for(let d=0;d<ee.length;d++){const u=ee[d];Le.setPosition(d,u.pos.x+Math.sin(u.yawNow)*4.6*u.scale,u.pos.y+2.46*u.scale,u.pos.z+Math.cos(u.yawNow)*4.6*u.scale)}Le.update(e,t)}Ko(r,t,e);const T=O(.57,.6,r)*(1-O(.655,.69,r));Ft.uRain.value=T,Ge.visible=T>.01,a.renderer.getDrawingBufferSize(wo),Ft.uPix.value=2*Math.tan((o.fov||62)*Math.PI/360)/Math.max(wo.y,1);for(let d=0;d<Bt;d++){const u=d/Bt*G-t*.22,F=8.9+.35*Math.sin(t*1.3+d*2.1);vo.copy(N.position).addScaledVector(mo,Math.cos(u)*F).addScaledVector(Jo,Math.sin(u)*F).addScaledVector(N.normal,.8),Ct.setPosition(d,vo)}Ct.update(e,t)},dispose(){}}}};export{Ea as default};
