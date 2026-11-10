import*as e from"three";const N=130,ne=20,D=.8,ge=70,Ve=["#12464F","#6B4E9B","#E8A07C","#F6E2A6","#C9CED6","#FBE9D7","#101820"];function de(i,a,s,n){return(Math.abs(i)/s+Math.abs(a)/n-1)*Math.min(s,n)*.7}function Ae(i,a,s,n){const r=i*n/s+.5;if(r<-.05||r>1.05)return 9;const x=Math.abs(a)-(1.15-.5*r),c=10,b=r*c,l=Math.floor(b),L=b-l-.5,A=6.2*Math.sin(Math.min(1,Math.max(0,r))*Math.PI*.86+.25)*(1-.35*r),u=Math.abs(a),o=L*(s/c)-u*.45,t=Math.max(Math.abs(o)-.62*(1-u/Math.max(A,.1))-.3,u-A);return Math.min(x,l>=0&&l<c?t:9)}function xe(i,a,s){const n=Math.atan2(a,i);return Math.hypot(i,a)-s*(.4+.6*Math.pow(Math.abs(Math.cos(2.5*n)),2.4))}function fe(i,a,s){return Math.max(Math.hypot(i,a)-s,s*.82-Math.hypot(i-s*.45,a))}const ee=[[0,-1],[0,1],[.76,1],[.76,-.42],[.3,-.42],[.3,.36],[.52,.36]];function He(i,a,s,n){const r=(i%s+s)%s;let x=Math.abs(a+n);for(let c=0;c<ee.length-1;c++){const b=ee[c][0]*s,l=ee[c][1]*n,L=ee[c+1][0]*s,A=ee[c+1][1]*n,u=L-b,o=A-l,t=Math.min(1,Math.max(0,((r-b)*u+(a-l)*o)/(u*u+o*o)));x=Math.min(x,Math.hypot(r-b-u*t,a-l-o*t))}return x-2.3}async function Pe(i,a=0,s=null){const x=2*Math.PI*N,c=new Uint8Array(1024*128),b=16,l=x/b,L=i.int(0,2),A=[];for(let t=0;t<b;t++)A.push(i.chance(.5)?1:-1);const u=(t,d)=>{const f=Math.min(1,Math.max(0,.5-t/d));return f*f*(3-2*f)};for(let t=0;t<128;t++){s&&await s();const d=((t+.5)/128-.5)*ge;for(let f=0;f<1024;f++){s&&(f&255)===255&&await s();const S=(f+.5)/1024*x,P=Math.floor(S/l)%b,C=S-(P+.5)*l;let h=0;const p=Math.abs(d),v=Math.abs(p-31.5)-1.6;h=Math.max(h,u(v,1.6)*.8);const z=Math.abs(S/(l/12)%1-.5)*(l/12);if(h=Math.max(h,u(Math.max(z-.9,Math.abs(p-26.5)-2.6),1.4)*.62),a===2){h=Math.max(h,u(He(S,d,l/2,19),1.3)),c[t*1024+f]=Math.round(Math.min(1,h)*255);continue}if(a===1){h=Math.max(h,u(xe(C+l*.22,d,9.5),1.2)),h=Math.max(h,u(fe(C-l*.26,d,7.5)*A[P]>-90?fe((C-l*.26)*A[P],d,7.5):9,1.2));for(let H=-1;H<=1;H+=2){const I=d-H*17.5,j=(C+H*l*.125+l*2)%(l/2)-l/4;h=Math.max(h,u(xe(j,I,5.2),1)*.95);const R=(C+H*l*.125+l*2.25)%(l/2)-l/4;h=Math.max(h,u(fe(R*H,I,3.6),.9)*.85)}c[t*1024+f]=Math.round(Math.min(1,h)*255);continue}const w=C+l*.19;h=Math.max(h,u(Ae(w,d,30,A[P]),1.1));const F=C-l*.31,E=Math.hypot(F,d),O=L===1?de(F,d,7,5.2):E-4.5;h=Math.max(h,u(O,1.3)*(1-.75*u(E-1.9,1.2)));for(let H=-1;H<=1;H+=2){const I=d-H*17.5,j=L===2?0:H*l*.125,R=(C+j+l*2)%(l/2)-l/4;h=Math.max(h,u(de(R,I,7,3.6),1.2)*(1-.5*u(de(R,I,3.4,1.5),.9)));const Z=(C+j+l*2.25)%(l/2)-l/4;h=Math.max(h,u(Math.hypot(Z,I)-2.3,1.1)*.85)}c[t*1024+f]=Math.round(Math.min(1,h)*255)}}const o=new e.DataTexture(c,1024,128,e.RedFormat,e.UnsignedByteType);return o.wrapS=e.RepeatWrapping,o.wrapT=e.ClampToEdgeWrapping,o.magFilter=e.LinearFilter,o.minFilter=e.LinearFilter,o.generateMipmaps=!1,o.needsUpdate=!0,o}const $=`
uniform vec2 uBall, uShift, uHeadg, uVel;   // ball centre (local xz), lattice shift, unit heading, velocity
uniform float uRoll, uOmega, uTime, uRip, uWakeAmp;
uniform sampler2D uBelt;
uniform vec3 uSun; uniform vec2 uShelf;
uniform vec3 cTeal, cViolet, cRose, cGold, cSteel, cCream, cInk, cSlate, cHaze;
uniform vec3 uCamL; uniform vec3 uWin;      // camera (local), near-pin window (centre xz in field coords, radius)
// --- the world's cast and fixed works, all written into the same height (see fineH / trenchH) ---
uniform vec4 uCr[9];                        // rays: x, z, heading (radians from +Z toward +X), strength 0..1
uniform float uCrOn, uEelA, uTrOn, uFarOn;
uniform vec4 uPod, uPodB;                   // pod: x0, z0, heading, seconds since the first breach | count, spacing
uniform vec4 uHerd, uHerdB;                 // runners: origin x, z, heading, front s | strength, length, lanes, bend
uniform vec4 uEel;                          // eel: origin x, z, heading, head s
uniform vec4 uTr;                           // trench: start x, z, unit direction x, z
uniform vec3 uTrP;                          // trench profile: metres of descent, where the ramp starts, metres of ramp
uniform vec4 uLev[2];                       // leviathans, long terraced backs beside the wake: x, z, heading, strength
uniform vec4 uMoon;                         // second ball: orbit angle, orbit radius, angular speed, strength
uniform vec3 uWx;                           // weather: rain, swell (m), unused
uniform vec4 uPatch;                        // camera patch: centre x, z, radius, on
uniform vec3 cSkyLo, cSkyHi, cSkySun;       // the sky's own colours (default: rose-gold, cream, pale gold of the finish)
uniform vec2 uRampLum;                     // luminance of the anodised ramp at the datum and at the crown
uniform vec4 uHorz, uCont;                  // a bright horizon line (rgb, strength) | contour colour (rgb, 0 = dark line .. 1 = lit line)
uniform vec4 cShade;                        // the colour shaded sides and shadows fall to (rgb), strength (a)
uniform vec4 uEsc[4];                       // escort marbles: centre xyz, radius (0 = away); they spill an amber caustic on the heads
uniform vec4 uFin;                          // finish: shafts take the ramp colour of at least this height (bare metal under patinated heads) | luminance floor of shaded sides | cool edge light on shaded shafts | paler finish of the cast's raised backs
uniform float uTall;                        // standing pins: how much of their extra height is up (the Henge lowers its pipes as we arrive)
uniform vec4 uGl;                           // per look: broad sun lobe on domed heads | spark reach 0..1 | gold line across each head | far crest bands
`,te=`
#define PITCH ${D.toFixed(3)}
#define ROW (PITCH*0.8660254)
float hash1(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
vec2 pinCell(vec2 f){
  float z = f.y / ROW, x = f.x / PITCH - 0.5 * z, y = -x - z;
  float rx = floor(x + 0.5), ry = floor(y + 0.5), rz = floor(z + 0.5);
  float dx = abs(rx - x), dy = abs(ry - y), dz = abs(rz - z);
  if (dx > dy && dx > dz) rx = -ry - rz; else if (dy <= dz) rz = -rx - ry;
  return vec2(rx, rz);
}
vec2 pinPos(vec2 c){ return vec2(PITCH * (c.x + 0.5 * c.y), ROW * c.y); }
`,ae=`
#define RBALL ${N.toFixed(1)}
#define SINK ${ne.toFixed(1)}
#define BELTW ${ge.toFixed(1)}
float gHa = 0.0;    // set by pinHeight: this pin's height on its rise delay
float gRip = 1.0;   // far tier fades the small ripples out of its slope maths before they alias
float gFine = 1.0;  // 0 where a coarse mesh must not be displaced by the small cast (its fragments still draw them)
float gTrench = 1.0;
float gWk = 1.0;    // the far tier fades the long wake ripples later than the short ones
float gWake = 0.0;  // set by fieldH: 1 on a wake crest, 0 in a hollow or outside the wake
float gEmbA = 0.0;  // set by pinHeight: how far this pin stands proud in a belt motif (0..3 m)
float gEmb = 0.0;   // set by fieldH: the belt emboss at that moment
float gEmbBack = 0.085;   // seconds ago at which the belt emboss is read (its own short clock; pinHeight jitters it per pin)
float gFineCap = 0.3;   // the cast (rays, runners, pod, eel) is never read further back than this: its trailing fringe stays two pins deep
float gBelt = 0.0;  // set by fieldH: 1 inside the belt band on the dome (0 off it)
float gBeltA = 0.0; // set by pinHeight
float gEmbOn = 1.0; // 0: fieldH leaves the emboss out (pinHeight adds it on the short delay, so motif edges stay crisp)
float sm01(float x){ x = clamp(x, 0.0, 1.0); return x * x * (3.0 - 2.0 * x); }
float hashF(vec2 p){ vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
// the unseen cast: rays (slots), a breaching pod, a herd of runners, an eel. Backs only, in pins.
float fineH(vec2 f, float back0, float t0){
  float back = min(back0, gFineCap), t = t0 + back0 - back;
  float h = 0.0;
  if (uCrOn > 0.5) {
    for (int i = 0; i < 9; i++) {
      vec4 c = uCr[i];
      if (c.w < 0.01) continue;
      vec2 hd = vec2(sin(c.z), cos(c.z));
      vec2 q = f - (c.xy - hd * (33.0 * back));
      if (dot(q, q) > 1100.0) continue;
      float a = dot(q, hd), l = abs(q.x * hd.y - q.y * hd.x);
      // a kite in clean levels: a crisp rim one terrace high, the body a second terrace, swept wings whose tips stand a
      // terrace higher and travel in and out, a straight tail ridge two pins wide
      float ak = a + 0.3 * l;
      float k = 1.0 - l / 15.0 - (ak > 0.0 ? ak / 10.5 : -ak / 12.0);
      float rim = smoothstep(0.0, 0.07, k), mid = smoothstep(0.40, 0.47, k);
      float tl = 9.0 + 2.6 * sin(1.6 * t + float(i) * 1.7);
      float tip = smoothstep(0.0, 0.25, 1.0 - length(vec2(l - tl, (ak + 0.5) * 0.8)) / 3.0) * rim;
      float tail = smoothstep(0.0, 0.3, 1.0 - l / 1.1) * sm01((-ak - 9.5) / 2.0) * sm01((27.0 + ak) / 4.0);
      h += c.w * (1.45 * rim + 1.3 * mid + 1.3 * tip * (1.0 - mid) + 1.45 * tail * (1.0 - rim));
    }
  }
  if (uPod.w > -0.5) {
    vec2 hd = vec2(sin(uPod.z), cos(uPod.z)), q = f - uPod.xy;
    float a = dot(q, hd), l = q.x * hd.y - q.y * hd.x;
    float i = clamp(floor(a / uPodB.y + 0.5), 0.0, uPodB.x - 1.0);
    float tp = uPod.w - back - i * 0.62;
    float d = length(vec2(a - i * uPodB.y, l)) / (1.0 + uPodB.z);
    float up = sm01(tp / 0.5) * (1.0 - sm01((tp - 1.3) / 0.8));
    h += 7.4 * (1.0 + uPodB.z) * up * sqrt(max(1.0 - d * d / 72.0, 0.0));
    float ring = max(tp - 1.5, 0.0), rr = d - 8.0 * ring;
    h += 0.9 * sin(rr * 0.9) * sm01(1.0 - abs(rr) / 7.0) * exp(-ring * 0.4) * sm01(ring * 2.0);
  }
  if (uHerdB.x > 0.01) {
    vec2 hd = vec2(sin(uHerd.z), cos(uHerd.z)), q = f - uHerd.xy;
    float s = dot(q, hd), l = q.x * hd.y - q.y * hd.x;
    l -= uHerdB.w * sin(s * 0.011 + 0.6);
    float sr = (uHerd.w - 22.0 * back) - s;
    float LW = 14.0, CL = 26.0, lanes = uHerdB.z;   // loaves well apart: rows of datum heads show between one back and the next
    float env = sm01(sr / 6.0) * sm01((uHerdB.y - sr) / 6.0) * step(abs(l), lanes * LW * 0.5);
    if (env > 0.001) {
      float lf = l / LW + lanes * 0.5, li = floor(lf);
      float so = sr + hashF(vec2(li, 3.7)) * CL, ci = floor(so / CL);
      vec2 jit = vec2(hashF(vec2(ci, li)), hashF(vec2(li, ci) + 9.1)) - 0.5;
      float a = (fract(so / CL) - 0.5) * CL + jit.x * 6.0, b = (fract(lf) - 0.5) * LW + jit.y * 3.4;
      float body = sm01(1.25 * (1.0 - length(vec2(max(abs(a) - 3.3, 0.0), b)) / 2.7));
      float ph = t * 9.0 + (ci + li * 3.0) * 2.4;
      float pr = (a > 0.0 ? 1.0 : -1.0) * (b > 0.0 ? 1.0 : -1.0);
      float leg = sm01(1.0 - length(vec2(abs(a) - 3.0, abs(b) - 1.6)) / 1.5) * max(sin(ph) * pr, 0.0);
      h += uHerdB.x * env * (3.1 * body + 0.8 * leg);
    }
  }
  if (uEelA > 0.01) {
    vec2 hd = vec2(sin(uEel.z), cos(uEel.z)), q = f - uEel.xy;
    float s = dot(q, hd), l = q.x * hd.y - q.y * hd.x;
    float sr = (uEel.w - 14.0 * back) - s;
    float w = 10.0 * sin(s * 0.045 - 1.3 * t) * sm01(sr / 30.0);
    float thick = 6.0 * sm01(sr / 14.0) * (1.0 - 0.72 * sm01((sr - 40.0) / 140.0));
    float body = sm01(sr / 3.0) * sm01((180.0 - sr) / 20.0) * sm01(1.0 - abs(l - w) / max(thick, 0.5));
    h += uEelA * 3.6 * body * (0.82 + 0.18 * sin(sr * 0.8));
  }
  // leviathans: two long backs beside the wake, 11 m high, a dorsal ridge and a tapering tail, their flanks breathing
  for (int i = 0; i < 2; i++) {
    vec4 c = uLev[i];
    if (c.w < 0.01) continue;
    vec2 hd = vec2(sin(c.z), cos(c.z));
    vec2 q = f - (c.xy - hd * (3.0 * back));
    float a = dot(q, hd), l = q.x * hd.y - q.y * hd.x;
    if (abs(a) > 70.0 || abs(l) > 30.0) continue;
    float ta = a > 0.0 ? a / 44.0 : -a / 62.0;                          // blunt head, long tail
    float wd = 21.0 * sqrt(max(1.0 - ta * ta, 0.0)) + 0.01;
    float k = 1.0 - abs(l) / wd;
    float bodyL = sm01(k * 1.25) * (0.74 + 0.26 * sin(a * 0.21 - 1.1 * t + float(i) * 2.0) * sm01(abs(l) / 6.0));
    float ridge = sm01(1.0 - abs(l) / 2.6) * sm01(1.0 - abs(a + 6.0) / 30.0);
    h += c.w * (9.6 * bodyL + 2.6 * ridge) * step(0.0, k);
  }
  // far company: slow low backs wandering the plain, one to a 430 m cell, kept off the flight line
  float lane = smoothstep(120.0, 215.0, abs(f.x - uShift.x - 30.0));
  if (uFarOn > 0.5 && lane > 0.001) {
    vec2 gi = floor(f / 430.0);
    float ha = hashF(gi), hb = hashF(gi + 7.7);
    vec2 c = (gi + 0.5 + (vec2(ha, hb) - 0.5) * 0.42) * 430.0 + 46.0 * vec2(sin(t * 0.045 + ha * 6.28), cos(t * 0.037 + hb * 6.28));
    float d = length(f - c) / (44.0 + 30.0 * fract(ha * 9.1));
    h += lane * step(0.3, hb) * (5.5 + 5.0 * fract(hb * 5.3)) * sm01(1.0 - d) * (0.9 + 0.1 * sin(t * 0.7 + ha * 20.0));
  }
  // pin-art: backs are level terraces of heads, stepping up 1.3 m at a time, flat datum between them
  return mix(h, floor(h / 1.3 + 0.5) * 1.3, 0.88);
}
// the trench: 18 m wide, 22 m deep, 300 m long, its floor ramping up over the last 70 m; a slow ripple runs up it
float trenchH(vec2 f, float t){
  vec2 q = f - uTr.xy;
  float s = dot(q, uTr.zw), l = abs(q.x * uTr.w - q.y * uTr.z);
  float dep = 22.0 * sm01(s / uTrP.x) * (1.0 - sm01((s - uTrP.y) / uTrP.z));
  float wall = 1.0 - smoothstep(8.3, 12.7, l);   // five lattice rows bared down each wall
  return wall * (-dep + 0.55 * sin(0.21 * s - 1.4 * t) * sm01(dep / 6.0));
}
// height of the driving shape at field position f, 'back' seconds ago (closed form, no history)
float fieldH(vec2 f, float back){
  float t = uTime - back;
  float h = uRip * (0.5 + gRip * 0.5 * sin(0.698 * (f.y + 1.7 * sin(f.x * 0.021 + 1.3)) - 0.9 * t));
  h += gRip * uRip * 0.24 * sin(f.x * 0.19 + f.y * 0.05 + 0.6 * t);
  vec2 q = f - (uBall + uShift - uVel * back);
  float al = dot(q, uHeadg), la = dot(q, vec2(uHeadg.y, -uHeadg.x));
  float d2 = dot(q, q), sy = sqrt(max(RBALL * RBALL - d2, 0.0)), cap = max(sy - SINK, 0.0);
  vec2 qe = q - uVel * (back - gEmbBack);
  float ale = dot(qe, uHeadg), lae = dot(qe, vec2(uHeadg.y, -uHeadg.x));
  float ang = atan(ale, sqrt(max(RBALL * RBALL - dot(qe, qe), 0.0)) + 0.001);
  vec2 buv = vec2((ang - (uRoll - uOmega * gEmbBack)) / 6.2831853, lae / BELTW + 0.5);
  float emb = textureLod(uBelt, buv, 0.0).r;
  float band = 1.0 - smoothstep(BELTW * 0.5 - 1.5, BELTW * 0.5, abs(lae));
  float lev = 0.55 * smoothstep(0.26, 0.40, emb) + 0.45 * smoothstep(0.86, 0.96, emb);   // two terraces: 1.65 m and 3 m
  gBelt = band * smoothstep(0.0, 5.0, cap);
  gEmb = 3.0 * lev * gBelt;
  h += cap + gEmb * gEmbOn;
  // wake: field-fixed settling ripples left behind the ball
  float s = -al;
  float env = smoothstep(105.0, 165.0, s) * (1.0 - smoothstep(330.0, 540.0, s)) * (1.0 - smoothstep(42.0, 78.0, abs(la)));
  float fa = dot(f, uHeadg);
  float wk = cos(0.349 * fa + 0.7 * sin(la * 0.07)) * (0.62 + 0.38 * cos(s * 0.11 + 0.45 * t));
  h += uWakeAmp * env * (0.5 + gWk * 0.5 * wk);
  gWake = env * (0.5 + 0.5 * wk);
  // settling trough and rebound just behind the foot
  h -= 1.6 * smoothstep(RBALL - 2.0, RBALL + 8.0, sqrt(d2)) * (1.0 - smoothstep(RBALL + 8.0, RBALL + 34.0, sqrt(d2))) * smoothstep(0.0, 60.0, s) * (1.0 - smoothstep(60.0, 110.0, abs(la)));
  // weather: a long swell under everything
  h += uWx.y * sin(0.021 * f.x + 0.031 * f.y + 0.6 * sin(f.y * 0.008) - 0.55 * t);
  // rare: a second, 90 m ball circling the Roller like a moon, and its looping wake
  if (uMoon.w > 0.01) {
    float phi = uMoon.x - uMoon.z * min(back, 0.8);
    vec2 qm = q - uMoon.y * vec2(sin(phi), cos(phi));
    h += uMoon.w * max(sqrt(max(2025.0 - dot(qm, qm), 0.0)) - 9.0, 0.0);
    float r = sqrt(d2), ang = atan(q.x, (abs(q.x) + abs(q.y) < 1e-4) ? 1.0 : q.y);
    float dA = mod(phi - ang, 6.2831853), dr = r - uMoon.y;
    float e2 = (1.0 - smoothstep(16.0, 48.0, abs(dr))) * smoothstep(0.22, 0.5, dA) * (1.0 - smoothstep(2.4, 5.4, dA));
    h += uMoon.w * 1.5 * e2 * (0.5 + gWk * 0.5 * cos(0.405 * dr + 0.9 * t));
  }
  if (gFine > 0.001) h += gFine * fineH(f, back, t);
  if (gTrench > 0.5 && uTrOn > 0.5) h += trenchH(f, t);
  return h;
}
// long pin shadows: 1 where relief toward the sun stands above this point's line to the sun (three samples)
float reliefShadow(vec2 f, float back){
  float e0 = gEmb, w0 = gWake, b0 = gBelt;
  float h = fieldH(f, back) - 0.25;   // the driving shape against itself, not this pin's own lateness: clean terrace shadows
  float sl = max(length(uSun.xz), 1e-4); vec2 sh = uSun.xz / sl;
  float tn = max(uSun.y / sl, 0.17);   // a sun on the horizon still throws shadows no longer than six heights
  float s = smoothstep(0.0, 0.5, fieldH(f + sh * 2.0, back) - h - 2.0 * tn);
  s = max(s, smoothstep(0.0, 0.7, fieldH(f + sh * 6.0, back) - h - 6.0 * tn));
  s = max(s, smoothstep(0.0, 1.0, fieldH(f + sh * 15.0, back) - h - 15.0 * tn));
  gEmb = e0; gWake = w0; gBelt = b0;
  return s;
}
// the one pin height every tier reads: late by its own friction, fast up, slow down, small overshoot
float pinHeight(vec2 cell, out float hsh){
  vec2 f = pinPos(cell);
  float h1 = hash1(cell), h2 = hash1(cell + 17.31);
  hsh = h1;
  float a = mix(0.05, 0.13, h1), b = mix(0.5, 2.2, h2 * h2);
  // the late, ragged sinking belongs to the steep back: over the crown and for 50 m behind it pins follow promptly, so the
  // belt's terraces cross the top as level sheets
  b = mix(a + 0.12, b, smoothstep(52.0, 100.0, -dot(f - (uBall + uShift), uHeadg)));   // (a narrow spread of rise delays: terraces stay level sheets)
  gEmbBack = 0.06 + 0.05 * h1;
  gFineCap = a + 0.03 + 0.12 * h2 * h2;
  float Ha = fieldH(f, a); float eA = gEmb; gEmbA = eA; gBeltA = gBelt;
  gEmbOn = 0.0; float Hb = fieldH(f, b) + eA; float Hc = fieldH(f, a + 0.25); gEmbOn = 1.0;
  gEmbBack = 0.085; gFineCap = 0.3;
  gHa = Ha;
  float o = max(Ha, Hb) + clamp(0.5 * (Ha - eA - Hc), -0.5, 0.5) + (fract(h1 * 7.13) - 0.5) * 0.06;
  if (uWx.x > 0.01) {   // unseen rain: curtains of one-pin dimples drifting over the field
    float cur = sin(f.x * 0.045 + f.y * 0.021 - uTime * 0.5) * sin(f.y * 0.037 - f.x * 0.013 + uTime * 0.23);
    float cyc = uTime * 0.6 + h2 * 13.7, ph = fract(cyc);
    float hit = step(0.8, fract(h1 * 31.7 + floor(cyc) * 0.618));
    o -= uWx.x * 0.42 * smoothstep(0.3, 0.75, cur) * hit * sin(min(ph * 2.2, 1.0) * 3.14159);
  }
  return o;
}
// 1 in the Roller's analytic shadow (one ray-sphere test)
float rollerShadow(vec3 p){
  vec3 oc = p - vec3(uBall.x, -SINK, uBall.y);
  float b = dot(oc, uSun), dist = sqrt(max(dot(oc, oc) - b * b, 0.0));
  return (1.0 - smoothstep(RBALL - 9.0, RBALL + 4.0, dist)) * smoothstep(-28.0, 75.0, -b);
}
`,oe=`
// the one analytic sky every head mirrors (give the sky dome the same function)
float gCirrus = 1.0;
float gHz = 1.0;    // the far tier's averaged head mirrors only a dome's share of the horizon line
vec3 skyCol(vec3 d0){
  vec3 d = d0 / max(length(d0), 1e-4);
  float y = max(d.y, 0.0);
  vec3 c = mix(cSkyLo * 1.08, cSkyHi * 1.05, smoothstep(0.08, 0.85, y));
  c = mix(c, cSkyHi * 1.02, 0.35 * (1.0 - smoothstep(0.0, 0.10, y)));
  float sd = clamp(dot(d, uSun), 0.0, 1.0);
  float s2 = sd * sd, s8 = s2 * s2 * s2 * s2;
  c = mix(c, cSkySun * 1.25, 0.75 * s8 * s8);
  vec2 hz = d.xz / max(length(d.xz), 1e-4);
  float az = dot(hz, uShelf);
  float hump = smoothstep(0.45, 1.0, az);    // the shelf towers over the exit so the ring stands on slate; a broad swell, no narrow cone
  float top = 0.56 + 0.36 * hump;
  float m = smoothstep(0.05, 0.85, az) * (1.0 - smoothstep(top - 0.32 - 0.16 * hump, top, y));
  c = mix(c, mix(cSlate, cHaze, smoothstep(0.0, 0.46, y)), m * 0.92);
  c *= 1.0 + m * 0.11 * sin(y * 31.0 + 2.6 * hz.x + 1.3 * sin(hz.x * 5.0 + y * 4.0));   // the shelf is layered haze, not a flat wall
  // long thin cirrus bars lying across the course, rose on the sunward edge, cream bodies
  vec2 cp = d.xz / max(y, 0.16);
  float cw = cp.y * 5.2 + 1.5 * cp.x + 2.8 * sin(cp.x * 0.42 + 1.1) + 0.5 * sin(cp.x * 1.9 + cp.y * 0.7) + uTime * 0.02;
  float bar = sin(cw), brk = 0.5 + 0.5 * sin(cp.x * 0.85 + 2.3 * floor(cw / 6.2831853 + 0.25) + 0.8 + 0.6 * sin(cp.y * 0.9));
  float wisp = 0.62 + 0.38 * sin(cp.x * 6.3 + 2.4 * sin(cp.y * 2.1) + 3.0 * bar);
  float cm = wisp * smoothstep(0.84, 1.0, bar) * smoothstep(0.15, 0.27, y) * (1.0 - smoothstep(0.62, 0.9, y)) * smoothstep(0.3, 0.85, brk);
  float edge = smoothstep(0.84, 0.93, bar) * (1.0 - smoothstep(0.93, 1.0, bar));
  vec3 cir = mix(max(cSkyHi, cSkyLo) * 1.2 + 0.07, mix(cSkyLo, cSkySun, 0.35) * 1.3, edge * (0.45 + 0.55 * s2));
  c = mix(c, cir, gCirrus * cm * 0.5 * (1.0 - 0.45 * smoothstep(0.34, 0.7, y)));
  // pre-dawn: one bright line along the horizon, strongest under the sun
  c += uHorz.rgb * uHorz.a * gHz * exp(-y * mix(46.0, 17.0, s2)) * (0.22 + 0.78 * s2);
  return c;
}
`,ue=`
float gInlay = 0.0; // 0..1: this pin stands proud in a belt motif and takes the palest finish of the ramp
float gBump = 1.0;
float gShade = 0.0; // 0..1: this pin stands in the shadow of relief toward the sun
float gBeltF = 0.0; // 0..1: this pin is on the belt (its ground level takes a darker finish, its terraces the palest)
vec3 shadeTint(vec3 col, float w){
  float l = dot(col, vec3(0.30, 0.59, 0.11));
  vec3 sn = cShade.rgb / max(dot(cShade.rgb, vec3(0.30, 0.59, 0.11)), 0.02);
  return mix(col, sn * max(l * 0.5, uFin.y), clamp(w, 0.0, 1.0) * cShade.a);   // shade falls to the shade colour at a floor, never to black
}  // far tier: 0 on sheer faces, where the bright finish of low relief would read as a pale skirt
vec3 anodise(float h){
  // hue from the ramp, luminance held near steel's 0.58 so heads stay mid-grey mirrors with coloured tints
  vec3 r = mix(cTeal, cViolet, smoothstep(0.3, 2.8, h));
  r = mix(r, cRose, smoothstep(20.0, 56.0, h));
  r = mix(r, cGold, smoothstep(58.0, 100.0, h));
  r = mix(r, cGold, 0.6 * gInlay);
  r = mix(r, cViolet, 0.45 * gBeltF * (1.0 - gInlay));   // the belt's ground: a darker finish under its pale terraces
  float lum = dot(r, vec3(0.30, 0.59, 0.11));
  r = min(r / max(lum, 0.03) * (mix(uRampLum.x, uRampLum.y, smoothstep(0.0, 105.0, h)) + 0.32 * gInlay - 0.4 * gBeltF * (1.0 - gInlay) + 0.46 * gBump * smoothstep(0.9, 2.6, h) * (1.0 - smoothstep(7.0, 14.0, h)) - 0.07 * (1.0 - smoothstep(-0.2, 0.6, h))), vec3(1.05));
  float cont = smoothstep(0.03, 0.10, abs(fract(h / 5.0 + 0.5) - 0.5));
  r = mix(r, mix(r * 0.45, uCont.rgb, uCont.a), (1.0 - cont) * smoothstep(1.6, 3.0, h));
  return mix(cSteel * 0.62, r, mix(0.5, 0.74, smoothstep(0.0, 12.0, h)));
}
// level mirror head: n is the dome/chamfer normal, V points from the eye to the surface
vec3 headShade(vec3 n, vec3 V, float h, float shadow, out float glint){
  vec3 r = reflect(V, n); r.y = abs(r.y);
  float fz = 1.0 - clamp(-V.y, 0.0, 1.0); float f2 = fz * fz; fz = f2 * f2 * fz;   // Fresnel: a grazing mirror shows the sky untinted
  vec3 col = skyCol(r) * mix(anodise(h), vec3(0.86), 0.84 * smoothstep(0.02, 0.9, fz));
  float sd = clamp(dot(r, uSun), 0.0, 1.0);
  float g = sd * sd; g *= g; g *= g; g *= g; g *= g; g *= g; g *= g; g *= g; g *= g;   // ^512
  glint = 4.5 * g * g * (1.0 - shadow) * (1.0 - gShade);
  // noon: a wider lobe as well, so the sun's footprint is a patch of sparks on the rims below and ahead of the camera
  float gb = sd * sd; gb *= gb; gb *= gb; gb *= gb; gb *= gb; gb *= gb; gb *= gb; gb *= gb;   // ^256
  glint += uGl.x * gb * (1.0 - shadow) * (1.0 - gShade);
  // pre-dawn: one gold line across every head, the horizon mirrored in its far shoulder, brightest toward the sun
  vec2 vh = V.xz / max(length(V.xz), 1e-4), sh = uSun.xz / max(length(uSun.xz), 1e-4);
  float tl = dot(n.xz, vh) / max(n.y, 0.2);
  float line = 1.0 - smoothstep(0.02, 0.05, abs(tl - 0.13));
  col += uHorz.rgb * (uGl.z * line * (0.3 + 0.7 * smoothstep(-0.5, 0.7, dot(vh, sh))));
  col = shadeTint(col, gShade);
  return mix(col, cSlate * 0.4 + col * 0.45, shadow);
}
// bared shaft: a vertical mirror; nh is its horizontal face normal, depth = metres below its own head
vec3 shaftShade(vec3 nh, vec3 V, float h, float depth, float shadow, float spark){
  vec3 nn = nh / max(length(nh), 1e-4);
  vec3 r = reflect(V, nn); r.y = abs(r.y) + 0.26;   // shafts lean their mirror above the low haze
  vec3 rl = vec3(V.x, abs(V.y) + 0.16, V.z);          // the level reflection: what the heads here show
  vec3 dm = mix(rl, r, 0.72);
  dm.y = mix(0.42 * max(length(dm.xz), 0.3), dm.y, spark);
  gCirrus = spark;
  vec3 col = 0.72 * skyCol(dm) * mix(cSteel * 0.7, anodise(max(h, uFin.x)), 0.8);
  gCirrus = 1.0;
  vec2 rh = r.xz / max(length(r.xz), 1e-4), sh = uSun.xz / max(length(uSun.xz), 1e-4);
  float hd = clamp(dot(rh, sh), 0.0, 1.0); float hl = hd * hd; hl *= hl; hl *= hl; hl *= hl; hl *= hl; hl *= hl;  // ^64
  float lit = max(dot(nn.xz, sh), 0.0);   // a riser turned to the sun is a curtain of hairlines: their average when melted
  col += vec3(1.0, 0.8, 0.5) * mix(0.04 + 0.10 * sqrt(hl) + 0.05 * lit, 2.2 * hl * hl + 0.05 * lit, spark) * (1.0 - shadow) * (1.0 - gShade);
  float shW = max(gShade, 0.85 * (1.0 - smoothstep(-0.45, 0.15, dot(nn.xz, sh))));
  col = shadeTint(col, shW);
  // a dim cool edge of sky light tells one shaded shaft from the next
  float edge = 1.0 - abs(dot(nn.xz, V.xz / max(length(V.xz), 1e-4))); edge *= edge;
  col += cHaze * (uFin.z * edge * shW * spark);
  col = mix(col, cSlate * 0.35 + col * 0.42, shadow);
  return mix(col, cInk, smoothstep(0.4, 3.2, depth) * 0.86);
}
`,we=`
vec3 glassBall(vec3 n, vec3 V, vec2 uv, vec3 right, vec3 up, vec3 amber, float shadow){
  float r2 = min(dot(uv, uv), 1.0), rimT = 1.0 - sqrt(max(1.0 - r2, 0.0));
  vec3 d = V - (right * uv.x + up * uv.y) * (1.25 + 0.5 * r2);
  d = d / max(length(d), 1e-4);
  vec3 sk = skyCol(vec3(d.x, abs(d.y), d.z));
  vec3 gnd = mix(cInk, sk, 0.42);
  vec3 seen = mix(gnd, sk * 1.15, smoothstep(-0.10, 0.03, d.y));
  seen += cSkyHi * 0.5 * exp(-d.y * d.y * 90.0);                      // the horizon itself: one pale line through the ball
  vec3 absorb = mix(amber * 1.3 + vec3(0.3, 0.14, 0.0), vec3(0.62, 0.13, 0.02), smoothstep(0.08, 0.9, rimT));
  vec3 col = seen * absorb * 1.2;
  float focus = max(dot(n, -uSun * vec3(1.0, -0.35, 1.0)), 0.0); focus *= focus; focus *= focus; focus *= focus;
  col += amber * vec3(1.9, 1.3, 0.6) * focus * smoothstep(0.15, 0.7, rimT) * (1.0 - shadow);
  vec3 rs = reflect(V, n); rs.y = abs(rs.y);
  col = mix(col, skyCol(rs), 0.04 + 0.5 * rimT * rimT * rimT);
  float sd = clamp(dot(rs, uSun), 0.0, 1.0); float g = sd * sd; g *= g; g *= g; g *= g; g *= g; g *= g; g *= g; g *= g;   // ^256
  col += vec3(1.0, 0.9, 0.7) * 5.0 * g * (1.0 - shadow);
  return mix(col, col * vec3(0.45, 0.5, 0.62), shadow * 0.7);
}
`,ie=`
${$}
${te}
${ae}
uniform float uLayer, uMode;   // uMode 0: the ball's own polar grid, 1: the camera patch, 2: a static world-fixed mesh
varying vec3 vP; varying float vLow, vDrop;
#include <fog_pars_vertex>
void main(){
  vec2 pl;
  if (uMode < 0.5) { pl = position.x * vec2(uHeadg.y, -uHeadg.x) + position.z * uHeadg + uBall; gFine = 1.0 - smoothstep(172.0, 215.0, length(position.xz)); gTrench = 0.0; }
  else if (uMode < 1.5) { pl = position.xz + uPatch.xy; gFine = 1.0 - smoothstep(uPatch.z * 0.72, uPatch.z * 0.94, length(position.xz)); gTrench = 0.0; }
  else { pl = position.xz; }
  vec2 f = pl + uShift;
  float hNow = fieldH(f, 0.06);
  float h = uMode > 0.5 ? hNow : (uLayer > 0.5 ? hNow - 0.25 : max(hNow, fieldH(f, 2.1)));
  float dW = length(f - uWin.xy);
  float low = uMode > 1.5 ? 1.0 - smoothstep(uWin.z - 7.0, uWin.z - 1.5, dW) : 1.0 - smoothstep(uWin.z - 15.0, uWin.z - 9.5, dW);
  vLow = low;
  vDrop = 2.6 * low + 0.4 * (1.0 - smoothstep(uWin.z - 2.0, uWin.z + 1.0, dW));   // under the thinning pins the ground stays a hand lower
  vP = vec3(pl.x, h - vDrop, pl.y);
  if (uMode > 1.5) {   // the trench mesh steps back behind the real pins of its walls, so their shafts stand free like organ pipes
    vec2 tq = pl - uTr.xy; float tl = tq.x * uTr.w - tq.y * uTr.z, ts = dot(tq, uTr.zw);
    float dep = sm01(ts / uTrP.x) * (1.0 - sm01((ts - uTrP.y) / uTrP.z));
    float push = (tl < 0.0 ? -1.0 : 1.0) * 4.6 * low * dep * smoothstep(7.4, 8.6, abs(tl)) * (1.0 - smoothstep(14.0, 20.0, abs(tl)));
    vP.xz += push * vec2(uTr.w, -uTr.z);
  }
  vec4 mvPosition = modelViewMatrix * vec4(vP, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,re=`
