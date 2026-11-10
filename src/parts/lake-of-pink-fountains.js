import*as c from"three";const de=["#E9A6A1","#6F93B8","#8DB36A","#3E5A3A","#F3E7C9","#C2362B","#1F2A33"],et={pink:0,slate:1,lawn:2,deep:3,ground:4,vermilion:5,ink:6},N={plain:0,scales:1,veins:2,rings:3,tube:4,dots:5,scallops:6,orchard:7,head:8,pits:9};function qe(p=de){const s=n=>new c.Color(p[n]||de[n]);return{uGround:{value:s(4)},uInk:{value:s(6)},uVerm:{value:s(5)},uTime:{value:0},uRes:{value:new c.Vector2(1920,1080)},uStreakDeg:{value:35},uWet:{value:1},uBoreA:{value:new c.Vector3(0,-1e4,0)},uBoreD:{value:new c.Vector3(0,0,1)},uBoreR:{value:7},uWinP:{value:new c.Vector3(0,-1e4,0)},uWinD:{value:new c.Vector3(1,0,0)},uWinR:{value:7.5},uInTube:{value:0},uPierce:{value:new c.Vector2(-1e3,-1e3)},uTubeLen:{value:140},uEve:{value:0},uSkyLow:{value:s(4)}}}const xe=`
varying vec3 vPig; varying vec3 vN; varying vec3 vWP; varying vec3 vAx; varying vec2 vUV; varying vec4 vPat;
`,Ee=`
attribute vec3 aPig; attribute vec3 aAxis; attribute vec2 aUV; attribute vec4 aPat;
${xe}
void main() {
  mat4 M = modelMatrix;
  #ifdef USE_INSTANCING
    M = modelMatrix * instanceMatrix;
  #endif
  vPig = aPig;
  #ifdef USE_INSTANCING_COLOR
    vPig = aPig * instanceColor;
  #endif
  vec4 wp = M * vec4(position, 1.0);
  vWP = wp.xyz;
  vN = mat3(M) * normal;
  vAx = mat3(M) * aAxis;
  vUV = aUV; vPat = aPat;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,Fe=`
