import*as y from"three";import{makePath as Ta}from"../kit/core.js";import{buildHero as eo,makeAcc as Se,PAT as r,GLSL_COMMON as ht,GLSL_MIST as Gt,GLSL_RIPPLE as ft,DAB_FRAG as to,buildCrowd as za,makeRibbons as ao}from"../parts/rainbow-bridge-scroll.js";const j0=!0,oo=["#B79C70","#F3EAD3","#2B241C","#8E8573","#C6A568","#A7A57C","#D5351C"],Y=(n,t,s)=>{const l=Math.min(1,Math.max(0,(s-n)/(t-n)));return l*l*(3-2*l)},o=(n,t,s)=>new y.Vector3(n,t,s),F=3,Te=161,O0=258,dt=-24,pt={mal:"#1FA37A",azu:"#1F5FB0",gold:"#E0B02A"},K=n=>21+9*Y(0,20,n)-8*Y(60,100,n)-7*Y(183,210,n),we=n=>F*Y(-20,-10,n)*(1-Y(292,299,n)),d0=-20,je=36,p0=300,ve=12,de=108*Math.PI/180,ut=18,e0=150*Math.PI/180,V0=p0+ve*de,Lt=V0+ut,mt=Lt+ve*(e0-de),so=d0-je*Math.PI/2-9,Sa=mt+7;function _t(n,t){if(n<d0){const s=(d0-n)/je;if(s<=Math.PI/2)t.x=d0-je*Math.sin(s),t.y=je*(1-Math.cos(s)),t.a=-s;else{const l=(s-Math.PI/2)*je/5;t.x=d0-je+5-5*Math.cos(l),t.y=je+5*Math.sin(l),t.a=-Math.PI/2-l}}else if(n<=p0)t.x=n,t.y=0,t.a=0;else if(n<=V0){const s=(n-p0)/ve;t.x=p0+ve*Math.sin(s),t.y=ve*(1-Math.cos(s)),t.a=s}else{const s=p0+ve*Math.sin(de),l=ve*(1-Math.cos(de)),d=Math.cos(de),u=Math.sin(de);if(n<=Lt)t.x=s+(n-V0)*d,t.y=l+(n-V0)*u,t.a=de;else{const m=s+ut*d,f=l+ut*u,b=m-ve*u,p=f+ve*d;if(n<=mt){const v=de+(n-Lt)/ve;t.x=b+ve*Math.sin(v),t.y=p-ve*Math.cos(v),t.a=v}else{const v=b+ve*Math.sin(e0),w=p-ve*Math.cos(e0),z=v-3*Math.sin(e0),I=w+3*Math.cos(e0),R=e0+(n-mt)/3;t.x=z+3*Math.sin(R),t.y=I-3*Math.cos(R),t.a=R}}}return t}const Wt=`
  float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
  float sdSeg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / max(dot(ba, ba), 1e-6), 0.0, 1.0)); }
`,no=`
  attribute vec3 aP;
  uniform float uTime; uniform vec4 uClip;
  varying vec3 vP; varying vec3 vW; varying float vThru;
  ${ft}
  void main() {
    vP = aP;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    // seen through the previous portal (uClip.w on): behind the entry plane the bank is laid down to water level, so that
    // the low part of the opening is river running toward the eye (the fragment shader draws it as water there)
    vThru = uClip.w * smoothstep(0.0, 6.0, dot(wp.xz, uClip.xy) + uClip.z) * step(-19.0, aP.x) * (1.0 - step(299.0, aP.x));
    wp.y -= aP.y * vThru;
    wp.y += rippleY(wp.x);
    // slow ripples travelling down the blank silk from the feed roller (still under the great seal)
    float ra = clamp((aP.x - 300.0) / 12.0, 0.0, 1.885);
    float amp = 0.2 * smoothstep(299.0, 305.0, aP.x) * (1.0 - smoothstep(308.0, 320.0, aP.x));
    wp.xy += vec2(-sin(ra), cos(ra)) * amp * sin((aP.x + uTime * 9.0) * 0.21);
    vW = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,io=`
  uniform vec3 uInk, uSilk, uPale, uGrey, uSeal, uAzur, uMal, uGold, uWater, uTone;${j0?" uniform vec3 uOchre;":""}
  uniform float uLinePx, uTime, uSeed, uWind, uSnow, uBusy, uJoin;
  uniform vec2 uFade; uniform vec4 uBargeW; uniform vec4 uSeals[5]; uniform vec3 uObs[12]; uniform vec4 uBig; uniform vec4 uStampAt; uniform vec3 uThresh;
  uniform vec4 uTraf[3]; uniform vec4 uSail; uniform vec3 uTow[5];
  varying vec3 vP; varying vec3 vW; varying float vThru;
  ${ht}
  ${Gt}
  ${Wt}
  float halfW(float s) { return 21.0 + 9.0 * smoothstep(0.0, 20.0, s) - 8.0 * smoothstep(60.0, 100.0, s) - 7.0 * smoothstep(183.0, 210.0, s); }
  // a square collector's seal: border, two fret rings, a centre dot; four-fold symmetric, no characters
  float squareSeal(vec2 sq, float fs) {
    vec2 aq = abs(sq); float dd = max(aq.x, aq.y), mn = min(aq.x, aq.y);
    float ink = smoothstep(0.80 - fs, 0.80 + fs, dd);
    ink = max(ink, smoothstep(0.50 - fs, 0.50 + fs, dd) * (1.0 - smoothstep(0.64 - fs, 0.64 + fs, dd)) * smoothstep(0.10 - fs, 0.10 + fs, mn));
    ink = max(ink, smoothstep(0.22 - fs, 0.22 + fs, dd) * (1.0 - smoothstep(0.36 - fs, 0.36 + fs, dd)) * smoothstep(0.07 - fs, 0.07 + fs, abs(aq.x - aq.y)));
    ink = max(ink, 1.0 - smoothstep(0.08 - fs, 0.08 + fs, dd));
    return ink * (1.0 - smoothstep(1.0 - fs, 1.0 + fs, dd));
  }
  // one figure of the flat elevation painting, in its own cell: a roof over its walls, or a willow. Returns the distance
  // to its ruled lines; fl = (roof, wall, leaf) fills
  float glyph(vec2 g, vec2 ci, float hc, out vec3 fl) {
    float dg = 99.0; fl = vec3(0.0);
    if (hc < 0.56) {                                                  // a roof: ridge, eaves, two slopes, walls
      float rw = 1.5 + 1.1 * h21(ci + 13.0);
      dg = min(sdSeg(g, vec2(-rw, 2.0), vec2(rw, 2.0)), sdSeg(g, vec2(-rw - 1.5, 0.2), vec2(rw + 1.5, 0.2)));
      dg = min(dg, min(sdSeg(g, vec2(-rw, 2.0), vec2(-rw - 1.5, 0.2)), sdSeg(g, vec2(rw, 2.0), vec2(rw + 1.5, 0.2))));
      dg = min(dg, min(sdSeg(g, vec2(-rw - 0.3, 0.2), vec2(-rw - 0.3, -1.3)), sdSeg(g, vec2(rw + 0.3, 0.2), vec2(rw + 0.3, -1.3))));
      dg = min(dg, min(sdSeg(g, vec2(-rw - 0.3, -1.3), vec2(rw + 0.3, -1.3)), sdSeg(g, vec2(-0.4, -1.3), vec2(-0.4, -0.2))));
      fl.x = step(0.2, g.y) * step(g.y, 2.0) * step(abs(g.x), rw + 1.5 * (2.0 - g.y) / 1.8);
      fl.y = step(-1.3, g.y) * step(g.y, 0.2) * step(abs(g.x), rw + 0.3);
    } else if (hc < 0.92) {                                           // a willow: trunk, round head, hanging strokes
      dg = min(sdSeg(g, vec2(0.0, -2.2), vec2(0.2, 0.2)), abs(length(g - vec2(0.2, 1.2)) - 1.9));
      dg = min(dg, min(sdSeg(g, vec2(-0.9, 1.0), vec2(-1.2, -0.9)), sdSeg(g, vec2(1.2, 1.2), vec2(1.6, -0.7))));
      dg = min(dg, min(sdSeg(g, vec2(-1.6, 1.4), vec2(-2.1, -0.3)), sdSeg(g, vec2(0.4, 0.6), vec2(0.6, -1.0))));
      fl.z = step(length(g - vec2(0.2, 1.2)), 1.9);
    }
    return dg;
  }
  // the crest of a range of hills over z: sharp peaks of uneven height
  float ridgeH(float z, float k, float sd) {
    float n1 = vnoise(vec2(z * k, sd)), n2 = vnoise(vec2(z * k * 2.7 + 5.0, sd + 3.0)), n3 = vnoise(vec2(z * k * 0.45 + 9.0, sd + 7.0));
    return (1.0 - abs(2.0 * n1 - 1.0)) * (0.45 + 0.55 * n3) + 0.22 * n2;
  }
  // one range in flat elevation (on the rising silk, and in each stage of the painting that climbs the take-up bend):
  // a wash graded from malachite at the crest to azurite below, stopped at its foot on a ruled, scalloped line of
  // cloud (bare silk under it); one gold contour, hemp-fibre strokes hanging from the ruled crest, moss dots along
  // it and, where wf is on, a few waterfalls: a pale ruled band whose strokes run down
  void hillRange(inout vec3 col, inout float ink, float sw, float z, float base, float amp, float k, float sd, float depth, float fw, float px, float a, float wf, float lift, float mg, float pn) {
    float r0 = base + amp * ridgeH(z, k, sd), r1 = base + amp * ridgeH(z + 0.4, k, sd);
    float sl = (r1 - r0) / 0.4, F = (sw - r0) / sqrt(1.0 + sl * sl);
    float t = clamp((r0 - sw) / depth, 0.0, 1.0), inn = 1.0 - smoothstep(-fw, fw, F);
    float ft = 0.9 - 0.1 * abs(sin(z * 0.61 + sd * 3.1)) - 0.05 * abs(sin(z * 1.9 + sd)), ftd = (ft - t) * depth;
    float body = inn * smoothstep(-fw, fw, ftd);
    vec3 crest = mix(uMal, uPale, uSnow);
    float tsn = 0.15 + 0.06 * sin(z * 0.83 + sd * 2.0) + 0.03 * sin(z * 2.9 + sd), esn = fw / depth;
    // the minerals are laid boldly and flat: malachite at the crest (a snow cap under snow), azurite below; lift pales a
    // far range, mg is how far down the malachite reaches
    vec3 wash = mix(crest, mix(uAzur, uMal, 0.3 * (1.0 - uSnow)), mix(smoothstep(0.05, mg, t), smoothstep(tsn - esn, tsn + esn, t), uSnow));
    wash = mix(wash, uPale, lift);
    // the flank of every peak that is turned from the light takes a second, deeper flat wash, cut on the fall line under
    // each summit and stopped on a line that follows the crest: the range stands as faceted rock, not as one sheet
    float flank = smoothstep(-0.012, 0.012, sl) * smoothstep(0.0, 0.5 * fw / depth + 0.004, t) * (1.0 - smoothstep(0.5 - fw / depth, 0.5 + fw / depth, t + 0.07 * sin(z * 0.9 + sd)));
    wash = mix(wash, mix(wash, mix(uAzur, uInk, 0.45), 0.42), flank * (1.0 - 0.6 * lift));
    col = mix(col, wash, 0.95 * body * (1.0 - 0.25 * smoothstep(0.35, 0.95, t)) * a * uTone.z);
    ink *= 1.0 - body * a;
    col = mix(col, uGold, 0.9 * inkLine(abs(F + 0.75 + 0.05 * depth), fw, px * 1.2) * a * uTone.z);
    float keep = smoothstep(3.0, 6.0, 1.5 / max(fw, 1e-6));
    float cell = floor(z / 1.5), hh = h11(cell + sd * 13.0);
    float st = inkLine(abs(fract(z / 1.5 + 0.2 * sin(sw * 0.9 + sd)) - 0.5) * 1.5, fw, px * 0.8) * step(0.25, hh) * body * (1.0 - smoothstep(0.14 + 0.4 * hh, 0.2 + 0.46 * hh, t)) * keep;
    // a second, fainter set of strokes lower down, between the first
    float st2 = inkLine(abs(fract(z / 1.5 + 0.5 + 0.2 * sin(sw * 0.7 + sd * 2.0)) - 0.5) * 1.5, fw, px * 0.7) * step(0.55, h11(cell + sd * 5.0)) * body * smoothstep(0.3, 0.36, t) * (1.0 - smoothstep(0.52 + 0.2 * hh, 0.6 + 0.2 * hh, t)) * keep;
    // moss dots along the crest
    float dc = floor(z / 1.3 + sd), dh = h11(dc + sd * 7.0);
    float dots = (1.0 - smoothstep(0.19 - fw, 0.19 + fw, length(vec2((fract(z / 1.3 + sd) - 0.5) * 1.3, F + 0.45 + 0.5 * dh)))) * step(0.42, dh) * smoothstep(3.0, 6.0, 0.4 / max(fw, 1e-6));
    // waterfalls
    float wc = floor(z / 13.0 + sd * 0.37), wz = (fract(z / 13.0 + sd * 0.37) - 0.5) * 13.0 - 3.0 * (h11(wc + sd) - 0.5), wh = step(0.55, h11(wc + sd * 3.0)) * wf;
    float win = (1.0 - smoothstep(0.6 - fw, 0.6 + fw, abs(wz))) * body * step(0.1, t) * wh;
    col = mix(col, uPale, 0.85 * win * a);
    float wl = max(inkLine(abs(abs(wz) - 0.6), fw, px * 0.8) * step(0.1, t), 0.75 * ruled(wz, 0.3, fw, px * 0.7) * step(0.45, fract(t * depth / 1.7 - uTime * 0.8 + h11(floor(wz / 0.3) + wc) * 5.0))) * body * wh * step(abs(wz), 0.75);
    float cloud = 0.5 * inkLine(abs(ftd), fw, px * 0.8) * inn;
    ink = max(ink, max(max(inkLine(abs(F), fw, px), max(st, st2) * 0.55), max(max(dots * 0.85, wl), cloud)) * a);
    // pines standing along the crest: a ruled wedge of malachite (snow-laden under snow) on a short trunk
    float pcl = floor(z / 3.4 + sd * 1.7), pz = (fract(z / 3.4 + sd * 1.7) - 0.5) * 3.4 - 0.9 * (h11(pcl + sd * 11.0) - 0.5), ph = 2.8 + 1.8 * h11(pcl + 7.0), py = F + 0.25;
    float pon = step(1.0 - 0.62 * pn, h11(pcl + sd * 19.0)) * step(0.001, pn) * smoothstep(3.0, 6.0, 1.0 / max(fw, 1e-6)) * a;
    float pwd = 1.05 * clamp(1.0 - (py - 0.7) / (ph - 0.7), 0.0, 1.0), pin = step(0.7, py) * step(py, ph);
    // (dark malachite in every look: under snow only the windward half of each wedge is left as reserve)
    col = mix(col, mix(mix(uMal, uInk, 0.38), uPale, 0.7 * uSnow * step(0.0, pz) * step(0.35 * pwd, abs(pz))), 0.94 * pin * (1.0 - smoothstep(pwd - fw, pwd + fw, abs(pz))) * pon);
    float pl = min(abs(pz) + (1.0 - step(0.0, py) * step(py, 0.7)) * 9.0, min(abs(abs(pz) - pwd) + (1.0 - pin) * 9.0, abs(py - 0.7) + step(1.05, abs(pz)) * 9.0));
    ink = max(ink, inkLine(pl, fw, px * 0.85) * pon);
  }
  void main() {
    vec2 p = vP.xz; float s = p.x, z = p.y, h = vP.y, px = uLinePx, mz = abs(z);
    vec2 pdx = dFdx(p), pdy = dFdy(p);
    float gs = max(length(vec2(pdx.x, pdy.x)), 1e-6), gz = max(length(vec2(pdx.y, pdy.y)), 1e-6), fwp = max(gs, gz);
    float fh = max(length(vec2(dFdx(h), dFdy(h))), 1e-6);
    float dist = length(cameraPosition - vW);
    float bend = 1.0 - smoothstep(-24.0, -19.0, s);                 // the flat painting that climbs onto the take-up roller
    float sp = s + uWind * bend;                                      // it winds upward, slowly
    float blank = smoothstep(292.0, 304.0, s);
    vec3 col = mix(uSilk, uPale, blank * 0.92);
    // ---- the silk itself: foxing, repair patches, creases, cracks, wormholes, weave
    vec2 q = p + uSeed * vec2(37.0, 91.0);
    float fox = smoothstep(0.56, 0.86, vnoise(q * 0.045 + uTime * 0.006) * 0.7 + vnoise(q * 0.13) * 0.3);
    col *= 1.0 - 0.085 * fox;
    vec2 pc = floor((q + vec2(37.0, 11.0)) / vec2(64.0, 46.0)), pf = fract((q + vec2(37.0, 11.0)) / vec2(64.0, 46.0));
    float mend = step(0.66, h21(pc)) * step(0.2, pf.x) * step(pf.x, 0.55) * step(0.3, pf.y) * step(pf.y, 0.62);
    col = mix(col, mix(uSilk, uPale, 0.5), mend * 0.3);
    float crease = 1.0 - smoothstep(0.0, 0.5 + fwp, abs(fract((s * 0.22 + z + uSeed * 50.0) / 150.0 + 0.3) - 0.5) * 150.0);
    col *= 1.0 - 0.13 * crease;
    float ck = abs(vnoise(q * 0.08 + 11.0) - 0.5);
    col *= 1.0 - 0.16 * (1.0 - smoothstep(0.0, 0.006 + fwp * 0.03, ck)) * step(0.55, vnoise(q * 0.013 + 3.0));
    vec2 wc = floor(q / 7.0), wf = fract(q / 7.0) - 0.5;
    float hole = step(0.9, h21(wc)) * (1.0 - smoothstep(0.02, 0.03 + fwp * 0.1, length(wf - 0.3 * (vec2(h21(wc + 3.0), h21(wc + 7.0)) - 0.5))));
    col = mix(col, uPale, hole * 0.6);
    col *= 1.0 + 0.04 * (1.0 - smoothstep(0.012, 0.04, fwp)) * sin(s * 52.0) * sin(z * 52.0);
    float rp = sin((s + uTime * 9.0) * 0.21);
    col *= 1.0 + blank * (0.045 * rp + 0.035 * smoothstep(0.93, 1.0, rp) + 0.015 * sin((s + uTime * 5.0) * 0.83 + z * 0.05));    // slow ripples running down from the feed roller
    float line = 0.0;
    if (mz > 75.0) {                                                  // the mount: an azurite brocade border, lozenges ruled in gold
      col = mix(col, uAzur, 0.82 * (1.0 - bend));
      float la = s + z, lb = s - z, fl = fwp * 1.41;
      vec2 lc = (vec2(fract(la / 3.2), fract(lb / 3.2)) - 0.5) * 3.2;
      float lo = max(max(ruled(la, 3.2, fl, px * 1.2), ruled(lb, 3.2, fl, px * 1.2)), (1.0 - smoothstep(0.42 - fl, 0.42 + fl, length(lc))) * smoothstep(2.6, 5.0, 3.2 / fl));
      col = mix(col, uGold, 0.8 * lo * (1.0 - bend));
    }
    float thrK = step(0.5, vThru);
    line = (inkLine(abs(mz - 75.0), gz, px) + inkLine(abs(mz - 76.2), gz, px * 0.7)) * (1.0 - thrK);
    float w = halfW(s);
    float pic = 1.0 - smoothstep(289.0, 297.0, s);
    float mst = mistAt(vW, dist), jn = uJoin * (1.0 - smoothstep(3.0, 10.0, abs(s + 19.0))) * step(mz, 75.0);       // (the mist band over the join)
    float omit = max(max(smoothstep(uFade.x, uFade.y, dist), mst), jn);
    // the water's wash is carried further than the ink and thins, not vanishes, under mist
    float omitW = max(max(smoothstep(uFade.x * 1.3, uFade.y * 1.6, dist), 0.65 * mst), jn);
    float ink = 0.0;
    // the river's flow coordinate, parted by our hull; its derivative is taken here, outside any branch (Direct3D)
    float cx = z * 22.0 / w + 0.7 * sin(s * 0.043 + 1.3) + 0.3 * sin(s * 0.11) + 0.8 * sin(s * 0.17 + z * 0.06) * (1.0 - smoothstep(38.0, 70.0, s));
    vec2 hd = uBargeW.zw, rel = p - uBargeW.xy;
    float al = dot(rel, hd), ac = rel.y * hd.x - rel.x * hd.y;
    float bw = exp(-ac * ac / 30.0) * (1.0 - smoothstep(10.0, 22.0, abs(al)));
    cx += sign(ac + 1e-4) * 1.6 * bw * (1.0 - smoothstep(0.0, 4.0, abs(ac)) * 0.5);
    // the ruled lines waver: a slow ripple travels down them
    cx += 0.24 * sin(s * 0.9 - uTime * 1.4 + z * 0.7) * (1.0 - bend) * (1.0 - 0.8 * bw);
    float fwc = max(length(vec2(dFdx(cx), dFdy(cx))), 1e-6);
    if ((mz < w + 0.12 && h < 0.03) || thrK > 0.5) {
      // ---- the river: bare silk, long ruled flow lines sliding downstream
      float period = 2.7, lid = floor(cx / period), hh = h11(lid);
      // in the basin (each line up to its own mark) more lines are drawn and their strokes are shorter
      float basin = step(s, 50.0 + 14.0 * h11(lid + 3.0));
      float len = mix(38.0 + 30.0 * hh, 22.0 + 18.0 * hh, basin);
      float seg = fract((sp - uTime * (3.4 + 1.8 * hh) * (1.0 - bend)) / len + hh * 9.0);
      float e1 = 0.42 + 0.3 * h11(lid + 5.0);
      float on = smoothstep(0.0, 0.02, seg) * (1.0 - smoothstep(e1, e1 + 0.04, seg)) * step(mix(0.4 - 0.2 * uBusy, 0.2, basin), h11(lid + 17.0));
      ink = ruled(cx, period, fwc, px * 0.85) * on * (1.0 - 0.9 * bw);
      // the basin: a second, fainter set of short ripple strokes between the flow lines
      float rseg = (sp - uTime * 2.0) / 7.0;
      ink = max(ink, 0.55 * ruled(cx + 1.35, period, fwc, px * 0.7) * basin * step(s, 64.0) * step(0.5, h21(vec2(lid + 40.0, floor(rseg)))) * step(0.12, fract(rseg)) * step(fract(rseg), 0.7) * (1.0 - 0.9 * bw));
      // whorls: ruled arcs turning in the lee of every hull and pier nose
      for (int i = 0; i < 12; i++) {
        vec3 ob = uObs[i];
        vec2 d = p - ob.xy; float r = length(d) + 1e-4;
        float ang = atan(d.y, d.x + 1e-5) + uTime * 0.65 * (mod(float(i), 2.0) < 0.5 ? 1.0 : -1.0) + r * 1.1;
        float arc = smoothstep(0.1, 0.5, sin(ang)) * (1.0 - smoothstep(ob.z - 0.8, ob.z, r)) * smoothstep(0.25, 0.5, r);
        vec2 dn = d / r; float fr = max(length(vec2(dot(pdx, dn), dot(pdy, dn))), 1e-6);
        ink = max(ink, ruled(r, 0.62, fr, px) * arc);
      }
      // wavelets: short level strokes bowed downstream, in staggered cells that drift with the current and come and go
      float wsv = (sp - uTime * 2.3 * (1.0 - bend)) / 3.7, wrow = floor(wsv);
      float wzu = z / 2.7 + 0.5 * mod(wrow, 2.0) + h11(wrow) * 0.3, wcl = floor(wzu), wvh = h21(vec2(wrow, wcl));
      float wdz = (fract(wzu) - 0.5) * 2.7 - (h21(vec2(wcl, wrow) + 7.0) - 0.5) * 0.7, wlen = 0.7 + 0.7 * h21(vec2(wrow, wcl) + 3.0);
      float wds = (fract(wsv) - 0.3 - 0.4 * wvh) * 3.7 - 0.42 * (1.0 - wdz * wdz / (wlen * wlen));
      float wlf = fract(wvh * 7.0 + uTime * 0.11), wlife = smoothstep(0.0, 0.2, wlf) * (1.0 - smoothstep(0.75, 0.95, wlf));
      ink = max(ink, inkLine(abs(wds), gs, px * 0.9) * step(abs(wdz), wlen) * step(0.22, wvh) * wlife * smoothstep(1.5, 3.0, 1.6 / gs) * (1.0 - bw));
      // the wakes of the boats under way: two ruled arms, broken, a fainter pair inside them, and a reserve of pale astern
      float foam = 0.0;
      for (int i = 0; i < 3; i++) {
        vec4 tr = uTraf[i]; vec2 rl = p - tr.xy; float wal = -dot(rl, tr.zw), wac = abs(rl.y * tr.z - rl.x * tr.w);
        float won = step(0.5, wal) * (1.0 - smoothstep(15.0, 23.0, wal));
        float arm = inkLine(abs(wac - (0.5 + 0.3 * wal)), fwp, px * 0.85) * step(0.3, fract(wal / 2.6 - uTime * 0.5));
        float arm2 = inkLine(abs(wac - 0.12 * wal), fwp, px * 0.7) * step(0.5, fract(wal / 1.9 - uTime * 0.7 + 0.4)) * step(3.0, wal);
        ink = max(ink, max(arm, 0.7 * arm2) * won);
        foam = max(foam, (1.0 - smoothstep(0.0, 0.4 + 0.25 * wal, wac)) * step(0.0, wal) * (1.0 - smoothstep(1.5, 11.0, wal)));
      }
      ink = max(ink, inkLine(abs(mz - w), gz, px * 1.1) * (1.0 - thrK));
      // first snow: ice lines along the banks
      float ice = inkLine(abs(mz - w + 1.3 + 0.5 * sin(s * 0.3)), gz, px * 0.8) * step(0.3, fract(s / 11.0)) + inkLine(abs(mz - w + 2.9 + 0.7 * sin(s * 0.17 + 2.0)), gz, px * 0.8) * step(0.55, fract(s / 17.0 + 0.4));
      ink = max(ink, ice * uSnow * (1.0 - thrK));
      ink *= pic;
      // the water: a thin blue-green mineral wash laid in long tongues down the current (the silk shows paler between
      // them), deeper under the banks and under the bridge; left bare where mist or distance omits
      float rd = w - mz, wk = pic * (1.0 - omit);
      float tongue = smoothstep(0.37, 0.45, vnoise(vec2(cx * 0.42 + 7.0, (s - uTime * 1.5 * (1.0 - bend)) * 0.028)));
      float wat = (0.86 + 0.06 * smoothstep(w - 9.0, w, mz) + 0.06 * (1.0 - smoothstep(7.0, 12.0, abs(s - 161.0)))) * mix(0.76, 1.0, tongue);
      col = mix(col, uWater, min(wat * uTone.x, 0.95) * pic * (1.0 - omitW));
      // a second, deeper wash lies in long bands down the channel; glints are left as short level strokes of reserve that
      // come and go; astern of every boat under way the wash is thinned
      float deep = smoothstep(0.58, 0.64, vnoise(vec2(cx * 0.3 + 31.0, (s - uTime * 1.1 * (1.0 - bend)) * 0.021)));
      col = mix(col, mix(uWater, uInk, 0.24), 0.6 * deep * wk);
      float gsv = (sp - uTime * 1.2 * (1.0 - bend)) / 4.6, grw = floor(gsv), gzu = z / 2.6 + h11(grw + 9.0) * 3.0, gcl = floor(gzu), gh = h21(vec2(grw + 20.0, gcl));
      float gdz = (fract(gzu) - 0.5) * 2.6, gds = (fract(gsv) - 0.5) * 4.6, glen = 0.5 + 0.6 * h21(vec2(gcl, grw) + 5.0);
      float glint = (1.0 - smoothstep(-gs, gs, abs(gds) - 0.11 * (1.0 - gdz * gdz / (glen * glen)))) * step(abs(gdz), glen) * step(0.3, gh) * smoothstep(0.2, 0.6, sin(uTime * (0.6 + gh) + gh * 40.0)) * (1.0 - smoothstep(0.25, 0.6, gs));
      col = mix(col, uPale, 0.75 * glint * wk);
      col = mix(col, uPale, 0.32 * foam * wk);
      // shade, as flat ink wash: the bridge's on the water under it, and a band along the foot of each embankment
      float shb = 1.0 - smoothstep(7.0, 11.0, abs(s - 161.0));
      col = mix(col, mix(uWater, uInk, 0.6), 0.8 * shb * wk);
      col = mix(col, mix(uWater, uInk, 0.45), 0.35 * smoothstep(w - 2.5, w, mz) * wk * (1.0 - thrK));
      // reflections: whatever stands on the bank is laid on the water below it as a column of broken level strokes, in
      // its own wash (pale wall, tile grey, willow); a cinnabar column or lantern lies there as the water's own deeper
      // blue (wdeep), for no red is laid on the water anywhere; the strokes waver and their breaks slide. Far off the
      // breaks, then the columns, are left out and only an even deeper band is kept
      vec3 wdeep = mix(uWater, uInk, 0.5);
      float sideK = step(0.0, z), cw = 3.1, cu = s / cw + 0.37 * sideK, cid = floor(cu) + 57.0 * sideK, ch = h11(cid * 1.7 + 4.0), ch2 = h11(cid + 23.0);
      float townR = smoothstep(62.0, 74.0, s) * (1.0 - smoothstep(288.0, 296.0, s));
      float Ho = mix(2.2 + 4.5 * ch, 4.0 + 8.0 * ch, townR), eyeH = max(cameraPosition.y, 1.5);
      float Hc = min(Ho * clamp(dist / (eyeH + Ho), 0.6, 4.0), w * 0.8), fh2 = clamp(rd / Hc, 0.0, 1.0);
      float colw = (0.5 + 0.8 * h11(cid + 9.0)) * (1.0 - 0.5 * fh2);
      float cxr = abs((fract(cu) - 0.5) * cw + 0.2 * fh2 * sin(rd * 2.6 + uTime * 1.7 + cid));
      float rdw = rd + 0.09 * sin(s * 1.9 + uTime * 1.4), rrow = floor(rdw / 0.5), gapK = 1.0 - smoothstep(0.1, 0.3, fwp), colK = 1.0 - smoothstep(0.45, 1.3, gs);
      float gap = step(0.36 + 0.5 * fh2, h21(vec2(rrow, floor(s / 1.3 + h11(rrow) * 5.0 + uTime * 0.3 * (h11(rrow + 2.0) - 0.5)))));
      float inC = (1.0 - smoothstep(colw - gs, colw + gs, cxr)) * step(rd, Hc) * smoothstep(0.1, 0.7, rd) * step(0.18, ch2);
      float refl = inC * (1.0 - gap * gapK) * mix(1.0, step(0.36, fract(rdw / 0.5)), gapK);
      refl = mix(0.3 * (1.0 - smoothstep(2.0, 9.0, rd)) * smoothstep(0.1, 0.7, rd), refl * (1.0 - 0.5 * fh2), colK);
      vec3 rc = ch2 < 0.56 ? mix(uPale, uSilk, 0.15) : ch2 < 0.78 ? mix(mix(uAzur, uGrey, 0.5), uPale, uSnow * 0.8) : ch2 < 0.92 ? mix(mix(uMal, uInk, 0.35), mix(uGrey, uInk, 0.3), uSnow) : wdeep;
      rc = mix(mix(uWater, uInk, 0.3), rc, colK);
      float rk = wk * (1.0 - thrK);
      col = mix(col, rc, 0.78 * refl * rk);
      // the lanterns under the eaves lie on the water as a row of short strokes of the deeper blue; each banner tower as
      // a tall column of azurite and deeper blue strokes that wavers
      float Hl = min(5.5 * clamp(dist / (eyeH + 5.5), 0.6, 1.5), w * 0.3), fl2 = rd / max(Hl, 1e-3), lcu = s / 1.9 + 0.5 * sideK;
      float lan = townR * step(0.68, h11(floor(lcu) + 31.0 * sideK)) * (1.0 - smoothstep(0.3 - gs, 0.3 + gs, abs(fract(lcu) - 0.5) * 1.9)) * step(0.3, fl2) * step(fl2, 0.85) * step(0.3, fract(rdw / 0.5)) * colK;
      col = mix(col, mix(wdeep, uWater, 0.2), 0.6 * lan * rk);
      // a mirror lays a tall thing on the water toward the eye: each banner tower's three cloths as a short column of
      // deeper blue and azurite strokes, where the line from its foot to the eye crosses the river
      float ban = 0.0, bmid = 0.0;
      for (int i = 0; i < 5; i++) {
        vec2 tb = uTow[i].xy, tv = cameraPosition.xz - tb; float tdn = max(length(tv), 1e-3); tv /= tdn;
        vec2 trl = p - tb; float tal = dot(trl, tv), tac = abs(trl.y * tv.x - trl.x * tv.y);
        // (as wide as the cloths look from here: the nearer the eye the strokes lie, the narrower the column)
        float thw = 2.9 * clamp((tdn - tal) / tdn, 0.0, 1.0), twv = tac + 0.12 * sin(tal * 2.3 + uTime * 1.5);
        float ton = step(tdn * 11.0 / (11.0 + eyeH), tal) * step(tal, tdn * 20.0 / (20.0 + eyeH)) * step(twv, thw) * step(0.36, fract(tal / 0.55 + 0.1 * sin(tac * 2.0 + uTime)));
        ban = max(ban, ton); bmid = mix(bmid, step(twv, thw * 0.34), ton);
      }
      col = mix(col, mix(mix(wdeep, uAzur, bmid), uWater, 0.2), 0.58 * ban * rk * (1.0 - uClip.w) * (1.0 - smoothstep(0.3, 0.8, fwp)));
      // the junk's sail lies on the water toward the eye: a tapering column of pale broken strokes
      vec2 sv = cameraPosition.xz - uSail.xy; float sdn = max(length(sv), 1e-3); sv /= sdn;
      vec2 srl = p - uSail.xy; float sal = dot(srl, sv), sac = abs(srl.y * sv.x - srl.x * sv.y), sL = max(sdn * uSail.z / (uSail.z + eyeH), 1e-3);
      float shw = uSail.w * clamp((sdn - sal) / sdn, 0.0, 1.0);
      float sref = step(1.5, sal) * step(sal, sL) * (1.0 - smoothstep(shw - fwp, shw + fwp, sac + 0.14 * sin(sal * 2.1 + uTime * 1.6))) * step(0.36, fract(sal / 0.6 + 0.15 * sin(sac * 3.0 + uTime * 0.9)));
      col = mix(col, mix(uPale, uGold, 0.25), 0.62 * sref * wk * (1.0 - uClip.w));
      // the bridge lies on the water either side of itself: the dark of the arch nearest, then the crowd and its
      // parasols as short level strokes of pale, deeper blue, azurite and gold
      float db = abs(s - 161.0) - 7.0, la = (4.0 + 9.0 * cos(clamp(z / 21.0, -1.0, 1.0) * 1.5708)) * clamp(dist / (eyeH + 10.0), 0.5, 2.6);
      float dbw = db + 0.09 * sin(z * 1.9 + uTime * 1.4), brow = floor(dbw / 0.5), bz = z / 1.7 + h11(brow) * 3.0 + uTime * 0.22 * (h11(brow + 5.0) - 0.5), bh = h21(vec2(brow + 90.0, floor(bz)));
      float inB = step(0.0, db) * mix(1.0, step(0.42, fract(dbw / 0.5)), gapK) * step(mz, w - 0.5);
      float arch = inB * (1.0 - smoothstep(la * 0.75, la, db)) * (1.0 - step(0.62 + 0.3 * db / la, bh) * gapK);
      col = mix(col, mix(uWater, uInk, 0.5), 0.8 * arch * wk);
      float conf = inB * step(la * 0.35, db) * (1.0 - smoothstep(la + 2.0, la + 7.0, db)) * step(0.78, bh) * gapK * step(0.1, fract(bz)) * step(fract(bz), 0.4 + 0.5 * h11(floor(bz) + brow));
      vec3 cc = bh < 0.9 ? uPale : bh < 0.95 ? wdeep : bh < 0.98 ? mix(uAzur, uPale, 0.3) : uGold;
      col = mix(col, mix(cc, uWater, 0.2), 0.8 * conf * wk);
      // the weave shows through the wash
      col *= 1.0 + 0.03 * sin(s * 52.0) * sin(z * 52.0) * (1.0 - smoothstep(0.012, 0.04, fwp));
    } else if (h > 0.03 && h < 2.94) {
      // ---- the embankment face: ruled stone courses in the town, earth with a few strokes in the village
      float town = smoothstep(62.0, 74.0, s);
      float row = floor(h / 0.6);
      float l = ruled(h, 0.6, fh, px), j = ruled(s + h11(row) * 1.7, 1.7, gs, px) * smoothstep(2.6, 5.0, 0.6 / fh);
      ink = max(l, j) * town + (1.0 - town) * ruled(s + h11(floor(h / 0.9)) * 0.9, 0.9, gs, px) * step(0.62, h11(floor(s / 0.9) + row * 7.0));
      col = mix(col, mix(uPale, uGrey, 0.18 * step(0.8, h21(vec2(row, floor((s + h11(row) * 1.7) / 1.7))))), 0.55 * town);
      col = mix(col, uGrey, 0.3 * (1.0 - smoothstep(0.0, 1.4, h)));                 // a wash of shade along the foot of the wall
      // the village's earth bank: grass hanging over the lip (a malachite wash thinning downward), tufts as short strokes
      col = mix(col, uMal, 0.34 * (1.0 - town) * smoothstep(0.9, 2.9, h) * uTone.y);
      float tuft = inkLine(abs(fract(s / 0.45 + h11(floor(s / 0.45)) * 0.3) - 0.5) * 0.45, gs, px * 0.8) * step(0.5, h11(floor(s / 0.45) + 3.0)) * step(2.9 - 0.9 * h11(floor(s / 0.45) + 9.0), h) * smoothstep(3.0, 6.0, 0.45 / gs);
      ink = max(ink, tuft * (1.0 - town) * (1.0 - uSnow));
      ink *= pic; col = mix(col, mix(uSilk, uPale, blank * 0.92), 1.0 - pic);
    } else if (mz <= 75.0 && s > -24.0) {
      // ---- bank tops: the embankment lane, paving, kitchen plots, streets, grass ticks
      float d = mz - w - 1.0;
      float town = smoothstep(62.0, 74.0, s) * (1.0 - smoothstep(288.0, 295.0, s));
      // open ground takes a thin uneven malachite wash; the paved town is a little paler than the paper
      float keep = pic * (1.0 - omit);
      col = mix(col, uMal, (0.2 + 0.14 * vnoise(p * 0.09 + 5.0)) * (1.0 - town) * uTone.y * keep * smoothstep(-24.0, -18.0, s));
      col = mix(col, uPale, 0.2 * town * keep);
      col = mix(col, uPale, 0.9 * uSnow * pic);
      ink = inkLine(abs(d - 0.12), gz, px * 1.1);
      if (d < 6.4) {
        float rowp = floor(d / 1.6);
        ink = max(ink, max(ruled(d, 1.6, gz, px), ruled(s + h11(rowp) * 2.4, 2.4, gs, px) * smoothstep(2.6, 5.0, 1.6 / gz)) * 0.8 * town);
        col = mix(col, uPale, 0.3 * town * (1.0 - 0.5 * step(0.7, h21(vec2(rowp, floor((s + h11(rowp) * 2.4) / 2.4))))));
        ink = max(ink, inkLine(abs(d - 6.4), gz, px) * step(0.3, fract(s / 9.0 + h11(floor(s / 9.0)))));
      } else {
        vec2 cq = vec2(s / 17.0, z / 13.0), ci = floor(cq), cf = fract(cq);
        float hc = h21(ci + 5.0), inC = step(0.08, cf.x) * step(cf.x, 0.92) * step(0.1, cf.y) * step(cf.y, 0.9);
        float plot = step(0.52, hc) * inC * (1.0 - town);
        float fur = mix(ruled(z, 0.95, gz, px), ruled(s, 0.95, gs, px), step(0.76, hc));
        vec2 eb = min(cf - vec2(0.08, 0.1), vec2(0.92, 0.9) - cf) * vec2(17.0, 13.0);
        ink = max(ink, plot * max(fur * 0.75, max(inkLine(eb.x, gs, px), inkLine(eb.y, gz, px))));
        col = mix(col, uGrey, 0.07 * plot); col = mix(col, uMal, 0.2 * plot * uTone.y * keep * step(0.3, fract(hc * 7.0)));
        // grass and pebble ticks on open ground
        vec2 tq = p / vec2(1.1, 1.5), ti = floor(tq), tf = fract(tq);
        float th = h21(ti);
        ink = max(ink, (1.0 - plot) * step(0.86, th) * inkLine(abs(tf.y - 0.5) * 1.5, gz, px * 0.9) * step(0.2, tf.x) * step(tf.x, 0.2 + 0.5 * h21(ti + 9.0)) * smoothstep(3.0, 6.0, 1.1 / gs));
        // streets running back from the river
        float st = min(min(abs(abs(s - 86.0) - 3.6), abs(abs(s - 121.0) - 3.6)), min(abs(abs(s - 161.0) - 7.3), min(abs(abs(s - 199.0) - 3.6), abs(abs(s - 262.0) - 3.6))));
        ink = max(ink, inkLine(st, gs, px) * town);
      }
      // the threshing floor: a ruled ring with spokes of swept grain
      vec2 td = p - uThresh.xy; float tr = length(td);
      ink = max(ink, inkLine(abs(tr - uThresh.z), fwp, px));
      ink = max(ink, ruled(atan(td.y, td.x + 1e-5) * 3.0, 0.5, fwp * 3.0 / max(tr, 0.5), px) * step(tr, uThresh.z - 0.6) * step(1.2, tr) * 0.7);
      ink *= pic;
    }
    if (bend > 0.01 && mz < 73.0) {
      // ---- the painting in the bend: river banks, roofs and trees in flat elevation, no three dimensions
      float gink = inkLine(abs(mz - w), gz, px * 1.1);
      if (mz > w + 3.0) {
        // the painting climbs in stages of 22 m, each with a range of hills standing out of cloud and, before and on
        // it, three rows of roofs and willows of uneven size, set half a cell along from each other, with cells left
        // empty and one oblique street left open. Roofs take an azurite-grey wash over pale walls, willow heads malachite
        float gk = bend * (1.0 - omit);
        float upc = -sp, per = floor(upc / 22.0), f = upc - 22.0 * per;
        hillRange(col, gink, f, z, 13.6, 5.8, 0.06, per * 3.7 + uSeed * 9.0, 9.0, fwp, px, gk * 0.95, 0.0, 0.0, 0.5, 0.5);
        float rr = (f - 0.6) / 6.3, rowi = floor(rr);
        vec2 cq = vec2(rr, z / 7.0 + 0.5 * rowi + per * 0.37), ci = vec2(rowi + per * 3.0, floor(cq.y));
        float hc = h21(ci + 2.0) * mix(1.2, 1.5, step(1.5, rowi)), gsc = mix(1.25, 0.82, h21(ci + 21.0));
        vec2 g = vec2((fract(cq.y) - 0.5) * 7.0 + (h21(ci + 4.0) - 0.5) * 1.0, (fract(cq.x) - 0.5) * 6.3 + (h21(ci + 8.0) - 0.5) * 0.8) * 1.38 * gsc;
        vec3 fl; float dg = glyph(g, ci, hc, fl);
        float vk = step(0.0, rowi) * step(rowi, 2.5) * step(0.07, abs(fract((upc * 0.35 + z) / 46.0) - 0.5)) * gk;
        gink = max(gink * (1.0 - max(fl.x, max(fl.y, fl.z)) * vk), inkLine(dg, fwp * 1.38 * gsc, px) * vk);
        col = mix(col, mix(mix(uAzur, uGrey, 0.25), uPale, uSnow), 0.85 * fl.x * vk);
        col = mix(col, uPale, 0.5 * fl.y * vk);
        col = mix(col, uMal, 0.8 * fl.z * vk * max(uTone.y, 0.3));
      }
      ink = mix(ink, max(ink, gink), bend);
    }
    line = max(line, ink * (1.0 - omit));
    // ---- the far end: where the silk rises to the feed roller the picture goes on in flat elevation, as a blue-green
    // landscape: three ranges of hills standing out of mist, the river winding up between them, and a reserve of
    // pale silk left round the great seal, which hangs over them like a sun. Nothing three-dimensional stands here
    if (s > 293.0 && mz < 74.5) {
      float sw = s - 299.0, dc = length(p - uBig.xy);
      // the reserve round the great seal is cut on a ruled collar of cloud, twelve lobes that turn slowly
      float ca = atan(p.y - uBig.y, p.x - uBig.x + 1e-5), cedge = dc - (uBig.z + 2.3 + 1.5 * abs(sin(ca * 6.0 + uTime * 0.03)));
      float res = smoothstep(-fwp, fwp, cedge) * (1.0 - smoothstep(42.0, 49.0, sw));
      float sd = smoothstep(6.0, 44.0, mz), wk = (1.0 - smoothstep(uFade.x * 1.35, uFade.y * 1.7, dist)) * res;
      // gold-flecked paper: small lozenges of leaf scattered over the blank silk, catching the light in turn
      vec2 gq = p / 1.7, gi = floor(gq), gf = fract(gq) - 0.5, go = (vec2(h21(gi + 71.0), h21(gi + 73.0)) - 0.5) * 0.5;
      float gh = h21(gi + 61.0), gsz = 0.1 + 0.15 * h21(gi + 67.0), gfw = fwp / 1.7;
      float fleck = step(0.5, gh) * (1.0 - smoothstep(gsz - gfw, gsz + gfw, abs(gf.x - go.x) + abs(gf.y - go.y))) * smoothstep(1.2, 2.6, gsz / gfw);
      col = mix(col, uGold, 0.95 * fleck * (0.6 + 0.4 * sin(uTime * 0.9 + gh * 40.0)) * smoothstep(296.0, 303.0, s) * (1.0 - smoothstep(uFade.x * 1.35, uFade.y * 1.7, dist)));
      float wink = 0.0;
      // (the three ranges are told apart by colour, not by strength: pale azurite, deep azurite, malachite over azurite)
      hillRange(col, wink, sw, z, 15.0 + 13.0 * sd, 13.0, 0.05, 3.0 + uSeed * 9.0, 17.0, fwp, px, wk, 1.0, 0.2, 0.3, 0.0);
      hillRange(col, wink, sw, z, 7.5 + 7.5 * sd, 9.0, 0.075, 11.0 + uSeed * 9.0, 11.5, fwp, px, wk, 1.0, 0.0, 0.4, 0.8);
      // a temple hall on each flank, below the seal, standing on the middle range: two cinnabar storeys under azurite roofs
      vec2 tg = vec2(mz - 36.0, sw - 17.0 - 5.0 * sd) / 2.2;
      vec3 tf0, tf1; float td = min(glyph(vec2(tg.x, tg.y), vec2(3.0, 5.0), 0.2, tf0), glyph(vec2(tg.x * 1.5, tg.y - 3.3), vec2(3.0, 5.0), 0.2, tf1));
      vec3 tfl = max(tf0, tf1); float tk = wk * step(abs(tg.x), 4.6) * step(-1.6, tg.y) * step(tg.y, 5.6);
      col = mix(col, mix(uAzur, uPale, uSnow), 0.95 * tfl.x * tk);
      col = mix(col, uSeal, 0.85 * tfl.y * tk);
      col = mix(col, uGold, tk * (1.0 - smoothstep(0.3 - fwp, 0.3 + fwp, length(tg - vec2(0.0, 5.45)))));
      wink = max(wink * (1.0 - max(tfl.x, tfl.y) * tk), inkLine(td, fwp * 0.55, px) * tk);
      hillRange(col, wink, sw, z, 1.6 + 2.6 * sd, 6.0, 0.11, 23.0 + uSeed * 9.0, 7.0, fwp, px, wk, 0.0, 0.0, 1.3, 1.0);
      // the river comes on up the sheet, narrowing and winding, and is lost in the mist under the seal
      float up = smoothstep(-3.0, 14.0, sw), zc = 6.5 * sin(sw * 0.3 + 0.6) * smoothstep(0.0, 6.0, sw), hw = mix(15.0, 1.4, up);
      float de = (abs(z - zc) - hw) / sqrt(1.0 + 3.8 * up), inr = 1.0 - smoothstep(-fwp, fwp, de);
      float rk = wk * (1.0 - smoothstep(13.0, 19.0, sw)) * smoothstep(-6.0, -2.0, sw);
      col = mix(col, uWater, 0.85 * inr * rk * uTone.x);
      wink *= 1.0 - inr * rk;
      float flw = ruled(z - zc, 1.7, fwp, px * 0.8) * step(0.5, fract(sw / 5.0 - uTime * 0.22 + h11(floor((z - zc) / 1.7)) * 3.0)) * inr * step(abs(z - zc), hw - 0.5);
      wink = max(wink, max(inkLine(abs(de), fwp, px), flw * 0.7) * rk);
      // the last of the town climbs the foot of the sheet: two rows of roofs and willows either side of the river
      float vq = (sw + 1.0) / 5.6, vrow = floor(vq);
      vec2 vc = vec2(vq, z / 5.8 + 0.5 * mod(vrow, 2.0)), vi = floor(vc) + 40.0;
      vec2 vg = vec2((fract(vc.y) - 0.5) * 5.8 + (h21(vi + 4.0) - 0.5) * 0.5, (fract(vc.x) - 0.5) * 5.6 + (h21(vi + 8.0) - 0.5) * 0.5) * 1.42;
      vec3 vf; float vd = glyph(vg, vi, h21(vi + 2.0) * mix(0.92, 1.25, clamp(vrow, 0.0, 1.0)), vf);
      float vk = wk * step(0.0, vrow) * step(vrow, 1.5) * step(hw + 3.2, abs(z - zc)) * step(mz, 71.0);
      col = mix(col, mix(mix(uAzur, uGrey, 0.2), uPale, uSnow), 0.9 * vf.x * vk);
      col = mix(col, uPale, 0.8 * vf.y * vk);
      col = mix(col, mix(uMal, uGrey, uSnow * 0.6), 0.85 * vf.z * vk);
      wink = max(wink * (1.0 - max(vf.x, vf.y) * vk), inkLine(vd, fwp * 1.42, px) * vk);
      // the collar itself: two ruled scalloped lines, the inner one fainter and turning the other way
      float far2 = (1.0 - smoothstep(uFade.x * 1.35, uFade.y * 1.7, dist)) * (1.0 - smoothstep(42.0, 49.0, sw));
      ${j0?`// (END_FRAME_R14: a scalloped band of pale ochre between two ruled lines of cloud, and inside it the fainter line)
      col = mix(col, uOchre, 0.8 * smoothstep(-fwp, fwp, cedge) * (1.0 - smoothstep(0.85 - fwp, 0.85 + fwp, cedge)) * far2);
      wink = max(wink * (1.0 - step(cedge, 0.85) * far2), max(max(0.8 * inkLine(abs(cedge), fwp, px), 0.8 * inkLine(abs(cedge - 0.85), fwp, px)), 0.4 * inkLine(abs(dc - (uBig.z + 0.8 + 0.9 * abs(sin(ca * 6.0 + 0.26 - uTime * 0.02)))), fwp, px * 0.8)) * far2);`:"wink = max(wink, max(0.6 * inkLine(abs(cedge), fwp, px * 0.9), 0.4 * inkLine(abs(dc - (uBig.z + 0.8 + 0.9 * abs(sin(ca * 6.0 + 0.26 - uTime * 0.02)))), fwp, px * 0.8)) * far2);"}
      line = max(line, wink);
    }
    col = mix(col, uInk, clamp(line, 0.0, 1.0));
    // ---- seals: five small collectors' seals stamped flat, the new impression, and the great round seal
    float red = 0.0;
    for (int i = 0; i < 5; i++) {
      vec4 sl = uSeals[i]; vec2 sq = (p - sl.xy) / max(abs(sl.z), 0.1); float fs = fwp / max(abs(sl.z), 0.1);
      float sk = sl.w > 1.5 ? squareSeal(sq * vec2(1.0, 0.72), fs) * step(length(sq * vec2(1.0, 0.72)), 0.98)      // oval
               : sl.w > 0.5 ? max(squareSeal(sq * 2.0 - vec2(0.0, 1.2), fs * 2.0) * step(length(sq * 2.0 - vec2(0.0, 1.2)), 1.2), squareSeal(sq * 1.6 + vec2(0.0, 1.15), fs * 1.6) * step(length(sq * 1.6 + vec2(0.0, 1.15)), 1.2))   // gourd: two lobes and a clear waist
               : squareSeal(sq, fs);
      red = max(red, sk);
    }
    red = max(red, squareSeal((p - uStampAt.xy) / uStampAt.z, fwp / uStampAt.z) * uStampAt.w);
    vec2 bd = (p - uBig.xy); float br = length(bd), ba = atan(bd.y, bd.x + 1e-5), R = uBig.z, fr2 = fwp;
    ${j0?`// (END_FRAME_R14: the great seal is cut clean, as a graphic seal: a clear outer rim, a band of squared key-fret between
    // two ruled rings (turning slowly), and the scalloped ring that holds the opening; flat cinnabar, laid after the
    // small seals with no uneven pressure)
    float big = 0.0;
    if (br < R + 1.0) {
      float rim = smoothstep(R * 0.935 - fr2, R * 0.935 + fr2, br) * (1.0 - smoothstep(R - fr2, R + fr2, br));
      float inner = 1.0 - smoothstep(-fr2, fr2, br - R * (0.7 + 0.011 * sin(ba * 16.0 - uBig.w * 2.0)));        // the ring that holds the opening
      float cwm = br * 3.14159265 / 12.0, hb = R * 0.0727, th = R * 0.0108;       // 24 keys; half the band; half a stroke
      vec2 kq = vec2((fract(ba * 12.0 / 3.14159265 + uBig.w) - 0.5) * cwm, br - R * 0.835);
      float kd = min(abs(kq.y - hb), abs(kq.y + hb));
      kd = min(kd, min(sdSeg(kq, vec2(-0.062 * R, -hb), vec2(-0.062 * R, 0.4 * hb)), sdSeg(kq, vec2(-0.062 * R, 0.4 * hb), vec2(0.032 * R, 0.4 * hb))));
      kd = min(kd, min(sdSeg(kq, vec2(0.032 * R, 0.4 * hb), vec2(0.032 * R, -0.38 * hb)), sdSeg(kq, vec2(0.032 * R, -0.38 * hb), vec2(-0.016 * R, -0.38 * hb))));
      kd = min(kd, sdSeg(kq, vec2(0.079 * R, hb), vec2(0.079 * R, -0.38 * hb)));
      big = max(max(rim, inner), 1.0 - smoothstep(th - fr2, th + fr2, kd));
    }`:`if (br < R + 1.0) {
      float rim = smoothstep(R * 0.93 - fr2, R * 0.93 + fr2, br) * (1.0 - smoothstep(R - fr2, R + fr2, br));
      float inner = 1.0 - smoothstep(R * 0.69 - fr2, R * 0.69 + fr2, br);                        // the ring that holds the opening
      float t1 = ba * 14.0 / 3.14159265 + uBig.w, fa = fract(t1), rr = (br - R * 0.79) / (R * 0.11);
      float fret = step(0.0, rr) * step(rr, 1.0) * max(max(step(rr, 0.22) * step(fa, 0.72), step(0.78, rr) * step(0.28, fa)), max(step(abs(fa - 0.72), 0.09) * step(rr, 0.62), step(abs(fa - 0.28), 0.09) * step(0.38, rr)));
      float cloud = 1.0 - smoothstep(R * 0.022 - fr2, R * 0.022 + fr2, abs(br - R * (0.735 + 0.018 * sin(ba * 16.0 - uBig.w * 2.0))));
      float press = 0.9 + 0.1 * smoothstep(0.25, 0.6, vnoise(p * 1.3 + 9.0));
      red = max(red, max(max(rim, inner), max(fret, cloud)) * press * 1.25);
    }`}
    float pr = 0.8 + 0.2 * smoothstep(0.25, 0.6, vnoise(p * 2.3 + 9.0));
    // (no red lies on the water: where a collector's impression falls on the river it is the same block printed in the
    // water's own deeper blue)
    float onRiver = (((mz < w + 0.12 && h < 0.03) || thrK > 0.5) ? 1.0 : 0.0) * pic;
    col = mix(col, mix(uSeal, mix(uWater, uInk, 0.5), onRiver), clamp(red, 0.0, 1.0) * pr);${j0?`
    col = mix(col, uSeal, big);`:""}
    gl_FragColor = vec4(col, 1.0);
  }
