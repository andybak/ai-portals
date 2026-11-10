import*as a from"three";import{makeRng as Be}from"./core.js";const oe=`
#ifndef FX_GLSL_HASH
#define FX_GLSL_HASH
float hash11(float p){ p=fract(p*.1031); p*=p+33.33; p*=p+p; return fract(p); }
float hash12(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float hash13(vec3 p3){ p3=fract(p3*.1031); p3+=dot(p3,p3.zyx+31.32); return fract((p3.x+p3.y)*p3.z); }
vec2 hash22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
vec3 hash33(vec3 p3){ p3=fract(p3*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yxz+33.33); return fract((p3.xxy+p3.yxx)*p3.zyx); }
#endif
`,ve=`
#ifndef FX_GLSL_VALUE_NOISE
#define FX_GLSL_VALUE_NOISE
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash12(i),hash12(i+vec2(1,0)),f.x), mix(hash12(i+vec2(0,1)),hash12(i+vec2(1,1)),f.x), f.y); }
float vnoise(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(hash13(i),hash13(i+vec3(1,0,0)),f.x), mix(hash13(i+vec3(0,1,0)),hash13(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(hash13(i+vec3(0,0,1)),hash13(i+vec3(1,0,1)),f.x), mix(hash13(i+vec3(0,1,1)),hash13(i+vec3(1,1,1)),f.x), f.y), f.z); }
#endif
`,Fe=`
#ifndef FX_GLSL_SIMPLEX
#define FX_GLSL_SIMPLEX
vec3 fxMod289(vec3 x){ return x-floor(x*(1./289.))*289.; }
vec4 fxMod289(vec4 x){ return x-floor(x*(1./289.))*289.; }
vec3 fxPermute(vec3 x){ return fxMod289(((x*34.)+1.)*x); }
vec4 fxPermute(vec4 x){ return fxMod289(((x*34.)+1.)*x); }
float snoise(vec2 v){
  const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
  vec2 i=floor(v+dot(v,C.yy)); vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.); vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=fxMod289(vec3(i,0.)).xy; vec3 p=fxPermute(fxPermute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));
  vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.); m=m*m; m=m*m;
  vec3 x=2.*fract(p*C.www)-1.; vec3 h=abs(x)-.5; vec3 ox=floor(x+.5); vec3 a0=x-ox;
  m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw; return 130.*dot(m,g); }
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=fxMod289(i); vec4 p=fxPermute(fxPermute(fxPermute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=1.79284291400159-.85373472095314*vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3))); }
#endif
`,he=`
#ifndef FX_GLSL_FBM
#define FX_GLSL_FBM
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<5;i++){ s+=a*vnoise(p); p=mat2(1.6,1.2,-1.2,1.6)*p+7.1; a*=.5; } return s/.96875; }
float fbmLo(vec2 p){ float a=.5, s=0.; for(int i=0;i<3;i++){ s+=a*vnoise(p); p=mat2(1.6,1.2,-1.2,1.6)*p+7.1; a*=.5; } return s/.875; }
float fbm3(vec2 p){ return fbmLo(p); }
vec3 vnoised(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f), du=6.*f*(1.-f);
  float a=hash12(i), b=hash12(i+vec2(1,0)), c=hash12(i+vec2(0,1)), d=hash12(i+vec2(1,1)), k=a-b-c+d;
  return vec3(a+(b-a)*u.x+(c-a)*u.y+k*u.x*u.y, du*(vec2(b-a,c-a)+k*u.yx)); }
vec4 vnoised(vec3 p){ vec3 i=floor(p), w=fract(p); vec3 u=w*w*(3.-2.*w), du=6.*w*(1.-w);
  float a=hash13(i), b=hash13(i+vec3(1,0,0)), c=hash13(i+vec3(0,1,0)), d=hash13(i+vec3(1,1,0)), e=hash13(i+vec3(0,0,1)), f=hash13(i+vec3(1,0,1)), g=hash13(i+vec3(0,1,1)), h=hash13(i+vec3(1,1,1));
  float k1=b-a, k2=c-a, k3=e-a, k4=a-b-c+d, k5=a-c-e+g, k6=a-b-e+f, k7=-a+b+c-d+e-f-g+h;
  return vec4(a+k1*u.x+k2*u.y+k3*u.z+k4*u.x*u.y+k5*u.y*u.z+k6*u.z*u.x+k7*u.x*u.y*u.z,
    du*vec3(k1+k4*u.y+k6*u.z+k7*u.y*u.z, k2+k5*u.z+k4*u.x+k7*u.z*u.x, k3+k6*u.x+k5*u.y+k7*u.x*u.y)); }
vec3 fbm3d(vec2 p){ float a=.5; vec3 s=vec3(0.); mat2 m=mat2(1.,0.,0.,1.); const mat2 M=mat2(1.6,1.2,-1.2,1.6);
  for(int i=0;i<3;i++){ vec3 n=vnoised(p); s.x+=a*n.x; s.yz+=a*(n.yz*m); p=M*p+7.1; m=M*m; a*=.5; } return s/.875; }
float fbm(vec3 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+vec3(7.1,3.3,5.7); a*=.5; } return s/.9375; }
#endif
`,Ae=`
#ifndef FX_GLSL_VORONOI
#define FX_GLSL_VORONOI
vec3 voronoi(vec2 x){ vec2 n=floor(x), f=fract(x); vec2 mg, mr; float md=8., id=0.;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g=vec2(float(i),float(j)); vec2 o=hash22(n+g); vec2 r=g+o-f; float d=dot(r,r);
    if(d<md){ md=d; mr=r; mg=g; id=hash12(n+g+17.3); } }
  float me=8.;
  for(int j=-2;j<=2;j++) for(int i=-2;i<=2;i++){ vec2 g=mg+vec2(float(i),float(j)); vec2 o=hash22(n+g); vec2 r=g+o-f;
    if(dot(mr-r,mr-r)>.00001) me=min(me, dot(.5*(mr+r), normalize(r-mr))); }
  return vec3(sqrt(md), me, id); }
#endif
`,Ee=oe+ve+Fe+he+Ae,Q=`
#ifdef USE_FOG
varying float vFogDepth;
#endif
`,Z=`
#ifdef USE_FOG
vFogDepth = -mvPosition.z;
#endif
`,ee=`
#ifdef USE_FOG
uniform vec3 fogColor; varying float vFogDepth;
#ifdef FOG_EXP2
uniform float fogDensity;
#else
uniform float fogNear; uniform float fogFar;
#endif
#endif
float fxFog(){
#ifdef USE_FOG
  #ifdef FOG_EXP2
  return 1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
  return smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#else
  return 0.;
#endif
}
vec3 fxApplyFog(vec3 c){
#ifdef USE_FOG
  return mix(c, fogColor, fxFog());
#else
  return c;
#endif
}
// for premultiplied colour c with coverage a
vec3 fxFogPremult(vec3 c, float a){
#ifdef USE_FOG
  return mix(c, fogColor*a, fxFog());
#else
  return c;
#endif
}
// additive = 1: fade to black; additive = 0: fade to the fog colour
vec3 fxFogMix(vec3 c, float additive){
#ifdef USE_FOG
  return mix(c, fogColor*(1.-additive), fxFog());
#else
  return c;
#endif
}
`,Ce=`
uniform vec3 uEnvSunDir, uEnvSunColor, uEnvSky, uEnvHorizon, uEnvGround; uniform float uEnvAmbient;
// what a surface "sees" in direction d (world space); rough 0 = mirror, 1 = fully blurred. fxEnv = fxEnvSky + fxEnvSun
vec3 fxEnvSun(vec3 d, float rough){
  float sd = max(dot(d, uEnvSunDir), 0.);
  return uEnvSunColor*(pow(sd, mix(900., 4., pow(rough, .35)))*mix(7., .5, rough) + pow(sd, 6.)*.14); }
vec3 fxEnvSky(vec3 d, float rough){
  float y = d.y, soft = mix(.025, .7, rough);
  vec3 sky = mix(uEnvHorizon, uEnvSky, pow(smoothstep(0., 1., max(y, 0.)), mix(.45, 1., rough)));
  vec3 gnd = mix(uEnvHorizon*.4, uEnvGround, smoothstep(0., .55, -y));
  vec3 c = mix(gnd, sky, smoothstep(-soft, soft, y));
  vec3 fd = normalize(vec3(-uEnvSunDir.z, .3, uEnvSunDir.x));
  c += uEnvSky*pow(max(dot(d, fd), 0.), mix(26., 3., rough))*.7*(1.-rough*.6);
  float st = sin(d.x*4.3 + d.z*2.1 + sin(d.y*6.)*1.3)*sin(d.z*3.7 - d.x*1.9 + d.y*4.);
  c *= 1. + .28*st*(1.-rough)*smoothstep(-.15, .25, y);
  return c; }
vec3 fxEnv(vec3 d, float rough){ return fxEnvSky(d, rough) + fxEnvSun(d, rough); }
vec3 fxAmbient(vec3 n){ return (mix(uEnvGround, uEnvSky, n.y*.5+.5) + uEnvHorizon*.3*(1.-abs(n.y)))*uEnvAmbient; }
vec3 fxDiffuse(vec3 n){ return fxAmbient(n) + uEnvSunColor*max(dot(n, uEnvSunDir), 0.); }
float fxFresnel(float ndv, float f0){ float x = 1.-ndv; float x2 = x*x; return f0 + (1.-f0)*x2*x2*x; }
`,kt={hash:oe,value:ve,simplex:Fe,fbm:he,voronoi:Ae,noise:Ee,fogParsVert:Q,fogVert:Z,fogParsFrag:ee,env:Ce};function Oe(){return a.UniformsUtils.clone(a.UniformsLib.fog)}const C=(e,o)=>(e==null&&(e=o),e&&e.isColor?e.clone():Array.isArray(e)?new a.Color(e[0],e[1],e[2]):new a.Color(e)),O=(e,o)=>(e==null&&(e=o),typeof e=="number"?new a.Vector3(e,e,e):e.isVector3?e.clone():new a.Vector3(e[0],e[1],e[2])),$=(e,o)=>(e==null&&(e=o),typeof e=="number"?new a.Vector2(e,e):e.isVector2?e.clone():new a.Vector2(e[0],e[1])),te=e=>e&&e.rng||Be(1),ue=e=>e&&e.time&&typeof e.time=="object"?e.time:{value:0},q={blending:a.CustomBlending,blendEquation:a.AddEquation,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,blendSrcAlpha:a.OneFactor,blendDstAlpha:a.OneMinusSrcAlphaFactor};function ae({uniforms:e,vertexShader:o,fragmentShader:t,fog:n=!0,...r}){return new a.ShaderMaterial({uniforms:n?{...Oe(),...e}:e,vertexShader:o,fragmentShader:t,fog:n,...r})}function pe(e){const o=new a.InstancedBufferGeometry;return o.setAttribute("position",new a.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),o.setAttribute("uv",new a.Float32BufferAttribute([0,0,1,0,1,1,0,1],2)),o.setIndex([0,1,2,0,2,3]),o.instanceCount=e,o}const K=(e,o,t,n)=>{const r=new a.InstancedBufferAttribute(t,n);return e.setAttribute(o,r),r};function X(e,o,t=2){const n=new a.Mesh(e,o);return n.frustumCulled=!1,n.renderOrder=t,n.matrixAutoUpdate=!0,n}const Re=()=>{};function ne(e,o,t){const n=new a.Sphere(o.isVector3?o.clone():new a.Vector3(o[0],o[1],o[2]),t);return e.geometry.boundingSphere=n,e.frustumCulled=!1,e.onAfterRender=()=>{e.frustumCulled=!0,e.onAfterRender=Re},n}function It(e=[]){const o=new a.Group,t=[],n={object:o,items:t,add(r){return r&&(t.push(r),r.object&&o.add(r.object)),r},update(r,u,m){for(const i of t)i.update&&i.update(r,u,m)}};for(const r of e)n.add(r);return n}const Ue={disc:0,flake:1,bubble:2,sparkle:3,leaf:4,petal:5,streak:6,ash:7},Le={billboard:0,streak:1,tumble:2},Pe={snow:{count:5e3,box:[70,46,70],velocity:[1.2,-1.9,.4],velocityRandom:[.8,.9,.8],turbulence:[.55,.15,.7],size:[.045,.14],colors:["#ffffff","#eaf2ff","#d5e4f7"],intensity:1.1,opacity:.92,additive:.15,shape:"flake",near:[.5,3]},rain:{count:6e3,box:[50,40,50],velocity:[2.2,-24,1],velocityRandom:[.7,6,.7],turbulence:[0,0,0],mode:"streak",shape:"streak",size:[.014,.026],stretch:.04,colors:["#b9c9dc","#e2ecf7","#9fb4cc"],intensity:.8,opacity:.34,additive:.6,near:[1.2,5]},dust:{count:2600,box:[34,22,34],velocity:[.12,.03,.06],velocityRandom:[.12,.08,.12],turbulence:[.35,.25,.3],size:[.02,.06],colors:["#ffe9c2","#fff6e0","#ffd9a0"],intensity:1.6,opacity:.75,additive:1,shape:"disc",twinkle:.7,near:[.4,2.5]},pollen:{count:2e3,box:[44,26,44],velocity:[.35,.12,.15],velocityRandom:[.3,.2,.3],turbulence:[.9,.5,.35],size:[.04,.11],colors:["#fff3b0","#ffe27a","#fffbe6"],intensity:1.5,opacity:.8,additive:.7,shape:"disc",twinkle:.25,near:[.6,3]},embers:{count:1500,box:[40,30,40],velocity:[.6,2.6,.2],velocityRandom:[1.2,1.6,1.2],turbulence:[1.1,.4,1.1],size:[.06,.2],colors:["#ff6a1a","#ffc04a","#ff3a0c"],intensity:3,opacity:1,additive:1,shape:"disc",twinkle:.6,fadeUp:.9,near:[.5,2.5]},sparks:{count:900,box:[30,24,30],velocity:[.5,5.5,.2],velocityRandom:[5,5,5],turbulence:[.4,.2,2.2],mode:"streak",shape:"streak",size:[.012,.03],stretch:.07,colors:["#ffc24a","#fff0b8","#ff7a1c"],intensity:3,opacity:1,additive:1,twinkle:.5,fadeUp:.8,near:[.5,2.5]},fireflies:{count:500,box:[64,16,64],velocity:[.1,0,.1],velocityRandom:[.5,.1,.5],turbulence:[2.6,1.1,.33],size:[.11,.2],colors:["#d9ff52","#a6ff38","#fff18a"],intensity:2.8,opacity:1,additive:1,shape:"disc",blink:1.25,near:[.8,3.5],minAngle:.005},bubbles:{count:650,box:[46,34,46],velocity:[.15,1.3,.1],velocityRandom:[.3,.9,.3],turbulence:[.45,.1,1.1],size:[.05,.3],colors:["#dff6ff","#bfeaff","#ffffff"],intensity:1.5,opacity:.85,additive:.85,shape:"bubble",near:[.8,3]},petals:{count:1100,box:[44,28,44],velocity:[1.4,-.95,.5],velocityRandom:[.8,.5,.8],turbulence:[.9,.3,.8],mode:"tumble",shape:"petal",size:[.1,.2],spin:2.2,aspect:.8,colors:["#ffc4d6","#ffe6ee","#ff9dbb"],intensity:.9,opacity:1,additive:0,near:[.6,2.5]},leaves:{count:700,box:[50,30,50],velocity:[1.8,-1.35,.6],velocityRandom:[1.1,.6,1.1],turbulence:[1.3,.4,.7],mode:"tumble",shape:"leaf",size:[.16,.32],spin:2.6,aspect:.62,colors:["#e2701a","#c22f12","#f0b429"],intensity:.75,opacity:1,additive:0,near:[.8,3]},ash:{count:2400,box:[50,34,50],velocity:[.7,-.45,.25],velocityRandom:[.5,.35,.5],turbulence:[.8,.4,.5],mode:"tumble",shape:"ash",size:[.03,.1],spin:1.6,aspect:1,colors:["#8d8782","#c9c2bb","#4b4744"],intensity:.6,opacity:.9,additive:0,near:[.5,2.5]},stars:{count:4500,box:[520,520,520],velocity:[0,0,0],velocityRandom:[0,0,0],turbulence:[0,0,0],size:[.25,.9],colors:["#cfe0ff","#ffffff","#ffe2b8"],intensity:2,core:.5,opacity:1,additive:1,shape:"sparkle",twinkle:.55,near:[6,30],minAngle:.0028,fog:!1},plankton:{count:4e3,box:[44,30,44],velocity:[.18,.05,.1],velocityRandom:[.2,.15,.2],turbulence:[.5,.4,.4],size:[.03,.09],colors:["#58ffe0","#3aa8ff","#b8ffb0"],intensity:2.6,opacity:1,additive:1,shape:"disc",blink:.55,twinkle:.3,near:[.4,2.5]},magic:{count:1300,box:[46,30,46],velocity:[.1,.55,.1],velocityRandom:[.5,.5,.5],turbulence:[1.5,.8,.8],size:[.05,.2],colors:["#6fe8ff","#ff7af0","#ffe08a"],intensity:2.2,opacity:1,additive:1,shape:"sparkle",twinkle:.8,near:[.8,3.5],minAngle:.003}},Ge=`
uniform float uTime, uAhead, uStretch, uSpin, uBlink, uTwinkle, uMinAngle, uFadeUp, uAspect;
uniform vec3 uBox, uCenter, uFollow, uVel, uVelRand, uTurb;
uniform vec2 uSize, uNear;
attribute vec4 aSeed; attribute vec4 aRand;
varying vec2 vUv; varying vec4 vRand; varying float vAlpha; varying float vH; varying vec3 vN;
${Q}
void main(){
  vUv = uv; vRand = aRand; vN = vec3(0.,1.,0.);
  vec3 fwd = -vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  vec3 c = mix(uCenter, cameraPosition + fwd*uAhead, uFollow);
  float t = uTime, ph = aSeed.w*6.2831853, f = uTurb.z;
  vec3 vel = uVel + (aRand.xyz-.5)*uVelRand;
  vec3 p = aSeed.xyz*uBox + vel*t;
  vec3 wob = vec3(sin(t*f*(.7+aRand.x*.6)+ph) + .5*sin(t*f*1.9+ph*1.7),
                  sin(t*f*(.6+aRand.y*.6)+ph*2.3) + .5*sin(t*f*1.6+ph*.7),
                  cos(t*f*(.8+aRand.z*.6)+ph*1.3) + .5*cos(t*f*2.1+ph*2.9));
  p += wob*uTurb.xyx;
  p = mod(p - c + .5*uBox, uBox) - .5*uBox;
  vec3 e = p/(.5*uBox); e *= e;
  float edge = 1. - smoothstep(.62, 1., sqrt(sqrt(dot(e,e))));
  vH = p.y/uBox.y + .5;
  vec3 world = c + p;
  vec4 mvPosition = viewMatrix*vec4(world,1.);
  float dist = length(mvPosition.xyz);
  float size = mix(uSize.x, uSize.y, aRand.w*aRand.w) * (1. - uFadeUp*vH*.75);
  float k = max(size, uMinAngle*dist);
  float aScale = (size*size)/(k*k);
#if MODE == 1
  vec3 vv = (viewMatrix*vec4(vel,0.)).xyz;
  vec3 ax = normalize(vv + vec3(0.,1e-4,0.));
  vec3 side = normalize(cross(ax, normalize(mvPosition.xyz)));
  float len = max(length(vel)*uStretch, k*2.);
  mvPosition.xyz += ax*position.y*len + side*position.x*k;
#elif MODE == 2
  vec3 ax = normalize(aRand.xyz*2.-1.+vec3(.001,.002,.003));
  float ang = t*uSpin*(.45+aRand.w) + ph + wob.x*.6;
  float ca = cos(ang), sa = sin(ang);
  vec3 lp = vec3(position.x*k*uAspect, position.y*k, 0.);
  lp = lp*ca + cross(ax,lp)*sa + ax*dot(ax,lp)*(1.-ca);
  vec3 n = vec3(0.,0.,1.); n = n*ca + cross(ax,n)*sa + ax*dot(ax,n)*(1.-ca);
  vN = n;
  mvPosition = viewMatrix*vec4(world + lp, 1.);
#else
  float ra = ph + uSpin*t*(aRand.x-.5)*2.;
  float cr = cos(ra), sr = sin(ra);
  mvPosition.xy += mat2(cr,sr,-sr,cr)*position.xy*k;
#endif
  float bl = 1.;
  if(uBlink > 0.){ float s = sin(t*uBlink*(.6+aRand.y*.8) + ph*3.) * sin(t*uBlink*.37*(.5+aRand.x) + ph); bl = smoothstep(-.15,.6,s); bl = mix(.02, 1., bl*bl); }
  bl *= 1. - uTwinkle*(.5+.5*sin(t*(2.5+aRand.z*8.)+ph*5.));
  vAlpha = edge * smoothstep(uNear.x, uNear.y, dist) * aScale * bl * (1. - uFadeUp*smoothstep(.35,1.,vH));
  gl_Position = projectionMatrix*mvPosition;
  if(vAlpha < .003) gl_Position = vec4(2.,2.,2.,1.);
  ${Z}
}`,De=`precision highp float;
uniform vec3 uColorA, uColorB, uColorC, uLightDir;
uniform float uIntensity, uOpacity, uAdditive, uCore;
varying vec2 vUv; varying vec4 vRand; varying float vAlpha; varying float vH; varying vec3 vN;
${oe}${ve}${ee}
void main(){
  vec2 q = vUv*2.-1.; float r = length(q);
  float z = vRand.z;
  vec3 col = z < .5 ? mix(uColorA, uColorB, z*2.) : mix(uColorB, uColorC, z*2.-1.);
  float a = 0.;
#if SHAPE == 0
  float g = max(1.-r*r, 0.); a = g*g*g; col *= 1. + uCore*a*a;
#elif SHAPE == 1
  float rr = r*(1. + .1*cos(6.*atan(q.y,q.x)));
  a = smoothstep(1., .2, rr); a *= .55 + .45*smoothstep(.7, 0., rr);
#elif SHAPE == 2
  float rim = smoothstep(.55,.93,r)*smoothstep(1.,.95,r);
  float fill = .05*smoothstep(1.,.92,r);
  vec2 h1 = q - vec2(-.36,.42), h2 = q - vec2(.34,-.44);
  float hl = exp(-dot(h1,h1)*26.) + .35*exp(-dot(h2,h2)*40.);
  vec3 film = .55 + .45*cos(6.2831853*(r*1.2 + vRand.x + vec3(0.,.33,.67)));
  col = mix(col, col*film*1.6, .45*rim) + hl*1.5;
  a = rim*.5 + fill + hl;
#elif SHAPE == 3
  float g = max(1.-r*r, 0.); g = g*g*g;
  vec2 aq = abs(q);
  float sp = exp(-aq.x*22.)*exp(-aq.y*2.6) + exp(-aq.y*22.)*exp(-aq.x*2.6);
  a = (g*g*1.2 + sp*.9 + g*.25) * (1.-smoothstep(.7,1.,r)); col *= 1. + uCore*g*g;
#elif SHAPE == 4
  float w = .56*(1.-q.y*q.y)*(1.-.22*q.y);
  float d = abs(q.x) - w;
  a = smoothstep(.05,-.05,d);
  col *= .72 + .28*smoothstep(0.,.1,abs(q.x));
  col *= .9 + .1*sin((abs(q.x)*1.6 - q.y)*17.);
  col *= mix(.8, 1.15, vRand.x);
#elif SHAPE == 5
  float w = .66*sqrt(max(1.-q.y*q.y,0.))*(.72+.34*q.y) - .1*exp(-q.x*q.x*30.)*smoothstep(.6,1.,q.y);
  float d = abs(q.x) - w;
  a = smoothstep(.06,-.06,d);
  col = mix(min(col*1.25+.08, vec3(1.)), col, smoothstep(-1.,.5,q.y));
  col *= .93 + .07*sin(abs(q.x)*26.);
#elif SHAPE == 6
  float ac = max(1.-q.x*q.x,0.);
  a = ac*ac * pow(clamp(vUv.y,0.,1.), 1.6) * smoothstep(1.,.86,vUv.y);
  col *= 1. + uCore*a;
#else
  float n = vnoise(q*2.4 + vRand.xy*37.);
  a = smoothstep(.12,-.08, r - .38 - .55*n);
  col *= .7 + .6*vnoise(q*5. + vRand.yx*11.);
#endif
#if MODE == 2
  float nl = dot(normalize(vN), uLightDir);
  col *= .42 + .5*abs(nl) + .28*max(nl,0.);
#endif
  a *= vAlpha*uOpacity;
  if(a < .003) discard;
  col = fxFogMix(col*uIntensity, uAdditive);
  gl_FragColor = vec4(col*a, a*(1.-uAdditive));
}`;function Vt(e={}){const o=te(e),t={...Pe[e.preset||"dust"]||Pe.dust,...e},n=Math.max(1,Math.round(t.count*(t.density??1))),r=pe(n),u=new Float32Array(n*4),m=new Float32Array(n*4);for(let v=0;v<n*4;v++)u[v]=o(),m[v]=o();K(r,"aSeed",u,4),K(r,"aRand",m,4);const i=e.colors||(e.color!=null?[e.color,e.color,e.color]:t.colors)||["#ffffff"],l=t.follow===!1?[0,0,0]:t.follow==="xz"?[1,0,1]:[1,1,1],d=O(t.box),y={uTime:ue(t),uBox:{value:d},uCenter:{value:O(t.center,[0,0,0])},uFollow:{value:new a.Vector3(...l)},uAhead:{value:t.ahead??d.z*.3},uVel:{value:O(t.velocity,[0,0,0])},uVelRand:{value:O(t.velocityRandom,[0,0,0])},uTurb:{value:O(t.turbulence,[0,0,0])},uSize:{value:$(t.size,[.05,.1])},uNear:{value:$(t.near,[.5,3])},uStretch:{value:t.stretch??.04},uSpin:{value:t.spin??0},uBlink:{value:t.blink??0},uTwinkle:{value:t.twinkle??0},uMinAngle:{value:t.minAngle??.0022},uFadeUp:{value:t.fadeUp??0},uAspect:{value:t.aspect??1},uColorA:{value:C(i[0],"#ffffff")},uColorB:{value:C(i[1]??i[0],"#ffffff")},uColorC:{value:C(i[2]??i[0],"#ffffff")},uIntensity:{value:t.intensity??1},uOpacity:{value:t.opacity??1},uAdditive:{value:t.additive??1},uCore:{value:t.core??.6},uLightDir:{value:O(t.lightDir,[.4,.8,.45]).normalize()}},f=ae({uniforms:y,vertexShader:Ge,fragmentShader:De,fog:t.fog!==!1,defines:{MODE:Le[t.mode||"billboard"]??0,SHAPE:Ue[t.shape||"disc"]??0},transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),h=X(r,f,t.renderOrder??3),p=y.uTurb.value,s=t.follow===!1?ne(h,y.uCenter.value,d.length()*.5+(Math.abs(p.x)+Math.abs(p.y))*1.5+y.uSize.value.y*2+(t.mode==="streak"?y.uVel.value.length()*y.uStretch.value:0)):null;return{object:h,uniforms:y,material:f,count:n,update(v,g){y.uTime.value=g,s&&s.center.copy(y.uCenter.value)},setOpacity(v){y.uOpacity.value=v,r.instanceCount=v>.002?n:0}}}const qe=`
uniform float uTime, uSize, uMinAngle, uFlicker, uDepthBias; uniform vec2 uNear;
attribute vec3 aPos; attribute vec4 aColor; attribute float aPhase;
varying vec2 vUv; varying vec3 vColor; varying float vA;
${Q}
void main(){
  vUv = uv; vColor = aColor.rgb;
  vec4 mvPosition = modelViewMatrix*vec4(aPos,1.);
  float dist = length(mvPosition.xyz);
  float size = uSize*aColor.a;
  float k = max(size, uMinAngle*dist);
  float fl = sin(uTime*(7.+aPhase*9.)+aPhase*40.)*sin(uTime*3.1+aPhase*17.) + .5*sin(uTime*23.+aPhase*90.);
  vA = max((size*size)/(k*k), .12) * (1. - uFlicker*(.5+.33*fl)) * smoothstep(uNear.x*size, uNear.y*size, dist);
  vec4 q = mvPosition; q.xy += position.xy*k;
  gl_Position = projectionMatrix*q;
  vec4 pb = projectionMatrix*(q + vec4(0.,0.,min(uDepthBias*size, dist*.5),0.));
  gl_Position.z = pb.z/pb.w*gl_Position.w;
  if(aColor.a <= 0.) gl_Position = vec4(2.,2.,2.,1.);
  ${Z}
}`,je=`precision highp float;
uniform float uIntensity, uRays, uSpikes, uHalo, uCore, uTime, uFogAmount;
varying vec2 vUv; varying vec3 vColor; varying float vA;
${ee}
void main(){
  vec2 q = vUv*2.-1.; float r = length(q);
  float w = max(1.-r, 0.); w = w*w*(3.-2.*w);
  float core = exp(-r*r*70.)*uCore;
  float mid = exp(-r*6.5)*.55;
  float halo = w*w*uHalo*.22;
  float I = core + (mid + halo)*w;
  if(uRays > 0.){ float an = atan(q.y,q.x);
    float ry = pow(.5+.5*cos(an*uRays + sin(uTime*.3)*.4), 5.) + .6*pow(.5+.5*cos(an*uRays*2.3 + 1.7 - uTime*.11), 9.);
    I += ry*exp(-r*3.2)*w*.5; }
  if(uSpikes > 0.){ vec2 aq = abs(q); I += (exp(-aq.y*34.)*exp(-aq.x*2.4) + exp(-aq.x*34.)*exp(-aq.y*2.4))*w*uSpikes; }
  vec3 col = (vColor*I + vec3(core)*.6) * vA * uIntensity;
  col *= 1. - fxFog()*uFogAmount;
  gl_FragColor = vec4(col, 0.);
}`;function Te(e={}){const o=te(e);let t=e.positions;if(!t){const c=e.count??60,A=O(e.area,[80,20,80]);t=[];for(let F=0;F<c;F++)t.push([(o()-.5)*A.x,(o()-.5)*A.y,(o()-.5)*A.z])}const n=t instanceof Float32Array,r=n?t.length/3:t.length,u=pe(r),m=new Float32Array(r*3),i=new Float32Array(r*4),l=new Float32Array(r),d=C(e.color,"#ffd9a0"),y=new a.Color;for(let c=0;c<r;c++){if(n)m[c*3]=t[c*3],m[c*3+1]=t[c*3+1],m[c*3+2]=t[c*3+2];else{const F=t[c];F.isVector3?(m[c*3]=F.x,m[c*3+1]=F.y,m[c*3+2]=F.z):(m[c*3]=F[0],m[c*3+1]=F[1],m[c*3+2]=F[2])}const A=e.colors?y.copy(C(Array.isArray(e.colors)?e.colors[c%e.colors.length]:e.colors)):y.copy(d);i[c*4]=A.r,i[c*4+1]=A.g,i[c*4+2]=A.b,i[c*4+3]=e.sizes?e.sizes[c%e.sizes.length]:1+(e.sizeJitter??0)*(o()-.5)*2,l[c]=o()}const f=K(u,"aPos",m,3),h=K(u,"aColor",i,4);K(u,"aPhase",l,1);const p={uTime:ue(e),uSize:{value:e.size??3},uIntensity:{value:e.intensity??2.2},uMinAngle:{value:e.minAngle??.004},uFlicker:{value:e.flicker??0},uDepthBias:{value:e.depthBias??.25},uNear:{value:$(e.near,[.25,1.5])},uRays:{value:e.rays??0},uSpikes:{value:e.spikes??0},uHalo:{value:e.halo??1},uCore:{value:e.core??1},uFogAmount:{value:e.fogAmount??1}},s=ae({uniforms:p,vertexShader:qe,fragmentShader:je,fog:e.fog!==!1,transparent:!0,depthWrite:!1,depthTest:e.depthTest!==!1,...q}),v=X(u,s,e.renderOrder??4),g=new a.Sphere,S=new a.Vector3,w=new a.Box3;let z=0;for(let c=0;c<r;c++)w.expandByPoint(S.set(m[c*3],m[c*3+1],m[c*3+2])),z=Math.max(z,i[c*4+3]);w.getBoundingSphere(g);const b=ne(v,g.center,g.radius),M=()=>{b.center.copy(g.center),b.radius=g.radius+p.uSize.value*z*1.2+2};return M(),{object:v,uniforms:p,material:s,count:r,update(c,A){p.uTime.value=A},setPosition(c,A,F,I){A.isVector3?S.copy(A):S.set(A,F,I),f.setXYZ(c,S.x,S.y,S.z),f.needsUpdate=!0,g.expandByPoint(S),M()},setColor(c,A){const F=C(A);h.setXYZ(c,F.r,F.g,F.b),h.needsUpdate=!0},setSize(c,A){h.setW(c,A),h.needsUpdate=!0,A>z&&(z=A,M())}}}function _t(e={}){const o=Te({rays:0,...e,positions:[[0,0,0]],colors:null,sizes:null});return o.object.position.copy(O(e.position,[0,0,0])),o}const He=`
uniform vec3 uDir; uniform float uLength, uMinAngle; uniform vec2 uWidth, uNear, uFar;
attribute vec3 aOrigin; attribute vec4 aParam;
varying vec2 vUv; varying vec4 vParam; varying float vFade;
${Q}
void main(){
  vUv = uv; vParam = aParam;
  vec3 o = (modelMatrix*vec4(aOrigin,1.)).xyz;
  vec3 d = normalize(mat3(modelMatrix)*uDir);
  float s = uv.y, L = uLength*aParam.y;
  vec3 pc = o + d*s*L;
  vec3 toCam = cameraPosition - pc;
  vec3 side = normalize(cross(d, toCam));
  float w = mix(uWidth.x, uWidth.y, s)*aParam.x;
  float k = max(w, uMinAngle*length(toCam));               // never thinner than a few pixels: widen and dim instead
  vec3 world = pc + side*position.x*2.*k;
  vec3 oc = cameraPosition - o; float tt = clamp(dot(oc,d), 0., L);
  float dAxis = length(oc - d*tt);
  float wHere = mix(uWidth.x, uWidth.y, tt/L)*aParam.x;
  float along = abs(dot(d, normalize(cameraPosition - (o + d*L*.5))));
  vFade = smoothstep(uNear.x*wHere, uNear.y*wHere, dAxis) * (1. - smoothstep(.8, .985, along)) * (1. - smoothstep(uFar.x, uFar.y, dAxis)) * (w/k);
  vec4 mvPosition = viewMatrix*vec4(world,1.);
  gl_Position = projectionMatrix*mvPosition;
  ${Z}
}`,We=`precision highp float;
uniform vec3 uColor; uniform float uIntensity, uTime, uFalloff, uSpeed, uFogAmount;
varying vec2 vUv; varying vec4 vParam; varying float vFade;
${oe}${ve}${he}${ee}
void main(){
  float x = vUv.x*2.-1., s = vUv.y, ph = vParam.z;
  float across = max(1.-x*x, 0.); across *= across;
  float along = smoothstep(0., .1, s) * pow(max(1.-s, 0.), uFalloff);
  float n = fbmLo(vec2(x*1.3 + ph*23., s*2.5 - uTime*uSpeed*.12 + ph*7.));
  float fine = vnoise(vec2(x*5. + ph*61., uTime*uSpeed*.22 + ph*13.));
  float shimmer = .7 + .3*sin(uTime*uSpeed*(.35+ph*.5) + ph*20.);
  float I = across*along*(.45 + .75*n)*(.75 + .5*fine)*shimmer*vParam.w*vFade*uIntensity;
  vec3 col = uColor*I*(1. - fxFog()*uFogAmount);
  gl_FragColor = vec4(col, 0.);
}`;function Nt(e={}){const o=te(e),t=e.count??16,n=e.radius??26,r=O(e.direction,[.35,-1,.2]).normalize(),u=pe(t),m=new a.Vector3().crossVectors(r,Math.abs(r.y)>.9?new a.Vector3(1,0,0):new a.Vector3(0,1,0)).normalize(),i=new a.Vector3().crossVectors(r,m).normalize(),l=new Float32Array(t*3),d=new Float32Array(t*4);for(let s=0;s<t;s++){const v=o()*Math.PI*2,g=Math.sqrt(o())*n,S=Math.cos(v)*g,w=Math.sin(v)*g;l[s*3]=m.x*S+i.x*w,l[s*3+1]=m.y*S+i.y*w,l[s*3+2]=m.z*S+i.z*w,d[s*4]=.5+o()*1.1,d[s*4+1]=.6+o()*.4,d[s*4+2]=o(),d[s*4+3]=.35+o()*.65}K(u,"aOrigin",l,3),K(u,"aParam",d,4);const y={uTime:ue(e),uDir:{value:r},uLength:{value:e.length??90},uWidth:{value:$(e.width,[2.4,8])},uNear:{value:$(e.near,[.6,3])},uFar:{value:$(e.far,[1e6,2e6])},uColor:{value:C(e.color,"#ffe2b0")},uIntensity:{value:e.intensity??.3},uFalloff:{value:e.falloff??1.3},uSpeed:{value:e.speed??1},uFogAmount:{value:e.fogAmount??.6},uMinAngle:{value:e.minAngle??.006}},f=ae({uniforms:y,vertexShader:He,fragmentShader:We,fog:e.fog!==!1,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),h=X(u,f,e.renderOrder??3);h.position.copy(O(e.position,[0,60,0]));const p=y.uLength.value;return ne(h,r.clone().multiplyScalar(p*.5),p*.5+n+y.uWidth.value.y*3.4),{object:h,uniforms:y,material:f,count:t,update(s,v){y.uTime.value=v}}}const $e=`
uniform float uActive, uFlash, uWidth, uMinAngle;
attribute vec3 aTan; attribute vec4 aInfo;
varying float vSide; varying float vBright;
${Q}
void main(){
  vSide = uv.x; vBright = aInfo.w;
  vec4 mvPosition = modelViewMatrix*vec4(position,1.);
  vec3 tv = normalize(mat3(modelViewMatrix)*aTan);
  vec3 side = normalize(cross(tv, normalize(mvPosition.xyz)));
  float w = max(aInfo.x*uWidth, uMinAngle*length(mvPosition.xyz)*aInfo.x) * 7.;
  mvPosition.xyz += side*uv.x*w;
  gl_Position = projectionMatrix*mvPosition;
  if(abs(aInfo.y-uActive) > .5 || uFlash < .004) gl_Position = vec4(2.,2.,2.,1.);
  ${Z}
}`,Xe=`precision highp float;
uniform vec3 uColor; uniform float uFlash, uIntensity, uFogAmount;
varying float vSide; varying float vBright;
${ee}
void main(){
  float x = abs(vSide);
  float core = exp(-x*x*110.);
  float glow = exp(-x*5.5)*(1.-x)*.2;
  vec3 col = (vec3(1.)*core*2.2 + uColor*(glow + core*.8)) * vBright * uFlash * uIntensity;
  gl_FragColor = vec4(col*(1. - fxFog()*uFogAmount), 0.);
}`;function we(e,o,t,n,r){let u=[o,t],m=o.distanceTo(t)*r;const i=new a.Vector3().subVectors(t,o).normalize(),l=new a.Vector3().crossVectors(i,Math.abs(i.y)>.9?new a.Vector3(1,0,0):new a.Vector3(0,1,0)).normalize(),d=new a.Vector3().crossVectors(i,l);for(let y=0;y<n;y++){const f=[u[0]];for(let h=0;h<u.length-1;h++){const p=new a.Vector3().addVectors(u[h],u[h+1]).multiplyScalar(.5);p.addScaledVector(l,(e()-.5)*2*m).addScaledVector(d,(e()-.5)*2*m),f.push(p,u[h+1])}u=f,m*=.5}return u}function Bt(e={}){const o=te(e),t=O(e.from,[0,220,0]),n=O(e.to,[20,0,10]),r=e.variants??5,u=e.jaggedness??.13,m=e.branches??5,i=[],l=[],d=[],y=[],f=[],h=(_,E,U,V,P)=>{const L=i.length/3,j=_.length,H=new a.Vector3;for(let D=0;D<j;D++){H.subVectors(_[Math.min(j-1,D+1)],_[Math.max(0,D-1)]).normalize();const ie=E*(P?1-.75*(D/(j-1)):1),fe=V*(P?1-.6*(D/(j-1)):1);for(const Y of[-1,1])i.push(_[D].x,_[D].y,_[D].z),l.push(H.x,H.y,H.z),d.push(Y,D/(j-1)),y.push(ie,U,0,fe);if(D<j-1){const Y=L+D*2;f.push(Y,Y+1,Y+2,Y+1,Y+3,Y+2)}}},p=t.distanceTo(n);for(let _=0;_<r;_++){const E=o.fork?o.fork("bolt"+_):o,U=n.clone().add(new a.Vector3((E()-.5)*p*.3,0,(E()-.5)*p*.3)),V=we(E,t,U,6,u);h(V,1,_,1,!1);for(let P=0;P<m;P++){const L=Math.floor((.08+E()*.7)*(V.length-1)),j=V[L],H=1-L/(V.length-1),D=new a.Vector3().subVectors(U,t).normalize();D.x+=(E()-.5)*1.5,D.z+=(E()-.5)*1.5,D.y*=.7+E()*.5,D.normalize();const ie=p*H*(.22+E()*.4),fe=j.clone().addScaledVector(D,ie),Y=we(E,j,fe,4,u*1.5);if(h(Y,.5,_,.5,!0),E()<.6){const xe=Math.floor((.3+E()*.5)*(Y.length-1)),ye=Y[xe],W=D.clone();W.x+=(E()-.5)*1.4,W.z+=(E()-.5)*1.4,W.normalize(),h(we(E,ye,ye.clone().addScaledVector(W,ie*.45),3,u*1.6),.3,_,.3,!0)}}}const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(i,3)),s.setAttribute("aTan",new a.Float32BufferAttribute(l,3)),s.setAttribute("uv",new a.Float32BufferAttribute(d,2)),s.setAttribute("aInfo",new a.Float32BufferAttribute(y,4)),s.setIndex(f);const v=C(e.color,"#a9c4ff"),g=e.fogAmount??.5,S={uActive:{value:0},uFlash:{value:0},uWidth:{value:e.width??p*.0022},uMinAngle:{value:.0011},uColor:{value:v},uIntensity:{value:e.intensity??6},uFogAmount:{value:g}},w=ae({uniforms:S,vertexShader:$e,fragmentShader:Xe,fog:e.fog!==!1,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),z=X(s,w,5),b=new a.Group;b.add(z);const M=O(e.position,[0,0,0]);b.position.copy(M);const c=Te({positions:[t,n.clone().lerp(t,.03)],color:v,sizes:[p*.9,p*.35],size:1,intensity:0,near:[.02,.1],minAngle:0,depthBias:.05,fog:e.fog!==!1,fogAmount:g});b.add(c.object);let A=null;e.light!==!1&&(A=new a.PointLight(v,0,e.lightDistance??p*3,e.lightDecay??1.2),A.position.copy(t).lerp(n,.45),b.add(A));const F=e.interval??4.5,I=e.area??0,T=e.lightIntensity??900,B=o()*1e3;let N=!1;z.onAfterRender=()=>{N=!0,z.onAfterRender=Re};const R=(_,E)=>{const U=Math.sin(_*127.1+E*311.7+B)*43758.5453;return U-Math.floor(U)},G=_=>(_+.1+.55*R(_,1))*F,k={object:b,uniforms:S,material:w,light:A,bolt:z,glow:c,flash:0,strike:0,offset:e.offset??0,triangles:f.length/3,nextStrike(_){const E=_+k.offset;let U=Math.floor(E/F)-1;for(let V=0;V<4;V++,U++){const P=G(U);if(P>=E)return P-k.offset}return _},update(_,E){const U=E+k.offset,V=Math.floor(U/F),P=U-G(V);let L=0;if(P>=0&&P<.95){const j=.14+.08*R(V,2),H=j+.09+.1*R(V,3);L=Math.exp(-Math.max(P-.05,0)*13),P>j&&(L+=.7*Math.exp(-(P-j)*16)),P>H&&(L+=.5*Math.exp(-(P-H)*9)),L=Math.min(1,L)*(.88+.12*Math.sin(P*140))}k.flash=L,k.strike=V,S.uFlash.value=L,S.uActive.value=Math.floor(R(V,4)*r),I>0&&(b.position.set(M.x+(R(V,5)-.5)*I,M.y,M.z+(R(V,6)-.5)*I),b.rotation.y=R(V,7)*Math.PI*2),c.uniforms.uIntensity.value=L*(e.glow??.5),A&&(A.intensity=L*T),z.visible=c.object.visible=L>.004||!N}};return k}const Ye=`
uniform float uTime, uFold, uFollow, uSpeed;
attribute vec3 aNrm; attribute float aPhase;
varying vec2 vUv; varying float vPhase;
void main(){
  vUv = uv; vPhase = aPhase;
  float u = uv.x, t = uTime*uSpeed, ph = aPhase*6.2831853;
  float fold = sin(u*15. + t*.23 + ph) + .45*sin(u*33. - t*.37 + ph*2.1) + 1.5*sin(u*5.3 + t*.11 + ph*.7);
  vec3 p = position + aNrm*fold*uFold*(.55+.45*uv.y);
  p.y += sin(u*8. + t*.17 + ph)*uFold*.35;
  vec4 w = modelMatrix*vec4(p,1.); w.xyz += cameraPosition*uFollow;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,Je=`precision highp float;
uniform vec3 uColorA, uColorB, uColorC; uniform float uTime, uIntensity, uSpeed, uRays;
varying vec2 vUv; varying float vPhase;
${oe}${ve}${he}
void main(){
  float u = vUv.x, v = vUv.y, t = uTime*uSpeed, ph = vPhase*37.;
  float n1 = vnoise(vec2(u*uRays + t*.22 + ph, ph*.3 + t*.03));
  float n2 = vnoise(vec2(u*uRays*3.1 - t*.4 + ph*2., v*2. + ph));
  float n3 = vnoise(vec2(u*uRays*.31 + t*.07, ph + 3.));
  float slow = fbmLo(vec2(u*5. + t*.045 + ph, ph*.7 - t*.02));
  float curtain = (.3 + .7*n1*n1*1.6) * (.65 + .35*n2);
  float top = pow(max(1.-v, 0.), 2.6 - 1.7*n3)*smoothstep(1., .8, v);
  float lo = .03 + .1*n3 + .05*n1;
  float bottom = smoothstep(lo*.3, lo + .06, v);
  float ends = smoothstep(0., .1, u)*smoothstep(1., .9, u);
  float I = bottom*top*curtain*smoothstep(.22,.72,slow)*ends;
  vec3 col = mix(uColorA, uColorB, smoothstep(.12, .8, v + (n1-.5)*.35));
  col = mix(uColorC, col, smoothstep(lo*.3, lo + .14, v));
  gl_FragColor = vec4(col*I*uIntensity, 0.);
}`;function Et(e={}){const o=te(e),t=e.count??3,n=e.segments??160,r=e.radius??1400,u=e.altitude??260,m=e.height??560,i=e.arc??2.6,l=e.heading??0,d=[],y=[],f=[],h=[],p=[];for(let z=0;z<t;z++){const b=r*(.72+.56*(t>1?z/(t-1):.5))*(.94+o()*.12),M=l-i/2+(o()-.5)*.5,c=M+i*(.75+o()*.3),A=o()*6.28,F=o()*6.28,I=u*(.85+o()*.4),T=m*(.75+o()*.5),B=o(),N=d.length/3;for(let R=0;R<=n;R++){const G=R/n,k=M+(c-M)*G,_=b*(1+.1*Math.sin(G*5+A)+.05*Math.sin(G*13+F)),E=Math.sin(k)*_,U=-Math.cos(k)*_,V=I*(1+.25*Math.sin(G*3.1+F));for(let P=0;P<2;P++)d.push(E*(1-P*.08),V+P*T,U*(1-P*.08)),y.push(Math.sin(k),0,-Math.cos(k)),f.push(G,P),h.push(B);if(R<n){const P=N+R*2;p.push(P,P+2,P+1,P+1,P+2,P+3)}}}const s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(d,3)),s.setAttribute("aNrm",new a.Float32BufferAttribute(y,3)),s.setAttribute("uv",new a.Float32BufferAttribute(f,2)),s.setAttribute("aPhase",new a.Float32BufferAttribute(h,1)),s.setIndex(p);const v=e.colors||["#3dff9a","#8a4dff","#ff6fa8"],g={uTime:ue(e),uFold:{value:e.fold??r*.045},uFollow:{value:e.follow===!1?0:1},uSpeed:{value:e.speed??1},uRays:{value:e.rays??70},uIntensity:{value:e.intensity??1.5},uColorA:{value:C(v[0])},uColorB:{value:C(v[1])},uColorC:{value:C(v[2]??v[0])}},S=new a.ShaderMaterial({uniforms:g,vertexShader:Ye,fragmentShader:Je,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q});return{object:X(s,S,e.renderOrder??0),uniforms:g,material:S,triangles:p.length/3,update(z,b){g.uTime.value=b}}}const Ke=`
uniform float uFollow; attribute float aBand; varying vec2 vUv; varying float vBand; varying float vY;
void main(){ vUv = uv; vBand = aBand; vY = normalize(mat3(modelMatrix)*position).y;
  vec4 w = modelMatrix*vec4(position,1.); w.xyz += cameraPosition*uFollow; gl_Position = projectionMatrix*viewMatrix*w; }`,Qe=`precision highp float;
uniform float uIntensity, uHorizon, uInner; varying vec2 vUv; varying float vBand; varying float vY;
vec3 spectrum(float x){
  return vec3(smoothstep(.42,.78,x) + .32*(1.-smoothstep(0.,.2,x)),
              smoothstep(.1,.42,x)*(1.-smoothstep(.7,.98,x)),
              1.-smoothstep(.28,.58,x)); }
void main(){
  float v = vUv.y; vec3 col; float a;
  if(vBand < .5){
    float x = (v-.62)/.3;
    float band = smoothstep(0.,.18,x)*smoothstep(1.,.8,x);
    col = spectrum(clamp(x,0.,1.))*band + vec3(.8,.9,1.)*uInner*smoothstep(0.,.72,v)*(1.-smoothstep(.72,.8,v))*v;
    a = 1.;
  } else {
    float x = (v-.1)/.8;
    col = spectrum(clamp(1.-x,0.,1.))*smoothstep(0.,.25,x)*smoothstep(1.,.75,x); a = .2;
  }
  a *= smoothstep(uHorizon-.02, uHorizon+.2, vY);
  gl_FragColor = vec4(col*a*uIntensity, 0.);
}`;function Ot(e={}){const t=O(e.sunDir,[.3,.45,.8]).normalize().clone().negate(),n=e.radius??2400,r=e.segments??128,u=new a.Vector3().crossVectors(t,Math.abs(t.y)>.9?new a.Vector3(1,0,0):new a.Vector3(0,1,0)).normalize(),m=new a.Vector3().crossVectors(t,u).normalize(),i=[],l=[],d=[],y=[],f=new a.Vector3,h=Math.PI/180,p=(z,b,M)=>{const c=i.length/3;for(let A=0;A<=r;A++){const F=A/r*Math.PI*2;for(let I=0;I<2;I++){const T=(I?b:z)*h;f.copy(t).multiplyScalar(Math.cos(T)).addScaledVector(u,Math.cos(F)*Math.sin(T)).addScaledVector(m,Math.sin(F)*Math.sin(T)),i.push(f.x*n,f.y*n,f.z*n),l.push(A/r,I),d.push(M)}if(A<r){const I=c+A*2;y.push(I,I+1,I+2,I+1,I+3,I+2)}}},s=e.width??1;p(42.4-9*s,42.4+.75*s,0),e.secondary!==!1&&p(51.5-2.2*s,51.5+2.2*s,1);const v=new a.BufferGeometry;v.setAttribute("position",new a.Float32BufferAttribute(i,3)),v.setAttribute("uv",new a.Float32BufferAttribute(l,2)),v.setAttribute("aBand",new a.Float32BufferAttribute(d,1)),v.setIndex(y);const g={uIntensity:{value:e.intensity??.22},uHorizon:{value:e.horizon??0},uInner:{value:e.inner??.12},uFollow:{value:e.follow===!1?0:1}},S=new a.ShaderMaterial({uniforms:g,vertexShader:Ke,fragmentShader:Qe,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q});return{object:X(v,S,e.renderOrder??0),uniforms:g,material:S,triangles:y.length/3,update(){}}}const Ze=`
uniform vec3 uSun; uniform float uIsDir, uVisibility, uDepthBias; uniform vec4 uOcc[8];
attribute vec4 aGhost; attribute vec3 aTint;
varying vec2 vUv; varying vec3 vTint; varying float vI; varying float vShape;
void main(){
  vUv = uv; vTint = aTint; vShape = aGhost.z;
  vec3 toSun = uIsDir > .5 ? normalize(uSun) : uSun - cameraPosition;
  float sunDist = uIsDir > .5 ? 1e9 : length(toSun);
  vec3 sd = normalize(toSun);
  vec4 sv = viewMatrix*vec4(uIsDir > .5 ? cameraPosition + sd*1000. : uSun, 1.);
  vec4 sc = projectionMatrix*sv;
  vec2 ndc = sc.xy/max(sc.w, 1e-4);
  float front = step(0.001, sc.w);
  float vis = 1.;                                             // soft occlusion by up to 8 spheres on the way to the sun
  for(int i = 0; i < 8; i++){ vec4 o = uOcc[i];
    if(o.w > 0.){ vec3 oc = o.xyz - cameraPosition; float t = dot(oc, sd);
      if(t > 0. && t < sunDist) vis *= smoothstep(o.w*.7, o.w*1.3, length(oc - sd*t)); } }
  float aspect = projectionMatrix[1][1]/projectionMatrix[0][0];
  vec2 s = vec2(aGhost.y/aspect, aGhost.y)*2.;
  if(aGhost.z > 3.5) s.x *= 7.;
  if(aGhost.x < .01){
    // starburst and streak: a sprite at the sun's own depth, depth tested, so terrain and buildings hide it
    vI = aGhost.w*front*uVisibility*mix(1., vis, .7);
    float z = sc.w*.99996;
    if(uIsDir < .5){ vec4 pb = projectionMatrix*(sv + vec4(0., 0., min(uDepthBias, sunDist*.5), 0.)); z = pb.z/pb.w*sc.w; }
    gl_Position = vec4((ndc + position.xy*s)*sc.w, z, sc.w);
  } else {
    // ghosts: screen space, along the line from the sun through the screen centre
    float on = front*(1. - smoothstep(.8, 1.25, max(abs(ndc.x), abs(ndc.y))));
    vI = aGhost.w*on*uVisibility*vis*(1. - .45*min(length(ndc), 1.));
    gl_Position = vec4(ndc*(1.-aGhost.x) + position.xy*s, -.999, 1.);
  }
  if(vI < .002) gl_Position = vec4(2.,2.,2.,1.);
}`,et=`precision highp float;
uniform vec3 uColor; uniform float uIntensity;
varying vec2 vUv; varying vec3 vTint; varying float vI; varying float vShape;
void main(){
  vec2 q = vUv*2.-1.; float r = length(q); float w = max(1.-r,0.); float a;
  if(vShape < .5){ a = w*w*(3.-2.*w); a *= a; }
  else if(vShape < 1.5){ a = smoothstep(.55,.9,r)*smoothstep(1.,.92,r)*.8 + .12*w; }
  else if(vShape < 2.5){ float an = atan(q.y,q.x); float hx = cos(floor(.5+an/1.0472)*1.0472-an)*r; a = smoothstep(.92,.8,hx)*(.45+.55*hx); }
  else if(vShape < 3.5){ float an = atan(q.y,q.x);
    float st = pow(.5+.5*cos(an*6.),14.) + .5*pow(.5+.5*cos(an*14.+1.),20.);
    a = exp(-r*r*40.)*2. + exp(-r*5.)*.5*w + st*exp(-r*3.5)*w*.6; }
  else { a = exp(-q.y*q.y*160.)*pow(max(1.-abs(q.x),0.),2.)*.9; }
  gl_FragColor = vec4(uColor*vTint*a*vI*uIntensity, 0.);
}`;function Ut(e={}){const o=te(e),t=e.ghosts??7,n=[[0,e.size??.34,3,1,[1,1,1]]];e.streak!==!1&&n.push([0,(e.size??.34)*.8,4,.6,[.7,.85,1]]);const r=[[1,.75,.5],[.6,.85,1],[.75,1,.7],[1,.6,.8],[.7,.7,1]];for(let s=0;s<t;s++){const v=.35+s/Math.max(1,t-1)*1.75+(o()-.5)*.15;n.push([v,.025+o()*o()*.16,Math.min(2,Math.floor(o()*3)),.05+o()*.09,r[s%r.length]])}const u=n.length,m=pe(u),i=new Float32Array(u*4),l=new Float32Array(u*3);n.forEach((s,v)=>{i.set([s[0],s[1],s[2],s[3]],v*4),l.set(s[4],v*3)}),K(m,"aGhost",i,4),K(m,"aTint",l,3);const d=!e.position,y=Array.from({length:8},(s,v)=>{const g=e.occluders&&e.occluders[v];return g?new a.Vector4(g[0],g[1],g[2],g[3]):new a.Vector4(0,0,0,0)}),f={uSun:{value:d?O(e.sunDir,[.3,.45,.8]).normalize():O(e.position)},uIsDir:{value:d?1:0},uColor:{value:C(e.color,"#fff0d8")},uIntensity:{value:e.intensity??1},uVisibility:{value:1},uDepthBias:{value:e.depthBias??1},uOcc:{value:y}},h=new a.ShaderMaterial({uniforms:f,vertexShader:Ze,fragmentShader:et,transparent:!0,depthWrite:!1,depthTest:e.depthTest!==!1,...q});return{object:X(m,h,e.renderOrder??1),uniforms:f,material:h,update(){},setOccluder(s,v,g,S,w){s>=0&&s<8&&y[s].set(v,g,S,w)}}}const tt=`
uniform float uFollow, uHalf;
attribute vec2 aLayer;
varying vec3 vWorld; varying vec2 vLayer; varying vec2 vR;
${Q}
void main(){
  vLayer = aLayer; vR = position.xz/uHalf;
  vec4 w = modelMatrix*vec4(position,1.); w.xz += cameraPosition.xz*uFollow;
  vWorld = w.xyz;
  vec4 mvPosition = viewMatrix*w;
  gl_Position = projectionMatrix*mvPosition;
  ${Z}
}`,ot=`precision highp float;
uniform vec3 uColor, uSunDir, uSunColor; uniform vec2 uWind, uNear;
uniform float uTime, uScale, uOpacity, uCoverage, uSoft, uSoftGround, uScatter, uLayers;
varying vec3 vWorld; varying vec2 vLayer; varying vec2 vR;
${oe}${ve}${he}${ee}
void main(){
  // the cheap fades first: most of a sheet is faded out, and those fragments never pay for the noise
  float edge = 1. - smoothstep(.55, 1., length(vR));
  vec3 toP = vWorld - cameraPosition; float dist = length(toP);
  float a = uOpacity*edge * smoothstep(0., uSoft, abs(toP.y)) * smoothstep(uNear.x, uNear.y, dist) * smoothstep(0., uSoftGround, vLayer.y);
  a *= 1. - .45*vLayer.x/max(uLayers-1., 1.);
  if(a < .003) discard;
  vec2 p = vWorld.xz*uScale + uWind*uTime*uScale*(1.+vLayer.x*.35) + vLayer.x*vec2(13.7,7.3);
  p += (vec2(vnoise(p*.6 + 3.), vnoise(p*.6 + 11.)) - .5)*1.6;
  float n = fbmLo(p);
  float n2 = vnoise(vWorld.xz*uScale*.21 - uWind*uTime*uScale*.25 + vLayer.x*5.1);
  a *= smoothstep(.75-uCoverage*.5, 1.15-uCoverage*.5, n*.65 + n2*.45);
  if(a < .003) discard;
  vec3 V = toP/dist;
  float fs = pow(max(dot(V, uSunDir), 0.), 5.);
  vec3 col = uColor*(.86 + .28*n) + uSunColor*fs*uScatter;
  col = fxApplyFog(col);
  gl_FragColor = vec4(col*a, a);
}`;function Lt(e={}){const o=e.layers??6,t=e.size??700,n=e.y??0,r=e.height??12,u=e.heightAt,m=e.mode||"pool",i=u?e.segments??48:1,l=O(e.center,[0,0,0]),d=[],y=[],f=[];let h=null;if(u){h=new Float32Array((i+1)*(i+1));for(let w=0,z=0;w<=i;w++)for(let b=0;b<=i;b++,z++)h[z]=u((b/i-.5)*t+l.x,(w/i-.5)*t+l.z)}for(let w=0;w<o;w++){const z=o>1?w/(o-1):0,b=n+r*(.08+.92*z*z),M=d.length/3;for(let c=0,A=0;c<=i;c++)for(let F=0;F<=i;F++,A++){const I=(F/i-.5)*t,T=(c/i-.5)*t;let B=b,N=1e3;if(h){const R=h[A];m==="hug"?B=R+(b-n)+(e.lift??.6):N=Math.max(-r,Math.min(r*2,b-R))}d.push(I,B,T),y.push(w,N)}for(let c=0;c<i;c++)for(let A=0;A<i;A++){const F=M+c*(i+1)+A,I=F+i+1;f.push(F,I,F+1,F+1,I,I+1)}}const p=new a.BufferGeometry;p.setAttribute("position",new a.Float32BufferAttribute(d,3)),p.setAttribute("aLayer",new a.Float32BufferAttribute(y,2)),p.setIndex(f);const s=$(e.wind,[1.6,.7]),v={uTime:ue(e),uFollow:{value:e.follow??!u?1:0},uHalf:{value:t/2},uColor:{value:C(e.color,"#c9d3e2")},uOpacity:{value:e.opacity??.26},uCoverage:{value:e.coverage??.5},uScale:{value:e.scale??.014},uWind:{value:s},uNear:{value:$(e.near,[3,22])},uSoft:{value:e.soft??Math.max(1.5,r*.35)},uSoftGround:{value:e.softGround??Math.max(1.5,r*.6)},uSunDir:{value:O(e.sunDir,[.4,.5,.6]).normalize()},uSunColor:{value:C(e.sunColor,"#ffd9a8")},uScatter:{value:e.scatter??.35},uLayers:{value:o}},g=ae({uniforms:v,vertexShader:tt,fragmentShader:ot,fog:e.fog!==!1,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),S=X(p,g,e.renderOrder??2);return u&&S.position.set(l.x,0,l.z),v.uFollow.value||(p.computeBoundingSphere(),ne(S,p.boundingSphere.center,p.boundingSphere.radius)),{object:S,uniforms:v,material:g,triangles:f.length/3,update(w,z){v.uTime.value=z}}}const at=`
uniform float uTime, uFlatten, uRotSpeed, uRotRand, uRate, uHeight, uBend, uSpin, uSway, uNearCap, uSkirt, uBody, uImm;
uniform vec3 uArea, uCenter, uFollow, uDrift, uBase, uWind, uSunDir;
uniform vec2 uNear, uSize, uRadius;
attribute vec3 aPos; attribute vec4 aInfo;
#ifdef PUFF_CLUSTER
attribute vec4 aOff;
#endif
varying vec2 vUv; varying vec4 vInfo; varying float vA; varying float vT; varying vec3 vSunV; varying vec3 vUpV; varying vec3 vViewDir; varying vec2 vRot;
varying vec4 vOff; varying vec3 vWorld;
${Q}
void main(){
  vUv = uv; vInfo = aInfo; float t = uTime; float a = 1., sz, h = 0.; vec3 wc, anchor; vec4 off = vec4(0., 0., 0., 1.);
#if PUFF_MOTION == 1
  float age = fract(aInfo.z + t*uRate); h = pow(age, .85);
  float spread = mix(uRadius.x, uRadius.y, pow(h, .8));
  wc = uBase + vec3(0., h*uHeight, 0.) + uWind*(h*h)*uHeight*uBend;
  wc += aPos*vec3(spread, spread*.45, spread);
  wc.x += sin(h*9. + t*.7 + aInfo.z*40.)*spread*.3; wc.z += cos(h*7. - t*.6 + aInfo.z*23.)*spread*.3;
  sz = mix(uSize.x, uSize.y, pow(h, .7))*aInfo.x;
  a = smoothstep(0., .05, age)*(1.-smoothstep(.5, 1., age));
  float crad = spread + .5*sz;                                 // the column's real radius at this height
  off = vec4(vec3(aPos.x, aPos.y*.3, aPos.z)*(spread/crad), .5*sz/crad);
  anchor = wc;
#elif PUFF_MOTION == 2
  float skirt = step(1.-uSkirt, aPos.y);
  float age = fract(aInfo.z + t*uRate*(.6+aPos.y*.8)); h = mix(age, age*.08, skirt);
  float rad = mix(uRadius.x, uRadius.y, pow(h, 1.5))*(.55+.5*aPos.x) + skirt*uRadius.y*(.25+age*1.1);
  float ang = aPos.z*6.2831853 + t*uSpin*(1.7-h)*(.7+.6*aPos.x);
  wc = uBase + vec3(0., h*uHeight, 0.);
  wc.x += sin(h*3.2 + t*.9)*uSway*h; wc.z += cos(h*2.4 + t*.7)*uSway*h;
  wc.xz += vec2(cos(ang), sin(ang))*rad;
  sz = mix(uSize.x, uSize.y, max(h, skirt*.5))*aInfo.x;
  a = smoothstep(0., .1, age)*(1.-smoothstep(.6, 1., age))*mix(uBody, 1., skirt);
  off = vec4(cos(ang)*.9, 0., sin(ang)*.9, .6);
  anchor = wc;
#else
  vec3 p = aPos + uDrift*t;
  #ifdef PUFF_NOWRAP
  wc = p;
  #else
  vec3 c = mix(uCenter, cameraPosition, uFollow);
  p = mod(p - c + .5*uArea, uArea) - .5*uArea;
  vec3 e = abs(p)/(.5*uArea);
  a = 1. - smoothstep(.72, 1., max(e.x, e.z));
  wc = c + p;
  #endif
  wc.y += sin(t*.21 + aInfo.z*30.)*aInfo.x*.03;
  sz = aInfo.x;
  anchor = aPos;
  #ifdef PUFF_CLUSTER
  off = aOff;
  #endif
#endif
  vT = h;
  vec4 mvPosition = viewMatrix*vec4(wc,1.);
  float dist = length(mvPosition.xyz);
  float rot = aInfo.y*6.2831853*uRotRand + t*uRotSpeed*(aInfo.z-.5);
  float cr = cos(rot), sr = sin(rot); vRot = vec2(cr, sr);
  vec2 q = mat2(cr,sr,-sr,cr)*position.xy; q.y *= uFlatten;
  mvPosition.xy += q*sz;
  vec3 camR = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), camU = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vWorld = anchor + (camR*q.x + camU*q.y)*sz;
  vOff = vec4(mat3(viewMatrix)*off.xyz, off.w);
  // fades as the camera enters a puff; a puff that fills the view is also capped so stacked ones do not saturate
  vA = a * smoothstep(uNear.x*sz, uNear.y*sz, dist) * mix(uNearCap, 1., smoothstep(uNear.y*sz, 2.2*sz, dist));
  vA *= 1. - uImm*(1. - smoothstep(.6*sz, 2.4*sz, dist));       // inside a cloud the veil takes over from the puffs around the camera
  vSunV = normalize((viewMatrix*vec4(uSunDir,0.)).xyz); vUpV = (viewMatrix*vec4(0.,1.,0.,0.)).xyz;
  vViewDir = mvPosition.xyz;
  gl_Position = projectionMatrix*mvPosition;
  if(vA < .003) gl_Position = vec4(2.,2.,2.,1.);
  ${Z}
}`,nt=`precision highp float;
uniform vec3 uColor, uShadow, uSunColor, uHot, uColorTop, uAmbient;
uniform float uTime, uOpacity, uFreq, uWFreq, uRagged, uSoftness, uBillow, uAdditive, uRim, uHotFalloff, uTopMix, uDetail, uVariation, uUnder, uFloorFade, uCluster, uScatter;
varying vec2 vUv; varying vec4 vInfo; varying float vA; varying float vT; varying vec3 vSunV; varying vec3 vUpV; varying vec3 vViewDir; varying vec2 vRot;
varying vec4 vOff; varying vec3 vWorld;
${oe}${ve}${he}${ee}
// value + softened gradient: octave gradients weighted like the amplitudes, so the bump lighting stays billowy
vec3 puffNoise(vec2 p){ float a=.5; vec3 s=vec3(0.); mat2 m=mat2(1.,0.,0.,1.); const mat2 M=mat2(1.6,1.2,-1.2,1.6), Rm=mat2(.8,.6,-.6,.8);
  for(int i=0;i<3;i++){ vec3 n=vnoised(p); s.x+=a*n.x; s.yz+=a*(n.yz*m); p=M*p+7.1; m=Rm*m; a*=.5; } return s/.875; }
void main(){
  vec2 q = vUv*2.-1.; float r = length(q);
  if(r > 1.) discard;
#ifdef PUFF_LIT
  #ifdef PUFF_SHARED
  // the shape comes from two octaves of world-space noise that every puff of the cloud shares; two finer octaves
  // are cheap per-sprite noise (they fade out with distance instead of aliasing)
  vec3 wp = vWorld*uWFreq; wp.y -= uTime*uBillow;
  vec4 n4 = vnoised(wp)*.5 + vnoised(wp*2.03 + vec3(7.1, 3.3, 5.7))*.25;
  vec2 np = q*(2.*uWFreq*vInfo.x) + vInfo.z*vec2(17.3, 31.7); np.y -= uTime*uBillow*4.;
  float lod = clamp(1.6 - fwidth(np.x)*5., 0., 1.);
  const mat2 Rm = mat2(.8, .6, -.6, .8);
  vec3 d1 = vnoised(np)*.125*lod, d2 = vnoised(Rm*np*2. + 7.1)*.0625*lod*clamp(1.6 - fwidth(np.x)*10., 0., 1.);
  float n = (n4.x + d1.x + d2.x + (1.-lod)*.09)/.9375;
  vec2 grad = ((viewMatrix*vec4(n4.yzw, 0.)).xy + mat2(vRot.x, vRot.y, -vRot.y, vRot.x)*(d1.yz + d2.yz*Rm))/.9375;
  #else
  vec2 np = q*uFreq + vInfo.z*vec2(17.3,31.7); np.y -= uTime*uBillow;
  vec3 nd = puffNoise(np); float n = nd.x; vec2 grad = mat2(vRot.x, vRot.y, -vRot.y, vRot.x)*nd.yz;
  #endif
#else
  vec2 np = q*uFreq + vInfo.z*vec2(17.3,31.7); np.y -= uTime*uBillow;
  float n = fbmLo(np);
#endif
  float d = 1. - r + (n-.5)*uRagged;
  float a = smoothstep(0., uSoftness, d)*(1.-smoothstep(.75,1.,r));
  a = pow(a, 1.5)*vA*uOpacity*mix(1., smoothstep(-.95, -.25, q.y), uFloorFade);
  if(a < .004) discard;
  vec3 base = mix(uColor, uColorTop, vT*uTopMix);
#ifdef PUFF_LIT
  vec2 qv = mat2(vRot.x, vRot.y, -vRot.y, vRot.x)*q;
  float zs = sqrt(max(1.-r*r, 0.));
  vec3 Ns = normalize(vec3(qv, .35 + zs));                    // this sprite as a sphere
  vec3 pm = vOff.xyz + vec3(qv, zs*.5)*vOff.w;                // the fragment's place in the whole cluster, in cluster radii
  float front = clamp(vSunV.z, 0., 1.);
  // light: mostly where the fragment sits along the sun's axis through the cluster, a little from the sprite's own roundness
  float nl = mix(dot(Ns, vSunV), dot(pm, vSunV)*1.2 + .3*dot(Ns, vSunV), uCluster);
  float up = mix(dot(qv, vUpV.xy), dot(pm, vUpV)*1.2, uCluster);
  float bump = -dot(grad, vSunV.xy)*.45;
  float lit = smoothstep(-.35, .55, .5*nl + bump*uDetail + (vInfo.w-.5)*uVariation + up*uUnder - front*(.62-n)*1.4);
  float behind = clamp(-vSunV.z, 0., 1.);
  lit *= 1. - .7*uCluster*behind*behind;                      // looking into the light we only see the shadowed side
  vec3 col = mix(uShadow, base, lit*mix(1., .4 + .6*smoothstep(0., .6, d), front));
  // against the light: the heart of the cluster is darkest, its fringe lets light through, and the silver lining
  // sits only on sprite edges that face out of the cluster
  float sdv = max(dot(normalize(vViewDir), vSunV), 0.);
  float thin = 1.-smoothstep(0., .6, d);
  float hull = length(pm.xy), fringe = mix(1., smoothstep(.3, 1., hull), uCluster);   // 0 at the heart, 1 at the silhouette
  float outw = mix(1., clamp(dot(pm.xy, qv)/max(hull*r, 1e-3)*.5 + .5, 0., 1.), uCluster);
  float sil = smoothstep(.55, 1.05, hull);                    // 1 only on the cluster's own outline
  float back = sdv*sdv;
  col *= 1. - .22*uCluster*(1.-front)*(1.-fringe);
  col += uSunColor*back*sdv*uRim*(thin*(1.-uCluster) + .12*fringe*fringe)*(.5+lit);
  col = mix(col, base, thin*.2*(1.-uCluster));
  // the lining itself is added on top of the alpha blend: a bright band just inside the eroded edge
  float band = smoothstep(0., .14, d)*(1.-smoothstep(.08, .45, d));
  vec3 lining = uSunColor*back*sdv*uRim*band*outw*outw*sil*(.1 + 1.9*sil)*uCluster*1.1;
  // light scattered forward through the whole body where it is thin, plus an ambient floor
  float dens = mix(smoothstep(0., .6, d), (1. - .7*fringe)*(.45 + .7*n)*(.65 + .35*smoothstep(0., .8, d)), uCluster);
  col += uSunColor*pow(sdv, 1.5)*uScatter*(1.-min(dens, 1.)) + uAmbient;
#else
  vec3 col = base*(.85 + .3*n)*(.85 + .3*vInfo.w), lining = vec3(0.);
#endif
  col += uHot*exp(-vT*uHotFalloff)*(.4 + 1.2*n);
  col = fxFogMix(col, uAdditive);
  gl_FragColor = vec4(col*a + lining*(vA*uOpacity*(1.-fxFog())), a*(1.-uAdditive));
}`;function ge(e,o,t,n,r){const u=t.length/4,m=pe(u),i=K(m,"aPos",o,3),l=K(m,"aInfo",t,4),d=r?K(m,"aOff",r,4):null,y=e.follow===!0?[1,0,1]:[0,0,0],f={uTime:ue(e),uFlatten:{value:e.flatten??1},uRotSpeed:{value:e.rotSpeed??0},uRotRand:{value:e.rotRandom??(e.rotSpeed?1:0)},uArea:{value:O(e.area,[1e6,1e6,1e6])},uCenter:{value:O(e.center,[0,0,0])},uFollow:{value:new a.Vector3(...y)},uDrift:{value:O(e.drift,[0,0,0])},uBase:{value:O(e.position,[0,0,0])},uWind:{value:O(e.wind,[1,0,.3])},uSunDir:{value:O(e.sunDir,[.4,.8,.45]).normalize()},uNear:{value:$(e.near,[.25,1.1])},uNearCap:{value:e.nearCap??1},uSize:{value:$(e.sizeRange,[1,1])},uRadius:{value:$(e.radiusRange,[1,1])},uRate:{value:e.rate??.1},uHeight:{value:e.height??40},uBend:{value:e.bend??.5},uSpin:{value:e.spin??2},uSway:{value:e.sway??2},uSkirt:{value:e.skirt??.16},uBody:{value:e.body??1},uImm:{value:0},uColor:{value:C(e.color,"#ffffff")},uShadow:{value:C(e.shadowColor,"#7f8fb0")},uColorTop:{value:C(e.colorTop??e.color,"#ffffff")},uTopMix:{value:e.colorTop?1:0},uSunColor:{value:C(e.sunColor,"#ffe8c8")},uHot:{value:C(e.hot,"#000000")},uHotFalloff:{value:e.hotFalloff??12},uAmbient:{value:C(e.ambient,"#000000")},uOpacity:{value:e.opacity??.8},uFreq:{value:e.frequency??1.7},uWFreq:{value:e.worldFrequency??.1},uRagged:{value:e.ragged??.9},uSoftness:{value:e.softness??.6},uBillow:{value:e.billow??.03},uAdditive:{value:e.additive??0},uRim:{value:e.rim??.35},uDetail:{value:e.detail??2.4},uVariation:{value:e.variation??.5},uUnder:{value:e.under??.4},uFloorFade:{value:e.floorFade??0},uCluster:{value:e.cluster??.7},uScatter:{value:e.scatter??0}},h=ae({uniforms:f,vertexShader:at,fragmentShader:nt,fog:e.fog!==!1,defines:n,transparent:!0,depthWrite:!1,...q});return{object:X(m,h,e.renderOrder??2),uniforms:f,material:h,count:u,aPos:i,aInfo:l,aOff:d,update(s,v){f.uTime.value=v}}}function Me(e,o,t){const n=new a.Box3,r=new a.Vector3,u=new a.Sphere;let m=0;for(let i=0;i<t.length/4;i++)n.expandByPoint(r.set(o[i*3],o[i*3+1],o[i*3+2])),m=Math.max(m,t[i*4]);return n.getBoundingSphere(u),ne(e.object,u.center,u.radius+m*.75+1)}function Gt(e={}){const o=te(e),t={count:70,area:[320,8,320],center:[0,4,0],size:[16,38],color:"#d5deea",opacity:.2,drift:[.9,0,.35],flatten:.42,ragged:1.1,softness:.8,frequency:1.3,billow:.02,near:[.3,1.3],floorFade:1,...e},n=O(t.area),r=O(t.center),u=$(t.size),m=t.positions?t.positions.length:t.count,i=new Float32Array(m*3),l=new Float32Array(m*4);for(let f=0;f<m;f++){let h,p,s;const v=u.x+(u.y-u.x)*o(),g=v*t.flatten*.3;if(t.positions){const S=t.positions[f];h=S.x??S[0],p=S.y??S[1],s=S.z??S[2]}else h=r.x+(o()-.5)*n.x,s=r.z+(o()-.5)*n.z,p=(t.heightAt?t.heightAt(h,s)+(t.lift??.5)+o()*n.y:r.y+(o()-.5)*n.y)+g;i.set([h,p,s],f*3),l.set([v,o(),o(),o()],f*4)}const d=!!(t.heightAt||t.positions);d&&(t.drift=[0,0,0]);const y=ge(t,i,l,{PUFF_MOTION:0,...d?{PUFF_NOWRAP:""}:{}});return d?Me(y,i,l):t.follow!==!0&&ne(y.object,r,n.length()*.5+u.y),y}const it=`
uniform float uImmersion, uVeil; varying vec3 vDir;
void main(){
  gl_Position = uImmersion*uVeil > .004 ? vec4(position.xy, 0., 1.) : vec4(2., 2., 2., 1.);   // costs nothing outside a cloud
  vDir = vec3(position.x/projectionMatrix[0][0], position.y/projectionMatrix[1][1], -1.)*mat3(viewMatrix);
}`,rt=`precision highp float;
uniform vec3 uColor, uShadow, uSunColor, uSunDir; uniform float uImmersion, uTime, uVeil, uRim;
varying vec3 vDir;
${oe}${ve}${he}
void main(){
  vec3 d = normalize(vDir);
  float n = fbm(d*2.4 + cameraPosition*.05 + vec3(0., -uTime*.03, 0.));
  float sd = dot(d, uSunDir);
  float lit = clamp(.5 + .32*sd + .22*d.y + (n-.5)*.7, 0., 1.);
  vec3 col = mix(uShadow, uColor, lit) + uSunColor*pow(max(sd, 0.), 3.)*(.2 + uRim*.3);
  float a = smoothstep(0., 1., uImmersion*1.45 - n*.55*(1.-uImmersion))*uVeil;
  gl_FragColor = vec4(col*a, a);
}`;function Dt(e={}){const o=te(e),t={count:16,puffs:22,center:[0,60,0],size:[20,44],spread:[1.5,.42,1.1],color:"#f3eadf",shadowColor:"#7888ad",opacity:.92,drift:[2.2,0,.6],flatten:.85,ragged:1.5,softness:.45,frequency:2.1,billow:.02,near:[.12,.5],nearCap:.6,rim:.5,cluster:.85,scatter:.1,variation:.15,under:.3,detail:2,veil:.92,...e},n=$(t.size),r=O(t.spread),u=O(t.drift),m=(n.x+n.y)*.5;let i=O(t.center),l=O(t.area,[520,50,520]),d=!0;const y=(t.clouds||Array.from({length:t.count},()=>({position:[i.x+(o()-.5)*l.x,i.y+(o()-.5)*l.y,i.z+(o()-.5)*l.z],scale:.7+o()*.8}))).map(V=>{const P=V.scale??1,L=m*P;return{p:O(V.position),s:P,rx:L*r.x,rz:L*r.z,H:L*r.y*1.6,base:L}});if(t.clouds&&!t.area)if(u.lengthSq()===0)d=!1;else{const V=new a.Box3;let P=0;for(const L of y)V.expandByPoint(L.p),P=Math.max(P,L.rx,L.rz);V.expandByScalar(P*2.2+n.y),i=V.getCenter(new a.Vector3),l=V.getSize(new a.Vector3)}const f=Math.max(1,Math.round(t.puffs)),h=Math.max(1,Math.round(f*.6)),p=y.length*f,s=new Float32Array(p*3),v=new Float32Array(p*4),g=new Float32Array(p*4);let S=0;for(const V of y)for(let P=0;P<f;P++,S++){const L=P<h,j=o()*6.2832,H=L?Math.sqrt(o())*.8:.2+.6*o(),D=Math.sqrt(Math.max(0,1-Math.min(H,1)*Math.min(H,1))),ie=L?Math.pow(o(),1.3)*D:D*(.55+.35*o()),fe=L?(n.x+(n.y-n.x)*(.3+.7*o()))*V.s*(1-.3*H):(n.x+(n.y-n.x)*o()*.6)*V.s*(.45+.25*o()),Y=Math.cos(j),xe=Math.sin(j);s.set([V.p.x+Y*H*V.rx,V.p.y+ie*V.H,V.p.z+xe*H*V.rz],S*3),v.set([fe,o(),o(),.35+.65*ie],S*4),g.set([Y*H,ie*1.25-.4,xe*H,fe/(V.rx+V.rz)],S*4)}t.center=i,t.area=l,t.worldFrequency=t.worldFrequency??2*t.frequency/m;const w=ge(t,s,v,{PUFF_MOTION:0,PUFF_LIT:"",PUFF_CLUSTER:"",PUFF_SHARED:"",...d?{}:{PUFF_NOWRAP:""}},g);d?t.follow!==!0&&ne(w.object,i,l.length()*.5+n.y*1.6):Me(w,s,v);const z=w.object,b=w.uniforms,M=new a.BufferGeometry;M.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,3,-1,0,-1,3,0],3));const c={uColor:b.uColor,uShadow:b.uShadow,uSunColor:b.uSunColor,uSunDir:b.uSunDir,uTime:b.uTime,uRim:b.uRim,uImmersion:{value:0},uVeil:{value:t.veil===!0?.92:t.veil||0}},A=X(M,new a.ShaderMaterial({uniforms:c,vertexShader:it,fragmentShader:rt,transparent:!0,depthWrite:!1,depthTest:!1,...q}),t.veilOrder??30);w.object=new a.Group,w.object.add(z,A),w.puffs=z,w.veil=A,w.veilUniforms=c,w.immersion=0,w.clouds=y.length;const F=new Uint32Array(p),I=new Float32Array(p),T=s.slice(),B=v.slice(),N=g.slice(),R=b.uDrift.value,G=b.uFollow.value,k=l.clone().multiplyScalar(.5),_=(V,P)=>(V%P+P)%P,E=(V,P)=>I[P]-I[V],U=t.sort!==!1;return w.update=(V,P,L)=>{if(b.uTime.value=P,!L)return;const j=L.position,H=G.x?j.x:i.x,D=i.y,ie=G.z?j.z:i.z;let fe=0;for(let W=0;W<y.length;W++){const J=y[W];let re=J.p.x+R.x*P,le=J.p.y+R.y*P,se=J.p.z+R.z*P;d&&(re=_(re-H+k.x,l.x)-k.x+H,le=_(le-D+k.y,l.y)-k.y+D,se=_(se-ie+k.z,l.z)-k.z+ie);const de=(j.x-re)/(J.rx+J.base*.35),be=(j.y-(le+J.H*.45))/(J.H*.55+J.base*.4),Se=(j.z-se)/(J.rz+J.base*.35);let me=1-(Math.sqrt(de*de+be*be+Se*Se)-.45)/.6;if(me=me<0?0:me>1?1:me,me=me*me*(3-2*me),d){const _e=Math.abs(re-H)/k.x,Ne=Math.abs(se-ie)/k.z,ze=Math.max(_e,Ne);ze>.72&&(me*=Math.max(0,1-(ze-.72)/.28))}me>fe&&(fe=me)}if(w.immersion=fe,c.uImmersion.value=fe,b.uImm.value=fe*Math.min(1,c.uVeil.value*1.1),!U)return;for(let W=0;W<p;W++){let J=T[W*3]+R.x*P,re=T[W*3+1]+R.y*P,le=T[W*3+2]+R.z*P;d&&(J=_(J-H+k.x,l.x)-k.x+H,re=_(re-D+k.y,l.y)-k.y+D,le=_(le-ie+k.z,l.z)-k.z+ie),J-=j.x,re-=j.y,le-=j.z,I[W]=J*J+re*re+le*le,F[W]=W}F.sort(E);const Y=w.aPos.array,xe=w.aInfo.array,ye=w.aOff.array;for(let W=0;W<p;W++){const J=F[W],re=W*3,le=J*3,se=W*4,de=J*4;Y[re]=T[le],Y[re+1]=T[le+1],Y[re+2]=T[le+2],xe[se]=B[de],xe[se+1]=B[de+1],xe[se+2]=B[de+2],xe[se+3]=B[de+3],ye[se]=N[de],ye[se+1]=N[de+1],ye[se+2]=N[de+2],ye[se+3]=N[de+3]}w.aPos.needsUpdate=!0,w.aInfo.needsUpdate=!0,w.aOff.needsUpdate=!0},w}function qt(e={}){const o=te(e),t={count:90,height:70,radius:[1.2,12],size:[4,26],color:"#55505c",colorTop:"#8f8b98",shadowColor:"#25212c",ambient:"#0b0a10",hot:"#000000",opacity:.85,rate:.055,bend:.45,wind:[1,0,.3],ragged:1.1,softness:.7,frequency:1.8,billow:.12,rotSpeed:.5,near:[.3,1.2],rim:.1,scatter:.22,cluster:1,variation:.2,...e};t.sizeRange=$(t.size),t.radiusRange=$(t.radius);const n=t.count,r=new Float32Array(n*3),u=new Float32Array(n*4);for(let f=0;f<n;f++){const h=o()*6.283,p=Math.sqrt(o());r.set([Math.cos(h)*p,o()*2-1,Math.sin(h)*p],f*3),u.set([.7+o()*.6,o(),(f+o()*.6)/n,o()],f*4)}const m=ge(t,r,u,{PUFF_MOTION:1,PUFF_LIT:""}),i=m.uniforms;i.uWind.value.normalize();const l=i.uHeight.value,d=new a.Vector3(0,l*.5,0).addScaledVector(i.uWind.value,l*i.uBend.value*.5),y=ne(m.object,i.uBase.value.clone().add(d),l*.5*(1+i.uBend.value)+t.radiusRange.y*1.4+t.sizeRange.y);return m.update=(f,h)=>{i.uTime.value=h,y.center.copy(i.uBase.value).add(d)},m}const ke=`
uniform float uTime, uHeight, uSway, uSpin, uRate; uniform vec3 uBase; uniform vec2 uRadius;
vec3 devilAxis(float h){ return uBase + vec3(sin(h*3.2 + uTime*.9)*uSway*h, h*uHeight, cos(h*2.4 + uTime*.7)*uSway*h); }
float devilRadius(float h){ return mix(uRadius.x, uRadius.y, pow(h, 1.5)); }
`,lt=`
attribute vec3 aShell;
varying vec2 vUv; varying vec3 vN; varying vec3 vWorld; varying vec3 vShell;
${ke}${Q}
void main(){
  float h = uv.y, ang = uv.x*6.2831853;
  float rad = devilRadius(h)*aShell.x*(1. + .14*sin(h*11. - uTime*1.7 + aShell.y*6.) + .08*sin(ang*2. + h*5. + uTime*uSpin*.6));
  vec3 dir = vec3(cos(ang), 0., sin(ang));
  vec3 w = devilAxis(h) + dir*rad;
  float slope = (uRadius.y - uRadius.x)*1.5*sqrt(max(h, .001))*aShell.x/uHeight;
  vN = normalize(dir - vec3(0., slope, 0.));
  vUv = uv; vShell = aShell; vWorld = w;
  vec4 mvPosition = viewMatrix*vec4(w, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${Z}
}`,st=`precision highp float;
uniform vec3 uColor, uColorTop, uShadow, uSunColor, uSunDir; uniform float uTime, uSpin, uRate, uOpacity, uTwist, uScatter;
varying vec2 vUv; varying vec3 vN; varying vec3 vWorld; varying vec3 vShell;
${oe}${ee}
// value noise that repeats every 'per' cells in x, so the pattern closes around the funnel
float pnoise(vec2 p, float per){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f); float x0 = mod(i.x, per), x1 = mod(i.x + 1., per);
  return mix(mix(hash12(vec2(x0, i.y)), hash12(vec2(x1, i.y)), f.x), mix(hash12(vec2(x0, i.y + 1.)), hash12(vec2(x1, i.y + 1.)), f.x), f.y); }
void main(){
  float h = vUv.y, t = uTime;
  vec3 N = normalize(vN), V = normalize(cameraPosition - vWorld);
  float ndv = abs(dot(N, V));
  // streaks wound round the funnel as a helix, scrolling with the spin and rising with the updraught
  float x = vUv.x + h*uTwist - t*uSpin*.16*(1.35 - .5*h) + vShell.y;
  float y = h*3. - t*uRate*1.6 + vShell.y*7.;
  float n = pnoise(vec2(x*6., y), 6.)*.55 + pnoise(vec2(x*12. + 3., y*2.3 + 1.7), 12.)*.3 + pnoise(vec2(x*24., y*5.1), 24.)*.15;
  float dn = smoothstep(.22, .8, n);
  float limb = smoothstep(0., .35, ndv)*(1.5 - .75*ndv);       // soft silhouette, denser toward the edges of the tube
  float a = uOpacity*vShell.z*(.25 + .75*dn)*limb*smoothstep(0., .07, h)*(1. - smoothstep(.5, 1., h));
  if(a < .004) discard;
  float wrap = dot(N, uSunDir)*.5 + .5;
  vec3 col = mix(uShadow, mix(uColor, uColorTop, h), smoothstep(.1, .9, wrap + (n - .5)*.6));
  col += uSunColor*pow(max(dot(-V, uSunDir), 0.), 2.)*uScatter*(1. - .5*dn);
  gl_FragColor = vec4(fxApplyFog(col)*a, a);
}`,ut=`
uniform float uDebrisSize; attribute vec4 aSeed;
varying vec2 vUv; varying float vA; varying float vShade;
${ke}${Q}
void main(){
  vUv = uv; float t = uTime;
  float age = fract(aSeed.w + t*uRate*(.7 + .9*aSeed.z));
  float h = age*(.5 + .5*aSeed.x);
  float rad = devilRadius(h)*(.85 + .8*aSeed.y) + .3;
  float ang = aSeed.y*18.85 + t*uSpin*(2. - h)*(.7 + .6*aSeed.z);
  vec3 w = devilAxis(h) + vec3(cos(ang), 0., sin(ang))*rad;
  vec4 mvPosition = viewMatrix*vec4(w, 1.);
  float k = max(uDebrisSize*(.5 + aSeed.x), .0016*length(mvPosition.xyz));
  float ra = t*(3. + aSeed.z*6.) + aSeed.w*20.; float cr = cos(ra), sr = sin(ra);
  vec2 q = position.xy; q.x *= .3 + .7*abs(sin(ra*.7)); q = mat2(cr, sr, -sr, cr)*q;   // a tumbling fleck
  mvPosition.xy += q*k*2.;
  vA = smoothstep(0., .08, age)*(1. - smoothstep(.7, 1., age)); vShade = aSeed.x;
  gl_Position = projectionMatrix*mvPosition;
  ${Z}
}`,ct=`precision highp float;
uniform vec3 uColor, uShadow; uniform float uOpacity; varying vec2 vUv; varying float vA; varying float vShade;
${ee}
void main(){ vec2 q = vUv*2.-1.; float a = smoothstep(1., .55, length(q))*vA*uOpacity; if(a < .01) discard;
  gl_FragColor = vec4(fxApplyFog(mix(uShadow*.6, uColor*.8, vShade))*a, a); }`;function jt(e={}){const o=te(e),t={count:70,debris:140,height:34,radius:[.8,6.5],size:[2.4,8],color:"#c9a777",colorTop:"#e3cba4",shadowColor:"#6a5238",opacity:.4,rate:.16,spin:2.6,sway:2.2,twist:1.4,ragged:1.1,softness:.65,frequency:1.8,billow:.2,rotSpeed:1.2,near:[.4,1.4],rim:.3,scatter:.2,cluster:1,skirt:.6,body:.45,wander:0,...e};t.sizeRange=$(t.size),t.radiusRange=$(t.radius);const n=t.opacity;t.opacity=e.puffOpacity??Math.min(1,t.opacity*1.2);const r=t.count,u=new Float32Array(r*3),m=new Float32Array(r*4);for(let B=0;B<r;B++)u.set([o(),o(),o()],B*3),m.set([.6+o()*.8,o(),o(),o()],B*4);const i=ge(t,u,m,{PUFF_MOTION:2,PUFF_LIT:""}),l=i.uniforms,d=i.object;d.renderOrder=(t.renderOrder??2)+1;const y=24,f=28,h=[],p=[],s=[],v=[];for(const[B,N]of[[1,1],[.58,.8]]){const R=h.length/3,G=o();for(let k=0;k<=y;k++)for(let _=0;_<=f;_++)h.push(0,0,0),p.push(_/f,k/y),s.push(B,G,N);for(let k=0;k<y;k++)for(let _=0;_<f;_++){const E=R+k*(f+1)+_,U=E+f+1;v.push(E,U,E+1,E+1,U,U+1)}}const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(h,3)),g.setAttribute("uv",new a.Float32BufferAttribute(p,2)),g.setAttribute("aShell",new a.Float32BufferAttribute(s,3)),g.setIndex(v);const S={uTime:l.uTime,uHeight:l.uHeight,uSway:l.uSway,uSpin:l.uSpin,uRate:l.uRate,uBase:l.uBase,uRadius:l.uRadius},w={...S,uColor:l.uColor,uColorTop:l.uColorTop,uShadow:l.uShadow,uSunColor:l.uSunColor,uSunDir:l.uSunDir,uOpacity:{value:n},uTwist:{value:t.twist},uScatter:l.uScatter},z=X(g,ae({uniforms:w,vertexShader:lt,fragmentShader:st,fog:t.fog!==!1,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),t.renderOrder??2),b=new a.Group;b.add(z,d);let M=null;if(t.debris>0){const B=pe(t.debris),N=new Float32Array(t.debris*4);for(let R=0;R<N.length;R++)N[R]=o();K(B,"aSeed",N,4),M=X(B,ae({uniforms:{...S,uColor:l.uColor,uShadow:l.uShadow,uOpacity:{value:.85},uDebrisSize:{value:t.debrisSize??.14}},vertexShader:ut,fragmentShader:ct,fog:t.fog!==!1,transparent:!0,depthWrite:!1,...q}),(t.renderOrder??2)+2),b.add(M)}const c=l.uHeight.value,A=c*.5+l.uRadius.value.y*2.5+t.sizeRange.y+l.uSway.value,F=[z,d,M].filter(Boolean).map(B=>ne(B,l.uBase.value,A)),I=l.uBase.value.clone(),T=o()*10;return i.object=b,i.funnel=z,i.puffs=d,i.debris=M,i.funnelUniforms=w,i.triangles=v.length/3+r*2+t.debris*2,i.update=(B,N)=>{l.uTime.value=N,t.wander>0&&l.uBase.value.set(I.x+Math.sin(N*.21+T)*t.wander,I.y,I.z+Math.sin(N*.13+T*2)*t.wander);for(const R of F)R.center.set(l.uBase.value.x,l.uBase.value.y+c*.5,l.uBase.value.z)},i.update(0,l.uTime.value),i}function Ie(e={}){const o=C(e.sunColor,"#fff0da").multiplyScalar(e.sunIntensity??1.1),t={uEnvSunDir:{value:O(e.sunDir,[.4,.8,.45]).normalize()},uEnvSunColor:{value:o},uEnvSky:{value:C(e.sky,"#7fa3d6")},uEnvHorizon:{value:C(e.horizon,"#e6d6c2")},uEnvGround:{value:C(e.ground,"#4a4038")},uEnvAmbient:{value:e.ambient??.5}};return{uniforms:t,setSun(n,r,u=1){t.uEnvSunDir.value.copy(O(n)).normalize(),r!=null&&t.uEnvSunColor.value.copy(C(r)).multiplyScalar(u)},setColors(n,r,u){n!=null&&t.uEnvSky.value.copy(C(n)),r!=null&&t.uEnvHorizon.value.copy(C(r)),u!=null&&t.uEnvGround.value.copy(C(u))}}}function Ht(e=Ie(),o={}){const t=o.width??64,n=t/2,r=new Uint16Array(t*n*4),u=e.uniforms,m=u.uEnvSunDir.value,i=u.uEnvSunColor.value,l=u.uEnvSky.value,d=u.uEnvHorizon.value,y=u.uEnvGround.value,f=(p,s,v)=>{const g=Math.min(1,Math.max(0,(v-p)/(s-p)));return g*g*(3-2*g)};for(let p=0;p<n;p++)for(let s=0;s<t;s++){const v=(p+.5)/n*Math.PI,g=(s+.5)/t*Math.PI*2-Math.PI,S=Math.cos(v),w=Math.sin(v),z=w*Math.sin(g)*-1,b=w*Math.cos(g)*-1,M=Math.pow(f(0,1,Math.max(S,0)),.6),c=f(0,.55,-S),A=f(-.12,.12,S),F=Math.max(0,z*m.x+S*m.y+b*m.z),I=Math.pow(F,60)*5+Math.pow(F,6)*.15,T=(p*t+s)*4,B=["r","g","b"];for(let N=0;N<3;N++){const R=B[N],G=d[R]+(l[R]-d[R])*M,k=d[R]*.4+(y[R]-d[R]*.4)*c;r[T+N]=a.DataUtils.toHalfFloat(Math.min(60,k+(G-k)*A+i[R]*I))}r[T+3]=a.DataUtils.toHalfFloat(1)}const h=new a.DataTexture(r,t,n,a.RGBAFormat,a.HalfFloatType);return h.mapping=a.EquirectangularReflectionMapping,h.colorSpace=a.LinearSRGBColorSpace,h.magFilter=h.minFilter=a.LinearFilter,h.flipY=!0,h.needsUpdate=!0,h}const ft=`
#include <common>
#include <color_pars_vertex>
uniform float uTime;
varying vec3 vWorldPos, vWorldNormal, vObjPos, vObjNormal; varying vec2 vUv;
${oe}${Q}
//PARS
void main(){
  vUv = uv;
  #include <color_vertex>
  #include <beginnormal_vertex>
  vObjNormal = objectNormal;
  #include <defaultnormal_vertex>
  #include <begin_vertex>
  //HOOK
  #include <project_vertex>
  vObjPos = position;
  vec4 wp = vec4(transformed, 1.);
  #ifdef USE_INSTANCING
  wp = instanceMatrix*wp;
  #endif
  wp = modelMatrix*wp;
  vWorldPos = wp.xyz;
  vWorldNormal = normalize(inverseTransformDirection(transformedNormal, viewMatrix));
  ${Z}
}`,vt=`precision highp float;
uniform float uTime;
varying vec3 vWorldPos, vWorldNormal, vObjPos, vObjNormal; varying vec2 vUv;
#if defined(USE_COLOR) || defined(USE_INSTANCING_COLOR)
varying vec3 vColor;
#endif
${oe}${ve}${he}${ee}${Ce}
vec3 fxVertexColor(){
#if defined(USE_COLOR) || defined(USE_INSTANCING_COLOR)
  return vColor;
#else
  return vec3(1.);
#endif
}
vec3 fxNormal(){
#ifdef FACETED
  vec3 n = normalize(cross(dFdx(vWorldPos), dFdy(vWorldPos)));
  if(dot(n, cameraPosition - vWorldPos) < 0.) n = -n;
  return n;
#else
  vec3 n = normalize(vWorldNormal);
  return gl_FrontFacing ? n : -n;
#endif
}
float fxLuma(vec3 c){ return dot(c, vec3(.2126,.7152,.0722)); }
`;function ce(e,{frag:o,uniforms:t,defines:n={},vertHook:r="",vertPars:u="",...m}){const i=e.env||Ie(),l=ae({uniforms:{uTime:ue(e),...i.uniforms,...t},vertexShader:ft.replace("//HOOK",r).replace("//PARS",u),fragmentShader:vt+o,defines:{...e.faceted?{FACETED:""}:{},...n},vertexColors:!!e.vertexColors,side:e.side??a.FrontSide,fog:e.fog!==!1,...m});return l.userData.env=i,l}const x=e=>({value:e});function Wt(e={}){return ce({faceted:!0,...e},{uniforms:{uColor:x(C(e.color,"#7fd8ff")),uGlow:x(C(e.glowColor??e.color,"#5fc8ff")),uGlowAmt:x(e.glow??.7),uIor:x(e.ior??1.6),uSparkle:x(e.sparkle??1),uPulse:x(e.pulse??.15),uDensity:x(e.density??1.5),uReflect:x(e.reflect??1)},frag:`
uniform vec3 uColor, uGlow; uniform float uGlowAmt, uIor, uSparkle, uPulse, uDensity, uReflect;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
  float ndv = max(dot(N,V), 0.);
  vec3 tint = uColor*fxVertexColor();
  float F = fxFresnel(ndv, .07);
  vec3 refl = fxEnv(reflect(-V,N), .03);
  vec3 T = refract(-V, N, 1./uIor);
  vec3 p = vObjPos*uDensity + V*1.4;
  vec3 jit = vec3(vnoise(p), vnoise(p+17.3), vnoise(p+31.7)) - .5;
  float facet = 1.;
#ifdef FACETED
  vec3 fid = floor(N*6. + .5);
  jit += (hash33(fid + 3.1) - .5)*.9; facet = .55 + .9*hash13(fid + 11.);
#endif
  vec3 T2 = normalize(reflect(T, normalize(N + jit*1.5)));
  vec3 inner = fxEnv(T2, .12) + fxEnv(-T2.zyx, .3)*.35;
  vec3 absorb = pow(max(tint, vec3(.03)), vec3(.7 + ndv*2.2));
  vec3 body = min(inner*absorb*1.5*facet, vec3(1.8));
  float n = vnoise(vObjPos*uDensity*.8 + T*1.3 + uTime*.07);
  float veil = smoothstep(.45,.9, vnoise(p*2.3 + 5.));
  vec3 glow = uGlow*uGlowAmt*(.12 + .88*ndv*ndv*ndv)*(.35 + n*n*1.2 + veil*.7)*facet*(1. + uPulse*sin(uTime*1.3 + vObjPos.y*.7));
  // glints: tiny 4-point stars, a few pixels across at any distance, on spots whose mirror direction lines up with the sun
  vec3 sc = vObjPos*uDensity*7., cell = floor(sc), fc = fract(sc) - .5;
  vec3 hh = hash33(cell + floor(N*9. + .5));
  float px = length(fwidth(sc));
  float al = max(dot(reflect(-V, normalize(N + (hh - .5)*.9)), uEnvSunDir), 0.);
  float rad = clamp(px*(1.2 + 2.2*hh.x), .02, .16);
  vec3 t1 = normalize(cross(N, vec3(.31, .9, .23))), t2 = cross(N, t1);
  vec2 gq = vec2(dot(fc, t1), dot(fc, t2))/rad;
  float star = exp(-dot(gq, gq)*1.6) + .7*exp(-abs(gq.x*gq.y)*30.)*exp(-dot(gq, gq)*.3);
  float sp = star*smoothstep(.6, .92, al)*step(.5, hh.z)*smoothstep(.35, .1, abs(dot(fc, N)))*(1. - smoothstep(.2, .5, px))*uSparkle;
  vec3 col = mix(body + glow, refl*uReflect, F) + refl*.1*uReflect + (uEnvSunColor + tint)*sp*2.2;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`})}function $t(e={}){return ce(e,{uniforms:{uColor:x(C(e.color,"#cfeeff")),uOpacity:x(e.opacity??.14),uIor:x(e.ior??1.5),uRough:x(e.roughness??.03),uReflect:x(e.reflect??1)},transparent:!0,depthWrite:!1,...q,frag:`
uniform vec3 uColor; uniform float uOpacity, uIor, uRough, uReflect;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
  float ndv = max(dot(N,V), 0.), F = fxFresnel(ndv, .05), edge = (1.-ndv)*(1.-ndv);
  vec3 refl = fxEnv(reflect(-V,N), uRough)*uReflect;
  vec3 trans = fxEnv(refract(-V, N, 1./uIor), uRough + .15)*uColor*fxVertexColor();
  float body = uOpacity + edge*.3;
  vec3 col = refl*F + trans*body;
  float a = clamp(body + F + fxLuma(refl)*F*.5, 0., 1.);
  gl_FragColor = vec4(fxFogPremult(col, a), a);
}`})}function Xt(e={}){const o=(e.opacity??1)<1;return ce(e,{uniforms:{uColor:x(C(e.color,"#2a2440")),uScale:x(e.scale??1.1),uStrength:x(e.strength??.85),uRough:x(e.roughness??.15),uNoise:x(e.noise??.12),uFreq:x(e.frequency??1.2),uShift:x(e.shift??0),uOpacity:x(e.opacity??1),uFlow:x(e.flow??.05)},...o?{transparent:!0,depthWrite:!1,...q}:{},frag:`
uniform vec3 uColor; uniform float uScale, uStrength, uRough, uNoise, uFreq, uShift, uOpacity, uFlow;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
  float ndv = max(dot(N,V), 0.), F = fxFresnel(ndv, .08);
  float th = uShift + uScale*(1.-ndv) + uNoise*(fbm(vObjPos*uFreq + uTime*uFlow) - .5)*2.;
  vec3 film = .56 + .44*cos(6.2831853*(th + vec3(0.,.17,.4)));
  vec3 refl = fxEnv(reflect(-V,N), uRough);
  vec3 diff = uColor*fxVertexColor()*fxDiffuse(N);
  vec3 col = diff*(1. - .5*uStrength) + refl*film*uStrength*(.3 + 1.2*F) + film*fxDiffuse(N)*uStrength*.55;
  float a = clamp(uOpacity + F*(1.-uOpacity)*1.6 + fxLuma(refl)*.08*(1.-uOpacity), 0., 1.);
  gl_FragColor = vec4(fxApplyFog(col)*a, a);
}`})}function Yt(e={}){return ce(e,{uniforms:{uColor:x(C(e.color,"#ff8f5a")),uShadowColor:x(C(e.shadowColor,"#5a4a8c")),uRimColor:x(C(e.rimColor,"#fff2d8")),uSteps:x(e.steps??3),uRim:x(e.rim??.6),uSpec:x(e.specular??.5),uSoft:x(e.softness??.04)},frag:`
uniform vec3 uColor, uShadowColor, uRimColor; uniform float uSteps, uRim, uSpec, uSoft;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos), L = uEnvSunDir;
  float ndv = max(dot(N,V), 0.), nl = dot(N,L)*.5+.5;
  float st = nl*uSteps, band = (floor(st) + smoothstep(.5-uSoft, .5+uSoft, fract(st)))/uSteps;
  vec3 base = uColor*fxVertexColor();
  vec3 light = uEnvSunColor + fxAmbient(vec3(0.,1.,0.))*.6;
  vec3 col = base*mix(uShadowColor, vec3(1.), smoothstep(.0, 1., band))*light;
  float rim = smoothstep(.6, .66, (1.-ndv)*(.35+.65*nl));
  col += uRimColor*rim*uRim;
  float sp = smoothstep(.5-uSoft*2., .5+uSoft*2., pow(max(dot(N, normalize(L+V)), 0.), 48.));
  col += uRimColor*sp*uSpec;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`})}function Jt(e={}){return ce({...e,side:a.BackSide},{uniforms:{uColor:x(C(e.color,"#1a1420")),uThickness:x(e.thickness??.04)},vertPars:"uniform float uThickness;",vertHook:"transformed += normalize(objectNormal)*uThickness;",frag:"uniform vec3 uColor; void main(){ gl_FragColor = vec4(fxApplyFog(uColor), 1.); }"})}function Kt(e={}){return ce({side:a.DoubleSide,...e},{uniforms:{uColor:x(C(e.color,"#39d8ff")),uColor2:x(C(e.rimColor,"#b8f4ff")),uLines:x(e.lines??9),uSpeed:x(e.speed??.6),uIntensity:x(e.intensity??.4),uFlicker:x(e.flicker??.5),uOpacity:x(e.opacity??1),uGlitch:x(e.glitch??.04)},transparent:!0,depthWrite:!1,...q,vertPars:"uniform float uGlitch;",vertHook:"float gy = floor(position.y*7. + uTime*3.); float gt = floor(uTime*9.); transformed.x += step(.93, hash12(vec2(gy, gt)))*(hash12(vec2(gt, gy))-.5)*uGlitch*8.;",frag:`
