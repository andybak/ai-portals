import*as a from"three";import{makePath as Vn,clamp as ve,lerp as X,smoothstep as G}from"../kit/core.js";import*as _n from"../kit/sky.js";import*as Io from"../kit/terrain.js";import*as Oo from"../kit/water.js";import*as re from"../kit/flora.js";import*as _e from"../kit/fauna.js";import*as Fe from"../kit/fx.js";import{buildHero as Gn,liteFirGeometryAsync as In,FLYER_VERTS as ha,GLSL_FLYWING as ga}from"../parts/monarch-sanctuary.js";const te=Math.PI*2,Ut=47,On=1.45,jn=.5,O=o=>new a.Color(o),Nn={morning:{title:"The Orange Awakening",palette:["#C9D3D0","#8FA6B8","#24382F","#4A4038","#8C7A66","#FFF1D0","#F2811D"],sunDir:[-.6,.7,.4],zenith:"#8296a8",mid:"#a9b8c0",horizon:"#c9d3d0",fog:"#c2ccc9",fogDensity:.0058,hemi:[1.75,1.5],sun:[.22,4.6],hemiSky:"#c9d3d0",hemiGround:"#8a8478",rate:1,reverse:!1,rime:0,cover:[.97,.45]},frost:{title:"The Orange Awakening: First Light",palette:["#D2D8E0","#9AAAC2","#2A3C3A","#4A4440","#8A7F76","#FFE6C8","#F2811D"],sunDir:[-.74,.46,.42],zenith:"#8c9ab4",mid:"#b9c0cc",horizon:"#dcd6d6",fog:"#cdd3da",fogDensity:.0068,hemi:[1.7,1.5],sun:[.16,4],hemiSky:"#d0d8e4",hemiGround:"#8c8c90",rate:.74,reverse:!1,rime:1,cover:[.98,.52]},afternoon:{title:"The Orange Settling",palette:["#CFCDC2","#A3ADB0","#2A3A2E","#4C4136","#8C7A66","#FFDDAE","#F2811D"],sunDir:[-.72,.5,.3],zenith:"#8f9aa0",mid:"#b4b8b4",horizon:"#d6d0c2",fog:"#c9c7bc",fogDensity:.0056,hemi:[1.7,1.5],sun:[.3,4.5],hemiSky:"#cfcfc6",hemiGround:"#8a8376",rate:1,reverse:!0,rime:0,cover:[.95,.46]}},we=`
float mHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float mNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(mHash(i), mHash(i+vec2(1.,0.)), f.x), mix(mHash(i+vec2(0.,1.)), mHash(i+vec2(1.,1.)), f.x), f.y); }
`,je=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float mFog = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    float mFog = smoothstep(fogNear, fogFar, vFogDepth);
  #endif
  outc = mix(outc, fogColor, mFog);
