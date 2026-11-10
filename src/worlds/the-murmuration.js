import*as r from"three";import{makePath as _t,makeRng as mt,hashSeed as pt,clamp as oe,lerp as L,smoothstep as Ee}from"../kit/core.js";import{buildHero as Ht}from"../parts/the-murmuration.js";const Gt="#0E0B12",qt={sunset:{zen:"#2A2350",mag:"#7A3B78",cor:"#E85A5A",halo:"#FF9A45",core:"#FFE08A",mist:"#B8687E",cloudDark:"#3b2a55",sunI:9,sunEl:[1.25,-.3],cover:.5,street:.9,star:.35,moon:1,mistD:.0045,portal:"#FFE08A",exposure:1,sat:1.08,title:"The Murmuration"},dawn:{zen:"#3d4f86",mag:"#a983b8",cor:"#f59aa6",halo:"#ffbf9c",core:"#fff1cf",mist:"#dba9bd",cloudDark:"#5a5f8c",sunI:8,sunEl:[-.25,1.3],cover:.42,street:1,star:.25,moon:.8,mistD:.007,portal:"#ffe6c4",exposure:1,sat:1,title:"The Murmuration at First Light"},overcast:{zen:"#59607a",mag:"#8c93a8",cor:"#c3c6d0",halo:"#e9dcb8",core:"#fff4d0",mist:"#aeb2c2",cloudDark:"#4d5368",sunI:0,sunEl:[2.2,1.2],cover:1.02,street:.5,star:0,moon:0,mistD:.008,portal:"#fff0c4",exposure:1.05,sat:.92,title:"The Murmuration under Silver"},afterglow:{zen:"#141636",mag:"#43295f",cor:"#b8455d",halo:"#f57f3a",core:"#ffc56c",mist:"#8f587c",cloudDark:"#1f1a3a",sunI:8,sunEl:[-1.3,-2.4],cover:.4,street:.9,star:1.9,moon:1.6,mistD:.005,portal:"#ffc56c",exposure:1.12,sat:1.1,title:"The Murmuration, Afterglow"}},Xe=`
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ return .5 * vn(p) + .25 * vn(p * 2.03 + 7.1) + .125 * vn(p * 4.1 + 13.7) + .0625 * vn(p * 8.3 + 3.3); }
`,Be=`
uniform vec4 uFenS, uFenD;
uniform vec3 uIsl[5];   // reed islets in the flood: x, z, radius
float fenSD(vec2 p){
  float wob = 22. * sin(p.x * .011 + uFenS.x) + 14. * sin(p.y * .017 + uFenS.y) + 7. * sin((p.x + p.y) * .043 + uFenS.z) + 3. * sin((p.x - p.y) * .11 + uFenS.w);
  vec2 d = abs(p - vec2(0., -170.)) - vec2(340., 330.);
  float sd = length(max(d, 0.)) + min(max(d.x, d.y), 0.) - 80. + wob;
  float fl = sd;
  sd = min(sd, max(abs(p.x) - 3.2, 200. - p.y));
  sd = min(sd, max(abs(p.y - uFenD.x - 10. * sin(p.x * .012)) - 3., 250. - p.x));
  sd = min(sd, max(abs(p.y - uFenD.y + .25 * (p.x + 250.)) - 3., p.x + 250.));
  float dt = abs(mod(p.x * uFenD.z + p.y * uFenD.w + 4000., 260.) - 130.) - 1.7;
  sd = min(sd, max(dt, 70. - fl));
  sd = min(sd, length((p - vec2(760., -980.)) * vec2(1., .55)) - 250. + 2. * wob);
  sd = min(sd, length((p - vec2(-820., -1250.)) * vec2(.5, 1.)) - 170. + 2. * wob);
  float hf = 7. * sin((p.x + p.y) * .043 + uFenS.z) + 3. * sin((p.x - p.y) * .11 + uFenS.w);
  sd = max(sd, 4.5 - length((p - vec2(31., -200.)) * vec2(.7, 1.)) + .25 * hf);
  for (int i = 0; i < 5; i++) sd = max(sd, uIsl[i].z - length((p - uIsl[i].xy) * vec2(1., .4)) + .5 * hf);
  return sd;
}
`,vt=`
uniform vec3 uSunDir, uMoonDir, uStarDir;
uniform vec3 cZen, cMag, cCor, cHalo, cCore, cCloudDark, uHazeCol, uHazeWarm;
uniform vec4 uSkyP;   // sun disc radius (deg), sun intensity, cloud coverage, street contrast
uniform vec4 uSkyQ;   // time, star brightness, moon brightness, glow strength
vec3 skyColor(vec3 d, float disc){
  float e = asin(clamp(d.y, 0., 1.)) * 57.2958;
  vec2 sxz = normalize(uSunDir.xz);
  float sw = pow(.5 + .5 * dot(normalize(d.xz + 1e-5), sxz), 3.);
  vec3 low = mix(mix(cMag, cZen, .4), cCor, sw);
  vec3 c = mix(low, cMag, smoothstep(4., 30., e));
  c = mix(c, cZen, smoothstep(22., 66., e));
  c = mix(c, cHalo, sw * sw * (1. - smoothstep(0., 12., e)) * .8);
  float cs = dot(d, uSunDir);
  float sd = acos(clamp(cs, -1., 1.)) * 57.2958;
  c += (cHalo * .5 * exp(-sd / 10.) + cCore * .8 * exp(-sd / 2.8)) * uSkyQ.w;
  // horizon haze: meets the far ground exactly
  c = mix(c, mix(uHazeCol, uHazeWarm, pow(max(dot(normalize(d.xz + 1e-5), sxz), 0.), 3.)), exp(-e * 1.25));
  // the sun
  float dk = smoothstep(uSkyP.x, uSkyP.x * .9, sd);
  c = mix(c, mix(cHalo, cCore, smoothstep(-uSkyP.x, uSkyP.x, (d.y - uSunDir.y) * 57.3)) * uSkyP.y, dk * disc * step(.01, uSkyP.y));
  if (d.y > .0) {
    // one bright star, a few faint ones late, a hairline moon
    float st = exp(-(1. - dot(d, uStarDir)) * 5e5) * (.8 + .2 * sin(uSkyQ.x * 5.));
    vec3 g = d * 190.; vec3 gi = floor(g);
    float hs = h21(gi.xy + gi.z * 17.3);
    float fs = step(.9975, hs) * exp(-dot(fract(g) - .5, fract(g) - .5) * 30.) * (.6 + .4 * sin(uSkyQ.x * 3. + hs * 400.));
    c += vec3(1., .95, .86) * (st * 5. * uSkyQ.y + fs * 2.2 * max(uSkyQ.y - 1., 0.) * smoothstep(8., 30., e));
    if (dot(d, uMoonDir) > .99) {
      vec3 mx = normalize(cross(vec3(0., 1., 0.), uMoonDir)), my = cross(uMoonDir, mx);
      vec2 v = vec2(dot(d, mx), dot(d, my)) / .017;
      float cr = smoothstep(1., .9, length(v)) * (1. - smoothstep(1., .9, length(v - vec2(.2, .14))));
      c += cCore * cr * 3.2 * uSkyQ.z;
    }
    // cloud streets running toward the sun, lit from below
    vec2 p = d.xz / (d.y + .075);
    float t = uSkyQ.x;
    float ac = p.x + .32 * sin(p.y * .33 + 1.7);
    float street = .5 + .5 * cos(ac * 1.75 + 1.3 * vn(vec2(p.y * .22, 3.7)));
    float lump = fbm(vec2(ac * 3.1, p.y * 1.5 + t * .016));
    float den = lump + (street - .5) * uSkyP.w + uSkyP.z - .96;
    float a = smoothstep(0., .2, den) * smoothstep(.0, .13, d.y) * .92;
    vec3 lit = mix(cMag * .95, cCor * 1.15, exp(-sd / 36.)) + cHalo * .85 * exp(-sd / 13.);
    vec3 cc = mix(lit, cCloudDark, smoothstep(.1, .52, den));
    c = mix(c, cc, a * (1. - .55 * dk * disc));
  }
  return c;
}
`,Ye=`
uniform vec3 uMistCol, uMistWarm;
uniform vec4 uAtm;   // mist density, mist scale height, fog density, unused
vec3 atmos(vec3 col, vec3 P, vec3 C, vec3 sunDir, vec3 hazeCol, vec3 hazeWarm){
  vec3 v = P - C; float D = length(v); vec3 dir = v / max(D, 1e-3);
  float sw = pow(max(dot(normalize(dir.xz + 1e-5), normalize(sunDir.xz)), 0.), 3.);
  float h = uAtm.y, y0 = max(C.y, 0.), y1 = max(P.y, 0.), dy = abs(y1 - y0);
  float od = dy > .05 ? h * abs(exp(-y0 / h) - exp(-y1 / h)) / dy : exp(-y0 / h);
  float m = 1. - exp(-uAtm.x * max(D - 14., 0.) * od);
  col = mix(col, mix(uMistCol, uMistWarm, sw), m);
  float f = 1. - exp(-pow(D * uAtm.z, 2.));
  return mix(col, mix(hazeCol, hazeWarm, sw), f);
}
`,Nt=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }
`,Kt=`
varying vec3 vW;
uniform float uTime, uWinter;
uniform vec3 uInk, uDeep, uWeed;
uniform vec4 uSwan[2];     // crossing point xz, velocity xz
uniform vec2 uSwanT;       // seconds since the crossing, beat rate
uniform vec3 uPunt;        // x, z, wake strength
uniform vec3 uPortal, uPortalCol, uMirInk;
${Xe}
${Be}
${vt}
${Ye}
void main(){
  vec3 v = vW - cameraPosition; float D = length(v); vec3 V = v / D;
  vec2 p = vW.xz;
  float sd = fenSD(p);
  float fw = max(fwidth(sd), .02);
  float water = 1. - smoothstep(-fw, fw, sd);
  float fp = D * .0027 / max(-V.y, .03);            // pixel footprint along the view, metres
  float dyke = smoothstep(205., 230., p.y) * (1. - smoothstep(3.4, 4., abs(p.x)));
  // the land is a patchwork of fields between the drains: plough, stubble, wet pasture. Low ground
  // holds slivers of sky in the furrows and a few broad pools.
  vec2 fuv = vec2(p.x * uFenD.z + p.y * uFenD.w - 30., p.y * uFenD.z - p.x * uFenD.w) / vec2(260., 190.);
  vec2 cell = floor(fuv);
  float hid = h21(cell + 7.3), hid2 = h21(cell * 1.7 + 31.1);
  float fm = hid < .5 ? fuv.x * 260. : fuv.y * 190.;
  float furV = 1. - smoothstep(1.2, 4.5, fp);
  float fur = sin(fm * 1.26 + 2. * vn(p * .03));
  float tone = mix(.6, 3.4, hid2) * (1. + .85 * fur * furV * step(.3, hid2));
  if (sd > 8.) {
    float wet = smoothstep(.52, .68, vn(p * .0042 + uFenS.xy)) * smoothstep(8., 26., sd) * step(.25, hid);
    float fine = smoothstep(.45, .8, fur * .5 + .5 + .9 * (vn(p * .08) - .5));
    float coarse = smoothstep(.5, .62, vn(p * .017 + 3.1 + hid));
    float broad = smoothstep(.6, .66, vn(p * .011 + uFenS.zw));
    water = max(water, max(wet * mix(coarse * .8, fine, furV), wet * broad));
  }
  vec3 col;
  if (water > .001) {
    float t = uTime;
    float paws = .35 + .65 * smoothstep(.3, .7, vn(p * .013 + vec2(t * .02, -t * .013)));
    vec2 sl = vec2(0.);
    sl += vec2(.80, .60) * cos(dot(p, vec2(.80, .60)) * 1.9 + t * 1.5) * .016 * (1. - smoothstep(.4, 2.5, fp));
    sl += vec2(-.50, .87) * cos(dot(p, vec2(-.50, .87)) * 3.1 - t * 2.1 + 1.) * .014 * (1. - smoothstep(.25, 1.6, fp));
    sl += vec2(.95, -.30) * cos(dot(p, vec2(.95, -.30)) * 5.3 + t * 2.9 + 2.) * .011 * (1. - smoothstep(.15, .9, fp));
    sl += vec2(.20, .98) * cos(dot(p, vec2(.20, .98)) * .55 + t * .7 + 4.) * .012 * (1. - smoothstep(1.5, 9., fp));
    sl += vec2(-.90, .43) * cos(dot(p, vec2(-.90, .43)) * .23 - t * .45) * .008;
    sl *= paws;
    float rough = paws * smoothstep(.3, 3., fp);        // wave energy lost to distance comes back as sparkle
    // swans' wingtips ring the water along their track
    for (int i = 0; i < 2; i++) {
      vec2 vel = uSwan[i].zw; float sp = length(vel); vec2 dn = vel / sp;
      vec2 rel = p - uSwan[i].xy;
      float al = dot(rel, dn), lat = dot(rel, vec2(-dn.y, dn.x));
      if (abs(lat) < 14. && sp > .1) {
        float lam = sp / uSwanT.y;
        float k0 = floor(al / lam + .5);
        for (int j = -1; j <= 1; j++) {
          float sk = (k0 + float(j)) * lam;
          float age = uSwanT.x - sk / sp;
          if (age > 0. && age < 9.) {
            vec2 r2 = vec2(al - sk, abs(lat) - 1.25);
            float r = length(r2) + 1e-3, rr = r - age * .85;
            float ring = sin(rr * 8.) * exp(-rr * rr * 2.2) * exp(-age * .5) * min(age * 4., 1.);
            vec2 dr = r2 / r; dr.y *= sign(lat);
            sl += (dn * dr.x + vec2(-dn.y, dn.x) * dr.y) * ring * .1;
          }
        }
      }
    }
    // the punt's V wake
    float bh = p.y - uPunt.y, lt = p.x - uPunt.x;
    if (bh > -1. && bh < 90. && abs(lt) < 12.) {
      float arm = abs(lt) - max(bh, 0.) * .3 - .4;
      float w = sin(arm * 7. - t * 2.) * exp(-arm * arm * 1.6) * exp(-bh * .05) * smoothstep(-1., 1.5, bh);
      sl.x += sign(lt) * w * .09 * uPunt.z;
      sl.y += sin(bh * 3.2 + t * 2.) * exp(-bh * .09) * smoothstep(0., -1., arm) * .03 * uPunt.z;
    }
    vec3 N = normalize(vec3(-sl.x, 1., -sl.y));
    vec3 R0 = reflect(V, N);
    vec3 R = R0; R.y = abs(R.y) * .4 + .002; R = normalize(R);     // the mirror favours the bright low sky
    vec3 refl = skyColor(R, 1.);
    // glitter column under the sun where the ripples are too fine to resolve
    vec2 sxz = normalize(uSunDir.xz);
    float azd = 1. - dot(normalize(R.xz), sxz);
    float colm = exp(-azd * 900.) * exp(-max(R.y - uSunDir.y, 0.) * 9.) * step(.01, uSkyP.y) * smoothstep(-.06, .0, uSunDir.y);
    float spk = pow(vn(p * vec2(1.3, .35) + vec2(t * .9, -t * .6)) * vn(p * .37 - t * .2), 2.) * 5.;
    refl += cCore * uSkyP.y * .4 * (1. - .55 * dyke) * colm * spk * (.25 + rough);
    // the reed wall and the bank behind it stand black in the mirror along every shore
    if (sd > -45. && sd < .5) {
      vec2 gr = vec2(fenSD(p + vec2(.6, 0.)) - sd, fenSD(p + vec2(0., .6)) - sd);
      float ca = dot(normalize(R0.xz + 1e-5), normalize(gr + 1e-6));
      if (ca > .03) {
        float hh = -sd / ca * R0.y / max(length(R0.xz), 1e-3);
        refl = mix(refl, uMirInk, (1. - smoothstep(1.5, 2.7 + .5 * vn(p * 1.3), hh)) * .94);
      }
    }
    vec3 pl = uPortal - vW; float pd = length(pl);
    float pe = clamp(1.3 * pd * pd / 49., 20., 5000.);
    refl += uPortalCol * 2.2 * pow(max(dot(R0, pl / pd), 0.), pe);
    float fr = mix(.72, .97, pow(1. - max(dot(-V, N), 0.), 2.5));
    col = refl * fr + uDeep * (1. - fr);
    // duckweed dulls the dyke
    if (dyke > 0.) {
      float bl = smoothstep(.42, .6, fbm(p * .8 + vec2(0., t * .01)) + (abs(p.x) - 1.9) * .13);
      col = mix(col, uWeed + refl * .1, bl * .82 * dyke * (1. - .7 * smoothstep(1.6, .2, abs(lt)) * step(0., bh) * step(bh, 30.)));
    }
    // hard winter: matt ice along every margin
    if (uWinter > 0.) {
      float ice = smoothstep(-13., -4., sd + 7. * vn(p * .09)) * uWinter;
      vec3 matt = cCor * .3 + cMag * .3 + cZen * .14;
      matt = mix(matt, vec3(dot(matt, vec3(.33))), .55) * (.5 + .25 * vn(p * 1.7) + .35 * smoothstep(.7, .8, vn(p * .6)) + .3 * fbm(p * .2));
      col = mix(col, matt + refl * .12, ice * .9);
    }
  }
  vec3 land = uInk * tone * (1. + 1.1 * vn(p * .31)) + uWinter * vec3(.035, .035, .05) * vn(p * 2.3);
  col = mix(land, col, water);
  col = atmos(col, vW, cameraPosition, uSunDir, uHazeCol, uHazeWarm);
  gl_FragColor = vec4(col, 1.);
}
`,Ut=`
varying vec3 vD;
void main(){ vD = position; vec4 mv = viewMatrix * vec4(position * 100. + cameraPosition, 1.); gl_Position = projectionMatrix * mv; if (abs(gl_Position.w) < 1e-4) gl_Position.w = 1e-4; gl_Position.z = gl_Position.w; }
`,jt=`
varying vec3 vD;
${Xe}
${vt}
void main(){ gl_FragColor = vec4(skyColor(normalize(vD), 1.), 1.); }
`,Pe=`
uniform float uTime, uMirror;
uniform vec3 uSunDir;
varying vec3 vW; varying float vRim;
`,gt=`
attribute float aSway, aEdge;
${Pe}
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vec3 n = dot(normal, normal) > .5 ? normalize(mat3(modelMatrix) * normal) : vec3(0., 1., 0.);
  float g = sin(uTime * 1.3 + w.x * .21 + w.z * .17) * .6 + sin(uTime * 2.9 + w.x * .5) * .25
          + smoothstep(.5, 1., sin(dot(w.xz, vec2(.035, .05)) - uTime * .8)) * 1.4;
  w.xz += vec2(.07, .045) * g * aSway;
  float dist = length(w.xyz - cameraPosition);
  w.y += aEdge * max(.012, dist * .0019);                 // wires keep ~1.5 px
  vec3 V = normalize(cameraPosition - w.xyz);
  vRim = pow(1. - abs(dot(n, V)), 3.) * smoothstep(-.3, .7, dot(n, uSunDir) + n.y * .6) * step(.5, dot(normal, normal));
  if (uMirror < 0.) { w.x += sin(w.y * 1.9 + uTime * 1.6 + w.z * .4) * .05 * min(w.y, 3.); w.y = -w.y; }
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,_e=`
${Pe}
uniform vec3 uInk, uRim, uHazeCol, uHazeWarm;
uniform float uRimK;
${Ye}
#ifdef MIRROR
${Be}
#endif
void main(){
  vec3 P = vW;
  #ifdef MIRROR
    vec3 c = cameraPosition;
    vec3 xs = mix(c, P, clamp(c.y / max(c.y - P.y, 1e-3), 0., 1.));
    if (fenSD(xs.xz) > 0.) discard;
    P.y = -P.y;
  #endif
  vec3 col = uInk + uRim * vRim * uRimK;
  gl_FragColor = vec4(atmos(col, P, cameraPosition, uSunDir, uHazeCol, uHazeWarm), 1.);
}
`,yt=`
attribute vec4 iPos;    // x, z, height, yaw
attribute vec4 iVar;    // atlas column, phase, width, lean
${Pe}
varying vec2 vUv;
void main(){
  float cy = cos(iPos.w), sy = sin(iPos.w);
  vec3 q = vec3(position.x * iVar.z, position.y * iPos.z, 0.);
  vec3 w = vec3(iPos.x + q.x * cy, q.y, iPos.y + q.x * sy);
  float k = position.y * position.y;
  float front = smoothstep(.35, 1., sin(dot(w.xz, vec2(.045, .06)) - uTime * .9 + .6 * sin(w.x * .02)));
  float bend = (.25 + 1.5 * front + .22 * sin(uTime * 4.3 + iVar.y * 40. + w.x)) * iPos.z * .22;
  w.xz += vec2(.75, .5) * bend * k + vec2(-sy, cy) * iVar.w * k;
  w.y -= bend * bend * k * .12;
  vRim = 0.;
  if (uMirror < 0.) { w.x += sin(w.y * 2.3 + uTime * 1.6 + w.z * .4) * .04 * min(w.y, 2.); w.y = -w.y; }
  vW = w;
  vUv = vec2((uv.x + iVar.x) * .25, uv.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}
`,wt=`
${Pe}
varying vec2 vUv;
uniform sampler2D uMap;
uniform vec3 uInk, uRim, uHazeCol, uHazeWarm;
uniform float uRimK;
${Ye}
#ifdef MIRROR
${Be}
#endif
void main(){
  vec4 tx = texture2D(uMap, vUv);
  if (tx.r < .45) discard;
  vec3 P = vW;
  #ifdef MIRROR
    vec3 c = cameraPosition;
    vec3 xs = mix(c, P, clamp(c.y / max(c.y - P.y, 1e-3), 0., 1.));
    if (fenSD(xs.xz) > 0.) discard;
    P.y = -P.y;
  #endif
  vec3 col = uInk + uRim * tx.g * uRimK;
  gl_FragColor = vec4(atmos(col, P, cameraPosition, uSunDir, uHazeCol, uHazeWarm), 1.);
}
`,xt=`
attribute vec2 aWN;                  // signed span fraction, neck weight
attribute vec3 iPos, iVel;
attribute vec4 iWob, iPar, iPar2, iK;  // wobble xyz + freq | half-span, flap Hz, phase, neck | amp, dihedral, roll, glide | clock mode, t0, wrap period, sits
attribute vec2 iShow;
${Pe}
uniform float uT, uU, uMinS;
void main(){
  float ph = iPar.z;
  float tt = mix(uTime + iK.y, max(uT - iK.y, 0.), iK.x);
  float tw = iK.z > 0. ? mod(tt + .5 * iK.z, iK.z) - .5 * iK.z : tt;
  vec3 wf = vec3(1., 1.31, .73) * iWob.w;
  vec3 wa = uTime * wf + ph * vec3(6.3, 11.1, 17.7);
  vec3 c = iPos + iVel * tw + iWob.xyz * sin(wa);
  vec3 vel = iVel + iWob.xyz * wf * cos(wa);
  float sit = iK.w * step(tt, 0.);
  vec3 f = normalize(vel + vec3(1e-4, 0., -1e-3));
  vec3 r = normalize(cross(f, vec3(0., 1., 0.)));
  vec3 up = cross(r, f);
  float roll = iPar2.z * sin(uTime * .7 + ph * 9.);
  r = r * cos(roll) + up * sin(roll); up = cross(r, f);
  float dist = length(c - cameraPosition);
  float S = max(iPar.x * (1. + 2. * smoothstep(120., 700., dist)), dist * uMinS);
  float fl = uTime * 6.2832 * iPar.y + ph * 40.;
  float gl = iPar2.w * smoothstep(.3, .7, sin(uTime * .9 + ph * 23.));
  float A = iPar2.x * (1. - gl) * (1. - sit);
  float s = abs(aWN.x), wing = step(.01, s);
  float a1 = iPar2.y + A * sin(fl), a2 = iPar2.y * .4 + A * 1.25 * sin(fl - 1.);
  vec3 q = position;
  q.z -= aWN.y * iPar.w;
  q.y += (sin(a1) * min(s, .5) + sin(a2) * max(s - .5, 0.)) * wing - .07 * sin(fl) * A * (1. - wing);
  q.x *= mix(1., (.8 + .2 * cos(a1)) * (1. - .75 * sit), wing);
  vec3 w = c + (r * q.x + up * q.y - f * q.z) * S;
  if (uU < iShow.x || uU > iShow.y) w = vec3(0., -500., 0.);
  vRim = 0.;
  if (uMirror < 0.) w.y = -w.y;
  vW = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}
`,Ot=`
attribute vec4 iPos;   // x, y, z, phase
attribute vec2 iSize;
uniform float uTime;
varying vec2 vUv; varying float vA; varying float vSun; varying float vPh;
uniform vec3 uSunDir;
void main(){
  vec3 c = iPos.xyz;
  c.x += sin(uTime * .05 + iPos.w * 6.) * 14. + uTime * .25;
  c.z += cos(uTime * .04 + iPos.w * 9.) * 10.;
  vec3 to = c - cameraPosition; float d = length(to);
  vec3 rt = normalize(vec3(-to.z, 0., to.x));
  vec3 w = c + rt * position.x * iSize.x + vec3(0., position.y * iSize.y, 0.);
  vUv = uv; vPh = iPos.w;
  float el = abs(to.y) / max(d, 1.);
  vA = smoothstep(18., 70., d) * (1. - smoothstep(900., 1500., d)) * (1. - smoothstep(.1, .3, el));
  vSun = pow(max(dot(normalize(to.xz), normalize(uSunDir.xz)), 0.), 3.);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}
`,Lt=`
varying vec2 vUv; varying float vA; varying float vSun; varying float vPh;
uniform vec3 uMistCol, uMistWarm; uniform float uTime, uOp;
${Xe}
void main(){
  float x = vUv.x * 2. - 1.;
  float body = (1. - x * x) * (1. - x * x);
  float y = vUv.y;
  float n = fbm(vec2(vUv.x * 5. + vPh * 30. + uTime * .03, y * 1.5 + vPh * 7.));
  float prof = smoothstep(0., .12, y) * (1. - smoothstep(.25 + .5 * n, .5 + .5 * n, y));
  float a = body * prof * (.45 + .55 * n) * vA * uOp;
  if (a < .003) discard;
  gl_FragColor = vec4(mix(uMistCol, uMistWarm, vSun), a);
}
`,$t=`
attribute vec4 aSeed;
uniform float uTime, uPx;
varying float vA;
void main(){
  vec3 p = position;
  float t = uTime;
  p += vec3(sin(t * (1.1 + aSeed.x) + aSeed.y * 40.), sin(t * (1.7 + aSeed.z) + aSeed.x * 30.) * .6, cos(t * (.9 + aSeed.w) + aSeed.z * 50.)) * (.5 + aSeed.w);
  p.x += sin(t * .23 + aSeed.y * 9.) * 1.5;
  vec4 mv = viewMatrix * vec4(p, 1.);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, .3);
  gl_PointSize = clamp(uPx * (.035 + .03 * aSeed.x) / d, 1., 5.);
  vA = (.35 + .65 * step(.5, sin(t * 9. * (.5 + aSeed.y) + aSeed.z * 60.))) * smoothstep(.6, 2.5, d) * (1. - smoothstep(60., 140., d));
}
`,Qt=`
varying float vA; uniform vec3 uCol;
void main(){ vec2 q = gl_PointCoord - .5; float a = smoothstep(.5, .1, length(q)) * vA; if (a < .01) discard; gl_FragColor = vec4(uCol * a, 1.); }
`;class de{constructor(){this.p=[],this.s=[],this.e=[],this.flat=[]}tri(b,v,w,f=0,x=0,P=0,m=0){this.p.push(b[0],b[1],b[2],v[0],v[1],v[2],w[0],w[1],w[2]),this.s.push(f,x,P),this.e.push(0,0,0),this.flat.push(m,m,m)}quad(b,v,w,f,x=0,P=0,m=0,y=0,d=0){this.tri(b,v,w,x,P,m,d),this.tri(b,w,f,x,m,y,d)}cyl(b,v,w,f,x=6,P=0,m=0){const y=[v[0]-b[0],v[1]-b[1],v[2]-b[2]],d=Math.hypot(y[0],y[1],y[2])||1;y[0]/=d,y[1]/=d,y[2]/=d;let h=Math.abs(y[1])>.9?[1,0,0]:[0,1,0];const k=[y[1]*h[2]-y[2]*h[1],y[2]*h[0]-y[0]*h[2],y[0]*h[1]-y[1]*h[0]],I=Math.hypot(k[0],k[1],k[2]);k[0]/=I,k[1]/=I,k[2]/=I,h=[k[1]*y[2]-k[2]*y[1],k[2]*y[0]-k[0]*y[2],k[0]*y[1]-k[1]*y[0]];const W=(F,E,z)=>{const B=z/x*Math.PI*2,G=Math.cos(B)*E,K=Math.sin(B)*E;return[F[0]+h[0]*G+k[0]*K,F[1]+h[1]*G+k[1]*K,F[2]+h[2]*G+k[2]*K]};for(let F=0;F<x;F++){const E=W(b,w,F),z=W(b,w,F+1),B=W(v,f,F),G=W(v,f,F+1);this.tri(E,z,G,P,P,m),f>1e-4&&this.tri(E,G,B,P,m,m)}}box(b,v,w,f,x,P,m=0){const y=Math.cos(m),d=Math.sin(m),h=(E,z,B)=>[b+E*y+B*d,v+z,w-E*d+B*y],k=f/2,I=x/2,W=P/2,F=[h(-k,-I,-W),h(k,-I,-W),h(k,I,-W),h(-k,I,-W),h(-k,-I,W),h(k,-I,W),h(k,I,W),h(-k,I,W)];for(const E of[[0,3,2,1],[4,5,6,7],[0,1,5,4],[3,7,6,2],[0,4,7,3],[1,2,6,5]])this.quad(F[E[0]],F[E[1]],F[E[2]],F[E[3]])}wire(b,v,w,f=6){let x=null;for(let P=0;P<=f;P++){const m=P/f,y=L(b[1],v[1],m)-w*4*m*(1-m),d=[L(b[0],v[0],m),y,L(b[2],v[2],m)];if(x){const h=this.p.length/3;this.quad(x,d,d,x,0,0,0,0,1);const k=[-1,-1,1,-1,1,1];for(let I=0;I<6;I++)this.e[h+I]=k[I]}x=d}}geometry(){const b=new r.BufferGeometry;b.setAttribute("position",new r.Float32BufferAttribute(this.p,3)),b.computeVertexNormals();const v=b.getAttribute("normal");for(let w=0;w<this.flat.length;w++)this.flat[w]&&v.setXYZ(w,0,0,0);return b.setAttribute("aSway",new r.Float32BufferAttribute(this.s,1)),b.setAttribute("aEdge",new r.Float32BufferAttribute(this.e,1)),b}async geometrySteps(b){const v=new r.BufferGeometry;v.setAttribute("position",new r.Float32BufferAttribute(this.p,3));const w=v.getAttribute("position").array,f=new r.BufferAttribute(new Float32Array(w.length),3),x=2048*9;v.setAttribute("normal",f),await b.yield();for(let P=0;P<w.length;P+=x){const m=new r.BufferGeometry;m.setAttribute("position",new r.BufferAttribute(w.subarray(P,P+x),3)),m.computeVertexNormals(),f.array.set(m.getAttribute("normal").array,P),await b.yield()}f.needsUpdate=!0;for(let P=0;P<this.flat.length;P++)this.flat[P]&&f.setXYZ(P,0,0,0);return await b.yield(),v.setAttribute("aSway",new r.Float32BufferAttribute(this.s,1)),await b.yield(),v.setAttribute("aEdge",new r.Float32BufferAttribute(this.e,1)),v}}function Zt(){const u=[],b=[],v=(d,h,k,I=[0,0],W=[0,0],F=[0,0])=>{u.push(...d,...h,...k),b.push(...I,...W,...F)},w=[0,.01,-.36],f=[0,0,.42],x=[[0,.09,0],[.11,0,0],[0,-.09,0],[-.11,0,0]];for(let d=0;d<4;d++){const h=(d+1)%4;v(w,x[h],x[d]),v(f,x[d],x[h])}v([0,0,.3],[.1,0,.56],[-.1,0,.56]);const P=[[0,.05,-.3],[.04,0,-.3],[0,-.04,-.3],[-.04,0,-.3]],m=[[0,.05,-.36],[.045,.01,-.36],[0,-.03,-.36],[-.045,.01,-.36]];for(let d=0;d<4;d++){const h=(d+1)%4;v(P[d],P[h],m[h],[0,0],[0,0],[0,1]),v(P[d],m[h],m[d],[0,0],[0,1],[0,1]),v(m[d],m[h],[0,0,-.5],[0,1],[0,1],[0,1])}for(const d of[-1,1]){const h=[.08*d,.02,-.17],k=[.08*d,.02,.15],I=[.5*d,.02,-.2],W=[.5*d,.02,.13],F=[1*d,.02,-.02],E=[.8*d,.02,.16];v(h,I,W,[.02*d,0],[.5*d,0],[.5*d,0]),v(h,W,k,[.02*d,0],[.5*d,0],[.02*d,0]),v(I,F,E,[.5*d,0],[1*d,0],[.8*d,0]),v(I,E,W,[.5*d,0],[.8*d,0],[.5*d,0])}const y=new r.BufferGeometry;return y.setAttribute("position",new r.Float32BufferAttribute(u,3)),y.setAttribute("aWN",new r.Float32BufferAttribute(b,2)),y}function Xt(u){const w=document.createElement("canvas");w.width=1024,w.height=256;const f=w.getContext("2d");f.fillStyle="#000",f.fillRect(0,0,1024,256),f.lineCap="round";for(let P=0;P<4;P++){const m=P*256,y=P===3,d=y?13:P===2?14:24;for(let h=0;h<d;h++){const k=m+40+u()*176,I=(y?.5:.62)+u()*(y?.3:.36),W=(u()-.5)*50,F=oe(k+W,m+14,m+242),E=256-I*256;f.strokeStyle="#ff0000",f.lineWidth=1.3+u()*1.1,f.beginPath(),f.moveTo(k,256),f.quadraticCurveTo(k+W*.2,256-I*256*.6,F,E),f.stroke();for(let z=0;z<2;z++){const B=.25+u()*.5,G=L(k,F,B*B),K=256-I*256*B,ae=u()<.5?-1:1,he=18+u()*26;f.lineWidth=1+u()*.7,f.beginPath(),f.moveTo(G,K),f.quadraticCurveTo(G+ae*he*.6,K-he*.7,oe(G+ae*he,m+6,m+250),K-he*.25+u()*14),f.stroke()}if(y)f.strokeStyle="#ff5000",f.lineWidth=6.5,f.beginPath(),f.moveTo(F,E+8),f.lineTo(F-W*.06,E+34),f.stroke(),f.strokeStyle="#ff0000",f.lineWidth=1.5,f.beginPath(),f.moveTo(F,E+8),f.lineTo(F+W*.03,E-6),f.stroke();else{const z=u()<.7?1:-1;for(let B=0;B<9;B++){const G=B/8,K=oe(F+z*(G*G*22+u()*5),m+4,m+252),ae=E+G*12-(1-G)*14+u()*5;f.strokeStyle=`rgb(255,${120+Math.floor(u()*135)},0)`,f.lineWidth=1.4+2.6*Math.sin(Math.PI*Math.min(1,G+.15)),f.beginPath(),f.moveTo(K,ae),f.lineTo(K+z*5,ae+5),f.stroke()}}}}const x=new r.CanvasTexture(w);return x.wrapS=x.wrapT=r.ClampToEdgeWrapping,x.generateMipmaps=!1,x.minFilter=r.LinearFilter,x.magFilter=r.LinearFilter,x}function Yt(){const u=document.createElement("canvas");u.width=u.height=64;const b=u.getContext("2d"),v=b.createRadialGradient(32,32,0,32,32,32);return v.addColorStop(0,"rgba(255,255,255,1)"),v.addColorStop(.18,"rgba(255,255,255,0.55)"),v.addColorStop(.5,"rgba(255,255,255,0.12)"),v.addColorStop(1,"rgba(255,255,255,0)"),b.fillStyle=v,b.fillRect(0,0,64,64),new r.CanvasTexture(u)}function Jt(u,b,v){return(w,f)=>{const x=22*Math.sin(w*.011+u.x)+14*Math.sin(f*.017+u.y)+7*Math.sin((w+f)*.043+u.z)+3*Math.sin((w-f)*.11+u.w),P=Math.abs(w)-340,m=Math.abs(f+170)-330;let y=Math.hypot(Math.max(P,0),Math.max(m,0))+Math.min(Math.max(P,m),0)-80+x;y=Math.min(y,Math.max(Math.abs(w)-3.2,200-f)),y=Math.min(y,Math.max(Math.abs(f-b.x-10*Math.sin(w*.012))-3,250-w)),y=Math.min(y,Math.max(Math.abs(f-b.y+.25*(w+250))-3,w+250));const d=7*Math.sin((w+f)*.043+u.z)+3*Math.sin((w-f)*.11+u.w);y=Math.max(y,4.5-Math.hypot((w-31)*.7,f+200)+.25*d);for(const h of v)y=Math.max(y,h.z-Math.hypot(w-h.x,(f-h.y)*.4)+.5*d);return y}}const ye=u=>new r.Color(u),j=(u,b,v)=>u.clone().lerp(b,v);var o0={id:"the-murmuration",name:"The Murmuration",category:"sky",weirdness:.08,media:["air"],async build(u){const{rng:b}=u,v=u.vary||{hour:"any",rare:!1,density:1,mood:.5},w=oe(v.density??1,.7,1.3),f=oe(u.quality?.detail??1,.4,1),x=new r.Scene,P=[],m=b.fork("look"),y=m();let d=y<.42?"sunset":y<.66?"dawn":y<.84?"overcast":"afterglow";v.hour==="dawn"?d="dawn":v.hour==="golden"?d="sunset":v.hour==="day"?d="overcast":v.hour==="night"&&(d="afterglow");const h=qt[d],k=m.chance(d==="dawn"?.5:.3),I=m.pick(["peregrine","peregrine","sparrowhawk","harrier"]),W=m.chance(.35),F=!!v.rare,E=m.range(-.012,.012),z={};for(const e of["zen","mag","cor","halo","core","mist","cloudDark"])z[e]=ye(h[e]),z[e].offsetHSL(E,0,0);const B=ye(Gt);d!=="overcast"&&z.zen.multiplyScalar(1.5);const G=j(z.cor,z.halo,.55).multiplyScalar(.92),K=j(j(z.mag,z.zen,.35),z.mist,.35).multiplyScalar(d==="dawn"?.52:.8),ae=j(z.mist,z.halo,.62),he=k?j(z.core,ye("#ffffff"),.5):z.halo.clone(),Je=new r.Vector3(0,.02,-1).normalize(),X=Math.PI/180,Mt=new r.Vector3(Math.sin(-15*X)*Math.cos(15*X),Math.sin(15*X),-Math.cos(15*X)*Math.cos(15*X)).normalize(),et=m.range(18,34)*X,He=m.range(30,42)*X,bt=new r.Vector3(Math.sin(et)*Math.cos(He),Math.sin(He),-Math.cos(et)*Math.cos(He)),we=new r.Vector4(m.range(0,6.28),m.range(0,6.28),m.range(0,6.28),m.range(0,6.28)),tt=m.range(.2,1.3),me=new r.Vector4(m.range(-150,40),m.range(-200,80),Math.cos(tt),Math.sin(tt)),xe=mt(pt("isles:"+u.seed)),ne=[];for(let e=0,t=0;e<5&&t<200;t++){const o=e<2?xe.range(250,430):xe.range(470,720),a=(e%2?1:-1)*(xe.chance(.8)?1:-1),n=new r.Vector3(a*xe.range(48,150),390-o,xe.range(8,13));Math.hypot(n.x-31,n.y+200)<60||ne.some(s=>Math.hypot(s.x-n.x,s.y-n.y)<70)||(ne.push(n),e++)}for(;ne.length<5;)ne.push(new r.Vector3(0,5e3,1));const $=Jt(we,me,ne),_={uTime:{value:0},uSunDir:{value:Je},uMoonDir:{value:Mt},uStarDir:{value:bt},cZen:{value:z.zen},cMag:{value:z.mag},cCor:{value:z.cor.clone()},cHalo:{value:z.halo},cCore:{value:z.core},cCloudDark:{value:z.cloudDark},uHazeCol:{value:K},uHazeWarm:{value:G},uSkyP:{value:new r.Vector4(1.5,h.sunI,h.cover+m.range(-.05,.05),h.street)},uSkyQ:{value:new r.Vector4(0,h.star,h.moon,1)},uMistCol:{value:z.mist},uMistWarm:{value:ae},uAtm:{value:new r.Vector4(h.mistD*1.6*(k?1.25:1),2.6,3e-4,0)},uFenS:{value:we},uFenD:{value:me},uIsl:{value:ne},uMinS:{value:.004},uInk:{value:B},uRim:{value:he},uT:{value:0},uU:{value:0}},St=z.cor.clone();x.fog=new r.FogExp2(j(K,G,.7),3e-4),x.add(new r.HemisphereLight(j(z.mag,z.cor,.5),j(z.zen,B,.6),.9));const ot=new r.DirectionalLight(z.halo,h.sunI>0?2.2:.8);ot.position.set(0,12,-100),x.add(ot);const Ge=new r.Mesh(new r.IcosahedronGeometry(1,3),new r.ShaderMaterial({uniforms:_,vertexShader:Ut,fragmentShader:jt,side:r.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));Ge.frustumCulled=!1,Ge.renderOrder=-1,x.add(Ge);const zt=W?17:13,Ae=m.chance(.5)?1:-1,Me=7.5,se=[0,1].map(e=>new r.Vector4(-Ae*e*7,222+e*5,Ae*zt,-1.5)),qe={..._,uWinter:{value:k?1:0},uDeep:{value:j(z.zen,B,.55).multiplyScalar(.5)},uWeed:{value:j(ye("#1c2a10"),z.mag,.15).multiplyScalar(.6)},uSwan:{value:se},uSwanT:{value:new r.Vector2(-100,3)},uPunt:{value:new r.Vector3(2,322,1)},uPortal:{value:new r.Vector3(0,40,-390)},uPortalCol:{value:ye(h.portal)},uMirInk:{value:j(B,z.zen,.12)}},at=new r.PlaneGeometry(16e3,16e3);at.rotateX(-Math.PI/2);const Ne=new r.Mesh(at,new r.ShaderMaterial({uniforms:qe,vertexShader:Nt,fragmentShader:Kt,fog:!1}));Ne.renderOrder=-.9,Ne.frustumCulled=!1,x.add(Ne),await u.yield();const re=await Ht(u,{quads:Math.round(36e3*w*f),darts:Math.round(7e4*w*f),wingmen:90,sunDir:new r.Vector3(0,.03,-1),rare:F,raptor:I,erupt:d==="dawn"});x.add(re.object);const kt=re.anchors,Ke=j(B,z.zen,.12),De=re.makeMirror(15e3,{maskGLSL:Be.replace("float fenSD(","float mirrorMask("),maskUniforms:{uFenS:_.uFenS,uFenD:_.uFenD,uIsl:_.uIsl},ink:Ke});De.material.depthTest=!1,De.material.depthWrite=!1,De.renderOrder=-.8,x.add(De),await u.yield();const nt=[[0,0,2.6,0],[2,38,2.6,0],[4,76,2.9,0],[6,112,3.7,0],[7,132,4.4,1],[8,152,6,2.5],[9,172,13,4],[10.5,200,38,7],[12,225,72,10],[14,262,105,6],[16,298,160,0],[17.5,322,205,-4],[19,345,222,-4],[20.6,372,226,-2],[22.2,400,215,0],[24,430,182,0],[26.2,478,70,0],[28.5,530,22,0],[31,585,25,0],[32,610,34,0],[34,660,40,0],[36,705,40,0],[38,745,40,0],[40,780,40,0]],Ue=_t(nt.map(e=>[e[3],e[2],390-e[1]]));await u.yield();const je=800,Q=[],J=[];{const e=new r.Vector3;let t=0;for(const o of nt){let a=1/0,n=t;for(let s=t;s<=je;s++){Ue.pointAt(s/je,e);const l=(e.x-o[3])**2+(e.y-o[2])**2+(e.z-390+o[1])**2;l<a&&(a=l,n=s)}Q.push(n/je),J.push(o[0]),t=n,await u.yield()}Q[0]=0,Q[Q.length-1]=1}const Pt=e=>{if(e<=0)return 0;if(e>=1)return 40;let t=1;for(;t<Q.length-1&&Q[t]<e;)t++;const o=Q[t-1],a=Q[t];return L(J[t-1],J[t],a>o?(e-o)/(a-o):0)},ie=e=>{let t=1;for(;t<J.length-1&&J[t]<e;)t++;return L(Q[t-1],Q[t],oe((e-J[t-1])/(J[t]-J[t-1]),0,1))},st={..._,uMirror:{value:1},uRimK:{value:k?.55:.4}},At=new r.ShaderMaterial({uniforms:st,vertexShader:gt,fragmentShader:_e,side:r.DoubleSide,fog:!1}),rt={..._,uMirror:{value:-1},uRimK:{value:0},uInk:{value:Ke}},Oe={side:r.DoubleSide,fog:!1,depthTest:!1,depthWrite:!1,defines:{MIRROR:1}},Dt=new r.ShaderMaterial({uniforms:rt,vertexShader:gt,fragmentShader:_e,...Oe}),le=(e,t,o=!0)=>{const a=new r.Mesh(t,At);if(a.frustumCulled=!1,e.add(a),o){const n=new r.Mesh(t,Dt);n.frustumCulled=!1,n.renderOrder=-.8,e.add(n)}return a},D=b.fork("static"),T=new de,pe=new de,C=mt(pt("extra:"+u.seed)),be=(e,t,o)=>{const a=D.range(2,2.9),n=D.range(-.3,.3),s=D.range(-.3,.3),l=D.range(.85,1.2),i=[e+n,a,t+s];T.cyl([e,-.2,t],[e+n*.5,a*.55,t+s*.5],.42*l,.33*l,7),T.cyl([e+n*.5,a*.55,t+s*.5],i,.33*l,.5*l,7),T.cyl(i,[i[0],a+.55*l,i[2]],.62*l,.25*l,7);const c=Math.round(D.range(26,38)*(o?1.2:.75));for(let g=0;g<c;g++){const p=D.range(0,6.283),S=D.range(.08,.72),M=D.range(1.8,3.4)*l,V=Math.sin(S)*Math.cos(p),A=Math.sin(S)*Math.sin(p),U=Math.cos(S),fe=[i[0]+V*.45*l,a+.25*l+U*.2,i[2]+A*.45*l],ht=[fe[0]+V*M*.5,fe[1]+U*M*.55,fe[2]+A*M*.5],Bt=[fe[0]+V*M*.85,fe[1]+M*(U*.55+.45),fe[2]+A*M*.85];T.cyl(fe,ht,.045,.03,3,0,.45),T.cyl(ht,Bt,.03,0,3,.45,1.3)}},Se=(e,t)=>{const o=(a,n,s,l,i)=>{const c=[a[0]+n[0]*s,a[1]+n[1]*s,a[2]+n[2]*s];if(T.cyl(a,c,l,l*.62,i===0?6:3,a[1]*.02,c[1]*.03+(3-i)*0),i>=4)return;const g=i===0?3:2+(D()<.5?1:0);for(let p=0;p<g;p++){const S=D.range(0,6.283),M=D.range(.25,.7),V=[n[0]+Math.cos(S)*M,n[1]+.15,n[2]+Math.sin(S)*M],A=Math.hypot(V[0],V[1],V[2]);o(c,[V[0]/A,V[1]/A,V[2]/A],s*D.range(.55,.78),l*.6,i+1)}};o([e,-.2,t],[D.range(-.08,.08),1,D.range(-.08,.08)],D.range(3.2,4.4),.3,0)},ce=[];for(let e=250;e<640;e+=D.range(13,24))for(const t of[-1,1])D()<.72&&ce.push([t*D.range(12.5,16),e+D.range(-3,3)]);for(let e=300;e<620&&ce.length<60;e+=D.range(22,40))ce.push([e,me.x+10*Math.sin(e*.012)+(D()<.5?-8:8)]);for(let e=-300;e>-560&&ce.length<68;e-=D.range(24,44))ce.push([e,me.y-.25*(e+250)+(D()<.5?-8:8)]);for(let e=0,t=0;e<16&&t<400;t++){const o=D.range(-450,450),a=D.range(-640,260),n=$(o,a);n>5&&n<14&&Ue.nearestXZ(o,a).dist>20&&(ce.push([o,a]),e++)}for(const e of ce)(Math.abs(e[0])<40||$(e[0],e[1])>1.5)&&be(e[0],e[1],Math.abs(e[0])<40),await u.yield();for(let e=0,t=0;e<6&&t<300;t++){const o=D.range(-460,460),a=D.range(-480,520),n=$(o,a);n>8&&n<22&&Math.abs(o)>18&&(Se(o,a),e++)}Se(-19,301),Se(21,356),await u.yield();{T.box(0,1.02,280,13,.14,1.3);for(const t of[-.62,.62]){for(let o=-6;o<=6.01;o+=2)T.cyl([o,-.3,280+t],[o,2.02,280+t],.07,.06,4);T.cyl([-6.3,2,280+t],[6.3,2,280+t],.055,.055,4),T.cyl([-6.3,1.5,280+t],[6.3,1.5,280+t],.035,.035,3)}for(const t of[-1,1])T.box(t*6.6,.5,280,1.6,1.1,1.9)}const N=-505,it=[];{let e=null;for(let t=-840;t<=880;t+=10){const o=1.05+.5*u.noise.n2(t*.013,7.7)+.2*u.noise.n2(t*.09,1.3),a=1.4*u.noise.n2(t*.006,3.1),n=[[N-5.5+a,-.2,t],[N-2.6+a*.6,o,t],[N+2.6+a*.6,o,t],[N+5.5+a,-.2,t]];if(e)for(let s=0;s<3;s++)pe.quad(e[s],e[s+1],n[s+1],n[s]);e=n}for(const t of[-1,1]){let o=null;for(let a=-840;a<=880;a+=5){const s=u.noise.n2(a*.011+t*9,5.5)>.38?null:[N+t*(3.6+C.range(-.4,.4)),.9+C()*1.7+(C()<.07?C.range(1.5,4):0),a];o&&s&&pe.quad([o[0],0,o[2]],[s[0],0,s[2]],s,o,0,0,.6,.6,1),o=s}}}{let e=null;for(let t=760;t>=-780;t-=48){const o=D.range(-.25,.25),a=[N+o,9,t];T.cyl([N,.3,t],a,.17,.11,5);const n=[[N+o-1,8.5,t],[N+o+1,8.5,t],[N+o-.75,7.8,t]];if(T.box(N+o,8.45,t,2.3,.13,.13),T.box(N+o,7.75,t,1.8,.11,.11),e)for(let s=0;s<3;s++){const l=D.range(.5,.9);T.wire(e[s],n[s],l,6);for(let i=0;i<4;i++){const c=D();it.push([L(e[s][0],n[s][0],c),L(e[s][1],n[s][1],c)-l*4*c*(1-c)+.07,L(e[s][2],n[s][2],c)])}}e=n}}await u.yield();{let a=14;const n=[];for(let i=0;i<=560;i++){const c=i/560*Math.PI*2;a=oe(a+D.range(-3.2,3.2),5,24);const g=Math.sin(c*9+we.x)*Math.sin(c*23+we.y)>.72?.25:1;n.push((a+(D()<.06?D.range(6,13):0)+5*Math.sin(c*17+we.z))*g+3)}for(let i=0;i<560;i++){const c=i/560*Math.PI*2,g=(i+1)/560*Math.PI*2,p=[Math.sin(c)*2050,0,-100-Math.cos(c)*2050],S=[Math.sin(g)*2050,0,-100-Math.cos(g)*2050];T.quad(p,S,[S[0],n[i+1],S[2]],[p[0],n[i],p[2]],0,0,0,0,1)}const s=-Math.tan(8*X)*1900+D.range(-30,30),l=-1880;T.box(s,14,l,9,28,9),T.cyl([s,28,l],[s,62,l],5.2,0,4),T.box(s+16,8,l,26,16,11),T.cyl([s+3,16,l],[s+29,16,l],7.6,7.6,3);for(let i=0;i<3;i++){const c=D.range(-900,900),g=D.range(-1500,-900);T.box(c,4,g,22,8,12,D.range(0,3))}}const Z=kt.windpump.clone();{const[e,t]=[Z.x,Z.z];T.cyl([e,-.3,t],[e,1.2,t],3.3,3,8),T.cyl([e,1.2,t],[e,9.6,t],2.6,1.55,8),T.cyl([e,3.4,t],[e,3.6,t],3.5,3.5,8);for(let o=0;o<8;o++){const a=o/8*6.283;T.cyl([e+Math.cos(a)*3.4,3.6,t+Math.sin(a)*3.4],[e+Math.cos(a)*3.4,4.5,t+Math.sin(a)*3.4],.05,.05,3)}for(let o=0;o<8;o++){const a=o/8*6.283,n=(o+1)/8*6.283;T.cyl([e+Math.cos(a)*3.4,4.5,t+Math.sin(a)*3.4],[e+Math.cos(n)*3.4,4.5,t+Math.sin(n)*3.4],.04,.04,3)}T.cyl([e,9.6,t],[e,10.3,t],1.9,1.75,8),T.cyl([e,10.3,t-.2],[e,12,t-.2],1.75,.25,8),T.cyl([e,10.5,t],[e,10.5,t+2.5],.22,.2,6),T.cyl([e,10.9,t-1.4],[e,11.6,t-4.2],.09,.07,4);for(let o=0;o<6;o++){const a=o/6*6.283;T.quad([e,11.6,t-4.2],[e+Math.cos(a)*.9,11.6+Math.sin(a)*.9,t-4.2],[e+Math.cos(a+.35)*.9,11.6+Math.sin(a+.35)*.9,t-4.25],[e,11.6,t-4.25],0,0,0,0,1)}T.cyl([e+4.2,0,t+1],[e+4.2,1.6,t+1],.9,.9,6),T.box(e+3.2,1,t+1,2.4,2,1.2)}await u.yield();for(const e of ne)e.y<4e3&&(C()<.6?be(e.x+C.range(-2,2),e.y+C.range(-2,2),!1):Se(e.x,e.y),C()<.5&&be(e.x+C.range(3,6)*(C()<.5?-1:1),e.y+C.range(-4,4),!1));const ee=me.z,te=me.w;for(let e=0,t=0;e<6&&t<300;t++){const o=30+260*Math.round(C.range(-3,3))+(C()<.5?-7:7);let a=C.range(-700,600),n=0;for(let s=0;s<7;s++){a+=C.range(13,24);const l=o*ee-a*te,i=o*te+a*ee;$(l,i)>80&&Math.hypot(l,i+140)<950&&Math.abs(l-N)>12&&(be(l,i,!1),n++)}n>2&&e++,await u.yield()}for(let e=0,t=0;e<16&&t<3e3;t++){const o=C.range(-480,480),a=C.range(-800,-480),n=$(o,a);n<5||n>18||Math.abs(o)<14||(C()<.75?be(o,a,!1):Se(o,a),e++,await u.yield())}await u.yield();{const e=(t,o,a,n,s)=>{let l=null,i=C.range(2,4);for(let c=0;c<=s+.1;c+=9){const g=t+a*c,p=o+n*c;i=oe(i+C.range(-1.1,1.1),1.6,5);const S=i+(C()<.08?C.range(4,8):0),M=$(g,p)>16&&Math.abs(g-N)>9&&Math.hypot(g,p+140)<1500?[g,S,p]:null;l&&M&&pe.quad([l[0],-.2,l[2]],[M[0],-.2,M[2]],M,l,0,0,0,0,1),l=M}};for(let t=-7;t<=7;t++)for(let o=-5;o<5;o++)if(C()<.6){const a=190*t,n=30+260*o;e(-a*te+n*ee,a*ee+n*te,ee,te,260),await u.yield()}for(let t=-5;t<=5;t++)for(let o=-7;o<7;o++)if(C()<.32){const a=30+260*t+5,n=190*o;e(a*ee-n*te,a*te+n*ee,-te,ee,190),await u.yield()}for(let t=0;t<4;t++){const o=t%2?1:-1,a=o*C.range(130,760),n=C.range(-1200,-640),s=C.range(-.45,.45),l=Math.round(C.range(12,22));for(let i=0;i<l;i++){const c=(i-l/2)*C.range(6.5,9),g=a+Math.cos(s)*c,p=n+Math.sin(s)*c;if($(g,p)<12)continue;const S=C.range(14,24),M=S*C.range(.13,.2);pe.quad([g-.3,0,p],[g+.3,0,p],[g+.3,S*.3,p],[g-.3,S*.3,p],0,0,0,0,1),pe.quad([g,S*.12,p],[g+M,S*.42,p],[g,S,p],[g-M,S*.5,p],0,.5,1.5,.5,1)}}}await u.yield(),le(x,await T.geometrySteps(u)),await u.yield(),le(x,pe.geometry(),!1),await u.yield();const Te=new r.Group;Te.position.set(Z.x,10.5,Z.z+2.45);{const e=new de;for(let t=0;t<4;t++){const o=t*Math.PI/2,a=Math.cos(o),n=Math.sin(o),s=(i,c,g=0)=>[a*i-n*c,n*i+a*c,g],l=(i,c,g)=>{const p=c[0]-i[0],S=c[1]-i[1],M=Math.hypot(p,S),V=-S/M*g,A=p/M*g;e.quad([i[0]-V,i[1]-A,i[2]],[c[0]-V,c[1]-A,c[2]],[c[0]+V,c[1]+A,c[2]],[i[0]+V,i[1]+A,i[2]],0,0,0,0,1)};l(s(0,0),s(5.3,0),.085),l(s(1.1,.08,.02),s(5.3,.08,.02),.03),l(s(1.1,1.25,.05),s(5.3,1,.05),.04),l(s(1.1,-.38,.03),s(5.3,-.3,.03),.035),l(s(1.1,.66,.04),s(5.3,.54,.04),.022);for(let i=0;i<=10;i++){const c=1.1+i*.42;l(s(c,-.38,.04),s(c,1.25-i*.025,.04),.028)}}le(Te,e.geometry())}x.add(Te);const O=new r.Group,ve=new r.Group;{const e=new de,t=(c,g,p,S,M,V)=>{e.quad([-p,M,c],[p,M,c],[S,V,g],[-S,V,g]),e.quad([-p,.42,c],[p,.42,c],[S,.42+(V-M)*.3,g],[-S,.42+(V-M)*.3,g]);for(const A of[-1,1])e.quad([A*p,M,c],[A*S,V,g],[A*S,.42+(V-M)*.3,g],[A*p,.42,c])};t(-2.2,2,.56,.56,.02,.02),t(-2.2,-3.4,.56,.4,.02,.3),t(2,3.3,.56,.42,.02,.28),e.box(0,.36,-.6,1.1,.06,.25),e.box(0,.36,.9,1.1,.06,.25);const o=2.5,a=[.02,1.3,o+.04],n=[.1,1.84,o-.18],s=.13,l=o-.23;e.cyl([-.14,.4,o+.24],[-.12,.86,o+.2],.06,.075,5),e.cyl([-.12,.86,o+.2],a,.075,.09,5),e.cyl([.17,.4,o-.26],[.13,.86,o-.14],.06,.075,5),e.cyl([.13,.86,o-.14],a,.075,.09,5),e.cyl(a,[.05,1.56,o-.06],.13,.14,6),e.cyl([.05,1.56,o-.06],n,.14,.17,6),e.cyl(n,[.11,1.92,o-.2],.17,.05,6),e.cyl([s-.01,1.9,l+.02],[s,2.02,l],.05,.1,6),e.cyl([s,2.02,l],[s,2.13,l],.1,.095,6),e.cyl([s,2.13,l],[s,2.2,l],.095,.05,6),e.cyl([s,2.15,l-.02],[s,2.17,l-.02],.15,.14,7),e.cyl([s,2.17,l-.02],[s,2.22,l],.11,.1,7),e.cyl([-.04,1.8,o-.14],[.36,1.52,o-.36],.055,.045,4),e.cyl([.36,1.52,o-.36],[.62,1.74,o-.08],.045,.035,4),e.cyl([.24,1.78,o-.14],[.52,1.32,o+.1],.055,.045,4),e.cyl([.52,1.32,o+.1],[.62,1.2,o+.3],.045,.035,4),e.cyl([0,.4,-3.2],[0,1,-3.2],.025,.025,3),le(O,e.geometry());const i=new de;i.cyl([0,-2.6,0],[0,2.4,0],.03,.022,4),ve.position.set(.62,1.45,o+.1),le(ve,i.geometry()),O.add(ve)}const Le=ye("#FFE08A"),$e=new r.Mesh(new r.OctahedronGeometry(.1,1),new r.MeshBasicMaterial({color:Le.clone().multiplyScalar(7),fog:!1}));$e.position.set(0,1.08,-3.2),O.add($e);const lt=Yt(),Ce=new r.Sprite(new r.SpriteMaterial({map:lt,color:Le.clone().multiplyScalar(1.6),blending:r.AdditiveBlending,depthWrite:!1,fog:!1,transparent:!0}));Ce.position.copy($e.position),Ce.scale.setScalar(2.6),O.add(Ce);const ze=new r.Sprite(new r.SpriteMaterial({map:lt,color:Le.clone().multiplyScalar(.7),blending:r.AdditiveBlending,depthWrite:!1,depthTest:!1,fog:!1,transparent:!0}));ze.position.set(0,-1.3,-3.2),ze.scale.set(1.3,4.4,1),O.add(ze);const ct=m.chance(.5)?1.9:-1.9;O.position.set(ct,0,322),x.add(O),await u.yield();const ut=[];{const e=-Math.sign(ct);for(let t=0;t<2;t++){const o=new r.Group,a=new r.Group,n=new de,s=new de,l=t?.86:1;n.cyl([0,.74,.5],[0,.78,-.38],.2,.2,7),n.cyl([0,.74,.5],[0,.7,.66],.2,.08,7),n.cyl([0,.78,-.38],[0,.84,-.52],.2,.11,7);for(const[i,c]of[[-.1,.45],[.1,.5],[-.09,-.34],[.09,-.3]])n.cyl([i,.66,c],[i,.36,c+.03],.07,.035,4),n.cyl([i,.36,c+.03],[i,-.4,c],.035,.028,4);n.tri([0,.82,.62],[.05,.7,.72],[-.05,.7,.72],0,0,0,1),s.cyl([0,0,0],[0,.44,-.22],.11,.065,6),s.cyl([0,.44,-.22],[0,.4,-.5],.075,.032,6),s.cyl([0,.36,-.14],[0,.5,-.24],.09,.08,6);for(const i of[-1,1])s.tri([i*.03,.5,-.2],[i*.15,.66,-.14],[i*.07,.52,-.13],0,0,0,1);if(t===0)for(const i of[-1,1])s.cyl([i*.03,.5,-.24],[i*.07,.68,-.22],.012,.01,3),s.cyl([i*.07,.68,-.22],[i*.05,.78,-.3],.01,0,3);le(o,n.geometry()),le(a,s.geometry()),a.position.set(0,.84,-.46),o.add(a),o.position.set(e*(2.55+t*.35),0,304-t*4.2),o.rotation.y=e*(1.1-t*.5),o.scale.setScalar(l),x.add(o),ut.push({neck:a,ph:t*1.7,lag:t*.35})}}const H=b.fork("reeds"),Y=[],Fe=(e,t,o)=>{const a=o<1.2,n=a&&H()<.6;Y.push({x:e,z:t,sd:o,h:n?H.range(1.5,2):H.range(2.1,3)*(a?.85:1),yaw:H.range(-.6,.6)+(H()<.15?1.57:0),col:n?3:Math.floor(H()*3),w:H.range(1.7,2.6),lean:H.range(-.3,.3)})},Tt=Math.round(8500*w*f),Ct=Math.round(2e4*w*f);for(let e=0;e<Tt;e++){(e&1023)===1023&&await u.yield();const t=H.range(196,660),o=4.6+Math.pow(H(),1.5)*13,a=(H()<.5?-1:1)*o;Math.abs(t-280)<1.4&&o<7.5||Fe(a,t,$(a,t))}await u.yield();for(let e=0,t=0;e<Ct&&t<6e5;t++){(t&4095)===4095&&await u.yield();const o=H.range(-500,500),a=H.range(-700,300),n=$(o,a);n<-3.5||n>13||n>6&&H()<(n-6)/7||Math.abs(o)<4.6&&a>150||(Fe(o,a,n),e++)}for(let e=0,t=Math.round(190*f);e<t;e++){const o=H.range(0,6.283),a=H.range(.92,1.6),n=Z.x+1+Math.cos(o)*6.4*a,s=Z.z+Math.sin(o)*4.5*a;Math.hypot(n-(Z.x+4.2),s-(Z.z+1))<1.7||Fe(n,s,Math.min($(n,s),1))}for(let e=0,t=Math.round(600*f);e<t;e++)Fe(N+(H()<.5?-1:1)*H.range(5.6,9),H.range(-520,620),8);await u.yield(),Y.sort((e,t)=>(e.sd<4?0:1)-(t.sd<4?0:1));let Re=0;for(;Re<Y.length&&Y[Re].sd<4;)Re++;await u.yield();{const e=new r.InstancedBufferGeometry;e.setAttribute("position",new r.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),e.setAttribute("uv",new r.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),e.setIndex([0,1,2,0,2,3]);const t=new Float32Array(Y.length*4),o=new Float32Array(Y.length*4);for(let S=0;S<Y.length;S++){const M=Y[S];t.set([M.x,M.z,M.h,M.yaw],S*4),o.set([M.col,H(),M.w,M.lean],S*4),(S&4095)===4095&&await u.yield()}const a=new r.InstancedBufferAttribute(t,4),n=new r.InstancedBufferAttribute(o,4);e.setAttribute("iPos",a),e.setAttribute("iVar",n),e.instanceCount=Y.length,await u.yield();const s=Xt(H),l={..._,uMirror:{value:1},uMap:{value:s},uRimK:{value:k?.4:.055}},i=new r.Mesh(e,new r.ShaderMaterial({uniforms:l,vertexShader:yt,fragmentShader:wt,side:r.DoubleSide,fog:!1}));i.frustumCulled=!1,x.add(i);const c=new r.InstancedBufferGeometry;c.setAttribute("position",e.getAttribute("position")),c.setAttribute("uv",e.getAttribute("uv")),c.setIndex(e.getIndex()),c.setAttribute("iPos",a),c.setAttribute("iVar",n),c.instanceCount=Re;const g={..._,uMirror:{value:-1},uMap:{value:s},uRimK:{value:0},uInk:{value:Ke}},p=new r.Mesh(c,new r.ShaderMaterial({uniforms:g,vertexShader:yt,fragmentShader:wt,...Oe}));p.frustumCulled=!1,p.renderOrder=-.8,x.add(p)}await u.yield();const R=b.fork("cast"),ge=[],Ie=[],ue=(e,t)=>e.push({pos:[0,0,0],vel:[0,0,0],wob:[0,0,0,0],half:.5,hz:3,neck:0,amp:.6,dih:.05,roll:.08,glide:0,clock:0,t0:0,wrap:0,sits:0,show:[-1,2],ph:R(),...t}),Ft=3;for(let e=0;e<Ft;e++){const t=Math.round(R.range(25,40)*w),o=R.range(14,18),a=R.range(-2,2),n=[R.range(150,650),R.range(250,400),R.range(-950,-260)],s=Math.hypot(o,a),l=[-o/s,a/s],i=3400/s,c=R.range(-8,8),g=R.range(.35,.65);for(let p=0;p<t;p++){const S=p===0?0:R()<g?1:-1,M=p===0?0:Math.ceil(p/2)+R.range(-.2,.2);ue(ge,{pos:[n[0]-l[0]*M*3.6-l[1]*S*M*2.7,n[1]+R.range(-.6,.6)+M*.12,n[2]-l[1]*M*3.6+l[0]*S*M*2.7],vel:[-o,0,a],half:.82,hz:1.6+R.range(-.1,.1),neck:.5,amp:.5,t0:c,wrap:i,wob:[.5,.4,.5,.5]})}}const We=[0,W?4.6:4.3,222];if(W)for(let e=0;e<7;e++)ue(Ie,{pos:[We[0]-Ae*(17*Me+e*3.8),We[1]+R.range(-.2,.2),We[2]+1.5*Me+e*.4],vel:[Ae*17,0,-1.5],half:.66,hz:5,neck:.5,amp:.6,clock:1});else for(let e=0;e<2;e++)ue(Ie,{pos:[se[e].x-se[e].z*Me,We[1]+e*.15,se[e].y-se[e].w*Me],vel:[se[e].z,0,se[e].w],half:1.35,hz:3,neck:.8,amp:.62,clock:1,ph:e*.31});ue(ge,{pos:[R.range(50,90),7.5,R.range(120,180)],wob:[60,2.5,95,.11],half:.62,hz:2.4,amp:.14,dih:.3,roll:.35,glide:.8}),ue(ge,{pos:[R.range(-160,-90),9,R.range(-120,40)],wob:[70,3,80,.09],half:.62,hz:2.4,amp:.14,dih:.3,roll:.35,glide:.8});const Rt=ie(34.2);for(let e=0;e<20;e++){const t=R.range(0,6.283),o=R.range(9.5,17);ue(ge,{pos:[Math.cos(t)*o,40+Math.sin(t)*o*.8,-388+R.range(3,55)],wob:[R.range(2,4),R.range(2,3.5),R.range(3,7),R.range(1.5,2.6)],half:.2,hz:11,amp:.95,roll:.5,show:[Rt+R.range(0,.02),2]})}for(const e of it)ue(ge,{pos:e,vel:[R.range(5,12),R.range(2.5,5.5),R.range(-14,-6)],half:.3,hz:12,amp:.8,glide:.5,clock:1,sits:1,t0:2.5+R()*10,wob:[0,0,0,0]});const Qe=Zt(),Ze=(e,t)=>{const o=new r.InstancedBufferGeometry;o.setAttribute("position",Qe.getAttribute("position")),o.setAttribute("aWN",Qe.getAttribute("aWN"));const a=e.length,n=A=>new Float32Array(a*A),s=n(3),l=n(3),i=n(4),c=n(4),g=n(4),p=n(4),S=n(2);e.forEach((A,U)=>{s.set(A.pos,U*3),l.set(A.vel,U*3),i.set(A.wob,U*4),c.set([A.half,A.hz,A.ph,A.neck],U*4),g.set([A.amp,A.dih,A.roll,A.glide],U*4),p.set([A.clock,A.t0,A.wrap,A.sits],U*4),S.set(A.show,U*2)});const M=(A,U)=>new r.InstancedBufferAttribute(A,U);o.setAttribute("iPos",M(s,3)),o.setAttribute("iVel",M(l,3)),o.setAttribute("iWob",M(i,4)),o.setAttribute("iPar",M(c,4)),o.setAttribute("iPar2",M(g,4)),o.setAttribute("iK",M(p,4)),o.setAttribute("iShow",M(S,2)),o.instanceCount=a;const V=new r.Mesh(o,new r.ShaderMaterial(t?{uniforms:rt,vertexShader:xt,fragmentShader:_e,...Oe}:{uniforms:st,vertexShader:xt,fragmentShader:_e,side:r.DoubleSide,fog:!1}));return V.frustumCulled=!1,t&&(V.renderOrder=-.8),x.add(V),V};Ze(ge,!1),Ze(Ie,!1),Ze(Ie,!0),Qe.dispose(),await u.yield();const q=b.fork("mist");let Ve;{const e=Math.round(64*(h.mistD/.006)**.5),t=new r.InstancedBufferGeometry;t.setAttribute("position",new r.Float32BufferAttribute([-.5,0,0,.5,0,0,.5,1,0,-.5,1,0],3)),t.setAttribute("uv",new r.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),t.setIndex([0,1,2,0,2,3]);const o=new Float32Array(e*4),a=new Float32Array(e*2);for(let n=0;n<e;n++)o.set([q.range(-520,520),-.6,q.range(-900,430),q()],n*4),a.set([q.range(90,230),q.range(9,17)],n*2);t.setAttribute("iPos",new r.InstancedBufferAttribute(o,4)),t.setAttribute("iSize",new r.InstancedBufferAttribute(a,2)),t.instanceCount=e,Ve=new r.Mesh(t,new r.ShaderMaterial({uniforms:{uTime:_.uTime,uSunDir:_.uSunDir,uMistCol:_.uMistCol,uMistWarm:_.uMistWarm,uOp:{value:.55}},vertexShader:Ot,fragmentShader:Lt,transparent:!0,depthWrite:!1,fog:!1})),Ve.frustumCulled=!1,Ve.renderOrder=3,x.add(Ve)}let ke;{const e=Math.round(1500*w*f),t=new Float32Array(e*3),o=new Float32Array(e*4);for(let l=0;l<e;l++){const i=l>e*.7,c=i?q.range(-60,60):(q()<.5?-1:1)*q.range(3,20),g=i?q.range(-420,200):q.range(200,420);t.set([c,i?q.range(1,9):q.range(.6,4.6),g],l*3),o.set([q(),q(),q(),q()],l*4)}const a=new r.BufferGeometry;a.setAttribute("position",new r.BufferAttribute(t,3)),a.setAttribute("aSeed",new r.BufferAttribute(o,4));const n={uTime:_.uTime,uPx:{value:500},uCol:{value:j(z.core,z.halo,.4).multiplyScalar(h.sunI>0?2.2:1.1)}};ke=new r.Points(a,new r.ShaderMaterial({uniforms:n,vertexShader:$t,fragmentShader:Qt,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,fog:!1})),ke.frustumCulled=!1,ke.renderOrder=4;const s=new r.Vector2;ke.onBeforeRender=(l,i,c)=>{const g=l.getRenderTarget(),p=g?g.height:l.getDrawingBufferSize(s).y;n.uPx.value=p*.5*c.projectionMatrix.elements[5]},x.add(ke)}const It=[{at:new r.Vector3(0,150,-280),from:ie(16),to:ie(25.2),weight:.85,fade:.22},{at:new r.Vector3(0,70,-390),from:ie(24.2),to:ie(30),weight:.8,fade:.25},{at:new r.Vector3(Z.x,11,Z.z),from:ie(28.2),to:ie(30.5),weight:.42,fade:.3}],ft=[2.2,3.4],Wt=h.sunEl[1]>h.sunEl[0],Vt=new r.Vector2;function dt(e,t,o,a=0){const n=Pt(a);_.uTime.value=t,_.uT.value=n,_.uU.value=a,_.uSkyQ.value.x=t;const s=L(h.sunEl[0],h.sunEl[1],a)*X;Je.set(0,Math.sin(s),-Math.cos(s));const l=Wt?1-a:a;if(_.cCor.value.copy(St).lerp(z.mag,.28*l),_.uSkyQ.value.y=h.star*(.55+.9*l),re.setShowTime(n),re.setWingmen(1-.65*Ee(16.5,18.2,n)*(1-Ee(24,25.6,n))),re.update(e,t,o),o){const p=u.renderer.getDrawingBufferSize(Vt).y;_.uMinS.value=1.5/Math.max(p*.5*o.projectionMatrix.elements[5],50)}Te.rotation.z=-t*Math.PI/3;const i=t*.33%1,c=Math.sin(Math.PI*Math.min(i*1.6,1));O.position.z=326-.6*n-.25*Math.sin(t*.33*Math.PI*2),O.rotation.z=.012*Math.sin(t*.9),O.rotation.x=.006*Math.sin(t*.66*Math.PI),ve.rotation.x=.12+.34*c,ve.rotation.z=-.08,ve.position.y=1.45+.5*(1-c),qe.uPunt.value.set(O.position.x,O.position.z+3.3,1);const g=1+.07*Math.sin(t*13.1)+.05*Math.sin(t*7.3+1)+.04*Math.sin(t*23.7);Ce.scale.setScalar(2.6*g),ze.scale.set(1.3*g,4.4,1),ze.material.rotation=.05*Math.sin(t*2.1);for(const p of ut){const S=Ee(ft[0]+p.lag,ft[1]+p.lag,n);p.neck.rotation.x=L(-1.25+.06*Math.sin(t*2.3+p.ph),.08+.05*Math.sin(t*.8+p.ph),S),p.neck.rotation.y=S*.5*Math.sin(t*.5+p.ph)*(1-Ee(5,7,n))-S*.4}qe.uSwanT.value.x=W?-100:n-Me}dt(0,0,null,0);const Et=k?d==="sunset"?" in Hard Frost":", Frost":"";return{scene:x,path:Ue,duration:40,title:F?"Two Murmurations":h.title+Et,ride:"none",style:"none",camera:{fov:62,near:.3,far:9e3,lookAhead:26,sway:1.3,bank:1.6},pois:It,portal:{shape:"circle",radius:7,color:h.portal,glow:1.15,revealDistance:300},post:{exposure:h.exposure,bloom:{strength:.62,radius:.72,threshold:.86},grade:{saturation:h.sat,contrast:1.05,tint:"#ffffff",shadowTint:"#0a0612",vignette:.25,grain:.03,aberration:0}},update:dt,dispose(){re.dispose();for(const e of P)e.dispose()}}}};export{o0 as default};