uniform vec3 uColor, uColor2; uniform float uLines, uSpeed, uIntensity, uFlicker, uOpacity;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
  float ndv = abs(dot(N,V)), F = pow(1.-ndv, 2.2);
  float y = vWorldPos.y*uLines;
  float scan = pow(.5+.5*sin((y - uTime*uSpeed*uLines)*6.2831853), 2.5);
  scan = mix(.4, scan, 1.-smoothstep(.2, .55, fwidth(y)));
  float sweep = pow(.5+.5*sin(vWorldPos.y*.5 - uTime*1.9), 40.);
  float fl = 1. - uFlicker*(.5*step(.9, hash11(floor(uTime*18.))) + .12*sin(uTime*47.));
  float grain = .85 + .3*hash12(gl_FragCoord.xy + fract(uTime)*91.);
  vec3 col = mix(uColor, uColor2, F*.7)*(.04 + .4*scan + F*.9 + sweep*1.2)*uIntensity*fl*grain*uOpacity;
  col *= 1. - fxFog();
  gl_FragColor = vec4(col, 0.);
}`})}function Qt(e={}){const o={xz:0,uv:1,triplanar:2}[e.projection||"triplanar"]??2,t=(e.space||(o===2?"object":"world"))==="object";return ce(e,{uniforms:{uCrust:x(C(e.crustColor,"#2a2220")),uHot1:x(C(e.colors?.[0],"#c21500")),uHot2:x(C(e.colors?.[1],"#ff6a00")),uHot3:x(C(e.colors?.[2],"#ffd866")),uScale:x(e.scale??.35),uSpeed:x(e.speed??1),uGlow:x(e.glow??2.4),uCrack:x(e.crack??1),uFlow:x($(e.flow,[1,.3])),uHeat:x(e.heat??.5),uCool:x($(e.cool,[1e8,2e8])),uRelief:x(e.relief??.12),uSheen:x(e.sheen??1)},defines:{LAVA_PROJ:o,...t?{LAVA_OBJECT:""}:{},...e.cool?{LAVA_COOL:""}:{}},...e.cool?{transparent:!0,depthWrite:!1,...q}:{},frag:`
uniform vec3 uCrust, uHot1, uHot2, uHot3; uniform float uScale, uSpeed, uGlow, uCrack, uHeat, uRelief, uSheen; uniform vec2 uFlow, uCool;
vec3 voro(vec2 x){ vec2 n=floor(x), f=fract(x); float f1=8., f2=8., id=0.;
  for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){ vec2 g=vec2(float(i),float(j)); vec2 r=g+hash22(n+g)-f; float d=dot(r,r);
    if(d<f1){ f2=f1; f1=d; id=hash12(n+g+17.3); } else if(d<f2) f2=d; }
  return vec3(sqrt(f1), sqrt(f2)-sqrt(f1), id); }
