import*as e from"three";import{clamp as te,lerp as $,smoothstep as R}from"../kit/core.js";import*as Q from"../kit/terrain.js";import{sharedUniforms as O,SBV_NOISE as H,SBV_LIGHT as L}from"./sledge-between-volcanoes-common.js";const ae=[{squash:[.42,1.5,.4],taper:.14,cuts:8,detail:1},{squash:[.78,.85,.7],taper:.08,cuts:9,detail:1},{squash:[.27,1.4,.62],taper:.2,cuts:7,detail:1},{squash:[.46,1.6,.44],taper:.14,cuts:12,detail:2}],_=b=>(b.index?b.index.count:b.getAttribute("position").count)/3;function ne(b,r){const t=ae[r],a=Q.rockGeometry({rng:b,kind:"rock",radius:1,detail:t.detail,cuts:t.cuts,cutDepth:[.42,.85],roughness:.1,lumps:.22,squash:t.squash,taper:t.taper,crease:.4}),h=a.getAttribute("position");let v=1e9,g=-1e9;for(let d=0;d<h.count;d++)v=Math.min(v,h.getY(d)),g=Math.max(g,h.getY(d));const y=g-v,i=new Float32Array(h.count);a.translate(0,-v-y*.1,0),a.scale(1/y,1/y,1/y);{const d=.3-.2*r,m=.12*r-.2,B=.72;for(let k=0;k<h.count;k++)h.setY(k,Math.min(h.getY(k),B+d*h.getX(k)+m*h.getZ(k)));h.needsUpdate=!0,a.computeVertexNormals()}for(let d=0;d<h.count;d++)i[d]=Math.min(1,Math.max(0,h.getY(d)));return a.setAttribute("aK",new e.BufferAttribute(i,1)),a}const X=`
attribute float aK;
varying vec3 vW, vN, vL; varying float vK, vSeed;
void main(){
  mat4 m = modelMatrix;
  #ifdef USE_INSTANCING
    m = modelMatrix*instanceMatrix;
  #endif
  vec4 w = m*vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(m)*normal); vL = position; vK = aK;
  vSeed = fract(m[3].x*.137 + m[3].z*.291);
  gl_Position = projectionMatrix*viewMatrix*w;
}`,J=`
precision highp float;
varying vec3 vW, vN, vL; varying float vK, vSeed;
uniform vec3 uIceA, uIceB, uFrost, uAshCol, uGlowIce; uniform vec2 uSeracP;      // uSeracP: mirror sign, ash amount
${H}
${L}
void main(){
  vec3 v = normalize(cameraPosition - vW);
  // the faces are rough, not cut glass
  // sharp facets: each face's own normal (from the change of its position across the picture's cells), a little grain on it
  vec3 fc = cross(dFdx(vW), dFdy(vW)); vec3 fn = dot(fc, fc) > 1e-14 ? normalize(fc) : normalize(vN + vec3(0., 1e-4, 0.)); if (dot(fn, v) < 0.) fn = -fn;
  vec3 n = normalize(fn + (vec3(sN3(vW*3.1), sN3(vW*3.1 + 5.), sN3(vW*3.1 + 9.)) - .5)*.12
    + (vec3(sN3(vW*.8 + 20.), sN3(vW*.8 + 25.), sN3(vW*.8 + 31.)) - .5)*.3);      // (polish 1, fourth part, E3a: a broken face is uneven over a metre or so too: no side of a block is lit as one flat plane)
  float k = clamp(vK, 0., 1.);
  // the body: blue ice with bands and fracture planes; bluer toward the foot and the inside
  float band = sN2(vec2(vW.y*.55 + vSeed*17., (vW.x + vW.z)*.08)), frac = sF2(vec2(dot(vW.xz, vec2(.8, .6))*.5, vW.y*.18) + vSeed*9.);
  vec3 alb = mix(uIceB, uIceA, clamp(.5 + .45*k + .5*(frac - .5), 0., 1.))*(.85 + .25*band);
  // frost and old snow on what faces up; ash on it toward the fire
  // (fourth part, E3a: the snow's edge on a slanted face is ragged, from fine broken noise; it was one slow noise, which
  //  left a round bare spot like a bored hole in the snow on a face near the limit)
  float up = smoothstep(.22, .46, fn.y + .06*(frac - .5) + .16*(sF2(vW.xz*1.9 + vW.y*1.3 + vSeed*7.) - .5));      // snow lies on whatever faces up, even on a slant
  float ashK = uSeracP.y*smoothstep(-.2, .6, sN2(vW.xz*.11 + 3.) + .5*smoothstep(-60., 120., vW.x*uSeracP.x));
  { float fl = 1. - smoothstep(.0, .028, abs(sN2(vec2(dot(vW.xz, vec2(.8, .6))*.8, vW.y*.3) + vSeed*5.) - .5)); alb *= 1. - .4*fl; }      // fracture lines across the faces
  alb = mix(alb, mix(vec3(.66, .72, .8), uAshCol, .6*ashK), up);
  alb = mix(alb, uFrost, .35*smoothstep(.55, .8, frac)*(1. - up));                 // frost feathers on the faces
  // soot on the faces that look toward the fire, heavier on the fire side of the fall
  alb = mix(alb, uAshCol*1.5, uSeracP.y*.8*clamp(fn.x*uSeracP.x*1.3, 0., 1.)*smoothstep(-70., 110., vW.x*uSeracP.x)*(.45 + .55*frac));
  // the faces turned to the fire take an orange light (the lava front, and the tongue beside the fall); those turned away stay blue
  vec3 c = alb*(sbvSky(n) + (.35*sbvFire(vW, n) + 1.5*sbvFire2(vW, n))*vec3(1., .6, .46) + sbvRing(vW, n));      // (firelight on sooted ice is red, not salmon)
  // light inside the ice: a soft blue where we look into a face, stronger low down
  float fres = clamp(dot(n, v), 0., 1.);
  c += uGlowIce*.5*(.25 + .75*fres*fres)*(1. - up)*(1. - .55*k);
  // ice in the light is pale, never white: a soft shoulder on the brightest channel
  { float m = max(c.r, max(c.g, c.b)); c *= .9/(.9 + 1.3*max(m - .55, 0.)); }
  gl_FragColor = vec4(sbvFog(c, length(cameraPosition - vW), 1.), 1.);
}`;async function ce(b,r,t){const a=t.rng,h=new e.Group;h.name="seracs";const v=t.shapes||a.fork("shapes"),g=t.falls||a.fork("fallers"),y=[];for(let n=0;n<4;n++)y.push(ne(v,n)),await b.yield();const i={...O(r),uIceA:{value:new e.Color(.6,.67,.74)},uIceB:{value:new e.Color(.22,.42,.62)},uFrost:{value:new e.Color(.62,.67,.72)},uAshCol:{value:new e.Color("#1c1a1f")},uGlowIce:{value:new e.Color("#3FA9D9").multiplyScalar(.045)},uSeracP:{value:new e.Vector2(t.mx??1,t.ash??1)}},d=new e.ShaderMaterial({uniforms:i,vertexShader:X,fragmentShader:J}),m=[[],[],[],[]],B=new e.Matrix4,k=new e.Quaternion,I=new e.Euler,c=new e.Vector3,G=new e.Vector3,W=[],l=t.zone,q=t.count??420,U=typeof t.margin=="number"?t.margin:4,C={refused:0,turned:0,held:0};let E=0;for(;W.length<q&&E<q*14;){E++,E%24===0&&await b.yield();const n=a.sign(),u=l.gully+4+Math.pow(a(),1.5)*(l.half-l.gully-6),o=n*u,s=-a.range(l.from,l.to+40),F=l.up(o,s);if(F<l.from||F>l.to)continue;const S=Math.sin(Math.PI*te((F-l.from)/(l.to-l.from),0,1)),M=1-R(l.gully,l.gully+70,u);let D=a()<.45?0:a()<.6?1:2,A=$(5,16,Math.pow(a(),1.7))*(.6+.4*S)*(.8+.25*M);D===1&&(A*=.6),D===0&&A>8&&M>.35&&(D=3);const N=D===1?1.25:1.7,z=A*(D===1?.56:.37);if(u-z<l.gully)continue;let j=!0;for(const T of W){const Y=T[0]-o,Z=T[1]-s;if(Y*Y+Z*Z<(T[2]+z)*(T[2]+z)*.55){j=!1;break}}if(!j||t.keyed&&Math.hypot(o-t.keyed[0],s-t.keyed[1])<14)continue;const K=Math.min(t.ground(o,s),t.ground(o+z*.6,s),t.ground(o-z*.6,s),t.ground(o,s+z*.6));if(t.gap&&t.gap(o,K,K+A,s)<z*1.35+(typeof t.margin=="function"?t.margin(o,s):U)){C.refused++;continue}if(t.avoid&&t.avoid.some(T=>Math.hypot(o-T[0],s-T[1])<T[2]+z))continue;W.push([o,s,z,A]);const ee=a()<.14;I.set(a.range(-.2,.2)*1.5+(ee?1.25:0),a.range(0,Math.PI*2),a.range(-.2,.2)*1.5),k.setFromEuler(I),c.set(A*N*a.range(.8,1.35),A,A*N*a.range(.8,1.35)),G.set(o,K,s),m[D].push(B.compose(G,k,c).clone())}let V=0;for(let n=0;n<4;n++){if(!m[n].length)continue;const u=new e.InstancedMesh(y[n],d,m[n].length);m[n].forEach((o,s)=>u.setMatrixAt(s,o)),u.instanceMatrix.needsUpdate=!0,u.computeBoundingSphere(),u.name="seracs-"+n,h.add(u),V+=m[n].length*_(y[n])}await b.yield();const f=[],x=(n,u)=>{const o=t.ground(n+4,u)-t.ground(n-4,u),s=t.ground(n,u+4)-t.ground(n,u-4);return Math.atan2(s,-o)},w=(n,u,o,s)=>{if(!t.gap)return!0;const F=Math.cos(s),S=-Math.sin(s);for(let M=0;M<=1.001;M+=.125){const D=n+F*o*M,A=u+S*o*M,N=t.ground(D,A);if(t.gap(D,N-1,N+o*.5,A)<o*.4+8)return!1}return!0},p=(n,u,o,s,F)=>{let S=s,M=!1;for(let z=0;z<4&&!M;z++)S=s+z*Math.PI/2,M=w(n,u,o,S),M&&z>0&&C.turned++;M||(S=s,C.held++);const D=new e.Mesh(y[3],d),A=new e.Group;A.position.set(n,t.ground(n,u)-.2,u),A.rotation.y=S,D.scale.set(o*1.1,o,o*1.1),A.add(D),h.add(A);const N={pivot:A,mesh:D,x:n,z:u,h:o,yaw:S,keyed:F,falls:M,amount:0,dir:new e.Vector3(Math.sin(S+Math.PI/2),0,Math.cos(S+Math.PI/2))};return f.push(N),N};t.keyed&&p(t.keyed[0],t.keyed[1],20,x(t.keyed[0],t.keyed[1])+g.range(-.5,.5),!0);for(let n=0;n<5;n++){const u=g.sign(),o=u*g.range(l.gully+45,l.half-30),s=-g.range(l.from+25,l.to-30);p(o,s,g.range(11,17),x(o,s)+g.range(-.5,.5),!1)}for(const n of f)n.reach=g.range(1.1,2.4);const P={object:h,uniforms:i,triangles:V+f.length*_(y[3]),fallers:f,placed:W,clearance:C,fallSeconds:4.5,fallAt(n){return n<=0?0:n<2.6?.05*R(0,2.6,n):Math.min(1,.05+.95*Math.pow((n-2.6)/1.9,2.2))},update(n,u,o){for(let s=0;s<f.length;s++){const F=f[s],S=F.falls?P.fallAt(o?o[s]:-1):0;F.amount=S,F.mesh.rotation.z=-S*1.48,F.mesh.position.y=-S*S*F.h*.11,F.mesh.scale.y=F.h*(1-.3*R(.9,1,S))}}};return P.update(0,0,null),P}const oe=`
attribute vec3 aP, aV; attribute vec4 aA, aB; attribute vec2 aC;      // aA: phase or delay, life, size0, size1   aB: group, tone, seed, alpha   aC: gravity, drag
uniform float uTime; uniform float uAges[8]; uniform vec3 uPuffWind;
varying vec2 vUv; varying vec4 vI; varying vec3 vW, vR, vU; varying float vS;
void main(){
  float life = max(aA.y, .05), age;
  if (aB.x < -.5) age = mod(uTime + aA.x*life, life);
  else { int g = int(clamp(aB.x + .5, 0., 7.)); age = uAges[g] - aA.x; }
  float k = clamp(age/life, 0., 1.), vis = step(0., age)*step(age, life);
  float dr = max(aC.y, .05), tt = (1. - exp(-dr*max(age, 0.)))/dr;
  vec3 p = aP + aV*tt + uPuffWind*(max(age, 0.) - tt) + vec3(0., -.5*aC.x*age*age, 0.);
  vec4 w = modelMatrix*vec4(p, 1.);
  // the card faces the eye's place (not the lens): its axes come from the line to where the eye stands
  vec3 toEye = normalize(cameraPosition - w.xyz); vR = normalize(cross(vec3(0., 1., 0.), toEye) + vec3(1e-4, 0., 0.)); vU = cross(toEye, vR);
  float s = mix(aA.z, aA.w, sqrt(k));
  float rot = aB.z*40. + age*(.15 + .3*fract(aB.z*7.3))*(fract(aB.z*3.1) > .5 ? 1. : -1.), cr = cos(rot), sr = sin(rot);
  vec2 c = position.xy*2.; vUv = c; c = vec2(c.x*cr - c.y*sr, c.x*sr + c.y*cr);
  w.xyz += (vR*c.x + vU*c.y)*s*.5;
  vW = w.xyz; vS = s;
  float a = aB.w*smoothstep(0., .12, k)*(1. - smoothstep(aB.y > 1.5 ? .72 : .45, 1., k))*vis;      // steam holds together higher up its tower
  vI = vec4(a, aB.y, aB.z, k);
  gl_Position = vis > .5 ? projectionMatrix*viewMatrix*w : vec4(2., 2., 2., 1.);
}`,re=`
precision highp float;
varying vec2 vUv; varying vec4 vI; varying vec3 vW, vR, vU; varying float vS;
uniform vec3 uSnowTone, uAshTone, uHot, uGlowCol2, uFlashCol, uPuffWind; uniform float uPuffClock, uSoft, uFogK, uBellyK; uniform vec4 uGlowAt, uFlashAt, uNearFade;      // uSoft 1: smoke (soft torn edges, one slow field through all its cards)
${H}
${L}
void main(){
  float r2 = dot(vUv, vUv); if (r2 > 1.) discard;
  float tone = clamp(vI.y, 0., 2.), steam = clamp(tone - 1., 0., 1.);
  // each card is eaten by its own noise; the cards of a steam tower by one field in the tower's own space, which rises with it
  float nz = sF2(vUv*1.7 + vI.z*31.);
  if (steam > 0.) nz = mix(nz, sF2(vec2(vW.x*.8 + vW.z*.6, vW.y - uPuffClock*5.)/16.) + .2*(sF2(vec2(vW.x*.8 + vW.z*.6, vW.y - uPuffClock*5.)/4. + 4.) - .5), steam*.6);
  if (uSoft > 0.) { vec2 sp = vec2(vW.x*.8 + vW.z*.6, vW.y*1.1)/max(vS*.42, 1.); nz = mix(nz, sF2(sp + vec2(uPuffClock*.011, -uPuffClock*.017)) + .25*(sF2(sp*3.1 + 7.) - .5), .65*uSoft); }
  float soft = max(steam, uSoft);
  // (smoke's outline is ragged: the card's own edge is pushed in and out by a finer field, so no round rim is left)
  // (steam's outline too: its card's edge is eaten inward by two fields of its own, unevenly, and its density runs out
  //  to nothing before the card's rim, so no clean round is left and neighbours run into one body)
  float re = r2*(1. + uSoft*(1.5*(sF2(vUv*3.3 + vI.z*17.) - .42) + .7*(sF2(vUv*7.9 + vI.z*5.) - .5)) + steam*(1.5*sF2(vUv*2.7 + vI.z*17.) + .9*sF2(vUv*6.9 + vI.z*5.)));
  float a = clamp(exp(-re*mix(3.2, 1.9, soft)) - .04 - .05*uSoft - .11*steam, 0., 1.)*smoothstep(.15 - .25*steam - .03*uSoft, .75 - .12*steam + .12*uSoft, nz + .55*(1. - re))*vI.x;
  float dist = length(cameraPosition - vW);
  // one near fade in plain metres for every card whatever its size: gone at 2 m from the eye's place, whole from 12 m
  // (a large card is kept from the eye by where its emitter stands, which the world tests against the road)
  a *= smoothstep(uNearFade.x, uNearFade.y, dist);
  vec3 f = normalize(cross(vR, vU)); vec3 n = normalize(vR*vUv.x + vU*vUv.y + f*sqrt(max(1. - r2, .05)));
  vec3 alb = mix(uSnowTone, uAshTone, clamp(tone, 0., 1.));
  alb = mix(alb, vec3(.6, .61, .64), steam);
  alb *= mix(1., .5 + .5*smoothstep(-.4, .5, n.y), uSoft);                         // smoke is dark on its under and lee sides; only the sky's side is grey
  // steam: one body, not a heap of balls: its cards are lit almost flat (the ball's own normal is kept only to tell
  // under from over and lee from windward); dark ash hangs in its lee; the fire's colour is on its underside only
  vec3 n0 = n; float under = 1.;
  if (steam > 0.) { n = normalize(n0 + f*1.3*steam); under = mix(1., smoothstep(.0, -.6, n0.y), steam);
    float lee = smoothstep(-.1, .8, dot(n0, normalize(uPuffWind + vec3(1e-4, 0., 0.))));
    alb = mix(alb, vec3(.2, .19, .2), .6*lee*steam); }
  // steam is grey-white; the fire reddens only its foot, where it leaves the lava
  vec3 c = alb*(sbvSky(n)*.85 + sbvSky(vec3(0., 1., 0.))*.3 + ((sbvFire(vW, n0) + sbvFire(vW, -n0)*.35)*(1. - steam*(.5 + .5*smoothstep(.1, .45, vI.w))) + 1.6*sbvFire2(vW, n0))*under + .35*sbvRing(vW, n) + uBellyK*sbvBelly(vW, n));
  c += uHot*steam*exp(-vI.w*12.)*under;
  // a light at a place (the crater under its smoke; the ring by the way out): on what faces down at it, falling off with metres
  { vec3 gd = uGlowAt.xyz - vW; float gl = uGlowAt.w*uGlowAt.w/(dot(gd, gd) + uGlowAt.w*uGlowAt.w);
    c += uGlowCol2*gl*mix(.25 + .75*clamp(dot(n, normalize(gd))*.8 + .3, 0., 1.), clamp(dot(n, normalize(gd))*1.4 - .2, 0., 1.), uSoft)*(1. - steam); }
  // a flash deep in the smoke: a light at the flash's own place, on whatever cards stand round it
  { vec3 fd = uFlashAt.xyz - vW; c += uFlashCol*(uFlashAt.w*uFlashAt.w/(dot(fd, fd) + uFlashAt.w*uFlashAt.w)); }
  c = sbvFog(c, dist, uFogK);
  gl_FragColor = vec4(c*a, a);
}`;function fe(b,r){const t=r.rng,a=[],h=[],v=[],g=[],y=[];for(const c of r.emitters){const G=c.n??8,W=c.spread??.5,l=c.vr??.5,q=c.life??4,U=c.group??-1;for(let C=0;C<G;C++)a.push(c.p[0]+t.range(-W,W),c.p[1]+t.range(-W,W)*(c.flat??.5),c.p[2]+t.range(-W,W)),h.push(c.v[0]+t.range(-l,l),c.v[1]+t.range(-l,l)*.6,c.v[2]+t.range(-l,l)),v.push(U<0?(C+t())/G:t.range(0,c.delay??.4),q*t.range(.8,1.2),c.size[0]*t.range(.8,1.25),c.size[1]*t.range(.75,1.3)),g.push(U,c.tone??0,t(),(c.alpha??.4)*t.range(.7,1)),y.push(c.grav??0,c.drag??.6)}const i=new e.InstancedBufferGeometry,d=new e.PlaneGeometry(1,1);i.index=d.index,i.setAttribute("position",d.getAttribute("position")),i.setAttribute("aP",new e.InstancedBufferAttribute(new Float32Array(a),3)),i.setAttribute("aV",new e.InstancedBufferAttribute(new Float32Array(h),3)),i.setAttribute("aA",new e.InstancedBufferAttribute(new Float32Array(v),4)),i.setAttribute("aB",new e.InstancedBufferAttribute(new Float32Array(g),4)),i.setAttribute("aC",new e.InstancedBufferAttribute(new Float32Array(y),2)),i.instanceCount=a.length/3;const m=new Float32Array(8).fill(-1),B={...O(b),uAges:{value:m},uPuffWind:{value:new e.Vector3(...r.wind??[0,0,0])},uSnowTone:{value:new e.Color(.78,.82,.9)},uPuffClock:b.uTime,uGlowAt:{value:new e.Vector4(...r.glowAt??[0,0,0,0])},uGlowCol2:{value:new e.Color(r.glowCol??"#000000").multiplyScalar(r.glowK??1)},uNearFade:{value:new e.Vector4(2,12,0,0)},uFogK:{value:r.fogK??1},uBellyK:{value:r.belly??0},uSoft:{value:r.soft??0},uFlashAt:{value:new e.Vector4(0,0,0,1)},uFlashCol:{value:new e.Color(0,0,0)},uAshTone:{value:new e.Color(r.ashTone??"#17161a")},uHot:{value:new e.Color("#FF6A22").multiplyScalar(r.hot??1.2)}},k=new e.ShaderMaterial({uniforms:B,vertexShader:oe,fragmentShader:re,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.OneMinusSrcAlphaFactor}),I=new e.Mesh(i,k);return I.frustumCulled=!1,I.renderOrder=r.renderOrder??6,I.name=r.name??"puffs",{object:I,uniforms:B,count:a.length/3,triangles:a.length/3*2,setAge(c,G){m[c]=G}}}const se=`
uniform vec4 uDrift;        // the sheet's middle x, z (stage space), its height, its half size
varying vec3 vW; varying vec2 vL, vS;
void main(){
  vec3 p = vec3(position.x*uDrift.w + uDrift.x, uDrift.z, position.z*uDrift.w + uDrift.y); vL = position.xz; vS = p.xz;
  vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w;
}`,ie=`
precision highp float;
varying vec3 vW; varying vec2 vL, vS;
uniform vec4 uDrift, uDriftLee; uniform sampler2D tDriftG; uniform vec4 uDriftG; uniform vec2 uDriftH;      // the land's height under the sheet: a map, its box (x0, z0, 1/w, 1/d), and (lowest height, span)
uniform vec4 uDriftP;       // wind x, wind z (world), amount, layer seed (a seeded number, different for each sheet)
uniform vec2 uDriftZ;       // plateau begins between these world z (far, near)
uniform float uTime;
${H}
${L}
void main(){
  vec2 wd = uDriftP.xy; vec2 q = vec2(dot(vW.xz, wd), dot(vW.xz, vec2(-wd.y, wd.x))) + uDriftP.w*37.;
  float sp = 11. + 3.*uDriftP.w;
  float gust = smoothstep(.38, .7, sF2(vec2((q.x - uTime*sp*.8)/90., q.y/34.)));
  float st = sF2(vec2((q.x - uTime*sp)/26., q.y/1.5 + .35*sin(q.x*.05 + uDriftP.w)));
  float fine = sN2(vec2((q.x - uTime*sp*1.3)/5., q.y/.35));
  float a = min(smoothstep(.5, .78, st)*(.55 + .45*fine)*(.25 + .75*gust)*uDriftP.z, .9);
  float dist = length(cameraPosition - vW);
  // the streaks lie over the whole plateau. Where one cell of the picture covers more than a streak's own width
  // (about 1.5 m across the wind) they cannot be drawn singly: there they go over to their mean, by the cell's footprint
  // in metres (a declared least width, so they do not shimmer far off)
  { float fw = fwidth(q.y); a = mix(a, min(.16*(.25 + .75*gust)*uDriftP.z, .9), smoothstep(.5, 2.2, fw)); }
  a *= smoothstep(1., .9, max(abs(vL.x), abs(vL.y)))*smoothstep(uDriftZ.x, uDriftZ.y, -vW.z);
  // (fourth part, E2) THE SHEET IS NO PLATE. Inside a streak the snow runs in wisps, a hand's breadth to a forearm
  // across the wind and a few metres along it, faster than the streak, so the snow under the sheet shows between
  // them; the wisps keep the streak's mean and go over to it by the pixel's footprint alone (declared in the header).
  { vec2 qw = vec2((q.x - uTime*sp*1.6)/2.6, q.y/.16 + 1.7*sN2(vec2(q.x/3.1, q.y/.9)));
    float wk = 1. - smoothstep(.3, 1., max(fwidth(qw.x), fwidth(qw.y)));
    a = min(a*mix(1., 2.*smoothstep(.25, .75, .65*sN2(qw) + .35*sN2(qw*2.03 + 17.3)), wk), .9); }
  // AND IT COMES DOWN TO THE SNOW SOFTLY: it thins out over the last 0.3 m of its own height over the land's surface
  // (the land's own heights, from the map the world hands in), so it does not end at the straight cut where a 2 m
  // cell of the land rises through it. Rules of the sheet and the land; the eye's place is not read.
  a *= smoothstep(0., .3, uDrift.z - (texture2D(tDriftG, (vS - uDriftG.xy)*uDriftG.zw).r*uDriftH.y + uDriftH.x));
  // AND NONE BLOWS THROUGH THE TENT: the camp stands in its own lee (opts.lee: its place and two distances from it,
  // none inside the first, whole beyond the second)
  a *= smoothstep(uDriftLee.z, uDriftLee.w, length(vS - uDriftLee.xy));
  if (a < .003) discard;
  vec3 v = normalize(cameraPosition - vW);
  // blown snow is brighter than the packed snow under it, and it takes the afterglow when we look toward it
  vec3 c = vec3(1., 1.03, 1.08)*(sbvSky(vec3(0., 1., 0.))*1.25 + uGlowCol*(.25 + 2.2*pow(clamp(dot(-v, uGlowDir), 0., 1.), 3.)));
  c = sbvFog(c, dist, 1.);
  gl_FragColor = vec4(c*a, a);
}`;function he(b,r){const t=new e.Group;t.name="spindrift";const a=[],h=new e.PlaneGeometry(2,2,1,1).rotateX(-Math.PI/2),v=r.ground||{texture:new e.DataTexture(new Uint8Array([0,0,0,255]),1,1),box:[0,0,1,1],lo:-1e4,span:0};v.texture.needsUpdate=!0;const g=r.layers||[.3,.75],y=i=>(r.amount??.5)/(1+.65*i);for(let i=0;i<g.length;i++){const d={...O(b),uDrift:{value:new e.Vector4(r.centre?r.centre[0]:0,r.centre?r.centre[1]:0,r.y+g[i],r.half??150)},uDriftP:{value:new e.Vector4(r.wind[0],r.wind[1],y(i),r.rng?i+r.rng.range(0,1)*6:i)},uDriftZ:{value:new e.Vector2(r.from??690,r.to??740)},tDriftG:{value:v.texture},uDriftG:{value:new e.Vector4(v.box[0],v.box[1],v.box[2],v.box[3])},uDriftH:{value:new e.Vector2(v.lo,v.span)},uDriftLee:{value:r.lee?new e.Vector4(r.lee[0],r.lee[1],r.lee[2],r.lee[3]):new e.Vector4(0,0,-2,-1)}},m=new e.Mesh(h,new e.ShaderMaterial({uniforms:d,vertexShader:se,fragmentShader:ie,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendSrc:e.OneFactor,blendDst:e.OneMinusSrcAlphaFactor,blendSrcAlpha:e.OneFactor,blendDstAlpha:e.OneMinusSrcAlphaFactor}));m.frustumCulled=!1,m.renderOrder=4+i,t.add(m),a.push(d)}return{object:t,sheets:a,triangles:2*g.length,setAmount(i){a.forEach((d,m)=>{d.uDriftP.value.z=i/(1+.65*m)})}}}async function de(b,r,t){const a=t.rng,h=new e.Group;h.name="moraine";const v=t.shapes||a.fork("shapes"),g=[v.fork("g0"),v.fork("g1"),v.fork("g2")],y=["boulder","rock","slab"].map((f,x)=>{const w=Q.rockGeometry({rng:g[x],kind:f,detail:1,radius:1}),p=w.getAttribute("position"),P=new Float32Array(p.count);let n=1e9,u=-1e9;for(let o=0;o<p.count;o++)n=Math.min(n,p.getY(o)),u=Math.max(u,p.getY(o));for(let o=0;o<p.count;o++)P[o]=(p.getY(o)-n)/Math.max(.001,u-n);return w.setAttribute("aK",new e.BufferAttribute(P,1)),w});await b.yield();const i={...O(r),uIceA:{value:new e.Color("#3b3942")},uIceB:{value:new e.Color("#15141a")},uFrost:{value:new e.Color(.6,.66,.75)},uAshCol:{value:new e.Color("#1c1a1f")},uGlowIce:{value:new e.Color(0,0,0)},uSeracP:{value:new e.Vector2(t.mx??1,.8)}},d=new e.ShaderMaterial({uniforms:i,vertexShader:X,fragmentShader:J}),m=[[],[],[]],B=new e.Matrix4,k=new e.Quaternion,I=new e.Euler,c=new e.Vector3,G=new e.Vector3,W=t.half,l=t.count??320;let q=0;const U=(f,x,w)=>{if(t.blocked&&t.blocked(f,x))return!1;if(t.gap){const P=t.ground(f,x);if(t.gap(f,P-w,P+w,x)<w*1.3+(t.margin??3))return q++,!1}const p=a.int(0,2);return I.set(a.range(-.5,.5),a.range(0,6.28),a.range(-.5,.5)),k.setFromEuler(I),c.set(w*a.range(.8,1.3),w*a.range(.6,1),w*a.range(.8,1.3)),G.set(f,t.ground(f,x)-w*.22,x),m[p].push(B.compose(G,k,c).clone()),!0};let C=0,E=0;for(;C<l&&E<l*8;){E++;const f=a(),x=$(.25,2.6,Math.pow(a(),3));let w,p;if(f<.62){const P=a.sign();p=a.range(-520,215),w=P*(W-34+60*Math.pow(a(),.8)+14*Math.sin(p/47))}else f<.9?(p=a.range(-215,205),w=-62+10*Math.sin(p/60)+a.range(-1,1)*a.range(0,9)):(p=a.range(-95,20),w=a.sign()*a.range(7,30));U(w,p,x)&&C++,E%40===0&&await b.yield()}let V=0;for(let f=0;f<3;f++){if(!m[f].length)continue;const x=new e.InstancedMesh(y[f],d,m[f].length);m[f].forEach((w,p)=>x.setMatrixAt(p,w)),x.instanceMatrix.needsUpdate=!0,x.computeBoundingSphere(),x.name="moraine-"+f,h.add(x),V+=m[f].length*_(y[f])}return{object:h,uniforms:i,triangles:V,count:C,clearance:{refused:q}}}export{de as makeMoraine,fe as makePuffs,ce as makeSeracs,he as makeSpindrift};
