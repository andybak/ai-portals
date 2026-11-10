import*as e from"three";import{mergeGeometries as Fe}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as Kt}from"../kit/core.js";import{makeSky as To,makeCloudField as Do,skyDirection as Yt}from"../kit/sky.js";import*as ke from"../kit/flora.js";import*as ge from"../kit/fauna.js";import*as R from"../kit/fx.js";import{buildHero as Lo}from"../parts/hail-cathedral.js";const j=Math.PI/180,we=["#1d2e2c","#2b2547","#6a5aa8","#9fe0d0","#0b1c52","#fff3da","#ff5a3c"],We=330,Me=760,S=(t,i=1)=>{const v=new e.Color(t);return new e.Vector3(v.r*i,v.g*i,v.b*i)},ct={afternoon:{slit:"#e8a23c",haze:"#7a5a30",amb1:"#a9b8a4",gloom:"#3c5a4a",under:"#1d2e2c",lowSun:"#ffcf8a",sunI:1,sky:{preset:"sunset",zenith:"#020618",mid:"#0b1c52",horizon:"#1f3a8c",ground:"#16224e",scatterColor:"#ffa62c",scatter:.38,scatterPow:9,scatterHigh:.02,scatterFall:5.5,sunGlow:.7,stars:.3,sunColor:"#fff0d0"},anvilLit:"#fff0d2",anvilShade:"#1c3480",anvilHaze:"#2f4c9c",halo:"#fff4e0",portal:"#fff3da",spriteGain:1,wallGain:1,cream:.8,pearl:"#6f7498",creamCol:"#fff3da",plum:"#3d3a5c"},dawn:{slit:"#f08a6a",haze:"#7c4f48",amb1:"#aeaab0",gloom:"#3d5350",under:"#1f2c30",lowSun:"#ffb89a",sunI:.9,sky:{preset:"dawn",zenith:"#02030e",mid:"#191c5a",horizon:"#6a5aa8",ground:"#33305c",scatterColor:"#ff8f7a",scatter:.7,stars:.28,sunColor:"#ffe0c8"},anvilLit:"#ffd0b0",anvilShade:"#4a4692",anvilHaze:"#7c6aae",halo:"#ffe6d8",portal:"#ffd9c4",spriteGain:1.15,wallGain:1,cream:.78,pearl:"#b88aa2",creamCol:"#ffc4a2",plum:"#4c3154"},night:{slit:"#7f9cf0",haze:"#33466e",amb1:"#8098bc",gloom:"#3f6a64",under:"#182a2c",lowSun:"#8aa2e0",sunI:.45,sky:{preset:"night",zenith:"#00010a",mid:"#040a24",horizon:"#16264e",ground:"#0a1228",stars:1},anvilLit:"#9db4e6",anvilShade:"#0c163c",anvilHaze:"#16244c",halo:"#dfe8ff",portal:"#cfe0ff",spriteGain:1.35,wallGain:.85,cream:.42,pearl:"#3a4a80",creamCol:"#9db4e6",plum:"#23264a"}},Vo={ripe:{root:"#8a6c2c",tip:"#d8b560",ground:"#a8893e",tall:[.85,1.25],rain:1,dust:.25,chaff:1,veil:!0,nave:1,drops:1,stri:.22},spring:{root:"#2f4e1e",tip:"#8fb04c",ground:"#4f6a2c",tall:[.7,1.05],rain:1.4,dust:0,chaff:.5,veil:!0,nave:1.15,drops:1.6,stri:.2},stubble:{root:"#6e5a34",tip:"#c2a468",ground:"#93794a",tall:[.28,.5],rain:.5,dust:1.5,chaff:1.6,veil:!0,nave:1,drops:.7,stri:.24},dry:{root:"#8f702a",tip:"#e2ba5c",ground:"#ad8c40",tall:[.8,1.2],rain:.08,dust:.9,chaff:1.2,veil:!1,nave:.72,drops:.2,stri:.36}};function Ro(t){const M=[[0,4.2,0],[0,4.2,-24],[0,4.25,-48]],p=k=>{const u=L=>{const A=Math.min(1,Math.max(0,L));return A*A*(3-2*A)};return k<50?58*u(k/50):k<425?58:58+(3.5-58)*u((k-50-400+25)/90)};let b=4.3,n=0;const s=575;for(let k=0;k<=s+1e-6;k+=25){M.push([t*80*(1-Math.cos(k*j)),b,-70-80*Math.sin(k*j)]),Math.abs(k-425)<1e-6&&(n=b);for(let u=0;u<25;u++)b+=80*j*Math.tan(p(k+u+.5)*j)}const G=s*j,y=M[M.length-1],V=t*Math.sin(G),O=-Math.cos(G);for(const k of[60,120,180,240,300,360])M.push([y[0]+V*k,y[1]+Math.tan(3.5*j)*k,y[2]+O*k]);const I=Kt(M,{samples:480}),B=new e.Vector3,q=k=>{let u=0,L=1;for(let A=0;A<30;A++){const d=(u+L)/2;I.pointAt(d,B).y<k?u=d:L=d}return(u+L)/2};return{path:I,axis:new e.Vector3(t*80,0,-70),R:80,uIn:q(120),uOut:q(n),yOut:n,uAtY:q,endDir:new e.Vector3(V,0,O),uRun:1-360/I.length}}const Uo=`
  ${R.GLSL_NOISE}
  uniform vec3 uCam, uUnder, uGloom, uHaze, uSlit, uFogCol, uBoltCol;
  uniform vec2 uCentre, uSlitXZ;
  uniform float uTime, uMurk, uRain, uSlitAz, uNight;
  varying vec3 vDir;
  vec2 rot2(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
  float pulse(float t, float period, float ph){ float x = fract(t / period + ph) * period; return smoothstep(0.0, 0.3, x) * (1.0 - smoothstep(0.3, 1.1, x)); }
  // one tier of the lowering wall cloud: a ragged, turning disc at height h. rgb + coverage
  vec4 tier(vec2 dxz, float h, float rad, float dark, float spin){
    vec2 q = uCam.xz + dxz * max(h - uCam.y, 9.0) - uCentre;
    float r = length(q);
    vec2 qw = rot2(q, uTime * spin);
    float n = fbm(qw * 0.0052), nb = vnoise(qw * 0.021 + uTime * 0.05), sc = fbm(qw * 0.017 + 3.0);
    float edge = rad * (1.0 + 0.3 * (n - 0.5)) + 110.0 * (sc - 0.5);                 // ragged scud round the rim
    float cov = 1.0 - smoothstep(edge - 46.0, edge + 14.0, r);
    float rim = smoothstep(edge - 210.0, edge, r) * cov;
    float toSlit = dot(q / max(r, 1.0), uSlitXZ);                                    // +1 on the edge nearest the horizon light
    float band = 0.75 + 0.25 * sin(r / 46.0 + n * 9.0);                             // striations following its rim
    vec3 c = mix(uUnder * 0.7, uGloom, clamp(0.12 + 0.75 * n * (0.45 + nb), 0.0, 1.0)) * dark * band;
    c += uGloom * 0.8 * rim * (0.4 + nb);                                           // the paler lip of its lower edge
    c += uSlit * rim * (0.1 + 1.05 * smoothstep(-0.2, 0.9, toSlit)) * (0.45 + nb);  // lit amber where it faces the horizon slit
    return vec4(c, cov);
  }
  void main(){
    vec3 d = normalize(vDir + vec3(0.0, 1e-5, 0.0));
    float el = d.y, az = atan(d.x, -d.z + 1e-6);
    float elc = max(el, 0.012);
    vec2 dxz = d.xz / elc;
    // main base: striation plates wound in a spiral about an off-centre, lopsided core, turning
    float h1 = max(300.0 - uCam.y, 14.0);
    vec2 p1 = uCam.xz + dxz * h1, q0 = p1 - uCentre - vec2(0.0, -420.0);
    vec2 q1 = q0 + 300.0 * (vec2(vnoise(q0 * 0.0008), vnoise(q0 * 0.0008 + 17.3)) - 0.5);
    q1 = vec2(q1.x * 0.8 + q1.y * 0.14, q1.y * 1.12);
    float r1 = length(q1);
    vec2 qr = rot2(q1, uTime * 0.06 * 900.0 / (r1 + 500.0));
    float n1 = fbm(qr * 0.0014), n1b = fbm(qr * 0.0062 + 7.0), n1c = vnoise(qr * 0.034 + n1b * 2.0);
    float ang = atan(qr.y, qr.x + 1e-4) / 6.2832;
    float pl = r1 * (1.0 + 0.3 * (n1 - 0.5)) / 235.0 + ang, pf = mix(0.45, fract(pl), smoothstep(110.0, 420.0, r1));
    float far1 = exp(-r1 / 4600.0);
    float lip = smoothstep(0.0, 0.16, pf) * (1.0 - 0.82 * pf);
    float tex = 0.5 + 1.0 * n1b * (0.55 + 0.9 * n1c);
    float shade = mix(0.5, 0.2 + 1.1 * lip, far1) * tex;
    vec3 col = mix(uUnder * 0.55, uGloom, clamp(shade, 0.0, 1.5));
    float lowBand = smoothstep(0.07, 0.16, el) * (1.0 - smoothstep(0.36, 0.55, el));        // 5 to 25 degrees up: what the entry axis sees
    col += uSlit * (0.14 + 0.3 * lowBand) * lip * far1 * tex;                              // plate lips catch the horizon light
    col *= 1.0 - 0.38 * lowBand * (1.0 - lip) * far1;                                       // and the plates between them sink back
    col += uGloom * vec3(0.4, 1.0, 0.7) * 0.22 * exp(-r1 / 900.0) * tex;                   // hail-green core over the updraft
    // wall cloud: two darker tiers hanging under the base, the lower one smaller, turning at their own rates
    float up = step(0.0, el);
    vec4 t2 = tier(dxz, 218.0, 560.0, 0.8, 0.08), t3 = tier(dxz, 150.0, 440.0, 0.55, 0.12);
    col = mix(col, t2.rgb, t2.a * up); col = mix(col, t3.rgb, t3.a * up);
    // slow, eased glows crawling in the base (never flashes)
    float b1 = pulse(uTime, 3.7, 0.0), b2 = pulse(uTime, 5.3, 0.41);
    vec2 bp1 = uCentre + vec2(420.0, 260.0), bp2 = uCentre + vec2(-760.0, -340.0);
    col += uBoltCol * (b1 * exp(-dot(p1 - bp1, p1 - bp1) / 5.0e5) + b2 * exp(-dot(p1 - bp2, p1 - bp2) / 8.0e5)) * (0.35 + 0.9 * n1) * (0.35 + 0.65 * lip + 0.5 * n1b) * 0.9;
    // distance: everything sinks into the haze towards the horizon
    float hz = exp(-max(el, 0.0) * 16.0);
    col = mix(col, uHaze, hz);
    // the slit of light along the horizon, strongest on the sun side
    float da = az - uSlitAz; da = atan(sin(da), cos(da));
    float west = 0.22 + 0.78 * exp(-da * da / 1.1);
    float se = (el - 0.03) / (el > 0.03 ? 0.034 : 0.022); float sl = exp(-se * se) * west;
    col += uSlit * sl * (1.9 - 0.7 * uNight) * (0.85 + 0.25 * vnoise(vec2(az * 9.0, uTime * 0.05)));
    // rain shafts hanging in front of the slit, just right of it, and a thinner one to the left
    float dr = az - (uSlitAz + 0.52); dr = atan(sin(dr), cos(dr));
    float dl = az - (uSlitAz - 0.8); dl = atan(sin(dl), cos(dl));
    float sway = 0.05 * sin(el * 9.0 - uTime * 0.4);
    float rmask = (exp(-(dr + sway) * (dr + sway) / 0.05) + 0.55 * exp(-(dl - sway) * (dl - sway) / 0.016)) * uRain * smoothstep(0.42, 0.02, el) * up;
    float streak = fbm(vec2(az * 30.0 + el * 5.0, el * 2.2 - uTime * 0.3));
    vec3 rcol = mix(uHaze, uGloom * 0.9 + vec3(0.03), 0.7) * (0.4 + 0.7 * streak);
    col = mix(col, rcol, clamp(rmask * (0.55 + 0.6 * streak), 0.0, 0.92));
    // below the horizon the dome is the fog the ground fades into
    col = mix(col, uHaze, smoothstep(0.0, -0.02, el));
    col = mix(col, uFogCol, uMurk);
    gl_FragColor = vec4(col, 1.0);
  }
`,Zt="varying vec3 vDir; void main(){ vDir = position; vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; }";function _o(t,i,v){const g={uTime:v,uCam:{value:new e.Vector3},uCentre:{value:new e.Vector2(-120,-940)},uMurk:{value:0},uUnder:{value:S(t.under)},uGloom:{value:S(t.gloom,.6)},uHaze:{value:S(t.haze)},uSlit:{value:S(t.slit)},uFogCol:{value:new e.Color},uBoltCol:{value:S("#8f7fe0",t===ct.night?2.6:.7)},uRain:{value:Math.min(1,i.rain)},uSlitAz:{value:-22*j},uSlitXZ:{value:new e.Vector2(Math.sin(-22*j),-Math.cos(-22*j))},uNight:{value:t===ct.night?1:0}},h=new e.Mesh(new e.SphereGeometry(900,40,20),new e.ShaderMaterial({uniforms:g,vertexShader:Zt,fragmentShader:Uo,side:e.BackSide,depthWrite:!1,depthTest:!1}));return h.renderOrder=-2,h.frustumCulled=!1,h.name="supercell-underside",{mesh:h,uniforms:g}}function Eo(t,i){const v={uTime:t,uAmt:{value:0},uWisp:{value:S("#49b09c",i?.4:.55)},uBolt:{value:S("#8a72f0",i?2.6:2.2)},uGaze:{value:new e.Vector3(0,1,0)},uSurge:{value:0},uSun:{value:new e.Vector3},uSunDir:{value:new e.Vector3(0,1,0)}},g=new e.ShaderMaterial({uniforms:v,transparent:!0,depthWrite:!1,depthTest:!1,blending:e.AdditiveBlending,side:e.BackSide,vertexShader:Zt,fragmentShader:R.GLSL_HASH+R.GLSL_VALUE_NOISE+`
      uniform float uTime, uAmt, uSurge; uniform vec3 uWisp, uBolt, uSun, uSunDir, uGaze; varying vec3 vDir;
      float swell(float t, float period, float ph){ float x = fract(t / period + ph) * period; return smoothstep(0.0, 0.7, x) * (1.0 - smoothstep(0.9, 2.6, x)); }
      void main(){
        vec3 d = normalize(vDir + vec3(0.0, 1e-5, 0.0));
        vec3 q = d * 3.2 + vec3(0.0, uTime * 0.9, uTime * 0.12);
        float w = vnoise(q) * 0.6 + vnoise(q * 2.3 + 5.0) * 0.4;
        float wisps = smoothstep(0.38, 0.8, w);
        float a = uTime * 0.13;
        vec3 c1 = normalize(vec3(cos(a), 0.55, sin(a))), c2 = normalize(vec3(cos(a * 0.7 + 2.4), -0.1, sin(a * 0.7 + 2.4))), c3 = normalize(vec3(cos(2.0 - a), 0.9, sin(2.0 - a)));
        float g = swell(uTime, 4.1, 0.0) * exp(-(1.0 - dot(d, c1)) * 9.0) + swell(uTime, 5.3, 0.45) * exp(-(1.0 - dot(d, c2)) * 9.0) + swell(uTime, 4.7, 0.8) * exp(-(1.0 - dot(d, c3)) * 7.0);
        float sd = max(dot(d, uSunDir), 0.0), s2 = sd * sd;
        float gz = max(dot(d, uGaze), 0.0), w2 = vnoise(q * 0.7 + 11.0);
        float w3 = vnoise(q * 4.6 + 3.0);
        float surge = uSurge * (exp(-(1.0 - gz) * 9.0) * (0.12 + 1.1 * w * w2 + 0.5 * w * w3) + 0.22 * exp(-(1.0 - gz) * 30.0));   // the first slow discharge, deep in the cloud ahead
        vec3 col = uWisp * wisps * (0.55 + 0.45 * d.y) + uBolt * (g * (0.45 + 1.1 * w) + surge) + uSun * (s2 * s2 * s2 * s2 * s2 * s2 * s2 * s2 + 0.07 * sd) * (0.3 + 1.4 * w * w2 + 0.4 * w3) + uSun * wisps * 0.1;
        gl_FragColor = vec4(col * uAmt, 1.0);
      }`}),h=new e.Mesh(new e.SphereGeometry(1,24,12),g);return h.renderOrder=9,h.frustumCulled=!1,h.name="murk-glow",{mesh:h,uniforms:v}}function Bo(t,i,v){const g=new e.MeshLambertMaterial({color:t.ground}),h=new e.Color(t.root),c=new e.Color(t.ground),z=(f,P)=>`vec3(${(f.r*P).toFixed(4)}, ${(f.g*P).toFixed(4)}, ${(f.b*P).toFixed(4)})`;g.onBeforeCompile=f=>{f.uniforms.uTime=i,f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vWp;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vWp = (modelMatrix * vec4(position, 1.0)).xyz;`),f.fragmentShader=f.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vWp; uniform float uTime;
`+R.GLSL_HASH+R.GLSL_VALUE_NOISE).replace("#include <color_fragment>",`#include <color_fragment>
        vec2 fq = vWp.xz / 800.0 + vec2(0.37, 0.21);
        float tone = 0.72 + 0.5 * hash12(floor(fq));
        vec2 fb = abs(fract(fq) - 0.5);
        float border = smoothstep(0.494, 0.499, max(fb.x, fb.y));
        float dist = length(vWp.xz - cameraPosition.xz);
        float w = vnoise(vec2(vWp.x * 0.018, vWp.z * 0.045 + uTime * 1.1)) * vnoise(vec2(vWp.x * 0.07 + 3.0, vWp.z * 0.16 + uTime * 2.3));
        float wave = mix(1.0, 0.55 + 2.2 * w, exp(-dist / 500.0));
        // rows of laid stalks streaming with the wind: fine under the blade cards, coarser out across the field
        float s1 = vnoise(vec2(vWp.x * 6.0, vWp.z * 0.7 + uTime * 1.5)), s2 = vnoise(vec2(vWp.x * 1.3 + 9.0, vWp.z * 0.16 + uTime * 1.1));
        float nearK = exp(-dist / 75.0), midK = exp(-dist / 420.0);
        vec3 field = diffuseColor.rgb * tone * wave * mix(1.0, 0.72 + 0.56 * s2, midK);
        vec3 under = ${z(h,.72)} * tone * (0.8 + 0.4 * s1) * (0.8 + 0.4 * s2) * (0.75 + 0.5 * w);
        diffuseColor.rgb = mix(field, under, nearK * 0.9);
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 0.35, border);
        float rd = abs(vWp.z - (${v.toFixed(1)}));
        float gravel = 0.6 * vnoise(vWp.xz * 1.3) + 0.4 * vnoise(vWp.xz * 5.0 + 11.0);
        diffuseColor.rgb = mix(diffuseColor.rgb, ${z(c,.8)} * (0.8 + 0.4 * gravel), (1.0 - smoothstep(2.2, 4.5, rd + 0.9 * (s2 - 0.5))) * 0.85);   // pale dusty shoulders
        vec3 roadCol = vec3(0.2, 0.16, 0.115) * (0.7 + 0.6 * gravel) * (1.0 + 0.22 * exp(-(abs(rd - 1.0) * abs(rd - 1.0)) / 0.12));        // gravel, paler in the wheel tracks
        float drift = smoothstep(0.42, 0.66, vnoise(vWp.xz * vec2(0.035, 0.05) + 4.0) * 0.7 + 0.3 * vnoise(vWp.xz * 0.17));                 // dust and chaff drifted across it
        diffuseColor.rgb = mix(diffuseColor.rgb, roadCol, (1.0 - smoothstep(1.9, 3.0, rd + 0.6 * (gravel - 0.5) + 0.8 * drift)) * (1.0 - 0.8 * drift));`)};const w=new e.Mesh(new e.PlaneGeometry(9e3,9e3,1,1).rotateX(-Math.PI/2),g);return w.name="wheat-plain",w}function Oo(t,i,v,g){const z=new Float32Array(31392),w=new Uint16Array(10368*6);for(let G=0;G<=108;G++){const y=g*Math.pow(G/108,2.6);for(let V=0;V<96;V++){const O=V/96*Math.PI*2,I=(G*96+V)*3;z[I]=Math.cos(O)*y,z[I+1]=0,z[I+2]=Math.sin(O)*y}}for(let G=0,y=0;G<108;G++)for(let V=0;V<96;V++){const O=G*96+V,I=G*96+(V+1)%96,B=O+96,q=I+96;w[y++]=O,w[y++]=I,w[y++]=B,w[y++]=I,w[y++]=q,w[y++]=B}const f=new e.BufferGeometry;f.setAttribute("position",new e.BufferAttribute(z,3)),f.setIndex(new e.BufferAttribute(w,1)),f.boundingSphere=new e.Sphere(new e.Vector3,g*1.1);const P=new e.Vector2(v.x,v.z).normalize(),M={...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:i,uDomeH:{value:We},uDomeR:{value:Me},uEdge:{value:g*.62},uSunDir:{value:v.clone()},uSunXZ:{value:P},uLit:{value:S(t.anvilLit,.86)},uShade:{value:S(t.anvilShade,.8)},uHaze:{value:S(t.anvilHaze,.6)},uSunCol:{value:S(t.lowSun,t.sunI)},uRed:{value:S(we[6])},uTle:{value:new e.Vector3}},p=`
    uniform float uTime, uDomeH, uDomeR;
    float domeAt(float r){ return uDomeH * exp(-r * r / (uDomeR * uDomeR)); }
    vec3 ringPh(float r){ return vec3(r / 150.0 - uTime * 1.2, r / 420.0 - uTime * 0.52 + 1.3, r / 1100.0 - uTime * 0.25 + 0.4); }
    float ringEnv(float r){ return exp(-r / 5200.0) * smoothstep(300.0, 1200.0, r) * (1.0 - smoothstep(3600.0, 8500.0, r)); }`,b=new e.ShaderMaterial({uniforms:M,fog:!0,side:e.DoubleSide,vertexShader:p+`
      varying vec3 vWp; varying vec2 vQ;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position; float r = length(p.xz);
        vec3 ph = ringPh(r);
        p.y += domeAt(r) - r * r * 3.2e-7 + ringEnv(r) * (12.0 * sin(ph.x) * (1.0 - smoothstep(2500.0, 5000.0, r)) + 34.0 * sin(ph.y) + 48.0 * sin(ph.z));
        vQ = p.xz;
        vec4 wp = modelMatrix * vec4(p, 1.0); vWp = wp.xyz;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:R.GLSL_NOISE+p+`
      uniform vec3 uSunDir, uLit, uShade, uHaze, uSunCol, uRed, uTle; uniform vec2 uSunXZ; uniform float uEdge;
      varying vec3 vWp; varying vec2 vQ;
      #include <fog_pars_fragment>
      void main(){
        float r = length(vQ); vec2 rd = vQ / max(r, 1.0);
        float dist = length(vWp - cameraPosition);
        vec3 n1 = fbm3d(vQ * 0.0009 + 3.1), n2 = fbm3d(vQ * 0.0052 + vec2(uTime * 0.006, 0.0)), n3 = fbm3d(vQ * 0.028 + vec2(0.0, uTime * 0.02));
        vec3 n0 = fbm3d(vQ * 0.0004 + vec2(uTime * 0.0015, 7.7));                      // broad billows
        // rings racing out across the anvil like rings in a pond: slope for the light, height for the crests
        vec3 ph = ringPh(r); ph.x += (n0.x - 0.5) * 1.2;
        float env = ringEnv(r), k1 = exp(-dist / 7000.0), k2 = exp(-dist / 13000.0), k3 = exp(-dist / 22000.0);
        float g = env * (0.3 * cos(ph.x) * k1 + 0.24 * cos(ph.y) * k2 + 0.12 * cos(ph.z) * k3);
        float crest = env * (0.5 * sin(ph.x) * k1 + 0.4 * sin(ph.y) * k2 + 0.25 * sin(ph.z) * k3);
        float nearK = exp(-dist / 1500.0), midK = 0.3 + 0.7 * exp(-dist / 11000.0);
        vec2 grad = rd * (g - 2.0 * r / (uDomeR * uDomeR) * domeAt(r)) + n0.yz * 0.2 + n1.yz * 0.13 * midK + n2.yz * 0.11 * midK * midK + n3.yz * 0.1 * nearK;
        vec3 n = normalize(vec3(-grad.x, 1.0, -grad.y));
        float nl = dot(n, uSunDir);
        float lit = smoothstep(-0.13, 0.15, nl);                                             // a cream plain: only the lee slopes go cobalt
        vec3 nb = fbm3d(vQ * 0.00011 + 1.7);                                                // the biggest lumps, all that is left far off
        float farK = smoothstep(4500.0, 17000.0, dist);
        lit = mix(lit, 0.76 + 0.6 * (nb.x - 0.5) + 0.12 * (n0.x - 0.5) + 0.3 * crest, farK);   // no fine bands at grazing angles: far off it is one pale plain
        float occ = mix(0.84 + 0.2 * n2.x * midK + 0.14 * (n1.x - 0.5) + 0.18 * (n0.x - 0.5) + 0.24 * crest, 0.92 + 0.16 * (nb.x - 0.5), farK);
        vec3 v = normalize(vWp - cameraPosition);
        float fd = max(dot(v, uSunDir), 0.0), fw = fd * fd * fd; float fs = fd * fd; fs = fs * fs * fs;
        vec3 shadeC = mix(uShade, uLit * 0.6 + uSunCol * 0.22, 0.62 * fw);                  // towards the sun the light comes through the cloud: gold, not cobalt
        vec3 col = mix(shadeC, uLit, clamp(lit, 0.0, 1.0)) * occ;
        col += uSunCol * 0.22 * smoothstep(0.1, 0.5, nl) * (0.6 + 0.4 * n2.x);              // gold on what faces the low sun
        col += uSunCol * (fs * 0.42 + fw * 0.2) * (0.4 + 0.6 * lit);
        // beyond the anvil's edge: lower decks, and to the east the storm's own shadow lying across them
        float east = dot(rd, -uSunXZ);
        float edge = smoothstep(uEdge * 0.72, uEdge, r + 3200.0 * (n1.x - 0.5));
        vec3 low = mix(uHaze * 0.85, uShade * 0.5, smoothstep(0.1, 0.9, east));
        col = mix(col, low * (0.85 + 0.3 * n1.x), edge);
        float shadowK = smoothstep(0.62, 0.97, east + 0.08 * (n1.x - 0.5)) * smoothstep(900.0, 3800.0, r) * (1.0 - edge);
        col = mix(col, uShade * (0.35 + 0.5 * occ), 0.92 * shadowK);                   // in the storm's shadow the cloud is lit by the sky alone: cobalt
        vec2 dq = vQ - uTle.xy;
        col += uRed * uTle.z * exp(-dot(dq, dq) / 1.6e7) * (0.5 + 0.8 * n1.x);            // the sprites' glow on the cloud under them
        col = mix(col, uHaze * (1.0 + 0.5 * fw) + uSunCol * (fs * 0.3 + fw * 0.22), 1.0 - exp(-dist * dist / 3.2e8));   // the horizon melts into the sky over the last ten kilometres
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),n=new e.Mesh(f,b);return n.name="anvil",{mesh:n,uniforms:M,heightAt:G=>We*Math.exp(-G*G/(Me*Me))-G*G*32e-8}}function Io(t,i,v,g,h,c,z){const w=[];for(const u of h){const L=Math.round(6+u.h/(.22*u.w));for(let A=0;A<L;A++){const d=L>1?A/(L-1):0,l=t.range(0,Math.PI*2),T=Math.sqrt(t())*.32*u.w*(1-.5*d),D=.5*u.w*t.range(.75,1.15)*(1-.3*d),U=D*t.range(.25,.7)+(d>.6?D*.5:0);w.push([u.x+Math.cos(l)*T,u.surf+d*u.h+.25*D,u.z+Math.sin(l)*T,D,t(),t.range(5,10),U,t(),Math.cos(l)*.3*D,Math.sin(l)*.3*D,d])}}const f=w.length,P=11,M=new Float32Array(f*P),p=new Float32Array(f*P);w.forEach((u,L)=>M.set(u,L*P)),p.set(M);const b=new e.InstancedBufferGeometry;b.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),b.setIndex([0,1,2,0,2,3]);const n=new e.InstancedInterleavedBuffer(p,P);n.setUsage(e.DynamicDrawUsage),b.setAttribute("aA",new e.InterleavedBufferAttribute(n,4,0)),b.setAttribute("aB",new e.InterleavedBufferAttribute(n,4,4)),b.setAttribute("aC",new e.InterleavedBufferAttribute(n,3,8)),b.instanceCount=f,b.boundingSphere=new e.Sphere(new e.Vector3(c.x,z,c.z),1e5);const s={...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:v,uSunDir:{value:g.clone()},uLit:{value:S(i.anvilLit,.9)},uShade:{value:S(i.anvilShade,.9).lerp(S(i.anvilLit,.8),.38)},uSunCol:{value:S(i.lowSun,i.sunI)},uAxis:{value:new e.Vector2(c.x,c.z)},uSurf:{value:z},uDomeH:{value:We},uDomeR2:{value:Me*Me}},G=new e.ShaderMaterial({uniforms:s,fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec4 aA; attribute vec4 aB; attribute vec3 aC;
      uniform float uTime;
      varying vec2 vUv; varying vec3 vK; varying vec3 vWp; varying vec3 vR; varying vec3 vU; varying vec3 vB; varying vec3 vCl;
      #include <fog_pars_vertex>
      void main(){
        float t = fract(uTime / aB.y + aB.x);
        float f = smoothstep(0.0, 0.38, t) * (1.0 - smoothstep(0.5, 1.0, t));           // up quickly, subsiding slowly
        float s = aA.w * (0.78 + 0.3 * f);
        vec3 c = aA.xyz;
        c.y += aB.z * f - 0.25 * aA.w * (1.0 - f);
        c.xz += aC.xy * f + vec2(sin(uTime * 0.21 + aB.w * 40.0), cos(uTime * 0.17 + aB.w * 23.0)) * aA.w * 0.05;
        vR = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]); vU = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]); vB = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
        vWp = c + (vR * position.x + vU * position.y) * s;
        float d = distance(c, cameraPosition);
        vUv = position.xy; vK = vec3(aB.w, smoothstep(0.55 * s, 1.5 * s, d), s);
        vCl = normalize(vec3(aC.x / (0.3 * aA.w), 0.4 + aC.z, aC.y / (0.3 * aA.w)));              // which way this puff faces in its turret
        vec4 mvPosition = viewMatrix * vec4(vWp, 1.0); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:R.GLSL_HASH+R.GLSL_VALUE_NOISE+`
      uniform vec3 uSunDir, uLit, uShade, uSunCol; uniform vec2 uAxis; uniform float uTime, uSurf, uDomeH, uDomeR2;
      varying vec2 vUv; varying vec3 vK; varying vec3 vWp; varying vec3 vR; varying vec3 vU; varying vec3 vB; varying vec3 vCl;
      #include <fog_pars_fragment>
      void main(){
        vec2 q = vUv; float r = length(q);
        float n = vnoise(q * 1.7 + vK.x * 19.0 + vec2(0.0, -uTime * 0.06)) * 0.62 + vnoise(q * 4.3 + vK.x * 37.0 + vec2(uTime * 0.05, 0.0)) * 0.38;
        float body = 1.0 - r - 0.5 * (1.0 - n);                                             // a disc eaten away by noise
        float a = smoothstep(0.0, 0.34, body);
        vec3 nv = normalize(vec3(q * (0.8 + 0.6 * n), 0.35 + sqrt(max(1.0 - r * r, 0.0))));
        vec3 N = normalize(vR * nv.x + vU * nv.y + vB * nv.z + vCl * 0.9);                  // the turret is lit as one body
        float nl = dot(N, uSunDir);
        float lit = clamp(smoothstep(-0.6, 0.65, nl) * (0.75 + 0.4 * n), 0.0, 1.0);
        vec3 col = mix(uShade, uLit, lit) * mix(0.72, 1.0, smoothstep(-0.9, 0.2, q.y));    // lit by the low sun, darker toward its foot
        col += uSunCol * 0.2 * smoothstep(0.35, 0.9, nl);
        vec3 v = normalize(vWp - cameraPosition);
        float fs = max(dot(v, uSunDir), 0.0); fs *= fs; fs *= fs;
        col += uSunCol * fs * ((1.0 - smoothstep(0.0, 0.3, body)) * 0.6 + 0.28);              // against the sun: light through the body, a silver lining
        vec2 dq = vWp.xz - uAxis; float rr = dot(dq, dq);
        float surf = uSurf + uDomeH * exp(-rr / uDomeR2) - rr * 3.2e-7;
        a *= smoothstep(-0.05, 0.4, (vWp.y - surf) / vK.z);                                 // melts into the cloud it stands on
        gl_FragColor = vec4(col, a * vK.y);
        #include <fog_fragment>
      }`}),y=new e.Mesh(b,G);y.frustumCulled=!1,y.renderOrder=2.5,y.name="boiling-crown";const V=Array.from({length:f},(u,L)=>L),O=new Float32Array(f);let I=1e9,B=0,q=0;return{mesh:y,uniforms:s,update:u=>{const L=u.x-I,A=u.y-B,d=u.z-q;if(!(L*L+A*A+d*d<900)){I=u.x,B=u.y,q=u.z;for(let l=0;l<f;l++){const T=l*P,D=M[T]-u.x,U=M[T+1]-u.y,H=M[T+2]-u.z;O[l]=D*D+U*U+H*H}V.sort((l,T)=>O[T]-O[l]);for(let l=0;l<f;l++){const T=V[l]*P,D=l*P;for(let U=0;U<P;U++)p[D+U]=M[T+U]}n.needsUpdate=!0}},count:f}}function qo(t,i,v,g,h){const c=new e.Vector3().crossVectors(v,new e.Vector3(0,1,0)).normalize(),z=new e.Vector3().crossVectors(c,v).normalize(),w=2e3,f=new e.CircleGeometry(w*Math.tan(36*j),40),P={uTime:i,uSun:{value:v.clone()},uRight:{value:c},uUp:{value:z},uCol:{value:S(t.halo)},uAmt:{value:0},uDogs:{value:0},uPortal:{value:g.clone()},uPortalR:{value:h}},M=new e.ShaderMaterial({uniforms:P,transparent:!0,depthWrite:!1,depthTest:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:"varying vec3 vDir; void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vDir = wp.xyz - cameraPosition; gl_Position = projectionMatrix * viewMatrix * wp; }",fragmentShader:R.GLSL_HASH+R.GLSL_VALUE_NOISE+`
      uniform vec3 uSun, uRight, uUp, uCol, uPortal; uniform float uTime, uAmt, uDogs, uPortalR;
      varying vec3 vDir;
      float ringAt(float t){ return smoothstep(-1.5, 0.3, t) * exp(-max(t, 0.0) / 2.4); }
      void main(){
        vec3 d = normalize(vDir);
        float th = acos(clamp(dot(d, uSun), -1.0, 1.0)) * 57.2958;
        float xd = asin(clamp(dot(d, uRight), -1.0, 1.0)) * 57.2958, yd = asin(clamp(dot(d, uUp), -1.0, 1.0)) * 57.2958;
        vec3 ring = vec3(ringAt(th - 21.6), ringAt(th - 21.9), ringAt(th - 22.2)) * vec3(1.0, 0.94, 0.92);
        float dx = abs(xd) - 22.9;
        float dogCore = exp(-dx * dx / 1.5 - yd * yd / 6.0), dogTail = step(0.0, dx) * exp(-dx / 5.5) * exp(-yd * yd / 4.0) * (1.0 - smoothstep(5.0, 10.5, dx));
        vec3 dogs = dogCore * mix(vec3(1.3, 0.55, 0.3), vec3(1.0, 1.0, 0.95), smoothstep(-1.2, 0.6, dx)) * 1.5 + dogTail * vec3(0.55, 0.75, 1.0) * 0.6;
        float ya = 22.0 + 0.028 * xd * xd, ta = exp(-(yd - ya) * (yd - ya) / 1.3) * exp(-xd * xd / 150.0);
        float pil = exp(-xd * xd / 2.0) * (yd > 0.0 ? exp(-yd / 12.0) : 1.7 * exp(yd / 9.0));       // the pillar under the eclipsed sun marks the ring from afar
        float sh = 0.78 + 0.44 * vnoise(vec2(xd * 0.8 + uTime * 0.9, yd * 0.8 - uTime * 0.6));
        float ang = atan(yd, xd + 1e-4);
        float tw = 0.8 + 0.4 * vnoise(vec2(ang * 40.0, uTime * 1.5)) * vnoise(vec2(ang * 9.0 - uTime * 0.4, th * 0.7 + uTime * 0.8)) * 2.0;   // crystals tumbling: the arcs glitter along their length
        vec3 col = uCol * ((ring * 0.26 + dogs * 0.8 * uDogs) * tw + ta * 0.36 * uDogs * (0.7 + 0.6 * vnoise(vec2(xd * 0.5 - uTime * 1.1, 3.0))) + pil * (0.12 + 0.3 * uDogs)) * sh;
        col *= 1.0 - smoothstep(31.0, 35.0, th);                                              // nothing reaches the edge of the disc it is drawn on
        // the portal disc occludes it
        vec3 tp = uPortal - cameraPosition; float dp = max(length(tp), 0.01); tp /= dp;
        float along = dot(d, tp), off = length(cross(d, tp)) * dp / max(along, 1e-3);
        float mask = along > 0.0 ? smoothstep(uPortalR * 0.97, uPortalR * 1.12, off) : 1.0;
        gl_FragColor = vec4(col * uAmt * mask, 1.0);
      }`}),p=new e.Mesh(f,M);return p.renderOrder=12,p.frustumCulled=!1,p.name="ice-halo",{mesh:p,uniforms:P,update:n=>{p.position.copy(n).addScaledVector(v,w),p.lookAt(n)}}}function Ho(t,i,v,g,h,c,z){const w=new e.Vector3(-h.z,0,h.x),f=[],P=[],M=[],p=[],b=(O,I,B,q,k,u,L,A)=>{const d=g.clone().addScaledVector(h,O).addScaledVector(w,I),l=f.length/3,T=t();for(const[D,U]of[[0,0],[1,0],[1,1],[0,1]])f.push(d.x+w.x*(D-.5)*q,B+U*k,d.z+w.z*(D-.5)*q),P.push(D,U),M.push(u,T,L,A);p.push(l,l+1,l+2,l,l+2,l+3)},n=t.int(9,13);for(let O=0;O<n;O++)b(t.range(1e4,14500),t.range(-5200,5200),c+t.range(900,2400),t.range(1300,2300)*t.range(.6,1.5),t.range(2300,3900),0,t.range(5,8),t());b(t.range(7e3,9e3),t.range(-2600,2600),c-100,1500,t.range(2600,3600),1,t.range(5,7),t()),z&&b(9500,t.range(-900,900),c-150,7200,9e3,2,1,0);const s=new e.BufferGeometry;s.setAttribute("position",new e.Float32BufferAttribute(f,3)),s.setAttribute("uv",new e.Float32BufferAttribute(P,2)),s.setAttribute("aP",new e.Float32BufferAttribute(M,4)),s.setIndex(p),s.boundingSphere=new e.Sphere(g.clone(),6e4);const G={uTime:v,uRed:{value:S(we[6])},uGain:{value:i.spriteGain},uGiant:{value:0},uShow:{value:0}},y=new e.ShaderMaterial({uniforms:G,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:"attribute vec4 aP; varying vec2 vUv; varying vec4 vP; void main(){ vUv = uv; vP = aP; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:R.GLSL_HASH+R.GLSL_VALUE_NOISE+`
      uniform float uTime, uGain, uGiant, uShow; uniform vec3 uRed;
      varying vec2 vUv; varying vec4 vP;
      void main(){
        float x = vUv.x * 2.0 - 1.0, y = vUv.y, seed = vP.y * 37.0;
        float border = smoothstep(1.0, 0.8, abs(x)) * smoothstep(0.0, 0.04, y) * smoothstep(1.0, 0.9, y);
        float soft = smoothstep(1.0, 0.35, abs(x)) * smoothstep(0.0, 0.04, y) * smoothstep(1.0, 0.6, y);
        vec3 col = vec3(0.0);
        if (vP.x < 0.5) {
          // sprite: a diffuse red head over a skirt of tendrils, blooming and fading like a slow jellyfish
          float t = fract(uTime / vP.z + vP.w) * vP.z;
          float e = smoothstep(0.0, 0.4, t) * (1.0 - smoothstep(1.2, 3.8, t));
          // every one its own: where the head sits, how wide it is, how far its tendrils reach, an outline bent by noise
          float s1 = fract(seed * 0.173), s2 = fract(seed * 0.411), s3 = fract(seed * 0.737);
          float xw = x + 0.2 * (vnoise(vec2(y * 3.0 + seed, seed)) - 0.5) + 0.07 * sin(y * 7.0 + seed);
          float hy = 0.62 + 0.12 * s1, low = 0.03 + 0.3 * s2;
          float head = exp(-(xw * xw / (0.12 + 0.16 * s2) + (y - hy) * (y - hy) / (0.012 + 0.02 * s3)));
          float fil = vnoise(vec2(xw * (5.0 + 5.0 * s3) + seed, y * 1.3 + seed)); fil = fil * fil * fil * 3.0;
          float beads = 0.6 + 0.6 * vnoise(vec2(xw * 7.0 + seed, y * 22.0 - uTime * 0.6));
          float skirt = fil * beads * smoothstep(low, low + 0.4, y) * (1.0 - smoothstep(hy - 0.12, hy + 0.04, y)) * exp(-xw * xw / (0.2 + 0.25 * s1));
          float hair = exp(-xw * xw / 0.16) * smoothstep(hy, hy + 0.08, y) * (1.0 - smoothstep(hy + 0.08, 0.98, y)) * 0.35;
          vec3 c = mix(vec3(0.45, 0.3, 1.1), uRed * 1.5, smoothstep(0.15, hy - 0.1, y));
          col = c * (head * 1.3 + skirt * 1.2 + hair) * e * uGain * soft / max(border, 1e-3);
        } else if (vP.x < 1.5) {
          // blue jet: a narrow cone leaping from the anvil's flank
          float t = fract(uTime / vP.z + vP.w) * vP.z;
          float e = smoothstep(0.0, 0.45, t) * (1.0 - smoothstep(0.9, 2.8, t));
          float w = 0.05 + 0.4 * y * y, xs = x / w;
          float fil = 0.4 + 1.3 * vnoise(vec2(xs * 2.5 + seed, y * 5.0 - uTime * 0.8));
          float tip = 1.0 - smoothstep(0.25 + 0.75 * smoothstep(0.0, 0.6, t), 1.0, y);
          col = mix(vec3(0.25, 0.5, 1.6), vec3(0.6, 0.4, 1.3), y) * exp(-xs * xs * 1.4) * fil * tip * e * (0.95 + 0.6 * uGain);
        } else {
          // gigantic jet: blue at its root, branching, red at its crown at the edge of space
          float w = 0.012 + 0.66 * pow(max(y, 0.0), 1.45), xs = x / w;
          float f1 = vnoise(vec2(xs * 3.2 + seed, y * 5.0)), f2 = vnoise(vec2(xs * 9.0 - seed, y * 13.0 - uTime * 0.25));
          float fil = pow(f1, 3.0) * 3.2 + pow(f2, 4.0) * 2.0 * smoothstep(0.3, 0.7, y);
          float body = exp(-xs * xs * 1.3) * (0.2 + 0.95 * fil) * (1.0 - smoothstep(0.86, 0.99, y));
          float trunk = exp(-x * x / 0.00012) * (1.0 - smoothstep(0.0, 0.4, y)) * 1.6;
          float crown = exp(-x * x / 0.3) * exp(-(y - 0.86) * (y - 0.86) / 0.012) * 0.5;
          vec3 c = mix(vec3(0.3, 0.55, 1.7), uRed * 1.5, smoothstep(0.38, 0.78, y));
          float climb = 1.0 - smoothstep(uGiant * 1.25 - 0.25, uGiant * 1.25, y);
          col = (c * (body + crown) + vec3(0.7, 0.8, 1.6) * trunk) * climb * (0.86 + 0.14 * sin(uTime * 2.1 + y * 9.0)) * (0.8 + 0.3 * uGain) * min(uGiant * 3.0, 1.0);
        }
        gl_FragColor = vec4(col * border * uShow, 1.0);
      }`}),V=new e.Mesh(s,y);return V.renderOrder=6,V.frustumCulled=!1,V.name="sprites-and-jets",{mesh:V,uniforms:G}}const No=`varying vec3 vN; varying vec3 vV;
  #include <fog_pars_vertex>
  void main(){ vN = normalize(mat3(modelMatrix) * normal); vec4 wp = modelMatrix * vec4(position, 1.0); vV = cameraPosition - wp.xyz;
    vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,jo=`uniform vec3 uLow, uHigh, uRim; varying vec3 vN; varying vec3 vV;
  #include <fog_pars_fragment>
  void main(){ vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
    float f = 1.0 - abs(dot(n, normalize(vV + vec3(1e-4))));
    vec3 col = mix(uLow, uHigh, n.y * 0.5 + 0.5) + uRim * f * f * f;
    gl_FragColor = vec4(col, 1.0);
    #include <fog_fragment>
  }`,ut=(t,i,v)=>new e.ShaderMaterial({uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uLow:{value:S(t)},uHigh:{value:S(i)},uRim:{value:S(v)}},fog:!0,side:e.DoubleSide,vertexShader:No,fragmentShader:jo});function dt(t,i,v){const g=[],h=[],c=[],z=t.length;for(const f of[new e.Vector3(0,1,0),new e.Vector3(1,0,0)]){const P=g.length/3;for(let M=0;M<z;M++){const p=M/(z-1),b=i+(v-i)*p,n=t[M];if(g.push(n.x-f.x*b,n.y-f.y*b,n.z,n.x+f.x*b,n.y+f.y*b,n.z),h.push(p,0,p,1),M<z-1){const s=P+M*2;c.push(s,s+1,s+2,s+1,s+3,s+2)}}}const w=new e.BufferGeometry;return w.setAttribute("position",new e.Float32BufferAttribute(g,3)),w.setAttribute("uv",new e.Float32BufferAttribute(h,2)),w.setIndex(c),w}const ft=R.GLSL_HASH+R.GLSL_VALUE_NOISE+`uniform vec3 uCol; uniform float uTime, uGain; varying vec2 vUv; varying float vKind;
  #include <fog_pars_fragment>
  void main(){
    vec3 col;
    if (vKind > 0.5) {                                             // propeller disc fringed with St Elmo's fire
      vec2 q = vUv * 2.0 - 1.0; float r = length(q), a = atan(q.y, q.x);
      float fr = smoothstep(0.55, 0.95, r) * (1.0 - smoothstep(0.95, 1.0, r)) * (0.5 + 0.9 * vnoise(vec2(a * 5.0 + uTime * 9.0, uTime * 3.0)));
      col = vec3(0.55, 0.35, 1.5) * (fr * 2.6 + 0.12 * (1.0 - r));
    } else {                                                       // vapour, sliding back along the spiral
      float e = sin(3.14159 * vUv.y), puff = 0.45 + 0.75 * vnoise(vec2(vUv.x * 46.0 - uTime * 1.6, vUv.y * 2.0));
      col = uCol * e * puff * smoothstep(0.0, 0.03, vUv.x) * (1.0 - vUv.x) * (1.0 - vUv.x) * uGain;
    }
    gl_FragColor = vec4(col, 1.0);
    #ifdef USE_FOG
      gl_FragColor.rgb *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);   // additive: fade to nothing, not to the fog colour
    #endif
  }`,vt=`attribute float aKind; varying vec2 vUv; varying float vKind;
  #include <fog_pars_vertex>
  void main(){ vUv = uv; vKind = aKind; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Ke=(t,i)=>(t.setAttribute("aKind",new e.Float32BufferAttribute(new Float32Array(t.attributes.position.count).fill(i),1)),t),ye=t=>{const i=t.index?t.toNonIndexed():t;for(const v of Object.keys(i.attributes))["position","normal","uv","aKind"].includes(v)||i.deleteAttribute(v);return i},Qt=t=>{const i=ye(t);return i.attributes.normal&&i.deleteAttribute("normal"),i};function Fo(t,i){const v=new e.Group;v.name="research-aircraft";const g=[],h=(p,b,n,s,G=0,y=0)=>{p.rotateX(G),p.rotateZ(y),p.translate(b,n,s),g.push(ye(p))};h(new e.CylinderGeometry(.85,.6,11,10),0,0,.5,Math.PI/2),h(new e.ConeGeometry(.85,2.6,10),0,0,-6.3,-Math.PI/2),h(new e.ConeGeometry(.6,3.2,10),0,.25,7.5,Math.PI/2),h(new e.BoxGeometry(18,.22,2),0,.55,-.6),h(new e.BoxGeometry(6.4,.14,1.2),0,.5,7.6),h(new e.BoxGeometry(.16,2.4,1.6),0,1.6,7.7);for(const p of[-1,1])h(new e.CylinderGeometry(.5,.4,3.2,8),p*3.1,.3,-1.3,Math.PI/2),h(new e.CylinderGeometry(.09,.09,1.4,5),p*.9,-1.2,-1.5);const c=new e.Mesh(Fe(g),ut("#0a1216","#7d98a0","#9fe0d0"));for(const p of g)p.dispose();v.add(c);const z=[];for(const p of[-1,1])z.push(Ke(Qt(new e.CircleGeometry(1.5,20).translate(p*3.1,.3,-3)),1));for(const p of[-1,1]){const b=[];for(let n=0;n<=60;n++){const s=n*5.5,G=s*.085+p,y=.4+s*.02;b.push(new e.Vector3(p*8.8+Math.cos(G)*y*p,.5+Math.sin(G)*y+.0019*s*s,s))}z.push(Ke(Qt(dt(b,.5,5.5)),0))}const w={...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:i,uCol:{value:S("#9fe0d0",.42)},uGain:{value:1}},f=new e.Mesh(Fe(z),new e.ShaderMaterial({uniforms:w,fog:!0,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:vt,fragmentShader:ft}));for(const p of z)p.dispose();f.renderOrder=3,f.frustumCulled=!1,v.add(f);const P=R.makeGlows({rng:t,time:i,positions:[[-9,.6,-.6],[9,.6,-.6],[0,2.9,7.7]],colors:["#ff5a4a","#7dffb0","#ffffff"],size:5,intensity:2.6,fogAmount:.35,halo:1.2});return v.add(P.object),v.scale.setScalar(1.7),{object:v,update:(p,b)=>{v.rotation.set(0,Math.atan2(-b.x,-b.z),.12*Math.sin(p*.5),"YXZ");for(let n=0;n<3;n++){const s=.5+.5*Math.sin(p*2.4+n*2.1);P.setSize(n,.35+1.1*s*s)}},strobes:P}}function Wo(t,i){const v=new e.Group;v.name="weather-balloon";const g=new e.Mesh(ye(new e.SphereGeometry(8,24,16).scale(1,1.12,1)),ut("#3c4a58","#e9efe8","#9fe0d0")),h=ye(new e.ConeGeometry(1.6,3,10).translate(0,-9.6,0)),c=ye(new e.BoxGeometry(2.2,2.6,2.2).translate(0,-62,0)),z=ye(new e.BoxGeometry(5.5,.12,.8).translate(0,-60.4,0)),w=new e.Mesh(Fe([h,c,z]),ut("#0c1216","#aab6b8","#9fe0d0"));h.dispose(),c.dispose(),z.dispose();const f=[];for(let s=0;s<=12;s++)f.push(new e.Vector3(0,0,s*4.25));const P=Ke(dt(f,.22,.22),0).rotateX(Math.PI/2).translate(0,-10,0),M={...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:i,uCol:{value:S("#cfe6e0",.9)},uGain:{value:4}},p=new e.Mesh(P,new e.ShaderMaterial({uniforms:M,fog:!0,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:vt,fragmentShader:ft}));p.frustumCulled=!1;const b=R.makeGlows({rng:t,time:i,positions:[[0,-63.6,0],[0,9.4,0]],colors:["#ff5a4a","#bfffe6"],size:6,intensity:2.6,fogAmount:.35});return v.add(g,w,p,b.object),v.scale.setScalar(1.5),{object:v,update:s=>{v.rotation.set(.1*Math.sin(s*.7),s*.15,.13*Math.sin(s*.53+1));const G=.5+.5*Math.sin(s*2);b.setSize(0,.35+1.1*G*G),b.setSize(1,.5+.3*Math.sin(s*1.3))},strobes:b}}function Ko(t,i,v){const g=new e.Group;g.name="airliner";const h=[];for(let f=0;f<=24;f++)h.push(new e.Vector3(0,0,f*190));const c={...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:i,uCol:{value:S(v.anvilLit,1.5)},uGain:{value:1}},z=new e.Mesh(Ke(dt(h,22,120),0),new e.ShaderMaterial({uniforms:c,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:vt,fragmentShader:ft,fog:!0}));z.frustumCulled=!1,z.renderOrder=3;const w=R.makeGlows({rng:t,time:i,positions:[[0,0,-30]],colors:["#fff6e0"],size:130,intensity:3,fogAmount:0});return g.add(z,w.object),{object:g,light:w}}function Yo(){const t=new e.MeshBasicMaterial({color:16777215,transparent:!0,opacity:0,depthWrite:!1,side:e.BackSide,fog:!1}),i=new e.Mesh(new e.SphereGeometry(1,16,10),t);return i.renderOrder=-.5,i.frustumCulled=!1,i.name="cloud-shell",{mesh:i,mat:t}}var a0={id:"hail-cathedral",name:"The Hail Cathedral",category:"sky",weirdness:.2,media:["air"],async build(t){const{rng:i,core:v}=t,{clamp:g,lerp:h,smoothstep:c}=v,z=t.vary||{hour:"any",rare:!1,density:1,mood:.5},w=t.quality?.detail??1,f=g(z.density??1,.7,1.3),P=44,M=i.fork("visit180"),p=M.pick(["afternoon","dawn","night"]),b=z.hour==="dawn"?"dawn":z.hour==="night"?"night":z.hour==="day"||z.hour==="golden"?"afternoon":p,n=ct[b],s=b==="night",G=M.pick(["ripe","spring","stubble","dry"]),y=Vo[G],V=M.pick(["bison","antelope","horse"]),O=M.pick(["swifts","hawks"]),I=M.pick(["aircraft","balloon"]),B=i()<.5?-1:1,q=!!z.rare,k=new e.Scene;k.background=new e.Color(0);const u={value:0},L=Ro(B),A=L.path,{uIn:d,uOut:l,axis:T,uRun:D}=L,U=l-d,H=A.pointAt(l),Xt=new e.Vector3,Ye=Math.atan2(L.endDir.x,-L.endDir.z)/j,Ze=4,X=Yt(Ze,Ye).clone(),F=new e.Vector3(-X.x,0,-X.z).normalize(),Ae=new e.Vector3(-F.z,0,F.x);Ae.z<0&&Ae.negate();const Qe=Yt(8,-22).clone();k.fog=new e.FogExp2(n.haze,.0016);const Ce=new e.HemisphereLight(n.amb1,"#2a251a",2.2),se=new e.DirectionalLight(n.slit,2.8*n.sunI);se.position.copy(Qe).multiplyScalar(100),k.add(Ce,se,se.target);const $t=[{sky:new e.Color(n.amb1),ground:new e.Color(s?"#141c2c":"#2a251a"),hi:s?5:2.2,key:new e.Color(n.slit),ki:s?3.6:2.8*n.sunI,dir:Qe},{sky:new e.Color("#2f7a74"),ground:new e.Color(we[1]),hi:2.2,key:new e.Color(we[3]),ki:.9,dir:new e.Vector3(.2,1,.1).normalize()},{sky:new e.Color(n.anvilHaze),ground:new e.Color(n.anvilLit).multiplyScalar(.6),hi:s?1.4:2,key:new e.Color(n.lowSun),ki:3.2*n.sunI,dir:X}];let mt=-1;const Jt=o=>{if(o===mt)return;mt=o;const a=$t[o];Ce.color.copy(a.sky),Ce.groundColor.copy(a.ground),Ce.intensity=a.hi,se.color.copy(a.key),se.intensity=a.ki,se.position.copy(a.dir).multiplyScalar(100)},te=new e.Group;te.name="act-one",k.add(te);const Ge=-58;await t.yield();const le=_o(n,y,u);k.add(le.mesh);const $=Eo(u,s);k.add($.mesh),te.add(Bo(y,u,Ge));const ce=R.fxGroup(),Pe=R.fxGroup(),Te=R.fxGroup();te.add(ce.object),k.add(Pe.object,Te.object);const pt=ke.makeWind({direction:[.12*B,-1],strength:3.2,speed:1.9,gustiness:.85,gustScale:.03}),ht={wind:pt,backlight:.8,backlightTint:n.slit};await t.yield(),await ke.prepareLeafTexture(ht,t.yield);const gt=ke.windMaterial(ht);await t.yield();const wt=await ke.makeGrassAsync({rng:i.fork("wheat"),bounds:[B>0?-30:-46,-150,B>0?46:30,10],count:Math.round(4e4*w*g(f,.85,1.15)),wind:pt,map:gt.map,root:y.root,tip:y.tip,dryAmount:0,density:(o,a)=>Math.abs(a-Ge)<4.6?0:1,height:y.tall,width:[1.3,2.2],flowers:0,fade:[105,150],tint:.16,materialOptions:{backlight:s?1.4:.9,backlightTint:n.slit,sheen:.8}},t.yield);te.add(wt.object),await t.yield();{const o=i.fork("trees"),a=[];for(let x=0;x<3;x++)a.push(ke.oakGeometry({rng:o,height:o.range(15,21),detail:1,flex:4,fullness:.9,leaf:s?"#22352a":"#3d5a34",leafLight:"#7f9a56",bark:"#3a332c"})),await t.yield();const m=[];for(let x=0;x<12;x++){const C=a[x%3].clone(),_=o.range(.85,1.2);C.rotateY(o.range(0,6.28)),C.scale(_*.75,_*1.3*o.range(.95,1.15),_*.75),C.rotateX(-o.range(8,12)*j),C.rotateZ(-B*o.range(0,3)*j),C.translate(-B*(62+x*14.5+o.range(-3,3)),0,-236-x*5.5+o.range(-4,4)),m.push(C),await t.yield()}const r=new e.Mesh(Fe(m),gt);r.name="shelterbelt";for(const x of m)x.dispose();for(const x of a)x.dispose();te.add(r)}const eo=ge.quadrupedGeometry({...ge.HERD_PRESETS[V]});await t.yield();const yt=[[-B*128,2.6,-252]];for(let o=0;o<8;o++)yt.push([0,.9,Ge]);const De=ce.add(R.makeGlows({rng:i,time:u,positions:yt,colors:["#ffc060","#f2f5ff","#f2f5ff","#ff2a18","#ff2a18","#f2f5ff","#f2f5ff","#ff2a18","#ff2a18"],size:4.2,intensity:s?4.5:2.6,flicker:.12,rays:.25,fogAmount:.45})),Le=i()<.5?-1:1,to=i.range(46,80),oo=i.range(0,200),xt=o=>{for(let a=0;a<2;a++){const m=((o*19+oo-a*to)%560+560)%560-280,r=m*Le,x=c(280,215,Math.abs(m));for(let C=0;C<2;C++){const _=Ge+(C?.8:-.8)+Le*1.4;De.setPosition(1+a*4+C,r+Le*2.3,.85,_),De.setSize(1+a*4+C,x*.55),De.setPosition(3+a*4+C,r-Le*2.3,.95,_),De.setSize(3+a*4+C,x*.3)}}};xt(0),await t.yield();const Ve={sunDir:Qe,sunColor:n.slit,sunIntensity:s?3.4:3.5*n.sunI,sky:n.gloom,skyIntensity:s?.6:.4,ground:"#17130c",groundIntensity:.25},Xe=ge.makeFauna(k,{light:Ve});await t.yield();const ao=Kt([[0,0,0],[0,0,-200],[0,0,-400]]),bt=104,no=Math.round(f*(V==="bison"?96:V==="antelope"?76:46)),Zo=Xe.add(ge.makeHerd({rng:i.fork("herd"),species:V,geometry:eo,count:no,mode:"migrate",gait:"run",y:0,light:Ve,fill:.12,size:V==="bison"?1.6:1.75,rim:1.6,cross:{path:ao,u:.03,lead:bt-.03*400,offset:-76,angle:90,side:-1,span:640,height:0,window:.34,bow:0},spread:[24,104]}));await t.yield();const $e=A.pointAt(L.uAtY(72)),Qo=Xe.add(O==="swifts"?ge.makeFlock({rng:i.fork("birds"),species:"swifts",count:Math.round(80*f),size:2,light:Ve,spread:[46,26,70],cross:{path:A,u:L.uAtY(60),lead:24,angle:70,side:B,height:4,span:340,duration:P}}):ge.makeFlock({rng:i.fork("birds"),species:"eagles",count:Math.round(11*f),size:2.4,light:Ve,center:[$e.x-B*46,$e.y+6,$e.z-30],radius:26,soarRadius:30,soarLift:16}));await t.yield();const Xo=ce.add(R.makeParticles({rng:i.fork("dust"),preset:"dust",time:u,follow:!1,center:[-40,5,-bt-6],box:[560,12,64],count:Math.round(900*(.5+y.dust)*w),size:[1.6,5.5],colors:s?["#3a4c80","#2a3658","#5a6890"]:[n.slit,n.haze,"#c8a878"],intensity:s?.25:.55,opacity:.12+.1*y.dust,additive:.35,velocity:[-2.5,.8,-6],velocityRandom:[2,.6,2],turbulence:[3,1,3],twinkle:0,near:[4,14]})),io=ce.add(R.makeParticles({rng:i.fork("chaff"),preset:"leaves",time:u,count:Math.round(900*y.chaff*w),box:[46,30,46],velocity:[.6*B,10,-11],velocityRandom:[3,4,3],turbulence:[2.4,1.6,2],size:[.09,.26],aspect:.35,spin:5,colors:[y.tip,y.root,y.root],intensity:.5}));await t.yield();const St=ce.add(R.makeParticles({rng:i.fork("rain"),preset:"rain",time:u,count:Math.round(5200*w),velocity:[1.5*B,-22,-5],colors:["#8fa6a8","#c9d8d6","#7f96a0"]}));St.setOpacity(0),await t.yield();const E=await Lo(t,{palette:we,scrollSpeed:55});k.add(E.object);const zt=n.wallGain*(G==="dry"?1.12:1);E.uniforms.uWallGain.value=zt;const xe=E.object.getObjectByName("oculus").material.uniforms;{const o=E.uniforms,a=xe;if(o.uStri.value=y.stri,b==="dawn"?(o.uCream.value.copy(S("#ffb894")),a.uIn.value.copy(S("#ffb08a",2.5)),a.uOut.value.copy(S("#e08a8a",.62)),o.uPurple.value.copy(S("#472a52")),o.uAmbHi.value.lerp(S("#ffb49c",.75),.4),o.uAmbLo.value.lerp(S("#5a2c50",.7),.4),o.uTopAt.value=.5):s||(o.uCream.value.copy(S("#ffdcae",.85)),a.uOut.value.copy(S("#ffdcae",.5))),s){o.uCream.value.copy(S("#6f8fe0",.42)),a.uIn.value.copy(S("#b4c8ff",1.5)),a.uOut.value.copy(S("#6f8fe0",.26)),o.uPurple.value.copy(S("#15173a")),o.uAmbHi.value.multiplyScalar(.72).lerp(S("#5a78c8",.6),.35),o.uAmbLo.value.multiplyScalar(.6),o.uRim.value.multiplyScalar(.75);for(const m of o.uHeadCol.value)m.multiplyScalar(1.7)}}const ro=E.object.children.filter(o=>["vault-wall","vault-veil","oculus","murk-floor"].includes(o.name)),so=E.object.getObjectByName("vault-veil"),lo=xe.uIn.value.clone(),co=xe.uOut.value.clone(),kt=s?.2:.5;await t.yield();const Mt=i.range(0,Math.PI*2),At=new e.Vector3(Math.cos(Mt),0,Math.sin(Mt)),Ct=o=>h(70,2760,g((o-d)/U,0,1.04)),uo=o=>{const a=Math.sin(Math.PI*g(((o-d)/U-.1)/.8,0,1));return 500*a*a},ue=d+.42*U,Je=d+.8*U;E.setFocus(Ct(ue+.42*(Je-ue)));const Gt=Pe.add(R.makeParticles({rng:i.fork("drops"),preset:"rain",time:u,count:Math.round(1700*w*y.drops),box:[44,44,44],velocity:[0,34,0],velocityRandom:[1.2,9,1.2],size:[.016,.034],stretch:.035,colors:[we[3],"#e8fff8","#8fb8d8"],intensity:1.1,opacity:.32,additive:.85}));Gt.setOpacity(0);const Re=I==="aircraft"?Fo(i.fork("plane"),u):Wo(i.fork("balloon"),u);k.add(Re.object);const oe=d+.26*U,Ue=d+.5*U,et=oe+.4*(Ue-oe),Pt=A.pointAt(et),_e=A.pointAt(et+.004).sub(A.pointAt(et-.004)).setY(0).normalize(),tt=new e.Vector3(-_e.z,0,_e.x).multiplyScalar(i()<.5?-1:1),fo=new e.Vector3,Tt=(o,a)=>{const m=(o-oe)/(Ue-oe),r=A.pointAt(g(o,0,1),Xt).y;return I==="aircraft"?a.copy(Pt).addScaledVector(_e,330).addScaledVector(tt,(m-.4)*640).setY(r+h(330,150,m)):a.copy(Pt).addScaledVector(_e,170).addScaledVector(tt,(m-.4)*70).setY(r+h(190,30,m)),a},J=H.y-We-30,ee=Oo(n,u,X,34e3);ee.mesh.position.set(T.x,J,T.z),await t.yield();const K=new e.Group;K.name="act-three",k.add(K);const vo=s?{...n.sky,bodyOverrides:{0:{elevation:Ze,azimuth:Ye,size:1.1,phase:1,glow:1}}}:{...n.sky,sunElevation:Ze,sunAzimuth:Ye,sunSize:1,sunIntensity:12},de=To({rng:i,clouds:!1,clouds2:!1,bake:!0,renderer:t.renderer,cloudLit:n.anvilLit,cloudShade:n.anvilShade,cloudLightColor:n.lowSun,...vo});k.add(de.object),await t.yield(),K.add(ee.mesh),await t.yield();const fe=[],Y=i.fork("crown");for(let o=0;o<60&&fe.length<11;o++){const a=Y.range(0,Math.PI*2),m=Y.range(640,1500),r=Y.range(170,320)*(.75+m/1700),x=T.x+Math.cos(a)*m,C=T.z+Math.sin(a)*m,_=J+ee.heightAt(m)-r*.2;A.distanceTo(x,_+r*.4,C)<r*.85+30||fe.push([x,_,C,r])}for(let o=0;o<40&&fe.length<22;o++){const a=Y.range(0,Math.PI*2),m=Y.range(2e3,4200),r=Y.range(380,620),x=T.x+Math.cos(a)*m,C=T.z+Math.sin(a)*m,_=x-H.x,Z=C-H.z,re=Math.hypot(_,Z);(_*X.x+Z*X.z)/re>.955||fe.push([x,J+ee.heightAt(m)-r*.3,C,r])}{const o=new e.Vector3(-L.endDir.z,0,L.endDir.x),a=Y()<.5?-1:1;[.28,.55,.8].forEach((m,r)=>{const x=A.pointAt(D+(1-D)*m),C=Y.range(170,210),_=(r%2?-a:a)*(.5*C+Y.range(18,26));fe.push([x.x+o.x*_,x.y+30-1.15*C,x.z+o.z*_,C])})}const Dt=[];for(let o=0;o<16;o++){const a=A.pointAt(D-.02+(1.02-D)*(o/15));Dt.push([a.x,a.y,a.z,13])}await t.yield();const Lt=Do({rng:i,sky:de,at:fe,avoid:Dt,height:.8,puffs:40,altitudeJitter:0,wind:[.5*F.x,0,.5*F.z],silver:2.2,bump:1.1});K.add(Lt.object),await t.yield();const ot=[],be=i.fork("boil"),mo=(o,a)=>J+ee.heightAt(Math.hypot(o-T.x,a-T.z)),po=(o,a,m,r,x)=>[.3,.7,1.1].every(C=>A.distanceTo(o,x+r*C,a)>.75*m+40);for(let o=0,a=Math.round(30*(.5+.5*w));o<240&&ot.length<a;o++){const m=be.range(0,Math.PI*2),r=be.range(130,580),x=be.range(60,130),C=x*be.range(.3,.85),_=T.x+Math.cos(m)*r,Z=T.z+Math.sin(m)*r,re=mo(_,Z);po(_,Z,x,C,re)&&ot.push({x:_,z:Z,w:x,h:C,surf:re})}await t.yield();const Vt=Io(be,n,u,X,ot,T,J);K.add(Vt.mesh),await t.yield();const Ee=qo(n,u,X,A.end,7);K.add(Ee.mesh),await t.yield();const Be=Ho(i.fork("tle"),n,u,H,F,J,q);K.add(Be.mesh);const Se=Ko(i.fork("liner"),u,n);K.add(Se.object);const at=F.clone().multiplyScalar(-1),Rt=H.clone().addScaledVector(Ae,7400).addScaledVector(F,-9e3).setY(H.y+1150);Se.object.rotation.y=Math.atan2(-at.x,-at.z),Se.object.position.copy(Rt);const Ut=Te.add(R.makeParticles({rng:i.fork("glitter"),preset:"magic",time:u,count:Math.round(4200*w),box:[58,40,58],velocity:[2.2*F.x,-1.2,2.2*F.z],velocityRandom:[1.2,.8,1.2],turbulence:[.8,.5,.8],size:[.07,.21],colors:["#ffffff",n.halo,"#bfe6ff"],intensity:2.2,twinkle:.95}));Ut.setOpacity(0),await t.yield();const ve=Yo();k.add(ve.mesh);const ho=H.clone().addScaledVector(F,11e3).setY(H.y+(q?2700:1050)),go=H.clone().addScaledVector(Ae,3600).addScaledVector(F,-5200).setY(J+260),_t=H.clone().addScaledVector(F,12200).sub(ee.mesh.position);ee.uniforms.uTle.value.set(_t.x,_t.z,0);const W=(o,a=1)=>new e.Color(o).multiplyScalar(a),Et=.015,ae=L.uAtY(14),me=y.nave,nt=W(s?"#1c3432":"#2f4f47"),Oe=W(n.plum,s?.8:1),Ie=W(n.pearl,n.cream),qe=W(n.creamCol,n.cream),Bt=W(n.anvilHaze,.6),Ot=W("#235e5a",s?.8:1),He=[[0,.0016,W(n.haze)],[ae,.0017,W(n.haze)],[d-.03,.005,nt.clone().lerp(W(n.haze),.3)],[d-.006,Et,nt],[d+.003,Et,nt.clone().lerp(Ot,.4)],[d+.018,.0013*me,Ot],[d+.04,9e-4*me,W("#2b5a66").lerp(Oe,.4)],[d+.26*U,.001*me,Oe],[d+.45*U,7e-4*me,Oe.clone().lerp(W("#2a5a66"),.35)],[d+.66*U,8e-4*me,Oe.clone().lerp(Ie,.45)],[d+.86*U,5e-4*me,Ie],[l-.02,.0012,Ie.clone().lerp(qe,.4)],[l-.006,.0016,Ie.clone().lerp(qe,.6)],[l-.001,.03,qe.clone().multiplyScalar(.46)],[l+5e-4,.03,qe.clone().multiplyScalar(.46)],[l+.016,24e-6,Bt],[1.01,24e-6,Bt]],pe=k.fog.color,wo=o=>{let a=0;for(;a<He.length-2&&o>=He[a+1][0];)a++;const m=He[a],r=He[a+1],x=c(0,1,g((o-m[0])/Math.max(1e-6,r[0]-m[0]),0,1));k.fog.density=Math.exp(h(Math.log(m[1]),Math.log(r[1]),x)),pe.lerpColors(m[2],r[2],x)},It=new e.Vector3,ne=new e.Vector3,he=new e.Vector3,yo=$.uniforms.uWisp.value.clone(),xo=$.uniforms.uBolt.value.clone(),bo=S(n.creamCol,.42*Math.max(n.cream,.6)),So=S(n.lowSun,1.15*Math.max(n.sunI,.75)),zo=E.uniforms.uHeadCol.value.map(o=>o.clone()),ko=E.uniforms.uAmbLo.value.clone(),Mo=E.uniforms.uAmbHi.value.clone(),it=new e.Vector3,Ao=E.uniforms.uRim.value.clone(),Co=new e.Vector3,rt=new e.Vector3,ie=new e.Vector3;function Go(o,a,m,r){u.value=a,m.getWorldPosition(ne);const x=(r-d)/U,C=r<d?0:r<l?1:2;Jt(C),wo(r);const _=C===0;if(te.visible=_,le.mesh.visible=_,_){le.mesh.position.copy(ne),le.uniforms.uCam.value.copy(ne),le.uniforms.uFogCol.value.copy(pe),le.uniforms.uMurk.value=c(d-.045,d-.004,r);const N=1-c(d-.02,d-.002,r);xt(a),wt.update(o,a,m),io.setOpacity((.4+.6*c(ae*.4,ae,r))*N),St.setOpacity(Math.min(1,y.rain)*c(ae,d*.8,r)*N),ce.update(o,a,m)}Xe.update(o,a,m,r,_);const Z=c(d-.05,d-.012,r)*(1-c(d+.02,d+.07,r)),re=c(l-.055,l-.02,r)*(1-c(l+.001,l+.012,r)),lt=Math.max(Z,re);if($.mesh.visible=lt>.003,$.uniforms.uAmt.value=lt,lt>.003){const N=re>Z,Q=$.uniforms;Q.uWisp.value.copy(N?bo:yo),Q.uBolt.value.copy(N?he:xo),Q.uSun.value.copy(N?So:he),m.getWorldDirection(it),Q.uGaze.value.copy(it).lerp(he.set(0,1,0),.25).normalize(),he.set(0,0,0),Q.uSunDir.value.copy(it).multiplyScalar(.45).add(he.set(0,1,0)).normalize(),he.set(0,0,0),Q.uSurge.value=N?0:c(d-.03,d+.004,r)*(1-c(d+.012,d+.05,r))*(.8+.2*Math.sin(a*1.3)),$.mesh.position.copy(ne),$.mesh.scale.setScalar(m.far*.5)}const qt=C===1,Ht=r>d-.03&&r<l+.02;E.object.visible=Ht;for(const N of ro)N.visible=qt&&(N!==so||y.veil);if(Ht){A.pointAt(r,It);const N=uo(r);E.object.position.set(T.x-At.x*N,It.y-Ct(r),T.z-At.z*N),E.setProgress(g((r-ue)/(Je-ue),0,1)),E.setGrowth(.2+.8*g(x/.82,0,1)),E.setFall(c(.9,1,x)),E.uniforms.uRim.value.copy(Ao).multiplyScalar(h(2.4,1,c(0,.14,x)));const Q=(x-.11)/.085,Po=1+1.05*Math.exp(-Q*Q);for(let je=2;je<5;je++)E.uniforms.uHeadCol.value[je].copy(zo[je]).multiplyScalar(Po);const Ne=c(.62,.86,x);E.uniforms.uAmbLo.value.copy(ko).multiplyScalar(1-.34*Ne),E.uniforms.uAmbHi.value.copy(Mo).multiplyScalar(1-.16*Ne),xe.uIn.value.copy(lo).multiplyScalar(h(1,.3,c(.58,.9,x))),E.uniforms.uWallGain.value=zt*h(1.9,1,c(0,.22,x))*(1-kt*Ne),xe.uOut.value.copy(co).multiplyScalar(1-kt*Ne),E.uniforms.uBack.value.set(pe.r,pe.g,pe.b),E.update(o,a,m)}const Nt=r>d-.03&&r<l+.02;Pe.object.visible=Nt,Nt&&(Gt.setOpacity(c(d-.03,d,r)*(1-c(l+.002,l+.02,r))),Pe.update(o,a,m));const jt=(r-oe)/(Ue-oe),Ft=qt&&jt>-.7&&jt<1.9;Re.object.visible=Ft,Ft&&(Tt(r,Re.object.position),Re.update(a,tt));const ze=C===2;K.visible=ze,de.object.visible=ze,Te.object.visible=ze;const Wt=ze?1-c(l+5e-4,l+.012,r):0;ve.mesh.visible=Wt>.003,ze&&(de.update(o,a,m),ve.mat.opacity=Wt,ve.mat.color.copy(pe),ve.mesh.position.copy(ne),ve.mesh.scale.setScalar(m.far*.8),Ee.update(ne),Ee.uniforms.uAmt.value=.3*c(l+.02,l+.08,r)+.7*c(l+.08,D+.09,r),Ee.uniforms.uDogs.value=c(D+.03,D+.13,r),Be.uniforms.uShow.value=c(l+.006,l+.035,r),Be.uniforms.uGiant.value=c(l+.004,l+.09,r),Lt.update(o,a,m),Vt.update(ne),ee.uniforms.uTle.value.z=(s?.16:.4)*Be.uniforms.uShow.value*(.65+.35*Math.sin(a*.8)),Se.object.position.copy(Rt).addScaledVector(at,(r-l)*36e3+a*12),Ut.setOpacity(c(l+.02,l+.08,r)*(.45+.55*c(D+.04,D+.13,r))),Te.update(o,a,m))}await t.yield(),await de.prewarm(t.renderer,null,k);const st=(o,a,m)=>{const r=(o-a)/m;return Math.exp(-r*r)};return{scene:k,path:A,duration:P,pace:o=>.95-.2*(1-c(ae*.6,ae*1.3,o))+.55*st(o,(ae+d)*.5+.01,.045)-.24*st(o,ue+.5*(Je-ue),.09)+.45*st(o,l+.1,.06)+.28*c(l+.03,l+.1,o)*(1-c(.82,.9,o))+.05*c(.85,.9,o),ride:"none",camera:{fov:62,near:.4,nearThrough:.4,far:42e3,lookAhead:30,sway:.8,bank:.6},pois:[{at:(o,a)=>Tt(a,fo),from:oe,to:Ue,weight:.66},{at:(o,a)=>(A.pointAt(a,ie),Co.set(T.x+(T.x-ie.x)*2.2,ie.y-300,T.z+(T.z-ie.z)*2.2)),from:l-.08,to:l-.006,weight:.7,fade:.4},{at:ho,from:l-.012,to:l+.075,weight:.9,fade:.25},{at:(o,a)=>(A.pointAt(a,ie),A.pointAt(Math.min(1,a+.012),rt).sub(ie).setY(0).normalize().multiplyScalar(2500).add(ie),rt.y=J+120,rt),from:l+.045,to:D-.02,weight:.74,fade:.3},{at:go,from:D-.07,to:D+.05,weight:.7,fade:.35},{at:Se.object.position,from:l+.07,to:D+.04,weight:.3},{at:A.end,from:D+.03,to:.9,weight:.5}],portal:{shape:"circle",radius:7,color:n.portal,glow:1.8,revealDistance:300},post:{exposure:1,bloom:{strength:.55,radius:.7,threshold:.9},grade:{saturation:1.08,contrast:1.05,tint:"#ffffff",shadowTint:"#05081a",vignette:.3,grain:.02,aberration:0}},update:Go,dispose(){de.dispose()}}}};export{a0 as default};
