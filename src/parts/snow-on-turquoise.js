import*as i from"three";const U=Math.PI*2,t0=64,y0=48,gt=30.3,E0=40.5,U0=58,V0=15,it=.46,rt=.85,Nt=["#F4F8FB","#19B3AE","#1D4FA8","#13235A","#D59B2C","#EE6A1F","#9C8468"],f0=(l,c,t)=>{const y=Math.min(1,Math.max(0,(t-l)/(c-l)));return y*y*(3-2*y)};function _t(l){if(l>=E0){const t=Math.min(1,(l-E0)/(U0-E0));return V0*Math.pow(Math.max(0,1-Math.pow(t,1.9)),.62)}const c=(E0-l)/(E0-gt);return V0-1.6*c*c}function Dt(){const c=[],t=[],y=[0];for(let p=0;p<=800;p++){const M=U0-(U0-gt)*(p/800);c.push(_t(M)),t.push(M)}for(let p=1;p<=800;p++)y.push(y[p-1]+Math.hypot(c[p]-c[p-1],t[p]-t[p-1]));const W=y[800],m=[];let T=0;for(let p=0;p<=y0;p++){const M=p/y0*W;for(;T<799&&y[T+1]<M;)T++;const P=(M-y[T])/Math.max(1e-6,y[T+1]-y[T]);m.push(new i.Vector2(c[T]+(c[T+1]-c[T])*P,t[T]+(t[T+1]-t[T])*P))}const L=m.map((p,M)=>m[Math.min(y0,M+1)].clone().sub(m[Math.max(0,M-1)]).normalize());return{tab:m,tn:L,length:W}}function R0(l,c,t){const y=Math.min(1,Math.max(0,c))*y0,W=Math.min(y0-1,Math.floor(y)),m=y-W,T=l.tab[W],L=l.tab[W+1],p=l.tn[W],M=l.tn[W+1];let P=p.x+(M.x-p.x)*m,v=p.y+(M.y-p.y)*m;const x=Math.hypot(P,v)||1;return P/=x,v/=x,t.r=T.x+(L.x-T.x)*m,t.y=T.y+(L.y-T.y)*m,t.nr=-v,t.ny=P,t}const Lt=l=>it*f0(.6,6,l)*Math.sqrt(Math.min(1,l/V0)),Et=l=>Math.pow(Math.max(0,Math.cos(l*Math.PI*.5)),rt),B0=`
  uniform vec3 uSunDir, uSunCol, uSky, uBounce;
  uniform float uSunAmt, uTime, uFogCap, uFogTop, uKey, uGhost;
  uniform vec4 uEdge, uShaft, uShaft2;
  vec3 hemi(vec3 n) { return mix(uBounce, uSky, clamp(n.y * 0.5 + 0.5, 0.0, 1.0)); }
  float h11(float p) { p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float h21(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
  vec2 h22(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973)); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.xx + p3.yz) * p3.zy); }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) { return 0.5 * vnoise(p) + 0.3 * vnoise(p * 2.13 + 7.1) + 0.2 * vnoise(p * 4.31 + 3.7); }
  // the sun: full behind the travelling cloud-shadow edge; ahead of it a share (uKey) comes through the squall as a
  // soft key, and one ragged hole in the cloud (uShaft: x, z, 1 / radius, strength) lays a pool of light on the city
  // (uShaft2: a second, wider break in the cloud that travels with the wind over the roofs the flight opens on)
  float shaftAt(vec2 p) { return uShaft.w * (1.0 - smoothstep(0.3, 1.0, length((p - uShaft.xy) * uShaft.z))) + 0.3 * uShaft2.w * (1.0 - smoothstep(0.2, 1.0, length((p - uShaft2.xy) * uShaft2.z))); }
  // far air beyond the cloud-shadow edge lies under the storm: its haze is darker than the lit air this side of it
  float fogShade(vec3 wp, float dist) { return mix(1.0, 0.64, smoothstep(-uEdge.w, uEdge.w * 4.0, dot(wp.xz, uEdge.xy) - uEdge.z) * smoothstep(400.0, 1400.0, dist) * smoothstep(0.5, 1.0, uSunAmt)); }
  float sunMask(vec3 wp) {
    float d = dot(wp.xz, uEdge.xy) - uEdge.z;
    float rag = vnoise(wp.xz * 0.021 + uTime * 0.02) - 0.5;
    float hole = uShaft.w * (1.0 - smoothstep(0.3, 1.0, length((wp.xz - uShaft.xy) * uShaft.z) + rag * 0.5));
    float hole2 = uShaft2.w * (1.0 - smoothstep(0.42, 1.0, length((wp.xz - uShaft2.xy) * uShaft2.z) + rag * 0.3 + (vnoise(wp.xz * 0.0085 - uTime * 0.012 + 5.0) - 0.5) * 0.6));
    hole2 *= 0.42 + 0.58 * smoothstep(0.3, 0.6, vnoise(wp.xz * 0.028 - uTime * vec2(0.19, -0.165)));      // shreds of cloud crossing it on the wind
    return max(uSunAmt * (1.0 - smoothstep(-uEdge.w, uEdge.w, d)), max(uKey, max(hole, hole2)));
  }
`,lt=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogF = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    fogF *= 1.0 - smoothstep(uFogTop, uFogTop + 12.0, vWP.y);      // freezing fog burns off from the top
    // under the hole in the squall the falling snow itself is lit: the air there glows warm
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor * fogShade(vWP, vFogDepth) + uSunCol * 0.1 * shaftAt(vWP.xz), min(fogF, uFogCap));
  #endif
`;function Vt(l,c){return`
  uniform vec4 uBoxA[${l}], uBoxB[${l}], uCyl[${c}];
  float worldShadow(vec3 p, vec3 sd, float cyl) {
    float sh = 1.0;
    vec3 inv = 1.0 / (sign(sd) * max(abs(sd), vec3(1e-3)) + vec3(1e-6));
    for (int i = 0; i < ${l}; i++) {
      vec3 t1 = (uBoxA[i].xyz - p) * inv, t2 = (uBoxB[i].xyz - p) * inv;
      vec3 lo = min(t1, t2), hi = max(t1, t2);
      float tn = max(max(lo.x, lo.y), lo.z), tf = min(min(hi.x, hi.y), hi.z);
      sh *= 1.0 - smoothstep(0.0, 1.2, tf - max(tn, 0.0)) * step(0.0, tf);
    }
    vec2 d = sd.xz; float dl = max(length(d), 1e-3); d /= dl;
    for (int i = 0; i < ${c}; i++) {
      vec2 o = uCyl[i].xy - p.xz; float al = dot(o, d), pe = abs(o.x * d.y - o.y * d.x);
      float y = p.y + sd.y * (al / dl);
      // a negative radius marks a tree crown: it floats above 0.35 h and lets light through
      float rr = abs(uCyl[i].z), crown = step(uCyl[i].z, 0.0);
      float dap = smoothstep(0.34, 0.5, vnoise((p.xz + d * al * 0.35) * 0.9 + float(i) * 7.3)) * (0.55 + 0.45 * step(0.4, vnoise(p.xz * 2.6 + float(i) * 3.1)));
      float band = (1.0 - smoothstep(uCyl[i].w - 2.0, uCyl[i].w + 1.0, y)) * mix(1.0, 0.95 * dap * smoothstep(0.28 * uCyl[i].w, 0.42 * uCyl[i].w, y), crown);
      sh *= 1.0 - cyl * (1.0 - smoothstep(rr * mix(0.75, 0.5, crown), rr * 1.15 + 0.004 * al, pe)) * step(0.0, al) * band;
    }
    return sh;
  }`}const Rt=`
  uniform vec2 uProf[${y0+1}];
  float ribAmp(float r) { return ${it.toFixed(3)} * smoothstep(0.6, 6.0, r) * sqrt(min(1.0, r / ${V0.toFixed(1)})); }
  void profAt(float v, out vec2 p, out vec2 n) {
    float f = clamp(v, 0.0, 1.0) * ${y0}.0;
    float fi = min(floor(f), ${y0-1}.0);
    int i = int(fi);
    vec2 a = uProf[i], b = uProf[i + 1];
    p = mix(a, b, f - fi);
    vec2 tg = b - a; tg = tg / max(length(tg), 1e-5);
    n = vec2(-tg.y, tg.x);
  }