// -> (heat, plate id, plate height, molten pool)
vec4 lava(vec2 p){
  float t = uTime*uSpeed;
  vec2 w = vec2(fbmLo(p*.6 + vec2(0., t*.05)), fbmLo(p*.6 + vec2(5.2, -t*.04)));
  vec2 q = p + (w-.5)*1.2 + uFlow*t*.06;
  vec3 v1 = voro(q), v2 = voro(q*2.6 + 3.1);
  float hm = fbmLo(p*.33 - uFlow*t*.02 + 9.) + (uHeat-.5)*.6;
  float wc = uCrack*(.35 + 2.4*smoothstep(.4,.85,hm));
  float c1 = 1.-smoothstep(0., wc*.1, v1.y);
  float c2 = (1.-smoothstep(0., wc*.07, v2.y))*.55*smoothstep(.3,.7,hm);
  float pool = smoothstep(.66,.95,hm)*(.55+.45*v2.x);
  float heat = max(max(c1, c2), pool);
  heat = max(heat, exp(-v1.y*12./max(wc,.05))*.3);
  // relief: flat plate tops that bevel down into the cracks, each plate tilted a little, small plates embossed on top
  float hgt = smoothstep(0., .2, v1.y)*(.7 + .3*smoothstep(0., .1, v2.y)) + (v1.z-.5)*.3*smoothstep(.04, .3, v1.y) + (w.x-.5)*.25;
  return vec4(clamp(heat,0.,1.), v1.z, hgt*(1.-pool), pool); }
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
#ifdef LAVA_OBJECT
  vec3 lp = vObjPos*uScale, ln = vObjNormal;
