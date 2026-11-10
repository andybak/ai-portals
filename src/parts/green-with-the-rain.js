import*as y from"three";import{clamp as rt,lerp as J,smoothstep as Z}from"../kit/core.js";const jt=["#E9946B","#B4683C","#57372A","#2F8F86","#A8DCC8","#F3C552","#B7BCBB"],Pt=1,_=Math.PI*2,kt=t=>new y.Matrix3().fromArray(t).invert().elements,bt=kt([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]),St=kt([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602]),zt=(t,e)=>[t[0]*e[0]+t[3]*e[1]+t[6]*e[2],t[1]*e[0]+t[4]*e[1]+t[7]*e[2],t[2]*e[0]+t[5]*e[1]+t[8]*e[2]];function It(t){const o=zt(St,t.map(c=>rt(c,0,.95))).map(c=>rt(c,4e-4,.97)).map(c=>{const v=.983729*c-1,a=.432951*c-.0245786,s=.238081*c+90537e-9;return(-a-Math.sqrt(Math.max(a*a-4*v*s,0)))/(2*v)});return zt(bt,o).map(c=>Math.max(c,0)*.6/Pt)}function le(t){const e=new y.Color(t),o=It([e.r,e.g,e.b]);return new y.Color(o[0],o[1],o[2])}const Ft=t=>t.map(e=>e.toFixed(6)).join(","),Vt=`
  vec3 gwToScene(vec3 D){
    vec3 y = clamp(mat3(${Ft(St)})*clamp(D, 0., 0.95), 0.0004, 0.97);
    vec3 A = 0.983729*y - 1., B = 0.432951*y - 0.0245786, Cc = 0.238081*y + 0.000090537;
    vec3 v = (-B - sqrt(max(B*B - 4.*A*Cc, 0.)))/(2.*A);
    return max(mat3(${Ft(bt)})*v, 0.)*${(.6/Pt).toFixed(5)};
  }`;function Ct(t={}){const e=(t.palette&&t.palette.length>=7?t.palette:jt).slice(0,7),o=e.map(a=>{const s=new y.Color(a);return new y.Vector3(s.r,s.g,s.b)}),c={uTime:{value:0},uFront:{value:-1e4},uRainN:{value:new y.Vector2(-.94,.34)},uSlot:{value:0},uSlotDir:{value:new y.Vector3(.928,.156,.338).normalize()},uKeyDir:{value:new y.Vector3(-.55,.62,.56).normalize()},uPal:{value:o},uFar:{value:new y.Vector2(260,2400)},uPx:{value:2/450},uRelease:{value:-1},uGust:{value:0},uSlotW:{value:new y.Vector2(1,1)},uSlotCol:{value:new y.Vector3().copy(o[0]).lerp(o[5],.45).multiplyScalar(1.25)},uBulge:{value:new y.Vector4(0,1,0,1)},uBulgeA:{value:0},uBirdPale:{value:0},uTip:{value:4.2},uArm:{value:new y.Vector4(0,1e5,0,12)},uBowl:{value:.13},uSoft:{value:.5}},v={uniforms:c,palette:e,storyTime:null,setStoryTime(a){v.storyTime=a,c.uFront.value=6.5*a-11,c.uSlot.value=Z(32.5,35,a),c.uRelease.value=a-27.5,c.uGust.value=.35+.65*Z(-3,.5,a-27.5)*(1-.5*Z(34,39,a))},setRain(a,s){c.uRainN.value.set(a,s).normalize()},setSlot(a){c.uSlot.value=a},setSlotDir(a){c.uSlotDir.value.copy(a).normalize()},tick(a,s){c.uTime.value=a,s&&(s.getDrawingBufferSize(Nt),c.uPx.value=2/Math.max(Nt.y,1))}};return v}const Nt=new y.Vector2,Gt=new y.Quaternion,Lt=new y.Vector3(0,1,0),vt=`
  uniform float uTime, uFront, uSlot, uPx, uGust, uTip, uSoft, uBowl;
  uniform vec2 uRainN, uFar;
  uniform vec3 uSlotDir, uKeyDir, uSlotCol;
  uniform vec4 uArm;
  uniform vec2 uSlotW;
  uniform vec4 uBulge;
  uniform float uBulgeA;
  uniform vec3 uPal[7];
  ${Vt}
  float gwHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
  vec2 gwHash2(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*vec3(.1031, .1030, .0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz)*p3.zy); }
  float gwNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(gwHash(i), gwHash(i + vec2(1., 0.)), f.x), mix(gwHash(i + vec2(0., 1.)), gwHash(i + vec2(1., 1.)), f.x), f.y); }
  vec3 gwTangent(vec3 n){ vec3 t = vec3(n.z, 0., -n.x); float l = dot(t, t); return l > 1e-6 ? t*inversesqrt(l) : vec3(1., 0., 0.); }

  // the break under the cloud: x = the slot itself (30 by 3 degrees), y = a broad lobe round it for facets to catch
  vec2 gwSlot(vec3 d){
    vec3 sr = gwTangent(uSlotDir), su = cross(uSlotDir, sr);
    float a = dot(d, sr), b = dot(d, su), c = dot(d, uSlotDir);
    float core = smoothstep(0.30*uSlotW.x, 0.20*uSlotW.x, abs(a))*smoothstep(0.034*uSlotW.y, 0.016*uSlotW.y, abs(b))*step(0., c);
    float lobe = exp(-(a*a)/(0.20*uSlotW.x*uSlotW.x) - (b*b)/(0.09*uSlotW.y))*smoothstep(-0.1, 0.3, c);
    return vec2(core, lobe)*uSlot;
  }
  // THE SKY: hammered tin. Display-linear colour seen in direction d (unit). Every facet of the city reflects this
  // (sharp 0: the soft version a facet mirrors; sharp 1: the sheet itself, with crisp creases, flats and the fringe).
  // rounded hammer blows: a smooth maximum over the nearest ones (x height, yz slope); no straight edge anywhere
  vec3 gwBoss(vec2 q, float seed){
    vec2 ci = floor(q), cf = q - ci, sg = vec2(0.); float sw = 0., sh = 0.;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j)), c = ci + o + vec2(seed, 0.);
      vec2 r = cf - (o + 0.08 + 0.84*gwHash2(c));
      float hr = gwHash(c + vec2(7.3, 1.9)), rad = mix(0.42, 0.95, hr*hr);
      float amp = rad*1.25*step(0.18, gwHash(c + vec2(3.1, 5.7)));
      float m = max(1. - dot(r, r)/(rad*rad), 0.), h = amp*m*m;
      float w = exp(10.*h); sw += w; sh += w*h; sg += r*(w*(-4.*amp*m/(rad*rad)));
    }
    return vec3(sh, sg)/max(sw, 1e-4);
  }
  vec3 gwSkyX(vec3 d, float sharp){
    float up = d.y, den = abs(up) + 0.55;
    vec2 q = d.xz/den*7.6 + uRainN*(uTime*0.11);
    // the weather has shape: the bosses stand in heaps (crowns planished bright, bellies pewter) and between the
    // heaps the sheet is calm: only planished in small flats, no outline anywhere
    vec2 hq = q*0.15 + vec2(3.7, 1.1);
    vec2 kq = uKeyDir.xz/max(length(uKeyDir.xz), 1e-4), hk = hq + kq*0.20;
    float hraw = 0.62*gwNoise(hq) + 0.38*gwNoise(hq*2.3 + 3.1), hlit = 0.62*gwNoise(hk) + 0.38*gwNoise(hk*2.3 + 3.1);
    float hl = max(length(d.xz), 1e-4);
    float side = -dot(d.xz, uRainN)/hl;                                  // 1 toward where the rain comes from
    float cl = hraw + 0.22*side*smoothstep(0.95, 0.3, up);
    float heap = smoothstep(0.52, 0.66, cl), belly = smoothstep(0.54, 0.78, cl);
    q += 0.9*vec2(gwNoise(q*0.45), gwNoise(q*0.45 + 5.3));
    float pa = 0.6*uPx, wq = max(pa*7.6/den, 1e-3);                      // one pixel, in q units
    vec3 b1 = gwBoss(q, 0.);
    float H = b1.x; vec2 g = b1.yz;
    float fh = 0.5, ftone = 0.;
    if (sharp > 0.5) {
      // a second, smaller generation of blows among the big ones (gone before it is finer than 3 px)
      float see = 1. - smoothstep(0.05, 0.11, wq);
      vec3 b2 = gwBoss(q*2.7 + vec2(17.3, 4.1), 31.);
      H += 0.225*see*b2.x; g += 0.61*see*b2.yz;
      // the hammer's flats: the whole sheet is planished in small flats that differ by a few percent
      vec2 fq = q*3.3 + vec2(9.1, 2.7), fi = floor(fq), ff = fq - fi, fr = vec2(0.), fid = fi; float bd = 9.;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 o = vec2(float(i), float(j)), r = ff - (o + 0.15 + 0.7*gwHash2(fi + o + vec2(0., 57.))); float dd = dot(r, r);
        if (dd < bd) { bd = dd; fid = fi + o; fr = r; }
      }
      fh = gwHash(fid + vec2(1.3, 8.1));
      ftone = (1. - smoothstep(0.05, 0.10, wq))*mix(1., 0.6, heap)*(0.09*(fh - 0.5) + 0.04*dot(fr, kq));
    }
    H *= heap; g *= heap;
    // every blow is raised toward us: lit on the shoulder turned to the pale sky, pewter on the other, soft valleys
    float lam = clamp(-dot(g, kq)*0.55, -1., 1.);
    float L = 1. + mix(0.38, 0.30, step(0., lam))*lam*mix(0.6, 1., sharp);
    L *= 1. - 0.40*heap*(1. - smoothstep(0.0, 0.20, H));
    vec2 gh = g + kq*1.1;
    L += 0.26*mix(0.3, 1., sharp)*heap*exp(-dot(gh, gh)/0.55)*smoothstep(0.25, 0.5, H);   // planished sheen on the crown's shoulder
    // a heap of bosses is a cloud: pewter in its belly, bright on the shoulder turned to the pale sky
    L *= mix(1.07, mix(0.98, 0.64, belly), heap)*(1. + 1.7*clamp(hraw - hlit, -0.12, 0.14)*heap);
    L *= 1. + ftone;
    float showerS = smoothstep(-0.25, 0.65, side)*smoothstep(1.0, 0.12, up) + (hraw - 0.5)*0.5*smoothstep(-0.6, 0.2, side);
    float shower = smoothstep(0.18, 0.62, showerS);
    L *= mix(1.0, mix(0.58, 0.48, sharp), shower)*(1. + 0.30*shower*max(lam, 0.));
    L *= 1.0 + 0.20*(1. - shower)*smoothstep(0.0, 0.8, dot(d, uKeyDir));
    // a gleam travels over the calm sheet, east with the weather
    L *= 1. + 0.06*(1. - heap)*sin(q.x*0.55 + q.y*0.2 - uTime*0.5);
    vec3 col = uPal[6]*L;
    float veil = 0.;
    if (sharp > 0.5) {
      // under the shower: tall slanted curtains of rain, and the fringe of fine tinned wire trailing down to the roofs
      float el = asin(clamp(up, -1., 1.)), az = atan(d.x, abs(d.z) < 1e-5 ? 1e-5 : d.z);
      float sideK = smoothstep(-0.15, 0.35, side);
      float ca = az + el*0.30;
      float c1 = gwNoise(vec2(ca*8., el*1.2 + uTime*0.07)), c2 = gwNoise(vec2(ca*27. + 4., el*2.5 + uTime*0.13));
      float top = 0.34 + 0.26*gwNoise(vec2(az*3.1 + 9., uTime*0.03));
      veil = smoothstep(top, top*0.35, el + 0.05*gwNoise(vec2(az*7., 2.)))*sideK;
      col = mix(col, uPal[6]*mix(0.50, 0.92, 0.6*c1 + 0.4*c2), veil*0.80);
      float wa = ca*90., wh = gwHash(vec2(floor(wa), 4.));
      float wx = abs(fract(wa) - 0.5)/90.*hl, hem = 0.13 + 0.20*wh;
      float wl = max(0.8*pa, 0.0008);
      float wire = (1. - smoothstep(wl, wl*2., wx))*step(0.25, wh)*sideK*smoothstep(hem, hem - 0.05, el)*step(0., el);
      float run = 0.74 + 0.26*sin(el*110. + uTime*(5. + 3.*wh) + wh*40.);
      col = mix(col, uPal[6]*1.2, wire*run);
    }
    // the break: the flanks that face the slot are under-lit bare copper, hammer flat by hammer flat, strongest near it
    vec2 sq = uSlotDir.xz/max(length(uSlotDir.xz), 1e-4);
    float prox = smoothstep(0.10, 0.93, dot(d, uSlotDir));
    float sl0 = -dot(g, sq)*0.55;
    float underF = smoothstep(0.48, 0.55, sl0 + 0.35*(fh - 0.5))*(0.6 + 0.4*fh);
    float under = uSlot*mix(smoothstep(0.2, 0.9, sl0)*0.7, underF, sharp)*(1. - 0.7*veil);
    col *= mix(vec3(1.), vec3(1.045, 1.0, 0.93), uSlot*(0.5 + 0.5*prox));
    col = mix(col, uSlotCol*mix(0.80, 1.0, prox)*(0.74 + 0.42*smoothstep(0.45, 0.95, sl0)), under*(0.09 + 0.86*prox)*(1. - 0.35*shower));
    vec2 sl = gwSlot(d);
    col = mix(col, uSlotCol, clamp(sl.x + sl.y*0.35, 0., 1.));
    // below the horizon a facet sees the city: dry brown, greening with distance
    col = mix(col, mix(uPal[1], uPal[6], 0.45)*0.86, smoothstep(0.03, -0.22, up));
    return col;
  }
  vec3 gwSky(vec3 d){ return gwSkyX(d, 0.); }
  // the one ramp: salmon, penny, chocolate, blue-green, mint
  vec3 gwRamp(float a){
    // stops: salmon 0, penny 0.25, chocolate 0.5, blue-green 0.72, mint 0.92
    vec3 c = mix(uPal[0], uPal[1], smoothstep(0.0, 0.25, a)); c = mix(c, uPal[2], smoothstep(0.25, 0.5, a));
    c = mix(c, uPal[3], smoothstep(0.5, 0.72, a)); return mix(c, uPal[4], smoothstep(0.72, 0.92, a));
  }
  // seconds since the rain line passed world point P (negative: still dry)
  // (the line runs a little ahead where uBulge says: x from, x to, z centre, z radius; uBulgeA seconds)
  float gwBulge(vec2 p){ float dz = (p.y - uBulge.z)/max(uBulge.w, 1.); return uBulgeA*smoothstep(uBulge.x, uBulge.y, p.x)*exp(-dz*dz); }
  float gwWetSeconds(vec3 P){ return (uFront - dot(uRainN, P.xz))/6.5 + gwBulge(P.xz); }
  vec3 gwFinish(vec3 displayCol, float hdr){ return gwToScene(displayCol)*(1. + hdr); }

  // THE METAL. P world position, N unit normal of the hammer flat, T its tangent (unit, horizontal), V unit vector
  // to the eye, lf = (flat-local x, y in metres from the flat's centre, half size, id 0..1),
  // st = (base age 0..1, shelter 0..1, kind 0 copper 1 gilt 2 tin, resist 0..1), sf = (u across, v down the fall,
  // seam spacing: >0 draws standing seams and rivets, <0 only leads the patina), fw = metres per pixel on the surface.
  // Returns display-linear colour and, in a, the HDR boost for gwFinish.
  vec4 gwMetal(vec3 P, vec3 N, vec3 T, vec3 V, vec4 lf, vec4 st, vec3 sf, float fw, float dist, bool front){
    lf.w = floor(lf.w*4096. + 0.5)/4096.;
    float shelter = st.y, kind = st.z, resist = st.w, open = 1. - shelter;
    float isCu = 1. - step(0.5, kind), isGilt = step(0.5, kind)*(1. - step(1.5, kind));
    float w = gwWetSeconds(P);
    float wet = smoothstep(0., max(uSoft, 0.05), w)*open;
    // patina clock: led by seams and rivets, by downhill streaks and by each flat's own luck
    float su = sf.x, sv = sf.y, sp = max(abs(sf.z), 0.05);
    float seamD = (0.5 - abs(fract(su/sp) - 0.5))*sp;
    float streak = gwNoise(vec2(su*2.3, sv*0.11)), fine = gwNoise(vec2(su*9., sv*0.4 + 3.));
    float lead = 0.15 + min(seamD, 0.6)*2.7 + streak*streak*3.4 + fine*0.6 + lf.w*0.22;
    // a wall greens in tongues: water hangs from every lap, sill and string course (one every sp down the wall) and
    // from the eave, and runs down each column at its own speed; no flat's edge is a colour boundary
    float wallK = (1. - smoothstep(0.25, 0.45, abs(N.y)))*step(sf.z, 0.);
    if (wallK > 0.001) {
      float row = floor(sv/sp), dv = sv - row*sp;
      float kr = 0.62*gwNoise(vec2(su*3.4 + row*3.1, row*7.3)) + 0.38*gwNoise(vec2(su*8.3 + 5., row*3.7)), kl = 0.6*gwNoise(vec2(su*2.2 + 11., 0.5)) + 0.4*gwNoise(vec2(su*6.1, 4.5));
      kr = smoothstep(0.18, 0.80, kr); kl = smoothstep(0.15, 0.85, kl);
      float leadW = min(0.25 + dv*mix(0.25, 5.5, kr), 0.4 + sv*mix(0.08, 2.6, kl)) + fine*0.3;
      lead = mix(lead, leadW, wallK);
    }
    float grow = smoothstep(0., 1., (w - lead)/mix(0.9, 0.45, wallK))*open*(1. - resist)*isCu;
    float age = st.x + max(0.70 - st.x, 0.)*grow;
    age += (streak - 0.5)*0.12*(1. - resist)*smoothstep(0.2, 0.45, st.x)*(1. - smoothstep(0.62, 0.9, st.x))*isCu;   // weathered sheet is mottled
    // old sheet: brown still showing under each seam, streaked; wet turns chalk mint to deep blue-green
    float old = smoothstep(0.62, 0.9, st.x);
    age -= old*(0.44*smoothstep(0.20, 0.02, seamD)*(0.4 + 0.6*streak) + 0.05*streak*streak);
    float deep = smoothstep(0.1, 2.4, w - streak*0.9 - lf.w*0.5)*open*old;
    age = mix(age, min(age, 0.70 + 0.05*streak), deep);
    age = mix(age, min(age, 0.5), shelter*0.9);
    vec3 base = gwRamp(age);
    base = mix(base, uPal[2]*0.92, shelter*isCu);
    base = mix(base, uPal[5], isGilt); base = mix(base, uPal[6], step(1.5, kind));
    float chalk = smoothstep(0.62, 0.90, age)*(1. - 0.85*wet)*isCu;
    // the hammer flat: one jittered normal, a shallow planished bowl and a 4 by 4 field of dimples
    vec3 B = cross(N, T);
    float hs = max(lf.z, 1e-3), fwm = max(fw, 1e-5);
    float fwl = min(fwm, dist*uPx*1.6);                 // for mark widths: not blown up at grazing angles
    float flatPx = 2.*hs/fwm;
    float facet = smoothstep(2.5, 6., flatPx)*step(1e-3, lf.z);
    vec2 jit = (gwHash2(vec2(lf.w*917.3, lf.w*331.7 + 0.5)) - 0.5)*0.085;
    jit *= 1. + 0.5*uGust*sin(uTime*(0.7 + lf.w*1.3) + lf.w*40.);          // sheet oil-cans in the gusts
    // ...and the gusts cross the city as slow waves, so glints run along the roofs like wind on water
    float gph = dot(P.xz, vec2(0.047, 0.019)) + P.y*0.03 - uTime*1.25 + lf.w*2.4;
    jit += vec2(sin(gph), cos(gph*0.83 + 1.7))*(0.035 + 0.045*uGust);
    vec2 ln = lf.xy/hs;
    vec2 dq = ln*2. + 0.5*(gwHash2(vec2(lf.w*71., 9.)) - 0.5), dc = fract(dq) - 0.5;
    float dimFade = smoothstep(5., 14., flatPx*0.25)*(1. - smoothstep(90., 150., dist));
    vec2 lnb = clamp(ln, -1., 1.);
    vec2 tilt = (jit + lnb*uBowl + dc*exp(-dot(dc, dc)*6.)*0.42*dimFade)*facet;
    tilt *= 1. - 0.6*chalk;
    vec3 Nf = normalize(N + T*tilt.x + B*tilt.y);
    if (!front) Nf = -Nf;
    vec3 R = reflect(-V, Nf);
    vec3 tinM = uPal[6];
    float tip = clamp((dot(Nf, V) - dot(front ? N : -N, V))*uTip, -0.30, 0.36)*facet;
    vec3 rel = gwSky(R)/max(tinM, vec3(1e-3));
    vec3 Ns = front ? N : -N;
    float wallM = (1. - smoothstep(0.25, 0.45, abs(N.y)))*isCu*step(1e-3, lf.z);
    float nhl = max(length(Ns.xz), 1e-3);
    // (the band is placed by the wall's mean normal, so it runs unbroken from flat to flat; each flat's bowl only bends it)
    // (it lies on the upper storey, 3 to 9 m under the eaves, wherever the eye is not far above the wall; a slow
    // swell runs forward along it)
    float bandW = 0.5 + 0.5*sin(dot(P.xz, vec2(0.02, 0.105)) - uTime*2.3 + 1.2*sin(dot(P.xz, vec2(-0.05, 0.031))));
    float bandH = smoothstep(2.0, 3.8, sv + 0.8*bandW)*(1. - smoothstep(7.4, 10.2, sv + 1.6*bandW));
    float skyv = bandH*(0.60 + 0.40*bandW)*smoothstep(0.42, -0.05, V.y)*smoothstep(0.0, 0.04, dot(V, Ns));
    rel = mix(rel, mix(vec3(0.62, 0.52, 0.47), rel*vec3(1.08, 1.10, 1.12), skyv), wallM);
    float ndv = clamp(dot(Nf, V), 0., 1.), f1 = 1. - ndv, fres = f1*f1*f1;
    vec3 matte = base*(0.95 + 0.09*Nf.y + 0.08*dot(Nf, uKeyDir));
    vec3 shiny = base*mix(0.42 + 0.64*rel, 0.33 + 0.80*rel*rel, resist*0.85);
    vec3 col = mix(shiny, matte, chalk);
    col *= (1. + tip*(1. - 0.55*chalk))*(1. - 0.72*shelter*isGilt);
    col = mix(col, mix(base*1.28, tinM, 0.30)*(1.10 + 0.7*tip), skyv*wallM*0.95*(1. - chalk)*(1. - shelter));
    // a slope turned to the pale dry sky is a step brighter than one turned to the shower
    float rl2 = max(length(uRainN), 1e-4);
    col *= 1. + (0.17*smoothstep(-0.1, 0.8, dot(Ns, uKeyDir)) - 0.13*smoothstep(0.1, 0.9, -dot(Ns.xz, uRainN)/rl2))*(1. - 0.6*chalk)*(1. - isGilt);
    col *= 1. - 0.32*wallM*(1. - smoothstep(0.5, 12., P.y));        // a wall's lower storeys see less of the sky
    // one flat in six is aimed at the pale sky and goes silver: a planished mirror, in loose bands that the gusts
    // slide across the roofs
    vec3 Pc = P - T*lf.x - B*lf.y;                       // the flat's centre: a flat is silver or not as a whole
    float mph = dot(Pc.xz, vec2(0.040, 0.012)) + Pc.y*0.02 - uTime*0.80 + 0.8*sin(dot(Pc.xz, vec2(-0.008, 0.019)) + 1.3);
    float mv = 0.66*sin(mph) + 0.16*sin(mph*0.43 + 2.) + (gwHash(vec2(lf.w*113., 5.)) - 0.5)*0.38;
    float mirror = smoothstep(0.40, 0.60, mv)*isCu*(1. - chalk)*(1. - shelter)*step(1e-3, lf.z);
    float relL = dot(rel, vec3(0.333));
    mirror *= smoothstep(0.2, 0.5, abs(N.y));               // roofs only: a wall has its band instead
    vec2 lb = clamp(ln, -1., 1.);
    vec3 mflat = mix(base, tinM, 0.55*(1. - 0.75*resist))*(0.92 + 0.26*relL + 0.25*resist)*mix(1., 0.72, wet*(1. - resist));
    vec3 mcol = mflat*(1.04 + 0.42*lb.x - 0.34*lb.y - 0.10*dot(lb, lb));
    col = mix(col, mcol, mirror*facet);
    col = mix(col, mflat, 0.07*(1. - facet)*isCu*(1. - chalk)*(1. - shelter)*step(1e-3, lf.z));
    col *= mix(1., mix(0.54, 1.0, smoothstep(0.5, 0.7, age)), wet*(1. - 0.55*resist)*(1. - isGilt));               // wet metal is darker...
    // the line itself: where it is passing, the drops hop and the roofs are spattered silver
    float splash = smoothstep(0., 0.10, w)*(1. - smoothstep(0.25, 0.95, w))*open*step(1e-3, lf.z)*smoothstep(0.2, 0.5, abs(N.y))*clamp(0.8/max(uSoft, 0.05), 0.2, 1.);
    col = mix(col, tinM*1.06, splash*(0.30 + 0.45*gwNoise(P.xz*1.9 + vec2(uTime*2.3, -uTime*1.7)))*(1. - isGilt));
    float kd = max(dot(R, uKeyDir), 1e-4);
    float spec = pow(kd, mix(10., 70., max(wet, isGilt*0.6)))*mix(0.46, 0.95, wet);   // ...and its highlight tighter
    vec3 specCol = mix(mix(base, tinM, 0.65), mix(uPal[5], uPal[0], 0.3)*1.2, uSlot*0.7);
    col += specCol*spec*(1. - chalk);
    col = mix(col, tinM*rel, fres*0.52*(1. - chalk));
    // shader seams and rivets (where there is no real rib): min width 1.5 px, flat tint when too fine
    float fws = fwl;
    if (sf.z > 0.) {
      float fine2 = smoothstep(3., 7., sp/fws), wl = max(0.035, 1.5*fws);
      float line = (1. - smoothstep(wl*0.5, wl, seamD))*fine2;
      float band = (1. - smoothstep(wl, wl*2.4, seamD))*fine2 - line;
      float sgn = (fract(su/sp) < 0.5 ? 1. : -1.)*(dot(T, uKeyDir) < 0. ? 1. : -1.);
      float lit = band*step(0., sgn), shd = band*step(sgn, 0.);
      col *= 1. - 0.10*line - 0.36*shd - 0.04*(1. - fine2); col += mix(base, tinM, 0.7)*(0.34*lit + 0.10*line)*(1. - chalk);
      float rv = fract(sv/0.30) - 0.5, rd = length(vec2(seamD - 0.11, rv*0.30));
      float dotp = (1. - smoothstep(0.022, 0.040, rd))*smoothstep(1.2, 3., 0.035/fws);
      col *= 1. + dotp*(rv > 0. ? -0.35 : 0.45);
    }
    // the oiled new sheet: water beads, slides and runs off in bright threads
    float hdr = 0.;
    float bwet = wet*resist;
    if (bwet > 0.01) {
      float bs = 0.21, ci = floor(su/bs), spd = 0.5 + 1.3*gwHash(vec2(ci, 7.));
      float bv = (sv - uTime*spd)/0.9 + gwHash(vec2(ci, 3.))*7.;
      float on = step(0.45, gwHash(vec2(ci, floor(bv))));
      vec2 bc = vec2((fract(su/bs) - 0.5)*bs + 0.05*(gwHash(vec2(ci, 11.)) - 0.5), (fract(bv) - 0.5)*0.9);
      float seen = smoothstep(0.6, 2.2, 0.035/fws);
      float rb = max(0.035, 1.2*fws);
      float bead = on*(1. - smoothstep(rb*0.5, rb, length(bc)));
      float thr = on*(1. - smoothstep(0.012, 0.012 + max(0.02, fws), abs(bc.x)))*smoothstep(-0.45, 0.0, bc.y)*step(bc.y, 0.);
      float mk = clamp(bead + thr*0.7, 0., 1.)*seen*bwet;
      col = mix(col, tinM*(1.15 + 0.5*uSlot), mk);
      col *= 1. + 0.05*(1. - seen)*bwet;
      hdr += mk*uSlot*0.6;
    }
    // tinned sheet under rain is pocked: rings that open and fade, only where the line has passed
    if (kind > 1.5 && wet > 0.01) {
      vec2 pq = P.xz*0.8, pi = floor(pq); float ph = uTime*1.6 + gwHash(pi)*9.; vec2 pc = fract(pq) - 0.5 - 0.3*(gwHash2(pi + floor(ph)*7.) - 0.5);
      float pr = fract(ph)*0.42, ring = (1. - smoothstep(0.03, 0.09, abs(length(pc) - pr)))*(1. - fract(ph))*smoothstep(1.5, 4., 1.25/max(fws, 1e-4));
      col *= 1. + (0.55*ring - 0.06)*wet;
    }
    // after the break: the low light lands on wet metal as a run: a warm band that climbs the gores and crosses the
    // roofs, every wet flat in it turned to the break fired together (oiled new copper only brightens)
    vec2 sl = gwSlot(R);
    float took = mix(0.22, 1., max(wet*(1. - resist), isGilt));
    float fire = sl.y*(1. - chalk)*took;
    float faceS = dot(Ns, uSlotDir);
    float rph = P.y*0.21 + dot(P.xz, vec2(0.052, 0.031)) - uTime*1.5;
    float run = smoothstep(0.30, 0.78, sin(rph + 0.7*sin(dot(P.xz, vec2(0.11, -0.07)) + P.y*0.05)));
    float tipS = dot(Nf, uSlotDir) - faceS;
    float fireRun = uSlot*run*smoothstep(-0.62, 0.12, faceS)*(0.78 + 0.22*smoothstep(-0.02, 0.08, tipS))*took*(1. - 0.7*chalk)*(1. - shelter)*(1. - isGilt);
    // fire-gilt: the limbs turned to the break blaze, the others fall a little behind
    float gf = uSlot*isGilt*(1. - shelter);
    vec3 ad = P - uArm.xyz; float inArm = 1. - smoothstep(0.9, 1.25, length(ad)/max(uArm.w, 1e-3));
    float armS = dot(ad, uSlotDir)/max(uArm.w, 1e-3);               // across the armillary: +1 on the limb nearest the break
    float litG = gf*mix(smoothstep(-0.15, 0.55, dot(Nf, uSlotDir)), smoothstep(-0.25, 0.55, armS), inArm)*(0.8 + 0.2*run);
    col *= 1. - gf*mix(0.20*smoothstep(0.25, -0.5, faceS), 0.34*smoothstep(0.15, -0.6, armS), inArm);
    vec3 gold = mix(uPal[0], uPal[5], 0.66)*vec3(1.04, 0.97, 0.80);
    col += gold*fire*1.25;
    col = mix(col, gold*(0.92 + 0.12*relL), clamp(fireRun, 0., 1.)*0.90);
    col = mix(col, uPal[5]*1.12 + uPal[0]*0.34, litG*0.8);
    hdr += fire*1.5 + fireRun*0.12 + litG*0.45 + isGilt*spec*0.9;
    // a gilt leaf in its recess is dark bronze until one of its flats catches the sky as we pass
    float leaf = isGilt*step(0.5, shelter);
    if (leaf > 0.5) {
      vec3 lc = P - T*lf.x - B*lf.y - cameraPosition;
      float lgo = (length(lc.xz) - (3.5 + 27.*gwHash(vec2(lf.w*57., 2.))))/2.7;
      float flash = exp(-lgo*lgo)*step(1e-3, lf.z);
      col = mix(mix(uPal[5], uPal[1], 0.55)*(0.30 + 0.17*relL), uPal[5]*1.02, flash); hdr = flash*0.5;
    }
    // the back of the sheet: dull brown, every dimple inverted
    if (!front && kind < 0.2) { col = uPal[2]*(0.55 + 0.35*dot(rel, vec3(0.333)))*(0.9 + 0.2*isGilt); hdr = 0.; }
    // distance is patina, not fog: paler and greener until the horizon is a mint line under tin
    float far = smoothstep(uFar.x, uFar.y, dist);
    col = mix(col, mix(uPal[4], tinM, 0.3)*0.98, far*0.92);
    return vec4(col, hdr*(1. - far));
  }`,_t=`
  attribute vec4 aFlat, aState; attribute vec3 aSurf;
  uniform float uTime, uGust, uPx, uFront; uniform vec2 uRainN;
  varying vec3 vP, vN, vT, vSurf; varying vec4 vFlat, vState;
  void main(){
    vec3 p = position;
    #ifdef GW_ROD
      // drawn rod and strip: the instance's local x,z are its section; never thinner than 1.5 px on screen
      vec4 c0 = modelMatrix*instanceMatrix*vec4(0., p.y, 0., 1.);
      float sx = length((modelMatrix*instanceMatrix*vec4(1., 0., 0., 0.)).xyz);
      // (far off the scaffold thins to a light, even hatch: finer rods, some of them dropped, their colour leaning
      // to the new sheet behind them; gilt rings (kind 1) and water threads (kind 2) are never dropped)
      float rd = length(c0.xyz - cameraPosition), farK = smoothstep(200., 520., rd);
      float special = step(0.5, aState.z);
      float need = mix(0.8, mix(0.55, 0.8, step(1.5, aState.z)), farK)*uPx*rd/max(projectionMatrix[1][1], 1e-3);
      float k = max(1., need/max(sx*0.5, 1e-4));
      p.xz *= min(k, mix(12., 60., special))*max(step(0.76*farK, aFlat.w), special);
      // loose strip and rope sway from their fixed end; a tin rod is a thread of water that only runs once it rains
      p.x += step(0.5, aState.w)*p.y*(0.25/max(sx, 1e-3))*(0.3 + uGust)*sin(uTime*(1.5 + aFlat.w*2.) + p.y*2. + aFlat.w*50.);
      vec3 o0 = (modelMatrix*instanceMatrix*vec4(0., 0., 0., 1.)).xyz;
      p.y *= mix(1., smoothstep(0.3, 2.2, (uFront - dot(uRainN, o0.xz))/6.5), step(1.5, aState.z));
    #endif
    #ifdef USE_INSTANCING
      mat4 mm = modelMatrix*instanceMatrix;
    #else
      mat4 mm = modelMatrix;
    #endif
    vec4 wp = mm*vec4(p, 1.);
    mat3 m3 = mat3(mm);
    vec3 n = normal; float nl = dot(n, n); n = nl > 1e-8 ? n*inversesqrt(nl) : vec3(0., 1., 0.);
    vec3 wn = m3*n; float wl = dot(wn, wn); vN = wl > 1e-10 ? wn*inversesqrt(wl) : vec3(0., 1., 0.);
    vec3 wt = m3*gwTangentV(n); float tl = dot(wt, wt); vT = tl > 1e-10 ? wt*inversesqrt(tl) : vec3(1., 0., 0.);
    vP = wp.xyz; vFlat = aFlat; vState = aState; vSurf = aSurf;
    #ifdef GW_ROD
      vState.w = 0.85;
      vState.x = mix(aState.x, 0.10, 0.8*smoothstep(200., 520., length(wp.xyz - cameraPosition))*(1. - step(0.5, aState.z)));
    #endif
    gl_Position = projectionMatrix*viewMatrix*wp;
  }`,Ht=`
  varying vec3 vP, vN, vT, vSurf; varying vec4 vFlat, vState;
  void main(){
    vec3 dv = cameraPosition - vP; float dist = max(length(dv), 1e-3); vec3 V = dv/dist;
    float fw = max(length(dFdx(vP)), length(dFdy(vP)));
    vec3 N = vN; float nl = dot(N, N); N = nl > 1e-8 ? N*inversesqrt(nl) : vec3(0., 1., 0.);
    vec3 T = vT - N*dot(vT, N); float tl = dot(T, T); T = tl > 1e-8 ? T*inversesqrt(tl) : gwTangent(N);
    vec4 m = gwMetal(vP, N, T, V, vFlat, vState, vSurf, fw, dist, gl_FrontFacing);
    gl_FragColor = vec4(gwFinish(m.rgb, m.a), 1.);
  }`;function yt(t,e={}){const o=new y.ShaderMaterial({uniforms:t.uniforms,side:y.DoubleSide,vertexShader:`vec3 gwTangentV(vec3 n){ vec3 t = vec3(n.z, 0., -n.x); float l = dot(t, t); return l > 1e-6 ? t*inversesqrt(l) : vec3(1., 0., 0.); }
`+_t,fragmentShader:vt+Ht});return e.rod&&(o.defines={GW_ROD:1}),o}class ut{constructor(e,o=3e4){this.rng=e,this.n=0,this.cap=o,this.pos=new Float32Array(o*3),this.nor=new Float32Array(o*3),this.flat=new Float32Array(o*4),this.st=new Float32Array(o*4),this.surf=new Float32Array(o*3),this.age=.25,this.shelter=0,this.kind=0,this.resist=0,this.seam=-.6,this.facets=!0,this.ageFn=null}set(e,o=0,c=0,v=0){return this.age=e,this.shelter=o,this.kind=c,this.resist=v,this}_grow(){const e=(o,c)=>{const v=new Float32Array(this.cap*2*c);return v.set(o),v};this.pos=e(this.pos,3),this.nor=e(this.nor,3),this.flat=e(this.flat,4),this.st=e(this.st,4),this.surf=e(this.surf,3),this.cap*=2}_v(e,o,c,v,a,s,M,l,f,w){this.n>=this.cap&&this._grow();const P=this.n++,n=P*3,u=P*4;this.pos[n]=e[0],this.pos[n+1]=e[1],this.pos[n+2]=e[2],e.length>=8?(this.nor[n]=e[5],this.nor[n+1]=e[6],this.nor[n+2]=e[7]):(this.nor[n]=o,this.nor[n+1]=c,this.nor[n+2]=v),this.flat[u]=a,this.flat[u+1]=s,this.flat[u+2]=M,this.flat[u+3]=l,this.st[u]=f,this.st[u+1]=this.shelter,this.st[u+2]=this.kind,this.st[u+3]=w,this.surf[n]=e.length>3?e[3]:a,this.surf[n+1]=e.length>4?e[4]:-s,this.surf[n+2]=this.seam}quad(e,o,c,v){const a=v||c;let s=(c[1]-e[1])*(a[2]-o[2])-(c[2]-e[2])*(a[1]-o[1]),M=(c[2]-e[2])*(a[0]-o[0])-(c[0]-e[0])*(a[2]-o[2]),l=(c[0]-e[0])*(a[1]-o[1])-(c[1]-e[1])*(a[0]-o[0]);if(!v){const d=o[0]-e[0],q=o[1]-e[1],B=o[2]-e[2],z=c[0]-e[0],V=c[1]-e[1],j=c[2]-e[2];s=q*j-B*V,M=B*z-d*j,l=d*V-q*z}const f=Math.hypot(s,M,l);if(f<1e-12)return;s/=f,M/=f,l/=f;let w=l,P=-s;const n=Math.hypot(w,P);n>.001?(w/=n,P/=n):(w=1,P=0);const u=M*P,p=l*w-s*P,i=-M*w,r=v?4:3,F=(e[0]+o[0]+c[0]+(v?v[0]:0))/r,x=(e[1]+o[1]+c[1]+(v?v[1]:0))/r,g=(e[2]+o[2]+c[2]+(v?v[2]:0))/r,D=this.facets?.5*Math.sqrt(f*.5):0,S=this.rng();let h=this.age,N=this.resist;if(this.ageFn){const d=this.ageFn(F,x,g,S);h=d[0],N=d[1]}const m=d=>{const q=d[0]-F,B=d[1]-x,z=d[2]-g;this._v(d,s,M,l,q*w+z*P,q*u+B*p+z*i,D,S,h,N)};m(e),m(o),m(c),v&&(m(e),m(c),m(v))}grid(e,o,c,v=!1){let a=[],s=[];for(let M=0;M<=e;M++)a.push(c(M/e,0));for(let M=1;M<=o;M++){s=[];for(let l=0;l<=e;l++)s.push(c(l/e,M/o));for(let l=0;l<e;l++)v?this.quad(a[l+1],a[l],s[l],s[l+1]):this.quad(a[l],a[l+1],s[l+1],s[l]);a=s}}tube(e,o,c=5,v=!1){const a=e.length,s=[];let M=0,l=1,f=0,w=0;const P=this.facets;this.facets=!1;for(let u=0;u<a;u++){const p=e[v?(u+a-1)%a:Math.max(u-1,0)],i=e[v?(u+1)%a:Math.min(u+1,a-1)];let r=i[0]-p[0],F=i[1]-p[1],x=i[2]-p[2];const g=Math.hypot(r,F,x)||1;r/=g,F/=g,x/=g,u===0&&Math.abs(F)>.9&&(M=1,l=0,f=0);let D=M*r+l*F+f*x;M-=r*D,l-=F*D,f-=x*D;const S=Math.hypot(M,l,f)||1;M/=S,l/=S,f/=S;const h=F*f-x*l,N=x*M-r*f,m=r*l-F*M;u>0&&(w+=Math.hypot(e[u][0]-e[u-1][0],e[u][1]-e[u-1][1],e[u][2]-e[u-1][2]));const d=typeof o=="function"?o(u):o,q=[];for(let B=0;B<=c;B++){const z=B/c*_,V=Math.cos(z),j=Math.sin(z),L=M*V+h*j,K=l*V+N*j,H=f*V+m*j;q.push([e[u][0]+L*d,e[u][1]+K*d,e[u][2]+H*d,B/c*_*d,w,L,K,H])}s.push(q)}const n=v?a:a-1;for(let u=0;u<n;u++){const p=s[u],i=s[(u+1)%a];for(let r=0;r<c;r++)this.quad(p[r],p[r+1],i[r+1],i[r])}this.facets=P}geometry(){const e=new y.BufferGeometry,o=this.n;return e.setAttribute("position",new y.BufferAttribute(this.pos.slice(0,o*3),3)),e.setAttribute("normal",new y.BufferAttribute(this.nor.slice(0,o*3),3)),e.setAttribute("aFlat",new y.BufferAttribute(this.flat.slice(0,o*4),4)),e.setAttribute("aState",new y.BufferAttribute(this.st.slice(0,o*4),4)),e.setAttribute("aSurf",new y.BufferAttribute(this.surf.slice(0,o*3),3)),e}}const R={y0:41,R0:34,c:21,Rc:55,phiMax:1.0535,N:32,drumR:35,lanY:88.6,lanTop:106,armY:132},E=_/R.N;function U(t,e,o,c=0){const v=(t+e)*E,a=Math.cos(o),s=Math.sin(o),M=R.Rc*a-R.c+.42*Math.sin(Math.PI*e)*(.3+.7*a)+c*a;return[M*Math.sin(v),R.y0+R.Rc*s+c*s,M*Math.cos(v)]}const At=t=>(t%R.N+R.N)%R.N<R.N/2;function Wt(t){const e=t.range(.95,1),o=t.range(0,.07),c=18+t.int(0,11),v=t.range(.27,.4);return{oldAge:e,newAge:o,state(a,s,M=0){return At(a)?[o+s*.07,1]:a===c?[v+.08*s,0]:[rt(e-.05*s*s-M*.5,.55,1),0]},patch:c}}async function Et(t,e,o,c){const v=R.Rc*R.phiMax,a=48;for(let s=0;s<R.N;s++){const M=At(s);for(let l=0;l<a;l++){const f=l/a*R.phiMax,w=(l+1)/a*R.phiMax,P=(f+w)/2;if(c&&s===c.g&&l>=c.j0&&l<c.j1){l%2===0&&(t.ageFn=null,t.set(.5,.5,0,0),t.seam=-1,t.tube([U(s,.02,f,-.22),U(s,.5,f,-.22),U(s,.98,f,-.22)],.11,4),t.set(.25));continue}const n=(R.Rc*Math.cos(P)-R.c)*E,u=rt(Math.round(n/1.3),2,6);t.seam=-2,t.ageFn=(p,i,r,F)=>e.state(s,F,M?0:.06*(1-l/a)),t.grid(u,1,(p,i)=>{const r=U(s,p,i?w+.002:f,i?0:.05);return r.push(p*6,v-(i?w:f)*R.Rc),r})}for(let l=1;l<=2;l++){const f=l/3,w=24;t.ageFn=(P,n,u,p)=>e.state(s,p*.5);for(let P=0;P<w;P++){const n=P/w*R.phiMax,u=(P+1)/w*R.phiMax;if(c&&s===c.g&&P*2>=c.j0&&P*2<c.j1)continue;const p=.05/Math.max((R.Rc*Math.cos(n)-R.c)*E,.5),i=.05/Math.max((R.Rc*Math.cos(u)-R.c)*E,.5),r=U(s,f-p,n,.04),F=U(s,f,n,.13),x=U(s,f+p,n,.04),g=U(s,f-i,u,.04),D=U(s,f,u,.13),S=U(s,f+i,u,.04),h=v-n*R.Rc,N=v-u*R.Rc,m=f*6;r.push(m,h),F.push(m,h),x.push(m,h),g.push(m,N),D.push(m,N),S.push(m,N),t.facets=!1,t.quad(r,F,D,g),t.quad(F,x,S,D),t.facets=!0}}s%2===1&&await o.yield()}t.ageFn=null}async function Kt(t,e,o,c){const v=R.Rc*R.phiMax,a=46;for(let s=0;s<R.N;s++){const M=s%8===0,l=s===0||s===R.N/2,f=l?.62:M?.5:.36,w=l?.75:M?.6:.42,P=[[-1,0],[-.72,.62],[-.3,1],[.3,1],[.72,.62],[1,0]],n=(i,r)=>{const F=Math.max((R.Rc*Math.cos(r)-R.c)*E,.4),x=1-.4*(r/R.phiMax),g=U(s,P[i][0]*f*x/F,r,.03+P[i][1]*w*x);return g.push(P[i][0]*f*x,v-r*R.Rc),g};for(let i=0;i<5;i++){const r=l?s===0?i<2.5?R.N-1:0:i<2.5?R.N/2-1:R.N/2:i<2.5?s-1:s;t.seam=-1.6,t.ageFn=(F,x,g,D)=>{const S=e.state(r,D);return S[1]||(S[0]=Math.max(S[0]-.12-(i===0||i===4?.25:0),.5)),S};for(let F=0;F<a;F++){const x=F/a*R.phiMax,g=(F+1)/a*R.phiMax;t.quad(n(i,x),n(i+1,x),n(i+1,g),n(i,g))}}const u=Math.min(s,R.N-s)<=4,p=u?.5:2.6;for(let i=.4;i<v-.5;i+=p){const r=i/R.Rc,F=Math.max((R.Rc*Math.cos(r)-R.c)*E,.4),x=1-.4*(r/R.phiMax);for(const g of[-1,1]){const D=g*(f*x+.13)/F,S=U(s,D,r,.07),h=U(s,D,r,1.07);c.push(S[0],S[1],S[2],h[0]-S[0],h[1]-S[1],h[2]-S[2],g<0?s-1:s,u?.055:.075)}}s%3===2&&await o.yield()}t.ageFn=null}function ct(t,e,o,c,v=0,a=_,s=-2.4){let M=0;const l=[0];for(let w=1;w<e.length;w++)M+=Math.hypot(e[w][0]-e[w-1][0],e[w][1]-e[w-1][1]),l.push(M);const f=(w,P)=>[e[P][0]*Math.sin(w),e[P][1],e[P][0]*Math.cos(w),w*35,M-l[P]];t.seam=s;for(let w=0;w<o;w++){const P=v+(a-v)*w/o,n=v+(a-v)*(w+1)/o,u=Math.floor((P+n)/2/E);for(let p=0;p<e.length-1;p++)t.shelter=e[p][2]||0,t.ageFn=(i,r,F,x)=>c(u,x,p),t.quad(f(P,p),f(n,p),f(n,p+1),f(P,p+1))}t.shelter=0,t.ageFn=null}const Ot=(t,e,o,c=0)=>{const v=[];for(let a=0;a<o;a++){const s=c+a/o*_;v.push([t*Math.sin(s),e,t*Math.cos(s)])}return v};async function Yt(t,e,o,c){const v=c.range(.52,.62),a=(x,g)=>[v+.08*g,0],s=(x,g)=>e.state(x,g,.05);ct(t,[[39.6,0],[39.6,.9],[38.4,.9],[38.4,1.8],[37.2,1.8],[37.2,2.7],[36,2.9],[36,3.6],[35,4]],96,a,0,_,2.3),await o.yield();const M=4,l=26.4,f=R.drumR,w=16,P=_/w,n=(x,g,D=0)=>[(f+D)*Math.sin(x),g,(f+D)*Math.cos(x),x*f,l-g];for(let x=0;x<w;x++){const g=(x-.5)*P+P*.5,D=10,S=14,h=P/D,N=(l-M)/S,m=3,d=7,q=3,B=9,z=g+P*.5,V=2*h,j=V*f,L=M+B*N,K=L+3*N;t.seam=1.37,t.ageFn=(b,k,I,C)=>a(0,C);for(let b=0;b<S;b++)for(let k=0;k<D;k++){if(k>=m&&k<d&&b>=q&&b<B+3)continue;const C=M+b*N,W=C+N;t.shelter=Z(l-4.5,l-.6,(C+W)/2)*.95,t.quad(n(g+k*h,C),n(g+(k+1)*h,C),n(g+(k+1)*h,W),n(g+k*h,W))}t.shelter=0;for(let b=0;b<8;b++){const k=Math.PI-b/8*Math.PI,I=Math.PI-(b+1)/8*Math.PI,C=n(z+Math.cos(k)*j/f,L+Math.sin(k)*j),W=n(z+Math.cos(I)*j/f,L+Math.sin(I)*j);t.quad(C,W,n(z+Math.cos(I)*j/f,K),n(z+Math.cos(k)*j/f,K))}const H=M+q*N,O=z-V,Q=z+V,X=[];X.push([O,H]);for(let b=0;b<=10;b++){const k=Math.PI-b/10*Math.PI;X.push([z+Math.cos(k)*j/f,L+Math.sin(k)*j])}X.push([Q,H]),t.set(.5,.85),t.seam=-3,t.ageFn=null;for(let b=0;b<X.length-1;b++)t.quad(n(X[b][0],X[b][1],-.7),n(X[b+1][0],X[b+1][1],-.7),n(X[b+1][0],X[b+1][1]),n(X[b][0],X[b][1]));t.quad(n(Q,H,-.7),n(O,H,-.7),n(O,H),n(Q,H)),t.set(0,0,1,0);for(let b=0;b<7;b++)for(let k=0;k<4;k++){const I=H+b/7*(K-H),C=H+(b+1)/7*(K-H),W=O+k/4*(Q-O),Y=O+(k+1)/4*(Q-O);t.quad(n(W,I,-.66),n(Y,I,-.66),n(Y,C,-.66),n(W,C,-.66))}t.set(v+.1,.35,0,0),t.facets=!1;const A=(b,k,I,C,W)=>{const Y=(I-b)*f,ot=C-k,$=Math.hypot(Y,ot)||1,at=-ot/$*W/f,st=Y/$*W;t.quad(n(b-at,k-st,-.12),n(I-at,C-st,-.12),n(I+at,C+st,-.12),n(b+at,k+st,-.12))};for(let b=1;b<4;b++){const k=O+b/4*(Q-O);A(k,H,k,L+(b===2?0:j*.86),.09)}for(let b=1;b<=4;b++){const k=H+b/4.6*(L-H);A(Q,k,O,k,.09)}for(let b=0;b<12;b++){const k=b/12*_,I=(b+1)/12*_,C=j*.52,W=L+j*.3;A(z+Math.cos(k)*C/f,W+Math.sin(k)*C,z+Math.cos(I)*C/f,W+Math.sin(I)*C,.08),b%2===0&&A(z,W,z+Math.cos(k)*C/f,W+Math.sin(k)*C,.06)}t.facets=!0,t.set(v-.1,.1),t.tube(X.map(b=>n(b[0],b[1],.1).slice(0,3)),.24,5);const T=g,G=1.25/f;t.seam=-1.2,t.ageFn=(b,k,I,C)=>a(0,C*.7);for(let b=0;b<11;b++){const k=M+b/11*(l-M-1.2),I=M+(b+1)/11*(l-M-1.2),C=b===0?1.25:.95,W=b===0?1.25:.95,Y=b===0?1.25:1;t.shelter=Z(l-4.5,l-.6,I)*.7,t.quad(n(T-G*Y,k,0),n(T-G*Y,k,C),n(T-G*Y,I,W),n(T-G*Y,I,0)),t.quad(n(T-G*Y,k,C),n(T+G*Y,k,C),n(T+G*Y,I,W),n(T-G*Y,I,W)),t.quad(n(T+G*Y,k,C),n(T+G*Y,k,0),n(T+G*Y,I,0),n(T+G*Y,I,W))}t.shelter=0,t.ageFn=null,x%2===1&&await o.yield()}ct(t,[[35,25.6,.9],[35.5,26.5,1],[37,27.3,1],[37.35,27.5,.3],[37.2,28.1],[36.2,28.5],[34.9,29.4],[34.3,29.5]],96,a,0,_,-2.3),t.set(v,.2),t.tube(Ot(37.4,27.72,96),.3,5,!0),await o.yield();const u=34.3,p=29.5,i=37.2,r=(x,g,D=0)=>[(u+D)*Math.sin(x),g,(u+D)*Math.cos(x),x*u,i-g];for(let x=0;x<R.N;x++){const g=x*E;t.seam=1.68,t.ageFn=(q,B,z,V)=>s(x,V);for(let q=0;q<5;q++)for(let B=0;B<4;B++){const z=p+q/5*(i-p),V=p+(q+1)/5*(i-p);t.shelter=Z(i-2.6,i-.3,(z+V)/2)*.9,t.quad(r(g+B/4*E,z),r(g+(B+1)/4*E,z),r(g+(B+1)/4*E,V),r(g+B/4*E,V))}t.ageFn=null,t.shelter=0;const D=g+E/2,S=p+3.5,h=1.45,N=[];t.set(0,0,1,0);for(let q=0;q<10;q++){const B=q/10*_,z=(q+1)/10*_;t.quad(r(D,S,.22),r(D+Math.cos(B)*h/u,S+Math.sin(B)*h,.1),r(D+Math.cos(z)*h/u,S+Math.sin(z)*h,.1)),N.push(r(D+Math.cos(B)*h/u,S+Math.sin(B)*h,.16).slice(0,3))}const m=s(x,.5);t.set(Math.max(m[0]-.15,0),0,0,m[1]),t.tube(N,.2,4,!0);const d=.5/u;t.seam=-1,t.ageFn=(q,B,z,V)=>s(x,V),t.quad(r(g-d,p,.3),r(g+d,p,.3),r(g+d,i,.3),r(g-d,i,.3)),t.quad(r(g-d,p,0),r(g-d,p,.3),r(g-d,i,.3),r(g-d,i,0)),t.quad(r(g+d,p,.3),r(g+d,p,0),r(g+d,i,0),r(g+d,i,.3)),t.ageFn=null,x%3===2&&await o.yield()}t.set(.25),ct(t,[[34.3,36.9,.9],[34.9,37.7,1],[36,38.3,1],[36.3,38.5,.2],[36.2,39.1],[35.5,39.3],[35.3,38.9],[34.6,39],[34.5,40.2],[33.9,41.2]],96,s,0,_,-2.2);for(let x=0;x<2;x++){const g=[];for(let S=0;S<=48;S++){const h=x*Math.PI+S/48*Math.PI;g.push([36.38*Math.sin(h),38.82,36.38*Math.cos(h)])}const D=s(x?20:4,.4);t.set(D[0],0,0,D[1]),t.tube(g,.26,5)}await o.yield();const F=[];for(let x=0;x<R.N;x++){const g=x*E,D=[],S=s(x===0?R.N-1:x,.3);for(let h=0;h<=9;h++){const N=h/9,m=36.2+2*Math.sin(N*1.9)+(N>.6?-.9*(1-Math.cos((N-.6)*7))*.5:0),d=38.6-2.4*N*N+(N>.6?.9*Math.sin((N-.6)*7)*.5:0);D.push([m*Math.sin(g),d,m*Math.cos(g)])}t.set(Math.max(S[0]-.1,0),0,0,S[1]),t.tube(D,h=>.2-.008*h,4),F.push([38.1*Math.sin(g),37,38.1*Math.cos(g)])}return t.set(.25),t.seam=-.6,{spoutTips:F}}async function Ut(t,e,o){const c=(l,f)=>e.state(l,f,.04);ct(t,[[7.9,87.2],[8.3,88.2],[8.1,88.9],[7,89.3],[6.7,89.9],[6.2,90.1]],32,c,0,_,-1.3);for(let l=0;l<2;l++){const f=[];for(let P=0;P<=16;P++){const n=l*Math.PI+P/16*Math.PI;f.push([8.35*Math.sin(n),88.55,8.35*Math.cos(n)])}const w=c(l?20:4,.4);t.set(w[0],0,0,w[1]),t.tube(f,.22,4)}t.set(.5,1),ct(t,[[4.9,90,1],[4.9,93.5,1],[4.9,97.6,1]],16,()=>[.5,0],0,_,1.2);const v=16,a=_/v;for(let l=0;l<v;l++){const f=l*a,w=l===0?R.N-1:l*2,P=c(w,.3),n=[];for(let i=0;i<=5;i++)n.push([6.05*Math.sin(f),90.1+i*1.1,6.05*Math.cos(f)]);t.set(Math.max(P[0]-.1,0),0,0,P[1]),t.tube(n,i=>i===0||i===5?.42:.27,5);const u=c(l*2+1,.3),p=[];for(let i=0;i<=8;i++){const r=i/8,F=f+r*a;p.push([6.05*Math.sin(F),95.6+Math.sin(r*Math.PI)*1.15,6.05*Math.cos(F)])}t.set(Math.max(u[0]-.1,0),.2,0,u[1]),t.tube(p,.2,4),t.seam=-1,t.ageFn=(i,r,F,x)=>c(l*2+1,x);for(let i=0;i<4;i++){const r=i/4,F=(i+1)/4,x=f+r*a,g=f+F*a;t.quad([6*Math.sin(x),95.6+Math.sin(r*Math.PI)*1.15,6*Math.cos(x)],[6*Math.sin(g),95.6+Math.sin(F*Math.PI)*1.15,6*Math.cos(g)],[6*Math.sin(g),97.6,6*Math.cos(g)],[6*Math.sin(x),97.6,6*Math.cos(x)])}t.ageFn=null}await o.yield(),ct(t,[[6,97.5,.9],[6.5,98,1],[7.5,98.5,1],[7.75,98.7,.2],[7.6,99.2],[6.6,99.6]],32,c,0,_,-1.4);const s=l=>[5.85*(1-l)*(1-l)*(1-.35*l)+.75,99.6+6.6*(.25*l+.75*l*l)],M=[];for(let l=0;l<=7;l++)M.push(s(l/7));ct(t,M,32,c,0,_,-1.3);for(let l=0;l<v;l++){const f=l*a,w=c(l===0?R.N-1:l*2,.2),P=M.map(n=>[(n[0]+.06)*Math.sin(f),n[1]+.05,(n[0]+.06)*Math.cos(f)]);t.set(Math.max(w[0]-.15,0),0,0,w[1]),t.tube(P,n=>.16-.01*n,4)}t.set(0,0,1,0),ct(t,[[.75,106.1],[1.25,106.5],[.7,107],[1,107.5],[1.75,108.3],[2.05,109.4],[1.75,110.5],[1,111.3],[.6,111.9],[.85,112.4],[.5,112.9],[.45,116],[.9,116.5],[.9,117],[0,117.6]],12,()=>[0,0],0,_,-1),t.set(.25),t.seam=-.6}function dt(t,e,o,c,v,a,s,M,l=0,f=_,w=1.6){const P=[o[1]*c[2]-o[2]*c[1],o[2]*c[0]-o[0]*c[2],o[0]*c[1]-o[1]*c[0]],n=(u,p,i)=>{const r=Math.cos(u)*p,F=Math.sin(u)*p;return[e[0]+o[0]*r+c[0]*F+P[0]*i,e[1]+o[1]*r+c[1]*F+P[1]*i,e[2]+o[2]*r+c[2]*F+P[2]*i,u*v,i]};t.seam=w;for(let u=0;u<M;u++){const p=l+(f-l)*u/M,i=l+(f-l)*(u+1)/M,r=v+s/2,F=v-s/2;t.quad(n(p,r,-a),n(i,r,-a),n(i,r,a),n(p,r,a)),t.quad(n(i,F,-a),n(p,F,-a),n(p,F,a),n(i,F,a)),t.quad(n(p,F,a),n(p,r,a),n(i,r,a),n(i,F,a)),t.quad(n(p,r,-a),n(p,F,-a),n(i,F,-a),n(i,r,-a))}if(Math.abs(f-l)<_-.001)for(const[u,p]of[[l,1],[f,-1]]){const i=v+s/2,r=v-s/2;p>0?t.quad(n(u,r,-a),n(u,i,-a),n(u,i,a),n(u,r,a)):t.quad(n(u,i,-a),n(u,r,-a),n(u,r,a),n(u,i,a))}}const tt={c:[0,R.armY,0],a:[0,.848,-.53],e1:[1,0,0],e2:[0,-.53,-.848]},et=(t,...e)=>{const o=[t[0],t[1],t[2]];for(let c=0;c<e.length;c+=2)o[0]+=e[c][0]*e[c+1],o[1]+=e[c][1]*e[c+1],o[2]+=e[c][2]*e[c+1];return o};async function Xt(t,e){const{c:o,a:c,e1:v,e2:a}=tt;t.set(0,0,1,0),dt(t,o,v,a,10.5,.62,.18,48,0,_,1.375);for(const s of[-1,1])dt(t,et(o,c,s*8.04),v,a,6.75,.3,.14,32,0,_,1.325);for(let s=0;s<4;s++){const M=Math.PI/4+s*Math.PI/2,l=et([0,0,0],v,Math.cos(M),a,Math.sin(M));dt(t,o,l,c,10.5,.26,.14,14,-.873,.873,1.31)}dt(t,o,v,a,7.55,.22,.8,48,0,_,.988),await e.yield();for(const s of[0,Math.PI,Math.PI/2]){const M=et([0,0,0],v,Math.cos(s),a,Math.sin(s)),l=et([0,0,0],v,-Math.sin(s),a,Math.cos(s));for(const f of[-1,1]){const w=[];for(let P=0;P<=10;P++){const n=P/10;w.push(et(o,M,7.9+2.55*n,l,f*.75*Math.sin(n*Math.PI)*(1-.5*n),c,0))}t.tube(w,.13,4)}t.tube([et(o,M,7.9),et(o,M,10.45)],.17,4)}for(const s of[-1,1]){const M=[];for(let f=0;f<=14;f++){const w=f/14,P=w*Math.PI/2;M.push([s*12.7*Math.sin(P),116.4+15.6*(1-Math.cos(P)),0])}t.tube(M,f=>.42-.012*f,6),t.tube([[s*12.9,132,0],[s*10.5,132,0]],.2,5);const l=[s*12.9,132,0];t.grid(6,4,(f,w)=>{const P=f*_,n=(w-.5)*Math.PI;return[l[0]+.5*Math.cos(n)*Math.cos(P),l[1]+.5*Math.sin(n),l[2]-.5*Math.cos(n)*Math.sin(P)]})}{const s=et(o,a,10.55),M=[];for(let l=0;l<=10;l++){const f=l/10;M.push([0,J(116.6,s[1],f)-1.6*Math.sin(f*Math.PI),J(0,s[2],f*f*(3-2*f))-.2])}t.tube(M,.24,5)}t.set(.25),t.seam=-.6}function $t(t,e,o,c){const v=new ut(t,2400);v.set(0,0,1,0);const a=[1,0,0],s=[0,-Math.sin(o),-Math.cos(o)],M=[0,e,0],l=8.9;dt(v,M,a,s,l,.36,.14,48,0,_,1.165);const f=[0,Math.cos(o),-Math.sin(o)],w=(p,i,r)=>et(M,a,Math.cos(p)*i,s,Math.sin(p)*i,f,r),P=p=>{for(let i=1;i<p.length-1;i++)v.quad(p[0],p[i],p[i+1])};for(let p=0;p<8;p++){const i=p/8*_+.2;P([w(i,l+.05,-.34),w(i+.035,l+.9,0),w(i,l+.05,.34)])}const n=1.1,u=(p,i)=>w(n+p/l,l+.22,i);if(c==="sun"){const p=[u(0,0)];for(let i=0;i<=12;i++)p.push(u(Math.cos(i/12*_)*.95,Math.sin(i/12*_)*.95));P(p);for(let i=0;i<12;i++){const r=i/12*_,F=.16,x=i%2?1.5:2;P([u(Math.cos(r-F)*1.05,Math.sin(r-F)*1.05),u(Math.cos(r)*x,Math.sin(r)*x),u(Math.cos(r+F)*1.05,Math.sin(r+F)*1.05)])}}else{for(let p=0;p<10;p++){const i=-1.9+p/10*3.8,r=-1.9+(p+1)/10*3.8,F=Math.cos(i/1.9*Math.PI/2),x=Math.cos(r/1.9*Math.PI/2);P([u(Math.cos(i)*1.3,Math.sin(i)*1.3),u(Math.cos(r)*1.3,Math.sin(r)*1.3),u(Math.cos(r)*(1.3-.75*x),Math.sin(r)*1.3),u(Math.cos(i)*(1.3-.75*F),Math.sin(i)*1.3)])}for(let p=0;p<3;p++){const i=2.3+p*.2,r=-.9+p*.9;P([u(i,r+.3),u(i-.3,r),u(i,r-.3),u(i+.3,r)])}}return v.geometry()}async function Qt(t,e,o,c){const v=[],a=[],s=(h,N,m=.075,d=0)=>v.push(h[0],h[1],h[2],N[0],N[1],N[2],m,d),f=h=>.03+h/11*.93,w=(h,N,m)=>{const d=.5+h,q=Math.min(Math.floor(d),15);return U(q,d-q,f(N),m)},P=(h,N,m,d)=>{t.quad(h,N,m,d)};t.facets=!0,t.seam=.3;for(let h=0;h<16;h++){const N=11-(h%2?1:0)-(e.chance(.3)?1:0);for(let m=0;m<=N;m++){const d=w(h,m,2.5),q=w(h,m,.95);if(m<N&&(s(d,w(h,m+1,2.5),.085),h%2===0&&m<8&&s(q,w(h,m+1,.95),.07)),s(q,d,.06),h<15&&m<=N-(e.chance(.2)?1:0)){if(s(d,w(h+1,m,2.5),.065),m>0){const B=[d[0],d[1]+1.05,d[2]],z=w(h+1,m,2.5);m%2===1&&s(B,[z[0],z[1]+1.05,z[2]],.045)}if(e()<.3*o&&m<N&&s(d,w(h+1,m+1,2.5),.05),m>0&&(m%2===1||e.chance(.3))&&!e.chance(.12)){const B=w(h,m,1.15),z=w(h,m,2.4),V=w(h+1,m,1.15),j=w(h+1,m,2.4),L=e.range(.03,.12),K=[(B[0]+V[0])/2,(B[1]+V[1])/2-L,(B[2]+V[2])/2],H=[(z[0]+j[0])/2,(z[1]+j[1])/2-L,(z[2]+j[2])/2];if(t.set(e.range(.16,.34),0,0,0),P(z,H,K,B),P(H,j,V,K),e.chance(.5)&&a.push([H[0],H[1]+1.1,H[2]]),e.chance(.13)){const O=[(K[0]+H[0])/2,K[1]+.02,(K[2]+H[2])/2],Q=[(j[0]-z[0])*.22,0,(j[2]-z[2])*.22],X=[(z[0]-B[0])*.3,0,(z[2]-B[2])*.3],A=e.range(.25,.7),T=(G,b,k)=>[O[0]+Q[0]*G+X[0]*b,O[1]+k,O[2]+Q[2]*G+X[2]*b];t.set(e.range(0,.08),0,0,1),t.quad(T(-1,1,A),T(1,1,A),T(1,-1,A),T(-1,-1,A)),t.quad(T(-1,1,0),T(1,1,0),T(1,1,A),T(-1,1,A)),t.quad(T(1,-1,0),T(-1,-1,0),T(-1,-1,A),T(1,-1,A)),t.quad(T(1,1,0),T(1,-1,0),T(1,-1,A),T(1,1,A)),t.quad(T(-1,-1,0),T(-1,1,0),T(-1,1,A),T(-1,-1,A))}}}if(e.chance(.07)){const B=[d[0]+e.range(-.3,.3),d[1]-e.range(1.2,2.6),d[2]+e.range(-.3,.3)];v.push(d[0],d[1],d[2],B[0],B[1],B[2],.11,1)}m===N&&a.push(d)}if(h%3===2&&await c.yield(),h%4===1)for(let m=0;m<N-1;m++){const d=w(h+(m%2?.75:.25),m,1.9),q=w(h+(m%2?.25:.75),m+1,1.9),B=w(h+.5,m,2.3),z=[B[0]-d[0],0,B[2]-d[2]],V=Math.hypot(z[0],z[2])||1,j=z[0]/V*.22,L=z[2]/V*.22;s([d[0]-j,d[1],d[2]-L],[q[0]-j,q[1]+.9,q[2]-L],.05),s([d[0]+j,d[1],d[2]+L],[q[0]+j,q[1]+.9,q[2]+L],.05);for(let K=1;K<9;K++){const H=K/9;s([J(d[0],q[0],H)-j,J(d[1],q[1]+.9,H),J(d[2],q[2],H)-L],[J(d[0],q[0],H)+j,J(d[1],q[1]+.9,H),J(d[2],q[2],H)+L],.035)}}}for(let h=0;h<=15;h+=2){const N=(h+.5)*E,m=9,d=(q,B,z=0)=>[q*Math.sin(N+z),B,q*Math.cos(N+z)];for(let q=0;q<m;q++){const B=2.8+q*4.1,z=B+4.1,V=40.6,j=38.9;if(s(d(V,B),d(V,z),.09),s(d(j,B),d(j,z),.075),s(d(j,z),d(V,z),.06),h<14){for(const L of[0,1])s(d(V,z,L*E),d(V,z,(L+1)*E),.065),q%3===1&&s(d(V,z+1.05,L*E),d(V,z+1.05,(L+1)*E),.045);if(e()<.3*o&&s(d(V,B),d(V,z,2*E),.05),q%3===1||q===m-1){t.set(e.range(.16,.34),0,0,0);for(const L of[0,1])P(d(V-.1,z+.04,L*E),d(V-.1,z+.04,(L+1)*E),d(j+.1,z+.04,(L+1)*E),d(j+.1,z+.04,L*E))}}}}const n=(3+e.int(0,8)+.5)*E,u=Math.sin(n),p=Math.cos(n),i=[39.8*u,44.5,39.8*p],r=[44*u,46.8,44*p],F=[40.6*u,39.7,40.6*p],x=e.range(14,24);s(F,r,.14),s(i,r,.09),s([38.9*u,39.7,38.9*p],i,.09),v.push(r[0],r[1]-.4,r[2],r[0],x+1.4,r[2],.045,1);const g=r[0],D=r[2],S=(h,N,m)=>[g+u*h-p*N,x+m,D+p*h+u*N];t.set(.03,0,0,1),t.quad(S(-.9,1.3,.35),S(.9,1.3,.35),S(.9,-1.3,.35),S(-.9,-1.3,.35)),t.quad(S(-.9,-1.3,0),S(.9,-1.3,0),S(.9,1.3,0),S(-.9,1.3,0)),t.quad(S(.9,1.3,0),S(.9,-1.3,0),S(.9,-1.3,.35),S(.9,1.3,.35)),t.quad(S(-.9,-1.3,0),S(-.9,1.3,0),S(-.9,1.3,.35),S(-.9,-1.3,.35));for(const[h,N]of[[-.9,1.3],[.9,1.3],[.9,-1.3],[-.9,-1.3]])s(S(h,N,.35),S(0,0,1.4),.035);return t.set(.25),t.seam=-.6,{rods:v,perches:a}}function Mt(t,e,o,c=.36){const v=t.length/8,a=new y.BufferGeometry,s=[],M=[],l=[];for(let x=0;x<4;x++){const g=x/4*_+Math.PI/4,D=(x+1)/4*_+Math.PI/4,S=(g+D)/2,h=.7071,N=[[Math.cos(g)*h,0,Math.sin(g)*h],[Math.cos(g)*h,1,Math.sin(g)*h],[Math.cos(D)*h,1,Math.sin(D)*h],[Math.cos(D)*h,0,Math.sin(D)*h]];for(const m of[0,1,2,0,2,3])s.push(...N[m]),M.push(Math.cos(S),0,Math.sin(S)),l.push(0,N[m][1],-1)}a.setAttribute("position",new y.Float32BufferAttribute(s,3)),a.setAttribute("normal",new y.Float32BufferAttribute(M,3)),a.setAttribute("aSurf",new y.Float32BufferAttribute(l,3));const f=new Float32Array(v*4),w=new Float32Array(v*4),P=new y.InstancedMesh(a,yt(e,{rod:!0}),v),n=new y.Vector3,u=new y.Vector3,p=new y.Vector3,i=new y.Vector3,r=new y.Matrix4,F=new y.Vector3;for(let x=0;x<v;x++){const g=x*8,D=t[g+6],S=t[g+7];n.set(t[g],t[g+1],t[g+2]),u.set(t[g+3]-n.x,t[g+4]-n.y,t[g+5]-n.z),F.set(0,1,0),Math.abs(u.y)>.95*u.length()&&F.set(n.x,0,n.z).normalize(),p.crossVectors(F,u).normalize(),i.crossVectors(p,u).normalize(),r.makeBasis(p.multiplyScalar(D),u,i.multiplyScalar(S===1?D*.25:D)),r.setPosition(n),P.setMatrixAt(x,r),f[x*4]=c+o.range(-.08,.14),f[x*4+1]=0,f[x*4+2]=S===3?1:S>1.5?2:0,f[x*4+3]=S&&S!==3?1:0,w[x*4+3]=o()}return a.setAttribute("aState",new y.InstancedBufferAttribute(f,4)),a.setAttribute("aFlat",new y.InstancedBufferAttribute(w,4)),P.frustumCulled=!1,P}function qt(t,e,o,c,v){const a=t.length/8,s=[];for(let m=0;m<a;m++)(t[m*8+7]<.06||c()<v*.9)&&s.push(m);const M=[],l=[],f=.62,w=.55,P=(m,d,q)=>[Math.cos(m*_/4+.785)*d,q,Math.sin(m*_/4+.785)*d];for(let m=0;m<4;m++){const d=P(m,1,0),q=P(m+1,1,0),B=P(m+1,f,w),z=P(m,f,w),V=[0,w*1.25,0];for(const j of[d,z,B,d,B,q,z,V,B]){M.push(...j);const L=Math.hypot(j[0],j[1]+.55,j[2])||1;l.push(j[0]/L,(j[1]+.55)/L,j[2]/L)}}const n=new y.BufferGeometry,u=M.length/3;n.setAttribute("position",new y.Float32BufferAttribute(M,3)),n.setAttribute("normal",new y.Float32BufferAttribute(l,3)),n.setAttribute("aFlat",new y.Float32BufferAttribute(new Float32Array(u*4),4));const p=new Float32Array(u*3);for(let m=0;m<u;m++)p[m*3+2]=-1;n.setAttribute("aSurf",new y.Float32BufferAttribute(p,3));const i=s.length,r=new Float32Array(i*4),F=new y.InstancedMesh(n,yt(e,{instanced:!0}),i),x=new y.Matrix4,g=new y.Quaternion,D=new y.Vector3(0,1,0),S=new y.Vector3,h=new y.Vector3,N=new y.Vector3;for(let m=0;m<i;m++){const d=s[m]*8,q=t[d+7];S.set(t[d+3],t[d+4],t[d+5]).normalize(),g.setFromUnitVectors(D,S),h.set(t[d],t[d+1],t[d+2]),N.set(q,q,q),x.compose(h,g,N),F.setMatrixAt(m,x);const B=o.state(t[d+6],c());r[m*4]=B[1]?B[0]*.5:Math.min(B[0],.62)-.08*c(),r[m*4+3]=B[1]}return n.setAttribute("aState",new y.InstancedBufferAttribute(r,4)),F.frustumCulled=!1,F}const Zt=`
  vec3 gwFlock(float t, vec4 fly){
    float al = -0.5 + 0.85*t - fly.y*0.9 + 0.2*sin(t*0.9 + fly.w*6.28);
    float R = mix(20., 31., fly.z) + 3.*sin(t*0.7 + fly.w*17.);
    float y = 96. + 16.*fract(fly.z*7.31 + fly.y*3.7) + 3.*sin(t*1.1 + fly.w*29.);
    return vec3(-R*cos(al), y, R*sin(al));
  }
  vec3 gwBirdPos(float t, vec3 perch, vec3 land, vec4 fly){
    float tl = 4.3 + 1.6*fly.w;
    float k1 = smoothstep(0., 2.4, t), k2 = smoothstep(tl, tl + 2.6, t);
    vec3 rise = perch + vec3(perch.x*0.03, 3.2, perch.z*0.03)*min(t, 3.)*smoothstep(0., 1.2, t);
    vec3 p = mix(rise, gwFlock(t, fly), k1);
    vec3 hover = land + vec3(0., 5.*(1. - k2)*(1. - k2), 0.);
    return mix(p, hover, k2);
  }`;function Jt(t){return new y.ShaderMaterial({uniforms:Object.assign({uRelease:t.uniforms.uRelease},t.uniforms),side:y.DoubleSide,vertexShader:`
      attribute vec4 aPerch, aLand, aFly; attribute vec2 aPart;
      uniform float uRelease, uTime, uPx;
      varying vec3 vP; varying float vNape;
      ${Zt}
      void main(){
        float t = uRelease - aFly.x;
        float tl = 4.3 + 1.6*aFly.w;
        float fly = step(0., t)*smoothstep(0., 0.5, t)*(1. - smoothstep(tl + 2.2, tl + 2.7, t));
        vec3 c = t <= 0. ? aPerch.xyz : gwBirdPos(t, aPerch.xyz, aLand.xyz, aFly);
        vec3 c2 = t <= 0. ? aPerch.xyz : gwBirdPos(t + 0.08, aPerch.xyz, aLand.xyz, aFly);
        float yaw = mix(aPerch.w, aLand.w, step(tl, t)) + 0.5*sin(uTime*0.7 + aFly.w*40.)*step(0.6, fract(uTime*0.13 + aFly.w*3.));
        vec3 fwd = vec3(sin(yaw), 0., cos(yaw));
        vec3 dv = c2 - c; float dl = length(dv);
        if (dl > 1e-3 && fly > 0.01) fwd = normalize(mix(fwd, dv/dl, fly) + vec3(0., 0., 1e-4));
        vec3 rt = vec3(fwd.z, 0., -fwd.x); float rl = length(rt); rt = rl > 1e-4 ? rt/rl : vec3(1., 0., 0.);
        vec3 up = cross(fwd, rt);
        // wings hinge at the spine: beating in flight, folded back along the body on the perch
        vec3 p = position; float side = aPart.x;                 // -1 left wing, 1 right wing, 0 body
        float beat = sin(uTime*(11. + 4.*aFly.w) + aFly.w*60.)*(0.55 + 0.45*sin(uTime*0.8 + aFly.z*20.));
        float ang = mix(-1.25, 0.15 + 0.85*beat, fly)*abs(side);
        float ca = cos(ang), sa = sin(ang);
        float px = abs(p.x); p = vec3(sign(p.x)*px*ca, p.y + px*sa*(1. + 0.35*aPart.y), p.z - px*0.35*(1. - fly)*abs(side));
        p.y += 0.05*sin(uTime*2.3 + aFly.w*30.)*(1. - fly);        // a perched bird bobs
        vec3 wc = (modelMatrix*vec4(c, 1.)).xyz;
        float need = 2.2*uPx*length(wc - cameraPosition)/max(projectionMatrix[1][1], 1e-3);
        // only a bird in flight is enlarged to its pixel minimum; perched birds keep their size and are folded away
        // beyond 300 m, so the far dome is a clean field with ribs, not confetti
        float bd = length(wc - cameraPosition);
        p *= mix(clamp(need/0.7, 1., 1.7)*(1. - smoothstep(210., 300., bd)), clamp(need/0.7, 1., 7.), fly);
        vec3 lp = c + rt*p.x + up*p.y + fwd*p.z;
        vec4 wp = modelMatrix*vec4(lp, 1.);
        vP = wp.xyz; vNape = aPart.y;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:vt+`
      varying vec3 vP; varying float vNape; uniform float uBirdPale;
      void main(){
        vec3 dx = dFdx(vP), dy = dFdy(vP), n = cross(dx, dy); float nl = dot(n, n);
        vec3 N = nl > 1e-16 ? n*inversesqrt(nl) : vec3(0., 1., 0.);
        vec3 dv = cameraPosition - vP; float dist = max(length(dv), 1e-3); vec3 V = dv/dist;
        if (dot(N, V) < 0.) N = -N;
        vec3 rel = gwSky(reflect(-V, N))/max(uPal[6], vec3(1e-3));
        vec3 base = mix(uPal[2]*0.8, mix(uPal[2], uPal[6], 0.55), smoothstep(0.35, 0.9, vNape));
        base = mix(base, mix(uPal[0], uPal[6], 0.28)*(0.92 + 0.3*smoothstep(0.35, 0.9, vNape)), uBirdPale*0.92);
        base = mix(base, uPal[5], step(1.5, vNape));                 // the beak is a snip of gilt
        vec3 col = base*(0.45 + 0.6*rel);
        col = mix(col, mix(uPal[4], uPal[6], 0.3), smoothstep(uFar.x, uFar.y, dist)*0.9);
        gl_FragColor = vec4(gwFinish(col, 0.), 1.);
      }`})}function te(t,e,o,c,v,a){const s=[],M=[],l=(h,N,m,d,q,B,z)=>{s.push(...h,...N,...m),M.push(d,q,d,B,d,z)},f=[0,.1,.42],w=[0,.16,.2],P=[0,.07,-.3],n=[-.11,-.07,.12],u=[.11,-.07,.12],p=[-.1,0,-.62],i=[.1,0,-.62];for(const h of[n,u])l(f,w,h,0,.6,1,.3),l(w,P,h,0,1,0,.3);l(f,[0,.07,.6],[0,.02,.44],0,2,2,2),l(P,p,i,0,0,0,0);for(const h of[-1,1]){const N=[h*.04,.1,.2],m=[h*.04,.08,-.16],d=[h*.42,.1,.24],q=[h*.4,.08,-.2],B=[h*.86,.1,-.06];l(N,d,q,h,0,.2,.2),l(N,q,m,h,0,.2,0),l(d,B,q,h,.2,.9,.2)}const r=new y.BufferGeometry;r.setAttribute("position",new y.Float32BufferAttribute(s,3)),r.setAttribute("aPart",new y.Float32BufferAttribute(M,2));const F=new Float32Array(o*4),x=new Float32Array(o*4),g=new Float32Array(o*4);for(let h=0;h<o;h++){const N=c[h%c.length],m=v[Math.floor(e()*v.length)];F.set([N[0],N[1],N[2],Math.atan2(N[0],N[2])+e.range(-1.2,1.2)],h*4),x.set([m[0]+e.range(-.8,.8),m[1],m[2]+e.range(-.8,.8),Math.atan2(m[0],m[2])+e.range(-1.2,1.2)],h*4),g.set([rt((N[0]+35)/70,0,1)*2.2+e.range(0,.7),e(),e(),e()],h*4),a&&(g[h*4]=Math.min(Math.floor(g[h*4]/2.9*3),2)*1.5+.25*g[h*4+3])}r.setAttribute("aPerch",new y.InstancedBufferAttribute(F,4)),r.setAttribute("aLand",new y.InstancedBufferAttribute(x,4)),r.setAttribute("aFly",new y.InstancedBufferAttribute(g,4));const D=new y.InstancedMesh(r,Jt(t),o);D.frustumCulled=!1;const S=new y.Matrix4;for(let h=0;h<o;h++)D.setMatrixAt(h,S);return D}function ee(t){return new y.ShaderMaterial({uniforms:Object.assign({uBox:{value:new y.Vector3(150,110,150)},uLen:{value:3.2},uNear:{value:3.5}},t.uniforms),transparent:!0,depthWrite:!1,side:y.DoubleSide,vertexShader:`
      attribute vec4 aSeed;
      uniform float uTime, uFront, uPx, uLen, uBulgeA, uNear; uniform vec2 uRainN; uniform vec3 uBox; uniform vec4 uBulge;
      varying vec2 vUv; varying float vA;
      void main(){
        vec3 fall = normalize(vec3(uRainN.x*0.30, -1., uRainN.y*0.30));
        float speed = 34. + 12.*aSeed.w;
        vec3 q = aSeed.xyz*uBox + fall*(uTime*speed);
        vec3 c = mod(q - cameraPosition + 0.5*uBox, uBox) - 0.5*uBox + cameraPosition;
        float bz = (c.z - uBulge.z)/max(uBulge.w, 1.);
        float w = (uFront - dot(uRainN, c.xz))/6.5 + uBulgeA*smoothstep(uBulge.x, uBulge.y, c.x)*exp(-bz*bz);
        vec3 toCam = cameraPosition - c; float dist = max(length(toCam), 1e-3);
        vec3 sd = cross(fall, toCam/dist); float sl = length(sd); sd = sl > 1e-4 ? sd/sl : vec3(1., 0., 0.);
        float pxm = uPx*dist/max(projectionMatrix[1][1], 1e-3);
        float halfW = clamp(0.012, 0.8*pxm, 1.4*pxm);
        vec3 p = c + fall*(position.y*uLen*(0.7 + 0.6*aSeed.w)) + sd*(position.x*halfW);
        vUv = position.xy;
        vA = smoothstep(0., 0.6, w)*smoothstep(0.5*min(uBox.x, uBox.z), 0.3*min(uBox.x, uBox.z), dist)*clamp(0.012/halfW, 0.25, 1.)*smoothstep(0.23*uNear, uNear, dist);
        gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
      }`,fragmentShader:vt+`
      varying vec2 vUv; varying float vA;
      void main(){
        float a = (1. - abs(vUv.x))*smoothstep(0., 0.2, vUv.y)*smoothstep(1., 0.6, vUv.y)*vA;
        if (a < 0.01) discard;
        gl_FragColor = vec4(gwFinish(uPal[6]*1.12, uSlot*0.5), a*0.7);
      }`})}function oe(t,e,o={}){const c=o.count??3e3,v=new y.BufferGeometry;v.setAttribute("position",new y.Float32BufferAttribute([-1,0,0,1,0,0,1,1,0,-1,0,0,1,1,0,-1,1,0],3));const a=new Float32Array(c*4);for(let f=0;f<c*4;f++)a[f]=e();v.setAttribute("aSeed",new y.InstancedBufferAttribute(a,4));const s=ee(t);o.box&&s.uniforms.uBox.value.set(...o.box),o.length&&(s.uniforms.uLen.value=o.length),o.near&&(s.uniforms.uNear.value=o.near);const M=new y.InstancedMesh(v,s,c),l=new y.Matrix4;for(let f=0;f<c;f++)M.setMatrixAt(f,l);return M.frustumCulled=!1,M.renderOrder=5,M}function ae(t){return new y.ShaderMaterial({uniforms:t.uniforms,side:y.BackSide,depthWrite:!1,depthTest:!0,vertexShader:`varying vec3 vD;
      void main(){ vD = position; vec4 p = projectionMatrix*viewMatrix*modelMatrix*vec4(position, 1.);
        if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:vt+`
      varying vec3 vD;
      void main(){
        float l = max(length(vD), 1e-4); vec3 d = vD/l;
        vec3 du = vec3(d.x, max(d.y, 0.012), d.z); du /= max(length(du), 1e-4);
        vec3 col = gwSkyX(du, 1.);
        col = mix(col, mix(uPal[4], uPal[6], 0.35), smoothstep(0.05, 0.0, d.y)*0.9);
        float core = gwSlot(du).x;
        gl_FragColor = vec4(gwFinish(col, core*1.6), 1.);
      }`})}const se=t=>J(J(J(J(1.25,1.15,Z(.27,.31,t)),1.05,Z(.4,.44,t)),.7,Z(.68,.73,t)),.95,Z(.9,.93,t)),Bt=(()=>{const e=new Float32Array(257);for(let o=0;o<256;o++)e[o+1]=e[o]+1/se((o+.5)/256);for(let o=0;o<=256;o++)e[o]*=40/e[256];return e})();function ne(t){const e=rt(t,0,1)*256,o=Math.min(Math.floor(e),255);return J(Bt[o],Bt[o+1],e-o)}async function re(t,e={}){const o=t.rng,c=rt(e.detail??t.quality?.detail??1,.6,1),v=!e.style,a=e.style||Ct({palette:e.palette}),s=!e.style,M=e.sky??s,l=e.rain??s,f=e.paving??s,w=new y.Group;w.name="green-with-the-rain-hero";const P=yt(a),n=Wt(o),u=[],p=new ut(o,9e4),i=e.lastSheet?{g:0,j0:25,j1:35}:null;await Et(p,n,t,i),await t.yield(),await Kt(p,n,t,u),await t.yield();const r=await Yt(p,n,t,o);await t.yield(),await Ut(p,n,t),await t.yield(),await Xt(p,t),await t.yield();const F=new y.Quaternion().setFromUnitVectors(new y.Vector3(0,1,0),new y.Vector3(...tt.a)),x=o.chance(.5),g=o.sign(),D=[[x?"moon":"sun",3.6,.17,.42*g],[x?"sun":"moon",-3.6,-.17,-.3*g]].map(([A,T,G,b])=>{const k=new y.Mesh($t(o,T,G,A),P);return k.position.set(...tt.c),k.quaternion.copy(F),k.frustumCulled=!1,k.userData={w:b,ph:o.range(0,_)},w.add(k),k});let S=null;if(i){const A=new ut(o,2e3),T=R.Rc*R.phiMax,G=[];for(let nt=i.j0;nt<i.j1;nt++){const pt=nt/48*R.phiMax,wt=(nt+1)/48*R.phiMax,Rt=(R.Rc*Math.cos((pt+wt)/2)-R.c)*E,Dt=rt(Math.round(Rt/1.3),2,6);A.seam=-2,A.ageFn=(ht,it,ft,lt)=>[.01+lt*.05,1],A.grid(Dt,1,(ht,it)=>{const ft=U(0,.03+ht*.94,it?wt+.002:pt,it?.02:.07);return ft.push(ht*6,T-(it?wt:pt)*R.Rc),ft});for(const ht of[.035,.965])for(let it=0;it<2;it++){const ft=J(pt,wt,(it+.5)/2),lt=U(0,ht,ft,.08),gt=U(0,ht,ft,1.08);G.push(lt[0],lt[1],lt[2],gt[0]-lt[0],gt[1]-lt[1],gt[2]-lt[2],0,.058)}}A.ageFn=null,A.set(.3,0,0,0),A.seam=-1;const b=i.j1/48*R.phiMax,k=U(0,.5,b,.1),I=U(0,.1,b,.1),C=U(0,.9,b,.1),W=new ut(o,200);W.set(.3,0,0,0),W.seam=-1;const Y=nt=>[nt[0]-k[0],nt[1]-k[1],nt[2]-k[2]];W.tube([Y(I),[0,3.2,0],Y(C)],.06,4),W.tube([[0,3.2,0],[0,15,0]],.13,4);const ot=new y.Mesh(A.geometry(),P);ot.frustumCulled=!1;const $=U(0,.5,(i.j0+i.j1)/96*R.phiMax,0),at=new y.Group;at.position.set($[0],$[1],$[2]),ot.position.set(-$[0],-$[1],-$[2]),at.add(ot);const st=new y.Mesh(W.geometry(),P);st.frustumCulled=!1,st.position.set(k[0]-$[0],k[1]-$[1],k[2]-$[2]),at.add(st);const xt=new y.Group;xt.add(at),w.add(xt);const mt=qt(G,a,n,o,1),Tt=mt.count;mt.count=0,w.add(mt),S={grp:xt,riv:mt,rivN:Tt,pivot:at,rig:st}}const h=await Qt(p,o,c,t);await t.yield();for(const A of r.spoutTips){const T=1+.02*o();h.rods.push(A[0],A[1],A[2],A[0]*T,A[1]-o.range(7,15),A[2]*T,.035,2)}const N=(A,T,G,b,k,I)=>{for(let C=0;C<I;C++){const W=C/I*_,Y=(C+1.04)/I*_,ot=et(T,G,Math.cos(W)*k,b,Math.sin(W)*k),$=et(T,G,Math.cos(Y)*k,b,Math.sin(Y)*k);A.push(ot[0],ot[1],ot[2],$[0],$[1],$[2],.06,3)}},m=Object.assign(()=>(m.s=m.s*16807%2147483647)/2147483647,{s:90217,range:(A,T)=>A+(T-A)*m()}),d=[];N(d,tt.c,tt.e1,tt.e2,10.5,40),N(d,tt.c,tt.e1,tt.e2,7.55,32);for(const A of[-1,1])N(d,et(tt.c,tt.a,A*8.04),tt.e1,tt.e2,6.75,28);w.add(Mt(d,a,m));for(const[A,T,G]of[[0,3.6,.17],[1,-3.6,-.17]]){const b=[];N(b,[0,T,0],[1,0,0],[0,-Math.sin(G),-Math.cos(G)],8.9,36),D[A].add(Mt(b,a,m))}const q=Mt(h.rods,a,o);w.add(q),await t.yield();const B=qt(u,a,n,o,c);w.add(B),await t.yield();const z=[],V=h.perches.slice();for(let A=R.N/2;A<=R.N;A++)for(let T=0;T<40;T++){const G=.04+o()*.98,b=1-.4*(G/R.phiMax),k=A%8===0;z.push(U(A,0,G,.03+(A%16===0?.75:k?.6:.42)*b))}for(let A=0;A<60;A++){const T=Math.PI+o()*Math.PI;z.push([7.7*Math.sin(T),99.25,7.7*Math.cos(T)])}for(let A=0;A<90;A++){const T=o()*Math.PI;V.push([36.4*Math.sin(T),39.1,36.4*Math.cos(T)])}o.shuffle(z);for(const A of h.perches)o.chance(.5)&&z.splice(o.int(0,z.length-1),0,A);const j=te(a,o,Math.round(1e3*c),z,V,e.cast==="pigeons");w.add(j),e.cast==="pigeons"&&(a.uniforms.uBirdPale.value=1),await t.yield(),l&&w.add(oe(a,o,{count:Math.round(2400*c),box:[170,130,170]})),await t.yield();const L=new y.Mesh(p.geometry(),P);L.frustumCulled=!1,w.add(L),await t.yield();let K=null;if(M&&(K=new y.Mesh(new y.SphereGeometry(2600,32,20),ae(a)),K.renderOrder=-1,K.frustumCulled=!1,w.add(K)),f){const A=new ut(o,2e4);A.set(.3,0,0,0),A.seam=3,A.ageFn=(G,b,k,I)=>[.22+.12*I+(G<0,0),0];for(let G=0;G<4;G++)A.grid(44,11,(b,k)=>{const I=(b-.5)*220,C=(.5-(G+k)/4)*220;return[I,0,C,I,C]}),await t.yield();const T=new y.Mesh(A.geometry(),P);w.add(T)}let H=!1;const O=new y.Vector3,Q=new y.Vector3,X={object:w,radius:46,height:144,center:new y.Vector3(0,66,0),ground:!1,groundY:0,style:a,anchors:{portalSeat:{position:new y.Vector3(0,R.armY,0),normal:new y.Vector3(0,-.848,.53),radius:7},axis:new y.Vector3(...tt.a),flyThrough:[[0,10,140],[0,45,70],[0,64,49],[0,81,32],[0,106.4,16],[0,125.2,4.25],[0,132,0]].map(A=>new y.Vector3(...A)),seam:new y.Vector3(0,70,25),lantern:new y.Vector3(0,98,0),viewpoints:{square:new y.Vector3(0,12,135),shoulder:new y.Vector3(-14,52,62),climb:new y.Vector3(0,78,35)},world:{position:new y.Vector3(0,0,590),rotationY:Math.PI,rainN:[-.94,.34],slotDir:[.928,.156,.338],keyDir:[-.55,.62,.56]}},setStoryTime(A){H=!0,a.setStoryTime(A)},setProgress(A){X.setStoryTime(ne(A))},update(A,T,G){if(v&&a.tick(T,t.renderer),!H){const k=23.2+T*.5%14;a.setStoryTime(k),w.getWorldPosition(O),a.uniforms.uRainN.value.set(.94,-.34),a.uniforms.uFront.value=6.5*k-11-200.65+.94*O.x-.34*O.z,a.uniforms.uSlotDir.value.set(-.928,.156,-.338),a.uniforms.uKeyDir.value.set(.55,.62,-.56).normalize()}if(K&&G&&(Q.setFromMatrixPosition(G.matrixWorld),K.position.copy(w.worldToLocal(Q))),S){const k=a.storyTime??0,I=Z(29,32.3,k),C=(1-I)*1.3+(1-I)*.03*Math.sin(T*.9),W=Math.min(1,(1-I)*2.5)*(7.5+.3*Math.sin(T*1.3));S.grp.rotation.y=C,S.grp.position.set(Math.sin(C+E*.5)*W,(1-I)*(5-3*Z(29,31,k))+Math.sin(I*Math.PI)*2.2,Math.cos(C+E*.5)*W),S.pivot.rotation.y=-(1-I)*1.35+(1-I)*.22*Math.sin(T*.6),S.rig.scale.y=Math.max(1-Z(31.6,32.6,k),.01),S.riv.count=Math.round(S.rivN*Z(33,35.6,k))}if(O.set(0,R.armY,0),w.localToWorld(O),a.uniforms.uArm.value.set(O.x,O.y,O.z,12.5),G){Q.setFromMatrixPosition(G.matrixWorld);const k=Math.max(Z(360,290,Q.distanceTo(O)),.001);for(const I of D)I.scale.setScalar(k)}const b=a.uniforms.uGust.value;for(const k of D)k.userData.ph+=A*k.userData.w*(.5+1.6*b),k.quaternion.copy(F).multiply(Gt.setFromAxisAngle(Lt,k.userData.ph))},dispose(){}};return X}export{jt as PALETTE,vt as STYLE_GLSL,ut as SheetBuilder,Vt as TONE_GLSL,Jt as birdMaterial,re as buildHero,oe as makeRain,Ct as makeStyle,yt as metalMaterial,ee as rainMaterial,Mt as rodMesh,ae as skyMaterial,ne as storyTimeAt,le as toSceneColor};
