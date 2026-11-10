import*as i from"three";import{clamp as J,lerp as U,smoothstep as K,makeNoise as X}from"../core.js";const d=e=>e&&e.isColor?e.clone():new i.Color(e),Y=`
attribute vec3 aInfo;
uniform float uFogScale;
varying vec3 vW; varying vec3 vInfo;
#include <fog_pars_vertex>
void main() {
  vInfo = aInfo; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #ifdef USE_FOG
    vFogDepth = -mvPosition.z * uFogScale;
  #endif
}`,Z=`
uniform vec3 uNear, uHaze, uSunDir, uSunColor, uAmbient, uSnow, uRim;
uniform vec4 uP;      // haze of the nearest layer, haze of the farthest, extra haze pooled at the foot, snow line (0..1 of peak height)
uniform vec2 uQ;      // snow amount, rim amount
varying vec3 vW; varying vec3 vInfo;
#include <common>
#include <fog_pars_fragment>
void main() {
  vec3 n = normalize(cross(dFdx(vW), dFdy(vW))); if (n.y < 0.) n = -n;
  float l = max(dot(n, uSunDir), 0.);
  vec3 rock = uNear * (.8 + .4 * vInfo.z) * mix(.74, 1.14, clamp(vInfo.y, 0., 1.));      // darker foot, lighter crest: no flat cut-outs
  float sn = smoothstep(uP.w - .07, uP.w + .07, vInfo.y + (vInfo.z - .5) * .25 - (1. - n.y) * .15) * uQ.x;
  rock = mix(rock, uSnow * (.62 + .2 * vInfo.z), sn);                                       // lit snow lands near 0.75: never clipped
  vec3 c = min(rock * (uAmbient + uSunColor * l), vec3(.86));
  float hz = mix(uP.x, uP.y, vInfo.x);
  hz = mix(hz, 1., uP.z * exp(-max(vInfo.y, 0.) * 5.));
  c = mix(c, uHaze, clamp(hz, 0., 1.));
  // sun-side glow: ridges between the camera and a low sun pick up its colour
  vec3 v = normalize(vW - cameraPosition);
  c += uRim * uQ.y * pow(max(dot(v, uSunDir), 0.), 6.) * (.35 + .65 * hz);
  gl_FragColor = vec4(c, 1.);
  #include <fog_fragment>
}`;function ee(e={}){const{rng:b,layers:g=4,radius:k=[1500,3300],height:C=[150,520],base:B=-30,segments:h=280,jagged:D=.6,coverage:M=.75,follow:R=1}=e,_=e.fog&&e.fog.color?e.fog:null,G=[0,.24,.5,.78,1],c=e.noise||X(b?b.int(1,2147483646):11),t=5,S=(h+1)*t,I=new Float32Array(g*S*3),p=new Float32Array(g*S*3),F=[];for(let s=0;s<g;s++){const P=g>1?s/(g-1):0,z=U(k[0],k[1],P),A=U(C[0],C[1],P),a=17.3*s+(b?b.range(0,50):0),V=A*1.5,m=1.1+.5*s;for(let u=0;u<=h;u++){const l=u%h/h*Math.PI*2,n=Math.cos(l),r=Math.sin(l),x=K(-M,1-M,c.fbm2(n*.9+a,r*.9-a,2)+.15),y=1-Math.abs(c.fbm2(n*m*1.7+a,r*m*1.7+a,4,2.1,.55)),O=c.n2(n*m*9+a,r*m*9-a)+.45*c.n2(n*m*23-a,r*m*23+a),T=A*J((.22+.78*Math.pow(y,1.6))*(.3+.7*x)+D*.12*O,.05,1.2);for(let o=0;o<t;o++){const v=s*S+u*t+o,N=G[o],q=c.n2(n*23+o*7.7+a,r*23-o*3.1),W=c.n2(n*41-o*5.3,r*41+a+o),E=z-V*(1-N)*(1+.25*q*(o>0&&o<t-1?1:0))+(o===t-1?0:V*.12*W),Q=o===0?-A*.15:T*(N+(o<t-1?.13*W*D:0));I[v*3]=n*E,I[v*3+1]=Q,I[v*3+2]=r*E,p[v*3]=P,p[v*3+1]=Q/A,p[v*3+2]=.5+.5*c.n2(n*31+a+o*2.2,r*31+o*1.3)}}for(let u=0;u<h;u++)for(let l=0;l<t-1;l++){const n=s*S+u*t+l,r=n+t,x=n+1,y=r+1;u+l&1?F.push(n,r,y,n,y,x):F.push(n,r,x,r,y,x)}}const w=new i.BufferGeometry;w.setAttribute("position",new i.BufferAttribute(I,3)),w.setAttribute("aInfo",new i.BufferAttribute(p,3)),w.setIndex(F);const L=(e.sunDir?e.sunDir.isVector3?e.sunDir.clone():new i.Vector3().fromArray(e.sunDir):new i.Vector3(.4,.5,.3)).normalize(),j=i.UniformsUtils.merge([i.UniformsLib.fog,{uNear:{value:d(e.colorNear??"#35465a")},uHaze:{value:d(e.haze??(_?_.color:"#a9bdd3"))},uSunDir:{value:L},uSunColor:{value:d(e.sunColor??"#ffd9a8").multiplyScalar(e.sunIntensity??1)},uAmbient:{value:d(e.ambient??"#7f93b4")},uSnow:{value:d(e.snow&&e.snow!==!0?e.snow:"#d6dde9")},uRim:{value:d(e.sunColor??"#ffd9a8")},uP:{value:new i.Vector4(e.hazeNear??.35,e.hazeFar??.86,e.footHaze??.6,e.snowLine??.62)},uQ:{value:new i.Vector2(e.snow?1:0,e.rim??.5)},uFogScale:{value:e.fogScale??.25}}]),H=new i.ShaderMaterial({uniforms:j,vertexShader:Y,fragmentShader:Z,fog:e.fog===!0||!!e.sceneFog,side:i.DoubleSide}),f=new i.Mesh(w,H);return f.name="horizonRidges",f.frustumCulled=!1,f.position.y=B,{object:f,geometry:w,material:H,uniforms:j,triangles:F.length/3,update(s,P,z){z&&(f.position.x=z.position.x*R,f.position.z=z.position.z*R)}}}export{ee as makeHorizonRidges};
