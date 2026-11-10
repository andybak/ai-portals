import*as l from"three";import{makePath as sa}from"../kit/core.js";import{buildHero as ra,Tubes as fe,GLSL_COMMON as Vt}from"../parts/leaded-forest.js";const lt=["#0A0B0E","#DDE9F0","#8E6BD6","#2FA35A","#F2A21E","#D9471C","#1D5FBF"],U=28,Ie=7*Math.PI/6,ve=Math.sin(Ie)*28,de=Math.cos(Ie)*28,E=Math.cos(Ie),O=-Math.sin(Ie),we=15,ct=56,ft=223,Ee=11.5,Oe=33,me=112,p=(M,k,$)=>new l.Vector3(M,k,$),N=Vt+`
uniform float uU, uGroundGain, uDome; uniform vec3 uSheetCol, uPearl, uFront, uCeladon, uCobalt, uHorizon;
// seasons run along the path as fronts four times faster than the camera; s = where the thing stands (path u)
float frontAt(float off, float s){ return (uU - off) * 4. - s; }
vec3 wSeason(float x, float s, float r, float green){
  float f1 = smoothstep(0., 0.06, frontAt(uFront.x, s) - r * 0.06);
  float f2 = smoothstep(0., 0.06, frontAt(uFront.y, s) - r * 0.06);
  vec3 sp = mix(fam(0., x), mix(uCeladon * 0.62, uCeladon * 1.12, x), green);
  return mix(mix(sp, fam(1., x), f1), fam(2., x), f2);
}
float wFallT(float s, float r){ return frontAt(uFront.z, s) * 10. - r * 3.5; }
float wFrost(float s){ return smoothstep(0.03, 0.2, frontAt(uFront.z, s)); }
vec3 rotAx(vec3 v, vec3 ax, float a){ float c = cos(a), s = sin(a); return v * c + cross(ax, v) * s + ax * dot(ax, v) * (1. - c); }
`,Q="#include <fog_pars_vertex>",H="#include <fog_pars_fragment>",Y=(M,k)=>new l.ShaderMaterial({fog:!0,uniforms:{...l.UniformsUtils.clone(l.UniformsLib.fog),...M,...k.extra||{}},vertexShader:k.vs,fragmentShader:k.fs,side:k.side??l.FrontSide,transparent:!!k.transparent,depthWrite:k.depthWrite??!0,blending:k.blending??l.NormalBlending,defines:k.defines||{}});function la(M){return Y(M,{side:l.DoubleSide,vs:N+`
      attribute vec3 iPos; attribute vec4 iA, iB;
      varying vec2 vUv; varying vec3 vCol, vCol2, vN, vWp; varying vec4 vK;
      ${Q}
      void main(){
        float r1 = iA.y, s = iA.z, kind = floor(iA.w), green = step(0.25, iA.w - kind);
        float shard = step(1.5, kind) * step(kind, 2.5), late = step(3.5, kind), beech = step(2.5, kind) * (1. - late);
        float cyc = fract(uTime * 0.075 + r1 * 7.31), fallD = max(cyc - 0.16, 0.) * 39.;      // hangs 2 s, then 33 m at 2.9 m/s
        float tt = shard > 0.5 ? 0. : late > 0.5 ? fallD * 0.34 : max(wFallT(s, r1), 0.), fell = step(0.0001, tt);
        vec3 c = iPos + sway(iPos, iB.w) * exp(-tt * 0.8);
        c.y -= mix(4. * (tt - (1. - exp(-1.4 * tt)) / 1.4), fallD, late);
        c.xz += vec2(sin(tt * 0.9 + r1 * 40.), cos(tt * 0.7 + r1 * 23.)) * min(tt, 2.5) * 0.6 * (1. - late);
        float land = smoothstep(0.15, 1.8, c.y); c.y = max(c.y, 0.12);
        float yaw = iB.x + 0.32 * sin(uTime * 2.3 + r1 * 50.) * (1. - fell);
        float tilt = iB.y + 0.15 * sin(uTime * 1.7 + r1 * 31.);
        vec3 X = vec3(cos(yaw), 0., -sin(yaw)), N = vec3(sin(yaw) * cos(tilt), sin(tilt), cos(yaw) * cos(tilt));
        vec3 Y = cross(N, X);
        vec3 ax = normalize(vec3(sin(r1 * 90.), 0.35, cos(r1 * 90.)));
        float ang = tt * (1.2 + 2.2 * fract(r1 * 7.3)) * (1. - 0.5 * late);
        X = rotAx(X, ax, ang); Y = rotAx(Y, ax, ang); N = rotAx(N, ax, ang);
        float cd = distance(c, cameraPosition);
        float lateOn = smoothstep(0.735, 0.775, uU) * (1. - smoothstep(0.975, 0.995, uU)) * smoothstep(0., 0.05, cyc) * (1. - smoothstep(0.93, 1., cyc));
        float sc = mix(1., land * smoothstep(0.7, 1.8, cd) * mix(0.3, 1., smoothstep(2., 9., cd)), fell) * iA.x * (1. - beech * smoothstep(3.5, 7., tt)) * mix(1., lateOn, late);
        vec3 lp = c + (X * position.x * iB.z + Y * position.y) * sc;
        vUv = position.xy * 2.; vN = N;
        float x = mix(0.12 + 0.76 * fract(r1 * 3.7), 0.3 + 0.3 * fract(r1 * 3.7), late);
        vec3 a = wSeason(x, s, r1, green) * (1. - 0.45 * late), b = mix(wSeason(fract(x + 0.31), s, r1, green), a, late);
        vec3 w0 = fam(3., x);
        float fr = shard;
        vec3 ice = vec3(0.7, 0.87, 1.04);
        vCol = mix(a, w0 * ice, fr); vCol2 = mix(b, fam(3., fract(x + 0.31)) * ice, fr);
        vK = vec4(r1, kind, fell, smoothstep(-0.02, 0.3, frontAt(uFront.z, s) - r1 * 0.12));
        vec4 wp = vec4(lp, 1.); vWp = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:N+`
      varying vec2 vUv; varying vec3 vCol, vCol2, vN, vWp; varying vec4 vK;
      ${H}
      void main(){
        float u = vUv.x, v = vUv.y, r = vK.x, kind = vK.y;
        float fw = (abs(dFdx(u)) + abs(dFdy(u)) + abs(dFdx(v)) + abs(dFdy(v))) * 0.6;
        float e, cell = 0.5, bwMin = 0.11;
        if (kind < 0.5 || kind > 2.5) {                     // birch or beech leaf: a pointed oval
          float w = 0.86 * sqrt(max(1. - v * v, 0.)) * (1. - 0.3 * v);
          e = w - abs(u);
        } else if (kind < 1.5) {                            // a leaf as large as a door: five to nine leaded cells
          float w = 0.95 * pow(max(1. - v * v, 0.), 0.42) * (1. - 0.16 * v);
          e = w - abs(u);
          vec2 p = vec2(u * 1.05, v * 1.75) + r * 17.3, ip = floor(p), fp = fract(p);
          float d1 = 9., d2 = 9.; vec2 id = vec2(0.);
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j)), o = vec2(h21(ip + g), h21(ip + g + 57.3)) * 0.7 + 0.15;
            vec2 dv = g + o - fp; float d = dot(dv, dv);
            if (d < d1) { d2 = d1; d1 = d; id = ip + g; } else if (d < d2) { d2 = d; }
          }
          e = min(e, (sqrt(d2) - sqrt(d1)) * 0.75 + 0.012);
          e = min(e, abs(u) * 0.9 + 0.035 + 0.3 * (1. - step(v, 0.55)));   // midrib
          cell = h21(id + 1.3); bwMin = 0.05;
        } else {                                            // frost shard caught in a fork
          e = 1.;
          for (int k = 0; k < 5; k++) { float fk = float(k), an = fk * 1.2566 + (h11(fk + r * 7.) - 0.5) * 0.9 + r * 6.; e = min(e, 0.55 + 0.4 * h11(fk * 3. + r * 13.) - dot(vUv, vec2(cos(an), sin(an)))); }
        }
        if (e < 0.) discard;
        float bw = max(bwMin, 1.5 * fw);
        float came = 1. - smoothstep(bw * 0.65, bw, e);
        vec3 V = normalize(vWp - cameraPosition), N = normalize(vN);
        float b = sheet(V) * mix(0.42, 1., smoothstep(0., 0.75, abs(dot(N, V))));
        float streak = 0.8 + 0.2 * sin(v * 3.2 + u * 7. * (r - 0.5) + r * 30. + sin(u * 4. + r * 11. + cell * 9.));
        vec2 bb = fract(vUv * 2.3 + r * 7.) - 0.5; float bub = smoothstep(0.12, 0.04, length(bb)) * step(0.78, h21(floor(vUv * 2.3 + r * 7.) + r));
        float isShard = step(1.5, kind) * step(kind, 2.5);
        vec2 fcell = floor(vUv * 2.6 + r * 5.);
        float craze = smoothstep(0.1, 0.0, abs(sin(u * 7. + r * 9. + sin(v * 5.) * 1.3) * sin(v * 6.3 + r * 7. + sin(u * 4.) * 1.1) - 0.15)) * isShard * step(h21(fcell + 3.1), vK.w * 1.05);
        craze *= 0.7 + 0.6 * smoothstep(0.2, 1., sin(uTime * (0.9 + 1.3 * h21(fcell + 7.7)) + h21(fcell + 1.9) * 40.));      // frost glitters, cell by cell
        float run = smoothstep(0.8, 1., sin(u * 9. + r * 40.)) * smoothstep(0.3, 1., sin(v * 2.4 + uTime * (2. + 2. * r) + r * 60.)) * uRain;
        vec3 gc = mix(vCol, vCol2, smoothstep(0.35, 0.65, cell)) * (0.78 + 0.44 * cell);
        gc = mix(gc, uSheetCol * uDome * vec3(0.6, 0.79, 1.0) * (0.74 + 0.34 * fract(r * 5.3)) / max(b * uGlassGain, 0.2), isShard * 0.75);      // a frost pane is nearly clear: the sheet seen through it
        vec3 glass = gc * b * streak * uGlassGain * (1. - 0.12 * uRain) + bub * 0.4 + craze * 0.45 * uPearl + run * 0.5;
        float gl = abs(dot(N, normalize(vec3(0., 0.75, 0.) - V)));
        gl *= gl; gl *= gl; gl *= gl; gl *= gl; gl *= gl; gl *= gl;
        glass += vec3(1., 0.97, 0.92) * gl * 2.6 * vK.z;
        float dissolve = 1. - smoothstep(0.18, 0.5, fw);
        vec3 col = mix(glass, mix(glass * 0.72, uLead, dissolve), came);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function Wt(M,k){return Y(M,{defines:k?{BIRCH:1}:{},vs:`
      attribute float aRad; varying vec3 vWp, vN;
      ${Q}
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.); vN = normalize(mat3(modelMatrix) * normal);
        float dist = length(wp.xyz - cameraPosition);
        wp.xyz += vN * max(0., min(0.0009 * dist, 0.3) - aRad);
        vWp = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:N+`
      varying vec3 vWp, vN;
      ${H}
      void main(){
        vec3 V = normalize(vWp - cameraPosition), N = normalize(vN);
        float fr = 1. - abs(dot(N, V)); fr = fr * fr * fr;
        vec3 col = uLead + uSheetCol * fr * 0.03 * sheet(V);
        #ifdef BIRCH
          float hh = h21(floor(vWp.xz * 0.11));
          float band = smoothstep(0.8, 0.9, sin(vWp.y * 2.6 + hh * 40.) * sin(vWp.y * 0.83 + hh * 17.) + 0.2 * sin(vWp.y * 9. + N.x * 3.));
          float ring = smoothstep(0.9, 0.97, sin(vWp.y * 1.26 + hh * 9.));
          float frost = wFrost(hh);
          vec3 opal = mix(vec3(0.93, 0.94, 0.9), fam(3., 0.6), frost * 0.5) * uPearl * 1.25 * sheet(V) * mix(0.5, 1., smoothstep(0., 0.8, abs(dot(N, V)))) * (0.85 + 0.15 * sin(vWp.y * 5. + vWp.x * 3.));
          col = mix(opal * uGlassGain * 0.72, uLead, max(band, ring));
        #endif
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function ca(M){return Y(M,{vs:`
      attribute float aS; varying vec3 vWp; varying float vS;
      ${Q}
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vS = aS;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:N+`
      varying vec3 vWp; varying float vS;
      ${H}
      void main(){
        vec2 p = vWp.xz; float bx = abs(p.x - ${U}.), brook = 1. - step(4., bx);
        float frost = wFrost(vS);
        float flow = uTime * 1.5 * (1. - frost);
        vec2 q = mix(p * 0.6, vec2(p.x * 0.75 + 0.2 * sin(p.y * 0.4 + flow * 0.5), (p.y + flow) * 0.3), brook);
        float fw = length(fwidth(p)) * mix(0.6, 0.5, brook);
        vec2 ip = floor(q), fp = fract(q);
        float d1 = 9., d2 = 9.; vec2 id = vec2(0.);
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 g = vec2(float(i), float(j)), o = vec2(h21(ip + g), h21(ip + g + 57.3)) * 0.8 + 0.1;
          vec2 dv = g + o - fp; float d = dot(dv, dv);
          if (d < d1) { d2 = d1; d1 = d; id = ip + g; } else if (d < d2) { d2 = d; }
        }
        float edge = sqrt(d2) - sqrt(d1), h = h21(id + 2.7), h2 = h21(id + 9.1);
        float bw = max(0.045, 1.5 * fw), came = 1. - smoothstep(bw * 0.6, bw, edge);
        came = max(came, brook * (1. - smoothstep(0.12, 0.2, 4. - bx)) + (1. - brook) * (1. - smoothstep(0.1, 0.22, bx - 4.)));   // the banks are two lead lines
        vec3 V = normalize(vWp - cameraPosition);
        float sh = sheet(vec3(V.x, abs(V.y), V.z));
        float gr = 1. - abs(V.y); gr *= gr; gr *= gr;
        vec3 tintS = mix(vec3(1.), uSheetCol * 1.2, 0.7);
        // slate
        float streak = 0.8 + 0.2 * sin(dot(p, vec2(cos(h * 6.28), sin(h * 6.28))) * 5. + h2 * 20.);
        vec3 slate = mix(vec3(0.028, 0.036, 0.055), vec3(0.085, 0.1, 0.135), h * h) * streak * tintS * 1.15 * uGroundGain;
        float rr = length(p), forest = smoothstep(52., 70., rr);
        // pools of the season's colour sliding under the canopies
        float t = uTime * 0.22;
        float m = sin(p.x * 0.31 + t + sin(p.y * 0.23 - t * 0.7)) * sin(p.y * 0.37 - t * 0.6 + sin(p.x * 0.19)) ;
        float leafy = 1. - smoothstep(0., 3., wFallT(vS, 0.5));
        vec3 pool = wSeason(0.3 + 0.4 * h, vS, h2, 0.3) * smoothstep(0.1, 0.75, m) * forest * leafy * 0.3;
        slate += pool * pool * 2.2 + pool * 0.25;
        // litter: fallen panes lie as a mosaic of autumn, in drifts
        float drift = 0.5 + 0.5 * sin(p.x * 0.13 + sin(p.y * 0.09) * 2.) * sin(p.y * 0.11 + 1.3);
        drift = smoothstep(0.42, 0.8, drift + 0.25 * sin(p.x * 0.047 - p.y * 0.031 + 2.));
        vec2 av = p - vec2(${ve.toFixed(3)}, ${de.toFixed(3)}); float avT = dot(av, vec2(${E.toFixed(4)}, ${O.toFixed(4)})), avL = dot(av, vec2(${(-O).toFixed(4)}, ${E.toFixed(4)}));
        float rows = (1. - smoothstep(1.5, 8., abs(abs(avL) - ${we}.))) * step(30., avT);   // banked against the avenue's trunks
        float mouth = (1. - smoothstep(6., 20., abs(avL))) * (1. - smoothstep(12., 30., abs(avT - 38.)));   // and spilt out of the parting
        float under = max(1. - smoothstep(40., 52., rr), forest * 0.8);
        float lit = step(h2, 0.08 + 0.9 * max(drift, max(rows, mouth)) * under) * under;
        float appear = mix(smoothstep(2., 9., uFallT + h * 3.), smoothstep(0., 5., wFallT(vS, h)), forest);
        vec3 litter = fam(2., 0.62 + 0.38 * h) * sh * (0.8 + 0.45 * streak) * mix(0.75, 1.1, h2 * 3.) * 1.6;
        float frostL = frost * smoothstep(0.80, 0.90, uU + h * 0.03);
        slate = mix(slate, litter, lit * appear * (1. - frostL * 0.8));
        // the brook
        float rip = 0.75 + 0.25 * sin(q.y * 9. + sin(q.x * 5. + flow) * 2. + h * 6.28);
        vec3 water = mix(uCobalt, uCobalt * vec3(4., 2.6, 1.55), h * h * 0.75) * (0.9 + 1.5 * h2) * rip * sh;
        water += uSheetCol * smoothstep(0.93, 1., sin(q.y * 7. + q.x * 3. + flow * 2.3 + h * 40.)) * 0.5;
        water = mix(water, fam(3., h) * sh * 0.8, frost * 0.7);
        vec3 col = mix(slate, water, brook);
        // frost: a white craze growing along the came, cell by cell
        float fz = frost * step(h * 0.8, frost) * (1. - lit * appear * (1. - smoothstep(0.79, 0.86, uU)));
        float craze = smoothstep(0.25, 0.0, edge) * (0.5 + 0.5 * sin(edge * 60. + h * 30.));
        col += uPearl * fz * (0.1 + 0.42 * craze) * (0.6 + 0.4 * streak);
        float dissolve = 1. - smoothstep(0.12, 0.45, fw);
        col = mix(col, mix(col * 0.55, mix(uLead, uPearl * 0.55, fz * 0.8), dissolve), came);
        col += uSheetCol * gr * 0.16 * sh;                  // the sheet glancing off the glass floor far away
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function fa(M){return new l.ShaderMaterial({side:l.BackSide,depthWrite:!1,depthTest:!1,uniforms:M,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:Vt+`
      uniform vec3 uSheetCol, uHorizon; uniform float uDome, uU, uMottle; varying vec3 vD;
      float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f); return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
      void main(){
        vec3 d = normalize(vD);
        vec2 c = d.xz / (abs(d.y) + 0.45) * 1.6 + uTime * vec2(0.03, 0.017);
        float cl = vn(c) * 0.55 + vn(c * 2.1 + 3.7) * 0.3 + vn(c * 4.3 + 9.1) * 0.15;
        float m = 1. - mix(0.3, 0.52, smoothstep(0.66, 0.8, uU)) * uMottle * smoothstep(0.3, 0.72, cl);
        float band = 1. - smoothstep(0.0, 0.3, abs(d.y)); band *= band;
        vec3 col = mix(uSheetCol, uHorizon, band) * uDome * (sheet(d) / uSheetGain) * m * (1. - 0.1 * smoothstep(0., -0.5, d.y));
        col *= mix(mix(vec3(1.), vec3(0.8, 0.9, 1.0), uMottle), vec3(1.), smoothstep(0.55, 1., m));     // the dimmer cloud-shapes are a cooler, ice-blue pearl
        gl_FragColor = vec4(col, 1.);
      }`})}function va(M){return Y(M,{side:l.DoubleSide,vs:N+`
      attribute vec4 iP, iQ; varying vec2 vUv; varying vec4 vQ; varying vec3 vWp;
      ${Q}
      void main(){
        vec3 right = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0]) + vec3(1e-4, 0., 0.));
        float a = (iQ.y - 0.5) * 1.1; right = vec3(right.x * cos(a) - right.z * sin(a), 0., right.x * sin(a) + right.z * cos(a));
        float v = position.y;
        float wind = sin(uTime * 1.5 + iP.x * 0.21 + iP.z * 0.17 + iQ.y * 6.) + 0.5 * sin(uTime * 2.7 + iQ.y * 40.);
        vec3 wp = iP.xyz + right * (position.x * iP.w * iQ.w + wind * 0.07 * v * v * iP.w) + vec3(0., v * iP.w, 0.);
        vUv = vec2(position.x * 2., v); vQ = iQ; vWp = wp;
        vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:N+`
      varying vec2 vUv; varying vec4 vQ; varying vec3 vWp;
      ${H}
      void main(){
        float u = vUv.x, v = vUv.y, kind = vQ.x, r = vQ.y, s = vQ.z;
        float fw = (abs(dFdx(u)) + abs(dFdy(u)) + abs(dFdx(v)) + abs(dFdy(v))) * 0.6;
        float e = -1., x = 0.5, green = 1., lead = 0.;
        if (kind < 0.5) {                                   // a tuft of glass blades
          for (int k = 0; k < 5; k++) {                     // five curved blades arching outward, each a pane in its own came
            float fk = float(k), hk = h11(fk * 7.3 + r * 13.), lk = h11(fk * 3.1 + r * 29.) - 0.5;
            float hgt = (0.6 + 0.4 * hk) * (1. - 0.16 * abs(fk - 2.)), q = v / hgt;
            float lean = (fk - 2.) * 0.3 + lk * 0.22;
            float cx = (fk - 2.) * 0.1 + lk * 0.08 + lean * q * (0.3 + 0.7 * q);
            float ek = min(0.125 * (1. - q * q) * (0.5 + 0.5 * smoothstep(0., 0.14, q)) - abs(u - cx), (1. - q) * 0.5);
            if (ek > 0.) { e = ek; x = 0.15 + 0.7 * h11(fk + r * 5.); }
          }
        } else if (kind < 1.5) {                            // iris: lead stem, two blades, a three-petalled flower
          lead = step(abs(u), 0.04) * step(v, 0.66);
          float bladeL = 0.085 * (1. - v / 0.56) - abs(abs(u) - 0.1 - 0.55 * v * v);
          vec2 pp = vec2(u, (v - 0.76) * 2.1); float ang = atan(pp.y, pp.x + 1e-5), rr = length(pp);
          float pet = 0.47 * (0.5 + 0.5 * abs(cos(1.5 * ang + 0.52 + r))) - rr;
          e = max(bladeL, pet); green = step(pet, bladeL); x = green > 0.5 ? 0.3 + 0.5 * r : 0.2 + 0.6 * fract(ang * 0.48 + r);
          e = max(e, lead - 0.5);
        } else {                                            // fern: graded leaflets either side of a lead rib
          float uu = u - (r - 0.5) * 1.5 * v * v;           // each frond arches to one side, widest low down, tapering to both ends
          lead = step(abs(uu), 0.03) * step(v, 0.97);
          float k = v * 12., fv = fract(k);
          float wv = 0.5 * pow(max(sin(3.1416 * pow(max(v, 0.), 0.55)), 0.), 0.8) * (0.8 + 0.2 * sin(floor(k) * 2.4 + r * 9.));
          e = min(wv - abs(uu), 0.44 - abs(fv - 0.5));
          e = min(e, abs(uu) - 0.02); x = 0.15 + 0.8 * v; e = max(e, lead - 0.5);
        }
        if (e < 0.) discard;
        float bw = kind < 0.5 ? min(max(0.026, 1.5 * fw), 0.05) : max(0.05, 1.5 * fw), came = max(1. - smoothstep(bw * 0.6, bw, e), lead);
        vec3 V = normalize(vWp - cameraPosition);
        vec3 gc = mix(wSeason(x, s, r, green), fam(3., x), wFrost(s));
        vec3 glass = gc * sheet(V) * (0.8 + 0.2 * sin(v * 9. + r * 30. + u * 4.)) * uGlassGain * (kind < 0.5 ? 0.86 : 0.92);
        float dissolve = kind < 0.5 ? 1. - smoothstep(0.012, 0.04, fw) : kind > 1.5 ? 1. - smoothstep(0.07, 0.26, fw) : 1. - smoothstep(0.2, 0.55, fw);
        gl_FragColor = vec4(mix(glass, mix(glass * 0.7, uLead, dissolve), came), 1.);
        #include <fog_fragment>
      }`})}function da(M){return Y(M,{transparent:!0,depthWrite:!1,blending:l.AdditiveBlending,vs:N+`
      attribute vec4 iP; attribute vec2 iQ; varying vec2 vUv; varying vec3 vCol; varying float vR;
      ${Q}
      void main(){
        float r = iQ.y, s = iQ.x;
        vec3 c = vec3(iP.x, 0.07 + r * 0.05, iP.y);
        c += sway(c, 24.) * 1.5 + vec3(sin(uTime * 0.31 + r * 40.), 0., cos(uTime * 0.27 + r * 23.)) * 1.3;
        vCol = wSeason(0.25 + 0.6 * r, s, r, 0.3) * (1. - smoothstep(0., 3., wFallT(s, r)));
        vUv = position.xz * 2.; vR = r;
        vec4 mvPosition = viewMatrix * vec4(c + position * iP.z, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:N+`
      varying vec2 vUv; varying vec3 vCol; varying float vR;
      ${H}
      void main(){
        float a = atan(vUv.y, vUv.x + 1e-4), l = length(vUv);
        float lobes = 0.86 + 0.14 * sin(a * 3. + vR * 20. + uTime * 0.3) * sin(a * 2. - vR * 9.);
        float m = smoothstep(lobes, 0.0, l);
        gl_FragColor = vec4((vCol * 0.3 + vCol * vCol * 0.35) * m * m, 1.);
        #ifdef FOG_EXP2
          gl_FragColor.rgb *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
        #endif
      }`})}function Bt(M,k){return Y(M,{side:l.DoubleSide,extra:k,vs:N+`
      attribute vec4 iP; uniform vec4 uChip; uniform vec3 uChipCol, uBox; uniform float uGust; varying vec2 vUv; varying vec3 vCol;
      ${Q}
      void main(){
        float r = iP.w;
        float gust = sin(uTime * 0.37 + iP.y * 5.) + 0.6 * sin(uTime * 0.23 + iP.y * 11. + 1.7);
        vec3 q = iP.xyz * uBox + vec3(sin(uTime * 0.31 + r * 40.) * 1.5 + uTime * 0.5 + gust * uGust, -uTime * uChip.y * (0.7 + 0.6 * r), cos(uTime * 0.27 + r * 23.) * 1.5 + gust * uGust * 0.5);
        q = mod(q - cameraPosition + uBox * 0.5, uBox) - uBox * 0.5;
        float dist = length(q);
        float on = step(r, uChip.x) * smoothstep(1.5, 4., dist) * (1. - smoothstep(uBox.x * 0.4, uBox.x * 0.5, dist));
        float ang = uTime * (1. + 2. * fract(r * 7.)) * uChip.w + r * 50.;
        vec2 o = vec2(position.x * cos(ang) - position.y * sin(ang), position.x * sin(ang) + position.y * cos(ang));
        o = mix(o, vec2(position.x * 0.22, position.y * 9.), 1. - uChip.w);
        float sz = uChip.z * (0.6 + 0.8 * fract(r * 13.)) * on;
        vec4 mvPosition = viewMatrix * vec4(q + cameraPosition, 1.);
        mvPosition.xy += o * sz * vec2(1., 0.55 + 0.45 * sin(ang * 1.7));
        vUv = position.xy * 2.;
        vCol = uChipCol * (0.8 + 0.5 * step(0.93, sin(ang * 1.3)));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:`
      varying vec2 vUv; varying vec3 vCol;
      ${H}
      void main(){
        if (abs(vUv.x) + abs(vUv.y) * 0.8 > 1.) discard;
        gl_FragColor = vec4(vCol, 1.);
        #include <fog_fragment>
      }`})}function ua(M,k){return Y(M,{side:l.DoubleSide,defines:k?{LILY:1}:{},vs:N+`
      attribute vec4 iK; varying vec2 vUv; varying vec4 vK; varying vec3 vWp;
      ${Q}
      void main(){
        float r = iK.z, t = uTime;
        vec3 c = vec3(iK.x + sin(t * 0.23 + r * 20.) * 1.6, 0.07 + r * 0.03, iK.y + sin(t * 0.17 + r * 31.) * 5.);
        float near = smoothstep(26., 7., length(c.xz - cameraPosition.xz));
        #ifdef LILY
          float h = t * 0.1 + r * 6.28; float open = 1. - 0.72 * near;
          vec2 l = position.xz * iK.w * 0.8; vK = vec4(r, open, 0., 0.);
        #else
          float h = 1.57 + 0.6 * sin(t * 0.21 + r * 9.) + near * (1.4 + r) * (r > 0.5 ? 1. : -1.);
          vec2 l = position.xz * vec2(iK.w * 0.36, iK.w);
          l.x += sin(position.z * 4.5 - t * (3. + 3. * near) + r * 9.) * 0.13 * iK.w * (0.25 + (position.z + 0.5));
          vK = vec4(r, 1., near, 0.);
        #endif
        vec2 w = vec2(l.x * cos(h) + l.y * sin(h), -l.x * sin(h) + l.y * cos(h));
        vWp = c + vec3(w.x, 0., w.y); vUv = position.xz * 2.;
        vec4 mvPosition = viewMatrix * vec4(vWp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:N+`
      varying vec2 vUv; varying vec4 vK; varying vec3 vWp;
      ${H}
      void main(){
        float u = vUv.x, v = vUv.y, r = vK.x; float e, ptc = 0., seg;
        float fw = (abs(dFdx(u)) + abs(dFdy(u)) + abs(dFdx(v)) + abs(dFdy(v))) * 0.6;
        #ifdef LILY
          float ang = atan(v, u + 1e-5), rr = length(vUv);
          float pad = 0.98 - rr - 0.5 * smoothstep(0.25, 0.0, abs(ang - 1.));
          float pet = (0.3 + 0.36 * abs(cos(ang * 4. + r * 5.))) * vK.y - rr;
          e = max(pad, pet); ptc = step(0., pet); seg = fract(ang * 1.2732 + r) ;
          e = min(e, abs(pet) + 0.02);
        #else
          float body = v < 0.45 ? 0.82 * sqrt(max(1. - (v + 0.3) * (v + 0.3) / 0.5625, 0.)) : 0.1 + 1.5 * (v - 0.45);
          e = min(body - abs(u), 1. - v); seg = fract(v * 2.2 + r);
          ptc = step(abs(v + 0.6 * r - 0.3), 0.3) * step(0.2, r);
          e = min(e, abs(seg - 0.5) * 0.9 + 0.01 + step(0.45, v));
          e = min(e, abs(u) + 0.03 + step(v, 0.45));
        #endif
        if (e < 0.) discard;
        float bw = max(0.09, 1.5 * fw), came = 1. - smoothstep(bw * 0.6, bw, e);
        vec3 V = normalize(vWp - cameraPosition);
        vec3 seasonC = mix(wSeason(0.2 + 0.6 * r, uU, r, 0.), fam(3., r), wFrost(uU));
        #ifdef LILY
          vec3 gc = mix(wSeason(0.5, uU, r, 1.) * 0.8, mix(vec3(0.95), seasonC, 0.55), ptc);
        #else
          vec3 gc = mix(vec3(0.92, 0.95, 0.97), seasonC, ptc);
        #endif
        float rip = 0.8 + 0.2 * sin(vWp.z * 2.7 + uTime * 1.5 + sin(vWp.x * 5.) * 2.);
        vec3 glass = gc * sheet(vec3(V.x, abs(V.y), V.z)) * rip * uGlassGain * mix(vec3(0.72, 0.85, 1.), vec3(1.), 0.35);
        gl_FragColor = vec4(mix(glass, uLead, came * (1. - smoothstep(0.25, 0.6, fw))), 1.);
        #include <fog_fragment>
      }`})}function pa(M,k){return Y(M,{side:l.DoubleSide,extra:k,vs:N+`
      attribute vec4 iO; attribute float iG, aPart; attribute vec2 aUv;
      uniform vec4 uGrp[3]; uniform vec4 uGrpV[3]; uniform vec3 uBird;      // uBird: flap rate, flap amplitude, glide
      varying vec2 vUv; varying vec3 vWp, vN; varying vec2 vK;
      ${Q}
      void main(){
        int g = int(iG + 0.5); vec4 G = uGrp[g], GV = uGrpV[g]; float r = iO.w, t = uTime;
        vec3 p = position;
        float fl = sin(t * uBird.x * (0.85 + 0.3 * r) + r * 40.) * uBird.y * (1. - uBird.z * smoothstep(0.2, 0.9, sin(t * 0.6 + r * 17.)));
        if (aPart > 0.5 && aPart < 2.5) { float a = fl + 0.44; p = vec3(p.x * cos(a), p.y + abs(p.x) * sin(a), p.z); }
        vec3 n = aPart < 0.5 ? vec3(1., 0., 0.) : vec3(0., 1., 0.);
        p.y += fl * -0.06;
        float h = G.w + 0.25 * sin(t * 0.8 + r * 21.), bank = 0.3 * sin(t * 0.7 + r * 11.);
        p = vec3(p.x * cos(bank) - p.y * sin(bank), p.x * sin(bank) + p.y * cos(bank), p.z);
        p.yz = vec2(p.y * cos(GV.y) + p.z * sin(GV.y), -p.y * sin(GV.y) + p.z * cos(GV.y));
        vec3 w = vec3(p.x * cos(h) + p.z * sin(h), p.y, -p.x * sin(h) + p.z * cos(h)) * GV.x;
        vec3 off = iO.xyz * GV.z + vec3(sin(t * 0.7 + r * 9.), 0.5 * sin(t * 0.9 + r * 5.), cos(t * 0.6 + r * 7.)) * 1.1;
        off = vec3(off.x * cos(G.w) + off.z * sin(G.w), off.y, -off.x * sin(G.w) + off.z * cos(G.w));
        vWp = G.xyz + off + w; vUv = aUv; vK = vec2(r, aPart);
        vN = vec3(n.x * cos(h) + n.z * sin(h), n.y, -n.x * sin(h) + n.z * cos(h));
        vec4 mvPosition = viewMatrix * vec4(vWp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:N+`
      varying vec2 vUv; varying vec3 vWp, vN; varying vec2 vK;
      ${H}
      void main(){
        float fw = (abs(dFdx(vUv.x)) + abs(dFdy(vUv.x)) + abs(dFdx(vUv.y)) + abs(dFdy(vUv.y))) * 0.6;
        float e = min(min(vUv.x, vUv.y), 1. - vUv.x - vUv.y * 0.0);
        e = min(vUv.x, min(vUv.y, 1. - max(vUv.x, vUv.y)));
        float bw = max(0.07, 1.5 * fw), came = 1. - smoothstep(bw * 0.6, bw, e);
        vec3 V = normalize(vWp - cameraPosition);
        float r = vK.x, part = vK.y;
        vec3 sc = mix(wSeason(0.25 + 0.6 * fract(r * 5. + part * 0.21), uU, r, 0.), fam(3., r), wFrost(uU));
        vec3 gc = (part < 0.5 || part > 4.5) ? sc * 0.7 : part > 3.5 ? vec3(0.9, 0.93, 0.95) : sc;
        vec3 glass = gc * sheet(V) * (0.85 + 0.15 * sin(vUv.x * 9. + r * 30.)) * uGlassGain;
        gl_FragColor = vec4(mix(glass, uLead, came * (1. - smoothstep(0.3, 0.7, fw))), 1.);
        #include <fog_fragment>
      }`})}function vt(M,k,$={}){return Y(M,{side:$.side??l.FrontSide,extra:k,vs:`
      varying vec3 vLp, vWp, vN;
      ${Q}
      void main(){
        vLp = position; vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fs:N+`
      uniform vec3 uTint, uTint2; uniform vec4 uCell;     // uCell: cells per metre, jitter, season glow, craze
      varying vec3 vLp, vWp, vN;
      ${H}
      float h31(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      void main(){
        vec3 p = vLp * uCell.x; float fw = length(fwidth(p));
        vec3 ip = floor(p), fp = fract(p); float d1 = 9., d2 = 9.; vec3 id = vec3(0.);
        for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec3 g = vec3(float(i), float(j), float(k));
          vec3 o = 0.5 + (vec3(h31(ip + g), h31(ip + g + 19.7), h31(ip + g + 43.1)) - 0.5) * uCell.y;
          vec3 dv = g + o - fp; float d = dot(dv, dv);
          if (d < d1) { d2 = d1; d1 = d; id = ip + g; } else if (d < d2) { d2 = d; }
        }
        float edge = sqrt(d2) - sqrt(d1), h = h31(id + 3.3);
        float bw = max(0.08, 1.5 * fw), came = 1. - smoothstep(bw * 0.6, bw, edge);
        vec3 V = normalize(vWp - cameraPosition), N = normalize(vN);
        float nv = abs(dot(N, V));
        vec3 seasonC = mix(wSeason(0.3 + 0.5 * h, uU, h, 0.), fam(3., h), wFrost(uU));
        vec3 gc = mix(mix(uTint, uTint2, h * h), seasonC, uCell.z * (1. - nv) );
        float craze = smoothstep(0.07, 0.0, abs(sin(p.x * 7. + h * 9.) * sin(p.y * 6.3 + h * 7.) - 0.2)) * uCell.w;
        vec3 glass = gc * sheet(V) * mix(0.5, 1., smoothstep(0., 0.8, nv)) * (0.8 + 0.2 * sin(dot(p, vec3(3., 5., 4.)) + h * 20.)) * uGlassGain + craze * 0.3;
        glass += uSheetCol * pow(1. - nv, 3.) * 0.25;
        gl_FragColor = vec4(mix(glass, uLead, came * (1. - smoothstep(0.35, 0.9, fw))), 1.);
        #include <fog_fragment>
      }`})}function ha(M,k){return Y(M,{side:l.DoubleSide,transparent:!0,depthWrite:!1,extra:k,vs:`
      attribute vec2 aFan; varying vec2 vFan; varying vec3 vWp; varying vec4 vClip;
      ${Q}
      void main(){
        vFan = aFan; vec4 wp = modelMatrix * vec4(position, 1.); vWp = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition; vClip = gl_Position;
        #include <fog_vertex>
      }`,fs:N+`
      uniform float uWingA; varying vec2 vFan; varying vec3 vWp; varying vec4 vClip;
      ${H}
      void main(){
        float f = vFan.x, a = vFan.y;                     // f: root 0 .. tip 1; a: stroke -1 .. 1
        float fw = abs(dFdx(f)) + abs(dFdy(f));
        float dwell = smoothstep(0.5, 1., abs(a));
        float envF = smoothstep(0.03, 0.2, f) * (1. - smoothstep(0.9, 1., f)), env = (1. - smoothstep(0.9, 1., abs(a))) * envF;
        float vd = abs(fract(f * 17. + 0.3 * sin(f * 23. + a * 2.)) - 0.5), vein = 1. - smoothstep(0.03, 0.09 + fw * 14., vd);
        float costa = smoothstep(0.8, 0.9, abs(a)) * (1. - smoothstep(0.95, 1., abs(a)));
        float shim = 1. + 0.1 * sin(uTime * 12.566 + a * 3.);
        vec3 V = normalize(vWp - cameraPosition);
        float ph = f * 9. + a * 2.;
        vec3 irid = max(uSheetCol * 0.45 * sheet(V) / uSheetGain + 0.05 * vec3(sin(ph), sin(ph + 2.1), sin(ph + 4.2)), vec3(0.));   // a grey veil, never a milky pane
        float rib = smoothstep(0.1, 0., abs(abs(a) - 0.62 - 0.2 * f)) * 0.5;      // the long veins, smeared to a soft band
        float aM = env * (0.014 + 0.016 * dwell), aV = env * (0.56 * vein * (0.6 + 0.4 * dwell) + 0.08 * rib) + envF * 0.34 * costa;
        vec2 ndc = vClip.xy / max(vClip.w, 1e-4);           // fans of blur at the left and right edges of the frame, never over the view
        float edgeM = smoothstep(0.58, 0.8, abs(ndc.x)) * (1. - smoothstep(0.1, 0.42, ndc.y));
        float alpha = min((aM + aV) * shim * uWingA * edgeM, 1.);
        vec3 col = (irid * aM + uLead * aV) / max(aM + aV, 1e-4);
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`})}const ga={pearl:{sheet:"#DDE9F0",pearl:"#DDE9F0",dome:1.9,sheetGain:1.15,glass:1.5,fog:.0028,rain:0,exposure:1,bloom:{strength:.3,radius:.6,threshold:2.2},sat:1.08,portal:"#cfe4ff"},evening:{sheet:"#3A4372",horizon:"#8A97C6",mottle:.45,ground:1.4,pearl:"#9DB6F2",dome:1.08,sheetGain:.8,glass:1.4,fog:.0038,rain:0,exposure:1.1,bloom:{strength:.36,radius:.7,threshold:1.2},sat:1,portal:"#9fb8ff"},rain:{sheet:"#C3D2DD",pearl:"#D3E0E8",dome:1.5,sheetGain:1.05,glass:1.5,fog:.0041,rain:1,exposure:1,bloom:{strength:.3,radius:.6,threshold:1.75},sat:1.04,portal:"#cfe4ff"}};class Re{constructor(){this.p=[],this.a=[],this.b=[]}add(k,$,G,L,A,R,Z,V,te,Ce,Xe){this.p.push(k,$,G),this.a.push(L,A,R,Z),this.b.push(V,te,Ce,Xe)}get count(){return this.p.length/3}mesh(k){const $=new l.PlaneGeometry(1,1),G=new l.InstancedBufferGeometry;G.index=$.index,G.setAttribute("position",$.getAttribute("position")),G.setAttribute("iPos",new l.InstancedBufferAttribute(new Float32Array(this.p),3)),G.setAttribute("iA",new l.InstancedBufferAttribute(new Float32Array(this.a),4)),G.setAttribute("iB",new l.InstancedBufferAttribute(new Float32Array(this.b),4)),G.instanceCount=this.count;const L=new l.Box3;for(let A=0;A<this.p.length;A+=3)L.expandByPoint(p(this.p[A],this.p[A+1],this.p[A+2]));return G.boundingSphere=L.isEmpty()?new l.Sphere(p(0,0,0),1):L.getBoundingSphere(new l.Sphere),G.boundingSphere.radius+=6,new l.Mesh(G,k)}}function ue(M,k,$,G,L){const A=new l.InstancedBufferGeometry;A.index=M.index;for(const R of Object.keys(M.attributes))A.setAttribute(R,M.attributes[R]);for(const[R,Z,V]of k)A.setAttribute(R,new l.InstancedBufferAttribute(Z instanceof Float32Array?Z:new Float32Array(Z),V));return A.instanceCount=$,A.boundingSphere=new l.Sphere(G,L),A}var Ma={id:"leaded-forest",name:"The Leaded Forest",category:"wilderness",weirdness:.55,media:["air"],async build(M){const{rng:k}=M,$=M.noise,{clamp:G,smoothstep:L,lerp:A}=M.core,R=M.vary||{},Z=M.quality?.detail??1,V=G(R.density??1,.7,1.3)*Z,te=k.fork("look"),Ce=te(),Xe=te(),dt=te(),Fe=R.hour||"any",Se=Fe==="night"?"evening":Fe==="day"||Fe==="golden"?"pearl":Fe==="dawn"?"rain":Ce<.42?"pearl":Ce<.74?"evening":"rain",W=ga[Se],Lt=Xe<.62?"wisteria":"laburnum",Dt=dt<.5?"amber":dt<.75?"wine":"ginkgo",qt=te.pick(["kingfisher","swallow","moth"]),Qe=te.chance(.4),Nt=te.chance(.6)?"stag":"fox";te.chance(.5);const jt=!!R.rare,ut=lt.slice();ut[1]=W.pearl;const He={summer:.131,autumn:.405,winter:.485},P=M.core.makeRng("leaded-forest-more:"+M.seed),D=new l.Scene,pe=await ra(M,{palette:ut,variant:Lt,autumn:Dt,density:G(R.density??1,.7,1.15),sheetGain:W.sheetGain,glassGain:W.glass,rain:W.rain,duration:60,timeline:{summer:[.235,.285],autumn:[.5,.6],fall:.555,winter:[.66,.76]}});D.add(pe.object),await M.yield();const xe=k.range(.88,1.1),Ae=k.range(-1,1.5),Ye=[[U,2.5,330],[U,2.5,292],[U,2.5,254],[U,2.7,222],[U+3.5*xe,5.4,198],[U+12*xe,11,174],[U+20*xe,16.3+Ae*.5,150],[U+23*xe,18.6+Ae,127],[U+20*xe,18.4+Ae,105],[U+11*xe,17.4+Ae*.4,83],[U+2.6,16.2,61],[U+.3,15.5,47]],Ue=pe.anchors.flyThrough;for(let e=2;e<=Ue.length-2;e++)Ye.push([Ue[e].x,Ue[e].y,Ue[e].z]);for(const[e,o]of[[60,12.5],[85,8],[104,6.2],[118,7.9],[132,13.8],[146.4,23.6],[164.27,38.6],[182.13,53.6],[200,68.6]])Ye.push([ve+E*e,o,de+O*e]);const S=sa(Ye),ye=(e,o)=>S.nearestXZ(e,o).u,Ze=(e,o)=>S.distanceTo(e.x,e.y,e.z)>o,pt=e=>ye(ve+E*e,de+O*e),Kt=new l.Color(W.sheet),Ge=new l.Color(W.pearl),B={...pe.uniforms,uU:{value:0},uSheetCol:{value:Kt},uPearl:{value:Ge},uDome:{value:W.dome},uFront:{value:p(He.summer,He.autumn,He.winter)},uCeladon:{value:new l.Color("#9AD9B4")},uCobalt:{value:new l.Color(lt[6])},uHorizon:{value:new l.Color(W.horizon||W.sheet)},uGroundGain:{value:W.ground||1},uMottle:{value:W.mottle??1}},ht=B.uHorizon.value.clone().multiplyScalar(W.dome*1.02);D.fog=new l.FogExp2(ht,W.fog),D.background=ht.clone();const Te=new l.Mesh(new l.SphereGeometry(1500,32,16),fa(B));Te.renderOrder=-1,Te.frustumCulled=!1,D.add(Te);{const e=new l.PlaneGeometry(1700,1700,64,64).rotateX(-Math.PI/2).translate(-30,0,90),o=e.getAttribute("position"),g=new Float32Array(o.count);for(let n=0;n<o.count;n++)g[n]=ye(o.getX(n),o.getZ(n));e.setAttribute("aS",new l.BufferAttribute(g,1)),D.add(new l.Mesh(e,ca(B)))}await M.yield();const _e=la(B),he=Wt(B,!1),$t=Wt(B,!0),ae=(e,o,g,n,i,t,a,d=.18)=>{const h=[e.clone()],f=o.clone().normalize(),m=e.clone(),s=g/n;for(let r=1;r<=n&&(f.x+=t.range(-d,d),f.z+=t.range(-d,d),f.y+=i+t.range(-.08,.08),f.normalize(),m.addScaledVector(f,s),!(a&&!Ze(m,a)));r++)h.push(m.clone());return h.length>=3?h:null},Je=(e,o,g,n,i)=>{let t=[],a=0;const d=o.length,h=f=>{if(t.length>=3){const m=a,s=t.length;e.add(t,typeof g=="function"?r=>g((m+r*(s-1))/(d-1)):g,n)}t=[]};for(let f=0;f<d;f++)Ze(o[f],i)?(t.length||(a=f),t.push(o[f])):h(f);h(d)},et=(e,o,g,n)=>o>1&&S.distanceTo(e,o,g)>6.6+n*.55,be=[],K=[];{const e=p(0,0,0),o=p(0,0,0),g=p(0,0,0);for(let n=108;n<=252;n+=6)S.posAtDist(n,e),S.posAtDist(n+40,o),o.sub(e).normalize(),K.push(e.x,e.y,e.z,o.x,o.y,o.z,64,.2,10,5.7),n>=156&&(g.set(-e.x,31-e.y,-e.z).normalize(),K.push(e.x,e.y,e.z,g.x,g.y,g.z,120,.13,7.5,5.7),o.lerp(g,.45).normalize(),K.push(e.x,e.y,e.z,o.x,o.y,o.z,84,.2,9,5.7))}const It=(e,o,g,n)=>{for(let i=0;i<K.length;i+=10){const t=e-K[i],a=o-K[i+1],d=g-K[i+2],h=t*K[i+3]+a*K[i+4]+d*K[i+5];if(h<4||h>K[i+6])continue;const f=a-h*K[i+4],m=Math.max(0,t*t+a*a+d*d-h*h-f*f),s=2.4+K[i+7]*h,r=Math.min(K[i+8],s)+n*.4,v=Math.min(K[i+9],s)+n*.3;if(m/(r*r)+f*f/(v*v)<1)return!0}return!1},Ve=(e,o,g,n,i,t,a,d,h)=>{const f=o.x+a.range(-g,g),m=o.y-a.range(.2,n),s=o.z+a.range(-g,g);if(d?!(m>1&&S.distanceTo(f,m,s)>6.1+i*.5):!et(f,m,s,i))return;const r=a()<.55,v=(r?a.range(.55,.95):a.range(.1,.55))*a.sign(),y=a(),b=a()*6.283;h||t>.15&&t<.45&&It(f,m,s,i)||e.add(f,m,s,i,y,t,1,b,v,.62,3+n*2)};function gt(e,o,g,n,i,t,a){i<2&&be.push(g,n,a);const d=t.range(34,42),h=t.range(1,1.45),f=t()*9,m=[],s=i===0?9:i===1?6:4,r=t.range(-.04,.04),v=t.range(-.04,.04);for(let x=0;x<=s;x++){const z=x/s,C=-1+z*(d+1);m.push(p(g+r*C+.5*Math.sin(z*5+f),C,n+v*C+.5*Math.cos(z*4+f)))}e.add(m,x=>h*(1-.72*x)*(1+1.1*Math.exp(-x*14)),i===0?7:i===1?5:4);const y=x=>{const z=(x+1)/(d+1)*s,C=Math.min(s-1,Math.floor(z));return m[C].clone().lerp(m[C+1],z-C)},b=i===0?t.int(6,8):i===1?t.int(4,5):0,c=i===0?1:1.5;for(let x=0;x<b;x++){const z=i===0&&x>=b-2,C=z?t.range(27,d-3):t.range(10.5,23),T=x/b*6.283+t.range(-.5,.5),F=z?t.range(6,9):t.range(9,15),_=ae(y(C),p(Math.sin(T),t.range(.25,.6),Math.cos(T)),F,i===0?5:4,-.07,t,7.2);if(!_)continue;const J=h*t.range(.24,.34);e.add(_,q=>J*(1-.75*q),i===0?4:3);for(let q=1;q<_.length;q++)for(let X=0;X<3;X++)t()<V&&Ve(o,_[q],2.2*c,2.2,t.range(1.9,2.9)*(i===0?.84:c),a,t,!1,i===0&&X===2);if(i===0)for(let q=0;q<2;q++){const X=_[t.int(1,_.length-2)],se=T+t.range(.6,1.4)*t.sign(),ee=ae(X,p(Math.sin(se),t.range(-.1,.4),Math.cos(se)),t.range(4,6.5),3,-.1,t,7);if(ee){e.add(ee,re=>J*.42*(1-.7*re),3);for(let re=1;re<ee.length;re++)for(let j=0;j<2;j++)t()<V&&Ve(o,ee[re],1.8,2.4,t.range(1.8,2.7)*.88,a,t)}}}const u=i===2?15:10,w=m[s];for(let x=0;x<u;x++)if(t()<V){const z=t()*6.283,C=t.range(1.5,i===2?9:7);Ve(o,p(w.x+Math.sin(z)*C,t.range(i===2?14:25,d+2),w.z+Math.cos(z)*C),.5,1,t.range(2.2,3.2)*(i===2?2.1:1.3),a,t)}}function Et(e,o,g,n,i,t,a,d){const h=a.range(18,25),f=a.range(.3,.44),m=a()*9,s=[],r=t===0?7:t===1?5:3,v=a.range(-.05,.05),y=a.range(-.05,.05);for(let u=0;u<=r;u++){const w=u/r,x=-.5+w*(h+.5);s.push(p(n+v*x+.35*Math.sin(w*4+m),x,i+y*x+.35*Math.cos(w*3+m)))}e.add(s,u=>f*(1-.8*u)*(1+.5*Math.exp(-u*20)),t===0?6:t===1?5:4);const b=t===0?7:t===1?4:0,c=t===0?1:1.55;for(let u=0;u<b;u++){const w=a.range(.32,.95)*r,x=Math.min(r-1,Math.floor(w)),z=s[x].clone().lerp(s[x+1],w-x),C=a()*6.283,T=ae(z,p(Math.sin(C),a.range(.5,1.1),Math.cos(C)),a.range(3,6),4,-.2,a,6.4,.12);if(T){o.add(T,F=>.085*(1-.6*F),3);for(let F=1;F<T.length;F++)for(let _=0;_<(t===0?5:3);_++)if(a()<V){const J=a.range(.5,.82)*c,q=T[F].x+a.range(-.9,.9),X=a.range(.2,2.4),se=T[F].y-X,ee=T[F].z+a.range(-.9,.9);et(q,se,ee,J)&&g.add(q,se,ee,J,a(),d,a()<.36?.5:0,a()*6.283,a.range(-.35,.35),.72,X+.6)}}}if(t===2)for(let u=0;u<12;u++){const w=a()*6.283,x=a.range(.5,3.2);g.add(s[r].x+Math.sin(w)*x,a.range(h*.4,h+1),s[r].z+Math.cos(w)*x,a.range(1.4,2.2),a(),d,a()<.36?.5:0,a()*6.283,a.range(-.35,.35),.72,2)}}const mt=.36,xt=new Re,tt=(e,o,g=1,n=1.3)=>{const i=o.range(1.5,2.4)*g,t=e.x+o.range(-n,n),a=e.y-o.range(.2,1.8),d=e.z+o.range(-n,n);et(t,a,d,i)&&xt.add(t,a,d,i,o(),mt,3,o()*6.283,o.range(-.6,.6),.68,1.5)};function Ot(e,o,g,n,i,t,a){const d=t.range(48,68),h=t.range(.9,1.3),f=t()*9,m=[],s=i===1?6:4;for(let v=0;v<=s;v++){const y=v/s,b=-1+y*(d*.62+1);m.push(p(g+.6*Math.sin(y*4+f),b,n+.6*Math.cos(y*3+f)))}if(e.add(m,v=>h*(1-.6*v)*(1+.9*Math.exp(-v*14)),i===1?5:4),i===1)for(let v=0;v<3;v++){const y=v/3*6.283+f,b=2.4+1.5*Math.sin(f*3+v*2.1)**2,c=[];for(let u=0;u<=2;u++){const w=u/2;c.push(p(m[0].x+Math.sin(y)*(.4+b*w),2.6*(1-w)*(1-w)-.25,m[0].z+Math.cos(y)*(.4+b*w)))}e.add(c,u=>h*(.5-.36*u),4)}const r=i===1?5:3;for(let v=0;v<r;v++){const y=t.int(Math.floor(s/2),s),b=v/r*6.283+t.range(-.4,.4),c=ae(m[y],p(Math.sin(b)*.6,1,Math.cos(b)*.6),d*t.range(.3,.42),5,.02,t,7,.14);if(c)if(e.add(c,u=>h*.36*(1-.8*u),i===1?4:3),i===1)for(let u=0;u<4;u++){const w=c[t.int(1,c.length-1)],x=t()*6.283,z=ae(w,p(Math.sin(x),t.range(.2,1),Math.cos(x)),t.range(4,9),3,.05,t,7,.2);if(z){e.add(z,C=>.11*(1-.6*C),3),t()<.3&&o.add(z[1].x,z[1].y-.4,z[1].z,t.range(.9,1.6),t(),a,2,t()*6.283,t.range(-.4,.4),.7,1);for(let C=1;C<z.length;C++)t()<V&&tt(z[C],t,1.5,2)}}else for(let u=2;u<c.length;u++)t()<V&&tt(c[u],t,2.6,3)}}const wt=new fe,yt=new fe,We=new fe,bt=new fe,Mt=new Re,Be=new Re,oe=new Re;{const e=k.fork("forest"),o=7.5;let g=0;for(let n=-255;n<352;n+=o){for(let i=-330;i<275;i+=o){const t=i+e.range(.1,.9)*o,a=n+e.range(.1,.9)*o,d=e();if(Math.hypot(t,a)<64||Math.abs(t-U)<6||a>54&&t<34&&t>22-Math.max(0,330-a)*.1)continue;const h=S.nearestXZ(t,a),f=h.dist;if(f>270)continue;const m=(t-ve)*E+(a-de)*O,s=(t-ve)*-O+(a-de)*E,r=.42*m+24-Math.abs(s),v=m>58&&r>0?2:a>214+12*$.n2(t*.02,3.1)?0:1,y=v===1&&(Math.hypot(t,a)<104||m>30&&r>-46)?1.7:1,b=e.fork("t"+i+"_"+n);if(v===0){if(f<5.8)continue;const c=f<32?0:f<75?1:2;d<(c===0?.62:c===1?.3:.12)&&Et(yt,wt,Mt,t,a,c,b,h.u)}else if(v===1){if(f<10.5)continue;const c=f<30?0:f<84?1:2;d<(c===0?.2:c===1?.13:.075)*y&&gt(We,Be,t,a,c,b,h.u)}else{if(Math.abs(s)<27&&m<ft+14)continue;const c=f<62?1:2;d<(c===1?.1:.04)&&Ot(bt,oe,t,a,c,b,h.u)}}++g%2===0&&await M.yield()}}{const e=k.fork("tunnel"),o=p(0,0,0),g=p(0,0,0);let n=0;const i=(t,a,d,h,f,m,s)=>{const r=s?f+e.range(8.6,11.5):f-e.range(8.6,10.5);if(r<3.2)return;const v=-d*e.range(1,9),y=e.range(-5,5),b=[];for(let c=0;c<=7;c++){const u=c/7,w=h+(v-h)*u,x=y*u;b.push(p(o.x+-g.z*w+g.x*x,r+(s?1.6:-1.2)*Math.sin(u*Math.PI)-(s?1.2:-.6)*u,o.z+g.x*w+g.z*x))}b[0].set(t,r-(s?2:-1),a),Je(We,b,c=>.36*(1-.7*c),4,7.3);for(let c=1;c<=7;c++)for(let u=0;u<4;u++)e()<V&&Ve(Be,b[c],2.6,s?2.8:1.4,e.range(2,3.2)*.88,m,e,!0)};for(let t=119;t<247;t+=6.4,n++){S.posAtDist(t,o),S.tangentAtDist(t,g);const a=Math.hypot(g.x,g.z)||1;g.x/=a,g.z/=a;for(const d of[-1,1]){const h=d*e.range(9.8,13.2),f=o.x-g.z*h,m=o.z+g.x*h,s=e.fork("t"+n+d);if(Math.abs(f-U)<7.5||f<35.5&&f>16-Math.max(0,330-m)*.1||Math.hypot(f,m)<66||S.nearestXZ(f,m).dist<9.3)continue;const r=ye(f,m);gt(We,Be,f,m,0,s,r),i(f,m,d,h,o.y,r,!0),n%2===(d>0?0:1)&&i(f,m,d,h,o.y,r,!1)}n%2===1&&await M.yield()}}const Le=[],Rt=Math.atan2(E,O),I=new fe,ne=(e,o,g)=>p(ve+E*e-O*o,g,de+O*e+E*o),at=Math.sqrt(me*me-(me-we)*(me-we)),zt=e=>we-(me-Math.sqrt(Math.max(0,me*me-e*e)));{const e=k.fork("avenue"),o=(n,i,t)=>{for(let a=2;a<n.length;a++)for(let d=0;d<i;d++){if(!Ze(n[a],7))continue;n[a].y>40&&Le.push(n[a]);const h=e()*6.283,f=ae(n[a],p(Math.sin(h),e.range(-.3,.9),Math.cos(h)),e.range(4,10),2,.07,e,6.9,.3);if(f){I.add(f,m=>.12*(1-.6*m),3);for(let m=1;m<f.length;m+=1)e()<.8*V&&tt(f[m],e);e()<.24?oe.add(f[1].x,f[1].y-.5,f[1].z,e.range(1,1.9),e(),t,2,e()*6.283,e.range(-.5,.5),.7,1):P()<.47&&oe.add(f[1].x,f[1].y-.5,f[1].z,P.range(1,1.9),P(),t,2,P()*6.283,P.range(-.5,.5),.7,1)}}};let g=0;for(let n=ct;n<=ft;n+=Ee,g++){const i=pt(Math.min(n,200));for(const t of[-1,1]){const a=n+e.range(-1.2,1.2),d=t*(we+e.range(-.6,.8)),h=e()*9,f=e.range(1.05,1.35),m=[],s=e.range(.7,1.15);for(let r=0;r<=9;r++){const v=r/9,y=-1+v*(Oe+1),b=Math.sin(v*Math.PI);m.push(ne(a+s*b*Math.sin(v*5.2+h),d+t*.5*b+s*.6*b*Math.cos(v*4.4+h),y))}I.add(m,r=>f*(1-.35*r)*(1+.75*Math.exp(-r*16))*(1+.05*Math.sin(r*31+h)),7);for(let r=0,v=e.int(4,5);r<v;r++){const y=r/v*6.283+e.range(-.4,.4),b=e.range(2.6,4.2),c=Math.cos(y),u=Math.sin(y),w=[];for(let x=0;x<=4;x++){const z=x/4;w.push(ne(a+c*(.5+b*z),d+u*(.5+b*z),3.1*(1-z)*(1-z)-.25))}I.add(w,x=>f*(.5-.36*x),4)}for(let r=0,v=e.int(4,6);r<v;r++){const y=e.range(.2,.76)*9,b=Math.floor(y),c=m[b].clone().lerp(m[b+1],y-b),u=e()*6.283,w=ae(c,p(Math.sin(u),e.range(.15,.7),Math.cos(u)),e.range(3.5,8),4,.07,e,6.9,.2);if(w){if(I.add(w,x=>.1*(1-.65*x),3),e()<.55){const x=w[w.length-2];oe.add(x.x,x.y-.5,x.z,e.range(1.1,2.1),e(),i,2,e()*6.283,e.range(-.5,.5),.7,1)}else if(P()<.67){const x=w[w.length-2];oe.add(x.x,x.y-.5,x.z,P.range(1.1,2.1),P(),i,2,P()*6.283,P.range(-.5,.5),.7,1)}}}for(const[r,v,y,b]of[[0,.72,12,6],[Ee*.5,.42,9,5],[-Ee*.5,.42,9,5]]){const c=[];for(let u=0;u<=y;u++){const w=u/y,x=w*at;c.push(ne(a+r*w+.5*Math.sin(w*7+h+r),d/we*zt(x)*1+.4*Math.sin(w*9+h),Oe+x+(r?-2.5*Math.sin(w*Math.PI):0)))}Je(I,c,u=>v*(1-.68*u),b,6.9),o(c,r?1:2,i);for(let u=0,w=r?3:5;u<w;u++){const x=c[P.int(1,y-1)],z=x.x+P.range(-.7,.7),C=x.y-P.range(.3,1.5),T=x.z+P.range(-.7,.7),F=P.range(2,3.6),_=P(),J=Rt+P.range(-.55,.55),q=P.range(-.5,.2);S.distanceTo(z,C,T)>8+F*.5&&oe.add(z,C,T,F,_,i,2,J,q,.8,.6)}}for(let r=0;r<3;r++){const v=Math.atan2(-O*t,E*t)+e.range(-1.1,1.1),y=m[e.int(5,9)],b=ae(y,p(Math.sin(v)*.7,1,Math.cos(v)*.7),e.range(20,34),5,.02,e,7,.14);b&&(I.add(b,c=>f*.34*(1-.8*c),4),o(b,1,i))}for(let r=0;r<2;r++){const v=m[e.int(3,6)],y=Math.atan2(O*t,-E*t)+e.range(-.9,.9),b=ae(v,p(Math.sin(y),.5,Math.cos(y)),e.range(5,8),4,.06,e,7,.16);b&&I.add(b,c=>.2*(1-.7*c),4)}}await M.yield()}for(const[n,i,t]of[[at-.5,[0],.3],[30,[-1,1],.2],[15,[-1,1],.17]])for(const a of i){const d=[];for(let h=ct-4;h<=ft+4;h+=1.9){const f=(h-ct)/Ee%1,m=Math.sin(Math.PI*Math.abs(f));d.push(ne(h,a*(zt(n)+.3),Oe+n+(a?2.6*m:-1.6*m)))}Je(I,d,t,4,6.9)}}await M.yield();for(let e=0,o=Math.round(140*Math.min(1,V));e<o;e++){const g=P.range(102,205),n=ne(g,P.range(2,5.5)*P.sign(),0),i=S.nearestXZ(n.x,n.z).y;oe.add(n.x,Math.min(i+P.range(8,20),Oe+at-3),n.z,P.range(.6,1),P(),mt,4,P()*6.283,P.range(-.6,.6),.68,1.2)}const Xt=S.frameAt(!0,new l.Matrix4,!0),ot=S.endTangent.clone();{const e=k.fork("rose"),o=(a,d,h=0)=>p(Math.cos(d)*a,Math.sin(d)*a,h).applyMatrix4(Xt),g=(a,d,h,f)=>{const m=[];for(let s=0;s<=f;s++)m.push(o(a,s/f*6.2832));I.add(m,d,h)};g(7.8,.46,8,56),g(12.6,.3,6,64);const n=12,i=Math.asin(G(-ot.y,-1,1)),t=Math.atan2(-ot.x,-ot.z);for(let a=0;a<n;a++){const d=a/n*6.2832,h=(a+1)/n*6.2832,f=(d+h)/2;for(const[v,y]of[[d,f],[h,f]]){const b=[];for(let c=0;c<=7;c++){const u=c/7;b.push(o(7.8+4.8*Math.sin(u*Math.PI/2),v+(y-v)*u*u))}I.add(b,.17,4)}const m=[],s=e.range(8,15),r=e.range(-.12,.12);for(let v=0;v<=6;v++){const y=v/6;m.push(o(12.6+s*y,d+r*y*y,-1.5*y*y))}I.add(m,v=>.3*(1-.7*v),5);for(const v of[-1,1]){const y=[];for(let b=0;b<=4;b++){const c=b/4;y.push(o(12.6+s*(.4+.5*c),d+r*.16+v*.17*c,-.6*c))}I.add(y,b=>.15*(1-.6*b),3)}if(a%2===0){const v=o(10.4,f,.05);oe.add(v.x,v.y,v.z,3.3,e(),.99,2,t,i,.8,.2)}}}const Me=async(e,o,g,n,i,t)=>{if(!e.i.length)return null;const a=new l.Mesh(e.geometry(),o);return a.geometry.boundingSphere=new l.Sphere(p(g,n,i),t),D.add(a),await M.yield(),a},kt=[await Me(yt,$t,U,10,290,330),await Me(wt,he,U,10,290,330)];await Me(We,he,0,20,60,470),await Me(bt,he,ve+E*190,30,de+O*190,420),await Me(I,he,ve+E*150,60,de+O*150,190);const Pt=Mt.mesh(_e),Qt=Be.mesh(_e),Ht=oe.mesh(_e),Yt=xt.mesh(_e);D.add(Pt,Qt,Ht,Yt),kt.push(Pt),await M.yield();{const e=k.fork("pools"),o=be.length/3,g=Math.min(Math.round(300*Math.min(1,Z)),o*2),n=[],i=[];for(let a=0;a<g;a++){const d=Math.floor(e()*o)*3;n.push(be[d]+e.range(-6,6),be[d+1]+e.range(-6,6),e.range(8,15),e()),i.push(be[d+2],e())}const t=new l.Mesh(ue(new l.PlaneGeometry(1,1).rotateX(-Math.PI/2),[["iP",n,4],["iQ",i,2]],g,p(0,0,90),420),da(B));t.frustumCulled=!1,t.renderOrder=2,D.add(t)}await M.yield();{const e=k.fork("flora"),o=[],g=[],n=p(0,0,0),i=p(0,0,0),t=(s,r,v,y,b,c)=>{if(Math.abs(s-U)<4.5||S.distanceTo(s,v*.5,r)<5.6)return;const u=e();c||(o.push(s,0,r,v),g.push(y,u,ye(s,r),b))},a=(s,r,v,y,b)=>{Math.abs(s-U)<4.5||Math.hypot(s,r)<7.5||S.distanceTo(s,v*.5,r)<5.6||(o.push(s,0,r,v),g.push(y,P(),ye(s,r),b))};for(let s=346;s>-170;s-=(s>212?1.25:3.4)/V)for(const r of[-1,1])e()<.8&&t(U+r*e.range(5.9,7.2),s+e.range(-.5,.5),e.range(1.5,2.3),1,.5);const d=Math.round(3e3*V),h=Math.round(1100*V);for(let s=0;s<d+h;s++){const r=s>=d,v=r?e.range(.12,.74):e()<.6?e.range(0,.2):e.range(.2,.76),y=e.range(4,r?34:30)*e.sign();S.pointAt(v,n),S.tangentAt(v,i);const b=n.x-i.z*y,c=n.z+i.x*y;if(r){const u=e.int(2,3);for(let w=0;w<u;w++)t(b+e.range(-.3,.3),c+e.range(-.3,.3),e.range(1.3,2.4),2,.85)}else{const u=e.range(.5,1.15),w=v>.2;t(b,c,w?u*1.5:u,0,1.7,w&&$.n2(b*.05+7.3,c*.05)<-.1)}(s&511)===511&&await M.yield()}for(let s=0,r=Math.round(1700*V);s<r;s++){const v=e.range(0,.19),y=e.range(4.7,15)*e.sign();S.pointAt(v,n),S.tangentAt(v,i),t(n.x-i.z*y,n.z+i.x*y,e.range(.7,1.5),0,1.5),(s&511)===511&&await M.yield()}for(let s=0,r=Math.round(1500*V);s<r;s++){const v=P.range(.3,.78),y=P.range(4.5,26)*P.sign();S.pointAt(v,n),S.tangentAt(v,i);const b=n.x-i.z*y,c=n.z+i.x*y;if($.n2(b*.05+7.3,c*.05)>.05)for(let u=0,w=P.int(2,4);u<w;u++)a(b+P.range(-1.7,1.7),c+P.range(-1.7,1.7),P.range(.9,1.9),0,1.7);(s&31)===31&&await M.yield()}for(let s=0,r=Math.round(420*V);s<r;s++){const v=P.range(.325,.49),y=P.range(4.5,20)*P.sign();S.pointAt(v,n),S.tangentAt(v,i);const b=n.x-i.z*y,c=n.z+i.x*y;for(let u=0,w=P.int(3,5);u<w;u++)a(b+P.range(-1,1),c+P.range(-1,1),P.range(1.6,3),2,.9);(s&31)===31&&await M.yield()}const f=new l.PlaneGeometry(1,1).translate(0,.5,0),m=new l.Mesh(ue(f,[["iP",o,4],["iQ",g,4]],o.length/4,p(0,0,90),420),va(B));m.frustumCulled=!1,D.add(m)}await M.yield();{const e=k.fork("koi"),o=[];for(let i=0;i<12;i++)o.push(U+e.range(-2.4,2.4),224+(i+e())*8.4,e(),Qe?e.range(1.4,2.2):e.range(1.3,1.8));for(let i=0;i<9;i++)o.push(U+e.range(-2.4,2.4),-55+(i+e())*13,e(),Qe?e.range(1.4,2.2):e.range(1.3,1.8));const g=new l.PlaneGeometry(1,1).rotateX(-Math.PI/2),n=new l.Mesh(ue(g,[["iK",o,4]],o.length/4,p(U,0,140),260),ua(B,Qe));n.frustumCulled=!1,D.add(n)}const De={uGust:{value:.6},uChip:{value:new l.Vector4(.15,.7,.16,1)},uChipCol:{value:new l.Color(1,1,1)},uBox:{value:p(70,44,70)}};let Ct=null;{const e=k.fork("chips"),o=Math.round(7600*Z),g=new Float32Array(o*4);for(let t=0;t<o*4;t++)g[t]=e();const n=new l.PlaneGeometry(1,1),i=new l.Mesh(ue(n,[["iP",g,4]],o,p(0,0,0),1),Bt(B,De));if(i.frustumCulled=!1,D.add(i),W.rain){Ct={uGust:{value:0},uChip:{value:new l.Vector4(1,26,.11,0)},uChipCol:{value:Ge.clone().multiplyScalar(.62)},uBox:{value:p(60,40,60)}};const t=Math.round(1500*Z),a=new Float32Array(t*4);for(let h=0;h<t*4;h++)a[h]=e();const d=new l.Mesh(ue(n,[["iP",a,4]],t,p(0,0,0),1),Bt(B,Ct));d.frustumCulled=!1,D.add(d)}}await M.yield();const ze={kingfisher:{L:.5,S:.4,c:.4,sweep:.1,tail:.14,beak:.2,scale:1.4,flap:13,amp:.95,glide:.5},swallow:{L:.5,S:.44,c:.36,sweep:.26,tail:.34,beak:.07,scale:1.4,flap:9,amp:.8,glide:.85},moth:{L:.36,S:.5,c:.6,sweep:-.06,tail:.04,beak:.03,scale:2,flap:5.5,amp:1.05,glide:.1}}[qt],nt={uGrp:{value:[0,1,2].map(()=>new l.Vector4)},uGrpV:{value:[0,1,2].map(()=>new l.Vector4(0,0,1,0))},uBird:{value:p(ze.flap,ze.amp,ze.glide)}};{const e=ze,o=e.L/2,g=[[0,[0,0,o],[0,.16,0],[0,0,-o],[0,-.16,0]],[5,[0,0,o],[.1,0,0],[0,0,-o],[-.1,0,0]],[1,[-.03,0,e.c/2],[-e.S,0,e.c/2-e.sweep],[-e.S,0,-e.c*.1-e.sweep],[-.03,0,-e.c/2]],[2,[.03,0,e.c/2],[e.S,0,e.c/2-e.sweep],[e.S,0,-e.c*.1-e.sweep],[.03,0,-e.c/2]],[3,[-e.tail*.5,0,-o-e.tail],[0,0,-o+.06],[e.tail*.5,0,-o-e.tail],[0,0,-o-e.tail*.5]],[4,[0,.075,o-.04],[0,.01,o+e.beak],[0,-.06,o-.04],[0,0,o-.14]]],n=[],i=[],t=[],a=[];g.forEach(([v,y,b,c,u],w)=>{for(const[x,z]of[[y,[0,0]],[b,[1,0]],[c,[1,1]],[u,[0,1]]])n.push(...x),i.push(v),t.push(...z);a.push(w*4,w*4+1,w*4+2,w*4,w*4+2,w*4+3)});const d=new l.BufferGeometry;d.setAttribute("position",new l.Float32BufferAttribute(n,3)),d.setAttribute("aPart",new l.Float32BufferAttribute(i,1)),d.setAttribute("aUv",new l.Float32BufferAttribute(t,2)),d.setIndex(a);const h=k.fork("birds"),f=Math.round(G(20*(R.density??1),14,26)),m=[],s=[];for(let v=0;v<3;v++)for(let y=0;y<f;y++)m.push(h.range(-1.8,1.8),h.range(-2.4,2.4),(y/f-.5)*30+h.range(-.6,.6),h()),s.push(v);const r=new l.Mesh(ue(d,[["iO",m,4],["iG",s,1]],s.length,p(0,0,0),1),pa(B,nt));r.frustumCulled=!1,D.add(r)}const Zt=[[-.03,.2,1],[.19,.37,-1],[.33,.5,1]],ge=p(0,0,0),qe=p(0,0,0),it=p(0,0,0),Ft=(e,o,g)=>{const[n,i,t]=Zt[e],a=(o-n)/(i-n),d=L(0,.45,a),h=L(.75,1,a),f=A(A(72,11+e*1.5,d),46,h),m=t*A(A(40,-8.5,d),-34,h),s=A(A(7,-2.5,d),13,h),r=o*S.length+f;return S.posAtDist(r,g),S.tangentAtDist(r,it),g.x+=-it.z*m,g.z+=it.x*m,g.y=Math.max(g.y+s,5.2),a},Jt=new l.Color(lt[6]);function ea(e,o,g){const n=new l.Group,i={uTint:{value:e},uTint2:{value:o},uCell:{value:new l.Vector4(10.5,.9,.12,0)}},t={uTint:{value:e.clone().multiplyScalar(.8)},uTint2:{value:e.clone().lerp(o,.55)},uCell:{value:new l.Vector4(24,.3,.8,0)}},a=vt(B,i),d=vt(B,t),h=(F,_,J,q,X,se=1,ee=1,re=1)=>{const j=new l.Mesh(F,_);return j.position.set(J,q,X),j.scale.set(se,ee,re),j.frustumCulled=!1,n.add(j),j};h(new l.SphereGeometry(.22,22,14),a,0,-.78,-1.73,1,.74,.95);const f=new l.SphereGeometry(.175,22,14);for(const F of[-1,1])h(f,d,F*.205,-.85,-1.71,.95,.8,1.2);h(new l.SphereGeometry(.3,22,14),a,0,-1,-1.22,1,1,1.45),h(new l.CylinderGeometry(.06,.17,3.5,10,8).rotateX(Math.PI/2),a,0,-1.03,1.2);const m=new fe;for(const F of[-1,1])m.add([p(F*.07,-.64,-1.84),p(F*.11,-.58,-1.99),p(F*.2,-.57,-2.12),p(F*.3,-.59,-2.2)],_=>.016-.008*_,4),m.add([p(F*.12,-.72,-1.36),p(F*.27,-.78,-1.3),p(F*.6,-.72,-1.36)],_=>.02-.012*_,4),m.add([p(F*.12,-.74,-1.1),p(F*.27,-.84,-1.05),p(F*.62,-.8,-.98)],_=>.02-.012*_,4);m.add([p(0,-.7,-1.02),p(0,-.69,-1.25),p(0,-.75,-1.5),p(0,-.8,-1.56)],.018,4);const s=new l.Mesh(m.geometry(),he);s.frustumCulled=!1,n.add(s);const r=[],v=[],y=[],b=p(0,1,0),c=p(0,0,0),u=p(0,0,0),w=p(0,0,0),x=10,z=(F,_,J,q,X,se,ee)=>{const re=r.length/3;c.set(q,X,se),u.crossVectors(c,b).normalize();for(let j=0;j<=x;j++){const le=j/x*2-1;for(const _t of[.06,1])w.copy(c).multiplyScalar(_t).applyAxisAngle(u,le*ee*(F<0?-1:1)),r.push(F+w.x,_+w.y,J+w.z),v.push(_t,le)}for(let j=0;j<x;j++){const le=re+j*2;y.push(le,le+1,le+2,le+1,le+3,le+2)}};for(const F of[-1,1])z(F*.27,-.78,-1.3,F*2.8,.75,-1.5,.42),z(F*.27,-.84,-1.05,F*2.9,.3,-.5,.36);const C=new l.BufferGeometry;C.setAttribute("position",new l.Float32BufferAttribute(r,3)),C.setAttribute("aFan",new l.Float32BufferAttribute(v,2)),C.setIndex(y);const T=new l.Mesh(C,ha(B,{uWingA:{value:g}}));return T.frustumCulled=!1,T.renderOrder=6,n.add(T),n.userData.wings=T,n}const ke=ea(Jt,new l.Color(.2,.45,1),1);D.add(ke),await M.yield();const Ne=99,St=10.8,je=pt(Ne),ie=new l.Group,ce=new l.Group,ta=p(1.8,1.05,0),Pe={uMuzzle:{value:p(0,0,0)},uBreathDir:{value:p(1,0,0)},uBreath:{value:0}};{const e=Nt==="fox",o={uTint:{value:Ge.clone().multiplyScalar(.85)},uTint2:{value:new l.Color(.62,.8,1)},uCell:{value:new l.Vector4(2.3,.9,0,1)}},g=vt(B,o,{side:l.DoubleSide}),n=(c,u,w)=>{const x=new l.Shape(w.map(([C,T])=>new l.Vector2(C,T)));c.add(new l.Mesh(new l.ShapeGeometry(x),g));const z=w.map(([C,T])=>p(C,T,0));z.push(z[0].clone(),z[1].clone()),u.add(z,.055,4)},i=new fe,t=new fe;n(ie,i,[[1.15,2.45],[.95,3.05],[.35,2.96],[-.5,2.8],[-1.25,2.98],[-1.68,2.62],[-1.62,1.95],[-1.1,1.74],[-.4,1.96],[.45,1.58],[.95,1.74]]),e||i.add([p(-1.64,2.72,0),p(-1.86,2.62,0),p(-1.98,2.36,0)],c=>.07-.03*c,4),e&&n(ie,i,[[-1.5,2.7],[-2.7,3.35],[-3.4,2.7],[-2.6,1.95],[-1.5,2.2]]);for(const[c,u]of[[.22,0],[-.22,.12]])i.add([p(.8+u,1.95,c),p(.72+u,1.4,c),p(.9+u,.95,c),p(.84+u,.4,c),p(.78+u*2,0,c)],w=>.13-.07*w,5),i.add([p(-1.3-u,2.1,c),p(-1.52-u,1.15,c),p(-1.22-u,.62,c),p(-1.27-u*2,0,c)],w=>.15-.09*w,5);const a=.95,d=2.75;n(ce,t,[[.05,-.55],[-.2,.2],[.72,1.5],[1.08,1.12],[.45,-.2]]),n(ce,t,[[.7,1.52],[1.02,1.12],[1.78,.92],[1.84,1.14],[1.12,1.68]]);const h=e?.75:.45;if(t.add([p(.9,1.6,.1),p(.7,1.6+h,.25),p(.62,1.55,.1)],.05,4),t.add([p(.9,1.6,-.1),p(.75,1.6+h,-.25),p(.66,1.55,-.1)],.05,4),!e)for(const c of[.2,-.2]){const u=[];for(let w=0;w<=8;w++){const x=w/8;u.push(p(.98-.9*x+.9*x*x,1.62+2.1*x,c*(1+2.2*x)))}t.add(u,w=>.12-.07*w,5);for(const w of[1,2,4,5,7]){const x=u[w],z=.75+.12*w;t.add([x,p(x.x+.42,x.y+.28*z,x.z),p(x.x+.62,x.y+.8*z,x.z+c*.5),p(x.x+.6,x.y+1.2*z,x.z+c*.7)],C=>.075-.045*C,4)}}ie.add(new l.Mesh(i.geometry(),he)),ce.add(new l.Mesh(t.geometry(),he)),ce.position.set(a,d,0),ie.add(ce);const f=e?.95:1.45,m=ne(Ne,St,0);ie.position.copy(m),ie.scale.setScalar(f);const s=ne(Ne-34,0,0);ie.rotation.y=Math.atan2(s.x-m.x,s.z-m.z)+.3+Math.PI,D.add(ie);const r=k.fork("breath"),v=28,y=[];for(let c=0;c<v;c++)y.push(r.range(-1,1),r.range(-.6,1),r.range(-1,1),r());const b=new l.Mesh(ue(new l.PlaneGeometry(1,1),[["iP",y,4]],v,p(0,0,0),1),Y(B,{side:l.DoubleSide,extra:Pe,vs:`attribute vec4 iP; uniform vec3 uMuzzle, uBreathDir, uPearl; uniform float uTime, uBreath; varying vec2 vUv; varying vec3 vC;
          ${Q}
          void main(){ float r = iP.w, life = clamp(fract(uTime * 0.3) * 2.4 - r * 0.6, 0., 1.);
            vec3 c = uMuzzle + uBreathDir * (life * 1.7) + iP.xyz * life * 0.6 + vec3(0., life * life * 0.6, 0.);
            vec4 mvPosition = viewMatrix * vec4(c, 1.); float a = r * 40. + uTime * 2.;
            mvPosition.xy += vec2(position.x * cos(a) - position.y * sin(a), position.x * sin(a) + position.y * cos(a)) * 0.2 * sin(3.1416 * life) * uBreath;
            vUv = position.xy * 2.; vC = uPearl * 1.3; gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fs:`varying vec2 vUv; varying vec3 vC;
          ${H}
          void main(){ if (abs(vUv.x) + abs(vUv.y) > 1.) discard; gl_FragColor = vec4(vC, 1.);
            #include <fog_fragment>
          }`}));b.frustumCulled=!1,D.add(b)}if(jt&&Le.length>20){const e=k.fork("thaw"),o=Math.round(1500*Z),g=[],n=[];for(let t=0;t<o;t++){const a=e.range(118,214),d=ne(a,e.range(3,15)*e.sign(),.15),h=Le[e.int(0,Le.length-1)],f=e.range(0,1)*.35+.65*G((a-118)/96,0,1);g.push(d.x,d.y,d.z,e()),n.push(h.x+e.range(-1.5,1.5),h.y-e.range(.3,3.5),h.z+e.range(-1.5,1.5),f)}const i=new l.Mesh(ue(new l.PlaneGeometry(1,1),[["iS",g,4],["iT",n,4]],o,p(0,0,0),1),Y(B,{side:l.DoubleSide,vs:N+`attribute vec4 iS, iT; varying vec2 vUv; varying vec3 vCol, vN, vWp; varying float vR;
          ${Q}
          void main(){
            float r = iS.w, w = clamp((uU - 0.85 - iT.w * 0.085) / 0.05, 0., 1.), e = w * w * (3. - 2. * w), arc = sin(3.1416 * e);
            vec3 c = mix(iS.xyz, iT.xyz, e); c.xz += vec2(sin(e * 6. + r * 40.), cos(e * 5. + r * 23.)) * 3. * arc; c.y += arc * 3.;
            c += sway(c, 3.) * step(0.999, w);
            float yaw = r * 6.283 + 0.35 * sin(uTime * 2.1 + r * 50.), tilt = 0.3 * sin(uTime * 1.7 + r * 31.);
            vec3 X = vec3(cos(yaw), 0., -sin(yaw)), N = vec3(sin(yaw) * cos(tilt), sin(tilt), cos(yaw) * cos(tilt)), Y = cross(N, X);
            vec3 ax = normalize(vec3(sin(r * 90.), 0.35, cos(r * 90.))); float ang = (1. - e) * 12. * (0.4 + r) * step(0.001, w);
            X = rotAx(X, ax, ang); Y = rotAx(Y, ax, ang); N = rotAx(N, ax, ang);
            float sz = (0.8 + 0.6 * fract(r * 9.)) * smoothstep(0., 0.06, w);
            vec3 lp = c + (X * position.x * 0.8 + Y * position.y * 1.2) * sz;
            vUv = position.xy * 2.; vN = N; vR = r; vCol = fam(0., 0.15 + 0.75 * fract(r * 3.7)); vWp = lp;
            vec4 mvPosition = viewMatrix * vec4(lp, 1.); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fs:N+`varying vec2 vUv; varying vec3 vCol, vN, vWp; varying float vR;
          ${H}
          void main(){
            float u = vUv.x, v = vUv.y;
            float w = v < 0. ? 0.84 * pow(max(v + 1., 0.), 0.7) : 0.84 * sqrt(max(1. - v * v, 0.));
            float e = w - abs(u); if (e < 0.) discard;
            float fw = (abs(dFdx(u)) + abs(dFdy(u)) + abs(dFdx(v)) + abs(dFdy(v))) * 0.6, bw = max(0.12, 1.5 * fw);
            vec3 V = normalize(vWp - cameraPosition);
            vec3 glass = vCol * sheet(V) * mix(0.45, 1., smoothstep(0., 0.75, abs(dot(normalize(vN), V)))) * (0.8 + 0.2 * sin(v * 3.2 + vR * 30.)) * uGlassGain;
            gl_FragColor = vec4(mix(glass, mix(glass * 0.72, uLead, 1. - smoothstep(0.18, 0.5, fw)), 1. - smoothstep(bw * 0.65, bw, e)), 1.);
            #include <fog_fragment>
          }`}));i.frustumCulled=!1,D.add(i)}await M.yield();const st=pe.uniforms.uFam.value,Ke=[st[2].clone().multiplyScalar(1.3),st[6].clone().multiplyScalar(1.4),st[10].clone().multiplyScalar(1.3),Ge.clone().multiplyScalar(Se==="evening"?1.3:.8)],$e=p(0,0,0),rt=p(0,0,0),aa=new l.Quaternion,At=new l.Euler,ma=new l.Matrix4,Ut=p(0,0,0),xa=p(0,0,0),wa=p(0,1,0),oa=S.end.clone(),na=ne(Ne,St-2,5.2),Gt=new l.Quaternion,ia=p(1,1,1);function Tt(e,o,g,n){pe.update(e,o),pe.setProgress(n),B.uU.value=n,Te.position.setFromMatrixPosition(g.matrixWorld),pe.uniforms.uHeroFog.value=A(.3,1,L(.1,.24,n));const i=L(.16,.22,n),t=L(.5,.56,n),a=L(.64,.74,n),d=De.uChip.value;De.uChipCol.value.copy(Ke[0]).lerp(Ke[1],i).lerp(Ke[2],t).lerp(Ke[3],a),d.x=A(A(.045,.021,i),W.rain?.42:1,a),d.y=A(.7,2.1,a),d.z=A(.2,.24,a),De.uGust.value=A(.6,2.8,a),S.tangentAt(n,$e),S.tangentAt(Math.min(1,n+.02),rt);const h=$e.z*rt.x-$e.x*rt.z;At.set(G($e.y,-.6,0)*.3+.012*Math.sin(o*1.3),0,G(-h*1.5,-.3,.3)+.02*Math.sin(o*.9)),ke.visible=n>0&&!M.through,g.matrixWorld.decompose(ke.position,Gt,ia),ke.quaternion.copy(Gt).multiply(aa.setFromEuler(At)),ke.position.y+=.012*Math.sin(o*2.1);for(let s=0;s<3;s++){const r=Ft(s,n,ge),v=nt.uGrp.value[s],y=nt.uGrpV.value[s];if(r<=0||r>=1){y.x=0;continue}Ft(s,n+.003,qe);const b=qe.x-ge.x,c=qe.y-ge.y,u=qe.z-ge.z;v.set(ge.x,ge.y,ge.z,Math.atan2(b,u)),y.set(ze.scale*L(0,.04,r)*(1-L(.96,1,r)),G(Math.atan2(c,Math.hypot(b,u)+.001),-.6,.6),A(1,.75,L(.2,.5,r)),0)}const f=L(je-.105,je-.06,n);ce.rotation.z=A(-1.2,.12,f)+.03*Math.sin(o*.8),ie.updateMatrixWorld(!0),ce.localToWorld(Pe.uMuzzle.value.copy(ta)),ce.localToWorld(Ut.set(2.8,.85,0)),Pe.uBreathDir.value.copy(Ut).sub(Pe.uMuzzle.value).normalize(),Pe.uBreath.value=f;const m=n>.6;for(const s of kt)s&&(s.visible=!m)}return Tt(0,0,{matrixWorld:new l.Matrix4().setPosition(S.start)},0),{scene:D,path:S,duration:40,title:Se==="evening"?"The Leaded Forest at Evening":Se==="rain"?"The Leaded Forest in Rain":"The Leaded Forest",ride:"none",style:"none",companion:"none",camera:{fov:62,near:.3,far:3200,lookAhead:22,sway:.8,bank:1.1},pois:[{at:[0,38,0],from:0,to:.2,weight:.22},{at:[0,33,0],from:.3,to:.47,weight:.4},{at:[0,40,0],from:.5,to:.67,weight:.4},{at:na,from:je-.1,to:je-.005,weight:.3},{at:oa,from:.7,to:.94,weight:.45}],portal:{shape:"circle",radius:7,color:W.portal,glow:.7,tilt:!0,revealDistance:280},post:{exposure:W.exposure,bloom:W.bloom,grade:{saturation:W.sat,contrast:1.05,tint:"#ffffff",shadowTint:"#000000",vignette:.24,grain:.018,aberration:0}},update:Tt,dispose(){}}}};export{Ma as default};
