import*as n from"three";import{makePath as ht,clamp as N,smoothstep as R}from"../kit/core.js";import{mergeGeometries as Kt}from"three/addons/utils/BufferGeometryUtils.js";import{buildHero as Qt,SKY_GLSL as De}from"../parts/engine-turned-sea.js";const u=Math.PI*2,Jt=`
attribute vec4 aTint;      // rgb enamel tint, a = kind (0 enamel, 1 gold, 2 gem, 3 pearl)
attribute vec4 aAnim;      // x phase, y shiver amount, z spin rate, w pattern scale
attribute vec4 aPat;       // x: the cut under the glass (0 wave rings, 1 crossed twist, 2 scales, 3 rings in a gold trellis); the rest spare
uniform float uTime;
varying vec3 vN, vW, vTint; varying vec2 vUv; varying float vKind, vPh, vScale, vCut;
void main(){
  vec3 p = position; vec3 n = normal; vCut = aPat.x;
  float sp = aAnim.z * uTime + aAnim.x;
  float c = cos(sp * step(0.0001, abs(aAnim.z))), s = sin(sp * step(0.0001, abs(aAnim.z)));
  p.xz = mat2(c, -s, s, c) * p.xz; n.xz = mat2(c, -s, s, c) * n.xz;
  float sh = aAnim.y * sin(uTime * 5.3 + aAnim.x * 7.0);
  p.y += sh * p.x; n = normalize(n + vec3(-sh, 0.0, 0.0) + vec3(0.0, 1e-5, 0.0));
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.0);
  w.y += min(aAnim.y, 0.06) * 2.6 * (0.55 + 0.55 * sin(uTime * 1.4 + aAnim.x * 3.0));                 // pads bob on the swell
  if (aTint.a > 2.5) w.xz += 0.24 * step(0.0001, abs(aAnim.z)) * vec2(cos(sp), sin(sp));   // pad pearls roll round their pads
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * n + vec3(0.0, 1e-6, 0.0));
  vW = w.xyz; vUv = uv; vTint = aTint.rgb; vKind = aTint.a; vPh = aAnim.x; vScale = aAnim.w;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,$t=De+`