#else
  vec3 lp = vWorldPos*uScale, ln = vWorldNormal;
#endif
#if LAVA_PROJ == 1
  vec4 h = lava(vUv*uScale*10.);
#elif LAVA_PROJ == 2
  vec3 bw = pow(abs(normalize(ln)), vec3(4.)); bw /= bw.x+bw.y+bw.z;
  vec4 h = vec4(0.); float ws = 0.;
  if(bw.x > .03){ h += lava(lp.yz)*bw.x; ws += bw.x; }
  if(bw.y > .03){ h += lava(lp.xz)*bw.y; ws += bw.y; }
  if(bw.z > .03){ h += lava(lp.xy)*bw.z; ws += bw.z; }
  h /= ws;
#else
  vec4 h = lava(lp.xz);
#endif
  float heat = h.x, alpha = 1.;
#ifdef LAVA_COOL
  float cr = length(vObjPos.xz), cm = mix(uCool.x, uCool.y, .55);
  heat *= 1. - smoothstep(uCool.x, cm, cr); alpha = 1. - smoothstep(cm, uCool.y, cr);
#endif
  // bump the normal with the plate height (screen-space derivatives, so it works for every projection)
  vec3 dpx = dFdx(vWorldPos), dpy = dFdy(vWorldPos); float hx = dFdx(h.z), hy = dFdy(h.z);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 Nb = normalize(abs(det)*N - sign(det)*(hx*r1 + hy*r2)*(uRelief/uScale));
  float ndv = max(dot(Nb,V),0.);
  vec3 em = uHot1*smoothstep(0.,.35,heat); em = mix(em, uHot2, smoothstep(.25,.7,heat)); em = mix(em, uHot3, smoothstep(.65,1.,heat));
  float shimmer = 1. + .3*h.w*sin(uTime*2.3 + vnoise(lp*3.1 + uTime*.17)*14.);       // slow heat shimmer in the molten pools
  em *= uGlow*(.3 + .7*heat)*(.88 + .12*sin(uTime*1.7 + h.y*40.))*shimmer;
  float mottle = vnoise(lp*2.7 + h.y*17.), grit = vnoise(lp*11.);
  vec3 crust = uCrust*(.45 + 1.1*h.y)*(.5 + .9*mottle*mottle + .45*grit)*fxVertexColor();
  vec3 R = reflect(-V, Nb);
  vec3 col = crust*fxDiffuse(Nb) + (fxEnvSky(R, .5)*.4 + fxEnvSun(R, .4)*.3)*min(fxFresnel(ndv, .04), .28)*uSheen*(.5 + .9*mottle)*(1.-h.w);   // a dull sheen on the cooled plates
  col += uHot2*uGlow*.1*pow(1. - clamp(h.z, 0., 1.), 3.)*max(dot(Nb, N), 0.);        // the cracks light the plate edges from below
  col = mix(col, em, smoothstep(0., .3, heat)) + uHot1*uGlow*.04*(1.-heat);
  gl_FragColor = vec4(fxApplyFog(col)*alpha, alpha);
}`})}function Zt(e={}){return ce(e,{uniforms:{uColor:x(C(e.color,"#dff4ff")),uOpacity:x(e.opacity??.45),uCaustic:x(e.caustic??1.4)},transparent:!0,depthWrite:!1,...q,frag:`
uniform vec3 uColor; uniform float uOpacity, uCaustic;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
  float ndv = max(dot(N,V), 0.), F = fxFresnel(ndv, .03);
  vec3 T = refract(-V, N, .75);
  vec3 lens = fxEnv(normalize(-T + N*.35), .08)*uColor*fxVertexColor();
  float ca = pow(max(dot(N, -uEnvSunDir)*.5+.5, 0.), 5.)*smoothstep(0.,.35,ndv);
  vec3 refl = fxEnv(reflect(-V,N), .015);
  float body = clamp(uOpacity + (1.-uOpacity)*(1.-ndv)*(1.-ndv)*.8, 0., 1.);
  vec3 col = lens*(.3 + .7*smoothstep(0.,.5,ndv))*.85*body + uEnvSunColor*uColor*ca*uCaustic + refl*F*1.4;
  float a = clamp(body + F + ca*.7 + fxLuma(refl)*F, 0., 1.);
  gl_FragColor = vec4(fxFogPremult(col, a), a);
}`})}function eo(e={}){const o=!!e.additive;return ce(e,{uniforms:{uColor:x(C(e.color,"#35e0ff")),uColor2:x(C(e.color2,"#d0fbff")),uBase:x(C(e.baseColor,"#06080d")),uLines:x(e.lines??8),uSpeed:x(e.speed??1),uIntensity:x(e.intensity??2.6),uWarp:x(e.warp??.6),uRim:x(e.rim??.35),uStretch:x(e.stretch??1)},defines:{ENERGY_AXIS:{v:0,u:1,y:2}[e.axis||"v"]??0,...o?{ENERGY_ADD:""}:{}},...o?{transparent:!0,depthWrite:!1,...q}:{},frag:`
uniform vec3 uColor, uColor2, uBase; uniform float uLines, uSpeed, uIntensity, uWarp, uRim, uStretch;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
  float ndv = max(dot(N,V), 0.);
