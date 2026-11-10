import*as t from"three";import{makeRng as Ce,hashSeed as Re}from"./core.js";const ie=Math.PI*2,de=9.81,pe=(e,r)=>(e.rng??Ce(Re("kit-water"))).fork(r),we=(e,r,i)=>{const n=Math.min(1,Math.max(0,(i-e)/(r-e)));return n*n*(3-2*n)},Ue=(e,r)=>e?e.isVector3?e.clone():new t.Vector3(e[0],e[1],e[2]):new t.Vector3(r[0],r[1],r[2]),M=(e,r)=>e==null?new t.Color(r):e.isColor?e.clone():new t.Color(e),ee=(e,r)=>r.isColor?e.copy(r):e.set(r),Fe=(e,r)=>r.isVector3?e.copy(r):e.set(r[0],r[1],r[2]),ve={noon:{sunDir:[.32,.78,-.54],sunColor:"#fff3df",sunIntensity:3,zenith:"#1a4fae",mid:"#4d86cd",horizon:"#a5c6e4",scatterColor:"#fff3dc",scatter:.3,scatterPow:5,horizonPow:4,midPow:1.5},sunset:{sunDir:[-.22,.105,-.97],sunColor:"#ffab66",sunIntensity:2.8,zenith:"#14235a",mid:"#57488a",horizon:"#d98a66",scatterColor:"#ff8a2a",scatter:.95,scatterPow:3.5,horizonPow:4.2,midPow:1.6,scatterHigh:.07,scatterFall:4},sunrise:{sunDir:[.42,.13,-.9],sunColor:"#ffc09a",sunIntensity:2.6,zenith:"#25468c",mid:"#7b85be",horizon:"#f0b6a6",scatterColor:"#ffc68c",scatter:.65,scatterPow:5,horizonPow:3.4,midPow:1.5},night:{sunDir:[-.28,.42,-.86],sunColor:"#a9c4ff",sunIntensity:.9,zenith:"#040a1c",mid:"#0a1836",horizon:"#16305c",scatterColor:"#000000",scatter:0,scatterPow:5,horizonPow:3.4,midPow:1.5},overcast:{sunDir:[.3,.67,-.68],sunColor:"#e4e8f0",sunIntensity:1.1,zenith:"#8b959e",mid:"#99a2a9",horizon:"#b3babf",scatterColor:"#d6d2c6",scatter:.25,scatterPow:3,horizonPow:2.5,midPow:1.5,glint:.12},storm:{sunDir:[.14,.42,-.9],sunColor:"#b4c0cc",sunIntensity:1.3,zenith:"#36414a",mid:"#525e66",horizon:"#84929a",scatterColor:"#c4b272",scatter:.5,scatterPow:8,horizonPow:3,midPow:1.5,scatterHigh:.02,scatterFall:6,glint:.22}},gt=Object.keys(ve),xe=e=>!!(e&&e.zenithColor&&e.horizonColor&&(e.lightDirection||e.sunDirection)),qe=["sunDir","scatDir","sunColor","zenith","mid","horizon","scatterColor","ambient","fogColor","cloudLit","cloudShade","skyP","skyQ","cloud"];function Ae(e,r,i={}){let n=typeof r=="string"?{preset:r}:xe(r)?{sky:r}:r||{};const a=n.isWaterLight?{}:{...n};for(const o in i)i[o]!=null&&(a[o]=i[o]);let f=!0;if(n.isWaterLight){if(n!==e)for(const o of qe)e[o].copy(n[o]);f=!1}else if(xe(a.sky)){const o=a.sky,s=o.options||{},l=o.uniforms||{};e.sunDir.copy(o.keyDirection||o.lightDirection||o.sunDirection),e.scatDir.copy(o.sunDirection||e.sunDir),e.sunColor.copy(o.lightColor||o.sunColor).multiplyScalar(o.lightIntensity??1),e.zenith.copy(o.zenithColor),e.horizon.copy(o.horizonColor),l.uMid?e.mid.copy(l.uMid.value):e.mid.copy(e.zenith).lerp(e.horizon,.38),l.uScatterColor?e.scatterColor.copy(l.uScatterColor.value):e.scatterColor.set(s.scatterColor??"#fff3dc");const d=(s.key==="sun"||s.key==null)&&(s.sunIntensity??1)<=0;e.skyP.set(s.midPow??1.5,s.horizonPow??4,s.scatter??.3,s.scatterPow??5),e.skyQ.set(s.scatterHigh??.14,s.scatterFall??3,d?.15:1,0),e.fogColor.copy(o.fogColor||o.horizonColor);const p=s.clouds&&!s.clouds.stretch?s.clouds:null;p?(e.cloud.set(p.coverage??.5,Math.max(.08,p.softness??.22),(p.scale??1)*1.1,p.opacity??.96),e.cloudLit.copy(o.cloudLit||e.horizon),e.cloudShade.copy(o.cloudShade||e.mid)):e.cloud.set(.5,.2,1,0)}else{const o=ve[a.preset]||ve.sunset;e.sunDir.fromArray(o.sunDir),e.sunColor.set(o.sunColor).multiplyScalar(o.sunIntensity),e.zenith.set(o.zenith),e.mid.set(o.mid),e.horizon.set(o.horizon),e.scatterColor.set(o.scatterColor),e.skyP.set(o.midPow,o.horizonPow,o.scatter,o.scatterPow),e.skyQ.set(o.scatterHigh??.14,o.scatterFall??3,o.glint??1,0),e.scatDir.copy(e.sunDir),e.fogColor.set(0,0,0),e.cloud.set(.5,.2,1,0),e.cloudLit.set("#f6f2ea"),e.cloudShade.set("#7d8eac"),a._fog=!0}a.sunDir&&(Fe(e.sunDir,a.sunDir),!a.scatDir&&f&&e.scatDir.copy(e.sunDir)),a.scatDir&&Fe(e.scatDir,a.scatDir),a.sunColor!=null?(ee(e.sunColor,a.sunColor),e.sunColor.multiplyScalar(a.sunIntensity??1)):a.sunIntensity!=null&&!xe(a.sky)&&f&&e.sunColor.set((ve[a.preset]||ve.sunset).sunColor).multiplyScalar(a.sunIntensity);const v=a.mid!=null;if(a.zenith!=null&&ee(e.zenith,a.zenith),a.horizon!=null&&ee(e.horizon,a.horizon),v?ee(e.mid,a.mid):(a.zenith!=null||a.horizon!=null)&&f&&e.mid.copy(e.zenith).lerp(e.horizon,.38),a.scatterColor!=null&&ee(e.scatterColor,a.scatterColor),a.scatter!=null&&(e.skyP.z=typeof a.scatter=="number"&&isFinite(a.scatter)?a.scatter:0),a.glint!=null&&(e.skyQ.z=a.glint),a.clouds===!1)e.cloud.w=0;else if(a.clouds&&typeof a.clouds=="object"){const o=a.clouds;e.cloud.set(o.coverage??.5,o.softness??.22,o.scale??1,o.opacity??.9),o.lit!=null&&ee(e.cloudLit,o.lit),o.shade!=null&&ee(e.cloudShade,o.shade)}if(e.sunDir.normalize(),e.sunDir.y<.02&&(e.sunDir.y=.02,e.sunDir.normalize()),e.scatDir.normalize(),f||a.zenith!=null||a.horizon!=null||v||a.clouds!=null){const o=e.ambient,s=we(.25,.95,e.cloud.x)*e.cloud.w;o.setRGB(e.zenith.r*.3+e.mid.r*.4+e.horizon.r*.3,e.zenith.g*.3+e.mid.g*.4+e.horizon.g*.3,e.zenith.b*.3+e.mid.b*.4+e.horizon.b*.3),o.r+=(e.cloudLit.r*.45+e.cloudShade.r*.55-o.r)*s*.8,o.g+=(e.cloudLit.g*.45+e.cloudShade.g*.55-o.g)*s*.8,o.b+=(e.cloudLit.b*.45+e.cloudShade.b*.55-o.b)*s*.8}return a._fog&&e.fogColor.copy(e.horizon).lerp(e.mid,.12),a.ambient!=null&&ee(e.ambient,a.ambient),a.fogColor!=null&&ee(e.fogColor,a.fogColor),e}function Ie(e="sunset",r={}){const i={isWaterLight:!0,sunDir:new t.Vector3,scatDir:new t.Vector3,sunColor:new t.Color,zenith:new t.Color,mid:new t.Color,horizon:new t.Color,scatterColor:new t.Color,ambient:new t.Color,fogColor:new t.Color,cloudLit:new t.Color,cloudShade:new t.Color,skyP:new t.Vector4,skyQ:new t.Vector4,cloud:new t.Vector4};return i.set=(n,a)=>Ae(i,n,a),Ae(i,e,r)}const je=["sunDir","sunColor","sunIntensity","zenith","mid","horizon","scatterColor","scatter","glint","ambient","fogColor","clouds"];function ne(e){const r={};let i=!1;for(const a of je)e[a]!=null&&(r[a]=e[a],i=!0);e.skyZenith!=null&&(r.zenith=e.skyZenith,i=!0),e.skyHorizon!=null&&(r.horizon=e.skyHorizon,i=!0);const n=e.light??e.sky??"sunset";return n&&n.isWaterLight&&!i?n:Ie(n,r)}const se=e=>({uSunDir:{value:e.sunDir},uScatDir:{value:e.scatDir},uSunColor:{value:e.sunColor},uZenith:{value:e.zenith},uMid:{value:e.mid},uHorizon:{value:e.horizon},uScatterCol:{value:e.scatterColor},uAmbient:{value:e.ambient},uCloudLit:{value:e.cloudLit},uCloudShade:{value:e.cloudShade},uSkyP:{value:e.skyP},uSkyQ:{value:e.skyQ},uCloud:{value:e.cloud},uTime:{value:0}}),re=()=>t.UniformsUtils.clone(t.UniformsLib.fog),Y=`
uniform vec3 uSunDir, uScatDir, uSunColor, uZenith, uMid, uHorizon, uScatterCol, uAmbient, uCloudLit, uCloudShade;
uniform vec4 uSkyP, uSkyQ, uCloud;
uniform float uTime;
const float TAU = 6.2831853;
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2 h22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
// gradient noise with analytic derivatives, remapped to about 0..1: (value, d/dx, d/dy). No lattice-aligned creases.
vec3 noised(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*f*(f*(f*6.-15.)+10.), du=30.*f*f*(f*(f-2.)+1.);
  vec2 ga=h22(i)*2.-1., gb=h22(i+vec2(1.,0.))*2.-1., gc=h22(i+vec2(0.,1.))*2.-1., gd=h22(i+vec2(1.,1.))*2.-1.;
  float va=dot(ga,f), vb=dot(gb,f-vec2(1.,0.)), vc=dot(gc,f-vec2(0.,1.)), vd=dot(gd,f-vec2(1.,1.)), k=va-vb-vc+vd;
  return vec3(.5+.72*(va+u.x*(vb-va)+u.y*(vc-va)+u.x*u.y*k), .72*(ga+u.x*(gb-ga)+u.y*(gc-ga)+u.x*u.y*(ga-gb-gc+gd)+du*(u.yx*k+vec2(vb,vc)-va))); }
// cheap value noise for masks and modulators (domains are rotated per octave so the lattice never lines up)
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
const mat2 KROT = mat2(1.616,1.178,-1.178,1.616);     // rotate 36 degrees, scale 2
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=KROT*p+3.1; a*=.5; } return s*1.0667; }
float fbm3(vec2 p){ float a=.5, s=0.; for(int i=0;i<3;i++){ s+=a*vnoise(p); p=KROT*p+3.1; a*=.5; } return s*1.143; }
float fbm2(vec2 p){ return vnoise(p)*.667+vnoise(KROT*p+3.1)*.333; }
mat2 rot2(float a){ float c=cos(a), s=sin(a); return mat2(c,s,-s,c); }
// cellular noise: (distance to the nearest point, gap to the second nearest). kitCell searches 3x3 cells,
// kitCell4 only the 2x2 around the nearest corner (points keep to the middle of their cells): less than half the cost.
vec2 kitCell(vec2 p){ vec2 i=floor(p), f=fract(p); float d1=8., d2=8.;
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(float(x),float(y)); vec2 r=g+h22(i+g)-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; } else if(d<d2) d2=d; }
  d1=sqrt(d1); return vec2(d1, sqrt(d2)-d1); }
vec2 kitCell4(vec2 p){ p-=.5; vec2 i=floor(p), f=fract(p); float d1=8., d2=8.;
  for(int y=0;y<=1;y++) for(int x=0;x<=1;x++){ vec2 g=vec2(float(x),float(y)); vec2 r=g+(h22(i+g)-.5)*.72-f; float d=dot(r,r);
    if(d<d1){ d2=d1; d1=d; } else if(d<d2) d2=d; }
  d1=sqrt(d1); return vec2(d1, sqrt(d2)-d1); }
// foam lace at one scale. m = foam amount 0..1: round holes open around the cell points as it thins, leaving
// walls that are thick at the junctions and break up into flecks; fr = pixel footprint in cell units.
float kitLace(vec2 p, float m, float fr){ float mean = m*m*(3.-2.*m);
  if(fr>1.6) return mean;
  p += .13*sin(p.yx*4.7+vec2(1.3,4.1))+.06*sin(p.yx*11.3+2.);
  vec2 c = kitCell(p); float r = .74*(1.-m), aa = .04+.09*(1.-m)+fr*.6;      // thin foam has soft, dissolving edges
  float v = c.x+.07*sin(p.x*17.+p.y*13.)*sin(p.y*19.-p.x*7.);
  return mix(smoothstep(r-aa, r+aa, v), mean, smoothstep(.7,1.6,fr)); }
// clear-sky gradient, identical to kit/sky.js atmosphere()
vec3 kitAtmo(vec3 d){ float inv=1.-clamp(d.y,0.,1.); vec3 c=mix(uZenith,uMid,pow(inv,uSkyP.x)); c=mix(c,uHorizon,pow(inv,uSkyP.y));
  float sc=pow(.5+.5*dot(d,uScatDir),uSkyP.w)*mix(uSkyQ.x,1.,pow(inv,uSkyQ.y)); return mix(c,uScatterCol,clamp(sc*uSkyP.z,0.,1.)); }
// sky radiance for reflections: gradient, soft sun halo and (optional) a cloud layer
vec3 kitSky(vec3 d){ vec3 c=kitAtmo(d); float sd=max(dot(d,uSunDir),0.);
  c+=uSunColor*uSkyQ.z*(pow(sd,6.)*.03+pow(sd,48.)*.09)*(1.-.5*max(d.y,0.));
  if(uCloud.w>.001){ vec2 p=d.xz/(max(d.y,0.)+.2)*uCloud.z+uTime*vec2(.004,.0015); float n=fbm3(p*1.4)*1.3-.15;
    float lo=1.-uCloud.x; float a=smoothstep(lo-uCloud.y-.08,lo+uCloud.y+.08,n)*uCloud.w*.8*smoothstep(.02,.3,d.y);
    c=mix(c, mix(uCloudLit,uCloudShade,smoothstep(lo,lo+.45,n)*.8), a); }
  return c; }
vec3 kitAmbient(){ return uAmbient; }
float pow5(float x){ x=clamp(x,0.,1.); float x2=x*x; return x2*x2*x; }
float ggxD(float ndh, float a){ float a2=a*a; float d=ndh*ndh*(a2-1.)+1.; return a2/(3.14159*d*d); }
// sun highlight on a water facet: GGX lobe, Schlick fresnel, Kelemen visibility. Stretches into a sun path at grazing angles.
vec3 kitSunSpec(vec3 N, vec3 V, float alpha, float cap){
  vec3 H=normalize(V+uSunDir); float ndh=max(dot(N,H),0.), vdh=max(dot(V,H),0.), ndl=max(dot(N,uSunDir),0.);
  float F=.02+.98*pow5(1.-vdh);
  return uSunColor*uSkyQ.z*min(ggxD(ndh,max(alpha,.012))*F*.25/max(vdh*vdh,.08)*ndl, cap); }
// twinkling glitter cells
float kitSparkle(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 r=h22(i);
  float tw=.5+.5*sin(uTime*(2.+r.x*5.)+r.y*40.); float d=length(f-.5-(r-.5)*.7);
  return smoothstep(.34,.04,d)*tw*tw*tw*tw*step(.45,fract(r.y*7.31+r.x)); }
float kitGlitter(vec2 xz, float cell){ float l=log2(max(cell,.02)), l0=floor(l), t=l-l0;
  return mix(kitSparkle(rot2(.6)*xz/exp2(l0)), kitSparkle(rot2(1.9)*xz/exp2(l0+1.)+17.3), t); }
// angular size of one pixel (radians), from the projection: independent of resolution, pixel ratio and fov
varying vec3 vPixK;
float kitPix(){ return max(fwidth(vPixK.x/vPixK.y)*vPixK.z, 1e-5); }
`,oe="vPixK = vec3(gl_Position.y, gl_Position.w, 1./projectionMatrix[1][1]);",J=`
#include <fog_pars_fragment>
float kitFog(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
    #else
      return smoothstep(fogNear,fogFar,vFogDepth);
    #endif
  #else
    return 0.;
  #endif
}`,De=`
uniform vec3 uUwWater, uUwDeep; uniform float uUwSunDisc;
vec3 kitUnderside(vec3 D, vec3 N, float dist, float net){
  vec3 T = refract(D,N,1.333); float inside = step(.0001,dot(T,T));
  vec3 Tr = refract(D,N,1.316), Tb = refract(D,N,1.35);
  vec3 win = vec3(step(.0001,dot(Tr,Tr)), inside, step(.0001,dot(Tb,Tb)));
  T = normalize(T+vec3(0.,1e-4,0.)); float ct = max(T.y,0.);
  float trans = 1.-pow(clamp(1.-ct,0.,1.),3.);
  float sd = max(dot(T,uSunDir),0.);
  vec3 sky = kitSky(T)+uSunColor*uSkyQ.z*(pow(sd,220.)*2.5+smoothstep(.9990,.9998,sd)*30.)*uUwSunDisc;
  vec3 wn = uUwWater/max(max(uUwWater.r,uUwWater.g),max(uUwWater.b,.001));
  vec3 R = reflect(D,N);
  // total internal reflection: the mirror shows the water volume, never darker than half of it
  vec3 mirror = mix(uUwWater*1.12, max(uUwDeep,uUwWater*.5), clamp(-R.y*1.4-.05,0.,1.))*(.82+.55*net);
  vec3 col = mix(mirror, sky*(.3+.7*wn), win*trans);
  col += uUwWater*(.35*pow(clamp((1.-abs(N.y))*12.,0.,1.),2.))*(1.-inside);            // glints sliding over the mirror
  return col; }
`,ye=e=>.2126*e.r+.7152*e.g+.0722*e.b;function Te(e,r,i,n,a,f){const v=e.ambient,o=Math.max(1e-4,ye(v)),s=o*2.3+ye(e.sunColor)*e.skyQ.z*.3*Math.max(.25,e.sunDir.y),l=s/(1+.55*s)+n,d=v.r/o*.25+.75,p=v.g/o*.25+.75,h=v.b/o*.25+.75;return a.setRGB(r.r*d*l,r.g*p*l,r.b*h*l),f.setRGB(i.r*d*l,i.g*p*l,i.b*h*l),l}const be={calm:{height:.16,wavelength:24,steepness:.3,spread:.9,foam:0,detail:.5,speed:.8,contrast:.15},breeze:{height:.55,wavelength:46,steepness:.55,spread:.7,foam:.12,detail:.85,speed:1,contrast:.3},swell:{height:1.7,wavelength:110,steepness:.55,spread:.35,foam:.16,detail:.75,speed:1,contrast:.55},choppy:{height:1.25,wavelength:36,steepness:.9,spread:.85,foam:.55,detail:1.15,speed:1.1,contrast:.6},storm:{height:4.4,wavelength:95,steepness:.95,spread:.55,foam:1,detail:1.35,speed:1.15,contrast:1,deep:"#2a6a70",scatter:"#8fd4c0"}},wt=Object.keys(be),L=8,ue=18,Se=8;function Ee(e,r,i){const n=[],a=[];let f=0;const v=[];for(let d=0;d<L;d++){const p=r.wavelength*Math.pow(2,1-d*.6)*e.range(.9,1.1),h=Math.pow(p,.75);v.push([p,h]),f+=h}for(let d=0;d<L;d++){const[p,h]=v[d],y=ie/p,u=h/f*r.height*1.35,C=i+(d%2?1:-1)*(.3+.75*Math.abs(e.gauss()))*r.spread*(.3+.7*Math.min(1,d/L));n.push(new t.Vector4(Math.cos(C),Math.sin(C),y,Math.sqrt(de*y)*r.speed)),a.push(new t.Vector4(u,Math.min(1,r.steepness)/(y*u*L),e.range(0,ie),p))}const o=Math.min(9,Math.max(2.6,r.wavelength*.085)),s=.85,l=ue-L;for(let d=0;d<l;d++){const p=o*Math.pow(s/o,d/(l-1))*e.range(.85,1.15),h=ie/p,y=.085*e.range(.7,1.3),u=i+e.gauss()*(.75+.4*r.spread);n.push(new t.Vector4(Math.cos(u),Math.sin(u),h,Math.sqrt(de*h)*r.speed)),a.push(new t.Vector4(y/h,0,e.range(0,ie),p))}return{A:n,B:a}}function ke(e,r,i,n){const a=new Float32Array((r*i+1)*3),f=[],v=e/(Math.exp(n)-1);let o=3;for(let l=1;l<=r;l++){const d=v*(Math.exp(n*l/r)-1),p=l%2*.5;for(let h=0;h<i;h++){const y=(h+p)/i*ie;a[o++]=Math.cos(y)*d,a[o++]=0,a[o++]=Math.sin(y)*d}}for(let l=0;l<i;l++)f.push(0,1+(l+1)%i,1+l);for(let l=1;l<r;l++){const d=1+(l-1)*i,p=1+l*i;for(let h=0;h<i;h++){const y=(h+1)%i;f.push(d+h,d+y,p+h,d+y,p+y,p+h)}}const s=new t.BufferGeometry;return s.setAttribute("position",new t.BufferAttribute(a,3)),s.setIndex(f),s.boundingSphere=new t.Sphere(new t.Vector3,e*1.1),{geometry:s,r0:v,spacing:Math.max(ie/i,n/r)}}const Me=`
uniform vec4 uShallow[${Se}];
#ifdef KIT_DEPTHMAP
uniform sampler2D uDepthTex; uniform vec4 uDepthRect; uniform vec2 uShoal; uniform float uLand;
#endif
vec2 kitShoal(vec2 xz){ float sd = 1e3, w = 30.;
  for(int i=0;i<${Se};i++){ vec4 s=uShallow[i]; if(s.w<=0.) continue; float d=(length(xz-s.xy)-s.z)/s.w; if(d<sd){ sd=d; w=s.w; } }
  #ifdef KIT_DEPTHMAP
    vec2 uv=(xz-uDepthRect.xy)*uDepthRect.zw; vec2 e=min(uv,1.-uv);
    if(min(e.x,e.y)>0.){ float d=mix(1e3, texture2D(uDepthTex,uv).r/uShoal.x, smoothstep(0.,.05,min(e.x,e.y))); if(d<sd){ sd=d; w=uShoal.y; } }
  #endif
  return vec2(sd,w); }
`,Ke=`
#define NW ${L}
uniform vec4 uWA[${ue}], uWB[${ue}];
uniform float uTime, uSpacing, uR0, uRadius, uAmp, uShoreDamp;
varying vec3 vWorld; varying vec2 vXZ; varying float vH; varying vec3 vPixK;
${Me}
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix*vec4(position,1.);
  vec2 xz = wp.xz; float r = length(position.xz);
  float sp = (r+uR0)*uSpacing;
  vec3 d = vec3(0.);
  for(int i=0;i<NW;i++){ vec4 a=uWA[i], b=uWB[i];
    float f = smoothstep(2.,4.5,b.w/sp);
    float th = a.z*dot(a.xy,xz)-a.w*uTime+b.z; float c=cos(th), s=sin(th);
    d.xz += a.xy*(b.y*b.x*c*f); d.y += b.x*s*f; }
  d *= 1.-smoothstep(.3*uRadius,.8*uRadius,r);
  d *= mix(uShoreDamp, 1., smoothstep(0.,1.,kitShoal(xz).x));       // waves lose height over shoals
  wp.xyz += d; vXZ = xz; vWorld = wp.xyz; vH = d.y/uAmp;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,He=`
