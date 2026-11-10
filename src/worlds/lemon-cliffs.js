import*as l from"three";import{mergeGeometries as Ut}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as uo}from"../kit/core.js";import{buildHero as ho,depthProgramsReady as po}from"../parts/lemon-cliffs.js";const Xt=["#2F7FD1","#FFF4DC","#F4B860","#E8846B","#2BB5B0","#3E3A5C","#F5D21F"],_=28,ht=`
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), f.x), f.y); }
uniform vec2 uRes;
float halftone(float pitch){            // 1 inside a dot; screen anchored, 45 degree screen
  vec2 q = gl_FragCoord.xy * (450.0 / max(uRes.y, 1.0)) / pitch;
  q = vec2(q.x + q.y, q.x - q.y) * 0.7071;
  vec2 g = fract(q) - 0.5; return dot(g, g);
}`,mo=`
uniform mat4 uShadowMat; uniform float uTime; uniform vec3 uSun;
varying vec3 vWp; varying vec3 vN; varying vec3 vCol; varying vec3 vSh;
#ifdef INST
attribute vec3 aCol; attribute vec4 aRnd;
#endif
#ifdef HOUSE
varying vec3 vO; varying vec3 vNo; varying vec4 vSz;
#endif
#ifdef FLATN
attribute vec4 aT; varying vec4 vT;
#endif
void main(){
  vec3 p = position; vec3 n = normal;
  #ifdef FLATN
    vT = aT;
  #endif
  #ifdef INST
    float rnd = aRnd.x;
    #ifdef HOUSE
      vO = position * aRnd.yzw; vNo = normal; vSz = aRnd;
    #endif
    #ifdef ROOFT
      n = n / (aRnd.yzw * aRnd.yzw);                      // the instance is scaled unevenly: keep the slopes' true facing
    #endif
    #ifdef LEAF
      float w = sin(uTime * (1.6 + rnd * 1.7) + rnd * 40.0);
      p.y += w * 0.10 * length(position.xz); p.x += w * 0.05 * position.y;
    #endif
    #ifdef CLOTH
      float cfar = 1.0 + 1.6 * smoothstep(70.0, 240.0, distance(cameraPosition, (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz));   // far washing flaps wider, so the town still stirs from across the cove
      p.z += sin(uTime * (3.0 + rnd * 2.5) + position.y * 4.0 + position.x * 2.5 + rnd * 30.0) * 0.3 * (-position.y) * cfar;
      p.x += (sin(uTime * 1.3 + rnd * 17.0) * 0.10 + sin(uTime * 2.3 + position.y * 3.0 + rnd * 9.0) * 0.12) * (-position.y) * cfar;
      p.y += (0.5 + 0.5 * sin(uTime * (1.1 + rnd) + rnd * 20.0 + position.x * 2.0)) * 0.22 * position.y * position.y;   // the hem lifts in gusts
    #endif
    #ifdef LEMON
      p.x += sin(uTime * (0.9 + rnd) + rnd * 30.0) * 0.07 * (0.3 - position.y);
      p *= 1.0 + 0.6 * smoothstep(45.0, 110.0, distance(cameraPosition, (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz));   // the yellow accent carries from the helix
    #endif
    #ifdef BLOB
      p.x += sin(uTime * 1.3 + rnd * 20.0) * 0.05 * (position.y + 1.0);
      p.z += cos(uTime * 1.1 + rnd * 11.0) * 0.03 * (position.y + 1.0);
    #endif
    #ifdef MOVER
      float mf = fract(rnd + uTime * aRnd.z / aRnd.y);
      p *= smoothstep(0.0, 0.05, mf) * (1.0 - smoothstep(0.95, 1.0, mf));
      p.z += (mf - 0.5) * aRnd.y;
    #endif
    vec4 ip = instanceMatrix * vec4(p, 1.0);
    #ifdef BOAT
      ip.y += sin(uTime * 1.1 + rnd * 30.0) * 0.24 + position.x * sin(uTime * 0.9 + rnd * 17.0) * 0.13 + position.z * sin(uTime * 0.7 + rnd * 9.0) * 0.03;
    #endif
    #ifdef PETAL
      float fall = mod(uTime * (0.7 + rnd * 0.8) + rnd * 40.0, aRnd.y);
      ip.y -= fall; ip.z += fall * aRnd.z;
      ip.x += sin(uTime * 1.2 + rnd * 30.0 + fall) * 0.5;
    #endif
    p = ip.xyz; n = normalize(mat3(instanceMatrix) * n); vCol = aCol;
    #ifdef USE_COLOR
      if (color.r + color.g + color.b < 2.9) vCol = color;
    #endif
  #else
    #ifdef USE_COLOR
      vCol = color;
    #else
      vCol = vec3(1.0);
    #endif
  #endif
  vec4 wp = modelMatrix * vec4(p, 1.0);
  vec3 wn = normalize(mat3(modelMatrix) * n);
  #if defined(LEAF) || defined(CLOTH) || defined(PETAL)
    if (dot(wn, uSun) < 0.0) wn = -wn;
  #endif
  vN = wn; vWp = wp.xyz;
  vSh = (uShadowMat * vec4(wp.xyz + wn * NOFF, 1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,vo=`
