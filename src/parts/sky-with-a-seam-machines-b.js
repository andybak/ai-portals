import*as i from"three";import{SHELL as K,SWELL as te,LAMP_LIGHT as xe,PAINTS as ge,GLSL_SHADOW as ye,SHADOW as se,SEA_BODY as fe}from"./sky-with-a-seam.js";const oe=Math.PI/180,v=e=>{const c=String(Math.round(e*1e4)/1e4);return/[.e]/.test(c)?c:c+"."},J=[Math.sin((te.from+180)*oe),-Math.cos((te.from+180)*oe)],ie=2*Math.PI/te.length,ue=Math.sqrt(9.81*ie),ae=`
uniform float uSeaTime; uniform vec2 uSeaCentre;
float seaEase(vec2 xz){ return 1. - smoothstep(150., 360., length(xz - uSeaCentre)); }
float seaY(vec2 xz){ return ${v(te.height/2)} * sin(${v(ie)} * dot(xz, vec2(${v(J[0])}, ${v(J[1])})) - ${v(ue)} * uSeaTime) * seaEase(xz); }
`,de=e=>({uSeaTime:e&&e.uniforms&&e.uniforms.uTime||{value:0},uSeaCentre:e&&e.uniforms&&e.uniforms.uCentre||{value:new i.Vector2}}),re=`
#include <fog_pars_fragment>
float layerFog(){
  #ifdef USE_FOG
    return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    return 0.;
  #endif
}
vec3 layerFogColor(){
  #ifdef USE_FOG
    return fogColor;
  #else
    return vec3(0.);
  #endif
}`,le=12,be=[1,4,7,10],ee={round:18,feather:14,wobble:6,top:10,mist:6},Ae=[.085,.05],ce={wide:.004,pace:8,hold:.05,drops:12,lane:.04,head:.02,dim:.3},Re=e=>le-((e||1)<.9?be.length:0),me=(e,c=le)=>{const r=ce,u=le/c,F=r.lane/u,t=r.pace*r.hold,m=e*Math.PI/(4*c),M=1/(r.drops*F*m),w=(.7*t-r.head/2)/M;return{share:u,lane:F,len:t,depth:m,gap:M,fill:w,spray:.3*u,mean:r.wide/F*w*(1+r.dim)/2}},Q=e=>{const c=String(Math.round(e*1e6)/1e6);return/[.e]/.test(c)?c:c+"."},ne=e=>e-Math.floor(e),pe=e=>Math.min(Math.max(e,0),1),he=(e,c,r)=>{const u=pe((r-e)/(c-e));return u*u*(3-2*u)},Se=(e,c)=>{let r=ne(e*.1031),u=ne(c*.1031),F=r;const t=r*(u+33.33)+u*(F+33.33)+F*(r+33.33);return r+=t,u+=t,F+=t,ne((r+u)*F)};function ve(e,c,r,u,F,t,m,M,w=me(M)){const b=ce,A=Se(e,u*7.3+3),x=Se(e+31,u*3.1+5),s=b.wide/2,N=Math.max(s,.5*F),P=ne((r+m*b.pace)/w.gap+x)*w.gap;return pe((N-Math.abs(c-(e+.2+.6*A)*w.lane))/F+.5)*(s/N)*he(0,b.head,P)*(1-he(.4*w.len,w.len,P))*(b.dim+(1-b.dim)*ne(A*61))*pe((t-ne(x*47))/.24+.5)}function Ye(e,c,r,u,F,t,m,M,w=me(M)){const b=N=>{const P=Math.max(N,0);return P<1?.5*P*P:P-.5},A=Math.floor(e/w.lane),x=w.mean*.24*(b(t/.24+.5)-b((t-1)/.24+.5)),s=(1-he(.4*w.lane,1.2*w.lane,u))*(1-he(.5*w.len,1.5*w.len,F));return{mean:x,res:s,streaks:ve(A-1,e,c,r,u,t,m,M,w)+ve(A,e,c,r,u,t,m,M,w)+ve(A+1,e,c,r,u,t,m,M,w)}}const we=e=>`
float rainIn(vec2 p){ vec2 q = abs(p) - ${v(e.RAIN.side/2-ee.round)};
  return ${v(ee.round)} - length(max(q, 0.)) - min(max(q.x, q.y), 0.) - ${v(ee.wobble)} * mvn(p / 9. + 3.); }
float rainRim(vec2 p){ return smoothstep(0., ${v(ee.feather)}, rainIn(p)); }`,ke=`
uniform vec2 uRain, uAxis; attribute vec3 aFace; varying vec3 vL, vFace, vW;
#include <fog_pars_vertex>
void main(){
  vL = position; vFace = aFace;
  vec3 wp = vec3(uRain.x + uAxis.x * position.x + uAxis.y * position.z, position.y, uRain.y + uAxis.y * position.x - uAxis.x * position.z); vW = wp;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Le=`
vec3 bowBand(float t){ t = clamp(t, 0., 1.);                                        // 0 violet (inside) to 1 red (outside)
  return vec3(smoothstep(.38, .78, t) + .35 * (1. - smoothstep(.0, .22, t)), 1. - abs(t - .52) * 2.6, 1. - smoothstep(.12, .5, t)) * smoothstep(0., .12, t) * (1. - smoothstep(.9, 1., t)); }
// the bow's colour on the eye's ray to a place (the part's BOW law)
vec3 bowAt(vec3 w, vec3 lamp){
  float ang = degrees(acos(clamp(dot(normalize(w - cameraPosition), normalize(cameraPosition - lamp)), -1., 1.)));
  return bowBand((ang - 40.1) / 2.5) + .3 * bowBand((53.4 - ang) / 3.4) + vec3(.06) * (1. - smoothstep(38., 40.6, ang)); }
