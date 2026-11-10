import{PETAL as M,PLACE as C,FOG_VERT_PARS as A,FOG_VERT as T,FOG_FRAG_PARS as P}from"./bridges-of-marigold-air-glsl.js";import{fogUniforms as z}from"../kit/fx.js";import{HIGH_BRIDGE as p,EXIT as Y}from"./bridges-of-marigold-plan.js";const F=`
${A}${C}
attribute vec4 aB, aC; uniform float uTime, uGain; uniform vec3 uBox, uEye, uWind; varying vec2 vQ; varying float vHue, vShade;
void main(){
  float sd = aB.w;
  vec3 p = aB.xyz*uBox + uWind*uTime;
  p.x += aC.w*sin(uTime*0.31 + sd*40.); p.y += 0.6*aC.w*sin(uTime*0.47 + sd*23.); p.z += aC.w*cos(uTime*0.27 + sd*11.);
  vec3 rel = mod(p - uEye + 0.5*uBox, uBox) - 0.5*uBox, c = uEye + rel;
  vec3 edge = smoothstep(vec3(0.5), vec3(0.38), abs(rel)/uBox);
  // how near a bridge's bed this place is (the nearest of the three)
  float near = 0.;
  for(int k = 0; k < 3; k++){ vec3 g = mgBridge(k, c.xz); float d = length(vec2(max(g.x - g.z, 0.), c.y - g.y)); near = max(near, exp(-d/34.)); }
  float share = 0.16 + 0.84*near;
  float keep = clamp((share - aC.z)/0.12, 0., 1.)*edge.x*edge.y*edge.z*smoothstep(0.6, 2.5, length(rel));
  float t = uTime*aC.y, yaw = sd*50. + t, pit = sd*13. + t*0.8, rol = 0.7*sin(t*1.3 + sd*9.);
  vec3 Y = vec3(cos(yaw), 0., sin(yaw)), X = vec3(-Y.z, 0., Y.x), N = vec3(0., 1., 0.);
  vec3 Yp = Y*cos(pit) + N*sin(pit), Np = N*cos(pit) - Y*sin(pit), Xp = X*cos(rol) + Np*sin(rol);
  float len = aC.x*keep;
  vec3 w = c + Xp*(position.x*len*0.66) + Yp*((position.y - 0.5)*len);
  vQ = vec2(position.x*2., position.y); vHue = fract(sd*7.77);
  vShade = (0.5 + 0.5*near)*(0.7 + 0.45*fract(sd*3.3))*uGain;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
${T} }`,H=`
${A}${C}
attribute vec4 aB, aC; uniform float uTime, uGain; uniform vec3 uRun, uEye; varying vec2 vQ; varying float vHue, vShade;
void main(){
  float sd = aB.w, s = mod(aB.z*uRun.z + aC.z*uTime, uRun.z), z = uRun.y + s;
  vec3 c = vec3(uRun.x + aB.x + aC.w*sin(uTime*0.4 + sd*40.), mgHighDeck(z) + aB.y + 0.5*aC.w*sin(uTime*0.6 + sd*23.), z);
  float keep = smoothstep(0., 6., s)*(1. - smoothstep(uRun.z - 10., uRun.z, s))*smoothstep(0.6, 2.5, length(c - uEye));
  float t = uTime*aC.y, yaw = sd*50. + t, pit = sd*13. + t*0.8, rol = 0.7*sin(t*1.3 + sd*9.);
  vec3 Y = vec3(cos(yaw), 0., sin(yaw)), X = vec3(-Y.z, 0., Y.x), N = vec3(0., 1., 0.);
  vec3 Yp = Y*cos(pit) + N*sin(pit), Np = N*cos(pit) - Y*sin(pit), Xp = X*cos(rol) + Np*sin(rol);
  float len = aC.x*keep;
  vec3 w = c + Xp*(position.x*len*0.66) + Yp*((position.y - 0.5)*len);
  vQ = vec2(position.x*2., position.y); vHue = fract(sd*7.77); vShade = (0.75 + 0.4*fract(sd*3.3))*uGain;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
${T} }`,S=`
${M}${P}
varying vec2 vQ; varying float vHue, vShade;
void main(){
  float s = mgPetal(vQ);
  // a petal's own ribs, lengthwise, and the roll of its blade from one side to the other
  float rib = abs(fract(vQ.x*2.2 + 0.5) - 0.5), ribs = 1. - 0.16*(1. - smoothstep(0.03, 0.12, rib))*smoothstep(0.1, 0.4, vQ.y);
  vec3 col = mgPetalHue(vHue)*(1.3 - 0.45*smoothstep(0., 0.22, s))*(0.82 + 0.3*vQ.y)*(0.9 + 0.16*vQ.x)*ribs*vShade;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
  if(s < 0.) discard;
}`;async function _(R,E){const{THREE:t,look:g,U:w,rng:i,rngStream:o}=E,s=Math.round(3200*Math.min(1,.3+.7*g.detail)),u=new Float32Array(s*4),c=new Float32Array(s*4);for(let e=0;e<s;e++)u[e*4]=i(),u[e*4+1]=i(),u[e*4+2]=i(),u[e*4+3]=i(),c[e*4]=i.range(.26,.5),c[e*4+1]=i.range(.6,2.2),c[e*4+2]=i(),c[e*4+3]=i.range(.5,2.2);const d=new t.PlaneGeometry(1,1).translate(0,.5,0),a=new t.InstancedBufferGeometry;a.index=d.index,a.setAttribute("position",d.attributes.position),a.setAttribute("aB",new t.InstancedBufferAttribute(u,4)),a.setAttribute("aC",new t.InstancedBufferAttribute(c,4)),a.instanceCount=s;const m={value:new t.Vector3},y=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,vertexShader:F,fragmentShader:S,uniforms:{...z(),uTime:w.uTime,uGain:{value:.95},uBox:{value:new t.Vector3(84,52,84)},uEye:m,uWind:{value:new t.Vector3(.35,.3,2.1)}}}),h=new t.Mesh(a,y);h.frustumCulled=!1;const f=new t.Group;f.add(h),await R.yield();const r=Math.round(700*Math.min(1,.3+.7*g.detail)),l=new Float32Array(r*4),v=new Float32Array(r*4);for(let e=0;e<r;e++){const B=(o()+o()+o()-1.5)*.62*p.width;l[e*4]=B,l[e*4+1]=.8+5.2*o()*o(),l[e*4+2]=o(),l[e*4+3]=o(),v[e*4]=o.range(.26,.5),v[e*4+1]=o.range(.8,2.6),v[e*4+2]=o.range(3,5.5),v[e*4+3]=o.range(.4,1.6)}const n=new t.InstancedBufferGeometry;n.index=d.index,n.setAttribute("position",d.attributes.position),n.setAttribute("aB",new t.InstancedBufferAttribute(l,4)),n.setAttribute("aC",new t.InstancedBufferAttribute(v,4)),n.instanceCount=r;const x=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,vertexShader:H,fragmentShader:S,uniforms:{...z(),uTime:w.uTime,uGain:{value:.95},uEye:m,uRun:{value:new t.Vector3(p.x,p.z0,Y.z-p.z0+30)}}}),b=new t.Mesh(n,x);return b.frustumCulled=!1,f.add(b),{object:f,triangles:(s+r)*2,drawCalls:2,count:s+r,update(e,B,G){m.value.setFromMatrixPosition(G.matrixWorld)},dispose(){d.dispose(),a.dispose(),y.dispose(),n.dispose(),x.dispose()}}}export{_ as buildAdrift};
