import{LAND_NOISE as L,LAND_PARS as _,LAND_STONE as B}from"./hill-of-round-doors-land-glsl.js";function j(T,N){const{THREE:v,runs:F,uniforms:S,look:m}=N,d=[],x=[],g=[],f=[];for(const h of F){const t=h.pts,r=t.length;if(r<2)continue;const U=d.length/3,l=h.wall?4:7;let b=0;for(let e=0;e<r;e++){const c=t[Math.max(0,e-1)],u=t[Math.min(r-1,e+1)],w=Math.hypot(u.x-c.x,u.z-c.z)||1,W=(u.x-c.x)/w,M=(u.z-c.z)/w,A=-M,k=W;e>0&&(b+=Math.hypot(t[e].x-t[e-1].x,t[e].z-t[e-1].z));const z=e===0||e===r-1?.45:1,i=t[e].h*z,n=t[e].w*(.6+.4*z)*.5,D=t[e].x,K=t[e].y,q=t[e].z,E=h.wall?[[-n,-.25],[-n*.8,i],[n*.8,i],[n,-.25]]:[[-n,-.3],[-n*1.06,i*.36],[-n*.76,i*.8],[0,i],[n*.76,i*.8],[n*1.06,i*.36],[n,-.3]];for(const[s,a]of E)d.push(D+A*s,K+a,q+k*s),x.push(h.wall?1:0),g.push(b,Math.max(0,a)/Math.max(.1,t[e].h));if(e<r-1)for(let s=0;s<l-1;s++){const a=U+e*l+s;f.push(a,a+1,a+l,a+1,a+l+1,a+l)}}}const o=new v.BufferGeometry;o.setAttribute("position",new v.Float32BufferAttribute(d,3)),o.setAttribute("aKind",new v.Float32BufferAttribute(x,1)),o.setAttribute("uv",new v.Float32BufferAttribute(g,2)),o.setIndex(f),o.computeVertexNormals(),o.computeBoundingSphere();const p=new v.ShaderMaterial({name:"hill-hedge",side:v.DoubleSide,uniforms:{...S,uStone:{value:m.stone.clone()},uEarth:{value:m.earth.clone()}},vertexShader:`
attribute float aKind; varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying float vKind, vDepth;
void main(){ vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normal; vUv = uv; vKind = aKind;
  vec4 mv = viewMatrix * wp; vDepth = -mv.z; gl_Position = projectionMatrix * mv; }`,fragmentShader:L+_+B+`
uniform vec3 uStone, uEarth;
varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying float vKind, vDepth;
void main(){
  vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vW);
  float px = max(length(dFdx(vW)), length(dFdy(vW))), fine = 1. - smoothstep(.05, .5, px);
  vec3 sh = landShade(vW.xz); sh.r *= landCloud(vW.xz);
  vec3 F = cross(dFdx(vW), dFdy(vW)); F /= max(length(F), 1e-7); if (dot(F, V) < 0.) F = -F;      // the face's own normal
  vec3 c;
  if (vKind > .5) {
    // a wall: its faces are flat (the face's own normal), its stones grey with ochre lichen, dark in the joints
    N = normalize(mix(N, F, .8) + vec3(0., 1e-4, 0.));
    vec2 st = stoneFace(vec2(vUv.x, vW.y), px);
    vec3 alb = uStone * (.62 + .55 * st.y) * mix(vec3(1.), vec3(1.12, 1.04, .78), smoothstep(.62, .9, st.y));
    alb = mix(uEarth * vec3(.16, .17, .12), alb, mix(.82, st.x, fine));
    alb = mix(alb, uTurf * vec3(.8, .9, .6), smoothstep(.55, .9, vnoise(vec2(vUv.x * .6, vW.y * 1.3) + 7.)) * .3 * smoothstep(.75, 1., vUv.y + .2));
    c = landLight(alb, N, sh.r, sh.g * (.55 + .45 * vUv.y));
  } else {
    // a hedge: clumps of leaves, lighter where they catch the light on top, dark in the gaps between its shrubs
    vec3 q = vW * vec3(1., 1.35, 1.);
    float n1 = vnoise(q.xz * .55 + q.y * .9), n2 = vnoise((q.xy + q.zx) * 2.3 + 3.), n3 = vnoise((q.xy + q.zy) * 7.5 + 9.);
    float leaf = n1 * .5 + n2 * .32 + n3 * .18 * fine;
    vec3 alb = uTurf * mix(vec3(.3, .46, .3), vec3(.62, .78, .4), smoothstep(.3, .75, leaf + (vUv.y - .5) * .35));      // (a deeper green than the meadow's)
    // (one shrub after another along the row: thorn in a yellower green, holly darker and bluer)
    alb *= mix(vec3(.74, .9, .9), vec3(1.2, 1.08, .74), smoothstep(.25, .75, vnoise(vec2(vUv.x * .21, 3.7))));
    alb *= mix(.4, 1., smoothstep(.2, .45, leaf + vUv.y * .25));
    N = normalize(N + (vec3(n2, n1, n3) - .5) * .9 * (.4 + .6 * fine));
    float gust = landGust(vW.xz);
    c = landLight(alb, N, sh.r, sh.g * (.45 + .55 * vUv.y)) * (1. + (gust - .45) * .12);
    float back = max(dot(-V, uSunDir), 0.);
    c += alb * uSunCol * (.3183 * sh.r * back * back * .22) * vec3(1.1, 1., .5) + landSheen(N, V, sh.g) * .5;
  }
  c += (vKind > .5 ? uStone : uTurf) * uLampCol * (sh.b * max(uLit * 2. - 1., 0.));      // lamplight, as on the turf: at night only
  gl_FragColor = vec4(landFog(c, vDepth, 0.), 1.);
  // a hedge's foot is a fringe of leaves, hanging lower here and higher there, with the grass seen under it
  if (vKind < .5 && vUv.y < .04 + .2 * vnoise(vec2(vUv.x * 2.9, 5.3)) * vnoise(vec2(vUv.x * 9.1, 1.7))) discard;
}`}),y=new v.Mesh(o,p);return y.name="hill-hedges",{object:y,triangles:f.length/3,dispose(){o.dispose(),p.dispose()}}}export{j as makeHedges};