uniform float uTime, uGoldBand, uPixelAngle;
varying vec3 vN, vW, vTint; varying vec2 vUv; varying float vKind, vPh, vScale, vCut;
void main(){
  vec3 Vd = vW - cameraPosition; float dist = max(length(Vd), 1e-3); vec3 V = Vd / dist;
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
  float nv = clamp(dot(N, -V), 0.0, 1.0);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 T = up - N * dot(N, up); float tl = length(T); T = mix(vec3(1.0, 0.0, 0.0), T / max(tl, 1e-3), step(0.05, tl));
  vec3 B = cross(N, T);
  // the cut under the glass: a coarse wave family along the meridian, a fine one for close passes
  float f = vUv.y * 90.0 * vScale + 1.4 * sin(vUv.x * 6.2832 * 12.0);
  float f2 = vUv.x * 6.2832 * 48.0 + 0.8 * sin(vUv.y * 40.0);
  // the jewelled eggs that stand by the route are each cut their own way: lines two pixels wide or more, gone to satin when their pitch is too fine for the pixels
  float lon = vUv.x * 6.2832, own = step(0.5, vCut);
  float fa = f, fb = f2;
  if (vCut > 0.5) {
    if (vCut < 1.5) { fa = 16.0 * lon + 44.0 * vUv.y; fb = 16.0 * lon - 44.0 * vUv.y; }                    // two twists crossing: a lozenge of light that visibly turns
    else if (vCut < 2.5) {                                                                                  // scales, each a fan of arcs
      float v = vUv.y * 9.0, row = floor(v);
      vec2 cq = vec2((fract(lon * 2.5465 + 0.5 * mod(row, 2.0)) - 0.5) * 1.25, fract(v) - 1.0);
      fa = 7.0 * sqrt(dot(cq, cq) + 1e-8); fb = fa;
    } else { fa = 70.0 * vUv.y + 1.6 * sin(lon * 16.0); fb = fa; }                                          // close wavy rings, bound in a gold trellis
  }
  // No derivatives: the rate of each cut's phase per pixel comes from its pitch on the shell (ga, gb, gt: radians a metre), the range, N.V and
  // uPixelAngle. A line is never under two pixels wide, and a cut whose pitch falls under about six pixels goes to plain satin.
  float eh = max(40.0 * vScale, 1.0), er = max(0.335 * eh * sin(3.1416 * clamp(vUv.y, 0.0, 1.0)), 0.06 * eh), em = 1.34 * eh;
  float ga = 1.0, gb = 1.0;
  if (vCut > 0.5) {
    if (vCut < 1.5) { ga = sqrt(256.0 / (er * er) + 1936.0 / (em * em)); gb = ga; }
    else if (vCut < 2.5) { ga = 7.0 * max(3.18 / er, 6.0 / em); gb = ga; }
    else { ga = sqrt(4900.0 / (em * em) + 655.0 / (er * er)); gb = ga; }
  }
  float pxm = dist * uPixelAngle / max(nv, 0.08);                                                           // metres of shell under one pixel
  float wa = max(ga * pxm, 1e-4), wb = max(gb * pxm, 1e-4);
  float hair = own * max((1.0 - smoothstep(0.4 * wa, 0.7 * wa, abs(sin(0.5 * fa)))) * (1.0 - smoothstep(0.97, 1.8, wa)), (1.0 - smoothstep(0.4 * wb, 0.7 * wb, abs(sin(0.5 * fb)))) * (1.0 - smoothstep(0.97, 1.8, wb)));
  float hsat = own * 0.3 * smoothstep(0.97, 1.8, min(wa, wb));                                              // a cut gone to satin keeps its lines' mean cover as depth
  // the gold trellis is a mount, never a field: six thin bands each way, two pixels wide where that covers under a quarter of the shell, else capped there
  float ta = 6.0 * lon + 15.0 * vUv.y, tb = 6.0 * lon - 15.0 * vUv.y;
  float wu = 0.55 * sqrt(36.0 / (er * er) + 225.0 / (em * em)) * pxm, wt = clamp(wu, 0.06, 0.14);
  float trellis = step(2.5, vCut) * (1.0 - smoothstep(wt, wt * 1.35, min(abs(sin(0.5 * ta)), abs(sin(0.5 * tb))))) * step(0.03, vUv.y) * (1.0 - step(0.9, vUv.y)) * (1.0 - smoothstep(0.5, 0.9, wu));
  float keep = mix(1.0, 1.0 - smoothstep(0.6, 1.5, max(wa, wb)), own);                                      // a cut too fine for the pixels goes to plain satin instead of shimmering
  f = fa; f2 = fb;
  float fine = 1.0 - smoothstep(60.0, 260.0, dist);
  float bend = (0.3 * cos(f) + 0.14 * cos(f2) * fine) * keep;
  vec3 Nb = normalize(N + bend * T + 0.12 * cos(f2) * fine * keep * B);
  vec3 col;
  float gold = step(0.5, vKind) * (1.0 - step(1.5, vKind));
  // gold girdle and rim bands on shells (uv.y near the hinge line)
  float band = uGoldBand * (1.0 - smoothstep(0.012, 0.02, abs(vUv.y - 0.36)));
  band = max(band, uGoldBand * smoothstep(0.468, 0.488, abs(fract(vUv.x * 8.0) - 0.5)) * step(0.36, vUv.y) * (1.0 - step(2.5, vCut)));   // (the trellised egg has its trellis for ribs)
  gold = max(gold, max(band, trellis * uGoldBand)); if (!gl_FrontFacing && uGoldBand > 0.5) gold = 1.0;
  if (vKind > 2.5) {                                   // pearl: soft mirror plus a broad lobe
    vec3 R = reflect(V, N);
    vec3 Nl = normalize(N + vec3(0.0, 0.9, 0.0) + vec3(1e-4));
    col = (mix(etsSky(vec3(R.x, abs(R.y) * 0.35 + 0.07, R.z)), etsSky(vec3(Nl.x, abs(Nl.y) * 0.2 + 0.05, Nl.z)), 0.6) * 0.8 + uSeaAvg * 0.25 * (1.0 - nv)) * vTint + 0.25 * etsSun(R, 0.02);
  } else if (vKind > 1.5) {                            // gem: flat facets mirroring the tent, a limited flash
    vec3 R = reflect(V, N);
    float lobe = 0.5 + 0.5 * cos(dot(R, vec3(3.1, 4.7, 2.3)) * 1.1 + vPh * 6.2832 + uTime * 0.9);   // slow lobes: a turning stone flashes under 3 times a second
    float fl = lobe * lobe; fl = fl * fl; fl = fl * fl; fl = fl * fl;
    col = etsSky(R) * vTint * 0.9 + vTint * 5.0 * fl;
  } else {
    vec3 R = reflect(V, Nb);
    vec3 wide = etsSky(normalize(vec3(R.x, abs(R.y) * 0.5 + 0.1, R.z)));
    vec3 silver = mix(etsSky(R), wide, 0.55) * vec3(0.97, 0.97, 0.95);
    silver = mix(silver, max(silver, uBelt * 0.62), 1.0 - step(0.08, vScale));
    float leaf = 1.0 - step(0.08, vScale);              // tree leaves are thin glass: they keep their green at any angle
    // (the brief's law: the glass is thicker over every cut. On the two jewelled eggs each cut line is a deeper channel, 1.25 path lengths more in the
    // scales and 1.85 in the rings, so it reads the enamel's own rim colour under the glass; no light is added on a line)
    float path = 1.0 / max(mix(0.25, 0.8, leaf), nv) + mix(0.5 * (0.5 - 0.5 * sin(f)), mix(1.25, 1.85, step(2.5, vCut)) * (hair + hsat), step(0.5, vCut));
    // the two jewelled eggs by the route (scales, trellis) are enamel over white silver: the ground is still the mirrored tent, light where it mirrors
    // the belt and dark where it mirrors the lower sky, with only the tent's blue taken out, so the glass reads the palette's own colour face on and
    // deepens where the path through it lengthens at the rim
    float tre = step(2.5, vCut), wsil = step(1.5, vCut);
    silver = mix(silver, vec3(clamp(dot(silver, vec3(0.25, 0.5, 0.25)) * 5.5, 0.4, 1.15)), 0.85 * wsil);   // (the tent's zenith is 0.17 linear: a white silver that mirrors it face on)
    vec3 glass = silver * exp(log(clamp(vTint, vec3(0.02), vec3(1.0))) * (path + 2.4 * wsil * (1.0 - nv) * (1.0 - nv)) * (0.95 + 0.12 * wsil));
    float rk = mix(1.0, 0.25, step(2.5, vCut));          // the trellised egg's gold is chased four times as wide, so it holds as relief (never a pixel stipple) from across the water
    float lr = 0.5 + 0.5 * cos(vUv.x * 6.2832 * 64.0 * rk) * cos(vUv.y * 400.0 * vScale * rk);
    vec3 Rg = reflect(V, normalize(N + 0.3 * (lr - 0.5) * T));
    vec3 gsky = mix(etsSky(Rg), etsSky(normalize(vec3(Rg.x, abs(Rg.y) * 0.5 + 0.1, Rg.z))), 0.6);
    vec3 gcol = gsky * vec3(1.0, 0.78, 0.34) * (0.85 + 0.3 * lr);
    // the trellised egg's mounts mirror the tent with its blue taken out, through the brief's gold reflectance (1.0, 0.78, 0.34): about two bounces in
    // the light (#D9B25A), three and more where the chasing turns from it (#6E4A14)
    float gl = clamp(dot(gsky, vec3(0.25, 0.5, 0.25)), 0.02, 1.4);
    gcol = mix(gcol, min(6.7 * gl * sqrt(gl), 0.78) * exp(vec3(0.0, -0.2485, -1.0788) * mix(3.2, 1.8, smoothstep(0.08, 0.25, gl))) * (0.85 + 0.3 * lr), tre);
    col = mix(glass, gcol, gold);
    vec3 Rc = reflect(V, N);
    float fr = 1.0 - nv; float f5 = fr * fr; f5 = f5 * f5 * fr;
    col += (0.04 + 0.96 * f5) * etsSky(Rc) * (1.0 - 0.6 * gold) * (1.0 - 0.6 * wsil) + 1.2 * etsSun(Rc, 0.0006);   // (the two jewelled eggs' rims deepen: less of the tent in their top coat)
    col += uBelt * 0.26 * (1.0 - 0.5 * wsil) * (1.0 - gold) * (1.0 - leaf) * smoothstep(-0.04, 0.02, Rc.y) * (1.0 - smoothstep(0.2, 0.34, Rc.y)) * (0.75 + 0.25 * cos(f) * keep);   // glass over silver: the pearl belt as one crisp band in the top coat
    col = etsClamp(col);
    // far eggs go satin and take a little of the pale belt
    col = mix(col, uBelt, 0.35 * smoothstep(300.0, 1500.0, dist));   // (the coat takes up to 35 percent of the pale belt by 1.5 km; nothing else)
  }
  gl_FragColor = vec4(col, 1.0);
}`,ea=`
attribute vec4 aBase;      // the egg: x, z, height
attribute vec3 aTintI;
attribute float aW;        // 0 = the sea's own shader is showing this egg's image whole
varying vec3 vT, vP, vE;
void main(){
  vec2 toC = cameraPosition.xz - aBase.xy; float dl = sqrt(dot(toC, toC) + 1e-4);
  vec2 right = vec2(-toC.y, toC.x) / dl;
  // a patch that bounds the image: an outline wider than the egg (position.x across, position.y up, in heights), each point carried to where its
  // mirror image meets the sea plane
  float h = max(cameraPosition.y, 0.5), y = max(position.y * aBase.z, -0.5 * h);
  vec2 pxz = aBase.xy + right * (position.x * aBase.z);
  vec2 img = cameraPosition.xz + (pxz - cameraPosition.xz) * (h / (h + y));
  vT = aTintI; vE = aBase.xyz; vP = vec3(img.x, 0.0, img.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vP, 1.0);
  if (aW < 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
}`,ta=De+`
uniform float uTime, uPixelAngle, uRefOn;
uniform vec3 uRefC, uRefR;                      // the Great Egg's own image zone, shared with the sea's material
varying vec3 vT, vP, vE;
void main(){
  vec3 Vv = cameraPosition - vP; float dist = max(length(Vv), 0.05); vec3 V = Vv / dist;
  float nv = clamp(V.y, 0.0, 1.0);
  vec3 R = vec3(-V.x, V.y, -V.z);
  vec4 im = etsEggImage(vP, R, vE, vT);
  // where the sheet shows the Great Egg's own image, that image hides this one
  vec3 ir = 1.0 / max(uRefR, vec3(1e-3));
  vec3 o = (vP - uRefC) * ir, d = R * ir;
  float qa = max(dot(d, d), 1e-8), qb = dot(o, d), qc = dot(o, o) - 1.0;
  float zone = uRefOn * smoothstep(0.0, 0.3, (qb * qb - qa * qc) / qa) * max(step(qb, 0.0), step(qc, 0.0));
  // as strong as the sea's own ten images near by, thinning into the satin with range
  float k = 0.85 * im.a * (1.0 - 0.75 * smoothstep(700.0, 2600.0, dist)) * (1.0 - smoothstep(0.0, 0.5, zone));
  if (k < 0.004) discard;
  vec3 col = mix(etsSeaGround(V, nv, dist), im.rgb, k);
  vec2 h1 = etsSeaCut(vP.xz, V, nv, dist, uTime, uPixelAngle);
  col = etsSeaSatin(col, V, nv, 1.5 * uPixelAngle, h1.x, h1.y);
  gl_FragColor = vec4(etsClamp(col), 1.0);
}`,aa=De+`
uniform float uTime, uPixelAngle;
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir + vec3(0.0, 1e-6, 0.0));
  // The horizon is one straight hard line: sea below, tent above, met across a pixel and a half (no derivatives: uPixelAngle), so a rolled horizon
  // never steps in blocks.
  float he = 0.75 * uPixelAngle, hz = smoothstep(-he, he, d.y);
  vec3 c = vec3(0.0), cs = vec3(0.0);
  if (d.y < he) {
    // below the horizon the dome is the sea itself, its cut gone to satin and the swell bands surviving in it: the sheet's rim never shows
    float ny = max(-d.y, 0.0);
    cs = etsSeaSatin(etsSeaBase(ny, vec2(0.0), 0.0) + etsSky(vec3(d.x, ny, d.z)) * 0.05, vec3(-d.x, ny, -d.z), ny, 1.5 * uPixelAngle, 0.0, 1.0);
  }
  if (d.y > -he) {
    // THE TENT is the one sky every surface mirrors: periwinkle zenith, the pearl belt from the hard horizon to 18 degrees (brightest at 6), three
    // faint bars across the zenith. Nothing is painted over it but the sun. (The direction is held 0.7 degrees up so the horizon stays a hard line.)
    c = etsSky(vec3(d.x, max(d.y, 0.0125), d.z)) + vec3(1.0, 0.97, 0.9) * 6.0 * etsSun(d, 0.0004);
    // a jewelled sun: sixteen cut rays and a ring of brilliants round the disc
    float sm = dot(d, uSunDir);
    vec3 sx = cross(uSunDir, vec3(0.0, 1.0, 0.0)); sx /= max(length(sx), 1e-4);
    vec3 sy = cross(sx, uSunDir);
    float px = dot(d, sx), py = dot(d, sy), pr = sqrt(px * px + py * py);
    float pa = atan(py, pr < 1e-5 ? 1.0 : px);
    float ray = 0.5 + 0.5 * cos(16.0 * pa + uTime * 0.05); ray *= ray; ray *= ray; ray *= ray;
    float sunUp = step(0.0, uSunDir.y) * step(0.0, sm);
    c += vec3(1.0, 0.95, 0.85) * sunUp * (0.5 * ray * exp(-pr / 0.09) * smoothstep(0.03, 0.06, pr) + 0.25 * exp(-pr / 0.05));
    float hb = (pr - 0.075) / 0.006;
    float gemr = 0.5 + 0.5 * cos(24.0 * pa); gemr *= gemr; gemr *= gemr;
    c += vec3(1.0, 0.97, 0.9) * sunUp * 2.5 * exp(-min(hb * hb, 30.0)) * gemr;
  }
  gl_FragColor = vec4(mix(cs, c, hz), 1.0);
}`,sa=`
varying vec3 vDir;
void main(){ vDir = position; vec4 p = projectionMatrix * viewMatrix * vec4(position + cameraPosition, 1.0); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,oa=[["#8FA8E0","#F1C9C4","#F2E3A0","#B79AD6","#A9D6A0","#D9B25A","#F7F8FF"],["#7FCDB8","#F2A58E","#F1E2A8","#6C6FC4","#C9DDA0","#D9B25A","#F7F8FF"],["#D9DEE8","#D8443C","#3FA871","#3F5FC8","#E6C86A","#D9B25A","#F7F8FF"]];function de(h,p,B){const U=[];for(let F=0;F<=B;F++){const E=h+(p-h)*F/B;let te;if(E<.36)te=.34*Math.sqrt(Math.max(0,1-((.36-E)/.5)**2));else{const x=(E-.36)/.64;te=.34*Math.sqrt(Math.max(0,1-x*x))*(1-.14*x*x)}U.push(new n.Vector2(Math.max(te,5e-4),E))}return U}function fe(h,p){const B=h.attributes.position,U=h.attributes.uv;for(let F=0;F<B.count;F++)U.setXY(F,U.getX(F)*p,B.getY(F));return h}var ha={id:"engine-turned-sea",name:"The Engine-Turned Sea",category:"bizarre",weirdness:.8,media:["air","open","water"],async build(h){const p=h.rng,B=h.quality?.detail??1,U=h.vary||{},F=new n.Scene;let E=p.int(0,2);U.hour==="golden"||U.hour==="dawn"?E=1:U.hour==="day"&&(E=0);const te=p.int(0,2),x=oa[te],dt=Math.round(p.range(30,40)*N(U.density??1,.8,1.15)),Ne=p.int(2,4),Ie=p.chance(.4),qe=!!U.rare,y=(e,a=1)=>new n.Color(e).multiplyScalar(a),m=new n.Vector3(80,0,575),ft=-Math.PI/3,Se=(E===1?12:E===2?-20:38)*Math.PI/180,gt=new n.Vector3(-.866*Math.cos(Se),Math.sin(Se),.5*Math.cos(Se)).normalize(),pt=(e,a)=>{const t=new n.Color(e);return t.setRGB(Math.pow(t.r,a),Math.pow(t.g,a),Math.pow(t.b,a)),"#"+t.getHexString()},mt=E===2?x.map((e,a)=>a>=1&&a<=3?pt(e,[0,1.45,1.15,1.3][a]):e):x,w=await Qt(h,{palette:mt,detail:B,progress:0,apron:!0,apronRadius:3600,portalGlow:!1,sunDir:gt,rampMirror:!0});w.object.position.copy(m),w.object.rotation.y=ft,w.object.updateMatrixWorld(!0),F.add(w.object),w.parts.glow&&(w.parts.glow.visible=!1);const I=w.skyUniforms;E===1&&(I.uBelt.value.set(1.3,.92,.6),I.uZenith.value.set(.17,.2,.5)),E===2&&(I.uBelt.value.set(1.12,1.1,1.08),I.uZenith.value.set(.34,.37,.48)),await h.yield();const vt=w.anchors.portalSeat.position.y,_=e=>{const a=new n.Vector3(0,vt-Math.tan(14*Math.PI/180)*e,e);return w.object.localToWorld(a)},q=(e,a,t)=>w.object.localToWorld(new n.Vector3(e,a,t)),ge=[[0,5,0],[0,5,60],[0,5,110],[-25,5.5,200],[-62,6.5,300]],ae=ht([...ge,[-100,9,400],[-128,12,480],[-158,16,548],[-180,21.5,600],[-179.6,28,643.5],[-165.6,34,665.4],[-123.2,39,683],_(200),_(130),_(60),_(0)]),Te=[...ge,q(-262,22,50),q(-205,72,105),q(-135,138,128),q(-62,176,116),q(10,150,158),q(62,112,205),q(92,78,250),q(70,52,292),q(22,42,290),_(200),_(130),_(60),_(0)],A=ht(Te);await h.yield();const d=new n.Vector3,Fe=new n.Vector3,ut=new n.Vector3,wt=new n.Vector3,He=(e,a)=>ae.curve.getPointAt(N(e,0,1),a),Pe=(e,a)=>A.curve.getPointAt(N(e,0,1),a),L=(e,a,t)=>(He(e,t),ae.curve.getTangentAt(N(e,0,1),Fe),t.set(t.x-Fe.z*a,0,t.z+Fe.x*a));await h.yield();const ke=new n.Mesh(new n.SphereGeometry(1,32,16),new n.ShaderMaterial({uniforms:{...I},vertexShader:sa,fragmentShader:aa,side:n.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));ke.frustumCulled=!1,ke.renderOrder=-10,F.add(ke);const We=(e,a)=>new n.ShaderMaterial({uniforms:{...I,uGoldBand:{value:e}},vertexShader:Jt,fragmentShader:$t,side:a,fog:!1}),se=We(1,n.DoubleSide),Y=We(0,n.DoubleSide),V=(e,a,t,s)=>{const o=new n.InstancedMesh(e,a,t);return o.name=s,o.frustumCulled=!1,e.setAttribute("aTint",new n.InstancedBufferAttribute(new Float32Array(t*4),4)),e.setAttribute("aAnim",new n.InstancedBufferAttribute(new Float32Array(t*4),4)),e.setAttribute("aPat",new n.InstancedBufferAttribute(new Float32Array(t*4),4)),F.add(o),o},G=(e,a,t,s,o,r,l,c,i)=>{e.setMatrixAt(a,t),e.geometry.attributes.aTint.setXYZW(a,s.r,s.g,s.b,o),e.geometry.attributes.aAnim.setXYZW(a,r,l,c,i)},g=new n.Matrix4,xt=new n.Matrix4,P=new n.Quaternion,k=new n.Vector3,O=new n.Vector3(0,1,0),na=new n.Vector3(1,0,0),Z=[y(x[1]),y(x[2]),y(x[3]),y(x[4]),y("#E9E2D2"),y(x[0]).lerp(y("#B9C4F2"),.4)],b=[],je=215,Oe=(e,a,t)=>b.every(s=>Math.hypot(s.x-e,s.z-a)>s.H*.34+t+8),oe=(e,a,t,s,o)=>{const r={x:e,z:a,H:t,tint:s,u0:o,open:o>=0,rot:p.range(0,u),k:0};return b.push(r),r};L(.1,-120,d),oe(d.x,d.z,34,Z[4],-1),L(.185,22,d),oe(d.x,d.z,36,Z[3],-1);const _e=[.26,.34,.43,.5,.58,.66],yt=[.2,.215,.3,.36,.42,.5];for(let e=0;e<_e.length;e++){const a=p.range(21,29);L(_e[e]+(e===1?.058:.035),(e===2?-1:1)*(a*.34+p.range(11,15)+(e===2?24:0)),d),oe(d.x,d.z,a,Z[[5,1,2,3,4,0][e]],yt[e])}{const e=(r,l,c,i,f,v,T,z)=>{const j=q(r,0,l);b.push({x:j.x,z:j.z,H:c,tint:i,u0:v,open:v>=0,rot:0,k:0,cut:f,maxOpen:T,spin:z,feature:v<0,own:!0})},a=.5*(w.anchors.hinges.rose.z+je),t=74,s=64;let o=5.5;for(;o>3&&2*a*Math.sin((6-o)*Math.PI/12)<.335*(t+s);)o-=1;e(a*Math.sin(o*u/12),a*Math.cos(o*u/12),t,y(x[3]).lerp(y("#ffffff"),.1),3,-1,1,u/40),e(0,-a,s,y(x[4]),2,.37,.38,0)}if(qe){He(.6,d);const e=m.x-d.x,a=m.z-d.z,t=Math.hypot(e,a)||1,s=d.x,o=d.z,r=[[150,-21,22,3],[215,-27,30,2],[330,-25,34,0],[400,-20.5,40,3],[505,-15.5,46,1],[470,17,44,5],[600,-24,52,2]];for(const[l,c,i,f]of r){const v=c*Math.PI/180,T=Math.cos(v),z=Math.sin(v),j=(e*T-a*z)/t,Ae=(a*T+e*z)/t,D=s+j*l,J=o+Ae*l,Zt=Math.hypot(D-m.x,J-m.z);ae.nearestXZ(D,J).dist<i*.34+30||!Oe(D,J,i*.34)||oe(D,J,i,Z[f],.5+.075*N((Zt-140)/260,0,1))}}let Xe=0,Le=0;for(;b.length<dt+4&&Xe++<4e3;){Xe%20===0&&await h.yield();const e=p.range(0,u),a=60+840*Math.pow(p(),.7),t=-60+Math.cos(e)*a,s=420+Math.sin(e)*a,o=p.range(20,90),r=o*.34+4;if(ae.nearestXZ(t,s).dist<r+26||Math.hypot(t-m.x,s-m.z)<je+r||!Oe(t,s,r)||Math.abs(t)<40+r&&s<560&&s>-20)continue;{const j=N((t*m.x+s*m.z)/(m.x*m.x+m.z*m.z),0,1);if(Math.hypot(t-m.x*j,s-m.z*j)<r+55)continue}const c=Math.hypot(t-m.x,s-m.z),i=t+150,f=s-540,v=Math.max(1,Math.hypot(i,f)),T=(i*.99+f*.15)/v>.72&&c<850&&Le<14,z=qe&&(T||c<520&&o<60);z&&T&&Le++,oe(t,s,o,Z[p.int(0,5)],z?.44+.12*N((c-215)/635,0,1):-1)}await h.yield();{const e=[],a=ge[ge.length-1];let t=0,s=1e9;for(let o=0;o<=A.length;o+=2.5){A.posAtDist(o,d),e.push([d.x,d.y,d.z,o]);const r=Math.hypot(d.x-a[0],d.z-a[2]);r<s&&(s=r,t=o)}for(const o of b)for(let r=0;r<4;r++){const l=o.H*.34+4;let c=1e9,i=0,f=0,v=0;for(const D of e){if(D[1]>o.H+24)continue;const J=Math.hypot(o.x-D[0],o.z-D[2]);J<c&&(c=J,i=D[0],f=D[2],v=D[3])}if(c>=l+28||v<=t)break;const T=o.x-i,z=o.z-f,j=Math.hypot(T,z)||1,Ae=l+32-c;o.x+=T/j*Ae,o.z+=z/j*Ae}}const X=[...b.filter(e=>e.open&&!e.own),...b.filter(e=>e.open&&e.own)],Ye=b.filter(e=>!e.open&&!e.feature),Ze=b.filter(e=>e.feature),Ke=e=>h.core.makeRng(h.core.hashSeed(e+":"+h.seed)),C=Ke("pads"),pe=Ke("added-eggs");for(const e of b)e.own&&(e.rot=pe.range(0,u),e.ph=pe.range(0,u));await h.yield();const bt=fe(new n.LatheGeometry(de(0,1,16),22),1),Mt=V(bt,se,Ye.length,"lesser-eggs");Ye.forEach((e,a)=>{g.compose(d.set(e.x,0,e.z),P.setFromAxisAngle(O,e.rot),k.setScalar(e.H)),G(Mt,a,g,e.tint,0,e.rot,0,(a%2?1:-1)*u/p.range(40,90),e.H/40)}),await h.yield();{const e=V(fe(new n.LatheGeometry(de(0,1,40),56),1),se,Math.max(1,Ze.length),"route-eggs");Ze.forEach((a,t)=>{g.compose(d.set(a.x,0,a.z),P.setFromAxisAngle(O,a.rot),k.setScalar(a.H)),G(e,t,g,a.tint,0,a.rot,0,a.spin,a.H/40),e.geometry.attributes.aPat.setX(t,a.cut)})}await h.yield();{const e=Math.round(56*B),a=V(fe(new n.LatheGeometry(de(0,1,8),10),1),se,e,"far-eggs");for(let t=0;t<e;t++){const s=t*2.39996+.7,o=1250+2e3*(t*.618034%1),r=38+52*(t*.381966%1);g.compose(d.set(-60+Math.cos(s)*o,0,420+Math.sin(s)*o),P.setFromAxisAngle(O,s),k.setScalar(r)),G(a,t,g,Z[t%6],0,s,0,0,r/40)}}await h.yield();const zt=fe(new n.LatheGeometry(de(0,.36,10),32),1),At=fe(new n.LatheGeometry(de(.36,1,18),5,-u/16,u/8),.125),Qe=V(zt,se,Math.max(1,X.length),"opening-cups"),$=V(At,se,Math.max(1,X.length*8),"opening-gores"),St=new n.Matrix4().makeTranslation(0,.36,.34),Tt=new n.Matrix4().makeTranslation(0,-.36,-.34),Je=(e,a,t)=>{for(let s=0;s<8;s++)g.compose(d.set(e.x,0,e.z),P.setFromAxisAngle(O,e.rot+s*u/8),k.setScalar(e.H)),g.multiply(St).multiply(xt.makeRotationX(t*(1.55+.12*Math.sin(s*2.4)))).multiply(Tt),$.setMatrixAt(a*8+s,g)};X.forEach((e,a)=>{e.k=a,e.cur=-1,g.compose(d.set(e.x,0,e.z),P.setFromAxisAngle(O,e.rot),k.setScalar(e.H)),G(Qe,a,g,e.tint,0,e.rot,0,0,e.H/40),Qe.geometry.attributes.aPat.setX(a,e.cut||0);for(let t=0;t<8;t++)$.geometry.attributes.aTint.setXYZW(a*8+t,e.tint.r,e.tint.g,e.tint.b,0),$.geometry.attributes.aAnim.setXYZW(a*8+t,e.rot,0,0,e.H/40),$.geometry.attributes.aPat.setX(a*8+t,e.cut||0);Je(e,a,0)}),$.instanceMatrix.setUsage(n.DynamicDrawUsage),await h.yield();const me=[],ve=[],ue=(e,a,t,s,o,r,l)=>{const c=new n.Vector3(e,a,t),i=new n.Vector3(s,o,r),f=c.distanceTo(i),v=new n.CylinderGeometry(l*.7,l,f,7,3);v.translate(0,f/2,0),v.applyQuaternion(new n.Quaternion().setFromUnitVectors(O,i.clone().sub(c).normalize())),v.translate(e,a,t),ve.push(v)};ue(0,.36,0,.004,.57,.003,.032);for(let e=0;e<3;e++){const a=e*u/3+.4,t=Math.cos(a)*.09,s=Math.sin(a)*.09;ue(.004,.57,.003,t,.68,s,.021);for(let o=0;o<2;o++){const r=a+(o?.7:-.7),l=t+Math.cos(r)*.07,c=s+Math.sin(r)*.07,i=.75+.03*o;ue(t,.68,s,l,i,c,.013),me.push([l,i,c]),ue(l,i,c,l+Math.cos(r+1)*.04,i+.045,c+Math.sin(r+1)*.04,.008),me.push([l+Math.cos(r+1)*.04,i+.045,c+Math.sin(r+1)*.04])}}ve.push(new n.CircleGeometry(.335,32).rotateX(-Math.PI/2).translate(0,.362,0));const Ft=Kt(ve.map(e=>e.index?e.toNonIndexed():e));ve.forEach(e=>e.dispose()),await h.yield();const Pt=V(Ft,Y,Math.max(1,X.length),"gold-trees"),kt=y(x[5]),Ce=Math.round(320*B),ne=new n.BufferGeometry;ne.setAttribute("position",new n.Float32BufferAttribute([-.5,0,0,0,0,.22,.5,.06,0,0,0,-.22],3)),ne.setAttribute("normal",new n.Float32BufferAttribute([0,1,0,0,1,0,0,1,0,0,1,0],3)),ne.setAttribute("uv",new n.Float32BufferAttribute([0,0,.5,.3,1,.5,.5,.7],2)),ne.setIndex([0,1,2,0,2,3]);const Ct=V(ne,Y,Math.max(1,X.length*Ce),"enamel-leaves"),Re=y(x[4]);Re.r*=.7,Re.b*=.62;const $e=new n.Euler;for(let e=0;e<X.length;e++){const a=X[e],t=a.own?pe:h.rng;g.compose(d.set(a.x,0,a.z),P.setFromAxisAngle(O,a.rot),k.setScalar(a.H)),G(Pt,e,g,kt,1,a.rot,0,0,1);for(let s=0;s<Ce;s++){s%100===99&&await h.yield();const o=me[(s+e)%me.length],r=.05*Math.cbrt(t()),l=t()*u,c=Math.acos(2*t()-1);d.set(o[0]+r*Math.sin(c)*Math.cos(l),o[1]+r*Math.cos(c)*.8,o[2]+r*Math.sin(c)*Math.sin(l)).multiplyScalar(a.H).applyAxisAngle(O,a.rot),d.x+=a.x,d.z+=a.z,g.compose(d,P.setFromEuler($e.set(t.range(-.6,.6),t()*u,t.range(-.6,.6))),k.setScalar(t.range(.7,1.1)*a.H/13.5)),G(Ct,e*Ce+s,g,Re,0,t()*u,.35,0,.05)}await h.yield()}const et=()=>new n.IcosahedronGeometry(.5,0).scale(1,.7,1);await h.yield();const tt=b.filter(e=>ae.nearestXZ(e.x,e.z).dist<170),at=e=>Math.max(12,Math.round(e.H*.34*u/4)),Rt=V(et(),Y,Math.max(1,tt.reduce((e,a)=>e+at(a),0)),"girdle-diamonds"),st=y(x[6]);let Ut=0;for(const e of tt){const a=at(e);for(let t=0;t<a;t++){const s=e.rot+t*u/a;d.set(e.x+Math.sin(s)*e.H*.345,e.H*.36,e.z+Math.cos(s)*e.H*.345),g.compose(d,P.setFromEuler($e.set(Math.PI/2,s,0,"YXZ")),k.setScalar(.9)),G(Rt,Ut++,g,st,2,(e.own?pe:p)(),0,0,1)}}await h.yield();const Ue=Math.round(1400*B*N(U.density??1,.8,1.2)),Et=new n.CircleGeometry(1,16,.22,u-.44).rotateX(-Math.PI/2),Vt=V(Et,Y,Ue,"lily-pads"),Bt=()=>new n.SphereGeometry(1,9,6),Gt=Math.ceil(Ue/2),Dt=V(new n.SphereGeometry(1,6,3),Y,Gt,"pad-pearls"),Nt=[y(x[4]),y("#E9E2D2"),y(x[4]).lerp(y(x[0]),.35)],It=y("#FFF6EC");for(let e=0;e<Ue;e++){let a=0,t=0,s=!1;for(let f=0;f<6&&!s;f++){const v=C(),T=C.chance(.72)?C.gauss()*20:C.range(-130,130);L(v,T,d),a=d.x+C.range(-6,6),t=d.z+C.range(-6,6),s=Math.hypot(a-m.x,t-m.z)>66&&b.every(z=>Math.hypot(z.x-a,z.z-t)>z.H*.26+3)}const o=s?C.range(.75,2):.001;g.compose(d.set(a,.07+e%7*.004,t),P.setFromAxisAngle(O,C()*u),k.set(o,1,o)),G(Vt,e,g,Nt[e%3],0,C()*u,.05,0,.12);const r=s?C.range(.24,.36):.001,l=C()*u,c=o*C.range(.1,.55);g.compose(d.set(a+Math.cos(l)*c,.07+r,t+Math.sin(l)*c),P.identity(),k.setScalar(r));const i=C();e%2===0&&G(Dt,e>>1,g,It,3,i*6.2832,0,e%4?.9:-1.2,1),e%20===19&&await h.yield()}await h.yield();const we=60,xe=Ne*we,ye=V(et(),Y,xe,"diamond-shoals");ye.instanceMatrix.setUsage(n.DynamicDrawUsage);const ot=[];for(let e=0;e<xe;e++)ot.push({a:p.range(-4.5,4.5),b:p.range(-2.5,2.5),ph:p(),sp:p.range(.6,1.3),ax:p()*u}),G(ye,e,g.identity(),st,2,p(),0,0,1);await h.yield();const nt=new n.PlaneGeometry(1,1).rotateX(-Math.PI/2),be=new n.InstancedBufferAttribute(new Float32Array(xe),1);be.setUsage(n.DynamicDrawUsage),nt.setAttribute("aAge",be);const qt=new n.ShaderMaterial({uniforms:{},transparent:!0,depthWrite:!1,blending:n.AdditiveBlending,fog:!1,vertexShader:`attribute float aAge; varying vec2 vUv; varying float vAge;
        void main(){ vUv = uv - 0.5; vAge = aAge; gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0); }`,fragmentShader:`varying vec2 vUv; varying float vAge;
        void main(){ float r = length(vUv) * 2.0; float a = clamp(vAge, 0.0, 1.0);
          float ring = (1.0 - smoothstep(0.0, 0.07, abs(r - (0.15 + 0.8 * a)))) * (1.0 - a) * (1.0 - a);
          float fall = max(0.0, 1.0 - a * 3.0); vec2 q = abs(vUv) * 2.0;
          float star = max(0.0, 1.0 - q.x * 1.6) * max(0.0, 1.0 - q.y * 22.0) + max(0.0, 1.0 - q.y * 1.6) * max(0.0, 1.0 - q.x * 22.0);
          vec3 c = vec3(0.85, 0.92, 1.0) * ring * 0.5 + vec3(1.0, 0.97, 0.9) * star * fall * fall * 2.2;
          gl_FragColor = vec4(c * step(r, 1.0), 1.0); }`}),K=new n.InstancedMesh(nt,qt,xe);K.frustumCulled=!1,K.name="sparks-and-rings",K.instanceMatrix.setUsage(n.DynamicDrawUsage),K.renderOrder=5,F.add(K);const Ee=6,Q=57,re=V(Bt(),Y,Ee*Q,"pearl-eels");re.instanceMatrix.setUsage(n.DynamicDrawUsage);const Ht=y(Ie?x[5]:"#FFF4E6"),rt=[];for(let e=0;e<Ee;e++){const a=[0,0,.08,.22,.56,.7][e];rt.push({c:L(a,(e%2?1:-1)*p.range(16,26),new n.Vector3).clone(),r:p.range(9,14),w:p.range(.35,.55)*(e%2?1:-1),ph:p()*u,y:p.range(4,9)});for(let t=0;t<Q;t++)G(re,e*Q+t,g.identity(),t===0?y("#FFF6EC"):Ht,Ie&&t>0?1:3,p(),0,0,1)}await h.yield();const S=new n.Vector3,M=new n.Vector3,H=new n.Vector3,ra=new n.Vector3(0,0,0),Wt=1-186/A.length,jt=[L(.38,26,new n.Vector3).clone(),L(.6,-30,new n.Vector3).clone()];let Ve=1;const Ot=(e,a,t)=>{if(Ve=1,e===0){const r=20+220*R(.22,.32,a),l=N(a+r/A.length,0,1),c=-60*(1-R(.05,.135,a))-7+4*Math.sin((a-.135)*45);return Pe(l,S),A.curve.getTangentAt(l,M),S.set(S.x-M.z*c,.3,S.z+M.x*c),M.y=0,M.normalize(),[l*A.length+t*1.5,1-R(.3,.33,a)]}if(e===1){const r=N(a+.032+.03*(1-R(.78,.86,a)),Wt,.999);Pe(r,S),A.curve.getTangentAt(r,M);const l=Math.hypot(S.x-m.x,S.z-m.z);return S.y=w.anchors.floorY(l)+.35,Ve=R(58,66,l),[r*A.length+t*1.5,R(.7,.76,a)*R(3,14,l)]}const s=jt[e-2],o=t*.4*(e===2?1:-1)+e;return S.set(s.x+Math.cos(o)*22,.3,s.z+Math.sin(o)*22),M.set(-Math.sin(o),0,Math.cos(o)).multiplyScalar(e===2?1:-1),[t*8.8,1]},it=(e,a)=>{for(let t=0;t<Ne;t++){const[s,o]=Ot(t,e,a);for(let r=0;r<we;r++){const l=ot[t*we+r],c=t*we+r,i=(s+l.a)/7+l.ph,f=i-Math.floor(i),v=2*Math.sin(Math.PI*f);H.set(S.x+M.x*l.a-M.z*l.b,S.y+M.y*l.a+.3+v,S.z+M.z*l.a+M.x*l.b),g.compose(H,P.setFromAxisAngle(ut.set(Math.cos(l.ax),.5,Math.sin(l.ax)).normalize(),a*l.sp+l.ax),k.setScalar(.72*o)),ye.setMatrixAt(c,g),H.set(H.x-M.x*f*7,S.y+M.y*(l.a-f*7)+.12,H.z-M.z*f*7),g.compose(H,P.identity(),k.setScalar(3.2*o*Ve)),K.setMatrixAt(c,g),be.array[c]=f}}ye.instanceMatrix.needsUpdate=!0,K.instanceMatrix.needsUpdate=!0,be.needsUpdate=!0;for(let t=0;t<Ee;t++){const s=rt[t];if(t<2){const o=N(e+.012-t*.004,0,1);Pe(o,S),A.curve.getTangentAt(o,M);const r=1-R(.255,.295,e),l=R(.29,.335,e),c=-(7.5+t*2.5)+l*72-r*(5+6*Math.sin(a*.35+t*2.1));for(let i=0;i<Q;i++){const f=Math.min(1,i/6),v=c+1.2*f*Math.sin(i*.3-a*3.2+s.ph),T=i*.25;H.set(S.x-M.x*T-M.z*v,S.y-2.2+t*1.6-r*(4.5+t*1.5)+.6*f*Math.sin(i*.22-a*2.1),S.z-M.z*T+M.x*v),g.compose(H,P.identity(),k.setScalar(i===0?.42:.2)),re.setMatrixAt(t*Q+i,g)}}else for(let o=0;o<Q;o++){const r=a*s.w+s.ph-Math.sign(s.w)*o*.25/s.r,l=Math.min(1,o/6),c=s.r+1.2*l*Math.sin(o*.3-a*3.2);H.set(s.c.x+Math.cos(r)*c,s.y+.8*Math.sin(o*.22-a*2.1+s.ph),s.c.z+Math.sin(r)*c),g.compose(H,P.identity(),k.setScalar(o===0?.42:.2)),re.setMatrixAt(t*Q+o,g)}}re.instanceMatrix.needsUpdate=!0},lt=(e,a)=>{let t=!1;for(const s of X){let o=R(s.u0-.07,s.u0+.015,e);o>.02&&(o+=.02*Math.sin(a*.8+s.k)),s.own&&(o=R(s.u0-.07,s.u0+.015,e)*s.maxOpen,o>.02&&(o+=.02*Math.sin(a*.8+s.ph))),Math.abs(o-s.cur)>1e-4&&(s.cur=o,Je(s,s.k,o),t=!0)}t&&($.instanceMatrix.needsUpdate=!0)};await h.yield(),lt(0,0),await h.yield(),it(0,0),await h.yield();const ie=Math.round(56*B),Me=ie+b.length,le=new Float32Array(Me).fill(1);{const e=[[-.25,.4],[0,.4],[.35,.4],[.7,.4],[.9,.36],[1.1,.3],[1.25,.2]],a=[],t=[];for(const[i,f]of e)a.push(-f,i,0,f,i,0);for(let i=0;i+1<e.length;i++)t.push(2*i,2*i+1,2*i+2,2*i+1,2*i+3,2*i+2);const s=new n.InstancedBufferGeometry;s.setAttribute("position",new n.Float32BufferAttribute(a,3)),s.setIndex(t);const o=new Float32Array(Me*4),r=new Float32Array(Me*3);for(let i=0;i<ie;i++){const f=i*2.39996+.7,v=1250+2e3*(i*.618034%1),T=38+52*(i*.381966%1),z=Z[i%6];o.set([-60+Math.cos(f)*v,420+Math.sin(f)*v,T,0],i*4),r.set([z.r,z.g,z.b],i*3)}for(let i=0;i<b.length;i++){const f=b[i],v=ie+i;o.set([f.x,f.z,f.H,0],v*4),r.set([f.tint.r,f.tint.g,f.tint.b],v*3)}s.setAttribute("aBase",new n.InstancedBufferAttribute(o,4)),s.setAttribute("aTintI",new n.InstancedBufferAttribute(r,3)),s.setAttribute("aW",new n.InstancedBufferAttribute(le,1).setUsage(n.DynamicDrawUsage)),s.instanceCount=Me;const l=w.object.getObjectByName("sea-apron").material.uniforms,c=new n.Mesh(s,new n.ShaderMaterial({uniforms:{...I,uRefC:l.uRefC,uRefR:l.uRefR,uRefOn:l.uRefOn},vertexShader:ea,fragmentShader:ta,side:n.DoubleSide,blending:n.NoBlending,depthTest:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-8,fog:!1}));c.frustumCulled=!1,c.renderOrder=-7.9,c.name="egg-images",F.add(c),le.attr=s.attributes.aW}await h.yield();const ze=new Float32Array(b.length),ee=I.uLE.value,_t=I.uLT.value,Be=new n.Vector3,Ge=new Int16Array(10),Xt=e=>{e.getWorldPosition(Be);for(let t=0;t<b.length;t++){const s=b[t],o=Math.hypot(s.x-Be.x,s.z-Be.z);ze[t]=s.H/Math.max(20,o),le[ie+t]=1}let a=0;for(let t=0;t<=10;t++){let s=-1,o=0;for(let l=0;l<b.length;l++)ze[l]>o&&(o=ze[l],s=l);if(t===10){a=o;break}if(Ge[t]=s,s<0){ee[t].set(0,0,1,0);continue}const r=b[s];ee[t].set(r.x,r.z,r.H,o),_t[t].set(r.tint.r,r.tint.g,r.tint.b),ze[s]=0}for(let t=0;t<10;t++)ee[t].w=ee[t].w>0?R(a,a*1.5+1e-4,ee[t].w):0,Ge[t]>=0&&ee[t].w>.999&&(le[ie+Ge[t]]=0);le.attr.needsUpdate=!0},Lt=.5*(w.anchors.goreTip.z+w.anchors.hinges.rose.z),Yt=w.object.localToWorld(w.anchors.portalSeat.position.clone()),ce=new n.Vector3;let he=0,ct=0;{const e=Te[Te.length-5];let a=1e9;for(let t=0;t<=A.length;t+=1){A.posAtDist(t,ce);const s=ce.distanceTo(e);s<a&&(a=s,he=t)}a=1e9;for(let t=he;t<=A.length;t+=1){A.posAtDist(t,ce);const s=Math.abs(Math.hypot(ce.x-m.x,ce.z-m.z)-Lt);s<a&&(a=s,ct=t)}}const W=R;return{scene:F,path:A,duration:46,pace:e=>.95+.25*W(.1,.16,e)+.25*W(.3,.38,e)-.5*W(.48,.54,e)+.2*W(.64,.7,e)-.5*W(.76,.81,e)+.35*W(.87,.91,e),camera:{fov:52,near:.3,far:6e3,lookAhead:24,sway:.5,bank:.37},pois:[{at:[m.x,82,m.z],from:.02,to:.3,weight:.8},{at:[m.x,84,m.z],from:.12,to:.4,weight:.62,fade:.3},{at:(e,a)=>wt.set(m.x,86-10*W(.3,.44,a)+40*W(.54,.62,a)-16*W(.62,.72,a)-14*W(.72,.8,a),m.z),from:.24,to:.9,weight:.86,fade:.16},{at:Yt,from:he/A.length,to:2,fade:(ct-he)/(2*A.length-he),weight:.42}],portal:{shape:"circle",radius:w.anchors.portalSeat.radius,color:"#FFF4D6",glow:.6,tilt:!0,revealDistance:320},post:{exposure:1,bloom:{strength:.3,radius:.35,threshold:1.4},grade:{saturation:1.08,contrast:1.05,vignette:.15,grain:0}},ride:"none",style:"none",update(e,a,t,s){w.setProgress(s),w.update(e,a,t),I.uTravel.value=s*900+.6*a,lt(s,a),it(s,a),Xt(t)},dispose(){w.dispose&&w.dispose()}}}};export{ha as default};
