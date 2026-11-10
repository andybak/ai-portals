import*as c from"three";import{lerp as j,smoothstep as V}from"../kit/core.js";import{sharedUniforms as O,SBV_NOISE as _,SBV_LIGHT as E}from"./sledge-between-volcanoes-common.js";import{makePuffs as D}from"./sledge-between-volcanoes-ice.js";const q=`
attribute vec2 aUv; attribute float aHot;
varying vec3 vW, vN; varying vec2 vUv; varying float vHot;
void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal); vUv = aUv; vHot = aHot; gl_Position = projectionMatrix*viewMatrix*w; }`,$=`
precision highp float;
varying vec3 vW, vN; varying vec2 vUv; varying float vHot;
uniform vec3 uCrust, uLavaA, uLavaB; uniform float uTime, uLavaLevel;
${_}
${E}
void main(){
  vec3 n = normalize(vN); float hot = clamp(vHot, 0., 1.);
  // plates of crust carried down the flow: the cracks between them open where it is hot
  vec2 p = vec2(vUv.x - uTime*(.25 + .5*hot), vUv.y*14.);
  float a = sN2(p*.42), b = sN2(p*.95 + 7.3), c2 = sN2(p*2.3 + 3.1);
  float ridge = 1. - abs(2.*(a*.6 + b*.3 + c2*.1) - 1.);
  float open = clamp(.05 + .15*hot, 0., 1.);
  float crack = smoothstep(1. - open, 1. - open*.3, ridge);
  float breathe = .75 + .25*sin(uTime*1.3 + a*9.) ;
  vec3 col = uCrust*(.6 + .8*b)*sbvSky(n)*(1. - crack);
  float glow = crack*(.45 + 1.5*hot) + hot*hot*hot*.6*(.5 + .5*c2);
  col += mix(uLavaA, uLavaB, clamp(glow*.4 - .15, 0., 1.))*glow*breathe*uLavaLevel;
  gl_FragColor = vec4(sbvFog(col, length(cameraPosition - vW), 1.), 1.);
}`;function K(n,s,e,o,m,l,z,I,U){const b=n.pos.length/3,a=l[0]-m[0],i=l[1]-m[1],w=Math.hypot(a,i),x=a/w,k=i/w,C=-k,A=x,y=o.range(0,6.28),f=o.range(0,50);for(let v=0;v<=34;v++){const t=v/34,S=Math.sin(t*5.2+y)*16*t*(1-t)*2.2,F=m[0]+a*t+C*S,d=m[1]+i*t+A*S,p=t>.88?Math.sqrt(Math.max(0,1-Math.pow((t-.88)/.12,2))):1,r=j(z,I,t*t)*(1+.22*e.n2(t*4.3+f,f))*(.25+.75*p),M=U*(.4+.6*V(.3,.9,t))*(.35+.65*p);for(let h=0;h<=10;h++){const g=h/10*2-1,u=F+C*g*r*.5,T=d+A*g*r*.5,N=.75+.5*e.n2(u/9+f,T/9),W=s(u,T)-1.2+(M*N+1.2)*Math.pow(Math.max(0,1-Math.pow(Math.abs(g),3.2)),.6);n.pos.push(u,W,T),n.uv.push(t*w*.16,g),n.hot.push(.12+.88*V(.5,1,t)*(1-.45*Math.abs(g))*(.7+.3*N))}}for(let v=0;v<34;v++)for(let t=0;t<10;t++){const S=b+v*11+t,F=S+1,d=S+10+1,p=d+1;n.idx.push(S,F,d,F,p,d)}}function J(n,s,e,o,m,l,z,I){const U=n.pos.length/3,R=l.range(0,6.28),B=l.range(0,30);n.pos.push(s+m*l.range(-.2,.2),e+m*l.range(.85,1.2),o+m*l.range(-.2,.2)),n.uv.push(B,0),n.hot.push(z*l.range(.6,1));for(let b=0;b<2;b++)for(let a=0;a<5;a++){const i=R+(a+b*.5)*1.2566,w=m*l.range(.6,1.25)*(b?1:.8),x=e+m*(b?l.range(-.3,.1):l.range(.35,.75));n.pos.push(s+Math.cos(i)*w,x,o+Math.sin(i)*w),n.uv.push(B+l.range(0,3),l.range(-1,1)),n.hot.push(z*l.range(.6,1))}n.pos.push(s,e-m*.45,o),n.uv.push(B,0),n.hot.push(0);for(let b=0;b<5;b++){const a=(b+1)%5,i=U+1+b,w=U+1+a,x=U+6+b,k=U+6+a;n.idx.push(U,w,i,i,w,x,w,k,x,x,k,U+11)}if(I){const b=n.pos.length/3,a=9;n.pos.push(s,I(s,o)+.12,o),n.uv.push(B,-1),n.hot.push(0);for(let i=0;i<a;i++){const w=R+i/a*6.2832,x=m*l.range(1.5,2.9),k=s+Math.cos(w)*x,C=o+Math.sin(w)*x;n.pos.push(k,I(k,C)+.06,C),n.uv.push(B+i,-1),n.hot.push(0)}for(let i=0;i<a;i++)n.idx.push(b,b+1+(i+1)%a,b+1+i)}}const Q=n=>n?[[150,-290],[90,-402],[126,-514],[178,-600]]:[[152,-292],[120,-396],[166,-506],[178,-600]],X=[[430,-330],[440,-430],[430,-560],[430,-655]];async function se(n,s,e){const o=e.rng,m=e.noise||n.noise,l=e.ground,z=new c.Group;z.name="lava-front";const I=e.burstsRng||o.fork("bursts"),U=e.rollersRng||o.fork("rollers"),R=e.steamRng||o.fork("steam"),B={value:0},b=o.range(0,600),a=e.snouts||Q(e.surge),i=e.sources||X,w=e.steam??1,x={pos:[],uv:[],hot:[],idx:[]};for(let r=0;r<a.length;r++){K(x,l,m,o,i[r],a[r],22,(r===1?46:36)+(e.surge&&r>0?12:0),r===1?13:10);for(let M=0;M<9;M++){const h=o.range(0,6.28),g=o.range(8,30),u=a[r][0]-Math.abs(Math.cos(h))*g*.6+o.range(-6,6),T=a[r][1]+Math.sin(h)*g;J(x,u,l(u,T),T,o.range(.8,2.6),o,o.range(.25,.9),l)}await n.yield()}const k=new c.BufferGeometry;k.setAttribute("position",new c.Float32BufferAttribute(x.pos,3)),k.setAttribute("aUv",new c.Float32BufferAttribute(x.uv,2)),k.setAttribute("aHot",new c.Float32BufferAttribute(x.hot,1)),k.setIndex(x.idx),k.computeVertexNormals();const C={...O(s),uCrust:{value:new c.Color("#1a1618")},uLavaA:{value:new c.Color("#FF3A0C").multiplyScalar(1)},uLavaB:{value:new c.Color("#FF9A40").multiplyScalar(1.5)},uLavaLevel:{value:1}},A=new c.Mesh(k,new c.ShaderMaterial({uniforms:C,vertexShader:q,fragmentShader:$,side:c.DoubleSide}));A.name="lava-tongues",z.add(A);const y=e.wind||[-1,0],f=[],v=[100,140,60,85],t=12,S=.05,F=(1-Math.exp(-S*t))/S;for(let r=0;r<a.length;r++){const[M,h]=a[r],g=l(M,h)+2,u=v[r%4];f.push({p:[M-4,g,h],v:[0,u/F,0],spread:3+u/22,vr:1+u/110,n:Math.round((80+u*.7)*w),life:t,size:[u/7.4,u/5.7],tone:2,alpha:.9,drag:S,flat:.3}),f.push({p:[M-2,g-1,h+o.range(-10,10)],v:[y[0]*2,3,y[1]*2],spread:9,vr:1.6,n:10,life:5,size:[3,9],tone:2,alpha:.4,drag:.3,flat:.2})}C.uTime=B;const d=G(s,{rng:I,rollers:U,ground:l,snouts:a,gap:e.gap}),p=D(s,{rng:R,emitters:f,wind:[y[0]*11,0,y[1]*11],name:"lava-steam",hot:1.6,renderOrder:5});return z.add(p.object,d.object),{object:z,uniforms:C,steam:p,bursts:d,snouts:a,triangles:x.idx.length/3+p.triangles+d.triangles,update(r,M=1){C.uLavaLevel.value=.35+.65*M,B.value=r+b,d.update(r)}}}const Y=`
attribute vec3 aP0, aV; attribute vec4 aT; attribute vec2 aS;      // aT: burst time, landing time (or life), kind, seed
uniform float uTime, uPeriod; uniform vec3 uBurstWind;
varying vec2 vUv; varying vec4 vI; varying vec3 vW, vR, vU;
void main(){
  float age = mod(uTime - aT.x, uPeriod), tl = max(aT.y, .05), kind = aT.z, k, vis, size; vec3 p;
  if (kind < .5) { float a = min(age, tl); p = aP0 + aV*a + vec3(0., -4.9*a*a, 0.); k = age/tl; vis = 1.; size = aS.x*(1. - .3*min(k, 1.)); }      // a thrown rock: it lies where it lands until it is thrown again
  else if (kind > 3.5) { float a = clamp(age - .45, 0., tl); p = aP0 + aV*a + vec3(0., -4.9*a*a + .6, 0.) + uBurstWind*.4; k = clamp(age/tl, 0., 1.); vis = step(.45, age)*step(age, tl + .6); size = aS.x*(1.6 + 2.2*k); }      // its smoke, a little behind it on the same arc
  else if (kind < 1.5) { float a = age - tl; p = aP0 + aV*tl + vec3(0., -4.9*tl*tl + .8 + 1.5*max(a, 0.), 0.) + uBurstWind*max(a, 0.); k = clamp(a/4., 0., 1.); vis = step(0., a)*step(a, 4.); size = mix(aS.x, aS.y, sqrt(k)); }
  else if (kind > 2.5) { float a = min(age, tl); p = aP0 + aV*a + vec3(0., .25*abs(sin(a*4.5 + aT.w*20.))*(1. - a/tl), 0.); k = clamp(age/(tl + 3.), 0., 1.); vis = step(age, tl + 3.); size = aS.x; }      // a rolling block: it bounces a little, stops, and cools
  else { float a = age; p = aP0 + aV*(1. - exp(-a*.7))/.7 + uBurstWind*a*.6; k = clamp(a/tl, 0., 1.); vis = step(a, tl); size = mix(aS.x, aS.y, sqrt(k)); }
  vec4 w = modelMatrix*vec4(p, 1.);
  // the card faces the eye's place (not the lens): its axes come from the line to where the eye stands
  vec3 toEye = normalize(cameraPosition - w.xyz); vR = normalize(cross(vec3(0., 1., 0.), toEye) + vec3(1e-4, 0., 0.)); vU = cross(toEye, vR);
  vec2 c = position.xy*2.; vUv = c; w.xyz += (vR*c.x + vU*c.y)*size*.5; vW = w.xyz;
  vI = vec4(kind, k, aT.w, vis);
  gl_Position = vis > .5 ? projectionMatrix*viewMatrix*w : vec4(2., 2., 2., 1.);
}`,Z=`
precision highp float;
varying vec2 vUv; varying vec4 vI; varying vec3 vW, vR, vU;
uniform vec3 uHotA, uHotB;
${_}
${E}
void main(){
  float r2 = dot(vUv, vUv); if (r2 > 1.) discard;
  float dist = length(cameraPosition - vW), k = vI.y;
  if (vI.x < .5 || (vI.x > 2.5 && vI.x < 3.5)) {
    // a thrown rock or a rolling block: an irregular dark lump that tumbles as it goes, dull red on the side that was
    // in the lava, white-orange only as it leaves; at rest it cools to black
    float fly = min(k, 1.), spin = vI.z*6.2832 + fly*(9. + 7.*vI.z), ang = atan(vUv.y, vUv.x) + spin;
    float rim = .64 + .17*sin(ang*3. + vI.z*9.) + .1*sin(ang*5. + vI.z*31.) + .05*sin(ang*9. + vI.z*17.);
    if (r2 > rim*rim) discard;
    float cool = exp(-max(k - 1., 0.)*1.4);
    float sideK = smoothstep(-.25, .55, dot(vUv, vec2(cos(spin), sin(spin)))/max(rim, .2));
    vec3 rock = vec3(.035, .032, .036)*(sbvSky(vec3(0., 1., 0.)) + sbvFire(vW, vec3(0., 1., 0.)));
    vec3 c = rock + uHotA*sideK*(.55 - .3*fly)*cool*(.6 + .4*sF2(vUv*3. + vI.z*40.)) + uHotB*exp(-fly*9.)*exp(-r2*4.)*.8;
    gl_FragColor = vec4(sbvFog(c, dist, 1.), 1.);
    return;
  }
  if (vI.x > 3.5) {                                                   // the smoke behind a thrown rock
    float nz = sF2(vUv*1.8 + vI.z*23.);
    float a = clamp(exp(-r2*3.2) - .04, 0., 1.)*smoothstep(.2, .75, nz + .5*(1. - r2))*(1. - smoothstep(.55, 1., k))*.4;
    vec3 c = vec3(.1, .095, .1)*(sbvSky(vec3(0., 1., 0.)) + sbvFire(vW, vec3(0., 1., 0.))) + uHotA*.06*exp(-k*5.);
    c = sbvFog(c, dist, 1.);
    gl_FragColor = vec4(c*a, a);
    return;
  }
  float nz = sF2(vUv*1.6 + vI.z*23.);
  float a = clamp(exp(-r2*3.) - .04, 0., 1.)*smoothstep(.15, .75, nz + .55*(1. - r2))*smoothstep(0., .1, k)*(1. - smoothstep(.4, 1., k))*(vI.x > 1.5 ? .6 : .45);
  vec3 f = normalize(cross(vR, vU)); vec3 n = normalize(vR*vUv.x + vU*vUv.y + f*sqrt(max(1. - r2, .05)));
  vec3 c = vec3(.6, .6, .62)*(sbvSky(n) + sbvFire(vW, n) + sbvFire(vW, -n)*.4) + uHotA*(vI.x > 1.5 ? .5 : .25)*exp(-k*6.);
  c = sbvFog(c, dist, 1.);
  gl_FragColor = vec4(c*a, a);
}`;function G(n,s){const e=s.rng,o=[],m=[],l=[],z=[],I=[];let U=e.range(2,5);const R=64;for(;U<R-3;)I.push(U),U+=e.range(5,8);let B=0;const b=(A,y,f,v,t,S,F)=>{for(let d=0;d<=1.001;d+=.1){const p=F*d,r=y+t*p-4.9*p*p;if(s.gap(A+v*p,r,r,f+S*p)<40)return!1}return!0};for(const A of I){const y=s.snouts[e.int(0,s.snouts.length-1)],f=y[0]-e.range(0,6),v=y[1]+e.range(-8,8),t=s.ground(f,v)+3,S=e.int(6,10);for(let F=0;F<S;F++){const d=e.range(0,Math.PI*2),p=e.range(.87,1.22),r=e.range(30,90),M=Math.sqrt(r*9.8/Math.sin(2*p));let h=Math.cos(d)*Math.cos(p)*M,g=Math.sin(d)*Math.cos(p)*M;const u=Math.sin(p)*M,T=()=>{let P=.3;for(;P<9&&!(t+u*P-4.9*P*P<s.ground(f+h*P,v+g*P)+.3);P+=.06);return P};let N=T();s.gap&&!b(f,t,v,h,u,g,N)&&(h=-h,N=T(),B++);const W=e(),L=e.range(1.1,2.4),H=e.range(0,.25);o.push(f,t,v),m.push(h,u,g),l.push(A+H,N,0,W),z.push(L,L),o.push(f,t,v),m.push(h,u,g),l.push(A+H,N,1,e()),z.push(1.5,e.range(5,9)),o.push(f,t,v),m.push(h,u,g),l.push(A+H,N,4,W*7.13%1),z.push(L,L)}for(let F=0;F<5;F++)o.push(f+e.range(-3,3),t,v+e.range(-3,3)),m.push(e.range(-4,6),e.range(9,17),e.range(-5,5)),l.push(A+e.range(0,.3),e.range(4,6),2,e()),z.push(4,e.range(16,30))}const a=s.rollers||e.fork("rollers");for(const A of I)for(let y=0;y<2;y++){const f=s.snouts[a.int(0,s.snouts.length-1)],v=f[0]+a.range(-4,4),t=f[1]+a.range(-12,12),S=s.ground(v+3,t)-s.ground(v-3,t),F=s.ground(v,t+3)-s.ground(v,t-3),d=Math.atan2(-F,-S)+a.range(-.5,.5),p=v+Math.cos(d)*5,r=t+Math.sin(d)*5,M=a.range(1.8,3.4),h=a.range(2.5,4.5);let g=p+Math.cos(d)*M*h,u=r+Math.sin(d)*M*h;const T=s.ground(p,r)+2.2;s.gap&&s.gap(g,s.ground(g,u),s.ground(g,u)+2,u)<40&&(g=p,u=r,B++);const N=s.ground(g,u)+.5;o.push(p,T,r),m.push((g-p)/h,(N-T)/h,(u-r)/h),l.push(A+a.range(.5,4),h,3,a()),z.push(a.range(1.2,2.2),0)}const i=new c.InstancedBufferGeometry,w=new c.PlaneGeometry(1,1);i.index=w.index,i.setAttribute("position",w.getAttribute("position")),i.setAttribute("aP0",new c.InstancedBufferAttribute(new Float32Array(o),3)),i.setAttribute("aV",new c.InstancedBufferAttribute(new Float32Array(m),3)),i.setAttribute("aT",new c.InstancedBufferAttribute(new Float32Array(l),4)),i.setAttribute("aS",new c.InstancedBufferAttribute(new Float32Array(z),2)),i.instanceCount=o.length/3;const x={...O(n),uPeriod:{value:R},uBurstWind:{value:new c.Vector3(-2.5,0,.4)},uHotA:{value:new c.Color("#FF4A12").multiplyScalar(2.2)},uHotB:{value:new c.Color("#FFD890").multiplyScalar(3.2)}},k=new c.Mesh(i,new c.ShaderMaterial({uniforms:x,vertexShader:Y,fragmentShader:Z,transparent:!0,depthWrite:!1,side:c.DoubleSide,blending:c.CustomBlending,blendSrc:c.OneFactor,blendDst:c.OneMinusSrcAlphaFactor,blendSrcAlpha:c.OneFactor,blendDstAlpha:c.OneMinusSrcAlphaFactor}));k.frustumCulled=!1,k.renderOrder=7,k.name="lava-bursts";const C={object:k,uniforms:x,times:I,period:R,triangles:o.length/3*2,glow:0,clearance:{turned:B},update(A){let y=0;for(const f of I){const v=((A-f)%R+R)%R;v<3&&(y=Math.max(y,V(0,.15,v)*Math.exp(-v*1.6)))}C.glow=y}};return C}export{X as TONGUE_SOURCES,se as makeLavaFront,Q as snoutsOf};
