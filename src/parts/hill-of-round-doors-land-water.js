import*as L from"../kit/water.js";import{LAND_NOISE as R,LAND_PARS as T}from"./hill-of-round-doors-land-glsl.js";import{streamZ as $,streamHalf as B,WATER as p,MILL as o}from"./hill-of-round-doors-plan.js";const s={x0:o.wheel.x-o.wheel.r-5,z0:o.wheel.z+o.wheel.thick/2+1.75,x1:o.wheel.x-o.wheel.r-9,run:11};s.z1=$(s.x1)+B(s.x1)+2.5;function U(_,N){const{THREE:t,sky:q,uniforms:b,heightAt:H}=N,m=new t.Group;m.name="hill-water";const u=[];for(let e=-640;e<704;)u.push(e),e+=Math.abs(e-20)<250?4:16;u.push(704);const D=[],W=[],d=[],x=13;for(const e of u){const i=$(e),a=B(e),n=[a+5.5,a+3,a+1.2,a-1.5,a-5,a*.45],r=[...n.map(v=>-v),0,...n.slice().reverse()];for(const v of r){const A=i+v;D.push(e,0,A),W.push(p-H(e,A))}}for(let e=0;e<u.length-1;e++)for(let i=0;i<x-1;i++){const a=e*x+i,n=a+1,r=a+x,v=r+1;d.push(a,n,r,n,v,r)}const h=new t.BufferGeometry;h.setAttribute("position",new t.Float32BufferAttribute(D,3)),h.setAttribute("aDepth",new t.Float32BufferAttribute(W,1)),h.setIndex(d),h.computeBoundingSphere();const w=L.waterLight(q),c=o.wheel,S=new t.ShaderMaterial({name:"hill-stream",transparent:!0,depthWrite:!1,uniforms:{...b,uZen:{value:w.zenith.clone()},uMid:{value:w.mid.clone()},uHor:{value:w.horizon.clone()},uDeepC:{value:new t.Color("#123a34")},uShalC:{value:new t.Color("#7aa890")},uTimber:{value:new t.Color("#8a6644")},uWheel:{value:new t.Vector4(c.x,c.z,c.r,c.thick)}},vertexShader:`
attribute float aDepth; varying vec3 vW; varying float vDeep, vDepth;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vDeep = aDepth; vec4 mv = viewMatrix * wp; vDepth = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:R+T+`
uniform vec3 uZen, uMid, uHor, uDeepC, uShalC, uTimber; uniform vec4 uWheel;
varying vec3 vW; varying float vDeep, vDepth;
void main(){
  vec2 p = vW.xz; vec3 toCam = cameraPosition - vW; vec3 V = toCam / (length(toCam) + 1e-4);
  float px = max(length(dFdx(p)), length(dFdy(p))), t = uTime;
  // the wheel's wake: from under the wheel downstream along the race, widening
  float sx = uWheel.x - p.x, sz = abs(p.y - uWheel.y);
  float wake = smoothstep(-uWheel.z * .5, uWheel.z * .2, sx) * (1. - smoothstep(uWheel.z * 1.4, uWheel.z * 3.6, sx)) * (1. - smoothstep(uWheel.w * .8 + sx * .12, uWheel.w * 1.5 + sx * .2, sz));
  // four trains of low waves, their lines wandering; a train is left out as its waves grow finer than the pixel
  // (and each comes and goes in broad patches, so no two reaches of the water are ruled alike)
  vec2 q = p + (vec2(vnoise(p * .16 + 3.), vnoise(p * .16 + 9.)) - .5) * 3.6, g = vec2(0.);
  float e1 = .3 + 1.4 * vnoise(p * .11 + 17.), e2 = .3 + 1.4 * vnoise(p * .23 + 29.);
  g += vec2(-.94, .34) * (cos(dot(q, vec2(-.94, .34)) * 1.21 + t * .9) * .05 * e1 * (1. - smoothstep(1., 2.8, px)));
  g += vec2(-.71, -.71) * (cos(dot(q, vec2(-.71, -.71)) * 2.17 - t * 1.1) * .045 * e2 * (1. - smoothstep(.6, 1.6, px)));
  g += vec2(-.34, .94) * (cos(dot(q, vec2(-.34, .94)) * 4.8 + t * 1.6) * .04 * e1 * (1. - smoothstep(.26, .7, px)));
  g += vec2(-1., .1) * (cos(dot(q, vec2(-1., .1)) * 10.5 + t * 2.4) * .03 * e2 * (1. - smoothstep(.12, .32, px)));
  g *= 1. + 2.4 * wake;
  vec3 N = normalize(vec3(-g.x, 1., -g.y)), R = reflect(-V, N); R.y = abs(R.y);
  // the sky in the mirror: gold at the horizon, blue overhead, warmer toward the sun; low down, the far bank
  vec3 sky = mix(uHor, uMid, smoothstep(0., .3, R.y)); sky = mix(sky, uZen, smoothstep(.25, .95, R.y));
  float sd = max(dot(R, uSunDir), 0.); sd *= sd; sky += uHor * (sd * sd * .35);
  vec3 sh = landShade(p); float sun = sh.r * landCloud(p);
  vec3 irr = (uSunCol * (max(uSunDir.y, 0.) * sun) + uSkyCol) * .31831;
  float bank = 1. - smoothstep(.05, .17, R.y + g.x * .8);
  sky = mix(sky, uTurf * irr * 1.7, bank * .85);
  // the mill in the mirror: its south gable (the plan's box, its eaves and its ridge) where the mirrored ray meets it
  float tz = (${o.z1.toFixed(1)} - p.y) / min(R.z, -1e-3), mx = abs(p.x + R.x * tz - ${((o.x0+o.x1)/2).toFixed(1)}), mh = ${((o.x1-o.x0)/2).toFixed(1)};
  float roof = ${o.eaves.toFixed(1)} + ${(o.ridge-o.eaves).toFixed(1)} * (1. - mx / mh);
  float gable = step(0., tz) * (1. - smoothstep(mh - .8, mh, mx)) * (1. - smoothstep(roof - 1., roof, ${p.toFixed(2)} + R.y * tz));
  sky = mix(sky, uTimber * irr, gable * .8);
  float f1 = 1. - max(dot(N, V), 0.), f2 = f1 * f1, F = .03 + .97 * f2 * f2 * f1;
  float deep = max(vDeep, 0.), dk = 1. - exp(-deep * .85);
  vec3 col = mix(mix(uShalC, uDeepC, dk) * irr, sky, F);
  // the sun's glitter on the waves (the half vector's cosine to the 128th, by squaring)
  float hs = max(dot(N, normalize(V + uSunDir + vec3(0., 1e-3, 0.))), 0.); hs *= hs; hs *= hs; hs *= hs; hs *= hs; hs *= hs; hs *= hs; hs *= hs;
  col += uSunCol * (hs * .6 * (1. - bank) * sun);
  // the wake's foam, torn into streaks that drift downstream
  float foam = wake * smoothstep(.46, .74, vnoise(vec2((p.x + t * 1.3) * .5, p.y * 1.7)) * .6 + vnoise(vec2((p.x + t * 2.1) * 1.3, p.y * 3.3) + 5.) * .4);
  col = mix(col, vec3(.86, .9, .88) * irr, foam * .85);
  float a = smoothstep(0., .07, vDeep) * clamp(F + (1. - F) * (1. - exp(-deep * 2.4)) + foam, 0., 1.);
  gl_FragColor = vec4(landFog(col, vDepth, 0.), a);
  if (vDeep <= 0.) discard;
}`}),f=new t.Mesh(h,S);f.position.y=p,f.name="hill-stream",f.renderOrder=2,m.add(f);const g=20,F=[],C=[],y=[],k=Math.hypot(s.x1-s.x0,s.z1-s.z0);for(let e=0;e<=g;e++){const i=e/g,a=s.x0+(s.x1-s.x0)*i,n=s.z0+(s.z1-s.z0)*i;if(F.push(a+1.2,p+.05,n,a-s.run,p+.05,n-1.5*(i-.5)),C.push(i*k,-.11,i*k,1),e<g){const r=e*2;y.push(r,r+1,r+2,r+1,r+3,r+2)}}const l=new t.BufferGeometry;l.setAttribute("position",new t.Float32BufferAttribute(F,3)),l.setAttribute("uv",new t.Float32BufferAttribute(C,2)),l.setIndex(y);const M=new t.ShaderMaterial({name:"hill-weir",uniforms:b,transparent:!0,depthWrite:!1,vertexShader:`
varying vec2 vUv; varying float vDepth; varying vec3 vW;
void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mv = viewMatrix * wp; vDepth = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:R+T+`
varying vec2 vUv; varying float vDepth; varying vec3 vW;
void main(){
  float s = vUv.x, v = vUv.y, run = v * ${s.run.toFixed(1)};
  // the smooth lip over the sill, then the white sheet breaking into streaks, then foam drifting off in patches
  float lip = smoothstep(-.11, -.02, v) * (1. - smoothstep(-.02, .03, v));
  float streak = vnoise(vec2(s * 2.6, run * .5 - uTime * 2.4)) * .6 + vnoise(vec2(s * 7., run * 1.3 - uTime * 3.6) + 3.) * .4;
  float sheet = smoothstep(.0, .05, v) * (1. - smoothstep(.1, .38, v + (streak - .5) * .2));
  float patchy = smoothstep(.42, .7, vnoise(vec2(s * .55, run * .32 - uTime * .55) + 11.) * .65 + streak * .45);
  float foam = max(sheet * (.55 + .45 * streak), patchy * (1. - smoothstep(.3, 1., v)) * smoothstep(.04, .2, v));
  vec3 lit = (uSunCol * max(uSunDir.y, 0.) * landShade(vW.xz).r + uSkyCol) * .31831;
  vec3 c = mix(vec3(.05, .08, .07) * lit, vec3(.9, .93, .9) * lit, foam);
  float a = max(lip * .55, foam) * smoothstep(0., .04, min(s, ${k.toFixed(2)} - s) * .25);
  gl_FragColor = vec4(landFog(c, vDepth, 0.), a);
}`}),z=new t.Mesh(l,M);return z.name="hill-weir",z.renderOrder=3,m.add(z),{object:m,triangles:d.length/3+y.length/3,dispose(){h.dispose(),S.dispose(),l.dispose(),M.dispose()}}}export{s as WEIR,U as makeWater};