`;function F0(l){return i.UniformsUtils.merge([i.UniformsLib.fog,l||{}])}function A0(l,c){for(const t in c)l.uniforms[t]=c[t];return l}function Ot(l,c){const t=new i.ShaderMaterial({fog:!0,uniforms:F0({uWetAll:{value:0},uWet:{value:[new i.Vector4(-9,0,0,0),new i.Vector4(-9,0,0,0),new i.Vector4(-9,0,0,0)]},...c}),vertexShader:`
      attribute vec3 aNm; attribute vec4 aD;
      uniform vec3 uSunDir;
      varying vec3 vWP, vN, vNm; varying vec4 vD; varying float vTl;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWP = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vNm = normalize(mat3(modelMatrix) * aNm);
        vD = aD;
        float ph = aD.x * ${(U/t0).toFixed(8)};
        vTl = dot(normalize(mat3(modelMatrix) * vec3(-sin(ph), 0.0, cos(ph))), uSunDir);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${B0}
      uniform vec3 cTurq, cCob, cDeep, cOchre, cBuff, cSnow;
      uniform vec4 uWet[3]; uniform float uWetAll;
      varying vec3 vWP, vN, vNm; varying vec4 vD; varying float vTl;
      #include <fog_pars_fragment>
      void main() {
        float q = vD.x, s = vD.y, r0 = vD.z;
        float x = (fract(q + 0.5) - 0.5) * 2.0, ax = abs(x);
        float Lb = pow(max(cos(ax * 1.5708), 0.0), ${rt.toFixed(2)});
        float hp = 3.14159 * r0 / ${t0}.0;
        float A = ${it.toFixed(3)} * smoothstep(0.6, 6.0, r0) * sqrt(min(1.0, r0 / ${V0.toFixed(1)}));
        float pix = max(fwidth(s), fwidth(q) * 2.0 * hp) + 1e-4;      // metres per pixel on the surface
        vec2 tuv = vec2(x * hp, s);
        vec3 N = normalize(vN), V = normalize(cameraPosition - vWP);

        // glazed tiles: rows along the rib, half-bond
        vec2 tc = tuv / vec2(0.24, 0.16); tc.x += 0.5 * floor(tc.y);
        vec2 ti = floor(tc), tf = fract(tc);
        float tfade = 1.0 - smoothstep(0.03, 0.09, pix);
        float th = h21(ti + floor(q + 0.5) * 17.0);
        float joint = max(smoothstep(0.90, 0.99, max(tf.x, 1.0 - tf.x)) , smoothstep(0.86, 0.985, max(tf.y, 1.0 - tf.y))) * tfade;
        float big = fbm(vec2(q * 0.33, s * 0.11) + 3.0), big2 = fbm(vec2(q * 0.09 + 20.0, s * 0.05));
        vec3 alb = cTurq * (0.78 + 0.34 * (th - 0.5) * tfade + 0.36 * (big - 0.5));
        alb = mix(alb, cTurq * vec3(0.55, 1.05, 0.95), smoothstep(0.52, 0.75, big2) * 0.55);       // older, greener firing
        float rep = step(0.9, h21(floor(tc / vec2(7.0, 11.0)) + 5.0 + floor(q * 0.25)));
        alb = mix(alb, mix(cTurq, cCob, 0.22) * 1.12, rep * 0.7);                                     // repaired panels
        // lozenge inlay on the crests, staggered rib to rib
        float ly = fract(s / 3.4 + 0.5 * mod(floor(q + 0.5), 2.0)) - 0.5;
        float ld = ax / 0.42 + abs(ly) * 3.4 / 0.62;
        float lfade = (1.0 - smoothstep(0.12, 0.4, pix)) * smoothstep(0.32, 0.5, hp);
        vec3 inl = mix(mix(cCob, cTurq, 0.38), cOchre * 1.1, 1.0 - smoothstep(0.22, 0.30, ld));
        alb = mix(alb, inl, (1.0 - smoothstep(0.90, 1.0, ld)) * lfade * 0.85);
        // crazing in the glaze (voronoi cracks), only near
        float cfade = 1.0 - smoothstep(0.008, 0.03, pix);
        float craze = 0.0;
        if (cfade > 0.01) {
          vec2 cp = tuv * 11.0, ci = floor(cp), cf = fract(cp); float d1 = 9.0, d2 = 9.0;
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
            vec2 g = vec2(float(i), float(j)); vec2 o = g + h22(ci + g) - cf; float d = dot(o, o);
            if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
          }
          craze = (1.0 - smoothstep(0.0, 0.05 + pix * 22.0, sqrt(d2) - sqrt(d1))) * cfade;
        }
        alb *= 1.0 - 0.38 * craze - 0.45 * joint;
        // lost tiles show the brick, soot and run-off gather in the grooves and under the bulge
        float lost = smoothstep(0.80, 0.84, fbm(ti * 0.21 + 9.0) + 0.16 * th) * tfade;
        vec3 brick = cBuff * (0.55 + 0.4 * th);
        float glaze = 1.0 - lost;
        alb = mix(alb, brick, lost);
        float streak = vnoise(vec2(q * 5.0, s * 0.22)) * vnoise(vec2(q * 1.3 + 4.0, s * 0.6));
        alb *= 1.0 - 0.45 * streak * smoothstep(0.3, 1.0, ax);
        // wet groove left by the slab
        float wet = 0.0;
        for (int k = 0; k < 3; k++) {
          float dq = abs(q - uWet[k].x);
          wet = max(wet, (1.0 - smoothstep(0.34, 0.66, dq)) * step(uWet[k].y, s) * (1.0 - smoothstep(uWet[k].z - 1.2, uWet[k].z + 0.2, s)) * uWet[k].w);
        }
        wet = max(wet, uWetAll * smoothstep(0.45, 0.8, ax) * (0.6 + 0.4 * streak));
        alb = mix(alb, alb * vec3(0.28, 0.5, 0.6), wet);
        // frost and wind-packed snow on up-facing glaze near the crown
        float frost = smoothstep(0.45, 0.95, N.y + (fbm(tuv * 1.7) - 0.5) * 0.7) * (1.0 - wet);
        alb = mix(alb, cSnow * 0.8, frost * 0.85); glaze *= 1.0 - frost;

        // light: sun with rib-to-rib shadowing, blue hemisphere, glaze highlight
        float ndl = max(dot(N, uSunDir), 0.0), ndlW = clamp(dot(N, uSunDir) * 0.6 + 0.4, 0.0, 1.0), ndlM = dot(normalize(vNm), uSunDir);
        float xs = x * sign(vTl);
        float need = A * (1.0 - cos(1.5708 * max(xs, 0.0))) / max((2.0 - xs) * hp, 0.05);
        float have = ndlM / max(abs(vTl), 1e-3);
        float sh = smoothstep(need * 0.6 - 0.03, need * 1.4 + 0.04, have) * smoothstep(-0.06, 0.1, ndlM);
        float mask = sunMask(vWP);
        float ao = mix(0.2, 1.0, pow(Lb, 0.6)) * vD.w;
        vec3 grooveT = mix(vec3(1.0), cCob * 2.2 + 0.08, (1.0 - Lb) * 0.9);      // groove fill drops to cobalt
        vec3 col = alb * (uSunCol * ndlW * sh * mask * 0.74 + hemi(N) * ao * grooveT);
        vec3 H = normalize(uSunDir + V);
        float ndh = max(dot(N, H), 0.0), nv = max(dot(N, V), 0.0);
        float gl = glaze * (0.75 + 0.5 * th) * (1.0 + 0.7 * wet);
        col += uSunCol * (pow(ndh, 320.0) * 3.4 + pow(ndh, 28.0) * 0.05) * gl * sh * mask * step(0.0, ndl - 0.001);
        float fr = 0.04 + 0.96 * pow(max(1.0 - nv, 0.0), 5.0);
        col += hemi(reflect(-V, N)) * fr * 0.3 * gl * ao;
        // spindrift skimming the ribs: streamers of powder driven round the dome by the wind
        float sdr = fbm(vec2(q * 0.2 - uTime * 0.55, s * 0.8 + sin(q * 0.3 + uTime * 0.3))) * vnoise(vec2(q * 0.8 - uTime * 2.2, s * 2.4));
        col += cSnow * (hemi(N) * 0.5 + uSunCol * mask * 0.3) * smoothstep(0.26, 0.5, sdr) * 0.1 * smoothstep(0.5, 0.9, N.y);
        // meltwater beads running down the wet groove and sunlit crests
        vec2 bc = vec2(x * hp * 9.0, (s - uTime * (0.5 + 0.9 * h11(floor(x * hp * 9.0) + floor(q + 0.5)))) * 2.2);
        float bead = step(0.95, h21(floor(bc))) * (1.0 - smoothstep(0.04, 0.16, length(fract(bc) - 0.5)));
        col += uSunCol * bead * (wet * 2.0 + 0.5 * glaze * smoothstep(0.5, 0.9, Lb)) * mask * sh * ndl * (1.0 - smoothstep(0.01, 0.04, pix));
        col += alb * glaze * uGhost * (0.55 + 0.45 * Lb);      // glaze keeps its colour in the flat light of the squall
        gl_FragColor = vec4(col, 1.0);
        ${lt}
      }`});return A0(t,l)}function jt(l,c,t){const y=new i.ShaderMaterial({fog:!0,uniforms:F0({...c}),vertexShader:`
      attribute vec4 aG; attribute vec3 aS;
      uniform vec3 uSunDir, uSlide, uRelV; uniform float uLen; uniform vec4 uShed;
      ${Rt}
      attribute float aE;
      varying vec3 vWP, vN, vLP, vSD; varying vec3 vSh;   // vSh: need, ndlM, |tl|
      varying float vAO; varying vec4 vE; varying vec3 vSl;   // vSl: slab on the move 0..1, metres below its top edge, plate phase
      #include <fog_pars_vertex>
      void main() {
        vec3 p = position, n = normal; vSh = vec3(0.0, 1.0, 1.0); vAO = 1.0; vE = vec4(0.0); vSl = vec3(0.0);
        vLP = position; vSD = uSunDir * mat3(modelMatrix);
        if (aS.x > -0.5) {
          vLP = vec3(0.0, 100.0, 0.0);
          // the great shedding (rare): every other groove lets go in a wave running round from uShed.z
          float shT = uShed.x - abs(mod(aG.x - uShed.z + 3.14159265, 6.2831853) - 3.14159265) * uShed.w - aS.y * 0.7;
          float shS = shT <= 0.0 ? 0.0 : (shT < 2.885 ? 2.6 * shT * shT : 21.63 + 15.0 * (shT - 2.885));
          float sl = aS.x < 0.5 ? uSlide.x : aS.x < 1.5 ? uSlide.y : aS.x < 2.5 ? uSlide.z : shS;
          float rv = aS.x < 0.5 ? uRelV.x : aS.x < 1.5 ? uRelV.y : aS.x < 2.5 ? uRelV.z : uShed.y;
          float moving = step(rv, aG.y) * step(0.001, sl);
          float v2 = aG.y + moving * sl / uLen;
          float gone = smoothstep(0.985, 1.02, v2) * moving;
          vec2 p2, n2; profAt(min(v2, 1.0), p2, n2);
          float A = ribAmp(p2.x), hp = 3.14159 * p2.x / ${t0}.0;
          float lat = aG.z, wf = aG.w * (1.0 - gone);
          float hEdge = A * pow(max(sin(wf * 1.5708), 0.0), ${rt.toFixed(2)});
          // a moving slab rides up, cracks into plates and piles at its front
          float plate = moving * (0.10 + 0.30 * sin(aG.y * 61.0 + aS.y * 40.0) * min(1.0, sl * 0.4));
          vSl = vec3(moving * step(aS.x, 2.5) * min(1.0, 0.25 + sl * 0.4), (aG.y - rv) * uLen, aG.y * 61.0 + aS.y * 40.0);
          float h = hEdge - 0.06 + (aS.z + plate) * (1.0 - lat * lat) * (1.0 - gone);
          float r = p2.x + n2.x * h, y = p2.y + n2.y * h;
          float ph = aG.x + lat * wf * ${(Math.PI/t0).toFixed(8)};
          float c = cos(ph), s = sin(ph);
          p = vec3(r * c, y, r * s);
          vec3 nm = vec3(n2.x * c, n2.y, n2.x * s), tp = vec3(-s, 0.0, c);
          n = normalize(nm + tp * lat * 0.85);
          vec3 sd = normalize(uSunDir * mat3(modelMatrix));
          vSh = vec3(max(A - h, 0.0) / max(hp, 0.05), dot(nm, sd), abs(dot(tp, sd)));
          vAO = 0.58 + 0.42 * (1.0 - lat * lat * lat * lat);
          vE = vec4(lat, aE, aG.x * 31.0 + aS.y * 9.0, aG.y * uLen);
        }
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vWP = wp.xyz; vN = normalize(mat3(modelMatrix) * n);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${B0}
      ${xt}
      uniform vec3 cSnow, cCob;
      varying vec3 vWP, vN, vLP, vSD; varying vec3 vSh; varying float vAO; varying vec4 vE; varying vec3 vSl;
      #include <fog_pars_fragment>
      void main() {
        // packed snow breaks off raggedly: noise in the strip's own space eats its ends, gaps and edges
        float rg = fbm(vec2(vE.z + vE.x * 0.9, vE.w * 1.5)), rg2 = vnoise(vec2(vE.z * 3.0 + vE.x * 3.5, vE.w * 5.0));
        // inside a gap the strip is gone outright (no stray lump left standing in an empty groove, where it reads as a
        // hole in the rib); the ragged break is a short band at the gap's edge, and what is left there stays narrow
        float eg = smoothstep(0.15, 0.45, vE.y);
        // (the break is rounded: the edges of the strip give out before its middle, so an end is a tongue of snow)
        if (eg * (1.2 + 1.1 * vE.x * vE.x) + (rg - 0.5) * 0.9 * (1.0 - 0.8 * eg) + (rg2 - 0.5) * 0.3 > 0.5 || abs(vE.x) > mix(0.58 + 0.56 * rg + 0.2 * rg2, 0.5, eg)) discard;
        // the slab on the move: its trailing edge tears away from the snow above, and it rides as broken plates
        float crack = 0.0;
        if (vSl.x > 0.0) {
          if (vSl.y < 0.12 + 0.34 * rg2) discard;
          crack = max(1.0 - smoothstep(-0.96, -0.8, sin(vSl.z + (rg - 0.5) * 1.6)), 1.0 - smoothstep(0.3, 0.75, vSl.y - 0.34 * rg2)) * vSl.x;
        }
        vec3 N = normalize(vN), V = normalize(cameraPosition - vWP);
        float g = fbm(vWP.xz * 2.3 + vWP.y * 1.7);
        float gfade = 1.0 - smoothstep(12.0, 40.0, length(cameraPosition - vWP));
        N = normalize(N + (vec3(vnoise(vWP.yz * 5.0), vnoise(vWP.xz * 5.0), vnoise(vWP.xy * 5.0)) - 0.5) * 0.5 + (vec3(vnoise(vWP.yz * 16.0), vnoise(vWP.xz * 16.0 + 3.0), vnoise(vWP.xy * 16.0 + 7.0)) - 0.5) * 0.7 * gfade);
        float sh = mix(1.0, smoothstep(vSh.x * 0.6 - 0.03, vSh.x * 1.4 + 0.04, vSh.y / max(vSh.z, 1e-3)), 0.5) * smoothstep(-0.06, 0.1, vSh.y);      // packed snow stands proud of the groove and catches the sun
        sh *= castShadow(vLP, normalize(vSD));
        float ndl = clamp(dot(N, uSunDir) * 0.8 + 0.2, 0.0, 1.0);
        float mask = sunMask(vWP);
        vec3 alb = cSnow * (0.74 + 0.14 * g);
        vec3 col = alb * (uSunCol * ndl * sh * mask * 0.44 + hemi(N) * (0.86 * vAO * mix(0.8, 1.0, uSunAmt)));
        // forward-scattered rim and single-crystal sparkle in the sun
        col += uSunCol * pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 3.0) * 0.02 * mask * sh;
        vec3 sc = floor(vWP * 26.0);
        float sp = step(0.992, h21(sc.xy + sc.z * 7.3)) * pow(max(dot(normalize(N + (h22(sc.xz) .xyx - 0.5) * 0.9), normalize(uSunDir + V)), 0.0), 30.0);
        col += uSunCol * sp * 2.2 * mask * sh;
        float sdr = fbm(vec2(dot(vWP.xz, vec2(0.7, -0.7)) * 0.22 - uTime * 1.3, vWP.y * 0.3)) * vnoise(vec2(dot(vWP.xz, vec2(0.7, -0.7)) * 0.9 - uTime * 3.3, vWP.y * 0.8));
        col *= 0.93 + 0.3 * smoothstep(0.18, 0.5, sdr);
        col *= mix(vec3(1.0), vec3(0.34, 0.45, 0.7), crack);
        // where the packed snow meets the glaze it thins and takes the groove's cobalt shade, so a stripe lies in its groove
        col *= mix(vec3(0.62, 0.74, 0.98), vec3(1.0), smoothstep(0.0, 0.5, 1.0 - abs(vE.x)));
        gl_FragColor = vec4(col, 1.0);
        ${lt}
      }`});return y.uniforms.uShed=t.uShed,y.uniforms.uProf={value:t.prof},y.uniforms.uSlide=t.uSlide,y.uniforms.uRelV=t.uRelV,y.uniforms.uLen={value:t.len},A0(y,l)}const xt=`
  float castShadow(vec3 lp, vec3 sd) {
    vec2 d = sd.xz; float dd = max(dot(d, d), 1e-4);
    float b = dot(lp.xz, d), sh = 1.0;
    float c1 = dot(lp.xz, lp.xz) - 169.0, h1 = b * b - dd * c1;
    if (b < 0.0 && h1 > 0.0 && c1 > 0.5) { float t = (-b - sqrt(h1)) / dd; float y = lp.y + sd.y * t; sh = min(sh, smoothstep(30.0, 31.5, y)); }
    float c2 = dot(lp.xz, lp.xz) - 215.0, h2 = b * b - dd * c2;
    if (b < 0.0 && h2 > 0.0 && c2 > 0.5) { float t = (-b - sqrt(h2)) / dd; float y = lp.y + sd.y * t; sh = min(sh, max(1.0 - smoothstep(29.0, 30.5, y), smoothstep(50.0, 55.0, y))); }
    return sh;
  }
