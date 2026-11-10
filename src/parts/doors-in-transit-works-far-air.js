import{FAR as o,FAR_AIR_GLSL as u,DOOR as x}from"./doors-in-transit-plan.js";function $(e,t,i,r){const n=Math.hypot(t.x,t.z),l=n>1e-6?.5-.5*t.z/n:.5,c=new e.Color(i).multiply(new e.Color(1,1,1).lerp(new e.Color(r),.6)).multiplyScalar(.8);return new e.Color(i).lerp(new e.Color("#dfe8ee"),.6).multiplyScalar(.94).lerp(c,l*l*(3-2*l))}function W(e,t){const i=Math.max(t.r,t.g,t.b,.001);return new e.Color(1,1,1).lerp(t.clone().multiplyScalar(1/i),.5).multiplyScalar(.85)}const a=e=>Number(e).toFixed(3),v=a(o.xGone),m=a(x.drop),y=a(x.depth),s=.42,f=6,h=.18,p=`
uniform vec3 uFarAir, uLit;
varying vec3 vWorld;
${u}
vec4 farPaint(vec3 paint) { return vec4(mix(paint * uLit, uFarAir, farAir(vWorld)), 1.); }
`,g=`
attribute float aKind;      // 0: a corner of the door's own box; 1: of a hanger strap
attribute vec4 aPlace;      // its place along its rail at clock 0, the rail's height, the rank's z, the rail's speed (signed)
attribute vec4 aSize;       // its width, its height, the leaf's style (0..3, and 4 more if round-headed), its frame (0..3)
attribute vec3 aPaint;
uniform float uTime; uniform vec3 uStrap;
varying vec3 vWorld; varying vec3 vPaint; varying vec3 vFlat; varying vec4 vFace; varying vec2 vWhat;
void main() {
  float x = mod(aPlace.x + aPlace.w * uTime + ${v}, 2. * ${v}) - ${v};
  float body = 1. - aKind, front = body * step(.5, normal.z);
  vec3 q = vec3(position.x * mix(1., aSize.x, body), mix(mix(aSize.y, ${m}, position.y), position.y * aSize.y, body), position.z * mix(1., ${y}, body));
  vec4 wp = modelMatrix * vec4(x + q.x, aPlace.y - ${m} + q.y, aPlace.z + q.z, 1.);
  vWorld = wp.xyz; vPaint = aPaint;
  // the frame: white, cream, stone or wood, as the hall's door kinds deal theirs (the joiner's four, doors.js)
  vec3 frame = aSize.w < .5 ? vec3(.60, .59, .55) : aSize.w < 1.5 ? vec3(.56, .49, .33) : aSize.w < 2.5 ? vec3(.36, .35, .32) : vec3(.22, .135, .07);
  vFlat = mix(uStrap, frame * mix(.8, 1., front), body);      // a strap; the box's sides, head and sill; the frame on its face
  vFace = vec4(q.x + .5 * aSize.x, q.y, aSize.x, aSize.y);     // metres on the face from its lower corner; the face's size
  vWhat = vec2(front, aSize.z);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,w=`
varying vec3 vPaint; varying vec3 vFlat; varying vec4 vFace; varying vec2 vWhat;
${p}
void main() {
  vec3 col = vFlat;
  if (vWhat.x > .5) {
    vec2 f = vFace.xy, s = vFace.zw, px = fwidth(f) + 1e-4;
    float style = floor(vWhat.y + .5), arch = step(3.5, style); style -= 4. * arch;
    // the leaf inside its frame, round-headed on some: above its springing it keeps inside the half circle
    vec2 ls = s - vec2(2. * ${a(s)}, ${a(s)}), lf = f - vec2(${a(s)}, 0.);
    float leaf = clamp(min(lf.x, ls.x - lf.x) / px.x + .5, 0., 1.) * clamp((ls.y - lf.y) / px.y + .5, 0., 1.);
    float r = .5 * ls.x; vec2 c = lf - vec2(r, ls.y - r);
    leaf *= mix(1., clamp((r - length(c)) / max(px.x, px.y) + .5, 0., 1.), arch * step(0., c.y));
    // its fields: four sunk panels, two tall ones, seven planks with dark joints, or three panels one over another
    bool planks = style > 1.5 && style < 2.5;
    vec2 cells = style < .5 ? vec2(2., 2.) : style < 1.5 ? vec2(2., 1.) : planks ? vec2(7., 1.) : vec2(1., 3.);
    vec2 g = lf / ls * cells, e = (.5 - (planks ? .05 : .4) * cells / ls - abs(fract(g) - .5)) / (fwidth(g) + 1e-4);
    float field = clamp(e.x + .5, 0., 1.) * clamp(e.y + .5, 0., 1.);
    col = mix(vFlat, vPaint * (planks ? mix(.7, 1., field) : mix(1., .8, field)), leaf);
  }
  gl_FragColor = farPaint(col);
}`,z=`
attribute vec3 aBoxC; attribute vec3 aBoxD;
varying vec3 vWorld; varying float vTone;
void main() {
  vec4 wp = modelMatrix * vec4(aBoxC + position * aBoxD, 1.);
  vWorld = wp.xyz; vTone = .82 + .18 * normal.z + .1 * normal.y;      // painted tones by the way a face looks: no light
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,S=`
uniform vec3 uPaint; varying float vTone;
${p}
void main() { gl_FragColor = farPaint(uPaint * vTone); }`,F=`
attribute float aSheet; varying vec3 vWorld; varying float vSheet;
void main() { vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz; vSheet = aSheet; gl_Position = projectionMatrix * viewMatrix * wp; }`,P=`
uniform vec3 uPaint; varying float vSheet;
${p}
void main() {
  if (vSheet > .5) { gl_FragColor = vec4(uFarAir, 1.); return; }
  vec2 p = vWorld.xz / ${a(f)}, px = fwidth(p) + 1e-5;
  // a joint is a thin line: the share of the pixel it covers, never more than its own width in pixels
  vec2 line = clamp((${a(h/f/2)} - (.5 - abs(fract(p) - .5))) / px + .5, 0., 1.) * min(vec2(1.), ${a(h/f)} / px);
  float flag = (1. - line.x) * (1. - line.y);
  float own = fract(dot(floor(p), vec2(.3183, .7071))) * clamp(1.5 - max(px.x, px.y), 0., 1.);      // each flag a little its own tone, while a flag is wider than a pixel
  float dz = abs(mod(${a(o.first)} - vWorld.z + ${a(o.step/2)}, ${a(o.step)}) - ${a(o.step/2)});
  float under = step(vWorld.z, ${a(o.first+o.step/2)}) * step(${a(o.first-o.step*(o.ranks-.5))}, vWorld.z);
  gl_FragColor = farPaint(uPaint * (.93 + .09 * own) * mix(.8, 1., flag) * (1. - .22 * under * exp(-dz * dz / 30.)));
}`;function A(e,t,i){const r=(n,l,c,d)=>new e.ShaderMaterial({uniforms:Object.assign({uTime:t.uTime,uFarAir:t.uFarAir,uLit:t.uLit},c),vertexShader:n,fragmentShader:l,fog:!1,side:d||e.FrontSide});return{doors:r(g,w,{uStrap:{value:new e.Color(i.strap)}}),iron:r(z,S,{uPaint:{value:new e.Color(i.iron)}}),ground:r(F,P,{uPaint:{value:new e.Color(i.ground).multiplyScalar(i.groundLit)}},e.DoubleSide)}}export{s as FRAME,h as JOINT,f as SLAB,$ as farAirColour,W as farLit,A as farMaterials};