#if ENERGY_AXIS == 1
  float c = vUv.x*uStretch, s = vUv.y;
#elif ENERGY_AXIS == 2
  float c = vObjPos.y*uStretch, s = atan(vObjPos.z, vObjPos.x)/6.2831853;
#else
  float c = vUv.y*uStretch, s = vUv.x;
#endif
  float t = uTime*uSpeed;
  float w = (fbmLo(vec2(s*uLines*.6, c*1.5 - t*.3)) - .5)*uWarp;
  float l = s*uLines + w;
  float line = pow(abs(cos(l*3.14159265)), 44.) + .25*pow(abs(cos(l*3.14159265)), 6.);
  float id = floor(l + .5);
  float pulse = pow(.5+.5*sin(c*5. - t*(2.+hash11(id)*2.) + hash11(id+7.)*6.2831853), 5.);
  float I = line*(.22 + 1.7*pulse) + .03;
  vec3 em = mix(uColor, uColor2, pulse*line)*I*uIntensity + uColor*pow(1.-ndv, 3.)*uRim;
#ifdef ENERGY_ADD
  gl_FragColor = vec4(em*(1.-fxFog()), 0.);
#else
  vec3 col = uBase*fxVertexColor()*fxDiffuse(N) + fxEnv(reflect(-V,N), .25)*fxFresnel(ndv,.04)*.5 + em;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
