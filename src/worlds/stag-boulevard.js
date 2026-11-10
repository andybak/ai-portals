import*as v from"three";import{makePath as Ca,makeRng as K0}from"../kit/core.js";import{makeSky as ws,makeLightRig as ys,makeCloudField as xs}from"../kit/sky.js";import*as S0 from"../kit/fauna.js";import*as Y0 from"../kit/fx.js";import*as z0 from"../kit/flora.js";import{buildHero as bs,GB as Sa,makeFallSet as ks,makeWisteria as Ms,makeNearDeer as zs,deerGeometry as Cs,deckShade as Wa,deckUniforms as Ss,DECKS as Ws,deckPoint as io,flyX as Aa}from"../parts/stag-boulevard.js";const e0=Math.PI*2,As=r=>Math.min(1,Math.max(0,r)),X=(r,f,C)=>{const M=As((C-r)/(f-r));return M*M*(3-2*M)},w0=(r,f,C)=>r+(f-r)*C,Pa=(r,f,C)=>{const M=(C-r)/f;return Math.exp(-M*M)},m0={x:130,z:-432,rot:-28*Math.PI/180},ft=8.5,dt=[478,446],lo=(r,f)=>{const C=r-m0.x,M=f-m0.z,P=Math.cos(m0.rot),R=Math.sin(m0.rot);return[C*P-M*R,C*R+M*P]},D=(r,f,C)=>[m0.x+r*Math.cos(m0.rot)+C*Math.sin(m0.rot),f,m0.z-r*Math.sin(m0.rot)+C*Math.cos(m0.rot)],Ps=[[0,3,580],[.5,3,535],[2,3,484],[2,3.2,448],[1.8,5,432],[1.5,9.5,416],[1.5,13.5,400],[1.2,14.8,384],[.8,12.4,366],[.4,7.2,346],[-1.5,3.8,326],[-4,2.3,306],[-6,1.9,284],[-7,1.8,258],[-6.5,1.8,232],[-4.5,2.6,206],[-2.5,5.5,184],[-.5,10,160],[0,14,136],[-3,14.6,112],[-8,12.6,88],[-12.5,10.6,66],[-14.5,9.2,44],[-17,7.6,20],[-20,6.4,-5]],Ts=[[60,11.5,392],[52,12,376],[44,12,358],[36,11.6,338],[29,10.8,318],[23,9.8,300],[17.5,8.6,282],[12.5,7.1,262],[8.5,5.6,244],[5,4.4,226],[2,3.5,208],[0,2.9,190],[-1.6,2.6,172],[-2,2.3,154],[-.6,2.2,136],[1.8,2.3,118],[2.5,2.6,100],[1.3,2.9,82],[0,3,62],[0,3,0]],Ta=Ps.concat(Ts.map(r=>D(r[0],r[1],r[2]))),k0={a:[-22,8.5,-63.9],b:[-7.6,9.4,-63.9],hw:3.6,pier:[-15,-63.9]},G0=r=>k0.a[1]+(k0.b[1]-k0.a[1])*(r-k0.a[0])/(k0.b[0]-k0.a[0]),ut=[k0.b[0]-3,G0(k0.b[0]-3),k0.a[2],Math.atan2(k0.b[0]-k0.a[0],k0.b[2]-k0.a[2])],Se=[];for(let r=0;r<7;r++)Se.push({side:1,z1:700-r*101.4,z0:700-r*101.4-83.4,h:[290,250,340,270,310,255,330][r]});Se.push({side:1,z1:-10,z0:-80,h:228,w:!0}),Se.push({side:-1,z1:700,z0:604,h:24},{side:-1,z1:598,z0:532,h:300},{side:-1,z1:524,z0:458,h:265},{side:-1,z1:327,z0:258,h:325});const F0=`
  #ifndef SOFT_K
    #define SOFT_K 1.0
  #endif
  uniform vec3 uZen, uHor, uSlateCol, uSunDir, uSunCol, uAmbCol, uCloudCol; uniform float uSlate, uTime, uLaneK; uniform vec4 uFol;
  vec3 folTint(vec3 c){ return mix(vec3(dot(c, vec3(0.3, 0.55, 0.15))), c, uFol.w) * uFol.rgb; }      // foliage by moonlight: cooler and greyer
  uniform vec4 uHero; uniform vec4 uDk[5]; uniform vec4 uDk2[5];
  uniform vec4 uRingL; uniform vec3 uRingC;      // the ring as a lamp: its centre (world) and strength, its colour
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y); }
  float sunLane(vec3 w){ float low = 1.0 - smoothstep(30.0, 90.0, w.y), edge = (vn(w.xz * 0.11) - 0.5) * 9.0;
    return (1.0 - 0.2 * smoothstep(0.56, 0.86, vn(w.xz * 0.008 + vec2(uTime * 0.012, uTime * 0.021))) * low)
      * (1.0 - uLaneK * smoothstep(300.0, 322.0, w.z + edge) * (1.0 - smoothstep(368.0, 388.0, w.z + edge)) * (1.0 - smoothstep(24.0, 60.0, w.y))); }
  vec2 stackXZ(vec2 p){ vec2 hl = p - uHero.xy; return vec2(hl.x * uHero.z - hl.y * uHero.w, hl.x * uHero.w + hl.y * uHero.z); }
  float deckDist(vec2 lp, vec4 d){
    float xs = clamp(lp.x + 300.0, 0.0, 600.0), c = d.w;
    float t = xs / ((c + 300.0) + sqrt(max((c + 300.0) * (c + 300.0) - 2.0 * c * xs, 1.0))), k = 1.0 - t;
    float zc = k * k * d.x + 2.0 * t * k * d.y + t * t * d.z;
    float dz = 2.0 * k * (d.y - d.x) + 2.0 * t * (d.z - d.y), dx = 2.0 * k * (c + 300.0) + 2.0 * t * (300.0 - c);
    return abs(lp.y - zc) * dx / sqrt(dx * dx + dz * dz + 1e-4) + max(abs(lp.x) - 300.0, 0.0);
  }
  float deckShadow1(vec3 w, vec4 d, vec4 e){
    float dy = e.x + 1.2 - w.y, soft = (1.0 + max(dy, 0.0) * 0.06) * SOFT_K;
    vec2 lp = stackXZ(w.xz + uSunDir.xz * (dy / max(uSunDir.y, 0.08)));
    return (1.0 - smoothstep(e.y - soft, e.y + soft, deckDist(lp, d))) * smoothstep(0.6, 2.6, dy);
  }
  float deckShade(vec3 w){
    vec2 lp = stackXZ(w.xz);
    if (abs(lp.x) > 560.0 || lp.y < -420.0 || lp.y > 760.0) return 1.0;
    float s = 1.0 - 0.92 * deckShadow1(w, uDk[0], uDk2[0]);
    s *= 1.0 - 0.92 * deckShadow1(w, uDk[1], uDk2[1]); s *= 1.0 - 0.92 * deckShadow1(w, uDk[2], uDk2[2]);
    s *= 1.0 - 0.92 * deckShadow1(w, uDk[3], uDk2[3]); s *= 1.0 - 0.92 * deckShadow1(w, uDk[4], uDk2[4]);
    return s;
  }
  float sunMask(vec3 w){ return sunLane(w) * deckShade(w); }
  // sunlight down in the metro court and the escalator slot: only where the ray toward the sun leaves through the opening
  float pitLit(vec3 w){
    if (w.y > -0.05) return 1.0;
    vec2 h = w.xz + uSunDir.xz * (-w.y / max(uSunDir.y, 0.08));
    float a = smoothstep(-32.4, -31.6, h.x) * (1.0 - smoothstep(17.6, 18.4, h.x)) * smoothstep(47.6, 48.4, h.y) * (1.0 - smoothstep(61.6, 62.4, h.y));
    float b = smoothstep(-2.4, -1.6, h.x) * (1.0 - smoothstep(13.6, 14.4, h.x)) * smoothstep(19.6, 20.4, h.y) * (1.0 - smoothstep(47.6, 48.4, h.y));
    return max(a, b);
  }
  vec3 skyRefl(vec3 r){ float e = clamp(r.y, 0.0, 1.0); vec3 c = mix(uHor, uZen, pow(e, 0.6));
    vec2 cq = r.xz / (e + 0.3);
    float cl = smoothstep(0.35, 0.85, vn(cq * 1.1 + uTime * 0.004) * 0.65 + vn(cq * 2.9 + 7.0) * 0.35) * smoothstep(0.03, 0.3, e);
    c = mix(c, uCloudCol, cl * 0.42);
    float ahead = smoothstep(0.15, -0.45, r.z) * (1.0 - smoothstep(0.3, 0.75, e));
    return mix(c, uSlateCol, ahead * uSlate); }
  // our own stag's shadow, thrown ahead of us on the water: a cut-out standing across the path at the rider (rump, legs, neck, ears and
  // the two antlers, in metres above the water), projected along the sun ray; uRider = (x, z, forward x, forward z), uRiderK = (strength, bob, stride)
  uniform vec4 uRider; uniform vec3 uRiderK;
  float sdSeg(vec2 p, vec2 a, vec2 b){ vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0)); }
  float riderShadow(vec2 p){
    // (thrown as if the sun stood at least 21 degrees up: a truer, longer shadow is a stripe 20 m long that no one reads as a stag)
    vec3 L = normalize(vec3(uSunDir.x, max(uSunDir.y, 0.55), uSunDir.z));
    vec2 d = p - uRider.xy; float lf = dot(L.xz, uRider.zw);
    if (uRiderK.x < 0.01 || dot(d, d) > 900.0 || lf > -0.05) return 0.0;
    float s = -dot(d, uRider.zw) / lf;
    if (s < 0.0) return 0.0;
    vec2 h = d + L.xz * s;
    vec2 q = vec2(abs(dot(h, vec2(-uRider.w, uRider.z))), s * L.y - uRiderK.y) / 1.3;
    float sd = sdSeg(q, vec2(0.0, 0.95), vec2(0.0, 1.4)) - 0.3, nk = sdSeg(q, vec2(0.0, 1.5), vec2(0.0, 2.3)) - 0.14;   // rump and barrel; neck
    float hb = clamp(0.5 + 0.5 * (nk - sd) / 0.4, 0.0, 1.0); sd = mix(nk, sd, hb) - 0.4 * hb * (1.0 - hb);                // the barrel runs into the neck over the withers
    sd = min(sd, sdSeg(q, vec2(0.0, 2.3), vec2(0.0, 2.48)) - 0.17);                               // head
    sd = min(sd, sdSeg(q, vec2(0.2, 0.92), vec2(0.21 + 0.1 * uRiderK.z, -0.3)) - 0.07);          // legs
    sd = min(sd, sdSeg(q, vec2(0.1, 2.4), vec2(0.37, 2.5)) - 0.06);                               // ear
    sd = min(sd, sdSeg(q, vec2(0.08, 2.45), vec2(0.33, 2.95)) - 0.045);                           // beam
    sd = min(sd, sdSeg(q, vec2(0.33, 2.95), vec2(0.27, 3.42)) - 0.05);
    sd = min(sd, sdSeg(q, vec2(0.16, 2.62), vec2(0.46, 2.72)) - 0.04);                            // brow tine
    sd = min(sd, sdSeg(q, vec2(0.32, 3.0), vec2(0.54, 3.24)) - 0.045);                            // trez tine
    float soft = 0.015 + 0.004 * s;
    return (1.0 - smoothstep(-soft, soft, sd)) * uRiderK.x * smoothstep(2.5, 7.0, s);       // nothing of it right under the eye
  }
`,Le=`
  vec3 fogFar(vec3 col, vec3 w, float dist){
    #ifdef FOG_EXP2
      // (the far bank's rank, seen from the reveal and further off, stands in the rain's shadow: a quiet blue-grey rank with its form
      // kept behind the sunlit stack, never pale cut-outs; it comes into its own light as the view nears it)
      vec2 lr = stackXZ(w.xz);
      float rk = uSlate * step(lr.y, -45.0) * step(-270.0, lr.y) * step(abs(lr.x), 330.0) * smoothstep(230.0, 500.0, dist);
      col = mix(col, dot(col, vec3(0.3, 0.5, 0.2)) * (uSlateCol * 1.5 + uHor * 0.22), rk * 0.74);
      float f = 1.0 - exp(-fogDensity * fogDensity * dist * dist), farK = smoothstep(450.0, 800.0, dist);
      f *= 1.0 - 0.42 * step(-45.0, lr.y) * step(lr.y, 430.0) * step(abs(lr.x), 330.0) * step(6.0, w.y) * (1.0 - smoothstep(0.002, 0.004, fogDensity));      // the stack keeps its colour through the haze: the landmark that closes the boulevard
      float k = uSlate * farK * smoothstep(20.0, 150.0, w.y) * (0.55 + 0.45 * smoothstep(700.0, 2400.0, dist));
      vec3 fc = mix(fogColor, uSlateCol * 0.92 + uHor * 0.2, k);            // pale ground haze, slate higher up, the furthest ranks melting into the wall
      float keep = farK * (0.04 + 0.2 * (1.0 - smoothstep(900.0, 2300.0, dist))) * (1.0 - smoothstep(0.002, 0.004, fogDensity));
      #ifdef FAR_DARK
        // the ranks of towers and the hills beyond the river: a quiet blue-grey between the pale haze on the river and the wall of rain
        // (the nearer rank a shade darker), low enough that their tops show under the lowest deck: an upright skyline, never pale
        // cut-outs with a dark city hanging between them
        float dk = uSlate * farK, rank = smoothstep(900.0, 2300.0, dist);
        fc = mix(fc, mix(fogColor, uSlateCol * 0.95, FAR_DARK * mix(0.62, 0.5, rank)), dk * smoothstep(-40.0, 40.0, w.y));
        col *= 1.0 - 0.5 * dk;
      #endif
      return mix(col, fc, min(f, 1.0 - keep));
    #else
      return col;
    #endif
  }`,vt=`
  varying vec3 vW; varying vec3 vN; varying vec3 vC;
  #include <fog_pars_vertex>
  void main(){
    #ifdef USE_COLOR
      vC = color;
    #else
      vC = vec3(1.0);
    #endif
    vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = mat3(modelMatrix) * normal;
    vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Rs=`
  #define SOFT_K (1.0 + 2.2 * smoothstep(8.0, 22.0, cameraPosition.y))
  ${F0}
  uniform vec4 uTw[12]; uniform vec4 uCol[16]; uniform vec4 uCrown[14]; uniform vec4 uRank[8];
  uniform float uRain, uRing, uPads, uWeed, uLaneC; uniform vec2 uFront; uniform vec3 uBed; uniform vec3 uPortal, uPortalN, uPortalCol, uLilac, uPetal;
  varying vec3 vW; varying vec3 vN; varying vec3 vC;
  #include <fog_pars_fragment>
  vec3 hazed(vec3 c, float d){
    #ifdef FOG_EXP2
      return mix(fogColor, c, exp(-fogDensity * fogDensity * d * d));
    #else
      return c;
    #endif
  }
  void deckMirror(inout vec3 refl, inout float dkc, vec2 p, vec3 R, float inv, float dist, vec4 d, vec4 e, vec3 soff, vec3 fringe, float fk, float pond, float torn){
    vec2 h1 = stackXZ(p + R.xz * ((e.x - 4.5) * inv)), h2 = stackXZ(p + R.xz * ((e.x + 4.0) * inv));
    float a1 = deckDist(h1, d) - e.y, a2 = deckDist(h2, d) - e.y;
    float airC = 1.0 - 0.8 * smoothstep(8.0, 20.0, cameraPosition.y), airF = 1.0 - 0.9 * smoothstep(4.5, 11.0, cameraPosition.y);
    float cov = (1.0 - smoothstep(-0.7, 0.7, max(a1, a2))) * airC;      // from the air we look into the water: no pale panes of mirrored soffit
    // the mirrored edge of a deck is soft and torn by the ripple, wider with distance: never a ruled line on the water
    float sw = 1.2 + 0.03 * dist;
    float fr = (1.0 - smoothstep(-sw, sw, a1 * a2 / (abs(a1 - a2) + 0.3))) * (1.0 - cov) * (0.45 + 0.55 * torn);
    float fd = dist + e.x * inv;
    refl = mix(refl, hazed(soff, fd), cov * 0.94); dkc = max(dkc, cov);
    // where the ray passes the deck's edge between the two planes it meets the deck's flank: the girder and parapet above the soffit
    // line (pale concrete), the hanging racemes below it (one-dimensional strands along the parapet, thinning toward their tips)
    float den = a1 - a2, tcr = clamp(a1 / (abs(den) < 1e-3 ? 1e-3 : den), 0.0, 1.0), side = smoothstep(0.5, 0.56, tcr);
    float strand = vn(vec2(h1.x * 1.4, 3.0)), bead = vn(vec2(h1.x * 4.6, 9.0));
    // (a ray that is under the deck at the lower plane and leaves it above the soffit line has met the soffit, not the pale flank:
    // painted as flank it lay on the pond as a pale box between the falls)
    float enter = smoothstep(-0.4, 0.4, a1);
    vec3 flank = vec3(0.4, 0.38, 0.33) * (uAmbCol * 0.9 + uSunCol * 0.45); flank = mix(flank, flank * vec3(0.55, 0.75, 0.55), pond);
    refl = mix(refl, hazed(soff, fd), fr * side * (1.0 - enter) * 0.9 * airC);
    refl = mix(refl, hazed(flank, fd), fr * side * enter * 0.5 * sqrt(fk) * airF);
    refl = mix(refl, hazed(fringe * (0.72 + 0.5 * bead), fd), fr * (1.0 - side) * 0.6 * smoothstep(0.75 - 0.9 * tcr, 1.05 - 0.9 * tcr, strand + 0.25) * fk * airF);
  }
  void main(){
    vec2 p = vW.xz;
    // the metro court and the escalator slot are holes in the sheet
    if (p.x > -32.0 && p.x < 18.0 && p.y > 48.0 && p.y < 62.0) discard;
    if (p.x > -2.0 && p.x < 14.0 && p.y > 20.0 && p.y <= 48.0) discard;
    vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
    vec2 lp = stackXZ(p);
    float pond = 1.0 - smoothstep(0.75, 1.0, length((lp - vec2(0.0, 60.0)) / vec2(78.0, 68.0)));
    // ripples: cat's-paws, hoof chop near the rider, rain rings
    float t = uTime; float calm = 1.0 - 0.65 * pond;
    float deep = max(pond, 1.0 - smoothstep(190.0, 300.0, lp.y));                // all the water under the stack is deep and cool, not only the lily pond
    float n0 = vn(p * 0.33 + t * vec2(0.35, 0.22));
    vec2 g = vec2(n0 - vn(p * 0.33 + vec2(1.7, 0.0) + t * vec2(0.35, 0.22)), n0 - vn(p * 0.33 + vec2(0.0, 1.7) + t * vec2(0.35, 0.22)));
    float paw = smoothstep(0.45, 0.8, vn(p * 0.035 + t * vec2(0.05, 0.12)));
    vec2 g2 = vec2(vn(p * 1.9 - t * vec2(0.9, 0.4)) - 0.5, vn(p * 1.9 + 5.3 + t * vec2(0.3, 1.0)) - 0.5);
    float nearK = 1.0 - smoothstep(10.0, 70.0, dist);
    g *= mix(0.45, 1.0, smoothstep(8.0, 28.0, dist));                // the slow swell is halved under the eye: the towers stand in a mirror there, not in marble
    // rain rings: small, soft and short-lived, a shiver in the reflection and never a drawn circle; none right under the eye
    vec2 cell = floor(p / 1.2), cf = fract(p / 1.2) - 0.5; float ch = h21(cell);
    vec2 rc = cf - (vec2(h21(cell + 3.1), h21(cell + 7.7)) - 0.5) * 0.4;
    float ph = fract(t * 0.8 + ch * 7.0), rr = length(rc);
    // (the shower's front: uFront = its line across the boulevard (world z) and how much of a front there is. Rain has reached the water
    // astern of the line and not ahead of it, and along the line itself the first heavy drops come down in a band of crowded rings.)
    float fz = p.y - uFront.x, fband = uFront.y * exp(-fz * fz * 0.022), rainK = min(1.0, uRain * mix(1.0, smoothstep(-5.0, 9.0, fz), uFront.y) + 0.95 * fband);
    float rd = rr - ph * 0.3, rfade = (1.0 - ph) * (1.0 - ph) * rainK * step(1.0 - rainK * 0.55 - 0.3 * fband, ch) * (1.0 - smoothstep(50.0, 120.0, dist) * (1.0 - 0.6 * fband)) * mix(smoothstep(4.0, 14.0, dist), 1.0, fband);
    float ringW = smoothstep(0.06, 0.0, abs(rd)) * rfade, ringT = smoothstep(0.07, 0.0, abs(rd + 0.08)) * rfade;      // the crest and the trough inside it
    // wind ripples: crests lying across the water and running down it, so that from the saddle they are short level dashes in every
    // reflection (what says water); the fine set fades before it gets finer than a pixel, the broad set carries to the middle distance
    vec2 wq1 = vec2(p.x * 0.5 + 0.7 * n0, p.y * 2.1 + t * 1.2), wq2 = vec2(p.x * 0.19 + 3.0, p.y * 0.72 + t * 0.65);
    float wz = (vn(wq1 + vec2(0.0, 0.5)) - vn(wq1)) * 0.13 * (1.0 - smoothstep(12.0, 46.0, dist)) + (vn(wq2 + vec2(0.0, 0.5)) - vn(wq2)) * 0.1 * (1.0 - smoothstep(45.0, 140.0, dist));
    vec3 N = normalize(vec3(g.x * (0.05 + 0.1 * paw) * calm + g2.x * (0.035 + 0.06 * nearK) * calm + (ringW - ringT) * rc.x * 1.6, 1.0,
                            g.y * (0.05 + 0.1 * paw) * calm + g2.y * (0.035 + 0.06 * nearK) * calm + wz * calm + (ringW - ringT) * rc.y * 1.6));
    vec3 R = reflect(-V, N); R.y = abs(R.y) + 1e-3;
    float ndv = clamp(dot(V, N), 0.0, 1.0), fres = 0.12 + 0.88 * (1.0 - ndv) * (1.0 - ndv) * (1.0 - ndv);
    float inv = 1.0 / max(R.y, 0.02);
    // the sun mask on the water, with the camphor crowns' shadows thrown ahead of each tree; the same loop finds their reflections
    // (round 15: the edge of every shadow on the water wanders with the swell: no ruled line where a lane of sun ends)
    vec2 lwob = (vec2(vn(p * 0.19 + 3.0), vn(p * 0.19 + 9.0)) - 0.5) * 3.4 + (vec2(vn(p * 0.8 + t * 0.1), vn(p * 0.8 + 5.0 - t * 0.1)) - 0.5) * 0.9;
    float lit = mix(0.6, sunMask(vW + vec3(lwob.x, 0.0, lwob.y)), uLaneC), dap = vn(p * 0.8 + t * vec2(0.3, 0.1)) - 0.5, shadow = 0.0, crownR = 0.0;
    vec2 sdir = uSunDir.xz / max(uSunDir.y, 0.08);
    #ifndef LITE
    for (int i = 0; i < 14; i++) {
      vec4 c = uCrown[i]; float cr = max(c.z, 0.1);
      shadow = max(shadow, 1.0 - smoothstep(0.55, 1.1, length(p + sdir * c.w - c.xy) / cr + 0.5 * dap));
      vec3 oc = vec3(c.x - vW.x, c.w, c.y - vW.z); float tc = dot(oc, R);
      crownR = max(crownR, (1.0 - smoothstep(0.7, 1.05, length(oc - R * tc) / cr + 0.35 * dap)) * step(0.0, tc));
    }
    #endif
    lit *= 1.0 - 0.85 * shadow;
    float litB = lit * (1.0 - 0.7 * riderShadow(p));               // the road bed also takes our own stag's shadow
    // mirror: sky and slate wall, then the tower walls x = +-42
    vec3 refl = skyRefl(R);
    // (the walls stand 40 m and more behind the surface, where every ripple is magnified: they are looked up through a calmer surface than the sky is)
    vec3 Rw = reflect(-V, normalize(mix(vec3(0.0, 1.0, 0.0), N, 0.42))); Rw.y = abs(Rw.y) + 1e-3;
    float sgn = Rw.x >= 0.0 ? 1.0 : -1.0, tx = (sgn * 42.0 - vW.x) / (sgn * max(abs(Rw.x), 1e-3));
    float hy = Rw.y * tx, hz = vW.z + Rw.z * tx, hitT = 0.0;
    if (abs(vW.x) < 42.0 && tx > 0.0) {
      float ew = 1.0 + 0.05 * tx; hz += (vn(vec2(p.x * 0.9 + t * 0.4, p.y * 0.25)) - 0.5) * (3.0 + 0.1 * tx) + (vn(p * 2.3 - t * 0.5) - 0.5) * 1.6;      // a mirrored wall's edge wavers with the water
      for (int i = 0; i < 12; i++) { vec4 q = uTw[i]; hitT = max(hitT, step(0.0, q.w * sgn) * smoothstep(q.x - ew, q.x + ew, hz) * (1.0 - smoothstep(q.y - ew, q.y + ew, hz)) * (1.0 - smoothstep(q.z - 2.0 * ew, q.z + 2.0 * ew, hy))); }
    }
    float terr = fract(hy / 55.0), fur = smoothstep(0.3, 0.0, terr) + smoothstep(0.9, 1.0, terr);
    float pane = mix(0.8 + 0.2 * smoothstep(0.12, 0.26, fract(hy / 4.2)), 0.93, smoothstep(40.0, 160.0, tx));      // floor lines only: mirrored mullions are long rays that fan out from the eye
    vec3 wallSun = uSunCol * (sgn > 0.0 ? 0.22 * smoothstep(60.0, 110.0, hy) : 0.02) + uAmbCol * 0.5;
    vec3 wall = mix(vec3(0.045, 0.085, 0.09) * pane + skyRefl(vec3(-sgn, 0.25, 0.3)) * 0.2 * pane, vec3(0.16, 0.3, 0.07) * 1.1, clamp(fur, 0.0, 1.0)) * (wallSun * 1.3 + 0.2);
    refl = mix(refl, hazed(wall, dist + tx), hitT * 0.94);
    #ifndef LITE
    // the rank of towers on the far bank behind the ring (front planes in the stack's frame: x0, x1, front z, height), met by the same calm ray
    if (lp.y > -50.0 && lp.y < 430.0 && abs(lp.x) < 430.0) {
      vec2 dl = vec2(Rw.x * uHero.z - Rw.z * uHero.w, Rw.x * uHero.w + Rw.z * uHero.z);
      float rkT = 0.0, rkD = 0.0, rkH = 0.0, wob = (vn(vec2(p.x * 0.9 + t * 0.4, p.y * 0.25)) - 0.5) * 3.0 + (vn(p * 2.3 - t * 0.5) - 0.5) * 1.4;
      if (dl.y < -0.02) {
        for (int i = 0; i < 8; i++) {
          vec4 q = uRank[i]; float tz = (q.z - lp.y) / dl.y, ew2 = 1.0 + 0.04 * tz, hx = lp.x + dl.x * tz + wob * (1.0 + 0.03 * tz), hy2 = Rw.y * tz;
          float m = smoothstep(q.x - ew2, q.x + ew2, hx) * (1.0 - smoothstep(q.y - ew2, q.y + ew2, hx)) * (1.0 - smoothstep(q.w - 2.0 * ew2, q.w + 2.0 * ew2, hy2));
          if (m > rkT) { rkT = m; rkD = tz; rkH = hy2; }
        }
      }
      float terr2 = fract(rkH / 40.0), fur2 = clamp(smoothstep(0.3, 0.0, terr2) + smoothstep(0.88, 1.0, terr2), 0.0, 1.0);
      vec3 rankC = mix(vec3(0.15, 0.16, 0.155) * (0.8 + 0.2 * smoothstep(0.12, 0.26, fract(rkH / 4.2))), vec3(0.16, 0.3, 0.07) * 1.1, fur2) * (uAmbCol * 0.6 + uSunCol * 0.42);
      refl = mix(refl, hazed(rankC, dist + rkD), rkT * 0.9);
    }
    #endif
    refl = mix(refl, vec3(0.07, 0.15, 0.045) * (uAmbCol + uSunCol * 0.45) * (0.8 + 0.6 * dap), crownR * 0.9);
    // columns standing in the water: piers (radius > 0) and the flanking falls (radius < 0)
    float pierR = 0.0, fallR = 0.0, rxz = dot(R.xz, R.xz) + 1e-5, fjit = vn(vec2(p.y * 0.8 + p.x * 0.3, t * 0.9)) - 0.5;
    #ifndef LITE
    for (int i = 0; i < 16; i++) {
      vec4 c = uCol[i]; vec2 o = c.xy - p; float tt = dot(o, R.xz) / rxz, r = abs(c.w) + 0.02 * tt;
      float lat = length(o - R.xz * tt) + (c.w < 0.0 ? fjit * r * 1.6 : 0.0);                     // a mirrored fall's edges waver and break with the water
      float m = (1.0 - smoothstep(r * (c.w < 0.0 ? 0.25 : 0.6), r * (c.w < 0.0 ? 1.35 : 1.2), lat)) * step(0.0, tt) * (1.0 - smoothstep(c.z * (c.w < 0.0 ? 0.25 : 0.9), c.z, R.y * tt));
      if (c.w < 0.0) fallR = max(fallR, m); else pierR = max(pierR, m);
    }
    #endif
    refl = mix(refl, vec3(0.3, 0.29, 0.25) * (uAmbCol + uSunCol * 0.4), pierR * 0.85);
    // the five decks, highest first so the lower lintels cover the higher ones: dark soffit, lilac fringe at each edge
    float dkc = 0.0;
    if (abs(lp.x) < 520.0 && lp.y > -260.0 && lp.y < 900.0) {
      // (the soffits are lit from below by the water: their mirror image is a soft grey-green, never a navy slab)
      vec3 soff = vec3(0.075, 0.08, 0.095) * (uAmbCol * 1.1 + uSunCol * 0.08) + (uAmbCol * vec3(0.5, 0.62, 0.5) + uSunCol * vec3(0.05, 0.07, 0.055)) * 0.5, fringe = uLilac * (uAmbCol * 0.85 + uSunCol * 0.5);
      // the decks are mirrored through a calmer surface than the sky is: the full ripple tore their long edges into islands
      vec3 Rk = reflect(-V, normalize(mix(vec3(0.0, 1.0, 0.0), N, mix(0.7, 0.22, smoothstep(10.0, 40.0, dist))))); Rk.y = abs(Rk.y) + 1e-3; float invK = 1.0 / max(Rk.y, 0.02);
      float fk = fres * fres, torn = smoothstep(0.25, 0.75, vn(p * 0.7 + vec2(t * 0.25, -t * 0.18)));
      deckMirror(refl, dkc, p, Rk, invK, dist, uDk[4], uDk2[4], soff, fringe, fk, pond, torn); deckMirror(refl, dkc, p, Rk, invK, dist, uDk[3], uDk2[3], soff, fringe, fk, pond, torn);
      deckMirror(refl, dkc, p, Rk, invK, dist, uDk[2], uDk2[2], soff, fringe, fk, pond, torn); deckMirror(refl, dkc, p, Rk, invK, dist, uDk[1], uDk2[1], soff, fringe, fk, pond, torn);
      deckMirror(refl, dkc, p, Rk, invK, dist, uDk[0], uDk2[0], soff, fringe, max(fk, 0.3 * pond), pond, torn);
    }
    refl = mix(refl, (uAmbCol * 0.9 + uSunCol * 0.6) * vec3(1.0, 0.98, 0.95), fallR * (0.3 + 0.3 * vn(vec2(p.x * 1.3, p.y * 0.35 - t * 2.0))) * (0.55 + 0.45 * smoothstep(0.3, 0.7, vn(p * 1.9 + vec2(0.0, t * 1.4)))) * (1.0 - 0.75 * smoothstep(0.3, 0.7, V.y)) * (1.0 - smoothstep(4.5, 10.0, cameraPosition.y)));      // (from the air a mirrored fall is a pale box at its foot)
    // the ring's reflection
    float dn = dot(R, uPortalN); float tp = dot(uPortal - vW, uPortalN) / (abs(dn) < 1e-3 ? 1e-3 : dn);
    vec3 H = vW + R * tp; float dr = length(H - uPortal);
    float ring = (exp(-(dr - RING_R) * (dr - RING_R) * 0.5) + 0.7 * (1.0 - smoothstep(RING_R - 3.0, RING_R, dr))) * step(0.0, tp) * uRing;
    // from the air we look into the water, not at a pale sky lying on it: what the mirror still shows is the slate of the rain wall
    float air = smoothstep(4.5, 12.0, cameraPosition.y);
    refl = mix(refl, refl * vec3(0.8, 0.88, 0.98), air);                    // (round 15: the flood seen from the air still carries the sky: slate-blue and cloud, not black-green)
    refl += uPortalCol * ring;
    // looking down: asphalt, ghost lane paint, moss; the pond is green and deep
    float street = step(abs(p.x), 30.0) * step(-40.0, p.y);
    // ghosts of lane paint: short dashes with square ends (long lines along the road fan out from the eye as pale rays)
    float pdash = fract(p.y / 12.0);
    float paint = street * smoothstep(0.476, 0.486, abs(fract(p.x / 6.0) - 0.5)) * smoothstep(0.0, 0.012, pdash) * (1.0 - smoothstep(0.24, 0.252, pdash)) * 0.1 * (1.0 - smoothstep(20.0, -40.0, p.y)) * (1.0 - smoothstep(22.0, 55.0, dist));
    float mossy = smoothstep(0.45, 0.75, vn(p * 0.09) * 0.6 + vn(p * 0.5) * 0.4);
    vec3 base = mix(vec3(0.05, 0.078, 0.066), vec3(0.075, 0.15, 0.052), mossy * 0.85) + paint * vec3(0.42, 0.42, 0.34);      // weed-green asphalt under clear water, never a mauve floor
    base *= mix(vec3(1.0), vec3(0.6, 0.98, 0.86), max(smoothstep(0.3, 0.75, V.y), smoothstep(0.1, 0.45, V.y) * air));                    // from the air the flood is green and deep, not lit sand
    base *= mix(vec3(1.0), vec3(0.6, 0.9, 0.82), air);
    // the pond bed: green depth mottled with weed and pale silt, not one flat tone
    float weed = vn(p * 0.55 + 11.0) * 0.6 + vn(p * 1.9 + 3.0) * 0.4;
    base = mix(base, mix(vec3(0.03, 0.085, 0.05), vec3(0.075, 0.15, 0.07), smoothstep(0.3, 0.75, weed)) * mix(vec3(1.0), vec3(0.66, 0.9, 1.08), deep), max(pond, 1.0 - street) * 0.8);      // (0.9 m of water over the pond's bed: deeper and cooler than the flood on the road)
    // sunlight through 0.25 m of moving water: a net of bright caustic lines sliding over the road bed, gone in every shadow
    vec2 cw = p + g * 1.6;
    float c1 = 1.0 - abs(2.0 * vn(cw * 2.6 + t * vec2(0.3, 0.2)) - 1.0), c2 = 1.0 - abs(2.0 * vn(cw * 4.3 + 3.7 - t * vec2(0.25, 0.35)) - 1.0);
    float caus = mix(c1 * c1 * c1 * c1 + 0.6 * c2 * c2 * c2 * c2 * c2, 0.36, max(smoothstep(12.0, 40.0, dist), air));
    vec3 light = uAmbCol * vec3(1.35, 1.6, 1.45) + uSunCol * litB * (0.85 + 0.6 * caus * uBed.x) * (1.0 - 0.64 * deep) * (1.0 - 0.45 * air);
    // in shade no light reaches the bed, so the mirror carries the picture there: cool sky and clouds, not black asphalt
    // (under a deck within a few metres of the eye we look down through the water: bed, pads and petals take over from the soffit's mirror image)
    float steep = smoothstep(0.3, 0.75, V.y);                                // from high above we look into the water: the green bed, pads and weed, not a grey sky
    float mirK = mix(mix(max(fres, 0.44 - 0.26 * steep), max(fres, 0.2 - 0.06 * steep), lit), max(fres, 0.16), dkc * (1.0 - smoothstep(6.0, 18.0, dist)));
    mirK *= 1.0 - 0.28 * air * (1.0 - fres);
    vec3 col = mix(base * light, refl * mix(vec3(0.8, 0.85, 0.96), vec3(1.0), lit), mirK);
    col *= mix(vec3(1.0), vec3(0.7, 0.98, 1.12), air);                     // (a warm sky must not turn the flood khaki from above)
    // (no foam threads drawn out along the way we run: from the saddle they fanned out as long rays and the water read as a stretched picture)
    // fallen petals: rafts of fine pale dots turning on the water, never a solid patch
    vec2 drift = t * vec2(0.03, -0.07);
    float raft = smoothstep(0.42, 0.95, vn(p * 0.4 + drift) * 0.55 + vn(p * 1.7 + drift) * 0.45) * (0.3 + 0.7 * smoothstep(250.0, 60.0, length(lp - vec2(0.0, 150.0)) - 200.0));
    vec2 pq = (p + drift * 6.0) / 0.22, pid = floor(pq), pf = fract(pq) - 0.5;
    raft *= raft;
    float dot1 = step(1.0 - raft * 0.36, h21(pid)) * smoothstep(0.3, 0.16, length((pf - (vec2(h21(pid + 1.3), h21(pid + 2.7)) - 0.5) * 0.4) * vec2(1.0, 1.5)));
    float nearP = 1.0 - smoothstep(18.0, 60.0, dist);
    col = mix(col, uPetal * (uAmbCol + uSunCol * litB * 0.6) * 0.62, (dot1 * 0.46 * nearP + raft * mix(0.07, 0.03, pond) * (1.0 - nearP)) * (1.0 - 0.6 * pond * (1.0 - nearP)));
    // seen from the air: the fallen petals lie on the dark water in long pale drifts that the current draws out, thickest under the decks
    float swirl = smoothstep(0.66, 0.84, vn(p * vec2(0.06, 0.1) + drift * 0.6 + 3.0) * 0.55 + vn(p * vec2(0.33, 0.21) + drift) * 0.45) * (0.35 + 0.65 * smoothstep(250.0, 60.0, length(lp - vec2(0.0, 150.0)) - 200.0));
    col = mix(col, uPetal * (uAmbCol + uSunCol * litB * 0.6) * 0.6, swirl * smoothstep(0.45, 0.7, vn(p * vec2(2.3, 1.1) + drift * 3.0)) * 0.3 * air);
    // duckweed: rafts of fine green fronds lying against both kerbs (the middle of the flood stays a mirror), drifting slowly down the
    // flood toward the pit; matt (no mirror in them), a crowd of dots close by and a broken film of green from further off and from the air
    vec2 wdr = p + vec2(0.0, t * 0.11);
    float wkerb = smoothstep(16.0, 24.5, abs(p.x)) * street * step(p.y, 640.0) * (1.0 - pond);
    float wraft = smoothstep(0.5, 0.6, vn(wdr * vec2(0.11, 0.05)) * 0.55 + vn(wdr * 0.23 + 7.0) * 0.45 + 0.12 * smoothstep(25.0, 30.0, abs(p.x))) * wkerb * uWeed;
    vec2 wq = wdr / 0.085, wi = floor(wq); float wfar = smoothstep(3.0, 11.0, dist);
    float wdot = step(0.3, h21(wi)) * (1.0 - smoothstep(0.3, 0.46, length(fract(wq) - 0.5 - (vec2(h21(wi + 1.9), h21(wi + 3.3)) - 0.5) * 0.3)));
    float wtex = mix(wdot, 0.35 + 0.65 * smoothstep(0.3, 0.62, vn(wdr * 1.9 + 3.0) * 0.6 + vn(wdr * 5.3) * 0.4), wfar);      // (holes of open water in every raft)
    col = mix(col, mix(vec3(0.075, 0.17, 0.035), vec3(0.14, 0.26, 0.055), vn(wdr * 0.7 + 11.0)) * (uAmbCol * 1.15 + uSunCol * litB * 0.42), wraft * wtex * 0.8);
    // lily pads in the pond, thinning outward: veined, dark-rimmed, with a sheen of sky; white petalled flowers
    vec2 lc = floor(lp / 1.7), lf = fract(lp / 1.7) - 0.5; float lh = h21(lc + 11.0);
    float rad = 0.36 * (0.5 + 0.9 * h21(lc + 0.7));
    vec2 off = (vec2(h21(lc + 2.3), h21(lc + 5.9)) - 0.5) * (0.96 - 2.0 * rad); vec2 ld = lf - off + vec2(sin(t * 0.7 + lh * 20.0), cos(t * 0.6 + lh * 9.0)) * 0.012;
    float lpatch = smoothstep(0.3, 0.52, vn(lp * 0.045 + 3.0));
    lpatch = max(lpatch, 0.62 * (1.0 - smoothstep(9.0, 24.0, abs(lp.x))) * smoothstep(-4.0, 10.0, lp.y) * (1.0 - smoothstep(120.0, 160.0, lp.y)) * smoothstep(0.25, 0.5, vn(lp * 0.21 + 7.0) + 0.25));
    // and a broad raft of them in the open water between the top deck and the third, where the view looks straight down from over the top
    float band2 = (1.0 - smoothstep(30.0, 62.0, abs(lp.x - 4.0))) * smoothstep(150.0, 168.0, lp.y) * (1.0 - smoothstep(205.0, 228.0, lp.y)) * smoothstep(0.3, 0.55, vn(lp * 0.13 + 5.0) * 0.6 + vn(lp * 0.37) * 0.4 + 0.12);
    float want = step(1.0 - max((0.66 * pond + 0.12) * lpatch, 0.6 * band2) * uPads * step(length(lp - vec2(0.0, 80.0)), 190.0), lh);
    float dl = length(ld), la = atan(ld.y, ld.x + 1e-5) + lh * 40.0, rn = dl / rad;
    float notch = smoothstep(0.9, 0.96, cos(la)) * step(0.12, rn);
    float pad = want * smoothstep(1.0, 0.9, rn) * (1.0 - notch) * (1.0 - smoothstep(120.0, 200.0, dist) * 0.6);
    float vein = smoothstep(0.82, 1.0, abs(cos(la * 5.5))) * smoothstep(0.1, 0.5, rn) * (1.0 - smoothstep(30.0, 70.0, dist));
    vec3 padCol = mix(vec3(0.07, 0.19, 0.05), vec3(0.15, 0.31, 0.08), h21(lc + 4.4)) * (1.0 - 0.3 * vein) * (1.0 - 0.45 * smoothstep(0.72, 1.0, rn));
    padCol = padCol * (uAmbCol + uSunCol * litB * 0.8) + skyRefl(R) * fres * 0.55 * mix(vec3(0.6, 0.67, 0.8), vec3(1.0), lit);
    col = mix(col, padCol, pad);
    vec2 fd2 = ld - vec2(0.3, 0.12) * rad; float fa = atan(fd2.y, fd2.x + 1e-5), fl = length(fd2);
    float flower = want * step(0.8, h21(lc + 9.1)) * smoothstep(0.03, 0.0, fl - 0.13 * (0.72 + 0.28 * cos(fa * 9.0)));
    col = mix(col, mix(vec3(1.0, 0.82, 0.3), vec3(1.0, 0.97, 0.92), smoothstep(0.02, 0.05, fl)) * (uAmbCol + uSunCol * litB) * 0.62, flower);
    // sun glints on ripple crests, rain rings catching the sky
    // sun glitter: small points that wink on ripple crests, never strokes
    vec2 sq = p * 3.1 + g2 * 2.5, si = floor(sq); float sh = h21(si), tw = max(0.0, sin(t * (3.0 + 5.0 * sh) + sh * 40.0));
    vec2 rdv = p - cameraPosition.xz, mdir = -uSunDir.xz / max(length(uSunDir.xz), 1e-3);
    float road = uBed.z * (1.0 - smoothstep(0.03, 0.11, abs(dot(rdv, vec2(mdir.y, -mdir.x))) / max(length(rdv), 1.0))) * step(0.0, dot(rdv, mdir));   // the moon road: a lane of glitter running out ahead of us
    float spark = step(0.74 - 0.42 * road, sh) * smoothstep(0.24, 0.04, length(fract(sq) - 0.5 - (vec2(h21(si + 1.7), h21(si + 4.1)) - 0.5) * 0.5)) * tw * tw * tw;
    col += uSunCol * litB * spark * 1.3 * (uBed.y + 1.6 * road) * (1.0 - pad) * (1.0 - smoothstep(35.0 + 110.0 * road, 80.0 + 160.0 * road, dist));
    // (round 15) THE RING'S LIGHT ON THE WATER: a broken lane of glitter from its foot toward the eye, as wide as the ring looks from
    // wherever we are, wandering with the swell and dying away with distance
    vec2 rgp = p - uPortal.xz, rgc = cameraPosition.xz - uPortal.xz; float rgL = max(length(rgc), 1.0); vec2 rgd = rgc / rgL;
    float ral = dot(rgp, rgd), rac = abs(dot(rgp, vec2(rgd.y, -rgd.x)) + (vn(p * 0.3 + t * 0.15) - 0.5) * 2.4);
    float rgw = (2.6 + 8.0 * clamp(1.0 - ral / rgL, 0.0, 1.0)) * (0.7 + 0.6 * vn(vec2(ral * 0.08, 3.0)));
    float rlane = (1.0 - smoothstep(0.3 * rgw, rgw, rac)) * smoothstep(1.0, 7.0, ral) * exp(-ral / (36.0 + 0.45 * rgL)) * step(0.0, dot(rgc, uPortalN.xz));
    float rglit = 0.18 + 0.82 * smoothstep(0.42, 0.78, vn(p * vec2(1.3, 2.9) + g2 * 2.0 + t * vec2(0.2, -0.6)) * 0.6 + vn(p * 0.37 - t * 0.1) * 0.4);
    col += uPortalCol * rlane * rglit * 0.55 * mix(0.3, 1.0, air) * uRing * (1.0 - pad);      // (from the saddle the ring's own mirror image carries it: the lane is for the air)
    col = col * (1.0 - 0.3 * ringT) + (uHor * 0.5 + uSunCol * lit * 0.5) * ringW * (0.2 + 0.5 * fband);
    // the front's own line on the water: a ruffled, broken band of pale chop where the first drops strike, the surface matt behind it
    float ruff = fband * smoothstep(0.3, 0.75, vn(p * vec2(0.45, 1.5) + vec2(t * 0.7, -t * 2.0)) * 0.6 + vn(p * vec2(1.7, 3.1) + t) * 0.4);
    col = mix(col, uHor * 0.62 + uSunCol * 0.3 * lit, ruff * 0.42 * (1.0 - pad) * (1.0 - smoothstep(140.0, 320.0, dist)));
    col += uSunCol * vec3(1.0, 0.95, 0.86) * 0.06 * lit * smoothstep(25.0, 110.0, dist) * uBed.y;      // far off a lit lane is a bright band on the water, a shaded one stays cool
    gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
    #include <fog_fragment>
  }`,qs=`
  ${F0}
  uniform vec3 uPetal;
  varying vec3 vW; varying vec3 vN; varying vec3 vC;
  #include <fog_pars_fragment>
  ${Le}
  float kerbOf(vec2 sl, float y, vec4 d, vec4 e){ return step(abs(y - e.x - 2.4), 0.6) * smoothstep(e.y - 3.0, e.y - 0.8, deckDist(sl, d)); }
  void main(){
    vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) n = -n;
    vec2 sl = stackXZ(vW.xz); float fwj = min(fwidth(sl.x), 4.0);        // along the decks, for the soffit joints (derivative taken before any branch)
    float cdist = length(cameraPosition - vW), nearD = 1.0 - smoothstep(7.0, 30.0, cdist);
    float lit = sunMask(vW) * pitLit(vW), ndl = max(dot(n, uSunDir), 0.0);
    float up = smoothstep(0.35, 0.8, n.y), side = 1.0 - abs(n.y);
    float h = abs(n.x) > abs(n.z) ? vW.z : vW.x;
    vec2 hq = abs(n.y) > 0.7 ? vW.xz : vec2(h, vW.y);                       // level faces take their stains in plan: no stripes drawn out along one axis
    float big = vn(hq * 0.13 + 7.0), fine = vn(hq * 2.3), streak = vn(vec2(h * 1.7, vW.y * 0.09));
    float dark = step(vC.r + vC.g + vC.b, 0.12);                           // window sockets and other holes keep their darkness
    vec3 alb = vC * (0.8 + 0.3 * big + 0.14 * fine);
    alb = mix(alb, alb * vec3(0.5, 0.48, 0.46), side * smoothstep(0.55, 0.85, streak) * 0.7);
    // from a few metres: pitting and grit, hairline runs of damp, patches of lichen, so that no hull, pier or panel is a flat slab near the eye
    float pit = vn(hq * 9.0 + 5.0), grit = vn(hq * 27.0 + 2.0);
    alb *= 1.0 + nearD * ((pit - 0.5) * 0.55 + (grit - 0.5) * 0.3) * (1.0 - dark);
    alb = mix(alb, alb * vec3(0.56, 0.54, 0.5), side * smoothstep(0.58, 0.85, vn(vec2(h * 5.3 + 2.0, vW.y * 0.3))) * 0.55 * nearD);
    alb = mix(alb, mix(vec3(0.36, 0.38, 0.24), vec3(0.17, 0.27, 0.09), grit), smoothstep(0.6, 0.78, vn(hq * 2.9 + 17.0) * 0.6 + pit * 0.4) * 0.5 * nearD * (1.0 - dark) * step(-0.3, n.y));
    float lipMoss = (1.0 - smoothstep(-0.6, 2.6, -vW.y - 2.3 * (vn(vec2(h * 0.75, 1.3)) - 0.45) - 1.1 * (vn(vec2(h * 2.3 + 7.0, 2.9)) - 0.5) - 0.8 * (fine - 0.5))) * step(vW.y, 0.0);      // down in the pits: tongues of moss hanging from the rim
    float mossK = max(up * smoothstep(0.3, 0.7, vn(vW.xz * 0.35) * 0.6 + fine * 0.4 + 0.12), side * max(smoothstep(6.0, 0.3, vW.y + 5.0 * big) * step(-0.6, vW.y), lipMoss)) * (1.0 - dark);
    alb = mix(alb, folTint(mix(vec3(0.12, 0.25, 0.06), vec3(0.2, 0.3, 0.08), vn(hq * 1.1 + 3.0))) * (0.65 + 0.7 * fine) * (1.0 - 0.3 * lipMoss * smoothstep(-0.6, 0.0, vW.y)), mossK * 0.8);
    // the carriageways up on the decks are meadows now: drifts of small flowers in the moss, seen when the view climbs over them
    float parkK = step(vW.x, -41.5) * step(0.45, vW.y) * step(vW.y, 0.95) * step(vW.z, 261.0);      // the park's lawn is a meadow like the decks' carriageways
    float topK = up * max(smoothstep(11.0, 14.0, vW.y) * (1.0 - smoothstep(200.0, 240.0, vW.y)), parkK) * (1.0 - dark);
    if (topK > 0.01) {
      float drift = smoothstep(0.42, 0.7, vn(vW.xz * 0.11 + 5.0) * 0.6 + vn(vW.xz * 0.4) * 0.4);
      alb = mix(alb, folTint(mix(vec3(0.13, 0.27, 0.07), vec3(0.24, 0.36, 0.1), vn(vW.xz * 0.9 + 2.0))) * (0.7 + 0.6 * fine), topK * (0.35 + 0.4 * drift));
      if (parkK > 0.5) {      // (round 15) the park is rough meadow, not a lawn: tussocks light and dark, drifts of buttercup, vetch and cow parsley that read from the air
        float tus = vn(vW.xz * 0.55 + 3.0), tus2 = vn(vW.xz * 1.9 + 11.0);
        alb *= 0.58 + 0.9 * smoothstep(0.25, 0.75, tus * 0.6 + tus2 * 0.4);
        alb = mix(alb, vec3(0.86, 0.72, 0.2), smoothstep(0.6, 0.8, vn(vW.xz * 0.16 + 21.0)) * (0.3 + 0.45 * tus2));
        alb = mix(alb, vec3(0.62, 0.45, 0.85), smoothstep(0.62, 0.82, vn(vW.xz * 0.21 + 47.0)) * (0.3 + 0.45 * tus2));
        alb = mix(alb, vec3(0.88, 0.86, 0.8), smoothstep(0.68, 0.85, vn(vW.xz * 0.27 + 77.0)) * 0.45 * tus);
      }
      vec2 fq = vW.xz * 3.2, fi = floor(fq); float fh = h21(fi), fl = length(fract(fq) - 0.5 - (vec2(h21(fi + 1.7), h21(fi + 4.1)) - 0.5) * 0.6);
      vec3 fcol = fh > 0.94 ? vec3(0.95, 0.78, 0.25) : fh > 0.86 ? vec3(0.95, 0.93, 0.85) : vec3(0.7, 0.5, 0.9);
      float fk = step(1.0 - 0.3 * drift, fh) * smoothstep(0.2, 0.08, fl) * (1.0 - smoothstep(30.0, 70.0, cdist));
      alb = mix(alb, fcol, topK * (fk * 0.85 + drift * 0.12 * smoothstep(20.0, 70.0, cdist)));      // far off the drifts are a lilac bloom on the green
      // looked down on from a few metres: blades and their shadows, heads of cow parsley and buttercup, and the wisteria's fallen
      // petals lying in pale drifts along both kerbs
      float bl = vn(vW.xz * vec2(7.0, 19.0)) * 0.5 + vn(vW.xz * vec2(23.0, 9.0) + 4.0) * 0.5;
      alb *= 1.0 + (bl - 0.5) * 1.1 * topK * (1.0 - smoothstep(10.0, 42.0, cdist));
      vec2 uq = vW.xz * 1.7, ui = floor(uq); float uh = h21(ui + 31.0), ul = length(fract(uq) - 0.5 - (vec2(h21(ui + 5.7), h21(ui + 8.3)) - 0.5) * 0.5);
      float umb = step(1.0 - 0.5 * drift, uh) * smoothstep(0.2, 0.1, ul) * smoothstep(0.3, 0.55, vn(vW.xz * 13.0)) * (1.0 - smoothstep(70.0, 150.0, cdist));
      alb = mix(alb, uh > 0.9 ? vec3(0.9, 0.74, 0.22) : vec3(0.9, 0.88, 0.8), topK * umb * 0.75);
      float kerb = max(max(kerbOf(sl, vW.y, uDk[0], uDk2[0]), kerbOf(sl, vW.y, uDk[1], uDk2[1])), max(max(kerbOf(sl, vW.y, uDk[2], uDk2[2]), kerbOf(sl, vW.y, uDk[3], uDk2[3])), kerbOf(sl, vW.y, uDk[4], uDk2[4])));
      float pk = kerb * smoothstep(0.4, 0.66, vn(vW.xz * 0.45 + 9.0) * 0.55 + vn(vW.xz * 3.1 + 2.0) * 0.45 + 0.2 * kerb);
      alb = mix(alb, mix(uPetal, vec3(0.9, 0.88, 0.86), 0.45) * 0.7 * (0.6 + 0.6 * vn(vW.xz * 5.0 + 1.0)), topK * pk * 0.6);
    }
    alb *= mix(1.0, 0.55, (1.0 - smoothstep(0.0, 0.7, abs(vW.y - 0.05))) * side);            // wet at the water line
    alb *= mix(1.0, 0.75, smoothstep(-0.5, -5.0, vW.y));                                       // wet, darker walls down in the court
    vec3 hemi = mix(vec3(0.3, 0.38, 0.26) * dot(uAmbCol, vec3(0.4)), uAmbCol, n.y * 0.5 + 0.5);
    float under = smoothstep(-0.3, -0.8, n.y);
    // soffits: a cast joint every 8 m, dark drip stains and pale lime bleeding from the joints, and light off the water below them
    float jl = abs(fract(sl.x / 8.0 + 0.5) - 0.5) * 8.0, joint = (1.0 - smoothstep(0.07 + fwj, 0.16 + 2.0 * fwj, jl)) * (1.0 - smoothstep(1.0, 3.0, fwj));
    float drip = smoothstep(0.5, 0.8, vn(vec2(sl.x * 0.9, sl.y * 0.14 + 3.0)) * 0.7 + 0.3 * fine), lime = (1.0 - smoothstep(0.2, 1.6, jl)) * smoothstep(0.4, 0.8, vn(vec2(sl.x * 0.3, sl.y * 0.8)));
    alb = mix(alb, alb * 0.5 * (1.0 - 0.3 * joint) + vec3(0.2, 0.2, 0.18) * lime, under * max(max(drip * 0.7, joint * 0.8), lime * 0.55));      // (a joint is a shade darker, never a black dash)
    // (round 15) and no soffit is one tone: the marks of the boards it was cast on, broad patches of damp, rust bleeding along the
    // girders, algae where the wet stands; the water's light plays on it as a moving net
    float board = (1.0 - smoothstep(0.03, 0.09, abs(fract(sl.y / 1.3) - 0.5))) * (1.0 - smoothstep(25.0, 70.0, cdist));
    float sbig = vn(sl * 0.07 + 13.0), srust = smoothstep(0.52, 0.78, vn(sl * vec2(0.5, 0.11) + 5.0) * 0.6 + sbig * 0.4), salg = smoothstep(0.5, 0.78, vn(sl * 0.23 + 21.0) * 0.6 + fine * 0.4);
    vec3 sa = alb * (0.6 + 0.75 * sbig) * (1.0 - 0.25 * board);
    sa = mix(sa, vec3(0.36, 0.21, 0.12) * (0.7 + 0.6 * fine), srust * 0.5);
    sa = mix(sa, folTint(vec3(0.12, 0.2, 0.07)) * (0.7 + 0.6 * fine), salg * 0.5);
    alb = mix(alb, sa, under * (1.0 - dark));
    float caus = 0.5 + 1.1 * vn(vW.xz * 0.3 + uTime * vec2(0.3, 0.2)) * vn(vW.xz * 0.7 - uTime * vec2(0.25, 0.35));
    float net = 1.0 - abs(2.0 * vn(vW.xz * 0.42 + uTime * vec2(0.21, 0.16)) - 1.0); net = net * net * net;
    vec3 bounce = uSunCol * vec3(0.6, 0.8, 0.62) * 0.2 * under * caus * (under > 0.01 ? sunMask(vec3(vW.x, 0.0, vW.z)) : 0.0);
    bounce += (uAmbCol * vec3(0.5, 0.62, 0.5) + uSunCol * vec3(0.05, 0.07, 0.055)) * under * (0.6 + 0.6 * caus + 0.8 * net);       // a floor that needs no sun on the water below
    // the ring is a lamp: warm light on every soffit, pier and flank that faces it, falling off with distance
    vec3 rv = uRingL.xyz - vW; float rd2 = dot(rv, rv);
    bounce += uRingC * uRingL.w * (0.6 * under + 0.6 * max(dot(n, rv) / sqrt(rd2 + 1e-3), 0.0)) / (1.0 + rd2 / 700.0);
    bounce *= 1.0 + 1.6 * under * (1.0 - smoothstep(16.0, 46.0, cdist)) * smoothstep(9.0, 17.0, cameraPosition.y);          // a soffit the view passes close under, from above the water: its light off the pond is plain to see
    // light thrown back by the sunlit water on whatever stands in it (hulls, kerbs, pier feet): a flank turned from the sun is never a black block
    bounce += uSunCol * vec3(0.75, 0.85, 0.7) * 0.17 * side * (1.0 - under) * smoothstep(-0.3, 0.2, vW.y) * (1.0 - smoothstep(1.0, 9.0, vW.y)) * (0.35 + 0.65 * lit);
    bounce += (uAmbCol * vec3(0.5, 0.66, 0.55) * 0.9 + uSunCol * vec3(0.1, 0.15, 0.12)) * smoothstep(-0.5, -4.0, vW.y) * (0.7 + 0.6 * caus);      // down in the court: light off the pool, the white water and the mist, and from the opening (no wall of it is a black slab)
    vec3 col = max(alb, vec3(0.0)) * (hemi * 0.95 + uSunCol * ndl * lit + bounce);
    gl_FragColor = vec4(max(fogFar(col, vW, cdist), vec3(0.0)), 1.0);
  }`,Fs=`
  ${F0}
  varying vec3 vW; varying vec3 vN; varying vec3 vC;
  #include <fog_pars_fragment>
  void main(){
    vec2 p = vW.xz; vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0)); float t = uTime;
    vec2 g = vec2(vn(p * 1.3 + t * vec2(0.5, 0.3)) - vn(p * 1.3 + vec2(0.6, 0.0) + t * vec2(0.5, 0.3)), vn(p * 1.3 + t * vec2(0.5, 0.3)) - vn(p * 1.3 + vec2(0.0, 0.6) + t * vec2(0.5, 0.3)));
    vec3 N = normalize(vec3(g.x * 0.5, 1.0, g.y * 0.5)); vec3 R = reflect(-V, N); R.y = abs(R.y) + 1e-3;
    float fres = 0.08 + 0.92 * pow(1.0 - clamp(dot(V, N), 0.0, 1.0), 3.0), lit = pitLit(vW + vec3(0.0, 0.2, 0.0)) * sunLane(vec3(vW.x, 0.0, vW.z));
    float foam = smoothstep(0.55, 0.9, vn(p * 0.9 - t * vec2(0.2, 0.5)) * 0.6 + vn(p * 3.1 + t * 0.4) * 0.4) * smoothstep(8.0, 1.0, min(min(p.x + 32.0, 18.0 - p.x), min(p.y - 20.0, 62.0 - p.y)));
    vec3 col = mix(vec3(0.05, 0.22, 0.1) * (uAmbCol * 1.3 + uSunCol * lit), skyRefl(R) * 0.9, fres);
    col += vec3(0.25, 0.5, 0.22) * uSunCol * lit * 0.35 * vn(p * 2.2 + g * 6.0 + t * 0.5);
    col = mix(col, (uAmbCol * 1.2 + uSunCol * lit) * 0.8, foam * 0.7);
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }`,Ks=`
  #define FAR_DARK 1.0
  ${F0}
  uniform float uRimK, uGrid;
  varying vec3 vW; varying vec3 vN; varying vec3 vC;
  #include <fog_pars_fragment>
  ${Le}
  float lineCov(float x, float c, float hw, float fw){ float d = abs(fract(x - c + 0.5) - 0.5); return mix(1.0 - smoothstep(hw - fw, hw + fw, d), 2.0 * hw, smoothstep(0.35, 0.9, fw)); }
  void main(){
    // (the builder winds its boxes inward and this material draws both sides: what is seen of a tower is the outside of its walls, never
    // the far wall from within with the underside of its roof for a black ceiling)
    vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) n = -n;
    vec3 toCam = cameraPosition - vW + vec3(0.0, 1e-4, 0.0); float dist = length(toCam); vec3 V = toCam / dist;
    float lane = sunLane(vW), ndl = max(dot(n, uSunDir), 0.0);
    vec3 light = uAmbCol * (0.75 + 0.25 * n.y) + uSunCol * ndl * lane;
    vec3 col;
    float h = abs(n.x) > 0.5 ? vW.z : vW.x; vec2 gq = vec2(h / 3.6, vW.y / 4.2);
    vec2 fw = min(fwidth(gq), vec2(4.0)) * 0.75 + 1e-4;                  // derivatives are taken before any branch
    if (n.y > 0.5) {
      col = mix(vec3(0.1, 0.2, 0.05), vec3(0.3, 0.42, 0.12), vn(vW.xz * 0.3)) * light;
    } else if (n.y < -0.5) {
      col = vC * (uAmbCol * 0.6 + uSunCol * vec3(0.5, 0.65, 0.45) * 0.1) * (0.7 + 0.6 * vn(vW.xz * 0.2));      // a creeper-stained soffit lit from the street
    } else {
      vec2 id = floor(gq), f = fract(gq);
      vec2 lpT = stackXZ(vW.xz); float rankK = step(lpT.y, -45.0) * step(-270.0, lpT.y) * step(abs(lpT.x), 330.0), gridK = mix(uGrid, 0.82, rankK);      // the rank on the far bank
      float far = mix(smoothstep(110.0, 260.0, dist), smoothstep(300.0, 520.0, dist), rankK);      // (the rank keeps every pane's own tilt and tint out to 500 m: it is looked at for the whole last run)
      float slab = lineCov(gq.y, 0.1, 0.1, fw.y), mull = lineCov(gq.x, 0.035, 0.035, fw.x);
      float pil = lineCov(gq.x / 6.0, 0.03, 0.03, fw.x / 6.0), span = lineCov(gq.y / 5.0, 0.16, 0.06, fw.y / 5.0);
      // every pane sits a little differently in its frame and has its own tint. On the boulevard's two walls a pane near the eye mirrors
      // what stands across the water (the facing wall's floors and green terraces, sunlit if that is the right-hand wall; the bamboo plot;
      // the park), the flood below it, and the sky only above that roof line: neighbouring panes carry different pictures
      vec3 nj = normalize(n + (vec3(h21(id + 3.1), h21(id + 6.7), h21(id + 1.9)) - 0.5) * vec3(0.08, 0.05, 0.08) * (1.0 - far));
      vec3 R = reflect(-V, nj); float fr = 0.4 + 0.6 * pow(1.0 - clamp(dot(V, n), 0.0, 1.0), 3.0);
      // dark teal glass that carries the sky: every pane sits a little differently in its frame, so they glint unevenly; looked up at steeply
      // a wall mirrors the bright lower sky and its clouds, not the dark zenith
      float lf = (0.8 + 0.12 * vn(id * 0.15) + 0.07 * (h21(vec2(id.y, 3.0)) - 0.5)) * mix(0.72 + 0.56 * h21(id + 9.0), 1.0, far);
      vec3 skyC = skyRefl(normalize(vec3(R.x, abs(R.y) * 0.45 + 0.06, abs(R.z) * 0.6 + 0.3)));
      float sideW = step(0.5, abs(n.x)) * step(abs(vW.x), 43.0) * step(-12.0, vW.z) * (1.0 - far);
      float txo = 84.0 / max(abs(R.x), 0.03), hyo = vW.y + R.y * txo, hzo = vW.z + R.z * txo, bay = (700.0 - hzo) / 101.4;
      float roofR = step(-80.0, hzo) * step(hzo, 700.0) * (1.0 - smoothstep(0.81, 0.83, fract(bay))) * (250.0 + 80.0 * h21(vec2(floor(bay), 2.0)));
      float roofL = hzo > 604.0 ? 24.0 : hzo > 598.0 ? 0.0 : hzo > 532.0 ? 300.0 : hzo > 524.0 ? 0.0 : hzo > 458.0 ? 265.0 : hzo > 357.0 ? 24.0 : hzo > 327.0 ? 0.0 : hzo > 258.0 ? 325.0 : 10.0;
      float roof = n.x < 0.0 ? roofL : roofR;                               // a pane of the right-hand wall looks at the left-hand one
      float oppK = sideW * max((1.0 - smoothstep(roof - 6.0, roof + 6.0, hyo)) * step(0.5, roof), step(hyo, 0.0));
      float fl2 = smoothstep(0.1, 0.24, fract(hyo / 4.2)), terr2 = fract(hyo / 55.0), fur2 = clamp(smoothstep(0.26, 0.0, terr2) + smoothstep(0.9, 1.0, terr2), 0.0, 1.0);
      vec3 oppSun = uAmbCol * 0.55 + uSunCol * (n.x > 0.0 ? 0.3 * smoothstep(40.0, 110.0, hyo) : 0.03);
      vec3 oppC = mix(vec3(0.06, 0.1, 0.105) * (0.6 + 0.4 * fl2) + skyC * 0.12, vec3(0.13, 0.25, 0.06), max(fur2, 1.0 - step(30.0, roof))) * (oppSun * 1.5 + 0.1);
      oppC = mix(oppC, vec3(0.05, 0.1, 0.075) * (uAmbCol + uSunCol * 0.2), step(hyo, 0.0));        // below the facing wall: the flood
      vec3 tintP = mix(vec3(1.0), vec3(0.86, 1.02, 1.02) + (vec3(h21(id + 21.0), h21(id + 23.0), h21(id + 27.0)) - 0.5) * vec3(0.3, 0.16, 0.2), 1.0 - far);
      vec3 glass = vec3(0.03, 0.078, 0.086) * (uAmbCol + uSunCol * ndl * lane * 0.6) * 1.6 * (1.0 - 0.4 * fr * (1.0 - far)) + mix(skyC, oppC, oppK) * tintP * mix(min(fr, 0.72), fr, far) * lf * mix(0.75, 1.0, lane) * mix(vec3(1.0), vec3(0.4, 0.6, 0.68), rankK);
      // sockets come in clusters: dark teal, never black, ferns filling the lower part behind a ragged edge
      float sock = step(h21(id + 5.0), max(mix(0.34, 0.166, smoothstep(16.0, 70.0, vW.y)) * smoothstep(0.45, 0.7, vn(id * 0.11 + 3.0)), 0.083)) * (1.0 - 0.75 * far);      // one pane in twelve at the least
      float fern = 1.0 - smoothstep(-0.06, 0.06, f.y - 0.2 - 0.48 * (0.75 + 0.5 * vn(vec2(gq.x * 6.0, id.y))));
      // DEPTH. Every pane sits 0.55 m back in its reveal: along the sight line the glass is met further on, so the head of each opening
      // is a band of shadow, the jamb turned to the sun a warm strip, and both slide as we pass. Behind the pane is a room 5 m deep: a
      // dim back wall with a doorway, a mossed floor, a dark ceiling, and the side wall the sun reaches through the opening lit warm.
      vec3 T = abs(n.x) > 0.5 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
      float vnn = max(dot(V, n), 0.08), nearW = 1.0 - mix(smoothstep(90.0, 210.0, dist), smoothstep(330.0, 520.0, dist), rankK);
      vec2 dir2 = -vec2(dot(V, T) / 3.6, V.y / 4.2) / vnn, fs = f + dir2 * 0.55;
      float inAp = step(0.07, f.x) * step(0.2, f.y) * nearW;
      float jamb = inAp * (1.0 - step(0.07, fs.x) * step(fs.x, 1.0)), head = inAp * step(1.0, fs.y), sill = inAp * (1.0 - step(0.2, fs.y));
      vec2 q0 = clamp(fs, vec2(0.07, 0.2), vec2(1.0));
      float tx = dir2.x > 0.0 ? (1.0 - q0.x) / max(dir2.x, 1e-4) : (0.07 - q0.x) / min(dir2.x, -1e-4);
      float ty = dir2.y > 0.0 ? (1.0 - q0.y) / max(dir2.y, 1e-4) : (0.2 - q0.y) / min(dir2.y, -1e-4);
      float tr = min(min(tx, ty), 5.0), deep = exp(-tr * 0.28), rn = vn(gq * vec2(5.0, 4.0) + id * 0.7);
      vec2 bq = q0 + dir2 * tr;
      vec3 sideN = T * (dir2.x > 0.0 ? -1.0 : 1.0);
      float sunIn = max(dot(sideN, uSunDir), 0.0) * (1.0 - smoothstep(1.2, 4.0, tr)) * lane;
      vec3 room = tr > 4.99 ? vec3(0.2, 0.21, 0.17) * (1.0 - 0.8 * step(0.52, bq.x) * step(bq.x, 0.8) * step(bq.y, 0.78))      // back wall and its doorway
        : tx < ty ? vec3(0.24, 0.23, 0.19) * (0.7 + 0.6 * rn)                                                                    // a side wall
        : dir2.y > 0.0 ? vec3(0.07, 0.075, 0.07) : folTint(vec3(0.12, 0.2, 0.07)) * (0.6 + 0.8 * rn);                           // ceiling, mossed floor
      room *= (uAmbCol * (0.35 + 0.4 * deep) + uSunCol * (tx < ty && tr < 4.99 ? sunIn * 1.1 : 0.06 * deep * lane)
        + uSunCol * ndl * lane * (tr > 4.99 ? 0.6 : 0.25) * (1.0 - smoothstep(0.1, 0.62, uSunDir.y)));      // a low sun shines straight in: the back wall of a room that faces it is lit
      glass += room * mix(0.3, 0.5, rankK) * nearW * (1.0 - 0.5 * fr);                                                                           // dimly, through the pane
      vec3 hole = mix(mix(glass * 0.3 + vec3(0.004, 0.012, 0.012), room * 0.55 + vec3(0.006, 0.012, 0.012), nearW), folTint(vec3(0.11, 0.25, 0.06)) * light * (0.7 + 0.6 * vn(gq * vec2(9.0, 7.0))), fern * 0.9);      // a dark socket, ferns in its lower part
      glass = mix(glass, hole, sock);
      glass = mix(glass, vC * light * 0.42, span * 0.8);
      vec3 jambN = T * (fs.x < 0.07 ? 1.0 : -1.0);
      glass = mix(glass, vC * (uAmbCol * 0.5 + uSunCol * max(dot(jambN, uSunDir), 0.0) * lane * 0.95) * (0.8 + 0.3 * rn), jamb);
      glass = mix(glass, vC * (uAmbCol * 0.75 + uSunCol * max(uSunDir.y, 0.0) * lane * 0.5) * mix(vec3(1.0), folTint(vec3(0.5, 0.75, 0.3)), smoothstep(0.4, 0.7, rn)), sill);
      glass = mix(glass, vC * uAmbCol * 0.26, head);
      vec3 conc = vC * light * (0.85 + 0.3 * vn(vec2(h, vW.y) * 0.21)) * gridK;
      conc = mix(vec3(dot(conc, vec3(0.3, 0.55, 0.15))), conc, 0.4 + 0.6 * gridK);                // the frames are weathered grey: in low sun they do not turn the wall into peach graph paper
      col = mix(glass, conc, clamp(max(max(slab, mull), pil), 0.0, 1.0) * 0.85);
      float creep = vn(vec2(h * 0.07, vW.y * 0.018)) * 0.6 + vn(vec2(h * 0.4, vW.y * 0.11)) * 0.4 + 0.12 * exp(-vW.y * 0.03);
      float creepE = creep + (vn(vec2(h * 0.55 + 3.0, vW.y * 0.5)) - 0.5) * 0.3 * rankK;      // on the rank the creeper has a leaf-edged outline: patches, not a wash
      col = mix(col, folTint(vec3(0.1, 0.21, 0.05)) * (0.4 + 0.6 * uFol.w) * light * (0.8 + 0.6 * vn(vec2(h * 1.3, vW.y * 0.9))), smoothstep(0.52 - 0.07 * rankK, mix(0.7, 0.5, rankK), creepE) * 0.85);
      // by moonlight tower W's corner takes a soft rim of light, so that the long fall hangs on a wall and not in the sky
      float wRim = uRimK * step(vW.z, -9.0) * step(-81.0, vW.z) * step(41.0, vW.x) * step(vW.x, 113.0) * max(step(0.5, n.z), step(n.x, -0.5)) * exp(-max(vW.x - 42.0, 0.0) * 0.06);
      col += uSunCol * vec3(0.55, 0.62, 0.75) * wRim * (0.16 + 0.1 * vn(vec2(h * 0.4, vW.y * 0.05)));
    }
    col = max(col, uAmbCol * vec3(0.5, 0.65, 0.45) * 0.1);                    // nothing of a tower is ever a black cut-out
    gl_FragColor = vec4(max(fogFar(col, vW, dist), vec3(0.0)), 1.0);
  }`;function Ds(r,f,C){const M=(o0,J=1)=>new v.Color(o0).multiplyScalar(J),P=Ss(),R={uZen:{value:M(r.zenith)},uHor:{value:M(r.horizon)},uSlateCol:{value:M(r.slate,.62)},uSunDir:{value:r.sunDir.clone()},uSunCol:{value:M(r.sunColor,r.sunK)},uAmbCol:{value:M(r.amb,r.ambK)},uCloudCol:{value:M(r.cream,r.cloudK)},uSlate:{value:0},uTime:{value:0},uHero:{value:new v.Vector4(m0.x,m0.z,Math.cos(m0.rot),Math.sin(m0.rot))},uDk:{value:P.a},uDk2:{value:P.b},uRider:{value:new v.Vector4(0,540,0,-1)},uRiderK:{value:new v.Vector3(0,0,0)},uLaneK:{value:r.laneK??0},uFol:{value:new v.Vector4(...r.fol||[1,1,1,1])},uPetal:{value:M(r.petal)},uShMin:{value:r.shMin??.5},uRingL:{value:new v.Vector4(130,3,-432,1)},uRingC:{value:M(r.portal).lerp(M("#ffc98e"),.65).multiplyScalar(.85)}},W=()=>v.UniformsUtils.clone(v.UniformsLib.fog),H=Se.map(o0=>new v.Vector4(o0.z0,o0.z1,o0.h,o0.side)),E=o0=>{const J=[];for(let L=0;L<o0;L++)J.push(new v.Vector4(1e5,1e5,0,.1));return J},a0=new v.ShaderMaterial({fog:!0,defines:C?{LITE:1,RING_R:ft.toFixed(1)}:{RING_R:ft.toFixed(1)},uniforms:{...W(),...R,uTw:{value:H},uCol:{value:E(16)},uCrown:{value:E(14)},uRank:{value:E(8)},uRain:{value:0},uPads:{value:1},uWeed:{value:1},uLaneC:{value:r.laneC??1},uFront:{value:new v.Vector2(0,0)},uBed:{value:new v.Vector3(r.bed??1,r.spark??1,r.road??0)},uPortal:{value:new v.Vector3(130,3,-432)},uPortalN:{value:new v.Vector3(-.47,0,.883)},uPortalCol:{value:M(r.portal,2.2)},uRing:f.ring,uLilac:{value:M(r.fringe)},uPetal:{value:M(r.petal)}},vertexShader:vt,fragmentShader:Rs}),l0=new v.ShaderMaterial({fog:!0,vertexColors:!0,side:v.DoubleSide,uniforms:{...W(),...R},vertexShader:vt,fragmentShader:qs}),t0=new v.ShaderMaterial({fog:!0,uniforms:{...W(),...R},vertexShader:vt,fragmentShader:Fs}),Z=new v.ShaderMaterial({fog:!0,vertexColors:!0,side:v.DoubleSide,uniforms:{...W(),...R,uRimK:{value:r.rimW??0},uGrid:{value:r.grid??.8}},vertexShader:vt,fragmentShader:Ks}),Y=new v.ShaderMaterial({fog:!0,side:v.DoubleSide,uniforms:{...W(),...R},vertexShader:`
      attribute vec4 aInfo; uniform float uTime; varying vec2 vUv; varying vec4 vI; varying vec3 vW;
      #include <fog_pars_vertex>
      void main(){
        vUv = uv; vI = aInfo; vec3 p = position;
        float hang = aInfo.x < 0.5 ? (1.0 - uv.y) : uv.y;                  // curtains swing at the bottom, crests nod at the top
        p.xz += vec2(sin(uTime * 0.9 + p.z * 0.11 + aInfo.y * 6.0), cos(uTime * 0.7 + p.x * 0.13)) * hang * hang * (aInfo.x < 0.5 ? min(0.9, 0.22 * aInfo.w) : min(0.35, 0.3 * aInfo.w));
        vec4 w = modelMatrix * vec4(p, 1.0); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${F0}
      varying vec2 vUv; varying vec4 vI; varying vec3 vW;
      #include <fog_pars_fragment>
      ${Le}
      void main(){
        vec2 q = vec2(vUv.x * vI.z, vUv.y * vI.w);
        float n1 = vn(q * 0.16 + vI.y * 9.0), n2 = vn(q * 0.9 + vI.y * 3.0), n3 = vn(q * 2.7 + 4.0), n = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
        float thr = vI.x < 0.5 ? mix(0.9, 0.3, vUv.y) : mix(0.2, 0.9, vUv.y);
        float tuftK = step(1.5, vI.x), mead = step(2.5, vI.x), flw = 0.0, fh2 = 0.0;
        if (tuftK > 0.5) {
          // kind 2, sedge on a rim: separate tufts of uneven height (one-dimensional noise along the edge), their tops broken into blades
          n = vn(vec2(q.x * 1.1 + vI.y * 9.0, 2.0)) * 0.6 + vn(vec2(q.x * 4.3, 7.0)) * 0.4;
          thr = mix(0.34, 1.0, vUv.y) + (vn(vec2(q.x * 17.0, vUv.y * 1.5 + 3.0)) - 0.5) * 0.5 * vUv.y;
          if (mead > 0.5) {
            // kind 3, tall grass on a carriageway: finer blades, and heads of flowers standing in it
            n = vn(vec2(q.x * 2.6 + vI.z * 3.0, 2.0)) * 0.5 + vn(vec2(q.x * 7.3, 7.0)) * 0.5;
            thr = mix(0.02, 0.95, vUv.y) + (vn(vec2(q.x * 31.0, vUv.y * 1.5 + 3.0)) - 0.5) * 0.8 * vUv.y + 0.7 * smoothstep(0.3, 0.5, abs(vUv.x - 0.5));
            vec2 fq2 = vec2(q.x * 4.5 + vI.z, q.y * 4.5), fi2 = floor(fq2); fh2 = h21(fi2 + vI.z * 3.0);
            flw = step(0.8, fh2) * smoothstep(0.36, 0.2, length(fract(fq2) - 0.5)) * smoothstep(0.3, 0.5, vUv.y) * step(thr - 0.3, n);
          }
        }
        float upK = step(0.5, vI.x) * (1.0 - tuftK) * step(16.0, vW.y);         // a crest up on a deck's coping: a row of separate shrubs, not a hedge
        thr += upK * (0.55 * smoothstep(0.32, 0.5, abs(vUv.x - 0.5)) + (n3 - 0.5) * 0.35);
        if (n < thr && flw < 0.5) discard;
        float lane = sunLane(vW);
        vec3 alb = mix(vec3(0.07, 0.17, 0.045), vec3(0.25, 0.39, 0.11), n3 * 0.6 + n2 * 0.3 + 0.1 * sin(uTime * 1.3 + q.x * 0.7));
        alb = mix(alb, mix(vec3(0.05, 0.1, 0.035), vec3(0.2, 0.27, 0.09), vUv.y) * (0.7 + 0.6 * n3), tuftK);
        alb = mix(alb, mix(vec3(0.06, 0.14, 0.04), vec3(0.2, 0.33, 0.09), vUv.y * (0.6 + 0.8 * n2)) * (1.0 + 1.5 * (1.0 - uFol.w)), mead);
        alb *= 1.0 - 0.25 * upK;
        alb = folTint(alb);
        alb = mix(alb, fh2 > 0.95 ? vec3(0.9, 0.74, 0.2) : fh2 > 0.9 ? vec3(0.9, 0.88, 0.8) : vec3(0.62, 0.46, 0.84), step(0.5, flw));
        gl_FragColor = vec4(max(fogFar(alb * (uAmbCol + uSunCol * vI.y * lane * (0.55 - 0.2 * mead)), vW, length(cameraPosition - vW)), vec3(0.0)), 1.0);
      }`}),_=new v.ShaderMaterial({fog:!0,uniforms:{...W(),...R},vertexShader:`
      uniform float uTime; varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vS; varying float vNr;
      #include <fog_pars_vertex>
      void main(){
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
        // the colour carries the kind: +2 = still and far (hills, crowns on towers), +4 = a mound of kudzu near the path (still, leafy)
        // (+6 = a mass of foliage in a camphor's crown: still, leafy, ragged at its outline)
        float sway = instanceColor.r > 1.5 ? 0.0 : 1.0; vNr = instanceColor.r > 5.5 ? 2.0 : instanceColor.r > 3.5 ? 1.0 : 0.0; vC = instanceColor - (instanceColor.r > 5.5 ? 6.0 : instanceColor.r > 3.5 ? 4.0 : instanceColor.r > 1.5 ? 2.0 : 0.0);
        float tall = length(instanceMatrix[1].xyz);
        w.xz += vec2(sin(uTime * 1.1 + w.x * 0.21 + w.y * 0.3), cos(uTime * 0.8 + w.z * 0.17 + w.y * 0.25)) * (position.y * 0.5 + 0.5) * min(tall, 16.0) * 0.045 * sway;
        vW = w.xyz; vN = mat3(modelMatrix) * (mat3(instanceMatrix) * normal); vS = sway;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #define FAR_DARK 0.62
      ${F0}
      varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vS; varying float vNr;
      #include <fog_pars_fragment>
      ${Le}
      float vn3(vec3 p){ float i = floor(p.z), f = fract(p.z); f = f * f * (3.0 - 2.0 * f); return mix(vn(p.xy + i * vec2(17.3, 9.1)), vn(p.xy + (i + 1.0) * vec2(17.3, 9.1)), f); }
      void main(){
        vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0));
        float sc = mix(0.05, 1.0, max(vS, min(vNr, 1.0))), crownK = step(1.5, vNr);
        vec3 Vb = normalize(cameraPosition - vW + vec3(0.0, 1e-4, 0.0)); float rimB = 1.0 - clamp(dot(n, Vb), 0.0, 1.0);
        float leaf = vn(vW.xz * 5.2 * sc + vec2(vW.y * 3.7, -vW.y * 2.9) * sc + uTime * 0.35 * vS) * 0.55 + vn(vW.zy * 1.9 * sc + vec2(vW.x * 1.3, vW.x * -1.1) * sc) * 0.45;
        float top = smoothstep(-0.75, 0.8, n.y);
        float nt = clamp((1.0 - uFol.w) * 2.5, 0.0, 1.0);                 // by moonlight: softer modelling, so a mound is a mass of leaves and not a rock
        float wrap = mix(clamp(dot(n, uSunDir) * 0.6 + 0.4, 0.0, 1.0), 0.6, nt * 0.75);
        vec3 alb = vC * (0.52 + 0.5 * leaf);
        if (vNr > 1.5) {
          // a camphor's foliage (round 15: noise in three dimensions, so no face of a mass is streaked or drawn out): clumps of leaves a
          // metre across, each lit on top and dark beneath and between, small leaves glinting on them, stirring; toward its outline and
          // from beneath every mass breaks up into sprays, so no crown has a smooth edge or a smooth bowl for an underside
          float c1 = vn3(vW * 0.55 + 3.0), c2 = vn3(vW * 1.5 + vec3(0.0, uTime * 0.05, 7.0)), c3 = vn3(vW * 4.6 + vec3(uTime * 0.22, 0.0, 1.0));
          if (c2 * 0.5 + c3 * 0.5 < max(smoothstep(0.25, 0.9, rimB) * 0.68, smoothstep(0.0, 0.7, -n.y) * 0.52)) discard;
          float mass = smoothstep(0.3, 0.66, c1 * 0.45 + c2 * 0.55 + 0.04 * sin(uTime * 1.7 + vW.x * 1.3 + vW.z * 1.1));
          alb = vC * mix(0.2, 1.22, mass) * (0.62 + 0.72 * smoothstep(0.35, 0.75, c3));
          alb = mix(alb, vec3(0.42, 0.44, 0.15) * (0.8 + 0.5 * c3), smoothstep(0.55, 0.8, c2) * top * 0.55);      // the flush of new leaves on the clumps' tops
          alb *= mix(0.55, 1.0, smoothstep(-0.5, 0.5, n.y));                                                       // shade under every clump
        } else if (vNr > 0.5) {
          // kudzu seen from a few metres: leaves in overlapping layers with dark gaps between them, pale young leaves on top, all stirring
          vec2 lq = vW.xz * 6.0 + vec2(vW.y * 4.4, -vW.y * 3.3);
          lq += (vec2(vn(lq * 0.6 + 3.0), vn(lq * 0.6 + 11.0)) - 0.5) * 1.6 + vec2(sin(uTime * 1.3 + vW.x * 2.0), cos(uTime * 1.1 + vW.z * 2.0)) * 0.05;
          float l1 = vn(lq), l2 = vn(lq * 2.7 + 5.0), l3 = vn(lq * 0.3 + 9.0), blade = smoothstep(0.3, 0.7, l1 * 0.6 + l2 * 0.4);
          float fine = 1.0 - smoothstep(6.0, 45.0, length(cameraPosition - vW)) * 0.7;
          alb = vC * mix(0.52 + 0.5 * leaf, mix(0.3 + 0.3 * nt, 1.2 - 0.15 * nt, blade) * (0.7 + 0.6 * l3), fine);
          alb = mix(alb, vec3(0.3, 0.4, 0.12) * (0.7 + 0.5 * l2), smoothstep(0.62, 0.8, l2 * 0.6 + l3 * 0.4) * top * 0.5 * fine);
        }
        vec3 col = folTint(alb) * (uAmbCol * (0.5 + 1.15 * top) + uSunCol * wrap * max(sunMask(vW), 0.12) * (0.5 + 0.45 * leaf) * mix(0.3 + 1.0 * top, 0.8, nt * 0.6));
        // the mounds near the path take a rim of light, so that it is their outline that catches the sun or the moon
        col += folTint(alb) * (uAmbCol * 1.3 + uSunCol * 0.8) * rimB * rimB * rimB * min(vNr, 1.0) * (1.0 - 0.6 * crownK) * (0.4 + 0.6 * top) * (1.0 - 0.5 * nt);      // (leaf-coloured: a grey rim made rock of it)
        gl_FragColor = vec4(max(fogFar(col, vW, length(cameraPosition - vW)), vec3(0.0)), 1.0);
      }`}),r0=new v.ShaderMaterial({transparent:!0,depthWrite:!1,side:v.DoubleSide,uniforms:{...R,uTop:{value:M(r.cream,.9)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
      ${F0}
      uniform vec3 uTop; varying vec2 vUv;
      void main(){
        float az = abs(vUv.x - 0.5) * 2.0, v = vUv.y;
        float veil = vn(vec2(vUv.x * 46.0 + v * 2.5 + uTime * 0.01, v * 2.2)) * 0.6 + vn(vec2(vUv.x * 11.0 - uTime * 0.004, v * 0.8)) * 0.4;
        float edge = vn(vec2(vUv.x * 9.0 + uTime * 0.006, 3.0)) * 0.22;
        float a = uSlate * (1.0 - smoothstep(0.45, 1.0, az)) * (1.0 - smoothstep(0.34 + edge, 0.62 + edge, v)) * (0.78 + 0.22 * veil);
        vec3 col = mix(uSlateCol * (0.8 + 0.3 * veil), uTop, smoothstep(0.3 + edge, 0.6 + edge, v) * 0.8);
        col = mix(uHor * 0.85, col, smoothstep(0.0, 0.07, v));
        gl_FragColor = vec4(col, a);
      }`});return{shared:R,water:a0,concrete:l0,pool:t0,tower:Z,fur:Y,blob:_,slate:r0,fogU:W}}async function Is(r){const C=new Uint8Array(262144);let M=625341585;const P=()=>(M^=M<<13,M^=M>>>17,M^=M<<5,M>>>0&255);for(let W=0;W<256*256;W++)C[W*4]=P(),C[W*4+2]=P(),C[W*4+3]=255,(W&8191)===8191&&await r.yield();for(let W=0;W<256;W++){for(let H=0;H<256;H++)C[(W*256+H)*4+1]=C[((W+17&255)*256+(H+37&255))*4];(W&31)===31&&await r.yield()}const R=new v.DataTexture(C,256,256,v.RGBAFormat);return R.wrapS=R.wrapT=v.RepeatWrapping,R.magFilter=R.minFilter=v.LinearFilter,R.generateMipmaps=!1,R.colorSpace=v.NoColorSpace,R.needsUpdate=!0,R}function Bs(){const r=new v.DataTexture(new Uint8Array(262144),256,256,v.RGBAFormat);return r.wrapS=r.wrapT=v.RepeatWrapping,r.magFilter=v.LinearFilter,r.minFilter=v.LinearMipmapLinearFilter,r.anisotropy=4,r.generateMipmaps=!0,r.colorSpace=v.NoColorSpace,r}async function _s(r,f,C){const R=[new Float32Array(65536),new Float32Array(65536)],W=new Int32Array(256),H=new Int32Array(256),E=new Float32Array(256);for(let Y=0;Y<2;Y++){const _=R[Y];for(let r0=0,o0=Y?16:4,J=.5;r0<4;r0++,o0*=2,J*=.55){const L=new Float32Array(o0*o0);for(let O=0;O<L.length;O++)L[O]=f();for(let O=0;O<256;O++){const W0=O/256*o0,A0=Math.floor(W0),P0=W0-A0;W[O]=A0%o0,H[O]=(A0+1)%o0,E[O]=P0*P0*(3-2*P0)}for(let O=0;O<256;O++){const W0=W[O]*o0,A0=H[O]*o0,P0=E[O];for(let Q=0,M0=O*256;Q<256;Q++,M0++){const I0=L[W0+W[Q]],U0=L[W0+H[Q]],H0=L[A0+W[Q]],U=L[A0+H[Q]],s0=E[Q];_[M0]+=J*(I0+(U0-I0)*s0+(H0+(U-H0)*s0-I0-(U0-I0)*s0)*P0)}O%16===15&&await r.yield()}}}const a0=.5*(1+.55+.55**2+.55**3),l0=C.image.data,t0=255,Z=Y=>Math.max(0,Math.min(255,((Y/a0-.5)*1.75+.5)*255));for(let Y=0;Y<256;Y++){for(let _=0;_<256;_++){const r0=Y*256+_,o0=(Y+89&t0)*256+(_+151&t0),J=(Y+33&t0)*256+(_+201&t0);l0[r0*4]=Z(R[0][r0]),l0[r0*4+1]=Z(R[1][r0]),l0[r0*4+2]=Z(R[0][o0]),l0[r0*4+3]=Z(R[0][J])}Y%16===15&&await r.yield()}C.needsUpdate=!0}async function Ra(r,f){const C=new v.BufferGeometry;return C.setAttribute("position",new v.Float32BufferAttribute(f.p,3)),await r.yield(),C.setAttribute("color",new v.Float32BufferAttribute(f.c,3)),await r.yield(),C.computeVertexNormals(),await r.yield(),C}const ue=(r,f,C,M,P,R)=>{const W=[[-M,-M],[M,-M],[M,M],[-M,M]];for(let H=0;H<4;H++){const E=W[H],a0=W[(H+1)%4];r.quad([f[0]+E[0],f[1],f[2]+E[1]],[f[0]+a0[0],f[1],f[2]+a0[1]],[C[0]+a0[0],C[1],C[2]+a0[1]],[C[0]+E[0],C[1],C[2]+E[1]],P,R||P)}};function We(r){const f=r.attributes.position,C=r.attributes.normal,M=new Map;for(let P=0;P<f.count;P++){const R=Math.round(f.getX(P)*3e3)+","+Math.round(f.getY(P)*3e3)+","+Math.round(f.getZ(P)*3e3);let W=M.get(R);W||M.set(R,W=[0,0,0,[]]),W[0]+=C.getX(P),W[1]+=C.getY(P),W[2]+=C.getZ(P),W[3].push(P)}for(const P of M.values()){const R=Math.hypot(P[0],P[1],P[2]);if(R>1e-6)for(const W of P[3])C.setXYZ(W,P[0]/R,P[1]/R,P[2]/R)}C.needsUpdate=!0}function js(r,f,C=1.6,M=.5){const P=r.geometry,R=r.uniforms,W=new v.InstancedBufferGeometry;W.setAttribute("position",new v.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,1,-1,0,0,1,0,0,1,0,1,-1,0,1,-1,0,0,1,0,0,1,1,0,-1,1,0],3)),W.setAttribute("aK",new v.Float32BufferAttribute([2,2,2,2,0,0,0,0,1,1,1,1],1)),W.setIndex([0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11]),W.setAttribute("iA",P.attributes.iA),W.setAttribute("iB",P.attributes.iB),W.instanceCount=r.count;const H=new v.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:v.DoubleSide,uniforms:{...f.fogU(),...f.shared,uTracks:R.uTracks,uTrackInfo:R.uTrackInfo,uTravel:R.uTravel,uVis:R.uVis,uSize:{value:C},uShadowK:{value:M}},vertexShader:`
      attribute vec4 iA; attribute vec4 iB; attribute float aK;
      uniform sampler2D uTracks; uniform vec3 uTrackInfo, uSunDir; uniform float uTravel, uVis, uSize, uShMin;
      varying vec2 vQ; varying float vK; varying vec3 vW; varying float vSeed;
      #include <fog_pars_vertex>
      vec3 trackTex(float i){ float W = uTrackInfo.x; i = clamp(i, 0., W - 1.); return texelFetch(uTracks, ivec2(int(i + .5), int(iA.x + .5)), 0).xyz; }
      vec3 trackAt(float s){
        float W = uTrackInfo.x, L = max(iA.y, 1.0), f = s / L, fc = clamp(f, 0., 1.), x = fc * (W - 1.);
        float i = floor(x), k = x - i, k2 = k * k, k3 = k2 * k;
        vec3 p = trackTex(i - 1.) * ((1. - 3. * k + 3. * k2 - k3) / 6.) + trackTex(i) * ((3. * k3 - 6. * k2 + 4.) / 6.) + trackTex(i + 1.) * ((-3. * k3 + 3. * k2 + 3. * k + 1.) / 6.) + trackTex(i + 2.) * (k3 / 6.);
        if (f != fc) { float e = f > 1. ? W - 1. : 1.; vec3 d = trackTex(e) - trackTex(e - 1.); p += d / max(length(d), 1e-4) * (f - fc) * L; }
        return p;
      }
      void main(){
        float s = uTravel - iA.z; vec3 P = trackAt(s), P2 = trackAt(s + 1.0);
        vec2 f2 = P2.xz - P.xz; float fl = length(f2); vec2 Fw = fl > 1e-5 ? f2 / fl : vec2(0.0, -1.0); vec2 X = vec2(Fw.y, -Fw.x);
        float sc = iB.x * uSize * uVis * (1.0 - smoothstep(-0.1, 0.5, P.y));        // nothing while the animal is in the air over the court
        float airW = smoothstep(4.5, 12.0, cameraPosition.y);                       // seen from the air every animal draws a long white wake: the herd is a river of motion
        vK = aK; vSeed = iA.w; vec4 mvPosition;
        if (aK > 1.5) {
          // shadow: an ellipse from under the animal to where its back and head fall, stretched by the height of the sun
          float sl = length(uSunDir.xz), body = iB.x * uVis * (1.0 - smoothstep(-0.1, 0.5, P.y)), reach = body * 0.62 / max(uSunDir.y / max(sl, 1e-3), max(uShMin, 0.1));
          vec2 sd = sl > 1e-3 ? -uSunDir.xz / sl : vec2(0.0, -1.0), sx = vec2(sd.y, -sd.x);
          vQ = vec2(position.x, position.z);
          vec2 xz = P.xz + sd * (reach * 0.55 + position.z * (reach * 0.55 + body * 0.7)) + sx * position.x * body * 0.6;
          vW = vec3(xz.x, 0.04, xz.y); mvPosition = viewMatrix * vec4(vW, 1.0);
        } else if (aK < 0.5) {
          vQ = vec2(position.x, position.z);
          vec2 xz = P.xz - Fw * (position.z * 4.6 * (1.0 + 0.55 * airW) - 0.5) * sc + X * position.x * (0.35 + position.z * 1.35) * (1.0 + 0.15 * airW) * sc;
          vW = vec3(xz.x, 0.05, xz.y); mvPosition = viewMatrix * vec4(vW, 1.0);
        } else {
          vQ = vec2(position.x, position.y);
          vW = vec3(P.x - Fw.x * 0.45 * sc, 0.0, P.z - Fw.y * 0.45 * sc); mvPosition = viewMatrix * vec4(vW, 1.0);
          mvPosition.xy += vec2(position.x * 0.8, position.y * 0.6) * sc;
        }
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${F0}
      uniform float uShadowK;
      varying vec2 vQ; varying float vK; varying vec3 vW; varying float vSeed;
      #include <fog_pars_fragment>
      void main(){
        float a, u = vQ.x, v = vQ.y;
        if (vK > 1.5) {
          if ((vW.x > -32.5 && vW.x < 18.5 && vW.z > 47.5 && vW.z < 62.5) || (vW.x > -2.5 && vW.x < 14.5 && vW.z > 19.5 && vW.z <= 48.0)) discard;
          a = (1.0 - smoothstep(0.2, 1.0, length(vQ))) * uShadowK * sunMask(vW);
          if (a < 0.01) discard;
          gl_FragColor = vec4(vec3(0.03, 0.05, 0.09) * uAmbCol * 2.0, a);
          #include <fog_fragment>
          return;
        }
        if (vK < 0.5) {
          float arm = smoothstep(0.3, 0.0, abs(abs(u) - 0.25 - v * 0.6)) * (1.0 - v), churn = exp(-(u * u * 5.0 + v * v * 14.0));
          float n = vn(vW.xz * 2.6 + vec2(0.0, uTime * 1.5)) * 0.6 + vn(vW.xz * 7.0 - uTime) * 0.4;
          a = clamp((arm * 0.75 + churn * 1.2) * (0.1 + 1.5 * n) - 0.38 + 0.16 * smoothstep(4.5, 12.0, cameraPosition.y), 0.0, 1.0) * (0.62 + 0.3 * smoothstep(4.5, 12.0, cameraPosition.y)) * (0.45 + 0.55 * smoothstep(3.0, 16.0, length(cameraPosition - vW)));
        } else {
          // spray flung up and back with every stride: a torn sheet of water opening into a fan, never beads on spokes
          float ph = fract(uTime * 2.6 + vSeed * 7.0), r = length(vec2(u, v)) / (0.3 + 0.7 * ph), ang = atan(u, v + 1e-3);
          float fan = (1.0 - smoothstep(0.55, 1.0, r)) * smoothstep(0.08, 0.3, r) * (1.0 - smoothstep(0.7, 1.2, abs(ang)));
          a = (fan * smoothstep(0.45, 0.8, vn(vec2(ang * 5.0 + vSeed * 17.0, r * 4.0 - ph * 3.0))) * 0.5 + exp(-r * r * 4.0) * 0.1) * (1.0 - ph);
        }
        if (a < 0.01) discard;
        vec3 col = mix(uAmbCol * 0.9, uAmbCol * 0.65 + uSunCol * 0.8, sunMask(vW));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),E=new v.Mesh(W,H);return E.frustumCulled=!1,E.renderOrder=2,E.name="wake",E}class Ns{constructor(){this.p=[],this.c=[],this.i=[]}v(f,C,M,P){this.p.push(f,C,M),this.c.push(P.r,P.g,P.b)}prism(f,C,M,P,R,W,H,E,a0,l0,t0=6,Z=R,Y=W){const _=Math.max(1,Math.ceil((E-H)/.8)),r0=-P,o0=M,J=this.p.length/3;for(let L=0;L<=_;L++){const O=L/_,W0=H+(E-H)*O,A0=R+(Z-R)*O,P0=W+(Y-W)*O,Q=a0.clone().lerp(l0,O);for(let M0=0;M0<t0;M0++){const I0=(M0+.5)/t0*e0,U0=Math.cos(I0)*A0,H0=Math.sin(I0)*P0;this.v(f+M*U0+r0*H0,W0,C+P*U0+o0*H0,Q)}}for(let L=0;L<_;L++)for(let O=0;O<t0;O++){const W0=J+L*t0+O,A0=J+L*t0+(O+1)%t0;this.i.push(W0,A0,A0+t0,W0,A0+t0,W0+t0)}}post(f,C,M,P,R){const W=Math.max(1,Math.ceil(Math.abs(C[1]-f[1])/.8)),H=this.p.length/3;for(let E=0;E<=W;E++){const a0=E/W,l0=f[0]+(C[0]-f[0])*a0,t0=f[1]+(C[1]-f[1])*a0,Z=f[2]+(C[2]-f[2])*a0,Y=P.clone().lerp(R,a0);this.v(l0-M,t0,Z-M,Y),this.v(l0+M,t0,Z-M,Y),this.v(l0+M,t0,Z+M,Y),this.v(l0-M,t0,Z+M,Y)}for(let E=0;E<W;E++)for(let a0=0;a0<4;a0++){const l0=H+E*4+a0,t0=H+E*4+(a0+1)%4;this.i.push(l0,t0,t0+4,l0,t0+4,l0+4)}}beam(f,C,M,P,R,W){const H=C[0]-f[0],E=C[1]-f[1],a0=C[2]-f[2],l0=Math.hypot(H,a0)||1,t0=Math.max(1,Math.ceil(Math.hypot(l0,E)/2)),Z=-a0/l0*M,Y=H/l0*M,_=this.p.length/3;for(let r0=0;r0<=t0;r0++){const o0=r0/t0,J=f[0]+H*o0,L=f[1]+E*o0,O=f[2]+a0*o0;this.v(J-Z,L,O-Y,W),this.v(J+Z,L,O+Y,W),this.v(J+Z,L-P,O+Y,R),this.v(J-Z,L-P,O-Y,R)}for(let r0=0;r0<t0;r0++)for(let o0=0;o0<4;o0++){const J=_+r0*4+o0,L=_+r0*4+(o0+1)%4;this.i.push(J,L,L+4,J,L+4,J+4)}}build(){const f=new v.BufferGeometry;return f.setAttribute("position",new v.Float32BufferAttribute(this.p,3)),f.setAttribute("color",new v.Float32BufferAttribute(this.c,3)),f.setIndex(this.i),f}}function Gs(r,f){const C=new v.ShaderMaterial({uniforms:{...r.fogU(),...r.shared},fog:!0,vertexColors:!0,side:v.DoubleSide,depthFunc:v.GreaterDepth,depthWrite:!1,blending:v.CustomBlending,blendSrc:v.SrcAlphaFactor,blendDst:v.OneMinusSrcAlphaFactor,blendEquation:v.AddEquation,vertexShader:`
      uniform float uTime; varying vec3 vW; varying vec3 vC;
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.0); vC = color;
        float dp = clamp(-wp.y, 0.0, 16.0);                    // the deeper in the picture, the more the water moves it
        wp.xz += vec2(sin(uTime * 2.1 + wp.y * 1.9 + wp.x * 0.6), cos(uTime * 1.7 + wp.y * 2.3 + wp.z * 0.6)) * (0.03 * min(dp, 1.5) + 0.03 * dp);
        vW = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${F0}
      varying vec3 vW; varying vec3 vC;
      #include <fog_pars_fragment>
      void main(){
        if (vW.y > -0.03) discard;
        float kY = cameraPosition.y / max(cameraPosition.y - vW.y, 1e-3); vec2 hx = mix(cameraPosition.xz, vW.xz, kY);      // where the sight line meets the water
        if ((hx.x > -32.0 && hx.x < 18.0 && hx.y > 48.0 && hx.y < 62.0) || (hx.x > -2.0 && hx.x < 14.0 && hx.y > 20.0 && hx.y <= 48.0)) discard;
        vec3 toW = vec3(hx.x, 0.0, hx.y) - cameraPosition; float gz = 1.0 - clamp(-toW.y / max(length(toW), 1e-3), 0.0, 1.0);
        float lit = sunMask(vec3(vW.x, -vW.y, vW.z));
        vec3 col = vC * (uAmbCol * 1.2 + uSunCol * 0.62 * lit) * vec3(0.6, 0.66, 0.75);
        float torn = 0.62 + 0.38 * smoothstep(0.25, 0.7, vn(hx * vec2(0.9, 2.6) + vec2(uTime * 0.5, -uTime * 0.8)));      // broken by the ripple, never a clean pane
        float a = mix(0.06, 0.8, gz * gz * gz) * torn * (1.0 - smoothstep(4.5, 10.5, cameraPosition.y));
        if (a < 0.01) discard;
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),M=new v.Mesh(f,C);M.renderOrder=-.3,M.frustumCulled=!1,M.name="mirror-street";const P=new v.Group;return P.scale.y=-1,P.add(M),P}function Hs(r){const f=[],C=[],M=[];for(let H=0;H<3;H++){const E=H*9,a0=H*4;f.push(-52,0,E,52,0,E,52,74,E,-52,74,E),C.push(H,H,H,H),M.push(a0,a0+1,a0+2,a0,a0+2,a0+3)}const P=new v.BufferGeometry;P.setAttribute("position",new v.Float32BufferAttribute(f,3)),P.setAttribute("aL",new v.Float32BufferAttribute(C,1)),P.setIndex(M);const R=new v.ShaderMaterial({uniforms:{...r.fogU(),...r.shared,uK:{value:0}},fog:!0,transparent:!0,depthWrite:!1,side:v.DoubleSide,vertexShader:`
      attribute float aL; varying vec3 vW; varying float vL;
      #include <fog_pars_vertex>
      void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vL = aL; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${F0}
      uniform float uK; varying vec3 vW; varying float vL;
      #include <fog_pars_fragment>
      void main(){
        float d = distance(vW, cameraPosition), lit = sunMask(vW);
        // falling streaks: fine ones and coarse ones, slanting a little with the wind, in gusts that travel along the line
        float s1 = vn(vec2(vW.x * 8.5 + vW.y * 0.5 + vL * 17.0, vW.y * 0.2 + uTime * 5.2)), s2 = vn(vec2(vW.x * 2.6 + vW.y * 0.2 + vL * 31.0, vW.y * 0.09 + uTime * 3.0));
        float gust = 0.45 + 0.55 * smoothstep(0.25, 0.7, vn(vec2(vW.x * 0.06 + uTime * 0.25 + vL * 3.0, vW.y * 0.03)));
        float a = (0.075 + 0.17 * smoothstep(0.55, 0.92, s1) + 0.09 * smoothstep(0.45, 0.8, s2)) * gust;
        a *= (1.0 - smoothstep(34.0, 72.0, vW.y)) * (1.0 - smoothstep(40.0, 51.0, abs(vW.x))) * smoothstep(9.0, 36.0, d) * (1.0 - 0.3 * vL) * uK;
        if (a < 0.004) discard;
        vec3 col = mix(uSlateCol * 0.8 + uAmbCol * 0.45, uSunCol * 0.95 + uHor * 0.5, lit * 0.85);
        gl_FragColor = vec4(col, min(a, 0.4));
        #include <fog_fragment>
      }`}),W=new v.Mesh(P,R);return W.frustumCulled=!1,W.renderOrder=2,W.name="rain-front",W}function Ls(r){const f=new v.BufferGeometry;f.setAttribute("position",new v.Float32BufferAttribute([-16,1.4,-4,48,1.4,-4,48,1.4,-70,-16,1.4,-70,-24,.5,0,24,.5,0,24,36,0,-24,36,0],3)),f.setAttribute("aCard",new v.Float32BufferAttribute([0,0,0,0,1,1,1,1],1)),f.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);const C=new v.ShaderMaterial({uniforms:{...r.shared,uK:{value:0}},transparent:!0,depthWrite:!1,side:v.DoubleSide,blending:v.AdditiveBlending,vertexShader:`attribute float aCard; varying vec3 vW; varying vec3 vL;
      void main(){ vec3 p = position; vL = vec3(position.xy, aCard);
        if (aCard > 0.5) { vec2 dc = cameraPosition.xz - vec2(33.0, -45.0); dc /= max(length(dc), 1e-3); p = vec3(33.0, 0.0, -45.0) + vec3(dc.y, 0.0, -dc.x) * position.x + vec3(0.0, position.y, 0.0); }
        vec4 wp = modelMatrix * vec4(p, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
      ${F0}
      uniform float uK; varying vec3 vW; varying vec3 vL;
      void main(){
        vec3 v = normalize(vW - cameraPosition); float ang = degrees(acos(clamp(dot(v, -uSunDir), -1.0, 1.0))), x = (ang - 39.4) / 3.4;
        // the drifting spray: thick near the fall, in tatters toward us
        float m = smoothstep(0.42, 0.78, vn(vW.xz * 0.11 + vec2(uTime * 0.16, uTime * 0.07)) * 0.55 + vn(vW.xz * 0.37 - vec2(uTime * 0.1, -uTime * 0.13)) * 0.45 + 0.08);
        float e = 1.0 - smoothstep(15.0, 31.0, length(vW.xz - vec2(15.0, -37.0)));
        if (vL.z > 0.5) {
          m = smoothstep(0.3, 0.7, vn(vec2(vL.x * 0.09 + uTime * 0.05, vL.y * 0.07 - uTime * 0.16)) * 0.55 + vn(vec2(vL.x * 0.31 - uTime * 0.08, vL.y * 0.23 - uTime * 0.3)) * 0.45 + 0.12);
          e = (1.0 - smoothstep(0.35, 1.0, length(vec2(vL.x / 24.0, (vL.y - 4.0) / 32.0)))) * smoothstep(0.5, 3.0, vL.y) * 1.5;
        }
        float band = smoothstep(0.0, 0.4, x) * (1.0 - smoothstep(0.6, 1.0, x)) * step(0.0, x) * step(x, 1.0);
        vec3 col = clamp(vec3(smoothstep(0.42, 0.8, x), 1.0 - abs(x - 0.5) * 2.6, 1.0 - smoothstep(0.18, 0.55, x)), 0.0, 1.0);      // violet inside, red outside
        float lit = sunMask(vW), a = m * e * uK * lit * smoothstep(3.0, 12.0, distance(vW, cameraPosition));
        vec3 outC = col * band * (uSunCol * 0.5 + 0.35) * a + (uSunCol * 0.5 + uAmbCol * 0.5) * 0.22 * a;      // (and the spray itself, a breath of white)
        if (a < 0.003) discard;
        gl_FragColor = vec4(outC, 1.0);
      }`}),M=new v.Mesh(f,C);return M.frustumCulled=!1,M.renderOrder=2.5,M.name="spray-bow",M}function Us(r,f){const C=r.material;if(!C.vertexShader.includes("vec4 wp = modelMatrix * vec4(w, 1.);")||!C.fragmentShader.includes("gl_FragColor = vec4(c, uOpacity);"))return new v.Group;const R=new v.ShaderMaterial({uniforms:{...C.uniforms,uHeroP:f.shared.uHero,uTimeP:f.shared.uTime,uPadsP:f.water.uniforms.uPads},defines:{...C.defines},fog:!0,vertexColors:!0,side:v.DoubleSide,depthFunc:v.GreaterDepth,depthWrite:!1,vertexShader:`varying vec3 vMW;
`+C.vertexShader.replace("vec4 wp = modelMatrix * vec4(w, 1.);","vec4 wp = modelMatrix * vec4(w, 1.); vMW = wp.xyz; wp.xz += vec2(sin(uTime * 2.3 + wp.y * 2.6 + wp.x), cos(uTime * 1.9 + wp.y * 3.1 + wp.z)) * 0.07 * clamp(-wp.y, 0., 2.);"),fragmentShader:`varying vec3 vMW;

      uniform vec4 uHeroP; uniform float uTimeP, uPadsP;
      float pH(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float pN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(pH(i), pH(i+vec2(1.,0.)), f.x), mix(pH(i+vec2(0.,1.)), pH(i+vec2(1.,1.)), f.x), f.y); }
      float padP(vec2 w){
        vec2 hl = w - uHeroP.xy, lp = vec2(hl.x * uHeroP.z - hl.y * uHeroP.w, hl.x * uHeroP.w + hl.y * uHeroP.z); float pond = 1.0 - smoothstep(0.75, 1.0, length((lp - vec2(0.0, 60.0)) / vec2(78.0, 68.0)));
        vec2 lc = floor(lp / 1.7), lf = fract(lp / 1.7) - 0.5; float lh = pH(lc + 11.0), rad = 0.36 * (0.5 + 0.9 * pH(lc + 0.7));
        vec2 off = (vec2(pH(lc + 2.3), pH(lc + 5.9)) - 0.5) * (0.96 - 2.0 * rad), ld = lf - off + vec2(sin(uTimeP * 0.7 + lh * 20.0), cos(uTimeP * 0.6 + lh * 9.0)) * 0.012;
        float lpatch = smoothstep(0.3, 0.52, pN(lp * 0.045 + 3.0));
        lpatch = max(lpatch, 0.62 * (1.0 - smoothstep(9.0, 24.0, abs(lp.x))) * smoothstep(-4.0, 10.0, lp.y) * (1.0 - smoothstep(120.0, 160.0, lp.y)) * smoothstep(0.25, 0.5, pN(lp * 0.21 + 7.0) + 0.25));
        float band2 = (1.0 - smoothstep(30.0, 62.0, abs(lp.x - 4.0))) * smoothstep(150.0, 168.0, lp.y) * (1.0 - smoothstep(205.0, 228.0, lp.y)) * smoothstep(0.3, 0.55, pN(lp * 0.13 + 5.0) * 0.6 + pN(lp * 0.37) * 0.4 + 0.12);
        float want = step(1.0 - max((0.66 * pond + 0.12) * lpatch, 0.6 * band2) * uPadsP * step(length(lp - vec2(0.0, 80.0)), 190.0), lh);
        float rn = length(ld) / max(rad, 1e-3), la = atan(ld.y, ld.x + 1e-5) + lh * 40.0;
        return want * (1.0 - smoothstep(0.94, 1.04, rn)) * (1.0 - smoothstep(0.9, 0.96, cos(la)) * step(0.12, rn));
      }
      `+C.fragmentShader.replace("gl_FragColor = vec4(c, uOpacity);",`float kY = cameraPosition.y / max(cameraPosition.y - vMW.y, 1e-3); vec2 hx = mix(cameraPosition.xz, vMW.xz, kY);
if ((hx.x > -32. && hx.x < 18. && hx.y > 48. && hx.y < 62.) || (hx.x > -2. && hx.x < 14. && hx.y > 20. && hx.y <= 48.) || vMW.y > 0. || padP(hx) > 0.5) discard;
gl_FragColor = vec4(c * vec3(.56, .63, .72), uOpacity);`)}),W=new v.Mesh(r.geometry,R);W.renderOrder=-.3,W.frustumCulled=!1,W.name="mirror-herd";const H=new v.Group;return H.scale.y=-1,H.add(W),H}function Vs(r,f,C){const M=[],P=[],R=[],W=[],H=[],E=new v.Color("#8a7a62"),a0=new v.Color("#5f5344"),l0=new v.Color("#c9806a"),t0=(J,L,O,W0)=>{const A0=M.length/3,P0=J.attributes.position,Q=J.attributes.normal;for(let M0=0;M0<P0.count;M0++){const I0=P0.getX(M0),U0=P0.getY(M0),H0=P0.getZ(M0),U=W0(I0,U0,H0);M.push(I0,U0,H0),P.push(Q.getX(M0),Q.getY(M0),Q.getZ(M0)),R.push(U.r,U.g,U.b),W.push(L,O[0],O[1],O[2])}for(let M0=0;M0<J.index.count;M0++)H.push(A0+J.index.getX(M0))};t0(new v.SphereGeometry(1,7,5).scale(.17,.25,.19).translate(0,.27,0),0,[0,.15,0],(J,L,O)=>O>.1?E.clone().lerp(new v.Color("#c9bca0"),.6):L>.35?E:a0),t0(new v.SphereGeometry(.105,6,4).translate(0,.6,.05),1,[0,.5,0],(J,L,O)=>O>.1&&L<.66?l0:E);for(const[J,L]of[[2,-.13],[3,.13]])t0(new v.CylinderGeometry(.036,.028,.3,4,1).translate(L,.42-.15,.06),J,[L,.42,.06],()=>E);for(const[J,L]of[[4,-.1],[5,.1]])t0(new v.CylinderGeometry(.046,.03,.3,4,1).translate(L,.1-.15,.02),J,[L,.1,.02],()=>a0);t0(new v.CylinderGeometry(.02,.012,.28,3,1).translate(0,.12-.14,-.17),6,[0,.12,-.17],()=>a0);const Z=new v.InstancedBufferGeometry;Z.setAttribute("position",new v.Float32BufferAttribute(M,3)),Z.setAttribute("normal",new v.Float32BufferAttribute(P,3)),Z.setAttribute("color",new v.Float32BufferAttribute(R,3)),Z.setAttribute("aPart",new v.Float32BufferAttribute(W,4)),Z.setIndex(H);const Y=new Float32Array(f.length*4),_=new Float32Array(f.length*4);f.forEach((J,L)=>{Y.set([J[0],J[1],J[2],J[3]],L*4),_.set([J[4]||0,C(),J[5]||0,J[6]||0],L*4)}),Z.setAttribute("iA",new v.InstancedBufferAttribute(Y,4)),Z.setAttribute("iB",new v.InstancedBufferAttribute(_,4)),Z.instanceCount=f.length;const r0=new v.ShaderMaterial({fog:!0,vertexColors:!0,side:v.DoubleSide,uniforms:{...r.fogU(),...r.shared},vertexShader:`
      attribute vec4 aPart; attribute vec4 iA; attribute vec4 iB; uniform float uTime;
      varying vec3 vW; varying vec3 vN; varying vec3 vC;
      #include <fog_pars_vertex>
      vec3 rotX(vec3 d, float a){ float c = cos(a), s = sin(a); return vec3(d.x, d.y * c - d.z * s, d.z * c + d.y * s); }
      vec3 rotY(vec3 d, float a){ float c = cos(a), s = sin(a); return vec3(d.x * c + d.z * s, d.y, d.z * c - d.x * s); }
      void main(){
        float part = aPart.x, walk = iB.x, ph = iB.y * 6.2832; vec3 pv = aPart.yzw, p = position, n = normal, c0 = vec3(0.0, 0.15, 0.0);
        float pace = sin(uTime * 0.22 + ph), dirS = cos(uTime * 0.22 + ph) >= 0.0 ? 1.0 : -1.0, moving = walk * smoothstep(0.02, 0.2, abs(cos(uTime * 0.22 + ph)));
        float tilt = 1.25 * walk, gait = uTime * 6.0 + ph;
        if (part > 1.5) {
          float fore = part < 3.5 ? 1.0 : 0.0, sd = mod(part, 2.0) < 0.5 ? 1.0 : -1.0, a;
          if (part > 5.5) a = mix(0.5 + 0.2 * sin(uTime * 1.3 + ph), 1.3 + 0.3 * sin(uTime * 2.0 + ph), walk);
          else a = mix(fore > 0.5 ? (-0.55 - 0.7 * max(sin(uTime * 1.7 + ph) * sd, 0.0)) : -1.45, 0.6 * sin(gait + (sd * (fore * 2.0 - 1.0) > 0.0 ? 0.0 : 3.1416)) * moving, walk);
          vec3 d = rotX(p - pv, a); n = rotX(n, a);
          p = rotX(pv - c0, tilt) + c0 + d;
        } else {
          if (part > 0.5) {                       // the head turns to follow the herd going by
            vec2 toC = cameraPosition.xz - iA.xz + vec2(1e-3, 0.0);
            float look = clamp(sin(atan(toC.x, toC.y) - iA.w - (dirS < 0.0 ? 3.1416 : 0.0) * walk), -0.9, 0.9) * (1.0 - 0.7 * walk) + 0.25 * sin(uTime * 0.7 + ph * 3.0);
            p = rotY(p - pv, look) + pv; n = rotY(n, look);
            p = rotX(p - c0, tilt * 0.55) + c0 + vec3(0.0, 0.0, 0.12 * walk);
          } else p = rotX(p - c0, tilt) + c0;
          n = rotX(n, tilt * (part > 0.5 ? 0.55 : 1.0));
        }
        p.y += 0.15 * walk + 0.012 * sin(uTime * 2.0 + ph) + 0.03 * abs(sin(gait)) * moving;
        float yaw = iA.w + (dirS < 0.0 ? 3.1416 : 0.0) * walk;
        vec3 wp = iA.xyz + rotY(p * 1.6, yaw) + vec3(sin(iA.w), 0.0, cos(iA.w)) * iB.z * pace * walk;
        if (iB.w > 0.5) wp.y += (12.6 - 1.6 * (1.0 - (wp.x / 42.0) * (wp.x / 42.0))) - iA.y;      // those on the wire follow its sag
        vW = wp; vN = rotY(n, yaw); vC = color;
        vec4 mvPosition = viewMatrix * vec4(wp, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${F0}
      varying vec3 vW; varying vec3 vN; varying vec3 vC;
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN + vec3(0.0, 1e-5, 0.0)); vec3 V = normalize(cameraPosition - vW + vec3(0.0, 1e-5, 0.0)); if (dot(n, V) < 0.0) n = -n;
        float rim = pow(max(1.0 - dot(n, V), 0.0), 2.0);
        vec3 col = vC * (uAmbCol * (0.8 + 0.3 * n.y) + uSunCol * (max(dot(n, uSunDir), 0.0) * 0.85 + 0.15) * sunMask(vW)) + (uAmbCol * 0.3 + uSunCol * 0.12) * rim;
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),o0=new v.Mesh(Z,r0);return o0.frustumCulled=!1,o0.name="macaques",o0}const Es={shower:{title:"A Hundred Springs Later",el:26.1,zenith:"#4A78B4",horizon:"#C4D3DC",slate:"#55607C",cream:"#f4ead6",cloudK:.95,sunColor:"#FFE4B5",sunK:1.45,amb:"#8492b4",ambK:.95,lightI:3.6,hemiI:1.3,fogA:"#AEB9C6",fogB:"#8696c4",exposure:1.05,coverage:.5,laneK:.5},golden:{title:"After the Rain",el:8,zenith:"#3f5f94",horizon:"#f0c8a0",slate:"#4c5672",cream:"#ffc890",cloudK:.95,sunColor:"#FFA665",sunK:2.05,amb:"#77819f",ambK:1,shMin:.2,lightI:3.4,hemiI:1.25,fogA:"#d2b8a4",fogB:"#8e8cc2",exposure:1.05,coverage:.5,bed:.6,grid:.5},dawn:{title:"First Light",el:6,zenith:"#9fb0cc",horizon:"#f2d6c4",slate:"#b9b3bd",cream:"#fff1e4",cloudK:.9,sunColor:"#ffc4a0",sunK:1.5,amb:"#b6b6c4",ambK:.9,lightI:2.8,hemiI:1.6,fogA:"#e6d2c8",fogB:"#dcd8d6",exposure:1,coverage:.35,bed:.6,spark:.5,laneC:.2},night:{title:"Full Moon",el:38,zenith:"#0a1630",horizon:"#2a3f66",slate:"#101a34",cream:"#7f93c4",cloudK:.4,sunColor:"#AFC4EE",sunK:.85,amb:"#3d4c74",ambK:1.1,lightI:1.9,hemiI:2.6,fogA:"#1a2c54",fogB:"#1a2c54",exposure:1.3,coverage:.3,bed:.15,spark:.4,road:1,rimW:1,grid:1,fol:[.62,.88,1,.68]}};async function qa(r){if(!r)return null;await r.yield();const f=r.rng,C=r.vary||{},M=r.quality?.detail??1,P=C.density??1,R=C.mood??.5,W=C.hour||"any",H=f(),E=f(),a0=f(),l0=!!C.rare,t0=W==="golden"?"golden":W==="dawn"?"dawn":W==="night"?"night":W==="day"?"shower":H<.26?"golden":H<.42?"dawn":H<.5?"night":"shower",Z=t0==="golden",Y=t0==="dawn",_=t0==="night",r0=t0==="shower",o0=E<.6?"lilac":E<.8?"cream":"mixed",J=a0<.25,L=Es[t0],O=L.el*Math.PI/180,W0=Math.hypot(.23,.87),A0=L.laneK??0,P0=(e,t)=>1-A0*X(300,322,t)*(1-X(368,388,t)),Q={...L,portal:"#EFE6FF",fringe:o0==="cream"?"#efe3c6":o0==="mixed"?"#cdbbe0":"#B59AE0",petal:o0==="cream"?"#f4ecd8":"#d9c8f2",sunDir:new v.Vector3(-.23/W0*Math.cos(O),Math.sin(O),.87/W0*Math.cos(O)).normalize()},M0=e=>r0?X(.2,.55,e):Z?w0(.6,1,X(.2,.55,e)):0,I0=e=>r0?X(.19,.25,e)*(1-.7*X(.47,.56,e))*(1-.73*X(.56,.68,e))*(.75+.5*R):0,U0=e=>Math.min(.34,(r0?(.2+.06*X(.56,.7,e))*X(.21,.5,e):Z?.17+.05*X(.56,.7,e):0)*(l0?1.3:1)),H0=e=>r0?w0(w0(7e-4,.0019,X(.2,.3,e)),.0013,X(.5,.62,e)):Z?w0(8e-4,.0013,X(.1,.4,e)):Y?w0(.0044,.0048,X(.55,.8,e)):.0016,U=new v.Scene;await r.yield(),Ca(Ta.slice(0,4)),await r.yield();const s0=Ca(Ta);await r.yield();const Fa=await Is(r),ve=ws({rng:f,noiseTexture:Fa,preset:_?"night":"day",..._?{stars:.55,starDensity:.45}:{},zenith:Q.zenith,horizon:Q.horizon,..._?{bodyOverrides:{0:{elevation:38,azimuth:-165.2}}}:{sunElevation:L.el,sunAzimuth:-165.2,sunColor:Q.sunColor},lightColor:Q.sunColor,lightIntensity:Q.lightI,ambientColor:Q.amb,groundLight:_?"#2c3a4a":"#5E7350",ambientIntensity:Q.hemiI,clouds:{coverage:Q.coverage}});U.add(ve.object),await r.yield(),U.fog=new v.FogExp2(Q.fogA,H0(0));const co=ys(ve,{bounce:.55});U.add(co.object);const Ka=new v.Color(Q.fogA),Da=new v.Color(Q.fogB);await r.yield();let ho=null;const fo=Bs(),uo=xs({rng:{fork:e=>ho=f.fork(e)},sky:ve,count:7,altitude:620,size:[300,560],center:[150,0,-700],extent:[3400,3e3],wind:[.5,0,9],filter:(e,t,o,a)=>s0.nearestXZ(e,o).dist>a*.5,noiseTexture:fo});U.add(uo.object),await r.yield(),await _s(r,ho,fo),await r.yield();const h0=Ds(Q,{ring:{value:1}},!!r.quality?.mobile),I=e=>new v.Color(e),pt=(()=>{const e=Math.cos(m0.rot),t=Math.sin(m0.rot);return[Q.sunDir.x*e-Q.sunDir.z*t,Q.sunDir.y,Q.sunDir.x*t+Q.sunDir.z*e]})(),Ae=(e,t,o)=>{const a=lo(e,o);return P0(e,o)*Wa(a[0],t,a[1],pt)},pe=_?[.56,.62,.78]:Y?[.62,.64,.7]:[.36,.42,.56],Ue=(e,t,o)=>{const a=Ae(e,t,o);return[w0(pe[0],1,a),w0(pe[1],1,a),w0(pe[2],1,a)]},d0=I("#a39d90"),f0=I("#5d5c60"),B=I("#5c7a3c"),i0=I("#3E6B33"),y0=I("#7a4a30"),Ia=new v.Color(.012,.022,.024),Pe=e=>{if(_){const t=.3*e.r+.55*e.g+.15*e.b;e.setRGB(w0(t,e.r,.65)*.64,w0(t,e.g,.65)*.86,w0(t,e.b,.65))}return e};Pe(B),Pe(i0);const me=new Sa,z=new Sa,mt=[],vo=[],po=[],mo=[],G=(e,t,o,a,i,s)=>{const n=Math.hypot(t[0]-e[0],t[1]-e[1]),l=mt.length/3,c=.3+.7*s;mt.push(e[0],o,e[1],t[0],o,t[1],t[0],a,t[1],e[0],a,e[1]),vo.push(0,0,1,0,1,1,0,1);for(let d=0;d<4;d++)po.push(i,c,n,Math.abs(a-o));mo.push(l,l+1,l+2,l,l+2,l+3)},gt=[],Te=(e,t,o,a,i,s,n,l=0,c=0)=>gt.push([e,t,o,a,i,s,l,n.r,n.g,n.b,c]),x0=[I("#2e5628"),I("#3f6b2c"),I("#4c7630"),I("#55803a"),I("#38623a")],Re=[],_0=[],g0=(e,t,o,a,i,s,n,l=0,c=4)=>Re.push([e,t,o,a,i,s,l,n.r,n.g,n.b,c]),n0=e=>{const t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)},wt=d0.clone().multiplyScalar(.94),yt=B.clone().lerp(I("#7c9a48"),.4),go=d0.clone().lerp(f0,.22),wo=(e,t,o,a,i,s,n,l)=>{const c=(w,k)=>e===0?[t+o*k,w]:[w,t+o*k],d=(w,k,b,S,F,T,A,p)=>{const g=c((w+k)/2,b/2);z.box(g[0],g[1],1,0,e===0?b/2:(k-w)/2,e===0?(k-w)/2:b/2,S,F,T,A,p)},m=Math.ceil((a+1.5)/21.6),h=Math.floor((i-2.5)/21.6),y=Math.min(13,Math.floor((s-6)/4.2));for(let w=m-1;w<=h;w++){const k=w*21.6+.65;w>=m&&d(k-.65,k+.65,1.3,-1,s,go,B);const b=n0(l*7.3+w*3.1),S=(w*6+1+Math.floor(b*2.99))*3.6+.26,F=S+10.54;if(!(b<.2||S<a+1||F>i-1))for(let T=2;T<=y;T++){const A=n0(l*3.7+w*5.3+T*1.9),p=T*4.2+.04;if(!(A>.76))if(d(S,F,2.3,p,p+1.45,wt,yt,f0),A<.4){const g=S+(F-S)*.6*n0(l*1.3+T+w),x=Math.min(F,g+3+5*n0(l*2.1+T*3+w));G(c(g,2.36),c(x,2.36),p+1.2-2-4.5*n0(l+w+T*7.7),p+1.5,0,n)}else A<.56&&G(c(S+.6,1.2),c(F-.6,1.2),p+1.3,p+2.2+1.2*n0(l+T*5.1+w),1,n)}}},xt=[0,.26,.48,.68,.85,1];for(let e=0;e<Se.length;e++){const t=Se[e],o=t.side,a=t.h<60?1:5;if(a>1){const i=t.w?62:t.h*xt[1];wo(0,o*42,-o,t.z0,t.z1,i,o>0?.6:.15,e+1),wo(1,t.z1,1,o>0?42:-84,o>0?84:-42,i,1,e+21)}for(let i=0;i<a;i++){const s=t.h*(a===1?0:xt[i]),n=t.h*(a===1?1:xt[i+1]),l=42+i*(t.w?0:5),c=t.z0+i*3,d=t.z1-i*3;me.box(o*(l+112)/2,(c+d)/2,1,0,(112-l)/2,(d-c)/2,s-(i?0:2),n,d0,i0);const m=o*(l-.5),h=f.range(8,20)*Math.min(1.2,P),y=f.range(3.5,7);if(G([m,c],[m,d],n-h,n+.3,0,o>0?.55:.1),G([m,c],[m,d],n-.5,n+y,1,o>0?.7:.25),G([o*l,d+.5],[o*112,d+.5],n-h*.8,n+.3,0,1),G([o*l,d+.5],[o*112,d+.5],n-.5,n+y,1,1),i===0&&a>1){const k=f.range(10,18);G([m+o*.2,c],[m+o*.2,d],n*.5-k,n*.5,0,o>0?.5:.1)}const w=a===1?5:2;for(let k=0;k<w;k++){const b=f.range(3.5,6.5);Te(o*(l+f.range(2,9)),n+b*.8,f.range(c+5,d-5),b,b*f.range(.9,1.4),b,f.pick(x0),0,n>120?1:0)}}if(t.w){me.box(88,-45,1,0,24,35,228,375,d0,i0),G([63.5,-80],[63.5,-10],359,375.3,0,.55),G([64,-9.5],[112,-9.5],361,375.3,0,1);for(let i=0;i<7;i++){const s=f.range(4,7);Te(f.range(45,61),228+s*.8,-78+i*11+(i>2?9:0),s,s*1.2,s,f.pick(x0),0,1)}}await r.yield()}const u=e=>{const t=Math.sin(e*127.1+311.7)*43758.5453;return t-Math.floor(t)},Ba=I("#2f4f2c");for(let e=0;e<64;e++){const t=f.range(-1.35,1.35),o=f.range(760,2700),a=1250+(o-760)*.75,i=Math.abs(t-.2)<.8?Math.max(a,1680+500*u(e+140)):a,s=m0.x+Math.sin(t+.3)*i,n=m0.z-Math.cos(t+.3)*i,l=i>1650?30+80*u(e+90):0,c=f.range(22,48),d=Math.min(f.range(70,240)+(o>1500?80:0)+l,.105*i),m=c*f.range(.5,1),h=2+(u(e)>.45?1:0),y=Math.cos(t),w=Math.sin(t),k=(u(e+70)-.5)*c*.5;for(let b=0;b<h;b++){const S=1-b*(.2+.12*u(e*3+b)),F=b?d*(.45+.27*(b-1)+.08*u(e+b*9)):-2,T=b===h-1?d:d*(.45+.27*b+.08*u(e+(b+1)*9));me.box(s+y*k*b*.5,n+w*k*b*.5,y,w,c*S,m*S,F,T,d0,i0)}if(i<1900){const b=1-(h-1)*.26;Te(s+y*k*(h-1)*.5,d+3,n+w*k*(h-1)*.5,c*b*.9,9+8*u(e+31),m*b*.9,Ba,-t,1)}}for(let e=0;e<9;e++){const t=-1.2+e*.3+f.range(-.08,.08),o=1700+(f.range(1300,2300)-1300)*.75,a=m0.x+Math.sin(t+.3)*o,i=m0.z-Math.cos(t+.3)*o,s=f.range(380,620),n=f.range(110,200),l=f.range(300,480),c=Math.min(1,(o-1520)/Math.max(s,l)),d=s*c,m=l*c;Te(a,10,i,d,n,m,I("#2c4a30"),t,1);for(let h=0;h<4;h++){const y=.25+.17*h,w=t+.3+(u(e*7+h)-.5)*1.3,k=Math.min(d,m)*y,b=a-Math.sin(w)*k,S=i+Math.cos(w)*k,F=10+n*Math.sqrt(Math.max(0,1-y*y))-14;me.box(b,S,Math.cos(t),Math.sin(t),34+30*u(e*5+h),8,F-30,F+26+22*u(e*11+h),d0,i0)}}await r.yield();const yo=[[-112,-46,-62,60,142],[-198,-130,-70,56,186],[-296,-216,-58,62,128],[46,108,-64,60,150],[126,198,-56,60,118],[216,296,-72,56,204],[-178,-112,-190,50,236],[108,166,-184,50,226]],qe=Math.cos(m0.rot),Fe=-Math.sin(m0.rot),xo=[0,.3,.56,.8,1],bo=[I("#587c2f"),I("#6c8a36"),I("#7d9340"),I("#4d742e")].map(Pe),bt=I("#6a5c4c"),ko=new v.Color(.05,.07,.065);for(let e=0;e<yo.length;e++){const[t,o,a,i,s]=yo[e];h0.water.uniforms.uRank.value[e].set(t,o,a,s);for(let n=0;n<4;n++){const l=n?s*xo[n]:-2,c=s*xo[n+1],d=(t+o)/2,m=(o-t)/2-n*3,h=i/2-n*4,y=a-n*8,w=y-h,k=e<6?n<2?2:n===2?1:0:0,b=[];for(let x=0;x<k;x++)b.push(d-m+2*m*(x+1)/(k+1)+(u(e*6.3+x*2.9+(n===2?7:0))-.5)*7);for(let x=0,N=d-m;x<=k;x++){const $=x<k?b[x]-3.25:d+m,V=D((N+$)/2,0,w);me.box(V[0],V[2],qe,Fe,($-N)/2,h,l,c,d0,i0),N=$+6.5}for(let x=0;x<k;x++){const N=b[x],$=y-7,V=Math.max(l,0);z.quad(D(N-3.3,V,$),D(N+3.3,V,$),D(N+3.3,c,$),D(N-3.3,c,$),ko,ko);for(let q=1,j=Math.floor((c-V)/4.2);q<j;q++){const v0=u(e*9.7+n*4.1+x*2.3+q*1.7);if(v0>.58)continue;const R0=D(N,0,y-1.25),q0=V+q*4.2;if(z.box(R0[0],R0[2],qe,Fe,3.3,1.2,q0,q0+1.3,wt,yt,f0),v0<.2){const D0=D(N-3+3*v0*5,0,y+.05),oe=D(N+.4+3*v0*5*.8,0,y+.05);G([D0[0],D0[2]],[oe[0],oe[2]],q0-3-5*u(e+q*3.3+x),q0+1.4,0,.85)}}const b0=Math.min(c-V-2,10+18*u(e*3.1+n*7.7+x)),u0=D(N-3.2,0,y-3.5),K=D(N+3.2,0,y-3.5);G([u0[0],u0[2]],[K[0],K[2]],c-b0,c+.3,0,.7)}const S=(x,N)=>b.some($=>N>$-3.6&&x<$+3.6),F=y+.5,T=D(d-m,0,F),A=D(d+m,0,F),p=(9+12*u(e*7.1+n))*Math.min(1.2,P),g=3.5+3.5*u(e*3.3+n*5);if(G([T[0],T[2]],[A[0],A[2]],c-p,c+.3,0,.9),G([T[0],T[2]],[A[0],A[2]],c-.5,c+g,1,1),n<2&&e<6){const x=Math.max(l,0),N=Math.min(12,Math.floor((c-x-6)/4.2));for(let $=d-m+3,V=0;$<d+m-2;$+=20.4,V++){if(!S($-.7,$+.7)){const K=D($,0,y+.65);z.box(K[0],K[2],qe,Fe,.65,.65,x-1,c,go,B)}const b0=u(e*7.3+V*3.1+n*1.3),u0=$+2.4+4.08*Math.floor(b0*1.99);if(!(b0<.18||u0+10.6>d+m-1||S(u0,u0+10.6)))for(let K=2;K<=N;K++){const q=u(e*3.7+V*5.3+K*1.9+n*2.3),j=x+K*4.2+.04,v0=D(u0+5.3,0,y+1.15);if(q>(n?.6:.74))continue;z.box(v0[0],v0[2],qe,Fe,5.3,1.15,j,j+1.45,wt,yt,f0);const R0=u0+6*u(e*1.3+K+V),q0=Math.min(u0+10.6,R0+3+5*u(e*2.1+K*3+V)),D0=D(R0,0,y+2.36),oe=D(q0,0,y+2.36);if(q<.4)G([D0[0],D0[2]],[oe[0],oe[2]],j+1.2-2-4.5*u(e+V+K*7.7),j+1.5,0,.85);else if(q<.56){const de=D(u0+.6,0,y+1.2),za=D(u0+10,0,y+1.2);G([de[0],de[2]],[za[0],za[2]],j+1.3,j+2.2+1.2*u(e+K*5.1+V),1,.9)}}}}if(n===0)for(let x=0;x<3;x++){const N=.04+.3*x+.1*u(e*5.7+x),$=N+.14+.12*u(e*2.9+x),V=c*(.42+.3*u(e*9.3+x)),b0=D(d-m+2*m*N,0,F),u0=D(d-m+2*m*Math.min($,.98),0,F);G([b0[0],b0[2]],[u0[0],u0[2]],Math.max(V-10-14*u(e*4.1+x),1),V,0,.85)}for(let x=0;x<3;x++){const N=4+3*u(e*11+n*3+x),$=D(d-m+4+(2*m-8)*u(e*13+n*7+x),0,y-3-3*u(e+n+x*3));n<2&&e<6?g0($[0],c+N*.7,$[2],N,N*(.8+.4*u(e*17+x+n)),N,bo[(e+n+x)%4],u(e+x)*e0,6):Te($[0],c+N*.75,$[2],N,N*(.9+.5*u(e*17+x+n)),N,x0[(e+n+x)%5],0,1)}}await r.yield()}for(const e of[-1,1]){const t=D(e*172,0,-53);z.box(t[0],t[2],qe,Fe,128,4.5,-1.2,.5,f0,B);for(let o=0;o<9;o++){const a=D(e*(53+o*27+9*u(o*3.1+e)),0,-52.5+2*u(o*7.7+e)),i=.85+.5*u(o*5.3+e*2),s=5.2*i,n=10*i;z.prism(a[0],a[2],1,0,.5*i,.5*i,.4,n*.85,bt,bt.clone().multiplyScalar(.8),6);for(let l=0;l<4;l++){const c=(l+u(o*9.1+l+e))/3*e0,d=l===3?0:s*.52;g0(a[0]+Math.cos(c)*d,n+(l===3?.36*s:(u(o+l*3.7+e)-.5)*.3*s),a[2]+Math.sin(c)*d,s*.64,s*.46,s*.64,bo[(o+l)%4],c,6)}}for(let o=0,a=46;a<296;o++){const i=3+5*u(o*2.7+e*3),s=D(e*a,0,-48.4),n=D(e*(a+i),0,-48.4);u(o*6.1+e)>.2&&G([s[0],s[2]],[n[0],n[2]],-.12,.7+.8*u(o*4.3+e),2,.85),a+=i+1.5*u(o*8.9+e)}}for(let e=0;e<9;e++){const t=261+e*7.1+2.5*u(e*3.7+90),o=3+3*u(e*5.1+91),a=(3+e*3%5)*4.2+1.6,i=6+8*u(e*7.3+92);G([-40.6,t],[-40.6,Math.min(t+o,326)],Math.max(a-i,1.2),a,0,.4)}await r.yield();const c0={x:800,z:-1690,ux:.94,uz:.34,deck:46,top:190},kt=[],Mo=[],zo=[];{const e=I("#a39d90").multiplyScalar(3),t=I("#77736c").multiplyScalar(3),o=(a,i,s)=>[c0.x+c0.ux*a-c0.uz*i,s,c0.z+c0.uz*a+c0.ux*i];z.box(c0.x,c0.z,c0.ux,c0.uz,620,13,c0.deck-5,c0.deck,t,i0,t);for(const a of[-580,-470,470,580])z.box(o(a,0,0)[0],o(a,0,0)[2],c0.ux,c0.uz,5,10,-2,c0.deck-5,e,e);for(const a of[-270,270]){for(const s of[-16,16]){const n=o(a,s,0);z.box(n[0],n[2],c0.ux,c0.uz,6,5,-2,c0.top,e,i0)}const i=o(a,0,0);z.box(i[0],i[2],c0.ux,c0.uz,5,20,c0.top-22,c0.top-8,e,i0),z.box(i[0],i[2],c0.ux,c0.uz,5,20,c0.deck+40,c0.deck+50,e,i0);for(const s of[-1,1]){const n=kt.length/3,l=o(a,0,c0.top-10),c=o(a+s*8,0,c0.deck),d=o(a+s*186,0,c0.deck);kt.push(...l,...c,...d),Mo.push(0,0,0,1,1,1),zo.push(n,n+1,n+2)}}for(let a=0;a<16;a++){const i=-600+a*75+20*u(a+200),s=i+40+30*u(a+300),n=o(i,13.3,0),l=o(s,13.3,0),c=14+26*u(a+400);G([n[0],n[2]],[l[0],l[2]],c0.deck-c,c0.deck+.5,0,.6)}}await r.yield(),z.box(36,345,1,0,6,355,-1.2,.16,f0,B),z.box(-36,478,1,0,6,221,-1.2,.16,f0,B),z.box(-150,100,1,0,108,160,-1.5,.7,i0,I("#55803a")),z.box(-78,392,1,0,35,65,-1,5,f0,i0);for(let e=0;e<440;e++){const t=-43.5-78*Math.pow(u(e*1.37+3e3),1.6),o=-56+312*u(e*2.11+3100);if(r.noise.n2(t*.045,o*.045)<-.18)continue;const a=u(e*3.3+3200)*Math.PI,i=1.6+2.6*u(e*5.7+3300),s=Math.cos(a)*i/2,n=Math.sin(a)*i/2;G([t-s,o-n],[t+s,o+n],.64,1.3+1.1*u(e*7.1+3400),3,.9)}for(let e=-58,t=0;e<256;t++){const o=1.8+3.4*u(t*2.7+3500);u(t*6.1+3600)>.25&&G([-41.85,e],[-41.85,Math.min(e+o,258)],.2,1.1+.9*u(t*4.3+3700),2,.8),e+=o+1.2*u(t*8.9+3800)}await r.yield();for(let e=0;e<46;e++){const t=-45-74*n0(e*3.1+4100),o=-50+300*n0(e*7.7+4200);if(r.noise.n2(t*.05,o*.05)<-.15)continue;const a=1.2+2.2*n0(e*5.3+4300);g0(t,.55,o,a,.5+.35*a*n0(e+4400),a*(.8+.5*n0(e*2.1+4500)),x0[e%5],n0(e*9.1)*e0)}z.beam([-50,25.3,256],[-50,25.3,8],1.6,3.3,d0,B);for(let e=0;e<9;e++){const t=252-e*27-6*u(e+500),o=t-13-9*u(e+510),a=4+5*u(e+520);G([-48.3,Math.max(o,10)],[-48.3,t],25.3-a,25.5,0,.3),G([-51.7,Math.max(o,10)-3],[-51.7,t-5],25.3-a*.8,25.5,0,.8),e%2===0&&G([-50,Math.max(o,10)],[-50,t],25.1,25.3+1.6+1.4*u(e+530),1,.6)}for(let e=240;e>=0;e-=40)z.prism(-50,e,1,0,1.6,2.2,0,20.5,i0,d0,12),z.box(-50,e,1,0,4.2,1.6,20.5,22,d0,B);z.beam([-46,25.3,8],[-2,16.3,-18],1.6,3.3,d0,B),z.beam([-2,16.3,-18],[38,1.2,-40],1.6,3.3,d0,B);for(const[e,t,o,a]of[[[-46,25.3,8],[-2,16.3,-18],1,900],[[-2,16.3,-18],[38,1.2,-40],0,1300]]){const i=t[0]-e[0],s=t[2]-e[2],n=Math.hypot(i,s),l=-s/n,c=i/n,d=Math.round(n/3.1);for(let m=0;m<d;m++){const h=m/d,y=(m+1)/d,w=e[1]+(t[1]-e[1])*h,k=e[1]+(t[1]-e[1])*y,b=(w+k)/2,S=e[0]+i*h,F=e[2]+s*h,T=e[0]+i*y,A=e[2]+s*y,p=s0.nearestXZ((S+T)/2,(F+A)/2),g=p.dist<14?p.y:-5;for(const x of[-1,1]){const N=n0(a+m*3.7+x*11),$=n0(a+m*5.9+x*17),V=l*x*1.63,b0=c*x*1.63;if(N>.3){const u0=N>.78?y0.clone().lerp(d0,.62):N>.55?i0.clone().lerp(d0,.6):f0.clone().lerp(d0,.55+.9*(N-.3)),K=.04;z.quad([S+i/d*K+V,w-.2,F+s/d*K+b0],[T-i/d*K+V,k-.2,A-s/d*K+b0],[T-i/d*K+V,k-3.1,A-s/d*K+b0],[S+i/d*K+V,w-3.1,F+s/d*K+b0],u0,u0.clone().multiplyScalar(.62))}if($<.8){const u0=Math.min(1.6+5.8*n0(a+m*4.1+x*3),b-Math.max(g+3.5,.4));u0>.8&&G([S+l*x*1.7,F+c*x*1.7],[T+l*x*1.7,A+c*x*1.7],b-u0,b+.25,0,x>0?.75:.4)}}if(o){const x=n0(a+m*7.3+5);x>.4&&G([S,F],[T,A],b-.15,b+.8+1.3*n0(a+m*2.9),1,.7),x>.72&&g0((S+T)/2,b+.25,(F+A)/2,2.1,1+.5*x,1.8,x0[m%5],x*e0)}}}for(let e=0;e<9;e++){const t=21.5+e*2.9,o=t+2.2+.6*n0(e+1700),a=n0(e*3.3+1710);a>.25&&G([-4.1,t],[-4.1,o],8.1,8.9+1*n0(e+1720),1,.7),a<.7&&G([-4.25,t],[-4.25,o],8.3-1-1.9*n0(e+1730),8.4,0,.5),a>.5&&G([6,t],[6,o],9.5,10.2+.9*n0(e+1740),1,.8),e%3===1&&g0(-1.2+2.4*a,9+.3*a,(t+o)/2,1.9,.8,2.3,x0[e%5],a*e0),G([-2.35,t-.4],[-2.35,o],-.1,.5+.9*n0(e+1750),e%2?2:3,.8),e%2===0&&g0(-2.75,.1,(t+o)/2,1,.55+.3*a,1.5,x0[(e+2)%5],a*e0)}for(let e=0;e<7;e++){const t=(e+.2*u(e+700))/7*e0,o=t+.5+.3*u(e+710),a=[-2+Math.cos(t)*2,-18+Math.sin(t)*2.6],i=[-2+Math.cos(o)*2,-18+Math.sin(o)*2.6];G(a,i,-.12,.5+.7*u(e+720),2,.8),(e%2===0||a[0]<-2)&&G([-2+Math.cos(t)*1.98,-18+Math.sin(t)*2.58],[-2+Math.cos(o)*1.98,-18+Math.sin(o)*2.58],5.3,6.1+.8*u(e+730),1,.8),(e%2===1||a[0]<-2.5)&&G([-2+Math.cos(t)*1.72,-18+Math.sin(t)*2.3],[-2+Math.cos(o)*1.72,-18+Math.sin(o)*2.3],10-4.5*u(e+740),13.2,0,.75)}const _a=I("#7d8f72"),ja=I("#4f7a34");for(const[e,t]of[[[7,18.1,-22.9],[20,13.2,-30.1]],[[21,12.8,-30.6],[35.5,6.4,-38.6]]]){const o=t[0]-e[0],a=t[2]-e[2],i=Math.hypot(o,a),s=-a/i*1.56,n=o/i*1.56;z.beam(e,t,1.5,3.2,_a,ja);for(let l=0;l<5;l++)for(const c of[-1,1]){const d=.08+l*.18,m=d+.13,h=(y,w)=>[e[0]+o*y+s*c,e[1]+(t[1]-e[1])*y-w,e[2]+a*y+n*c];z.quad(h(d,.7),h(m,.7),h(m,1.8),h(d,1.8),Ia)}}const Na=[I("#4a5240"),I("#525a46")],Ve=[I("#62685a"),I("#596052")],Ga=[I("#4c5548"),I("#454e43")],Co=(e,t)=>{for(const[o,a,i,s]of e){const n=Math.max(1,Math.round(Math.hypot(i-o,s-a)/4.2));for(let l=0;l<n;l++){const c=o+(i-o)*l/n,d=a+(s-a)*l/n,m=o+(i-o)*(l+1)/n,h=a+(s-a)*(l+1)/n,y=l%2;z.quad([c,0,d],[m,0,h],[m,-1.2,h],[c,-1.2,d],Na[y],Ve[y]),z.quad([c,-1.2,d],[m,-1.2,h],[m,-5,h],[c,-5,d],Ve[y],Ve[y]),z.quad([c,-5,d],[m,-5,h],[m,t,h],[c,t,d],Ve[y],Ga[y])}}};Co([[-32,48,-2,48],[14,48,18,48],[-32,62,18,62],[-32,48,-32,62],[18,48,18,62]],-12),Co([[-2,20,14,20],[-2,20,-2,48],[14,20,14,48]],-12.5);const Ke=(e,t,o,a)=>{for(let i=e,s=0;i<t-.5;s++){const n=Math.min(t-i,2.2+3.2*u(o*3+s*7+a)),l=.55+.6*u(o+s*13+a);u(o*5+s*11+a)>.15&&G([i,o],[i+n,o],-.12,l,2,.75),i+=n+.5*u(s+a)}};Ke(-32,18,62,0),Ke(-32,18,62.5,40),Ke(-32,-2,48,0),Ke(-32,-2,47.5,40),Ke(14,18,48,0);const Ee=(e,t,o)=>{const a=Math.hypot(t[0]-e[0],t[1]-e[1]);for(let i=0,s=0;i<a-.8;s++){const n=Math.min(a-i,1.6+3*u(o+s*7)),l=c=>[e[0]+(t[0]-e[0])*c/a,e[1]+(t[1]-e[1])*c/a];u(o+s*11)>.3&&G(l(i),l(i+n),-.7-1.7*u(o+s*13),.06,0,.75),i+=n+1.2*u(o+s*3)}};Ee([-32,48.07],[-2,48.07],100),Ee([14,48.07],[18,48.07],140),Ee([-31.93,48],[-31.93,62],180),Ee([17.93,48],[17.93,62],220);for(let e=0;e<3;e++)for(let t=0;t<30;t++){const o=20+t*28/30,a=-(t+1)*.4,i=n0(t*3.1+e*7.7+40);z.box(.85+e*5.15,o+.467,1,0,2.15,.467,a-.7,a,(t+e)%2?I("#383c36"):I("#40443c"),i>.66?i0.clone().lerp(f0,.3):i>.4?I("#4c5044"):I("#565a50"))}for(const e of[-1.75,3.42,8.58,13.75])z.beam([e,1,20],[e,-11,48],.13,1.1,y0,I("#5a3a28")),z.beam([e,1.25,20],[e,-10.75,48],.2,.22,I("#3a3028"));for(const e of[-1.75,3.42,8.58,13.75])g0(e,.6,20.9,.7,.75+.2*n0(e+3),1.5,x0[Math.abs(Math.round(e))%5],0),g0(e+.3-.6*n0(e+5),.3,19.5,.95,.5,.9,x0[Math.abs(Math.round(e)+2)%5],0),G([e-.9,19.7],[e+.9,19.7],-.12,.8+.5*n0(e+7),2,.8);for(let e=0;e<11;e++){const t=22+e*2.5;z.beam([-4,8.2,t],[6,9.6,t],.16,.4,y0,B),z.beam([6,9.6,t],[16,8.2,t],.16,.4,y0,B)}for(let e=0;e<10;e++)for(const t of[0,1]){if((e*7+t*3)%5<2)continue;const o=22+e*2.5+.2,a=o+2.1,i=t?6:-4,s=t?16:6,n=t?9.62:8.22,l=t?8.22:9.62;z.quad([i,n,o],[s,l,o],[s,l,a],[i,n,a],e%2?I("#6d5a44"):I("#7a6248"),I("#5f7a40"))}for(const e of[-4,16])for(const t of[22,47])ue(z,[e,0,t],[e,8.2,t],.2,y0,B);const So=f0.clone().lerp(B,.5),Wo=B.clone().lerp(I("#7c9a48"),.5);dt.forEach((e,t)=>{const o=t?-9:6,a=10.9-.3*t;ue(z,[-33,0,e],[-33.6,11,e],.35,f0,B),ue(z,[33,0,e],[33.4,11,e],.35,f0,B),z.beam([-34,11.8,e],[o,a,e],.5,1.1,So,Wo),z.beam([o,a,e+.15],[34,11.4-.5*t,e+.15],.5,1.1,So,Wo);for(let i=0;i<4;i++){const s=-27+i*17+6*u(t*9+i+600),n=(s+34)/68;g0(s,11.2-.5*Math.sin(n*Math.PI),e,1.1+.5*u(i+610),.55,2.2+1.4*u(t+i+620),x0[(i+t)%5],Math.PI/2)}for(let i=0;i<6;i++){const s=-32+i*11+3*u(t*5+i+630),n=s+5+4*u(i+640);G([s,e],[Math.min(n,33),e],11,11.9+.7*u(t+i+650),1,.9)}});const j0=[],$0=[],Mt=[],ie=[],zt=[],Ao=[],Po=[],To=[],Ro=[];for(let e=0;e<6;e++){const t=Math.PI*(.55+.25*e)+.2*u(e+750);$0.push({x:-2+Math.cos(t)*1.82,y:5.45,z:-18+Math.sin(t)*2.4,s:1.1+.8*u(e+760),rot:u(e+770)*e0,v:e%2,d:0,u:0})}j0.push([[-3.9,9.5,-18.6],[-2.6,4.2,-20.5]],[[-3.2,12.4,-16.4],[-3.95,7.5,-17.6]]);for(const e of dt)for(let t=0;t<4;t++)j0.push([[-32+t*16,10.6,e-.7],[-16+t*16,10.5,e-.7]]);for(let e=0;e<18;e++){const t=e%2?1:-1,o=660-e*38,a=f.range(-1.6,1.6);t<0&&o<257||(ue(z,[t*30.6,0,o],[t*30.6+a,10.5,o+a*.5],.17,f0,B),Ao.push([t*30.6,o,a]),z.beam([t*30.6+a,10.6,o+a*.5],[t*27.4+a,10.2,o+a*.5],.14,.2,B),j0.push([[t*30.6+a,10.4,o+a*.5],[t*30.6+a*.3+t*.4,3.4,o+1.2]]),j0.push([[t*27.4+a,10.1,o+a*.5],[t*30.6+a,10.4,o+a*.5]]))}[[1,528],[1,414],[1,338],[1,262],[1,204],[1,128],[-1,546],[-1,394],[-1,318]].forEach(([e,t],o)=>{const a=e*29.7,i=(u(o*3.7+900)-.5)*1.5,s=[a+i*.5,8.7,t+i],n=[a-e*5.8+i*.5,8.2+.5*u(o+910),t+i*.8];ue(z,[a,-.4,t],s,.2,f0,B),z.beam([s[0]+e*.2,s[1]-.15,s[2]],n,.13,.28,B,i0);for(const l of[.52,.9]){const c=s[0]+(n[0]-s[0])*l,d=s[1]+(n[1]-s[1])*l-.4,m=s[2]+(n[2]-s[2])*l;{const h=u(c*3.1+m*1.7);z.box(c,m,1,0,.27,.2,d-1.45,d,y0.clone().lerp(i0,.25+.5*h),i0,y0.clone().multiplyScalar(.6))}z.box(c,m+.3,1,0,.3,.14,d-.08,d+.02,i0,B),z.box(c,m,1,0,.05,.05,d,d+.42,f0,f0)}g0(s[0]-e*.5,8.75,s[2],.95,.6,.8,x0[o%5],0),G([s[0]-e*.9,s[2]+.05],[s[0]-e*(2.6+1.2*u(o+920)),(s[2]+n[2])/2+.05],8.1-1.3-1.6*u(o+930),8.2,0,.75),zt.push([[s[0],8.5,s[2]],[a+e*.35,1,t+.9]],[[s[0],6.4,s[2]-.2],[a-e*.3,.6,t-.8]],[[n[0],n[1]-.15,n[2]],[s[0],s[1]-.2,s[2]]]),To.push([[a,0,t],s,n])});for(let e=0;e<3;e++)zt.push([[-30+e*21,11.4,330],[-12+e*21,11.3,330]]);[[1,500],[1,376],[1,300],[1,186],[1,104],[-1,470],[-1,330]].forEach(([e,t],o)=>{const a=e*31.3,i=e*33.3,s=6.4,n=(u(o*5.1+940)-.5)*.5,l=2.8,c=o%2?1:-1;for(const d of[-s/2,0,s/2])ue(z,[a,.1,t+d],[a+n,l-.28,t+d+n*.4],.07,y0,B),ue(z,[i,.1,t+d],[i+n,l,t+d+n*.4],.07,y0,B);z.beam([a+n,l-.28,t-s/2-.4],[a+n,l-.28,t+s/2+.4],.06,.12,y0,B),z.beam([i+n,l,t-s/2-.4],[i+n,l,t+s/2+.4],.06,.12,y0,B);for(let d=0;d<6;d++){const m=t-s/2+d*s/5+n*.4;z.beam([a+n-e*.5,l-.36,m],[i+n+e*.2,l+.03,m],.04,.08,y0,B)}z.beam([i,1.15,t-s/2],[i,1.15,t+s/2],.04,.08,y0,y0),z.beam([i-e*.5,.66,t-s/2+.7],[i-e*.5,.66,t+s/2-.7],.18,.08,f0,B),g0(i+n-e*.5,l,t+c*s*.3,1.6,.6,1.9,x0[(o+2)%5],0),G([a+n,t+c*s*.3-1.5],[a+n,t+c*s*.3+1.5],l-1.4-.7*u(o+950),l-.2,0,.75),Ro.push([e,t,n])});for(const e of[300,250])for(let t=0;t<3;t++)j0.push([[-30+t*21,11.4,e],[-12+t*21,11.3,e]]);for(let e=0;e<5;e++){const t=.1+e*.17,o=t+.14;j0.push([[-46+44*t,22-9*t-.2,8-26*t],[-46+44*o,22-9*o-.2,8-26*o]])}for(const[e,t]of[[-38,-25.5],[-22.5,-12.5],[12.5,22.5],[25.5,38]])j0.push([D(e,13.7,14),D(t,13.7,14)]);const qo=e=>{const t=(e+300)/600,o=1-t;return-10*o*o+110*t*o+240*t*t};for(const[e,t]of[[-34,-18],[14,30]])j0.push([D(e,20.95,qo(e)),D(t,20.95,qo(t))]);await r.yield();{const e={};for(const t of[4,2,1,0]){const o=Ws[t],a=o.y+2.4,i=o.w/2,s=t===4||t===2,n=s?64:48;for(let l=.36,c=0;l<.64;c++){io(o,l,e);const d=Math.min(l+(2.4+3.4*u(t*71+c*3.1))/610,.64),m=e.x,h=e.z,y=Math.abs(e.x-Aa(e.z));if(io(o,d,e),y<n)for(const w of[-1,1]){const k=g=>[D(m+e.nx*g,0,h+e.nz*g),D(e.x+e.nx*g,0,e.z+e.nz*g)],[b,S]=k(w*(i-.74)),F=Ae(b[0],a+1,b[2])*(w<0?1:.35),T=u(t*13+c*7.7+w);T>.1&&G([b[0],b[2]],[S[0],S[2]],a+1.5-(.9+.75*T),a+1.66,0,F*.45);const[A,p]=k(w*(i-.25));u(t*29+c*5.3+w)>.25&&G([A[0],A[2]],[p[0],p[2]],a+1.35,a+1.9+.9*u(t*31+c+w),1,F)}l=d+(.6+1.6*u(t*37+c))/610}for(let l=0,c=t===4?320:t===2?280:90;l<c;l++){io(o,.5+(u(t*101+l*1.37)-.5)*(s?.2:.16),e);const d=(u(t*103+l*2.11)-.5)*2*(i-1.3),m=e.x+e.nx*d,h=e.z+e.nz*d;if(l%4||r.noise.n2(m*.07+t*9,h*.07)<-.25&&Math.abs(d)<i-3.2)continue;const y=u(l*3.3+t)*Math.PI,w=1.1+1.7*u(l*5.7+t*3),k=Math.cos(y)*w/2,b=Math.sin(y)*w/2,S=D(m-k,0,h-b),F=D(m+k,0,h+b);G([S[0],S[2]],[F[0],F[2]],a-.06,a+.5+.7*u(l*7.1+t*5),3,Ae(S[0],a+.6,S[2]))}await r.yield()}}const Ct=[I("#7f7a68"),I("#6c7676"),I("#7a6c5c")],ge=Pe(I("#4f7a34")),St=new v.Color(.055,.1,.06),Wt=new v.Color(.11,.19,.1),ae=[I("#4f7a34"),I("#5a8338"),I("#466f30"),I("#3f6b2c"),I("#52792f")],At=[[12,452,.05],[-23,405,-.08],[-27,372,.12],[14,275,.9],[25,160,-.1],[-30,120,.2]];for(let e=0;e<At.length;e++){const[t,o,a]=At[e],i=Math.cos(a),s=-Math.sin(a),n=-s,l=i,c=(e%2?-1:1)*(.055+.05*u(e*53+7)),d=Math.cos(c),m=Math.sin(c),h=(p,g,x)=>{const N=p*d-x*m;return[t+i*N+n*g,p*m+x*d-.3,o+s*N+l*g]},y=Ct[e%3].clone().multiplyScalar(.5).lerp(i0,.62).lerp(y0,.1),w=y0.clone().lerp(i0,.6).multiplyScalar(.7),k=f0.clone().lerp(i0,.4).multiplyScalar(.7),b=f0.clone().lerp(y,.5).multiplyScalar(.8),S=y.clone().lerp(ge,.35),F=p=>[[-4.6+2.2*(u(e*61+p)-.5),1.9+.5*u(e*71+p),2.5,2.1],[3.9+2.2*(u(e*67+p)-.5),2.3+.5*u(e*73+p),1.75,2.7],[-.4+1.6*(u(e*101+p)-.5),1.7+.4*u(e*103+p),1.3,1.9]],T=(p,g)=>{z.quad(h(p[0],p[1],-.6),h(g[0],g[1],-.6),h(g[0],g[1],1.25),h(p[0],p[1],1.25),k,w),z.quad(h(p[0],p[1],1.25),h(g[0],g[1],1.25),h(g[0],g[1],2.1),h(p[0],p[1],2.1),w,y),z.quad(h(p[0],p[1],2.1),h(g[0],g[1],2.1),h(g[0],g[1],4.4),h(p[0],p[1],4.4),y,S)};for(const p of[-1,1]){const g=p*1.9,x=p*1.75,N=F(p),$=K=>N.some(q=>Math.abs(K-q[0])<q[1]*.8);for(let K=0;K<9;K++){const q=-7.9+K*15.8/9,j=q+15.8/9,v0=u(e*31+K*5+p),R0=u(e*43+K*9+p),q0=w.clone().lerp(v0>.5?y0:i0,.5*R0).multiplyScalar(.55+.6*v0),D0=y.clone().lerp(q0,.5);z.quad(h(g,q,-.6),h(g,j,-.6),h(g,j,1.25),h(g,q,1.25),k,q0),z.quad(h(g,q,1.25),h(g,j,1.25),h(g,j,2.1),h(g,q,2.1),q0,D0)}z.quad(h(g,-7.9,3.5),h(g,7.9,3.5),h(g,7.9,4.4),h(g,-7.9,4.4),y,S);let V=-7.9;for(let K=0;K<7;K++){const q=-7.6+K*2.2,j=q+1.75;if(z.quad(h(g,V,2.1),h(g,q,2.1),h(g,q,3.5),h(g,V,3.5),y),V=j,z.quad(h(x,q,2.1),h(x,j,2.1),h(x,j,3.5),h(x,q,3.5),Wt,St),z.quad(h(g,q,2.1),h(g,j,2.1),h(x,j,2.1),h(x,q,2.1),b),z.quad(h(g,q,3.5),h(g,j,3.5),h(x,j,3.5),h(x,q,3.5),b),z.quad(h(g,q,2.1),h(x,q,2.1),h(x,q,3.5),h(g,q,3.5),b),z.quad(h(g,j,2.1),h(x,j,2.1),h(x,j,3.5),h(g,j,3.5),b),u(e*13+K*3+p)>.4&&!$((q+j)/2)){const v0=h(p*1.82,(q+j)/2,2.12);$0.push({x:v0[0],y:v0[1],z:v0[2],s:.75+.4*u(e+K*7+p),rot:u(e*5+K)*e0,v:K%2,d:0,u:0})}}z.quad(h(g,V,2.1),h(g,7.9,2.1),h(g,7.9,3.5),h(g,V,3.5),y);for(const K of[-1,1])T([g,K*7.9],[p*1.25,K*9]);N.forEach((K,q)=>{const j=h(p*1.95,K[0],K[2]);g0(j[0],j[1],j[2],1.05+.25*u(e*79+p+q),K[3],K[1],ae[(e+q+(p>0?2:0))%5],a)});for(let K=0;K<2;K++){const q=N[K],j=h(p*2.2,q[0]-q[1]*.75,2.2),v0=h(p*2.2,Math.min(q[0]+q[1]*.75,7.8),2.2),R0=K?-.3:1.2-.9*u(e*23+p);G([j[0],j[2]],[v0[0],v0[2]],R0,j[1]+.9,0,.75)}{const K=-1.6+2.2*u(e*37+p),q=h(p*2.15,K,3.6),j=h(p*2.15,K+2.4,3.6);G([q[0],q[2]],[j[0],j[2]],q[1]-1.2-1.2*u(e*41+p),q[1]+.7,0,.75)}const b0=-7.4+3*u(e*3+p),u0=b0+6.5+3*u(e*7+p);j0.push([h(p*2.05,b0,4.3),h(p*2.05,Math.min(u0,7.8),4.2)])}for(const p of[-1,1]){const g=p*9;z.quad(h(-1.25,g,-.6),h(1.25,g,-.6),h(1.25,g,1.25),h(-1.25,g,1.25),k,w),z.quad(h(-1.25,g,1.25),h(1.25,g,1.25),h(1.25,g,1.9),h(-1.25,g,1.9),w,y),z.quad(h(-1.25,g,1.9),h(1.25,g,1.9),h(1.25,g,3.6),h(-1.25,g,3.6),Wt,St),z.quad(h(-1.25,g,3.6),h(1.25,g,3.6),h(1.25,g,4.4),h(-1.25,g,4.4),y,S),z.quad(h(-1.9,p*7.9,4.4),h(1.9,p*7.9,4.4),h(1.25,g,4.4),h(-1.25,g,4.4),i0)}z.quad(h(-1.9,-7.9,4.4),h(1.9,-7.9,4.4),h(1.9,7.9,4.4),h(-1.9,7.9,4.4),i0),[[-5.5,2.6,1.5,4.2],[0,2.4,1.3,3.6],[5.5,2.5,1.6,4]].forEach(([p,g,x,N],$)=>{const V=h((u(e*83+$)-.5)*.7,p+(u(e*89+$)-.5)*1.2,4.1);g0(V[0],V[1],V[2],g,x*(.9+.3*u(e*97+$)),N,ae[(e*2+$)%5],a)});for(let p=0;p<2;p++){const g=h(.2,-7.2+p*7.6+1.2*u(e*17+p),5.1),x=h(-.2,-2.4+p*7.6+1.6*u(e*19+p),5.1);G([g[0],g[2]],[x[0],x[2]],g[1]-.2,g[1]+1+.6*u(e*29+p),1,.8)}for(const p of[-1,1]){const g=h(0,p*8.5,1.7);g0(g[0],g[1],g[2],2,2.1+.4*u(e*107+p),1.3,ae[(e+(p>0?1:3))%5],a)}for(const p of[-1,1])for(let g=0;g<5;g++){const x=-8.6+g*3.5+.8*u(e*109+g+p),N=Math.min(x+2.4+.9*u(e*113+g+p),8.8),$=h(p*2.12,x,.3),V=h(p*2.12,N,.3);G([$[0],$[2]],[V[0],V[2]],-.12,.45+.6*u(e*127+g+p),2,.8)}for(const p of[-7,-3.5,0,3.5,7]){const g=h(0,p,0);_0.push([g[0],g[2],3.6])}const A=h(f.range(-.5,.5),f.range(-3,3),3.2);ie.push({x:A[0],y:A[1],z:A[2],s:f.range(.4,.55),rot:f.range(0,e0),v:3+e%2,d:0,u:0});for(let p=0;p<6;p++){const g=f.range(-1.5,1.5),x=h(g,f.range(-8,8),Math.abs(g)<.8?5.3:4.8);$0.push({x:x[0],y:x[1],z:x[2],s:f.range(1.1,2),rot:f.range(0,e0),v:p%2,d:0,u:0})}await r.yield()}for(let e=0,t=0;t<34&&e<200;e++){let o=f.range(-28,28);const a=f.range(-30,620),i=f.range(-.5,.5);if(a>545&&Math.abs(o)<12&&(o=(o<0?-1:1)*(12+Math.abs(o))),s0.nearestXZ(o,a).dist<9||o>-36&&o<22&&a>14&&a<68)continue;const s=Math.cos(i),n=-Math.sin(i),c=f.pick(Ct).clone().multiplyScalar(.6).lerp(i0,.4);z.prism(o,a,s,n,1,2.35,-.4,.5,f0,c,10),z.prism(o,a,s,n,1,2.35,.5,.95,c,c.clone().lerp(ge,.5),10),z.prism(o+n*.2,a+s*-.2,s,n,.84,1.2,.95,1.5,Wt,St,10),z.box(o,a,s,n,.7,1.66,.9,.95,ge,ge),z.box(o+n*.2,a+s*-.2,s,n,.6,.85,1.45,1.5,ge,ge);const d=o+f.range(-.3,.3),m=a+f.range(-.8,.8),h=f.range(1.6,2.6),y=f.pick(x0),w=-n,k=s,b=t%2?1:-1;t%3!==1?g0(d,.55,m,1.6,1.05,h+.5,y,i):(g0(o+w*1.55*b+s*.3,.5,a+k*1.55*b+n*.3,1,.62,1.15,x0[t*3%5],i+.5),g0(o,.3,a,1.5,.72,2.75,y,i));for(const S of[-1,1]){const F=-2+.9*u(t*7+S),T=2-.9*u(t*11+S),A=t%3===1?1.52:1,p=S*(t%3===1?.88:1.04);G([o+s*p+w*F,a+n*p+k*F],[o+s*p+w*T,a+n*p+k*T],-.1,A,0,.7),G([o-s*.85+w*2.36*S,a-n*.85+k*2.36*S],[o+s*.85+w*2.36*S,a+n*.85+k*2.36*S],-.1,.98,0,.7)}for(let S=0;S<2;S++){const F=(u(t*19+S)-.5)*1.3,T=(u(t*23+S)-.5)*3.8;$0.push({x:o+s*F+w*T,y:Math.abs(T-.2)<.8?1.5:.95,z:a+n*F+k*T,s:.8+.6*u(t*29+S),rot:u(t*31+S)*e0,v:S%2,d:0,u:0})}Po.push([o,a,i]),_0.push([o,a,3.1]),t++}await r.yield();{const e=k0.a,t=k0.b,o=k0.hw,[a,i]=k0.pier,s=e[2],n=I("#b8ae98"),l=f0.clone().lerp(i0,.3);z.prism(a,i,1,0,1.7,2.3,-1.5,4.6,i0,B.clone().lerp(d0,.5),12),z.prism(a,i,1,0,1.7,2.3,4.6,6.4,B.clone().lerp(d0,.5),d0,12),z.box(a,i,0,1,3.2,1.8,6.4,G0(a)-1.5,n,B,f0),z.beam(e,t,o,1.5,n,B),z.beam([e[0],e[1]+1.05,s-o+.2],[-12.5,G0(-12.5)+1.05,s-o+.2],.2,1.05,d0,B),z.beam([e[0],e[1]+1.05,s+o-.2],[-19.8,G0(-19.8)+1,s+o-.2],.2,1.05,d0,B),z.beam([-17.6,G0(-17.6)+.5,s+o-.2],[-16.4,G0(-16.4)+.35,s+o-.2],.2,.5,d0,B),z.beam([t[0]-.2,t[1]-.1,s-2.3],[t[0]+.9,t[1]-.6,s-2.5],.55,.7,l,B),z.beam([t[0]-.2,t[1]-.15,s+1.9],[t[0]+.7,t[1]-.45,s+2],.8,.9,l,B),z.beam([t[0]-.1,t[1]-.6,s-.2],[t[0]+.5,t[1]-1.1,s-.3],.3,.5,y0,y0),g0(e[0]-.4,e[1]+.2,s+.3,2.6,1.9,4.1,ae[1],0),g0(e[0]+.3,e[1]-2.2,s-1.6,1.5,2.6,2.4,ae[3],.4),g0(a-.6,.2,i+.4,3.1,1.3,3.6,ae[2],.3),G([e[0]-.9,s-o],[e[0]-.9,s+o],e[1]-5.5,e[1]+.3,0,.7),G([e[0]+.5,s+o+.05],[e[0]+4.6,s+o+.05],e[1]-3.4,e[1]+.5,0,.9);for(let c=0;c<3;c++){const d=e[0]+1+c*3.4+u(c+900),m=d+2+1.4*u(c+910);G([d,s-o+.2],[m,s-o+.2],G0(d)+.9,G0(d)+1.9+.9*u(c+920),1,.9)}for(let c=0;c<5;c++){const d=c/5*e0+.3;G([a+Math.cos(d)*1.75,i+Math.sin(d)*2.35],[a+Math.cos(d+.8)*1.75,i+Math.sin(d+.8)*2.35],-.12,.5+.6*u(c+930),2,.8)}for(let c=0;c<7;c++){const d=e[0]+1.5+9*u(c+940),m=s+(c%2?-1:1)*(o-.7-.9*u(c+950));$0.push({x:d,y:G0(d)+.02,z:m,s:.9+.8*u(c+960),rot:u(c+970)*e0,v:c%2,d:0,u:0})}ie.push({x:e[0]+1.6,y:G0(e[0]+1.6)-.1,z:s-1.9,s:.42,rot:1.3,v:3,d:0,u:0}),j0.push([[e[0]+.5,e[1]+1,s+o-.2],[-19.8,G0(-19.8)+.9,s+o-.2]]),_0.push([a,i,3.6],[t[0]+1.3,s-2.1,2.2])}await r.yield();const Pt=[],Tt=[I("#587c2f"),I("#6c8a36"),I("#7d9340"),I("#4d742e")].map(Pe),De=(e,t,o=0)=>{const a=f.range(.92,1.12)+o*.04;ie.push({x:e,y:0,z:t,s:a,rot:f.range(0,e0),v:Math.floor(f()*3),d:0,u:0}),Pt.push([e,t,8.2*a,15.5*a]),_0.push([e,t,3]);const i=8.2*a,s=15.5*a,n=Pt.length;for(let l=0;l<6;l++){const c=l===5,d=(l+.8*u(n*9.1+l))/5*e0,m=c?.1*i:i*(.5+.14*u(n*5.3+l*2.7)),h=i*(.43+.13*u(n*3.9+l*4.1));g0(e+Math.cos(d)*m,s+(c?.4*i:(u(n*7.7+l)-.62)*.4*i),t+Math.sin(d)*m,h*1.12,h*.74,h*1.12,Tt[(n+l)%4],d,6)}for(let l=0;l<2;l++){const c=u(n*8.3+l)*e0+l*Math.PI;g0(e+Math.cos(c)*i*.27,s-.3*i,t+Math.sin(c)*i*.27,i*.62,i*.4,i*.62,Tt[(n+l)%4].clone().multiplyScalar(.7),c,6)}for(let l=0;l<5;l++){const c=(l+u(n*4.3+l))/5*e0,d=i*.74,m=1.4+1.6*u(n*2.9+l),h=e+Math.cos(c)*d,y=t+Math.sin(c)*d,w=s-.27*i;G([h+Math.sin(c)*m,y-Math.cos(c)*m],[h-Math.sin(c)*m,y+Math.cos(c)*m],w-2.2-2.4*u(n*6.1+l),w+.6,0,.5)}if(s0.nearestXZ(e,t).dist<40)for(let l=0;l<6;l++){const c=(l+.8*u(n*6.7+l*2.3))/6*e0,d=(.15+1.05*u(n*4.9+l*3.1))*.9,m=i*.9*Math.cos(d),h=i*(.22+.1*u(n*2.1+l*5.3));g0(e+Math.cos(c)*m,s-.12*i+i*.62*Math.sin(d),t+Math.sin(c)*m,h*1.15,h*.8,h*1.15,Tt[(n+l*3)%4].clone().multiplyScalar(.85+.35*u(n+l*7.1)),c,6)}g0(e,.05,t,2.7,.8,2.7,x0[n*2%5],u(n*3.3)*e0);for(let l=0;l<5;l++){const c=(l+.6*u(n*5.1+l))/5*e0,d=2.6+1.2*u(n*7.3+l);z.beam([e+Math.cos(c)*.3,1.5+.5*u(n+l*3.7),t+Math.sin(c)*.3],[e+Math.cos(c)*d,-.25,t+Math.sin(c)*d],.2,.55,bt,B)}for(let l=0;l<6;l++){const c=(l+u(n*9.7+l))/6*e0,d=.9+.8*u(n*1.9+l),m=e+Math.cos(c)*2.8,h=t+Math.sin(c)*2.8;G([m+Math.sin(c)*d,h-Math.cos(c)*d],[m-Math.sin(c)*d,h+Math.cos(c)*d],-.12,.6+.6*u(n*6.3+l),2,.8)}};for(const e of[468,418,362,318,242,188,140,104])De(22,e);De(-27,356);for(const e of[216,168])De(-25,e);De(35,522,4),De(-35,496,4);for(let e=0;e<26;e++){const t={x:f.range(-240,-112),y:.6,z:f.range(-50,255),s:f.range(.9,1.5),rot:f.range(0,e0),v:3+e%2,d:0,u:0};(e%4!==3||t.x>-150)&&ie.push(t)}for(const[e,t]of[[-44,118],[40,48],[-70,31]]){const o=D(e,.25,t);ie.push({x:o[0],y:.25,z:o[2],s:f.range(1.3,1.55),rot:f.range(0,e0),v:5+ie.length%2,d:0,u:0}),g0(o[0],-.3,o[2],3.4,.9,3.4,I("#4c7630"),0),_0.push([o[0],o[2],4.2])}await r.yield();const Rt=[],Ha=Math.round(120*Math.min(1.2,P)),Fo=(e,t,o)=>Rt.push({x:e,y:t,z:o,s:f.range(1.5,2.15),rot:f.range(0,e0),v:Math.floor(f()*2),d:s0.nearestXZ(e,o).dist,u:0});for(let e=0;e<Ha;e++)Fo(f.range(-108,-46),5,f.range(331,455));await r.yield();for(let e=0;e<92;e++)Fo(f.range(-104,-62),.6,f.range(-50,250));{const e=K0("bamboo-more:"+r.seed);for(let t=0;t<16;t++){const o=e.range(-104,-46),a=e.range(331,398);Rt.push({x:o,y:5,z:a,s:e.range(1.5,2.15),rot:e.range(0,e0),v:Math.floor(e()*2),d:s0.nearestXZ(o,a).dist,u:0})}}await r.yield();for(let e=0;e<130;e++){const t=e%2?1:-1,o=f.range(-38,640);t<0&&o<257&&o>100||Mt.push({x:t*f.range(28.6,30.4),y:-.1,z:o,s:f.range(1.2,2.2),rot:f.range(0,e0),v:e%3,d:0,u:0})}for(let e=0;e<56;e++){const t=f.range(0,e0),o=f.range(.92,1.12),a=D(Math.cos(t)*78*o,-.1,60+Math.sin(t)*68*o);s0.nearestXZ(a[0],a[2]).dist<16||Mt.push({x:a[0],y:-.1,z:a[2],s:f.range(1.3,2.4),rot:f.range(0,e0),v:e%3,d:0,u:0})}for(let e=0;e<30;e++){const t=f.range(0,e0),o=Math.cos(t)*30,a=Math.sin(t)*9;$0.push({x:-7+(Math.abs(o)>24?Math.sign(o)*24.75:o),y:f.range(-2.6,-.4),z:55+(Math.abs(o)>24?a*.7:Math.sign(a||1)*6.75),s:f.range(1.2,2.2),rot:f.range(0,e0),v:e%2,d:0,u:0})}for(let e=0;e<40;e++){const t=e%2?1:-1;$0.push({x:t*f.range(30.2,31.4),y:.16,z:f.range(260,640),s:f.range(.9,1.7),rot:f.range(0,e0),v:e%2,d:0,u:0})}await r.yield();const Ko=e=>{const t=new v.IcosahedronGeometry(1,e),o=t.getAttribute("position"),a=t.getAttribute("normal");for(let i=0;i<o.count;i++){const s=o.getX(i),n=o.getY(i),l=o.getZ(i),c=1+.2*r.noise.n3(s*1.6+5,n*1.6,l*1.6)+.09*r.noise.n3(s*4,n*4+9,l*4);o.setXYZ(i,s*c,n*c,l*c),a.setXYZ(i,s,n,l)}return t},Ie=new v.Object3D,Do=new v.Color,we=(e,t,o,a)=>{const i=new v.InstancedMesh(e,h0.blob,Math.max(1,t.length));t.forEach((s,n)=>{Ie.position.set(s[0],s[1],s[2]),Ie.scale.set(s[3],s[4],s[5]),Ie.rotation.set(0,s[6],0),Ie.updateMatrix(),i.setMatrixAt(n,Ie.matrix);const l=o(s);Do.setRGB(s[7]+l,s[8]+l,s[9]+l),i.setColorAt(n,Do)}),i.count=t.length,i.frustumCulled=!1,i.name=a,U.add(i)};we(Ko(2),gt.filter(e=>e[3]>90),e=>e[10]*2,"hills"),await r.yield(),we(Ko(1),gt.filter(e=>e[3]<=90),e=>e[10]*2,"green"),await r.yield();const V0=[0,0,0],Oe=[0,0,0],Xe=[0,0,0],qt=(e,t,o,a)=>{const i=Math.hypot(e,t,o)||1;e/=i,t/=i,o/=i;const s=1+.42*r.noise.n3(e*1.7+5,t*1.7,o*1.7)+.2*r.noise.n3(e*5,t*5+9,o*5);a[0]=e*s,a[1]=(t<0?t*.4:t)*s,a[2]=o*s},Ft=e=>{const t=new v.IcosahedronGeometry(1,e),o=t.getAttribute("position"),a=t.getAttribute("normal");for(let i=0;i<o.count;i++){const s=o.getX(i),n=o.getY(i),l=o.getZ(i),c=Math.abs(n)>.9?[1,0,0]:[0,1,0];let d=[n*c[2]-l*c[1],l*c[0]-s*c[2],s*c[1]-n*c[0]];const m=Math.hypot(d[0],d[1],d[2])||1;d=[d[0]/m,d[1]/m,d[2]/m];const h=[n*d[2]-l*d[1],l*d[0]-s*d[2],s*d[1]-n*d[0]],y=.06;qt(s,n,l,V0),qt(s+d[0]*y,n+d[1]*y,l+d[2]*y,Oe),qt(s+h[0]*y,n+h[1]*y,l+h[2]*y,Xe);const w=[Oe[0]-V0[0],Oe[1]-V0[1],Oe[2]-V0[2]],k=[Xe[0]-V0[0],Xe[1]-V0[1],Xe[2]-V0[2]];let b=w[1]*k[2]-w[2]*k[1],S=w[2]*k[0]-w[0]*k[2],F=w[0]*k[1]-w[1]*k[0];const T=b*s+S*n+F*l<0?-1:1,A=Math.hypot(b,S,F)||1;o.setXYZ(i,V0[0],V0[1],V0[2]),a.setXYZ(i,T*b/A,T*S/A,T*F/A)}return t},La=Ft(2);await r.yield();const Io=Ft(1),Kt=e=>Math.max(e[3],e[5])>=1.7&&s0.nearestXZ(e[0],e[2]).dist<=20;we(La,Re.filter(e=>e[10]!==6&&Kt(e)),e=>e[10],"mounds"),await r.yield();const Bo=e=>Math.max(e[3],e[5])<1.3||s0.nearestXZ(e[0],e[2]).dist>45;we(Io,Re.filter(e=>e[10]!==6&&!Kt(e)&&!Bo(e)),e=>e[10],"mounds-mid"),await r.yield(),we(Ft(0),Re.filter(e=>e[10]!==6&&!Kt(e)&&Bo(e)),e=>e[10],"mounds-far"),await r.yield(),we(Io,Re.filter(e=>e[10]===6),e=>e[10],"crowns"),await r.yield();const Dt=new v.Mesh(await Ra(r,me),h0.tower);Dt.frustumCulled=!1,Dt.name="towers",U.add(Dt),await r.yield();const It=new v.Mesh(await Ra(r,z),h0.concrete);It.frustumCulled=!1,It.name="street",U.add(It);{const e=new Ns,t=f0.clone().lerp(B,.5),o=B.clone().lerp(I("#7c9a48"),.5),a=I("#7d8f72"),i=I("#4f7a34");At.forEach(([s,n,l],c)=>{const d=Math.cos(l),m=-Math.sin(l),h=Ct[c%3].clone().multiplyScalar(.5).lerp(i0,.62);e.prism(s,n,d,m,2.7,11.9,0,4.2,h.clone().multiplyScalar(.7),h,4),e.prism(s,n,d,m,2.9,9.2,3.4,6,ae[c%5],ae[(c+2)%5],8,1.2,6.2)}),await r.yield(),Po.forEach(([s,n,l],c)=>{const d=Math.cos(l),m=-Math.sin(l);e.prism(s,n,d,m,1.5,2.9,0,1,x0[c%5].clone().lerp(f0,.4),x0[c%5],8,1.3,2.5),e.prism(s,n,d,m,1.3,2.5,1,1.65,x0[c%5],x0[(c+2)%5],8,.5,1.1)}),await r.yield(),dt.forEach((s,n)=>{const l=n?-9:6,c=10.9-.3*n;e.post([-33,0,s],[-33.6,11,s],.35,f0,B),e.post([33,0,s],[33.4,11,s],.35,f0,B),e.beam([-34,11.8,s],[l,c,s],.5,1.1,t,o),e.beam([l,c,s+.15],[34,11.4-.5*n,s+.15],.5,1.1,t,o),e.beam([-28,12.7,s],[l,c+.9,s],.6,.9,x0[1],x0[3]),e.beam([l,c+.9,s],[30,12.3-.5*n,s],.6,.9,x0[2],x0[3])});for(const[s,n,l]of Ao)e.post([s,0,n],[s+l,10.5,n+l*.5],.17,f0,B),e.beam([s+l,10.6,n+l*.5],[s-Math.sign(s)*3.2+l,10.2,n+l*.5],.14,.2,B,B);for(const[s,n,l]of To)e.post(s,n,.2,f0,B),e.beam(n,l,.13,.28,B,i0);for(const[s,n,l]of Ro){for(const c of[-3.2,0,3.2])e.post([s*31.3,0,n+c],[s*31.3+l,2.52,n+c+l*.4],.07,y0,B),e.post([s*33.3,0,n+c],[s*33.3+l,2.8,n+c+l*.4],.07,y0,B);e.beam([s*31.3+l,2.52,n-3.6],[s*31.3+l,2.52,n+3.6],.06,.12,y0,B),e.beam([s*33.3+l,2.8,n-3.6],[s*33.3+l,2.8,n+3.6],.06,.12,y0,B)}await r.yield(),e.beam([-46,25.3,8],[-2,16.3,-18],1.6,3.3,d0,B),e.beam([-2,16.3,-18],[38,1.2,-40],1.6,3.3,d0,B),e.prism(-2,-18,1,0,2,2.6,0,13,i0,d0,10);for(const[s,n]of[[[7,18.1,-22.9],[20,13.2,-30.1]],[[21,12.8,-30.6],[35.5,6.4,-38.6]]])e.beam(s,n,1.5,3.2,a,i);await r.yield(),U.add(Gs(h0,e.build())),await r.yield()}await r.yield();{const e=[],t=[],o=[],i=[[-1,1.95,2.55,i0],[2.2,1.92,2.52,i0.clone().lerp(B,.5)],[5.25,1.88,2.48,B.clone().lerp(d0,.3)],[5.5,1.62,2.22,B.clone().lerp(d0,.55)],[9,1.6,2.2,d0.clone().lerp(B,.15)],[13,1.6,2.2,d0]];for(const[l,c,d,m]of i)for(let h=0;h<28;h++){const y=h/28*e0;e.push(-2+Math.cos(y)*c,l,-18+Math.sin(y)*d),t.push(m.r,m.g,m.b)}for(let l=0;l<i.length-1;l++)for(let c=0;c<28;c++){const d=l*28+c,m=l*28+(c+1)%28,h=d+28,y=m+28;o.push(d,h,m,m,h,y)}const s=new v.BufferGeometry;s.setAttribute("position",new v.Float32BufferAttribute(e,3)),s.setAttribute("color",new v.Float32BufferAttribute(t,3)),s.setIndex(o),s.computeVertexNormals();const n=new v.Mesh(s,h0.concrete);n.name="sunk-pier",U.add(n)}const Be=new v.BufferGeometry;Be.setAttribute("position",new v.Float32BufferAttribute(mt,3)),Be.setAttribute("uv",new v.Float32BufferAttribute(vo,2)),Be.setAttribute("aInfo",new v.Float32BufferAttribute(po,4)),Be.setIndex(mo);const Bt=new v.Mesh(Be,h0.fur);Bt.frustumCulled=!1,Bt.name="fur",U.add(Bt),await r.yield();const _e=new v.Mesh(new v.PlaneGeometry(9e3,9e3).rotateX(-Math.PI/2),h0.water);_e.position.set(100,0,-900),_e.frustumCulled=!1,_e.renderOrder=-.4,_e.name="mirror",U.add(_e);const Ze=new v.BufferGeometry;Ze.setAttribute("position",new v.Float32BufferAttribute([-32,-11.4,48,18,-11.4,48,18,-11.4,62,-32,-11.4,62,-2,-11.4,20,14,-11.4,20,14,-11.4,48,-2,-11.4,48],3)),Ze.setIndex([0,2,1,0,3,2,4,6,5,4,7,6]),Ze.computeVertexNormals();const _t=new v.Mesh(Ze,h0.pool);_t.material.side=v.DoubleSide,_t.name="court-pool",U.add(_t);const je=new v.Mesh(new v.CylinderGeometry(2600,2600,2600,48,1,!0,2.836-1.5,3),h0.slate);je.frustumCulled=!1,je.renderOrder=-.5,je.name="slate-wall",U.add(je),await r.yield();const jt=[],_o=[],jo=[];for(const e of[330,300,250])for(let t=0;t<16;t++){const o=n=>12.6-1.6*(1-n/42*(n/42)),a=-42+t*5.25,i=a+5.25,s=jt.length/3;jt.push(a,o(a),e,i,o(i),e,i,o(i),e,a,o(a),e),_o.push(-1,-1,1,1),jo.push(s,s+1,s+2,s,s+2,s+3)}const Ye=new v.BufferGeometry;Ye.setAttribute("position",new v.Float32BufferAttribute(jt,3)),Ye.setAttribute("aS",new v.Float32BufferAttribute(_o,1)),Ye.setIndex(jo);const Nt=new v.Mesh(Ye,new v.ShaderMaterial({fog:!0,side:v.DoubleSide,uniforms:{...h0.fogU(),...h0.shared},vertexShader:`
        attribute float aS; varying float vS; varying vec3 vW;
        #include <fog_pars_vertex>
        void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vS = aS; w.y += aS * max(0.13, 0.0032 * distance(cameraPosition, w.xyz));
          vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${F0}
        varying float vS; varying vec3 vW;
        #include <fog_pars_fragment>
        void main(){
          float n = vn(vec2(vW.x * 1.7, vW.z * 0.3)), tuft = smoothstep(0.35, 0.7, n);
          vec3 alb = mix(vec3(0.2, 0.17, 0.12), vec3(0.2, 0.31, 0.1), tuft) * (0.75 + 0.5 * vn(vec2(vW.x * 9.0, vW.z)));
          gl_FragColor = vec4(folTint(alb) * (uAmbCol * (0.75 + 0.25 * vS) + uSunCol * (0.2 + 0.6 * max(vS, 0.0)) * sunLane(vW)), 1.0);
          #include <fog_fragment>
        }`}));Nt.frustumCulled=!1,Nt.name="wires",U.add(Nt);const $e=new v.BufferGeometry;$e.setAttribute("position",new v.Float32BufferAttribute(kt,3)),$e.setAttribute("uv",new v.Float32BufferAttribute(Mo,2)),$e.setIndex(zo);const Qe=new v.Mesh($e,new v.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:v.DoubleSide,uniforms:{...h0.fogU(),...h0.shared},vertexShader:`
        varying vec2 vUv; varying vec3 vW;
        #include <fog_pars_vertex>
        void main(){ vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
          vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        ${F0}
        varying vec2 vUv; varying vec3 vW;
        #include <fog_pars_fragment>
        ${Le}
        void main(){
          float sN = vUv.x / max(vUv.y, 1e-3) * 14.0, fw = min(fwidth(sN), 4.0) + 1e-4, d = abs(fract(sN) - 0.5);
          float a = mix(clamp((0.09 + fw * 0.5 - d) / fw, 0.0, 1.0), 0.18, smoothstep(0.35, 0.9, fw)) * smoothstep(0.0, 0.04, vUv.y);
          gl_FragColor = vec4(fogFar(uAmbCol * 2.0 + uSunCol * 1.6, vW, length(cameraPosition - vW)), a * 0.85);
        }`}));Qe.frustumCulled=!1,Qe.renderOrder=1,Qe.name="bridge-stays",U.add(Qe),await r.yield();const Gt=z0.makeWind({direction:[.25,-1],strength:.75+.6*R});await r.yield(),await z0.prepareLeafTexture({size:256},r.yield,4),await r.yield();const No=z0.makeLeafTexture({size:256});await r.yield();const se=z0.windMaterial({wind:Gt,map:No,ambient:3,leafAmbient:2.3});await r.yield();const E0=f.fork("flora"),Je=[],Go=[],Ho=[],Ua=e=>{const t=e.index.array,o=e.attributes.position.array,a=e.attributes.color.array,i=e.attributes.uv.array,s=new Uint8Array(12),n=[];let l=null;for(let w=0;w<t.length;){if(l&&w+6<=t.length){const p=t[w];if(t[w+1]===p+1&&t[w+2]===p+2&&t[w+3]===p&&t[w+4]===p+2&&t[w+5]===p+3&&i[p*2]<.26&&i[p*2+1]<.5){n.push(p,l[0],l[1],l[2]),w+=6;continue}}if(w+60>t.length){w+=3;continue}let k=1e9,b=-1;for(let p=0;p<60;p++){const g=t[w+p];g<k&&(k=g),g>b&&(b=g)}let S=b-k===11;if(S){s.fill(0);for(let p=0;p<60;p++)s[t[w+p]-k]++;for(let p=0;p<12;p++)s[p]!==5&&(S=!1)}if(!S){w+=3;continue}let F=0,T=0,A=0;for(let p=0;p<12;p++){const g=(k+p)*3;F+=o[g]/12,T+=o[g+1]/12,A+=o[g+2]/12}for(let p=0;p<12;p++){const g=(k+p)*3,x=(.7+.65*u(k*.37+p*1.91))*.8;o[g]=F+(o[g]-F)*.36,o[g+1]=T+(o[g+1]-T)*.36,o[g+2]=A+(o[g+2]-A)*.36,a[g]*=x,a[g+1]*=x,a[g+2]*=x}l=[F,T,A],w+=60}const c=n.length/4,d=e.attributes.position.count;if(!c)return e;const m={},h=["position","normal","color","wind","uv"];for(const w of h){const k=e.attributes[w];m[w]=new Float32Array((d+c*4)*k.itemSize),m[w].set(k.array)}const y=new(d+c*4>65535?Uint32Array:Uint16Array)(t.length+c*6);y.set(t);for(let w=0;w<c;w++){const k=n[w*4],b=n[w*4+1],S=n[w*4+2],F=n[w*4+3],T=d+w*4,A=m.position,p=m.normal;let g=0,x=0,N=0;for(let q=0;q<4;q++)g+=A[(k+q)*3]/4,x+=A[(k+q)*3+1]/4,N+=A[(k+q)*3+2]/4;const $=.9+1.9*u(k*.173+5),V=Math.cos($),b0=Math.sin($),u0=.86+.3*u(k*.311+9),K=(u(k*.57+2)-.5)*.5;for(let q=0;q<4;q++){const j=(k+q)*3,v0=(T+q)*3;A[j]=g+(A[j]-g)*.58,A[j+1]=x+(A[j+1]-x)*.58,A[j+2]=N+(A[j+2]-N)*.58;const R0=(A[j]-b)*u0,q0=(A[j+2]-F)*u0;A[v0]=b+R0*V+q0*b0,A[v0+1]=A[j+1]+K,A[v0+2]=F+q0*V-R0*b0,p[v0]=p[j]*V+p[j+2]*b0,p[v0+1]=p[j+1],p[v0+2]=p[j+2]*V-p[j]*b0;for(const D0 of["color","wind","uv"]){const oe=e.attributes[D0].itemSize;for(let de=0;de<oe;de++)m[D0][(T+q)*oe+de]=m[D0][(k+q)*oe+de]}}y.set([T,T+1,T+2,T,T+2,T+3],t.length+w*6)}for(const w of h)e.setAttribute(w,new v.BufferAttribute(m[w],e.attributes[w].itemSize));return e.setIndex(new v.BufferAttribute(y,1)),e};for(let e=0;e<3;e++)Je.push(Ua(z0.oakGeometry({rng:E0,detail:1,height:21,fullness:1.05,leaf:"#5d8a34",leafLight:"#b9c25e",leafDark:"#345a28",bark:"#7a6a58",barkDark:"#5a4c40"}))),await r.yield();for(let e=0;e<2;e++)Je.push(z0.oakGeometry({rng:E0,detail:0,height:13})),await r.yield();await r.yield(),z0.willowGeometry({rng:K0("willow-warm"),detail:0,height:12}).dispose(),await r.yield();for(let e=0;e<2;e++)Je.push(z0.willowGeometry({rng:E0,detail:1,height:12})),await r.yield();const Va=(e,t)=>Math.abs(e)<43||t<-60,Ht=Z?[1.5,1.38,1.05]:_?[.72,.82,1.4]:Y?[1.2,1.2,1.15]:[1.3,1.34,1.15],et=_?[.72,.76,1.3]:[1,1,1],Lt=e=>[e[0]*et[0],e[1]*et[1],e[2]*et[2]],Lo=z0.makeScatter({rng:E0,variants:Je,points:ie,material:se,sink:.02,tilt:.03,groundColor:(e,t,o)=>{const a=Va(e,t)?Ue(e,o+12,t):[1,1,1];return[a[0]*Ht[0],a[1]*Ht[1],a[2]*Ht[2]]}});Lo.object.name="trees",U.add(Lo.object),await r.yield();for(let e=0;e<2;e++)Go.push(z0.bambooGeometry({rng:E0,detail:1,height:13})),await r.yield();for(let e=0;e<2;e++)Ho.push(z0.bambooGeometry({rng:E0,detail:0,height:13})),await r.yield();await r.yield();const Uo=z0.makeScatter({rng:K0("bamboo:"+r.seed),variants:Go,farVariants:Ho,farDistance:30,points:Rt.filter((e,t)=>!(e.d>80&&t%2===0)&&!(e.d>50&&t%7===3)),material:se,sink:.01,..._?{groundColor:()=>et}:{}});Uo.object.name="bamboo",U.add(Uo.object),await r.yield();const Vo=z0.makeReeds({rng:E0,points:Mt,material:se,groundColor:(e,t,o)=>Lt(Ue(e,1.5,t))});Vo.object.name="reeds",U.add(Vo.object),await r.yield(),z0.makeFerns({rng:K0("fern-warm"),points:$0.slice(0,2),material:se}).object.traverse(t=>t.geometry?.dispose?.()),await r.yield();const Eo=z0.makeFerns({rng:E0,points:$0,material:se,groundColor:(e,t,o)=>Lt(o<-.1?[.6,.66,.75]:Ue(e,o+1,t))});Eo.object.name="ferns",U.add(Eo.object),await r.yield();for(let e=0;e<8;e++){const t=Math.ceil(j0.length/8),o=z0.makeVines({rng:E0,material:se,spans:j0.slice(e*t,(e+1)*t),sag:.2,thickness:.07,flower:Q.fringe});o.object.name="vines"+e,o.object.frustumCulled=!1,U.add(o.object),await r.yield()}{const e=z0.makeVines({rng:K0("mast-vines:"+r.seed),material:se,spans:zt,sag:.16,thickness:.1,stem:"#8a785c",flower:Q.fringe});e.object.name="mast-vines",e.object.frustumCulled=!1,U.add(e.object),await r.yield()}const Ut=(e,t)=>({rng:E0,path:s0,uRange:e,radius:62,bias:1,heightStep:5,count:Math.round(1300*M*Math.min(1.2,P)),chunks:2,wind:Gt,map:No,material:t,flowers:.03,flowerColors:["#e9e2f6","#b59ae0","#f1e9c8"],height:[.5,1.1],heightAt:o=>o<-42?.7:.16,density:(o,a)=>o>30&&o<42&&a>-10||o<-30&&o>-42&&a>257?1:o<-42&&o>-62&&a<257&&a>-60?.6:0,groundColor:(o,a)=>{const i=Lt(Ue(o,.6,a));return[.1*i[0],.17*i[1],.05*i[2]]}}),Ne=await z0.makeGrassAsync(Ut([0,.2]),r.yield,4);await r.yield();const Vt=await z0.makeGrassAsync(Ut([.2,.39],Ne.material),r.yield,4);Vt.object.name="grass2",U.add(Vt.object),await r.yield();const Et=await z0.makeGrassAsync(Ut([.39,.58],Ne.material),r.yield,4);Et.object.name="grass3",U.add(Et.object),Ne.object.name="grass",U.add(Ne.object),await r.yield(),Pt.forEach((e,t)=>{t<14&&h0.water.uniforms.uCrown.value[t].set(e[0],e[1],e[2],e[3])});const tt=o0==="cream",Oo={flower:tt?"#efe2bd":"#9a78d8",tip:tt?"#fffaf0":"#e6dafa",flower2:"#efe2bd",tip2:"#fffaf0",leaf:tt?"#7c7a36":"#6b7a34",sun:Q.sunColor,sunK:Q.sunK,amb:Q.amb,ambK:Q.ambK,gust:.7+.6*R},Xo={lit:Z?"#ffe2c0":_?"#c6d6f6":"#fff6e4",gain:Y?1.9:_?1.15:1.6,shade:_?"#5670b0":"#93a3c4",shadeK:_?.5:.75,veil:_?.6:1,drizzle:_?.5:Y?.6:1},Zo=(e,t,o)=>Wa(e,t,o,pt),Q0=await bs(r,{rng:f,density:P,light:Oo,fallLight:Xo,concrete:h0.concrete,sunLocal:pt,mixed:o0==="mixed",flora:{material:se},litAt:Zo,tintAt:(e,t,o)=>{const a=Zo(e,t,o);return[w0(pe[0],1,a),w0(pe[1],1,a),w0(pe[2],1,a)]}});Q0.object.position.set(m0.x,0,m0.z),Q0.object.rotation.y=m0.rot,U.add(Q0.object),await r.yield();const Yo=h0.water.uniforms.uCol.value;Q0.piers.map(e=>{const t=D(e[0],0,e[1]);return[t[0],t[2],e[2],s0.nearestXZ(t[0],t[2]).dist]}).sort((e,t)=>e[3]-t[3]).slice(0,12).forEach((e,t)=>Yo[t].set(e[0],e[1],e[2],2.7)),Q0.fallList.slice(0,4).forEach((e,t)=>{const o=D(e[0],0,e[1]);Yo[12+t].set(o[0],o[2],e[2],-(e[3]*.6+.5))});const ye=[{top:[42,228,-45],width:9,height:228.5,yaw:-Math.PI/2,kind:4,phase:.13,lit:_?.8:1.8},{top:[28,0,-45],width:46,height:.7,kind:1,phase:.4},{top:[36,60,-45],width:_?44:24,height:_?.3:.42,kind:1,phase:.9},{top:[-29.3,.1,48],width:3.6,height:12,yaw:0,kind:0,phase:.33,lit:.9},{top:[-23.3,.1,48],width:4.4,height:12,yaw:0,kind:0,phase:.58,lit:.9},{top:[-16.6,.1,48],width:4.8,height:12,yaw:0,kind:0,phase:.07,lit:.9},{top:[-10.3,.1,48],width:3.4,height:12,yaw:0,kind:0,phase:.74,lit:.9},{top:[-4.8,.1,48],width:2.8,height:12,yaw:0,kind:0,phase:.45,lit:.9},{top:[16,.1,48],width:2.6,height:12,yaw:0,kind:0,phase:.81,lit:.9},{top:[-28.4,.1,62],width:2.1,height:12,yaw:Math.PI,kind:0,phase:.52,lit:.6},{top:[-21.5,.1,62],width:7.4,height:12,yaw:Math.PI,kind:0,phase:.95,lit:.6},{top:[-12.6,.1,62],width:2.8,height:12,yaw:Math.PI,kind:0,phase:.17,lit:.6},{top:[-3.4,.1,62],width:8.6,height:12,yaw:Math.PI,kind:0,phase:.61,lit:.6},{top:[6.2,.1,62],width:1.8,height:12,yaw:Math.PI,kind:0,phase:.39,lit:.6},{top:[13.4,.1,62],width:5.6,height:12,yaw:Math.PI,kind:0,phase:.64,lit:.6},{top:[6,-11.3,46.5],width:13,height:4.2,kind:6,phase:.71,lit:.9},{top:[2,-5.5,52],width:11,height:.65,kind:1,phase:.29,lit:1},{top:[6,-8,41],width:10,height:.6,kind:1,phase:.12,lit:1},{top:[-32,.1,51.6],width:4.6,height:12,yaw:Math.PI/2,kind:0,phase:.71,lit:.45},{top:[-32,.1,58.2],width:5.2,height:12,yaw:Math.PI/2,kind:0,phase:.12,lit:.45},{top:[18,.1,51.4],width:5,height:12,yaw:-Math.PI/2,kind:0,phase:.27,lit:.45},{top:[18,.1,58.4],width:4.4,height:12,yaw:-Math.PI/2,kind:0,phase:.78,lit:.45},{top:[-18,-8,53],width:16,height:.1,kind:1,phase:.66},{top:[3,-8,55],width:14,height:.1,kind:1,phase:.21},{top:[-8,-4,55],width:20,height:.05,kind:1,phase:.48},{top:[6,-9,44],width:14,height:.15,kind:1,phase:.92}];for(let e=0;e<3;e++)ye.push({top:[.85+e*5.15,.14,20],width:4.1,height:12,yaw:0,kind:3,phase:28,lit:1});const ne=[[-22,119],[-25,114],[-20,124],[-28,120],[-31,112],[-33,120]].map(e=>D(e[0],0,e[1])).find(e=>Q0.piers.every(t=>{const o=D(t[0],0,t[1]);return Math.hypot(o[0]-e[0],o[2]-e[2])>13}))||D(-25,0,118);if(l0)for(let e=0;e<5;e++){const t=ne[0]+(e-2)*2.9,o=ne[2]+(e*3%5-2)*1.7;ye.push({top:[t,3.4,o],width:4.2,height:4.6,kind:6,phase:60+e*2.1,lit:1},{top:[t,4.6,o],width:6,height:.5,kind:1,phase:60+e*2.1,lit:1},{top:[t+.9,3.8,o+.6],width:2.4,height:6.2,kind:6,phase:61.3+e*2.1,lit:1})}ye.push({top:[51,228,-9.3],width:5.5,height:228.5,yaw:0,kind:4,phase:.57,lit:_?.9:2.3},{top:[51,0,-5],width:24,height:_?.35:.6,kind:1,phase:.36}),ye.push({top:[38.5,.07,-45],width:17,height:1,kind:5,phase:.2,lit:1},{top:[38.5,-.1,-45],width:15,height:9,kind:6,phase:.3,lit:1},{top:[51,.07,-6],width:12,height:1,kind:5,phase:.7,lit:1},{top:[51,-.1,-6],width:10,height:7,kind:6,phase:.8,lit:1});{const e=k0.b[0]+.5,t=k0.a[2]-2.1,o=k0.b[1]-.9,a=e+.3+.2*Math.sqrt(o);ye.push({top:[e,o,t],width:1.5,height:o+.3,yaw:Math.PI/2,kind:4,phase:.43,lit:1},{top:[a,.07,t],width:6.5,height:1,kind:5,phase:.6,lit:1},{top:[a,-.1,t],width:5,height:2.4,kind:6,phase:.5,lit:1},{top:[a,0,t],width:7,height:.7,kind:1,phase:.15,lit:1})}await r.yield();const Ot=ks(ye,Xo);Ot.mesh.name="world-falls",U.add(Ot.mesh),await r.yield();const O0=[],J0=[];for(const e of dt)for(let t=-31;t<=31;t+=1.05)O0.push(t,10.3-.5*Math.sin((t+34)/68*Math.PI),e+.6,f.range(2.4,4.2)),J0.push(0,f()*.999,.15+.85*P0(t,e),t*3+e);for(let e=0;e<44;e++){const t=e/43;for(const o of[-1.7,1.7])O0.push(-46+44*t+o*.5,22-9*t,8-26*t+o,f.range(3,6)),J0.push(.53,f()*.999,o>0?1:.4,e*2)}for(const e of[-4.3,16.3])for(let t=21;t<48;t+=1.1)O0.push(e,8.2,t,f.range(2,3.8)),J0.push(Math.PI/2,f()*.999,.7,t*3+e);for(let e=-3.5;e<16;e+=1.1)O0.push(e,8.3+1.3*(1-Math.abs(e-6)/10),47.4,f.range(1.6,3.2)),J0.push(0,f()*.999,1,e*3);for(let e=0;e<16;e++){const t=(e+.5)/16,o=e%2?1.6:-1.6;O0.push(7+28.5*t+o*.47,18-11.6*t-.6,-22.9-15.7*t+o*.85,f.range(1.5,3)),J0.push(.5,f()*.999,.9,e*5)}{const e=K0("bridge-end:"+r.seed),t=k0.a,o=k0.b,a=k0.hw,i=t[2];for(let s=t[0]+4.4;s<o[0];s+=.95)for(const n of[1,-1])e()<.1||(O0.push(s,G0(s)+.15,i+n*(a+.2),e.range(2.8,n>0?5.4:4.2)),J0.push(0,e()*.999,n>0?1:.45,s*3+n));for(let s=i-a+.4;s<i+a;s+=1)O0.push(o[0]+.15,o[1]-.2,s,e.range(2.2,4.4)),J0.push(Math.PI/2,e()*.999,.9,s*3)}{const e=K0("wire-garlands:"+r.seed);for(const t of[330,300,250])for(let o=-40;o<=40;o+=.95){const a=r.noise.n2(o*.16+t*.7,t*.37);a<-.28||(O0.push(o,12.55-1.6*(1-o/42*(o/42)),t+e.range(-.15,.15),e.range(1.3,2.2)+1.6*Math.max(0,a)),J0.push(e.range(-.3,.3),e()*.999,.25+.75*P0(o,t),o*3+t))}}const Xt=Ms({A:new Float32Array(O0),B:new Float32Array(J0),count:O0.length/4},Oo);Xt.mesh.name="street-wisteria",U.add(Xt.mesh),await r.yield();const T0=S0.makeFauna(U,{light:S0.lightFrom(U)});await r.yield();const $o=(e,t,o)=>X(t-4,t,e)*(1-X(o,o+4,e)),Ea=(e,t)=>{const o=lo(e,t);return 1-X(.75,1,Math.hypot(o[0]/78,(o[1]-60)/68))},Qo=(e,t)=>-.25-.35*Ea(e,t)+3.4*Math.max(Pa(55,13,t)*$o(e,-36,22),Pa(36,20,t)*$o(e,-5,17)),ot={species:"deer",size:1.6,mode:"migrate",gait:"run",heightAt:Qo,coat:"#6b5140",rump:"#f2ede2",horn:"#8A6A58",varieties:.35,rim:.3,blobShadow:!1},Jo=Math.round(15*Math.min(1.2,P)),ea=Z?.55:Y?.22:_?.35:.5,Zt=[[16,0,78,[14,50]],[10,17.5,60,[8,30]],[10,-17.5,60,[8,30]],[Jo,30,50,[12,60]],[Jo,-30,50,[12,60]]];J&&Zt.push([1,3,31,[2,2]]);const Yt=[],Oa=new v.Color("#55607C"),$t=S0.makeHerd({species:"deer",coat:ot.coat,rump:ot.rump,horn:ot.horn,rng:K0("herd-body"),count:1,blobShadow:!1});$t.material.dispose(),$t.uniforms.uTracks?.value?.dispose?.();const ta=$t.geometry;await r.yield(),We(ta),await r.yield();for(let e=0;e<Zt.length;e++){const[t,o,a,i]=Zt[e],s=e===5,n=S0.makeHerd({...ot,...s?{coat:"#efe9e0",varieties:1,sizes:[1.14]}:{geometry:ta},rng:f.fork("herd"+o),count:t,spread:i,along:{path:s0,side:o,lead:a,from:-.05,to:1.1}});if(!s){const l=n.geometry.attributes.iB,c=n.geometry.attributes.iTint,d=n.uniforms.uTracks.value.image,m=d.width,h=d.data;for(let y=0;y<t;y++){const w=n0(e*31.7+y*7.3+1),k=n0(e*17.1+y*3.9+5),b=n0(e*9.3+y*11.7+9);let S=l.getX(y),F=l.getY(y);w<.14?(S*=.58,F=0):w<.4?(S*=.86,F=0):w>.9&&(S*=1.16,F=1),l.setXY(y,S,F);const T=k<.22?[.6,.57,.55]:k<.42?[1.3,1.22,1.04]:k<.62?[1.22,.94,.76]:[1,1,1];if(c.setXYZ(y,c.getX(y)*T[0],c.getY(y)*T[1],c.getZ(y)*T[2]),b<.2)for(let A=0;A<7;A++){const p=3+Math.floor(n0(y*5.1+A*13.3+e)*(m-6)),g=(y*m+p)*4;h[g+1]<.4&&(h[g+1]+=1+1.1*n0(y+A*3.3+e*2))}else if(b>.875)for(let A=0;A<m;A++){const p=(y*m+A)*4;if(h[p+1]>.4)continue;const g=lo(h[p],h[p+2]),x=Math.hypot(g[0]/78,(g[1]-60)/68);h[p+1]-=.95*S/1.6*(1-X(.38,.7,x))}}}await r.yield(),s&&We(n.geometry),T0.add(n,{always:!0}),await r.yield(),U.add(js(n,h0,1.6,ea)),(e<3||s)&&U.add(Us(n,h0)),Yt.push({lead:a,side:o,e:-1,u:n.uniforms,sun0:n.uniforms.uSunColor.value.clone(),sky0:n.uniforms.uSkyColor.value.clone(),shade:n.uniforms.uSkyColor.value.clone().lerp(Oa.clone().multiplyScalar(Q.hemiI),.6)}),await r.yield()}const oa=S0.makeHerd({species:"deer",size:1.6,rng:f.fork("hinds"),count:10,varieties:0,coat:"#8a6044",rump:"#ffffff",center:[-36.5,.16,366],radius:4.6,y:.16,roam:.5,pause:.3});await r.yield(),We(oa.geometry),T0.add(oa),await r.yield();const at=D(26,0,105),aa=S0.makeHerd({species:"deer",size:1.6,rng:f.fork("drink"),count:6,varieties:.3,coat:"#8a6044",rump:"#ffffff",horn:"#8A6A58",center:[at[0],-.3,at[2]],radius:8,y:-.3,roam:.6,pause:.34,path:s0,clear:12});await r.yield(),We(aa.geometry),T0.add(aa),await r.yield();{const e=[];for(let t=0;t<e.length;t++){const[o,a,i]=e[t],s=S0.makeHerd({species:"deer",size:1.6,rng:K0("deck-hinds"+t+":"+r.seed),count:i,varieties:.3,coat:"#6b5140",rump:"#ffffff",horn:"#8A6A58",center:o,radius:a,y:o[1],roam:.4,pause:.4});await r.yield(),We(s.geometry),T0.add(s),await r.yield()}}if(l0){const e=S0.makeHerd({species:"elephant",coat:Z?"#3d3b3a":"#7d7873",rim:Z?.25:.6,rng:f.fork("elephants"),count:7,size:1.5,sizes:[1,1.06,.94,1,.9,.52,.46],center:[ne[0],-1.5,ne[2]],radius:6.5,y:-1.5,roam:.5,pause:.32,path:s0,clear:11});await r.yield(),We(e.geometry),T0.add(e),await r.yield()}for(const e of Q0.piers){const t=D(e[0],0,e[1]);_0.push([t[0],t[2],4.4])}for(const e of[22,30,38,46])_0.push([6,e,10.5]);for(const e of Q0.fallList.slice(-8)){const t=D(e[0],0,e[1]);_0.push([t[0],t[2],3.4])}_0.push([-2,-18,3.6],[36,-39,5],[at[0],at[2],7]),l0&&_0.push([ne[0],ne[2],9.5]);const le=K0("near-herd:"+r.seed),L0=s0.length,B0=380,st=1.12,C0=[[9.5,5.6],[11,-6],[14.5,3.6],[19,-4],[11,10],[17,-10.5],[20,7.6],[22,-6.4],[26,11.5],[27,-9.2],[30,6.6],[32,-13],[35,7.8],[38,-6],[17,13.2],[41,-7.4],[44,7],[24,-14]].slice(0,Math.max(10,Math.min(16,Math.round(14*P)))).map(([e,t])=>({lead:e+le.range(-1,1),side:t+le.range(-.5,.5)*(Math.abs(t)>6.5?1:.3),p1:le()*e0,p2:le()*e0,tab:null})),ce=C0.length,he=K0("ring-runners:"+r.seed);for(const[e,t]of[[64,2.7],[80,-3.3],[98,1.5]])C0.push({lead:e+he.range(-2,2),side:t+he.range(-.4,.4),p1:he()*e0,p2:he()*e0,tab:null});const Xa=Cs();await r.yield();const xe=C0.map((e,t)=>t>=ce?.9+.1*he():t%3===0?1:t%7===4?.74:.86+.06*le()),be=C0.map((e,t)=>t>=ce?t===ce:t%3===0),nt=C0.map((e,t)=>t>=ce?he():le()),Ge=C0.map((e,t)=>t>=ce?he():le());for(let e=0;e<ce;e++)e%5===2&&!be[e]?xe[e]=.6:be[e]&&(xe[e]=.96+.16*n0(e*3.3+70));const Za=[[17,7.6,9.8,5.4,1.14,1,.08,1],[24,10,13.6,7.6,.92,0,.77,.85],[20,-8.6,13,-7.2,1.1,1,.513,1],[27,-11.5,10.6,-8.8,.76,0,.3,.7]],Ya=new v.Vector3,sa=e=>s0.pointAt(Math.min(1,Math.max(0,e)),Ya).y,Qt=e=>1-X(3,7,sa(e)),$a=e=>1-X(2,3,sa(e)),rt=K0("hero-deer:"+r.seed),na=(e,t)=>w0(e[0],e[2],Qt(t)),Qa=(e,t)=>w0(e[1],e[3],Qt(t));for(const e of Za)C0.push({lead:e[0],side:e[1],p1:rt()*e0,p2:rt()*e0,tab:null,hero:e}),xe.push(e[4]),be.push(e[5]===1),nt.push(rt()),Ge.push(rt());const Ja=new v.Vector3,es=e=>w0(6.2+.9*Math.sin(e*14+1.3)+1.5*Math.max(0,s0.pointAt(Math.min(1,Math.max(0,e)),Ja).y-3),11.5,X(.885,.95,e)),ts=e=>w0(-5,w0(5,2,X(.89,.95,e)),X(.56,.66,e)),it=K0("great-look:"+r.seed)()*6.2832,os=Ge.map(e=>.5*(e*7.9%1)-.14),as=(e,t)=>(1-X(10,16,e))*X(.3,.75,Math.sin(t*1.25+it)),ra=C0.length;C0.push({lead:12,side:-4.4,p1:.4,p2:2.1,tab:null,great:!0}),xe.push(1.32),be.push(!0),nt.push(.21),Ge.push(.83);const ia=C0.length;xe.push(1.5),be.push(!0),nt.push(.37),Ge.push(.61);const ss=(e,t,o)=>X(e-.014,e,o)*(1-X(t,t+.014,o)),ns=e=>Math.max(X(.004,.02,e)*(1-X(.09,.11,e)),ss(.915,2,e)),re=zs({geometry:Xa,count:C0.length+1,common:F0,shared:h0.shared,fogU:h0.fogU,shadowK:ea,strideLen:23.5/2.6,rimK:_?2.4:1,padsU:h0.water.uniforms.uPads,..._?{coat:"#a38676",coatDark:"#6b584e"}:{},sizes:xe,stags:be,phases:nt,seeds:Ge});U.add(re.object),await r.yield();const He=new Float32Array((B0+1)*4),ke=new v.Vector3,X0=new v.Vector3,p0=[0,0,0];for(let e=0;e<=B0;e++){s0.pointAt(e/B0*st,ke),s0.tangentAt(e/B0*st,X0);const t=Math.hypot(X0.x,X0.z)||1;He.set([ke.x,ke.z,X0.x/t,X0.z/t],e*4)}await r.yield();for(let e=0;e<C0.length;e++){const t=C0[e],o=new Float32Array(B0+1),a=new Float32Array(B0+1),i=Math.sign(t.side),s=t.great?2:2.4+2.2*Math.abs(Math.sin(t.p1));t.fan=!t.great&&Math.abs(t.hero?t.hero[1]:t.side)>9;for(let c=0;c<=B0;c++){const d=c/B0*st,m=t.great?ts(d)+.2*Math.sin(d*23+t.p2):t.hero?Qa(t.hero,d-14/L0)+.3*Math.sin(d*23+t.p2):t.side+(Math.abs(t.side)<6?.4:.9)*Math.sin(d*23+t.p2);o[c]=w0(m,t.fan?i*(ft+4+.36*Math.abs(t.side)):(t.great?Math.sign(m):i)*Math.min(Math.abs(m),s),X(t.fan?.88:.9,.995,d))}const n=()=>{for(let c=0;c<=B0;c++){const d=He[c*4],m=He[c*4+1],h=He[c*4+2],y=He[c*4+3];let w=o[c];for(let k=0;k<_0.length;k++){const b=_0[k],S=b[0]-d,F=b[1]-m,T=S*h+F*y,A=b[2]+1.1;if(Math.abs(T)>=A)continue;const p=S*-y+F*h,g=Math.sqrt(A*A-T*T);if(Math.abs(w-p)>=g)continue;const x=t.great?o[c]<0?-1:1:i,N=p-x*g;w=N*x>=(t.great?2.6:3.4)?N:p+x*g}o[c]=w}},l=c=>{a.set(o);for(let d=0;d<=B0;d++){let m=0,h=0;for(let y=Math.max(0,d-c);y<=Math.min(B0,d+c);y++)m+=a[y],h++;o[d]=m/h}};n(),await r.yield(),l(3),n(),await r.yield(),l(1),n(),t.tab=o,await r.yield()}let Jt=1;const Me=(e,t,o)=>{s0.pointAt(t,ke),s0.tangentAt(t,X0);const a=Math.hypot(X0.x,X0.z)||1,i=Math.min(B0-.001,Math.max(0,t/st*B0)),s=Math.floor(i),n=w0(e.tab[s],e.tab[s+1],i-s);let l=e.lead<22&&Jt<1?Math.sign(n)*Math.max(Math.abs(n)*Jt,Math.min(Math.abs(n),3.4)):n;o[0]=ke.x-X0.z/a*l,o[2]=ke.z+X0.x/a*l,o[1]=Math.max(Qo(o[0],o[2]),-.45)},Zs=(e,t,o,a)=>{const i=C0[ce+3+e],s=t+na(i.hero,t)/L0;return Me(i,s,p0),a.set(p0[0],1.5,p0[2])},la=e=>e+es(e)/L0,rs=(e,t)=>(Me(C0[ra],la(e),p0),t.set(p0[0],2,p0[2])),Z0=[0,0,0,0,0,1,0],is=(e,t)=>{const o=C0[ra],a=la(e);Me(o,a,p0),t[0]=p0[0],t[1]=p0[1],t[2]=p0[2],Me(o,a+.0025,p0),t[3]=Math.atan2(p0[0]-t[0],p0[2]-t[2]),t[4]=p0[1],t[5]=Math.hypot(p0[0]-t[0],p0[2]-t[2])||1,t[6]=a},ca=(e,t,o=0)=>{if(t){const s=t.projectionMatrix.elements;Jt=Math.min(1,Math.max(.55,s[5]/Math.max(s[0],.001)/1.6))}is(e,Z0);const a=Z0[0],i=Z0[2];for(let s=0;s<C0.length;s++){const n=C0[s],l=n.hero?Qt(e):0,c=n.great?Z0[6]:e+((n.hero?na(n.hero,e):n.lead)+1.5*Math.sin(e*31+n.p1)*(1-.85*l))/L0;if(n.great){const A=Z0[0],p=Z0[1],g=Z0[2],x=Z0[3];let N=0;if(t){const j=t.matrixWorld.elements,v0=j[12]-A,R0=j[14]-g,q0=Math.sin(x),D0=Math.cos(x);N=Math.max(-2.4,Math.min(2.4,Math.atan2(-v0*D0+R0*q0,v0*q0+R0*D0)))*as(Math.hypot(v0,R0),o)}const $=X(.1,.55,Math.sin(o*.33+it*1.7)),V=(o*.6+it*.7)%1,b0=$>.02&&V<.45,u0=b0?1.3*$*Math.sin(Math.PI*V/.45):0,K=b0?-.3*$*Math.cos(Math.PI*V/.45):0,q=-.5*Math.pow(Math.max(0,Math.sin(o*.83+it*2.3)),10);re.setHead(s,N,1,q),re.set(s,A,(c-1)*L0>1.2?-80:p+u0,g,x,-.8*Math.atan2(Z0[4]-p,Z0[5])+K,X(.15,1.3,p+u0+.25),0,.6);continue}Me(n,c,p0);let d=p0[0],m=p0[2];const h=p0[1];Me(n,c+.0025,p0);const y=Math.hypot(p0[0]-d,p0[2]-m)||1,w=Math.atan2(p0[0]-d,p0[2]-m);let k=0,b=0;if(l>.02){const A=(o*.6+n.hero[6])%1;A<.45&&(k=1.55*n.hero[7]*l*Math.sin(Math.PI*A/.45),b=-.36*l*Math.cos(Math.PI*A/.45))}const S=d-a,F=m-i,T=Math.hypot(S,F);if(T<3.6){const A=(3.6-T)/Math.max(T,.4);d+=S*A,m+=F*A}re.set(s,d,!n.fan&&(c-1)*L0>1.2?-80:h+k,m,w,-.8*Math.atan2(p0[1]-h,y)+b,X(.15,1.3,h+k+.25),0,os[s]||0)}re.set(ia,ut[0],ut[1],ut[2],ut[3],-.06,0,1,.6),re.setHead(ia,0,.7),re.commit()};ca(0),await r.yield();const lt=[];for(const[e,t]of[[-19,0],[-17.6,0],[-6,1],[8,0],[9.5,0],[21,1]])lt.push([e,12.62,330,t?Math.PI/2:f.range(-.5,.5)+Math.PI,t,t?4:0,1]);for(const e of[.2,.26,.52,.8])lt.push([-46+44*e,25.3-9*e,8-26*e,.9+f.range(-.6,.6),e===.52?1:0,3,0]);for(const e of[-13,-10.5,11,15.5]){const t=D(e,16.9,16.75);lt.push([t[0],t[1],t[2],m0.rot+f.range(-.5,.5),0,0,0])}U.add(Vs(h0,lt,f.fork("apes"))),await r.yield();const ct=[[-28.5,0,505],[28.6,0,431],[-28.8,0,312],[28.7,0,226],[28.4,0,158],[27,0,96],D(-52,0,96),D(-60,0,60),D(48,0,118),D(58,0,70),D(-40,0,24),D(44,0,30)];if(Y)for(let e=0;e<28;e++)if(e%2)ct.push([(e%4===1?1:-1)*f.range(26.5,29),0,f.range(60,520)]);else{const t=f.range(0,e0),o=f.range(30,70);ct.push(D(Math.cos(t)*o,0,60+Math.sin(t)*o*.8))}T0.add(S0.makeWaders({rng:f.fork("egret"),species:"egret",positions:ct,count:ct.length,level:0,size:1.5})),await r.yield();const eo={body:"#ffffff",belly:"#ffffff",wingC:"#f4f4ee",tip:"#ffffff",trail:"#ffffff"};T0.add(S0.makeFlock({rng:f.fork("lift1"),species:"gulls",count:9,size:1.4,...eo,cross:{path:s0,u:.26,lead:48,height:5,span:170,duration:44}})),await r.yield(),T0.add(S0.makeFlock({rng:f.fork("lift2"),species:"gulls",count:7,size:1.4,...eo,cross:{path:s0,u:.69,lead:36,height:2,span:150,rise:20,duration:44}})),await r.yield(),T0.add(S0.makeFlock({rng:K0("lift3:"+r.seed),species:"gulls",count:7,size:1.5,...eo,cross:{path:s0,u:.792,lead:34,height:-2.6,span:150,angle:72,duration:46}})),await r.yield(),T0.add(S0.makeFlock({rng:f.fork("swallow1"),species:"swifts",count:20,along:{path:s0,side:2,up:3.5,lead:42}})),await r.yield(),T0.add(S0.makeFlock({rng:f.fork("swallow2"),species:"swifts",count:40,center:D(0,16,120),radius:80})),await r.yield(),T0.add(S0.makeButterflies({rng:f.fork("swallowtail"),center:D(0,7,40),radius:34,count:40,shape:"swallowtail",size:2.4})),_&&(await r.yield(),T0.add(S0.makeFireflies({rng:f.fork("ff1"),center:[-70,9,392],radius:58,count:Math.round(1300*M),size:.3,sync:.6,altitude:[.5,14]}),{always:!0}),await r.yield(),T0.add(S0.makeFireflies({rng:f.fork("ff2"),center:D(0,4,70),radius:85,count:Math.round(1500*M),size:.3,sync:.6}),{always:!0}),await r.yield(),T0.add(S0.makeFireflies({rng:f.fork("ff3"),path:s0,uFrom:.02,uTo:.6,spread:34,clear:7,lift:[-2.4,5],count:Math.round(500*M),size:.26,sync:.5}),{always:!0})),await r.yield();const ee=Y0.fxGroup();U.add(ee.object);const ls=ee.add(Y0.makeParticles({rng:f.fork("rain"),preset:"rain",count:Math.round(5e3*M)}));await r.yield();const cs=_?["#8ea2d6","#7f8fc4","#a3b2de"]:tt?["#ffffff","#f6efd9","#efe6c8"]:["#B59AE0","#d3c2f0","#f1eaff"],hs=_?.5:1,fs=ee.add(Y0.makeParticles({rng:f.fork("petals"),preset:"petals",count:Math.round(1400*M*Math.min(1.2,P)),colors:cs,near:[3.2,7.5]}));await r.yield();const ds=ee.add(Y0.makeParticles({rng:f.fork("spray"),preset:"rain",mode:"billboard",shape:"disc",count:Math.round(460*M),box:[48,1.1,48],follow:"xz",center:[0,.6,0],velocity:[.5,-3.2,5],velocityRandom:[1.6,1.4,2.2],size:[.022,.05],twinkle:.4,colors:_?["#b9c9ee","#d6e0fa","#9fb0dc"]:["#fff6e6","#ffffff","#e6eefa"],intensity:_?.4:1.4,opacity:.6,additive:.7,near:[2.5,6]}));await r.yield();const ha=l0?3900:2400,fa=Y0.makeRainbow({sunDir:Q.sunDir.toArray(),intensity:0,radius:ha,secondary:!1});U.add(fa.object);const da=Y0.makeRainbow({sunDir:Q.sunDir.toArray(),intensity:0,radius:ha});U.add(da.object);const ua=l0?.85:.4;await r.yield();const va=Y||_||Z?.2:.11,pa=ee.add(Y0.makeMist({rng:f.fork("mist"),count:64,area:[230,7,260],center:D(0,4,130),size:[9,22],softness:1,ragged:.7,near:[.8,2.4],color:_?"#8ea2d6":Z?"#f2dcc8":"#e4e9f2",opacity:va}));await r.yield();const ma=e=>384-(e-.188)*(e<.188?2400:3100),us=e=>r0?X(.135,.16,e)*(1-X(.3,.42,e)):0;let ze=null;r0&&(ze=Hs(h0),ze.position.set(0,0,ma(0)),U.add(ze),await r.yield());let ht=null;const ga=r0?.5:Z?.42:0;ga>0&&(ht=Ls(h0),U.add(ht),await r.yield());const wa=Z?.5:0,ya=Z?ee.add(Y0.makeMist({rng:K0("lane-mist:"+r.seed),count:50,area:[56,1.4,560],center:[0,.9,262],size:[16,30],flatten:.2,softness:1,ragged:.6,color:"#ffcda0",opacity:wa,drift:[.25,0,-.6],near:[.7,2.1]})):null;await r.yield();const to=_?"#9fb6ee":Z?"#ffc890":"#ffe2b0",oo=_?.2:Y?.8:.3,xa=[-Q.sunDir.x,-Q.sunDir.y,-Q.sunDir.z];ee.add(Y0.makeGodRays({rng:f.fork("rays"),position:D(-6,46,150),direction:xa,radius:60,count:16,length:100,color:to,intensity:oo}));{const e=[],t=[],o=[];for(let n=0;n<14;n++){const l=150+n*20+9*n0(n*3.7),c=Aa(l),d=D(c-85,0,l),m=D(c+85,0,l),h=e.length/3;e.push(d[0],.3,d[2],m[0],.3,m[2],m[0],56,m[2],d[0],56,d[2]),t.push(0,0,1,0,1,1,0,1),o.push(h,h+1,h+2,h,h+2,h+3)}const a=new v.BufferGeometry;a.setAttribute("position",new v.Float32BufferAttribute(e,3)),a.setAttribute("uv",new v.Float32BufferAttribute(t,2)),a.setIndex(o);const i=new v.ShaderMaterial({uniforms:{...h0.shared,uK:{value:Z?.13:r0?.11:Y?.035:.03},uCol:{value:I(to)}},transparent:!0,depthWrite:!1,side:v.DoubleSide,blending:v.AdditiveBlending,vertexShader:"varying vec3 vW; varying vec2 vUv; void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vUv = uv; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`
          ${F0}
          uniform float uK; uniform vec3 uCol; varying vec3 vW; varying vec2 vUv;
          void main(){
            float d = distance(vW, cameraPosition); vec3 az = vec3(uHero.w, 0.0, uHero.z) * 7.0;
            float s0 = deckShade(vW), s1 = deckShade(vW + az), s2 = deckShade(vW - az);
            float xl = dot(vW.xz - uHero.xy, vec2(uHero.z, -uHero.w)), zl = dot(vW.xz - uHero.xy, vec2(uHero.w, uHero.z));
            float streak = smoothstep(0.38, 0.8, vn(vec2((xl + vW.y * 0.42) * 0.15 + zl * 0.012, zl * 0.05)) * 0.7 + vn(vec2((xl + vW.y * 0.42) * 0.5, zl * 0.05 + 4.0)) * 0.3);
            float shaft = s0 * (0.3 + 0.7 * (1.0 - s1 * s2)) * streak;
            float m = 0.3 + 0.7 * smoothstep(0.25, 0.75, vn(vec2(dot(vW.xz, vec2(uHero.z, -uHero.w)) * 0.045 + uTime * 0.015, vW.y * 0.09 - uTime * 0.012)));
            float a = shaft * m * uK * smoothstep(0.3, 5.0, vW.y) * (1.0 - smoothstep(40.0, 56.0, vW.y)) * smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x)
              * smoothstep(8.0, 30.0, d) * (1.0 - smoothstep(170.0, 320.0, d));
            if (a < 0.002) discard;
            gl_FragColor = vec4(uCol * (0.6 + 0.4 * uSunCol) * a, 1.0);
          }`}),s=new v.Mesh(a,i);s.frustumCulled=!1,s.renderOrder=2.7,s.name="sun-shafts",U.add(s)}const ba=ee.add(Y0.makeGodRays({rng:f.fork("rays2"),position:Y?[-20,40,480]:[-62,44,404],direction:xa,radius:Y?50:34,count:12,length:100,color:to,intensity:oo*(_?.5:.8)})),vs=oo*(_?.5:.8);await r.yield(),await ve.prewarm?.(r.renderer,null,U);const ao=e=>w0(w0(1.06,.98,X(.54,.6,e)),.82,X(.6,.72,e))*(1-.1*$a(e));let ka=0;for(let e=0;e<64;e++)ka+=1/(64*Math.max(.35,ao((e+.5)/64)));const ps=e=>L0*ka/46*ao(e),so=s0.nearestXZ(-14,56).u,te=new v.Vector3,ms=new v.Vector3,no=new v.Vector3,N0=new v.Vector3,fe=new v.Vector3,ro=new v.Vector3,gs=Y?.3:_?.5:.55;let Ce=-1,Ma=-1;return{scene:U,path:s0,duration:46,pace:ao,ride:"none",title:L.title,camera:{fov:64,near:.3,nearThrough:.3,far:4200,lookAhead:28,sway:.5,bank:.3},pois:[{at:(e,t)=>(s0.pointAt(Math.min(1,t+62/L0),te),no.set(te.x,1,te.z)),from:.125,to:.225,weight:.5},{at:(e,t)=>rs(t,ms),from:.225,to:.374,weight:.34},{at:(e,t)=>(s0.pointAt(Math.min(1,t+90/L0),te),no.set(te.x+8,2,te.z)),from:.375,to:so-.05,weight:.4},{at:[6,-4,32],from:so-.085,to:so-.004,weight:.42},{at:[120,28,-420],from:.53,to:.7,weight:.4},{at:(e,t)=>(s0.pointAt(Math.min(1,t+75/L0),te),no.set(te.x,1,te.z)),from:.645,to:.765,weight:.5},{at:[130,3,-432],from:.75,to:.97,weight:.6},...l0?[{at:[ne[0],3,ne[2]],from:.8,to:.875,weight:.45}]:[]],portal:{shape:"circle",radius:ft,color:_?"#FFE9C8":"#EFE6FF",glow:1.3,revealDistance:400},post:{exposure:L.exposure,bloom:{strength:.38,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.04,tint:"#ffffff",shadowTint:"#141A2C",vignette:.28,grain:.02,aberration:0}},update(e,t,o,a=0){const i=h0.shared;i.uTime.value=t,i.uSlate.value=M0(a);const s=us(a),n=ma(a);h0.water.uniforms.uRain.value=Math.max(I0(a),.8*s),h0.water.uniforms.uFront.value.set(n,s),ze&&(ze.position.z=n,ze.material.uniforms.uK.value=s*(.75+.25*R)),ht&&(ht.material.uniforms.uK.value=ga*X(.5,.545,a)*(1-X(.6,.645,a))),U.fog.density=H0(a),U.fog.color.copy(Ka).lerp(Da,.8*M0(a)),N0.setFromMatrixPosition(o.matrixWorld),s0.tangentAt(a,fe);const l=Math.hypot(fe.x,fe.z)||1,c=Math.sin(t*e0*2.6);i.uRider.value.set(N0.x,N0.z,fe.x/l,fe.z/l);const d=1-X(4.2,6.5,N0.y);i.uRiderK.value.set(a>0&&r.through!==!0?gs*ns(a)*d:0,c*.05+Math.min(Math.max(0,N0.y-3.2),4),c);const m=Ae(N0.x,3,N0.z),h=Ce<0||Math.abs(a-Ma)>.02,y=1-Math.exp(-Math.max(e,0)/.4);h?Ce=m:Ce+=(m-Ce)*y,Ma=a;for(let k=0;k<Yt.length;k++){const b=Yt[k];s0.pointAt(Math.min(1,a+b.lead/L0),ro);const S=Ae(ro.x-fe.z/l*b.side,2,ro.z+fe.x/l*b.side);h||b.e<0?b.e=S:b.e+=(S-b.e)*y,b.u.uSunColor.value.copy(b.sun0).multiplyScalar(.24+.56*b.e),b.u.uSkyColor.value.copy(b.shade).lerp(b.sky0,b.e)}ca(a,o,t),re.uniforms.uStrideLen.value=ps(a)/2.6,je.position.set(N0.x,1240,N0.z),ve.update(e,t,o),co.update(e,t,o),uo.update(e,t,o),Q0.update(e,t,o),Gt.update(t),Ne.update(e,t,o),Vt.update(e,t,o),Et.update(e,t,o),Ot.uniforms.uTime.value=t,Xt.uniforms.uTime.value=t,pa.uniforms?.uOpacity&&(pa.uniforms.uOpacity.value=va*(1-.88*X(8,22,N0.y))),ya?.uniforms?.uOpacity&&(ya.uniforms.uOpacity.value=wa*(1-.92*X(4.5,10,N0.y))*(1-X(.5,.6,a))),ba.uniforms?.uIntensity&&(ba.uniforms.uIntensity.value=vs*(1-X(3.4,6,N0.y)));const w=U0(a);fa.uniforms.uIntensity.value=w*(1-ua),da.uniforms.uIntensity.value=w*ua,ls.setOpacity(I0(a)*(.25+.75*Ce)),ds.setOpacity((a>0?.8:.6)*(.3+.7*Ce)*(.35+.65*d)),fs.setOpacity(w0(.3,1,X(.5,.68,a))*hs),ee.update(e,t,o),T0.update(e,t,o,a)},dispose(){ve.dispose?.()}}}var Js={id:"stag-boulevard",name:"A Hundred Springs Later",category:"city",weirdness:.2,media:["water","air"],async build(r){return await r.yield(),qa(null),await r.yield(),qa(r)}};export{Js as default};
