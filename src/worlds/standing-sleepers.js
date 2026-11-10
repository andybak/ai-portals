import*as e from"three";import{makePath as xt,clamp as Ve,smoothstep as k,makeRng as kt,hashSeed as Ct}from"../kit/core.js";import*as $e from"../kit/water.js";import{makeSky as St}from"../kit/sky.js";import*as U from"../kit/fauna.js";import*as X from"../kit/fx.js";import{buildHero as Ft}from"../parts/standing-sleepers.js";const Mt=["#F4B860","#DDE8EC","#1E6FA8","#0A3458","#03121F","#3B4046","#E9E4D8"],Xe=50,Ye=.55,zt=["golden","golden","golden","dawn","dawn","golden","noon","noon","moon","moon"],Tt=["weed","weed","weed","weed","weed","log","weed","log","bare","bare"],Ze=250.1,At={golden:{title:"The Standing Sleepers",sky:{preset:"goldenHour"},elev:24,sun:"#F4B860",fill:"#DDE8EC",deepFill:"#16324A",water:"#1E6FA8",deep:"#0A3458",ink:"#03121F",dens:.0128,gain:1.2,key:4,rim:1.7,caustics:1.5,fade:13,ray:"#F4B860",rayK:1.25,kitRays:.8,win:"#CFE1EC",warm:"#F4E3C0",winK:.36,haloK:.3,shade:.4,exposure:1.06,tint:"#fff8ee",shadow:"#02101c",sat:1,glowFrac:0,slate:[.0457,.0684,.1054],seaRays:.42,rake:1.25,seaK:1,absorb:1.6},noon:{title:"The Standing Sleepers at Noon",sky:{preset:"day"},elev:70,sun:"#FFF3D6",fill:"#DFF2F2",deepFill:"#123C52",water:"#1C8FB4",deep:"#0A4666",ink:"#031823",dens:.0118,gain:.92,key:3,rim:1.2,caustics:2.2,fade:17,ray:"#E6F6EC",rayK:.8,kitRays:1,win:"#CDE8EC",warm:"#F2F4E4",winK:.34,haloK:.22,shade:.38,exposure:1,tint:"#f4fffb",shadow:"#02141c",sat:1.1,glowFrac:0,slate:[.0541,.0782,.1085],seaRays:.34,rake:.9,seaK:1.05,absorb:.6},dawn:{title:"The Standing Sleepers at First Light",sky:{preset:"dawn"},elev:7,sun:"#FF9F86",fill:"#D9D4EC",deepFill:"#221E52",water:"#3A60B0",deep:"#182466",ink:"#070722",dens:.0132,gain:1.15,key:3.4,rim:2,caustics:1.3,fade:9,ray:"#FFA890",rayK:1.3,kitRays:.7,win:"#DCD4E6",warm:"#FFD9C8",winK:.34,haloK:.34,shade:.42,exposure:1.1,tint:"#fff4f4",shadow:"#080620",sat:1.08,glowFrac:0,slate:[.0512,.0535,.1055],deepFog:"#3E4668",seaRays:.42,rake:1.25,seaK:.95,absorb:1.6},moon:{title:"The Standing Sleepers by Moonlight",sky:{preset:"night"},elev:52,sun:"#C4D6F2",fill:"#9FB4CE",deepFill:"#0E2240",water:"#1C4A86",deep:"#0C2A5C",ink:"#030C1C",dens:.012,gain:1.5,key:1.9,rim:2.2,caustics:1.2,fade:14,ray:"#BCD0F0",rayK:.9,kitRays:.9,win:"#B4C6DC",warm:"#D4DEEE",winK:.25,haloK:.3,shade:.3,exposure:1.4,tint:"#eef4ff",shadow:"#01060f",sat:.96,glowFrac:.22,slate:[.0376,.0443,.0623],seaRays:.26,rake:.6,seaK:.45,absorb:.5,fogTop:[.0384,.0486,.1138],fogDeep:[.037,.04,.08],inkLin:[.037,.0415,.07]}},ne=`
float slH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
float slN(vec2 x){ vec2 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(slH(i), slH(i + vec2(1.0, 0.0)), f.x), mix(slH(i + vec2(0.0, 1.0)), slH(i + vec2(1.0, 1.0)), f.x), f.y); }
float slF(vec2 p){ return slN(p)*0.55 + slN(p*2.13 + 3.7)*0.29 + slN(p*4.31 + 9.1)*0.16; }
`,Pe=()=>e.UniformsUtils.clone(e.UniformsLib.fog),se=12;function Dt(o){const n=[],f=[],h=[],M=[],s=(a,d,z,C,y,F)=>(n.push(a.x,a.y,a.z),f.push(d.x,d.y,d.z),h.push(z,C,y,F),n.length/3-1),m=new e.Vector3,t=new e.Vector3,P=new e.Vector3,S=new e.Vector3,i=new e.Vector3,p=(a,d)=>d.set(.09*Math.sin(a*3.1)+.05*a,-.62*a,.07*Math.sin(a*4.3+1));for(let a=0;a<2;a++){const d=a===0?new e.Vector3(1,0,0):new e.Vector3(0,0,1),z=a===0?new e.Vector3(0,0,1):new e.Vector3(1,0,0),C=[];for(let y=0;y<=3;y++){const F=y/3,b=.011*(1-.5*F);p(F,m),C.push(s(m.clone().addScaledVector(d,-b),z,0,F,0,F),s(m.clone().addScaledVector(d,b),z,0,F,0,F))}for(let y=0;y<3;y++){const F=C[y*2],b=C[y*2+1],g=C[y*2+2],w=C[y*2+3];M.push(F,g,b,b,g,w)}}for(let a=0;a<6;a++){const d=.14+.15*a+o.range(-.03,.03),z=a*2.4+o.range(-.4,.4),C=o.range(.11,.17),y=C*.2;p(d,m),t.set(Math.cos(z),o.range(-.75,-.1),Math.sin(z)).normalize(),P.set(-t.z,0,t.x).normalize(),i.crossVectors(t,P).normalize(),S.copy(m).addScaledVector(t,C);const F=m.clone().addScaledVector(t,C*.45),b=Math.min(1,d+.12),g=s(m,i,0,d,1,0),w=s(F.clone().addScaledVector(P,-y),i,-1,b,1,.45),r=s(F.clone().addScaledVector(P,y),i,1,b,1,.45),A=s(F.clone().addScaledVector(i,y*.35),i,0,b,1,.45),E=s(S,i,0,b,1,1);M.push(g,w,A,g,A,r,w,E,A,A,E,r)}for(let a=0;a<4;a++){const d=.2+.2*a+o.range(-.04,.04),z=a*1.9+.8+o.range(-.5,.5),C=o.range(.012,.017);p(d,m),m.x+=Math.cos(z)*.035,m.z+=Math.sin(z)*.035,m.y+=.012;const y=s(m.clone().add(new e.Vector3(0,C*1.2,0)),new e.Vector3(0,1,0),0,d,2,0),F=s(m.clone().add(new e.Vector3(0,-C*1.2,0)),new e.Vector3(0,-1,0),0,d,2,1),b=[];for(let g=0;g<3;g++){const w=g*2.094+z;i.set(Math.cos(w),0,Math.sin(w)),b.push(s(m.clone().addScaledVector(i,C),i,1,d,2,.5))}for(let g=0;g<3;g++){const w=b[g],r=b[(g+1)%3];M.push(y,w,r,F,r,w)}}const c=new e.BufferGeometry;return c.setAttribute("position",new e.Float32BufferAttribute(n,3)),c.setAttribute("normal",new e.Float32BufferAttribute(f,3)),c.setAttribute("aUvw",new e.Float32BufferAttribute(h,4)),c.setIndex(M),c}const Et=`
attribute vec4 aUvw;     // edge (-1..1 across a blade), k (0 root .. 1 tip of the sprig), part (0 stem 1 blade 2 bladder), v along the blade
attribute vec4 aI;       // phase, tint, clump index, spare
uniform float uTime, uDeepA; uniform float uH[${se}];
varying vec4 vUvw; varying vec3 vW; varying vec3 vN; varying float vTint;
#include <common>
#include <fog_pars_vertex>
void main(){
  // from far below a sprig is smaller than a pixel and only sparkles on the mat: it shrinks to nothing as the view deepens
  vec4 wp = modelMatrix*instanceMatrix*vec4(position*(1.0 - smoothstep(0.35, 0.9, uDeepA)), 1.0);
  float k = aUvw.y, ph = aI.x;
  wp.x += k*k*0.2*sin(uTime*0.9 + ph + wp.z*0.6) + k*0.045*sin(uTime*2.3 + ph*3.0);
  wp.z += k*k*0.16*sin(uTime*0.7 + ph*1.7 + wp.x*0.5);
  wp.y += uH[int(clamp(aI.z, 0.0, ${(se-1).toFixed(1)}))] + k*0.04*sin(uTime*1.3 + ph);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix)*mat3(instanceMatrix)*normal); vUvw = aUvw; vTint = aI.y;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Vt=`
