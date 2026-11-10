import*as l from"three";import"three/addons/utils/BufferGeometryUtils.js";import{makePath as ia,clamp as de,lerp as G,smoothstep as ne}from"../kit/core.js";import{buildHero as la,styleMaterial as et,EBRU_GLSL as He}from"../parts/combed-sea.js";const Pe=Math.PI/180,ca={squall:{title:"The Combed Sea",palette:["#0F1D40","#1E9FA6","#3F8F6E","#F2E7C9","#C98A2B","#17151C","#5B6672"],paper:"#F2E7C9",zenith:.16,vein:"#5B6672",sunAz:40,sunEl:42,hi:1,hiCol:[1.25,1.19,1.02],hiFrom:.3,glow:0,squall:1,rain:.5,slabDark:1,stars:0,tint:[1,1,1],lantern:0,bait:0,post:{exposure:1,bloom:{strength:.25,radius:.5,threshold:.95},grade:{saturation:1.06,contrast:1.04,tint:"#fffaf0",shadowTint:"#04060f",vignette:.22,grain:.035,aberration:0}}},golden:{title:"The Combed Sea, Sun-Shower",palette:["#1D1A48","#1E9FA6","#4A9468","#F0DCAE","#C98A2B","#19141C","#655F68"],paper:"#E3CFA0",zenith:.2,vein:"#7A6A66",sunAz:34,sunEl:17,hi:1.5,hiCol:[1.5,1.02,.42],hiFrom:-1,glow:0,squall:.55,rain:.22,slabDark:1.25,stars:0,tint:[1.04,.97,.88],lantern:0,bait:0,post:{exposure:1.08,bloom:{strength:.3,radius:.55,threshold:.92},grade:{saturation:1.08,contrast:1.05,tint:"#fff2d6",shadowTint:"#0a0614",vignette:.26,grain:.035,aberration:0}}},night:{title:"The Combed Sea, Lacivert",palette:["#070A1A","#1A8F98","#2A7C66","#B4C0C4","#C98A2B","#03040A","#525E7E"],paper:"#222C50",zenith:.93,vein:"#39445C",sunAz:40,sunEl:38,hi:.5,hiCol:[.8,.92,1],hiFrom:.3,glow:.85,squall:1,rain:.5,rainAmt:.5,slabDark:1.05,stars:1,tint:[.7,.78,.95],lantern:1,bait:0,post:{exposure:1,bloom:{strength:.36,radius:.55,threshold:.85},grade:{saturation:1.1,contrast:1.05,tint:"#eef4ff",shadowTint:"#02030a",vignette:.3,grain:.04,aberration:0}}},dawn:{title:"The Combed Sea, Pearl Dawn",palette:["#2A3D62","#2AA3A8","#4C9478","#EFE9DC","#C98A2B","#191822","#66707C"],paper:"#E9E3D8",zenith:.12,vein:"#8A8E99",sunAz:58,sunEl:13,hi:.9,hiCol:[1.3,1.12,.98],hiFrom:-1,glow:0,squall:0,rain:0,slabDark:1,stars:0,tint:[1,.99,1],lantern:0,bait:1,post:{exposure:1,bloom:{strength:.25,radius:.5,threshold:.95},grade:{saturation:1.02,contrast:1.03,tint:"#fff8f4",shadowTint:"#060812",vignette:.2,grain:.035,aberration:0}}}},fa=`
varying vec3 vDir;
void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`,ha=`
precision highp float;
${He}
uniform vec3 uPaper;
uniform vec3 uZen;
uniform vec3 uVein;
uniform vec3 uSeaFar;
uniform float uTime;
uniform float uStars;
uniform float uSeedK;
varying vec3 vDir;
float hair(float px, float w){ return 1. - smoothstep(w * .5 - .5, w * .5 + .5, px); }
void main(){
  vec3 d = vDir / max(length(vDir), 1e-5);
  float h = d.y;
  vec3 col = mix(uPaper, uZen, smoothstep(.03, .85, h));
  vec2 p0 = d.xz / (max(h, 0.) + .3);
  float a = uTime * 5.8e-4 + uSeedK;
  float ca = cos(a), sa = sin(a);
  vec2 p = vec2(ca * p0.x - sa * p0.y, sa * p0.x + ca * p0.y);
  { float sp = .9; float t = p.x / sp; float f = (t - floor(t)) * sp; p.y -= .5 * (exp(-f / .16) + exp(-(sp - f) / .16)); }
  p.x -= 1.1 * exp(-abs(p.y - .4) / .5);
  { vec2 c = vec2(-.8, .6); vec2 q = p - c; float ang = 2.4 * exp(-length(q) / .9); float cs = cos(ang), sn = sin(ang); p = c + vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y); }
  p.y += .35 * sin(p.x * 1.7 + 1.);
  float f = p.y * 2.7;
  float id = floor(f), fr = f - id;
  float fw = max(fwidth(f), 1e-5);
  float lod = (1. - smoothstep(.22, .6, fw)) * smoothstep(.03, .14, h);
  float hv = ebHash1(vec2(id, 7.3));
  float vein = hair(min(fr, 1. - fr) / fw, 1.5) * step(.2, hv);
  float inner = hair(abs(fr - .36) / fw, 1.2) * step(.55, hv) * .6;
  col = mix(col, uVein, step(.66, hv) * .16 * lod);
  col = mix(col, uVein, max(vein, inner) * .72 * lod);
  // paper fibres
  vec2 q = p0 * 26.;
  vec2 g = floor(q); vec2 hf = ebHash2(g + 3.1);
  float th = hf.x * 3.1416; vec2 dr = vec2(cos(th), sin(th));
  vec2 rel = q - g - .25 - .5 * ebHash2(g + 9.7);
  float al = dot(rel, dr), ac = rel.x * dr.y - rel.y * dr.x;
  float dd = length(vec2(max(abs(al) - .3, 0.), ac));
  float fq = max(fwidth(q.x) + fwidth(q.y), 1e-5) * .6;
  float fleck = hair(dd / fq, 1.3) * (1. - smoothstep(.12, .4, fq)) * step(.45, hf.y) * step(0., h);
  col = mix(col, mix(col * .86, col * 1.5 + .02, uStars), fleck * .55);
  // pinhole stars (night paper)
  vec2 qs = p0 * 34.; vec2 gs = floor(qs); vec2 hs = ebHash2(gs + 41.);
  float ds = length(qs - gs - .2 - .6 * ebHash2(gs + 17.)) - (.025 + .055 * hs.x * hs.x);
  float fs = max(fwidth(qs.x) + fwidth(qs.y), 1e-5) * .6;
  float star = (1. - smoothstep(-1., 1., ds / fs)) * step(.72, hs.y) * smoothstep(.02, .12, h) * (1. - smoothstep(.2, .5, fs));
  col += uStars * star * uPig[3] * (1.1 + .5 * sin(uTime * (1. + 2. * hs.x) + hs.y * 40.));
  col = mix(uSeaFar, col, smoothstep(-.003, .002, h));
  gl_FragColor = vec4(col, 1.);
}
`,ua=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`,It=.63,wt=1/3,Xt=.22,Gt=.4,Lt=n=>n>=0?G(.24,1.05,ne(-20,130,n)):0,xt=92*Lt(0),da=10,Ot=16,pa=`
${He}
attribute vec2 aCell;
uniform float uEdge;
uniform float uSeedS;
uniform float uDrift;
varying vec3 vW;
varying vec2 vCen;
#define SC 46.0
void main(){
  vec2 cen = (aCell + .5 + .7 * (ebHash2(aCell) - .5) - uSeedS) * SC;
  float edge = uEdge + 42. * sin(cen.x * .0105 + 1.3) + 24. * sin(cen.x * .027 + .4);
  float R = SC * mix(.24, 1.05, smoothstep(-20., 130., cen.y - edge)) * step(edge, cen.y);
  float rp = min(R, SC * ${It});
  vec3 w = vec3(cen.x + position.x * rp, 130. + position.y * rp, cen.y + position.z * rp + uDrift);
  vW = w; vCen = cen;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}