#endif
}`})}function to(e={}){return ce(e,{uniforms:{uColor:x(C(e.color,"#e9ecf2")),uPattern:x(C(e.patternColor,"#1c3f9e")),uPatternAmt:x(e.pattern??.85),uPatternScale:x(e.patternScale??1),uGloss:x(e.gloss??1),uSubsurface:x(C(e.subsurface,"#ffd9c2"))},frag:`
uniform vec3 uColor, uPattern, uSubsurface; uniform float uPatternAmt, uPatternScale, uGloss;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos), L = uEnvSunDir;
  float ndv = max(dot(N,V), 0.), nl = dot(N,L);
  vec3 p = vObjPos*uPatternScale; float ang = atan(p.z, p.x), rad = max(length(p.xz), .25);
  float rows = p.y*.62, row = floor(rows), fy = fract(rows) - .5, nf = 7.;
  float fa = fract(ang/6.2831853*nf + .5*mod(row, 2.)) - .5;
  vec2 fp = vec2(fa*6.2831853/nf*rad, fy/.62);
  float fr = length(fp), ft = atan(fp.y, fp.x);
  float flower = smoothstep(.035, -.035, fr - (.3 + .15*cos(ft*5. + row*2.)))*(1. - .85*smoothstep(.1, .06, fr));
  float leaf = smoothstep(.03, -.03, abs(fp.y - .55*fp.x*sign(fp.x)) - .05*(1.-smoothstep(.45, .75, abs(fp.x))))*smoothstep(.4, .5, abs(fp.x))*smoothstep(.85, .7, abs(fp.x));
  float vine = smoothstep(.07, .03, abs(abs(fy) - .46 + .03*sin(ang*nf*2.)));
  float m = clamp(max(flower, leaf*.9) + vine, 0., 1.)*uPatternAmt*(.72 + .28*vnoise(p*13.));
  vec3 alb = mix(uColor, uPattern, m)*fxVertexColor();
  float wrap = max((nl + .4)/1.4, 0.);
  vec3 col = alb*(fxAmbient(N) + uEnvSunColor*wrap*wrap*1.05);
  col += alb*uSubsurface*uEnvSunColor*pow(max(1.-abs(nl), 0.), 3.)*.12;
  float F = fxFresnel(ndv, .05);
  col = col*(1.-F*.6) + fxEnv(reflect(-V,N), .05)*F*uGloss + fxEnv(reflect(-V,N), .4)*.03*uGloss;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`})}function oo(e={}){return ce({side:a.DoubleSide,...e},{uniforms:{uColor:x(C(e.color,"#f1e9da")),uTrans:x(C(e.translucentColor,"#ffcf9a")),uFiber:x(e.fiber??1),uFiberScale:x(e.fiberScale??6),uTranslucency:x(e.translucency??.6)},frag:`
