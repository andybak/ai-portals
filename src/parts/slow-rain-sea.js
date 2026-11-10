import*as t from"three";const ae=[[50,6,-215],[50,6,-120],[30,5,-65],[0,3.8,0],[8,4.2,55],[44,14,130]],le=["#E9A04B","#8A4A1E","#F3E7D2","#0B0A0E","#C96A2B","#3A2418","#5FD6C8"],S=`
uniform float uTime; uniform vec2 uDrift; uniform vec4 uSwell; // amp, k, omega, amp2
uniform vec3 uShaft; // core radius, rim radius, outlier density
uniform float uSize; // drop size multiplier (rain variant)
const float CELL = 5.0; const float CYC = 6.5;      // crown cells
const float FCELL = 1.25; const float FCYC = 2.0;   // small-drop cells
const float FALL = 1.6;
vec3 hash32(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yxz + 33.33); return fract((p3.xxy + p3.yzz) * p3.zyx); }
// phase of a cell's clock, in cycles
float cellClock(vec2 cell, float cyc){ return uTime / cyc + hash32(cell + 3.7).x; }
// landing site of cycle n in a cell: xy = xz position, z = spare hash (size, existence)
vec3 site(vec2 cell, float n, float size){ vec3 g = hash32(cell + vec2(mod(n, 251.) * 7., mod(n, 241.) * 13.));
  return vec3((cell + 0.16 + 0.68 * g.xy) * size, g.z); }
// how much rain there is at a place (1 in the core, a few outliers outside)
// a lane of calm mirror the world may lay through the rain: segment (x0, z0, x1, z1); half-width, strength
uniform vec4 uLane; uniform vec2 uLaneK;
float laneAt(vec2 p){ vec2 a = uLane.xy, ab = uLane.zw - a; float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
  return (1. - smoothstep(uLaneK.x * 0.55, max(uLaneK.x, 0.1), length(p - a - ab * h))) * uLaneK.y; }
float shaftDensity(vec2 p){ return mix(1., uShaft.z, smoothstep(uShaft.x, uShaft.y, length(p))) * (1. - 0.72 * laneAt(p)); }
// crowns (and the melon drops that make them) keep clear of the camera's track
uniform vec2 uTrack[6]; uniform float uClear; uniform vec4 uFeat; // featured landing: x, z, tau, on
uniform vec2 uFeatK; // the featured crown's size and the height of its thrown bead, times the usual
uniform vec4 uFeat2; uniform vec2 uFeat2K; // a second featured landing
uniform vec4 uPass[8]; // eight more the world may place beside its track: x, z, tau, size (0 = off)
float crownDensity(vec2 p){ float d = 1e6; if (uClear <= 0.) return shaftDensity(p) * step(laneAt(p), 0.02);
  for (int i = 0; i < 5; i++) { vec2 a = uTrack[i], ab = uTrack[i + 1] - a;
    float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0., 1.); d = min(d, length(p - a - ab * h)); }
  return shaftDensity(p) * step(uClear, d) * step(laneAt(p), 0.02); }
float swellH(vec2 p){ float f = 1. - smoothstep(380., 760., length(p));
  return f * (uSwell.x * sin(dot(p, vec2(0.34, 0.94)) * uSwell.y - uTime * uSwell.z)
    + uSwell.w * sin(dot(p, vec2(-0.71, 0.70)) * uSwell.y * 2.3 - uTime * uSwell.z * 1.37)); }
vec2 swellG(vec2 p){ float f = 1. - smoothstep(380., 760., length(p));
  return f * (vec2(0.34, 0.94) * (uSwell.x * uSwell.y * cos(dot(p, vec2(0.34, 0.94)) * uSwell.y - uTime * uSwell.z))
    + vec2(-0.71, 0.70) * (uSwell.w * uSwell.y * 2.3 * cos(dot(p, vec2(-0.71, 0.70)) * uSwell.y * 2.3 - uTime * uSwell.z * 1.37))); }
`,A=`
uniform vec3 uSun; uniform vec3 cHaze, cRust, cCream, cInk, cEmber, cUmber, cCool, cDeep; uniform float uRainDim;
// cCool / cDeep: the complement everything unlit falls to (the lid, the band away from the tear, shadow sides, deep water)
vec3 skyColD(vec3 d, float dim){
  float el = max(d.y, 0.);
  float band = 1. - smoothstep(0.17, 0.40, el);
  vec3 hz = mix(cCream, cHaze, smoothstep(0.0, 0.15, el));
  hz = mix(hz * 1.25, cEmber * 0.95, dim);
  // round the horizon away from the torn patch the band cools and darkens: amber on the port hand, dusk to starboard
  float away = 0.5 - 0.5 * dot(d.xz, uSun.xz) / (max(length(d.xz), 1e-4) * max(length(uSun.xz), 1e-4));
  float cool = smoothstep(0.22, 0.8, away);
  hz = mix(hz, mix(cCool * 1.25, cEmber, 0.14), cool * (0.14 + 0.78 * dim));
  hz *= 1. + 0.3 * dim * (1. - smoothstep(0.0, 0.4, away));
  vec2 q = d.xz / max(el, 0.06) * 1.3;
  float lob = 0.5 + 0.25 * (sin(q.x * 2.3 + 1.7 * sin(q.y * 1.1)) + sin(q.y * 2.9 + 1.3 * sin(q.x * 0.9)));
  vec3 lid = mix(cDeep * 1.7, cCool, lob * (0.4 + 0.6 * (1. - smoothstep(0.3, 0.95, el)))) * (0.62 + 0.32 * (1. - smoothstep(0.3, 0.9, el)));
  lid += cRust * 0.3 * lob * lob * (1. - smoothstep(0.17, 0.62, el)) * (1. - smoothstep(0.1, 0.7, away));   // the lobes nearest the tear are warmed from below
  vec3 c = mix(lid, hz, band);
  float sd = max(dot(d, uSun), 0.);
  float sd2 = sd * sd; float sd8 = sd2 * sd2 * sd2 * sd2; float sd64 = sd8 * sd8 * sd8 * sd8 * sd8 * sd8 * sd8 * sd8;
  c += vec3(1.0, 0.84, 0.56) * (sd64 * sd64 * 2.6 + sd8 * sd8 * 0.35) * (1. - 0.55 * dim) * (0.25 + 0.75 * band);
  return c;
}
vec3 skyCol(vec3 d){ return skyColD(d, uRainDim); }
// the whole surround: below the horizon it is the mirror sea (black where you look steeply down)
vec3 envCol(vec3 d){
  if (d.y >= 0.) return skyCol(d);
  float s = -d.y; float fr = 0.04 + 0.96 * (1. - s) * (1. - s) * (1. - s) * (1. - s) * (1. - s);
  return mix(mix(cInk, cDeep, 0.5), skyCol(vec3(d.x, s, d.z)) * 0.9, fr);
}
`,L=`
vec3 camLocal(){ return -(modelViewMatrix[3].xyz * mat3(modelViewMatrix)); }
vec3 camRight(){ return vec3(modelViewMatrix[0][0], modelViewMatrix[1][0], modelViewMatrix[2][0]); }
vec3 camUp(){ return vec3(modelViewMatrix[0][1], modelViewMatrix[1][1], modelViewMatrix[2][1]); }
`,M=`#include <fog_pars_vertex>
`,T=`#include <fog_pars_fragment>
`;async function re(F,m={}){const C=F.rng,k=(m.palette&&m.palette.length>=7?m.palette:le).map(e=>new t.Color(e)),K=(m.cool&&m.cool.length>=2?m.cool:["#6B3070","#0E3440"]).map(e=>new t.Color(e)),Q=Math.min(1,Math.max(.6,m.detail??F.quality?.detail??1)),H=(e,o)=>e===0||e===1||e===2?e:(()=>{const a=C();return a<o[0]?0:a<o[0]+o[1]?1:2})(),D=H(m.light,[.5,.25,.25]),j=H(m.rain,[.5,.25,.25]),O=H(m.swell,[.5,.25,.25]),E=[9,3.5,30][D]*Math.PI/180,Y=(100+C.range(-8,8))*Math.PI/180,W=new t.Vector3(-Math.sin(Y)*Math.cos(E),Math.sin(E),Math.cos(Y)*Math.cos(E)),B=k[0].clone();D===1&&B.lerp(k[4],.7),D===2&&B.lerp(k[2],.45);const Z=C.range(-.5,.5),J=C.range(.8,1.3),oe=[1,.62,1.5][j],X=[1,.12,1.5][O],v={uTime:{value:0},uDrift:{value:new t.Vector2(Math.sin(Z)*J,Math.cos(Z)*J)},uSwell:{value:new t.Vector4(X,Math.PI*2/120,Math.PI*2/10,X*.16)},uShaft:{value:new t.Vector3(65,90,.05)},uSun:{value:W},uRainDim:{value:.85},uSize:{value:oe},cHaze:{value:B},cRust:{value:k[1]},cCream:{value:k[2]},cInk:{value:k[3]},cEmber:{value:k[4]},cUmber:{value:k[5]},cCool:{value:K[0]},cDeep:{value:K[1]},uBufH:{value:900},uTrack:{value:ae.map(e=>new t.Vector2(e[0],e[2]))},uClear:{value:6},uFeat:{value:new t.Vector4(0,0,0,0)},uFeatK:{value:new t.Vector2(1,1)},uFeat2:{value:new t.Vector4(0,0,0,0)},uFeat2K:{value:new t.Vector2(1,1)},uCalm:{value:new t.Vector4(0,-9e3,1,1)},uPass:{value:[0,1,2,3,4,5,6,7].map(()=>new t.Vector4(0,0,-99,0))},uLane:{value:new t.Vector4(0,0,0,1)},uLaneK:{value:new t.Vector2(1,0)}},V=(e={})=>({...t.UniformsUtils.clone(t.UniformsLib.fog),...v,...e}),z=new t.Group;z.name="slow-rain-sea-hero";const R=new t.Sphere(new t.Vector3(0,100,0),4e3);if(m.sea!==!1){const e=m.seaRadius??1600,o=70,a=96,s=new Float32Array((o+1)*a*3),l=[];for(let u=0;u<=o;u++)for(let f=0;f<a;f++){const r=e*Math.pow(u/o,2.4),c=(f+u%2*.5)/a*Math.PI*2,n=(u*a+f)*3;s[n]=Math.cos(c)*r,s[n+1]=0,s[n+2]=Math.sin(c)*r}for(let u=0;u<o;u++)for(let f=0;f<a;f++){const r=u*a+f,c=u*a+(f+1)%a,n=r+a,p=c+a;u>0&&l.push(r,n,c),l.push(c,n,p)}const h=new t.BufferGeometry;h.setAttribute("position",new t.BufferAttribute(s,3)),h.setIndex(l),h.boundingSphere=R;const d=new t.ShaderMaterial({uniforms:V(m.mirror?.uniforms||{}),fog:!0,side:t.DoubleSide,vertexShader:S+L+M+`
        varying vec3 vP; varying vec3 vCam;
        void main(){ vec3 p = position; p.y = swellH(p.xz); vP = p; vCam = camLocal();
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:S+A+T+(m.mirror?.glsl||"")+`
        varying vec3 vP; varying vec3 vCam; uniform vec4 uCalm;
        // one landing: adds ring slope to g, returns (pit, tear). r0 = radius of the splash wall.
        vec2 landing(vec2 d, float tau, float r0, float amp, float k, float tight, float life, inout vec2 g){
          float r = length(d) + 1e-4; vec2 dir = d / r;
          float x = r - (r0 + 0.55 * tau);
          float env = exp(-x * x * tight) * amp * exp(-tau * 1.6 / life) * smoothstep(0., 0.35, tau);
          g += dir * (cos(x * k) * env);
          float open = smoothstep(0., 0.12, tau) * (1. - smoothstep(life * 0.28, life * 0.42, tau));
          float pit = (1. - smoothstep(r0 * 0.55, r0 * 1.02, r)) * open;
          g -= dir * (pit * smoothstep(r0 * 0.2, r0 * 0.9, r) * 0.9);
          float tr = r0 * (1.25 + 0.5 * smoothstep(0., 1., tau)) * (1. - smoothstep(life * 0.35, life, tau));
          return vec2(pit, (1. - smoothstep(tr * 0.92, tr + 0.02, r)) * smoothstep(0., 0.1, tau));
        }
        float marble(vec2 p){ p += 1.6 * vec2(sin(p.y * 0.9 + uTime * 0.05), sin(p.x * 0.8 - uTime * 0.04));
          p += 0.7 * vec2(sin(p.y * 2.3), sin(p.x * 2.1)); return 0.5 + 0.5 * sin(p.x * 1.3 + 2.0 * sin(p.y * 1.1)); }
        void main(){
          vec3 V = vP - vCam; float dist = length(V); V /= max(dist, 1e-3);
          vec2 p = vP.xz; vec2 g = swellG(p); vec2 pt = vec2(0.);
          float fp = max(fwidth(p.x), fwidth(p.y));
          float nearF = 1. - smoothstep(90., 170., dist);
          float filtC = (1. - smoothstep(0.2, 0.7, fp)) * (1. - 0.45 * smoothstep(14., 60., dist)), filtF = 1. - smoothstep(0.12, 0.45, fp);
          float fineF = 1. - smoothstep(7., 26., dist);
          if (nearF > 0.001) {
            vec2 c0 = floor(p / CELL);
            for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
              vec2 cell = c0 + vec2(float(i), float(j)); float tt = cellClock(cell, CYC); float n0 = floor(tt);
              for (int b = 0; b < 2; b++) {
                float n = n0 - float(b); vec3 s = site(cell, n, CELL);
                if (fract(s.z * 13.7) > crownDensity(s.xy)) continue;
                float r0 = uSize * mix(1.0, 1.45, fract(s.z * 7.31)); float tau = (tt - n) * CYC;
                vec2 gg = vec2(0.);
                pt = max(pt, landing(p - s.xy, tau, r0 * (0.3 + 0.7 * smoothstep(0., 1.2, tau)), 0.40 * filtC, 8.5, 1.5, 7.0, gg));
                // the rebound bead comes back down at tau 6.1 and makes its own small ring
                pt = max(pt, landing(p - s.xy, tau - 6.29, 0.3 * uSize, 0.2 * filtF, 13., 6., 3.0, gg) * step(6.29, tau));
                g += gg * nearF;
              }
            }
            if (uFeat.w > 0.5 && uFeat.z > 0.) {                // the world's featured crown
              vec2 gg = vec2(0.); float r0 = uSize * 1.26 * uFeatK.x;
              pt = max(pt, landing(p - uFeat.xy, uFeat.z, r0 * (0.3 + 0.7 * smoothstep(0., 1.2, uFeat.z)), 0.40 * filtC, 8.5, 1.5, 7.0, gg));
              pt = max(pt, landing(p - uFeat.xy, uFeat.z - 6.29, 0.3 * uSize, 0.2 * filtF, 13., 6., 3.0, gg) * step(6.29, uFeat.z));
              g += gg * nearF;
            }
            if (uFeat2.w > 0.5 && uFeat2.z > 0.) {
              vec2 gg = vec2(0.); float r0 = uSize * 1.26 * uFeat2K.x;
              pt = max(pt, landing(p - uFeat2.xy, uFeat2.z, r0 * (0.3 + 0.7 * smoothstep(0., 1.2, uFeat2.z)), 0.40 * filtC, 8.5, 1.5, 7.0, gg));
              pt = max(pt, landing(p - uFeat2.xy, uFeat2.z - 6.29, 0.3 * uSize, 0.2 * filtF, 13., 6., 3.0, gg) * step(6.29, uFeat2.z));
              g += gg * nearF;
            }
            for (int i = 0; i < 8; i++) {                       // the crowns the world stands beside its track
              vec4 f = uPass[i]; vec2 dq = p - f.xy;
              if (f.w > 0.01 && f.z > 0. && dot(dq, dq) < 144.) { vec2 gg = vec2(0.); float r0 = uSize * 1.26 * f.w;
                pt = max(pt, landing(dq, f.z, r0 * (0.3 + 0.7 * smoothstep(0., 1.2, f.z)), 0.40 * filtC, 8.5, 1.5, 7.0, gg)); g += gg * nearF; }
            }
            vec2 f0 = floor(p / FCELL);
            for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
              vec2 cell = f0 + vec2(float(i), float(j)); float tt = cellClock(cell, FCYC); float n0 = floor(tt);
              for (int b = 0; b < 2; b++) {
                float n = n0 - float(b); vec3 s = site(cell, n, FCELL);
                if (fract(s.z * 13.7) > shaftDensity(s.xy)) continue;
                vec2 gg = vec2(0.);
                // small drops: one tight ring each, faint, and gone within 25 m, so the crowns' trains stay countable
                pt = max(pt, landing(p - s.xy, (tt - n) * FCYC, 0.26 * uSize * (0.7 + 0.6 * s.z), 0.034 * filtF * fineF, 13., 6., 3.4, gg) * vec2(0.45 * (0.3 + 0.7 * fineF), 1.));
                g += gg * nearF;
              }
            }
          }
          float dens = shaftDensity(p);
          // where nothing arrives (under the fall) the mirror lies untouched; elsewhere a light air ruffles it
          float calm = 1. - smoothstep(0.55, 1.15, length((p - uCalm.xy) / uCalm.zw));
          g = mix(g, swellG(p), calm);
          g += (1. - calm) * (1. - dens) * 0.011 * (1. - smoothstep(0.5, 2.2, fp)) * vec2(sin(p.x * 1.7 + uTime * 0.8 + 1.5 * sin(p.y * 0.6)), sin(p.y * 2.1 - uTime * 0.7 + 1.7 * sin(p.x * 0.5)));
          // far rain: the rings melt into a soft broken sheen
          g += (1. - nearF * filtF) * dens * 0.009 * vec2(sin(p.x * 0.9 + uTime * 1.1 + 2. * sin(p.y * 0.37)), sin(p.y * 1.1 - uTime * 0.9 + 2. * sin(p.x * 0.31)));
          vec3 N = normalize(vec3(-g.x, 1., -g.y));
          vec3 Rf = reflect(V, N); Rf.y = abs(Rf.y) + 0.004; Rf = normalize(Rf);
          float c = clamp(dot(-V, N), 0., 1.); float x1 = 1. - c;
          float F = 0.5 + 0.5 * x1 * sqrt(x1);                   // a mirror at our angle: black only in the craters
          F *= 1. - 0.84 * pt.x * nearF;
          // at our low angle the mirror holds the haze band; only faces tilted well up find the lid's rust
          // far off the mirror holds the haze band; close to, where we look down on it, it holds the cool lid
          vec3 Rs = normalize(vec3(Rf.x, Rf.y * mix(0.9, 0.5, 1. - smoothstep(0.2, 0.7, uRainDim)), Rf.z));
          vec3 sk = skyCol(Rs);
          sk = mix(sk, max(sk, cCool * 0.72), 0.7 * smoothstep(0.17, 0.4, Rs.y));     // and it shows the lid as dusk, never as a hole
          MIRROR_CALL
          vec3 col = mix(mix(cInk, cDeep, 0.8), sk, F);
          // rust skin: a marbled film that each landing tears open and that heals behind it
          float skin = smoothstep(0.35, 0.75, marble(p * 0.35)) * (1. - pt.y * nearF) * (0.25 + 0.75 * dens);
          col = mix(col, cRust * (0.55 + 0.5 * F), skin * 0.2 * (1. - smoothstep(60., 400., dist)));
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`.replace("MIRROR_CALL",m.mirror?"sk = mirrorCol(vP, Rf, sk);":"")}),i=new t.Mesh(h,d);i.name="sea",i.renderOrder=0,z.add(i)}await F.yield();const x=Math.max(28,2*Math.round(16*Math.sqrt(Q))),I=7,g=12,$=3,_=(x*x*I+g*g*$+2+8)*2;{const e=new Float32Array(_*2),o=new Float32Array(_*4);let a=0;const s=(i,u,f,r)=>{const c=C();for(let n=0;n<2;n++)e[a*2]=i,e[a*2+1]=u,o[a*4]=f,o[a*4+1]=r,o[a*4+2]=n,o[a*4+3]=c,a++};for(let i=0;i<x;i++)for(let u=0;u<x;u++)for(let f=0;f<I;f++)s(i,u,f,0);for(let i=0;i<g;i++)for(let u=0;u<g;u++)for(let f=0;f<$;f++)s(i,u,f,1);s(0,0,0,2),s(0,0,0,3);for(let i=0;i<8;i++)s(0,0,0,4+i);const l=new t.InstancedBufferGeometry;l.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),l.setIndex([0,1,2,0,2,3]),l.setAttribute("aCell",new t.InstancedBufferAttribute(e,2)),l.setAttribute("aInfo",new t.InstancedBufferAttribute(o,4)),l.instanceCount=_,l.boundingSphere=R;const h=new t.ShaderMaterial({uniforms:V({uGrid:{value:x}}),fog:!0,alphaToCoverage:!0,vertexShader:S+L+M+`
        attribute vec2 aCell; attribute vec4 aInfo; uniform float uGrid, uBufH;
        varying vec2 vUv; varying vec3 vR, vU, vF, vDir; varying vec4 vPar;
        void main(){
          vec3 cam = camLocal(); float kind = min(aInfo.y, 1.); float feat = step(1.5, aInfo.y);
          float size = mix(FCELL, CELL, kind), cyc = mix(FCYC, CYC, kind), G = mix(uGrid, 12., kind), K = mix(7., 3., kind);
          vec2 base = floor(cam.xz / size);
          vec2 cell = base + mod(aCell - base + G * 0.5, G) - G * 0.5;
          float tt = cellClock(cell, cyc); float n = floor(tt) + 1. + aInfo.x;
          float Tl = (n - tt) * cyc;                         // seconds until this drop lands
          vec3 s = site(cell, n, size);
          float show = step(fract(s.z * 13.7), kind > 0.5 ? crownDensity(s.xy) : shaftDensity(s.xy));
          if (feat > 0.5) { vec4 ft = aInfo.y > 2.5 ? uFeat2 : uFeat;
            if (aInfo.y > 3.5) { vec4 f = uPass[int(aInfo.y - 3.5)]; ft = vec4(f.xyz, step(0.01, f.w)); }
            s = vec3(ft.xy, 0.9); Tl = -ft.z; show = ft.w * step(0., Tl) * step(Tl, 16.); }
          float rad = uSize * mix(0.05 + 0.032 * s.z, 0.10 + 0.03 * fract(s.z * 7.31), kind);
          float sw = swellH(s.xy);
          vec3 c = vec3(s.x - uDrift.x * Tl, sw + FALL * Tl + rad * 0.85, s.y - uDrift.y * Tl);
          float hw = G * size * 0.5;
          vec2 dc = abs(c.xz - cam.xz);
          show *= 1. - smoothstep(hw * 0.78, hw * 0.97, max(dc.x, dc.y));
          show *= 1. - smoothstep(0.9, 1.0, Tl / (K * cyc));
          float wob = sin(uTime * (4.2 + 2.6 * aInfo.w - 1.2 * kind) + aInfo.w * 43.) * (0.17 + 0.07 * kind);
          wob *= smoothstep(0.0, 0.5, Tl);                   // it rounds off as it touches
          float mir = aInfo.z; vec3 P = c;
          if (mir > 0.5) {
            float h = max(c.y - sw, 0.); P.y = sw - h;
            float camH = max(cam.y - sw, 0.3);
            float f = camH / (camH + h);
            vec3 S = cam + (P - cam) * f; float hd = max(length(S.xz - cam.xz), 0.1);
            float pull = rad * f * 1.4 * hd / camH + 0.12;
            f *= 1. - min(pull / max(length(S - cam), 0.2), 0.5);
            P = cam + (P - cam) * f; rad *= f;
            show *= 1. - smoothstep(4., 10., h);
          }
          vDir = P - cam; float dist = length(vDir);
          // the lid is a quiet ground: a drop too small to show a body and a crescent is not drawn against it
          float pxr = rad * projectionMatrix[1][1] * uBufH * 0.5 / max(dist, 0.3);
          show *= 1. - (1. - smoothstep(3.3, 3.9, pxr)) * smoothstep(0.06, 0.16, vDir.y / max(dist, 0.3));
          rad *= 1. + 0.55 * min(1. / (uSize * uSize), 1.6) * smoothstep(4., 13., dist) * (1. - feat);         // the middle distance keeps a body and a crescent
          show *= smoothstep(0.45, 1.0, dist / max(mir > 0.5 ? 0.3 : 1.0, 0.1));
          rad *= mix(0.4, 1., smoothstep(1.2, 3.4, length(c - cam)));                                        // beside the lens a drop stays a drop, not a chrome egg
          vR = camRight(); vU = camUp(); vF = cross(vR, vU);
          vUv = position.xy * 1.2; vPar = vec4(wob, mir, aInfo.w, show);
          vec2 ax = rad * vec2(1. + wob * 0.85, 1. - wob) * show;
          P += vR * (vUv.x * ax.x) + vU * (vUv.y * ax.y);
          vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:A+T+`
        varying vec2 vUv; varying vec3 vR, vU, vF, vDir; varying vec4 vPar;
        void main(){
          vec2 q = vUv; float r = length(q); vec2 u = q / max(r, 1e-4);
          float s3 = u.y * (3. - 4. * u.y * u.y);              // sin 3t: egg below, bun above
          float outline = 1. + 0.5 * vPar.x * s3 * (vPar.y > 0.5 ? -1. : 1.);
          float rho = r / outline; float aa = fwidth(rho) * 1.5 + 1e-4;
          float alpha = 1. - smoothstep(1. - aa, 1., rho);
          if (alpha < 0.02 || vPar.w < 0.02) discard;
          float z = sqrt(max(1. - rho * rho, 0.));
          float flip = vPar.y > 0.5 ? -1. : 1.;
          vec3 tang = (vR * q.x + vU * (q.y * flip)) / outline;
          vec3 n = normalize(tang + vF * (z + 0.02));
          vec3 Vd = normalize(vDir + vF * 1e-4);
          vec3 view = flip > 0. ? Vd : normalize(vec3(Vd.x, -Vd.y, Vd.z));
          // the lens: the world upside down, a bright horizon line across the middle
          vec3 rd = normalize(view - 1.45 * tang);
          vec3 col = envCol(rd) * mix(vec3(1.), cHaze, 0.55) * (0.6 + 0.4 * z) + cHaze * (0.16 * z);
          float fr = (1. - z) * (1. - z);
          col += envCol(reflect(view, n)) * mix(vec3(1.), cHaze, 0.4) * fr * 0.5;
          col *= 1.25 / (1. + 0.8 * max(col.r, max(col.g, col.b)));   // a soft amber body, never a white disc in open haze
          float sl = dot(n, uSun);
          col += mix(cEmber, cHaze, 0.6) * (0.10 + 0.24 * z) * (0.45 + 0.75 * uRainDim) * (0.3 + 0.7 * smoothstep(-0.7, 0.5, sl));   // light held in the drop on its sunward side: amber
          col += cCool * 0.5 * (1. - smoothstep(-0.7, 0.2, sl)) * (0.4 + 0.6 * z);                                              // its shadow side holds the dusk
          // the hard sunward crescent belongs to drops with a shape; a drop a few pixels across is an amber mote lit from the left
          float big = 1. - smoothstep(0.14, 0.6, aa / 1.5);
          col *= 1. - 0.5 * big * smoothstep(0.55, 0.97, rho) * (1. - smoothstep(-0.1, 0.5, sl));              // a dark rim away from the tear: a lens, not a disc
          float cres = mix(0.6 * smoothstep(0.1, 0.75, sl), smoothstep(0.46, 0.76, sl) * smoothstep(0.58, 0.9, rho), big);
          col += mix(vec3(1.0, 0.52, 0.18), vec3(1.0, 0.84, 0.54) * (2.2 + 2.1 * uRainDim), big) * cres;
          col += mix(cCool * 2.4, cHaze, 0.25) * 0.9 * smoothstep(0.62, 0.9, -sl) * smoothstep(0.7, 0.95, rho);
          col = mix(col * mix(vec3(1.), cEmber * 1.7, 0.5) * 0.66, col, big);                                   // a few pixels across: an amber mote, dimmer than a drop's body
                    if (vPar.y > 0.5) col = mix(envCol(Vd), col, 0.42 * vPar.w);
          gl_FragColor = vec4(col, alpha);
          #include <fog_fragment>
        }`}),d=new t.Mesh(l,h);d.name="drops",d.frustumCulled=!1,d.renderOrder=1,z.add(d)}await F.yield();{const e=Math.round(26e3*Q),o=new Float32Array(e*3),a=new Float32Array(e*2);for(let i=0;i<e;i++)o[i*3]=C(),o[i*3+1]=C(),o[i*3+2]=C(),a[i*2]=i<e*.55?0:1,a[i*2+1]=C();const s=new t.BufferGeometry;s.setAttribute("position",new t.BufferAttribute(o,3)),s.setAttribute("aT",new t.BufferAttribute(a,2)),s.boundingSphere=R;const l=new t.ShaderMaterial({uniforms:V({uNear:{value:x*1.25*.5}}),fog:!0,transparent:!0,depthWrite:!1,vertexShader:S+L+M+`
        attribute vec2 aT; uniform float uBufH, uNear; uniform vec3 uSun;
        varying vec4 vL; varying float vTw;
        void main(){
          vec3 cam = camLocal(); vec3 box = mix(vec3(90., 36., 90.), vec3(240., 84., 240.), aT.x);
          vec3 p = position * box; p.xz += uDrift * uTime;
          p.xz = cam.xz + mod(p.xz - cam.xz + box.xz * 0.5, box.xz) - box.xz * 0.5;
          float sw = swellH(p.xz);
          p.y = sw + mod(p.y - uTime * FALL, box.y);
          vec2 dc = abs(p.xz - cam.xz); float dm = max(dc.x, dc.y);
          float show = step(aT.y, shaftDensity(p.xz));
          show *= max(smoothstep(uNear * 0.78, uNear * 0.97, dm), smoothstep(KTOP - 3., KTOP, p.y - sw));
          show *= 1. - smoothstep(0.40, 0.5, dm / box.x);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
          float dist = max(-mvPosition.z, 0.5);
          float px = (0.1 + 0.07 * fract(aT.y * 17.)) * uSize * 2. * projectionMatrix[1][1] * uBufH * 0.5 / dist;
          gl_PointSize = max(px, 1.6);
          float a = clamp((px - 1.8) / 6., 0.0, 1.0);
          float tw = 0.5 + 0.5 * sin(uTime * (2.5 + 2.5 * aT.y) + aT.y * 61.); tw *= tw; tw *= tw;
          // beyond a few pixels a drop is a dim amber mote, then a shimmer; against the dark lid it all but goes out
          float elev = (p.y - cam.y) / max(length(p - cam), 0.5);
          float quiet = 1. - smoothstep(0.04, 0.2, elev) * (1. - smoothstep(0.5, 0.8, a));
          vTw = show * mix((0.1 + 0.3 * tw * tw) * min(px / 1.6, 1.), 1., sqrt(a)) * quiet;
          vL = vec4(dot(uSun, camRight()), dot(uSun, camUp()), dot(uSun, cross(camRight(), camUp())), a);
          gl_Position = show * quiet > 0.02 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
          #include <fog_vertex>
        }`.replace(/KTOP/g,(I*2*1.6*.9).toFixed(1)),fragmentShader:A+T+`
        varying vec4 vL; varying float vTw;
        void main(){
          vec2 q = vec2(gl_PointCoord.x * 2. - 1., 1. - gl_PointCoord.y * 2.); float rho = length(q);
          float alpha = 1. - smoothstep(0.75, 1., rho);
          float z = sqrt(max(1. - rho * rho, 0.));
          float sl = dot(vec3(q, z), vL.xyz);
          // big sprites show body + crescent; pixel-sized ones are all glint
          float cres = mix(0.34 * smoothstep(0.05, 0.75, sl), smoothstep(0.56, 0.80, sl) * smoothstep(0.6, 0.9, rho), vL.w);
          vec3 body = mix(mix(cRust, cEmber, 0.55) * 0.62, mix(cEmber, cHaze, 0.45) * 0.9, 0.5 + 0.5 * q.y * -1.) * (0.5 + 0.5 * z);
          vec3 col = body * 0.8 + mix(vec3(1.0, 0.5, 0.17) * 0.8, vec3(1.0, 0.8, 0.5), vL.w) * mix(1.0, 1.1 + 2.2 * uRainDim, vL.w) * cres;   // amber motes, lit from the left; the white-gold is kept for drops with a shape
          gl_FragColor = vec4(col, alpha * vTw);
          #include <fog_fragment>
        }`}),h=new t.Points(s,l);h.name="midRain",h.frustumCulled=!1,h.renderOrder=2;const d=new t.Vector2;h.onBeforeRender=i=>{i.getDrawingBufferSize(d),v.uBufH.value=d.y},z.add(h)}await F.yield();{const a=[],s=[],l=[],h=[66,78,90],d=m.lid!==!1;for(let r=0;r<3;r++){const c=a.length/3;for(let n=0;n<=14;n++)for(let p=0;p<=64;p++)a.push(p/64*Math.PI*2,520*Math.pow(n/14,1.8),h[r]),s.push(r);for(let n=0;n<14;n++)for(let p=0;p<64;p++){const w=c+n*65+p,b=w+64+1;l.push(w,b,w+1,w+1,b,b+1)}}if(d){const r=a.length/3;a.push(0,520,0),s.push(3);for(let c=1;c<=3;c++)for(let n=0;n<=64;n++)a.push(n/64*Math.PI*2,520,c*173.4),s.push(3);for(let c=0;c<64;c++){l.push(r,r+1+c,r+2+c);for(let n=0;n<2;n++){const p=r+1+n*65+c,w=p+64+1;l.push(p,w,p+1,p+1,w,w+1)}}}const i=new t.BufferGeometry;i.setAttribute("position",new t.BufferAttribute(new Float32Array(a),3)),i.setAttribute("aS",new t.BufferAttribute(new Float32Array(s),1)),i.setIndex(l),i.boundingSphere=R;const u=new t.ShaderMaterial({uniforms:V(),fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:S+L+M+`
        attribute float aS; varying vec3 vV; varying vec3 vC; varying float vS; varying vec3 vRad;
        void main(){
          float a = position.x, y = position.y, t = y / 520.;
          float r = aS > 2.5 ? position.z : position.z + (200. - 65.) * t * t * sqrt(t);
          vec3 p = vec3(cos(a) * r, y, sin(a) * r);
          float hem = 1. - min(y / 30., 1.);
          p.xz += uDrift * (13. / max(length(uDrift), 0.3)) * hem * hem * step(aS, 2.5);
          p.y += swellH(p.xz) * hem;
          vec3 cl = camLocal(); vV = p - cl; vC = vec3(a, y, r); vS = aS;
          vRad = vec3(cos(a), sin(a), smoothstep(r + 8., r + 45., length(cl.xz)));
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:S+A+T+`
        varying vec3 vV; varying vec3 vC; varying float vS; varying vec3 vRad;
        float glints(vec2 uv, float fw, float seed){
          vec2 c = floor(uv); vec3 h = hash32(c + seed * 31.);
          float rad = max(0.13, fw * 0.9); float d = length(fract(uv) - 0.2 - 0.6 * h.xy);
          float tw = 0.6 + 0.4 * sin(uTime * (3. + 4. * h.z) + h.x * 40.);
          return (1. - smoothstep(rad * 0.4, rad, d)) * step(0.78, h.z) * tw * tw * min(1., 0.13 * 0.13 / (rad * rad) * 1.6);
        }
        // hanging beads: what slow rain looks like from a furlong off. Fine points and very short dashes that sink
        // at walking pace, each brighter on its sunward side (sgn: which way the cell runs on screen)
        float beads(vec2 ub, float fwb, float seed, float sgn){
          vec2 c = floor(ub); vec3 h = hash32(c + seed * 17.); vec2 d = fract(ub) - 0.22 - 0.56 * h.xy;
          float rad = max(0.1 + 0.07 * h.z, fwb * 0.8); d.y *= 0.62;
          float m = 1. - smoothstep(rad * 0.45, rad, length(d));
          float tw = 0.5 + 0.5 * sin(uTime * (1.5 + 3. * h.z) + h.x * 40.);
          float lit = 0.55 + 0.9 * (1. - smoothstep(-0.6, 0.5, sgn * d.x / rad));
          return m * step(fract(h.z * 7.3), 0.62) * (0.3 + 0.7 * tw * tw) * lit * min(1., 0.024 / (rad * rad));
        }
        void main(){
          float dist = length(vV); vec3 V = vV / max(dist, 1e-3);
          vec3 col = skyColD(vec3(V.x, abs(V.y), V.z), max(uRainDim, 0.9));
          vec2 uv = vec2(vC.x * vC.z, vC.y + uTime * FALL * (1. + 0.15 * vS)) / 1.1;
          float fw = max(fwidth(uv.x), fwidth(uv.y));     // derivatives stay outside the branch
          vec2 us = vec2(vC.x * vC.z + vS * 7.3, vC.y + uTime * FALL * (1. + 0.2 * vS)) / 1.9; float fws = max(fwidth(us.x), fwidth(us.y));
          float sgx = dFdx(us.x) > 0. ? 1. : -1.;
          if (vS > 2.5) {                                       // the lid where the shaft enters it
            float rr = vC.z / 520.;
            gl_FragColor = vec4(col * (0.75 + 0.25 * rr), (1. - smoothstep(0.55, 1., rr)) * 0.97);
          } else {
            float a = vC.x, y = vC.y;
            float fold = 0.62 + 0.38 * sin(a * (19. + vS * 4.) + vS * 2.1 + 2.2 * sin(y * 0.021 + vS) + uTime * 0.04);
            float alpha = (0.52 + 0.08 * vS) * (0.5 + 0.5 * fold) * (0.35 + 0.65 * smoothstep(0., 9., y)) * smoothstep(3., 26., dist);
            float facing = abs(dot(V.xz, vRad.xy)) / max(length(V.xz), 1e-3);
            // a round column: densest at its centre, thinning to nothing at each limb, and the limb wanders with height
            float fc = clamp(facing - 0.1 * (0.5 + 0.5 * sin(y * 0.017 + vS * 2.1 + 1.3 * sin(y * 0.041 + a * 3.))), 0., 1.);
            float soft = mix(1., fc * fc * fc * fc * (3. - 2. * fc), vRad.z); alpha *= soft * mix(1., 0.8, vRad.z);
            alpha *= mix(1., 1. - smoothstep(290., 500., y), vRad.z);                              // from outside its top melts into the lid
            float core = mix(1., smoothstep(0.3, 0.85, fc), vRad.z);
            float gl = glints(uv, fw, vS) + 0.7 * glints(uv * 0.37 + 7.3, fw * 0.37, vS + 5.);
            gl *= (1. - smoothstep(0., 520., y) * 0.7) * soft * mix(1. - smoothstep(0.05, 0.2, V.y), 0.62 * (1. - 0.85 * smoothstep(40., 210., y)), vRad.z);
            col *= mix(1., 1. - 0.3 * smoothstep(50., 230., y), vRad.z);                        // darkening up into the lid
            col = col * mix(0.78 + 0.14 * fold, 0.66 + 0.36 * fold, vRad.z);
            col = mix(skyCol(vec3(V.x, abs(V.y), V.z)) * 1.04, col, core);                         // the limb is bright haze, not a dark edge
            col += mix(vec3(1.0, 0.6, 0.26) * 1.25, vec3(1.0, 0.8, 0.5) * 2.4, vRad.z) * gl * (0.45 + 0.55 * fold);   // amber from inside, bright only as the far column
            float st = (beads(us, fws, vS, sgx) + 0.8 * beads(us * 2.3 + 5.1, fws * 2.3, vS + 3., sgx)) * vRad.z * sqrt(soft) * (1. - 0.75 * smoothstep(120., 430., y));
            float hush = 1. - (1. - smoothstep(100., 170., dist)) * smoothstep(0.1, 0.26, V.y);   // come close, the glitter overhead goes out: the lid is a quiet ground
            st *= hush; gl *= mix(1., hush, vRad.z);
            // from outside the column stands lit: its flank toward the tear glows amber against the dusk behind, and its glitter is brighter there
            float flank = 0.3 + 0.7 * smoothstep(-0.4, 0.9, dot(vRad.xy, uSun.xz) / max(length(uSun.xz), 1e-3));
            col += mix(cEmber, cHaze, 0.55) * 0.2 * flank * core * vRad.z * (1. - 0.7 * smoothstep(60., 420., y));
            col += vec3(1.0, 0.78, 0.45) * 2.6 * st * (0.5 + 0.5 * fold) * (1. + 0.9 * flank);
            gl_FragColor = vec4(col, clamp(alpha + gl * 0.5 * soft + st * 0.5, 0., 1.));
          }
          #include <fog_fragment>
        }`}),f=new t.Mesh(i,u);f.name="curtain",f.frustumCulled=!1,f.renderOrder=.5,z.add(f)}await F.yield();{const e=[],o=[],a=[],s=Math.PI*2,l=(r,c)=>{const n=e.length/3;for(const[p,w]of[[-1,-1],[1,-1],[1,1],[-1,1]])e.push(r,0,c),o.push(p,w);a.push(n,n+1,n+2,n,n+2,n+3)},h=(r,c,n)=>{const p=e.length/3,w=c.length-1;for(let b=0;b<=w;b++)for(let P=0;P<=r;P++)e.push(P/r*s,c[b],n),o.push(0,0);for(let b=0;b<w;b++)for(let P=0;P<r;P++){const G=p+b*(r+1)+P,N=G+r+1;a.push(G,G+1,N,G+1,N+1,N)}};h(36,[0,.3,.58,.8,1],0);for(let r=0;r<18;r++)l(r/18*s,1),l(r/18*s,2);h(8,[0,.16,.4,.58,.7,.8,.91,1],3),l(0,4);const d=new t.InstancedBufferGeometry;d.setAttribute("position",new t.BufferAttribute(new Float32Array(e),3)),d.setAttribute("aQ",new t.BufferAttribute(new Float32Array(o),2)),d.setIndex(a);const i=new Float32Array(g*g*2+20).fill(-1);i[g*g*2+2]=-2;for(let r=0;r<8;r++)i[g*g*2+4+r*2]=-3-r;for(let r=0;r<g;r++)for(let c=0;c<g;c++)i[(r*g+c)*2]=r,i[(r*g+c)*2+1]=c;d.setAttribute("aCell",new t.InstancedBufferAttribute(i,2)),d.instanceCount=g*g+10,d.boundingSphere=R;const u=new t.ShaderMaterial({uniforms:V(),fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:S+L+M+`
        attribute vec2 aQ; attribute vec2 aCell;
        varying vec3 vN, vV, vR, vU; varying vec2 vQ; varying vec3 vPar; varying float vAng; // part, alpha, row
        varying vec3 vG; uniform vec3 uSun;   // radial direction (x, z) and how far this side faces the torn patch
        const float GRAV = 1.35;
        // top-of-wall radius and height at angle a, time tau (the 18 points ride cos 18a)
        vec2 wallAt(float a, float v, float tau, float r0, float hv){
          float gr = smoothstep(0., 1.2, tau), fo = smoothstep(1.5, 2.7, tau);
          float tooth = 0.5 + 0.5 * cos(18. * a); float sp = smoothstep(0.45, 1.2, tau);
          float r = r0 * (0.3 + 0.7 * gr) * (1. + (0.10 + 0.22 * gr) * v * sqrt(v) + 0.16 * fo * v) + 0.05 * r0 * (tooth - 0.5) * v;
          float y = 1.1 * hv * sqrt(gr) * (1. - fo) * (1. - fo) * (min(v, 0.8) * 1.02 + 0.26 * sp * max(v - 0.8, 0.) * 5.);
          return vec2(r, y);
        }
        void main(){
          vec3 cam = camLocal(); float part = position.z, a = position.x, v = position.y;
          vec2 base = floor(cam.xz / CELL); vec2 cell = base + mod(aCell - base + 6., 12.) - 6.;
          float tt = cellClock(cell, CYC); float n = floor(tt); float tau = (tt - n) * CYC;
          vec3 s = site(cell, n, CELL);
          float show = step(fract(s.z * 13.7), crownDensity(s.xy));
          vec4 ft = aCell.x < -1.5 ? uFeat2 : uFeat; vec2 ftk = aCell.x < -1.5 ? uFeat2K : uFeatK;
          float pid = max(-aCell.x - 3., 0.);
          if (aCell.x < -2.5) { vec4 f = uPass[int(pid + 0.5)]; ft = vec4(f.xyz, step(0.01, f.w)); ftk = vec2(f.w, 1.); }
          if (aCell.x < -0.5) { tau = ft.z; s = vec3(ft.xy, 0.9); show = ft.w * step(0., tau) * step(tau, 6.4); }
          vec2 dc = abs(s.xy - cam.xz); show *= 1. - smoothstep(24., 29., max(dc.x, dc.y));
          float fk = aCell.x < -0.5 ? ftk.x : 1., bk = aCell.x < -0.5 ? ftk.y : 1.;
          float r0 = uSize * mix(1.0, 1.45, fract(s.z * 7.31)) * fk, hv = (0.85 + 0.4 * fract(s.z * 3.17)) * (0.5 + 0.5 * fk) * (1. + 0.14 * sin(pid * 1.7));
          a += s.z * 6.283 + pid * 2.3;                                      // never two crowns in step
          vec3 rad = vec3(cos(a), 0., sin(a)), tng = vec3(-rad.z, 0., rad.x), up = vec3(0., 1., 0.);
          vec3 O = vec3(s.x, swellH(s.xy), s.y), p = O; vec3 nrm = up; float alpha = 1.; float sc = 0.;
          vR = camRight(); vU = camUp(); vQ = aQ; vAng = position.x;
          vG = vec3(rad.x, rad.z, dot(rad.xz, uSun.xz) / max(length(uSun.xz), 1e-3));
          if (part < 0.5) {                                      // the wall
            vec2 w = wallAt(position.x, v, tau, r0, hv);
            p += rad * w.x + up * (w.y - 0.03);
            nrm = normalize(rad + tng * (0.7 * sin(18. * position.x) * v) + up * (0.35 - 0.5 * v));
            alpha = smoothstep(0.02, 0.2, tau) * (1. - smoothstep(2.2, 3.1, tau)) * smoothstep(4.4, 7.2, length(s.xy - cam.xz));
          } else if (part < 2.5) {                               // a bead and the thread that feeds it
            float h = fract(sin(position.x * 12.9898 + s.z * 78.233) * 43758.5453);
            float tr = 1.15 + 0.4 * h;                           // when this bead lets go
            vec2 w0 = wallAt(position.x, 1., min(tau, tr), r0, hv);
            float tb = max(tau - tr, 0.), st = smoothstep(0.7, tr, tau) * 0.16;
            vec3 B = O + rad * (w0.x + 0.5 * tb) + up * (w0.y + st + 0.62 * tb - 0.5 * GRAV * tb * tb);
            float br = uSize * (0.05 + 0.035 * h) * smoothstep(0.6, 1.1, tau) * step(0.03, B.y - O.y);
            if (part < 1.5) { p = B + (vR * aQ.x + vU * aQ.y) * br; sc = br; }
            else {
              vec2 w1 = wallAt(position.x, 1., tau, r0, hv); vec3 T = O + rad * w1.x + up * w1.y;
              float k = aQ.y * 0.5 + 0.5; vec3 c = mix(T, B, k);
              float wd = max(0.014, length(c - cam) * 0.0011) * (1. - 0.6 * k) * (1. - smoothstep(tr, tr + 0.3, tau)) * smoothstep(0.8, 1.0, tau);
              vec3 ax = B - T; vec3 side = cross(ax, c - cam); side /= max(length(side), 1e-4);
              p = c + side * (aQ.x * wd);
            }
          } else {                                               // the rebound column and its melon bead
            float tc = tau - 2.0;
            float k = smoothstep(0., 0.85, tc) * (1. - smoothstep(1.05, 1.75, tc));   // (it sinks back soon after it throws its bead: a stem standing alone reads as a pawn)
            float colH = 1.6 * k;
            if (part < 3.5) {
              // a flared foot, a neck, and a rounded bead on top (it thins as the bead is thrown clear)
              float w1 = 1. - v, foot = 0.08 * r0 * w1 * w1 * w1 * w1, hb = (v - 0.8) / 0.2;
              float stem = 0.07 * (1. - 0.62 * exp(-(v - 0.5) * (v - 0.5) / 0.02)) * (1. - smoothstep(0.8, 1., v));
              float head = 0.2 * uSize * sqrt(max(1. - hb * hb, 0.)) * (1. - 0.4 * smoothstep(2.75, 3.1, tau));
              float rr = (foot + stem + head) * min(k * 4., 1.);
              p += rad * rr + up * (colH * v - 0.02);
              nrm = hb > -1. ? normalize(rad * max(sqrt(max(1. - hb * hb, 0.)), 0.12) + up * hb) : normalize(rad + up * (0.9 * w1 * w1 * w1));
              alpha = min(k * 5., 1.) * (1. - 0.7 * smoothstep(13., 24., length(s.xy - cam.xz)));   // far stems go faint: at a distance the crown and its rings carry the splash
            } else {
              float tb = max(tau - 2.75, 0.);
              float y = max(colH, 1.6 * step(0.001, tb)) + (1.94 * tb - 0.5 * GRAV * tb * tb) * bk;
              float br = uSize * 0.105 * smoothstep(0.2, 0.8, tc) * step(0.02, y);
              float wob = 0.16 * sin(uTime * 5. + s.z * 30.);
              p += up * (y + br) + (vR * aQ.x * (1. + wob) + vU * aQ.y * (1. - wob)) * br; sc = br;
            }
          }
          p = mix(O, p, show);
          vN = nrm; vV = p - cam; vPar = vec3(part, alpha * show, v);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:A+T+`
        varying vec3 vN, vV, vR, vU; varying vec2 vQ; varying vec3 vPar; varying float vAng; varying vec3 vG;
        void main(){
          vec3 V = normalize(vV + vec3(0., 1e-5, 0.)); vec3 col; float alpha = vPar.y;
          if (alpha < 0.01) discard;
          float lobeEdge = 1.;
          if (vPar.x < 0.5) {                                     // the 18 lobes of the crown's lip
            float tz = clamp((vPar.z - 0.8) * 5., 0., 1.); float pr = 0.5 + 0.5 * cos(18. * vAng);
            lobeEdge = (1. - (1. - pr) * (1. - pr)) * 0.96 + 0.04 - tz;      // rounded scallops with narrow notches between, not spikes
            if (lobeEdge < 0.) discard;
          }
          if (vPar.x < 0.5) {                                     // the wall: fluted glass, amber where the light comes through
            vec3 radV = normalize(vec3(vG.x, 0., vG.y) + vec3(1e-4, 0., 0.)), tng = vec3(-radV.z, 0., radV.x);
            float fl = cos(36. * vAng + 0.9), fl2 = cos(108. * vAng + 1.3), fa = smoothstep(0.02, 0.3, vPar.z);   // two flutes to a lobe, so the wall is one sheet, not a ring of prongs
            vec3 n = normalize(radV + tng * ((0.8 * sin(36. * vAng + 0.9) + 0.18 * sin(108. * vAng + 1.3)) * fa) + vec3(0., 0.35 - 0.5 * vPar.z, 0.));
            // a glint keyed to the flute's own facing (it holds in every light): the side of a flute that looks at the tear, low on the wall
            float gs = dot(n, uSun), glint = smoothstep(0.8, 0.96, gs) * smoothstep(0.08, 0.3, vPar.z) * (1. - smoothstep(0.42, 0.74, vPar.z)) * fa;
            if (dot(n, V) > 0.) n = -n;
            float c = clamp(-dot(n, V), 0., 1.); float fr = (1. - c) * (1. - c);
            vec3 rf = reflect(V, n);
            float sp = max(dot(rf, uSun), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
            float band = smoothstep(-0.6, 0.6, fl), glassL = mix(0.42, 1.12, band * fa + 0.5 * (1. - fa)) * (0.88 + 0.12 * fl2);   // bright and dark flutes
            float thru = smoothstep(-0.2, 0.8, vG.z);                         // the sunward half glows
            float lipB = smoothstep(0.72, 0.84, vPar.z) * (1. - smoothstep(0.02, 0.24, lobeEdge));
            float lipZ = smoothstep(0.7, 0.86, vPar.z), thru2 = thru * thru;
            col = envCol(normalize(rf)) * (0.3 + 0.7 * fr) * glassL * (1. - 0.55 * lipZ * (1. - thru)) * (1. - 0.45 * thru);
            col += mix(cEmber, cHaze, 0.22) * vec3(1.2, 0.84, 0.44) * (1.7 * thru2 + 0.25 * thru) * glassL * (0.55 + 0.45 * vPar.z);      // light coming through the wall: honey, deeper than the ice
            col += mix(cCool, cDeep, 0.3) * 0.5 * (1. - thru) * glassL;                                                                 // the far half: dusk glass
            col += vec3(1., 0.84, 0.56) * (1.2 * lipB * smoothstep(0.25, 0.85, vG.z) + 2.6 * sp + 3.4 * glint);   // the lip is bright only where a lobe faces the tear
            // glass: the dark flutes of the lit half let the water behind show through; only the bright flutes, the lip and the glints are solid
            alpha *= clamp(0.24 + 0.45 * fr + (0.1 + 0.42 * thru2) * band * fa + 0.1 * thru2 + 0.3 * lipB * thru + sp + glint, 0., 0.96);
          } else if (vPar.x > 2.5 && vPar.x < 3.5) {              // the rebound column: a necked stem of the same glass
            vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (dot(n, V) > 0.) n = -n;
            float c = clamp(-dot(n, V), 0., 1.); float fr = (1. - c) * (1. - c);
            vec3 rf = reflect(V, n);
            float sp = max(dot(rf, uSun), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
            float sl = dot(n, uSun);
            col = envCol(normalize(rf)) * (0.35 + 0.65 * fr) + envCol(normalize(V - 0.9 * n)) * mix(vec3(1.), cHaze, 0.5) * 0.45 * c;
            col += mix(cEmber, cHaze, 0.4) * (0.1 + 0.8 * smoothstep(-0.3, 0.7, sl)) + cCool * 0.35 * (1. - smoothstep(-0.6, 0.2, sl)) + vec3(1., 0.84, 0.56) * (2.4 * sp + 1.3 * smoothstep(0.55, 0.85, sl) * fr);
            alpha *= clamp(0.5 + 0.45 * fr + sp, 0., 0.96);
          } else if (vPar.x > 1.5 && vPar.x < 2.5) {              // thread
            col = cHaze * 1.3 + cCream * 0.4; alpha *= 0.8 * (1. - vQ.x * vQ.x);
          } else {                                                // bead: a small lens
            float rho = length(vQ); if (rho > 1.) discard;
            float z = sqrt(max(1. - rho * rho, 0.)); vec3 F = cross(vR, vU);
            vec3 tang = vR * vQ.x + vU * vQ.y; vec3 n = normalize(tang + F * (z + 0.02));
            col = envCol(normalize(V - 1.45 * tang)) * mix(vec3(1.), cHaze, 0.4) * (0.55 + 0.45 * z) + cHaze * 0.1 * z;
            float sl = dot(n, uSun);
            col += vec3(1., 0.84, 0.54) * 4.0 * smoothstep(0.56, 0.8, sl) * smoothstep(0.66, 0.93, rho);
            alpha *= 1. - smoothstep(0.85, 1., rho);
          }
          gl_FragColor = vec4(col, alpha);
          #include <fog_fragment>
        }`}),f=new t.Mesh(d,u);f.name="crowns",f.frustumCulled=!1,f.renderOrder=3,z.add(f)}await F.yield();{const e=new t.InstancedBufferGeometry;e.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,0,0,1,0,0,1,2,0,-1,2,0]),3)),e.setIndex([0,1,2,0,2,3]);const o=new Float32Array(x*x*2);for(let l=0;l<x;l++)for(let h=0;h<x;h++)o[(l*x+h)*2]=l,o[(l*x+h)*2+1]=h;e.setAttribute("aCell",new t.InstancedBufferAttribute(o,2)),e.instanceCount=x*x,e.boundingSphere=R;const a=new t.ShaderMaterial({uniforms:V({uGrid:{value:x}}),fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,vertexShader:S+L+M+`
        attribute vec2 aCell; uniform float uGrid; uniform vec3 uSun;
        varying vec2 vQ; varying vec3 vPar;
        void main(){
          vec3 cam = camLocal(); vec2 base = floor(cam.xz / FCELL);
          vec2 cell = base + mod(aCell - base + uGrid * 0.5, uGrid) - uGrid * 0.5;
          float tt = cellClock(cell, FCYC); float n = floor(tt); float tau = (tt - n) * FCYC;
          vec3 s = site(cell, n, FCELL);
          float show = step(fract(s.z * 13.7), shaftDensity(s.xy)) * step(tau, 1.05) * step(fract(s.z * 31.7), 0.45);
          vec2 dc = abs(s.xy - cam.xz); float hw = uGrid * FCELL * 0.5;
          show *= 1. - smoothstep(hw * 0.8, hw * 0.97, max(dc.x, dc.y));
          vec3 R = camRight(); vec3 rt = vec3(R.x, 0., R.z); rt /= max(length(rt), 1e-3);
          float W = 0.30 * uSize * (0.7 + 0.6 * s.z) * (0.55 + 0.45 * smoothstep(0., 0.5, tau)) * show;
          vec3 p = vec3(s.x, swellH(s.xy) - 0.01, s.y) + rt * (position.x * W) + vec3(0., position.y * W, 0.);
          vQ = position.xy; vPar = vec3(tau, dot(rt, uSun), s.z);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:A+T+`
        varying vec2 vQ; varying vec3 vPar;
        void main(){
          float tau = vPar.x, x = vQ.x, y = vQ.y;
          float life = smoothstep(0., 0.3, tau) * (1. - smoothstep(0.45, 1.0, tau));
          float wx = 0.56 + 0.34 * min(y, 1.); float xs = x / wx;
          float top = 0.85 * life * (0.7 + 0.3 * abs(cos(xs * 7.9 + vPar.z * 6.))) * sqrt(max(1. - xs * xs * 0.5, 0.));
          float inside = step(abs(xs), 1.) * (1. - smoothstep(top - 0.04, top, y));
          float rim = smoothstep(top - 0.22, top - 0.03, y) * inside;
          float sunny = smoothstep(0.2, 0.95, xs * sign(vPar.y) ) * abs(vPar.y);
          float edge = xs * xs; edge *= edge;
          vec3 col = mix(mix(cDeep, cCool, 0.5), cEmber, 0.3 + 0.3 * sunny) * 0.8 + cHaze * (0.45 * rim + 0.3 * edge) * (0.4 + 0.6 * sunny) + vec3(1., 0.7, 0.36) * 1.0 * sunny * (0.3 + 0.7 * rim);
          float alpha = inside * clamp(0.2 + 0.4 * rim + 0.4 * edge + sunny * 0.4, 0., 0.8);
          // three beads thrown clear of the rim
          float tb = clamp(tau / 1.0, 0., 1.);
          for (int i = 0; i < 3; i++) {
            float fi = float(i) - 1.; float h = fract(vPar.z * (7.3 + 3.1 * fi));
            vec2 b = vec2(fi * 0.55 + (h - 0.5) * 0.3 + fi * 0.3 * tb, 0.2 + (1.9 + 0.5 * h) * tb * (1. - tb) * 2.4 * 0.5);
            float d = length(vQ - b); float bead = (1. - smoothstep(0.07, 0.11, d)) * step(0.04, tau) * step(tau, 1.0);
            col = mix(col, cEmber * 0.7 + vec3(1., 0.74, 0.4) * 1.3 * smoothstep(0.0, 0.07, (vQ.x - b.x) * sign(vPar.y)), bead);
            alpha = max(alpha, bead);
          }
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(col, alpha);
          #include <fog_fragment>
        }`}),s=new t.Mesh(e,a);s.name="coronets",s.frustumCulled=!1,s.renderOrder=2.5,z.add(s)}await F.yield();const q=new t.Vector3,ee=(e,o=6)=>{const a=v.uTrack.value;for(let s=0;s<6;s++){const l=e[Math.min(s,e.length-1)];a[s].set(l.x??l[0],l.z??l[2])}v.uClear.value=o};m.track?ee(m.track,m.clear??6):v.uClear.value=0;const y=(e,o,a)=>new t.Vector3(e,o,a),te=y(56,56,126).normalize(),se=/feat=1/.test(globalThis.location?.search||""),U=!/hv=out/.test(globalThis.location?.search||"");return{object:z,ground:!1,groundY:0,radius:U?6:90,height:U?7:50,center:y(0,U?3.6:16,0),anchors:{seat:y(-50,0,215),extent:{coreRadius:65,rimRadius:90,top:520,lidRadius:200,nearDrops:x*.625,crowns:29},flyThrough:ae.map(e=>y(e[0],e[1],e[2])),entryView:{position:y(50,6,-215),lookAt:y(0,60,0)},insideView:{position:y(0,4,0),lookAt:y(8,4.2,55)},crownWatch:{position:y(0,3.8,0),side:y(1,0,0)},portalSeat:{position:y(128,96,323),facing:te.clone().negate(),dir:te},sun:W.clone(),drift:v.uDrift.value,variants:{light:D,rain:j,swell:O}},uniforms:v,glsl:{hash:S,sky:A},setTrack:ee,setDrift(e,o){v.uDrift.value.set(e,o)},setSun(e){v.uSun.value.copy(e).normalize()},setFeature(e,o,a,s=1,l=1){v.uFeat.value.set(e,o,a,1),v.uFeatK.value.set(s,l)},setCalm(e,o,a,s){v.uCalm.value.set(e,o,a,s)},setLane(e,o,a,s,l,h=1){v.uLane.value.set(e,o,a,s),v.uLaneK.value.set(l,h)},setPasser(e,o,a,s,l){v.uPass.value[e].set(o,a,s,l)},setFeature2(e,o,a,s=1,l=1){v.uFeat2.value.set(e,o,a,1),v.uFeat2K.value.set(s,l)},clearFeature(){v.uFeat.value.w=0,v.uFeat2.value.w=0},update(e,o,a){if(v.uTime.value=o,se&&v.uFeat.value.set(3,14,(o+7.2)%13-3,1),a&&m.autoDim!==!1){z.updateWorldMatrix(!0,!1),z.worldToLocal(a.getWorldPosition(q));const s=Math.hypot(q.x,q.z),l=1-Math.min(1,Math.max(0,(s-60)/60));v.uRainDim.value=.85*l*l*(3-2*l)}},dispose(){}}}export{re as buildHero};