`;function It(l,c,t={}){const y={};t.cast!==!1&&(y.DOME_CAST=1),t.world&&(y.WORLD_CAST=1);const W=new i.ShaderMaterial({fog:!0,vertexColors:!0,defines:y,uniforms:F0({...c}),vertexShader:`
      attribute vec2 aP;
      uniform vec3 uSunDir; uniform vec4 uWind; uniform float uTime;
      varying vec3 vWP, vN, vLP, vSD, vC; varying vec2 vUv, vP;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        if (aP.x > 8.5 && aP.x < 9.5) {
          float g = sin(uTime * 1.7 + wp.x * 0.31 + wp.z * 0.23) + 0.5 * sin(uTime * 3.1 + wp.x * 0.9);
          wp.xz += uWind.xz * g * 0.11 * color.b;
        } else if (aP.x > 10.5 && aP.x < 11.5 || aP.x > 13.5 && aP.x < 14.5) {
          float g = sin(uTime * 2.3 + wp.x * 1.3 + wp.z * 1.1 + wp.y * 1.7) + 0.6 * sin(uTime * 1.1 + wp.x * 0.4);
          wp.xyz += normalize(mat3(modelMatrix) * normal) * g * 0.16 * color.b;
        }
        vWP = wp.xyz; vLP = position; vN = normalize(mat3(modelMatrix) * normal);
        vSD = uSunDir * mat3(modelMatrix);
        vUv = uv; vP = aP; vC = color;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${B0}
      ${xt}
      uniform vec3 cTurq, cCob, cDeep, cOchre, cBuff, cSnow;
      uniform float uLamp, uRime;
      varying vec3 vWP, vN, vLP, vSD, vC; varying vec2 vUv, vP;
      #include <fog_pars_fragment>
      #ifdef WORLD_CAST
      ${t.world?Vt(t.world.n[0],t.world.n[1]):""}
      #endif
      // glazed brick-end mosaic: returns 0 ground, 1 turquoise, 2 cobalt, 3 white
      float bannai(vec2 c, float chev) {
        float a = mod(c.x + c.y, 8.0), b = mod(c.x - c.y + 64.0, 8.0);
        float k = 0.0;
        if (chev > 0.5) {
          float z = mod(c.y + abs(mod(c.x, 8.0) - 4.0), 4.0);
          k = z < 0.5 ? 2.0 : z < 1.5 ? 1.0 : z < 2.5 ? 0.0 : 0.0; if (z > 2.5 && mod(c.x, 2.0) < 0.5) k = 3.0;
        } else {
          if (a < 0.5 || b < 0.5) k = 1.0;
          if (abs(a - 4.0) < 1.5 && abs(b - 4.0) < 1.5) k = 2.0;
          if (abs(a - 4.0) < 0.5 && abs(b - 4.0) < 0.5) k = 3.0;
          if ((abs(a - 4.0) < 0.5 && b < 0.5) || (abs(b - 4.0) < 0.5 && a < 0.5)) k = 2.0;
        }
        return k;
      }
      void main() {
        vec3 N = normalize(vN), V = normalize(cameraPosition - vWP);
        vec2 uv = vUv; float id = vP.x;
        float pix = max(fwidth(uv.x), fwidth(uv.y)) + 1e-4;
        float n1 = fbm(uv * 0.35 + id * 9.0), n2 = fbm(uv * 2.7);
        // fired brick ground shared by all tile patterns
        vec2 bc = uv / vec2(0.30, 0.085); bc.x += 0.5 * floor(bc.y);
        vec2 bi = floor(bc), bf = fract(bc); float bh = h21(bi);
        float bfade = 1.0 - smoothstep(0.02, 0.06, pix);
        float mortar = max(smoothstep(0.93, 0.99, max(bf.x, 1.0 - bf.x)), smoothstep(0.80, 0.96, max(bf.y, 1.0 - bf.y))) * bfade;
        vec3 brick = cBuff * (0.8 + 0.4 * (bh - 0.5) * bfade + 0.34 * (n1 - 0.5)) * mix(vec3(1.0), vec3(1.12, 0.94, 0.8), bh * 0.5);
        brick = mix(brick, cBuff * 1.05, mortar * 0.6);
        vec3 alb = brick; float glaze = 0.0, metal = 0.0, snowAdd = 0.0; vec3 glow = vec3(0.0);
        if (id < 0.5) {
        } else if (id < 1.5) {
          vec2 c = floor(uv / 0.3), f = fract(uv / 0.3);
          float k = bannai(c, vP.y);
          float fade = 1.0 - smoothstep(0.1, 0.3, pix);
          float e = smoothstep(0.90, 0.98, max(max(f.x, 1.0 - f.x), max(f.y, 1.0 - f.y))) * fade;
          float hh = h21(c + 3.0);
          vec3 g = k < 0.5 ? brick : k < 1.5 ? cTurq : k < 2.5 ? cCob : cSnow * 0.78;
          g *= 0.82 + 0.3 * hh * fade;
          float lostT = step(0.955, h21(c * 1.7 + 11.0) + 0.1 * n1);
          g = mix(g, brick * 0.8, lostT * step(0.5, k));
          // seen from close each glazed brick end is four small tiles
          float fine1 = (1.0 - smoothstep(0.006, 0.025, pix)) * step(0.5, k); vec2 f2 = abs(fract(uv / 0.15) - 0.5);
          g *= 1.0 + fine1 * ((h21(floor(uv / 0.15) + 5.0) - 0.5) * 0.3 - 0.35 * smoothstep(0.4, 0.49, max(f2.x, f2.y)));
          // the same lattice drawn soft for distance, so the big diamonds survive when the bricks blur
          float l1 = abs(fract((uv.x + uv.y) / 2.4 + 0.0625) - 0.5) * 2.4, l2 = abs(fract((uv.x - uv.y) / 2.4 + 0.0625) - 0.5) * 2.4;
          float lw = 0.14 + pix * 0.6;
          vec3 mean = mix(brick, cTurq * 0.9, 0.8 * smoothstep(1.2 - lw * 1.3, 1.2 - lw * 0.3, max(l1, l2)));
          mean = mix(mean, cCob, 0.85 * (1.0 - smoothstep(0.3, 0.5 + pix, max(l1, l2))));
          if (vP.y > 0.5) { float z = abs(fract((uv.y + abs(fract(uv.x / 2.4) - 0.5) * 2.4) / 1.2) - 0.5) * 2.0; mean = mix(mix(cCob, cTurq, smoothstep(0.2, 0.5, z)), brick * 1.1, smoothstep(0.5, 0.75, z)); }
          alb = mix(mean, g * (1.0 - 0.5 * e), fade); glaze = step(0.5, k) * (1.0 - lostT) * fade + 0.4 * (1.0 - fade);
        } else if (id < 2.5) {
          // ochre-and-cobalt interlace: eight-point stars in octagons with woven diagonal straps
          vec2 p = abs(fract(uv / 2.0) - 0.5);
          float d1 = max(p.x, p.y), d2 = (p.x + p.y) * 0.7071;
          float star = min(d1, d2), oct = max(d1, d2);
          float w = 0.022 + pix * 0.35;
          vec3 g = cCob * 0.9;
          g = mix(g, mix(cCob, cTurq, 0.55), 1.0 - smoothstep(0.24, 0.24 + w, star));
          g = mix(g, cSnow * 0.8, 1.0 - smoothstep(0.085, 0.085 + w, star));
          g = mix(g, cCob, 1.0 - smoothstep(0.04, 0.04 + w, oct));
          float strap = min(abs(star - 0.26), abs(oct - 0.40));
          strap = min(strap, abs(p.x - p.y) * 0.7071 + step(oct, 0.40));
          vec2 pc = abs(p - 0.5); float cd = pc.x + pc.y;
          strap = min(strap, abs(cd - 0.13));
          g = mix(g, cDeep, 1.0 - smoothstep(0.0, 0.03 + w, cd - 0.02) );
          float sm = 1.0 - smoothstep(0.042, 0.042 + w, strap);
          g = mix(g, cOchre * 1.25, sm); metal = sm * 0.8;
          g = mix(g, cSnow * 0.8, (1.0 - smoothstep(0.0, w, abs(strap - 0.06))) * 0.45 * (1.0 - smoothstep(0.02, 0.08, pix)));
          float edge = min(uv.y, 4.0 - uv.y);
          g = mix(g, mod(floor(uv.x / 0.25), 2.0) < 0.5 ? cSnow * 0.8 : cDeep, 1.0 - smoothstep(0.16, 0.18, edge));
          alb = g * (0.85 + 0.3 * n2); glaze = 1.0;
        } else if (id < 3.5) {
          // star lattice: twelve-point stars on a hexagon net
          vec2 q = uv / 1.7; vec2 r2 = vec2(1.0, 1.7320508);
          vec2 a = mod(q, r2) - r2 * 0.5, b = mod(q + r2 * 0.5, r2) - r2 * 0.5;
          vec2 p = dot(a, a) < dot(b, b) ? a : b;
          float rr = length(p), ang = atan(p.y, abs(p.x) < 1e-5 ? 1e-5 : p.x);
          float af = abs(mod(ang + 6.2831853, 0.5235988) - 0.2617994);
          float st = rr * (cos(af) + sin(af) * 1.35);
          float w = 0.018 + pix * 0.4;
          vec3 g = mix(brick, cTurq * 0.9, 1.0 - smoothstep(0.455, 0.455 + w, rr * cos(af)));
          g = mix(g, cCob, 1.0 - smoothstep(0.40, 0.40 + w, st));
          g = mix(g, cSnow * 0.8, 1.0 - smoothstep(0.0, w, abs(st - 0.41) - 0.012));
          g = mix(g, cTurq, 1.0 - smoothstep(0.17, 0.17 + w, rr * cos(af)));
          g = mix(g, cOchre, 1.0 - smoothstep(0.06, 0.06 + w, rr));
          // seen from close the fields resolve into small glazed tesserae with a fine grout line
          float fine = 1.0 - smoothstep(0.012, 0.05, pix);
          vec2 tq = uv / 0.19; tq.x += 0.5 * floor(tq.y); vec2 tf2 = abs(fract(tq) - 0.5);
          float grout = smoothstep(0.5 - 0.06 - pix * 3.0, 0.5 - 0.02, max(tf2.x, tf2.y));
          g *= mix(1.0, (0.84 + 0.32 * h21(floor(tq) + 7.0)) * (1.0 - 0.4 * grout), fine);
          float fade = 1.0 - smoothstep(0.25, 0.7, pix);
          alb = mix(mix(cCob, cTurq, 0.45), g, fade) * (0.85 + 0.3 * n2); glaze = 0.9 * (1.0 - 0.6 * grout * fine);
        } else if (id < 4.5) {
          // spiral banding: uv.x is metres round a 14.45 m girth, two bands a turn
          float dg = (uv.y - uv.x * (6.4 / 14.4513)) / 3.2;
          float w = fract(dg), bn = floor(dg);
          vec2 c = floor(vec2(uv.x, uv.y - uv.x * (6.4 / 14.4513)) / 0.28);
          float k = bannai(c, mod(bn, 2.0));
          float fade = 1.0 - smoothstep(0.1, 0.3, pix);
          vec3 g = k < 0.5 ? brick : k < 1.5 ? cTurq : k < 2.5 ? cCob : cSnow * 0.78;
          g = mix(mix(brick, cTurq, 0.35), g * (0.85 + 0.3 * h21(c)), fade);
          float sw = min(w, 1.0 - w) * 3.2;
          g = mix(g, cCob, 1.0 - smoothstep(0.22, 0.26, sw));
          g = mix(g, cSnow * 0.8, 1.0 - smoothstep(0.05, 0.08, abs(sw - 0.30)));
          alb = g; glaze = 0.3;
        } else if (id < 5.5) {
          // gold-ochre: a carved chevron rope in dull gilt; only its highlight blooms
          float rope = abs(fract(uv.y / 0.25 + abs(fract(uv.x / 0.5) - 0.5) * 2.0) - 0.5) * 2.0, rfade = 1.0 - smoothstep(0.03, 0.14, pix);
          alb = cOchre * mix(0.62, 0.9, vP.y) * (0.86 + 0.4 * n2) * mix(1.0, 0.66 + 0.6 * rope, rfade * (1.0 - vP.y)) * mix(1.0, 1.0 - 0.3 * mortar, 1.0 - vP.y); metal = mix(0.75 + 0.25 * rope * rfade, 1.0, vP.y); glaze = 0.6;
        } else if (id < 6.5) {
          vec2 f = abs(fract(uv / 0.42) - 0.5);
          float lat = min(min(f.x, f.y), abs(f.x - f.y) * 0.7071);
          float fade = 1.0 - smoothstep(0.1, 0.35, pix);
          alb = mix(cDeep * 0.22, cBuff * 1.1, (1.0 - smoothstep(0.035, 0.06 + pix * 0.5, lat)) * fade + 0.3 * (1.0 - fade));
        } else if (id < 7.5) {
          float gr = vnoise(vec2(uv.x * 30.0, uv.y * 1.5));
          alb = vec3(0.21, 0.13, 0.075) * (0.6 + 0.7 * gr);
        } else if (id < 8.5) {
          alb = mix(cTurq, cCob, vC.g) * (0.75 + 0.5 * vC.b);
          glaze = 1.0;
        } else if (id < 9.5) {
          float gr = vnoise(vec2(uv.x * 26.0, uv.y * 2.0));
          alb = vec3(0.075, 0.058, 0.05) * (0.55 + 0.9 * gr);
          alb = mix(alb, cSnow * 0.8, clamp(uRime * (0.55 + 0.6 * gr) + 0.35 * vP.y * smoothstep(-0.2, 0.6, N.y), 0.0, 0.92));
        } else if (id < 10.5) {
          float ptc = fbm(uv * 0.9 + vC.g * 31.0), run = vnoise(vec2(uv.x * 3.1, uv.y * 0.45 + vC.g * 9.0));
          float straw = vnoise(uv * 34.0) * (1.0 - smoothstep(0.02, 0.08, pix));
          vec3 mud = cBuff * mix(vec3(0.80, 0.78, 0.76), vec3(1.08, 1.0, 0.9), vC.g) * (0.8 + 0.32 * ptc + 0.1 * straw);
          mud = mix(mud, cBuff * vec3(1.22, 1.18, 1.08), smoothstep(0.6, 0.72, fbm(uv * 0.31 + 5.0 + vC.g * 7.0)) * 0.5);     // fresh patches
          vec2 kc = uv * 0.55 + vC.g * 13.0, ki = floor(kc), kf = fract(kc); float k1 = 9.0, k2 = 9.0;
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)); vec2 o = g + h22(ki + g) - kf; float d = dot(o, o); if (d < k1) { k2 = k1; k1 = d; } else if (d < k2) { k2 = d; } }
          float crack = (1.0 - smoothstep(0.0, 0.03 + pix * 2.0, sqrt(k2) - sqrt(k1))) * step(0.55, h21(ki + 3.0)) * (1.0 - smoothstep(0.03, 0.12, pix));
          mud *= 1.0 - 0.35 * crack;
          mud *= 1.0 - 0.08 * run * smoothstep(0.35, 0.8, run);
          // rammed-earth lifts: a faint horizontal seam every half metre, and the damp foot of the wall
          float lift = 1.0 - smoothstep(0.0, 0.07 + pix, abs(fract(uv.y / 0.55 + 0.12 * ptc) - 0.5));
          mud *= 1.0 - 0.13 * lift * (1.0 - smoothstep(0.05, 0.3, pix));
          mud *= mix(vec3(0.74, 0.76, 0.82), vec3(1.0), smoothstep(0.1, 1.1, uv.y + 0.5 * ptc));
          mud = mix(mud, vec3(dot(mud, vec3(0.3, 0.5, 0.2))) * vec3(1.02, 1.0, 0.98), 0.38) * vec3(1.22, 1.12, 1.0);
          mud = mix(mud, cSnow * 0.8, smoothstep(0.6, 0.95, fbm(uv * vec2(0.5, 1.4) + 17.0 + vC.g * 5.0)) * (0.16 + 0.5 * uRime));     // wind-plastered snow
          if (vP.y > 0.5) {
            mud = mix(cSnow * vec3(0.74, 0.74, 0.73) * (0.86 + 0.16 * ptc), mud, smoothstep(0.72, 0.95, ptc + 0.3 * run) * 0.45);
            mud = mix(mud, mix(cTurq, cCob, vC.g) * (0.7 + 0.4 * ptc), (1.0 - smoothstep(0.85, 0.9, uv.y)) * 0.85 * step(0.25, vC.b));
          }
          alb = mud * mix(0.62, 1.0, smoothstep(0.0, 0.9, uv.y + 0.4 * ptc));
        } else if (id < 11.5) {
          float row = floor(uv.y / 0.34), hr = h11(row + vP.y * 17.0 + floor(vC.g * 64.0));
          vec3 mad = vec3(0.34, 0.035, 0.03), cream = cSnow * vec3(0.62, 0.56, 0.44);
          vec3 a1 = vP.y < 0.5 ? cCob * 0.85 : mad, a2 = vP.y < 0.5 ? mad : cCob * 0.8;
          vec3 g = hr < 0.42 ? a1 : hr < 0.72 ? a2 : hr < 0.86 ? cream : cOchre * 0.75;
          vec2 dm = abs(fract(uv / vec2(0.46, 0.68)) - 0.5);
          float dia = dm.x + dm.y;
          g = mix(g, hr < 0.5 ? cream : cDeep, (1.0 - smoothstep(0.2, 0.2 + pix * 3.0 + 0.02, dia)) * step(0.3, hr) * (1.0 - smoothstep(0.1, 0.3, pix)));
          g = mix(g, cDeep * 0.8, 1.0 - smoothstep(0.0, 0.05, min(uv.x, vC.g > -1.0 ? 9.0 : 0.0)));
          alb = g * (0.8 + 0.3 * vnoise(uv * vec2(60.0, 9.0)));
        } else if (id < 12.5) {
          if (vP.y < 0.5) alb = vec3(0.022, 0.02, 0.022);
          else if (vP.y < 1.5) { float pl = abs(fract(uv.x / 0.22) - 0.5); alb = mix(cTurq, cCob, step(0.5, vC.g)) * (0.5 + 0.3 * h11(floor(uv.x / 0.22) + vC.g * 9.0)) * (1.0 - 0.5 * smoothstep(0.42, 0.5, pl)); }
          else if (vP.y < 2.5) {
            vec2 f = abs(fract(uv / vec2(0.3, 0.4)) - 0.5);
            float bars = smoothstep(0.38, 0.46, max(f.x, f.y));
            alb = mix(vec3(0.05, 0.045, 0.05), vec3(0.14, 0.09, 0.05), bars);
            glow = vec3(1.0, 0.56, 0.2) * uLamp * (1.0 - bars) * (2.2 + 1.2 * vC.b) * step(0.35, vC.g) * (0.9 + 0.1 * sin(uTime * (5.0 + 7.0 * vC.b) + vC.b * 40.0));
            glaze = 0.5;
          } else { alb = vec3(0.03, 0.02, 0.015); glow = vec3(1.0, 0.36, 0.08) * (0.9 + 0.9 * uLamp) * (0.75 + 0.25 * sin(uTime * 7.0 + vC.b * 40.0) * sin(uTime * 3.1 + vC.b * 13.0)); }
        } else if (id < 13.5) {
          alb = cSnow * 0.84; snowAdd = 1.0;
        } else if (id < 14.5) {
          float st = smoothstep(0.42, 0.5, abs(fract(uv.x / 0.7) - 0.5) * 2.0 * 0.5 + 0.2);
          alb = mix(cOchre * 1.05, cSnow * vec3(0.7, 0.66, 0.56), st * 0.8) * (0.8 + 0.3 * vnoise(uv * vec2(40.0, 6.0)));
        } else if (id > 16.5) {
          // icicle fringe: teeth of varied length hanging from the top edge of the strip (uv.y = metres up from its foot)
          float tx = uv.x * 2.6, len = 0.3 + 0.65 * h11(floor(tx) + 3.0), wx = abs(fract(tx) - 0.5) * 2.0;
          if (vC.b - uv.y > len * vC.b * (1.0 - wx * (1.5 + h11(floor(tx)))) ) discard;
          alb = mix(cSnow * 0.9, cTurq * 0.6 + cSnow * 0.4, 0.35); glaze = 1.0;
        } else if (id > 15.5) {
          vec3 wool = vC.g < 0.3 ? vec3(0.30, 0.055, 0.045) : vC.g < 0.55 ? vec3(0.045, 0.07, 0.22) : vC.g < 0.8 ? vec3(0.19, 0.12, 0.075) : vC.g < 0.93 ? vec3(0.33, 0.27, 0.19) : vC.g < 0.985 ? vec3(0.62, 0.6, 0.55) : vec3(0.014, 0.014, 0.02);
          alb = wool * (0.85 + 0.25 * vnoise(uv * vec2(9.0, 30.0))) * (0.8 + 0.4 * vC.b);
        } else {
          float xr = abs(fract(uv.x) - 0.5) * 2.0, pw = fwidth(uv.x) * 2.0;
          float groove = smoothstep(0.50 - pw, 0.64 + pw, xr + (n2 - 0.5) * 0.18);
          float lie = smoothstep(-0.32, 0.12, N.y + (n1 - 0.5) * 0.5);
          float fadeR = 1.0 - smoothstep(0.35, 0.9, pw);
          vec2 tc = uv / vec2(0.125, 0.3); float th = h21(floor(tc));
          alb = cTurq * (0.72 + 0.3 * (th - 0.5) * (1.0 - smoothstep(0.03, 0.1, pix)) + 0.4 * (n1 - 0.5));
          alb *= 1.0 - 0.4 * smoothstep(0.55, 1.0, xr) * (1.0 - groove);
          alb = mix(alb, mix(cTurq, cCob, 0.3), step(0.93, h21(floor(tc / vec2(3.0, 9.0)) + 2.0)) * 0.6);
          snowAdd = mix(0.42 * lie, groove * lie, fadeR); glaze = 0.55;
        }
        // weathering: rain streaks under ledges, damp at the foot, grime
        float streak = vnoise(vec2(uv.x * 1.6, uv.y * 0.12)) * vnoise(vec2(uv.x * 0.5 + 9.0, 0.3));
        alb *= 1.0 - (id > 9.5 && id < 10.5 ? 0.1 : 0.35) * streak * (1.0 - metal);
        alb *= id > 15.5 ? 1.0 : mix(0.72, 1.0, smoothstep(0.0, 2.2, vLP.y + n1));
        // snow lying on anything that faces up
        float sn = max(smoothstep(0.55, 0.8, N.y + (n2 - 0.5) * 0.3) * (id > 16.5 ? 0.5 : id > 15.5 ? 0.0 : id > 13.5 && id < 14.5 ? 0.3 * smoothstep(0.45, 0.6, n1) : 1.0), snowAdd);
        alb = mix(alb, cSnow * 0.84, sn); glaze *= 1.0 - sn; metal *= 1.0 - sn;
        // color.r under 0.5 marks a baked sun shadow (flat quads laid on snow): the sun is cut, the skylight stays.
        // On tile patterns 1 to 3 color.b near 0 marks the back of a niche: it sits in the arch's own shade.
        float bsh = smoothstep(0.3, 0.5, vC.r), ao = mix(id > 12.5 && id < 13.5 ? vC.g : 0.96, vC.r, bsh);      // a shadow quad on snow (pattern 13) carries its skylight in color.g
        float rec = id > 0.5 && id < 3.5 ? 1.0 - smoothstep(0.05, 0.35, vC.b) : 0.0;
        ao *= 1.0 - 0.3 * rec;
        float cshad = bsh * (1.0 - 0.7 * rec);
        #ifdef DOME_CAST
          cshad *= castShadow(vLP, normalize(vSD)) * smoothstep(0.5, 0.85, ao);
        #endif
        #ifdef WORLD_CAST
          cshad *= worldShadow(vWP + N * 0.12, uSunDir, 0.0);
        #endif
        float mask = sunMask(vWP) * cshad;
        float ndl = max(dot(N, uSunDir), 0.0);
        vec3 col = alb * (uSunCol * ndl * mask * mix(id < 0.5 ? 0.6 : 0.66, 0.38, sn) + hemi(N) * ao * mix(1.0, 0.86, sn));
        // each small tile is set at its own slight angle, so a wall near the sun's mirror line glitters tile by tile
        vec2 tcell = floor(uv / 0.15);
        float jf = 1.0 - smoothstep(0.02, 0.12, pix);
        vec3 Ng = normalize(N + (vec3(h22(tcell), h21(tcell + 9.0)) - 0.5) * 0.2 * jf);
        vec3 H = normalize(uSunDir + V); float ndh = max(dot(Ng, H), 0.0);
        // too far to tell the tiles apart, their glints merge into one wider, far dimmer sheen (not a white sheet)
        float glint = min(mix(pow(max(dot(N, H), 0.0), 90.0) * 0.45, pow(ndh, 180.0) * 3.5 * smoothstep(5.0, 22.0, length(cameraPosition - vWP)), jf), 1.2);
        float graze = 0.3 + 0.7 * smoothstep(0.06, 0.4, dot(N, V));      // a wall seen edge-on beside the lens keeps its pattern instead of glaring white
        glint *= mix(1.0, 0.12 + 0.88 * step(0.78, h21(tcell + 4.0)), jf);
        col += uSunCol * (glint * glaze + pow(ndh, 22.0) * 0.06 * glaze) * mask * step(0.001, ndl) * graze;
        col += uSunCol * cOchre * (pow(ndh, 40.0) * min(0.6 + 5.6 * vP.y, 2.2) + pow(ndh, 6.0) * mix(0.08, 0.25, vP.y)) * metal * mask * step(0.001, ndl);
        col += hemi(reflect(-V, N)) * (0.04 + 0.96 * pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 5.0)) * 0.3 * glaze * ao;
        col += alb * glaze * uGhost * ao;      // glaze keeps its colour in the flat light of the squall
        vec3 sc = floor(vWP * 22.0);
        col += uSunCol * step(0.994, h21(sc.xy + sc.z * 7.3)) * sn * mask * 1.6 * (1.0 - smoothstep(0.02, 0.07, pix));
        gl_FragColor = vec4(col + glow, 1.0);
        ${lt}
      }`});return A0(W,l),W.uniforms.uLamp=t.lamp||{value:0},W.uniforms.uRime=t.rime||{value:0},t.fogCap&&(W.uniforms.uFogCap=t.fogCap),t.world&&(W.uniforms.uBoxA=t.world.uBoxA,W.uniforms.uBoxB=t.world.uBoxB,W.uniforms.uCyl=t.world.uCyl),W}class wt{constructor(){this.p=[],this.n=[],this.uv=[],this.ap=[],this.c=[],this.i=[],this.count=0,this.m=null,this.pat=0,this.aux=0}set(c,t=0){return this.pat=c,this.aux=t,this}grid(c,t,y,W=!1,m=!1){const T=c+1,L={x:0,y:0,z:0,u:0,v:0,ao:1,g:0,b:.5},p=new Float32Array(T*(t+1)*3),M=this.count,P=this.m;for(let x=0;x<=t;x++)for(let w=0;w<=c;w++){L.ao=1,L.g=0,L.b=.5,y(w/c,x/t,L);const S=(x*T+w)*3;p[S]=L.x,p[S+1]=L.y,p[S+2]=L.z;const B=this.uvS||1;this.uv.push(L.u*B,L.v*B),this.ap.push(this.pat,this.aux),this.c.push(L.ao,L.g,L.b)}const v=P?P.elements:null;for(let x=0;x<=t;x++)for(let w=0;w<=c;w++){let S=w-1,B=w+1;const C=Math.max(0,x-1),H=Math.min(t,x+1);W?(S<0&&(S=c-1),B>c&&(B=1)):(S=Math.max(0,S),B=Math.min(c,B));const n0=(x*T+S)*3,l0=(x*T+B)*3,_=(C*T+w)*3,e0=(H*T+w)*3,J=p[l0]-p[n0],i0=p[l0+1]-p[n0+1],Q=p[l0+2]-p[n0+2],g0=p[e0]-p[_],Y=p[e0+1]-p[_+1],b0=p[e0+2]-p[_+2];let o0=Y*Q-b0*i0,r0=b0*J-g0*Q,F=g0*i0-Y*J;m&&(o0=-o0,r0=-r0,F=-F);const D=Math.hypot(o0,r0,F)||1;o0/=D,r0/=D,F/=D;const A=(x*T+w)*3;let V=p[A],R=p[A+1],$=p[A+2];if(v){const v0=v[0]*V+v[4]*R+v[8]*$+v[12],M0=v[1]*V+v[5]*R+v[9]*$+v[13],s=v[2]*V+v[6]*R+v[10]*$+v[14],K=v[0]*o0+v[4]*r0+v[8]*F,a0=v[1]*o0+v[5]*r0+v[9]*F,O0=v[2]*o0+v[6]*r0+v[10]*F;V=v0,R=M0,$=s,o0=K,r0=a0,F=O0}this.p.push(V,R,$),this.n.push(o0,r0,F)}for(let x=0;x<t;x++)for(let w=0;w<c;w++){const S=M+x*T+w,B=S+1,C=S+T,H=C+1;m?this.i.push(S,B,C,B,H,C):this.i.push(S,C,B,B,C,H)}this.count+=T*(t+1)}ring(c,t,y,W,m={}){const T=m.nu||64,L=m.nv||1,p=m.rf,M=m.girth||U*Math.max(c,y),P=m.cf;this.grid(T,L,(v,x,w)=>{const S=v*U,B=c+(y-c)*x+(p?p(S,x):0);w.x=Math.cos(S)*B,w.z=Math.sin(S)*B,w.y=t+(W-t)*x,w.u=v*M,w.v=(m.v0||0)+x*(m.vLen??Math.hypot(y-c,W-t)),w.ao=m.ao?m.ao(x,S):1,P&&P(S,x,w)},!0,!1)}quad(c,t,y,W,m=0,T=0,L=1,p=1){const M=Math.hypot(t[0]-c[0],t[1]-c[1],t[2]-c[2]),P=Math.hypot(W[0]-c[0],W[1]-c[1],W[2]-c[2]);this.grid(1,1,(v,x,w)=>{const S=v?t:c,B=v?y:W;w.x=S[0]+(B[0]-S[0])*x,w.y=S[1]+(B[1]-S[1])*x,w.z=S[2]+(B[2]-S[2])*x,w.u=m+v*M,w.v=T+x*P,w.ao=x?p:L},!1,!0)}box(c,t,y,W,m,T,L=0,p=null){const M=Math.cos(L),P=Math.sin(L),v=W/2,x=m/2,w=T/2,S=(B,C,H)=>(p&&(B+=p[0]*(C+x),H+=p[1]*(C+x)),[c+B*M+H*P,t+C,y-B*P+H*M]);this.quad(S(-v,-x,w),S(v,-x,w),S(v,x,w),S(-v,x,w)),this.quad(S(v,-x,-w),S(-v,-x,-w),S(-v,x,-w),S(v,x,-w)),this.quad(S(v,-x,w),S(v,-x,-w),S(v,x,-w),S(v,x,w)),this.quad(S(-v,-x,-w),S(-v,-x,w),S(-v,x,w),S(-v,x,-w)),this.quad(S(-v,x,w),S(v,x,w),S(v,x,-w),S(-v,x,-w))}toGeometry(){const c=new i.BufferGeometry;return c.setAttribute("position",new i.Float32BufferAttribute(this.p,3)),c.setAttribute("normal",new i.Float32BufferAttribute(this.n,3)),c.setAttribute("uv",new i.Float32BufferAttribute(this.uv,2)),c.setAttribute("aP",new i.Float32BufferAttribute(this.ap,2)),c.setAttribute("color",new i.Float32BufferAttribute(this.c,3)),c.setIndex(this.i),c}}function N0(l,c){const t=c*.45,y=c+t,W=Math.min(c,Math.abs(l))+t;return Math.sqrt(Math.max(0,y*y-W*W))}function bt(l,c,t,y,W,m){const T=Math.cos(c),L=Math.sin(c),p=(F,D,A)=>[T*(t+A)+L*F,(m.y0||0)+D,L*(t+A)-T*F],M=m.aw/2,P=m.spring,v=m.depth,x=P+N0(0,M),w=m.frame??.7,S=x+w+.5,B=14,C=m.wallPat??1,H=m.u0||0,n0=l.uvS||1,l0=m.starS||n0,_=m.framePat??5,e0=m.frameLine||0,J=(F,D,A,V,R,$,v0,M0=1,s=1)=>{l.set($,v0),l.quad(p(F,D,R),p(A,D,R),p(A,V,R),p(F,V,R),H+F,D,M0,s)};J(-y/2,0,-M-w-.5,W,0,C,m.wallAux||0,.8,1),J(M+w+.5,0,y/2,W,0,C,m.wallAux||0,.8,1),J(-M-w-.5,S,M+w+.5,W,0,C,m.wallAux||0);const i0=.12;J(-M-w-.5,0,-M-.5,S,i0,_,0,.8,1),J(M+.5,0,M+w+.5,S,i0,_,0,.8,1),J(-M-.5,x+.5,M+.5,S,i0,_,0),e0>0&&(J(-M-.5-e0,0,-M-.5,x+.5+e0,i0+.03,5,0,.8,1),J(M+.5,0,M+.5+e0,x+.5+e0,i0+.03,5,0,.8,1),J(-M-.5,x+.5,M+.5,x+.5+e0,i0+.03,5,0));const Q=m.jamb||[3,0,l0];l.uvS=Q[2],J(-M-.5,0,-M,P,.04,Q[0],Q[1],.75,1),J(M,0,M+.5,P,.04,Q[0],Q[1],.75,1),l.uvS=l0,l.set(3,0),l.grid(B,1,(F,D,A)=>{const V=-M-.5+F*(m.aw+1),R=P+N0(V,M),$=R+(x+.5-R)*D,v0=p(V,$,.04);A.x=v0[0],A.y=v0[1],A.z=v0[2],A.u=H+V,A.v=$},!1,!0);const g0=F=>{const D=F*(B+4);if(D<=2)return[-M,P*D/2];if(D>=B+2)return[M,P*(B+4-D)/2];const A=-M+(D-2)/B*m.aw;return[A,P+N0(A,M)]},Y=m.revealAo??.55,b0=[0];for(let F=1;F<=B+4;F++){const D=g0((F-1)/(B+4)),A=g0(F/(B+4));b0.push(b0[F-1]+Math.hypot(A[0]-D[0],A[1]-D[1]))}if(l.set(m.revealPat??1,m.revealAux??1),m.reveal!==!1&&l.grid(B+4,1,(F,D,A)=>{const V=g0(F),R=p(V[0],V[1],-v*D);A.x=R[0],A.y=R[1],A.z=R[2],A.u=b0[Math.round(F*(B+4))],A.v=v*D,A.ao=.95-(.95-Y)*D},!1,!1),m.open){l.uvS=n0;return}l.set(m.backPat??3,m.backAux||0),l.grid(B,2,(F,D,A)=>{const V=-M+F*m.aw,R=(P+N0(V,M))*D,$=p(V,R,-v);A.x=$[0],A.y=$[1],A.z=$[2],A.u=H+V+.85,A.v=R,A.ao=.52+.14*D,m.backShade&&(A.b=0)},!1,!0);const o0=m.doorW??M*.42,r0=m.doorH??P*.8;l.set(m.doorPat??6,m.doorAux||0),l.grid(6,1,(F,D,A)=>{const V=-o0+F*2*o0,R=(r0+N0(V,o0)*.8)*D,$=p(V,R,-v+.06);A.x=$[0],A.y=$[1],A.z=$[2],A.u=V,A.v=R,A.ao=.6,A.g=m.doorG??0,A.b=m.doorB??.5},!1,!0),l.uvS=n0,!m.noSill&&(l.set(0,0),l.box(...p(0,.2,.25),m.aw+2*w+1.6,.4,.7,-c+Math.PI/2))}const yt=`
  uniform vec3 uTau;
  float tauOf(float slot) { return slot < 0.5 ? uTau.x : slot < 1.5 ? uTau.y : uTau.z; }