`,lo=`
  varying vec3 vD;
  void main() { vD = position; vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); gl_Position = p; }
`,ro=`
  uniform vec3 uSilk, uPale, uTable, uInk, uMal, uAzur, uGold, uGrey, uTone, uFar, uMid; uniform float uTime, uSeed, uSnow, uLinePx;
  varying vec3 vD;
  ${ht}
  ${Wt}
  float domeRidge(vec2 dn, float k, float sd, float sharp) {
    float n1 = vnoise(dn * k + sd), n2 = vnoise(dn * k * 2.6 + sd + 5.0), n3 = vnoise(dn * k * 0.5 + sd + 9.0);
    float r = 1.0 - abs(2.0 * n1 - 1.0);
    return mix(r, r * r, sharp) * (0.4 + 0.6 * n3) + 0.2 * n2;
  }
  // one range of the landscape painted on the silk all round the scroll, in the blue-green manner: a ruled crest, a
  // wash that is malachite (snow-pale in the first-snow look) at the crest and azurite below and is left out toward the
  // foot (mist), one gold contour, hemp-fibre strokes hanging from the crest. sc / fsc: a coordinate that runs round
  // the horizon and its footprint; amp is the height of the tallest peaks
  void domeRange(inout vec3 col, inout float cover, float e, vec2 dn, float base, float amp, float k, float sd, float depth, float sharp, float fe, float sc, float fsc, float a, vec3 crestC, vec3 deepC) {
    vec2 d2 = normalize(dn + vec2(-dn.y, dn.x) * 0.004);
    float r0 = base + amp * domeRidge(dn, k, sd, sharp), r1 = base + amp * domeRidge(d2, k, sd, sharp);
    float sl = (r1 - r0) / 0.004, F = (e - r0) / sqrt(1.0 + sl * sl);
    float t = clamp((r0 - e) / depth, 0.0, 1.0), inn = 1.0 - smoothstep(-fe, fe, F);
    vec3 crest = mix(crestC, uPale, uSnow);
    float tsn = 0.2 + 0.07 * sin(sc * k * 7.0 + sd) + 0.04 * sin(sc * k * 19.0 + sd * 2.0), esn = fe / depth;
    float wm = mix(smoothstep(0.08, 0.3, t), smoothstep(tsn - esn, tsn + esn, t), uSnow);
    vec3 wash = mix(crest, deepC, wm);
    // laid boldly and flat; thinned only toward the foot, where the next range or the mist takes over
    float body = inn * (1.0 - 0.8 * smoothstep(0.6, 1.0, t)) * a;
    col = mix(col, wash, min(1.0, 0.95 * body * uTone.z));
    cover = max(cover, inn * a);
    col = mix(col, uGold, 0.8 * inkLine(abs(F + depth * 0.12), fe, uLinePx * 1.1) * a * uTone.z);
    float cell = floor(sc * k * 9.0), hh = h11(cell + sd * 13.0);
    float st = ruled(sc * k * 9.0 + 0.3 * sin(e * 40.0 + sd), 1.0, fsc * k * 9.0, uLinePx * 0.8) * step(0.4, hh) * inn * step(0.03, t) * (1.0 - smoothstep(0.1 + 0.3 * hh, 0.16 + 0.4 * hh, t));
    col = mix(col, uInk, min(1.0, max(inkLine(abs(F), fe, uLinePx), 0.75 * st) * a * 1.35));
  }
  void main() {
    vec3 d = normalize(vD + vec3(0.0, 1e-5, 0.0));
    vec2 q = d.xz / (abs(d.y) + 0.4) * 3.0 + uSeed * 7.0 + uTime * 0.0035;
    float fox = smoothstep(0.52, 0.86, vnoise(q * 1.3) * 0.7 + vnoise(q * 4.1) * 0.3);
    // the paper is luminous at the horizon, behind the roofs, and a little deeper overhead
    vec3 col = mix(mix(uPale, uSilk, 0.35), uSilk * 0.94, smoothstep(0.05, 0.75, d.y)) * (1.0 - 0.04 * fox);
    vec2 pc = floor(q * 0.7 + 3.0), pf = fract(q * 0.7 + 3.0);
    // mends: soft-edged paler patches with a faint stitched border
    vec2 pe = min(pf - vec2(0.2, 0.25), vec2(0.6, 0.6) - pf);
    float pm = min(pe.x, pe.y), has = step(0.85, h21(pc));
    col = mix(col, mix(uSilk, uPale, 0.5), 0.1 * has * smoothstep(0.0, 0.04, pm));
    float along = pe.x < pe.y ? pf.y : pf.x;
    col *= 1.0 - 0.07 * has * (1.0 - smoothstep(0.004, 0.009, abs(pm - 0.025))) * step(0.5, fract(along * 26.0));
    float cr = abs(fract(q.x * 0.16 + q.y * 0.05) - 0.5);
    col *= 1.0 - 0.05 * (1.0 - smoothstep(0.0, 0.006, cr));
    // ---- the landscape beyond the town: three ranges standing one behind another all round the scroll, the furthest
    // the tallest and palest, with two bands of mist (bare silk) drifting across them. Down the axis of the scroll,
    // where the great seal and the feed roller hang, the peaks stand lower and leave the silk open
    float lxz = max(length(d.xz), 1e-4), e = d.y / lxz, fe = max(length(vec2(dFdx(e), dFdy(e))), 1e-6);
    vec2 dn = d.xz / lxz;
    vec2 fdn = vec2(length(vec2(dFdx(dn.x), dFdy(dn.x))), length(vec2(dFdx(dn.y), dFdy(dn.y))));
    float useX = step(abs(dn.x), abs(dn.y)), sc = mix(dn.y, dn.x, useX), fsc = max(mix(fdn.y, fdn.x, useX), 1e-6);
    float open = 1.0 - 0.5 * smoothstep(0.9, 0.995, dn.x);
    float foot = smoothstep(0.012, 0.085, e) * (1.0 - smoothstep(0.62, 0.8, e));
    float m1 = 0.125 + 0.03 * sin(dn.x * 5.0 + uTime * 0.021 + uSeed * 6.0) + 0.02 * sin(dn.y * 7.0 - uTime * 0.016 + 2.0);
    float m2 = 0.27 + 0.04 * sin(dn.y * 4.0 + uTime * 0.017 + 1.0) + 0.025 * sin(dn.x * 6.0 - uTime * 0.012 + uSeed * 9.0);
    float mist = smoothstep(0.006, 0.032, abs(e - m1)) * (0.45 + 0.55 * smoothstep(0.008, 0.036, abs(e - m2)));
    // three ranges told apart by colour: pale azurite far off, deep azurite, then malachite over azurite. No crest of
    // the far range stands above e = 0.42. The mist is laid over them afterwards as bands of luminous reserve
    float ak = foot * 0.95, cover = 0.0;
    domeRange(col, cover, e, dn, 0.12, 0.3 * open, 3.1, 2.0 + uSeed * 5.0, 0.22, 0.45, fe, sc, fsc, ak, mix(uFar, uMal, 0.3), uFar);
    domeRange(col, cover, e, dn, 0.085, 0.26 * open, 5.0, 14.0 + uSeed * 5.0, 0.15, 0.45, fe, sc, fsc, ak, mix(uMid, uMal, 0.55), uMid);
    domeRange(col, cover, e, dn, 0.035, 0.15 * (0.6 + 0.4 * open), 8.0, 27.0 + uSeed * 5.0, 0.085, 0.2, fe, sc, fsc, ak, uMal, mix(uAzur, uMal, 0.35));
    col = mix(col, uPale, 0.8 * (1.0 - mist) * cover);
    col = mix(col, uTable, 1.0 - smoothstep(-0.03, 0.005, d.y));
    gl_FragColor = vec4(col, 1.0);
  }
