import*as a from"three";import*as T from"../kit/fx.js";const fe={hex:"#ffb45a",lin:[1,.456,.103]},ae=`
#ifndef ONE_FIRE_GLSL
#define ONE_FIRE_GLSL
const vec3 FIRE_GOLD = vec3(1., .456, .103);
const vec3 FIRE_EMBER = vec3(1., .15, .03);
// the breathing of one fire: the seed gives each its own rhythm; about 0.72 to 1.14
float fireBreath(float seed, float t){
  float a = sin(t*6.1 + seed*40.), b = sin(t*9.7 + seed*71.3), c = sin(t*1.7 + seed*13.1);
  return .92 + .07*a*b + .09*c + .04*sin(t*17.3 + seed*5.);
}
// colour of the fire at heat 0 (ember) .. 1 (gold) .. 2 (white-gold core)
vec3 fireColor(float heat){
  vec3 c = mix(FIRE_EMBER, FIRE_GOLD, clamp(heat, 0., 1.));
  return mix(c, vec3(1., .74, .42), clamp(heat - 1., 0., 1.));
}
// halo of one light on a sprite: r = 0 at the centre .. 1 at the edge
float fireHalo(float r){ r = clamp(r, 0., 1.); float e = 1. - r; return exp(-r*r*26.) + .2*e*e*e; }
#endif
`,de=`
#ifndef LAMP_ROUNDS_GLSL
#define LAMP_ROUNDS_GLSL
uniform vec3 uRoundNow, uRoundT;
float lampAlight(float c, float t){
  if (c < 0.) return 1.;
  float k = floor(c), at = (c - k)/.99, rd = floor(k/64.), burn = (k - rd*64.)/63.;
  float now = rd < .5 ? uRoundNow.x : (rd < 1.5 ? uRoundNow.y : uRoundNow.z), per = rd < .5 ? uRoundT.x : (rd < 1.5 ? uRoundT.y : uRoundT.z);
  float age = fract(now - at + 1.), lit = age*per, left = (burn - age)*per;
  float gut = 1. - smoothstep(0., 4., left), flick = .55 + .45*sin(t*31. + at*90.)*sin(t*13. + at*40.);
  return smoothstep(0., .7, lit)*step(0., left)*mix(1., flick*smoothstep(0., 1.2, left), gut);
}
#endif
`,D=s=>{const r=new a.Color(s);return[r.r,r.g,r.b]};function ve(s,r={}){const f=s.length,c=new a.InstancedBufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),c.setIndex([0,1,2,0,2,3]);const y=new Float32Array(Math.max(1,f)*3),d=new Float32Array(Math.max(1,f)*4),x=new Float32Array(Math.max(1,f));for(let v=0;v<f;v++){const i=s[v];y.set(i.p,v*3),d.set([i.size??1,i.level??2,i.seed??v*.6180339%1,i.lamp??-1e6],v*4),x[v]=i.heat??1}const M=new a.InstancedBufferAttribute(y,3),_=new a.InstancedBufferAttribute(d,4);c.setAttribute("aPos",M),c.setAttribute("aPar",_),c.setAttribute("aHeat",new a.InstancedBufferAttribute(x,1)),c.instanceCount=f;const B={...T.fogUniforms(),uTime:{value:0},uRoundNow:r.rounds?.uRoundNow??{value:new a.Vector3},uRoundT:r.rounds?.uRoundT??{value:new a.Vector3(1,1,1)},uBias:{value:r.bias??.3},uFog:{value:r.fog??.7},uGain:{value:r.gain??1}},p=new a.ShaderMaterial({uniforms:B,fog:!0,transparent:!0,depthWrite:!1,depthTest:r.depthTest!==!1,blending:r.over?a.CustomBlending:a.AdditiveBlending,...r.over?{blendEquation:a.MaxEquation,blendSrc:a.OneFactor,blendDst:a.OneFactor}:{},vertexShader:ae+de+T.GLSL_FOG_PARS_VERT+`
attribute vec3 aPos; attribute vec4 aPar; attribute float aHeat;
uniform float uTime, uBias;
varying vec2 vUv; varying float vK, vHeat;
void main(){
  vec4 mvPosition = modelViewMatrix*vec4(aPos, 1.);
  float dist = max(-mvPosition.z, .01);
  // a halo is aPar.x metres across the world at every distance: it never grows as the eye draws off
  float s = aPar.x;
  float on = lampAlight(aPar.w, uTime);
  vK = aPar.y*on*fireBreath(aPar.z, uTime);
  vHeat = aHeat; vUv = position.xy;
  mvPosition.xy += position.xy*s;
  mvPosition.z += min(uBias*aPar.x, dist*.4);
  gl_Position = projectionMatrix*mvPosition;
  ${T.GLSL_FOG_VERT}
}`,fragmentShader:ae+T.GLSL_FOG_PARS_FRAG+`
uniform float uFog, uGain; varying vec2 vUv; varying float vK, vHeat;
void main(){
  float r = length(vUv);
  float h = fireHalo(r)*(1. - smoothstep(.82, 1., r));
  vec3 col = fireColor(vHeat + .9*exp(-r*r*40.))*h*vK*uGain;
  gl_FragColor = vec4(col*(1. - uFog*fxFog()), 1.);
}`}),h=new a.Mesh(c,p);return h.frustumCulled=!1,h.renderOrder=r.renderOrder??5,{mesh:h,uniforms:B,count:f,setPosition(v,i,t,e){y[v*3]=i,y[v*3+1]=t,y[v*3+2]=e,M.needsUpdate=!0},setLevel(v,i){d[v*4+1]=i,_.needsUpdate=!0}}}function he(s,r={}){const f=r.rng,c=[];for(const p of s){const h=p.puffs??14,v=new a.Vector3(...p.dir).normalize(),i=new a.Vector3(...p.across??[v.z,0,-v.x]);i.lengthSq()<1e-6&&i.set(1,0,0),i.normalize();const t=new a.Vector3().crossVectors(v,i).normalize();for(let e=0;e<h;e++){const o=p.speed*f.range(.5,1),n=(f()*2-1)*(p.spread??.4)*p.speed,l=(f()*2-1)*(p.spread??.4)*p.speed*.3;c.push({org:[p.p[0]+i.x*n*.12,p.p[1],p.p[2]+i.z*n*.12],vel:[v.x*o+i.x*n+t.x*l,v.y*o+i.y*n+t.y*l,v.z*o+i.z*n+t.z*l],par:[p.period,(p.offset??0)-f.range(0,p.stagger??.4),p.life??2.4,(p.size??3)*f.range(.6,1.25)],seed:[f(),p.warm??0]})}}const y=c.length,d=new a.InstancedBufferGeometry;d.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]);const x=(p,h)=>{const v=new Float32Array(Math.max(1,y)*h);return c.forEach((i,t)=>v.set(i[p],t*h)),new a.InstancedBufferAttribute(v,h)};d.setAttribute("aOrg",x("org",3)),d.setAttribute("aVel",x("vel",3)),d.setAttribute("aPar",x("par",4)),d.setAttribute("aSeed",x("seed",2)),d.instanceCount=y;const M={...T.fogUniforms(),uTime:{value:0},uLit:{value:new a.Color(r.lit??"#dde5f2")},uShade:{value:new a.Color(r.shade??"#6f7f9e")},uOpacity:{value:r.opacity??.85},uGravity:{value:r.gravity??7.5},uWind:{value:new a.Vector3(...r.wind??[0,0,0])},uWarm:{value:r.warm??1},uStretch:{value:r.stretch??.9}},_=new a.ShaderMaterial({uniforms:M,fog:!0,transparent:!0,depthWrite:!1,blending:a.CustomBlending,blendSrc:a.OneFactor,blendDst:a.OneMinusSrcAlphaFactor,vertexShader:T.GLSL_FOG_PARS_VERT+`
attribute vec3 aOrg, aVel; attribute vec4 aPar; attribute vec2 aSeed;
uniform float uTime, uGravity, uStretch; uniform vec3 uWind;
varying vec2 vUv; varying vec4 vInfo;
void main(){
  float period = max(aPar.x, .01), life = max(aPar.z, .01);
  float age = fract((uTime + aPar.y)/period)*period;
  float k = age/life;
  float alive = step(k, 1.);
  vec3 p = aOrg + aVel*age + vec3(0., -.5*uGravity*age*age, 0.) + uWind*age*age*.5;
  float s = aPar.w*(.3 + .7*sqrt(clamp(k, 0., 1.)))*alive;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  float lens = smoothstep(.6, 2.5, length(mvPosition.xyz));
  vec2 vd = (modelViewMatrix*vec4(aVel + vec3(0., -uGravity*age, 0.) + uWind*age, 0.)).xy;
  float vl = length(vd);
  vec2 along = mix(vec2(0., 1.), vd/max(vl, 1e-3), step(1e-3, vl));
  float st = 1. + uStretch*clamp(vl*.09, 0., 1.5);
  mvPosition.xy += (vec2(along.y, -along.x)*position.x + along*(position.y*st))*s;
  vUv = position.xy;
  // (a puff is a medium, so the one lens law: none of it is drawn large in the lens)
  vInfo = vec4(smoothstep(0., .1, k)*(1. - smoothstep(.45, 1., k))*alive*lens, aSeed.x, aSeed.y, age);
  gl_Position = projectionMatrix*mvPosition;
  ${T.GLSL_FOG_VERT}
}`,fragmentShader:ae+T.GLSL_HASH+T.GLSL_VALUE_NOISE+T.GLSL_FOG_PARS_FRAG+`
uniform vec3 uLit, uShade; uniform float uOpacity, uWarm;
varying vec2 vUv; varying vec4 vInfo;
void main(){
  float r = length(vUv);
  vec2 q = vUv*vec2(2.6, 1.7) + vInfo.y*37. + vec2(0., -vInfo.w*.7);
  float n = vnoise(q)*.5 + vnoise(q*2.9 + 5.)*.3 + vnoise(q*7.1 + 11.)*.2;
  float a = (1. - smoothstep(.1, 1., r + (n - .5)*1.25))*smoothstep(.22, .62, n + .25*(1. - r))*vInfo.x*uOpacity;
  float up = clamp(vUv.y*.5 + .5 + (n - .5)*.5, 0., 1.);
  vec3 col = mix(uShade, uLit, up*.8 + .2*n);
  col += fireColor(1.)*vInfo.z*uWarm*(.35 + .4*n);
  col = fxApplyFog(col);
  gl_FragColor = vec4(col*a, a);
}`}),B=new a.Mesh(d,_);return B.frustumCulled=!1,B.renderOrder=r.renderOrder??3,{mesh:B,uniforms:M,count:y}}function me(){let s=4096,r=0,f=new Float32Array(s*3),c=new Float32Array(s*3),y=new Float32Array(s*3),d=new Float32Array(s*4);const x=[1e9,1e9,1e9],M=[-1e9,-1e9,-1e9],_=(t,e)=>{const o=new Float32Array(s*e);return o.set(t),o},B=()=>{s*=2,f=_(f,3),c=_(c,3),y=_(y,3),d=_(d,4)},p=new a.Vector3,h=new a.Vector3,v=new a.Vector3,i={count:()=>r/3,vert(t,e,o,n){r===s&&B();const l=r*3,u=r*4,m=t[0],g=t[1],S=t[2];f[l]=m,f[l+1]=g,f[l+2]=S,c[l]=e[0],c[l+1]=e[1],c[l+2]=e[2],y[l]=o[0],y[l+1]=o[1],y[l+2]=o[2],d[u]=n[0],d[u+1]=n[1],d[u+2]=n[2],d[u+3]=n[3],m<x[0]&&(x[0]=m),g<x[1]&&(x[1]=g),S<x[2]&&(x[2]=S),m>M[0]&&(M[0]=m),g>M[1]&&(M[1]=g),S>M[2]&&(M[2]=S),r++},tri(t,e,o,n,l=[0,0,0,0],u,m,g){u||(p.set(e[0]-t[0],e[1]-t[1],e[2]-t[2]),h.set(o[0]-t[0],o[1]-t[1],o[2]-t[2]),v.crossVectors(p,h).normalize(),u=m=g=[v.x,v.y,v.z]),i.vert(t,u,n,l),i.vert(e,m,n,l),i.vert(o,g,n,l)},quad(t,e,o,n,l,u=[0,0,0,0]){i.tri(t,e,o,l,u),i.tri(t,o,n,l,u)},quad4(t,e,o){p.set(t[1][0]-t[0][0],t[1][1]-t[0][1],t[1][2]-t[0][2]),h.set(t[2][0]-t[0][0],t[2][1]-t[0][1],t[2][2]-t[0][2]),v.crossVectors(p,h).normalize();const n=[v.x,v.y,v.z];for(const l of[0,1,2,0,2,3])i.vert(t[l],n,e[l],o?o[l]:[0,0,0,0])},box(t,e,o,n,l,u,m,g={}){const S=Math.cos(g.yaw??0),L=Math.sin(g.yaw??0),w=g.aux??[0,0,0,0],A=(k,z,U)=>[t+k*S+U*L,z,o-k*L+U*S],F=A(-n,e,u),P=A(n,e,u),R=A(n,e,-u),C=A(-n,e,-u),E=A(-n,l,u),O=A(n,l,u),K=A(n,l,-u),b=A(-n,l,-u);i.quad(F,P,O,E,m,w),i.quad(P,R,K,O,m,w),i.quad(R,C,b,K,m,w),i.quad(C,F,E,b,m,w),g.skip!=="top"&&i.quad(E,O,K,b,g.top??m,g.auxTop??w),g.bottom&&i.quad(C,R,P,F,m,w)},lathe(t,e,o,n,l,u){for(let m=0;m<o.length-1;m++){const[g,S]=o[m],[L,w]=o[m+1],A=w-S,F=L-g,P=Math.hypot(A,F)||1,R=-F/P,C=A/P;for(let E=0;E<n;E++){const O=E/n*Math.PI*2,K=(E+1)/n*Math.PI*2,b=Math.cos(O),k=Math.sin(O),z=Math.cos(K),U=Math.sin(K),Q=[t+b*g,S,e+k*g],J=[t+z*g,S,e+U*g],ie=[t+b*L,w,e+k*L],ee=[t+z*L,w,e+U*L],te=[b*C,R,k*C],N=[z*C,R,U*C],j=l(m,E,0),q=l(m,E,1),$=u?u(m,E,0):[0,0,0,0],X=u?u(m,E,1):$;i.vert(Q,te,j,$),i.vert(ie,te,q,X),i.vert(ee,N,q,X),i.vert(Q,te,j,$),i.vert(ee,N,q,X),i.vert(J,N,j,$)}}},tube(t,e,o,n,l,u,m=[0,0,0,0]){p.set(e[0]-t[0],e[1]-t[1],e[2]-t[2]).normalize(),h.set(Math.abs(p.y)>.9?1:0,Math.abs(p.y)>.9?0:1,0),v.crossVectors(p,h).normalize(),h.crossVectors(v,p).normalize();const g=[v.x,v.y,v.z],S=[h.x,h.y,h.z];for(let L=0;L<l;L++){const w=L/l*Math.PI*2,A=(L+1)/l*Math.PI*2,F=[g[0]*Math.cos(w)+S[0]*Math.sin(w),g[1]*Math.cos(w)+S[1]*Math.sin(w),g[2]*Math.cos(w)+S[2]*Math.sin(w)],P=[g[0]*Math.cos(A)+S[0]*Math.sin(A),g[1]*Math.cos(A)+S[1]*Math.sin(A),g[2]*Math.cos(A)+S[2]*Math.sin(A)],R=[t[0]+F[0]*o,t[1]+F[1]*o,t[2]+F[2]*o],C=[t[0]+P[0]*o,t[1]+P[1]*o,t[2]+P[2]*o],E=[e[0]+F[0]*n,e[1]+F[1]*n,e[2]+F[2]*n],O=[e[0]+P[0]*n,e[1]+P[1]*n,e[2]+P[2]*n];i.vert(R,F,u,m),i.vert(C,P,u,m),i.vert(O,P,u,m),i.vert(R,F,u,m),i.vert(O,P,u,m),i.vert(E,F,u,m)}},add(t,e,o=[0,0,0,0],n=1){const l=t.getAttribute("position"),u=t.getAttribute("normal"),m=t.getAttribute("color"),g=t.index,S=new a.Matrix3().getNormalMatrix(e),L=g?g.count:l.count,w=[0,0,0],A=[0,0,0],F=[0,0,0];for(let P=0;P<L;P++){const R=g?g.getX(P):P;p.fromBufferAttribute(l,R).applyMatrix4(e),h.fromBufferAttribute(u,R).applyMatrix3(S).normalize(),A[0]=p.x,A[1]=p.y,A[2]=p.z,F[0]=h.x,F[1]=h.y,F[2]=h.z,m?(w[0]=m.getX(R)*n,w[1]=m.getY(R)*n,w[2]=m.getZ(R)*n):w[0]=w[1]=w[2]=n,i.vert(A,F,w,o)}},toGeometry(){const t=new a.BufferGeometry;return t.setAttribute("position",new a.BufferAttribute(f.slice(0,r*3),3)),t.setAttribute("normal",new a.BufferAttribute(c.slice(0,r*3),3)),t.setAttribute("color",new a.BufferAttribute(y.slice(0,r*3),3)),t.setAttribute("aux",new a.BufferAttribute(d.slice(0,r*4),4)),r?t.boundingSphere=new a.Sphere(new a.Vector3((x[0]+M[0])/2,(x[1]+M[1])/2,(x[2]+M[2])/2),Math.hypot(M[0]-x[0],M[1]-x[1],M[2]-x[2])/2):t.computeBoundingSphere(),t}};return i}const I={w:.45,h:1.4,deep:1.7,back:1.1,backH:1.7,y:15.5},H={wide:[.42,.5],deep:[.82,.7],share:.4};function pe(){const s=c=>{let y=0;for(let d=0;d<64;d++){const x=(d+.5)/32-1;y+=(1-c*H.deep[0]*Math.exp(-((x/H.wide[0])**2)))*(1-c*H.deep[1]*Math.exp(-((x/H.wide[1])**2)))}return 1-y/64};let r=0,f=1;if(s(1)>H.share)for(let c=0;c<24;c++){const y=(r+f)/2;s(y)>H.share?f=y:r=y}else r=1;return[H.deep[0]*r,H.deep[1]*r]}function ge(s){const r=new a.MeshStandardMaterial({vertexColors:!0,roughness:.78,metalness:0});return r.onBeforeCompile=f=>{Object.assign(f.uniforms,s),f.vertexShader=f.vertexShader.replace("#include <common>",`#include <common>
attribute vec4 aux; varying vec4 vAux; varying vec3 vObj, vRay;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vAux = aux; vObj = position; vRay = position - (inverse(modelMatrix)*vec4(cameraPosition, 1.)).xyz;`),f.fragmentShader=f.fragmentShader.replace("#include <common>",`#include <common>
`+ae+T.GLSL_HASH+T.GLSL_VALUE_NOISE+`
varying vec4 vAux; varying vec3 vObj, vRay; uniform float uTime, uSlit, uBeamAng, uFireSeed; uniform vec4 uKeep; uniform vec3 uBeamCol; float towerWet = 0.;
// THE KEEPERS' SLIT, painted in depth on the one face that closes its mouth (SLIT: the opening's half width and half
// height at the wall's outer face, how deep it runs through the stone, its half width and half height at the back).
// A ray from the eye through a point of the mouth meets a cheek, the sill, the head, or the back; the back is the
// fire's glow, crossed now and then by the shadow of one keeper or the other on clocks of their own (uKeep: x, y where
// in his to and fro each stands at the clock's zero, dealt; z, w how deep each shadow is, set so that both standing
// mid-slit together put out no more than KEEPERS.share of the glow: see keeperShades); the keepers themselves are
// never seen; cheeks, sill and head are stone lit by that fire, brighter the deeper they lie.
vec3 slitLight(vec2 o, vec3 rd) {
  const float W0 = ${(I.w/2).toFixed(3)}, H0 = ${(I.h/2).toFixed(3)}, D = ${I.deep.toFixed(2)}, KW = ${((I.back/2-I.w/2)/I.deep).toFixed(4)}, KH = ${((I.backH/2-I.h/2)/I.deep).toFixed(4)};
  vec2 sl = rd.zy/max(-rd.x, 1e-3);
  float sz = sl.x > KW ? (W0 - o.x)/max(sl.x - KW, 1e-4) : (sl.x < -KW ? (-W0 - o.x)/min(sl.x + KW, -1e-4) : 1e3);
  float sy = sl.y > KH ? (H0 - o.y)/max(sl.y - KH, 1e-4) : (sl.y < -KH ? (-H0 - o.y)/min(sl.y + KH, -1e-4) : 1e3);
  float sd = min(sz, sy), breath = fireBreath(uFireSeed, uTime);
  if (sd >= D) {
    vec2 b = (o + sl*D)/vec2(W0 + KW*D, H0 + KH*D);
    float k1 = (b.x - 1.9*sin(uTime*.19 + uKeep.x))/${H.wide[0].toFixed(2)}, k2 = (b.x - 2.3*sin(uTime*.13 + uKeep.y))/${H.wide[1].toFixed(2)};
    float shade = (1. - uKeep.z*exp(-k1*k1))*(1. - uKeep.w*exp(-k2*k2));
    return fireColor(1.25 + .5*(1. - dot(b, b)*.5))*uSlit*breath*shade*(1. - .35*smoothstep(-.2, 1., -b.y));
  }
  float k = clamp(sd/D, 0., 1.), course = hash11(floor((o.y + sl.y*sd)/.31) + floor(sd/.55)*7.);
  return fireColor(.75)*uSlit*breath*.3*k*k*(.7 + .5*course)*(1. - .5*smoothstep(.0, .03, abs(fract((o.y + sl.y*sd)/.31) - .5) - .46));
}`).replace("#include <color_fragment>",`#include <color_fragment>
if (vAux.x > .5) {
  vec2 rd = vObj.xz; rd.x += step(dot(rd, rd), 1e-6)*1e-2; rd = normalize(rd);
  float ang = atan(rd.y, rd.x);
  float row = vObj.y/.62, ri = floor(row), rf = fract(row);
  float cu = fract(ang/6.2831853 + .5*mod(ri, 2.)/22. + hash11(ri*.37 + 3.)*.02)*22., ci = floor(cu), cf = fract(cu);
  float joint = max(1. - smoothstep(0., .07, min(rf, 1. - rf)), 1. - smoothstep(0., .045, min(cf, 1. - cf)));
  float tone = hash12(vec2(ri, ci) + 7.);
  diffuseColor.rgb *= (.8 + .34*tone)*(1. - .5*joint);
  float streak = vnoise(vec3(rd.x*3.5, vObj.y*.3, rd.y*3.5)) + .5*vnoise(vec3(rd.x*11., vObj.y*.9, rd.y*11.));
  towerWet = clamp(1.05 - (vObj.y - 4.)/15. + (streak - .75)*.7, 0., 1.);
  diffuseColor.rgb *= mix(1., .5, towerWet);
  float slime = clamp(1. - (vObj.y - 1.4)/3.4 + (streak - .9)*.9, 0., 1.);
  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(.028, .04, .03), slime*.75);
}`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, .3, towerWet);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
if (vAux.y > 2.5) totalEmissiveRadiance += slitLight(vec2(vObj.z, vObj.y - ${I.y.toFixed(2)}), normalize(vRay));
else if (vAux.y > .5 && vAux.y < 1.5) totalEmissiveRadiance += fireColor(vAux.w)*uSlit*fireBreath(uFireSeed, uTime);
else if (vAux.y > 1.5) {
  vec2 d = normalize(vObj.xz + vec2(1e-4, 0.));
  float f = abs(d.x*cos(uBeamAng) + d.y*sin(uBeamAng)), f2 = f*f;
  totalEmissiveRadiance += uBeamCol*vAux.w*(.35 + 2.6*f2*f2*f2*f2);
}`)},r.customProgramCacheKey=()=>"lidp-tower-3",r}function we(s,r,f){const c=D("#8a9098"),y=D("#5d636c"),d=D("#15181d"),x=D("#cdd7e6"),M=D("#06070a"),_=[1,0,0,0],B=[0,0,0,0],p=1.1,h=7,v=25.2,i=4.25,t=2.75,e=b=>b<h?i+.62*Math.pow(1-(b-p)/(h-p),2.2):i+(t-i)*(b-h)/(v-h),o=[];for(let b=0;b<=5;b++){const k=p+(h-p)*b/5;o.push([e(k),k])}for(let b=1;b<=22;b++){const k=h+(v-h)*b/22;o.push([e(k),k])}const n=o.map(()=>r.range(.94,1.06));s.lathe(0,0,o,40,(b,k,z)=>c.map(U=>U*n[b+z]),()=>_),s.lathe(0,0,[[t,v],[3,25.62],[3.6,26],[3.6,26.25],[1.95,26.25],[1.95,27.3],[1.8,27.36]],40,()=>y,()=>_),s.lathe(0,0,[[1.8,27.36],[1.8,29.7]],16,()=>x,()=>[0,2,0,1]),s.lathe(0,0,[[1.8,29.7],[2.18,29.82],[2.18,29.98],[.3,31.3],[.44,31.52],[.3,31.76],[.04,32]],16,()=>d,()=>B);for(let b=0;b<16;b++){const k=b/16*Math.PI*2;s.box(Math.cos(k)*1.82,27.36,Math.sin(k)*1.82,.045,29.7,.045,d,{yaw:-k,skip:"top"})}s.lathe(0,0,[[1.83,28.5],[1.83,28.58]],16,()=>d,()=>B);for(let b=0;b<24;b++){const k=(b+.5)/24*Math.PI*2;s.box(Math.cos(k)*3.48,26.25,Math.sin(k)*3.48,.04,27.32,.04,d,{yaw:-k,skip:"top"})}for(const b of[26.8,27.3])s.lathe(0,0,[[3.5,b],[3.5,b+.07]],24,()=>d,()=>B),s.lathe(0,0,[[3.46,b+.07],[3.46,b]],24,()=>d,()=>B);const l=I.y,u=e(l),m=u+.16,g=I.w/2,S=I.h/2;s.box(u-.2,l-S-.34,0,.36,l+S+.34,g+.3,c.map(b=>b*1.12),{aux:_}),s.quad([m+.006,l-S,g],[m+.006,l-S,-g],[m+.006,l+S,-g],[m+.006,l+S,g],[.004,.004,.004],[0,3,0,1]);const L=e(5.4);s.box(0,4.1,-L+.12,.8,6.6,.3,c.map(b=>b*1.1),{aux:_}),s.box(0,4.2,-L-.2,.5,6.2,.03,M,{});const w={margin:.7,step:1.2,rise:[h+1,v-2.5]},A=Math.PI*2-2*w.margin,F=w.margin+f()*A,P=f(),R=[f(),f()],C=Math.max(F-w.step-w.margin,0),E=Math.max(w.margin+A-F-w.step,0),O=P*(C+E),K=O<C?w.margin+O:F+w.step+(O-C);for(const[b,k]of[[F,w.rise[0]+(w.rise[1]-w.rise[0])*R[0]],[K,w.rise[0]+(w.rise[1]-w.rise[0])*R[1]]]){const z=e(k);s.box(Math.cos(b)*(z-.1),k-.6,Math.sin(b)*(z-.1),.2,k+.6,.3,c.map(U=>U*1.1),{yaw:-b,aux:_}),s.box(Math.cos(b)*(z+.105),k-.42,Math.sin(b)*(z+.105),.01,k+.42,.14,M,{yaw:-b})}return{slit:[m+.3,l,0],lantern:[0,28.5,0],rAt:e,top:32,foot:p}}const ne={ledge:1.75,back:.6,bed:.3};function be(s){return(r,f)=>{const c=Math.hypot(r/15.5,f/7.8)+.16*s.n2(r*.13+4.1,f*.13-2.7),y=Math.hypot(r,f);let d=ne.back*(1-W(.2,1.02,c))+.3*(1-W(0,.5,c));d+=(.36*Math.abs(s.n2(r*.33,f*.33))+.14*s.n2(r*.9+9,f*.9))*(.35+.65*W(.25,.7,c)),d-=2.6*W(.82,1.2,c),d+=(ne.ledge-d)*(1-W(4.6,7.4,y+.9*s.n2(r*.5-3,f*.5+6)));const x=d/ne.bed,M=x-Math.floor(x);return ne.bed*(Math.floor(x)+W(.62,.96,M))}}const W=(s,r,f)=>{const c=Math.min(1,Math.max(0,(f-s)/(r-s)));return c*c*(3-2*c)};function ye(s,r,f){const c=D("#30353e"),y=D("#1c2027"),d=D("#3a2c16"),x=-18.9,M=-10.5,_=.63,B=60,p=34,h=(e,o)=>{const n=x+e*_,l=M+o*_;return[n,r(n,l),l]},v=e=>{const n=r(e[0]+.35,e[2])-r(e[0]-.35,e[2]),l=r(e[0],e[2]+.35)-r(e[0],e[2]-.35),u=Math.hypot(n,2*.35,l);return[-n/u,2*.35/u,-l/u]},i=e=>{const o=.5+.5*f.n2(e[0]*.45+31,e[2]*.45+17),n=W(1.5,.3,e[1])*W(.25,.7,.5+.5*f.n2(e[0]*.22-8,e[2]*.22+5)),l=[0,1,2].map(u=>y[u]+(c[u]-y[u])*o);return[0,1,2].map(u=>l[u]+(d[u]-l[u])*n*.8)},t=e=>[0,0,W(2.4,.9,e[1])*.9+.1,0];for(let e=0;e<p;e++)for(let o=0;o<B;o++){const n=h(o,e),l=h(o+1,e),u=h(o+1,e+1),m=h(o,e+1);if(Math.max(n[1],l[1],u[1],m[1])<-1.4)continue;const g=v(n),S=v(l),L=v(u),w=v(m),A=i(n),F=i(l),P=i(u),R=i(m);s.vert(n,g,A,t(n)),s.vert(u,L,P,t(u)),s.vert(l,S,F,t(l)),s.vert(n,g,A,t(n)),s.vert(m,w,R,t(m)),s.vert(u,L,P,t(u))}}function xe(s,r,f){const c=new a.BufferGeometry,y=[],d=[],x=6;for(let o=0;o<x;o++){const n=o/x,l=(o+1)/x,u=.085*(1-.6*n),m=.085*(1-.6*l);y.push(n,0,-u,l,0,m,l,0,-m,n,0,-u,n,0,u,l,0,m);for(let g=0;g<6;g++)d.push(0,1,0)}c.setAttribute("position",new a.Float32BufferAttribute(y,3)),c.setAttribute("normal",new a.Float32BufferAttribute(d,3));const M=new a.MeshStandardMaterial({color:"#ffffff",roughness:.4,side:a.DoubleSide});M.onBeforeCompile=o=>{o.uniforms.uTime=f,o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime;`).replace("#include <begin_vertex>",`#include <begin_vertex>
#ifdef USE_INSTANCING
float wph = instanceMatrix[3].x*.37 + instanceMatrix[3].z*.53;
float wk = position.x*position.x, surge = .5 + .5*sin(uTime*.55 + wph);
transformed.y += wk*(.08 + .5*surge*surge) + .04*sin(position.x*9. + uTime*1.9 + wph*3.)*position.x;
transformed.z += wk*.22*sin(uTime*1.1 + wph*5.);
#endif`)},M.customProgramCacheKey=()=>"lidp-weed-1";const _=[];for(let o=0;_.length<420&&o<6e3;o++){const n=s.chance(.55),l=s.range(0,Math.PI*2),u=s.range(4.9,8.5),m=s.range(-16,16),g=s.range(-8,8),S=s.range(0,Math.PI*2),L=s.range(1.3,3),w=s(),A=[0,1,2].map(()=>[s.range(-.3,.3),s.range(-.3,.3),s.range(-.7,.7),s.range(.6,1.1),s.range(-.25,.1)]),F=n?Math.cos(l)*u:m,P=n?Math.sin(l)*u*.8:g,R=r(F,P);if(!(R<.1||R>(n?2:1.2)))for(const C of A)_.push([F+C[0],R,P+C[1],S+C[2],L*C[3],w,C[4]])}const B=new a.InstancedMesh(c,M,_.length),p=new a.Matrix4,h=new a.Quaternion,v=new a.Euler,i=new a.Color,t=new a.Color("#3d2e15"),e=new a.Color("#1f1d0d");return _.forEach((o,n)=>{v.set(0,o[3],o[6],"YXZ"),h.setFromEuler(v),p.compose(new a.Vector3(o[0],o[1]+.06,o[2]),h,new a.Vector3(o[4],o[4],o[4]*1.6)),B.setMatrixAt(n,p),B.setColorAt(n,i.copy(t).lerp(e,o[5]))}),B.frustumCulled=!1,B}function le(s,r,f,c={}){const y={...T.fogUniforms(),uTime:s,uColor:{value:new a.Color(r)},uLevel:{value:f},uFall:{value:c.fall??3},uStreak:{value:c.streak??.5},uPoolY:{value:0},uFire:{value:c.fire??0},uEnd0:{value:c.end0??.45},uFireSeed:{value:c.fireSeed??0},uSoft:{value:c.soft??0}};return new a.ShaderMaterial({uniforms:y,fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide,blending:a.AdditiveBlending,vertexShader:T.GLSL_FOG_PARS_VERT+`
attribute float aK; uniform float uPoolY, uSoft; varying vec2 vUv; varying float vK, vFace; varying vec3 vMv;
void main(){
  vec3 p = position; p.y += aK*uPoolY;
  vec4 mvPosition = modelViewMatrix*vec4(p, 1.);
  vUv = uv; vK = aK;
  // a shaft is a round of air, not a sheet: each of its crossed sheets shows only as far as it faces the eye, so
  // that none is ever seen as a line from its edge (a broad soft cone, uSoft, lets go of a sheet sooner still:
  // what is seen of it is always the sheets that lie broad to the eye)
  vec3 nv = normalize(normalMatrix*normal), ev = normalize(mvPosition.xyz);
  float face = abs(dot(nv, ev));
  vFace = mix(smoothstep(mix(.12, .4, uSoft), mix(.7, .92, uSoft), face), 1., aK); vMv = mvPosition.xyz;
  gl_Position = projectionMatrix*mvPosition;
  ${T.GLSL_FOG_VERT}
}`,fragmentShader:ae+T.GLSL_HASH+T.GLSL_VALUE_NOISE+T.GLSL_FOG_PARS_FRAG+`
uniform vec3 uColor; uniform float uTime, uLevel, uFall, uStreak, uFire, uEnd0, uFireSeed; varying vec2 vUv; varying float vK, vFace; varying vec3 vMv;
void main(){
  float ac = clamp(abs(vUv.y), 0., 1.), e = 1. - ac*ac;
  float along = clamp(vUv.x, 0., 1.);
  float a = e*e*e*exp(-along*uFall)*smoothstep(0., .012, along)*(1. - smoothstep(uEnd0, 1., along));
  a *= 1. - uStreak + uStreak*(.4 + 1.2*vnoise(vec2(along*90. - uTime*1.4, vUv.y*2.5 + uTime*.6)));
  float r2 = dot(vUv, vUv);
  // a light lying on the sea is a broken glitter, chopped by the waves: bright flecks that come and go
  float fleck = smoothstep(.56, .78, vnoise(vUv*vec2(6., 13.) + vec2(uTime*.8, -uTime*1.9)))*smoothstep(.3, .6, vnoise(vUv*vec2(2.2, 4.) - vec2(uTime*.4, uTime*.7)));
  float pool = exp(-clamp(r2, 0., 4.)*2.6)*(.1 + 2.4*fleck)*(1. - smoothstep(.7, 1., max(abs(vUv.x), abs(vUv.y))));
  a = mix(a, pool, step(.5, vK));
  // a shaft's strength is the world's own (it falls along its length and across its width, above); lit air is a
  // medium, so the one lens law: none of it is drawn large in the lens
  float lens = mix(smoothstep(.6, 2.5, length(vMv)), 1., step(.5, vK));
  vec3 col = uColor*uLevel*a*vFace*lens*mix(1., fireBreath(uFireSeed, uTime), uFire);
  gl_FragColor = vec4(col*(1. - .8*fxFog()), 1.);
}`})}function ue(s){const r=[],f=[],c=[],y=[],d=new a.BufferGeometry,x=new a.Vector3,M=new a.Vector3,_=new a.Vector3,B=new a.Vector3,p=new a.Vector3,h=new a.Vector3,v=new a.Vector3;for(const i of s){if(i.pool){const[t,e,o]=i.pool,n=i.size[0],l=i.size[1];r.push(t-n,e,o-l,t+n,e,o-l,t+n,e,o+l,t-n,e,o-l,t+n,e,o+l,t-n,e,o+l),f.push(-1,-1,1,-1,1,1,-1,-1,1,1,-1,1),c.push(1,1,1,1,1,1);for(let u=0;u<6;u++)y.push(0,1,0);continue}M.set(...i.a),_.set(...i.b),B.subVectors(_,M).normalize(),p.set(0,1,0),Math.abs(B.y)>.95&&p.set(1,0,0),h.crossVectors(B,p).normalize(),p.crossVectors(h,B).normalize();for(let t=0;t<i.planes;t++){const e=t/i.planes*Math.PI;v.copy(p).multiplyScalar(Math.cos(e)).addScaledVector(h,Math.sin(e));const o=(g,S,L)=>[g.x+v.x*S*L,g.y+v.y*S*L,g.z+v.z*S*L],n=o(M,i.w0,-1),l=o(M,i.w0,1),u=o(_,i.w1,-1),m=o(_,i.w1,1);r.push(...n,...u,...m,...n,...m,...l),f.push(0,-1,1,-1,1,1,0,-1,1,1,0,1),c.push(0,0,0,0,0,0),x.crossVectors(B,v).normalize();for(let g=0;g<6;g++)y.push(x.x,x.y,x.z)}}return d.setAttribute("position",new a.Float32BufferAttribute(r,3)),d.setAttribute("uv",new a.Float32BufferAttribute(f,2)),d.setAttribute("aK",new a.Float32BufferAttribute(c,1)),d.setAttribute("normal",new a.Float32BufferAttribute(y,3)),d}const oe=.22,ce=1.6,se=1.75,Se=(s,r,f,c=1)=>({r0:s*(1-oe)-se*c,r1:s*(1+oe)+se*c,y0:r-ce*f-.6*c,y1:r+ce*f+.6*c});function Me(s,r,f,c={}){const y=new a.BufferGeometry,d=[0,0,-.34,.07,0,0,0,.05,.05,0,0,-.34,0,.05,.05,-.07,0,0,.07,0,0,0,0,.3,0,.05,.05,-.07,0,0,0,.05,.05,0,0,.3,.05,.02,-.12,.5,.02,-.06,.05,.02,.12,.5,.02,-.06,1,.02,.1,.05,.02,.12,-.05,.02,-.12,-.05,.02,.12,-.5,.02,-.06,-.5,.02,-.06,-.05,.02,.12,-1,.02,.1],x=new Array(12).fill(0).concat([0,.5,0,.5,1,0,0,0,.5,.5,0,1]);y.setAttribute("position",new a.Float32BufferAttribute(d,3)),y.setAttribute("aW",new a.Float32BufferAttribute(x,1));const M=new a.InstancedBufferGeometry;M.index=y.index,M.attributes=y.attributes;const _=new Float32Array(r*4),B=new Float32Array(r*4),p=new Float32Array(r*2);for(let t=0;t<r;t++){const e=c.centre?c.centre(t):null,o=s.chance(.7)?1:-1,n=e?e[2]:s.range(c.rMin??8,c.rMax??36),l=e?e[3]:s.range(c.yMin??3.5,c.yMax??27),u=e?e[4]:s.range(c.bob?.[0]??2.2,c.bob?.[1]??6.5);e&&p.set([e[0],e[1]],t*2),_.set([n,l,o*s.range(c.speed?.[0]??7,c.speed?.[1]??11)/n,s.range(0,Math.PI*2)],t*4),B.set([u,s.range(.45,.8),s.range(0,Math.PI*2),s.range(.65,.95)*(c.size??1)],t*4)}M.setAttribute("aOrb",new a.InstancedBufferAttribute(_,4)),M.setAttribute("aBob",new a.InstancedBufferAttribute(B,4)),M.setAttribute("aCen",new a.InstancedBufferAttribute(p,2)),M.instanceCount=r;const h={...T.fogUniforms(),uTime:f,uDark:{value:new a.Color(c.dark??"#0c0e13")},uPale:{value:new a.Color(c.pale??"#566078")},uFloor:{value:c.floor??2.5},uCeil:{value:c.ceil??1e3},uGain:{value:c.gain??.55}},v=new a.ShaderMaterial({uniforms:h,fog:!0,side:a.DoubleSide,vertexShader:T.GLSL_FOG_PARS_VERT+`
attribute float aW; attribute vec4 aOrb, aBob; attribute vec2 aCen; uniform float uTime, uFloor, uCeil; varying float vShade;
void main(){
  float th = aOrb.w + uTime*aOrb.z, rr = aOrb.x*(1. + ${oe.toFixed(2)}*sin(th*2. + aBob.z));
  float wv = uTime*aBob.y + aBob.z, y = clamp(aOrb.y + aBob.x*sin(wv) + ${(ce-1).toFixed(2)}*aBob.x*sin(wv*.53 + 1.7), uFloor, uCeil);
  vec3 c = vec3(aCen.x + cos(th)*rr, y, aCen.y + sin(th)*rr);
  float sp = aOrb.z*rr, vy = aBob.x*aBob.y*cos(wv);
  vec3 fwd = normalize(vec3(-sin(th)*sp, vy*.6, cos(th)*sp));
  vec3 right = normalize(cross(fwd, vec3(0., 1., 0.))), up = cross(right, fwd);
  float beat = sin(uTime*(7.5 + 3.*fract(aBob.z*3.7)) + aOrb.w*9.), glide = smoothstep(-.2, .5, sin(uTime*.9 + aBob.z*5.));
  float lift = aW*(.1 + .55*beat*glide + .12*aW);
  vec3 lp = position; lp.y += lift*abs(lp.x); lp.x *= 1. - .18*abs(lift);
  vec3 wp = c + (right*lp.x*1.15 - fwd*lp.z + up*lp.y)*aBob.w*1.5;
  vShade = clamp(.35 + .65*up.y*sign(lp.y - .01) + aW*.3, 0., 1.);
  vec4 mvPosition = viewMatrix*modelMatrix*vec4(wp, 1.);
  gl_Position = projectionMatrix*mvPosition;
  ${T.GLSL_FOG_VERT}
}`,fragmentShader:T.GLSL_FOG_PARS_FRAG+`
uniform vec3 uDark, uPale; uniform float uGain; varying float vShade;
void main(){ gl_FragColor = vec4(fxApplyFog(mix(uDark, uPale, vShade*uGain)), 1.); }`}),i=new a.Mesh(M,v);return i.frustumCulled=!1,{mesh:i,uniforms:h}}async function Ae(s,r={}){const f=V=>s.core.makeRng(s.core.hashSeed(V+":"+s.seed)),c=f("sea-tower-stone"),y=f("sea-tower-weed"),d=f("sea-tower-surge"),x=f("sea-tower-puffs"),M=f("sea-tower-birds"),_=f("sea-tower-beam"),B=f("sea-tower-keepers"),p=f("sea-tower-slots"),h=r.time??{value:0},v=s.noise,i=new a.Group,t=new a.Vector2(...r.windFrom??[-.6,.8]).normalize(),e={ph:[B.range(0,Math.PI*2),B.range(0,Math.PI*2)],seed:B(),deep:pe()},o={uTime:h,uSlit:{value:5.5},uBeamAng:{value:0},uBeamCol:{value:new a.Color("#cdd7e6")},uFireSeed:{value:e.seed},uKeep:{value:new a.Vector4(e.ph[0],e.ph[1],e.deep[0],e.deep[1])}},n=me(),l=be(v),u=we(n,c,p);await s.yield(),ye(n,l,v),await s.yield();const m=new a.Mesh(n.toGeometry(),ge(o));i.add(m);const g=xe(y,l,h);i.add(g),await s.yield();const S={end:r.beamLength??96,fade:36,turn:12},L=S.end,w=u.lantern[1],A=new a.Mesh(ue([{a:[1.9,w,0],b:[L,w,0],w0:1.2,w1:1.2+L*.075,planes:6},{a:[-1.9,w,0],b:[-L,w,0],w0:1.2,w1:1.2+L*.075,planes:6}]),le(h,"#cdd7e6",r.beamLevel??.3,{fall:2,streak:.35,end0:S.fade/S.end,soft:1}));A.frustumCulled=!1,A.renderOrder=4,i.add(A);const F=_.range(0,Math.PI*2),P=Math.PI*2/S.turn,R=new a.Mesh(new a.PlaneGeometry(2,2),new a.ShaderMaterial({uniforms:{...T.fogUniforms(),uAt:{value:new a.Vector3(0,w,0)},uColor:{value:new a.Color("#cdd7e6")}},fog:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:T.GLSL_FOG_PARS_VERT+`
uniform vec3 uAt; varying vec2 vUv;
void main(){
  vec4 mvPosition = modelViewMatrix*vec4(uAt, 1.); mvPosition.xy += position.xy*11.; vUv = position.xy;
  gl_Position = projectionMatrix*mvPosition;
  ${T.GLSL_FOG_VERT}
}`,fragmentShader:T.GLSL_FOG_PARS_FRAG+`
uniform vec3 uColor; varying vec2 vUv;
void main(){ float r = length(vUv), a = exp(-r*r*5.)*.5 + exp(-r*r*40.)*.9; gl_FragColor = vec4(uColor*a*(1. - smoothstep(.75, 1., r))*(1. - .6*fxFog()), 1.); }`}));R.frustumCulled=!1,R.renderOrder=4,i.add(R);const C=[u.slit[0]+I.y*I.deep/(I.backH/2+I.h/2),.4,0],E=new a.Mesh(ue([{pool:C,size:[4.4,2.8]}]),le(h,fe.hex,r.rayLevel??.8,{fall:1.2,streak:.4,fire:1,fireSeed:e.seed}));E.frustumCulled=!1,E.renderOrder=4,i.add(E);const O={reach:r.rayReach??66,y:1.2},K=u.slit[1]-O.y,b=new a.Mesh(ue([{a:[u.slit[0]+.4,u.slit[1],0],b:[u.slit[0]+Math.sqrt(Math.max(O.reach*O.reach-K*K,1)),O.y,0],w0:.5,w1:6.5,planes:4}]),le(h,fe.hex,r.rayAir??.16,{fall:1.6,streak:.6,fire:1,end0:.3,fireSeed:e.seed}));b.frustumCulled=!1,b.renderOrder=4,i.add(b);const k=ve([{p:u.slit,size:3,level:1.5,seed:e.seed,heat:1},{p:[u.slit[0]+.2,u.slit[1],0],size:.7,level:2.4,seed:e.seed,heat:1.6}],{fog:.35});k.uniforms.uTime=h,k.mesh.material.uniforms.uTime=h,i.add(k.mesh);const z=[],U=[t.y,0,-t.x],Q=6,J=d.range(5.5,9.5),ie=d.range(0,J);for(let V=0;V<Q;V++){const G=(V-2.5)*2.4+d.range(-.8,.8),Y=d.range(4.6,8.5),re=t.x*Y+U[0]*G,Z=t.y*Y+U[2]*G;z.push({p:[re,Math.max(.4,l(re,Z)),Z],dir:[-t.x*.22,1,-t.y*.22],across:U,speed:d.range(11.5,14.5),spread:.24,size:d.range(2.3,3.4),period:J,offset:ie+J*V/Q,life:2.9,stagger:.7,puffs:30})}for(let V=0;V<14;V++){const G=(V+d.range(0,.8))/14*Math.PI*2,Y=Math.cos(G)*14.6,re=Math.sin(G)*7.2,Z=d.range(2,3.2);z.push({p:[Y,.3,re],dir:[Math.cos(G)*.3,1,Math.sin(G)*.3],across:[-Math.sin(G),0,Math.cos(G)],speed:d.range(3,5),spread:.75,size:d.range(1.5,2.4),period:Z,offset:d.range(0,10),stagger:Z,life:Z*.95,puffs:9})}const ee=d.range(4.5,7),te=d.range(0,10);[-3.2,2.6].forEach((V,G)=>z.push({p:[13.5,.5,V],dir:[.25,1,0],across:[0,0,1],speed:d.range(8,10),spread:.3,size:2.2,period:ee,offset:te+ee*G/2,life:2.3,stagger:.6,puffs:18,warm:.7}));const N=he(z,{rng:x,lit:r.lit,shade:r.shade});N.mesh.material.uniforms.uTime=h,i.add(N.mesh);const j={near:12,far:45,low:1,high:12},q=.8,$=Me(M,r.birds??40,h,{rMin:(j.near+se*q)/(1-oe),rMax:(j.far-se*q)/(1+oe),yMin:3.6,yMax:9.4,bob:[.9,1.6],floor:j.low,ceil:j.high,size:q});i.add($.mesh);const X=r.seaAt;return{object:i,radius:20,height:32,center:new a.Vector3(0,15,0),anchors:{slit:new a.Vector3(...u.slit),lantern:new a.Vector3(...u.lantern),pool:new a.Vector3(...C)},uniforms:o,surge:N,birds:$,glows:k,beam:A,ray:E,reefHeight:l,beamAngle:V=>F+V*P,BEAM:S,keepers:e,update(V,G){h.value=G;const Y=F+G*P;A.rotation.y=Y,o.uBeamAng.value=-Y,X&&(E.material.uniforms.uPoolY.value=X(C[0],C[2],G))},ground:!0,groundY:0}}export{ce as BIRD_LIFT,se as BIRD_SPAN,oe as BIRD_SWAY,fe as FIRE,ae as FIRE_GLSL,de as LAMP_GLSL,Se as birdReach,Ae as buildHero,he as makeBursts,ve as makeFireGlows,me as makeGeo,Me as makeSeaBirds};
