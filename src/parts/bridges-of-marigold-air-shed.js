import{PETAL as B,FOG_VERT_PARS as C,FOG_VERT as X,FOG_FRAG_PARS as $}from"./bridges-of-marigold-air-glsl.js";import{fogUniforms as O}from"../kit/fx.js";import{MIST as b}from"./bridges-of-marigold-plan.js";const L=`
${C}
attribute vec4 aS, aV, aT; uniform float uTime, uPx, uMistY, uGain; varying vec2 vQ; varying float vHue, vShade;
void main(){
  float t = fract(uTime/aV.w + aT.x)*aV.w, life = t/aV.w, sd = aS.w;
  vec3 c = aS.xyz + aV.xyz*t;
  float sw = (0.35 + 0.07*t)*aT.w;
  c.x += sw*sin(t*0.63 + sd*31.); c.z += sw*cos(t*0.51 + sd*17.); c.y += 0.3*sin(t*1.3 + sd*5.);
  float dist = max(length(c - cameraPosition), 1e-3);
  float keep = smoothstep(0., 0.04, life)*(1. - smoothstep(0.8, 1., life))*smoothstep(uMistY - 7., uMistY + 3., c.y)*smoothstep(0.6, 2.5, dist);
  float yaw = sd*50. + t*aT.z, pit = sd*13. + t*aT.z*0.83, rol = 0.7*sin(t*aT.z*1.3 + sd*9.);
  vec3 Y = vec3(cos(yaw), 0., sin(yaw)), X = vec3(-Y.z, 0., Y.x), N = vec3(0., 1., 0.);
  vec3 Yp = Y*cos(pit) + N*sin(pit), Np = N*cos(pit) - Y*sin(pit), Xp = X*cos(rol) + Np*sin(rol);
  float len = max(aT.y, uPx*dist*2.6)*keep;
  vec3 w = c + Xp*(position.x*len*0.66) + Yp*((position.y - 0.5)*len);
  vQ = vec2(position.x*2., position.y); vHue = fract(sd*7.77);
  vShade = (0.62 + 0.4*fract(sd*3.3))*(1. - 0.45*life)*uGain;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
${X} }`,U=`
${B}${$}
varying vec2 vQ; varying float vHue, vShade;
void main(){
  float s = mgPetal(vQ);
  vec3 col = mgPetalHue(vHue)*(1.3 - 0.45*smoothstep(0., 0.22, s))*(0.82 + 0.3*vQ.y)*vShade;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
  if(s < 0.) discard;
}`;async function K(P,M){const{THREE:e,look:Y,U:p,rng:t,bridges:f,shapes:F}=M,n=[],v=[],m=[],g=[.45,0,.3];for(let i=0;i<f.length;i++){const s=f[i],l=F[i],G=Math.max(8,Math.round((s.under?96:26)*Math.min(1,.35+.65*Y.detail)));for(const u of[-1,1]){let a=-s.pre+2;for(;a<s.L+s.post-2;){const V=t.range(4.5,8.5),y=t.range(.55,1.5),z=t.range(1,2),R=t.range(.6,1.5),x=u*l.half(a)*1.04,T=l.top(a,x)-.2,_=T>b+4;for(let S=0;S<G;S++){const E=t.range(-1.4,1.4),H=t(),I=t.range(.3,.48),N=t.range(.7,2.3),Q=t.range(26,42),j=t(),A=t.range(.75,1.3),k=t.range(.8,1.25);if(!_)continue;const d=l.point(a+E,x,T);n.push(d[0],d[1],d[2],j),v.push(-s.dz*u*y*A+g[0],-z*k,s.dx*u*y*A+g[2],Q),m.push(H,I,N,R)}a+=V}}await P.yield()}const r=new e.PlaneGeometry(1,1).translate(0,.5,0),o=new e.InstancedBufferGeometry;o.index=r.index,o.setAttribute("position",r.attributes.position),o.setAttribute("aS",new e.InstancedBufferAttribute(new Float32Array(n),4)),o.setAttribute("aV",new e.InstancedBufferAttribute(new Float32Array(v),4)),o.setAttribute("aT",new e.InstancedBufferAttribute(new Float32Array(m),4));const c=n.length/4;o.instanceCount=c;const h=new e.ShaderMaterial({fog:!0,side:e.DoubleSide,vertexShader:L,fragmentShader:U,uniforms:{...O(),uTime:p.uTime,uPx:p.uPx,uMistY:{value:b},uGain:{value:.95}}}),w=new e.Mesh(o,h);return w.frustumCulled=!1,{object:w,triangles:c*2,drawCalls:1,count:c,update(){},dispose(){r.dispose(),o.dispose(),h.dispose()}}}export{K as buildShed};