uniform sampler2D uShadowMap; uniform float uUseShadow, uShTexel, uShBias, uGain, uNight, uTime, uCloudK, uWob, uFoot;
uniform vec3 uSun, uViolet, uTone, uHaze, uHazeP, uAwn, uBoug, uTc[7];
varying vec3 vWp; varying vec3 vN; varying vec3 vCol; varying vec3 vSh;
#ifdef HOUSE
varying vec3 vO; varying vec3 vNo; varying vec4 vSz;
#endif
#ifdef FLATN
varying vec4 vT;
#endif
${ht}
float shadowLit(vec3 sh){
  if (uUseShadow < 0.5) return 1.0;
  if (sh.x < 0.0 || sh.x > 1.0 || sh.y < 0.0 || sh.y > 1.0 || sh.z > 1.0) return 1.0;
  float z = sh.z - uShBias, T = uShTexel;
  vec2 st = sh.xy / T - 0.5, ti = floor(st), tf = st - ti, b = (ti + 0.5) * T;
  float s00 = step(z, texture2D(uShadowMap, b).r), s10 = step(z, texture2D(uShadowMap, b + vec2(T, 0.0)).r);
  float s01 = step(z, texture2D(uShadowMap, b + vec2(0.0, T)).r), s11 = step(z, texture2D(uShadowMap, b + vec2(T, T)).r);
  return smoothstep(0.38, 0.62, mix(mix(s00, s10, tf.x), mix(s01, s11, tf.x), tf.y));
}
float cloudLit(vec2 xz){                 // a few round, scalloped puffs of shade drifting over the town; they thin out over the dome terrace
  vec2 q = xz + uTime * vec2(9.0, 3.5);
  float n = 0.8 * vnoise(q * 0.006) + 0.2 * vnoise(q * 0.03);
  n -= 0.35 * (1.0 - smoothstep(60.0, 130.0, length(xz - vec2(0.0, 10.0))));
  return 1.0 - step(1.0 - uCloudK * 1.5, n) * step(0.001, uCloudK);
}
// a plot of cut-out trees seen from the air: a flat canopy dab, its hard shadow beside it, fruit
vec3 grove(vec3 base, vec2 p, float cell, vec3 leaf, vec3 fruit, float k){
  vec2 g = p / cell, id = floor(g), f = fract(g) - 0.5 + (vec2(hash21(id), hash21(id + 7.3)) - 0.5) * 0.22;
  vec2 so = clamp(-uSun.xz / max(uSun.y, 0.3) * 1.5 / cell, -0.3, 0.3);
  float can = step(dot(f, f), 0.085), sh = step(dot(f - so, f - so), 0.085);
  vec2 fa = abs(f) - vec2(0.13, 0.11);
  float fr = step(dot(fa, fa), 0.0032) * step(0.3, hash21(id + 3.1));
  base = mix(base, base * vec3(0.55, 0.52, 0.8), sh * k);
  base = mix(base, leaf, can * k);
  return mix(base, fruit, fr * can * k);
}
void main(){
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 col = vCol; vec3 emis = vec3(0.0);
  float dist = distance(cameraPosition, vWp);
  #ifdef FLATN
    float top = step(0.80, N.y), y = vWp.y;
    float n1 = vnoise(vWp.xz * 0.045 + y * 0.05), n2 = vnoise(vWp.xz * 0.11 + 7.0);
    vec3 rock = mix(uTc[0], uTc[1], step(0.5, n1));
    vec3 terr = mix(uTc[2], uTc[3], step(0.56, n2));
    vec3 plat = mix(uTc[4], uTc[5], step(0.5, n2));
    vec3 tcol = mix(terr, plat, step(196.0, y));
    tcol = mix(tcol, uTc[2], step(y, 5.0));
    col = mix(rock, tcol, top);
    float gk = 1.0 - smoothstep(230.0, 340.0, dist);
    vec3 dkLeaf = vec3(0.03, 0.15, 0.05), lemC = vec3(0.91, 0.64, 0.02);
    if (top > 0.5 && n2 > 0.56 && y > 5.0 && y < 196.0) col = grove(col, vWp.xz, 3.7, dkLeaf, lemC, gk);          // the green plots are lemon groves
    else if (top > 0.5 && y >= 196.0 && n2 > 0.5) col = grove(col, vWp.xz, 5.2, uTc[5] * 0.62, uTc[5] * 0.62, gk);   // olives on the plateau
    // the terraces: drawn from the analytic terrace coordinate, so walls, lanes and the two-tone edge never follow the triangles
    float tm = step(0.5, vT.y) * step(0.17, vT.x);
    if (tm > 0.5) {
      float tq = vT.x, tfl = floor(tq), tfr = fract(tq), th = hash21(vec2(tfl, 3.7));
      vec2 wn = normalize(vT.zw + vec2(0.0, 1e-4)), wt = vec2(-wn.y, wn.x);
      float s = dot(vWp.xz, wt) + th * 60.0;
      float as = fwidth(s) + 1e-3, af = fwidth(tq) + 1e-4, thr = mix(0.62, 0.28, step(0.5, vT.z));
      if (tfr > thr) {                                            // the retaining wall
        float hg = (tfr - thr) / (1.0 - thr) * 12.0;                     // metres up the wall (in plan the wall is a narrow band)
        vec3 w0 = mix(uTc[0], uTc[1], step(0.5, th)) * mix(0.84, 0.95, step(0.5, fract(th * 7.3)));
        // the wall is a row of fronts: each stretch has its own wash, and some are house fronts with shutters, built into the cliff
        float sgw = 19.0 + 14.0 * fract(th * 9.1), sgc = (s + th * 37.0) / sgw, sgf = fract(sgc), sh2 = hash21(vec2(floor(sgc), tfl * 3.1 + 5.0));
        vec3 wallC = sh2 < 0.36 ? w0 : sh2 < 0.52 ? uTc[1] * vec3(1.03, 0.84, 0.82) : sh2 < 0.68 ? uTc[0] * vec3(1.0, 0.88, 0.66) : sh2 < 0.8 ? w0 * 1.1 : w0 * 0.93;
        float front = step(0.36, sh2) * step(sh2, 0.8) * step(0.5 / sgw, sgf) * step(sgf, 1.0 - 0.5 / sgw);
        float cell = floor(s / 6.5), ax = (fract(s / 6.5) - 0.5) * 6.5, hc = hash21(vec2(cell, tfl + 11.0));
        float arch = step(abs(ax), 2.0) * step(hg, 3.6 + sqrt(max(4.0 - ax * ax, 0.0))) * step(0.7, hc) * step(0.3, fract(th * 3.1 + floor(s / 52.0) * 0.37)) * step(0.8, hg) * (1.0 - front);
        col = mix(wallC, wallC * vec3(0.60, 0.56, 0.74), arch * step(dist, 520.0));
        float wcu = sgf * sgw / 3.1, wfx = fract(wcu), wr = fract((hg - 1.2) / 3.5), wst = floor((hg - 1.2) / 3.5);
        float wh = hash21(vec2(floor(wcu) + wst * 5.0, floor(sgc) + tfl * 9.0));
        float fwin = front * step(abs(wfx - 0.5), 0.2) * step(0.2, wr) * step(wr, 0.72) * step(1.2, hg) * step(hg, 10.2) * step(0.2, wh) * (1.0 - smoothstep(300.0, 460.0, dist));
        col = mix(col, mix(vec3(0.16, 0.42, 0.33), vec3(0.17, 0.36, 0.55), step(0.75, fract(sh2 * 13.7))), fwin);
        float wlit = fwin * step(0.45, fract(wh * 7.3)) * uNight;                           // evening: the fronts light up too
        col = mix(col, vec3(0.95, 0.72, 0.36), wlit); emis += wlit * vec3(3.4, 2.1, 0.8);
        col = mix(col, vec3(0.80, 0.13, 0.10), front * step(abs(wfx - 0.5), 0.2) * step(0.12, wr) * step(wr, 0.2) * step(0.6, wh) * step(1.2, hg) * step(hg, 10.2) * step(dist, 260.0));   // geraniums on the sill
        // washing on a line between the storeys, lifting in the breeze
        float lh = hg - 4.1, lu = sgf * sgw + sin(uTime * (1.4 + sh2) + floor(sgc) * 3.0 + hg * 1.5) * 0.38 * (1.0 - lh);
        float lhs = hash21(vec2(floor(lu / 0.95), floor(sgc) + tfl * 5.0));
        float wash = front * step(0.45, fract(sh2 * 23.0)) * step(0.0, lh) * step(lh, 1.0) * step(0.5 - 0.45 * fract(lhs * 7.0) + 0.13 * sin(uTime * 2.3 + lhs * 40.0), lh) * step(0.12, fract(lu / 0.95)) * step(0.35, lhs) * step(dist, 380.0);
        col = mix(col, lhs > 0.8 ? vec3(0.85, 0.45, 0.40) : lhs > 0.62 ? vec3(0.45, 0.60, 0.85) : vec3(0.95, 0.93, 0.86), wash);
        // bougainvillea and vines pouring over the coping
        float fl = 2.2 + 5.5 * vnoise(vec2(s * 0.8, tfl * 3.3));
        float fall = step(hc, 0.2) * step(abs(ax), 3.1) * step(12.0 - fl * sqrt(max(1.0 - ax * ax / 9.61, 0.0)) - 0.9 * vnoise(vec2(s * 2.1, tfl * 1.3)), hg) * step(dist, 700.0);   // a rounded, scalloped drape
        vec3 fc = mix(uBoug, vec3(0.05, 0.22, 0.08), step(hc, 0.06));
        col = mix(col, mix(fc, fc * vec3(0.78, 0.62, 0.86), step(0.5, vnoise(vec2(s * 1.7, hg * 1.3 + tfl)))), fall);
        col = mix(col, uTc[2] * 1.06, step(10.9, hg));             // the coping
        float sd = mod(s + tfl * 23.0, 58.0) - 6.0 - hg * 1.5;     // a stair zig-zagging from ledge to ledge
        float stair = step(abs(sd), 1.5) * step(th, 0.8);
        col = mix(col, mix(uTc[2] * 1.08, uTc[2] * 0.82, step(0.5, fract(hg * 1.6)) * step(dist, 260.0)), stair);
        N = normalize(vec3(wn.x, 0.22, wn.y));
      } else {                                                     // the ledge: a paved lane by the parapet, garden plots behind
        float lane = 1.0 - smoothstep(0.13 - af, 0.13 + af, tfr);
        float pw = 7.0 + 9.0 * fract(th * 5.7), gn = vnoise(vec2(s * 0.07, tfl * 5.1)) * 1.6, plot = floor(s / pw + gn);
        float hp = hash21(vec2(plot, tfl * 1.7));
        vec3 earth = mix(uTc[0], uTc[2], 0.5);
        vec3 gard = hp < 0.22 ? mix(uTc[3], earth, 0.3) : hp < 0.46 ? mix(uTc[5], earth, 0.35) : hp < 0.66 ? mix(uTc[3], earth, 0.7) : earth;
        gard = mix(gard, uTc[3] * 0.8, step(0.6, vnoise(vWp.xz * 0.5 + 3.0)) * step(0.66, hp) * step(hp, 0.86) * step(dist, 300.0));   // a few trees dabbed on the bare plots
        float rows = step(0.5, fract(s * 0.42 + plot * 0.3)) * step(0.6, hp) * step(dist, 240.0);
        gard = mix(gard, gard * 0.86, rows);
        if (hp < 0.22) gard = grove(gard, vWp.xz, 3.5, dkLeaf, lemC, gk);                    // a lemon grove
        else if (hp < 0.46) gard = grove(gard, vWp.xz, 4.4, uTc[5] * 0.62, uTc[5] * 0.62, gk);   // olives
        float edge = 1.0 - smoothstep(0.44 - as * 0.12, 0.44 + as * 0.12, abs(fract(s / pw + gn) - 0.5));
        gard = mix(uTc[2], gard, edge);
        col = mix(gard, uTc[2] * 1.03, max(max(lane, smoothstep(0.56 - af, 0.56 + af, tfr)), step(0.5, vT.z)));
        col = mix(col, uTc[2] * 0.8, (1.0 - smoothstep(0.025 - af, 0.025 + af, tfr)));   // parapet line
        N = vec3(0.0, 1.0, 0.0);
      }
    }
    col = mix(col, uTc[6], step(y, 0.6));
  #endif
  #ifdef PROPS
    if (abs(vWp.y - 3.27) < 0.04 && abs(vWp.z - 150.3) < 2.4 && abs(vWp.x) < 26.0 && dist < 90.0) {   // wet footprints drying on the quay
      float fxp = vWp.x * 1.25 + 0.5, id = floor(fxp), sd = mod(id, 2.0) * 2.0 - 1.0;
      vec2 f = vec2(fract(fxp) - 0.5, (vWp.z - 150.3 - sd * 0.16 - sin(id * 0.21) * 1.3) * 1.25);
      float foot = step(dot(f * vec2(4.2, 2.3), f * vec2(4.2, 2.3)), 0.25) + step(length((f - vec2(0.0, 0.3)) * vec2(4.6, 5.0)), 0.5);
      col = mix(col, col * vec3(0.62, 0.66, 0.74), min(foot, 1.0) * uFoot * step(fract(id * 0.137 + 0.2), 0.55 + 0.45 * uFoot));
    }
  #endif
  #ifdef HOUSE
    float det = 1.0 - smoothstep(260.0, 420.0, dist), hsh = vSz.x;
    #ifdef ROOFT
      col = mix(col, col * vec3(0.86, 0.82, 0.86), step(0.5, fract(vO.y * 1.9 + hsh * 3.0)) * det);   // rows of pantiles
    #else
    if (abs(vNo.y) > 0.5) {
      vec2 e = vSz.yw * 0.5 - abs(vO.xz);
      float rim = 1.0 - step(0.4, min(e.x, e.y)), rk = fract(hsh * 7.31);
      vec3 roof = mix(col * 0.93, mix(col, vec3(0.74, 0.43, 0.30), 0.7), step(0.55, rk));
      // roof terraces: pavers, a striped mat left out, the dark hatch of the stair
      vec2 pq = vO.xz / 1.4; float chk = mod(floor(pq.x) + floor(pq.y), 2.0);
      roof = mix(roof, roof * 0.9, chk * step(rk, 0.8) * (1.0 - smoothstep(120.0, 240.0, dist)));
      vec2 mq = vO.xz - (vec2(fract(hsh * 3.3), fract(hsh * 5.9)) - 0.5) * vSz.yw * 0.45;
      float mat = step(abs(mq.x), 1.3) * step(abs(mq.y), 0.8) * step(fract(hsh * 17.9), 0.45) * det;
      roof = mix(roof, mix(vec3(0.96, 0.93, 0.84), mix(uAwn, vec3(0.17, 0.36, 0.55), step(0.5, fract(hsh * 29.3))), step(0.5, fract(mq.x * 1.9))), mat);
      vec2 hq = vO.xz + (vec2(fract(hsh * 4.7), fract(hsh * 8.3)) - 0.5) * vSz.yw * 0.5;
      roof = mix(roof, vec3(0.16, 0.15, 0.26), step(abs(hq.x), 0.55) * step(abs(hq.y), 0.8) * step(0.5, fract(hsh * 37.1)) * det * (1.0 - mat));
      col = mix(roof, col, rim);
      vec2 gq = vO.xz * 0.7 + hsh * 40.0, gf = fract(gq) - 0.5; float gh = hash21(floor(gq));   // something glass left out in the sun
      emis += step(0.94, gh) * step(dot(gf, gf), 0.05) * step(0.55, sin(uTime * (2.0 + gh * 3.0) + gh * 60.0)) * (1.0 - uNight) * det * (1.0 - rim) * vec3(4.5, 4.4, 4.0);
    } else {
      float sx = step(0.5, abs(vNo.x));
      float W = mix(vSz.y, vSz.w, sx), u = mix(vO.x, vO.z, sx) + W * 0.5;
      float yT = vSz.z - vO.y;
      float nb = max(1.0, floor(W / mix(2.4, 3.5, fract(hsh * 5.3)))), cw = W / nb, cu = u / cw, cv = (yT - 0.7) / 3.3;
      float fx = fract(cu), fy = fract(cv), st = floor(cv);
      float ok = step(0.7, yT) * step(st, 3.5) * step(0.75, vSz.z - 0.7 - (st + 0.85) * 3.3) * det;
      float h2 = hash21(vec2(floor(cu) + st * 7.3 + sx * 3.0, hsh * 91.7));
      float ax = fwidth(cu) + 1e-4, ay = fwidth(cv) + 1e-4;
      float wx = 1.0 - smoothstep(0.21 - ax, 0.21 + ax, abs(fx - 0.5));
      float wy = smoothstep(0.22 - ay, 0.22 + ay, fy) * (1.0 - smoothstep(0.72 - ay, 0.72 + ay, fy));
      // the top floor of some houses has round-headed windows
      float wrad = 0.21 * cw, ady = (0.22 + wrad / 3.3 - fy) * 3.3, adx = (fx - 0.5) * cw;
      float rnd = mix(1.0, step(adx * adx + ady * ady, wrad * wrad), step(0.0, ady) * step(0.6, fract(hsh * 3.7)) * step(st, 0.5));
      float win = wx * wy * ok * step(0.14, h2) * rnd;
      vec3 shut = mix(vec3(0.16, 0.42, 0.33), vec3(0.17, 0.36, 0.55), step(0.78, fract(hsh * 13.7)));
      // evening: most windows lit; some lamps go on and off as people move from room to room, a few televisions flicker blue
      float tw = fract(h2 * 31.7), ph = uTime * (0.10 + 0.12 * fract(h2 * 53.1)) + h2 * 17.0;
      float open = step(0.5, uNight) * mix(step(0.45, fract(h2 * 7.3)), step(0.5, fract(ph)), step(0.7, tw));
      float tv = step(tw, 0.1), tfl = 0.5 + 0.5 * step(0.5, fract(sin(floor(uTime * 5.0 + h2 * 40.0) * 12.9898 + h2 * 7.0) * 43758.5));
      col = mix(col, mix(col, vec3(1.0, 0.95, 0.85), 0.55), step(yT, 0.42) * det);            // a pale cornice
      col = mix(col, mix(shut, vec3(0.95, 0.72, 0.36), open), win);
      emis += open * win * mix(vec3(3.4, 2.1, 0.8), vec3(1.0, 1.6, 3.0) * tfl, tv);
      float split = (1.0 - smoothstep(0.012, 0.012 + ax, abs(fx - 0.5))) * win * (1.0 - open);
      col = mix(col, shut * 0.6, split);
      float sill = wx * smoothstep(0.72, 0.72 + ay, fy) * (1.0 - smoothstep(0.80, 0.80 + ay, fy)) * ok * step(0.5, h2);
      col = mix(col, mix(vec3(0.80, 0.13, 0.10), vec3(0.20, 0.45, 0.22), step(0.5, fract(fx * 5.0 + h2 * 9.0))), sill);
      float aw = step(0.9, h2) * ok * step(0.05, fy) * step(fy, 0.2) * step(abs(fx - 0.5), 0.33);
      col = mix(col, mix(vec3(1.0, 0.95, 0.85), uAwn, step(0.5, fract(fx * 9.0))), aw);
      // a balcony along the second floor: slab, rail and bars
      float bal = step(0.5, fract(hsh * 11.1)) * step(abs(st - 1.0), 0.5) * ok * step(abs(fx - 0.5), mix(0.36, 0.5, step(0.75, fract(hsh * 19.3))));
      float bars = step(0.62, fract(fx * cw * 3.2)) * (1.0 - smoothstep(90.0, 170.0, dist));
      col = mix(col, vec3(0.12, 0.14, 0.22), bal * step(0.50, fy) * step(fy, 0.76) * max(step(fy, 0.54), bars));
      col = mix(col, vec3(0.95, 0.90, 0.80), bal * step(0.76, fy) * step(fy, 0.84));
      // the street front: a door, and on some a striped shop awning
      float frontF = step(0.5, vNo.z), du = u - W * (0.5 + (fract(hsh * 9.7) - 0.5) * 0.3);
      float door = frontF * step(abs(du), 0.62) * step(1.4, vO.y) * step(vO.y, 3.4 + sqrt(max(0.3844 - du * du, 0.0))) * det;
      col = mix(col, shut * 0.5, door);
      float shop = frontF * step(fract(hsh * 23.3), 0.22) * step(abs(u - W * 0.5), W * 0.4) * step(3.9, vO.y) * step(vO.y, 4.8) * det;
      col = mix(col, mix(vec3(1.0, 0.95, 0.85), uAwn, step(0.5, fract(u * 0.8))), shop);
    }
    #endif
  #endif
  vec3 shc = vSh; shc.xy += vec2(sin(uTime * 1.7 + vWp.x * 0.9 + vWp.y), cos(uTime * 1.3 + vWp.z * 0.9)) * uWob;   // heat shimmer on every shadow edge
  float lit = step(LIT_EDGE, dot(N, uSun)) * shadowLit(shc);
  lit *= cloudLit(vWp.xz);
  vec3 shade = mix(col * vec3(0.40, 0.38, 0.72), uViolet, 0.28);
  #ifdef CLOTH
    shade = mix(shade, col * vec3(0.86, 0.84, 0.98), 0.36);                 // cloth lets the light through
  #endif
  shade *= 1.0 - 0.09 * step(halftone(3.0), 0.09);
  vec3 c = mix(shade, col * uGain, lit) * uTone + emis;
  float hz = floor(clamp((dist - uHazeP.x) / (uHazeP.y - uHazeP.x), 0.0, 1.0) * 3.0 + 0.5) / 3.0 * uHazeP.z;
  gl_FragColor = vec4(mix(c, uHaze, hz), 1.0);
}`,dt=`
varying vec3 vWp; varying vec2 vUv2;
void main(){ vUv2 = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vWp = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,go=`
uniform vec3 uCol, uHaze; uniform float uK;
varying vec3 vWp; varying vec2 vUv2;
void main(){ gl_FragColor = vec4(mix(uCol, uHaze, uK), 1.0); }`,wo=`
uniform float uAng, uR; uniform vec3 uCol; uniform vec2 uCenter;
varying vec3 vWp; varying vec2 vUv2;
void main(){
  float a = atan(vWp.z - uCenter.y, vWp.x - uCenter.x), r = length(vWp.xz - uCenter);
  float back = uAng - a; back = mod(back + 3.14159, 6.28318) - 3.14159;
  if (back < 0.0 || back > 0.75) discard;
  float sp = back * uR * 0.10 + 4.0, d = abs(r - uR);
  float arm = step(abs(d - sp), 3.0 + back * 12.0) + step(d, sp * 0.45) * step(0.5, fract(back * 40.0 - d * 0.02));
  if (arm < 0.5) discard;
  gl_FragColor = vec4(uCol, 1.0);
}`,yo=`
varying vec3 vDir;
void main(){ vDir = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv; gl_Position.z = gl_Position.w * 0.9999; }`,xo=`
uniform vec3 uZen, uMid, uLow, uHazeC, uSun, uSunCol, uCloud, uCloudSh, uSea; uniform float uTime, uGain, uStars, uCloudAz, uClouds;
varying vec3 vDir;
${ht}
float puff(vec2 q, vec2 c, float r){ return step(length((q - c) * vec2(1.0, 1.25)), r); }
void main(){
  vec3 d = normalize(vDir); float e = d.y;
  vec2 hq = gl_FragCoord.xy * (450.0 / max(uRes.y, 1.0)) / 5.0; hq = vec2(hq.x + hq.y, hq.x - hq.y) * 0.7071;   // a fine screen, sized from the frame
  vec2 hg = fract(hq) - 0.5; float ht = dot(hg, hg) * 2.0;
  vec3 c = uLow;
  float b1 = smoothstep(0.142, 0.168, e), b2 = smoothstep(0.347, 0.373, e);   // the joins are 1.5 degrees tall; the bands themselves are flat paint
  c = mix(c, uMid, mix(b1, step(ht, b1), 0.33));
  c = mix(c, uZen, mix(b2, step(ht, b2), 0.33));
  c = mix(c, uHazeC, step(e, 0.035));
  if (uStars > 0.0 && e > 0.2) { vec2 sq = d.xz / (0.35 + e) * 110.0, sg = floor(sq), sf = fract(sq) - 0.5; c += step(0.99, hash21(sg)) * step(dot(sf, sf), 0.03 + 0.05 * hash21(sg + 3.0)) * uStars * vec3(1.6, 1.7, 2.0) * (0.6 + 0.4 * sin(uTime * (2.0 + 3.0 * hash21(sg + 7.0)) + hash21(sg + 5.0) * 40.0)); }
  // flat-bottomed puffs standing over the far headland, drifting at walking pace
  float az = atan(d.x, d.z + 1e-5);
  for (int i = 0; i < 3; i++) {
    float fi = float(i); if (fi >= uClouds) break;
    vec2 q = vec2(mod(az - uCloudAz - fi * 1.9 - uTime * 0.0012 + 3.14159, 6.28318) - 3.14159, e - 0.115 - fi * 0.035);
    float s = 1.0 - fi * 0.22;
    float m = max(max(puff(q, vec2(0.0, 0.012) * s, 0.034 * s), puff(q, vec2(0.04, 0.006) * s, 0.026 * s)), max(puff(q, vec2(-0.045, 0.004) * s, 0.024 * s), puff(q, vec2(0.015, 0.03) * s, 0.022 * s)));
    m *= step(0.0, q.y);
    c = mix(c, mix(uCloudSh, uCloud, step(0.012 * s, q.y)), m);
  }
  float sd = dot(d, uSun);
  c = mix(c, uSunCol, step(0.9992, sd));
  c = mix(c, uSea, step(e, -0.002));
  gl_FragColor = vec4(c * uGain, 1.0);
}`,pt=29,Mo=`
uniform vec4 uBoats[${pt}]; uniform vec3 uSun, uSand, uRock, uShallow, uDeep, uDeep2, uHaze, uHazeP, uTone, uOcto; uniform float uTime, uGlint, uGain;
varying vec3 vWp; varying vec2 vUv2;
${ht}
float dash(vec2 q, vec2 dir){ return step(abs(dot(q, dir)), 0.42) * step(abs(dot(q, vec2(-dir.y, dir.x))), 0.09); }
float fish(vec2 p){
  vec2 c = floor(p / 9.0); float h = hash21(c); if (h < 0.4) return 0.0;
  float t = uTime * (0.25 + h * 0.3) + h * 40.0;
  vec2 o = vec2(sin(t) * 2.8, cos(t * 0.8) * 2.0), dir = normalize(vec2(cos(t) * 2.8, -sin(t * 0.8) * 1.6) + vec2(1e-3, 0.0));
  vec2 q = p - (c + 0.5) * 9.0 - o, sd = vec2(-dir.y, dir.x);
  return max(dash(q, dir), max(dash(q - dir * 0.7 - sd * 0.5, dir), dash(q + dir * 0.9 + sd * 0.45, dir)));
}
float glit(vec2 p, float sc, float th){ vec2 q = p * sc, gc = floor(q), f = fract(q) - 0.5;
  float tw = hash21(gc + floor(uTime * 3.0 + hash21(gc) * 3.0) * 7.1); return step(th, tw) * step(abs(f.x) + abs(f.y), 0.34); }
void main(){
  vec3 V = normalize(vWp - cameraPosition);
  float dist = distance(cameraPosition, vWp);
  float deepK = smoothstep(290.0, 420.0, vWp.z + max(vWp.x, 0.0) * 0.5);
  float rs = min(length(V.xz) / 1.33, 0.74);
  vec2 par = V.xz / 1.33 / sqrt(1.0 - rs * rs);
  vec2 fp = vWp.xz + par * 6.0;
  float rk = vnoise(fp * 0.16 + 3.0) + 0.22 * vnoise(fp * 0.7 + 11.0);              // rocks: small dark clusters, seagrass round them
  vec3 fl = mix(uSand, uRock, step(0.9, rk));
  fl = mix(fl, uRock * vec3(0.62, 0.86, 0.74), step(0.8, rk) * step(rk, 0.94) * step(0.66, vnoise(fp * vec2(3.2, 0.7) + 5.0)) * (1.0 - smoothstep(90.0, 200.0, dist)));
  fl = mix(fl, uSand * 1.07, step(0.72, vnoise(fp * vec2(0.6, 0.14) + 9.0)) * step(rk, 0.7));
  vec2 so = -uSun.xz / max(uSun.y, 0.8) * 7.5; float shK = smoothstep(0.15, 0.45, uSun.y);
  float sh = 0.0;
  for (int i = 0; i < ${pt}; i++) {
    vec4 b = uBoats[i]; vec2 q = fp - (b.xy + so); float cs = cos(b.z), sn = sin(b.z);
    q = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y) / (vec2(1.25, 3.3) * max(b.w, 0.01));
    float hw = 1.0 - q.y * q.y * mix(0.25, 1.0, step(0.0, q.y));                    // a hull: pointed bow, square stern
    sh = max(sh, step(abs(q.x), hw) * step(-0.8, q.y) * step(q.y, 1.0));
  }
  float fishK = 1.0 - smoothstep(70.0, 180.0, dist);                                 // from the helix the fish would only be specks
  sh = max(sh, fish(fp - so * 0.3) * 0.8 * fishK);
  fl = mix(fl, vec3(0.62, 0.30, 0.25), step(length((fp - uOcto.xy) * vec2(1.0, 1.4)), 1.0 + 0.25 * sin(uTime * 2.0)));
  vec3 w = mix(fl, uShallow, 0.40 + 0.38 * (1.0 - abs(V.y)) * smoothstep(8.0, 130.0, dist));   // close in the water is glass-clear
  w = mix(w, w * vec3(0.40, 0.43, 0.70), sh * (0.3 + 0.7 * shK) * (1.0 - 0.5 * smoothstep(60.0, 220.0, dist)));   // boat and fish shadows on the sand, hard-edged
  w = mix(w, vec3(0.10, 0.17, 0.27), fish(vWp.xz + par * 2.5) * fishK);
  float sw = sin(vWp.z * 0.07 + vWp.x * 0.025 + uTime * 0.5 + vnoise(vWp.xz * 0.02) * 5.0);
  w = mix(w, mix(uDeep, uDeep2, step(0.45, sw) * (1.0 - smoothstep(900.0, 1500.0, dist))), deepK);
  w = mix(w, w * 1.07, step(0.8, sin(vWp.z * 0.21 - vWp.x * 0.06 + uTime * 0.8 + vnoise(vWp.xz * 0.05) * 4.0)) * (1.0 - deepK) * (1.0 - smoothstep(150.0, 300.0, dist)));
  vec3 R = reflect(V, vec3(0.0, 1.0, 0.0)); float sa = pow(max(dot(R, uSun), 0.0), 3.0);
  float gth = 1.0 - 0.006 - 0.05 * sa;
  float g = glit(vWp.xz, 3.0, gth) * (1.0 - smoothstep(25.0, 70.0, dist)) + glit(vWp.xz, 0.9, gth) * smoothstep(20.0, 60.0, dist) * (1.0 - smoothstep(140.0, 460.0, dist));
  vec3 c = w * uTone * uGain + g * uGlint * vec3(1.0, 0.98, 0.9);
  float hz = floor(clamp((dist - uHazeP.x) / (uHazeP.y - uHazeP.x), 0.0, 1.0) * 3.0 + 0.5) / 3.0 * uHazeP.z;
  gl_FragColor = vec4(mix(c, uHaze, hz), 1.0);
}`,zo=`
attribute vec4 aA; attribute vec4 aB; attribute vec4 aCol;
uniform float uTime, uCamZ, uAll, uComp; uniform vec3 uLead, uLeadF;
varying vec3 vCol;
void main(){
  float kind = aA.w, rnd = aB.w, sc = aCol.w;
  vec3 p = position; vec3 pos; vec3 fwd; float flap;
  if (kind < 0.5) {
    float a = uTime * aB.z + aB.y;
    float r = aB.x * (1.0 + 0.25 * sin(a * 2.0 + rnd * 9.0));
    pos = aA.xyz + vec3(cos(a) * r, sin(a * 3.0 + rnd * 20.0) * 3.5 + sin(a * 0.7 + rnd * 5.0) * 4.0, sin(a) * r);
    fwd = normalize(vec3(-sin(a), 0.25 * cos(a * 3.0 + rnd * 20.0), cos(a)) * sign(aB.z));
    flap = sin(uTime * 22.0 + rnd * 60.0) * step(0.35, fract(uTime * 0.45 + rnd * 7.0));
  } else if (kind < 1.5) {
    vec3 F = normalize(uLeadF + vec3(0.0, 0.0, 1e-4)); vec3 Rr = normalize(cross(F, vec3(0.0, 1.0, 0.0)));
    float peel = smoothstep(0.55, 0.95, sin(uTime * 0.23 + rnd * 6.28));
    pos = uLead + Rr * (aA.x * (1.0 + peel * 2.5) + sin(uTime * 0.9 + rnd * 20.0) * 0.8)
        + vec3(0.0, 1.0, 0.0) * (aA.y + peel * 6.0 * (rnd - 0.3) + sin(uTime * 1.3 + rnd * 9.0) * 0.7 + (1.0 - uComp) * 18.0)
        + F * (aA.z + sin(uTime * 0.6 + rnd * 5.0) * 2.5);
    fwd = normalize(F + Rr * cos(uTime * 0.9 + rnd * 20.0) * 0.1 + vec3(0.0, 0.1 * cos(uTime * 1.3 + rnd * 9.0), 0.0));
    flap = sin(uTime * 22.0 + rnd * 60.0) * step(0.35, fract(uTime * 0.45 + rnd * 7.0));
    sc *= uComp;
  } else {
    float e = max(clamp((uCamZ - aA.z + 36.0) / 30.0, 0.0, 1.0), uAll);
    float k = 1.0 - (1.0 - e) * (1.0 - e);
    float a = aB.y + uTime * 0.5 * aB.z * step(0.001, e);
    pos = aA.xyz + vec3(aB.x * k * sign(aB.z) * (0.7 + 0.3 * sin(a)), k * (5.0 + rnd * 9.0) + sin(a * 1.3) * 1.2 * k, k * (10.0 + rnd * 14.0) + cos(a) * 4.0 * k);
    fwd = normalize(vec3(sign(aB.z) * (0.5 + 0.5 * k), 0.5 * (1.0 - k) + 0.05, 0.8));
    if (e < 0.001) { fwd = vec3(cos(aB.y * 7.0), 0.0, sin(aB.y * 7.0)); p.x *= 0.22; p.y = abs(p.x) * 0.3 + max(p.y, 0.0) + 0.12; }
    flap = sin(uTime * 9.0 + rnd * 60.0) * step(0.001, e);
  }
  p.y += abs(p.x) * flap * 0.75; p.x *= 1.0 - 0.3 * abs(flap);
  vec3 rt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)) + vec3(1e-5, 0.0, 0.0)); vec3 up = cross(rt, fwd);
  pos += (rt * p.x + up * p.y + fwd * p.z) * sc;
  vCol = aCol.rgb;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}`,bo=`
uniform vec3 uTone; varying vec3 vCol;
void main(){ gl_FragColor = vec4(vCol * uTone, 1.0); }`,To={noon:{cloudK:.1,el:78,az:.55,zen:"#2F7FD1",mid:"#5FA4DF",low:"#9CCBEA",haze:"#DCEBF2",hazeP:[320,2600,.8],tone:[1,1,1],gain:1.06,violet:"#3E3A5C",shallow:"#2BB5B0",deep:"#2468B4",deep2:"#2F7FD1",sand:"#DDCB98",sunCol:[3.2,3.1,2.8],cloud:"#FFFDF4",cloudSh:"#B9C6E6",clouds:2,night:0,exposure:1,glint:4.5},morning:{cloudK:.13,el:23,az:1.15,zen:"#4F97D8",mid:"#9CC6E4",low:"#F7DEC4",haze:"#F1E3DA",hazeP:[260,2200,.85],tone:[1.07,.97,.84],gain:1.08,violet:"#46386A",shallow:"#3FB7B4",deep:"#2E6FAE",deep2:"#4A8CC6",sand:"#E6D6B0",sunCol:[3.4,3,2.2],cloud:"#FFF2E0",cloudSh:"#C7B6D8",clouds:2,night:0,exposure:1,glint:4},evening:{cloudK:0,el:13,az:-1.25,zen:"#17245C",mid:"#3B4F9E",low:"#E8846B",haze:"#8E7FB0",hazeP:[240,2e3,.8],tone:[.5,.56,.92],gain:.92,violet:"#2A2750",shallow:"#2C7F9E",deep:"#1B3270",deep2:"#2A4690",sand:"#B9B4B8",sunCol:[.9,.5,.4],cloud:"#F2A58C",cloudSh:"#6A5C98",clouds:2,night:1,exposure:1.05,glint:1.2},scirocco:{cloudK:.1,el:56,az:.9,zen:"#E9A877",mid:"#F2C394",low:"#F7DDB8",haze:"#EFD2A8",hazeP:[150,1300,.92],tone:[1.05,.93,.78],gain:1.04,violet:"#5A3F5E",shallow:"#3FAE9C",deep:"#3B7C9C",deep2:"#59A0AE",sand:"#E8D4A6",sunCol:[3,2.6,1.9],cloud:"#FBE6C8",cloudSh:"#D9B090",clouds:0,night:0,exposure:.98,glint:3.2},spring:{cloudK:.14,el:62,az:.35,zen:"#3A8FE0",mid:"#79B8EC",low:"#BFE0F2",haze:"#E2F0F2",hazeP:[340,2800,.75],tone:[1,1.01,.99],gain:1.05,violet:"#3E3A66",shallow:"#35C6B4",deep:"#2274C0",deep2:"#3690D8",sand:"#EDE2B8",sunCol:[3.2,3.1,2.8],cloud:"#FFFFFA",cloudSh:"#B4C8EA",clouds:3,night:0,exposure:1,glint:4.5}},Yt=new l.Euler,$t=new l.Quaternion,Co=new l.Vector3,So=new l.Vector3;function G(A,w,B0,O=0,R0=1,D0=1,Y0=1,te=0,p0=0){return Yt.set(te,O,p0,"YXZ"),$t.setFromEuler(Yt),new l.Matrix4().compose(Co.set(A,w,B0),$t,So.set(R0,D0,Y0))}const s0=(A,w,B0)=>{const O=Math.min(1,Math.max(0,(B0-A)/(w-A)));return O*O*(3-2*O)},Z=(A,w,B0)=>A+(w-A)*B0,L0=Math.PI/180;var Po={id:"lemon-cliffs",name:"The Lemon Cliffs",category:"city",weirdness:.05,media:["air","open"],async build(A){const w=A.rng,B0=A.vary||{},O=w.fork("lc-look"),R0=A.noise,D0=A.quality?.detail??1,Y0=Math.min(1.3,Math.max(.7,B0.density??1)),te=B0.hour||"any";let p0=O.pick(["noon","noon","noon","morning","evening","scirocco","spring","spring"]);te==="dawn"?p0="morning":te==="night"?p0="evening":te==="golden"?p0=O.chance(.6)?"scirocco":"evening":te==="day"&&(p0=O.pick(["noon","noon","spring"]));const E=To[p0],Ce=!!B0.rare,I0=E.night,mt=O.chance(.4),vt=O.chance(.35),q=e=>new l.Color(e),Qt=Xt.map(q),[K,C,j,H,u0,h0,S0]=Qt,T=(e,t,u,n=1)=>e.clone().lerp(t,u).multiplyScalar(n),W=C.clone().multiplyScalar(.86),m0=T(C,j,.38,.78),Se=T(C,j,.16,.8),O0=T(H,j,.15,.72),Ae=T(H,C,.45,.85),X=T(h0,K,.2,.75),g0=q("#2C6A37"),W0=q("#1B4A2E"),He=q("#3F8050"),_e=q("#8FA98A"),Ze=q("#1F4A33"),$0=p0==="spring"?q("#9B7FD6"):T(H,q("#E23E8A"),.6),oe=p0==="spring"?q("#B9A2E8"):T(H,q("#E23E8A"),.3),gt=E.az+O.range(-.2,.2),je=(E.el+O.range(-3,3))*L0,T0=new l.Vector3(Math.sin(gt)*Math.cos(je),Math.sin(je),Math.cos(gt)*Math.cos(je)).normalize(),I=new l.Scene,ae=q(E.haze);I.background=ae.clone(),I.fog=new l.Fog(ae.clone(),500,6e3);const Y=await ho(A,{palette:Xt,sunDir:T0.clone()});Y.object.position.set(0,_,0),Y.object.updateMatrixWorld(!0),I.add(Y.object);const r0=Y.anchors,wt=r0.side,de=r0.domeCenter.x;Y.uniforms.uGain.value=E.gain,Y.uniforms.uViolet.value.set(E.violet),Y.uniforms.uTone&&Y.uniforms.uTone.value.set(E.tone[0],E.tone[1],E.tone[2]),Y.uniforms.uCloudK&&(Y.uniforms.uCloudK.value=E.cloudK),await A.yield();const F=-108,A0=150,ke=104,N0=[[F,A0,44],[F,A0,64],[F,A0,84],[F,A0,104]],Jt=_+r0.domePass[0].y;for(let e=112;e<=312;e+=20){const t=s0(200,315,e),u=Z(-3,de,t),n=Z(105,90,t),a=e*L0,c=Jt+.0865*90*(330.7-e)*L0+44.5*(1-s0(90,255,e));N0.push([u-n*Math.sin(a),c,ke-n*Math.cos(a)])}for(const e of r0.domePass)N0.push([e.x,e.y+_,e.z]);const eo=_+r0.domePass[7].y,V0=[45,85],se=45,pe=[[29,90],[90,53],[180,72],[270,60],[360,se]],to=e=>{for(let t=0;t<4;t++)if(e<=pe[t+1][0])return Z(pe[t][1],pe[t+1][1],s0(pe[t][0],pe[t+1][0],e));return se};for(let e=52;e<=360;e+=22){const t=s0(29,270,e),u=Z(de,V0[0],t),n=Z(ke,V0[1],t),a=to(e),c=e*L0;N0.push([u-a*Math.sin(c),Z(eo,50,s0(29,360,e)),n-a*Math.cos(c)])}N0.push([V0[0]-se*Math.cos(60*L0),44.5,V0[1]-se*Math.sin(60*L0)],[V0[0]-se*Math.cos(30*L0),38.6,V0[1]-se*Math.sin(30*L0)]);const U=96,d0=142,t0=3,v0=e=>_-Math.min(1,Math.max(0,(e-U)/(d0-U)))*(_-t0);N0.push([0,34.2,80],[0,32,92]);for(const e of[102,113,124,135])N0.push([0,v0(e)+2.9,e]);const Q=396;N0.push([0,7.2,147],[0,7.4,166],[0,7.6,200],[0,7.6,240],[0,7.8,280],[0,8.4,320],[0,9,352],[0,9,376],[0,9,Q]);const M0=uo(N0),H0=(e,t)=>M0.nearestXZ(e,t).u,P0=H0(F,104),Fe=H0(r0.domePass[4].x,r0.domePass[4].z),ne=H0(0,100),re=H0(0,150),yt=H0(0,252),Ao=H0(0,330),_0=[];for(let e=0;e<=260;e++){const t=M0.pointAt(e/260);_0.push(t.x,t.y,t.z)}const q0=(e,t,u)=>{let n=1e9;for(let a=0;a<_0.length;a+=3){const c=_0[a]-e,s=_0[a+1]-t,r=_0[a+2]-u,i=c*c+s*s+r*r;i<n&&(n=i)}return Math.sqrt(n)},i0=[],xt={i:0};for(let e=0,t=new l.Vector3;e<M0.length+1;e+=1)M0.posAtDist(Math.min(e,M0.length),t),i0.push(t.x,t.y,t.z);const Mt=(e,t,u)=>{let n=1e9;for(let a=0;a<i0.length;a+=3){const c=i0[a]-e,s=i0[a+1]-t,r=i0[a+2]-u,i=c*c+s*s+r*r;i<n&&(n=i,xt.i=a)}return Math.sqrt(n)},oo=6;{const e=Y.object.getObjectByName("cloth"),t=new l.Matrix4;let u=0;if(e)for(let n=0;n<e.count;n++){e.getMatrixAt(n,t);const a=t.elements,c=.5*Math.hypot(a[0],a[1],a[2],a[4],a[5],a[6]);Mt(a[12]-a[4]*.5,_+a[13]-a[5]*.5,a[14]-a[6]*.5)<oo+c&&(e.setMatrixAt(n,t.makeScale(0,0,0)),u++)}u&&(e.instanceMatrix.needsUpdate=!0,Y.setSun(T0))}const w0=[60,30,-34],y0=[211,200,-170],zt=Math.hypot(y0[0]-w0[0],y0[2]-w0[2]),Ke=(e,t,u,n,a,c)=>{const s=a-u,r=c-n,i=Math.min(1,Math.max(0,((e-u)*s+(t-n)*r)/(s*s+r*r)));return[Math.hypot(e-u-s*i,t-n-r*i),i]},J=[];for(let e=0;e<=7;e++){const t=137+e*25;J.push([t,_+(t-125)*.85+.4,e%2?112:30])}J.unshift([112,_+.4,112]);const Ue=w.range(0,100),Ee=12,R={q:0,mask:0,nx:0,nz:1},bt=(e,t)=>{const u=t>d0?t0:t>U?v0(t):_,n=Math.max(0,-30-t)*1.25,a=-70-130*s0(108,128,t),c=Math.max(0,a-e)*3.2,s=Math.max(0,e-125)*.85;let r=Math.max(n,c,s);n>=c&&n>=s?(R.nx=0,R.nz=1):c>=s?(R.nx=1,R.nz=0):(R.nx=-1,R.nz=0);const i=205-u+R0.n2(e*.006+Ue,t*.006)*6;if(R.mask=r>2&&r<i?1:0,R.q=Math.min(r,i)/Ee,r=Math.min(r,i),r>2){const z=r/Ee,S=Math.floor(z);r=(S+s0(R.nx>0?.28:.62,1,z-S))*Ee}let f=u+r+(r>2?R0.n2(e*.03,t*.03+Ue)*.5:0);const[M,m]=Ke(e,t,w0[0],w0[2],y0[0],y0[2]);M<10&&(f=Z(Z(w0[1],y0[1],m)-.9,f,s0(4,10,M)),R.mask=0);for(let z=0;z<J.length-1;z++){const S=J[z],h=J[z+1],[b,x]=Ke(e,t,S[0],S[2],h[0],h[2]);b<9&&(f=Z(Z(S[1],h[1],x)-.5,f,s0(3.5,9,b)),R.mask=0)}const d=(e-8)/165,o=t-235,p=o<0?Math.hypot(d,o/85):Math.abs(d)/(1+o/260),v=(e<0?292:262)+R0.n2(e*.01,Ue)*14,g=Math.max(1-s0(.93,1.06,p),s0(v-22,v+12,t),s0(380,430,Math.abs(e)));return g>.01&&(R.mask=0),f=Z(f,-7,g),f},Be=20,me=46,Xe=38,Tt=new Uint8Array(me*Xe);for(let e=0;e<_0.length;e+=3)for(let t=-2;t<=2;t++)for(let u=-2;u<=2;u++){const n=Math.floor((_0[e]+460)/Be)+t,a=Math.floor((_0[e+2]+300)/Be)+u;n>=0&&n<me&&a>=0&&a<Xe&&(Tt[a*me+n]=1)}const o0=(e,t)=>{let u=bt(e,t);Math.abs(e-F)<16&&t>22&&t<112&&(u=Math.min(u,t>93?A0-10.5:A0-4.2));const n=Math.floor((e+460)/Be),a=Math.floor((t+300)/Be);if(!(n>=0&&n<me&&a>=0&&a<Xe&&Tt[a*me+n]))return u;const c=M0.nearestXZ(e,t);if(c.dist<16){const s=c.y-(c.u>P0+.01&&c.u<ne-.06?8.5:3.3);u>s&&(u=Z(s,u,s0(7,16,c.dist)),R.mask=0)}return Math.abs(e)<7&&t>U-3&&t<d0+3&&(u-=1.6),u};await A.yield();const k0=A.quality?.mobile||A.quality?.level==="low"?2048:4096,ve=345,n0={uShadowMap:{value:null},uUseShadow:{value:0},uShTexel:{value:1/k0},uShBias:{value:6e-4},uShadowMat:{value:new l.Matrix4},uGain:{value:E.gain},uNight:{value:I0},uCloudK:{value:E.cloudK},uWob:{value:(I0?.04:.17)/(2*ve)},uTime:{value:0},uSun:{value:T0},uViolet:{value:q(E.violet)},uTone:{value:new l.Vector3(E.tone[0],E.tone[1],E.tone[2])},uHaze:{value:ae.clone()},uHazeP:{value:new l.Vector3(E.hazeP[0],E.hazeP[1],E.hazeP[2])},uRes:{value:new l.Vector2(800,450)},uFoot:{value:1},uBoug:{value:$0.clone()},uAwn:{value:O.chance(.5)?H.clone():T(u0,C,.2)},uTc:{value:[T(C,j,.3,.8),T(C,H,.34,.74),Se.clone(),q(p0==="scirocco"?"#96A068":"#74A060"),q("#B9B27A"),_e.clone(),q(E.sand)]}},ao=[],Ye=(e={},t={})=>{const u=new l.ShaderMaterial({uniforms:n0,vertexShader:mo,fragmentShader:vo,defines:{LIT_EDGE:"0.06",NOFF:"0.35",...e},...t});return ao.push(u),u};{const c=Math.round(260.6060606060606),s=Math.round(710/3.3),r=new Float32Array((c+1)*(s+1)*3),i=new Float32Array((c+1)*(s+1)*4);let f=0,M=0;for(let S=0;S<=s;S++){const h=-280+710*S/s;for(let b=0;b<=c;b++){const x=-430+860*b/c;r[f++]=x,r[f++]=o0(x,h),r[f++]=h,i[M++]=R.q,i[M++]=R.mask,i[M++]=R.nx,i[M++]=R.nz,(b&63)===63&&await A.yield()}await A.yield()}await A.yield();const m=new Uint32Array(c*s*6);f=0;for(let S=0;S<s;S++){for(let h=0;h<c;h++){const b=S*(c+1)+h,x=b+1,k=b+c+1,B=k+1;r[b*3+1]<-6.5&&r[B*3+1]<-6.5&&r[x*3+1]<-6.5&&r[k*3+1]<-6.5||(m[f++]=b,m[f++]=k,m[f++]=x,m[f++]=x,m[f++]=k,m[f++]=B)}(S&31)===31&&await A.yield()}await A.yield();const d=new l.BufferGeometry;d.setAttribute("position",new l.BufferAttribute(r,3)),d.setAttribute("aT",new l.BufferAttribute(i,4)),d.setIndex(new l.BufferAttribute(m.subarray(0,f),1));const o=new Float32Array((c+1)*(s+1)*3),p=2*860/c,v=2*710/s,g=c+1;for(let S=0;S<=s;S++){const h=Math.max(0,S-1),b=Math.min(s,S+1);for(let x=0;x<=c;x++){const k=Math.max(0,x-1),B=Math.min(c,x+1),P=-(r[(S*g+B)*3+1]-r[(S*g+k)*3+1])/p*(2/(B-k)),L=-(r[(b*g+x)*3+1]-r[(h*g+x)*3+1])/v*(2/(b-h)),$=1/Math.hypot(P,1,L),D=(S*g+x)*3;o[D]=P*$,o[D+1]=$,o[D+2]=L*$}(S&15)===15&&await A.yield()}d.setAttribute("normal",new l.BufferAttribute(o,3)),d.boundingSphere=new l.Sphere(new l.Vector3(0/2,110,150/2),Math.hypot(860,260,710)/2),await A.yield();const z=new l.Mesh(d,Ye({FLATN:"",NOFF:"0.5"}));z.name="cliff",I.add(z)}await A.yield();const Q0=[];function N(e,t,u,n=!1){let a=e.index?e.toNonIndexed():e;u&&a.applyMatrix4(u),n&&a.computeVertexNormals();for(const r of Object.keys(a.attributes))r!=="position"&&r!=="normal"&&a.deleteAttribute(r);const c=a.attributes.position.count,s=new Float32Array(c*3);for(let r=0;r<c;r++)s[r*3]=t.r,s[r*3+1]=t.g,s[r*3+2]=t.b;a.setAttribute("color",new l.BufferAttribute(s,3)),Q0.push(a)}const y=(e,t,u,n,a,c,s,r=0,i=0,f=0)=>N(new l.BoxGeometry(e,t,u),n,G(a,c,s,r,1,1,1,i,f)),l0=(e,t,u,n,a,c,s,r,i=!1,f=0)=>N(new l.CylinderGeometry(e,t,u,n,1),a,G(c,s,r,f),i),Ct=[],$e=[],ie=[],St=[],Qe=[],ge=(e,t,u,n,a,c,s)=>Ct.push({m:G(e,t,u,n,a,c,1),c:s}),Z0=(e,t,u,n,a)=>$e.push({m:G(e,t,u,w()*6.28,n,n,n,w.range(-.4,.4),w.range(-.4,.4)),c:a}),z0=(e,t,u,n,a,c,s)=>St.push({m:G(e,t,u,w()*6.28,n,a,c),c:s}),Pe=(e,t,u,n,a,c=!1)=>{const s=Math.cos(n),r=Math.sin(n);y(.24,c?.2:.3,.55,a,e,t+(c?.1:.15),u,n),c||y(.2,.42,.2,a,e+r*.2,t+.3,u+s*.2,n),y(.22,.2,.2,a,e+r*.3,t+(c?.14:.6),u+s*.3,n);for(const i of[-1,1])N(new l.ConeGeometry(.05,.12,3),a,G(e+r*.3+s*i*.07,t+(c?.3:.76),u+s*.3-r*i*.07));ge(e-r*.3,t+.5,u-s*.3,n+1.57,.07,.42,a)},e0=new l.Vector3(F-8.3,A0-3.1+4.4,61);{const e=A0-3.1,t=O.pick([Ae,T(H,j,.5,.86)]),u=T(C,u0,.3,.86),n=70,a=106,c=(n+a)/2,s=a-n,r=T(C,j,.42,1),i=T(j,H,.35,.8),f=T(t,h0,.35,.8),M=T(u0,K,.25,.8),m=T(u0,h0,.3,.6);y(30,1.2,68,r,F,e-.6,62);for(let h=31;h<96;h+=3.5)y(h<n?17:8.3,.06,.45,i,F,e+.02,h);for(const h of[-1,1])y(.5,.06,66,i,F+h*1.6,e+.02,62);for(let h=0;h<5;h++)y(8.4,1.2,2.04,h%2?Se:r,F,e-.6-(h+1)*.9,97+h*2);y(8.4,.5,.5,W,F,e-4.25,106.4);for(const h of[-1,1]){y(4,34,42,h>0?t:u,F+h*10.5,e-6,49),y(9,40,s,h>0?u:t,F+h*8.7,e-6,c),y(.3,1.1,42,h>0?T(t,h0,.2,.8):m0,F+h*8.4,e+.55,49);for(let b=0;b<5;b++){if(h<0&&b===4)continue;const x=e+5+b%2*4.6,k=33+b*7.2;N(new l.PlaneGeometry(1.5,2.4),M,G(F+h*8.45,x,k,-h*Math.PI/2)),y(.12,.12,1.9,W,F+h*8.42,x-1.3,k)}for(let b=0;b<4;b++)N(new l.PlaneGeometry(1.2,1.7),m,G(F+h*4.12,e+6.3,73+b*8.5+(h>0?4:0),-h*Math.PI/2))}y(26,34,3,u,F,e-6,27),await A.yield();for(const[h,b]of[[n,75.5],[80,85],[89.5,94.5],[99,a]])y(8.4,1,b-h,f,F,e+10.4,(h+b)/2);y(8.4,3.1,1.6,t,F,e+12.45,n+.8),y(8.4,3.1,1.6,u,F,e+12.45,a-.8);for(const h of[n+.35,75.3,80.2,84.8,89.7,94.3,99.2,a-.4])N(new l.TorusGeometry(4.25,.32,5,14,Math.PI),W,G(F,e+5.7,h));N(new l.PlaneGeometry(1.7,2.3),X,G(e0.x-.13,e0.y,e0.z,Math.PI/2)),y(.08,2.3,.85,M,e0.x+.3,e0.y,e0.z-.9,.9),y(.08,2.3,.85,M,e0.x+.02,e0.y,e0.z+1.25,0),y(.12,.12,2,W,e0.x+.04,e0.y-1.25,e0.z);const d=[C,T(H,C,.5),T(K,C,.55),T(u0,C,.5),C,S0.clone().lerp(C,.55)];for(const[h,b,x]of[[39,8.4,8.2],[50,7.6,8.2],[57.2,8.6,8.2],[66,8.2,8.2],[77,8,4],[86,8.7,4],[95,8.1,4],[103.2,7.4,4]]){y(x*2,.06,.06,X,F,e+b,h);for(let k=0;k<Math.round(x*1.3);k++){const B=w()<.45;ge(F-x+.9+k*1.5+w()*.3,e+b,h,0,B?1.5:.8,B?1.7:1,w.pick(d))}}const o=84;N(new l.PlaneGeometry(1.9,3.2),X,G(F+4.12,e+1.6,o,-Math.PI/2)),y(.14,3.5,.18,W,F+4.12,e+1.75,o-1.05),y(.14,3.5,.18,W,F+4.12,e+1.75,o+1.05),y(.14,.2,2.3,W,F+4.12,e+3.4,o);const p=[H,u0,S0.clone().multiplyScalar(.9),K,C];for(let h=0;h<13;h++)ge(F+4.02,e+3.2,o-.87+h*.145,Math.PI/2,.12,2.6,p[h%5]);for(let h=0;h<3;h++)y(1.5-h*.4,.3,2.4,m0,F-3.5+h*.1-(1.5-h*.4)/2+.75,e+.15+h*.3,76.5);Pe(F-3.6,e+.9,76.5,.9,X),N(new l.PlaneGeometry(1.6,2.8),m,G(F-4.12,e+1.4,92,Math.PI/2)),await A.yield();const v=[[.001,0],[.3,0],[.42,.62],[.48,.66],[.48,.78],[.36,.78]].map(h=>new l.Vector2(h[0],h[1])),g=q("#D2362E"),z=q("#E8584A"),S=(h,b,x,k=1)=>{N(new l.LatheGeometry(v,9),O0,G(h,b,x,0,k,k,k),!0);for(let B=0;B<7;B++){const P=w()*6.28,L=w()*.3*k;Z0(h+Math.cos(P)*L,b+(.85+w()*.25)*k,x+Math.sin(P)*L,.95*k,B%2?g0:W0)}for(let B=0;B<6;B++){const P=w()*6.28,L=w()*.42*k;Z0(h+Math.cos(P)*L,b+(1.2+w()*.35)*k,x+Math.sin(P)*L,.6*k,B%3?g:z)}};for(const[h,b,x]of[[-7.6,34,1.2],[7.6,41,1.2],[-7.6,48,1.2],[7.5,63,1.2],[-7.4,66.5,1.1],[-3.55,72,1],[3.55,79.5,1],[-3.55,87,1],[3.55,93.5,1]])S(F+h,e,b,x);for(let h=0;h<3;h++)S(F+8.2,e+3.72+h%2*4.6,33+h*7.2,.5);await A.yield(),l0(.75,.6,.9,10,T(K,C,.35,.85),F+6.2,e+.45,54),y(.22,2.2,.22,T(H,h0,.35,.5),F+6.2,e+1.9,54),z0(F+6.2,e+3.7,54,1.7,1.35,1.7,g0),z0(F+5.6,e+4.3,54.6,1.1,.9,1.1,W0);for(let h=0;h<12;h++){const b=w()*6.28,x=w.range(.9,1.6);ie.push([F+6.2+Math.cos(b)*x,e+3+w()*1.6,54+Math.sin(b)*x,1])}{const h=A.core.makeRng(A.seed+":lc-alley");z0(F+5.3,e+4.6,53.2,1.5,1,1.5,W0),z0(F+4.4,e+4.2,52.4,1,.7,1,g0);for(let x=0;x<22;x++){const k=h()*6.28,B=.5+h()*1.5;ie.push([F+5.5+Math.cos(k)*B,e+3.3+h()*1.3,53.3+Math.sin(k)*B,1])}const b=(x,k,B,P,L,$,D,x0)=>{const F0=Math.floor(L/3.4);for(let b0=0;b0<D;b0++)for(let E0=0;E0<F0;E0++){if(h()<.14)continue;const f0=(E0+.5)/F0*L;N(new l.PlaneGeometry(1.25,1.9),b0%2?m:M,G(x+B*f0,$-2.7-b0*3.7,k+P*f0,x0))}};for(const x of[-1,1])b(F+x*13.26,n,0,1,s,e+14,5,x*Math.PI/2),b(F+x*12.56,28,0,1,42,e+11,4,x*Math.PI/2),b(F+x*8.7-4.5,a+.06,1,0,9,e+14,5,0),y(9.5,.45,s+.5,W,F+x*8.7,e+14.1,c),y(4.5,.4,42.4,W,F+x*10.5,e+11.2,49),Qe.push({m:G(F+x*8.7,e+14.3,c,Math.PI/2,s+.2,2.6,9.2),c:x>0?O0:T(H,j,.4,.8),r:[.3+x*.1,s+.2,2.6,9.2]});await A.yield();for(let x=0;x<7;x++)y(2.6,.07,.46,x%2?C:S0.clone().multiplyScalar(.95),e0.x+.85,e0.y+2,e0.z-1.38+x*.46,0,0,-.95)}for(let h=0;h<70;h++){const b=w()*w()*9;Z0(F-8.3+w()*.35,e+11.2-b,w.range(40,54)+b*.25,w.range(1.5,2.2),w()<.25?oe:$0)}}await A.yield();const we=8,Je=54,ye=(_-t0)/Je,qe=(d0-U)/Je,so=Math.atan2(_-t0,d0-U);{const e=new l.Shape;e.moveTo(U-1,t0-3),e.lineTo(d0+2,t0-3),e.lineTo(d0+2,t0-.2),e.lineTo(U-1,_-.25),e.lineTo(U-1,t0-3),N(new l.ExtrudeGeometry(e,{depth:9.6,bevelEnabled:!1}),m0,G(4.8,0,0,-Math.PI/2),!0);const t=[T(K,C,.25,.8),W,T(u0,C,.2,.82),W,S0.clone().multiplyScalar(.9),W];for(let s=0;s<Je;s++){const r=_-(s+1)*ye,i=U+s*qe;y(we,ye+.2,qe+.04,s%18===17?m0:Se,0,r-(ye+.2)/2,i+qe/2),N(new l.PlaneGeometry(we,ye*.8),s%3===0?t[s/3%6|0]:W,G(0,r-ye*.5,i+qe+.03,0))}const u=10,n=(d0-U)/u;for(let s=0;s<u;s++){const r=U+(s+.5)*n,i=v0(U+s*n)+1,f=v0(r)+5.9;for(const M of[-1,1]){const m=M*(we/2+.4);y(.76,6.5,n+.02,s%2?W:T(C,j,.2,.86),m,i-3.25,r),y(1,.18,n+.12,m0,m,i+.05,r),l0(.19,.26,f-i-.2,8,W,m,(f+i)/2,r),y(.62,.22,.62,W,m,f-.2,r)}y(we+2.6,.26,.3,T(C,j,.3,.8),0,f,r)}const a=Math.hypot(d0-U,_-t0)+1.5;for(const s of[-4.6,-2.3,0,2.3,4.6])y(.16,.18,a,T(C,j,.4,.74),s,v0((U+d0)/2)+6.12,(U+d0)/2,0,so);y(15,.4,35,Se,0,_-.1,78.5),y(.5,1.1,30,W,-7.4,_+.6,79);for(let s=0;s<6;s++)l0(.34,.24,.55,8,O0,-7.4,_+1.4,66+s*5.2),N(new l.IcosahedronGeometry(.5,0),s%2?q("#C8322E"):g0,G(-7.4,_+1.95,66+s*5.2),!0);const c=T(u0,C,.35,.9);y(.3,.5,1.3,c,-5.6,_+.75,88,.3,0,.12),y(.34,.12,.6,X,-5.63,_+1.05,87.8,.3,0,.12),y(.5,.06,.06,X,-5.5,_+1.35,88.55,.3);for(const s of[-.5,.5])N(new l.CylinderGeometry(.26,.26,.1,10),X,G(-5.6+s*.3,_+.36,88+s,.3,1,1,1,0,Math.PI/2));Pe(-7.4,_+1.15,74,.2,T(j,H,.4,.7)),Pe(4.9,v0(U+9.2)+1.1,U+9,2.8,W,!0)}await A.yield();const V=2.2,Ge=[];{y(150,5,5,m0,0,t0-2.45,150.5),y(150,.3,5.4,W,0,t0+.12,150.5);for(let d=-6;d<=6;d++)d&&l0(.22,.28,.6,8,X,d*11,t0+.55,152);const e=T(K,C,.2,.85);y(1.3,.5,3.6,e,14,t0+.5,146.5,.4),y(1,.1,3.2,C.clone().multiplyScalar(.85),14,t0+.72,146.5,.4);for(const d of[-.25,.25])y(.08,.06,3,j,14+d,t0+.82,146.5,.4+d*.3);y(118,6,6,m0,-99,V-3,290),y(118,.25,4.4,W,-99,V+.1,290);for(let d=0;d<9;d++){const o=d/9*Math.PI/2,p=(d+1)/9*Math.PI/2,v=(o+p)/2;y(6,6,7.4,m0,-40+Math.sin(v)*40,V-3,330-Math.cos(v)*40,Math.PI/2-v),y(4.4,.25,7.2,W,-40+Math.sin(v)*40,V+.1,330-Math.cos(v)*40,Math.PI/2-v)}y(6,6,Q-330,m0,0,V-3,(330+Q)/2),y(4.4,.25,Q-330,W,0,V+.1,(330+Q)/2);for(let d=0;d<70;d++){const o=w(),p=o>.5,v=p?Z(332,Q-10,w()):293.6+w()*1.5,g=p?w.sign()*(3.6+w()*1.2):Z(-150,-45,w()),z=w.range(1.2,2.4);y(z,z,z,T(m0,d%3?C:h0,.25,.92),g,.2+w()*.5,v,w()*3,w(),w())}N(new l.CylinderGeometry(16,17,6,28),m0,G(0,V-3,Q-2)),N(new l.CylinderGeometry(15.1,15.1,.3,28),W,G(0,V+.1,Q-2));const t=C.clone().multiplyScalar(.97),u=Math.min(.7,Math.max(.3,T0.y>.6?T0.z/T0.y+.14:.3)),n=20,a=12.5,c=(d,o)=>{const p=d.attributes.position;for(let v=0;v<p.count;v++)(o||p.getZ(v)<.01)&&p.setZ(v,p.getZ(v)-u*(n-p.getY(v)));return d},s=(d,o,p,v)=>{const g=new l.Shape;g.moveTo(-d,0),g.lineTo(d,0),g.lineTo(d,o),g.absarc(0,o,d,0,Math.PI,!1),g.lineTo(-d,0);const z=new l.Path;return z.moveTo(-p,0),z.lineTo(-p,v),z.absarc(0,v,p,Math.PI,0,!0),z.lineTo(p,0),z.lineTo(-p,0),g.holes.push(z),g};N(c(new l.ExtrudeGeometry(s(a,n-a,7.6,6.8),{depth:3.4,bevelEnabled:!1,curveSegments:20})),t,G(0,V,Q+.9),!0),await A.yield();const r=(d,o,p,v)=>{const g=new l.ExtrudeGeometry(s(d,6.8,o,6.8),{depth:v,bevelEnabled:!1,curveSegments:20});g.translate(0,0,-v-.03),N(c(g,!0),p,G(0,V,Q+.9),!0)};r(10.6,9.5,T(K,h0,.1,.95),.14),r(9.1,8.5,S0.clone().multiplyScalar(.95),.14);for(const d of[-1,1])y(5.6,1.2,4,m0,d*10.1,V+.6,Q+.9-u*n+1.2),y(3.2,4.2,3.4,t,d*13.6,V+2.1,Q+2.6),y(3.6,.3,3.8,T(K,h0,.1,.95),d*13.6,V+4.3,Q+2.6);await A.yield();const i=A.core.makeRng(A.seed+":lc-pier"),f=[H,T(u0,C,.1,.9),T(j,H,.3,.9)];for(let d=334;d<Q-22;d+=11)y(.55,.95,8.6,W,-2.72,V+.6,d+4.3),y(.75,.14,8.8,t,-2.72,V+1.12,d+4.3);for(let d=336;d<Q-16;d+=6)y(4.42,.27,.3,T(m0,h0,.12,.96),0,V+.1,d);for(let d=338;d<Q-18;d+=9)l0(.2,.27,.55,8,X,2.45,V+.5,d),l0(.3,.3,.1,8,X,2.45,V+.8,d);const M=330,m=Math.max(1,Math.round((Q-M)/28));for(let d=0;d<m;d++){const o=M+(d+.5)*(Q-M)/m;l0(.07,.1,3.5,6,X,2.5,V+1.95,o),y(.9,.07,.07,X,2.1,V+3.7,o),y(.34,.42,.34,C,1.7,V+3.45,o),y(.44,.08,.44,X,1.7,V+3.7,o)}for(let d=0;d<9;d++){const o=337+d*5.6+i()*2,p=(d%3===1?1.5:-1.55)+i()*.4,v=d%3;if(v===0){const g=f[i()*3|0];N(new l.TorusGeometry(.62,.2,5,10),g,G(p,V+.42,o,0,1,1,1,Math.PI/2),!0),N(new l.TorusGeometry(.42,.17,5,9),g,G(p+.1,V+.72,o,0,1,1,1,Math.PI/2),!0);for(let z=0;z<3;z++)N(new l.IcosahedronGeometry(.17,0),z%2?C:q("#D2362E"),G(p+.8+z*.3,V+.4,o+i()*.6))}else if(v===1)for(let g=0;g<3;g++){const z=p+(g===2?.25:g*.95-.2),S=V+.52+(g===2?.56:0);y(.85,.5,.6,T(j,H,.2,.8),z,S,o,.2*g),y(.87,.1,.62,X,z,S,o,.2*g)}else l0(.36,.3,.7,8,T(K,C,.2,.85),p,V+.6,o),N(new l.IcosahedronGeometry(.3,0),q("#D2362E"),G(p+.6,V+.55,o+.3),!0)}for(let d=338;d<Q-18;d+=9){const o=i()<.5,p=i(),v=i(),g=i(),z=i(),S=i(),h=i();o&&Ge.push({x:5+v*.4,z:d,a:(z<.5?0:Math.PI)+(S-.5)*.16,s:.7+g*.1,k:p,r:[h,0,0,0]})}}await A.yield();const et=Math.atan2(y0[1]-w0[1],zt),j0=Math.atan2(y0[0]-w0[0],y0[2]-w0[2]),At=Math.hypot(zt,y0[1]-w0[1]),le=(e,t=0,u=new l.Vector3)=>u.set(Z(w0[0],y0[0],e)+Math.cos(j0)*t,Z(w0[1],y0[1],e),Z(w0[2],y0[2],e)-Math.sin(j0)*t);{const e=le(.5);y(6.4,.8,At+6,m0,e.x,e.y-.5,e.z,j0,-et);for(const u of[-2,-.9,.9,2]){const n=le(.5,u);y(.2,.25,At,X,n.x,n.y+.02,n.z,j0,-et)}for(let u=0;u<66;u++){const n=le((u+.5)/66);y(5.6,.16,.6,T(C,j,.5,.6),n.x,n.y-.06,n.z,j0,-et)}for(const[u,n]of[[-.035,Ae],[1.035,W]]){const a=le(u);y(11,8,9,n,a.x,a.y+2.5,a.z,j0),y(11.6,.5,9.6,O0,a.x,a.y+6.7,a.z,j0)}const t=T(C,h0,.22,.8);for(let u=0;u<J.length-1;u++){const n=J[u],a=J[u+1],c=Math.hypot(a[0]-n[0],a[2]-n[2]);y(5.6,.5,Math.hypot(c,a[1]-n[1])+2,t,(n[0]+a[0])/2,(n[1]+a[1])/2-.2,(n[2]+a[2])/2,Math.atan2(a[0]-n[0],a[2]-n[2]),-Math.atan2(a[1]-n[1],c)),l0(4.6,4.6,.5,14,t,a[0],a[1]-.2,a[2]);for(let s=1;s<6;s++){const r=s/6;y(.5,.7,.5,W,Z(n[0],a[0],r)-3,Z(n[1],a[1],r)+.3,Z(n[2],a[2],r))}}}const G0=[],tt=new Map,kt=[];{const e=[W,W,T(C,j,.3,.84),T(C,j,.6,.82),Ae,Ae,T(H,j,.35,.8),O0,C.clone().multiplyScalar(.94),T(C,u0,.18,.86)],t=w.fork("houses"),u=10.4,n=(o,p,v,g)=>Ke(o,p,v[0],v[2],g[0],g[2])[0],a=(o,p,v)=>{const g=Math.floor((o+600)/12),z=Math.floor((p+600)/12);for(let S=-2;S<=2;S++)for(let h=-2;h<=2;h++){const b=tt.get((g+S)*4096+z+h);if(b){for(let x=0;x<b.length;x++)if(v(b[x]))return!0}}return!1},c=(o,p)=>{let v=o0(o,p),g=t.range(6.5,10.5),z=t.range(6.5,9.5);const S=t(),h=t.range(-1,1),b=t.int(0,3);let x=t.range(5.2,10.5)+(t.chance(.12)?4:0);const k=t.pick(e),B=t(),P=B*17.31%1<.15;x=4+9.5*Math.pow(Math.min(1,(x-5.2)/7),1.25),P&&(g=13.5+B*91.7%1*4.5,z=Math.max(z,8),x=Math.min(x,5.5+B*53.3%1*3));let L=!1,$=0;const D=R.mask>0&&R.nx>0&&v<190;if(R.mask>0&&v<190){const a0=(R.nx>0?3.2:R.nx===0?1.25:.85)/Ee,Te=(R.q-(Math.floor(R.q)+.1+z*.5*a0))/a0;$=Math.atan2(R.nx,R.nz),o+=R.nx*Te,p+=R.nz*Te,v=o0(o,p),L=R.mask>0}if(v<2.6||S>(v>196?.12:1)*(.75+.25*Math.min(Y0,1.1))*(.8+.3*R0.n2(o*.012+40,p*.012))||Math.abs(o)<40&&p>-34&&p<62||Math.abs(o)<15&&p>=62&&p<156||Math.abs(o-F)<21&&p>20&&p<114||n(o,p,w0,y0)<12)return D;for(let a0=0;a0<J.length-1;a0++)if(n(o,p,J[a0],J[a0+1])<10)return D;if(L?a(o,p,a0=>D?Math.abs(a0.x-o)<1.6&&Math.abs(a0.z-p)<Math.max(9.6,(a0.w+g)*.5+.8):Math.abs(a0.x-o)+Math.abs(a0.z-p)<Math.max(8.5,(a0.w+g)*.5+.6)):P&&a(o,p,a0=>Math.abs(a0.x-o)+Math.abs(a0.z-p)<(a0.w+g)*.5+1))return D;let x0;if(L)x0=$+h*.05;else{const Te=o0(o+3,p)-o0(o-3,p),Kt=o0(o,p+3)-o0(o,p-3);x0=Math.hypot(Te,Kt)>1.2?Math.atan2(-Te,-Kt)+h*.12:b*Math.PI/2+h*.2}const F0=Math.sin(x0),b0=Math.cos(x0),E0=Math.min(v,o0(o+F0*z*.5,p+b0*z*.5),o0(o+F0*z*.5+b0*g*.4,p+b0*z*.5-F0*g*.4),o0(o+F0*z*.5-b0*g*.4,p+b0*z*.5+F0*g*.4));if(E0<1.5)return D;const f0=E0-1.5,Ne=(D&&L?E0+1.5:v)+x,he=Math.min(Ne-f0,2.2*Math.max(g,z)),Ve=f0+he;if(!(D&&L)&&Ve<v+3.2||q0(o,Ve-2,p)<13+Math.max(g,z)*.6)return D;const ut={x:o,z:p,ry:x0,w:g,d:z,top:Ve,base:Ve-he,hgt:he,col:k,r:B,wall:D&&L,pal:P,gy:v};G0.push(ut);const Zt=Math.floor((o+600)/12)*4096+Math.floor((p+600)/12),jt=tt.get(Zt);return jt?jt.push(ut):tt.set(Zt,[ut]),D};for(let o=-262;o<300;o+=u){for(let p=-410;p<410;p+=u){const v=p+t.range(1.5,u-1.5),g=o+t.range(1.5,u-1.5);c(v,g)&&(c(v-3.75,g+t.range(-3,3)),c(v-7.5,g+t.range(-3,3))),await A.yield()}await A.yield()}const s=A.core.makeRng(A.seed+":lc-roofs"),r=[O0,T(H,j,.3,.78),T(O0,h0,.12,.95),T(H,j,.5,.8)],i=[T(K,C,.08,.9),O0,C.clone().multiplyScalar(.95),T(u0,C,.15,.85)];let f=0,M=0;for(const o of G0){f++%200===199&&await A.yield(),o.pd=q0(o.x,o.top,o.z);const p=s(),v=s(),g=s(),z=Math.cos(o.ry),S=Math.sin(o.ry);if(p<(o.pal?.6:.3)){const h=.9+.2*Math.min(o.w,o.d)*(.7+.6*v);q0(o.x,o.top+h,o.z)>12&&(o.roof=1,Qe.push({m:G(o.x,o.top,o.z,o.ry,o.w+.8,h,o.d+.8),c:r[g*4|0],r:[o.r,o.w+.8,h,o.d+.8]}))}else if(p<.5&&!o.pal&&o.w>7.2&&q0(o.x,o.top+4.3,o.z)>14){const h=o.w*(.5+.3*v),b=o.d*.55,x=(o.w-h)*.5*(g<.33?-1:g<.66?0:1),k=-(o.d-b)*.5;o.deck=1,kt.push({x:o.x+z*x+S*k,z:o.z-S*x+z*k,ry:o.ry,w:h,d:b,base:o.top,hgt:4.3,col:v<.5?o.col:e[g*e.length|0],r:v})}else if(p>.972&&!o.wall&&M<40&&o.pd>20&&o.pd<330){const h=Math.min(o.w,o.d)*.36;M++,o.roof=1,l0(h,h,1,10,o.col,o.x,o.top+.5,o.z,!0),N(new l.SphereGeometry(h,10,4,0,Math.PI*2,0,Math.PI/2),i[v*4|0],G(o.x,o.top+1,o.z),!0),l0(.25,.25,.9,5,C,o.x,o.top+1.2+h,o.z)}}await A.yield();const m=w.fork("roofs");f=0;for(const o of G0){f++%20===19&&await A.yield();const p=o.wall?1:m();if(p<.52&&(o.roof||o.pd>300))continue;const v=Math.cos(o.ry),g=Math.sin(o.ry),z=o.deck?o.d*.27:0,S=o.x+g*z,h=o.z+v*z;if(p<.2)l0(.06,.06,2.3,5,X,S,o.top+1.15,h),l0(.1,2.3,.75,8,m.pick([H,C,u0,T(K,C,.3)]),S,o.top+2.4,h,!0);else if(p<.3)o.deck||l0(.9,.9,1.5,9,T(K,C,.6,.85),o.x+1.2,o.top+.75,o.z-1);else if(p<.52){const b=o.w*.38,x=o.deck?z:m.range(-1.5,1.5);for(const P of[-1,1])y(.09,2,.09,X,o.x+v*b*P+g*x,o.top+1,o.z-g*b*P+v*x);y(b*2,.07,.07,X,o.x+g*x,o.top+1.95,o.z+v*x,o.ry);const k=3+(m()*3|0),B=[C.clone().multiplyScalar(.95),C.clone().multiplyScalar(.95),T(H,C,.5),T(K,C,.55),T(u0,C,.5),T(j,C,.3)];for(let P=0;P<k;P++){const L=((P+.5)/k*2-1)*b*.85,$=m()<.4;ge(o.x+v*L+g*x,o.top+1.92,o.z-g*L+v*x,o.ry,$?1.6:.85,$?1.5:.9,m.pick(B))}}else if(p<.62){const b=m()<.6?$0:g0,x=16;for(let k=0;k<x;k++){const B=m.range(-.45,.45)*o.w,P=m()*m()*5.5;$e.push({m:G(o.x+g*(o.d*.5+.2)+v*B,o.top+.3-P,o.z+v*(o.d*.5+.2)-g*B,m()*6.28,1.9,1.9,1.9,m.range(-.4,.4),m.range(-.4,.4)),c:m()<.25?oe:b})}}else p<.7&&z0(o.x+o.w*.6,o.top-1,o.z+1,1.3,5.2,1.3,Ze)}await A.yield();{const o=[C.clone().multiplyScalar(.95),C.clone().multiplyScalar(.95),T(H,C,.5),T(K,C,.55),T(u0,C,.45),S0.clone().lerp(C,.6),q("#D2362E")];let p=0;for(let v=0;v<G0.length&&p<70;v++){const g=G0[v];(v&15)===15&&await A.yield(),!(g.wall||g.pd>150||g.strung)&&a(g.x,g.z,z=>{if(z===g||z.wall||z.strung||g.strung)return!1;const S=z.x-g.x,h=z.z-g.z,b=Math.hypot(S,h),x=Math.min(g.w,g.d)*.5,k=Math.min(z.w,z.d)*.5,B=b-x-k;if(B<3.2||B>9.5)return!1;const P=Math.min(g.top,z.top)-1.1,L=(x+B*.5)/b,$=g.x+S*L,D=g.z+h*L;if(P<Math.max(g.gy,z.gy)+4.2||P<o0($,D)+4.5||q0($,P,D)<9||a($,D,f0=>f0!==g&&f0!==z&&Math.abs(f0.x-$)+Math.abs(f0.z-D)<Math.max(f0.w,f0.d)*.75+1&&f0.top>P-2))return!1;const x0=Math.atan2(-h,S),F0=S/b,b0=h/b,E0=Math.max(2,Math.round(B/1.45));y(B+.6,.08,.08,X,$,P+.04,D,x0);for(let f0=0;f0<E0;f0++){const Ne=((f0+.5)/E0-.5)*B*.92,he=s()<.45;ge($+F0*Ne,P,D+b0*Ne,x0,he?1.5:.85,he?1.7:1,o[s()*o.length|0])}return g.strung=z.strung=1,p++,!0})}}const d=G0.find(o=>Math.abs(o.x-30)<40&&o.z>100&&o.z<140)||G0[0];if(d){const o=d.x,p=d.z+d.d*.5+3.5,v=o0(o,p);y(3.4,.7,1.5,T(H,C,.1,.85),o,v+.7,p),y(1.9,.55,1.4,C,o-.2,v+1.3,p),Pe(o-.2,v+1.58,p,1.57,T(j,C,.3,.8),!0)}}await A.yield();{const e=w()*50;for(let a=0;a<Math.round(2600*(.7+.3*D0));a++){const c=w.range(-5.4,5.4),s=w.range(U+6.5,d0+1.5);if(R0.n2(c*.22+e,s*.22)+R0.n2(c*.9,s*.9+e)*.35<-.1&&Math.abs(c)<4.9)continue;const r=v0(s)+6.3+w.range(-.1,.45);if(Z0(c,r,s,w.range(.9,1.6),w()<.5?g0:W0),ie.length<820&&w()<.5){const i=w()<.25||Math.abs(c)>4.3;ie.push([c+w.range(-.3,.3),r+(i?w.range(.35,.6):-w.range(.25,.5)),s+w.range(-.3,.3),i?1:0])}}for(let a=0;a<420;a++){const c=w.sign(),s=w.range(U,d0),r=w()*w()*3.2;Z0(c*w.range(4.6,5.5),v0(s)+6.1-r,s,w.range(.8,1.3),w()<.6?g0:W0),a%2&&Z0(c*(we/2+.95+w()*.4),v0(s)+w.range(-2.5,1.2),s,w.range(1.3,2),w()<.2?W0:c>0?$0:oe)}for(let a=0;a<90;a++)Z0(-7.5-w()*.4,_+w.range(-.2,1.3),w.range(62,95),w.range(1.2,1.9),w()<.3?g0:$0);await A.yield();const t=w.fork("veg");for(let a=0,c=0;a<900&&c<70;a++){const s=t.range(-400,400),r=t.range(-260,250),i=o0(s,r);if(i<196||q0(s,i+8,r)<22)continue;const f=t.range(7,12);c++,y(.5,f,.5,T(H,h0,.35,.5),s,i+f/2-.5,r);for(let M=0;M<4;M++){const m=M*1.57+t(),d=M?t.range(1.8,3):0,o=M?t.range(2.4,3.2):4.2;z0(s+Math.cos(m)*d,i+f+t.range(-.3,.4),r+Math.sin(m)*d,o,o*.34,o,M%2?He:T(He,W0,.5))}}for(let a=0,c=0;a<2500&&c<260*Y0;a++){const s=t.range(-400,400),r=t.range(-260,290),i=o0(s,r);if(!(i<4||q0(s,i+3,r)<14||Math.abs(s)<40&&r>-34&&r<100||Math.abs(s-F)<20)&&!(o0(s+2,r+2)-i>2.5||i-o0(s-2,r-2)>2.5))if(c++,i>150){const f=t.range(1.6,2.6);z0(s,i+f*.6,r,f,f*.75,f,t()<.7?_e:T(_e,g0,.5))}else if(t()<.5){const f=t.range(.9,1.4);z0(s,i+f*2.6,r,f,f*3.6,f,Ze)}else{const f=t.range(1.5,2.4);z0(s,i+f*.7,r,f,f*.8,f,t()<.5?g0:He)}}await A.yield();const u=q("#7FA872");for(let a=0,c=0,s=0,r=0;a<2600;a++){const i=t.range(-330,400),f=t.range(-250,130),M=t(),m=o0(i,f);if(R.mask<1||R.nx>0||m>188||m<30)continue;const d=R.q-Math.floor(R.q),o=R.nx,p=R.nz;if(!(q0(i,m+4,f)<15)){if(d>.64&&d<.98&&c<46*Y0&&M<.5){c++;const v=M<.32?$0:g0,g=o===0?3.6:5.4;for(let z=0;z<11;z++){const S=t.range(-3.2,3.2),h=t.range(-.5,.5)*g,b=i-p*S+o*h,x=f+o*S+p*h;Z0(b+o*.3,o0(b,x)+.35,x+p*.3,t.range(1.9,2.7),t()<.25?oe:v)}}else if(d>.46&&d<.6&&s<60*Y0){s++;const v=t.range(.9,1.3);z0(i,m+v*2.5,f,v,v*3.5,v,Ze)}else if(d<.1&&r<44){r++;for(let v=0;v<2;v++)z0(i+t.range(-.7,.7),m+.7+v*.5,f+t.range(-.7,.7),.7,.95,.2,v?T(u,g0,.3):u)}}}await A.yield();const n=T(H,h0,.35,.5);for(let a=-41.6;a<=42;a+=5.2)for(let c=63;c<=140;c+=5.2){const s=a+t.range(-.8,.8),r=c+t.range(-.8,.8);if(Math.abs(s)<9.6)continue;const i=o0(s,r);if(i<2.8||q0(s,i+3,r)<8.5||G0.some(M=>Math.abs(M.x-s)<M.w*.5+3&&Math.abs(M.z-r)<M.d*.5+3))continue;const f=t.range(1.3,1.8);z0(s,i+f*1,r,f,f*.85,f,t()<.5?g0:W0),y(.25,1.4,.25,n,s,i+.5,r);for(let M=0;M<4;M++){const m=t()*6.28,d=f*t.range(.3,.8);ie.push([s+Math.cos(m)*d,i+f*1+f*.85*Math.sqrt(Math.max(.05,1-d/f*(d/f)))+.1,r+Math.sin(m)*d,1])}}}await A.yield();const J0=Ye({PROPS:""},{vertexColors:!0}),Ft=new l.Mesh(Ut(Q0,!1),J0);Ft.name="town-props",await A.yield();for(const e of Q0)e.dispose();Q0.length=0,I.add(Ft);function C0(e,t,u,n={}){const a=t.length,c=new l.InstancedMesh(e,Ye({INST:"",...u},n),Math.max(a,1)),s=new Float32Array(Math.max(a,1)*3),r=new Float32Array(Math.max(a,1)*4);return t.forEach((i,f)=>{c.setMatrixAt(f,i.m);const M=i.flatCol?1:.9+w()*.18;s[f*3]=i.c.r*M,s[f*3+1]=i.c.g*M,s[f*3+2]=i.c.b*M;const m=i.r||[w(),0,0,0];r[f*4]=m[0],r[f*4+1]=m[1],r[f*4+2]=m[2],r[f*4+3]=m[3]}),c.count=a,e.setAttribute("aCol",new l.InstancedBufferAttribute(s,3)),e.setAttribute("aRnd",new l.InstancedBufferAttribute(r,4)),c.frustumCulled=!1,I.add(c),c}{const e=new l.BoxGeometry(1,1,1);e.translate(0,.5,0),e.deleteAttribute("uv"),C0(e,G0.concat(kt).map(o=>({m:G(o.x,o.base,o.z,o.ry,o.w,o.hgt,o.d),c:o.col,r:[o.r,o.w,o.hgt,o.d]})),{HOUSE:""}).name="houses";const t=new l.BufferGeometry;t.setAttribute("position",new l.Float32BufferAttribute([-.5,0,.5,.5,0,.5,.22,1,0,-.5,0,.5,.22,1,0,-.22,1,0,.5,0,-.5,-.5,0,-.5,-.22,1,0,.5,0,-.5,-.22,1,0,.22,1,0,.5,0,.5,.5,0,-.5,.22,1,0,-.5,0,-.5,-.5,0,.5,-.22,1,0],3)),t.computeVertexNormals(),C0(t,Qe,{HOUSE:"",ROOFT:""}).name="roofs",await A.yield();const u=new l.IcosahedronGeometry(1,1);u.deleteAttribute("uv"),u.computeVertexNormals(),C0(u,St,{BLOB:"",LIT_EDGE:"0.12"}).name="trees";const n=[];for(let o=0;o<6;o++){const p=o/6*Math.PI*2+w()*.6,v=w.range(-.5,.25),g=w.range(.5,.75),z=g*.34,S=new l.Vector3(Math.cos(p),v,Math.sin(p)).normalize(),h=new l.Vector3(-Math.sin(p),w.range(-.3,.3),Math.cos(p)).normalize(),b=S.clone().multiplyScalar(.08),x=S.clone().multiplyScalar(g*.45),k=S.clone().multiplyScalar(g),B=x.clone().addScaledVector(h,z),P=x.clone().addScaledVector(h,-z);n.push(b.x,b.y,b.z,B.x,B.y,B.z,k.x,k.y,k.z,b.x,b.y,b.z,k.x,k.y,k.z,P.x,P.y,P.z)}const a=new l.BufferGeometry;a.setAttribute("position",new l.Float32BufferAttribute(n,3)),a.computeVertexNormals(),C0(a,$e,{LEAF:"",LIT_EDGE:"0.3",NOFF:"0.4"},{side:l.DoubleSide}).name="leaves";const c=[],s=2.5,r=(o,p,v,g,z,S)=>{S.d=1e9;for(let B=0;B<g+.5;B+=.5){const P=Math.min(B,g),L=Mt(o,p-P,v+P*z);L<S.d&&(S.d=L,S.i=xt.i,S.g=P)}const h=S.i,b=Math.max(0,h-3),x=Math.min(i0.length-3,h+3),k=Math.hypot(i0[x]-i0[b],i0[x+2]-i0[b+2])||1;return S.nx=(i0[x+2]-i0[b+2])/k,S.nz=-(i0[x]-i0[b])/k,S.y=p-S.g-i0[h+1],S.side=(o-i0[h])*S.nx+(v+S.g*z-i0[h+2])*S.nz,S.d},i=(o,p,v,g,z,S,h,b,x,k,B)=>{const P=s+.5,L={};let $=r(o,p,v,k,B,L);for(let D=0;D<4&&$<P;D++){const x0=(Math.sqrt(Math.max(0,P*P-L.y*L.y))-Math.abs(L.side)+(D?.1:x*61.7%1*1.2))*(L.side<0?-1:1);o+=L.nx*x0,v+=L.nz*x0,$=r(o,p,v,k,B,L)}$<P&&(z=0),c.push({m:G(o,p,v,g,z,z,z,S,h),c:b,r:[x,k,B,0]})};for(let o=0;o<Math.round(190*D0);o++){const p=w()<.4,v=p?w.range(31,60):w.range(U,d0),g=p?_+16-(v-30)*16/30:v0(v);i(w.range(-4.6,4.6),g+6,v,w()*6.28,.42,w()*3,w()*3,w()<.7?oe:C,w(),5.6,.45),(o&31)===31&&await A.yield()}for(let o=0;o<150;o++){const p=w.range(34,104),v=w.range(.2,.34);i(F+w.range(-1,1)*(p<70?7.8:3.7),A0+5.5,p,w()*6.28,v,w()*3,w()*3,w()<.45?oe:w()<.5?C:$0,w(),8.4,.25),(o&31)===31&&await A.yield()}C0(a.clone(),c,{PETAL:"",LIT_EDGE:"0.0",NOFF:"0.3"},{side:l.DoubleSide}).name="petals";const f=[[.001,-.37],[.105,-.27],[.14,-.18],[.09,-.06],[.001,0]],M=new l.LatheGeometry(f.map(o=>new l.Vector2(o[0],o[1])),4);M.deleteAttribute("uv");const m=S0.clone().multiplyScalar(.95),d=T(S0,j,.35,.95);C0(M,ie.map(([o,p,v,g])=>{const z=w.range(.85,1.25)*(g?1.25:1),S=g?1.2:.2;return{m:G(o,p,v,w()*6.28,z,z,z,w.range(-S,S),w.range(-S,S)),c:w()<.8?m:d,flatCol:1}}),{LEMON:"",LIT_EDGE:"0.1",NOFF:"0.2"}).name="lemons"}await A.yield();let c0=null;{const e=A.renderer;if(e){c0=new l.WebGLRenderTarget(k0,k0,{depthBuffer:!0,generateMipmaps:!1,minFilter:l.NearestFilter,magFilter:l.NearestFilter}),c0.depthTexture=new l.DepthTexture(k0,k0),c0.depthTexture.minFilter=c0.depthTexture.magFilter=l.NearestFilter;const t=new l.OrthographicCamera(-ve,ve,ve,-ve,250,1400),u=new l.Vector3(-10,60,110);t.position.copy(u).addScaledVector(T0,800),t.up.set(0,Math.abs(T0.y)>.9?0:1,Math.abs(T0.y)>.9?-1:0),t.lookAt(u),t.updateMatrixWorld(!0),t.updateProjectionMatrix(),I.updateMatrixWorld(!0);const n=Y.object.getObjectByName("birds"),a=I.background,c=I.children.filter(f=>f.name!=="petals"),s=I.children.slice(),r=s.map(f=>f.visible),i=n?n.visible:!1;n&&(n.visible=!1),I.background=null,I.overrideMaterial=Y.depthMaterial||new l.MeshBasicMaterial({colorWrite:!1,side:l.DoubleSide});try{await po(e,c0,I,t,I.overrideMaterial,A.frame||A.yield),await A.yield();for(let f=0;f<c.length;f++){for(const M of s)M.visible=M===c[f];for(let M=0;M<6;M++){const m=e.getRenderTarget(),d=e.autoClear,o=Math.round(k0*M/6),p=Math.round(k0*(M+1)/6);try{e.autoClear=!1,f===0&&M===0&&(c0.scissorTest=!1,e.setRenderTarget(c0),e.clear()),c0.scissor.set(0,o,k0,p-o),c0.scissorTest=!0,e.setRenderTarget(c0),e.render(I,t)}finally{c0.scissorTest=!1,c0.scissor.set(0,0,k0,k0),e.setRenderTarget(m),e.autoClear=d}await A.yield()}}}finally{Y.depthMaterial||I.overrideMaterial.dispose(),I.overrideMaterial=null,I.background=a,s.forEach((f,M)=>{f.visible=r[M]}),n&&(n.visible=i)}n0.uShadowMat.value.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1).multiply(t.projectionMatrix).multiply(t.matrixWorldInverse),n0.uShadowMap.value=c0.depthTexture,n0.uUseShadow.value=1}}await A.yield();{const e=new l.PlaneGeometry(1,1,3,3);e.translate(0,-.5,0),e.deleteAttribute("uv"),C0(e,Ct,{CLOTH:"",LIT_EDGE:"0.05",NOFF:"0.3"},{side:l.DoubleSide}).name="laundry"}const no=q(E.deep).multiply(new l.Color(E.tone[0],E.tone[1],E.tone[2])).lerp(ae,E.hazeP[2]),Et={uZen:{value:q(E.zen)},uMid:{value:q(E.mid)},uLow:{value:q(E.low)},uHazeC:{value:ae.clone().lerp(q("#ffffff"),I0?0:.35)},uSun:{value:T0},uSunCol:{value:new l.Vector3(...E.sunCol)},uCloud:{value:q(E.cloud)},uCloudSh:{value:q(E.cloudSh)},uSea:{value:no},uTime:n0.uTime,uGain:{value:1},uStars:{value:I0?1:0},uCloudAz:{value:O.range(-.5,.5)},uClouds:{value:E.clouds},uRes:n0.uRes},Le=new l.Mesh(new l.SphereGeometry(3800,32,16),new l.ShaderMaterial({uniforms:Et,vertexShader:yo,fragmentShader:xo,side:l.BackSide,depthWrite:!1,fog:!1}));Le.renderOrder=-1,Le.frustumCulled=!1,I.add(Le);{const e=(t,u,n,a,c,s)=>{const r=new l.Shape,i=9,f=[];let M=-n/2;r.moveTo(M,-20);for(let d=0;d<i;d++){const o=(d+.5)/i,p=Math.sin(Math.PI*Math.pow(s?1-o:o,.75));f.push(Math.max(.08,p*(.75+O()*.35))*a)}for(let d=0;d<i;d++)r.lineTo(M+n/i*.34,f[d]),M+=n/i,r.lineTo(M,f[d]);r.lineTo(M+n/i*.3,-20),r.lineTo(-n/2,-20);const m=new l.Mesh(new l.ShapeGeometry(r),new l.ShaderMaterial({uniforms:{uCol:{value:T(K,q(E.deep),.4).multiply(new l.Color(E.tone[0],E.tone[1],E.tone[2]))},uHaze:{value:ae},uK:{value:c}},vertexShader:dt,fragmentShader:go,side:l.DoubleSide}));m.position.set(Math.sin(u)*t,0,Math.cos(u)*t),m.rotation.y=u+Math.PI,I.add(m)};e(1900,-.95+O.range(-.1,.1),2300,250,Math.min(.9,E.hazeP[2]*.42),!1),e(1560,-.07,520,78,Math.min(.9,E.hazeP[2]*.3),!0),e(3600,.85+O.range(-.1,.1),4600,420,Math.min(.95,E.hazeP[2]*.8),!0)}const ce=[],Bt=[];{const e=w.fork("boats"),t=[q("#D8362E"),T(K,C,.05),q("#E9B429"),q("#2E9A5E"),C.clone().multiplyScalar(.96),T(u0,C,.1),q("#D8362E"),T(K,C,.05)],u=e.range(-.6,.6);for(let n=0,a=0;n<24&&a<800;a++){const c=n<6,s=n<14,r=c?(n%2?1:-1)*e.range(7.6,11):s?e.sign()*e.range(12,36):e.range(-120,125),i=c?182+n*13+e.range(-3,3):e.range(162,278);if(Math.abs(r)<5.4||r<12&&i>268||bt(r,i)>-5.5||!c&&ce.some(m=>Math.hypot(m.x-r,m.z-i)<12))continue;const f=(c?e.range(-.35,.35):u+e.range(-.5,.5))+(e.chance(.5)?Math.PI:0),M=c?e.range(1.05,1.35):e.range(1.25,1.9);ce.push({x:r,z:i,a:f,s:M,c:t[n%t.length]}),n++}for(const n of Ge)n.c=t[n.k*t.length|0];for(let n=0;n<pt;n++){const a=n<24?ce[n]:Ge[n-24];Bt.push(a?new l.Vector4(a.x,a.z,a.a,a.s):new l.Vector4(0,-9999,0,.01))}}const Pt={uBoats:{value:Bt},uSun:{value:T0},uSand:{value:q(E.sand)},uRock:{value:T(q(E.sand),q("#3D6E7A"),.3)},uShallow:{value:q(E.shallow)},uDeep:{value:q(E.deep)},uDeep2:{value:q(E.deep2)},uHaze:n0.uHaze,uHazeP:n0.uHazeP,uTone:n0.uTone,uOcto:{value:new l.Vector3(30,200,0)},uTime:n0.uTime,uGlint:{value:E.glint},uGain:n0.uGain,uRes:n0.uRes};{const e=new l.PlaneGeometry(14e3,14e3);e.rotateX(-Math.PI/2);const t=new l.Mesh(e,new l.ShaderMaterial({uniforms:Pt,vertexShader:dt,fragmentShader:Mo}));t.name="sea",t.frustumCulled=!1,I.add(t)}await A.yield();const K0=()=>{const e=Ut(Q0,!1);for(const t of Q0)t.dispose();return Q0.length=0,e},qt=new l.Color(1,1,1);{const e=new l.Shape;e.moveTo(-1.1,-2.6),e.lineTo(1.1,-2.6),e.quadraticCurveTo(1.3,.6,0,3.3),e.quadraticCurveTo(-1.3,.6,-1.1,-2.6);const t=()=>{const i=new l.ExtrudeGeometry(e,{depth:.95,bevelEnabled:!1,curveSegments:6,steps:2});i.rotateX(Math.PI/2),i.translate(0,.6,0);const f=i.attributes.position;for(let M=0;M<f.count;M++){const m=f.getY(M),d=f.getZ(M),o=d/3.3;f.setY(M,m+o*o*(d>0?.62:.3)),m<.2&&(f.setX(M,f.getX(M)*(m<-.2?.5:.84)),f.setZ(M,d*(m<-.2?.84:.95)))}N(i,qt,null,!0)};t();const u=new l.Color(.86,.8,.66),n=new l.Color(.5,.36,.25),a=new l.Color(.93,.91,.84),c=new l.Color(.16,.24,.36);y(1.7,.06,4.2,u,0,.66,-.2),y(1.9,.1,.3,n,0,.74,.7),y(1.3,.1,.3,n,0,.92,2),y(1.15,.95,1.2,a,0,1.15,-1.5),y(1.19,.3,1.24,c,0,1.3,-1.5),y(1.4,.08,1.5,qt,0,1.66,-1.5);for(const[i,f]of[[-.78,-.6],[.78,-.6],[-.78,1.1],[.78,1.1]])y(.06,1,.06,n,i,1.2,f);for(let i=0;i<5;i++)y(.34,.06,1.9,i%2?a:new l.Color(.86,.36,.26),-.68+i*.34,1.72+(i===2?.03:0),.25);l0(.045,.06,1.7,5,n,0,1.9,2.3);{const i=new l.BufferGeometry;i.setAttribute("position",new l.Float32BufferAttribute([0,2.75,2.3,0,2.4,2.3,0,2.58,1.6,0,2.4,2.3,0,2.75,2.3,0,2.58,1.6],3)),i.computeVertexNormals(),N(i,new l.Color(.9,.3,.22))}const s=K0();C0(s,ce.concat(Ge).map(i=>({m:G(i.x,0,i.z,i.a,i.s,i.s,i.s),c:i.c,flatCol:1,r:i.r})),{BOAT:""},{vertexColors:!0}).name="boats";const r=[];if(mt){t();const i=new l.BufferGeometry;i.setAttribute("position",new l.Float32BufferAttribute([0,.7,-1.4,0,.7,2,0,7.5,-1,0,.7,2,0,.7,-1.4,0,7.5,-1,0,.9,2.2,0,.9,3.4,0,5.2,2.2,0,.9,3.4,0,.9,2.2,0,5.2,2.2],3)),i.computeVertexNormals(),N(i,new l.Color(.96,.95,.9));const f=O.range(1.2,1.9)*O.sign();for(let M=0;M<16;M++)r.push({m:G(O.range(-500,500),0,O.range(560,900),f+O.range(-.08,.08),2.2,2.2,2.2),c:C,flatCol:1,r:[O(),640,O.range(1.2,1.7),0]});C0(K0(),r,{BOAT:"",MOVER:""},{vertexColors:!0}).name="regatta"}if(p0==="morning"){const i=[];for(let f=0;f<8;f++)i.push({m:G(O.range(60,150),0,640,O.range(-.1,.35),1.5,1.5,1.5),c:ce[f%ce.length]?.c||H,flatCol:1,r:[f/8+O()*.08,500,O.range(2.6,3.6),0]});C0(s.clone(),i,{BOAT:"",MOVER:""},{vertexColors:!0}).name="fishing-fleet"}}let U0=null,ot=null;const fe=[150,2360],xe=1650;if(!mt){const e=C.clone().multiplyScalar(.97);y(9,3.4,38,e,0,1.2,0),y(9.1,.7,38.1,T(K,C,.1,.8),0,.5,0),y(7.4,2.4,26,e,0,4.1,-2),y(6,2.2,7,e,0,6.4,5),y(7.5,.5,26.2,T(K,h0,.3,.6),0,4.3,-2),l0(1.2,1.4,3.4,10,H,0,7.2,-6),U0=new l.Mesh(K0(),J0),U0.name="ferry",U0.scale.setScalar(2.1),U0.frustumCulled=!1,I.add(U0);const t=[],u=[],n=-Math.PI/2-1.3,a=90;for(let r=0;r<=a;r++){const i=n+r/a*1.9;for(const f of[xe-150,xe+150])t.push(fe[0]+Math.cos(i)*f,.1,fe[1]+Math.sin(i)*f);if(r<a){const f=r*2;u.push(f,f+1,f+2,f+1,f+3,f+2)}}const c=new l.BufferGeometry;c.setAttribute("position",new l.Float32BufferAttribute(t,3)),c.setIndex(u),ot={uAng:{value:0},uR:{value:xe},uCenter:{value:new l.Vector2(fe[0],fe[1])},uCol:{value:T(C,q(E.deep),E.hazeP[2]*.35).multiply(new l.Color(E.tone[0],E.tone[1],E.tone[2]))}};const s=new l.Mesh(c,new l.ShaderMaterial({uniforms:ot,vertexShader:dt,fragmentShader:wo,side:l.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-8}));s.frustumCulled=!1,s.renderOrder=1,I.add(s)}const Me={uTime:n0.uTime,uCamZ:{value:-1e4},uAll:{value:Ce?1:0},uComp:{value:0},uLead:{value:new l.Vector3},uLeadF:{value:new l.Vector3(0,0,1)},uTone:n0.uTone};{const e=new l.InstancedBufferGeometry;e.setAttribute("position",new l.Float32BufferAttribute([0,0,.28,.85,0,-.22,.05,0,-.12,0,0,.28,-.05,0,-.12,-.85,0,-.22,0,0,.5,.1,0,-.1,-.1,0,-.1,.1,0,-.1,0,0,-.55,-.1,0,-.1,0,.02,.42,0,.2,.05,0,.02,-.4],3));const t=[],u=[],n=[],a=w.fork("birds"),c=T(h0,K,.1,.55),s=C.clone().multiplyScalar(.98),r=Math.round(46*Y0*D0);for(let m=0;m<r;m++)t.push(a.sign()*a.range(5,14),a.range(-3,5),a.range(0,30),1),u.push(0,a()*6.28,1,a()),n.push(c.r,c.g,c.b,.75);for(let m=0;m<Math.round(70*D0);m++)t.push(a.range(-25,25),11.5,215+a.range(-20,20),0),u.push(a.range(18,85),a()*6.28,a.range(.25,.5)*(a()<.8?1:-1),a()),n.push(c.r,c.g,c.b,.85);for(let m=0;m<Math.round(70*D0);m++)t.push(de+a.range(-10,10),a.range(70,120),ke+a.range(-10,10),0),u.push(a.range(28,80),a()*6.28,a.range(.2,.42)*(a()<.8?1:-1),a()),n.push(c.r,c.g,c.b,1);for(let m=0;m<26;m++)t.push(F+a.range(-3,3),A0+a.range(0,6),128+a.range(-4,4),0),u.push(a.range(7,20),a()*6.28,a.range(.5,.9)*(a()<.8?1:-1),a()),n.push(c.r,c.g,c.b,.9);const i=(m,d,o,p)=>{for(let v=0;v<Math.round(45*D0);v++)t.push(d+m.range(-6,6),o+m.range(-4,8),p+m.range(-6,6),0),u.push(m.range(10,46),m()*6.28,m.range(.35,.7)*(m()<.8?1:-1),m()),n.push(c.r,c.g,c.b,1.1)};for(const[m,d,o]of[[60,46,95],[-52,70,30],[10,82,-62],[112,74,40]])i(a,m,d,o);for(let m=0;m<28;m++){const d=Z(336,Q-8,(m+a())/28);t.push(a.sign()*1.9,V+.22,d,2),u.push(a.range(8,22),a()*6.28,a.sign()*a.range(.8,1.3),a()),n.push(s.r,s.g,s.b,2)}const f=A.core.makeRng(A.seed+":lc-flocks");for(const[m,d,o]of[[-140,105,70],[150,92,60]])i(f,m,d,o);if(Ce)for(let m=0;m<450;m++){const d=f()<.25;t.push(de+f.range(-12,12),f.range(66,140),60+f.range(-12,12),0),u.push(f.range(22,92),f()*6.28,f.range(.16,.4)*(f()<.85?1:-1),f());const o=d?s:f()<.3?T(C,h0,.3,.8):c;n.push(o.r,o.g,o.b,d?2:1.1)}e.setAttribute("aA",new l.InstancedBufferAttribute(new Float32Array(t),4)),e.setAttribute("aB",new l.InstancedBufferAttribute(new Float32Array(u),4)),e.setAttribute("aCol",new l.InstancedBufferAttribute(new Float32Array(n),4)),e.instanceCount=t.length/4;const M=new l.Mesh(e,new l.ShaderMaterial({uniforms:Me,vertexShader:zo,fragmentShader:bo,side:l.DoubleSide}));M.frustumCulled=!1,M.name="swifts-gulls",I.add(M)}const at=[];for(let e=0;e<2;e++){for(let u=-1;u<=1;u++){const n=1.55+u*2.5,a=u*3;y(2.3,2.4,3,T(K,C,.05,.9),0,n,a),y(2.36,.8,2.3,T(C,K,.3,.9),0,n+.35,a),y(2.5,.2,3.2,W,0,n+1.3,a)}const t=new l.Mesh(K0(),J0);t.rotation.y=j0,t.frustumCulled=!1,I.add(t),at.push(t)}for(let e=0;e<3;e++)y(.2,.8,.03,W,Math.sin(e*2.094)*.45,Math.cos(e*2.094)*.45,0,0,0,-e*2.094);l0(.12,.12,.08,8,X,0,0,0);const Re=new l.Mesh(K0(),J0);Re.position.set(e0.x-.06,e0.y+.2,e0.z),Re.name="fan",I.add(Re);const st=new l.Mesh(new l.BoxGeometry(.1,.1,.1),new l.MeshBasicMaterial({color:new l.Color(4,.5,.25),fog:!1}));st.position.set(e0.x+.12,e0.y-1.1,e0.z+.6),I.add(st);const Gt=280*L0,Lt=H0(Z(-3,de,.7)-95*Math.sin(Gt),ke-95*Math.cos(Gt)),ro=Math.PI/2-Math.PI*2*(1.5*Lt+.004*Lt*50);let De=0;const ee=[0];for(let e=0;e<J.length-1;e++)De+=Math.hypot(J[e+1][0]-J[e][0],J[e+1][1]-J[e][1],J[e+1][2]-J[e][2]),ee.push(De);const Rt=(e,t)=>{const u=e*8.5/De%2,n=u<1,a=(n?u:2-u)*De;let c=0;for(;c<J.length-2&&ee[c+1]<a;)c++;const s=(a-ee[c])/(ee[c+1]-ee[c]),r=J[c],i=J[c+1];return t.set(Z(r[0],i[0],s),Z(r[1],i[1],s)+.1,Z(r[2],i[2],s)),t.ry=Math.atan2(i[0]-r[0],i[2]-r[2])+(n?0:Math.PI),t.corner=Math.max(0,1-Math.min(s,1-s)*(ee[c+1]-ee[c])/14),t};{const e=vt?C.clone().multiplyScalar(.97):O.pick([T(u0,C,.25),H,T(K,C,.3)]);y(1.5,1.2,1.9,e,0,1.15,-.5),y(1.3,1,1,e,0,1,1),y(1.2,.5,.06,X,0,1.25,1.52),y(1.56,.12,2,W,0,1.8,-.5);for(const[t,u]of[[-.7,-.9],[.7,-.9],[0,1.2]])N(new l.CylinderGeometry(.32,.32,.18,10),X,G(t,.32,u,0,1,1,1,0,Math.PI/2));if(vt)for(let t=0;t<5;t++)y(.09,.02,2.6+t*.3,t%2?C:H,(t-2)*.3,1.5-t*.03,-2.8-t*.15,(t-2)*.08,.12)}const ze=new l.Mesh(K0(),J0);ze.scale.setScalar(1.5),ze.frustumCulled=!1,I.add(ze);const nt=new l.IcosahedronGeometry(1,1);nt.deleteAttribute("uv"),nt.computeVertexNormals();const Dt=C0(nt,new Array(6).fill(0).map(()=>({m:new l.Matrix4,c:T(C,j,.35,.9),flatCol:1})),{BLOB:"",LIT_EDGE:"0.2"});N(new l.LatheGeometry([[.001,-.37],[.105,-.27],[.14,-.18],[.11,-.085],[.001,0]].map(e=>new l.Vector2(e[0],e[1])),6),S0.clone().multiplyScalar(.95),G(0,.18,0));const Ie=new l.Mesh(K0(),J0);Ie.scale.setScalar(1.5),I.add(Ie);const rt=[];if(Ce)for(const e of[-1,1]){N(new l.LatheGeometry([[1.25,-2.6],[1,-2.4],[.72,-1.6],[.55,-.8],[.1,-.6],[.1,0]].map(u=>new l.Vector2(u[0],u[1])),12),T(j,S0,.3,.95));const t=new l.Mesh(K0(),J0);t.position.set(r0.campanileTop.x,_+r0.campanileTop.y-14.6,r0.campanileTop.z+e*3.9),I.add(t),rt.push(t)}if(I0){const e=[],t=(s,r,i,f,M,m,d,o)=>{for(let p=0;p<=d;p++){const v=p/d;e.push([Z(s,f,v),Z(r,M,v)-o*4*v*(1-v),Z(i,m,v)])}},u=r0.campanileTop.x,n=r0.campanileTop.z,a=_+16;for(const[s,r]of[[-28,29],[-9,29],[9,29],[28,29],[-wt*20,12]])t(u-wt*3.4,a+13,n+2,s,a+4.2,r,16,2.2);t(-72,t0+4.2,151,72,t0+4.2,151,40,0);for(let s=0;s<6;s++)t(-70+s*24,t0+4.2,151,-46+s*24,t0+4.2,151,0,0);for(let s=0;s<10;s++){const r=U+(s+.5)*(d0-U)/10;t(-4.6,v0(r)+5.6,r,4.6,v0(r)+5.6,r,6,.3)}for(let s=300;s<Q;s+=8)for(const r of[-2.6,2.6])e.push([r,V+1.6,s]);const c=new l.InstancedMesh(new l.IcosahedronGeometry(.17,0),new l.MeshBasicMaterial({color:new l.Color(6,4,1.6),fog:!1}),e.length);e.forEach((s,r)=>c.setMatrixAt(r,G(s[0],s[1],s[2]))),c.frustumCulled=!1,I.add(c)}await A.yield();const it=50,ue=M0.length,Oe=r0.domeCenter.clone().add(Y.object.position),It=H0(V0[0]+60,V0[1]),We=60,Ot=30,Wt=Fe-.035,Nt=Fe-.17,lt=Fe+r0.domeRadius/ue,be=lt+We/ue,io=[{at:[40,0,165],from:P0+.002,to:P0+.14,weight:.62},{at:Oe,from:Nt,to:be,fade:(be-lt)/(be-Nt),weight:.7},{at:[r0.piazza.x,_+r0.piazza.y-6,r0.piazza.z],from:Wt,to:be,fade:.3,weight:.3},{at:[-70,10,190],from:lt,to:be+(Ot+We)/ue,fade:We/(2*We+Ot),weight:.5},{at:(e,t)=>M0.posAtDist(Math.min(t,yt)*ue+34,lo).setY(-7),from:re-.012,to:yt,weight:.5},{at:[Oe.x,Oe.y-6,Oe.z],from:It-.02,to:It+.09,weight:.5}],lo=new l.Vector3,ct=new l.Vector3,Vt=new l.Vector3,X0=new l.Vector3,co=new l.Matrix4,ft=new l.Vector2,Ht=E.gain,_t=.0065,fo=A.core.makeRng(A.seed+":lc-ferry").range(0,.9-_t*it);return{scene:I,path:M0,duration:it,title:p0==="evening"?"The Lemon Cliffs, Blue Hour":p0==="morning"?"The Lemon Cliffs, Early":p0==="scirocco"?"The Lemon Cliffs, Scirocco":"The Lemon Cliffs",ride:"paper-plane",style:"none",camera:{fov:64,near:.3,far:6e3,lookAhead:24,sway:.8,bank:1.3},pois:io,portal:{shape:"circle",radius:7,color:I0?"#FFD9A0":"#BDF2E6",glow:1.4,revealDistance:460},post:{exposure:E.exposure,bloom:{strength:I0?.5:.32,radius:.5,threshold:I0?.9:1},grade:{saturation:1.14,contrast:1.05,tint:"#ffffff",shadowTint:"#0a0818",vignette:.18,grain:.035,aberration:0}},update(e,t,u,n){n0.uTime.value=t,Y.uniforms.uCloudT&&(Y.uniforms.uCloudT.value=t),A.renderer?.getDrawingBufferSize(ft),ft.y>0&&n0.uRes.value.copy(ft),Le.position.setFromMatrixPosition(u.matrixWorld);const a=s0(P0-.008,P0+.003,n)*(1-s0(P0+.006,P0+.04,n));n0.uGain.value=Ht*(1+1.5*a),Y.uniforms.uGain.value=Ht*(1+1.5*a),Et.uGain.value=1+.9*a,Y.update(e,t,u),Y.setProgress(Ce?Math.max(.35,Math.min(1,(n-(Fe-.2))/.2)):(n-Wt)/.06),M0.posAtDist(n*ue+13,ct),M0.tangentAtDist(n*ue+13,Vt),Me.uLead.value.copy(ct),Me.uLeadF.value.copy(Vt),Me.uComp.value=s0(P0+.004,P0+.04,n)*(1-s0(ne-.075,ne-.035,n))+s0(re,re+.03,n),Me.uCamZ.value=n>ne?M0.pointAt(n,ct).z:-1e4;const c=.5-.5*Math.cos(Math.PI*2*(1.5*n+.004*t)+ro);le(.03+.94*c,-1.45,at[0].position),le(.03+.94*(1-c),1.45,at[1].position),Rt(t,X0),ze.position.copy(X0),ze.rotation.y=X0.ry;for(let m=0;m<6;m++){Rt(t-.25-m*.3,X0);const d=(.5+m*.32)*(.35+1.4*X0.corner);Dt.setMatrixAt(m,co.makeScale(d,d*.7,d).setPosition(X0.x,X0.y+.4+m*.25,X0.z))}if(Dt.instanceMatrix.needsUpdate=!0,U0){const m=-Math.PI/2-.45+(t*_t+fo)%.9;U0.position.set(fe[0]+Math.cos(m)*xe,Math.sin(t*.6)*.15,fe[1]+Math.sin(m)*xe),U0.rotation.y=Math.atan2(-Math.sin(m),Math.cos(m)),ot.uAng.value=m-.012}Pt.uOcto.value.set(30+Math.sin(t*.05)*35,215+Math.cos(t*.07)*25,0);const s=n>ne-.03&&n<re?(n-ne+.03)*it:t%7,r=U+9,i=Math.max(0,s-.8),f=Math.min(d0+3,r+i*6.5),M=s<.8?v0(r)+5.6-5.4*s*s/.64:v0(f)+.15+Math.abs(Math.sin(i*6.5))*1*Math.exp(-i*.3);Ie.position.set(1.6+Math.sin(i*1.3)*.8,M,f),Ie.rotation.set(i*7,0,i*3),Re.rotation.set(0,Math.PI/2,t*5.5),st.scale.setScalar(.6+.4*Math.sin(t*3.1)),n0.uFoot.value=1-.85*s0(re-.05,re+.03,n);for(let m=0;m<rt.length;m++)rt[m].rotation.x=Math.sin(t*2.3+m*1.4)*.75},dispose(){Y.dispose?.(),c0&&(c0.depthTexture?.dispose(),c0.dispose(),c0=null)}}}};export{Po as default};