${$}
${te}
${ae}
${oe}
${ue}
uniform float uLayer, uMode;
varying vec3 vP; varying float vLow, vDrop;
#include <fog_pars_fragment>
// FAR HEADS (fix round 4). Past the melt every head is still drawn: one round, soft-edged dot to a cell, dark between, in
// staggered rows like the lattice, in a world-anchored frame turned to one of 64 headings. Cells are sized per axis from the
// pixel's footprint across and along the view (never under uDotPx pixels), so at grazing angles a head stays a round dot
// instead of a dash. gDot (mask, hash) of one level; stipple() blends the four neighbouring levels and returns the dot value
// (average about 0.41) and, through spark, the slow sun sparks of the same cells (a tighter dot, eased over seconds).
vec2 gDot(vec2 q, vec2 s, vec2 sd, vec2 px, float r){
  vec2 u = q / s; float row = floor(u.y); u.x += 0.5 * mod(row, 2.0);
  vec2 c = floor(u), p = fract(u) - 0.5;
  float h = hash1(c + sd);
  p -= (vec2(h, fract(h * 57.31)) - 0.5) * 0.24;
  float w = clamp(max(px.x / s.x, px.y / s.y) * 0.75, 0.06, 0.3);
  return vec2(1.0 - smoothstep(r - w, r + w, length(p)), h);
}
float sparkle(float h, float pS){
  float tw = 0.5 + 0.5 * sin(uTime * (0.7 + 0.9 * fract(h * 13.0)) + h * 251.0);
  return smoothstep(1.0 - pS, 1.0 - 0.6 * pS, h) * tw * tw * tw;
}
float stipple(vec2 f, vec2 px, float k, float minPx, float pS, out float spark){
  k = mod(k, 64.0);
  float th = k * 0.09817477; vec2 ax = vec2(sin(th), cos(th)), ay = vec2(ax.y, -ax.x);
  vec2 q = vec2(dot(f, ay), dot(f, ax));
  vec2 lv = clamp(log2(px * minPx / vec2(PITCH, ROW)), 0.0, 11.0);
  vec2 l0 = floor(lv), lf = smoothstep(0.2, 0.8, lv - l0);
  vec2 s0 = vec2(PITCH, ROW) * exp2(l0), s1 = s0 * 2.0, sd = l0 * 17.0 + k * 5.3;
  vec2 a = gDot(q, s0, sd, px, 0.36), b = gDot(q, vec2(s1.x, s0.y), sd + vec2(17.0, 0.0), px, 0.36);
  vec2 c = gDot(q, vec2(s0.x, s1.y), sd + vec2(0.0, 17.0), px, 0.36), d = gDot(q, s1, sd + 17.0, px, 0.36);
  vec4 wt = vec4((1.0 - lf.x) * (1.0 - lf.y), lf.x * (1.0 - lf.y), (1.0 - lf.x) * lf.y, lf.x * lf.y);
  vec4 m = vec4(a.x, b.x, c.x, d.x);
  spark = dot(wt, m * m * vec4(sparkle(a.y, pS), sparkle(b.y, pS), sparkle(c.y, pS), sparkle(d.y, pS)));
  return dot(wt, m * (0.82 + 0.36 * vec4(a.y, b.y, c.y, d.y)));
}
// melted risers: world-anchored vertical pipes along one lattice axis, never narrower than 4 px and with no cell in
// height, so a steep face is ruled with shafts and can not break into blocks. returns (pipe mask, pipe hash, hairline)
vec3 pipes(float c, float p, float sd){
  float lv = clamp(log2(max(p, 1e-4) * 4.0 / PITCH), 0.0, 12.0), l0 = floor(lv), lf = smoothstep(0.25, 0.75, lv - l0);
  float x0 = c / (PITCH * exp2(l0)), x1 = x0 * 0.5;
  float a0 = abs(fract(x0) - 0.5), a1 = abs(fract(x1) - 0.5);
  float h0 = hash1(vec2(floor(x0), l0 * 7.0 + sd)), h1 = hash1(vec2(floor(x1), l0 * 7.0 + 7.0 + sd));
  float m = mix(1.0 - smoothstep(0.14, 0.46, a0), 1.0 - smoothstep(0.14, 0.46, a1), lf);
  float hl = mix((1.0 - smoothstep(0.0, 0.2, a0)) * step(0.5, h0), (1.0 - smoothstep(0.0, 0.2, a1)) * step(0.5, h1), lf);
  return vec3(m, mix(h0, h1, lf), hl);
}
// crest bands: one octave of the combing ripples, shown while its period is between about 4 and 60 px
float crest(float ph, float lam, float fpy, float t){
  float ppx = lam / max(fpy, 1e-4);
  float c = 0.5 + 0.5 * sin(6.2831853 * ph / lam - t);
  c *= c; c *= c * (0.4 + 0.6 * c);
  return c * smoothstep(5.0, 12.0, ppx) * (1.0 - smoothstep(40.0, 90.0, ppx));
}
void main(){
  vec3 Vd = vP - uCamL; vec3 V = Vd / max(length(Vd), 1e-3);
  vec2 f = vP.xz + uShift;
  // who draws where: the ball's grid within 172 m of it, the static trench mesh in its rectangle, the camera patch elsewhere
  float dB = length(vP.xz - uBall);
  vec2 tq = vP.xz - uTr.xy; float ts = dot(tq, uTr.zw), tl = abs(tq.x * uTr.w - tq.y * uTr.z);
  bool inT = uTrOn > 0.5 && ts > -12.0 && ts < uTrP.y + uTrP.z + 43.0 && tl < 34.0;
  bool inP = uPatch.w > 0.5 && length(vP.xz - uPatch.xy) < uPatch.z - 4.0;
  if (uMode < 0.5) { if (uLayer < 0.5 && dB > 172.0 && (inP || inT)) discard; }
  else if (dB < 170.0 || (uMode < 1.5 && inT)) discard;
  vec2 dfx = dFdx(f), dfy = dFdy(f);
  vec2 fpx = max(abs(dfx) + abs(dfy), vec2(1e-4));   // metres of field a pixel covers, per axis
  float fw = max(fpx.x, fpx.y) / PITCH;
  gRip = 1.0;
  float fwy = fwidth(vP.y);
  vec2 cell = pinCell(f), dl = f - pinPos(cell);
  float hsh; float hc = pinHeight(cell, hsh); float embP = gEmbA; gBeltF = gBeltA;
  gShade = reliefShadow(pinPos(cell), 0.12);
  // top layer: a pin that has already sunk is a hole (the ragged comb); base layer: only the sunk ones
  float hN = gHa, hL = (uMode > 0.5 || dB > 176.0) ? hN : fieldH(pinPos(cell), 2.1), envC = max(hN, hL);
  float up = hc - hN;
  if (uLayer < 0.5) { if (envC - hc > 1.2 && hL > hN + 1.2) discard; } else { if (up > 1.2 && envC - hc <= 1.2) hc -= up; }
  float standing = uLayer > 0.5 ? smoothstep(1.0, 1.6, hc - hN) : 0.0;   // base layer: this pin's top is above us, so what shows here is its shaft
  // analytic slope of the driving surface, and the envelope the tall pins stand at
  gRip = 1.0 - smoothstep(1.2, 4.0, fw * PITCH); gWk = 1.0 - smoothstep(3.0, 9.0, fw * PITCH);
  // (on the leading side the slope is read at the mesh's own moment: 0.6 s ago the foot of the front was still flat
  // ground, and a sheer wall shaded as level heads is the weave that used to hang round the Roller's foot)
  float tG = mix(0.6, 0.06, smoothstep(-12.0, 12.0, dot(vP.xz - uBall, uHeadg)));
  float G0 = fieldH(f, tG);
  vec2 grad = vec2(fieldH(f + vec2(0.4, 0.0), tG) - G0, fieldH(f + vec2(0.0, 0.4), tG) - G0) / 0.4;
  float slope = min(length(grad), 30.0);
  vec2 nh = -grad / max(length(grad), 1e-4);            // downhill: the way the risers face
  if (slope < 0.02) nh = vec2(0.0, 1.0);
  float env = uLayer > 0.5 ? G0 : max(G0, hL);
  float sunk = max(env - hc, 0.0);
  // staircase projection: how much of each step is level tread, how much bared riser
  float vy = max(-V.y, 0.0), vh = max(-dot(V.xz, nh), 0.0) + 0.5 * abs(V.x * nh.y - V.z * nh.x);
  float rise = slope * PITCH;
  float headFrac = clamp((vy + 0.015) / (vy + slope * vh + 0.015), 0.0, 1.0) * (1.0 - standing);
  float shadow = rollerShadow(vec3(vP.x, hc, vP.z));
  // --- the average a cell melts to by 2 px: no shimmer, same energy. Its colour comes from the smooth surface
  // height, so the 5 m contour rings stay clean lines where single pins can no longer be told apart ---
  float hAvg = mix(mix(hc, env, 0.5), max(vP.y + vDrop, G0), 0.9);
  gBump = 1.0 - 0.8 * smoothstep(1.6, 4.0, slope);
  gInlay = clamp(gEmb / 2.4, 0.0, 1.0);
  gHz = mix(0.22, 1.0, smoothstep(50.0, 700.0, length(Vd)));
  float gA; vec3 headA = headShade(vec3(0.0, 1.0, 0.0), V, hAvg, shadow, gA);
  float gB; headA = mix(headA, headShade(normalize(vec3(-V.x * 0.26, 1.0, -V.z * 0.26)), V, hAvg, shadow, gB), 0.3);
  // near the real pins the average also carries what their chamfered rims show (the high sky, the sky abeam), so the
  // hand-over has no step in brightness; with distance the heads read as level mirrors of the low sky
  float chamW = 0.3 * (1.0 - smoothstep(30.0, 260.0, length(Vd)));
  if (chamW > 0.01) {
    vec2 vhz = V.xz / max(length(V.xz), 1e-4); float gC;
    vec3 ch = headShade(normalize(vec3(-vhz.x * 1.1, 1.0, -vhz.y * 1.1)), V, hAvg, shadow, gC);
    ch += headShade(normalize(vec3(-vhz.y * 1.1, 1.0, vhz.x * 1.1)), V, hAvg, shadow, gC);
    ch += headShade(normalize(vec3(vhz.y * 1.1, 1.0, -vhz.x * 1.1)), V, hAvg, shadow, gC);
    headA = mix(headA, ch / 3.0, chamW);
  }
  gHz = 1.0;
  vec3 rl = reflect(V, vec3(0.0, 1.0, 0.0));
  float rs = clamp(dot(rl, uSun), 0.0, 1.0);
  float lobe = rs * rs; lobe *= lobe; lobe *= lobe; lobe *= lobe;
  headA += vec3(1.0, 0.84, 0.56) * (0.55 * lobe * lobe + 0.10 * lobe) * (1.0 - shadow);
  // --- past the melt the plain is still a field of separate mirrors: a world-anchored stipple of small round cells
  // (see stipple), some of them gaps, slow sparks where a dome mirrors the sun, and the ripple crests as light bands ---
  float azv = atan(V.x, (abs(V.x) + abs(V.z) < 1e-5) ? 1.0 : V.z) / 0.09817477, k0 = floor(azv), kw = smoothstep(0.3, 0.7, azv - k0);
  // (cells are sized from the footprint across and along the exact view heading, not the quantised frame's: a frame a
  // few degrees off then shears its cells a little instead of stretching them into dashes)
  vec2 vhx = V.xz / max(length(V.xz), 1e-4), vpx = vec2(vhx.y, -vhx.x);
  vec2 pxS = max(vec2(abs(dot(dfx, vpx)) + abs(dot(dfy, vpx)), abs(dot(dfx, vhx)) + abs(dot(dfy, vhx))), vec2(1e-4));
  float wide = lobe > 0.0 ? sqrt(sqrt(lobe)) : 0.0; wide = wide * sqrt(wide);       // (r.sun)^6: where domes can find the sun
  wide = mix(wide, smoothstep(0.3, 0.72, rs), uGl.y);                              // a high sun reaches further: its footprint
  float pS = 0.004 + 0.34 * wide;
  // heads get finer with distance: 3.4 px cells just outside the real pins, 2.3 px and fainter far out (an even grain)
  float farness = smoothstep(40.0, 520.0, length(Vd));
  float minPx = mix(3.4, 2.3, farness);
  float spA, spB; float gvA = stipple(f, pxS, k0, minPx, pS, spA), gvB = stipple(f, pxS, k0 + 1.0, minPx, pS, spB);
  float gv = mix(gvA, gvB, kw), spk = mix(spA, spB, kw);
  float far1 = 1.0 - smoothstep(7.0, 9.5, log2(max(fpx.x, fpx.y) * 1.7 / PITCH));   // the last cells before the horizon melt away
  float tallW = max(smoothstep(0.3, 1.0, slope), smoothstep(4.0, 12.0, hAvg));       // the Roller and other tall relief: finer, gentler
  // the grain lives in the middle distance: at the horizon (cells would smear into dashes) and looking steeply down from
  // the crown it melts into a satin, and just outside the real pins it is as strong as they are
  float nearW = 1.0 - smoothstep(0.0, 70.0, length(f - uWin.xy) - uWin.z);
  float gAmp = far1 * smoothstep(0.004, 0.03, vy) * (1.0 - 0.55 * smoothstep(0.2, 0.6, vy)) * (1.0 - 0.45 * tallW) * mix(1.0, 0.5, farness);
  float cph = f.y + 1.7 * sin(f.x * 0.021 + 1.3), tb = 0.9 * uTime;
  float bands = crest(cph, 9.0, fpx.y, tb) + crest(cph + 3.0, 36.0, fpx.y, tb * 0.5) + crest(cph + 40.0, 144.0, fpx.y, tb * 0.25) + crest(cph + 110.0, 576.0, fpx.y, tb * 0.12);
  bands = min(bands, 1.2) * uGl.w * (1.0 - tallW) * 0.6 * (1.0 - 0.75 * smoothstep(0.08, 0.3, vy));   // whole thin lines: broken by the grain they read as dashes
  // melted risers: vertical pipes with ink between, ruled along the lattice axis that lies across the face
  vec3 shA = shaftShade(vec3(nh.x, 0.0, nh.y), V, hAvg, 1.6, shadow, 0.0);
  vec2 sunH = uSun.xz / max(length(uSun.xz), 1e-4); float litA = max(dot(nh, sunH), 0.0);
  // (on the Roller the pipes are its meridians, so they stand upright on the dome from every side and never weave)
  float sxw = smoothstep(0.44, 0.56, nh.x * nh.x);
  vec2 qb = vP.xz - uBall;
  float cM = atan(qb.y, (abs(qb.x) + abs(qb.y) < 1e-4) ? 1.0 : qb.x) * 128.0;
  float pM = 128.0 * (abs(qb.x * dfx.y - qb.y * dfx.x) + abs(qb.x * dfy.y - qb.y * dfy.x)) / max(dot(qb, qb), 1.0);
  float ballW = 1.0 - smoothstep(129.0, 137.0, dB);
  vec3 pp = mix(mix(pipes(f.x, fpx.x, 11.0), pipes(f.y, fpx.y, 3.0), sxw), pipes(cM, pM, 5.0), ballW);
  // full contrast on sheer feet and walls, a faint ruling on the staircase of a flank, and none once a pipe would be many pins wide
  float lvP = log2(max(mix(mix(fpx.x, fpx.y, sxw), pM, ballW), 1e-4) * 4.0 / PITCH);
  float sheer = smoothstep(3.0, 6.0, slope);     // a true wall (the trench) keeps its pipes however far it runs
  float pFar = 1.0 - smoothstep(mix(1.2, 9.5, sheer), mix(3.2, 12.0, sheer), lvP);
  float pAmp = smoothstep(0.3, 1.0, slope) * mix(0.34, 0.9, smoothstep(1.4, 5.5, slope)) * pFar;
  vec3 shG = mix(shA * 0.72, mix(mix(cInk, shA, 0.16), shA * (0.8 + 0.5 * pp.y), pp.x), pAmp);
  if (uMode > 1.5) shG *= mix(1.0, 0.86, sheer);   // far trench walls: a little deeper, like the real pipes they continue
  // shaded walls are ruled with pipes too: each one the shade colour at its floor, every other one with a dim cool edge
  float shadedW = (1.0 - smoothstep(-0.45, 0.15, dot(nh, sunH))) * pAmp;
  vec3 snF = cShade.rgb / max(dot(cShade.rgb, vec3(0.30, 0.59, 0.11)), 0.02);
  shG += (snF * (uFin.y * 1.5 * pp.x * (0.5 + pp.y)) + cHaze * (uFin.z * 1.5 * pp.z)) * shadedW * (1.0 - 0.6 * shadow);
  // the sheet of small glints: pipes turned so that they throw the sun at us; it sweeps the flank as we move
  vec3 rS = reflect(V, vec3(nh.x, 0.0, nh.y));
  float sweep = litA * smoothstep(0.1, 0.9, dot(rS.xz / max(length(rS.xz), 1e-4), sunH));
  float ycell = 1.6 * exp2(ceil(clamp(log2(max(fwy, 1e-4) * 3.0 / 1.6), 0.0, 8.0)));
  float seg = hash1(vec2(floor(vP.y / ycell), floor(pp.y * 64.0)));
  float tws = 0.5 + 0.5 * sin(uTime * (0.8 + seg) + seg * 190.0);
  float dotY = 1.0 - smoothstep(0.12, 0.45, abs(fract(vP.y / ycell) - 0.5));
  float pG = smoothstep(0.3, 1.0, slope) * pFar;
  shG += vec3(1.0, 0.82, 0.55) * (pAmp * pp.z * 0.22 * litA * litA + pG * pp.z * dotY * 3.0 * step(1.0 - 0.14 * sweep, seg) * tws * tws + 0.05 * litA * litA) * (1.0 - shadow);
  shG = mix(mix(cInk, shG, 0.62), shG, smoothstep(0.25, 2.2, rise));    // a low riser is mostly the gap beside its shaft
  // each dot a head (bright), the dark between them gaps and the shafts of the next row; the average stays the melted colour
  vec3 hdG = mix(cInk, headA, 0.88) * mix(1.0, 0.46 + 1.32 * gv, gAmp);
  float wkB = gWake * gWake * (1.0 - smoothstep(0.3, 1.0, slope));
  hdG *= (1.0 + 0.5 * bands) * (1.0 + (0.8 + 0.7 * smoothstep(0.1, 0.4, vy)) * wkB * far1);
  hdG += vec3(1.0, 0.86, 0.6) * ((3.2 * spk * far1 * smoothstep(0.006, 0.03, vy) + 0.10 * bands * sqrt(wide)) * (1.0 - shadow) * (1.0 - gShade));
  vec3 avg = mix(shG, hdG, headFrac);
  float melt = smoothstep(0.25, 0.5, max(fw, fwy / max(rise + PITCH, PITCH) * 0.5));
  melt = max(melt, smoothstep(0.07, 0.19, fw) * (1.0 - headFrac) * smoothstep(0.3, 1.2, rise));   // steep risers melt sooner: their stripes moire first
  vec3 col = avg;
  if (melt < 0.995) {
    gInlay = clamp(embP / 2.4, 0.0, 1.0);
    float e = clamp(dot(dl, -nh) / PITCH, -0.5, 0.5) + (hsh - 0.5) * 0.25 * (1.0 - headFrac);   // + uphill
    float lat = dot(dl, vec2(-nh.y, nh.x));
    float split = 0.5 - headFrac;
    // tread: the level head, re-expanded to a full hexagon
    float te = (e - split) / max(headFrac, 0.02) - 0.5;
    vec2 hp = lat * vec2(-nh.y, nh.x) - nh * (te * PITCH);
    hp = mix(dl, hp, smoothstep(0.02, 0.2, slope));
    float hexd = max(abs(hp.x), abs(hp.x) * 0.5 + abs(hp.y) * 0.8660254);
    float rim = smoothstep(0.27, 0.36, hexd);
    vec3 n = normalize(vec3(hp.x * (0.55 + 1.7 * rim), 1.0, hp.y * (0.55 + 1.7 * rim)));
    float glint; vec3 head = headShade(n, V, hc, shadow, glint);
    head += vec3(1.0, 0.88, 0.62) * glint;
    float aa = clamp(fw * 1.2, 0.01, 0.2);
    vec3 tread = mix(head, cInk, smoothstep(0.37 - aa, 0.37 + aa, hexd));
    // riser: this pin's shaft with its hairline, the staggered row behind it, then the dark of deeper rows
    float rr = clamp((split - e) / max(1.0 - headFrac, 0.02), 0.0, 1.0);
    float depth = rr * min(rise, 1.2) * 0.5;
    float ang = (hsh - 0.5) * 1.0 + clamp(lat / 0.11, -1.0, 1.0) * 0.55, ca = cos(ang), sa = sin(ang);
    vec3 nf = vec3(nh.x * ca - nh.y * sa, 0.0, nh.x * sa + nh.y * ca);
    vec3 sh1 = shaftShade(nf, V, hc, depth, shadow, 1.0);
    vec3 sh2 = shaftShade(vec3(nf.z, 0.0, -nf.x) * 0.6 + vec3(nh.x, 0.0, nh.y) * 0.8, V, hc, depth + 0.9, shadow, 1.0);
    float m1 = 1.0 - smoothstep(0.11 - aa * 0.5, 0.11 + aa * 0.5, abs(lat));
    float m2 = 1.0 - smoothstep(0.10 - aa * 0.5, 0.10 + aa * 0.5, abs(abs(lat) - 0.4));
    vec3 sh3 = mix(shA, cInk, mix(0.35, 0.72, smoothstep(1.0, 5.0, rise)));
    vec3 riser = mix(mix(sh3, sh2, m2), sh1, m1);
    vec3 det = mix(riser, tread, step(split, e));
    // a pin that has sunk a little between tall neighbours is a dark slot
    det = mix(det, mix(cInk, sh3, 0.4), smoothstep(0.5, 2.5, sunk) * mix(0.2, 0.75, vy));
    col = mix(det, avg, melt);
  }
  // under the real pins: never a smooth surface, only the next rows of shafts going down into ink
  float latU = uMode > 1.5 ? dot(dl, uTr.zw) : dot(dl, vec2(-nh.y, nh.x));
  float stU = max(1.0 - smoothstep(0.08, 0.14, abs(latU)), 0.6 * (1.0 - smoothstep(0.07, 0.12, abs(abs(latU) - 0.4)))) * (1.0 - melt);
  col = mix(col, mix(cInk, shA, uMode > 1.5 ? 0.3 + 0.55 * stU : 0.07 + 0.14 * stU), vLow);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;async function Be(i,a=null){const s=[0];let n=0;for(;n<100;)n+=4,s.push(n);for(;n<134;)n+=1.25,s.push(n);for(;n<180;)n+=3,s.push(n);for(;n<560;)n+=5,s.push(n);for(;n<i;)n*=1.3,s.push(n);const r=208,x=s.length,c=new Float32Array(x*r*3),b=[];for(let o=0;o<x;o++)for(let t=0;t<r;t++){const d=t/r*Math.PI*2,f=(o*r+t)*3;c[f]=Math.sin(d)*s[o],c[f+1]=0,c[f+2]=Math.cos(d)*s[o]}a&&await a();for(let o=0;o<x-1;o++){a&&o%6===5&&await a();for(let t=0;t<r;t++){const d=o*r+t,f=o*r+(t+1)%r,S=(o+1)*r+t,P=(o+1)*r+(t+1)%r;if(o===0){b.push(d,S,P);continue}b.push(d,S,f,f,S,P)}}a&&await a();const l=new e.BufferGeometry;l.setAttribute("position",new e.BufferAttribute(c,3));const L=new Uint32Array(b.length);for(let o=0;o<b.length;o+=3e4)L.set(b.slice(o,o+3e4),o),a&&await a();l.setIndex(new e.BufferAttribute(L,1));const A=[];for(let o=1;o<x-1;o++)if(a&&o%8===7&&await a(),!(s[o+1]>162))for(let t=Math.round(r*.195);t<Math.round(r*.805);t++){const d=o*r+t,f=o*r+(t+1)%r,S=(o+1)*r+t,P=(o+1)*r+(t+1)%r;A.push(d,S,f,f,S,P)}const u=new e.BufferGeometry;return u.setAttribute("position",l.getAttribute("position")),u.setIndex(new e.BufferAttribute(new Uint32Array(A),1)),a&&await a(),{top:l,base:u}}const ye=`
${$}
${te}
${ae}
attribute float aKind;      // 0 head, 1 underside, 2 shaft top, 3 shaft foot
attribute vec2 aCell;       // per instance: offset coordinates inside the window
uniform vec2 uWinCell, uWinN;
#ifdef FIXED
attribute vec4 aLift;       // standing pins (columns, collar): height, chase amplitude, chase phase, extra height (times uTall)
#endif
varying vec3 vP, vN; varying float vKind, vH, vDepth, vShadow, vEmb, vShade, vBelt;
#include <fog_pars_vertex>
void main(){
  vec2 ij = aCell + floor((uWinCell - aCell) / uWinN + 0.5) * uWinN;
  vec2 cell = vec2(ij.x - floor(ij.y * 0.5 + 0.001), ij.y);
  vec2 fp = pinPos(cell);
  float hsh; float hc = pinHeight(cell, hsh);
  vEmb = gEmbA; vBelt = gBeltA;
  vShade = reliefShadow(fp, 0.12);
#ifdef FIXED
  vShade = 0.0;
  float lift = aLift.x + aLift.w * uTall + aLift.y * (0.5 + 0.5 * sin(uTime * 0.9 + aLift.z)), sc = 1.0;
  hc += lift;
#else
  float edge = uWin.z - 0.6 - 9.0 * fract(hsh * 23.7);
  float lift = 0.0, sc = 1.0 - smoothstep(edge - 1.6, edge, length(fp - uWin.xy));
#endif
  vec3 lp = position, ln = normal;
  if (aKind > 1.5) {
    float a = hsh * 6.2831853, c = cos(a), s = sin(a);
    lp.xz = vec2(lp.x * c - lp.z * s, lp.x * s + lp.z * c);
    ln.xz = vec2(ln.x * c - ln.z * s, ln.x * s + ln.z * c);
  }
  lp.xz *= sc;
  float y = hc + lp.y;
  if (aKind > 2.5) y = hc - 24.0 - lift;
  float G0 = fieldH(fp, 0.6);
  vec2 grad = vec2(fieldH(fp + vec2(0.4, 0.0), 0.6) - G0, fieldH(fp + vec2(0.0, 0.4), 0.6) - G0) / 0.4;
  float nb = min(hc, G0 + 0.2) - min(length(grad), 30.0) * PITCH * 1.5;
#ifdef FIXED
  nb = G0 + 0.2;
#endif
  vDepth = nb;
  vKind = aKind; vH = hc; vN = ln;
  vP = vec3(fp.x - uShift.x + lp.x, y, fp.y - uShift.y + lp.z);
  vShadow = rollerShadow(vec3(vP.x, hc, vP.z));
  vec4 mvPosition = modelViewMatrix * vec4(vP, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,be=`
${$}
${oe}
${ue}
varying vec3 vP, vN; varying float vKind, vH, vDepth, vShadow, vEmb, vShade, vBelt;
#include <fog_pars_fragment>
void main(){
  vec3 Vd = vP - uCamL; vec3 V = Vd / max(length(Vd), 1e-3);
  vec3 n = vN / max(length(vN), 1e-4);
  vec3 col;
  gInlay = clamp(vEmb / 2.4, 0.0, 1.0); gBeltF = vBelt; gShade = vShade;
  if (vKind < 0.5) {
    float glint; col = headShade(n, V, vH, vShadow, glint);
    col += vec3(1.0, 0.88, 0.62) * glint;
    // amber light focused through an escort marble: a hot spot spilled over the heads on the side away from the sun
    vec2 shz = uSun.xz / max(length(uSun.xz), 1e-4);
    for (int i = 0; i < 4; i++) {
      vec4 e = uEsc[i];
      vec2 dq = vP.xz - (e.xz - shz * (0.9 * e.w + 0.35 * max(e.y - vP.y, 0.0)));
      float fall = 1.0 - smoothstep(1.5, 13.0, e.y - vP.y);
      col += vec3(1.0, 0.56, 0.16) * (2.6 * fall * step(0.05, e.w) * exp(-dot(dq, dq) / max(1.6 * e.w * e.w + 0.6, 0.1)));
    }
  } else if (vKind < 1.5) {
    col = mix(cInk, cSteel * 0.6 * mix(cTeal, cSlate, 0.5) * 3.0, 0.35);
  } else {
    // far shafts melt toward their average: sub-pixel hairlines would only shimmer
    col = shaftShade(n, V, vH, max(vDepth - vP.y, 0.0) + 0.25, vShadow, 1.0 - 0.55 * smoothstep(20.0, 58.0, length(Vd)));
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function Ce(i,a){const s=[],n=[],r=[],x=[],c=(p,v,z,w,F,E,O)=>{const H=Math.hypot(w,F,E)||1;return s.push(p,v,z),n.push(w/H,F/H,E/H),r.push(O),s.length/3-1},b=.37/Math.cos(Math.PI/6),l=b*.7,L=c(0,0,0,0,1,0,0),A=[],u=[],o=[],t=[];for(let p=0;p<6;p++){const v=p/6*Math.PI*2+Math.PI/6,z=Math.cos(v),w=Math.sin(v);A.push(c(z*l,-.022,w*l,z*.22,1,w*.22,0)),u.push(c(z*l,-.022,w*l,z*.9,1,w*.9,0)),o.push(c(z*b,-.095,w*b,z*1.5,1,w*1.5,0)),t.push(c(z*b,-.12,w*b,0,-1,0,1))}for(let p=0;p<6;p++){const v=(p+1)%6;x.push(L,A[v],A[p]),x.push(u[p],u[v],o[v],u[p],o[v],o[p])}x.push(t[0],t[1],t[2],t[0],t[2],t[3],t[0],t[3],t[5],t[3],t[4],t[5]);const d=.127;for(let p=0;p<3;p++){const v=p/3*Math.PI*2,z=(p+1)/3*Math.PI*2,w=(v+z)/2,F=.55,E=Math.cos(w-F),O=Math.sin(w-F),H=Math.cos(w+F),I=Math.sin(w+F),j=c(Math.cos(v)*d,-.12,Math.sin(v)*d,E,0,O,2),R=c(Math.cos(z)*d,-.12,Math.sin(z)*d,H,0,I,2),Z=c(Math.cos(v)*d,-1,Math.sin(v)*d,E,0,O,3),he=c(Math.cos(z)*d,-1,Math.sin(z)*d,H,0,I,3);x.push(j,Z,R,R,Z,he)}const f=Math.sqrt(i*D*D*.8660254),S=Math.max(8,Math.round(f/D)),P=Math.max(8,Math.round(f/(D*.8660254)/2)*2),C=new Float32Array(S*P*2);for(let p=0,v=0;p<P;p++)for(let z=0;z<S;z++)C[v++]=z,C[v++]=p;const h=new e.InstancedBufferGeometry;return h.setAttribute("position",new e.Float32BufferAttribute(s,3)),h.setAttribute("normal",new e.Float32BufferAttribute(n,3)),h.setAttribute("aKind",new e.Float32BufferAttribute(r,1)),h.setAttribute("aCell",new e.InstancedBufferAttribute(C,2)),h.setIndex(x),h.instanceCount=S*P,{geometry:h,nx:S,nz:P,radius:Math.min(S*D,P*D*.8660254)*.5,tris:x.length/3*S*P}}const Te=`
${$}
${te}
${ae}
attribute vec4 aSeed;
uniform float uCycle;
varying vec2 vUv; varying vec3 vC, vRight, vUp, vFwd; varying float vShadow, vFade;
#include <fog_pars_vertex>
void main(){
  float tl = fract(uTime / uCycle + aSeed.x) * uCycle;
  float Td = 15.0 + 7.0 * aSeed.y;
  float side = aSeed.z < 0.5 ? -1.0 : 1.0;
  float sf = fract(aSeed.z * 2.0); float strm = floor(sf * sqrt(sf) * 5.0);   // more of them pour down the streams beside the flight line
  float psi = side * (0.19 + strm * 0.52 + (aSeed.w - 0.5) * 0.14);   // five streams a side; the first runs down the belt beside the flight line
  vec2 perp = vec2(uHeadg.y, -uHeadg.x);
  vec2 dir = uHeadg * cos(psi) + perp * sin(psi);
  // stage 1: lifted out at the crown, pours down the flank, faster and bouncing higher as it goes
  float x = clamp(tl / Td, 0.0, 1.0);
  float rho = mix(3.0 + 9.0 * aSeed.w, RBALL - 0.5, x * x * (0.55 + 0.45 * x));
  vec2 pb = dir * rho + perp * sin(tl * 0.9 + aSeed.x * 40.0) * 1.2 * x;
  // stage 2: left behind in the field, it rolls into the nearest wake hollow and pools there
  float t2 = max(tl - Td, 0.0);
  vec2 left = dir * (RBALL - 0.5) - uVel * t2;
  vec2 F1 = left + uBall + uShift;
  float la = dot(left, perp), fa = dot(F1, uHeadg);
  float laP = side * (6.0 + 30.0 * aSeed.w * aSeed.w) + (fract(aSeed.x * 91.7) - 0.5) * 9.0;
  float nP = floor((0.349 * fa + 0.7 * sin(laP * 0.07) - 3.14159) / 12.56637 + 0.5);
  float faP = (12.56637 * nP + 3.14159 - 0.7 * sin(laP * 0.07)) / 0.349 + (fract(aSeed.y * 57.3) - 0.5) * 6.0;
  float settle = smoothstep(1.0, 9.0 + 5.0 * aSeed.y, t2);
  vec2 pooled = left + uHeadg * (faP - fa) * settle + perp * (laP - la) * settle;
  vec2 p = t2 > 0.0 ? pooled : pb;
  vec2 F = p + uBall + uShift;
  float h = fieldH(F, 0.3);
  float leap = (strm < 0.5 && side > 0.0 && fract(aSeed.y * 7.3) < 0.6) ? 1.9 : 1.0;   // the stream beside the flight line bounds up to our height
  float hopA = (0.4 + 3.4 * x * x) * leap * (1.0 - settle) * (t2 > 0.0 ? exp(-t2 * 0.6) : 1.0);
  float hop = abs(sin(tl * (2.2 + aSeed.y) + aSeed.x * 60.0)) * hopA;
  float life = smoothstep(0.0, 1.6, tl) * (1.0 - smoothstep(uCycle - 2.5, uCycle, tl));
  vec3 C = vec3(p.x + uBall.x, h + 0.6 + hop - (1.0 - life) * 2.4, p.y + uBall.y);
  vec4 mv = modelViewMatrix * vec4(C, 1.0);
  float rad = max(0.62 + 0.26 * (1.0 - settle), -mv.z * 0.0028);
  vUv = position.xy; vC = C; vFade = life;
  vRight = vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]);
  vUp = vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]);
  vFwd = vec3(modelViewMatrix[0][2], modelViewMatrix[1][2], modelViewMatrix[2][2]);
  vShadow = rollerShadow(C);
  vec4 mvPosition = mv + vec4(position.xy * rad, 0.0, 0.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Le=`
${$}
${oe}
${we}
uniform vec3 cAmber;
varying vec2 vUv; varying vec3 vC, vRight, vUp, vFwd; varying float vShadow, vFade;
#include <fog_pars_fragment>
void main(){
  float r2 = dot(vUv, vUv);
  if (r2 > 1.0 || vFade < 0.02) discard;
  float nz = sqrt(max(1.0 - r2, 0.0));
  vec3 n = vRight * vUv.x + vUp * vUv.y + vFwd * nz;
  n = n / max(length(n), 1e-4);
  vec3 Vd = vC - uCamL; vec3 V = Vd / max(length(Vd), 1e-3);
  vec3 col = glassBall(n, V, vUv, vRight, vUp, cAmber, vShadow);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function qe(i,a){const s=new e.InstancedBufferGeometry;s.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),s.setIndex([0,1,2,0,2,3]);const n=new Float32Array(i*4);for(let r=0;r<i*4;r++)n[r]=a();return s.setAttribute("aSeed",new e.InstancedBufferAttribute(n,4)),s.instanceCount=i,s}async function Fe(i,a={}){const s=i.rng.fork?i.rng.fork("roller"):i.rng,n=(a.palette&&a.palette.length>=7?a.palette:Ve).map(y=>new e.Color(y)),r=Math.min(1,Math.max(.6,a.detail??i.quality?.detail??1)),x=a.speed??9,c=a.debugView??null,b=s.range(-.025,.025);n.slice(0,4).forEach(y=>y.offsetHSL(b,0,0));const l=a.sunDir?0:s.range(.85,1.25)*(a.sunSide??1),L=14*Math.PI/180,A=a.sunDir?new e.Vector3().copy(a.sunDir).normalize():new e.Vector3(Math.sin(l)*Math.cos(L),Math.sin(L),Math.cos(l)*Math.cos(L)),u=a.shelfDir?new e.Vector2(a.shelfDir.x,a.shelfDir.z??a.shelfDir.y).normalize():new e.Vector2(-A.x-.35,-A.z-.75).normalize(),o=await Pe(s,a.belt??0,i.yield?()=>i.yield():null);await i.yield?.();const t={uBall:{value:new e.Vector2(0,0)},uShift:{value:new e.Vector2(0,0)},uHeadg:{value:new e.Vector2(0,1)},uVel:{value:new e.Vector2(0,x)},uRoll:{value:0},uOmega:{value:x/N},uTime:{value:0},uRip:{value:a.ripple??.5},uWakeAmp:{value:a.wake??s.range(1.3,1.7)},uBelt:{value:o},uSun:{value:A},uShelf:{value:u},cTeal:{value:n[0]},cViolet:{value:n[1]},cRose:{value:n[2]},cGold:{value:n[3]},cSteel:{value:n[4]},cCream:{value:n[5]},cInk:{value:n[6]},cSlate:{value:new e.Color("#3E5266")},cHaze:{value:new e.Color("#6F8196")},uCamL:{value:new e.Vector3(0,60,300)},uWin:{value:new e.Vector3(0,300,20)},uCr:{value:Array.from({length:9},()=>new e.Vector4)},uCrOn:{value:0},uEelA:{value:0},uTrOn:{value:0},uFarOn:{value:0},uPod:{value:new e.Vector4(0,0,0,-1)},uPodB:{value:new e.Vector4(7,18,0,0)},uHerd:{value:new e.Vector4},uHerdB:{value:new e.Vector4(0,150,4,16)},uEel:{value:new e.Vector4},uTr:{value:new e.Vector4(0,-1e5,0,-1)},uTrP:{value:new e.Vector3(70,232,68)},uLev:{value:[new e.Vector4(0,0,0,0),new e.Vector4(0,0,0,0)]},uMoon:{value:new e.Vector4(0,215,.1,0)},cSkyLo:{value:new e.Color(a.skyLo??n[2])},cSkyHi:{value:new e.Color(a.skyHi??n[5])},cSkySun:{value:new e.Color(a.skySun??n[3])},uRampLum:{value:new e.Vector2(.44,.86)},uHorz:{value:new e.Vector4(1,.8,.5,0)},uCont:{value:new e.Vector4(0,0,0,0)},uGl:{value:new e.Vector4(0,0,0,1)},uFin:{value:new e.Vector4(0,.03,.09,0)},uTall:{value:1},cShade:{value:new e.Vector4(.02,.11,.13,.75)},uEsc:{value:Array.from({length:4},()=>new e.Vector4(0,-50,0,0))},uWx:{value:new e.Vector3(0,0,0)},uPatch:{value:new e.Vector4(0,0,240,0)}},d=(y,k,B={},g={})=>new e.ShaderMaterial({uniforms:{...t,...B,...e.UniformsUtils.clone(e.UniformsLib.fog)},vertexShader:y,fragmentShader:k,fog:!0,side:e.DoubleSide,defines:g}),f=new e.Group;f.name="TheRoller";const S=await Be(a.plainRadius??3200,i.yield?()=>i.yield():null),P=S.top,C=new e.Mesh(P,d(ie,re,{uLayer:{value:0},uMode:{value:0}}));C.frustumCulled=!1,f.add(C),await i.yield?.();const h=d(ie,re,{uLayer:{value:1},uMode:{value:0}});h.polygonOffset=!0,h.polygonOffsetFactor=2,h.polygonOffsetUnits=4;const p=new e.Mesh(S.base,h);p.frustumCulled=!1,f.add(p),await i.yield?.();let v=null;(a.skyDome??!1)&&(v=new e.Mesh(new e.SphereGeometry(2600,32,16),new e.ShaderMaterial({uniforms:t,side:e.BackSide,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`${$}${oe} varying vec3 vD; void main(){ vec3 d = vD / max(length(vD), 1e-3);
        vec3 c = skyCol(vec3(d.x, abs(d.y), d.z)); float sd = max(dot(d, uSun), 0.0);
        c += vec3(1.0, 0.86, 0.6) * 5.0 * smoothstep(0.99985, 0.99994, sd);
        gl_FragColor = vec4(c, 1.0); }`})),v.renderOrder=-.5,v.frustumCulled=!1,f.add(v)),await i.yield?.();const z=Math.round((a.nearPins??2850)*r),w=Ce(z,s),F={uWinCell:{value:new e.Vector2},uWinN:{value:new e.Vector2(w.nx,w.nz)}},E=new e.Mesh(w.geometry,d(ye,be,F));E.frustumCulled=!1,f.add(E),t.uWin.value.z=w.radius-.5,await i.yield?.();const O=a.marbles??600,H={uCycle:{value:72},cAmber:{value:new e.Color(a.amber??"#F2A33C")}};await i.yield?.();const I=new e.Mesh(qe(O,s),d(Te,Le,H));I.frustumCulled=!1,f.add(I);const j=D*.8660254;let R=null;if(await i.yield?.(),a.patch){const y=[0];let k=0;const B=a.patchRadius??240,g=128;for(;k<B;)k+=Math.max(1.8,k*.042),y.push(k);const m=y.length,V=new Float32Array(m*g*3),G=[];for(let M=0;M<m;M++)for(let W=0;W<g;W++){const _=(W+M%2*.5)/g*Math.PI*2,U=(M*g+W)*3;V[U]=Math.sin(_)*y[M],V[U+1]=0,V[U+2]=Math.cos(_)*y[M]}for(let M=0;M<m-1;M++)for(let W=0;W<g;W++){const _=M*g+W,U=M*g+(W+1)%g,se=(M+1)*g+W,le=(M+1)*g+(W+1)%g;if(M===0){G.push(_,se,le);continue}M%2?G.push(_,le,U,_,se,le):G.push(_,se,U,U,se,le)}await i.yield?.();const T=new e.BufferGeometry;T.setAttribute("position",new e.BufferAttribute(V,3)),T.setIndex(new e.BufferAttribute(new Uint32Array(G),1)),R=new e.Mesh(T,d(ie,re,{uLayer:{value:0},uMode:{value:1}})),R.frustumCulled=!1,f.add(R),t.uPatch.value.set(0,0,y[m-1],1),await i.yield?.()}function Z(y){const k=new e.Mesh(y,d(ie,re,{uLayer:{value:0},uMode:{value:2}}));return k.frustumCulled=!1,f.add(k),k}function he(y){const k=new Float32Array(y.length*2),B=new Float32Array(y.length*4),g=new Set;let m=0;for(const T of y){const M=Math.round(T.z/j),W=Math.round(T.x/D-.5*M),_=W+Math.floor(M*.5+.001),U=_+","+M;g.has(U)||(g.add(U),k[m*2]=_,k[m*2+1]=M,B[m*4]=T.lift,B[m*4+1]=T.chase||0,B[m*4+2]=T.phase||0,B[m*4+3]=T.extra||0,m++)}const V=new e.InstancedBufferGeometry;for(const T of["position","normal","aKind"])V.setAttribute(T,w.geometry.getAttribute(T));V.setIndex(w.geometry.getIndex()),V.setAttribute("aCell",new e.InstancedBufferAttribute(k.slice(0,m*2),2)),V.setAttribute("aLift",new e.InstancedBufferAttribute(B.slice(0,m*4),4)),V.instanceCount=m;const G=new e.Mesh(V,d(ye,be,{uWinCell:{value:new e.Vector2(0,0)},uWinN:{value:new e.Vector2(4e6,4e6)}},{FIXED:1}));return G.frustumCulled=!1,f.add(G),G}const me=new e.Vector3(0,-ne,0),q=(y,k,B)=>{const g=y*Math.PI/180,m=k*Math.PI/180;return new e.Vector3(Math.sin(g)*Math.sin(m),Math.cos(m),Math.cos(g)*Math.sin(m)).multiplyScalar(N+B).add(me)},ke={crown:new e.Vector3(0,N-ne+3,0),ballCentre:me.clone(),flyThrough:[new e.Vector3(96,12,300),new e.Vector3(104,9,215),new e.Vector3(110,9,150),q(52,77,9),q(44,62,9),q(34,44,9),q(22,26,9.5),q(0,8,10),q(180,12,10),q(180,34,11),q(180,52,14),new e.Vector3(0,30,-150),new e.Vector3(0,9,-215),new e.Vector3(0,8,-330),new e.Vector3(0,8,-480)],portalSeat:{position:new e.Vector3(0,9,-600),normal:new e.Vector3(0,0,1)},viewpoints:{entry:{position:new e.Vector3(135,12,520),lookAt:new e.Vector3(0,70,0)},flank:{position:q(48,68,9),lookAt:q(20,50,0)},crown:{position:q(0,6,10),lookAt:new e.Vector3(0,60,-260)},wake:{position:new e.Vector3(0,8,-260),lookAt:new e.Vector3(0,2,-420)}},wake:{start:new e.Vector3(0,0,-130),end:new e.Vector3(0,0,-530),width:150},sunDir:A.clone(),shelfDir:new e.Vector3(u.x,0,u.y)};let pe=!1;const K=new e.Vector3,Q=new e.Vector3,ce=new e.Matrix4,ze=D*.8660254;function Me(y,k,B,g=0,m=x){pe=!0,t.uBall.value.set(y,k),t.uShift.value.set(0,0),t.uRoll.value=B,t.uVel.value.set(g,m);const V=Math.hypot(g,m);V>.001&&t.uHeadg.value.set(g/V,m/V),t.uOmega.value=V/N}function ve(y,k,B){if(t.uTime.value=k,pe||(t.uShift.value.set(0,x*k),t.uRoll.value=x/N*k),!B)return;f.updateWorldMatrix(!0,!1),ce.copy(f.matrixWorld).invert(),B.getWorldPosition(K).applyMatrix4(ce),B.getWorldDirection(Q).transformDirection(ce),t.uCamL.value.copy(K),v&&v.position.copy(K);const g=t.uWin.value.z,m=Math.hypot(Q.x,Q.z),V=g*.62*Math.min(1,m*1.4),G=K.x+(m>1e-4?Q.x/m:0)*V+t.uShift.value.x,T=K.z+(m>1e-4?Q.z/m:1)*V+t.uShift.value.y;t.uWin.value.x=G,t.uWin.value.y=T,R&&(t.uPatch.value.x=K.x,t.uPatch.value.y=K.z);const M=Math.round(T/ze);F.uWinCell.value.set(Math.round(G/D-.5*((M%2+2)%2)),M)}function Se(y,k,B=t.uBall.value.x,g=t.uBall.value.y){const m=(y-B)**2+(k-g)**2,V=Math.max(0,Math.sqrt(Math.max(0,N*N-m))-ne);return V+(V>0?3.2:0)+t.uRip.value*1.3+t.uWakeAmp.value+1.2}ve(0,0,null);let X=150,Y=113,J=new e.Vector3(0,46,0);return c==="flank"?(X=9,Y=22,J=q(48,70,0)):c==="crown"?(X=10,Y=16,J=new e.Vector3(0,113,0)):c==="wake"?(X=14,Y=30,J=new e.Vector3(0,2,-250)):c==="foot"?(X=4,Y=14,J=new e.Vector3(150,3,60)):c==="mid"?(X=30,Y=40,J=q(48,70,0)):c==="flank2"&&(X=9,Y=22,J=q(-60,70,0)),{object:f,radius:X,height:Y,center:J,anchors:ke,update:ve,setRoller:Me,heightAt:Se,addStatic:Z,addFixedPins:he,setProgress(y){},uniforms:t,glsl:{uniforms:$,lattice:te,height:ae,sky:oe,steel:ue,glass:we},stats:{pins:w.geometry.instanceCount,pinTriangles:w.tris,farTriangles:(P.index.count+S.base.index.count)/3,marbles:O},dispose(){},ground:!1,groundY:0}}export{Fe as buildHero};
