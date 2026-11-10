import*as a from"three";import{mergeGeometries as ve,mergeVertices as fe}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as de,clamp as Z,lerp as R,smoothstep as Z0}from"../kit/core.js";import*as $ from"../kit/fauna.js";import*as G0 from"../kit/fx.js";import{buildHero as he}from"../parts/frozen-weather-museum.js";const T=Math.PI*2,V=["#F4F1EA","#DCE6EE","#C9CED3","#B08D57","#14181E","#CFC4FF","#D98A3A"],U=new a.Vector3(0,120,-350),D=(o,l=1)=>new a.Color(o).multiplyScalar(l),L=`
  uniform vec3 uSunDir, uSunCol, uSkyCol, uAmbCol, uFogCol, uFlashCol, uMarble, uBrassCol;
  uniform float uFogDen, uSkyGain, uHurT, uEye, uJarWash;
  uniform vec4 uFlash, uWarm;
  uniform vec3 uWarmCol, uKeyCol, uGoldCol;
  uniform float uFillBase, uGoldSpill, uFloorK;
  float h13(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float h12(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float vn3(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(h13(i), h13(i + vec3(1, 0, 0)), f.x), mix(h13(i + vec3(0, 1, 0)), h13(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(h13(i + vec3(0, 0, 1)), h13(i + vec3(1, 0, 1)), f.x), mix(h13(i + vec3(0, 1, 1)), h13(i + vec3(1, 1, 1)), f.x), f.y), f.z);
  }
  float vn2(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h12(i), h12(i + vec2(1, 0)), f.x), mix(h12(i + vec2(0, 1)), h12(i + vec2(1, 1)), f.x), f.y);
  }
  float band(float x, float w, float s) { return 1.0 - smoothstep(w - s, w + s, abs(x)); }
  // skylights: q = point in the ceiling plane (x, z)
  float skyE(vec2 q, float s) { float zz = mod(q.y - 330.0, 20.0) - 10.0; return band(zz, 3.0, s) * band(q.x, 17.0, s) * step(96.0, q.y) * step(q.y, 354.0); }
  float skyF(vec2 q, float s) { float zz = mod(q.y + 105.0, 50.0) - 25.0; return band(zz, 7.0, s) * band(q.x, 92.0, s) * step(-258.0, q.y) * step(q.y, -102.0); }
  float sunVis(vec3 p) {
    float ly = max(uSunDir.y, 0.05);
    if (p.z > 86.5) { float t = max(40.0 - p.y, 0.0) / ly; return skyE(p.xz + uSunDir.xz * t, 0.2 + 0.02 * t); }
    if (p.z > -89.0) { float t = max(220.0 - p.y, 0.0) / ly; float s = 0.5 + 0.02 * t; return 1.0 - smoothstep(15.0 - s, 15.0 + s, length(p.xz + uSunDir.xz * t)); }
    float t = max(240.0 - p.y, 0.0) / ly; return skyF(p.xz + uSunDir.xz * t, 0.4 + 0.02 * t);
  }
  vec3 applyFog(vec3 c, float d) { float f = 1.0 - exp(-uFogDen * uFogDen * d * d); return mix(c, uFogCol, f); }
  float safeDiv(float a, float b) { return a / (abs(b) < 1e-4 ? (b < 0.0 ? -1e-4 : 1e-4) : b); }
  // warm exhibit light (the look decides how strong): the tornado's dust glow and the wall of bell jars
  float jarRuns(float z) { return band(z - 210.0, 36.0, 3.0) + band(z - 133.5, 32.5, 3.0); }
  vec3 warmLight(vec3 p, vec3 N) {
    vec3 d = uWarm.xyz - p; d.y *= 0.45; float d2 = dot(d, d);
    vec3 w = uWarmCol * uWarm.w * (0.4 + 0.6 * max(dot(N, d * inversesqrt(max(d2, 1e-3))), 0.0)) * exp(-sqrt(d2) / 45.0) * step(p.z, 100.0);
    w += uWarmCol * uJarWash * jarRuns(p.z) * exp(-max(28.5 - p.x, 0.0) / 10.0) * (1.0 - smoothstep(16.0, 34.0, p.y)) * (0.45 + 0.55 * abs(N.x) + 0.3 * max(N.y, 0.0)) * step(86.5, p.z);
    return w;
  }
  // the hurricane's gold light on the marble around it: the recess, the surround and the near ends of walls and ceiling
  vec3 hurrGlow(vec3 p) {
    float rr = length(p.xy - vec2(0.0, 120.0)), dz = p.z + 350.0;
    float dr = length(vec2(max(rr - 113.0, 0.0), dz < 0.0 ? -dz * 2.2 : dz));
    return uGoldCol * uGoldSpill * uEye * (exp(-dr / 24.0) + 0.07 * exp(-dr / 120.0)) * step(p.z, -89.0);
  }
  // the hurricane as a flat picture (for reflections): d = offset from its centre in the wall plane
  vec3 hurrFlat(vec2 d) {
    float r = length(d) + 1e-3, a = atan(d.y, d.x + (abs(d.x) < 1e-4 ? 1e-4 : 0.0));
    float arms = 0.5 + 0.5 * sin(2.0 * a + 5.5 * log(r) - uHurT * 0.25);
    vec3 c = mix(vec3(0.10, 0.13, 0.19), vec3(0.62, 0.66, 0.72), arms * smoothstep(8.0, 30.0, r));
    c += vec3(1.0, 0.82, 0.5) * uEye * exp(-r / 16.0);
    return c;
  }
  // what a ray leaving point p in direction R sees: a coarse analytic copy of the three rooms
  vec3 roomEnv(vec3 p, vec3 R) {
    vec3 wallC = uMarble * (uAmbCol * 0.8 + uKeyCol * 0.3);
    if (p.z > 86.5) {
      float tx = safeDiv((R.x > 0.0 ? 30.0 : -30.0) - p.x, R.x), ty = R.y > 0.0 ? (40.0 - p.y) / max(R.y, 1e-4) : p.y / max(-R.y, 1e-4);
      float t = min(tx, ty); vec3 h = p + R * t; vec3 col;
      if (ty < tx) {
        if (R.y > 0.0) { vec2 cf = abs(fract(h.xz / 5.0) - 0.5); col = wallC * mix(0.5, 0.8, smoothstep(0.3, 0.36, max(cf.x, cf.y))); col = mix(col, uSkyCol * uSkyGain, skyE(h.xz, 0.3)); }
        else col = vec3(0.012);
      } else {
        float pil = band(mod(h.z, 10.0) - 5.0, 1.3, 0.15);
        col = wallC * mix(0.78, 1.0, pil) * (0.6 + 0.4 * h.y / 40.0) + uMarble * uSunCol * 0.3 * sunVis(h);
        col = mix(col, uBrassCol * 1.4, band(h.y - 30.0, 0.5, 0.2));
        if (R.x > 0.0) col += uWarmCol * uJarWash * jarRuns(h.z) * (1.2 + 5.0 * band(fract((h.y - 3.9) / 4.2) - 0.5, 0.16, 0.08)) * step(h.y, 22.5) * step(2.0, h.y);   // the lit jars
      }
      for (int i = 0; i < 3; i++) {                                   // the column screens
        float zs = i == 0 ? 250.0 : (i == 1 ? 170.0 : 96.0);
        float tz = safeDiv(zs - p.z, R.z);
        if (tz > 0.0 && tz < t) {
          vec3 q = p + R * tz; float ax = abs(q.x);
          float c1 = band(ax - 17.0, 1.5, 0.12) + band(ax - 21.5, 1.5, 0.12);
          float m = q.y < 34.0 ? clamp(c1, 0.0, 1.0) : step(q.y, 40.0);
          float sh = 0.55 + 0.45 * sqrt(max(1.0 - pow(min(abs(ax - 17.0), abs(ax - 21.5)) / 1.5, 2.0), 0.0));
          col = mix(col, wallC * (q.y < 34.0 ? sh : 0.85), m); t = mix(t, tz, m);
        }
      }
      if (p.z + R.z * t < 86.0) col = mix(col, wallC * 1.15 + uAmbCol * vec3(0.3, 0.24, 0.15), 0.7);     // the rotunda beyond the door
      return col;
    }
    if (p.z > -89.0) {
      float b = dot(p.xz, R.xz), a2 = max(dot(R.xz, R.xz), 1e-5), c = dot(p.xz, p.xz) - 8100.0;
      float tw = (-b + sqrt(max(b * b - a2 * c, 0.0))) / a2; vec3 h = p + R * tw;
      if (h.y < 0.0) return vec3(0.012);
      float k = clamp(h.y / 130.0, 0.0, 1.6);
      vec3 col = wallC * (0.55 + 0.4 * min(k, 1.0)) + uMarble * uSunCol * 0.3 * sunVis(h) + uMarble * warmLight(h, vec3(0.0, 1.0, 0.0)) * 0.6;
      if (h.y > 130.0) { float tt = (220.0 - p.y) / max(R.y, 1e-3); float rho = length(p.xz + R.xz * tt); col = mix(wallC * 0.9, uSkyCol * uSkyGain, 1.0 - smoothstep(14.0, 16.0, rho)); }
      return col;
    }
    float tx = safeDiv((R.x > 0.0 ? 120.0 : -120.0) - p.x, R.x), ty = R.y > 0.0 ? (240.0 - p.y) / max(R.y, 1e-4) : p.y / max(-R.y, 1e-4);
    float tz = R.z < 0.0 ? (-350.0 - p.z) / min(R.z, -1e-4) : (-88.0 - p.z) / max(R.z, 1e-4);
    float t = min(min(tx, ty), tz); vec3 h = p + R * t; vec3 col;
    if (t == ty) col = R.y > 0.0 ? mix(wallC * 0.7, uSkyCol * uSkyGain, skyF(h.xz, 0.5)) : vec3(0.012);
    else if (t == tx) col = wallC * mix(0.8, 1.0, band(mod(h.z, 26.0) - 13.0, 3.0, 0.3)) * (0.55 + 0.45 * h.y / 240.0) + uMarble * uSunCol * 0.3 * sunVis(h);
    else {
      col = wallC * (0.55 + 0.45 * h.y / 240.0);
      if (R.z < 0.0) { vec2 d = h.xy - vec2(0.0, 120.0); float rr = length(d); col = mix(hurrFlat(d), col, smoothstep(108.0, 114.0, rr)); }
    }
    return col;
  }
`;function Q0(o,l=!1){return new a.ShaderMaterial({uniforms:{...o,uGlass:{value:l?1:0}},side:a.DoubleSide,transparent:l,depthWrite:!l,vertexShader:`
      attribute float aMat; attribute vec3 color; uniform float uTime;
      varying vec3 vW, vN, vCol; varying float vMat;
      void main() {
        vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vCol = color; vMat = aMat;
        if (aMat > 7.5) {                                       // foliage and fruit: the whole crown leans, the leaves shiver
          float ph = floor(w.x / 9.0 + 0.5) * 2.1 + floor(w.z / 9.0 + 0.5) * 1.3, k = smoothstep(4.0, 10.0, w.y) * (w.z < -89.0 ? 2.2 : 1.0);
          w.xz += vec2(sin(uTime * 0.83 + ph) + 0.4 * sin(uTime * 2.1 + ph * 1.7), cos(uTime * 0.67 + ph * 1.3)) * 0.085 * k;
          w.xyz += vN * 0.035 * k * sin(uTime * 2.7 + w.x * 2.9 + w.y * 3.7 + w.z * 3.1) * step(aMat, 8.5);
        }
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,fragmentShader:`
      ${L}
      uniform float uGlass, uBoltGrow; uniform vec3 uBoltPos, uGlowCol;
      varying vec3 vW, vN, vCol; varying float vMat;
      float veins(vec3 p) {
        float n = vn3(p * 0.11) * 0.6 + vn3(p * 0.27 + 7.3) * 0.3 + vn3(p * 0.71) * 0.1;
        return 1.0 - smoothstep(0.0, 0.022, abs(n - 0.5));
      }
      void main() {
        vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
        vec3 N = normalize(vN); if (dot(N, V) < 0.0) N = -N;
        int m = int(vMat + 0.5);
        float sv = sunVis(vW), ndl = max(dot(N, uSunDir), 0.0);
        vec3 sun = uSunCol * sv * ndl;
        vec3 fd = uFlash.xyz - vW; float fl2 = dot(fd, fd);
        vec3 flash = uFlashCol * uFlash.w * (0.35 + 0.65 * max(dot(N, fd * inversesqrt(max(fl2, 1e-3))), 0.0)) / (1.0 + fl2 / 1600.0);
        float up = N.y * 0.5 + 0.5;
        vec3 amb = uAmbCol * mix(0.55, 1.0, up);
        vec3 warm = warmLight(vW, N);
        vec3 col;
        if (m == 1) {                                           // polished black marble
          vec3 R = reflect(-V, vec3(0.0, 1.0, 0.0));
          float nv = clamp(V.y, 0.0, 1.0), fres = 0.035 + 0.32 * pow(1.0 - nv, 5.0);
          float vv = veins(vW * vec3(0.5, 1.0, 0.5));
          float tile = max(band(mod(vW.x + 30.0, 10.0) - 5.0, 4.96, 0.02), 0.0) * band(mod(vW.z, 10.0) - 5.0, 4.96, 0.02);
          vec3 base = vec3(0.016, 0.019, 0.024) * (0.6 + 0.6 * vn2(vW.xz * 0.05)) + vec3(0.018, 0.02, 0.023) * vv;
          base *= mix(0.45, 1.0, tile);
          col = base * (amb * 2.0 + flash * 3.0 + warm * 2.0 + hurrGlow(vW) * 2.0) + (base + 0.05) * sun * 1.6;
          vec3 env = roomEnv(vW + vec3(0.0, 0.02, 0.0), R) * mix(0.75, 1.0, sv) * uFloorK;
          // mirrored glows: the lightning (a vertical line of light) and the flash
          vec2 lp = uBoltPos.xz - vW.xz; float tl = dot(lp, R.xz) / max(dot(R.xz, R.xz), 1e-4);
          float dl = length(lp - R.xz * tl), hl = R.y * tl;
          float seen = step(0.0, tl) * step(36.0 * (1.0 - uBoltGrow), hl) * step(hl, 36.0);
          env += uGlowCol * seen * (6.0 * exp(-dl * dl * 1.5) + 0.8 * exp(-dl * 0.35)) * step(86.5, vW.z);
          col += env * fres * mix(0.8, 0.62, vv);
        } else if (m == 2) {                                    // brass
          vec3 R = reflect(-V, N);
          vec3 env = roomEnv(vW + N * 0.05, R);
          float sp = pow(max(dot(R, uSunDir), 0.0), 40.0) * sv;
          col = uBrassCol * (amb * 0.45 + sun * 0.6 + flash + warm + hurrGlow(vW) * 1.4 + env * 0.9 + uSunCol * sp * 1.5) * (0.85 + 0.3 * vn3(vW * 3.0));
        } else if (m == 3 || m == 9) {
          col = vCol * (amb + sun + flash + warm);
        } else if (m == 8) {                                    // foliage: mottled leaves, a sun term, light through the rim
          vec3 q = vW * 2.4;
          float l1 = vn3(q), l2 = vn3(q * 2.9 + 11.0), l3 = vn3(q * 7.3 + 5.0), lf = l1 * 0.4 + l2 * 0.35 + l3 * 0.25;
          if (dot(N, V) < (0.08 + 0.5 * (l1 * 0.45 + l2 * 0.55)) * (1.0 - smoothstep(30.0, 70.0, dist))) discard;   // a ragged, leafy outline instead of a faceted ball
          vec3 Nf = normalize(N + (vec3(l2, l3, vn3(q * 2.9 - 23.0)) - 0.5) * 1.2);
          float ndf = max(dot(Nf, uSunDir), 0.0), upf = Nf.y * 0.5 + 0.5;
          float occ = mix(0.3, 1.0, smoothstep(0.34, 0.6, lf)) * mix(0.5, 1.0, up);
          vec3 leaf = mix(vCol * 0.5, vCol * 1.55 + vec3(0.012, 0.03, 0.0), smoothstep(0.38, 0.7, lf));
          float rim = pow(1.0 - max(dot(N, V), 0.0), 2.5);
          col = leaf * ((uAmbCol * mix(0.5, 1.2, upf) + uSunCol * sv * (0.2 + 0.8 * ndf)) * occ + flash + warm);
          col += vCol * vec3(1.4, 1.9, 0.6) * rim * (uAmbCol * 0.5 + uSunCol * sv * 0.4) * occ;
          col += uSkyCol * uSkyGain * 0.05 * smoothstep(0.78, 0.95, l3) * upf * occ;                       // gloss on single leaves
        } else if (m == 4) {
          col = vCol;
        } else if (m == 5) {                                    // flat coffered ceiling with skylights
          float per = vW.z > 86.5 ? 5.0 : 10.0;
          vec2 g = vec2(vW.x, vW.z) / per; vec2 cf = abs(fract(g) - 0.5);
          float e = max(cf.x, cf.y); float cof = smoothstep(0.30, 0.34, e), inner = 1.0 - smoothstep(0.12, 0.30, e);
          float sk = vW.z > 86.5 ? skyE(vW.xz, 0.12) : skyF(vW.xz, 0.3);
          float nearSky = vW.z > 86.5 ? skyE(vW.xz, 2.5) : skyF(vW.xz, 6.0);
          col = uMarble * uAmbCol * (mix(0.52, 0.86, cof) + 0.1 * inner + 0.35 * nearSky) + uMarble * (flash + warm * 0.6 + hurrGlow(vW) * mix(0.35, 1.0, cof));
          col += uBrassCol * 0.5 * (1.0 - smoothstep(0.03, 0.06, length(cf))) ;
          vec3 glass = uSkyCol * uSkyGain * (0.9 + 0.1 * band(mod(vW.x, 3.4) - 1.7, 1.62, 0.02));
          col = mix(col, glass, sk);
        } else if (m == 6) {                                    // dome
          float rho = length(vW.xz), k = clamp((rho - 15.0) / 75.0, 0.0, 1.0);
          float az = atan(vW.z, vW.x + (abs(vW.x) < 1e-4 ? 1e-4 : 0.0)) * 16.0 / 3.14159, rg = pow(k, 0.7) * 6.0;
          vec2 cf = abs(fract(vec2(az, rg)) - 0.5); float e = max(cf.x, cf.y);
          float cof = smoothstep(0.30, 0.35, e);
          col = uMarble * (uAmbCol * mix(0.46, 0.82, cof) * mix(1.25, 0.72, k) + uKeyCol * 0.5 * mix(0.4, 1.0, cof) * max(dot(N, vec3(-0.31, 0.38, 0.87)), 0.0) + sun * 0.8 + flash + warm * mix(0.5, 1.0, cof));
          col += uSkyCol * 0.25 * (1.0 - smoothstep(0.0, 0.25, k));
          col = mix(col, uBrassCol * 0.9, (1.0 - smoothstep(0.02, 0.05, length(cf))) * 0.6);
        } else {                                                // 0 marble (and 7 glass, shaded below)
          float vv = veins(vW) * (1.0 - smoothstep(22.0, 52.0, dist));
          vec3 alb = uMarble * (0.94 + 0.08 * vn3(vW * 0.04)) * mix(1.0, 0.87, vv * 0.55);
          float ao = 1.0, relief = 1.0;
          if (abs(N.y) < 0.5) {
            float H = vW.z > 86.5 ? 40.0 : (vW.z > -89.0 ? 130.0 : 240.0);
            float hy = clamp(vW.y / H, 0.0, 1.2);
            ao = (0.5 + 0.5 * smoothstep(0.0, 0.95, hy)) * (0.75 + 0.25 * smoothstep(0.0, 0.035, hy));
            if (vCol.g > 0.6 && vCol.r < 0.5) relief = mix(0.56, 1.05, smoothstep(0.05, 0.85, vCol.b));   // column shafts: shade in the flutes
            if (vCol.r > 0.5) {                                 // big wall surfaces carry painted relief
              float along, per, pw;
              if (vW.z > 86.5) { along = abs(N.x) > 0.5 ? vW.z : vW.x; per = 10.0; pw = 1.3; }
              else if (vW.z > -89.0) { along = atan(vW.z, vW.x + (abs(vW.x) < 1e-4 ? 1e-4 : 0.0)) * 90.0; per = 3.14159 * 180.0 / 32.0; pw = 2.6; }
              else { along = abs(N.x) > 0.5 ? vW.z : vW.x; per = 26.0; pw = 3.0; }
              float a = mod(along, per) - per * 0.5;
              float pil = band(a, pw, 0.06), edge = band(abs(a) - pw - 0.35, 0.35, 0.3);
              float panel = band(a, per * 0.5 - pw - 1.6, 0.1) * band(hy - 0.44, 0.30, 0.004);
              float top = band(hy - 0.80, 0.012, 0.003) + band(hy - 0.07, 0.006, 0.002);
              relief = mix(0.86, 1.0, pil) * (1.0 - 0.3 * edge * (1.0 - pil)) * (1.0 - 0.13 * panel) * (1.0 - 0.25 * clamp(top, 0.0, 1.0));
              relief *= 1.0 - 0.18 * panel * smoothstep(0.66, 0.74, hy);
            }
          }
          float kd = max(dot(N, vec3(-0.31, 0.38, 0.87)), 0.0);
          float fill = uFillBase + 0.08 * max(-N.z, 0.0);                                                     // so that returns and reveals read
          col = alb * relief * (amb * ao * fill + uKeyCol * kd * ao + sun * 0.6 + flash + warm + hurrGlow(vW) * (0.55 + 0.45 * max(-N.z, 0.0) + 0.3 * abs(N.y)));
        }
        float alpha = 1.0;
        if (uGlass > 0.5) {                                     // vitrine glass: a fresnel sheen and the room in it
          vec3 R = reflect(-V, N); float fr = pow(1.0 - abs(dot(N, V)), 3.0);
          col = roomEnv(vW + N * 0.05, R) * (0.25 + 0.75 * fr) + flash * 0.4; alpha = 0.06 + 0.5 * fr;
        }
        gl_FragColor = vec4(applyFog(col, dist), alpha);
      }`})}const Ee=new a.Matrix4,me=new a.Quaternion,pe=new a.Euler,xe=new a.Vector3,ye=new a.Vector3;function A(o=0,l=0,t=0,e=0,n=0,s=0,r=1,u=r,v=r){return new a.Matrix4().compose(ye.set(o,l,t),me.setFromEuler(pe.set(e,n,s)),xe.set(r,u,v))}const Q=new a.Color(1,1,1),N=new a.Color(.3,.3,.3);function J(){const o=[],l={add(t,e,n,s=N){const r=t.index?t.toNonIndexed():t;n&&r.applyMatrix4(n);const u=r.attributes.position.count,v=new Float32Array(u*3),c=new Float32Array(u).fill(e);for(let f=0;f<u;f++)v[f*3]=s.r,v[f*3+1]=s.g,v[f*3+2]=s.b;for(const f of Object.keys(r.attributes))f!=="position"&&f!=="normal"&&r.deleteAttribute(f);return r.setAttribute("color",new a.BufferAttribute(v,3)),r.setAttribute("aMat",new a.BufferAttribute(c,1)),o.push(r),l},box(t,e,n,s,r,u,v,c,f=0){return l.add(new a.BoxGeometry(t,e,n),v,A(s,r,u,0,f,0),c)},cyl(t,e,n,s,r,u,v,c,f=12){return l.add(new a.CylinderGeometry(e,t,n,f,1,!1),v,A(s,r+n/2,u),c)},quad(t,e,n,s,r,u){const v=new a.BufferGeometry;return v.setAttribute("position",new a.BufferAttribute(new Float32Array([...t,...e,...n,...t,...n,...s]),3)),v.computeVertexNormals(),l.add(v,r,null,u)},raw(t){return o.push(t),l},build(){const t=ve(o,!1);for(const e of o)e.dispose();return t.computeBoundingSphere(),t},get count(){return o.length}};return l}function J0(o,l,t,e=34){const n=new a.CylinderGeometry(1.3,1.5,e-4.4,40,3,!0),s=n.attributes.position;for(let c=0;c<s.count;c++){const f=Math.atan2(s.getZ(c),s.getX(c));(Math.round(f/(T/40))%2+2)%2===1&&(s.setX(c,s.getX(c)*.9),s.setZ(c,s.getZ(c)*.9))}const r=new Float32Array(s.count*3),u=(e-4.4)/2;for(let c=0;c<s.count;c++){const f=Math.atan2(s.getZ(c),s.getX(c)),d=Math.round(f/(T/40)),p=s.getY(c)/u,w=1+.035*Math.max(0,1-Math.abs(p+.33)/.7);s.setX(c,s.getX(c)*w),s.setZ(c,s.getZ(c)*w),r.set([.3,.9,(d%2+2)%2===1?0:1],c*3)}n.computeVertexNormals(),n.deleteAttribute("uv"),n.setAttribute("color",new a.BufferAttribute(r,3));const v=n.toNonIndexed();n.dispose(),v.applyMatrix4(A(l,2+u,t)),v.setAttribute("aMat",new a.BufferAttribute(new Float32Array(v.attributes.position.count),1)),o.raw(v),o.box(4.2,1,4.2,l,.5,t,0),o.cyl(1.95,1.6,1,l,1,t,0,N,20),o.cyl(1.32,2,1.5,l,e-2.4,t,0,N,20),o.box(4.3,.9,4.3,l,e-.45,t,0),o.cyl(1.62,1.62,.22,l,2,t,2,N,20)}async function we(o,l){const t=J(),e=-.12,n=40;t.quad([-30,e,365],[30,e,365],[30,e,84],[-30,e,84],1),t.quad([-30,40,84],[30,40,84],[30,40,365],[-30,40,365],5);for(const i of[-1,1])t.quad([30*i,0,365],[30*i,0,84.85],[30*i,40,84.85],[30*i,40,365],0,Q),t.box(1.5,1.7,280,29.25*i,34.2,225,0),t.box(.9,.7,280,28.9*i,33,225,0),t.box(.25,.35,280,28.5*i,32.5,225,2),t.box(.8,1.6,280,29.6*i,.8,225,0);for(let i=105;i<360;i+=10)if(!(Math.abs(i-250)<6||Math.abs(i-170)<6))for(const x of[-1,1])t.box(.56,32.3,2.6,29.73*x,16.15,i,0),t.box(.86,1.9,3.3,29.6*x,.95,i,0),t.box(.86,1.1,3.3,29.6*x,31.7,i,0),t.box(.66,.3,2.9,29.68*x,30.6,i,0);await l.yield(),t.quad([-30,0,365],[-30,40,365],[30,40,365],[30,0,365],0,Q),t.box(22,30,1.2,0,15,364.6,3,new a.Color(.05,.045,.04)),t.box(25,1.5,2,0,31,364.2,0),t.box(1.6,31,2,-12,15.5,364.2,0),t.box(1.6,31,2,12,15.5,364.2,0),t.box(.4,26,.5,0,14,363.9,2);for(const i of[250,170,96]){for(const x of[-3.2,3.2])for(const S of[17,21.5])J0(t,S,i+x),J0(t,-S,i+x);await l.yield(),t.box(60,6,10.6,0,37,i,0),t.box(46,.5,11.2,0,34.1,i,2);for(const x of[-1,1])t.box(2.4,34,9.6,28.8*x,17,i,0)}await l.yield();const s=90,r=Math.asin(30/s),u=Math.asin(n/s),v=[],c=(i,x,S,G)=>{for(let W=0;W<S;W++)v.push([R(i,x,W/S),R(i,x,(W+1)/S),G])};c(-r,r,6,1),c(r,Math.PI-u,44,0),c(Math.PI-u,Math.PI+u,4,2),c(Math.PI+u,T-r,44,0);const f=(i,x)=>[Math.sin(i)*s,x,Math.cos(i)*s];for(const[i,x,S]of v){const G=S===1?[[40,130]]:S===2?[[0,64],[116,130]]:[[0,130]];for(const[W,j]of G)t.quad(f(i,W),f(i,j),f(x,j),f(x,W),0,Q)}const d=(i,x,S=96,G=null)=>t.add(new a.LatheGeometry(i.map(W=>new a.Vector2(W[0],W[1])),S),x,G);d([[90,124],[88.2,125],[88.2,127],[86.6,128.5],[86.6,131],[90,131.5]],0),d([[89.9,121.5],[88.9,121.9],[89.9,122.3]],2),d([[90,0],[88.8,0],[88.8,1.8],[90,2.2]],0,96);for(let i=0;i<32;i++){const x=(i+.5)*T/32,S=Math.cos(x),G=Math.sin(x),W=Math.PI/2-x;G>0&&Math.abs(S*s)<34||G<0&&Math.abs(S*s)<n+6||(t.add(new a.BoxGeometry(5.2,120,1.5),0,A(S*89.4,60,G*89.4,0,W,0)),t.add(new a.BoxGeometry(6.2,4.4,2.3),0,A(S*89.1,2.2,G*89.1,0,W,0)),t.add(new a.BoxGeometry(6.2,3.2,2.3),0,A(S*89.1,119.2,G*89.1,0,W,0)),t.add(new a.BoxGeometry(5.7,.8,1.9),0,A(S*89.25,115.6,G*89.25,0,W,0)))}const p=[];for(let i=0;i<=12;i++){const x=i/12*Math.PI/2;p.push([15+75*Math.cos(x),131+89*Math.sin(x)])}d(p,6,64),d([[15.2,219],[13.8,219.4],[13.8,221.5],[15.2,221.8]],2,48);const w=new a.CircleGeometry(15,40);w.rotateX(Math.PI/2),t.add(w,4,A(0,221.2,0),o.skyGlow);const z=n+1.4,M=-85.5,h=13;for(const i of[-1,1]){t.box(3,56,h,z*i,90,M,0);for(const x of[-79.3,-91.9])t.box(.45,51.6,.5,(n-.3)*i,90,x,2);for(const x of[-82.4,-88.6])t.box(.5,50.4,1.7,(n-.3)*i,89.6,x,0),t.box(.8,1.6,2.3,(n-.45)*i,65,x,0),t.box(.8,1.2,2.3,(n-.45)*i,114.2,x,0);t.box(.2,44,.2,(n-.2)*i,89.6,-85.5,2)}t.box(2*z+3,3.2,h,0,117.6,M,0),t.box(2*z+3,2.4,h+.4,0,62.8,M,0);for(let i=-n+4;i<n;i+=8)t.box(.8,.6,h-.6,i,115.75,M,0);for(const i of[-82.4,-88.6])t.box(2*n,.45,.7,0,115.8,i,0);t.box(2*n-.4,.4,.5,0,115.8,-78.8,2),t.box(2*n-.4,.4,.5,0,115.8,-92.2,2),t.box(2*n+14,1.6,10,0,62.2,-96,0),t.quad([-n+.1,64.03,-79.1],[n-.1,64.03,-79.1],[n-.1,64.03,-92.1],[-n+.1,64.03,-92.1],1),t.quad([-n-6.8,63.03,-92.1],[n+6.8,63.03,-92.1],[n+6.8,63.03,-100.9],[-n-6.8,63.03,-100.9],1),t.box(2*n+13.2,.3,.3,0,66.2,-100.6,2),t.box(2*n+13.2,.16,.16,0,64.4,-100.6,2);for(let i=-n-6.6;i<=n+6.7;i+=3.1)t.cyl(.13,.13,3.2,i,63,-100.6,2,N,6);for(const i of[-1,1]){t.box(.3,.3,9,(n+6.6)*i,66.2,-96.4,2);for(let x=0;x<3;x++)t.cyl(.13,.13,3.2,(n+6.6)*i,63,-92.5-x*2.8,2,N,6)}await l.yield(),t.box(60,.06,.8,0,.04,85.2,2),await l.yield(),t.quad([-120,e,-91],[120,e,-91],[120,e,-350],[-120,e,-350],1),t.quad([-120,240,-350],[120,240,-350],[120,240,-91],[-120,240,-91],5);for(const i of[-1,1])t.quad([120*i,0,-91],[120*i,0,-350],[120*i,240,-350],[120*i,240,-91],0,Q);const m=-91;t.quad([-120,0,m],[-120,240,m],[-n,240,m],[-n,0,m],0,Q),t.quad([n,0,m],[n,240,m],[120,240,m],[120,0,m],0,Q),t.quad([-n,0,m],[-n,64,m],[n,64,m],[n,0,m],0,Q),t.quad([-n,116,m],[-n,240,m],[n,240,m],[n,116,m],0,Q);for(let i=-117;i>-330;i-=26)for(const x of[-1,1])t.box(1.4,197,5.2,119.4*x,98.5,i,0),t.box(2.4,5.4,6.4,118.9*x,2.7,i,0),t.box(2.2,4.2,6.4,119*x,195.4,i,0),t.box(1.8,1,5.8,119.2*x,190.5,i,0);const b=new a.Shape;b.moveTo(-120,0),b.lineTo(120,0),b.lineTo(120,240),b.lineTo(-120,240),b.lineTo(-120,0);const C=new a.Path;C.absarc(0,U.y,112,0,T,!0),b.holes.push(C),t.add(new a.ShapeGeometry(b,48),0,A(0,0,U.z),Q);const k=new a.CylinderGeometry(112,112,50,72,1,!0);k.rotateX(Math.PI/2),t.add(k,0,A(0,U.y,U.z-25)),t.add(new a.TorusGeometry(115.5,3.4,10,96),0,A(0,U.y,U.z+.5)),t.add(new a.TorusGeometry(111.2,.9,8,96),2,A(0,U.y,U.z+2.2)),t.add(new a.TorusGeometry(120.5,.5,6,96),2,A(0,U.y,U.z+1));for(const i of[-1,1])t.box(1.8,3.2,259,119.1*i,1.6,-220.5,0),t.box(3,5,259,118.5*i,200,-220.5,0),t.box(.5,.8,259,116.9*i,197.4,-220.5,2);return t.box(240,3.2,1.8,0,1.6,-349.1,0),await l.yield(),t.build()}const be=new a.Color(.3,.025,.045),r0=new a.Color(.16,.085,.04),ge=new a.Color(.045,.13,.05);function k0(o,l,t=2.3){for(let e=0;e<l.length;e++){const[n,s]=l[e];if(o.cyl(.42,.34,.14,n,0,s,2,N,10),o.cyl(.09,.09,t,n,.1,s,2,N,8),o.add(new a.SphereGeometry(.2,8,6),2,A(n,t+.2,s)),e+1<l.length){const[r,u]=l[e+1],v=[];for(let c=0;c<=6;c++){const f=c/6;v.push(new a.Vector3(R(n,r,f),t-.1-.75*Math.sin(Math.PI*f),R(s,u,f)))}o.add(new a.TubeGeometry(new a.CatmullRomCurve3(v),8,.085,5,!1),3,null,be)}}}function ze(o,l,t,e,n=5){const s=[],r=Math.max(1,Math.round((t-o)/n)),u=Math.max(1,Math.round((e-l)/n));for(let v=0;v<r;v++)s.push([R(o,t,v/r),l]);for(let v=0;v<u;v++)s.push([t,R(l,e,v/u)]);for(let v=0;v<r;v++)s.push([R(t,o,v/r),e]);for(let v=0;v<=u;v++)s.push([o,R(e,l,v/u)]);return s}function d0(o,l,t,e=0){o.box(.9,2,.9,l,1,t,0,N,e),o.add(new a.BoxGeometry(1.5,.08,1),2,A(l,2.18,t,-.5,e,0))}function h0(o,l,t,e=0){const n=A(l,0,t,0,e,0),s=(r,u,v,c,f,d,p,w)=>o.add(new a.BoxGeometry(r,u,v),p,n.clone().multiply(A(c,f,d)),w);s(7,.45,2.2,0,1.35,0,3,new a.Color(.1,.03,.035)),s(7.2,.3,2.4,0,1,0,0),s(.7,.9,2.2,-2.9,.45,0,0),s(.7,.9,2.2,2.9,.45,0,0)}function ee(o,l,t,e){const n=new a.IcosahedronGeometry(l,t);n.deleteAttribute("uv"),n.deleteAttribute("normal");const s=fe(n,1e-4),r=s.attributes.position,u=o()*9,v=o()*9;n.dispose();for(let c=0;c<r.count;c++){const f=r.getX(c)/l,d=r.getY(c)/l,p=r.getZ(c)/l,w=1+e*(Math.sin(f*4.3+u)*Math.sin(d*3.9+v)+.8*Math.sin(p*4.9+d*2+u)+.5*Math.sin(f*8.3+p*7.1+v));r.setXYZ(c,f*w*l,d*w*l,p*w*l)}return s.computeVertexNormals(),s}async function Ce(o,l){const t={big:[],small:[]};for(let e=0;e<3;e++)t.big.push(ee(o,2.25,2,.1)),await l.yield();for(let e=0;e<6;e++)t.small.push(ee(o,1,1,.14)),e&1&&await l.yield();return t}function Me(o,l,t,e,n,s=1){o.cyl(1.3*s,1.7*s,2.2*s,e,0,n,2,N,14),o.cyl(1.8*s,1.8*s,.18*s,e,2.2*s,n,2,N,14),o.cyl(.2*s,.14*s,4.2*s,e,2.2*s,n,3,r0,6);const r=ge.clone().multiplyScalar(l.range(.8,1.25)),u=7.6*s;o.add(l.pick(t.big),8,A(e,u,n,0,l()*T,0,s,s*.94,s),r);for(let v=0;v<15;v++){const c=l()*T,f=Math.asin(l.range(-.55,1)),d=l.range(1.75,2.25)*s,p=l.range(.75,1.2)*s;o.add(l.pick(t.small),8,A(e+Math.cos(c)*Math.cos(f)*d,u+Math.sin(f)*d*.94,n+Math.sin(c)*Math.cos(f)*d,l()*3,l()*3,0,p,p*l.range(.7,.95),p),r.clone().multiplyScalar(l.range(.8,1.2)))}for(let v=0;v<9;v++){const c=l()*T,f=l.range(-.5,.9),d=2.95*s;o.add(new a.IcosahedronGeometry(.26*s,1),9,A(e+Math.cos(c)*Math.cos(f)*d,u+Math.sin(f)*d*.92,n+Math.sin(c)*Math.cos(f)*d),new a.Color(.9,.36,.03))}}function W0(o,l,t,e,n,s,r,u,v=2){const c=(l+n)/2,f=(t+s)/2,d=(e+r)/2,p=n-l,w=s-t,z=r-e;for(const M of[l,n])for(const h of[e,r])o.box(u,w,u,M,f,h,v);for(const M of[t,s]){for(const h of[e,r])o.box(p,u,u,c,M,h,v);for(const h of[l,n])o.box(u,u,z,h,M,d,v)}}async function ke(o,l,t){const e=J(),n=await Ce(o,t),s=[];let r=J(),u=0;const v=async(h,m,b)=>{Me(r,o,n,h,m,b),await t.yield(),++u%6===0&&(s.push(r.build()),r=J(),await t.yield())};await t.yield(),W0(e,-15,.4,290,15,31,320,.35);for(const h of[-1,1])k0(e,[[18*h,287],[18*h,293],[18*h,299],[18*h,305],[18*h,311],[18*h,317],[18*h,323]]),k0(e,[[18*h,323],[13*h,323],[8.5*h,323]]),k0(e,[[18*h,287],[13*h,287],[8.5*h,287]]);d0(e,10.5,325.5,.3),d0(e,-12.5,284.5,2.6),await t.yield();const c=l.bolt.x,f=l.bolt.z;e.box(11.6,1.2,11.6,c,.6,f,0),e.box(10.6,.5,10.6,c,36.6,f,2),W0(e,c-5,1.2,f-5,c+5,36.4,f+5,.4),e.cyl(.5,.2,1,c,35.4,f,2,N,10),e.cyl(.9,.5,.5,c,1.2,f,2,N,12),k0(e,ze(c-8.5,f-8.5,c+8.5,f+8.5,4.25)),d0(e,c+9.6,f+6.5,-1.2);for(const h of[-1,1])for(const m of[-1,1])e.box(.14,34.4,.14,c+4.7*h,18.8,f+4.7*m,4,l.edgeGlow);for(const h of[1.55,36.2])for(const m of[-1,1])e.box(.12,.12,9.4,c+4.7*m,h,f,4,l.edgeGlow),e.box(9.4,.12,.12,c,h,f+4.7*m,4,l.edgeGlow);await t.yield();const d=l.mini;e.box(7.6,1,7.6,d.x,.5,d.z,0),e.box(6.9,.3,6.9,d.x,1.15,d.z,2),W0(e,d.x-3,1.3,d.z-3,d.x+3,13.3,d.z+3,.22),e.box(6.6,.5,6.6,d.x,13.55,d.z,2),e.box(4.6,.1,4.6,d.x,13.2,d.z,4,l.lamp.clone().multiplyScalar(.55));for(const h of[-1,1])for(const m of[-1,1])e.box(.08,11.8,.08,d.x+2.82*h,7.3,d.z+2.82*m,4,l.edgeGlow);d0(e,d.x+5.6,d.z+2.2,-1);const p=l.rainbow;e.box(21,.35,1.1,p.x,.17,p.z,2),e.box(20.4,.06,.6,p.x,.36,p.z,3,new a.Color(.02,.025,.03));for(const h of[-1,1])e.cyl(.5,.36,.5,p.x+9.6*h,0,p.z,2,N,10),e.add(new a.SphereGeometry(.34,10,8),2,A(p.x+9.6*h,.8,p.z));d0(e,p.x+12.4,p.z+2.5,-.6),await t.yield(),h0(e,9,272,0),h0(e,-9,232,0),h0(e,10,196,0),h0(e,-8,120,Math.PI/2),h0(e,9,150,Math.PI/2),e.add(new a.ConeGeometry(.22,2.6,8),3,A(5.9,1.25,272.9,.42,0,0),new a.Color(.02,.04,.1)),e.add(new a.TorusGeometry(.2,.05,5,10,Math.PI),3,A(5.9,2.55,273.45,.42,0,0),r0);for(let h=345;h>100;h-=20)for(const m of[-1,1])Math.abs(h-250)<9||Math.abs(h-170)<9||m<0&&(Math.abs(h-f)<12||Math.abs(h-l.mini.z)<8)||await v(24.2*m,h+o.range(-1,1),o.range(.85,1.15));for(const[h,m]of l.shelfRuns)for(const b of l.shelfY){e.box(1.9,.22,m-h+2,28.9,b-.11,(h+m)/2,3,r0),e.box(.12,.12,m-h+2,28.05,b+.25,(h+m)/2,2);for(let C=h;C<=m+.1;C+=9)e.box(.2,.7,.2,29.5,b-.5,C,2)}const w=l.desk;e.box(4.6,.22,2.4,w.x,2.1,w.z,3,r0);for(const h of[-1,1])for(const m of[-1,1])e.box(.22,2,.22,w.x+2.05*h,1,w.z+.95*m,3,r0);e.cyl(.2,.25,.36,w.x+1.1,2.21,w.z+.3,3,new a.Color(.75,.73,.68),12),e.box(1.3,.12,.95,w.x-.7,2.27,w.z-.1,3,new a.Color(.24,.05,.05),.2),e.box(1.5,.2,1.5,w.x-.2,1.3,w.z+2.4,3,r0),e.box(1.5,2,.2,w.x-.2,2.3,w.z+3.1,3,r0),e.cyl(.5,.5,.1,w.x+1.9,2.21,w.z-.6,2,N,12),e.cyl(.06,.06,1.2,w.x+1.9,2.3,w.z-.6,2,N,6),e.add(new a.ConeGeometry(.55,.5,12,1,!0),4,A(w.x+1.9,3.7,w.z-.6),l.lamp.clone());const z=l.crocus;e.box(4.4,1,4.4,z.x,.5,z.z,0),W0(e,z.x-2,1,z.z-2,z.x+2,3.6,z.z+2,.12);const M=[];for(let h=-100;h<=100;h+=8)M.push([h,-318]);k0(e,M,2.6);for(const h of[-60,-20,20,60])h0(e,h,-300,0),d0(e,h+9,-313,0);for(const h of[-1,1])for(const m of[-130,-190,-250])await v(108*h,m,2.2);r.count&&s.push(r.build());for(const h of[...n.big,...n.small])h.dispose();return await t.yield(),s.unshift(e.build()),s}function e0(o,l,t=!1){const e=new a.InstancedBufferGeometry,n=new a.PlaneGeometry(2,2);t&&n.rotateX(-Math.PI/2),e.index=n.index,e.setAttribute("position",n.attributes.position),e.setAttribute("uv",n.attributes.uv);for(const s of Object.keys(l))e.setAttribute(s,new a.InstancedBufferAttribute(l[s],l[s].length/o));return e.instanceCount=o,e.boundingSphere=new a.Sphere(new a.Vector3,1e5),e}function oe(o,l,t,e,n={}){const s=n.kind||t.shower,r=Math.round((n.count||6e3)*e),u=n.count?0:40,v=r+u,c=new Float32Array(v*4),f=new Float32Array(v*2),d=s==="snow"?[.05,.1]:s==="hail"?[.05,.11]:[.04,.08];for(let i=0;i<v;i++){const x=i>=r;c.set([x?.5+o.range(-.2,.2):o(),x?o.range(.08,.42):o(),o(),o()],i*4),f.set([x?o.range(.1,.17):o.range(d[0],d[1]),x?1:0],i*2)}const p={...l,uFall:{value:o()*30},uSpeed:{value:0},uMode:{value:s==="snow"?1:s==="hail"?2:0},uBoxMin:{value:new a.Vector3(...n.min||[-15,1,290])},uBoxSize:{value:new a.Vector3(...n.size||[30,30,30])},uPix:{value:.0018},uSelf:{value:n.self||0}},w=new a.ShaderMaterial({uniforms:p,vertexShader:`
      ${L}
      attribute vec4 aP; attribute vec2 aS;
      uniform float uFall, uSpeed, uMode, uPix; uniform vec3 uBoxMin, uBoxSize;
      varying vec2 vUv; varying vec4 vInfo; varying float vDist;
      void main() {
        vec3 c = uBoxMin + aP.xyz * uBoxSize;
        float v = mix(0.7, 1.3, aP.w) * (uMode > 0.5 && uMode < 1.5 ? 0.22 : 1.0);
        float yy = mod(aP.y * uBoxSize.y - uFall * v, uBoxSize.y);
        c.y = uBoxMin.y + yy;
        if (uMode > 0.5 && uMode < 1.5) { c.x += sin(uFall * 0.11 + aP.w * 40.0) * 0.7; c.z += cos(uFall * 0.09 + aP.w * 23.0) * 0.7; }
        vec4 mv = viewMatrix * vec4(c, 1.0);
        float sz = max(aS.x, -mv.z * uPix);
        float st = 1.0 + uSpeed * (uMode < 0.5 ? mix(3.6, 1.6, aS.y) : (uMode > 1.5 ? 1.0 : 0.0));
        sz *= 1.0 - (uMode < 0.5 ? 0.6 : 0.0) * uSpeed;
        vec3 upv = (viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz;
        mv.xyz += vec3(position.x * sz, 0.0, 0.0) + upv * position.y * sz * st;
        vUv = position.xy; vInfo = vec4(sunVis(c), st, aP.w, sz / max(aS.x, 1e-3)); vDist = -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      ${L}
      uniform float uMode, uSpeed, uSelf;
      varying vec2 vUv; varying vec4 vInfo; varying float vDist;
      vec3 gallery(vec3 d) {                                     // the room a drop sees, as three flat tones
        vec3 wall = uMarble * uAmbCol * (0.75 + 0.25 * step(0.6, fract(atan(d.z, d.x + 1e-4) * 3.0)));
        vec3 ceil = mix(uMarble * uAmbCol * 0.8, uSkyCol * uSkyGain, step(abs(fract(d.x * 1.5 + d.z) - 0.5), 0.2));
        return d.y > 0.28 ? ceil : (d.y < -0.2 ? vec3(0.015, 0.018, 0.022) : wall);
      }
      void main() {
        float r2 = dot(vUv, vUv); if (r2 > 1.0) discard;
        float z = sqrt(1.0 - r2); vec3 n = vec3(vUv, z);
        vec3 col;
        vec3 Lv = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
        float nl = max(dot(n, Lv), 0.0), sv = vInfo.x;
        vec3 flash = uFlashCol * uFlash.w * 0.3;
        if (uMode < 0.5) {                                       // water: an upside-down gallery, a rim and a glint
          vec3 d = normalize(vec3(-vUv.x * 1.4, -vUv.y * 1.4, 0.35 + z * 0.3));
          d.xz = vec2(d.x + vInfo.z, d.z);
          col = gallery(normalize(d)) * 0.9;
          col += max(uSkyCol * uSkyGain * 0.3, vec3(0.2, 0.24, 0.3)) * pow(1.0 - z, 2.0);
          col += (max(uSkyCol * uSkyGain, vec3(0.9)) + uSunCol * sv * 2.0) * pow(max(dot(n, normalize(Lv + vec3(0.0, 0.0, 1.0))), 0.0), 60.0);
          col = mix(col, (uSkyCol * 0.45 + uSunCol * sv * 0.35) * (0.6 + 0.4 * z), smoothstep(1.4, 3.4, vInfo.y) * 0.8 + smoothstep(1.0, 3.0, vInfo.w) * 0.1);
          col += uSunCol * sv * 0.12 + flash;
        } else if (uMode < 1.5) {                                // snow: soft lit flakes
          col = vec3(0.9, 0.93, 1.0) * (uAmbCol * 1.1 + uSunCol * sv * 0.8 + flash + uSelf) * (0.55 + 0.45 * z);
        } else {                                                 // hail: milky ice
          col = vec3(0.8, 0.86, 0.95) * (uAmbCol * (0.5 + 0.5 * n.y) + uSunCol * (0.2 + sv) * nl + flash + uSelf * (0.4 + 0.6 * z)) + uSkyCol * 0.5 * pow(1.0 - z, 3.0);
        }
        gl_FragColor = vec4(applyFog(col, vDist), 1.0);
      }`}),z=new a.Mesh(e0(v,{aP:c,aS:f}),w);if(z.frustumCulled=!1,z.name="shower",n.count)return{object:z,U:p,set(i,x){p.uFall.value+=i*(s==="snow"?9:20),p.uSpeed.value=x}};const M=Math.round(260*e),h=new Float32Array(M*4);for(let i=0;i<M;i++)h.set([o.range(-15,15),o.range(290,320),o(),o.range(.5,1.3)],i*4);const m=new a.ShaderMaterial({uniforms:p,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      attribute vec4 aP; uniform float uFall; varying vec2 vUv; varying float vPh; varying vec3 vW;
      void main() {
        vPh = fract(aP.z + uFall * 0.13 * (0.7 + 0.6 * fract(aP.z * 7.13)));
        vec3 c = vec3(aP.x, 0.05, aP.y) + position * aP.w * (0.25 + 1.6 * vPh);
        vUv = position.xz; vW = c; gl_Position = projectionMatrix * viewMatrix * vec4(c, 1.0);
      }`,fragmentShader:`
      ${L}
      uniform float uSpeed; varying vec2 vUv; varying float vPh; varying vec3 vW;
      void main() {
        float r = length(vUv); float ring = band(r - 0.8, 0.09, 0.07) + 0.5 * band(r - 0.45, 0.06, 0.05) * step(0.3, vPh);
        float a = ring * (1.0 - vPh) * (1.0 - vPh) * uSpeed;
        gl_FragColor = vec4((uSkyCol * 0.5 + uSunCol * 0.25 * sunVis(vW) + uFlashCol * uFlash.w * 0.2) * a, 1.0);
      }`}),b=new a.Mesh(e0(M,{aP:h},!0),m);b.frustumCulled=!1,b.renderOrder=2;const C=new a.Group;C.add(z,b);const k=s==="snow"?9:s==="hail"?20:14;return{object:C,U:p,set(i,x){p.uFall.value+=i*k,p.uSpeed.value=x}}}const m0=46,j0=10;function te(o,l,t,e,n=null){const s=n?n.ctrl.map(m=>new a.Vector3(m[0],m[1],m[2])):[[6,12,283],[7,14,268],[3,19,250],[-5,22,232],[-7,19,214],[-2,15,198],[5,17,184],[6,21,170],[1,19,152],[-3,16,134],[1,15,116],[1,14,100],[-3,12.5,88],[-12,10.5,73],[-20,10,57],[-25,12,42],[-27,16,28]].map((m,b)=>new a.Vector3(m[0]+(b>0&&b<10?o.range(-2.5,2.5):0),m[1]+(b>0&&b<10?o.range(-2,2):0),m[2])),r=new a.CatmullRomCurve3(s);r.arcLengthDivisions=600;const u=Math.min(r.getLength(),(m0-2)*j0),v=[];for(let m=0;m<m0;m++)v.push(r.getPointAt(Z(m*j0/r.getLength(),0,1)));const c=Math.round((n?n.count:6e3)*e*(t.gust==="dandelion"?.7:1)),f=new Float32Array(c*4),d=new Float32Array(c*4),p=t.gust==="leaves"?o.range(.1,.18):0;for(let m=0;m<c;m++){const b=o()<p;f.set([o(),Z(.5+o.gauss()*.2,0,1),Z(.5+o.gauss()*.22,0,1),o()],m*4);const C=t.gust==="leaves"?b?o.range(.3,.44):o.range(.17,.4):t.gust==="blossom"?o.range(.17,.33):o.range(.17,.3);d.set([b?1:0,C,o(),o()*T],m*4)}const w=t.gust==="leaves"?["#D98A3A","#a8401c","#e3c23a"]:t.gust==="blossom"?["#f6c9d6","#fff1f2","#e89ab4"]:["#f6f4ea","#fffdf2","#e8e2c8"],z={...l,uPts:{value:v},uFlow:{value:0},uFlut:{value:o()*10},uShiver:{value:0},uTime:{value:0},uL0:{value:n?u:107},uLtot:{value:u},uWide:{value:n?n.wide:1},uShape:{value:t.gust==="leaves"?0:t.gust==="blossom"?1:2},uLeafA:{value:D(w[0],.8)},uLeafB:{value:D(w[1],.8)},uLeafC:{value:D(w[2],.8)},uPage:{value:D("#efeadb",.82)},uSelf:{value:t.gust==="leaves"?t.look==="night"?.5:.08:t.look==="night"?.95:.22}},M=new a.ShaderMaterial({uniforms:z,side:a.DoubleSide,vertexShader:`
      ${L}
      attribute vec4 aA, aB;
      uniform vec3 uPts[${m0}]; uniform float uFlow, uFlut, uShiver, uTime, uL0, uLtot, uShape, uWide;
      varying vec2 vUv; varying vec4 vInfo; varying vec3 vNrm; varying float vDist;
      vec3 curveAt(float f) {
        f = clamp(f, 0.0, ${(m0-1).toFixed(1)} - 0.001); int i = int(floor(f)); float t = f - float(i);
        vec3 p0 = uPts[max(i - 1, 0)], p1 = uPts[i], p2 = uPts[min(i + 1, ${m0-1})], p3 = uPts[min(i + 2, ${m0-1})];
        return 0.5 * ((2.0 * p1) + (-p0 + p2) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t + (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t * t * t);
      }
      void main() {
        float s = mod(aA.x * uL0 + uFlow * (0.75 + 0.5 * aA.w), uLtot);
        float f = s / ${j0.toFixed(1)};
        vec3 c = curveAt(f), T = normalize(curveAt(f + 0.15) - c + vec3(0.0, 0.0, -1e-4));
        vec3 side = normalize(cross(T, vec3(0.0, 1.0, 0.0))), upv = cross(side, T);
        float env = smoothstep(0.0, 14.0, s) * (1.0 - smoothstep(uLtot - 30.0, uLtot, s));
        float w = mix(4.0, 11.0, smoothstep(0.0, 40.0, s)) * (1.0 - 0.45 * smoothstep(uLtot - 90.0, uLtot, s)) * uWide;
        float ph = aB.w;
        c += side * ((aA.y - 0.5) * 2.0 * w + sin(s * 0.07 + ph) * 1.6) + upv * ((aA.z - 0.5) * 1.1 * w + cos(s * 0.05 + ph * 1.7) * 1.2);
        c += vec3(sin(uTime * 17.0 + ph * 5.0), cos(uTime * 13.0 + ph * 3.0), sin(uTime * 15.0 + ph)) * 0.06 * uShiver;
        float A = ph + uFlut * (1.2 + 2.2 * aA.w), B = ph * 2.3 + uFlut * (0.6 + 1.3 * fract(aA.w * 7.0));
        float dc = distance(c, cameraPosition);
        float sz = aB.y * env * smoothstep(1.2, 6.0, dc), asp = aB.x > 0.5 ? 0.72 : (uShape > 1.5 ? 1.0 : 0.8);
        if (uShape > 0.5) { sz = max(sz, dc * 0.0042 * env); sz = min(sz, 0.035 + (uShape > 1.5 ? 0.02 : 0.022) * dc); }   // petals and seed hold a few pixels far off (the ribbon reads as a band) and never loom at the lens
        vec3 v = vec3(position.x * sz * asp, position.y * sz, 0.0), nn = vec3(0.0, 0.0, 1.0);
        float ca = cos(A), sa = sin(A), cb = cos(B), sb = sin(B);
        v = vec3(v.x, v.y * ca - v.z * sa, v.y * sa + v.z * ca); nn = vec3(nn.x, nn.y * ca - nn.z * sa, nn.y * sa + nn.z * ca);
        v = vec3(v.x * cb + v.z * sb, v.y, -v.x * sb + v.z * cb); nn = vec3(nn.x * cb + nn.z * sb, nn.y, -nn.x * sb + nn.z * cb);
        vec3 wp = c + v; vNrm = nn; vUv = position.xy; vInfo = vec4(sunVis(wp), aB.x, aB.z, wp.y);
        vec4 mv = viewMatrix * vec4(wp, 1.0); vDist = -mv.z; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      ${L}
      uniform vec3 uLeafA, uLeafB, uLeafC, uPage; uniform float uShape, uSelf;
      varying vec2 vUv; varying vec4 vInfo; varying vec3 vNrm; varying float vDist;
      void main() {
        vec3 col; float rib = 0.0;
        if (vInfo.y > 0.5) { col = uPage * (0.92 + 0.08 * step(0.5, fract(vUv.y * 9.0))); }
        else if (uShape < 0.5) {
          float yy = vUv.y, wdt = 0.9 * sqrt(max(1.0 - yy * yy, 0.0)) * (0.72 + 0.28 * cos(yy * 9.0 + vInfo.z * 20.0)) * (0.6 + 0.4 * smoothstep(-1.0, 0.2, yy));
          if (abs(vUv.x) > wdt) discard;
          rib = band(vUv.x, 0.05, 0.03);
          col = vInfo.z < 0.45 ? mix(uLeafA, uLeafB, vInfo.z / 0.45) : mix(uLeafA, uLeafC, (vInfo.z - 0.45) / 0.55);
          col *= 1.0 - 0.3 * rib;
        } else if (uShape < 1.5) {
          vec2 q = vUv * vec2(1.15, 1.0); if (dot(q, q) > 1.0 - 0.25 * smoothstep(0.5, 1.0, vUv.y) * band(vUv.x, 0.18, 0.1)) discard;
          col = mix(mix(uLeafA, uLeafB, vInfo.z), uLeafC, (1.0 - smoothstep(-1.0, -0.2, vUv.y)) * 0.6);
          col = mix(col, uLeafC * vec3(1.0, 0.62, 0.72), (1.0 - smoothstep(0.0, 0.6, length(q - vec2(0.0, -0.35)))) * 0.75) * (0.82 + 0.26 * vUv.y + 0.12 * vUv.x * vUv.x);   // a deeper pink heart, a cupped petal
        } else {
          vec2 pu = vUv - vec2(0.0, 0.3); float r = length(pu) / 0.7, a = atan(pu.y, pu.x + 1e-4);                 // a pappus above a thin stalk and seed
          float soft = (1.0 - smoothstep(0.35, 1.0, r)) * (0.45 + 0.55 * band(fract(a * 2.23) - 0.5, 0.2, 0.2));
          float stalk = band(vUv.x, 0.035, 0.03) * step(vUv.y, 0.3) * step(-0.95, vUv.y);
          float pap = max(soft * 0.75, stalk);
          if (pap < h12(gl_FragCoord.xy + vInfo.z * 91.0) * 0.8 + 0.12) discard;                                // dithered: a soft tuft, not a hard asterisk
          col = mix(uLeafA, uLeafB, vInfo.z) * mix(1.0, 0.3, stalk);
        }
        vec3 N = normalize(vNrm); float nl = abs(dot(N, uSunDir));
        vec3 lit = col * (uAmbCol * (0.75 + 0.25 * abs(N.y)) + uSunCol * vInfo.x * ((0.35 + 0.65 * nl) * 1.1 + (uShape > 0.5 ? 0.5 : 0.0)) + uFlashCol * uFlash.w * 0.5 + uSelf);
        gl_FragColor = vec4(applyFog(lit, vDist), 1.0);
      }`}),h=new a.Mesh(e0(c,{aA:f,aB:d}),M);return h.frustumCulled=!1,h.name="gust",{object:h,U:z,curve:r}}function Se(o,l,t){const e=[],n=[],s=[],r=[],u=[],v=[],c=new a.Vector3(t.bolt.x,35.2,t.bolt.z),f=34,d=(m,b,C,k,i)=>{const x=e.length/3,S=b.clone().sub(m).normalize();for(const[G,W]of[[m,C],[b,k]])for(const j of[-1,1])e.push(G.x,G.y,G.z),n.push(S.x,S.y,S.z),s.push(j),r.push(W),u.push(i);v.push(x,x+1,x+2,x+1,x+3,x+2)},p=(m,b,C,k,i,x)=>{let S=m.clone(),G=b;const W=Math.max(3,Math.round(C/1.1));for(let j=0;j<W;j++){const x0=C/W,E=S.clone().addScaledVector(k,x0).add(new a.Vector3(o.gauss(),o.gauss()*.4,o.gauss()).multiplyScalar(x0*.42));E.x=Z(E.x,t.bolt.x-4.3,t.bolt.x+4.3),E.z=Z(E.z,t.bolt.z-4.3,t.bolt.z+4.3),E.y=Math.max(E.y,1.5);const y0=G+S.distanceTo(E)/f*(x?.8:.93);if(d(S,E,G,y0,i*(x?1-.6*j/W:1)),x<2&&o()<(x?.2:.42)&&E.y>4){const o0=o()*T,S0=new a.Vector3(Math.cos(o0)*.8,-o.range(.25,.9),Math.sin(o0)*.8).normalize();p(E,y0,o.range(3,10)*(x?.5:1),S0,i*.55,x+1)}if(S=E,G=y0,S.y<=1.55)break}};p(c,0,36.5,new a.Vector3(o.range(-.06,.06),-1,o.range(-.06,.06)).normalize(),1,0);const w=new a.BufferGeometry;w.setAttribute("position",new a.Float32BufferAttribute(e,3)),w.setAttribute("aDir",new a.Float32BufferAttribute(n,3)),w.setAttribute("aSide",new a.Float32BufferAttribute(s,1)),w.setAttribute("aG",new a.Float32BufferAttribute(r,1)),w.setAttribute("aW",new a.Float32BufferAttribute(u,1)),w.setIndex(v),w.boundingSphere=new a.Sphere(new a.Vector3(t.bolt.x,18,t.bolt.z),26);const z={...l,uGrow:{value:.03},uI:{value:.5},uCol:{value:D(V[5])},uTime:{value:0}},M=new a.ShaderMaterial({uniforms:z,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,vertexShader:`
      attribute vec3 aDir; attribute float aSide, aG, aW; uniform float uTime;
      varying float vS, vG, vW;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0); vec3 t = normalize((modelViewMatrix * vec4(aDir, 0.0)).xyz);
        vec2 nrm = normalize(vec2(-t.y, t.x) + vec2(1e-5, 0.0));
        float w = max(0.55 * aW + 0.1, -mv.z * 0.0035);
        mv.xy += nrm * aSide * w; vS = aSide; vG = aG; vW = aW;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform float uGrow, uI; uniform vec3 uCol; varying float vS, vG, vW;
      void main() {
        if (vG > uGrow) discard;
        float x = abs(vS), core = 1.0 - smoothstep(0.0, 0.22, x), halo = (1.0 - x) * (1.0 - x);
        float tip = 1.0 - smoothstep(0.0, 0.07, uGrow - vG);
        float I = uI * (0.7 + 0.3 * vW) + tip * 2.2 * step(uGrow, 0.995);
        gl_FragColor = vec4((vec3(1.0, 0.97, 1.0) * core * 3.2 + uCol * halo * 1.1) * I, 1.0);
      }`}),h=new a.Mesh(w,M);return h.renderOrder=4,h.name="bolt",{object:h,U:z}}function Fe(o,l,t){const e=[];for(const[c,f]of t.shelfRuns)for(const d of t.shelfY)for(let p=c+1;p<=f-1;p+=3)e.push([28.75,d,p+o.range(-.3,.3),o()]);const n=e.length,s=new Float32Array(n*4);e.forEach((c,f)=>s.set(c,f*4));const r={...l,uFront:{value:0},uTime:{value:0},uDust:{value:D(V[6],1.1)},uJarGlow:{value:t.jarGlow}},u=new a.ShaderMaterial({uniforms:r,transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 aP; uniform float uFront, uTime; varying vec2 vUv; varying vec3 vInfo; varying float vDist;
      void main() {
        vec3 c = aP.xyz; vec3 toC = cameraPosition - c; vec2 sd = normalize(vec2(toC.z, -toC.x) + vec2(1e-5, 0.0));
        vec3 wp = c + vec3(sd.x, 0.0, sd.y) * position.x * 1.0 + vec3(0.0, (position.y + 1.0) * 1.35, 0.0);
        float wake = max(uFront - (335.0 - c.z), 0.0);
        vInfo = vec3(aP.w, wake * 0.32 + uTime * 0.12, smoothstep(0.0, 14.0, wake)); vUv = position.xy;
        vec4 mv = viewMatrix * vec4(wp, 1.0); vDist = -mv.z; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      ${L}
      uniform vec3 uDust; uniform float uJarGlow; varying vec2 vUv; varying vec3 vInfo; varying float vDist;
      void main() {
        float y = vUv.y * 0.5 + 0.5, x = vUv.x;                  // y 0..1 up the jar
        float dq = max(y - 0.62, 0.0) / 0.33; float hw = 0.78 * sqrt(max(1.0 - dq * dq, 0.0));
        float knob = band(length(vec2(x, (y - 0.975) * 2.7)), 0.085, 0.02);
        float inside = (1.0 - smoothstep(hw - 0.02, hw + 0.02, abs(x))) * step(0.04, y) * step(y, 0.96);
        float basePl = band(y - 0.02, 0.022, 0.006) * band(x, 0.92, 0.02);
        float edge = inside * smoothstep(hw - 0.2, hw, abs(x));
        float streak = inside * band(x + 0.45 * hw / 0.78, 0.05, 0.04) * smoothstep(0.1, 0.3, y) * (1.0 - smoothstep(0.6, 0.85, y));
        // the little wind: a funnel of streaks
        float fy = clamp((y - 0.07) / 0.72, 0.0, 1.0), fw = 0.07 + 0.34 * pow(fy, 1.6) + 0.02 * sin(fy * 9.0 + vInfo.y);
        float cx = x - 0.07 * sin(fy * 5.0 + vInfo.y * 0.7 + vInfo.x * 6.0);
        float fun = (1.0 - smoothstep(fw * 0.55, fw, abs(cx))) * step(0.07, y) * (1.0 - smoothstep(0.7, 0.82, y));
        float sw = 0.55 + 0.45 * sin(fy * 26.0 - cx / max(fw, 0.02) * 2.2 - vInfo.y * 9.0 + vInfo.x * 30.0);
        float dust = fun * (0.35 + 0.65 * sw) * (0.5 + 0.5 * vInfo.z);
        vec3 lightC = uAmbCol + uFlashCol * uFlash.w * 0.3;
        vec3 col = max(uSkyCol, vec3(0.35, 0.4, 0.5)) * (edge * 0.8 + streak * 1.1) * (0.5 + 0.5 * lightC) + uDust * dust * ((0.6 + lightC) * 0.75 + uJarGlow * (0.6 + 0.4 * vInfo.z));
        float a = clamp(inside * 0.07 + edge * 0.3 + streak * 0.6 + dust * 0.85, 0.0, 1.0);
        col = mix(col, uBrassCol * lightC * 0.9, max(basePl, knob)); a = max(a, max(basePl, knob));
        if (a < 0.01) discard;
        float f = 1.0 - exp(-uFogDen * uFogDen * vDist * vDist);
        gl_FragColor = vec4(mix(col, uFogCol * a, f), a);
      }`}),v=new a.Mesh(e0(n,{aP:s}),u);return v.frustumCulled=!1,v.renderOrder=2,v.name="bell-jars",{object:v,U:r,count:n}}function ae(o,l,t){return new a.ShaderMaterial({uniforms:{...o,...l},transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,defines:t?{FREE:1}:{},vertexShader:`
      attribute vec4 aA; attribute vec2 aB;
      uniform float uT; uniform vec3 uC;
      varying vec2 vUv; varying vec4 vInfo; varying vec3 vP; varying float vDist, vSize;
      void main() {
        float size = aB.x * (1.0 + 0.08 * sin(uT * 0.6 + aA.w * 40.0)); vSize = size;
        #ifdef FREE
          vec3 c = uC + aA.xyz + vec3(sin(uT * 0.4 + aA.w * 20.0), cos(uT * 0.33 + aA.w * 9.0), 0.0) * 0.5;
          vec4 mv = viewMatrix * vec4(c, 1.0); mv.xy += position.xy * size;
          vInfo = vec4(0.75 + 0.25 * aA.y / 4.0, 99.0, aA.w, aB.y);
        #else
          float r = aA.x, th = aA.y + uT * 5.2 / pow(max(r, 10.0), 0.72);
          vec3 c = uC + vec3(cos(th) * r, sin(th) * r, -46.0 + aA.z * 7.5 + aA.w * 3.0);
          vec4 mv = viewMatrix * vec4(c + vec3(position.xy * size, 0.0), 1.0);
          vInfo = vec4(aA.z / 8.0, r, aA.w, aB.y);
        #endif
        vP = c; vUv = position.xy; vDist = -mv.z; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      ${L}
      uniform vec4 uFl[3]; uniform float uCloudLit, uT; uniform vec3 uGold, uC, uArm;
      varying vec2 vUv; varying vec4 vInfo; varying vec3 vP; varying float vDist, vSize;
      void main() {
        float d = length(vUv), n = vn2(vUv * 2.1 + vInfo.z * 37.0) * 0.65 + vn2(vUv * 5.3 - vInfo.z * 11.0) * 0.35;
        float a = 1.0 - smoothstep(0.25, 1.0, d + (n - 0.5) * 0.7);
        a *= 1.0 - smoothstep(0.82, 1.0, d);                                                         // the quad edge never shows
        #ifdef FREE
          a *= smoothstep(2.0, 9.0, vDist);
        #else
          vec3 fp = vP + vec3(vUv * vSize, 0.0);
          a *= smoothstep(11.6, 16.5, length(fp.xy - uC.xy) + (n - 0.5) * 3.0);                      // nothing hangs inside the eye
          a *= smoothstep(3.0, 16.0, length(fp - cameraPosition));                                   // and nothing is sliced by the lens
        #endif
        if (a < 0.01) discard;
        float lit = clamp(0.5 + 0.6 * dot(vUv, vec2(-0.5, 0.85)) + (n - 0.5) * 0.8, 0.0, 1.0);
        float depth = vInfo.x, bnd = 1.0, gr = 0.0, isCore = step(1.5, vInfo.w), vary = vInfo.w - 2.0 * isCore;
        #ifndef FREE
          // spiral rain bands, the same on every layer: a lit crest and a dark trough winding in to the eye (self-similar, so they read at any range)
          vec2 hd = fp.xy - uC.xy; float hr = max(length(hd), 1.0), ha = atan(hd.y, hd.x + (abs(hd.x) < 1e-4 ? 1e-4 : 0.0));
          float ph = uArm.z * ha + uArm.y * log(hr) - uT * 0.42 + uArm.x + (n - 0.5) * 0.8;
          float bs = max(isCore, 1.0 - smoothstep(40.0, 70.0, hr));                                   // the core, and the wound-up inner ends of the arms; further out the real arms and their gaps do this
          bnd = mix(1.0, smoothstep(-0.5, 0.45, sin(ph)), bs);
          a *= mix(1.0, mix(mix(0.5, 0.04, isCore), 1.0, smoothstep(-0.9, -0.35, sin(ph))), bs * smoothstep(0.05, 0.4, depth));   // the troughs open onto the layers below
          if (a < 0.01) discard;
          gr = exp(-max(hr - 10.0, 0.0) / 24.0);
        #endif
        vec3 dark = mix(vec3(0.02, 0.03, 0.07), vec3(0.2, 0.25, 0.37), depth), bright = mix(vec3(0.2, 0.26, 0.4), vec3(0.98, 0.97, 0.95), depth);
        vec3 col = mix(dark, bright, smoothstep(0.2, 0.95, lit)) * (0.85 + 0.3 * vary) * uCloudLit * mix(0.2, 1.18, bnd);
        col += uGold * min(uEye, 1.3) * 0.62 * gr * (1.3 - depth) * (0.3 + 0.7 * lit) * mix(0.2, 1.0, bnd);   // the eye's gold on the inner bowl
        for (int i = 0; i < 3; i++) { vec2 q = vP.xy - uFl[i].xy; col += uFlashCol * uFl[i].z * exp(-dot(q, q) / (uFl[i].w * uFl[i].w)) * (0.25 + 1.0 * n) * mix(1.25, 0.6, depth) * mix(0.12, 1.0, bnd); }   // lightning inside the cloud: it lights the crests and leaves the troughs dark
        a *= 0.9;
        float f = 1.0 - exp(-uFogDen * uFogDen * vDist * vDist);
        gl_FragColor = vec4(mix(col, uFogCol, f) * a, a);
      }`})}function Ae(o,l,t,e){const n=Math.round(2500*e),s=new Float32Array(n*4),r=new Float32Array(n*2),u=[],v=t.arms,c=o.range(1.2,1.8),f=o()*T;for(let m=0;m<n;m++){let b=Math.min(8,Math.floor(o()*9));const C=b>=7;let k,i,x=2;const S=o();S<.14?(k=11.5+9*o(),i=o()*T):S<.24?(k=18+26*Math.pow(o(),1.3),i=o()*T):(x=0,k=16+(C?96:88)*Math.pow(o(),.8),i=f+Math.floor(o()*v)*T/v-c*Math.log(k/12)+o.gauss()*.08*(1+14/k)),b=Math.min(b,Math.floor(4.6+(k-11.5)/7+o()*1.2));const G=Math.min((3.4+k*.085)*o.range(.8,1.3),(k-7.5)/.72);u.push([k,i,b,o(),Math.min(G,C?Math.max(4,117-k):Math.max(4,110-k)),o()+x])}u.sort((m,b)=>m[2]*7.5+m[3]*3-(b[2]*7.5+b[3]*3)),u.forEach((m,b)=>{s.set([m[0],m[1],m[2],m[3]],b*4),r.set([m[4],m[5]],b*2)});const d={uT:{value:4+o()*10},uC:{value:U.clone()},uFl:{value:[new a.Vector4(0,0,0,30),new a.Vector4(0,0,0,30),new a.Vector4(0,0,0,30)]},uCloudLit:{value:t.cloudLit},uGold:{value:new a.Color(1.5,1.12,.6)},uArm:{value:new a.Vector3(o()*T,12,v)},uTb:{value:[new a.Vector4(0,0,0,0),new a.Vector4(2,0,0,0),new a.Vector4(4,0,0,0)]},uViolet:{value:D(V[5])},uTun:{value:t.look==="night"?.42:1}},p=new a.Mesh(e0(n,{aA:s,aB:r}),ae(l,d,!1));p.frustumCulled=!1,p.renderOrder=1,p.name="hurricane";const w=new a.Mesh(new a.CircleGeometry(113,64),new a.ShaderMaterial({uniforms:{...l,...d},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${L}
      uniform float uCloudLit; varying vec3 vW;
      void main() { vec2 d = vW.xy - vec2(0.0, 120.0); vec3 c = (vec3(0.035, 0.05, 0.085) + 0.05 * hurrFlat(d)) * uCloudLit + vec3(1.0, 0.75, 0.42) * uEye * 0.6 * exp(-length(d) / 10.0);
        gl_FragColor = vec4(applyFog(c, length(cameraPosition - vW)), 1.0); }`}));w.position.set(U.x,U.y,U.z-49.6);const z=new a.CylinderGeometry(10.2,11.5,50,40,8,!0);z.rotateX(Math.PI/2);const M=new a.Mesh(z,new a.ShaderMaterial({uniforms:{...l,...d},side:a.BackSide,vertexShader:"varying vec3 vL; varying vec3 vW; void main(){ vL = position; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${L}
      uniform float uT, uCloudLit, uTun; uniform vec4 uTb[3]; uniform vec3 uGold, uViolet; varying vec3 vL; varying vec3 vW;
      float adiff(float a, float b) { float d = a - b; return d - 6.28318 * floor(d / 6.28318 + 0.5); }
      void main() {
        float z = vL.z, ang = atan(vL.y, vL.x + (abs(vL.x) < 1e-4 ? 1e-4 : 0.0)), a = ang + z * 0.07 + uT * 0.25;
        float k = clamp((z + 25.0) / 50.0, 0.0, 1.0);                                                // 0 at the portal, 1 at the mouth
        vec3 q = vec3(cos(a) * 2.2, sin(a) * 2.2, z * 0.11 - uT * 0.3);
        float n = vn3(q) * 0.55 + vn3(q * 2.7 + 3.1) * 0.3 + vn3(q * 6.9 + 1.7) * 0.15;
        float spiral = 0.5 + 0.5 * sin(ang * 3.0 + z * 0.35 - uT * 0.9 + (n - 0.5) * 5.0);
        float rib = smoothstep(0.25, 0.8, spiral);                                                  // three cloud bands winding down the wall
        vec3 gold = uGold * (0.03 + 0.9 * n * n * n) * (0.22 + 0.78 * rib) * (0.35 + 0.65 * min(uEye, 1.2)) * mix(2.2, 0.2, k);
        vec3 shade = mix(vec3(0.10, 0.085, 0.07), vec3(0.07, 0.066, 0.115), k) * (0.25 + 0.75 * n) * (0.4 + 0.6 * rib) * max(uCloudLit, 0.45);
        vec3 c = gold + shade;
        c += uGold * 0.5 * exp(-(z + 25.0) / 4.0) * min(uEye, 1.2);
        c *= uTun;                                                                                  // the night look's exposure and bloom are higher: keep the wall below the portal ring                                  // the lit rim where the wall meets the portal
        vec3 lip = vec3(0.74, 0.77, 0.83) * uCloudLit * (0.55 + 0.45 * n) + uGold * min(uEye, 1.3) * 0.42 * (0.45 + 0.55 * n);
        c = mix(c, lip, smoothstep(17.5, 25.0, z + (n - 0.5) * 7.0));                                  // the mouth feathers into the eyewall cloud, no hard rim
        float px = length(fwidth(vL.xy)) / max(length(vL.xy), 1.0) * 10.8, bsum = 0.0;              // one pixel, in the bolts' own units (taken before the loop)
        for (int i = 0; i < 3; i++) {                                                               // violet lightning running along the wall
          float sd = uTb[i].z, zz = z + 25.0;
          float wob = (vn2(vec2(zz * 0.21, sd)) - 0.5) * 1.5 + (vn2(vec2(zz * 0.9, sd + 7.0)) - 0.5) * 0.36 + (vn2(vec2(zz * 2.7, sd + 3.0)) - 0.5) * 0.1;
          float d0 = abs(adiff(ang, uTb[i].x + wob)) * 10.8;
          float fork = smoothstep(0.0, 9.0, zz - uTb[i].w) * 0.55 + (vn2(vec2(zz * 1.3, sd + 19.0)) - 0.5) * 0.2;
          float d1 = abs(adiff(ang, uTb[i].x + wob + fork * (fract(sd * 3.7) > 0.5 ? 1.0 : -1.0))) * 10.8 + 30.0 * (1.0 - step(uTb[i].w, zz));
          float bolt = (1.0 - smoothstep(max(0.1, 2.0 * px), max(0.34, 4.5 * px), d0)) * 5.0 + exp(-d0 * 2.2) * 0.5 + exp(-d0 * 0.6) * 0.1 + (1.0 - smoothstep(max(0.07, 1.5 * px), max(0.24, 3.5 * px), d1)) * 3.0 + exp(-d1 * 2.6) * 0.3;
          bsum += uTb[i].y * (bolt * smoothstep(0.0, 4.0, zz) + 0.06 * (0.3 + 0.7 * n));
        }
        c += uViolet * min(bsum, 2.6);
        gl_FragColor = vec4(applyFog(c, length(cameraPosition - vW)), 1.0);
      }`}));M.position.set(U.x,U.y,U.z-25);const h=new a.Group;return h.add(w,M,p),{object:h,U:d}}function Pe(o,l){const t={...o,uClock:{value:0},uGain:{value:l.look==="night"?.3:l.look==="afternoon"?.42:.34},uPale:{value:l.look==="night"?.55:.12}},e=new a.ShaderMaterial({uniforms:t,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,vertexShader:"varying vec2 vP; varying vec3 vW; void main(){ vP = position.xy; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
      ${L}
      uniform float uClock, uGain, uPale; varying vec2 vP; varying vec3 vW;
      vec3 spec(float t) { return vec3(smoothstep(0.38, 0.8, t) + 0.45 * (1.0 - smoothstep(0.0, 0.22, t)), clamp(1.0 - abs(t - 0.52) * 2.7, 0.0, 1.0), 1.0 - smoothstep(0.12, 0.6, t)); }
      void main() {
        vec2 q = vec2(vP.x, vP.y + 6.0);                          // the arc's centre is on the floor
        float r = length(q), aa = fwidth(r) * 1.5 + 0.02;
        float t = (r - 8.3) / 1.7, t2 = (6.9 - r) / 0.8;
        float arc = smoothstep(0.0, 0.16 + aa, t) * (1.0 - smoothstep(0.84 - aa, 1.0, t));
        float inner = smoothstep(0.0, 0.25, t2) * (1.0 - smoothstep(0.75, 1.0, t2)) * 0.22;
        float mist = 0.55 + 0.45 * vn2(vec2(q.x * 0.45 + 3.0, q.y * 0.35 - uClock * 0.5)) * (0.7 + 0.3 * vn2(vec2(q.x * 1.7, q.y * 1.3 - uClock * 1.1)));
        vec3 c = mix(spec(clamp(t, 0.0, 1.0)), vec3(0.8, 0.86, 1.0), uPale) * arc + mix(spec(clamp(1.0 - t2, 0.0, 1.0)), vec3(0.8, 0.86, 1.0), 0.4) * inner;
        c += vec3(0.5, 0.56, 0.66) * 0.1 * (1.0 - smoothstep(0.0, 3.2, q.y)) * (1.0 - smoothstep(8.6, 10.4, abs(q.x))) * mist;      // the mist rising from the trough
        float foot = smoothstep(0.1, 2.4, q.y);
        float d = length(cameraPosition - vW), f = exp(-uFogDen * uFogDen * d * d);
        gl_FragColor = vec4(c * uGain * mist * foot * f * smoothstep(4.0, 14.0, d) * (1.0 + 0.6 * uFlash.w * 0.2), 1.0);
      }`}),n=new a.Mesh(new a.PlaneGeometry(22,12),e);return n.position.set(l.rainbow.x,6,l.rainbow.z),n.renderOrder=5,n.name="rainbow",{object:n,U:t}}function Ge(o,l,t){const n=new Float32Array(280),s=new Float32Array(140),r=[];for(let b=0;b<70;b++){const C=o()*T,k=Math.sqrt(o())*5.5,i=o.range(0,1);r.push([Math.cos(C)*k,i*i*4.2*(1-k/8),Math.sin(C)*k*.8,o(),o.range(1.8,3.4)*(1-.3*i),o()])}r.forEach((b,C)=>{n.set(b.slice(0,4),C*4),s.set(b.slice(4),C*2)});const u={uT:{value:0},uC:{value:new a.Vector3(8,22,200)},uFl:t.uFl,uCloudLit:{value:Math.max(t.uCloudLit.value,.45)*1.05},uGold:{value:new a.Color(0,0,0)},uArm:{value:new a.Vector3(0,13,2)}},v=new a.Mesh(e0(70,{aA:n,aB:s}),ae(l,u,!0));v.frustumCulled=!1,v.renderOrder=5;const c=260,f=new Float32Array(c*4);for(let b=0;b<c;b++){const C=o()*T,k=Math.sqrt(o())*2;f.set([Math.cos(C)*k,o(),Math.sin(C)*k,o()],b*4)}const d=new a.ShaderMaterial({uniforms:{...l,...u},transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      attribute vec4 aP; uniform float uT; uniform vec3 uC; varying vec2 vUv; varying float vK;
      void main() {
        float h = uC.y - 0.5, k = fract(aP.y - uT * (0.75 + 0.3 * aP.w));
        vec3 c = vec3(uC.x + aP.x, k * h, uC.z + aP.z); vK = k;
        vec4 mv = viewMatrix * vec4(c, 1.0); vec3 upv = (viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz;
        mv.xyz += vec3(position.x * max(0.045, -mv.z * 0.0016), 0.0, 0.0) + upv * position.y * 0.8;
        vUv = position.xy; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      ${L}
      varying vec2 vUv; varying float vK;
      void main() { float a = (1.0 - abs(vUv.x)) * (1.0 - vUv.y * vUv.y) * smoothstep(0.0, 0.08, vK); gl_FragColor = vec4((max(uSkyCol, vec3(0.3, 0.36, 0.48)) * 0.95 + uAmbCol * 0.5) * a * (1.0 - smoothstep(0.9, 1.0, vK)), 1.0); }`}),p=new a.Mesh(e0(c,{aP:f}),d);p.frustumCulled=!1,p.renderOrder=4;const w=46,z=new Float32Array(w*4);for(let b=0;b<w;b++){const C=o()*T,k=Math.sqrt(o())*2.2;z.set([Math.cos(C)*k,Math.sin(C)*k,o(),o.range(.35,.8)],b*4)}const M=new a.ShaderMaterial({uniforms:{...l,...u},transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      attribute vec4 aP; uniform float uT; uniform vec3 uC; varying vec2 vUv; varying float vPh;
      void main() {
        vPh = fract(aP.z + uT * (0.9 + 0.7 * fract(aP.z * 7.13)));
        vec3 c = vec3(uC.x + aP.x, 0.06, uC.z + aP.y) + position * aP.w * (0.2 + 1.5 * vPh);
        vUv = position.xz; gl_Position = projectionMatrix * viewMatrix * vec4(c, 1.0);
      }`,fragmentShader:`
      ${L}
      varying vec2 vUv; varying float vPh;
      void main() {
        float r = length(vUv), ring = band(r - 0.8, 0.1, 0.08) + 0.5 * band(r - 0.42, 0.07, 0.06) * step(0.3, vPh);
        gl_FragColor = vec4((max(uSkyCol, vec3(0.3, 0.36, 0.48)) * 1.1 + uAmbCol * 0.5) * ring * (1.0 - vPh) * (1.0 - vPh), 1.0);
      }`}),h=new a.Mesh(e0(w,{aP:z},!0),M);h.frustumCulled=!1,h.renderOrder=2;const m=new a.Group;return m.add(h,p,v),{object:m,U:u}}const a0=[];for(let o=0;o<13;o++)a0.push([0,340-20*o,17,3,40,0]);a0.push([0,0,15,15,220,1]);for(const o of[-130,-180,-230])a0.push([0,o,92,7,240,0]);function We(o,l){const t=a0.length,e=new Float32Array(t*4),n=new Float32Array(t*2);a0.forEach((f,d)=>{e.set([f[0],f[1],f[2],f[3]],d*4),n.set([f[4],f[5]],d*2)});const s=new a.InstancedBufferGeometry,r=new a.BoxGeometry(2,2,2);s.index=r.index,s.setAttribute("position",r.attributes.position),s.setAttribute("aC",new a.InstancedBufferAttribute(e,4)),s.setAttribute("aD",new a.InstancedBufferAttribute(n,2)),s.instanceCount=t,s.boundingSphere=new a.Sphere(new a.Vector3,1e5);const u={...o,uGain:{value:l.shaftGain},uTime:{value:0}},v=new a.ShaderMaterial({uniforms:u,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.BackSide,vertexShader:`
      ${L}
      attribute vec4 aC; attribute vec2 aD;
      varying vec3 vW; varying vec4 vC; varying vec2 vD;
      void main() {
        float H = aD.x, y = (position.y * 0.5 + 0.5) * H; vec2 k = uSunDir.xz / max(uSunDir.y, 0.05);
        vec3 w = vec3(aC.x + position.x * aC.z, y, aC.y + position.z * aC.w); w.xz -= k * (H - y);
        vW = w; vC = aC; vD = aD; gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,fragmentShader:`
      ${L}
      uniform float uGain, uTime;
      varying vec3 vW; varying vec4 vC; varying vec2 vD;
      void main() {
        float H = vD.x; vec2 k = uSunDir.xz / max(uSunDir.y, 0.05);
        vec3 ro = cameraPosition, rd = normalize(vW - ro);
        vec3 o = vec3(ro.x + k.x * (H - ro.y), ro.y, ro.z + k.y * (H - ro.y)), d = vec3(rd.x - k.x * rd.y, rd.y, rd.z - k.y * rd.y);
        vec3 c = vec3(vC.x, H * 0.5, vC.y), hs = vec3(vC.z, H * 0.5, vC.w);
        vec3 inv = vec3(safeDiv(1.0, d.x), safeDiv(1.0, d.y), safeDiv(1.0, d.z));
        vec3 ta = (c - hs - o) * inv, tb = (c + hs - o) * inv, tmn = min(ta, tb), tmx = max(ta, tb);
        float t0 = max(max(max(tmn.x, tmn.y), tmn.z), 0.0), t1 = min(min(tmx.x, tmx.y), tmx.z);
        float len = max(t1 - t0, 0.0);
        vec3 mid = o + d * (t0 + t1) * 0.5; vec2 e = hs.xz - abs(mid.xz - c.xz);
        float soft = vD.y > 0.5 ? 1.0 - smoothstep(9.0, 15.0, length(mid.xz - c.xz)) : smoothstep(0.0, 1.3, min(e.x, e.y) + 0.2);
        vec3 mw = ro + rd * (t0 + t1) * 0.5;
        float dust = 0.72 + 0.56 * vn3(mw * 0.16 + vec3(uTime * 0.12, -uTime * 0.22, uTime * 0.08));
        float a = (1.0 - exp(-len * (vD.y > 0.5 ? 0.03 : 0.05) * 40.0 / H)) * soft * dust * mix(0.55, 1.0, clamp(mw.y / H, 0.0, 1.0));
        a *= smoothstep(-352.0, -338.0, mw.z);                       // a low sun's shaft must not cut through the hurricane's eye tunnel
        float dist = length(mw - ro);
        gl_FragColor = vec4(uSunCol * uGain * a / (1.0 + dist / 70.0), 1.0);
      }`}),c=new a.Mesh(s,v);return c.frustumCulled=!1,c.renderOrder=6,c.name="shafts",{object:c,U:u}}function De(o,l,t){const e=Math.round(3600*t),n=new Float32Array(e*4),s=new Float32Array(e*4);for(let c=0;c<e;c++){const f=o(),d=f<.62?a0[Math.floor(o()*13)]:f<.8?a0[13]:a0[14+Math.floor(o()*3)];let p,w;if(d[5]){const h=o()*T,m=Math.sqrt(o())*14;p=Math.cos(h)*m,w=Math.sin(h)*m}else p=o.range(-d[2],d[2])*(d[2]>50?.5:1),w=d[1]+o.range(-d[3],d[3]);const z=d[4]>100?o.range(1,d[4]*(d[5]?.9:.75)):o.range(.5,38),M=d[1]>86?335-d[1]:d[5]?235:470;n.set([p,z,w,d[4]],c*4),s.set([o()*T,o(),M,d[4]>100?o.range(.14,.3):o.range(.05,.11)],c*4)}const r={...l,uFront:{value:0},uTime:{value:0},uPix:{value:.0016}},u=new a.ShaderMaterial({uniforms:r,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:`
      ${L}
      attribute vec4 aP, aQ; uniform float uFront, uTime, uPix; varying vec2 vUv; varying float vB;
      void main() {
        vec2 k = uSunDir.xz / max(uSunDir.y, 0.05);
        vec3 c = aP.xyz; c.xz -= k * (aP.w - c.y);
        float wake = 0.2 + 0.8 * smoothstep(0.0, 26.0, uFront - aQ.z), ph = aQ.x, t = uTime;
        c += wake * vec3(sin(t * 0.31 + ph) + 0.5 * sin(t * 0.83 + ph * 3.0), 0.8 * sin(t * 0.23 + ph * 2.0) + 0.4 * cos(t * 0.7 + ph), cos(t * 0.27 + ph * 1.3) + 0.5 * sin(t * 0.9 + ph)) * (0.5 + aQ.y) * (aP.w > 100.0 ? 2.4 : 0.9);
        vec4 mv = viewMatrix * vec4(c, 1.0);
        float sz = max(aQ.w, -mv.z * uPix); mv.xy += position.xy * sz;
        float tw = 0.75 + 0.25 * sin(t * (0.4 + 2.2 * wake) * (0.6 + aQ.y) + ph * 9.0);
        vB = sunVis(c) * tw * min(1.0, aQ.w / sz + 0.25) * exp(-uFogDen * uFogDen * mv.z * mv.z) * smoothstep(3.0, 10.0, -mv.z);
        vUv = position.xy; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uSunCol; varying vec2 vUv; varying float vB;
      void main() { float r2 = dot(vUv, vUv); if (r2 > 1.0) discard; float a = (1.0 - r2); gl_FragColor = vec4(uSunCol * (0.28 * a * a * vB) + vec3(1.0, 0.9, 0.7) * 0.02 * a * vB, 1.0); }`}),v=new a.Mesh(e0(e,{aP:n,aQ:s}),u);return v.frustumCulled=!1,v.renderOrder=5,v.name="motes",{object:v,U:r}}const p0=31.5;function Be(){const o=[];for(let e=330;e>=100;e-=23)o.push(new a.Vector3(-26,p0,e));const l=Math.atan2(-26,80);for(let e=0;e<=32;e++){const n=l-(T+2*l)*(e/32);o.push(new a.Vector3(Math.sin(n)*85.5,p0,Math.cos(n)*85.5))}for(let e=100;e<=330;e+=23)o.push(new a.Vector3(26,p0,e));for(let e=1;e<6;e++){const n=Math.PI*e/6;o.push(new a.Vector3(Math.cos(n)*26,p0,336+Math.sin(n)*25))}const t=new a.CatmullRomCurve3(o,!0,"centripetal");return t.arcLengthDivisions=800,t}function Te(o){const l=J();l.add(new a.TubeGeometry(o,420,.2,6,!0),2);const t=o.getLength(),e=new a.Vector3,n=new a.Vector3;for(let s=4;s<t;s+=11.5){o.getPointAt(s/t,e),o.getTangentAt(s/t,n);const r=n.z,u=-n.x,v=e.z>86?30-Math.abs(e.x):90-Math.hypot(e.x,e.z),c=(e.z>86?Math.sign(e.x)*r:e.x*r+e.z*u)>0?1:-1,f=Math.min(Math.max(v,.5),6);e.z>333||(l.box(.16,1,.16,e.x,p0+.5,e.z,2),l.add(new a.BoxGeometry(f,.16,.16),2,A(e.x+r*c*f/2,p0+1,e.z+u*c*f/2,0,Math.atan2(-u*c,r*c),0)))}return l.build()}function Ue(o){const l=J(),t=new a.Color(.62,.58,.5),e=new a.Color(.36,.05,.05),n=o.lamp;l.box(2.5,1,9,0,-2.9,0,2),l.box(2.5,.5,9,0,-1.05,0,3,e),l.box(2.3,1.15,8.7,0,-1.85,0,4,n);for(let r=-3;r<=3;r++)l.box(2.56,1.2,.22,0,-1.85,r*1.35,2);for(const r of[-1,1])l.box(2.56,1.2,.5,0,-1.85,4.35*r,2);const s=new a.CylinderGeometry(1.3,1.3,9.2,12,1,!1,0,Math.PI);return s.rotateX(Math.PI/2),s.rotateZ(Math.PI/2),l.add(s,3,A(0,-.82,0,0,0,0,1,.42,1),t),l.box(.2,1,.2,0,-.4,2.6,2),l.box(.2,1,.2,0,-.4,-2.6,2),l.box(.5,.4,1,0,.1,2.6,2),l.box(.5,.4,1,0,.1,-2.6,2),l.add(new a.SphereGeometry(.28,8,6),4,A(0,-2.6,-4.55),n.clone().multiplyScalar(1.6)),l.add(new a.SphereGeometry(.2,8,6),4,A(0,-2.6,4.55),new a.Color(1.6,.15,.1)),l.box(2.6,.18,9.1,0,-3.45,0,3,new a.Color(.05,.05,.05)),l.build()}function qe(o,l){const t=J(),e=J(),n=l.crocus,s=new a.BoxGeometry(3.7,.5,3.7,6,1,6),r=s.attributes.position;for(let u=0;u<r.count;u++)r.getY(u)>0&&r.setY(u,.25+.14*Math.sin(r.getX(u)*2.1)*Math.cos(r.getZ(u)*1.7));s.computeVertexNormals(),t.add(s,3,A(n.x,1.3,n.z),new a.Color(.86,.9,.96));for(let u=0;u<14;u++){const v=o.range(-1.4,1.4),c=o.range(-1.4,1.4),f=o.range(.7,1.2),d=o()<.7?new a.Color(.36,.16,.7):new a.Color(.95,.7,.1);e.cyl(.04,.03,f,v,0,c,3,new a.Color(.1,.3,.08),5);const p=new a.ConeGeometry(.24,.6,6,1,!0);p.rotateX(Math.PI),e.add(p,3,A(v,f+.25,c),d),e.add(new a.SphereGeometry(.06,5,4),3,A(v,f+.3,c),new a.Color(1,.6,.05))}return{snow:t.build(),flowers:e.build()}}function Ie(o){const l=o.rng.fork("look389"),t=o.vary||{},e=t.hour||"any",n=l.pick(["noon","noon","afternoon","night"]),s=e==="night"?"night":e==="golden"||e==="dawn"?"afternoon":e==="day"?"noon":n,r={look:s,rare:!!t.rare,density:Z(t.density??1,.7,1.3)};r.shower=l.pick(["rain","rain","rain","snow","hail"]),r.gust=l.pick(["leaves","leaves","leaves","blossom","dandelion"]),r.boltKind=l.pick(["bolt","bolt","bolt","elmo"]),r.trams=r.rare||l.chance(.4)?2:1,r.arms=l.pick([2,2,3]);const u=l.range(-.06,.06);return s==="noon"?Object.assign(r,{sunDir:new a.Vector3(-.17+u,.866,.47).normalize(),sunCol:D("#EEF4FF",3),skyCol:D("#DCE6EE"),skyGain:1.9,amb:new a.Color(.47,.52,.61),fog:D("#E6E9EC",.8),fogDen:9e-4,exposure:1,cloudLit:1,shaftGain:.085,eye:1,lamp:new a.Color(2.4,1.6,.75),hemi:2,dir:3,bloom:.3,heroKey:[1.3,1.14,.9],heroAmb:[.27,.31,.42],heroSky:"#EEF4FF",ground:"#7a7f88",jarGlow:0,warm:0,jarWash:0,flashGain:1,heroSelf:.1}):s==="afternoon"?Object.assign(r,{sunDir:new a.Vector3(-.2+u,.52,.83).normalize(),sunCol:D("#FFAE5E",3.6),skyCol:D("#F6DDB4"),skyGain:1.8,amb:new a.Color(.46,.44,.47),fog:D("#EADDC8",.75),fogDen:.001,exposure:1,cloudLit:.92,shaftGain:.11,eye:1.15,lamp:new a.Color(2.6,1.7,.8),hemi:1.7,dir:3.2,bloom:.34,heroKey:[1.5,1,.6],heroAmb:[.3,.29,.36],heroSky:"#FFE2B8",ground:"#7f7a74",jarGlow:.15,warm:.05,jarWash:0,flashGain:1,heroSelf:.12}):Object.assign(r,{sunDir:new a.Vector3(-.17+u,.866,.47).normalize(),sunCol:D("#D2DCF4",.85),skyCol:D("#2c3854"),skyGain:.4,amb:new a.Color(.09,.1,.135),fog:D("#0c0f16"),fogDen:.0013,exposure:1.35,cloudLit:.3,shaftGain:.22,eye:1.6,lamp:new a.Color(5.6,3.1,1.1),hemi:.55,dir:.8,bloom:.6,heroKey:[.95,.62,.3],heroAmb:[.075,.08,.11],heroSky:"#8090ba",ground:"#2a2c36",jarGlow:1.8,warm:.55,jarWash:.55,flashGain:1.6,heroSelf:.42,fillBase:.74,keyCol:D("#D2DCF4",.21),goldSpill:.3,floorK:.8}),r.keyCol||Object.assign(r,{fillBase:.84,keyCol:r.amb.clone().multiplyScalar(.22),goldSpill:s==="noon"?.1:.14,floorK:1}),r.skyGlow=r.skyCol.clone().multiplyScalar(r.skyGain*1.25),r.bolt={x:-16,z:140},r.shelfRuns=[[176,244],[103,164]],r.shelfY=[3.2,7.4,11.6,15.8,20],r.desk={x:-19,z:268},r.crocus={x:11.5,z:222},r.mini={x:-20.5,z:189},r.rainbow={x:-17.5,z:213},r.edgeGlow=D(V[3],s==="night"?2.3:1.25),r.balloonAtHurricane=l.chance(.3),r}var je={id:"frozen-weather-museum",name:"Museum of Frozen Weather",category:"bizarre",weirdness:.85,media:["interior","air"],async build(o){const l=o.rng,t=o.quality&&o.quality.detail||1,e=Ie(o),n=new a.Scene;n.background=e.fog.clone(),n.fog=new a.FogExp2(e.fog.clone(),e.fogDen);const s=new a.HemisphereLight(e.skyCol.clone().lerp(new a.Color(1,1,1),.3),new a.Color(e.ground),e.hemi),r=new a.DirectionalLight(e.sunCol.clone().multiplyScalar(1/Math.max(e.sunCol.r,e.sunCol.g,e.sunCol.b)),e.dir);r.position.copy(e.sunDir).multiplyScalar(300),n.add(s,r);const u={uSunDir:{value:e.sunDir},uSunCol:{value:e.sunCol},uSkyCol:{value:e.skyCol},uSkyGain:{value:e.skyGain},uAmbCol:{value:e.amb},uFogCol:{value:e.fog},uFogDen:{value:e.fogDen},uFlash:{value:new a.Vector4(e.bolt.x,16,e.bolt.z,0)},uFlashCol:{value:D(V[5],1)},uMarble:{value:D(V[0],.82)},uBrassCol:{value:D(V[3],1.15)},uHurT:{value:0},uEye:{value:e.eye*.5},uBoltPos:{value:new a.Vector3(e.bolt.x,0,e.bolt.z)},uBoltGrow:{value:0},uGlowCol:{value:D(V[5],.3)},uWarm:{value:new a.Vector4(0,22,0,e.warm)},uWarmCol:{value:D(V[6])},uJarWash:{value:e.jarWash},uTime:{value:0},uKeyCol:{value:e.keyCol},uGoldCol:{value:new a.Color(1,.72,.38)},uFillBase:{value:e.fillBase},uGoldSpill:{value:e.goldSpill},uFloorK:{value:e.floorK}},v=await he(o,{palette:V,progress:0,gust:0,floor:!0,floorRadius:90,curb:!1,room:{radius:90,spring:130,top:220,oculus:15},lightDir:e.sunDir.toArray(),balloon:!0,steps:Math.round(56*(t<1?.75:1)),colors:{key:e.heroKey,amb:e.heroAmb,sky:e.heroSky,self:e.heroSelf,room:[e.amb.r/.47,e.amb.g/.52,e.amb.b/.61],...e.look==="night"?{oculus:e.skyGlow.clone().multiplyScalar(2).toArray()}:{}},...e.balloonAtHurricane?{balloonAt:[66,-308],balloonTether:76,balloonScale:1.8,balloonYaw:Math.PI/2}:{}});n.add(v.object),await o.yield();const c=v.anchors.flyThrough,f=[[0,8,335],[0,8,318],[.6,8.4,290],[1.2,9.4,250],[1,10.2,210],[.5,11.2,170],[0,12,138]];for(let g=0;g<6;g++)f.push([c[g].x,c[g].y,c[g].z]);f.push([-52,64,-22],[-36,76,-40],[-16,85.5,-54],[-4,89.3,-66],[0,90,-80],[0,90,-99],[0,92,-135],[0,96.5,-172],[0,109,-232],[0,117.5,-282],[0,120,-326],[0,120,-362],[0,120,-396]);const d=de(f),p=d.length,w=new a.Vector3;let z=245,M=480,h=440;for(let g=0,y=!1,q=!1;g<p;g+=2)d.posAtDist(g,w),!y&&w.z<90&&(z=g,y=!0),y&&!q&&w.z<-91&&(M=g,q=!0);h=M-20;const m=new Float32Array(Math.ceil(p/4)+2);for(let g=1;g<m.length;g++)m[g]=m[g-1]+4*1.12*Z0(30,70,g*4-2);const b=g=>{const y=Z(g/4,0,m.length-1.001),q=Math.floor(y);return R(m[q],m[q+1],y-q)},C=Q0(u),k=new a.Mesh(await we(e,o),C);k.name="museum",k.frustumCulled=!1,n.add(k),await o.yield();for(const g of await ke(l.fork("props"),e,o)){const y=new a.Mesh(g,C);y.name="furniture",y.frustumCulled=!1,n.add(y)}await o.yield();const i=Be(),x=i.getLength(),S=new a.Mesh(Te(i),C);S.frustumCulled=!1,n.add(S),await o.yield();const G=Ue(e),W=[];for(let g=0;g<e.trams;g++)for(let y=0;y<3;y++){const q=new a.Mesh(G,C);q.frustumCulled=!1,n.add(q),W.push({mesh:q,off:g*x*.47-y*9.9,tram:g})}await o.yield();const j=J();j.box(9.6,35.2,9.6,e.bolt.x,18.8,e.bolt.z,7),j.box(3.8,2.6,3.8,e.crocus.x,2.3,e.crocus.z,7),j.box(5.8,11.9,5.8,e.mini.x,7.3,e.mini.z,7);const x0=new a.Mesh(j.build(),Q0(u,!0));x0.renderOrder=3,n.add(x0);const E=qe(l.fork("crocus"),e),y0=new a.Mesh(E.snow,C);n.add(y0);const o0=new a.Mesh(E.flowers,C);o0.position.set(e.crocus.x,1.25,e.crocus.z),n.add(o0),await o.yield();const S0=oe(l.fork("shower"),u,e,t);n.add(S0.object),await o.yield();const w0=te(l.fork("gust"),u,e,t);n.add(w0.object),await o.yield();const D0=oe(l.fork("mini"),u,e,t,{kind:e.shower==="snow"?"hail":"snow",count:700,min:[e.mini.x-2.3,1.4,e.mini.z-2.3],size:[4.6,11.4,4.6],self:e.look==="night"?.55:.1});D0.object.name="snow-case",n.add(D0.object),await o.yield();const V0=Pe(u,e);n.add(V0.object),await o.yield();const b0=te(l.fork("stream"),u,e,t*e.density,{count:1500,wide:.72,ctrl:[[-40,68,-26],[-28,78,-47],[-13,85,-66],[-3,88,-96],[6,91,-126],[10,96,-160],[3,103,-200],[-8,110,-240],[-12,116,-280],[-4,106,-308],...[0,1,2,3,4,5,6,7].map(g=>{const y=-1.9+g*1,q=15.5-1.25*g;return[Math.cos(y)*q,120+Math.sin(y)*q,-318-g*9.4]})]});b0.object.name="leaf-stream",n.add(b0.object),await o.yield();const B0=Se(l.fork("bolt"),u,e);n.add(B0.object),await o.yield();const T0=Fe(l.fork("jars"),u,e);n.add(T0.object),await o.yield();const i0=Ae(l.fork("hurricane"),u,e,t);n.add(i0.object);const u0=e.rare?Ge(l.fork("cumulus"),u,i0.U):null;u0&&n.add(u0.object),await o.yield();const _0=We(u,e);n.add(_0.object),await o.yield();const U0=De(l.fork("motes"),u,t*e.density);n.add(U0.object),await o.yield();const F0={value:0},g0=G0.fxGroup();n.add(g0.object);const H0=g0.add(G0.makeGlows({positions:[[e.bolt.x,17,e.bolt.z],[0,9,0]],colors:[V[5],"#8a4a1a"],sizes:[1,.001],size:16,intensity:1.6,time:F0,rng:l.fork("glow")}));await o.yield(),g0.add(G0.makeSmokeColumn({position:[e.desk.x+1.1,2.6,e.desk.z+.3],height:3.4,radius:[.08,.7],size:[.35,1.3],count:18,color:"#d6dbe2",colorTop:"#f4f6f8",shadowColor:"#9aa2ac",ambient:e.look==="night"?"#30384a":"#a8aeb6",opacity:.32,wind:[.12,0,.05],bend:.3,time:F0,rng:l.fork("steam")})),await o.yield(),g0.add(G0.makeMist({count:Math.round(60*t),area:[230,7,120],center:[0,3.5,-292],size:[20,44],color:e.look==="night"?"#262a36":"#e4e8ee",opacity:.17,drift:[.25,0,1.5],time:F0,rng:l.fork("mist")})),await o.yield();const X=$.makeFauna(n,{light:$.lightFrom(n)});await o.yield();const n0={species:"starlings",form:"loose",lod:"high",size:3.4,speed:9,flap:7,glide:.25,body:"#8a6a48",belly:"#d9cfbc",wingC:"#5e4530",trail:"#7a5c3e",tip:"#2a2018",head:"#6b4a30",beak:"#3a3020",spread:[7,3,7],wander:[2.5,1.6,2.5,.8]},c0=g=>Math.max(2,Math.round(g*e.density*(e.look==="night"?.7:1)));X.add($.makeFlock({...n0,rng:l.fork("sp0"),count:5,spread:[3.5,2,4],wander:[.8,.5,.8,.8],along:{path:d,side:2.2,up:1,lead:13,from:-.05,to:.1,drift:3},keepClear:{path:d,dist:2,each:!0}})),await o.yield(),X.add($.makeFlock({...n0,rng:l.fork("sp1"),count:c0(8),center:[0,17,300],radius:24,height:9,wobble:.5,keepClear:{path:d,dist:2,each:!0}})),await o.yield(),X.add($.makeFlock({...n0,rng:l.fork("sp2"),count:c0(8),center:[e.bolt.x+7,27,e.bolt.z+6],radius:15,height:6,wobble:.5,speed:11})),await o.yield(),X.add($.makeFlock({...n0,rng:l.fork("sp3"),count:c0(10),center:[0,50,0],radius:58,height:22,wobble:.25,speed:16,spread:[5,6,14]})),await o.yield(),X.add($.makeFlock({...n0,rng:l.fork("sp4"),count:c0(14),size:5,center:[4,96,-150],radius:44,height:16,wobble:.4,speed:13,spread:[12,8,16],keepClear:{path:d,dist:2,each:!0}})),await o.yield(),X.add($.makeFlock({...n0,rng:l.fork("sp6"),count:c0(10),size:4.2,center:[0,120,-326],radius:22,height:14,wobble:.5,speed:15,spread:[7,7,7],keepClear:{path:d,dist:2,each:!0}})),await o.yield(),X.add($.makeFlock({...n0,rng:l.fork("sp5"),count:c0(9),size:3.8,center:[0,93,-104],radius:19,height:9,wobble:.45,speed:12,spread:[6,5,6],keepClear:{path:d,dist:2,each:!0}})),await o.yield(),X.add($.makeFlock({species:"swifts",rng:l.fork("swallows"),count:2,size:2.6,center:[0,116,0],radius:72,height:6,wobble:.2,spread:[4,2,8]})),await o.yield(),await o.yield();const F=(g,y,q)=>Z0(g,y,q),ne=g=>F(0,.1,g)*Math.exp(-g/.28),v0=e.boltKind==="elmo",z0=new a.Vector3,A0=new a.Vector3,le=new a.Vector3,se=new a.Vector3(e.bolt.x,15,e.bolt.z),f0=g=>{const y=Math.sin(g*127.1+311.7)*43758.5453;return y-Math.floor(y)};let q0=i0.U.uT.value,O0=l()*100;const re=D(V[5]),Y=512,l0=new Float32Array((Y+1)*3),C0=new Float32Array((Y+1)*3);for(let g=0;g<=Y;g++)i.getPointAt(g%Y/Y,A0),i.getTangentAt(g%Y/Y,z0),A0.toArray(l0,g*3),z0.toArray(C0,g*3);await o.yield();const O=M-3,ie=g=>{const y=g*p;return 1-.1*F(z+10,z+60,y)*(1-F(O-150,O-110,y))+.6*F(O-105,O-70,y)*(1-F(O-12,O+30,y))},ue=new a.Vector3(0,91,-90),ce=new a.Vector3;return{scene:n,path:d,duration:42,pace:ie,camera:{fov:62,near:.3,far:1600,lookAhead:26,sway:.3,bank:0},pois:[{at:se,from:150/p,to:200/p,weight:.3},{at:(g,y)=>le.set(0,R(46,80,F(z-20,h,y*p)),0),from:(z-35)/p,to:(O-62)/p,weight:.8},{at:(g,y)=>ce.lerpVectors(ue,U,F(O-90,O-45,y*p)),from:(h-130)/p,to:(M+90)/p,weight:.85}],portal:{shape:"circle",radius:7,color:"#ffe1a6",glow:1.1,revealDistance:300},post:{exposure:e.exposure,bloom:{strength:e.bloom,radius:.6,threshold:.95},grade:{saturation:1.02,contrast:1.04,tint:e.look==="afternoon"?"#fff6ea":"#f4f7ff",shadowTint:"#0b0e16",vignette:.24,grain:.03,aberration:0}},ride:"none",style:"none",update(g,y,q,K0){const B=Z(K0,0,1)*p,P0=B+40*F(0,120,B),s0=Math.min(Math.max(g,0),.1);F0.value=y,u.uTime.value=y;const I0=F(5,30,B);S0.set(s0*(.05+.95*I0*I0),I0);const L0=F(70,110,B);D0.set(s0*(.04+.96*L0*L0),L0),V0.U.uClock.value+=s0*(.05+.95*F(62,104,B)),w0.U.uFlow.value=b(B)+y*.35,w0.U.uFlut.value+=s0*(.04+.96*F(30,70,B))*2.4,w0.U.uShiver.value=F(18,30,B)*(1-F(45,75,B)),w0.U.uTime.value=y;const $0=F(z+20,O-40,B);O0+=s0*(1.5+15*$0),b0.U.uFlow.value=O0,b0.U.uFlut.value+=s0*(.3+2.4*$0),b0.U.uTime.value=y;let M0,t0,N0=0;if(v0)M0=.2+.08*Math.sin(y*.6),t0=(.35+.25*F(120,165,B))*(.8+.2*Math.sin(y*2.3));else{M0=.3+.7*F(120,186,B);const P=F(183,187,B)*(1-.8*F(189,206,B)),_=ne(y%1.45)*F(187,192,B)*(1-F(260,340,B));t0=Math.max(P,.75*_,.1*M0),N0=(.3+.12*Math.sin(y*7.3)*Math.sin(y*2.9))*(1-F(183,187,B))}B0.U.uGrow.value=M0,B0.U.uI.value=v0?.5+t0:.5+1.7*Math.max(t0,N0),u.uFlash.value.w=(v0?1.3:2.4)*t0*e.flashGain,u.uFlash.value.y=v0?30:16,u.uBoltGrow.value=M0,u.uGlowCol.value.copy(re).multiplyScalar(.25+Math.max(t0,N0)),H0.setSize(0,v0?.6+.5*t0:.25+1.6*t0),v0&&H0.setPosition(0,e.bolt.x+Math.sin(y*.4)*1.5,30+Math.sin(y*.27)*2.5,e.bolt.z+Math.cos(y*.33)*1.5),T0.U.uFront.value=P0,T0.U.uTime.value=y,U0.U.uFront.value=P0,U0.U.uTime.value=y,_0.U.uTime.value=y,o0.scale.y=.25+.75*F(95,125,P0),o0.scale.x=o0.scale.z=.6+.4*F(100,130,P0);const X0=F(z-30,z+55,B);v.setProgress(X0),v.setGust(F(z-15,z+120,B)),u.uWarm.value.w=e.warm*(.55+.45*X0)*(1+.06*Math.sin(y*1.7)+.04*Math.sin(y*4.1)),v.update(g,y,q);const R0=F(M-130,M+30,B);q0+=s0*(.1+.9*R0),i0.U.uT.value=q0,u.uHurT.value=q0,u.uEye.value=e.eye*(.45+.55*R0)*(1-.3*F(p-62,p-22,B));for(let P=0;P<3;P++){const _=1.7+P*.55,K=y/_+P*.31,I=Math.floor(K),H=(K-I)*_;i0.U.uTb.value[P].set(f0(I*5.3+P*11)*T,F(0,.1,H)*Math.exp(-H/.45)*(e.look==="night"?1.5:1.15),1+40*f0(I*2.9+P*23),5+24*f0(I*9.1+P*7))}for(let P=0;P<3;P++){const _=1.8+P*.7,K=Math.floor(y/_+P*.37),I=y+P*.37*_-K*_,H=f0(K*3.1+P*17)*T,Y0=25+60*f0(K*7.7+P*5);i0.U.uFl.value[P].set(U.x+Math.cos(H)*Y0,U.y+Math.sin(H)*Y0,F(0,.1,I)*Math.exp(-I/.42)*(.15+.85*R0)*(e.look==="night"?2:1.5),30+40*f0(K+P*3.3))}let E0=0;u0&&(E0=Z(335-B-62,158,282)+Math.sin(y*.2)*2,u0.U.uC.value.set(-9+22*F(40,130,B)+Math.sin(y*.13)*2,22+Math.sin(y*.31)*.8,E0),u0.U.uT.value=y);for(const P of W){let _=y*13+P.off;u0&&P.tram===0&&(_=335-E0-24+P.off+Math.sin(y*.5)*1.5);const K=(_/x%1+1)%1*Y,I=Math.min(Math.floor(K),Y-1)*3,H=K-I/3;A0.set(R(l0[I],l0[I+3],H),R(l0[I+1],l0[I+4],H),R(l0[I+2],l0[I+5],H)),z0.set(R(C0[I],C0[I+3],H),0,R(C0[I+2],C0[I+5],H)),P.mesh.position.copy(A0),P.mesh.rotation.y=Math.atan2(-z0.x,-z0.z),P.mesh.rotation.z=Math.sin(y*1.3+P.off)*.012}g0.update(g,y,q),X.update(g,y,q,K0)},dispose(){v.dispose()}}}};export{je as default};