`;function $t(l,c,t){const y=new i.ShaderMaterial({fog:!0,uniforms:F0({...c}),vertexShader:`
      attribute vec4 aC, aV; attribute vec3 aR;
      ${yt}
      varying vec3 vWP, vN;
      #include <fog_pars_vertex>
      void main() {
        float t = tauOf(aV.w) - aC.w;
        float tl = clamp(t, 0.0, aR.z);
        float sc = step(0.0, t) * (1.0 - smoothstep(aR.z, aR.z + 0.3, t)) * aR.y;
        float a = t * (2.0 + 5.0 * aR.x), b = t * (1.0 + 4.0 * fract(aR.x * 7.3));
        float ca = cos(a), sa = sin(a), cb = cos(b), sb = sin(b);
        vec3 p = position, n = normal;
        p = vec3(p.x * ca - p.y * sa, p.x * sa + p.y * ca, p.z); n = vec3(n.x * ca - n.y * sa, n.x * sa + n.y * ca, n.z);
        p = vec3(p.x, p.y * cb - p.z * sb, p.y * sb + p.z * cb); n = vec3(n.x, n.y * cb - n.z * sb, n.y * sb + n.z * cb);
        vec3 c = aC.xyz + aV.xyz * tl + vec3(0.0, -4.9, 0.0) * tl * tl;
        vec4 wp = modelMatrix * vec4(c + p * sc, 1.0);
        vWP = wp.xyz; vN = normalize(mat3(modelMatrix) * n);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${B0}
      uniform vec3 cSnow;
      varying vec3 vWP, vN;
      #include <fog_pars_fragment>
      void main() {
        vec3 N = normalize(normalize(vN) + (vec3(vnoise(vWP.yz * 9.0), vnoise(vWP.xz * 9.0), vnoise(vWP.xy * 9.0)) - 0.5) * 0.7);
        float ndl = clamp(dot(N, uSunDir) * 0.8 + 0.2, 0.0, 1.0), mask = sunMask(vWP);
        vec3 col = cSnow * (0.72 + 0.16 * fbm(vWP.xz * 3.1 + vWP.y * 2.3)) * (uSunCol * ndl * mask * 0.44 + hemi(N) * 0.84);
        vec3 sc = floor(vWP * 26.0);
        col += uSunCol * step(0.99, h21(sc.xy + sc.z * 7.3)) * 1.6 * mask * ndl;
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`});return y.uniforms.uTau=t,A0(y,l)}function Gt(l,c,t){const y=new i.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:F0({...c}),vertexShader:`
      attribute vec4 aC, aV; attribute vec3 aR;
      uniform vec4 uWind;
      ${yt}
      varying vec3 vWP; varying vec3 vQ;   // corner xy, alpha
      varying float vSeed;
      #include <fog_pars_vertex>
      void main() {
        float t = tauOf(aV.w) - aC.w, a = clamp(t / aR.z, 0.0, 1.0);
        float k = (1.0 - exp(-1.6 * max(t, 0.0))) / 1.6;
        vec3 c = aC.xyz + aV.xyz * k + vec3(0.0, -1.5, 0.0) * max(t, 0.0) * (0.5 + k) + uWind.xyz * uWind.w * 0.35 * max(t, 0.0) * a;
        float size = aR.y * (0.35 + 2.4 * sqrt(a)) * step(0.0, t) * step(t, aR.z);
        vec4 wp = modelMatrix * vec4(c, 1.0);
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        float rot = aR.x * 6.283 + t * (aR.x - 0.5);
        vec2 q = vec2(position.x * cos(rot) - position.y * sin(rot), position.x * sin(rot) + position.y * cos(rot));
        wp.xyz += (right * q.x + up * q.y) * size;
        vWP = wp.xyz; vQ = vec3(position.xy, smoothstep(0.0, 0.07, a) * (1.0 - a) * (1.0 - a) * smoothstep(1.5, 6.0, length(cameraPosition - (modelMatrix * vec4(c, 1.0)).xyz))); vSeed = aR.x;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${B0}
      uniform vec3 cSnow;
      varying vec3 vWP; varying vec3 vQ; varying float vSeed;
      #include <fog_pars_fragment>
      void main() {
        float r = length(vQ.xy);
        float n = fbm(vQ.xy * 2.2 + vSeed * 31.0);
        float a = (1.0 - smoothstep(0.15 + 0.45 * n, 1.0, r)) * vQ.z * 0.56;
        if (a < 0.004) discard;
        float mask = sunMask(vWP);
        vec3 col = cSnow * 0.8 * (hemi(vec3(0.0, 0.6, 0.0)) * 0.95 + uSunCol * mask * (0.3 + 0.25 * n) * (1.0 - 0.5 * r));
        vec3 sc = floor(vWP * 9.0);
        col += uSunCol * step(0.995, h21(sc.xy + sc.z * 3.1 + floor(uTime * 3.0))) * 1.5 * mask * (1.0 - r);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`});return y.uniforms.uTau=t,A0(y,l)}function Ut(l,c){const t=new i.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,uniforms:F0({...c}),vertexShader:`
      attribute vec4 aA, aB;
      uniform vec4 uWind; uniform float uTime;
      varying vec3 vWP; varying vec4 vQ;
      #include <fog_pars_vertex>
      void main() {
        float s = aB.x, seed = aA.w, len = aB.z * 0.7;
        float yw = (fract(seed * 7.31) - 0.5) * 0.5, cy = cos(yw), sy = sin(yw);
        vec3 dir = normalize(vec3(uWind.x * cy - uWind.z * sy, uWind.y + 0.10 * sin(seed * 20.0), uWind.x * sy + uWind.z * cy));
        vec3 lat = normalize(cross(dir, vec3(0.0, 1.0, 0.0)));
        vec3 c = aA.xyz + dir * s * len;
        // each plume bends along its length as the wind swings, lifts off its anchor and then sags
        c.y += s * len * 0.10 + sin(s * 5.0 - uTime * 1.7 + seed * 9.0) * 0.7 * s - s * s * len * 0.15;
        c += lat * (sin(s * 3.7 - uTime * 1.1 + seed * 5.0) * 1.1 * s + sin(s * 5.0 + seed * 20.0 + uTime * 1.3) * s * len * 0.18);
        vec4 wp = modelMatrix * vec4(c, 1.0);
        vec3 wd = normalize(mat3(modelMatrix) * dir);
        vec3 sv = cross(wd, cameraPosition - wp.xyz); sv = sv / max(length(sv), 1e-4);
        wp.xyz += sv * aB.y * aB.w * (0.12 + 1.05 * s);
        vWP = wp.xyz; vQ = vec4(s, aB.y, seed, len);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${B0}
      uniform vec3 cSnow; uniform vec4 uWind;
      varying vec3 vWP; varying vec4 vQ;
      #include <fog_pars_fragment>
      void main() {
        float s = vQ.x, e = vQ.y, seed = vQ.z;
        float gust = 0.55 + 0.45 * sin(uTime * 0.8 + seed * 17.0);
        float n = fbm(vec2(s * vQ.w * 0.3 - uTime * 1.5, e * 1.6 + seed * 7.0));
        float n2 = vnoise(vec2(s * vQ.w * 1.4 - uTime * 3.2, e * 5.0 + seed * 3.0));
        float mask = sunMask(vWP);
        // torn into puffs along its length and gone over its last two fifths; thinner still where the sun lights it
        float a = pow(max(1.0 - e * e, 0.0), 2.0) * smoothstep(0.0, 0.1, s) * pow(clamp(1.0 - s, 0.0, 1.0), 1.4) * (1.0 - smoothstep(0.6, 1.0, s)) * smoothstep(0.24, 1.0, n * 0.8 + n2 * 0.5) * (0.34 + 0.3 * gust) * mix(1.0, 0.6, mask);
        if (a < 0.004) discard;
        vec3 V = normalize(cameraPosition - vWP);
        float fwd = pow(max(dot(-V, uSunDir), 0.0), 6.0);
        vec3 col = min(cSnow * 0.8 * (hemi(vec3(0.0, 0.5, 0.0)) + uSunCol * mask * (0.28 + 0.35 * fwd)), vec3(0.92));
        vec3 sc = floor(vWP * 9.0);
        float tw = step(0.975, h21(sc.xy + sc.z * 5.7)) * pow(max(sin(uTime * (3.0 + 6.0 * h21(sc.zx)) + h21(sc.yz) * 40.0), 0.0), 8.0);
        col += uSunCol * tw * 4.0 * mask;
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`});return A0(t,l)}function Qt(l,c){const t=new i.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,uniforms:{...c},vertexShader:`
      attribute vec4 aA;
      uniform vec4 uWind, uEdge; uniform float uTime, uSunAmt;
      varying vec3 vQ;
      void main() {
        vec3 box = vec3(90.0, 56.0, 90.0);
        vec3 c = mod(aA.xyz * box + uWind.xyz * uWind.w * uTime * 0.5 + vec3(0.0, -0.6 * uTime, 0.0), box) - box * 0.5 + vec3(0.0, 40.0, 0.0);
        c.x += sin(uTime * 0.6 + aA.w * 30.0) * 0.8; c.y += sin(uTime * 0.9 + aA.w * 50.0) * 0.4;
        vec4 wp = modelMatrix * vec4(c, 1.0);
        float dist = length(cameraPosition - wp.xyz);
        float size = max(0.03, dist * 0.0013);
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        wp.xyz += (right * position.x + up * position.y) * size;
        float d = dot(wp.xz, uEdge.xy) - uEdge.z;
        float mask = uSunAmt * (1.0 - smoothstep(-uEdge.w, uEdge.w, d));
        float tw = pow(max(sin(uTime * (2.0 + 5.0 * aA.w) + aA.w * 90.0), 0.0), 40.0);
        vQ = vec3(position.xy, tw * mask * smoothstep(3.0, 9.0, dist) * (1.0 - smoothstep(120.0, 260.0, dist)));
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      uniform vec3 uSunCol;
      varying vec3 vQ;
      void main() {
        float r = length(vQ.xy);
        float a = (1.0 - smoothstep(0.2, 1.0, r)) * vQ.z;
        if (a < 0.003) discard;
        gl_FragColor = vec4(uSunCol * 2.4 * a, 1.0);
      }`});return A0(t,l)}function Mt(l,c){const t=new Float32Array(l*12),y=new Float32Array(l*16),W=new Float32Array(l*16),m=new Float32Array(l*12),T=[],L=[-1,-1,1,-1,1,1,-1,1],p={a:[0,0,0,0],b:[0,0,0,0],c:[0,0,0]};for(let P=0;P<l;P++){c(P,p);for(let v=0;v<4;v++)t.set([L[v*2],L[v*2+1],0],(P*4+v)*3),y.set(p.a,(P*4+v)*4),W.set(p.b,(P*4+v)*4),m.set(p.c,(P*4+v)*3);T.push(P*4,P*4+1,P*4+2,P*4,P*4+2,P*4+3)}const M=new i.BufferGeometry;return M.setAttribute("position",new i.BufferAttribute(t,3)),M.setAttribute("aC",new i.BufferAttribute(y,4)),M.setAttribute("aA",new i.BufferAttribute(y,4)),M.setAttribute("aV",new i.BufferAttribute(W,4)),M.setAttribute("aR",new i.BufferAttribute(m,3)),M.setIndex(T),M}async function qt(l,c={}){const t=l.rng.fork?l.rng.fork("great-dome"):l.rng,y=l.noise,W=l.quality?.detail??1,m=(c.palette&&c.palette.length>=7?c.palette:Nt).map(e=>new i.Color(e)),T=c.duration??41,L=c.releaseU??.47,p=c.lightU??.46,M=c.slabAngle??Math.PI,P=new i.Group;P.name="snow-on-turquoise-hero";const v=t.range(.86,1.12),x=t.range(-.012,.016),w=m[1].clone().offsetHSL(x,0,t.range(-.02,.02)),S=t.range(0,40),C={uSunDir:{value:(c.sunDir?new i.Vector3().copy(c.sunDir):new i.Vector3(-.35,.42,.84)).normalize().clone()},uSunCol:{value:new i.Color("#FFF1D6").multiplyScalar(2.3)},uSunAmt:{value:1},uEdge:{value:new i.Vector4(Math.SQRT1_2,-Math.SQRT1_2,1e5,15)},uSky:{value:new i.Color("#6F9BE8").multiplyScalar(.95)},uBounce:{value:new i.Color("#DCE6F2").multiplyScalar(.5)},uTime:{value:0},uWind:{value:new i.Vector4(.75,.1,-.65,6)},uFogCap:{value:1},uFogTop:{value:1e5},uKey:{value:0},uGhost:{value:0},uShaft:{value:new i.Vector4(0,0,.01,0)},uShaft2:{value:new i.Vector4(0,0,.01,0)}};{const e=new i.Vector3(.75,.1,-.65).normalize();C.uWind.value.set(e.x,e.y,e.z,6)}const H={cSnow:{value:m[0]},cTurq:{value:w},cCob:{value:m[2]},cDeep:{value:m[3]},cOchre:{value:m[4]},cBuff:{value:m[6]}},n0=Dt(),l0=n0.length,_={r:0,y:0,nr:0,ny:0};await l.yield();{const e=t0*8,o=38,a=.03,n=e+1,u=new Float32Array(n*(o+1)*3),r=new Float32Array(n*(o+1)*3),k=new Float32Array(n*(o+1)*3),d=new Float32Array(n*(o+1)*4),z=(I,X,G)=>{R0(n0,X,_);const q=(I+.5-Math.floor(I+.5)-.5)*2,u0=Lt(_.r)*Et(q),z0=_.r+_.nr*u0,x0=I*U/t0;G[0]=Math.cos(x0)*z0,G[1]=_.y+_.ny*u0,G[2]=Math.sin(x0)*z0},f=[0,0,0],h=[0,0,0],g=[0,0,0],b=[0,0,0],N=[0,0,0];for(let I=0;I<=o;I++){const X=a+(1-a)*(I/o);for(let G=0;G<=e;G++){const q=G/8,u0=I*n+G,z0=q*U/t0;z(q,X,N),z(q-.03,X,f),z(q+.03,X,h),z(q,Math.max(.001,X-.004),g),z(q,Math.min(1,X+.004),b);const x0=h[0]-f[0],C0=h[1]-f[1],L0=h[2]-f[2],I0=b[0]-g[0],$0=b[1]-g[1],G0=b[2]-g[2];let T0=C0*G0-L0*$0,w0=L0*I0-x0*G0,W0=x0*$0-C0*I0;const P0=Math.hypot(T0,w0,W0)||1;u.set(N,u0*3),r.set([T0/P0,w0/P0,W0/P0],u0*3),R0(n0,X,_),k.set([_.nr*Math.cos(z0),_.ny,_.nr*Math.sin(z0)],u0*3),d.set([q+0,X*l0+S,_.r,1-.3*f0(.93,1,X)],u0*4)}I%2===1&&await l.yield()}const O=new Uint32Array(e*o*6);let j=0;for(let I=0;I<o;I++)for(let X=0;X<e;X++){const G=I*n+X;O[j++]=G,O[j++]=G+1,O[j++]=G+n,O[j++]=G+1,O[j++]=G+n+1,O[j++]=G+n}const c0=new i.BufferGeometry;c0.setAttribute("position",new i.BufferAttribute(u,3)),c0.setAttribute("normal",new i.BufferAttribute(r,3)),c0.setAttribute("aNm",new i.BufferAttribute(k,3)),c0.setAttribute("aD",new i.BufferAttribute(d,4)),c0.setIndex(new i.BufferAttribute(O,1));var e0=Ot(C,H);const h0=new i.Mesh(c0,e0);h0.name="dome",P.add(h0)}await l.yield();const J=(Math.round(M/(U/t0)-.5)%t0+t0)%t0,i0=[J,(J+1)%t0,(J+2)%t0],Q=c.relV||[t.range(.61,.64),t.range(.64,.68),t.range(.67,.71)],g0=[0,t.range(.2,.35),t.range(.4,.6)],Y={a:6.5,vmax:15},b0=e=>{if(e<=0)return 0;const o=Y.vmax/Y.a;return e<o?.5*Y.a*e*e:.5*Y.a*o*o+Y.vmax*(e-o)},o0=e=>{const o=Y.vmax/Y.a,a=.5*Y.a*o*o;return e<a?Math.sqrt(2*e/Y.a):o+(e-a)/Y.vmax},r0={uShed:{value:new i.Vector4(-1,2,0,.5)},prof:n0.tab,uSlide:{value:new i.Vector3},uRelV:{value:new i.Vector3(Q[0],Q[1],Q[2])},len:l0},F=[],D=[],A=[],V=[],R=[],$=[];let v0=0;const M0=(e,o,a,n,u,r)=>{const k=(e+.5)*U/t0,d=t(),z=v0,f=[];for(let h=0;h<=n;h++){const g=o+(a-o)*(h/n),b=y.n2(e*2.9+50,g*3.6),N=.62-.36*f0(.66,.95,g);f.push(r?0:f0(N,N+.07,b))}if(!r)for(const h of[0,1])for(let g=0,b=-1;g<=n+1;g++){const N=g<=n&&f[g]<.5==(h===1);if(N&&b<0&&(b=g),!N&&b>=0){if(g-b<3&&(h===1?b>n*.35:b>0&&g<=n))for(let O=b;O<g;O++)f[O]=h;b=-1}}for(let h=0;h<=n;h++){const g=o+(a-o)*(h/n),b=y.n2(e*3.7+11,g*9);let N=(.96-.41*f0(.03,.22,g)-.1*f0(.34,.58,g)-.12*f0(.62,.8,g)-.08*f0(.85,1,g))*v*(1+.13*b),O=(.16+.07*b+.1*f0(.3,.05,g))*v;const j=f[h];N*=(.86+.3*y.n2(e*7.1+3,g*46))*(1-.25*j),O*=1-.5*j,r&&(N=Math.min(.66,N*1.1),O*=1.5);const c0=r?1:f0(0,.03,g-o)*f0(0,.075,a-g);N=Math.min(.97,N*(.5+.5*c0)),O*=.4+.6*c0;const h0=r?0:Math.max(j,1-c0);for(let I=0;I<5;I++)F.push(0,40,0),D.push(0,1,0),A.push(k,g,(I-2)/2,N),V.push(u,d,O),R.push(h0);if(h<n)for(let I=0;I<4;I++){const X=z+h*5+I,G=X+1,q=X+5,u0=q+1;$.push(X,q,G,G,q,u0)}}v0+=(n+1)*5};for(let e=0;e<t0;e++){const o=i0.indexOf(e),a=.04+.02*t(),n=o>=0?.99:t.range(.88,.99)-(t.chance(.18)?t.range(.1,.25):0);o>=0?(M0(e,a,Q[o]-5e-4,26,3,!1),M0(e,Q[o],n,32,o,!0)):M0(e,a,n,40,3,!1)}await l.yield();const s=new wt,K=new wt,a0=19,O0=2*a0*Math.tan(Math.PI/8),m0=13.9,d0=13,ct=new i.Matrix4,s0=(e,o,a={})=>{for(let n=0;n<o.length-1;n++)e.ring(o[n][0],o[n][1],o[n+1][0],o[n+1][1],a)},_0=(e,o,a=5)=>{const n=[];for(let u=0;u<=a;u++){const r=-1.25+2.5*u/a;n.push([Math.max(.12,Math.cos(r)*o),e+Math.sin(r)*o])}return n},Q0=(e,o,a)=>(n,u)=>{const r=Math.min(a-1,Math.floor(u*a));return o*Math.abs(Math.sin(n*e*.5+r*Math.PI*.5))*(.45+.55*(u*a-r))},q0=(e,o)=>(a,n,u)=>{const r=Math.min(o-1,Math.floor(n*o)),k=Math.floor(a*e/U+r*.5);u.g=(k+r)%2?.92:.06,u.b=.35+.5*((k*7+r*3)%5/4)};for(let e=0;e<8;e++){const o=e*Math.PI/4;e!==2&&bt(s,o,a0,O0,m0,{aw:6.4,spring:4.6,depth:1.3,wallPat:1,wallAux:0,u0:e*2.4+S,backPat:t.chance(.35)?6:3});const a=Math.cos(o),n=Math.sin(o),u=O0/2,r=(z,f,h)=>[a*(a0+h)+n*z,f,n*(a0+h)-a*z];s.set(5,0),s.quad(r(-u,11.6,.1),r(u,11.6,.1),r(u,12.1,.1),r(-u,12.1,.1)),s.set(0,0),s.quad(r(-u,m0,.05),r(u,m0,.05),r(u-.25,m0,-.6),r(-u+.25,m0,-.6)),s.quad(r(u-.25,d0,-.6),r(-u+.25,d0,-.6),r(-u+.25,m0,-.6),r(u-.25,m0,-.6));const k=o+Math.PI/8,d=a0/Math.cos(Math.PI/8);s.m=ct.clone().makeTranslation(Math.cos(k)*d,0,Math.sin(k)*d),s.set(4,0),s.ring(.72,0,.62,14.3,{nu:10,nv:2,girth:14.4513,vLen:14.3}),s.set(5,0),s0(s,[[.8,14.3],[.8,14.7],[.5,15]],{nu:10}),s.set(8,0),s0(s,[[.5,15],[.66,15.4],[.5,15.9],[.12,16.3]],{nu:10,cf:(z,f,h)=>{h.g=.05,h.b=.6}}),s.m=null}await l.yield();{const e=a0+4.5,o=17.5,a=21,n=Math.PI/2;bt(s,n,e,o,a,{aw:8.6,spring:7.5,depth:3.4,wallPat:1,wallAux:1,frame:.8,backPat:3,doorPat:7,doorW:1.5,doorH:4.2,revealPat:3,u0:S});const u=(k,d,z)=>[k,d,e+z],r=o/2;s.set(2,0),s.grid(1,1,(k,d,z)=>{z.x=-r+.6+k*(o-1.2),z.y=15.6+2.2*d,z.z=e+.1,z.u=k*32,z.v=d*4},!1,!0),s.set(5,0),s.quad(u(-r,18.2,.12),u(r,18.2,.12),u(r,18.7,.12),u(-r,18.7,.12)),s.set(1,0),s.quad(u(r,0,0),u(r,0,-4.5-3),u(r,a,-4.5-3),u(r,a,0),0,0,.8,1),s.quad(u(-r,0,-4.5-3),u(-r,0,0),u(-r,a,0),u(-r,a,-4.5-3),0,0,.8,1),s.set(0,0),s.quad(u(r,m0-1,-7.5),u(-r,m0-1,-7.5),u(-r,a,-7.5),u(r,a,-7.5)),s.quad(u(-r,a,0),u(r,a,0),u(r,a,-7.5),u(-r,a,-7.5));for(const k of[-1,1])s.m=ct.clone().makeTranslation(k*r,0,e-.2),s.set(0,0),s.ring(1.25,0,1.25,2.4,{nu:8}),s.ring(1.25,2.4,1,2.4,{nu:8}),s.set(4,0),s.ring(1,2.4,.86,22.6,{nu:14,nv:3,girth:14.4513,vLen:20.2}),s.set(5,0),s0(s,[[.98,22.6],[1.05,23],[1.3,23.5],[1.3,23.8],[.8,23.8]],{nu:14}),s.set(8,0),s0(s,[[.8,23.8],[1.05,24.5],[.95,25.2],[.55,25.9],[.1,26.3]],{nu:16,rf:d=>.06*Math.abs(Math.cos(d*4)),cf:(d,z,f)=>{f.g=.04,f.b=.6}}),s.set(5,1),s0(s,[[.1,26.3],..._0(26.7,.22,3),[.03,27.6]],{nu:6}),s.m=null}await l.yield(),s.set(0,0),s.grid(64,1,(e,o,a)=>{const n=e*U,u=(n+Math.PI/8)%(Math.PI/4)-Math.PI/8,r=(a0-.6)/Math.cos(u),k=r+(13.4-r)*o;a.x=Math.cos(n)*k,a.z=Math.sin(n)*k,a.y=d0,a.u=a.x,a.v=a.z,a.ao=1-.3*o},!0,!1),s0(s,[[14.3,d0],[14.3,13.9],[13.55,13.9]],{nu:48}),s.set(5,0),s0(s,[[13.5,13.9],[13.62,14.25],[13.12,14.6]],{nu:64}),s.set(1,0),s.ring(13,14.6,13,21.5,{nu:96,nv:2,girth:81.6,v0:0,vLen:6.9,ao:e=>.8+.2*Math.min(1,e*3)}),s.set(5,0),s0(s,[[13,21.5],[13.14,21.6],[13.14,21.9],[13,22]],{nu:96}),s.set(2,0),s.ring(13,22,13,26,{nu:96,nv:1,girth:82,v0:0,vLen:4}),s.set(5,0),s0(s,[[13,26],[13.14,26.1],[13.14,26.4],[13,26.5]],{nu:96}),s.set(1,1),s.ring(13,26.5,13,28.3,{nu:96,nv:1,girth:81.6,v0:.3,vLen:1.8,ao:e=>1-.28*e}),s.set(8,0),s.ring(13,28.3,15.3,30.3,{nu:192,nv:9,rf:Q0(48,.24,3),cf:q0(48,3),ao:e=>.62+.38*e}),s.set(5,0),s0(s,[[15.55,30.3],[15.6,30.75],[13.2,30.75]],{nu:96}),await l.yield();for(let e=0;e<8;e++){const o=(e+.5)*Math.PI/4,a=1.15/13;for(const[n,u,r]of[[5,.3,13.04],[6,0,13.08]])s.set(n,0),s.grid(6,1,(k,d,z)=>{const f=(k-.5)*2,h=o+f*(a+u/13),g=18.6+u+N0(f*1.15,1.15)*1,b=15.7-u+(g-15.7+u)*d;z.x=Math.cos(h)*r,z.z=Math.sin(h)*r,z.y=b,z.u=f*1.15,z.v=b,z.ao=.85},!1,!1)}s.set(7,0);const ut=t.int(14,22),St=t.range(0,U);for(let e=0;e<ut;e++){if(t.chance(.25))continue;const o=St+e*U/ut,a=t.range(1.1,2),n=13+a/2-.2;s.box(Math.cos(o)*n,27.2+t.range(-.05,.05),Math.sin(o)*n,a,.16,.16,-o)}const p0=t.range(-1.9,-.5);for(let e=0;e<4;e++){const o=p0+(e-1.5)*.11;for(const a of[13.5,14.9])s.box(Math.cos(o)*a,d0+6.6,Math.sin(o)*a,.16,13.2+t.range(-.6,1.4),.16,-o,[t.range(-.01,.01),t.range(-.01,.01)])}for(let e=0;e<3;e++){const o=d0+3.6+e*4.1;s.box(Math.cos(p0)*14.2,o,Math.sin(p0)*14.2,1.7,.08,4.9,-p0),s.box(Math.cos(p0)*14.95,o-.5,Math.sin(p0)*14.95,.1,.1,5.2,-p0)}s.box(Math.cos(p0+.26)*14.4,d0+2,Math.sin(p0+.26)*14.4,.5,4.2,.08,-p0,[0,0]),s.set(5,1),s0(s,[[1.8,56.8],[1.65,57.7],[.8,58.3],[.42,58.9],..._0(59.9,.95),[.3,60.75],..._0(61.35,.62),..._0(62.2,.36,4),[.14,62.7],[.03,64]],{nu:20}),await l.yield();const H0=Math.atan2(C.uWind.value.z,C.uWind.value.x);K.grid(128,3,(e,o,a)=>{const n=e*U,u=(.2+.14*y.n2(Math.cos(n)*4,Math.sin(n)*4+7))*v,r=o*3,k=r<1?15.82-.5*r:r<2?15.32-1.1*(r-1):14.22-.95*(r-2);a.y=r<1?30.62+(.13+u)*r:r<2?30.75+u*(1+.15*(r-1)):30.75+u*1.15+(.35+u)*(r-2),a.x=Math.cos(n)*k,a.z=Math.sin(n)*k},!0,!1),K.grid(96,5,(e,o,a)=>{const n=e*U,u=(n+Math.PI/8)%(Math.PI/4)-Math.PI/8,r=(a0-.75)/Math.cos(u),k=r+(14.25-r)*o,d=Math.max(0,Math.cos(n-H0));a.x=Math.cos(n)*k,a.z=Math.sin(n)*k,a.y=d0+(.1+.1*y.n2(a.x*.35,a.z*.35)+(.25+1*d)*o*o*o+.4*(1-o)*(1-o)*(1-o))*v},!0,!1),K.grid(8,4,(e,o,a)=>{const n=Math.min(e,1-e)*8,u=Math.min(o,1-o)*4,r=Math.min(1,n)*Math.min(1,u);a.x=(e-.5)*17.9,a.z=a0-3.1+o*7.8,a.y=20.95+(.12+.3*r+.12*y.n2(a.x*.5,a.z*.5))*v},!1,!0),await l.yield();const Y0=[],ft=(e,o,a,n,u)=>{const r=new i.Vector3(Math.sin(a),0,-Math.cos(a)),k=new i.Matrix4().makeRotationAxis(r,n*Math.PI/180).setPosition(e,0,o);s.m=k,K.m=k;const d=f=>f*u,z=f=>2.75-.6*(f-5.3)/27.7;s.set(0,0),s.ring(3.3,0,3.2,d(4.6),{nu:8,nv:2,ao:f=>.75+.25*f}),s.ring(3.2,d(4.6),2.85,d(4.6),{nu:8}),s.set(5,0),s0(s,[[2.85,d(4.6)],[2.95,d(4.95)],[2.75,d(5.3)]],{nu:32}),s.set(4,0),s.ring(2.75,d(5.3),2.15,d(33),{nu:32,nv:6,girth:14.4513,v0:t.range(0,6),vLen:d(27.7)}),s.set(5,0);for(const f of[17.6,32.5]){const h=z(f)+.1;s0(s,[[h-.1,d(f-.4)],[h,d(f-.3)],[h,d(f+.3)],[h-.12,d(f+.4)]],{nu:32})}s.set(8,0),s.ring(2.15,d(33),3.4,d(35.4),{nu:96,nv:6,rf:Q0(24,.2,3),cf:q0(24,3),ao:f=>.6+.4*f}),s.set(5,0),s0(s,[[3.6,d(35.4)],[3.65,d(35.7)],[1.75,d(35.7)]],{nu:32}),s.set(6,0),s.ring(3.5,d(35.7),3.5,d(36.6),{nu:32,girth:21.84,vLen:.84}),s.set(1,1),s.ring(1.75,d(35.7),1.65,d(39.6),{nu:24,nv:1,girth:9.6,vLen:3.9}),s.set(8,0),s.ring(1.65,d(39.6),2.15,d(40.3),{nu:64,nv:3,rf:Q0(16,.12,1),cf:q0(16,1),ao:f=>.65+.35*f}),s.set(5,0),s0(s,[[2.3,d(40.3)],[2.32,d(40.55)],[1.6,d(40.55)]],{nu:32}),s.set(8,0),s.grid(64,10,(f,h,g)=>{const b=f*U,N=Math.max(0,(h-.3)/.7),j=(h<.3?1.6+.38*Math.sin(h/.3*Math.PI/2):1.98*Math.pow(Math.max(0,1-Math.pow(N,1.9)),.62))*(1+.075*Math.abs(Math.cos(b*8)))+.1*(1-h);g.x=Math.cos(b)*j,g.z=Math.sin(b)*j,g.y=d(40.55+3.5*h),g.u=f*12,g.v=h*4,g.g=.03,g.b=.62+.25*Math.abs(Math.cos(b*8))},!0,!1),s.set(5,1),s0(s,[[.2,d(43.9)],..._0(d(44.05)+.4,.3,4),[.1,d(44.05)+.85],[.02,d(44.05)+1.7]],{nu:8}),K.grid(32,2,(f,h,g)=>{const b=f*U,N=3.68-1.9*h;g.x=Math.cos(b)*N,g.z=Math.sin(b)*N,g.y=d(35.7)+(h===0?-.06:.16+.1*y.n2(b*2,e))+.2*h*h},!0,!1),K.grid(32,2,(f,h,g)=>{const b=f*U,N=3.62-.24*h;g.x=Math.cos(b)*N,g.z=Math.sin(b)*N,g.y=d(36.6)+(h===1?.14+.07*y.n2(b*3,o):0)},!0,!1),K.grid(24,3,(f,h,g)=>{const b=f*U,N=.58+.42*h,O=1.98*Math.pow(Math.max(0,1-Math.pow((N-.3)/.7,1.9)),.62),j=Math.max(.24,O*1.09+.06+.07*y.n2(b*2,e+h*3)*(1-h));g.x=Math.cos(b)*j,g.z=Math.sin(b)*j,g.y=d(40.55+3.5*N)+.1},!0,!1),s.m=null,K.m=null,Y0.push({base:new i.Vector3(e,0,o),top:new i.Vector3(0,d(44.05)+1.7,0).applyMatrix4(k),lean:new i.Vector3(Math.cos(a),0,Math.sin(a)).multiplyScalar(Math.sin(n*Math.PI/180)),balconyY:d(35.7),radius:3.7})};c.minarets!==!1&&(ft(-22,130,t.range(0,U),t.range(2,3),t.range(.97,1.04)),await l.yield(),ft(-34,80,t.range(0,U),t.range(2,3),t.range(.93,1))),await l.yield();const K0=It(C,H);K0.side=i.DoubleSide,e0.side=i.DoubleSide;const vt=new i.Mesh(s.toGeometry(),K0);vt.name="drum-hall-minarets",P.add(vt),await l.yield();for(let e=0;e<K.count;e++)F.push(K.p[e*3],K.p[e*3+1],K.p[e*3+2]),D.push(K.n[e*3],K.n[e*3+1],K.n[e*3+2]),A.push(0,0,0,0),V.push(-1,0,0),R.push(0);for(let e=0;e<K.i.length;e++)$.push(K.i[e]+v0);const S0=new i.BufferGeometry;S0.setAttribute("position",new i.Float32BufferAttribute(F,3)),S0.setAttribute("normal",new i.Float32BufferAttribute(D,3)),S0.setAttribute("aG",new i.Float32BufferAttribute(A,4)),S0.setAttribute("aS",new i.Float32BufferAttribute(V,3)),S0.setAttribute("aE",new i.Float32BufferAttribute(R,1)),S0.setIndex($);const X0=jt(C,H,r0);X0.side=i.DoubleSide;const Z0=new i.Mesh(S0,X0);Z0.name="snow",Z0.frustumCulled=!1,P.add(Z0),await l.yield();const J0={value:new i.Vector3(-1,-1,-1)},D0=i0.map(e=>(e+.5)*U/t0),tt=Q.map(e=>o0((1-e)*l0)),j0=(e,o,a=.3)=>{R0(n0,o,_);const n=D0[e],u=_.r+_.nr*a;return new i.Vector3(Math.cos(n)*u,_.y+_.ny*a,Math.sin(n)*u)};{const e=new i.IcosahedronGeometry(1,0).toNonIndexed(),o=e.getAttribute("position"),a=60,n=o.count,u=new Float32Array(a*n*3),r=new Float32Array(a*n*3),k=new Float32Array(a*n*4),d=new Float32Array(a*n*4),z=new Float32Array(a*n*3),f=new i.Vector3,h=new i.Vector3,g=new i.Vector3,b=new i.Vector3;for(let j=0;j<a;j++){const c0=j%3,h0=D0[c0]+t.range(-.035,.035),I=tt[c0]*Math.pow(t(),.55),G=1.2+.32*Math.min(Y.vmax,Y.a*I)+t.range(0,2.2),q=t.range(-2.5,2.8),u0=t.range(-1.3,1.3),z0=t.range(.15,.36)*(t.chance(.15)?1.2:1),x0=[Math.cos(h0)*15.5,31,Math.sin(h0)*15.5],C0=[Math.cos(h0)*G-Math.sin(h0)*u0,q,Math.sin(h0)*G+Math.cos(h0)*u0],L0=(q+Math.sqrt(q*q+19.6*(31-d0-.4)))/9.8,I0=(q+Math.sqrt(q*q+19.6*30.6))/9.8,$0=15.5+G*L0<a0-1?L0:I0,G0=t(),T0=[t.range(.8,1.2),t.range(.66,.95),t.range(.8,1.2)];for(let w0=0;w0<n;w0+=3){const W0=(j*n+w0)*3,P0=Z=>{Z.fromBufferAttribute(o,w0+(Z===f?0:Z===h?1:2));const k0=Math.sin(Z.x*12.9+Z.y*78.2+Z.z*37.7+j)*43758.5;Z.multiplyScalar(.8+.4*(k0-Math.floor(k0))),Z.x*=T0[0],Z.y*=T0[1],Z.z*=T0[2]};P0(f),P0(h),P0(g),b.subVectors(h,f).cross(g.clone().sub(f)).normalize(),u.set([f.x,f.y,f.z,h.x,h.y,h.z,g.x,g.y,g.z],W0);for(let Z=0;Z<3;Z++){const k0=Z===0?f:Z===1?h:g,st=k0.length()||1,mt=b.x*.3+k0.x/st*.7,dt=b.y*.3+k0.y/st*.7,pt=b.z*.3+k0.z/st*.7,nt=Math.hypot(mt,dt,pt)||1;r.set([mt/nt,dt/nt,pt/nt],W0+Z*3),k.set([x0[0],x0[1],x0[2],I],(j*n+w0+Z)*4),d.set([C0[0],C0[1],C0[2],c0],(j*n+w0+Z)*4),z.set([G0,z0,$0],W0+Z*3)}}}e.dispose();const N=new i.BufferGeometry;N.setAttribute("position",new i.BufferAttribute(u,3)),N.setAttribute("normal",new i.BufferAttribute(r,3)),N.setAttribute("aC",new i.BufferAttribute(k,4)),N.setAttribute("aV",new i.BufferAttribute(d,4)),N.setAttribute("aR",new i.BufferAttribute(z,3));const O=new i.Mesh(N,$t(C,H,J0));O.name="chunks",O.frustumCulled=!1,O.material.side=i.DoubleSide,P.add(O)}await l.yield();{const a=Mt(144,(u,r)=>{const k=u%3,d=D0[k];if(u<96){const z=tt[k]*Math.pow(t(),.6),f=Math.min(Y.vmax,Y.a*z),h=1.5+.3*f+t.range(0,3),g=t.range(-2,2),b=d+t.range(-.05,.05);r.a=[Math.cos(b)*15.6,30.9+t.range(-.3,.8),Math.sin(b)*15.6,z],r.b=[Math.cos(b)*h-Math.sin(b)*g,t.range(-2,13)-.1*f,Math.sin(b)*h+Math.cos(b)*g,k],r.c=[t(),t.range(1.3,2.6),t.range(2.6,4.4)]}else{const z=Q[k]+(1-Q[k])*Math.pow(t(),1.5),f=j0(k,z,.7),h=o0((z-Q[k])*l0)*t.range(.7,1);R0(n0,z,_),r.a=[f.x,f.y,f.z,h],r.b=[Math.cos(d)*(_.nr*3.2+_.ny*2.5),_.ny*3.2-_.nr*3.5+t.range(0,2),Math.sin(d)*(_.nr*3.2+_.ny*2.5),k],r.c=[t(),t.range(.6,1.1),t.range(1.2,2)]}}),n=new i.Mesh(a,Gt(C,H,J0));n.name="powder",n.frustumCulled=!1,n.renderOrder=3,P.add(n)}await l.yield();{const e=[];for(let z=0;z<10;z++){const f=t.range(0,U),h=t.range(.4,3.2);e.push([Math.cos(f)*h,57.2+t.range(-.8,.6),Math.sin(f)*h,t.range(18,34),t.range(1.4,3)])}for(let z=0;z<10;z++){const f=H0+t.range(-1.9,1.9),h=t.range(.16,.62);R0(n0,h,_),e.push([Math.cos(f)*(_.r+.4),_.y+.3,Math.sin(f)*(_.r+.4),t.range(10,20),t.range(.8,1.6)])}for(let z=0;z<6;z++){const f=H0+t.range(-1.6,1.6);e.push([Math.cos(f)*15.6,31,Math.sin(f)*15.6,t.range(8,14),t.range(.8,1.6)])}for(const z of Y0)for(let f=0;f<2;f++)e.push([z.top.x,z.top.y-2.6-f*6.5,z.top.z,t.range(7,12),t.range(.7,1.3)]);e.push([0,21.3,a0+2,10,1.4],[6,21.3,a0,12,1.2]);const o=18,a=e.length,n=new Float32Array(a*(o+1)*8),u=new Float32Array(a*(o+1)*8),r=[];e.forEach((z,f)=>{const h=t();for(let g=0;g<=o;g++)for(let b=0;b<2;b++){const N=(f*(o+1)+g)*2+b;n.set([z[0],z[1],z[2],h],N*4),u.set([g/o,b*2-1,z[3],z[4]],N*4)}for(let g=0;g<o;g++){const b=(f*(o+1)+g)*2;r.push(b,b+1,b+2,b+1,b+3,b+2)}});const k=new i.BufferGeometry;k.setAttribute("position",new i.BufferAttribute(new Float32Array(a*(o+1)*6),3)),k.setAttribute("aA",new i.BufferAttribute(n,4)),k.setAttribute("aB",new i.BufferAttribute(u,4)),k.setIndex(r);const d=new i.Mesh(k,Ut(C,H));d.name="spindrift",d.frustumCulled=!1,d.renderOrder=2,P.add(d)}if(await l.yield(),c.dust!==!1){const e=Mt(Math.round(1500*W),(a,n)=>{n.a=[t(),t(),t(),t()],n.b=[0,0,0,0],n.c=[0,0,0]}),o=new i.Mesh(e,Qt(C,{}));o.name="ice-dust",o.frustumCulled=!1,o.renderOrder=4,P.add(o)}await l.yield();let ht=!1,zt=-1;const Pt=C.uSky.value.clone(),kt=C.uBounce.value.clone(),At=new i.Color("#DDE4EC").multiplyScalar(.62),Ct=new i.Color("#DDE4EC").multiplyScalar(.46),et=new i.Vector3,ot=e=>{zt=e;for(let o=0;o<3;o++){const a=e-g0[o],n=Math.min(b0(a),l0+2);r0.uSlide.value.setComponent(o,n),J0.value.setComponent(o,a>0?a:-1),e0.uniforms.uWet.value[o].set(i0[o]+.5,Q[o]*l0+S,Q[o]*l0+S+n,n>0?1:0)}};ot(-1);const Tt=e=>{ht=!0,ot((e-L)*T);const o=f0(p-.05,p+.05,e);C.uSunAmt.value=.1+.9*o,C.uSky.value.copy(At).lerp(Pt,o),C.uBounce.value.copy(Ct).lerp(kt,o),P.getWorldPosition(et);const a=C.uEdge.value;a.z=et.x*a.x+et.z*a.y+(e-p)*1e3,a.w=15},Wt=(e={})=>{e.sun&&C.uSunDir.value.copy(e.sun).normalize(),e.sunColor&&C.uSunCol.value.copy(e.sunColor),e.sunAmount!==void 0&&(C.uSunAmt.value=e.sunAmount),e.sky&&C.uSky.value.copy(e.sky),e.bounce&&C.uBounce.value.copy(e.bounce),e.edge&&C.uEdge.value.set(e.edge[0],e.edge[1],e.edge[2],e.edge[3]??15)},Bt=e=>{r0.uShed.value.set(e,e>0?0:2,(i0[0]+.5)*U/t0,.25),e0.uniforms.uWetAll.value=e>0?Math.min(1,Math.max(0,(e-.8)/1.8)):0},E=(e,o,a)=>new i.Vector3(e,o,a),at=E(Math.cos(D0[0]),0,Math.sin(D0[0])),Ft={closePass:[E(-38,37,22),E(-32,42,-3),E(-27.5,44,-25),E(-8,44,-37),E(15.5,43,-35),E(33,39,-19)],flyThrough:[E(-48,19,162),E(-34,24,130),E(-22,31,80),E(-38,37,22),E(-32,42,-3),E(-27.5,44,-25),E(-8,44,-37),E(15.5,43,-35),E(33,39,-19),E(55,27,22),E(88,15,44)],lookAt:j0(0,.66,.3),slab:{top:j0(0,Q[0]),bulge:j0(0,.84),cornice:E(at.x*15.6,30.9,at.z*15.6),outward:at,grooves:i0.slice(),seconds:Math.max(...tt.map((e,o)=>e+g0[o]))+2.6},crown:E(0,U0,0),finialTip:E(0,64,0),corniceRing:{y:30.75,radius:15.8},drum:{radius:13,footY:d0},hall:{apothem:a0,wallTop:m0},minarets:Y0,viewpoints:{south:E(4,30,96),west:E(-24,40,0),reveal:E(21,39,-12),ghost:E(-90,13,350)},portalSeat:{position:E(0,7,a0+5.5),facing:E(0,0,1)},wind:E(C.uWind.value.x,C.uWind.value.y,C.uWind.value.z)};return{object:P,radius:36,height:64,center:E(0,37,0),anchors:Ft,uniforms:C,setProgress:Tt,setLight:Wt,setShed:Bt,colors:H,materials:{tile:K0,dome:e0,snow:X0},update(e,o,a){C.uTime.value=o,ht||ot(o%10)},dispose(){},ground:!0,groundY:0}}export{B0 as GLSL_LIGHT,wt as Geo,N0 as archH,bt as archWall,qt as buildHero,It as tileMaterial,Vt as worldCastGLSL};