`,Wt=`
precision highp float;
${He}
uniform float uTime;
uniform float uEdge;
uniform float uSeedS;
uniform float uDark;
uniform float uShade;
uniform float uDrift;
uniform vec3 uSunDir;
uniform sampler2D uWhole;
uniform vec4 uWholeBox;
varying vec3 vW;
#ifdef POUCH
varying vec2 vCen;
#endif
#define SC 46.0
float sl(float px, float w){ return 1. - smoothstep(w * .5 - .5, w * .5 + .5, px); }
void main(){
  vec2 xz = vW.xz - vec2(0., uDrift);
  vec2 q = xz / SC + uSeedS; vec2 g = floor(q), f = q - g;
  float d1 = 1e3, d2 = 1e3; vec2 r1 = vec2(0.), r2 = vec2(1., 0.), id1 = g, h1 = vec2(0.);
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 o = vec2(float(i), float(j));
      vec2 hh = ebHash2(g + o);
      vec2 r = o + .5 + .7 * (hh - .5) - f;
      float d = dot(r, r);
      if (d < d1) { d2 = d1; r2 = r1; d1 = d; r1 = r; id1 = g + o; h1 = hh; }
      else if (d < d2) { d2 = d; r2 = r; }
    }
  }
  vec2 dr = r2 - r1;
  float eCell = dot(.5 * (r1 + r2), dr / max(length(dr), 1e-4)) * SC;
  vec2 cen = (id1 + .5 + .7 * (h1 - .5) - uSeedS) * SC;
  float edge = uEdge + 42. * sin(cen.x * .0105 + 1.3) + 24. * sin(cen.x * .027 + .4);
  float inside = smoothstep(-20., 130., cen.y - edge);
  float R = SC * mix(.24, 1.05, inside) * step(edge, cen.y);
  float dl = sqrt(d1) * SC;
  float sd = dl - R;
  float b = h1.x * 5. + uTime * .05 * (.5 + h1.y) - dl * dl / (SC * SC * .1);
  // derivatives: once, after the loop, and every one of them before the cap's discard below
  float fwq = max(fwidth(q.x) + fwidth(q.y), 1e-5) * .7;
  float fsd = max(fwidth(dl), 1e-5);
  float fwb = max(fwidth(b), 1e-5);
  float fwe = max(fwidth(eCell), 1e-5);
  float n = floor(b), bf = b - n;
  float hp = ebHash1(id1 * 1.7 + n * 3.1);
  vec3 black = mix(uPig[5], uPig[0], ${Xt}), slate = uPig[6];
  vec3 pig = hp < .34 ? black : (hp < .74 ? mix(black, slate, .5) : mix(slate, black, .1));
  vec3 mean = mix(black, slate, ${Gt});
  float lodB = 1. - smoothstep(.12, .45, fwb), lodC = 1. - smoothstep(.08, .3, fwq);
  vec3 col = mix(mean, pig, lodB * lodC);
  float rim = max(sl(min(bf, 1. - bf) / fwb, 1.4) * lodB, sl(eCell / fwe, 1.7)) * lodC;
  rim = max(rim, sl(abs(sd) / fsd, 2.) * lodC);
  // the pouch's two steps of shade, the style's own (the lit pigment; the shadow pigment 35 % toward navy; a hairline where
  // they meet). No light falls on a cloud's base from above, so the key is laid level on its own bearing: the half of each
  // pouch that leans toward the key is lit, the half that leans away and the level base between pouches are in shadow. Cells
  // too small in the frame to be split take the mean of the two. The shadow step is as deep as the look's sky allows (uShade,
  // worked out where the slab is built): whole under a sky of twice the cloud's light or more, none under a sky no lighter
  // than the cloud (the night). The hairline where the two steps meet is drawn as strongly as the step is deep: by night
  // there are no two steps and no line between them (it lay black across every pouch), and a pouch's turn is told by its
  // own outline against its neighbours.
  float rp = min(R, SC * ${It});
  float tn = 2. * ${wt.toFixed(4)} * dl / max(rp, 1e-3);            // the paraboloid's slope at this distance from the heart
  vec2 key = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
  float ndl = tn / sqrt(1. + tn * tn) * dot(-r1, key) / max(sqrt(d1), 1e-4);
  float fwn = max(fwidth(ndl), 1e-4);
  // a cap ends at its own cell's wall. It is cut here, after the last derivative: past a discard a derivative is not defined
  // on every graphics card. The .5 m is a choice: one heart worked out twice (here and in POUCH_VERT) differs by rounding
  // only, and two hearts are never nearer than 0.3 of a cell (13.8 m)
#ifdef POUCH
  if (abs(cen.x - vCen.x) + abs(cen.y - vCen.y) > .5) discard;
#endif
  float on = 1. - smoothstep(-.7, .7, (dl - rp) / fsd);
  float lit = mix(.5, smoothstep(-fwn, fwn, ndl), lodC) * on;
  col = mix(mix(col, uPig[0], .35 * uShade) * mix(1., .72, uShade), col, lit);
  rim = max(rim, sl(abs(ndl) / fwn, 1.4) * .85 * on * lodC * uShade);
  float alpha = 1. - smoothstep(-.7, .7, sd / fsd);
#ifdef POUCH
  alpha = 1.;
#else
  // the slab is whole inside its outline: where the plan (slabWhole) says the slab stands between stones, the base is drawn
  // there as it is drawn everywhere (its bands, its cells' walls, the shadow step of the level base), and where that base
  // ends against the open sky it has the hairline every stone's edge has. The plan is read between its texels (1 m): wh
  // is how far inside the slab's side of that line the place lies, in metres (8 at most); whp the same in pixels (fwq
  // is a pixel's width in cells), or in spans of 4 m where a pixel holds more than that
  float wh = (textureLod(uWhole, (xz - uWholeBox.xy) * uWholeBox.zw, 0.).r * 255. - 128.) / ${Ot}.;
  float whp = wh / clamp(fwq * SC, 1e-4, 4.);
  alpha = max(alpha, clamp(whp + .5, 0., 1.));
  rim = max(rim, sl(abs(whp), 2.) * step(0., sd) * lodC);