`,De=e=>`
uniform vec2 uRain, uAxis; uniform vec3 uLamp, uVeil, uBowCol, uFoam; uniform float uTime, uBow;
varying vec3 vL, vFace, vW;
const float HS = ${v(e.RAIN.side/2)}, HT = ${v(e.RAIN.height-.6)};
${e.GLSL_VN}
${re}
${Le}
${we(e)}
void main(){
  vec3 C = cameraPosition - vec3(uRain.x, 0., uRain.y), ro = vec3(dot(C.xz, uAxis), C.y, dot(C.xz, vec2(uAxis.y, -uAxis.x)));
  vec3 rd = vL - ro; float t0 = max(length(rd), 1e-3); rd /= t0;
  vec3 rs = rd + (1. - step(1e-5, abs(rd))) * 1e-5;                                // (no division by zero)
  // the eye's way THROUGH the patch's inner part (the square drawn in by RAIN_RIM.mist m: at the rim the mist is none)
  vec3 hi = vec3(HS - ${v(ee.mist)}, HT, HS - ${v(ee.mist)}), lo = vec3(-hi.x, 0., -hi.z), ta = (hi - ro) / rs, tb = (lo - ro) / rs, tf = max(ta, tb), tn = min(ta, tb);
  float len = max(min(tf.x, min(tf.y, tf.z)) - max(max(tn.x, max(tn.y, tn.z)), 0.), 0.), front = step(dot(vFace, rd), 0.);
  float h = vL.x + vL.z * 1.37;
  float drift = mvn(vec2(h / 9., (vL.y + uTime * ${Q(ce.pace)}) / 26.)) * .6 + mvn(vec2(h / 3.1 + 5., (vL.y + uTime * ${Q(ce.pace)}) / 11.)) * .4;      // thick and thin rain, falling at the rain's one pace
  float topFade = 1. - smoothstep(HT - ${v(ee.top)}, HT - 1., vL.y);                // (none at the cloud's foot: the sprays have not yet joined)
  float a = (1. - exp(-.0045 * len)) * .42 * (.45 + 1.1 * drift) * topFade;            // THE MIST: thin, never a face
  float dep = 1. - exp(-len / 15.), fg = layerFog();
  vec3 col = mix(uVeil, layerFogColor(), fg) * a + uBowCol * bowAt(vW, uLamp) * uBow * dep * (.6 + .5 * drift) * (1. - fg);
  gl_FragColor = vec4(col, a) * front;
}`,$e=`
uniform vec2 uRain, uAxis; attribute vec2 aSheet; varying vec3 vW; varying vec3 vS; varying vec3 vL;
#include <fog_pars_vertex>
void main(){
  vec3 wp = vec3(uRain.x + uAxis.x * position.x + uAxis.y * position.z, position.y, uRain.y + uAxis.y * position.x - uAxis.x * position.z); vW = wp; vL = position;
  vS = vec3(aSheet.x, position.y, aSheet.y);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ne=(e,c)=>{const r=ce,u=me(e.RAIN.side,c);return`
uniform vec3 uLamp, uDrop, uBowCol, uFoam; uniform float uTime, uBow;
varying vec3 vW; varying vec3 vS; varying vec3 vL;
const float HT = ${v(e.RAIN.height-.6)};
// THE RAIN'S BODY (RAINFALL and rainBody, above): metres and seconds of the world, the same for every eye. LANE,
// MEAN and SPRAY are this build's layer's (THE SHARE, at RAINFALL: a layer of a lighter build carries more rain)
const float LANE = ${Q(u.lane)}, HALF = ${Q(r.wide/2)}, LEN = ${Q(u.len)}, GAP = ${Q(u.gap)}, PACE = ${Q(r.pace)}, HEAD = ${Q(r.head)}, DIM = ${Q(r.dim)}, MEAN = ${Q(u.mean)}, SPRAY = ${Q(u.spray)};
${e.GLSL_VN}
${re}
${Le}
${we(e)}
// ONE LANE'S STREAK at a place of a layer (s m across it, y m up), under a pixel fw m wide across the layer. c: the
// lane's number. The lane has its own place across (.2 to .8 of its width), its own turn in the gap, its own light
// (DIM to 1) and its own number between 0 and 1 by which it falls out toward the rim (it stands where V passes
// that number, softened over .24). The streak's line is HALF m in half width: where the pixel is wider it is drawn
// a pixel wide and carries ITS TRUE COVER, its width over the width drawn, whole
float streak(float c, float s, float y, float id, float fw, float V){
  float h1 = mh21(vec2(c, id * 7.3 + 3.)), h2 = mh21(vec2(c + 31., id * 3.1 + 5.));
  float hd = max(HALF, .5 * fw), u = fract((y + uTime * PACE) / GAP + h2) * GAP;                 // u: metres above the streak's head (its low end)
  return clamp((hd - abs(s - (c + .2 + .6 * h1) * LANE)) / fw + .5, 0., 1.) * (HALF / hd)
    * smoothstep(0., HEAD, u) * (1. - smoothstep(.4 * LEN, LEN, u))                              // the head whole, the tail thinning upward
    * (DIM + (1. - DIM) * fract(h1 * 61.)) * clamp((V - fract(h2 * 47.)) / .24 + .5, 0., 1.); }
float ramped(float t){ t = max(t, 0.); return t < 1. ? .5 * t * t : t - .5; }                    // (the sum of a ramp that rises from 0 to 1 over one step)
void main(){
  float id = vS.z, y = vS.y, rim = rainRim(vL.xz) * (1. - smoothstep(HT - ${v(ee.top)}, HT - 1., y));
  // (the rain falls aslant: every layer's lanes lean one way, by the wind's part along that layer)
  float s = vS.x + y * ((id < ${v(le-.5)} ? ${v(Ae[0])} : ${v(Ae[1])}) + .018 * sin(id * 1.7));
  float fw = max(length(vec2(dFdx(s), dFdy(s))), 1e-4), fy = length(vec2(dFdx(y), dFdy(y)));     // the pixel's footprint across the lanes and up them
  // THE LANES ARE FILTERED BY THE PIXEL'S FOOTPRINT TO THEIR OWN MEAN, and nothing of them is made by it. Where the
  // pixel is narrower than .4 of a lane the streaks are drawn as they stand: this lane's and its two neighbours',
  // which are all that a footprint up to 1.2 lanes wide can touch (a streak stands .2 of a lane clear of its
  // lane's sides), so the sum lays every streak's true cover whole. From there to 1.2 lanes (and where the pixel
  // grows taller than a streak is long) the rows are let go to THE STREAKS' OWN MEAN: MEAN times the share of
  // lanes that stand at this rim (the lanes' numbers lie evenly between 0 and 1, so that share is the ramp's own
  // sum between V - 1 and V). Far off a layer is a veil of that mean; near, it is streaks.
  float V = 1.25 * rim, c0 = floor(s / LANE);
  float st = MEAN * .24 * (ramped(V / .24 + .5) - ramped((V - 1.) / .24 + .5));
  float res = (1. - smoothstep(.4 * LANE, 1.2 * LANE, fw)) * (1. - smoothstep(.5 * LEN, 1.5 * LEN, fy));
  if (res > 0.) st = mix(st, streak(c0 - 1., s, y, id, fw, V) + streak(c0, s, y, id, fw, V) + streak(c0 + 1., s, y, id, fw, V), res);
  // THICK AND THIN RAIN: the rain falls in SHAFTS (more drops, fewer drops), 1.7 to 5 m across and tens of metres
  // long, drifting down every layer at the rain's one pace: .15 to 1 of the rain at its thickest, .575 on the
  // average (each noise is as often over a half as under it, and so is the step between .3 and .7). The finer
  // shafts are let go to their own mean, a half, as a pixel grows as wide as they are
  float yy = y + uTime * PACE, fine = mix(.5, mvn(vec2(s / 1.7 + id, yy / 22.)), 1. - smoothstep(.45, 1.7, fw));
  float thick = smoothstep(.3, .7, mvn(vec2(s / 5. + id * 3.7, yy / 45.)) * .5 + fine * .5);
  float a = min(st * (.15 + .85 * thick) * (.35 + .65 * rim), 1.);
  // the fine spray standing over the water at the layer's foot
  float top = .8 + 4.6 * mvn(vec2(vS.x / 2.4 + id * 5., uTime * .8 + id)), sk = (1. - smoothstep(.1, top, y)) * (.35 + .65 * mvn(vec2(vS.x / .9 + uTime * 1.3, y / .7 - uTime * 2.)));
  float fg = layerFog(), ask = sk * SPRAY * rainRim(vL.xz);
  vec3 col = uDrop * a + uBowCol * bowAt(vW, uLamp) * uBow * a * 1.4 + uFoam * ask;
  float aa = 1. - (1. - a) * (1. - ask);
  gl_FragColor = vec4(mix(col, layerFogColor() * aa, fg), aa);
}`},Pe=`
${ae}
uniform vec2 uRain, uAxis; varying vec2 vQ;
#include <fog_pars_vertex>
void main(){
  vec2 xz = vec2(uRain.x + uAxis.x * position.x + uAxis.y * position.z, uRain.y + uAxis.y * position.x - uAxis.x * position.z); vQ = position.xz;
  vec4 mvPosition = viewMatrix * vec4(xz.x, seaY(xz) + .05, xz.y, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,_e=(e,c)=>`
uniform float uTime; uniform vec3 uSea, uGlint; varying vec2 vQ;
${e.GLSL_VN}
${re}
${we(e)}
// (a line of half width w under a pixel fw wide: drawn a pixel wide at the least, it carries its width over the width drawn: its true cover, whole, at every footprint)
float mln(float d, float w, float fw){ float ww = max(w, .5 * fw); return clamp((ww - d) / fw + .5, 0., 1.) * (w / ww); }
// rings in cells cs m wide: every cell holds a ring that opens and dies, again and again. A ring's line is .09 cs
// wide; where a pixel is wider it is drawn 1.1 px wide and carries THE COVER IT TRULY HAS (its width over the width drawn)
float rings(vec2 q, float cs, float fw){
  vec2 p = q / cs, ip = floor(p), fp = fract(p) - .5; float hs = mh21(ip + cs), ph = fract(uTime * (.9 + hs) * min(1., 1.4 / cs + .35) + hs * 7.);
  float w0 = .045 * cs, w = max(w0, .55 * fw);
  return mln(abs(length(fp + (vec2(mh21(ip + 3.1), mh21(ip + 8.7)) - .5) * .3) - ph * .42) * cs, w, fw) * (w0 / w) * (1. - ph); }
// THE RINGS END AT THEIR OWN MEAN, not at none: over its cell and its whole life a ring of radius .42 ph cs, its line
// .09 cs wide, at strength 1 - ph, covers 2 pi * .42 * .09 * (the mean of ph (1 - ph): 1/6) = .0396 of the cell,
// whatever the cell's size (counted over a field of cells: 0.0397). Each size is let go to that as the pixel
// outgrows its cells (the ramps are the cells' own: from about a fifth of a cell to about seven tenths of it)
const float RING = .0396;
void main(){
  float fw = max(length(fwidth(vQ)), 1e-3), rim = rainRim(vQ);
  float ring = ${c?"0.":"mix(RING, rings(vQ, .6, fw), 1. - smoothstep(.1, .4, fw))"} + .9 * mix(RING, rings(vQ + 3.3, 2.6, fw), 1. - smoothstep(.5, 1.7, fw)) + .8 * mix(RING, rings(vQ + 7.1, 9., fw), 1. - smoothstep(2., 7., fw));
  float mott = mvn(vQ / 2.6 + vec2(uTime * .25, 0.)) * .6 + mvn(vQ / .8 - vec2(0., uTime * .6)) * .4;
  // A DULLED MIRROR: the sea's own colour laid thin and uneven over its mirror (roughened water), the rings a little
  // lighter on it; all of it comes on with the rain's rim (no straight edge, no flat field)
  float a = rim * clamp(.14 + .3 * mott + .45 * ring, 0., .6) * (1. - layerFog());
  gl_FragColor = vec4(mix(uSea, uGlint, clamp(.75 * ring + .25 * (mott - .5), 0., 1.)) * a, a);
}`;function ze(e,c,r){const u=c.RAIN,F=u.side/2,t=u.height-.6,m=r.look,M=ge[m],w=xe[m],b=c.rigAxes(r.route),A=new i.Color(M.fill).multiplyScalar(w.fill),x=new i.Color().setRGB(w.color[0],w.color[1],w.color[2]),s=(p,a)=>new i.Color(A.r+x.r*w.key*p,A.g+x.g*w.key*p,A.b+x.b*w.key*p).multiply(new i.Color().setRGB(a[0],a[1],a[2])),N={...i.UniformsUtils.clone(i.UniformsLib.fog),...de(r.sea),uRain:{value:new i.Vector2(r.route.rain.x,r.route.rain.z)},uAxis:{value:new i.Vector2(b.dir.x,b.dir.z)},uTime:{value:0},uLamp:r.sky.shadow.uLamp,uVeil:{value:s(.7,[.74,.79,.86])},uBowCol:{value:x.clone()},uBow:{value:.8},uDrop:{value:s(1,[.97,.98,1])},uFoam:{value:s(.95,[.88,.92,.96])},uSea:{value:new i.Color((r.sea.uniforms.uDeep||{}).value||(m?"#1c3048":"#0a3550")).lerp(new i.Color(M.haze),.34).multiply(s(.55,[1,1,1]))},uGlint:{value:new i.Color(M.haze).lerp(new i.Color("#ffffff"),.3).multiply(s(.8,[1,1,1]))}},P=(p,a,f={})=>new i.ShaderMaterial({uniforms:N,vertexShader:p,fragmentShader:a,fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:i.DoubleSide,...f}),B=(p,a)=>new i.Float32BufferAttribute(p,a),l=new i.Sphere(new i.Vector3(r.route.rain.x,40,r.route.rain.z),120),g=[],k=[],C=[];for(const[p,a]of[[1,0],[-1,0],[0,1],[0,-1]]){const f=g.length/3,L=($,T)=>{g.push(p*F+a*$*F,T,a*F+p*$*F),k.push(p,0,a)};L(-1,0),L(1,0),L(1,t),L(-1,t),C.push(f,f+1,f+2,f,f+2,f+3)}const n=new i.BufferGeometry;n.setAttribute("position",B(g,3)),n.setAttribute("aFace",B(k,3)),n.setIndex(C),n.boundingSphere=l;const O=new i.Mesh(n,P(ke,De(c)));O.renderOrder=3,O.name="rain-mist-and-bow";const G=[],d=[],S=[],o=le,h=Re(r.detail),E=h<o;for(let p=0;p<2;p++)for(let a=0;a<o;a++){if(E&&be.includes(a))continue;const f=p*o+a,L=-F+(a+.5+.3*Math.sin(f*2.4))*u.side/o,$=G.length/3;for(const[T,W]of[[-1,0],[1,0],[1,t],[-1,t]])p?G.push(L,W,T*F):G.push(T*F,W,L),d.push(T*F+f*17.3,f);S.push($,$+1,$+2,$,$+2,$+3)}const y=new i.BufferGeometry;y.setAttribute("position",B(G,3)),y.setAttribute("aSheet",B(d,2)),y.setIndex(S),y.boundingSphere=l;const R=new i.Mesh(y,P($e,Ne(c,h)));R.renderOrder=4,R.name="rain-streaks";const _=[],q=[],I=24;for(let p=0;p<=I;p++)for(let a=0;a<=I;a++)_.push((p/I*2-1)*(F+1),0,(a/I*2-1)*(F+1));for(let p=0;p<I;p++)for(let a=0;a<I;a++){const f=p*(I+1)+a;q.push(f,f+1,f+I+1,f+1,f+I+2,f+I+1)}const U=new i.BufferGeometry;U.setAttribute("position",B(_,3)),U.setIndex(q),U.boundingSphere=l;const D=new i.Mesh(U,P(Pe,_e(c,E),{polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));D.renderOrder=2,D.name="rain-patch";for(const p of[O,R,D])p.frustumCulled=!1;const H=new i.Vector3;return{objects:[D,O,R],uniforms:N,triangles:8+S.length/3+I*I*2,update(p,a){c.rainCentre(r.route,a,H),N.uRain.value.set(H.x,H.z),N.uTime.value=a}}}const Ce={rim:[2.4,.3,-.1],girder:[.9,.6,.85],walk:[2.4,1.35,6.4],gusset:3,rail:1.1,posts:5,valve:.55,wheel:.75,bar:[.5,1.6,.35],head:[.6,.7],hose:[.28,9,9,2.5],rod:[.11,14,16],buckle:[.32,.9]};async function Qe(e,c,r){const{RAIN:u,V3:F}=c,t=r.G,m=r.route,M=r.grey,w=c.rigAxes(m),b=w.dir,A=w.port,x=F(0,1,0),s=u.side/2,N=[r.G.I.length,r.G.thin.I.length],P=(d,S)=>Math.min(...[-1,0,1].map(o=>c.shellTop(d+b.x*o*u.travel,S+b.z*o*u.travel)))-1;c.buildBoard(t,null,M,{detail:r.detail,roof:P}),await e.yield();const B=F(m.rain.x-M.x,-M.y,m.rain.z-M.z),l=(d,S,o)=>B.clone().addScaledVector(b,d).addScaledVector(A,S).setY(o-M.y),g=u.height,k=r.detail<.9?5:8,C=r.detail<.9?10:14;t.slot=M.slot,t.kind=0,t.color("#59616b");for(const d of[-1,1])t.tube(l(-s,d*s,g),l(s,d*s,g),.5,6,!0),t.tube(l(d*s,-s,g),l(d*s,s,g),.5,6,!0);for(let d=0;d<k;d++){const S=-s+(d+.5)*u.side/k;t.color("#6a727c"),t.tube(l(-s,S,g),l(s,S,g),.3,5,!0),t.color("#e2bf63");for(let o=0;o<C;o++){const h=-s+(o+.5)*u.side/C;t.tube(l(h,S,g-.2),l(h,S,g-1.7),.34,4,!0)}d%2&&await e.yield()}t.color("#59616b"),t.tube(l(0,-s,g+.3),l(0,s,g+.3),.42,6,!0),t.kind=7,t.color("#8d99a6"),t.tube(l(-4,0,g+2.9),l(4,0,g+2.9),2.1,10),t.disc(l(-4,0,g+2.9),b.clone().negate(),2.1,10),t.disc(l(4,0,g+2.9),b,2.1,10),t.color("#3b4048");for(const d of[-2.4,2.4])t.box(l(d,0,g+1),b,x,A,.3,.75,1.7);await e.yield();const n=Ce,O=F(0,-1,0);t.kind=7,t.color("#454d57");for(const d of[-1,1])t.box(l(0,d*(s+n.rim[1]),g+n.rim[2]),b,x,A,s+2*n.rim[1],n.rim[0]/2,n.rim[1]),t.box(l(d*(s+n.rim[1]),0,g+n.rim[2]),A,x,b,s,n.rim[0]/2,n.rim[1]);t.color("#525a64");for(const d of[-1,1])t.box(l(0,d*s/3,g+n.girder[2]),b,x,A,s,n.girder[0]/2,n.girder[1]/2),t.box(l(d*s/3,0,g+n.girder[2]),A,x,b,s,n.girder[0]/2,n.girder[1]/2);t.color("#77808a");{const d=n.walk[0]/2,S=g+n.walk[1],o=s-d-.4;for(const y of[-1,1])t.box(l(0,y*o,S),b,x,A,s,.08,d),t.box(l(y*o,0,S),A,x,b,o-d,.08,d);t.box(l(-n.walk[2],0,S),A,x,b,o-d,.08,d);for(const y of[-1,1])for(const R of[-1,1])t.box(l(y*(o-d-n.gusset),R*(o-d-n.gusset),S-.05),b,x,A,n.gusset,.1,n.gusset);t.kind=0,t.color("#c9ced4");const h=o-d,E=S+n.rail;for(const y of[-1,1]){t.tube(l(-h,y*h,E),l(h,y*h,E),.07,4,!0),t.tube(l(y*h,-h,E),l(y*h,h,E),.07,4,!0);for(let R=0;R<=n.posts;R++){const _=-h+2*h*R/n.posts;t.tube(l(_,y*h,S),l(_,y*h,E),.07,4,!0),t.tube(l(y*h,_,S),l(y*h,_,E),.07,4,!0)}}}await e.yield();for(let d=0;d<k;d++){const S=-s+(d+.5)*u.side/k;t.kind=7,t.color("#5f6872"),t.box(l(0,S,g+n.bar[2]),b,x,A,s,n.bar[0]/2,n.bar[1]/2),t.color("#353a41"),t.box(l(0,S,g+.3),b,x,A,n.valve,n.valve,n.valve),t.color("#b5483a"),t.disc(l(0,S,g+.3+n.valve+.5),x,n.wheel,8),t.disc(l(0,S,g+.3+n.valve+.5),O,n.wheel,8),t.color("#d9b455");for(let o=0;o<C;o++){const h=-s+(o+.5)*u.side/C;t.tube(l(h,S,g-1.6),l(h,S,g-1.6-n.head[1]),n.head[0],5),t.disc(l(h,S,g-1.6-n.head[1]),O,n.head[0],5)}d%2&&await e.yield()}{const d=M.face*Math.PI/180,S=F(Math.sin(d),0,-Math.cos(d)),o=F(M.ex[0],0,M.ex[1]),h=M.o,E=D=>{const H=D/M.hw;let p=h.vMin;for(let a=0;a<h.n;a++)H>=h.u[a]&&H<=h.u[a+1]&&(p=Math.min(h.top[a],h.top[a+1]));return p*M.hh},y=(D,H)=>o.clone().multiplyScalar(D).addScaledVector(S,-.9).setY(Math.max(Math.min(E(D)-2,g+H-M.y),h.vMin*M.hh+2));let R=1,_=1,q=-1e9;for(const D of[-1,1])for(const H of[-1,1]){const p=l(D*s,H*s,g).dot(S);p>q&&(q=p,R=D,_=H)}const I=l(R*(s-2.6),_*(s-2.6),g+n.walk[1]+.9),U=I.dot(o);t.kind=7,t.color("#353a41"),t.box(I,b,x,A,1.2,.8,1.2);for(const D of[-1,0,1]){const H=y(U+D*n.hose[1],n.hose[2]+Math.abs(D)*2),p=I.clone().addScaledVector(x,.8),a=[];for(let f=0;f<=6;f++){const L=f/6;a.push(p.clone().lerp(H,L).addScaledVector(x,-n.hose[3]*4*L*(1-L)))}t.kind=0,t.color("#26282c");for(let f=0;f<6;f++)t.tube(a[f],a[f+1],n.hose[0],5,!0);t.kind=7,t.color("#8d99a6"),t.box(H,o,x,S,.5,.5,.45)}for(const D of[1,2])for(const H of[0,1]){const p=H?l(R*s,_*(s-D*n.rod[1]),g+1.1):l(R*(s-D*n.rod[1]),_*s,g+1.1),a=y(p.dot(o),n.rod[2]),f=a.clone().sub(p),L=f.length();f.divideScalar(L);const $=p.clone().addScaledVector(f,L*.42);t.kind=0,t.color("#2c2f35"),t.tube(p,a,n.rod[0],5,!0),t.kind=7,t.color("#8d99a6"),t.tube($.clone().addScaledVector(f,-n.buckle[1]),$.clone().addScaledVector(f,n.buckle[1]),n.buckle[0],6),t.color("#353a41"),t.box(p,b,x,A,.4,.4,.4),t.box(a,o,x,S,.4,.4,.4)}}await e.yield();for(const d of[-1,1])for(const S of[-1,1]){t.kind=7,t.color("#2c2f35"),t.box(l(d*s,S*s,g+.9),b,x,A,.7,.9,.7),t.box(l(d*s,S*s,g+2.45),b,x,A,c.GEAR.fall.sheave/2+.25,.65,c.GEAR.fall.pin/2+.3),t.kind=4,t.color(c.TAR);for(const[o,h]of c.fallParts()){const E=l(d*s+o,S*s+h,0);t.tube(l(d*s+o,S*s+h,g+3.1),l(d*s+o,S*s+h,P(M.x+E.x,M.z+E.z)),c.GEAR.stout/2,6,!0)}}t.kind=0,[t,t.thin].forEach((d,S)=>{for(let o=N[S]+1;o<d.I.length;o+=2)(d.I[o]===0||d.I[o]===6||d.I[o]===7)&&(d.I[o]=8)}),await e.yield();const G=ze(e,c,r);return await e.yield(),G}const Me=e=>`
const float PR = ${v(K.R-e.PADDLE.inset)}, PHY = ${v(e.PADDLE.hingeY)};
float flapLean(float phase, float time){ return ${v(e.PADDLE.mean)} + ${v(e.PADDLE.swing)} * sin(phase - ${v(e.PADDLE.w)} * time + ${v(e.PADDLE.lead)}); }
`,Ie=e=>`
attribute vec3 aCol, aFlap; uniform float uTime;
varying vec3 vCol, vN, vW, vF; varying float vLean;
${Me(e)}
#include <fog_pars_vertex>
void main(){
  float b = aFlap.x, a = flapLean(aFlap.y, uTime), ca = cos(a), sa = sin(a);
  vec3 rad = vec3(sin(b), 0., -cos(b)), tng = vec3(cos(b), 0., sin(b));
  float x = position.x, upw = position.y * ca - position.z * sa, inw = position.y * sa + position.z * ca;
  vec3 n = vec3(normal.x, normal.y * ca - normal.z * sa, normal.y * sa + normal.z * ca);        // across, up, toward the bay
  if (aFlap.z > .5) { vec2 A = vec2(${v(-(e.PADDLE.inset-1.25))}, ${v(2.5-e.PADDLE.hingeY)}), B = vec2(${v(e.PADDLE.tall-.45)} * sa - .5 * ca, ${v(e.PADDLE.tall-.45)} * ca + .5 * sa);
    vec2 P = mix(A, B, position.z); inw = P.x; upw = P.y + position.y; n = normal; }
  vec3 wp = rad * (PR - inw) + tng * x + vec3(0., PHY + upw, 0.);
  vW = wp; vN = tng * n.x + vec3(0., n.y, 0.) - rad * n.z; vCol = aCol; vF = position; vLean = a;
  vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,He=e=>`
uniform vec3 uLampCol, uFillCol, uBounce, uFoam; uniform float uKey, uFill, uTime;
varying vec3 vCol, vN, vW, vF; varying float vLean;
${e.GLSL_VN}
${ae}
${ye}
#include <fog_pars_fragment>
// (a line of half width w under a pixel fw wide: drawn a pixel wide at the least, it carries its width over the width drawn: its true cover, whole, at every footprint)
float mln(float d, float w, float fw){ float ww = max(w, .5 * fw); return clamp((ww - d) / fw + .5, 0., 1.) * (w / ww); }
void main(){
  vec3 n = normalize(vN + 1e-5), L = uLamp - vW; float ld = max(length(L), 1.); L /= ld;
  float fw = max(length(fwidth(vW)), 1e-3), ndl = max(dot(n, L), 0.);
  vec3 col = vCol;
  // the plates: a dark seam every 2.7 m, each plate its own shade, rust running down from seams and rail
  float px = vF.x / 2.7, pd = min(fract(px), 1. - fract(px)) * 2.7, near = 1. - smoothstep(.08, .6, fw);
  col *= 1. + (mh21(vec2(floor(px), 3.)) - .5) * .16 * near;                      // (each plate's shade: as often light as dark, its mean is the plate)
  // THE SEAM ENDS AT ITS OWN MEAN, not at bare plate: a dark line .05 m wide every 2.7 m covers .05 / 2.7 = .0185
  // of the plate (so .0093 darker at its strength .5)
  col *= 1. - .5 * mix(.0185, mln(pd, .025, fw), near);
  // THE RUST ENDS AT ITS OWN MEAN, not at clean plate: its two noises' steps average .247 and .461 and stand apart,
  // so their product averages .114 (counted over the noise's own field, two million places)
  float rust = smoothstep(.45, .9, mvn(vec2(vF.x / .35, vF.y / 2.6))) * smoothstep(.3, .75, mvn(vF.xy / 1.9 + 4.));
  col = mix(col, vec3(.3, .16, .08), .45 * mix(.114, rust, 1. - smoothstep(.2, 1.4, fw)));
  // wet: dark below the water's reach, and water sheeting off the face in falling runs
  float h = vW.y - seaY(vW.xz), wet = 1. - smoothstep(.5, 1.5, h);
  col *= mix(1., .62, wet);
  float runs = smoothstep(.5, .85, mvn(vec2(vF.x / .16, (vF.y + uTime * 2.6) / 1.1))) * smoothstep(.3, .7, mvn(vec2(vF.x / 1.3 + uTime * .1, vF.y / 2.)));
  // THE RUNS END AT THEIR OWN MEAN, not at none: their two noises' steps average .242 and .5, the product .121
  // (counted the same way); they stand only in the water's reach over the sea (a law of the place: h)
  float sheet = mix(.121, runs, 1. - smoothstep(.04, .3, fw)) * (1. - smoothstep(.6, 2.2, h));
  float key = uKey * ndl * (1. - boatShade(vW, min(fw, 2.)));
  vec3 lit = uFillCol * uFill * (.72 + .28 * n.y) + uBounce * (.5 - .5 * dot(n, L)) + uLampCol * key;
  vec3 V = normalize(cameraPosition - vW), Hh = normalize(L + V);
  float spec = pow(max(dot(n, Hh), 1e-4), 40.) * (.25 + .6 * wet) * key;                    // the wet steel's sheen
  col = col * lit + uLampCol * spec + uFoam * sheet * .55;
  // the foam where the water stands against the flap
  float foam = (1. - smoothstep(.0, .22 + .12 * mvn(vec2(vF.x / .6, uTime * 1.3)), abs(h))) * (.6 + .4 * mvn(vec2(vF.x / .25 + uTime, uTime * 2.)));
  col = mix(col, uFoam, clamp(foam, 0., 1.) * .8);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Be=`
${ae}
attribute vec2 aBank; varying vec2 vB; varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vB = aBank; vW = vec3(position.x, seaY(position.xz) + .05, position.z);
  vec4 mvPosition = viewMatrix * vec4(vW, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Te=e=>`
uniform float uTime; uniform vec3 uFoam; varying vec2 vB; varying vec3 vW;
${e.GLSL_VN}
${ae}
${re}
${Me(e)}
void main(){
  float fw = max(length(fwidth(vW.xz)), 1e-3), fi = (degrees(vB.x) - ${v(e.PADDLE.from)}) / ${v(e.PADDLE.pitch)}, i = floor(fi), fx = fract(fi);
  float on = step(0., fi) * step(fi, ${v(e.PADDLE.count)}) * smoothstep(0., .03, fx) * (1. - smoothstep(.97, 1., fx));
  float bc = radians(${v(e.PADDLE.from)} + (i + .5) * ${v(e.PADDLE.pitch)}), lean = flapLean(${v(-e.PADDLE.k*(K.R-e.PADDLE.inset))} * cos(bc - ${v(te.from*oe)}), uTime);
  float s = vB.y + PHY * tan(lean);                                                  // metres toward the bay from the flap's wet face
  float n1 = mvn(vW.xz / .45 + vec2(uTime * .7, -uTime * .4)), n2 = mvn(vW.xz / 1.6 - vec2(uTime * .3, uTime * .2));
  // THE LACE of the foam, and what a crest keeps of it, each END AT THEIR OWN MEAN where the pixel outgrows the
  // lace: .449 and .423 (counted over the two noises' own field, two million places)
  float lr = smoothstep(.3, .75, n1 * .6 + n2 * .4), res = 1. - smoothstep(.2, 1.1, fw), lace = mix(.449, lr, res), laced = mix(.423, smoothstep(.35, .7, lr), res);
  float churn = on * (step(0., s) * (1. - smoothstep(.3, 3.6, s)) + step(s, 0.) * .6 * (1. - smoothstep(0., 3., -s)));
  // the short broken chop the flap throws off. IT ENDS AT ITS OWN MEAN, not at none: over one turn of its wave
  // (4.2 m) the step from .72 to 1 of a sine averages .166 (counted over the turn)
  float chop = on * step(0., s) * exp(-s / 5.) * mix(.166, smoothstep(.72, 1., sin(s * 1.5 - uTime * 3.6 + i * 1.7 + 5. * n2)), 1. - smoothstep(1.5, 5., fw));
  float th = ${v(ie)} * dot(vW.xz, vec2(${v(J[0])}, ${v(J[1])})) - ${v(ue)} * uSeaTime;
  float crest = smoothstep(.9, 1., sin(th + 1.2 * (n2 - .5))) * exp(-max(s - .5, 0.) / 12.) * step(0., s) * step(0., fi) * step(fi, ${v(e.PADDLE.count)});
  float a = clamp(churn * (.35 + .6 * lace) + chop * lace * .7 + crest * laced * .8, 0., 1.) * (1. - layerFog());
  gl_FragColor = vec4(uFoam * a, a);
}`;async function Ke(e,c,r){const u=c.PADDLE,F=c.V3,t=[],m=[],M=[],w=[],b=[],A=new i.Color;let x=[0,0,0];const s=(a,f)=>(t.push(a[0],a[1],a[2]),m.push(f[0],f[1],f[2]),M.push(A.r,A.g,A.b),w.push(x[0],x[1],x[2]),t.length/3-1),N=(a,f,L,$,T)=>{const W=s(a,T);s(f,T),s(L,T),s($,T),b.push(W,W+1,W+2,W,W+2,W+3)},P=(a,f,L,$,T,W,j="")=>{j.includes("+z")||N([a,L,W],[f,L,W],[f,$,W],[a,$,W],[0,0,1]),j.includes("-z")||N([a,L,T],[f,L,T],[f,$,T],[a,$,T],[0,0,-1]),j.includes("+y")||N([a,$,T],[f,$,T],[f,$,W],[a,$,W],[0,1,0]),j.includes("-y")||N([a,L,T],[f,L,T],[f,L,W],[a,L,W],[0,-1,0]),j.includes("+x")||N([f,L,T],[f,$,T],[f,$,W],[f,L,W],[1,0,0]),j.includes("-x")||N([a,L,T],[a,$,T],[a,$,W],[a,L,W],[-1,0,0])},B=u.wide/2,l=u.thick/2,g=1.6,k=u.tall,C=r.S,n=F(0,1,0);for(let a=0;a<u.count;a++){const f=c.paddleBearing(a),L=f*oe;x=[L,c.paddlePhase(a),0],A.set("#51666a"),P(-B,B,g,k,-l,l,"-y"),A.set("#b08f2e"),P(-B,B,k-.1,k+.24,-l-.15,l+.15),A.set("#3d4c50"),P(-B,B,4,4.3,-l-.3,-l,"+z-x+x");for(let j=0;j<=6;j++){const V=-B+.2+j*(u.wide-.4)/6;P(V-.12,V+.12,g,k-.1,-l-.34,-l,"+z-y+y")}for(const j of[-1,1]){const V=j*B*.5;x=[L,c.paddlePhase(a),0],A.set("#2c3336"),P(V-.32,V+.32,k-.75,k-.15,-l-.62,-l,"+z"),x=[L,c.paddlePhase(a),1];for(const[z,X,Z,Fe]of[[.2,0,.56,"#2f3538"],[.09,.5,1,"#b9bfc2"]])A.set(Fe),N([V-z,z,X],[V+z,z,X],[V+z,z,Z],[V-z,z,Z],[0,1,0]),N([V-z,-z,X],[V+z,-z,X],[V+z,-z,Z],[V-z,-z,Z],[0,-1,0]),N([V+z,-z,X],[V+z,z,X],[V+z,z,Z],[V+z,-z,Z],[1,0,0]),N([V-z,-z,X],[V-z,z,X],[V-z,z,Z],[V-z,-z,Z],[-1,0,0])}const $=F(Math.sin(L),0,-Math.cos(L)),T=F(Math.cos(L),0,Math.sin(L)),W=(j,V,z)=>$.clone().multiplyScalar(K.R-j).addScaledVector(T,z).setY(V);C.slot=-1,C.kind=0,C.color("#5c6166"),C.box(W(.95,-.2,0),T,n,$,(u.wide+u.gap)/2+.05,1.1,.8,"-y+z"),C.color("#b08f2e",.8),C.box(W(1.72,.84,0),T,n,$,(u.wide+u.gap)/2+.05,.07,.06,"-y+z"),C.color("#2c3336");for(const j of[-1,1])C.box(W(1.25,1.75,j*B*.5),T,n,$,.22,.85,.22,"-y"),C.color("#4a5257"),C.box(W(1.25,2.5,j*B*.5),T,n,$,.3,.22,.34),C.color("#2c3336");a%4===3&&await e.yield()}await e.yield();const O=(a,f)=>new i.Float32BufferAttribute(a,f),G=new i.BufferGeometry;G.setAttribute("position",O(t,3)),G.setAttribute("normal",O(m,3)),G.setAttribute("aCol",O(M,3)),G.setAttribute("aFlap",O(w,3)),G.setIndex(b),G.boundingSphere=new i.Sphere(new i.Vector3,K.R+20);const d=r.look,S=ge[d],o=xe[d],h=(a,f=1)=>({value:new i.Color(a).multiplyScalar(f)}),E={...i.UniformsUtils.clone(i.UniformsLib.fog),...de(r.sea),uLamp:r.sky.shadow.uLamp,uBoat:r.sky.shadow.uBoat,uTime:{value:0},uLampCol:{value:new i.Color().setRGB((1+o.color[0])/2,(1+o.color[1])/2,(1+o.color[2])/2)},uFillCol:h(S.fill),uBounce:h(S.haze,.16),uFoam:h(d?"#f6dfc4":"#eef4f6",.86),uKey:{value:o.key},uFill:{value:o.fill}},y=new i.Mesh(G,new i.ShaderMaterial({uniforms:E,vertexShader:Ie(c),fragmentShader:He(c),fog:!0,side:i.DoubleSide}));y.frustumCulled=!1,y.name="paddles";const R=[],_=[],q=[],I=Math.round(160*(r.detail<.9?.6:1)),U=[-(u.inset-1.75),-1.6,-.7,0,.7,1.5,2.6,4.5,7.5,12,18,26],D=U.length;for(let a=0;a<=I;a++){const f=(u.from-.3+(u.count*u.pitch+.6)*a/I)*oe;for(const L of U){const $=K.R-u.inset-L;R.push(Math.sin(f)*$,0,-Math.cos(f)*$),_.push(f,L)}}for(let a=0;a<I;a++)for(let f=0;f<D-1;f++){const L=a*D+f;q.push(L,L+1,L+D,L+1,L+D+1,L+D)}const H=new i.BufferGeometry;H.setAttribute("position",O(R,3)),H.setAttribute("aBank",O(_,2)),H.setIndex(q),H.boundingSphere=G.boundingSphere;const p=new i.Mesh(H,new i.ShaderMaterial({uniforms:E,vertexShader:Be,fragmentShader:Te(c),fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:i.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));return p.frustumCulled=!1,p.renderOrder=2,p.name="paddle-foam-and-crests",{objects:[y,p],uniforms:E,triangles:b.length/3+q.length/3,update(a,f){E.uTime.value=f}}}const We={texel:3,least:.02,pad:24};function Oe(e,c,r,u,F){const t=c.x-r,m=c.z-u,M=Math.hypot(t,m)||1e-6,w=Math.hypot(M,c.y),b=e.face*oe,A=Math.sin(b),x=-Math.cos(b),s=(t*A+m*x)/w;if(Math.abs(s)<1e-4)return 0;const N=((e.x-r)*A+(e.z-u)*x)/s;if(N<=0||N>=w)return 0;const P=(r+t/w*N-e.x)*e.ex[0]+(u+m/w*N-e.z)*e.ex[1],B=c.y/w*N-e.y,l=c.y/w,g=se.core/w/Math.max(l,se.slantFloor)*N+.004,k=(se.core+(se.drum-se.core)*(1-l)*(1-l))/w*N+.004,C=Math.abs(e.ex[0]*m-e.ex[1]*t)/M,n=M/w,O=e.o,G=O.vMin*e.hh,d=(O.uR-O.uL)/2*e.hw,S=(O.vMax-O.vMin)/2*e.hh;if((G-B)*n>k)return 0;let o=0;const h=Math.max(B,G);for(const y of O.heaps){const R=P-y[0]*e.hw,_=h-y[1]*e.hw,q=Math.hypot(R,_)||1e-6,I=R/q*C,U=_/q*n,D=Math.hypot(I,U)||1e-6,H=I/D,p=Math.sqrt(k*k+(g*g-k*k)*H*H);o=Math.max(o,1-Ee(((q-y[2]*e.hw)*D+p)/(2*p)))}const E=1-Ee(((G-B)*n+k)/(2*k));return o*E*Math.min(1,(d*C+F/2)/g)*Math.min(1,S*n/k)}const Ee=e=>{const c=Math.min(Math.max(e,0),1);return c*c*(3-2*c)},Ve=`
${ae}
varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vW = vec3(position.x, seaY(position.xz) + .04, position.z);
  vec4 mvPosition = viewMatrix * vec4(vW, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ge=`
${ye}
${ae}
uniform sampler2D uShadeMap; uniform vec4 uShadeBox; uniform vec3 uDeep, uLampCol; uniform float uKey;
varying vec3 vW;
#include <fog_pars_fragment>
void main(){
  vec2 xz = vW.xz; float fw = max(length(fwidth(xz)), 1e-3);
  float m = texture2D(uShadeMap, (xz - uShadeBox.xy) * uShadeBox.zw).r;
  // how much of the body the eye has there (the sea's own law): the water's facing is the swell's own slope, as
  // the sea's paint takes it (filtered by the pixel's footprint); the mirror takes the rest
  float sk = ${v(ie)} * dot(xz, vec2(${v(J[0])}, ${v(J[1])})), sl = ${v(te.height/2*ie)} * cos(sk - ${v(ue)} * uSeaTime) * seaEase(xz) * (1. - smoothstep(.9, 2.6, fwidth(sk)));
  vec3 N = normalize(vec3(-sl * ${v(J[0])}, 1., -sl * ${v(J[1])})), V = normalize(cameraPosition - vW);
  float cv = clamp(dot(N, V), 0., 1.), fr = ${v(fe.straight)} + ${v(1-fe.straight)} * pow(max(1. - cv, 1e-4), 3.);
  float ours = boatShadeOn(vec3(xz.x, 0., xz.y), vec3(0., 1., 0.), min(fw, 2.));
  vec3 take = uDeep * uLampCol * (uKey * ${v(fe.key)} * m * (1. - ours) * (1. - fr));
  #ifdef USE_FOG
    take *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #endif
  gl_FragColor = vec4(take, 0.);                                       // (laid by taking away: what the sea drew there stays, less this)
}`;async function Xe(e,c,r){const{Geo:u,V3:F}=c,t=new u;t.thin=new u;const m=We,M=r.lamp,w=K.R-1,b=[];for(const o of r.low){c.buildBoard(t,null,o,{detail:r.detail,low:!0,part:1}),await e.yield(),c.buildBoard(t,null,o,{detail:r.detail,low:!0,part:2}),await e.yield(),c.buildBoard(t,null,o,{detail:r.detail,low:!0,part:3});const h=[],E=[];for(const y of[o.o.uL,o.o.uR]){const R=o.x+o.ex[0]*y*o.hw,_=o.z+o.ex[1]*y*o.hw,q=R-M.x,I=_-M.z,U=Math.hypot(q,I)||1,D=q/U,H=I/U,p=R*D+_*H,a=-p+Math.sqrt(Math.max(p*p-(R*R+_*_)+w*w,0));h.push(R,R+D*a),E.push(_,_+H*a)}b.push([Math.min(...h)-m.pad,Math.min(...E)-m.pad,Math.max(...h)+m.pad,Math.max(...E)+m.pad]),await e.yield()}const A=Math.floor(Math.min(...b.map(o=>o[0]))/m.texel)*m.texel,x=Math.floor(Math.min(...b.map(o=>o[1]))/m.texel)*m.texel,s=Math.max(1,Math.ceil((Math.max(...b.map(o=>o[2]))-A)/(2*m.texel))),N=Math.max(1,Math.ceil((Math.max(...b.map(o=>o[3]))-x)/(2*m.texel))),P=2*s+1,B=2*N+1,l=new Uint8Array(P*B);for(let o=0;o<r.low.length;o++){const h=r.low[o],E=b[o],y=Math.max(0,Math.floor((E[0]-A)/m.texel)),R=Math.min(P-1,Math.ceil((E[2]-A)/m.texel)),_=Math.max(0,Math.floor((E[1]-x)/m.texel)),q=Math.min(B-1,Math.ceil((E[3]-x)/m.texel));for(let I=_;I<=q;I++){const U=x+I*m.texel;for(let D=y;D<=R;D++){const H=A+D*m.texel;if(H*H+U*U>w*w)continue;const p=Math.round(Math.min(Math.max(Oe(h,M,H,U,c.BOARD.thick)-m.least,0),1)*255);p>l[I*P+D]&&(l[I*P+D]=p)}}await e.yield()}const g=[],k=[],C=new Map,n=(o,h)=>{const E=h*P+o;let y=C.get(E);return y===void 0&&(y=g.length/3,g.push(A+o*m.texel,0,x+h*m.texel),C.set(E,y)),y};for(let o=0;o<N;o++)for(let h=0;h<s;h++){let E=!1;for(let y=2*o;y<=2*o+2&&!E;y++)for(let R=2*h;R<=2*h+2;R++)if(l[y*P+R]){E=!0;break}if(E){const y=n(2*h,2*o),R=n(2*h+2,2*o),_=n(2*h+2,2*o+2),q=n(2*h,2*o+2);k.push(y,R,_,y,_,q)}}await e.yield();const O=(o,h)=>new i.Float32BufferAttribute(o,h),G=r.mats,d=[],S={data:l,W:P,H:B,x0:A,z0:x,texel:m.texel,cells:k.length/6,mesh:null};if(k.length){const o=new i.BufferGeometry;o.setAttribute("position",O(g,3)),o.setIndex(k),o.boundingSphere=new i.Sphere(new i.Vector3,K.R+40);const h=new i.DataTexture(l,P,B,i.RedFormat,i.UnsignedByteType);h.magFilter=h.minFilter=i.LinearFilter,h.generateMipmaps=!1,h.unpackAlignment=1,h.needsUpdate=!0;const E=r.sea&&r.sea.uniforms||{},y=G.uniforms,R={...i.UniformsUtils.clone(i.UniformsLib.fog),...de(r.sea),uLamp:r.sky.shadow.uLamp,uBoat:r.sky.shadow.uBoat,uShadeMap:{value:h},uShadeBox:{value:new i.Vector4(A-m.texel/2,x-m.texel/2,1/(P*m.texel),1/(B*m.texel))},uDeep:E.uDeep||y.uDeep,uLampCol:E.uLampCol||y.uLampCol,uKey:E.uKey||y.uKey},_=new i.Mesh(o,new i.ShaderMaterial({uniforms:R,vertexShader:Ve,fragmentShader:Ge,fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,blending:i.CustomBlending,blendEquation:i.ReverseSubtractEquation,blendSrc:i.OneFactor,blendDst:i.OneFactor,blendEquationAlpha:i.AddEquation,blendSrcAlpha:i.ZeroFactor,blendDstAlpha:i.OneFactor}));_.renderOrder=1.2,_.name="low-boards-shade-on-water",d.push(_),S.mesh=_}for(const o of d)o.frustumCulled=!1;return{objects:d,G:t,shade:S,triangles:2*(t.triangles+t.thin.triangles)+k.length/3}}const Y={far:140,tint:[.775,.72,.675],inset:.8,edge:14,cols:12,rows:7},qe=e=>`
attribute vec3 aBoard;                                       // metres across the board, metres up it, its slot
uniform vec3 uSlot[${e.NSLOT}], uLamp; varying vec2 vQ; varying float vSlot, vFar;
#include <fog_pars_vertex>
void main(){
  vec3 pb = uSlot[int(aBoard.z + .5)] + position, d = pb - uLamp; float l = max(length(d), 1e-3); d /= l;
  float bq = dot(uLamp, d), t = -bq + sqrt(max(bq * bq - dot(uLamp, uLamp) + ${v((K.R-Y.inset)*(K.R-Y.inset))}, 0.));      // where the lamp's ray through the board meets the shell
  vQ = aBoard.xy; vSlot = aBoard.z; vFar = t - l;
  vec4 mvPosition = viewMatrix * vec4(uLamp + d * t, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ue=e=>`
uniform sampler2D uHeaps; uniform vec3 uTint; varying vec2 vQ; varying float vSlot, vFar;
${e.GLSL_HEAP}
${re}
void main(){
  int row = int(vSlot + .5); vec4 m = heapAt(0, row); int n = int(m.x + .5); float d = 1e9;
  for (int j = 0; j < ${e.BOARD.heaps}; j++){ if (j >= n) break; vec4 h = heapAt(j + 2, row); d = min(d, length(vQ - h.xy) - h.z); }
  d = max(d, m.z - vQ.y);                                                               // the flat base
  float soft = 3. + .035 * vFar, sh = (1. - smoothstep(-soft, soft, d)) * (1. - smoothstep(${v(Y.far*.8)}, ${v(Y.far)}, vFar)) * (1. - layerFog());
  gl_FragColor = vec4(mix(vec3(1.), uTint, sh), 1.);                                    // (the paint behind is multiplied by this)
}`;function Ze(e,c,r){const u=[],F=[],t=[],m=Y.cols,M=Y.rows;for(const s of r.boards){const N=u.length/3,P=s.o.uL*s.hw-Y.edge,B=s.o.uR*s.hw+Y.edge,l=s.o.vMin*s.hh-Y.edge,g=s.o.vMax*s.hh+Y.edge;for(let k=0;k<=M;k++)for(let C=0;C<=m;C++){const n=P+(B-P)*C/m,O=l+(g-l)*k/M;u.push(s.ex[0]*n,O,s.ex[1]*n),F.push(n,O,s.slot)}for(let k=0;k<M;k++)for(let C=0;C<m;C++){const n=N+k*(m+1)+C;t.push(n,n+1,n+m+2,n,n+m+2,n+m+1)}}const w=new i.BufferGeometry;w.setAttribute("position",new i.Float32BufferAttribute(u,3)),w.setAttribute("aBoard",new i.Float32BufferAttribute(F,3)),w.setIndex(t),w.boundingSphere=new i.Sphere(new i.Vector3,K.R+40);const b=r.mats.uniforms,A={...i.UniformsUtils.clone(i.UniformsLib.fog),uSlot:b.uSlot,uLamp:b.uLamp,uHeaps:b.uHeaps,uTint:{value:new i.Vector3(Y.tint[0],Y.tint[1],Y.tint[2])}},x=new i.Mesh(w,new i.ShaderMaterial({uniforms:A,vertexShader:qe(c),fragmentShader:Ue(c),fog:!0,transparent:!0,depthWrite:!1,side:i.DoubleSide,blending:i.CustomBlending,blendEquation:i.AddEquation,blendSrc:i.ZeroFactor,blendDst:i.SrcColorFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4}));return x.frustumCulled=!1,x.renderOrder=.5,x.name="cloud-boards-shadows-on-the-sky",{objects:[x],triangles:t.length/3}}export{We as LOWSHADE,Ce as RACK,ce as RAINFALL,Y as SHADE,Oe as lowShade,Xe as makeMobile,Ke as makePaddles,Qe as makeRain,Ze as makeShades,me as rainBody,Ye as rainLayer,Re as rainStanding,ve as rainStreak};