`,co=`
  attribute vec4 aA; attribute vec4 aB; attribute vec4 aInfo; attribute vec3 aCol;
  uniform float uTime;
  varying vec2 vQ; varying vec3 vCol; varying float vHat; varying float vDist; varying vec3 vW;
  #include <fog_pars_vertex>
  ${ft}
  void main() {
    vec3 ab = aB.xyz - aA.xyz;
    float len = max(length(ab), 0.01), t = fract(uTime * aB.w / len * 0.5 + aA.w), tri = 1.0 - abs(2.0 * t - 1.0);
    if (aInfo.z > 0.5) tri = t;                                      // processions go one way and come round again
    vec3 base = aA.xyz + ab * tri;
    base.y += 0.07 * abs(sin(uTime * 4.6 + aA.w * 40.0)) * step(0.001, aB.w) + 0.03 * sin(uTime * 1.3 + aA.w * 17.0);
    float h = aInfo.x * (aInfo.z > 0.5 ? smoothstep(0.0, 0.03, t) * (1.0 - smoothstep(0.97, 1.0, t)) : 1.0);
    vec3 loc = base + vec3(0.0, position.y * h, 0.0);
    vec4 wp = modelMatrix * vec4(loc, 1.0);
    vec3 right = normalize(vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0]) + vec3(1e-5, 0.0, 0.0));
    wp.xyz += right * (position.x * h * 0.46 + aInfo.w * position.y);
    wp.y += rippleY(wp.x); vW = wp.xyz;
    vQ = vec2(position.x * 0.46, position.y); vCol = aCol; vHat = aInfo.y;
    vec4 mvPosition = viewMatrix * wp;
    vDist = length(mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`,ho=`
  attribute vec3 aA; attribute vec4 aB; attribute vec4 aK; attribute vec3 aCol;
  uniform float uTime, uU;
  varying vec2 vQ; varying vec4 vK; varying vec3 vCol; varying float vGait; varying vec3 vW;
  ${ft}
  void main() {
    float kind = aK.x, size = aK.y, ph = aK.w;
    vec3 base = aA; float flip = 1.0, sc = 1.0, gait = 0.0, piv = 0.0; vec2 rot = vec2(1.0, 0.0);
    vec3 right = normalize(vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0]) + vec3(1e-5, 0.0, 0.0)), up = vec3(0.0, 1.0, 0.0);
    if (kind < 0.5) {
      vec3 ab = aB.xyz - aA; float len = max(length(ab), 0.01), t = fract(uTime * aB.w / len + ph);
      base = aA + ab * t; sc = smoothstep(0.0, 0.03, t) * (1.0 - smoothstep(0.97, 1.0, t));
      flip = dot(right, ab) < 0.0 ? -1.0 : 1.0; gait = uTime * aB.w * 2.6 / max(size, 0.2) + ph * 40.0;
      base.y += 0.04 * size * abs(sin(gait));
    } else if (kind < 1.5) {
      base.x += 0.8 * sin(uTime * 0.21 + ph * 9.0); base.z += 0.6 * sin(uTime * 0.17 + ph * 5.0);
      base.y += 0.05 * sin(uTime * 1.9 + ph * 30.0); flip = sin(uTime * 0.11 + ph * 20.0) > 0.0 ? 1.0 : -1.0;
      gait = 0.12 * sin(uTime * 1.9 + ph * 30.0);
    } else if (kind < 2.5) {
      float a = uTime * aB.w + ph * 6.2831;
      base = aA + vec3(aB.x * sin(a), aB.y * sin(a * 2.3 + ph * 11.0), aB.z * sin(a * 1.7 + ph * 5.0));
      up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]); right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
      gait = sin(uTime * 13.0 + ph * 50.0); flip = cos(a) * aB.x * right.x + cos(a * 1.7 + ph * 5.0) * 1.7 * aB.z * right.z < 0.0 ? -1.0 : 1.0;
    } else if (kind < 3.5) {
      gait = 0.12 * sin(uTime * 1.1 + ph * 30.0);
    } else if (kind < 4.5) {
      base += vec3(1.6 * sin(uTime * 0.31 + ph * 8.0), 1.1 * sin(uTime * 0.47 + ph * 3.0), 1.3 * sin(uTime * 0.23 + ph * 12.0));
      gait = 0.25 * sin(uTime * 0.9 + ph * 20.0);
    } else if (kind < 5.5) {                                          // a snowflake: an unpainted pale dot, falling
      base.y = mod(aA.y - uTime * aB.w, 26.0);
      base.x += 0.9 * sin(uTime * 0.5 + ph * 30.0); base.z += 0.7 * sin(uTime * 0.37 + ph * 17.0);
      sc = clamp(length(base - cameraPosition) / 16.0, 0.03, 1.0);   // a flake by the eye stays a dot of a few pixels
      up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]); right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    } else if (kind > 6.5) {                                          // a crane, wings beating slowly
      up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]); right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
      vec3 vel = aB.xyz - aA;
      if (aK.z < 0.5) {
        float t = fract(uTime * aB.w / max(length(vel), 0.01) + ph);
        base = aA + vel * t; base.y += 1.1 * sin(uTime * 0.45 + ph * 40.0);
        sc = smoothstep(0.0, 0.04, t) * (1.0 - smoothstep(0.96, 1.0, t));
      } else {
        // circling the great seal in the plane of the sheet, seen from above with both wings spread: the card is turned
        // to the bird's heading and held to a size on screen as the eye comes close. The ring keeps its size for the whole
        // flight: the birds leave the frame as the eye closes on the seal, by perspective alone
        float a = uTime * aB.w + ph * 6.2831;
        base = aA + vec3(aB.x * sin(a), aB.y * sin(a), aB.z * cos(a));
        vel = vec3(aB.x * cos(a), aB.y * cos(a), -aB.z * sin(a)) * sign(aB.w);
        sc = clamp(length(base - cameraPosition) / 40.0, 0.4, 1.0);
        rot = normalize(vec2(dot(right, vel), dot(up, vel)) + vec2(1e-4, 0.0)); piv = 0.7;
      }
      gait = sin(uTime * 3.6 + ph * 50.0); flip = aK.z > 0.5 ? 1.0 : dot(right, vel) < 0.0 ? -1.0 : 1.0;
    } else {                                                          // a swallow flying from A to B as u runs from aB.w over the next 0.075
      float t = clamp((uU - aB.w) / 0.075, 0.0, 1.0);
      base = mix(aA, aB.xyz, t) + (1.0 - t) * vec3(0.0, 0.5 * sin(uTime * 2.1 + ph * 9.0), 0.9 * sin(uTime * 1.3 + ph * 5.0));
      sc = step(0.001, t) * step(t, 0.995);
      up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]); right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
      gait = sin(uTime * 13.0 + ph * 50.0); flip = dot(right, aB.xyz - aA) < 0.0 ? -1.0 : 1.0;
    }
    // a swallow far off is drawn a little larger so that it stays a bird of several pixels, and beyond 105 m it is left out
    if ((kind > 1.5 && kind < 2.5) || (kind > 5.5 && kind < 6.5)) { float dcam = length(base - cameraPosition); sc *= clamp(dcam / 45.0, 1.0, 2.4) * (1.0 - smoothstep(105.0, 140.0, dcam)); }
    vec2 qc = vec2(position.x * 1.7, position.y * 1.4);
    if (kind > 2.5 && kind < 3.5) qc.x += gait * (1.4 - qc.y);       // lanterns swing from their hooks
    qc = vec2(rot.x * qc.x - rot.y * (qc.y - piv), rot.y * qc.x + rot.x * (qc.y - piv)) + vec2(0.0, piv * (1.0 - step(0.5, piv)));
    vec4 wp = modelMatrix * vec4(base, 1.0);
    wp.xyz += (right * qc.x * flip + up * qc.y) * size * sc;
    wp.y += rippleY(wp.x); vW = wp.xyz;
    vQ = vec2(position.x * 1.7, position.y * 1.4); vK = aK; if (kind > 5.5 && kind < 6.5) vK.x = 2.0; vCol = aCol; vGait = gait;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,fo=`
  uniform vec3 uInk, uSilk, uGrey, uAzur, uSeal, uGold; uniform float uLinePx; uniform vec2 uFade;
  varying vec2 vQ; varying vec4 vK; varying vec3 vCol; varying float vGait; varying vec3 vW;
  ${ht}
  ${Gt}
  ${Wt}
  float ell(vec2 p, vec2 c, vec2 r) { vec2 q = (p - c) / r; return (length(q) - 1.0) * min(r.x, r.y); }
  void main() {
    vec2 q = vQ; float kind = floor(vK.x + 0.5), var = floor(vK.z + 0.5), px = uLinePx;
    float fw = max(length(vec2(dFdx(q.y), dFdy(q.y))), 1e-6);
    float d = 9.0, inkOnly = 9.0, dark = 9.0, rug = 9.0;
    if (kind == 0.0) {
      float camel = step(0.5, var) * step(var, 1.5), pig = step(2.5, var), leg = mix(0.5, 0.26, pig);
      d = ell(q, vec2(0.0, leg + 0.17), vec2(0.42 + 0.06 * pig, 0.19 + 0.03 * pig));
      vec2 hd = mix(vec2(0.56, leg + 0.34), vec2(0.6, leg + 0.72), camel); hd = mix(hd, vec2(0.52, leg + 0.14), pig);
      // the neck in two segments: straight for a donkey, ox or pig; a deep curve (down, forward, up) for a camel
      vec2 nb = vec2(0.34, leg + 0.22), nk = mix(0.5 * (nb + hd), vec2(0.6, leg + 0.2), camel);
      d = min(d, min(sdSeg(q, nb, nk), sdSeg(q, nk, hd)) - mix(0.065, 0.055, camel));
      d = min(d, ell(q, hd + vec2(0.07, -0.03), vec2(0.13, 0.085)));
      d = min(d, sdSeg(q, hd + vec2(-0.02, 0.06), hd + vec2(-0.07, 0.2 - 0.14 * pig)) - 0.022);            // ear
      d = min(d, mix(9.0, min(ell(q, vec2(-0.14, leg + 0.4), vec2(0.12, 0.13)), ell(q, vec2(0.13, leg + 0.4), vec2(0.12, 0.13))), camel));
      float sw = 0.13 * sin(vGait), sw2 = 0.13 * sin(vGait + 3.14159);
      d = min(d, min(sdSeg(q, vec2(0.3, leg + 0.08), vec2(0.3 + sw, 0.0)), sdSeg(q, vec2(0.24, leg + 0.08), vec2(0.24 + sw2, 0.0))) - 0.032);
      d = min(d, min(sdSeg(q, vec2(-0.3, leg + 0.08), vec2(-0.3 + sw2, 0.0)), sdSeg(q, vec2(-0.24, leg + 0.08), vec2(-0.24 + sw, 0.0))) - 0.032);
      inkOnly = sdSeg(q, vec2(-0.42, leg + 0.2), vec2(-0.5, leg - 0.05 + 0.04 * sin(vGait * 0.5)));       // tail
      vec2 pb = abs(q - vec2(-0.02, leg + 0.4)) - vec2(0.2, 0.11);                                          // panniers / load
      dark = mix(9.0, max(pb.x, pb.y), step(var, 0.5));
      // a camel carries a pack between its humps (dark) over a saddle cloth that hangs down the flank (cinnabar or azurite)
      vec2 pk = abs(q - vec2(0.0, leg + 0.52)) - vec2(0.17, 0.1), sc2 = abs(q - vec2(0.0, leg + 0.27)) - vec2(0.2, 0.15);
      dark = min(dark, mix(9.0, max(pk.x, pk.y), camel));
      rug = mix(9.0, max(sc2.x, sc2.y), camel);
      dark = min(dark, mix(9.0, sdSeg(q, vec2(0.5, leg + 0.52), vec2(0.62, leg + 0.44)) - 0.03, step(1.5, var) * step(var, 2.5)));   // ox horn
    } else if (kind == 1.0) {
      d = min(ell(q, vec2(-0.05, 0.2), vec2(0.4, 0.17)), ell(q, vec2(0.36, 0.5 + vGait), vec2(0.12, 0.1)));
      d = min(d, sdSeg(q, vec2(0.26, 0.26), vec2(0.34, 0.46 + vGait)) - 0.05);
      inkOnly = min(sdSeg(q, vec2(0.46, 0.49 + vGait), vec2(0.58, 0.47 + vGait)), sdSeg(q, vec2(-0.7, 0.04), vec2(0.7, 0.04)) + 0.02 * step(0.5, fract(q.x * 3.0)));
    } else if (kind == 2.0) {
      // a swallow as the painters dab it: body along its flight, two swept wings that beat, a forked tail
      float wv = 0.72 + 0.28 * vGait, ay = abs(q.y - 0.7);
      vec2 qs = vec2(q.x, ay);
      dark = sdSeg(q, vec2(-0.14, 0.7), vec2(0.2, 0.7)) - 0.05;
      dark = min(dark, sdSeg(qs, vec2(0.08, 0.0), vec2(-0.02, 0.22 * wv)) - 0.04);
      dark = min(dark, sdSeg(qs, vec2(-0.02, 0.22 * wv), vec2(-0.3, 0.52 * wv)) - 0.022);
      dark = min(dark, sdSeg(qs, vec2(-0.14, 0.0), vec2(-0.44, 0.1)) - 0.016);
    } else if (kind == 3.0) {
      d = ell(q, vec2(0.0, 0.62), vec2(0.34, 0.4));
      inkOnly = min(sdSeg(q, vec2(0.0, 1.02), vec2(0.0, 1.4)), min(sdSeg(q, vec2(-0.13, 1.0), vec2(0.13, 1.0)), sdSeg(q, vec2(-0.13, 0.23), vec2(0.13, 0.23))));
      inkOnly = min(inkOnly, sdSeg(q, vec2(0.0, 0.22), vec2(0.03, 0.0)));
    } else if (kind == 5.0) {
      d = length(q - vec2(0.0, 0.7)) - 0.3;
    } else if (kind == 7.0 && var > 0.5) {
      // a crane seen from above, as on a roundel: both wings spread and swept, ink-black primaries, the neck stretched
      // out ahead in a thin S, a cinnabar crown, two hair-line legs trailing behind a short dark tail
      float ay = abs(q.y - 0.7), wl = 0.86 + 0.14 * vGait;
      vec2 qs = vec2(q.x, ay), wr = vec2(0.06, 0.03), wm = vec2(0.02 - 0.05 * vGait, 0.3 * wl), wt = vec2(-0.16 - 0.06 * vGait, 0.62 * wl);
      d = min(ell(q, vec2(-0.02, 0.7), vec2(0.2, 0.062)), min(sdSeg(q, vec2(0.15, 0.7), vec2(0.38, 0.716)), sdSeg(q, vec2(0.38, 0.716), vec2(0.6, 0.7))) - 0.02);
      d = min(d, ell(q, vec2(0.64, 0.7), vec2(0.05, 0.034)));
      float tw = clamp(dot(qs - wr, wm - wr) / dot(wm - wr, wm - wr), 0.0, 1.0), tw2 = clamp(dot(qs - wm, wt - wm) / dot(wt - wm, wt - wm), 0.0, 1.0);
      d = min(d, min(sdSeg(qs, wr, wm) - mix(0.1, 0.075, tw), sdSeg(qs, wm, wt) - mix(0.075, 0.03, tw2)));
      dark = min(sdSeg(qs, mix(wm, wt, 0.45) - vec2(0.035, 0.0), wt - vec2(0.03, 0.0)) - mix(0.05, 0.026, tw2), sdSeg(q, vec2(-0.2, 0.7), vec2(-0.3, 0.7)) - 0.032);
      dark = min(dark, sdSeg(q, vec2(0.68, 0.7), vec2(0.8, 0.7)) - 0.011);
      inkOnly = min(sdSeg(qs, vec2(-0.28, 0.012), vec2(-0.66, 0.02)), sdSeg(qs, vec2(-0.12, 0.2 * wl), vec2(0.0, 0.26 * wl)));
      rug = length(q - vec2(0.635, 0.7)) - 0.024;
    } else if (kind == 7.0) {
      // a crane in flight, from the side: a slim pale body, the neck stretched out ahead in a thin S, one swept and
      // tapered wing beating (ink-black primaries) and the far wing behind it, a cinnabar crown, two hair-line legs
      vec2 wr = vec2(0.03, 0.73), wt = vec2(-0.2, 0.73 + 0.5 * vGait), wm = mix(wr, wt, 0.5) + vec2(0.05, 0.03 * vGait);
      d = min(ell(q, vec2(0.0, 0.7), vec2(0.27, 0.07)), min(sdSeg(q, vec2(0.22, 0.715), vec2(0.42, 0.775)), sdSeg(q, vec2(0.42, 0.775), vec2(0.63, 0.757))) - 0.02);
      d = min(d, ell(q, vec2(0.68, 0.762), vec2(0.052, 0.036)));
      float tw = clamp(dot(q - wr, wm - wr) / dot(wm - wr, wm - wr), 0.0, 1.0), tw2 = clamp(dot(q - wm, wt - wm) / max(dot(wt - wm, wt - wm), 1e-4), 0.0, 1.0);
      d = min(d, min(sdSeg(q, wr, wm) - mix(0.085, 0.065, tw), sdSeg(q, wm, wt) - mix(0.065, 0.026, tw2)));
      d = min(d, sdSeg(q, vec2(0.12, 0.73), vec2(0.17, 0.73 + 0.36 * vGait)) - 0.035);                    // the far wing
      dark = min(sdSeg(q, mix(wm, wt, 0.35) - vec2(0.04, 0.0), wt - vec2(0.035, 0.0)) - mix(0.045, 0.022, tw2), sdSeg(q, vec2(-0.25, 0.7), vec2(-0.35, 0.69)) - 0.03);
      dark = min(dark, sdSeg(q, vec2(0.72, 0.762), vec2(0.84, 0.752)) - 0.011);
      inkOnly = min(sdSeg(q, vec2(-0.26, 0.695), vec2(-0.74, 0.672)), sdSeg(q, vec2(-0.26, 0.68), vec2(-0.71, 0.652)));
      rug = length(q - vec2(0.672, 0.792)) - 0.026;
    } else {
      d = abs(q.x) / 0.5 + abs(q.y - 0.86) / 0.52 - 1.0; d *= 0.36;
      inkOnly = min(sdSeg(q, vec2(-0.5, 0.86), vec2(0.5, 0.86)), sdSeg(q, vec2(0.0, 0.34), vec2(0.0, 1.38)));
      inkOnly = min(inkOnly, abs(q.x - 0.07 * sin(q.y * 16.0 + vGait * 6.0)) + step(0.34, q.y) * 9.0);
    }
    float body = 1.0 - smoothstep(-0.5, 0.5, d / fw), edge = (1.0 - smoothstep(px * 0.5 - 0.5, px * 0.5 + 0.5, abs(d) / fw)) * (kind == 5.0 ? 0.0 : 1.0);
    float ln = max(edge, 1.0 - smoothstep(px * 0.5 - 0.5, px * 0.5 + 0.5, inkOnly / fw));
    float dk = 1.0 - smoothstep(-0.5, 0.5, dark / fw);
    float a = max(body, max(ln, dk));
    if (a < 0.5 || clipped(vW)) discard;
    float rg = 1.0 - smoothstep(-0.5, 0.5, rug / fw);
    vec3 fillc = mix(vCol, mix(uSeal, uAzur, step(0.5, fract(vK.w * 7.3)) * (kind == 7.0 ? 0.0 : 1.0)), rg);
    // a lantern is banded in gold at its crown and foot; a snowflake keeps a thin grey ring so that it reads on pale paper
    if (kind == 3.0) fillc = mix(fillc, uGold, step(0.29, abs(q.y - 0.62)));
    if (kind == 5.0) fillc = mix(fillc, mix(uGrey, vCol, 0.3), smoothstep(-1.7, -0.5, d / fw));
    ln = max(ln, (1.0 - smoothstep(px * 0.5 - 0.5, px * 0.5 + 0.5, abs(rug) / fw)));
    vec3 col = mix(fillc, uInk, max(ln, dk * 0.86));
    float dist = length(cameraPosition - vW);
    col = mix(col, uSilk, max(smoothstep(uFade.x, uFade.y, dist), mistAt(vW, dist)));
    gl_FragColor = vec4(col, 1.0);
  }
`,po=`
  attribute vec4 aBoat;
  varying vec2 vQ; varying vec3 vW; varying float vPh;
  ${ft}
  void main() {
    float c = cos(aBoat.z), sn = sin(aBoat.z);
    vec2 l = position.xz * vec2(5.6, 16.0) * aBoat.w;
    vec3 wp = vec3(aBoat.x + l.x * c + l.y * sn, 0.05, aBoat.y - l.x * sn + l.y * c);
    wp.y += rippleY(wp.x);
    vQ = position.xz * vec2(5.6, 16.0); vW = wp; vPh = fract(aBoat.x * 0.37 + aBoat.y * 0.61) * 9.0;
    gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
  }
`,uo=`
  uniform vec3 uInk, uSilk, uPale, uWater, uHull; uniform float uTime; uniform vec2 uFade;
  varying vec2 vQ; varying vec3 vW; varying float vPh;
  ${ht}
  ${Gt}
  void main() {
    vec2 q = vQ;
    float fw = max(max(length(vec2(dFdx(q.x), dFdy(q.x))), length(vec2(dFdx(q.y), dFdy(q.y)))), 1e-6);
    float ty = abs(q.y) / 12.5, hb = 2.75 * (1.0 - 0.52 * ty * ty * ty);
    float dh = max(abs(q.x) - hb, abs(q.y) - 12.5);
    float row = floor(q.x / 0.42), gapK = 1.0 - smoothstep(0.1, 0.32, fw);
    float gap = step(0.42 + 0.3 * clamp(dh / 2.4, 0.0, 1.0), h21(vec2(row + vPh, floor(q.y / 1.5 + h11(row + vPh) * 4.0 + uTime * 0.3 * (h11(row + 3.0) - 0.5)))));
    float a = (1.0 - smoothstep(1.5, 2.5, dh + 0.5 * sin(q.y * 1.3 + uTime * 1.2 + vPh))) * (1.0 - gap * gapK) * mix(1.0, step(0.4, fract(q.x / 0.42 + 0.2 * sin(q.y * 1.7 + uTime * 1.4))), gapK);
    float dist = length(cameraPosition - vW);
    a *= 0.55 * (1.0 - max(smoothstep(uFade.x, uFade.y, dist), mistAt(vW, dist)));
    if (a < 0.01 || clipped(vW)) discard;
    vec3 col = mix(mix(uHull, uPale, 0.3), mix(uWater, uInk, 0.38), smoothstep(0.5, 1.0, dh));
    gl_FragColor = vec4(col, a);
  }
`,qa=new y.Vector3,mo=new y.Vector3,wo=new y.Vector3;function Me(n,t,s,l,d,u,m,f,b){qa.copy(mo.subVectors(s,t)).cross(wo.subVectors(d,t)),qa.dot(u)<0?n.quad(s,t,d,l,m,f,b):n.quad(t,s,l,d,m,f,b)}function u0(n,t,s,l,d,u,m,f,b,p,v={}){const w=t-l/2-f,z=t+l/2+f,I=v.hip||0,R=u+m,q=v.drop??.35,C=v.trim||b,D=v.eave||C,_=v.ridge||C,S={edges:[0,0,0,0]},L=o(0,-1,0);for(const g of[-1,1]){const G=s+g*(d/2+f),T=s+g*d/2,ee=o(0,1,g*.01),le=u-q;v.thatch?Me(n,o(w,le,G),o(z,le,G),o(z-I,R,s),o(w+I,R,s),ee,b,p,{u0:0,v0:0}):Me(n,o(z,le,G),o(z-I,R,s),o(w+I,R,s),o(w,le,G),ee,b,p,{u0:0,v0:0,lv:z-w}),n.beam(o(w,le-.06,G),o(z,le-.06,G),.16,.2,D,[r.none],{noEnds:!0}),Me(n,o(w,le,G),o(z,le,G),o(z-f,u,T),o(w+f,u,T),L,C,[r.none],S),v.wall&&Me(n,o(t-l/2,u-1.1,T+g*.015),o(t+l/2,u-1.1,T+g*.015),o(t+l/2,u,T+g*.015),o(t-l/2,u,T+g*.015),o(0,0,g),v.wall,[r.none],{edges:[0,0,0,0],col:v.wall.band})}for(const g of[-1,1]){const G=g>0?z:w,T=G-g*I,ee=s+d/2+f,le=s-d/2-f,ie=G-g*f;if(I>0){const M=o(T,R,s);v.thatch?Me(n,o(G,u-q,ee),o(G,u-q,le),M,M.clone(),o(g,1,0),b,p,{u0:0,v0:0}):Me(n,o(G,u-q,ee),M,M.clone(),o(G,u-q,le),o(g,1,0),b,p,{u0:0,v0:0,lv:ee-le}),Me(n,o(G,u-q,ee),o(G,u-q,le),o(ie,u,s-d/2),o(ie,u,s+d/2),L,C,[r.none],S)}else{const M=o(ie,R-.02,s);Me(n,o(ie,u,s+d/2),o(ie,u,s-d/2),M,M.clone(),o(g,0,0),v.gable||b,v.gablePat||[r.none],{u0:0,v0:0})}v.wall&&Me(n,o(ie+g*.015,u-1.1,s-d/2),o(ie+g*.015,u-1.1,s+d/2),o(ie+g*.015,u,s+d/2),o(ie+g*.015,u,s-d/2),o(g,0,0),v.wall,[r.none],{edges:[0,0,0,0],col:v.wall.band})}if(n.beam(o(w+I-.25,R+.1,s),o(z-I+.25,R+.1,s),.3,.36,_),v.finials)for(const g of[-1,1])n.box((g>0?z-I:w+I)+g*.2,R+.78,s,.6,1.2,.6,v.finialMat||C,[r.none],{taper:.4})}function Et(n,t,s,l){Me(n,o(t/2,.06,s/2),o(t/2+1.6,.06,s/2-1.1),o(t/2+1.6,.06,-s/2-1.1),o(t/2,.06,-s/2),o(0,1,0),l.plaster,[r.none],{edges:[0,0,0,0],col:l.ground})}function Dt(n,t,s,l,d,u,m){const f=[r.tiles,1,.46];let b=l;for(let p=0;p<d.length;p++){const v=d[p],w=u*(p===0?1.15:1),z=v-1.8,I=v>6.4?3:2,R=p===d.length-1,q=v/2-.3;n.box(t,b+w/2,s,z,w,z,m.plaster,[r.none],{noTop:!0});for(let S=0;S<=I;S++)for(let L=0;L<=I;L++){if(S>0&&S<I&&L>0&&L<I)continue;const g=t-q+S*2*q/I,G=s-q+L*2*q/I;n.tube(o(g,b,G),o(g,b+w,G),.24,.21,m.lacquer,[r.none],{sides:6,caps:!1})}for(const S of[-1,1]){const L=z/2+.03,g=z/2-.5;n.quad(o(t-g,b+1,s+S*L),o(t+g,b+1,s+S*L),o(t+g,b+w-.6,s+S*L),o(t-g,b+w-.6,s+S*L),m.rail,[r.lattice,.34,.34],{double:!0}),n.quad(o(t+S*L,b+1,s-g),o(t+S*L,b+1,s+g),o(t+S*L,b+w-.6,s+g),o(t+S*L,b+w-.6,s-g),m.rail,[r.lattice,.34,.34],{double:!0}),n.quad(o(t-q,b,s+S*q),o(t+q,b,s+S*q),o(t+q,b+1,s+S*q),o(t-q,b+1,s+S*q),m.rail,[r.lattice,.4,.4],{double:!0,u0:0}),n.quad(o(t+S*q,b,s-q),o(t+S*q,b,s+q),o(t+S*q,b+1,s+q),o(t+S*q,b+1,s-q),m.rail,[r.lattice,.4,.4],{double:!0,u0:0}),n.beam(o(t-q,b+w-.2,s+S*q),o(t+q,b+w-.2,s+S*q),.26,.36,m.lacquer),n.beam(o(t+S*q,b+w-.2,s-q),o(t+S*q,b+w-.2,s+q),.26,.36,m.lacquer)}const C=1.3+.1*v,D=R?u*.8:u*.46,_=v/2+C-.3;u0(n,t,s,v,v,b+w+.15,D,C,m.tile,f,{hip:_,trim:m.beam,ridge:m.ridge,eave:m.eave,drop:.55}),R?b+=w+.15+D:b+=w+.05+D*(1-d[p+1]/2/(v/2+C))}n.tube(o(t,b-.2,s),o(t,b+u*1.15,s),.2,.06,m.gold,[r.none],{sides:6});for(let p=0;p<4;p++)n.tube(o(t,b+.5+p*u*.2,s),o(t,b+.72+p*u*.2,s),.66-.13*p,.6-.13*p,m.gold,[r.none],{sides:8});return b+u*1.15}function go(n,t,s){const l=t.range(15,19),d=t.range(-.8,.8),u=6;n.tube(o(0,0,0),o(d*.5,l*.5,0),.5,.36,s.bark,[r.none],{sides:6,caps:!1}),n.tube(o(d*.5,l*.5,0),o(d,l,0),.36,.14,s.bark,[r.none],{sides:6,caps:!1});for(let m=0;m<u;m++){const f=m/(u-1),b=l*(.42+.56*f),p=(4.6-3*f)*t.range(.85,1.15),v=d*(.42+.56*f)+t.range(-.9,.9)*(1-f),w=t.range(-.9,.9)*(1-f);n.cone(v,b,w,p,1.5,7,s.pine,{phase:t()*6,col:m%2?s.pine.shade:s.pine.lit}),n.cone(v,b-.05,w,p*.96,-.5,7,s.pine,{phase:t()*6,col:s.pine.deep})}}function bo(n,t,s,l,d){const u=o(t+.3,F+2.2,s);n.tube(o(t,F,s),u,.4,.3,d.bark,[r.none],{sides:6,caps:!1});for(let m=0;m<6;m++){const f=m/6*6.28+l.range(-.4,.4),b=l.range(2.2,4.2),p=o(u.x+Math.cos(f)*b,F+l.range(4.6,7.4),s+Math.sin(f)*b);n.tube(u,p,.2,.07,d.bark,[r.none],{sides:5,caps:!1});for(let v=0;v<7;v++){const w=l.range(.35,1.05),z=u.x+(p.x-u.x)*w+l.range(-.9,.9),I=u.y+(p.y-u.y)*w+l.range(-.3,.9),R=u.z+(p.z-u.z)*w+l.range(-.9,.9);n.cone(z,I,R,l.range(.55,1),.35,6,d.blossom,{phase:l()*6,col:v%3===0?d.blossom.shade:d.blossom.lit})}}}function Oe(n,t,s,l,d,u,m){n.setAnim((t.x+s.x)/2,t.y,(t.z+s.z)/2,2),n.quad(o(t.x,t.y-l,t.z),o(s.x,s.y-l,s.z),s,t,d,u,{double:!0,u0:0,col:m}),n.setAnim(0,0,0,0)}function vo(n,t,s,l,d){n.box(t,1.25,s,1.9,.14,1.9,l.timber,[r.none],{bottom:!0,patTop:[r.planks,3,.45]});for(const u of[-1,1])for(const m of[-1,1])n.box(t+u*.8,.6,s+m*.8,.14,1.2,.14,l.beam,[r.none],{noTop:!0});for(let u=0;u<3;u++){const m=d()*6.28;n.box(t+Math.cos(m)*1.7,.36,s+Math.sin(m)*1.7,.6,.72,.6,l.timber,[r.none],{ry:m})}n.tube(o(t+.3,1.32,s-.2),o(t+.3,1.7,s-.2),.2,.13,l.charcoal,[r.none],{sides:6})}function Kt(n,t,s,l,d,u=3){for(let m=0;m<u;m++){const f=d.range(.8,1.3),b=d.int(0,2),p=t+d.range(-1.2,1.2),v=s+d.range(-.9,.9);b===0?n.box(p,f/2,v,f,f,f,l.timber,[r.planks,2,.34],{ry:d()*1.5,patTop:[r.planks,2,.34]}):b===1?n.tube(o(p,0,v),o(p,f*.9,v),f*.34,f*.42,l.stone,[r.none],{sides:8,capCol:l.charcoal.lit}):n.box(p,f*.3,v,f*1.1,f*.6,f*.8,l.cloth,[r.none],{taper:.8,ry:d()*3})}}function xo(n,t,s){const l=t.range(6.5,9),d=t.range(5,6.5),u=3.1,m=[r.weave,.4,.4];n.box(0,u/2,0,l,u,d,s.wattle,m,{noTop:!0});for(const p of[-1,1])n.box(p*l/2,u/2,d/2,.3,u,.3,s.beam,[r.none],{});n.box(t.range(-1.5,1.5),1.3,d/2+.03,1.6,2.6,.08,s.charcoal,[r.none],{}),n.quad(o(l/2-2.3,1.5,d/2+.04),o(l/2-.9,1.5,d/2+.04),o(l/2-.9,2.5,d/2+.04),o(l/2-2.3,2.5,d/2+.04),s.rail,[r.lattice,.3,.3],{}),u0(n,0,0,l,d,u,t.range(2.4,3.1),.9,s.thatch,[r.ticks,.34,.75],{thatch:!0,hip:t.chance(.5)?1.6:0,gable:s.wattle,gablePat:m,trim:s.beam,drop:.5,wall:s.wattle}),Et(n,l,d,s);const f=t.chance(.5)?1:-1;n.box(f*(l/2+1.3),1.1,-.6,2.6,2.2,3.4,s.wattle,m,{noTop:!0}),Me(n,o(f*(l/2+2.9),1.9,1.4),o(f*(l/2+2.9),1.9,-2.6),o(f*(l/2-.1),2.9,-2.6),o(f*(l/2-.1),2.9,1.4),o(f*.2,1,0),s.thatch,[r.ticks,.34,.75],{u0:0,v0:0});for(let p=0;p<5;p++)n.tube(o(-f*(l/2+.6),.25+p%2*.42,-1+p*.5),o(-f*(l/2+2.4),.25+p%2*.42,-1+p*.5),.22,.2,s.log,[r.none],{sides:6,capCol:s.endGrain});Kt(n,-f*1.8,d/2+1.6,s,t,3);const b=d/2+t.range(3,4.5);n.quad(o(-l/2-2,0,b),o(l/2+1,0,b),o(l/2+1,1.5,b),o(-l/2-2,1.5,b),s.rail,[r.lattice,.42,.42],{double:!0,u0:0}),n.quad(o(-l/2-2,0,b),o(-l/2-2,0,b-4),o(-l/2-2,1.5,b-4),o(-l/2-2,1.5,b),s.rail,[r.lattice,.42,.42],{double:!0,u0:0});for(let p=0;p<4;p++)n.box(-l/2-2+p*(l+3)/3,.9,b,.16,1.8,.16,s.beam,[r.none],{});if(t.chance(.7)){const p=f*(l/2+1),v=d/2+1.2;for(const w of[0,4.2])n.box(p+f*w,1.6,v,.14,3.2,.14,s.beam,[r.none],{});n.beam(o(p,3.1,v),o(p+f*4.2,3.1,v),.08,.08,s.timber,[r.none],{noEnds:!0});for(let w=0;w<3;w++){const z=p+f*(.4+w*1.3);Oe(n,o(z,3.08,v),o(z+f*1,3.08,v),t.range(1.1,1.9),s.cloth,t.chance(.4)?[r.stripes,.24,1]:[r.none],t.chance(.5)?s.cloth.lit:s.greyCloth.lit)}}}function Aa(n,t,s,l){const d=l?t.range(12,14.5):t.range(8.5,11),u=t.range(7,8.5),m=4.2,f=l?3.6:3.1,b=u/2,p=[r.tiles,1,.46],v=Math.round(d/3.2);n.box(0,m/2,-.2,d,m,u-.4,s.plaster,[r.none],{noTop:!0});for(let S=0;S<=v;S++)n.box(-d/2+S*d/v,m/2,b,.36,m,.36,s.lacquer,[r.none],{noTop:!0});n.beam(o(-d/2,m-.3,b),o(d/2,m-.3,b),.3,.4,s.beam);const w=t.int(0,v-1);for(let S=0;S<v;S++){const L=-d/2+S*d/v+.2,g=-d/2+(S+1)*d/v-.2,G=b+.02;if(S===w){Oe(n,o(L,m-.5,G),o(g,m-.5,G),1.5,s.cloth,[r.stripes,.3,2],(w+v)%2?s.red.lit:s.blue.lit),n.box((L+g)/2,1.5,b-.3,g-L,3,.1,s.charcoal,[r.none],{});continue}const T=t.int(0,2);if(T===0)n.quad(o(L,1.3,G),o(g,1.3,G),o(g,m-.6,G),o(L,m-.6,G),s.rail,[r.lattice,.34,.34],{}),n.box((L+g)/2,.65,b,g-L,1.3,.2,s.timber,[r.planks,3,.32],{});else if(T===1){n.box((L+g)/2,.6,b+.5,g-L,1.2,1,s.timber,[r.planks,3,.3],{patTop:[r.planks,3,.3]});for(let ee=0;ee<3;ee++)n.tube(o(L+.5+ee*.8,1.2,b+.5),o(L+.5+ee*.8,1.75,b+.5),.26,.17,s.stone,[r.none],{sides:7,capCol:s.charcoal.lit});n.box((L+g)/2,2.2,b-.6,g-L,2,.1,s.charcoal,[r.none],{})}else n.quad(o(L,0,G),o(g,0,G),o(g,m-.6,G),o(L,m-.6,G),s.timber,[r.planks,9,.5],{u0:0})}const z=m+.5,I=b+(l?2.6:2);Me(n,o(d/2+.6,z-1,I),o(d/2+.6,z,b-.2),o(-d/2-.6,z,b-.2),o(-d/2-.6,z-1,I),o(0,1,.01),s.tile,p,{u0:0,v0:0,lv:d+1.2}),n.beam(o(-d/2-.6,z-1.06,I),o(d/2+.6,z-1.06,I),.18,.2,s.beam);for(let S=0;S<=v;S++){const L=-d/2+S*d/v;n.beam(o(L,m-1.2,b+.1),o(L,z-1,I-.15),.14,.16,s.beam,[r.none],{noEnds:!0})}t.chance(.75)&&Oe(n,o(-d/2,z-1.12,I),o(d/2,z-1.12,I),.8,s.cloth,[r.stripes,.42,1],s.cloth.lit);const R=m+.5,q=d-.8,C=u-1.2;n.box(0,R+f/2,-.3,q,f,C,s.plaster,[r.none],{noTop:!0});const D=-.3+C/2+.03;for(let S=0;S<v;S++){const L=-q/2+S*q/v+.35,g=-q/2+(S+1)*q/v-.35;n.quad(o(L,R+1,D),o(g,R+1,D),o(g,R+f-.5,D),o(L,R+f-.5,D),s.rail,t.chance(.3)?[r.planks,9,.3]:[r.lattice,.3,.3],{}),n.box(-q/2+S*q/v,R+f/2,D,.24,f,.2,s.beam,[r.none],{noTop:!0})}n.box(q/2,R+f/2,D,.24,f,.2,s.beam,[r.none],{noTop:!0});for(const S of[-1,1])n.quad(o(S*q/2+S*.03,R+1,-1.6),o(S*q/2+S*.03,R+1,.6),o(S*q/2+S*.03,R+f-.5,.6),o(S*q/2+S*.03,R+f-.5,-1.6),s.rail,[r.lattice,.3,.3],{double:!0});if(l){const S=D+1.3;n.box(0,R+.08,D+.65,q,.16,1.4,s.deck,[r.none],{bottom:!0,patTop:[r.planks,4,.4]}),n.quad(o(-q/2,R+.16,S),o(q/2,R+.16,S),o(q/2,R+1.3,S),o(-q/2,R+1.3,S),s.rail,[r.lattice,.36,.36],{double:!0,u0:0});for(let g=0;g<=v;g++)n.box(-q/2+g*q/v,R+.75,S,.14,1.4,.14,s.beam,[r.none],{});const L=t.range(-q/3,q/3);n.tube(o(L,R+.16,D+.7),o(L,R+.7,D+.7),.26,.36,s.stone,[r.none],{sides:7,caps:!1}),n.cone(L,R+.7,D+.7,.62,1.5,6,s.leaf,{}),n.cone(L,R+1.5,D+.7,.42,1.1,6,s.leaf,{})}u0(n,0,-.3,q,C,R+f,l?3.2:2.6,1.3,s.tile,p,{hip:l?2.2:1.5,trim:s.beam,ridge:s.ridge,eave:s.eave,wall:s.plaster,finials:!0,finialMat:s.gold,drop:.45}),Et(n,d,u,s);for(let S=0;S<=v*2;S++)n.box(-q/2+S*q/(v*2),R+f-.16,D+.4,.3,.3,.8,s.beam,[r.none],{});const _=t.chance(.5)?1:-1;if(n.beam(o(_*(d/2-.4),R+.4,b),o(_*(d/2-.4),R+.4,I+1.4),.12,.12,s.beam),n.setAnim(_*(d/2-.4),R+.4,I+1.1,2),n.box(_*(d/2-.4),R-.9,I+1.1,.12,2.2,.9,s.timber,[r.none],{bottom:!0}),n.setAnim(0,0,0,0),Kt(n,t.range(-d/3,d/3),I+1.2,s,t,l?5:3),t.chance(.6)){const S=t.range(-d/3,d/3);n.box(S,.5,I+.2,2.6,.12,.6,s.timber,[r.none],{bottom:!0});for(const L of[-1,1])n.box(S+L*1.1,.25,I+.2,.14,.5,.5,s.beam,[r.none],{})}}function ko(n,t,s){const l=t.range(10,13),d=7.5,u=4,m=d/2,f=[r.tiles,1,.46];n.box(0,.2,0,l+.6,.4,d+.6,s.stone,[r.courses,1.6,.4],{patTop:[r.planks,4,.5]});for(let w=0;w<4;w++)for(const z of[-1,1])n.tube(o(-l/2+w*l/3,.4,z*m),o(-l/2+w*l/3,u,z*m),.2,.18,s.log,[r.none],{sides:6,caps:!1});n.box(0,u/2+.2,-m,l,u-.4,.2,s.plaster,[r.none],{}),n.quad(o(-l/2+1,1.6,-m+.12),o(l/2-1,1.6,-m+.12),o(l/2-1,u-.6,-m+.12),o(-l/2+1,u-.6,-m+.12),s.rail,[r.lattice,.36,.36],{});for(const w of[-1,1])n.quad(o(w*l/2,.4,-m),o(w*l/2,.4,m),o(w*l/2,1.5,m),o(w*l/2,1.5,-m),s.rail,[r.lattice,.36,.36],{double:!0,u0:0});n.beam(o(-l/2,u-.2,m),o(l/2,u-.2,m),.26,.36,s.beam),n.beam(o(-l/2,u-.2,-m),o(l/2,u-.2,-m),.26,.36,s.beam),u0(n,0,0,l,d,u+.3,2.6,1.4,s.tile,f,{hip:2,trim:s.beam,ridge:s.ridge,eave:s.eave,finials:!0,finialMat:s.gold,drop:.5}),Et(n,l,d,s);const b=Math.round(l/3.4);for(let w=0;w<b;w++)vo(n,-l/2+(w+.5)*(l/b),t.range(-.8,1.2),s,t);n.box(l/2-1.2,.9,-m+1.2,1.4,1,1.2,s.stone,[r.courses,.7,.34],{}),n.tube(o(l/2-1.2,1.4,-m+1.2),o(l/2-1.2,1.95,-m+1.2),.34,.22,s.charcoal,[r.none],{sides:7});const p=m+3.6,v=u-1.3;n.setAnim(0,u-.3,m+1.4,2),Me(n,o(-l/2+.5,u-.3,m+1.3),o(l/2-.5,u-.3,m+1.3),o(l/2-.5,v,p),o(-l/2+.5,v,p),o(0,1,0),s.cloth,[r.stripes,.7,2],{double:!0,u0:0,col:s.blue.lit}),n.setAnim(0,0,0,0);for(const w of[-1,1])n.tube(o(w*(l/2-.6),0,p),o(w*(l/2-.6),v+.2,p),.1,.08,s.timber,[r.none],{sides:5});Oe(n,o(-l/2+.5,v,p),o(l/2-.5,v,p),.6,s.cloth,[r.stripes,.7,2],s.blue.lit),Kt(n,-l/2-1.5,m+1,s,t,4)}function yo(n,t,s,l){const d=t.range(1.9,2.5),u=t()*6;n.tube(o(0,0,0),o(.15,3.5,0),.07,.06,s.timber,[r.none],{sides:5,caps:!1}),n.setAnim(.15,3.5,0,1);const m=t.chance(.5)?s.oiled:s.cloth;n.cone(.15,3.3,0,d,.7,10,l||m,{phase:u}),n.setAnim(0,0,0,0),n.box(.2,.55,1,2.4,.1,1.1,s.timber,[r.none],{bottom:!0,patTop:[r.planks,3,.3]});for(const f of[-1,1])n.box(.2+f*1,.27,1,.12,.54,.9,s.beam,[r.none],{});for(let f=0;f<4;f++)n.box(-.6+f*.55,.78,1+t.range(-.2,.2),.42,.36,.42,f%2?s.cloth:s.mat,f%2?[r.none]:[r.weave,.12,.12],{taper:.75});if(n.tube(o(-1.4,0,.3),o(-1.4,.7,.3),.3,.42,s.mat,[r.weave,.14,.14],{sides:7,capCol:s.cloth.shade}),t.chance(.6)){n.box(1.9,.8,-.5,1.5,.6,1,s.timber,[r.planks,3,.3],{ry:.5,taper:1.15,patTop:[r.none]}),n.tube(o(2.5,.42,-.42),o(2.6,.42,-.58),.42,.42,s.beam,[r.none],{sides:9});for(const f of[-.3,.3])n.beam(o(1.3,.75,-.2+f),o(.5,1.1,.3+f),.08,.08,s.timber,[r.none],{noEnds:!0})}}function Mo(n,t,s,l){const d=t.range(4.6,6.4),u=t.range(-.6,.6),m=u,f=o(m,d,t.range(-.3,.3));n.tube(o(0,0,0),o(u*.4,d*.55,0),.52,.38,s.bark,[r.none],{sides:7,caps:!1}),n.tube(o(u*.4,d*.55,0),f,.4,.46,s.bark,[r.none],{sides:7,caps:!1}),n.tube(o(u*.33,d*.45,0),o(u*.45,d*.6,0),.5,.5,s.bark,[r.none],{sides:7,caps:!1}),n.tube(o(f.x,f.y-.2,f.z),o(f.x,f.y+.75,f.z),.66,.5,s.bark,[r.none],{sides:7,capCol:s.bark.lit});const b=f.y+.45;if(!l){const z={lit:s.leaf.lit.clone().lerp(s.bark.lit,0),shade:s.leaf.lit},I=9,R=(_,S,L)=>{const g=[];for(let G=0;G<=I;G++){const T=G/I*Math.PI*2,ee=G===I?g[0].j:t.range(-L,L);g.push({p:o(f.x+Math.cos(T)*_,S+(G%2?ee:-ee),f.z+Math.sin(T)*_),j:ee})}return g[I].p.copy(g[0].p),g},q=R(.4,b+1.3,.1),C=R(1.1,b+.8,.25),D=R(1.55,b-2.3,.9);for(let _=0;_<I;_++)n.quad(q[_].p,C[_].p,C[_+1].p,q[_+1].p,z,[r.none],{double:!0,edges:[0,0,0,0],col:s.leaf.lit}),n.setAnim(f.x,b+.9,f.z,2),n.quad(C[_].p,D[_].p,D[_+1].p,C[_+1].p,z,[r.none],{double:!0,edges:[0,0,0,0],col:s.leaf.lit}),n.setAnim(0,0,0,0)}const p=l?26:60,v=.24,w=8;for(let z=0;z<p;z++){const I=z/p*Math.PI*2+t.range(-.25,.25),R=t.range(.8,2.2)*(l?1.3:1),q=t.range(.5,1.9),C=t.chance(.3),D=C&&!l?-(F+.4):-2.3,_=C&&!l?1.5:0,S=l?t.range(1.5,3.6):C?b+q*.93-D:t.range(3,8.4),L=t.range(-.15,.15),g=t.range(-.15,.15),G=Math.cos(I),T=Math.sin(I),ee=-T*v/2,le=G*v/2,ie=[r.whip,v,l?99:.42],M=l?s.leaf.shade:s.leaf.lit,H=[];for(let B=0;B<=w;B++){const Z=B/w,x=Math.min(1,Z/.4),fe=Math.max(0,(Z-.25)/.75),H0=R*Math.sin(x*Math.PI/2)+.25*fe+_*Math.min(1,fe*2),Fe=b+q*Math.sin(x*Math.PI*.62)-S*fe*fe*(3-2*fe)*.5-S*fe*.5;H.push(o(f.x+G*(.3+H0)+L*fe*(1+Math.sin(B*2.1)),Math.max(D,Fe),f.z+T*(.3+H0)+g*fe*(1+Math.cos(B*1.7))))}n.tube(o(f.x+G*.3,b-.1,f.z+T*.3),H[1],.08,.04,s.bark,[r.none],{sides:3,caps:!1,noRing:!0});let X=0;for(let B=0;B<w;B++){const Z=H[B],x=H[B+1],fe=Z.distanceTo(x);if(fe<.02)break;B===3&&n.setAnim(H[3].x,H[3].y,H[3].z,2),n.quad(o(Z.x-ee,Z.y,Z.z-le),o(Z.x+ee,Z.y,Z.z+le),o(x.x+ee,x.y,x.z+le),o(x.x-ee,x.y,x.z-le),s.leaf,ie,{double:!0,u0:0,lu:v,v0:X,lv:fe,col:M,edges:[0,0,0,0]}),X+=fe}n.setAnim(0,0,0,0)}}function zo(n,t,s){const l=t.range(9,13);n.tube(o(0,0,0),o(.3,l*.45,0),.42,.3,s.bark,[r.none],{sides:6,caps:!1});const d=o(.3,l*.45,0);for(let u=0;u<5;u++){const m=u/5*6.28+t.range(-.4,.4),f=t.range(2,4),b=o(d.x+Math.cos(m)*f,l*t.range(.75,1),Math.sin(m)*f);n.tube(d,b,.24,.08,s.bark,[r.none],{sides:5,caps:!1});for(let p=0;p<4;p++){const v=t.range(.35,.95),w=d.clone().lerp(b,v),z=o(w.x+t.range(-1.6,1.6),w.y+t.range(1.2,2.6),w.z+t.range(-1.6,1.6));n.quad(o(w.x-.25,w.y,w.z),o(w.x+.25,w.y,w.z),o(z.x+.25,z.y,z.z),o(z.x-.25,z.y,z.z),s.leaf,[r.whip,.5,99],{double:!0,u0:0,lu:.5,col:s.leaf.shade,edges:[0,0,0,0]})}u===1&&n.cone(b.x*.7+d.x*.3,l*.8,b.z*.7,.7,-.55,6,s.charcoal,{})}}function So(n,t,s){for(let l=0;l<11;l++){const d=t.range(-2.2,2.2),u=t.range(-.5,.5),m=t.range(.9,2),f=t.range(.25,.6);n.quad(o(d-.2,0,u),o(d+.2,0,u),o(d+.2+f,m,u),o(d-.2+f,m,u),s.leaf,[r.whip,.4,99],{double:!0,u0:0,lu:.4,col:s.leaf.shade,edges:[0,0,0,0]})}}function X0(n,t,s,l,d){const u=d.range(13,15.5),m=1.9;for(const p of[-1,1])for(const v of[-1,1])n.tube(o(t+p*m,F,s+v*m),o(t+p*m*.55,F+u,s+v*m*.55),.17,.11,l.log,[r.none],{sides:6,caps:!1});for(let p=1;p<=4;p++){const v=F+p*u/4.4,w=1-.45*(p/4.4),z=m*w+.5;n.beam(o(t-z,v,s+m*w),o(t+z,v,s+m*w),.14,.14,l.timber),n.beam(o(t-z,v,s-m*w),o(t+z,v,s-m*w),.14,.14,l.timber),n.beam(o(t+m*w,v+.15,s-z),o(t+m*w,v+.15,s+z),.14,.14,l.timber),n.beam(o(t-m*w,v+.15,s-z),o(t-m*w,v+.15,s+z),.14,.14,l.timber);for(const I of[-1,1])for(const R of[-1,1])n.tube(o(t+I*m*w,v-.25,s+R*m*w),o(t+I*m*w,v+.3,s+R*m*w),.2,.2,l.rope,[r.rope,.12,1],{sides:6,caps:!1})}const f=F+u;n.tube(o(t,f-3,s),o(t,f+3.5,s),.13,.07,l.log,[r.none],{sides:5}),n.beam(o(t-3.2,f+3,s),o(t+3.2,f+3,s),.1,.1,l.timber);for(let p=0;p<3;p++){const v=t-3+p*2.1;Oe(n,o(v,f+2.95,s),o(v+1.8,f+2.95,s),d.range(7,9),l.cloth,[r.stripes,.6,2],p%2?l.blue.lit:l.red.lit)}const b=d.chance(.5)?1:-1;n.beam(o(t,f-2.2,s),o(t,f-2.2,s+b*3.4),.1,.1,l.timber),Oe(n,o(t,f-2.25,s+b*1.2),o(t,f-2.25,s+b*3.2),d.range(3.5,5),l.cloth,[r.stripes,.5,2],l.gold.lit)}function qo(n,t,s,l){const d=new y.Matrix4().makeRotationY(-Math.PI/2).setPosition(215,F,0);n.setXf(d);const u=[r.courses,1.7,.56],m=9,f=l,b=[r.tiles,1,.5],p=(w,z)=>{n.box((w+z)/2,m/2,0,z-w,m,4.4,s.brick,u,{u0:w,patTop:[r.courses,1.7,1.1]})};p(-82,f-7),p(f+7,-26.5);for(let w=-81;w<-27;w+=2.5)if(Math.abs(w-f)>7.5)for(const z of[-1,1])n.box(w,m+.55,z*1.95,1.4,1.1,.5,s.brick,[r.courses,1.7,.56],{});n.box(-24.2,5.6,0,5.4,11.2,5.8,s.brick,u,{u0:0,patTop:[r.courses,1.7,1.1]});for(let w=0;w<4;w++)for(const z of[-1,1])n.box(-26.1+w*1.3,11.7,z*2.65,.8,1,.5,s.brick,[r.none],{});for(const w of[-1,1])n.box(f+w*5.2,5.5,0,3.6,11,7.4,s.brick,u,{u0:w*9});n.box(f,9.2,0,6.8,3.6,7.4,s.brick,u,{u0:3,bottom:!0}),n.box(f,3.7,-1.2,6.8,7.4,.3,s.charcoal,[r.none],{});for(const w of[-1,1])n.quad(o(f+w*3.4,0,3.72),o(f+w*1.1,0,3.72+0),o(f+w*1.1,6.9,3.72),o(f+w*3.4,6.9,3.72),s.timber,[r.planks,9,.62],{double:!0,u0:0});n.box(f,11.15,0,15.4,.3,8.2,s.stoneTop,[r.none],{bottom:!0,patTop:[r.courses,1.9,1.1]});for(let w=0;w<11;w++)for(const z of[-1,1])n.box(f-7+w*1.4,11.8,z*3.9,.9,1,.4,s.brick,[r.none],{});const v=(w,z,I,R,q,C,D)=>{n.box(f,w+R/2,0,z,R,I,s.plaster,[r.none],{noTop:!0});const _=Math.round(z/2.6);for(let S=0;S<=_;S++)for(const L of[-1,1]){const g=f-z/2+S*z/_;n.tube(o(g,w,L*(I/2+.5)),o(g,w+R,L*(I/2+.5)),.2,.18,s.log,[r.none],{sides:6,caps:!1});for(let G=0;G<3;G++)n.box(g,w+R+.16+G*.3,L*(I/2+.5+G*.35),.5+G*.4,.26,.5,s.beam,[r.none],{});S<_&&n.quad(o(g+.3,w+.9,L*(I/2+.03)),o(g+z/_-.3,w+.9,L*(I/2+.03)),o(g+z/_-.3,w+R-.5,L*(I/2+.03)),o(g+.3,w+R-.5,L*(I/2+.03)),s.rail,[r.lattice,.34,.34],{double:!0})}n.quad(o(f-z/2-.5,w,I/2+.5),o(f+z/2+.5,w,I/2+.5),o(f+z/2+.5,w+1.1,I/2+.5),o(f-z/2-.5,w+1.1,I/2+.5),s.rail,[r.lattice,.4,.4],{double:!0,u0:0}),u0(n,f,0,z+1,I+1,w+R+1,q,C,s.tile,b,{hip:D,trim:s.beam,ridge:s.ridge,eave:s.eave,finials:!0,finialMat:s.gold,drop:.7})};v(11.3,12.6,5.6,3.8,1.9,2,5.2),v(17.2,9,3.6,3,3.4,1.8,2.6),n.setXf(null)}function Ao(n,t,s,l){const d=[r.tiles,1,.42];for(const[u,m]of[[-5.2,6.6],[-2.2,8.6],[2.2,8.6],[5.2,6.6]])n.tube(o(t+u,F,s),o(t+u,F+m,s),.3,.25,l.log,[r.none],{sides:7,caps:!1}),n.box(t+u,F+.5,s,.9,1,.9,l.stone,[r.courses,9,.34],{});n.beam(o(t-2.6,F+7.2,s),o(t+2.6,F+7.2,s),.3,.5,l.beam),n.beam(o(t-2.6,F+6.2,s),o(t+2.6,F+6.2,s),.26,.4,l.beam),n.quad(o(t-1.9,F+6.42,s),o(t+1.9,F+6.42,s),o(t+1.9,F+6.95,s),o(t-1.9,F+6.95,s),l.rail,[r.lattice,.3,.3],{double:!0});for(const u of[-1,1])n.beam(o(t+u*2.2,F+5.4,s),o(t+u*5.5,F+5.4,s),.26,.42,l.beam),n.beam(o(t+u*2.2,F+4.6,s),o(t+u*5.5,F+4.6,s),.22,.34,l.beam);u0(n,t,s,5.4,.8,F+8.5,1.3,1,l.tile,d,{hip:1.2,trim:l.beam,ridge:l.ridge,eave:l.eave,finials:!0,finialMat:l.gold,drop:.4});for(const u of[-1,1])u0(n,t+u*3.9,s,3,.7,F+6.5,1,.8,l.tile,d,{hip:.9,trim:l.beam,ridge:l.ridge,eave:l.eave,drop:.35})}function B0(n,t,s,l,d,u,m,f){for(let b=0;b<u;b++)for(let p=b*.5;p<l-b*.5;p++)for(let v=b*.5;v<d-b*.5;v++)n.box(t+(p-l/2)*1.05+f.range(-.07,.07),F+.3+b*.56,s+(v-d/2)*.95,1,.54,.9,m.cloth,[r.none],{taper:.82,ry:f.range(-.1,.1)})}function Po(n){const t=[];let s=so;for(;s<Sa;)t.push(s),s+=s<d0-1||s>p0-1?1.6:s<0||s>228?2:3;t.push(Sa);const l=12,d=new Float32Array(t.length*l*3),u=new Float32Array(t.length*l*3),m=[],f={x:0,y:0,a:0};for(let v=0;v<t.length;v++){const w=t[v],z=K(w),I=w>p0?0:we(w);_t(w,f);const R=[[-81,I],[-75,I],[-52,I],[-z-1,I],[-z-.1,0],[-z*.4,0],[z*.4,0],[z+.1,0],[z+1,I],[52,I],[75,I],[81,I]];for(let q=0;q<l;q++){const C=(v*l+q)*3,D=R[q][1];if(d[C]=f.x-Math.sin(f.a)*D,d[C+1]=f.y+Math.cos(f.a)*D,d[C+2]=R[q][0],u[C]=w,u[C+1]=D,u[C+2]=R[q][0],v>0&&q>0){const _=(v-1)*l+q-1,S=_+1,L=v*l+q-1,g=L+1;m.push(_,S,g,_,g,L)}}}const b=new y.BufferGeometry;b.setAttribute("position",new y.BufferAttribute(d,3)),b.setAttribute("aP",new y.BufferAttribute(u,3)),b.setIndex(m);const p=new y.Mesh(b,n);return p.frustumCulled=!1,p.renderOrder=-.5,p.name="silk",p}const Ge=new y.Matrix4,m0=new y.Quaternion,wt=new y.Vector3,Ve=new y.Vector3,Pa=new y.Euler,Fa=new y.Vector3(0,1,0);function Ba(n,t,s,l){const d=new y.InstancedMesh(n,t,Math.max(1,s.length));d.count=s.length,d.name=l;for(let u=0;u<s.length;u++){const m=s[u];m0.setFromAxisAngle(Fa,m.ry||0),Ge.compose(Ve.set(m.x,m.y,m.z),m0,wt.set(m.sx||1,m.sy||1,m.sz||m.sx||1)),d.setMatrixAt(u,Ge)}return d.instanceMatrix.needsUpdate=!0,d.frustumCulled=!1,d}function Fo(n,t,s){const l=n.length,d=new Float32Array(l*3),u=new Float32Array(l*4),m=new Float32Array(l*4),f=new Float32Array(l*3);n.forEach((v,w)=>{d.set(v.a,w*3),u.set(v.b||[0,0,0,0],w*4),m.set(v.k,w*4),f.set([v.col.r,v.col.g,v.col.b],w*3)});const b=new y.InstancedBufferGeometry;b.setAttribute("position",new y.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),b.setIndex([0,1,2,0,2,3]),b.setAttribute("aA",new y.InstancedBufferAttribute(d,3)),b.setAttribute("aB",new y.InstancedBufferAttribute(u,4)),b.setAttribute("aK",new y.InstancedBufferAttribute(m,4)),b.setAttribute("aCol",new y.InstancedBufferAttribute(f,3)),b.instanceCount=l;const p=new y.Mesh(b,t);return p.frustumCulled=!1,p.name=s,p}function Bo(n,t){const s=n.length,l=new Float32Array(s*4),d=new Float32Array(s*4),u=new Float32Array(s*4),m=new Float32Array(s*3);n.forEach((p,v)=>{l.set(p.a,v*4),d.set(p.b,v*4),u.set([p.h,p.hat===2?2:p.hat?1:0,p.loop?1:0,p.lean||0],v*4),m.set([p.col.r,p.col.g,p.col.b],v*3)});const f=new y.InstancedBufferGeometry;f.setAttribute("position",new y.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),f.setIndex([0,1,2,0,2,3]),f.setAttribute("aA",new y.InstancedBufferAttribute(l,4)),f.setAttribute("aB",new y.InstancedBufferAttribute(d,4)),f.setAttribute("aInfo",new y.InstancedBufferAttribute(u,4)),f.setAttribute("aCol",new y.InstancedBufferAttribute(m,3)),f.instanceCount=s;const b=new y.Mesh(f,t);return b.frustumCulled=!1,b.name="walkers",b}const Co={mist:{title:"The Scroll at Rainbow Bridge",paper:"#D9C7A0",water:"#3C8C93",mist:1,mistNF:[40,92],band:[.42,.8,9,24],fade:[150,215],snow:0,busy:0,willow:1,join:1,lit:0,tone:[1,1,1]},noon:{title:"The Scroll at Rainbow Bridge: Dry Noon",paper:"#E6D8B6",water:"#3C8C93",mist:0,mistNF:[38,85],band:[.56,.9,5,15],fade:[230,320],snow:0,busy:.2,willow:1,join:0,lit:0,tone:[1,1.1,1]},dusk:{title:"The Scroll at Rainbow Bridge: Lantern Dusk",paper:"#CDAE7C",water:"#2F5F8C",mist:.45,mistNF:[38,85],band:[.56,.9,5,15],fade:[135,195],snow:0,busy:1,willow:1,join:1,lit:.1,tone:[1,.85,.95]},snow:{title:"The Scroll at Rainbow Bridge: First Snow",paper:"#DCD6C6",water:"#3E7DB0",mist:.7,mistNF:[38,85],band:[.56,.9,5,15],fade:[140,200],snow:1,busy:0,willow:0,join:1,lit:0,tone:[1,0,1]}};var Go={id:"rainbow-bridge-scroll",name:"The Scroll at Rainbow Bridge",category:"city",after:"Zhang Zeduan, 1085 to 1145",weirdness:.4,media:["water","open"],async build(n){const t=n.rng,s=n.vary||{},l=t.fork("scroll-look"),d=n.quality?.detail??1,u=s.density??1,m=!!s.rare,f=s.hour||"any",b=f==="dawn"?"mist":f==="day"?l.chance(.35)?"snow":"noon":f==="golden"||f==="night"?"dusk":l.pick(["mist","mist","noon","dusk","snow"]),p=Co[b],v=l.pick(["plain","fleet","festival","fleet","festival"]),w=l(),z=oo.map(e=>new y.Color(e));p.snow&&z[1].set("#FAF6EC");const I=new y.Color(p.paper),R=[I,z[1],z[2],z[3],z[4],z[5],z[6]],[q,C,D,_,S,L]=R,g=(e,a,i)=>e.clone().lerp(a,i),G=(e,a)=>({lit:e,shade:a}),T=new y.Color(pt.mal),ee=new y.Color(pt.azu),le=new y.Color(pt.gold),ie=z[6],M=n.core.makeRng("scroll-east:"+Math.floor(w*1e9)),H=new y.Scene;H.background=I.clone();const X=await eo(n,{palette:R.map(e=>"#"+e.getHexString()),minerals:pt,underlay:!1,fadeNear:p.fade[0],fadeFar:p.fade[1],snow:!!p.snow,litShift:p.lit,parasols:p.snow?80:40});X.object.position.set(Te,0,0),X.object.rotation.y=-Math.PI/2,X.object.updateMatrixWorld(!0),H.add(X.object);const B=X.uniforms,Z=X.mats.ink;B.uMist.value.set(p.mist,0,p.mistNF[0],p.mistNF[1]),B.uMistBand.value.set(p.band[0],p.band[1],p.band[2],p.band[3]),await n.yield();const x={...X.tones,plaster:G(g(C,q,.1),g(C,_,.42)),wattle:G(g(S,q,.55),g(_,q,.4)),thatch:p.snow?G(C.clone(),g(C,_,.22)):G(g(S,C,.35),g(S,_,.5)),tile:p.snow?G(C.clone(),g(C,ee,.26)):G(new y.Color("#51708F"),g(new y.Color("#51708F"),D,.3)),tileB:p.snow?G(C.clone(),g(C,ee,.3)):G(new y.Color("#2F8F78"),g(new y.Color("#2F8F78"),D,.3)),tileA:p.snow?G(C.clone(),g(C,ee,.36)):G(new y.Color("#2B6FAE"),g(new y.Color("#2B6FAE"),D,.3)),brick:G(g(C,_,.25),g(_,q,.25)),bark:G(g(_,S,.4),g(_,D,.4)),leaf:{lit:g(T,q,b==="noon"?.1:b==="dusk"?.25:.18),shade:g(T,D,.3)},jade:G(g(T,C,.2),g(T,D,.3)),lacquer:G(ie.clone(),g(ie,D,.3)),roll:G(g(ee,q,.12),g(ee,D,.28)),band:G(g(C,q,.1),g(C,_,.4)),soap:G(g(C,_,.2),g(_,C,.3))};if(p.snow)for(const e of["plaster","brick","thatch","wattle"])x[e]=G(x[e].lit,g(x[e].shade,ee,.3));if(p.lit)for(const e of["plaster","wattle","thatch","brick","bark"])x[e]=G(g(x[e].lit,_,p.lit),x[e].shade);x.ridge=x.gold,x.eave=p.snow?x.lacquer:x.beam;for(const e of["plaster","wattle"])x[e].band=g(x[e].shade,D,.35);x.pine=p.snow?{lit:g(C,T,.2),shade:g(T,D,.3),deep:g(T,D,.55)}:{lit:g(T,D,.15),shade:g(T,D,.38),deep:g(T,D,.6)},x.blossom=p.snow?G(ie.clone(),g(ie,C,.4)):G(g(C,ie,.2),g(C,ie,.5)),x.ground=p.snow?g(C,ee,.32):g(q,g(_,D,.3),.6);const fe={...x,tile:x.tileA,log:x.lacquer,finial:x.gold},H0={...x,tile:x.tileB,finial:x.gold},Fe={x:0,y:0,a:0},U0=V0+ut/2;_t(U0,Fe);const t0=o(Fe.x,Fe.y,0),N0=o(Fe.x-Math.sin(de)*.45,Fe.y+Math.cos(de)*.45,0),w0=o(Math.sin(de),-Math.cos(de),0),ge=N0.clone().addScaledVector(w0,-60),g0=[];{const e=170*Math.PI/180,a=48+16*Math.cos(e),i=-3.9+16*Math.sin(e);for(const c of[22,14.67,7.33])g0.push([a+Math.sin(e)*c,4.2,i-Math.cos(e)*c])}for(const e of[170,195,220,245,270]){const a=e*Math.PI/180;g0.push([48+16*Math.cos(a),4.2,-3.9+16*Math.sin(a)])}g0.push([66,4.2,-17],[84,4.2,-10.5],[102,4.2,-4],[120,4.2,.6],[140,4.2,1.5],[161,4.2,1.5],[182,4.2,.6],[203,4.2,-2.2],[222,4.2,-2.6],[236,4.2,-1]);const a0=ge.x-2*(ge.y-4.2)/w0.y*w0.x,Ca=(ge.y-4.2)/((ge.x-a0)*(ge.x-a0));g0.push([a0,4.2,-.3],[(a0+ge.x)/2,4.2+Ca*(ge.x-a0)*(ge.x-a0)/4,0]),g0.push(ge,ge.clone().addScaledVector(w0,20),ge.clone().addScaledVector(w0,40),N0);const se=Ta(g0),Ia=48,jt=-3.96,xe=e=>(e*(se.length-jt)+jt)/se.length,Ot=new y.ShaderMaterial({uniforms:{uInk:B.uInk,uSilk:B.uSilk,uPale:B.uPale,uGrey:B.uGrey,uSeal:B.uSeal,uLinePx:B.uLinePx,uTime:B.uTime,uFade:B.uFade,uMist:B.uMist,uMistBand:B.uMistBand,uClip:B.uClip,uRipple:B.uRipple,uSeed:{value:w},uWind:{value:0},uSnow:{value:p.snow},uBusy:{value:p.busy},uJoin:{value:p.join},uAzur:B.uAzur,uMal:B.uMal,uGold:B.uGold,uWater:{value:new y.Color(p.water)},...j0?{uOchre:{value:S}}:{},uTone:{value:new y.Vector3(p.tone[0],p.tone[1],p.tone[2])},uBargeW:{value:new y.Vector4(40,10,-1,0)},uSeals:{value:[]},uObs:{value:[]},uTraf:{value:[new y.Vector4(0,900,1,0),new y.Vector4(0,900,1,0),new y.Vector4(0,900,1,0)]},uSail:{value:new y.Vector4(0,900,8,2)},uTow:{value:[o(91,-(K(91)+9.5),0),o(117,-(K(117)+9),0),o(129,K(129)+9,0),o(280,-(K(280)+7.5),0),o(280,K(280)+7.5,0)]},uBig:{value:new y.Vector4(U0,0,11,0)},uStampAt:{value:new y.Vector4(O0,dt,7,0)},uThresh:{value:new y.Vector3(52,-53,5.2)}},vertexShader:no,fragmentShader:io,side:y.DoubleSide}),ze=Ot.uniforms;ze.uSeals.value=[new y.Vector4(-56,-78,1.9,0),new y.Vector4(76+l.range(-3,3),-9+l.range(-2,5),1.15,1),new y.Vector4(278+l.range(-3,3),12+l.range(-2,3),1.5,2),new y.Vector4(U0-3+l.range(-3,3),24+l.range(-2,4),1.5,0),new y.Vector4(U0+2+l.range(-3,3),-27+l.range(-3,3),1.35,1)];for(let e=0;e<12;e++)ze.uObs.value.push(new y.Vector3(0,500,3));await n.yield();const Ra=Po(Ot);H.add(Ra),await n.yield();const Z0=new y.Mesh(new y.SphereGeometry(1500,24,12),new y.ShaderMaterial({uniforms:{uSilk:B.uSilk,uPale:B.uPale,uTable:{value:g(q,D,.6)},uTime:B.uTime,uSeed:{value:w},uInk:B.uInk,uMal:B.uMal,uAzur:B.uAzur,uGold:B.uGold,uGrey:B.uGrey,uTone:ze.uTone,uSnow:ze.uSnow,uLinePx:B.uLinePx,uFar:{value:new y.Color("#7FA6CF")},uMid:{value:new y.Color("#3F78B4")}},vertexShader:lo,fragmentShader:ro,side:y.BackSide,depthWrite:!1}));Z0.renderOrder=-1,Z0.frustumCulled=!1,H.add(Z0);const Vt=(e,a)=>{const i=Se(t);i.tube(o(0,0,-81.5),o(0,0,81.5),e,e,x.roll,[r.brocade,2.4,1],{sides:26,capCol:x.roll.shade});for(const c of[-1,1])i.tube(o(0,0,c*81.5),o(0,0,c*83),a*1.3,a*1.3,x.gold,[r.none],{sides:14}),i.tube(o(0,0,c*83),o(0,0,c*89.5),a,a*.92,x.jade,[r.planks,400,Math.PI*2*a/5],{sides:14}),i.tube(o(0,0,c*89.5),o(0,0,c*91),a*1.25,a*1.1,x.gold,[r.none],{sides:14});i.setRng(M),i.tube(o(0,0,-1.3),o(0,0,1.3),e+.14,e+.14,x.band,[r.rope,.5,1],{sides:26,caps:!1});for(const c of[-1.45,1.45])i.tube(o(0,0,c-.16),o(0,0,c+.16),e+.2,e+.2,x.gold,[r.none],{sides:26,caps:!1});i.box(e+.45,0,0,.7,.9,3.4,x.jade,[r.none],{bottom:!0});for(const c of[-27,27,-54,54])i.tube(o(0,0,c-.35),o(0,0,c+.35),e+.06,e+.06,x.gold,[r.none],{sides:26,caps:!1});return i.build()},gt=new y.ShaderMaterial({uniforms:{...Z.uniforms,uFade:{value:new y.Vector2(1e5,2e5)},uMist:{value:new y.Vector4(0,0,1,2)}},vertexShader:Z.vertexShader,fragmentShader:Z.fragmentShader,fog:!0}),C0=new y.Mesh(Vt(4.9,3),gt);C0.position.set(d0-je+5,je,0),C0.frustumCulled=!1,C0.visible=!1,H.add(C0),_t(mt,Fe);const Y0=new y.Mesh(Vt(2.9,1.9),gt);Y0.position.set(Fe.x-3*Math.sin(e0),Fe.y+3*Math.cos(e0),0),Y0.frustumCulled=!1,H.add(Y0),await n.yield();const Le=async e=>{const a=Se(t);e(a),await n.yield();const i=a.build();return await n.yield(),i},ue={hut:[],shop:[],big:[],tea:[],stall:[],willow:[],elm:[],reeds:[]};for(let e=0;e<3;e++)ue.hut.push(await Le(a=>xo(a,t,x)));for(let e=0;e<3;e++)ue.shop.push(await Le(a=>Aa(a,t,x,!1)));for(let e=0;e<3;e++)ue.big.push(await Le(a=>Aa(a,t,H0,!0)));for(let e=0;e<2;e++)ue.tea.push(await Le(a=>ko(a,t,fe)));for(let e=0;e<3;e++)ue.stall.push(await Le(a=>yo(a,t,x,e===0?x.red:e===1?null:p.snow?x.blue:x.green)));for(let e=0;e<3;e++)ue.willow.push(await Le(a=>Mo(a,t,x,!p.willow)));for(let e=0;e<2;e++)ue.elm.push(await Le(a=>zo(a,t,x)));ue.reeds.push(await Le(e=>So(e,t,x)));const _e={};for(const e in ue)_e[e]=ue[e].map(()=>[]);const o0=(e,a)=>{const i=_e[e];i[t.int(0,i.length-1)].push(a)},s0=[],bt=[],Ga=(e,a,i,c,h,k)=>{const A=h-i,P=k-c,W=Math.min(1,Math.max(0,((e-i)*A+(a-c)*P)/(A*A+P*P)));return Math.hypot(e-i-A*W,a-c-P*W)},vt=-46,$0=[211,vt],Xt=[181,-27.5];for(const e of[-1,1])for(let a=0;a<4;a++){let i=-13+t.range(0,7);for(;i<242;){const c=K(i),h=i>68&&i<(e<0?240:206),k=e*(c+1+14+a*15.5+t.range(-1.2,1.2)),A=1-Y(224,243,i),P=t(),W=t(),V=t.range(-.1,.1),O=t.chance(.3),$=t.range(0,2.5),te=t.range(.92,1.1);if(Math.abs(k)>70.5||i>132&&i<190&&Math.abs(k)<41||Math.abs(i-86)<7||Math.abs(i-121)<7||Math.abs(i-161)<11.5||Math.abs(i-199)<7||e<0&&Math.abs(i-215)<10.5||e<0&&i>224&&k<-40&&k>-64||e<0&&Math.hypot(i-52,k+53)<12.5||e<0&&Ga(i,k,$0[0],$0[1],Xt[0],Xt[1])<10.5){i+=4.5;continue}const oe=(e<0?0:Math.PI)+V+(a>=2&&O?Math.PI/2:0),ce={x:i,y:F,z:k,ry:oe,sx:te,sy:t.range(.94,1.12),sz:te};let J=8,Q=null;if(h&&P<(a===0?.96:.88-.1*a)*A?a===0&&e>0&&W<.42?(Q="tea",J=16):a<=1&&W<(a===0?.78:.5)?(Q="big",J=17.5):(Q="shop",J=13.5):!h&&P<(i<70?.7:.4)*Math.min(1.2,u)*(i<70?1:A)&&(Q="hut",J=14+$*2),Q&&(o0(Q,ce),bt.push([i,k,J/2]),a<3&&Q!=="hut"))for(const j of[-2,-1,0,1,2]){const E=j*(Q==="big"?2.5:Q==="tea"?2.1:1.75),U=Q==="tea"?5.3:4.5,ne=Q==="tea"?1.5:Q==="big"?5:4.5;s0.push([i+(E*Math.cos(oe)+U*Math.sin(oe))*te,F+ne*ce.sy,k+(-E*Math.sin(oe)+U*Math.cos(oe))*te,Q==="tea"?.75:1,i,k])}i+=J+$}await n.yield()}for(const e of[-1,1]){for(let a=-16+t.range(0,4);a<247;a+=t.range(6,9.5)){const i=K(a),c=t.range(.9,1.35),h=t.range(1.2,2.8),k=t(),A=t()*6.28;a>135&&a<187||e<0&&a>174&&a<212||a>70&&a<236&&k>.62||a<=70&&k>.7||k>1-.9*Y(232,250,a)||o0("willow",{x:a,y:we(a),z:e*(i+1+h),ry:A,sx:c,sy:c,sz:c})}for(let a=-14+t.range(0,5);a<247;a+=t.range(14,24)){const i=K(a),c=t.range(.8,1.2),h=t.range(7.2,9.5),k=t(),A=t()*6.28;a>62&&a<(e<0?236:190)||k>.75||k>1-.9*Y(232,250,a)||o0("willow",{x:a,y:we(a),z:e*(i+1+h),ry:A,sx:c,sy:c,sz:c})}for(let a=-15+t.range(0,4);a<247;a+=t.range(6,12)){const i=K(a),c=t.range(.4,1.4),h=t.range(.8,1.3),k=t.chance(.5);a>68&&a<186||se.nearestXZ(a,e*(i-c)).dist<7||a>244||o0("reeds",{x:a,y:-.05,z:e*(i-c),ry:k?.2:-.2,sx:h,sy:h,sz:h})}for(let a=-8+t.range(0,8);a<70;a+=t.range(9,16)){const i=t.range(.85,1.25);o0("elm",{x:a,y:F,z:e*t.range(62,72),ry:t()*6.28,sx:i,sy:i,sz:i})}for(let a=72+t.range(0,5);a<236;a+=t.range(6.5,11)){const i=K(a),c=t.range(3.4,5.2),h=t(),k=(e<0?0:Math.PI)+t.range(-.5,.5);a>136&&a<186||h>.72*u||e<0&&a>174&&a<220||e>0&&a>208||o0("stall",{x:a,y:F,z:e*(i+1+c),ry:k,sx:1,sy:1,sz:1})}}for(let e=0;e<9;e++){const a=e%2?1:-1,i=a*t.range(36,68);o0("stall",{x:161+a*t.range(4.2,5.6)*(e%3?1:-1),y:F,z:i,ry:t()*6.28,sx:1,sy:1,sz:1})}await n.yield();const I0=(e,a)=>{const i=_e[e];i[M.int(0,i.length-1)].push(a)},Ht=(e,a,i)=>{for(const c of bt)if(Math.abs(c[1]-a)<9&&Math.abs(c[0]-e)<c[2]+i+.8)return!1;return!0};for(const e of[-1,1])for(let a=0;a<4;a++){let i=(e<0?226:203)+M.range(0,6);for(;i<291;){const c=K(i),h=e*(c+1+14+a*15.5+M.range(-1.2,1.2)),k=1-.4*Y(274,294,i),A=M(),P=M(),W=M.range(-.1,.1),V=M.chance(.3),O=M.range(0,2.5),$=M.range(.92,1.1),te=M.range(.94,1.12);let N=null,oe=8;if(A<(a===0?.96:.9-.08*a)*k&&(a===0&&P<.3?(N="tea",oe=16):a<=1&&P<(a===0?.72:.5)?(N="big",oe=17.5):(N="shop",oe=13.5)),!N||Math.abs(h)>70.5||Math.abs(i-262)<7||a===0&&Math.abs(i-280)<7.5||e<0&&Math.abs(i-215)<10.5||e<0&&i>224&&i<262&&h<-39&&h>-53||e>0&&a===0&&Math.abs(i-204)<9.5||!Ht(i,h,oe/2)){i+=4.5;continue}const J=(e<0?0:Math.PI)+W+(a>=2&&V?Math.PI/2:0);if(I0(N,{x:i,y:F,z:h,ry:J,sx:$,sy:te,sz:$}),bt.push([i,h,oe/2]),a<3)for(const Q of[-2,-1,0,1,2]){const j=Q*(N==="big"?2.5:N==="tea"?2.1:1.75),E=N==="tea"?5.3:4.5,U=N==="tea"?1.5:N==="big"?5:4.5;s0.push([i+(j*Math.cos(J)+E*Math.sin(J))*$,F+U*te,h+(-j*Math.sin(J)+E*Math.cos(J))*$,N==="tea"?.75:1,i,h])}i+=oe+O}await n.yield()}for(const e of[-1,1]){for(let a=238+M.range(0,5);a<293;a+=M.range(6,9.5)){const i=K(a),c=M.range(.9,1.35),h=M.range(1.2,2.8),k=M(),A=M()*6.28;k>.55||Math.abs(a-280)<4||Math.abs(a-262)<3||I0("willow",{x:a,y:we(a),z:e*(i+1+h),ry:A,sx:c,sy:c,sz:c})}for(let a=244+M.range(0,5);a<292;a+=M.range(6,12)){const i=K(a),c=M.range(.4,1.4),h=M.range(.8,1.3),k=M.chance(.5);I0("reeds",{x:a,y:-.05,z:e*(i-c),ry:k?.2:-.2,sx:h,sy:h,sz:h})}for(let a=(e<0?238:210)+M.range(0,5);a<290;a+=M.range(6.5,11)){const i=K(a),c=M.range(3.4,5.2),h=M(),k=(e<0?0:Math.PI)+M.range(-.5,.5);h>.72*u||Math.abs(a-280)<4.5||I0("stall",{x:a,y:F,z:e*(i+1+c),ry:k,sx:1,sy:1,sz:1})}}for(let e=5+M.range(0,3);e<68;e+=M.range(3.5,7)){const a=K(e),i=M.range(.4,1.6),c=M.range(.8,1.3),h=M.chance(.5);se.nearestXZ(e,-(a-i)).dist<7||I0("reeds",{x:e,y:-.05,z:-(a-i),ry:h?.2:-.2,sx:c,sy:c,sz:c})}await n.yield();const Xe=294.5,He=20,xt=27,kt=-50,b0=268;let yt=0;const Ut=[[xt,kt,9.5,9.5],[Xe,He,12,11],[Xe,-He,12,11]];m&&Ut.push([O0,dt,13.5,9.5]);const Q0=(e,a)=>m&&Math.abs(e-O0)<8.2&&Math.abs(a-dt)<8.2,Nt=(e,a)=>Ut.some(i=>Math.abs(e-i[0])<i[2]&&Math.abs(a-i[1])<i[3]);for(const e of["hut","shop","big","tea","stall","willow"])_e[e]=_e[e].map(a=>a.filter(i=>!Nt(i.x,i.z)));for(let e=s0.length-1;e>=0;e--)Nt(s0[e][4],s0[e][5])&&s0.splice(e,1);const ae=n.core.makeRng("scroll-far:"+Math.floor(w*1e9));ue.pine=[];for(let e=0;e<2;e++)ue.pine.push(await Le(a=>{a.setRng(ae),go(a,ae,x)}));_e.pine=ue.pine.map(()=>[]);for(const[e,a,i]of[[296,34,0],[299,46,0],[295,58,0],[287,37.5,1],[279,38,1],[271,37.5,1],[264,52,1],[17,-61,1],[38,-63,1],[27,-67,1],[8,-52,1]])for(const c of e>100?[-1,1]:[1]){const h=ae.range(.85,1.15),k=ae()*6.28,A=ae.int(0,1);i&&!Ht(e,c*a,1.2)||_e.pine[A].push({x:e,y:e>291.5?Math.max(0,we(e)):F,z:c*a,ry:k,sx:h,sy:h,sz:h})}const La={hut:"huts",shop:"shops",big:"wine-shops",tea:"teahouses",stall:"stalls",willow:"willows",elm:"elms",reeds:"reeds",pine:"pines"};for(const e in ue)for(let a=0;a<ue[e].length;a++)_e[e][a].length&&(H.add(Ba(ue[e][a],Z,_e[e][a],La[e])),await n.yield());const Zt=Se(t);qo(Zt,t,fe,vt),await n.yield();const qe=Se(t);X0(qe,91,-(K(91)+9.5),x,t),await n.yield(),X0(qe,117,-(K(117)+9),x,t),await n.yield(),X0(qe,129,K(129)+9,x,t),await n.yield(),Ao(qe,204,K(204)+10,fe),B0(qe,191,-(K(191)+8.5),5,4,3,x,t),B0(qe,196.5,-(K(196)+9.2),3,3,2,x,t),B0(qe,108,K(108)+3.6,4,2,2,x,t),B0(qe,76,-(K(76)+4),3,2,2,x,t);const v0=24,x0=-(K(24)+8);qe.tube(o(v0,F,x0),o(v0,F+1.1,x0),1.1,1.1,x.stone,[r.courses,.8,.36],{sides:10,capCol:x.charcoal.lit});for(const e of[-.35,.35])qe.tube(o(v0+4.1,F,x0+e),o(v0+4.1,F+4.6,x0+e),.16,.12,x.log,[r.none],{sides:5});await n.yield();const Ue=Se(M);X0(Ue,280,-(K(280)+7.5),x,M),await n.yield(),X0(Ue,280,K(280)+7.5,x,M),await n.yield(),B0(Ue,247,K(247)+3.6,4,2,2,x,M),B0(Ue,271,-(K(271)+3.8),3,2,2,x,M);for(let e=8;e<63;e+=M.range(4.5,7.5)){const a=-(K(e)-.7-M.range(0,.5)),i=M.range(-.1,.1),c=1.5+M.range(0,.7);se.nearestXZ(e,a).dist<6.5||(Ue.tube(o(e,-.6,a),o(e+i,c,a),.22,.17,x.log,[r.none],{sides:6,capCol:x.endGrain}),Ue.tube(o(e,.7,a),o(e+i*.5,1.05,a),.27,.26,x.rope,[r.rope,.12,1],{sides:6,caps:!1}))}for(let e=0;e<9;e++)Ue.box(20,F-.2-e*.37,-(K(20)+.5-e*.62),3,.4,.74,x.stoneTop,[r.none],{});await n.yield();const Yt=new y.Mesh(Ue.build(),Z);Yt.name="east-statics",H.add(Yt),await n.yield();const Be=Se(ae);Be.box(xt,F+.3,kt,10.5,.6,10.5,x.stone,[r.courses,1.6,.3],{u0:0,patTop:[r.courses,1.9,1.1]}),Dt(Be,xt,kt,F+.6,[8,6.2,4.6],3.2,fe),await n.yield(),bo(Be,v0-4.5,x0-3,ae,x),await n.yield();for(const e of[-1,1]){Be.box(Xe,1.6,e*He,11,3.6,11,x.stone,[r.courses,1.7,.56],{u0:0,patTop:[r.courses,1.9,1.1]}),yt=Dt(Be,Xe,e*He,3.4,[9,7.8,6.6,5.4,4.2],3.9,fe),await n.yield(),Be.box(b0,3,e*12.4,5.2,6.6,5.2,x.brick,[r.courses,1.7,.56],{u0:0,patTop:[r.courses,1.9,1.1]});for(let a=0;a<4;a++)for(const i of[-1,1])Be.box(b0-2.1+a*1.4,6.75,e*12.4+i*2.4,.8,.9,.4,x.brick,[r.none],{}),Be.box(b0+i*2.4,6.75,e*12.4-2.1+a*1.4,.4,.9,.8,x.brick,[r.none],{});Dt(Be,b0,e*12.4,6.3,[3.6],2.6,fe),await n.yield()}const $t=new y.Mesh(Be.build(),Z);$t.name="pagodas",H.add($t),await n.yield();const Qt=new y.Mesh(Zt.build(),Z);Qt.name="city-wall",H.add(Qt),await n.yield();const Jt=new y.Mesh(qe.build(),Z);Jt.name="town-statics",H.add(Jt);const R0=Se(t);R0.tube(o(-4.2,0,0),o(5.2,0,0),.13,.09,x.log,[r.none],{sides:5}),R0.box(5,-.3,0,.7,.6,.6,x.stone,[r.none],{bottom:!0}),R0.beam(o(-4.1,0,0),o(-4.1,-3.4,0),.05,.05,x.timber),R0.tube(o(-4.1,-4,0),o(-4.1,-3.4,0),.26,.32,x.timber,[r.planks,9,.2],{sides:7});const J0=new y.Mesh(R0.build(),Z);J0.position.set(v0+4.1,F+4.4,x0),J0.rotation.y=0,H.add(J0),await n.yield();const pe=[],Tt=(e,a,i,c,h,k)=>{if(!(Math.abs(a)>6&&(e>262&&Math.abs(e-284)<12.5*i+4.5||Math.abs(e-b0)<12.5*i+4.5))){for(const A of[-1,0,1])if(se.nearestXZ(e+A*11.5*i,a).dist<9.5)return;pe.push({x:e,z:a,sc:i,ry:c,ph:h,tilt:k})}};for(const e of[-1,1])for(let a=0;a<3;a++){let i=(a?9:1)+t.range(0,10);for(;i<236;){const c=i<62||a===2,h=c?t.range(.42,.62):t.range(.62,.92),k=25*h,A=t(),P=t.chance(.5),W=t.range(-.07,.07),V=t()*6.28,O=t.chance(.4),$=t.range(2,8);if(i>135-k/2&&i<188+k/2){i=188+k/2+$;continue}A<(a===0?.86:a===1?.6:.3)*u*(1+.5*p.busy)&&Tt(i,e*(K(i)-.9-(a+.5)*5.3*(c?.62:.95)),h,(P?1:-1)*Math.PI/2+W,V,O?-1.36:t.range(-.1,.02)),i+=k+$}}const _a=pe.length,ea=(e,a,i)=>pe.some(c=>Math.abs(c.z-a)<4.5&&Math.abs(c.x-e)<(i+25*c.sc)/2+1.5);for(const e of[-1,1])for(let a=0;a<2;a++){let i=(e>0&&v==="fleet"?268:240)+M.range(0,8);for(;i<286;){const c=a===1,h=c?M.range(.4,.55):M.range(.62,.9),k=25*h,A=M(),P=M.chance(.5),W=M.range(-.07,.07),V=M()*6.28,O=M.chance(.4),$=M.range(2,8),te=M.range(-.1,.02),N=e*(K(i)-.9-(a+.5)*5.3*(c?.62:.95));A<(a===0?.9:.5)*u&&!ea(i,N,k)&&Tt(i,N,h,(P?1:-1)*Math.PI/2+W,V,O&&i<258?-1.36:te),i+=k+$}}for(const e of[13,27,41,56]){const a=-(K(e)-2.1),i=M.range(.26,.34),c=M()*6.28,h=M.range(-.12,.12);se.nearestXZ(e,a).dist>7.5&&!ea(e,a,25*i)&&pe.push({x:e,z:a,sc:i,ry:Math.PI/2+h,ph:c,tilt:-1.36})}const n0=new y.InstancedMesh(X.geo.hull,Z,Math.max(1,pe.length)),i0=new y.InstancedMesh(X.geo.mast,Z,Math.max(1,pe.length));n0.count=i0.count=pe.length,n0.frustumCulled=i0.frustumCulled=!1,n0.name="moored-hulls",i0.name="moored-masts",n0.instanceMatrix.setUsage(y.DynamicDrawUsage),i0.instanceMatrix.setUsage(y.DynamicDrawUsage),H.add(n0,i0);let G0=null;{const e=new y.InstancedBufferGeometry,a=new Float32Array((pe.length+3)*4);pe.forEach((h,k)=>a.set([h.x,h.z,h.ry,h.sc],k*4));for(let h=0;h<3;h++)a.set([0,900,0,.3],(pe.length+h)*4);e.setAttribute("position",new y.Float32BufferAttribute([-1,0,-1,1,0,-1,1,0,1,-1,0,1],3)),e.setIndex([0,2,1,0,3,2]),G0=new y.InstancedBufferAttribute(a,4),G0.setUsage(y.DynamicDrawUsage),e.setAttribute("aBoat",G0),e.instanceCount=pe.length+3;const i=new y.ShaderMaterial({uniforms:{uInk:B.uInk,uSilk:B.uSilk,uPale:B.uPale,uWater:ze.uWater,uHull:{value:x.hull.lit},uTime:B.uTime,uFade:B.uFade,uMist:B.uMist,uMistBand:B.uMistBand,uClip:B.uClip,uRipple:B.uRipple},vertexShader:po,fragmentShader:uo,transparent:!0,depthWrite:!1,side:y.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),c=new y.Mesh(e,i);c.frustumCulled=!1,c.name="hull-reflections",c.renderOrder=-.4,H.add(c)}const l0=ze.uObs.value;l0[0].set(171.6,-18.2,3.1),l0[1].set(171.6,18.2,3.1),l0[2].set(150.6,-18.4,3.1),l0[3].set(150.6,18.4,3.1),pe.slice().sort((e,a)=>se.nearestXZ(e.x,e.z).dist-se.nearestXZ(a.x,a.z).dist).slice(0,6).forEach((e,a)=>l0[4+a].set(e.x+12.5*e.sc,e.z,2.7)),await n.yield();const Ce=new y.Group;if(Ce.name="towed-barge",v==="fleet"){const e=new y.Mesh(X.geo.mast,Z);e.position.set(0,2.4,-5.2),e.rotation.x=-1.3,Ce.add(new y.Mesh(X.geo.hull,Z),e),Ce.rotation.y=Math.PI/2,Ce.position.set(236,0,11.6),H.add(Ce)}const L0=12,Wa=e=>{const a=K(e)+1.5;return a+(32.5-a)*Y(144,152,e)*(1-Y(170,178,e))};let r0=null,k0=null;const c0=[];if(v==="fleet"){const e=[];for(let a=0;a<L0;a++)e.push({x:0,y:F,z:0,ph:0,kind:2,h:t.range(2.9,3.15),lean:.9,hat:a%3===0,col:a%2?_:g(_,C,.45)});r0=za(e,X.mats.dab),r0.name="towmen",r0.rotation.y=-Math.PI/2,r0.geometry.attributes.aHome.setUsage(y.DynamicDrawUsage),H.add(r0),k0=ao(40,X.mats.rib),k0.mesh.name="tow-line",H.add(k0.mesh);for(let a=0;a<L0+8;a++)c0.push(o(0,0,0))}const We=new y.Mesh(X.geo.hull,Z);We.scale.set(.34,.42,.3),We.position.set(96,-.05,-17),We.name="ferry",H.add(We);const Ne=new y.Mesh(X.geo.hull,Z);Ne.scale.set(.34,.42,.3),Ne.position.set(276,-.05,9),Ne.name="ferry-east",H.add(Ne);const me={x:39.5,z:-10.8,ry:-1.864},Ee=new y.Mesh(X.geo.hull,Z);Ee.scale.set(.3,.36,.3),Ee.position.set(me.x,-.04,me.z),Ee.rotation.order="YXZ",Ee.rotation.y=me.ry,Ee.name="sampan",H.add(Ee),l0[10].set(me.x+3.9*Math.sin(me.ry),me.z+3.9*Math.cos(me.ry),2.6);const T0=n.core.makeRng("scroll-traffic:"+Math.floor(w*1e9)),_0=[];for(let e=0;e<=120;e++){const a=se.pointAt(.15+.4*e/120);_0.push([a.x,a.z])}const ta=e=>{let a=0;for(;a<_0.length-2&&_0[a+1][0]<e;)a++;const i=_0[a],c=_0[a+1],h=Math.min(1,Math.max(0,(e-i[0])/Math.max(.001,c[0]-i[0])));return i[1]+(c[1]-i[1])*h},aa=X.object.children.find(e=>e.isGroup&&e!==X.barge.object&&e.children.length===2&&e.children[0].geometry===X.geo.hull),Ea=aa&&aa.position.x>0?-1:1,Ie=new y.Group;Ie.name="junk";{const e=Se(T0),a=-5,i=4.9,c=15,h=3.3,k=4,A=8,P=x.oiled;e.setAnim(0,c,a,2);for(let O=0;O<k;O++)for(let $=0;$<A;$++){const te=-h+2*h*O/k,N=-h+2*h*(O+1)/k,oe=i+(c-i)*$/A,ce=i+(c-i)*($+1)/A,J=(Q,j)=>a-.55*(1-Q/h*(Q/h))*Math.sin(Math.PI*(.15+.7*(j-i)/(c-i)));e.quad(o(te,oe,J(te,oe)),o(N,oe,J(N,oe)),o(N,ce,J(N,ce)),o(te,ce,J(te,ce)),P,[r.planks,99,.42],{double:!0,u0:te+h,v0:oe,edges:[O===0?1:0,O===k-1?1:0,1,1],col:(O+$)%5===0?P.shade:P.lit})}e.setAnim(0,0,0,0),e.tube(o(-h-.4,c+.05,a),o(h+.4,c+.05,a),.13,.1,x.log,[r.none],{sides:6,capCol:x.endGrain}),e.tube(o(-h-.2,i-.05,a),o(h+.2,i-.05,a),.11,.09,x.log,[r.none],{sides:6,capCol:x.endGrain}),Oe(e,o(h+.3,c-.1,a+.1),o(h+.95,c-.1,a+.1),3.4,x.cloth,[r.stripes,.33,2],x.red.lit),Oe(e,o(-h-.95,c-.1,a+.1),o(-h-.3,c-.1,a+.1),2.6,x.cloth,[r.stripes,.33,2],x.blue.lit);const W=new y.Mesh(X.geo.mast,Z);W.position.set(0,2.4,-5.2),W.rotation.x=-.03;const V=new y.Mesh(e.build(),Z);V.name="junk-sail",Ie.add(new y.Mesh(X.geo.hull,Z),W,V);for(const O of Ie.children)O.frustumCulled=!1}const Mt=.76;Ie.scale.setScalar(Mt),Ie.rotation.order="YXZ",Ie.position.set(79,0,5),Ie.rotation.y=-Math.PI/2,H.add(Ie);const Ze=new y.Mesh(X.geo.hull,Z);Ze.scale.set(.36,.44,.32),Ze.rotation.order="YXZ",Ze.position.set(126,-.05,1.5),Ze.name="passenger-sampan",Ze.frustumCulled=!1,H.add(Ze);const Ye=new y.Mesh(X.geo.hull,Z);Ye.scale.set(.3,.36,.28),Ye.rotation.order="YXZ",Ye.position.set(142,-.05,9),Ye.name="bridge-sampan",Ye.frustumCulled=!1,H.add(Ye);const zt=[[0,1.6,1.75,-10.6],[0,-1.5,1.75,-9.6],[0,1.9,1.6,-.6],[0,1.9,3.1,10.6],[1,.5,3.1,10.8],[1,.7,1.6,-2],[1,-.7,1.6,-5.5],[2,.5,3.1,10.8],[2,0,1.6,-4]],et=za(zt.map((e,a)=>({x:0,y:0,z:900,ph:T0()*6,kind:2,h:e[0]===0?T0.range(1.9,2.2):T0.range(2.1,2.5),lean:e[3]>9?.12:0,hat:a%2===0,col:[_,ie,C,ee,_,ie,g(le,S,.3),_,T][a]})),X.mats.dab);et.name="afloat",et.geometry.attributes.aHome.setUsage(y.DynamicDrawUsage),H.add(et);const W0=[{x:79,z:5,ry:-Math.PI/2,sc:Mt,sy:Mt,y:0},{x:126,z:1.5,ry:Math.PI/2,sc:.34,sy:.44,y:0},{x:142,z:9,ry:Math.PI/2,sc:.29,sy:.36,y:0}];await n.yield();const y0=Se(t);y0.box(0,1.9,0,1.5,2,1.7,x.plaster,[r.none],{bottom:!0});for(const e of[-1,1])y0.quad(o(e*.76,1.7,-.6),o(e*.76,1.7,.6),o(e*.76,2.6,.6),o(e*.76,2.6,-.6),x.rail,[r.lattice,.2,.2],{double:!0});y0.cone(0,2.9,0,1.45,.75,4,x.oiled,{phase:Math.PI/4});for(const e of[-1,1])y0.beam(o(e*.82,1.5,-3.2),o(e*.82,1.5,3.2),.09,.09,x.timber);Oe(y0,o(-.6,2.85,.87),o(.6,2.85,.87),1.5,x.cloth,[r.none],x.blue.lit);const tt=[],ke=[],at=[C,g(C,S,.6),S,g(_,C,.45),_,g(q,C,.4),g(L,C,.2),g(_,D,.35)],Da=[ie,ee,T,g(le,S,.3)];let St=0;const M0=e=>{const a=e()<.34?at[e.chance(.5)?4:e.chance(.5)?7:3]:at[Math.min(at.length-1,Math.floor(e()*e()*at.length*1.6))];return St++,St%5<2?Da[St%4]:a},qt=()=>M0(t),At=(e,a,i,c,h,k)=>{const A=Math.hypot(i-e,c-a);tt.push({ax:e,az:a,bx:i,bz:c,len:A,speed:h,ph:k,yaw:Math.atan2(i-e,c-a)});for(const P of[-2.6,2.6])ke.push({a:[e,F,a,k+P/A],b:[i,F,c,h],h:2.5,hat:!0,loop:!0,col:_})};if(At(98,26.2,134,26.2,2.6,t()),At(134,27.8,98,27.8,2.4,t()),v==="festival"){const e=t();for(let a=0;a<3;a++)At(72,-(K(101)+3.6),134,-26.6,1.7,e+a*.12);for(let a=0;a<22;a++)ke.push({a:[72,F,-(K(101)+3.6)+t.range(-.8,.8),e-.05+a*.019+(a>10?.06:0)],b:[134,F,-26.6,1.7],h:t.range(2.4,2.8),hat:a%3===0,loop:!0,col:a%2?C:g(C,S,.5)})}const z0=new y.InstancedMesh(y0.build(),Z,tt.length);z0.frustumCulled=!1,z0.name="sedans",z0.instanceMatrix.setUsage(y.DynamicDrawUsage),H.add(z0),await n.yield();const h0=[[-1,2,148],[-1,219,240],[1,2,148],[1,174,238]],ot=[],Ka=Math.round(900*d*Math.min(1.3,u)*(1+.2*p.busy)),ja=h0.reduce((e,a)=>e+a[2]-a[1],0);for(let e=0,a=0;e<Ka&&a<2e3;a++){let i=t()*ja,c=0;for(;c<h0.length-1&&i>h0[c][2]-h0[c][1];)i-=h0[c][2]-h0[c][1],c++;const h=h0[c],k=h[0],A=t.chance(.78),P=A?t.range(Math.max(h[1],68),h[2]):t.range(h[1],h[2]),W=t.range(1.6,5.4),V=t.chance(.4),O=t.chance(.22),$=O?t.int(9,20):t.int(2,5),te=O?2.6:1.3,N=(t.chance(.5)?1:-1)*t.range(8,30),oe=t(),ce=t.range(1.3,2.6);for(let J=0;J<$;J++,e++){const Q=Math.min(h[2],Math.max(h[1],P+t.gauss()*te)),j=Math.min(5.8,Math.max(1.2,W+t.gauss()*.7)),E=Math.min(h[2],Math.max(h[1],Q+N)),U=t.chance(.15),ne=t(),ye=k*(K(Q)+1+j),he=k*(K(E)+1+j+t.range(-.4,.4)),be=U?t.range(1.5,1.95):t.range(2.25,2.85);ke.push({a:[Q,we(Q),ye,oe+t.range(-.004,.004)],b:V?[Q,we(Q),ye,0]:[E,we(E),he,ce],h:be,hat:!V&&!U&&ne<.2?2:t.chance(.25),lean:V?t.range(-.25,.25):0,col:qt()}),V&&!U&&ne<(p.snow?.45:.24)&&ot.push({x:Q+.3,y:we(Q),z:ye,ry:t()*6.28,sx:1,sy:be/2.6,sz:1})}a%40===39&&await n.yield()}{const e=[[-1,240,290],[1,238,290]],a=Math.round(300*d*Math.min(1.3,u)*(1+.2*p.busy));for(let i=0,c=0;i<a&&c<700;c++){const h=e[M.int(0,1)],k=h[0],A=M.range(h[1],h[2]),P=M.range(1.6,5.4),W=M.chance(.4),V=M.chance(.22),O=V?M.int(9,18):M.int(2,5),$=V?2.6:1.3,te=(M.chance(.5)?1:-1)*M.range(8,30),N=M(),oe=M.range(1.3,2.6);for(let ce=0;ce<O;ce++,i++){const J=Math.min(h[2],Math.max(h[1],A+M.gauss()*$)),Q=Math.min(5.8,Math.max(1.2,P+M.gauss()*.7)),j=Math.min(h[2],Math.max(h[1],J+te)),E=M.chance(.15),U=M(),ne=k*(K(J)+1+Q),ye=k*(K(j)+1+Q+M.range(-.4,.4)),he=E?M.range(1.5,1.95):M.range(2.25,2.85);ke.push({a:[J,we(J),ne,N+M.range(-.004,.004)],b:W?[J,we(J),ne,0]:[j,we(j),ye,oe],h:he,hat:!W&&!E&&U<.2?2:M.chance(.25),lean:W?M.range(-.25,.25):0,col:M0(M)}),W&&!E&&U<(p.snow?.45:.24)&&ot.push({x:J+.3,y:we(J),z:ne,ry:M()*6.28,sx:1,sy:he/2.6,sz:1})}c%40===39&&await n.yield()}for(let i=0;i<Math.round(70*d*u);i++){const c=M.chance(.5)?1:-1,h=262+M.range(-2.6,2.6),k=K(262)+8,A=c*M.range(k,70),P=c*Math.min(72,Math.max(k,Math.abs(A)+(M.chance(.5)?1:-1)*M.range(8,26)));ke.push({a:[h,F,A,M()],b:[h+M.range(-.5,.5),F,P,M.range(1.2,2.4)],h:M.range(2.3,2.85),hat:M.chance(.25),col:M0(M)})}}await n.yield();{const e=Se(t);e.tube(o(0,1.1,0),o(.2,3.5,0),.05,.045,x.timber,[r.none],{sides:5,caps:!1}),e.setAnim(.2,3.5,0,1),e.cone(.2,3.3,0,1.35,.5,10,p.snow?x.cloth:x.oiled,{}),e.setAnim(0,0,0,0),H.add(Ba(e.build(),Z,m?ot.filter(a=>!Q0(a.x,a.z)):ot,"held-parasols"))}await n.yield();const oa=[[86,1],[86,-1],[121,1],[121,-1],[161,1],[161,-1],[199,-1],[199,1]];for(let e=0;e<Math.round(300*d*u);e++){const a=oa[t.int(0,oa.length-1)],i=a[0]===161?5.6:2.6,c=a[0]+t.range(-i,i),h=a[0]===161?34:K(a[0])+8,k=a[1]*t.range(h,70),A=a[1]*Math.min(72,Math.max(h,Math.abs(k)+(t.chance(.5)?1:-1)*t.range(8,26)));ke.push({a:[c,F,k,t()],b:[c+t.range(-.5,.5),F,A,t.range(1.2,2.4)],h:t.range(2.3,2.85),hat:t.chance(.25),col:qt()})}for(let e=0;e<Math.round(70*d);e++){const a=t.chance(.7)?-1:1,i=t.range(2,66),c=a*(K(i)+1+t.range(6.5,26));ke.push({a:[i,F,c,t()],b:t.chance(.5)?[i,F,c,0]:[i+t.range(-9,9),F,c+t.range(-3,3),t.range(1,2)],h:t.range(2.3,2.8),hat:t.chance(.5),col:qt()})}ke.push({a:[me.x-.5,.55,me.z-.15,.3],b:[me.x-.5,.55,me.z-.15,0],h:2.3,hat:!0,lean:.15,col:_}),pe.forEach((e,a)=>{const i=a<_a?t:M,c=i.int(1,3),h=Math.cos(e.ry),k=Math.sin(e.ry);for(let A=0;A<c;A++){const P=i.range(-1.6,1.6)*e.sc,W=i.range(-10.5,.5)*e.sc;ke.push({a:[e.x+P*h+W*k,1.6*e.sc,e.z-P*k+W*h,i()],b:[e.x+P*h+W*k,1.6*e.sc,e.z-P*k+W*h,0],h:i.range(2.2,2.7)*Math.max(.75,e.sc),hat:i.chance(.6),lean:i.range(-.2,.2),col:M0(i)})}});for(let e=0;e<Math.round(150*d);e++){const a=ae.chance(.5)?1:-1,i=ae.range(264,291.5),c=ae.range(1.2,8.5),h=a*(K(i)+1+c),k=ae.chance(.6),A=ae.chance(.15)?ae.range(1.5,1.95):ae.range(2.3,2.85),P=ae(),W=ae.range(-12,12),V=ae.range(1.2,2.2),O=ae.chance(.25);Math.abs(i-b0)<3.6&&c<1.6||ke.push({a:[i,we(i),h,P],b:k?[i,we(i),h,0]:[Math.min(291.5,Math.max(264,i+W)),F,h,V],h:A,hat:O,lean:k?ae.range(-.2,.2):0,col:M0(ae)})}for(let e=0;e<Math.round(36*d);e++){const a=e%2?1:-1,i=ae.int(0,2),c=ae.range(-4.9,4.9),h=i===0?Xe-5:Xe+c,k=a*(i===0?He+c:He+(i===1?-5:5));ke.push({a:[h,3.4,k,ae()],b:[h,3.4,k,0],h:ae.range(2.3,2.8),hat:ae.chance(.3),lean:ae.range(-.2,.2),col:M0(ae)})}const Oa=new y.ShaderMaterial({uniforms:{...y.UniformsUtils.clone(y.UniformsLib.fog),uInk:B.uInk,uSilk:B.uSilk,uLinePx:B.uLinePx,uFade:B.uFade,uMist:B.uMist,uMistBand:B.uMistBand,uClip:B.uClip,uRipple:B.uRipple,uTime:B.uTime},vertexShader:co,fragmentShader:to,side:y.DoubleSide,fog:!0});H.add(Bo(m?ke.filter(e=>!Q0(e.a[0],e.a[2])&&!Q0(e.b[0],e.b[2])&&!Q0((e.a[0]+e.b[0])/2,(e.a[2]+e.b[2])/2)):ke,Oa)),await n.yield();const re=[],sa=g(_,C,.35),na=g(S,_,.3),Va=g(_,q,.35),E0=C.clone(),Pt=ie.clone(),Ft=(e,a,i,c,h,k,A,P)=>{const W=Math.hypot(i[0]-a[0],i[2]-a[2]),V=t();for(let O=0;O<e;O++)re.push({a,b:[i[0],i[1],i[2],c],k:[0,h*t.range(.92,1.08),k,V+O*P/W],col:A});return V};Ft(5,[22,F,-35.2],[66,F,-34.6],1.5,2.3,0,sa,4);const Xa=Ft(2,[134,F,29.6],[100,F,29.6],1,2.9,2,Va,11),$e=Se(t);$e.setAnim(0,.8,0,3),$e.box(0,1.5,0,3,1.2,1.6,x.timber,[r.planks,3,.3],{bottom:!0,patTop:[r.planks,3,.4]});for(let e=0;e<3;e++)$e.box(-.9+e*.9,2.36+(e===1?.3:0),0,1,.56,1.3,x.cloth,[r.none],{taper:.8,ry:.1*(e-1)});for(const e of[-1,1])$e.tube(o(.2,.8,e*.92),o(.2,.8,e*1.08),.8,.8,x.beam,[r.none],{sides:8,capCol:x.timber.lit}),$e.tube(o(.2,.8,e*1.08),o(.2,.8,e*1.2),.18,.14,x.log,[r.none],{sides:6}),$e.beam(o(-1.5,1.2,e*.62),o(-3.9,1.5,e*.5),.1,.12,x.timber,[r.none]);$e.setAnim(0,0,0,0);const S0=new y.InstancedMesh($e.build(),Z,2);S0.frustumCulled=!1,S0.name="ox-carts",S0.instanceMatrix.setUsage(y.DynamicDrawUsage),H.add(S0),Ft(4,[199,F,-62],[199.6,F,-25],2.3,1.5,3,C,3.2);{const e=-(K(206)+4),a=Math.hypot(5,vt-e),i=-(K(179)+4),c=206-Math.sqrt(Math.max(1,a*a-(i-e)*(i-e))),h=t();for(let k=0;k<8;k++){const A=3.5*t.range(.88,1.12),P=h+k/8;re.push({a:[$0[0],F,$0[1]],b:[206,F,e,1.25],k:[0,A,1,P],col:na}),re.push({a:[206,F,e],b:[c,F,i,1.25],k:[0,A,1,P],col:na})}}for(let e=0,a=0;e<9&&a<80;a++){const i=t.range(13,48),c=t.range(-13,13),h=40-.87*i+.5*c,k=10-.5*i-.87*c;se.nearestXZ(h,k).dist<6||Math.abs(k)>K(h)-3||(re.push({a:[h,0,k],k:[1,t.range(1,1.35),0,t()],col:C}),e++)}const st=l.fork("basin");for(let e=0,a=0;e<6&&a<60;a++){const i=st.range(150,262)*Math.PI/180,c=st.range(9,13.5),h=48+c*Math.cos(i),k=-3.9+c*Math.sin(i);Math.hypot(h-me.x,k-me.z)<4.5||(re.push({a:[h,0,k],k:[1,st.range(1,1.35),0,st()],col:C}),e++)}const nt=n.core.makeRng("scroll-first:"+Math.floor(w*1e9));for(let e=0,a=0;e<5&&a<60;a++){const i=nt.range(52,128)*Math.PI/180,c=nt.range(4.5,12.6),h=48+c*Math.cos(i),k=-3.9+c*Math.sin(i),A=nt.range(1,1.35),P=nt();Math.hypot(h-me.x,k-me.z)<4.5||se.nearestXZ(h,k).dist<3||(re.push({a:[h,0,k],k:[1,A,0,P],col:C}),e++)}for(let e=0;e<Math.round(80*d);e++)re.push({a:[t.range(18,252),t.range(1.5,2.3),t.range(-5,5)],b:[t.range(14,30),t.range(.6,1.1),t.range(5,11),t.range(.45,.95)*(t.chance(.5)?1:-1)],k:[2,t.range(.55,.8),0,t()],col:D});for(let e=0;e<8;e++)re.push({a:[ge.x+20+e*4,ge.y+4+e*1.6,(e%2?1:-1)*t.range(9,15)],b:[7,2.2,3.5,t.range(.7,1.1)],k:[2,.75,0,t()],col:D});for(let e=0;e<4;e++){const a=ge.clone().addScaledVector(w0,30+e*2.5);a.y+=1.2-e*.9,a.z+=(e%2?1:-1)*(2.5+e),re.push({a:[a.x,a.y,a.z],b:[N0.x+1.5,N0.y+(e-1.5)*.9,(e%2?1:-1)*1.2,xe(.895+e*.006)],k:[6,.9,0,t()],col:D})}{const e=K(246)+4.4,a=42,i=M();for(let h=0;h<5;h++)re.push({a:[288,F,e],b:[246,F,e,1.5],k:[0,2.3*M.range(.9,1.1),0,i+h*4/a],col:sa});const c=M();for(let h=0;h<4;h++)re.push({a:[262.4,F,-60],b:[261.8,F,m?-34:-25,2.2],k:[0,1.5*M.range(.9,1.1),3,c+h*3.2/35],col:C});for(let h=0;h<7;h++)re.push({a:[M.range(268,293),0,M.range(-9,9)],k:[1,M.range(1,1.35),0,M()],col:C})}if(s0.forEach((e,a)=>re.push({a:[e[0],e[1]-.25,e[2]],k:[3,e[3]*M.range(2.2,2.6),0,M()],col:b==="dusk"&&a%3===1?E0:Pt})),b==="dusk"){pe.forEach((e,a)=>re.push({a:[e.x+5.5*e.sc*Math.sin(e.ry),3.4*e.sc,e.z+5.5*e.sc*Math.cos(e.ry)],k:[3,1.9,0,t()],col:a%2?E0:Pt}));for(const e of[-1,1])for(let a=-24;a<=24;a+=4)re.push({a:[Te-e*3.1,X.anchors.deckY(a)+1.3,a],k:[3,2,0,t()],col:e>0?Pt:E0});for(let e=-22;e<=22;e+=4.4)re.push({a:[Te-7.15,X.anchors.deckY(e)+1.9,e],k:[3,1.8,0,t()],col:E0})}for(let e=0;e<2;e++){const a=e?[112,33,66]:[214,41,58],i=e?[208,37,-62]:[108,44,-66],c=i[0]-a[0],h=i[2]-a[2],k=Math.hypot(c,h),A=c/k,P=h/k,W=ae()+e*.5;for(let V=0;V<(e?6:7);V++){const O=V-3,$=-Math.abs(O)*5.5,te=O*4.2,N=A*$-P*te,oe=P*$+A*te,ce=ae.range(-.6,.6);re.push({a:[a[0]+N,a[1]+ce,a[2]+oe],b:[i[0]+N,i[1]+ce,i[2]+oe,6.5],k:[7,ae.range(4.6,5.6),0,W],col:C})}}const Bt=15.65,ia=4.1,Ct=Bt+ia/2;for(let e=0;e<4;e++)re.push({a:[t0.x-Math.sin(de)*2.6,t0.y+Math.cos(de)*2.6,0],b:[Math.cos(de)*Ct,Math.sin(de)*Ct,Ct,.13],k:[7,ia,1,e*.25+w],col:C});if(v==="festival")for(let e=0;e<8;e++)re.push({a:[t.range(204,238),t.range(27,44),t.range(-70,-22)],k:[4,t.range(4,6),0,t()],col:e%2?C:E0});if(p.snow)for(let e=0;e<Math.round(2e3*d);e++)re.push({a:[t.range(-10,300),t.range(0,26),t.range(-46,46)],b:[0,0,0,t.range(.9,1.9)],k:[5,t.range(.45,.85),0,t()],col:C});await n.yield();const la=new y.ShaderMaterial({uniforms:{uInk:B.uInk,uSilk:B.uSilk,uGrey:B.uGrey,uLinePx:B.uLinePx,uFade:B.uFade,uMist:B.uMist,uMistBand:B.uMistBand,uClip:B.uClip,uRipple:B.uRipple,uTime:B.uTime,uU:{value:0},uAzur:B.uAzur,uSeal:B.uSeal,uGold:B.uGold},vertexShader:ho,fragmentShader:fo,side:y.DoubleSide});await n.yield(),H.add(Fo(re,la,"cards")),await n.yield();const f0=new y.Group;if(f0.name="collector-block",m){const e=Se(t),a=z[6],i=7,c=G(g(x.soap.lit,_,.14),g(x.soap.shade,_,.2));e.box(0,4.5,0,14,9,14,x.soap,[r.none],{noTop:!0});for(let k=0;k<4;k++){e.setXf(new y.Matrix4().makeRotationY(k*Math.PI/2)),e.quad(o(-i+.6,.6,i+.03),o(i-.6,.6,i+.03),o(i-.6,8.4,i+.03),o(-i+.6,8.4,i+.03),x.soap,[r.none],{}),e.quad(o(-i+1.2,1.2,i+.045),o(i-1.2,1.2,i+.045),o(i-1.2,7.8,i+.045),o(-i+1.2,7.8,i+.045),x.soap,[r.none],{}),e.quad(o(-i+1.5,1.5,i+.06),o(i-1.5,1.5,i+.06),o(i-1.5,7.5,i+.06),o(-i+1.5,7.5,i+.06),c,[r.none],{});const A=[[-2.6,5.9],[2.6,5.9],[2.6,3.1],[-1.5,3.1],[-1.5,4.7]];for(let P=0;P+1<A.length;P++){const W=A[P],V=A[P+1],O=W[1]===V[1],$=(W[0]+V[0])/2,te=(W[1]+V[1])/2;e.box($,te,i+.1,O?Math.abs(V[0]-W[0])+.34:.34,O?.34:Math.abs(V[1]-W[1])+.34,.1,x.soap,[r.none],{u0:0})}for(const[P,W]of[[6.72,1],[2.28,-1]])for(let V=-4;V<=4;V++){const O=V*1.12;e.box(O,P+W*.3,i+.1,.84,.13,.08,x.soap,[r.none],{u0:0}),e.box(O-.355,P,i+.1,.13,.6,.08,x.soap,[r.none],{u0:0}),e.box(O-.08,P-W*.3,i+.1,.68,.13,.08,x.soap,[r.none],{u0:0}),e.box(O+.195,P-W*.1,i+.1,.13,.4,.08,x.soap,[r.none],{u0:0})}}e.setXf(null),e.box(0,9.6,0,14,1.2,14,x.soap,[r.none],{taper:.886}),e.box(0,10.7,0,12.4,1,12.4,x.soap,[r.none],{taper:.73}),e.box(0,11.5,0,8,.6,8,x.soap,[r.none],{}),e.box(0,12.05,0,6.6,.5,6.6,c,[r.none],{});const h=12.3;e.box(0,h+1,0,3,2,5,x.soap,[r.none],{taper:.8}),e.box(0,h+1.3,-1.7,3.5,2.6,2.3,x.soap,[r.none],{taper:.7}),e.box(0,h+2.4,2.5,2.3,2,2.2,x.soap,[r.none],{taper:.82,bottom:!0}),e.box(0,h+1.95,3.85,1.4,1,1,x.soap,[r.none],{taper:.8,bottom:!0});for(const k of[-1,1])e.box(k*.78,h+3.65,2.2,.55,.7,.5,x.soap,[r.none],{taper:.3}),e.box(k*1.15,h+.35,2.8,.9,.7,2.2,x.soap,[r.none],{taper:.85});e.box(0,h+2.5,-2.95,.7,1.5,.8,x.soap,[r.none],{taper:.45});for(const k of[-1,1]){const A=[o(k*1.55,h+.9,.9),o(k*3.6,h+.1,1.2),o(k*5.2,11.05,1.5),o(k*6.75,10,1.7),o(k*7.25,8.6,1.8),o(k*7.3,6.2+k*.7,1.9)];for(let P=0;P+1<A.length;P++)e.tube(A[P],A[P+1],.17,.17,x.rope,[r.rope,.2,1],{sides:6,caps:!1});e.tube(A[5],o(A[5].x,A[5].y-.5,A[5].z),.3,.3,x.rope,[r.rope,.12,1],{sides:7}),e.cone(A[5].x,A[5].y-2.3,A[5].z,.55,1.8,8,x.oiled,{})}e.tube(o(-1.55,h+.9,.9),o(1.55,h+.9,.9),.17,.17,x.rope,[r.rope,.2,1],{sides:6,caps:!1}),[1,.8,.64,.5,.36,.22,.08].forEach((k,A)=>{const P=i*k,W=-.02*A;e.quad(o(-P,W,-P),o(P,W,-P),o(P,W,P),o(-P,W,P),x.soap,[r.none],{col:A%2?x.soap.shade:a})}),await n.yield(),f0.add(new y.Mesh(e.build(),gt)),f0.position.set(O0,120,dt),f0.visible=!1,H.add(f0)}const De=new y.Vector3,it=new y.Vector3,ra=new y.Matrix4,D0=a0,K0=se.pointAt(0),q0=K0.clone().sub(se.pointAt(.004)).setY(0).normalize(),A0=se.nearestXZ(122,.7).u,Qe=se.nearestXZ(161,1.5).u,Ae=se.nearestXZ(190,0).u,ca=o(130,12,-3),ha=o(196,6.5,-25),fa=e=>Math.min(1,Math.max(0,e)),Pe=o(0,0,0),It=o(0,0,0),P0=o(0,0,0),Ha=o(0,0,0),lt=Math.PI/180,da=Math.tan(31*lt);let pa=[];const Ua=(e,a,i,c)=>{const h=(i-a)*c;return Y(a,a+h,e)*(1-Y(i-h,i,e))},Na=(e,a,i)=>{const c=a*se.length;se.posAtDist(c,Pe),se.posAtDist(c+15,i).sub(Pe).normalize();const h=Y(0,.04,a)*(1-Y(.93,.985,a));for(let k=0;k<6;k++){const A=pa[k],P=Ua(a,A.from??0,A.to??1,A.fade??.3)*(A.weight??.5)*h;if(P<=.001)continue;const W=typeof A.at=="function"?A.at(e,a):A.at;W.isVector3?It.copy(W):It.set(W[0],W[1],W[2]),i.multiplyScalar(1-P).addScaledVector(It.sub(Pe).normalize(),P).normalize()}return i},ua=(e,a,i)=>{const c=(a-e)/i;return e+i*(c<=-1?0:c>=1?c:(c+1)*(c+1)/4)},Za=(e,a,i)=>-ua(-e,-a,i),ma=(e,a,i)=>(c,h)=>{Na(c,h,P0);const k=Math.max(Math.hypot(P0.x,P0.z),1e-6),A=P0.x/k,P=P0.z/k,W=Math.atan2(P0.y,k);let V=-1.5;for(const te of e){const N=(te[0]-Pe.x)*A+(te[2]-Pe.z)*P;N>2&&(V=Math.max(V,Math.atan2(te[1]-Pe.y,N)-Math.atan(da*a(Pe))))}const O=ua(W,Za(V,i(Pe),2.5*lt),2.5*lt),$=Math.cos(O)*60;return Ha.set(Pe.x+A*$,Pe.y+Math.sin(O)*60,Pe.z+P*$)},Rt=.86,Ya={at:ma([[Te-5.75,F+8+8.2,0]],()=>Rt,e=>Math.atan2(t0.y-e.y,Math.max(Math.hypot(t0.x-e.x,e.z),1))+Math.atan(da*Rt)),from:A0-.1,to:Qe-.01,weight:1,fade:.3},wa=o(t0.x-Bt*Math.cos(de),t0.y-Bt*Math.sin(de),0),$a={at:ma([[Xe,yt,-He],[Xe,yt,He]],()=>Rt,e=>Math.atan2(wa.y-e.y,Math.max(wa.x-e.x,1))+31*lt),from:xe(.78),to:1,weight:1,fade:.3},Qa=e=>{const a=(i,c)=>{const h=fa((e-i)/(c-i));return Math.min(1.06,h*h*(1+.12*Math.sin(fa((e-c)/.02)*Math.PI)))};return 86-46*a(.03,.1)-9*a(.15,.18)-9*a(.21,.24)};function ga(e,a,i,c){const h=n.through===!0;B.uClip.value.set(q0.x,q0.z,-(q0.x*K0.x+q0.z*K0.z)-1.5,h?1:0),De.setFromMatrixPosition(i.matrixWorld);const k=h?Math.max(0,(De.x-K0.x)*q0.x+(De.z-K0.z)*q0.z):0;if(B.uFade.value.set(p.fade[0]+k,p.fade[1]+k),B.uMist.value.z=p.mistNF[0]+k,B.uMist.value.w=p.mistNF[1]+k,Z0.position.copy(De),m){const j=Y(Ae-.035,Ae+.03,c),E=Y(Ae+.05,Ae+.13,c),U=c-(Ae+.035);f0.visible=c>Ae-.04&&c<Ae+.135,f0.position.y=F+.05+88*(1-j)+88*E*E,ze.uStampAt.value.w=Y(Ae+.03,Ae+.04,c),B.uRipple.value.set(O0-U*900,U>0?.9*Y(0,.012,U)*(1-Y(.2,.3,U)):0,13)}se.pointAt(Math.min(1,c+.003),it),se.pointAt(Math.max(0,c-.003),Ve),it.sub(Ve);let A=De.x,P=De.z,W=Math.atan2(it.z,it.x);if(h&&(se.pointAt(0,Ve),A=Ve.x,P=Ve.z),A>D0){const j=A-D0;A=D0+9*(1-Math.exp(-j/9)),W*=1-Y(0,24,j)}const V=Math.cos(W),O=Math.sin(W),$=A-8.5*V+2*O,te=P-8.5*O-2*V;X.setCarried(!h),X.setBargePose(te,Te-$,-W);const N=Math.min(1,Math.max(0,(62-(Te-$))/107));X.setProgress(N);const oe=Y(.48,.565,N);X.setMast((N>.48?22-20.5*oe:Qa(N))*Math.PI/180,N>.48?(13+17*oe)*Math.PI/180:null),ha.set(Math.min(213,Math.max(188,De.x+15)),6.5,-25);const ce=B.uRipple.value,J=(A+1-ce.x)/Math.max(ce.z,1);X.setSink(.3+(De.x>D0&&!h?1.5*Y(0,20,De.x-D0):0)+.72*ce.y*Math.exp(-J*J)),X.update(e,a,i),X.barge.object.updateMatrixWorld(!0),ca.set(0,14.5,0).applyMatrix4(X.barge.mast.matrixWorld),la.uniforms.uU.value=c,ze.uBargeW.value.set($,h?900:te,V,O),l0[11].set(A+7.5*V-4.5*O,h?900:P+7.5*O+4.5*V,3);const Q=a*.54+70*Math.min(c,.15);ze.uWind.value=Q,ze.uBig.value.w=-a*.22,B.uMist.value.y=a*.045,C0.rotation.z=-Q/4.9,Y0.rotation.z=-a*.24,Ee.rotation.y=me.ry+.1*Math.sin(a*1.7),Ee.rotation.z=.05*Math.sin(a*1.7+1),Ee.position.y=-.04+.03*Math.sin(a*1.1);for(let j=0;j<pe.length;j++){const E=pe[j];Pa.set(.006*Math.sin(a*.7+E.ph),E.ry+.035*Math.sin(a*.31+E.ph),.02*Math.sin(a*.8+E.ph*2),"YXZ"),m0.setFromEuler(Pa),Ge.compose(Ve.set(E.x,.05*Math.sin(a*.9+E.ph),E.z),m0,wt.set(E.sc,E.sc,E.sc)),n0.setMatrixAt(j,Ge),ra.makeRotationX(E.tilt+.012*Math.sin(a*1.1+E.ph)).setPosition(0,2.4,-5.2),Ge.multiply(ra),i0.setMatrixAt(j,Ge)}n0.instanceMatrix.needsUpdate=!0,i0.instanceMatrix.needsUpdate=!0,We.position.z=-17+34*Y(xe(.07),xe(.3),c)+.3*Math.sin(a*.4),We.position.y=-.05+.04*Math.sin(a*1.1),We.rotation.y=Math.PI+.12*Math.sin(a*1.7),We.rotation.z=.04*Math.sin(a*1.7+1),Ne.position.z=9-18*Y(xe(.6),xe(.92),c)+.3*Math.sin(a*.4+2),Ne.position.y=-.05+.04*Math.sin(a*1.1+2),Ne.rotation.y=.12*Math.sin(a*1.7+2),Ne.rotation.z=.04*Math.sin(a*1.7);{const j=W0[0],E=W0[1],U=W0[2],ne=ze.uTraf.value;j.x=79+3.5*Y(0,.3,c)+.25*Math.sin(a*.21),j.z=5+.3*Math.sin(a*.17+1),j.ry=-Math.PI/2+.05*Math.sin(a*.33),j.y=.05*Math.sin(a*.8),Ie.position.set(j.x,j.y,j.z),Ie.rotation.set(.01*Math.sin(a*.7),j.ry,.03*Math.sin(a*.6+2));const ye=Y(.05,.42,c),he=Y(.18,.5,c);E.x=126-56*ye,E.z=Math.min(ta(E.x)+9,1.5)+.25*Math.sin(a*.4),E.ry=Math.PI/2+.1*Math.sin(a*1.7),E.y=-.05+.04*Math.sin(a*1.1+1),Ze.position.set(E.x,E.y,E.z),Ze.rotation.set(0,E.ry,.04*Math.sin(a*1.7+1)),U.x=142-16*he,U.z=ta(U.x)+Ea*8.5+.25*Math.sin(a*.37+2),U.ry=Math.PI/2+.12*Math.sin(a*1.9+1),U.y=-.05+.04*Math.sin(a*1.2),Ye.position.set(U.x,U.y,U.z),Ye.rotation.set(0,U.ry,.05*Math.sin(a*1.9));const be=ye>.002&&ye<.998,ct=he>.002&&he<.998,F0=We.position.z,Ja=F0>-16.5&&F0<16.5;ne[0].set(E.x+3.6,be?E.z:900,-1,0),ne[1].set(U.x+3,ct?U.z:900,-1,0),ne[2].set(96,Ja?F0-3.4:900,0,1),ze.uSail.value.set(j.x,j.z,11.2,2.5);const va=et.geometry.attributes.aHome;for(let Re=0;Re<zt.length;Re++){const Ke=zt[Re],Je=W0[Ke[0]],xa=Math.cos(Je.ry),ka=Math.sin(Je.ry),ya=Ke[1]*Je.sc,Ma=Ke[3]*Je.sc;va.setXYZ(Re,Je.x+ya*xa+Ma*ka,Je.y+Ke[2]*Je.sy+.03*Math.sin(a*1.7+Re),Je.z-ya*ka+Ma*xa)}va.needsUpdate=!0;for(let Re=0;Re<3;Re++){const Ke=W0[Re];G0.setXYZW(pe.length+Re,Ke.x,Ke.z,Ke.ry,Ke.sc)}G0.needsUpdate=!0}if(Ce.position.x=240-92*Y(Qe-.3,Qe,c),Ce.position.y=.05*Math.sin(a*.8+2),Ce.rotation.z=.012*Math.sin(a*.6),r0){const j=r0.geometry.attributes.aHome,E=Ce.position.x-19.65,U=Math.abs(Math.sin(a*2.3));c0[0].set(E,6.4+Ce.position.y,11.6);for(let he=0;he<L0;he++){const be=E-16-(L0-1-he)*1.25,ct=Wa(be),F0=F+.08*U;j.setXYZW(he,ct,F0,-be,he*.7),c0[7+L0-he].set(be-.75,F0+1.75,ct)}const ne=c0[0],ye=c0[8];for(let he=1;he<8;he++){const be=he/8;c0[he].set(ne.x+(ye.x-ne.x)*be,ne.y+(ye.y-ne.y)*be-1.6*be*(1-be),ne.z+(ye.z-ne.z)*be)}j.needsUpdate=!0,k0.begin(),k0.line(c0,2.2),k0.end()}for(let j=0;j<2;j++){const E=(a*1/34+Xa+j*11/34)%1,U=Y(0,.03,E)*(1-Y(.97,1,E));Ge.compose(Ve.set(134-34*E+4.3,F,29.6),m0.set(0,0,0,1),wt.set(U,U,U)),S0.setMatrixAt(j,Ge)}S0.instanceMatrix.needsUpdate=!0;for(let j=0;j<tt.length;j++){const E=tt[j],U=(a*E.speed/E.len*.5+E.ph)%1,ne=Math.min(1,Math.min(U,1-U)/.03);m0.setFromAxisAngle(Fa,E.yaw),Ge.compose(Ve.set(E.ax+(E.bx-E.ax)*U,F+.1*Math.abs(Math.sin(a*4.6+j)),E.az+(E.bz-E.az)*U),m0,wt.set(ne,ne,ne)),z0.setMatrixAt(j,Ge)}z0.instanceMatrix.needsUpdate=!0,J0.rotation.z=.12+.3*Math.sin(a*.5)}await n.yield();const rt=new y.PerspectiveCamera(62,n.aspect||1.78,.3,3e3);se.pointAt(0,rt.position),rt.updateMatrixWorld(),X.setProgress(0),X.update(0,0,rt),await n.yield(),ga(0,0,rt,0),await n.yield();const ba={scene:H,path:se,duration:Ia,pace:e=>.62+.48*Y(xe(.02),xe(.3),e)-.2*Y(A0-.05,A0+.02,e)*(1-Y(Qe,Qe+.06,e))+.06*Y(xe(.7),xe(.9),e),title:p.title+(m?": The Collector\u2019s Seal":v==="fleet"?", Grain-Fleet Day":v==="festival"?", Festival Day":""),ride:"none",style:"none",camera:{fov:62,near:.3,far:3200,lookAhead:15,sway:.35,bank:.2,nearThrough:.3},pois:[{at:[91,13,-(K(91)+9.5)],from:xe(.12),to:xe(.29),weight:.36,fade:.25},{at:[Te,8.5,0],from:A0-.1,to:Qe-.01,weight:.4,fade:.3},{at:()=>ca,from:A0-.04,to:A0+.06,weight:.35,fade:.3},{at:[Te+6,9.2,1.5],from:Qe-.035,to:Qe+.01,weight:.5,fade:.3},{at:()=>ha,from:Ae-.05,to:Ae+.075,weight:.4,fade:.3},{at:t0,from:xe(.78),to:1,weight:.35,fade:.3},Ya,$a],portal:{shape:"circle",radius:7,tilt:!0,color:"#C2371F",glow:.3,blendDistance:25},post:{flat:1,exposure:1,bloom:{strength:0,radius:.5,threshold:1},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:0,grain:0,aberration:0}},update:ga,dispose(){X.dispose?.()}};return pa=ba.pois,ba}};export{Go as default};