uniform vec3 uColor, uTrans; uniform float uFiber, uFiberScale, uTranslucency;
void main(){
  vec3 N = fxNormal(), L = uEnvSunDir; float nl = dot(N,L);
  vec3 p = vObjPos*uFiberScale;
  float fib = vnoise(p*vec3(1.,7.,1.))*.45 + vnoise(p.zxy*vec3(1.,9.,1.) + 7.)*.3 + vnoise(p*5.)*.25;
  vec3 alb = uColor*fxVertexColor()*(1. - uFiber*.22*(fib-.5)*2.);
  vec3 col = alb*(fxAmbient(N)*1.1 + uEnvSunColor*max(nl, 0.)*.95);
  col += alb*uTrans*uEnvSunColor*max(-nl, 0.)*uTranslucency*(.8 + .4*fib);
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`})}function dt(e={}){return ce(e,{uniforms:{uColor:x(C(e.color,"#c9ccd4")),uRough:x(e.roughness??.2),uBump:x(e.bump??0),uBumpScale:x(e.bumpScale??6),uBrushed:x(e.brushed??0),uEnvSat:x(e.envSaturation??.5)},frag:`
uniform vec3 uColor; uniform float uRough, uBump, uBumpScale, uBrushed, uEnvSat;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
  vec3 p = vObjPos*uBumpScale;
  if(uBump > 0.) N = normalize(N + (vec3(vnoise(p), vnoise(p+19.1), vnoise(p+41.7)) - .5)*uBump);
  if(uBrushed > 0.){ vec3 pb = vObjPos*vec3(3., 160., 3.); N = normalize(N + (vec3(vnoise(pb), 0., vnoise(pb+9.)) - vec3(.5,0.,.5))*uBrushed*.25); }
  float ndv = max(dot(N,V), 0.);
  vec3 base = uColor*fxVertexColor();
  vec3 F = base + (1.-base)*pow(1.-ndv, 5.);
  vec3 R = reflect(-V,N); float r2 = min(uRough + .4, 1.);
  // a strongly coloured sky times a coloured metal goes to one flat hue: reflect a partly desaturated sky, and keep
  // the sun highlight pale so the metal still reads as its own colour (gold under a red sunset stays gold)
  vec3 sky = mix(fxEnvSky(R, uRough), fxEnvSky(R, r2), .3); sky = mix(vec3(fxLuma(sky)), sky, uEnvSat);
  vec3 sun = mix(fxEnvSun(R, uRough), fxEnvSun(R, r2), .3); sun = mix(vec3(fxLuma(sun)), sun, .5 + .5*uEnvSat);
  vec3 col = sky*F + sun*mix(F, vec3(1.), .5) + base*fxDiffuse(N)*.06;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`})}function ao(e={}){return dt({color:"#ffc45a",roughness:.18,envSaturation:.2,...e})}function no(e={}){return ce(e,{uniforms:{uColor:x(C(e.color,"#6fd0ff")),uPower:x(e.power??2.5),uIntensity:x(e.intensity??2.5),uInner:x(e.inner??.04),uPulse:x(e.pulse??0)},transparent:!0,depthWrite:!1,...q,frag:`
uniform vec3 uColor; uniform float uPower, uIntensity, uInner, uPulse;
void main(){
  vec3 N = fxNormal(), V = normalize(cameraPosition - vWorldPos);
  float f = pow(1.-abs(dot(N,V)), uPower);
  vec3 col = uColor*fxVertexColor()*(f + uInner)*uIntensity*(1. + uPulse*sin(uTime*2.));
  gl_FragColor = vec4(col*(1.-fxFog()), 0.);
}`})}function io(e={}){const o=te(e),t=e.count??7,n=e.sides??6,r=e.height??[1.5,5],u=e.radius??[.25,.7],m=e.spread??.9,i=e.tilt??.55,l=e.lean??.25,d=(e.colors||["#ffffff"]).map(b=>C(b)),y=[],f=[],h=[],p=new a.Matrix4,s=new a.Quaternion,v=new a.Euler,g=new a.Vector3,S=new a.Vector3(1,1,1),w=(b,M,c,A,F,I,T)=>{for(const[B,N]of[[b,F],[M,I],[c,T]])y.push(B.x,B.y,B.z),f.push(A.r*N,A.g*N,A.b*N)};for(let b=0;b<t;b++){const M=b===0?1:.45+o()*.55,c=(r[0]+(r[1]-r[0])*(b===0?1:o()))*M,A=(u[0]+(u[1]-u[0])*o())*(.6+.4*M),F=o()*6.283,I=b===0?0:(.3+o()*.7)*m,T=I/Math.max(m,1e-4)*l;v.set((b===0?.1:i)*(o()-.5)*2+Math.sin(F)*T,o()*6.283,(b===0?.1:i)*(o()-.5)*2-Math.cos(F)*T),p.compose(g.set(Math.cos(F)*I,-.15*c,Math.sin(F)*I),s.setFromEuler(v),S);const B=d[Math.floor(o()*d.length)],N=.72+o()*.14,R=[],G=[],k=o()*.4;for(let E=0;E<n;E++){const U=E/n*6.283,V=A*(.85+.3*o());R.push(new a.Vector3(Math.cos(U)*V,0,Math.sin(U)*V).applyMatrix4(p)),G.push(new a.Vector3(Math.cos(U)*V*.92,c*(N-k*.1*Math.sin(U)),Math.sin(U)*V*.92).applyMatrix4(p))}const _=new a.Vector3(A*.15*(o()-.5),c,A*.15*(o()-.5)).applyMatrix4(p);h.push([_.x,_.y,_.z]);for(let E=0;E<n;E++){const U=(E+1)%n;w(R[E],G[E],R[U],B,.55,1,.55),w(R[U],G[E],G[U],B,.55,1,1),w(G[E],_,G[U],B,1,1.1,1)}}const z=new a.BufferGeometry;return z.setAttribute("position",new a.Float32BufferAttribute(y,3)),z.setAttribute("color",new a.Float32BufferAttribute(f,3)),z.computeVertexNormals(),z.userData.tips=h,z.userData.apex=h[0],z}const mt=`
uniform float uWidth, uTime, uWave, uMaxAngle; uniform vec2 uNear;
attribute vec3 aTan; attribute vec4 aInfo;
varying vec2 vUv; varying vec4 vInfo; varying float vFade; varying float vAspect;
${Q}
void main(){
  vUv = uv; vInfo = aInfo;
  vec3 p = position;
  p += vec3(sin(uv.x*17. + uTime*1.1 + aInfo.x*20.), cos(uv.x*13. - uTime*.9 + aInfo.x*33.), sin(uv.x*11. + uTime*.7 + aInfo.x*7.))*uWave;
  vec4 mvPosition = modelViewMatrix*vec4(p,1.);
  float dist = length(mvPosition.xyz);
  vec3 tv = normalize(mat3(modelViewMatrix)*aTan);
  vec3 side = normalize(cross(tv, normalize(mvPosition.xyz)));
  float taper = smoothstep(0., .14, uv.x)*smoothstep(1., .86, uv.x);
  float w = min(uWidth*aInfo.y*(.25 + .75*taper), uMaxAngle*dist);    // never wider than a set angle on screen
  mvPosition.xyz += side*(uv.y-.5)*w;
  vFade = smoothstep(uNear.x, uNear.y, dist);                          // fades out where it passes close to the camera
  vAspect = aInfo.z/max(w*.5, 1e-3);                                   // ribbon length in half-widths
  gl_Position = projectionMatrix*mvPosition;
  ${Z}
}`,ht=`precision highp float;
uniform vec3 uColorA, uColorB; uniform float uTime, uSpeed, uIntensity, uFreq, uTrail, uHeads;
varying vec2 vUv; varying vec4 vInfo; varying float vFade; varying float vAspect;
${oe}${ve}${he}${ee}
void main(){
  float u = vUv.x, v = vUv.y*2.-1., t = uTime*uSpeed, ph = vInfo.x;
  float n = fbmLo(vec2(u*uFreq - t*.6 + ph*10., v*1.3 + ph*3.));
  float st = vnoise(vec2(u*uFreq*.6 - t*1.3 + ph*5., v*5. + ph*20.));
  float ends = smoothstep(0., .07, u)*smoothstep(1., .93, u);
  float I;
  if(uTrail > 0.){
    // travelling pulses shaped like comets: a round head that tapers to a point along its tail
    float d = fract(t*.1 + ph - u*uHeads + 1.), ds = d > .5 ? d - 1. : d;   // 0 at a head; positive behind it
    float al = ds/uHeads*vAspect;                                            // distance to the head in half-widths
    float tl = clamp(d/uTrail, 0., 1.), hw = mix(.8, .1, tl);
    float tail = step(0., ds)*exp(-tl*3.2)*exp(-v*v/(hw*hw)*1.6);
    float head = exp(-(al*al + v*v)*2.2);
    I = tail*(.55 + 1.3*n*st) + head*3.;
  } else {
    float edge = max(1.-v*v, 0.); edge *= sqrt(edge);
    I = edge*(.18 + 1.5*n*st) + exp(-v*v*14.)*(.35 + .6*n);
  }
  vec3 col = mix(uColorA, uColorB, smoothstep(.25,.8,n))*I*ends*vFade*uIntensity*(1.-fxFog());
  gl_FragColor = vec4(col, 0.);
}`;function ro(e={}){const o=te(e);let t=e.curves||(e.curve?[e.curve]:null)||(e.points?[e.points]:null);if(!t){const g=e.count??3,S=e.radius??8,w=e.height??18;t=[];for(let z=0;z<g;z++){const b=[],M=o()*6.283,c=1.5+o()*1.5,A=o()<.5?-1:1,F=14;for(let I=0;I<=F;I++){const T=I/F,B=M+A*T*c*6.283,N=S*(.35+.65*Math.sin(T*Math.PI))*(.7+o()*.5);b.push(new a.Vector3(Math.cos(B)*N,T*w+(o()-.5)*w*.06,Math.sin(B)*N))}t.push(b)}}const n=e.segments??120,r=[],u=[],m=[],i=[],l=[],d=new a.Vector3,y=new a.Vector3;for(const g of t){const S=g.isCurve?g:new a.CatmullRomCurve3(g.map(c=>O(c)),!1,"centripetal"),w=r.length/3,z=o(),b=.7+o()*.6,M=S.getLength();for(let c=0;c<=n;c++){const A=c/n;S.getPointAt(A,d),S.getTangentAt(A,y);for(let F=0;F<2;F++)r.push(d.x,d.y,d.z),u.push(y.x,y.y,y.z),m.push(A,F),i.push(z,b,M,0);if(c<n){const F=w+c*2;l.push(F,F+1,F+2,F+1,F+3,F+2)}}}const f=new a.BufferGeometry;f.setAttribute("position",new a.Float32BufferAttribute(r,3)),f.setAttribute("aTan",new a.Float32BufferAttribute(u,3)),f.setAttribute("uv",new a.Float32BufferAttribute(m,2)),f.setAttribute("aInfo",new a.Float32BufferAttribute(i,4)),f.setIndex(l);const h=e.colors||["#38d6ff","#e8a6ff"],p={uTime:ue(e),uWidth:{value:e.width??1.2},uWave:{value:e.wave??.15},uSpeed:{value:e.speed??1},uIntensity:{value:e.intensity??1.1},uFreq:{value:e.frequency??9},uTrail:{value:e.trail??0},uHeads:{value:e.heads??1},uNear:{value:$(e.near,[2,12])},uMaxAngle:{value:e.maxAngle??.06},uColorA:{value:C(h[0])},uColorB:{value:C(h[1]??h[0])}},s=ae({uniforms:p,vertexShader:mt,fragmentShader:ht,fog:e.fog!==!1,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),v=X(f,s,e.renderOrder??3);return v.position.copy(O(e.position,[0,0,0])),f.computeBoundingSphere(),ne(v,f.boundingSphere.center,f.boundingSphere.radius+p.uWidth.value+p.uWave.value*2),{object:v,uniforms:p,material:s,triangles:l.length/3,update(g,S){p.uTime.value=S}}}const pt=`
varying vec2 vUv; varying vec2 vP;
${Q}
void main(){ vUv = uv; vP = position.xz; vec4 mvPosition = modelViewMatrix*vec4(position,1.); gl_Position = projectionMatrix*mvPosition; ${Z} }`,xt=`precision highp float;
uniform vec3 uColorA, uColorB, uColorC; uniform float uTime, uSpeed, uArms, uTwist, uIntensity, uCore, uRadius;
varying vec2 vUv; varying vec2 vP;
${oe}${ve}${he}${ee}
void main(){
  float r = vUv.y, a = atan(vP.y, vP.x), t = uTime*uSpeed;
  float tw = uTwist*log(r + .04) + t;
  float sw = a*uArms + tw*uArms;
  float ca = cos(tw), sa = sin(tw);
  vec2 q = mat2(ca, sa, -sa, ca)*(vP/uRadius);
  float n = fbmLo(q*3.2 + vec2(0., t*.1)), n2 = vnoise(q*9. - t*.2);
  float arms = pow(.5 + .5*cos(sw + (n-.5)*2.5), 2.2);
  float I = arms*(.3 + 1.2*n) + .25*n*n2;
  float rim = smoothstep(1., .62, r)*smoothstep(0., .06, r);
  vec3 col = mix(uColorB, uColorA, smoothstep(.05, .75, r))*I*rim*uIntensity + uColorC*exp(-r*r*26.)*uCore;
  gl_FragColor = vec4(col*(1.-fxFog()), 0.);
}`,yt=`
uniform float uTime, uSpeed, uRadius, uDepth, uTwist, uSize;
attribute vec4 aSeed; varying vec2 vUv; varying float vA; varying float vMix;
${Q}
void main(){
  vUv = uv; float t = uTime*uSpeed;
  float s = fract(aSeed.w + t*.07*(.6+aSeed.z));
  float r = mix(1., .04, s*s*(3.-2.*s))*(.75+.25*aSeed.x);
  float ang = aSeed.y*6.2831853 - uTwist*log(r + .04) - t*(.4 + .5*aSeed.z);
  float fy = 1.-r; vec3 p = vec3(cos(ang)*r*uRadius, -uDepth*fy*fy*fy + (aSeed.x-.5)*uRadius*.06*r, sin(ang)*r*uRadius);
  vec4 mvPosition = modelViewMatrix*vec4(p,1.);
  mvPosition.xy += position.xy*uSize*(.5+aSeed.z)*(.4+.6*r);
  vA = smoothstep(0., .12, s)*(1.-smoothstep(.85, 1., s)); vMix = r;
  gl_Position = projectionMatrix*mvPosition;
  ${Z}
}`,gt=`precision highp float;
uniform vec3 uColorA, uColorB; uniform float uIntensity; varying vec2 vUv; varying float vA; varying float vMix;
${ee}
void main(){ vec2 q = vUv*2.-1.; float g = max(1.-dot(q,q), 0.); g = g*g*g;
  gl_FragColor = vec4(mix(uColorB, uColorA, vMix)*g*(1.+2.*g)*vA*uIntensity*(1.-fxFog()), 0.); }`;function lo(e={}){const o=te(e),t=e.radius??20,n=e.depth??10,r=26,u=72,m=[],i=[],l=[];for(let w=0;w<=r;w++)for(let z=0;z<=u;z++){const b=w/r,M=z/u*6.2831853,c=1-b;m.push(Math.cos(M)*b*t,-n*c*c*c,Math.sin(M)*b*t),i.push(z/u,b)}for(let w=0;w<r;w++)for(let z=0;z<u;z++){const b=w*(u+1)+z,M=b+u+1;l.push(b,M,b+1,b+1,M,M+1)}const d=new a.BufferGeometry;d.setAttribute("position",new a.Float32BufferAttribute(m,3)),d.setAttribute("uv",new a.Float32BufferAttribute(i,2)),d.setIndex(l);const y=e.colors||["#5a4dff","#35e6ff","#ffffff"],f=ue(e),h={uTime:f,uSpeed:{value:e.speed??1},uTwist:{value:e.twist??2.4},uRadius:{value:t},uColorA:{value:C(y[0])},uColorB:{value:C(y[1]??y[0])},uColorC:{value:C(y[2]??"#ffffff")}},p={...h,uArms:{value:e.arms??3},uIntensity:{value:e.intensity??1},uCore:{value:e.core??2}},s=ae({uniforms:p,vertexShader:pt,fragmentShader:xt,fog:e.fog!==!1,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),v=X(d,s,e.renderOrder??3);d.computeBoundingSphere(),ne(v,d.boundingSphere.center,d.boundingSphere.radius);const g=new a.Group;g.add(v);const S=e.particles??500;if(S>0){const w=pe(S),z=new Float32Array(S*4);for(let c=0;c<S*4;c++)z[c]=o();K(w,"aSeed",z,4);const b=ae({uniforms:{...h,uDepth:{value:n},uSize:{value:e.particleSize??t*.035},uIntensity:{value:(e.intensity??1)*1.1}},vertexShader:yt,fragmentShader:gt,fog:e.fog!==!1,transparent:!0,depthWrite:!1,...q}),M=X(w,b,(e.renderOrder??3)+1);ne(M,[0,-n*.5,0],t*1.1+Math.abs(n)),g.add(M)}return g.position.copy(O(e.position,[0,0,0])),{object:g,uniforms:p,material:s,triangles:l.length/3+S*2,update(w,z){f.value=z}}}const wt=`
uniform float uTime, uSpeed;
attribute vec4 aRing; attribute vec3 aAxis;
varying vec2 vUv; varying vec4 vRing;
${Q}
void main(){
  vUv = uv; vRing = aRing;
  float ang = uTime*uSpeed*aRing.z; float ca = cos(ang), sa = sin(ang);
  vec3 p = position*ca + cross(aAxis, position)*sa + aAxis*dot(aAxis, position)*(1.-ca);
  vec4 mvPosition = modelViewMatrix*vec4(p,1.);
  gl_Position = projectionMatrix*mvPosition;
  ${Z}
}`,bt=`precision highp float;
uniform vec3 uColorA, uColorB; uniform float uTime, uSpeed, uIntensity, uBands, uBeads;
varying vec2 vUv; varying vec4 vRing;
${oe}${ve}${ee}
void main(){
  float v = vUv.y*2.-1., ph = vRing.x, uu = vUv.x + uTime*uSpeed*vRing.y*.03;
  float bands = .25 + .75*vnoise(vec2((v*.5+.5)*uBands + ph*30., ph*7.));
  bands *= smoothstep(1., .7, abs(v));
  float arc = .5 + .5*sin(uu*6.2831853*2. + ph*9.) ; arc = .3 + .7*arc*arc;
  float beads = pow(.5 + .5*sin(uu*6.2831853*floor(uBeads*(.5+ph))), 14.)*exp(-v*v*7.);
  float I = bands*arc + beads*1.6;
  vec3 col = mix(uColorA, uColorB, fract(ph*3.7))*I*vRing.w*uIntensity*(1.-fxFog());
  gl_FragColor = vec4(col, 0.);
}`;function so(e={}){const o=te(e),t=e.count??4,n=e.radius??[6,12],r=e.width??.9,u=128,m=e.tilt??1,i=[],l=[],d=[],y=[],f=[],h=new a.Vector3,p=new a.Quaternion,s=new a.Euler,v=new a.Vector3;for(let M=0;M<t;M++){const c=n[0]+(n[1]-n[0])*(t>1?M/(t-1):.5),A=r*(.5+o()),F=i.length/3;p.setFromEuler(s.set((o()-.5)*2.4*m,o()*6.283,(o()-.5)*2.4*m)),v.set((o()-.5)*.8,1,(o()-.5)*.8).normalize();const I=o(),T=(o()<.5?-1:1)*(.5+o()),B=(o()-.5)*.6,N=.6+o()*.6;for(let R=0;R<=u;R++){const G=R/u*6.2831853;for(let k=0;k<2;k++){const _=c+(k-.5)*A;h.set(Math.cos(G)*_,0,Math.sin(G)*_).applyQuaternion(p),i.push(h.x,h.y,h.z),l.push(R/u,k),d.push(I,T,B,N),y.push(v.x,v.y,v.z)}if(R<u){const k=F+R*2;f.push(k,k+1,k+2,k+1,k+3,k+2)}}}const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(i,3)),g.setAttribute("uv",new a.Float32BufferAttribute(l,2)),g.setAttribute("aRing",new a.Float32BufferAttribute(d,4)),g.setAttribute("aAxis",new a.Float32BufferAttribute(y,3)),g.setIndex(f);const S=e.colors||["#ffd27a","#7ad8ff"],w={uTime:ue(e),uSpeed:{value:e.speed??1},uIntensity:{value:e.intensity??1.2},uBands:{value:e.bands??7},uBeads:{value:e.beads??24},uColorA:{value:C(S[0])},uColorB:{value:C(S[1]??S[0])}},z=ae({uniforms:w,vertexShader:wt,fragmentShader:bt,fog:e.fog!==!1,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),b=X(g,z,e.renderOrder??3);return b.position.copy(O(e.position,[0,0,0])),ne(b,[0,0,0],Math.max(n[0],n[1])+r*1.5),{object:b,uniforms:w,material:z,triangles:f.length/3,update(M,c){w.uTime.value=c}}}const St=`
uniform float uTime, uDuration, uRadius, uWidth;
attribute vec3 aDir; attribute vec3 aVel; attribute vec4 aParam;
varying vec2 vUv; varying float vI;
${oe}
void main(){
  vUv = uv;
  float cyc = uTime/aParam.x + aParam.y, k = floor(cyc);
  float s = fract(cyc)*aParam.x/uDuration;
  float ra = hash12(vec2(k, aParam.y*91.))*6.2831853; float cr = cos(ra), sr = sin(ra);
  mat3 rot = mat3(cr, 0., -sr, 0., 1., 0., sr, 0., cr);
  vec3 d0 = rot*aDir, vel = rot*aVel;
  float tail = aParam.z*.5*sin(3.14159265*clamp(s,0.,1.));
  vec3 p = normalize(d0 + vel*(aParam.z*s - (.5-position.y)*tail));
  vec4 mvPosition = viewMatrix*vec4(cameraPosition + p*uRadius, 1.);
  vec3 axv = normalize(mat3(viewMatrix)*vel);
  vec3 side = normalize(cross(axv, normalize(mvPosition.xyz)));
  mvPosition.xyz += side*position.x*uWidth*uRadius*(.4 + .6*uv.y);
  vI = pow(sin(3.14159265*clamp(s,0.,1.)), .6)*aParam.w*smoothstep(-.02, .12, p.y);
  gl_Position = projectionMatrix*mvPosition;
  if(s > 1. || vI < .003) gl_Position = vec4(2.,2.,2.,1.);
}`,zt=`precision highp float;
uniform vec3 uColor, uTail; uniform float uIntensity; varying vec2 vUv; varying float vI;
void main(){
  float x = vUv.x*2.-1., y = clamp(vUv.y,0.,1.);   // clamped: multisampling extrapolates a varying past its range on thin quads, and pow of a negative base is undefined
  float ac = exp(-x*x*7.);
  float a = ac*pow(y, 2.6) + exp(-((1.-y)*(1.-y))*900. - x*x*3.)*2.5;
  gl_FragColor = vec4(mix(uTail, uColor, pow(y, 3.))*a*vI*uIntensity, 0.);
}`;function uo(e={}){const o=te(e),t=e.count??14,n=pe(t),r=new Float32Array(t*3),u=new Float32Array(t*3),m=new Float32Array(t*4),i=new a.Vector3,l=new a.Vector3,d=e.minElevation??.25,y=e.period??[5,14];for(let s=0;s<t;s++){const v=o()*6.283,g=d+o()*(.95-d),S=Math.sqrt(1-g*g);i.set(Math.cos(v)*S,g,Math.sin(v)*S),l.set(o()-.5,-(.25+o()*.8),o()-.5),l.addScaledVector(i,-l.dot(i)).normalize(),r.set([i.x,i.y,i.z],s*3),u.set([l.x,l.y,l.z],s*3),m.set([y[0]+(y[1]-y[0])*o(),o(),.25+o()*.45,.5+o()*.5],s*4)}K(n,"aDir",r,3),K(n,"aVel",u,3),K(n,"aParam",m,4);const f={uTime:ue(e),uDuration:{value:e.duration??1.1},uRadius:{value:e.radius??1500},uWidth:{value:e.width??.006},uColor:{value:C(e.color,"#ffffff")},uTail:{value:C(e.tailColor,"#7fb4ff")},uIntensity:{value:e.intensity??5}},h=new a.ShaderMaterial({uniforms:f,vertexShader:St,fragmentShader:zt,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q});return{object:X(n,h,e.renderOrder??0),uniforms:f,material:h,count:t,update(s,v){f.uTime.value=v}}}const Ft=`
uniform float uTime, uPeriod, uRise, uRadius, uGravity, uSize, uTrail, uLaunch, uFlash, uCrackle, uRocket;
uniform vec3 uCenter, uArea; uniform vec3 uPal[5];
attribute vec4 aSpark; attribute vec4 aBurst;
varying vec2 vUv; varying vec3 vCol; varying float vI; varying float vFlash; varying float vHead;
${oe}${Q}
// where a spark is te seconds after its shell burst: drag-limited expansion plus gravity
vec3 fwPos(vec3 c, vec3 dir, float sp, float drag, float grav, float te){ return c + dir*sp*(1.-exp(-drag*te)) - vec3(0., grav*te*te*.5, 0.); }
void main(){
  vUv = uv; vFlash = 0.;
  float b = aBurst.x, cyc = uTime/uPeriod + aBurst.y, k = floor(cyc), tau = fract(cyc)*uPeriod;
  vec3 h = hash33(vec3(b*7.13 + 1., k*3.71 + 2., 1.7)), h2 = hash33(vec3(k*1.37 + 5., b*5.11 + 3., 9.2));
  vec3 centre = uCenter + (h-.5)*uArea;
  float type = floor(h2.x*3.999);                             // 0 peony, 1 ring, 2 willow, 3 chrysanthemum
  float ring = step(.5, type)*step(type, 1.5), willow = step(1.5, type)*step(type, 2.5), chrys = step(2.5, type);
  vec3 c1 = uPal[int(floor(h2.y*4.999))], c2 = uPal[int(floor(h.y*4.999))];
  vec3 posH, posT; float I, size = uSize;
  if(tau < uRise){
    // the rocket: a short streak climbing to the burst point
    float f = tau/uRise, fT = max(f - .1, 0.);
    vec3 launch = centre - vec3((h2.z-.5)*uLaunch*.25, uLaunch, (h.z-.5)*uLaunch*.2);
    vec3 jit = aSpark.xyz*aBurst.w*.4;
    posH = mix(launch, centre, 1.-(1.-f)*(1.-f)) + jit; posT = mix(launch, centre, 1.-(1.-fT)*(1.-fT)) + jit*2.5;
    I = step(aBurst.z, .06)*(.3 + .5*f)*smoothstep(0., .1, f)*step(0., aSpark.w)*uRocket;   // ~6% of the sparks share the rocket's light
    vCol = mix(vec3(1.,.75,.4), c1, .25); size *= .8;
  } else {
    float te = tau - uRise, life = uPeriod - uRise - .25, s = te/life;
    float drag = mix(1.3, 2.2, h2.z)*(1. - .35*willow), grav = uGravity*(1. + 1.3*willow);
    vec3 dir = aSpark.xyz;
    if(ring > .5){ vec3 nrm = normalize(h*2.-1.); dir = normalize(dir - nrm*dot(dir,nrm)*.94); }
    float inner = step(.72, aBurst.z)*(1.-ring);              // a smaller shell in the second colour
    float sp = uRadius*aSpark.w*mix(.6, 1.4, h.x)*(1. - .45*inner);
    float trail = uTrail*(1. + 1.5*willow + .8*chrys)*(.7 + .6*aBurst.w);
    posH = fwPos(centre, dir, sp, drag, grav, te); posT = fwPos(centre, dir, sp, drag, grav, max(te - trail, 0.));
    // glitter: late on, half the sparks flicker; crackle: a spark ends in a short white pop
    float tw = mix(1., step(.45, hash12(vec2(floor(uTime*14.), aBurst.w*77. + b))), smoothstep(.45, .85, s)*step(.5, aBurst.z));
    float pops = step(aBurst.z, .5)*uCrackle*(1.-willow), tc = life*(.5 + .4*aBurst.w), x = (te - tc)/.07;
    float pop = exp(-x*x)*pops;
    // sparks start packed into one point: they brighten as the shell opens, so the burst never stacks into a white blob
    float open = 1.-exp(-drag*te);
    I = pow(max(1.-s, 0.), mix(1.5, .8, willow))*min(open*open*2.5, 1.)*(1. + .3*exp(-te*2.))*tw*step(s, 1.);
    I = I*mix(1., exp(-max(te - tc, 0.)*7.), pops) + pop*.8;
    vec3 cc = mix(mix(c1, c2, inner), vec3(1.,.7,.28), max(willow, chrys*.6));
    vCol = mix(cc, vec3(1.), clamp(exp(-te*5.)*.8 + pop, 0., 1.));
    size *= (.6 + .7*aBurst.w)*(1. + pop);
    if(aSpark.w < 0.){ posH = centre; posT = centre; I = exp(-te*5.)*uFlash; vCol = mix(c1, vec3(1.), .5); size = uRadius*(.1 + .25*(1.-exp(-te*6.))); vFlash = 1.; }
  }
  vec4 mvH = viewMatrix*vec4(posH,1.), mvT = viewMatrix*vec4(posT,1.);
  vec4 mvPosition = mix(mvT, mvH, uv.y);
  float k2 = max(size, .0026*length(mvH.xyz));
  vec3 dv = mvH.xyz - mvT.xyz; float len = length(dv);
  vec3 ax = len > 1e-4 ? dv/len : vec3(0., 1., 0.);
  vec3 side = normalize(cross(ax, normalize(mvH.xyz)));
  // the quad spans the path the spark has just flown (head at uv.y = 1), padded by its radius so a spent spark is a dot
  if(vFlash > .5) mvPosition.xyz = mvH.xyz + vec3(position.xy*size*2., 0.);
  else mvPosition.xyz += ax*(uv.y*2.-1.)*k2 + side*position.x*k2*2.;
  vHead = k2/(len + 2.*k2);
  vI = I;
  gl_Position = projectionMatrix*mvPosition;
  if(I < .004) gl_Position = vec4(2.,2.,2.,1.);
  ${Z}
}`,At=`precision highp float;
uniform float uIntensity, uFogAmount; varying vec2 vUv; varying vec3 vCol; varying float vI; varying float vFlash; varying float vHead;
${ee}
void main(){
  float x = vUv.x*2.-1., y = vUv.y, a;
  if(vFlash > .5){ vec2 q = vUv*2.-1.; float w = max(1.-length(q), 0.); a = w*w*w; }
  else {
    float hy = (y - (1.-vHead))/vHead;                        // -1..1 across the head dot
    float hr = hy*hy + x*x, head = exp(-hr*2.6)*max(1.-hr, 0.);   // reaches zero at the quad's edge
    float ty = clamp(y/(1.-vHead), 0., 1.), tw = .3 + .7*ty;  // the tail thins and dims toward its old end
    float tail = ty*ty*exp(-x*x/(tw*tw)*2.5)*(1.-x*x)*step(y, 1.-vHead*.5);
    a = head*1.4 + tail*.8;
  }
  gl_FragColor = vec4(vCol*a*vI*uIntensity*(1.-fxFog()*uFogAmount), 0.);
}`;function co(e={}){const o=te(e),t=e.bursts??6,n=e.sparks??320,r=t*n,u=pe(r),m=new Float32Array(r*4),i=new Float32Array(r*4);for(let s=0;s<t;s++){const v=(s+o()*.7)/t;for(let g=0;g<n;g++){const S=s*n+g,w=o()*2-1,z=o()*6.283,b=Math.sqrt(1-w*w);m.set([Math.cos(z)*b,w,Math.sin(z)*b,g===0?-1:.75+.25*Math.pow(o(),.3)],S*4),i.set([s,v,o(),o()],S*4)}}K(u,"aSpark",m,4),K(u,"aBurst",i,4);const l=(e.colors||["#ff4a5a","#ffd24a","#4ad0ff","#b46bff","#5aff9a"]).map(s=>C(s));for(;l.length<5;)l.push(l[l.length%Math.max(1,l.length-1)].clone());const d={uTime:ue(e),uPeriod:{value:e.period??4.2},uRise:{value:e.rise??1.1},uRadius:{value:e.radius??42},uGravity:{value:e.gravity??4},uSize:{value:e.size??.32},uTrail:{value:e.trail??.4},uLaunch:{value:e.launchHeight??70},uFlash:{value:e.flash??.2},uCrackle:{value:e.crackle??1},uRocket:{value:(e.rocket??1)*5/Math.max(1,.06*n)},uCenter:{value:O(e.position,[0,90,0])},uArea:{value:O(e.area,[160,40,60])},uPal:{value:l.slice(0,5)},uIntensity:{value:e.intensity??3},uFogAmount:{value:e.fogAmount??.5}},y=ae({uniforms:d,vertexShader:Ft,fragmentShader:At,fog:e.fog!==!1,transparent:!0,depthWrite:!1,side:a.DoubleSide,...q}),f=X(u,y,e.renderOrder??4),h=d.uLaunch.value,p=ne(f,d.uCenter.value,d.uArea.value.length()*.5+d.uRadius.value*1.5+h*.75+40);return{object:f,uniforms:d,material:y,count:r,triangles:r*2,update(s,v){d.uTime.value=v,p.center.copy(d.uCenter.value),p.center.y-=h*.35}}}const Ve=`
uniform float uTime, uRise, uSway, uFloor, uClear; uniform vec3 uArea, uCenter, uWind;
#ifdef LANTERN_GROUND
uniform sampler2D uGround;
#endif
// fade: 0 at the faces of the box and just above the ground, 1 inside. Lanterns shrink with it instead of darkening.
vec3 lanternPos(vec3 home, vec4 rnd, out float fade){
  vec3 p = home*uArea + uWind*uTime;
  p.y += uTime*uRise*(.6+.8*rnd.z);
  p.x += sin(uTime*.3*(.5+rnd.y) + rnd.y*40.)*uSway; p.z += cos(uTime*.23*(.5+rnd.x) + rnd.x*31.)*uSway;
  p = mod(p, uArea) - .5*uArea;
  vec3 e = abs(p)/(.5*uArea);
  fade = (1.-smoothstep(.78, 1., e.y))*(1.-smoothstep(.85, 1., max(e.x, e.z)));
  vec3 w = uCenter + p;
  float ground = uFloor;
#ifdef LANTERN_GROUND
  ground = max(ground, texture2D(uGround, p.xz/uArea.xz + .5).r);
#endif
  fade *= smoothstep(ground + uClear*.15, ground + uClear, w.y);
  return w; }
`,Ct=`
uniform float uScale; attribute vec3 aHome; attribute vec4 aRand;
varying vec3 vN; varying vec3 vP; varying vec3 vView; varying vec4 vRand;
${Ve}${Q}
void main(){
  vRand = aRand; float fade; vec3 c = lanternPos(aHome, aRand, fade);
  float tx = sin(uTime*.5 + aRand.x*20.)*.12, tz = cos(uTime*.43 + aRand.y*20.)*.12, yaw = aRand.w*6.2831853 + uTime*.1*(aRand.z-.5);
  float cy = cos(yaw), sy = sin(yaw);
  mat3 R = mat3(cy, 0., -sy, 0., 1., 0., sy, 0., cy)*mat3(1., tx, 0., -tx, 1., tz, 0., -tz, 1.);
  float s = (aRand.x*.6 + .7)*smoothstep(0., .7, fade);
  vP = position; vN = R*normal;
  vec3 w = c + R*(position*s*uScale);
  vec4 mvPosition = viewMatrix*vec4(w,1.); vView = -mvPosition.xyz;
  gl_Position = projectionMatrix*mvPosition;
  if(fade < .004) gl_Position = vec4(2.,2.,2.,1.);
  ${Z}
}`,Rt=`precision highp float;
uniform vec3 uColorA, uColorB; uniform float uIntensity, uTime, uFogAmount;
varying vec3 vN; varying vec3 vP; varying vec3 vView; varying vec4 vRand;
${ee}
void main(){
  float h = clamp(vP.y, 0., 1.);
  vec3 n = normalize(vN); vec3 nv = normalize((viewMatrix*vec4(n,0.)).xyz); float facing = abs(dot(nv, normalize(vView)));
  float flick = .85 + .15*sin(uTime*(6.+vRand.y*5.) + vRand.x*50.)*sin(uTime*2.3 + vRand.z*20.);
  float flame = exp(-h*3.)*1.2 + .45;
  float ribs = .82 + .18*smoothstep(.0, .25, abs(sin(atan(vP.z, vP.x)*4.)));
  float bandT = smoothstep(.9, .96, h), bandB = 1.-smoothstep(.03, .08, h);
  vec3 col = mix(uColorA, uColorB, vRand.w)*flame*ribs*(.55 + .45*facing)*flick;
  col = mix(col, col*.25, max(bandT, bandB))*uIntensity;
  gl_FragColor = vec4(mix(col, fxApplyFog(col), uFogAmount), 1.);   // a lit lantern sinks into the haze, it does not go black
}`,Pt=`
uniform float uGlowSize, uScale; attribute vec3 aHome; attribute vec4 aRand;
varying vec2 vUv; varying float vFade; varying vec4 vRand;
${Ve}${Q}
void main(){
  vUv = uv; vRand = aRand; float fade; vec3 c = lanternPos(aHome, aRand, fade); vFade = fade;
  float s = (aRand.x*.6 + .7)*uScale;
  vec4 mvPosition = viewMatrix*vec4(c + vec3(0., .35*s*smoothstep(0., .7, fade), 0.), 1.);
  float dist = length(mvPosition.xyz);
  mvPosition.xy += position.xy*max(uGlowSize*s, .006*dist);
  vFade *= mix(.3, 1., smoothstep(4.*s, 30.*s, dist));
  gl_Position = projectionMatrix*mvPosition;
  if(fade < .004) gl_Position = vec4(2.,2.,2.,1.);
  ${Z}
}`,Tt=`precision highp float;
uniform vec3 uColorA, uColorB; uniform float uGlow, uTime, uFogAmount; varying vec2 vUv; varying float vFade; varying vec4 vRand;
${ee}
void main(){ vec2 q = vUv*2.-1.; float r = length(q), w = max(1.-r, 0.);
  float flick = .85 + .15*sin(uTime*(6.+vRand.y*5.) + vRand.x*50.)*sin(uTime*2.3 + vRand.z*20.);
  float a = (exp(-r*5.)*.7 + w*w*.25)*w;
  gl_FragColor = vec4(mix(uColorA, uColorB, vRand.w)*a*uGlow*flick*vFade*(1.-fxFog()*uFogAmount), 0.); }`;function fo(e={}){const o=te(e),t=e.count??140,n=new a.LatheGeometry([[.2,0],[.34,.06],[.47,.42],[.5,.72],[.43,.94],[.3,1],[.001,1]].map(T=>new a.Vector2(T[0],T[1])),10),r=new a.InstancedBufferGeometry;r.setIndex(n.index),r.setAttribute("position",n.attributes.position),r.setAttribute("normal",n.attributes.normal),r.instanceCount=t;const u=new Float32Array(t*3),m=new Float32Array(t*4);for(let T=0;T<t*3;T++)u[T]=o();for(let T=0;T<t*4;T++)m[T]=o();const i=new a.InstancedBufferAttribute(u,3),l=new a.InstancedBufferAttribute(m,4);r.setAttribute("aHome",i),r.setAttribute("aRand",l);const d=e.colors||["#ff8a2a","#ffc45a"],y=ue(e),f=O(e.area,[220,90,220]),h=O(e.center,[0,50,0]),p=e.size??1.6,s={uTime:y,uRise:{value:e.rise??1.1},uSway:{value:e.sway??1.6},uArea:{value:f},uCenter:{value:h},uWind:{value:O(e.wind,[.5,0,.2])},uScale:{value:p},uColorA:{value:C(d[0])},uColorB:{value:C(d[1]??d[0])},uFogAmount:{value:e.fogAmount??.7},uFloor:{value:e.floor??-1e6},uClear:{value:e.clearance??p*4}},v={};if(e.heightAt){const T=e.groundResolution??32,B=new Uint16Array(T*T);for(let R=0;R<T;R++)for(let G=0;G<T;G++)B[R*T+G]=a.DataUtils.toHalfFloat(e.heightAt(h.x+((G+.5)/T-.5)*f.x,h.z+((R+.5)/T-.5)*f.z));const N=new a.DataTexture(B,T,T,a.RedFormat,a.HalfFloatType);N.magFilter=N.minFilter=a.LinearFilter,N.needsUpdate=!0,s.uGround={value:N},v.LANTERN_GROUND=""}const g={...s,uIntensity:{value:e.intensity??2}},S=ae({uniforms:g,vertexShader:Ct,fragmentShader:Rt,fog:e.fog!==!1,side:a.DoubleSide,defines:v}),w=X(r,S,0),z=new a.Group;z.add(w);const b=pe(t);b.setAttribute("aHome",i),b.setAttribute("aRand",l);const M={...s,uGlowSize:{value:e.glowSize??5},uGlow:{value:e.glow??1.3}},c=ae({uniforms:M,vertexShader:Pt,fragmentShader:Tt,fog:e.fog!==!1,transparent:!0,depthWrite:!1,defines:v,...q}),A=X(b,c,4);z.add(A);const F=f.length()*.5+s.uSway.value+M.uGlowSize.value*p*1.3,I=[ne(w,h,F),ne(A,h,F)];return{object:z,uniforms:g,glowUniforms:M,material:S,count:t,triangles:t*(n.index.count/3+2),update(T,B){y.value=B;for(const N of I)N.center.copy(h)}}}export{kt as GLSL,Ce as GLSL_ENV,he as GLSL_FBM,ee as GLSL_FOG_PARS_FRAG,Q as GLSL_FOG_PARS_VERT,Z as GLSL_FOG_VERT,oe as GLSL_HASH,Ee as GLSL_NOISE,Fe as GLSL_SIMPLEX,ve as GLSL_VALUE_NOISE,Ae as GLSL_VORONOI,Pe as PARTICLE_PRESETS,io as crystalGeometry,Wt as crystalMaterial,eo as energyMaterial,Oe as fogUniforms,no as fresnelGlowMaterial,It as fxGroup,$t as glassMaterial,ao as goldMaterial,Kt as hologramMaterial,Xt as iridescentMaterial,Qt as lavaMaterial,Et as makeAuroraRibbon,Dt as makeCloudPuffs,jt as makeDustDevil,Ie as makeEnv,Ht as makeEnvMap,co as makeFireworks,Ut as makeFlare,_t as makeGlow,Te as makeGlows,Nt as makeGodRays,Lt as makeGroundFog,fo as makeLanterns,Bt as makeLightning,Gt as makeMist,so as makeOrbitRings,Vt as makeParticles,Ot as makeRainbow,ro as makeRibbon,uo as makeShootingStars,qt as makeSmokeColumn,lo as makeVortex,dt as metalMaterial,Jt as outlineMaterial,oo as paperMaterial,to as porcelainMaterial,Yt as toonMaterial,Zt as waterDropMaterial};
