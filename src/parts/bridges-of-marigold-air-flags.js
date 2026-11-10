import{HANG as E,FOG_VERT_PARS as Q,FOG_VERT as $,FOG_FRAG_PARS as D}from"./bridges-of-marigold-air-glsl.js";import{fogUniforms as N}from"../kit/fx.js";import{linePoint as O}from"./bridges-of-marigold-air-lines.js";const V=`
${Q}${E}
attribute vec4 aP, aHang, aF, aC; uniform float uTime; varying vec2 vQ; varying vec4 vC; varying float vCut;
void main(){
  vec3 top = mgHang(aP.xyz, aHang, uTime);
  vec3 D = vec3(aF.x, 0., aF.y), Nn = vec3(-aF.y, 0., aF.x);
  float th = 0.08 + 0.36*(0.5 + 0.5*sin(uTime*1.9 + aF.z)) + 0.13*sin(uTime*4.3 + aF.z*1.7);
  float yy = 0.5 - position.y, w = aP.w;
  vec3 pos = top + D*(position.x*w) + (vec3(0., -cos(th), 0.) + Nn*sin(th))*(yy*w*1.3);
  vQ = vec2(position.x, yy*1.3); vCut = aF.w; vC = vec4(aC.rgb*aC.w*(0.8 + 0.25*cos(th*2.2)), 1.);
  vec4 mvPosition = viewMatrix*vec4(pos, 1.); gl_Position = projectionMatrix*mvPosition;
${$} }`,j=`
${D}
varying vec2 vQ; varying vec4 vC; varying float vCut;
void main(){
  vec2 m = vQ; vec2 fwv = fwidth(m); float fine = 1. - smoothstep(0.035, 0.09, max(fwv.x, fwv.y));
  float scallop = 1.21 - 0.09*abs(sin(m.x*15.708));
  float hole = 0.;
  float hx = (fract(m.x/0.143 + 0.5) - 0.5)*0.143;
  hole = max(hole, step(length(vec2(hx, m.y - 0.13)), 0.036));
  hole = max(hole, step(length(vec2(hx, m.y - 1.03)), 0.036));
  vec2 d = m - vec2(0., 0.58); float rr = length(d), ang = rr > 1e-4 ? atan(d.y, d.x) : 0.;
  if(vCut < 0.34){ float pet = abs(cos(ang*4.)); hole = max(hole, max(step(rr, 0.05), step(0.11, rr)*step(rr, 0.15 + 0.2*pet)*step(0.3, pet))); }
  else if(vCut < 0.67){ hole = max(hole, max(step(rr, 0.13), step(0.19, rr)*step(rr, 0.37)*step(0.5 + (rr - 0.19)*2.4, abs(sin(ang*6.))))); }
  else {
    for(int i = 0; i < 3; i++) for(int s = 0; s < 2; s++){
      float sg = s == 0 ? -1. : 1.; vec2 v = d - vec2(sg*0.17, -0.2 + 0.2*float(i));
      float cs = cos(0.6*sg), sn = sin(0.6*sg); vec2 r = vec2(cs*v.x - sn*v.y, sn*v.x + cs*v.y)/vec2(0.15, 0.055);
      hole = max(hole, step(dot(r, r), 1.));
    }
  }
  gl_FragColor = vec4(fxApplyFog(vC.rgb), 1.);
  if(m.y > scallop || hole*fine > 0.5) discard;
}`;async function U(C,F){const{THREE:t,look:b,U:P,rng:o,lines:A}=F,M=["#ff2f92","#12c8c0","#ffc81e","#9be024","#8a4cff","#ff4a24","#f4efe6","#ff8a1e"].map(e=>new t.Color(e)),n=[],p=[],h=[],m=[],T=1.08/Math.min(1,.6+.4*b.detail);let G=0;for(const e of A){if(e.kind!=="flags")continue;const c=Math.floor(o()*8),R=1+Math.floor(o()*3),d=Math.max(4,Math.round(e.len*(e.t1-e.t0)/T)),x=e.b[0]-e.a[0],y=e.b[2]-e.a[2],w=Math.hypot(x,y)||1;for(let s=0;s<d;s++){const l=e.t0+(e.t1-e.t0)*(s+.5)/d,f=O(e,l),H=o()*6.2832,_=o(),S=.66+.2*o(),z=.5+.3*o(),v=M[(c+s*R)%8];n.push(f[0],f[1]-.02,f[2],S),p.push(e.px,e.pz,e.sway*4*l*(1-l),e.phase),h.push(x/w,y/w,H,_),m.push(v.r,v.g,v.b,z)}++G%10===0&&await C.yield()}const i=new t.PlaneGeometry(1,1),a=new t.InstancedBufferGeometry;a.index=i.index,a.setAttribute("position",i.attributes.position);for(const[e,c]of[["aP",n],["aHang",p],["aF",h],["aC",m]])a.setAttribute(e,new t.InstancedBufferAttribute(new Float32Array(c),4));const r=n.length/4;a.instanceCount=r;const u=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,vertexShader:V,fragmentShader:j,uniforms:{...N(),uTime:P.uTime}}),g=new t.Mesh(a,u);return g.frustumCulled=!1,{object:g,triangles:r*2,drawCalls:1,count:r,update(){},dispose(){i.dispose(),a.dispose(),u.dispose()}}}export{U as buildFlags};