uniform vec3 uGround; uniform vec3 uInk; uniform vec3 uVerm; uniform float uTime; uniform float uStreakDeg; uniform float uWet;
uniform vec3 uBoreA; uniform vec3 uBoreD; uniform float uBoreR;
uniform vec3 uWinP; uniform vec3 uWinD; uniform float uWinR; uniform float uInTube; uniform float uEve; uniform vec2 uPierce; uniform float uTubeLen;
${xe}
vec3 safeN(vec3 v, vec3 fb) { float l = length(v); return l > 1e-5 ? v / l : fb; }
// distance (m) to the edge of the opening this surface is cut by; negative = inside the hole (discard)
float cutDist(float cut) {
  float d = 1e3;
  if (cut > 0.5 && cut < 1.5) { vec3 r = vWP - uBoreA; d = length(cross(r, uBoreD)) - uBoreR; }
  else if (cut > 1.5 && cut < 2.5) { vec3 r = vWP - uWinP; float along = dot(r, uWinD);
    d = length(r - uWinD * along) - uWinR; float behind = -along - 3.0; if (behind > 0.0) d = max(d, behind); }
  else if (cut > 2.5) { float circ = vPat.y; float s = vUV.y;
    float k = floor(s / 9.0 - 0.5);                          // the two nearest ports, so the distance has no jump
    // three ports round the bore at each station, the next station turned a sixth: the glass is an openwork of round windows
    float du0 = (fract((vUV.x - mod(k, 2.0) / 6.0) * 3.0 + 0.5) - 0.5) * circ / 3.0;
    float du1 = (fract((vUV.x - mod(k + 1.0, 2.0) / 6.0) * 3.0 + 0.5) - 0.5) * circ / 3.0;
    d = min(length(vec2(du0, s - k * 9.0 - 4.5)), length(vec2(du1, s - k * 9.0 - 13.5))) - 3.3; }
  return d;
}
// interior hairlines. returns x = dark line cover 0..1, y = ivory dot cover 0..1
vec2 patternLines(float id, vec2 cuv, vec2 dc) {
  float dmax = max(dc.x, dc.y);
  float crisp = 1.0 - smoothstep(0.11, 0.25, dmax);          // spacing over ~9 px crisp, under 4 px flat
  float row = floor(cuv.y);
  vec2 res = vec2(0.0);
  if (id > 0.5 && id < 1.5) {                                // scales: ruled rows, tip down, one vein each
    float x = fract(cuv.x + 0.5 * mod(row, 2.0)) - 0.5; float y = fract(cuv.y);
    float e = sqrt(4.0 * x * x + y * y);                     // arc hangs from the row line above
    float w = (4.0 * abs(x) * dc.x + y * dc.y) / max(e, 0.25);
    w = max(min(1.5 * w, 0.11), 1e-4);
    float ln = 1.0 - smoothstep(0.5 * w, w, abs(e - 1.0));
    float wv = max(min(1.2 * dc.x, 0.06), 1e-4);
    float vein = (1.0 - smoothstep(0.5 * wv, wv, abs(x))) * (1.0 - smoothstep(0.7, 0.82, y)) * step(0.18, y) * 0.7;
    res.x = mix(0.2, max(ln, vein), crisp);
  } else if (id > 1.5 && id < 2.5) {                         // veins: lines along the profile
    float x = abs(fract(cuv.x) - 0.5); float w = max(min(1.5 * dc.x, 0.1), 1e-4);
    float c1 = 1.0 - smoothstep(0.11, 0.25, dc.x);
    res.x = mix(0.14, 1.0 - smoothstep(0.5 * w, w, x), c1);
  } else if (id > 2.5 && id < 3.5) {                         // rings: joint lines across the profile
    float y = abs(fract(cuv.y) - 0.5); float w = max(min(1.5 * dc.y, 0.1), 1e-4);
    float c1 = 1.0 - smoothstep(0.11, 0.25, dc.y);
    res.x = mix(0.14, 1.0 - smoothstep(0.5 * w, w, y), c1);
  } else if (id > 3.5 && id < 4.5) {                         // tube: a double ring joint every 6 m
    float s = vUV.y / 6.0; float ds = dc.y * vPat.z / 6.0;
    float y = abs(abs(fract(s) - 0.5) - 0.035); float w = max(min(1.5 * ds, 0.03), 1e-4);
    res.x = 1.0 - smoothstep(0.5 * w, w, y);
    // the glass between the joints is ruled like everything else: fine veins that are whole by the joint and fray into
    // dashes midway, a row of small arcs hanging off each joint, and the ivory streak broken into dashes
    float tn = vUV.x; float dtn = max(dc.x / max(vPat.y, 1e-3), 1e-6);   // turns round the bore, and turns per pixel
    float e = abs(fract(s) - 0.5);                            // 0 on the joint, 0.5 midway to the next
    float vx = abs(fract(tn * 22.0) - 0.5); float dv = dtn * 22.0; float wv = max(min(1.5 * dv, 0.08), 1e-4);
    float dsh = 0.5 + 0.5 * sin(vUV.y * 5.0 + floor(tn * 22.0) * 2.4 - uTime * 1.3 * uWet);   // wet paint: the dashes creep up the glass
    float vein = (1.0 - smoothstep(0.5 * wv, wv, vx)) * step(dsh, 1.15 - 1.9 * e) * step(0.07, e);
    res.x = max(res.x, mix(0.1, vein * 0.7, 1.0 - smoothstep(0.1, 0.24, dv)));
    float ya = (e - 0.05) / 0.1;
    if (ya > 0.0 && ya < 1.06) {
      float xa = fract(tn * 44.0) - 0.5; float da = dtn * 44.0; float dy = ds / 0.1;
      float ea = sqrt(4.0 * xa * xa + ya * ya);
      float wa = (4.0 * abs(xa) * da + ya * dy) / max(ea, 0.25); wa = max(min(1.5 * wa, 0.11), 1e-4);
      res.x = max(res.x, mix(0.18, 1.0 - smoothstep(0.5 * wa, wa, abs(ea - 1.0)), 1.0 - smoothstep(0.11, 0.25, max(da, dy))));
    }
    float sw = max(0.007, 0.75 * dtn);
    float st = 1.0 - smoothstep(sw - 0.5 * dtn, sw + 0.5 * dtn, abs(tn - 0.165));
    float dash2 = 0.5 + 0.5 * sin(vUV.y * 9.0 + 1.6 * uWet * sin(uTime * 0.6 + vUV.y * 0.13));
    res.y = st * smoothstep(dash2 - 0.04, dash2 + 0.04, smoothstep(0.04, 0.2, e) * 1.25) * step(0.04, e);
    // two ruled rows of single ivory touches between the veins, midway and a third of the way from each joint
    float cw = vPat.y / 22.0; float dpx = max(max(dtn * vPat.y, ds * 6.0), 1e-4);
    float d1 = length(vec2((fract(tn * 22.0 + 0.5) - 0.5) * cw, (e - 0.5) * 6.0));
    float d2 = length(vec2((fract(tn * 22.0) - 0.5) * cw, (e - 0.27) * 6.0));
    float dq = min(d1, d2 + 0.05); float cd2 = 1.0 - smoothstep(0.07, 0.16, dpx);
    res.y = max(res.y, mix(0.04, 1.0 - smoothstep(0.2 - 0.5 * dpx, 0.2 + 0.5 * dpx, dq), cd2));
    res.x = max(res.x, (1.0 - smoothstep(0.2 + dpx, 0.2 + 2.5 * dpx, dq)) * smoothstep(0.2, 0.2 + dpx, dq) * cd2 * 0.8);
  } else if ((id > 4.5 && id < 5.5) || (id > 6.5 && id < 7.5)) {   // dots: ruled rows of single ivory touches
    float x = fract(cuv.x + 0.5 * mod(row, 2.0)) - 0.5; float y = fract(cuv.y) - 0.5;
    float dd = length(vec2(x, y)); float wd = max(dmax, 1e-4);
    res.y = mix(id > 6.5 ? 0.07 : 0.12, 1.0 - smoothstep(0.2, 0.2 + wd, dd), crisp);
    res.x = mix(0.06, (1.0 - smoothstep(0.2 + wd, 0.2 + 2.5 * wd, dd)) * smoothstep(0.2, 0.2 + wd, dd), crisp);
  } else if (id > 5.5 && id < 6.5) {                         // scallops: feather rows, tip down, no vein
    float x = fract(cuv.x + 0.5 * mod(row, 2.0)) - 0.5; float y = fract(cuv.y);
    float e = sqrt(4.0 * x * x + y * y);
    float w = (4.0 * abs(x) * dc.x + y * dc.y) / max(e, 0.25); w = max(min(1.5 * w, 0.11), 1e-4);
    res.x = mix(0.16, 1.0 - smoothstep(0.5 * w, w, abs(e - 1.0)), crisp);
    if (id > 6.35) { res.y = res.x * 0.85; res.x = 0.0; }    // 6.45, a folded wing: every feather edged in ivory on the dark
    else if (id > 6.1) res.x *= smoothstep(0.07, 0.27, abs(vUV.x - 0.5)) * (0.55 + 0.45 * smoothstep(0.2, 0.75, vPat.w));   // 6.25, plumage: fine scallops gathered on nape, back and flank, thinning to a smooth breast
  } else if (id > 8.5) {                                     // pits: ruled rows of seeds, each an ivory seed sunk in a dark crescent pit
    float x = fract(cuv.x + 0.5 * mod(row, 2.0)) - 0.5; float y = fract(cuv.y) - 0.5;
    float wd = max(dmax, 1e-4);
    float sd = 1.0 - smoothstep(0.17, 0.17 + wd, length(vec2(x * 1.2, y + 0.05)));
    float pit = 1.0 - smoothstep(0.29, 0.29 + wd, length(vec2(x, y - 0.045)));
    res.y = mix(0.07, sd, crisp);
    res.x = mix(0.13, pit * (1.0 - sd), crisp);
  }
  return res;
}
`,_e=`
${Fe}
uniform float uBackDark; uniform float uPale;
void main() {
  float cut = floor(vPat.x / 10.0 + 0.01); float id = vPat.x - cut * 10.0;
  float cd = cutDist(cut);
  if (cd < 0.0) discard;
  vec3 V = safeN(cameraPosition - vWP, vec3(0.0, 0.0, 1.0));
  vec3 N = safeN(vN, vec3(0.0, 1.0, 0.0));
  bool back = !gl_FrontFacing; if (back) N = -N;
  float f = clamp(dot(N, V), 0.0, 1.0);
  // interior hairlines, drawn in the surface's own coordinates
  vec2 cuv = vec2(vUV.x * vPat.y, vUV.y / max(vPat.z, 1e-3));
  vec2 dc = min(fwidth(cuv), vec2(2.0));
  vec2 pl = patternLines(id > 7.5 && id < 8.5 ? 6.0 : id, cuv, dc);
  vec3 pig = vPig; float seam = 0.0;
  if (id > 7.5 && id < 8.5) {                                 // the goldfinch's head: each area laid flat to a hard curved edge, a hairline between
    float th = (1.0 - vPat.w) * 3.14159265;                   // angle from the beak's base round the ball: 0 at the beak, pi at the nape
    float ph = min(vUV.x, 1.0 - vUV.x) * 6.2831853;           // 0 on the crown, pi under the chin
    float sp = sin(ph);
    // the vermilion mask: a rounded patch round the base of the beak, widest at the side (just past the eye), narrow on the forehead
    float fm = (0.66 + 0.4 * sp * sp + 0.1 * (1.0 - cos(ph))) - th;
    // the blue-black cap on the crown, and behind the ivory cheek its crescent coming down, a point at the throat
    float bw = 0.3 * sqrt(max(1.0 - ph * ph / 6.2, 0.0));
    float thB = 1.92 - 0.16 * cos(ph);                        // the cheek's back edge, a curve
    float fcap = min((0.72 + 0.14 * smoothstep(1.1, 2.0, th)) - ph, 2.5 - th);
    float fc = max(fcap, bw - abs(th - thB - bw));
    float am = max(fwidth(fm), 1e-5); float ac = max(fwidth(fc), 1e-5);
    float inM = smoothstep(-0.5 * am, 0.5 * am, fm); float inC = smoothstep(-0.5 * ac, 0.5 * ac, fc) * (1.0 - inM);
    pig = mix(mix(vPig, uInk, inC), uVerm, inM);
    seam = max(1.0 - smoothstep(0.7 * am, 1.4 * am, abs(fm)), (1.0 - smoothstep(0.7 * ac, 1.4 * ac, abs(fc))) * (1.0 - inM));
    pl.x *= 1.0 - 0.75 * inM;
  } else if (id > 2.5 && id < 3.5 && vPat.y > 1.5) {          // a barred ball (the owl's head, seen from behind): level bars of thin blue-black ruled across it
    float hgt = sin(vPat.w * 3.14159265) * cos(vUV.x * 6.2831853) * 0.5 * vPat.y;
    float ab = max(fwidth(hgt), 1e-5);
    float bar = smoothstep(0.25 - 0.5 * ab, 0.25 + 0.5 * ab, abs(fract(hgt) - 0.5));
    bar = mix(0.5, bar, 1.0 - smoothstep(0.2, 0.45, ab));     // bars under about 4 px keep their flat average
    pig = mix(vPig, mix(uInk, vPig, 0.2), bar);
    pl.x = 0.0;
  }
  // glaze: full pigment at the rim, the chalk ground showing where the form faces us
  float lum = dot(pig, vec3(0.3, 0.5, 0.2));                  // dark glazes are laid thicker: blue-black and deep green pale less
  vec3 col = mix(pig, uGround, uPale * mix(0.3, 1.0, smoothstep(0.03, 0.25, lum)) * f * sqrt(f));
  float sr = sqrt(max(1.0 - f * f, 0.0));
  col = mix(col, uInk, 0.3 * smoothstep(0.8333, 1.0, sr));
  col = mix(col, mix(pig, uInk, 0.6), pl.x * 0.9);
  col = mix(col, uInk, seam * 0.9);
  vec3 dotCol = uGround;
  if (id > 6.5) {                                             // orchard: about a third of the dots are vermilion fruit
    float row = floor(cuv.y); vec2 cell = vec2(floor(cuv.x + 0.5 * mod(row, 2.0)), row);
    float isFruit = step(0.62, fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453));
    float crispM = 1.0 - smoothstep(0.11, 0.25, max(dc.x, dc.y));
    dotCol = mix(mix(uGround, uVerm, 0.38), mix(uGround, uVerm, isFruit), crispM);
  }
  col = mix(col, dotCol, pl.y);
  // the streak: one hard ivory band, 5 degrees of lathe angle, upper left of the camera's bearing
  vec3 d = safeN(vAx, vec3(0.0, 1.0, 0.0));
  vec3 rt = safeN(cross(vec3(0.0, 1.0, 0.0), V), vec3(1.0, 0.0, 0.0));
  vec3 upv = cross(V, rt);
  float a = radians(uStreakDeg) + uWet * 0.04 * sin(uTime * 0.45 + d.x * 3.1 + d.z * 2.3);   // wet paint: the streak never quite sits still
  vec3 L = safeN(V * cos(a) - rt * sin(a) + upv * 0.42, V);
  vec3 nP = N - d * dot(N, d); vec3 lP = L - d * dot(L, d);
  float ln = length(nP); float ll = length(lP);
  float ay = dot(cross(lP, nP), d); float ax = dot(nP, lP);
  float ang = atan(ay, ax + step(abs(ax) + abs(ay), 1e-6) * 1e-5);
  float aa = clamp(fwidth(ang), 1e-4, 0.2);
  float hw = max(radians(2.5), 0.75 * aa);
  float band = 1.0 - smoothstep(hw - 0.5 * aa, hw + 0.5 * aa, abs(ang));
  band *= smoothstep(0.2, 0.35, ln) * smoothstep(0.2, 0.35, ll);
  band *= 1.0 - smoothstep(0.06, 0.16, aa);                    // a form under ~30 px across keeps its flat average: no streak
  float t = vPat.w;
  float env = smoothstep(0.04, 0.16, t) * (1.0 - smoothstep(0.84, 0.96, t));
  float dash = 0.5 + 0.5 * sin(t * 300.0 + uWet * 1.6 * sin(uTime * 0.6 + vWP.y * 0.13 + vWP.x * 0.07));
  band *= smoothstep(dash - 0.04, dash + 0.04, env * 1.08) * step(0.001, env);
  if (back) {
    band = 0.0;
    if (cut > 1.5 && cut < 2.5) col = uInk;                                      // inside the globe: thin blue-black
    else if (cut < 2.5) col = mix(col, uInk, uBackDark);                         // inside the skirt: deeper glaze
  }
  col = mix(col, uGround, band);
  // a hairline round every true opening
  float cw = max(fwidth(cd), 1e-4) * 1.6;
  float rimL = (1.0 - smoothstep(0.6 * cw, cw, cd)) * step(0.5, cut);
  #ifdef GLASS
    rimL *= 1.0 - 0.55 * uInTube;
  #endif
  col = mix(col, uInk, rimL);
  #ifdef GLASS
    // seen from inside, the great tube is clear glass: thin where the wall is beside us, gathering to full azurite down the bore;
    // every joint, vein, dot and the streak stay as painted on it
    float ga = mix(0.96, 0.3, smoothstep(0.08, 0.42, f));
    // (outside review, round 5) no veil at the lens: within a few metres of the eye the glass is all but clear and only what is
    // painted on it shows; it takes its azurite again with distance down the bore
    // (the last metres at each mouth keep theirs, so the ring we fly out through is whole)
    float lipS = min(vUV.y, uTubeLen - vUV.y);
    ga *= mix(0.16, 1.0, max(smoothstep(6.0, 42.0, length(vWP - cameraPosition)), 1.0 - smoothstep(2.5, 6.0, lipS)));
    // inside the skirt there is only its scaled wall beyond the glass: there the wall keeps most of its azurite and the round ports do the showing
    ga = max(ga, 0.8 * smoothstep(uPierce.x - 5.0, uPierce.x + 5.0, vUV.y) * (1.0 - smoothstep(uPierce.y - 5.0, uPierce.y + 5.0, vUV.y)));
    float keep = max(max(pl.x, pl.y) * mix(1.0, 0.4, smoothstep(0.1, 0.4, f)), max(band, rimL));   // the fine veins and touches thin with the glass beside us; joints, streak and port rims stay
    gl_FragColor = vec4(col, mix(1.0, max(ga, keep), uInTube));
  #else
    gl_FragColor = vec4(col, 1.0);
  #endif
}`,je=`
attribute vec3 aPig; attribute vec3 aAxis; attribute vec2 aUV; attribute vec4 aPat;
uniform vec2 uRes; uniform vec2 uOff; uniform float uPush; uniform vec2 uBack;
${xe}
void main() {
  mat4 M = modelMatrix;
  #ifdef USE_INSTANCING
    M = modelMatrix * instanceMatrix;
  #endif
  vec4 wp = M * vec4(position, 1.0);
  vWP = wp.xyz; vN = mat3(M) * normal; vAx = aAxis; vUV = aUV; vPat = aPat; vPig = aPig;
  vec3 ray = wp.xyz - cameraPosition; float rl = max(length(ray), 1e-3);
  vec4 cp = projectionMatrix * viewMatrix * vec4(wp.xyz + ray / rl * (uBack.x + uBack.y * rl), 1.0);   // sink the hull along the view ray: same pixel, a little deeper
  vec3 nv = mat3(viewMatrix) * vN;
  vec2 dir = nv.xy * vec2(projectionMatrix[0][0], projectionMatrix[1][1]);
  float l = length(dir);
  dir = dir / max(l, 1e-4) * min(1.0, l / max(0.3 * length(nv), 1e-4));
  float px = max(0.0015 * uRes.y, 1.5) * uPush;            // 0.15 % of buffer height, never under 1.5 px
  cp.xy += (dir * px + uOff) * 2.0 / uRes * cp.w;
  gl_Position = cp;
}`,Qe=`
${Fe}
uniform float uGhost;
void main() {
  float cut = floor(vPat.x / 10.0 + 0.01);
  if (cutDist(cut) < 0.0) discard;
  if (cut > 2.5 && uInTube > 0.9) discard;                    // from inside the glass tube its outer contour is not drawn
  gl_FragColor = vec4(mix(uInk, uGround, uGhost), 1.0);
}`;function We(p,s={}){return new c.ShaderMaterial({uniforms:{...p,uBackDark:{value:s.backDark??.14},uPale:{value:s.pale??.55}},vertexShader:Ee,fragmentShader:_e,side:s.side??c.DoubleSide,...s.glass?{defines:{GLASS:1},transparent:!0,depthWrite:!0}:{}})}function ye(p,s={}){const n=!!s.ghost;return new c.ShaderMaterial({uniforms:{...p,uOff:{value:new c.Vector2(n?3.5:0,n?3:0)},uPush:{value:s.push??1},uGhost:{value:n?.45:0},uBack:{value:new c.Vector2(n?.5:.05,n?.008:.002)}},vertexShader:je,fragmentShader:Qe,side:c.BackSide})}const Ge=new c.Vector2;function Ye(p,s){p.onBeforeRender=n=>{const P=n.getRenderTarget();P?s.uRes.value.set(P.width,P.height):(n.getDrawingBufferSize(Ge),s.uRes.value.copy(Ge))}}function Oe(p,s={}){return new c.ShaderMaterial({uniforms:{...p,uSolid:{value:s.solid??0}},vertexShader:`
      attribute vec4 aDot; attribute vec3 aTint; uniform vec2 uRes; uniform float uEve;
      varying vec2 vQ; varying vec3 vTint; varying float vPx;
      void main() {
        vec4 mv = viewMatrix * modelMatrix * vec4(aDot.xyz, 1.0);
        float sc = length(modelMatrix[0].xyz);
        float r = abs(aDot.w) * sc * mix(1.0, smoothstep(0.1, 0.85, uEve), step(aDot.w, -1e-5));   // a negative radius marks a pearl that opens as the day turns (uEve)
        float pxm = projectionMatrix[1][1] * uRes.y * 0.5 / max(-mv.z, 0.1);   // pixels per metre here
        vPx = r * pxm;
        mv.xy += position.xy * r;
        vQ = position.xy; vTint = aTint;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uGround; uniform vec3 uInk; uniform float uSolid; varying vec2 vQ; varying vec3 vTint; varying float vPx;
      void main() {
        float r = length(vQ); if (r > 1.0) discard;
        float lw = clamp(1.6 / max(vPx, 1.0), 0.05, 0.45);            // hairline, ~1.6 px
        vec3 col = mix(uGround, vTint, mix(0.5 * smoothstep(0.35, 1.0, r), 0.6 + 0.4 * smoothstep(0.2, 1.0, r), uSolid));
        float hl = length(vQ - vec2(-0.32, 0.36));                     // the one touch of pure ground, upper left
        col = mix(col, uGround, 1.0 - smoothstep(0.16, 0.24, hl));
        col = mix(col, uInk, smoothstep(1.0 - lw, 1.0 - 0.5 * lw, r) * 0.9);
        gl_FragColor = vec4(col, 1.0);
      }`})}function He(p){return new c.ShaderMaterial({uniforms:p,transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec4 aBub; attribute vec4 aRise; uniform vec2 uRes; uniform float uTime; uniform float uEve;
      varying vec2 vQ; varying float vPx; varying float vLife;
      void main() {
        float h = max(aRise.z, 1e-3);
        float k = fract(aRise.x + uTime * aRise.y / h);
        float wob = abs(aRise.w);                                // a negative wobble marks a bubble of the evening rise: it swells out of nothing as the day turns (uEve)
        vec3 c = aBub.xyz + vec3(sin(k * 9.0 + aRise.x * 40.0) * wob, k * h, cos(k * 7.0 + aRise.x * 23.0) * wob);
        vLife = smoothstep(0.0, 0.08, k) * (1.0 - smoothstep(0.9, 1.0, k));
        vec4 mv = viewMatrix * modelMatrix * vec4(c, 1.0);
        float r = aBub.w * length(modelMatrix[0].xyz) * (0.55 + 0.45 * k) * mix(1.0, smoothstep(0.35, 0.95, uEve), step(aRise.w, -1e-4));
        vPx = r * projectionMatrix[1][1] * uRes.y * 0.5 / max(-mv.z, 0.1);
        mv.xy += position.xy * r; vQ = position.xy;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uGround; uniform vec3 uInk; varying vec2 vQ; varying float vPx; varying float vLife;
      void main() {
        float r = length(vQ); if (r > 1.0) discard;
        float lw = clamp(1.6 / max(vPx, 1.0), 0.02, 0.5);
        float ring = smoothstep(1.0 - lw, 1.0 - 0.5 * lw, r);
        float ang = atan(vQ.y, vQ.x - 1e-4 * step(abs(vQ.x) + abs(vQ.y), 1e-5));
        float arc = (1.0 - smoothstep(0.03, 0.05, abs(r - 0.74))) * (1.0 - smoothstep(0.45, 0.5, abs(ang - 2.3)));
        vec3 col = mix(uGround, uInk, ring * (1.0 - arc));
        float al = max(max(ring * 0.9, arc), 0.07 + 0.2 * r * r * r * r) * vLife;   // the film gathers toward its rim, so a bubble is a glass ball and not a bare ring
        gl_FragColor = vec4(col, al);
      }`})}function $e(p,s={}){return new c.ShaderMaterial({uniforms:{...p,uCol:{value:new c.Color(s.color??de[4])},uFlow:{value:s.flow??0},uSway:{value:s.sway??0}},side:c.DoubleSide,vertexShader:`
      attribute vec3 aTan; attribute vec3 aRib; uniform vec2 uRes; uniform float uTime; uniform float uSway;
      varying vec2 vR; varying float vPxW;
      void main() {
        vec3 p = position;
        p.xz += uSway * aRib.y * aRib.y * vec2(sin(uTime * 1.3 + p.y * 0.2), cos(uTime * 1.1 + p.y * 0.17));
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vec3 tv = mat3(modelViewMatrix) * aTan;
        vec2 perp = vec2(-tv.y, tv.x); float l = length(perp);
        perp = l > 1e-5 ? perp / l : vec2(1.0, 0.0);
        float pxm = projectionMatrix[1][1] * uRes.y * 0.5 / max(-mv.z, 0.1);
        float w = max(aRib.z * length(modelMatrix[0].xyz), 1.6 / pxm);
        vPxW = w * pxm;
        mv.xy += perp * aRib.x * w * 0.5;
        vR = aRib.xy;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uGround; uniform vec3 uInk; uniform vec3 uCol; uniform float uTime; uniform float uFlow;
      varying vec2 vR; varying float vPxW;
      void main() {
        // falling water breaks into dashes toward its end; the dashes run down with uFlow
        float t = vR.y;
        float dash = 0.5 + 0.5 * sin(t * 70.0 - uTime * uFlow);
        float gate = uFlow > 0.0 ? smoothstep(dash - 0.05, dash + 0.05, 1.25 - t * 1.1) : 1.0;
        if (gate < 0.5) discard;
        float e = abs(vR.x);
        float lw = clamp(1.5 / max(vPxW, 1.0), 0.02, 0.6);
        vec3 col = mix(uCol, uInk, step(3.5, vPxW) * smoothstep(1.0 - lw, 1.0 - 0.5 * lw, e) * 0.8);
        gl_FragColor = vec4(col, 1.0);
      }`})}const e=c.Vector3,oe=new e,he=new e,Xe=new e;class Le{constructor(){this.pos=[],this.nor=[],this.pig=[],this.axis=[],this.uv=[],this.pat=[],this.idx=[],this.ghost=[],this.bone=[],this.useBones=!1}loft(s,n={}){const P=n.segs??12,k=s.length,g=this.pos.length/3,C=n.pig,O=(n.pat??0)+10*(n.cut??0),V=n.cells??1,D=n.row??1,B=[],j=[];for(let v=0;v<k;v++){const S=s[Math.max(0,v-1)].c,z=s[Math.min(k-1,v+1)].c,w=s[v].t?s[v].t.clone():new e().subVectors(z,S);w.lengthSq()<1e-10&&w.set(0,1,0),B.push(w.normalize())}const T=n.ref?n.ref.clone():Math.abs(B[0].y)>.9?new e(1,0,0):new e(0,1,0);let q=T.clone().addScaledVector(B[0],-T.dot(B[0]));q.lengthSq()<1e-8&&q.set(0,0,1),q.normalize();for(let v=0;v<k;v++)q=q.clone().addScaledVector(B[v],-q.dot(B[v])).normalize(),j.push(q);const E=[n.uv0??0];for(let v=1;v<k;v++)E.push(E[v-1]+Math.hypot(s[v].c.distanceTo(s[v-1].c),n.flatArc?0:s[v].r-s[v-1].r));const b=E[0],$=Math.max(E[k-1]-b,1e-6),ee=this.pos,ie=P+1;for(let v=0;v<k;v++){const S=s[v],z=B[v],w=j[v],K=oe.crossVectors(z,w),U=S.rz??S.r;for(let W=0;W<=P;W++){const ne=W/P*Math.PI*2,te=Math.cos(ne),H=Math.sin(ne);ee.push(S.c.x+w.x*te*S.r+K.x*H*U,S.c.y+w.y*te*S.r+K.y*H*U,S.c.z+w.z*te*S.r+K.z*H*U);const ce=n.paint&&n.paint((E[v]-b)/$,W/P,v)||S.pig||C;this.axis.push(z.x,z.y,z.z),this.pig.push(ce.r,ce.g,ce.b),this.uv.push(W/P,E[v]),this.pat.push(O,V,D,(E[v]-b)/$),this.bone.push(n.bone??0,n.bone?n.boneW?n.boneW((E[v]-b)/$):1:0)}}const le=(v,S,z)=>{const w=(g+v*ie+S)*3;return z.set(ee[w],ee[w+1],ee[w+2])};for(let v=0;v<k;v++){const S=Math.max(0,v-1),z=Math.min(k-1,v+1),w=B[v],K=j[v],U=new e().crossVectors(w,K);for(let W=0;W<=P;W++){const ne=(W-1+P)%P,te=(W+1)%P;le(v,te,oe).sub(le(v,ne,he)),le(z,W,he).sub(le(S,W,Xe));const H=new e().crossVectors(oe,he);H.lengthSq()<1e-12?H.copy(w).multiplyScalar(v<k/2?-1:1):H.normalize(),this.nor.push(H.x,H.y,H.z)}}const Z=n.ghost?[this.idx,this.ghost]:[this.idx];for(let v=0;v<k-1;v++)for(let S=0;S<P;S++){const z=g+v*ie+S,w=z+1,K=z+ie,U=K+1;for(const W of Z)W.push(z,w,K,w,U,K)}return this}lathe(s,n={}){const k=(n.smooth?Ne(s,n.smooth):s).map(([C,O])=>{const V=new e(0,O,0);return n.m&&V.applyMatrix4(n.m),{c:V,r:Math.max(C,0)*(n.scale??1)}});let g=new e(0,0,1);return n.m&&g.transformDirection(n.m),this.loft(k,{...n,ref:g})}geometry(){const s=new c.BufferGeometry;return s.setAttribute("position",new c.Float32BufferAttribute(this.pos,3)),s.setAttribute("normal",new c.Float32BufferAttribute(this.nor,3)),s.setAttribute("aPig",new c.Float32BufferAttribute(this.pig,3)),s.setAttribute("aAxis",new c.Float32BufferAttribute(this.axis,3)),s.setAttribute("aUV",new c.Float32BufferAttribute(this.uv,2)),s.setAttribute("aPat",new c.Float32BufferAttribute(this.pat,4)),this.useBones&&s.setAttribute("aBone",new c.Float32BufferAttribute(this.bone,2)),s.setIndex(this.idx),s}ghostGeometry(s){const n=new c.BufferGeometry;for(const P of["position","normal","aPig","aAxis","aUV","aPat"])n.setAttribute(P,s.getAttribute(P));return n.setIndex(this.ghost.length?this.ghost:[0,0,0]),n}}function Ne(p,s=4){const n=[],P=p.length;for(let k=0;k<P-1;k++){const g=p[Math.max(0,k-1)],C=p[k],O=p[k+1],V=p[Math.min(P-1,k+2)];for(let D=0;D<s;D++){const B=D/s,j=B*B,T=j*B,q=(E,b,$,ee)=>.5*(2*b+(-E+$)*B+(2*E-5*b+4*$-ee)*j+(-E+3*b-3*$+ee)*T);n.push([Math.max(0,q(g[0],C[0],O[0],V[0])),q(g[1],C[1],O[1],V[1])])}}return n.push(p[P-1].slice()),n}function se(p,s,n,P,k,g={}){const C=[],O=g.rings??5,V=g.bend??null,D=g.curl??.25;for(let B=0;B<O;B++){const j=B/(O-1),T=new e().copy(s).addScaledVector(n,P*j);V&&T.addScaledVector(V,P*D*j*j);const q=B===0?k*1.35:k*Math.pow(1-j,.8)*(1-.25*Math.exp(-((j-.12)**2)*90));C.push({c:T,r:B===O-1?0:q})}p.loft(C,{segs:g.segs??5,pig:g.pig,pat:N.plain,ghost:g.ghost})}const J=new e(-65.5,16,-23),re=new e(-70,36,41),Y=new e(0,96,0),R=27,F=new e(53,0,32).normalize(),be=(p,s,n)=>p.clone().lerp(s,n),fe=[[45.5,-3],[46.6,2],[48,12],[48.4,24],[48,36],[46.2,45],[42,52],[34,57.5],[24,61],[17.5,63.5]];function Me(p){for(let s=0;s<fe.length-1;s++){const n=fe[s],P=fe[s+1];if(p<=P[1]){const k=Math.max(0,(p-n[1])/(P[1]-n[1]));return n[0]+(P[0]-n[0])*k}}return fe[fe.length-1][0]}async function tt(p,s={}){const n=p.rng,P=s.detail??1,k=s.palette&&s.palette.length>=7?s.palette:de,g=s.uniforms??qe(k),C=k.map(a=>new c.Color(a)),O=s.colourway==="blue",V=O?C[1]:C[0],D=O?C[0]:C[1],B=C[6],j=C[4],T=be(V,B,.3),q=be(D,B,.3),E=be(V,j,.3),b=new Le,$=[],ee=s.tube!==!1,ie=new e().subVectors(re,J).normalize(),le=J.distanceTo(re),Z=[];if(ee){let a=null;for(let r=0;r<=le;r+=.5){oe.copy(J).addScaledVector(ie,r);const d=Math.hypot(oe.x,oe.z)<Me(oe.y);a!==null&&d!==a&&Z.push(r),a=d}}const v=Z.length===2,S=(a,r,d)=>{if(ee&&r<1){he.subVectors(a,J);const t=he.dot(ie);if(t>-2&&t<le+2&&he.addScaledVector(ie,-t).length()<7.9)return}$.push(a.x,a.y,a.z,r,d.r,d.g,d.b)},z=new c.Group;z.name="lake-of-pink-fountains";const w={spireBulbs:n.int(3,5),collarThorns:24,thornLen:n.range(11,15),thornCurl:n.range(.15,.45),petalCurl:n.range(.25,.6),petalTwist:n.range(-.12,.12),hoopA:n.range(9,14),hoopB:n.range(40,45),tubeAz:[Math.PI+n.range(-.18,.18),Math.PI*1.62+n.range(-.15,.15),Math.PI*.78+n.range(-.1,.12)],tubeLat:[n.range(-.3,-.05),n.range(-.05,.25),n.range(-.35,-.12)],tubeLen:[n.range(15,20),n.range(13,18),n.range(12,16)],finialTilt:n.range(.7,1),finialLen:n.range(13,17),finialAz:n.range(0,Math.PI/2),crescentTop:n.chance(.6),ghostPhase:n.int(0,5),petalLen:Array.from({length:12},()=>n.range(.9,1.04)),hoopThorns:n.pick([28,32,36])};let K=w.ghostPhase;const U=()=>K++%6===0;{const a=Ne(fe,5),r=a.findIndex(t=>t[1]>=w.hoopA),d=a.findIndex(t=>t[1]>=w.hoopB);b.lathe(a.slice(0,r+1),{segs:96,pig:V,pat:N.veins,cells:84,row:1,cut:1}),await p.yield(),b.lathe(a.slice(r,d+1),{segs:96,pig:V,pat:N.scales,cells:126,row:2.1,cut:1}),await p.yield(),b.lathe(a.slice(d),{segs:96,pig:V,pat:N.scallops,cells:104,row:2.6,cut:1}),await p.yield();for(const[t,o,u]of[[w.hoopA,1.3,T],[w.hoopB,1.1,T],[.4,1.7,E]]){const i=Me(t)+o*.35,x=[];for(let h=0;h<=6;h++){const l=h/6*Math.PI;x.push([i+Math.sin(l)*o,t-Math.cos(l)*o*1.1])}b.lathe(x,{segs:72,pig:u,pat:N.rings,cells:1,row:.9,cut:1});const f=Math.round(Math.PI*2*(i+o)/(t<1?1.75:1.5));if(t===w.hoopB)for(let h=0;h<w.hoopThorns;h++){const l=h/w.hoopThorns*Math.PI*2,m=new e(Math.sin(l),0,Math.cos(l)),y=new e().copy(m).multiplyScalar(i+o*.8).setY(t+.5),A=Math.hypot(y.x+34,0)<11&&Math.abs(y.z)<46;A&&v||se(b,y,new e().copy(m).setY(.25).normalize(),h%2?4.2:7,.7,{bend:new e(0,1,0),curl:.4,pig:T,ghost:A?!1:U()})}for(let h=0;h<f;h++){const l=h/f*Math.PI*2;S(new e(Math.sin(l)*(i+o+.3),t+(t<1?.5:0),Math.cos(l)*(i+o+.3)),t<1?.75:.5,V)}}}await p.yield();{b.lathe([[17.5,63.2],[19.5,64.2],[20.2,65.6],[18.6,67],[15.5,67.8],[14.2,69.5],[15.2,71]],{smooth:3,segs:48,pig:T,pat:N.rings,cells:1,row:1.1,ghost:U()});const a=w.collarThorns;for(let r=0;r<a;r++){const d=r/a*Math.PI*2,t=new e(Math.sin(d),0,Math.cos(d)),o=w.thornLen*(r%2?.72:1);se(b,new e().copy(t).multiplyScalar(19.6).setY(65.6),new e().copy(t).setY(r%2?.35:.1).normalize(),o,1,{bend:new e(0,1,0),curl:w.thornCurl,pig:T,rings:7,segs:6,ghost:U()}),S(new e().copy(t).multiplyScalar(20.6).setY(64.4),.42,V)}}await p.yield();{const a=R+1.2;for(let r=0;r<12;r++){const d=r/12*Math.PI*2+Math.atan2(F.x,F.z)+Math.PI/12,t=[],o=36,u=r===0||r===11,i=u?.6:w.petalLen[r];for(let f=0;f<=o;f++){const h=f/o,l=.5+h*1.08*i,m=w.petalCurl*Math.max(0,h-.62)*Math.max(0,h-.62)*60,y=a+m+1.2*Math.sin(h*Math.PI),A=d+w.petalTwist*h,M=new e(Math.sin(A)*Math.sin(l)*y,Y.y-Math.cos(l)*y,Math.cos(A)*Math.sin(l)*y),I=Math.pow(Math.sin(Math.PI*Math.min(1,.12+h*.88)),.75)*(1-.35*h),_=1+.34*(h*9%1-.5)*(h>.1?1:0),Q=f===o?0:7.4*I*_;t.push({c:M,r:Q,rz:f===o?0:Math.min(.9,.2+Q*.12)})}const x=new e(Math.cos(d),0,-Math.sin(d));b.loft(t,{segs:8,pig:r%2?V:E,pat:N.veins,cells:6,row:1,ref:x,ghost:U()})}}await p.yield();const W=new e().copy(Y).addScaledVector(F,R);{const a=[];for(let t=0;t<=44;t++){const o=.44+t/44*(Math.PI-.22-.44);a.push([R*Math.sin(o),Y.y-R*Math.cos(o)])}b.lathe(a,{segs:84,pig:V,pat:N.scales,cells:88,row:1.75,cut:2});const r=[];for(let t=0;t<=14;t++){const o=.5+t/14*(Math.PI-.3-.5);r.push([(R-.9)*Math.sin(o),Y.y-(R-.9)*Math.cos(o)])}b.lathe(r,{segs:32,pig:B,pat:N.plain,cut:2});const d=(t,o,u)=>{const i=new e(Math.sin(o)*Math.sin(t),-Math.cos(t),Math.cos(o)*Math.sin(t)),x=i.dot(F);x>0&&Math.sqrt(Math.max(0,1-x*x))*R<10.4||S(new e().copy(Y).addScaledVector(i,R+u*.45),u,V)};for(let t=0;t<8;t++)for(let o=0;o<50;o++)d(.72+o/50*2.16,t/8*Math.PI*2+.39,.4);for(const[t,o]of[[1.97,136],[2.56,80]])for(let u=0;u<o;u++)d(t,u/o*Math.PI*2,.4);b.lathe([[5.6,121.6],[7.6,122.4],[8.1,123.5],[6.4,124.5],[4.4,125]],{smooth:3,segs:32,pig:T,pat:N.rings,cells:1,row:.8,ghost:U()});for(let t=0;t<12;t++){const o=t/12*Math.PI*2,u=new e(Math.sin(o),0,Math.cos(o));se(b,new e().copy(u).multiplyScalar(7.7).setY(123.4),new e().copy(u).setY(.3).normalize(),t%2?3.2:5,.45,{bend:new e(0,1,0),curl:.35,pig:T})}}await p.yield();const ne=new e(0,1,0),te=new e().crossVectors(ne,new e().copy(F).negate()).normalize();{const r=new e().copy(Y).addScaledVector(F,Math.sqrt(R*R-74.8225)+.35),d=[],t=56,o=te,u=ne;for(let l=0;l<=t;l++){const m=l/t*Math.PI*2,y=new e().copy(r).addScaledVector(o,Math.cos(m)*8.65).addScaledVector(u,Math.sin(m)*8.65);d.push({c:y,r:1.2,rz:1.45,t:new e().copy(o).multiplyScalar(-Math.sin(m)).addScaledVector(u,Math.cos(m))})}b.loft(d,{segs:12,pig:T,pat:N.rings,cells:1,row:1.23,ref:F,ghost:!0});const i=22;for(let l=0;l<i;l++){const m=(l+.5)/i*Math.PI*2,y=new e().copy(o).multiplyScalar(Math.cos(m)).addScaledVector(u,Math.sin(m)),A=new e().copy(r).addScaledVector(y,8.65+.7).addScaledVector(F,.5);se(b,A,new e().copy(y).addScaledVector(F,.55).normalize(),l%2?2.6:4.2,.55,{bend:F,curl:.3,pig:T,rings:6});const M=l/i*Math.PI*2,I=new e().copy(o).multiplyScalar(Math.cos(M)).addScaledVector(u,Math.sin(M));S(new e().copy(r).addScaledVector(I,8.65).addScaledVector(F,1.55),.46,V)}const x=40,f=11.7,h=Math.sqrt(1-f/R*(f/R));for(let l=0;l<x;l++){const m=l/x*Math.PI*2,y=new e().copy(o).multiplyScalar(Math.cos(m)).addScaledVector(u,Math.sin(m)),A=new e().copy(F).multiplyScalar(h).addScaledVector(y,f/R);S(new e().copy(Y).addScaledVector(A,R+.3),-.56,V)}}await p.yield();const H=[],ce=[];for(let a=0;a<3;a++){const r=w.tubeAz[a],d=w.tubeLat[a],t=w.tubeLen[a],o=new e(Math.sin(r)*Math.cos(d),Math.sin(d),Math.cos(r)*Math.cos(d)),u=new e().copy(Y).addScaledVector(o,R-.4),i=[],x=22,f=M=>new e().copy(u).addScaledVector(o,(t+.4)*M).add(new e(0,-t*.2*M*M,0));for(let M=0;M<=x;M++){const I=M/x,_=Math.exp(-((1-I)*(1-I))*60)*1.25,Q=I*4%1-.5,X=.22*Math.exp(-Q*Q*40);i.push({c:f(I),r:2.25-.55*I+_+X})}b.loft(i,{segs:16,pig:D,pat:N.rings,cells:1,row:2.2,ghost:U()});const h=new c.Matrix4().makeRotationFromQuaternion(new c.Quaternion().setFromUnitVectors(new e(0,1,0),o)).setPosition(new e().copy(Y).addScaledVector(o,R-.6));b.lathe([[3,-.6],[4.5,.2],[4.9,1.3],[3.9,2.3],[2.9,2.8],[2.5,3.6]],{smooth:3,segs:20,pig:T,pat:N.rings,cells:1,row:.8,m:h,ghost:U()});const l=new e(0,1,0).cross(o).normalize(),m=new e().crossVectors(o,l);for(let M=0;M<10;M++){const I=M/10*Math.PI*2,_=new e().copy(l).multiplyScalar(Math.cos(I)).addScaledVector(m,Math.sin(I));se(b,new e().copy(Y).addScaledVector(o,R+.6).addScaledVector(_,4.6),new e().copy(_).addScaledVector(o,.7).normalize(),M%2?3:4.6,.5,{bend:o,curl:.3,pig:T});const Q=(M+.5)/10*Math.PI*2,X=new e().copy(l).multiplyScalar(Math.cos(Q)).addScaledVector(m,Math.sin(Q));S(new e().copy(Y).addScaledVector(o,R+1.9).addScaledVector(X,4.3),.4,V)}const y=f(1),A=f(1).sub(f(.96)).normalize();H.push({mouth:y.clone().add(new e(0,-1.2,0)),vel:A}),ce.push(y)}await p.yield();const Pe=(a,r,d,t,o,u)=>{const i=[],f=new e().copy(a).addScaledVector(d,t);for(let h=0;h<=18;h++){const l=h/18,m=(150+240*l)*Math.PI/180,y=Math.pow(Math.sin(Math.PI*l),.7);i.push({c:new e().copy(f).addScaledVector(r,Math.cos(m)*t).addScaledVector(d,Math.sin(m)*t),r:h===0||h===18?0:t*.3*y,rz:h===0||h===18?0:t*.3*y*u})}b.loft(i,{segs:8,pig:o,pat:N.plain,ref:d,ghost:U()})},Se=[];for(let a=0;a<4;a++){const r=w.finialAz+a*Math.PI/2,d=new e(Math.sin(r),0,Math.cos(r)),t=new e(Math.cos(r),0,-Math.sin(r)),o=new e().copy(Y).addScaledVector(d,R*Math.sin(.62)-.4).add(new e(0,R*Math.cos(.62)-.4,0)),u=new e().copy(d).multiplyScalar(Math.sin(w.finialTilt)).add(new e(0,Math.cos(w.finialTilt),0)).normalize(),i=w.finialLen,x=[],f=26;for(let l=0;l<=f;l++){const m=l/f,y=(M,I,_)=>_*Math.exp(-((m-M)*(m-M))/(I*I)),A=.42+1.5*Math.exp(-m*m*260)+y(.3,.05,1.25)+y(.42,.018,.5)+y(.66,.04,.9)+y(.76,.016,.4)+y(.97,.03,.5);x.push({c:new e().copy(o).addScaledVector(u,i*m).add(new e(0,i*.12*m*m,0)),r:A})}b.loft(x,{segs:10,pig:a%2?V:T,pat:N.rings,cells:1,row:.9,ghost:U()});const h=x[f].c;Se.push(h.clone()),Pe(h,t,new e(0,1,0),3.7,D,.45),S(new e().copy(h).add(new e(0,.2,0)),.6,V);for(let l=0;l<6;l++){const m=l/6*Math.PI*2,y=new e().copy(t).multiplyScalar(Math.cos(m)).addScaledVector(new e().crossVectors(u,t),Math.sin(m));se(b,new e().copy(o).addScaledVector(u,i*.3).addScaledVector(y,1.3),new e().copy(y).addScaledVector(u,.5).normalize(),2.6,.3,{bend:u,curl:.4,pig:T,segs:5,rings:5})}}await p.yield();{const a=w.spireBulbs,r=[[4.2,124.6]],d=[];let t=124.8;const o=w.crescentTop?135.2:136.6,u=(1-Math.pow(.78,a))/(1-.78);for(let i=0;i<a;i++){const x=(o-124.8)*Math.pow(.78,i)/u,f=5.3*Math.pow(.7,i),h=f*.34;for(let l=1;l<=8;l++){const m=l/8;r.push([h+(f-h)*Math.pow(Math.sin(Math.PI*Math.min(.999,m*.93+.035)),.85),t+x*m])}t+=x,d.push([t,h,f])}w.crescentTop?r.push([.34,t+.6],[.24,137],[0,137.25]):r.push([.34,t+.6],[.2,138.6],[0,140]),b.lathe(r,{segs:28,pig:V,pat:N.dots,cells:16,row:1.05,ghost:!0});for(const[i,x,f]of d)for(let h=0;h<8;h++){const l=h/8*Math.PI*2+i,m=new e(Math.sin(l),0,Math.cos(l));se(b,new e().copy(m).multiplyScalar(x*.9).setY(i),new e().copy(m).setY(.45).normalize(),f*.95,.12+f*.05,{bend:new e(0,1,0),curl:.4,pig:T,segs:5,rings:5}),S(new e().copy(m).multiplyScalar(x+.25).setY(i-.1),.16+f*.035,V)}w.crescentTop&&Pe(new e(0,137.1,0),new e(Math.cos(w.finialAz),0,Math.sin(w.finialAz)),new e(0,1,0),1.45,D,.5)}await p.yield();const G=new e().subVectors(re,J),ae=G.length();G.normalize();const L=7.25,ke=new Le;if(s.tube!==!1){const a=[],r=[0,.45,.95,3,5.05,5.55];for(let i=-3;i<ae+6;i+=6)for(const x of r){const f=i+x;if(f<0||f>ae)continue;const h=Math.abs(f%6-3),l=.42*Math.exp(-h*h*6),m=1.25*(Math.exp(-f*f/2.2)+Math.exp(-(ae-f)*(ae-f)/2.2));a.push({c:new e().copy(J).addScaledVector(G,f),r:L+l+m,t:G})}a.push({c:re.clone(),r:L+1.25,t:G}),ke.loft(a,{segs:32,pig:D,pat:N.tube,cells:Math.PI*2*L,row:1,cut:3,ref:new e(1,0,0),flatArc:!0}),await p.yield();{const i=new e(1,0,0),x=new e().crossVectors(G,i).normalize(),f=Math.PI*2*L,h=(l,m,y)=>{const A=Math.round((m-4.5)/9),M=(((l-(A%2?1/6:0))*3+.5)%1+1)%1-.5;return Math.hypot(M*f/3,m-4.5-9*A)<3.3+y};for(let l=3;l<ae-2;l+=6){const m=new e().copy(J).addScaledVector(G,l);for(let y=0;y<24;y++){const A=(y+.5)/24,M=A*Math.PI*2,I=new e().copy(i).multiplyScalar(Math.cos(M)).addScaledVector(x,Math.sin(M));h(A,l,.5)||(S(new e().copy(m).addScaledVector(I,L-.02),.33,D),l>6&&l<ae-6&&S(new e().copy(m).addScaledVector(I,L+.62),.3,D),y%3===1&&se(b,new e().copy(m).addScaledVector(I,L+.3).addScaledVector(G,.55),new e().copy(I).multiplyScalar(-1).addScaledVector(G,.75).normalize(),1.05,.2,{bend:G,curl:.3,pig:q,rings:3,segs:4}))}}}await p.yield();const d=[[2.2,-1],[ae-2.2,1]];Z.length===2&&d.push([Z[0]-3.5,-1],[Z[1]+3.5,1]);const t=new c.Quaternion().setFromUnitVectors(new e(0,1,0),G),o=new e(1,0,0),u=new e().crossVectors(G,o).normalize();for(const[i,x]of d){await p.yield();const f=new e().copy(J).addScaledVector(G,i),h=new c.Matrix4().makeRotationFromQuaternion(t).setPosition(f);b.lathe([[L+.3,-1.5],[L+1.5,-.9],[L+2,0],[L+1.5,.9],[L+.3,1.5]],{smooth:3,segs:36,pig:q,pat:N.rings,cells:1,row:.8,m:h,ghost:U()});for(let l=0;l<18;l++){const m=l/18*Math.PI*2,y=new e().copy(o).multiplyScalar(Math.cos(m)).addScaledVector(u,Math.sin(m));se(b,new e().copy(f).addScaledVector(y,L+1.7),new e().copy(y).addScaledVector(G,x*.45).normalize(),l%2?3.6:5.6,.6,{bend:G,curl:.35*x,pig:q});const A=(l+.5)/18*Math.PI*2,M=new e().copy(o).multiplyScalar(Math.cos(A)).addScaledVector(u,Math.sin(A));S(new e().copy(f).addScaledVector(M,L+2.15),.5,D)}}}await p.yield();const ue=b.geometry();ue.boundingSphere=new c.Sphere(new e(0,68,0),160),await p.yield();const pe=new c.Mesh(ue,We(g));pe.name="fountain-glaze";const Ve=new c.Mesh(ue,ye(g));Ve.name="fountain-contour";const Ae=b.ghostGeometry(ue);Ae.boundingSphere=ue.boundingSphere,await p.yield();const me=new c.Mesh(Ae,ye(g,{ghost:!0,push:1}));if(me.name="fountain-underdrawing",me.renderOrder=-.5,Ye(pe,g),z.add(pe,Ve,me),s.tube!==!1){const a=ke.geometry();a.boundingSphere=ue.boundingSphere;const r=new c.Mesh(a,We(g,{glass:!0}));r.name="tube-glass",r.renderOrder=3;const d=new c.Mesh(a,ye(g));d.name="tube-glass-contour",z.add(r,d)}await p.yield();const ze=()=>{const a=new c.InstancedBufferGeometry;return a.setAttribute("position",new c.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),a.setIndex([0,1,2,0,2,3]),a};{const a=$.length/7,r=new Float32Array(a*4),d=new Float32Array(a*3);for(let u=0;u<a;u++)r.set($.slice(u*7,u*7+4),u*4),d.set($.slice(u*7+4,u*7+7),u*3);const t=ze();t.setAttribute("aDot",new c.InstancedBufferAttribute(r,4)),t.setAttribute("aTint",new c.InstancedBufferAttribute(d,3)),t.instanceCount=a;const o=new c.Mesh(t,Oe(g));o.frustumCulled=!1,o.name="fountain-pearls",z.add(o)}const ve=[];{const a=[],r=[],d=[],t=[];H.forEach((i,x)=>{const m=(6.5*i.vel.y+Math.sqrt(Math.max(0,42.25*i.vel.y*i.vel.y+19.6*(i.mouth.y-.3))))/9.8,y=a.length/3;for(let A=0;A<=40;A++){const M=A/40,I=M*m,_=new e().copy(i.mouth).addScaledVector(i.vel,6.5*I);_.y-=.5*9.8*I*I;const Q=new e().copy(i.vel).multiplyScalar(6.5);Q.y-=9.8*I,Q.normalize();for(const X of[-1,1])a.push(_.x,_.y,_.z),r.push(Q.x,Q.y,Q.z),d.push(X,M,.42+.3*M);if(A<40){const X=y+A*2;t.push(X,X+1,X+2,X+1,X+3,X+2)}A===40&&ve.push(new e(_.x,0,_.z))}});const o=new c.BufferGeometry;o.setAttribute("position",new c.Float32BufferAttribute(a,3)),o.setAttribute("aTan",new c.Float32BufferAttribute(r,3)),o.setAttribute("aRib",new c.Float32BufferAttribute(d,3)),o.setIndex(t);const u=new c.Mesh(o,$e(g,{color:k[4],flow:7}));u.frustumCulled=!1,u.name="fountain-jets",z.add(u)}{const a=Math.round(30*P),r=new Float32Array(a*4),d=new Float32Array(a*4);for(let u=0;u<a;u++){const i=u<a/2,x=i?ce[u%3]:null,f=n.range(0,Math.PI*2),h=i?new e().copy(x).add(new e(0,1.5,0)):new e(Math.sin(f)*n.range(52,70),.2,Math.cos(f)*n.range(52,70));r.set([h.x,h.y,h.z,i?n.range(.7,1.7):n.range(1.2,3.2)],u*4),d.set([n(),i?n.range(2,3.5):n.range(1.2,2.2),i?n.range(22,40):n.range(10,24),n.range(.6,1.8)],u*4)}const t=ze();t.setAttribute("aBub",new c.InstancedBufferAttribute(r,4)),t.setAttribute("aRise",new c.InstancedBufferAttribute(d,4)),t.instanceCount=a;const o=new c.Mesh(t,He(g));o.frustumCulled=!1,o.renderOrder=20,o.name="fountain-bubbles",z.add(o)}const Ie={...g,uBurst:{value:0}};if(s.tube!==!1){const a=new e(1,0,0),r=new e().crossVectors(G,a).normalize(),d=L*2.6,t=re,o=new c.BufferGeometry,u=[],i=[];for(const[f,h]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const l=new e().copy(t).addScaledVector(a,f*d).addScaledVector(r,h*d);u.push(l.x,l.y,l.z),i.push(f*2.6,h*2.6)}o.setAttribute("position",new c.Float32BufferAttribute(u,3)),o.setAttribute("uv",new c.Float32BufferAttribute(i,2)),o.setIndex([0,1,2,0,2,3]);const x=new c.Mesh(o,Ze(Ie));x.renderOrder=21,x.name="tube-film",z.add(x)}await p.yield();const Be=Me(0),we={...g,uPig:{value:C[1]},uBodyPig:{value:V},uAxis:{value:new e},uFootR:{value:Be},uSmearH:{value:56},uSplash:{value:[new e,new e,new e]}};if(s.lake!==!1){const a=new c.CircleGeometry(s.lakeRadius??170,96);a.rotateX(-Math.PI/2);const r=new c.Mesh(a,Ke(we));r.position.y=0,r.name="lake",z.add(r)}if(s.backdrop!==!1){const a=[[170,0],[250,10],[262,30],[700,160],[715,185],[1350,390],[1500,470]],r=u=>{for(let i=0;i<a.length-1;i++)if(u<=a[i+1][0])return a[i][1]+(a[i+1][1]-a[i][1])*(u-a[i][0])/(a[i+1][0]-a[i][0]);return 470},d=new c.RingGeometry(169.5,1500,72,30);d.rotateX(-Math.PI/2);const t=d.getAttribute("position");for(let u=0;u<t.count;u++)t.setY(u,r(Math.hypot(t.getX(u),t.getZ(u))));d.computeVertexNormals();const o=new c.Mesh(d,Je(g,{pig:k[2],deep:k[3]}));o.name="backdrop-lawn",z.add(o)}const Re=[];for(let a=0;a<=8;a++){const r=a/8*(240*Math.PI/180);Re.push(new e(36-70*Math.cos(r),66+30*(a/8),103+70*Math.sin(r)))}const Ce=new e().copy(Y).addScaledVector(F,Math.sqrt(R*R-8.65*8.65)+.35),Ue={portalSeat:{position:new e().copy(W).addScaledVector(F,-6),facing:F.clone(),radius:7},window:{center:W.clone(),dir:F.clone(),radius:7.5,left:te.clone()},owlPerch:{position:new e().copy(Ce).addScaledVector(te,.74*8.2).addScaledVector(ne,-.67*8.2+1.4).addScaledVector(F,.6),facing:F.clone().negate(),along:new e().copy(te).multiplyScalar(.67).addScaledVector(ne,.74)},tube:{a:J.clone(),b:re.clone(),dir:G.clone(),bore:L,length:ae,portEvery:9,firstPort:4.5,portsRound:3,pierce:Z.slice()},flyThrough:[new e(0,8,-180),new e(-20,10,-135),J.clone(),re.clone(),new e().copy(re).addScaledVector(G,30),...Re,new e().copy(W).addScaledVector(F,30),new e().copy(W).addScaledVector(F,-6)],viewpoints:{entry:new e(0,100,-380),reveal:new e(0,40,-230),loopApex:new e(36,77,173),lastStraight:new e(71,96,42)},globe:{center:Y.clone(),radius:R},top:new e(0,140,0),footRadius:Be,tubeMouths:ce.map(a=>a.clone()),jetLandings:ve.map(a=>a.clone()),finialTips:Se,hornSeat:new e(36,0,153)},De=s.filmAt??.52,ge=new c.Matrix3,Te={object:z,radius:62,height:140,center:new e(0,74,0),anchors:Ue,uniforms:g,seed:w,ground:!1,groundY:0,setProgress(a){Ie.uBurst.value=Math.min(1,Math.max(0,(a-De)/.035))},update(a,r,d){if(g.uTime.value=r,d&&s.tube!==!1){oe.setFromMatrixPosition(d.matrixWorld).sub(g.uBoreA.value);const o=oe.dot(g.uBoreD.value),u=oe.addScaledVector(g.uBoreD.value,-o).length(),i=x=>{const f=Math.min(1,Math.max(0,x));return f*f*(3-2*f)};g.uInTube.value=u<L+.4?i((o+14)/15)*i((ae+1-o)/5):0}z.updateWorldMatrix(!0,!1);const t=z.matrixWorld;ge.setFromMatrix4(t),g.uBoreA.value.copy(J).applyMatrix4(t),g.uBoreD.value.copy(G).applyMatrix3(ge).normalize(),g.uBoreR.value=s.tube!==!1&&v?L+.48:-1,Z.length===2&&g.uPierce.value.set(Z[0],Z[1]),g.uTubeLen.value=ae,g.uWinP.value.copy(W).applyMatrix4(t),g.uWinD.value.copy(F).applyMatrix3(ge).normalize(),we.uAxis.value.setFromMatrixPosition(t);for(let o=0;o<3;o++)we.uSplash.value[o].copy(ve[o]).applyMatrix4(t)},dispose(){}};return Te.update(0,0),Te}function Ze(p){return new c.ShaderMaterial({uniforms:p,transparent:!0,depthWrite:!1,side:c.DoubleSide,vertexShader:"varying vec2 vQ; void main() { vQ = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
      uniform vec3 uGround; uniform vec3 uInk; uniform float uBurst; uniform float uTime; varying vec2 vQ;
      void main() {
        float b = uBurst;
        float r = length(vQ); float fw = max(fwidth(r), 1e-4);
        float open = b * 1.4;                                        // the hole in the film grows from the middle
        float film = step(r, 0.97) * step(open, r) * (1.0 - smoothstep(0.6, 0.75, b));
        float ring = (1.0 - smoothstep(0.75 * fw, 1.5 * fw, abs(r - max(open, 0.001)))) * step(0.001, b) * step(r, 0.97);
        float ang = atan(vQ.y, vQ.x + 1e-4 * step(abs(vQ.x) + abs(vQ.y), 1e-5));
        float wob = 0.012 * sin(ang * 5.0 + uTime * 1.3);
        float arc = (1.0 - smoothstep(0.012, 0.012 + fw, abs(r - 0.72 - wob))) * (1.0 - smoothstep(0.5, 0.55, abs(ang - 2.2)));
        float arc2 = (1.0 - smoothstep(0.008, 0.008 + fw, abs(r - 0.5 + wob))) * (1.0 - smoothstep(0.22, 0.26, abs(ang + 0.9)));
        float a = film * max(0.06, max(arc, arc2) * 0.9);
        vec3 col = uGround;
        a = max(a, ring * 0.9 * (1.0 - smoothstep(0.6, 0.75, b)));
        // drops
        vec2 q = vQ + vec2(0.0, 1.1 * b * b);
        float qa = atan(q.y, q.x + 1e-4 * step(abs(q.x) + abs(q.y), 1e-5));
        float sec = floor((qa + 3.14159265) / 6.2831853 * 20.0);
        float h = fract(sin(sec * 12.9898 + 4.1) * 43758.5453);
        float ca = (sec + 0.5) / 20.0 * 6.2831853 - 3.14159265;
        float rd = 0.25 + 0.6 * h + b * (0.7 + 1.1 * fract(h * 7.3));
        float dd = length(q - rd * vec2(cos(ca), sin(ca)));
        float sz = (0.035 + 0.05 * fract(h * 3.7)) * (1.0 - 0.5 * b);
        float drop = (1.0 - smoothstep(sz, sz + fw, dd)) * step(0.001, b) * (1.0 - smoothstep(0.85, 1.0, b));
        a = max(a, drop);
        if (a < 0.01) discard;
        gl_FragColor = vec4(col, a);
      }`})}function Ke(p){return new c.ShaderMaterial({uniforms:p,vertexShader:"varying vec3 vWP; void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vWP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`
      uniform vec3 uGround; uniform vec3 uInk; uniform vec3 uPig; uniform vec3 uBodyPig; uniform vec3 uAxis;
      uniform float uFootR; uniform float uSmearH; uniform float uTime; uniform vec3 uSplash[3]; uniform float uEve; uniform vec3 uSkyLow;
      varying vec3 vWP;
      float rings(float ph, float fw) {
        float w = max(min(1.5 * fw, 0.12), 1e-4);
        return (1.0 - smoothstep(0.5 * w, w, abs(fract(ph) - 0.5))) * (1.0 - smoothstep(0.11, 0.25, fw));
      }
      float splash(vec3 c) {
        float d = length(vWP.xz - c.xz); float ph = d / 1.7 - uTime * 0.8;
        return rings(ph, min(fwidth(d) / 1.7, 1.0)) * (1.0 - smoothstep(3.0, 10.0, d));
      }
      void main() {
        vec3 tc = cameraPosition - vWP; float tl = max(length(tc), 1e-3);
        float f = clamp(tc.y / tl, 0.0, 1.0);
        vec3 col = mix(uPig, uGround, 0.42 * f * sqrt(f));
        col = mix(col, uGround, 0.36 * uEve * (1.0 - smoothstep(0.1, 0.5, f)));   // as the day turns the far water pales to the chalk ground: it stays azurite, never lilac
        vec2 q = vWP.xz - uAxis.xz; float r = length(q); float fr = max(fwidth(r), 1e-4);
        // the fountain's smear
        vec2 pc = vWP.xz - cameraPosition.xz; float dpc = max(length(pc), 1e-3); vec2 dn = pc / dpc;
        float tA = dot(-q, dn); float lat = q.x * dn.y - q.y * dn.x;
        float te = tA - sqrt(max(uFootR * uFootR - lat * lat, 0.0));
        float h = te * max(tc.y, 0.0) / dpc;
        float cid = floor(lat / 2.4); float hs = fract(sin(cid * 12.9898) * 43758.5453);
        float sm = step(abs(lat), uFootR * 0.985) * step(0.0, te) * step(0.0, h) * step(h, uSmearH * (0.5 + 0.5 * hs)) * step(te, 38.0 * (0.45 + 0.55 * hs));
        col = mix(col, uBodyPig, sm * 0.38);
        // and the turned skyline's smear: short ragged upright strokes of its pink, hard-edged, under the far shore only (they
        // lengthen out of nothing with uEve and slide along the shore as the eye moves, like the fountain's own)
        float tfar = tA + sqrt(max(169.0 * 169.0 - lat * lat, 0.0));           // metres of water from here to the far shore, along the sight line
        float kid = floor(lat / 3.1); float ks = fract(sin(kid * 78.233 + 2.1) * 43758.5453);
        float sky2 = step(0.0, tfar) * step(0.3, ks) * step(tfar * max(tc.y, 0.0) / dpc, 9.0 * uEve * ks) * step(tfar, 64.0 * uEve * (0.35 + 0.65 * ks)) * (1.0 - sm);
        col = mix(col, uSkyLow, 0.8 * sky2);
        // contact ring: deeper slate, no direction
        float cr = uFootR + 8.0;
        col = mix(col, mix(uPig, uInk, 0.3), (1.0 - smoothstep(cr - fr, cr + fr, r)) * (1.0 - sm));
        // ripples
        float ph = (r - uFootR) / 6.5 - uTime * 0.11;
        float rp = rings(ph, min(fr / 6.5, 1.0)) * smoothstep(1.0, 5.0, r - uFootR) * (1.0 - smoothstep(25.0, 80.0, r - uFootR));
        rp = max(rp, max(splash(uSplash[0]), max(splash(uSplash[1]), splash(uSplash[2]))));
        col = mix(col, uGround, rp * 0.85);
        // wavelets: ruled rows of short ivory ticks laid across the line of sight; they slide as the eye moves
        float pxw = max(length(dFdx(vWP.xz)), length(dFdy(vWP.xz)));
        vec2 wid = floor(vWP.xz / 7.0); float hh = fract(sin(dot(wid, vec2(127.1, 311.7))) * 43758.5453);
        vec2 wc = (wid + 0.3 + 0.4 * vec2(hh, fract(hh * 7.13))) * 7.0; vec2 wp2 = vWP.xz - wc;
        float wal = dot(wp2, vec2(-dn.y, dn.x)); float wac = dot(wp2, dn) + 0.22 * sin(uTime * 0.9 + hh * 6.2832);
        float wlen = 1.1 + 1.5 * hh; float ww = max(0.06, 0.8 * pxw);
        float tick = (1.0 - smoothstep(0.6 * ww, ww, abs(wac - 0.2 * cos(clamp(wal / wlen, -1.0, 1.0) * 1.5708)))) * (1.0 - smoothstep(0.8 * wlen, wlen, abs(wal)));
        col = mix(col, uGround, tick * 0.6 * step(0.3, hh) * (1.0 - smoothstep(0.45, 0.95, pxw)) * (1.0 - sm));
        gl_FragColor = vec4(col, 1.0);
      }`})}function Je(p,s={}){return new c.ShaderMaterial({uniforms:{...p,uPig:{value:new c.Color(s.pig??de[2])},uDeep:{value:new c.Color(s.deep??de[3])},uBand:{value:s.band??26}},vertexShader:"varying vec3 vWP; void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vWP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:`
      uniform vec3 uGround; uniform vec3 uPig; uniform vec3 uDeep; uniform float uBand; varying vec3 vWP;
      void main() {
        float k = vWP.y / max(uBand, 0.1) + 0.35; float i = floor(k);
        float pale = 0.05 + 0.2 * fract(i * 0.381966);
        vec3 col = mix(uPig, uGround, pale);
        float fw = min(fwidth(k), 1.0); float w = max(min(1.5 * fw, 0.1), 1e-4);
        float e = min(fract(k), 1.0 - fract(k));
        col = mix(col, mix(uPig, uDeep, 0.35), (1.0 - smoothstep(0.5 * w, w, e)) * (1.0 - smoothstep(0.1, 0.3, fw)));
        gl_FragColor = vec4(col, 1.0);
      }`})}export{Le as FormBuilder,_e as GLAZE_FRAG,Ee as GLAZE_VERT,Qe as HULL_FRAG,je as HULL_VERT,de as PALETTE,N as PAT,et as PIG,Fe as STYLE_GLSL,xe as STYLE_VARY,He as bubbleMaterial,tt as buildHero,Oe as dotMaterial,Ze as filmMaterial,We as glazeMaterial,ye as hullMaterial,Je as lawnMaterial,qe as makeStyleUniforms,$e as ribbonMaterial,Ne as smoothProfile,se as thorn,Ye as trackResolution,Ke as waterMaterial};
