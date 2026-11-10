import*as s from"three";import{clamp as P,lerp as Y,smoothstep as V}from"../kit/core.js";const A=Math.PI/180,j=["#3FC6C0","#0F7F93","#F4EEDC","#9CCBEA","#F2C879","#E9E6DC","#FFF1B8"],L=[[0,3,19],[.25,3.7,17.4],[.5,4.8,16.2],[.7,6.2,14.6],[.85,8.5,12],[1,13,9]];function E(t,e){t=P(t,0,1);let o=0;for(;o<L.length-2&&t>L[o+1][0];)o++;const a=L[Math.max(o-1,0)],n=L[o],i=L[o+1],r=L[Math.min(o+2,L.length-1)],h=(t-n[0])/(i[0]-n[0]),f=(i[e]-a[e])/Math.max(i[0]-a[0],1e-4)*(i[0]-n[0]),l=(r[e]-n[e])/Math.max(r[0]-n[0],1e-4)*(i[0]-n[0]),c=h*h,m=c*h;return(2*m-3*c+1)*n[e]+(m-2*c+h)*f+(-2*m+3*c)*i[e]+(m-c)*l}const T=(t,e,o=new s.Vector3)=>{const a=t*A,n=e*A;return o.set(Math.sin(a)*Math.cos(n),Math.sin(n),-Math.cos(a)*Math.cos(n))};function O(t,e={}){return t=P(t,0,1),e.u=t,e.widthDeg=E(t,1),e.elevDeg=E(t,2),e.heat=V(.56,.74,t),e.fire=V(.705,.805,t),e.trainDeg=7+13*V(.71,.86,t)+5*V(.86,1,t),e.light=.55*V(.57,.71,t)+1.65*V(.72,.94,t),e.wake=V(.7,.82,t),e.flood=V(.765,.985,t),e}const U=`
float sH21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float sVN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(sH21(i), sH21(i + vec2(1., 0.)), f.x), mix(sH21(i + vec2(0., 1.)), sH21(i + vec2(1., 1.)), f.x), f.y); }
float sFbm(vec2 p){ return sVN(p) * .55 + sVN(p * 2.13 + 7.1) * .3 + sVN(p * 4.7 + 3.3) * .15; }
float sCaus(vec2 p, float t){
  vec2 a = p * 0.85 + vec2(t * .33, t * .21);
  vec2 b = vec2(p.x * .8 + p.y * .6, -p.x * .6 + p.y * .8) * 1.25 - vec2(t * .27, -t * .3);
  float n1 = sVN(a + 1.8 * sVN(b * .5)), n2 = sVN(b + 1.8 * sVN(a * .5));
  float r = clamp(1. - abs(n1 - n2) * 2.4, 0., 1.);
  return r * r * r * r;
}
`,N=`
uniform vec3 uSDir; uniform vec3 uMoonDir; uniform vec3 uSunDir;
uniform vec4 uSBody;      // angular radius (tan units), heat 0..1, fire 0..1, train length (tan units)
uniform vec4 uSShape;     // per-seed: lobe phases x,y,z and spin of the ellipsoid
uniform vec4 uSLook;      // stranger cover, moon cover, moon radius (tan units), softness (haze variation)
uniform vec3 uSChalk; uniform vec3 uSHot; uniform vec3 uSGold; uniform vec3 uSMoonCol;
uniform float uSTime;
uniform vec4 uSFx;       // wake 0..1 (dusky air round the train), crescent halo, spare, spare
uniform vec3 uSDusk;     // the colour of that air
`,W=`
${U}
// one sunlit body: q = tangent coords / radius, basis R,U,S (S toward the body), lump = rim lumpiness
// returns vec3(lit amount 0..1, coverage 0..1, normalised radius); px = size of a pixel in q units
vec3 sBody(vec2 q, vec3 R, vec3 U, vec3 S, vec3 sun, float lump, vec4 shape, float px, float soft){
  float r = length(q);
  if (r > 1.25) return vec3(0., 0., r);
  float ang = atan(q.y, q.x + step(abs(q.x) + abs(q.y), 1e-6) * 1e-4);
  float cs = cos(shape.w), sn = sin(shape.w);
  vec2 qe = vec2(cs * q.x + sn * q.y, -sn * q.x + cs * q.y);
  // lumpy rim: an ellipsoid plus three lobes plus a little rubble
  float rim = 1. - lump * (0.9 * (qe.y * qe.y) / max(r * r, 1e-4))
            + lump * (0.55 * sin(2. * ang + shape.x) + 0.42 * sin(3. * ang + shape.y) + 0.30 * sin(5. * ang + shape.z)
            + 0.22 * sin(9. * ang + shape.x * 2.7) + 0.10 * sin(17. * ang + shape.y * 1.9));
  float qn = r / max(rim, 0.3);
  float edge = 1. - smoothstep(1. - px * 0.8 - soft, 1. + px * 0.7 + soft * .5, qn);     // one pixel of smoothing, centred on the limb: a small body keeps its lit rim
  if (edge <= 0.) return vec3(0., 0., qn);
  float z = sqrt(max(1. - qn * qn, 0.));
  // relief: big facets and craters bend the normal so the terminator is ragged, as on a real rock
  vec2 e = vec2(.035, 0.);
  vec2 np = qe * 2.1 + shape.xy;
  float h0 = sFbm(np), hx = sFbm(np + e.xy), hy = sFbm(np + e.yx);
  vec2 g = vec2(hx - h0, hy - h0) / e.x;
  g = vec2(cs * g.x - sn * g.y, sn * g.x + cs * g.y);
  vec3 nl = normalize(vec3(q / max(rim, 0.3) - g * lump * 4.0 * (0.15 + z), z + 0.02));
  vec3 n = nl.x * R + nl.y * U - nl.z * S;
  float lam = dot(n, sun);
  float lit = smoothstep(-.01, .07 + soft, lam);
  float alb = 0.80 + 0.36 * (sFbm(qe * 4.3 + shape.yz) - .5) + 0.22 * (h0 - .5);
  lit *= alb * (0.80 + 0.20 * sqrt(clamp(lam, 0., 1.)));
  return vec3(lit, edge, qn);
}

const vec2 S_VDIR = vec2(-0.2079, -0.9781);     // the way it falls on the sky: down, and 12 degrees left of straight down
vec4 strangerSky(vec3 d){
  vec3 col = vec3(0.); float cover = 0.;
  float haze = smoothstep(0.0, 0.07, d.y);
  // ---- the stranger ----
  vec3 S = uSDir;
  vec3 R = normalize(cross(S, vec3(0., 1., 0.)));
  vec3 U = cross(R, S);
  float cz = dot(d, S);
  float sEdge = 0.;
  if (cz > 0.55) {
    vec2 t = vec2(dot(d, R), dot(d, U)) / cz;
    float rad = max(uSBody.x, 1e-4);
    vec2 q = t / rad;
    float px = clamp(length(fwidth(t)) / rad, 0., 0.3);
    float heat = uSBody.y, fire = uSBody.z;
    vec3 b = sBody(q, R, U, S, normalize(uSunDir - S * 0.30), 0.05, uSShape, px, uSLook.w);
    sEdge = b.y;
    float litc = b.x * b.y;
    float glare = 1. - 0.88 * fire;
    col += uSChalk * litc * uSLook.x * haze * glare;
    cover = max(cover, b.y * smoothstep(0., .22, b.x) * uSLook.x * 0.92 * haze * glare);
    float r = length(q);
    float lead = smoothstep(0.15, 0.92, dot(q / max(r, 1e-4), S_VDIR));
    if (heat > 0. && r < 3.5) {
      // the leading limb heats: a hairline along the edge that thickens to a sheath
      float w = mix(0.045, 0.26, heat * heat);
      float band = smoothstep(1. - w - px * 2., 1., b.z) * b.y;
      float hair = band * band * lead * (1.0 + 1.9 * heat);
      float outside = max(b.z - 1., 0.);
      float sheath = exp(-outside / (0.02 + 0.11 * heat)) * (1. - b.y) * lead * heat * (0.6 + 1.0 * heat);
      float flick = 0.86 + 0.14 * sVN(vec2(atan(q.y, q.x + step(abs(q.x) + abs(q.y), 1e-6) * 1e-4) * 6., uSTime * 2.3));
      col += mix(uSGold * vec3(1.15, 0.80, 0.42), uSHot, clamp(0.10 + 0.55 * heat * band, 0., 1.)) * (hair + sheath) * flick * smoothstep(0., .12, heat) * (1. - 0.9 * fire);
      cover = max(cover, band * lead * heat * glare);
    }
    // a faint halo of scattered light round the sunlit limb, so the eye finds it at a glance
    col += uSChalk * uSFx.y * exp(-max(b.z - 0.55, 0.) * 3.2) * smoothstep(-0.4, 0.5, dot(q, vec2(uSunDir.x, uSunDir.y - S.y))) * haze * (1. - b.y * 0.7);
    {
      float cw = clamp((cz - 0.55) / 0.45, 0., 1.); cw *= cw; cw *= cw; cw *= cw; cw *= cw;
      col += uSGold * vec3(1.06, 0.78, 0.48) * cw * (0.05 * heat + 0.07 * fire) * (0.35 + 0.65 * haze);     // (polish 5: a third of it: it veiled the sky round the fire in milk)
    }
    if (fire > 0.) {
      vec2 hq = S_VDIR * 0.42;
      vec2 dq = q - hq;
      float d2 = dot(dq, dq);
      float on = smoothstep(0., .18, fire);
      vec2 td = -S_VDIR;
      float s = dot(dq, td), dd = dot(dq, vec2(td.y, -td.x));
      float L = max(uSBody.w / rad, 1e-3);
      float sl = clamp(s / L, 0., 1.);
      // the dusky air round it: its own smoke, and the sky's blue deepening beside so bright a thing
      float wk = exp(-dd * dd / (1.6 + 3.0 * sl)) * smoothstep(-2.6, 0.6, s) * (1. - smoothstep(0.80, 1.5, s / L)) * 0.62 * uSFx.x;
      wk = max(wk, exp(-d2 / 7.0) * 0.55 * uSFx.x);
      col += uSDusk * wk * (1. - cover); cover = max(cover, wk);                 // laid behind the lit limb, over sky and dark side alike
      // the bead: a small hard white point, brighter than the Sun, gold-white, never clipped grey
      float bead = exp(-d2 / (0.004 + 0.022 * fire)) * (2.2 + 2.4 * fire);
      col += (uSHot * bead + uSGold * (exp(-d2 / (0.10 + 0.20 * fire)) * 0.42 * (0.35 + 0.65 * fire) + exp(-sqrt(d2) / 1.0) * 0.04 + exp(-d2 / 3.2) * 0.04) * fire) * on;     // (polish 5: at its first moment a hard bead with a streak behind it, not a ball in a round glow)       // a round white head in a gold halo: the crescent is lost in its glare
      // the train: dead straight, standing up behind it and leaning right; white at the head, saturated gold at the tail
      float rag = 0.80 + 0.4 * sFbm(vec2(s * 1.7 - uSTime * 1.9, 2.));                      // ragged edges, never a wavering centre line
      float w = mix(0.44, 0.075, sqrt(sl)) * (0.6 + 0.4 * on) * rag * (0.55 + 0.45 * fire);     // (polish 5: a slim spear from the first, filling out as it comes down)
      float xw = dd / max(w, 1e-3);
      float core = exp(-xw * xw);
      float hair = exp(-xw * xw * 12.);
      float along = smoothstep(-0.55, 0.15, s) * (1. - smoothstep(0.78, 1.0, sl));
      float streak = sFbm(vec2(xw * 2.4 + 3., s * 0.9 - uSTime * 2.6)) * 0.8 + sVN(vec2(xw * 6., s * 0.35 - uSTime * 4.3)) * 0.5;
      streak *= streak;
      float glow = exp(-abs(dd) / (w * 3.0 + 0.05)) * 0.16;
      vec3 gold = uSGold * vec3(1.12, 0.74, 0.30);
      vec3 tcol = mix(uSHot, gold, smoothstep(0.04, 0.50, sl));
      col += (tcol * (core * (0.75 + 1.5 * streak) * mix(1.7, 2.3, smoothstep(0., 0.25, sl)) + glow * mix(0.5, 0.6, sl)) + uSHot * hair * 2.4 * smoothstep(0.03, 0.2, sl) * (1. - smoothstep(0.2, 0.55, sl))) * along * on;
    }
  }
  {
    // (polish 4) the second daylight in the sky: a wide gold tide round the fire, strongest in the haze along the horizon under it
    float cw2 = clamp((cz - 0.10) / 0.90, 0., 1.); cw2 *= cw2; cw2 *= cw2 * cw2;
    float gl2 = cw2 * cw2 * uSFx.z * (0.12 + 0.88 * exp(-max(d.y, 0.) * 9.));          // (polish 5: narrower, and it keeps to the haze on the horizon)
    col += uSGold * vec3(1.18, 0.80, 0.42) * gl2 * 0.16 * (1. - 0.6 * cover);
    cover = max(cover, gl2 * 0.08);                               // gold laid OVER the blue (added to it, it went mauve)
  }
  // ---- the Moon: the same light on a smooth old ball; it is the ruler ----
  vec3 M = uMoonDir;
  float cm = dot(d, M);
  if (cm > 0.995) {
    vec3 Rm = normalize(cross(M, vec3(0., 1., 0.)));
    vec3 Um = cross(Rm, M);
    vec2 tm = vec2(dot(d, Rm), dot(d, Um)) / cm;
    float mr = max(uSLook.z, 1e-4);
    vec2 qm = tm / mr;
    float pxm = clamp(length(fwidth(tm)) / mr, 0., 0.4);
    vec3 m = sBody(qm, Rm, Um, M, normalize(uSunDir - M * 0.30), 0.0, vec4(1.7, 4.1, 2.3, 0.6), pxm, 0.015 + uSLook.w);
    float mc = m.x * m.y * (1. - sEdge) * haze;
    col += uSMoonCol * mc * uSLook.y;
    cover = max(cover, mc * uSLook.y * 0.8);
  }
  return vec4(col, clamp(cover, 0., 1.));
}
`;function Z(t,e,o){const a=l=>new s.Color(l),n=(o.sunDir?new s.Vector3().copy(o.sunDir):T(40,13)).normalize(),i=o.rareEvent??t.chance(.08),r=o.moonAz??(i?.6:11),h=o.moonEl??(i?15:16.6),f=a(e[6]);return f.g*=.97,f.b*=.86,{uSDir:{value:T(0,24)},uMoonDir:{value:T(r,h)},uSunDir:{value:n},uSBody:{value:new s.Vector4(Math.tan(1.2*A),0,0,0)},uSShape:{value:new s.Vector4(t.range(0,6.28),t.range(0,6.28),t.range(0,6.28),t.range(-1.2,1.2))},uSLook:{value:new s.Vector4(o.strangerCover??.9,o.moonCover??.7,Math.tan((o.moonWidthDeg??1.35)*.5*A),o.soft??0)},uSChalk:{value:a(e[2]).multiplyScalar(o.strangerBright??.95)},uSHot:{value:f},uSGold:{value:a(e[4])},uSMoonCol:{value:a(e[5]).multiplyScalar(o.moonBright??1)},uSTime:{value:0},uSFx:{value:new s.Vector4(0,o.strangerHalo??.16,0,0)},uSDusk:{value:a(o.dusk??"#3D5E86").multiplyScalar(.55)}}}function J(t){const e=new s.SphereGeometry(1,32,16),o=new s.ShaderMaterial({uniforms:t,side:s.BackSide,depthWrite:!1,depthTest:!0,transparent:!0,fog:!1,blending:s.CustomBlending,blendEquation:s.AddEquation,blendSrc:s.OneFactor,blendDst:s.OneMinusSrcAlphaFactor,vertexShader:`
      varying vec3 vDir;
      void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,fragmentShader:`
      precision highp float;
      varying vec3 vDir;
      ${N}
      ${W}
      void main(){
        vec3 d = normalize(vDir + vec3(0., 1e-6, 0.));
        vec4 s = strangerSky(d);
        gl_FragColor = s;
      }`}),a=new s.Mesh(e,o);return a.name="strangerSky",a.renderOrder=-.5,a.frustumCulled=!1,a}const G=`
uniform vec3 uSkyTop; uniform vec3 uSkyHor; uniform vec3 uSunCol; uniform vec3 uCamL;
uniform vec4 uMo;        // the animal: x, z, heading (radians, 0 = +Z), surfaced 0..1
uniform vec4 uSea;       // depth of the bank (m), second light 0..2.2, time, seed
uniform vec3 uTurq; uniform vec3 uDeep; uniform vec3 uSand; uniform vec3 uGrass;
vec3 seaSky(vec3 r){
  float h = clamp(r.y, 0., 1.);
  vec3 c = mix(uSkyHor, uSkyTop, smoothstep(0.02, 0.55, h));
  c = mix(c, uSkyHor * 1.08 + 0.04, exp(-h * 14.));           // the milky band on the horizon
  float sd = clamp(dot(r, uSunDir), 0., 1.);
  float s2 = sd * sd; float s8 = s2 * s2 * s2 * s2; float s64 = s8 * s8 * s8 * s8 * s8 * s8 * s8 * s8;
  c += uSunCol * (s8 * 0.12 + s64 * s64 * 0.5 + smoothstep(0.99985, 0.99997, sd) * 14.);
  return c;
}
`;function Q(t,e,o,a){const n=i=>new s.Color(i);return{...s.UniformsUtils.clone(s.UniformsLib.fog),...o,uSkyTop:{value:n(a.skyTop??"#5E9FD6")},uSkyHor:{value:n(a.skyHorizon??"#DCEBEC")},uSunCol:{value:n(a.sunColor??"#FFE7B0")},uCamL:{value:new s.Vector3(0,3,30)},uMo:{value:new s.Vector4(0,0,0,0)},uSea:{value:new s.Vector4(a.depth??5,0,0,t.range(0,50))},uTurq:{value:n(e[0])},uDeep:{value:n(e[1])},uSand:{value:n(e[2]).multiplyScalar(.74)},uGrass:{value:n(a.grass??"#5E7F3A")}}}const $=`
  varying vec3 vPos;
  #include <fog_pars_vertex>
  void main(){
    vPos = position;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`;function ee(t){const e=new s.CircleGeometry(1500,48);e.rotateX(-Math.PI/2);const o=new s.ShaderMaterial({uniforms:t,fog:!0,vertexShader:$,fragmentShader:`
      precision highp float;
      varying vec3 vPos;
      ${N}
      ${W}
      ${G}
      #include <fog_pars_fragment>
      float shadowBlob(vec2 p, vec3 L, float soft, float halfW){
        // the animal's shadow thrown down the light's direction onto the bed
        float depth = uSea.x;
        vec2 off = -L.xz / max(L.y, 0.12) * depth;
        vec2 d = p - (uMo.xy + off);
        float ch = cos(uMo.z), sh = sin(uMo.z);
        vec2 l = vec2(ch * d.x - sh * d.y, sh * d.x + ch * d.y);        // x across, y along the body
        float stretch = 1. + abs(dot(normalize(L.xz + vec2(1e-4, 0.)), vec2(sh, ch))) * (1. / max(L.y, 0.12) - 1.) * 0.12;
        float e = length(vec2(l.x / halfW, (l.y + 0.8) / (5.6 * stretch)));
        return 1. - smoothstep(1. - soft, 1. + soft * 0.4, e);
      }
      void main(){
        vec2 p = vPos.xz;
        vec3 toCam = uCamL - vec3(p.x, -uSea.x, p.y);
        float dist = length(toCam);
        float nearF = 1. / (1. + dist * 0.035);
        float t = uSea.z;
        // the channel on the left, the bank under us
        float chan = 1. - smoothstep(-78., -34., p.x + 16. * sin(p.y * .021 + uSea.w) + 9. * sin(p.y * .067));
        // white sand in ripple bars 0.4 m apart, bending
        float wob = sFbm(p * 0.11 + uSea.w) * 9. + sFbm(p * 0.9) * 0.5;
        float bars = sin((p.x * 0.78 + p.y * 0.62 + wob) * 15.7);
        float rip = mix(1., 0.78 + 0.22 * smoothstep(-0.6, 0.9, bars), 1. - smoothstep(10., 38., dist));
        vec3 col = uSand * rip * (0.92 + 0.16 * sFbm(p * 0.35 + 9.));
        // seagrass in leopard patches 8 to 30 m across
        float gm = sFbm(p * 0.07 + uSea.w * 1.7) + 0.22 * (sFbm(p * 0.33) - .5);
        float grass = smoothstep(0.50, 0.56, gm) * (0.8 + 0.2 * smoothstep(0.42, 0.52, sFbm(p * 0.021 + 31.)));
        float blades = 0.55 + 0.6 * sVN(vec2(p.x * 2.3 + sin(t * .7 + p.y * .3) * .5, p.y * 9.));
        col = mix(col, uGrass * 0.42 * blades, grass * 0.92);
        col = mix(col, uDeep * 0.18, chan);
        // light: the Sun, the caustic net, and the tide of the second light
        float ca = sCaus(p * 1.7, t) * min(nearF * 2.4, 1.);
        float l2 = uSea.y;
        vec3 light = uSunCol * (0.74 + 0.6 * ca) * (1. - 0.5 * shadowBlob(p, uSunDir, 0.6, 1.9));
        light += uSHot * l2 * (0.32 + 0.42 * ca) * (1. - 0.85 * shadowBlob(p, uSDir, 0.10, 1.35));
        col *= light;
        // looking down through clear water: red goes first, turquoise comes back
        float depth = uSea.x + chan * 22.;
        vec3 vd = toCam / max(dist, 1e-3);
        float path = depth / max(vd.y, 0.07) + depth * 0.6;
        vec3 T = exp(-path * vec3(0.105, 0.022, 0.030));
        vec3 scatter = mix(uTurq, uDeep, smoothstep(6., 60., path)) * (0.55 + 0.25 * l2);
        col = col * T + scatter * (1. - exp(-path * 0.045));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),a=new s.Mesh(e,o);return a.name="stageBed",a.position.y=-t.uSea.value.x,a.frustumCulled=!1,a}function te(t){const e=new s.CircleGeometry(1500,48);e.rotateX(-Math.PI/2);const o=new s.ShaderMaterial({uniforms:t,fog:!0,vertexShader:$,transparent:!0,depthWrite:!1,blending:s.CustomBlending,blendEquation:s.AddEquation,blendSrc:s.OneFactor,blendDst:s.OneMinusSrcAlphaFactor,fragmentShader:`
      precision highp float;
      varying vec3 vPos;
      ${N}
      ${W}
      ${G}
      #include <fog_pars_fragment>
      void main(){
        vec2 p = vPos.xz;
        vec3 toCam = uCamL - vec3(p.x, 0., p.y);
        float dist = length(toCam);
        vec3 V = toCam / max(dist, 1e-3);
        float nearF = 1. / (1. + dist * 0.03);
        float t = uSea.z;
        // glass with a long slow swell and the faintest cat's-paws
        vec2 g = vec2(0.);
        float sw = sFbm(p * 0.035 + 3.) * 7.;                       // the swell is never ruler-straight
        float swF = 0.25 + 0.75 * nearF;
        g += vec2(0.80, 0.60) * 0.022 * swF * cos(dot(p, vec2(0.80, 0.60)) * 0.35 - t * 0.9 + sw);
        g += vec2(-0.45, 0.89) * 0.016 * swF * cos(dot(p, vec2(-0.45, 0.89)) * 0.57 - t * 1.2 + 1.7 - sw * 1.3);
        vec2 rp = p * 1.6 + vec2(t * 0.25, t * 0.18);
        float r0 = sFbm(rp);
        g += vec2(sFbm(rp + vec2(.12, 0.)) - r0, sFbm(rp + vec2(0., .12)) - r0) * (0.10 + 0.5 * nearF);
        vec2 fp = p * 5.3 - vec2(t * 0.4, -t * 0.3);
        float f0 = sVN(fp);
        g += vec2(sVN(fp + vec2(.2, 0.)) - f0, sVN(fp + vec2(0., .2)) - f0) * 0.10 * nearF;
        // the animal's bow wave and V wake, in its own frame (x across, y ahead)
        vec2 d = p - uMo.xy;
        float ch = cos(uMo.z), sh = sin(uMo.z);
        vec2 l = vec2(ch * d.x - sh * d.y, sh * d.x + ch * d.y);
        float behind = 5.2 - l.y;
        float foam = 0.;
        if (uMo.w > 0.001 && behind > -3. && behind < 90.) {
          float bb = max(behind, 0.);
          float a = abs(l.x) - bb * 0.33 - 0.35;
          float wd = 0.30 + bb * 0.040;
          float fade = smoothstep(-0.5, 2.0, behind) * exp(-bb / 26.) * uMo.w;
          float arm = exp(-(a * a) / (wd * wd)) * fade;
          float dadx = -2. * a / (wd * wd) * arm * sign(l.x) * 0.16;
          float inside = (1. - smoothstep(-0.6, 0.3, a)) * fade;
          float tw = cos(bb * 2.1 - t * 5.) * 0.10 * inside * exp(-bb / 12.);
          vec2 gl2 = vec2(dadx, tw);
          g += vec2(ch * gl2.x + sh * gl2.y, -sh * gl2.x + ch * gl2.y);
          float churn = sVN(l * 2.2 + vec2(0., t * 1.5)) * sVN(l * 5.1 - vec2(t, 0.));
          foam = arm * arm * (1. - smoothstep(1., 14., bb)) * (0.35 + 1.6 * churn)
               + (1. - smoothstep(0.04, 0.16, abs(length(vec2(l.x / 0.66, (l.y - 1.9) / 3.7)) - 1.))) * uMo.w * uMo.w * (0.10 + 0.9 * churn);
        }
        vec3 n = normalize(vec3(-g.x, 1., -g.y));
        vec3 R = reflect(-V, n); R.y = abs(R.y) + 0.002; R = normalize(R);
        float c1 = 1. - clamp(dot(n, V), 0., 1.);
        float F = 0.02 + 0.98 * c1 * c1 * c1 * c1 * c1;
        float far = 1. - nearF;
        vec3 Rs = normalize(R + vec3(0., 0.22 * far, 0.));
        vec3 refl = seaSky(Rs);
        vec4 st = strangerSky(R);
        refl = refl * (1. - st.a) + min(st.rgb, vec3(2.4));
        F = min(F, 0.80 - 0.12 * far);
        F *= 1. - 0.38 * exp(-dot(l * vec2(1., 0.55), l * vec2(1., 0.55)) / 30.);
        float k = mix(0.10, 0.95, far * far);
        vec3 scatter = mix(uTurq * 0.5, uTurq * 0.42 + uDeep * 0.55, far) * (1. + 0.4 * uSea.y);
        foam = clamp(foam, 0., 1.);
        vec3 col = refl * F + scatter * (1. - F) * k;
        float alpha = F + (1. - F) * k;
        vec3 foamCol = (uSunCol * 0.62 + uSHot * 0.35 * uSea.y + uSkyTop * 0.25);
        col = mix(col, foamCol, foam * 0.85); alpha = mix(alpha, 1., foam * 0.85);
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`}),a=new s.Mesh(e,o);return a.name="stageWater",a.renderOrder=1,a.frustumCulled=!1,a}function ae(t,e={}){const o=r=>{const h=120*(r-.33);return[-15*(1-V(-34,-2,h))-.022*Math.pow(Math.max(h-9,0),2),h-.012*Math.pow(Math.max(h-9,0),2)]},a=o(t-.004),n=o(t+.004),i=o(t);return e.x=i[0],e.z=i[1],e.heading=Math.atan2(n[0]-a[0],n[1]-a[1]),e.surfaced=V(.285,.33,t)*(1-V(.385,.425,t)),e.breath=P((t-.336)/.05,0,1),e.dive=V(.385,.4,t)*(1-V(.42,.45,t)),e}const _=[[6,6.5,210],[6,6.3,190],[6.6,5.4,172],[10.5,3.6,150],[18.5,1.5,122],[22.5,1,95],[20,1.35,70],[11.5,3.3,46],[3.5,3.7,21],[-1.5,2.7,-20],[-2,2.5,-44],[7,3,-66],[13.5,2.1,-88],[12,2.2,-108],[14,3,-122],[16.5,8,-141],[18,15.5,-162],[16.4,18.5,-181.9],[9,12.6,-199],[2,5.2,-215.5],[-4.6,2.4,-230],[-13.2,2.2,-246.5],[-24.36,4.6,-265.5],[-33.13,8,-283.48],[-41.89,8,-301.46],[-59.43,8,-337.41]];async function ue(t,e={}){const o=t.rng,a=e.palette&&e.palette.length>=7?e.palette:j,n=P(e.detail??1,.6,1),i=new s.Group;i.name="crescent-over-yucatan";const r=Z(o.fork("sky"),a,e),h=J(r);h.scale.setScalar(e.skyRadius??1800),i.add(h),await t.yield();const f=e.stage!==!1,l=Q(o.fork("sea"),a,r,e);f&&(i.add(ee(l)),await t.yield(),i.add(te(l)),await t.yield());const c=await me(t,{...e,rng:o.fork("mosasaur"),detail:n});i.add(c.object),await t.yield();let m=!0;const u={},S=e.demoHeading??.55+o.range(-.25,.25);function k(v){const F=((v-4)%16+16)%16/16,D=(F-.5)*16*3,B=P(1-Math.abs(F-.5)/.36,0,1),R=V(0,.45,B);c.setPose(Math.sin(S)*D,Math.cos(S)*D,S,R,P((F-.42)/.16,0,1))}const d=O(0);d.dir=new s.Vector3,d.lightColor=new s.Color(a[6]);let x=-1,M=null,w=!1,p=null;try{const v=globalThis.location?.search||"",b=/[?&]prog=([0-9.]+)/.exec(v);b&&(M=parseFloat(b[1])),w=/[?&]prog=cam/.test(v);const F=/[?&]rad=([0-9.]+)/.exec(v);F&&(p=parseFloat(F[1]))}catch{M=null}const g=new s.Vector3,z=r.uMoonDir.value.clone(),C=new s.Vector3,y=[Math.atan2(z.x,-z.z)/A,Math.asin(P(z.y,-1,1))/A];function q(v,b){O(v,d);const F=x>=0?1-V(0,.035,v):0;T(0,d.elevDeg,d.dir),T(0,d.elevDeg-8.5*F,r.uSDir.value);const D=Math.abs(y[0])<3;F>0?r.uMoonDir.value.copy(T(y[0]*(1-(D?0:.5)*F),y[1]-(D?8.5:8.4)*F,C)):r.uMoonDir.value.copy(z),r.uSBody.value.set(Math.tan(d.widthDeg*.5*A),d.heat,d.fire,Math.tan(d.trainDeg*A)),r.uSFx.value.x=d.wake,r.uSFx.value.z=d.flood,r.uSTime.value=b%1e3,l.uSea.value.y=d.light,l.uSea.value.z=b%1e3,m&&(x>=0?(ae(x,u),c.setPose(u.x,u.z,u.heading,u.surfaced,u.breath,u.dive)):k(b)),c.update(0,b,d.light),l.uMo.value.set(c.pose.x,c.pose.z,c.pose.heading,c.pose.surfaced)}return q(0,0),{object:i,radius:p??6,height:p!=null?3.5:6,center:new s.Vector3(0,p!=null?1:2,0),anchors:{heading:new s.Vector3(0,0,-1),sunDir:r.uSunDir.value.clone(),moonDir:r.uMoonDir.value.clone(),strangerDir:(v,b=new s.Vector3)=>T(0,E(v,2),b),surfacing:new s.Vector3(0,0,0),flyThrough:_.map(v=>new s.Vector3(v[0],v[1],v[2])),portalSeat:{position:new s.Vector3(_[_.length-1][0],8,_[_.length-1][2]),facing:new s.Vector3(.4384,0,.8988)},viewpoints:[{u:0,position:new s.Vector3(6,3,210),lookAt:new s.Vector3(6,3,150),note:"entry: crescent 24 degrees up dead ahead, Moon 13 degrees to its right"},{u:.36,position:new s.Vector3(6,2.8,9),lookAt:new s.Vector3(0,.3,3),note:"drawing level: wet banded back, breath, V wake under the crescent"},{u:.95,position:new s.Vector3(-47.1,8,-312.2),lookAt:new s.Vector3(-59.4,8,-337.4),note:"fire train right of the ring, second glitter road"}]},state:d,skyUniforms:r,seaUniforms:l,sky:h,mosasaur:c,setMosasaur(v,b,F,D,B,R){m=!1,c.setPose(v,b,F,D,B,R)},setProgress(v){x=P(v,0,1)},update(v,b,F){F.getWorldPosition(g),i.updateWorldMatrix(!0,!1),h.position.copy(i.worldToLocal(g));let D=x>=0?x:M??(b/40+.59)%1;x<0&&w&&(D=P((Math.atan2(h.position.x,h.position.z)+.25)/.5,0,1)),q(D,b),l.uCamL.value.copy(h.position)},dispose(){},ground:!1,groundY:0}}class oe{constructor(){this.p=[],this.c=[],this.k=[],this.i=[],this.n=0}v(e,o,a,n,i){return this.p.push(e,o,a),this.k.push(n[0],n[1],n[2],n[3]),this.c.push(i[0],i[1],i[2]),this.n++}quad(e,o,a,n){this.i.push(e,o,a,e,a,n)}tri(e,o,a){this.i.push(e,o,a)}build(){const e=new s.BufferGeometry;return e.setAttribute("position",new s.Float32BufferAttribute(this.p,3)),e.setAttribute("aSkin",new s.Float32BufferAttribute(this.k,4)),e.setAttribute("color",new s.Float32BufferAttribute(this.c,3)),e.setIndex(this.i),e.computeVertexNormals(),e}}const se=[[6,-.03,.04,.05,.06,2],[5.93,-.03,.1,.11,.13,2.2],[5.72,-.02,.15,.17,.2,2.4],[5.32,-.01,.2,.23,.265,2.5],[4.92,0,.245,.28,.335,2.6],[4.52,0,.285,.32,.4,2.5],[4.12,0,.35,.4,.4,2.3],[3.6,0,.5,.57,.5,2.25],[2.8,0,.7,.79,.66,2.2],[1.9,0,.84,.92,.75,2.2],[1,0,.85,.89,.72,2.2],[.1,0,.75,.72,.56,2.1],[-.9,0,.63,.57,.39,2],[-1.9,0,.53,.47,.26,1.9],[-2.9,0,.46,.41,.175,1.8],[-3.8,-.01,.42,.38,.125,1.7],[-4.5,-.05,.4,.37,.095,1.65],[-5,-.17,.35,.31,.07,1.6],[-5.5,-.5,.25,.21,.048,1.6],[-5.85,-.82,.13,.11,.028,1.6],[-6,-1,.03,.03,.01,1.6]];function ne(t,e){const o=se;let a=0;for(;a<o.length-2&&t<o[a+1][0];)a++;const n=o[Math.max(a-1,0)],i=o[a],r=o[a+1],h=o[Math.min(a+2,o.length-1)],f=P((t-i[0])/(r[0]-i[0]),0,1),l=f*f,c=l*f;for(let m=1;m<6;m++){const u=(r[m]-n[m])/(r[0]-n[0])*(r[0]-i[0]),S=(h[m]-i[m])/(h[0]-i[0])*(r[0]-i[0]);e[m]=(2*c-3*l+1)*i[m]+(c-2*l+f)*u+(-2*c+3*l)*r[m]+(c-l)*S}return e[2]=Math.max(e[2],.02),e[3]=Math.max(e[3],.02),e[4]=Math.max(e[4],.008),e}function re(t,e,o,a){const n=[0,0,0,0,0,0],i=[1,1,1],r=[];for(let l=0;l<=a;l++){const c=l/a,m=c+.055*Math.sin(c*Math.PI*2)*-1,u=6-12*P(m,0,1);ne(u,n);const S=t.n,k=2/n[5];for(let d=0;d<o;d++){const x=d/o*Math.PI*2,M=Math.cos(x),w=Math.sin(x);let p=n[4]*Math.sign(M)*Math.pow(Math.abs(M),k),g=n[1]+(w>0?n[2]:n[3])*Math.sign(w)*Math.pow(Math.abs(w),k);const z=Math.abs(p)-.27,C=g-.17,y=u-5,q=Math.exp(-(z*z*30+C*C*60+y*y*9)),v=u-4.45,b=g+.05,F=Math.exp(-(v*v*5+b*b*10))*(Math.abs(M)>.3?1:.3),D=1+.1*q+.11*F;p*=D,g+=.035*q;for(const[B,R]of[[3.55,.1],[.25,.07]]){const H=u-B,I=g+.42;p*=1+R*Math.exp(-(H*H*3.2+I*I*5))*(w<.3?1:.4)}t.v(p,g,u,[w,0,0,0],i)}r.push(S)}for(let l=0;l<a;l++)for(let c=0;c<o;c++){const m=r[l]+c,u=r[l]+(c+1)%o,S=r[l+1]+(c+1)%o,k=r[l+1]+c;t.quad(m,k,S,u)}const h=t.v(0,-.03,6.035,[0,0,0,0],i),f=t.v(0,-1,-6.03,[0,0,0,0],i);for(let l=0;l<o;l++)t.tri(h,r[0]+l,r[0]+(l+1)%o),t.tri(f,r[a]+(l+1)%o,r[a]+l)}function K(t,e){const{root:o,span:a,fwd:n,len:i,chord:r,sweep:h,thick:f,n:l=12,m:c=8,part:m,phase:u,col:S}=e,k=new s.Vector3().crossVectors(a,n).normalize(),d=e.up&&k.dot(e.up)<0;d&&k.negate();const x=new s.Vector3,M=[[],[]];for(let w=0;w<=l;w++){const p=w/l,g=r(p),z=h(p),C=f(p);for(let y=0;y<2;y++){const q=[];for(let v=0;v<=c;v++){const b=v/c,F=(.5-b)*g+z,D=Math.sin(Math.PI*Math.pow(b,.75))*C*(y?-1:1);x.copy(o).addScaledVector(a,p*i).addScaledVector(n,F).addScaledVector(k,D);const B=S(p,b,y);q.push(t.v(x.x,x.y,x.z,[e.ring??(y?-1:1),m,u,p],B))}M[y].push(q)}}for(let w=0;w<2;w++)for(let p=0;p<l;p++)for(let g=0;g<c;g++){const z=M[w][p][g],C=M[w][p][g+1],y=M[w][p+1][g+1],q=M[w][p+1][g];w===1!=!!d?t.quad(z,q,y,C):t.quad(z,C,y,q)}}function X(t,e,o,a,n){const i=Math.sign(e),r=[.012,.016,.02],h=[.32,.36,.36],f=[1,1,1],l=[],c=10,m=6;for(let g=0;g<=m;g++){const z=[],C=g/m*Math.PI*.62;for(let y=0;y<c;y++){const q=y/c*Math.PI*2,v=Math.sin(C)*n,b=g===m;z.push(t.v(e+i*(Math.cos(C)*n-(b?.012:0)),o+Math.sin(q)*v*(b?1.25:1),a+Math.cos(q)*v*(b?1.35:1),b?[.6,0,0,0]:[0,1,0,0],b?h:r))}l.push(z)}for(let g=0;g<m;g++)for(let z=0;z<c;z++){const C=l[g][z],y=l[g][(z+1)%c],q=l[g+1][(z+1)%c],v=l[g+1][z];i>0?t.quad(C,y,q,v):t.quad(C,v,q,y)}const u=e+i*n*.93,S=o+n*.42,k=a+n*.34,d=n*.24,x=t.v(u,S-d,k-d,[0,2,0,0],f),M=t.v(u,S-d,k+d,[0,2,0,0],f),w=t.v(u+i*.004,S+d,k+d*.6,[0,2,0,0],f),p=t.v(u+i*.004,S+d,k-d*.6,[0,2,0,0],f);i>0?t.quad(x,p,w,M):t.quad(x,M,w,p)}async function ie(t,e,o){const a=new oe,n=(r,h,f)=>new s.Vector3(r,h,f);re(a,t,e>.8?32:24,e>.8?84:64),await o();const i=(r,h,f,l,c)=>K(a,{root:n(r*(h>2,.34),(h>2,-.4),h),span:n(r*.96,-.16,-.22).normalize(),fwd:n(r*.22,.05,.97).normalize(),len:f,part:3,phase:c,n:13,m:8,up:n(0,1,0),chord:m=>l*(.5+.5*Math.sin(Math.PI*P(.1+.72*m,0,1)))*Math.sqrt(Math.max(1-Math.pow(m,5),0))+.02*(1-m),sweep:m=>.09*Math.sin(Math.PI*Math.min(m/.42,1))-.4*Math.pow(Math.max(m-.28,0),1.25)*f,thick:m=>.17*Math.pow(1-m,1.5)+.06*(1-m)+.016,col:(m,u,S)=>{const k=(S?1:.82)*(1-.3*m*m)*(.8+.2*Math.cos(u*15.7-m*1.5)*Math.min(m*3,1))*(1+.35*V(.82,1,u));return[k,k,k]}});return i(1,3.5,1.45,.84,0),i(-1,3.5,1.45,.84,.5),i(1,.3,1.12,.64,2.2),i(-1,.3,1.12,.64,2.7),K(a,{root:n(0,.1,-4.93),span:n(0,.8,-.6).normalize(),fwd:n(0,.6,.8).normalize(),len:1.42,part:0,phase:0,n:9,m:7,ring:.9,chord:r=>1.02*(1-r)*(1-.25*Math.sin(Math.PI*r))+.015,sweep:r=>-.2*r,thick:r=>.075*(1-r)+.006,col:()=>[1,1,1]}),X(a,.3,.15,5,.05),X(a,-.3,.15,5,.05),await o(),a.build()}function le(t,e,o){const a=r=>new s.Color(r),n={uSwim:{value:new s.Vector4(0,1,0,0)},uWater:{value:new s.Vector4(0,0,0,t.range(0,40))},uSkinA:{value:a(o.back??"#1F3A44").multiplyScalar(3.4)},uSkinB:{value:a(e[5]).multiplyScalar(.8)},uMScat:{value:a(e[0])},uMSky:{value:a(o.skyFill??e[3])}},i=new s.MeshStandardMaterial({vertexColors:!0,roughness:.46,metalness:0});return i.onBeforeCompile=r=>{Object.assign(r.uniforms,n),r.vertexShader=r.vertexShader.replace("#include <common>",`#include <common>
        attribute vec4 aSkin; varying vec4 vSkin; varying vec3 vBody; varying vec3 vWPos; uniform vec4 uSwim;`).replace("#include <beginnormal_vertex>",`
        vec3 objectNormal = vec3(normal);
        // the swimming wave: nothing forward of the hips, growing to the fluke (a sideways shear x += f(z))
        float mTail = clamp((1.2 - position.z) / 7.2, 0., 1.);
        float mArg = uSwim.x - mTail * 2.4;
        float mHead = clamp(position.z / 6., 0., 1.);
        float mOff = uSwim.y * (mTail * mTail * sin(mArg) + 0.045 * mHead * sin(uSwim.x + 1.3));
        float mD = uSwim.y * ((-1. / 7.2) * step(0., mTail) * step(mTail, 0.9999) * (2. * mTail * sin(mArg) - mTail * mTail * 2.4 * cos(mArg)) + 0.045 / 6. * step(0., position.z) * sin(uSwim.x + 1.3));
        objectNormal.z -= mD * objectNormal.x;
        objectNormal = normalize(objectNormal + vec3(0., 1e-5, 0.));`).replace("#include <begin_vertex>",`
        vec3 transformed = vec3(position);
        transformed.x += mOff;
        transformed.y -= 0.27 * mTail * mTail;                             // the tail trails low: only the tip of its upper lobe cuts the surface
        if (aSkin.y > 2.5) {                                              // paddles: slow flat steering strokes from the shoulder
          float w = aSkin.w * aSkin.w, st = uSwim.z + aSkin.z;
          transformed.y += w * 0.20 * sin(st);
          transformed.z -= w * 0.12 * cos(st);
        }
        vSkin = aSkin; vBody = position;`).replace("#include <project_vertex>",`#include <project_vertex>
        vWPos = (modelMatrix * vec4(transformed, 1.)).xyz;`),r.fragmentShader=r.fragmentShader.replace("#include <common>",`#include <common>
        varying vec4 vSkin; varying vec3 vBody; varying vec3 vWPos;
        uniform vec4 uWater; uniform vec3 uSkinA; uniform vec3 uSkinB; uniform vec3 uMScat; uniform vec3 uMSky;
        ${U}
        float mScale(vec2 uv, out float keel, out float fade){
          vec2 q = uv * 17.; q = vec2(q.x + q.y, q.x - q.y) * 0.7071;
          fade = clamp(1. - 1.5 * length(fwidth(q)), 0., 1.);
          vec2 f = fract(q) - .5;
          keel = (1. - smoothstep(0.03, 0.14, abs(f.x - f.y))) * (1. - smoothstep(0.25, 0.45, abs(f.x + f.y)));
          return smoothstep(0.30, 0.47, max(abs(f.x), abs(f.y)));           // 1 in the seams between scales
        }`).replace("#include <color_fragment>",`#include <color_fragment>
        float mPart = vSkin.y, mRing = vSkin.x, mKeel = 0., mFade = 0.;
        float mIsSkin = (mPart < 0.5 || mPart > 2.5) ? 1. : 0.;
        {
          vec3 b = vBody; float sd = uWater.w;
          float n1 = sFbm(vec2(b.z * 0.9 + sd, mRing * 1.5 + b.y));
          // (polish 4) a lizard's skin, not a panelled hull: soft dark saddles of uneven length and spacing whose ragged edges melt
          // down the flank, a zone of pale rosettes below them, dark speckle running out onto the cream; no ruled bars anywhere
          float n2 = sFbm(vec2(b.z * 2.6 - sd, mRing * 3.3 + b.y * 2.1));
          float onBody = 1. - smoothstep(4.1, 5.3, b.z);
          float tailK = 1. - smoothstep(-4.2, 0.4, b.z);                                         // 1 on the tail: flat-sided, dark almost to its lower edge
          float bz = b.z * 0.60 + (sFbm(vec2(b.z * 0.42 + sd * 2., 3.)) - .5) * 1.7 + 0.10 * mRing * sin(b.z * 1.1 + sd);
          float cell = abs(fract(bz) - 0.5);
          float wid = 0.16 + 0.14 * sVN(vec2(floor(bz) * 7.3 + sd, 1.7));
          float saddle = (1. - smoothstep(wid - 0.17, wid + 0.19, cell + (n2 - 0.5) * 0.46 + (n1 - 0.5) * 0.20)) * onBody;   // soft, torn edges: blotches, never bars
          saddle *= smoothstep(-0.50 - 0.35 * n1, 0.30, mRing + 0.25 * (n2 - 0.5));               // each one narrows and frays down the flank
          float lo = mix(-0.86, -0.95, tailK), hi = mix(-0.44, -0.62, tailK);
          float shade = smoothstep(lo, hi, mRing + (n1 - 0.5) * 0.36 + 0.16 * saddle);
          float fine = sVN(vec2(b.z * 21., mRing * 8. + b.y * 15.));
          vec3 back = uSkinA * (1.00 + 0.26 * n1) * mix(vec3(1.10, 1.04, 0.90), vec3(0.86, 1.0, 1.06), n2);      // slate with an olive cast here, a blue one there
          back = mix(back, uSkinA * 0.56, saddle * 0.50);      // (polish 5: the saddles sit quieter; the scales carry the skin)
          float ros = smoothstep(0.60, 0.78, sVN(vec2(b.z * 4.3 + sd, mRing * 3.4 + b.y * 4.6))) * (1. - smoothstep(-0.05, 0.50, mRing)) * (1. - saddle);
          back = mix(back, uSkinA * 1.75 + uSkinB * 0.10, ros * 0.55);                             // pale rosettes on the flank
          back = mix(back, uSkinA * 1.7 + 0.03, smoothstep(0.82, 0.93, fine) * 0.22);                // fine pale flecks
          vec3 belly = uSkinB * (0.88 + 0.16 * n1);
          belly = mix(belly, back, smoothstep(0.72, 0.90, sVN(vec2(b.z * 7., mRing * 5. + b.y * 7.))) * smoothstep(-0.95, -0.35, mRing) * 0.7);   // dark speckle runs out onto the cream
          vec3 skin = mix(belly, back, shade);
          if (mPart > 2.5) {                                                                       // paddles: the back's slate with pale spots, a pale trailing edge, the underside cream-grey
            vec3 top = uSkinA * (0.80 + 0.5 * n1) * (1. + 0.9 * smoothstep(0.62, 0.80, sVN(b.zx * 6.5 + sd)));
            skin = mix(mix(uSkinB * 0.55, uSkinA, 0.45), top, smoothstep(-0.2, 0.2, mRing));
          }
          float k1, f1, k2, f2;
          float s1 = mScale(b.zy, k1, f1), s2 = mScale(b.zx, k2, f2);
          float topw = smoothstep(0.55, 0.85, abs(mRing));
          float seam = mix(s1, s2, topw); mKeel = mix(k1, k2, topw); mFade = mix(f1, f2, topw);
          skin *= 1. - 0.34 * seam * mFade;
          {
            // (polish 4) a second, coarser grain that still reads from eight metres: rows of scales in a diagonal lattice a hand wide
            float k3, f3, k4, f4;
            float s3 = mScale(b.zy * 0.30 + 0.37, k3, f3), s4 = mScale(b.zx * 0.30 + 0.37, k4, f4);
            skin *= 1. - 0.19 * mix(s3 * f3, s4 * f4, topw) * (0.55 + 0.9 * n2);      // (polish 5: stronger than it was, and uneven, so it is skin and not a net)
            skin *= 1. + 0.12 * mix(k3 * f3, k4 * f4, topw);
          }
          skin *= 1. + 0.22 * mKeel * mFade;
          // the closed, lipped mouth: a dark line from the snout back under the eye, pale lips either side
          float ym = -0.050 - 0.020 * (6. - b.z) - 0.020 * (1. - smoothstep(4.45, 4.80, b.z));
          float my = abs(b.y - ym), onSkull = smoothstep(4.40, 4.50, b.z) * step(mPart, 0.5);
          skin = mix(skin, belly * 0.95, (1. - smoothstep(0.02, 0.075, my)) * onSkull * 0.55);
          skin = mix(skin, vec3(0.012, 0.016, 0.02), (1. - smoothstep(0.005, 0.014, my)) * onSkull * 0.92);
          // nostrils on top of the snout
          float ns = length(vec2(abs(b.x) - 0.065, (b.z - 5.62) * 0.55));
          skin = mix(skin, vec3(0.01), (1. - smoothstep(0.014, 0.026, ns)) * step(0., b.y) * step(mPart, 0.5));
          diffuseColor.rgb *= mix(vec3(1.), skin, mIsSkin); mKeel *= mIsSkin;
        }`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
        roughnessFactor = mix(roughnessFactor, 0.16, mKeel * mFade * 0.7);
        if (mPart > 0.5 && mPart < 1.5) roughnessFactor = 0.05;`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        if (mPart > 1.5 && mPart < 2.5) totalEmissiveRadiance += vec3(1.0, 0.96, 0.88) * 2.2;`).replace("#include <opaque_fragment>",`
        {
          vec3 mVd = normalize(vViewPosition + vec3(0., 0., 1e-5));
          float mNv = clamp(dot(normal, mVd), 0., 1.);
          float mFr = (1. - mNv) * (1. - mNv); mFr = mFr * mFr * (1. - mNv);
          float mUp = 0.5 + 0.5 * dot(normal, normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz));
          outgoingLight += uMSky * (0.030 + 0.36 * mFr) * (0.25 + 0.75 * mUp) * (1. + 0.5 * uWater.y) * step(mPart, 0.5 + 2.5 * step(2.5, mPart));
          outgoingLight += diffuseColor.rgb * (uMSky * 0.36 + vec3(0.10, 0.10, 0.085)) * mUp;            // sky fill, so the shaded flank is blue, not black
          outgoingLight += diffuseColor.rgb * uMScat * 0.85 * (1. - mUp) * (1. - mUp);   // (polish 4) the lit sea throws turquoise up under the flank: a round body, not a slab
        }
        float mDepth = max(uWater.x - vWPos.y, 0.);
        // the waterline: a bright wet line where the skin cuts the surface
        outgoingLight += (uMSky * 0.05 + vec3(0.008)) * (1. - smoothstep(0.0, 0.035, abs(vWPos.y - uWater.x - 0.02 - 0.03 * sin(vBody.z * 2.3 + uWater.z * 1.9)))) * smoothstep(0.42, 0.72, sVN(vBody.zy * 2.3 + uWater.z * 0.7));   // (polish 4) a broken thread of bright water lapping along her
        {
          // wet skin: the top of the back mirrors the bright sky in a broken highlight along the spine
          float mUp2 = clamp(dot(normal, normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz)), 0., 1.);
          // (polish 3) a fine broken glitter along the spine and on every keel, not broad pale patches (they read as a whale's blotches)
          float mU4 = mUp2 * mUp2 * mUp2 * mUp2;
          float wetHi = mU4 * mU4 * smoothstep(0.50, 0.85, sFbm(vec2(vBody.z * 5.1 + vBody.x * 4.1, vBody.x * 9.3 - vBody.z * 3.9) + uWater.z * 0.2));
          outgoingLight += (uMSky * 0.34 + vec3(0.09)) * wetHi * step(uWater.x, vWPos.y) * step(mPart, 0.5);
          if (mPart > 2.5 || vBody.z < -4.7) outgoingLight += (uMSky * 0.30 + vec3(0.05)) * step(uWater.x, vWPos.y) * (0.45 + 0.55 * sVN(vBody.zy * 5.));    // a wet fin or tail lobe above the water carries the sky: slate, never a black wedge
        }
        if (mDepth > 0.) {
          vec3 mv = cameraPosition - vWPos;
          float mvy = mv.y / max(length(mv), 1e-3);
          float mPath = mDepth * (1.3 + 1.5 / max(mvy, 0.16));
          float mCa = sCaus(vWPos.xz * 1.7, uWater.z) * exp(-mDepth * 0.16) * clamp(mRing * 1.5 + 0.35, 0., 1.) * smoothstep(0.0, 0.45, mDepth);   // (none right at the waterline: it drew a ruled bright line along her)
          outgoingLight *= mix(1., 0.82, smoothstep(0.0, 0.45, mDepth)) + 1.9 * mCa;                              // (polish 4) the Sun's net of light plays over her back and tail: she is IN the water
          outgoingLight = outgoingLight * exp(-mPath * vec3(0.12, 0.034, 0.040)) + uMScat * (0.30 + 0.20 * uWater.y) * (1. - exp(-mPath * 0.019));   // (polish 5: clearer water over her: the sunk tail and far flank stay a dark solid animal, they were a pale ghost)   // (polish 3: denser, so the sunk tail and far flank are soft shapes in the green, never hard slabs)
        }
        #include <opaque_fragment>`)},i.customProgramCacheKey=()=>"crescent-mosasaur",{mat:i,uniforms:n}}function ce(t,e,o,a){const n=new s.InstancedBufferGeometry;n.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),n.setIndex([0,1,2,0,2,3]);const i=new Float32Array(e*4);for(let l=0;l<e;l++)i[l*4]=t.range(-1,1),i[l*4+1]=t.range(.25,1),i[l*4+2]=t.range(-.5,1),i[l*4+3]=t();n.setAttribute("aSeed",new s.InstancedBufferAttribute(i,4)),n.instanceCount=e;const r={...s.UniformsUtils.clone(s.UniformsLib.fog),uPuff:{value:new s.Vector4(0,.2,5.62,0)},uPuffLook:{value:new s.Vector4(1.2,2.6,0,0)},uPSun:{value:o},uPHot:{value:a}},h=new s.ShaderMaterial({uniforms:r,fog:!0,transparent:!0,depthWrite:!1,blending:s.CustomBlending,blendEquation:s.AddEquation,blendSrc:s.OneFactor,blendDst:s.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 aSeed; uniform vec4 uPuff; uniform vec4 uPuffLook;
      varying vec2 vUv; varying float vA; varying float vS;
      #include <fog_pars_vertex>
      void main(){
        float age = clamp(uPuff.w * 1.35 - aSeed.w * 0.35, 0., 1.);
        float out1 = 1. - exp(-age * 5.);
        vec3 dir = vec3(aSeed.x * 1.55, aSeed.y * (0.50 + 0.50 * aSeed.w), 0.15 + aSeed.z * 1.25);       // (polish 3) a low wide bush: wider than it is high
        vec3 c = uPuff.xyz + dir * out1 * uPuffLook.x * 0.8 + vec3(aSeed.x * 0.25, 0.10 - 0.25 * age, -uPuffLook.y) * age;
        float size = (0.08 + 0.50 * age) * (0.5 + 0.9 * aSeed.w);
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
        mvPosition.xy += position.xy * size;
        gl_Position = projectionMatrix * mvPosition;
        vUv = position.xy; vS = aSeed.w * 37.;
        vA = smoothstep(0., 0.07, age) * (1. - smoothstep(0.45, 1., age)) * step(0.0001, uPuff.w);
        #include <fog_vertex>
      }`,fragmentShader:`
      precision highp float;
      uniform vec4 uPuffLook; uniform vec3 uPSun; uniform vec3 uPHot;
      varying vec2 vUv; varying float vA; varying float vS;
      ${U}
      #include <fog_pars_fragment>
      void main(){
        float r2 = dot(vUv, vUv);
        float a = exp(-r2 * 3.2) * smoothstep(0.15, 0.85, sVN(vUv * 2.3 + vS) + 0.4 * sVN(vUv * 5.1 - vS)) * (1. - smoothstep(0.7, 1., r2)) * clamp(vA, 0., 1.) * 0.13;
        // ragged veils, each its own tone: sunlit cream by turns with blue-grey shade, so the bush has depth and never clips to a white ball
        vec3 col = (uPSun * 0.75 + vec3(0.60, 0.66, 0.70) + uPHot * 0.45 * uPuffLook.z) * (0.85 + 0.2 * vUv.y) * mix(vec3(0.50, 0.60, 0.68), vec3(1.02, 1.0, 0.95), fract(vS * 0.61));
        gl_FragColor = vec4(col * a, a);
        #include <fog_fragment>
      }`}),f=new s.Mesh(n,h);return f.name="mosasaurBreath",f.frustumCulled=!1,f.renderOrder=3,{mesh:f,uniforms:r}}async function me(t,e={}){const o=e.rng??t.rng.fork("mosasaur"),a=e.palette&&e.palette.length>=7?e.palette:j,n=await ie(o,P(e.detail??1,.6,1),()=>t.yield());await t.yield();const{mat:i,uniforms:r}=le(o,a,e),h=new s.Mesh(n,i);h.name="mosasaur",h.frustumCulled=!1;const f=ce(o,Math.round(150*P(e.detail??1,.6,1)),new s.Color(e.sunColor??"#FFE7B0"),new s.Color(a[6])),l=new s.Group;l.name="mosasaurus",l.rotation.order="YXZ";const c=(e.length??o.range(11.2,12.8))/12;l.scale.setScalar(c);const m=e.tailSweep??o.range(1,1.3);l.add(h,f.mesh);const u={x:0,z:0,heading:0,surfaced:0,breath:0,dive:0},S=new s.Vector3;return{object:l,body:h,breath:f.mesh,uniforms:r,pose:u,length:12*c,setPose(k,d,x,M,w=0,p=0){u.x=k,u.z=d,u.heading=x,u.surfaced=P(M,0,1),u.breath=P(w,0,1),u.dive=P(p,0,1)},update(k,d,x=0){const M=u.surfaced,w=M*M*(3-2*M);l.position.set(u.x,Y(-3.4,-.07,w)*c,u.z),l.rotation.set(-(4.6*A)*w+9*A*u.dive+.012*Math.sin(d*1.26),u.heading,.035*Math.sin(d*2.513+.6)),r.uSwim.value.set(d*2.513%6283.185,m,d*.95%6283.185,0),l.updateWorldMatrix(!0,!1);const p=l.parent;S.set(0,0,0),p&&p.localToWorld(S),r.uWater.value.x=S.y,r.uWater.value.y=x,r.uWater.value.z=d%1e3,f.uniforms.uPuff.value.w=u.breath,f.uniforms.uPuffLook.value.z=x}}}export{j as DEFAULT_PALETTE,G as SEA_GLSL,W as STRANGER_GLSL,N as STRANGER_UNIFORMS_GLSL,U as S_NOISE_GLSL,ue as buildHero,me as buildMosasaur,ae as mosasaurAt,O as strangerAt};
