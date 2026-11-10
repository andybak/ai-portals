import*as a from"three";import{makePath as et,clamp as ze,lerp as Me,smoothstep as T}from"../kit/core.js";import{makeSky as tt}from"../kit/sky.js";import*as B from"../kit/fx.js";import*as he from"../kit/fauna.js";import{buildHero as ot,flightRoute as at}from"../parts/world-turtle.js";const it=["#05030f","#2a1a5a","#c94f9a","#2fb8a8","#3f8a4a","#c9a86a","#ffe9a8"],c=a.Vector3,nt=`
attribute vec4 iA;   // phase 0..1, cross-section radius, cross-section angle, speed multiplier
attribute vec4 iB;   // size, hue 0..1, wobble, seed
uniform float uTime, uSpeed, uTail, uE, uAvoid;
uniform vec3 uAx, uCam;
varying float vS, vSide, vFade, vSeed;
varying vec3 vCol;
uniform vec3 uColA, uColB, uColC;
// No comet-fish swims nearer to the route of the flight than uKeep metres (one and a half lengths of its own ribbon). uRt is
// the route near this school, in the school's own frame, at even steps of metres. A fish whose loop would pass within twice
// that margin of the route is carried out, smoothly, to between one and two margins from it: the school parts round the
// line the visitor flies and closes again beyond it. The same rule for every school, the whole flight long.
uniform vec3 uRt[24]; uniform float uKeep;
vec3 keepOff(vec3 c){
  vec3 q = vec3(0.); float ws = 0.;
  for(int i = 0; i < 24; i++){ vec3 d = c - uRt[i]; float w = 1./(dot(d, d) + 4.); w *= w; w *= w; q += uRt[i]*w; ws += w; }
  if(ws < 1e-30) return c;
  q /= ws;                                   // the nearest place of the route, taken smoothly over its samples
  vec3 d = c - q; float l = length(d);
  float l2 = l < 2.*uKeep ? uKeep + l*l/(4.*uKeep) : l;
  return q + (l > 1e-3 ? d/l : vec3(0., 1., 0.))*l2;
}
vec3 traj(float tt){
  float th = iA.x*6.2831853 + tt*uSpeed*iA.w;
  float ph = th - uE*sin(2.*th);
  vec3 c = vec3(cos(ph)*uAx.x, 0., sin(ph)*uAx.z);
  vec3 radial = normalize(vec3(cos(ph)*uAx.z, 0., sin(ph)*uAx.x));
  float r = iA.y*(1. + .35*sin(ph*3. + iB.w*6.28));
  float ang = iA.z + .7*cos(ph*2. + iB.w*11.) + tt*.07*iB.z;
  c += radial*cos(ang)*r + vec3(0., sin(ang)*r*.8, 0.);
  c.y += uAx.y*sin(ph*2. + iB.w*3.1);
  float wig = tt*(2.2 + iB.z*1.6) + iB.w*40.;
  c += radial*sin(wig)*.55*iB.x + vec3(0., cos(wig*.8)*.4*iB.x, 0.);
  return c;
}
void main(){
  float s = position.x + .5; s *= s;
  float tt = uTime - s*uTail;
  vec3 p0 = traj(tt), q0 = traj(tt - .05), p = keepOff(p0), q = keepOff(q0);
  float whip = length(p - q)/max(length(p0 - q0), 1e-4);   // how hard the margin bends the ribbon here (1 = not at all)
  vec3 T = p - q; T = dot(T,T) > 1e-10 ? normalize(T) : vec3(0.,0.,1.);
  vec3 toCam = uCam - p; float dist = length(toCam);
  vec3 sd = cross(T, toCam); sd = dot(sd,sd) > 1e-10 ? normalize(sd) : vec3(0.,1.,0.);
  // teardrop head, a pair of fin flares behind it, then a ribbon tail that widens before it tapers
  float hb = .32*pow(max(sin(3.14159265*clamp(s/.12, 0., 1.)), 0.), .7);
  float fin = .2*exp(-pow((s - .085)/.03, 2.));
  float rib = .45*smoothstep(.07, .3, s)*pow(clamp((1. - s)/.7, 0., 1.), 1.25);
  float w = iB.x*max(max(hb + fin, rib), .07*(1. - s));
  w = max(w, dist*.0019*(1. - s*.7));
  // ribbon flutter grows toward the tail tip
  p += sd*sin(s*13. - uTime*5.5 + iB.w*20.)*.55*iB.x*s;
  p += sd*position.y*w;
  vS = s; vSide = position.y; vSeed = iB.w;
  vCol = mix(mix(uColA, uColB, smoothstep(.0, .55, iB.y)), uColC, smoothstep(.55, 1., iB.y));
  vFade = smoothstep(uAvoid*.35, uAvoid*.9, dist)*(1. - smoothstep(1400., 2600., dist))*mix(.42, 1., smoothstep(18., 95., dist));   // calmer up close: no blown heads
  vFade *= 1. - smoothstep(2., 4.5, whip);     // a ribbon whipped round the margin's tube (its loop ran through the route itself) dims while it is drawn out
  gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(p, 1.);
}`,rt=`
uniform float uTime, uGain;
uniform vec3 uHead;
varying float vS, vSide, vFade, vSeed;
varying vec3 vCol;
void main(){
  // A ribbon thinner than a pixel is sampled past its own edges when the picture is antialiased: the across and along
  // coordinates and the fade are held to the ribbon's own range, or 1 - side*side runs to a large negative and its square glows.
  float side = clamp(vSide, -1., 1.), sv = clamp(vS, 0., 1.), fade = clamp(vFade, 0., 1.);
  float ac = 1. - side*side;
  float head = smoothstep(.1, .02, sv);
  float tail = (1. - sv);
  float pulse = .7 + .3*sin(sv*38. - uTime*7. + vSeed*30.);
  vec3 col = vCol*ac*(.25 + .75*ac)*tail*tail*pulse*1.15*(.55 + .45*smoothstep(.0, .5, abs(side)));   // brighter ribbon edges, like a fin
  col += uHead*head*ac*ac*1.5;
  col += vCol*head*ac*.9;
  gl_FragColor = vec4(col*fade*uGain, 1.);
}`;function me(t,e){const h=e.count,d=14,f=new a.PlaneGeometry(1,2,d,1),s=new a.InstancedBufferGeometry;s.index=f.index,s.setAttribute("position",f.attributes.position);const G=new Float32Array(h*4),y=new Float32Array(h*4);for(let u=0;u<h;u++)G.set([t(),Math.sqrt(t())*e.spread,t()*6.283,t.range(.82,1.22)],u*4),y.set([t.range(e.size[0],e.size[1])*(t.chance(.06)?1.3:1),t(),t(),t()],u*4);s.setAttribute("iA",new a.InstancedBufferAttribute(G,4)),s.setAttribute("iB",new a.InstancedBufferAttribute(y,4)),s.instanceCount=h;const x={uTime:{value:0},uSpeed:{value:e.speed},uTail:{value:e.tail},uE:{value:e.e??0},uAvoid:{value:e.avoid??16},uAx:{value:new c(e.ax[0],e.ax[1],e.ax[2])},uCam:{value:new c(0,1e5,0)},uGain:{value:e.gain??1},uColA:{value:new a.Color(e.colors[0])},uColB:{value:new a.Color(e.colors[1])},uColC:{value:new a.Color(e.colors[2])},uHead:{value:new a.Color(e.head||"#fff1c8")},uKeep:{value:0},uRt:{value:Array.from({length:24},()=>new c(0,1e5,0))}},R=e.tail*e.speed*Math.max(e.ax[0],e.ax[2]),l=1.5*R,r=Math.max(e.ax[0],e.ax[2])+Math.abs(e.ax[1])+e.spread*1.35+2*l;x.uKeep.value=l;const p=new a.ShaderMaterial({uniforms:x,vertexShader:nt,fragmentShader:rt,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide}),i=new a.Mesh(s,p);i.frustumCulled=!1,i.renderOrder=5;const b=new c;return{object:i,uniforms:x,count:h,triangles:h*d*2,keepFrom(u){i.updateMatrixWorld();const m=new c;let v=null,V=0;for(let k=-200;k<=u.length+200;k+=10)u.posAtDist(k,m).distanceTo(i.position)<r&&(v===null&&(v=k),V=k);v!==null&&x.uRt.value.forEach((k,g)=>i.worldToLocal(u.posAtDist(v+(V-v)*g/23,k)))},update(u,m,v){x.uTime.value=m,v&&(i.updateMatrixWorld(),b.setFromMatrixPosition(v.matrixWorld),i.worldToLocal(b),x.uCam.value.copy(b))}}}const st=`
attribute vec3 color; attribute vec2 aFlap;
uniform float uTime, uPhase;
varying vec3 vC, vN, vW;
void main(){
  vec3 p = position;
  float a = sin(uTime*.7 + uPhase - aFlap.x*1.4)*aFlap.x*.55;
  p.y += a*abs(p.x)*aFlap.y;
  vec4 wp = modelMatrix*vec4(p, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix)*normal); vC = color;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,lt=`