#endif
  col = mix(col, uPig[5] * .45, rim * .9) * uDark;
  // the far underside melts, by the haze law of every shader here. Under a sky lighter than the cloud (uShade 1) it melts
  // toward its own mean pigment raised to the paper's weight (the luminance of linear red, green and blue): it pales with
  // distance as the paper haze pales all things and stays slate and lamp black; the paper's cream laid over lamp black is
  // what showed as brown. Under a sky no lighter than the cloud (the night, uShade 0) it melts toward the paper itself,
  // as every other thing does there: the night's paper is navy, and the cloud's own mean stood less blue than all around
  // it. Between the two, by uShade.
  vec3 lw = vec3(.2126, .7152, .0722);
  col = mix(col, mix(mean * (dot(uHazeCol, lw) / max(dot(mean, lw), 1e-4)), uHazeCol, 1. - uShade), ebHaze(length(vW - cameraPosition)) * .85);
  gl_FragColor = vec4(col, alpha);
}
`,ma=`
attribute vec3 aBase;
attribute float aRnd;
uniform vec3 uBox;
uniform vec3 uVel;
uniform vec3 uCen;
uniform float uTime;
uniform float uLen;
uniform float uWid;
uniform float uPxAng;
uniform float uAmt;
uniform vec2 uZEdge;
uniform vec2 uNearFade;
varying vec2 vUv;
varying float vA;
varying float vDist;
void main(){
  vec3 p = aBase * uBox + uVel * uTime * (.8 + .4 * aRnd);
  vec3 rel = mod(p - uCen, uBox) - .5 * uBox;
  vec3 w = uCen + rel;
  vec3 dn = uVel / max(length(uVel), 1e-4);
  vec3 P = w + dn * (uv.y - .5) * uLen * (.7 + .6 * aRnd);
  vec3 tc = P - cameraPosition;
  float dist = length(tc);
  vec3 sd = cross(dn, tc); sd /= max(length(sd), 1e-4);
  float wd = max(uWid, dist * uPxAng * 1.6);
  P += sd * (uv.x - .5) * wd;
  vUv = uv; vDist = dist;
  float box = 1. - smoothstep(.36, .5, max(abs(rel.x) / uBox.x, abs(rel.z) / uBox.z));
  vA = uAmt * smoothstep(uZEdge.x, uZEdge.x + uZEdge.y, w.z) * smoothstep(uNearFade.x, uNearFade.y, dist) * box * clamp(uWid / wd, .3, 1.) * step(.2, P.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(P, 1.);
}
`,ga=`
precision highp float;
${He}
uniform vec3 uTint;
varying vec2 vUv;
varying float vA;
varying float vDist;
void main(){
  float a = vA * (1. - smoothstep(.25, .5, abs(vUv.x - .5))) * smoothstep(0., .3, vUv.y) * (1. - smoothstep(.75, 1., vUv.y));
  vec3 col = mix(uPig[3] * uTint, uHazeCol, ebHaze(vDist) * .6);
  gl_FragColor = vec4(col, a);
}
`,va=`
attribute vec3 aPos;
attribute vec4 aS;
varying vec2 vUv;
varying vec4 vS;
varying float vDist;
void main(){
  vec3 P;
  if (aS.z < .5) {
    vec3 tc = cameraPosition - aPos; tc.y = 0.;
    vec3 rt = normalize(vec3(tc.z, 0., -tc.x) + vec3(1e-4, 0., 0.));
    P = aPos + rt * (uv.x - .5) * aS.x * 1.5 + vec3(0., uv.y * aS.x, 0.);
  } else {
    P = aPos + vec3((uv.x - .5) * aS.x, 0., (uv.y - .5) * aS.x);
  }
  vUv = uv; vS = aS;
  vec4 mv = viewMatrix * vec4(P, 1.);
  vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`,wa=`
precision highp float;
${He}
uniform vec3 uTint;
varying vec2 vUv;
varying vec4 vS;
varying float vDist;
void main(){
  float ph = vS.y;
  float sdf = 1e3;
  if (vS.z < .5) {
    // nine jets and their beads rising from the foot of the card, then falling back
    vec2 p = vec2((vUv.x - .5) * 1.5, vUv.y);
    float grow = sin(clamp(ph, 0., 1.) * 1.5708);
    float fall = 1. - smoothstep(1., 1.7, ph);
    for (int k = 0; k < 9; k++) {
      float fk = float(k);
      vec2 h = ebHash2(vec2(fk * 3.7 + vS.w * 17., vS.w * 5.3 + 1.1));
      float ang = (fk - 4.) * .2 + (h.x - .5) * .16;
      vec2 dir = vec2(sin(ang), cos(ang));
      float len = (.42 + .5 * h.y) * grow * mix(.45, 1., fall);
      vec2 b = vec2((fk - 4.) * .035, .0);
      vec2 pa = p - b; float s = clamp(dot(pa, dir) / max(len, 1e-3), 0., 1.);
      sdf = min(sdf, length(pa - dir * len * s) - mix(.06, .014, s) * fall);
      vec2 tip = b + dir * len;
      sdf = min(sdf, length(p - tip - dir * .07) - .034 * fall);
      sdf = min(sdf, length(p - tip - dir * (.16 + .1 * h.x) * grow) - .022 * fall);
    }
    sdf = min(sdf, length((p - vec2(0., .02)) * vec2(1., 3.2)) - .2 * grow * fall);
  } else {
    float r = length(vUv - .5) * 2.;
    float R = .92 * sqrt(clamp(ph / 2.4, 0., 1.));
    float wd = mix(.16, .03, clamp(ph / 2.4, 0., 1.)) * (1. - smoothstep(2., 2.4, ph));
    sdf = abs(r - R) - .5 * wd;
    sdf = wd < .004 ? 1. : sdf;
  }
  float fw = max(fwidth(sdf), 1e-5);
  float a = (1. - smoothstep(-.6, .6, sdf / fw)) * step(.001, ph);
  float rim = 1. - smoothstep(.8, 2., -sdf / fw);
  vec3 col = mix(uPig[3], uPig[5], rim * .85) * uTint;
  col = mix(col, uHazeCol, ebHaze(vDist));
  gl_FragColor = vec4(col, a);
}
`,Zt=`
attribute float aPart;
attribute vec2 aUV;
attribute float aSeed;
uniform float uPxAng;
varying float vPart;
varying vec2 vUV;
`,Kt=`
uniform float uLantern;
varying float vPart;
varying vec2 vUV;
`,xa=`
  vPart = aPart; vUV = aUV;
  float bph = aSeed * 6.283;
  if (aPart > .5 && aPart < 1.5) {
    float su = sin(3.1416 * aUV.x), sv = sin(3.1416 * clamp(aUV.y * .9 + .08, 0., 1.));
    float amp = .95 + .16 * sin(uTime * 1.3 + bph + aUV.y * 3.) + .045 * sin(uTime * 6.5 + aUV.x * 9. + bph);
    vec3 lee = on * (on.x < 0. ? -1. : 1.);
    op += lee * su * sv * amp;
    on = normalize(lee - amp * (vec3(0., 0., 1.) * cos(3.1416 * aUV.x) * sv * .42 + vec3(0., 1., 0.) * su * cos(3.1416 * clamp(aUV.y * .9 + .08, 0., 1.)) * .3));
  } else if (aPart > 5.5 && aPart < 6.5) {
    op.x += aUV.x * .55 * sin(uTime * 6. - aUV.x * 5. + bph);
    op.y += aUV.x * .16 * sin(uTime * 4.3 - aUV.x * 4. + bph);
  } else if (aPart > 2.5 && aPart < 3.5) {
    float hk = sin(uTime * 1.7 + aUV.x * 6.283 + bph);
    op.x += hk * .3 * aUV.y; op.y -= abs(hk) * .07 * aUV.y;
  } else if (aPart > 4.5 && aPart < 5.5) {
    vec4 fw = mm * vec4(position, 1.);
    op.y += ebSwell(fw.xz) + position.y - fw.y;
    on = (normalize(cameraPosition - fw.xyz) + vec3(0., 1.5, 0.)) * mat3(mm);      // foam and cork: lit from above, never a rim
  } else if (aPart > 3.5 && aPart < 4.5) {
    vec4 rw = mm * vec4(position, 1.);
    op += on * max(length(rw.xyz - cameraPosition) * uPxAng * .85 - .03, 0.);
  }
`,ba=`
  {
    float st = vUV.y * 7.;
    float fst = max(fwidth(st), 1e-5);
    float bu = vUV.x * 11. + floor(st) * .37;
    float fbu = max(fwidth(bu), 1e-5);
    float cl = vUV.x * 9.;
    float fcl = max(fwidth(cl), 1e-5);
    float fvy = max(fwidth(vUV.y), 1e-5);
    float pk = op.x / .28;
    float fpk = max(fwidth(pk), 1e-5);
    if (vPart < .5) {
      float fr = fract(st);
      rim = max(rim, sRim(min(fr, 1. - fr) / fst, 1.3) * (1. - smoothstep(.2, .5, fst)) * .9);
      rim = max(rim, sRim((.5 - abs(fract(bu) - .5)) / fbu, 1.1) * .55 * (1. - smoothstep(.1, .3, fbu)));
      pig = vUV.y > .857 ? uPig[3] : (vUV.y > .714 ? mix(uPig[5], uPig[6], .3) : pig);
      pig = mix(pig, mix(uPig[5], uPig[2], .35), step(vUV.y, .2) * .8);
    } else if (vPart < 1.5) {
      float ci = floor(cl), cf = cl - ci;
      float hc = ebHash1(vec2(ci, 3.3));
      pig *= cf < .13 ? .74 : (hc > .7 ? 1.1 : (hc < .2 ? .88 : 1.));
      rim = max(rim, sRim(min(cf, 1. - cf) / fcl, 1.1) * .5 * (1. - smoothstep(.15, .4, fcl)));
      float reef = min(abs(vUV.y - .2), abs(vUV.y - .36));
      float dash = step(abs(fract(cl * 2. + .25) - .5), .2);
      rim = max(rim, (1. - smoothstep(.007, .007 + fvy, reef)) * dash * (1. - smoothstep(.01, .03, fvy)));
      float bolt = min(min(vUV.x, 1. - vUV.x) * 3., min(vUV.y, 1. - vUV.y));
      pig *= bolt < .022 ? .7 : 1.;
    } else if (vPart > 6.5 && vPart < 7.5) {
      rim = max(rim, sRim((.5 - abs(fract(pk) - .5)) / fpk, 1.1) * .5 * (1. - smoothstep(.15, .4, fpk)));
    } else if (vPart > 7.5) {
      pig = mix(pig, uPig[4] * 5., uLantern);
    }
  }
`,ya=`
  vPart = aPart; vUV = aUV;
  float sph = aSeed * 6.283;
  float sst = aUV.x;
  op.x += sin(uTime * 2.094 - sst * 5.2 + sph) * (.07 + .95 * sst * sst);
  if (aPart > 1.5) op.x += aUV.y * aUV.y * .55 * sin(uTime * 1.4 + sph * 1.7 + sst * 4.);
  if (sst < .12) op.xy *= 1. + .1 * sin(uTime * .9 + sph) * (1. - sst / .12);
  { vec4 sw = mm * vec4(op, 1.); vSub = sw.y - ebSwell(sw.xz); }
`,za=Zt+`varying float vSub;
`,Ma=Kt+`varying float vSub;
`,Aa=`
  {
    float fsx = max(fwidth(vUV.x), 1e-5);
    float mott = 1., arch = 0.;
    if (vPart < .5) {
      float gs = (vUV.x - .12) / .03;
      float gi = floor(gs), gf = gs - gi;
      float gon = step(0., gs) * step(gs, 5.);
      float fg = fsx / .03;
      arch = gon * step(.3, gf) * step(gf, .78);
      pig = mix(pig, uPig[3], arch);
      rim = max(rim, gon * max(sRim(abs(gf - .3) / fg, 1.3), sRim(abs(gf - .78) / fg, 1.3)));
      mott = 1. - gon;
      pig = mix(pig, uPig[3], step(vUV.x, .014));
    } else if (vPart < 1.5) {
      float gs = vUV.x * 5.; float gf = fract(gs);
      float fg = fsx * 5.;
      arch = step(.42, gf) * step(gf, .82);
      pig = mix(mix(uPig[5], uPig[0], .5), uPig[3], arch);
      rim = max(rim, max(sRim(abs(gf - .42) / fg, 1.3), sRim(abs(gf - .82) / fg, 1.3)));
      mott = 0.;
    } else {
      mott = .45;
    }
    // the back is spotted stone-marbling of its own: dark and pale stones, two sizes (the shared spots are cream / jade)
    spotAmt = 0.;
    vec3 dk = mix(uPig[6], uPig[5], .66), pl = mix(uPig[6], uPig[3], .6);
    float onA = step(hs.y, .72 * mott), onB = step(ht.y, .5 * mott);
    float lA = 1. - smoothstep(.12, .4, fwS / uSpotCell), lB = 1. - smoothstep(.12, .4, fwS / (uSpotCell * .31));
    pig = mix(pig, hs.z < .3 ? pl : dk, onA * (1. - smoothstep(-.5, .5, sdA / fwS)) * mix(.5, 1., lA));
    rim = max(rim, onA * lA * sRim(abs(sdA) / fwS, 1.2) * .6);
    pig = mix(pig, ht.z < .35 ? pl : dk, onB * (1. - smoothstep(-.5, .5, sdB / fwS)) * lB);
    // below the waterline the body is seen through the lens: darker and bluer, with a hairline where the skin
    // breaks the surface, so only snout tip, dorsal and upper tail lobe are clean pigment
    float sb = vSub + .05;
    float fsb = max(fwidth(sb), 1e-5);
    float under = 1. - smoothstep(-fsb, fsb, sb);
    pig = mix(pig, mix(uPig[7], uPig[1], .34), under * mix(.7, .28, arch));
    rim = max(rim, sRim(abs(sb) / fsb, 1.6) * .9);
  }
`,Sa=`
attribute float aPart;
attribute vec4 aA;
attribute vec4 aB;
uniform float uPeel;
`,Pa=`
  {
    float t = uTime, ph = aB.x, mode = aB.z;
    float hsh = fract(ph * 7.31);
    vec3 bp = aA.xyz; vec2 fw2 = vec2(-.6, -.8); float pitch = 0., flapK = 1., fold = 0., flapHz = 7.;
    if (mode < .5) {
      float Rr = aA.w * (1. + .16 * sin(t * .21 + ph * 3.)) + uPeel * 18. * step(.55, hsh);
      float th = ph + aB.y * t;
      bp += vec3(cos(th) * Rr, 3.5 * sin(t * .37 + ph * 5.) - uPeel * 16. * step(.55, hsh), sin(th) * Rr * .8);
      fw2 = normalize(vec2(-sin(th), cos(th) * .8)) * (aB.y < 0. ? -1. : 1.);
      flapK = smoothstep(-.3, .5, sin(t * .45 + ph * 4.));
      flapHz = 5.5;
    } else if (mode < 1.5) {
      float T = 8. + 7. * hsh;
      float tau = fract(t / T + ph);
      float dive = smoothstep(.78, .875, tau) * (1. - smoothstep(.885, .99, tau));
      bp.x += aA.w * cos(t * .7 + ph * 6.); bp.z += aA.w * sin(t * .53 + ph * 4.);
      bp.y = mix(aA.y + .8 * sin(t * 1.1 + ph * 9.), .4, dive);
      pitch = -1.25 * smoothstep(.78, .83, tau) * (1. - smoothstep(.86, .9, tau)) + .5 * smoothstep(.89, .93, tau) * (1. - smoothstep(.95, 1., tau));
      fold = smoothstep(.79, .83, tau) * (1. - smoothstep(.87, .9, tau));
      fw2 = normalize(vec2(-.6 + .5 * sin(ph * 30.), -.8));
      flapHz = 9.;
    } else {
      pitch = aB.y; fold = clamp(-aB.y, 0., 1.); fw2 = normalize(vec2(-.5, -.85)); flapHz = 9.;
    }
    float wing = abs(aPart);
    vec3 lp = op, ln = on;
    float fa = sin(t * flapHz + ph * 9.) * flapK * (1. - fold);
    lp.y += wing * (.36 * fa + .05) - wing * wing * .14 * (1. - fa);
    lp.x *= mix(1., .3, fold * step(.01, wing));
    lp.z += fold * wing * .2;
    float cp = cos(pitch), sp = sin(pitch);
    lp = vec3(lp.x, lp.y * cp + lp.z * sp, -lp.y * sp + lp.z * cp);
    ln = vec3(ln.x, ln.y * cp + ln.z * sp, -ln.y * sp + ln.z * cp);
    vec3 fwd = vec3(fw2.x, 0., fw2.y), rgt = vec3(-fw2.y, 0., fw2.x);
    op = bp + (rgt * lp.x + vec3(0., 1., 0.) * lp.y - fwd * lp.z) * aB.w;
    on = rgt * ln.x + vec3(0., 1., 0.) * ln.y - fwd * ln.z;
  }
`;function bt(){const n=[],a=[],B=[],v=[],k=[],b={v(g,c,U,y,p,R=0,I=0){return n.push(g,c,U),a.push(y.r,y.g,y.b),B.push(p),v.push(R,I),n.length/3-1},quad(g,c,U,y){k.push(g,c,U,g,U,y)},tri(g,c,U){k.push(g,c,U)},grid(g,c,U,y,p=!1){const R=n.length/3;for(let w=0;w<c;w++)for(let m=0;m<g;m++){const i=U(m,w);b.v(i[0],i[1],i[2],i[3],y,i[4]??0,i[5]??0)}const I=p?g:g-1;for(let w=0;w<c-1;w++)for(let m=0;m<I;m++){const i=(m+1)%g;b.quad(R+w*g+m,R+w*g+i,R+(w+1)*g+i,R+(w+1)*g+m)}},tube(g,c,U,y,p=0,R=0,I=1){const w=new l.Vector3,m=new l.Vector3,i=new l.Vector3,P=new l.Vector3,C=g.length;b.grid(c,C,(N,Y)=>{const X=g[Y],L=g[Math.max(Y-1,0)],h=g[Math.min(Y+1,C-1)];m.set(h[0]-L[0],h[1]-L[1],h[2]-L[2]).normalize(),w.set(0,1,0),Math.abs(m.y)>.9&&w.set(1,0,0),i.crossVectors(m,w).normalize(),P.crossVectors(m,i);const u=N/c*Math.PI*2,x=Math.cos(u)*X[3],M=Math.sin(u)*X[3],z=typeof U=="function"?U(N,Y,u):U;return[X[0]+i.x*x+P.x*M,X[1]+i.y*x+P.y*M,X[2]+i.z*x+P.z*M,z,p,G(R,I,Y/(C-1))]},y,!0)},build(){const g=new l.BufferGeometry;return g.setAttribute("position",new l.Float32BufferAttribute(n,3)),g.setAttribute("color",new l.Float32BufferAttribute(a,3)),g.setAttribute("aPart",new l.Float32BufferAttribute(B,1)),g.setAttribute("aUV",new l.Float32BufferAttribute(v,2)),g.setIndex(k),g.computeVertexNormals(),g}};return b}function Ca(n){const a=bt(),B=n.black.clone().lerp(n.navy,.3),v=n.slate.clone().lerp(n.black,.45),k=n.slate.clone().lerp(n.cream,.25),b=n.cream.clone().lerp(n.slate,.12),g=n.cream.clone().lerp(n.slate,.2),c=16,U=7,y=7,p=h=>2.25*Math.pow(Math.max(1-Math.pow(Math.abs(h),h<0?2.3:3),0),.55),R=h=>1.15+.7*h*h+(h<0?.3*h*h:0),I=h=>-.75+.5*Math.pow(Math.abs(h),4);for(const h of[1,-1]){a.grid(c+1,U+1,(M,z)=>{const S=h>0?M:c-M,D=-1+2*S/c,E=z/U,O=p(D);return[h*O*Math.pow(E,.48),G(I(D),R(D),Math.pow(E,1.35)),D*y,B,S/c,E]},0);const u=[],x=[];for(let M=0;M<=c;M++){const z=-1+2*M/c;u.push([h*p(z),R(z)+.03,z*y,.07]),x.push([h*p(z)*Math.pow(.6,.48)*1.02,G(I(z),R(z),Math.pow(.6,1.35)),z*y,.05])}a.tube(u,4,n.cream,2),a.tube(x,4,v,2)}a.tube([[0,-.3,-y+.25,.1],[0,1.2,-y-.02,.1],[0,2.75,-y-.12,.08]],5,v,2),a.tube([[0,-.3,y-.25,.1],[0,1.2,y+.02,.1],[0,2.3,y+.08,.08]],5,v,2),a.grid(2,2,(h,u)=>[0,-.8+u*2.2,y+.05+h*.75*(1-u*.4),v],2),a.grid(2,c+1,(h,u)=>{const x=-1+2*u/c;return[(h?1:-1)*p(x)*.9,R(x)-.5,x*y*.97,v]},7);const w=.72,m=(h,u,x,M,z,S,D,E=2)=>{const O=[[h,z],[u,z],[u,S],[h,S]];a.grid(4,2,(te,j)=>[O[te][0],j?M:x,O[te][1],D],E,!0),a.grid(2,2,(te,j)=>[te?u:h,M,j?z:S,D],E)};m(-.95,.95,w,w+.42,-1.3,1,k),m(-.5,.5,w,w+1.25,5,6,v),a.grid(7,4,(h,u)=>{const x=h/7*Math.PI*2,M=[1.25,1.05,.6,.02][u],z=[0,.3,.55,.62][u];return[.2+Math.cos(x)*M*.9,w+z,2.6+Math.sin(x)*M*1.2,u%2?g:n.slate]},2,!0),a.tube([[0,w,-4.4,.28],[0,w+.7,-4.4,.2],[0,w+.78,-4.4,.3]],6,v,2);const i=-2.6,P=4.3;a.tube([[0,w,i,.18],[0,6,i-.1,.15],[0,11.9,i-.2,.08]],6,k,2),a.tube([[0,w,P,.14],[0,8.9,P+.2,.07]],6,k,2);const C=(h,u,x,M,z,S,D)=>{const E=Math.sin(u),O=Math.cos(u),te=(re,$)=>[.1+(re-x[0])*E,$,x[0]+(re-x[0])*O];a.grid(9,9,(re,$)=>{const Q=re/8,me=$/8,xe=G(G(x[0],M[0],Q),G(z[0],S[0],Q),me),fe=G(G(x[1],M[1],Q),G(z[1],S[1],Q),me)-.25*Math.sin(Math.PI*Q)*(1-me),f=te(xe,fe);return[f[0],f[1],f[2],n.ochre,Q,me]},1);const j=te(z[0]-.4,z[1]-.2),J=te(S[0]+.3,S[1]+.17);return a.tube([[j[0],j[1],j[2],.075],[J[0],J[1],J[2],.06]],5,k,2),{tack:te(x[0],x[1]),clew:te(M[0],M[1]),peak:J}},N=C(i,.32,[-6.5,1.75],[1.5,1.95],[-4.9,9.3],[2,12.7]),Y=C(P,.3,[2.9,1.95],[8.2,2.35],[3.3,7],[7.6,10]);a.grid(6,2,(h,u)=>{const x=h/5;return[.05+x*.5,12.1+(u?.24:-.24)*(1-x),i-.2+x*1.7,n.ochre,x,u]},6);const X=(h,u)=>a.tube([[h[0],h[1],h[2],.03],[u[0],u[1],u[2],.03]],3,n.black,4);X([0,11.6,i-.2],[0,2.7,-y-.1]),X([0,11.4,i-.2],[2.1,1.25,-1.2]),X([0,11.4,i-.2],[-2.1,1.25,-1.2]),X([0,8.7,P+.2],[0,2.3,y]),X([0,8.5,P+.2],[1.9,1.3,5.3]),X([0,8.5,P+.2],[-1.9,1.3,5.3]),X(N.clew,[1.9,1.3,3.2]),X(Y.clew,[.4,2.2,y]),X(N.tack,[0,2.6,-y]);const L=(h,u,x)=>{const M=x/3,z=D=>de(D/1.75,0,1),S=(D,E,O)=>a.grid(E,D.length,(te,j)=>{const J=D[j],re=te/E*Math.PI*2;return[h+J[0]+Math.cos(re)*J[3],w+J[1],u+J[2]+Math.sin(re)*J[3]*(J[4]??1),typeof O=="function"?O(j):O,M,z(J[1])]},3,!0);S([[-.02,0,-.11,.1],[-.02,.85,-.11,.11]],5,n.slate.clone().lerp(n.black,.5)),S([[-.02,0,.11,.1],[-.02,.85,.11,.11]],5,n.slate.clone().lerp(n.black,.5)),S([[0,.62,0,.33,1.15],[.03,1,0,.26,1.2],[.08,1.42,0,.21,1.35],[.12,1.52,0,.08]],7,b),S([[.14,1.5,0,.07],[.16,1.58,0,.115],[.17,1.7,0,.11],[.17,1.76,0,.03]],6,D=>D>=2?n.black:n.cream),S([[.15,1.71,0,.21,1.1],[.13,1.735,0,.02]],7,n.black);for(const D of[1,-1])a.tube([[h+.1,w+1.4,u+D*.25,.075],[h+.42,w+1.18,u+D*.2,.065],[h+.78,w+.98,u+D*.1,.055]],4,b,3,M,z(1.4),z(1))};L(.95,.6,0),L(1.05,2.4,1),L(.8,4.2,2),a.grid(2,6,(h,u)=>[2.05+h*.15+u*.02,1.3-u*.28,.2+h*4.4,u%2?g:n.slate],2);for(let h=0;h<16;h++){const u=5.5+h*2.1,x=2.5+.006*(u-5.5)*(u-5.5),M=.3,z=a.v(x,.12+M*.7,u,n.cream,5),S=a.v(x,.12-M*.6,u,g,5),D=[];for(let E=0;E<5;E++){const O=E/5*Math.PI*2;D.push(a.v(x+Math.cos(O)*M,.12,u+Math.sin(O)*M,h%4===0?n.slate:g,5))}for(let E=0;E<5;E++)a.tri(z,D[(E+1)%5],D[E]),a.tri(S,D[E],D[(E+1)%5])}for(const h of[1,-1])a.grid(2,2*c+1,(u,x)=>{const M=-1+x/c,z=p(M);return[h*(z+(u?.3+.55*x/(2*c)+(x%2?.3:0):-.2)),.2,M*y*1.02,u&&x%4===0?g:n.cream]},5);a.grid(3,10,(h,u)=>{const x=u*1.6,M=(1-u/9)*(1.1+.1*x)+(u%2?.35:0);return[(h-1)*M,.18,y+x,h===1&&u%2?g:n.cream]},5);{const x=a.v(0,12.26,i-.2,n.slate,8),M=a.v(0,12-.26,i-.2,n.slate,8),z=[];for(let S=0;S<5;S++){const D=S/5*Math.PI*2;z.push(a.v(Math.cos(D)*.26,12,i-.2+Math.sin(D)*.26,n.slate,8))}for(let S=0;S<5;S++)a.tri(x,z[(S+1)%5],z[S]),a.tri(M,z[S],z[(S+1)%5])}return a.build()}function ka(n){const a=bt(),B=9,v=w=>(w-.5)*B,k=n.slate.clone().lerp(n.black,.18),b=n.slate.clone().lerp(n.cream,.4),g=n.slate.clone().lerp(n.black,.25),c=[[0,.56],[.08,.72],[.25,.86],[.45,.8],[.7,.5],[.9,.2],[1,.13]],U=w=>{for(let m=0;m<c.length-1;m++){const i=c[m],P=c[m+1];if(w<=P[0])return G(i[1],P[1],ne(0,1,(w-i[0])/(P[0]-i[0])))}return .13},y=22,p=12,R=(w,m)=>w<.1?-(1-w/.1)*.45*Math.max(m,0):0;a.grid(p,y+1,(w,m)=>{const i=m/y,P=w/p*Math.PI*2,C=U(i),N=Math.sin(P);return[Math.cos(P)*C,N*C*.92,v(i)+R(i,N),N>.25?k:N>-.35?k.clone().lerp(b,.5):b,i,w/p]},0,!0),a.grid(p,2,(w,m)=>{const i=w/p*Math.PI*2,P=m?.5:.56;return[Math.cos(i)*P,Math.sin(i)*P*.92,v(0)+m*.02+R(0,Math.sin(i)),n.cream,0,0]},0,!0),a.grid(p,6,(w,m)=>{const i=m/5,P=-w/p*Math.PI*2,C=G(.5,.07,Math.pow(i,.8));return[Math.cos(P)*C,Math.sin(P)*C*.92,v(.002+i*.27),n.black,i,0]},1,!0);{const w=[[.42,.27,v(.06),.42],[.46,.21,v(0)-.2,.31],[.5,.14,v(0)-.6,.17],[.54,.06,v(0)-.88,.06],[.55,.01,v(0)-.98,.01]];a.grid(8,w.length,(m,i)=>{const P=m/8*Math.PI*2,C=w[i];return[Math.cos(P)*C[3],C[0]+Math.sin(P)*C[1],C[2],Math.sin(P)>-.3?k:b,.07,m/8]},0,!0)}const I=(w,m,i,P,C,N=5,Y="x")=>{for(const X of P>0?[1,-1]:[1])a.grid(N,N,(L,h)=>{const u=L/(N-1),x=h/(N-1),M=Math.sin(Math.PI*u)*(1-x)*P*X,z=G(w[0],m[0],u),S=G(w[1],m[1],u),D=G(w[2],m[2],u),E=Math.pow(x,.85),O=[G(z,i[0],E),G(S,i[1],E),G(D,i[2],E)+.25*Math.sin(Math.PI*x)*(1-u)];return Y==="x"?O[0]+=M:O[1]+=M,[O[0],O[1],O[2],x>.82?g.clone().lerp(n.black,.4):g,C,x]},2)};I([0,.6,v(.39)],[0,.62,v(.57)],[0,2.6,v(.6)],.1,.5),I([0,.34,v(.75)],[0,.3,v(.82)],[0,.95,v(.845)],.05,.8,3);for(const w of[1,-1])I([w*.7,-.3,v(.25)],[w*.66,-.34,v(.36)],[w*2.5,-.8,v(.44)],.05,.3,4,"y");return I([0,.14,v(.955)],[0,-.1,v(1)],[0,2,v(1)+1.55],.045,1.08,4),I([0,-.1,v(.96)],[0,.1,v(1)],[0,-.95,v(1)+.95],.04,1.05,3),a.build()}function Ua(n){const a=bt(),B=n.cream,v=n.cream.clone().lerp(n.slate,.72),k=n.black,b=n.cream.clone().lerp(n.slate,.55),g=n.slate.clone().lerp(n.black,.6),c=[[-.25,.006],[-.17,.042],[-.07,.058],[.06,.05],[.18,.018]];a.grid(5,c.length,(U,y)=>{const p=U/5*Math.PI*2,R=c[y];return[Math.cos(p)*R[1],Math.sin(p)*R[1],R[0],y===0||y===1&&Math.sin(p)>.1?k:Math.sin(p)>.3?b:B]},0,!0);{const U=a.v(0,.01,.15,B,0),y=a.v(-.07,.01,.32,B,0),p=a.v(0,.01,.26,B,0),R=a.v(.07,.01,.32,B,0);a.tri(U,y,p),a.tri(U,p,R)}for(const U of[1,-1]){const y=(C,N,Y)=>a.v(U*C,.02,N,Y,U*C/.5),p=y(.03,-.08,b),R=y(.03,.07,b),I=y(.25,-.115,v),w=y(.25,.035,v),m=y(.4,-.06,g),i=y(.4,.04,k),P=y(.5,.045,k);a.quad(p,I,w,R),a.quad(I,m,i,w),a.tri(m,P,i)}return a.build()}function Ba(n){const a=new l.IcosahedronGeometry(1,2),B=a.attributes.position,v=new l.Vector3;for(let k=0;k<B.count;k++){v.fromBufferAttribute(B,k).normalize();const b=1+.22*n.n3(v.x*1.7,v.y*1.7,v.z*1.7)+.1*n.n3(v.x*4,v.y*4+9,v.z*4);B.setXYZ(k,v.x*b,Math.max(v.y*b,-.25)*.6,v.z*b)}return a.deleteAttribute("uv"),a.computeVertexNormals(),a}function Da(){const a=[.6,1],B=[0,-wt,0],v=[];for(const b of a)for(let g=0;g<10;g++){const c=g/10*Math.PI*2;B.push(Math.cos(c)*b,-wt*(1-b*b),Math.sin(c)*b)}for(let b=0;b<10;b++){const g=(b+1)%10;v.push(0,1+g,1+b,1+b,1+g,11+g,1+b,11+g,11+b)}const k=new l.BufferGeometry;return k.setAttribute("position",new l.Float32BufferAttribute(B,3)),k.setIndex(v),k}const K=Math.fround,Oe=n=>K(n-Math.floor(n)),yt=K(33.33);function Ra(n,a){let B=Oe(K(n*K(.1031))),v=Oe(K(a*K(.103))),k=Oe(K(n*K(.0973)));const b=K(K(K(B*K(v+yt))+K(v*K(k+yt)))+K(k*K(B+yt)));return B=K(B+b),v=K(v+b),k=K(k+b),[Oe(K(K(B+v)*k)),Oe(K(K(B+k)*v))]}async function Na(n,a,B){const g=a-105,c=325,U=2200*c,y=xt*xt/4,p=1e9,R=Math.floor(-1040/46+n)-1,I=Math.floor(1160/46+n)+3-R,w=Math.floor(g/46+n)-1,m=Math.floor((g+c)/46+n)+3-w,i=new Float64Array(I*m),P=new Float64Array(I*m),C=new Float64Array(I*m);for(let f=0;f<m;f++)for(let d=0;d<I;d++){const A=Ra(d+R,f+w),q=d+R+.5+.7*(A[0]-.5),W=f+w+.5+.7*(A[1]-.5),Z=(q-n)*46,ge=(W-n)*46,he=a+42*Math.sin(Z*.0105+1.3)+24*Math.sin(Z*.027+.4),ie=Lt(ge-he);i[f*I+d]=q,P[f*I+d]=W,C[f*I+d]=ie*ie}const N=new Uint8Array(U),Y=new Uint8Array(U),X=new Uint8Array(U),L=new Uint8Array(U),h=new Int32Array(U),u=new Float64Array(c),x=new Float64Array(c),M=new Int32Array(c),z=new Float64Array(c+1);let S=0;const D=f=>{const d=(g+f+.5)/46+n,A=Math.floor(d)-w;for(let q=0;q<2200;q++){const W=(-1040+q+.5)/46+n,Z=Math.floor(W)-R;let ge=1e9,he=0;for(let ie=A-1;ie<=A+1;ie++)for(let ue=ie*I+Z-1,tt=ue+3;ue<tt;ue++){const _e=i[ue]-W,We=P[ue]-d,be=_e*_e+We*We;be<ge&&(ge=be,he=C[ue])}N[f*2200+q]=ge<he?0:1}},E=(f,d,A)=>{const q=f*2200;let W=255;for(let Z=q,ge=q+2200;Z<ge;Z++)W=d[Z]===A?0:Math.min(W+1,255),Y[Z]=W;W=255;for(let Z=q+2200-1;Z>=q;Z--)W=d[Z]===A?0:Math.min(W+1,255),W<Y[Z]&&(Y[Z]=W)},O=f=>{for(let A=0;A<c;A++){const q=Y[A*2200+f];u[A]=q===255?p:q*q}let d=0;M[0]=0,z[0]=-p,z[1]=p;for(let A=1;A<c;A++){let q=0;for(;;){const W=M[d];if(q=(u[A]+A*A-(u[W]+W*W))/(2*A-2*W),q<=z[d]&&d>0)d--;else break}d++,M[d]=A,z[d]=q,z[d+1]=p}d=0;for(let A=0;A<c;A++){for(;z[d+1]<A;)d++;const q=M[d];x[A]=(A-q)*(A-q)+u[q]}},te=f=>{O(f);for(let d=0;d<c;d++)X[d*2200+f]=x[d]>=y&&(c-d)*(c-d)>=y?1:0},j=f=>{X[f]===1&&(X[f]=2,h[S++]=f)},J=f=>{for(;S&&f-- >0;){const d=h[--S],A=d%2200;A>0&&j(d-1),A<2199&&j(d+1),d>=2200&&j(d-2200),d<U-2200&&j(d+2200)}},re=f=>{O(f);for(let d=0;d<c;d++)L[d*2200+f]=d===c-1?255:de(Math.round(128+(Math.sqrt(x[d])-xt/2-da)*Ot),0,255)},$=f=>{N[f]===1&&L[f]<128&&(N[f]=3,h[S++]=f)},Q=f=>{for(;S&&f-- >0;){const d=h[--S],A=d%2200;A>0&&$(d-1),A<2199&&$(d+1),d>=2200&&$(d-2200),d<U-2200&&$(d+2200)}},me=f=>{for(let d=f*2200,A=d+2200;d<A;d++)N[d]===1&&L[d]<128&&(L[d]=255)},xe=f=>{for(let d=0;d<2200;d++){const A=f*2200+d;N[A]!==0||L[A]>=128||(d>0&&N[A-1]===1||d<2199&&N[A+1]===1||f>0&&N[A-2200]===1||f<c-1&&N[A+2200]===1)&&(L[A]=128)}},fe=async(f,d,A)=>{for(let q=0;q<f;q++)q%d===0&&await B.yield(),A(q)};await fe(c,8,D),await fe(c,64,f=>E(f,N,0)),await fe(2200,128,te);for(let f=0;f<2200;f++)j(f);for(let f=0;f<c;f++)j(f*2200),j(f*2200+2200-1);for(;S;)await B.yield(),J(3e4);await fe(c,64,f=>E(f,X,2)),await fe(2200,128,re);for(let f=0;f<2200;f++)$(f);for(let f=0;f<c;f++)$(f*2200),$(f*2200+2200-1);for(;S;)await B.yield(),Q(3e4);return await fe(c,64,me),await fe(c,64,xe),{data:L,x0:-1040,z0:g,nx:2200,nz:c}}var Ha={id:"combed-sea",name:"The Combed Sea",category:"ocean",weirdness:.45,media:["air"],async build(n){const{rng:a}=n,B=n.quality?.detail??1,v=n.vary||{hour:"any",rare:!1,density:1,mood:.5},k=de(v.density??1,.7,1.3),b=(e,r,t)=>new l.Vector3(e,r,t),g=new l.Scene,c=a.fork("look"),U=c();let y=U<.26?"squall":U<.52?"golden":U<.64?"night":U<.84?"dawn":"squall";v.hour==="day"?y="squall":v.hour==="golden"?y="golden":v.hour==="night"?y="night":v.hour==="dawn"&&(y="dawn");const p=ca[y],R=!!v.rare,I=!R&&c()<.4,w=b(Math.sin(p.sunAz*Pe)*Math.cos(p.sunEl*Pe),Math.sin(p.sunEl*Pe),-Math.cos(p.sunAz*Pe)*Math.cos(p.sunEl*Pe));g.background=new l.Color(p.paper);const m=await la(n,{palette:p.palette,sunDir:w,hazeColor:p.paper});g.add(m.object);const i=m.uniforms;m.enableLens(!0);{const e=m.object.getObjectByName("ebru-sea"),r=e.geometry.index.array,t=r.length,o=new r.constructor(t);for(let s=0;s<t;s+=3)o[s]=r[t-3-s],o[s+1]=r[t-2-s],o[s+2]=r[t-1-s];e.geometry.setIndex(new l.BufferAttribute(o,1)),m.materials.sea.depthWrite=!1}m.setGlow(p.glow),m.setRain(60,50,p.rain),m.setHighlight(p.hi,new l.Color(p.hiCol[0],p.hiCol[1],p.hiCol[2]));const P=i.uPig.value,C={navy:P[0],turq:P[1],jade:P[2],cream:P[3],ochre:P[4],black:P[5],slate:P[6],still:P[7]},N=new l.Color(p.tint[0],p.tint[1],p.tint[2]);m.materials.rock&&y==="night"&&(m.materials.rock.uniforms.uSpots.value=.26);const Y=m.anchors;await n.yield();const X=Y.flyThrough.map(e=>e.clone());X.unshift(X[0].clone().add(b(Math.sin(24*Pe)*80,0,Math.cos(24*Pe)*80)));const L=ia(X),h=600,u=new Float32Array(h+1),x=new Float32Array(h+1),M=new Float32Array(h+1);{const e=b(0,0,0);for(let r=0;r<=h;r++)L.pointAt(r/h,e),x[r]=e.x,M[r]=e.y,u[r]=e.z}const z=e=>{for(let r=1;r<=h;r++)if(u[r]<=e)return(r-1+(u[r-1]-e)/Math.max(u[r-1]-u[r],1e-6))/h;return 1},S=(e,r)=>{const t=de(e,0,1)*h,o=Math.min(Math.floor(t),h-1),s=t-o;return r.set(G(x[o],x[o+1],s),G(M[o],M[o+1],s),G(u[o],u[o+1],s))},D=46.5,E=e=>1-Math.exp(-Math.pow(e/i.uHaze.value.x,i.uHaze.value.y)),O=(()=>{const e=s=>new l.Color(Math.sqrt(s.r),Math.sqrt(s.g),Math.sqrt(s.b)),r=e(C.navy.clone().lerp(C.navy.clone().lerp(C.turq,.17),.45)),o=e(C.turq).multiplyScalar(.42).add(e(C.jade).multiplyScalar(.3)).add(e(C.cream).multiplyScalar(.28)).lerp(r,.85);return o.setRGB(o.r*o.r,o.g*o.g,o.b*o.b),o.lerp(new l.Color(p.paper),E(3200))})(),te=new l.Color(p.paper),j={uPig:i.uPig,uHazeCol:i.uHazeCol,uHaze:i.uHaze,uTime:i.uTime,uPaper:{value:te},uZen:{value:te.clone().lerp(y==="night"?new l.Color("#05060d"):C.slate,p.zenith)},uVein:{value:new l.Color(p.vein)},uSeaFar:{value:O},uStars:{value:p.stars},uSeedK:{value:c()*6.28}};await n.yield();const J=new l.Mesh(new l.SphereGeometry(3600,48,24),new l.ShaderMaterial({uniforms:j,vertexShader:fa,fragmentShader:ha,side:l.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));J.renderOrder=-10,J.frustumCulled=!1,J.name="paper-sky",g.add(J);const re=-46;let $=null,Q=null;const me=[];if(p.squall>0){const e=_=>.2126*_.r+.7152*_.g+.0722*_.b,r=de(e(te)/e(C.black.clone().lerp(C.navy,Xt).lerp(C.slate,Gt).multiplyScalar(p.slabDark))-1,0,1);$={uPig:i.uPig,uHazeCol:i.uHazeCol,uHaze:i.uHaze,uTime:i.uTime,uEdge:{value:re},uSeedS:{value:Math.floor(c()*40)+.31},uDark:{value:p.slabDark},uShade:{value:r},uDrift:{value:0},uSunDir:i.uSunDir};{const _=await Na($.uSeedS.value,re,n),oe=new l.DataTexture(_.data,_.nx,_.nz,l.RedFormat,l.UnsignedByteType);oe.magFilter=oe.minFilter=l.LinearFilter,oe.needsUpdate=!0,$.uWhole={value:oe},$.uWholeBox={value:new l.Vector4(_.x0,_.z0,1/_.nx,1/_.nz)}}const t=new l.PlaneGeometry(2200,1500,1,1).rotateX(Math.PI/2),o=new l.Mesh(t,new l.ShaderMaterial({uniforms:$,vertexShader:ua,fragmentShader:Wt,side:l.DoubleSide,transparent:!0,depthWrite:!1,fog:!1}));o.position.set(60,130,610),o.renderOrder=-5,o.frustumCulled=!1,o.name="squall-slab",g.add(o);const s=[];{const _=$.uSeedS.value,oe=Math.ceil(-1040/46+_)+1,se=Math.floor(512/46+_),gt=Math.floor(-158/46+_),Xe=Math.floor(704/46+_);for(let Ge=gt;Ge<=Xe;Ge++)for(let Le=oe;Le<=se;Le++)s.push(Le,Ge)}const V=new l.InstancedBufferGeometry;{const _=Da();V.index=_.index,V.setAttribute("position",_.attributes.position)}V.setAttribute("aCell",new l.InstancedBufferAttribute(new Float32Array(s),2)),V.instanceCount=s.length/2;const T=new l.Mesh(V,new l.ShaderMaterial({uniforms:{...$},defines:{POUCH:1},vertexShader:pa,fragmentShader:Wt,side:l.DoubleSide,fog:!1}));T.frustumCulled=!1,T.name="squall-pouches",g.add(T);const F=Math.round(40*(.6+.4*B)),H=et({shared:i,color:C.slate.clone().lerp(C.cream,y==="golden"?.3:.12).multiply(N),outline:.5,bias:.15});await n.yield(),Q=new l.InstancedMesh(Ba(n.noise),H,F),Q.userData.base=[];for(let _=0;_<F;_++){const oe=G(-900,1e3,(_+c())/F),se=c()*c()*420;Q.userData.base.push({x:oe,z:20+se+42*Math.sin(oe*.0105+1.3),y:150+c()*26+se*.05,sx:70+c()*80,sy:40+c()*38,ry:c()*6.28,ph:c()*6.28})}Q.frustumCulled=!1,Q.name="squall-puffs",g.add(Q);const ce=(_,oe,se,gt,Xe,Ge,Le,Tt)=>{const je=Math.round(_*(.5+.5*B)*p.squall),Be=new l.InstancedBufferGeometry,vt=new l.PlaneGeometry(1,1);Be.index=vt.index,Be.setAttribute("position",vt.attributes.position),Be.setAttribute("uv",vt.attributes.uv);const Je=new Float32Array(je*3),Ht=new Float32Array(je);for(let Te=0;Te<je;Te++)Je[Te*3]=c(),Je[Te*3+1]=c(),Je[Te*3+2]=c(),Ht[Te]=c();Be.setAttribute("aBase",new l.InstancedBufferAttribute(Je,3)),Be.setAttribute("aRnd",new l.InstancedBufferAttribute(Ht,1)),Be.instanceCount=je;const _t={uPig:i.uPig,uHazeCol:i.uHazeCol,uHaze:i.uHaze,uTime:i.uTime,uBox:{value:b(oe[0],oe[1],oe[2])},uVel:{value:b(Xe[0],Xe[1],Xe[2])},uCen:{value:b(0,0,0)},uLen:{value:se},uWid:{value:gt},uPxAng:{value:.0027},uAmt:{value:Ge},uZEdge:{value:new l.Vector2(55,60)},uNearFade:{value:new l.Vector2(Tt[0],Tt[1])},uTint:{value:N}},Qe=new l.Mesh(Be,new l.ShaderMaterial({uniforms:_t,vertexShader:ma,fragmentShader:ga,transparent:!0,depthWrite:!1,side:l.DoubleSide,fog:!1}));Qe.frustumCulled=!1,Qe.renderOrder=3,Qe.name="rain",g.add(Qe),me.push({u:_t,cenY:Le})},ee=p.rainAmt??1;ce(1500,[64,44,64],2.6,.035,[5,-24,3.5],.8*ee,null,[2.2,7]),ce(1100,[620,128,620],30,.5,[5,-24,3.5],.42*ee,64,[50,130])}await n.yield();const xe={value:.0027},fe=.33,f=-9,d=1.15,A=5*D,q=S(fe,b(0,0,0)),W=e=>q.z+A*(fe-e),Z=de(Math.round(7*k),5,9),ge=a.shuffle([[-330,30],[290,150],[-520,-170],[430,-40]]),he=[{hero:!0}],ie=(e,r,t,o,s,V=280)=>{const T=Math.hypot(t,o);he.push({x:e,z:r,dx:t/T,dz:o/T,v:s,wake:V})};{const e=L.start,r=L.startTangent;ie(e.x+r.x*135-r.z*10,e.z+r.z*135+r.x*10,-.5,-.87,2.5,230)}ie(-120,-250,-.94,.34,1.8),ie(140,-230,.8,.6,1.8),ie(-70,-590,-.44,-.9,.6,110),ie(82,-612,.5,-.87,.6,110);for(let e=he.length;e<Z;e++){const r=a.range(0,Math.PI*2),t=ge[e-6];ie(t[0],t[1],Math.cos(r),Math.sin(r),a.range(3,5))}he.length=Math.min(he.length,Z);const ue=150,tt=(e,r)=>e.v*ue*(1-Math.exp(-r/ue))-e.v*ue*(1-Math.exp(-30/ue));await n.yield();const _e=Ca(C);await n.yield();{const e=new Float32Array(Z);for(let r=0;r<Z;r++)e[r]=a();_e.setAttribute("aSeed",new l.InstancedBufferAttribute(e,1))}const We=et({shared:i,vertexColors:!0,side:l.DoubleSide,color:N,outline:.3,vertDecl:Zt,vertMain:xa,fragDecl:Kt,fragPigment:ba,uniforms:{uPxAng:xe,uLantern:{value:p.lantern}}}),be=new l.InstancedMesh(_e,We,Z);be.frustumCulled=!1,be.name="drifters",g.add(be);const le=m.ops,$t=R?[0,1,2,4]:[0,1,2,3,4],zt=[];for(const e of $t)e<Z&&(zt[e]=le.addStroke({x0:0,z0:0,x1:0,z1:1,drag:e===0?24:14,width:e===0?7.5:7,tail:40,order:60+e}));const Ze=new l.Matrix4,ye=new l.Quaternion,ze=new l.Euler,pe=b(1,1,1),Me=b(0,0,0),Yt=he.map(()=>({x:0,z:0,dx:0,dz:-1})),jt=(e,r)=>{for(let t=0;t<Z;t++){const o=he[t],s=Yt[t];if(o.hero)s.x=f,s.z=W(r),s.dx=0,s.dz=-1;else{const ee=tt(o,e);s.x=o.x+o.dx*ee,s.z=o.z+o.dz*ee,s.dx=o.dx,s.dz=o.dz}const V=m.heightAt(s.x+s.dx*5,s.z+s.dz*5,e),T=m.heightAt(s.x-s.dx*5,s.z-s.dz*5,e),F=m.heightAt(s.x-s.dz*2,s.z+s.dx*2,e),H=m.heightAt(s.x+s.dz*2,s.z-s.dx*2,e);Me.set(s.x,(V+T+F+H)*.21,s.z),ze.set((V-T)/10*.8,Math.atan2(-s.dx,-s.dz),(F-H)/4*.5-.07+.02*Math.sin(e*.6+t*2.1),"YXZ"),ye.setFromEuler(ze),pe.setScalar(d),be.setMatrixAt(t,Ze.compose(Me,ye,pe)),pe.setScalar(1);const ce=zt[t];if(ce){const ee=ce.fields;o.hero?(ee.x0=f,ee.z0=W(0)+270,ee.x1=f,ee.z1=s.z-10):(ee.x0=o.x-o.dx*o.wake,ee.z0=o.z-o.dz*o.wake,ee.x1=s.x+s.dx*10,ee.z1=s.z+s.dz*10)}}be.instanceMatrix.needsUpdate=!0};await n.yield();const Mt=1.2*D;let ve=[[-22,1],[-50,-1],[-80,1],[-111,-1],[-136,1],[-161,-1],[-190,1]];const At=de(Math.round(5*k),4,6);R?ve=ve.slice(3):At===6?ve.splice(0,1):At===5?(ve.splice(2,1),ve.splice(0,1)):(ve.splice(4,1),ve.splice(2,1),ve.splice(0,1));const Ae=ve.map(([e,r],t)=>({Z:e,x:r<0?-7:6.5,ui:z(e),size:a.range(.9,1.05),ph:a.range(0,6.28),i:t,zNow:e,ahead:999})),Ke=Y.eddySense||1,ae=R?{c:b(-30,0,-30),R:20,n:11}:null,at=Ae.length+(ae?ae.n:0);await n.yield();const St=ka(C);await n.yield();{const e=new Float32Array(at);for(let r=0;r<at;r++)e[r]=a();St.setAttribute("aSeed",new l.InstancedBufferAttribute(e,1))}const Jt=et({shared:i,vertexColors:!0,side:l.DoubleSide,color:N,spots:.8,spotCell:.5,spotCream:.3,outline:.5,vertDecl:za,vertMain:ya,fragDecl:Ma,fragPigment:Aa,uniforms:{uPxAng:xe,uLantern:{value:0}}}),De=new l.InstancedMesh(St,Jt,at);De.frustumCulled=!1,De.name="basking-sharks",g.add(De);const ot=new l.Mesh(new l.PlaneGeometry(760,560).rotateX(-Math.PI/2),new l.ShaderMaterial({uniforms:{uPig:i.uPig,uHazeCol:i.uHazeCol,uHaze:i.uHaze},fog:!1,vertexShader:"void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`precision highp float;
${He}
void main(){ gl_FragColor = vec4(mix(uPig[7], uPig[1], .22), 1.); }`}));ot.position.set(-40,-4.6,-100),ot.name="deep-water",g.add(ot);const Qt=[0,1].map(e=>le.addDrop({x:0,z:0,r:0,pigment:3,core:.93,corePigment:7,lens:.25,order:80+e})),ea=[0,1,2].map(e=>le.addStroke({x0:0,z0:0,x1:0,z1:0,drag:3.2,width:1,tail:8,order:70+e}));let Pt=null,Ct=null;ae&&(Ct=le.addVortex({x:ae.c.x,z:ae.c.z,angle:0,radius:24,order:13}),Pt=le.addDrop({x:ae.c.x,z:ae.c.z,r:0,pigment:3,core:.972,corePigment:7,lens:.25,order:85}));const ta=z(100),aa=z(40),kt=b(0,0,0),Re=[null,null],Ie=[null,null,null],oa=(e,r)=>{S(r,kt),Re[0]=Re[1]=null,Ie[0]=Ie[1]=Ie[2]=null;for(const t of Ae)t.zNow=t.Z+Mt*(t.ui-r),t.xNow=t.x+.5*Math.sin(e*.23+t.ph),t.ahead=kt.z-t.zNow,t.lensR=6.5*t.size*(1-ne(36,46,t.ahead))*ne(-6,-1,t.ahead),t.lensR>.05&&(!Re[t.i%2]||t.lensR>Re[t.i%2].lensR)&&(Re[t.i%2]=t),t.ahead>-8&&t.ahead<68&&(Ie[t.i%3]=t),Me.set(t.xNow,m.heightAt(t.xNow,t.zNow,e)*.8-1.05*t.size,t.zNow),ze.set(.1,Math.PI+.05*Math.sin(e*.31+t.ph),0,"YXZ"),ye.setFromEuler(ze),pe.setScalar(t.size),De.setMatrixAt(t.i,Ze.compose(Me,ye,pe));pe.setScalar(1);for(let t=0;t<2;t++){const o=Re[t],s=Qt[t].fields;o?(s.x=o.xNow,s.z=o.zNow-.4,s.r=o.lensR):s.r=0}for(let t=0;t<3;t++){const o=Ie[t],s=ea[t].fields;o?(s.x0=o.xNow,s.z0=o.Z-85,s.x1=o.xNow,s.z1=o.zNow+1.6):(s.x0=0,s.z0=0,s.x1=0,s.z1=0)}if(ae){const t=Ke*.058*e;for(let o=0;o<ae.n;o++){const s=o/ae.n*Math.PI*2+t,V=ae.c.x+Math.cos(s)*ae.R,T=ae.c.z+Math.sin(s)*ae.R,F=-Math.sin(s)*Ke,H=Math.cos(s)*Ke;Me.set(V,m.heightAt(V,T,e)*.8-1.05,T),ze.set(.1,Math.atan2(-F,-H),0,"YXZ"),ye.setFromEuler(ze),De.setMatrixAt(Ae.length+o,Ze.compose(Me,ye,pe))}Pt.fields.r=27*ne(ta,aa,r),Ct.fields.angle=-Ke*(2.4+.03*Math.min(e,150))}De.instanceMatrix.needsUpdate=!0};await n.yield();const st=Math.round(80*k*(.6+.4*B)),nt=Math.round(40*k*(.6+.4*B)),$e=b(112,0,205),rt=Math.round(28*(.6+.4*B)),it=p.bait?Math.round(100*(.6+.4*B)):0,Ne=6,lt=st+rt+nt+it+Ne,Se=new Float32Array(lt*4),Ve=new Float32Array(lt*4);let Ut=0;const Fe=(e,r,t,o,s,V,T,F)=>{const H=Ut*4;Se[H]=e,Se[H+1]=r,Se[H+2]=t,Se[H+3]=o,Ve[H]=s,Ve[H+1]=V,Ve[H+2]=T,Ve[H+3]=F,Ut++};for(let e=0;e<st;e++){const r=Y.greatStacks[e%2],t=a.range(24,48);Fe(r.x,r.y-a.range(2,24),r.z,t,a.range(0,6.28),a.sign()*a.range(6,9.5)/t,0,a.range(1.6,2)*1.55)}for(let e=0;e<rt;e++){const r=a.range(17,29);Fe(e%2?55:-55,16+(a.range(14,30)-14)*1.75,-540,r,a.range(0,6.28)*.07,a.sign()*a.range(6,9)/r,0,a.range(1.7,2.1)*1.5)}for(let e=0;e<nt;e++){const r=a.sign()*a.range(9,30),t=a.range(6,15),o=a.range(-205,-15),s=a.range(1.5,4),V=a(),T=a.range(1.35,1.65);if(e<12&&Ae.length){const F=Ae[e%Ae.length],H=Math.floor(e/Ae.length);Fe(Math.sign(F.x)*(8.5+H*2.4),4.2+e*2.3%3.6,F.Z-5+e*7%11,Math.min(s,2),V,0,1,2)}else Fe(r,t,o,s,V,0,1,T)}for(let e=0;e<it;e++){const r=a.range(0,6.28),t=58*Math.sqrt(a());Fe($e.x+Math.cos(r)*t,a.range(5,17),$e.z+Math.sin(r)*t,a.range(1.5,4),a(),0,1,a.range(1.35,1.65))}const Bt=(R?[[10,-75],[10,-113],[-10,-138],[10,-163],[-10,-192],[10,-222]]:[[10,-36],[-10,-66],[10,-113],[-10,-138],[10,-163],[-10,-192]]).map(([e,r],t)=>({x:e,z:r,u0:z(r+24),k:t,slot:st+rt+nt+it+t}));for(const e of Bt)Fe(e.x,13,e.z,0,a(),0,2,1.7);await n.yield();const Ee=new l.InstancedBufferGeometry;{const e=Ua(C);Ee.index=e.index;for(const r of["position","normal","color","aPart"])Ee.setAttribute(r,e.attributes[r])}const ct=new l.InstancedBufferAttribute(Se,4),ft=new l.InstancedBufferAttribute(Ve,4);ct.setUsage(l.DynamicDrawUsage),ft.setUsage(l.DynamicDrawUsage),Ee.setAttribute("aA",ct),Ee.setAttribute("aB",ft),Ee.instanceCount=lt;const Dt={uPeel:{value:0}},ht=new l.Mesh(Ee,et({shared:i,vertexColors:!0,side:l.DoubleSide,color:N,outline:.6,bias:.25,vertDecl:Sa,vertMain:Pa,uniforms:Dt}));ht.frustumCulled=!1,ht.name="kittiwakes-and-terns",g.add(ht);const Ce=new l.InstancedBufferGeometry;{const e=new l.PlaneGeometry(1,1);Ce.index=e.index,Ce.setAttribute("position",e.attributes.position),Ce.setAttribute("uv",e.attributes.uv)}const ke=new Float32Array(Ne*2*3),we=new Float32Array(Ne*2*4),ut=new l.InstancedBufferAttribute(ke,3),dt=new l.InstancedBufferAttribute(we,4);ut.setUsage(l.DynamicDrawUsage),dt.setUsage(l.DynamicDrawUsage),Ce.setAttribute("aPos",ut),Ce.setAttribute("aS",dt),Ce.instanceCount=Ne*2;const Ye=new l.Mesh(Ce,new l.ShaderMaterial({uniforms:{uPig:i.uPig,uHazeCol:i.uHazeCol,uHaze:i.uHaze,uTint:{value:N}},vertexShader:va,fragmentShader:wa,transparent:!0,depthWrite:!1,side:l.DoubleSide,fog:!1}));Ye.frustumCulled=!1,Ye.renderOrder=2,Ye.name="plunge-splashes",g.add(Ye);const sa=.02,na=(e,r)=>{for(const t of Bt){const o=(r-t.u0)/sa,s=t.k,V=t.slot*4,T=m.heightAt(t.x,t.z,e);let F=13+.6*Math.sin(e*1.3+s),H=0;if(o>-1.6&&o<=0){const se=(o+1.6)/1.6;F=G(F,T+.2,se*se),H=-1.25*ne(0,.25,se)}else if(o>0&&o<=.5)F=-3,H=-1.25;else if(o>.5&&o<2.6){const se=ne(.5,2.6,o);F=G(T+.4,11,se),H=.55*(1-se)+.12*Math.sin(e*14)*(1-se)}else o>=2.6&&(F=11+.6*Math.sin(e*1.3+s));Se[V]=t.x+(o>.5?Math.min(o-.5,3)*.8:0),Se[V+1]=F,Se[V+2]=t.z,Ve[V+1]=H;const ce=s*3,ee=s*4,_=(Ne+s)*3,oe=(Ne+s)*4;ke[ce]=t.x,ke[ce+1]=T-.1,ke[ce+2]=t.z,we[ee]=3.6,we[ee+1]=de(o*1.5,0,1.75)*(o<1.17?1:0),we[ee+2]=0,we[ee+3]=s+.37,ke[_]=t.x,ke[_+1]=T+.3,ke[_+2]=t.z,we[oe]=7.2,we[oe+1]=o>.05&&o<2?o*1.2:0,we[oe+2]=1,we[oe+3]=s}ct.needsUpdate=!0,ft.needsUpdate=!0,ut.needsUpdate=!0,dt.needsUpdate=!0};await n.yield();const Ue=b(0,0,0);L.tangentAt(0,Ue),Ue.y=0,Ue.normalize();const Rt=b(L.start.x+Ue.x*78+Ue.z*12,0,L.start.z+Ue.z*78-Ue.x*12),Nt=b(f,0,W(.24)),pt=[le.addDrop({x:Rt.x,z:Rt.z,r:0,pigment:3,core:.74,corePigment:0,order:52}),le.addDrop({x:72,z:128,r:0,pigment:1,core:.64,corePigment:0,order:53}),le.addDrop({x:Nt.x,z:Nt.z,r:0,pigment:3,core:.78,corePigment:1,order:55})],ra=(e,r)=>{pt[0].fields.r=6.5+4*ne(0,.1,e)+.3*Math.sin(r*.8),pt[1].fields.r=13*ne(.1,.25,e),pt[2].fields.r=2.5+17.5*ne(.015,.12,e)};le.addRingField({x:0,z:-110,radius:115,cell:15,maxR:1.6,period:5,density:.5*k,pigment:3,order:56}),p.bait&&le.free()>0&&le.addRingField({x:$e.x,z:$e.z,radius:64,cell:9,maxR:2.2,period:3.2,density:.85,pigment:3,order:57,seed:5}),I&&le.free()>0&&le.addShear({dirX:.8,dirZ:.6,amp:46,wavelength:260,phase:c()*6,order:5});const Vt=b(0,0,0),qe=b(0,0,0),Ft=[{at:(e,r)=>{S(r,qe);const t=W(r),o=Math.hypot(f-qe.x,t-qe.z);return Vt.set(f,4-de(.2*o,0,24),t)},from:.04,to:.36,weight:.75,fade:.3},{at:(e,r)=>{S(r,qe);let t=0,o=0,s=.001;for(const T of Ae){const F=T.Z+Mt*(T.ui-r),H=qe.z-F,ce=Math.exp(-((H-24)*(H-24))/260);t+=T.x*ce,o+=F*ce,s+=ce}const V=de(s,0,1);return Vt.set(G(0,t/s,V),-1,G(qe.z-30,o/s,V))},from:ae?.47:.38,to:.62,weight:.42,fade:.2},{at:[0,2,-556],from:.66,to:.97,weight:.92,fade:.25}];ae&&Ft.push({at:[ae.c.x,-1,ae.c.z],from:.33,to:.47,weight:.6,fade:.3});const Et=new l.Vector2,mt=b(0,0,0),qt=n.renderer;return{scene:g,path:L,duration:D,title:p.title,camera:{fov:62,near:.3,far:4300,lookAhead:34,sway:1,bank:1},pois:Ft,portal:{shape:"circle",radius:7,color:"#BFEFE6",glow:1,revealDistance:330,tilt:!0},post:p.post,ride:"none",style:"none",update(e,r,t,o){o=de(o||0,0,1),qt&&t&&(qt.getDrawingBufferSize(Et),xe.value=2*Math.tan((t.fov||62)*Pe/2)/Math.max(Et.y,1)),m.setProgress(o),m.setHighlight(p.hi*(p.hiFrom<0?1:ne(p.hiFrom,p.hiFrom+.1,o))*(1-.82*ne(.75,.85,o))),ra(o,r),jt(r,o),oa(r,o),na(r,o),Dt.uPeel.value=ne(.63,.71,o)*(1-ne(.76,.82,o));const s=150*(1-Math.exp(-r/125));if($&&($.uDrift.value=s),Q){const V=Q.userData.base;for(let T=0;T<V.length;T++){const F=V[T],H=1+.05*Math.sin(r*.21+F.ph);Me.set(F.x,F.y+3*Math.sin(r*.13+F.ph),re+F.z+s),ze.set(0,F.ry+r*.004,0,"YXZ"),ye.setFromEuler(ze),pe.set(F.sx*H,F.sy/H,F.sx*.8*H),Q.setMatrixAt(T,Ze.compose(Me,ye,pe))}pe.set(1,1,1),Q.instanceMatrix.needsUpdate=!0}if(t){t.getWorldPosition(mt),J.position.copy(mt);for(const V of me)V.u.uPxAng.value=xe.value,V.u.uCen.value.copy(mt),V.cenY!=null&&(V.u.uCen.value.y=V.cenY)}m.update(e,r,t)},dispose(){m.dispose()}}}};export{Ha as default};
