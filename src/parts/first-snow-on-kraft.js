import*as d from"three";import{clamp as K,lerp as k,smoothstep as qe}from"../kit/core.js";const pt=["#B98F62","#F6F1E4","#FFFDF6","#5B3B26","#D9652B","#E3D2B4"],zt=1;function yt(i){const q=document.createElement("canvas");q.width=256,q.height=64;const S=q.getContext("2d"),g=S.createImageData(256,64),R=g.data;for(let M=0;M<8;M++){const w=i.range(.05,.16),L=i.range(.1,.3),Y=i.range(-.8,.8),X=i.range(0,6.28),O=i.range(.35,.6);let le=i();for(let te=0;te<256;te++){const C=te/255,J=Math.min(qe(0,w,C),1-qe(1-L,1,C)),ne=3.3*(.35+.65*Math.sqrt(J))*(.9+.1*Math.sin(C*9+X)),z=3.5+Y*Math.sin(C*3.1+X)*.5;le=le*.72+i()*.28;for(let V=0;V<8;V++){const he=K(1.25-Math.abs(V-z)/ne,0,1),$=1-O+O*(.55*i()+.45*le*2-.2),x=K(he*(.55+.45*J)*$*1.25,0,1),m=((M*8+V)*256+te)*4;R[m]=R[m+1]=R[m+2]=Math.round(x*255),R[m+3]=255}}}S.putImageData(g,0,0);const I=new d.CanvasTexture(q);return I.minFilter=d.LinearFilter,I.magFilter=d.LinearFilter,I.generateMipmaps=!1,I.wrapS=I.wrapT=d.ClampToEdgeWrapping,I.colorSpace=d.NoColorSpace,I}const xt=`
  // the page's horizon as seen: world up projected to the screen (a bank tilts the page, not the marks on it)
  vec2 pageUp(mat4 vm){ vec2 u = (vm*vec4(0., 1., 0., 0.)).xy; float l = length(u); return l > 1e-3 ? u/l : vec2(0., 1.); }
  vec2 handAxis(vec2 up, float deg){ float a = radians(deg); vec2 hz = vec2(up.y, -up.x); return hz*cos(a) + up*sin(a); }
  float h11(float n){ return fract(sin(n*127.1 + 3.7)*43758.5453); }
`,ut=`
  uniform float uBolt;
  vec3 rigRot(vec3 p, vec3 c, vec3 ax, float a){ vec3 v = p - c; float s = sin(a), k = cos(a); return c + v*k + cross(ax, v)*s + ax*dot(ax, v)*(1. - k); }
  vec3 rigPose(vec3 p, vec3 piv, vec4 rig, float t, float s){
    float ph = rig.y*6.2831, part = rig.x; vec3 fw = vec3(cos(rig.z), 0., -sin(rig.z)), lat = vec3(-fw.z, 0., fw.x);
    if (part > 0.5 && part < 1.5) {                                   // head: slow swing, a dip, a look round
      p = rigRot(p, piv, lat, 0.10*sin(t*0.47 + ph) + 0.22*smoothstep(0.55, 1., sin(t*0.21 + ph*1.7)));
      p = rigRot(p, piv, vec3(0., 1., 0.), 0.30*sin(t*0.29 + ph*2.3));
    } else if (part > 1.5 && part < 2.5) {                            // tail: hangs, then flicks
      float fl = smoothstep(0.75, 1., sin(t*0.83 + ph)); p = rigRot(p, piv, fw, (0.08 + 0.75*fl)*sin(t*7.3 + ph));
    } else if (part > 2.5 && part < 3.5) {                            // one leg lifts and stamps
      float st = smoothstep(0.93, 1., sin(t*0.6 + ph)); p = rigRot(p, piv, lat, -0.7*st*abs(sin(t*5.)));
    } else if (part > 3.5) { p = rigRot(p, piv, lat, 0.55*sin(t*8.4 + piv.x*40.)); }
    float tau = s - rig.w, sh = rig.w > 0. ? smoothstep(0., 0.15, tau)*(1. - smoothstep(0.7, 1.3, tau)) : 0.;
    p += lat*((0.035*sin(t*0.37 + ph) + 0.05*sh*sin(tau*38.))*smoothstep(0., 1.2, p.y));   // weight shifts; the shake
    if (rig.w < -1.5) {                                               // the shedding: it starts and trots out the way it faces
      float tb = max(s - uBolt - 0.5*rig.y, 0.), e = smoothstep(0., 0.7, tb);
      p += fw*(30.*(1. - exp(-0.28*tb))*e) + vec3(0., 0.1*abs(sin(tb*8. + ph))*e*(1. - smoothstep(5., 8., tb)), 0.);
    }
    return p;
  }`,Ie=`
  attribute vec3 aPos; attribute vec4 aDim; attribute vec4 aLand;
  #if defined(LOOSE) || defined(BIRD) || defined(SNOW) || defined(FLOW)
  attribute vec3 aAlt;
  #endif
  #ifdef RIG
  attribute vec3 aPiv; attribute vec4 aRig;
  #endif
  uniform float uS, uTime, uDusk, uShedT, uBirdT, uLies, uStream[5]; uniform vec3 uTree; uniform vec2 uRes, uHaloR; uniform vec4 uGust, uFlockC, uFlockEnd, uHalo; uniform vec3 uFar, uCam, uFlockV;
  varying vec2 vUv; varying vec4 vInk, vLane; varying float vFlat, vTone, vNear;
  ${xt}
  ${ut}
  void main(){
    float T = aLand.x, ord = aLand.y, seed = aLand.z, flag = aLand.w;
    float len = aDim.x, wid = aDim.y, press = aDim.w;
    float resT = 1., pen = floor(aDim.z + 0.001), lanes = 1. + floor(fract(aDim.z)/0.06 + 0.5);   // a quad may carry a whole group of parallel strokes (lanes)
    vec3 P = aPos; float k = 1., grow = 1., ang = 55. + (seed - 0.5)*14., shift = 0., hard = 0., tl = 1., cap = 0., perched = 0.;
    #ifdef BIRD
      float tb = uS - uBirdT, tau = tb - T, wing = ord*2. - 1., th;
      if (tau < 0.) { perched = 1.;                                   // perched: a dab of two strokes that fidget
        float fid = smoothstep(0.6, 1., sin(uTime*0.9 + seed*40.));
        th = 62. - 26.*fid*abs(sin(uTime*9. + seed*17.)); P.y += 0.05*fid*abs(sin(uTime*6. + seed*9.));
      } else {                                                        // lifted: the two strokes open and close
        // off the bough in a scatter, then gathered into a flock that leads us down the last straight to the tear:
        // its centre runs along uFlockC + uFlockV*t, each bird keeps its own place in it (aAlt) and wanders a little
        float e = 1. - exp(-tau*2.3), j = smoothstep(0.6, uFlockC.w, tau);
        vec3 burst = vec3(-(0.3 + 0.95*h11(seed*5.3)), 0.5 + 0.75*h11(seed*9.1), 0.15 + 0.6*h11(seed*2.7))*(17.*e);   // out to port and toward the turn: onto blank paper, not across the white crown
        vec3 wob = vec3(sin(tau*1.1 + flag*6.3), 0.7*sin(tau*2.3 + seed*30.), cos(tau*0.9 + flag*5.1))*(1.3*e);
        vec3 C = uFlockC.xyz + uFlockV*tb + aAlt;
        P = mix(P + burst, C, j) + wob;
        th = 28. + 50.*sin(tau*13. + seed*25.); len *= 1. + 1.5*e;
        grow = 1. - smoothstep(uFlockEnd.w - 7., uFlockEnd.w, dot(P - uFlockC.xyz, uFlockEnd.xyz));   // into the tear, and gone
      }
      ang = wing > 0. ? th : 180. - th; shift = 0.46;
    #elif defined(SNOW)
      // the fall itself: strokes in the air, wrapped in a box (aAlt) round the eye, 4 m/s, turning lazily
      vec3 q0 = aPos*aAlt; q0.y -= uTime*(3.2 + 1.6*seed); q0.xz += vec2(sin(uTime*0.5 + seed*31.), cos(uTime*0.43 + seed*17.))*0.7;
      vec3 rel = mod(q0 - uCam, aAlt) - 0.5*aAlt, er = abs(rel)/(0.5*aAlt); P = uCam + rel;
      ang += 15.*sin(uTime*(0.45 + 0.6*seed) + seed*50.); grow = 1. - smoothstep(0.82, 1., max(er.x, max(er.y, er.z)));
    #else
      { vec3 w0 = (modelMatrix*vec4(aPos, 1.)).xyz;      // (round 19) beyond the stream, what the timetable lays before uLies was there from the start; not the tree (uTree: its place on the map and a radius)
        if (T >= 0. && T < uLies && w0.z > uStream[0] + uStream[1]*w0.x + uStream[2]*sin(w0.x*uStream[3] + uStream[4]) && distance(w0.xz, uTree.xy) > uTree.z) T = -9.; }
      tl = uS - T;
      if (ord < 0.5 && pen < 0.5) {                                // the one that falls (white only): 4 m/s, leaning the way the hand leans,
        if (tl < 0.) {                                                // rocking slowly as it comes down, still by the time it lands
          float f = -tl; cap = 1.; P.y += 4.*f; P.xz += vec2(sin(f*1.3 + seed*31.), cos(f*1.1 + seed*17.))*0.22*f;
          ang += 16.*sin(f*(1.1 + 0.9*seed) + seed*40.)*smoothstep(0., 0.7, f); grow = 1. - smoothstep(3.5, 4., f);
        }
      } else if (lanes < 1.5) k = clamp((tl - 0.083*max(ord, 1.))/0.12, 0., 1.);      // the rest (and every sepia or orange mark) are drawn on in place, along their length
      else k = step(0., tl);                                          // a group: its lanes are drawn on one after another in the fragment shader
      if ((flag > 8.8 && flag < 9.5) || (flag > 7.2 && flag < 7.3)) ang = 25. + (seed - 0.5)*10.;     // cross-hatch that is there whatever the hour
      if (flag > 1.5 && flag < 2.5) { ang = 25. + (seed - 0.5)*10.; k *= clamp((uDusk - (0.08 + 0.86*h11(seed*7.31)))/0.03, 0., 1.); }
      float shedF = (flag > 2.5 && flag < 3.5) ? clamp((flag - 3.)/0.45, 0., 1.) : ((flag > 8.55 && flag < 8.75) ? h11(seed*3.3 + 0.7) : -1.);
      if (shedF >= 0.) {                                              // shed: lets go from the tip inward (flag - 3 = how far in), falls as a sheet of hard white, is drawn again
        float ts = uS - uShedT - 1.5*shedF - 0.25*h11(seed + 0.21), tr = uShedT + 5.2 + 5.*h11(seed + 0.5) + 0.083*ord;
        if (ts > 0. && uS < tr) { P.y -= 2.4*ts*ts/(1. + 0.4*ts); P.x += 0.5*sin(ts*2. + seed*20.); ang += 18.*sin(ts*1.7 + seed*20.); grow *= step(0.08, P.y)*(1. - step(0.38, h11(seed*2.3 + 0.1))*step(0.3, ts)); k = 1.; hard = 0.95;       // (a good third of the load is the sheet, hard white: the rest is gone as it lets go, so the sheet stays strokes)
          float lo = smoothstep(0., 0.5, ts); len *= 1. + 0.6*lo; wid *= 1. + 0.3*lo; press = mix(press, h11(seed*1.7 + 0.3) > 0.4 ? 0.95 : 0.84, step(0.25, ts)); }
        else if (ts > 0.) k = clamp((uS - tr)/0.12, 0., 1.);
      }
    #endif
    #ifdef FLOW
      float fl = fract(uTime*0.06*(flag > 0.5 && flag < 1.5 ? 8. : 1.)*(0.7 + 0.6*seed) + seed*13.7); P += aAlt*(fl - 0.5);   // (flag 1: eight times as fast, falling snow) grow *= smoothstep(0., 0.2, fl)*(1. - smoothstep(0.8, 1., fl));
    #endif
    #if !defined(BIRD) && !defined(SNOW)
      if (flag > 4.5 && flag < 5.5) { ang += 4.5*sin(uTime*1.3 + seed*40. + aPos.x*0.25 + aPos.z*0.2); shift = 0.4; }      // moor grass trembles on its foot
      if (flag > 3.5 && flag < 4.5) { ang += 16. + 11.*sin(uTime*1.4 + seed*40. + aPos.x*0.3); shift = 0.42; }   // a rush: one long stroke that nods on its foot
    #endif
    #ifdef LOOSE
      float wx = (modelMatrix*vec4(aPos, 1.)).x, tg = (flag < 0.5 ? uGust.z : uGust.w) + (uGust.x - wx)/max(uGust.y, 0.1);
      float gf = clamp((uS - tg)/(1.5 + seed), 0., 1.), ge = gf*gf*(3. - 2.*gf), arc = sin(3.14159*gf);
      P = mix(P, aAlt, ge) + vec3(0., (1.1 + 1.4*seed)*arc, 0.); ang += arc*(seed - 0.5)*44.;
    #endif
    #ifdef RIG
      P = rigPose(P, aPiv, aRig, uTime, uS);
      if (aRig.w > 0. && seed > 0.42 && pen < 0.5) {              // the shake: half the white flies off; the snow finds it again
        float tq = uS - aRig.w - 0.15, tr = aRig.w + 2.5 + 5.*h11(seed + 0.3);
        if (tq > 0. && uS < tr) { P += normalize(vec3(h11(seed) - 0.5, 0.55, h11(seed + 0.7) - 0.5))*(3.4*tq) - vec3(0., 1.9*tq*tq, 0.); ang += 22.*sin(tq*7. + seed*30.); grow *= 1. - smoothstep(0.9, 1.6, tq); }
        else if (tq > 0.) k = clamp((uS - tr)/0.12, 0., 1.);
      }
    #endif
    vec4 mv = viewMatrix*modelMatrix*vec4(P, 1.);
    float dist = max(-mv.z, 0.1), px = 2.*dist/max(projectionMatrix[1][1]*uRes.y, 1.);
    // distance is drawn: longer, fewer, lighter, then nothing
    float back = step(6.5, flag)*step(flag, 8.75), tone0 = 1.;         // flags 7, 8: marks made for the distance, drawn the size they were given
    #ifdef SNOW
      grow *= smoothstep(1.6, 3.2, dist); cap = 1.;                   // nothing lands on the lens: a stroke fades out before it would fill the frame
    #endif
    #ifdef BIRD
      wid = max(wid, mix(2.3, 1.7, perched)*px); len = max(len, mix(mix(8., 11.5, 1. - smoothstep(3., 6., tau)), 4., perched)*px);   // off the bough each is a pair of strokes that can be counted
      grow *= step(perched*h11(seed*7.3 + 0.9), mix(1., 0.22, smoothstep(150., 230., dist)));   // from far down the valley the tree is its darks: only a few of the perched dabs are put in
    #else
      if (back < 0.5) { len *= 1. + dist*uFar.x; press *= mix(1., 0.62, smoothstep(60., 420., dist)); }
      if (cap > 0.5) grow *= step(h11(seed*4.7 + 0.3), mix(mix(1., 0.5, smoothstep(12., 42., dist)), 0.04, smoothstep(66., 96., dist)));   // the fall is seen near to; far off the snow simply comes to lie (no white curtain standing in front of the tree)
      else { tone0 = clamp(press*1.25, 0.3, 1.); press = press >= 0.9 ? press : 0.8; }   // pressure is their tone
      if (flag > 8.2 && flag < 8.75) { float dn = 26. + 12.*h11(seed*5.7 + 0.2); grow *= smoothstep(dn, dn + 12., dist)*step(h11(seed*8.9 + 0.6), 1. - 0.6*smoothstep(170., 260., dist)); }   // 8.3: the snow along a bough, a broad group standing for its twigs' worth of strokes
      else if (flag > 7.5 && flag < 8.5) { float dn = 70. + 60.*h11(seed*5.7 + 0.2); grow *= smoothstep(dn, dn + 30., dist)*(pen < 0.5 ? 1. - 0.85*smoothstep(160., 225., dist) : 1.); }   // ... the far white fewer still from the far end   // 8: only from far off (finer marks take over near to)
    #endif
    #if !defined(BIRD) && !defined(RIG)
      // THE RESERVE: the draughtsman leaves the paper round the white crown unfinished. Whatever lies beyond the tree (hillside, cloud,
      // far hills) dies away toward the crown as it stands on the page: over a band of 50 to 70 px the groups get fewer, then smaller
      // and lighter, the last ones single strokes; the edge wanders with the angle round the crown (no straight run, no corner), sits
      // close under the boughs and wider over the top. Marks flagged 7.6 are let through (the hill's foot and skyline, the sky's wash).
      if (uHalo.w > 0. && !(flag > 7.55 && flag < 7.65)) {
        vec4 hc = viewMatrix*vec4(uHalo.xyz, 1.); float hd = -hc.z;
        if (hd > 1. && dist > hd + uHaloR.x*1.15 + 2.) {
          float hpx = 2.*hd/max(projectionMatrix[1][1]*uRes.y, 1.);
          vec2 dp = (mv.xy/dist - hc.xy/hd)*(hd/hpx), rp = uHaloR/hpx + 8.*clamp(uHaloR.x/hpx/70., 0.3, 1.);
          rp.y *= dp.y > 0. ? 1.2 : 0.84;
          float th = (abs(dp.x) + abs(dp.y) > 1e-3) ? atan(dp.y, dp.x) : 0.;
          float rr = 1. + 0.12*sin(th*3. + 1.3) + 0.09*sin(th*7. + 4.1) + 0.06*sin(th*13. + 0.7) + 0.05*sin(th*23. + 2.9);
          float e = (length(dp/max(rp, vec2(1.)))/rr - 1.)/0.5, es = clamp(e, 0., 1.), hk = h11(seed*6.1 + 0.77);
          float rs = mix(1., es, uHalo.w);
          grow *= step(hk*0.92 + 0.04, mix(1., es*(2. - es), uHalo.w));                  // fewer ...
          len *= mix(0.42, 1., rs); wid *= mix(0.3, 1., rs*rs); resT = mix(0.72, 1., rs);   // ... then smaller and lighter, down to single strokes
        }
      }
    #endif
    if (cap > 0.5) { len = min(len, 13.*px); wid = min(wid, 2.4*px); }                  // a flake in the air is a short stroke, however near the eye
    #if !defined(BIRD) && !defined(SNOW)
      { float lcap = 0.111*uRes.y, lpx = len/px; if (lpx > lcap) len = px*(lcap + 0.35*(lpx - lcap)); }       // (5c, G5) the pencil's reach: near the eye a stroke is a hand's stroke on the page, not a plank
    #endif
    float single = step(lanes, 1.5);
    lanes = lanes > 1.5 ? clamp(floor(wid/(2.6*px)), 1., lanes) : 1.;                   // far off the hand lays fewer, broader strokes in the same patch: never a lane finer than 2.6 px
    float lw = wid/lanes, laneMix = 1.;
    // (5c, G5) near the eye a stroke is never drawn thicker than the pencil: a lane wider than 8 px keeps a 5 px stroke and leaves paper beside it;
    // from 3 px up the stroke shows the paper's tooth (vNear), whatever the pressure
    float pk = max(uRes.y/450., 1.), lwp = lw/(px*pk), lscale = max(1.5, lwp/5.3), spx = single > 0.5 ? wid/(px*pk) : min(lwp/1.5, 5.3);   // (sizes on the sheet: px of a 450-line page)
    vNear = cap > 0.5 ? 0. : smoothstep(2.8, 4.8, spx)*(0.5 + 0.5*h11(seed*9.7 + 0.13));
    #ifndef BIRD
      if (single > 0.5 && cap < 0.5) wid = min(wid, 6.5*px*pk);
    #endif
    float w = max(wid, 1.5*px), thin = sqrt(clamp(wid/w, 0., 1.)), lf = mix(1., clamp(len/(4.*px), 0., 1.), smoothstep(150., 230., dist)); len = max(len, 4.*px);
    vTone = clamp(thin*1.15, 0.5, 1.)*mix(pen < 0.5 ? 0.74 : 0.86, 1., laneMix)*tone0*resT;   // a mark widened to stay visible is drawn lighter: exact pigment whenever it is its true width
    #ifdef BIRD
      vTone = max(vTone, 0.94);                                       // a bunting is small and stays white
    #else
      float six = step(5.5, flag)*step(flag, 6.5), elev = six > 0.5 ? clamp((uCam.y - (modelMatrix*vec4(P, 1.)).y)/dist, 0., 1.) : 1.;
      if (six > 0.5) vTone = max(vTone, 0.92*smoothstep(0.1, 0.24, elev));   // a drift drawn to be seen from above keeps its white from up there ...
      vTone = max(vTone, hard);
      // a single stroke too fine to draw is not drawn paler: fewer of them are drawn, each in the pencil's own colour (white or absent)
      float pure = single*(1. - back)*(1. - smoothstep(0.72, 0.97, thin)), tOld = vTone; vTone = mix(vTone, 1., pure);
      // ... and stands for several: keep only as many as hold the same tone (no white-out far off)
      float keep = min(clamp(uFar.y/dist, 0.3, 1.), clamp(1.9*thin*thin*lf - 0.06, 0., 1.))*clamp(3.4*elev, 0.16, 1.);   // (from the far end of the valley a mark lengthened to stay visible counts for less again: the far tree is its darks, not a white burst)   // ... and seen edge-on from low down, where a metre of moor is a sliver, only a few of them stand
      keep *= mix(1., clamp(1.5*tOld, 0., 1.), pure);
      if (back < 0.5) grow *= (1. - smoothstep(keep, keep + 0.08, h11(seed*3.1 + 0.4)))*(1. - smoothstep(uFar.z*0.8, uFar.z, dist));
    #endif
    vFlat = smoothstep(max(lw, 1.5*px)/9., max(lw, 1.5*px)/4.5, px); vLane = vec4(lanes, tl, lscale, ord);
    vec2 up = pageUp(viewMatrix), ax = handAxis(up, ang), pr = vec2(-ax.y, ax.x), q = position.xy;
    #ifdef RIG
      mv.xyz *= 1. - min(0.45, 0.3*dist)/dist;                        // an animal's marks clear the round of its (unseen) body
    #else
      mv.xyz *= 1. - 0.06/dist;                                       // 6 cm toward the eye
    #endif
    float along = (q.x + 0.5)*k;
    mv.xy += (ax*(len*(along - 0.5 + shift)) + pr*(w*q.y))*grow;
    vUv = vec2(along, q.y + 0.5); vInk = vec4(pen, press, seed, len);
    gl_Position = (k*grow < 1e-3) ? vec4(2., 2., 2., 1.) : projectionMatrix*mv;
  }`,Ee=`
  uniform sampler2D uAtlas; uniform vec3 uPaperD, uWhiteD, uWaxD, uSepiaD, uOrangeD;
  varying vec2 vUv; varying vec4 vInk, vLane; varying float vFlat, vTone, vNear;
  void main(){
    float press = vInk.y, wax = step(0.9, press), row = floor(clamp(vInk.z, 0., 0.999)*8.);
    vec2 uv = vUv;
    if (vLane.x > 1.5) {                                              // a group of hatching: several strokes side by side in one quad
      float ly = vUv.y*vLane.x, j = min(floor(ly), vLane.x - 1.); ly -= j;
      float h1 = fract(sin((vInk.z*91.7 + j)*12.9898)*43758.5453), h2 = fract(h1*7.31 + 0.37);
      float a = (0.22 + 0.2*vNear)*h1*h1, b = 1. - (0.26 + 0.2*vNear)*h2*h2;                      // each starts and stops where the hand did
      float u = (vUv.x - a)/(b - a), y = (ly - 0.5)*vLane.z + 0.5 + (vUv.x - 0.5)*(h2 - 0.5)*0.8*(vLane.z - 1.);   // paper between the lanes; no two quite parallel
      float on = vLane.y < 0. ? (abs(j - floor(vLane.x*0.5)) < 0.5 ? 1. : 0.) : clamp((vLane.y - 0.083*(vLane.w + j))/0.12, 0., 1.);   // the lead falls alone; the rest are drawn beside it, twelve a second
      if (u < 0. || u > on || y < 0. || y > 1.) discard;
      uv = vec2(u, y); row = mod(row + j, 8.);
    }
    float c = texture2D(uAtlas, vec2(uv.x, (row + 0.1 + 0.8*uv.y)/8.)).r;
    float rb = abs(fract(uv.x*vInk.w/0.08 + vInk.z*5.) - 0.5)*2.;     // the paper's ribbing breaks a light stroke every 8 cm
    float fine = c - smoothstep(0.7, 1., rb)*0.55*(1. - press) - mix(0.74, 0.16, press)*(1. - wax) - 0.07*wax - vNear*(0.2 + 0.26*smoothstep(0.5, 1., rb));
    float ends = min(smoothstep(0., 0.14, uv.x), 1. - smoothstep(0.78, 1., uv.x));
    float flatC = ends*(1. - abs(uv.y - 0.5)*2.)*1.7 - mix(0.8, 0.3, press);            // too small for tooth: the flat average tint instead
    if (mix(fine, flatC, vFlat) < 0.) discard;
    vec3 ink = vInk.x < 0.5 ? mix(uWhiteD, uWaxD, wax) : (vInk.x < 1.5 ? uSepiaD : uOrangeD);
    gl_FragColor = vec4(mix(uPaperD, ink, vTone), 1.);
  }`,Oe=`
  #ifdef RIG
  attribute vec3 aPiv; attribute vec4 aRig; uniform float uS, uTime;
  ${ut}
  #endif
  #ifdef SHADE
  #ifndef RIG
  attribute vec3 aPiv; attribute float aLit;
  #endif
  uniform vec2 uRes; varying vec4 vHatch; varying float vDuty;
  #endif
  void main(){
    vec3 P = position;
    #ifdef RIG
      P = rigPose(P, aPiv, aRig, uTime, uS);
    #endif
    #ifdef SHADE
      // Shaded solids: sepia hatching inside the outline. An animal's flank, legs, neck and tail (its back is left for the snow); the
      // tree's wood wherever aLit < 0 (all of it but the edge turned to the light and the tops of the boughs). The hatch is pinned to
      // the part's pivot on the page and is a pencil line wide there (never finer than 2.8 px), so it rides with the part.
      vec4 pc = projectionMatrix*viewMatrix*modelMatrix*vec4(aPiv, 1.); float pw = max(pc.w, 0.5);
      #ifdef RIG
        float dark = (aRig.x > 0.5 && aRig.x < 2.5) ? -1. : P.y - aPiv.y - 0.2, per = 0.085, duty = 0.62;
      #else
        float dark = aLit, per = 0.3, duty = mix(0.62, 0.97, smoothstep(100., 210., pw));   // from far off the wood is laid in solid: a limb two pixels wide cannot be hatched
      #endif
      vHatch = vec4((pc.xy/pw*0.5 + 0.5)*uRes, max(per*projectionMatrix[1][1]*uRes.y*0.5/pw, 2.8), dark);
      vDuty = duty;
    #endif
    gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(P, 1.);
  }`,Ce=`
  uniform vec3 uPaperS;
  #ifdef SHADE
  uniform vec3 uSepiaD; varying vec4 vHatch; varying float vDuty;
  #endif
  void main(){
    vec3 col = uPaperS;
    #ifdef SHADE
      if (vHatch.w < 0.) {
        vec2 d = (gl_FragCoord.xy - vHatch.xy)/vHatch.z;
        float c = d.y*0.5736 - d.x*0.8192, al = d.x*0.5736 + d.y*0.8192, h = fract(sin(floor(c)*12.9898)*43758.5453);
        col = mix(col, uSepiaD, step(fract(c), vDuty)*step(0.1*step(vDuty, 0.9), fract(al*0.09 + h)));    // each line stops and starts where the hand did
      }
    #endif
    gl_FragColor = vec4(col, 1.);
  }`,Ae=i=>new d.Color(i);function kt(i,n={}){const s=n.palette||pt,q=i.rng.fork("kraft-style"),S={uS:{value:0},uTime:{value:0},uLies:{value:-1},uStream:{value:[0,0,0,0,0]},uTree:{value:new d.Vector3},uDusk:{value:0},uShedT:{value:1e6},uBirdT:{value:30},uFlockC:{value:new d.Vector4(-14,26,36,2.4)},uFlockV:{value:new d.Vector3(-11.8,2.1,0)},uFlockEnd:{value:new d.Vector4(-.985,.174,0,1e5)},uRes:{value:new d.Vector2(1280,720)},uCam:{value:new d.Vector3},uBolt:{value:1e6},uGust:{value:new d.Vector4(60,12,19,30)},uFar:{value:new d.Vector3(1/45,120,600)},uHalo:{value:new d.Vector4(0,20,0,0)},uHaloR:{value:new d.Vector2(26,16)},uAtlas:{value:yt(q)},uPaperD:{value:Ae(s[0])},uWhiteD:{value:Ae(s[1])},uWaxD:{value:Ae(s[2])},uSepiaD:{value:Ae(s[3])},uOrangeD:{value:Ae(s[4])},uPaperS:{value:Ae(s[0])}},g=(I,M,w,L)=>new d.ShaderMaterial({uniforms:S,defines:I,vertexShader:M,fragmentShader:w,side:L,fog:!1,toneMapped:!1}),R={uniforms:S,palette:s,PEN:{white:0,sepia:1,orange:2},paper:g({},Oe,Ce,d.DoubleSide),paperRig:g({RIG:1},Oe,Ce,d.DoubleSide),paperRigDark:g({RIG:1,SHADE:1},Oe,Ce,d.DoubleSide),paperDark:g({SHADE:1},Oe,Ce,d.DoubleSide),stroke:g({},Ie,Ee,d.DoubleSide),strokeRig:g({RIG:1},Ie,Ee,d.DoubleSide),strokeLoose:g({LOOSE:1},Ie,Ee,d.DoubleSide),strokeBird:g({BIRD:1},Ie,Ee,d.DoubleSide),strokeSnow:g({SNOW:1},Ie,Ee,d.DoubleSide),strokeFlow:g({FLOW:1},Ie,Ee,d.DoubleSide),paperScene:Ae(s[0]),duskHint:n.duskHint??0,setSeconds(I){S.uS.value=I,S.uDusk.value=K(R.duskHint+(1-R.duskHint)*qe(8,40,I),0,1)},update(I,M){S.uTime.value=I,M&&M.getWorldPosition(S.uCam.value),i.renderer&&i.renderer.getDrawingBufferSize(S.uRes.value)},sky(I=2500){const M=new d.Mesh(new d.SphereGeometry(I,16,8),g({},Oe,Ce,d.BackSide));return M.material.depthWrite=!1,M.renderOrder=-1,M.frustumCulled=!1,M}};return R}class $e{constructor(n=""){this.kind=n,this.pos=[],this.dim=[],this.land=[],this.alt=[],this.piv=[],this.rig=[],this.n=0}add(n,s,q,S,g,R,I,M,w,L,Y=0){return this.pos.push(n,s,q),this.dim.push(S,g,R,I),this.land.push(M,w,L,Y),this.n++}group(n,s,q,S,g,R,I,M,w,L,Y,X=0){return this.add(n,s,q,S,g,I+(Math.min(7,Math.max(1,R))-1)*.06,M,w,L,Y,X)}setAlt(n,s,q){this.alt.push(n,s,q)}setRig(n,s,q,S,g,R,I){this.piv.push(n,s,q),this.rig.push(S,g,R,I)}}const Mt=new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0]);function bt(i,n=new d.Vector3,s=1e4){const q=new d.InstancedBufferGeometry;q.setAttribute("position",new d.BufferAttribute(Mt,3)),q.setIndex([0,1,2,0,2,3]);const S=(g,R,I)=>{R.length&&q.setAttribute(g,new d.InstancedBufferAttribute(new Float32Array(R),I))};return S("aPos",i.pos,3),S("aDim",i.dim,4),S("aLand",i.land,4),S("aAlt",i.alt,3),S("aPiv",i.piv,3),S("aRig",i.rig,4),q.instanceCount=i.n,q.boundingSphere=new d.Sphere(n.clone(),s),q}function nt(i,n,s,q=1,S=null,g=null){const R=s.pos.length/3,I=i.length;let M=0,w=0,L=0,Y=!0;for(let X=0;X<I;X++){const O=i[Math.max(0,X-1)],le=i[Math.min(I-1,X+1)],te=i[X];let C=le[0]-O[0],J=le[1]-O[1],ne=le[2]-O[2];const z=Math.hypot(C,J,ne)||1;C/=z,J/=z,ne/=z,Y&&(Math.abs(J)<.9?(M=0,w=1,L=0):(M=1,w=0,L=0),Y=!1);const V=M*C+w*J+L*ne;M-=V*C,w-=V*J,L-=V*ne;const he=Math.hypot(M,w,L)||1;M/=he,w/=he,L/=he;const $=J*L-ne*w,x=ne*M-C*L,m=C*w-J*M;for(let G=0;G<n;G++){const H=G/n*Math.PI*2,b=Math.cos(H)*te[3],B=Math.sin(H)*te[3]*q;if(s.pos.push(te[0]+M*b+$*B,te[1]+w*b+x*B,te[2]+L*b+m*B),s.lit){const W=Math.cos(H),oe=Math.sin(H);s.lit.push(s.litFn(M*W+$*oe,w*W+x*oe,L*W+m*oe)),s.piv.push(i[0][0],i[0][1],i[0][2])}S&&(S.piv.push(g[0],g[1],g[2]),S.rig.push(g[3],g[4],g[5],g[6]))}if(X>0)for(let G=0;G<n;G++){const H=R+(X-1)*n+G,b=R+(X-1)*n+(G+1)%n,B=H+n,W=b+n;s.idx.push(H,B,b,b,B,W)}}return R}async function St(i,n,s,q){const S=[],g=(x,m,G)=>[x,m,G],R=(x,m,G)=>{const H=x-s.cx,b=G-s.cz,B=Math.atan2(H,b),W=s.crownR*(1+.13*n.n2(Math.cos(B)*1.3+s.k,Math.sin(B)*1.3))*(1+.1*Math.cos(B-s.leanAz)),oe=m-s.crownY,A=oe>0?s.height-s.crownY:s.crownY-s.lowY;return Math.sqrt((H*H+b*b)/(W*W)+oe*oe/(A*A))},I=[2,1.5,1.1,.8,.55,.42],M=[.07,.3,.36,.42,.5,.55],w=[0,30,13,5.6,3.1,1.7],L=[0,1.9,1.3,1,.8,9],Y=[];function X(x,m,G,H,b,B){const W=[[x[0],x[1],x[2],H]],oe=Math.max(2,Math.round(G/I[b]));let A=m.slice(),N=x.slice(),fe=b===0?1e9:L[b]*i.range(.9,1.6)+(b===1?2.5:.3),Z=0,se=i.sign();const ge=[];for(let _=1;_<=oe;_++){const De=_/oe,re=M[b];A=[A[0]+i.range(-re,re),A[1]+i.range(-re,re)*.8,A[2]+i.range(-re,re)];const ve=R(N[0],N[1],N[2]),r=Math.hypot(A[0],A[2]);if(b>=1){if(A[1]+=b===1?De<.45?-.05:.11:.05+.05*(ve>.8?1:0),ve>.82){const T=(ve-.82)*2.2,ee=Math.hypot(N[0],N[2])||1;A[0]-=N[0]/ee*T*r,A[2]-=N[2]/ee*T*r,A[1]-=Math.sign(N[1]-s.crownY)*T*.5}N[1]<s.lowY+1.5&&(A[1]+=.16)}const f=Math.hypot(A[0],A[1],A[2])||1;A=[A[0]/f,A[1]/f,A[2]/f];const y=G/oe;N=[N[0]+A[0]*y,N[1]+A[1]*y,N[2]+A[2]*y],Z+=y;const P=Math.max(s.rMin[b],H*Math.pow(1-.82*De,b<=1?.8:1));if(W.push([N[0],N[1],N[2],P]),b>=1&&R(N[0],N[1],N[2])>1.04)break;for(;b>=1&&b<5&&Z>=fe&&fe<G*.97;){const T=Z-fe,ee=[N[0]-A[0]*T,N[1]-A[1]*T,N[2]-A[2]*T],ae=fe;fe+=L[b]*i.range(.75,1.3),se=-se;let ie=A[2]*se,ce=i.range(.1,.75),j=-A[0]*se;const ye=i.range(-.5,.5);ie+=A[0]*ye,j+=A[2]*ye;const we=i.range(.7,1.2),We=Math.cos(we),ke=Math.sin(we),Ve=[A[0]*We+ie*ke,A[1]*We+ce*ke,A[2]*We+j*ke],Ge=Math.min(w[b+1],(G-ae)*i.range(.55,.95)+w[b+1]*.3)*i.range(.75,1.1);ge.push([ee,Ve,Ge,Math.max(s.rMin[b+1],P*i.range(.42,.6))])}}let de=0;for(let _=1;_<W.length;_++)de+=Math.hypot(W[_][0]-W[_-1][0],W[_][1]-W[_-1][1],W[_][2]-W[_-1][2]);const Q={pts:W,depth:b,limb:B,len:de,order:S.length};S.push(Q);for(const _ of ge)Y.push([_[0],_[1],_[2],_[3],b+1,B]);return Q}const O=[],le=s.lean,te=s.leanAz,C=s.forkY;for(let x=0;x<=8;x++){const m=x/8,G=-.6+(C+.6)*m,H=Math.sin(m*3+s.k)*.5*m,b=1.12+.42*Math.pow(1-m,1.5)+1*Math.pow(Math.max(0,1-G/2.6),2.2)+.12*Math.sin(m*7+s.k*3);O.push([Math.sin(te)*(le*m*C+H),G,Math.cos(te)*(le*m*C)-H*.6,b])}S.push({pts:O,depth:0,limb:0,len:C+.6,order:0});const J=x=>{const m=K((x+.6)/(C+.6),0,1)*8,G=Math.min(7,Math.floor(m)),H=m-G;return O[G].map((b,B)=>k(b,O[G+1][B],H))};let ne=0;const z=s.nLow,V=s.nLead,he=i.range(0,6.28),$=i.range(0,6.28);for(let x=0;x<z+V;x++){const m=x<z,G=m?k(s.lowY+.2,C-2.2,z>1?x/(z-1):.3)+i.range(-.3,.6):C-i.range(0,.8),H=J(G),b=m?i.range(.1,.36):x===z?i.range(1.2,1.36):i.range(.7,1.15),B=m?i.range(.46,.62):i.range(.55,.78);ne=(m?he+x/z*6.283*(z>4?2:1):$+(x-z)/V*6.283)+i.range(-.4,.4);const W=[Math.sin(ne)*Math.cos(b),Math.sin(b),Math.cos(ne)*Math.cos(b)];X(g(H[0]+W[0]*H[3]*.55,G,H[2]+W[2]*H[3]*.55),W,m?i.range(19,25):i.range(24,30),B,1,x+1)}for(let x=0;x<Y.length;x++){const m=Y[x];X(m[0],m[1],m[2],m[3],m[4],m[5]),x%250===249&&await q.yield()}S.sort((x,m)=>x.limb-m.limb||x.depth-m.depth);for(let x=0;x<S.length;x++)S[x].order=x;return S}const xe=new d.Vector3(.55,.31,-.78).normalize();function Rt(i,n,s){const{ox:q,oz:S,yaw:g,sc:R,phase:I,shakeT:M,headDrop:w}=s,L=s.oy||0,Y=i.paper,X=i.rig,O=i.strokes,le=s.bold||1,te=s.rich||1,C=r=>Math.round(r*te),[J,ne,z]=s.kind==="hind"?[1.04,1.2,.82]:s.kind==="sheep"?[.82,.8,1.15]:[1,1,1],V=Math.cos(g),he=-Math.sin(g),$=Math.sin(g),x=Math.cos(g),m=(r,f,y)=>[q+(V*r*J+$*y*z)*R,L+f*ne*R,S+(he*r*J+x*y*z)*R],G=r=>r.map(f=>{const y=m(f[0],f[1],f[2]);return[y[0],y[1],y[2],f[3]*R]}),H=(r,f,y,P,T)=>{const ee=m(T[0],T[1],T[2]);nt(G(r),f,Y,y,X,[ee[0],ee[1],ee[2],P,I,g,M])},b=n.sign(),B=w,W=[[.6,1],[.4,-1],[-.44,1],[-.66,-1]];H([[-.78,1,0,.2],[-.62,1.02,0,.33],[-.3,1,0,.385],[.1,.97,0,.4],[.45,1,0,.37],[.66,1.05,0,.27],[.74,1.08,0,.14]],8,.8,0,[0,1,0]),H([[.56,1.06,0,.27],[.8,1.28-B*.3,0,.2],[1,1.5-B,0,.16],[1.18,1.46-B*1.3,0,.14],[1.4,1.28-B*1.6,0,.09],[1.47,1.2-B*1.7,0,.055]],6,.75,1,[.58,1.08,0]),H([[-.76,1.14,0,.07],[-.92,.9,0,.1],[-.98,.5,0,.075],[-.96,.32,0,.03]],5,.8,2,[-.76,1.14,0]);for(const[r,f]of W){const y=r>0&&f===b,P=r>0?0:-.07;H([[r,.95,f*.15,.15],[r+P,.56,f*.16,.08],[r-P*.6,.14,f*.16,.055],[r-P*.6+.03,0,f*.16,.075]],5,1,y?3:0,[r,.92,f*.15])}const oe=s.T0+n.range(0,1.5);let A=0,N=oe,fe=0;const Z=(r,f,y,P,T,ee,ae,ie)=>{fe<=0&&(fe=5+n.int(0,1),A=0,N=oe+n.range(0,s.spread??4.5)+(P?1:0)),fe--;const ce=m(r,f,y),j=m(ie[0],ie[1],ie[2]);O.add(ce[0],ce[1],ce[2],ee*R*(s.lenBold??le),n.range(.034,.048)*(.4+.6*le),P,T,P?-9:N,P?Math.max(A++,1):A++,n(),0),O.setRig(j[0],j[1],j[2],ae,I,g,M)},se=$*xe.x+x*xe.z>0?-1:1,ge=r=>.4-.22*Math.pow(Math.abs(r-.05)/.8,2.2),de=[0,1,0],Q=[.58,1.08,0],_=[-.76,1.14,0],De=()=>n.range(.15,.22),re=()=>n.range(.6,.85);for(let r=0,f=C(24);r<f;r++){const y=-.38+(r+n())/f,P=n.range(-.55,.55),T=ge(y);Z(y,1.02+Math.cos(P)*T,Math.sin(P)*T*.8,0,re(),De(),0,de)}fe=0;for(let r=0,f=C(12);r<f;r++){const y=n.range(-.8,-.38),P=n.range(-.9,.9),T=ge(y);Z(y,1.02+Math.cos(P)*T,Math.sin(P)*T*.8,0,r%3===0?.95:re(),De(),0,de)}fe=0;for(let r=0,f=C(12);r<f;r++){const y=(r+n())/f;Z(k(.6,1,y),k(1.36,1.68-B,y),n.range(-.06,.06),0,re(),n.range(.2,.3),1,Q)}for(let r=0;r<6;r++){const f=(r+n())/6;Z(k(1.02,1.42,f),k(1.67-B,1.38-B*1.6,f),n.range(-.04,.04),0,re(),n.range(.12,.16),1,Q)}for(const r of[-1,1])Z(.99,1.75-B,r*.055,0,.95,.12,1,Q);for(let r=0;r<4;r++){const f=(r+n())/4;Z(k(-.8,-1.02,f),k(1.22,.78,f),0,0,re(),.18,2,_)}fe=0;for(let r=0,f=C(14);r<f;r++){const y=-.5+(r+n())/f,P=n.range(-.5,.5),T=ge(y);Z(y,.99-Math.cos(P)*T,Math.sin(P)*T*.8+se*.05,1,re(),n.range(.16,.24),0,de)}for(let r=0;r<5;r++){const f=(r+n())/5;Z(k(-.93,-.97,f),k(.85,.36,f),0,1,re(),.2,2,_)}for(let r=0;r<6;r++){const f=(r+n())/6;Z(k(.68,1.3,f),k(.93,1.2-B*1.5,f),se*.05,1,n.range(.5,.75),.18,1,Q)}for(const[r,f]of W){const y=r>0&&f===b,P=C(f===se?5:3);fe=0;for(let T=0;T<P;T++)Z(r+n.range(-.03,.03)+(r<0?-.05:0),k(.76,.1,(T+n()*.6)/P),f*.16+se*.03,1,n.range(.55,.8),n.range(.13,.18),y?3:0,[r,.92,f*.15])}for(let r=0,f=C(5);r<f;r++){const y=-.72+1.3*(r+n())/f,P=m(y,1.06+ge(y)*.98,n.range(-.06,.06)),T=m(0,1,0);O.group(P[0],P[1],P[2],n.range(.26,.34)*R,n.range(.3,.38)*R,5,0,r%2?.95:n.range(.74,.88),s.T0<0||n()<.5?-9:oe+n.range(0,3),0,n(),0),O.setRig(T[0],T[1],T[2],0,I,g,M)}const ve=s.redLen??1;if(s.red){const r=s.kind==="sheep",f=r?-.62:-.42,y=r?-.3:.5;fe=0;for(const P of[-1,1])for(let T=0,ee=Math.round(C(9)*s.red);T<ee;T++){const ae=k(f,y,(T+n())/ee),ie=r?n.range(.1,.7):n.range(.55,1.35),ce=ge(ae)+.02;Z(ae,1+Math.cos(ie)*ce,P*Math.sin(ie)*ce*.82,2,n.range(.84,.95),n.range(.2,.3)*ve,0,de)}if(!r)for(const P of[-1,1])for(let T=0;T<Math.round(5*s.red);T++){const ee=(T+n())/5;Z(k(.66,1.02,ee),k(1.16,1.44-B,ee),P*.17,2,n.range(.84,.95),n.range(.16,.24)*ve,1,Q)}}if(s.far){const r=(f,y,P,T,ee,ae,ie,ce,j)=>{const ye=m(f,y,P),we=m(j[0],j[1],j[2]);O.add(ye[0],ye[1],ye[2],T*R,ee*R,ae,ie,ae?-9:s.T0+n.range(0,3),1,n()*.4,s.far===!0?8:7),O.setRig(we[0],we[1],we[2],ce,I,g,M)};for(const f of[-.62,-.34,-.06,.22,.5])r(f,1.47,0,.3,.3,0,.95,0,de);r(1,1.7-B,0,.2,.2,0,.95,1,Q),r(.74,1.24-B*.3,se*.04,.44,.26,1,.9,1,Q),r(.98,1.42-B,se*.04,.4,.22,1,.9,1,Q),r(1.22,1.38-B*1.35,se*.04,.34,.2,1,.92,1,Q),r(1.42,1.24-B*1.65,se*.04,.24,.14,1,.92,1,Q);for(const[f,y]of W)r(f,.44,y*.1,.74,.085,1,.92,0,de);for(const f of[-.3,.2])r(f,.76,se*.05,.46,.42,1,.82,0,de);if(s.red&&s.kind!=="sheep")for(const f of[-1,1])r(-.02,1.06,f*.36,.36*ve,.5,2,.92,0,de)}}async function At(i,n={}){const s=i.rng.fork("unseen-oak"),q=i.noise,S=K(n.detail??i.quality?.detail??1,.6,1),g=n.style||kt(i,{palette:n.palette||pt}),R=n.weather||"fine",I=n.backdrop??!n.style,M=new d.Group;M.name="unseen-oak",await i.yield();const w={height:40,crownR:23,crownY:s.range(20,23),lowY:6,forkY:s.range(10.5,13),lean:s.range(.01,.05),leanAz:s.range(0,6.28),nLow:s.int(3,4),nLead:s.int(4,5),k:s.range(0,50),rMin:[1,.2,.07,.035,.02,.014]};if(w.cx=0,w.cz=0,n.tree==="pine"&&Object.assign(w,{crownR:17,crownY:28,lowY:17,forkY:w.forkY+10,nLow:2,height:36.5}),n.tree==="beech"){const e=-1.57+(w.leanAz-3.14)*.12;Object.assign(w,{crownR:19,lean:.26,leanAz:e,cx:Math.sin(e)*4.5,cz:Math.cos(e)*4.5,crownY:w.crownY-1})}const L=await St(s.fork("grow"),q,w,i);await i.yield();let Y=null;if(n.tree==="pine"){Y=[];const e=s.fork("plates"),a=[];for(const l of L)if(l.depth===1||l.depth===2&&l.len>6)for(const o of[.5,.78,1])a.push(l.pts[Math.min(l.pts.length-1,Math.round(o*(l.pts.length-1)))]);e.shuffle(a);for(const l of a){if(Y.length>=15)break;l[1]>w.lowY+1&&Y.every(o=>Math.hypot(o[0]-l[0],(o[1]-l[1])*2.4,o[2]-l[2])>6.4)&&Y.push([l[0],l[1],l[2],e.range(5,8),e.range(1.7,2.6)])}}const X=(e,a,l)=>{for(const o of Y){const t=e-o[0],p=a-o[1],h=l-o[2],u=p>0?o[4]:o[4]*.45;if((t*t+h*h)/(o[3]*o[3])+p*p/(u*u)<1)return!0}return!1},O={pos:[],idx:[],lit:[],piv:[],litFn:null},le=[12,7,5,3],te=(e,a,l)=>e*.951-l*.31-.94,C=(e,a,l)=>a+(e*.951-l*.31)*.3-.45;for(let e=0;e<L.length;e++){const a=L[e];if(a.depth>3||a.depth===3&&a.pts[0][3]<.05)continue;const l=a.pts.slice(),o=l[l.length-1];l[l.length-1]=[o[0],o[1],o[2],a.depth===0?o[3]:o[3]*.4],O.litFn=a.depth===0?te:C,nt(l,le[a.depth],O),e%80===79&&await i.yield()}{const e=5+s.int(0,2),a=s.range(0,6.28);O.litFn=te;for(let l=0;l<e;l++){const o=a+l/e*6.28+s.range(-.3,.3),t=s.range(2.2,3.6);nt([[Math.sin(o)*.9,1.5,Math.cos(o)*.9,.7],[Math.sin(o)*1.9,.45,Math.cos(o)*1.9,.55],[Math.sin(o)*t,-.1,Math.cos(o)*t,.3],[Math.sin(o)*(t+1.2),-.5,Math.cos(o)*(t+1.2),.1]],6,O)}}const J=new d.BufferGeometry;J.setAttribute("position",new d.BufferAttribute(new Float32Array(O.pos),3)),J.setIndex(O.idx),J.setAttribute("aLit",new d.BufferAttribute(new Float32Array(O.lit),1)),J.setAttribute("aPiv",new d.BufferAttribute(new Float32Array(O.piv),3)),J.boundingSphere=new d.Sphere(new d.Vector3(0,20,0),34);const ne=new d.Mesh(J,g.paperDark);ne.name="oak-paper",M.add(ne),await i.yield();const z=s.fork("strokes"),V=new $e,he=new $e("loose"),$=w.nLow+w.nLead,x=z.shuffle(Array.from({length:$+1},(e,a)=>a/$));let m=n.shedding?1+z.int(0,$-1):-1;if(n.shedding){const e=new Float64Array($+2),a=new Float64Array($+2);for(const o of L)if(o.depth>=1&&o.limb>=1&&o.limb<=$)for(const t of o.pts)e[o.limb]+=(t[0]*.9+t[2]*.44)*(t[1]<26?1:.5),a[o.limb]++;let l=-1e9;for(let o=1;o<=$;o++){const t=a[o]>20?e[o]/a[o]+.004*a[o]:-1e9;t>l&&(l=t,m=o)}}let G=-1;{let e=0;for(;e++<200;){const a=L[z.int(1,L.length-1)];if(a.depth===2&&a.len>6){G=a.order;break}}}const H=e=>K(.022+.03*e,.022,.06),b=e=>K(.36+1.5*e,.36,1.6),B=e=>k(.55,.3,qe(.15,1,e))*(1.5*e+.045)/(b(e)*H(e));let W=0;for(const e of L){let a=0;for(let l=1;l<e.pts.length;l++)a+=B(e.pts[l][3]);e.wPer=a/(e.pts.length-1),W+=e.wPer*e.len}const oe=Y?1:K(w.crownR*w.crownR/529,.5,1),A=Math.min(44e3*oe,(141e3-O.idx.length/3)/2-17e3)*(R==="thin"?1.6:1),N=K(A/W,.6,Y?2.4:1.5),fe=[0,.3,2.2,4.2,6,7.2],Z=new Float32Array($+2);{const e=new Float64Array($+2),a=new Float64Array($+2);for(const o of L)if(o.depth>=1&&o.limb>=1&&o.limb<=$)for(const t of o.pts)e[o.limb]+=t[0]*.95+t[2]*.3,a[o.limb]++;const l=[];for(let o=1;o<=$;o++)l.push(o);l.sort((o,t)=>e[o]/Math.max(a[o],1)-e[t]/Math.max(a[t],1)),l.forEach((o,t)=>{Z[o]=t/Math.max(1,$-1)})}const se=e=>k(4.4,25.3,e),ge=(e,a)=>K(.5+((e-w.cx)*.95+(a-w.cz)*.3)/(1.5*w.crownR),0,1),de=(e,a,l,o,t)=>{const p=K(Math.hypot(e-w.cx,l-w.cz)/w.crownR,0,1),h=q.n3(e*.09+w.k,a*.09,l*.09);if(o.depth===0)return 1.2+2*t+.5*h;const u=Z[o.limb];let c=(o.limb===m?17:u<=0?1:se(u))+2.3*p+.3*(o.depth-1)+.3*h;return R==="heavy"&&(c=1.2+(c-1.2)*.9),K(c,.6,29.1)},Q=[],_=[],De=[0,1,0],re=xe.x*.5,ve=1+xe.y*.5,r=xe.z*.5;let f=0,y=0,P=0;function T(e,a,l,o){const t=e.pts[a-1],p=e.pts[a];let h=p[0]-t[0],u=p[1]-t[1],c=p[2]-t[2];const v=Math.hypot(h,u,c)||1;h/=v,u/=v,c/=v;let D=re,F=ve,E=r,U=D*h+F*u+E*c;D-=U*h,F-=U*u,E-=U*c,Math.hypot(D,F,E)<.45&&(D=xe.x,F=xe.y,E=xe.z,U=D*h+F*u+E*c,D-=U*h,F-=U*u,E-=U*c);const pe=e.depth===0;pe&&(D=o?-.95:.95,F=0,E=o&&z()<.4?.31:-.31,U=D*h+F*u+E*c,D-=U*h,F-=U*u,E-=U*c);const ue=Math.hypot(D,F,E)||1;D/=ue,F/=ue,E/=ue;const me=u*E-c*F,Le=c*D-h*E,Se=h*F-u*D;for(let je=0;je<l;je++){const Re=z(),lt=k(t[0],p[0],Re),ht=k(t[1],p[1],Re),ft=k(t[2],p[2],Re),Te=k(t[3],p[3],Re),dt=pe?K(z.gauss()*.3,-.7,.7):K(z.gauss()*(o?.5:.6),-1.25,1.25)+(o?Math.PI:0),Ue=Math.cos(dt),Ze=Math.sin(dt),et=Te+.012,ze=lt+(D*Ue+me*Ze)*et,Pe=ht+(F*Ue+Le*Ze)*et,Be=ft+(E*Ue+Se*Ze)*et;if(Pe<.15||Y&&e.depth>=2&&!X(lt,ht,ft))continue;f<=0&&(f=5+(z()<.5?1:0),P=0,y=de(ze,Pe,Be,e,(a-1+Re)/(e.pts.length-1))+(o?.5:0),R==="thin"&&z()<.42&&(y=1e5),(o||y<1e4&&e.limb!==m&&z()<(e.depth===0?.55:Z[e.limb]<=0?.8:0))&&(y=-9)),f--;const _e=P++;if(y>1e4)continue;const Ke=z(),tt=b(Te)*z.range(.8,1.25),at=H(Te)*z.range(.85,1.2);if(o===0){const He=Te>.09&&z()<.1,ct=He?.95:K(.36+.3*z()+1.2*Te,.3,.86);if(e.depth>=2&&e.depth<=4&&ze>2&&Ue>.5&&z()<.035){_.push([ze,Pe,Be,tt,at,ct,y,_e,Ke]);continue}const vt=e.limb===m&&e.depth>=1?3+.45*K(1-Math.hypot(ze-w.cx,Be-w.cz)/(w.crownR*.95),0,1):e.order===G||e.slip?3+.45*Ke:0;V.add(ze,Pe,Be,tt,at,0,ct,y,_e,Ke,vt),(V.n&7)===0&&Q.push(ze,Pe,Be)}else{const He=Te>.06&&z()<.42;V.add(ze,Pe,Be,tt*(He?1.15:1),at,1,K(.4+.35*z()+.3*Te,.3,.8),y,He?Math.max(_e,1):_e,Ke,He?2:0)}}}const ee=e=>(e>.05?.5:.16)*(.4+.6*S),ae=[];for(let e=0;e<L.length;e++){const a=L[e];for(let l=0;l<2;l++){f=0;let o=z();for(let t=1;t<a.pts.length;t++){const p=a.pts[t-1],h=a.pts[t],u=(p[3]+h[3])*.5,c=Math.hypot(h[0]-p[0],h[1]-p[1],h[2]-p[2]);o+=B(u)*c*N*(l?ee(u):1);const v=Math.floor(o);o-=v,v>0&&T(a,t,v,l)}}if((a.depth===2||a.depth===3)&&a.len>4.5){const l=a.pts[Math.floor(a.pts.length*.55)];l[1]>20&&l[1]<36&&ae.push(a)}e%20===19&&await i.yield()}{const e=s.fork("darks"),a=L.find(t=>t.depth===0),l=Math.atan2(.95,-.31);for(let t=1;t<a.pts.length;t++){const p=a.pts[t-1],h=a.pts[t],u=Math.round((h[1]-p[1])*15);for(let c=0;c<u;c++){const v=e(),D=l+e.range(.8,6.2832-.8),F=k(p[3],h[3],v)+.03,E=k(p[1],h[1],v);E<.4||V.group(k(p[0],h[0],v)+Math.sin(D)*F,E,k(p[2],h[2],v)+Math.cos(D)*F,e.range(1.1,1.8),e.range(.5,.8),5,1,e.range(.8,.9),-9,1,e(),e()<.36?9:0)}}for(const t of L){if(t.order%50===49&&await i.yield(),t.depth<1||t.depth>2)continue;let p=e();for(let h=1;h<t.pts.length;h++){const u=t.pts[h-1],c=t.pts[h],v=(u[3]+c[3])*.5;if(!(v<.085))for(p+=Math.hypot(c[0]-u[0],c[1]-u[1],c[2]-u[2])*(t.depth===1?2.8:1.5)*(.5+.5*S);p>=1;){p-=1;const D=e(),F=K(.5+1.7*v,.55,1.6);V.group(k(u[0],c[0],D)+e.range(-.5,.5)*v,k(u[1],c[1],D)-v-.12*F,k(u[2],c[2],D)+e.range(-.5,.5)*v,F,K(.24+.9*v,.26,.7),v>.25?5:4,1,e.range(.72,.88),-9,1,e(),e()<.25?9:0)}}}await i.yield();for(let t=.8;t<w.forkY;t+=1.3){const p=K((t+.6)/(w.forkY+.6),0,1)*8,h=Math.min(7,Math.floor(p)),u=a.pts[h].map((c,v)=>k(c,a.pts[h+1][v],p-h));V.add(u[0]-.25,t,u[2],3,1.9,1,.92,-9,1,e(),8)}for(const t of L){if(t.order%40===39&&await i.yield(),t.depth<1||t.depth>3)continue;const p=[0,1,1.5,3.2][t.depth];let h=e()*p;for(let u=1;u<t.pts.length;u++){const c=t.pts[u-1],v=t.pts[u],D=Math.hypot(v[0]-c[0],v[1]-c[1],v[2]-c[2]);for(h+=D;h>=p;){h-=p;const F=e(),E=k(c[0],v[0],F),U=k(c[1],v[1],F),pe=k(c[2],v[2],F),ue=k(c[3],v[3],F),me=!Y||t.depth<2||X(E,U,pe);t.depth<=2&&e()<(t.depth===1?1:.6)&&V.add(E,U-ue-.35,pe,t.depth===1?1.5:1.2,t.depth===1?.6+ue:.5,1,t.depth===1?.92:.8,-9,1,e(),8),me&&e()<.36&&!(R==="thin"&&e()<.42)&&V.add(E,U+ue+.5,pe,e.range(1.1,1.6),e.range(.5,.65),0,.86,e()<.15&&t.limb!==m&&Z[t.limb]<=0?-9:de(E,U,pe,t,(u-1+F)/(t.pts.length-1)),1,e(),8)}}}for(const t of L){if(t.order%40===39&&await i.yield(),t.depth<1||t.depth>3)continue;const p=[0,.6,.78,1.5][t.depth];let h=e()*p;for(let u=1;u<t.pts.length;u++){const c=t.pts[u-1],v=t.pts[u],D=Math.hypot(v[0]-c[0],v[1]-c[1],v[2]-c[2]);for(h+=D;h>=p;){h-=p;const F=e(),E=k(c[0],v[0],F),U=k(c[1],v[1],F),pe=k(c[2],v[2],F),ue=k(c[3],v[3],F),me=e(),Le=e.range(.75,1.1)*(t.depth===1?1.2:1),Se=e.range(.9,1.3),je=e(),Re=e()<.6;t.depth===3&&(ue<.028||me<.45)||Y&&t.depth>=2&&!X(E,U,pe)||R==="thin"&&me>.6||V.group(E,U+ue+.34*Le,pe,Le,Se,5,0,Re?.95:.88,me<.3&&Z[t.limb]<=0&&t.limb!==m?-9:de(E,U,pe,t,(u-1+F)/(t.pts.length-1)),1+(t.order+u)%4,je,t.limb===m?8.6:8.3)}}}if(Y)for(const t of Y){const p=Math.round(t[3]*t[3]*.5);for(let h=0;h<p;h++){const u=e.range(0,6.2832),c=Math.sqrt(e())*.92,v=t[0]+Math.cos(u)*c*t[3],D=t[2]+Math.sin(u)*c*t[3],F=Math.sqrt(1-c*c),E=e(),U=e();R==="thin"&&E>.6||V.group(v,t[1]+t[4]*.7*F+.3,D,e.range(.9,1.3),e.range(1.1,1.6),5,0,E<.55?.95:.88,ge(v,D)<.22&&E<.4?-9:K((R==="heavy"?.9:1)*(se(ge(v,D))+1.6*U+1.2*c),.6,29.1),1+h%4,U,8.3),h%2===0&&V.group(v,t[1]-t[4]*.3*F-.25,D,e.range(.9,1.3),e.range(1,1.5),5,1,e.range(.8,.9),-9,1,e(),e()<.3?9:0)}}const o=Math.round(170*(.6+.4*S));for(let t=0;t<o;t++){const p=e.range(0,6.2832),h=Math.sqrt(e.range(9,484)),u=e()<.3;V.group(Math.sin(p)*h,.06,Math.cos(p)*h,e.range(.8,1.3),e.range(.6,1),4,1,e.range(.45,.62),-9,1,e(),u?9:6)}for(let t=0;t<46;t++){const p=l+e.range(-1.3,1.3),h=e.range(2,6.5);V.group(Math.sin(p)*h,.07,Math.cos(p)*h,e.range(.7,1.2),e.range(.6,.9),5,0,e()<.5?.95:e.range(.7,.86),e()<.5?-9:e.range(1.5,11),e.int(0,3),e(),6)}}await i.yield();for(let e=0;e<_.length;e++){const a=_[e];let l=a[0]-z.range(6,10),o=.06,t=a[2]+z.range(-2,2);for(let p=0;p<12&&Q.length;p++){const h=z.int(0,Q.length/3-1)*3,u=Q[h]-a[0],c=Q[h+1]-a[1];if(u<-5&&u>-11&&c<2&&c>-7&&Math.abs(Q[h+2]-a[2])<4){l=Q[h],o=Q[h+1]+.03,t=Q[h+2];break}}he.add(a[0],a[1],a[2],a[3],a[4],0,a[5],a[6],a[7],a[8],a[6]<17.5&&z()<.5?0:1),he.setAlt(l,o,t)}await i.yield();const ie=new $e("bird"),ce=n.buntings??40,j=s.fork("buntings"),ye=[];j.shuffle(ae);let we=0;{const e=o=>o.pts[Math.floor(o.pts.length*.55)],a=[],l=[];for(const o of ae){const t=e(o);a.length<9&&a.every(p=>{const h=e(p);return Math.hypot(h[0]-t[0],(h[1]-t[1])*2.5,h[2]-t[2])>7})?a.push(o):l.push(o)}ae.length=0,ae.push(...a,...l)}const We=[-j.range(4.5,6.5),j.range(2.2,3.4),j.range(2.5,5)*j.sign()];for(let e=0;e<ae.length*3&&we<ce;e++){const a=ae[e%Math.max(1,ae.length)];if(!a)break;const l=j.int(1,Math.max(1,Math.floor(a.pts.length*.4))),o=Math.max(1,Math.min(ce-we,j.int(3,7),Math.floor((a.pts.length-2-l)/1.3)+1)),t=j();for(let p=0;p<o;p++){const h=l+p*j.range(1,1.5),u=Math.min(a.pts.length-2,Math.floor(h)),c=K(h-u,0,1),v=a.pts[u],D=a.pts[u+1],F=k(v[0],D[0],c),E=k(v[1],D[1],c)+k(v[3],D[3],c)+.07,U=k(v[2],D[2],c),pe=j(),ue=j.range(0,.45)+p*.03,me=[j.range(-7,7),j.range(-2.4,2.6),j.range(-4.2,4.2)],Le=j.range(.3,.38);for(let Se=0;Se<2;Se++)ie.add(F,E,U,Le,.05,we%9===4?2:0,.92,ue,Se,pe,t),ie.setAlt(me[0]*.85,me[1]*1.7+.5,me[2]*2.1);ye.push(new d.Vector3(F,E,U)),we++}}await i.yield();const ke={pos:[],idx:[]},Ve={piv:[],rig:[]},Ge=new $e("rig"),Me=s.fork("ponies"),ot=[],Qe=n.ponies??3,gt=Me.int(0,Math.max(0,Qe-1));for(let e=0;e<Qe;e++){const a=k(.62,2.9,(e+.5)/Qe)+.3*(Me.range(.1,.9)-.5),l=k(19.5,22,(Me.range(8.5,15)-8.5)/6.5)+(e===1?-1.5:0),o=Math.sin(a)*l,t=-Math.cos(a)*l,p=Math.PI/2-a+(n.shedding?.7:e===1?-1.9:1.45)+1.1*Me.range(-.5,.5),h=Me.range(.93,1.08)*(n.ponyScale??(n.ponyRich?1.2:1)),u=Me(),c=n.shedding?-2:e===gt?26.5:-1,v=[.72,-.14,.3][e%3]+0*Me.range(-.05,.3);Rt({paper:ke,rig:Ve,strokes:Ge},Me,{ox:o,oz:t,yaw:p,sc:h,phase:u,shakeT:c,headDrop:v,T0:4+e*1.6,kind:n.cast,bold:n.ponyBold,rich:n.ponyRich,far:n.ponyFar?7:0,red:n.ponyRed?n.ponyRed[e%n.ponyRed.length]:0}),ot.push(new d.Vector3(o,1.1*h,t))}if(await i.yield(),n.apron??!0){const e=s.fork("apron"),a=Math.round(900*S);for(let l=0;l<a;l++){const o=e.range(0,6.2832),t=Math.sqrt(e.range(529,2209)),p=Math.sin(o)*t,h=Math.cos(o)*t,u=23.5+2.6*q.n2(Math.cos(o)*1.7+w.k,Math.sin(o)*1.7),c=1-qe(34,47,t)*.85,v=e(),D=e.range(.75,1.3),F=4.2+4.6*K((h+47)/94,0,1)+e.range(0,.9);t<u||v>c||(V.group(p,.06,h,e.range(.42,.56)*D,.5*D,5,0,e.range(.55,.85),e()<.35?-9:F,0,e(),5),V.group(p-.14,.07,h+.05,e.range(.26,.36)*D,.36*D,3,1,e.range(.6,.8),-9,1,e(),0),l%400===399&&await i.yield())}}await i.yield();const wt=new d.Vector3(0,20,0),Ye=(e,a,l,o)=>{const t=new d.Mesh(bt(e,wt,o),a);return t.name=l,t.frustumCulled=o<1e3,M.add(t),t};Ye(V,g.stroke,"oak-strokes",70),await i.yield(),Ye(he,g.strokeLoose,"oak-loose",80),Ye(ie,g.strokeBird,"buntings",1e4),Ye(Ge,g.strokeRig,"pony-strokes",60);const Fe=new d.BufferGeometry;Fe.setAttribute("position",new d.BufferAttribute(new Float32Array(ke.pos),3)),Fe.setIndex(ke.idx),Fe.setAttribute("aPiv",new d.BufferAttribute(new Float32Array(Ve.piv),3)),Fe.setAttribute("aRig",new d.BufferAttribute(new Float32Array(Ve.rig),4)),Fe.boundingSphere=new d.Sphere(new d.Vector3(0,1,0),30);const st=new d.Mesh(Fe,g.paperRigDark);st.name="pony-paper",M.add(st);let Ne=null;if(I){Ne=g.sky(2600),M.add(Ne);const e=new d.Mesh(new d.CircleGeometry(900,48),g.paper);e.rotation.x=-Math.PI/2,e.position.y=-.02,e.name="viewer-ground",M.add(e)}await i.yield();let rt=!!n.style,Xe=n.shedding?27.2:34.5;g.uniforms.uShedT.value=Xe,n.shedding&&(g.uniforms.uBolt.value=Xe+.4),g.uniforms.uBirdT.value=30;const be=[[0,0],[.346,9],[.48,14],[.637,23],[.823,32.5],[1,40]],mt=n.secondsOfU||(e=>{for(let a=1;a<be.length;a++)if(e<=be[a][0])return k(be[a-1][1],be[a][1],(e-be[a-1][0])/(be[a][0]-be[a-1][0]));return 40}),Je=new d.Vector3,it={object:M,radius:26,height:40,center:new d.Vector3(0,21,0),ground:!1,groundY:0,style:g,setSeconds(e){rt=!0,g.setSeconds(e)},setProgress(e){it.setSeconds(mt(K(e,0,1)))},update(e,a,l){g.update(a,l),rt||g.setSeconds((a+22)%46),Ne&&l&&(l.getWorldPosition(Je),M.worldToLocal(Je),Ne.position.copy(Je))},dispose(){n.style||g.uniforms.uAtlas.value.dispose()},stats:{strokes:V.n+he.n+ie.n+Ge.n,white:V.n,loose:he.n,branches:L.length,paperTris:(O.idx.length+ke.idx.length)/3},anchors:{bareCircle:{center:new d.Vector3(0,0,0),radius:23},lightDir:xe.clone(),approach:{position:new d.Vector3(0,2.3,-110),lookAt:new d.Vector3(0,19,0)},flyThrough:[[14,2.4,-78],[24,3.6,-40],[31,7,0],[28.6,11.2,11.9],[21.9,15.5,21.9],[11.9,19.8,28.6],[0,24,31],[-46,32.1,31],[-92,40.2,31]].map(e=>new d.Vector3(e[0],e[1],e[2])),portalSeat:{position:new d.Vector3(-92,40.2,31),facing:new d.Vector3(.985,-.174,0),radius:7},crownView:{position:new d.Vector3(26,13,17),lookAt:new d.Vector3(0,22,0)},buntings:ye,ponies:ot,trunkTop:new d.Vector3(0,w.forkY,0),crown:{center:new d.Vector3(w.cx,w.crownY,w.cz),radius:w.crownR,lowY:w.lowY,top:w.height},times:{firstStroke:9.2,crownDone:31,buntingsLift:g.uniforms.uBirdT.value,ponyShake:26.5,shed:Xe,gusts:[19,30]}}};return it}export{zt as EXPOSURE,pt as PALETTE,ut as RIG_GLSL,xt as STROKE_GLSL,$e as StrokeBuf,At as buildHero,Rt as layAnimal,kt as makeStyle,bt as strokeGeometry,nt as sweepTube};