uniform vec3 uSunT, uSunCol, uFill; uniform float uKey, uDeepA;
varying vec4 vUvw; varying vec3 vW; varying vec3 vN; varying float vTint;
#include <common>
#include <fog_pars_fragment>
void main(){
  float part = vUvw.z, e = abs(vUvw.x);
  float blade = step(0.5, part)*(1.0 - step(1.5, part));
  if (blade > 0.5 && e > 0.72 + 0.28*abs(fract(vUvw.w*6.0)*2.0 - 1.0)) discard;      // saw edge
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW);
  if (dot(N, V) < 0.0) N = -N;
  vec3 alb = mix(vec3(0.085, 0.058, 0.012), vec3(0.16, 0.115, 0.022), vTint);
  alb = mix(alb, vec3(0.2, 0.15, 0.035), step(1.5, part));
  float ndl = abs(dot(N, uSunT));
  vec3 col = alb*(uFill*0.3 + uSunCol*(uKey*0.42*ndl));
  // the sun comes through thin edges honey-gold
  float tow = max(dot(-V, uSunT), 0.0);
  float thin = mix(0.25, 1.0, smoothstep(0.25, 0.9, e))*(0.4 + 0.6*blade) + 0.5*step(1.5, part);
  col += uSunCol*(uKey*0.085*thin*(0.35 + 1.65*tow*tow));
  col = mix(col, vec3(0.1, 0.085, 0.03)*uFill*0.5 + uSunCol*(0.05*thin), uDeepA*0.9);      // from far below: soft olive, never black speckle
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,Pt=`
attribute vec3 aM;       // clump index, seed, density
uniform float uTime; uniform float uH[${se}];
varying vec2 vUv2; varying vec3 vM; varying vec3 vW;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.0);
  wp.y += uH[int(clamp(aM.x, 0.0, ${(se-1).toFixed(1)}))];
  vUv2 = uv*2.0 - 1.0; vM = aM; vW = wp.xyz;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Wt=`
