import*as d from"./valley-inside-the-works-plan.js";const u=256,w=`
attribute vec2 aCorner; attribute vec3 aSeed; attribute vec4 aKind;
uniform vec3 uBox, uDrift, uLightDir; uniform float uTime, uViewH, uAmount;
uniform sampler2D uPlan; uniform vec2 uPlanZ;
varying vec2 vC; varying float vA; varying float vWarm;
${d.LIGHT_BAR_GLSL}
// the plan's table at z: row 0.25 holds (floor level, the river's middle x, its half width), row 0.75 the flown
// line's (x, y) at that z; read between its two nearest samples
vec4 planAt(float z, float row) {
  float f = clamp((uPlanZ.x - z) * uPlanZ.y, 0.0, ${(u-2).toFixed(1)}), i = floor(f);
  return mix(texture2D(uPlan, vec2((i + 0.5) / ${u.toFixed(1)}, row)), texture2D(uPlan, vec2((i + 1.5) / ${u.toFixed(1)}, row)), f - i);
}
void main() {
  float ph = aKind.y;
  // the mote's place in the endless field, by the clock alone
  vec3 p = aSeed * uBox + uDrift * (uTime * aKind.z)
    + 0.9 * vec3(sin(uTime * 0.21 + ph * 6.283), 0.6 * sin(uTime * 0.17 + ph * 9.1), cos(uTime * 0.19 + ph * 4.7));
  // the copy of it nearest the eye, and the fade toward the faces of the piece that is drawn
  vec3 rel = mod(p - cameraPosition + 0.5 * uBox, uBox) - 0.5 * uBox;
  vec3 wp = cameraPosition + rel;
  float dist = length(rel);
  vec3 q = abs(rel) / uBox;
  float edge = (1.0 - smoothstep(0.36, 0.5, q.x)) * (1.0 - smoothstep(0.36, 0.5, q.y)) * (1.0 - smoothstep(0.36, 0.5, q.z));
  // a medium thins toward the eye by true distance
  float nearFade = smoothstep(0.6, 2.5, dist);
  // where it is thick: low over the meadow; thinner over the river and high under the roof; none under the floor;
  // and none near the flown line
  vec4 ground = planAt(wp.z, 0.25), way = planAt(wp.z, 0.75);
  float h = wp.y - ground.x;
  float bank = abs(wp.x - ground.y) - ground.z;
  float thick = mix(1.0, 0.3, smoothstep(5.0, 24.0, h)) * mix(0.4, 1.0, smoothstep(-2.0, 5.0, bank)) * step(0.2, h);
  thick *= smoothstep(3.0, 6.0, length(wp.xy - way.xy));
  // lit by the bar it hangs in; dust throws the light on forward, so it glitters when we look toward the light
  float bar = lightBar(wp);
  float cg = dot(rel / max(dist, 1e-3), uLightDir);
  float fwd = 0.35 + 1.7 * max(cg, 0.0) * max(cg, 0.0) * max(cg, 0.0);
  float twinkle = 0.62 + 0.38 * sin(uTime * (1.3 + 2.2 * ph) + ph * 40.0);
  vec4 mv = viewMatrix * vec4(wp, 1.0);
  float depth = max(-mv.z, 0.05);
  // the footprint filter: never drawn under 0.62 of a pixel in radius; a smaller mote's light is spread over that
  float r = aKind.x, rMin = 0.62 * 2.0 * depth / (projectionMatrix[1][1] * max(uViewH, 1.0)), rr = max(r, rMin);
  vA = uAmount * bar * edge * nearFade * thick * fwd * twinkle * (r * r) / (rr * rr);
  vWarm = aKind.w;
  vC = aCorner;
  mv.xy += aCorner * rr;
  gl_Position = projectionMatrix * mv;
}`,p=`
uniform vec3 uColor, uColor2;
varying vec2 vC; varying float vA; varying float vWarm;
void main() {
  float d = length(vC);
  float k = 1.0 - smoothstep(0.0, 1.0, d);
  float a = k * k * vA;
  gl_FragColor = vec4(mix(uColor, uColor2, vWarm) * a, 1.0);
}`;function x(e){const f=d.SHED.zDown,v=d.SHED.zHead,a=new Uint16Array(u*2*4),h=d.ROUTE,r=e.DataUtils.toHalfFloat;for(let o=0;o<u;o++){const t=f+(v-f)*o/(u-1);let s=0;for(;s+2<h.length&&h[s+1][2]>t;)s++;const i=h[s],m=h[s+1],c=Math.min(1,Math.max(0,(i[2]-t)/(i[2]-m[2])));a.set([r(d.floorLevel(t)),r(d.riverX(t)),r(d.riverHalfWidth(t)),0],o*4),a.set([r(i[0]+(m[0]-i[0])*c),r(i[1]+(m[1]-i[1])*c),0,0],(u+o)*4)}const n=new e.DataTexture(a,u,2,e.RGBAFormat,e.HalfFloatType);return n.minFilter=n.magFilter=e.NearestFilter,n.generateMipmaps=!1,n.needsUpdate=!0,{tex:n,zed:new e.Vector2(f,(u-1)/(f-v))}}function g(e,f,v,a,h){const r=Math.max(200,Math.round(2600*h)),n=new Float32Array(r*3),o=new Float32Array(r*4);for(let l=0;l<r;l++)n[l*3]=a(),n[l*3+1]=a(),n[l*3+2]=a(),o[l*4]=.022+.05*a()*a(),o[l*4+1]=a(),o[l*4+2]=.5+a(),o[l*4+3]=a();const t=new e.InstancedBufferGeometry;t.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setAttribute("aCorner",new e.Float32BufferAttribute([-1,-1,1,-1,1,1,-1,1],2)),t.setIndex([0,1,2,0,2,3]),t.setAttribute("aSeed",new e.InstancedBufferAttribute(n,3)),t.setAttribute("aKind",new e.InstancedBufferAttribute(o,4)),t.instanceCount=r;const s=new e.Color(f.sun),i=x(e),m=new e.ShaderMaterial({uniforms:{uBox:{value:new e.Vector3(46,28,46)},uDrift:{value:new e.Vector3(.1,.045,.2)},uLightDir:{value:v},uTime:{value:0},uViewH:{value:720},uAmount:{value:f.motes},uPlan:{value:i.tex},uPlanZ:{value:i.zed},uColor:{value:s.clone().lerp(new e.Color("#ffe2b0"),.4).multiplyScalar(2.4)},uColor2:{value:s.clone().lerp(new e.Color("#ffc46a"),.7).multiplyScalar(2.4)}},vertexShader:w,fragmentShader:p,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,fog:!1}),c=new e.Mesh(t,m);return c.frustumCulled=!1,c.renderOrder=3,{mesh:c,geometry:t,material:m,table:i.tex}}export{g as makeDust};
