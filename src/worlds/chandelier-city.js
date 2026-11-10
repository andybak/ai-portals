import*as e from"three";import{makePath as Tt}from"../kit/core.js";import{makeSky as It,makeLightRig as Nt}from"../kit/sky.js";import*as Et from"../kit/water.js";import*as je from"../kit/fauna.js";import*as ut from"../kit/fx.js";import{buildHero as Gt}from"../parts/chandelier-city.js";const N=Math.PI*2,ze=600,q=["#FBF1E1","#F3B9A6","#E8C7D6","#B9B4E6","#8E8CC9","#FFE2A6","#FF7A59"],c=o=>new e.Color(o),Oe=(o,a,w)=>{const b=Math.min(1,Math.max(0,(w-o)/(a-o)));return b*b*(3-2*b)},Rt={sunrise:{az:-30,el:4,sun:"#FFB48A",sunI:1.5,disc:"#FF7A59",fog:"#9C9AD0",haze:"#FFE2A6",lit:"#FBF1E1",warm:"#F3B9A6",shade:"#B6A8DA",up:.78,dn:.86,glow:1,exposure:1,sea:"#9A97D4",seaScat:"#D6C8EE",portal:"#FFE2A6",bloom:.5,warmBase:.3,pathC:"#FFD0A0",pathI:1,poolI:.42,koiE:.3,upMix:["#F3B9A6",.25],dnMix:["#8E8CC9",.2]},sunset:{az:150,el:5,sun:"#FF9478",sunI:1.7,disc:"#FF6A52",fog:"#D9A0B4",haze:"#FFB88A",lit:"#FFE0D0",warm:"#F8A48E",shade:"#CF9CBE",up:.78,dn:.84,glow:1.3,exposure:1.05,sea:"#B888B8",seaScat:"#FFC0B0",portal:"#FFD2A0",bloom:.52,warmBase:.62,pathC:"#FFB090",pathI:1,poolI:.5,koiE:.35,upMix:["#F8A48E",.6],dnMix:["#D79AB8",.6]},bluehour:{az:-30,el:3,sun:"#8E9CFF",sunI:.6,disc:null,fog:"#30347C",haze:"#7A84E2",hzn:"#383E8E",amb:"#C4B0C0",lit:"#434A9E",warm:"#5458B0",shade:"#272B70",up:.45,dn:.55,glow:1.25,exposure:1,sea:"#3C44AA",seaScat:"#5860B8",portal:"#FFE2A6",bloom:.5,bloomR:0,bloomT:1.2,warmBase:.3,pathC:"#B0B8FF",pathI:.3,poolI:.7,poolBrk:1,pool:"#FFCE7A",koiE:1.5,edge:1,scatter:0,rain:"#FFBC58",rainS:1.3,rainK:.6,upMix:["#F6DDB8",.7],dnMix:["#FFD8A0",.8]}},Wt={wisteria:{a:"#B9B4E6",b:"#E8C7D6",c:"#9F92DC",petals:["#C9C0F0","#F0D0E0","#FBF1E1"]},autumn:{a:"#F2C46A",b:"#F3A86E",c:"#E8D08A",petals:["#FFD27A","#F6A860","#FFE2A6"]},blossom:{a:"#FBE6EA",b:"#F6BFD0",c:"#FFF6F0",petals:["#FFF4F2","#F8C6D6","#FFE9E0"]}},Pe=`
uniform float uTime, uGlow, uBreeze;
uniform vec3 uSunDir, uSunCol, uSkyUp, uSkyDn, uHaze;
float h11(float n){ return fract(sin(n*12.9898)*43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
// sway about the ceiling pivot: a shear growing with depth below the cloud, lower parts lagging
vec3 swayP(vec3 p, float ph, float amp){
  float d = 600.0 - p.y;
  float a = amp*uBreeze;
  p.x += d*a*sin(uTime*0.262 - d*0.006 + ph);
  p.z += d*a*0.7*sin(uTime*0.217 + 1.3 - d*0.006 + ph*1.7);
  return p;
}
vec3 envCol(vec3 d){
  vec3 c = mix(uHaze, uSkyUp, smoothstep(0.0, 0.55, d.y));
  c = mix(c, uSkyDn, smoothstep(0.0, -0.45, d.y));
  float s = max(dot(d, uSunDir), 0.0);
  float s2 = s*s; float s6 = s2*s2*s2;
  c += uSunCol*(s6*0.35 + s6*s6*s6*s6*1.2);
  return c;
}
vec3 shade(vec3 alb, vec3 N, vec3 V, float metal, float gloss){
  vec3 amb = mix(uSkyDn, uSkyUp, N.y*0.5 + 0.5);
  float wrap = clamp((dot(N, uSunDir) + 0.45)/1.45, 0.0, 1.0);
  vec3 dif = alb*(amb*0.78 + uSunCol*wrap*wrap*0.5);
  vec3 R = reflect(-V, N);
  float fr = 1.0 - clamp(dot(N, V), 0.0, 1.0); fr = fr*fr*fr;
  vec3 env = envCol(R);
  vec3 c = dif*(1.0 - 0.5*metal) + env*alb*metal*0.62*gloss;
  c += env*fr*(0.06 + 0.16*gloss);
  float sp = max(dot(R, uSunDir), 0.0); sp *= sp; sp *= sp; sp *= sp; sp *= sp*sp;
  c += uSunCol*sp*gloss*(0.25 + 0.75*metal)*0.55;
  return c;
}
`,et=`
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
`;function tt(o,a){const w=o.uniforms;return{...e.UniformsUtils.clone(e.UniformsLib.fog),uTime:w.uTime,uGlow:w.uGlow,uSunDir:w.uSunDir,uSunCol:w.uSunCol,uSkyUp:w.uSkyUp,uSkyDn:w.uSkyDn,uHaze:w.uHaze,uBreeze:o.breeze,...a}}function Be(){const o=[],a=[],w=[],b=[],g=[],z=new e.Vector3,C=new e.Vector3,x=new e.Matrix3;return{P:o,N:a,C:w,S:b,I:g,add(y,t,h,s){const d=y.attributes.position,l=y.attributes.normal,M=o.length/3;t&&x.getNormalMatrix(t);for(let m=0;m<d.count;m++)z.fromBufferAttribute(d,m),C.fromBufferAttribute(l,m),t&&(z.applyMatrix4(t),C.applyMatrix3(x).normalize()),o.push(z.x,z.y,z.z),a.push(C.x,C.y,C.z),w.push(h.r,h.g,h.b),b.push(s[0],s[1],s[2],s[3]);if(y.index)for(let m=0;m<y.index.count;m++)g.push(M+y.index.getX(m));else for(let m=0;m<d.count;m++)g.push(M+m);y.dispose()},lathe(y,t,h,s,d,l){const M=o.length/3,m=h.length;for(let v=0;v<m;v++){const I=h[Math.max(0,v-1)],_=h[Math.min(m-1,v+1)],E=h[v];let S=-(_[1]-I[1]),u=_[0]-I[0];const O=Math.hypot(S,u)||1;S/=O,u/=O;for(let re=0;re<=s;re++){const G=re/s*N,R=Math.sin(G),H=Math.cos(G);o.push(y+E[0]*R,E[1],t+E[0]*H),a.push(S*R,u,S*H),w.push(E[3].r,E[3].g,E[3].b),b.push(d,l,E[2],G)}}for(let v=0;v<m-1;v++)for(let I=0;I<s;I++){const _=M+v*(s+1)+I,E=_+s+1;g.push(_,E,_+1,_+1,E,E+1)}},build(){const y=new e.BufferGeometry;return y.setAttribute("position",new e.Float32BufferAttribute(o,3)),y.setAttribute("normal",new e.Float32BufferAttribute(a,3)),y.setAttribute("color",new e.Float32BufferAttribute(w,3)),y.setAttribute("aSw",new e.Float32BufferAttribute(b,4)),y.setIndex(g),y}}}function ge(o,a={}){return new e.ShaderMaterial({fog:!0,side:e.DoubleSide,defines:a,uniforms:tt(o,{uNearCut:{value:0},uEmis:{value:0},uCloudC:o.cloudC,uPix:o.pix}),vertexShader:`
#include <fog_pars_vertex>
${Pe}
attribute vec3 color; attribute vec4 aSw;
#ifdef INST_SWAY
attribute vec2 aIs;
#endif
uniform float uPix;
varying vec3 vN, vW, vC; varying float vKind, vX;
void main(){
  vec3 p = position; vec3 n = normal;
#ifdef KOI
  {
#ifdef USE_INSTANCING
    float kp = instanceMatrix[3].x*0.05 + instanceMatrix[3].z*0.031;
#else
    float kp = 0.0;
#endif
    float tail = smoothstep(5.0, -15.0, p.z);
    p.x += sin(uTime*1.7 + p.z*0.24 + kp)*(0.35 + 1.5*tail);
  }
#endif
  if (aSw.z > 2.5 && aSw.z < 3.5) {                       // cloth: flutter, pinned where extra = 0
    p += n*sin(uTime*3.1 + p.x*1.7 + p.y*2.3 + aSw.x)*0.22*aSw.w;
  }
#ifdef USE_INSTANCING
  vec4 w = modelMatrix*instanceMatrix*vec4(p, 1.0); n = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*n);
#else
  vec4 w = modelMatrix*vec4(p, 1.0);
#endif
#ifdef INST_SWAY
  w.xyz = swayP(w.xyz, aIs.x, aIs.y);
#elif defined(SWAY)
  w.xyz = swayP(w.xyz, aSw.x, aSw.y);
#endif
  if (aSw.z > 5.5) {                                      // the ridden cable: a brass line never thinner than ~2 px
    float dist = distance(w.xyz, cameraPosition);
    w.xyz += n*max(0.0, dist*uPix*1.1 - 0.04);
  } else if (aSw.z > 4.5) {                               // ropes and rods never thinner than ~1.5 px
    float dist = distance(w.xyz, cameraPosition);
    w.xyz += vec3(n.x, 0.0, n.z)*max(0.0, dist*0.0008 - 0.10);
  }
  vN = n; vW = w.xyz; vC = color; vKind = aSw.z; vX = aSw.w;
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Pe}
uniform float uNearCut, uEmis; uniform vec3 uCloudC;
varying vec3 vN, vW, vC; varying float vKind, vX;
void main(){
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  if (dist < uNearCut) discard;
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 c;
  if (vKind < 0.5) { float fl = 0.86 + 0.14*sin(vX*12.0); c = shade(vC*fl, N, V, 1.0, 0.9);                    // fluted gilt
    float up = smoothstep(548.0, 600.0, vW.y);                                                                  // roses and upper stems dissolve into the cloud
    float rim = 1.0 - abs(dot(N, V)); c = mix(c, uCloudC*(0.86 + 0.3*rim*rim), up*0.72); }
  else if (vKind < 1.5) { c = shade(vC, N, V, 0.35, 1.0) + envCol(reflect(-V, N))*0.35;                          // glass teardrop
    float fr = 1.0 - abs(dot(N, V)); c += uSunCol*fr*fr*0.6 + vC*0.25*uGlow; }
  else if (vKind < 2.5) c = shade(vC, N, V, 0.0, 0.25);                                                         // plaster
  else if (vKind < 3.5) { c = shade(vC, N, V, 0.0, 0.1); float bl = max(dot(-N, uSunDir), 0.0); c += vC*uSunCol*bl*0.45 + vC*0.12; } // cloth, back-lit
  else if (vKind < 4.5) c = vC*(2.6 + 1.6*uGlow)*(0.85 + 0.15*sin(uTime*7.0 + vW.x + vW.z*1.3));              // lanterns
  else if (vKind < 5.5) c = shade(vC, N, V, 0.6, 0.6);                                                          // rope
  else c = shade(vC, N, V, 1.0, 0.8) + vC*0.6;                                                                  // the brass cable we ride
  c += vC*uEmis;
  gl_FragColor = vec4(c, 1.0);
  #include <fog_fragment>
}`})}function Kt(o,a,w){const C=[],x=[];for(let d=0;d<=56;d++){const l=5600*Math.pow(d/56,1.9);for(let M=0;M<=96;M++){const m=M/96*N;C.push(Math.sin(m)*l,ze,Math.cos(m)*l)}}for(let d=0;d<56;d++)for(let l=0;l<96;l++){const M=d*97+l,m=M+96+1;x.push(M,M+1,m,M+1,m+1,m)}const y=new e.BufferGeometry;y.setAttribute("position",new e.Float32BufferAttribute(C,3)),y.setIndex(x),y.boundingSphere=new e.Sphere(new e.Vector3(0,ze,0),5650);const t=`
uniform float uTime;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
${et}
float cloudH(vec2 p){
  vec2 q = p + vec2(uTime*1.3, uTime*0.6);
  float n = vn(q*0.0042)*0.62 + vn(q*0.0105 + 7.3)*0.38;
  float r = length(p);
  return 613.0 - 19.0*n + 9.0*smoothstep(130.0, 50.0, r);
}`,h=new e.ShaderMaterial({transparent:!0,depthWrite:!1,side:e.DoubleSide,uniforms:{uTime:o.uniforms.uTime,uSunDir:o.uniforms.uSunDir,uSunCol:o.uniforms.uSunCol,uLit:{value:c(a.lit)},uWarm:{value:c(a.warm)},uShade:{value:c(a.shade)},uFog:{value:c(a.fog)},uHazeC:{value:c(a.haze)},uDensity:{value:w},uKoiGlow:{value:Math.max(0,a.koiE-.3)*.5},uWarmBase:{value:a.warmBase},uKoiCol:{value:c("#FFD9A0")},uKoi:o.koi,uDimp:o.dimp},vertexShader:t+`
varying vec3 vW;
void main(){ vec3 p = position; p.y = cloudH(p.xz); vW = p; gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0); }`,fragmentShader:t+`
uniform vec3 uSunDir, uSunCol, uLit, uWarm, uShade, uFog, uHazeC, uKoiCol; uniform float uDensity, uWarmBase, uKoiGlow;
uniform vec4 uKoi[9]; uniform vec3 uDimp[2];
varying vec3 vW;
float fine(vec2 p){ vec2 q = p + vec2(uTime*1.3, uTime*0.6); return vn(q*0.031 + 3.1)*4.5 + vn(q*0.083)*1.6; }
void main(){
  vec3 V = vW - cameraPosition; float dist = length(V); V /= max(dist, 1e-4);
  float e = 5.0 + dist*0.012, k = clamp(1.0 - dist/2600.0, 0.0, 1.0);
  float h0 = cloudH(vW.xz) - fine(vW.xz)*k, hx = cloudH(vW.xz + vec2(e, 0.)) - fine(vW.xz + vec2(e, 0.))*k, hz = cloudH(vW.xz + vec2(0., e)) - fine(vW.xz + vec2(0., e))*k;
  vec3 N = normalize(vec3((hx - h0)*2.4, -e, (hz - h0)*2.4));
  vec2 sxz = normalize(uSunDir.xz + vec2(1e-5, 0.));
  float lit = clamp((dot(N.xz, sxz)*1.9 + 0.5), 0.0, 1.0);
  float hollow = smoothstep(596.0, 611.0, h0);
  vec3 c = mix(uShade, uLit, 0.34 + 0.66*lit);
  c = mix(c, uShade, hollow*0.3);
  float sunward = dot(V.xz/max(length(V.xz), 1e-4), sxz);
  float reach = smoothstep(150.0, 2400.0, dist);
  c = mix(c, uWarm, (uWarmBase + 0.55*smoothstep(-0.3, 1.0, sunward))*(0.25 + 0.75*reach)*(0.45 + 0.55*lit));
  float s2 = max(sunward, 0.0); s2 *= s2; s2 *= s2; s2 *= s2;
  c += uSunCol*s2*reach*0.32*lit;
  c *= 0.9;
  // the koi that swim in the cloud: ring dimples round each back and a long V wake trailing behind it
  float wk = 0.0, kg = 0.0;
  for (int i = 0; i < 9; i++) {
    vec2 r = vW.xz - uKoi[i].xy; float d2 = dot(r, r);
    if (d2 < 12100.0) {
      float d = sqrt(d2), al = dot(r, uKoi[i].zw), ac = abs(r.x*uKoi[i].w - r.y*uKoi[i].z), back = max(-al, 0.0);
      float ring = (0.5 + 0.5*sin(d*0.40 - uTime*2.2))*exp(-d*0.05)*smoothstep(5.0, 13.0, d);
      float vq = (ac - back*0.30)/(2.2 + back*0.07);
      float vee = exp(-vq*vq)*smoothstep(8.0, 20.0, back)*smoothstep(84.0, 34.0, back);
      wk += ring*0.75 + vee*0.8; kg += exp(-d2/700.0);
    }
  }
  for (int i = 0; i < 2; i++) {
    float d = distance(vW.xz, uDimp[i].xy);
    wk += uDimp[i].z*(0.5 + 0.5*sin(d*0.30 - uTime*3.0))*exp(-d*0.022);
    kg += uDimp[i].z*exp(-d*d/900.0)*0.6;
  }
  wk = clamp(wk, 0.0, 1.0);
  c = mix(c, uWarm*0.74, wk*0.62) + uLit*wk*wk*0.05;
  c += uKoiCol*kg*(0.10 + uKoiGlow);
  float f = 1.0 - exp(-uDensity*uDensity*dist*dist);
  vec3 fogC = mix(uFog, uHazeC, 0.25 + 0.6*s2);
  c = mix(c, fogC, f);
  float a = 1.0 - smoothstep(0.80, 0.985, f);
  gl_FragColor = vec4(c, a);
}`}),s=new e.Mesh(y,h);return s.renderOrder=2,s.frustumCulled=!1,s}const _t=[[.72,-1],[1,-1,0],[1.13,-.8,0],[1,-.62,0],[1,.55,1],[1.2,.68,0],[1.2,.82,0],[.86,1.15,2],[0,1.52,2],[-.86,1.15,2],[-1.2,.82,2],[-1.2,.68,0],[-1,.55,0],[-1,-.62,1],[-1.13,-.8,0],[-1,-1,0],[-.72,-1,0],[.72,-1,3]],Qt=[[1,-1],[1,.6,1],[1.2,.8,0],[0,1.5,2],[-1.2,.8,2],[-1,.6,0],[-1,-1,1],[1,-1,3]];function Mt(o,a){const w=[],b=[],g=[],z=[];for(let x=1;x<o.length;x++){const y=o[x-1],t=o[x],h=t[2];let s=t[1]-y[1],d=-(t[0]-y[0]);const l=Math.hypot(s,d)||1;s/=l,d/=l;const M=w.length/3;for(let m=0;m<=a;m++){const v=m/a*N;w.push(v,y[0],y[1],v,t[0],t[1]),b.push(s,d,0,s,d,0),g.push(h,0,h,1)}for(let m=0;m<a;m++){const v=M+m*2;z.push(v,v+2,v+1,v+1,v+2,v+3)}}const C=new e.BufferGeometry;return C.setAttribute("position",new e.Float32BufferAttribute(w,3)),C.setAttribute("normal",new e.Float32BufferAttribute(b,3)),C.setAttribute("uv",new e.Float32BufferAttribute(g,2)),C.setIndex(z),C}function Lt(o,a){return new e.ShaderMaterial({fog:!0,side:e.DoubleSide,uniforms:tt(o,{uGold:{value:a},uCream:{value:c(q[0])},uRose:{value:c(q[1])},uLilac:{value:c(q[3])},uLitShare:{value:o.litShare}}),vertexShader:`
#include <fog_pars_vertex>
${Pe}
attribute vec4 aRing, aSw;
varying vec3 vN, vW; varying vec2 vUv; varying float vA, vSeed, vBays;
void main(){
  float a = position.x, s = aSw.w, r = aRing.w + position.y*s;
  vec3 w = vec3(aRing.x + r*sin(a), aRing.y + position.z*s, aRing.z + r*cos(a));
  w = swayP(w, aSw.x, aSw.y);
  vN = vec3(normal.x*sin(a), normal.y, normal.x*cos(a)); vW = w; vUv = uv; vA = a; vSeed = aSw.z;
  vBays = max(8.0, floor(aRing.w*6.2832/(1.25*s)));
  vec4 mvPosition = viewMatrix*vec4(w, 1.0); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Pe}
uniform vec3 uGold, uCream, uRose, uLilac; uniform float uLitShare;
varying vec3 vN, vW; varying vec2 vUv; varying float vA, vSeed, vBays;
void main(){
  vec3 V = normalize(cameraPosition - vW), N = normalize(vN); if (!gl_FrontFacing) N = -N;
  float m = vUv.x, v = vUv.y, bu = vA/6.2832*vBays, u = fract(bu), id = floor(bu), x = abs(u - 0.5)*2.0;
  vec3 c;
  if (m < 0.5) c = shade(uGold, N, V, 1.0, 0.9);
  else if (m < 1.5) {
    float top = 0.60 + 0.24*sqrt(max(0.0, 1.0 - (x/0.56)*(x/0.56)));
    float win = step(x, 0.56)*step(0.16, v)*step(v, top);
    float hsh = h21(vec2(id, vSeed*91.0));
    vec3 wall = mix(uCream, uRose, 0.18 + 0.2*h11(vSeed*7.0))*0.8;
    c = shade(wall, N, V, 0.0, 0.2);
    if (x > 0.84) c = shade(uGold, N, V, 1.0, 0.8);
    vec3 lit = mix(vec3(1.0, 0.62, 0.26), vec3(1.0, 0.86, 0.56), hsh)*(1.7 + 1.9*hsh)*uGlow*(0.9 + 0.1*sin(uTime*(1.0 + hsh*3.0) + hsh*40.0));
    vec3 dark = vec3(0.40, 0.38, 0.66) + envCol(reflect(-V, N))*0.25;
    c = mix(c, mix(dark, lit, step(hsh, uLitShare)), win);
  } else if (m < 2.5) {
    float st = step(0.5, fract(bu*0.5 + 0.25));
    vec3 roof = mix(mix(uRose, uLilac, step(0.6, h11(vSeed*3.0))), uCream, st*0.75)*0.8;
    c = shade(roof, N, V, 0.0, 0.3);
  } else {
    c = shade(mix(uCream, uRose, 0.4)*0.72, N, V, 0.0, 0.2);
    float lamp = smoothstep(0.34, 0.0, x)*smoothstep(0.5, 0.2, abs(v - 0.5));
    c += vec3(1.0, 0.74, 0.4)*lamp*2.6*uGlow;
  }
  // a slow band of prismatic colour over stone near the Grand Chandelier
  float prox = exp(-length(vW.xz)/650.0);
  float band = 0.5 + 0.5*sin(dot(vW, vec3(0.021, 0.034, 0.015)) - uTime*0.4); band *= band; band *= band; band *= band;
  vec3 hue = 0.5 + 0.5*cos(6.2832*(dot(vW, vec3(0.004, 0.007, 0.003)) + vec3(0.0, 0.33, 0.67)));
  c += hue*band*prox*0.3;
  gl_FragColor = vec4(c, 1.0);
  #include <fog_fragment>
}`})}function Ut(o){return new e.ShaderMaterial({fog:!0,uniforms:tt(o,{uPix:o.pix}),vertexShader:`
#include <fog_pars_vertex>
${Pe}
uniform float uPix;
attribute vec4 aPos, aSw; attribute vec3 aCol;
varying vec2 vQ; varying vec3 vC, vW; varying float vKind, vSeed;
void main(){
  vec3 w = swayP(aPos.xyz, aSw.x, aSw.y);
  float k = aSw.z, size = aPos.w;
  if (k > 2.5) w.x += sin(uTime*2.3 + aSw.w*30.0)*0.25;
  vec4 mvPosition = viewMatrix*vec4(w, 1.0);
  float dist = -mvPosition.z;
  size = max(size, dist*uPix*(k > 1.5 && k < 2.5 ? 2.2 : 1.5));
  vec2 q = position.xy;
  if (k > 2.5) q.x += sin(uTime*4.0 + aSw.w*50.0 + q.y*1.5)*0.25*(0.5 - q.y*0.5);
  mvPosition.xy += q*size;
  vQ = position.xy; vC = aCol; vW = w; vKind = k; vSeed = aSw.w;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Pe}
varying vec2 vQ; varying vec3 vC, vW; varying float vKind, vSeed;
void main(){
  float d2 = dot(vQ, vQ); vec3 c;
  vec3 V = normalize(cameraPosition - vW);
  if (vKind < 1.5) {
    if (d2 > 1.0) discard;
    vec3 nv = vec3(vQ, sqrt(max(0.0, 1.0 - d2)));
    vec3 N = normalize((vec4(nv, 0.0)*viewMatrix).xyz);
    c = shade(vC, N, V, vKind < 0.5 ? 0.35 : 1.0, 1.0);
    if (vKind < 0.5) c += vC*0.10;
  } else if (vKind < 2.5) {
    if (d2 > 1.0) discard;
    float fl = 0.8 + 0.2*sin(uTime*(6.0 + vSeed*5.0) + vSeed*60.0);
    c = vC*(0.9 + 6.0*exp(-d2*3.5))*fl*uGlow;
  } else {
    if (abs(vQ.x) > 0.5*(vQ.y + 1.0)) discard;
    c = vC*(mix(uSkyDn, uSkyUp, 0.6)*0.9 + uSunCol*0.35);
  }
  gl_FragColor = vec4(c, 1.0);
  #include <fog_fragment>
}`})}function qt(o,a){return new e.ShaderMaterial({fog:!0,side:e.DoubleSide,uniforms:tt(o,{uA:{value:c(a.a)},uB:{value:c(a.b)},uC:{value:c(a.c)},uLean:o.lean}),vertexShader:`
#include <fog_pars_vertex>
${Pe}
uniform vec2 uLean;
attribute vec4 aPos, aSw;
varying vec3 vW; varying vec2 vQ; varying float vSeed, vLen;
void main(){
  float t = -position.y, len = aPos.w, seed = aSw.z;
  vec3 a = swayP(aPos.xyz, aSw.x, aSw.y);
  float sw = t*t*len*0.085*uBreeze;
  vec3 p = a + vec3(0.0, -t*len, 0.0);
  p.x += sw*sin(uTime*0.52 + seed*6.28 - t*1.4) + uLean.x*t*t*len;
  p.z += sw*sin(uTime*0.43 + seed*9.4 - t*1.1) + uLean.y*t*t*len;
  p.x += sin(uTime*1.7 + seed*20.0 + t*9.0)*0.35*t;
  vec3 side = normalize(cross(vec3(0., 1., 0.), cameraPosition - p) + vec3(1e-4, 0., 0.));
  p += side*position.x*aSw.w*(1.0 - 0.6*t);
  vW = p; vQ = vec2(position.x, t); vSeed = seed; vLen = len;
  vec4 mvPosition = viewMatrix*vec4(p, 1.0); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,fragmentShader:`
#include <fog_pars_fragment>
${Pe}
${et}
uniform vec3 uA, uB, uC;
varying vec3 vW; varying vec2 vQ; varying float vSeed, vLen;
void main(){
  vec2 p = vec2(vQ.x*5.0 + vSeed*37.0, vQ.y*vLen*0.55 + vSeed*11.0);
  float n = vn(p)*0.65 + vn(p*2.7)*0.35;
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  float nearK = smoothstep(18.0, 5.0, dist);                // at the lens a fall opens into lace and lets the view through, never a flat cut-out
  n = mix(n, n*0.72 + vn(p*6.3 + 2.1)*0.28, nearK);
  if (n < 0.30 + abs(vQ.x)*0.95 + vQ.y*0.12 + nearK*0.42) discard;
  vec3 alb = mix(mix(uA, uB, smoothstep(0.2, 0.9, vQ.y + (vn(p*0.6) - 0.5)*0.6)), uC, step(0.7, h11(vSeed*5.0))*0.6)*(0.62 + 0.38*n);
  vec3 N = normalize(vec3(V.x, 0.25, V.z));
  vec3 c = shade(alb, N, V, 0.0, 0.1);
  float back = max(dot(-V, uSunDir), 0.0);
  c += alb*uSunCol*(0.18 + 0.5*back*back);
  gl_FragColor = vec4(c, 1.0);
  #include <fog_fragment>
}`})}function jt(o,a,w,b,g,z){const C=w.length*b,x=new Float32Array(C*4),y=new Float32Array(C*2);let t=0;for(const u of w)for(let O=0;O<b;O++,t++){const re=a()*N,G=Math.sqrt(a())*u.r;x.set([u.x+Math.cos(re)*G,u.z+Math.sin(re)*G,a(),a.range(7,18)],t*4),y.set([a.range(.75,1.35),a()],t*2)}const h=new e.InstancedBufferGeometry;h.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),h.setIndex([0,1,2,0,2,3]),h.setAttribute("aPos",new e.InstancedBufferAttribute(x,4)),h.setAttribute("aSeed",new e.InstancedBufferAttribute(y,2)),h.instanceCount=C;const s=g.rain?c(g.rain):c(g.haze).lerp(c("#FFC36B"),.45),d=new e.ShaderMaterial({transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,uniforms:{uTime:o.uniforms.uTime,uPix:o.pix,uCol:{value:g.rainS?s.clone().multiplyScalar(g.rainS):s},uDensity:{value:z},uGlow:o.uniforms.uGlow},vertexShader:`
uniform float uTime, uPix, uDensity;
attribute vec4 aPos; attribute vec2 aSeed;
varying vec2 vQ; varying float vA;
void main(){
  float y = fract(aPos.z + uTime*9.0*aSeed.x/600.0)*600.0;
  vec3 p = vec3(aPos.x, y, aPos.y);
  float dist = distance(p, cameraPosition);
  vec3 side = normalize(cross(vec3(0., 1., 0.), cameraPosition - p) + vec3(1e-4, 0., 0.));
  float w = max(0.07, dist*uPix*1.1);
  p += side*position.x*w; p.y += position.y*aPos.w*0.5;
  vQ = position.xy;
  float f = exp(-uDensity*uDensity*dist*dist);
  vA = f*smoothstep(1.5, 9.0, dist)*smoothstep(0.0, 30.0, y)*smoothstep(606.0, 575.0, y)*(0.45 + 0.55*aSeed.y)*min(1.0, 0.07/max(dist*uPix*1.1, 1e-4) + 0.25);
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.0);
}`,fragmentShader:`
uniform vec3 uCol; uniform float uGlow;
varying vec2 vQ; varying float vA;
void main(){ float a = (1.0 - vQ.x*vQ.x)*(1.0 - vQ.y*vQ.y)*vA; gl_FragColor = vec4(uCol*a*(1.5 + 0.5*uGlow), 1.0); }`}),l=new e.Mesh(h,d);l.frustumCulled=!1,l.renderOrder=4;const M=[],m=[],v=[],I=28;for(const u of w){const O=M.length/3;for(let G=0;G<=1;G++)for(let R=0;R<=I;R++){const H=R/I*N;M.push(u.x+Math.sin(H)*u.r,G*612,u.z+Math.cos(H)*u.r),m.push(Math.sin(H),0,Math.cos(H))}for(let G=0;G<I;G++){const R=O+G,H=R+I+1;v.push(R,R+1,H,R+1,H+1,H)}const re=M.length/3;for(let G=0;G<=I;G++){const R=G/I*N;M.push(u.x,3,u.z,u.x+Math.sin(R)*u.r*2.2,3,u.z+Math.cos(R)*u.r*2.2),m.push(0,1,0,0,.999,0)}for(let G=0;G<I;G++){const R=re+G*2;v.push(R,R+1,R+3)}}const _=new e.BufferGeometry;_.setAttribute("position",new e.Float32BufferAttribute(M,3)),_.setAttribute("normal",new e.Float32BufferAttribute(m,3)),_.setIndex(v);const E=new e.ShaderMaterial({transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,uniforms:{uTime:o.uniforms.uTime,uCol:{value:g.rainK?s.clone().multiplyScalar(g.rainK):s},uDensity:{value:z}},vertexShader:"varying vec3 vN, vW; void main(){ vN = normal; vW = position; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.0); }",fragmentShader:`
uniform float uTime, uDensity; uniform vec3 uCol; varying vec3 vN, vW;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
${et}
void main(){
  vec3 V = cameraPosition - vW; float dist = length(V); V /= max(dist, 1e-4);
  float f = exp(-uDensity*uDensity*dist*dist), a;
  if (vN.y > 0.5) { float e = (1.0 - vN.y)*1000.0; a = e*(1.0 - e)*4.0*(0.35 + 0.65*vn(vW.xz*0.06 + uTime*0.15))*0.22; }
  else {
    float nv = abs(dot(normalize(vN), V));
    float st = vn(vec2(atan(vN.x, vN.z)*9.0, vW.y*0.012 - uTime*0.22));
    a = nv*nv*(0.05 + 0.10*st)*smoothstep(0.0, 60.0, vW.y)*smoothstep(612.0, 560.0, vW.y)*smoothstep(4.0, 40.0, dist);
  }
  gl_FragColor = vec4(uCol*a*f, 1.0);
}`}),S=new e.Mesh(_,E);return S.frustumCulled=!1,S.renderOrder=3,{streaks:l,cols:S}}function Ot(o,a,w,b,g){const z=g.slice(),C=(t,h,s)=>{const d=Math.hypot(t,h);if(d<335+s||d>1750||Math.abs(t)<70+s&&h>0&&h<520||a.nearestXZ(t,h).dist<s+24)return!1;for(const l of w)if(Math.hypot(t-l.x,h-l.z)<s+l.r+14)return!1;for(const l of z)if(Math.hypot(t-l.x,h-l.z)<s+l.R+55)return!1;return!0},x=(t,h,s,d)=>{const l=o.int(3,6),M=d?o.range(215,330):o.range(110,400),m=ze-o.range(38,90);return{x:t,z:h,R:s,tiers:l,len:M,top:m,near:d,ph:o.range(0,N),amp:o.range(.011,.018),seed:o(),widest:o.int(0,1)}};for(let t=0,h=0;t<400&&h<Math.round(13*b);t++){const s=a.pointAt(o.range(.03,.8)),d=o()*N,l=o.range(45,190),M=o.range(15,30),m=s.x+Math.cos(d)*l,v=s.z+Math.sin(d)*l;C(m,v,M)&&(z.push(x(m,v,M,!0)),h++)}const y=Math.round(66*b);for(let t=0;t<60&&z.length<y;t++){const h=o()*N,s=380+Math.sqrt(o())*1250,d=Math.sin(h)*s,l=Math.cos(h)*s,M=o.int(3,7);for(let m=0,v=0;m<M&&v<30&&z.length<y;v++){const I=o()*N,_=o.range(60,230),E=o.range(15,45),S=d+Math.cos(I)*_,u=l+Math.sin(I)*_;C(S,u,E)&&(z.push(x(S,u,E,!1)),m++)}}for(const t of z){t.pd=a.nearestXZ(t.x,t.z).dist,t.hi=t.pd<200,t.far=t.pd>600,t.rings=[],t.cell=Math.floor((t.x+3600)/900)+"_"+Math.floor((t.z+3600)/900);const h=ze-t.len,s=Math.min(20,8+t.R*.3),d=h+s+14-t.top;for(let l=0;l<t.tiers;l++){const M=t.tiers>1?l/(t.tiers-1):0,m=t.widest===0?1-.58*M:l===0?.7:1-.6*(M-1/(t.tiers-1)),v=Math.max(9,t.R*m);t.rings.push({y:t.top+d*M,R:v,s:Math.min(3.3,Math.max(1.9,v*.1))})}if(t.ringAt){const l=t.ringAt.k,M=t.ringAt.y-t.rings[l].y;for(const m of t.rings)m.y+=M;t.top+=M,t.len-=M}t.bottom=ze-t.len,t.fin=s}return z}function ct(o,a,w,b,g=[]){for(let z=0;z<=b;z++){const C=z/b;g.push(new e.Vector3().lerpVectors(o,a,C).setY(o.y+(a.y-o.y)*C-4*w*C*(1-C)))}return g}async function Ht(o,a,w,b,g,z){const C=o.gold,x=C.clone(),y=c(q[0]).multiplyScalar(.85),t=c("#F6EDE6"),h=c("#FFC878"),s=[c(q[1]),c(q[3]),c(q[5]),c(q[2])],d=new e.Group,l=[],M=new Map,m=n=>{let f=M.get(n);return f||(f={trunk:Be(),rHi:[],rLo:[],sHi:[],sLo:[],sp:[],spS:[],spC:[],st:[],stS:[],towers:[]},M.set(n,f)),f};let v=null;const I=new e.Matrix4,_=()=>new e.BoxGeometry(1,1,1),E=(n,f,V,j,K)=>{v.sp.push(n.x,n.y,n.z,f),v.spS.push(K.ph,K.amp,j,a()),v.spC.push(V.r,V.g,V.b)},S=new e.Vector3,u=new e.Vector3;let O=0;for(const n of w){(O++&3)===0&&await z.pause(),v=m(n.cell),v.towers.push(n);const{trunk:f,rHi:V,rLo:j,sHi:K,sLo:F,st:Q,stS:W}=v,D=1.1+n.R*.035,X=7+n.R*.32,ee=[[X,607,0,x],[X*.92,600.5,0,x],[X*.5,597,0,x],[X*.22,591,0,x],[D,583,0,x]];for(const k of n.rings)ee.push([D,k.y+6,0,x],[D*2.3,k.y+3.2,0,x],[D*1.25,k.y+.5,0,x],[D*2,k.y-2.2,0,x],[D,k.y-5,0,x]);const Y=n.bottom+n.fin,ae=a.pick(s),le=n.fin;ee.push([D,Y+6,0,x],[D*2.4,Y+3,0,x],[D*.8,Y+.6,0,x],[.5,Y,1,ae],[le*.15,Y-le*.3,1,ae],[le*.2,Y-le*.55,1,ae],[le*.13,Y-le*.8,1,ae],[.02,Y-le,1,ae]),f.lathe(n.x,n.z,ee,n.hi?8:n.far?5:6,n.ph,n.amp),n.rings.forEach((k,ce)=>{(n.hi?V:j).push(n.x,k.y,n.z,k.R),(n.hi?K:F).push(n.ph,n.amp,n.seed+ce*.13,k.s);const ye=a()*N,Fe=n.hi?6:n.far?3:4,Ae=k.R-k.s;for(let Z=0;Z<Fe;Z++){const L=ye+Z/Fe*N;I.makeRotationY(L).multiply(new e.Matrix4().makeTranslation(0,0,Ae/2)).multiply(new e.Matrix4().makeScale(.5,.7,Ae)),I.setPosition(n.x+Math.sin(L)*Ae/2,k.y+.4*k.s,n.z+Math.cos(L)*Ae/2),f.add(_(),I,x,[n.ph,n.amp,0,0]),S.set(n.x,k.y+Math.min(26,k.R*.6)+6,n.z),u.set(n.x+Math.sin(L)*Ae,k.y+1.2*k.s,n.z+Math.cos(L)*Ae);const me=n.hi?3:n.far?8.5:6,ve=Math.max(3,Math.round(S.distanceTo(u)/me));for(let se=1;se<ve;se++)E(new e.Vector3().lerpVectors(S,u,se/ve),n.hi?.66:n.far?1.4:1.15,x,1,n)}const Ve=n.pd<150&&b.distanceTo(n.x,k.y,n.z)-k.R<78,He=Math.max(6,Math.round(k.R*N/(n.hi?8:n.far?17:13))),Re=k.R+2.6*k.s;for(let Z=0;Z<He;Z++){const L=ye+(Z+.5)/He*N,me=Ve?k.R+3.99*k.s:Re,ve=Ve?k.y+2.05*k.s:k.y+.75*k.s;E(S.set(n.x+Math.sin(L)*me,ve,n.z+Math.cos(L)*me),Ve?.3*k.s:n.hi?.75:n.far?1.35:1.15,h,2,n),Ve&&l.push(n.x+Math.sin(L)*(k.R+k.s),k.y-.5*k.s,n.z+Math.cos(L)*(k.R+k.s),L,k.s,n.ph,n.amp)}if(ce+1<n.rings.length){const Z=n.rings[ce+1],L=n.hi?6:n.far?3:4,me=a.range(.25,.6);for(let ve=0;ve<L;ve++){const se=ye+ve/L*N;S.set(n.x+Math.sin(se)*(k.R+k.s),k.y-k.s,n.z+Math.cos(se)*(k.R+k.s)),u.set(n.x+Math.sin(se+me)*(Z.R+Z.s),Z.y+.6*Z.s,n.z+Math.cos(se+me)*(Z.R+Z.s));const We=S.distanceTo(u),Xe=Math.max(4,Math.round(We/(n.hi?2.5:n.far?8:6)));ct(S,u,We*.16,Xe).forEach((Ke,Me)=>{Me>0&&Me<Xe&&E(Ke,(n.hi?.74:n.far?1.5:1.25)*(Me%5===2?1.5:1),Me%5===2?x:t,Me%5===2?1:0,n)})}}const Se=n.hi?Math.round(k.R*.55*z.lush):n.far?3:4;for(let Z=0;Z<Se;Z++){const L=a()*N,me=k.R+(a.chance(.75)?.9:-.9)*k.s,ve=n.hi?a.range(16,44):a.range(22,50);Q.push(n.x+Math.sin(L)*me,k.y-.9*k.s,n.z+Math.cos(L)*me,ve),W.push(n.ph,n.amp,a(),a.range(4.5,8.5)*(n.hi?1:1.5))}})}await z.pause(),v=m("misc");const{st:re,stS:G}=v;for(let n=0,f=0;n<Math.round(46*z.lush)&&f<600;f++){const V=b.pointAt(a.range(0,1)),j=a()*N,K=a.range(45,520),F=V.x+Math.cos(j)*K,Q=V.z+Math.sin(j)*K;if(Math.hypot(F,Q)<300||b.nearestXZ(F,Q).dist<42)continue;let W=!1;for(const Y of w)if(Math.hypot(F-Y.x,Q-Y.z)<Y.R*.4+16){W=!0;break}if(W)continue;n++;const D=a.int(9,14),X=a.range(5,11),ee=a.range(0,N);for(let Y=0;Y<D;Y++){const ae=Y/D*N+a.range(-.2,.2),le=X*a.range(.3,1);re.push(F+Math.cos(ae)*le,606,Q+Math.sin(ae)*le,a.range(30,52)),G.push(ee,0,a(),a.range(6,10))}}if(await z.pause(),z.flags){const n=[c(q[6]),c(q[5]),c(q[3]),c(q[0]),c(q[1])],f=w.filter(V=>V.pd<420);for(let V=0;V<f.length;V++)for(let j=V+1;j<f.length;j++){const K=f[V],F=f[j],Q=Math.hypot(K.x-F.x,K.z-F.z);if(Q>230)continue;const W=K.rings[Math.min(1,K.rings.length-1)],D=F.rings[Math.min(1,F.rings.length-1)],X=(F.x-K.x)/Q,ee=(F.z-K.z)/Q;S.set(K.x+X*W.R,W.y+W.s,K.z+ee*W.R),u.set(F.x-X*D.R,D.y+D.s,F.z-ee*D.R);const Y=S.distanceTo(u),ae=Math.round(Y/3.2),le=ct(S,u,Y*.1,ae);let k=!1;for(const ce of le)if(b.distanceTo(ce.x,ce.y,ce.z)<12){k=!0;break}k||le.forEach((ce,ye)=>{if(ye>0&&ye<ae){v.sp.push(ce.x,ce.y-1.1,ce.z,1.1),v.spS.push((K.ph+F.ph)/2,.006,3,a());const Fe=n[ye%n.length];v.spC.push(Fe.r,Fe.g,Fe.b)}})}}await z.pause();const R=ge(o,{SWAY:1}),H=Lt(o,C),xe=Ut(o),fe=qt(o,g),he=Mt(_t,20),pe=Mt(Qt,14),B=[],ne=[],ue=4;for(let n=0;n<=ue;n++)B.push(-.5,-n/ue,0,.5,-n/ue,0);for(let n=0;n<ue;n++){const f=n*2;ne.push(f,f+2,f+1,f+1,f+2,f+3)}const T={rings:0,ringsHi:0,sprites:0,strands:0,arms:l.length/7,cells:M.size};for(const[n,f]of M){await z.pause();let V=null;if(n!=="misc"&&f.towers.length){let F=0,Q=0;for(const D of f.towers)F+=D.x,Q+=D.z;F/=f.towers.length,Q/=f.towers.length;let W=0;for(const D of f.towers)W=Math.max(W,Math.hypot(D.x-F,D.z-Q)+D.R+75);V=new e.Sphere(new e.Vector3(F,398,Q),Math.hypot(W,222))}const j=F=>(V?(F.geometry.boundingSphere=V.clone(),F.frustumCulled=!0):F.frustumCulled=!1,d.add(F),F);f.trunk.P.length&&j(new e.Mesh(f.trunk.build(),R));const K=(F,Q,W)=>{const D=new e.InstancedBufferGeometry().copy(F);D.setAttribute("aRing",new e.InstancedBufferAttribute(new Float32Array(Q),4)),D.setAttribute("aSw",new e.InstancedBufferAttribute(new Float32Array(W),4)),D.instanceCount=Q.length/4,j(new e.Mesh(D,H))};if(f.rHi.length&&K(he,f.rHi,f.sHi),f.rLo.length&&K(pe,f.rLo,f.sLo),f.sp.length){const F=new e.InstancedBufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),F.setIndex([0,1,2,0,2,3]),F.setAttribute("aPos",new e.InstancedBufferAttribute(new Float32Array(f.sp),4)),F.setAttribute("aSw",new e.InstancedBufferAttribute(new Float32Array(f.spS),4)),F.setAttribute("aCol",new e.InstancedBufferAttribute(new Float32Array(f.spC),3)),F.instanceCount=f.sp.length/4,j(new e.Mesh(F,xe))}if(f.st.length){const F=new e.InstancedBufferGeometry;F.setAttribute("position",new e.Float32BufferAttribute(B,3)),F.setIndex(ne),F.setAttribute("aPos",new e.InstancedBufferAttribute(new Float32Array(f.st),4)),F.setAttribute("aSw",new e.InstancedBufferAttribute(new Float32Array(f.stS),4)),F.instanceCount=f.st.length/4,j(new e.Mesh(F,fe))}T.rings+=(f.rHi.length+f.rLo.length)/4,T.ringsHi+=f.rHi.length/4,T.sprites+=f.sp.length/4,T.strands+=f.st.length/4}return he.dispose(),pe.dispose(),{group:d,arms:l,counts:T}}function Xt(){const o=Be(),a=c("#D9A04A"),w=c("#F8ECD8"),b=c(q[1]).lerp(c(q[0]),.35),g=[[0,0,0],[0,-.75,.8],[0,-.55,1.75],[0,.35,2.3],[0,.95,2.6]].map(y=>new e.Vector3(...y));o.add(new e.TubeGeometry(new e.CatmullRomCurve3(g),5,.12,3,!1),null,a,[0,0,0,0]);const z=o.P.length/3,C=6;o.lathe(0,2.6,[[.1,.9,0,a],[.4,1.02,0,a],[.5,1.4,2,w],[.68,1.88,2,w],[.72,2,0,a],[.9,2.3,2,b]],C,0,0);const x=z+5*(C+1);for(let y=0;y<=C;y++){const t=(x+y)*3,h=y%2===0;o.P[t+1]+=h?.1:-.14,h||(o.P[t]*=.9,o.P[t+2]=2.6+(o.P[t+2]-2.6)*.9)}return o.build()}function bt(o,a,w){return[[.05,o,0,a],[.5,o-.15,0,a],[.75,o-.6,0,a],[1.3,o-1.1,0,a],[1.85,o-2,0,a],[2.05,o-2.5,2,w],[2.15,o-3.3,2,w],[2.2,o-3.5,0,a],[2.45,o-4.3,0,a],[2.75,o-4.8,0,a],[2.6,o-4.9,0,a]]}function zt(o){const a=Be(),w=c("#E2A94C"),b=c("#F7E4C4"),g=c("#FFC878"),z=c("#CDBBD8"),C=o>0?-o:-1.9;return a.lathe(0,0,bt(C,w,b),12,0,0),a.add(new e.SphereGeometry(.42,6,5),new e.Matrix4().makeTranslation(0,C-5,0),g,[0,0,4,0]),a.add(new e.TorusGeometry(2.1,.09,4,12).rotateX(Math.PI/2),new e.Matrix4().makeTranslation(0,C-2.9,0),g,[0,0,4,0]),o>0?a.add(new e.CylinderGeometry(.07,.07,o,5,1,!0),new e.Matrix4().makeTranslation(0,-o/2,0),z,[0,0,5,0]):(a.add(new e.CylinderGeometry(.07,.07,1.9,5,1,!0),new e.Matrix4().makeTranslation(0,-.95,0),w,[0,0,0,0]),a.add(new e.TorusGeometry(.34,.1,5,10).rotateY(Math.PI/2),new e.Matrix4().makeTranslation(0,.34,0),w,[0,0,0,0])),a.build()}function Yt(){const o=Be(),a=(t,h,s,d=1,l=d,M=d,m=0)=>new e.Matrix4().compose(new e.Vector3(t,h,s),new e.Quaternion().setFromEuler(new e.Euler(m,0,0)),new e.Vector3(d,l,M)),w=c("#E9C9A0"),b=c("#D9A04A"),g=c("#FFC070"),z=c("#CDBBD8");o.add(new e.SphereGeometry(1,8,4,0,N,Math.PI/2,Math.PI/2),a(0,0,0,1.5,1.3,5.2),w,[0,0,2,0]),o.add(new e.TorusGeometry(1,.07,4,12).rotateX(Math.PI/2),a(0,0,0,1.5,1,5.2),b,[0,0,0,0]);const C=[c(q[6]).lerp(c(q[1]),.5),c(q[0]),c(q[3]),c(q[5])],x=new e.Matrix4().compose(new e.Vector3(0,11,1.5),new e.Quaternion().setFromEuler(new e.Euler(-.5,0,0)),new e.Vector3(1,1,1)),y=[[0,7.5],[5.2,1.5],[0,-6.5],[-5.2,1.5]];for(let t=0;t<4;t++){const h=y[t],s=y[(t+1)%4],d=new e.BufferGeometry;d.setAttribute("position",new e.Float32BufferAttribute([0,1.5,.6,h[0],h[1],0,s[0],s[1],0],3)),d.computeVertexNormals(),o.add(d,x,C[t],[t*1.3,0,3,.6])}for(let t=0;t<7;t++)o.add(new e.PlaneGeometry(1.5,.9),a(0,6.2-t*1.25,6.4+t*1.5,1,1,1,-.5),C[t%4],[t*2.1,0,3,1.5+t*.5]);for(const[t,h]of[[0,-4.4],[0,4.4],[-1.5,0],[1.5,0]]){const s=new e.Vector3(t,.2,h),d=new e.Vector3(t*2.2,8.5,1.5+h*.5),l=d.clone().sub(s),M=l.length(),m=new e.Matrix4().compose(s.clone().add(d).multiplyScalar(.5),new e.Quaternion().setFromUnitVectors(new e.Vector3(0,1,0),l.normalize()),new e.Vector3(1,M,1));o.add(new e.CylinderGeometry(.03,.03,1,4,1,!0),m,z,[0,0,5,0])}for(let t=0;t<5;t++)o.add(new e.SphereGeometry(.42,6,5),a((t%2?1:-1)*1.7,-.9-.25*Math.sin(t*2.1),-3.6+t*1.8),g,[0,0,4,0]);return o.build()}function At(o){const a=Be(),w=c("#FFE2A6"),b=c("#FF7A59"),g=c("#FFF6EA"),z=c("#FFD0A0"),C=new e.SphereGeometry(1,14,10),x=C.attributes.position,y=[];for(let s=0;s<x.count;s++){const d=x.getZ(s),l=d>0?Math.sqrt(Math.max(0,1-d*d*.55)):.25+.75*Math.pow(1+d,.8)*(1-.2*d*d),M=d>0?1:l;x.setXYZ(s,x.getX(s)*2.3*M,x.getY(s)*3*M,d*10.5);const m=Math.sin(d*7.3+x.getX(s)*1.9+o.range(-.4,.4))+Math.sin(d*3.1-x.getY(s)*1.3),v=m>.75?b:m<-1.1?g:w;y.push(v.r,v.g,v.b)}C.computeVertexNormals();const t=a.P.length/3;a.add(C,null,w,[0,0,2,0]);for(let s=0;s<y.length;s++)a.C[t*3+s]=y[s];const h=(s,d,l,M,m)=>{const v=new e.BufferGeometry;v.setAttribute("position",new e.Float32BufferAttribute([...s,...d,...l],3)),v.computeVertexNormals(),a.add(v,null,M,[o()*6,0,3,m])};h([0,0,-9.5],[0,5.5,-16],[0,0,-13],b,2.5),h([0,0,-9.5],[0,0,-13],[0,-5.5,-16],z,2.5),h([0,2.6,3],[0,5.6,-2],[0,2.2,-5],b,1.2);for(const s of[-1,1])h([s*2,-1,4],[s*6.5,-2.5,0],[s*2,-1.4,.5],z,1.5),h([s*1.4,-2,-3],[s*4,-4,-6],[s*1.2,-2,-5.5],z,1.2);return a.build()}function $t(o,a,w,b){const g=c("#D9A04A"),z=c("#C4B0D2"),C=c("#F4E6D2"),x=c("#FFC878"),y=new e.Vector3(0,1,0),t=new e.Vector3,h=new e.Vector3,s=new e.Vector3,d=(B,ne,ue,T=5)=>{const n=[],f=[],V=[],j=[],K=[];for(let W=0;W<B.length;W++){h.subVectors(B[Math.min(B.length-1,W+1)],B[Math.max(0,W-1)]).normalize(),s.crossVectors(h,y).normalize();const D=new e.Vector3().crossVectors(s,h);for(let X=0;X<5;X++){const ee=X/5*N,Y=s.x*Math.cos(ee)+D.x*Math.sin(ee),ae=s.y*Math.cos(ee)+D.y*Math.sin(ee),le=s.z*Math.cos(ee)+D.z*Math.sin(ee);n.push(B[W].x+Y*ne,B[W].y+ae*ne,B[W].z+le*ne),f.push(Y,ae,le),V.push(ue.r,ue.g,ue.b),j.push(0,0,T,0)}}for(let W=0;W<B.length-1;W++)for(let D=0;D<5;D++){const X=W*5+D,ee=W*5+(D+1)%5;K.push(X,ee,X+5,ee,ee+5,X+5)}const Q=new e.BufferGeometry;return Q.setAttribute("position",new e.Float32BufferAttribute(n,3)),Q.setAttribute("normal",new e.Float32BufferAttribute(f,3)),Q.setAttribute("color",new e.Float32BufferAttribute(V,3)),Q.setAttribute("aSw",new e.Float32BufferAttribute(j,4)),Q.setIndex(K),Q},l=[];for(let B=0;B<=460;B++)a.posAtDist(-90+(a.length+90)*B/460,t),l.push(new e.Vector3(t.x,t.y+1.636,t.z));const M=ge(o);M.uniforms.uNearCut.value=5.5;const m=c("#E0A850"),v=Be();v.add(d(l,.04,m,6),null,m,[0,0,6,0]);for(let B=14;B<a.length-18;B+=25)a.posAtDist(B,t),v.add(new e.CylinderGeometry(.1,.1,.34,5,1),new e.Matrix4().makeTranslation(t.x,t.y+1.636-.13,t.z),g,[0,0,0,0]),v.add(new e.SphereGeometry(.24,6,4),new e.Matrix4().makeTranslation(t.x,t.y+1.636-.52,t.z),x,[0,0,4,0]);const I=new e.Mesh(v.build(),M);I.frustumCulled=!1;const _=ge(o),E=w.map(B=>new e.Vector3(B.pos.x+B.right.x*b,B.pos.y+1.636,B.pos.z+B.right.z*b)),S=[];for(let B=0;B+1<E.length;B++)S.push(ct(E[B],E[B+1],25,40));const u=Be(),O=new e.Matrix4,re=new e.Quaternion,G=[],R=(B,ne,ue,T,n)=>{const f=ne.clone().sub(B),V=f.length();O.compose(B.clone().add(ne).multiplyScalar(.5),re.setFromUnitVectors(y,f.normalize()),new e.Vector3(1,V,1)),u.add(new e.CylinderGeometry(ue,ue,1,5,1,!0),O,T,[0,0,n,0])};for(const B of w){const ne=B.pos,ue=B.right,T=(j,K)=>new e.Vector3(ne.x+ue.x*j,ne.y+K,ne.z+ue.z*j);R(T(-3.5,7),T(b+3.5,7),.28,g,0);for(const j of[0,b])R(T(j,7),T(j,2.5),.07,g,0),O.compose(T(j,2.05),re.setFromUnitVectors(new e.Vector3(0,0,1),ue),new e.Vector3(1,1,1)),u.add(new e.TorusGeometry(.4,.09,5,12),O,g,[0,0,0,0]);const n=T(b/2,30);R(T(-3.5,7),n,.08,z,5),R(T(b+3.5,7),n,.08,z,5),R(n,new e.Vector3(n.x,608,n.z),.1,z,5),u.lathe(n.x,n.z,[[.1,n.y+2.4,0,g],[.9,n.y+.8,0,g],[.1,n.y-.8,0,g]],8,0,0);const f=T(b/2+1.5,7.6);u.lathe(f.x,f.z,[[.1,f.y+3.4,0,g],[1.6,f.y+2.2,2,c(q[1])],[3.6,f.y+.9,2,C],[4.3,f.y+.5,0,g],[4.1,f.y+.2,0,g]],12,0,0),G.push(new e.Vector3(f.x,f.y-.5,f.z));const V=[T(-2.3,7),T(-2.3,4.4),T(-2.42,3.6),T(-2.8,3.2),T(-3.2,3.5),T(-3.22,4.1)];u.add(new e.TubeGeometry(new e.CatmullRomCurve3(V),12,.09,4,!1),null,g,[0,0,0,0]),R(T(-2.3,5.2),T(-.5,2.5),.05,g,0),R(T(-3.5,7),T(-3.5,6.4),.05,g,0),u.add(new e.SphereGeometry(.2,6,4),new e.Matrix4().makeTranslation(T(-2.8,3).x,ne.y+2.9,T(-2.8,3).z),x,[0,0,4,0]),u.add(new e.SphereGeometry(.45,6,5),new e.Matrix4().makeTranslation(T(b+3.5,6).x,ne.y+6,T(b+3.5,6).z),x,[0,0,4,0]),u.add(new e.SphereGeometry(.45,6,5),new e.Matrix4().makeTranslation(T(-3.5,6).x,ne.y+6,T(-3.5,6).z),x,[0,0,4,0])}const H=new e.Mesh(u.build(),ge(o));H.frustumCulled=!1;const xe=[];for(const B of S)for(const ne of B)xe.push(ne);const fe=new e.Mesh(d(xe,.03,z),_);fe.frustumCulled=!1;const he=Be();he.lathe(0,0,bt(0,g,g).map(B=>[B[0]*.46,B[1]*.46-.2,0,g]),10,0,0),he.add(new e.CylinderGeometry(.04,.04,.3,4,1),new e.Matrix4().makeTranslation(0,-.08,0),g,[0,0,0,0]),he.add(new e.SphereGeometry(.2,6,4),new e.Matrix4().makeTranslation(0,-2.35,0),x,[0,0,4,0]);const pe=new e.InstancedMesh(he.build(),ge(o),G.length);return pe.frustumCulled=!1,{cable:I,ret:fe,rig:H,spans:S,bells:G,bellMesh:pe}}function Zt(o,a,w,b,g){const x=new Uint8Array(65536),y=new Float32Array(256*256),t=(l,M,m,v)=>{const I=(l/4200+.5)*256,_=(M/4200+.5)*256,E=Math.max(1.6,m/4200*256),S=Math.ceil(E*2);for(let u=Math.max(0,Math.floor(_-S));u<=Math.min(255,Math.ceil(_+S));u++)for(let O=Math.max(0,Math.floor(I-S));O<=Math.min(255,Math.ceil(I+S));O++){const re=((O+.5-I)*(O+.5-I)+(u+.5-_)*(u+.5-_))/(E*E);y[u*256+O]+=v*Math.exp(-re*1.6)}};for(const l of w)t(l.x,l.z,1.6*l.R+34,.5+.0012*l.len);t(0,0,300,1);for(let l=0;l<40;l++)t(Math.sin(l/40*N)*215,Math.cos(l/40*N)*215,70,.1);for(let l=0;l<256*256;l++)x[l]=Math.min(255,Math.round(y[l]*190));const h=new e.DataTexture(x,256,256,e.RedFormat,e.UnsignedByteType);h.magFilter=h.minFilter=e.LinearFilter,h.needsUpdate=!0;const s=new e.ShaderMaterial({transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8,uniforms:{uTime:o.uniforms.uTime,uMap:{value:h},uDensity:{value:g},uSwell:{value:c(a.seaScat)},uPathC:{value:c(a.pathC)},uPool:{value:c(a.pool||"#FFE2A6")},uSun:{value:new e.Vector2(b.x,b.z).normalize()},uPathI:{value:a.pathI},uPoolI:{value:a.poolI},uPoolBrk:{value:a.poolBrk||0},uSpan:{value:4200},uPix:o.pix},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:`
uniform float uTime, uDensity, uPathI, uPoolI, uPoolBrk, uSpan, uPix; uniform vec3 uSwell, uPathC, uPool; uniform vec2 uSun; uniform sampler2D uMap;
varying vec3 vW;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
${et}
// pin-point glints: one twinkling dot in about every other cell, the cell kept a few pixels wide at any distance
float spark(vec2 p){ vec2 i = floor(p), f = fract(p); float r = h21(i), r2 = h21(i + 17.3);
  float tw = 0.5 + 0.5*sin(uTime*(1.6 + r*4.0) + r2*40.0); tw *= tw; tw *= tw;
  float d = length(f - 0.5 - (vec2(r, r2) - 0.5)*0.56);
  return smoothstep(0.26, 0.05, d)*tw*step(0.42, fract(r2*7.31 + r)); }
float glit(vec2 xz, float cell){ float l = log2(max(cell, 0.05)), l0 = floor(l), t = l - l0;
  return mix(spark(xz/exp2(l0)), spark(xz/exp2(l0 + 1.0) + 17.3), t); }
void main(){
  vec3 V = vW - cameraPosition; float dist = length(V), hd = max(length(V.xz), 1e-3);
  float f = exp(-uDensity*uDensity*dist*dist);
  vec2 p = vW.xz;
  // long slow swell lines: three trains of slightly bent crests, each with a thin bright crest line
  float b1 = vn(p*0.0019 + 1.7)*2.6, b2 = vn(p*0.0027 + 8.3)*2.4;
  float w1 = sin(dot(p, vec2(0.0152, 0.0074)) + uTime*0.34 + b1);
  float w2 = sin(dot(p, vec2(-0.0068, 0.0231)) - uTime*0.29 + b2);
  float w3 = sin(dot(p, vec2(0.041, 0.027)) + uTime*0.62 + b1*1.7 + b2);
  float nearK = smoothstep(1900.0, 500.0, dist);
  float sw = smoothstep(0.2, 1.0, w1)*0.62 + smoothstep(0.35, 1.0, w2)*0.42 + smoothstep(0.55, 1.0, w3)*0.2*nearK;
  float crest = smoothstep(0.9, 1.0, w1)*0.5 + smoothstep(0.92, 1.0, w2)*0.35;
  float lull = 0.45 + 0.55*vn(p*0.0012 + 3.7);
  vec3 c = uSwell*(sw*0.24 + crest*0.16*nearK)*lull;
  // the sun's glitter path: a soft sheen in a narrow wedge toward the sun, crowded with pin-point glints that bloom
  float al = dot(V.xz/hd, uSun), x = max(1.0 - al, 0.0);
  float core = exp(-x/0.010), wide = exp(-x/0.07);
  float reachK = smoothstep(90.0, 600.0, hd);
  float cell = dist*uPix*5.5/sqrt(max(-V.y/dist, 0.03));
  float g1 = glit(p, cell), g2 = glit(p*1.37 + 91.0, cell);
  float onCrest = 0.55 + 0.45*smoothstep(-0.2, 0.8, w3)*nearK + 0.3*sw;
  c += uPathC*uPathI*reachK*(core*(0.16 + 0.10*sw) + wide*0.035 + (core*1.0 + wide*0.22)*(g1 + g2)*4.5*onCrest);
  // warm pools of reflected candle-light under every chandelier, breathing with the ripples and pricked with glints
  float pool = texture2D(uMap, p/uSpan + 0.5).r;
  float rip = 0.5 + 0.5*vn(p*0.021 + vec2(uTime*0.32, -uTime*0.21));
  // a look may break each pool into long dashes of gold, dark between them: three drifting noise fields laid along the crest direction of the first swell train (uPoolBrk 0: the whole pool, as ever)
  float brk = 1.0;
  if (uPoolBrk > 0.0) {
    vec2 pc = vec2(dot(p, vec2(0.899, 0.438)), dot(p, vec2(-0.438, 0.899)));                            // across the first swell train's crests, along them
    float d1 = vn(vec2(pc.x*0.062 + uTime*0.30 + b1, pc.y*0.0115)), d2 = vn(vec2((pc.x + pc.y*0.22)*0.095 - uTime*0.41, pc.y*0.019 + 5.3 + b2));
    float d3 = vn(vec2((pc.x - pc.y*0.15)*0.21 + uTime*0.6, pc.y*0.043 + 2.9));
    brk = mix(1.0, 0.08 + (1.3*smoothstep(0.50, 0.84, d1) + 1.0*smoothstep(0.54, 0.88, d2))*(0.35 + 1.1*smoothstep(0.3, 0.8, d3)), uPoolBrk);
  }
  c += uPool*uPoolI*pool*(0.5 + 0.5*rip + 0.25*sw + 3.0*g2)*brk;
  gl_FragColor = vec4(c*f, 1.0);
}`}),d=new e.Mesh(new e.PlaneGeometry(11e3,11e3).rotateX(-Math.PI/2),s);return d.position.y=4,d.renderOrder=1.2,d.frustumCulled=!1,d}function Jt(o,a){const w=new e.ShaderMaterial({transparent:!0,depthWrite:!1,side:e.DoubleSide,uniforms:{uHaze:{value:c(o.haze)},uTop:{value:c(o.haze).lerp(c("#FBF1E1"),o.disc?.7:.25)},uFog:{value:c(o.fog)},uSun:{value:new e.Vector2(a.x,a.z).normalize()},uA:{value:o.disc?.9:.7},uEdge:{value:o.edge||0}},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }",fragmentShader:`
uniform vec3 uHaze, uTop, uFog; uniform vec2 uSun; uniform float uA, uEdge; varying vec3 vD;
void main(){
  float hd = max(length(vD.xz), 1.0), el = atan(vD.y/hd)*57.2958;
  float s = max(dot(vD.xz/hd, uSun), 0.0), q = (el + 1.3)/mix(3.3, 4.3, s);
  float g = exp(-q*q);
  vec3 c = mix(uHaze, uTop, smoothstep(-1.0, 5.0, el)*0.75);
  c = mix(c, mix(uFog, uHaze, 0.55), smoothstep(-1.5, -7.0, el)*0.7);
  c *= 1.0 + 0.22*s*s*s;
  c = mix(c, uFog, (1.0 - smoothstep(-0.9, 0.15, el))*uEdge);   // uEdge 1: under the sea's far line the band is the deep air, the glow lies only above it, so the horizon is told (0: a glow and no line, as ever)
  gl_FragColor = vec4(c, g*uA*(0.72 + 0.28*s));
}`}),b=new e.Mesh(new e.CylinderGeometry(4800,4800,2400,48,12,!0),w);return b.renderOrder=1.6,b.frustumCulled=!1,b}function eo(o,a,w){const g=w.length*22,z=new Float32Array(g*4),C=new Float32Array(g*4);for(let s=0;s<g;s++){const d=Math.floor(s/22),l=o()*N,M=w[d];z.set([M.x,M.y,M.z,d],s*4),C.set([Math.cos(l),o.range(.25,1),Math.sin(l),o()],s*4)}const x=new e.InstancedBufferGeometry;x.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),x.setIndex([0,1,2,0,2,3]),x.setAttribute("aPos",new e.InstancedBufferAttribute(z,4)),x.setAttribute("aDir",new e.InstancedBufferAttribute(C,4)),x.instanceCount=g;const y={value:new e.Vector2(0,0)},t=new e.ShaderMaterial({transparent:!0,depthWrite:!1,uniforms:{uK:y,uCol:{value:c(a.lit).lerp(c(a.warm),.15)}},vertexShader:`
uniform vec2 uK; attribute vec4 aPos, aDir; varying vec2 vQ; varying float vA;
void main(){
  float k = aPos.w < 0.5 ? uK.x : uK.y, r = aDir.w;
  float e = 1.0 - (1.0 - k)*(1.0 - k);
  vec3 p = aPos.xyz + vec3(aDir.x, 0.0, aDir.z)*(4.0 + (16.0 + 26.0*r)*e);
  p.y += -(10.0 + 26.0*aDir.y)*4.0*k*(1.0 - k)*(0.4 + 0.6*r) + 3.0;
  vec4 mv = viewMatrix*vec4(p, 1.0);
  vQ = position.xy; vA = smoothstep(0.0, 0.08, k)*(1.0 - smoothstep(0.55, 1.0, k))*(0.5 + 0.5*r);
  mv.xy += position.xy*(5.0 + (9.0 + 12.0*r)*e)*step(0.0005, vA);          // collapsed to nothing while idle (always drawn: no late compile)
  gl_Position = projectionMatrix*mv;
}`,fragmentShader:`
uniform vec3 uCol; varying vec2 vQ; varying float vA;
void main(){ float d = dot(vQ, vQ); float a = (1.0 - smoothstep(0.1, 1.0, d))*vA*0.55; gl_FragColor = vec4(uCol, a); }`}),h=new e.Mesh(x,t);return h.frustumCulled=!1,h.renderOrder=5,{mesh:h,uK:y}}var no={id:"chandelier-city",name:"The Chandelier City",category:"bizarre",weirdness:.85,media:["cable","air"],async build(o){const a=o.rng,w=o.vary||{hour:"any",rare:!1,density:1,mood:.5},b=a.fork("cc-variant"),g=o.quality&&o.quality.detail||1,z=Math.min(1.3,Math.max(.7,w.density||1)),C=Math.min(z,1.1),x=b.pick(["sunrise","sunset","bluehour"]),y=w.hour==="night"?"bluehour":w.hour==="golden"?"sunset":w.hour==="dawn"||w.hour==="day"?"sunrise":x,t=Rt[y],h=b.pick(["still","breezy","rainy"]),s=b.pick(["wisteria","wisteria","autumn","blossom"]),d=Wt[s],l=b.chance(.4),M=b.chance(.5),m=!!w.rare,v=h==="breezy",I=h==="rainy",_=383e-6*(I?1.5:1),E=46,S=new e.Scene;S.fog=new e.FogExp2(c(t.fog),_);const u=Tt([[276,570,786],[242,569,757],[211,557,731],[165,521,693],[119,477,654],[81,449,622],[58,442,603],[25,424,575],[-13,415,543],[-52,425,510],[-88,442,478],[-78,434,450],[-44,414,385],[-16,428,325],[-2,439,292],[0,436,262],[0,428,190],[0,419,110],[0,412,55],[0,410,0]]),O=(p,A)=>{const r=u.nearestXZ(p,A),i=u.pointAt(r.u),P=u.tangentAt(r.u);return{u:r.u,pos:i,right:new e.Vector3(-P.z,0,P.x).normalize()}},re=O(58,603),G=O(-88,478),R=O(-2,292),H=O(-13,543),xe=O(-44,385),fe=Math.PI/180,he=new e.Vector3(Math.sin(t.az*fe)*Math.cos(t.el*fe),Math.sin(t.el*fe),-Math.cos(t.az*fe)*Math.cos(t.el*fe)),pe=await Gt(o,{palette:q,sunDir:he,sunColor:t.sun,sunIntensity:t.sunI,sway:v?2.2:1,crystalDensity:.75*g}),B=pe.uniforms,ne=c(q[0]),ue=c(q[1]),T=c(q[3]),n=c(q[4]);B.uSkyUp.value.copy(ne).lerp(c(t.upMix[0]),t.upMix[1]).multiplyScalar(t.up),B.uSkyDn.value.copy(T).lerp(c(t.dnMix[0]),t.dnMix[1]).multiplyScalar(t.dn),B.uHaze.value.set(t.haze).multiplyScalar(.9),B.uGlow.value=t.glow,S.add(pe.object);const f=[];for(let p=0;p<9;p++)f.push(new e.Vector4(0,9e4,0,1));const V={uniforms:B,breeze:{value:v?2.2:1},lean:{value:new e.Vector2(v?.0052:8e-4,v?.002:3e-4)},pix:{value:.001},cloudC:{value:c(t.lit).lerp(c(t.warm),.18).multiplyScalar(.9)},koi:{value:f},dimp:{value:[new e.Vector3(0,9e4,0),new e.Vector3(0,9e4,0)]},litShare:{value:y==="bluehour"?.93:y==="sunset"?.8:.66},gold:B.uGold.value};await o.yield();const j=t.hzn?c(t.hzn):c(t.fog).lerp(c(t.haze),.5),K="#"+j.getHexString(),F=It({rng:a,preset:"dawn",zenith:t.fog,mid:t.fog,horizon:K,ground:K,horizonPow:4.5,groundFalloff:1.2,sunElevation:t.disc?1.3:-5,sunAzimuth:t.az,sunColor:t.disc||"#8088ff",sunSize:2.4,sunIntensity:0,sunGlow:0,scatterColor:t.haze,scatter:t.scatter??.5,clouds:!1,clouds2:!1,stars:0,bodies:[],lightColor:t.sun,lightIntensity:1.5,ambientColor:t.amb||t.lit,groundLight:q[3],ambientIntensity:1.05,fogColor:t.fog});S.add(F.object),await o.yield();const Q=Nt(F,{bounce:.5});S.add(Q.object);const W=Et.makeOcean({rng:a,sky:F,preset:"swell",deep:t.sea,scatter:t.seaScat,radius:5200,rings:60,segments:96,foam:0,glitter:1,glint:y==="bluehour"?.35:1,fogColor:K,horizonColor:K});S.add(W.object),await o.yield();const D=Kt(V,t,_);S.add(D),await o.yield();let X=null;const ee=new e.Vector3(Math.sin(t.az*fe),Math.sin(1.7*fe),-Math.cos(t.az*fe)).normalize();t.disc&&(X=new e.Mesh(new e.PlaneGeometry(1,1),new e.ShaderMaterial({transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,uniforms:{uCol:{value:c(t.disc)}},vertexShader:"varying vec2 vQ; void main(){ vQ = uv*2.0 - 1.0; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }",fragmentShader:"uniform vec3 uCol; varying vec2 vQ; void main(){ float d = length(vQ); float disc = smoothstep(0.30, 0.265, d); float g = exp(-d*4.5)*(1.0 - smoothstep(0.6, 1.0, d)); float limb = 0.82 + 0.18*smoothstep(0.30, 0.05, d); gl_FragColor = vec4((uCol*1.25 + vec3(0.22, 0.10, 0.04))*disc*limb + uCol*g*0.55*(1.0 - disc*0.7), disc*0.94); }"})),X.scale.setScalar(2300),X.renderOrder=1.7,X.frustumCulled=!1,S.add(X));const Y=Jt(t,ee);S.add(Y),await o.yield();const ae=[{x:xe.pos.x,z:xe.pos.z,r:I?34:30}],le=I?12:6;I&&ae.push({x:H.pos.x+H.right.x*105,z:H.pos.z+H.right.z*105,r:36});for(let p=0;ae.length<le&&p<300;p++){const A=a()*N,r=a.range(430,1500),i=Math.sin(A)*r,P=Math.cos(A)*r;u.nearestXZ(i,P).dist<110||Math.abs(i)<110&&P>0||ae.some(te=>Math.hypot(te.x-i,te.z-P)<230)||ae.push({x:i,z:P,r:a.range(26,34)*(I?1.25:1)})}const k=jt(V,a.fork("rain"),ae,Math.round((I?620:480)*g),t,_);S.add(k.cols,k.streaks),await o.yield();const ce=24,ye=ce+19,Fe={x:H.pos.x-H.right.x*ye,z:H.pos.z-H.right.z*ye,R:ce,tiers:4,len:285,top:ze-60,near:!0,ph:a.range(0,N),amp:.005,seed:a(),widest:1,ringAt:{k:1,y:H.pos.y-.5}},Ae=u.posAtDist(195),Ve=u.tangentAtDist(195),He={x:Ae.x-Ve.z*42,z:Ae.z+Ve.x*42,R:21,tiers:5,len:300,top:ze-50,near:!0,ph:a.range(0,N),amp:.008,seed:a(),widest:0},Re=[Fe,He],Se=a.fork("dive");[.07,.115,.16,.205].forEach((p,A)=>{const r=u.pointAt(p),i=u.tangentAt(p).setY(0).normalize(),P=Se.range(19,26);for(const te of A%2?[1,-1]:[-1,1]){const J=(P+Se.range(46,72))*te,U=r.x-i.z*J+i.x*60,$=r.z+i.x*J+i.z*60;if(!(Re.some(oe=>Math.hypot(oe.x-U,oe.z-$)<oe.R+P+46)||u.nearestXZ(U,$).dist<P+30)){Re.push({x:U,z:$,R:P,tiers:6,len:Se.range(345,398),top:ze-Se.range(40,60),near:!0,ph:Se.range(0,N),amp:Se.range(.009,.013),seed:Se(),widest:A%2});break}}});const Z=Ot(a.fork("towers"),u,ae,C,Re);await o.yield();const L=await Ht(V,a.fork("city"),Z,u,d,{lush:C,flags:l,pause:()=>o.yield()});await o.yield();const me=Zt(V,t,Z,ee,_);if(S.add(me),S.add(L.group),await o.yield(),L.arms.length){const p=L.arms.length/7,A=Xt(),r=new Float32Array(p*2),i=new e.InstancedMesh(A,ge(V,{INST_SWAY:1}),p),P=new e.Matrix4,te=new e.Quaternion,J=new e.Vector3(0,1,0),U=new e.Vector3,$=new e.Vector3;for(let oe=0;oe<p;oe++){const ie=oe*7,ke=L.arms[ie+4]*1.15;P.compose(U.set(L.arms[ie],L.arms[ie+1],L.arms[ie+2]),te.setFromAxisAngle(J,L.arms[ie+3]),$.set(ke,ke,ke)),i.setMatrixAt(oe,P),r[oe*2]=L.arms[ie+5],r[oe*2+1]=L.arms[ie+6]}A.setAttribute("aIs",new e.InstancedBufferAttribute(r,2)),i.frustumCulled=!1,S.add(i)}await o.yield();const ve=16,se=$t(V,u,[re,G,R],ve);S.add(se.cable,se.ret,se.rig,se.bellMesh),await o.yield();const We=[re.u,G.u,R.u],Xe=zt(0),Ke=se.spans.length*3,Me=new e.InstancedMesh(Xe,ge(V),Ke);Me.frustumCulled=!1,S.add(Me);const dt=[];for(let p=0;p<Ke;p++)dt.push(p%3/3+a.range(-.08,.08));await o.yield();const St=180,De=[],Ie=a.fork("gondolas");for(let p=0;De.length<Math.round(19*z)&&p<1500;p++){(p&31)===31&&await o.yield();const A=u.pointAt(Ie.range(.04,.92)),r=Ie()*N,i=Ie.range(55,430),P=A.x+Math.cos(r)*i,te=A.z+Math.sin(r)*i,J=Ie()*N;let U=De.some($=>Math.hypot($.x-P,$.z-te)<60);for(let $=-100;$<=100&&!U;$+=20){const oe=P+Math.cos(J)*$,ie=te-Math.sin(J)*$,ke=ze-Math.sqrt(34225-$*$);(Math.hypot(oe,ie)<300||u.distanceTo(oe,ke,ie)<26||u.nearestXZ(oe,ie).dist<9)&&(U=!0);for(const Ge of Z)if(Math.hypot(oe-Ge.x,ie-Ge.z)<Ge.R+14){U=!0;break}}U||De.push({x:P,z:te,az:J,ph:Ie()*N,T:27.3*Ie.range(.97,1.03)})}const _e=new e.InstancedMesh(zt(St),ge(V),Math.max(1,De.length));_e.frustumCulled=!1,_e.count=De.length,S.add(_e),await o.yield();const Te=a.fork("kites"),Ne=[],ot=Z.filter(p=>p.pd>p.R+85&&p.pd<800);for(let p=0;p<Math.round((l?16:9)*z)&&ot.length;p++){const A=ot[Te.int(0,ot.length-1)];Ne.push({x:A.x,z:A.z,r:A.R+Te.range(30,44),y:Te.range(430,545),ph:Te()*N,dir:Te.chance(.5)?1:-1,sp:Te.range(4.5,7.5),s:Te.range(1.3,1.9)})}{const p=u.posAtDist(330),A=u.startTangent,r=u.start.x+A.x*330,i=u.start.z+A.z*330;Ne.push({x:r+A.z*60,z:i-A.x*60,r:62,y:574,ph:Math.atan2(-A.z,A.x)+Math.PI,dir:1,sp:5,s:2.2})}const Qe=new e.InstancedMesh(Yt(),ge(V),Math.max(1,Ne.length));Qe.frustumCulled=!1,Qe.count=Ne.length,S.add(Qe),await o.yield();const Ct={sunDir:he,sunColor:t.sun,sunIntensity:1.5,sky:t.lit,skyIntensity:1,ground:q[3],groundIntensity:.95},Le=je.makeFauna(S,{light:Ct}),ft={body:"#6A66B0",belly:"#B9B4E6",wingC:"#5E5AA6",tailC:"#5E5AA6",head:"#6A66B0"};Le.add(je.makeFlock({rng:a,species:"swifts",count:Math.round(170*z*g),lod:"high",spread:[16,10,36],...ft,along:{path:u,side:24,up:5,lead:44,from:.08,to:.46,drift:10}}),{always:!0}),await o.yield();const at=Z.filter(p=>p.pd>60&&p.pd<380);for(let p=0;p<2&&at.length;p++){const A=at[a.int(0,at.length-1)],r=A.rings[Math.min(1,A.rings.length-1)];Le.add(je.makeFlock({rng:a,species:"swifts",count:Math.round(520*z*g),lod:"low",spread:[44,26,60],...ft,center:[A.x,Math.min(540,r.y-30),A.z],radius:A.R+55,height:30,speed:22,keepClear:{path:u,dist:2,each:!0}}),{always:!0}),await o.yield()}Le.add(je.makeFlock({rng:a,species:"gulls",count:Math.round(46*z),size:2.6,spread:[160,20,160],center:[xe.pos.x*.5,55,420],radius:260,height:25}),{always:!0}),await o.yield(),M&&Le.add(je.makeFlock({rng:a,species:"gulls",count:34,size:1.3,body:"#FFFFFF",belly:"#FFF6EE",wingC:"#F6EEF6",tip:"#E8DCEB",cross:{path:u,u:.63,lead:55,height:12,angle:70,span:320,duration:E}}),{always:!0}),await o.yield();const Ce=a.fork("cloud-koi"),Ft=At(a.fork("koi")),ht=ge(V,{KOI:1});ht.uniforms.uEmis.value=t.koiE;const Ye=new e.InstancedMesh(Ft,ht,9);Ye.frustumCulled=!1,S.add(Ye);const nt=[],pt=u.pointAt(.42),mt=u.pointAt(.6),vt=u.pointAt(.72),wt=u.pointAt(.22),kt=(p,A,r)=>{if(Math.hypot(p,A)-r<150)return!1;for(const i of Z)if(Math.abs(Math.hypot(i.x-p,i.z-A)-r)<9+i.R*.2)return!1;return!0},Pt=[[pt.x,pt.z,150,2],[xe.pos.x,xe.pos.z,120,2],[vt.x+40,vt.z,135,2],[wt.x,wt.z,200,2],[mt.x-120,mt.z+60,260,1]];for(const[p,A,r,i]of Pt){let P=null;for(let U=0;U<60&&!P;U++){const $=Ce()*N,oe=r*Ce.range(.55,1)+U*1.5,ie=r*Ce.range(.85,1.2),ke=p+Math.cos($)*oe*(ie/r),Ge=A+Math.sin($)*oe*(ie/r);kt(ke,Ge,ie)&&(P={cx:ke,cz:Ge,r:ie})}P||(P={cx:p+r,cz:A,r});const te=Ce.chance(.5)?1:-1,J=Ce()*N;for(let U=0;U<i;U++)nt.push({...P,dir:te,ph:J+U*(Math.PI*Ce.range(.8,1.2)),sp:Ce.range(4.4,5.6),roll:Ce()*N,s:Ce.range(.82,1)})}await o.yield();let de=null,st=null;if(m){const p=u.pointAt(.575),A=u.tangentAt(.575).setY(0).normalize(),r=new e.Vector3(-A.z,0,A.x),i=ge(V,{KOI:1});i.uniforms.uEmis.value=t.koiE+.1,de=new e.Mesh(At(a.fork("koi")),i),de.frustumCulled=!1,de.position.set(0,9e4,0),de.scale.setScalar(1.2),S.add(de);const P=p.clone().addScaledVector(r,-20).addScaledVector(A,30),te=P.clone().addScaledVector(A,-75).setY(604),J=P.clone().addScaledVector(A,75).setY(604);de.userData={c:P,t:A,prev:new e.Vector3,p0:te,p1:J},st=eo(a.fork("splash"),t,[te,J]),S.add(st.mesh)}await o.yield();const it={value:0},$e=ut.fxGroup();S.add($e.object),$e.add(ut.makeParticles({rng:a.fork("petals"),preset:s==="autumn"?"leaves":"petals",time:it,colors:d.petals,count:Math.round((s==="blossom"?1700:1150)*(v?2:1)*z*g),box:[64,40,64],size:[.14,.3],velocity:v?[8.2,-.45,3]:[.55,-1.05,.25],lightDir:[he.x,.5,he.z]})),await o.yield(),$e.add(ut.makeMist({rng:a.fork("wisps"),time:it,count:26,area:[520,22,520],center:[215,590,735],size:[45,100],color:t.lit,opacity:.2,drift:[1.4,0,.6]})),await o.yield();const we=new e.Matrix4,be=new e.Quaternion,Ze=new e.Quaternion,Ue=new e.Vector3,rt=new e.Vector3(1,1,1),gt=new e.Vector3,qe=new e.Vector3(0,1,0),lt=new e.Vector3(0,0,1),xt=new e.Vector3(1,0,0),Bt=new e.Vector2,Je=new e.Vector3,Ee=new e.Vector3,Vt=new e.Quaternion,yt=(p,A)=>{for(let r=0;r<nt.length;r++){const i=nt[r],P=i.ph+i.dir*p*i.sp/i.r,te=Math.sin(P),J=Math.cos(P);Je.set(i.cx+te*i.r,594.5+1.6*Math.sin(p*.23+i.roll),i.cz+J*i.r),Ee.set(J*i.dir,0,-te*i.dir);const U=Math.atan2(Ee.x,Ee.z)+.07*Math.sin(p*.9+i.roll);be.setFromAxisAngle(qe,U).multiply(Ze.setFromAxisAngle(lt,Math.PI+.42*Math.sin(p*.31+i.roll))).multiply(Vt.setFromAxisAngle(xt,.05*Math.sin(p*.4+i.roll*2))),we.compose(Je,be,gt.set(i.s,i.s,i.s)),Ye.setMatrixAt(r,we),f[r].set(Je.x,Je.z,Ee.x,Ee.z)}Ye.instanceMatrix.needsUpdate=!0;for(let r=0;r<se.bells.length;r++){const i=Math.exp(-Math.pow((A-We[r])/.035,2)),P=u.tangentAt(We[r]);be.setFromAxisAngle(Ee.set(P.x,0,P.z).normalize(),(.1+.42*i)*Math.sin(p*2.6+r*1.7)),we.compose(se.bells[r],be,rt),se.bellMesh.setMatrixAt(r,we)}se.bellMesh.instanceMatrix.needsUpdate=!0;for(let r=0;r<De.length;r++){const i=De[r],P=.55*Math.cos(N*p/i.T+i.ph);be.setFromAxisAngle(qe,i.az).multiply(Ze.setFromAxisAngle(lt,P)),we.compose(Ue.set(i.x,ze+1,i.z),be,rt),_e.setMatrixAt(r,we)}_e.instanceMatrix.needsUpdate=!0;for(let r=0;r<Ke;r++){const i=se.spans[Math.floor(r/3)],P=i.length-1,te=(1-(dt[r]+p*.012)%1)*P,J=Math.min(P-1,Math.floor(te)),U=i[J],$=i[J+1];Ue.lerpVectors(U,$,te-J),be.setFromAxisAngle(qe,Math.atan2($.x-U.x,$.z-U.z)).multiply(Ze.setFromAxisAngle(xt,.06*Math.sin(p*.9+r*2.1))),we.compose(Ue,be,rt),Me.setMatrixAt(r,we)}Me.instanceMatrix.needsUpdate=!0;for(let r=0;r<Ne.length;r++){const i=Ne[r],P=i.ph+i.dir*p*i.sp/i.r;Ue.set(i.x+Math.sin(P)*i.r,i.y+Math.sin(p*.4+i.ph*3)*3.5,i.z+Math.cos(P)*i.r),be.setFromAxisAngle(qe,P+(i.dir>0?-Math.PI/2:Math.PI/2)).multiply(Ze.setFromAxisAngle(lt,.12*Math.sin(p*.7+i.ph))),we.compose(Ue,be,gt.set(i.s,i.s,i.s)),Qe.setMatrixAt(r,we)}Qe.instanceMatrix.needsUpdate=!0},Dt=(p,A)=>{if(!de)return;const r=(p-.47)/.16,i=de.userData,P=V.dimp.value,te=r>0&&r<1,J=Math.min(1,Math.max(0,(r+.02)/.42)),U=Math.min(1,Math.max(0,(r-.9)/.5));if(st.uK.value.set(J,U),P[0].set(i.p0.x,i.p0.z,Oe(0,.06,J)*(1-Oe(.5,1,J))),P[1].set(i.p1.x,i.p1.z,Oe(0,.06,U)*(1-Oe(.5,1,U))),!te){de.position.set(0,9e4,0);return}const $=(oe,ie)=>ie.copy(i.c).addScaledVector(i.t,(oe-.5)*150).setY(616-752*oe*(1-oe));$(r,de.position),$(r+.01,i.prev),we.lookAt(i.prev,de.position,qe),de.quaternion.setFromRotationMatrix(we),de.rotateZ(.9*Math.sin(r*7)+.15*Math.sin(A*3)),de.rotateY(.12*Math.sin(A*5))};return yt(0,0),await o.yield(),await F.prewarm(o.renderer,null,S),{scene:S,path:u,duration:E,title:y==="bluehour"?"The Chandelier City, Blue Hour":y==="sunset"?"The Chandelier City at Sunset":"The Chandelier City",ride:"gondola",style:"none",camera:{fov:62,near:.5,far:9e3,lookAhead:26,sway:.5,bank:.25},pois:[{at:[0,505,0],from:.03,to:.5,weight:.6},{at:[0,480,0],from:.44,to:.8,weight:.5},{at:[0,410,0],from:.74,to:1,weight:.7}],portal:{shape:"circle",radius:7,color:t.portal,glow:.75,revealDistance:430},post:{exposure:t.exposure,bloom:{strength:t.bloom,radius:t.bloomR??.8,threshold:t.bloomT??.9},grade:{saturation:1.06,contrast:.97,tint:"#fff7f0",shadowTint:"#26265a",vignette:.22,grain:.02,aberration:0}},update(p,A,r,i){if(it.value=A,r&&r.projectionMatrix){const P=o.renderer&&o.renderer.getDrawingBufferSize&&o.renderer.getDrawingBufferSize(Bt).y||1080;V.pix.value=2/(r.projectionMatrix.elements[5]*P)}pe.update(p,A,r),pe.setProgress(.55*Oe(.76,1,i||0)),F.update(p,A,r),Q.update(p,A,r),W.update(p,A,r),Le.update(p,A,r,i),$e.update(p,A,r),Y.position.setFromMatrixPosition(r.matrixWorld),X&&(X.position.setFromMatrixPosition(r.matrixWorld).addScaledVector(ee,8e3),X.quaternion.setFromRotationMatrix(r.matrixWorld)),yt(A,i||0),Dt(i||0,A)},dispose(){F.dispose&&F.dispose(),pe.dispose&&pe.dispose()}}}};export{no as default};
