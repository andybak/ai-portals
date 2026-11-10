import*as a from"three";const Le=["#F4ECDD","#E9A81C","#B8252E","#1F3A6E","#DB5A1E","#4F7A3C","#47213F"],Ge="#E3D8C6";function Ye(e=Le,y=1,s=Ge){const h=e.map(b=>new a.Color(b)),w=h[0],n=[w,h[1],h[2],h[4],h[3],h[5],h[6],h[6].clone().multiplyScalar(.82)],x=new Float32Array(72),l=new Float32Array(72),v=new a.Color,H=new a.Color;for(let b=0;b<8;b++){const S=b>=4?4:b>=2?2:b,c=n[b-S];for(let C=0;C<3;C++){if(b===0)v.copy(w).multiplyScalar(C===2?.93:1);else if(C===0&&b===4){const W={},L={};n[4].getHSL(W,a.SRGBColorSpace),w.getHSL(L,a.SRGBColorSpace),v.setHSL(W.h,Math.min(1,W.s*.82),W.l+(L.l-W.l)*.5,a.SRGBColorSpace)}else C===0?v.copy(c).lerp(n[b],S===2?.86:.56):C===1?v.copy(n[b]):(v.copy(n[b]),v.setRGB(v.r*.66,v.g*.6,v.b*.62,a.LinearSRGBColorSpace));l.set([v.r,v.g,v.b],(b*3+C)*3),x.set([v.r,v.g,v.b],(b*3+C)*3)}}const I=w.clone().lerp(new a.Color(1,1,1),.75),q=new Float32Array(24),u={};for(let b=0;b<8;b++)b===0?v.copy(I):(n[b].getHSL(u,a.SRGBColorSpace),v.setHSL(u.h,Math.min(1,u.s*(u.l<.35?.9:1)),u.l+(.93-u.l)*.45,a.SRGBColorSpace)),q.set([v.r,v.g,v.b],b*3);return{table:x,displayTable:l,display:n,sheenDisplay:I,exposure:y,tints:q,silk:w.clone(),air:new a.Color(s),cotton:w.clone().lerp(new a.Color(1,1,1),.6)}}const De=[[-27,1.3,36.7,3],[12.6,4.2,4.5,11],[25,6,1,15]],Xe=[9,20,33],Qe={t:26,speed:60,from:2400},Je=33,Ie=[22,25.6];function nt(e,y){const s=De[e],h=y-s[0];if(h<=0)return-1;const w=Math.max(h-s[2],0);return s[1]*h+s[3]*w*w}const Ze=e=>e<=0?0:2.05*Math.exp(-1.75*e)*Math.sin(2.35*e),We={vertex:`
  attribute vec3 aRow; attribute vec4 aT0, aBands, aRecipe, aRnd, aAux;
  uniform float uClock, uTime, uBreath, uViewH, uCover, uMinPx, uUnbind, uShift, uGustAmp, uSway, uSettle;
  uniform vec3 uEarly; uniform float uEarlyNear; uniform vec2 uFoot, uFarI; uniform float uSolid;   // uFarI: the far massif's indigo (m it stands at 0 s, m per s after); uSolid: how much wider a thread is drawn far off (a flat seen from afar is whole cloth)
  uniform vec3 uShiftK;                               // the rare shift on the far massif: (bundle width m, drop factor, unused)            // seconds by which each bath reaches the far massif early; the madder tide mark (m at the shore, m per m up the valley)
  uniform vec4 uBath[3]; uniform vec4 uLens; uniform vec2 uLensSize; uniform vec3 uLancet, uHoist;   // uHoist: (clock s the first spur's tower is hoisted, s per metre of sheet z after it, s it takes); the lancet that carries the exit: (half width, height it has been hoisted to, height it rests at)
  uniform vec4 uPart;                                 // the eye in sheet space (x, y, z) and its climb per metre flown (PARTING sheets bow round it)
  uniform vec3 uDuck[9];                              // mallard knots on the fold: (x, sheet z, heading +1|-1)
  flat varying vec4 vBands, vRecipe; flat varying vec3 vFront, vPale; flat varying vec4 vMisc; flat varying vec2 vSlip, vWedge; flat varying float vFoot, vBound, vCell;
  varying vec3 vP;                                    // (cross-thread -0.5..0.5, signed height, thread x after parting)
  varying vec2 vSq;                                   // (the thread's width here against its own: finer inside a sheaf, its distance from the eye in metres)
  float bathAt(vec4 b, float t){ float tau = t - b.x; float k = max(tau - b.z, 0.); return tau <= 0. ? -1. : b.y*tau + b.w*k*k; }
  float pulseAt(float t){ t = max(t, 0.); return 2.05*exp(-1.75*t)*sin(2.35*t); }
  void main(){
    float x = aT0.x, z = aT0.y, top = aT0.z;
    float ya = min(aRow.x*top + aRow.y*aBands.w + aRow.z, top);
  #ifndef PARTING
    // the lancet is hoisted late: until then its threads end at the height of the flank beside it (each a little behind the next: a combed top edge)
    if (abs(z - uLens.z) < 0.5 && abs(aT0.x - uLens.x) < uLancet.x) ya = min(ya, max(uLancet.y*(1. - 0.1*aRnd.y) - 4.*aRnd.z, uLancet.z*(0.8 + 0.25*aRnd.z)));
  #else
    // a spur's parted tower (slit over 4.2 m; the thousandths of the slit carry the height it rests at) is hoisted too, spur after spur
    if (aAux.y > 4.2) {
      float rest = (aAux.y - 4.5)*1000., hk = smoothstep(0., uHoist.z, uClock - uHoist.x - (300. - z)*uHoist.y - 0.6*aRnd.y);
      ya = min(ya, max(rest*(0.85 + 0.3*aRnd.z), mix(rest, top, hk)));
    }
  #endif
    float y = ya*position.y;
    // the bound summit: above its snowline a bundle's threads are gathered and wound
    float bound = 0.;
    float sq = 1.;                                    // how far a parting has pushed this thread's neighbours together (1 = at rest)
  #ifdef PARTING
    // a sheet the camera flies through (curtain, spur): aAux.y is the half width of its slit. Threads bow aside
    // round the eye as it comes, widest at the height where the eye will cross, and close again behind it.
    {
      float W = aAux.y, dz = z - uPart.z;             // ahead of the eye: dz < 0
      float behind = 1. - smoothstep(12., 44., dz);
      float open = (1. - smoothstep(W*3., W*3. + 30., -dz))*behind;
      float yc = uPart.y - uPart.w*dz, Rr = W*5., Wo = W;
      if (W < 4.2) {
        // THE REED CURTAINS ARE TIED BACK AS AN AVENUE: each hangs open before we reach it, the further the wider (a third of
        // its distance), so from the shore their sheaves stand one outside another at the sides of the frame and the lake
        // and the white mountain are clear between them; each closes to its slit as the eye comes and brushes past
        if (W < 3.9) {                                // (the mist's gauze, slit 3.95, only parts round the eye)
          open = max(open, 0.94*behind);
          if (W < 3.) Rr = W*8.;
          Wo = min(max(W*1.9, 0.42*(-dz)), Rr*0.8);
        }
      } else {
        // a spur's tower, once hoisted, hangs a little open on the line of the climb (y 41.8 at z 300, 30 degrees): from the foot
        // of the climb the three partings stand one inside another with the exit lens at the end of them
        float hk2 = smoothstep(0., uHoist.z, uClock - uHoist.x - (300. - z)*uHoist.y - 0.6);
        yc = mix(41.8 + 0.5774*(300. - z), yc, smoothstep(0.02, 0.3, abs(uPart.w))*(1. - smoothstep(30., 90., -dz)));
        open = max(open, (0.55 + 0.35*smoothstep(40., 160., -dz))*hk2*behind);
        Wo = min(max(W, 0.05*(-dz)), Rr*0.8);
      }
      float sp = clamp((ya - yc)/(W*4.5 + 2.), -1., 1.), kp = (1. - sp*sp); kp *= kp*open;
      float dp = x - uPart.x;
      if (abs(dp) < Rr && kp > 0.) {
        float pp = max(abs(dp)/Rr, 1e-4), wv = Wo*kp;
        x = uPart.x + (dp < 0. ? -1. : 1.)*(wv + (Rr - wv)*pow(pp, 1. + 1.7*kp));
        sq = (Rr - wv)/Rr*(1. + 1.7*kp)*pow(pp, 1.7*kp);
        if (W < 4.2) sq = max(sq, 0.35);
      }
    }
  #else
    bound = smoothstep(aBands.w - 4., aBands.w + 26., ya)*step(0.001, abs(aAux.y));
    float rel = clamp(uUnbind - (1. - ya/900.)*1.2 - aRnd.z*0.3, 0., 1.);
    x += aAux.y*0.55*bound*(1. - rel*rel*(3. - 2.*rel)*0.8);
  #endif
    // the exit lens: threads swagged aside and tied back
    float dl = x - uLens.x, R = uLensSize.y;
    if (abs(z - uLens.z) < 0.5 && abs(dl) < R) {
      float s = clamp((ya - uLens.y)/uLensSize.x, -1., 1.), k = (1. - s*s); k *= k*uLens.w;
      float w = 7.6*k, p = abs(dl)/R;
      x = uLens.x + (dl < 0. ? -1. : 1.)*(w + (R - w)*pow(max(p, 1e-4), 1. + 1.7*k));
      sq = min(sq, (R - w)/R*(1. + 1.7*k)*pow(max(p, 1e-4), 1.7*k));
    }
    // threads pushed together by a parting are drawn finer, so each still stands by itself (and carries its sheen) in the sheaf
    sq = clamp(sq*1.3, 0.28, 1.);
    // sparser with distance: drop threads by keep level and widen the survivors, never under uMinPx pixels
    vec3 lc = (cameraPosition - modelMatrix[3].xyz)*mat3(modelMatrix);   // camera in local space (no scale assumed)
    float dist = length(vec3(aT0.x, clamp(lc.y, -top, top), z) - lc);      // from the thread at rest: one value per thread
    float px = dist*2./max(projectionMatrix[1][1]*uViewH, 1.);
    float m = max(log2(max(uMinPx*px/uCover, 1e-4)/aAux.x), 0.), fl = floor(m), f = m - fl;
    float lv = aRnd.w, w0 = uCover*aAux.x*exp2(fl);
    // (a thread about to be dropped hands its width to the survivors before it falls under a pixel, so a sheet keeps its cover at every distance)
    float thin = w0*(1. - f), comp = thin*(1. - smoothstep(0.7*px, 1.4*px + 1e-5, thin));
    float wd = lv < fl - 0.5 ? 0. : (lv < fl + 0.5 ? thin : w0*(1. + f) + comp);
    if (wd < 0.7*px) wd = 0.;
    wd = min(wd, aAux.x*exp2(fl + 1.)*0.8);
    wd *= 1. + 0.12*(1. - smoothstep(-260., -60., z));   // the far massif is hung closer still: its tiers are solid colour, sub-pixel gaps closed
    // whole cloth from afar: beyond arm's length a thread is drawn wider than its spacing, so a flat owns its pixels and a
    // dyed shape is one shape; near the eye the threads stand apart and can be counted (the backdrop sky stays sparse)
  #ifdef PARTING
    if (aAux.x >= 0.08) wd *= 1. + uSolid*smoothstep(14., 70., dist);
  #else
    wd *= 1. + uSolid*smoothstep(14., 70., dist)*step(-1500., z)*step(aT0.z, aT0.w + 400.);   // (a bare sky thread keeps its own width)
  #endif
    float wd0 = wd;                                   // (the flat varyings take the thread's own width: one value per thread)
  #ifdef PARTING
    if (aAux.y < 4.2 && aAux.x < 0.08) wd *= 1. + (aAux.z > 50. ? 4.2 : 2.2)*(1. - smoothstep(8., aAux.z > 50. ? 46. : 30., abs(z - uPart.z)));   // a reed curtain: sheer from afar, substantial at arm's length (its dyed sheaf beside the slit is a solid body)
  #endif
    wd0 = wd;                                         // (still one value per thread: the widening hangs on the sheet's z and the eye)
    { float wq = max(wd*sq, min(wd, 1.3*px)); vSq = vec2(wq/max(wd, 1e-6), dist); wd = wq; }   // (never under a pixel and a third: a finer thread would break into dots)
    wd *= 1. + 0.9*bound;                             // gathered and wound, a bundle is nearly solid: the bound peak is plainly white
    // slip: rest + breath + the gust, more below the fold
    float g = pulseAt(uClock - aAux.w);
    // hung warp is never still: each thread shivers across its sheet by a fraction of the pitch, more in a breath or the gust
    x += aAux.x*uSway*(sin(uTime*1.3 + aT0.x*0.045 + z*0.71 + aRnd.z*2.) + 0.5*sin(uTime*2.9 + aRnd.z*40.))*(1. + 1.5*abs(uBreath) + 2.*abs(g));
    float br = 0.55*sin(uTime*0.9 + aT0.x*0.011 + z*0.004) + 0.3*sin(uTime*1.7 + aRnd.z*6.2832);   // the cloth is never quite still
    float sl = aRnd.x*(1. + br + 2.2*uBreath + 4.*g) + g*uGustAmp;        // each thread further, and the whole sheet thrown
    float farS = 1. - smoothstep(-260., -60., z);
    float sh = uShift*mix(clamp(aAux.x*0.6, 0.25, 1.), uShiftK.y, farS)*step(0.5, fract(floor(aT0.x/mix(clamp(aAux.x*40., 20., 110.), uShiftK.x, farS))*0.5));   // (a finer sheet drops less: its picture is smaller)   // the rare shift: every other bundle of forty threads drops
    vSlip = vec2(sl + sh, sl*1.7 + sh);
    float tl = uClock - aAux.z - 0.25*aRnd.y;
    // the far massif (the sheets behind the foothill flank) is dipped early and all at once, so the mountain stands in
    // its tiers while the lake is still in open view; down here each bath comes in its own time
    float farK = 1. - smoothstep(-260., -60., z);
    vec3 te = tl + farK*(uEarly + 0.00114*max(-z, 0.) + 0.25*aRnd.y);
    float st = uSettle*(1. - 0.6*farK);
    // madder comes down the valley from the mountain: the spurs and the foothill flank take it some seconds early too
    te.y = tl + farK*0.00114*max(-z, 0.) + mix(min(uEarlyNear, max(uEarlyNear*0.85 - z*0.01, 0.))*(1. - smoothstep(330., 400., z)), uEarly.y, farK);
    vFront = vec3(bathAt(uBath[0], te.x), bathAt(uBath[1], te.y), bathAt(uBath[2], te.z));
    vPale = vec3(bathAt(uBath[0], te.x - st), bathAt(uBath[1], te.y - st*0.3), bathAt(uBath[2], te.z - st));
    // the far massif was given its indigo before the valley: it stands dark under its bound peak from the first frame
    // (the subject of the opening, and of the picture in the previous portal) and the bath creeps on up its crests
    float fi = uFarI.x + uFarI.y*max(uClock, 0.);
    vFront.z = mix(vFront.z, fi, farK); vPale.z = mix(vPale.z, fi - 30., farK);
    // every thread wicks at its own rate: a comb a few metres deep at the front (never a barcode the height of a grove)
    vec3 comb = aRnd.y*clamp(vFront*0.1, vec3(1.5), vec3(9.));
    vFront -= comb; vPale -= comb;
  #ifdef PARTING
    // a reed curtain's threads beside its slit (bath delay over 50 s: never by the clock) take their first bath as the eye
    // comes: saffron climbs them over the last thirty metres, pale at its front, and stays
    if (aAux.y < 4.2 && aAux.z > 50.) {
      float pf = 16.*(1. - smoothstep(16., 52., uPart.z - z));
      vFront.x = pf - 2.*aRnd.y; vPale.x = pf - 2.6 - 2.*aRnd.y;
    }
  #endif   // a band deepens one step uSettle seconds after its bath passes (madder much sooner)
    vFoot = (uFoot.x + uFoot.y*clamp(700. - z, 0., 1900.))*(0.7 + 0.6*fract(aRnd.z*7.31 + aRnd.y*3.7));   // the madder tide mark of this thread
    vFoot *= mix(1., 0.32 + 0.68*smoothstep(12., 150., abs(aT0.x)), step(50., z));   // lower on the threads we brush past, so it is one band and not a wall
    vFoot *= mix(1., 0.4, smoothstep(60., 110., z)*(1. - smoothstep(330., 400., z)));   // low on the spurs: their silk and their lancets stay legible above it
    vFoot *= mix(1., 0.5, smoothstep(330., 400., z));  // and on the wings: one madder line along each fold, not a wall
    vFoot *= step(-20., aAux.z);                      // a thread dyed before the valley (houses, willows, green reeds) keeps its own colours
    vBands = aBands; vRecipe = aRecipe;
  #ifdef PARTING
    vBound = 0.;
  #else
    vBound = step(0.001, abs(aAux.y));
  #endif
    { float pc = max(aAux.x, 1e-3); vCell = fract(aT0.x/(3.2*pc) + 0.45*sin(aT0.x*0.9/pc + aT0.y) + aT0.y*0.37); }   // where this thread hangs in a run of three (one value per thread): fine threads take the satin tint in runs, one in three
    vWedge = vec2(0.);                                // a mallard drags a wedge of extra slip through the reflection behind it
    for (int i = 0; i < 9; i++) {
      vec3 dk = uDuck[i]; float bk = (aT0.x - dk.x)*-dk.z;
      if (abs(dk.y - z) < 0.5 && bk > 0. && bk < 46.) vWedge = vec2(2.6*(1. - bk/46.) + 0.5, bk*0.3 + 0.5);
    }
    vMisc = vec4(aT0.z > aT0.w + 400. ? -aT0.w : aT0.w, aRnd.z, z, wd0/max(px, 1e-5));   // x: picture top, negative on a sky thread
    vP = vec3(position.x, y, x);
    vec4 mv = modelViewMatrix*vec4(x + position.x*wd, y, z, 1.);
    gl_Position = wd > 0. ? projectionMatrix*mv : vec4(2., 2., 2., 1.);
  }`,fragment:`
  uniform vec3 uDye[24]; uniform vec3 uTint[8]; uniform vec3 uSheenCol, uCotton, uKnot;
  uniform float uClock, uTime, uRipple; uniform vec4 uBelt;
  uniform vec4 uLow;                                  // raw silk in deeper shade, and how much of it veils the folded half (the lake)
  uniform vec4 uPart;                                 // the eye in sheet space (x, y, z)
  uniform vec4 uStork[24]; uniform float uStorkSize, uCast;      // 9 gaps above the fold + their 9 twins below, then 3 more gaps (18 to 20) + their 3 twins (21 to 23); uCast 0 stork, 1 horse, 2 swan
  uniform float uHorseGrow;                           // (round 13) the size of the nine band gaps and their nine twins (loop index under 9) is uStorkSize times this; 1 by default; gaps 18 to 23 are never scaled
  flat varying vec4 vBands, vRecipe; flat varying vec3 vFront, vPale; flat varying vec4 vMisc; flat varying vec2 vSlip, vWedge; flat varying float vFoot, vBound, vCell;
  varying vec3 vP; varying vec2 vSq;
  float bar(vec2 q, vec2 a, vec2 b, float w){          // a razor-sided bar from a to b (no soft edges in this cloth)
    vec2 d = b - a; float t = clamp(dot(q - a, d)/max(dot(d, d), 1e-5), 0., 1.);
    vec2 e = q - a - d*t; return step(dot(e, e), w*w);
  }
  float tbar(vec2 q, vec2 a, vec2 b, float wa, float wb){   // a tapering bar: half width wa at a, wb at b
    vec2 d = b - a; float t = clamp(dot(q - a, d)/max(dot(d, d), 1e-5), 0., 1.);
    vec2 e = q - a - d*t; float w = mix(wa, wb, t); return step(dot(e, e), w*w);
  }
  float storkGap(vec2 q, float pose){                 // q in wingspans; a white bird as a gap in the dye
    if (uCast > 1.5) {                                // a swan sitting on the fold, swimming toward -x; pose = how far the neck is raised
      float body = step(q.x*q.x*5.5 + q.y*q.y*30., 1.)*step(0., q.y) + bar(q, vec2(0.3, 0.1), vec2(0.5, 0.26), 0.05);
      float nk = 0.5 + 0.12*pose;
      float neck = bar(q, vec2(-0.3, 0.1), vec2(-0.42, nk*0.6), 0.045) + bar(q, vec2(-0.42, nk*0.6), vec2(-0.36, nk), 0.04) + bar(q, vec2(-0.36, nk), vec2(-0.52, nk - 0.05), 0.035);
      return min(body + neck, 1.);
    }
    if (uCast > 0.5) {                                // a white horse galloping toward -x (pose + 10: toward +x); q in horse lengths from the hooves, pose = stride -1..1
      if (pose > 5.) { pose -= 10.; q.x = -q.x; }
      float body = step((q.x*q.x)*7. + (q.y - 0.5)*(q.y - 0.5)*36., 1.);
      float neck = bar(q, vec2(-0.3, 0.56), vec2(-0.5, 0.82 + 0.03*pose), 0.085) + bar(q, vec2(-0.5, 0.83 + 0.03*pose), vec2(-0.66, 0.76 + 0.03*pose), 0.05);
      float tail = bar(q, vec2(0.36, 0.56), vec2(0.56, 0.5 - 0.08*pose), 0.035);
      float legs = bar(q, vec2(-0.27, 0.44), vec2(-0.3 - 0.24*pose, 0.02 + 0.1*max(pose, 0.)), 0.046) + bar(q, vec2(-0.2, 0.44), vec2(-0.2 - 0.12*pose, 0.0 + 0.16*max(-pose, 0.)), 0.046)
                 + bar(q, vec2(0.27, 0.44), vec2(0.3 + 0.26*pose, 0.02 + 0.1*max(pose, 0.)), 0.048) + bar(q, vec2(0.2, 0.44), vec2(0.22 + 0.1*pose, 0.0 + 0.16*max(-pose, 0.)), 0.048);
      return min(body + neck + tail + legs, 1.);
    }
    // a white stork side on, flying toward -x; q in body lengths (bill tip to toes is about one): a level body, neck and
    // bill stretched ahead, legs trailing, one bent wing raised, level or lowered (pose 1, 0, -1)
    float body = step(q.x*q.x*24. + q.y*q.y*120., 1.);
    float neck = tbar(q, vec2(-0.14, 0.014), vec2(-0.37, 0.04), 0.06, 0.044) + tbar(q, vec2(-0.37, 0.04), vec2(-0.55, 0.02), 0.036, 0.016);
    float legs = tbar(q, vec2(0.14, -0.014), vec2(0.5, -0.045), 0.04, 0.026);
    float wh = pose > 0. ? 0.15 + 0.35*pose : 0.15 + 0.6*pose;           // the wing is never edge on for long: raised, half raised, lowered
    vec2 elbow = vec2(0.03, 0.45*wh + 0.01), tip = vec2(0.12 + 0.07*(1. - abs(pose)), wh + 0.01);
    float wing = tbar(q, vec2(-0.04, 0.01), elbow, 0.11, 0.09) + tbar(q, elbow, tip, 0.09, 0.025);
    return min(body + neck + legs + wing, 1.);
  }
  float gSet = 0.;                                    // the dye set of the last dye() call (0 = undyed silk)
  vec3 dye(float hh, float hg, bool below, float pxm){  // hg: the height a resist gap is read at (a third of the slip); pxm: metres per pixel along the thread
    float code = hh < vBands.x ? vRecipe.x : hh < vBands.y ? vRecipe.y : hh < vBands.z ? vRecipe.z : hh < vBands.w ? vRecipe.w : 0.;
    if (hh > abs(vMisc.x)) { if (vMisc.x > 0.) discard; code = 0.; }      // past the picture: bare sky thread, or nothing
    float pre = step(15.5, code); code -= 16.*pre;                         // + 16: this band was dyed before the valley (the high woods and slopes): it stands in its colours from the first frame
    vec3 bits = vec3(mod(code, 2.), mod(floor(code*0.5), 2.), mod(floor(code*0.25), 2.));
    float shade = step(7.5, code);
    // the madder tide mark: along the waterline every thread takes the crimson bath, and takes it over its saffron
    bool foot = hh < vFoot; float nat = bits.y;
    if (foot) bits.y = 1.;
    vec3 has = bits*max(step(hh, vFront), vec3(pre));
    if (foot && has.y > 0.5) has.x = 0.;
    for (int i = 0; i < 12; i++) {
      vec4 s = uStork[i < 9 ? (below ? i + 9 : i) : (below ? i + 12 : i + 9)];
      // the resist was tied through every sheet behind the creature along the eye's line, so the gap is not dyed shut by the cloth beyond it
      // (pass 5) ... and through every sheet in front of it too: no nearer bank, flame or tide mark is dyed across a creature
      if (s.z < uPart.z - 1. && vMisc.z < uPart.z - 0.5) {
        float kq = (vMisc.z - uPart.z)/min(s.z - uPart.z, -1.);
        vec2 e = vec2(uPart.x, below ? -uPart.y : uPart.y), cq = e + (s.xy - e)*kq;
        // (only what stands above the creature's own fold: a horse wading up out of the lake is cut off at the waterline)
        has *= 1. - storkGap((vec2(vP.z, hg) - cq)/max(uStorkSize*(i < 9 ? uHorseGrow : 1.)*kq, 0.1), s.w)*step(0., e.y + (hg - e.y)/max(kq, 1e-3));
      }
    }
    float set = has.x + 2.*has.y + 4.*has.z;
    float newest = has.z > 0.5 ? vFront.z : has.y > 0.5 ? vFront.y : vFront.x;
    float settled = has.z > 0.5 ? vPale.z : has.y > 0.5 ? vPale.y : vPale.x;
    settled = max(settled, newest - 90.);
    float depth = (hh > settled || set < 0.5) ? 0. : 1. + shade;
    if (pre > 0.5 && set > 0.5) depth = 1. + shade;
    if (newest - hh < max(0.012*newest + 1.2, 2.6*pxm) && set > 0.5 && pre < 0.5) depth = 2.;      // the wet edge of the bath, never under two or three pixels
    if (foot && nat < 0.5 && has.y > 0.5 && vFoot - hh < max(1.1, 2.6*pxm)) depth = 2.;   // and the tide mark keeps its rim
    gSet = set;
    // THE MIRROR IS DYED: below the fold the same dyes hang one bath deeper (pale -> full -> deep; undyed silk in its shade),
    // so the lake is the valley again in whole colours of the dye table and never a veil over it
    if (below) depth = set > 0.5 ? min(depth + 1., 2.) : 2.;
    return uDye[int(set*3. + depth + 0.5)];
  }
  vec4 threadColour(){
    bool below = vP.y < 0.;
    float h = abs(vP.y);
    float sl = below ? vSlip.y + uRipple*sin(h*0.021 + uTime*0.9 + vP.z*0.004)*(1. + h*0.004) : vSlip.x;
    if (below && h < vWedge.y) sl += vWedge.x*(1. - h/max(vWedge.y, 0.01))*(0.75 + 0.25*sin(uTime*2.3 + vP.z*0.9));
    float hh = h + sl;
    float pxm = fwidth(vP.y);
    vec3 col = dye(max(hh, 0.), max(h + 0.3*sl, 0.), below, pxm);
    // the pinch knot where the thread turns back on itself: a flat darker tick on the fold, as tall as the thread is wide
    if (h < clamp(vMisc.w, 2.2, 9.)*pxm*0.8) col = gSet > 0.5 ? col*0.6 : uKnot;   // (on undyed silk the knot is raw silk in shade, never grey)
    if (vBound > 0.5 && hh > vBands.w + 8.) col = below ? uDye[0] : uCotton;   // wound in cotton above its snowline: whiter than silk (its twin in the fold: plain silk, one step down)
    // SATIN SHEEN, the one light effect: a paler stripe a fifth of the thread wide up its middle, in a level band at the
    // eye's own height that slides along the threads as the eye rises (two flat steps, its edges combed thread by thread).
    // A thread too fine to carry a stripe (under about five pixels) takes it whole or not at all, one thread in five: the same
    // share of pale, still crisp. Only near cloth shows it (within about 100 m): far flats keep their dyes exact.
    // THE BELT (polish pass 5): on every sheet a level band of light centred where the gaze meets the sheet (the eye's height
    // plus the gaze's slope times the sheet's distance down the course) and a third of the frame tall at any distance (its
    // half height grows with the distance), so on screen it is one level belt crossing every near stand, wing and sheaf, and
    // it slides along the threads as the eye moves and climbs. The stripe is a paler tint OF THE THREAD'S OWN DYE (uTint).
    float dz = max(abs(vMisc.z - uPart.z), 3.), bw = max(uBelt.z*dz, 0.9);
    float yb = uBelt.x + uBelt.y*dz;
    float band = ((below ? -h : h) - yb)/bw + (vMisc.y - 0.5)*0.5 + 0.1*sin(uTime*0.7 + vP.z*0.0052 + vMisc.z*0.003);
    band = exp(-band*band);
    // every thread wide enough carries the stripe up its middle: a fifth of its width, never under a pixel and a half (so a
    // thread of 3.5 to 7 px shows one clean pale line); a finer one takes the tint whole or not at all, one thread in four.
    // Only cloth at arm's length shows it (within about 50 m, cut off thread by thread): far flats keep their dyes exact.
    float wpx = 1./max(fwidth(vP.x), 1e-4);
    float stripe = 1. - step(max(0.1, 0.75/wpx), abs(vP.x));
    // no half tints: a thread carries the tint or it does not. In the heart of the belt every wide thread carries its stripe
    // and every other fine thread is pale; in the weaker step above and below, every other wide thread and one fine one in five
    // and a fine thread takes it whole, in runs: one drawn pitch in three in the heart of the belt, half as many in the rim,
    // so a sheaf of fine threads shows clean pale stripes side by side and never a scatter
    float hsh = fract(vMisc.y*7.13 + 0.31), core = step(0.62, band), rim = step(0.3, band) - core;
    float share = wpx > 5. ? stripe*(core + rim*step(hsh, 0.5)) : step(1., wpx)*(core*step(vCell, 0.55) + rim*step(vCell, 0.28));
    float sheen = share*step(vSq.y + (vMisc.y - 0.5)*24., 52.);
    if (vMisc.x < 0.) sheen = 0.;                                     // (a bare sky thread is silk already)
    int ts = int(gSet + 0.5); if (vBound > 0.5 && hh > vBands.w + 8.) ts = 0;
    col = mix(col, ts == 0 ? uSheenCol : uTint[ts], sheen*uBelt.w);
    return vec4(col, 1.);                                                      // flat post: the colour written is the colour shown
  }`};function $e(e={}){const y=e.palette&&e.palette.length>=7?e.palette:Le,s=Ye(y,e.exposure??1,e.air??Ge),h=[];for(let u=0;u<24;u++)h.push(new a.Vector3(s.displayTable[u*3],s.displayTable[u*3+1],s.displayTable[u*3+2]));const w=[];for(let u=0;u<24;u++)w.push(new a.Vector4(0,-9999,-99999,0));const n=[];for(let u=0;u<8;u++)n.push(new a.Vector3(s.tints[u*3],s.tints[u*3+1],s.tints[u*3+2]));const x=[];for(let u=0;u<9;u++)x.push(new a.Vector3(0,-99999,1));const l={uClock:{value:0},uTime:{value:0},uBreath:{value:0},uViewH:{value:720},uCover:{value:.45},uMinPx:{value:1.5},uSway:{value:.16},uSettle:{value:4},uUnbind:{value:0},uShift:{value:0},uGustAmp:{value:6},uBath:{value:De.map(u=>new a.Vector4(u[0],u[1],u[2],u[3]))},uLens:{value:new a.Vector4(0,215,99999,1)},uLensSize:{value:new a.Vector2(19,34)},uHoist:{value:new a.Vector3(20.5,.01,2.4)},uLancet:{value:new a.Vector3(56.5,9999,60)},uDye:{value:h},uSheenCol:{value:new a.Vector3(s.sheenDisplay.r,s.sheenDisplay.g,s.sheenDisplay.b)},uEarly:{value:new a.Vector3(23,26,18)},uEarlyNear:{value:11},uFoot:{value:new a.Vector2(13,.014)},uSilk:{value:s.silk},uCotton:{value:s.cotton},uKnot:{value:s.air.clone().multiplyScalar(.9)},uAir:{value:s.air},uSheenY:{value:40},uSheenW:{value:90},uRipple:{value:1.5},uTint:{value:n},uBelt:{value:new a.Vector4(5,0,.2,1)},uSolid:{value:.55},uFarI:{value:new a.Vector2(300,12.5)},uShiftK:{value:new a.Vector3(124,4.6,0)},uLow:{value:new a.Vector4(s.air.r*.86,s.air.g*.87,s.air.b*.9,.2)},uStork:{value:w},uStorkSize:{value:40},uCast:{value:0},uHorseGrow:{value:1},uPart:{value:new a.Vector4(0,5,99999,0)},uDuck:{value:x}},v=new a.Vector2,H=new a.Vector3,I=new a.Vector3;return{uniforms:l,dyes:s,palette:y,threadMaterial(u=!1){return new a.ShaderMaterial({uniforms:l,side:a.DoubleSide,fog:!1,toneMapped:!1,defines:u?{PARTING:1}:{},vertexShader:We.vertex,fragmentShader:We.fragment+`
        void main(){ gl_FragColor = threadColour(); }`})},setClock(u){l.uClock.value=u;let b=0;for(const S of Xe)b+=Ze((u-S)*.8);l.uBreath.value=b,l.uUnbind.value=(u-Je)/5},update(u,b,S,c){l.uTime.value=u,S&&(l.uViewH.value=S.getDrawingBufferSize(v).y);let C=c;C===void 0&&b&&(C=H.setFromMatrixPosition(b.matrixWorld).y);const W=l.uClock.value;if(l.uSheenY.value=(C||0)+2.5+Math.max(W,0)*.1+Math.sin(u*.23)*1.5,l.uSheenW.value=5,b&&b.matrixWorld){const L=b.matrixWorld.elements;I.set(-L[8],-L[9],-L[10]),l.uBelt.value.x=C||0,l.uBelt.value.y=Math.min(.8,Math.max(-.3,I.y/Math.max(Math.hypot(I.x,I.z),.3)))+.02*Math.sin(u*.23)}}}}function qe(e=null){const y=[],s=[],h=[],w=e||[[1,0,0]],n=[];for(let l=w.length-1;l>=0;l--)n.push([-1,w[l]]);for(let l=0;l<w.length;l++)n.push([1,w[l]]);for(const[l,v]of n)for(const H of[-.5,.5])y.push(H,l,0),s.push(v[0],v[1],v[2]);for(let l=0;l<n.length-1;l++){const v=l*2;h.push(v,v+1,v+2,v+1,v+3,v+2)}const x=new a.BufferGeometry;return x.setAttribute("position",new a.Float32BufferAttribute(y,3)),x.setAttribute("aRow",new a.Float32BufferAttribute(s,3)),x.setIndex(h),x}function et(){const e=new a.BufferGeometry,y=[],s=[];for(const[h,w]of[[-1,[1,0,0]],[-1,[0,1,0]],[1,[0,1,0]],[1,[1,0,0]]])for(const n of[-.5,.5])y.push(n,h,0),s.push(w[0],w[1],w[2]);return e.setAttribute("position",new a.Float32BufferAttribute(y,3)),e.setAttribute("aRow",new a.Float32BufferAttribute(s,3)),e.setIndex([0,1,2,1,3,2,4,5,6,5,7,6]),e}function tt(e,y,s,h,w,n,x){const l=y*20;e.fill(0,l,l+20),e[l]=s,e[l+1]=h,e[l+2]=He,e[l+3]=w,e[l+4]=w,e[l+5]=w,e[l+6]=w,e[l+7]=w,e[l+13]=.3,e[l+14]=x,e[l+15]=0,e[l+16]=n,e[l+18]=9,e[l+19]=99}function Ne(e,y,s,h,w){const n=new a.InstancedBufferGeometry;n.index=h.index,n.setAttribute("position",h.getAttribute("position")),n.setAttribute("aRow",h.getAttribute("aRow"));const x=new a.InstancedInterleavedBuffer(y,20);["aT0","aBands","aRecipe","aRnd","aAux"].forEach((v,H)=>n.setAttribute(v,new a.InterleavedBufferAttribute(x,4,H*4))),n.instanceCount=s;const l=new a.Mesh(n,w||e.threadMaterial());return l.frustumCulled=!1,l.matrixAutoUpdate=!0,l}const Fe=e=>{let y=0;if(e=e|0,e===0)return 12;for(;(e&1)===0&&y<12;)e>>=1,y++;return y};function at(e,y,s){const h=y*20;e[h]=s.x,e[h+1]=s.z,e[h+2]=s.geoTop,e[h+3]=s.picTop,e[h+4]=s.h[0],e[h+5]=s.h[1],e[h+6]=s.h[2],e[h+7]=s.h[3],e[h+8]=s.r[0],e[h+9]=s.r[1],e[h+10]=s.r[2],e[h+11]=s.r[3],e[h+12]=s.slip,e[h+13]=s.lag,e[h+14]=s.phase,e[h+15]=s.level,e[h+16]=s.pitch,e[h+17]=s.bundleDx,e[h+18]=s.delay,e[h+19]=s.gustAt}const He=1600,ne=1,$=2,D=4,ue=8,ie=[{z:0,H:300,pitch:.6,slip:2.6,spruce:120,upper:225},{z:-250,H:420,pitch:.9,slip:4,spruce:160,upper:320},{z:-480,H:540,pitch:1.2,slip:5.5,spruce:180,upper:410},{z:-700,H:660,pitch:1.5,slip:7,spruce:190,upper:490},{z:-920,H:780,pitch:1.9,slip:9,spruce:180,upper:550},{z:-1150,H:900,pitch:2.5,slip:12,spruce:165,upper:580},{z:-1400,H:700,pitch:2.5,slip:12,spruce:150,upper:510}],ee=1300,ot=[1.6,1.6,1.7,1.7,1.8,1.95,1.7],Be=130,E={half:56,top:340,drop:84,snow:240};function st(e,y,s,h){const w=ie[e],n=y.fork("sheet"+e),x=[],l=e<=4||e===6,v=(e%2?-1:1)*h.flip,H=e===5?Be+n.range(-25,25):v*(e===0?n.range(520,800):n.range(340,620)+400);if(x.push({x:H,h:1,w:e===5?770+(n.range(900,1100)-900)*.3:n.range(620,900),p:e===5?1:1.05}),e===5){const d=n.sign();x.push({x:H+d*n.range(340,400),h:n.range(.86,.93)*.93,w:430,p:1},{x:H-d*n.range(400,470),h:n.range(.74,.84)*.98,w:420,p:1})}l&&x.push({x:-v*(n.range(420,760)+(e===0?0:340)),h:n.range(.7,.85),w:n.range(420,700),p:1.1});const I=e===6?.86:e===0?.72:l?.86:0,q=e===6?900:e===0?420:590+100*(e-1),u=n.int(3,5);for(let d=0;d<u;d++){const A=d%2?1:-1,k=n.range(260,1150),P=H+A*(e===5?980+(k-260)*.4:k);x.push({x:P,h:n.range(.5,.86)*(1-.25*Math.abs(P)/ee),w:n.range(380,760),p:n.range(.95,1.4)})}const b=[];let S=-ee-40;for(;S<ee+40;){const d=n.range(70,190)*(.8+e*.09);b.push({a:S,b:S+d,apex:S+d*n.range(.3,.6),h:n.range(.35,1)}),S+=d}const c=[];for(S=-ee-80;S<ee+80;){const d=n.range(260,520);c.push({a:S,b:S+d,apex:S+d*n.range(.35,.6)}),S+=d}const C=22+e*7,W=h.snowline+n.range(-10,10)-(e===5?Math.max(50,h.snowline-450):0),L=Math.max(w.pitch*8,14),G=e*37.7+n()*100,j=(d,A)=>{const k=Math.sin(d*127.1+A*311.7+G*13.1)*43758.5453;return k-Math.floor(k)},m=[];if(e<=1){const d=e===0?n.int(7,9):n.int(3,5);for(let A=0;A<d;A++){const k=n.range(-1150,1150),P=n.int(14,40),ae=P*n.range(7,10),V=h.flame;for(let oe=0;oe<P;oe++){const se=n(),F=se<.33?ne:se<.33+V?ne|$:$;m.push({x:k+n.range(-.5,.5)*ae,w:n.range(3.6,4.8)*(1+e*.5),h:n.range(30,45)*(1+e*.35),rec:F})}}m.sort((A,k)=>A.x-k.x)}let Q=0,re=0,J=0,ke=-1e9,te=1;const M={T:0,h:[0,0,0,0],r:[0,0,0,0],bundleDx:0,snow:0,bundleX:0};function Me(d){d<ke&&(Q=0,re=0,J=0),ke=d;let A=0;for(const t of x){const i=Math.max(0,1-Math.abs(d-t.x)/t.w);A=Math.max(A,t.h*Math.pow(i,t.p))}for(;Q<b.length-1&&d>=b[Q].b;)Q++;for(;re<c.length-1&&d>=c[re].b;)re++;const k=b[Q],P=c[re],ae=d<k.apex?(d-k.a)/(k.apex-k.a):(k.b-d)/(k.b-k.apex),V=d<P.apex?(d-P.a)/(P.apex-P.a):(P.b-d)/(P.b-P.apex),oe=s.fbm2(d*.004+G,e*3.1,4),se=d-Be*(600-w.z)/1750;A*=1-I*Math.exp(-(se*se)/(q*q));let F=w.H*te*A*(.8+.1*V+.1*ae*k.h)*(1+.07*oe)+14;const fe=e===0&&Math.abs(d)<E.half;fe&&(F=Math.max(F,E.top-E.drop*Math.pow(Math.abs(d)/E.half,1.7)));const Se=d>k.apex?ue:0,O=d>P.apex?ue:0,le=.09+.07*j(Q,1),he=ae<le?1:0,Te=ae<le*2.1?1:0,pe=Math.floor(d/C),we=d/C-pe,xe=3+Math.floor(j(pe,2)*2),Ae=(1-Math.floor(Math.abs(we-.5)*2*xe)/xe)*(16+30*j(pe,3))*(1+e*.3),ve=w.spruce*(.82+.18*ae)*(1+.16*s.n2(d*.0031+G,7.7))*(j(pe,5)<.16?.72:1);let Z=0,me=0;if(e<=1){for(Z=(7+4*s.n2(d*.01,G))*(1+e*.6),me=ne;J<m.length-1&&m[J].x+m[J].w<d;)J++;for(let t=J;t<m.length&&m[t].x-m[t].w<=d;t++){const i=m[t],r=(d-i.x)/i.w;if(Math.abs(r)<1){const o=i.h*(1-.5*Math.pow(Math.abs(r),1.7));o>Z&&(Z=o,me=i.rec|(r>0?ue:0))}}}const ze=Math.max(Z,ve+Ae),Ce=Math.max(ze,w.upper*(.8+.2*V)*(1+.1*oe)+(he?-40:0)),ye=Math.floor(d/L),be=fe?E.snow+Math.round((j(ye,4)-.5)*4)*5:W+Math.round((j(ye,4)-.5)*6)*11+(he?34:0)-26*V;M.T=F,M.h[0]=Math.min(Z,F),M.h[1]=Math.min(ze,F),M.h[2]=Math.min(Ce,F),M.h[3]=Math.min(be,F),M.r[0]=me;const ge=e===0&&!fe?16:0;if(M.r[1]=ge|ne|D|(we>.5?ue:0),M.r[2]=ge|(he?$|D:D|Se),M.r[3]=ge|(he?$|D|ue:Te?$|D:D|(O?ue:0)),fe){const t=Math.abs(d),i=t<8?0:t<16?1:t<26?2:t<38?3:4,r=d>0?ue:0,o=[D,$,ne,ne|$,$|D][i],f=[ne|D,D,$|D,D,ne|D][i];M.h[1]=Math.max(M.h[0],215-[100,82,62,44,26][i]),M.h[2]=Math.max(M.h[1],Math.min(238,F)),M.r[1]=f|r,M.r[2]=o|r,M.r[3]=o|r}return M.snow=be,M.bundleX=(ye+.5)*L,M.bundleDx=F>be+12?M.bundleX-d:0,M}return Me.setGain=d=>{te=(w.H-14)/Math.max(d-14,1)},Me}const Ue=(()=>{try{return new URLSearchParams(globalThis.location?.search||"")}catch{return new URLSearchParams("")}})();async function it(e,y={}){const s=e.rng.fork("massif"),h=e.noise,w=Math.min(1,Math.max(.6,y.detail??e.quality?.detail??1)),n=y.style||$e({palette:y.palette,exposure:y.exposure}),x=n.uniforms,l=y.season||(s.chance(.16)?"first-snow":s.chance(.3)?"early":"late"),v=y.weather||(s.chance(.25)?"breezy":"still"),H=y.shift??s.chance(.08),I={snowline:l==="first-snow"?450:700,flame:l==="early"?.2:.5,flip:s.sign()},q=new a.Group;q.name="massif-dyed-three-times";const u=n.threadMaterial(),b=qe(),S=qe([[0,1,-4],[0,1,26],[1,0,0]]),c={x:0,y:215,z:0,reach:34},W=qe([[0,0,150],[0,0,178],[0,0,192],[0,0,200],[0,0,206],[0,0,211],[0,0,215],[0,0,219],[0,0,224],[0,0,230],[0,0,238],[0,0,252],[0,0,280],[1,0,0]]);x.uLens.value.set(c.x,c.y,c.z,1),x.uLensSize.value.set(19,c.reach);const L=t=>({a:new Float32Array(t*20),length:0}),G={plain:L(16384),snow:L(4096),lens:L(1024)},j=[],m={x:0,z:0,geoTop:0,picTop:0,h:null,r:null,slip:0,lag:0,phase:0,level:0,pitch:0,bundleDx:0,delay:0,gustAt:0},Q=(t,i)=>{if((t.length+1)*20>t.a.length){const r=new Float32Array(t.a.length*2);r.set(t.a),t.a=r}at(t.a,t.length++,i)};let re=0;const J=[];for(let t=0;t<ie.length;t++){const i=ie[t],r=s.fork("threads"+t);await e.yield();const o=st(t,s,h,I);J.push(o),await e.yield();{let B=0,g=0;for(let z=-ee;z<=ee;z+=10)B=Math.max(B,o(z).T),(++g&31)===0&&await e.yield();o.setGain(B)}await e.yield();const f=i.H>I.snowline-40,p=2.5-i.z/1400*1.6,R=Qe.t-.7+(1+i.z/1400)*1.3,N=new Set,Y=t===0?[[i.pitch/w,!1],[.3/Math.sqrt(w),!0]]:[[i.pitch/w,!1]];for(const[B,g]of Y){const z=g?c.x-E.half:-ee,U=g?c.x+E.half:ee,de=Math.floor((U-z)/B),_=new Float64Array(de*5),Pe=new Array(de);for(let T=0;T<de;T++){const X=Fe(T+1),ce=Math.min(Math.pow(2,X),t>=5?2.2:14)*.9;_[T*5]=Math.min(U-.01,Math.max(z+.01,z+(T+.5+(r()-.5)*ce)*B)),_[T*5+1]=r(),_[T*5+2]=r(),_[T*5+3]=r(),_[T*5+4]=r(),Pe[T]=T,(T&255)===255&&await e.yield()}await e.yield(),Pe.sort((T,X)=>_[T*5]-_[X*5]),await e.yield();for(let T=0;T<de;T++){const X=Pe[T],ce=_[X*5],Ve=_[X*5+1],_e=_[X*5+2],Ke=_[X*5+3],je=_[X*5+4]<(y.skyShare??.06);if(!g&&t===0&&Math.abs(ce-c.x)<E.half)continue;const K=o(ce),Oe=t<=4&&Math.abs(ce-Be*(600-i.z)/1750)<(t===0?260:480);if(m.x=ce,m.z=i.z,m.picTop=K.T,m.h=K.h,m.r=K.r,m.slip=(_e-.5)*2*i.slip*(v==="breezy"?1.25:1),m.geoTop=je&&!Oe?He:K.T+i.slip*1.7*4+6,m.lag=.1+.7*Ve*Ve+.25*(.5+.5*h.n2(ce*.02,t*9.1)),m.phase=Ke,m.level=Fe(X+1),m.pitch=B*(g?1.8:ot[t]),m.bundleDx=f||g?K.bundleDx:0,m.delay=p,m.gustAt=R,Q(g?G.lens:f?G.snow:G.plain,m),(f||g)&&K.bundleDx!==0){const Ee=Math.round(K.bundleX*4);if(!N.has(Ee))N.add(Ee),j.push({x:K.bundleX,z:i.z,snow:K.snow,top:K.T,k:t});else{const Re=j[j.length-1];Re.z===i.z&&Math.abs(Re.x-K.bundleX)<.01&&(Re.top=Math.min(Re.top,K.T))}}(++re&31)===0&&await e.yield()}}await e.yield()}if(y.backdrop!==!1){const t=s.fork("sky"),i=[[-1750,6400,15],[-2150,7e3,19],[-2650,7600,24],[-3200,8200,30]];for(let r=0;r<i.length;r++){const[o,f,p]=i[r],R=Math.floor(f/p);for(let N=0;N<R;N++)m.x=-f/2+(N+.5+(t()-.5)*.7)*p,m.z=o,m.geoTop=He,m.picTop=0,m.h=[0,0,0,0],m.r=[0,0,0,0],m.slip=0,m.lag=0,m.phase=t(),m.level=Fe(N+1),m.pitch=p*(y.skyCover??.25),m.bundleDx=0,m.delay=9,m.gustAt=99,Q(G.plain,m)}}await e.yield(),await e.yield();const ke=t=>t.a.subarray(0,t.length*20),te={};for(const[t,i,r]of[["lens",W,1],["plain",b,2],["snow",S,3]]){const o=Ne(n,ke(G[t]),G[t].length,i,u);o.renderOrder=r,o.name="threads-"+t,q.add(o),te[t]=o,await e.yield()}const M={...x},Me=new a.ShaderMaterial({uniforms:M,side:a.DoubleSide,fog:!1,toneMapped:!1,vertexShader:`
    attribute vec4 aB0, aB1;                              // (x, y, z, half width)  (half height, start 0..1, seed, fold sign)
    uniform float uUnbind, uViewH; uniform vec3 uLancet;
    varying vec3 vQ;
    void main(){
      float go = clamp((uUnbind - aB1.y)*5./1.3, 0., 1.);                 // unwinds in 1.3 s, from its top down
      float yy = min(position.y, 1. - 2.*go);
      float alive = step(go, 0.999);
      if (abs(aB0.z) < 0.5 && abs(aB0.x) < uLancet.x) alive *= step(aB0.y + aB1.x + 6., uLancet.y*0.9);   // on the lancet: not before it is hoisted past them
      vec3 lc = (cameraPosition - modelMatrix[3].xyz)*mat3(modelMatrix);
      float px = length(vec3(aB0.x, aB0.y*aB1.w, aB0.z) - lc)*2./max(projectionMatrix[1][1]*uViewH, 1.);
      float hw = max(aB0.w, 1.3*px)*alive;
      vec3 p = vec3(aB0.x + position.x*hw*(1. - 0.25*go), (aB0.y + yy*max(aB1.x, 1.6*px))*aB1.w, aB0.z + 0.06);
      vQ = vec3(position.x, yy*aB1.x/max(aB0.w, 1e-3), aB0.w/max(px, 1e-5));
      gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.);
    }`,fragmentShader:`
    uniform vec3 uCotton, uAir;
    varying vec3 vQ;
    void main(){
      float wind = abs(fract(vQ.y*1.6 + vQ.x*0.55) - 0.5)*2.;              // the winding, turn on turn
      float line = smoothstep(0.72, 0.9, wind);
      line = mix(0.22, line, clamp((vQ.z - 4.)/6., 0., 1.));               // too fine to draw: its flat average
      gl_FragColor = vec4(mix(uCotton, uAir, line*0.8), 1.);
    }`}),d=(()=>{const t=[[-1,.55],[-.86,.9],[-.5,1.04],[0,1.1],[.5,1.04],[.86,.9],[1,.55]],i=[],r=[];for(const[f,p]of t)i.push(-p,f,0,p,f,0);for(let f=0;f<t.length-1;f++){const p=f*2;r.push(p,p+1,p+2,p+1,p+3,p+2)}const o=new a.BufferGeometry;return o.setAttribute("position",new a.Float32BufferAttribute(i,3)),o.setIndex(r),o})(),A=s.fork("bind"),k=[],P=[];for(const t of j){const i=ie[t.k],r=Math.max(i.pitch*8,14);if(t.top-t.snow<26)continue;const f=r*A.range(.5,.95),p=f*2+r*A.range(.12,.5);for(let R=t.snow+20+A.range(0,p*.5);R<t.top-f-6;R+=p*A.range(.8,1.25))(t.k===0?P:k).push([t.x,R,t.z,r*.3,f,t.k===0?A.range(-.3,.2):Math.max(0,(1-R/900)*1.2+A.range(0,.12)),A()])}A.shuffle(k),k.length=Math.min(k.length,Math.round(600*w));const ae=k.length;for(const t of P)k.push(t);const V=7.6+1.1,oe=[[c.x-V,c.y,c.z,1,1.7,99,.3],[c.x+V,c.y,c.z,1,1.7,99,.7],[c.x-V-.5,c.y-4.6,c.z,.22,3,99,.1],[c.x+V+.5,c.y-4.4,c.z,.22,2.8,99,.9],[c.x-V+.4,c.y-3.9,c.z,.2,2.2,99,.2],[c.x+V-.4,c.y-4.1,c.z,.2,2.4,99,.8]];oe.push([c.x,c.y-1.6,c.z+4.5,9.2,10.5,-1.64,.5]);const se=k.concat(oe),F=se.length*2;{const t=new Float32Array(F*4),i=new Float32Array(F*4);for(let f=0;f<F;f++){const p=se[f>>1],R=f&1?-1:1;t.set([p[0],p[1],p[2],p[3]],f*4),i.set([p[4],p[5],p[6],R],f*4)}const r=new a.InstancedBufferGeometry;r.index=d.index,r.setAttribute("position",d.getAttribute("position")),r.setAttribute("aB0",new a.InstancedBufferAttribute(t,4)),r.setAttribute("aB1",new a.InstancedBufferAttribute(i,4)),r.instanceCount=F;const o=new a.Mesh(r,Me);o.frustumCulled=!1,o.renderOrder=0,o.name="bindings",q.add(o),te.bind=o}await e.yield();const fe=new a.ShaderMaterial({uniforms:M,side:a.DoubleSide,fog:!1,toneMapped:!1,vertexShader:`
    attribute vec4 aR0, aR1;                              // (x, y, z, start 0..1)  (length, width, seed, fold sign * (1 + seconds it hangs before it lets go))
    uniform float uUnbind, uViewH;
    varying float vS; varying vec3 vR;
    void main(){
      float sg = aR1.w < 0. ? -1. : 1., hold = abs(aR1.w) - 1.;
      float t = (uUnbind - aR0.w)*5. - 0.5, tp = max(t, 0.);
      float len = aR1.x, V = 5. + sqrt(max(len, 0.));
      float s = position.y;                               // 0 the free end, 1 the end still wound on the bundle
      float pay = min(tp*5., (1. - s)*len);               // paying out: the free end runs down while the other is still wound on
      float t2 = max(t - hold - s*0.3, 0.);               // then it lets go and falls whole, twisting
      float fall = V*(t2 - (1. - exp(-1.6*t2))/1.6);
      float ph = aR1.z*6.2832, near = step(-1., aR0.z);
      float side = near > 0.5 ? (aR0.x < 0. ? -1. : 1.) : (aR1.z < 0.5 ? -1. : 1.);   // always away from the parting: nothing crosses the portal
      float A = 1.2 + len*0.06, k = (1. - s)*min(tp, 1.5)/1.5 + s*min(t2, 2.)*0.5;
      float paid = min(tp*5./max(len, 1.), 1.), slack = (1. - s)*(1. - s)*len*paid*(0.1 + 0.14*aR1.z);   // it hangs in a slack curve, the free end carried away from the parting
      vec3 c = vec3(aR0.x + A*k*sin(1.1*t + ph + s*2.6) + side*(slack + (0.5 + aR1.z*1.8)*t2),
                    max(aR0.y - pay - fall, 0.),
                    aR0.z + 1.5 + 0.8*A*k*(0.6 + 0.4*cos(1.9*t + ph*1.7 + s*2.)) + t2*mix(6. + len*0.3, 1.2, near));
      float th = 0.9*t + ph*2.3 + s*(5. + 3.5*aR1.z);      // the twist: two or three half turns along its length, turning slowly
      vec3 lc = (cameraPosition - modelMatrix[3].xyz)*mat3(modelMatrix);
      float dist = length(vec3(c.x, c.y*sg, c.z) - lc), px = dist*2./max(projectionMatrix[1][1]*uViewH, 1.);
      // a tape, never a slab: at least two pixels, at most a fiftieth of the frame's height, whatever its distance
      float w = min(max(aR1.y, 3.*px), 0.016*uViewH*px)*step(0., t)*smoothstep(0., 0.4, t)*smoothstep(0.5, 9., c.y)*(0.45 + 0.55*smoothstep(0., 0.1, s));
      w *= smoothstep(9., 24., dist);                     // nothing comes close: it tapers away before it could cross the lens
      float cx = cos(th); cx = (cx < 0. ? -1. : 1.)*max(abs(cx), 0.45);        // never quite edge-on: it must not vanish
      c += vec3(cx, 0.3*sin(th), 0.6*sin(th))*position.x*w;
      c.y *= sg; vS = sin(th); vR = vec3(position.x, s*len, w/max(px, 1e-5));
      gl_Position = w > 0. ? projectionMatrix*modelViewMatrix*vec4(c, 1.) : vec4(2., 2., 2., 1.);
    }`,fragmentShader:`
    uniform vec3 uCotton, uAir; varying float vS; varying vec3 vR;
    void main(){
      vec3 col = vS > 0. ? uCotton : uAir*0.88;                                 // its light face and its shaded face
      float line = step(0.78, fract(vR.y*0.8 + vR.x*0.6))*clamp((vR.z - 3.)/3., 0., 1.);   // the winding it came off, on tapes wide enough to draw it
      gl_FragColor = vec4(mix(col, uAir*0.8, line*0.55), 1.);
    }`});{const i=[],r=[];for(let g=0;g<=20;g++)i.push(-.5,g/20,0,.5,g/20,0);for(let g=0;g<20;g++){const z=g*2;r.push(z,z+1,z+2,z+1,z+3,z+2)}const o=s.fork("ribbons"),f=Math.round(170*w),p=[];for(let g=0;g<f&&k.length;g++)if(g<f*.22){const z=c.x+o.sign()*o.range(11,E.half-2);p.push([z,Math.min(E.top-E.drop*Math.pow(Math.min(Math.abs(z)/E.half,1),1.7)-2,228+(o.range(4,84)-4)*.45),0,o.range(-.8,.45),o.range(16,28),o.range(1.2,1.7),o(),g%5===0?o.range(9,14):o.range(2.5,7)])}else if(g<f*.42){const z=o.int(0,Math.min(G.plain.length-1,7e3))*20,U=G.plain.a.subarray(z,z+20),de=[U[0],Math.max(U[3]-o.range(0,30),20),U[1],o.range(.05,.85),o.range(18,32),o.range(.6,1),o(),o.range(1,4)];Math.abs(de[0])>E.half+8&&p.push(de)}else{const z=k[o.int(0,Math.max(ae-1,0))];p.push([z[0],z[1],z[2],z[5]+.02,o.range(60,140),o.range(3,5),o(),0])}const R=new Float32Array(p.length*8),N=new Float32Array(p.length*8);p.forEach((g,z)=>{for(let U=0;U<2;U++)R.set([g[0],g[1],g[2],g[3]],(z*2+U)*4),N.set([g[4],g[5],g[6],(U?-1:1)*(1+g[7])],(z*2+U)*4)});const Y=new a.InstancedBufferGeometry;Y.setAttribute("position",new a.Float32BufferAttribute(i,3)),Y.setIndex(r),Y.setAttribute("aR0",new a.InstancedBufferAttribute(R,4)),Y.setAttribute("aR1",new a.InstancedBufferAttribute(N,4)),Y.instanceCount=p.length*2;const B=new a.Mesh(Y,fe);B.frustumCulled=!1,B.renderOrder=0,B.name="ribbons",q.add(B),te.ribbons=B}const Se=et();{const t=s.fork("tapes"),i=[[0,620,14,.8],[1,900,30,1.2],[2,1e3,50,1.7]],r=new Float32Array(600*20);let o=0;for(const[p,R,N,Y]of i){for(let B=-R;B<R&&o<600;B+=N*t.range(.45,1.6)){const g=J[p](B).T,z=p===0&&Math.abs(B)<E.half+2;tt(r,o++,B,ie[p].z-1,z?g+6:Math.max(g-3,4),Y*(1+0*t.range(.7,1.35))*(z?.85:1),t()),r[(o-1)*20+15]=1}await e.yield()}const f=Ne(n,r.subarray(0,o*20),o,Se,u);f.renderOrder=2.5,f.name="sky-tapes",q.add(f),te.tapes=f}let O=null;y.air!==!1&&(O=new a.Mesh(new a.IcosahedronGeometry(1,2),new a.ShaderMaterial({uniforms:{uAir:x.uAir,uLow:x.uLow},side:a.BackSide,depthWrite:!1,depthTest:!1,fog:!1,toneMapped:!1,vertexShader:"varying float vY; void main(){ vec4 w = modelMatrix*vec4(position, 1.); vY = w.y; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:"uniform vec3 uAir; uniform vec4 uLow; varying float vY; void main(){ gl_FragColor = vec4(vY < 0. ? mix(uAir, uLow.rgb, min(uLow.a*2.5, 1.)) : uAir, 1.); }"})),O.scale.setScalar(y.airRadius??3e3),O.renderOrder=-.5,O.frustumCulled=!1,O.name="air",q.add(O)),await e.yield();const le=s.fork("storks"),he=[];for(let t=0;t<5;t++)he.push({k:t%3,y:le.range(60,105)+t%3*24,lead:t*.055+le.range(-.015,.015),ph:le()*3,bob:le.range(6,14)});const Te=t=>{const i=(t%2.1+2.1)%2.1,r=o=>{const f=Math.min(1,Math.max(0,o));return f*f*(3-2*f)};return 1-r((i-.35)/.3)-r((i-1)/.3)+2*r((i-1.7)/.35)},pe=t=>{for(let i=0;i<2;i++)for(let r=0;r<5;r++){const o=he[r],f=t-i*.45,p=(f-10)/20-o.lead+.1,R=x.uStork.value[i*9+r];if(p<0||p>1){R.set(0,-9999,-99999,0);continue}R.set(880-p*1760,o.y+Math.sin(f*.5+o.ph)*o.bob+14*Math.sin(p*3.1),ie[o.k].z,Te(f+o.ph))}};let we=-1;const xe=Ue.get("heroT"),Ae=Ue.get("heroCam"),ve=new a.Vector3,Z=(t,i,r)=>{const o=Math.min(1,Math.max(0,(r-t)/(i-t)));return o*o*(3-2*o)};function me(t,i,r){const o=we>=0?we*40:globalThis.__heroT!==void 0?globalThis.__heroT:xe!==null?parseFloat(xe):i%46;n.setClock(o),r&&(ve.setFromMatrixPosition(r.matrixWorld),q.worldToLocal(ve)),n.update(i,r,e.renderer,ve.y),v==="breezy"&&(x.uBreath.value+=.22+.16*Math.sin(i*.61)+.1*Math.sin(i*1.37)),x.uShift.value=H?30*Z(13.4,14.2,o)*(1-Z(22,25.5,o)):0,x.uLancet.value.y=60+380*Z(Ie[0],Ie[1],o),(y.cast===void 0||y.cast==="storks")&&pe(o),O&&O.position.copy(ve)}q.updateMatrixWorld(!0),me(0,0,null);const ze=ie[5],Ce={portalSeat:{position:new a.Vector3(c.x,c.y,c.z),normal:new a.Vector3(0,-.5,.866),tiltDeg:30,radius:7},lens:{center:new a.Vector3(c.x,c.y,c.z),halfWidth:7.6,halfHeight:17,tieBacks:[new a.Vector3(-V,c.y,0),new a.Vector3(V,c.y,0)]},flyThrough:[[0,5,1e3],[0,4,760],[25,9,560],[0,5,400],[0,12,352],[0,42,300],[0,99.5,200],[0,157,100],[0,180.4,60],[0,215,0]].map(t=>new a.Vector3(...t)),spurCrossings:[new a.Vector3(0,42,300),new a.Vector3(0,99.5,200),new a.Vector3(0,157,100)],viewpoints:{entry:new a.Vector3(0,5,1e3),image:new a.Vector3(25,9,560),climb:new a.Vector3(0,99.5,200)},summit:new a.Vector3(Be,ze.H,ze.z),lookAt:new a.Vector3(0,300,-600),sheets:ie.map(t=>({z:t.z,height:t.H,pitch:t.pitch}))};let ye=1300,be=900;const ge=new a.Vector3(0,300,-450);if(Ae){const t=Ae.split(",").map(Number);ye=t[0],be=t[1],ge.set(t[2],t[3],t[4])}return{object:q,radius:ye,height:be,center:ge,anchors:Ce,style:n,uniforms:x,meshes:te,variant:{season:l,weather:v,shift:H},setProgress(t){we=Math.min(1,Math.max(0,t))},update:me,dispose(){b.dispose(),S.dispose(),W.dispose(),d.dispose(),Se.dispose()},ground:!1,groundY:0}}export{Ge as AIR_HEX,De as BATHS,Xe as BREATHS,Le as DEFAULT_PALETTE,Qe as GUST,Ie as HOIST,He as SKY_TOP,We as STYLE_GLSL,Je as UNBIND_T,nt as bathFront,it as buildHero,Fe as keepLevel,Ye as makeDyeTable,Ne as makeSheetMesh,$e as makeStyle,tt as packSkyTape,at as packThread,et as skyStripGeometry,qe as stripGeometry};
