import*as t from"three";const k=300,q=12,ae=60,$=(u,i,n)=>{const r=Math.min(1,Math.max(0,(n-u)/(i-u)));return r*r*(3-2*r)},G={mote:[0,"#ffe9b0",.55,.06,.4,0,0,2.6,1,.8],snow:[1,"#f2f8ff",.3,-.42,.45,.5,.5,.9,.4,1.2],ember:[2,"#ff5a10",.22,.6,.5,0,0,3.4,1.3,.78],petal:[3,"#ffb3cc",.4,-.3,.65,.9,.85,.45,.16,1.35],bubble:[4,"#cfefff",.45,.5,.3,0,0,.7,.22,1.5],leaf:[5,"#d99a2e",.35,-.34,.65,.8,.85,.35,.1,1.45],spark:[6,"#ffffff",.6,0,.22,.2,0,3.6,1.2,.85],fluff:[7,"#ffeccf",.6,.12,.6,.25,0,.45,.3,1.6]},J={"shaken-globe":"snow","the-calving":"snow","monarch-sanctuary":"petal","ink-dragon":"mote","neon-monsoon":"spark","chandelier-city":"spark",glowwood:"spark","lemon-cliffs":"petal"},h=u=>new RegExp("(^|-)("+u+")(-|$)"),oe=[[h("snow|snowbound|ice|frost|glacier|fjord|winter|aurora|hail"),"snow"],[h("lantern|lanterns|forge|fire|lava|volcano|ember|embers|candle|furnace|engine"),"ember"],[h("garden|blossom|cherry|petal|petals|flower|flowers|meadow|orchard|paper"),"petal"],[h("kelp|reef|sea|ocean|sunken|tempest|tide|tideline|lagoon|deep|shore|rain|sounding"),"bubble"],[h("wood|woods|redwood|forest|grove|jungle|savanna|falls|valley|autumn|green"),"leaf"],[h("orbit|star|stars|neon|glass|nebula|crystal|storm|inside|night|moon"),"spark"],[h("cloud|clouds|sky|wind|turtle|doors|archipelago|murmuration"),"fluff"],[h("library|canyon|table|stair|stairway|dune|desert|dust|attic|erg|gilded|shadow"),"mote"]],le={alien:"spark",bizarre:"fluff",city:"spark",domestic:"mote",interior:"mote",ocean:"bubble",sky:"fluff",wilderness:"leaf"};function se(u,i){const n=String(u||"");if(J[n])return G[J[n]];for(const[r,c]of oe)if(r.test(n))return G[c];return G[le[i]||"mote"]}const ie=`
attribute vec4 aSeed;   // a: when it lets go, b: how far ahead, c: how far off the centre line, e: free
attribute vec4 aB;      // angle round the line of flight, phase, glitter, size
uniform float uTime, uT, uSlip, uTurn, uMode, uRemain, uD2, uVis, uGrav, uWander, uSpin, uTumble, uSize, uPx, uLife;
uniform vec3 uP0, uP1, uP2, uRight, uUp, uFwd, uBase, uTint, uCam, uCamF;
uniform float uTintK;
varying vec2 vUv; varying vec3 vCol; varying vec4 vS; varying float vA, vFlat, vDet, vHot, vFun;
float sst(float a, float b, float x){ float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }   // smoothstep that may run downhill
void main(){
  float a = aSeed.x, b = aSeed.y, c = aSeed.z, e = aSeed.w, ph = aB.y;
  float Dmax = 7.0 + 11.0 * b;
  float lead, latK, twist, alpha, air, melt = 0.0, loose = 0.0;
  vHot = 0.0;
  if (uMode < 0.5) {
    // ---- the drift: out of the portal, round the viewer, then left behind one by one ----
    float T = 2.4 + (uLife - 2.0) * a;                      // when the eye overtakes this one
    float x = clamp(uT / T, 0.0, 1.0);
    float tl = max(uT - 1.3 * a, 0.0);                      // they come through in a stream, not all at once
    float rise = 1.0 - pow(1.0 - min(tl / (1.1 + 1.1 * e), 1.0), 3.0);
    float fall = pow(max(0.0, (uSlip - 0.7) / (T - 0.7)), 1.7);   // uSlip: the clock run at the speed of the flight
    lead = Dmax * (0.22 + 0.78 * rise) - (Dmax + 4.0) * fall;
    latK = 0.30 + 0.70 * rise;
    twist = (1.0 - rise) * (1.0 - rise) * 2.4;
    alpha = sst(0.0, 0.25 + 0.4 * e, uT - 1.3 * a) * mix(0.55, 1.0, rise) * (1.0 - 0.35 * x * x) * (1.0 - sst(0.93, 1.0, x));
    air = max(0.0, tl - 0.6) * (0.4 + 0.6 * x);
    melt = x; loose = x;
    vHot = (1.0 - rise) * 0.8;
  } else {
    // ---- the gathering: condense out of the air, run ahead, wind into the portal ----
    float start = 60.0 - 36.0 * a;
    float k = clamp((start - uRemain) / start, 0.0, 1.0);
    lead = mix(5.0 + 8.0 * b, 11.5 + 8.5 * b, k);
    latK = mix(1.2, 0.55, k);
    twist = -k * k * 2.6;
    alpha = sst(0.0, 0.14, k);
    air = -(1.0 - k) * (1.0 - k) * 2.5;                      // each settles into place against its own drift
    melt = 1.0 - sst(0.0, 0.3, k);
    loose = 1.0 - k;
    vHot = k * k;
  }
  // the last metres before the portal: a wreath that winds in round the rim, one after another (never a ball in its middle)
  float fun = sst(0.0, 24.0, uRemain - lead);
  lead += (a - 0.5) * 6.0 * (1.0 - fun) * uMode;
  twist -= (1.0 - fun) * 3.0 * uMode;
  float toPortal = uRemain - lead;
  alpha *= sst(0.0, 4.0, toPortal);
  vHot = max(vHot, (1.0 - fun) * uMode);
  vFun = mix(1.0, fun, uMode);
  lead = min(lead, uRemain);
  // position on the path (a parabola through the eye, D2/2 ahead and D2 ahead)
  float t = lead / uD2;
  vec3 p = uP0 * ((t - 0.5) * (t - 1.0) * 2.0) + uP1 * (-4.0 * t * (t - 1.0)) + uP2 * (t * (t - 0.5) * 2.0);
  // ...drawn most of the way onto the (lagging) line of sight, so the clear middle of the ring is the middle of
  // the PICTURE when the gaze rests on a set piece, yet the cloud trails a turn of the head instead of being glued
  // to it; near the portal the path wins and leads them in
  p = mix(p, uCam + uCamF * lead, 0.78 * fun);
  // in a bend they swing to the outside and lag it, the loose ones most
  p -= uRight * uTurn * max(lead, 0.0) * 0.35 * (0.3 + 0.7 * loose);
  // a ring round the line of flight, never on it: no nearer than about 20 degrees to the line of sight
  float th = aB.x + twist;
  float R = (0.27 + 0.48 * c) * Dmax * latK;
  R = max(R, (0.36 + 0.14 * e) * max(lead, 1.5) * (1.0 - uMode));
  R = mix(R, mix(2.7 + 2.5 * c, R, fun), uMode);
  p += (uRight * cos(th) + uUp * (sin(th) * 0.74 + 0.10)) * R;
  // the new world's air takes them: sink or rise, and wander
  p.y += uGrav * air * (0.6 + 0.8 * e);
  float w1 = uTime * (0.55 + 0.5 * ph) + ph * 40.0, w2 = uTime * (0.43 + 0.4 * e) + e * 31.0;
  p += (uRight * sin(w1) + vec3(0.0, 0.6, 0.0) * sin(w2) + uFwd * 0.5 * cos(w1 * 0.7 + 1.3)) * uWander * (0.35 + 0.65 * fun);
  p += uRight * sin(w2 * 2.3) * uTumble * 0.18;                // flutter of the flat ones

  float glit = step(0.84, aB.z);                              // a few are always plain motes of light
  vS = vec4(e, ph, glit, c);
  vec3 col = mix(uBase, uTint, uTintK + (ph - 0.5) * 0.3);
  vCol = mix(col * (0.8 + 0.4 * e), uTint, glit);
  float spin = aB.x * 3.0 + uTime * uSpin * (0.5 + e) * (ph > 0.5 ? 1.0 : -1.0) + sin(w1) * 0.5;
  vFlat = mix(1.0, max(0.36, abs(cos(uTime * (0.9 + a) * 1.5 + ph * 30.0))), uTumble * (1.0 - glit));
  float cs = cos(spin), sn = sin(spin);
  vUv = vec2(position.x * cs - position.y * sn, position.x * sn + position.y * cs);

  float size = (0.050 + 0.062 * aB.w) * mix(uSize, 0.75, glit) * (1.0 - 0.45 * melt) * 2.5;
  vec4 clip = projectionMatrix * (viewMatrix * vec4(p, 1.0));
  float sy = size * projectionMatrix[1][1];
  float pxl = uPx * clip.w;                                     // one pixel, in clip units
  sy = clamp(sy, 4.2 * pxl, 0.075 * clip.w);
  float sx = sy * projectionMatrix[0][0] / projectionMatrix[1][1];
  vDet = sst(7.0, 16.0, sy / pxl);                       // enough pixels to draw the real shape
  vA = alpha * uVis * sst(1.0, 3.0, clip.w);
  clip.xy += position.xy * vec2(sx, sy);
  if (vA < 0.004) clip = vec4(0.0, 0.0, -2.0, 1.0);
  gl_Position = clip;
}`,ne=`
uniform float uKind, uEmis, uGlow, uDay, uTime;
uniform vec3 uLight, uExtraFill, uTint;
varying vec2 vUv; varying vec3 vCol; varying vec4 vS; varying float vA, vFlat, vDet, vHot, vFun;
float sst(float a, float b, float x){ float t = clamp((x - a) / (b - a), 0.0, 1.0); return t * t * (3.0 - 2.0 * t); }   // smoothstep that may run downhill
const float PI = 3.14159265;
void main(){
  vec2 q = vUv * 2.5; q.x /= vFlat;                 // the body lives inside |q| < 1, the halo outside
  float r = length(q), r0 = length(vUv) * 2.5, ang = atan(q.y, q.x);
  float edge = 1.0 - sst(1.9, 2.5, r0);
  float halo = exp(-r0 * r0 * 1.1) * edge;
  float soft = sst(0.85, 0.25, r) * 0.85;    // what every kind looks like from far away
  float kind = mix(uKind, 0.0, vS.z);
  float body = soft, shade = 1.0, spec = 0.0, glow = uGlow, emis = uEmis;
  vec3 alb = vCol;
  if (kind < 0.5) {                                 // mote of light
    body = sst(0.62, 0.22, r);
    float tw = 0.7 + 0.3 * sin(uTime * (2.0 + 3.0 * vS.x) + vS.y * 40.0);
    emis = max(uEmis, 2.2) * tw; glow = max(uGlow, 0.8) * tw;
  } else if (kind < 1.5) {                          // snowflake: six arms, two barbs on each
    float af = mod(ang + PI / 6.0, PI / 3.0) - PI / 6.0;
    vec2 f = r * vec2(cos(af), sin(af));
    float arm = sst(0.12, 0.05, abs(f.y)) * sst(1.0, 0.92, f.x);
    float b1 = sst(0.09, 0.03, abs(abs(f.y) - (f.x - 0.40) * 0.85)) * sst(0.38, 0.42, f.x) * sst(0.66, 0.60, f.x);
    float b2 = sst(0.08, 0.03, abs(abs(f.y) - (f.x - 0.68) * 0.85)) * sst(0.66, 0.70, f.x) * sst(0.90, 0.84, f.x);
    float hex = sst(0.30, 0.22, f.x);
    body = mix(soft, max(max(arm, hex), max(b1, b2)), vDet);
    shade = 1.0 - 0.25 * sst(0.2, 0.0, f.x) * vDet;
    spec = 0.35 * arm * pow(0.5 + 0.5 * sin(uTime * 2.3 + vS.y * 50.0), 6.0);
  } else if (kind < 2.5) {                          // ember: a hot grain that breathes
    float fl = 0.65 + 0.35 * sin(uTime * (5.0 + 6.0 * vS.x) + vS.y * 60.0) * sin(uTime * 1.7 + vS.x * 20.0);
    body = sst(0.55, 0.18, r);
    alb = mix(vCol, vec3(1.0, 0.86, 0.5), sst(0.4, 0.0, r) * 0.8);
    emis = uEmis * fl; glow = uGlow * fl;
  } else if (kind < 3.5) {                          // petal: wider at the lip, a notch in it, a darker claw
    float w = 0.66 * sqrt(max(0.0, 1.0 - q.y * q.y)) * (0.72 + 0.30 * q.y);
    float notch = sst(0.26, 0.18, length(q - vec2(0.0, 1.02)));
    float sh = sst(0.07, -0.05, abs(q.x) - w) * (1.0 - notch);
    body = mix(soft, sh, vDet);
    shade = mix(0.62, 1.12, sst(-1.0, 0.6, q.y)) * (1.0 - 0.14 * sst(0.07, 0.0, abs(q.x)) * vDet) * (0.55 + 0.45 * vFlat);
    alb = mix(alb, vec3(1.0, 0.96, 0.94), sst(0.0, 1.0, q.y) * 0.45);
  } else if (kind < 4.5) {                          // bubble: a thin bright skin, a window light, a low reflection
    float ring = sst(0.17, 0.0, abs(r - 0.82));
    float fill = sst(1.0, 0.86, r) * 0.10;
    float hl = sst(0.24, 0.05, length(q - vec2(-0.36, 0.40)));
    float arc = sst(0.10, 0.0, abs(r - 0.60)) * sst(0.35, 0.95, dot(q / max(r, 0.001), vec2(0.6, -0.8)));
    body = mix(soft * 0.6, clamp(ring * 0.72 + fill + hl + arc * 0.5, 0.0, 1.0), vDet);
    alb = mix(vCol, vCol.gbr, 0.30 + 0.30 * sin(ang * 2.0 + vS.y * 20.0 + uTime * 0.7));
    spec = (hl * 1.6 + arc * 0.35 + ring * 0.25) * vDet + 0.25 * soft * (1.0 - vDet);
    shade = 1.15;
  } else if (kind < 5.5) {                          // leaf: a pointed lens with a midrib and a stalk
    float w = 0.52 * (1.0 - q.y * q.y) * (1.0 - 0.25 * q.y);
    float sh = sst(0.06, -0.04, abs(q.x) - w) * step(abs(q.y), 1.0);
    float stalk = sst(0.06, 0.02, abs(q.x)) * sst(-1.45, -1.35, q.y) * sst(-0.9, -1.0, q.y);
    body = mix(soft, max(sh, stalk), vDet);
    float veins = sst(0.05, 0.0, abs(q.x)) + 0.5 * sst(0.07, 0.0, abs(fract((q.y - abs(q.x) * 0.9) * 2.6) - 0.5) - 0.38);
    shade = (1.0 - 0.22 * clamp(veins, 0.0, 1.0) * vDet) * (0.55 + 0.45 * vFlat) * mix(0.8, 1.1, sst(-1.0, 1.0, q.x + q.y));
    alb = mix(vCol, vCol * vec3(1.25, 0.62, 0.30), vS.x * 0.8);
    alb = mix(alb, vCol * vec3(0.50, 0.95, 0.30), step(0.62, vS.y) * 0.75);   // a third are still green       // every leaf its own stage of autumn
  } else if (kind < 6.5) {                          // star glint: a hard core and a four-point flare
    float tw = 0.55 + 0.45 * sin(uTime * (2.4 + 3.6 * vS.x) + vS.y * 50.0);
    vec2 aq = abs(vUv * 2.5);
    float flare = (exp(-aq.x * 7.0 - aq.y * 0.9) + exp(-aq.y * 7.0 - aq.x * 0.9)) * edge;
    body = sst(0.45, 0.12, r);
    emis = uEmis * (0.6 + 0.6 * tw); glow = uGlow * (0.5 + flare * 2.2 * tw);
    spec = flare * tw * 0.9;
  } else {                                          // seed fluff: a parasol of filaments over a hanging seed
    vec2 g = q - vec2(0.0, 0.25);
    float gr = length(g), ga = atan(g.y, g.x);
    float sp = pow(abs(cos(ga * 5.5 + vS.y * 6.0)), 18.0);
    float fil = sp * sst(0.95, 0.80, gr) * sst(0.06, 0.2, gr) * (0.55 + 0.45 * sst(0.5, 0.9, gr));
    float tips = sst(0.14, 0.02, abs(gr - 0.84)) * pow(abs(cos(ga * 5.5 + vS.y * 6.0)), 5.0);
    float stalk = sst(0.045, 0.015, abs(q.x)) * step(q.y, 0.25) * sst(-1.25, -1.15, q.y);
    float seedd = sst(0.16, 0.08, length((q - vec2(0.0, -1.25)) * vec2(1.0, 0.55)));
    float sh = max(max(fil * 0.55, tips * 0.7), max(stalk * 0.7, seedd));
    body = mix(soft * 0.75, max(sh, sst(0.14, 0.05, gr)), vDet) * 0.8;
    alb = mix(vCol, vCol * vec3(0.55, 0.42, 0.30), seedd * vDet);
    glow = uGlow * (0.6 + 0.4 * (1.0 - vDet));
  }
  body = clamp(body, 0.0, 1.0);
  // lit by the world it is in now, glowing a little of its own; warmer and brighter near a portal
  float hot = 1.0 + min(vHot, 1.0) * 0.8;
  vec3 lit = alb * shade * (uLight + uExtraFill + emis * hot * mix(1.0, 0.55, uDay));
  // by day a thin edge in the old world's colour, deepened, holds a pale thing against a pale sky
  float rimBand = body * (1.0 - sst(0.35, 0.9, body));
  lit = mix(lit, mix(lit * vec3(0.42, 0.40, 0.50), uTint * 0.45 * (uLight + uExtraFill), 0.6), rimBand * uDay * 0.9);
  // ...and by night a ring of it: the halo is the old world's colour outright; halos thin where they crowd at the portal
  vec3 add = uTint * halo * glow * hot * (1.0 - 0.6 * (1.0 - vFun)) * mix(0.62, 0.22, uDay) + vec3(spec) * (uLight * 0.6 + 0.5);
  float al = body * mix(0.92, 1.0, uDay);
  gl_FragColor = vec4((lit * al + add) * vA, al * vA);   // premultiplied: halo adds, body covers
}`,Q=null;var re={id:"the-drift",name:"The Drift",async build(u){const{rng:i}=u,n=new t.InstancedBufferGeometry;n.setAttribute("position",new t.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),n.setIndex([0,1,2,0,2,3]);const r=new Float32Array(k*4),c=new Float32Array(k*4);for(let o=0;o<k;o++){r[o*4]=Math.pow((o+i())/k,.85),r[o*4+1]=i(),r[o*4+2]=Math.pow(i(),.8),r[o*4+3]=i();let p=i()*Math.PI*2;p-=.22*Math.sin(2*p),c[o*4]=p,c[o*4+1]=i(),c[o*4+2]=i(),c[o*4+3]=Math.pow(i(),1.6)}n.setAttribute("aSeed",new t.InstancedBufferAttribute(r,4)),n.setAttribute("aB",new t.InstancedBufferAttribute(c,4)),n.instanceCount=k;const f=()=>({value:new t.Vector3}),l=(o=0)=>({value:o}),e={uTime:l(),uT:l(),uSlip:l(),uTurn:l(),uMode:l(),uRemain:l(1e3),uD2:l(20),uVis:l(1),uLife:l(q),uGrav:l(),uWander:l(),uSpin:l(),uTumble:l(),uSize:l(1),uPx:l(2/1080),uKind:l(),uEmis:l(1),uGlow:l(1),uDay:l(.5),uTintK:l(.5),uP0:f(),uP1:f(),uP2:f(),uRight:f(),uUp:f(),uFwd:f(),uCam:f(),uCamF:f(),uBase:{value:new t.Color},uTint:{value:new t.Color},uLight:{value:new t.Color(.7,.7,.7)},uExtraFill:u.fill},X=new t.ShaderMaterial({uniforms:e,vertexShader:ie,fragmentShader:ne,transparent:!0,depthWrite:!1,depthTest:!0,side:t.DoubleSide,toneMapped:!1,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneFactor,blendDst:t.OneMinusSrcAlphaFactor,blendSrcAlpha:t.OneFactor,blendDstAlpha:t.OneMinusSrcAlphaFactor}),d=new t.Mesh(n,X);d.frustumCulled=!1,d.renderOrder=6,d.visible=!1;const M=new t.Group;M.name="the-drift",M.add(d);const D=new t.Vector3,I=new t.Vector3,C=new t.Vector3,m=new t.Vector3,w=new t.Vector3,K=new t.Vector3,Z=new t.Vector3(0,1,0),L=new t.Vector2,x={h:0,s:0,l:0},F=new t.Color,v=new t.Color,P=new t.Vector3,R=new t.Vector3;let H=null,U=null,W=.32,A=0,S=0,E=-1,T=!1;const j=(o,p,a)=>{if(o===H&&a===U)return;H=o,U=a;const s=se(o,p);e.uKind.value=s[0],e.uBase.value.set(s[1]),e.uTintK.value=s[2],e.uGrav.value=s[3],e.uWander.value=s[4],e.uSpin.value=s[5],e.uTumble.value=s[6],e.uEmis.value=s[7],e.uGlow.value=s[8],e.uSize.value=s[9],W=s[7]<1?.24:.32,F.set(a||"#9fd0ff").getHSL(x),F.setHSL(x.h,x.s>.04?Math.min(1,x.s*1.5+.3):x.s,Math.min(.66,Math.max(.42,x.l*.8))),e.uTint.value.copy(F)};return{object:M,update(o,p,a){const s=a.prev||Q;if(!s||!a.path||!a.camera){d.visible=!1,T=!1;return}const g=Q&&!a.prev?a.u*100:a.entered,B=a.remaining,y=g<q+.8,ee=!y&&B<ae;if(!y&&!ee){d.visible=!1,T=!1;return}const O=y?1:a.presence*$(q+.8,q+3,g);if(O<.004){d.visible=!1;return}d.visible=!0,y?j(s.id,s.category,s.color):j(a.world&&a.world.id,a.world&&a.world.category,a.portalColor),e.uMode.value=y?0:1,e.uT.value=Math.max(0,g),e.uRemain.value=Math.max(0,B),e.uVis.value=O,e.uTime.value=p;const z=Math.min(20,Math.max(1,B));e.uD2.value=z,a.ahead(0,D),a.ahead(z*.5,I),a.ahead(z,C),m.subVectors(C,D),m.lengthSq()<.04&&a.camera.getWorldDirection(m),m.normalize(),w.crossVectors(m,Z),w.lengthSq()<1e-4&&w.set(1,0,0),w.normalize(),K.crossVectors(w,m).normalize(),e.uP0.value.copy(D),e.uP1.value.copy(I),e.uP2.value.copy(C),e.uFwd.value.copy(m),e.uRight.value.copy(w),e.uUp.value.copy(K);const V=!T||g<E-1e-4||g>E+.25;E=g,T=!0;const Y=Math.min(1.3,Math.max(.75,Math.sqrt((a.speed||14)/14)));A=V?g*Y:A+o*Y;const _=Math.min(.6,Math.max(-.6,a.turn||0));S=V?_:S+(_-S)*(1-Math.exp(-o*3)),a.camera.getWorldPosition(e.uCam.value),a.camera.getWorldDirection(R),V?P.copy(R):P.lerp(R,1-Math.exp(-o*1.8)).normalize(),e.uCamF.value.copy(P),e.uSlip.value=A,e.uTurn.value=S;const b=a.light;if(b&&b.has){v.copy(b.key).multiplyScalar(b.keyIntensity*.45).add(b.ambient);const N=v.r*.2126+v.g*.7152+v.b*.0722,te=Math.min(1.15,Math.max(W,N));v.multiplyScalar(te/Math.max(N,.001)),e.uDay.value=$(.3,1.2,b.level)}else v.setScalar(.6),e.uDay.value=.5;e.uLight.value.copy(v),u.renderer.getDrawingBufferSize(L),e.uPx.value=2/Math.max(240,L.y)}}}};export{re as default};
