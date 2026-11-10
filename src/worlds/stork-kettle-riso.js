import*as l from"three";import{makePath as go,makeRng as Fe,clamp as G,lerp as J,smoothstep as y}from"../kit/core.js";import{buildHero as vo,INK_GLSL as Wt}from"../parts/stork-kettle-riso.js";const P=Math.PI*2,Je=Math.PI/180,Va=new l.Vector3,pt=new l.Vector3(0,1,0),W=-120,At=[500,1150],et=1700,tt=[-150,330],De=[640,500],at=[-340,170],A=[0,0,0],L=[1,1,0],ue=[1,0,1],Vo=[0,.62,1],Nt=[0,0,1],Ba=[0,.8,0],bo=[.9,0,0];class ee{constructor(){this.P=[],this.N=[],this.K=[],this.X=[],this.I=[],this.n=0,this.explicit=!0}v(g,S,H,te,O,j,F,D){return this.P.push(g,S,H),this.K.push(te[0],te[1],te[2]),O===void 0?(this.explicit=!1,this.N.push(0,1,0)):this.N.push(O,j,F),D?this.X.push(D[0],D[1],D[2],D[3]):this.X.push(0,0,0,0),this.n++}tri(g,S,H){this.I.push(g,S,H)}quad(g,S,H,te){this.I.push(g,S,H,g,H,te)}build(g){const S=new l.BufferGeometry;return S.setAttribute("position",new l.Float32BufferAttribute(this.P,3)),S.setAttribute("ink",new l.Float32BufferAttribute(this.K,3)),g&&S.setAttribute(g,new l.Float32BufferAttribute(this.X,4)),S.setIndex(this.I),this.explicit?S.setAttribute("normal",new l.Float32BufferAttribute(this.N,3)):S.computeVertexNormals(),S}}function R(x,g,S,H,te,O,j,F,D=0,ne=[1,1],ie){const Z=Math.cos(D),_=Math.sin(D),ge=te/2,re=j/2,V=(de,X,z)=>{const q=X>0?ne:[1,1],ae=de*ge*q[0],le=z*re*q[1];return[g+ae*Z+le*_,S+(X>0?O:0),H-ae*_+le*Z]},pe=[[[-1,0,1],[1,0,1],[1,1,1],[-1,1,1]],[[1,0,-1],[-1,0,-1],[-1,1,-1],[1,1,-1]],[[1,0,1],[1,0,-1],[1,1,-1],[1,1,1]],[[-1,0,-1],[-1,0,1],[-1,1,1],[-1,1,-1]],[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]]];for(const de of pe){const X=de.map(z=>{const q=V(z[0],z[1],z[2]);return x.v(q[0],q[1],q[2],F,void 0,0,0,ie)});x.quad(X[0],X[1],X[2],X[3])}}function ce(x,g,S,H,te=!0,O){const j=[];for(let F=0;F<g.length;F++){const D=g[Math.max(F-1,0)],ne=g[Math.min(F+1,g.length-1)],ie=new l.Vector3(ne[0]-D[0],ne[1]-D[1],ne[2]-D[2]).normalize(),Z=new l.Vector3(0,1,0);Math.abs(ie.y)>.9&&Z.set(1,0,0);const _=new l.Vector3().crossVectors(ie,Z).normalize(),ge=new l.Vector3().crossVectors(ie,_),re=[],V=typeof H=="function"?H(F):H;for(let pe=0;pe<S;pe++){const de=pe/S*P,X=Math.cos(de)*g[F][3],z=Math.sin(de)*g[F][3];re.push(x.v(g[F][0]+_.x*X+ge.x*z,g[F][1]+_.y*X+ge.y*z,g[F][2]+_.z*X+ge.z*z,V,void 0,0,0,O))}j.push(re)}for(let F=0;F<j.length-1;F++)for(let D=0;D<S;D++){const ne=(D+1)%S;x.quad(j[F][D],j[F+1][D],j[F+1][ne],j[F][ne])}if(te){const F=g[g.length-1],D=typeof H=="function"?H(g.length-1):H,ne=x.v(F[0],F[1],F[2],D,void 0,0,0,O),ie=j[j.length-1];for(let Z=0;Z<S;Z++)x.tri(ne,ie[Z],ie[(Z+1)%S])}}const Ha={};function Ae(x,g,S,H,te,O,j,F,D,ne,ie,Z){const _=Ha[j]||(Ha[j]=(()=>{const V=new l.IcosahedronGeometry(1,j),pe=V.attributes.position.array.slice();return V.dispose(),pe})()),ge=new Map,re=[];for(let V=0;V<_.length;V+=3){const pe=Math.round(_[V]*4096)+","+Math.round(_[V+1]*4096)+","+Math.round(_[V+2]*4096);let de=ge.get(pe);if(de===void 0){const X=_[V],z=_[V+1],q=_[V+2],ae=1+ne*g.fbm3(S*.01+X*1.3,H*.01+z*1.3,te*.01+q*1.3,3);let le=z*ae*F,ot=z/Math.max(F,.2);D&&le<-D&&(le=-D+(le+D)*.12,ot=-3);const Y=Math.hypot(X,ot,q)||1;de=x.v(S+X*ae*O,H+le*O,te+q*ae*O,ie,X/Y,ot/Y,q/Y,Z),ge.set(pe,de)}re.push(de)}for(let V=0;V<re.length;V+=3)x.tri(re[V],re[V+1],re[V+2])}const xo=x=>y(260,1100,Math.abs(x))*(120*Math.sin(x*.0041+.6)+75*Math.sin(x*.0098+2)+34*Math.sin(x*.019+4.1)),Tt=x=>16+10*Math.sin(x*.021+1)+6*Math.sin(x*.057+2.3)-x*x/(520+1.1*Math.abs(x))+xo(x),ko=`
float coastZ(float x){ return 16. + 10. * sin(x * .021 + 1.) + 6. * sin(x * .057 + 2.3) - (x * x) / (520. + 1.1 * abs(x))
  + smoothstep(260., 1100., abs(x)) * (120. * sin(x * .0041 + .6) + 75. * sin(x * .0098 + 2.) + 34. * sin(x * .019 + 4.1)); }
`,Da=(x,g,S)=>{const H=G((S-x)/(g-x),0,1);return H*H*(3-2*H)},We=x=>48-28*Da(100,700,x)-.05*Math.max(x-700,0)+(38*Math.sin(x*.0085)+20*Math.sin(x*.023+1))*Da(10,140,x),Ia=[We(700),-700],Pa=[We(1850),-1850],yo=`
float roadX(float q){ return 48. - 28. * smoothstep(100., 700., q) - .05 * max(q - 700., 0.) + (38. * sin(q * .0085) + 20. * sin(q * .023 + 1.)) * smoothstep(10., 140., q); }
`,Ra=`
uniform vec4 uCloud;   // x, z of the tower's base centre, its radius, wind drift speed
float cloudShadow(vec2 w, float below){
  vec2 c = uCloud.xy - uSunDir.xz / max(uSunDir.y, .2) * below;
  vec2 q = (w - c) / max(uCloud.z, 1.); q.x *= .82;
  float lobes = inkNoise(w * .004) * .35;
  float hero = 1. - smoothstep(.8, 1.05, length(q) + lobes);
  vec2 d = w * .00042 + vec2(uTime * uCloud.w, 0.);
  float drift = smoothstep(.6, .68, inkNoise(d) * .7 + inkNoise(d * 2.7 + 9.) * .3);
  return max(hero, drift);
}
`,Mo=`
attribute vec3 ink; attribute vec4 aW; attribute vec4 iA; attribute vec4 iB;
uniform float uTime, uAlt, uH, uBufH, uMinPx, uBubble; uniform vec2 uLean;
uniform vec3 uCentre, uFwd, uRight, uFlap; uniform float uShow, uBank, uPitch;   // uFlap: wings held this much higher, beat scale, floor of a thin part's width (buffer px)
varying vec3 vInk, vN; varying float vDepth, vPx; varying vec2 vUV; varying vec4 vW;
void main(){
  vec3 p = position, n = normal; float seed = iB.x, grow = 1., bank;
  vec3 c, fwd, right, up = vec3(0., 1., 0.);
#ifdef FORM
  c = uCentre + uRight * iA.x + vec3(0., iA.y + .25 * sin(uTime * 1.3 + seed * 20.), 0.) + uFwd * iA.z;
  { vec3 f1 = uFwd - vec3(0., uPitch, 0.); fwd = f1 / max(length(f1), 1e-4); } right = uRight; bank = uBank + .08 * sin(uTime * .7 + seed * 9.); grow = uShow;   // (uPitch: nose down, the formation stays level)
#else
  float phi = iA.y - uTime * iA.w;
  float r = iA.x * (1. + .1 * sin(uTime * .19 + seed * 20.));
  #ifdef GULL
  c = uCentre + vec3(r * sin(phi), iA.z + 2. * sin(uTime * .5 + seed * 12.), -r * cos(phi));
  #else
  #ifdef NEARLANE
  float yAlt = iA.z + uAlt + .5 * sin(uTime * .31 + seed * 12.);
  #else
  float yAlt = mod(iA.z + uAlt, max(uH, 1.));
  #endif
  c = vec3(r * sin(phi), yAlt, -r * cos(phi)); c.xz += uLean * (yAlt - uAlt);
  grow = smoothstep(0., 8., yAlt) * (1. - smoothstep(uH - 6., uH, yAlt));
  #endif
  fwd = vec3(-cos(phi), 0., -sin(phi)); right = vec3(-sin(phi), 0., cos(phi));
  bank = -(.34 + .1 * sin(uTime * .8 + seed * 30.));
#endif
  vec4 wc = modelMatrix * vec4(c, 1.);
  vec3 toC = wc.xyz - cameraPosition; float dist = max(length(toC), 1e-3);
  wc.xyz += toC / dist * max(uBubble - dist, 0.); dist = max(dist, uBubble);
  float px = projectionMatrix[1][1] * uBufH * .5 / dist * 1.6 * iB.y; vPx = px;
#ifdef FLAM
  // A flamingo of the skein keeps its station but is its own bird: its heading is a few degrees off its neighbours' (so no
  // two lines of neck and legs lie in one line) and it rocks in its own bank about the skein's (uBank), on its own period.
  // Nothing here reads the lens: the skein flies its course level and is seen however the lens happens to stand to it.
  float yj = (fract(seed * 7.13) - .5) * .3;
  vec3 f0 = normalize(vec3(uFwd.x, 0., uFwd.z) + vec3(0., 0., 1e-5)), r0 = uRight;
  fwd = f0 * cos(yj) + r0 * sin(yj); right = r0 * cos(yj) - f0 * sin(yj);
  bank = uBank + (fract(seed * 5.31) - .5) * .24 + .07 * sin(uTime * (.5 + .4 * fract(seed * 3.3)) + seed * 9.);
  fwd = fwd * cos(uPitch) - vec3(0., sin(uPitch), 0.); up = cross(fwd, right);
#endif
  // wings: slow deep beats in bursts, otherwise set in a shallow V with the tips riding up
  float d = abs(aW.x), sg = sign(aW.x);
  float cyc = fract(uTime / (5. + 4. * seed) + seed * 7.);
  float env = max(iB.z, smoothstep(0., .06, cyc) * (1. - smoothstep(.3, .36, cyc)));
  float fph = uTime * (7. + 3. * fract(seed * 3.7)) + seed * 50.;
  if (d > 0.) {
    float a = mix(.13, .04, env) + uFlap.x + env * .6 * uFlap.y * sin(fph), aTip = env * .45 * uFlap.y * sin(fph - 1.) + (1. - env) * .12;
    float dOut = max(d - .4, 0.);
    p.y += d * sin(a) + dOut * (sin(a + aTip) - sin(a));
    p.x = sg * (d * cos(a) + dOut * (cos(a + aTip) - cos(a)) + .04);
  }
  // a thin part (aW.z: a flamingo's neck, bill and legs) is never drawn narrower than uFlap.z pixels: fattened about the body's axis
  // (three times at most for a far bird, half as much again at most once the bird is 50 design px across: a near bird's line
  // stays a third as wide as its wing)
  p.xy *= 1. + aW.z * (clamp(uFlap.z / max(px / 1.6 * .085, 1e-4), 1., mix(3., 1.5, smoothstep(30., 50., px * 450. / max(uBufH, 1.)))) - 1.);
  p.x *= 1. + aW.y * .35 * sin(uTime * .6 + seed * 14.);            // the tail fans and twists as it steers
  p.y += aW.y * .05 * sin(uTime * 1.1 + seed * 5.);
  float cb = cos(bank), sb = sin(bank);
#ifdef FLAM
  // a flamingo is held at uMinPx on the page, but never drawn more than 1.45 times its size: stations stand 4.5 m apart, so
  // every bird stays whole with water round it (and one held at that size keeps its three inks)
  float hold = clamp(uMinPx / max(px, 1e-4), 1., 1.45); vPx = px * hold;
#else
  float hold = max(1., uMinPx / max(px, 1e-4));
#endif
  float sc = iB.y * grow * hold;
  vec3 q = vec3(p.x * cb - p.y * sb, p.x * sb + p.y * cb, p.z) * sc;
  vec3 nn = vec3(n.x * cb - n.y * sb, n.x * sb + n.y * cb, n.z);
  mat3 M3 = mat3(modelMatrix);
  vec3 w = wc.xyz + M3 * (right * q.x + up * q.y + fwd * q.z);
  vN = M3 * (right * nn.x + up * nn.y + fwd * nn.z);
  vInk = ink; vUV = vec2(d, position.z); vW = aW;
  vec4 mv = viewMatrix * vec4(w, 1.); vDepth = -mv.z; gl_Position = projectionMatrix * mv;
}`,So=`precision highp float;
${Wt}
varying vec3 vInk, vN; varying float vDepth, vPx; varying vec2 vUV; varying vec4 vW;
void main(){
  vec3 n0 = vN / max(length(vN), 1e-5), n = gl_FrontFacing ? n0 : -n0;
  float lit = dot(n, uSunDir), part = vW.w, span = clamp(abs(vW.x) / .95, 0., 1.);
  float fc = fwidth(part) * 1.2 + 1e-4, fsRaw = span * 26. + part * 2., lw = max(fwidth(fsRaw), 1e-4);
  vec3 ink; float keep = 0.;                                           // keep: bare paper that takes no shade
  if (part < 1.5) {
    float c = clamp(part, 0., 1.);
    float hand = smoothstep(.5, .6, span + (c - .5) * .14);            // the black hand: its inner edge slants back across the wing
    float lead = mix(.2, .3, hand);
    float cut = mix(.72 + .04 * sin(span * 80.), lead + .05, hand);    // where the pink coverts end and the plum flight feathers begin
    float gap = (1. - smoothstep(lw * .7, lw * 1.5, abs(fract(fsRaw) - .5))) * (1. - smoothstep(.16, .45, lw)) * smoothstep(cut + .05, cut + .16, c);
    float plum = smoothstep(cut - fc, cut + fc, c) * (1. - gap * .9);
    float hl = 1. - smoothstep(lead - fc, lead + fc, c);
    float tone = mix(.6, .97, smoothstep(lead, cut, c));
    ink = vec3(tone * (1. - hl), .26 * (1. - smoothstep(.04, .24, span)) * (1. - hl), 0.);
    if (!gl_FrontFacing) ink = vec3(.92, .2 + .2 * (1. - smoothstep(.04, .34, span)), 0.);          // the underwing: deep pink under a light dot
    ink = mix(ink, vec3(1., 1., 0.), plum); keep = hl * (1. - plum) * (gl_FrontFacing ? 1. : 0.);
  } else if (part < 2.5) {
    float back = smoothstep(.72, .92, n0.y), belly = (1. - smoothstep(-.5, -.1, n0.y));
    ink = mix(vec3(.84, .3 * (1. - smoothstep(.1, .5, n0.y)), 0.), vec3(0.), back); ink = mix(ink, vec3(1., 1., 0.), belly); keep = back;
  } else if (part < 3.5) ink = vec3(.9, .34 * (1. - smoothstep(-.4, .1, n0.y)), 0.);
  else if (part < 4.5) { ink = vInk; keep = 1. - step(.05, max(ink.r, ink.g)); }
  else ink = vec3(1., 0., .3);
  // light is ink: a side turned from the sun takes blue dots over its pink
  ink.g += (1. - ink.g) * (1. - smoothstep(-.35, .3, lit)) * .5 * (1. - keep);
  // too small to print in three inks: a pink tick with plum hands
  float small = 1. - smoothstep(13., 21., vPx);
  ink = mix(ink, part < 1.5 && span > .56 ? vec3(1., 1., 0.) : vec3(1., 0., 0.), small);
  ink = inkHaze(ink, vDepth * .5);
  gl_FragColor = inkOut(ink, vDepth);
}`,zo=`precision highp float;
${Wt}
uniform float uBars, uSolid;
varying vec3 vInk, vN; varying float vDepth, vPx; varying vec2 vUV;
void main(){
  vec3 n = vN / max(length(vN), 1e-5); if (!gl_FrontFacing) n = -n;
  float lit = dot(n, uSunDir);
  vec3 ink = vInk;
  // barred underwings (honey buzzards): knocked-out bars across the wing, only where they are wide enough to print
  float fb = vUV.x * 9., fw = fwidth(fb);
  float bar = smoothstep(.25, .35, abs(fract(fb) - .5)) * (1. - smoothstep(.2, .5, fw)) * step(.08, vUV.x) * abs(uBars) * (1. - step(0., n.y));
  ink = uBars < 0. ? mix(ink, vec3(1., 1., 0.), bar * .92) : ink * (1. - bar * .85);     // uBars -1: plum bars printed on a pale wing
  ink = mix(inkShade(ink, lit, .8), ink, uSolid);
  float small = 1. - smoothstep(10., 16., vPx);                       // too small to print in three inks: a solid tick
  ink = mix(ink, mix(vec3(1., 1., 0.), ink, uSolid), small * step(.05, max(ink.r, max(ink.g, ink.b))));
  ink = mix(inkHaze(ink, vDepth), ink, uSolid * .7);
  gl_FragColor = inkOut(ink, vDepth);
}`,Ao=`
attribute vec3 ink; attribute vec4 iA; attribute vec4 iB;
uniform float uTime, uBufH, uBox, uMinPx; uniform vec3 uWind;
varying vec3 vInk; varying float vDepth; varying vec2 vUV;
void main(){
  float seed = iB.x; vec3 p = position;
  vec3 vel = uWind;
#ifdef SWIFT
  float hd = iB.z + .5 * sin(uTime * .23 + seed * 30.);
  vec3 fwd = vec3(sin(hd), .12 * sin(uTime * .4 + seed * 11.), cos(hd));
  vel = vec3(sin(iB.z), 0., cos(iB.z)) * iA.w;
#endif
  vec3 home = iA.xyz + vel * uTime;
#ifndef SWIFT
  home.xz += vec2(sin(uTime * .31 + seed * 40.), cos(uTime * .27 + seed * 23.)) * 1.3;
#endif
  vec3 q = mod(home - cameraPosition, uBox) - .5 * uBox;
  vec3 wc = cameraPosition + q;
  float dist = max(length(q), .001);
  float px = projectionMatrix[1][1] * uBufH * .5 / dist * iB.y;
  float sc = iB.y * max(1., uMinPx / max(px, 1e-4)) * (1. - smoothstep(.4 * uBox, .5 * uBox, dist)) * smoothstep(.5, 1.4, dist);
  vInk = ink; vUV = position.xy;
#ifdef SWIFT
  vec3 right = normalize(cross(vec3(0., 1., 0.), fwd)), up = cross(fwd, right);
  float bank = .7 * sin(uTime * .9 + seed * 17.), flick = .5 * sin(uTime * (26. + 8. * seed) + seed * 9.) * step(.4, fract(uTime * .7 + seed * 3.));
  p.y += abs(p.x) * (flick + .1);
  vec3 b = vec3(p.x * cos(bank) - p.y * sin(bank), p.x * sin(bank) + p.y * cos(bank), p.z) * sc;
  vec4 mv = viewMatrix * vec4(wc + right * b.x + up * b.y + fwd * b.z, 1.);
#else
  vec4 mv = viewMatrix * vec4(wc, 1.); mv.xy += position.xy * sc;
#endif
  vDepth = -mv.z; gl_Position = projectionMatrix * mv;
}`,No=`precision highp float;
${Wt}
varying vec3 vInk; varying float vDepth; varying vec2 vUV;
void main(){
  vec3 ink = vInk;
#ifndef SWIFT
  float r = length(vUV) * 2.;                                         // thistledown: a round paper tuft with a plum seed
  float ray = .78 + .22 * cos(atan(vUV.y, abs(vUV.x) + 1e-4) * 9.);
  if (r > ray) discard;
  ink = vec3(1., 1., 0.) * (1. - smoothstep(.16, .26, r));
#endif
  gl_FragColor = inkOut(ink, vDepth);
}`;var Bo={id:"stork-kettle-riso",name:"Kettle over the Strait",category:"sky",weirdness:.3,media:["air","open"],async build(x){const g=x.rng,S=x.noise,H=x.vary||{},te=x.quality?.detail??1,O=new l.Scene,j=g.pick(["noon","noon","noon","noon","golden","haze"]),F=H.hour==="golden"?"golden":H.hour==="dawn"||H.hour==="night"?"haze":H.hour==="day"?"noon":j,D=g.chance(.4)?"east":"calm",ne=g.chance(.4)?"spring":"parched",ie=g.pick(["white","black","raptor","packed","thin"]),Z=G(H.density??1,.7,1.3),_={hour:F,wind:D,season:ne,cast:ie,rare:!!H.rare},ge=F==="golden",re=F==="haze",V=D==="east",pe=Fe("stork-kettle-company:"+(x.seed??0)),de=pe.int(0,2),X=pe.chance(.5)?-1:1;_.stair=de,_.mirror=X;const z=await vo(x,{exposure:3,hour:F,wind:D,backdrop:!1,rise:2.3,base:[-60,0,360],stairLayout:de,cast:ie==="raptor"?"white":ie,ticks:Math.round(6400*G(Z,.75,1.1))});await x.yield();const q=z.press,ae=z.height,le=z.anchors,ot=le.portalSeat,Y=e=>z.styleMaterial(e),E=go(le.flyThrough),qt=51,Lt=e=>1-.45*y(.64,.7,e)*(1-y(.85,.91,e)),Ft=e=>{let t=0;for(let a=0;a<65;a++)t+=1/Lt(a/64);t/=65;let c=0;const o=.02;for(let a=0;a<e&&c<E.length;a+=o)c+=E.length/qt*Lt(c/E.length)*t*o;return c},Oa=e=>{const t=le.flyThrough[e];let c=0,o=1e9;for(let a=0;a<=2e3;a++){const n=a/2e3*E.length,d=E.posAtDist(n,Va),p=d.distanceToSquared(t);p<o&&(o=p,c=n)}return c},Ct=le.flyThrough[le.flyThrough.length-1].distanceTo(le.flyThrough[le.flyThrough.length-4]),qe=new l.Group;qe.name="kettle-root",O.add(qe),qe.add(z.object);const me=new l.Group,Ce=new l.Group,st=new l.Group,Ee=new l.Group;qe.add(me,Ce,st,Ee);const Ka=q.shared.uSunDir.value,_t=new l.DirectionalLight(ge?"#ffe9c4":"#ffffff",2.2);_t.position.copy(Ka).multiplyScalar(100);const Ga=new l.HemisphereLight("#dfe6f6","#8f9cc4",1.5);O.add(_t,Ga);const Xt={value:1};{const e=new l.BufferGeometry;e.setAttribute("position",new l.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const t=new l.Mesh(e,new l.ShaderMaterial({uniforms:{uProj:q.uniforms.uProj,uPx:q.uniforms.uPx,uVeil:Xt,uBlue:{value:new l.Color("#3255A4")},uPaper:{value:new l.Color(z.mood.paper||"#F6F0E2")}},vertexShader:"uniform vec2 uProj; void main(){ gl_Position = vec4(position.xy, (uProj.y - uProj.x * 12.9) / 12.9, 1.); }",fragmentShader:`precision highp float; uniform float uPx, uVeil; uniform vec3 uBlue, uPaper;
          void main(){
            vec2 q = mat2(.258819, .965926, -.965926, .258819) * (gl_FragCoord.xy / max(uPx, .25)) * (6.28318 / 6.);
            float T = .5 - .25 * (cos(q.x) + cos(q.y)), b = smoothstep(-.12, .12, .24 - T);
            gl_FragColor = vec4(mix(vec3(1.), uPaper * mix(vec3(1.), uBlue * 1.6, b), uVeil), 1.);
          }`,depthFunc:l.GreaterDepth,depthTest:!0,depthWrite:!1,transparent:!0,blending:l.MultiplyBlending,premultipliedAlpha:!0,fog:!1,toneMapped:!1}));t.frustumCulled=!1,t.renderOrder=900,O.add(t)}const Ut={value:new l.Vector4(-60,0,560,V?.012:.004)},Wa=e=>E.pointAt(e,Va).y,nt=9,Et={value:Array.from({length:nt},()=>new l.Vector4(0,9e5,1,0))},jt={value:Array.from({length:nt},()=>new l.Vector4(100,600,16,1))},$t={value:0},Zt={value:0},qa={value:new l.Vector4(V?.26:.06,V?.6:1,ge?1:0,re?1:0)},Ca=Y({uniforms:{uShip:Et,uShipB:jt,uSea:qa,uCloud:Ut,uLook:Zt,uFarW:$t,uBufH:z.uniforms.uBufH},fragmentPre:ko+Ra+`
        uniform vec4 uShip[${nt}]; uniform vec4 uShipB[${nt}]; uniform vec4 uSea; uniform float uLook, uBufH, uFarW;
        float wkDark;                                                     // set by wakes(): the dark water beside a far wake
        float wakes(vec2 w, float px, vec2 fw){
          float k = 0.; wkDark = 0.;
          for (int i = 0; i < ${nt}; i++) {
            vec2 rel = w - uShip[i].xy, dir = uShip[i].zw;
            float along = dot(rel, dir), across = abs(dot(rel, vec2(-dir.y, dir.x)));
            float L = uShipB[i].x, s = L * .5 - along;                     // metres behind the bow
            float life = 1. - smoothstep(.55, 1., s / max(uShipB[i].y, 1.));
            float fade = step(0., s) * life;
            // metres to the pixel ACROSS this wake (fw = fwidth of w.x and w.y, taken outside the loop): far off, and seen low
            // over the water, a wake is held 3 to 10 design px wide on the page (more than a dot pitch: a stroke of paper, not a hairline) (uFarW: from the top of the climb only), so it stays a long paper stroke as far as the far shore
            float apx = abs(dir.y) * fw.x + abs(dir.x) * fw.y, farK = smoothstep(9., 22., apx) * uFarW;
            float wv = 1.6 + s * .009 + min(px, 9.) * 1.1;                          // the arms of the bow V widen and soften astern
            float arm = 1. - smoothstep(wv * .6, wv, abs(across - (uShipB[i].z * .35 + s * .2)));
            float churn = inkNoise(vec2(along * .06 + float(i) * 7., across * .3)) * .5 + .5;
            float st = L * .92 - along - L * .5;                            // metres behind the stern
            float dpx = apx * uBufH / 450.;                                 // metres to the design pixel across the wake
            // a broad wake (uShipB.w = 2: a fast ferry's, by the kind of ship) is a brush stroke of paper: it swells for 250 m
            // behind the stern and then tapers to a point, its edge wanders and breaks into flecks (never a ruled bar), and it
            // has no hairline arms of a bow V beside it. EVERY wake narrows to its tail: a stroke that ends in a point,
            // never a band of one width.
            float broad = smoothstep(1.4, 2., uShipB[i].w), noArm = smoothstep(1., 1.2, uShipB[i].w), sl = s / max(uShipB[i].y, 1.);
            float swell = smoothstep(0., 250., st) * (1. - smoothstep(.12, .95, sl));
            float wsB = (uShipB[i].z * .34 + (8. + min(px, 9.) * .9) * swell) * (.72 + .56 * inkNoise(vec2(along * .012 + float(i) * 5., 7.)));
            float ws = max(mix((uShipB[i].z * .3 + max(st, 0.) * .006 + min(px, 9.) * 1.2) * (1. - .85 * smoothstep(.15, .9, sl)), wsB, broad), dpx * mix(5., 1.6, smoothstep(.1, .9, sl)) * farK);
            ws = max(ws, dpx * mix(2.2, .9, smoothstep(.08, .95, sl)) * broad);   // (held four and a half design px wide behind the ferry, 2 at its tail, however low the lens)
            // EVERY WAKE IS A BROKEN LINE OF FOAM (every ship, every range): its edge wanders and breaks, and astern of the
            // churn at the stern the trail is cut into dashes with blue water between them (about two fifths of its length
            // is water; the dashes lie in the WATER, the ship draws away from them), so a paper bird that crosses a wake has
            // dots round its body and never joins a ruled paper stroke ...
            float brk = smoothstep(.25, .55, inkNoise(vec2(along * .011 + float(i) * 3., across * .04)) * .8 + (1. - across / max(ws, 1e-3)) * .9);
            float wAl = dot(w, dir), gone = smoothstep(60., 240., st);
            // (long and short dashes, no two alike. A dash is never shorter than 8 design px ALONG the wake: where the
            // wake is seen far off or end on, the dashes are drawn an octave longer at a time, cross-faded, so it stays a
            // broken line as far as the far shore and never closes up into a ruled stroke)
            float lodW = log2(max((abs(dir.x) * fw.x + abs(dir.y) * fw.y) * uBufH / 450. * 8. / 37., 1.)), sc0 = exp2(-floor(lodW)), fi = float(i);
            float dash0 = smoothstep(.4, .47, inkNoise(vec2(wAl * .027 * sc0 + fi * 11., 3.)) * .62 + inkNoise(vec2(wAl * .083 * sc0 + fi * 4., 6.)) * .38);
            float dash1 = smoothstep(.4, .47, inkNoise(vec2(wAl * .0135 * sc0 + fi * 11., 3.)) * .62 + inkNoise(vec2(wAl * .0415 * sc0 + fi * 4., 6.)) * .38);
            float dash = mix(1., mix(dash0, dash1, smoothstep(.25, .75, fract(lodW))), gone);
            float dashA = mix(1., smoothstep(.4, .48, inkNoise(vec2(wAl * .04 + float(i) * 5., 9.))), smoothstep(L * .55, L * 1.1, s));
            // ... with darker water for a dot pitch and a half either side of it at every range, so the dashes are PAPER on the
            // pale, hazy strait and not a dark hairline
            wkDark = max(wkDark, (1. - smoothstep(ws + dpx * 1.5, ws + dpx * 5.5, across)) * smoothstep(-8., 40., st) * fade * (.35 + .65 * inkNoise(vec2(wAl * .019 + float(i) * 3., across * .05))));   // (a soft, wandering margin: never a ruled band)
            float trail = (1. - smoothstep(ws * mix(.55, .8, broad), ws, across)) * smoothstep(-8., 4., st) * mix(churn, .82 + .18 * churn, max(farK, broad)) * brk * dash * min(uShipB[i].w, 1.);
            float skirt = (1. - smoothstep(uShipB[i].z * .5 + 1.5 + min(px, 4.), uShipB[i].z * .5 + 5. + min(px, 4.) * 2., across)) * step(abs(along), L * .56);   // foam at the waterline
            k = max(k, max(arm * dashA * .9 * (1. - smoothstep(150., 950., s)) * (1. - farK) * (1. - noArm), trail) * fade);
            k = max(k, skirt * .9);
          }
          return k;
        }`,fragmentMain:`
        vec2 w = vWorld.xz; float px = max(fwidth(w.x) + fwidth(w.y), 1e-4);           // metres to the pixel, more or less
        float sw = dot(w, vec2(.2873, .9578)) / 52. + inkNoise(w * .0022) * 1.3 - uTime * .11;
        float swf = fwidth(sw);
        float sw2 = dot(w, vec2(-.6, .8)) / 17. + inkNoise(w * .011 + 5.) * 1.7 - uTime * .19;
        float sw2f = fwidth(sw2);
        float band = (.5 + .5 * sin(sw * 6.28318)) * (1. - smoothstep(.2, .7, swf));
        float tone = mix(.7, .88, mix(.5, band, uSea.y * .8 + .2));
        tone -= .07 * (.5 + .5 * sin(sw2 * 6.28318)) * (1. - smoothstep(.15, .6, sw2f));
        tone += (inkNoise(w * .0009 + 3.) - .5) * .12;                      // slicks and cat's-paws, kilometres across
        // paper swell lines: thin, broken, crawling with the swell
        // paper swell dashes: short (40 to 90 m), bent by the slicks, and only where a metre of sea is wider than a pixel or so;
        // from altitude the sea is calm blue and the wakes are the only long white strokes
        float swl = sw + inkNoise(w * .0065 + 9.) * .55, swlf = max(fwidth(swl), 1e-5);
        float ln = 1. - smoothstep(.028 + swlf * .6, .028 + swlf * 1.6, abs(fract(swl) - .5));
        ln *= smoothstep(.57, .65, inkNoise(vec2(dot(w, vec2(.9578, -.2873)) * .011, floor(swl) * 3.7))) * (1. - smoothstep(.12, .45, swlf)) * (1. - smoothstep(1., 3.2, px));
        // whitecaps: cells that break for a moment and drift downwind
        vec2 wc = (w + vec2(uTime * 2.2, 0.)) / vec2(11., 6.);
        vec2 ci = floor(wc), cf = fract(wc) - .5;
        float ch = inkHash(ci), lifeC = fract(uTime * (.12 + .1 * ch) + ch * 9.);
        float cap = step(1. - uSea.x, inkHash(ci + 31.7)) * smoothstep(0., .15, lifeC) * (1. - smoothstep(.5, .9, lifeC));
        cap *= 1. - smoothstep(.12, .3 + .12 * ch, length(cf * vec2(1., 1.9) + (vec2(inkHash(ci + 3.), inkHash(ci + 8.)) - .5) * .4));
        cap *= (1. - smoothstep(1., 2.4, px));
        float capFar = smoothstep(1.2, 4., px) * uSea.x * .3 * smoothstep(.55, .75, inkNoise(w * .02 + vec2(uTime * .05, 0.)));   // far off they merge into streaks
        // three tide rips off the point
        float rip = 0.;
        for (int i = 0; i < 3; i++) {
          float fi = float(i);
          float rz = 260. + fi * 520. + 90. * sin(w.x * .0021 + fi * 2.1) + 40. * sin(w.x * .0063 + fi + uTime * .03);
          float wr = 3. + 2. * fi + min(px, 6.) * .7;
          rip = max(rip, (1. - smoothstep(wr * .4, wr, abs(w.y - rz + 5. * inkNoise(vec2(w.x * .09, fi * 3.))))) * smoothstep(.4, .6, inkNoise(vec2(w.x * .035 - uTime * .3, fi * 9.))) * (1. - smoothstep(1500., 3800., abs(w.x + 300. - fi * 400.))));
        }
        // glitter: paper flecks where the sea throws the sun back, each lasting half a second
        vec3 vdir = normalize(vWorld - cameraPosition);
        float spec = max(dot(reflect(vdir, vec3(0., 1., 0.)), uSunDir), 0.);
        // (a narrow path of short dashes lying along the swell crests, never more than a tenth of the water covered)
        float gs = max(3., px * 6.5); vec2 gq = vec2(dot(w, vec2(.9578, -.2873)) / 2.5, dot(w, vec2(.2873, .9578))) / gs, gc = floor(gq);
        float gl = step(1. - smoothstep(.988, .9995, spec) * .09, inkHash(gc + floor(uTime * 2. + inkHash(gc) * 2.) * 17.3)) * (1. - smoothstep(.2, .42, length((fract(gq) - .5) * vec2(1., 1.6))));
        // the coast: yellow under blue in the shallows, foam breathing at the foot of the cliff
        // (dm: metres south of the mainland's coastline, which is the cliff's TOP edge; gdm: metres of dm to the design
        // pixel; mapS: the land's own mapK, by the same measure, so the sea's shore changes hands where the land's print does)
        float dc = w.y - coastZ(w.x), dm = dc, gdm = max(length(vec2(dFdx(dm), dFdy(dm))) * uBufH / 450., 1e-4), mapS = smoothstep(3., 6.5, px * uBufH / 450.);
        // the lighthouse island off the tip (LIGHT): a ragged skerry, not a disc; the bare skerry to the south-east (ISLE)
        // and the rock awash west of the point (ISLET), each in its own ring of surf over a shoal
        float isl = length((w - vec2(${tt[0].toFixed(1)}, ${tt[1].toFixed(1)})) * vec2(1.3, .8)) - 42. + 16. * (inkNoise(w * .04 + 2.) - .5);
        float isl2 = length((w - vec2(${De[0].toFixed(1)}, ${De[1].toFixed(1)})) * vec2(1.25, .85)) - 46. + 22. * (inkNoise(w * .03 + 2.) - .5);
        dc = min(dc, min(isl, isl2));
        float reef = length((w - vec2(${at[0].toFixed(1)}, ${at[1].toFixed(1)})) * vec2(1.2, .85)) - 13. + 7. * (inkNoise(w * .07 + 5.) - .5);
        float shallow = max((1. - smoothstep(8., 110., dc + 30. * inkNoise(w * .02))) * step(-40., dc), 1. - smoothstep(2., 16., reef));
        dc = min(dc, reef);
        // THE FOOT OF THE CLIFF IS IN SURF (mend12). The face leans out: it meets the water 34 m south of the coastline
        // (measured on the mesh, seeds 7, 3, 34: 30 to 38 m for nine tenths of the coast), so the foam laid from the
        // coastline lay wholly under the face and the cliff stood in flat water. The mainland's breathing foam is laid
        // from the foot (dcf); the islands' is as it was (dci). Where the land is printed as a map (mapS) the
        // mainland's foam, thinner than a dot there, gives way to the ruled shore line below.
        float dci = min(min(isl, isl2), reef), dcf = min(dm - 34., dci);
        float foam = (1. - smoothstep(3., 9. + 5. * sin(uTime * .7 + w.x * .05) + 6. * inkNoise(w * .12 + uTime * .2), dcf)) * (1. - mapS * step(dm - 34., dci));
        float foam2 = (1. - smoothstep(1., 2.5 + px, abs(dc - 18. - 6. * fract(uTime * .09 + inkNoise(w * .01)) * 3.))) * step(.45, inkNoise(w * vec2(.09, .09)));
        float white = max(ln * .9, max(max(cap, capFar), max(rip * (1. - uLook), gl)));
        // seen from the top of the kettle the foam at the cliff's foot is thinner than a dot: there a broken paper line of surf
        // two pixels wide follows the coast, so the land ends in a shore and not in a cut
        // (since mend12 that broken line is the islands' alone, dci; the mainland has the ruled shore below)
        float surfFar = (1. - smoothstep(px * 1.2, px * 2.6, abs(dci - px * 1.5))) * smoothstep(2.5, 6., px) * (1. - smoothstep(40., 90., px)) * step(.3, inkNoise(w * .011 + 31.));
        // THE CASED COAST (mend12; since 12e this line of the sea's is the whole of it): where the land is a map the
        // mainland's shore is ONE RULED PAPER LINE at the cliff's foot, unbroken, from under the face out to 5.5 m of
        // water and a design pixel and a quarter beyond the foot's mean (39.5 m = 34 + 5.5: on the page 1.3 to 3 design
        // pixels of paper at every range, never thinner than the 1.2 the order sets), so the water ends in a shore
        // whatever the ground's tone.
        // THE LINE GOES WITH THE HAZE (mend12, second pass): a ruled paper line is a mark on the map, and where the land
        // beside it has gone to the haze's blue no cream stands on it. hzS is the share of a yellow the haze has taken
        // at this range (the press's own law, inkHaze); the page prints a full yellow whole while .58 of it is left
        // and not at all under .42 (its on/off): between the two the olive beside the shore turns from olive to the
        // haze's blue, and the shore goes out with it. Noon and golden hour: whole to 1.9 km, gone from 2.8 km; haze
        // hour: 0.86 and 1.27 km. Nearer, every value is what it was. BY THE RANGE (12e): the distance is the metres
        // from the eye to the water, as the land beside it takes its haze (THE LAND SHADES AND HAZES ITSELF, in the
        // land's shader), and not vDepth, the metres along the lens's axis: line and land go out together at every bearing.
        float hzS = clamp(length(vWorld - cameraPosition) / max(uHaze.x, 1.), 0., 1.); hzS = 1. - (1. - hzS) * (1. - hzS);
        float shore = (1. - smoothstep(39.5 + 1.05 * gdm, 39.5 + 1.45 * gdm, dm)) * step(0., dm) * mapS * (1. - smoothstep(.42, .58, hzS));
        white = max(white, max(max(max(foam, shore), foam2 * .8), max(surfFar * .85, wakes(w, px, vec2(fwidth(w.x), fwidth(w.y))))));
        float shadow = cloudShadow(w, uCloud.w * 0. + ${(ae-W).toFixed(1)}) * mix(1., smoothstep(420., 1000., length(w - vec2(0., 420.))), uLook);
        tone = mix(tone, tone * .8 + .04, shallow);
        ink = vec3(shadow * .5, tone, shallow * .95);
        // the sea hazes itself (haze: false below): in the hazy morning edition it keeps a 22 percent dot out to nine kilometres
        // (so the last approach is not bare paper), and the water beside a far wake is darkened after the haze
        // (the sea hazes half as fast as everything that stands on it: the strait is blue most of the way across and pales
        // to the band of paper haze under the far coast, so the page always has a ground under its horizon, ships and
        // wakes lie on water and not on bare paper, and under the dark cloud of the last approach it does not read
        // upside down)
        ink = inkHaze(ink, vDepth * mix(.5, .42, uFarW));
        ink.g = max(ink.g, uSea.w * .22 * (1. - smoothstep(8500., 11500., vDepth)));
        ink.g = min(ink.g + wkDark * mix(.22, .3, uFarW), 1.);
        ink *= 1. - clamp(white, 0., 1.);
        lit = 1.; shadeK = 0.;`,haze:!1}),mt=new l.PlaneGeometry(44e3,44e3,4,4);mt.rotateX(-Math.PI/2),mt.setAttribute("ink",new l.Float32BufferAttribute(new Float32Array(mt.attributes.position.count*3),3));const Vt=new l.Mesh(mt,Ca);Vt.position.y=W,Vt.frustumCulled=!1,Ce.add(Vt),await x.yield();const _e=ne==="spring",$={x:48,z:2,y:3},Bt=(e,t,c)=>{const o=y(300,2300,c),a=1-Math.abs(S.fbm2(e*42e-5+5,t*42e-5,4)),n=e-$.x,d=t-$.z;return S.fbm2(e*.02,t*.02,3)*1.3*y(0,30,c)+30*y(90,900,c)*(.5+.5*S.fbm2(e*.0021,t*.0021,3))+520*o*a*(.5+.5*y(-.4,.5,S.n2(e*2e-4,t*2e-4+9)))+3.4*Math.exp(-(n*n+d*d)/60)},it=(e,t)=>Bt(e,t,Math.max(Tt(e)-t,0));{const t=[-36,-27,-20,-15,-11,-7,-3.5,0,4,9,16,26,40,60,90,130,190,270,380,520,700,950,1300,1800,2500,3500,5e3,7e3,9500],c=[-128,-119,-97,-72,-47,-24,-7,0],o=t.length,a=new Float32Array(321*o*3),n=new Float32Array(321*o*3),d=[];for(let r=0;r<=320;r++){const w=r/160-1,i=600*w+8400*w*w*w,v=Tt(i);for(let u=0;u<o;u++){const b=t[u],f=(r*o+u)*3;let s=v-b,M,N=0;if(u<8){const T=u/7,B=Math.sin(Math.PI*Math.min(T*1.15,1));s+=B*(9*(1-Math.abs(S.n2(i*.03,u*.22)))+3*S.n2(i*.11,u*.9))+(u===1?5*S.n2(i*.05,3)+4:0),M=c[u]+(u>1&&u<7?5*S.n2(i*.04,u*1.7):0),N=u===7?.55:1}else M=Bt(i,s,b);a[f]=i,a[f+1]=M,a[f+2]=s;const k=G(.42+.5*S.fbm2(i*.004+3,s*.004,2)+.3*y(300,2e3,b)+(_e?.16:-.04),.08,1);n[f]=N,n[f+1]=k,n[f+2]=(_e?.9:.3)*y(-.1,.5,S.n2(i*.006+20,s*.006))}r%32===0&&await x.yield()}for(let r=0;r<320;r++)for(let w=0;w<o-1;w++){const i=r*o+w,v=i+o;d.push(i,i+1,v+1,i,v+1,v)}const p=new l.BufferGeometry;p.setAttribute("position",new l.BufferAttribute(a,3)),p.setAttribute("ink",new l.BufferAttribute(n,3)),p.setIndex(d),p.computeVertexNormals();const h=Y({uniforms:{uCloud:Ut,uBufH:z.uniforms.uBufH,uPx:q.uniforms.uPx},side:l.DoubleSide,haze:!1,vertexPre:"varying vec3 vLoc;",vertexMain:"vLoc = p;",fragmentPre:"varying vec3 vLoc; uniform float uBufH, uPx;"+Ra+yo,fragmentMain:`
          vec2 w = vWorld.xz; float px = max(fwidth(w.x) + fwidth(w.y), 1e-4);
          float rock = vInk.r, dens = vInk.g, broom = vInk.b, nearK = (1. - smoothstep(1., 5., px));
          float n1 = inkNoise(w * .045), n2 = mix(.5, inkNoise(w * .31 + 11.), (1. - smoothstep(2.5, 9., px))), n3 = inkNoise(w * 1.7 + 3.);
          float m = n1 * .55 + n2 * mix(.45, .3, nearK) + n3 * .15 * nearK;
          float scrub = smoothstep(.52 - dens * .34, .57 - dens * .34, m);
          // THE PRINTED MAP. Where a design pixel of the page covers more than a few metres of ground (dp: from about
          // 700 m up, and all the far hills from anywhere) the land is drawn as a map and not as a texture: scrub in broad
          // FLAT patches of olive, hundreds of metres across with clean edges, on ground printed flat too; no mottling.
          float dp = px * uBufH / 450., mapK = smoothstep(3., 6.5, dp);
          float pm = inkNoise(w * .0047 + 17.) * .64 + inkNoise(w * .0121 + 3.) * .36, pe = max(fwidth(pm) * 1.2, .012);
          scrub = mix(scrub, smoothstep(.5 - pe, .5 + pe, pm + (dens - .55) * .45 + .035), mapK);
          float rib = smoothstep(.6, .66, inkNoise(w * vec2(.016, .11) + 40.)) * step(n2, .62) * (1. - mapK);
          // BARE GROUND ON THE MAP IS A STRAW GROUND WITH ITS FORM FROM THE LIGHT (mend12), flat and clean-edged as the olive
          // is, NO GRAIN (a thistle head or a rib is smaller than a design pixel there: noise). The straw is an ink the
          // sea does not carry: a regular screen of the yellow plate, printed at the end of this shader (THE STRAW SCREEN).
          // Over it the blue of the shade, by the light:
          // turn = the light a slope loses against level ground (the sun's height less N.L) over the sun's level
          // length. It is NOT the tilt from the sun's bearing alone: for a slope of tilt t whose fall line stands at the
          // angle a from the sun's bearing, turn = tan(sun's height) (1 - cos t) - sin t cos a: the lean away from the
          // sun plus what any tilt loses under a high sun. So at noon (the sun 64 degrees up) 45 to 73 in a hundred of
          // the turned ground lean a little sunward and are turned by their steepness; at the golden hour (25 degrees)
          // 1 in a hundred (headless, seeds 7, 11, 34, 4, 1 and 3, 20). Ground with level ground's light or more prints
          // the straw alone; ground with less takes the blue screen in three flat steps whose edges follow the relief,
          // one REAL pixel soft each side (tw: fwidth, the buffer's own pixel, which is the design pixel at 800 by
          // 450; measured in the second pass: an edge twice as soft moves the shimmer by nothing, so it stays):
          // .30 from turn 0, .44 from .06, .58 from .14 (a slope straight away from the sun: 3.3 and 7.1 degrees at
          // noon, 3.4 and 7.8 at the golden hour; side-on: 14 and 21, 30 and 46). These numbers are measures of the
          // print, not of the land: three tones .14 apart, the lightest a clear step under the straw (L 83 under 89),
          // the deepest under the olive's .64 so that turned ground is never taken for scrub; .06 and .14 halve the
          // turned ground twice at noon (the counts below). The page's own shade law (inkShade)
          // begins at N.L .35 and reaches none of this ground at noon (N.L .83 to .98 on seeds 7, 11, 34, 4, 1), so the
          // hills had no turned side. By turn, at noon 19 to 25 in a hundred of the bare ground are turned at all, 9
          // to 14 past the second step, 4 to 7 past the third (seed 1's flatter ground: 10, 2, 1); at the golden hour
          // 51, 32 and 19. The tones print L 83, 73 and 58 over the straw's 89 (eval11b's one flat tone, .42,
          // printed 80 over all of it). They come in with mapK as dots growing from nothing; the near ground keeps the
          // brief's bare paper. Left paper on the map: the road; and the terraces' fallow strips nearer than the far
          // gate (beyond it THE FAR GROUND IS ONE HAZED TONE, below, takes them with the rest of the top).
          float turn = (uSunDir.y - lit) / max(length(uSunDir.xz), .2), tw = max(fwidth(turn), 1e-4), lw = max(fwidth(lit), 1e-4);
          float shadeM = .30 * smoothstep(0. - tw, 0. + tw, turn) + .14 * smoothstep(.06 - tw, .06 + tw, turn) + .14 * smoothstep(.14 - tw, .14 + tw, turn);
          vec3 top = mix(vec3(0., .1 * smoothstep(.5, .8, n2), 0.), vec3(0., shadeM, 0.), mapK);   // bleached grass: bare paper near
          float brm = mix(smoothstep(.6, .66, inkNoise(w * .06 + 70.)), smoothstep(.66, .66 + pe * 2., inkNoise(w * .0083 + 70.)) * step(.5, broom), mapK);
          top = mix(top, vec3(0., 0., 1.), brm * broom);                                       // broom: flat yellow
          top = mix(top, vec3(0., mix(.52 + .3 * n2, .64, mapK), 1.), scrub);                  // olive: blue dots on flat yellow
          top = mix(top, vec3(0., .16 + .3 * n3 * nearK, 0.), rib * (1. - scrub * .7));       // limestone ribs
          // THE LANDMARKS, so that the land is a place and not a texture. Terraced fields on the slopes round the village:
          // strips that follow the contours, stubble (flat yellow), olive and bleached fallow (paper) in turn, each behind a paper wall ...
          float tm = 1. - smoothstep(200., 340., length(w - vec2(${Ia[0].toFixed(1)}, ${(Ia[1]-20).toFixed(1)})) + 70. * (inkNoise(w * .006 + 3.) - .5));
          float tq = (vLoc.y + .1 * dot(w, vec2(.5, .86))) / 6., tf = fract(tq), ft = max(fwidth(tq), 1e-5);
          float wall = (1. - smoothstep(.06 + ft * .5, .06 + ft * 1.5, min(tf, 1. - tf))) * (1. - smoothstep(.2, .5, ft));
          float tk = mod(floor(tq), 3.);
          vec3 fld = tk < .5 ? vec3(0., .08 + .12 * n2, .92) : tk < 1.5 ? vec3(0., .52 + .24 * n2, 1.) : vec3(0., .1 + .14 * n2, 0.);
          top = mix(top, mix(fld, vec3(0.), wall), tm * (1. - smoothstep(.4, .9, ft)) * (1. - mapK));
          // ... on the map the terraces are CONTOUR BANDS: flat yellow and bare paper in turn, each band 15 m of height
          // (broad enough to print), round the village and round the upper hamlet on the hill road (HAMLET)
          float tmM = max(tm, 1. - smoothstep(250., 470., length(w - vec2(${Pa[0].toFixed(1)}, ${Pa[1].toFixed(1)})) + 110. * (inkNoise(w * .0045 + 8.) - .5)));
          float tqM = tq / 2.5, tfM = fract(tqM), ftM = max(fwidth(tqM), 1e-5);
          float bandM = smoothstep(0., ftM, tfM) * (1. - smoothstep(.56, .56 + ftM, tfM));
          top = mix(top, vec3(0., .04, bandM), tmM * mapK * (1. - smoothstep(.45, 1.1, ftM)));
          // ... and the white road (see roadX), never thinner than two pixels and a bit: a paper line from the tower to the village and on over the hills
          // (on the map it is ONE CLEAN LINE: three design pixels of paper at any range between two hairlines of blue, as a
          // road is cased on a printed sheet, so it reads across bare ground and olive alike)
          float rq = -w.y, rsl = (roadX(rq + 3.) - roadX(rq - 3.)) / 6., rd = abs(w.x - roadX(rq)) / sqrt(1. + rsl * rsl), mpp = px * .5, mpd = mpp * uBufH / 450.;
          float rhw = max(2.4, mix(1.15 * mpp, 1.5 * mpd, mapK)), rgate = step(13., rq) * (1. - smoothstep(2400., 2700., rq)) * (1. - smoothstep(mix(30., 70., mapK), mix(60., 130., mapK), px));
          float road = (1. - smoothstep(rhw - .5 * mpp, rhw + .5 * mpp, rd)) * rgate;
          float rcase = (1. - smoothstep(rhw + 1.1 * mpd - .5 * mpp, rhw + 1.1 * mpd + .5 * mpp, rd)) * rgate * mapK;
          top = mix(top, vec3(0., .96, 0.), rcase);
          top = mix(top, vec3(0.), road);
          // THISTLE IN THE BLEACHED GRASS OF THE NEAR GROUND, one law over the whole headland: a head in one cell in seven
          // (cells of 1.8 m), an oval 1.35 by 1.04 m. The .86 and .34/.5 are no count of the plant: they give a cover of 4.4
          // in a hundred of the bleached grass, the cover eval4c's line had (whole top, seeds 1 to 40). None on the map.
          vec2 tc = w * .55, tci = floor(tc);                                                   // thistle heads: small round clusters of pink grain
          float th = step(.86, inkHash(tci)) * (1. - smoothstep(.34, .5, length((fract(tc) - .5) * vec2(1., 1.3) + (vec2(inkHash(tci + 7.), inkHash(tci + 13.)) - .5) * .12) + .1 * inkNoise(w * 5.)));
          top.r = max(top.r, th * nearK * (1. - mapK) * (1. - scrub) * .92);                                // (flecks of near-solid pink a metre and a half across in the bleached grass)
          float sy = vLoc.y * .09 + inkNoise(vec2(w.x * .02, vLoc.y * .06)) * 1.6, sf = max(fwidth(sy), 1e-5);
          float strata = (1. - smoothstep(.07 + sf * .5, .07 + sf * 1.5, abs(fract(sy) - .5))) * (1. - smoothstep(.15, .5, sf));
          float crack = smoothstep(.62, .74, inkNoise(vec2(w.x * .14, vLoc.y * .025)));
          // THE CLIFF FACE IS ROCK (mend12). It was paper with its strata inked on it (blue .08 is under the screen's first
          // dot, and the face takes the noon sun at N.L .23 to .73, three quarters of it over inkShade's .35): from just
          // off its edge a white pane with a paper rim. Now the face is a flat tone of the blue screen stepped by the
          // light it takes: .44 lit, .56 under N.L .45, .68 under .15 (L 78, 64 and 50, each a step deeper than the ground's;
          // edges one real pixel soft each side: lw, as tw). .45 is the face's median at noon, so half of it is the lit side; under .15 lie
          // the faces turned from a low sun (half the face at the golden hour, a fiftieth at noon). The strata are
          // KNOCKED OUT of the tone as paper lines (the same lines, .92 of the ink taken out); cracks stay plum.
          // inkShade still deepens the faces turned right away, as on everything.
          float rockT = .44 + .12 * (1. - smoothstep(.45 - lw, .45 + lw, lit)) + .12 * (1. - smoothstep(.15 - lw, .15 + lw, lit));
          vec3 cliff = vec3(crack * .7, rockT + crack * .3, 0.) * (1. - strata * .92);
          ink = mix(top, cliff, rock);
          float shd = cloudShadow(w, ${ae.toFixed(1)} - vLoc.y);                             // shade adds blue first, then a light pink grain: plum-blue, never solid pink
          // (on the map the shadow is one flat plum tone with a clean edge, sliding over patches, bands and road)
          shd = mix(shd, smoothstep(.3, .7, shd), mapK);
          ink.g = max(ink.g, shd * mix(.45, .6, mapK)); ink.r = max(ink.r, shd * mix(.28, .5, mapK) * (1. - rock * .6));
          shadeK = mix(.6, 1., rock);
          // (mend12) bare: 1 on the map's bare ground; 0 on the near ground, under olive, broom, terrace bands, the road and its case, and on rock
          float bare = mapK * (1. - brm * broom) * (1. - scrub) * (1. - tmM * mapK * (1. - smoothstep(.45, 1.1, ftM))) * (1. - rcase) * (1. - road) * (1. - rock);
          // NO LINE OF THE LAND'S OWN ALONG THE COAST (12e). eval12 laid a plum line 1.9 design px wide on the cliff's
          // top edge wherever the land is a map. In the climb the gaze turns 0.36 to 0.38 degrees a film frame and the
          // ground slides 2.6 to 3.6 design px a frame on the page (seed 7, u .33 to .61): a dark line thinner than its
          // own step is printed afresh at every frame, all of its ink changed twice over. Measured on the land alone
          // with the line switched off and nothing else (a port of this shader and of the page, two frames one film
          // frame apart at 800 by 450, the change inside the land's outline; seeds 7, 34 and 4, 30 places and clocks
          // of the climb): the line alone made 1 to 28 in a hundred of what the land changed, and where little but
          // the coast is in frame (u .544, seed 7) the land changed 59 in a hundred more than the site's with it and
          // 16 without. Taken out: the top ends in the rock of the face; the sea's ruled paper line at the foot and
          // the water case the coast.
          // THE LAND SHADES AND HAZES ITSELF (haze: false above, shadeK 0 from here: the press's own two calls in the
          // press's order), BY THE RANGE (12e): rng, the metres from the eye to this ground, where the press gives its
          // haze vDepth, the metres along the lens's axis. Those are a plane square to the lens: ground at one range
          // stands at its full distance in the middle of the frame and at 0.68 of it at the side edge of a 16:9 frame
          // (47 degrees off the axis), so by the press's measure the far gate below began 1.9 km off in the middle of
          // the frame and 2.8 km off at its side, ended 2.8 and 4.1 km off, and the ground between changed tone as the
          // head turned and nothing else did (2.8 km off: the haze's blue in the middle, olive and straw at the side).
          // Measured as the coast's line above (NO LINE OF THE LAND'S OWN): by the axis the land changed more than
          // a tenth over the site's at 21 of the 30 places and clocks (the most 59 in a hundred); the line out alone,
          // at 12 (the most 16); by the range, the line still on, at 9 (the most 52, the coast's own); by the range
          // with the line out at none (the most 9.5). WHAT THE RANGE GAINS IS GROUND IN ONE TONE, not a steadier tone.
          // What changes from frame to frame is the map's print sliding on the page, most of all the olive's edge
          // against lit ground (a step of .64 of the blue screen where the site's was .22: .64 against .42); the far
          // tone is flat, and by the range it begins 1.9 km off at every bearing. The proof: a ring laid at 0.85 of
          // the range (the plane's own mean over the frame is 0.83: as much far ground in frame as the plane gave)
          // gains next to nothing (over the site's, the mean of fifteen places of seeds 7 and 34: the plane 26 in a
          // hundred, that ring 24, the range 9). The price is counted too: the ground 1.9 to 4.1 km off toward the
          // frame's sides, olive by the plane, is the far tone now. On the lens's axis every value is what it was,
          // the near ground's too; off it the ground takes the haze of its own distance, and the far gate below is a
          // circle round the eye's foot where it was a line across the page. The map's bare ground must take the haze
          // as GROUND: inkHaze leaves bare paper bare (for the white birds), and lit ground far off would be a hole to
          // the sky. hzd is the haze worked once more with the ground's weight in the pink slot, only to open that gate:
          // its blue is the haze tone that bare ground settles to. It settles slowly (measured on the plates in the
          // second pass, noon: lit bare ground carries blue .06, .10 and .14 at 1.5, 3 and 5 km and prints L 90 to 91 with
          // its straw, while the olive beside it loses its yellow by the page's on/off between 1.9 and 2.8 km and is
          // the haze's blue from there): so far off the lit ground stood as cream patches and strips in a blue land,
          // read as shapes lying on water.
          // THE FAR GROUND IS ONE HAZED TONE (mend12, third pass). hzG is the share of a full yellow the page no longer
          // prints at this range (the press's haze law through the page's on/off: 0 to 1.9 km, 1 from 2.8 km; haze
          // hour 0.86 and 1.27 km): the gate at which the olive stops being olive. By the same gate the whole top of
          // the map (bare ground lit or turned, broom, the terraces' bands; not the rock, not the road's paper) takes
          // the olive's own hazed blue (.64 through the haze, as the olive beside it has there: one land, no patch and
          // no rim; the haze's own .22 would stand paler than the olive and leave the patches). Measured at noon, the
          // far land from the far sea at 3 and 5 km: dE 28 and 21 (the site's two tones together 32 and 23); haze hour
          // at 1.5, 3 and 5 km: 24, 19, 8 (the site's 28, 19, 8). (Those were mend12's, the distance by the axis. 12e,
          // on the climb's frames of seeds 7 and 4, land and sea taken in rings of range: noon at 1.5, 3 and 5 km 49,
          // 27 and 23 where the plane gave 48, 32 and 20, its 3 km ring holding olive toward the frame's sides; haze
          // hour 33, 22 and 10 for 33, 20 and 9.) Nearer than the gate every value is what it was (on the lens's
          // axis: BY THE RANGE, above). The shore's ruled line goes by the same gate: THE LINE GOES WITH THE HAZE in
          // the sea's shader.
          float rng = length(vWorld - cameraPosition);
          vec3 lk = inkShade(ink, lit, shadeK), hzd = inkHaze(vec3(bare, lk.g, 0.), rng);
          ink = inkHaze(lk, rng); ink.g = max(ink.g, hzd.g); shadeK = 0.;
          float hzG = clamp(rng / max(uHaze.x, 1.), 0., 1.); hzG = smoothstep(.42, .58, 1. - (1. - hzG) * (1. - hzG));
          ink.g = mix(ink.g, max(ink.g, mix(.64, uHaze.y, 1. - exp(-rng / max(uHaze.z, 1.)))), hzG * mapK * (1. - rock) * (1. - road));
          // THE STRAW SCREEN (mend12): the map's bare ground and the rock of the cliff under round dots of the YELLOW
          // plate at the blue screen's pitch (6 design px), 15 degrees: 60 from the blue's 75, which between two square
          // screens is 30, so the two beat at 11.6 design px (6 / (2 sin 15)): a rosette not quite two pitches across,
          // the same at every height and page size, no slower moire (on the line-screen edition the dots beat with
          // the lines, pitch 5, at 10 px). It is nailed to the page like the blue one and like the sky's gold screen. The
          // pink plate was not taken: its grain and its register slip tear a regular dot into specks (tried on the
          // page's law off line). The haze thins the dots at half the pace of other yellows, the pace the sea hazes at
          // (the ground of the page, as the sea is). Tone .38 is a measure of the print: with the dot's soft edge (.04)
          // and that haze it covers 24 in a hundred of the paper where the map begins (700 m off) and 20 at 1.5 km
          // (haze hour: 20 where the map begins), the fifth to a quarter of a light ground while it is near
          // enough to read; near, it prints L 89, straw, 14 dE from the paper, 56 from the shallows, 55 from the olive.
          // NO DOT ON GROUND THAT HAS GONE TO THE HAZE'S BLUE (second and third pass): on the bare ground and on the
          // rock the dots go out by the gate above (hzG): whole to 1.9 km, gone from 2.8 km (haze hour 0.86 and
          // 1.27 km). Nearer than the gate every value is what it was (on the lens's axis; the dots thin by the range).
          float straw = inkHaze(vec3(.38 * (bare + rock * (1. - strata * .92)) * (1. - hzG), 0., 0.), rng * .5).r;
          vec2 gq = mat2(.965926, .258819, -.258819, .965926) * (gl_FragCoord.xy / max(uPx, .25)) * (6.28318 / 6.);
          ink.b = max(ink.b, smoothstep(0., .08, straw - (.5 - .25 * (cos(gq.x) + cos(gq.y)))));`}),m=new l.Mesh(p,h);m.name="headland",me.add(m)}await x.yield();const _a={value:V?2.2:1},Yt=(e="",t="")=>Y({uniforms:{uToss:_a},side:l.DoubleSide,vertexPre:"attribute vec3 iInk; uniform float uToss; varying vec3 vLoc; varying vec2 vHome;",vertexMain:`
        vLoc = p; inkV = mix(iInk, vec3(0., 0., 0.), ink.x); vHome = instanceMatrix[3].xz;
        float ph = instanceMatrix[3].x * .21 + instanceMatrix[3].z * .17;
        float sway = sin(uTime * 1.7 + ph) + .5 * sin(uTime * 3.1 + ph * 1.7);
        p.xz += vec2(.07, .04) * sway * p.y * uToss; ${e}`,fragmentPre:"varying vec3 vLoc; varying vec2 vHome;",fragmentMain:`
        float lf = inkNoise(vLoc.xz * 5. + vWorld.xz * .7) ;
        ${t}
        // a ragged clump, not a polygon: torn along its outline (where the face turns away from the lens) with a few gaps inside
        float rim = abs(dot(n, normalize(cameraPosition - vWorld)));
        if (inkNoise(vLoc.xy * 6. + vWorld.xz * 1.3 + vLoc.z * 4.) > .5 + rim * 1.5) discard;
        ink.g = clamp(ink.g + (lf - .5) * .5 - smoothstep(.72, .8, lf) * .5 * vLoc.y, 0., 1.);     // leaf gaps let the yellow through
        // the side away from the sun takes blue dots on the olive clumps (wild olive, mastic, palms: recipes with blue in
        // them, .35 and more); broom and thistle clumps (the design's flora; recipes with .12 of blue at most) take none of
        // it, so broom stays flat yellow and thistle pink grain but for the general shade (blue .3 to .55 low on the far flank)
        float away = (1. - smoothstep(-.5, .1, dot(n.xz, uSunDir.xz / max(length(uSunDir.xz), .2)))) * smoothstep(.15, .35, vInk.g);
        ink.g += (1. - ink.g) * away * (.3 + .2 * lf);
        ink.r = min(ink.r, .62);                                                             // thistle clumps: pink grain, never solid pink
        lit += (vLoc.y - .45) * .9; shadeK = .9;`});{const e=new ee,t=7,c=[],o=[];for(let k=0;k<t;k++){const T=k/t*P,B=1+.22*Math.sin(k*2.4);c.push(e.v(Math.cos(T)*B,0,Math.sin(T)*B,A))}for(let k=0;k<t;k++){const T=(k+.5)/t*P,B=.78+.16*Math.sin(k*1.7+1);o.push(e.v(Math.cos(T)*B,.58+.1*Math.sin(k*3.1),Math.sin(T)*B,A))}const a=e.v(.08,.9,-.05,A);for(let k=0;k<t;k++){const T=(k+1)%t;e.tri(c[k],o[k],c[T]),e.tri(c[T],o[k],o[T]),e.tri(o[k],a,o[T])}const n=e.build(),d=new ee;for(let k=0;k<9;k++){const T=k/9*P+k%2*.2,B=.5+.35*(k*7%3)/2,I=Math.cos(T),K=Math.sin(T),Q=.16,oe=[0,.1,0],se=[I*.6*Math.cos(B),.6*Math.sin(B)+.1,K*.6*Math.cos(B)],ke=[I*1.15,.6*Math.sin(B)-.05,K*1.15],Te=d.v(oe[0],oe[1],oe[2],A),ze=d.v(se[0]-K*Q,se[1],se[2]+I*Q,A),Le=d.v(se[0]+K*Q,se[1],se[2]-I*Q,A),ye=d.v(ke[0],ke[1],ke[2],A);d.tri(Te,ze,Le),d.tri(ze,ye,Le)}const p=d.build(),h=Math.round(2300*J(.6,1,G((te-.6)/.4,0,1))*G(Z,.85,1.15)),m=260,r=(k,T,B)=>{const I=new l.InstancedMesh(k,B,T);return I.geometry.setAttribute("iInk",new l.InstancedBufferAttribute(new Float32Array(T*3),3)),I.frustumCulled=!1,me.add(I),I},i=r(n,h,Yt("",`
        float rl = length(vLoc.xz); vec2 dr = vLoc.xz / max(rl, 1e-3);
        float edge = .8 + .34 * inkNoise(dr * 2.4 + vHome * .37) + .12 * inkNoise(dr * 8. + vHome * .9);   // (a bushy mass with a lobed edge: nothing is knocked out of its middle)
        if (rl > edge) discard;
        float gapN = inkNoise(vLoc.xz * 9. + vHome * 1.7 + vLoc.y * 3.);
        float fleck = max(smoothstep(.58, .64, lf) * step(gapN, .42), step(.72, gapN) * step(lf, .4));
        ink.g *= 1. - .9 * fleck; ink.r *= 1. - fleck; ink.b *= mix(1., step(.3, gapN), fleck);`)),v=r(p,m,Yt()),u=new l.Matrix4,b=new l.Quaternion,f=new l.Euler,s=new l.Vector3,M=new l.Vector3,N=(k,T,B)=>{const I=k.geometry.attributes.iInk.array;for(let K=0;K<T;K++){let Q=0,oe=0,se=0,ke=0;do{const Ea=g.chance(.62);Q=Ea?g.range(-130,190):g.range(-650,700),se=Ea?2+230*Math.pow(g(),1.5):4+650*g(),oe=Tt(Q)-se,ke++}while(ke<6&&(S.n2(Q*.045+7,oe*.045)<-.25||Math.hypot(Q-$.x,oe-$.z)<6));const Te=g(),ze=B?g.range(1,1.9):Math.min(.9+2.4*Te*Te,Math.abs(Q-36)<40&&oe>-95?2.9:9),Le=B?ze*g.range(.9,1.3):ze*g.range(.7,1.25);f.set(g.range(-.08,.08),g()*P,g.range(-.08,.08)),b.setFromEuler(f);const ye=g(),Qe=!B&&ye>=(_e?.24:.07)&&ye<(_e?.29:.12)?.38:1;u.compose(M.set(Q,Bt(Q,oe,se)-.15,oe),b,s.set(ze*Qe,Le*Qe,ze*Qe*g.range(.8,1.2))),k.setMatrixAt(K,u);const Gt=B?[0,g.range(.35,.6),1]:ye<(_e?.24:.07)?[0,g.range(0,.12),1]:ye<(_e?.29:.12)?[g.range(.5,.9),.1,0]:ye<.42?[.25,.95,1]:[0,g.range(.5,.82),1];I[K*3]=Gt[0],I[K*3+1]=Gt[1],I[K*3+2]=Gt[2]}k.instanceMatrix.needsUpdate=!0};N(i,h,!1),await x.yield(),N(v,m,!0)}await x.yield();const rt=Y({side:l.DoubleSide,fragmentMain:"float wh = 1. - max(vInk.r, max(vInk.g, vInk.b)); shadeK = mix(1., .42, wh);"}),ve=new ee;{const e=new ee,t=28,o=[[0,4.15],[.9,4],[1,3.8],[4,3.7],[8,3.6],[11.6,3.52],[11.9,3.9],[12.5,3.95]].map(r=>{const w=[];for(let i=0;i<t;i++){const v=i/t*P;w.push(e.v(Math.cos(v)*r[1],r[0],Math.sin(v)*r[1],L))}return w});for(let r=0;r<o.length-1;r++)for(let w=0;w<t;w++){const i=(w+1)%t;e.quad(o[r][w],o[r+1][w],o[r+1][i],o[r][i])}const a=r=>14-(S.n2(r*.9,4.2)<-.25?1.3:0)-(r%4===3?.7:0)-(r>19&&r<24?.6+.3*(r%2):0);for(let r=0;r<t;r++){const w=r/t*P,i=(r+1)/t*P,v=a(r),u=3.95,b=3.3,f=[[Math.cos(w),Math.sin(w)],[Math.cos(i),Math.sin(i)]],s=(M,N,k)=>e.v(M[0]*N,k,M[1]*N,L);e.quad(s(f[0],u,12.5),s(f[0],u,v),s(f[1],u,v),s(f[1],u,12.5)),e.quad(s(f[1],b,12.5),s(f[1],b,v),s(f[0],b,v),s(f[0],b,12.5)),e.quad(s(f[0],u,v),s(f[0],b,v),s(f[1],b,v),s(f[1],u,v)),e.quad(s(f[0],b,12.5),s(f[0],b,v),s(f[0],u,v),s(f[0],u,12.5)),e.quad(s(f[1],u,12.5),s(f[1],u,v),s(f[1],b,v),s(f[1],b,12.5))}{const r=e.v(0,12.6,0,L),w=[];for(let i=0;i<t;i++){const v=i/t*P;w.push(e.v(Math.cos(v)*3.3,12.6,Math.sin(v)*3.3,L))}for(let i=0;i<t;i++)e.tri(r,w[(i+1)%t],w[i])}const n=Y({vertexPre:"varying vec3 vLoc;",vertexMain:"vLoc = p;",fragmentPre:"varying vec3 vLoc;",side:l.DoubleSide,fragmentMain:`
          float ang = atan(vLoc.z, abs(vLoc.x) + 1e-4), wall = step(abs(n.y), .6);
          float cy = vLoc.y / .62 + .08 * inkNoise(vLoc.xz * 2.), fy = max(fwidth(vLoc.y / .62), 1e-5), row = floor(cy);
          float ca = ang * 7. + mod(row, 2.) * .5 + .15 * inkHash(vec2(row, 3.)), fa = max(fwidth(ang * 7.), 1e-5);
          float lh = (1. - smoothstep(.045 + fy * .5, .045 + fy * 1.5, abs(fract(cy) - .5))) * (1. - smoothstep(.16, .5, fy));
          float lv = (1. - smoothstep(.03 + fa * .5, .03 + fa * 1.5, abs(fract(ca) - .5))) * (1. - smoothstep(.12, .4, fa)) * step(.1, abs(fract(cy) - .5));
          float slit = step(abs(ang - .35), .05) * step(abs(vLoc.y - 8.4), 1.1) * step(0., vLoc.x);
          float knock = max(max(lh, lv) * wall * step(vLoc.y, 12.4), slit);
          float sun = smoothstep(.05, .55, lit);
          ink = vec3(1. - sun * .4, 1. - sun * .1, 0.) * (1. - knock * .92);                  // lit stone is a paler violet, never grey
          ink.rg *= 1. - .25 * smoothstep(.55, .8, inkNoise(vLoc.xy * vec2(1.3, .5) + vLoc.z)) * sun;
          shadeK = 0.;`}),d=new l.Mesh(e.build(),n);d.position.set($.x,$.y,$.z),d.name="watchtower",me.add(d);const p=$.x-.5,h=$.y+12.6,m=$.z-.3;Ae(ve,S,p,h+.75,m,2.5,1,.42,0,.5,[.75,.9,.35]);for(let r=0;r<26;r++){const w=g()*P,i=g.range(1.2,2.6),v=h+g.range(.5,1.5),u=g.range(1.2,2.4),b=w+g.range(1,2.1);ce(ve,[[p+Math.cos(w)*i,v,m+Math.sin(w)*i,.05],[p+Math.cos(w)*i+Math.cos(b)*u,v+g.range(-.3,.5),m+Math.sin(w)*i+Math.sin(b)*u,.04]],3,g.chance(.5)?L:[.2,.7,1],!1)}}const Qt=[];for(let e=0;e<2;e++){const c=$.x-.5+(e?.95:-.75),o=$.y+13.75,a=$.z-.3+(e?.5:-.35),n=e?2.5:-.4,d=Math.cos(n),p=Math.sin(n),h=(u,b,f)=>[c+(u*d+f*p)*1.3,o+b*1.3,a+(-u*p+f*d)*1.3],m=u=>u.map(b=>{const f=h(b[0],b[1],b[2]);return[f[0],f[1],f[2],b[3]*1.3]}),r=[L,L,A,A,A,A];ce(ve,m([[0,.5,-.44,.03],[0,.52,-.3,.1],[0,.6,-.1,.15],[0,.7,.08,.15],[0,.8,.2,.1],[0,.86,.25,.05]]),7,u=>r[u]);for(const u of[-1,1])ce(ve,m([[u*.13,.74,.12,.05],[u*.16,.62,-.12,.085],[u*.12,.5,-.36,.06],[u*.07,.44,-.52,.02]]),5,b=>b===0?A:L),ce(ve,m([[u*.06,.5,-.05,.03],[u*.06,.24,-.02,.026],[u*.065,0,-.06,.026],[u*.065,-.01,.1,.02]]),4,ue);const w=new ee;ce(w,[[0,0,0,.055],[0,.16,.035,.04],[0,.33,.045,.036],[0,.42,.06,.05],[0,.45,.11,.045],[0,.44,.15,.025]],6,A),ce(w,[[0,.44,.13,.03],[0,.42,.26,.022],[0,.39,.4,.006]],5,ue);const i=new l.Mesh(w.build(),rt),v=h(0,.84,.23);i.position.set(v[0],v[1],v[2]),i.scale.setScalar(1.3),i.rotation.order="YXZ",i.rotation.y=n,me.add(i),Qt.push({neck:i,seed:e*.37+.2})}{const e=tt[0],t=tt[1];{const o=new ee;Ae(o,S,0,0,0,1,2,.2,0,.55,[0,.42,.8]);const a=o.build(),n=new l.Mesh(a,rt);n.position.set(e,W-2,t),n.scale.set(31,44,52),n.rotation.y=.2,me.add(n);const d=new l.Mesh(a,rt);d.position.set(De[0],W-2,De[1]),d.scale.set(36,40,54),d.rotation.y=1.3,me.add(d);const p=new l.Mesh(a,rt);p.position.set(at[0],W-1.5,at[1]),p.scale.set(11,17,15),p.rotation.y=2.4,me.add(p)}const c=[A,A,ue,ue,A,A,L,L];ce(ve,[[e,W+4,t,4.2],[e,W+9,t,3.2],[e,W+9.1,t,3.2],[e,W+17,t,2.8],[e,W+17.1,t,2.8],[e,W+26,t,2.4],[e,W+26.1,t,3.1],[e,W+30,t,2.2]],10,o=>c[o]),R(ve,e+9,W+4,t-6,10,4,7,A,.4),R(ve,e+9,W+8,t-6,10.5,2.2,7.5,ue,.4,[.1,1])}{const e=new ee,t=Fe("stork-kettle-village:"+(x.seed??0)),c=h=>Math.atan2(We(h+4)-We(h-4),-8),o=(h,m,r,w,i,v,u,b)=>{const f=[h,m,r,Math.max(w,v)];R(e,h,m,r,w,i,v,A,u,[1,1],f),R(e,h,m+i,r,w*1.06,b,v*1.06,ue,u,[.12,1],f)};for(let h=0;h<42;h++){const m=605+190*t(),r=h%2?1:-1,w=11+52*t()*t(),i=We(m)+r*w,v=-m,u=t.range(9,15),b=t.range(8,12),f=t.range(5.5,9),s=c(m)+t.range(-.25,.25)+(t()<.3?Math.PI/2:0),M=it(i,v)-.8;o(i,M,v,u,f,b,s,2.8)}const a=(h,m,r,w)=>{const i=We(h)+m,v=-h,u=it(i,v)-.8,b=c(h),f=[i,u,v,r];R(e,i,u,v,13,15,r,A,b,[1,1],f),R(e,i,u+15,v,13.6,4.5,r+.6,ue,b,[.1,1],f),R(e,i+14*Math.cos(b),u,v-14*Math.sin(b),8.5,w,8.5,A,b,[1,1],f),R(e,i+14*Math.cos(b),u+w,v-14*Math.sin(b),9.2,8,9.2,L,b,[.06,.06],f)};a(700,-24,24,31);const n=Fe(x.core.hashSeed("stork-kettle-hamlet:"+(x.seed??0)));for(let h=0;h<26;h++){const m=1730+260*n(),r=h%2?1:-1,w=12+62*n()*n(),i=We(m)+r*w,v=-m,u=n.range(9,15),b=n.range(8,12),f=n.range(5.5,9),s=c(m)+n.range(-.25,.25)+(n()<.3?Math.PI/2:0),M=it(i,v)-.8;o(i,M,v,u,f,b,s,2.8)}a(1850,26,18,22);const d=Y({side:l.DoubleSide,uniforms:{uAlt:z.uniforms.uAlt},vertexPre:"attribute vec4 aX; uniform float uAlt;",vertexMain:`
          float hd = max(length((modelMatrix * vec4(aX.xyz, 1.)).xyz - cameraPosition), 1.);
          float farK = smoothstep(${At[0].toFixed(1)}, ${At[1].toFixed(1)}, uAlt), hk = mix(1., max(1., hd / ${et.toFixed(1)}), farK);   // the range rule (see FAR_HOLD)
          p = aX.xyz + (p - aX.xyz) * vec3(hk, hk * mix(1., 1.5, farK * smoothstep(${et.toFixed(1)}, ${(2*et).toFixed(1)}, hd)), hk);`,fragmentMain:"float wh = 1. - max(vInk.r, max(vInk.g, vInk.b)); shadeK = mix(1., .42, wh);"}),p=new l.Mesh(e.build("aX"),d);p.frustumCulled=!1,p.name="village",me.add(p)}await x.yield();const Ht=new ee;for(let e=0;e<14;e++){const t=-940+e*145+g.range(-30,30),c=-1500+130*S.n2(e*.6,1.5)-Math.abs(e-6.5)*22,o=it(t,c)-2,a=92;ce(ve,[[t,o,c,4.6],[t,o+a*.5,c,3.6],[t,o+a,c,2.8]],6,A),R(ve,t+3,o+a-3,c,14,6,6,A);const n=g()*P;for(let d=0;d<3;d++)for(let p=0;p<3;p++){const h=p*17,m=(p+1)*17,r=6-p*1.4,w=6-(p+1)*1.4,i=n+d*P/3,v=[t+11,o+a,c],u=(b,f)=>Ht.v(v[0],v[1],v[2],A,1,0,0,[b,f,i,.8+.4*(e*7%5)/5]);Ht.quad(u(h,-r/2),u(m,-w/2),u(m,w/2),u(h,r/2))}}{const e=Y({side:l.DoubleSide,uniforms:{uBufH:z.uniforms.uBufH,uSpin:{value:V?1.5:.75}},vertexPre:"attribute vec4 aX; uniform float uBufH, uSpin;",vertexMain:`
          float a = aX.z + uTime * uSpin * aX.w, dist = max(length((modelMatrix * vec4(p, 1.)).xyz - cameraPosition), 1.);
          float c = aX.y * max(1., 2.4 * dist / max(projectionMatrix[1][1] * uBufH * .5 * 5., 1e-3));     // never thinner than 2.4 px
          p += vec3(0., aX.x * cos(a) - c * sin(a), aX.x * sin(a) + c * cos(a));`,fragmentMain:"shadeK = .25;"}),t=new l.Mesh(Ht.build("aX"),e);t.frustumCulled=!1,me.add(t)}await x.yield();const Xa=(e,t,c)=>{const o=new ee,a=e<2,n=e===2?110:e===3?26:e===0?285:300,d=e===2?26:e===3?8:50,p=e===2?9:e===3?3:15,h=12,m=[],r=[],w=u=>u<.08?.82+u*2.2:u<.72?1:Math.max(.03,Math.cos((u-.72)/.28*Math.PI/2)),i=e===2?A:e===0?[.55,0,1]:[t[0]*.5,.25,t[2]];for(let u=0;u<=h;u++){const b=u/h,f=(b-.5)*n,s=d/2*w(b),M=p+(b>.8?(b-.8)*p*1.4:0);m.push([o.v(-s*.8,-2,f,t),o.v(-s,M,f,t),o.v(-s,M,f,i)]),r.push([o.v(s*.8,-2,f,t),o.v(s,M,f,t),o.v(s,M,f,i)])}for(let u=0;u<h;u++)o.quad(m[u][0],m[u][1],m[u+1][1],m[u+1][0]),o.quad(r[u+1][0],r[u+1][1],r[u][1],r[u][0]),o.quad(m[u][2],r[u][2],r[u+1][2],m[u+1][2]);o.quad(r[0][0],r[0][1],m[0][1],m[0][0]);const v=(u,b)=>u+(b-u)*(((c=c*16807%2147483647)&65535)/65535);if(e===0){for(const u of[-.2,0,.2])R(o,u*d,p,n*.05,2.2,2.4,n*.66,A);for(let u=0;u<6;u++)R(o,0,p,-n*.24+u*n*.11,d*.8,3.2,3,A);R(o,0,p,-n*.39,d*.7,30,24,A),R(o,0,p+30,-n*.385,d*.96,5,12,A),R(o,0,p+30,-n*.43,9,15,11,t,0,[.8,.8])}else if(e===1){const u=[bo,Nt,Ba,ue,L,A,[0,.62,1],Nt,ue];for(let b=0;b<13;b++){if(b===3)continue;const f=-n*.4+b*n*.063;for(const s of[-1,0,1])R(o,s*d*.3,p,f,d*.28,v(9,21),n*.052,u[Math.floor(v(0,8.99))])}R(o,0,p,-n*.4+3*n*.063,d*.9,38,13,A),R(o,0,p+38,-n*.4+3*n*.063,d*1.02,5,9,A),R(o,0,p,-n*.455,9,34,9,t,0,[.8,.8])}else e===2?(R(o,0,p,-2,d*.9,7,n*.74,A,0,[.96,.93]),R(o,0,p+7,-2,d*.9,1.6,n*.7,Ba,0,[1,1]),R(o,0,p+8.6,-4,d*.8,6,n*.56,A,0,[.9,.9]),R(o,0,p+14.6,12,d*.6,4,16,A,0,[.8,.7]),R(o,0,p+14.6,-22,9,9,14,ue,0,[.7,.6])):(R(o,0,p,2,d*.6,4,7,A),R(o,0,p+4,2.5,d*.5,.8,5,L),ce(o,[[0,p,-3,.35],[0,p+11,-3.5,.25]],4,L),ce(o,[[0,p+7,-3,.25],[0,p+3,-11,.2]],4,L),R(o,0,p,-8,d*.7,1.6,5,Nt));return o.build()},Ua=Y({side:l.DoubleSide,haze:!1,fragmentMain:`
      float wh = 1. - max(vInk.r, max(vInk.g, vInk.b));
      ink = inkShade(ink, lit, mix(1., .42, wh)); ink = inkHaze(ink, vDepth * .15); shadeK = 0.;`}),Ie=Fe("stork-kettle-strait:"+(x.seed??0)),Dt=400,Jt=4,wt=(()=>{const e=Fe(x.core.hashSeed("fishing-boat:"+(x.seed??0))),t=(o,a)=>a>Tt(o)+60&&a<880&&Math.hypot(o-De[0],a-De[1])>90&&Math.hypot(o-tt[0],a-tt[1])>100&&Math.hypot(o-at[0],a-at[1])>50;let c=null;for(let o=0;o<60;o++){const a=e()*P,n=e.range(150,400),d=e()*P,p=De[0]+Math.sin(a)*n,h=De[1]+Math.cos(a)*n,m=Math.sin(d),r=Math.cos(d);let w=!0;for(let i=-Dt/2;i<=Dt/2+Jt*120&&w;i+=20)w=t(p+m*i,h+r*i);if(c=[p,h,m,r],w)break}return c})(),ea=[[0,ue,150,1e3,-1,.03,13,2400],[1,L,-900,1550,-1,-.02,15,2600],[0,L,-1700,2350,1,.02,12,2400],[1,ue,1900,2700,1,-.03,15,2600],[0,ue,1800,6200,-1,.04,13,3800],[2,L,-900,450,.2,.98,22,2200],[2,L,-1100,2300,-.2,-.98,24,2200],[2,L,-2100,5e3,1,-.1,24,3400],[3,ue,wt[0],wt[1],wt[2],wt[3],Jt,130]].map((e,t)=>{const c=new l.Mesh(Xa(e[0],e[1],977+t*131),Ua),o=Math.hypot(e[4],e[5]);c.rotation.y=Math.atan2(e[4],e[5]),Ce.add(c);const a=e[0]===2?110:e[0]===3?26:e[0]===0?285:300,n=e[0]===2?26:e[0]===3?8:50,d=Ie.range(-1,1)*(e[0]===2?320:e[0]===3?Dt/2:220),p=e[2]+e[4]/o*d,h=e[3]+e[5]/o*d;return jt.value[t].set(a,e[7],n,e[0]===3?.6:e[0]===2?2:1),Et.value[t].set(p,h,e[4]/o,e[5]/o),{mesh:c,x:p,z:h,dx:e[4]/o,dz:e[5]/o,v:e[6]}});await x.yield();{const e=new ee,t=re?[.07,.04,.02]:[.72,.5,.33],c=re?[.5,.75,.75]:[.32,.42,.5];[[11400,800,.9],[12500,1400,.55],[13700,2e3,.33]].forEach((a,n)=>{const p=[],h=[];for(let m=0;m<=110;m++){const r=(m/110-.5)*22e3,w=1-y(6500,10800,Math.abs(r)),i=1-Math.abs(S.fbm2(r*16e-5*(1+n*.4)+n*9,n*3.1,4)),v=a[1]*(.28+.72*i*i)*(.55+.45*y(-.5,.4,S.n2(r*7e-5+n*4,2)))*(.4+.6*w),u=a[0]-12e-6*r*r,b=t[n]*(.7+.3*w);p.push(e.v(r,W+v,u,[0,b,0],0,0,-1)),h.push(e.v(r,W-4,u,[0,b*c[n],0],0,0,-1))}for(let m=0;m<110;m++)e.quad(h[m],h[m+1],p[m+1],p[m])});const o=new l.Mesh(e.build(),Y({haze:!1,side:l.DoubleSide,fragmentMain:"lit = 1.; shadeK = 0.;"}));o.frustumCulled=!1,Ce.add(o)}const ta=[[-2700,-800],[3300,-1500],[2100,9300],[-3600,10200],[5600,9800]];{const e=new ee,t=Math.tan(z.mood.leanDeg*Je);ta.forEach((a,n)=>{const d=a[1]<0?it(a[0],a[1]):W,p=Math.max(16,Math.hypot(a[0],a[1])*.011),h=16,m=7,r=[],w=Math.max(1,Math.hypot(a[0],a[1])/4500);for(let i=0;i<=m;i++){const v=i/m,u=J(d+20,ae,v),b=118*w*J(.4,1,y(0,.45,v))*J(1,.6,y(.62,1,v)),f=[];for(let s=0;s<=h;s++){const M=s/h*P;f.push(e.v(a[0]+Math.cos(M)*b-t*(u-d),u,a[1]+Math.sin(M)*b,L,Math.cos(M),0,Math.sin(M),[s/h,p,n*3.7+1,v]))}r.push(f)}for(let i=0;i<m;i++)for(let v=0;v<h;v++)e.quad(r[i][v],r[i][v+1],r[i+1][v+1],r[i+1][v])});const c=Y({haze:!1,side:l.DoubleSide,uniforms:{uFar:{value:re?.75:1}},vertexPre:"attribute vec4 aX; varying vec4 vX; varying float vLy;",vertexMain:"vX = aX; vLy = p.y;",fragmentPre:"varying vec4 vX; varying float vLy; uniform float uFar;",fragmentMain:`
          float cs = max(vX.y, 1.);                                             // one bird to a cell of the page, never finer than the screen
          vec2 uv = vec2(vX.x * 740. / cs + uTime * 9. / cs, vLy / cs * 1.15); uv.y += uv.x * .22;
          vec2 ci = floor(uv), cf = fract(uv) - .5;
          float h1 = inkHash(ci + vX.z * 13.);
          float flip = step(0., sin(vX.x * 6.28318 + uTime * .39 - vLy * .012 + h1 * 2.5));   // the glitter wave climbs these too
          // the bird marks: cells four dots wide on the near side of the column
          vec2 bu = uv * .25 + vX.z, bi = floor(bu), bf = fract(bu) - .5;
          float nearSide = step(0., dot(vNormal.xz, cameraPosition.xz - vWorld.xz)), bh = inkHash(bi + 3.1);
          float markCell = step(.8, bh) * nearSide * step(vX.w, .86);
          float wing = abs(bf.y + .06 - .42 * abs(bf.x)), mark = max(step(wing, .085) * step(abs(bf.x), .4), step(abs(bf.x), .06) * step(abs(bf.y - .02), .2));
          if (markCell > .5) { if (mark < .5) discard; ink = vec3(1., 1., 0.) * uFar; }
          else {
            if (h1 < .5 + .36 * smoothstep(.7, 1., vX.w) || length(cf + (vec2(inkHash(ci + 5.), inkHash(ci + 9.)) - .5) * .3) > .36) discard;
            ink = vec3(.5, .78, 0.) * mix(.25, 1., flip) * uFar * (1. - .3 * vX.w);
          }
          lit = 1.; shadeK = 0.;`}),o=new l.Mesh(e.build("aX"),c);o.frustumCulled=!1,Ce.add(o)}await x.yield();const Xe=ot.position,ja=Y({fragmentMain:`
        float under = (1. - smoothstep(-.8, -.25, n.y));
        // the flat-yellow lining on the turning edge is a soft, broken rim (dabs several pixels deep) and never a ruled line:
        // where the turning band would print thinner than about four pixels, or lies along the cloud's outline, it is left out
        float turn = smoothstep(-.02, .16, lit) * (1. - smoothstep(.3, .6, lit));
        float deep = (1. - smoothstep(.06, .16, fwidth(lit)));
        float dab = smoothstep(.3, .55, inkNoise(vWorld.xz * .007) * .65 + inkNoise(vWorld.xz * .028 + 7.) * .35);
        // (and only clouds out over the strait carry it: those over the land are passed under their flat bases, where the
        // lining would print as a dashed line along the base)
        float facing = smoothstep(.16, .42, abs(dot(n, normalize(cameraPosition - vWorld)))) * smoothstep(150., 600., vWorld.z);
        ink = vec3(under * .42, under * .62, turn * (1. - under) * deep * dab * facing);
        shadeK = .8 * (1. - under);`});{const c=new Float32Array(15840),o=[];for(let p=0;p<=54;p++){const h=640*Math.pow(p/54,1.75);for(let m=0;m<96;m++){const r=m/96*P,w=Math.cos(r)*h*1.12-60,i=Math.sin(r)*h,v=(p*96+m)*3,u=Math.hypot(w-Xe.x,i-Xe.z),b=Math.max(h-450,0)/190;c[v]=w,c[v+2]=i,c[v+1]=ae+9*y(-.2,.7,S.n2(w*.021,i*.021))+11*(.5+.5*S.n2(w*.006,i*.006))*y(20,90,u)+24*Math.exp(-(u*u)/900)+b*b*150}p%18===0&&await x.yield()}for(let p=0;p<54;p++)for(let h=0;h<96;h++){const m=p*96+h,r=p*96+(h+1)%96,w=m+96,i=r+96;o.push(m,w,i,m,i,r)}const a=new l.BufferGeometry;a.setAttribute("position",new l.BufferAttribute(c,3)),a.setAttribute("ink",new l.BufferAttribute(new Float32Array(c.length),3)),a.setIndex(o),a.computeVertexNormals();const n=Y({side:l.DoubleSide,uniforms:{uSeat:{value:new l.Vector2(Xe.x,Xe.z+170)}},vertexPre:"varying vec3 vLoc;",vertexMain:"vLoc = p;",fragmentPre:"varying vec3 vLoc; uniform vec2 uSeat;",fragmentMain:`
          vec2 w = vLoc.xz;
          float dn = inkNoise(w * .028 + uTime * .012) * .6 + inkNoise(w * .1 - uTime * .025) * .4;       // the base breathes
          float up = clamp((vLoc.y - ${ae.toFixed(1)}) / 24., 0., 1.4);
          float ringD = length(w - uSeat), calm = 1. - smoothstep(150., 330., ringD);   // calm and dark over the last straight and far beyond the ring
          float b = .56 + .2 * up + (dn - .5) * .26 * (1. - calm) + .14 * calm;
          float pk = .26 + .34 * smoothstep(.15, .9, up) + (dn - .5) * .34 * (1. - calm) + .22 * calm;
          float scud = smoothstep(.66, .76, inkNoise(w * vec2(.012, .05) + vec2(uTime * .03, 0.)) * .6 + dn * .4) * (1. - calm);   // scud ribbons: paler streaks
          float rim = smoothstep(430., 640., length((w + vec2(60., 0.)) * vec2(.89, 1.)) + 60. * inkNoise(w * .006));
          ink = vec3(pk * (1. - scud * .4) * (1. - rim), b * (1. - scud * .24) * (1. - rim * .9), smoothstep(.5, .7, rim) * (1. - smoothstep(.86, .97, rim)));
          lit = 1.; shadeK = 0.;`}),d=new l.Mesh(a,n);d.frustumCulled=!1,d.name="cloud-base",st.add(d)}await x.yield();{const e=new ee;for(let a=0;a<15;a++){const n=a/15*P+g.range(-.1,.1),d=g.range(175,260);Ae(e,S,Math.cos(n)*610*1.12-60,ae+d*.62+g.range(0,60),Math.sin(n)*610,d,2,.8,0,.35,A),a%5===0&&await x.yield()}const t=[];for(let a=0;a<7;a++)t.push([V?-6e3+a*1900:g.range(-6500,6500),V?-1900-a%2*900:g.range(-3200,-1300)]);for(let a=0;a<7;a++)t.push([V?-6300+a*2e3:g.range(-7e3,7e3),V?10400+a%2*1100:g.range(9800,12400)]);for(const a of ta)t.push([a[0]-80,a[1],1]);for(let a=0;a<6;a++){const n=(a+Ie.range(-.3,.3))/5,d=-3e3+1800*n+Ie.range(-260,260),p=300+4900*n,h=230+150*n+Ie.range(-30,40),m=620+500*n+Ie.range(-45,45)+h*.1,r=Ie.range(.6,.9),w=Ie.range(.6,.9);Ae(e,S,d,m,p,h,2,.6,.1,.4,A),Ae(e,S,d+h*r,m-h*.02,p+h*.2,h*.62,1,.6,.13,.4,A),Ae(e,S,d-h*w,m-h*.03,p-h*.25,h*.54,1,.62,.14,.4,A)}await x.yield();let c=0;for(const a of t){const n=a[2]?g.range(330,420):g.range(300,620),d=ae+n*.1;Ae(e,S,a[0],d,a[1],n,2,g.range(.55,.8),.1,.4,A),Ae(e,S,a[0]+n*g.range(.6,.9),d,a[1]+n*g.range(-.3,.3),n*.62,1,.6,.16,.4,A),Ae(e,S,a[0]-n*g.range(.6,.9),d,a[1]+n*g.range(-.3,.3),n*.55,1,.62,.18,.4,A),++c%4===0&&await x.yield()}const o=new l.Mesh(e.build(),ja);o.frustumCulled=!1,st.add(o)}const It=[],aa=new l.Vector3;let Ue;{const e=new ee;Ae(e,S,0,0,0,1,1,.45,0,.5,A);const t=[[70,-35,21],[62,48,23],[54,250,22],[46,300,24],[38,-50,19],[30,235,20],[22,20,22],[14,285,23],[4,-30,22],[-8,225,24],[-20,40,26],[-34,-60,26]];for(let i=0;i<20;i++)t.push([66-i*3.3,(i%2?318:222)+i*5%4*1.5,8.6+.4*(i*7%3)]);const c=Y({side:l.DoubleSide,vertexPre:"attribute float iNear; varying float vNear; varying vec3 vLoc;",vertexMain:"vLoc = p; vNear = iNear;",fragmentPre:"varying vec3 vLoc; varying float vNear;",fragmentMain:`
          float e = abs(dot(n, normalize(cameraPosition - vWorld)));
          float along = vLoc.x, across = vLoc.z;
          float body = 1. - smoothstep(.2, 1., abs(across) * (1.2 + 1.3 * inkNoise(vec2(along * 2.5 + vWorld.x * .05, 3.))) + along * along * .85);
          float wisp = inkNoise(vec2(along * 1.7 + uTime * .05, across * 7. + vWorld.y * .1)) * .6 + inkNoise(vec2(along * 5., across * 17.) + 5.) * .4;
          float nearShow = mix(1., (1. - smoothstep(17., 25., vDepth)), vNear);                   // a near shred condenses out of nothing as the lens comes up to it
          if (body < .06 || wisp > mix(.32 + .5 * body, .15 + .57 * body, vNear) * nearShow || e < (.05 + .25 * wisp) * (1. - vNear)) discard;   // (a near shred is torn harder and is not culled by its facing)               // torn into fibres along its length, thinning to nothing at the ends
          float und = (1. - smoothstep(-.6, .1, n.y));
          ink = vec3(0., .2 + .22 * und + .14 * (1. - body), 0.); lit = 1.; shadeK = 0.;      // a mid tone: paler than the base, darker than the hazy strait
          // the near shreds hang in the cloud's own shade over the pale strait: a deeper plum-blue, so they read against it
          ink = mix(ink, vec3(.36 + .12 * und, .62 + .1 * und + .06 * (1. - body), 0.), vNear);`});Ue=new l.InstancedMesh(e.build(),c,t.length),Ue.frustumCulled=!1,st.add(Ue),Ue.geometry.setAttribute("iNear",new l.InstancedBufferAttribute(new Float32Array(t.map((i,v)=>v>=12?1:0)),1));const o=(i,v)=>(E.pointAt(i,v),v.y=z.altitudeAt(i),v),a=aa.copy(Xe).sub(o(.9,new l.Vector3)).normalize(),n=new l.Vector3().crossVectors(a,pt).normalize(),d=new l.Vector3().crossVectors(n,a),p=new l.Vector3,h=new l.Vector3,m=new l.Vector3,r=new l.Vector3,w=new l.Matrix4;for(let i=0;i<t.length;i++){const v=g(),u=g.range(1.3,3),b=g.sign?g.sign():g()<.5?-1:1,f=g.range(0,9),s=g.range(-5,5),M=g.range(.7,1.3),N=g.range(1.5,4),k=g()*40,T=g()*P,B=t[i],I=(B[1]+(v-.5)*14*b)*Je,K=B[2]+f*.35,Q=B[0]+(T/P-.5)*6;r.copy(Xe).addScaledVector(a,-Q);const oe=r.clone().addScaledVector(n,Math.cos(I)*K).addScaledVector(d,Math.sin(I)*K);h.subVectors(r,oe).normalize(),m.crossVectors(a,h).normalize();const se=s*.07;p.copy(h).multiplyScalar(Math.cos(se)).addScaledVector(m,Math.sin(se)),m.crossVectors(a,p).normalize();const ke=a.clone().multiplyScalar(.866).addScaledVector(p,.5),Te=p.clone().multiplyScalar(.866).addScaledVector(a,-.5);if(w.makeBasis(ke,Te,m),i>=12){const ze=s*.07,Le=n.clone().multiplyScalar(Math.cos(ze)).addScaledVector(a,Math.sin(ze));Le.multiplyScalar(Math.cos(.5)).addScaledVector(d,(Math.cos(I)<0?-1:1)*Math.sin(.5)).normalize();const ye=d.clone().multiplyScalar(.62).addScaledVector(a,-.785).normalize(),Qe=new l.Vector3().crossVectors(Le,ye).normalize();ye.crossVectors(Qe,Le).normalize(),w.makeBasis(Le,ye,Qe)}It.push({home:oe,r:(1+.5*(u-1.3))*(i>=12?1.55:1),len:i>=12?1.8:6,run:i>=12?.42:1,sy:M,sp:N,off:k,q:new l.Quaternion().setFromRotationMatrix(w)})}}await x.yield();const gt=e=>{const t=new ee,c=e===0?[.85,.35,1]:e===1?[.75,.8,.6]:e===4?[0,.14,1]:A,o=e===1||e===4?.8:.75,a=e===1||e===4?.19:.14,n=h=>e===0?h<.3?[.75,.55,1]:h<.5?[.1,.25,.6]:L:e===1?h>.68?L:[.7,.75,.55]:e===4?h>.7?L:h>.34&&h<.46?[.9,.85,.5]:[0,.12,1]:h>.62?L:A;ce(t,[[0,0,-.28,.02],[0,0,-.14,.055],[0,.005,.05,.065],[0,.01,.2,.045],[0,.012,.3,.012]],5,h=>e===2&&h===4?Nt:c);for(const h of[1,-1]){const m=[.001,.2,.4,.58,o],r=m.map(w=>{const i=w/o,v=.1+.07*Math.sin(i*Math.PI*.9)-(e===0?.12*i*i:.04*i),u=v-a*(1-.35*i*i)*1.6,b=n(w);return[t.v(h*w,.02,v,b,void 0,0,0,[h*w,0,0,0]),t.v(h*w,.03,(v+u)/2,b,void 0,0,0,[h*w,0,0,0]),t.v(h*w,.02,u,b,void 0,0,0,[h*w,0,0,0])]});for(let w=0;w<r.length-1;w++)for(let i=0;i<2;i++)h>0?t.quad(r[w][i],r[w+1][i],r[w+1][i+1],r[w][i+1]):t.quad(r[w][i+1],r[w+1][i+1],r[w+1][i],r[w][i]);if(e<2||e===4)for(let w=0;w<4;w++){const i=.06-w*.065-(e===0?.12:.04),v=-.25+w*.24,u=.2-w*.02,b=o-.03,f=b+Math.cos(v)*u,s=i-Math.sin(v)*u,M=t.v(h*b,.02,i+.025,L,void 0,0,0,[h*b,0,0,0]),N=t.v(h*b,.02,i-.025,L,void 0,0,0,[h*b,0,0,0]),k=t.v(h*f,.03,s,L,void 0,0,0,[h*f,0,0,0]);h>0?t.tri(M,k,N):t.tri(N,k,M)}}{const h=e===0?[1,.15,1]:e===1?[.7,.75,.55]:e===4?[.25,.3,1]:A,m=e===0?.36:.26,r=e===0?.11:-.03,w=t.v(-.04,.005,-.24,h),i=t.v(.04,.005,-.24,h),v=t.v(.14,.005,-.24-m,h,void 0,0,0,[0,1,0,0]),u=t.v(0,.005,-.24-m+r,h,void 0,0,0,[0,1,0,0]),b=t.v(-.14,.005,-.24-m,h,void 0,0,0,[0,1,0,0]);t.tri(w,i,u),t.tri(i,v,u),t.tri(w,u,b)}return t.build("aW")},$a=()=>{const e=new ee,t=[1,0,0],c=.9;ce(e,[[0,0,-.36,.012],[0,0,-.24,.05],[0,.006,-.05,.08],[0,.008,.1,.072],[0,.01,.22,.047]],7,t,!1,[0,0,0,2]),ce(e,[[0,.01,.2,.047],[0,.012,.45,.042],[0,.012,.7,.04],[0,.014,.86,.042],[0,.016,.92,.06],[0,.012,.975,.052]],5,t,!1,[0,0,1,3]);const o=[A,[.3,0,0],L,L];ce(e,[[0,.01,.96,.046],[0,-.005,1.03,.042],[0,-.05,1.085,.036],[0,-.11,1.11,.012]],4,n=>o[n],!0,[0,0,1,4]);for(const n of[-1,1])ce(e,[[n*.026,-.012,-.28,.026],[n*.026,-.016,-.6,.022],[n*.028,-.018,-.84,.022],[n*.03,-.018,-.9,.034],[n*.03,-.016,-.96,.014]],3,t,!0,[0,0,1,5]);const a=[[0,.016],[.25,.042],[.62,.032],[1,.012]];for(const n of[1,-1]){const d=[.02,.14,.28,.42,.55,.68,.8,c].map(m=>{const r=m/c,w=J(.48,.25,Math.pow(r,1.3)),i=.2+.045*Math.sin(r*Math.PI*.9)-.07*r*r;return a.map(v=>e.v(n*m,v[1],i-w*v[0],t,void 0,0,0,[n*m,0,0,v[0]]))});for(let m=0;m<d.length-1;m++)for(let r=0;r<3;r++)n>0?e.quad(d[m][r],d[m+1][r],d[m+1][r+1],d[m][r+1]):e.quad(d[m][r+1],d[m+1][r+1],d[m+1][r],d[m][r]);const p=d[d.length-1],h=e.v(n*(c+.1),.014,0,t,void 0,0,0,[n*(c+.1),0,0,.55]);for(let m=0;m<3;m++)n>0?e.tri(p[m],h,p[m+1]):e.tri(p[m+1],h,p[m])}return e.build("aW")},oa={value:6},sa={value:new l.Vector3},je=(e,t={})=>new l.ShaderMaterial({uniforms:{...q.shared,uAlt:z.uniforms.uAlt,uH:z.uniforms.uH,uLean:z.uniforms.uLean,uBufH:z.uniforms.uBufH,uMinPx:t.minPx||oa,uBubble:{value:t.bubble??7.5},uCentre:t.centre||{value:new l.Vector3},uFwd:{value:new l.Vector3(0,0,1)},uRight:{value:new l.Vector3(1,0,0)},uShow:{value:1},uBank:{value:0},uPitch:{value:t.pitch??0},uFlap:t.flap||{value:new l.Vector3(0,1,0)},uBars:{value:t.bars??0},uSolid:{value:t.solid??0}},defines:e,vertexShader:Mo,fragmentShader:t.frag||zo,side:l.DoubleSide,fog:!1,toneMapped:!1}),Ve=(e,t,c,o)=>{const a=new l.InstancedBufferGeometry;a.index=e.index;for(const h in e.attributes)a.setAttribute(h,e.attributes[h]);const n=new Float32Array(t*4),d=new Float32Array(t*4);for(let h=0;h<t;h++)o(h,n,d);a.setAttribute("iA",new l.InstancedBufferAttribute(n,4)),a.setAttribute("iB",new l.InstancedBufferAttribute(d,4)),a.instanceCount=t;const p=new l.Mesh(a,c);return p.frustumCulled=!1,p},na=gt(0),Za=Math.round((ie==="raptor"?300:60)*G(Z,.8,1.2));Ee.add(Ve(na,Za,je({}),(e,t,c)=>{const o=e%5===0?g.range(24,44):g.range(46,118);t.set([o,g()*P,g()*ae,g.range(9,13)/o],e*4),c.set([g(),g.range(1,1.2),0,0],e*4)})),Ee.add(Ve(gt(1),24,je({},{bars:1}),(e,t,c)=>{const o=g.range(40,125);t.set([o,g()*P,g()*ae,g.range(8,11)/o],e*4),c.set([g(),g.range(1.05,1.25),0,0],e*4)})),Ee.add(Ve(gt(2),14,je({GULL:1},{centre:sa,bubble:0}),(e,t,c)=>{t.set([g.range(10,46),g()*P,g.range(7,30),g.range(.25,.6)*(e%2?1:-1)],e*4),c.set([g(),g.range(1,1.3),.25,0],e*4)})),await x.yield();const ia={value:3.2},ra=(e,t,c)=>new l.ShaderMaterial({uniforms:{...q.shared,uBufH:z.uniforms.uBufH,uBox:{value:t},uMinPx:ia,uWind:{value:c}},defines:e,vertexShader:Ao,fragmentShader:No,side:l.DoubleSide,fog:!1,toneMapped:!1});{const e=new ee;for(const a of[1,-1]){const n=e.v(0,0,.12,L),d=e.v(a*.5,0,-.06,L),p=e.v(a*1,0,-.42,L),h=e.v(a*.42,0,-.2,L),m=e.v(0,0,-.14,L);e.tri(n,d,m),e.tri(d,h,m),e.tri(d,p,h)}{const a=e.v(0,.02,.3,L),n=e.v(.06,0,0,L),d=e.v(0,0,-.5,L),p=e.v(-.06,0,0,L);e.quad(a,n,d,p)}const t=Math.round(150*J(.6,1,G((te-.6)/.4,0,1)));Ee.add(Ve(e.build(),t,ra({SWIFT:1},64,new l.Vector3),(a,n,d)=>{n.set([g()*64,g()*64,g()*64,g.range(15,24)],a*4),d.set([g(),.21,g()*P,0],a*4)}));const c=new ee;c.quad(c.v(-.5,-.5,0,A),c.v(.5,-.5,0,A),c.v(.5,.5,0,A),c.v(-.5,.5,0,A));const o=Math.round(600*J(.6,1,G((te-.6)/.4,0,1))*G(Z,.85,1.15));Ee.add(Ve(c.build(),o,ra({},46,new l.Vector3(V?-2.4:-.5,.9,.2)),(a,n,d)=>{n.set([g()*46,g()*46,g()*46,0],a*4),d.set([g(),g.range(.07,.13),0,0],a*4)}))}await x.yield();const Pe=[0,1,2].map(e=>{const t=z.makeSoloStork({flap:1,legs:.75,seed:.13+e*.29});return O.add(t),{m:t,lead:[9,11.5,14][e],lat:[-.4,2.3,4.6][e],up:[-1.6,-1.2,-1.9][e]}}),Be=z.makeSoloStork({flap:0,legs:0,seed:.61});Be.scale.setScalar(1.25),Be.visible=!1,O.add(Be);const Ne=Fe(x.core.hashSeed("stork-kettle-lane:"+(x.seed??0))),vt=[2.5,8],Ya=8,he=Oa(2),Me=E.length-Ct,Qa=6,Ja=3.5,lt=[];{let e=0;for(let o=0;o<Ya;o++){const a=Ne.range(.5,2)*(o%2?1:-1),n=(o%4<2?1:-1)*X,d=Ne.range(-3.6,-1.5),p=n*Math.max(Ne.range(1.5,3.6),Math.sqrt(Math.max(9-d*d,0))),h=z.makeSoloStork({flap:0,legs:Ne.chance(.3)?.5:0,seed:Ne()});h.visible=!1,O.add(h);const m=(vt[1]-vt[0])/Math.abs(a),r=(Math.hypot(p,d)+Ja)/Math.hypot(p,d);lt.push({m:h,dv:a,lat:p*r,up:d*r,dwell:m,at:e,ph:Ne()*P,wp:Ne.range(.25,.45),size:Ne.range(1.22,1.34)}),e+=m*.85}const t=e,c=Ne()*t;for(const o of lt)o.T=t,o.at+=c,o.P=Math.abs(o.dv)*t,o.back=Math.min(6+.1*o.P,12),o.front=o.P-o.back}const $e=Fe(x.core.hashSeed("stork-kettle-ownlane:"+(x.seed??0))),bt=3,la=(Pe[2].lead-Pe[0].lead)/4,Re=[],eo=[...Pe.map(e=>e.m),...lt.map(e=>e.m)];{const e=Pe[0].m.geometry.attributes.position;let t=0,c=0;for(let a=0;a<e.count;a++)t=Math.min(t,e.getX(a)),c=Math.max(c,e.getX(a));for(let a=1;a<=bt;a++){const n=z.makeSoloStork({flap:0,legs:$e.chance(.3)?.5:0,seed:$e()});n.visible=!1,O.add(n),Re.push({m:n,at:a*z.spacing+$e.range(-la,la),size:$e.range(1.22,1.34),ph:$e()*P,wp:$e.range(.25,.45)})}const o=3*(c-t)*Math.max(...Re.map(a=>a.size));for(let a=0;a<bt;a++){const n=Re[a];n.room=2*(c-t)*n.size;const d=n.at-(a?Re[a-1].at:0),p=(a<bt-1?Re[a+1].at:(bt+1)*z.spacing)-n.at;n.amp=Math.max(Math.min(d,p)-o,0)/2}}const Pt=[0,1,2,3].map(e=>{if(e===1)return Be;const t=z.makeSoloStork({flap:0,legs:e===2?.5:0,seed:.27+e*.17});return t.visible=!1,O.add(t),t}),ha=[[3,.822,.972,7.6,-4.3,-1.5,-10.8,-2.6,-9.6,-4.4,-.12,.42,.5,1.3],[0,.84,.985,8.4,4.9,-2,11.6,.6,9.2,-6.2,.1,.5,0,1.25],[2,.905,.992,8.8,-6,1.9,-11.6,.4,-9.4,6.8,-.14,-.45,-.4,1.25]],ca=je({FORM:1},{bubble:0}),ht=Ve(na,1,ca,(e,t,c)=>{t.set([0,0,0,0],0),c.set([.43,1.3,0,0],0)});ht.visible=!1,O.add(ht);{const e=Fe(x.core.hashSeed("stork-kettle-buzzards:"+(x.seed??0)));Ee.add(Ve(gt(4),2,je({NEARLANE:1},{bubble:4.2,bars:-1,solid:.55}),(t,c,o)=>{const a=z.laneRadius+(t?-1:1)*e.range(2.5,6.5);c.set([a,e()*P,e.range(3.2,5.5),e.range(8.5,11)/a],t*4),o.set([e(),e.range(1.4,1.6),0,0],t*4)}))}const da={value:new l.Vector3(.1,.4,2.2)},fa={value:36},ua=G(H.mood??.5,0,1);let He=null,ct=null;const be={o:new l.Vector3,c:new l.Vector3,k:17/14,d:0};if(_.rare){ct=je({FORM:1,FLAM:1},{bubble:0,flap:da,pitch:0,frag:So,minPx:fa});const e=Fe("stork-kettle-flamingos:"+(x.seed??0));He=Ve($a(),40,ct,(d,p,h)=>{const m=d<14?0:d<27?1:2,r=d-[0,14,27][m],w=Math.ceil(r/2),i=r%2?1:-1,v=Math.min(w,1);p.set([i*w*4.5+e.range(-.25,.25)*v,e.range(-.4,.4)*v-m*.8,-(.9*w+.12*w*w)+e.range(-.3,.3)*v-m*15,0],d*4),h.set([e(),e.range(1.74,1.86),1,0],d*4)}),He.visible=!1,O.add(He),be.d=Ft(24);const t=E.tangentAtDist(be.d,new l.Vector3).setY(0).normalize(),c=new l.Vector3(-t.z,0,t.x),o=(105+(ua-.5)*8)*Je,a=e()*P,n=e.range(0,20);be.o.set(Math.sin(a)*n,E.posAtDist(be.d,new l.Vector3).y-25-(ua-.5)*3,-Math.cos(a)*n),be.c.copy(t).multiplyScalar(Math.cos(o)).addScaledVector(c,Math.sin(o)),ct.uniforms.uFwd.value.copy(be.c),ct.uniforms.uRight.value.crossVectors(pt,be.c).normalize()}me.add(new l.Mesh(ve.build(),rt));for(const e of[me,Ce,st,Ee,ht])q.ink(e);if(He&&q.ink(He),await x.yield(),x.renderer&&x.renderer.compile){const e=x.renderer,t=e.getRenderTarget(),c=new l.WebGLRenderTarget(1,1,{depthBuffer:!1}),o=new l.PerspectiveCamera;o.layers.set(q.layer);let a=null;try{e.setRenderTarget(c),e.compile(Pe[0].m,o,O),a=e.properties.get(Pe[0].m.material).currentProgram}catch{a=null}e.setRenderTarget(t),c.dispose();for(let n=0;a&&n<300;n++){let d=!0;try{d=a.isReady()}catch{}if(d)break;await x.frame()}await x.yield()}const we=E.length,dt=new l.Vector3,xt=new l.Vector3,pa=new l.Vector3,Oe=new l.Vector3,C=new l.Vector3,xe=new l.Vector3,fe=new l.Vector3,kt=new l.Vector3,Ke=new l.Vector3,yt=new l.Matrix4,To=new l.Quaternion,Lo=new l.Euler,U=new l.Vector3,Rt=(e,t,c)=>{Ke.copy(t).normalize(),fe.crossVectors(pt,Ke).normalize(),kt.crossVectors(Ke,fe),xe.copy(fe).multiplyScalar(Math.cos(c)).addScaledVector(kt,Math.sin(c)),kt.multiplyScalar(Math.cos(c)).addScaledVector(fe,-Math.sin(c)),fe.copy(xe),yt.makeBasis(fe,kt,Ke),e.quaternion.setFromRotationMatrix(yt)},to=e=>Wa(e)-z.altitudeAt(e),ft=new l.Vector3,ma=new l.Vector3,Ot=(e,t,c,o,a,n,d,p)=>{const h=G(t,0,we-.01);E.posAtDist(h,C),E.tangentAtDist(h,U),E.tangentAtDist(Math.min(h+6,we),xe);const m=(xe.z*U.x-xe.x*U.z)/6;fe.set(-U.z,0,U.x).normalize(),e.position.copy(C).addScaledVector(fe,c),e.position.y+=o,U.addScaledVector(fe,a),U.y+=n,e.scale.setScalar(Math.max(p,.001)),Rt(e,U,Math.atan(196*m/9.81)+d)},wa=Ft(13),Mt=Ft(17),ao=E.posAtDist(Mt+4,new l.Vector3).y-1.2,ga={pitch:-58*Je,yaw:50*Je},Ze=new l.Vector3,va=new l.Vector3,Se=new l.Vector3,St=new l.Vector3,ut=new l.Vector3,Ye=new l.Vector3,oo=new l.Vector3,Ge=new l.Vector3,so=new l.Vector3,ba=new l.Vector3,no=(e,t,c)=>{const o=G((c-e)/(t-e),0,1);return .4*o+.6*o*o*(3-2*o)},io=30,xa=[300,600],ro=e=>{E.tangentAtDist(e,Ge);const t=Math.max(Ge.z/Math.max(Math.hypot(Ge.x,Ge.z),1e-6),0);return J(12.5,io,t*t*(3-2*t)*y(xa[0],xa[1],z.altitudeAt(e/we)-W))},lo=(e,t)=>{const c=G(e,0,1);E.pointAt(c,t);const o=Math.atan2(t.x,-t.z)+.606;return t.set(33*Math.sin(o),t.y-ro(c*we),-33*Math.cos(o))},Kt=(()=>{const e=Math.ceil(we)+2,t=new Float32Array(e),c=E.tangentAtDist(0,new l.Vector3),o=new l.Vector3;for(let a=1;a<e;a++)E.tangentAtDist(Math.min(a,we),o),t[a]=t[a-1]+Math.atan2(o.z*c.x-o.x*c.z,c.x*o.x+c.z*o.z)/Je,c.copy(o);return t})(),ho=e=>{const t=G(e,0,Kt.length-1.001),c=Math.floor(t);return J(Kt[c],Kt[c+1],t-c)},ka=e=>y(0,30,ho(e)),ya=(()=>{let e=0,t=1e9;for(let c=0;c<=he+30;c+=.25){E.posAtDist(c,Ge);const o=(Ge.x-$.x)**2+(Ge.z-$.z)**2;o<t&&(t=o,e=c)}return e})(),Ma=e=>y(-60,-40,e-ya)*(1-y(-30,10,e-ya)),Sa={at:new l.Vector3($.x-.5,$.y+14.6,$.z),weight:.42},co={weight:.5},zt=24,za=Ct,fo=(e,t,c)=>{for(let o=0;o<40;o++){const a=(t+c)/2;e(a)?c=a:t=a}return(t+c)/2},Aa=e=>(1-fo(t=>z.altitudeAt(t)>e,.5,z.top.u))*E.length,Na=Aa((z.funnel.y0+z.funnel.y1)/2),uo=Aa(z.funnel.y1)-zt/2,po=za+zt,mo=za,Ta=e=>{const t=G((Na-e)/(Na-uo),0,1);return .55*t+.45*t*t*(3-2*t)},La=e=>no(po,mo,e),wo=(e,t)=>{const c=G(t,0,1),o=c*E.length,a=E.length-o;E.posAtDist(o,Ze),E.tangentAtDist(o,Se),Se.y=0,Se.lengthSq()<1e-8&&Se.set(0,0,1),Se.normalize(),St.set(-Se.z,0,Se.x),E.posAtDist(o+zt,va),ut.subVectors(va,Ze).normalize();const n=Ma(o)*Sa.weight,d=ka(o+zt)*co.weight;Ye.copy(ut).multiplyScalar(1-n).addScaledVector(oo.copy(Sa.at).sub(Ze).normalize(),n).normalize(),Ye.multiplyScalar(1-d).addScaledVector(lo(c,so).sub(Ze).normalize(),d).normalize();const p=Ta(a),h=La(a);if(p<=0&&h<=0)return ba.copy(Ye).multiplyScalar(60).add(Ze);const m=Math.atan2(Ye.dot(St),Ye.dot(Se)),r=Math.asin(G(Ye.y,-1,1)),w=Math.atan2(ut.dot(St),ut.dot(Se)),i=Math.asin(G(ut.y,-1,1)),v=J(J(m,ga.yaw,p),w,h),u=J(J(r,ga.pitch,p),i,h),b=Math.cos(u);return ba.copy(Se).multiplyScalar(Math.cos(v)*b).addScaledVector(St,Math.sin(v)*b).setY(Math.sin(u)).multiplyScalar(60).add(Ze)};function Fa(e,t,c,o){const a=G(o??0,0,1);qe.position.y=to(a),z.setEscort(J(.92,1.3,y(.15,.62,a)),46*a),z.update(e,t,c);const n=a*we,d=Ta(we-n),p=La(we-n);z.setStair(ka(n)*(1-y(.05,.6,d)),y(.1,.7,d)*(1-y(.25,.85,p))),z.setRing(y(.3,.85,p)),z.setCalm(y(0,.3,d)*(1-y(.75,1,p))),Zt.value=y(0,.4,d)*(1-y(.5,1,p)),$t.value=y(.3,1,d);const h=z.uniforms.uAlt.value,m=z.uniforms.uBufH.value;z.uniforms.uUnder.value=J(.13,.2,y(940,1100,h)),Xt.value=y(9,28,we-n),oa.value=6*m/450,ia.value=3.2*m/450,fa.value=36*m/450,da.value.z=2.2*m/450;const r=c.matrixWorld.elements;if(dt.set(r[12],r[13],r[14]),xt.set(r[0],r[1],r[2]).normalize(),pa.set(r[4],r[5],r[6]).normalize(),Oe.set(-r[8],-r[9],-r[10]).normalize(),ft.copy(Oe),ft.y<-.2){const f=Math.sqrt(.96)/Math.max(Math.hypot(Oe.x,Oe.z),1e-4);ft.set(Oe.x*f,-.2,Oe.z*f)}ma.crossVectors(xt,ft).normalize();const w=y(At[0],At[1],h);for(let f=0;f<ea.length;f++){const s=ea[f],M=s.x+s.dx*s.v*t,N=s.z+s.dz*s.v*t;s.mesh.position.set(M,W+.5*Math.sin(t*.5+f),N),s.mesh.rotation.z=.02*Math.sin(t*.6+f*2);const k=Math.hypot(M-dt.x,W+qe.position.y-dt.y,N-dt.z),T=J(1,Math.max(1,k/et),w);s.mesh.scale.set(T,T*J(1,1.5,w*y(et,2*et,k)),T),Et.value[f].set(M,N,s.dx,s.dz),f===8&&sa.value.set(M-s.dx*14,W+5,N-s.dz*14)}for(let f=0;f<2;f++){const s=Qt[f],M=(t/7.5+s.seed)%1;let N=y(0,.08,M)*(1-y(.42,.56,M));f===0&&(N=Math.max(N,Ma(n))),s.neck.rotation.x=-N*1.9+N*.1*Math.sin(t*36+f)+.06*Math.sin(t*.9+f*2)}const i=y(.35,.97,p);for(let f=0;f<It.length;f++){const s=It[f],M=(t*s.sp+s.off)%24/24,N=y(0,.16,M)*(1-y(.84,1,M))*i;C.copy(s.home).addScaledVector(aa,(12-24*M)*s.run);const k=Math.min(1,N*6);yt.compose(C,s.q,U.set(s.r*s.len*(.25+.75*N)*k+1e-4,s.r*.3*k+1e-4,s.r*.9*s.sy*N+1e-4)),Ue.setMatrixAt(f,yt)}Ue.instanceMatrix.needsUpdate=!0;const v=y(.12,.24,a),u=1-y(.22,.27,a);for(let f=0;f<3;f++){const s=Pe[f],M=n+s.lead+v*24;E.posAtDist(M,C),E.tangentAtDist(M,U),fe.crossVectors(U,pt).normalize(),C.addScaledVector(fe,s.lat*(1+v)),C.y+=s.up+v*17+.3*Math.sin(t*2.1+f*2.2),s.m.position.copy(C),s.m.scale.setScalar(Math.max(u,.001)),s.m.visible=u>.001,U.y+=.5+.15*v,Rt(s.m,U,.5*y(.085,.14,a))}for(let f=0;f<lt.length;f++){const s=lt[f],M=Math.abs(s.dv),N=(((t-s.at)*M+(s.dv<0?s.front-vt[1]:vt[0]+s.back))%s.P+s.P)%s.P,k=s.dv<0?s.front-N:N-s.back,T=n+k,B=y(s.front-7,s.front,k),I=y(he-30,he+25,T),K=y(Me-30,Me+10,T),Q=(1-y(s.front-1.5,s.front,k))*y(-s.back,-s.back+2,k)*y(he-30,he-22,T)*(1-y(Me,Me+10,T));if(s.m.visible=Q>.002,!s.m.visible)continue;const oe=s.lat+.35*Math.sin(t*s.wp+s.ph),se=s.up+.25*Math.sin(t*s.wp*1.7+s.ph*2)+8*B-14*(1-I)+16*K,ke=Math.max(Math.hypot(oe,se),.001),Te=Math.max(ke,Qa)/ke;Ot(s.m,T,oe*Te,se*Te,.05*Math.cos(t*s.wp+s.ph),.3*(1-I)-.12*B+.2*K,.06*Math.sin(t*.9+s.ph*3),s.size*Q),s.m.material.uniforms.uSolo.value.x=1-I}for(let f=0;f<Re.length;f++){const s=Re[f],M=n+s.at+s.amp*Math.sin(t*s.wp+s.ph),N=y(he,he+55,M),k=y(Me-30,Me+10,M),T=y(he,he+8,M)*(1-y(Me,Me+10,M));if(s.m.visible=T>.002,!!s.m.visible){Ot(s.m,M,.3*Math.sin(t*s.wp*.8+s.ph*2),.2*Math.sin(t*s.wp*1.7+s.ph*3)-14*(1-N)+16*k,.05*Math.cos(t*s.wp+s.ph),.3*(1-N)+.2*k,.06*Math.sin(t*.9+s.ph*3),s.size*T),s.m.material.uniforms.uSolo.value.x=1-N,E.tangentAtDist(G(M,0,we),xe),Ke.set(0,0,0);for(const B of eo){if(!B.visible)continue;C.subVectors(s.m.position,B.position);const I=C.dot(xe);if(C.lengthSq()>=s.room*s.room)continue;C.addScaledVector(xe,-I);const K=C.length();K<.001?C.set(0,-1,0):C.divideScalar(K),Ke.addScaledVector(C,Math.sqrt(s.room*s.room-I*I)-K)}s.m.position.add(Ke)}}for(let f=0;f<Pt.length;f++)f!==1&&(Pt[f].visible=!1);let b=!1;for(let f=0;f<ha.length;f++){const s=ha[f],M=(a-s[1])/(s[2]-s[1]);if(M<=0||M>=1)continue;const N=Pt[s[0]],k=1-y(0,.25,M),T=y(.75,1,M),B=(M-.5)*.9*Math.sign(s[8]-s[6]),I=s[4]+(s[6]-s[4])*k+(s[8]-s[4])*T+B+.12*Math.sin(t*.7+f*2.1),K=s[5]+(s[7]-s[5])*k+(s[9]-s[5])*T+.14*Math.sin(t*1.1+f*1.3);N.position.copy(dt).addScaledVector(Oe,s[3]+.3*Math.sin(t*.4+f*2)).addScaledVector(xt,I).addScaledVector(pa,K),C.copy(ft).addScaledVector(xt,s[10]).addScaledVector(ma,s[11]+.03*Math.sin(t*.6+f)),Rt(N,C,s[12]+.05*Math.sin(t*.9+f*1.7)),N.scale.setScalar(s[13]),N.visible=!0,s[0]===1&&(b=!0)}{const f=3-.07*(n-wa),s=n+f,M=.16*(s-wa-3)/7,N=Math.tanh(M),k=y(-6,-4,f)*(1-y(14,16,f))*y(he-30,he-22,s),T=y(he-30,he+25,s);Be.visible=k>.002,Be.visible&&(Ot(Be,s,-7*N+.1*Math.sin(t*.7),-1.9+.1*Math.sin(t*1.3)-14*(1-T),-.16*(1-N*N),.3*(1-T),.05*Math.sin(t*.9),1.25*k),Be.material.uniforms.uSolo.value.x=1-T)}{const f=Mt+5.5-.6*(n-Mt),s=f-n,M=Math.tanh(.825*(f-Mt-7.3)/12),N=y(-9,-5,s)*(1-y(60,75,s))*y(he-10,he+10,f)*(1-y(Me-10,Me,f));if(ht.visible=N>.002,ht.visible){const k=ca.uniforms,T=G(f,0,we);E.posAtDist(T,C),E.tangentAtDist(T,U),U.y=0,U.normalize(),fe.set(-U.z,0,U.x),k.uCentre.value.copy(C).addScaledVector(fe,12*M),k.uCentre.value.y=ao,xe.copy(U).addScaledVector(fe,.825*(1-M*M)).multiplyScalar(-1).normalize(),k.uFwd.value.copy(xe),k.uRight.value.crossVectors(pt,xe).normalize(),k.uBank.value=.6,k.uShow.value=N}}if(He){const f=(n-be.d)*be.k,s=ct.uniforms;He.visible=Math.abs(f)<160,He.visible&&(s.uCentre.value.copy(be.o).addScaledVector(be.c,f+20),s.uBank.value=0,s.uShow.value=y(-160,-130,f)*(1-y(130,160,f)))}}return Fa(0,0,{matrixWorld:new l.Matrix4().setPosition(E.pointAt(0))},0),{scene:O,path:E,duration:qt,pace:Lt,camera:{fov:62,near:.3,far:18e3,lookAhead:24,sway:.6,bank:.36},pois:[{at:wo,from:0,to:1,weight:1,fade:.02}],portal:{shape:"circle",radius:7,color:"#FF6EC0",glow:1,tilt:!0,revealDistance:190},post:{exposure:3,bloom:{strength:.3,radius:.5,threshold:1.1},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:0,grain:0,aberration:0}},ride:"great-bird",style:"none",companion:"none",update:Fa,dispose(){z.dispose()}}}};export{Bo as default};