#define NF ${ue}
#define NW ${L}
${Y}
uniform vec4 uWA[NF], uWB[NF];
uniform vec3 uDeep, uScatter, uFoamColor, uGlow, uHorizonColor, uShallowColor;
uniform float uFoamT, uFoam, uDetail, uRough, uFadeA, uFadeB, uGlitter, uReflect, uSteep, uContrast, uHorizonMix;
varying vec3 vWorld; varying vec2 vXZ; varying float vH;
${Me}
${J}
${De}
const mat2 R1 = mat2(.7986,.6018,-.6018,.7986), R2 = mat2(-.3256,.9455,-.9455,-.3256);      // 37 and 109 degrees
void main(){
  vec3 toCam = cameraPosition-vWorld; float dist = length(toCam); vec3 V = toCam/dist;
  float foot = dist*kitPix()/max(abs(V.y),.03);           // pixel footprint along the view direction (m)
  #ifdef KIT_DEPTHMAP
    // sea that the depth map puts well under the land is never shaded (it is hidden by the terrain anyway)
    vec2 duv = (vXZ-uDepthRect.xy)*uDepthRect.zw;
    if(gl_FrontFacing && min(min(duv.x,duv.y),min(1.-duv.x,1.-duv.y))>0. && texture2D(uDepthTex,duv).r<-uLand) discard;
  #endif
  vec2 slope = vec2(0.); float q = 0., lost = 0.; vec3 j0 = vec3(0.), j1 = vec3(0.), j2 = vec3(0.);
  vec2 wq = vec2(vnoise(R2*vXZ*.05+uTime*.03), vnoise(R1*vXZ*.14-uTime*.05))-.5;       // bends the ripple crests
  float wq2 = vnoise(R2*vXZ*.41+uTime*.09)-.5;
  float gust = .5+vnoise(vXZ*.0065+uTime*.012)+.4*(wq.x+.5);                           // wind patches: rougher and smoother water
  int nf = gl_FrontFacing ? NF : NW+4;                    // the underside needs fewer ripples
  for(int i=0;i<NF;i++){ if(i>=nf) break; vec4 a=uWA[i], b=uWB[i];
    float ka = a.z*b.x, f0 = smoothstep(1.2,4.,b.w/foot), g = i<NW ? 1. : gust*uDetail;
    if(f0<=0.){ lost += ka*ka*.5*g*g; continue; }
    float th = a.z*dot(a.xy,vXZ)-a.w*uTime+b.z;
    int m3 = i-(i/3)*3; float e = m3==0 ? wq.x : m3==1 ? wq.y : -wq.x-wq.y;        // wave groups: crests are short, not endless lines
    if(i>=NW){ float ee = i<NW+3 ? wq.x : (i<NW+6 ? wq.y : wq2); if((i&1)==1) ee = -ee;      // each ripple train lives in its own patches, a few wavelengths across
      th += ((i&1)==0 ? wq.x : wq.y)*6.+((i&2)==0 ? wq2 : wq.y-wq2)*min(a.z*1.3,7.);       // crests wander: no ruled lines
      g *= .12+1.8*smoothstep(-.28,.28,ee); }
    else if(i>=3){ float sm = smoothstep(16.,6.,b.w);                                // short geometry waves break into groups too
      th += ((i&1)==0 ? wq.x : wq.y)*mix(1.2,5.,sm); g *= clamp(1.+mix(1.9,3.4,sm)*e,mix(.3,.08,sm),2.)*mix(1.,smoothstep(.55,1.5,gust)*1.5,sm); }   // and leave glassy slicks between the gusts
    float c=cos(th), s=sin(th), f=f0*g;
    slope += a.xy*(ka*c*f); lost += (1.-f0*f0)*ka*ka*.5*g*g;
    if(i<NW){ float qa=b.y*ka*f, qs=qa*s; q += qs; vec3 dd=vec3(a.x*a.x,a.y*a.y,a.x*a.y);
      j0 += dd*qs; j1 += dd*(qa*(s*.7648+c*.6442)); j2 += dd*(qa*(s*.0707+c*.9975)); } }      // fold now, .7 and 1.5 rad ago
  // micro ripples close to the eye
  float f1 = smoothstep(.6,3.,.9/foot), f2 = smoothstep(.6,3.,.28/foot);
  if(f1>0.){ vec3 n1 = noised(R1*vXZ*1.1+uTime*vec2(.4,.25)), n2 = noised(R2*vXZ*3.6-uTime*vec2(.55,-.4)+n1.x*1.2);
    slope += uDetail*gust*((n1.yz*R1)*.15*f1+(n2.yz*R2)*.11*f2); }
  lost += uDetail*uDetail*gust*gust*((1.-f1)*.004+(1.-f2)*.0025);
  vec3 N = normalize(vec3(-slope.x, 1.-q, -slope.y));
  if(!gl_FrontFacing){                                   // seen from below
    float net = pow(1.-min(abs(slope.x-slope.y)*3.,1.),3.);
    vec3 uc = kitUnderside(-V, -N, dist, net);
    uc = mix(uc, uUwWater, max(smoothstep(0.,.8,kitFog()), 1.-smoothstep(0.,.09,abs(V.y))));      // the far underside melts into the murk: no seam
    gl_FragColor = vec4(uc,1.);
    #include <fog_fragment>
    return; }
  float alpha = sqrt(uRough*uRough+2.*max(lost,0.));
  float ndv = max(dot(N,V),0.);
  // reflection of the sky; rough far water tilts the mean reflection upward
  vec3 R = reflect(-V,N); R.y = abs(R.y); R = normalize(R+vec3(0.,alpha*.9,0.));
  vec3 refl = kitSky(R)*uReflect;
  float F = .02+.98*pow5(1.-ndv); F *= 1./(1.+alpha*1.6);
  // body colour: deep water lit by sky and sun, dark troughs, light scattering through the crests
  vec3 amb = kitAmbient(); float ndl = max(dot(N,uSunDir),0.);
  float crest = smoothstep(-.35,1.,vH);
  float toward = pow(clamp(dot(-V,uSunDir)*.5+.5,0.,1.),3.);
  vec3 body = uDeep*(amb*.9+uSunColor*(.08+.24*ndl));
  body *= mix(1., .5+.5*smoothstep(-1.,.25,vH), uContrast);
  body += uScatter*(amb*(.16+.2*uContrast)+uSunColor*(.04+.3*toward))*crest*crest*(.4+.6*clamp((1.-N.y)*14.,0.,1.))*(.3+.7*exp(-dist*.004));
  vec2 sh = kitShoal(vXZ); float shal = 1.-smoothstep(0.,1.,sh.x);
  float ft = fbm2(R1*vXZ*.33+vec2(uTime*.05,0.));
  float ring = 0.;
  if(sh.x<.6){ float lap = sin(sh.x*sh.y*.55+uTime*1.1+ft*7.)*.5+.5;                    // swash running up the shore
    ring = (1.-smoothstep(0.,.55,sh.x))*smoothstep(-.1,.04,sh.x)*smoothstep(.45,.95,lap*.6+ft*.75+(1.-smoothstep(0.,.2,sh.x))*.4); }
  body = mix(body, uShallowColor*(amb+uSunColor*(.1+.26*ndl)), shal*.62);
  vec3 col = mix(body, refl, F);
  // sun: sharp glints up close, a glittering path far away
  vec3 spec = kitSunSpec(N,V,alpha,60.);
  float gl = kitGlitter(vXZ, dist*kitPix()*3./sqrt(max(V.y,.03)));
  spec *= mix(1., .2+9.*gl, uGlitter*smoothstep(.0,.06,alpha));
  // foam: born where the surface folds (jacobian of the gerstner displacement), ageing into lace behind the crest
  float fa = 0.;
  float J0 = (1.-j0.x)*(1.-j0.y)-j0.z*j0.z, J1 = (1.-j1.x)*(1.-j1.y)-j1.z*j1.z, J2 = (1.-j2.x)*(1.-j2.y)-j2.z*j2.z, fT = uFoamT-.25*uSteep;
  float m = max(smoothstep(uFoamT,fT,J0), max(smoothstep(uFoamT,fT,J1)*.62, smoothstep(uFoamT,fT,J2)*.36))*uFoam;
  vec2 wd = uWA[0].xy; vec2 ws = vec2(dot(vXZ,wd),dot(vXZ,vec2(-wd.y,wd.x)));
  m += uFoam*.3*smoothstep(.6,1.,crest)*smoothstep(.95,1.5,gust);                        // whitecaps flicker in the gusts
  float row = 1.-abs(2.*vnoise(ws*vec2(.014,.2)+vec2(uTime*.02,ft*1.5))-1.);              // wind rows in heavy seas
  m += uFoam*uFoam*.42*pow(row,6.)*smoothstep(-.5,.5,vH);
  m = max(m, ring);
  if(m>.004){
    vec2 fp = vXZ+wd*uTime*.3, wv = vec2(ft-.5, wq.y)*1.2;
    float mm = clamp(m*(.5+1.1*fbm2(ws*vec2(.045,.15)+vec2(uTime*.02,3.)+wv)),0.,.94);     // patchy, drawn out along the wind
    float cov = max(kitLace(fp*.42+wv, mm, foot*.42), kitLace(R1*fp*1.5+wv*2., mm*.9, foot*1.5));
    float dense = smoothstep(.3,.9,mm), lt = smoothstep(.5,2.5,.4/foot), lt2 = smoothstep(.5,2.5,.12/foot);
    // thick foam is marbled: wind-drawn veins of green water open through it, so a breaking crest is never a flat white sheet
    float lt0 = smoothstep(.5,2.5,2.4/foot), mar = 1.-abs(2.*fbm2(ws*vec2(.085,.3)+wv*2.2+vec2(uTime*.05,7.))-1.);
    float mar2 = 1.-abs(2.*vnoise(R1*fp*.55+wv*3.+4.)-1.);
    cov *= max(0., 1.-dense*lt0*(.8*smoothstep(.66,.95,mar)+.45*smoothstep(.72,.97,mar2)*lt));   // never below zero: where both veins cross in dense foam the cover went negative (a few dark pixels along a surf line)
    float bub = mix(.5, kitCell4(R2*fp*2.3+wv).x*1.6, lt);                                 // bubble clusters: thick foam is never a flat sheet
    float tex = (.84+.16*bub)*(.8+.4*mix(.5, fbm2(R1*fp*1.3+wv*3.), lt))*(.94+.12*mix(.5, vnoise(R1*fp*9.), lt2))*(.84+.16*crest);
    fa = cov*(.7+.3*dense)*(.9+.1*mix(1.,bub*1.6,dense));
    fa *= mix(1., mix(min(.3+1.1*fbm2(R2*fp*2.7+wv*2.),1.), 1., dense), lt);                       // flecks are ragged and uneven, not paper cut-outs
    vec3 fc = mix(mix(uScatter,uFoamColor,.5), uFoamColor, dense)*(amb+uSunColor*(.05+.2*mix(ndl,uSunDir.y,.65)))*tex;
    col = mix(col, fc, fa); }
  col += spec*(1.-fa);
  col += uGlow*(fa*1.5+pow(crest,4.)*.25);
  // horizon: dissolve into the sky seen in that direction
  float hf = smoothstep(uFadeA,uFadeB,length(vWorld.xz-cameraPosition.xz)); hf = hf*hf*(3.-2.*hf);
  vec3 hz = mix(kitAtmo(normalize(vec3(-V.x,.004,-V.z))), uHorizonColor, uHorizonMix);
  col = mix(col, hz, hf);
  gl_FragColor = vec4(col,1.);
  #ifdef USE_FOG
    gl_FragColor.rgb = mix(col, mix(fogColor, hz, hf), kitFog());
  #endif
}`;function me(e,r){const i=new t.InstancedBufferGeometry;i.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]);const n=new Float32Array(e*4),a=new Float32Array(e*4),f=[0,0,0,0],v=[0,0,0,0];for(let o=0;o<e;o++)r(o,f,v),n.set(f,o*4),a.set(v,o*4);return i.setAttribute("aA",new t.InstancedBufferAttribute(n,4)),i.setAttribute("aB",new t.InstancedBufferAttribute(a,4)),i.instanceCount=e,i.boundingSphere=new t.Sphere(new t.Vector3,1e5),i}const Oe=`
#define NW ${L}
attribute vec4 aA, aB;  // aA = (tile x, tile z, phase, rate)  aB = (size, lift, seed, drift)
uniform vec4 uWA[${ue}], uWB[${ue}];
uniform float uTime, uRange, uAmp, uLevel; uniform vec2 uWindDir;
varying vec2 vQ; varying float vI, vSeed; varying vec3 vWorld; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){
  float tt = uTime*aA.w+aA.z, life = fract(tt), cyc = floor(tt);
  vec2 p0 = aA.xy+uRange*fract(vec2(.6180,.4142)*cyc+aB.z*7.);
  vec2 c = mod(p0-cameraPosition.xz+uRange*.5,uRange)-uRange*.5; float dc = length(c)/(uRange*.5); c += cameraPosition.xz;
  vec3 d = vec3(0.); float q = 0.;
  for(int i=0;i<NW;i++){ vec4 a=uWA[i], b=uWB[i]; float th=a.z*dot(a.xy,c)-a.w*uTime+b.z; float cs=cos(th), s=sin(th);
    d.xz += a.xy*(b.y*b.x*cs); d.y += b.x*s; q += b.y*a.z*b.x*s; }
  float crest = smoothstep(.16,.42,q)*smoothstep(.05,.45,d.y/uAmp);
  float e = 1.-(1.-life)*(1.-life);
  vec3 w = vec3(c.x+d.x, uLevel+d.y, c.y+d.z);
  w.xz += uWindDir*(aB.w*e); w.y += aB.y*e*(1.-.5*e)+aB.x*.2;
  float sz = aB.x*(.4+.9*e);
  vI = crest*sin(life*3.14159)*(1.-smoothstep(.65,1.,dc))*smoothstep(2.,8.,length(w-cameraPosition));
  vQ = position.xy; vSeed = aB.z; vWorld = w;
  vec4 mvPosition = viewMatrix*vec4(w,1.); mvPosition.xy += position.xy*vec2(1.7,.75)*sz*step(.004,vI);
  gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,$e=`
${Y}
uniform vec3 uFoamColor; uniform float uOpacity;
varying vec2 vQ; varying float vI, vSeed; varying vec3 vWorld;
${J}
void main(){
  float r = length(vQ); if(r>1.||vI<=.004) discard;
  float n = fbm3(vQ*vec2(1.2,2.4)+vSeed*31.+vec2(-uTime*.6,0.));
  float puff = 1.-smoothstep(.05,1.,r+(n-.5)*.9);
  vec3 d = normalize(vWorld-cameraPosition);
  float back = pow(clamp(dot(d,uSunDir)*.5+.5,0.,1.),3.);
  vec3 col = uFoamColor*(kitAmbient()*(.75+.3*n)+uSunColor*(.05+.2*back));
  #ifdef USE_FOG
    col = mix(col, fogColor, kitFog());
  #endif
  gl_FragColor = vec4(col, puff*(.35+.65*puff)*min(vI*1.6,1.)*uOpacity);
}`;function Pe(e,r,i,n){const[a,f,v,o]=e.depthRect;for(let s=0;s<i;s++)r[n*i+s]=t.DataUtils.toHalfFloat(Math.max(-8,Math.min(200,e.depthAt(a+(s+.5)/i*(v-a),f+(n+.5)/i*(o-f)))))}async function xt(e={},r,i=8){const n=Math.max(8,e.depthRes??64),a=new Uint16Array(n*n),f=typeof r=="function"?r:async()=>{},v=Math.max(1,i|0);for(let o=0;o<n;o++)Pe(e,a,n,o),(o+1)%v===0&&o+1<n&&await f();return{data:a,res:n}}function Qe(e={}){const r=pe(e,"ocean"),i={...be[e.preset]||be.breeze};for(const w of["height","wavelength","steepness","spread","foam","detail","speed","contrast"])e[w]!=null&&(i[w]=e[w]);const n=e.radius??3600,a=e.level??0,f=e.windAngle??r.range(0,ie),{A:v,B:o}=Ee(r.fork("waves"),i,f),s=ke(n,e.rings??132,e.segments??160,7.5),l=ne(e),d=se(l),p=Array.from({length:Se},(w,D)=>{const k=(e.shallows||[])[D];return k?new t.Vector4(k.x,k.z,k.radius??40,Math.max(.01,k.falloff??(k.radius??40)*.9)):new t.Vector4(0,0,0,0)}),h=M(e.underColor,"#0d7fa0"),y=M(e.underDeep,"#04283f"),u={...re(),...d,uWA:{value:v},uWB:{value:o},uSpacing:{value:s.spacing},uR0:{value:s.r0},uRadius:{value:n},uAmp:{value:Math.max(.05,i.height)},uSteep:{value:Math.min(1,i.steepness)},uContrast:{value:i.contrast},uDeep:{value:M(e.deep,i.deep??"#0a4a78")},uScatter:{value:M(e.scatter,i.scatter??"#38c9b4")},uFoamColor:{value:M(e.foamColor,"#f2f7fa")},uGlow:{value:M(e.glow,"#000000")},uShallowColor:{value:M(e.shallowColor,"#3fd6c2")},uShallow:{value:p},uShoreDamp:{value:e.shoreDamp??.35},uHorizonColor:{value:M(e.horizonColor,"#000000")},uHorizonMix:{value:e.horizonColor!=null?1:0},uFoamT:{value:1-Math.min(1,i.steepness)*(.7-.45*i.foam)},uFoam:{value:i.foam>0?.35+.65*i.foam:0},uDetail:{value:i.detail},uRough:{value:e.roughness??.035},uFadeA:{value:n*(e.fadeStart??.5)},uFadeB:{value:n*(e.fadeEnd??.97)},uGlitter:{value:e.glitter??1},uReflect:{value:e.reflectivity??1},uUwWater:{value:new t.Color},uUwDeep:{value:new t.Color},uUwSunDisc:{value:1}},C={},V=Math.max(8,e.depthRes??64),N=e.depthData&&e.depthData.res===V&&e.depthData.data&&e.depthData.data.length===V*V?e.depthData.data:null;if((e.depthAt||N)&&e.depthRect){const[w,D,k,I]=e.depthRect,z=V,g=N||new Uint16Array(z*z);if(!N)for(let B=0;B<z;B++)Pe(e,g,z,B);const P=new t.DataTexture(g,z,z,t.RedFormat,t.HalfFloatType);P.magFilter=P.minFilter=t.LinearFilter,P.wrapS=P.wrapT=t.ClampToEdgeWrapping,P.generateMipmaps=!1,P.needsUpdate=!0,u.uDepthTex={value:P},u.uDepthRect={value:new t.Vector4(w,D,1/(k-w),1/(I-D))},u.uShoal={value:new t.Vector2(e.shoalDepth??7,e.shoalWidth??30)},u.uLand={value:Math.max(1.5,i.height*.6)},C.KIT_DEPTHMAP=1}const E=new t.ShaderMaterial({uniforms:u,defines:C,vertexShader:Ke,fragmentShader:He,fog:!0,side:t.DoubleSide}),T=new t.Mesh(s.geometry,E);T.frustumCulled=!1,T.name="kit-ocean-surface",T.renderOrder=e.renderOrder??1;const S=new t.Group;S.name="kit-ocean",S.position.y=a,S.add(T);let c=null;const _=e.spray===!1?0:typeof e.spray=="number"?e.spray:e.spray===!0||i.foam>=.9?520:0;if(_>0){const w=e.sprayRange??300,D=r.fork("spray"),k=Math.max(1,i.height*.55),I=me(_,(g,P,B)=>{P[0]=D.range(0,w),P[1]=D.range(0,w),P[2]=D(),P[3]=D.range(.35,.8),B[0]=k*D.range(.7,1.9),B[1]=k*D.range(.3,1.3),B[2]=D(),B[3]=k*D.range(3,9)}),z={...re(),...d,uTime:u.uTime,uWA:u.uWA,uWB:u.uWB,uAmp:u.uAmp,uRange:{value:w},uLevel:{value:a},uWindDir:{value:new t.Vector2(Math.cos(f),Math.sin(f))},uFoamColor:u.uFoamColor,uOpacity:{value:e.sprayOpacity??.6}};c=new t.Mesh(I,new t.ShaderMaterial({uniforms:z,vertexShader:Oe,fragmentShader:$e,fog:!0,transparent:!0,depthWrite:!1})),c.frustumCulled=!1,c.renderOrder=3,c.name="kit-ocean-spray",c.position.y=-a,S.add(c)}const q=v.slice(0,L).map(w=>[w.x,w.y,w.z,w.w]),A=o.slice(0,L).map(w=>[w.x,w.y,w.z]),R=(w,D,k)=>{let I=w,z=D;for(let P=0;P<5;P++){let B=0,$=0;for(let O=0;O<L;O++){const F=q[O],j=A[O],X=F[2]*(F[0]*I+F[1]*z)-F[3]*k+j[2],le=Math.cos(X),te=j[1]*j[0]*le;B+=F[0]*te,$+=F[1]*te}I+=(w-B-I)*.85,z+=(D-$-z)*.85}let g=0;for(let P=0;P<L;P++){const B=q[P],$=A[P],O=B[2]*(B[0]*I+B[1]*z)-B[3]*k+$[2];g+=$[0]*Math.sin(O)}return a+g},K=(w,D,k,I=new t.Vector3)=>{const g=R(w,D,k);return I.set(g-R(w+.6,D,k),.6,g-R(w,D+.6,k)).normalize()};let Z=!1;return{object:S,surface:T,spray:c,material:E,uniforms:u,light:l,preset:i,level:a,windAngle:f,heightAt:R,normalAt:K,linkUnderwater(w,D,k=1){u.uUwWater.value=w,u.uUwDeep.value=D,u.uUwSunDisc.value=k,Z=!0},setLight:(w,D)=>{l.set(w,D)},update(w,D,k){u.uTime.value=D,Z||Te(l,h,y,.06,u.uUwWater.value,u.uUwDeep.value),k&&(T.position.x=k.position.x,T.position.z=k.position.z)}}}function We(e,r,i){const n=e.center||[0,0],a=n[0],f=n.length>2?n[2]:n[1],v=e.width==null,o=e.radius??120,s=v?o*2:e.width,l=v?o*2:e.depth??e.width,d=e.segments??i,p=Math.max(2,Math.round(d*l/s)),h=new t.PlaneGeometry(s,l,d,p);h.rotateX(-Math.PI/2);const y=h.attributes.position,u=new Float32Array(y.count),C=new Float32Array(y.count);for(let c=0;c<y.count;c++){const _=y.getX(c)+a,q=y.getZ(c)+f;y.setX(c,_),y.setZ(c,q),u[c]=e.depthAt?e.depthAt(_,q):v?(o-Math.hypot(_-a,q-f))*r:50}const V=s/d,N=l/p,E=d+1;for(let c=0;c<=p;c++)for(let _=0;_<=d;_++){const q=c*E+_,A=Math.max(0,_-1),R=Math.min(d,_+1),K=Math.max(0,c-1),Z=Math.min(p,c+1),G=(u[c*E+R]-u[c*E+A])/((R-A)*V),w=(u[Z*E+_]-u[K*E+_])/((Z-K)*N);C[q]=Math.max(-50,Math.min(500,u[q]/Math.max(.03,Math.hypot(G,w))))}h.setAttribute("aDepth",new t.BufferAttribute(u,1)),h.setAttribute("aShore",new t.BufferAttribute(C,1));const T=h.index.array,S=[];for(let c=0;c<T.length;c+=3)(u[T[c]]>0||u[T[c+1]]>0||u[T[c+2]]>0)&&S.push(T[c],T[c+1],T[c+2]);return h.setIndex(S),h.computeBoundingSphere(),h}function _e(e,r){if(!e.attributes.aShore&&e.attributes.aDepth){const i=e.attributes.aDepth.array,n=new Float32Array(i.length);for(let a=0;a<i.length;a++)n[a]=i[a]/r;e.setAttribute("aShore",new t.BufferAttribute(n,1))}return e}const Be=`
attribute float aDepth, aShore; varying vec3 vWorld; varying float vDepth, vShore; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix*vec4(position,1.); vWorld = wp.xyz; vDepth = aDepth; vShore = aShore;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,Xe=`
${Y}
uniform vec3 uDeep, uShallow, uFoamColor, uBandColor, uBandTop;
uniform float uRipple, uRippleScale, uRough, uShoreFoam, uFoamWidth, uClarity, uBandH, uBandSoft, uBandAmt, uBandHaze, uEdge, uReflect, uGlitter;
uniform vec2 uWind, uCenter;
#ifdef KIT_SKYLINE
uniform sampler2D uSkyline;
#endif
varying vec3 vWorld; varying float vDepth, vShore;
${J}
const mat2 R1 = mat2(.7986,.6018,-.6018,.7986), R2 = mat2(-.3256,.9455,-.9455,-.3256), R3 = mat2(.3420,-.9397,.9397,.3420);
void main(){
  if(vDepth<=0.) discard;
  vec3 toCam = cameraPosition-vWorld; float dist = length(toCam); vec3 V = toCam/dist;
  float pix = kitPix(), foot = dist*pix/max(V.y,.03);
  vec2 p = vWorld.xz*uRippleScale; float inv = 1./(uRippleScale*foot);
  float f1 = smoothstep(1.,4.,5.*inv), f2 = smoothstep(1.,4.,1.4*inv), f3 = smoothstep(1.,4.,.4*inv);
  vec3 n1 = noised(R1*p*.2+uWind*uTime*.1), n2 = noised(R2*p*.7-uWind.yx*uTime*.17+n1.x), n3 = noised(R3*p*2.6+uWind*uTime*.33+n2.x);
  float gust = .25+.75*smoothstep(.3,.7,vnoise(vWorld.xz*.011+uWind*uTime*.015)*.6+vnoise(R1*vWorld.xz*.031-uWind*uTime*.02)*.4);   // cat's paws
  vec2 slope = uRipple*gust*((n1.yz*R1)*.05*f1+(n2.yz*R2)*.05*f2+(n3.yz*R3)*.035*f3);
  float lost = uRipple*uRipple*gust*gust*((1.-f1)*.0004+(1.-f2)*.0004+(1.-f3)*.0002);
  vec3 N = normalize(vec3(-slope.x,1.,-slope.y));
  float alpha = sqrt(uRough*uRough+2.*lost), ndv = max(dot(N,V),0.);
  vec3 R = reflect(-V,N); R.y = abs(R.y);
  vec3 amb = kitAmbient(); float ndl = max(dot(N,uSunDir),0.);
  vec3 refl = kitSky(R);
  // reflection of the far shore: a skyline whose edge wobbles with the ripples
  float rh = max(length(R.xz),1e-3), az = atan(R.z,R.x);
  #ifdef KIT_SKYLINE
    vec4 s0 = texture2D(uSkyline, vec2(az/TAU+.5,.25)); vec3 top = texture2D(uSkyline, vec2(az/TAU+.5,.75)).rgb;
    float dd = max(s0.y-dot(vWorld.xz-uCenter,R.xz/rh), s0.y*.3);         // the ridge is nearer or further from this spot than from the centre
    float elev = s0.x*s0.y/dd;
  #else
    float elev = uBandH*(.55+.9*vnoise(vec2(az*5.,1.7))+.35*vnoise(vec2(az*23.,9.2))), dd = 400.; vec3 top = uBandTop;
  #endif
  float tt = (R.y/rh)/max(elev,1e-4), soft = uBandSoft/max(elev,.02);
  float facing = .5-.5*dot(R.xz/rh, normalize(uSunDir.xz+1e-4));                      // slopes that face the sun are lit, backlit ridges are silhouettes
  vec3 land = mix(uBandColor, top, smoothstep(.2,.7,tt))*(amb*.4+uSunColor*(.01+.15*facing*facing));
  land = mix(land, amb*.6, 1.-exp(-dd*uBandHaze));
  float bandM = uBandAmt*smoothstep(1.+soft,1.-soft,tt)*step(1e-4,elev);
  refl = mix(refl, land, bandM);
  float F = .02+.98*pow5(1.-ndv);
  float dk = 1.-exp(-vDepth*uClarity);
  vec3 body = mix(uShallow,uDeep,dk)*(amb*1.05+uSunColor*(.07+.16*ndl));
  vec3 col = mix(body, refl*uReflect, F);
  vec3 spec = kitSunSpec(N,V,alpha,60.)*(1.-bandM);
  spec *= mix(1., .3+6.*kitGlitter(vWorld.xz, dist*pix*3./sqrt(max(V.y,.03))), uGlitter*smoothstep(0.,.05,alpha));
  // shoreline foam: a broken fringe at the water's edge and soft bands lapping toward it
  float w = max(uFoamWidth, 2.2*foot), sh = 1.-smoothstep(0.,w,vShore);
  float fn = fbm2(R1*vWorld.xz*.45+uTime*.03), fq = vnoise(R2*vWorld.xz*2.3-uTime*.05);
  float bands = mix(.5+.5*sin((vShore/uFoamWidth*2.4+uTime*.32+fn*2.2)*TAU), .32, smoothstep(.25,.9,foot*2.4/uFoamWidth));
  float fringe = smoothstep(.34*w,.02*w,vShore+(fn-.5)*.35*w);
  float fm = clamp(fringe*(.55+.45*fq)+sh*sh*smoothstep(.45,.95,bands*(.55+.6*fn))*(.35+.65*fq), 0., 1.)*uShoreFoam*min(1.,uFoamWidth/w*1.6);
  col += spec*(1.-fm);
  col = mix(col, uFoamColor*(amb*.9+uSunColor*(.05+.2*ndl)), fm);
  float a = smoothstep(0.,uEdge,vDepth)*mix(clamp(.3+dk*1.1,0.,1.),1.,max(F,fm));
  gl_FragColor = vec4(col,a);
  #include <fog_fragment>
}`;function Ze(e,r,i,n,a,f){const v=typeof e=="function"?e:null,o=(v?128:e.samples)??128,s=new Uint16Array(o*8),l=t.DataUtils.toHalfFloat,d=new t.Color,p=!v&&e.near||a,h=!v&&e.far||900,y=!v&&e.steps||24;for(let C=0;C<o;C++){const V=((C+.5)/o-.5)*ie,N=Math.cos(V),E=Math.sin(V);let T=0,S=h;if(d.copy(f),v){const c=v(V);typeof c=="number"?T=Math.tan(Math.max(0,c)):c&&(T=Math.tan(Math.max(0,c.elevation??0)),S=c.distance??h,c.color!=null&&ee(d,c.color))}else{let c=0,_=0,q=n;for(let A=0;A<y;A++){const R=p*Math.pow(h/p,A/(y-1)),K=r+N*R,Z=i+E*R,G=e.heightAt(K,Z),w=(G-n)/R;w>T&&(T=w,S=R,c=K,_=Z,q=G)}if(T>0&&e.colorAt){const A=e.colorAt(c,q,_);A!=null&&ee(d,A)}}s.set([l(Math.min(T,8)),l(S),0,l(1)],C*4),s.set([l(d.r),l(d.g),l(d.b),l(1)],(o+C)*4)}const u=new t.DataTexture(s,o,2,t.RGBAFormat,t.HalfFloatType);return u.magFilter=u.minFilter=t.LinearFilter,u.wrapS=t.RepeatWrapping,u.wrapT=t.ClampToEdgeWrapping,u.generateMipmaps=!1,u.needsUpdate=!0,u}function yt(e={}){if(e.frozen)return Je(e);const r=pe(e,"lake"),i=e.band===!1?{amount:0}:e.band||{},n=e.windAngle??r.range(0,ie),a=e.level??0,f=e.center||[0,0],v=f[0],o=f.length>2?f[2]:f[1],s=e.radius??(e.width?e.width*.5:120),l=ne(e),d=M(i.top,"#77806f"),p={...re(),...se(l),uDeep:{value:M(e.deep,"#083a52")},uShallow:{value:M(e.shallow,"#6fd0c2")},uFoamColor:{value:M(e.foamColor,"#f2f7fa")},uBandColor:{value:M(i.color,"#22342c")},uBandTop:{value:d},uBandH:{value:i.height??.12},uBandSoft:{value:i.softness??.03},uBandAmt:{value:i.amount??(e.skyline?1:.9)},uBandHaze:{value:i.haze??5e-4},uCenter:{value:new t.Vector2(v,o)},uRipple:{value:e.ripple??1},uRippleScale:{value:e.rippleScale??1},uRough:{value:e.roughness??.02},uShoreFoam:{value:e.shoreFoam??.85},uFoamWidth:{value:e.foamWidth??3.5},uClarity:{value:e.clarity??.38},uEdge:{value:e.edgeSoftness??.12},uReflect:{value:e.reflectivity??1},uGlitter:{value:e.glitter??.8},uWind:{value:new t.Vector2(Math.cos(n),Math.sin(n))}},h={};e.skyline&&(p.uSkyline={value:Ze(e.skyline,v,o,a,s,d)},h.KIT_SKYLINE=1);const y=e.geometry?_e(e.geometry,e.shoreSlope??.12):We(e,e.shoreSlope??.12,72),u=new t.ShaderMaterial({uniforms:p,defines:h,vertexShader:Be,fragmentShader:Xe,fog:!0,transparent:!0,depthWrite:!1}),C=new t.Mesh(y,u);return C.position.y=a,C.name="kit-lake",{object:C,material:u,uniforms:p,light:l,level:a,heightAt:()=>a,setLight:(V,N)=>{l.set(V,N)},update(V,N){p.uTime.value=N}}}const Ye=`
${Y}
uniform vec3 uIce, uDeep, uCrack, uSnow, uGlow;
uniform float uScale, uThick, uSnowAmt, uRough, uCrackAmt, uFrost;
varying vec3 vWorld; varying float vDepth;
${J}
// (gap between the two nearest cells: 0 on the borders, cell hash, hash shared by the two cells either side of a border)
vec3 cells(vec2 p){ vec2 i=floor(p), f=fract(p); float d1=8., d2=8.; vec2 o1=vec2(0.), o2=vec2(0.);
  for(int y=-1;y<=1;y++) for(int x=-1;x<=1;x++){ vec2 g=vec2(float(x),float(y)); vec2 o=h22(i+g); vec2 r=g+o-f; float d=dot(r,r);
    if(d<d1){ d2=d1; o2=o1; d1=d; o1=o; } else if(d<d2){ d2=d; o2=o; } }
  return vec3(sqrt(d2)-sqrt(d1), o1.x, fract((o1.x+o2.x)*7.13+o1.y*o2.y*3.7)); }
// one family of long cracks in cell units: (surface line, fracture plane seen at depth). par = parallax per unit depth
vec2 crackSet(vec2 p, vec2 par, float ang, float freq, float seed, float w, float thick){
  vec2 n = vec2(cos(ang), sin(ang)), t = vec2(-n.y, n.x);
  float u = dot(p,n)*freq+seed, v = dot(p,t)*freq;
  u += .3*sin(v*.53+seed*3.)+.1*sin(v*1.71+seed)+.035*sin(v*6.3+seed*5.);
  float id = floor(u), fu = fract(u)-.5, h = h21(vec2(id, seed));
  float seg = vnoise(vec2(v*.45+h*91., id*.37+seed));                          // where along its length the crack exists
  float on = smoothstep(.4,.56,seg)*step(.3,h);
  float line = (1.-smoothstep(0., w*freq*(.4+on), abs(fu)))*on;
  float off = dot(par,n)*thick*freq; off = abs(off)<1e-4 ? 1e-4 : off;
  float s = fu/off;                                                            // 0 at the surface, 1 at the bottom of the plane
  float cur = (s>0.&&s<1.) ? (1.-s)*(1.-s)*(.3+.7*vnoise(vec2(v*5.+h*17., s*2.5+h*9.))) : 0.;
  return vec2(line, cur*on*smoothstep(0.,.08,abs(off))); }
const mat2 R1 = mat2(.7986,.6018,-.6018,.7986), R2 = mat2(-.3256,.9455,-.9455,-.3256);
void main(){
  if(vDepth<=0.) discard;
  vec3 toCam = cameraPosition-vWorld; float dist = length(toCam); vec3 V = toCam/dist;
  float foot = dist*kitPix()/max(V.y,.03);
  vec2 p = vWorld.xz, par = V.xz/sqrt(1.72-dot(V.xz,V.xz));     // refracted into the ice (n = 1.31)
  float lod = smoothstep(.5,3.,uScale*.06/foot);
  // surface: gentle undulation + pressure ridges
  vec3 n1 = noised(R1*p*.05), n2 = noised(R2*p*.9+n1.x*2.);
  vec3 N = normalize(vec3(-((n1.yz*R1).x*.02+(n2.yz*R2).x*.035*lod),1.,-((n1.yz*R1).y*.02+(n2.yz*R2).y*.035*lod)));
  float ndv = max(dot(N,V),0.);
  // milky frozen-in clouds and wind-packed snow first: under snow, and far away, the cracks are never evaluated
  float cloud = fbm3((p-par*.5*uThick)*.11); float cloud2 = fbm2((p-par*.2*uThick)*.6+7.);
  float milk = smoothstep(.35,.75,cloud)*.75+cloud2*.25*uFrost;
  float sn = fbm3(p*vec2(.035,.09)+vec2(0.,cloud*1.5))+.25*fbm2(p*.5)-.12;
  float snow = smoothstep(1.-uSnowAmt-.07,1.-uSnowAmt+.07,sn+.1+smoothstep(.6,0.,vDepth)*.6);
  vec3 amb = kitAmbient(); float ndl = max(dot(N,uSunDir),0.);
  float grain = vnoise(p*7.)*.5+vnoise(R1*p*23.)*.5;
  vec3 col = uSnow*(amb*.85+uSunColor*(.05+.19*ndl))*(.86+.14*grain);
  col += uSunColor*uSkyQ.z*kitGlitter(p*14.,1.)*pow(max(dot(reflect(-V,vec3(0.,1.,0.)),uSunDir),0.),4.)*2.5*lod;
  if(snow<.995){
    vec3 crack = vec3(0.); float veil = 0.;
    if(lod>.002){
    // cracks: families of long, gently curved fractures that start and stop, each with a pale fracture plane hanging
    // below it (seen through the ice by refracted parallax), plus a sparse polygon network and patches of crazing
    vec2 pu = p/uScale;
    vec2 bend = (vec2(vnoise(R1*pu*.37+3.1), vnoise(R2*pu*.37+17.7))-.5)*1.5+(vec2(vnoise(pu*2.1), vnoise(pu*2.1+9.3))-.5)*.2;
    vec2 pb = pu+bend*.45; float w = (.009+foot*.5)/uScale;
    float thinG = min(1., .05/(w*uScale));                                          // hairlines fade with distance instead of fattening
    vec2 cs = crackSet(pb, par, .31, .47, 1.7, w, uThick/uScale)+crackSet(pb, par, 1.45, .73, 5.3, w, uThick/uScale)
      +crackSet(pb, par, 2.38, 1.15, 9.1, w, uThick/uScale*.7)+crackSet(pb, par, 2.93, .29, 13.9, w*1.5, uThick/uScale*1.4);
    crack += uCrack*(cs.x*thinG+cs.y*.55*lod); veil += cs.x*thinG;
    vec2 wob = .17*vec2(sin(pu.y*4.3+bend.x*6.), sin(pu.x*3.7+bend.y*6.))+.05*vec2(sin(pu.y*13.+bend.y*9.), sin(pu.x*11.-bend.x*9.));
    vec3 c = cells((pu-par*.03*uThick/uScale)*.62+bend*.8+wob+11.3);     // edges wander: no ruler-straight polygon sides
    float keep = step(.66,c.z), wi = w*.62*(.35+1.3*vnoise(pu*2.7+5.));
    float line = (1.-smoothstep(0.,wi,c.x))*keep;
    crack += uCrack*(line*.7*thinG+smoothstep(.22,0.,c.x)*step(.8,c.z)*.12); veil += line*.6*thinG;
    float craze = smoothstep(.5,.7,vnoise(R1*pu*.9+4.));                          // patches of fine crazing
    if(craze>0.){ vec3 cm = cells(pu*4.3+bend*2.+3.1); crack += uCrack*(1.-smoothstep(0.,w*6.,cm.x))*.2*lod*craze; }
    // columns of frozen bubbles: the same discs repeated at three depths
    float bub = 0.;
    for(int i=0;i<3;i++){ float fi = float(i); vec2 q = R1*(p-par*(.12+fi*.2)*uThick)*2.6+fi*7.31; vec2 id = floor(q), f = fract(q)-.5; vec2 h = h22(id);
      float on = smoothstep(.6,.74,vnoise(id*.23+7.)*.7+vnoise(id*.71+3.)*.3+.04)*step(.58,h.x), br = .018+.1*h.y*h.y*h.y;     // tight clusters, mostly tiny, a few large
      // sub-pixel bubbles melt into a faint haze instead of fattening into dots
      bub += on*(1.-smoothstep(.0,.04+.06*h.y+foot*2.6,length(f-(h-.5)*.72)-br))*(1.-fi*.3)*min(1.,(br+.03)/(.03+foot*4.)); }
    crack += mix(uCrack,uIce,.3)*bub*.3*lod;
    crack *= uCrackAmt*lod;
    }
    // body: clear dark ice, polished reflection
    vec3 light = amb+uSunColor*(.1+.22*ndl);
    float toward = pow(clamp(dot(-V,uSunDir)*.5+.5,0.,1.),2.);
    vec3 body = mix(uDeep, uIce, clamp(milk*uFrost+.08,0.,1.))*light;
    body += uIce*uSunColor*toward*.10*(.3+milk);
    body += crack*light*(.6+1.2*toward)+uGlow*(veil*.6+milk*.15);
    vec3 R = reflect(-V,N); R.y = abs(R.y);
    float F = .025+.975*pow5(1.-ndv);
    float alpha = uRough+.05*cloud2;
    vec3 ic = mix(body, kitSky(normalize(R+vec3(0.,alpha,0.))), F*(1.-.25*milk));
    ic += kitSunSpec(N,V,alpha,4.)*(1.-.6*milk);
    col = mix(ic, col, snow);
  }
  gl_FragColor = vec4(col,1.);
  #include <fog_fragment>
}`;function Je(e={}){const r=!!e.endless,i=e.radius??(r?3600:120),n=ne(e),a={...re(),...se(n),uIce:{value:M(e.ice,"#9fdcf0")},uDeep:{value:M(e.deep,"#06324f")},uCrack:{value:M(e.crackColor,"#e8f8ff")},uSnow:{value:M(e.snowColor,"#eef3f8")},uGlow:{value:M(e.glow,"#000000")},uScale:{value:e.crackScale??7},uThick:{value:e.thickness??1},uSnowAmt:{value:e.snow??.38},uRough:{value:e.roughness??.09},uCrackAmt:{value:e.cracks??1},uFrost:{value:e.frost??1}};let f=e.geometry;if(f)_e(f,e.shoreSlope??.12);else if(r){f=ke(i,24,48,6).geometry;const s=f.attributes.position.count;f.setAttribute("aDepth",new t.BufferAttribute(new Float32Array(s).fill(50),1)),f.setAttribute("aShore",new t.BufferAttribute(new Float32Array(s).fill(500),1))}else f=We({...e,radius:i},e.shoreSlope??.12,56);const v=new t.ShaderMaterial({uniforms:a,vertexShader:Be,fragmentShader:Ye,fog:!0}),o=new t.Mesh(f,v);return o.position.y=e.level??0,o.name="kit-ice",r&&(o.frustumCulled=!1,o.renderOrder=e.renderOrder??1),{object:o,material:v,uniforms:a,light:n,level:e.level??0,heightAt:()=>e.level??0,setLight:(s,l)=>{n.set(s,l)},update(s,l,d){a.uTime.value=l,r&&d&&(o.position.x=d.position.x,o.position.z=d.position.z)}}}const Le=`
attribute vec3 aSide; attribute vec3 aFlow;   // aFlow = (slope, half width, 0)
uniform float uTime, uBow, uChop;
varying vec3 vWorld, vSide; varying vec2 vUv; varying vec2 vFlow; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){
  vec3 pos = position; float a = uv.x, s = uv.y, x = a*aFlow.y, mid = 1.-a*a, rapid = smoothstep(.03,.28,aFlow.x);
  // crowned cross-section; standing waves on fast water stay put while the flow runs through them
  pos.y += uBow*mid+uChop*mid*(.2+rapid)*(sin(s*1.1+abs(x)*.9+sin(x*.7)*1.3)*.5+sin(s*2.3-x*1.7+1.3)*.3+sin(s*.37+x*.5+uTime*.6)*.2);
  vec4 wp = modelMatrix*vec4(pos,1.); vWorld = wp.xyz; vUv = uv; vFlow = aFlow.xy;
  vSide = normalize(mat3(modelMatrix)*aSide);
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,et=`
${Y}
uniform vec3 uDeep, uShallow, uFoamColor, uWet;
uniform float uSpeed, uFoam, uBankFoam, uRough, uRipple, uOpacity, uLen, uBankFade;
varying vec3 vWorld, vSide; varying vec2 vUv; varying vec2 vFlow;
${J}
// Flowing detail in (across, along) metres: streamlines drawn out 12:1, surges, fine fibres.
// Returns (foam driver 0..1, d/across, d/along, fibre lines).
vec4 flowTex(vec2 q){
  q.x += .6*sin(q.y*.11+1.7)+.25*sin(q.y*.31);                            // the streaks meander
  vec3 a = noised(vec2(q.x*1.5, q.y*.13));
  vec3 b = noised(vec2(q.x*.9+a.x*1.2, q.y*.11)+7.3);
  vec3 c = noised(vec2(q.x*4.2+b.x*1.5, q.y*.38)+3.1);
  float la = 1.-abs(2.*a.x-1.), lc = 1.-abs(2.*c.x-1.);
  return vec4(a.x*.4+b.x*.38+c.x*.22, a.y*.63+b.y*.34+c.y*.7, a.z*.055+b.z*.045+c.z*.09, la*la*la*.6+lc*lc*lc*.4); }
void main(){
  float a = vUv.x, s = vUv.y, hw = vFlow.y, slope = vFlow.x, x = a*hw;
  vec3 toCam = cameraPosition-vWorld; float dist = length(toCam); vec3 V = toCam/dist;
  float foot = dist*kitPix()/max(abs(V.y),.05), lod = smoothstep(.5,3.,.5/foot), aa = clamp(foot*.8,.015,.3);
  float rapid = smoothstep(.03,.28,slope);
  // white water: a lot of foam on a fast current. Exactly 0 for foam <= .7 or speed <= 4.4, and every term it scales is
  // then left as it was, so calmer rivers are untouched.
  float wild = smoothstep(.7,.8,uFoam)*smoothstep(4.4,5.6,uSpeed);
  float v = uSpeed*(1.-.6*a*a)*(1.+rapid*2.2);                        // fastest mid-stream and on steps
  // two phase-shifted layers hide the shear between fast and slow lanes
  float ph = uTime*.2, p0 = fract(ph), p1 = fract(ph+.5), cyc = 5.;
  vec2 q = vec2(x, s);
  vec4 t0 = flowTex(q-vec2(0.,v*(p0-.5)*cyc+uTime*uSpeed*.35)), t1 = flowTex(q+vec2(13.7,31.1)-vec2(0.,v*(p1-.5)*cyc+uTime*uSpeed*.35));
  vec4 t = mix(t0,t1,abs(1.-2.*p0));
  // the surge field for white water, with the contrast the cross-fade takes out put back so its bands do not swell and thin every cycle
  float wq = abs(1.-2.*p0), tx = .5+(t.x-.5)*inversesqrt(1.-2.*wq*(1.-wq));
  // standing waves and chevrons: fixed to the bed
  float sp = s*1.25+abs(x)*.95+2.2*sin(x*.35+s*.07), sq = s*2.6-x*1.9+1.3+1.5*sin(s*.19);
  float stA = (.1+.9*rapid)*.2;
  vec2 st = stA*(vec2(.95*sign(x), 1.25)*cos(sp)*.6+vec2(-1.9,2.6)*cos(sq)*.2);
  vec3 T = normalize(cross(vSide, vec3(0.,1.,0.)));
  vec2 sl = (t.yz*(.35+rapid*.8)+st)*uRipple*lod;
  vec3 N = normalize(vec3(0.,1.,0.)-vSide*sl.x-T*sl.y);
  float ndv = max(dot(N,V),0.), ndl = max(dot(N,uSunDir),0.);
  vec3 R = reflect(-V,N); R.y = abs(R.y);
  vec3 amb = kitAmbient();
  // depth follows a thalweg that swings from bank to bank
  float c0 = (.5*sin(s*.045+1.7)+.2*sin(s*.11+.4))*.6, u = (a-c0)/(a>c0 ? 1.-c0 : 1.+c0), depth = 1.-u*u;
  vec3 body = mix(uShallow,uDeep,smoothstep(0.,.85,depth))*(amb*1.05+uSunColor*(.07+.16*ndl));
  // aerated water is milky: lifted toward the shallow colour everywhere and more under the foam, so the deep channel
  // only shades it and nothing between the foam goes black in a dim light
  body = mix(body, mix(uShallow,uFoamColor,.15)*(amb*1.05+uSunColor*(.07+.16*ndl)), wild*(.22+.38*mix(.45,smoothstep(.4,.62,tx),lod)));
  float F = .03+.97*pow5(1.-ndv);
  vec3 col = mix(body, kitSky(R), F);
  // foam: fibrous white water on steep runs, thin lines riding the current, lace in the bank eddies
  float bd = (1.-abs(a))*hw;                                          // metres from the edge
  float wthr = mix(.8,.36,rapid);
  float white = smoothstep(wthr-aa, wthr+aa+.12, t.x+t.w*.22)*smoothstep(.0,.35,rapid);
  float streak = smoothstep(.72-aa,.9+aa,t.w+(t.x-.5)*.6)*uFoam*.55;
  // white water: the fibres above are hard-edged at this opacity, thinner than a pixel and they strobe at this speed.
  // Soft bands that follow the surges (a smooth field) take their place; the filter widens unevenly so that their
  // mean cover (.27) is the same at every distance, and they settle on it far away.
  streak = mix(streak, mix(.27,smoothstep(.46-.7*aa,.61+1.3*aa,tx),lod)*uFoam, wild);
  float bank = smoothstep(uBankFade*2.6,uBankFade*.7,bd)*smoothstep(.5-aa,.72+aa,t.x+t.w*.25+(1.-smoothstep(0.,uBankFade*1.2,bd))*.18)*uBankFoam;
  float fm = clamp(white+streak+bank,0.,1.)*(.55+.45*lod);
  float fib = mix(t.w, tx*.6, wild);                                 // white water: sheen and foam shade follow the surges, not the fibres
  col += kitSunSpec(N,V,uRough+.06+.05*rapid+.04*(1.-lod)+.08*wild,6.)*(1.-fm)*(.45+.6*fib);      // a sheen along the current, not salt-and-pepper glints
  col = mix(col, uFoamColor*(amb*.9+uSunColor*(.05+.2*mix(ndl,uSunDir.y,.5)))*(.74+.3*fib), fm);
  // banks: the sheet thins over a metre of wet margin instead of ending in a cut line
  float edge = smoothstep(0.,uBankFade,bd+(t.x-.5)*.5*uBankFade);
  col = mix(uWet*amb, col, smoothstep(.15,.9,edge));
  float al = edge*smoothstep(0.,6.,s)*smoothstep(0.,3.,uLen-s);
  al *= mix(uOpacity,1.,max(max(F,fm),max(smoothstep(0.,.7,depth)*.8,wild*.8)))*mix(.75,1.,smoothstep(.15,.9,edge));
  gl_FragColor = vec4(col,al);
  #include <fog_fragment>
}`;function bt(e={}){const r=(e.points||[[-60,0,0],[-20,0,14],[20,0,-10],[60,0,4]]).map(S=>S.isVector3?S.clone():new t.Vector3(S[0],S[1],S[2])),i=e.curve||new t.CatmullRomCurve3(r,!1,"centripetal"),n=i.getLength(),a=e.segments??Math.min(500,Math.max(8,Math.round(n/1.6))),f=e.across??10,v=typeof e.width=="function"?e.width:()=>e.width??14,o=[],s=[],l=[],d=[],p=[],h=new t.Vector3,y=new t.Vector3,u=new t.Vector3;for(let S=0;S<=a;S++){const c=S/a;i.getPointAt(c,h),i.getTangentAt(c,y);const _=Math.max(0,-y.y)/Math.max(.2,Math.hypot(y.x,y.z));u.set(-y.z,0,y.x).normalize();const q=v(c)*.5;for(let A=0;A<=f;A++){const R=A/f*2-1;o.push(h.x+u.x*q*R,h.y+(e.lift??0),h.z+u.z*q*R),s.push(R,c*n),l.push(u.x,0,u.z),d.push(_,q,0)}if(S<a)for(let A=0;A<f;A++){const R=S*(f+1)+A,K=R+f+1;p.push(R,R+1,K,R+1,K+1,K)}}const C=new t.BufferGeometry;C.setAttribute("position",new t.Float32BufferAttribute(o,3)),C.setAttribute("uv",new t.Float32BufferAttribute(s,2)),C.setAttribute("aSide",new t.Float32BufferAttribute(l,3)),C.setAttribute("aFlow",new t.Float32BufferAttribute(d,3)),C.setIndex(p),C.computeBoundingSphere();const V=ne(e),N={...re(),...se(V),uDeep:{value:M(e.deep,"#0b4c5c")},uShallow:{value:M(e.shallow,"#62b8b0")},uFoamColor:{value:M(e.foamColor,"#f2f7fa")},uWet:{value:M(e.wetColor,"#2c2a26")},uSpeed:{value:e.speed??3},uFoam:{value:e.foam??.6},uBankFoam:{value:e.bankFoam??.8},uRough:{value:e.roughness??.03},uRipple:{value:e.ripple??1},uOpacity:{value:e.opacity??.55},uLen:{value:n},uBankFade:{value:e.bankFade??1.2},uBow:{value:e.bow??.05},uChop:{value:e.chop??.1}},E=new t.ShaderMaterial({uniforms:N,vertexShader:Le,fragmentShader:et,fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide}),T=new t.Mesh(C,E);return T.name="kit-river",{object:T,material:E,uniforms:N,light:V,curve:i,length:n,sampleAt(S,c={}){return c.position=i.getPointAt(S,c.position||new t.Vector3),c.tangent=i.getTangentAt(S,c.tangent||new t.Vector3),c.width=v(S),c},setLight:(S,c)=>{V.set(S,c)},update(S,c){N.uTime.value=c}}}const Ve=`
attribute vec3 aFall;   // (seconds since the lip, layer, edge 0..1)
varying vec3 vWorld, vFace; varying vec2 vUv; varying vec3 vFall; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix*vec4(position,1.); vWorld = wp.xyz; vUv = uv; vFall = aFall; vFace = normalize(mat3(modelMatrix)*normal);
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,tt=`
${Y}
uniform vec3 uColor, uTint; uniform float uSpeed, uGlowAmt, uDensity, uHeight;
varying vec3 vWorld, vFace; varying vec2 vUv; varying vec3 vFall;
${J}
void main(){
  float x = vUv.x, tau = vUv.y, layer = vFall.y, veil = step(8.5,layer), lx = x+layer*17.3;
  vec3 toCam = cameraPosition-vWorld; float dist = length(toCam); vec3 V = toCam/dist;
  float fine = smoothstep(.5,2.5,.12*max(abs(dot(V,normalize(vFace))),.2)/(dist*kitPix()));
  // z is constant for a parcel of water, so every feature stretches as it accelerates down the fall
  float z = vFall.x-uTime*uSpeed*.62+max(tau,0.)*.4;       // (negative on the lip: the river arriving at the brink)
  float a = fbm2(vec2(lx*.33, z*.75+layer*3.));                                  // surges
  float b = noised(vec2(lx*1.3+a*1.6, z*1.9+layer*7.)).x;                        // strands
  float f1 = 1.-abs(2.*vnoise(vec2(lx*6.+b*2.4, z*2.4+layer*5.))-1.);            // filaments: thin white cores
  float f2 = 1.-abs(2.*vnoise(vec2(lx*17.+a*4., z*3.7+layer*9.))-1.);
  float fil = f1*f1*f1*.7+f2*f2*f2*.5*fine;
  vec2 hc = kitCell4(vec2(lx*.95+a, z*1.25+layer*2.));                            // comet heads leading the strands
  float head = smoothstep(.36,.04,length(vec2(hc.x, hc.x*.3)))*smoothstep(.1,.45,tau);
  float dens = a*.5+b*.4+fil*.2+head*.28+(1.-vFall.z)*.13*(1.-layer*.3);         // fuller down the middle
  float aer = smoothstep(-.005,.2,tau);                       // glassy at the lip, white once it breaks up
  float ragged = vFall.z+(a-.5)*.6+(b-.5)*.35;
  float edge = 1.-smoothstep(.58,1.,ragged);
  float thin = tau*(.17+.1*layer)-uDensity*.2;                // sheets tear open lower down
  float body = smoothstep(.42+thin, .62+thin, dens)*edge;
  float core = smoothstep(.55,.95,dens+fil*.5);
  float lipA = (1.-smoothstep(.7,1.,vFall.z))*smoothstep(-.03,-.008,tau);
  float al = mix(lipA*.92, body*mix(.5+.5*core, .62+.38*core, 1.-fine), aer)*(1.-smoothstep(.93,1.,tau)*.6);
  vec3 N = normalize(vFace+vec3((b-.5)*1.1,.25,(fil-.4)*.5)); if(dot(N,V)<0.) N = -N;
  vec3 amb = kitAmbient(); float ndl = dot(N,uSunDir)*.5+.5;
  float back = pow(clamp(dot(-V,uSunDir)*.5+.5,0.,1.),2.5);
  // thick strands are white and self-shadowed, thin spray lets the sun through
  vec3 lit = amb*(.62+.3*core)+uSunColor*(.04+.17*ndl*ndl*(.45+.55*core)+uGlowAmt*.26*back*(1.-.7*core));
  vec3 up = vec3(0.,1.,0.); float Fl = .03+.97*pow5(1.-max(V.y,0.));
  vec3 glass = mix(uTint*(amb*1.05+uSunColor*.12), kitSky(reflect(-V,up)), Fl);        // the lip is the feeding water bending over the brink
  vec3 col = mix(glass, mix(mix(uTint,uColor,.55),uColor,core)*lit*(.72+.28*core), aer);
  col += uSunColor*uSkyQ.z*uGlowAmt*pow(core,3.)*smoothstep(.55,.95,fil)*.3*ndl;       // sunlit sparkle on the thickest strands
  // spray veil: a wide soft curtain around the sheets
  float va = fbm2(vec2(x*.35+3., z*1.1))*fbm2(vec2(x*1.3, z*2.3+9.));
  float vAl = smoothstep(.1,.5,va)*(1.-smoothstep(.3,1.,vFall.z))*smoothstep(.03,.4,tau)*(1.-smoothstep(.85,1.,tau)*.5)*.3;
  vec3 vCol = uColor*(amb*.85+uSunColor*(.04+uGlowAmt*.26*back));
  col = mix(col, vCol, veil); al = mix(al, vAl, veil);
  gl_FragColor = vec4(col, clamp(al,0.,1.));
  #include <fog_fragment>
}`,ot=`
attribute vec4 aA, aB;  // aA = (x across, z out, phase, rate)  aB = (size, rise, drift, seed)
uniform float uTime, uRise, uOut, uHeight;
varying vec2 vQ; varying float vLife, vSeed, vKind, vHt; varying vec3 vWorld; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){
  float life = fract(uTime*aA.w+aA.z); vLife = life; vSeed = aB.w; vQ = position.xy; vKind = step(.5,aB.y);
  float e = 1.-(1.-life)*(1.-life);
  float sz = aB.x*(.45+.8*e), sy = sz*mix(1.5,1.,vKind);                    // the boil at the foot is drawn out upward
  // waterfall-local: x across, z outward. Boil hugs the foot, clouds billow up and out.
  vec3 c = vec3(aA.x*(1.+e*.7)+sin(uTime*.3+aB.w*20.)*e*1.4, -uHeight+uRise*aB.y*e+sy*.3, uOut+aA.y+e*aB.z);
  vHt = c.y+uHeight+position.y*sy;
  vec4 mvPosition = modelViewMatrix*vec4(c,1.); mvPosition.xy += position.xy*vec2(sz,sy);
  vWorld = (modelMatrix*vec4(c,1.)).xyz; gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,at=`
${Y}
uniform vec3 uColor; uniform float uOpacity, uRainbow, uGlowAmt, uCut;
varying vec2 vQ; varying float vLife, vSeed, vKind, vHt; varying vec3 vWorld;
${J}
void main(){
  float r = length(vQ); if(r>1.) discard;
  float n = fbm3(vQ*1.5+vSeed*37.+vec2(0.,-uTime*.18));
  float puff = 1.-smoothstep(.0,1.,r+(n-.42)*1.15);
  float al = puff*puff*sin(vLife*3.14159)*uOpacity*mix(1.5,.75,vKind)*smoothstep(-.2,uCut,vHt);       // dissolves into the pool instead of slicing it
  vec3 d = normalize(vWorld-cameraPosition);
  float back = pow(clamp(dot(d,uSunDir)*.5+.5,0.,1.),3.);
  vec3 col = uColor*(kitAmbient()*(.95+.3*n)+uSunColor*(.03+uGlowAmt*.1*back));       // lit by the sky: white, never sun-coloured mud
  // rainbow in the spray, 42 degrees around the antisolar point
  float th = acos(clamp(dot(d,-uSunDir),-1.,1.)); float k = (th-.733)/.034;
  vec3 bow = clamp(vec3(1.-abs(k-.65)*1.2, 1.-abs(k)*1.2, 1.-abs(k+.65)*1.2),0.,1.);
  col += bow*bow*uSunColor*uSkyQ.z*uRainbow*.4*step(0.,uSunDir.y);
  #ifdef USE_FOG
    col = mix(col, fogColor, kitFog());
  #endif
  gl_FragColor = vec4(col, al);
}`,it=`
${Y}
uniform vec3 uColor; varying vec3 vWorld; varying vec2 vUv; varying vec3 vFall;
${J}
void main(){
  vec2 q = vUv*2.-1.; float r = length(q*vec2(1.,1.25)-vec2(0.,-.1));
  float foot = length(cameraPosition-vWorld)*kitPix()*2.;
  vec2 fp = vWorld.xz-normalize(q+.001)*uTime*.8;                       // churned foam spreading from the impact
  float ring = .5+.5*sin(r*15.-uTime*2.4+vnoise(vWorld.xz*.5)*5.);
  float m = clamp(smoothstep(1.,.12,r)*(.55+.75*fbm2(fp*.35))+ring*.12*r,0.,1.);
  float fm = max(kitLace(fp*.5, m, foot*.5), kitLace(mat2(.8,.6,-.6,.8)*fp*1.6, m*.9, foot*1.6));
  vec3 col = uColor*(kitAmbient()*.9+uSunColor*(.05+.2*uSunDir.y))*(.8+.25*vnoise(fp*2.7));
  gl_FragColor = vec4(col, fm*(1.-smoothstep(.75,1.,r)));
  #include <fog_fragment>
}`;function St(e={}){const r=pe(e,"waterfall"),i=e.height??60,n=e.width??14,a=e.layers??3,f=e.launch??2.6,v=Ue(e.top,[0,i,0]),o=e.dir?e.dir.isVector3?e.dir:new t.Vector3(e.dir[0],0,e.dir.length>2?e.dir[2]:e.dir[1]):new t.Vector3(0,0,1),s=new t.Vector3(o.x,0,o.z).normalize(),l=ne(e),d=se(l),p=re(),h=12,y=e.rows??28,u=3,C=e.lipLength??3,V=[],N=[],E=[],T=[],S=[],c=Math.sqrt(2*i/de),_=[1,.6,.4,.5,.3],q=[0,-.2,.26,.33,-.36];for(let z=0;z<=a;z++){const g=z===a,P=n*.5*(g?1.7:_[z%5]),B=g?1.4:z*.55,$=g||z===0?0:q[z%5]*n*r.range(.7,1.2),O=V.length/3;for(let F=0;F<=y+u;F++){const j=F<u?(F-u)/u:0,X=F<u?j*.03:Math.pow((F-u)/y,1.35),le=Math.max(0,X)*i,te=Math.sqrt(2*le/de),Q=(F<u?j*C:f*te*(1+(g?.3:z*.16)))+(F<u?B*(1+j):B),ce=1+(g?.5:.3)*Math.max(0,X),he=X<=0?0:f/Math.max(.4,de*te);for(let m=0;m<=h;m++){const b=m/h*2-1,W=(1-b*b)*.6;V.push(b*P*ce+$,-le+(F<u?.04*(1+j):0),Q+W*(F<u?1+j:1)),N.push(0,he>0?Math.min(.6,he):1,X<=0?.2:1),E.push(b*P+$,X),T.push(X<0?j*C/3:te,g?9:z,Math.abs(b))}if(F<y+u)for(let m=0;m<h;m++){const b=O+F*(h+1)+m,W=b+h+1;S.push(b,W,b+1,b+1,W,W+1)}}}const A=new t.BufferGeometry;A.setAttribute("position",new t.Float32BufferAttribute(V,3)),A.setAttribute("normal",new t.Float32BufferAttribute(N,3)),A.setAttribute("uv",new t.Float32BufferAttribute(E,2)),A.setAttribute("aFall",new t.Float32BufferAttribute(T,3)),A.setIndex(S);const R={...p,...d,uColor:{value:M(e.color,"#eef6fb")},uTint:{value:M(e.tint,"#0f5464")},uSpeed:{value:e.speed??1},uGlowAmt:{value:e.glow??1},uDensity:{value:e.density??.5},uHeight:{value:i}},K=new t.ShaderMaterial({uniforms:R,vertexShader:Ve,fragmentShader:tt,fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide}),Z=new t.Mesh(A,K);Z.name="kit-waterfall-sheets",Z.renderOrder=2;const G=new t.Group;G.name="kit-waterfall",G.position.copy(v),G.rotation.y=Math.atan2(s.x,s.z),G.add(Z);const w=f*c,D=new t.Vector3(v.x+s.x*w,v.y-i,v.z+s.z*w);let k=null,I=null;if(e.pool!==!1){const z=n*(e.poolSize??1.5),g=new t.PlaneGeometry(z*2,z*2,1,1);g.rotateX(-Math.PI/2),g.setAttribute("aFall",new t.BufferAttribute(new Float32Array(12),3)),I=new t.Mesh(g,new t.ShaderMaterial({uniforms:{...p,...d,uTime:R.uTime,uColor:R.uColor},vertexShader:Ve,fragmentShader:it,fog:!0,transparent:!0,depthWrite:!1})),I.position.set(0,-i+(e.poolLift??.08),w+z*.2),I.renderOrder=1,I.name="kit-waterfall-pool",G.add(I)}if(e.mist!==!1){const z=e.mistCount??220,g=r.fork("mist"),P=me(z,($,O,F)=>{const j=$%5<3;O[0]=g.range(-.55,.55)*n,O[1]=g.range(-.12,.22)*n,O[2]=g(),O[3]=j?g.range(.2,.42):g.range(.035,.08),F[0]=n*(j?g.range(.13,.28):g.range(.3,.62)),F[1]=j?g.range(.05,.22):g.range(.5,1),F[2]=(j?g.range(0,.3):g.range(.3,1.5))*n,F[3]=g()}),B={...p,...d,uTime:R.uTime,uColor:{value:M(e.mistColor,"#eaf4fb")},uOpacity:{value:e.mistOpacity??.2},uRainbow:{value:e.rainbow??.5},uGlowAmt:R.uGlowAmt,uRise:{value:e.mistRise??Math.min(i*.45,n*2.2)},uOut:{value:w},uHeight:R.uHeight,uCut:{value:e.mistCut??n*.09}};k=new t.Mesh(P,new t.ShaderMaterial({uniforms:B,vertexShader:ot,fragmentShader:at,fog:!0,transparent:!0,depthWrite:!1})),k.frustumCulled=!1,k.renderOrder=3,k.name="kit-waterfall-mist",G.add(k)}return{object:G,sheets:Z,mist:k,pool:I,uniforms:R,light:l,base:D,top:v,height:i,setLight:(z,g)=>{l.set(z,g)},update(z,g){R.uTime.value=g}}}const Ge=`
uniform float uCausTime, uCausScale, uCausSurf, uCausInt, uCausFade; uniform vec3 uCausDir, uCausColor;
float kitCausLayer(vec2 uv, float t){ vec2 p = mod(uv*6.2831853,6.2831853)-250.; vec2 i = p; float c = 1.;
  for(int n=0;n<3;n++){ float tt = t*(1.-3.5/float(n+1)); i = p+vec2(cos(tt-i.x)+sin(tt+i.y), sin(tt-i.y)+cos(tt+i.x));
    c += 1./length(vec2(p.x/(sin(i.x+tt)/.005), p.y/(cos(i.y+tt)/.005))); }
  c = 1.17-pow(c/3.,1.4); return pow(abs(c),6.5); }
// light arriving at world point P with world normal N (zero above the surface)
vec3 kitCaustics(vec3 P, vec3 N){
  float depth = uCausSurf-P.y; if(depth<=0.) return vec3(0.);
  vec2 uv = (P.xz-uCausDir.xz/uCausDir.y*(P.y-uCausSurf))/uCausScale;
  float a = kitCausLayer(uv, uCausTime), b = kitCausLayer(uv*mat2(.8,.6,-.6,.8)*.73+.37, uCausTime*.83+4.);
  float c = min(a,b)*2.4+a*b*1.4+(a+b)*.07;                       // bright where the two nets cross: a web, not dapples
  float facing = clamp(dot(N,-uCausDir)*1.2+.25,0.,1.);
  vec3 tint = mix(uCausColor, vec3(1.), clamp(c*.5,0.,1.));
  return tint*c*uCausInt*facing*smoothstep(0.,1.5,depth)*exp(-depth*uCausFade);
}`,Ne=`
varying vec3 vWorld; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix*vec4(position,1.); vWorld = wp.xyz;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,nt=`
${Y}
uniform float uChop;
varying vec3 vWorld;
${J}
${De}
const mat2 R1 = mat2(.7986,.6018,-.6018,.7986), R2 = mat2(-.3256,.9455,-.9455,-.3256);
void main(){
  if(cameraPosition.y>vWorld.y) discard;
  vec3 D = vWorld-cameraPosition; float dist = length(D); D /= dist;
  vec2 p = vWorld.xz; float foot = dist*kitPix()/max(abs(D.y),.05);
  float l2 = smoothstep(.6,3.,2.7/foot), l3 = smoothstep(.6,3.,.9/foot), l4 = smoothstep(.6,3.,.3/foot);
  vec3 n1 = noised(R1*p*.11+uTime*vec2(.12,.07)), n2 = noised(R2*p*.37-uTime*vec2(.2,-.13)+n1.x*2.);
  vec3 n3 = noised(R1*p*1.1+uTime*vec2(-.3,.36)+n2.x*2.), n4 = noised(R2*p*3.3+uTime*vec2(.5,.4)+n3.x);
  vec2 sl = uChop*((n1.yz*R1)*.2+(n2.yz*R2)*.18*l2+(n3.yz*R1)*.13*l3+(n4.yz*R2)*.1*l4);
  vec3 N = normalize(vec3(sl.x,-1.,sl.y));
  float net = pow(1.-abs(n2.x*2.-1.),3.)*.6*l2+pow(1.-abs(n3.x*2.-1.),4.)*.5*l3;
  vec3 col = kitUnderside(D, N, dist, net);
  col = mix(col, uUwWater, max(smoothstep(0.,.8,kitFog()), 1.-smoothstep(0.,.09,abs(D.y))));          // no bright seam where the mirror meets the murk
  gl_FragColor = vec4(col,1.);
  #include <fog_fragment>
}`,rt=`
attribute vec4 aA, aB;  // aA = (x, z, length, width)  aB = (phase, rate, intensity, seed)
uniform float uTime, uRange, uSurf; uniform vec3 uRayDir;
varying vec2 vQ; varying float vI, vSeed; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){
  vec2 home = aA.xy+3.5*sin(uTime*.06+aB.w*vec2(40.,71.));                       // shafts wander slowly
  vec2 c = mod(home-cameraPosition.xz+uRange*.5,uRange)-uRange*.5;
  float along = position.y*.5+.5;
  vec3 top = vec3(c.x+cameraPosition.x,uSurf,c.y+cameraPosition.z);
  vec3 mid = top+uRayDir*aA.z*.5;
  vec3 side = normalize(cross(uRayDir, cameraPosition-mid));
  vec3 wp = top+uRayDir*(aA.z*along)+side*(position.x*aA.w*(.45+1.1*along));
  float dxz = length(c)/(uRange*.5);
  float flick = .6+.4*sin(uTime*aB.y+aB.x*6.2831)*sin(uTime*aB.y*.37+aB.w*40.);
  float near = smoothstep(1.5,10.,length(cross(cameraPosition-top,uRayDir)));
  vI = aB.z*flick*(1.-smoothstep(.6,1.,dxz))*near*smoothstep(0.,6.,uSurf-cameraPosition.y+4.);
  vQ = vec2(position.x,along); vSeed = aB.w;
  vec4 mvPosition = viewMatrix*vec4(wp,1.); gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,lt=`
${Y}
uniform vec3 uRayColor;
varying vec2 vQ; varying float vI, vSeed;
${J}
void main(){
  // two or three soft lobes that slide across the shaft, so no two shafts are the same bar
  float x = vQ.x, t = uTime;
  float a = (x-.42*sin(t*.31+vSeed*9.))/.34, b = (x+.5*cos(t*.23+vSeed*17.))/.2, c = (x-.6*sin(t*.17+vSeed*29.))/.13;
  float prof = (exp(-a*a)+.7*exp(-b*b)+.45*exp(-c*c)*step(.4,vSeed))*(1.-x*x)*(1.-x*x);
  float len = smoothstep(0.,.16,vQ.y)*pow(clamp(1.-vQ.y,0.,1.),2.4);                       // tops melt into the surface glow
  gl_FragColor = vec4(uRayColor*prof*len*vI*(1.-kitFog()),1.);
}`,st=`
attribute vec4 aA, aB;  // aA = (pos xyz, size)  aB = (drift xyz, seed)
uniform float uTime, uRange, uSurf;
varying vec2 vQ; varying float vI, vSeed; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){
  vec3 p = aA.xyz+aB.xyz*uTime; p.xz += .35*sin(uTime*.5+aB.w*vec2(31.,57.));
  vec3 c = mod(p-cameraPosition+uRange*.5,uRange)-uRange*.5; float d = length(c);
  vec3 w = c+cameraPosition;
  vec4 mvPosition = viewMatrix*vec4(w,1.); mvPosition.xy += position.xy*aA.w;
  vI = (1.-smoothstep(.3,.5,d/uRange))*smoothstep(.4,2.,d)*smoothstep(0.,.6,uSurf-w.y)*(.55+.45*sin(uTime*(1.+aB.w*2.)+aB.w*90.));
  vQ = position.xy; vSeed = aB.w;
  gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,ut=`
${Y}
uniform vec3 uSpeck, uSpeckGlow; uniform float uGlowFrac;
varying vec2 vQ; varying float vI, vSeed;
${J}
void main(){
  float r = dot(vQ,vQ); if(r>1.) discard;
  float core = exp(-r*5.);
  vec3 lit = uSpeck*(kitAmbient()*.8+uSunColor*.22);
  vec3 col = mix(lit, uSpeckGlow, step(1.-uGlowFrac,vSeed));
  gl_FragColor = vec4(col*core*vI*(1.-kitFog()),1.);
}`,ct=`
attribute vec4 aA, aB;  // aA = (source xyz, size)  aB = (phase, speed, wobble, seed)
uniform float uTime, uSurf;
varying vec2 vQ; varying float vI; varying vec3 vPixK;
#include <fog_pars_vertex>
void main(){
  float span = max(uSurf-aA.y,1.); float life = fract(uTime*aB.y/span+aB.x);
  float spread = .25+life*aB.z*2.2;
  vec3 w = aA.xyz+vec3(sin(uTime*2.1+aB.w*40.)*.18+cos(aB.w*17.)*spread, life*span, cos(uTime*1.7+aB.w*23.)*.18+sin(aB.w*29.)*spread);
  vec4 mvPosition = viewMatrix*vec4(w,1.); mvPosition.xy += position.xy*aA.w*(.6+.9*life);
  vI = smoothstep(0.,.04,life)*(1.-smoothstep(.93,1.,life));
  vQ = position.xy; gl_Position = projectionMatrix*mvPosition;
  ${oe}
  #include <fog_vertex>
}`,ft=`
${Y}
uniform vec3 uBubble;
varying vec2 vQ; varying float vI;
${J}
void main(){
  float r = length(vQ); if(r>1.) discard;
  float rim = smoothstep(.5,.95,r)*(1.-smoothstep(.95,1.,r));
  float hi = smoothstep(.34,.0,length(vQ-vec2(-.35,.42)))*1.8+smoothstep(.2,.0,length(vQ-vec2(.3,-.45)))*.5;
  vec3 col = uBubble*(kitAmbient()*.9+uSunColor*.35)*(rim*.9+hi+.07);
  gl_FragColor = vec4(col*vI*(1.-kitFog()),1.);
}`,dt=`
${Y}
${Ge}
varying vec3 vWorld;
${J}
void main(){ vec3 c = kitCaustics(vWorld, vec3(0.,1.,0.))*uSunColor*.3;
  gl_FragColor = vec4(c*(1.-kitFog()),1.); }`,vt=`
varying vec3 vRay; varying vec3 vPixK;
void main(){ gl_Position = vec4(position.xy,0.,1.);
  vec4 v = inverse(projectionMatrix)*vec4(position.xy,-1.,1.); vRay = transpose(mat3(viewMatrix))*(v.xyz/v.w);
  vPixK = vec3(position.y, 1., 1./projectionMatrix[1][1]); }`,mt=`
${Y}
uniform float uSurfH, uNearD; uniform vec3 uUwWater;
varying vec3 vRay;
void main(){
  vec3 d = normalize(vRay); float h = uSurfH-cameraPosition.y;
  float t = h/(abs(d.y)>1e-4 ? d.y : 1e-4);
  t *= 1.+.12*sin(d.x*23.+uTime*4.)*sin(d.z*31.-uTime*3.);
  if(t<=0.||t>uNearD*1.7) discard;
  float hit = 1.-smoothstep(uNearD*1.2,uNearD*1.7,t), rim = smoothstep(uNearD*.9,uNearD*1.4,t)*hit;
  // looking down into the water, or up at its underside: sky only inside Snell's window, the water volume elsewhere
  vec2 hp = cameraPosition.xz+d.xz*t; float rp = sin(hp.x*7.+uTime*2.1+sin(hp.y*5.-uTime*1.3)*1.4)*sin(hp.y*9.-uTime*1.7);
  vec3 col = mix(uUwWater*(1.05+.22*rp), kitSky(vec3(d.x,abs(d.y),d.z))*.75, h>0. ? smoothstep(.66,.8,d.y) : 0.);
  col += (kitAmbient()*.36+uSunColor*.05)*rim;
  gl_FragColor = vec4(col, hit*.96);
}`;function ht(e={}){const r=pe(e,"underwater"),i=e.ocean||null,n=e.surfaceY??(i?i.level:0),a=e.floorY??n-45,f=n-a,v=e.light==null&&e.sky==null&&i?i.light:ne(e),o=se(v),s=re(),l=M(e.water,"#0d7fa0"),d=M(e.deep,"#04283f"),p=Math.max(l.r,l.g,l.b,1e-4),h=l.r/p,y=l.g/p,u=l.b/p,C=new t.Color,V=new t.Color,N=new t.Vector3,E=new t.Color,T=new t.Color,S=new t.FogExp2(0,e.fogDensity??.013),c=new t.Color,_=e.caustics||{},q=_.intensity??2.4,A={uCausTime:{value:0},uCausScale:{value:_.scale??7},uCausSurf:{value:n},uCausInt:{value:q},uCausFade:{value:_.fade??.02},uCausDir:{value:N},uCausColor:{value:M(_.color,"#7fe8ff")}},R=()=>{const m=Te(v,l,d,e.minBrightness??.06,C,V),b=v.sunDir,W=Math.hypot(b.x,b.z),x=W/1.333,U=Math.sqrt(1-x*x);N.set(W>1e-5?-b.x/W*x:0,-U,W>1e-5?-b.z/W*x:0);const H=(Math.max(m,.35)*.75+ye(v.sunColor)*v.skyQ.z*.2)*(e.rayIntensity??1);E.setRGB((h*.7+.3)*H,(y*.7+.3)*H,(u*.7+.3)*H),T.setRGB(h*.88+.12,y*.88+.12,u*.88+.12),A.uCausInt.value=q*(.3+.7*Math.min(1,v.skyQ.z))*.8/Math.max(b.y,.35),S.color.copy(C),c.copy(C)},K=new t.Group;K.name="kit-underwater";const Z=e.radius??700;let G=null;const w={uUwWater:{value:C},uUwDeep:{value:V},uUwSunDisc:{value:e.sunDisc??1}};i?i.linkUnderwater(C,V,e.sunDisc??1):(G=new t.Mesh(ke(Z,20,40,5).geometry,new t.ShaderMaterial({uniforms:{...s,...o,...w,uChop:{value:e.chop??1}},vertexShader:Ne,fragmentShader:nt,fog:!0,side:t.DoubleSide})),G.position.y=n-.02,G.frustumCulled=!1,G.name="kit-underwater-surface",K.add(G));const D=(m,b,W,x,U)=>{const H=new t.Mesh(m,new t.ShaderMaterial({uniforms:{...s,...o,...x},vertexShader:b,fragmentShader:W,fog:!0,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}));return H.frustumCulled=!1,H.renderOrder=U,H.matrixAutoUpdate=!1,K.add(H),H},k=e.rays===!1?{count:0}:e.rays||{},I=k.range??260;let z=null;if((k.count??64)>0){const m=r.fork("rays"),b=me(k.count??64,(W,x,U)=>{x[0]=m.range(0,I),x[1]=m.range(0,I),x[2]=(k.length??Math.min(f*1.7,110))*m.range(.6,1),x[3]=(k.width??3.2)*m.range(.65,2.8),U[0]=m(),U[1]=m.range(.25,.8),U[2]=m.range(.3,1)*.5,U[3]=m()});z=D(b,rt,lt,{uRange:{value:I},uSurf:{value:n},uRayDir:{value:N},uRayColor:{value:E}},4),z.name="kit-underwater-rays"}const g=e.particles===!1?{count:0}:e.particles||{},P=g.range??44;let B=null;if((g.count??700)>0){const m=r.fork("particles"),b=me(g.count??700,(W,x,U)=>{x[0]=m.range(0,P),x[1]=m.range(0,P),x[2]=m.range(0,P),x[3]=(g.size??.05)*m.range(.4,1.8)*(m()<.05?1.7:1),U[0]=m.range(-.12,.12),U[1]=m.range(-.1,.02),U[2]=m.range(-.12,.12),U[3]=m()});B=D(b,st,ut,{uRange:{value:P},uSurf:{value:n},uSpeck:{value:M(g.color,"#cfeee6")},uSpeckGlow:{value:M(g.glowColor,"#5dffd0").multiplyScalar(g.glowIntensity??2.5)},uGlowFrac:{value:g.glowFraction??.12}},5),B.name="kit-underwater-particles"}const $=e.bubbles===!1?{count:0}:e.bubbles||{};let O=null;if(($.count??160)>0){const m=r.fork("bubbles"),b=($.sources||Array.from({length:$.columns??6},()=>[m.range(-50,50),a,m.range(-50,50)])).map(x=>x.isVector3?[x.x,x.y,x.z]:x),W=me($.count??160,(x,U,H)=>{const ae=b[x%b.length];U[0]=ae[0],U[1]=ae[1],U[2]=ae[2],U[3]=($.size??.12)*m.range(.4,1.7),H[0]=m(),H[1]=m.range(1.6,3.2),H[2]=m.range(.2,1),H[3]=m()});O=D(W,ct,ft,{uSurf:{value:n},uBubble:{value:M($.color,"#d8f6ff")}},6),O.name="kit-underwater-bubbles"}let F=null;if(e.floor){const m=e.floor.size??500,b=new t.PlaneGeometry(m,m);b.rotateX(-Math.PI/2),F=D(b,Ne,dt,A,1),F.position.y=(e.floor.y??a)+.05,F.name="kit-underwater-floor"}const j={...o,uSurfH:{value:n},uNearD:{value:.3},uUwWater:w.uUwWater},X=new t.Mesh(new t.PlaneGeometry(2,2),new t.ShaderMaterial({uniforms:j,vertexShader:vt,fragmentShader:mt,transparent:!0,depthTest:!1,depthWrite:!1,fog:!1}));X.frustumCulled=!1,X.renderOrder=50,X.visible=!1,X.name="kit-underwater-waterline",K.add(X),R();const le=m=>{const b=m.onBeforeCompile,W=m.customProgramCacheKey?m.customProgramCacheKey():"";return m.onBeforeCompile=(x,U)=>{b&&b.call(m,x,U),Object.assign(x.uniforms,A,{uKitSun:o.uSunColor,uKitAbsorb:{value:T},uKitAbsorbK:{value:e.absorption??.09}}),x.vertexShader=x.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vKitWorld;`).replace("#include <project_vertex>",`#include <project_vertex>
{ vec4 kw = vec4(transformed,1.);
#ifdef USE_INSTANCING
 kw = instanceMatrix*kw;
#endif
 vKitWorld = (modelMatrix*kw).xyz; }`),x.fragmentShader=x.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vKitWorld; uniform vec3 uKitSun, uKitAbsorb; uniform float uKitAbsorbK;
