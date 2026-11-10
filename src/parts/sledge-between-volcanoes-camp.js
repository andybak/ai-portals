import*as e from"three";import"../kit/core.js";import{sharedUniforms as J,SBV_NOISE as G,SBV_LIGHT as Z,Acc as rt}from"./sledge-between-volcanoes-common.js";import{makeTrack as tt,addSledge as ht}from"./sledge-between-volcanoes-travellers.js";const zt=6.5,et=.6,C={hx:1.5,hz:3.1,h:1.16,ribs:2},j={at:C.hz+.5,r:1.8,k:.2},dt=`
float sbvDoorPool(vec2 xz, vec4 tent){ vec2 dd = xz - (tent.xy + tent.zw*${j.at.toFixed(2)}); return ${j.k.toFixed(2)}*exp(-dot(dd, dd)/${(j.r*j.r).toFixed(3)}); }
`,ot=.95,ct=`
float sbvTentShade(vec2 xz, vec4 tent){ vec2 tl = xz - tent.xy; tl = vec2(tl.x*tent.w - tl.y*tent.z, dot(tl, tent.zw));
  return 1. - .85*exp(-length(max(abs(tl) - vec2(${ot.toFixed(2)}, ${C.hz.toFixed(2)}), 0.))/2.); }
`,w=2.48,K=[-w,-1.1,1.1,w],mt=`
attribute vec2 aUv;          // x: 0..1 along the tent, y: 0..1 over the arch from one hem to the other
uniform float uTime; uniform vec4 uTentWind;      // wind in the tent's own frame (x, z), strength, ribs
varying vec3 vW, vN, vL; varying vec2 vUv;
${G}
void main(){
  // cloth between the ribs is loose: it bellies and snaps with gusts that travel down the wind
  // (third part, C1) held along the ridge, at the eaves and at the hem: loose on each slope and each wall between them
  float rib = abs(sin(aUv.x*3.14159265*uTentWind.w)), sl = abs(1. - 2.*aUv.y);
  float arch = sl < .625 ? sin(sl*5.0265482) : .5*sin((sl - .625)*8.3775804);
  float loose = rib*rib*arch;
  float gust = sN2(vec2(dot(position.xz, uTentWind.xy)*.9 - uTime*3.1, uTime*.6));
  float snap = sin(uTime*11. + aUv.x*23. + aUv.y*7.)*.5 + sin(uTime*17.3 + aUv.x*41.)*.3;
  vec3 p = position + normal*loose*(-.05 + .05*gust + .016*snap*(.4 + gust))*uTentWind.z;
  vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; vL = p; vUv = aUv;
  vN = normalize(mat3(modelMatrix)*(normal + vec3(0., .0, .0)));
  gl_Position = projectionMatrix*viewMatrix*w;
}`,vt=`
precision highp float;
varying vec3 vW, vN, vL; varying vec2 vUv;
uniform float uTime, uLit; uniform vec3 uCloth, uLamp, uLampAt; uniform vec4 uTentWind; uniform vec4 uBodies;      // uBodies: where each of the two sits, in the tent's frame: A (x, z), B (x, z)
${G}
${Z}
const float POLE_U = ${(w/C.hz).toFixed(4)};      // where the poles stand along the tent, as a share of its half length
// (polish 1) the shadow of a seated person on the wall, drawn in the wall's own metres. p: (along the tent, height);
// at: where along the tent it sits; lean: how far the head leans along the tent; s: its size (1 = a metre tall)
float sbvFigure(vec2 p, float at, float lean, float s){
  vec2 q = vec2(p.x - at, p.y)/s; float zc = lean*clamp(q.y/.6, 0., 1.3);
  // (sixth part, S4) a trunk that narrows from the floor to the shoulders, shoulders that slope in to the neck, and
  // a hooded head of a head's size (it was a square block with a small knob on it)
  float body = max(abs(q.x - zc) - mix(.4, .34, clamp(q.y/.46, 0., 1.))*(1. - .75*smoothstep(.46, .72, q.y)), q.y - .72);
  float head = length((q - vec2(zc*1.15 + lean*.1, .82 - .45*abs(lean)))*vec2(1., .92)) - .2;      // (fifth part, J3: a head that leans is bowed: it sinks toward the shoulders)
  return 1. - smoothstep(-.02, .06, min(body, head));      // (third part: soft-edged; fourth part: a firmer edge)
}
float bodyShadow(vec3 c, float r){ vec3 d = vL - uLampAt; float t = clamp(dot(c - uLampAt, d)/max(dot(d, d), 1e-4), 0., 1.); return 1. - smoothstep(r*.55, r*1.35, length(uLampAt + d*t - c)); }
void main(){
  // the relief of the cloth from the screen-space change of its own position
  vec3 fc = cross(dFdx(vW), dFdy(vW)); vec3 n = dot(fc, fc) > 1e-14 ? normalize(fc) : normalize(vN); if (dot(n, vN) < 0.) n = -n; n = normalize(mix(normalize(vN), n, .6) + vec3(0., 1e-4, 0.));
  float weave = sN2(vUv*vec2(240., 150.)), stain = sF2(vUv*vec2(5., 3.) + 2.);
  // (polish 1) the cloth is sewn: a seam along the ridge and one over each pole; (third part, C1) and five more that
  // run down the slopes and walls from ridge to hem, a panel's width (1.03 m) apart
  float endK = smoothstep(POLE_U, POLE_U + .015, abs(2.*vUv.x - 1.));                      // (fourth part) 1 on the two triangular ends
  float sl = abs(1. - 2.*vUv.y), roofK = (1. - smoothstep(.57, .66, sl))*(1. - endK);      // sl: 0 at the ridge, .625 at the eaves, 1 at the hem
  float su = abs(fract(vUv.x*6. + .5) - .5)/6., sw = max(fwidth(vUv.x), 1e-4);
  float seam = max(1. - smoothstep(.0, .014, abs(vUv.y - .5)), 1. - smoothstep(.0, .01, abs(abs(2.*vUv.x - 1.) - POLE_U)));
  seam = max(seam, (1. - smoothstep(.004, .004 + sw, su))*min(1., .008/sw));
  vec3 alb = uCloth*(.86 + .14*weave)*(.9 + .2*stain)*(1. - .3*seam);
  // (third part, C1) a little snow lies along the ridge on both slopes and thickens toward the windward end (the
  // tent lies along the wind, its back to it: its weather slope is that end's), in broken patches
  float lie = .05 + .4*(1. - smoothstep(0., .4, vUv.x));
  float snowK = .85*roofK*(1. - smoothstep(lie - .08, lie + .08, sl/.625 + .45*(sF2(vec2(vUv.x*17., sl*6. + step(.5, vUv.y)*9.)) - .5)));
  alb = mix(alb, vec3(.62, .68, .76), snowK);
  float frost = (1. - smoothstep(0., .16, vL.y))*.5;                   // rime and drift at the hem (third part: the lowest 16 cm, so the lit wall is cloth)
  alb = mix(alb, vec3(.62, .68, .76), frost*(.5 + .5*stain));
  vec3 c = alb*sbvLight(vW, n)*mix(.5, 1., max(snowK, frost));      // (third part: the cloth is a weathered dun, dark under the dusk; the snow on it is not)
  // lit from inside: brightest low near the lamp, the ribs and seams dark against it, and the two as soft shadows
  float lampD = length(vL - uLampAt);
  // (each of the two is a body rising from the floor between the light and the wall they sleep along: A sits
  //  upright and throws a tall shadow; B sits by it, bowed over its knees, and throws a lower, smaller one)
  // (the stove stands low in the middle of the tent, a little to one side, its open door toward the two: its light is
  //  thrown at the wall they sit along, low, and that wall carries their two shadows; the wall behind the stove keeps
  //  only a dim glow)
  float door = smoothstep(.1, .7, dot(normalize(vL - uLampAt), vec3(-sign(uLampAt.x), -.05, 0.)));
  // (second part, B2) the whole cloth is lit by its own light, on every visit alike: both slopes, brightest low by the stove
  // (third part, C1) no part of the cloth is white: its brightest place is a warm amber, well under white after the
  // picture's bloom, at ONE place (low, by the stove); from there it falls off toward both ends and toward the ridge,
  // the two slopes of the roof (cloth turned to the sky) are darker than the walls, and the snow lying on it is dark
  // (fourth part, E1a) a notch or two brighter and a deeper amber: the lit wall's brightest place is 0.9 of the
  // lamp's strength (0.5), tinted (1, 0.74, 0.42), so its red is full, its green about a half and its blue low
  // (never white); it falls off more slowly down the tent's length; the slopes are at six tenths of the walls; the
  // two ends glow too, dimly and evenly (the lamp's light down the length of the tent). The cloth is a dun canvas.
  // Tuned on the camp as a whole (cloth, snow and sledge together) on a dusk, a night and a copper visit.
  float glow = (.03 + .9*(.3 + .7*door)*exp(-lampD*lampD*.13) + .3*endK*exp(-lampD*lampD*.05))*(1. - .6*smoothstep(.2, 1.5, vL.y))*mix(1., .6, roofK)*(.8 + .2*weave)*(1. - .7*frost)*(1. - .9*snowK);
  // (polish 1) the two as SEATED people's shadows on the wall they sit along: heads, shoulders, bodies down to the
  // floor; one sits upright, the other is bowed; they move a little (the same slow movements as before)
  float wallK = smoothstep(.15, .5, -sign(uLampAt.x)*vL.x);
  // (third part, C1) thrown large by the low light: head and shoulders of each stand on the wall and the foot of the
  // slope above it
  // (fourth part, E1d) each is head, shoulders and trunk down to the floor
  // (fifth part, J3) the two sit close and are unlike: one sits upright and tall (1.42: its head's top 1.45 m up),
  // the other, 0.85 m along the wall from it, is smaller (1.0) and bowed over its knees, away from the first, its
  // head low (its top 0.94 m up); their bodies overlap from the floor to the shoulders, by 0.12 m at the floor, and
  // there is a notch between the two heads. They were 2.15 m apart and near of a height.
  float sh = wallK*(1. - endK)*max(sbvFigure(vL.zy, -.5 + .25*(uBodies.y + .35), .04 + .5*(uBodies.x + .5*sign(uLampAt.x)), 1.42),
                       sbvFigure(vL.zy, .35 + .2*(uBodies.w - .9), .22 + .6*(uBodies.z + .95*sign(uLampAt.x)), 1.));
  glow *= 1. - .45*seam;
  glow *= 1. - .93*sh;
  c += uLamp*vec3(1., .74, .42)*glow*uLit;      // (third part: what comes through the dun cloth is amber, never white; fourth part: a deeper amber)
  gl_FragColor = vec4(sbvFog(c, length(cameraPosition - vW), 1.), 1.);
}`;function pt(T){const P=Math.min(Math.abs(T),w)/w;let i=0;for(let u=0;u<3;u++)T>=K[u]&&T<=K[u+1]&&(i=(T-K[u])/(K[u+1]-K[u]));const x=4*i*(1-i);return{ridge:1.46+.28*P*P,eaveX:1-.11*x,eaveY:.56-.04*x,hem:ot}}function ut(){const i=[],x=[],u=[];for(let f=0;f<=30;f++){const l=f/30,y=l*2-1,E=y*C.hz,c=Math.abs(E),m=pt(Math.max(-w,Math.min(w,E))),n=Math.max(0,(c-w)/(C.hz-w));for(let F=0;F<=16;F++){const S=F/16,r=1-2*S,b=Math.abs(r),_=r<0?-1:1;let k,z;if(b<=.625){const W=b/.625;k=_*m.eaveX*W,z=m.ridge+(m.eaveY-m.ridge)*W}else{const W=(b-.625)/.375;k=_*(m.eaveX+(m.hem-m.eaveX)*W),z=m.eaveY*(1-W)}n>0&&(k=k+(r*m.hem-k)*n,z=z*(1-n)),i.push(k,z-.03,E),x.push(l,S)}}for(let f=0;f<30;f++)for(let l=0;l<16;l++){const y=f*17+l,E=y+1,c=y+16+1,m=c+1;u.push(y,c,E,E,c,m)}const g=new e.BufferGeometry;return g.setAttribute("position",new e.Float32BufferAttribute(i,3)),g.setAttribute("aUv",new e.Float32BufferAttribute(x,2)),g.setIndex(u),g.computeVertexNormals(),g}const ft=`
attribute vec3 color; attribute float aK, aPart;
uniform float uTime; uniform vec4 uTentWind;
varying vec3 vW, vN, vC; varying float vPart;
void main(){
  vec3 p = position; float sw = aPart < .5 ? aK*aK : 0.; p.xz += uTentWind.xy*sw*(.035*sin(uTime*13. + position.x*9.) + .02*sin(uTime*21. + position.z*5.));
  vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); vC = color; vPart = aPart;
  gl_Position = projectionMatrix*viewMatrix*w;
}`,wt=`
precision highp float;
varying vec3 vW, vN, vC; varying float vPart;
uniform vec3 uLamp, uLampW, uLampC; uniform float uLit; uniform vec4 uTentW;      // uTentW: the tent's middle (world x, z) and its long axis (x, z)
${G}
${Z}
${ct}
${dt}
const float CLOTH_K = ${et.toFixed(2)};
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 alb = vC; float snowK = smoothstep(.35, .8, n.y + .3*(sN2(vW.xz*3.) - .5));
  // (fourth part, E1e) the sledge by the tent (part 9): weathered wood, canvas and harness, greyed and paler, with
  // little snow lying on it and rime on all of it, so it takes the light much as the snow about it does (six tenths
  // as a face turned up, four tenths as its own face); it takes a share of the tent's light on its near side
  float sled = step(8.5, vPart);
  alb = mix(alb, vec3(.5, .47, .42), .5*sled)*(1. + .25*sled);
  alb = mix(alb, vec3(.62, .68, .76), snowK*(abs(vPart - 1.) < .5 ? 1. : .5 - .3*sled));
  // the tent's light falls on what stands near it
  vec3 d = uLampW - vW; float l = length(d); float lamp = clamp(dot(n, d/max(l, .01))*.7 + .3, 0., 1.)/(1. + l*l*.22);
  // the tent's own shade (TENT_SHADE, the one rule): on the sky's light only
  float shade = sbvTentShade(vW.xz, uTentW);
  // (third part, C1: it comes through the cloth, amber, so the snow banked on the wall is not white. As the text
  //  has it: the camp's snow (part 1: the banked snow, the drift tail, the guy lines' lumps) takes 2.4 x 0.6 = 1.44
  //  of the lamp's glow, amber as the cloth (live: 1.4, the lamp's own colour); the skis and the lines 1.4 x 0.6 =
  //  0.84; the sledge 0.84 x 0.55 = 0.46, paler)
  // (and the camp's snow takes the light out of the door as the land beside it does: DOOR_POOL, the one declaration)
  float door = abs(vPart - 1.) < .5 ? sbvDoorPool(vW.xz, uTentW) : 0.;
  vec3 c = alb*(mix(sbvLight(vW, n), sbvLight(vW, vec3(0., 1., 0.)), .6*sled)*shade + uLampC*door*uLit + uLamp*mix(vec3(1., .74, .42), vec3(1., .95, .8), sled)*lamp*uLit*((abs(vPart - 1.) < .5 ? 2.4 : 1.4)*CLOTH_K)*(1. - .45*sled));
  gl_FragColor = vec4(sbvFog(c, length(cameraPosition - vW), 1.), 1.);
}`;async function Mt(T,P,i){const x=i.rng,u=i.ground,[g,f]=i.at,l=i.wind||[-1,0],y=new e.Group;y.name="camp";const E=i.life||x.fork("life"),c=[];for(let t=0;t<8;t++)c.push(E.range(0,6.283));const m={value:0},n=new e.Group;n.position.set(g,u(g,f),f),n.rotation.y=Math.atan2(l[0],l[1]),y.add(n);const F=Math.atan2(l[0],l[1]),S=i.march||[l[0],l[1]],r=-S[0]*Math.cos(F)+S[1]*Math.sin(F)>=0?-1:1,b=[-2.5*r,-4.2],_=new e.Color(i.lamp??"#FFB060"),k={value:new e.Vector4(0,1,1,C.ribs)},z={value:0},W=new e.Vector3,R=new e.Vector4,O=new e.Vector3,q=new e.Vector3,B={...J(P),uTentWind:k,uLit:z,uCloth:{value:new e.Color("#9a8f78")},uLamp:{value:_.clone().multiplyScalar(i.glow??1.5)},uLampAt:{value:new e.Vector3(.3*r,.25,.05)},uBodies:{value:new e.Vector4(-.5*r,-.35,-.95*r,.9)}},D=new e.Mesh(ut(),new e.ShaderMaterial({uniforms:B,vertexShader:mt,fragmentShader:vt,side:e.DoubleSide}));D.name="tent",n.add(D),await T.yield();const o=new rt;o.id(1).color("#9fb0c8"),o.kv=0,o.ball(0,-.15,-C.hz-.35,2.1,.85,1.5,12,6),o.ball(-1.42,-.2,-.6,.75,.4,2.3,10,5),o.ball(1.42,-.2,-.7,.75,.38,2.2,10,5),o.ball(.4,-.25,C.hz+2.6,1.3,.42,2.4,10,5);const at=new e.Quaternion().setFromEuler(new e.Euler(0,Math.PI+.22,0,"YXZ"));o.m=new e.Matrix4().compose(new e.Vector3(b[0],.3,b[1]),new e.Quaternion().setFromEuler(new e.Euler(0,Math.PI+.22,-1.2*r,"YXZ")),new e.Vector3(1,1,1)),ht(o),o.m=new e.Matrix4().compose(new e.Vector3(b[0],0,b[1]),at,new e.Vector3(1,1,1)),o.id(0).color("#241e19"),o.tube([[-.24,.3,-1.6,.014],[-.34,.08,-2.2,.014],[-.62,.03,-3,.014],[-.42,.03,-3.9,.014],[-.5,.03,-4.4,.03]],4,!0,!0),o.tube([[.24,.3,-1.6,.014],[.3,.08,-2.3,.014],[.52,.03,-3.3,.014],[.9,.03,-4,.014],[1,.03,-4.5,.03]],4,!0,!0),o.m=null,o.id(0);const I=(t,d,a,s,v)=>{const p=Math.sin(a)*Math.cos(s),M=Math.sin(a)*Math.sin(s),h=1.95,N=[];for(let A=0;A<=5;A++){const L=A/5,Q=L>.8?(L-.8)*.5:0;N.push([t+p*h*L+Math.cos(s)*Q*.3,-.25+Math.cos(a)*h*L,d+M*h*L+Math.sin(s)*Q*.3,[.13*(L>.9?.6:1),.014]])}o.color(v).tube(N,4,!0,!0)};for(const[t,d]of[[-3.6*r,-1.6],[-3.9*r,-.5]]){const a=x.range(0,3),s=x.range(.03,.09);I(t,d,s,a,"#7a6a52"),I(t+.17,d+.05,s+x.range(.02,.07),a+x.range(-.3,.3),"#6b5c47")}o.id(0).color("#241e19"),o.kv=0;for(const t of[-w,w])o.tube([[0,1.5,t,.03],[0,1.75,t,.03]],5,!0,!0);for(const[t,d,a,s,v]of[[0,1.71,w,0,5],[0,1.71,-w,.6*r,-5.4],[1,.53,1.1,2.7,1.5],[-1,.53,1.1,-2.7,1.5],[1,.53,-1.1,2.7,-1.3],[-1,.53,-1.1,-2.7,-1.3]]){o.id(0).color("#241e19"),o.kv=0,o.tube([[t,d,a,.012],[(t+s)/2,d*.47,(a+v)/2,.012],[s,.12,v,.012]],4,!0,!0),o.id(1).color("#9fb0c8");{const p=1+.15*Math.sin(t*2.1+a*1.7);o.ball(s,.02,v,.27*p,.16*p,.23/p,8,4)}}const X={...J(P),uTentWind:k,uLit:z,uLamp:B.uLamp,uLampW:{value:W},uTentW:{value:R},uLampC:{value:_}},Y=new e.Mesh(o.geometry(),new e.ShaderMaterial({uniforms:X,vertexShader:ft,fragmentShader:wt,side:e.DoubleSide}));Y.name="camp-props",n.add(Y),await T.yield();const V=new e.PointLight(_,0,35,2);V.position.set(.3*r,.7,.05),n.add(V);let U=null;if(i.trackPts){const t=n.rotation.y,d=Math.cos(t),a=Math.sin(t),s=[g+b[0]*d+b[1]*a,f-b[0]*a+b[1]*d],v=i.trackPts.concat([[s[0]-l[0]*9,s[1]-l[1]*9],s]),p=[];for(let M=0;M<v.length-1;M++){const h=v[M],N=v[M+1],A=Math.max(1,Math.round(Math.hypot(N[0]-h[0],N[1]-h[1])/1.5));for(let L=0;L<A;L++)p.push([h[0]+(N[0]-h[0])*L/A,h[1]+(N[1]-h[1])*L/A])}p.push(s),await T.yield(),U=tt(P,u,p,{bends:!0}),U.object.name="camp-track",y.add(U.object)}else if(i.trackFrom){const t=[],[d,a]=i.trackFrom,s=g-l[0]*5.2,v=f-l[1]*5.2,p=Math.ceil(Math.hypot(s-d,v-a)/2);for(let M=0;M<=p;M++){const h=M/p,N=h*h*(3-2*h);t.push([d+(s-d)*N+3*Math.sin(h*5)*(1-h)*h*4*.35,a+(v-a)*h])}U=tt(P,u,t,{}),U.object.name="camp-track",y.add(U.object)}const st=Math.cos(n.rotation.y),nt=Math.sin(n.rotation.y),it=[{p:[g+nt*1.2,n.position.y+C.h*.92,f+st*1.2],v:[l[0]*2.2,1.1,l[1]*2.2],spread:.12,vr:.25,n:7,life:3.2,size:[.3,1.9],tone:0,alpha:.3,drag:.4}];B.uTime=m,X.uTime=m;const $=n.rotation.y,lt=[g-1.4*r*Math.cos($)+.05*Math.sin($),n.position.y+.5,f+1.4*r*Math.sin($)+.05*Math.cos($)],H={object:y,camp:n,tent:D,light:V,track:U,emitters:it,side:r,litWall:lt,triangles:D.geometry.index.count/3+o.triangles,position:n.position,lit:0,setLit(t){H.lit=t},get litNow(){return z.value},update(t){m.value=t+c[7]*60;const d=1+.07*Math.sin(t*.8+c[0])+.03*Math.sin(t*2.3+c[1]);z.value=H.lit*d,V.intensity=(i.lightIntensity??46)*et*H.lit*d;const a=B.uBodies.value;a.x=-.5*r+.05*Math.sin(t*.37+c[2])+.03*Math.sin(t*.9+c[3]),a.y=-.35+.09*Math.sin(t*.23+c[4]),a.z=-.95*r+.03*Math.sin(t*.31+c[5]),a.w=.9+.06*Math.sin(t*.41+c[6]),W.set(.3*r,.5,.05),n.localToWorld(W),n.localToWorld(O.set(0,0,0)),n.localToWorld(q.set(0,0,1));{const s=q.x-O.x,v=q.z-O.z,p=Math.hypot(s,v)||1;R.set(O.x,O.z,s/p,v/p)}}};return H}export{zt as CAMP_REACH,dt as DOOR_POOL,ct as TENT_SHADE,Mt as makeCamp};