uniform vec3 uSun, uSunCol, uFillA, uFillB, uGlow;
varying vec3 vC, vN, vW;
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  float d = clamp(dot(N, uSun)*.6 + .4, 0., 1.);
  vec3 fill = mix(uFillA, uFillB, N.x*.5 + .5);
  float fr = pow(1. - abs(dot(N, V)), 2.5);
  vec3 col = vC*(uSunCol*d + fill) + uGlow*fr*.4;
  gl_FragColor = vec4(col, 1.);
}`;function ut(){const t=[],e=(i,b,u,m,v,V,k,g,L,X=0)=>{i.scale(b,u,m),X&&i.rotateY(X),i.translate(v,V,k);const _=i.attributes.position.count,E=new Float32Array(_*3),W=new Float32Array(_*2),P=i.attributes.position;for(let z=0;z<_;z++){const q=typeof g=="function"?g(P.getX(z),P.getY(z),P.getZ(z)):g;E.set(q,z*3),W.set([L?ze((Math.abs(P.getX(z))-.55)/.9,0,1):0,L],z*2)}i.setAttribute("color",new a.BufferAttribute(E,3)),i.setAttribute("aFlap",new a.BufferAttribute(W,2)),t.push(i)},h=(i,b)=>new a.SphereGeometry(1,i,b);e(h(20,10),1,.42,1,0,.1,0,(i,b,u)=>{const m=Math.hypot(i,u);return b>.42?[.45,.43,.48]:m>.8?[.06,.3,.3]:[.1,.2+.06*Math.sin(i*9+u*7),.1]},0),e(h(14,6),.95,.3,.95,0,-.12,0,[.28,.2,.3],0),e(h(10,6),.2,.17,.5,0,-.1,1.25,[.22,.14,.34],0),e(h(10,6),.25,.2,.3,0,-.08,1.82,[.26,.17,.38],0);for(const i of[-1,1])e(h(8,5),.95,.05,.22,i*1.3,-.1,.42,[.2,.13,.32],1,i*.62),e(h(8,5),.46,.05,.17,i*.88,-.1,-.85,[.2,.13,.32],-.7,i*.75);let d=0,f=0;for(const i of t)d+=i.attributes.position.count,f+=i.index.count;const s=new Float32Array(d*3),G=new Float32Array(d*3),y=new Float32Array(d*3),x=new Float32Array(d*2),R=new Uint16Array(f);let l=0,r=0;for(const i of t){i.computeVertexNormals(),s.set(i.attributes.position.array,l*3),G.set(i.attributes.normal.array,l*3),y.set(i.attributes.color.array,l*3),x.set(i.attributes.aFlap.array,l*2);for(let b=0;b<i.index.count;b++)R[r+b]=i.index.array[b]+l;l+=i.attributes.position.count,r+=i.index.count,i.dispose()}const p=new a.BufferGeometry;return p.setAttribute("position",new a.BufferAttribute(s,3)),p.setAttribute("normal",new a.BufferAttribute(G,3)),p.setAttribute("color",new a.BufferAttribute(y,3)),p.setAttribute("aFlap",new a.BufferAttribute(x,2)),p.setIndex(new a.BufferAttribute(R,1)),p}const ct=`
varying vec2 vUv;
void main(){ vUv = uv*2. - 1.; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,dt=`
uniform vec3 uCore, uArm, uDust; uniform float uTime, uSeed, uGain;
varying vec2 vUv;
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  vec2 p = vUv; float edge = smoothstep(1., .7, length(p));
  // the disc is seen 9 degrees from edge-on: squash y, then read spiral arms in the disc plane
  vec2 d = vec2(p.x, p.y/.16);
  float r = length(d), a = atan(d.y, d.x);
  float arms = .5 + .5*cos(2.*a - 7.*log(r + .06) + uSeed + uTime*.01);
  float n = vn(d*7. + uSeed)*.6 + vn(d*19. + uSeed*2.)*.4;
  float disc = exp(-r*3.6)*(.35 + .9*arms*smoothstep(.05, .3, r))*(.6 + .7*n);
  float bulge = exp(-dot(p*vec2(1., 2.6), p*vec2(1., 2.6))*42.);
  float lane = exp(-pow((p.y + .012 + .01*sin(p.x*9. + uSeed))/.016, 2.))*smoothstep(.75, .1, abs(p.x))*(.55 + .45*vn(p*vec2(30., 6.) + uSeed));
  vec3 col = uArm*disc*1.7 + uCore*(bulge*3.2 + exp(-r*9.)*.9);
  col *= 1. - .82*lane;
  col += uDust*lane*disc*.5;
  float tw = .85 + .15*vn(p*90. + uTime*.6);
  gl_FragColor = vec4(col*edge*uGain*tw, 1.);
}`;function ft(t){return e=>{if(e<=t[0][0])return t[0][1];for(let h=0;h<t.length-1;h++){const d=t[h],f=t[h+1];if(e<=f[0])return Me(d[1],f[1],T(0,1,(e-d[0])/(f[0]-d[0]))*.6+.4*(e-d[0])/(f[0]-d[0]))}return t[t.length-1][1]}}var vt={id:"world-turtle",name:"The World Turtle",category:"bizarre",weirdness:1,async build(t){const e=t.rng,h=t.quality&&t.quality.detail>0?t.quality.detail:1,d=new a.Scene;d.background=new a.Color("#010006");const f={value:0},s={nebula:e.pick([["#3b2a9c","#c94f9a","#2fd0bc"],["#4a2aa6","#d2568f","#38d4c8"],["#2a34a0","#b84fb4","#2fd0bc"],["#5a2896","#e0607a","#3ac0d8"]]),nebulaSeed:e.range(0,60),nebulaCover:e.range(.7,.8),milkyAngle:e.range(0,360),dayOffset:ze(e.range(-14,9),-8,4),fishCount:e.int(240,360),fishHue:e.pick(["teal","rose","gold"]),birds:e.pick(["geese","flamingos","geese"]),birdSide:e.chance(.5)?1:-1,gulls:e.int(10,26),lanterns:!0,lanternCount:e.int(45,95),clouds:e.int(5,9),farTurtles:e.int(2,4),meteors:e.int(8,18),dust:e.range(.8,1.25),ribbons:e.int(3,5),galaxySeed:e.range(0,20),galaxyRoll:e.range(-.5,.5)},G=e.fork("fish"),y=e.fork("far"),x=e.fork("cloud"),R=e.fork("ribbon"),l=await ot(t,{palette:it,progress:0});d.add(l.object);const r=l.anchors,p=l.seaY;await t.yield();const i=r.flipperTips[0].x,b=at(r),u=b.pts,m=b.index;await t.yield();const v=et(u);await t.yield();const V=42,k=Math.round(v.length/V),g=o=>v.nearestXZ(o[0],o[2]).u,L=o=>v.nearestXZ(o.x,o.z).u,X=L(r.viewpoints.entry),_=g(u[m.tail]),E=g(u[m.aft]),W=L(r.peak),P=L(r.city),z=g(u[m.rim]),q=g(u[m.out]),Te=g(u[m.flank]),ee=g(u[m.turn]),Y=g(u[m.neck]),H=g(u[m.eye]),pt=g(u[m.beak]),te=g(u[m.leg]),oe=g(u[m.loop]),Be=g(u[m.loopEnd]),D=r.portalSeat.position,ae=r.portalSeat.facing;await t.yield();const O=tt({rng:e,preset:"space",bake:!0,renderer:t.renderer,nebula:.8,nebulaColors:s.nebula,nebulaCoverage:s.nebulaCover-.08,nebulaScale:.9,nebulaSeed:s.nebulaSeed,milkyWay:.34,milkyAngle:s.milkyAngle,milkyColor:"#2a8f9c",milkyCore:"#58c8c0",stars:1,starDensity:.85,twinkle:.35,sunIntensity:0,sunGlow:0});d.add(O.object),await t.yield();const C=B.fxGroup();d.add(C.object);const we=new c(-.42,.2,.88).normalize(),I=new a.Mesh(new a.PlaneGeometry(2100,2100),new a.ShaderMaterial({uniforms:{uCore:{value:new a.Color(1,.82,.55)},uArm:{value:new a.Color(.42,.5,1)},uDust:{value:new a.Color(.9,.3,.5)},uTime:f,uSeed:{value:s.galaxySeed},uGain:{value:.85}},vertexShader:ct,fragmentShader:dt,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide}));I.frustumCulled=!1,I.renderOrder=0,I.quaternion.setFromRotationMatrix(new a.Matrix4().lookAt(we,new c,new c(0,1,0))),I.rotateZ(.42+s.galaxyRoll),d.add(I),await t.yield();const Re=ut(),ve=[],ie=[],ne=[],re=[],Ge=y.shuffle([[.78,.04,.62],[-.72,.1,.68],[-.9,.1,.35],[.35,-.28,.9],[-.25,-.2,.95],[.9,.2,-.2]]);for(let o=0;o<s.farTurtles;o++){const n=new c(...Ge[o]).normalize(),w=y.range(2400,4200),S=y.range(16,28),M=60,F=new a.Color(y.pick(["#2fb8a8","#c94f9a","#ffe9a8"])).multiplyScalar(.7),j=new a.ShaderMaterial({uniforms:{uTime:f,uPhase:{value:y.range(0,6)},uSun:l.uniforms.uSunDir,uSunCol:{value:new a.Color(1.3,1,.7)},uFillA:{value:new a.Color("#c94f9a").multiplyScalar(.5)},uFillB:{value:new a.Color("#2fb8a8").multiplyScalar(.5)},uGlow:{value:F}},vertexShader:st,fragmentShader:lt}),A=new a.Mesh(Re,j);A.position.copy(n).multiplyScalar(w),A.position.y+=p,A.scale.setScalar(S);const N=new c(0,1,0).cross(n.clone().negate()).normalize();A.quaternion.setFromAxisAngle(N,y.range(.45,.8)),A.rotateY(y.range(0,6.28)),d.add(A),ve.push({m:A,spin:y.range(-.01,.01)}),ie.push([A.position.x,A.position.y+S*.3,A.position.z]),ne.push(F.clone().multiplyScalar(1.4)),re.push(M*3.6);const pe=new c(y.range(-1,1),.9,y.range(-1,1)).normalize().multiplyScalar(S*2.6).applyQuaternion(A.quaternion).add(A.position);ie.push([pe.x,pe.y,pe.z]),ne.push(new a.Color(1.6,1.1,.55)),re.push(M*.9)}C.add(B.makeGlows({positions:ie,colors:ne,sizes:re,size:1,intensity:.7,halo:1.2,core:.4,flicker:.15,fog:!1,time:f})),await t.yield();const ge="#ffe9a8",Pe="#2fb8a8",Ee="#c94f9a";C.add(B.makeParticles({rng:e.fork("dust"),preset:"dust",count:Math.round(3200*s.dust*h),box:[280,190,300],velocity:[-1.5,.4,-26],velocityRandom:[3,2,9],turbulence:[2.5,2,.02],size:[.22,.85],colors:[ge,"#bfeee6","#f3a6d2"],intensity:2.4,twinkle:.6,fog:!1,time:f,near:[3,14]})),await t.yield(),C.add(B.makeParticles({rng:e.fork("dust2"),preset:"dust",count:700,box:[90,60,110],velocity:[-1,.2,-20],velocityRandom:[2,1.5,6],turbulence:[1.2,1,.05],size:[.06,.2],colors:["#ffffff",ge,"#c8f4ff"],intensity:2.2,twinkle:.8,fog:!1,time:f,near:[2,8]})),await t.yield(),C.add(B.makeShootingStars({rng:e.fork("met"),count:s.meteors,period:[3,10],minElevation:-.55,radius:3e3,color:"#fff3d8",tailColor:"#7fd8ff",intensity:4,time:f})),await t.yield();const se=[];for(let o=0;o<s.ribbons;o++){const n=o%2?-1:1,w=n*R.range(470,640)+(n>0?60:0),S=p+R.range(-190,40),M=R.range(25,70),F=R.range(0,6),j=[];for(let A=0;A<=9;A++){const N=A/9;j.push(new c(w+Math.sin(N*5+F)*M-n*80*Math.sin(N*Math.PI),S+Math.cos(N*4+F)*M*.5,900-N*1800))}se.push(j)}se.push([D.clone().add(new c(-40,-46,120)),D.clone().add(new c(30,-38,-60)),new c(190,p-80,470),new c(520,p-135,300),new c(585,p-130,80),new c(520,p-155,-160),new c(400,p-170,-520)]),C.add(B.makeRibbon({rng:R,curves:se,width:5,segments:140,wave:.2,speed:.55,frequency:7,intensity:.4,colors:[Pe,Ee],trail:.3,heads:3,near:[40,120],maxAngle:.02,fog:!1,time:f})),await t.yield();const le={teal:["#2fb8a8","#59d6ff","#c94f9a"],rose:["#c94f9a","#ff8fb8","#59d6ff"],gold:["#ffb45a","#ffe9a8","#2fb8a8"]}[s.fishHue],Z=me(G,{count:s.fishCount,spread:26,size:[.8,1.6],speed:.2,tail:1.7,e:.3,ax:[30,9,170],avoid:22,colors:le,gain:.7});Z.object.position.set(i-40,p-118,80);const U=me(G,{count:96,spread:6,size:[.7,1.4],speed:.27,tail:1.5,e:0,ax:[33,1.5,33],avoid:10,colors:le,gain:.9});U.object.position.copy(D).addScaledVector(ae,16),U.object.quaternion.setFromUnitVectors(new c(0,1,0),ae);const K=me(G,{count:26,spread:14,size:[.5,.9],speed:.12,tail:1.6,e:.1,ax:[150,14,250],avoid:14,colors:le});K.object.position.set(60,p+150,40),K.object.rotation.z=.5,d.add(Z.object,U.object,K.object);for(const o of[Z,U,K])o.keepFrom(v);await t.yield();const ue=D.clone().addScaledVector(ae,150);C.add(B.makeParticles({rng:e.fork("ice"),preset:"snow",follow:!1,center:[ue.x,ue.y,ue.z],box:[170,90,360],count:Math.round(1500*h),velocity:[-.6,-.5,-7],velocityRandom:[1.5,1,3],size:[.14,.5],colors:["#ffffff","#bfe9ff","#9fd8ff"],intensity:2.3,twinkle:1,shape:"sparkle",fog:!1,time:f})),await t.yield(),C.add(B.makeGlow({position:[D.x,D.y,D.z],size:70,color:"#9fdcff",intensity:.5,halo:1,core:.2,fog:!1,time:f}));const be=[];for(let o=0,n=0;o<s.clouds&&n<200;n++){const w=x.range(0,6.283),S=x.range(55,150),M=r.peak.x+Math.sin(w)*S,F=r.peak.z+Math.cos(w)*S,j=Math.max(l.heightAt(M,F)+22,p+x.range(48,105));v.distanceTo(M,j,F)<75||(be.push({position:[M,j,F],scale:x.range(.42,.7)}),o++)}const ce=B.makeCloudPuffs({rng:x,time:f,clouds:be,puffs:16,sunDir:l.sun.direction.clone(),sunColor:"#ffd9a8",color:"#f6e6e0",shadowColor:"#4b3a86",ambient:"#1c1640",rim:.9,scatter:.25,opacity:.9,drift:[0,0,0],veil:0,fog:!1});C.add(ce),await t.yield();const Q={_resolved:!0,sunDir:new c(.4,.6,-.4).normalize(),sunColor:new a.Color(1.6,1.3,1),sky:new a.Color(.55,.45,.9),ground:new a.Color(.2,.45,.45)},J=he.makeFauna(d,{light:Q});await t.yield(),J.add(he.makeFlock({rng:e.fork("birds"),species:s.birds,size:1.5,count:s.birds==="geese"?17:21,cross:{path:v,u:E,lead:170,height:-8,angle:60,side:s.birdSide,span:520,duration:k}}),{always:!0}),await t.yield(),J.add(he.makeFlock({rng:e.fork("gulls"),species:"gulls",count:Math.round(s.gulls*1.5),size:2,center:[r.peak.x-30,r.peak.y-55,r.peak.z+10],radius:95,height:26,speed:9})),await t.yield(),C.add(B.makeLanterns({rng:e.fork("lan"),time:f,count:s.lanternCount,center:[r.city.x,r.city.y+22,r.city.z],area:[130,38,130],rise:.9,sway:1.2,wind:[-.4,0,-.3],size:1.1,colors:["#ffb45a","#ff7a9a"],intensity:2.4,glow:1.1,glowSize:5,floor:p+2,heightAt:l.heightAt,fog:!1})),await t.yield();const qe=r.lipBearing,$=e.fork("lipmist"),ye=[];for(let o=0;o<14;o++){const n=qe+$.range(-.3,.22),w=l.anchors.rimRadius+$.range(6,26);ye.push([Math.sin(n)*w,p-$.range(4,46),Math.cos(n)*w])}C.add(B.makeMist({rng:$,time:f,positions:ye,size:[14,30],color:"#6fb4bc",opacity:.13,flatten:.8,floorFade:0,fog:!1})),await t.yield();const de=s.dayOffset,De=ft([[X,46+de],[_,27+de*.5],[E,14.5+de*.15],[W,8.5],[P,4.5],[z,-.8],[Te,-1.2],[Y,-2.2],[H,-3],[oe,-3.6],[1,-5.5]]),Ae=r.rimRadius,je=(o,n,w)=>new c(Math.sin(o)*Ae*n,w,Math.cos(o)*Ae*n),xe=o=>o/v.length,Ve=je(Math.atan2(r.flipperRoot.x,r.flipperRoot.z)-.3,1,p-12),Le=r.flipperRoot.clone(),_e=new c,Ie=(o,n)=>_e.lerpVectors(Ve,Le,T(z,q,n)),Ne=new c(25,p-4,10),We=new c(30,p-28,360),He=new c,Oe=(o,n)=>He.lerpVectors(Ne,We,T(ee-.03,Y-.03,n)),Ue=o=>T(q-.02,q+.04,o)*(1-T(ee,ee+.07,o)),Ke=o=>T(H+.012,te,o)*(1-T(oe-.035,oe+.02,o)),Xe=r.head.clone().lerp(r.beakTip,.5),ke=new c,Ye=(o,n)=>(ke.lerpVectors(r.eyeRight,Xe,T(H,te,n)),ke.lerp(r.head,T(te,Be,n))),Ce=e.fork("blink"),Se=Ce.range(9,13),Ze=Ce()*Se,fe=.43,Fe=.29,Qe=.43,Je=o=>{const n=(o+Ze)%Se;return T(0,fe,n)*(1-T(fe+Fe,fe+Fe+Qe,n))},$e=new a.Color;return await t.yield(),await O.prewarm(t.renderer,null,d),{scene:d,path:v,duration:k,camera:{fov:62,near:1,far:6e3,lookAhead:60,sway:.7,bank:.7},pois:[{at:r.lookAt.world,from:0,to:E,weight:.55},{at:r.peak.clone().setY(r.peak.y-35),from:_,to:W,weight:.35},{at:r.lookAt.city,from:E,to:P,weight:.45},{at:Ie,from:P-xe(120),to:q+xe(80),weight:.7,fade:.25},{at:Oe,from:q-.03,to:Y-.01,weight:.8,fade:.26},{at:r.eyeRight,from:Y-.04,to:H+.02,weight:.7},{at:Ye,from:H-.012,to:1,weight:.86,fade:.1}],pace:o=>1-.45*Ue(o)+.6*Ke(o),portal:{shape:"circle",radius:10,color:"#bfe9ff",glow:1.1,revealDistance:420},post:{exposure:1,bloom:{strength:.6,radius:.7,threshold:.9},grade:{saturation:1.1,contrast:1.05,tint:"#ffffff",shadowTint:"#05020e",vignette:.36,grain:.02,aberration:0}},update(o,n,w,S){f.value=n,l.setProgress(S),l.setSunAngle(De(S)*Math.PI/180),l.setBlink(Je(n)),l.update(o,n,w),O.update(o,n,w),O.object.rotation.y=n*.003,I.position.copy(w.position).addScaledVector(we,5e3);const M=l.sun.night;Q.sunDir.copy(l.sun.direction),Q.sunColor.copy(l.sun.color).multiplyScalar(.75),J.setLight(Q),J.update(o,n,w,S),ce.uniforms.uSunDir.value.copy(l.sun.direction),ce.uniforms.uSunColor.value.copy($e.copy(l.sun.color).multiplyScalar(Me(.62,.4,M))),C.update(o,n,w),Z.update(o,n,w),U.update(o,n,w),K.update(o,n,w);for(const F of ve)F.m.rotateY(F.spin*o)},dispose(){O.dispose(),l.dispose()}}}};export{vt as default};