`+Ge).replace("#include <color_fragment>",`#include <color_fragment>
 diffuseColor.rgb *= mix(vec3(1.), uKitAbsorb, 1.-exp(-max(uCausSurf-vKitWorld.y,0.)*uKitAbsorbK));`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
 totalEmissiveRadiance += diffuseColor.rgb*uKitSun*.3183*kitCaustics(vKitWorld, inverseTransformDirection(normal, viewMatrix));`)},m.customProgramCacheKey=()=>W+"|kit-water-caustics",m.needsUpdate=!0,m},te=e.surfaceAt||(i?i.heightAt:()=>n),Q={captured:!1,hadFog:!1,color:new t.Color,density:0,near:1,far:1e3,background:null};let ce=0;const he=[z,B,O,F];return{object:K,surface:G,rays:z,particles:B,bubbles:O,floor:F,waterline:X,fog:S,background:c,volumeColor:C,causticUniforms:A,applyCaustics:le,surfaceY:n,surfaceAt:te,uniforms:o,light:v,rayDir:N,isSubmerged:m=>m.position.y<te(m.position.x,m.position.z,ce),applyTo(m,b,W={}){let x=m.fog;Q.captured||(Q.captured=!0,Q.hadFog=!!x,Q.background=m.background,x&&(Q.color.copy(x.color),Q.density=x.density??0,Q.near=x.near??1,Q.far=x.far??1e3));const U=te(b.position.x,b.position.z,ce),H=U-b.position.y,ae=we(0,.3,H),ge=H>0;if(Q.hadFog||(m.fog=ge?S:null,x=null),x)if(x.color.copy(W.color||Q.color).lerp(C,we(0,.06,H)),x.isFogExp2){const fe=W.density??Q.density;x.density=fe+(S.density-fe)*ae}else x.near=Q.near*(1-ae),x.far=Q.far+(3/S.density-Q.far)*ae;m.background=ge?c:W.background!==void 0?W.background:Q.background;for(const fe of he)fe&&(fe.visible=ae>0);G&&(G.visible=ae>0);const ze=b.near??.3;return X.visible=Math.abs(H)<ze*2.2,j.uSurfH.value=U,j.uNearD.value=ze,ge},setLight:(m,b)=>{v.set(m,b),R()},update(m,b,W){ce=b,o.uTime.value=b,j.uTime.value=b,A.uCausTime.value=b*(_.speed??.55),R(),W&&(G&&(G.position.x=W.position.x,G.position.z=W.position.z),F&&(F.position.x=W.position.x,F.position.z=W.position.z,F.updateMatrix()))}}}function kt(e={}){const r=ne(e),i=e.level??0,n=e.rng??Ce(Re("kit-water")),a=Qe({rng:n,...e.ocean||{},light:r,level:i}),f=ht({rng:n,...e.underwater||{},light:r,ocean:a,surfaceY:i}),v=new t.Group;v.name="kit-sea",v.add(a.object,f.object);const o=e.hideBelow||[],s={object:v,ocean:a,underwater:f,light:r,level:i,submerged:!1,heightAt:a.heightAt,normalAt:a.normalAt,applyCaustics:f.applyCaustics,setLight:(l,d)=>{r.set(l,d)},update(l,d,p,h){if(a.update(l,d,p),f.update(l,d,p),h&&p){s.submerged=f.applyTo(h,p,e.air);for(const y of o)y.visible=!s.submerged;a.spray&&(a.spray.visible=!s.submerged)}return s.submerged}};return s}export{wt as OCEAN_PRESET_NAMES,gt as WATER_LIGHTS,Je as makeIce,yt as makeLake,Qe as makeOcean,bt as makeRiver,kt as makeSea,ht as makeUnderwater,St as makeWaterfall,xt as oceanDepthAsync,Ie as waterLight};