#endif`,pa=`
uniform vec3 uRiver[8]; uniform float uRiverLen;
vec3 riverPt(float s){
  float f = clamp(s / uRiverLen, 0.0, 1.0) * 7.0; float fi = min(floor(f), 6.0); float t = f - fi; int k = int(fi);
  vec3 p0 = uRiver[max(k - 1, 0)], p1 = uRiver[k], p2 = uRiver[min(k + 1, 7)], p3 = uRiver[min(k + 2, 7)];
  return 0.5 * ((2.0 * p1) + (p2 - p0) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t + (3.0 * p1 - p0 - 3.0 * p2 + p3) * t * t * t);
}
vec3 wander(float s, float t){
  return vec3(sin(t * 0.83 + s * 6.3) + 0.5 * sin(t * 1.9 + s * 17.0),
              0.7 * sin(t * 1.07 + s * 11.0) + 0.4 * sin(t * 2.3 + s * 5.0),
              cos(t * 0.71 + s * 9.0) + 0.5 * cos(t * 1.7 + s * 13.0));
}`,jo=`
vec3 flyPos(float clock, out float fade){
  float a = clock - aRel.x, aa = max(a, 0.0);
  float out1 = 1.0 - exp(-aa * 0.9);
  vec2 rad = normalize(aSeed.xy - 0.5 + 1e-3);
  float sw = aa * 0.25 * (aSeed.y - 0.4) + out1 * (aSeed.x - 0.5) * 2.0;
  float cs = cos(sw), sn = sin(sw); vec2 rr = vec2(rad.x * cs - rad.y * sn, rad.x * sn + rad.y * cs);
  float cr = out1 * (2.5 + 9.0 * aSeed.w * aSeed.w);
  vec3 cloud = aSrc + vec3(rr.x * cr, out1 * (0.5 + 6.0 * aSeed.z * aSeed.z) + 0.5 * sin(aa * 0.6 + aSeed.x * 6.0), rr.y * cr);
  float sp = smoothstep(0.0, 0.3, aa) * (1.0 - smoothstep(0.9, 2.2, aa)), sa = aa * 7.0 + aSeed.x * 40.0;
  cloud += vec3(cos(sa) * rad.y, sin(sa), -cos(sa) * rad.x) * 0.5 * sp;
  cloud += wander(aSeed.x * 10.0 + aSeed.w, clock * 0.8) * (0.2 + 1.8 * out1);
  float tG = 1.0 + aSeed.z * 4.5;
  float gth = smoothstep(tG, tG + 3.5, aa) * step(0.0, aRel.y);
  float s = max(aRel.y, 0.0) + aSeed.x * 14.0 + max(aa - tG, 0.0) * (6.0 + 2.5 * aSeed.y);
  vec3 rp = riverPt(s);
  float ca = aSeed.x * 6.2832 + s * 0.035 + clock * 0.15;
  float funnel = 1.0 - 0.55 * smoothstep(uRiverLen - 62.0, uRiverLen - 14.0, s);      // the river narrows and pours into the ring
  float crad = sqrt(aSeed.y) * (3.7 + 1.2 * sin(s * 0.05 + aSeed.z * 6.0)) * funnel;
  float braid = smoothstep(25.0, 70.0, s), strand = floor(aSeed.z * 3.0);
  rp += vec3(cos(ca) * crad, sin(ca) * crad * 0.6, 0.0) * (1.0 - 0.3 * braid) + wander(aSeed.y * 9.0 + aSeed.z, clock * 1.1 + s * 0.05) * 0.7;
  rp += vec3(2.3 * sin(s * 0.052 + strand * 2.1 + clock * 0.13), 0.9 * sin(s * 0.041 + strand * 4.0), 0.0) * braid * funnel;
  fade = step(0.0, a) * (1.0 - smoothstep(uRiverLen - 18.0, uRiverLen - 2.0, s) * step(0.0, aRel.y));
  return mix(cloud, rp, gth);
}`;function kt(o,m,p,A){const b=ve(p/m,0,1)*7,R=Math.min(Math.floor(b),6),B=b-R,M=o[Math.max(R-1,0)],k=o[R],i=o[Math.min(R+1,7)],y=o[Math.min(R+2,7)],g=(w,h,F,L)=>.5*(2*h+(F-w)*B+(2*w-5*h+4*F-L)*B*B+(3*h-w-3*F+L)*B*B*B);return A.set(g(M.x,k.x,i.x,y.x),g(M.y,k.y,i.y,y.y),g(M.z,k.z,i.z,y.z))}async function qt(o,m,p){const A=o.length,b=new a.InstancedBufferGeometry;b.setAttribute("position",new a.BufferAttribute(new Float32Array([0,0,-.55,0,0,.55,1,0,.55,1,0,-.55,0,0,-.55,0,0,.55,-1,0,.55,-1,0,-.55]),3)),b.setIndex([0,1,2,0,2,3,4,6,5,4,7,6]);const R=new Float32Array(A*3),B=new Float32Array(A*3),M=new Float32Array(A*3),k=new Float32Array(A*4);for(let g=0;g<A;g++){(g&2047)===2047&&await p();const w=o[g],h=g*4;R.set(w.p,g*3),B.set(w.up,g*3),M.set(w.fw,g*3),k[h]=w.size,k[h+1]=w.phase,k[h+2]=w.mode,k[h+3]=w.rnd}await p(),b.setAttribute("aPos",new a.InstancedBufferAttribute(R,3)),b.setAttribute("aUp",new a.InstancedBufferAttribute(B,3)),b.setAttribute("aFwd",new a.InstancedBufferAttribute(M,3)),b.setAttribute("aPar",new a.InstancedBufferAttribute(k,4)),b.instanceCount=A;const i=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),side:a.DoubleSide,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
${we}
attribute vec3 aPos, aUp, aFwd; attribute vec4 aPar;
uniform float uTime, uGate;
varying vec2 vW; varying float vRnd, vOpen, vMode; varying vec3 vWN;
void main(){
  vec3 up = normalize(aUp); vec3 fw = normalize(aFwd - up * dot(aFwd, up) + 1e-4); vec3 rt = cross(up, fw);
  float side = sign(position.x), ax = abs(position.x), rnd = aPar.w, open;
  if (aPar.z < 0.5) {
    float burst = step(0.92 - 0.22 * uGate, mHash(vec2(rnd * 91.0, floor(uTime * 1.3 + rnd * 7.0))));
    open = 0.035 + 0.03 * rnd + burst * 0.26 * (0.5 + 0.5 * sin(uTime * 157.0 + rnd * 40.0));
  } else if (aPar.z < 1.5) {
    float wv = 0.5 + 0.5 * sin(uTime * 2.3 - aPar.y);
    open = mix(0.1, 0.9, smoothstep(0.25, 0.9, wv)) * (0.75 + 0.25 * rnd);
  } else {
    // a basker: half open, breathing slowly, with a quick shiver now and then
    float burst = step(0.8, mHash(vec2(rnd * 91.0, floor(uTime * 1.1 + rnd * 7.0))));
    open = 0.3 + 0.2 * rnd + 0.2 * sin(uTime * (0.9 + rnd) + rnd * 50.0) + burst * 0.12 * sin(uTime * 150.0 + rnd * 40.0);
  }
  float ang = (1.0 - open) * 1.52;
  vec4 mc = modelViewMatrix * vec4(aPos, 1.0);
  float sc = max(aPar.x, -mc.z * 0.0021);
  vec3 lp = fw * position.z + (rt * side * cos(ang) + up * sin(ang)) * ax;
  vec4 mvPosition = modelViewMatrix * vec4(aPos + lp * sc, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vW = vec2(ax, position.z); vRnd = rnd; vOpen = open; vMode = aPar.z;
  vWN = up * cos(ang) - rt * side * sin(ang);      // the wing's own plane: the same on its four corners
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
${we}
uniform vec3 uOrange, uWing, uAmb, uSunCol, uSunDir; uniform float uGate, uRime;
varying vec2 vW; varying float vRnd, vOpen, vMode; varying vec3 vWN;
void main(){
  float d1 = length((vW - vec2(0.47, 0.2)) / vec2(0.53, 0.34));
  float d2 = length((vW - vec2(0.36, -0.2)) / vec2(0.39, 0.35));
  float d = min(d1, d2); if (d > 1.0) discard;
  float edge = smoothstep(0.7, 0.93, d);
  float fan = atan(vW.y, vW.x + 0.06);
  float vein = smoothstep(0.0, 0.28, abs(sin(fan * 10.0 + vW.x * 2.0)));
  float dots = step(0.55, mHash(floor(vec2(fan * 9.0, d * 7.0)) + vRnd)) * edge;
  vec3 outc;
  if (gl_FrontFacing) {
    float bask = step(1.5, vMode);
    float shv = step(vMode, 0.5) * smoothstep(0.09, 0.2, vOpen);      // a shivering sleeper shows a sliver of its orange upper wing
    vec3 col = mix(uWing * 1.15, uOrange, max(max(uGate, 0.9 * shv), bask)) * (0.75 + 0.5 * vRnd) * (0.28 + 0.72 * vein) * (1.0 - 0.93 * edge) + vec3(0.6) * dots * max(uGate, bask);
    outc = col * (uAmb + uSunCol * uGate * 0.5) + col * vec3(1.0, 0.72, 0.42) * max(uGate * (0.2 + 0.9 * vOpen) + 0.5 * shv, bask * (0.35 + 0.5 * vOpen));
  } else {
    vec3 col = mix(uWing, uOrange * 0.55, 0.14 * max(uGate, 0.8 * step(1.5, vMode)) * step(0.5, vMode)) * (0.62 + 0.6 * vRnd) * (0.55 + 0.45 * vein) * (1.0 - 0.6 * edge) + vec3(0.2) * dots;
    col = mix(col, vec3(0.74, 0.79, 0.85), uRime * 0.45 * smoothstep(0.35, 0.8, mNoise(vW * 9.0 + vRnd * 40.0)));
    // a shut wing is a pale straw leaf with a form: broadside to the bright place of the sky it is light, edge on it is dark,
    // darker where it is tucked in at the hinge, and its outline catches the sky
    float turn = clamp(abs(dot(vWN, uSunDir)), 0.0, 1.0), tip = clamp(vW.x, 0.0, 1.0);
    col *= vec3(1.46, 1.38, 1.14) * (0.62 + 0.56 * turn) * (0.74 + 0.42 * tip);
    col += vec3(0.4, 0.44, 0.48) * smoothstep(0.93, 1.0, d) * (0.5 + 0.5 * turn);
    outc = col * (uAmb * 1.25 + uSunCol * uGate * 0.4);
  }
  ${je}
  gl_FragColor = vec4(outc, 1.0);
}`});Object.assign(i.uniforms,m);const y=new a.Mesh(b,i);return y.frustumCulled=!1,y.name="monarch-perched",y}async function No(o,m,p){const A=o.length,b=new a.InstancedBufferGeometry;b.setAttribute("position",new a.BufferAttribute(new Float32Array(ha),3)),b.setAttribute("aBary",new a.BufferAttribute(new Float32Array([1,0,0,0,1,0,0,0,1,0,0,1]),3)),b.setIndex([0,2,1,0,1,3]);const R=new Float32Array(A*3),B=new Float32Array(A*2),M=new Float32Array(A*4);for(let y=0;y<A;y++){(y&2047)===2047&&await p();const g=o[y];R.set(g.p,y*3),B[y*2]=g.t,B[y*2+1]=g.s,M.set(g.seed,y*4)}await p(),b.setAttribute("aSrc",new a.InstancedBufferAttribute(R,3)),b.setAttribute("aRel",new a.InstancedBufferAttribute(B,2)),b.setAttribute("aSeed",new a.InstancedBufferAttribute(M,4)),b.instanceCount=A;const k=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),side:a.DoubleSide,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
${we}
${pa}
attribute vec3 aBary, aSrc; attribute vec2 aRel; attribute vec4 aSeed;
uniform float uClock, uTime, uGate, uSize; uniform vec3 uSunDir;
varying vec3 vBary; varying float vLit, vSeed, vFade, vPx, vBack;
${jo}
void main(){
  float fade, f2;
  vec3 c = flyPos(uClock, fade);
  vec3 c2 = flyPos(uClock + 0.12, f2);
  vec3 fw = c2 - c; float fl = length(fw);
  fw = fl > 1e-4 ? fw / fl : vec3(0.0, 0.0, 1.0);
  fw = normalize(fw + vec3(0.0, 0.15, 0.0));
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)) + 1e-4), up = cross(rt, fw);
  // no two fly alike: each holds its own heading and bank about the stream's direction, and wavers
  float yaw = (fract(aSeed.y * 13.7 + aSeed.z) - 0.5) * 1.6 + 0.3 * sin(uTime * 1.3 + aSeed.x * 31.0);
  float rol = (fract(aSeed.z * 9.1 + aSeed.w) - 0.5) * 1.6 + 0.3 * sin(uTime * 1.7 + aSeed.y * 23.0);
  vec3 fwY = fw * cos(yaw) + rt * sin(yaw); rt = rt * cos(yaw) - fw * sin(yaw); fw = fwY;
  vec3 rtR = rt * cos(rol) + up * sin(rol); up = up * cos(rol) - rt * sin(rol); rt = rtR;
  float ph = uTime * (46.0 + 16.0 * aSeed.z) + aSeed.x * 60.0;
  float glide = smoothstep(0.55, 0.7, fract(uTime * 0.37 + aSeed.w * 5.0 + aSeed.y));
  float ang = mix(0.15 + 1.05 * sin(ph), 0.06 + 0.34 * aSeed.z, glide);
  ang = mix(1.45, ang, smoothstep(0.0, 0.35, uClock - aRel.x));
  vec4 mc = modelViewMatrix * vec4(c, 1.0);
  // the early ones (never released: aRel.x far in the past) are drawn larger, so that a wing in the grey reads as a wing;
  // aRel.y = -2 marks those that live inside a standing sun shaft and are lit by it before the tear
  float early = step(aRel.x, -500.0), inShaft = early * step(aRel.y, -1.5);
  float sc = max(uSize * (1.0 + 0.6 * early), -mc.z * mix(0.0021, 0.0042, early)) * (0.7 + 0.7 * fract(aSeed.w * 7.31 + aSeed.x * 3.7)) * fade * smoothstep(0.4, 3.2, -mc.z);
  sc *= 1.0 + 0.6 * (1.0 - smoothstep(0.8, 4.5, uClock - aRel.x));
  float side = position.x;
  vec3 lp = fw * position.z + rt * (side * cos(ang)) + up * (abs(side) * sin(ang));
  vec4 mvPosition = modelViewMatrix * vec4(c + lp * sc, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vBary = aBary; vSeed = aSeed.x; vFade = fade; vPx = sc / max(-mc.z * 0.0022, 1e-4);
  vec3 wv = (modelMatrix * vec4(c, 1.0)).xyz - cameraPosition;
  vBack = uGate * smoothstep(0.6, 0.95, dot(wv, uSunDir) / max(length(wv), 1e-3));      // between the lens and the sun: amber glass
  vLit = uGate * smoothstep(0.3, 0.62, mNoise(c.xz * 0.045 + vec2(1.7, -uTime * 0.36)));
  vLit = max(vLit, 0.22 * early + inShaft * (0.5 + 0.3 * sin(uTime * 0.7 + aSeed.x * 40.0)));
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uOrange, uSunCol, uAmb;
varying vec3 vBary; varying float vLit, vSeed, vFade, vPx, vBack;
${ga}
void main(){
  if (vFade < 0.01) discard;
  float white, ink = flyWing(vBary, vPx, vSeed, white);
  vec3 col = mix(uOrange * (0.8 + 0.5 * vSeed) * ink, vec3(0.75), white);
  if (!gl_FrontFacing) col = mix(col, vec3(dot(col, vec3(0.5))) * vec3(1.3, 0.9, 0.55), 0.3);
  vec3 outc = col * (uAmb * 0.7 + uSunCol * vLit * 0.45) + col * vec3(1.0, 0.74, 0.45) * (0.15 + vLit * 0.85 + vBack * 0.9) * ink;
  ${je}
  gl_FragColor = vec4(outc, 1.0);
}`});Object.assign(k.uniforms,m);const i=new a.Mesh(b,k);return i.frustumCulled=!1,i.name="monarch-cascade-flyers",i}function Un(o,m,p,A){const M=[],k=[],i=[],y=new a.Vector3,g=new a.Vector3;for(let L=0;L<=120;L++){const v=L/120*m;kt(o,m,v,y),kt(o,m,Math.min(v+1,m+1),g);let c=g.x-y.x,D=g.z-y.z;const Z=Math.hypot(c,D)||1;c/=Z,D/=Z;for(let I=0;I<=6;I++){const z=I/6*2-1,E=y.x+D*z*8.5,$=y.z-c*z*8.5;M.push(E,p(E,$)+.4,$),k.push(z,v)}}for(let L=0;L<120;L++)for(let v=0;v<6;v++){const c=L*7+v,D=c+6+1;i.push(c,D,c+1,c+1,D,D+1)}const w=new a.BufferGeometry;w.setAttribute("position",new a.Float32BufferAttribute(M,3)),w.setAttribute("aAS",new a.Float32BufferAttribute(k,2)),w.setIndex(i);const h=new a.ShaderMaterial({uniforms:{uTime:A.uTime,uFront:{value:-100},uTail:{value:-200},uAmount:{value:.55}},transparent:!0,depthWrite:!1,side:a.DoubleSide,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.DstColorFactor,blendDst:a.ZeroFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
attribute vec2 aAS; varying vec2 vAS;
void main(){ vAS = aAS; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
${we}
uniform float uTime, uFront, uTail, uAmount; varying vec2 vAS;
void main(){
  float pres = smoothstep(uFront + 6.0, uFront - 28.0, vAS.y) * smoothstep(uTail - 6.0, uTail + 30.0, vAS.y);
  float across = 1.0 - smoothstep(0.35, 1.0, abs(vAS.x));
  float d1 = mNoise(vec2(vAS.y * 0.9 - uTime * 7.0, vAS.x * 5.0));
  float d2 = mNoise(vec2(vAS.y * 2.3 - uTime * 13.0, vAS.x * 11.0 + 3.0));
  float flick = 0.8 + 0.2 * sin(uTime * 31.0 + vAS.y * 0.8);
  float k = pres * across * uAmount * (0.45 + 0.75 * d1 * d2 + 0.25 * d1) * flick;
  gl_FragColor = vec4(vec3(1.0 - clamp(k, 0.0, 0.7)), 1.0);
}`}),F=new a.Mesh(w,h);return F.renderOrder=3,F.frustumCulled=!1,F.name="river-shadow",F}async function qn(o,m,p,A){const i=Math.round(30),y=Math.round(168/4),g=[],w=[];for(let c=0;c<=y;c++){(c&7)===7&&await A();for(let D=0;D<=i;D++){const Z=-42+D*4,I=-72+c*4;g.push(Z,o(Z,I)+.45,I)}}for(let c=0;c<y;c++)for(let D=0;D<i;D++){const Z=c*(i+1)+D,I=Z+i+1;w.push(Z,I,Z+1,Z+1,I,I+1)}const h=new a.BufferGeometry;h.setAttribute("position",new a.Float32BufferAttribute(g,3)),h.setIndex(w);const F=new a.Vector2(m.x,m.z).normalize(),L=new a.ShaderMaterial({uniforms:{uTime:p.uTime,uSunCol:p.uSunCol,uPool:{value:new a.Vector3(0,0,0)},uAz:{value:new a.Vector3(F.x,F.y,1/Math.max(m.y,.3))}},transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.DstColorFactor,blendDst:a.OneFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
varying vec2 vXZ;
void main(){ vXZ = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
${we}
uniform float uTime; uniform vec3 uSunCol, uPool, uAz; varying vec2 vXZ;
void main(){
  vec2 d = vXZ - uPool.xy;
  float al = dot(d, uAz.xy) / (8.5 * uAz.z), ac = dot(d, vec2(-uAz.y, uAz.x)) / 8.5;
  float r = sqrt(al * al + ac * ac) + 0.22 * (mNoise(vXZ * 0.35 + vec2(uTime * 0.4, 0.0)) - 0.5);
  float k = (1.0 - smoothstep(0.55, 1.15, r)) * (0.8 + 0.35 * mNoise(vXZ * 1.3 - vec2(0.0, uTime * 0.7)));
  gl_FragColor = vec4(uSunCol * (0.75 * uPool.z * k), 1.0);
}`}),v=new a.Mesh(h,L);return v.renderOrder=3,v.frustumCulled=!1,v.name="sun-pool",v}function Wn(o,m){const M=Math.round(24),k=Math.round(210/7),i=[],y=[];for(let F=0;F<=k;F++)for(let L=0;L<=M;L++){const v=-84+L*7,c=138+F*7;i.push(v,o(v,c)+1.5,c)}for(let F=0;F<k;F++)for(let L=0;L<M;L++){const v=F*(M+1)+L,c=v+M+1;y.push(v,c,v+1,v+1,c,c+1)}const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(i,3)),g.setIndex(y);const w=new a.ShaderMaterial({uniforms:{uTime:m.uTime,uK:{value:0}},transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.DstColorFactor,blendDst:a.ZeroFactor,vertexShader:`
varying vec2 vXZ;
void main(){ vXZ = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
${we}
uniform float uTime, uK; varying vec2 vXZ;
void main(){
  vec2 q = vXZ + vec2(uTime * 5.5, uTime * 1.6);
  float n = 0.62 * mNoise(q * 0.03) + 0.28 * mNoise(q * 0.075 + 7.0) + 0.1 * mNoise(q * 0.21);
  float edge = smoothstep(84.0, 62.0, abs(vXZ.x)) * smoothstep(138.0, 158.0, vXZ.y) * smoothstep(348.0, 318.0, vXZ.y);
  float k = smoothstep(0.42, 0.62, n) * 0.5 * uK * edge;
  gl_FragColor = vec4(mix(vec3(1.0), vec3(0.5, 0.56, 0.66), k), 1.0);      // shade is cooler as well as darker
}`}),h=new a.Mesh(g,w);return h.renderOrder=1,h.frustumCulled=!1,h.name="cloud-shade",h}function Zn(o,m,p,A,b){const R=[],B=[],M=[];let k=0;for(let h=p;h<=A;h+=2.5,k++){const F=o(h),L=(o(h+1)-o(h-1))/2,v=1/Math.hypot(1,L);for(const c of[-1,1]){const D=F+c*1.75*v,Z=h-c*1.75*L*v;R.push(D,m(F,h)+.37,Z),B.push(c,h)}}for(let h=0;h<k-1;h++)M.push(h*2,h*2+2,h*2+1,h*2+1,h*2+2,h*2+3);const i=new a.BufferGeometry;i.setAttribute("position",new a.Float32BufferAttribute(R,3)),i.setAttribute("aAS",new a.Float32BufferAttribute(B,2)),i.setIndex(M);const y=[];for(let h=0;h<6;h++)y.push(new a.Vector3(-1e4,0,0));const g=new a.ShaderMaterial({uniforms:{uTime:b.uTime,uSunCol:b.uSunCol,uRay:{value:y}},transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,vertexShader:`
attribute vec2 aAS; varying vec2 vAS;
void main(){ vAS = aAS; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
${we}
uniform float uTime; uniform vec3 uSunCol; uniform vec3 uRay[6]; varying vec2 vAS;
void main(){
  float lit = 0.0;
  for (int i = 0; i < 6; i++) { float d = (vAS.y - uRay[i].x) / 7.5; lit += uRay[i].y * exp(-d * d); }
  vec2 gp = vec2(vAS.x * 7.0, vAS.y * 7.0 - uTime * 2.6), id = floor(gp), f = fract(gp) - 0.5;
  float h = mHash(id), s1 = max(sin(uTime * (5.0 + 9.0 * h) + h * 40.0), 0.0);
  float tw = s1 * s1 * s1 * s1 * step(0.5, h);
  float spot = smoothstep(0.4, 0.04, length(f * vec2(1.0, 2.2)));
  float edge = 1.0 - smoothstep(0.55, 1.0, abs(vAS.x));
  gl_FragColor = vec4(uSunCol * (tw * spot * edge * min(lit, 1.6) * 8.5), 1.0);
}`}),w=new a.Mesh(i,g);return w.renderOrder=4,w.frustumCulled=!1,w.name="stream-glints",w}function lt(o,m,p,A,b,R){const B=m.length,M=o.P.length/3,k=new a.Vector3,i=new a.Vector3,y=new a.Vector3;for(let g=0;g<B;g++){k.copy(m[Math.min(g+1,B-1)]).sub(m[Math.max(g-1,0)]).normalize(),i.set(0,1,0),Math.abs(k.y)>.9&&i.set(1,0,0),y.crossVectors(k,i).normalize(),i.crossVectors(y,k).normalize();const w=X(p,A,g/(B-1));for(let h=0;h<b;h++){const F=h/b*te,L=Math.cos(F),v=Math.sin(F),c=y.x*L+i.x*v,D=y.y*L+i.y*v,Z=y.z*L+i.z*v,I=(.72+.5*((h*5+g*3)%4)/4)*(.8+.4*Math.abs(Math.sin(g*1.7+h*2.3)));o.P.push(m[g].x+c*w,m[g].y+D*w,m[g].z+Z*w),o.N.push(c,D,Z),o.C.push(R.r*I,R.g*I,R.b*I)}}for(let g=0;g<B-1;g++)for(let w=0;w<b;w++){const h=M+g*b+w,F=M+g*b+(w+1)%b;o.I.push(h,F,h+b,F,F+b,h+b)}}function va(o,m){const p=new a.BufferGeometry;return p.setAttribute("position",new a.Float32BufferAttribute(o.P,3)),p.setAttribute("normal",new a.Float32BufferAttribute(o.N,3)),p.setAttribute("color",new a.Float32BufferAttribute(o.C,3)),p.setIndex(o.I),new a.Mesh(p,m)}function En(o,m,p,A,b,R,B=0){let M;if(A.pts)M=new a.CatmullRomCurve3(A.pts,!1,"centripetal");else{const v=new a.Vector3().lerpVectors(A.from,A.tip,.4);v.y+=.9+A.from.distanceTo(A.tip)*.06,M=new a.QuadraticBezierCurve3(A.from,v,A.tip)}const k=!!A.pts,i=M.getLength(),y=M.getSpacedPoints(k?44:14);lt(o,y,k?.2:.11,k?.065:.03,k?8:5,b);const g=[y],w=new a.Vector3,h=new a.Vector3,F=k?13:9;for(let v=0;v<F;v++){const c=Math.min(X(Math.max(.22,B),1,(v+p())/F),1),D=M.getPointAt(c),Z=v%2?1:-1,I=p.range(.9,1.9)*(1.15-.5*c);M.getTangentAt(c,w).setY(0).normalize(),h.set(-w.z,0,w.x);const z=[];for(let E=0;E<=5;E++){const $=E/5;z.push(new a.Vector3().copy(D).addScaledVector(h,Z*I*$).addScaledVector(w,I*.45*$).add(new a.Vector3(0,-.55*I*$*$-(k?.25*$:0),0)))}lt(o,z,k?.045:.035,.012,4,b),g.push(z)}A.lines=g,A.bare=B,A.w0=m.length;const L=new a.Vector3;for(const v of g){const c=new a.CatmullRomCurve3(v),D=c.getLength(),Z=v===y?B:0,I=Math.round(D*(1-Z)/.072),z=Math.atan2(v[v.length-1].z-v[0].z,v[v.length-1].x-v[0].x);for(let E=0;E<I;E++){if(c.getPointAt(Math.min(1,Z+(1-Z)*(E+p())/I),L),k&&v===y)for(let ae=0;ae<5;ae++){const he=z+p.range(-.35,.35);m.push({p:[L.x+p.range(-.13,.13),L.y+.02+p.range(0,.06),L.z+p.range(-.13,.13)],up:[p.range(-.5,.5),1,p.range(-.5,.5)],fw:[Math.cos(he),-.25,Math.sin(he)],size:R*p.range(.9,1.2),phase:0,mode:0,rnd:p()})}const $=p.int(v===y?4:3,v===y?12:8),Se=p.range(-.05,.05),ye=p.range(-.05,.05),Y=p.range(0,te);for(let ae=0;ae<$;ae++)m.push({p:[L.x+Se+p.range(-.02,.02),L.y-.02-ae*R*.72,L.z+ye+p.range(-.02,.02)],up:[p.range(-.25,.25),-1,p.range(-.25,.25)],fw:[Math.cos(Y+p.range(-.5,.5)),0,Math.sin(Y+p.range(-.5,.5))],size:R*p.range(.85,1.15),phase:0,mode:0,rnd:p()})}}return A.w1=m.length,i}async function Xn(o,m,p,A){const b=o.length,R=new a.BufferGeometry,B=new Float32Array(b*3),M=new Float32Array(b*2),k=new Float32Array(b*4);for(let g=0;g<b;g++){(g&2047)===2047&&await A();const w=o[g];B.set(w.p,g*3),M[g*2]=w.t,M[g*2+1]=w.s,k.set(w.seed,g*4)}await A(),R.setAttribute("position",new a.BufferAttribute(B,3)),R.setAttribute("aRel",new a.BufferAttribute(M,2)),R.setAttribute("aSeed",new a.BufferAttribute(k,4));const i=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),fog:!0,transparent:!0,depthWrite:!1,vertexShader:`
#include <common>
#include <fog_pars_vertex>
${we}
${pa}
#define aSrc position
attribute vec2 aRel; attribute vec4 aSeed;
uniform float uClock, uTime, uGate, uPx;
varying float vLit, vSeed, vFade, vFlap, vFar;
${jo}
void main(){
  float fade;
  vec3 c = flyPos(uClock, fade);
  vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float d = max(-mvPosition.z, 0.5);
  float young = 1.0 - smoothstep(0.8, 5.0, uClock - aRel.x);
  float res = max(1.0, uPx / 400.0);      // the floor is an angle, not a pixel count: the same cloud at any resolution
  gl_PointSize = fade * smoothstep(6.0, 14.0, d) * clamp(uPx * 0.3 * (0.8 + 0.4 * aSeed.w) * (1.0 + 0.7 * young) / d, (3.2 + 1.8 * young) * res, (9.0 + 5.0 * young) * res);
  vFlap = 0.5 + 0.5 * sin(uTime * (40.0 + 16.0 * aSeed.z) + aSeed.x * 60.0);
  vSeed = aSeed.x; vFade = fade;
  vFar = 1.0 - 0.6 * smoothstep(55.0, 110.0, d);      // thin far off, so the portal's rim reads through the river's far end
  vLit = uGate * smoothstep(0.3, 0.62, mNoise(c.xz * 0.045 + vec2(1.7, -uTime * 0.36)));
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uOrange, uSunCol, uAmb;
varying float vLit, vSeed, vFade, vFlap, vFar;
void main(){
  if (vFade < 0.01) discard;
  // a soft pair of rounded wings meeting at the body, beating: far off the burst is a glowing cloud, never square pixels
  vec2 pc = abs(gl_PointCoord - 0.5) * 2.0;
  float span = 0.35 + 0.65 * vFlap;
  float dd = length(vec2((pc.x - 0.46 * span) / (0.5 * span), pc.y / 0.66));
  float al = smoothstep(1.0, 0.5, dd);
  if (al < 0.03) discard;
  vec3 col = uOrange * (0.8 + 0.5 * vSeed) * (0.6 + 0.4 * vFlap) * (0.75 + 0.6 * al);
  vec3 outc = col * (uAmb * 0.7 + uSunCol * vLit * 0.45) + col * vec3(1.0, 0.74, 0.45) * (0.15 + vLit * 0.85);
  ${je}
  gl_FragColor = vec4(outc, al * 0.78 * vFar);
}`});Object.assign(i.uniforms,m,{uPx:p});const y=new a.Points(R,i);return y.frustumCulled=!1,y.renderOrder=2,y.name="monarch-far-wings",y}function Hn(o,m,p){const A=o.length,b=new a.InstancedBufferGeometry;b.setAttribute("position",new a.BufferAttribute(new Float32Array([0,0,-.5,1,0,-.45,1,0,.5,0,0,.35]),3)),b.setIndex([0,1,2,0,2,3]);const R=new Float32Array(A*3),B=new Float32Array(A*4);for(let i=0;i<A;i++)R.set(o[i].p,i*3),B.set(o[i].seed,i*4);b.setAttribute("aP0",new a.InstancedBufferAttribute(R,3)),b.setAttribute("aSd",new a.InstancedBufferAttribute(B,4)),b.instanceCount=A;const M=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),side:a.DoubleSide,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aP0; attribute vec4 aSd;      // aSd: release time, spiral radius, phase, rnd
uniform float uTau;
varying vec2 vW; varying float vShow, vRnd;
void main(){
  float a = uTau - aSd.x, aa = clamp(a, 0.0, 12.0);
  float ph = aa * (2.6 + aSd.w) + aSd.z;
  vec3 c = aP0 + vec3(cos(ph) * aSd.y * (0.4 + 0.2 * aa), -0.75 * aa - 0.12 * sin(ph * 2.0), sin(ph) * aSd.y * (0.4 + 0.2 * aa));
  vShow = step(0.0, a) * (1.0 - smoothstep(9.0, 11.0, a));
  float sp = aa * 9.0 + aSd.z * 3.0;
  vec3 ax = normalize(vec3(cos(sp), 0.5 * sin(sp * 0.7), sin(sp))), bx = normalize(cross(ax, vec3(0.2, 1.0, 0.3)));
  vec4 mc = modelViewMatrix * vec4(c, 1.0);
  float sc = max(0.11, -mc.z * 0.004) * vShow;
  vec4 mvPosition = modelViewMatrix * vec4(c + (ax * position.x + bx * position.z) * sc, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vW = position.xz; vRnd = aSd.w;
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uOrange, uSunCol, uAmb; uniform float uGate;
varying vec2 vW; varying float vShow, vRnd;
void main(){
  if (vShow < 0.01) discard;
  float d = length((vW - vec2(0.48, 0.0)) / vec2(0.52, 0.5)); if (d > 1.0) discard;
  float ink = (1.0 - 0.9 * smoothstep(0.7, 0.93, d)) * (0.45 + 0.55 * smoothstep(0.0, 0.3, abs(sin(atan(vW.y, vW.x + 0.05) * 9.0))));
  vec3 col = uOrange * (0.8 + 0.4 * vRnd) * ink;
  vec3 outc = col * (uAmb + uSunCol * uGate * 0.4) + col * vec3(1.0, 0.74, 0.45) * (0.2 + 0.6 * uGate);
  ${je}
  gl_FragColor = vec4(outc, 1.0);
}`});Object.assign(M.uniforms,m,{uTau:p});const k=new a.Mesh(b,M);return k.frustumCulled=!1,k.name="loose-wings",k}function $n(o,m){const p=o.length,A=new a.InstancedBufferGeometry;A.setAttribute("position",new a.BufferAttribute(new Float32Array(ha),3)),A.setAttribute("aBary",new a.BufferAttribute(new Float32Array([1,0,0,0,1,0,0,0,1,0,0,1]),3)),A.setIndex([0,2,1,0,1,3]);const b=new Float32Array(p*3),R=new Float32Array(p*3),B=new Float32Array(p*4),M=new Float32Array(p);for(let y=0;y<p;y++){const g=o[y];b.set(g.p,y*3),R.set(g.up,y*3),B.set(g.par,y*4),M[y]=g.rel}A.setAttribute("aPos",new a.InstancedBufferAttribute(b,3)),A.setAttribute("aUp",new a.InstancedBufferAttribute(R,3)),A.setAttribute("aPar",new a.InstancedBufferAttribute(B,4)),A.setAttribute("aRel",new a.InstancedBufferAttribute(M,1)),A.instanceCount=p;const k=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),side:a.DoubleSide,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aBary, aPos, aUp; attribute vec4 aPar; attribute float aRel;
uniform float uTime, uClock;
varying vec3 vBary; varying float vLit, vSeed, vPx;
void main(){
  float rnd = aPar.w, ph = fract(uTime / aPar.z + aPar.y);
  float air = smoothstep(0.0, 0.025, ph) * (1.0 - smoothstep(0.175, 0.2, ph)), a = clamp(ph / 0.2, 0.0, 1.0) * 6.2832;
  vec3 up = normalize(aUp), hd = vec3(cos(aPar.x), 0.35, sin(aPar.x));
  vec3 f0 = normalize(hd - up * dot(hd, up) + vec3(1e-4, 0.0, 0.0)), r0 = cross(up, f0);
  float R = 0.45 + 0.45 * rnd, gone = smoothstep(0.0, 0.7, uClock - aRel);
  vec3 c = aPos + up * 0.03 + (f0 * sin(a) + r0 * (1.0 - cos(a))) * R + up * (0.4 * R * sin(a * 0.5)) + vec3(0.0, 3.0 * gone, 0.0);
  vec3 fw = f0 * cos(a) + r0 * sin(a), rt = cross(up, fw);
  float bask = smoothstep(0.2, 0.9, 0.5 + 0.5 * sin(uTime * (0.5 + 0.5 * rnd) + rnd * 40.0));
  float ang = mix(mix(1.42, 0.3, bask), 0.15 + 1.05 * sin(uTime * (46.0 + 16.0 * rnd) + rnd * 60.0), max(air, gone));
  vec4 mc = modelViewMatrix * vec4(c, 1.0);
  float sc = max(0.13, -mc.z * 0.0042) * (0.8 + 0.4 * fract(rnd * 7.31)) * (1.0 - gone) * smoothstep(0.4, 3.2, -mc.z);
  float side = position.x;
  vec3 lp = fw * position.z + rt * (side * cos(ang)) + up * (abs(side) * sin(ang));
  vec4 mvPosition = modelViewMatrix * vec4(c + lp * sc, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vBary = aBary; vSeed = rnd; vPx = sc / max(-mc.z * 0.0022, 1e-4);
  vLit = 0.5 + 0.2 * sin(uTime * 0.7 + rnd * 40.0) + 0.3 * bask * (1.0 - air);      // in the pencil's light: an ember, brightest when it basks
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uOrange, uSunCol, uAmb;
varying vec3 vBary; varying float vLit, vSeed, vPx;
${ga}
void main(){
  float white, ink = flyWing(vBary, vPx, vSeed, white);
  vec3 col = mix(uOrange * (0.8 + 0.5 * vSeed) * ink, vec3(0.75), white);
  if (!gl_FrontFacing) col = mix(col, vec3(dot(col, vec3(0.5))) * vec3(1.3, 0.9, 0.55), 0.3);
  vec3 outc = col * (uAmb * 0.7 + uSunCol * vLit * 0.45) + col * vec3(1.0, 0.74, 0.45) * (0.15 + vLit * 0.85) * ink;
  ${je}
  gl_FragColor = vec4(outc, 1.0);
}`});Object.assign(k.uniforms,m);const i=new a.Mesh(A,k);return i.frustumCulled=!1,i.name="early-wakers",i}async function Kn(o,m,p,A){const b=o.length,R=new Float32Array(b*27),B=new Float32Array(b*18),M=new Float32Array(b*9),k=new Uint32Array(b*24);for(let w=0;w<b;w++){(w&127)===127&&await A();const h=o[w],F=Math.cos(h.rot)*h.s*.5,L=Math.sin(h.rot)*h.s*.5,v=w*9;for(let c=0;c<9;c++){const D=c%3-1,Z=Math.floor(c/3)-1,I=h.x+D*F-Z*L,z=h.z+D*L+Z*F,E=v+c;R[E*3]=I,R[E*3+1]=m(I,z)+.06,R[E*3+2]=z,B[E*2]=D*.5+.5,B[E*2+1]=Z*.5+.5,M[E]=h.rnd}for(let c=0;c<4;c++){const D=v+c%2+Math.floor(c/2)*3;k.set([D,D+3,D+1,D+1,D+3,D+4],w*24+c*6)}}const i=new a.BufferGeometry;i.setAttribute("position",new a.BufferAttribute(R,3)),i.setAttribute("uv",new a.BufferAttribute(B,2)),i.setAttribute("aRnd",new a.BufferAttribute(M,1)),i.setIndex(new a.BufferAttribute(k,1));const y=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:`
#include <common>
#include <fog_pars_vertex>
attribute float aRnd; varying vec2 vUv, vXZ; varying float vRnd;
void main(){
  vUv = uv; vRnd = aRnd; vXZ = (modelMatrix * vec4(position, 1.0)).xz;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
${we}
uniform vec3 uAmb, uSunCol; uniform float uGate;
varying vec2 vUv, vXZ; varying float vRnd;
void main(){
  // the wings lie in cells of the ground itself (17 cm), so two patches that overlap show the same wings
  vec2 uvc = clamp(vUv, 0.0, 1.0), p = vXZ * 5.88, id = floor(p), f = fract(p) - 0.5;
  float fw = max(fwidth(p.x), fwidth(p.y));
  float h = mHash(id), h2 = mHash(id + 13.7), an = h * 6.2832, cs = cos(an), sn = sin(an);
  vec2 d = vec2(f.x * cs - f.y * sn, f.x * sn + f.y * cs);
  float t = clamp(d.y / 0.84 + 0.5, 0.0, 1.0);
  float hw = 0.27 * sqrt(max(sin(3.14159 * pow(t, 1.3)), 0.0)) + 0.012;
  float e = max(abs(d.x) / hw, abs(d.y / 0.84) * 2.0);
  // how thickly they lie: drifts and bare places inside the patch, thinning to nothing at its rim
  float drift = smoothstep(0.4, 0.56, 0.6 * mNoise(vXZ * 0.6 + vRnd * 40.0) + 0.4 * mNoise(vXZ * 2.1));
  float dens = (0.12 + 0.8 * drift) * (1.0 - smoothstep(0.45, 1.0, length(uvc - 0.5) * 2.0)), there = step(fract(h2 * 5.3), dens);
  float lod = 1.0 - smoothstep(0.22, 0.6, fw);
  float alpha = mix(0.75 * dens * (0.35 + 0.65 * smoothstep(0.3, 0.7, mNoise(vXZ * 3.7))), (1.0 - smoothstep(1.0 - min(fw * 4.0, 0.6), 1.0, e)) * there, lod);
  if (alpha < 0.02) discard;
  float vein = 0.7 + 0.3 * smoothstep(0.0, 0.3, abs(sin(atan(d.x, d.y + 0.9) * 14.0)));
  vec3 col = mix(vec3(0.33, 0.27, 0.18), vec3(0.6, 0.52, 0.38), mix(0.45, h, lod)) * mix(1.0, vein * (1.0 - 0.4 * smoothstep(0.7, 1.0, e)), lod);
  col = mix(col, vec3(0.42, 0.22, 0.1), 0.75 * step(0.9, fract(h * 13.0)) * lod);      // one in ten lies upper side up
  col *= 0.78 + 0.44 * mNoise(vXZ * 2.9 + 3.0);      // a drift is never one flat tone
  vec3 outc = col * (uAmb * 1.5 + uSunCol * uGate * 0.22);
  ${je}
  gl_FragColor = vec4(outc, alpha);
}`});Object.assign(y.uniforms,p);const g=new a.Mesh(i,y);return g.renderOrder=1,g.name="forest-litter",g}const Yn=`
#include <common>
#include <fog_pars_vertex>
attribute vec2 aAS, aBank; varying vec2 vAS, vBank; varying vec3 vW;
void main(){
  vAS = aAS; vBank = aBank; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Qn=`
#include <common>
#include <fog_pars_fragment>
${we}
uniform float uTime, uGate, uFront, uTail; uniform vec3 uSkyA, uSkyB, uOrange, uSunCol, uAmb;
varying vec2 vAS, vBank; varying vec3 vW;
void main(){
  float ax = clamp(vAS.x, -4.0, 4.0), s = vAS.y, shore = (ax < 0.0 ? vBank.x : vBank.y) - abs(ax);      // metres of water between here and the bank
  vec2 q = vec2(ax, vW.z);
  float sp = 1.2 + 0.9 * smoothstep(0.0, 1.5, shore);      // the water runs faster in mid-channel
  vec2 rp = vec2(mNoise(vec2(q.x * 1.7, q.y * 0.75 - uTime * sp)), mNoise(vec2(q.x * 1.3 + 9.0, q.y * 0.6 - uTime * sp * 0.8))) - 0.5;
  rp += 0.5 * (vec2(mNoise(vec2(q.x * 4.3, q.y * 2.1 - uTime * sp * 1.7)), mNoise(vec2(q.x * 3.7 + 5.0, q.y * 1.9 - uTime * sp * 1.5))) - 0.5);
  // the bed: pale gravel seen through the ripples, darker and greener where the water is deeper
  vec2 bp = q + rp * 0.35;
  float peb = 0.55 * mNoise(bp * 3.1) + 0.3 * mNoise(bp * 7.3 + 4.0) + 0.15 * mNoise(bp * 17.0);
  vec3 bed = mix(vec3(0.13, 0.14, 0.12), vec3(0.42, 0.41, 0.36), smoothstep(0.34, 0.68, peb)) * mix(vec3(1.0), vec3(0.4, 0.56, 0.52), smoothstep(0.1, 1.7, shore));
  bed *= uAmb * 2.2 + uSunCol * uGate * 0.22;
  // light running in lines down the current: the ripples' own faces turned to the deck
  float line = smoothstep(0.56, 0.86, mNoise(vec2(q.x * 3.3 + rp.x * 1.5, q.y * 0.55 - uTime * sp * 1.1)));
  bed += uSkyA * (0.3 * line * (0.4 + 0.6 * smoothstep(0.0, 0.8, shore)));
  // the mirror: the deck's light, and under the river of wings the wings themselves, broken by the ripples
  vec3 V = normalize(cameraPosition - clamp(vW, -4000.0, 4000.0) + vec3(0.0, 1e-3, 0.0)), N = normalize(vec3(rp.x * 0.55, 1.0, rp.y * 0.55));
  float F = 0.03 + 0.97 * pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 4.0);
  vec3 sky = mix(uSkyA, uSkyB, clamp(reflect(-V, N).y, 0.0, 1.0)) * (1.0 + 0.35 * uGate);
  float pres = smoothstep(uFront + 6.0, uFront - 28.0, s) * smoothstep(uTail - 6.0, uTail + 30.0, s);
  float dap = mNoise(vec2(q.y * 0.9 - uTime * 6.0, q.x * 2.3)) * mNoise(vec2(q.y * 2.1 - uTime * 11.0, q.x * 4.0 + 3.0));
  vec3 mir = mix(sky, uOrange * (0.9 + 1.4 * uGate), 0.72 * pres * smoothstep(0.12, 0.42, dap + 0.25 * rp.x));
  vec3 outc = mix(bed, mir, F);
  float foam = smoothstep(0.35, 0.0, shore) * smoothstep(0.45, 0.7, mNoise(vec2(q.x * 2.0, q.y * 1.4 - uTime * 0.9)));      // where the water turns round the bank
  outc = mix(outc, vec3(0.75, 0.78, 0.78) * (uAmb * 2.0), foam * 0.7);
  float alpha = smoothstep(-0.15, 0.25, shore) * 0.94;
  if (alpha < 0.01) discard;
  ${je}
  gl_FragColor = vec4(outc, alpha);
}`;function Jn(o,m,p,A,b){const M=o.length,k=[],i=[],y=[],g=[];for(let L=0;L<M;L++){const v=o[L];for(let c=0;c<=6;c++){const D=(c/6*2-1)*3.8;k.push(v.c.x+v.nx*D,v.c.y,v.c.z+v.nz*D),i.push(D,v.s),y.push(v.wl,v.wr)}}for(let L=0;L<M-1;L++)for(let v=0;v<6;v++){const c=L*7+v,D=c+6+1;g.push(c,D,c+1,c+1,D,D+1)}const w=new a.BufferGeometry;w.setAttribute("position",new a.Float32BufferAttribute(k,3)),w.setAttribute("aAS",new a.Float32BufferAttribute(i,2)),w.setAttribute("aBank",new a.Float32BufferAttribute(y,2)),w.setIndex(g);const h=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide,vertexShader:Yn,fragmentShader:Qn});Object.assign(h.uniforms,m,{uFront:p.uFront,uTail:p.uTail,uSkyA:{value:A},uSkyB:{value:b}});const F=new a.Mesh(w,h);return F.renderOrder=3.5,F.frustumCulled=!1,F.name="stream-face",F}function er(o,m,p,A){const b=o.length,R=new Float32Array(b*27),B=new Float32Array(b*18),M=new Uint32Array(b*24),k=new a.Vector2(p.x,p.z).normalize(),i=2.1/Math.max(p.y,.3),y=2.1;for(let F=0;F<b;F++){const L=F*9;for(let v=0;v<9;v++){const c=v%3-1,D=Math.floor(v/3)-1,Z=o[F].x+k.x*c*i-k.y*D*y,I=o[F].z+k.y*c*i+k.x*D*y,z=L+v;R[z*3]=Z,R[z*3+1]=m(Z,I)+.12,R[z*3+2]=I,B[z*2]=c,B[z*2+1]=D}for(let v=0;v<4;v++){const c=L+v%2+Math.floor(v/2)*3;M.set([c,c+3,c+1,c+1,c+3,c+4],F*24+v*6)}}const g=new a.BufferGeometry;g.setAttribute("position",new a.BufferAttribute(R,3)),g.setAttribute("uv",new a.BufferAttribute(B,2)),g.setIndex(new a.BufferAttribute(M,1));const w=new a.ShaderMaterial({uniforms:{uTime:A.uTime,uCol:{value:new a.Color},uK:{value:0}},transparent:!0,depthWrite:!1,side:a.DoubleSide,blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.DstColorFactor,blendDst:a.OneFactor,polygonOffset:!0,polygonOffsetFactor:-3,polygonOffsetUnits:-3,vertexShader:`
varying vec2 vUv, vXZ;
void main(){ vUv = uv; vXZ = position.xz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
${we}
uniform float uTime, uK; uniform vec3 uCol; varying vec2 vUv, vXZ;
void main(){
  float r = length(clamp(vUv, -1.0, 1.0)) + 0.18 * (mNoise(vXZ * 0.9 + vec2(uTime * 0.3, 0.0)) - 0.5);
  float k = (1.0 - smoothstep(0.35, 1.0, r)) * (0.8 + 0.3 * mNoise(vXZ * 2.3 - vec2(0.0, uTime * 0.5)));
  gl_FragColor = vec4(uCol * (uK * k), 1.0);
}`}),h=new a.Mesh(g,w);return h.renderOrder=3,h.name="light-pools",h}function tr(o,m,p,A,b,R,B){const M=new a.PlaneGeometry(4200,4200,1,1);M.rotateX(Math.PI/2);const k=new a.ShaderMaterial({uniforms:{uTime:A.uTime,uDeck:{value:1},uBreak:{value:m},uWind:{value:p},uDark:{value:b},uLight:{value:R},uSunCol:{value:B}},transparent:!0,depthWrite:!1,side:a.DoubleSide,vertexShader:`
varying vec2 vXZ;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vXZ = wp.xz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
${we}
uniform float uTime, uDeck; uniform vec2 uBreak, uWind; uniform vec3 uDark, uLight, uSunCol; varying vec2 vXZ;
float dFbm(vec2 p){ return 0.5 * mNoise(p) + 0.3 * mNoise(p * 2.13 + 7.3) + 0.2 * mNoise(p * 4.7 + 19.1); }
void main(){
  vec2 xz = clamp(vXZ, -2400.0, 2400.0);
  vec2 q = xz * 0.0016 + uWind * uTime;
  float n = dFbm(q), f = dFbm(q * 3.1 + vec2(4.0, 9.0) + uWind * uTime * 1.7);
  float reach = (n - 0.5) * 2.2 + (f - 0.5) * 0.7;      // under 0 a darker reach of the deck, over 0 a lighter one
  float a = smoothstep(0.05, 0.5, abs(reach)) * (reach < 0.0 ? 0.5 : 0.78);
  vec3 col = reach < 0.0 ? uDark : uLight;
  float d = min(length(xz - uBreak) / 380.0, 4.0), glow = exp(-d * d * 2.2);
  col = mix(col, uSunCol * (0.75 + 0.5 * f), glow);      // the brighter place: the deck is thin there and its grain shows silver
  a = max(a, glow * (0.55 + 0.35 * f));
  a *= (1.0 - smoothstep(1000.0, 1750.0, length(xz))) * uDeck;
  gl_FragColor = vec4(col, a);
}`}),i=new a.Mesh(M,k);return i.position.set(0,o,0),i.renderOrder=-.5,i.frustumCulled=!1,i.name="cloud-deck",i}function ar(o,m,p){const A=[],b=[],R=[],B=[],M=new a.Vector3(0,1,0),k=new a.Vector3,i=new a.Vector3,y=new a.Vector3,g=new a.Vector3,w=new a.Vector3,h=new a.Vector3,F=new a.Vector3,L=(I,z,E,$,Se,ye)=>{h.set(m.range(-.35,.35),1,m.range(-.35,.35)).normalize(),w.crossVectors(z,h).normalize(),h.crossVectors(w,z).normalize();for(const[Y,ae]of[[0,-1],[1,-1],[1,1],[0,-1],[1,1],[0,1]])F.copy(I).addScaledVector(z,Y*E).addScaledVector(w,ae*$),F.y-=Y*Y*E*.22,A.push(F.x,F.y,F.z),b.push(Y,ae),R.push(h.x,h.y,h.z),B.push(Se,ye)},v=(I,z,E,$,Se)=>{const ye=I.getLength()*(E-z),Y=Math.max(1,Math.round(ye/$));for(let ae=0;ae<Y;ae++){const he=Math.min(1,z+(E-z)*(ae+m())/Y),oe=ae%2?1:-1;I.getPointAt(he,k),I.getTangentAt(he,i),y.crossVectors(M,i).normalize(),g.copy(i).multiplyScalar(m.range(.45,.8)).addScaledVector(y,oe*m.range(.7,1)).addScaledVector(M,m.range(-.18,.12)).normalize();const Ge=Se*m.range(.75,1.25);L(k,g,Ge,m.range(.04,.052),m(),0)}};for(const I of o)I.lines&&I.lines.forEach((z,E)=>{const $=new a.CatmullRomCurve3(z);if(v($,E?.04:I.bare,1,.055,E?.24:.27),E)return;const Se=$.getLength()*I.bare,ye=Math.round(Se/.34);for(let Y=0;Y<ye;Y++){const ae=I.bare*(Y+m())/ye,he=Y%2?1:-1,oe=m.range(.55,1.05);$.getPointAt(ae,k),$.getTangentAt(ae,i),y.crossVectors(M,i).normalize(),g.copy(i).multiplyScalar(.55).addScaledVector(y,he).normalize();const Ge=k.clone(),Xe=k.clone().addScaledVector(g,oe);Xe.y-=oe*m.range(.25,.5);const fe=Ge.clone().lerp(Xe,.5);fe.y+=oe*.12;const T=new a.QuadraticBezierCurve3(Ge,fe,Xe);for(let ie=0;ie<4;ie++)T.getPointAt(ie/4,k),T.getTangentAt(ie/4+.1,i),L(k,i,oe/4*1.04,.022,m(),1);v(T,.1,1,.055,.22)}});const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(A,3)),c.setAttribute("uv",new a.Float32BufferAttribute(b,2)),c.setAttribute("normal",new a.Float32BufferAttribute(R,3)),c.setAttribute("aR",new a.Float32BufferAttribute(B,2));const D=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),side:a.DoubleSide,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
attribute vec2 aR; varying vec2 vUv, vR; varying vec3 vN;
void main(){
  vUv = uv; vR = aR; vN = normal;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
${we}
uniform vec3 uAmb, uSunCol, uSunDir; uniform float uGate, uRime;
varying vec2 vUv, vR; varying vec3 vN;
void main(){
  float a = clamp(vUv.x, 0.0, 1.0), b = clamp(abs(vUv.y), 0.0, 1.0);      // along the spray; out from its midrib
  float s = (a - 0.16 * b) * 23.0, lod = clamp(fwidth(s) * 1.6, 0.0, 1.0);      // the needles lean toward the tip
  vec3 col; float keep;
  if (vR.y > 0.5) { keep = 1.0; col = vec3(0.3, 0.25, 0.2) * (0.8 + 0.4 * vR.x); }
  else {
    float outl = (1.0 - a * a) * (0.3 + 0.7 * smoothstep(0.0, 0.1, a));      // the comb's outline: full by the twig, drawn in to a point
    float f = abs(fract(s + vR.x * 7.0) - 0.5) * 2.0, wide = 0.62 - 0.3 * b / max(outl, 0.05);
    float needle = mix(step(f, wide), 1.0, lod) * step(b, outl), rib = step(b, 0.07);
    keep = max(needle, rib);
    float topSide = gl_FrontFacing ? 0.0 : 1.0;
    vec3 green = mix(vec3(0.21, 0.3, 0.27), vec3(0.11, 0.19, 0.165), topSide);      // dark above, paler below, as on a fir
    green *= (0.72 + 0.5 * (1.0 - f) * (1.0 - lod)) * (0.8 + 0.4 * vR.x) * (0.75 + 0.45 * b);
    green = mix(green, vec3(0.72, 0.8, 0.86), uRime * 0.4 * smoothstep(0.55, 1.0, b / max(outl, 0.05)));      // rime on the needle tips
    col = mix(green, vec3(0.3, 0.25, 0.2), rib * (1.0 - needle * 0.5));
  }
  if (keep < 0.5) discard;
  float turn = clamp(abs(dot(vN, uSunDir)), 0.0, 1.0);
  vec3 outc = col * (uAmb * (1.0 + 0.7 * turn) + uSunCol * uGate * (0.15 + 0.4 * turn));
  ${je}
  gl_FragColor = vec4(outc, 1.0);
}`});D.uniforms.uAmb=p.uAmb,D.uniforms.uSunCol=p.uSunCol,D.uniforms.uSunDir=p.uSunDir,D.uniforms.uGate=p.uGate,D.uniforms.uRime=p.uRime;const Z=new a.Mesh(c,D);return Z.name="bough-needles",Z}function or(o,m,p,A,b,R,B){const M=new a.InstancedBufferGeometry;M.setAttribute("position",new a.BufferAttribute(new Float32Array(ha),3)),M.setAttribute("aBary",new a.BufferAttribute(new Float32Array([1,0,0,0,1,0,0,0,1,0,0,1]),3)),M.setIndex([0,2,1,0,1,3]);const k=new Float32Array(o*4);for(let g=0;g<o*4;g++)k[g]=m();M.setAttribute("aSeed",new a.InstancedBufferAttribute(k,4)),M.instanceCount=o;const i=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,{}]),side:a.DoubleSide,fog:!0,vertexShader:`
#include <common>
#include <fog_pars_vertex>
${we}
${pa}
attribute vec3 aBary; attribute vec4 aSeed;
uniform float uClock, uTime, uGate, uSize, uRibLen, uRibS0, uFront, uTail; uniform vec3 uSunDir, uRib[8];
varying vec3 vBary; varying float vLit, vSeed, vFade, vPx, vBack;
vec3 ribPt(float s){
  float f = clamp(s / uRibLen, 0.0, 1.0) * 7.0; float fi = min(floor(f), 6.0); float t = f - fi; int k = int(fi);
  vec3 p0 = uRib[max(k - 1, 0)], p1 = uRib[k], p2 = uRib[min(k + 1, 7)], p3 = uRib[min(k + 2, 7)];
  return 0.5 * ((2.0 * p1) + (p2 - p0) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t + (3.0 * p1 - p0 - 3.0 * p2 + p3) * t * t * t);
}
vec3 ribPos(float clock, out float r){
  r = mod(aSeed.x * uRibLen + clock * (7.0 + 1.6 * aSeed.y), uRibLen);
  vec3 p = ribPt(r), tn = normalize(ribPt(r + 0.6) - p + vec3(0.0, 0.0, 1e-4));
  vec3 nb = normalize(cross(tn, vec3(0.0, 1.0, 0.0)) + 1e-4), bb = cross(nb, tn);
  float th = r * 0.075, cs = cos(th), sn = sin(th), gather = smoothstep(0.0, 18.0, r);      // the band turns over slowly along its length
  float a = aSeed.z * 2.0 - 1.0, b = fract(aSeed.w * 7.3) * 2.0 - 1.0;
  vec3 off = (nb * cs + bb * sn) * (a * mix(2.8, 0.95, gather)) + (bb * cs - nb * sn) * (b * mix(1.5, 0.24, gather));
  return p + off + wander(aSeed.y * 9.0 + aSeed.z, clock * 1.1 + r * 0.05) * 0.1;
}
void main(){
  float r, r2;
  vec3 c = ribPos(uClock, r), c2 = ribPos(uClock + 0.12, r2);
  float sR = uRibS0 + r;
  float fade = smoothstep(uFront + 6.0, uFront - 28.0, sR) * smoothstep(uTail - 6.0, uTail + 30.0, sR) * smoothstep(0.0, 9.0, r) * (1.0 - smoothstep(uRibLen - 13.0, uRibLen - 1.5, r));
  vec3 fw = c2 - c; float fl = length(fw);
  fw = fl > 1e-4 && fl < 3.0 ? fw / fl : vec3(0.0, 0.0, 1.0);
  fw = normalize(fw + vec3(0.0, 0.15, 0.0));
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)) + 1e-4), up = cross(rt, fw);
  float yaw = (fract(aSeed.y * 13.7 + aSeed.z) - 0.5) * 1.2 + 0.3 * sin(uTime * 1.3 + aSeed.x * 31.0);
  float rol = (fract(aSeed.z * 9.1 + aSeed.w) - 0.5) * 1.2 + 0.3 * sin(uTime * 1.7 + aSeed.y * 23.0);
  vec3 fwY = fw * cos(yaw) + rt * sin(yaw); rt = rt * cos(yaw) - fw * sin(yaw); fw = fwY;
  vec3 rtR = rt * cos(rol) + up * sin(rol); up = up * cos(rol) - rt * sin(rol); rt = rtR;
  float ph = uTime * (46.0 + 16.0 * aSeed.z) + aSeed.x * 60.0;
  float glide = smoothstep(0.55, 0.7, fract(uTime * 0.37 + aSeed.w * 5.0 + aSeed.y));
  float ang = mix(0.15 + 1.05 * sin(ph), 0.06 + 0.34 * aSeed.z, glide);
  vec4 mc = modelViewMatrix * vec4(c, 1.0);
  float sc = max(uSize * 1.2, -mc.z * 0.0026) * (0.7 + 0.7 * fract(aSeed.w * 7.31 + aSeed.x * 3.7)) * fade * smoothstep(0.4, 3.2, -mc.z);
  float side = position.x;
  vec3 lp = fw * position.z + rt * (side * cos(ang)) + up * (abs(side) * sin(ang));
  vec4 mvPosition = modelViewMatrix * vec4(c + lp * sc, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  vBary = aBary; vSeed = aSeed.x; vFade = fade; vPx = sc / max(-mc.z * 0.0022, 1e-4);
  vec3 wv = (modelMatrix * vec4(c, 1.0)).xyz - cameraPosition;
  vBack = uGate * smoothstep(0.6, 0.95, dot(wv, uSunDir) / max(length(wv), 1e-3));      // between the eye and the sun: amber glass, as the river's own wings
  vLit = uGate * (0.55 + 0.45 * smoothstep(0.3, 0.62, mNoise(c.xz * 0.045 + vec2(1.7, -uTime * 0.36))));
  #include <fog_vertex>
}`,fragmentShader:`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uOrange, uSunCol, uAmb;
varying vec3 vBary; varying float vLit, vSeed, vFade, vPx, vBack;
${ga}
void main(){
  if (vFade < 0.01) discard;
  float white, ink = flyWing(vBary, vPx, vSeed, white);
  vec3 col = mix(uOrange * (0.8 + 0.5 * vSeed) * ink, vec3(0.75), white);
  if (!gl_FrontFacing) col = mix(col, vec3(dot(col, vec3(0.5))) * vec3(1.3, 0.9, 0.55), 0.3);
  vec3 outc = col * (uAmb * 0.7 + uSunCol * vLit * 0.45) + col * vec3(1.0, 0.74, 0.45) * (0.15 + vLit * 0.85 + vBack * 0.9) * ink;
  ${je}
  gl_FragColor = vec4(outc, 1.0);
}`});Object.assign(i.uniforms,R,{uRib:{value:p},uRibLen:{value:A},uRibS0:{value:b},uFront:B.uFront,uTail:B.uTail});const y=new a.Mesh(M,i);return y.frustumCulled=!1,y.name="wing-ribbon",y}var sr={id:"monarch-sanctuary",name:"The Orange Awakening",category:"wilderness",weirdness:.03,media:["air","tiny"],async build(o){await o.yield();const m=o.rng,p=o.noise,A=o.vary||{},b=m.fork("variation"),R=b.pick(["morning","morning","frost","afternoon"]),B=b.pick(["broken","broken","snow","still"]),M=b.chance(.5),k=A.hour==="dawn"||A.hour==="night"?"frost":A.hour==="golden"?"afternoon":A.hour==="day"?"morning":R,i=Nn[k],y=B,g=!!A.rare,w=ve(A.density??1,.7,1.3),h=i.palette,F=i.reverse,L=b.range(-.18,.18),v=b.fork("second-pass"),c=new a.Vector3(i.sunDir[0],i.sunDir[1],i.sunDir[2]).applyAxisAngle(new a.Vector3(0,1,0),L).normalize(),D=m.range(0,te),Z=m.range(5,8),I=m.range(.036,.048),z=e=>Z*Math.sin(e*I+D)*G(25,70,e)*(1-G(112,156,e)),E=e=>X(X(X(.09,.22,G(-45,10,e)),.032,G(138,176,e)),.3,G(520,600,e)),$=-600,Se=2,ye=820,Y=new Float32Array(ye+1);for(let e=1;e<=ye;e++)Y[e]=Y[e-1]-E($+(e-.5)*Se)*Se;{const e=Y[Math.round(-$/Se)];for(let t=0;t<=ye;t++)Y[t]-=e}const ae=e=>{const t=ve((e-$)/Se,0,ye-.001),n=Math.floor(t);return X(Y[n],Y[n+1],t-n)},he=(e,t)=>{const n=e-z(t),r=Math.abs(n),s=3.6*G(4,24,t)*(1-.72*G(150,185,t)),l=X(.07,.24,G(-30,40,t))*(1-.8*G(138,180,t)),u=Math.max(0,r-9),d=Math.max(0,r-44),x=l*u*u/(u+14)+G(138,180,t)*.24*d*d/(d+14),P=1.5*p.fbm2(e*.021,t*.021,3)*G(3,16,r)+.3*p.fbm2(e*.12+9,t*.12,2)*G(1,6,r);return ae(t)-s*Math.exp(-(n*n)/30)+x+P},oe=(e,t,n)=>[e,he(e,t)+n,t],Ge=(e,t)=>[z(e),he(z(e),e)+t,e],Xe=m.range(-4,4),fe=228,T=Vn([oe(-50+Xe*.5,-205,20),oe(-44.5+Xe*.5,-170,20),oe(-40+Xe*.3,-134,16.5),oe(-39,-100,10.5),oe(-38,-70,7.2),oe(-32,-47,4.8),oe(-19.5,-25,4),oe(-14.5,-12.5,4),oe(-19.5,-1,5),oe(-17.5,10,6.2),oe(-11,23,7),oe(-4,35,7.6),Ge(54,7.6),Ge(78,5.9),Ge(104,5.4),Ge(130,5.3),[0,he(0,160)+5.4,160],[0,he(0,194)+5.9,194],[0,he(0,fe)+6.7,fe]]),ie=T.nearestXZ(-32,-47).u-(i.rate<1?.02:0),wa=T.nearestXZ(-14.5,-12.5).u,Pe=T.nearestXZ(-11,23).u,Uo=e=>X(On,1.3,G(ie-.02,Pe+.05,e))-.18*G(.86,.93,e),Wt=e=>X(Uo(e),jn,G(ie-.05,ie+.015,e)*(1-G(Pe-.03,Pe+.05,e))),He=64,ct=new Float32Array(He+1);for(let e=0;e<He;e++)ct[e+1]=ct[e]+2/(ve(Wt(e/He),.35,2.5)+ve(Wt((e+1)/He),.35,2.5));const $e=e=>{const t=ve(e,0,1)*He,n=Math.min(He-1,Math.floor(t));return Ut*X(ct[n],ct[n+1],t-n)/ct[He]},qo=$e(ie),ya=$e(wa)+4.5;let ut=wa;for(;ut<1&&$e(ut)<ya;)ut+=.002;const ba=7.2/i.rate,Sa=F?e=>ya-$e(e):e=>{const t=$e(e)-qo;return t<ba?t*i.rate:7.2+(t-ba)},Wo=F?e=>1-.68*G(ut-.05,ut+.16,e):g?e=>G(ie-.012,ie+.035,e):e=>G(ie-.02,ie+.09,e),Zo=(e,t)=>Sa(T.nearestXZ(e,t).u),Aa=(e,t,n,r)=>{const s=ve(((e-n)*-n+(t-r)*-r)/(n*n+r*r),0,1);return Math.hypot(e-n*(1-s),t-r*(1-s))},Ke=T.posAtDist(0),ka=(e,t)=>Math.min(Aa(e,t,-39,-104),Aa(e,t,Ke.x,Ke.z)*1.3,Math.hypot(e-Ke.x,t-Ke.z)*.45);await o.yield();const U=new a.Scene,xa=O(i.fog);U.fog=new a.FogExp2(xa,i.fogDensity*.76*(y==="still"?1.25:y==="snow"?1.1:1)),U.background=xa.clone();const Ye=_n.makeSky({rng:m,preset:"overcast",zenith:i.zenith,mid:i.mid,horizon:i.horizon,ground:i.fog,horizonPow:2.2,fogColor:i.fog,sunDirection:c,sunColor:h[5],sunIntensity:7,sunGlow:.5,veil:.9,scatterColor:h[5],scatter:.25,clouds:{coverage:i.cover[0],softness:.5,lit:"#d3d6d4",shade:"#727d88",absorb:1.6,silver:.6,scale:1.15,detail:.7,wind:y==="still"?[.008,.002]:[.05,.012]},clouds2:{coverage:.9,softness:.6,scale:.5,stretch:.25,opacity:1,lit:"#c2c8ca",shade:"#8b949c",wind:[.02,.005]}});U.add(Ye.object),await o.yield();const Ma=new a.HemisphereLight(O(i.hemiSky),O(i.hemiGround),i.hemi[0]),xt=new a.DirectionalLight(O(h[5]),i.sun[0]);xt.position.copy(c).multiplyScalar(200),U.add(Ma,xt,xt.target),await o.yield();const Eo=O("#6b6053"),Xo=O("#82766a"),Ho=O("#6a7068"),$o=O("#8c8172"),Ko=O("#8f8a75"),Yo=O("#9d9a87"),Qo=O("#33342f"),Jo=O("#c6ced6"),en=O("#6f7a62"),tn=O("#4f463c"),za=(e,t,n)=>{const r=e-z(t),s=Math.abs(r),l=p.fbm2(e*.05,t*.05,3),u=p.n2(e*.31,t*.31),d=p.fbm2(e*.17+31,t*.17,2);n.copy(Eo).lerp(Xo,ve(.5+u*.5,0,1)).lerp(Ho,G(.05,.45,l)*.7),n.lerp(en,.75*G(.12,.42,d)).lerp(tn,.6*G(.15,.5,-d));const x=G(140,176,t)*(1-G(38,50,s+6*l));return n.lerp(Ko,x).lerp(Yo,x*ve(.5+.5*u,0,1)),n.lerp($o,.8*G(1.4,.6,Math.abs(r-7.5-1.2*Math.sin(t*.09)))*G(14,26,t)),n.lerp(Qo,.88*G(4.4,2.1,s)*G(4,20,t)),i.rime&&n.lerp(Jo,.4*G(-.2,.5,u+l)),n},Ae=await Io.makeTerrainAsync({rng:m.fork("terrain"),noise:p,path:T,height:he,corridor:{clearance:3.2,width:9},margin:205,cell:3,near:30,levels:4,maxTriangles:46e3,biome:"meadow",sunDir:c,skirt:30,palette:{rock:"#6f6a62",rockB:"#5c5852",clouds:.6,cloudSize:38,cloudSpeed:8,tufts:.3,patchAmount:0,altAmount:0,pebbles:.45},color:(e,t,n,r,s)=>za(e,t,s)},o.yield);U.add(Ae.object);const j=(e,t)=>Ae.heightAt(e,t),Ca=Ae.uniforms&&Ae.uniforms.uTCloud?Ae.uniforms.uTCloud.value:null;await o.yield();const Me=j(0,0)-.4,an=[[9,13],[40,8.5],[70,6.2],[100,5.6],[130,5.5],[160,5.6],[196,6.2],[fe+9,6.9]].map(([e,t])=>new a.Vector3(z(e)*.85,j(z(e),e)+t-Me,e)),Ne=new a.CatmullRomCurve3(an,!1,"centripetal").getSpacedPoints(7);let ge=0;for(let e=1;e<8;e++)ge+=Ne[e].distanceTo(Ne[e-1]);const se=await Gn(o,{palette:h,sunDir:[c.x,c.y,c.z],riverPoints:Ne,slope:Math.atan(.2),flyers:Math.round(ve(17e3*w,13e3,19500)*(F?.75:1)),fill:.55,afterLight:.6,shaftGain:.13,burst:.7}),Ue=new a.Group;Ue.position.set(0,Me,0),Ue.add(se.object),U.add(Ue);const Mt=se.height;se.uniforms.uSize.value=.125,se.uniforms.uRime.value=i.rime,await o.yield();const Q={uClock:{value:-10},uTime:{value:0},uGate:{value:0},uRime:{value:i.rime},uOrange:{value:O(h[6])},uWing:{value:O(h[4])},uAmb:{value:O(h[0]).multiplyScalar(.62)},uSunCol:{value:O(h[5]).multiplyScalar(2.2)},uRiver:{value:Ne},uRiverLen:{value:ge},uSize:{value:.095},uSunDir:{value:c.clone()}},Fa={value:400},Pa={value:0},Ta=new a.Vector2,Qe=33,Ra=7.4,on=(se.yTop-Qe)/7.5,zt=m.fork("firs"),ke=o.quality?.detail??1,Ba=[];for(let e=0;e<6;e++)Ba.push(await In(o,{rng:zt,lod:1+(e>>1),height:Qe*(e%2?.95:1),limbMax:Ra*(e%2?.92:1),palette:se.palette})),await o.yield();await o.yield();const nn=se.makeMaterial();await o.yield();const Te=re.makeWind({direction:[.9,.3],strength:y==="still"?.45:1});await o.yield();const Da={wind:Te,backlight:.4,backlightTint:"#cfd6c0",ambient:1.6,leafAmbient:1.5,emissive:"#222c28",emissiveIntensity:1.2};await re.prepareLeafTexture(Da,o.yield),await o.yield();const ze=re.windMaterial(Da);await o.yield();const La=i.rime?.5:y==="snow"?.22:0,rn={leaf:"#33483e",leafLight:"#6a8072",leafDark:"#22332b",bark:h[3],barkDark:"#2b2520",snow:La,snowColor:"#d2d9e0"},sn={leaf:"#665c50",leafLight:h[4],leafDark:"#40382f",bark:h[3],barkDark:"#2b2520",snow:La,snowColor:"#d2d9e0"},Va=re.coniferGeometry({rng:zt,height:Qe,detail:0,droop:1.1,...rn});await o.yield();const _a=re.coniferGeometry({rng:zt,height:Qe,detail:0,droop:1.3,...sn});await o.yield();const Je=[],de=m.fork("drapes"),Zt=(e,t,n)=>Je.some(r=>Math.hypot(r.x-e,r.z-t)<n)||Math.hypot(e,t)<27,Ct=(e,t,n,r)=>{const s=T.nearestXZ(e,t),l={x:e,z:t,y:j(e,t)-.3,s:de.range(.88,1.04),v:r,rot:de.range(0,te),d:s.dist,u:s.u,kind:n,tIgn:1e5,s0:-1};return Je.push(l),l},dt=[];for(let e=0;e<4;e++){const t=e?22+e*13+de.range(-1.5,1.5):28,n=e%2?-1:1,r=T.posAtDist(t),s=T.tangentAtDist(t),l=1.9,u=-s.z,d=s.x,x=e?10.8:11.4,P=r.x+u*n*x,V=r.z+d*n*x,C=Ct(P,V,"host",e%2);if(C.s=1.04,e){dt.push({from:new a.Vector3(P,r.y+2.4,V),tip:new a.Vector3(r.x+u*n*l+s.x*2,r.y-.9,r.z+d*n*l+s.z*2)});continue}const S=[new a.Vector3(P,r.y+2.2,V)];for(const[f,_,q]of[[24.8,5.6,1.3],[22,2.3,.3],[19.6,.8,-.3],[17.4,.4,-.42],[15,.31,-.43],[12.5,.29,-.43],[10,.29,-.43],[7.5,.3,-.45],[5.2,.34,-.52],[3.2,.42,-.68]]){const N=T.posAtDist(f),W=T.tangentAtDist(f);S.push(new a.Vector3(N.x-W.z*n*_,N.y+q,N.z+W.x*n*_))}dt.push({pts:S})}await o.yield();for(let e=0;e<14;e++){(e&3)===3&&await o.yield();const t=30+e*9.6+de.range(-2.5,2.5);for(const n of e%2?[1,-1]:[-1,1]){const r=z(t)+n*de.range(19.5,25);if(!(T.nearestXZ(r,t).dist<19||Zt(r,t,9.5))){Ct(r,t,"gully",e%2);break}}}const pe=(e,t,n,r)=>{const s=T.posAtDist(e),l=T.tangentAtDist(e),u=s.x-l.z*t*n,d=s.z+l.x*t*n;return T.nearestXZ(u,d).dist<Math.min(n,12)-.6||Zt(u,d,n<13?8:9.5)||ka(u,d)<(n<13?7.2:8)?!1:(Ct(u,d,"upper",r),!0)};await o.yield(),pe(94,1,8.7,1),pe(120,-1,8.6,0),pe(66,1,12.4,0),pe(72,-1,11.2,1),pe(101,-1,12.8,1),await o.yield(),pe(137,1,10.4,0),pe(144,-1,12.6,1),pe(160,-1,11,0),pe(166,1,12.2,1),await o.yield(),pe(84,-1,11.6,0),pe(108,1,11.8,1),pe(128,-1,12,1),pe(150,1,12.5,0);for(let e=0,t=0;e<11&&t<300;t++)(t&3)===3&&await o.yield(),pe(de.range(20,200),de.sign(),de.range(13,27),e%2)&&e++;if(g)for(let e=0,t=0;e<7&&t<100;t++){const n=de.range(165,262),r=de.sign()*de.range(45,54);Zt(r,n,9.5)||(Ct(r,n,"meadow",e%2),e++)}await o.yield();const Et=new a.Vector3;for(const e of Je){const t=Zo(e.x,e.z);if(g?e.tIgn=F?4.5+de.range(0,3):de.range(.2,3):e.kind==="gully"&&(e.tIgn=F?t+de.range(-1.5,5):Math.max(t-de.range(3,7),1+de())),e.kind==="gully"||e.kind==="meadow"){let n=1e9;for(let r=0;r<ge;r+=2){kt(Ne,ge,r,Et);const s=Math.hypot(Et.x-e.x,Et.z-e.z);s<n&&(n=s,e.s0=r)}}}const Xt=e=>e<-122?4:e<-45?0:e<70?1:e<150?2:3,ft=Je.map(e=>({x:e.x,y:e.y,z:e.z,s:e.s,rot:e.rot,t0:e.tIgn<1e4?e.tIgn-on:1e5,coat:1,geo:(e.kind==="meadow"||e.kind==="upper"&&e.d>17?2:0)+e.v%2,chunk:Xt(e.z)}));await o.yield();const ln=(e,t)=>{const n=Math.abs(e-z(t));if(Math.hypot(e,t)<25||t>2&&n<12||ka(e,t)<7.5||t>150&&n<42+7*p.n2(e*.05,t*.05))return 0;for(const r of Je)if(Math.hypot(r.x-e,r.z-t)<9.5)return 0;return 1},Ga=(e,t,n,r,s,l)=>re.scatterPoints({rng:m.fork(e),path:T,heightAt:j,count:Math.round(t*Math.min(w,1.05)),radius:n,corridor:r,spacing:s,scale:[.8,1.12],falloff:l,density:(u,d)=>ln(u,d)});await o.yield();const Ia=[];Ga("forest",105,64,11,7,0).forEach((e,t)=>Math.hypot(e.x-Ke.x,e.z-Ke.z)<31&&e.z>Ke.z-6||ft.push({x:e.x,y:e.y-.3,z:e.z,s:e.s,rot:e.rot,t0:1e5,coat:p.n2(e.x*.03+5,e.z*.03)>-.3?1:.3,geo:(e.d<31?2:4)+t%2,chunk:Xt(e.z)})),await o.yield(),Ga("forest2",150,180,64,6.2,.35).forEach((e,t)=>{e.d<92&&ke>.9?ft.push({x:e.x,y:e.y-.3,z:e.z,s:e.s,rot:e.rot,t0:1e5,coat:p.n2(e.x*.03+5,e.z*.03)>-.3?1:.3,geo:4+t%2,chunk:Xt(e.z)}):Ia.push(e)}),await o.yield(),re.scatterPoints({rng:m.fork("behind"),bounds:[-120,fe+4,120,fe+76],count:Math.round(26*w),heightAt:j,spacing:7,scale:[.8,1.12],density:(e,t)=>Math.abs(e-z(t))>44+9*p.n2(e*.04,t*.04)?1:0}).forEach((e,t)=>ft.push({x:e.x,y:e.y-.3,z:e.z,s:e.s,rot:e.rot,t0:1e5,coat:t%3?1:.3,geo:4+t%2,chunk:3})),await o.yield();const it=new a.Group;it.name="draped-firs",U.add(it);const Oa=[],et=v.fork("boughwings"),Re=new a.Vector3,Be=new a.Vector3,ja=new a.Matrix3;{const e=Je.map((t,n)=>({d:t,i:n})).filter(t=>t.d.kind!=="gully"&&t.d.z>-182&&t.d.z<-50).sort((t,n)=>t.d.d-n.d.d).slice(0,5);for(const t of e){const n=T.pointAt(t.d.u);ft[t.i].wing=[n.x-t.d.x,n.z-t.d.z]}}const cn=(e,t,n)=>{const r=e.attributes.position.array,s=e.attributes.normal.array,l=e.attributes.aInfo.array,u=e.attributes.uv.array,d=e.index.array,x=d.length/3;ja.getNormalMatrix(t);const P=Math.round(240*w);for(let V=0,C=0;V<P&&C<P*60;C++){const S=et.int(0,x-1)*3,f=d[S],_=d[S+1],q=d[S+2];if(l[f*4]!==1)continue;let N=et(),W=et();N+W>1&&(N=1-N,W=1-W);const ce=1-N-W,J=(be,K,me)=>be[f*K+me]*ce+be[_*K+me]*N+be[q*K+me]*W;if(Math.abs(J(u,2,1))>.42||J(u,2,0)<.3||(Re.set(J(r,3,0),J(r,3,1),J(r,3,2)),Re.y<3.5||Re.y>22)||(Be.set(J(s,3,0),J(s,3,1),J(s,3,2)),Be.y<0&&Be.negate(),Re.applyMatrix4(t),Be.applyMatrix3(ja).normalize(),(Re.x-n.x)*n.wing[0]+(Re.z-n.z)*n.wing[1]<0))continue;const ee=et.range(0,te);Oa.push({p:[Re.x+Be.x*.05,Re.y+Be.y*.05,Re.z+Be.z*.05],up:[Be.x,Be.y,Be.z],fw:[Math.cos(ee),0,Math.sin(ee)],size:et.range(.17,.24),phase:0,mode:et()<.45?2:0,rnd:et()}),V++}};{const e=new a.Object3D,t=new Map,n=m.fork("inst");for(const r of ft){const s=r.geo*8+r.chunk;t.has(s)||t.set(s,[]),t.get(s).push(r)}for(const[r,s]of t){const l=Ba[Math.floor(r/8)],u=new a.BufferGeometry;for(const P in l.attributes)u.setAttribute(P,l.attributes[P]);u.setIndex(l.index),u.boundingSphere=l.boundingSphere.clone();const d=new Float32Array(s.length*3),x=new a.InstancedMesh(u,nn,s.length);s.forEach((P,V)=>{e.position.set(P.x,P.y,P.z),e.rotation.set(n.range(-.02,.02),P.rot,n.range(-.02,.02)),e.scale.setScalar(P.s),e.updateMatrix(),x.setMatrixAt(V,e.matrix),d.set([P.t0,P.coat,n()],V*3),P.wing&&cn(l,e.matrix,P)}),u.setAttribute("aInst",new a.InstancedBufferAttribute(d,3)),x.instanceMatrix.needsUpdate=!0,x.computeBoundingSphere(),x.userData.chunk=r%8,it.add(x)}}await o.yield();const Na=re.makeScatter({rng:m.fork("far"),points:Ia,path:T,heightAt:j,material:ze,variants:[Va,_a],stretch:0,tilt:.02,tint:.12,hue:.02,chunks:3,cullDistance:300});U.add(Na.object),await o.yield();const Ua=re.makeScatter({rng:m.fork("beyond"),bounds:[-170,fe+76,170,420],count:Math.round(50*w),heightAt:j,material:ze,variants:[Va,_a],spacing:6,scale:[.86,1.2],tint:.12,hue:.02,tilt:.02,density:(e,t)=>Math.abs(e-z(t))>44+9*p.n2(e*.04,t*.04)-G(300,400,t)*30?1:0});U.add(Ua.object),await o.yield();const mt=[[-34,-132,6,23],[-29,-80,2,13],[-30,-40,2,12]],st=[],Ht=[],le=m.fork("cards");{const e=v.fork("early"),t=26,n=ie*T.length+22,r=Math.round(1400*w);for(let s=0;s<r;s++)if(s<r*.7){const l=mt[s%3],u=e.range(l[2],l[3]),d=u/Math.max(c.y,.3),x=l[0]+c.x*d+e.range(-3,3),P=l[1]+c.z*d+e.range(-3,3);st.push({p:[x,j(l[0],l[1])+u-2-Me,P],t:-900-e()*200,s:-2,seed:[e(),e(),e(),e()]})}else{const l=X(t,n,Math.pow(e(),.8)),u=T.posAtDist(l),d=T.tangentAtDist(l),x=e.sign()*e.range(2,9);st.push({p:[u.x-d.z*x,u.y-Me+e.range(-5,1.5),u.z+d.x*x],t:-900-e()*200,s:-1,seed:[e(),e(),e(),e()]})}}const qa=st.length,Wa=e=>X(Ra*.8,.7,ve((e-5.5)/(Qe-5.5),0,1)),ht=Je.filter(e=>e.tIgn<1e4),Za=ht.length?Math.round(10500*Math.min(w,1.1)*(F?.72:1)/ht.length):0,un=ht.length?Math.round(15e3*w*ke/ht.length):0;for(const e of ht){await o.yield();for(let t=0;t<Za+un;t++){(t&255)===255&&await o.yield();const n=X(6,Qe*.92,Math.pow(le(),.8)),r=le.range(0,te),s=Wa(n)*le.range(.45,1)*e.s,l={p:[e.x+Math.cos(r)*s,e.y-Me+n*e.s,e.z+Math.sin(r)*s],t:e.tIgn+(Qe-n)/7.5+.5+le()*.9,s:e.s0,seed:[le(),le(),le(),le()]};(t<Za?st:Ht).push(l)}}await o.yield();for(let e=0,t=Math.round(19e3*w*ke);e<t;e++){(e&255)===0&&await o.yield();const n=X(8,Mt*.95,Math.pow(le(),.8)),r=le.range(0,te),s=X(10,1,ve((n-8)/(Mt-8),0,1))*le.range(.4,1);Ht.push({p:[Math.cos(r)*s,n,Math.sin(r)*s],t:(se.yTop-n)/7.5+.6+le()*1.2+Math.pow(le(),3)*9,s:le()*70,seed:[le(),le(),le(),le()]})}await o.yield();const Ea=await No(st,Q,o.yield);await o.yield();const dn=await Xn(Ht,Q,Fa,o.yield);Ue.add(Ea,dn),await o.yield();const qe=[],ue=m.fork("wings"),Xa={P:[],N:[],C:[],I:[]},Ft=O("#85786a");for(const e of dt)En(Xa,qe,ue,e,Ft,.13,e.pts?.3:.42),await o.yield();await o.yield();for(const e of qe)(e.up[1]>0?e.rnd<.17:e.rnd<.035)&&(e.mode=2);await o.yield();const Ha=[];for(const e of dt){const t=await qt(qe.slice(e.w0,e.w1),Q,o.yield),n=new a.Box3;for(let r=e.w0;r<e.w1;r++)n.expandByPoint(Re.fromArray(qe[r].p));t.geometry.boundingSphere=n.getBoundingSphere(new a.Sphere),t.geometry.boundingSphere.radius+=1.5,t.frustumCulled=!0,Ha.push(t),U.add(t)}qe.length=0;for(const e of Oa)qe.push(e);const fn=qe.length,gt=[],Pt=T.end.clone(),Tt=7.8,$t=.42,mn=Math.round(2400*w);for(let e=0;e<mn;e++){(e&255)===255&&await o.yield();const t=ue.range(0,te),n=ue.range(-.25,1.25)*Math.PI,r=Tt+($t+.02)*Math.cos(n),s=ue.range(0,te),l=[Pt.x+Math.cos(t)*r,Pt.y+Math.sin(t)*r,Pt.z-($t+.02)*Math.sin(n)];l[1]<j(l[0],l[2])+.15||gt.push({p:l,up:[Math.cos(t)*Math.cos(n),Math.sin(t)*Math.cos(n),-Math.sin(n)],fw:[Math.cos(s),Math.sin(s),.3],size:ue.range(.17,.24),phase:t*3,mode:1,rnd:ue()})}await o.yield();for(let e=0;e<34;e++){const t=ue.range(28,175),n=ue.sign(),r=z(t)+n*(ue.range(1.5,2.2)+.85);for(let s=0;s<13;s++){const l=r+ue.gauss()*.3,u=t+ue.gauss()*.45,d=ue.range(0,te);gt.push({p:[l,j(l,u)+.05,u],up:[ue.range(-.15,.15),1,ue.range(-.15,.15)],fw:[Math.cos(d),0,Math.sin(d)],size:ue.range(.08,.1),phase:ue.range(0,50),mode:1,rnd:ue()})}}await o.yield();{const e=v.fork("puddle");for(const[t,n]of[[76,1],[103,-1],[133,1]]){const r=t+e.range(-3,3);for(let s=0;s<160;s++){const l=r+e.gauss()*1.5,u=z(l)+n*(2.75+Math.abs(e.gauss())*.5),d=e.range(0,te);gt.push({p:[u,j(u,l)+.06,l],up:[e.range(-.12,.12),1,e.range(-.12,.12)],fw:[Math.cos(d),0,Math.sin(d)],size:e.range(.13,.18),phase:l*2.2+e.range(0,1.5),mode:1,rnd:e()})}}}await o.yield();const $a=await qt(qe,Q,o.yield);await o.yield();const Kt=await qt(gt,Q,o.yield);U.add($a,Kt);const Rt=new a.MeshLambertMaterial({vertexColors:!0}),hn=va(Xa,Rt);U.add(hn),await o.yield();{const e=o.core.makeRng(o.core.hashSeed("bough-needles:"+o.seed));for(const t of dt)U.add(ar([t],e,Q)),await o.yield()}await o.yield();const Yt=new a.TorusGeometry(Tt,$t,7,64);{const e=Yt.getAttribute("position"),t=new Float32Array(e.count*3);for(let n=0;n<e.count;n++){const r=.7+.5*p.n2(n*.37,1.5);t[n*3]=Ft.r*r,t[n*3+1]=Ft.g*r,t[n*3+2]=Ft.b*r}Yt.setAttribute("color",new a.BufferAttribute(t,3))}const Ka=new a.Mesh(Yt,Rt);Ka.position.copy(Pt),U.add(Ka),await o.yield();const Ya=Io.makeHorizonRidges({rng:m.fork("ridges"),layers:2,radius:[900,2100],height:[150,340],base:-240,segments:200,jagged:.45,coverage:.85,colorNear:"#74859a",fog:U.fog,fogScale:.06,sunDir:c,sunColor:h[5],sunIntensity:.5,rim:.2,hazeNear:.42,hazeFar:.72,footHaze:.9});U.add(Ya.object),await o.yield();const gn=new a.Color,tt=(e,t)=>za(e,t,gn),Qt=["#e9e6dc","#d9d4be","#c8c2d2","#dcdcd8"],pt=e=>re.fernGeometry({rng:zt,size:e,detail:0,leaf:"#868a78",leafLight:"#a8ac98",leafDark:"#5a5f54"});await o.yield();const Qa=re.makeFerns({rng:m.fork("ferns"),path:T,uRange:[.12,.86],heightAt:j,wind:Te,map:ze.map,count:Math.round(560*w*ke),radius:22,chunks:4,scale:[.55,1.25],variants:[pt(.8),pt(1.3),pt(1)],density:(e,t)=>(t<150?1:.15)*(Math.abs(e-z(t))>2.7||t<8?1:0),tint:.1,hue:0,materialOptions:{fade:[55,80],detail:0,ambient:1.5,leafAmbient:1.5,backlight:.3,backlightTint:"#d6d8c8"}});await o.yield();const Ja=await re.makeGrassAsync({rng:m.fork("grass"),bounds:[-46,146,46,300],count:Math.round(9e3*w),heightAt:j,wind:Te,map:ze.map,groundColor:tt,height:[.45,.95],flowers:.06,flowerColors:Qt,fade:[85,115],density:(e,t)=>G(146,160,t)*(1-G(40,46,Math.abs(e)))*(Math.abs(e-z(t))>3?1:0)},o.yield),eo=await re.makeGrassAsync({rng:m.fork("grass2"),bounds:[-46,150,46,290],count:Math.round(3200*w*ke),heightAt:j,wind:Te,map:ze.map,groundColor:tt,height:[.95,1.6],width:[.8,1.3],flowers:0,fade:[70,100],density:(e,t)=>G(150,164,t)*(1-G(38,46,Math.abs(e)))*(Math.abs(e-z(t))>3.2?1:0)*G(-.05,.3,p.fbm2(e*.07+40,t*.07,2))},o.yield),to=re.makeFlowers({rng:m.fork("milkweed"),bounds:[-40,152,40,fe+40],count:Math.round(190*w),heightAt:j,wind:Te,map:ze.map,colors:Qt,groundColor:tt,chunks:2,scale:[1.7,2.8],density:(e,t)=>Math.abs(e-z(t))>3?1:0});await o.yield(),await o.yield();const ao=re.makeFlowers({rng:m.fork("flowers"),path:T,uRange:[.5,.88],radius:13,corridor:0,count:Math.round(260*w),heightAt:j,wind:Te,map:ze.map,colors:Qt,groundColor:tt,chunks:2,density:(e,t)=>Math.abs(e-z(t))>2.9?1:0}),oo=await re.makeGrassAsync({rng:m.fork("floor"),path:T,uRange:[.08,.8],radius:17,bias:1.5,count:Math.round(5600*Math.min(w,1.1)*ke),heightAt:j,wind:Te,map:ze.map,groundColor:tt,height:[.3,.75],width:[.7,1.3],rootGain:1.5,flowers:0,fade:[42,60],chunks:4,density:(e,t)=>t>6&&Math.abs(e-z(t))<2.7?0:.35+.65*G(-.1,.3,p.fbm2(e*.11,t*.11,2))},o.yield),no=await re.makeGrassAsync({rng:m.fork("bank"),path:T,uRange:[Pe+.02,.9],radius:4.8,bias:1,count:Math.round(2600*ke),heightAt:j,wind:Te,map:ze.map,groundColor:tt,height:[.4,.85],width:[.8,1.4],rootGain:1.4,flowers:0,fade:[45,62],chunks:3,density:(e,t)=>{const n=Math.abs(e-z(t));return n>2.05&&n<3.8?1:0}},o.yield);await o.yield();const ro=re.makeFerns({rng:v.fork("ferns2"),path:T,uRange:[ie-.06,Pe+.02],heightAt:j,wind:Te,map:ze.map,count:Math.round(250*w*ke),radius:26,chunks:2,scale:[.7,1.5],variants:[pt(1),pt(1.4)],density:(e,t)=>(Math.abs(e-z(t))>2.7||t<8?1:0)*(Math.hypot(e,t)>2.5?1:0),tint:.1,hue:0,materialOptions:{fade:[55,80],detail:0,ambient:1.5,leafAmbient:1.5,backlight:.3,backlightTint:"#d6d8c8"}});await o.yield();const io=await re.makeGrassAsync({rng:v.fork("floor2"),path:T,uRange:[ie-.06,Pe+.02],radius:24,bias:1.2,count:Math.round(2200*Math.min(w,1.1)*ke),heightAt:j,wind:Te,map:ze.map,groundColor:tt,height:[.35,.9],width:[.7,1.3],rootGain:1.5,flowers:0,fade:[44,62],chunks:2,density:(e,t)=>t>6&&Math.abs(e-z(t))<2.7?0:.4+.6*G(-.2,.25,p.fbm2(e*.09+7,t*.09,2))},o.yield);U.add(Qa.object,Ja.object,ao.object,oo.object,eo.object,to.object,no.object,ro.object,io.object),await o.yield(),await o.yield();const so=e=>.28+.24*(1-G(140,178,e)),lo=[];for(let e=9;e<=420;e+=11)lo.push([z(e),j(z(e),e)+so(e),e]);const at=Oo.makeRiver({rng:m.fork("stream"),points:lo,width:e=>4.7+1.1*Math.sin(e*61)+.7*Math.sin(e*157+1),speed:1.9,light:Oo.waterLight(Ye,{zenith:"#38423f",mid:"#4a5551",horizon:"#66716c"}),deep:"#252d2a",shallow:"#4c5852",foamColor:"#aab2b2",wetColor:"#2e2c28",opacity:.62,foam:.14,bankFoam:.45,bankFade:1.5});U.add(at.object),await o.yield();const co=Zn(z,(e,t)=>j(e,t)+so(t)-.27,12,fe+20,Q);U.add(co);{const e=m.fork("stones"),t=[],n=O("#8a8c84"),r=O("#7c776d"),s=O("#64705c"),l=O(h[3]).multiplyScalar(1.2),u=(S,f,_,q,N,W,ce,J)=>t.push({x:S,y:j(S,f)+q*J,z:f,sx:_,sy:q,sz:N,c:W.clone().multiplyScalar(ce),ry:e.range(0,te),rx:e.range(-.3,.3)});for(let S=12;S<204;S+=e.range(3.8,6))for(const f of[-1,1]){const _=z(S)+f*e.range(1.25,2.3),q=e.range(.3,.85);u(_,S,q*e.range(.9,1.4),q*e.range(.5,.8),q,n,e.range(.7,1.15),.25);for(let N=0;N<3;N++){const W=e.range(.08,.22);u(_+e.gauss()*.7,S+e.gauss()*1.1,W*1.3,W*.6,W,e.chance(.5)?n:r,e.range(.8,1.3),.3)}}await o.yield();const d=T.length*.1,x=T.length*.84;for(let S=0;S<620;S++){const f=e.range(d,x),_=T.posAtDist(f),q=T.tangentAtDist(f),N=e.sign()*e.range(1.5,20),W=_.x-q.z*N,ce=_.z+q.x*N,J=e();if(!(ce>6&&Math.abs(W-z(ce))<2.6))if(J<.4){const ee=e.range(.1,.42);u(W,ce,ee*e.range(.9,1.5),ee*.6,ee,r,e.range(.6,1),.2)}else if(J<.55){const ee=e.range(.2,.5);u(W,ce,ee*1.3,ee*.45,ee,s,e.range(.7,1),.15)}else u(W,ce,e.range(.5,1.3),.035,.035,l,e.range(.7,1.2),1)}for(let S=11;S<206;S+=e.range(2.1,3.1)){const f=e.sign(),_=z(S)+f*e.range(.95,1.6),q=e.range(.22,.6);u(_,S,q*e.range(.9,1.5),q*e.range(.45,.75),q*e.range(.8,1.2),e.chance(.7)?n:s,e.range(.65,1.1),.2)}await o.yield();const P=new a.IcosahedronGeometry(1,0),V=new a.InstancedMesh(P,new a.MeshLambertMaterial({flatShading:!0}),t.length),C=new a.Object3D;t.forEach((S,f)=>{C.position.set(S.x,S.y,S.z),C.rotation.set(S.rx,S.ry,0),C.scale.set(S.sx,S.sy,S.sz),C.updateMatrix(),V.setMatrixAt(f,C.matrix),V.setColorAt(f,S.c)}),V.instanceMatrix.needsUpdate=!0,V.instanceColor.needsUpdate=!0,V.frustumCulled=!1,V.name="stones-litter",U.add(V)}await o.yield();const ot=Un(Ne,ge,(e,t)=>j(e,t)-Me,Q);Ue.add(ot),await o.yield();const Bt=[];{const e={},t=new a.Vector3,n=Math.round(at.length/1.5);for(let r=0;r<=n;r++){(r&15)===15&&await o.yield(),at.sampleAt(r/n,e);const s=e.position.clone(),l=Math.hypot(e.tangent.x,e.tangent.z)||1,u=-e.tangent.z/l,d=e.tangent.x/l;if(s.z>fe+80)break;s.y+=.06;const x=C=>{let S=.25;for(;S<3.8&&Ae.surfaceAt(s.x+u*C*S,s.z+d*C*S)<s.y;)S+=.25;return S};let P=ge,V=1e9;for(let C=0;C<=ge;C+=2){kt(Ne,ge,C,t);const S=Math.hypot(t.x-s.x,t.z-s.z);S<V&&(V=S,P=C)}Bt.push({c:s,nx:u,nz:d,s:P,wl:x(-1),wr:x(1)})}}const pn=Jn(Bt,Q,ot.material.uniforms,O(i.horizon).multiplyScalar(.95),O(i.mid).multiplyScalar(.8));U.add(pn),await o.yield();const H=o.core.makeRng(o.core.hashSeed("gravel-bars:"+o.seed)),uo=[],fo=[],mo=[],vn=O("#a8a498"),wn=O("#77786f"),ho=40;for(let e=4;e<Bt.length-4;e+=Math.round(H.range(3.5,6.5))){const t=Bt[e],n=H.sign(),r=n<0?t.wl:t.wr,s=H.range(2.2,4.2),l=Math.floor(t.s/ho);for(let P=0;P<46;P++){const V=H.gauss()*s*.5,C=r-.25+Math.abs(H.gauss())*.95,S=P<3?H.range(.24,.5):H.range(.06,.2),f=t.c.x+t.nx*n*C+t.nz*V,_=t.c.z+t.nz*n*C-t.nx*V;uo.push({ch:l,x:f,z:_,q:S,sy:H.range(.35,.6),ry:H.range(0,te),c:(C<r+.2?wn:vn).clone().multiplyScalar(H.range(.8,1.18))})}const u=t.c.x+t.nx*n*(r+.45),d=t.c.z+t.nz*n*(r+.45),x=3+t.s/11;for(let P=0;P<44;P++){const V=u+H.gauss()*.35+t.nz*H.gauss()*.9,C=d+H.gauss()*.35-t.nx*H.gauss()*.9,S=H.range(0,te),f=Ae.surfaceAt(V,C);fo.push({ch:l,p:[V,f+.06,C],up:[H.range(-.12,.12),1,H.range(-.12,.12)],fw:[Math.cos(S),0,Math.sin(S)],size:H.range(.12,.17),phase:C*2.2+H.range(0,1.5),mode:1,rnd:H()}),P<26&&mo.push({p:[V,f+.1-Me,C],t:x+H.range(-.6,2.2),s:t.s,seed:[H(),H(),H(),H()]})}}await o.yield();const Jt=new a.BufferGeometry;Jt.setAttribute("position",new a.Float32BufferAttribute([0,1,0,0,0,1,1,0,0,0,1,0,1,0,0,0,0,-1,0,1,0,0,0,-1,-1,0,0,0,1,0,-1,0,0,0,0,1],3)),Jt.computeVertexNormals();const go=[];for(let e=0;e<=Math.floor(ge/ho)+3;e++){const t=uo.filter(d=>d.ch===e),n=fo.filter(d=>d.ch===e);if(!t.length)continue;const r=new a.InstancedMesh(Jt,new a.MeshLambertMaterial({flatShading:!0}),t.length),s=new a.Object3D,l=new a.Box3;t.forEach((d,x)=>{s.position.set(d.x,Ae.surfaceAt(d.x,d.z)-d.q*d.sy*.25,d.z),s.rotation.set(0,d.ry,0),s.scale.set(d.q*1.4,d.q*d.sy*1.6,d.q),s.updateMatrix(),r.setMatrixAt(x,s.matrix),r.setColorAt(x,d.c)}),r.instanceMatrix.needsUpdate=!0,r.instanceColor.needsUpdate=!0,r.computeBoundingSphere(),r.name="gravel-bars",U.add(r),await o.yield();const u=await qt(n,Q,o.yield);for(const d of n)l.expandByPoint(s.position.fromArray(d.p));u.geometry.boundingSphere=l.getBoundingSphere(new a.Sphere),u.geometry.boundingSphere.radius+=1.5,u.frustumCulled=!0,u.name="bar-drinkers",go.push(u),U.add(u),await o.yield()}const ea=await No(mo,Q,o.yield);ea.name="bar-lifters",Ue.add(ea);const po=o.core.makeRng(o.core.hashSeed("wing-ribbon:"+o.seed)),vo=po.sign(),Dt=78,wo=13,vt=[],ta=T.end;[[0,0],[2.5,2],[5,4.5],[6.5,6]].forEach(([e,t],n)=>{const r=kt(Ne,ge,ge-Dt+n*wo,new a.Vector3);r.x+=vo*e,r.y+=t,vt.push(r)}),[[5,4.5],[Tt/3,Tt*.28],[1,1],[0,0]].forEach(([e,t],n)=>vt.push(new a.Vector3(ta.x+vo*e,ta.y-Me+t,ta.z+(n-1)*wo)));let aa=0;for(let e=1;e<8;e++)aa+=vt[e].distanceTo(vt[e-1]);const yo=or(Math.round(5e3*Math.min(w,1.1)),po,vt,aa,ge-Dt,Q,ot.material.uniforms);Ue.add(yo),await o.yield(),await o.yield();const bo=await qn((e,t)=>j(e,t)-Me,c,Q,o.yield);Ue.add(bo),await o.yield();const oa={P:[],N:[],C:[],I:[]},yn=O("#6f675d"),bn=O("#9c968a");let na=null;for(let e=26;e<=172;e+=4.2){const t=z(e)+9.1+1.2*Math.sin(e*.09),n=j(t,e),r=new a.Vector3(t,n+1,e);if(lt(oa,[new a.Vector3(t,n-.2,e),new a.Vector3(t+.02,n+1.08,e)],.055,.045,5,yn),na){const s=[];for(let l=0;l<=5;l++){const u=l/5;s.push(new a.Vector3().lerpVectors(na,r,u).add(new a.Vector3(0,-.5*u*(1-u),0)))}lt(oa,s,.03,.03,4,bn)}na=r}U.add(va(oa,Rt)),await o.yield();{const e=v.fork("logs"),t={P:[],N:[],C:[],I:[]},n=O("#5d5a48"),r=O("#6d6250");for(const[s,l,u,d]of[[-9,-25,.5,11],[-27.5,-20,2.2,8.5],[-2,-38,-.3,9.5],[-24,3,1.2,8]]){const x=u+e.range(-.3,.3),P=e.range(.36,.5),V=[],C=Math.round(d/.9);let S=!0;for(let f=0;f<=C;f++){const _=f/C-.5,q=s+Math.cos(x)*_*d,N=l+Math.sin(x)*_*d,W=X(P,P*.5,f/C);T.nearestXZ(q,N).dist<3.2&&(S=!1),V.push(new a.Vector3(q,j(q,N)+W*.62,N))}if(S){lt(t,V,P,P*.5,7,e.chance(.5)?n:r);for(let f=0;f<4;f++){const _=V[e.int(1,C-2)],q=x+Math.PI/2*e.sign()+e.range(-.5,.5),N=e.range(.6,1.7);lt(t,[_.clone(),new a.Vector3(_.x+Math.cos(q)*N*.5,_.y+N*.75,_.z+Math.sin(q)*N*.5),new a.Vector3(_.x+Math.cos(q)*N,_.y+N*1.1,_.z+Math.sin(q)*N)],.07,.02,4,r)}}}if(t.P.length){const s=va(t,Rt);s.name="fallen-logs",U.add(s)}}await o.yield();const So=Wn(j,Q);U.add(So),await o.yield();const Ao=430,ko=(Ao-Mt)/Math.max(c.y,.3),xo=tr(Me+Ao,new a.Vector2(c.x*ko,c.z*ko),y==="still"?new a.Vector2(.0012,3e-4):new a.Vector2(.006,.0015),Q,O(i.zenith).multiplyScalar(.78),O(i.horizon).multiplyScalar(1.12),O(i.horizon).lerp(O(h[5]),.6).multiplyScalar(1.5));U.add(xo),await o.yield(),await o.yield();const Ie=_e.makeFauna(U,{light:{sunDir:c,sunColor:O(h[5]),sunIntensity:1.5,sky:O(i.hemiSky),skyIntensity:1.5,ground:O(i.hemiGround),groundIntensity:1.3}}),De=m.fork("fauna"),Lt=60+De.range(-6,8),Le=new a.Vector3(z(Lt)-4.5,0,Lt);Le.y=j(Le.x,Le.z)+1.1,M?Ie.add(_e.makeHerd({rng:De,preset:{..._e.HERD_PRESETS.deer,h:.8,bodyLen:1.3,neckLen:.32,neckAng:40,headLen:.34,ears:.2,tail:.75,tailType:"flow",antlers:0,coat:"#5c5e63",belly:"#c9c9c4",legs:"#48494c",sock:"#2c2c2e",pattern:"none",varieties:0},count:1,heightAt:j,path:T,clear:.4,center:[Le.x,0,Lt],radius:1.2,roam:.45})):Ie.add(_e.makeHerd({rng:De,species:"deer",count:1+(De.chance(.5)?1:0),heightAt:j,path:T,clear:.4,center:[Le.x,0,Lt],radius:1.2,roam:.4,coat:"#a08a6e",belly:"#ece6d6",legs:"#8a7862",sock:"#5a4e42",rump:"#f4f0e6",pattern:"none",pause:.34}));{const e=m.fork("gravel"),t=300,n=new a.InstancedMesh(new a.IcosahedronGeometry(1,0),new a.MeshLambertMaterial({flatShading:!0}),t),r=new a.Object3D,s=new a.Color;for(let l=0;l<t;l++){const u=e.range(0,te),d=3.6*Math.sqrt(e()),x=Le.x+Math.cos(u)*d*.8,P=Le.z+Math.sin(u)*d*1.5,V=e.range(.07,.21);r.position.set(x,j(x,P)+V*.08,P),r.rotation.set(0,e.range(0,te),0),r.scale.set(V*1.5,V*.4,V*1.15),r.updateMatrix(),n.setMatrixAt(l,r.matrix),n.setColorAt(l,s.set("#a39f93").multiplyScalar(e.range(.78,1.15)))}n.instanceMatrix.needsUpdate=!0,n.instanceColor.needsUpdate=!0,n.name="gravel-bar",U.add(n)}await o.yield();const ra=M?{body:"#1a1a1a",head:"#121212",belly:"#e58a2a",wingC:"#1c1c1c",trail:"#ececec",tip:"#f4f4f4",tailC:"#1a1a1a"}:{body:"#141414",head:"#101010",belly:h[6],wingC:"#1a1a1a",trail:"#2a2a2a",tip:"#e8e8e8",tailC:h[6]},ia=Math.round(ve(12*w,8,15)),Mo=.69,zo=.83,wt=[];wt.push(Ie.add(_e.makeFlock({rng:De,species:"swifts",count:Math.ceil(ia/3),size:2.7,speed:15,...ra,cross:{path:T,u:Mo,lead:28,angle:48,side:1,height:1.5,span:170,duration:Ut}}))),await o.yield(),wt.push(Ie.add(_e.makeFlock({rng:De,species:"swifts",count:Math.ceil(ia/3),size:2.7,speed:15,...ra,cross:{path:T,u:zo,lead:26,angle:55,side:-1,height:.5,span:170,duration:Ut}}))),await o.yield(),wt.push(Ie.add(_e.makeFlock({rng:De,species:"swifts",count:Math.ceil(ia/3),size:2.7,speed:13,spread:[10,4,14],wander:[.9,.5,.9,.8],...ra,along:{path:T,side:6,up:2.2,lead:26,from:.56,to:.99,drift:8},keepClear:{path:T,dist:2,each:!0}}))),await o.yield(),Ie.add(_e.makeDragonflies({rng:De,count:9,size:2.6,path:T,uFrom:.52,uTo:.84,clear:3.2,spread:7.5,lift:[-4.4,-2.4],varieties:[["#5d7a5c","#2a332b"],["#6c8468","#30382f"]]})),await o.yield(),wt.push(Ie.add(_e.makeButterflies({rng:De,count:Math.round(80*w),size:2.1,path:T,uFrom:.74,uTo:1,clear:3,spread:24,lift:[-5.5,4],varieties:[[h[6],"#fff1d0"],["#e8760f","#ffe6c0"]]}))),await o.yield();const Co=[],We=m.fork("loose");for(const e of[Mo,zo])for(let t=0;t<20;t++){const n=T.pointAt(Math.min(.99,e+We.range(0,.06)));Co.push({p:[n.x+We.range(-7,7),n.y+We.range(1.5,6),n.z+We.range(-2,2)],seed:[$e(e)-We.range(1,4.5),We.range(.4,1.1),We.range(0,te),We()]})}U.add(Hn(Co,Q,Pa)),await o.yield();const Fo=[[19,336],[27,312],[17,288],[25,264],[18,244]].map(([e,t])=>new a.Vector3(e,j(e,t),t)),Po=new a.CatmullRomCurve3(Fo,!1,"centripetal"),Vt=Po.getLength(),Ce={value:0},xe=Fe.fxGroup();U.add(xe.object);let sa=null;k==="frost"?sa=xe.add(Fe.makeGlows({rng:m.fork("lan"),count:5,color:"#ffd29a",size:1.5,intensity:2.4,flicker:.35,halo:1.2,time:Ce,fogAmount:.6})):Ie.add(_e.makeHerd({rng:De,species:"horse",count:3,mode:"migrate",route:Fo,closed:!1,heightAt:j,spread:[.5,9],speed:1.25,tints:["#8a8078","#6f6a66","#a39a90"]})),await o.yield();const Ve=y==="still"&&!g;xe.add(Fe.makeMist({rng:m.fork("mist"),time:Ce,count:80,area:[230,5,430],center:[-8,0,10],heightAt:j,lift:1.5,size:[18,42],color:i.fog,opacity:Ve?.32:.25,drift:Ve?[1.5,0,.6]:[2.8,0,1]})),await o.yield(),xe.add(Fe.makeMist({rng:m.fork("breath"),time:Ce,count:44,area:[110,7,110],follow:!0,heightAt:j,lift:4,size:[7,17],color:i.fog,opacity:.16,drift:Ve?[2.2,0,.8]:[3.6,.1,1.3]})),await o.yield(),xe.add(Fe.makeParticles({rng:m.fork("motes"),preset:"dust",count:Math.round(2800*w*ke),colors:["#eef1ef","#dfe5e3","#ffffff"],intensity:.8,box:[38,24,38],time:Ce})),await o.yield(),xe.add(Fe.makeParticles({rng:m.fork("needles"),preset:"leaves",count:320,colors:["#5c6a5a","#7c7b62","#4b5a4d"],size:[.015,.035],time:Ce})),y==="snow"&&xe.add(Fe.makeParticles({rng:m.fork("snow"),preset:"snow",count:Math.round(2600*ke),time:Ce})),await o.yield();const To=xe.add(Fe.makeParticles({rng:m.fork("swarm"),preset:"petals",count:Math.round(5200*w*ke),colors:[h[6],"#e8760f","#ffa040"],size:[.1,.2],box:[40,20,40],velocity:[.4,.2,1.6],turbulence:[1.6,1,.5],intensity:1.5,time:Ce}));To.setOpacity(0),await o.yield();const ne=[],yt=[-c.x,-c.y,-c.z],Ze=(e,t,n,r,s,l,u=m)=>{const d=j(e,t),x=Fe.makeGodRays({rng:u.fork("rays"+ne.length),time:Ce,position:[e+c.x*58,d+c.y*58,t+c.z*58],direction:yt,radius:n,count:r,length:84,width:[2.4,6.5],falloff:.22,color:h[5],intensity:0,fogAmount:.3});x.base=s,x.slide=!!l,x.pre=0,x.late=0,x.home=x.object.position.clone(),x.z0=t,x.ph=ne.length*23.7,ne.push(x),xe.add(x)};Ze(0,fe-6,16,7,.4),Ze(-30,-40,20,6,.4),ne[ne.length-1].pre=Ve?.5:.75;for(const e of Ve?[60,150]:g?[30,60,92,120,150,176]:[30,60,92,120,150])Ze(z(e),e,15,5,.5,!0),ne[ne.length-1].pre=.34;await o.yield(),Ze(12,30,22,6,.24,!1,v),ne[ne.length-1].pre=.7,await o.yield(),Ze(mt[0][0],mt[0][1],14,5,.62,!1,v),ne[ne.length-1].pre=.85,Ze(mt[1][0],mt[1][1],14,5,.58,!1,v),ne[ne.length-1].pre=.85,await o.yield(),Ze(-21,fe-36,12,5,.34,!1,v),ne[ne.length-1].late=1,Ze(23,fe-22,12,5,.34,!1,v),ne[ne.length-1].late=1,await o.yield(),xe.add(Fe.makeMist({rng:m.fork("lowmist"),time:Ce,count:26,area:[90,3,110],center:[-37,0,-66],heightAt:j,lift:1.2,size:[15,27],color:i.fog,opacity:.14,drift:Ve?[.8,0,.3]:[1.5,0,.5]})),await o.yield();const Sn=75,_t=18,Ro=[],la=new a.Vector3,nt=new a.Vector3,Bo=new a.Vector3,Gt=new a.Line3,An=new a.Vector3(yt[0],yt[1],yt[2]);for(let e=0;e<=T.length;e+=2)Ro.push(T.posAtDist(e).clone());const Ee=o.core.makeRng(o.core.hashSeed("cold-pencils:"+o.seed)),Do=[],ca=[],ua=O("#dbe6ee"),Lo=O(h[5]);for(let e=0;e<5;e++)for(const t of[-1,1]){const n=-200+e*Sn+Ee.range(-20,20),r=z(n)-30+t*38+Ee.range(-14,14),s=new a.Vector3(r,j(r,n),n).addScaledVector(c,58),l=Fe.makeGodRays({rng:Ee,time:Ce,position:s,direction:yt,radius:46,count:7,length:84,width:[.6,1.9],falloff:.22,color:ua,intensity:0,fogAmount:.3});Do.push(l),xe.add(l);const u=l.object.geometry.attributes.aOrigin.array;for(let d=0;d<7;d++)for(let x=0;x<6;x++){Gt.start.set(s.x+u[d*3],s.y+u[d*3+1],s.z+u[d*3+2]),Gt.end.copy(Gt.start).addScaledVector(An,84);let P=1e9;for(const V of Ro){Gt.closestPointToPoint(V,!0,la);const C=la.distanceTo(V);C<P&&(P=C,nt.copy(la),Bo.copy(V))}if(P>=_t)break;nt.sub(Bo).setY(0),nt.lengthSq()<1e-6&&nt.set(t,0,0),nt.normalize(),u[d*3]+=nt.x*(_t-P+.5),u[d*3+2]+=nt.z*(_t-P+.5)}l.object.geometry.boundingSphere.radius+=2*_t;for(let d=0;d<7;d++)ca.push(new a.Vector3(s.x+u[d*3],s.y+u[d*3+1],s.z+u[d*3+2]));await o.yield()}const kn=ca.map(e=>{const t=e.clone().addScaledVector(c,-58);for(let n=0;n<4;n++)t.addScaledVector(c,-(t.y-Ae.surfaceAt(t.x,t.z))/Math.max(c.y,.3));return t}),da=er(kn,(e,t)=>Ae.surfaceAt(e,t),c,Q);U.add(da),await o.yield();const Vo=[];{const e=ca.map(C=>({p:C,R:2.2,n:36}));for(const C of ne)if(!C.slide&&C.pre>0){const S=C.object.geometry.attributes.aOrigin.array;let f=0;for(let _=0;_<S.length;_+=3)f=Math.max(f,Math.hypot(S[_],S[_+1],S[_+2]));e.push({p:C.home,R:f,n:110})}const t=new Map,n=new Map,r=new a.Matrix4,s=new a.Matrix4,l=new a.Matrix3,u=new a.Vector3,d=new a.Vector3,x=new a.Vector3,P=new a.Vector3,V=C=>{const S=C.attributes.position;let f=n.get(S);if(f)return f;const _=S.array,q=C.attributes.normal.array,N=C.attributes.aInfo.array,W=C.attributes.uv.array,ce=C.index.array;f=[];for(let J=0;J<ce.length;J+=3){const ee=ce[J],be=ce[J+1],K=ce[J+2],me=N[ee*4];if(me<.5)continue;const Oe=(W[ee*2]+W[be*2]+W[K*2])/3,St=(W[ee*2+1]+W[be*2+1]+W[K*2+1])/3;if(me<1.5?Math.abs(St)>.42||Oe<.3:St>.55||Math.abs(Oe-.5)>.35)continue;const At=rt=>(_[ee*3+rt]+_[be*3+rt]+_[K*3+rt])/3,Nt=rt=>q[ee*3+rt]+q[be*3+rt]+q[K*3+rt],ma=me<1.5&&Nt(1)<0==J/3%2<1?-1:1;f.push(At(0),At(1),At(2),Nt(0)*ma,Nt(1)*ma,Nt(2)*ma)}return n.set(S,f),f};for(const C of it.children){await o.yield();const S=V(C.geometry),f=C.geometry.attributes.aInst.array,_=C.userData.chunk;t.has(_)||t.set(_,{list:[],im:C});const q=t.get(_).list;for(let N=0;N<C.count;N++){C.getMatrixAt(N,s),r.copy(s).invert(),l.getNormalMatrix(s),d.copy(c).transformDirection(r);for(const W of e){const ce=W.R,J=W.n;u.copy(W.p).applyMatrix4(r);let ee=!1;for(let K=5;K<=32&&!ee;K+=3){const me=(K-u.y)/d.y;ee=Math.hypot(u.x+d.x*me,u.z+d.z*me)<Wa(K)+ce}if(!ee)continue;const be=[];for(let K=0;K<S.length;K+=6){x.set(S[K]-u.x,S[K+1]-u.y,S[K+2]-u.z);const me=x.dot(d);x.lengthSq()-me*me<ce*ce&&be.push(K)}for(let K=0,me=Math.min(J,be.length);K<me;K++){const Oe=be[Ee.int(0,be.length-1)],St=f[N*3];x.set(S[Oe],S[Oe+1],S[Oe+2]);const At=x.y;x.applyMatrix4(s),P.set(S[Oe+3],S[Oe+4],S[Oe+5]).applyMatrix3(l).normalize(),q.push({p:[x.x,x.y,x.z],up:[P.x,P.y,P.z],par:[Ee.range(0,te),Ee(),Ee.range(7,13),Ee()],rel:St<1e4?St+(se.yTop-At)/7.5+.3:1e5})}}}}for(const{list:C,im:S}of t.values())if(C.length){const f=$n(C,Q);f.userData.im=S,Vo.push(f),U.add(f)}}await o.yield();const _o=[];{const e=o.core.makeRng(o.core.hashSeed("wing-litter:"+o.seed)),t=new Map,n=new a.Matrix4,r=(l,u)=>Ae.surfaceAt(l,u),s=(l,u,d,x,P)=>{for(let V=0;V<d;V++){const C=e.range(0,te),S=x*Math.sqrt(e()),f={x:l+Math.cos(C)*S,z:u+Math.sin(C)*S,s:e.range(2.4,4.4),rot:e.range(0,te),rnd:e()};f.z>6&&Math.abs(f.x-z(f.z))<2.6+f.s*.5||P.push(f)}};for(const l of it.children){const u=l.userData.chunk,d=l.geometry.attributes.aInst.array;t.has(u)||t.set(u,{list:[],im:l});for(let x=0;x<l.count;x++)l.getMatrixAt(x,n),s(n.elements[12],n.elements[14],d[x*3+1]>.5?6:3,7,t.get(u).list)}t.has(1)&&s(0,0,30,13,t.get(1).list);for(const{list:l,im:u}of t.values())if(l.length){const d=await Kn(l,r,Q,o.yield);d.userData.im=u,_o.push(d),U.add(d),await o.yield()}}await o.yield();const xn=new a.Vector3,It=new a.Vector3,Mn=new a.Vector3,zn=[{at:(e,t)=>{const n=t*T.length,r=G(9,21,n),s=T.posAtDist(Math.max(n+2.1+3.5*r,3)),l=T.tangentAtDist(10);return Mn.set(s.x-l.z*.3,s.y-X(.74,.3,r),s.z+l.x*.3)},from:0,to:.065,weight:.88,fade:.2},{at:()=>xn.set(0,Me+ve(se.frontY()-5,17,Mt*.6),0),from:.17,to:Pe+.03,weight:.9,fade:.2},{at:Le,from:Pe-.01,to:T.nearestXZ(Le.x,Le.z).u+.012,weight:.6,fade:.35}],bt=64,Cn=F?-1:ie-.01,Fn=se.flyers.geometry.instanceCount,nr=T.nearestXZ(z(48),48).u,Pn=T.nearestXZ(-38.5,-84).u,Ot=T.nearestXZ(z(40),40).u,Tn=co.material.uniforms.uRay.value,Rn=["great-bough","monarch-needles"].map(e=>se.object.getObjectByName(e)).filter(Boolean);{const e=se.object.getObjectByName("great-bough");e&&e.geometry.attributes.position&&(e.geometry.computeBoundingSphere(),e.geometry.boundingSphere.radius=e.geometry.boundingSphere.radius*1.15+4,e.frustumCulled=!0)}const Bn=U.fog.density,fa=se.shaftFoot,Dn=bo.material.uniforms.uPool.value,jt=Ye.uniforms.uCloudA.value,Go=Ye.uniforms.uCloudB.value,Ln=Go[0].y;return await o.yield(),await Ye.prewarm(o.renderer,null,U),await o.yield(),{scene:U,path:T,duration:Ut,pace:Wt,title:g?i.title+" (all at once)":i.title,ride:"none",style:"none",camera:{fov:62,near:.15,far:3e3,lookAhead:22,sway:.8,bank:.7},pois:zn,portal:{shape:"circle",radius:7,color:"#ffe9c4",glow:1,revealDistance:240},post:{exposure:.97,bloom:{strength:.44,radius:.7,threshold:.92},grade:{saturation:.94,contrast:1.05,tint:"#f3f6f5",shadowTint:"#0a0f13",vignette:.34,grain:.03,aberration:0}},update(e,t,n,r){const s=Sa(r),l=Wo(r);se.setEventTime(s),se.uniforms.uWarm.value=l,se.update(e,t,n),Q.uClock.value=s,Q.uTime.value=t,Q.uGate.value=l,Ce.value=t,Pa.value=$e(r),o.renderer.getDrawingBufferSize(Ta),Fa.value=Ta.y/(2*Math.tan((n.fov||62)*Math.PI/360));const u=F||g?l:G(4.5,11,s),d=.12*l+.88*u;xt.intensity=X(i.sun[0],i.sun[1],d),Ma.intensity=X(i.hemi[0],i.hemi[1],l),jt[0].x=X(i.cover[0],g?.4:i.cover[1],u),Go[0].y=X(Ln,1.1,u),jt[1]&&(jt[1].x=X(.9,.42,u),jt[1].w=X(1,.5,u)),Ca&&(Ca.w=(Ve?.62:.92)*d),So.material.uniforms.uK.value=(Ve?.6:1)*d,xo.material.uniforms.uDeck.value=1-.85*u,U.fog.density=Bn*X(.74,1,G(ie+.03,Pe+.02,r)),Dn.set(fa.x,fa.y,fa.z*(1-.8*u)*(.35+.65*l)),at.light&&at.light.skyQ&&(at.light.skyQ.z=X(.08,.45,l));let x=0;for(const f of ne){let _=f.base*Math.max(l,f.pre)*(f.late?G(.56,.72,r):1);if(f.slide){const q=((t*8+f.ph)%bt+bt)%bt,N=q-bt/2,W=f.z0+N;f.object.position.set(f.home.x+z(W)-z(f.z0),f.home.y-.2*N,f.home.z+N),_*=Math.sin(Math.PI*q/bt),x<6&&Tn[x++].set(W,l*_/f.base,0)}f.uniforms.uIntensity.value=_}ot.material.uniforms.uFront.value=(s-3)*11,ot.material.uniforms.uTail.value=(s-17)*9,yo.visible=ot.material.uniforms.uFront.value+6>ge-Dt&&ot.material.uniforms.uTail.value-6<ge-Dt+aa;const P=s>-1?1:0,V=F?X(.3,1,G(.08,.3,r)):1;se.flyers.geometry.instanceCount=Math.round(P*Fn*V),Ea.geometry.instanceCount=P?Math.max(qa,Math.round(st.length*V)):qa,$a.geometry.instanceCount=r<Ot?fn:0,Kt.geometry.instanceCount=r>.25?gt.length:0;for(const f of Ha)f.visible=r<Ot;To.setOpacity(G(1,4.5,s)*(1-.6*G(13,20,s))*(1-G(.9,.97,r)));for(const f of it.children)f.userData.chunk===3?f.visible=r>Pe-.04:f.userData.chunk===2?f.visible=r>.12:f.userData.chunk===0?f.visible=r<Ot:f.userData.chunk===4&&(f.visible=r<Pn);for(const f of Rn)f.visible=r<Ot;for(const f of go)f.visible=Kt.geometry.instanceCount>0;ea.visible=P>0;for(const f of Vo)f.visible=f.userData.im.visible;for(const f of _o)f.visible=f.userData.im.visible;const C=Math.max(l,.9)*(1-.7*u);for(const f of Do)f.uniforms.uColor.value.lerpColors(ua,Lo,l),f.uniforms.uIntensity.value=(Ve?.36:.5)*C;da.material.uniforms.uCol.value.lerpColors(ua,Lo,l),da.material.uniforms.uK.value=(Ve?1.2:1.7)*C;const S=r>Cn;for(const f of wt)f&&f.object&&(f.object.visible=S);if(sa)for(let f=0;f<5;f++){const _=((t*1.1+f*6.5)%Vt+Vt)%Vt;Po.getPointAt(_/Vt,It),sa.setPosition(f,It.x+Math.sin(f*2.1)*.5,It.y+1.1+.08*Math.sin(t*3.1+f),It.z)}Ye.update(e,t,n),Ae.update(e,t),Na.update(e,t,n),Ua.update(e,t,n),Ya.update(e,t,n),Qa.update(e,t,n),Ja.update(e,t,n),ao.update(e,t,n),oo.update(e,t,n),eo.update(e,t,n),to.update(e,t,n),no.update(e,t,n),ro.update(e,t,n),io.update(e,t,n),at.update(e,t,n),Ie.update(e,t,n,r),xe.update(e,t,n)},dispose(){Ye.dispose?.()}}}};export{sr as default};
