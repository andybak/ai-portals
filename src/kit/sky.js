import*as i from"three";const Z=Math.PI/180,Fe=4,Le=`
uniform sampler2D uNoiseTex;
float h11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float h21(vec2 p){ vec3 q=fract(vec3(p.xyx)*.1031); q+=dot(q,q.yzx+33.33); return fract((q.x+q.y)*q.z); }
float h31(vec3 q){ q=fract(q*.1031); q+=dot(q,q.zyx+31.32); return fract((q.x+q.y)*q.z); }
vec3 h33(vec3 q){ q=fract(q*vec3(.1031,.1030,.0973)); q+=dot(q,q.yxz+33.33); return fract((q.xxy+q.yxx)*q.zyx); }
float vn1(float p){ float i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(h11(i),h11(i+1.),f); }
// value noise from a 256x256 random texture (G is R shifted by (37,17), so one fetch also gives 3D noise)
// BROUGHT IN: vn3 below follows the texture-lookup 3D value noise of Inigo Quilez's shaders, MIT License
// (https://www.shadertoy.com/user/iq). The notice ships with the site in THIRD-PARTY-NOTICES.txt.
float vn2(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*f*(f*(f*6.-15.)+10.);
  return textureLod(uNoiseTex, (i + f + .5)/256., 0.).b; }   // explicit LOD: these are called inside loops, where Direct3D leaves derivatives undefined
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  vec2 rg = textureLod(uNoiseTex, (i.xy + vec2(37., 17.)*i.z + f.xy + .5)/256., 0.).rg;
  return mix(rg.x, rg.y, f.z); }
const mat2 ROT2 = mat2(.8,-.6,.6,.8);
float fbm2(vec2 p, int oct){ float a=.5, s=0., n=0.;
  for(int i=0;i<oct;i++){ s+=a*vn2(p); n+=a; p=ROT2*p*2.03+17.7; a*=.5; } return s/n; }
float fbm3(vec3 p, int oct){ float a=.5, s=0., n=0.;
  for(int i=0;i<oct;i++){ s+=a*vn3(p); n+=a; p=p.yzx*2.02+vec3(13.1,7.7,5.3); a*=.5; } return s/n; }
`,xe=`
varying vec3 vDir;
void main(){
  vDir = position;
  vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.0);
  // A vertex exactly beside the camera has w = 0 (the dome's apex whenever the camera is level, as it is when a
  // world is seen through a portal on a straight approach). With z = w that vertex cannot be clipped, and the
  // divide by zero turned whole triangles into flat bands drawn over the scene. Nudge it off the plane.
  if (abs(p.w) < 1e-4) p.w = 1e-4;
  gl_Position = p.xyww;            // always on the far plane, centred on whichever camera draws it
}`,Ie=`
varying vec3 vDir;
void main(){ vDir = vec3(position.xy, 0.); gl_Position = vec4(position.xy, 0., 1.); }`,Re=`
precision highp float;
varying vec3 vDir;
uniform float uTime, uOpacity, uDither, uHorizonFade;
uniform vec3 uZenith, uMid, uHorizon, uGround, uScatterColor;
uniform vec4 uGrad;                 // horizonPow, scatter amount, scatterPow, ground falloff
uniform vec4 uGrad2;                // midPow, scatter at zenith, scatter vertical falloff, -
uniform vec3 uSunDir, uSunColor; uniform vec4 uSun;   // radius(rad), disc intensity, glow, glow tightness
uniform float uVeil;                // strength of the luminous patch a cloud-veiled sun leaves
#ifdef SUN2
uniform vec3 uSun2Dir, uSun2Color; uniform vec4 uSun2;
#endif
#ifdef STARS
uniform vec4 uStars;                // intensity, twinkle, density, hue variation
#endif
#ifdef MILKY
uniform vec3 uMilkyAxis, uMilkyCenter, uMilkyColor, uMilkyColor2; uniform float uMilky;
#endif
#ifdef NEBULA
uniform vec3 uNebulaA, uNebulaB, uNebulaC; uniform vec4 uNebula;   // intensity, scale, seed, coverage
#endif
#ifdef BAKED
uniform samplerCube uBake;          // rgb = nebula + milky way, a = milky way band (baked once at build)
#endif
#ifdef AURORA
uniform vec3 uAuroraA, uAuroraB, uAuroraDir; uniform vec4 uAurora; // intensity, scale, speed, spread
#endif
#if NUM_BODIES > 0
uniform vec4 uBodyDir[NUM_BODIES];     // xyz direction, w angular radius (rad)
uniform vec4 uBodyColor[NUM_BODIES];   // rgb, w band count (0 = rocky)
uniform vec4 uBodyColor2[NUM_BODIES];  // rgb second colour, w texture strength
uniform vec4 uBodyLight[NUM_BODIES];   // xyz light direction, w dark-side brightness
uniform vec4 uBodyAxis[NUM_BODIES];    // xyz spin axis / ring normal, w seed
uniform vec4 uBodyRing[NUM_BODIES];    // inner, outer (in radii), opacity, atmosphere glow
uniform vec4 uBodyRingColor[NUM_BODIES]; // rgb, w horizon fade amount
uniform vec3 uBodyAtmo[NUM_BODIES];
uniform vec4 uBodyGlow[NUM_BODIES];   // rgb halo colour, w width in radii
uniform vec4 uBodyT1[NUM_BODIES];     // xyz tangent (screen right), w 1 / half-extent of the baked tile (sine)
uniform vec4 uBodyT2[NUM_BODIES];     // xyz tangent (screen up)
#ifdef BAKED_BODIES
uniform sampler2D uBodyTex;           // one premultiplied tile per body, side by side
#endif
#ifdef BAKE_BODY
uniform int uBakeBody;
#endif
#endif
#if CLOUDS > 0
uniform vec4 uCloudA[2];            // coverage, softness, scale, opacity
uniform vec4 uCloudB[2];            // detail erosion, silver lining, absorption, stretch (cirrus)
uniform vec4 uCloudW[2];            // wind xy, seed, haze
uniform vec3 uCloudLit[2], uCloudShade[2];
uniform float uCloudCurve, uFlash; uniform vec3 uFlashColor, uKeyDir, uKeyColor;
#endif
${Le}

// Clear-sky colour for a direction: vertical gradient plus a warm wash on the sun side.
vec3 atmosphere(vec3 d){
  float inv = 1. - clamp(d.y, 0., 1.);
  vec3 c = mix(uZenith, uMid, pow(inv, uGrad2.x));
  c = mix(c, uHorizon, pow(inv, uGrad.x));
  float side = .5 + .5*dot(d, uSunDir);
  float sc = pow(side, uGrad.z) * mix(uGrad2.y, 1., pow(inv, uGrad2.z));
  c = mix(c, uScatterColor, clamp(sc*uGrad.y, 0., 1.));
  return c;
}

// Sun: returns the halo; the disc (limb darkened, edge softened over ~3 px) comes back in disc so thick cloud
// can hide it. Discs under about 1 degree are capped at radiance 8 and carry their glow analytically instead,
// which keeps the bloom round.
vec3 sunLight(vec3 d, vec3 sd, vec3 col, vec4 s, float vis, float pix, out vec3 disc){
  float mu = dot(d, sd);
  float sa = length(d - sd*mu);                       // sine of the angular distance, precise near 0
  float aa = pix*1.5 + 1e-6;
  float m = (mu > 0.) ? 1. - smoothstep(s.x - aa, s.x + aa, sa) : 0.;
  float limb = sqrt(max(1. - sa*sa/(s.x*s.x), 0.));
  float small = 1. - smoothstep(.0122, .0192, s.x);   // 1 below 0.7 deg, 0 above 1.1 deg
  float I = mix(s.y, min(s.y, 8.), small);
  disc = col * I * m * (.55 + .45*limb) * vis;
  float g1 = .72, g2 = mix(.9, .985, s.w);
  float w = pow((1.-g1)*(1.-g1)/(1.+g1*g1-2.*g1*mu), 1.5);     // normalised Henyey-Greenstein lobes
  float t = pow((1.-g2)*(1.-g2)/(1.+g2*g2-2.*g2*mu), 1.5);
  float x = max(sa - s.x, 0.)/s.x;
  float front = (mu > 0.) ? vis : 0.;
  float corona = exp(-x/.9)*front;
  float skirt = (.75*exp(-x/3.) + .3/(1. + x*x*.16))*front*small*min(s.y, 16.)*.11;
  return col*(s.z*(.16*w + .42*t + .55*corona) + skirt*step(.001, s.z));
}
`,Te=`
#ifdef STARS
// One shell of point stars on a 3D grid; stars keep at least ~1 px of radius so they do not shimmer.
vec3 starLayer(vec3 d, float pix, float scale, float seed, float bright, float boost){
  vec3 p = d*scale, ip = floor(p);
  vec3 h = h33(ip + seed);
  vec3 sp = ip + .5 + (h - .5)*.76;
  float rad = length(sp);
  float px = pix*scale;
  float dist = length(p - sp/rad*scale);
  if(dist > .09 + px*2.2 || abs(rad - scale) > .34) return vec3(0.);
  float h2 = fract(h.x*91.7 + h.y*37.3 + h.z*11.1);
  float shell = (1. - smoothstep(.16, .34, abs(rad - scale))) * step(fract(h2*3.77 + h.x), clamp(uStars.z*boost, 0., 1.));
  float mag = pow(fract(h2*7.31 + h.z), 7.)*.92 + .08;
  float r0 = .028 + .05*mag;
  float r = max(r0, px*.85);
  float core = exp(-dist*dist/(r*r*.32));
  float I = core * mag * bright * min(1., r0*r0/(r*r)*1.6 + .12);
  float tw = 1. + uStars.y*(.55*sin(uTime*(1.3 + 4.7*h.z) + h.y*40.) + .3*sin(uTime*(3.1 + 5.3*h.x) + h.z*17.)) * (1.5 - d.y);
  vec3 tint = mix(vec3(1., .78, .56), vec3(.66, .8, 1.), h.z);
  tint = mix(vec3(1.), tint, uStars.w * smoothstep(.0, .5, mag + .25));
  return tint * I * max(tw, 0.) * shell;
}
#endif

#ifdef MILKY
vec3 milkyWay(vec3 d, out float band){
  float lat = dot(d, uMilkyAxis);
  band = 0.;
  if(abs(lat) > .62) return vec3(0.);
  float n = fbm3(d*3.1 + 11., 4);
  float n2 = fbm3(d*8.1 - 4., 3);
  float lon = .5 + .5*dot(d, uMilkyCenter);                 // 1 towards the galactic centre
  float lw = lat + (n - .5)*.17;                            // the band meanders
  float wdt = mix(.11, .27, lon*lon)*(.75 + .6*n);
  band = exp(-lw*lw/(wdt*wdt))*(1. - smoothstep(.45, .62, abs(lat)));
  float core = exp(-lw*lw/(.008 + .04*lon*lon));
  float dust = smoothstep(.47, .6, n2 + .35*(n - .5))*exp(-lw*lw/.03)*(.6 + .4*lon);
  vec3 c = mix(uMilkyColor, uMilkyColor2, clamp(core*(.35 + n)*lon*1.4, 0., 1.));
  float I = band*(.1 + 2.6*n*n*n)*(.3 + 1.4*lon*lon) + core*lon*lon*1.1*n;
  return c*I*(1. - .92*dust)*uMilky;
}
#endif

#ifdef NEBULA
vec3 nebula(vec3 d){
  vec3 q = d*uNebula.y + uNebula.z;
  float w = fbm3(q*.6 + 3.7, 2);
  vec3 qq = q + 2.2*(w - .5);
  float n = fbm3(qq, 4);
  float lo = 1. - uNebula.w;
  float a = smoothstep(lo*.62 + .16, lo*.62 + .46, n);
  if(a <= 0.) return vec3(0.);
  float m = fbm3(qq*1.7 + 9.1 + 1.5*w, 3);
  float fil = pow(1. - abs(2.*m - 1.), 5.);                 // thin bright filaments
  vec3 c = mix(uNebulaA, uNebulaB, smoothstep(.34, .66, m));
  c = c*a*a*(.5 + 1.0*n) + uNebulaC*fil*a*a*.5;
  c *= 1. - .7*smoothstep(.55, .8, fbm3(qq*2.6 - 5., 2))*a;    // dark dust
  return c * uNebula.x;
}
#endif

#ifdef AURORA
// Vertical curtains marched through height slices. The sheet width is widened to the step size along the
// ray (band-limited), so there is no striping at low elevations; plan-view folds come from summed sines.
float auroraFold(vec2 p, float t){
  return p.y + .95*sin(p.x*.52 + t*.21) + .5*sin(p.x*1.31 - t*.33 + 1.7) + .22*sin(p.x*3.07 + t*.52 + p.y*.7) + .4*sin(p.x*.23 + p.y*.61 - t*.11);
}
vec3 aurora(vec3 d, float jit, float px){
  if(d.y < .02) return vec3(0.);
  vec3 acc = vec3(0.);
  float t = uTime*uAurora.z, inv = uAurora.y/(d.y + .1), dh = 1.2/float(AURORA_STEPS);
  vec2 g = d.xz*inv;
  float lat = .36*px*inv/(d.y + .1);                           // sheet spacing per pixel, per unit of height
  float prev = auroraFold(g*(1. + (jit - 1.)*dh), t)*.27;
  float zen = smoothstep(.38, .92, d.y);                       // looking up along the sheets
  for(int i=0;i<AURORA_STEPS;i++){
    float f = (float(i) + jit)*dh/1.2, h = 1. + f*1.2;
    vec2 p = g*h;
    float w = auroraFold(p, t)*.27;
    float dw = w - prev, along = max(.035 + .2*zen, abs(dw)*1.3), wid = max(along, lat*h); prev = w;
    float id = floor(w + .5), x = (w - id)/wid;
    // slide this sample to where the ray actually meets the sheet, so slices blend without seams
    float fr = clamp((id - w)/(abs(dw) > 1e-4 ? dw : 1e-4), -1.5, 1.5)*smoothstep(.002, .02, abs(dw));
    float wide = smoothstep(.22, .5, wid);                     // sheets closer than a sample: use their average
    vec2 ps = p + g*(dh*fr); float fs = clamp(f + fr*dh/1.2, 0., 1.3);
    float amp = mix(.5 + .5*h11(id*7.13 + 2.), .75, wide)*(1. - smoothstep(10., 26., length(p)))*smoothstep(2., 4.2, length(ps));
    float par = .42 + .58*smoothstep(0., .35, abs(dw)/(length(g)*dh*.27 + 1e-4));   // a ray running along a sheet piles up less
    float sheet = mix(exp(-x*x), 1.77*wid, wide)*along/wid*mix(par, 1., wide);
    float rays = vn2(vec2(ps.x*7.5 + ps.y*2.5, id*13.7 + t*.3));
    rays = mix(.22 + .78*rays*rays*(.65 + .35*sin(ps.x*1.9 - t*.12 + id*3.1)), .42, wide);
    float prof = smoothstep(0., .08 + .6*zen, fs)*exp(-fs*(.7 + 2.8*(1. - rays)));
    vec3 col = mix(uAuroraA, uAuroraB, smoothstep(.2, .85, fs + .2*(amp - .5)));
    acc += col*sheet*(.3 + .7*rays)*prof*amp;
  }
  float az = dot(normalize(d.xz + 1e-5), normalize(uAuroraDir.xz + 1e-5));
  float mask = mix(1., smoothstep(-.35, .75, az), uAurora.w);
  float act = .5 + .5*vn2(g*.35 + vec2(t*.03, 7.));
  // a curtain closer than about two of its heights is seen from below as a broad featureless blob with a hard
  // lower edge, so sheets fade out as they come that close (amp, above) and a rayed corona owns the zenith
  acc *= 3.1*mask*act*smoothstep(.02, .14, d.y)*(1. - .82*zen);
  float rr = length(d.xz); vec2 rd = d.xz/(rr + 1e-4);
  float r1 = vn2(rd*8.3 + vec2(t*.05, 3.)), ray = r1*vn2(rd*21.7 + vec2(5., -t*.08)); ray = ray*ray*(.3 + 2.6*vn2(rd*57. + t*.11));
  float over = smoothstep(.5 + .2*(1. - r1), .9, d.y);          // rays of uneven length
  float cor = ray*smoothstep(.06, .4, rr)*over*(.35 + .65*act)*mix(1., .5 + .5*mask, uAurora.w);
  acc += mix(uAuroraB, uAuroraA, smoothstep(.25, .75, rr))*cor*1.5;
  return acc/(1. + 1.15*dot(acc, vec3(.3, .5, .2)))*uAurora.x;      // soft shoulder: looking up along a sheet stays coloured
}
#endif

#if NUM_BODIES > 0
// Moon / planet: ray-traced sphere at unit distance with phase shading, optional bands and rings.
// Returns premultiplied colour and coverage. This is the dear part, and it is static: with bake it is
// rendered once into a tile and body() only samples it.
vec4 bodySurface(int i, vec3 d, float pix){
  vec3 c = uBodyDir[i].xyz; float R = uBodyDir[i].w;
  float b = dot(d, c);
  vec4 ring = uBodyRing[i];
  vec3 L = uBodyLight[i].xyz, ax = uBodyAxis[i].xyz; float seed = uBodyAxis[i].w;
  float sa = length(d - c*b);
  float aa = pix*1.1 + 1e-6;
  float cover = (b > 0.) ? 1. - smoothstep(R - aa, R + aa, sa) : 0.;
  vec3 col = vec3(0.); float alpha = 0., tS = 1e9;
  if(cover > 0.){
    float tt = b - sqrt(max(b*b - 1. + R*R, 0.));
    vec3 n = normalize(d*tt - c); tS = tt;
    float ndl = dot(n, L);
    float lit = smoothstep(-.06, .32, ndl)*(.72 + .28*max(ndl, 0.));
    float lat = dot(n, ax);
    vec3 q = n*2.1 + seed;
    float tex = fbm3(q, 4), bands = uBodyColor[i].w, m;
    if(bands > 0.){
      float turb = fbm3(vec3(n.x*1.3, lat*7., n.z*1.3) + seed, 3) - .5;
      float s = sin(lat*bands + turb*5.5) * .5 + .5;
      m = mix(s, smoothstep(.2, .8, s), .6)*(.7 + .6*fbm3(vec3(lat*9., q.x*.7, q.z*.7), 2));
      float storm = smoothstep(.09, .0, length(vec2(lat + .28, fract(atan(n.z, n.x)/6.2832 + seed) - .5)*vec2(1., 2.2)));
      m = mix(m, 1.25, storm*.8);
    } else {
      m = smoothstep(.44, .68, tex) + .5*smoothstep(.58, .62, fbm3(q*3.3, 2));
    }
    vec3 alb = mix(uBodyColor[i].rgb, uBodyColor2[i].rgb, clamp(m*uBodyColor2[i].w, 0., 1.));
    alb *= .78 + .44*tex;
    if(ring.y > 0.){                                   // ring shadow on the globe
      float dn = dot(L, ax);
      float ts = -dot(n*R, ax)/(abs(dn) > 1e-4 ? dn : 1e-4);
      if(ts > 0.){ float rr = length(n*R + L*ts)/R;
        float sh = smoothstep(ring.x - .04, ring.x + .04, rr)*(1. - smoothstep(ring.y - .04, ring.y + .04, rr));
        lit *= 1. - .7*sh*ring.z; }
    }
    col = alb*(lit + uBodyLight[i].w);
    float rim = pow(1. - max(dot(n, -d), 0.), 3.);    // atmosphere on the limb
    col += uBodyAtmo[i]*rim*(lit*.9 + .08)*ring.w;
    alpha = cover;
  }
  if(ring.y > 0. && b > 0.){
    float dn = dot(d, ax);
    float tr = dot(c, ax)/(abs(dn) > 1e-5 ? dn : 1e-5);
    if(tr > 0.){
      vec3 w = d*tr - c; float rr = length(w)/R;
      float fw = min(pix*tr*1.2/(R*max(abs(dn), .04)), .2) + 1e-4;   // ring-plane footprint of a pixel, in radii
      float bandA = smoothstep(ring.x - fw, ring.x + fw, rr)*(1. - smoothstep(ring.y - fw, ring.y + fw, rr));
      if(bandA > 0.){
        float u = (rr - ring.x)/(ring.y - ring.x);
        float g = .5 + .5*vn1(u*9. + seed*3.) ;
        g *= .62 + .38*vn1(u*41. + seed);
        g *= 1. - .85*smoothstep(.035, .0, abs(u - .58));     // a clean gap
        g *= smoothstep(0., .12, u)*(.4 + .6*smoothstep(1., .75, u));
        float ra = bandA*clamp(g*ring.z*1.5, 0., 1.);
        float pl = dot(w, L); float perp = length(w - L*pl);
        float sh = (pl < 0.) ? smoothstep(R*.9, R*1.06, perp) : 1.;
        vec3 rc = uBodyRingColor[i].rgb*(.55 + .45*g)*(sh*(.4 + .6*abs(dot(ax, L))) + .5*uBodyLight[i].w);
        if(tr < tS){ col = mix(col, rc, ra); alpha = alpha + ra*(1. - alpha); }
        else { col = col*alpha + rc*ra*(1. - alpha); float na = alpha + ra*(1. - alpha); col /= max(na, 1e-4); alpha = na; }
      }
    }
  }
  return vec4(col*alpha, alpha);
}
void body(int i, vec3 d, float ext, float cut, float pix, inout vec3 space, inout vec3 glow){
  vec3 c = uBodyDir[i].xyz; float R = uBodyDir[i].w;
  float b = dot(d, c);
  vec4 ring = uBodyRing[i];
  if(b < cos(min(R*max(max(ring.y, 1.6), 1. + uBodyGlow[i].w*4.) + .02, 1.5))) return;
  float fadeH = mix(1., ext, uBodyRingColor[i].w)*cut;       // reaches zero before the below-horizon cut
  float sa = length(d - c*b);
  if(ring.w > 0. && sa > R - pix*1.1){                 // soft atmospheric halo outside the limb
    float e = exp(-(sa - R)/(R*.09));
    glow += uBodyAtmo[i]*e*ring.w*.35*smoothstep(-.4, .6, dot(normalize(d - c*b + 1e-6), uBodyLight[i].xyz))*fadeH;
  }
  if(uBodyGlow[i].w > 0.){ float x = max(sa - R, 0.)/(R*uBodyGlow[i].w); glow += uBodyGlow[i].rgb*(exp(-x*x*.5)*.35 + .65*exp(-x*2.2))*fadeH; }
#ifdef BAKED_BODIES
  vec2 q = vec2(dot(d, uBodyT1[i].xyz), dot(d, uBodyT2[i].xyz))*uBodyT1[i].w;
  float g = pix*uBodyT1[i].w*.5;                       // explicit gradients: this fetch sits behind a branch
  vec4 s = textureGrad(uBodyTex, vec2((float(i) + q.x*.5 + .5)/float(NUM_BODIES), q.y*.5 + .5), vec2(g/float(NUM_BODIES), 0.), vec2(0., g));
  s *= step(max(abs(q.x), abs(q.y)), .995)*step(0., b);
#else
  vec4 s = bodySurface(i, d, pix);
#endif
  space = space*(1. - s.a) + s.rgb*fadeH;
}
#endif
`,Ee=`
#if CLOUDS > 0
float cloudDensity(vec2 p, float th, float soft, int oct){
  return clamp((fbm2(p, oct) - th)/soft, 0., 1.);
}
// One fbm layer projected on a curved shell. rgb = colour, a = coverage.
vec4 cloudLayer(int k, vec3 d, vec3 back, float side, int oct){
  float y = d.y;
  if(y < .004) return vec4(0.);
  vec4 A = uCloudA[k], B = uCloudB[k], W = uCloudW[k];
  float rr = uCloudCurve;
  float s = sqrt(rr*rr*y*y + 2.*rr + 1.) - rr*y;            // distance to the shell, in shell heights
  vec2 uv = d.xz*s*A.z + W.xy*uTime + W.z;
  vec2 wq = vec2(vn2(uv*.42 + 3.1), vn2(uv*.42 + vec2(9.2, -4.7)));
  vec2 p = uv + (wq - .5)*mix(.7, 1.6, B.w);
  p = mix(p, vec2(p.x*.28 + p.y*.1, p.y + .22*sin(p.x*.5)), B.w);   // cirrus: stretched streaks
  float th = mix(.8, .2, A.x), soft = A.y;
  float e = fbm2(p, oct) - th;
  if(e < -.03) return vec4(0.);
  float det = fbm2(p*5.3 + 7. + W.xy*uTime*1.7, B.w < .5 ? 3 : 2);
  e -= (det - .3)*B.x*.11;                                   // erode the edges with fine detail
  float alpha = smoothstep(0., soft*.42, e);
  if(alpha <= 0.) return vec4(0.);
  float td = mix(soft*1.7, min(soft*1.7, max(.05, (.8 - th)*.75)), smoothstep(.25, .45, th));
  float thick = clamp(e/td, 0., 1.);                         // saturates slowly: drives the shading
  // light arriving through the cloud from the key-light side
  vec2 ld = uKeyDir.xz/(length(uKeyDir.xz) + .05) * (1. - .6*clamp(uKeyDir.y, 0., 1.));
  float shadow = 1.;
  if(B.w < .5){
    float ts = mix(soft*1.7, td, .6);
    float dS = cloudDensity(p + ld*.3, th, ts, oct - 2);
    float dS2 = cloudDensity(p + ld*.85, th, ts, oct - 3);
    shadow = exp(-(dS*1.5 + dS2*.9)*B.z);
  } else shadow = exp(-thick*B.z*1.2);
  float self = exp(-thick*B.z*.9);
  float light = clamp((shadow*.84 + self*.3 - .12)*(.64 + .72*det), 0., 1.);
  vec3 c = mix(uCloudShade[k], uCloudLit[k], light);
  // undersides pick up the horizon glow; thin edges near the light turn to silver
  c += uScatterColor*pow(side, uGrad.z*.6)*uGrad.y*.3*(.3 + .7*light)*(1. - B.w*.5);
  float ks = .5 + .5*dot(d, uKeyDir);
  float fs = pow(ks, 10.)*.35 + pow(ks, 90.)*1.6;
  c += uKeyColor*B.y*fs*exp(-thick*3.2)*(.4 + shadow);
  // a sun veiled by this layer is a luminous patch, not a disc: wide forward scatter plus a tight core
  float smu = max(dot(d, uSunDir), 0.);
  c += uSunColor*uVeil*(pow(smu, 64.)*.5 + pow(smu, 700.)*2.6)*(.2 + .8*exp(-thick*2.4))*(1. - .5*B.w);
  c += uFlashColor*uFlash*smoothstep(.35, .8, vn2(uv*.22 + floor(uTime*3.)*7.3))*3.*alpha;
  float hazeAmt = 1. - exp(-(s - 1.)*W.w);
  c = mix(c, back, hazeAmt);
  float a = alpha*A.w*smoothstep(.0, .1, y)*(1. - hazeAmt*.55);
  return vec4(c, a);
}
#endif

#ifdef BAKE_BODY
// build-time pass: one moon / planet (with its rings) into its tile; vDir.xy is the tile coordinate (-1..1)
void main(){
  vec2 q = vDir.xy/uBodyT1[uBakeBody].w; float r2 = dot(q, q);
  vec4 o = vec4(0.);
  if(r2 < 1.){
    vec3 d = normalize(uBodyDir[uBakeBody].xyz*sqrt(1. - r2) + uBodyT1[uBakeBody].xyz*q.x + uBodyT2[uBakeBody].xyz*q.y);
    o = bodySurface(uBakeBody, d, 2./(uBodyT1[uBakeBody].w*BAKE_SIZE));
  }
  gl_FragColor = o;
}
#elif defined(BAKE_PASS)
// build-time pass: the static deep-sky terms rendered once into a cube map
void main(){
  vec3 d = normalize(vDir), c = vec3(0.); float band = 0.;
  #ifdef NEBULA
  c += nebula(d);
  #endif
  #ifdef MILKY
  c += milkyWay(d, band);
  #endif
  gl_FragColor = vec4(c, band);
}
#else
void main(){
  vec3 d = normalize(vDir);
  float pix = length(fwidth(d));                         // angular size of a pixel; taken once, outside any branch
  vec3 atmo = atmosphere(d);
  float side = .5 + .5*dot(d, uSunDir);
  float ext = mix(1., smoothstep(-.03, .24, d.y), uHorizonFade);
  float cut = mix(1., smoothstep(-.04, -.015, d.y), step(.5, uHorizonFade));
  float jit = h21(gl_FragCoord.xy + fract(uTime*.37)*91.7);
  vec3 space = vec3(0.), glow = vec3(0.);
  if(d.y > -.04 || uHorizonFade < .5){
  float band = 0.;
#ifdef BAKED
  { vec4 bk = textureCube(uBake, d); space += bk.rgb; band = bk.a; }
#else
  #ifdef NEBULA
  space += nebula(d);
  #endif
  #ifdef MILKY
  space += milkyWay(d, band);
  #endif
#endif
#ifdef STARS
  float sb = 1.;
  #ifdef MILKY
  sb += 2.2*band*uMilky;
  #endif
  space += (starLayer(d, pix, 42., 3.1, 3.2, .45) + starLayer(d, pix, 110., 17.3, 1.1*sb, 1.) + starLayer(d, pix, 205., 41.7, .55*sb, min(sb*.7, 1.)))*uStars.x;
#endif
  space *= ext;
#ifdef AURORA
  space += aurora(d, .5 + (jit - .5)*.7, pix);
#endif
#if NUM_BODIES > 0
  for(int i=0;i<NUM_BODIES;i++) body(i, d, ext, cut, pix, space, glow);
#endif
  }
  vec3 col = atmo + space + glow;

  float below = smoothstep(-.012, .004, d.y);
  below = mix(1., below, uHorizonFade);
  vec3 disc, disc2 = vec3(0.);
  vec3 halo = sunLight(d, uSunDir, uSunColor, uSun, below, pix, disc);
#ifdef SUN2
  halo += sunLight(d, uSun2Dir, uSun2Color, uSun2, below, pix, disc2); disc += disc2;
#endif

#if CLOUDS > 0
  float cover = 0.;
  vec3 back = atmosphere(vec3(d.x, 0., d.z));
  #if CLOUDS > 1
  { vec4 c2 = cloudLayer(1, d, back, side, 4); col = mix(col, c2.rgb, c2.a); cover = c2.a; }
  #endif
  // discs sit behind the clouds and vanish in thick cloud (cloudLayer adds the veiled glow); the halo is mostly in front
  vec4 c1 = cloudLayer(0, d, back, side, CLOUD_OCT);
  float clear = (1. - c1.a)*(1. - c1.a)*(1. - cover);
  col += disc*clear + halo*(1. - .8*c1.a)*(1. - .35*cover);
  col = mix(col, c1.rgb, c1.a);
  col += halo*c1.a*.22;
#else
  col += disc + halo;
#endif

  if(d.y < 0.){                                         // below the horizon: haze falling into the ground colour
    float g = 1. - exp(d.y*uGrad.w);
    col = mix(col, uGround, g*uHorizonFade);
  }
  float n = (jit + h21(gl_FragCoord.yx*1.37 + 11.) - 1.);     // triangular dither
  col += n*uDither*(col*.03 + .0009);
  gl_FragColor = vec4(max(col, 0.), uOpacity);
}
#endif
`,Oe={coverage:.5,softness:.32,scale:1,opacity:.96,detail:.55,silver:1,absorb:1.75,stretch:0,wind:[.011,.004],haze:.17,lit:"#f6f2ea",shade:"#7d8eac"},Pe={coverage:.5,softness:.4,scale:.42,opacity:.5,detail:.25,silver:.6,absorb:.5,stretch:1,wind:[.004,.0015],haze:.1,lit:"#ffffff",shade:"#c3cee2"},Ne={elevation:35,azimuth:-35,size:2,color:"#e9e6dc",color2:"#8d8a86",texture:.75,bands:0,intensity:1,dark:.012,phase:null,phaseAngle:30,ring:null,atmosphere:null,atmosphereGlow:0,glow:0,glowColor:null,glowSize:3,axis:[.25,1,.1],horizonFade:.8},Ue={zenith:"#0f44ad",mid:null,horizon:"#8fbde8",ground:"#7890a4",horizonPow:4,midPow:1.5,groundFalloff:7,scatterColor:"#fff3dc",scatter:.3,scatterPow:5,scatterHigh:.14,scatterFall:3,sunElevation:48,sunAzimuth:35,sunColor:"#fff4e0",sunSize:1.5,sunIntensity:13,sunGlow:.7,sunGlowTight:.5,sun2:null,veil:1,stars:0,twinkle:.35,starDensity:1,starColor:.65,milkyWay:0,milkyAxis:[.55,.45,.7],milkyColor:"#7f93c8",milkyCore:"#f1d7b0",nebula:0,nebulaColors:["#3b1d86","#b3306e","#55d6ff"],nebulaScale:1.5,nebulaCoverage:.5,aurora:0,auroraColors:["#35ff9c","#a548ff"],auroraScale:1,auroraSpeed:1,auroraAzimuth:0,auroraSpread:.6,bodies:[],clouds:null,clouds2:null,cloudCurve:22,horizonFade:1,lightning:0,key:"sun",lightElevationMin:8,lightColor:"#fff2df",lightIntensity:3.2,ambientColor:"#a9c8ff",groundLight:"#6b6558",ambientIntensity:1.8,fogColor:null,dither:1,quality:1,opacity:1,bake:!1,bakeSize:512,renderer:null},_e={elevation:24,azimuth:40,color:"#a5d2ff",size:.6,intensity:12,glow:.6,glowTight:.7},we={day:{clouds:{},clouds2:{opacity:.32}},goldenHour:{zenith:"#1a479a",mid:"#5b84cc",horizon:"#f3c07c",ground:"#8a7a70",horizonPow:3.4,scatterColor:"#ff9e42",scatter:.7,scatterPow:4,sunElevation:11,sunAzimuth:18,sunColor:"#ffc680",sunSize:1.7,sunIntensity:13,sunGlow:.75,clouds:{coverage:.46,lit:"#ffd9a8",shade:"#6d6490",silver:1.5},clouds2:{lit:"#ffe3c0",shade:"#b294a2",opacity:.35},lightColor:"#ffc27e",lightIntensity:2.9,ambientColor:"#9fb4e4",groundLight:"#7a6450",ambientIntensity:1.5},sunset:{zenith:"#0c1848",mid:"#523a84",horizon:"#cf6a74",ground:"#33263f",horizonPow:4.5,midPow:1.6,scatterColor:"#ff7e1e",scatter:1,scatterPow:3,scatterHigh:.07,scatterFall:4,sunElevation:2.6,sunAzimuth:12,sunColor:"#ff9a48",sunSize:2,sunIntensity:12,sunGlow:1,sunGlowTight:.35,stars:.12,clouds:{coverage:.5,lit:"#ff8a4e",shade:"#352b58",silver:1.7,absorb:1.8},clouds2:{lit:"#ffa07a",shade:"#6f4a7c",opacity:.3,coverage:.4},lightColor:"#ff8f52",lightIntensity:2.3,ambientColor:"#7472b8",groundLight:"#6a4652",ambientIntensity:1.9},dawn:{zenith:"#1d3a7a",mid:"#7b83be",horizon:"#f2b4a6",ground:"#857a92",horizonPow:3.4,scatterColor:"#ffc68c",scatter:.6,scatterPow:5,sunElevation:4.5,sunAzimuth:-14,sunColor:"#ffd4aa",sunSize:1.8,sunIntensity:11,sunGlow:.7,stars:.07,clouds:{coverage:.34,lit:"#ffcdbc",shade:"#64638e",silver:1.3},clouds2:{lit:"#ffd6cc",shade:"#a28bae",opacity:.4,coverage:.6},lightColor:"#ffc4a0",lightIntensity:2.1,ambientColor:"#8c9fd6",groundLight:"#6a5a66",ambientIntensity:1.5},blueHour:{zenith:"#050c2a",mid:"#132d74",horizon:"#3a5ca2",ground:"#0c152c",horizonPow:4,scatterColor:"#e98058",scatter:.75,scatterPow:10,scatterHigh:0,scatterFall:6,sunElevation:-5,sunAzimuth:15,sunColor:"#ff9a6a",sunIntensity:0,sunGlow:.3,stars:.5,milkyWay:.2,bodies:[{elevation:24,azimuth:34,size:1.7}],clouds:{coverage:.36,lit:"#5a70aa",shade:"#1b2850",silver:.5},lightElevationMin:24,lightColor:"#7f9cff",lightIntensity:1.2,ambientColor:"#4460b4",groundLight:"#222a4a",ambientIntensity:2.3},night:{zenith:"#030816",mid:"#0a1836",horizon:"#152e5a",ground:"#040812",horizonPow:3.4,scatter:0,sunElevation:-35,sunAzimuth:160,sunIntensity:0,sunGlow:0,stars:1,milkyWay:1,bodies:[{elevation:36,azimuth:-38,size:2.1,phase:.93,intensity:.95,dark:.03,glow:.16,glowColor:"#9db8ff"}],key:0,clouds:{coverage:.32,softness:.38,lit:"#8398cc",shade:"#182446",opacity:.88,silver:.9,absorb:2},cloudShade:"#22325e",lightColor:"#a9c1ff",lightIntensity:1.2,ambientColor:"#3a5aa8",groundLight:"#18244a",ambientIntensity:2.2},polar:{zenith:"#020712",mid:"#071c2c",horizon:"#0e3842",ground:"#02080c",horizonPow:3.4,scatter:0,sunElevation:-30,sunAzimuth:180,sunIntensity:0,sunGlow:0,stars:.9,milkyWay:.5,aurora:1,cloudLit:"#1d4a55",cloudShade:"#0b1f2b",cloudLightColor:"#58ffb0",lightElevationMin:40,lightColor:"#7dffc8",lightIntensity:1,ambientColor:"#2c7888",groundLight:"#12303c",ambientIntensity:2.3},overcast:{zenith:"#5f6c7a",mid:"#8490a0",horizon:"#b4bbc0",ground:"#7b838a",horizonPow:2.5,scatterColor:"#e6dfcc",scatter:.4,scatterPow:3,sunElevation:42,sunColor:"#fff0d6",sunIntensity:10,sunGlow:.3,veil:.8,clouds:{coverage:.97,softness:.55,lit:"#d6d3cb",shade:"#59657a",absorb:1.5,silver:.5,scale:.8,detail:.7},clouds2:{coverage:.95,softness:.6,scale:.5,stretch:.25,opacity:1,lit:"#aab0b6",shade:"#6d7888",wind:[.006,.002]},lightColor:"#ece8e0",lightIntensity:1.1,ambientColor:"#aab6c6",groundLight:"#70726e",ambientIntensity:2.8},storm:{zenith:"#1a2129",mid:"#2b353e",horizon:"#586870",ground:"#1d2328",horizonPow:3,scatterColor:"#b4c8c0",scatter:.5,scatterPow:8,scatterHigh:.02,scatterFall:6,sunElevation:9,sunAzimuth:8,sunColor:"#d8e6dc",sunIntensity:0,sunGlow:.22,lightning:.7,cloudShade:"#37414c",clouds:{coverage:.84,softness:.4,scale:.75,lit:"#8f9aa2",shade:"#283039",absorb:2,silver:.5,wind:[.03,.012],detail:.75},clouds2:{coverage:.97,softness:.6,scale:.5,stretch:.3,opacity:1,lit:"#4b565f",shade:"#1a2027",wind:[.012,.005]},lightElevationMin:30,lightColor:"#aab6c4",lightIntensity:1.1,ambientColor:"#6a7688",groundLight:"#3a3d3c",ambientIntensity:2.6},alien:{zenith:"#110838",mid:"#371d78",horizon:"#22aea2",ground:"#0b2733",horizonPow:3.4,scatterColor:"#ff5a98",scatter:.7,scatterPow:6,sunElevation:15,sunAzimuth:22,sunColor:"#ffe0f0",sunSize:1.15,sunIntensity:13,sunGlow:.8,sun2:{elevation:24,azimuth:36,color:"#a5d2ff",size:.55,intensity:12,glow:.5},stars:.5,nebula:.22,nebulaColors:["#3b1d86","#17727a","#ff7ab8"],bodies:[{elevation:34,azimuth:-34,size:13,color:"#dcae82",color2:"#7b466c",bands:11,texture:.9,intensity:.9,dark:.02,phase:.6,phaseAngle:-18,ring:{inner:1.35,outer:2.25,color:"#ecd6bc",opacity:.85,tilt:17,roll:24},atmosphere:"#ffb0d0",atmosphereGlow:1,horizonFade:.6},{elevation:52,azimuth:8,size:1.5,color:"#bfe8e0",color2:"#4f7f86",intensity:1.1}],clouds2:{lit:"#ffc8de",shade:"#4a7f9a",opacity:.3,coverage:.45},cloudLit:"#ffc6dc",cloudShade:"#46488c",fogColor:"#9a86b4",lightColor:"#ffd3ea",lightIntensity:2.5,ambientColor:"#3fb0b0",groundLight:"#5a2a66",ambientIntensity:1.6},space:{zenith:"#000003",mid:"#000003",horizon:"#000003",ground:"#000003",scatter:0,horizonFade:0,sunElevation:22,sunAzimuth:40,sunColor:"#fff6ea",sunSize:.9,sunIntensity:10,sunGlow:.4,sunGlowTight:.9,stars:1.2,milkyWay:1,nebula:.75,twinkle:0,cloudLit:"#aab2c4",cloudShade:"#0c0f1a",lightColor:"#ffffff",lightIntensity:3,ambientColor:"#2a3566",groundLight:"#141026",ambientIntensity:1.5}},C=o=>o&&o.isColor?o.clone():Array.isArray(o)?new i.Color(o[0],o[1],o[2]):new i.Color(o),be=(o,e,t)=>(o.r+=e.r*t,o.g+=e.g*t,o.b+=e.b*t,o),re=(o,e=new i.Vector3)=>(o.isVector3?e.copy(o):e.set(o[0],o[1],o[2])).normalize();function ve(o,e,t=new i.Vector3){const s=o*Z,n=e*Z;return t.set(Math.sin(n)*Math.cos(s),Math.sin(s),-Math.cos(n)*Math.cos(s))}function Se(){let o=2654435769;return()=>{o=o+1831565813|0;let t=Math.imul(o^o>>>15,1|o);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}function ze(o,e,t){return t===!1||t===null||t===void 0&&!e?null:{...o,...e||{},...t&&t!==!0?t:{}}}function Ve(o){let e=o.preset||"day";we[e]||(console.warn('kit/sky: unknown preset "'+e+'", using "day". Known: '+Object.keys(we).join(", ")),e="day");const t=we[e],s={...Ue,...t};for(const f in o)o[f]!==void 0&&f!=="clouds"&&f!=="clouds2"&&f!=="sun2"&&(s[f]=o[f]);s.clouds=ze(Oe,t.clouds,o.clouds),s.clouds2=ze(Pe,t.clouds2,o.clouds2),s.sun2=ze(_e,t.sun2,o.sun2);const n=[...s.bodies||[]];o.moon&&n.push(o.moon),o.moons&&n.push(...o.moons),o.planets&&n.push(...o.planets);const r=o.bodyOverrides;if(r)for(const f in r){const p=Number(f);n[p]&&r[f]&&(n[p]={...n[p],...r[f],ring:r[f].ring&&n[p].ring?{...n[p].ring,...r[f].ring}:r[f].ring!==void 0?r[f].ring:n[p].ring})}return s.bodyList=n.slice(0,Fe),s.preset=e,s}function Ge(){const e=new Uint8Array(262144);let t=625341585;const s=()=>(t^=t<<13,t^=t>>>17,t^=t<<5,t>>>0&255);for(let r=0;r<256*256;r++)e[r*4]=s(),e[r*4+2]=s(),e[r*4+3]=255;for(let r=0;r<256;r++)for(let f=0;f<256;f++)e[(r*256+f)*4+1]=e[((r+17&255)*256+(f+37&255))*4];const n=new i.DataTexture(e,256,256,i.RGBAFormat);return n.wrapS=n.wrapT=i.RepeatWrapping,n.magFilter=n.minFilter=i.LinearFilter,n.generateMipmaps=!1,n.colorSpace=i.NoColorSpace,n.needsUpdate=!0,n}const He=new i.Vector3(1,0,0),Ce=new i.Vector3(0,1,0);function qe(o,e,t){const s=o.direction?re(o.direction):ve(o.elevation,o.azimuth),n=new i.Vector3().crossVectors(s,Math.abs(s.y)>.95?He:Ce).normalize(),r=new i.Vector3().crossVectors(n,s).normalize(),f=s.clone().negate();let p;if(o.phase==null)p=e.clone();else{const x=Math.acos(Math.min(1,Math.max(-1,2*o.phase-1))),v=(o.phaseAngle??30)*Z;p=f.clone().multiplyScalar(Math.cos(x)).addScaledVector(n,Math.sin(x)*Math.cos(v)).addScaledVector(r,Math.sin(x)*Math.sin(v))}const u=o.ring||null;let y;const h=u?u.tilt??18:o.axisTilt;if(Array.isArray(h)||h&&h.isVector3)y=re(h);else if(h!=null){const x=h*Z,v=((u?u.roll:o.axisRoll)??20)*Z;y=r.clone().multiplyScalar(Math.cos(x)*Math.cos(v)).addScaledVector(n,Math.cos(x)*Math.sin(v)).addScaledVector(f,Math.sin(x)).normalize()}else y=re(o.axis);const m=o.intensity??1,w=C(o.color).multiplyScalar(m),g=C(o.color2).multiplyScalar(m),l=C(u?u.color??"#e6d6c0":"#000000").multiplyScalar(m),b=C(o.atmosphere||"#000000");return{direction:s,t1:new i.Vector4(n.x,n.y,n.z,1/Math.min(.98,Math.sin(o.size*Z)*Math.max(u?u.outer??2.2:1,1)*1.1+.002)),t2:new i.Vector4(r.x,r.y,r.z,0),dir:new i.Vector4(s.x,s.y,s.z,Math.sin(o.size*Z)),color:new i.Vector4(w.r,w.g,w.b,o.bands||0),color2:new i.Vector4(g.r,g.g,g.b,o.texture??.75),light:new i.Vector4(p.x,p.y,p.z,o.dark??.012),axis:new i.Vector4(y.x,y.y,y.z,o.seed??t()*40),ring:new i.Vector4(u?u.inner??1.35:0,u?u.outer??2.2:0,u?u.opacity??.85:0,o.atmosphere?o.atmosphereGlow||1:0),ringColor:new i.Vector4(l.r,l.g,l.b,o.horizonFade??.8),atmo:new i.Vector3(b.r,b.g,b.b),glow:(()=>{const x=C(o.glowColor||o.color).multiplyScalar(o.glow||0);return new i.Vector4(x.r,x.g,x.b,o.glow>0?o.glowSize??3:0)})()}}function We(o){const e=s=>s&&typeof s=="object"&&!s.isTexture&&typeof s.clone=="function"?s.clone():s,t={};for(const s in o){const n=o[s].value;t[s]={value:Array.isArray(n)?n.map(e):ArrayBuffer.isView(n)?n.slice():e(n)}}return t}function it(o={}){const e=Ve(o),t=o.rng?o.rng.fork?o.rng.fork("sky"):o.rng:Se(),s=e.sunDirection?re(e.sunDirection):ve(e.sunElevation,e.sunAzimuth),n=e.bodyList.map(a=>qe({...Ne,...a},s,t)),r=[e.clouds,e.clouds2].filter(Boolean),f=e.milkyWay>0,p=e.stars>0||f,u=e.quality,y=C(e.zenith),h=C(e.horizon),m=C(e.ground),w=e.mid?C(e.mid):y.clone().lerp(h,.38),g=C(e.scatterColor),l=C(e.sunColor),b=C(e.lightColor),x=C(e.ambientColor),v=C(e.groundLight),S=typeof e.key=="number"?n[e.key]:null,L=(S?S.direction:s).clone(),R=Math.sin(e.lightElevationMin*Z);if(L.y<R){const a=Math.hypot(L.x,L.z)||1,d=Math.sqrt(1-R*R);L.set(L.x/a*d,R,L.z/a*d)}const _=(S?S.direction:s).clone();_.y<.03&&(_.y=.03,_.normalize());const P=C(e.cloudLightColor||(S?e.lightColor:e.sunColor)),D=(a,d,k,O)=>new i.Vector4(a,d,k,O),c={uNoiseTex:{value:e.noiseTexture||Ge()},uTime:{value:0},uOpacity:{value:e.opacity},uDither:{value:e.dither},uHorizonFade:{value:e.horizonFade},uZenith:{value:y},uMid:{value:w},uHorizon:{value:h},uGround:{value:m},uScatterColor:{value:g},uGrad:{value:D(e.horizonPow,e.scatter,e.scatterPow,e.groundFalloff)},uGrad2:{value:D(e.midPow,e.scatterHigh,e.scatterFall,0)},uSunDir:{value:s},uSunColor:{value:l},uSun:{value:D(Math.sin(e.sunSize*Z),e.sunIntensity,e.sunGlow,e.sunGlowTight)},uVeil:{value:e.sunIntensity>0?e.veil*Math.min(1,e.sunIntensity/10)*Math.min(1,Math.max(0,(s.y+.03)/.08)):0}},N={NUM_BODIES:n.length,CLOUDS:r.length,CLOUD_OCT:u<.75?4:u>=1.5?6:5,AURORA_STEPS:u<.75?9:u>=1.5?22:14};let X=null;if(e.sun2){const a=e.sun2;X=a.direction?re(a.direction):ve(a.elevation,a.azimuth),N.SUN2=1,c.uSun2Dir={value:X},c.uSun2Color={value:C(a.color)},c.uSun2={value:D(Math.sin(a.size*Z),a.intensity,a.glow,a.glowTight)}}if(p&&(N.STARS=1,c.uStars={value:D(e.stars,e.twinkle,e.starDensity,e.starColor)}),f){N.MILKY=1;const a=re(e.milkyAxis),d=new i.Vector3().crossVectors(a,Ce);d.lengthSq()<1e-4&&d.set(1,0,0),d.normalize().applyAxisAngle(a,(e.milkyAngle??25)*Z),c.uMilkyAxis={value:a},c.uMilkyCenter={value:d},c.uMilky={value:e.milkyWay},c.uMilkyColor={value:C(e.milkyColor)},c.uMilkyColor2={value:C(e.milkyCore)}}if(e.nebula>0){N.NEBULA=1;const a=e.nebulaColors;c.uNebulaA={value:C(a[0])},c.uNebulaB={value:C(a[1])},c.uNebulaC={value:C(a[2]??a[1])},c.uNebula={value:D(e.nebula,e.nebulaScale,e.nebulaSeed??t()*60,e.nebulaCoverage)}}if(e.aurora>0&&(N.AURORA=1,c.uAuroraA={value:C(e.auroraColors[0])},c.uAuroraB={value:C(e.auroraColors[1])},c.uAuroraDir={value:ve(0,e.auroraAzimuth)},c.uAurora={value:D(e.aurora,e.auroraScale,e.auroraSpeed,e.auroraSpread)}),n.length)for(const[a,d]of[["uBodyDir","dir"],["uBodyColor","color"],["uBodyColor2","color2"],["uBodyLight","light"],["uBodyAxis","axis"],["uBodyRing","ring"],["uBodyRingColor","ringColor"],["uBodyAtmo","atmo"],["uBodyGlow","glow"],["uBodyT1","t1"],["uBodyT2","t2"]])c[a]={value:n.map(k=>k[d])};if(r.length){const a=[r[0],r[1]||r[0]];c.uCloudA={value:a.map(d=>D(d.coverage,d.softness,d.scale*3.2,d.opacity))},c.uCloudB={value:a.map(d=>D(d.detail,d.silver,d.absorb,d.stretch))},c.uCloudW={value:a.map(d=>D(d.wind[0]*3.2,d.wind[1]*3.2,d.seed??t()*200,d.haze))},c.uCloudLit={value:a.map(d=>C(d.lit))},c.uCloudShade={value:a.map(d=>C(d.shade))},c.uCloudCurve={value:e.cloudCurve},c.uFlash={value:0},c.uFlashColor={value:C(e.flashColor||"#b9c8ff")},c.uKeyDir={value:_},c.uKeyColor={value:P}}const $=Re+Te+Ee;let J=null,V=null,oe=null;if(e.bake&&e.renderer){const a=e.renderer,d=Math.max(64,Math.round(e.bakeSize*(u<.75?.5:1))),k=Array.isArray(a.kitDefer)?a.kitDefer:null,O=[],A=k?We(c):c,F={uniforms:A,depthWrite:!1,depthTest:!1,fog:!1,toneMapped:!1,blending:i.NoBlending,side:i.DoubleSide},I=U=>()=>{const E=a.getRenderTarget(),q=a.getActiveCubeFace(),j=a.getActiveMipmapLevel(),ie=a.autoClear,te=a.shadowMap.autoUpdate;a.autoClear=!0,a.shadowMap.autoUpdate=!1;try{U()}finally{a.setRenderTarget(E,q,j),a.autoClear=ie,a.shadowMap.autoUpdate=te}},B=U=>{try{const E=a.properties.get(U).currentProgram;return!E||typeof E.isReady!="function"||E.isReady()}catch{return!0}},K=(U,E)=>{const q=I(E);return k?j=>{if(!j&&!B(U))return!1;q()}:q};if(N.NEBULA||N.MILKY){J=new i.WebGLCubeRenderTarget(Math.round(d*.75),{type:i.HalfFloatType,format:i.RGBAFormat,generateMipmaps:!1,minFilter:i.LinearFilter,magFilter:i.LinearFilter,depthBuffer:!1,colorSpace:i.NoColorSpace});const U=J,E=new i.ShaderMaterial({name:"KitSkyBake",...F,defines:{...N,BAKE_PASS:1},vertexShader:xe,fragmentShader:$}),q=new i.BoxGeometry(2,2,2),j=new i.Scene,ie=new i.Mesh(q,E);ie.frustumCulled=!1,j.add(ie);const te=new i.CubeCamera(.1,10,U);te.updateMatrixWorld(),te.coordinateSystem=a.coordinateSystem,te.updateCoordinateSystem();const me=te.children.slice();k&&O.push(I(()=>{a.setRenderTarget(U,0,0),a.compile(j,me[0])}));for(let Y=0;Y<6;Y++)O.push(K(E,()=>{a.setRenderTarget(U,Y,0),a.render(j,me[Y]),Y===5&&(U.texture.needsPMREMUpdate=!0,q.dispose(),E.dispose())}))}if(n.length){const U=n.length;V=new i.WebGLRenderTarget(d*U,d,{type:i.HalfFloatType,format:i.RGBAFormat,generateMipmaps:!0,minFilter:i.LinearMipmapLinearFilter,magFilter:i.LinearFilter,depthBuffer:!1,colorSpace:i.NoColorSpace}),V.texture.wrapS=V.texture.wrapT=i.ClampToEdgeWrapping,V.scissorTest=!0;const E=V;A.uBakeBody={value:0};const q=new i.ShaderMaterial({name:"KitSkyBodyBake",...F,defines:{...N,BAKE_BODY:1,BAKE_SIZE:d.toFixed(1)},vertexShader:Ie,fragmentShader:$}),j=new i.PlaneGeometry(2,2),ie=new i.Scene,te=new i.Mesh(j,q),me=new i.OrthographicCamera(-1,1,1,-1,0,1);te.frustumCulled=!1,ie.add(te),k&&O.push(I(()=>{E.viewport.set(0,0,d,d),E.scissor.set(0,0,d,d),a.setRenderTarget(E),a.compile(ie,me)}));for(let Y=0;Y<U;Y++)O.push(K(q,()=>{A.uBakeBody.value=Y,E.viewport.set(Y*d,0,d,d),E.scissor.set(Y*d,0,d,d),a.setRenderTarget(E),a.render(ie,me),Y===U-1&&(j.dispose(),q.dispose(),delete A.uBakeBody)}))}if(k){const U=O.map(E=>{let q=!1;return j=>{if(!q){if(E(j)===!1)return!1;q=!0}}});for(const E of U)k.push(E);oe=()=>{oe=null;for(const E of U)E(!0)}}else for(const U of O)U();J&&(N.BAKED=1,c.uBake={value:J.texture}),V&&(N.BAKED_BODIES=1,c.uBodyTex={value:V.texture})}const W=new i.ShaderMaterial({name:"KitSky",uniforms:c,defines:N,vertexShader:xe,fragmentShader:$,side:i.DoubleSide,depthWrite:!1,depthTest:!0,fog:!1,toneMapped:!1,transparent:!1}),ae=e.renderOrder??-1,ne=(a,d,k)=>{const O=new i.Mesh(a,d);return O.name=k,O.frustumCulled=!1,O.renderOrder=ae,O};let z,M=null,T=null;if(e.horizonFade>=.5){const a=k=>{const A=[0,k,0],F=[];for(let B=0;B<16;B++){const K=B/16*Math.PI*2;A.push(Math.cos(K),-.045,Math.sin(K)),F.push(0,1+B,1+(B+1)%16)}const I=new i.BufferGeometry;return I.setAttribute("position",new i.Float32BufferAttribute(A,3)),I.setIndex(F),I},d={NUM_BODIES:0,CLOUDS:0,CLOUD_OCT:4,AURORA_STEPS:1};N.SUN2&&(d.SUN2=1),M=new i.ShaderMaterial({name:"KitSkyLow",uniforms:c,defines:d,vertexShader:xe,fragmentShader:$,side:i.DoubleSide,depthWrite:!1,depthTest:!0,fog:!1,toneMapped:!1,transparent:!1}),z=ne(a(1),W,"sky"),T=ne(a(-1),M,"skyLower"),z.add(T)}else z=ne(new i.BoxGeometry(2,2,2),W,"sky");const H=a=>{z.renderOrder=a,T&&(T.renderOrder=a)};if(oe){const a=()=>{oe&&oe()};z.onBeforeRender=a,T&&(T.onBeforeRender=a)}if(M){let a=W.transparent;Object.defineProperty(W,"transparent",{configurable:!0,enumerable:!0,get:()=>a,set:d=>{a=!!d,M.transparent=a}})}e.transparent&&(W.transparent=!0);const G=(a,d=new i.Color)=>{const k=1-Math.min(1,Math.max(0,a.y));d.copy(y).lerp(w,Math.pow(k,e.midPow)).lerp(h,Math.pow(k,e.horizonPow));const O=.5+.5*a.dot(s),A=Math.pow(O,e.scatterPow)*(e.scatterHigh+(1-e.scatterHigh)*Math.pow(k,e.scatterFall));return d.lerp(g,Math.min(1,Math.max(0,A*e.scatter))),a.y<0&&d.lerp(m,(1-Math.exp(a.y*e.groundFalloff))*e.horizonFade),d};let ee;if(e.fogColor)ee=C(e.fogColor);else{ee=new i.Color(0,0,0);const a=Math.atan2(s.x,-s.z),d=new i.Vector3,k=new i.Color,O=[20,-20,60,-60,120,-120],A=[.2,.2,.18,.18,.12,.12];O.forEach((F,I)=>{const B=a+F*Z;d.set(Math.sin(B),.03,-Math.cos(B)).normalize(),G(d,k),ee.r+=k.r*A[I],ee.g+=k.g*A[I],ee.b+=k.b*A[I]})}const Q=r[0],de=Math.min(1,e.lightIntensity/3),fe=e.cloudLit?C(e.cloudLit):Q&&!Q.stretch?C(Q.lit):b.clone().lerp(new i.Color(1,1,1),.25).multiplyScalar(.25+.7*de),he=e.cloudShade?C(e.cloudShade):Q&&!Q.stretch?C(Q.shade):x.clone().multiplyScalar(.55*Math.min(1.2,e.ambientIntensity+.3)),le=t()*100,se=e.sunIntensity,ge=e.sun2?e.sun2.intensity:0,pe=a=>a-Math.floor(a),ue={object:z,material:W,materialLow:M,uniforms:c,preset:e.preset,options:e,noiseTexture:c.uNoiseTex.value,sunDirection:s,sun2Direction:X,lightDirection:L,keyDirection:_,bodyDirections:n.map(a=>a.direction),sunColor:l,lightColor:b,lightIntensity:e.lightIntensity,ambientColor:x,groundColor:v,ambientIntensity:e.ambientIntensity,fogColor:ee,horizonColor:h,zenithColor:y,cloudLit:fe,cloudShade:he,keyColor:P,flash:0,opacity:1,baked:!!(J||V),colorAt:G,setOpacity(a){a=Math.min(1,Math.max(0,a)),c.uOpacity.value=a,z.visible=a>.001,H(a<.999?ae+.5:ae),c.uSun.value.y=se*a*a,c.uSun2&&(c.uSun2.value.y=ge*a*a),ue.opacity=a},prewarm(a=e.renderer,d=null,k=null){if(!a)return Promise.resolve();const O=z.visible,A=a.getRenderTarget(),F=new i.WebGLRenderTarget(1,1,{depthBuffer:!1}),I=d||new i.PerspectiveCamera;let B=null;M&&M.transparent!==W.transparent&&(M.transparent=W.transparent),z.visible=!0;try{a.setRenderTarget(F),B=a.compileAsync?a.compileAsync(z,I,k||void 0):a.compile(z,I,k||void 0)}catch{B=null}return a.setRenderTarget(A),F.dispose(),z.visible=O,Promise.resolve(B).then(()=>{},()=>{})},dispose(){J&&(J.dispose(),J=null),V&&(V.dispose(),V=null)},update(a,d,k){if(c.uTime.value=d,k&&z.position.copy(k.position),M&&M.transparent!==W.transparent&&(M.transparent=W.transparent,M.needsUpdate=!0),e.lightning>0&&c.uFlash){const A=Math.floor(d/2.6),F=pe(Math.sin(A*127.1+le)*43758.5453);let I=0;if(F<e.lightning){const B=d-(A+.15+.5*pe(F*57.3))*2.6;B>0&&(I=Math.exp(-B*7)*(.55+.45*Math.sin(B*60+F*20)**2))}ue.flash=I,c.uFlash.value=I}}};return e.opacity<1&&ue.setOpacity(e.opacity),ue}const Ke=16,Me=`
uniform vec3 uHazeSun, uHazeAway, uHazeDir; uniform vec4 uHazeP;   // azimuth power, use sky haze (0/1), range start, range end
vec3 hazeColor(vec3 V, vec3 base){
  float len = length(uHazeDir.xz);
  float side = .5 + .5*dot(normalize(V.xz + 1e-5), uHazeDir.xz);
  vec3 skyHaze = mix(uHazeAway, uHazeSun, pow(clamp(side/(.5 + .5*len), 0., 1.), uHazeP.x));
  return mix(base, skyHaze, uHazeP.y);
}
// large-scale light on a cloud surface element (shared so the deck and the puffs agree)
float cloudTone(vec3 n, float back, vec3 S){
  float top = clamp(n.y, 0., 1.), ndl = dot(n, S);
  ndl *= ndl > 0. ? 1. : .55;                                   // the far side keeps some skylight
  return .56 + .62*ndl*(1. - .6*back) + .12*n.y - .12*back*(1. - .8*top) + .07*back*top;
}
`,je=`
attribute vec4 iPos;      // xyz centre, w radius
attribute vec4 iData;     // seed, base occlusion, alpha, flat-base height
attribute vec4 iNrm;      // xyz offset from the cloud core (-1..1): the large-scale normal; w tier (1 = far ring)
uniform float uTime; uniform vec3 uDrift, uSunDir; uniform vec4 uWrap, uFade, uFade2; uniform vec2 uLight;
#if AVOID > 0
uniform vec4 uAvoidA[AVOID], uAvoidB[AVOID];
#endif
varying vec2 vUv, vOut, vProj, vAux; varying vec4 vData, vLit, vHaze; varying vec3 vNrm, vWorld; varying float vViewZ;
#include <fog_pars_vertex>
#ifdef USE_FOG
uniform vec3 fogColor;
#endif
${Me}
void main(){
  vec3 c = (modelMatrix*vec4(iPos.xyz + uDrift, 1.)).xyz;
  float fade = 1., tier = iNrm.w;
#ifdef WRAP
  vec2 wrap = mix(uWrap.xy, uWrap.zw, tier);
  c.xz = mod(c.xz - cameraPosition.xz + wrap*.5, wrap) - wrap*.5 + cameraPosition.xz;
  vec2 ed = abs(c.xz - cameraPosition.xz)/wrap*2.;
  fade *= 1. - smoothstep(.72, .98, max(ed.x, ed.y));
#endif
  float seed = iData.x;
  float size = iPos.w*(1. + .045*sin(uTime*.23 + seed*37.));
#if AVOID > 0
  // keep clear of solids: a puff shrinks to fit the gap and fades away when there is no room left
  float room = 1e9;
  for(int i=0;i<AVOID;i++){
    vec4 A = uAvoidA[i], B = uAvoidB[i]; float rm;
    if(B.z < .5) rm = distance(c, A.xyz) - A.w;                                   // sphere
    else {                                                                        // upright cone frustum
      float t = clamp((A.y - c.y)/max(A.y - B.x, 1e-3), 0., 1.);
      float dxz = length(c.xz - A.xz) - mix(A.w, B.y, t), dy = max(c.y - A.y, B.x - c.y);
      rm = dy > 0. ? length(vec2(max(dxz, 0.), dy)) : dxz;
    }
    room = min(room, rm);
  }
  float fit = clamp(room/(size*.78), 0., 1.);
  fade *= smoothstep(.3, .95, fit); size *= max(fit, .3);
#endif
  vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec2 uv = position.xy*1.5;                                  // the eroded blob rarely reaches past r = .75
  // flat base: the part of the quad under the base is never rasterised (saves fill)
  if(up.y > .25) uv.y = max(uv.y, min(((iData.w - size*.12 - c.y)/size - right.y*uv.x)/up.y, .75));
  vUv = uv;
  vWorld = c + (right*uv.x + up*uv.y)*size;
  vec4 mvPosition = viewMatrix*vec4(vWorld, 1.);
  gl_Position = projectionMatrix*mvPosition;
  vViewZ = mvPosition.z; vProj = vec2(projectionMatrix[2][2], projectionMatrix[3][2]);
  float dist = distance(c, cameraPosition);
  fade *= mix(smoothstep(size*uFade.x, size*uFade.y, dist)*(1. - smoothstep(uFade.z, uFade.w, dist)),
              smoothstep(uFade2.x, uFade2.y, dist)*(1. - smoothstep(uFade2.z, uFade2.w, dist)), tier);
  // large-scale light: which side of the whole cloud this puff sits on, and how high
  vec3 V = normalize(c - cameraPosition);
  float mu = dot(V, uSunDir), mup = max(mu, 0.);
  float back = mup*mup;                                        // 1 when looking into the light
  float big = max(cloudTone(iNrm.xyz, back, uSunDir) - iData.y, uLight.x);
  float sil = smoothstep(.4, .95, length(iNrm.xyz - V*dot(iNrm.xyz, V)));   // puffs on the cloud's outline as seen from here
  float mu6 = back*back*back, mu36 = mu6*mu6*mu6; mu36 *= mu36;
  float crest = clamp(1. - iData.y*5., 0., 1.);                             // top / crest puffs: the ones light gets through
  float tight = (mu6*.24 + mu36*mu6*1.3)*(.12 + .88*sil)*(.35 + .65*crest); // silver lining close to the sun
  float broad = .215/pow(1.16 - .8*mu, 1.5)*(.1 + .9*sil)*crest;            // Henyey-Greenstein g = .4: rims at any angle
  float ang = size*projectionMatrix[1][1]/max(dist, 1.);                    // size on screen, in half-heights
  vData = vec4(seed, big, iData.z*fade, iData.w); vNrm = iNrm.xyz;
  vLit = vec4(size, tight, broad, mix(1., .66, smoothstep(.08, .45, ang)));
  vAux = vec2(1. - .7*back, .8 + .5*dot(iNrm.xyz, iNrm.xyz));
  // haze is taken once per puff: the sky's horizon colour in this azimuth, and the sea's own distance haze
  #ifdef USE_FOG
  vHaze.rgb = hazeColor(V, fogColor);
  #else
  vHaze.rgb = hazeColor(V, uHazeAway);
  #endif
  vHaze.a = .85*smoothstep(uHazeP.z, uHazeP.w, distance(c.xz, cameraPosition.xz));
  vOut = vec2(dot(iNrm.xyz, right), dot(iNrm.xyz, up)); vOut /= length(vOut) + .15;
  if(fade <= 0.) gl_Position = vec4(2., 2., 2., 1.);          // culled
  #include <fog_vertex>
}`,Ye=`
precision highp float;
uniform sampler2D uNoise;
uniform float uTime, uSilver, uFogFade; uniform vec3 uSunDir, uSunColor, uLit, uShade, uBottom; uniform vec4 uShape; uniform vec2 uShape2, uLight;
varying vec2 vUv, vOut, vProj, vAux; varying vec4 vData, vLit, vHaze; varying vec3 vNrm, vWorld; varying float vViewZ;
#include <fog_pars_fragment>
void main(){
  float r2 = dot(vUv, vUv), r = sqrt(r2), seed = vData.x;
  vec4 t = texture2D(uNoise, vUv*uShape.w*.11 + seed*vec2(3.71, 9.17) + uTime*vec2(.0014, .0009));
  float lump = mix(t.r, t.g, .26 + .2*uShape2.x);              // big lobes plus cauliflower detail
  float ero = lump*uShape.x*(.25 + .75*r)*vAux.y;
  float e = (1. - r) - ero;
  float a = smoothstep(0., uShape.y*vLit.w, e)*(1. - smoothstep(.63, .75, max(abs(vUv.x), abs(vUv.y))));
  a *= smoothstep(vData.w - vLit.x*.1, vData.w + vLit.x*.32, vWorld.y);      // flat cumulus base
  a *= vData.z;
  // surface normal: a sphere bent by the slope of the erosion field, so the shading follows the lumps you see
  vec2 gn = vec2(dFdx(ero), dFdy(ero))/max(vec2(abs(dFdx(vUv.x)), abs(dFdy(vUv.y))), vec2(1e-5));
  gn = clamp(gn, -4., 4.);
  vec3 Nv = normalize(vec3(vUv*.5 + gn*uShape.z*.3, sqrt(max(1. - r2, 0.)) + .4));
  vec3 N = (vec4(Nv, 0.)*viewMatrix).xyz;
  float light = max(vData.y + dot(N, uSunDir)*.3*vAux.x - (lump - .5)*(.2 + .3*vAux.x), uLight.x*.55);   // folds sit in their own shade
  light = smoothstep(.08, .98, light);
  vec3 col = mix(mix(uBottom, uShade, smoothstep(-.5, .7, vNrm.y + N.y*.5)), uLit, light);
  // light coming through the thin edge of the cloud's outline: broad forward scatter, silver close to the sun
  float thin = 1. - smoothstep(0., .5, e);
  float rim = (vLit.z*.56 + vLit.y)*thin*smoothstep(-.1, .75, dot(vUv, vOut)/(r + .05)) + vLit.y*.08;
  col += uSunColor*(uSilver*rim);
  #ifdef USE_FOG
    #ifdef FOG_EXP2
    float fogFactor = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
    float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col = mix(col, vHaze.rgb, fogFactor); a *= 1. - fogFactor*uFogFade;
  #endif
  col = mix(col, vHaze.rgb, vHaze.a);
  if(a < .012) discard;
  #ifdef IMPOSTOR
  // sphere-impostor depth: solid geometry cuts a puff along a lumpy contour instead of a straight plane
  float bulge = sqrt(max(1. - r2*1.6, 0.))*.8 - (lump - .5)*.6;
  float zv = min(vViewZ + max(bulge, 0.)*vLit.x*uShape2.y, -.35);
  gl_FragDepth = clamp((vProj.x*zv + vProj.y)/(-zv)*.5 + .5, 0., 1.);
  #endif
  gl_FragColor = vec4(col, a);
}`,Ze=`
varying vec3 vWorld;
#include <fog_pars_vertex>
void main(){
  vec4 w = modelMatrix*vec4(position, 1.); vWorld = w.xyz;
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Xe=`
precision highp float;
uniform sampler2D uNoise;
uniform float uTime, uRadius, uScale, uBump, uSilver, uFogFade; uniform vec3 uDrift, uSunDir, uSunColor, uLit, uShade, uBottom; uniform vec2 uLight;
varying vec3 vWorld;
#include <fog_pars_fragment>
${Me}
float field(vec2 p, float b, float w){ vec2 t = texture2D(uNoise, p, b).rg; return t.r + (t.g - t.r)*w; }
void main(){
  // the floor under the puffs: a billowing height field shaded with the puffs' own light, so the sea keeps
  // its relief out to the haze (trilinear + anisotropic filtering flattens it smoothly with distance)
  vec2 p = (vWorld.xz - uDrift.xz)*uScale, p2 = p*3.7 + .31;
  float d = length(vWorld.xz - cameraPosition.xz);
  const float E = .009;
  vec3 V = normalize(vWorld - cameraPosition);
  // seen at a grazing angle only the crests of a cloud sea show: relief, troughs and fine detail fade with the view angle
  float gz = smoothstep(.03, .34, -V.y), fine = gz*(1. - smoothstep(250., 1500., d)), lb = 1.6*(1. - gz);
  float wf = .4*gz;                                            // share of the finer octaves in the billows
  float h0 = field(p, lb, wf), k0 = field(p2, lb, .4);
  vec2 g = vec2(field(p + vec2(E, 0.), lb, wf) - h0, field(p + vec2(0., E), lb, wf) - h0)/E*(.3 + .7*gz);
  float m = mix(.6, h0*.72 + mix(h0, k0, fine*.5)*.28, .25 + .75*gz);
  vec3 n = normalize(vec3(-g.x*uBump, 1., -g.y*uBump));
  float mu = dot(V, uSunDir), mup = max(mu, 0.), back = mup*mup;
  float tone = max(cloudTone(n*.8, back, uSunDir) + (m - .56)*.5 - .06, uLight.x);      // troughs in shade; the floor sits under the puffs
  float light = smoothstep(.08, .98, tone);
  vec3 col = mix(mix(uBottom, uShade, smoothstep(.1, .45, m)), uLit, light);
  // low light skimming the crests on the sun side
  col += uSunColor*uSilver*pow(mup, 10.)*.1*(.4 + .9*m);
  vec3 hz = hazeColor(V, uHazeAway);
  float a = 1. - smoothstep(uRadius*.5, uRadius*.97, d);                    // the far sea dissolves into the sky itself
  #ifdef USE_FOG
    hz = hazeColor(V, fogColor);
    #ifdef FOG_EXP2
    float fogFactor = 1. - exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
    float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col = mix(col, hz, fogFactor); a *= 1. - fogFactor*uFogFade*.5;
  #endif
  col = mix(col, hz, .85*smoothstep(uHazeP.z, uHazeP.w, d));
  gl_FragColor = vec4(col, a);
}`,$e=1024;function Je(o,e,t,s,n,r,f,p,u,y){for(let h=u;h<y;h++){const m=n[h]*t,w=r[h]*t,g=f[h];for(let l=0,b=h*p;l<p;l++,b++){const x=e[m+n[l]],v=e[m+r[l]],S=e[w+n[l]],L=e[w+r[l]],R=f[l];o[b]+=s*(x+(v-x)*R+(S+(L-S)*R-x-(v-x)*R)*g)}}}function Qe(o,e,t,s,n,r,f){const p=u=>Math.max(0,Math.min(255,((u/s-.5)*1.75+.5)*255));for(let u=r;u<f;u++)for(let y=0,h=u*n;y<n;y++,h++)o[h*4]=p(e[h]),o[h*4+1]=p(t[h])}function et(o,e,t,s){const n=e-1;for(let r=t;r<s;r++)for(let f=0;f<e;f++){const p=r*e+f,u=(r+89&n)*e+(f+151&n),y=(r+33&n)*e+(f+201&n);o[p*4+2]=o[u*4],o[p*4+3]=o[y*4]}}function*tt(o,e=256){const t=e*e,s=[new Float32Array(t),new Float32Array(t)],n=Math.max(1,Math.round($e/e)),r=new Int32Array(e),f=new Int32Array(e),p=new Float32Array(e);yield;for(let m=0;m<2;m++){const w=s[m];for(let g=0,l=m?16:4,b=.5;g<4;g++,l*=2,b*=.55){const x=new Float32Array(l*l);for(let v=0;v<x.length;v++)x[v]=o();for(let v=0;v<e;v++){const S=v/e*l,L=Math.floor(S),R=S-L;r[v]=L%l,f[v]=(L+1)%l,p[v]=R*R*(3-2*R)}for(let v=0;v<e;v+=n)Je(w,x,l,b,r,f,p,e,v,Math.min(e,v+n)),yield}}const u=.5*(1+.55+.55**2+.55**3),y=new Uint8Array(t*4);for(let m=0;m<e;m+=n)Qe(y,s[0],s[1],u,e,m,Math.min(e,m+n)),yield;for(let m=0;m<e;m+=n)et(y,e,m,Math.min(e,m+n)),yield;const h=new i.DataTexture(y,e,e,i.RGBAFormat);return h.wrapS=h.wrapT=i.RepeatWrapping,h.magFilter=i.LinearFilter,h.minFilter=i.LinearMipmapLinearFilter,h.anisotropy=4,h.generateMipmaps=!0,h.colorSpace=i.NoColorSpace,h.needsUpdate=!0,h}const ce=12;function ot(o,e,t){const[s,n]=o.extent,r=o.center[0],f=o.center[2],p=o.at?o.at.map(u=>({x:u[0],y:u[1],z:u[2],w:u[3]})):[];for(let u=0,y=0;!o.at&&u<o.count&&y<o.count*30;y++){const h=o.size[0]+(o.size[1]-o.size[0])*e()**1.6,m=r+(e()-.5)*s,w=f+(e()-.5)*n,g=o.altitude+(e()-.5)*o.altitudeJitter;o.filter&&!o.filter(m,g,w,h)||(p.push({x:m,y:g,z:w,w:h}),u++)}for(const u of p){const y=u.w??o.size[1],h=y*o.height*(.75+.5*e()),m=[{x:0,z:0,r:y*.5,h}];for(let w=1+Math.floor(e()*3);w>0;w--){const g=e()*6.283,l=y*(.22+.3*e());m.push({x:Math.cos(g)*l,z:Math.sin(g)*l,r:y*(.28+.2*e()),h:h*(.35+.45*e())})}for(let w=0;w<o.puffs;w++){const g=m[e()<.45?0:Math.floor(e()*m.length)],l=e()**1.25,b=e()*6.283,x=g.r*(1-.62*l**1.4)*Math.sqrt(e()),v=y*(.3-.13*l)*(.8+.4*e()),S=g.x+Math.cos(b)*x,L=g.z+Math.sin(b)*x,R=l*g.h+v*.5;let _=S/(y*.62),P=(R-h*.38)/(h*.62),D=L/(y*.62);const c=Math.hypot(_,P,D);c>1&&(_/=c,P/=c,D/=c),t(u.x+S,u.y+R,u.z+L,v,e(),.22*(1-l),1,u.y,_,P,D,0)}}}function Ae(o,e,t){const s=[];for(let r=0;r<7;r++){const f=Math.floor(o()*4)*(o()<.5?-1:1),p=1+Math.floor(o()*4);s.push({k:f,l:p,a:1/(Math.abs(f)+p),p:o()*6.283})}const n=s.reduce((r,f)=>r+f.a,0);return(r,f)=>{let p=0;for(const u of s)p+=u.a*Math.sin(6.283185*(u.k*r/e+u.l*f/t)+u.p);return p/n}}function at(o,e,t){const[s,n]=o.extent,r=o.spacing,f=Math.max(2,Math.round(s/r)),p=Math.max(2,Math.round(n/r)),u=Ae(e,s,n);for(let y=0;y<p;y++)for(let h=0;h<f;h++){const m=(h+.5+(e()-.5)*.9)/f*s-s/2,w=(y+.5+(e()-.5)*.9)/p*n-n/2,g=u(m,w),l=Math.max(0,g)**1.5,b=r*(.72+.62*e()**1.5)*(1+.45*l),x=o.altitude-b*.55+g*o.relief+(e()-.5)*r*.25,v=r*.5,S=(u(m+v,w)-u(m-v,w))/(2*v)*o.relief,L=(u(m,w+v)-u(m,w-v))/(2*v)*o.relief,R=Math.hypot(S,1,L)/.8;if(t(m,x,w,b,e(),.22*Math.max(0,.4-g),1,-1e6,-S/R,1/R,-L/R,0),g>.34&&e()<o.towers){const _=1+Math.floor(e()*2.4);let P=x+b*.5,D=b*.8;for(let c=0;c<_;c++)P+=D*.6,D*=.82,t(m+(e()-.5)*D*.7,P,w+(e()-.5)*D*.7,D,e(),0,1,-1e6,(e()-.5)*.5,.75,(e()-.5)*.5,0)}}if(o.farRing){const y=o.farExtent,h=r*o.farSpacing,m=Math.max(2,Math.round(y/h)),w=Ae(e,y,y),g=o.altitude-r*(.6+o.deckDrop);for(let l=0;l<m;l++)for(let b=0;b<m;b++){const x=(b+.5+(e()-.5)*.95)/m*y-y/2,v=(l+.5+(e()-.5)*.95)/m*y-y/2,S=w(x,v),L=e(),R=e(),_=e();if(S<-.42)continue;const P=h*(.42+.5*L**1.8)*(1+.45*Math.max(0,S)),D=g-P*.34+(.5+.5*S)*P*.5+(_-.5)*r*.3,c=h*.5,N=(w(x+c,v)-w(x-c,v))/(2*c)*P,X=(w(x,v+c)-w(x,v-c))/(2*c)*P,$=Math.hypot(N,1,X)/.8;t(x,D,v,P,R,.12*Math.max(0,.3-S),1,g-P*.25,-N/$,1/$,-X/$,1)}}}const ke=o=>.3+.7*Math.min(1,o.lightIntensity/2.2),De=o=>.2+.06*Math.min(3,o.lightIntensity);function ye(o,e,t,s){const n=o.sunDirection,r=Math.hypot(n.x,n.z)||1;return o.colorAt(s.set(n.x/r*e,.03,n.z/r*e).normalize(),t)}function rt(o={}){const e=Be(o);let t;for(;!(t=e.next()).done;);return t.value}async function nt(o={},e){const t=Be(o);let s;for(;!(s=t.next()).done;)e&&await e();return s.value}function*Be(o){const e=o.mode==="sea",t={mode:"cumulus",sky:null,center:[0,0,0],extent:e?[2e3,2e3]:[1800,1800],altitude:e?0:220,altitudeJitter:90,count:9,size:[150,330],height:.72,puffs:48,spacing:92,relief:55,towers:.3,at:null,filter:null,avoid:null,wind:e?[2.5,0,1]:[1.5,0,.6],wrap:e,opacity:e?.85:.8,silver:1,noiseTexture:null,erode:.95,softness:.36,bump:.8,detail:2.1,crisp:1,depth:1,nearFade:[.35,1.5],farFade:null,fogFade:.75,deck:e,deckRadius:3600,deckDrop:.1,hazeColor:null,farRing:e,farSpacing:2.7,farExtent:null,sort:!0,sunDirection:[.4,.6,-.5],sunColor:"#fff2dc",litColor:"#f6f2ea",shadeColor:"#7d8eac",bottomColor:null,...o},s=t.rng?t.rng.fork?t.rng.fork("clouds"):t.rng:Se(),n=Math.max(t.extent[0],t.extent[1]);t.farExtent||(t.farExtent=Math.max(n*1.6,Math.min(t.deckRadius*1.56,5600)));const r=[],f=(z,M,T,H,G,ee,Q,de,fe,he,le,se)=>{r.push(z,M,T,H,G,ee,Q*t.opacity,de,fe,he,le,se)};e?at(t,s,f):ot(t,s,f);const p=r.length/ce,u=new Float32Array(r),y=new Float32Array(u),h=t.farFade||[n*(e?.28:1.6),n*(e?.47:2.1)],m=t.farExtent,w=[h[0]*.72,h[1]*.96,m*.33,m*.48],g=t.hazeColor?C(t.hazeColor):C(t.litColor).lerp(C(t.shadeColor),.45),l={uTime:{value:0},uDrift:{value:new i.Vector3},uSunDir:{value:re(t.sunDirection)},uSunColor:{value:C(t.sunColor)},uLit:{value:C(t.litColor)},uShade:{value:C(t.shadeColor)},uBottom:{value:C(t.bottomColor||t.shadeColor).multiplyScalar(t.bottomColor?1:.78)},uSilver:{value:t.silver},uFogFade:{value:t.fogFade},uNoise:{value:t.noiseTexture||(yield*tt(s))},uLight:{value:new i.Vector2(.3,0)},uHazeSun:{value:g.clone()},uHazeAway:{value:g.clone()},uHazeDir:{value:re(t.sunDirection)},uHazeP:{value:new i.Vector4(4,t.hazeColor?1:0,e?Math.min(h[0],t.deckRadius*.3):1e9,e?t.deckRadius*.78:2e9)}},b=(t.avoid||[]).slice(0,Ke),x=i.UniformsUtils.merge([i.UniformsLib.fog,{uWrap:{value:new i.Vector4(t.extent[0],t.extent[1],m,m)},uFade:{value:new i.Vector4(t.nearFade[0],t.nearFade[1],h[0],h[1])},uFade2:{value:new i.Vector4(w[0],w[1],w[2],w[3])},uShape:{value:new i.Vector4(t.erode,t.softness,t.bump,t.detail)},uShape2:{value:new i.Vector2(t.crisp,t.depth)}}]);b.length&&(x.uAvoidA={value:b.map(z=>new i.Vector4(z[0],z[1],z[2],z[3]))},x.uAvoidB={value:b.map(z=>z.length>4?new i.Vector4(z[4],z[5]??0,1,0):new i.Vector4(0,0,0,0))}),Object.assign(x,l);const v=new i.PlaneGeometry(1,1),S=new i.InstancedBufferGeometry;S.index=v.index,S.setAttribute("position",v.attributes.position),S.setAttribute("uv",v.attributes.uv);const L=new i.InstancedInterleavedBuffer(y,ce,1);L.setUsage(i.DynamicDrawUsage),S.setAttribute("iPos",new i.InterleavedBufferAttribute(L,4,0)),S.setAttribute("iData",new i.InterleavedBufferAttribute(L,4,4)),S.setAttribute("iNrm",new i.InterleavedBufferAttribute(L,4,8)),S.instanceCount=p;const R={AVOID:b.length};t.wrap&&(R.WRAP=1),t.depth>0&&(R.IMPOSTOR=1);const _=new i.ShaderMaterial({name:"KitCloudPuffs",uniforms:x,vertexShader:je,fragmentShader:Ye,defines:R,transparent:!0,depthWrite:!1,fog:!0,toneMapped:!1}),P=new i.Mesh(S,_);P.frustumCulled=!1,P.renderOrder=t.renderOrder??2,P.name="cloudPuffs";const D=new i.Group;D.name="cloudField";let c=null;if(t.deck){const z=t.deckRadius,M=1/(t.spacing*22),T=i.UniformsUtils.merge([i.UniformsLib.fog,{uRadius:{value:z},uScale:{value:M},uBump:{value:t.relief*M*7}}]);Object.assign(T,l);const H=new i.ShaderMaterial({name:"KitCloudDeck",uniforms:T,vertexShader:Ze,fragmentShader:Xe,transparent:!0,depthWrite:!1,fog:!0,toneMapped:!1}),G=new i.CircleGeometry(z,48);G.rotateX(-Math.PI/2),G.rotateY(.0371),c=new i.Mesh(G,H),c.frustumCulled=!1,c.renderOrder=(t.renderOrder??2)-1,c.name="cloudDeck",c.position.y=t.altitude-t.spacing*(.6+t.deckDrop),D.add(c)}D.add(P);const N=1024,X=new Int32Array(N),$=new Int32Array(p),J=new Float32Array(p),V=l.uDrift.value,oe=new i.Color,W=new i.Color,ae=new i.Vector3,ne={object:D,puffs:P,deck:c,material:_,uniforms:x,noiseTexture:l.uNoise.value,count:p,triangles:p*2+(c?48:0),mode:e?"sea":"cumulus",match(z,M=null,T=0){const H=M&&T>0;if(l.uSunDir.value.copy(z.keyDirection),l.uLit.value.copy(z.cloudLit),l.uShade.value.copy(z.cloudShade),l.uSunColor.value.copy(z.keyColor).multiplyScalar(ke(z)),l.uLight.value.x=De(z),H&&(l.uSunDir.value.lerp(M.keyDirection,T).normalize(),l.uLit.value.lerp(M.cloudLit,T),l.uShade.value.lerp(M.cloudShade,T),l.uSunColor.value.lerp(oe.copy(M.keyColor).multiplyScalar(ke(M)),T),l.uLight.value.x+=(De(M)-l.uLight.value.x)*T),t.bottomColor||l.uBottom.value.copy(l.uShade.value).multiplyScalar(.78),!t.hazeColor){const G=l.uHazeP.value;ye(z,1,l.uHazeSun.value,ae),ye(z,-1,l.uHazeAway.value,ae),l.uHazeDir.value.copy(z.sunDirection),G.x=z.options.scatterPow,G.y=1,H&&(l.uHazeSun.value.lerp(ye(M,1,oe,ae),T),l.uHazeAway.value.lerp(ye(M,-1,W,ae),T),l.uHazeDir.value.lerp(M.sunDirection,T).normalize(),G.x+=(M.options.scatterPow-G.x)*T)}return ne},update(z,M,T){if(l.uTime.value=M,V.set(t.wind[0]*M,t.wind[1]*M,t.wind[2]*M),!T)return;const H=T.matrixWorld.elements,G=H[12],ee=H[13],Q=H[14],de=-H[8],fe=-H[9],he=-H[10];if(c&&c.position.set(G+.713,c.position.y,Q+.419),!t.sort||!p)return;const le=t.extent[0],se=t.extent[1],ge=D.position.x+V.x,pe=D.position.y+V.y,ue=D.position.z+V.z;let a=1/0,d=-1/0;for(let A=0,F=0;A<p;A++,F+=ce){let I=u[F]+ge-G,B=u[F+2]+ue-Q;t.wrap&&(u[F+11]>.5?(I-=Math.floor(I/m+.5)*m,B-=Math.floor(B/m+.5)*m):(I-=Math.floor(I/le+.5)*le,B-=Math.floor(B/se+.5)*se));const K=I*de+(u[F+1]+pe-ee)*fe+B*he;J[A]=K,K<a&&(a=K),K>d&&(d=K)}X.fill(-1);const k=(N-1)/Math.max(.001,d-a);for(let A=0;A<p;A++){const F=(J[A]-a)*k|0;$[A]=X[F],X[F]=A}let O=0;for(let A=N-1;A>=0;A--)for(let F=X[A];F>=0;F=$[F]){const I=F*ce;for(let B=0;B<ce;B++)y[O+B]=u[I+B];O+=ce}L.needsUpdate=!0}};return t.sky&&ne.match(t.sky),ne}function lt(o,e={}){const t={intensity:1,ambient:1,shadow:!1,shadowSize:2048,shadowRange:180,distance:500,follow:!0,flash:2.5,bounce:0,...e},s=new i.Group;s.name="lightRig";const n=new i.HemisphereLight(o.ambientColor.clone(),be(o.groundColor.clone(),o.horizonColor,t.bounce),o.ambientIntensity*t.ambient),r=new i.DirectionalLight(o.lightColor.clone(),o.lightIntensity*t.intensity),f=o.lightDirection.clone();if(r.position.copy(f).multiplyScalar(t.distance),s.add(n,r,r.target),t.shadow){r.castShadow=!0,r.shadow.mapSize.set(t.shadowSize,t.shadowSize);const g=r.shadow.camera,l=t.shadowRange;g.left=-l,g.right=l,g.top=l,g.bottom=-l,g.near=1,g.far=t.distance*2,g.updateProjectionMatrix(),r.shadow.bias=-4e-4,r.shadow.normalBias=l*2/t.shadowSize*2.5}let p=n.intensity,u=r.intensity,y=o;const h=new i.Vector3,m=new i.Color,w={object:s,hemi:n,sun:r,direction:f,match(g,l=null,b=0){return n.color.copy(g.ambientColor),be(n.groundColor.copy(g.groundColor),g.horizonColor,t.bounce),r.color.copy(g.lightColor),f.copy(g.lightDirection),p=g.ambientIntensity*t.ambient,u=g.lightIntensity*t.intensity,y=g,l&&b>0&&(n.color.lerp(l.ambientColor,b),n.groundColor.lerp(be(m.copy(l.groundColor),l.horizonColor,t.bounce),b),r.color.lerp(l.lightColor,b),f.lerp(l.lightDirection,b).normalize(),p+=(l.ambientIntensity*t.ambient-p)*b,u+=(l.lightIntensity*t.intensity-u)*b,b>.5&&(y=l)),n.intensity=p,r.intensity=u,w},update(g,l,b){const x=y.flash||0;if(n.intensity=p*(1+x*t.flash),r.intensity=u,b&&t.follow){b.getWorldDirection(h);const v=r.target.position.copy(b.position).addScaledVector(h,t.shadow?t.shadowRange*.6:0);if(t.shadow){const S=t.shadowRange*2/t.shadowSize*8;v.set(Math.round(v.x/S)*S,Math.round(v.y/S)*S,Math.round(v.z/S)*S)}r.position.copy(v).addScaledVector(f,t.distance)}else r.position.copy(r.target.position).addScaledVector(f,t.distance)}};return w}export{we as SKY_PRESETS,rt as makeCloudField,nt as makeCloudFieldAsync,lt as makeLightRig,it as makeSky,ve as skyDirection};
