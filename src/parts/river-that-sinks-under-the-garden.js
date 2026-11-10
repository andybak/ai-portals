import*as n from"three";import{clamp as ye,lerp as oe,smoothstep as q}from"../kit/core.js";import*as Be from"../kit/terrain.js";import*as we from"../kit/flora.js";import"../kit/fx.js";const ee=Math.PI*2,X=c=>new n.Color(c),de=`
float rsH(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float rsH1(float n){ return fract(sin(n * 12.9898 + 4.1414) * 43758.5453); }
float rsN(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(rsH(i), rsH(i + vec3(1,0,0)), f.x), mix(rsH(i + vec3(0,1,0)), rsH(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(rsH(i + vec3(0,0,1)), rsH(i + vec3(1,0,1)), f.x), mix(rsH(i + vec3(0,1,1)), rsH(i + vec3(1,1,1)), f.x), f.y), f.z); }
float rsF(vec3 p){ return rsN(p) * 0.5 + rsN(p * 2.03 + 11.7) * 0.3 + rsN(p * 4.11 + 5.3) * 0.2; }
`;function qe(){return{uTime:{value:0},uSunDir:{value:new n.Vector3(-.42,.66,.62).normalize()},uSunCol:{value:new n.Color(1,.93,.8).multiplyScalar(3)},uSkyCol:{value:new n.Color("#5d8fd6")},uHorizonCol:{value:new n.Color("#cfe2f2")},uGroundCol:{value:new n.Color("#4a6a3c")},uLamp:{value:new n.Color(0,0,0)},uIceGlow:{value:new n.Color("#9fe6ff")},uIceDeep:{value:new n.Color("#2a6fb8")},uIceGain:{value:1},uShaft:{value:new n.Color(1,.95,.82)},uDay:{value:new n.Color(1,.95,.82)},uDome:{value:new n.Vector4(0,59,0,41)}}}const Oe=`
uniform vec4 uShaftP[5]; uniform vec3 uShaftC, uBelowC; uniform vec4 uBelow;
vec3 rsSeaLight(vec3 P, vec3 n, float t){
  float hgt = max(P.y - uBelow.x, 0.0);
  float net = 1.0 - abs(2.0 * rsN(vec3(P.xz * 0.11 + vec2(t * 0.07, 0.0), P.y * 0.09 - t * 0.16)) - 1.0); net *= net; net *= net;
  float low = exp(-min(hgt / uBelow.y, 20.0)), high = exp(-min(hgt / (uBelow.y * 5.0), 20.0));
  vec3 lit = uBelowC * (low * (0.55 + 1.1 * net) + uBelow.z * high) * (0.5 + 0.5 * max(-n.y, 0.0) + 0.3 * (1.0 - abs(n.y)));
  for (int i = 0; i < 5; i++) {
    vec2 dv = uShaftP[i].xy - P.xz; float d = length(dv), rr = uShaftP[i].z;
    float inB = 1.0 - smoothstep(rr * 0.55, rr * 1.25, d);
    float facing = 0.3 + 0.7 * max(dot(n.xz, dv / max(d, 1e-3)), 0.0);
    lit += uShaftC * uShaftP[i].w * (inB * (0.4 + 0.6 * max(n.y, 0.0)) + (1.0 - inB) * facing * rr * rr / (rr * rr + 0.12 * d * d));
  }
  return lit;
}`;function st(c){const e=[];for(let i=0;i<5;i++){const d=(c.shafts||[])[i]||[0,0,1,0];e.push(new n.Vector4(d[0],d[1],d[2],d[3]))}return{uShaftP:{value:e},uShaftC:{value:X(c.shaftColor||"#cfe6ff")},uBelowC:{value:X(c.belowColor||"#3fd0b0")},uBelow:{value:new n.Vector4(c.seaY??0,c.reach??18,c.vault??.5,0)}}}function Ge(c,e={}){return new n.ShaderMaterial({fog:!e.ownFog,side:e.side??n.FrontSide,defines:e.sea?{SEA_LIGHT:1}:{},uniforms:{...n.UniformsLib.fog,...c,...e.sea?{...e.sea.uniforms,uSeaAmb:{value:e.sea.ambient??.25},uRimC:{value:X(e.sea.rim||"#9fe6ff")},uInnerC:{value:X(e.sea.inner||"#7fe9ff")}}:{},uOwnFog:{value:new n.Vector4(...e.ownFog||[0,0,0,0])},uCliffX:{value:new n.Vector2(e.cliffX??0,e.cliffX!=null?1:0)},uScale:{value:e.scale??1},uDark:{value:e.dark??0},uFade:{value:new n.Vector4(...e.fade||[1e6,2e6,-2e6,-1e6])},uUnder:{value:new n.Color(e.under||"#000000")},uTint:{value:new n.Vector3(...e.tint||[1,1,1])},uGrey:{value:e.grey??0},uHallA:{value:new n.Vector4(e.halls?.x1??0,e.halls?.x2??0,e.halls?.blend??1,e.halls?1:0)},uHallPhos:{value:new n.Color(e.halls?.phos||"#000000")},uLampP:{value:new n.Vector4(...e.lamp||[0,0,0,0])},uLampC:{value:new n.Color(e.lampColor||"#000000")}},vertexShader:`
      attribute vec3 aIce; varying vec3 vW, vN, vIce;
      #include <fog_pars_vertex>
      void main(){
        vIce = aIce;
        vec4 w = modelMatrix * vec4(position, 1.0);
        #ifdef USE_INSTANCING
          w = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        #else
          vN = normalize(mat3(modelMatrix) * normal);
        #endif
        vW = w.xyz;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uSkyCol, uIceGlow, uIceDeep, uShaft, uDay, uUnder, uTint; uniform vec4 uFade, uHallA, uLampP, uOwnFog; uniform vec3 uHallPhos, uLampC; uniform float uIceGain, uTime, uScale, uDark, uGrey;
      varying vec3 vW, vN, vIce;
      #include <fog_pars_fragment>
      ${de}
      #ifdef SEA_LIGHT
        uniform float uSeaAmb; uniform vec3 uRimC, uInnerC; uniform vec2 uCliffX;
        ${Oe}
      #endif
      void main(){
        vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
        vec3 v = normalize(cameraPosition - vW);
        vec3 p = vW * uScale;
        float big = rsF(p * 0.034 + 3.1);
        float mid = rsF(p * 0.12 + 9.0);
        float fine = rsN(p * 0.8);
        // layers of old ice, tilted and warped; a few bright seams where it has split
        float st = p.y * 0.2 + p.x * 0.03 + p.z * 0.02 + mid * 2.6 + big * 4.0;
        float band = smoothstep(0.0, 1.0, abs(fract(st) - 0.5) * 2.0);
        vec3 pc = p * 0.15 + vec3(mid * 0.8);
        float crack = 1.0 - abs(rsN(pc) * 2.0 - 1.0);
        crack = pow(clamp(crack, 0.0, 1.0), 40.0) * smoothstep(0.5, 0.68, big);
        float flute = rsN(vec3(p.x * 0.5, p.y * 0.035, p.z * 0.5));
        float thin = clamp(big * 1.35 + mid * 0.45 - 0.62 + vIce.x, 0.0, 1.0);
        vec3 turq = mix(uIceDeep, uIceGlow, 0.4) * vec3(0.52, 1.0, 1.08);
        vec3 col = mix(uIceDeep * 0.4, turq, smoothstep(0.05, 0.55, thin));
        col = mix(col, uIceGlow * vec3(0.88, 1.0, 1.0), smoothstep(0.5, 0.95, thin));
        col = mix(col, vec3(0.9, 1.0, 1.0), smoothstep(0.88, 1.0, thin) * 0.25);
        col *= 0.8 + 0.2 * band;
        col *= (0.86 + 0.18 * flute) * (0.86 + 0.26 * fine);
        col += uIceGlow * crack * 0.22;
        // the light is in the ice overhead: what faces up is lit by it, what hangs in its own shade is deep
        float up = n.y * 0.5 + 0.5;
        col *= 0.76 + 0.3 * smoothstep(0.15, 0.85, up);
        col += uIceGlow * 0.08 * max(n.y, 0.0) * (0.6 + 0.4 * fine);
        float rift = 1.0 - abs(rsN(p * 0.42 + vec3(mid * 2.4, 0.0, big * 3.0)) * 2.0 - 1.0);
        col *= 1.0 - 0.3 * pow(clamp(rift, 0.0, 1.0), 30.0) * smoothstep(0.55, 0.9, n.y);
        float fres = 1.0 - max(dot(n, v), 0.0);
        col += mix(uIceDeep, uIceGlow, 0.6) * fres * fres * 0.3;
        col *= uIceGain * clamp(vIce.y, 0.0, 1.5);
        col = mix(col, vec3(dot(col, vec3(0.25, 0.5, 0.25))), uGrey) * uTint;
        vec3 mouthDir = vec3(0.989, 0.148, 0.0);
        if (uHallA.w > 0.5) {
          // IN THE CAVERNS THE FLOOR IS ICE WITH FORM (on what lies near level): cracks that wander, deep and dark; pressure ridges,
          // white; pools of clear dark meltwater that gleam. FROST lies white on every ledge and shelf, thick where the ice is rough.
          // What turns from the light overhead (the clefts, the undersides) is blue-green.
          float lev = smoothstep(0.72, 0.93, n.y);
          float fl = max(smoothstep(0.03, 0.0, abs(rsN(vec3(vW.xz * 0.11, 2.0)) - 0.5)), 0.6 * smoothstep(0.035, 0.0, abs(rsN(vec3(vW.xz * 0.31 + 4.0, 6.0)) - 0.5)));
          float ridge = pow(clamp(1.0 - abs(rsN(vec3(vW.xz * 0.07 + 11.0, 3.0)) * 2.0 - 1.0), 0.0, 1.0), 14.0);
          float poolK = smoothstep(0.6, 0.68, rsF(vec3(vW.xz * 0.045 + 21.0, 1.0))) * lev;
          col = mix(col, col * 0.45 + uIceDeep * 0.12, lev * fl);
          col = mix(col, uIceDeep * 0.35, poolK * 0.75);
          col += poolK * uIceGlow * 0.5 * pow(clamp(1.0 - max(dot(n, v), 0.0), 0.0, 1.0), 3.0);
          col = mix(col, vec3(0.92, 0.97, 1.0) * (0.75 + 0.25 * fine), lev * ridge * 0.8 * (1.0 - poolK));
          float frost = smoothstep(0.45, 0.85, n.y) * smoothstep(0.35, 0.7, mid + 0.25 * fine) * (1.0 - poolK);
          col = mix(col, vec3(0.86, 0.93, 1.0) * (0.7 + 0.3 * fine), frost * 0.5);
          col = mix(col, col * vec3(0.55, 1.05, 0.95), smoothstep(0.1, -0.5, n.y) * 0.5);
          float k2 = smoothstep(uHallA.x + uHallA.z, uHallA.x - uHallA.z, vW.x), k3 = smoothstep(uHallA.y + uHallA.z, uHallA.y - uHallA.z, vW.x);
          vec3 gr = vec3(dot(col, vec3(0.25, 0.5, 0.25)));
          vec3 c1 = mix(col, gr, 0.25) * vec3(1.0, 1.08, 1.16), c2 = col * vec3(0.5, 0.72, 1.12), c3 = mix(col, gr, 0.3) * vec3(0.36, 0.66, 0.6);
          col = mix(mix(c1, c2, k2), c3, k3);
          // the first hall has depth by layers: the ice near at hand is dark and clear, the ice far off pale and milky
          float farK = smoothstep(25.0, 150.0, length(cameraPosition - vW)) * (1.0 - k2);
          col = mix(col * (1.0 - 0.18 * (1.0 - k2)), vec3(0.62, 0.76, 0.9) * (0.35 + 0.9 * dot(col, vec3(0.25, 0.5, 0.25))), farK * 0.55);
          col += uHallPhos * k3 * (0.05 + 0.3 * max(dot(n, -mouthDir), 0.0)) * (0.4 + 0.6 * fine);
        }
        col *= 1.0 - uDark * smoothstep(-0.2, 0.8, n.y) * 0.55;
        // where the sun reaches the ice (the cliff outside, the floor under a crack in the roof) it is warm on the cold blue
        float ndl = max(dot(n, uSunDir), 0.0);
        float lz = clamp(abs(vIce.z), 0.0, 1.0); vec3 lightC = vIce.z < 0.0 ? uDay : uShaft;
        #ifdef SEA_LIGHT
          lz = 0.0;                                                  // (in the sea aIce.z is the light inside the ice, below)
        #endif
        // a shaft's light falls from straight above
        // (a light of over 1 is the shaft's sun come THROUGH a body of ice: it lies on every face, the more the thinner the ice)
        float facing = vIce.z < 0.0 ? max(ndl, max(n.y, 0.0) * 0.8) : mix(max(n.y, 0.0), 0.75 + 0.25 * thin, clamp(vIce.z - 1.0, 0.0, 1.0));
        if (uHallA.w > 0.5 && vIce.z < 0.0) { lightC = mix(uDay, vec3(0.62, 0.8, 1.0), 0.7); facing = 0.15 + 0.85 * max(dot(n, mouthDir), 0.0); }
        vec3 sunlit = lightC * (0.3 + 0.4 * thin) * (0.2 + 0.8 * facing) + mix(uSkyCol, uIceGlow, 0.55) * 0.2 * (n.y * 0.5 + 0.5);
        col = mix(col, col * 0.72 + sunlit, lz);
        vec3 h = normalize(v + normalize(vec3(0.3, 0.9, 0.2)));
        float sp = pow(max(dot(n, h), 0.0), 60.0);
        col += (uIceGlow * 0.5 + lightC * lz) * sp * 0.45;
        #ifdef SEA_LIGHT
          // ice of the sunless sea: its own colour times the sea's light, a bright rim where it turns from the eye, a light inside it
          vec3 sl = rsSeaLight(vW, n, uTime), own = col;
          float rimK = pow(clamp(1.0 - max(dot(n, v), 0.0), 0.0, 1.0), 2.5);
          col = col * (uSeaAmb + sl) + uRimC * rimK * (0.08 + 0.25 * uSeaAmb + 0.6 * dot(sl, vec3(0.3, 0.5, 0.2))) + uInnerC * max(vIce.z, 0.0) * (0.35 + 0.65 * thin) * (0.7 + 0.3 * fine);
          // opts.cliffX: THE CLIFF'S FACE THAT IS TURNED TO THE CAVERNS (the back of the sea's cliff, about the arch) is the last hall's
          // own ice, green and dark with its veins, lit by the hall: the sea's light does not reach it
          if (uCliffX.y > 0.5 && n.x > 0.3 && abs(vW.x - uCliffX.x) < 0.75) col = mix(own, vec3(dot(own, vec3(0.25, 0.5, 0.25))), 0.3) * vec3(0.4, 0.72, 0.66) * (0.8 + 0.5 * fine) + uRimC * rimK * 0.08;
        #endif
        // opts.fade, opts.under: the ice goes dark above a height and takes a colour of the water on its lower end
        float lost = smoothstep(uFade.x, uFade.y, vW.y);
        col *= 1.0 - 0.94 * lost;
        col += uUnder * (1.0 - smoothstep(uFade.z, uFade.w, vW.y)) * (0.5 + 0.5 * fine);
        // a lamp of the place (opts.lamp: where it stands and its reach in metres): its light lies on the faces turned to it and falls off
        // with the square of the distance
        if (uLampP.w > 0.0) { vec3 L = uLampP.xyz - vW; float d2 = dot(L, L); col += uLampC * (0.2 + 0.8 * max(dot(n, L / sqrt(max(d2, 1.0))), 0.0)) * (0.6 + 0.4 * fine) / (1.0 + d2 / (uLampP.w * uLampP.w)); }
        gl_FragColor = vec4(col, 1.0);
        // opts.ownFog (colour, density): the body is lost in a dark of its own with distance, whatever haze the air has where one stands
        if (uOwnFog.w > 0.0) { float fd = length(cameraPosition - vW); gl_FragColor.rgb = mix(gl_FragColor.rgb, uOwnFog.rgb, 1.0 - exp(-min(uOwnFog.w * uOwnFog.w * fd * fd, 40.0))); }
        #include <fog_fragment>
      }`})}const Ne=`
float rsLapis(float th, float v, float pat){
  float a;
  if (pat < 0.5) { float w = 0.46 * (1.0 - v) + 0.04; a = step(abs(fract(th * 12.0) - 0.5), w * 0.5) * step(0.06, v) + step(0.9, v); }
  else if (pat < 1.5) a = step(fract(th * 6.0 + v * 1.6), 0.44);
  else if (pat < 2.5) a = step(fract(v * 5.0 + 0.7 * abs(fract(th * 12.0) - 0.5)), 0.42);
  else { float d1 = fract(th * 12.0 + v * 6.0), d2 = fract(th * 12.0 - v * 6.0); a = abs(step(0.5, d1) - step(0.5, d2)); }
  return clamp(a, 0.0, 1.0);
}
// tile lattice: xy = position in the tile (-0.5..0.5, 0..1), z = lapis or gold, w = random per tile
vec4 rsTile(vec2 uv, float pat){
  float rows = 30.0, row = floor(uv.y * rows);
  float rr = cos(clamp((row + 0.5) / rows, 0.0, 1.0) * 1.5708);
  float n = max(24.0, floor(rr * 7.0 + 0.5) * 24.0);
  float x = uv.x * n + 0.5 * mod(row, 2.0), idx = floor(x);
  float thc = (idx + 0.5 - 0.5 * mod(row, 2.0)) / n, vc = (row + 0.5) / rows;
  return vec4(fract(x) - 0.5, fract(uv.y * rows), rsLapis(thc, vc, pat), rsH1(idx * 7.13 + row * 31.7));
}
`;function Ze(c,e={}){return new n.ShaderMaterial({fog:!0,side:n.DoubleSide,uniforms:{...n.UniformsLib.fog,...c,uPattern:{value:e.pattern??0},uGold:{value:X("#f5c344")},uLapis:{value:X("#2146a8")}},vertexShader:`
      attribute float aMat; attribute vec3 color;
      varying vec3 vW, vN, vCol; varying vec2 vUv; varying float vMat;
      #include <fog_pars_vertex>
      void main(){
        vMat = aMat; vCol = color; vUv = uv;
        vec4 w = modelMatrix * vec4(position, 1.0);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizonCol, uGroundCol, uLamp, uGold, uLapis; uniform vec4 uDome; uniform float uPattern;
      varying vec3 vW, vN, vCol; varying vec2 vUv; varying float vMat;
      #include <fog_pars_fragment>
      ${de}
      ${Ne}
      vec3 skyAt(vec3 r){
        vec3 c = mix(uHorizonCol, uSkyCol, smoothstep(0.0, 0.7, r.y));
        return mix(c, uGroundCol * 1.4, smoothstep(0.02, -0.35, r.y));
      }
      void main(){
        vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
        vec3 v = normalize(cameraPosition - vW);
        vec3 alb = vCol; float metal = 0.0, gloss = 0.25, seam = 1.0;
        if (vMat < 0.5) {
          vec4 t = rsTile(vUv, uPattern);
          vec3 tu = normalize(cross(vec3(0.0, 1.0, 0.0), n) + vec3(1e-4, 0.0, 0.0)), tv = cross(n, tu);
          n = normalize(n + tu * t.x * 0.55 + tv * (t.y - 0.55) * 0.5 + (t.w - 0.5) * 0.12 * tu);
          seam = 1.0 - 0.55 * max(smoothstep(0.38, 0.5, abs(t.x)), smoothstep(0.84, 1.0, t.y));
          alb = mix(uGold, uLapis, t.z) * (0.82 + 0.36 * t.w);
          metal = 1.0 - t.z; gloss = mix(0.75, 0.9, t.z);
        } else if (vMat < 1.5) { alb = uGold * vCol; metal = 1.0; gloss = 0.7; }
        else if (vMat < 2.5) { float f = rsN(vW * 2.3); alb = uLapis * vCol * (0.75 + 0.5 * f); alb = mix(alb, uGold, step(0.93, rsN(vW * 5.0))); gloss = 0.85; }
        else if (vMat < 3.5) {
          float f = rsF(vW * 0.7), cy = vW.y / 1.35, row = floor(cy), hx = (vW.x + vW.z) / 2.9 + 0.5 * mod(row, 2.0);
          float lod = clamp(1.0 - distance(vW, cameraPosition) / 420.0, 0.0, 1.0), wall = 1.0 - abs(n.y);
          float joint = max(1.0 - smoothstep(0.02, 0.07, min(fract(cy), 1.0 - fract(cy))), 1.0 - smoothstep(0.012, 0.04, min(fract(hx), 1.0 - fract(hx))));
          alb = vCol * (0.84 + 0.32 * f) * (0.86 + 0.28 * rsH1(row * 13.1 + floor(hx) * 7.7) * wall) * (1.0 - 0.45 * joint * lod * wall); gloss = 0.3;
        }
        else {
          vec2 q = vec2(vUv.x * 96.0, vUv.y * 22.0), id = floor(q), f = fract(q) - 0.5;
          float star = step(0.72, rsH1(id.x * 3.7 + id.y * 57.0)) * smoothstep(0.34, 0.1, length(f) + 0.2 * abs(f.x * f.y) * 8.0);
          alb = mix(uLapis * 0.9, uGold * 1.5, star); gloss = 0.5;
        }
        float below = step(vW.y, uDome.y + 0.5);
        float ty = (uDome.y - vW.y) / max(uSunDir.y, 0.05);
        vec2 hx = vW.xz + uSunDir.xz * ty - uDome.xz;
        float inSh = below * smoothstep(uDome.w + 1.5, uDome.w - 2.5, length(hx));
        if (vMat > 3.5) inSh = 1.0;
        float ndl = max(dot(n, uSunDir), 0.0) * (1.0 - inSh);
        vec3 amb = mix(uGroundCol * 1.2, uSkyCol, n.y * 0.5 + 0.5) * (1.0 - 0.35 * inSh);
        if (vMat > 3.5) amb = uGroundCol * 2.2 + uSkyCol * 0.5 + uSunCol * 0.12;
        vec3 col = alb * (uSunCol * ndl + amb) * (1.0 - 0.6 * metal);
        vec3 r = reflect(-v, n);
        float fres = pow(clamp(1.0 - dot(n, v), 0.0, 1.0), 5.0);
        vec3 f0 = mix(vec3(0.05), alb, metal);
        col += skyAt(r) * mix(f0, vec3(1.0), fres) * mix(gloss * 0.5, 1.0, metal) * (1.0 - 0.3 * inSh);
        vec3 h = normalize(v + uSunDir);
        float sp = pow(max(dot(n, h), 0.0), mix(30.0, 260.0, gloss));
        col += uSunCol * mix(vec3(0.6), alb * 1.4, metal) * sp * (0.4 + 2.6 * gloss) * (1.0 - inSh);
        float under = below * smoothstep(uDome.w * 1.25, uDome.w * 0.2, length(vW.xz - uDome.xz));
        col += alb * uLamp * (under * 1.6 + (vMat < 0.5 ? smoothstep(0.5, 0.0, vUv.y) * 0.5 : 0.0));
        col *= seam;
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function Re(){const c=[],e=[],i=[],d=[],w=[],p=[],S={P:c,I:p,col:[1,1,1],mat:0,v(I,C,g,v,y,m,b=0,x=0){return c.push(I,C,g),e.push(v,y,m),i.push(S.col[0],S.col[1],S.col[2]),d.push(b,x),w.push(S.mat),c.length/3-1},quad(I,C,g,v){p.push(I,C,g,I,g,v)},set(I,C){return S.mat=I,C&&(S.col=C),S},lathe(I,C,g,v,y={}){const m=y.out??1,b=y.a0??0,x=y.a1??ee,T=g.length,u=c.length/3;for(let l=0;l<=v;l++){const h=b+(x-b)*l/v,f=Math.cos(h),a=Math.sin(h);for(let o=0;o<T;o++){const k=g[Math.max(0,o-1)],M=g[Math.min(T-1,o+1)];let A=M[0]-k[0],F=M[1]-k[1];const B=Math.hypot(A,F)||1;A/=B,F/=B;let s=g[o][0],t=g[o][1];if(y.shape){const P=y.shape(h,o/(T-1));s*=P[0],t+=P[1]}const r=F*m,z=-A*m;S.v(I+f*s,t,C+a*s,f*r,z,a*r,y.uv?l/v:0,y.uv?o/(T-1):0)}}for(let l=0;l<v;l++)for(let h=0;h<T-1;h++){const f=u+l*T+h,a=f+T,o=a+1,k=f+1;y.skip&&y.skip(b+(x-b)*(l+.5)/v,h)||(m>0?p.push(f,k,o,f,o,a):p.push(f,a,o,f,o,k))}return S},box(I,C,g,v,y,m,b=0){const x=Math.cos(b),T=Math.sin(b),u=v/2,l=m/2,h=(o,k,M)=>[I+o*x+M*T,C+k,g-o*T+M*x],f=(o,k)=>[o*x+k*T,-o*T+k*x],a=(o,k)=>{const M=k[1]?[0,k[1],0]:(()=>{const F=f(k[0],k[2]);return[F[0],0,F[1]]})(),A=o.map(F=>{const B=h(F[0],F[1],F[2]);return S.v(B[0],B[1],B[2],M[0],M[1],M[2])});S.quad(A[0],A[1],A[2],A[3])};return a([[-u,0,l],[u,0,l],[u,y,l],[-u,y,l]],[0,0,1]),a([[u,0,-l],[-u,0,-l],[-u,y,-l],[u,y,-l]],[0,0,-1]),a([[u,0,l],[u,0,-l],[u,y,-l],[u,y,l]],[1,0,0]),a([[-u,0,-l],[-u,0,l],[-u,y,l],[-u,y,-l]],[-1,0,0]),a([[-u,y,l],[u,y,l],[u,y,-l],[-u,y,-l]],[0,1,0]),a([[-u,0,-l],[u,0,-l],[u,0,l],[-u,0,l]],[0,-1,0]),S},build(I){const C=new n.BufferGeometry;return C.setAttribute("position",new n.Float32BufferAttribute(c,3)),C.setAttribute("normal",new n.Float32BufferAttribute(e,3)),C.setAttribute("color",new n.Float32BufferAttribute(i,3)),C.setAttribute("uv",new n.Float32BufferAttribute(d,2)),C.setAttribute(I||"aMat",new n.Float32BufferAttribute(w,1)),C.setIndex(p),C}};return S}const ne=(c,e=1)=>{const i=X(c);return[i.r*e,i.g*e,i.b*e]};async function Ee(c,e=async()=>{}){const i=Re(),d=ne("#e6dcc6"),w=ne("#cfc3a8"),p=ne("#ffffff"),S=[1,1,1],I=ne("#8c8068",.6),{R:C,RC:g,HC:v,rise:y,RB:m}=c,b=v+1.6,x=[[0,3],[5,2],[6.2,3],[g-9,3],[g-7.8,2],[g-6.6,3],[g+3.2,3],[g+4.2,2],[g+5.2,3],[m,3]];for(let s=0;s<x.length-1;s++){const t=x[s][1];i.set(t,t===2?p:s%2?w:d).lathe(0,0,[[x[s+1][0],0],[x[s][0],0]],72,{out:1})}i.set(3,d).lathe(0,0,[[m-1.2,-3.2],[m+.5,-2.2],[m+.5,-.5],[m,0]],72,{out:1}),i.set(2,p).lathe(0,0,[[m+.52,-1.9],[m+.52,-.9]],72,{out:1}),i.set(3,w).lathe(0,0,[[0,-3.2],[m-1.2,-3.2]],72,{out:1});for(let s=0;s<24;s++){const t=(s+.5)/24*ee;i.set(3,I).box(Math.cos(t)*(m-9),-6.2,Math.sin(t)*(m-9),17,3.1,1.6,-t)}await e();const T=s=>Math.sin(s)*(m+6)<c.cliffZ-3;for(let s=0;s<3;s++){const t=m+s*3.4,r=t+3.4,z=-1.05*(s+1);i.set(3,s%2?d:w).lathe(0,0,[[r,z-1.2],[r,z],[t-.3,z]],72,{out:1,skip:P=>!T(P)})}i.set(3,d).lathe(0,0,[[m-.2,0],[m-.2,1.15],[m-.75,1.15],[m-.75,0]],72,{out:1}),i.set(1,S).lathe(0,0,[[m-.1,1.15],[m-.1,1.4],[m-.85,1.4],[m-.85,1.15]],72,{out:1});const u=[];for(let s=0;s<24;s++){const t=s/24*ee,r=Math.cos(t)*(m-.5),z=Math.sin(t)*(m-.5),P=8.5+2.5*(s%2);i.set(1,S).lathe(r,z,[[.22,0],[.16,P],[.5,P+.2],[.02,P+1.1]],6),u.push([r,P-.3,z,t])}await e();const l=[];for(let s=0;s<24;s++){s===12&&await e();const t=(s+.5)/24*ee,r=Math.cos(t)*g,z=Math.sin(t)*g;i.set(3,w).lathe(r,z,[[1.25,0],[1.25,.5],[.85,.9],[.72,1.3]],10),i.set(3,d).lathe(r,z,[[.72,1.3],[.7,v*.45],[.6,v-2.2]],10),i.set(2,p).lathe(r,z,[[.76,v*.3],[.8,v*.3+.5],[.76,v*.3+1]],10),i.set(1,S).lathe(r,z,[[.6,v-2.2],[.66,v-1.5],[1.3,v-.25],[1.35,v]],10),l.push([r,z,t])}await e(),i.set(1,S).lathe(0,0,[[g-1.5,v],[g+1.7,v],[g+1.7,v+.35]],96),i.set(2,p).lathe(0,0,[[g+1.5,v+.35],[g+1.5,v+1.25]],96),i.set(1,S).lathe(0,0,[[g+1.8,v+1.25],[g+2,v+1.7]],96),i.set(2,p).lathe(0,0,[[g-1.5,v+1.7],[g-1.5,v]],96);const h=[],f=22;for(let s=0;s<=f;s++){const t=s/f,r=t*Math.PI/2,z=C*Math.pow(Math.cos(r),.86),P=b+y*Math.pow(Math.sin(r),1.12)+.9*Math.exp(-t*16);h.push([Math.max(z,.05),P])}const a=(s,t)=>{const r=Math.pow(1-t,6);return[1+.035*r*Math.cos(s*24),.55*r*Math.cos(s*24)]};await e(),i.set(0,S).lathe(0,0,h,144,{out:1,uv:!0,shape:a}),await e();const o=h.map((s,t)=>[Math.max(s[0]-.7,.03),s[1]-.55-.5*(t/f)]);i.set(4,S).lathe(0,0,o,96,{out:-1,uv:!0,shape:a}),i.set(1,S).lathe(0,0,[[o[0][0],o[0][1]],[h[0][0]+.35,(o[0][1]+h[0][1])/2-.2],[h[0][0],h[0][1]]],144,{out:1,shape:s=>a(s,0)}),await e();const k=b+y,M=[[3.4,k-.6],[3,k+.3],[1.3,k+.9]];let A=k+.9;for(const s of[2.3,1.55,1,.6]){for(let t=0;t<=6;t++){const r=-Math.PI/2+t/6*Math.PI;M.push([Math.max(.28,Math.cos(r)*s),A+s+Math.sin(r)*s])}A+=s*2+.5,M.push([.28,A])}M.push([.2,A+2],[.02,A+6.5]),i.set(1,S).lathe(0,0,M,14);const F=[];for(let s=0;s<4;s++){const t=(s+.5)/4*ee,r=Math.cos(t)*(g-14),z=Math.sin(t)*(g-14);i.set(3,d).lathe(r,z,[[3.6,0],[3.9,.9],[3.3,.9],[3.2,.45]],20),i.set(2,p).lathe(r,z,[[3.2,.5],[0,.5]],20),i.set(1,S).lathe(r,z,[[.5,.5],[.3,1.9],[.6,2.1],[.1,2.5]],8),F.push([r,2.4,z])}await e();const B=i.build();return await e(),{geometry:B,poles:u,cols:l,basins:F,top:A+6.5,eaveY:b}}function Qe(c,e,i,d){const p=[],S=[];for(let b=0;b<=12;b++){const x=b/12;p.push(x,.5*(1-.75*x),0,x,-.5*(1-.75*x),0)}for(let b=0;b<12;b++){const x=b*2;S.push(x,x+1,x+3,x,x+3,x+2)}const I=new n.InstancedBufferGeometry;I.setAttribute("position",new n.Float32BufferAttribute(p,3)),I.setIndex(S);const C=e.length,g=new Float32Array(C*4),v=new Float32Array(C*3);e.forEach((b,x)=>{g.set([b[0],b[1],b[2],x*1.7],x*4),v.set(i[x%i.length],x*3)}),I.setAttribute("aPole",new n.InstancedBufferAttribute(g,4)),I.setAttribute("aTint",new n.InstancedBufferAttribute(v,3)),I.instanceCount=C;const y=new n.ShaderMaterial({fog:!0,side:n.DoubleSide,uniforms:{...n.UniformsLib.fog,...c,uWind:{value:new n.Vector2(d[0],d[1]).normalize()},uLen:{value:9.5}},vertexShader:`
      attribute vec4 aPole; attribute vec3 aTint; uniform float uTime, uLen; uniform vec2 uWind;
      varying vec3 vTint, vN; varying float vT;
      #include <fog_pars_vertex>
      void main(){
        float t = position.x, ph = aPole.w;
        vec3 wdir = normalize((modelMatrix * vec4(1.0, 0.0, 0.0, 0.0)).xyz * 0.0 + vec3(uWind.x, 0.0, uWind.y));
        vec3 side = vec3(-wdir.z, 0.0, wdir.x);
        float w1 = sin(t * 7.0 - uTime * 5.2 + ph) * 0.9 * t, w2 = sin(t * 3.1 - uTime * 2.3 + ph * 1.7) * 1.3 * t;
        vec3 base = (modelMatrix * vec4(aPole.xyz, 1.0)).xyz;
        vec3 p = base + wdir * (t * uLen) + side * (w1 + w2) + vec3(0.0, position.y * 1.5 - t * t * 2.2 + 0.5 * sin(t * 5.0 - uTime * 3.7 + ph) * t, 0.0);
        float dw = cos(t * 7.0 - uTime * 5.2 + ph) * 6.3 * t + cos(t * 3.1 - uTime * 2.3 + ph * 1.7) * 4.0 * t;
        vN = normalize(side - wdir * dw / uLen);
        vTint = aTint; vT = t;
        vec4 mvPosition = viewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol, uLamp; varying vec3 vTint, vN; varying float vT;
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN); float d = dot(n, uSunDir);
        vec3 col = vTint * (uSunCol * (abs(d) * 0.55 + 0.25) + uSkyCol * 0.6 + uGroundCol * 0.3 + uLamp * 0.6);
        col *= 0.8 + 0.2 * step(0.5, fract(vT * 6.0));
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),m=new n.Mesh(I,y);return m.frustumCulled=!1,m.name="pennants",m}const Z={half:17.5,top:25,y0:-2},Ce=(c,e=0)=>{const i=(c-Z.y0)/(Z.top+e-Z.y0);return i>=1?0:(Z.half+e)*Math.sqrt(Math.max(0,1-i*i))},Le=(c,e,i)=>{const d=Ce(e,i),w=48,p=Math.abs(c);return p>=w||d<=0?c:Math.sign(c)*(d+p*(1-d/w))},U={y:[28,33,38],d:[7,6,6],x:[46,58,96,118]};function je(c,e={}){const i=e.height??42,d=e.seed??0,w=v=>i+q(46,130,Math.abs(v))*(9+9*c.n2(v*.011+d,3.7))+2.5*c.n2(v*.05+d,9.1)*q(30,60,Math.abs(v)),p=(v,y)=>{const m=Math.abs(v),b=.0019*Math.max(0,m-40)**2,x=-.1*Math.max(0,y)-2.2*q(26,38,y),T=3.2*c.fbm2(v*.028+d,y*.06+4,3)+1.4*c.n2(v*.11,y*.16+d)*q(20,50,m),u=5*Math.pow(Math.abs(Math.sin(v*.045+1.3+d)),6)*q(24,60,m);return b+x+T+u},S=v=>{const y=Math.abs(v);return q(U.x[0],U.x[1],y)*(1-q(U.x[2],U.x[3],y))},I=v=>(v>U.y[0]?1:0)+(v>U.y[1]?1:0)+(v>U.y[2]?1:0);return{topAt:w,faceZ:(v,y,m=I(y))=>{const b=S(v);if(m===0||b<=0)return p(v,y);let x=0;for(let T=0;T<m;T++)x+=U.d[T];return oe(p(v,y),p(v,U.y[m-1]+2.5),q(0,.15,b))-b*x},backY:(v,y)=>w(v)+y*.1+9*q(10,120,y)*(.5+c.fbm2(v*.012+d,y*.012+8,3))-.004*Math.max(0,y-150)**2,H0:i,terK:S,base:p}}const N={tower:49,towerR:6.5,house:25,fore:2.4,vous:4.2,head:39.2,step:38};function ke(c){let e=-1e9;for(let p=-N.tower-4;p<=N.tower+4;p+=1.5)for(let S=-7;S<=44;S+=3)e=Math.max(e,c.base(p,S)+.1*S);e+=.6;const i=(p,S)=>e+(Math.abs(p)<=N.house?N.fore:0)-.1*S,d=p=>Math.abs(p)<N.step?N.head:c.topAt(p)+1.2,w=(p,S)=>(Math.hypot(p/Z.half,(S-Z.y0)/(Z.top-Z.y0))-1)*Z.half;return{z0:e,zg:e+N.fore,wallZ:i,headY:d,offArch:w}}async function Ue(c,e,i,d=async()=>{}){const w=ke(i),p=ne("#e6dcc6"),S=ne("#cfc3a8"),I=ne("#c4e4f4"),C=ne("#5d7f4a"),g=ne("#2a2620",.5),v=(u,l,h)=>[oe(u[0],l[0],h),oe(u[1],l[1],h),oe(u[2],l[2],h)],y=(u,l,h=p)=>{const f=w.offArch(u,l),a=e.n2(u*.12+5,l*.12+9),o=ye(.7*q(9,0,f)+.5*q(0,.5,a)*q(16,2,f)+.35*q(7,0,l)*(.5+a),0,.88);return v(v(h,C,.45*q(9,1,l)*q(22,30,Math.abs(u))*q(-.2,.3,a)),I,o)},m=(u,l,h=p,f=null,a=3)=>{const[o,k,M]=u,A=k[0]-o[0],F=k[1]-o[1],B=k[2]-o[2],s=M[0]-o[0],t=M[1]-o[1],r=M[2]-o[2];let z=F*r-B*t,P=B*s-A*r,L=A*t-F*s;const R=Math.hypot(z,P,L)||1;z/=R,P/=R,L/=R;const W=z*l[0]+P*l[1]+L*l[2]<0,V=W?[u[0],u[3]||u[2],u[2],u[1]]:u,O=W?-1:1,E=(u.length===3?W?[u[0],u[2],u[1]]:u:V).map(Y=>(c.set(a,f||y(Y[0],Y[1],h)),c.v(Y[0],Y[1],Y[2],z*O,P*O,L*O)));E.length===4?c.quad(E[0],E[1],E[2],E[3]):c.I.push(E[0],E[1],E[2])},b=[0,.1,1];{const u=N.vous-.6,l=[],h=[-7];for(let o=0;o<=14;o++)h.push(Z.y0+(Z.top+u-Z.y0)*Math.sin(o/14*Math.PI/2));h.push(33,N.head);for(let o=N.house;o>.5;o-=1.25)l.push(-o);l.push(-.001,.001);for(let o=1.25;o<=N.house;o+=1.25)l.push(o);const f=[];for(const o of l)for(const k of h){const M=Le(o,k,u);c.set(3,y(M,k)),f.push(c.v(M,k,w.wallZ(M,k),0,.0995,.995))}const a=h.length;for(let o=0;o<l.length-1;o++)for(let k=0;k<a-1;k++){if(l[o]<0&&l[o+1]>0&&Ce(h[k],u)>0)continue;const M=f[o*a+k],A=f[(o+1)*a+k];c.quad(M,A,A+1,M+1)}}await d();for(const u of[-1,1]){const l=[];for(let f=N.house;f<N.tower-3;f+=1.5)l.push(f),f<N.step&&f+1.5>=N.step&&l.push(N.step-.001,N.step+.001);l.push(N.tower-3);let h=null;for(const f of l){const a=u*f,o=u*(f+.001),k=w.headY(a),M=[];for(const A of[-7,4.5,14,24,33,k])c.set(3,y(a,A)),M.push(c.v(a,A,w.wallZ(o,A),0,.0995,.995));if(h)for(let A=0;A<5;A++)u>0?c.quad(h[A],M[A],M[A+1],h[A+1]):c.quad(M[A],h[A],h[A+1],M[A+1]);h=M}}for(const u of[-1,1]){const l=u*N.house,h=u*(N.house+.001);m([[l,-7,w.wallZ(l,-7)],[l,-7,w.wallZ(h,-7)],[l,N.head,w.wallZ(h,N.head)],[l,N.head,w.wallZ(l,N.head)]],[u,0,0])}for(const u of[-1,1]){const l=[];for(let o=0;o<N.step;o+=3)l.push([o,Math.min(o+3,N.step)]);for(let o=N.step;o<N.tower-3;o+=3)l.push([o,Math.min(o+3,N.tower-3)]);for(const[o,k]of l){const M=u*o,A=u*k,F=u*(o+.01),B=u*(k-.01),s=w.headY(F),t=w.headY(B);m([[M,s,w.wallZ(F,s)],[A,t,w.wallZ(B,t)],[A,t,i.base(A,t)-2],[M,s,i.base(M,s)-2]],[0,1,0],S)}const h=u*N.step,f=u*(N.step+.01),a=w.headY(f);m([[h,N.head,w.wallZ(f,N.head)],[h,a,w.wallZ(f,a)],[h,a,i.base(h,a)-2],[h,N.head,i.base(h,N.head)-2]],[-u,0,0])}await d();{const l=(a,o)=>[(Z.half+o)*Math.cos(a),Z.y0+(Z.top+o-Z.y0)*Math.sin(a)];for(let a=0;a<27;a++){const o=a===13,k=(a+.07)/27*Math.PI,M=(a+.93)/27*Math.PI,A=-.15,F=N.vous+(o?1.4:0),B=o?1:.5,s=o?1:a%2?2:3,t=o?[1,1,1]:a%2?[1.15,1.15,1.15]:null,r=[l(k,A),l(M,A),l(M,F),l(k,F)],z=(k+M)/2,P=[Math.cos(z),Math.sin(z),0],L=[-Math.sin(z),Math.cos(z),0],R=r.map(V=>[V[0],V[1],w.wallZ(V[0],V[1])+B]),W=r.map(V=>[V[0],V[1],w.wallZ(V[0],V[1])-1.4]);m(R,b,p,t,s),m([R[3],R[2],W[2],W[3]],P,p,t,s),m([R[0],R[1],W[1],W[0]],[-P[0],-P[1],0],p,t,s),m([R[0],R[3],W[3],W[0]],[-L[0],-L[1],0],p,t,s),m([R[1],R[2],W[2],W[1]],L,p,t,s)}const h=44;let f=null;for(let a=0;a<=h;a++){const o=oe(-.06,1.06,a/h)*Math.PI,[k,M]=l(o,-.1),A=w.wallZ(k,M)-1.2,F=Math.min(A-2,i.faceZ(k,Math.max(M,0))-3.5),B=[];for(const[s,t]of[[0,.35],[.5,.65],[1,.9]])c.set(3,v(a%2?p:S,I,t)),B.push(c.v(k,M,oe(A,F,s),-Math.cos(o),-Math.sin(o),0));if(f)for(let s=0;s<2;s++)c.quad(f[s],B[s],B[s+1],f[s+1]);f=B}}await d();const x=(u,l,h)=>{let f=-7;const a=M=>w.wallZ(u,M),o=u-l/2,k=u+l/2;for(let M=0;M<h.length;M++){const[A,F]=h[M],B=M+1<h.length?h[M+1][1]:0,s=A+(F-B)*.9,t=-2.6;m([[o,f,a(f)+F],[k,f,a(f)+F],[k,A,a(A)+F],[o,A,a(A)+F]],b);for(const[r,z]of[[o,-1],[k,1]])m([[r,f,a(f)+t],[r,f,a(f)+F],[r,A,a(A)+F],[r,A,a(A)+t]],[z,0,0]),m([[r,A,a(A)+t],[r,A,a(A)+F],[r,s,a(s)+B],[r,s,a(s)+t]],[z,0,0]);m([[o,A,a(A)+F],[k,A,a(A)+F],[k,s,a(s)+B],[o,s,a(s)+B]],[0,.7,.7],S),f=s}};for(const u of[-1,1])x(u*(N.house-.2),5.5,[[9,3.6],[21,2.5],[32.4,1.5],[N.head-.4,.7]]),x(u*N.step,4,[[8,3],[20,2],[32.4,1.2],[i.topAt(u*N.step)+2.6,.6]]);const T=(u,l,h,f,a,o=S)=>{const k=(u+l)/2,M=A=>w.wallZ(k,A);m([[u,h,M(h)],[l,h,M(h)],[l,h+.25,M(h+.25)+a],[u,h+.25,M(h+.25)+a]],[0,-.7,.7],o),m([[u,h+.25,M(h+.25)+a],[l,h+.25,M(h+.25)+a],[l,h+f-.2,M(h+f-.2)+a],[u,h+f-.2,M(h+f-.2)+a]],b,o),m([[u,h+f-.2,M(h+f-.2)+a],[l,h+f-.2,M(h+f-.2)+a],[l,h+f,M(h+f)],[u,h+f,M(h+f)]],[0,.7,.7],o)};for(const[u,l]of[[-N.house+2.6,N.house-2.6],[N.house+2.6,N.step-2],[-N.step+2,-N.house-2.6],[N.step+2,N.tower-4],[-N.tower+4,-N.step-2]]){T(u,l,32.4,.9,.5);const h=w.headY((u+l)/2),f=Math.max(2,Math.round((l-u)/2.2));T(u,l,h-.75,.75,.95,p);for(let a=0;a<f;a++){const o=oe(u,l,(a+.5)/f),k=w.wallZ((u+l)/2,h-1.3);c.set(3,y(o,h-1.9,S)).box(o,h-1.9,k+.4,.9,1.15,.8)}if(Math.abs(u)>=N.house){const a=(u+l)/2,o=u,k=M=>w.wallZ(a,M);m([[o,-7,k(-7)+1.8],[l,-7,k(-7)+1.8],[l,4.2,k(4.2)+.3],[o,4.2,k(4.2)+.3]],[0,.15,1]),m([[o,4.2,k(4.2)+.3],[l,4.2,k(4.2)+.3],[l,4.5,k(4.5)],[o,4.5,k(4.5)]],[0,.7,.7],S)}}await d();for(const u of[-1,1]){const l=u*N.tower,h=w.z0+1,f=N.towerR;c.set(3,S).lathe(l,h,[[f+1.9,-7],[f+.5,4.5],[f,5.5]],28),c.set(3,p).lathe(l,h,[[f,5.5],[f,32.4]],28),c.set(3,S).lathe(l,h,[[f,32.4],[f+.5,32.7],[f+.5,33.1],[f,33.3]],28),c.set(3,p).lathe(l,h,[[f,33.3],[f,46.6]],28),c.set(3,S).lathe(l,h,[[f,46.6],[f+.5,47.3],[f+1.3,48.8],[f+1.3,50.4],[f+.8,50.4],[f+.8,49.4],[f-1.3,49.4]],28),c.set(3,p).lathe(l,h,[[f-1.3,49.4],[f-1.3,55.6],[f-.6,56.1],[f-.6,56.7]],28),c.set(0,[1,1,1]).lathe(l,h,[[f-.3,56.5],[f-1.3,58.6],[f-3.2,61.6],[f-5,64.6],[.5,67.3]],28,{uv:!0}),c.set(1,[1,1,1]).lathe(l,h,[[.5,67.3],[.95,68.1],[.35,68.9],[.05,71.4]],8);for(let a=0;a<14;a++){const o=(a+.5)/14*ee;c.set(3,S).box(l+Math.sin(o)*(f+1.05),50.4,h+Math.cos(o)*(f+1.05),1.5,.9,.5,o)}for(const[a,o,k,M]of[[0,14,.55,3],[.7*u,24,.55,3],[-.6*u,38,.55,3],[0,42,.55,2.4]])c.set(3,g).box(l+Math.sin(a)*(f-.12),o,h+Math.cos(a)*(f-.12),k,M,.3,a);for(let a=0;a<4;a++){const o=(a+.5)/4*ee;c.set(3,g).box(l+Math.sin(o)*(f-1.42),51.2,h+Math.cos(o)*(f-1.42),1.3,2.8,.3,o)}}}const Ke=[[1,64,1],[2,84,-1],[3,62,-1]],he={rise:.5,going:.9,broad:2.2,landing:2.7};async function Ye(c,e,i=async()=>{}){const d=Re(),w=ne("#e6dcc6"),p=ne("#cfc3a8"),S=ne("#4d8d46"),I=(b,x,T)=>[oe(b[0],x[0],T),oe(b[1],x[1],T),oe(b[2],x[2],T)],C=(b,x)=>(x===0?Math.max(e.faceZ(b,23,0),e.faceZ(b,25.5,0),e.faceZ(b,28,0)):x<3?e.faceZ(b,U.y[x]-1,x):e.faceZ(b,U.y[2]+2,3)-.3)+.5,g=(b,x)=>C(b+.5,x)-C(b-.5,x),v=[];for(const b of[-1,1])for(const[x,T,u]of Ke){const l=U.y[x-1],h=x<3?5:e.topAt(b*(T+u*4.5))-l,f=Math.max(2,Math.round(h/he.rise));for(let a=0;a<=f;a++){const o=a===f,k=T+u*(o?f*he.going+he.landing/2:(a+.5)*he.going),M=b*k,A=o?h:(a+1)*h/f;d.set(3,a%2?w:p).box(M,l-.3,C(M,x)+he.broad/2,o?he.landing:he.going,A+.3,he.broad,-Math.atan(g(M,x)))}v.push([x,b,T+u*(f*he.going+he.landing/2)])}const y=(b,x,T)=>v.some(u=>u[0]===b&&u[1]===x&&Math.abs(T-u[2])<he.landing/2+.4);for(const b of[-1,1])for(let x=0;x<3;x++){await i();let T=null;for(let u=U.x[0];u<=U.x[3];u+=1){const l=b*u;if(e.terK(l)*U.d[x]<1.2){T=null;continue}const h=C(l,x),f=g(l,x),a=Math.hypot(f,1),o=-f/a,k=1/a,M=U.y[x]+(y(x,b,u)?0:1),A=x===0?22.4:U.y[x-1]-.3,F=q(.15,.5,c.n2(u*.09+x*7.3,b*3.1)),B=q(0,.5,c.n2(u*.2+x*3.7,b*5.9+4)),s=[];if(d.set(3,w),s.push(d.v(l,A,h,o,0,k)),d.set(3,I(w,S,.7*F*B)),s.push(d.v(l,U.y[x]-2.2,h,o,0,k)),d.set(3,I(w,S,.7*F)),s.push(d.v(l,M,h,o,0,k)),d.set(3,I(p,S,.7*F)),s.push(d.v(l,M,h+.12,0,1,0),d.v(l,M,h-.7,0,1,0)),d.set(3,p),s.push(d.v(l,M,h-.7,-o,0,-k),d.v(l,U.y[x]-.2,h-.7,-o,0,-k)),T){const t=(r,z,P,L)=>{b>0?d.quad(r,z,P,L):d.quad(z,r,L,P)};t(T[0],s[0],s[1],T[1]),t(T[1],s[1],s[2],T[2]),t(T[3],s[3],s[4],T[4]),t(s[6],T[6],T[5],s[5])}T=s}}await i(),await Ue(d,c,e,i),await i();const m=[];for(const b of[-1,1])for(const x of[68,88])m.push(et(d,b*x,U.y[0]-.3,C(b*x,0)-4.4,.8));return{geometry:d.build(),lineZ:C,heads:v,burners:m}}async function $e(c,e,i,d=async()=>{}){const w=[];{let F=0;const B=[];for(;F<i;)B.push(F),F+=F<50?2.5:F<120?4.5:8;B.push(i);for(let s=B.length-1;s>0;s--)w.push(-B[s]);for(const s of B)w.push(s)}const p=[2.5,6,11,18,28,42,62,90,125,165,210],S=F=>{const B=[];for(let s=0;s<=9;s++)B.push([oe(-7,23,Math.pow(s/9,.9)),0,0]);B.push([25.5,0,0]);for(let s=0;s<3;s++){const t=U.y[s],r=s<2?U.y[s+1]:F;B.push([t,s,0],[t,s,1],[t,s+1,0],[t,s+1,1],[(t+r)/2,s+1,0])}return B.push([F,3,0]),B},I=S(50).map(F=>F[2]),C=I.length-1,g=[],v=[],y=[],m=C+1+p.length,b=X("#525150"),x=X("#3f4041"),T=X("#5c5b59"),u=X("#454546"),l=X("#5c5b59"),h=X("#56844a"),f=X("#3d7f43"),a=X("#5c9a48"),o=new n.Color,k=new n.Color;let M=0;for(const F of w){++M%14===0&&await d();const B=e.topAt(F),s=S(B),t=e.terK(F);for(let r=0;r<=C;r++){const z=s[r][0],P=Le(F,z,1.7),L=.5+.5*c.n2(F*.05,z*.21);g.push(P,z,e.faceZ(P,z,s[r][1])),o.copy(b).lerp(x,L),k.copy(T).lerp(u,L),o.lerp(k,q(24,30,z)).multiplyScalar(.9+.2*c.n2(F*.3,z*.3)),o.lerp(h,.65*q(0,.4,c.n2(F*.09+11,z*.13+5))*q(30,10,z)*q(U.x[1],U.x[0],Math.abs(F))),t>.03&&r>10&&r<C&&(s[r][2]===1&&s[r][1]<s[r+1][1]||s[r][2]===0&&s[r-1][2]===1&&s[r-1][0]===z)&&o.copy(f).lerp(a,.5+.5*c.n2(F*.06+7,z)).multiplyScalar(.9),r===C&&o.lerp(f,.85*q(-.1,.4,c.n2(F*.07,3.3))),v.push(o.r,o.g,o.b)}for(let r=0;r<p.length;r++){const z=p[r],P=e.backY(F,z);g.push(F,P,e.faceZ(F,B)-z),o.copy(f).lerp(a,.5+.5*c.n2(F*.02+7,z*.02)).multiplyScalar(.85+.2*c.n2(F*.11,z*.11)),r===0&&o.lerp(l,.5),v.push(o.r,o.g,o.b)}}for(let F=0;F<w.length-1;F++)for(let B=0;B<m-1;B++){const s=F*m+B,t=s+m,r=(w[F]+w[F+1])/2;B<C&&Math.abs(r)<2&&Ce(g[s*3+1],1.7)>0||B<C&&I[B+1]===1||y.push(s,t,t+1,s,t+1,s+1)}await d();const A=new n.BufferGeometry;return A.setAttribute("position",new n.Float32BufferAttribute(g,3)),A.setAttribute("color",new n.Float32BufferAttribute(v,3)),A.setIndex(y),await d(),A.computeVertexNormals(),await d(),{rock:A}}function Xe(c,e){const i=ke(e),d=66,w=[[-.12,-2.5,.02],[-.45,-3.4,.12],[-.9,-5,.3],[-1.3,-2,.5],[-1.2,-8,.68],[-.4,-15,.84],[1.2,-22,1]],p=w.length,S=[],I=[],C=[];for(let v=0;v<=d;v++){const y=oe(-.1,1.1,v/d)*Math.PI,m=Math.cos(y),b=Math.sin(y),x=2*Math.pow(.5+.5*Math.sin(y*23+3*c.n2(y*2.3,7.7)),2);for(let T=0;T<p;T++){const u=w[T][0]+(T>2?.45:.12*T)*c.n2(y*3.1+5,T*.9),l=(Z.half+u)*m,h=Z.y0+(Z.top+u-Z.y0)*b,f=w[T][2],a=e.faceZ(l,Math.max(h,0)),o=i.wallZ(l,h);let k=T<3?Math.max(o+w[T][1]+(T===0?x:T===1?.4*x:0),a-1.2+.4*(2-T)):Math.min(a+w[T][1],o-5.6);S.push(l,h,k+(T>2?.3*c.n2(y*5.3,T*1.7+9):0)),I.push(.3+.4*Math.min(f,.3)-.47*q(.3,1,f)+.15*c.n2(y*4.1+2,T*1.3),.8+.3*Math.min(f,.3),q(.1,.3,f)-1)}}for(let v=0;v<d;v++)for(let y=0;y<p-1;y++){const m=v*p+y,b=m+p;C.push(m,m+1,b+1,m,b+1,b)}const g=new n.BufferGeometry;return g.setAttribute("position",new n.Float32BufferAttribute(S,3)),g.setAttribute("aIce",new n.Float32BufferAttribute(I,3)),g.setIndex(C),g.computeVertexNormals(),g}function We(c=0,e=7){const i=[],d=[],w=[];for(let I=0;I<=6;I++){const C=I/6,g=.09*Math.pow(1-C,1.25)*(1+.35*Math.sin(C*17))+.004*(1-C);for(let v=0;v<=e;v++){const y=v/e*ee;i.push(Math.cos(y)*g*(1+.25*Math.sin(y*3+C*5)),-C,Math.sin(y)*g),d.push(.05+.45*C,1,c)}}for(let I=0;I<6;I++)for(let C=0;C<e;C++){const g=I*(e+1)+C,v=g+e+1;w.push(g,g+1,v+1,g,v+1,v)}const S=new n.BufferGeometry;return S.setAttribute("position",new n.Float32BufferAttribute(i,3)),S.setAttribute("aIce",new n.Float32BufferAttribute(d,3)),S.setIndex(w),S.computeVertexNormals(),S}const _e={7:[.088,.13,.6],5:[.088,.15,1.2]};function lt(c=0,e=7){const i=We(c,e),d=i.getAttribute("position"),w=i.getAttribute("normal"),p=6,[S,I,C]=_e[e]||_e[7],g=[],v=[],y=[],m=[],b=[],x=[],T=1.5;let u=0,l=0,h=0;for(let A=0;A<=e;A++){let F=0,B=0,s=0,t=0;for(let z=0;z<p;z++)for(let P=0;P<8;P++){const L=(P+.5)/8,R=z*(e+1)+A,W=R+e+1,V=oe(Math.hypot(d.getX(R),d.getZ(R)),Math.hypot(d.getX(W),d.getZ(W)),L),O=(z+L)/p;F+=V,B+=V*oe(w.getX(R),w.getX(W),L),s+=V*oe(w.getY(R),w.getY(W),L),t+=V*oe(w.getZ(R),w.getZ(W),L),u+=V,l+=V*O,h+=V*O*O}b.push([B/F,s/F,t/F]);const r=A/e*ee;x.push([Math.cos(r)*S*(1+I*Math.sin(r*3+C)),Math.sin(r)*S])}const f=l/u,a=Math.sqrt(18*Math.max(0,h/u-f*f)),o=.05+.45*(f-a/3),k=.05+.45*(f+2*a/3);for(let A=0;A<e;A++){const F=b[A],B=b[A+1],s=(F[0]+B[0])/2,t=(F[1]+B[1])/2,r=(F[2]+B[2])/2,z=(P,L,R,W,V)=>{const O=Math.hypot(L,R,W)||1;g.push(...P),v.push(L/O,R/O,W/O),y.push(V,1,c)};z([x[A][0],0,x[A][1]],s+T*(F[0]-s),t+T*(F[1]-t),r+T*(F[2]-r),o),z([x[A+1][0],0,x[A+1][1]],s+T*(B[0]-s),t+T*(B[1]-t),r+T*(B[2]-r),o),z([0,-1,0],s,t,r,k),m.push(A*3,A*3+1,A*3+2)}i.dispose();const M=new n.BufferGeometry;return M.setAttribute("position",new n.Float32BufferAttribute(g,3)),M.setAttribute("normal",new n.Float32BufferAttribute(v,3)),M.setAttribute("aIce",new n.Float32BufferAttribute(y,3)),M.setIndex(m),M}function ct(c=9,e=8,i=.9,d=.9){const w=[],p=[],S=[];for(let C=0;C<=e;C++){const g=C/e,v=1+i*Math.pow(Math.max(1-2*g,0),3)+d*Math.pow(Math.max(2*g-1,0),3)+.1*Math.sin(g*23);for(let y=0;y<=c;y++){const m=y/c*ee;w.push(Math.cos(m)*v*(1+.14*Math.sin(m*3+g*6)),g,Math.sin(m)*v),p.push(.12+.25*Math.sin(g*9+m),.85+.15*g,0)}}for(let C=0;C<e;C++)for(let g=0;g<c;g++){const v=C*(c+1)+g,y=v+c+1;S.push(v,y,y+1,v,y+1,v+1)}const I=new n.BufferGeometry;return I.setAttribute("position",new n.Float32BufferAttribute(w,3)),I.setAttribute("aIce",new n.Float32BufferAttribute(p,3)),I.setIndex(S),I.computeVertexNormals(),I}async function Je(c,e,i,d={}){const w=d.yield||(async()=>{}),p=d.segments??56,S=d.floorSegments??40,I=[],C=[],g=[],v=i.length,y=new Float32Array(v*(p+1)*3),m=d.spots||[],b=d.hold||(()=>{}),x=[0,0,0],T=(t,r,z)=>{let P=t.sun??0;for(const L of m){const R=((r-L[0])**2+(z-L[1])**2)/(L[2]*L[2]);if(R<6){const W=.85*Math.exp(-R);W>Math.abs(P)&&(P=W)}}return P},u=(t,r,z)=>{const P=t.rw??7,L=Math.abs(z-(t.river??0)),R=Math.max(0,Math.abs(z)-t.a*.5),W=t.ledge?t.ledge.edge+(t.ledge.wander??0)*c.n2(r*.37,4.1):0;return(t.ledge?t.floor+(t.ledge.y-t.floor)*q(W+1.2,W-2.2,z):t.floor)+3.5*q(P-3.5,P+2.5,L)+1.5*c.n2(z*.09+r*.13,r*.21)*q(P,P+10,L)+.9*c.n2(z*.3,r*.9)*q(P,P+6,L)-1.6*q(P,2,L)+.011*R*R};for(let t=0;t<v;t++){t%8===7&&await w();const r=i[t],z=-r.t[1],P=r.t[0];for(let L=0;L<=p;L++){const R=L%p/p*ee,W=Math.cos(R),V=Math.sin(R),O=r.p.x+z*W*r.a,E=r.p.y+V*r.b,Y=r.p.z+P*W*r.a,ue=1+.3*c.fbm3(O*.018,E*.024,Y*.018,3)+.1*c.n3(O*.07,E*.07,Y*.07)+.05*Math.sin(R*9+t*.7);let me=W*r.a*ue,_=r.p.y+V*r.b*ue*(V>0?1+.25*c.n2(t*.11,L*.3):1);const H=u(r,t,me)-1.4;_<H&&(_=H);const G=(t*(p+1)+L)*3;x[0]=r.p.x+z*me,x[1]=_,x[2]=r.p.z+P*me,b(x);const D=x[0],j=x[2];_=x[1],y[G]=D,y[G+1]=_,y[G+2]=j,I.push(D,_,j);const K=ye((_-H)/Math.max(r.b,1),0,1.6);C.push((r.glow??0)+.5*c.fbm3(D*.012+40,_*.02,j*.012,2)+.14*K-.27,(.66+.34*q(0,.3,K))*(r.ao??1),T(r,D,j))}}const l=d.split??0,h=[];for(let t=0;t<v-1;t++)for(let r=0;r<p;r++){const z=t*(p+1)+r,P=z+p+1;(t<l?h:g).push(z,P,P+1,z,P+1,z+1)}const f=I.length/3,a=i.map(t=>t.river??0);for(let t=1;t<v;t++){const r=.8*Math.hypot(i[t].p.x-i[t-1].p.x,i[t].p.z-i[t-1].p.z);a[t]=ye(a[t],a[t-1]-r,a[t-1]+r)}for(let t=v-2;t>=0;t--){const r=.8*Math.hypot(i[t].p.x-i[t+1].p.x,i[t].p.z-i[t+1].p.z);a[t]=ye(a[t],a[t+1]-r,a[t+1]+r)}const o=Math.round(S*.325),k=(t,r,z)=>{const P=t.rw??7,L=r<o?-1:1,R=L<0?o-r:r-o,W=L<0?o:S-o,V=Math.max(t.a*1.3-L*z,P+4),O=Math.max(P-3.5,.5),E=P+2.5;return z+L*(R<=4?O*R/4:R<=8?O+(E-O)*(R-4)/4:E+(V-E)*(R-8)/(W-8))};for(let t=0;t<v;t++){t%8===7&&await w();const r=i[t],z=-r.t[1],P=r.t[0];for(let L=0;L<=S;L++){const R=k(r,L,a[t]),W=Math.abs(R-(r.river??0));x[0]=r.p.x+z*R,x[1]=u(r,t,R),x[2]=r.p.z+P*R,b(x);const V=x[0],O=x[1],E=x[2];I.push(V,O,E);const Y=r.ledge?1-.45*q(r.ledge.edge-1,r.ledge.edge+5,R):1;C.push((r.glow??0)*.5+.02+.24*c.n2(V*.03+9,E*.03),(.6+.2*c.n2(V*.1,E*.1)+.2*q(0,14,W))*(r.ao??1)*Y,T(r,V,E))}}for(let t=0;t<v-1;t++)for(let r=0;r<S;r++){const z=f+t*(S+1)+r,P=z+S+1;(t<l?h:g).push(z,P,P+1,z,P+1,z+1)}const M=new n.BufferGeometry;await w(),M.setAttribute("position",new n.Float32BufferAttribute(I,3)),M.setAttribute("aIce",new n.Float32BufferAttribute(C,3)),M.setIndex(h.concat(g)),M.computeVertexNormals(),await w(),M.setIndex(g);const A=Ge(e,{side:n.DoubleSide,dark:0,halls:d.halls,ownFog:d.haze}),F=new n.Mesh(M,A);F.name="ice-cave";let B=null;if(h.length){const t=new n.BufferGeometry;for(const r of["position","normal","aIce"])t.setAttribute(r,M.getAttribute(r));t.setIndex(h),B=new n.Mesh(t,A),B.name="ice-cave-front"}return{mesh:F,front:B,geometry:M,at:(t,r,z=new n.Vector3)=>{const P=(ye(t,0,v-1)*(p+1)+(r%p+p)%p)*3;return z.set(y[P],y[P+1],y[P+2])},segments:p,rings:i,floorY:(t,r)=>u(i[ye(t,0,v-1)],t,r)}}async function He(c,e,i,d=null,w=40){const p=[],S=[],I=[],C=[];for(let v=0;v<=c;v++){d&&v%w===w-1&&await d();for(let y=0;y<=e;y++){const m=i(v/c,y/e);p.push(m.p[0],m.p[1],m.p[2]),S.push(m.ice[0],m.ice[1],m.ice[2]),C.push(m.hole?1:0)}}d&&await d();for(let v=0;v<c;v++)for(let y=0;y<e;y++){const m=v*(e+1)+y,b=m+e+1;C[m]+C[b]+C[m+1]+C[b+1]>=3||I.push(m,b,b+1,m,b+1,m+1)}const g=new n.BufferGeometry;return g.setAttribute("position",new n.Float32BufferAttribute(p,3)),g.setAttribute("aIce",new n.Float32BufferAttribute(S,3)),g.setIndex(I),g.computeVertexNormals(),g}const Fe=`
uniform float uTime, uH, uG, uPeriod, uLoud, uSeed, uCycle;
float rsPant(float t0){ float b = floor(t0 / uPeriod), f = fract(t0 / uPeriod), s = sin(3.14159265 * f); return uLoud * (0.5 + (0.22 + 0.33 * rsH1(b * 1.31 + uSeed)) * s * s); }
// a body thrown from the vent. o = (x, z at the vent, share of the height, lean), ph = its place in the cycle (0..1), dir = which way it leans
vec3 rsThrow(vec4 o, float ph, float dir, out vec3 vel, out float age, out float flight){
  float cyc = uCycle * uPeriod, t0 = (floor(uTime / cyc - ph) + ph) * cyc;
  age = uTime - t0;
  float v0 = sqrt(max(2.0 * uG * uH, 0.0)) * rsPant(t0) * o.z, hs = v0 * o.w;
  vec3 v = vec3(cos(dir) * hs, v0, sin(dir) * hs);
  flight = 2.0 * v0 / max(uG, 0.1);
  vel = v + vec3(0.0, -uG * age, 0.0);
  return vec3(o.x, 0.0, o.y) + v * age + vec3(0.0, -0.5 * uG * age * age, 0.0);
}
`,De=[-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0];function ut(c,e){const i=e.rng,d=i.fork("foam"),w=i.fork("rock"),p=i.fork("mist"),S=e.height??66,I=14,C=new n.Group;C.name="rock-fountain";const g=(e.loud??1)*1.05,v=e.period??1.9,y=Math.max(5,Math.ceil((2*Math.sqrt(2*S/I)*g*1.12+.3)/v)),m={uH:{value:S},uG:{value:I},uPeriod:{value:v},uLoud:{value:e.loud??1},uSeed:{value:i.range(0,50)},uCycle:{value:y}},b=Math.round((e.foam??520)*y/5),x=new n.InstancedBufferGeometry,T=e.girth??2.6,u=e.body??1;x.setAttribute("position",new n.Float32BufferAttribute(De,3)),x.setIndex([0,1,2,0,2,3]);const l=new Float32Array(b*4),h=new Float32Array(b*4);for(let G=0;G<b;G++){const D=d.range(0,ee),j=T*Math.sqrt(d()),K=d.chance(.6),$=K?d.range(.8,1):d.range(.45,.92),Q=K?d.range(.004,.03):d.range(.02,.075);l.set([Math.cos(D)*j,Math.sin(D)*j,$,Math.min(Q,(e.fall??30)/(4*S*g*g*$*$))],G*4),h.set([d(),d.range(0,ee),u*(K?d.range(.45,.9):d.range(.25,.7)),d()],G*4)}x.setAttribute("aO",new n.InstancedBufferAttribute(l,4)),x.setAttribute("aA",new n.InstancedBufferAttribute(h,4)),x.instanceCount=b;const f=new n.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...n.UniformsLib.fog,...c,...m,uFWind:{value:new n.Vector2(e.wind?e.wind[0]:1.6,e.wind?e.wind[1]:-.7)}},vertexShader:`
      ${de}
      ${Fe}
      attribute vec4 aO; attribute vec4 aA; uniform vec3 uSunDir; uniform vec2 uFWind;
      varying vec2 vQ; varying float vSeed, vFall, vA; varying vec3 vSunV, vColN;
      #include <fog_pars_vertex>
      void main(){
        vec3 vel; float age, flight; vec3 c = rsThrow(aO, aA.x, aA.y, vel, age, flight);
        float life = clamp(age / max(flight, 0.1), 0.0, 1.2), alive = step(age, flight * 1.02);
        // past the crown the water breaks: it spreads, thins, and goes down the wind
        float fall = smoothstep(0.42, 0.7, life), fine = clamp(1.0 - aA.z / ${u.toFixed(2)}, 0.0, 1.0), drift = fall * fall * age * (0.5 + 1.6 * fine);
        c.xz += uFWind * drift; vel.xz += uFWind * fall * (0.5 + 1.6 * fine);
        c.y = max(c.y, 0.2);
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
        vec3 vv = (modelViewMatrix * vec4(vel, 0.0)).xyz; vec2 ax = normalize(vv.xy + vec2(1e-4, 1e-3));
        float len = aA.z * 1.4 + length(vel) / 6.0, wid = aA.z * (1.0 + 0.9 * fall) * alive;
        mvPosition.xy += ax * position.y * len * alive + vec2(ax.y, -ax.x) * position.x * wid;
        vQ = position.xy * 2.0; vSeed = aA.w; vFall = fall;
        vA = alive * smoothstep(0.0, 0.03, life) * (1.0 - 0.55 * fall) * (1.0 - smoothstep(0.93, 1.02, life));
        vSunV = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
        // which way the column's own side faces here (outward from its axis, a little up)
        vColN = normalize((modelViewMatrix * vec4(normalize(vec3(c.x, 0.6, c.z) + vec3(1e-3, 0.0, 0.0)), 0.0)).xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunCol, uSkyCol, uHorizonCol; uniform float uTime; varying vec2 vQ; varying float vSeed, vFall, vA; varying vec3 vSunV, vColN;
      #include <fog_pars_fragment>
      ${de}
      void main(){
        // a streak: dense along its middle, torn at its sides and its ends
        float brk = rsN(vec3(vQ * vec2(2.2, 4.0 + 4.0 * vFall) + vSeed * 17.0, vSeed * 9.0 + uTime * 0.9));
        float a = (1.0 - vQ.x * vQ.x) * smoothstep(1.0, 0.45, abs(vQ.y)) * (0.62 + 0.9 * brk) * vA;
        if (a < 0.03) discard;
        // lit as a part of the column: one sunny side, one side in the sky's shade
        vec3 n = normalize(mix(vec3(vQ.x * 0.8, 0.0, 0.7), normalize(vColN), 0.6));
        float lit = smoothstep(-0.35, 0.65, dot(n, vSunV));
        vec3 sunny = min(uSunCol * 0.34 + uSkyCol * 0.32, vec3(0.98));
        vec3 shade = max(vec3(0.5, 0.6, 0.78) * (uSkyCol * 0.85 + uHorizonCol * 0.25), sunny * 0.42);
        vec3 col = mix(shade, sunny, lit) * (0.9 + 0.2 * brk);
        // with the sun behind the column its light comes through the water: the streaks' thin edges and the falling veils glow
        float back = clamp(-vSunV.z, 0.0, 1.0), thin = clamp(abs(vQ.x) * 0.7 + 0.5 * vFall + 0.25, 0.0, 1.0);
        col = mix(col, min(uSunCol * 0.5 + uSkyCol * 0.22, vec3(0.99)), 0.75 * back * thin);
        gl_FragColor = vec4(min(col, vec3(0.99)), min(a, 0.9));
        #include <fog_fragment>
      }`}),a=new n.Mesh(x,f);a.frustumCulled=!1,a.renderOrder=3,a.name="foam",C.add(a);const o=e.rocks??12,k=Be.rockGeometry({rng:w,kind:"rock",radius:1,detail:1,color:"#3a3430",colorB:"#191614"}),M=new n.InstancedBufferGeometry;M.setAttribute("position",k.getAttribute("position")),M.setAttribute("normal",k.getAttribute("normal")),M.setAttribute("color",k.getAttribute("color")),k.index&&M.setIndex(k.index);const A=new Float32Array(o*4),F=new Float32Array(o*4),B=e.reach??18;let s=0;for(let G=0;G<o;G++){const D=w.range(-2,2),j=w.range(-2,2),K=w.range(.8,1.12),$=w.range(.045,.09),Q=w.chance(.66)?w.range(1.2,2):w.range(2,2.6);A.set([D,j,K,Math.min($,Math.max(0,B-3)/(4*S*g*g*K*K))],G*4),F.set([(G%y+.5)/y,w.range(0,ee),Q,w.range(0,ee)],G*4),s=Math.max(s,Q)}M.setAttribute("aO",new n.InstancedBufferAttribute(A,4)),M.setAttribute("aA",new n.InstancedBufferAttribute(F,4)),M.instanceCount=o;const t=new n.ShaderMaterial({fog:!0,uniforms:{...n.UniformsLib.fog,...c,...m},vertexShader:`
      ${de}
      ${Fe}
      attribute vec4 aO; attribute vec4 aA; attribute vec3 color; varying vec3 vN, vC, vV;
      #include <fog_pars_vertex>
      vec3 rsRot(vec3 p, vec3 ax, float a){ float c = cos(a), s = sin(a); return p * c + cross(ax, p) * s + ax * dot(ax, p) * (1.0 - c); }
      void main(){
        vec3 vel; float age, flight; vec3 c = rsThrow(aO, aA.x, aA.y, vel, age, flight);
        float alive = step(age, flight + 0.3);
        vec3 ax = normalize(vec3(cos(aA.w), 0.4, sin(aA.w))); float ang = aA.w * 7.0 + uTime * (0.5 + fract(aA.w * 3.7) * 1.1);
        vec3 p = c + rsRot(position * aA.z * alive, ax, ang);
        vN = normalize(mat3(modelMatrix) * rsRot(normal, ax, ang)); vC = color;
        vec4 w = modelMatrix * vec4(p, 1.0); vV = cameraPosition - w.xyz;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uSkyCol, uGroundCol; varying vec3 vN, vC, vV;
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN), v = normalize(vV), h = normalize(v + uSunDir);
        // a wet rock: a lit face, a dark face, a glint and a rim of sky light
        vec3 col = vC * (uSunCol * 0.6 * max(dot(n, uSunDir), 0.0) + mix(uGroundCol, uSkyCol, n.y * 0.5 + 0.5) * 0.8);
        col += uSunCol * 0.35 * pow(max(dot(n, h), 0.0), 30.0) + uSkyCol * 0.25 * pow(clamp(1.0 - max(dot(n, v), 0.0), 0.0, 1.0), 3.0);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),r=new n.Mesh(M,t);r.frustumCulled=!1,r.name="rocks",C.add(r);const z=14,P=e.arc??1.5,L=[],R=[];for(let G=0;G<=z;G++)L.push(-.5,G/z,0,.5,G/z,0);for(let G=0;G<z;G++){const D=G*2;R.push(D,D+1,D+3,D,D+3,D+2)}const W=new n.InstancedBufferGeometry;W.setAttribute("position",new n.Float32BufferAttribute(L,3)),W.setIndex(R),W.setAttribute("aO",M.getAttribute("aO")),W.setAttribute("aA",M.getAttribute("aA")),W.instanceCount=o;const V=new n.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:n.DoubleSide,uniforms:{...n.UniformsLib.fog,...c,...m,uArc:{value:P}},vertexShader:`
      ${de}
      ${Fe}
      uniform float uArc; attribute vec4 aO; attribute vec4 aA; varying vec2 vQ; varying float vA, vSeed;
      #include <fog_pars_vertex>
      void main(){
        vec3 vel; float age, flight; rsThrow(aO, aA.x, aA.y, vel, age, flight);
        float alive = step(age, flight + 0.3);
        // the same throw, so many seconds earlier (never before it left the vent)
        float back = min(position.y * uArc, age), a2 = age - back;
        vec3 v0 = vel + vec3(0.0, uG * age, 0.0), c = vec3(aO.x, 0.0, aO.y) + v0 * a2 + vec3(0.0, -0.5 * uG * a2 * a2, 0.0), v2 = v0 + vec3(0.0, -uG * a2, 0.0);
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
        vec3 vv = (modelViewMatrix * vec4(v2, 0.0)).xyz; vec2 ax = normalize(vv.xy + vec2(1e-4, 1e-3));
        mvPosition.xy += vec2(ax.y, -ax.x) * position.x * aA.z * (1.9 + 1.2 * position.y) * alive;
        vQ = vec2(position.x * 2.0, position.y); vA = alive * smoothstep(0.0, 0.3, age) * step(position.y * uArc, age + 0.05); vSeed = aA.w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunCol, uSkyCol, uHorizonCol; uniform float uTime; varying vec2 vQ; varying float vA, vSeed;
      #include <fog_pars_fragment>
      ${de}
      void main(){
        float brk = rsN(vec3(vQ.x * 2.2 + vSeed * 9.0, vQ.y * 9.0 + uTime * 1.5, vSeed * 5.0)), fine = rsN(vec3(vQ.x * 6.0 + vSeed, vQ.y * 30.0 + uTime * 2.5, 2.0));
        float a = (1.0 - vQ.x * vQ.x) * pow(1.0 - vQ.y, 1.25) * smoothstep(0.0, 0.03, vQ.y) * (0.35 + 0.75 * brk + 0.3 * fine) * 0.8 * vA;
        if (a < 0.02) discard;
        gl_FragColor = vec4(min(uSunCol * 0.24 + uSkyCol * 0.42 + uHorizonCol * 0.2, vec3(0.96)) * (0.85 + 0.2 * fine), min(a, 0.85));
        #include <fog_fragment>
      }`}),O=new n.Mesh(W,V);O.frustumCulled=!1,O.renderOrder=3,O.name="rock-tails",C.add(O);const E=e.mist??90,Y=new n.InstancedBufferGeometry;Y.setAttribute("position",new n.Float32BufferAttribute(De,3)),Y.setIndex([0,1,2,0,2,3]);const ue=new Float32Array(E*4),me=new Float32Array(E*4);for(let G=0;G<E;G++){const D=G%5===1?3:G%3===2?2:G%4===0?1:0,j=D===0,K=p.range(0,ee),$=D===3?p.range(8,40):j?p.range(3,12):D===2?p.range(2,9):p.range(0,8);ue.set([Math.cos(K)*$,D===3?p.range(1,6):j?p.range(1,12):D===2?p.range(S*.55,S*.95):p.range(S*.3,S*.95),Math.sin(K)*$,D===3?p.range(18,30):j?p.range(10,18):D===2?p.range(9,15):p.range(12,22)],G*4),me.set([p.range(0,1),p.range(0,ee),D,p.range(.6,1.4)],G*4)}Y.setAttribute("aO",new n.InstancedBufferAttribute(ue,4)),Y.setAttribute("aA",new n.InstancedBufferAttribute(me,4)),Y.instanceCount=E;const _=new n.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...n.UniformsLib.fog,...c,uBow:{value:e.bow??.35},uWind:{value:new n.Vector3(e.wind?e.wind[0]:1.6,.5,e.wind?e.wind[1]:-.7)},uOpacity:{value:e.mistOpacity??.13}},vertexShader:`
      attribute vec4 aO; attribute vec4 aA; uniform float uTime; uniform vec3 uWind; varying vec2 vQ; varying vec3 vW; varying float vA, vS;
      #include <fog_pars_vertex>
      void main(){
        float life = fract(uTime / (9.0 * aA.w) + aA.x), age = life * 9.0 * aA.w;
        float lie = step(2.5, aA.z), veil = step(1.5, aA.z) * (1.0 - lie), bil = step(0.5, aA.z) * (1.0 - veil) * (1.0 - lie);
        vec3 c = aO.xyz + uWind * vec3(1.0, 1.0 - lie, 1.0) * age * mix(1.0, 1.5, bil) * (1.0 - 0.6 * veil) * (1.0 - 0.65 * lie) + vec3(0.0, bil * 1.6 * age - veil * min(5.0 * age, aO.y - 4.0), 0.0);
        float sz = aO.w * (0.55 + 0.9 * life);
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
        mvPosition.xy += position.xy * sz * vec2(1.0, 1.0 + 1.6 * veil - 0.6 * lie);
        vW = cameraPosition + transpose(mat3(viewMatrix)) * mvPosition.xyz;
        vQ = position.xy * 2.0; vA = smoothstep(0.0, 0.18, life) * smoothstep(1.0, 0.5, life) * (1.0 + 0.8 * veil); vS = aA.y;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizonCol; uniform float uBow, uOpacity, uTime; varying vec2 vQ; varying vec3 vW; varying float vA, vS;
      #include <fog_pars_fragment>
      ${de}
      void main(){
        float r2 = dot(vQ, vQ);
        float nz = rsN(vec3(vQ * 1.6 + vS * 7.0, uTime * 0.12 + vS));
        float a = clamp(1.0 - r2, 0.0, 1.0); a = a * a * (0.45 + 0.75 * nz) * uOpacity * vA;
        if (a < 0.003) discard;
        vec3 col = vec3(0.94, 0.97, 1.0) * min(uSunCol * 0.2 + uSkyCol * 0.45 + uHorizonCol * 0.22, vec3(0.95)) * (0.7 + 0.3 * nz);
        vec3 dir = normalize(vW - cameraPosition);
        float ang = degrees(acos(clamp(dot(dir, -uSunDir), -1.0, 1.0)));
        float t = clamp((ang - 37.0) / 7.0, 0.0, 1.0), win = smoothstep(0.0, 0.45, t) * smoothstep(1.0, 0.55, t);
        vec3 spec = clamp(vec3(smoothstep(0.3, 0.9, t), 1.0 - abs(t - 0.5) * 2.2, smoothstep(0.7, 0.1, t)), 0.0, 1.0);
        vec3 bowCol = mix(vec3(0.75), spec, 0.7) * uSunCol / max(max(uSunCol.r, max(uSunCol.g, uSunCol.b)), 1e-3);
        col = mix(col, bowCol, win * clamp(uBow, 0.0, 0.6) * step(0.0, uSunDir.y));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),H=new n.Mesh(Y,_);return H.frustumCulled=!1,H.renderOrder=4,H.name="spray",C.add(H),{object:C,loud:m.uLoud,bow:_.uniforms.uBow,rocks:r,mist:H,rockMax:s}}const ft=4.2;function et(c,e,i,d,w=1){const p=S=>S.map(([I,C])=>[I*w,i+C*w]);return c.set(3,ne("#cfc3a8")).lathe(e,d,p([[1.5,-.6],[1.5,.35],[1.15,.6],[.62,.95],[.5,2.5],[.8,2.85]]),10),c.set(1,[1,1,1]).lathe(e,d,p([[.45,2.8],[1.25,3.2],[1.7,3.85],[1.72,4.2],[1.55,4.2],[1.4,3.9]]),14),c.set(1,[2.4,.9,.35]).lathe(e,d,p([[1.4,3.9],[.7,4.02],[.02,4.08]]),10),[e,i+4.05*w,d]}function tt(c,e,i={}){const d=e.length,w=new n.InstancedBufferGeometry,p=18,S=[],I=[];for(let m=0;m<=p;m++){const b=m/p;S.push(-.5,b,0,.5,b,0)}for(let m=0;m<p;m++){const b=m*2;I.push(b,b+1,b+3,b,b+3,b+2)}w.setAttribute("position",new n.Float32BufferAttribute(S,3)),w.setIndex(I);const C=new Float32Array(d*4),g=new Float32Array(d);e.forEach((m,b)=>{C.set([m[0],m[1],m[2],m[3]],b*4),g[b]=b*.6180339%1}),w.setAttribute("aO",new n.InstancedBufferAttribute(C,4)),w.setAttribute("aS",new n.InstancedBufferAttribute(g,1)),w.instanceCount=d;const v=new n.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...n.UniformsLib.fog,...c,uColor:{value:X(i.color??"#fff3d6")},uOpacity:{value:i.opacity??.5},uWind:{value:new n.Vector2(i.wind?i.wind[0]:.7,i.wind?i.wind[1]:.4)}},vertexShader:`
      attribute vec4 aO; attribute float aS; uniform float uTime; uniform vec2 uWind; varying vec2 vQ; varying float vS;
      #include <fog_pars_vertex>
      void main(){
        float t = position.y, h = aO.w;
        vec3 c = aO.xyz + vec3(0.0, t * h, 0.0);
        c.xz += uWind * (t * t * h * 0.45) + vec2(sin(t * 5.0 - uTime * 0.55 + aS * 40.0), cos(t * 4.1 - uTime * 0.4 + aS * 23.0)) * (0.15 + t * 1.6) * t;
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
        mvPosition.x += position.x * (0.35 + 2.7 * pow(t, 1.4));
        vQ = vec2(position.x * 2.0, t); vS = aS;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunCol, uSkyCol, uColor; uniform float uOpacity, uTime; varying vec2 vQ; varying float vS;
      #include <fog_pars_fragment>
      ${de}
      void main(){
        float n1 = rsN(vec3(vQ.x * 1.2 + vS * 9.0, vQ.y * 5.0 - uTime * 0.3, vS * 5.0));
        float n2 = rsN(vec3(vQ.x * 2.6 + n1 * 1.5, vQ.y * 11.0 - uTime * 0.55, vS * 3.0 + 4.0));
        float body = clamp(1.0 - vQ.x * vQ.x, 0.0, 1.0), strand = smoothstep(0.25 * vQ.y, 0.35 + 0.45 * vQ.y, n1 * 0.6 + n2 * 0.5);
        float a = body * body * smoothstep(0.0, 0.03, vQ.y) * pow(clamp(1.0 - vQ.y, 0.0, 1.0), 1.3) * mix(1.0, strand, smoothstep(0.05, 0.4, vQ.y)) * uOpacity;
        if (a < 0.003) discard;
        gl_FragColor = vec4(uColor * (uSunCol * 0.22 + uSkyCol * 0.5), a);
        #include <fog_fragment>
      }`}),y=new n.Mesh(w,v);return y.frustumCulled=!1,y.renderOrder=3,y.name="incense",y}const ot=120,Ve=c=>oe(58,17,q(6,ot,c));function at(c,e,i,d,w=0){const p=[],S=[],I=[],C=[],g=new n.Vector3,v=new n.Vector3,y=c.getLength();for(let b=0;b<=e;b++){const x=b/e;c.getPointAt(x,g),c.getTangentAt(x,v);const T=Math.hypot(v.x,v.z)||1,u=-v.z/T,l=v.x/T,h=d(x,g)*.5;for(let f=0;f<=i;f++){const a=f/i*2-1;p.push(g.x+u*h*a,g.y+w,g.z+l*h*a),S.push(a,x*y,h),I.push(u,0,l)}if(b<e)for(let f=0;f<i;f++){const a=b*(i+1)+f,o=a+i+1;C.push(a,a+1,o,a+1,o+1,o)}}const m=new n.BufferGeometry;return m.setAttribute("position",new n.Float32BufferAttribute(p,3)),m.setAttribute("aW",new n.Float32BufferAttribute(S,3)),m.setAttribute("aSide",new n.Float32BufferAttribute(I,3)),m.setIndex(C),m}function nt(c,e={},i={}){return new n.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:n.DoubleSide,uniforms:{...n.UniformsLib.fog,...c,uBalc:e.uBalc||{value:new n.Vector4(0,-1e5,0,1)},uFace:e.uFace||{value:new n.Vector4(0,0,1,-1e6)},uRise:e.uRise||{value:17},uPattern:e.uPattern||{value:0},uGold:{value:X("#f5c344")},uLapis:{value:X("#2146a8")},uDeep:{value:X(i.deep||"#0c4a52")},uShallow:{value:X(i.shallow||"#a6ab8d")},uRif:{value:[0,1,2,3].map(d=>new n.Vector3(i.riffles&&i.riffles[d]?i.riffles[d][0]:0,i.riffles&&i.riffles[d]?i.riffles[d][1]:0,i.riffles&&i.riffles[d]?1:0))},uShelf:{value:new n.Vector4(...i.shelf||[1.7,.9,4.5,2.1])},uStill:{value:new n.Vector2(...i.still||[-2e6,-1e6])},uBank:{value:X(i.bank||"#28583a")},uTree:{value:i.tree??13},uFlow:{value:i.flow??1},uLen:{value:i.length??1e9},uBloom:{value:X(i.bloom?i.bloom[0]:"#28583a")},uBloomL:{value:X(i.bloom?i.bloom[1]:"#ffffff")},uBloomK:{value:i.bloom?1:0},uEnd:{value:new n.Vector4(...i.end||[12,0,1e6,2e6])}},vertexShader:`
      attribute vec3 aW; attribute vec3 aSide; varying vec3 vW, vA, vSide;
      #include <fog_pars_vertex>
      void main(){
        vA = aW; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vSide = normalize(mat3(modelMatrix) * aSide);
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uSkyCol, uHorizonCol, uGold, uLapis, uIceGlow, uIceDeep, uDeep, uShallow, uBank; uniform vec4 uDome, uBalc, uFace;
      uniform float uTime, uRise, uPattern, uIceGain, uTree, uFlow, uLen, uBloomK; uniform vec3 uBloom, uBloomL; uniform vec4 uEnd, uShelf; uniform vec2 uStill; uniform vec3 uRif[4];
      varying vec3 vW, vA, vSide;
      #include <fog_pars_fragment>
      ${de}
      ${Ne}
      void main(){
        float hw = max(vA.z, 0.5), a = vA.x, bd = (1.0 - abs(a)) * hw;
        vec3 toC = cameraPosition - vW; float dist = length(toC); vec3 V = toC / max(dist, 1e-3);
        float lod = clamp(1.0 - dist / 260.0, 0.0, 1.0);
        vec2 q = vec2(a * hw, vA.y);
        // THE RIPPLES are as long across the river as along it, or nearly (none longer than 1.5 times its breadth): swells of 3.3 by 5 m,
        // ripples of 1 by 1.4 m, and near the eye wavelets of 0.4 by 0.5 m and of 0.17 by 0.2 m; all go down with the current
        vec2 f1 = q * vec2(0.3, 0.2) + vec2(0.0, -uTime * 0.53 * uFlow), f2 = q * vec2(0.95, 0.7) + vec2(uTime * 0.1, -uTime * 1.09 * uFlow);
        vec2 s1 = vec2(rsN(vec3(f1, uTime * 0.2)), rsN(vec3(f1 + 17.3, uTime * 0.2))) - 0.5;
        vec2 s2 = vec2(rsN(vec3(f2, uTime * 0.45)), rsN(vec3(f2 + 9.1, uTime * 0.45))) - 0.5;
        float near = clamp(1.0 - dist / 70.0, 0.0, 1.0);
        vec2 f3 = q * vec2(2.6, 2.0) + vec2(-uTime * 0.25, -uTime * 2.46 * uFlow);
        vec2 s3 = vec2(rsN(vec3(f3, uTime * 0.8)), rsN(vec3(f3 + 5.7, uTime * 0.8))) - 0.5;
        float nearer = clamp(1.0 - dist / 34.0, 0.0, 1.0);
        vec2 f4 = q * vec2(6.0, 5.0) + vec2(uTime * 0.4, -uTime * 6.0 * uFlow);
        vec2 s4 = nearer > 0.0 ? vec2(rsN(vec3(f4, uTime * 1.1)), rsN(vec3(f4 + 3.3, uTime * 1.1))) - 0.5 : vec2(0.0);
        // R118: the garden's water is still near the cliff (so many metres out from its face): its ripples 0.15 of the river's
        float still = 1.0 - smoothstep(uStill.x, uStill.y, dot(vW, uFace.xyz) - uFace.w);
        // R121': a riffle lies within 9 m of each crossing between two bends, gone by 15 m
        float rif = 0.0; for (int i = 0; i < 4; i++) rif = max(rif, uRif[i].z * (1.0 - smoothstep(9.0, 15.0, distance(vW.xz, uRif[i].xy))));
        vec2 slope = (s1 * 0.085 * (0.4 + 0.6 * lod) + s2 * 0.09 * lod * lod + s3 * 0.1 * near * near + s4 * 0.08 * nearer) * mix(1.0, 0.15, still) * (1.0 + rif);
        vec3 side = normalize(vSide), T = normalize(cross(side, vec3(0.0, 1.0, 0.0)));
        // R432: slow rings on the still water: one place to a 26 m cell of the pool, each on its own period of 7 to 12 s; a ring runs out
        // at 0.9 m a second and is spent by 10 m
        vec2 ringG = vec2(0.0);
        if (still > 0.01) {
          vec2 cb = floor(vW.xz / 26.0 - 0.5);
          for (int i = 0; i < 4; i++) {
            vec2 id = cb + vec2(mod(float(i), 2.0), floor(float(i) / 2.0)); float h = rsH1(id.x * 12.7 + id.y * 71.3), h2 = rsH1(id.x * 31.1 + id.y * 5.9 + 3.0);
            vec2 c = (id + 0.25 + 0.5 * vec2(h, h2)) * 26.0, dv = vW.xz - c; float per = 7.0 + 5.0 * h2, t = fract(uTime / per + h), d = length(dv), x = d - t * per * 0.9;
            ringG += dv / max(d, 0.05) * sin(x * 2.6) * exp(-x * x / 1.4) * (1.0 - t) * smoothstep(0.0, 0.08, t);
          }
          ringG *= 0.09 * still;
        }
        vec3 N = normalize(vec3(0.0, 1.0, 0.0) - side * slope.x - T * slope.y - vec3(ringG.x, 0.0, ringG.y));
        float ndv = max(dot(N, V), 0.0);
        vec3 R = reflect(-V, N); R.y = abs(R.y) + 0.015; R = normalize(R);
        float F = 0.08 + 0.92 * pow(clamp(1.0 - ndv, 0.0, 1.0), 3.5);
        vec3 refl = mix(uHorizonCol, uSkyCol, smoothstep(0.0, 0.5, R.y));
        // R432: the sky's clouds lie in the still water as soft shapes
        if (still > 0.01) refl = mix(refl, uHorizonCol * 0.75 + uSunCol * 0.14, 0.7 * still * smoothstep(0.5, 0.72, rsF(vec3(R.xz / max(R.y, 0.12) * 0.9 + 3.0, 7.0))));
        // the bank on the side the mirrored ray leaves by: its trees stand dark in the water
        float cr = dot(R.xz, side.xz), sg = cr >= 0.0 ? 1.0 : -1.0;
        float run = hw * (1.0 - a * sg) / max(abs(cr), 0.06);
        float th = uTree * (0.45 + 0.9 * rsN(vec3(vA.y * 0.045 + sg * 7.0, sg * 3.0, 1.0)));
        // R432: by the pool the banks' trees are the groves: their blossom stands in the water in clumps among the dark of the cedars
        float bloomK = uBloomK * still * smoothstep(0.4, 0.58, rsN(vec3(vA.y * 0.09 + sg * 3.0, sg * 5.0, 2.0)));
        refl = mix(refl, mix(uBank * (uSkyCol * 0.6 + uSunCol * 0.1), uBloom * (uSkyCol * 0.7 + uSunCol * 0.2), bloomK), 0.92 * smoothstep(th, th * 0.55, R.y * run));
        if (distance(vW.xz, uBalc.xz) < 520.0) {
          float hit = 0.0; vec3 rc = vec3(0.0);
          // what stands (the cliff, the balcony, the dome) is mirrored through gentler ripples, so its image holds together
          vec3 N2 = normalize(vec3(0.0, 1.0, 0.0) - (side * slope.x + T * slope.y) * 0.35 - vec3(ringG.x, 0.0, ringG.y));
          vec3 R = reflect(-V, N2); R.y = abs(R.y) + 0.015; R = normalize(R);
          // the cliff and the gate built against it
          float tf = (uFace.w - dot(vW, uFace.xyz)) / max(dot(R, uFace.xyz), 1e-4), yf = vW.y + R.y * tf;
          if (tf > 0.0 && yf < uBalc.y - 3.0) {
            // dark rock; the terraces' pale walls 46 to 118 m aside, 23 to 39 m up, cypresses before the upper two
            vec3 hp = vW + R * tf; float xl = abs(dot(hp.xz - uBalc.xz, vec2(uFace.z, -uFace.x)));
            float tk = smoothstep(46.0, 58.0, xl) * (1.0 - smoothstep(96.0, 118.0, xl)) * smoothstep(22.0, 23.5, yf) * (1.0 - smoothstep(38.5, 40.0, yf));
            // the water gate: its stone from the water up, as far as the towers 49 m aside; the arch is dark within and its ice glows there
            float mth = 1.0 - smoothstep(0.85, 1.0, length(vec2(xl / 17.5, max(yf + 2.0, 0.0) / 27.0))), icy = mth;
            float drum = 1.0 - smoothstep(53.0, 56.0, xl); tk = max(tk, drum);
            float cyp = step(28.0, yf) * smoothstep(0.35, 0.6, rsN(vec3(xl * 0.3, 2.0, 5.0))) * (1.0 - drum);
            vec3 rockC = vec3(0.045, 0.05, 0.055) * (uSunCol * 0.1 + uSkyCol * 0.5);
            vec3 wallC = mix(vec3(0.62, 0.58, 0.5), vec3(0.03, 0.09, 0.05), 0.8 * cyp) * (uSunCol * 0.12 + uSkyCol * 0.7);
            rc = mix(mix(rockC, wallC, tk), mix(uIceDeep, uIceGlow, 0.35 + 0.4 * rsN(vec3(vW.xz * 0.06, yf * 0.2))) * uIceGain * 0.9 * (1.0 - 0.7 * mth), icy);
            hit = mix(mix(0.75, 0.9, tk), 0.9, icy) * smoothstep(0.0, 3.0, uBalc.y - 3.0 - yf);
          }
          // the balcony's rim
          vec2 ob = vW.xz - uBalc.xz; float ba = dot(R.xz, R.xz), bb = dot(ob, R.xz), bc = dot(ob, ob) - uBalc.w * uBalc.w, bq = bb * bb - ba * bc;
          if (bq > 0.0) {
            float t = (-bb - sqrt(bq)) / max(ba, 1e-6), y = vW.y + R.y * t;
            float rim = step(0.0, t) * smoothstep(uBalc.y - 4.4, uBalc.y - 2.6, y) * smoothstep(uBalc.y + 2.4, uBalc.y + 0.6, y);
            rc = mix(rc, vec3(0.62, 0.58, 0.5) * (uSunCol * 0.12 + uSkyCol * 0.7), rim); hit = max(hit, rim * 0.9);
          }
          // the shell
          vec3 oc = vW - uDome.xyz, sc = vec3(1.0 / uDome.w, 1.0 / uRise, 1.0 / uDome.w);
          vec3 o2 = oc * sc, d2 = R * sc; float qa = dot(d2, d2), qb = dot(o2, d2), qc = dot(o2, o2) - 1.0, disc = qb * qb - qa * qc;
          if (disc > 0.0) {
            float t = (-qb - sqrt(disc)) / max(qa, 1e-6); vec3 h = oc + R * t;
            if (t > 0.0 && h.y > 0.0) {
              float th2 = atan(h.z, abs(h.x) < 1e-4 ? 1e-4 : h.x) / 6.2831853 + 0.5, hv = clamp(h.y / uRise, 0.0, 1.0);
              vec3 n = normalize(h * sc * sc);
              vec3 lightS = uSunCol * max(dot(n, uSunDir), 0.0) + mix(uHorizonCol, uSkyCol, n.y * 0.5 + 0.5);
              vec3 shell = mix(uGold * (0.4 * lightS + mix(uHorizonCol, uSkyCol, 0.5)), uLapis * lightS, rsLapis(th2, asin(hv) / 1.5708, uPattern));
              // (disc / qa = 1 - the square of the ray's nearest pass to the axis, in shell radii: the edge is soft over the outer 8% of the shell's breadth, at any distance)
              float soft = smoothstep(0.0, 0.15, disc / max(qa, 1e-6)) * smoothstep(0.0, 2.5, h.y);
              rc = mix(rc, shell, soft); hit = max(hit, soft);
            }
          }
          refl = mix(refl, rc, hit);
        }
        vec3 amb = uSkyCol * 0.55 + uHorizonCol * 0.25;
        // R119, R120: how deep the water is, from how far inside the ribbon's edge this point lies (uShelf: the edge's inset, the shelf's depth
        // and breadth, the drop beyond it). The bed shows through by exp(-depth / 0.8); the water's own colour grows by 1 - exp(-depth / 1.2)
        float e = uShelf.x - bd;
        float depth = uShelf.y * (1.0 - smoothstep(-uShelf.z, 0.0, e)) + uShelf.w * (1.0 - smoothstep(-uShelf.z - 3.5, -uShelf.z, e));
        depth = mix(depth, min(depth, 0.35), rif);
        float clear = exp(-depth / 0.8), cover = smoothstep(0.0, 0.12, depth);
        vec3 body = mix(uShallow, uDeep, 1.0 - exp(-depth / 1.2)) * (amb + uSunCol * 0.07);
        vec3 col = mix(body, refl, F);
        // the thread of the current wanders from side to side (no line is drawn along it: it carries the foam, below)
        float c0 = 0.45 * sin(vA.y * 0.045 + 1.7);
        // the sun on the ripples
        float sp = pow(max(dot(N, normalize(V + uSunDir)), 0.0), 220.0);
        col += uSunCol * sp * 0.5 * (0.3 + 0.7 * lod) * step(0.0, uSunDir.y);
        // R121': white on the riffles only: streaks 0.4 m by 3 m going with the current, on half the water there
        float white = rif * smoothstep(0.05, 0.2, depth) * smoothstep(0.42, 0.58, rsN(vec3(q.x * 2.5, q.y * 0.33 - uTime * 0.9 * uFlow, 4.0)));
        col = mix(col, vec3(0.9, 0.95, 0.95) * (amb + uSunCol * 0.25), 0.8 * white);
        float edge = cover * max(mix(1.0 - clear, 1.0, F), 0.8 * white);
        // FLECKS OF FOAM go down with the current at 1.4 m a second, in drifts some 5 by 8 m, thickest along the current's thread: each a
        // patch of 0.15 to 0.5 m; none on the still water; far off a drift is a pale wash
        if (still < 0.99) {
          vec2 fq = vec2(q.x, q.y - uTime * 1.4 * uFlow), fid = floor(fq / 0.7), ff = fract(fq / 0.7);
          float fh = rsH1(fid.x * 12.7 + fid.y * 71.3), fh2 = rsH1(fid.x * 3.3 + fid.y * 47.9 + 9.0);
          float drift = smoothstep(0.45, 0.7, rsN(vec3(fq * vec2(0.2, 0.125), 6.0))) * (0.2 + 0.8 * smoothstep(0.55, 0.0, abs(a - c0))) * (1.0 - still) * cover;
          vec2 fd = ff - 0.3 - 0.4 * vec2(fh2, fract(fh2 * 7.3)); float nearF = clamp(1.0 - dist / 90.0, 0.0, 1.0);
          fd.y *= 0.55 + 0.4 * fh;
          float fleck = step(fh, drift * 0.5) * smoothstep(0.08 + 0.3 * fh2 * fh2, 0.04, length(fd)) * (0.6 + 0.4 * rsN(vec3(fq * 7.0, 3.0))) * nearF + drift * 0.08 * (1.0 - nearF);
          col = mix(col, vec3(0.92, 0.96, 0.97) * (amb + uSunCol * 0.25), 0.85 * fleck); edge = max(edge, fleck);
        }
        // R432: petals lie on the still water in rafts, thickest within 12 m of the banks under the groves, and drift to the mouth at the
        // pool's own slow current (0.2 m a second); far off a raft is a pale wash
        if (still * uBloomK > 0.01) {
          vec2 pq = vW.xz + uFace.xz * uTime * 0.2, pid = floor(pq / 0.8), pf = fract(pq / 0.8);
          float ph = rsH1(pid.x * 12.7 + pid.y * 71.3), ph2 = rsH1(pid.x * 3.3 + pid.y * 47.9 + 9.0);
          float raft = smoothstep(0.38, 0.62, rsN(vec3(pq * 0.1, 3.0))) * (0.15 + 0.65 * (1.0 - smoothstep(4.0, 14.0, bd))) * still * cover;
          vec2 pd = pf - 0.3 - 0.4 * vec2(ph2, fract(ph2 * 7.3)); float ca = cos(ph * 6.2831853), sa = sin(ph * 6.2831853);
          pd = vec2(ca * pd.x + sa * pd.y, (ca * pd.y - sa * pd.x) * 1.7);
          float nearP = clamp(1.0 - dist / 110.0, 0.0, 1.0);
          float petal = step(ph, raft) * smoothstep(0.2, 0.14, length(pd)) * nearP + raft * 0.16 * (1.0 - nearP);
          col = mix(col, mix(uBloom, uBloomL, ph2) * (amb + uSunCol * 0.22), petal); edge = max(edge, petal);
        }
        gl_FragColor = vec4(col, edge * smoothstep(0.0, 6.0, vA.y) * (1.0 - smoothstep(uLen - uEnd.x, uLen - uEnd.y, vA.y) * smoothstep(uEnd.w, uEnd.z, abs(q.x))));
        #include <fog_fragment>
      }`})}async function ht(c,e={}){const i=e.rng||c.rng.fork("dome"),d=c.noise,w={shape:i.fork("shape"),rock:i.fork("rock"),pattern:i.fork("pattern"),icicles:i.fork("icicles"),trees:i.fork("trees"),cherry0:i.fork("cherry0"),cherry1:i.fork("cherry1"),pine:i.fork("pine"),scatter:i.fork("scatter"),terrace:i.fork("terrace"),cypress:i.fork("cypress"),tongues:i.fork("tongues"),runs:i.fork("runs"),seeps:i.fork("seeps")},p=e.look||qe(),S=e.waterY??.14,I=new n.Group;I.name="dome-over-the-river";const C=e.wing??130,g=e.shape||je(d,{seed:w.shape.range(0,40)}),v=await $e(d,g,C,c.yield),y=ke(g);await c.yield();const m=Be.makeRockMaterial({rng:w.rock,detailTexture:e.detailTexture,top:"#2f6a3a",topAmount:.6,topSlope:[.6,.88],contact:[.01,0,0],bump:1.1,detail:.8,bounce:"#b4d2d8",bounceAmount:e.bounce??2.2,waterLevel:S,wet:.7,wetRange:30,wetTint:"#d0d4d8",wetRoughness:.3}),b=new n.Mesh(v.rock,m);b.name="head-wall";const x=Ge(p,{side:n.DoubleSide}),T=new n.Mesh(Xe(d,g),x);T.name="mouth-throat",I.add(b,T),await c.yield();const u={R:41,RC:36,HC:14,rise:17,RB:46,cliffZ:20},l=await Ee(u,c.yield),h=e.pattern??w.pattern.int(0,3),f=Ze(p,{pattern:h}),a=new n.Group;a.name="dome",a.position.set(0,g.H0+3.2,g.faceZ(0,g.H0)-u.cliffZ),a.add(new n.Mesh(l.geometry,f));const o=e.wind||[.8,.6],k=[ne("#f5c344",.9),ne("#f2a7b8",.95),ne("#2146a8",1.1)];a.add(Qe(p,l.poles,k,o)),I.add(a),await c.yield();const M=await Ye(d,g,c.yield),A=new n.Mesh(M.geometry,f);A.name="terraces",I.add(A),await c.yield();{const _=w.tongues,H=[],G=[],D=[];for(const $ of[-1,1])for(let Q=0;Q<3;Q++){const te=$*(Q===0?Z.half-_.range(1.5,3):Q===1?_.range(27,33):_.range(38,44)),ae=Q===0?_.range(20,28):_.range(12,20),fe=Q===0?_.range(5,7.5):_.range(4,7),re=Q===0?_.range(3,5):_.range(1.2,2.4),ie=$*(Q===0?_.range(38,55):_.range(15,35))*Math.PI/180,xe=y.wallZ(te,0)-(Q===0?4:.5),ve=_.range(0,ee),se=await He(10,12,(le,J)=>{const ce=le*2-1,pe=J*(ae+2)-2,Ae=ce*fe*Math.sqrt(Math.max(0,1-J*J))*(.8+.2*Math.sin(J*9+ve)),ze=S-.5+(re+.5)*Math.pow(Math.max(0,1-ce*ce),.6)*q(0,.16,J)*Math.pow(1-J,.5)*(.8+.2*Math.sin(ce*5+J*9+ve)+.12*d.n2(ce*3+ve,J*6));return{p:[te+Math.sin(ie)*pe+Math.cos(ie)*Ae,ze,xe+Math.cos(ie)*pe-Math.sin(ie)*Ae],hole:!1,ice:[.2+.25*(1-J),.85,-.45]}}),ge=H.length/3,be=se.attributes.position.array,Me=se.attributes.aIce.array,Se=se.index.array;for(let le=0;le<be.length;le++)H.push(be[le]),G.push(Me[le]);for(let le=0;le<Se.length;le++)D.push(ge+Se[le])}for(let $=0,Q=w.runs;$<10;$++){const te=$<5?1:-1,ae=Q.range(.03,.27),fe=(te>0?ae:1-ae)*Math.PI,re=Q.range(4,9),ie=Q.range(1.4,3),xe=Q.range(.3,.8),ve=Q.range(0,ee),se=Q.range(.5,1)*ae*Math.PI,ge=await He(6,9,(J,ce)=>{const pe=-.6+ce*re,Ae=ie*Math.pow(1-ce,.7)*(.75+.25*Math.sin(ce*7+ve)),ze=fe-te*se*ce*ce+((J*2-1)*Ae+.4*Math.sin(ce*3+ve))/(Z.half+2+pe),Ie=(Z.half+pe)*Math.cos(ze),Te=Z.y0+(Z.top+pe-Z.y0)*Math.sin(ze),Pe=1-(J*2-1)**2;return{p:[Ie,Te,y.wallZ(Ie,Te)+(pe<N.vous?.5:0)+.06+xe*Math.pow(Pe,.6)*Math.pow(1-ce,.5)*q(-.6,.2,pe)-1.2*q(.1,-.6,pe)],hole:!1,ice:[.25+.2*Pe,.9,-.5]}}),be=H.length/3,Me=ge.attributes.position.array,Se=ge.attributes.aIce.array,le=ge.index.array;for(let J=0;J<Me.length;J++)H.push(Me[J]),G.push(Se[J]);for(let J=0;J<le.length;J++)D.push(be+le[J])}const j=new n.BufferGeometry;j.setAttribute("position",new n.Float32BufferAttribute(H,3)),j.setAttribute("aIce",new n.Float32BufferAttribute(G,3)),j.setIndex(D),j.computeVertexNormals();const K=new n.Mesh(j,x);K.name="gate-ice",I.add(K)}const F=We(-1),B=46,s=30,t=new n.InstancedMesh(F,x,B+s),r=new n.Matrix4,z=new n.Quaternion,P=new n.Vector3,L=new n.Vector3,R=w.icicles;for(let _=0;_<B;_++){const H=(_/(B-1)*2-1)*Z.half*.97+R.range(-.3,.3),G=ye(H/Z.half,-.999,.999),D=Z.y0+(Z.top-Z.y0)*Math.sqrt(1-G*G)+R.range(-.1,.25),j=R.range(2.5,8.5)*(.45+.55*Math.sqrt(1-G*G)),K=j*R.range(.9,1.5);r.compose(P.set(H,D,y.wallZ(H,D)-R.range(.5,3)),z.identity(),L.set(K,j,K)),t.setMatrixAt(_,r)}for(let _=0,H=w.seeps;_<6;_++){const G=(_%2?1:-1)*H.range(N.tower+N.towerR+2,92),D=H.range(8,22);for(let j=0;j<5;j++){const K=G+H.range(-1.5,1.5),$=D+H.range(-.6,.6),Q=H.range(1.5,4),te=Q*H.range(.9,1.5);r.compose(P.set(K,$,g.faceZ(K,$)+.4),z.identity(),L.set(te,Q,te)),t.setMatrixAt(B+_*5+j,r)}}if(t.name="icicles",I.add(t),e.stub!==!1){const _=[];for(let H=0;H<12;H++){const G=H/11,D=(H===0?1.32:1.06)*(1-.9*G*G);_.push({p:new n.Vector3(0,9-5*G,4-H*7),t:[0,-1],a:19*D,b:17*D,floor:-5-4*G,river:0,rw:9,sun:q(0,.4,G)-1,glow:.1+.3*G})}I.add((await Je(d,p,_,{segments:40,yield:c.yield})).mesh)}let W=null;if(e.trees!==!1){let _=e.floraMaterial;if(!_){const te={wind:we.makeWind({direction:o})};await we.prepareLeafTexture(te,c.yield),_=we.windMaterial(te)}const H=w.trees,G=[],D=e.density??1,j=a.position.x,K=a.position.z,$=e.blossom||["#f2a7b8","#ffd6e0"];for(let te=0,ae=0;te<Math.round(30*D)&&ae<900;ae++){const fe=H.chance(.6),re=fe?H.range(-1,1)*Math.min(C-8,112):H.range(-1,1)*(C-8),ie=fe?H.range(7,60):H.range(7,150),xe=g.topAt(re),ve=g.faceZ(re,xe)-ie;if(Math.hypot(re-j,ve-K)<u.RB+14)continue;const se=H.chance(fe?.7:.4),ge=g.backY(re,ie)-.4;G.push({x:re,y:ge,z:ve,s:H.range(.8,1.3),rot:H.range(0,ee),d:0,u:0,v:se?H.int(0,1):2}),te++}for(const te of[-1,1])for(let ae=0,fe=w.terrace;ae<3;ae++)for(let re=U.x[0]+fe.range(2,6);re<U.x[3];re+=fe.range(6,9)){const ie=te*re,xe=fe.range(.55,.8),ve=fe.range(0,ee);g.terK(ie)*U.d[ae]<4.5||M.heads.some(se=>se[0]===ae&&se[1]===te&&Math.abs(re-se[2])<he.landing/2+3)||ae===0&&M.burners.some(se=>Math.abs(se[0]-ie)<4)||G.push({x:ie,y:U.y[ae]-.3,z:M.lineZ(ie,ae)-3.1,s:xe,rot:ve,d:0,u:0,v:3})}await c.yield();const Q=[];Q.push(we.cherryGeometry({rng:w.cherry0,detail:e.treeDetail??1,height:11,leaf:$[0],leafLight:$[1]})),await c.yield(),Q.push(we.cherryGeometry({rng:w.cherry1,detail:0,height:9,leaf:$[0],leafLight:$[1]})),await c.yield(),Q.push(we.pineGeometry({rng:w.pine,detail:0,height:19,leaf:"#1b5238",leafLight:"#2f7a4e",leafDark:"#0f3b2a"})),await c.yield(),Q.push(we.cypressGeometry({rng:w.cypress,detail:0,height:15,leaf:"#1d5a3c",leafLight:"#2f7a4e",leafDark:"#0f3b2a"})),await c.yield(),W=we.makeScatter({rng:w.scatter,points:G,variants:Q,material:_}),W.object.name="plateau-trees",I.add(W.object)}I.add(tt(p,M.burners.map((_,H)=>[_[0],_[1],_[2],13+3*(H%2)]),{wind:[o[0]*.8,o[1]*.8]}));const V={uBalc:{value:new n.Vector4},uFace:{value:new n.Vector4(0,0,1,0)},uRise:{value:u.rise},uPattern:f.uniforms.uPattern};let O=null;if((e.mirror??150)>0){const _=e.mirror??150,H=new n.LineCurve3(new n.Vector3(0,.14,_+1),new n.Vector3(0,.14,1));O=new n.Mesh(at(H,40,12,(G,D)=>2*Ve(D.z)),nt(p,V,{still:[150,230],shelf:[0,.9,4.5,2.1]})),O.renderOrder=2,O.name="pool",I.add(O)}const E=new n.Vector3,Y=new n.Vector3,ue=new n.Vector3,me=()=>{I.updateMatrixWorld(!0),E.set(a.position.x,a.position.y+l.eaveY,a.position.z).applyMatrix4(I.matrixWorld),p.uDome.value.set(E.x,E.y,E.z,u.R),ue.set(a.position.x,a.position.y,a.position.z).applyMatrix4(I.matrixWorld),V.uBalc.value.set(ue.x,ue.y,ue.z,u.RB),Y.set(0,0,1).transformDirection(I.matrixWorld),ue.set(0,0,y.zg-.5).applyMatrix4(I.matrixWorld),V.uFace.value.set(Y.x,Y.y,Y.z,ue.dot(Y))};return me(),{object:I,radius:62,height:96,center:new n.Vector3(0,44,-8),ground:!0,groundY:-.25,look:p,shape:g,dome:u,pattern:h,water:V,parts:{rock:b,throat:T,dome:a,icicles:t,mirror:O,forest:W},gate:y,anchors:{mouth:new n.Vector3(0,8,0),into:new n.Vector3(0,0,-1),domeTop:new n.Vector3(0,a.position.y+l.top,a.position.z),domeCentre:new n.Vector3(0,a.position.y+12,a.position.z),poolHalf:Ve},place:me,update(_,H,G){p.uTime.value=H,me(),W&&W.update(_,H,G)},dispose(){}}}export{ft as BURNER_H,N as GATE,de as GLSL_N3,Oe as GLSL_SEA_LIGHT,Z as MOUTH,ot as POOL_LEN,U as TER,ht as buildHero,et as burnerInto,ct as columnGeometry,ke as gatePlan,He as iceSheetGeometry,lt as icicleFarGeometry,We as icicleGeometry,ne as lin,Ze as makeDomeMaterial,Re as makeGeo,Je as makeIceCave,Ge as makeIceMaterial,tt as makeIncense,qe as makeLook,ut as makeRockFountain,nt as makeWaterMaterial,Ve as poolHalf,at as ribbonGeometry,st as seaLightUniforms,je as wallShape};