uniform vec3 uSunT, uSunCol, uFill; uniform float uKey, uTime, uDeepA;
varying vec2 vUv2; varying vec3 vM; varying vec3 vW;
#include <common>
#include <fog_pars_fragment>
${ne}
void main(){
  float r = dot(vUv2, vUv2);
  vec2 q = vW.xz*0.9 + vM.y*17.0 + 0.04*vec2(sin(uTime*0.5 + vW.z), cos(uTime*0.4 + vW.x));
  float n = slF(q)*0.7 + slN(q*5.5)*0.3;
  n = mix(n, slN(q*0.55)*0.62 + slN(q*1.3 + 3.7)*0.38, uDeepA);          // from below: broad soft shapes, nothing finer than a pixel
  float d = n*vM.z*1.9 - r*1.05 - 0.22;
  float a = smoothstep(0.0, mix(0.22, 0.5, uDeepA), d);
  if (a < 0.01) discard;
  vec3 V = normalize(cameraPosition - vW);
  float tow = max(dot(-V, uSunT), 0.0);
  float thick = smoothstep(0.02, 0.3, d);
  // (the heart of a mat is dark olive-brown, about #2A2410 on screen: the floor is the scene-linear value the grade shows as that)
  vec3 dark = vec3(0.05, 0.036, 0.009)*(uFill*0.45 + uSunCol*uKey*0.07)*2.0 + vec3(0.05, 0.046, 0.033)*(1.0 - uDeepA);
  vec3 edge = uSunCol*(uKey*0.075*(0.45 + 1.55*tow*tow)) + vec3(0.1, 0.07, 0.012)*uFill*0.4;
  vec3 col = mix(edge, dark, thick)*(0.8 + 0.4*slN(q*11.0)*(1.0 - uDeepA));
  // from far below the mat is a soft olive shadow on the window: a dark olive heart, thinning to honey where the sun comes
  // through its edge, with no outline (alpha and colour both run smoothly from the rim to the heart)
  float core = smoothstep(0.1, 0.5, d);
  vec3 deepCol = mix(uSunCol*0.2 + vec3(0.13, 0.1, 0.025)*uFill, vec3(0.12, 0.115, 0.05)*uFill, core);
  col = mix(col, deepCol, uDeepA);
  gl_FragColor = vec4(col, mix(a*0.94, smoothstep(0.0, 0.5, d)*mix(0.4, 0.72, core), uDeepA));
  #include <fog_fragment>
}`;function Rt(o,n,f){const h=new e.Group;h.name="sargassum";const M={value:new Array(se).fill(0)},s={value:0},W={value:0},T={uSunT:{value:f.sunT},uSunCol:{value:f.sunCol},uFill:{value:f.fill},uKey:{value:f.key},uTime:s,uH:M,uDeepA:W},m=Math.min(n.length,se),t=n.reduce((c,a)=>c+(a.sprigs||0),0);if(t>0&&f.count>0){const c=Dt(o.fork("sprig")),a=new e.InstancedBufferAttribute(new Float32Array(f.count*4),4);c.setAttribute("aI",a);const d=new e.InstancedMesh(c,new e.ShaderMaterial({uniforms:Object.assign(Pe(),T),vertexShader:Et,fragmentShader:Vt,fog:!0,side:e.DoubleSide}),f.count),z=new e.Matrix4,C=new e.Quaternion,y=new e.Euler,F=new e.Vector3,b=new e.Vector3;let g=0;for(let w=0;w<m;w++){const r=n[w],A=w===m-1?f.count-g:Math.min(f.count-g,Math.round(f.count*(r.sprigs||0)/t)),E=Math.cos(r.yaw||0),K=Math.sin(r.yaw||0);for(let N=0;N<A;N++,g++){const Q=o.range(0,Math.PI*2),q=Math.sqrt(o())*.92,D=Math.cos(Q)*q*r.rx,re=Math.sin(Q)*q*r.rz,ie=o.chance(.16),oe=ie?o.range(1.5,2.3):o.range(.8,1.6);F.set(r.x+D*E-re*K,-o.range(.03,.22),r.z+D*K+re*E),y.set(ie?o.range(-.25,.25):o.range(-1.25,1.25),o.range(0,Math.PI*2),ie?o.range(-.25,.25):o.range(-1.25,1.25),"YXZ"),d.setMatrixAt(g,z.compose(F,C.setFromEuler(y),b.set(oe,oe,oe))),a.setXYZW(g,o.range(0,6.283),o(),w,0)}}d.count=g,d.frustumCulled=!1,d.name="sargassum-sprigs",h.add(d)}const P=[],S=[],i=[],p=[];for(let c=0;c<m;c++){const a=n[c],d=Math.cos(a.yaw||0),z=Math.sin(a.yaw||0),C=a.mats??2;for(let y=0;y<C;y++){const F=o.range(-.3,.3)*a.rx,b=o.range(-.3,.3)*a.rz,g=a.rx*o.range(1.15,1.45),w=a.rz*o.range(1.15,1.45),r=P.length/3,A=o();for(const[E,K]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const N=F+E*g,Q=b+K*w;P.push(a.x+N*d-Q*z,-.05-.02*y,a.z+N*z+Q*d),S.push(E*.5+.5,K*.5+.5),i.push(c,A,a.dens??1)}p.push(r,r+1,r+2,r+1,r+3,r+2)}}if(P.length){const c=new e.BufferGeometry;c.setAttribute("position",new e.Float32BufferAttribute(P,3)),c.setAttribute("uv",new e.Float32BufferAttribute(S,2)),c.setAttribute("aM",new e.Float32BufferAttribute(i,3)),c.setIndex(p);const a=new e.Mesh(c,new e.ShaderMaterial({uniforms:Object.assign(Pe(),T),vertexShader:Pt,fragmentShader:Wt,fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide}));a.frustumCulled=!1,a.renderOrder=3,a.name="sargassum-mats",h.add(a)}return{object:h,uH:M,uTime:s,uDeepA:W,clumps:n.slice(0,m)}}const Kt=`
varying vec3 vW; varying vec3 vN; varying vec2 vUv2;
#include <common>
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); vUv2 = uv;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Bt=`
uniform vec3 uSunT, uSunCol, uFill; uniform float uKey, uTime;
varying vec3 vW; varying vec3 vN; varying vec2 vUv2;
#include <common>
#include <fog_pars_fragment>
${ne}
void main(){
  vec3 N = normalize(vN); vec3 V = normalize(cameraPosition - vW);
  float bark = slN(vec2(vUv2.x*5.0, vUv2.y*46.0 + 3.0*slN(vUv2*vec2(9.0, 4.0))));
  float crack = smoothstep(0.62, 0.9, 1.0 - abs(2.0*bark - 1.0));
  vec3 alb = mix(vec3(0.06, 0.045, 0.03), vec3(0.2, 0.15, 0.1), slF(vUv2*vec2(7.0, 3.0)))*(1.0 - 0.6*crack);
  vec2 bc = vUv2*vec2(60.0, 26.0); vec2 bi = floor(bc), bf = fract(bc) - 0.5;
  float barn = step(0.8, slH(bi))*(1.0 - smoothstep(0.18, 0.34, length(bf)))*smoothstep(0.3, 0.6, slN(vUv2*vec2(8.0, 5.0) + 4.0));
  alb = mix(alb, vec3(0.42, 0.4, 0.34), barn);
  float ca = slN(vW.xz*1.6 + vec2(uTime*0.5, -uTime*0.3)); ca = 1.0 - abs(2.0*ca - 1.0); ca *= ca*ca;
  float ndl = clamp(dot(N, uSunT)*0.8 + 0.2, 0.0, 1.0), up = clamp(0.5 - 0.5*N.y, 0.0, 1.0), fr = 1.0 - clamp(dot(N, V), 0.0, 1.0);
  vec3 col = alb*(uFill*(0.22 + 0.25*up) + uSunCol*(uKey*ndl*(0.5 + 1.2*ca))) + uSunCol*(uKey*0.12*fr*fr*fr*smoothstep(-0.2, 0.5, dot(N, uSunT)));
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;function jt(o,n){const s=[],W=[],T=[],m=(i,p)=>.34*(1-.35*i)*(1+.12*Math.sin(p*3+i*9)+.08*Math.sin(p*7-i*23)+.1*Math.sin(i*31))*(.25+.75*Math.min(1,Math.min(i,1-i)*14));for(let i=0;i<=40;i++)for(let p=0;p<=16;p++){const c=i/40,a=p/16*Math.PI*2,d=m(c,a);s.push((c-.5)*7.5,Math.cos(a)*d+.12*Math.sin(c*3.4),Math.sin(a)*d+.2*Math.sin(c*2.2+1)),W.push(p/16,c)}for(let i=0;i<40;i++)for(let p=0;p<16;p++){const c=i*17+p,a=c+1,d=c+16+1,z=d+1;T.push(c,a,d,a,z,d)}for(let i=0;i<4;i++){const p=o.range(.15,.8),c=o.range(0,6.283),a=o.range(.5,1.4),d=s.length/3,z=6,C=7,y=(p-.5)*7.5,F=new e.Vector3(o.range(-.5,.5),Math.cos(c),Math.sin(c)).normalize(),b=new e.Vector3(1,0,0).cross(F).normalize(),g=new e.Vector3().crossVectors(F,b);for(let w=0;w<=z;w++)for(let r=0;r<=C;r++){const A=w/z,E=r/C*Math.PI*2,K=.1*(1-.6*A)*(w===z?.3:1)*(1+.2*Math.sin(E*2+A*6)),N=new e.Vector3(y,.12*Math.sin(p*3.4),.2*Math.sin(p*2.2+1)).addScaledVector(F,.2+A*a).addScaledVector(b,Math.cos(E)*K).addScaledVector(g,Math.sin(E)*K);s.push(N.x,N.y,N.z),W.push(r/C,p+A*.1)}for(let w=0;w<z;w++)for(let r=0;r<C;r++){const A=d+w*(C+1)+r,E=A+1,K=A+C+1,N=K+1;T.push(A,E,K,E,N,K)}}const t=new e.BufferGeometry;t.setAttribute("position",new e.Float32BufferAttribute(s,3)),t.setAttribute("uv",new e.Float32BufferAttribute(W,2)),t.setIndex(T),t.computeVertexNormals();const P={value:0},S=new e.Mesh(t,new e.ShaderMaterial({uniforms:Object.assign(Pe(),{uSunT:{value:n.sunT},uSunCol:{value:n.sunCol},uFill:{value:n.fill},uKey:{value:n.key},uTime:P}),vertexShader:Kt,fragmentShader:Bt,fog:!0}));return S.name="drift-log",{object:S,uTime:P}}const Nt=`
varying vec3 vW;
void main(){ vec4 wp = modelMatrix*vec4(position, 1.0); vW = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }`,qt=`
uniform vec3 uSunT, uWinCol, uWarmCol, uSunCol, uRainDir, uFogCol, uCoolCol; uniform float uWin, uSpread, uHalo, uRain, uShade, uTime, uLift, uSea, uRays, uSeaK;
varying vec3 vW;
${ne}
// the chop's caustic web: distance between the two nearest of a field of wandering points (0 on a cell edge)
float slWeb(vec2 p, float t){
  vec2 ic = floor(p), fc = fract(p); float d1 = 8.0, d2 = 8.0;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y)); float h = slH(ic + g), h2 = slH(ic + g + 17.3);
    vec2 o = g + 0.5 + 0.46*vec2(cos(t*(0.6 + 0.8*h) + h*6.283), sin(t*(0.6 + 0.8*h2) + h2*6.283)) - fc;
    float d = dot(o, o);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  return sqrt(d2) - sqrt(d1);
}
// one layer of rain rings: hashed cells, each with its own centre, final radius, rate and start, most cells empty
float slRings(vec2 p, float sc, float sd, float dist){
  vec2 g = p*sc + sd*11.3; vec2 id = floor(g), f = fract(g) - 0.5;
  float h = slH(id + sd*3.1), h2 = slH(id*1.7 + 5.3 + sd);
  float life = fract(uTime*(0.5 + 0.7*h2) + h*17.0);
  vec2 c = (vec2(slH(id + 3.1), slH(id + 7.7)) - 0.5)*0.4;
  float rr = length(f - c), w = sc*max(0.03 + 0.035*life, dist*0.003);
  float fade = (1.0 - life)*(1.0 - life);
  return (1.0 - smoothstep(0.0, w, abs(rr - 0.03 - (0.1 + 0.18*h2)*life)))*fade*step(0.6, h);
}
void main(){
  vec3 D = vW - cameraPosition; float dist = max(length(D), 1e-3); D /= dist;
  float cz = max(D.y, 0.0);
  // near the ceiling the glow keeps to Snell's window; from the deep (uSpread 1) it reaches down into the level haze,
  // so the far sleepers stand against light, not against fog
  // (uSpread 1: the glow feathers from 4 to 38 degrees of elevation, a quarter of the frame and more, its foot broken by slow
  //  noise so it has no limb; the sheet's own rim, 5 degrees up from 46 m, is faded out before it is reached)
  float foot = slF(vW.xz*0.006 + uTime*vec2(0.006, -0.004)) - 0.5;
  float win = smoothstep(mix(0.62, 0.07 + 0.16*foot, uSpread), mix(0.78, 0.62, uSpread), cz);
  float rimK = 1.0 - smoothstep(380.0, 505.0, length(vW.xz - cameraPosition.xz));
  // (both the glow's foot and the beams below end by 6 degrees of elevation, well inside the sheet's rim: no limb there either)
  float lowK = smoothstep(0.1, 0.24, cz);
  win *= mix(1.0, (0.35 + 0.65*win)*lowK, uSpread)*rimK;
  float sd = max(dot(D, uSunT), 0.0);
  float s2 = sd*sd, s4 = s2*s2, s8 = s4*s4, s32 = s8*s8*s8*s8;
  // a slow silver ripple so the glow reads as a ceiling and never as a flat gradient (gone before it is pixel-fine)
  float rip = 0.74 + 0.36*slF(vW.xz*0.13 + uTime*vec2(0.08, -0.055)) + 0.16*slN(vW.xz*0.5 - uTime*vec2(0.16, 0.11));
  rip = mix(1.0, rip, 1.0 - smoothstep(70.0, 170.0, dist));
  // the chop's light inside Snell's disc: soft bright lanes lying along the wind, drifting (no lines, nothing to alias)
  vec2 rw = vec2(vW.x*0.94 + vW.z*0.34, vW.z*0.94 - vW.x*0.34);
  float d1 = slN(rw*vec2(0.085, 0.4) + uTime*vec2(0.16, 0.05)), d2 = slN(rw*vec2(0.19, 0.9) - uTime*vec2(0.27, 0.08) + 3.7);
  float net = 0.75*smoothstep(0.42, 0.85, d1) + 0.5*smoothstep(0.5, 0.9, d2)*(1.0 - smoothstep(45.0, 95.0, dist));
  rip += 0.34*net*smoothstep(0.45, 0.8, cz)*(1.0 - smoothstep(80.0, 150.0, dist));
  // squall: a soft-edged half of the ceiling, darker, shaftless, stippled with expanding rain rings
  float sq = uRain*smoothstep(-6.0, 10.0, dot(vW.xz, uRainDir.xz) - uRainDir.y + 5.0*(slN(vW.xz*0.07) - 0.5));
  float fall = exp(-dist*0.012);
  // THE SEA FROM THE DEEP (uSea 1): not a pewter wash but the lit underside of the sea. Three things make it one:
  //  a key side (white-gold and brightest toward the sun, falling through silver-blue to steel blue on the far side),
  //  Snell's disc (the ceiling is darker outside it, behind a wobbling rim), and the chop's own light: a web of bright
  //  threads round dark cells at three sizes, each cell's corner wandering (each size is gone before it is pixel-fine).
  float g1 = smoothstep(0.02, 0.95, sd);
  // (the web lies along the wind, its cells longer than wide and bent by two sizes of slow swell; it gathers into bright
  //  fields and thins to almost nothing between them, and no thread is evenly lit along its length: a net it is not)
  vec2 wq = vec2(rw.x*0.6, rw.y) + 4.5*vec2(slN(rw*0.045 + uTime*0.03), slN(rw*0.045 + 7.3 - uTime*0.025)) + 1.2*vec2(slN(rw*0.21 - uTime*0.06), slN(rw*0.21 + 3.1 + uTime*0.05));
  float wa = slWeb(wq*0.2, uTime*0.55), wb = slWeb(wq*0.43 + 3.7, uTime*0.8 + 2.0), wc = slWeb(wq*1.05 + 9.1, uTime*1.1 + 5.0);
  wa = 0.7*exp(-8.0*wa) + 0.3*exp(-2.5*wa); wb = 0.7*exp(-7.0*wb) + 0.3*exp(-2.5*wb); wc = exp(-6.0*wc);
  float field = 0.2 + 0.8*smoothstep(0.3, 0.72, slF(rw*0.034 + uTime*vec2(0.012, -0.008)));
  float thread = 0.5 + 0.5*slN(wq*0.37 + uTime*vec2(0.09, 0.06));
  float lace = (wa*(1.0 - smoothstep(120.0, 240.0, dist)) + 0.7*wb*(1.0 - smoothstep(60.0, 120.0, dist))*thread + 0.6*wc*(1.0 - smoothstep(22.0, 46.0, dist)))*field*(0.45 + 0.55*thread);
  float snell = smoothstep(0.58, 0.7, cz + 0.07*(slN(vW.xz*0.05 + uTime*0.03) - 0.5));
  // silver-blue all over; the sun's side is not mixed toward cream (that muddies) but has gold light added over a thinner blue
  vec3 tone = mix(uCoolCol, mix(uCoolCol, uWinCol, 0.5), g1)*(1.0 - 0.78*s4);
  float seaK = (0.52 + 0.24*g1)*(0.58 + 0.42*snell)*(0.62 + lace*1.25*(0.4 + 0.6*snell));
  vec3 gold = mix(uWarmCol, uSunCol, 0.75)*((0.45*s4 + 0.4*s8)*(0.3 + 0.95*lace)*0.74);
  vec3 base = mix(mix(uWinCol, uWarmCol, clamp(s8*1.2, 0.0, 1.0))*uWin, (tone*seaK + gold)*uSeaK, uSea);
  vec3 col = base*(win*rip*(1.0 - 0.45*sq)) + uSunCol*(uHalo*(0.5*s8 + 0.9*s32 + 0.8*s4*net*smoothstep(0.04, 0.3, cz))*(1.0 - sq)*fall);
  // the sun's shafts seen from inside the water: spokes fanning from the sun's place on the ceiling (it stays out of
  // frame), strongest 10 to 60 degrees from it, wandering and never even. They run on down past the window's rim.
  vec3 f1 = normalize(cross(uSunT, vec3(0.0, 0.0, 1.0)) + vec3(1e-4, 0.0, 0.0)); vec3 f2 = cross(uSunT, f1);
  float qx = dot(D, f1), qy = dot(D, f2);
  float ps = atan(qy, qx + (abs(qx) + abs(qy) < 1e-5 ? 1e-4 : 0.0));
  float k1 = 0.5 + 0.5*sin(ps*11.0 + 1.3*sin(ps*4.0 + uTime*0.21) - uTime*0.17), k2 = 0.5 + 0.5*sin(ps*29.0 + uTime*0.33 + 2.0*sin(ps*7.0 - uTime*0.13));
  float spoke = k1*k1*k1*(0.55 + 0.45*k2);
  col += mix(uWarmCol, uSunCol, 0.45)*(uRays*spoke*smoothstep(0.03, 0.3, sqrt(max(1.0 - sd*sd, 0.0)))*smoothstep(0.1, 0.9, sd)*smoothstep(0.05, 0.3, cz)*rimK*(1.0 - 0.6*sq));
  // uLift (the view from the deep): the dark water under the glow carries two or three broad, soft beams, the sun's
  // light converging on the antisolar point below (the backdrop draws the same spokes under the level gaze; up here
  // the fogged underside of the sea hides the backdrop, so they are drawn on this sheet). Edges ten degrees soft.
  vec3 an = -uSunT; vec3 e1 = normalize(cross(an, vec3(0.0, 0.0, 1.0)) + vec3(1e-4, 0.0, 0.0)); vec3 e2 = cross(an, e1);
  float bx = dot(D, e1), by = dot(D, e2), ba = dot(D, an);
  float phi = atan(by, bx + (abs(bx) + abs(by) < 1e-5 ? 1e-4 : 0.0));
  float broad = 0.5 + 0.5*sin(phi*9.0 + 1.7*sin(uTime*0.23) + 0.6*sin(phi*3.0 - uTime*0.31)); broad *= broad;
  col += (uFogCol + vec3(0.012, 0.016, 0.02))*(uLift*1.1*broad*smoothstep(0.03, 0.5, sqrt(max(1.0 - ba*ba, 0.0)))*(1.0 - smoothstep(0.16, 0.56, cz))*lowK*rimK);
  float near = 1.0 - smoothstep(34.0, 80.0, dist);
  float ring = slRings(vW.xz, 0.8, 0.0, dist) + 0.8*slRings(vW.xz + 9.7, 0.37, 1.0, dist) + 0.6*slRings(vW.xz*mat2(0.8, -0.6, 0.6, 0.8), 1.7, 2.0, dist)*(1.0 - smoothstep(14.0, 40.0, dist));
  float stip = slN(vW.xz*3.1 + uTime*vec2(0.7, -0.5))*slN(vW.xz*0.9 - uTime*vec2(0.2, 0.3));
  float patchy = 0.35 + 0.65*smoothstep(0.3, 0.7, slN(vW.xz*0.21 + uTime*vec2(0.11, 0.07)));          // gusts: the rain is never even
  col += uWinCol*(sq*patchy*(0.34*min(ring, 1.0)*near + 0.1*stip*(1.0 - 0.6*near))*(0.35 + 0.65*cz)*exp(-dist*0.008));
  // (from the deep the veil stands in for the kit's own window, whose pale sky would wash the sea's colour out)
  gl_FragColor = vec4(col, clamp(0.3*sq*fall + mix(uShade, 0.86, uSea)*win*(1.0 - 0.5*sq*(1.0 - uSea)), 0.0, 0.9));
}`;function Ht(o){const n=new e.CircleGeometry(520,64);n.rotateX(Math.PI/2);const f={uSunT:{value:o.sunT},uWinCol:{value:o.winCol},uWarmCol:{value:o.warmCol},uSunCol:{value:o.sunCol},uRainDir:{value:new e.Vector3(0,0,-1)},uWin:{value:0},uSpread:{value:0},uHalo:{value:0},uRain:{value:0},uShade:{value:0},uTime:{value:0},uLift:{value:0},uFogCol:{value:o.fogCol},uCoolCol:{value:o.coolCol},uSea:{value:0},uRays:{value:0},uSeaK:{value:o.seaK??1}},h=new e.Mesh(n,new e.ShaderMaterial({uniforms:f,vertexShader:Nt,fragmentShader:qt,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor}));return h.position.y=-1,h.frustumCulled=!1,h.renderOrder=2,h.name="ceiling-veil",{object:h,uniforms:f}}const _t=`
attribute vec3 aOrigin; attribute vec4 aParam; attribute vec4 aCol;     // surface point; width x, length m, phase, strength; rgb, class (0 near, 1 deep, 2 henge)
uniform vec3 uDir; uniform vec2 uWidth; uniform float uTime, uK, uKDeep, uKHenge;
varying vec2 vUv2; varying vec3 vPar; varying vec3 vCol; varying float vDist;
void main(){
  float s = uv.y, L = aParam.y;
  vec3 o = aOrigin + vec3(0.7*sin(uTime*0.11 + aParam.z*40.0), 0.0, 0.7*cos(uTime*0.09 + aParam.z*23.0));
  vec3 pc = o + uDir*(s*L);
  vec3 toCam = cameraPosition - pc; float dc = max(length(toCam), 1e-3);
  vec3 sd = cross(uDir, toCam); float sl = length(sd);
  vec3 side = sl > 1e-4 ? sd/sl : vec3(1.0, 0.0, 0.0);
  float w = mix(uWidth.x, uWidth.y, s)*aParam.x;
  float k = max(w, 0.006*dc);                                           // never thinner than a few pixels: widen and dim instead
  vec3 world = pc + side*((uv.x - 0.5)*2.0*k);
  vec3 oc = cameraPosition - o; float tt = clamp(dot(oc, uDir), 0.0, L); float dAxis = length(oc - uDir*tt);
  float wHere = mix(uWidth.x, uWidth.y, tt/L)*aParam.x;
  float along = abs(dot(uDir, toCam/dc));
  float fade = smoothstep(0.7*wHere, 3.0*wHere, dAxis)*(1.0 - smoothstep(0.8, 0.96, along))*(w/k);
  vDist = dc; vUv2 = uv; vPar = vec3(aParam.z, aParam.w*fade*(aCol.a < 0.5 ? uK : aCol.a < 1.5 ? uKDeep : uKHenge), step(1.5, aCol.a)); vCol = aCol.rgb;
  gl_Position = projectionMatrix*viewMatrix*vec4(world, 1.0);
}`,It=`
uniform float uTime, uHaze, uAbs;
varying vec2 vUv2; varying vec3 vPar; varying vec3 vCol; varying float vDist;
${ne}
void main(){
  float x = vUv2.x*2.0 - 1.0, s = vUv2.y, ph = vPar.x;
  float across = max(1.0 - x*x, 0.0); across *= across;
  float t1 = max(1.0 - s, 0.0);
  float along = (0.4 + 0.6*smoothstep(0.0, 0.12, s))*t1*sqrt(t1)*mix(t1, 1.0, vPar.z);       // lit from the ceiling down, no end at either end (the henge class reaches deeper)
  float n = slF(vec2(x*1.3 + ph*23.0, s*2.5 - uTime*0.07 + ph*7.0));
  float lobe = 0.72 + 0.28*sin(x*4.0 + ph*31.0 + 0.6*sin(uTime*0.2 + ph*9.0));
  float shimmer = 0.75 + 0.25*sin(uTime*(0.25 + ph*0.3) + ph*20.0);
  float body = across*along*(0.5 + 0.75*n)*lobe*shimmer*vPar.y*exp(-vDist/uHaze);
  // premultiplied: the shaft adds its light and takes a little of the water's blue from behind it, so a gold shaft is
  // gold in blue water and not lavender
  gl_FragColor = vec4(vCol*body, clamp(uAbs*body, 0.0, 0.75));
}`;function Lt(o,n){const f=o.reduce((i,p)=>i+p.count,0),h=new Float32Array(f*3),M=new Float32Array(f*4),s=new Float32Array(f*4),W=new e.Color;let T=0;for(const i of o)for(let p=0;p<i.count;p++,T++){const c=i.rng()*Math.PI*2,a=Math.sqrt(i.rng())*i.radius;h[T*3]=i.x+Math.cos(c)*a,h[T*3+1]=.5,h[T*3+2]=i.z+Math.sin(c)*a,M[T*4]=(.5+i.rng()*1.1)*i.width,M[T*4+1]=i.reach/n.sy*(.65+i.rng()*.35),M[T*4+2]=i.rng(),M[T*4+3]=.35+i.rng()*.65,W.set(i.color).multiplyScalar(i.intensity),s[T*4]=W.r,s[T*4+1]=W.g,s[T*4+2]=W.b,s[T*4+3]=i.cls||0}const m=new e.PlaneGeometry(1,1),t=new e.InstancedBufferGeometry;t.index=m.index,t.setAttribute("position",m.getAttribute("position")),t.setAttribute("uv",m.getAttribute("uv")),t.setAttribute("aOrigin",new e.InstancedBufferAttribute(h,3)),t.setAttribute("aParam",new e.InstancedBufferAttribute(M,4)),t.setAttribute("aCol",new e.InstancedBufferAttribute(s,4)),t.instanceCount=f;const P={uDir:{value:n.dir},uWidth:{value:new e.Vector2(n.width[0],n.width[1])},uTime:{value:0},uK:{value:1},uKDeep:{value:1},uKHenge:{value:0},uHaze:{value:n.haze},uAbs:{value:n.absorb??.4}},S=new e.Mesh(t,new e.ShaderMaterial({uniforms:P,vertexShader:_t,fragmentShader:It,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor}));return S.frustumCulled=!1,S.renderOrder=4,S.name="light-shafts",{object:S,uniforms:P}}function Ut(o,n,f,h){const M={uFog:{value:o},uInk:{value:n},uTime:{value:0},uAnti:{value:f},uBeam:{value:h}},s=new e.Mesh(new e.SphereGeometry(300,24,16),new e.ShaderMaterial({uniforms:M,side:e.BackSide,depthWrite:!1,depthTest:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }",fragmentShader:`uniform vec3 uFog, uInk, uAnti; uniform float uTime, uBeam; varying vec3 vD;
      void main(){ vec3 d = normalize(vD); float t = clamp(-d.y, 0.0, 1.0); float k = smoothstep(0.05, 1.0, t);
        vec3 col = mix(uFog, uInk, k*k*0.8);
        // the sun's beams seen from inside the water: wavering spokes that converge on the antisolar point below
        vec3 e1 = normalize(cross(uAnti, vec3(0.0, 0.0, 1.0)) + vec3(1e-4, 0.0, 0.0)); vec3 e2 = cross(uAnti, e1);
        float ca = dot(d, uAnti), x = dot(d, e1), y = dot(d, e2);
        float phi = atan(y, x + (abs(x) + abs(y) < 1e-5 ? 1e-4 : 0.0));
        float s = sin(phi*9.0 + 1.7*sin(uTime*0.23) + 0.6*sin(phi*3.0 - uTime*0.31))
                + 0.7*sin(phi*17.0 - uTime*0.47 + 1.3*sin(phi*5.0 + uTime*0.19)) + 0.5*sin(phi*31.0 + uTime*0.71);
        float beam = smoothstep(0.2, 1.9, s);
        float sa = sqrt(max(1.0 - ca*ca, 0.0));
        float fade = smoothstep(0.03, 0.4, sa)*smoothstep(-0.6, 0.5, ca)*smoothstep(0.0, 0.3, t + 0.1);
        col += uFog*(uBeam*beam*fade);
        gl_FragColor = vec4(col, 1.0); }`}));return s.frustumCulled=!1,s.renderOrder=-1,s.name="backdrop",{object:s,uniforms:M}}function Gt(o){const n={uColor:{value:new e.Color(o)},uKindle:{value:0},uTime:{value:0}},f=new e.Mesh(new e.RingGeometry(5.6,12,72,1),new e.ShaderMaterial({uniforms:n,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:"varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }",fragmentShader:`uniform vec3 uColor; uniform float uKindle, uTime; varying vec2 vP;
      ${ne}
      void main(){ float r = length(vP); float a = atan(vP.y, vP.x + 1e-5);
        float x = max(r - 6.0, 0.0);
        float lick = slN(vec2(a*5.0 + uTime*0.3, r*0.9 - uTime*0.8))*0.6 + slN(vec2(a*13.0 - uTime*0.5, r*2.2 - uTime*1.6))*0.4;
        float glow = exp(-x*1.3)*0.3 + exp(-x*0.5)*0.14*(0.4 + 1.2*lick);
        glow *= smoothstep(5.6, 6.1, r)*(1.0 - smoothstep(10.0, 12.0, r));
        gl_FragColor = vec4(uColor*(glow*uKindle), 1.0); }`}));return f.name="portal-halo",f.renderOrder=6,{object:f,uniforms:n}}function Ot(){const o={uFoam:{value:0},uBlow:{value:0},uTime:{value:0},uCol:{value:new e.Color("#E9F2F4")}},n=new e.PlaneGeometry(26,26);n.rotateX(Math.PI/2);const f=new e.Mesh(n,new e.ShaderMaterial({uniforms:o,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:"varying vec2 vP; void main(){ vP = position.xz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.0); }",fragmentShader:`uniform vec3 uCol; uniform float uFoam, uBlow, uTime; varying vec2 vP;
      ${ne}
      void main(){ float r = length(vP); float a = atan(vP.y, vP.x + 1e-5);
        float n = slF(vec2(a*2.2, r*0.7 - uTime*0.6))*0.7 + slN(vP*2.6 + uTime*0.4)*0.3;
        float R = 2.2 + 7.5*uFoam;
        float cut = smoothstep(0.42, 0.6, n)*(0.55 + 0.9*smoothstep(0.4, 0.75, slN(vP*4.3 + uTime*vec2(0.3, -0.2))));     // breaks the foam into lace
        float hollow = smoothstep(1.2, 2.4, r);                                                                        // the dark brow in the middle
        float ring = exp(-abs(r - R)*(1.5 - 0.6*uFoam))*cut*sin(3.1416*clamp(uFoam, 0.0, 1.0));
        float spokes = smoothstep(0.5, 0.9, slN(vec2(a*7.0, r*0.5 - uTime*0.9)))*exp(-abs(r - R*0.6)*0.7)*sin(3.1416*clamp(uFoam, 0.0, 1.0));
        float lace = smoothstep(0.55, 0.8, slN(vP*1.4 - uTime*0.2))*exp(-r*0.22)*uFoam*(1.0 - uFoam)*2.0;
        float burst = exp(-r*r/(3.0 + 30.0*uBlow))*uBlow*(0.3 + 1.1*cut);
        float edge = 1.0 - smoothstep(10.0, 13.0, r);
        gl_FragColor = vec4(uCol*((ring*0.95 + spokes*0.3 + lace*0.5 + burst*0.75)*hollow*edge), 1.0); }`}));return f.frustumCulled=!1,f.renderOrder=5,f.name="riser-foam",{object:f,uniforms:o}}var Jt={id:"standing-sleepers",name:"The Standing Sleepers",category:"ocean",weirdness:.05,media:["underwater"],async build(o){const n=o.rng,f=o.vary||{},h=o.quality?.detail??1,M=Ve(f.density??1,.7,1.3),s=new e.Scene,W=f.hour||"any",T=n.fork("mood")(),m=W==="golden"?"golden":W==="day"?"noon":W==="dawn"?"dawn":W==="night"?"moon":zt[Math.min(9,Math.floor(T*10))],t=At[m],P=n.fork("weather")(),S=P<.45?"chop":P<.66?"glass":"squall",i=n.fork("ceiling")(),p=Tt[Math.min(9,Math.floor(i*10))],c=n.fork("escort")(),a=c<.5?"whitetip":c<.78?"silkies":"manta",d=n.fork("cast"),z=d.pick([14,14,14,12,16,13,15,11,10]),C=d.pick([2,2,2,1,3,1,0]),y=d.chance(.28)?2:1,F=!!f.rare,b=kt(Ct(o.seed+":sleepers-2")),g=St(m==="moon"?{rng:n.fork("sky"),preset:"night",bodyOverrides:{0:{elevation:t.elev,azimuth:Ze}},clouds:{coverage:.28,softness:.3}}:{rng:n.fork("sky"),...t.sky,sunElevation:t.elev,sunAzimuth:Ze,clouds:{coverage:S==="squall"?.5:.2,softness:.3}}),w=$e.waterLight(g),r=new e.Vector3;{const l=w.sunDir,x=Math.max(1e-4,Math.hypot(l.x,l.z)),v=Math.min(.749,x/1.333),u=Math.sqrt(1-v*v);x<.02?r.set(-.94*.05,1,.34*.05).normalize():r.set(l.x/x*v,u,l.z/x*v).normalize()}const A=new e.Color(t.sun),E=new e.Color(t.fill),K=new e.Color(t.water),N=new e.Color(t.deep),Q=new e.Color(t.deepFog||t.deep),q=await Ft(o,{palette:Mt,count:z,headDown:C,calves:y,sunDir:r,flexAt:.1,eyeAt:[.355,.405],rollAt:[.37,.46],calfAt:[.405,.458]});q.setLight({sunDir:r,sunColor:A,key:t.key,rim:t.rim,caustics:t.caustics,fadeDepth:t.fade,fill:E.clone().multiplyScalar(m==="moon"?.8:1.15),deepFill:new e.Color(t.deepFill).multiplyScalar(12).add(new e.Color(.1,.11,.12)),shade:new e.Color(t.slate[0],t.slate[1],t.slate[2])}),s.add(q.object);const D=q.anchors;await o.yield();const re=xt(D.flyThrough);s.fog=new e.FogExp2(K.clone(),t.dens),s.background=K.clone();const ie=new e.HemisphereLight(E,N,.9),oe=new e.DirectionalLight(A,1.5);oe.position.copy(r).multiplyScalar(60),s.add(ie,oe);const he=D.whales[3]?D.whales[3].top:new e.Vector3(-3,-9,30),Qe=S==="glass"?{preset:"calm",height:.07,detail:.3}:S==="squall"?{preset:"breeze",height:.4,foam:0}:{preset:"breeze",height:.28,foam:0},J=$e.makeSea({rng:n.fork("sea"),light:w,level:0,ocean:{...Qe,radius:520,windAngle:.35},underwater:{water:t.water,deep:t.deep,fogDensity:t.dens,floorY:-70,sunDisc:.2,rayIntensity:t.kitRays*(S==="squall"?.55:1),rays:{count:Math.round(56*h),range:150,length:S==="glass"?60:46,width:S==="glass"?1.7:2.2},particles:{count:Math.round(900*h*M),range:36,size:.03,color:"#FFF1D0",glowColor:"#4FB4FF",glowFraction:t.glowFrac,glowIntensity:2.4},bubbles:!1}});s.add(J.object);const pe=Ut(new e.Color,t.inkLin?new e.Color(t.inkLin[0],t.inkLin[1],t.inkLin[2]):new e.Color(t.ink),r.clone().negate(),S==="squall"?.3:.45);s.add(pe.object),await o.yield();const H=Ht({sunT:r,winCol:new e.Color(t.win),warmCol:new e.Color(t.warm),sunCol:A,fogCol:s.fog.color,coolCol:new e.Color(t.water).lerp(new e.Color(t.win),m==="moon"?.3:.15),seaK:t.seaK});s.add(H.object),S==="squall"&&(H.uniforms.uRain.value=1,H.uniforms.uRainDir.value.set(.25,4,-.968));const We={sunT:r,sunCol:A,fill:E,key:t.key*(m==="moon"?.7:1)},B=n.fork("weed"),ae=[];let G=null;if(p==="weed"){for(const l of[59,50,41,32,23])ae.push({x:l+B.range(-1.5,1.5),z:17.6+.07*(l-40)+B.range(-.8,.8),rx:B.range(4.4,5.6),rz:B.range(1.7,2.3),yaw:.07+B.range(-.12,.12),sprigs:1.2,mats:3,dens:1});for(const l of[63,51,39,27])ae.push({x:l+B.range(-1.5,1.5),z:29+.07*(l-40)+B.range(-.8,.8),rx:B.range(4.6,6),rz:B.range(1.6,2.2),yaw:.07+B.range(-.12,.12),sprigs:.8,mats:3,dens:1});ae.push({x:17,z:42,rx:2.2,rz:1.6,yaw:B.range(0,3),sprigs:.3,mats:2,dens:.9},{x:44,z:-4,rx:2.6,rz:1.5,yaw:B.range(0,3),sprigs:.3,mats:2,dens:.9},{x:-9,z:46,rx:3,rz:1.8,yaw:B.range(0,3),sprigs:.25,mats:2,dens:.9})}else p==="log"&&(ae.push({x:40,z:19.6,rx:3.3,rz:.75,yaw:.3,sprigs:1,mats:2,dens:.85},{x:27,z:27,rx:2.4,rz:1.5,yaw:1,sprigs:.5,mats:2,dens:.9}),G=jt(B,We),G.object.position.set(40,-.12,19.6),G.object.rotation.y=-.3,s.add(G.object));const O=ae.length?Rt(B,ae,{...We,count:Math.round((p==="weed"?820:240)*h*M)}):null;O&&s.add(O.object),await o.yield();const le={sunDir:r.clone(),sunColor:t.sun,sunIntensity:m==="moon"?1.6:2.5,sky:t.fill,skyIntensity:1.1,ground:t.deep,groundIntensity:1},I=U.makeFauna(s,{light:le}),R=I.add(U.makeFishSchool({rng:n.fork("jacks"),species:"sardines",count:Math.round(900*Math.min(1,M)*(.5+.5*h)),size:2.25,lod:"low",light:{...le,sunColor:"#FFF4E2",sky:"#DDE8EC",skyIntensity:1.5},center:[37,-3.5,7.5],radius:1.2,height:.3,spread:[3.5,1.55],spin:.8,top:"#51636B",belly:"#F2F6F6",fin:"#C9B25A"})),Je=R&&R.uniforms&&R.uniforms.uSunColor&&R.uniforms.uSkyColor&&R.uniforms.uGroundColor?[R.uniforms.uSunColor,R.uniforms.uSkyColor,R.uniforms.uGroundColor].map(l=>({un:l,base:l.value.clone()})):[],Re=R&&R.geometry&&R.geometry.isInstancedBufferGeometry?R.geometry:null,et=R?R.count:0;I.add(U.makeFishSchool({rng:n.fork("runners"),species:"mackerel",count:22,size:.8,light:le,center:[39,-1.9,26.5],radius:4.5,height:.4,spread:[1.5,.5,7],speed:1.5,top:"#2B6FA0",belly:"#F0E08C",fin:"#E8C84A"}));const $={value:0},L=X.fxGroup();s.add(L.object);const Ke=Math.min(1.2,Math.hypot(r.x,r.z)/Math.max(.3,r.y)),tt=Math.max(.6,r.y),ot=S==="squall"?16:6,at=S==="squall"?22:30,Be=S==="glass"?.68:1,nt=D.matriarch.axis.x,st=D.matriarch.axis.y,be=new e.Color(t.ray),ce=(l,x,v,u,V,j=n)=>({rng:j.fork(l),x:x+r.x*Ke*u,z:v+r.z*Ke*u,color:be,...V}),ue=Lt([ce("rays-ring",0,ot,14,{radius:at,count:16,reach:44,width:1.25*Be,intensity:.52*t.rayK}),ce("rays-entry",30,21,6,{radius:15,count:10,reach:36,width:1*Be,intensity:.8*t.rayK}),ce("rays-pass",nt-5,st-1,12,{radius:12,count:9,reach:42,width:1.05,intensity:.56*t.rayK}),ce("rays-deep",-8,34,30,{radius:30,count:10,reach:64,width:2,color:be.clone().lerp(new e.Color(t.fill),.6),intensity:.2*t.rayK,cls:1}),ce("rays-henge",0,S==="squall"?12:4,20,{radius:27,count:14,reach:58,width:1.7,color:be.clone().lerp(new e.Color(t.warm),.35),intensity:.5*t.rayK,cls:2},b)],{dir:new e.Vector3(-r.x,-r.y,-r.z),sy:tt,width:[.8,2.7],haze:48,absorb:t.absorb});s.add(ue.object),L.add(X.makeParticles({rng:n.fork("flakes"),preset:"ash",time:$,count:Math.round(500*h*M),box:[26,18,26],velocity:[.05,-.07,.03],velocityRandom:[.07,.05,.07],turbulence:[.25,.15,.4],size:[.018,.06],colors:["#E9E4D8","#CFC8B6","#F4E2B8"],lightDir:[r.x,r.y,r.z],near:[.4,1.6]})),L.add(X.makeParticles({rng:n.fork("salps"),preset:"bubbles",time:$,count:Math.round((p==="bare"?170:110)*h*M),box:[34,22,34],velocity:[.05,.012,.03],velocityRandom:[.05,.03,.05],turbulence:[.2,.1,.3],size:[.05,.13],near:[.5,2]})),L.add(X.makeParticles({rng:n.fork("snow"),preset:"dust",time:$,count:Math.round(800*h*M),opacity:.7,box:[32,24,32],velocity:[.05,-.09,.03],velocityRandom:[.08,.06,.08],turbulence:[.35,.25,.45],size:[.025,.085],colors:["#DDE8EC","#FFF1D0","#BCD3E2"],near:[.5,2]}));const xe=X.makeParticles({rng:n.fork("snow-deep"),preset:"dust",time:$,count:Math.round(700*h*M),opacity:.95,intensity:1.5,box:[40,26,40],velocity:[.04,-.08,.03],velocityRandom:[.07,.05,.07],turbulence:[.3,.2,.4],size:[.03,.11],colors:["#DDE8EC","#FFF1D0","#C8DCEA"],near:[.6,2.4]});if(xe.setOpacity(0),L.add(xe),L.add(X.makeParticles({rng:n.fork("thread"),preset:"bubbles",time:$,follow:!1,center:[he.x-.4,he.y*.5,he.z+.3],box:[.45,Math.max(2,-he.y-.6),.45],count:14,size:[.05,.12],velocity:[0,.5,0],velocityRandom:[.03,.15,.03],turbulence:[.12,.05,.12]})),m==="moon"){const l=D.calfRoute[D.calfRoute.length-1],x=["#4FB4FF","#7FD8FF","#3C7CFF"];L.add(X.makeParticles({rng:n.fork("sparks"),preset:"plankton",time:$,follow:!1,center:[l.x,l.y-1,l.z],box:[14,12,14],count:Math.round(380*h),colors:x,size:[.04,.1],intensity:3})),L.add(X.makeParticles({rng:n.fork("sparks2"),preset:"plankton",time:$,follow:!1,center:[D.gate.a.x,D.gate.a.y-1,D.gate.a.z],box:[9,6,9],count:Math.round(200*h),colors:x,size:[.04,.1],intensity:3}))}await o.yield();const rt=new e.Vector3(-13.5,-27,36),je=new e.Vector3(-.96,0,-.28).normalize(),ke=l=>({length:1,posAtDist:(x,v)=>v.copy(rt).addScaledVector(je,-l),tangentAtDist:(x,v)=>v.copy(je)}),ve={path:ke(0),u:Ye,lead:0,angle:0,side:1,offset:0,height:0,bow:0,rise:3,span:64,duration:Xe},Y={sunDir:new e.Vector3(r.x*.8,1,r.z*.8).normalize(),sunColor:"#"+new e.Color(t.sun).lerp(new e.Color(t.fill),.6).lerp(new e.Color(t.water),.45).getHexString(),sunIntensity:m==="moon"?1.3:1.7,sky:"#"+new e.Color(t.fill).lerp(new e.Color(t.water),.45).getHexString(),skyIntensity:1.6,ground:"#"+new e.Color(t.deep).lerp(new e.Color(t.water),.5).lerp(new e.Color(t.fill),.45).getHexString(),groundIntensity:3};let Ce=null;a==="whitetip"?(Ce=I.add(U.makeShark({rng:n.fork("whitetip"),length:2.8,speed:1.9,light:Y,top:"#5C6C7A",belly:"#E6EEF2",fin:"#F2F6F6",cross:ve}),{light:Y}),I.add(U.makeFishSchool({rng:n.fork("pilots"),species:"mackerel",count:5,size:.72,light:Y,spread:[.55,.35,.8],speed:1.9,wander:[.12,.1,.12,1.4],top:"#1E242A",belly:"#DCE4E8",fin:"#E8ECEE",cross:{...ve,u:Ye-.02,height:.3}}),{light:Y})):a==="silkies"?Ce=I.add(U.makeShark({rng:n.fork("silkies"),count:3,length:2.5,speed:2.1,spread:[2.2,1.6,5],light:Y,top:"#586878",belly:"#DDE8EE",fin:"#93A3B0",cross:{...ve,path:ke(1.5)}}),{light:Y}):Ce=I.add(U.makeMantaRay({rng:n.fork("manta"),span:2.7,speed:1.6,light:Y,top:"#46566A",belly:"#D5E0E8",fin:"#8496A6",cross:{...ve,path:ke(-5),height:-1.2}}),{light:Y});let _=null;if(F){let l=null,x=1e9;for(const v of q.sleepers){if(v.headDown||v.role!=="sleeper")continue;const u=Math.hypot(v.x+30,v.z+2);u<x&&(x=u,l=v)}if(l){const v=Ot();v.object.position.set(l.x,-.1,l.z),s.add(v.object);const u=X.makeParticles({rng:n.fork("blow"),preset:"bubbles",time:$,follow:!1,center:[l.x,-6.5,l.z],box:[3,13,3],count:280,size:[.07,.26],intensity:2.2});u.setOpacity(0),L.add(u),_={w:l,base:l.pivotY,lift:l.top+.35,foam:v,col:u,top:new e.Vector3(l.x,-4,l.z)}}}const ge=new e.Vector3(-.2517,-.582,.7733).normalize(),Ne=new e.Vector3().crossVectors(ge,new e.Vector3(0,1,0)).normalize(),it=new e.Vector3().crossVectors(ge,Ne),lt=D.portalSeat.position.clone().addScaledVector(ge,5),qe=[],He=b.range(0,6.283),ct=b.range(0,6.283);for(let l=0;l<14;l++){const x=l/14*Math.PI*2,v=12.6+.9*Math.sin(x*2+He)+.5*Math.sin(x*3+ct),u=lt.clone().addScaledVector(Ne,Math.cos(x)*v).addScaledVector(it,Math.sin(x)*v).addScaledVector(ge,.9*Math.sin(x*3+He));qe.push([u.x,u.y,u.z])}const Se={sunDir:new e.Vector3(r.x*1.3,.55,r.z*1.3).normalize(),sunColor:"#"+new e.Color(t.sun).lerp(new e.Color(t.fill),.35).getHexString(),sunIntensity:m==="moon"?1.2:1.6,sky:"#"+new e.Color(t.fill).lerp(new e.Color(t.water),.3).getHexString(),skyIntensity:1.1,ground:"#"+new e.Color(t.water).lerp(new e.Color(t.fill),.4).getHexString(),groundIntensity:1.4};I.add(U.makeFishSchool({rng:b.fork("wheel"),species:"mackerel",count:Math.round(190*Math.min(1.15,M)*(.6+.4*h)),size:2.4,speed:1.9,lod:"mid",light:Se,spread:[2.2,1.7,54],wander:[.3,.3,.3,.6],route:qe,closed:!0,start:b(),top:"#5A6E7C",belly:"#B4C2CC",fin:"#C9B25A",spec:2.6}),{light:Se,always:!0}),I.add(U.makeFishSchool({rng:b.fork("company"),species:"mackerel",count:9,size:1.5,speed:3.6,light:le,spread:[1.9,1.2,4.5],wander:[.3,.25,.3,1.1],top:"#2B6FA0",belly:"#E4E2BC",fin:"#E8C84A",along:{path:re,side:3.4,up:-.8,lead:8,from:.28,to:.47,drift:1.2}}),{light:le});const _e={...Se,skyIntensity:2.2,groundIntensity:2.4},ee=I.add(U.makeFishSchool({rng:b.fork("attend"),species:"mackerel",form:"pond",count:10,size:1.3,speed:.9,light:_e,spread:[2.3,.9],center:[D.calfRoute[0].x,D.calfRoute[0].y,D.calfRoute[0].z],top:"#93A096",belly:"#F2E6A8",fin:"#E8C84A"}),{light:_e,always:!0}),Fe=ee&&ee.uniforms&&ee.uniforms.uCenter?ee.uniforms.uCenter.value:null,we=new e.Vector3;await o.yield();const de=Gt("#FFD890");de.object.position.copy(D.portalSeat.position).addScaledVector(D.portalSeat.normal,-.15),de.object.quaternion.setFromUnitVectors(new e.Vector3(0,0,1),D.portalSeat.normal),s.add(de.object);const ut=new e.Vector3,dt=new e.Vector3,ft=new e.Vector3,mt=new e.Vector3,Ie=D.calfRoute[D.calfRoute.length-1].clone();Ie.y-=.5;const ht=new e.Vector3(-9,-21,27),pt=new e.Vector3(0,-7,-3),Le=[{at:(l,x)=>dt.copy(q.eyeWorld(ut)).lerp(q.calfWorld(mt).lerp(Ie,.5),k(.41,.445,x)),from:.33,to:.53,weight:.95,fade:.25},{at:(l,x)=>ft.copy(ht).lerp(pt,k(.5,.63,x)),from:.465,to:.86,weight:.96,fade:.11}];_&&Le.push({at:_.top,from:.19,to:.31,weight:.4});const Me=new e.Color,ze=new e.Color,$t=new e.Vector3,Xt=new e.Vector3,fe=new e.Vector3;let ye=null;const vt=l=>{for(const x of l.children){let v=!1;if(x.traverse(u=>{u.material&&u.material.uniforms&&u.material.uniforms.uReveal&&u.material.uniforms.uNear&&(v=!0)}),v)return x}return null};return{scene:s,path:re,duration:Xe,title:t.title,camera:{fov:58,near:.3,far:600,lookAhead:9,sway:.3,bank:.4},pois:Le,portal:{shape:"circle",radius:6,color:"#FFE7B0",glow:1,revealDistance:104,tilt:!0},post:{exposure:t.exposure,bloom:{strength:.35,radius:.6,threshold:.95},grade:{saturation:t.sat,contrast:1.05,tint:t.tint,shadowTint:t.shadow,vignette:.35,grain:.02,aberration:0}},ride:"none",update(l,x,v,u){const V=x;if($.value=V,v.getWorldPosition(fe),_){const te=k(.18,.25,u)*(1-k(.285,.36,u));_.w.pivotY=_.base+_.lift*te,_.foam.uniforms.uTime.value=V,_.foam.uniforms.uFoam.value=Ve((u-.235)/.11,0,1),_.foam.uniforms.uBlow.value=k(.243,.258,u)*(1-k(.27,.315,u)),_.col.setOpacity(k(.235,.26,u)*(1-k(.4,.47,u))),_.top.y=-Math.max(1.5,_.w.top*(1-te))}q.setProgress(u),q.update(l,V,v),ye||(ye=vt(s)),ye&&(ye.visible=u>=.42),J.update(l,V,v,s);const j=Ve(-fe.y,0,60),gt=k(9,46,j)*.85,Te=J.underwater.volumeColor,wt=Te.g/Math.max(1e-4,K.g);Me.copy(Te).multiplyScalar(t.gain),ze.copy(Q).multiplyScalar(wt*t.gain*1.5),t.fogTop&&(Me.setRGB(t.fogTop[0],t.fogTop[1],t.fogTop[2]),ze.setRGB(t.fogDeep[0],t.fogDeep[1],t.fogDeep[2])),s.fog.color.copy(Me).lerp(ze,gt),s.fog.density=t.dens,t.fogTop&&Te.copy(s.fog.color),s.background&&s.background.isColor&&s.background.copy(s.fog.color),pe.uniforms.uFog.value.copy(s.fog.color),pe.uniforms.uTime.value=V,pe.object.position.copy(fe),H.uniforms.uLift.value=k(26,42,j)*(1-k(.74,.84,u)),xe.setOpacity(k(22,36,j)),H.object.position.x=fe.x,H.object.position.z=fe.z,H.uniforms.uTime.value=V;const Z=k(.7,.8,u),Ue=Math.max(k(12,40,j),.8*Z);H.uniforms.uWin.value=t.winK*Ue,H.uniforms.uSpread.value=Math.max(k(16,42,j),.85*Z),H.uniforms.uHalo.value=t.haloK*(1-.7*k(8,40,j)),H.uniforms.uShade.value=t.shade*Ue*(1+.45*Z);const yt=Math.max(k(24,40,j),Z),Ae=Math.max(k(20,38,j),Z),Ge=S==="squall"?.6:1,Oe=Math.max(k(12,28,j),Z);H.uniforms.uSea.value=Oe,H.uniforms.uRays.value=t.seaRays*Oe*Ge*(1-.5*k(.9,.99,u)),q.setLight({deep:yt,rake:t.rake*Ae});const De=(1-k(24,38,j))*(1-.75*k(.62,.7,u));ue.uniforms.uTime.value=V,ue.uniforms.uK.value=De,ue.uniforms.uKDeep.value=Math.max(De*(1-k(.56,.64,u)),.3*Ae*(1-k(.72,.8,u))),ue.uniforms.uKHenge.value=Ae*Ge*(1-k(.86,.97,u)),J.underwater.rays&&J.underwater.rays.material.uniforms.uRayColor.value.multiplyScalar(.12+.88*De);const Ee=Math.max(k(13,28,j),Z),bt=1-.88*Ee;for(const te of Je)te.un.value.copy(te.base).multiplyScalar(bt);if(Re&&(Re.instanceCount=Math.max(1,Math.round(et*(1-.97*Ee)))),O){O.uDeepA.value=Math.max(k(10,26,j),Z),O.uTime.value=V;const te=O.uH.value;for(let me=0;me<O.clumps.length;me++)te[me]=J.heightAt(O.clumps[me].x,O.clumps[me].z,V)}G&&(G.uTime.value=V,G.object.position.y=J.heightAt(40,19.6,V)-.14,G.object.rotation.x=.12*Math.sin(V*.31),G.object.rotation.z=.03*Math.sin(V*.43+1)),Fe&&(q.calfWorld(we),Fe.set(we.x-.6,we.y-1.5,we.z+1.3),ee.bounds&&ee.bounds.center&&ee.bounds.center.copy(Fe)),I.update(l,V,v,u),R&&R.object&&Ee>.9&&(R.object.visible=!1),L.update(l,V,v),de.uniforms.uTime.value=V,de.uniforms.uKindle.value=k(.46,.6,u)*(1-.6*k(.76,.92,u))*(.8+.2*Math.sin(V*1.7))},dispose(){g.object.traverse(l=>{l.geometry&&l.geometry.dispose(),l.material&&l.material.dispose()}),g.dispose&&g.dispose()}}}};export{Jt as default};
