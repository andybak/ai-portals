import*as r from"three";import{makePath as jt,clamp as de,lerp as J,smoothstep as G}from"../kit/core.js";import*as me from"../kit/fx.js";import{buildHero as qt,stationKit as u,makeBeacons as Qt}from"../parts/orbit-dawn.js";const j=Math.PI*2,N=Math.PI/180,a=(o,e,n)=>new r.Vector3(o,e,n),wt=["#000003","#0a1a44","#3fa0ff","#ffe9c4","#c8ccd4","#1a1d24","#ffb040"],te=6e3,Xe=40,xt=5,yt=[[0,-31],[.3,-31],[.42,-23.6],[.47,-20.5],[.5,-18.9],[.6,-8.5],[.72,0],[1,0]],bt=`
varying vec3 vW;
void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,Mt=`
uniform vec3 uSun; uniform vec3 uBlue;
vec3 warmAir(float mu) { return mix(vec3(1.0, 0.1, 0.02), vec3(1.0, 0.56, 0.16), smoothstep(-0.1, 0.02, mu)); }
float twilight(float mu) { float x = (mu + 0.03) / 0.085; return exp(-x * x); }
`,Kt=`
uniform vec3 uC; uniform sampler2D uTex; uniform vec3 uAxis; uniform vec3 uAxU; uniform vec3 uAxV; uniform vec2 uSpin;
uniform float uTime; uniform vec2 uOff; uniform vec3 uCity; uniform float uCloud; uniform float uPop; uniform float uStorm; uniform float uLand;
uniform float uLift; uniform vec2 uSunT; uniform float uDawn;      // day-side lift of the sun's height (0 by night), sun heading in ground-track coordinates
varying vec3 vW;
${me.GLSL_HASH}${Mt}
// The lowest octaves are magnified a long way (20 m and more to the texel): bend the lookup so texels blend with a
// smooth curve instead of straight bilinear facets, which showed as blocky coasts and cloud edges.
// (Only where a texel really is magnified: the bend fades out as texels shrink toward a pixel across the short axis.)
vec4 texS(vec2 uv) {
  vec2 x = uv * 384.0 + 0.5; vec2 i = floor(x), f = x - i;
  float k = clamp(1.6 - 2.4 * min(length(dFdx(x)), length(dFdy(x))), 0.0, 1.0);
  f = mix(f, f * f * (3.0 - 2.0 * f), k);
  return texture2D(uTex, (i + f - 0.5) / 384.0);
}
// A low-pass lookup (mip 3, 48 texels to the tile, smooth between them) for the field that warps the clouds: warping by
// the full-detail field multiplies its texel facets into blocks.
vec4 texL(vec2 uv) { vec2 x = uv * 48.0 + 0.5; vec2 i = floor(x), f = x - i; f = f * f * (3.0 - 2.0 * f); return texture2D(uTex, (i + f - 0.5) / 48.0, 3.0); }
// cloud thickness at a point of the cloud layer's ground-track coordinates
float cloudAt(vec2 pc) {
  float cw = texL(pc * 0.08 + 0.6).g;
  return 0.5 * texS(pc * 0.12 + (cw - 0.5) * 0.3).r + 0.27 * texS(pc.yx * 0.5 + cw * 0.6 + uTime * 0.003).g + 0.14 * texture2D(uTex, pc * 2.3 - uTime * 0.006).r
    + 0.09 * texture2D(uTex, pc.yx * 9.1 + cw * 2.0 + uTime * 0.009).r;
}
void main() {
  vec3 n = normalize(vW - uC);
  vec3 toCam = cameraPosition - vW; float dist = length(toCam); vec3 V = toCam / max(dist, 1e-3);
  float mu = dot(n, uSun);
  // Once the sun is up the station is over the morning side: the ground below is lit as if the sun stood higher than
  // the grazing light the geometry alone gives (uLift), so cloud reads white and the sea blue instead of dusk brown.
  float muS = mu + uLift;
  float day = smoothstep(-0.07, 0.2, muS);
  // ground-track coordinates in km: x along the track (the Earth turns in x), y across it. All noise comes from one
  // baked tiling texture (r, g: fbm; b: ridged webs; a: fine grain), which is far cheaper than procedural noise here.
  float lat = asin(clamp(dot(n, uAxis), -1.0, 1.0)), lon = atan(dot(n, uAxV), dot(n, uAxU));
  vec2 p = vec2(lon - uSpin.x, lat) * 6.0 + uOff;
  float hd = texture2D(uTex, p * 1.7).r;
  float h = 0.6 * texS(p * 0.105).r + 0.28 * texS(p.yx * 0.43 + 0.21).g + 0.12 * hd + 0.045 * (texture2D(uTex, p * 6.3 + 0.4).g - 0.5);
  float land = smoothstep(uLand, uLand + 0.022, h);
  vec2 pc = vec2(lon - uSpin.y, lat) * 6.0 + uOff.yx;
  float cl = cloudAt(pc);
  float cloud = smoothstep(uCloud, uCloud + 0.1, cl);
  vec3 col = vec3(0.0);
  if (day < 0.995) {                                  // night side: moonlit cloud tops, city webs, storm lightning
    vec3 night = vec3(0.008, 0.014, 0.035) + vec3(0.045, 0.063, 0.11) * cloud * (0.4 + cl) + vec3(0.0, 0.006, 0.014) * land;
    // cities: clusters of points (two sizes of grain) strung on fine road webs; no filled glow under them
    float pop = (smoothstep(0.42, 0.7, texture2D(uTex, p * 0.31 + 0.7).g) + 0.15 * (1.0 - smoothstep(0.0, 0.035, abs(h - uLand - 0.012)))) * uPop;
    float web1 = texture2D(uTex, p * 1.6 + 0.11).b, web2 = texture2D(uTex, p.yx * 5.0 + 0.37).b;      // trunk roads, streets
    float hub = smoothstep(0.5, 0.85, hd);
    float spark = smoothstep(0.6, 0.9, texture2D(uTex, p * 4.3).a) + 0.7 * smoothstep(0.62, 0.92, texture2D(uTex, p.yx * 1.3 + 0.5).a);
    float graze = mix(0.35, 1.0, smoothstep(0.08, 0.45, dot(n, V)));
    float lights = land * pop * (0.1 * web1 + 0.16 * web2 * (0.35 + hub) + hub * 1.9 * spark + 0.45 * spark) * graze;      // the sparks carry the light; the roads only string them
    night += uCity * lights * 2.9 * (1.0 - cloud * 0.6) * (1.0 - smoothstep(-0.1, -0.015, mu));      // the cities switch off at dawn
    vec2 lc = floor(pc * 2.2); float lr = hash12(lc); float ph = uTime * 0.8 + lr * 17.0;
    float lx = fract(ph), ld = max(0.0, 1.0 - lx * 3.0);                         // one eased flash: 0.1 s up, 0.3 s down
    float fl = step(1.0 - 0.16 * uStorm, hash12(lc + floor(ph) * 0.37)) * smoothstep(0.0, 0.08, lx) * ld * ld * 0.9;
    vec2 lf = fract(pc * 2.2) - 0.5;
    night += vec3(0.5, 0.62, 1.0) * fl * exp(-dot(lf, lf) * 10.0) * smoothstep(0.2, 0.75, cloud) * 1.6;
    col = night * (1.0 - day);
  }
  if (day > 0.005) {                                  // day side
    vec3 sunC = mix(vec3(0.8, 0.52, 0.45), vec3(1.0, 0.95, 0.88), smoothstep(0.0, 0.3, muS)) * 2.3;      // low sun on the ground: dusty rose, not red (the clouds carry the gold)
    vec3 ocean = mix(vec3(0.011, 0.045, 0.16), vec3(0.025, 0.13, 0.3), smoothstep(uLand - 0.12, uLand, h));
    ocean = mix(ocean, vec3(0.03, 0.27, 0.34), 0.62 * smoothstep(uLand - 0.035, uLand, h));          // turquoise shallows along every coast
    vec3 landc = mix(vec3(0.1, 0.21, 0.065), vec3(0.45, 0.35, 0.19), smoothstep(uLand + 0.02, uLand + 0.16, h + (hd - 0.5) * 0.1));
    landc = mix(landc, vec3(0.62), smoothstep(uLand + 0.2, uLand + 0.28, h));
    vec3 surf = mix(ocean, landc, land);
    float dif = max(muS, 0.0) + 0.05;
    vec3 lit = surf * sunC * dif;
    // the sun's path on the sea: a faint sheen and a tight core, both broken into moving glitter; cloud hides it
    vec3 H = normalize(uSun + V);
    float ndh = max(dot(n, H), 0.0);
    float gl = 0.1 * pow(ndh, 90.0) + 1.3 * pow(ndh, 900.0);
    float sp = smoothstep(0.24, 0.42, texture2D(uTex, p * 2.1 + vec2(uTime * 0.021, 0.0)).a * texture2D(uTex, p.yx * 2.7 - vec2(0.0, uTime * 0.027)).a) * (0.4 + 1.2 * hd);
    lit += sunC * gl * sp * (1.0 - land) * (1.0 - cloud);
    // cloud: white tops, shaded where the cloud toward the sun is thicker, and a shadow laid on the ground behind it
    float clS = cloudAt(pc + uSunT * 0.05);
    float shadowCloud = smoothstep(uCloud, uCloud + 0.1, clS);
    lit *= 1.0 - 0.45 * shadowCloud;
    float shade = (0.5 + 0.5 * smoothstep(0.0, 0.25, cl - uCloud)) * (1.0 - 0.3 * smoothstep(0.0, 0.09, clS - cl));
    vec3 sunCc = mix(vec3(1.0, 0.6, 0.35), vec3(1.0, 0.97, 0.93), smoothstep(-0.02, 0.12, muS)) * 2.3;
    vec3 cc = sunCc * (max(muS + 0.04, 0.0) + 0.12) * shade;
    lit = mix(lit, cc, cloud);
    lit = mix(lit, uBlue * sunC * dif * 0.42, 0.16);                             // air over everything
    col += lit * day;
  }
  // air seen edge-on toward the limb: a deep blue haze band by day, red-gold on the terminator
  float ndv = 1.0 - max(dot(n, V), 0.0);
  float rim = pow(ndv, 6.0), rimD = ndv * ndv * ndv * ndv * ndv;
  col += uBlue * rimD * smoothstep(-0.1, 0.16, mu) * 1.05 + warmAir(mu) * rim * twilight(mu) * 1.3 * (1.0 - 0.75 * uDawn);      // once the sun is up the red haze leaves the ground
  col += uBlue * rim * 0.09;
  gl_FragColor = vec4(col, 1.0);
}`,Nt=`
uniform vec3 uC; uniform mat3 uM; uniform float uTime; uniform float uR; uniform float uH;
uniform vec3 uPole; uniform vec3 uPoleA; uniform vec3 uPoleB; uniform vec4 uOval;   // radius rad, width rad, strength, second arc
uniform vec3 uAurLow; uniform vec3 uAurHigh; uniform float uGlow; uniform sampler2D uTex;
uniform float uArc; uniform float uHk; uniform float uAk;      // sunrise arc 0..1, limb thickness and aurora height multipliers
varying vec3 vW;
${Mt}
// One horizontal slice of the curtains at relative height f (0 foot .. 1 top). The sheet is a thin bright core with a
// soft apron, it spreads as it climbs, and its rays are stripes in azimuth only, so they stand upright through the
// slices. Azimuth frequencies are whole numbers of turns: no seam.
float curtain(vec3 q, float f) {
  float ang = acos(clamp(dot(q, uPole), -1.0, 1.0));
  if (abs(ang - uOval.x + uOval.y * 2.0) > 0.075 + uOval.y * 9.0) return 0.0;     // nowhere near the oval: skip the noise
  float az = atan(dot(q, uPoleB), dot(q, uPoleA)) * 0.15915494;
  float wob = (texture2D(uTex, vec2(az * 3.0, uTime * 0.004)).r - 0.5) * 0.042 + (texture2D(uTex, vec2(az * 17.0 + 0.3, 0.5 - uTime * 0.007)).g - 0.5) * 0.013;
  float wd = uOval.y * (1.0 + 1.4 * f);
  float d = (ang - uOval.x - wob) / wd;
  float d2 = (ang - uOval.x - wob * 1.6 + uOval.y * 4.4) / (wd * 0.8);
  float band = exp(-d * d) + 0.15 * exp(-abs(d) * 0.75) + uOval.w * (exp(-d2 * d2) + 0.1 * exp(-abs(d2) * 0.8));
  if (band < 0.004) return 0.0;
  float ray = texture2D(uTex, vec2(az * 37.0 + uTime * 0.011, 0.37 + uTime * 0.0025)).a;
  float fold = texture2D(uTex, vec2(az * 8.0 - uTime * 0.006, 0.71)).g;
  return band * (0.28 + 1.15 * ray * (0.4 + 0.9 * fold)) * (0.86 + 0.14 * sin(uTime * 1.6 + az * 188.5));
}
void main() {
  vec3 oc = cameraPosition - uC; vec3 rd = normalize(vW - cameraPosition);
  float tca = -dot(oc, rd); float b2 = dot(oc, oc) - tca * tca; float b = sqrt(max(b2, 0.0));
  vec3 col = vec3(0.0);
  if (b > uR) {                                       // the ray misses the ground: limb glow
    float a = (b - uR) / (uH * uHk);
    vec3 nl = (oc + rd * tca) / b; float mu = dot(nl, uSun);
    float dens = exp(-a * mix(2.1, 1.45, uArc)), low = exp(-a * 6.5);
    float dayB = smoothstep(-0.13, 0.1, mu + a * 0.03);
    float fs = pow(max(dot(rd, uSun), 0.0), 10.0);
    // The sunrise arc. fa = how nearly this stretch of limb lies in the sun's compass direction. The lowest air burns:
    // white under the sun, gold to either side, red where it runs out along the limb; the blue stands above it.
    vec3 up = oc / max(length(oc), 1.0); vec3 rh = rd - up * dot(rd, up); vec3 sh = uSun - up * dot(uSun, up);
    float fa = max(dot(rh, sh) / max(length(rh) * length(sh), 1e-4), 0.0);
    float fa2 = fa * fa, fa4 = fa2 * fa2, fa16 = fa4 * fa4 * fa4 * fa4;
    float warmK = uArc * smoothstep(-0.07, 0.02, mu);
    float base = exp(-a * 3.0) * fa2 * warmK * (1.0 - 0.7 * smoothstep(0.12, 0.3, mu));      // the warm layer fades as morning comes on
    col += uBlue * dens * dayB * 1.25 * (1.0 + 1.2 * fs) * (1.0 - 0.8 * base);
    col += warmAir(mu) * low * twilight(mu) * 3.2 * (1.0 + 2.5 * fs);
    col += vec3(1.0, 0.9, 0.78) * low * smoothstep(-0.02, 0.2, mu) * 0.8 * (1.0 + 1.5 * fs) * (1.0 - 0.8 * base);
    col += uBlue * dens * smoothstep(-0.6, -0.08, mu) * (1.0 - dayB) * 1.3;       // pre-dawn blue
    float ag = (a - 0.95) / 0.2; col += vec3(0.05, 0.13, 0.08) * exp(-ag * ag) * (1.0 - dayB) * 2.4;   // airglow line
    vec3 hot = mix(vec3(1.0, 0.12, 0.03), vec3(1.0, 0.56, 0.16), smoothstep(0.55, 0.9, fa));
    col += hot * base * 2.6;
    col += vec3(1.0, 0.93, 0.8) * exp(-a * 2.0) * 2.2 * fa16 * warmK * smoothstep(0.0, 0.15, mu);
    col *= uGlow * (1.0 - smoothstep(0.72, 1.0, (b - uR) / (uH * ${xt.toFixed(1)})));      // nothing left where the shell ends
  }
  if (uOval.z > 0.0) {                                // aurora: five slices of curtain between 0.6 and 2.3 scale heights
    for (int i = 0; i < 5; i++) {
      float f = float(i) * 0.25; float rr = uR + uH * uAk * (0.6 + 1.7 * f);
      float disc = rr * rr - b2;
      if (disc > 0.0) {
        float t = tca - sqrt(disc);
        if (t > 0.0) {
          vec3 nn = (oc + rd * t) / rr;
          float nightK = 1.0 - smoothstep(-0.2, 0.02, dot(nn, uSun));
          if (nightK > 0.01) col += mix(uAurLow, uAurHigh * 0.7, f * f) * curtain(uM * nn, f) * nightK * uOval.z * exp(-1.5 * f) * 0.56;   // bright foot, fading upward
        }
      }
    }
  }
  gl_FragColor = vec4(col, 1.0);
}`,Yt=`
attribute float aSize;
uniform float uPx; uniform float uTime; uniform vec2 uRot;
varying vec3 vC;
void main() {
  vec3 p = position; p.yz = vec2(uRot.x * p.y - uRot.y * p.z, uRot.y * p.y + uRot.x * p.z);      // the sky wheels up as the station rounds the Earth
  gl_Position = projectionMatrix * viewMatrix * vec4(cameraPosition + p * 8800.0, 1.0);
  gl_PointSize = max(aSize * uPx, 1.5);
  vC = color * (aSize > 8.0 ? 1.0 : 0.9 + 0.1 * sin(uTime * (1.5 + aSize * 2.3) + position.x * 90.0));
}`,Xt=`
varying vec3 vC;
void main() { vec2 q = gl_PointCoord * 2.0 - 1.0; float d = dot(q, q); gl_FragColor = vec4(vC * exp(-d * 3.2) * (1.0 - smoothstep(0.7, 1.0, d)), 1.0); }`,zt=`
uniform vec3 uDir; uniform float uDist; uniform float uHalf; varying vec2 vQ;
void main() { vQ = position.xy; vec4 mv = viewMatrix * vec4(cameraPosition + uDir * uDist, 1.0); mv.xy += position.xy * uHalf; gl_Position = projectionMatrix * mv; }`,$t=`
uniform vec3 uColor; uniform vec3 uP; uniform float uTime;       // uP: disc radius (fraction of the quad), disc radiance, glow
varying vec2 vQ;
void main() {
  float r = length(vQ), x = r / uP.x;
  float disc = (1.0 - smoothstep(0.92, 1.06, x)) * (0.6 + 0.4 * sqrt(max(1.0 - x * x, 0.0)));
  float w = max(1.0 - r, 0.0), w3 = w * w * w;
  // halo: every term carries w^2 or more, so it is exactly zero (with zero slope) at the edge of the quad
  float glow = exp(-max(x - 1.0, 0.0) / 0.9) * 1.5 * w + 0.4 * w3 / (0.05 + 14.0 * r) + 0.7 * w3 + 0.55 * exp(-r * 7.0) * w * w;
  // rays: six fine spikes and a fainter, slowly breathing set between them
  float an = atan(vQ.y, vQ.x);
  float ray = pow(abs(cos(an * 3.0 + 0.35)), 46.0) + 0.3 * pow(abs(cos(an * 6.0 + 1.2)), 24.0) * (0.75 + 0.25 * sin(uTime * 0.9 + an * 4.0))
    + 0.12 * (0.5 + 0.5 * sin(an * 23.0 + uTime * 0.6)) * (0.5 + 0.5 * sin(an * 9.0 - uTime * 0.43));
  glow += ray * (1.1 * exp(-r * 5.5) + 0.12) * w3 * smoothstep(0.6, 2.2, x);
  // Capped just under the bloom threshold (with the flare's streak on top): the post bloom blurs with truncated kernels,
  // and a source as hot and small as the sun came back as a grey disc with a hard, lumpy edge. The halo is all drawn here.
  gl_FragColor = vec4(min(uColor * (disc * uP.y + glow * uP.z * w), vec3(1.1)), 1.0);
}`,Zt=`
uniform vec3 uPos; uniform float uHalf; varying vec2 vQ;
void main() { vQ = position.xy; vec4 mv = viewMatrix * vec4(uPos, 1.0); mv.xy += position.xy * uHalf; gl_Position = projectionMatrix * mv; }`,Jt=`
uniform vec3 uColor; uniform float uI; uniform float uR0; uniform float uTime; varying vec2 vQ;
void main() {
  float r = length(vQ), w = max(1.0 - r, 0.0), x = max(r - uR0, 0.0), an = atan(vQ.y, vQ.x), t = uTime;
  float s1 = 0.5 + 0.5 * sin(an * 5.0 + 0.7 * sin(t * 0.31) + 1.0);
  float s2 = 0.5 + 0.5 * sin(an * 13.0 - t * 0.37 + 2.0 * sin(an * 3.0 + t * 0.17));
  float s3 = 0.5 + 0.5 * sin(an * 31.0 + t * 0.8 + 3.0 * sin(an * 4.0 - t * 0.23));
  float ray = s1 * s1 * s1 * 0.75 + s2 * s2 * 0.4 + s3 * 0.2;
  float glow = exp(-x * 8.0) * (0.4 + 0.95 * ray) + 0.6 * exp(-x * 20.0);
  gl_FragColor = vec4(uColor * 0.62 * (1.0 - exp(-glow * uI * w * w * 1.7)), 1.0);      // saturates softly below the bloom threshold (see SUN_FRAG)
}`,ea=`
uniform vec3 uL; uniform sampler2D uTex; varying vec2 vQ;
void main() {
  float r2 = dot(vQ, vQ); if (r2 > 1.0) discard;
  vec3 n = vec3(vQ, sqrt(1.0 - r2));
  float lit = smoothstep(-0.03, 0.14, dot(n, uL));
  float m = texture2D(uTex, vQ * 0.19 + 0.3).r * 0.7 + texture2D(uTex, vQ * 0.8).g * 0.3;
  vec3 alb = mix(vec3(0.42, 0.42, 0.44), vec3(0.95, 0.93, 0.88), smoothstep(0.35, 0.62, m));
  gl_FragColor = vec4(alb * (lit * 0.82 * (0.7 + 0.3 * n.z) + 0.012), 1.0);
}`;function ta(o,e){const n=[],i=[],t=[],m=a(),y=a(),C=a(),f=new r.Color;y.set(1,0,0).addScaledVector(e,-e.x).normalize(),C.crossVectors(e,y);const b=["#ffffff","#cfdcff","#aac4ff","#fff1d8","#ffd9a8","#ffc08a"],d=(p,S,v,z)=>{f.set(z),n.push(p.x,p.y,p.z),i.push(f.r*S,f.g*S,f.b*S),t.push(v)};for(let p=0;p<2600;p++){const S=o.range(-1,1),v=o()*j,z=Math.sqrt(1-S*S);m.set(z*Math.cos(v),S,z*Math.sin(v));const H=Math.pow(o(),7);d(m,.16+3.6*H,1.5+1.6*H,o.pick(b))}const M=o()*j,x=p=>{const S=o()*j,v=o.gauss()*p,z=Math.cos(v);return m.copy(y).multiplyScalar(Math.cos(S)*z).addScaledVector(C,Math.sin(S)*z).addScaledVector(e,Math.sin(v)),Math.cos(S-M)*.5+.5};for(let p=0;p<5200;p++){const S=x(.13);o()>.35+.65*S||d(m,o.range(.1,.42),1.5,o.pick(b))}for(let p=0;p<220;p++){const S=x(.06);o()>.25+.75*S||d(m,o.range(.005,.009)*(.5+1.1*S),o.range(40,95),S>.75?"#e6dccf":"#aab8e8")}const k=new r.BufferGeometry;k.setAttribute("position",new r.Float32BufferAttribute(n,3)),k.setAttribute("color",new r.Float32BufferAttribute(i,3)),k.setAttribute("aSize",new r.Float32BufferAttribute(t,1));const V={uPx:{value:1},uTime:{value:0},uRot:{value:new r.Vector2(1,0)}},D=new r.Points(k,new r.ShaderMaterial({uniforms:V,vertexShader:Yt,fragmentShader:Xt,vertexColors:!0,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending}));return D.frustumCulled=!1,D.renderOrder=-1,D.name="stars",{object:D,uniforms:V}}function At(o,e,n){const i=new r.Mesh(new r.PlaneGeometry(2,2),new r.ShaderMaterial(n?{uniforms:e,vertexShader:zt,fragmentShader:o}:{uniforms:e,vertexShader:zt,fragmentShader:o,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending}));return i.frustumCulled=!1,i}const aa=`
uniform vec3 uC; uniform float uTime; uniform float uR; uniform float uH;
attribute vec3 aDir; attribute vec3 aVel; attribute vec4 aParam;      // period, phase, track length (rad), brightness
varying vec2 vUv; varying float vI;
${me.GLSL_HASH}
void main() {
  vUv = uv;
  float cyc = uTime / aParam.x + aParam.y, k = floor(cyc);
  float s = fract(cyc) * aParam.x / 1.3;
  float ra = hash12(vec2(k, aParam.y * 91.0)) * 6.2831853; float cr = cos(ra), sr = sin(ra);
  mat3 rot = mat3(cr, 0.0, -sr, 0.0, 1.0, 0.0, sr, 0.0, cr);
  vec3 d0 = rot * aDir, vel = rot * aVel;
  float sc = clamp(s, 0.0, 1.0);
  float tail = aParam.z * 0.55 * sin(3.14159265 * sc);
  float along = aParam.z * sc - (1.0 - uv.y) * tail;
  vec3 pw = uC + normalize(d0 + vel * along) * (uR + uH * (2.6 - 1.5 * sc));
  vec4 mv = viewMatrix * vec4(pw, 1.0);
  vec3 axv = normalize(mat3(viewMatrix) * vel);
  vec3 side = normalize(cross(axv, normalize(mv.xyz)));
  mv.xyz += side * position.x * max(1.6, -mv.z * 0.0022) * (0.35 + 0.65 * uv.y);
  vI = pow(sin(3.14159265 * sc), 0.6) * aParam.w;
  gl_Position = projectionMatrix * mv;
  if (s > 1.0 || vI < 0.003) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,oa=`
varying vec2 vUv; varying float vI;
void main() {
  float x = vUv.x * 2.0 - 1.0, y = vUv.y;
  float a = exp(-x * x * 6.0) * pow(y, 2.4) + exp(-(1.0 - y) * (1.0 - y) * 700.0 - x * x * 3.0) * 2.4;
  gl_FragColor = vec4(mix(vec3(1.0, 0.55, 0.2), vec3(0.85, 1.0, 0.95), pow(y, 2.5)) * a * vI * 3.2, 1.0);
}`;function na(o,e){if(e<=o[0][0])return o[0][1];for(let n=1;n<o.length;n++)if(e<=o[n][0]){const i=o[n-1],t=o[n];return J(i[1],t[1],(e-i[0])/(t[0]-i[0]))}return o[o.length-1][1]}const sa=o=>{const e=Math.sin(o*127.1+311.7)*43758.5453;return e-Math.floor(e)};function $e(o,e,n,i=.42){const t=o*e+n*7.3,m=Math.floor(t);return sa(m+n*31.7)<i?t-m:-1}async function ra(o,e,n=384){const i=D=>{const p=new Float32Array(D*D);for(let S=0;S<p.length;S++)p[S]=o();return p},t=(D,p,S,v)=>{const z=Math.floor(S),H=Math.floor(v);let L=S-z,I=v-H;L=L*L*(3-2*L),I=I*I*(3-2*I);const g=z%p,h=(z+1)%p,P=H%p*p,R=(H+1)%p*p;return(D[P+g]*(1-L)+D[P+h]*L)*(1-I)+(D[R+g]*(1-L)+D[R+h]*L)*I},m=[4,8,16,32,64],y=m.map(i),C=m.map(i),f=[i(8),i(16)],b=[i(64),i(128)];await e();const d=new Float32Array(n*n*4),M=[9,9,9,9],x=[-9,-9,-9,-9];for(let D=0,p=0;D<n;D++){D%24===0&&D>0&&await e();for(let S=0;S<n;S++,p+=4){const v=S/n,z=D/n;let H=0,L=0,I=.5;for(let h=0;h<5;h++)H+=I*t(y[h],m[h],v*m[h],z*m[h]),h<4&&(L+=I*t(C[h],m[h],v*m[h],z*m[h])),I*=.5;const g=.65*t(f[0],8,v*8,z*8)+.35*t(f[1],16,v*16,z*16);d[p]=H,d[p+1]=L,d[p+2]=Math.pow(Math.max(0,1-Math.abs(g-.5)*45),1.5),d[p+3]=.6*t(b[0],64,v*64,z*64)+.4*t(b[1],128,v*128,z*128);for(let h=0;h<4;h++)d[p+h]<M[h]&&(M[h]=d[p+h]),d[p+h]>x[h]&&(x[h]=d[p+h])}}await e();const k=new Uint8Array(n*n*4);for(let D=0;D<k.length;D++){const p=D&3;k[D]=Math.round(255*(d[D]-M[p])/(x[p]-M[p]))}await e();const V=new r.DataTexture(k,n,n,r.RGBAFormat);return V.wrapS=V.wrapT=r.RepeatWrapping,V.magFilter=r.LinearFilter,V.minFilter=r.LinearMipmapLinearFilter,V.generateMipmaps=!0,V.anisotropy=8,V.colorSpace=r.NoColorSpace,V.needsUpdate=!0,V}function St(o,e,n,i){const t=new Float32Array((n+1)*(i+1)*3),m=[];let y=0;for(let f=0;f<=n;f++){const b=e*Math.pow(f/n,.85),d=Math.sin(b),M=Math.cos(b);for(let x=0;x<=i;x++){const k=x/i*j;t[y++]=o*d*Math.cos(k),t[y++]=o*M,t[y++]=o*d*Math.sin(k)}}for(let f=0;f<n;f++)for(let b=0;b<i;b++){const d=f*(i+1)+b,M=d+i+1;m.push(d,d+1,M,d+1,M+1,M)}const C=new r.BufferGeometry;return C.setAttribute("position",new r.BufferAttribute(t,3)),C.setIndex(m),C.boundingSphere=new r.Sphere(a(0,0,0),o*1.01),C}const ae=(o,e,n)=>new r.Matrix4().makeTranslation(o,e,n);async function ia(o,e,n,i){const t=new u.Geo,m=u.M,y=u.sty,C=y(m.PAINT,o.white),f=y(m.PAINT,o.white,0,.5),b=y(m.METAL,o.metal,0,1.25),d=y(m.FOIL,o.gold),M=y(m.ROOMS,o.white,1,.95),x=y(m.PAINT,o.accent,0,.9),k=y(m.RADIATOR,o.white,0,1.1),V=y(m.GLOW,o.warm,2.8),D=y(m.GLOW,o.blue,2.4),p=[],S=[];t.rnd=e(),u.truss(t,a(0,0,150),a(0,0,n.zEnd),11,11.6,b,.55,{roll:Math.PI/4});for(let g=172;g<n.zEnd-8;g+=23.2){const h=Math.round(g/23.2);h%2?u.cbox(t,8.25,0,g,.22,.22,1.5,.06,h%4===1?V:D):u.cbox(t,0,8.25,g,.22,.22,1.5,.06,V)}const v=(g,h)=>n.wings.some(P=>Math.abs(g-P.z)<h);let z=n.zEnd-30,H=0,L=-1;for(;z>196&&H++<60;){await i();let g=e.int(0,4);g===L&&(g=(g+1)%5);const h=e.range(15,26);if(t.rnd=e(),v(z-h/2,h/2+15)){z-=12;continue}L=g;const P=z-h/2;if(g===0||g===4){const R=g===4?2:1,_=e.range(0,j);for(let q=0;q<R;q++){const U=e.range(4.4,6.4),oe=_+q*Math.PI+e.range(-.4,.4),ne=7.6+U;t.push(u.rotZ(oe).multiply(ae(ne,0,P)));const se=e.chance(.55)?d:y(m.PAINT,o.white,0,e.range(.7,1.05));u.capsule(t,U,-h/2,h/2,se,18,.55);for(const Me of[-h*.28,h*.28])u.lathe(t,[[U+.3,Me-.5],[U+.3,Me+.5]],b,{n:18});e.chance(.75)&&u.lathe(t,[[U+.08,-2.6],[U+.08,2.6]],M,{n:18}),u.tube(t,a(-U-1.6,0,0),a(-U+.3,0,0),1.3,1.3,8,b),t.pop(),S.push(a(Math.cos(oe)*(ne+U),Math.sin(oe)*(ne+U),P))}}else if(g===1){const R=e.range(3,3.8);for(let _=0;_<4;_++){const q=_*Math.PI/2;t.push(ae(Math.cos(q)*(8.4+R),Math.sin(q)*(8.4+R),P)),u.capsule(t,R,-R,R,_%2?d:y(m.PAINT,o.white,0,.95),14,1),t.pop()}u.lathe(t,[[8.6+R,P-.5],[8.6+R,P+.5]],b,{n:4,a0:0,a1:j})}else if(g===2){const R=h/2,_=e.range(12.5,14.5);t.push(ae(0,0,P)),u.lathe(t,[[8.5,-R],[_-1.5,-R],[_,-R+2.2],[_,-3.2],[_+.1,-3.2],[_+.1,3.2],[_,3.2],[_,R-2.2],[_-1.5,R],[8.5,R]],[f,C,e.chance(.5)?d:C,f,M,f,C,x,f],{n:36}),t.pop();for(const q of[-1,1])p.push({p:a(q*(_+.6),0,P),c:o.blue,s:1.5,ph:P,rate:0})}else for(const R of[-1,1])u.plate(t,a(R*.6,R*8.5,P-7),a(0,R*34,0),a(0,0,14),k),u.tube(t,a(0,R*7,P),a(0,R*43.5,P),.45,.3,5,b),p.push({p:a(0,R*44.5,P),c:o.amber,s:1.6,ph:P*.3,rate:0});z-=h+e.range(12,34)}await i();const I=n.zEnd;if(t.push(ae(0,0,I+7)),t.rnd=e(),u.capsule(t,7.4,-8,8,C,20,.7),u.lathe(t,[[7.5,-1],[7.5,1]],x,{n:20}),u.lathe(t,[[7.48,-5],[7.48,-2.4]],M,{n:20}),t.pop(),u.tube(t,a(0,6,I+7),a(0,34,I+7),.5,.2,5,b),p.push({p:a(0,34.6,I+7),c:o.white1,s:3.2,ph:.4,rate:2.2}),n.dish){u.tube(t,a(-5,-3,I),a(-20,-12,I-4),.5,.35,5,b),t.push(ae(-20,-12,I-4).multiply(new r.Matrix4().makeRotationX(Math.PI/2+.5)).multiply(new r.Matrix4().makeRotationY(-.5))),u.lathe(t,[[.3,0],[2.2,.2],[4.2,.8],[6.2,1.75],[8,2.9]],y(m.RADIATOR,o.white,0,1.05),{n:24}),u.lathe(t,[[8,2.9],[8.25,3],[8.25,2.6]],b,{n:24});for(let g=0;g<3;g++){const h=g*j/3;u.tube(t,a(Math.cos(h)*6,Math.sin(h)*6,1.6),a(0,0,6.2),.12,.12,3,b)}t.pop()}await i();for(const g of n.wings){t.rnd=e(),u.tube(t,a(-g.span-1,0,g.z),a(g.span+1,0,g.z),.7,.7,8,b,{cap:!0}),t.push(ae(0,0,g.z)),u.lathe(t,[[8.4,-2.2],[9.6,-1.4],[9.6,1.4],[8.4,2.2]],[C,x,C],{n:20}),t.pop();for(const h of[-1,1]){p.push({p:a(h*(g.span+2),0,g.z),c:o.red,s:3,ph:g.z*.1+h,rate:2});for(let P=16;P<g.span;P+=38)p.push({p:a(h*P,1.1,g.z),c:(P/38|0)%2?o.blue:o.warm,s:1.25,ph:P,rate:0})}}return await i(),{geometry:await t.buildAsync(i),beacons:p,spots:S,tris:t.tris}}function la(o,e,n){const i=new u.Geo,t=u.M,m=u.sty(t.METAL,o.metal,0,1.25),y=u.sty(t.SOLAR,o.solar),C=[u.sty(t.GLOW,o.blue,3.2),u.sty(t.GLOW,o.warm,3.2)];i.rnd=n;const f=34,b=4,d=11.5;for(const M of[-1,1]){let x=18;for(;x+f<=e+.5;){for(const k of[-1,1])u.plate(i,a(M*x,0,k*.95),a(M*f,0,0),a(0,0,k*(d-.95)),y);u.tube(i,a(M*x,0,-d),a(M*x,0,d),.2,.2,3,m),u.tube(i,a(M*(x+f),0,-d),a(M*(x+f),0,d),.2,.2,3,m);for(const k of[-1,1])u.tube(i,a(M*x,0,k*d),a(M*(x+f),0,k*d),.12,.12,3,m);for(const k of[-1,1])for(const V of[x,x+f])u.cbox(i,M*V,.1,k*d,.28,.14,.28,.05,C[k>0?0:1]);x+=f+b}}return i.build()}function ua(o){const e=new u.Geo,n=u.M,i=u.sty(n.PAINT,o.white,0,1.3),t=u.sty(n.FOIL,o.gold),m=u.sty(n.PAINT,o.accent,0,1.1);e.rnd=.37,u.cbox(e,0,1.25,0,.3,.38,.2,.08,i),u.cbox(e,0,1.3,-.36,.28,.44,.16,.06,i),u.cbox(e,0,1,0,.31,.06,.21,.02,m),e.push(ae(0,1.74,0)),u.capsule(e,.25,-.25,.25,i,8,1),e.pop(),u.cbox(e,0,1.76,.2,.17,.12,.07,.04,t);for(const y of[-1,1])u.tube(e,a(y*.15,.9,0),a(y*.2,.04,.12),.14,.11,5,i,{cap:!0}),u.tube(e,a(y*.38,1.52,0),a(y*.52,1.08,.36),.1,.09,5,i,{cap:!0});return e.build()}function ca(o,e){const n=new u.Geo,i=u.M,t=u.sty,m=t(i.PAINT,o.white,0,1.05),y=t(i.METAL,o.metal,0,1.3),C=t(i.FOIL,o.gold),f=t(i.SOLAR,o.solar),b=e.chance(.5);n.rnd=e(),u.capsule(n,2.4,-6.5,2.6,b?C:m,16,.75),u.lathe(n,[[2.55,-.8],[2.55,1.6]],b?m:C,{n:16}),u.lathe(n,[[2.46,-4.2],[2.46,-3.6]],t(i.GLOW,o.warm,2.6),{n:10,a0:-.9,a1:.9}),u.lathe(n,[[.7,2.4],[1.8,5]],y,{n:12}),u.tube(n,a(0,0,-6.4),a(0,0,-8.2),.55,.38,8,y,{cap:!0});for(const d of[-1,1])u.tube(n,a(d*2.3,0,.4),a(d*3.4,0,.4),.14,.14,4,y),u.plate(n,a(d*3.4,-1.5,.4),a(d*8.5,0,0),a(0,3,0),f),u.cbox(n,0,d*2.75,-1.6,.9,.55,1.8,.15,d>0?m:t(i.PAINT,o.accent,0,.95));for(let d=0;d<4;d++){const M=d*Math.PI/2+Math.PI/4;u.cbox(n,Math.cos(M)*2.5,Math.sin(M)*2.5,1.9,.28,.28,.4,.06,y)}return{geometry:n.build(),nav:[a(11.9,0,.4),a(-11.9,0,.4),a(0,3.5,-1.6)],jets:[a(3.1,0,2.2),a(-3.1,0,2.2),a(0,-3.1,2.2)]}}function fa(o,e,n){const i=new r.PlaneGeometry(1,1),t=new r.InstancedBufferGeometry;t.index=i.index,t.setAttribute("position",i.attributes.position),t.setAttribute("uv",i.attributes.uv);const m=new Float32Array(n*3),y=new Float32Array(n*3),C=new Float32Array(n*4),f=a(),b=a();for(let x=0;x<n;x++){const k=o.range(4,21)*N,V=o()*j;f.set(Math.sin(k)*Math.cos(V),Math.cos(k),Math.sin(k)*Math.sin(V)),b.set(o()-.5,0,o()-.5),b.addScaledVector(f,-b.dot(f)).normalize(),m.set([f.x,f.y,f.z],x*3),y.set([b.x,b.y,b.z],x*3),C.set([o.range(6,17),o(),o.range(.03,.07),o.range(.55,1)],x*4)}t.setAttribute("aDir",new r.InstancedBufferAttribute(m,3)),t.setAttribute("aVel",new r.InstancedBufferAttribute(y,3)),t.setAttribute("aParam",new r.InstancedBufferAttribute(C,4)),t.instanceCount=n;const d={uC:{value:e},uTime:{value:0},uR:{value:te},uH:{value:Xe}},M=new r.Mesh(t,new r.ShaderMaterial({uniforms:d,vertexShader:aa,fragmentShader:oa,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending,side:r.DoubleSide}));return M.frustumCulled=!1,M.renderOrder=1,{mesh:M,uniforms:d}}var ma={id:"orbit-dawn",name:"Orbital Sunrise",category:"sky",weirdness:.25,async build(o){const e=o.rng,n=new r.Scene;n.background=new r.Color(0);const i={value:0},t={sunAz:e.range(-8,8)*N,dawnShift:e.range(-.02,.02),period:e.range(52,64),earthSpin:e.range(.36,.5)*N,incl:e.range(-.35,.35),cloud:e.range(.5,.58),land:e.range(.45,.51),pop:e.range(.7,1),storm:e.range(.35,1.5),auroraR:e.range(.12,.16),auroraW:e.range(.0045,.0075),auroraI:e.range(.5,.66),aurora2:e.chance(.6)?e.range(.35,.7):0,auroraSide:e.range(-.16,.16),auroraHigh:e.pick(["#c040ff","#ff3a6a","#5a6cff"]),auroraLow:e.pick(["#30ff7a","#30ff7a","#4affc0"]),blue:new r.Color(wt[2]).offsetHSL(e.range(-.035,.02),0,0),city:new r.Color(e.pick(["#ffb040","#ffc070","#ffa030"])),wing3:e.chance(.5),wingBz:e.range(610,640),wingBspan:e.pick([134,172]),dish:e.chance(.7),tug:e.chance(.8),tug2:e.chance(.75),sats:e.int(2,5),flecks:e.range(.6,1.5),meteors:e.int(5,9),spare:e(),moonEl:e.range(9,30),moonAz:e.sign()*e.range(20,52),moonPhase:e.range(.25,.85),entryX:e.range(36,52),entryY:e.range(50,62)},m=await ra(e.fork("atlas"),()=>o.yield()),y=a(e.range(-1,1),e.range(.2,1),e.range(-.4,.4)).normalize(),C=ta(e.fork("stars"),y);n.add(C.object),await o.yield();const f=a(0,-.5,-.86).normalize(),b={uDir:{value:f},uDist:{value:8600},uHalf:{value:Math.tan(14*N)*8600},uColor:{value:new r.Color(1,1,1)},uP:{value:a(.9/14,4,.5)},uTime:i},d=At($t,b,!1);d.renderOrder=.5,d.name="sun",n.add(d);const M=a(0,.1,-1).normalize(),x=a(),k=J(2.3,.8,t.moonPhase),V=e.range(-1.2,1.2)-Math.PI/2,D=At(ea,{uDir:{value:M},uDist:{value:8500},uHalf:{value:Math.tan(1.45*N)*8500},uTex:{value:m},uL:{value:a(Math.cos(V)*Math.sin(k),Math.sin(V)*Math.sin(k),Math.cos(k))}},!0);D.name="moon",n.add(D);const p=new r.Vector2,S=new r.Color(.075,.095,.15);await o.yield();const v=await qt(o,{palette:wt,hubAtOrigin:!0,period:t.period,steer:!1,sunrise:0});n.add(v.object);const z=v.anchors,H=v.colors,L=z.portalSeat;v.uniforms.uFill.value=.1,v.uniforms.uMoonCol.value.copy(S),v.uniforms.uMoonDir.value.set(Math.sign(t.moonAz)*.4,.55,.72).normalize(),await o.yield();const I=[a(t.entryX,t.entryY,790),a(t.entryX+18,t.entryY-11,700),a(96,26,588),...z.flyThrough.map(l=>l.clone())],g=jt(I),h=48;let P=.67;{let l=.3,s=.9;const w=a();for(let T=0;T<30;T++){const B=(l+s)/2;g.pointAt(B,w).z>0?l=B:s=B}P=(l+s)/2}const R=g.pointAt(P),_=Math.atan2(R.y,R.x);{const l=g.tangentAt(0),w=Math.atan2(l.x,-l.z)+(-5+6.5*(Math.abs(t.moonAz)-20)/32)*N,T=(2+4.5*(t.moonEl-9)/21)*N;x.set(Math.sin(w)*Math.cos(T),Math.sin(T),-Math.cos(w)*Math.cos(T)),M.copy(x)}const q=a(0,-(te+400),180),U=a(Math.cos(t.incl),0,Math.sin(t.incl)),oe=a(0,1,0),ne=a().crossVectors(U,oe).normalize(),se=new r.Matrix3,Me=new r.Matrix4,Ze=new r.Vector2,Oe=(l,s,w)=>l.setFromMatrix4(Me.makeRotationAxis(s,-w)),pe={uC:{value:q},uTex:{value:m},uAxis:{value:U},uAxU:{value:oe},uAxV:{value:ne},uSpin:{value:Ze},uTime:i,uSun:{value:f},uBlue:{value:t.blue},uOff:{value:new r.Vector2(e.range(-40,40),e.range(-40,40))},uCity:{value:t.city},uCloud:{value:t.cloud},uPop:{value:t.pop},uStorm:{value:t.storm},uLand:{value:t.land},uLift:{value:0},uSunT:{value:new r.Vector2(0,-1)},uDawn:{value:0}};await o.yield();const ze=new r.Mesh(St(te*1.0006,34*N,44,176),new r.ShaderMaterial({uniforms:pe,vertexShader:bt,fragmentShader:Kt}));ze.position.copy(q),ze.frustumCulled=!1,ze.name="earth",n.add(ze);const Tt=t.earthSpin*14,re=a(t.auroraSide,0,-Math.sin(9*N));re.y=Math.sqrt(1-re.x*re.x-re.z*re.z);const Ae=re.clone().applyMatrix3(Oe(se,U,Tt)),Je=a(1,0,0).addScaledVector(Ae,-Ae.x).normalize(),kt=a().crossVectors(Ae,Je),ie={uC:{value:q},uM:{value:se},uTime:i,uR:{value:te},uH:{value:Xe},uSun:{value:f},uBlue:{value:t.blue},uPole:{value:Ae},uPoleA:{value:Je},uPoleB:{value:kt},uOval:{value:new r.Vector4(t.auroraR,t.auroraW,t.auroraI,t.aurora2)},uAurLow:{value:new r.Color(t.auroraLow)},uAurHigh:{value:new r.Color(t.auroraHigh)},uGlow:{value:1},uTex:{value:m},uArc:{value:0},uHk:{value:1},uAk:{value:1}},ve=new r.Mesh(St(te+Xe*xt,35*N,40,176),new r.ShaderMaterial({uniforms:ie,vertexShader:bt,fragmentShader:Nt,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending}));ve.position.copy(q),ve.frustumCulled=!1,ve.renderOrder=0,ve.name="air",n.add(ve);const et=fa(e.fork("meteors"),q,t.meteors);n.add(et.mesh),await o.yield();const Se={zEnd:742,dish:t.dish,wings:[{z:460,span:172},{z:t.wingBz,span:t.wingBspan}]};t.wing3&&Se.wings.push({z:e.range(292,316),span:96});const Te=await ia(H,e.fork("fore"),Se,()=>o.yield());await o.yield();const Le=new r.Mesh(Te.geometry,v.material);Le.name="fore",v.addPrepass(Le),n.add(Le),await o.yield();for(const l of Se.wings)await o.yield(),l.mesh=new r.Mesh(la(H,l.span,e()),v.material),l.mesh.position.set(0,0,l.z),l.night=e.range(-.13,.13),l.ph=e()*j,n.add(l.mesh);for(let l=-106,s=0;l>-344;l-=17,s++)Te.beacons.push({p:a(8.7,0,l),c:s%3===0?H.amber:H.white1,s:1.5,ph:l*.06,rate:1.9});const Ve=Qt(Te.beacons);n.add(Ve.object),await o.yield();const ke=ua(H),tt=a(0,1,0),le=[];{const l=new r.Mesh(ke,v.material);le.push({mesh:l,base:a(54,.7,460),up:a(0,1,0),along:a(1,0,0),range:7,rate:.05,ph:e()*j});let s=null,w=-1e9;for(const O of Te.spots){const X=(O.x+O.y)/Math.hypot(O.x,O.y)-Math.abs(O.z-560)*.004;O.z>330&&X>w&&(w=X,s=O)}s||(s=a(0,8.4,560));const T=a(s.x,s.y,0).normalize();le.push({mesh:new r.Mesh(ke,v.material),base:s.clone(),up:T,along:a(0,0,1),range:4,rate:.037,ph:e()*j});let B=-250;for(const O of z.solarWings)Math.abs(B-O.z)<24&&(B=O.z+26);Math.abs(B-z.gantry.position.z)<14&&(B=z.gantry.position.z+22),le.push({mesh:new r.Mesh(ke,v.material),base:a(8.36,0,B),up:a(1,0,0),along:a(0,0,1),range:8,rate:.19,ph:e()*j});for(const O of le)O.q0=new r.Quaternion().setFromUnitVectors(tt,O.up),n.add(O.mesh)}const $=[];{const l=ca(H,e.fork("tug")),s=(B,O,X)=>{const be=new r.Mesh(l.geometry,v.material);n.add(be),$.push({nav:l.nav,jets:l.jets,mesh:be,base:B,amp:O,yaw:X,ph:e()*j})};t.tug&&s(a(e.range(168,188),e.range(-34,-14),e.range(250,330)),a(9,6,26),e.range(-.5,.5)),s(a(e.range(66,84),e.range(-26,30),e.range(-330,-262)),a(6,5,14),Math.PI+e.range(-.6,.6));const w=$[$.length-1];w.closing=t.tug2?e.range(30,46):-e.range(10,20),w.busy=!0,w.base.set(57+(w.base.x-66)/18*4,-23+(w.base.y+26)/56*4,-158),w.amp.set(2.5,2.2,4),w.run=40,s(a(-270,-64,-520),a(0,3,0),0);const T=$[$.length-1];T.dir=a(.943,.047,.33).normalize(),T.busy=!0,T.yaw=Math.atan2(-T.dir.x,-T.dir.z)}await o.yield();const Y={lamp:0,shuttle:3,tug:5,sat:5+6*$.length},Pt=Y.sat+t.sats,at=[],Z=[],ot=[];for(let l=0;l<Pt;l++)at.push([0,0,900]),Z.push("#bcd8ff"),ot.push(0);Z[0]=Z[1]=Z[2]="#dff0ff";for(let l=0;l<$.length;l++){const s=Y.tug+6*l;Z[s]="#ff3020",Z[s+1]="#30ff60",Z[s+2]="#ffffff"}const Fe=[];for(let l=0;l<t.sats;l++){Z[Y.sat+l]=e.pick(["#ffffff","#ffe9c4","#cfe4ff"]);const s=a(e.range(-1800,1800),e.range(-150,1100),e.range(-2600,-1200)),w=a(e.sign()*e.range(.7,1),e.range(-.25,.25),e.range(-.4,.4)).normalize();Fe.push({a:s,d:w,speed:e.range(28,70),span:e.range(2200,3600),off:e()*4e3,size:e.range(5,9)*.55,blink:e.chance(.4)?e.range(1.5,3):0})}const Q=me.makeGlows({rng:e.fork("glows"),time:i,positions:at,colors:Z,sizes:ot,size:1,intensity:2.4,minAngle:.0045,fog:!1});n.add(Q.object),await o.yield();const nt=me.makeParticles({rng:e.fork("ice"),preset:"dust",count:Math.round(1400*t.flecks),box:[150,90,170],velocity:[1.4,-.4,3.2],velocityRandom:[1.6,1,1.6],turbulence:[0,0,0],size:[.06,.22],colors:["#ffffff","#cfe4ff","#ffe9c4"],intensity:4,twinkle:.7,minAngle:.003,near:[1.5,6],fog:!1,time:i});n.add(nt.object),await o.yield();const st=me.makeParticles({rng:e.fork("ice2"),preset:"dust",count:Math.round(2400*t.flecks),follow:!1,center:[36,0,-235],box:[84,56,330],velocity:[-.5,.4,7.5],velocityRandom:[1.4,1.2,3.5],turbulence:[0,0,0],size:[.12,.5],colors:["#ffffff","#cfe4ff","#ffe9c4"],intensity:5.5,twinkle:.8,minAngle:.0042,near:[1.5,6],fog:!1,time:i});n.add(st.object),await o.yield();const ue=me.makeFlare({rng:e.fork("flare"),sunDir:[0,-.5,-.86],size:.36,ghosts:6,streak:!0,color:"#fff2dc",intensity:1.1});{const l=ue.object.geometry.attributes.aGhost;if(l){for(let s=0;s<l.count;s++)l.getX(s)>.01?(l.setZ(s,0),l.setY(s,Math.min(l.getY(s),.065)),l.setW(s,l.getW(s)*.55)):l.getZ(s)<3.5&&(l.setY(s,.13),l.setW(s,.12));l.needsUpdate=!0}}n.add(ue.object);const Ge={uPos:{value:a(L.position.x,L.position.y,L.position.z-5)},uHalf:{value:64},uR0:{value:(L.radius+3.4)/64},uColor:{value:new r.Color("#ffe6c4")},uI:{value:0},uTime:i},Pe=new r.Mesh(new r.PlaneGeometry(2,2),new r.ShaderMaterial({uniforms:Ge,vertexShader:Zt,fragmentShader:Jt,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending}));Pe.frustumCulled=!1,Pe.renderOrder=1,Pe.name="corona",n.add(Pe),await o.yield();const Ce=.0157,Ie=ie.uAurLow.value,Be=(l,s)=>{const w=na(yt,l-t.dawnShift*(1-G(.6,.72,l)))*N,T=t.sunAz*(1-G(.46,.72,l));return s.set(Math.sin(T)*Math.cos(w),Math.sin(w),-Math.cos(T)*Math.cos(w))},We=a(),rt=a(),He=a(),ce=a(),Ct=a(),Dt=a(),ge=a(),_e=a(),it=a(),lt=a(),ut=a(),we=new r.Color,Rt=new r.Color,xe=new r.Color,ct=new r.Color,Ot=new r.Quaternion,Lt=new r.Color(1,.2,.05),Vt=new r.Color(1,.62,.25),Ft=new r.Color(1,.96,.9),ft=j/t.period,ye=j/8,ht=v.params.spinDir,Gt=e()*j,F={rate:1/h,prevU:-1,e:0,corr:0,has:!1,frozen:null},It=z.shuttle?a(z.shuttle.x,z.shuttle.y,0).normalize():null;function Bt(l,s,w){l>1e-4&&F.prevU>=0&&w>F.prevU&&w-F.prevU<.02&&(F.rate=J(F.rate,de((w-F.prevU)/l,.2/h,5/h),.08)),w<F.prevU-.2&&(F.has=!1,F.frozen=null,F.rate=1/h);const T=w!==F.prevU;F.prevU=w;const B=Gt+ht*ft*s;if(T||!F.has){let O;w>P&&F.frozen!==null?O=F.frozen:(O=_-ye/2-(B+ht*ft*(P-w)/F.rate),O-=Math.round(O/ye)*ye,F.has&&G(.32,.56,w)>0&&(O+=Math.round((F.e-O)/ye)*ye),F.e=O,F.has=!0,w>P&&(F.frozen=O)),F.corr=O*G(.32,.56,w)}return B+F.corr}function Wt(l,s,w,T){i.value=s,Be(T,f);const B=Math.asin(de(f.y,-1,1));_e.setFromMatrixPosition(w.matrixWorld),We.subVectors(_e,q);const O=We.length();rt.copy(We).divideScalar(O);const X=Math.asin(de(f.dot(rt),-1,1))+Math.acos(de(te/O,0,1)),be=G(-Ce,Ce*.7,X),dt=G(-.012,.07,X),fe=G(0,.3,X);we.copy(Lt).lerp(Vt,G(-Ce,.045,X)).lerp(Ft,G(.03,.2,X)),v.setPhase(Bt(l,s,T));const Ht=(B<0?te*(1/Math.cos(B)-1):0)-400;v.setSunrise(de((375-Ht)/1125,0,1)+.33*G(-9*N,0,B));const De=1-G(.03,.2,T),Ee=1+1.4*De*(1-fe);v.uniforms.uWin.value=1+1.6*De,v.uniforms.uMoonCol.value.copy(S).multiplyScalar(1+1.3*De);const Ue=1-G(0,.1,T),je=G(.42,.52,T);ie.uOval.value.z=t.auroraI*(1+.7*(1-G(.05,.3,T)))*(1+.4*Ue),ie.uAk.value=1+.8*Ue,ie.uHk.value=1+.9*Ue+.9*je,ie.uArc.value=je,pe.uLift.value=.3*G(.56,.8,T),pe.uDawn.value=je,pe.uCloud.value=t.cloud-.03*G(.6,.85,T);{const A=f.dot(ne),c=f.dot(U),E=Math.hypot(A,c)||1;pe.uSunT.value.set(A/E,c/E)}xe.setRGB(J(.05,.12,fe)*Ee,J(.09,.2,fe)*Ee,J(.2,.38,fe)*Ee);const qe=.2*De*(1-fe);xe.r+=Ie.r*qe,xe.g+=Ie.g*qe,xe.b+=Ie.b*qe,v.setEarthshine(xe);const mt=B-yt[0][1]*N,Qe=Math.cos(mt),Ke=Math.sin(mt);C.uniforms.uRot.value.set(Qe,Ke),M.set(x.x,Qe*x.y-Ke*x.z,Ke*x.y+Qe*x.z),v.setSun(f,Rt.copy(we).multiplyScalar(1.2*(.72+.28*v.sunVis))),v.update(l,s,w),He.subVectors(L.position,_e);const pt=He.length(),vt=He.dot(f)/pt;let Re=1;if(vt>0){const A=Math.atan2(L.radius+1.6,pt);Re=G(A*.8,A*1.15+Ce,Math.acos(Math.min(1,vt)))}const _t=v.sunVis*be*Re;b.uColor.value.copy(we),b.uP.value.z=.85*G(-.06,.03,X)*(.55+.45*v.sunVis)*(.55+.45*Re),C.uniforms.uTime.value=s,C.uniforms.uPx.value=(o.renderer?.getDrawingBufferSize?o.renderer.getDrawingBufferSize(p).y:540)/540,it.setFromMatrixColumn(w.matrixWorld,0).normalize(),lt.setFromMatrixColumn(w.matrixWorld,1).normalize(),ut.setFromMatrixColumn(w.matrixWorld,2).normalize();const Ne=-f.dot(ut),gt=w.projectionMatrix.elements,Et=Ne>.05?1-G(.98,1.14,Math.max(Math.abs(f.dot(it)*gt[0]/Ne),Math.abs(f.dot(lt)*gt[5]/Ne))):0;ue.uniforms.uSun.value.copy(f),ue.uniforms.uVisibility.value=_t*Et,ue.uniforms.uColor.value.copy(we),ue.uniforms.uIntensity.value=.5+.2*fe,Ge.uI.value=1.25*(1-Re)*be*(.88+.12*Math.sin(s*1.9)),Ge.uColor.value.copy(we),nt.setOpacity(J(.14,1,dt)*(.45+.55*v.sunVis)),st.setOpacity(J(.14,1,dt)*G(.56,.7,T));const Ye=t.earthSpin*s;Oe(se,U,Ye),Ze.set(Ye,Ye*1.06+.02*s*N+.3),et.uniforms.uTime.value=s,Ve.uniforms.uTime.value=s,Ve.uniforms.uPx.value=v.beaconUniforms.uPx.value;const Ut=G(.4,.64,T);for(const A of Se.wings)A.mesh.rotation.x=-J(A.night+.07*Math.sin(s*.21+A.ph),Math.PI/2-B,Ut)-.01*Math.sin(s*.9+A.ph);for(let A=0;A<le.length;A++){const c=le[A],E=Math.sin(s*c.rate+c.ph);c.mesh.position.copy(c.base).addScaledVector(c.along,E*c.range).addScaledVector(c.up,.06+.05*Math.sin(s*1.3+c.ph)),c.mesh.quaternion.copy(c.q0).multiply(Ot.setFromAxisAngle(tt,.6*Math.sin(s*.21+c.ph*2))),c.mesh.updateMatrixWorld(),Q.setPosition(Y.lamp+A,ce.set(0,1.82,.36).applyMatrix4(c.mesh.matrixWorld)),Q.setSize(Y.lamp+A,1.7+.25*Math.sin(s*.21+c.ph*2))}for(let A=0;A<$.length;A++){const c=$[A],E=c.mesh,K=c.ph,ee=Y.tug+6*A;if(c.dir){const W=340-560*(1-de((T-.52)/.48,0,1))+42*Math.sin(.2*s+K);E.position.copy(c.base).addScaledVector(c.dir,W),E.position.y+=c.amp.y*Math.sin(.3*s+K),E.rotation.set(.05*Math.sin(.23*s+K),c.yaw+.08*Math.sin(.11*s+K),.35*Math.sin(.17*s+K))}else{const W=G(.6,1,T),he=c.closing?c.closing>0?c.closing*.4*(1-W):-c.closing*.5*W:0;E.position.set(c.base.x+c.amp.x*Math.sin(.11*s+K)+he,c.base.y+c.amp.y*Math.sin(.07*s+1+K),c.base.z+c.amp.z*Math.sin(.045*s+2+K)-(c.run||0)*W),E.rotation.set(.1*Math.sin(.13*s+K),c.yaw+.3*Math.sin(.05*s+K),.2*Math.sin(.09*s+K))}E.updateMatrixWorld();for(let W=0;W<2;W++)Q.setPosition(ee+W,ce.copy(c.nav[W]).applyMatrix4(E.matrixWorld)),Q.setSize(ee+W,1.3);Q.setPosition(ee+2,ce.copy(c.nav[2]).applyMatrix4(E.matrixWorld)),Q.setSize(ee+2,.01+3.2*Math.pow(Math.max(0,Math.sin(s*2.7+K)),24));for(let W=0;W<3;W++){const he=c.busy?$e(s,1.4,W+1+K,.62):$e(s,.8,W+1+K);Q.setPosition(ee+3+W,ce.copy(c.jets[W]).applyMatrix4(E.matrixWorld)),Q.setSize(ee+3+W,he<0?0:1.2+5*he),he>=0&&Q.setColor(ee+3+W,ct.setRGB(.74,.85,1).multiplyScalar(Math.exp(-he*4.5)))}}if(z.shuttle)for(let A=0;A<2;A++){const c=$e(s,.55,A*3+9),E=A?-1:1;Q.setPosition(Y.shuttle+A,ce.copy(z.shuttle).addScaledVector(It,3.4*E).setZ(z.shuttle.z+(A?-11:14))),Q.setSize(Y.shuttle+A,c<0?0:1.4+6*c),c>=0&&Q.setColor(Y.shuttle+A,ct.setRGB(.74,.85,1).multiplyScalar(Math.exp(-c*4)))}for(let A=0;A<Fe.length;A++){const c=Fe[A],E=(s*c.speed+c.off)%c.span-c.span/2;Q.setPosition(Y.sat+A,ce.copy(c.a).addScaledVector(c.d,E)),Q.setSize(Y.sat+A,c.size*(c.blink?.35+.65*Math.pow(Math.max(0,Math.sin(s*c.blink+A)),6):1))}}return Oe(se,U,0),Be(0,f),{scene:n,path:g,duration:h,camera:{fov:62,near:1,far:9e3,lookAhead:40,sway:.55,bank:.5},pois:[{at:a(-20,-330,0),from:0,to:.2,weight:.5},{at:a(120,-175,170),from:.15,to:.37,weight:.42},{at:(l,s)=>(Be(s,ge),ge.y<-.4&&(ge.y=-.4,ge.normalize()),Dt.copy(g.pointAt(s,Ct)).addScaledVector(ge,3e3)),from:.34,to:.58,weight:.62,fade:.2},{at:a(z.gardenLook.x*.7,-40,-70),from:.54,to:.71,weight:.45,fade:.25},{at:a(0,0,-20),from:.6,to:.67,weight:.25,fade:.3},{at:a(L.position.x,L.position.y-260,L.position.z-600),from:.68,to:1,weight:.4,fade:.12}],portal:{shape:"circle",radius:Math.min(8.6,L.radius-.15),color:"#ffe2b8",glow:.85,revealDistance:300},post:{exposure:1,bloom:{strength:.46,radius:.6,threshold:1.7},grade:{saturation:1.1,contrast:1,tint:"#f6f8ff",shadowTint:"#01030b",vignette:.34,grain:.02,aberration:0}},update:Wt,dispose(){v.dispose?.(),m.dispose(),ke.dispose()}}}};export{ma as default};
