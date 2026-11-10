import*as m from"three";import{SHELL as ve,LAMP as Ze,LAMP_LIGHT as Be,PAINTS as Ee,GLSL_SHADOW as Je,LOOKS as Ge,dirOf as Ve,bearingOf as Le,wallPoint as xe,lampPlace as et,shadowWholeFrom as tt,shadowWall as ot}from"./sky-with-a-seam.js";import{makeGantryLamps as at,makeScaffold as rt,makeStages as st,makeWallShadows as it,makeWallScaffolds as nt,WSCAF as Me,scaffoldDice as _e}from"./sky-with-a-seam-rigs-b.js";const be=Math.PI/180,de={rail:{arc:101,inset:.7},cradle:{len:10,wide:1.3,off:1.5,turn:22,lowY:8,heights:[13.5,18.5,23.5],sway:.1,swayIn:.03,lowSway:.28,rope:.025},patch:{wide:72,a1:46,clear:4,cloudHalf:23,cloudH:23,cloudBase:13,square:4,cradles:[[-15,14.5],[25,22.5]],low:[-31,-27]},moon:{before:90,near:70,pontoon:[24,14],deck:4.4,ring:34.5,foot:2.6,tower:3.2,apex:9.4,jib:60,reach:55,tail:12,globe:6,drop:3.4,slew:24,period:44},front:{gap:5,pastE:20,between:7},stage:{wide:2.6,off:1.5,at:5,mid:.55,list:[{len:24,y:11},{len:28,y:13},{len:26,y:9}]}},w=(e=0,o=0,l=0)=>new m.Vector3(e,o,l),z=w(0,1,0);class Ae{constructor(){this.P=[],this.N=[],this.C=[],this.G=[],this.A=[],this.thin={P:[],N:[],C:[],G:[],A:[]},this.col=new m.Color("#888888"),this.glow=[0,0]}color(o,l=1){return this.col.set(o).multiplyScalar(l),this}lamp(o=0,l=0){return this.glow=[o,l],this}tri(o,l,n,r){const x=l.x-o.x,A=l.y-o.y,a=l.z-o.z,p=n.x-o.x,c=n.y-o.y,y=n.z-o.z;let u=A*y-a*c,s=a*p-x*y,t=x*c-A*p;const k=Math.hypot(u,s,t)||1;u/=k,s/=k,t/=k;const I=[o,l,n],g=r&&r[3]>0?this.thin:this;for(let _=0;_<3;_++)g.P.push(I[_].x,I[_].y,I[_].z),g.N.push(u,s,t),g.C.push(this.col.r,this.col.g,this.col.b),g.G.push(this.glow[0],this.glow[1]),r?g.A.push(r[_].x,r[_].y,r[_].z,r[3]):g.A.push(0,0,0,0);return this}quad(o,l,n,r,x){return this.tri(o,l,n,x&&[x[0],x[1],x[2],x[4]]),this.tri(o,n,r,x&&[x[0],x[2],x[3],x[4]])}box(o,l,n,r,x,A,a){const p=(y,u,s)=>o.clone().addScaledVector(l,y*x).addScaledVector(n,u*A).addScaledVector(r,s*a),c=[p(-1,-1,-1),p(1,-1,-1),p(1,1,-1),p(-1,1,-1),p(-1,-1,1),p(1,-1,1),p(1,1,1),p(-1,1,1)];return this.quad(c[1],c[0],c[3],c[2]),this.quad(c[4],c[5],c[6],c[7]),this.quad(c[3],c[7],c[6],c[2]),this.quad(c[0],c[1],c[5],c[4]),this.quad(c[5],c[1],c[2],c[6]),this.quad(c[0],c[4],c[7],c[3])}tube(o,l,n,r=6,x=!1,A=n,a=!1){const p=w().subVectors(l,o),c=Math.abs(p.y)>.9*p.length()?w(1,0,0):w(0,1,0),y=w().crossVectors(c,p).normalize(),u=w().crossVectors(p,y).normalize(),s=(t,k,I)=>{const g=t/r*2*Math.PI;return k.clone().addScaledVector(y,Math.cos(g)*I).addScaledVector(u,Math.sin(g)*I)};for(let t=0;t<r;t++)this.quad(s(t,o,n),s(t+1,o,n),s(t+1,l,A),s(t,l,A),x?[o,o,l,l,Math.max(n,A)]:null),a&&(this.tri(o,s(t+1,o,n),s(t,o,n)),this.tri(l,s(t,l,A),s(t+1,l,A)));return this}ball(o,l,n=12,r=6,x=-Math.PI/2,A=Math.PI/2){const a=(p,c)=>{const y=x+(A-x)*c/r,u=p/n*2*Math.PI;return w(o.x+Math.cos(u)*Math.cos(y)*l,o.y+Math.sin(y)*l,o.z+Math.sin(u)*Math.cos(y)*l)};for(let p=0;p<r;p++)for(let c=0;c<n;c++)this.quad(a(c,p),a(c,p+1),a(c+1,p+1),a(c+1,p));return this}geometry(){const o=new m.BufferGeometry,l=this.thin,n=A=>l[A].length?this[A].concat(l[A]):this[A],r=this.P.length/3,x=l.P.length/3;return o.setAttribute("position",new m.Float32BufferAttribute(n("P"),3)),o.setAttribute("normal",new m.Float32BufferAttribute(n("N"),3)),o.setAttribute("color",new m.Float32BufferAttribute(n("C"),3)),o.setAttribute("aGlow",new m.Float32BufferAttribute(n("G"),2)),o.setAttribute("aAxis",new m.Float32BufferAttribute(n("A"),4)),o.setAttribute("aSlot",new m.BufferAttribute(new Float32Array(r+x),1)),o.setAttribute("aSide",new m.BufferAttribute(new Float32Array(r+x),1)),x&&(o.addGroup(0,r+x,0),o.addGroup(r,x,1)),o.computeBoundingSphere(),o}get triangles(){return(this.P.length+this.thin.P.length)/9}}const Oe=20,Fe=.24,lt=e=>{const o=new m.Vector4;return(l,n,r,x,A)=>{const a=r.projectionMatrix.elements,p=r.matrixWorldInverse.elements;l.getCurrentViewport(o);const c=p[4]/a[0],y=p[5]/a[5],u=-2*c/o.z,s=-2*y/o.w,t=c*(2*o.x/o.z+1-a[8])+y*(2*o.y/o.w+1-a[9])+p[6],k=.5*a[14]/Math.max(r.matrixWorld.elements[13]-Fe,.001);e.value.set(k*u,k*s,.5-.5*a[10]+k*t),A&&(A.uniformsNeedUpdate=!0)}},ke=`
attribute vec3 color; attribute vec4 aAxis; attribute vec2 aGlow; attribute float aSlot, aSide;
uniform float uPix; uniform vec3 uBeaconP[3]; uniform vec4 uBeam[3]; uniform mat4 uMove[${Oe}];
varying vec3 vCol, vN, vW; varying float vGlow, vKind, vWide;
#ifdef NET
varying vec2 vNet;                                    // a net's corner carries its place on the cloth (metres) in aAxis.xy
#endif
#ifdef MIRROR
varying float vPre;                                   // 1: a corner that lays an image's depth before its colour (aSide 3); -1: a strip's corner (aSide 1 or -1); else 0
#endif
#include <fog_pars_vertex>
void main(){
  vec3 p = position, eye = cameraPosition;
#ifdef MIRROR
  eye.y = -eye.y;                                     // an image is seen as from the eye's own image under the water
#endif
  mat4 mm = modelMatrix * uMove[int(aSlot + .5)];     // (the body's own frame: its slot's)
  vWide = 1.;                                         // (a solid, or a member drawn as it is)
  vec4 wp;
  if (aAxis.w > 0. && abs(aSide) > .5) {
    // A ROUND MEMBER AS ONE STRIP TURNED TO THE EYE (a joined draw's; as the kit's wire is drawn): this corner is
    // an end of its axis (position), aAxis.xyz the other end, aSide the side of the axis it stands on. The strip
    // is as wide as the member is from every side (twice its radius, or the 1.5 pixels of the law) and its
    // normal goes round from one edge to the other as a round bar's does
    vec3 a = (mm * vec4(position, 1.)).xyz, d = normalize((mm * vec4(aAxis.xyz, 1.)).xyz - a), v = eye - a;
    vec3 sd = cross(d, v); sd *= inversesqrt(max(dot(sd, sd), 1e-8));
    float want = max(aAxis.w, .75 * uPix * length(v) / projectionMatrix[1][1]); vWide = want / aAxis.w;
    wp = vec4(a + sd * (aSide * want), 1.); vN = sd * aSide + .35 * cross(sd, d);
  } else {
    if (aAxis.w > 0.) { vec4 cw = mm * vec4(aAxis.xyz, 1.); float dist = length(eye - cw.xyz);
      float want = max(aAxis.w, .75 * uPix * dist / projectionMatrix[1][1]); vec3 off = position - aAxis.xyz; vWide = want / aAxis.w; p = aAxis.xyz + off * vWide; }
    wp = mm * vec4(p, 1.); vN = normalize(mat3(mm) * normal);
  }
  vW = wp.xyz; vCol = color;
#ifdef NET
  vNet = aAxis.xy;
#endif
  float g = aGlow.x;
  for (int i = 0; i < 3; i++) { if (abs(aGlow.y - float(i + 1)) < .5) {
    vec2 e = cameraPosition.xz - uBeaconP[i].xz; e *= inversesqrt(max(dot(e, e), 1e-4));
    float lobe = smoothstep(.35, 1., dot(e, uBeam[i].xy)); g = aGlow.x * (.22 + 1.9 * lobe * lobe * uBeam[i].z); } }
  vGlow = g; vKind = aGlow.y;
#ifdef MIRROR
  wp.y = -wp.y; vPre = step(2.5, aSide) - step(.5, abs(aSide)) * step(abs(aSide), 1.5);
#endif
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ie=`
uniform vec3 uLampCol, uFillCol, uAmber, uWorkCol, uBeaconP[3], uMoonAt, uMoonSun, uMoonDark; uniform vec4 uBeam[3], uWork[4]; uniform float uKey, uFill;
varying vec3 vCol, vN, vW; varying float vGlow, vKind, vWide; uniform float uClock;
#ifdef NET
varying vec2 vNet;
#endif
#ifdef MIRROR
varying float vPre; uniform vec3 uLevel;              // (uLevel: the depth of the level an image stands at, as a law of the pixel's place: levelAim)
#endif
#include <fog_pars_fragment>
${Je}
// (h21 IS THE KIT'S OWN hash12, of src/kit/fx.js, carried here as the kit has it: it follows "Hash without Sine",
// David Hoskins, 2014, MIT, whose notice the kit's head names and the site ships: covered by section 181 a,
// nothing brought in anew. vn is the common value noise: four hashed corners and a cubic fade)
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  // EVERY DERIVATIVE OF THIS PAINT IS TAKEN HERE, FIRST, into plain values, before any discard (a card that ends
  // a discarded pixel there and then hands its neighbours a wrong derivative): the footprint of the place itself
  // (for our boat's shadow), of the still water's place where the eye's ray to an image crosses it (for the
  // ripples), of a net's cloth (for its strands)
  vec3 E = cameraPosition; float footW = min(length(fwidth(vW)), 2.);
#ifdef MIRROR
  float k0 = clamp(E.y / max(E.y + vW.y, 1e-3), 0., 1.); vec2 wxz = E.xz + (vW.xz - E.xz) * k0; float fww = max(length(fwidth(wxz)), 1e-4);
#endif
#ifdef NET
  vec2 netQ = vNet * 10., netF = max(fwidth(netQ), vec2(1e-4));
#endif
  // a thin member drawn wider than it is is the blended twin's (THIN: alpha its true cover); drawn as it is, the paint's own
  float wide = step(1.0005, vWide), cover = 1. / max(vWide, 1.);
#ifdef THIN
  if (wide < .5) discard;
#else
#ifndef MIRROR
  if (wide > .5) discard;
#endif
#endif
#ifdef MIRROR
  // A STRIP'S IMAGE (vPre -1: a thin member of the joined draws) IS LAID BY TWO DRAWS, each pixel of it by one.
  // Where the member is drawn AS WIDE AS IT IS its image is the joined image's: a solid's, which writes its depth.
  // Where it is drawn WIDER THAN IT IS its image is the netting's image's draw's (NET, which carries the same
  // strips after its veils: joinDraws): blended at the cover it truly has over what stands, WRITING NO DEPTH, so
  // that a faint line 1.5 pixels wide cuts nothing out of an image that is laid after it and stands behind it
#ifdef NET
  if (vPre < -.5 && wide < .5) discard;
#else
  if (vPre < -.5 && wide > .5) discard;
#endif
  // (in an image, where a thin member is drawn wider than it is, one face of it alone is drawn, so that its cover
  // is laid once: of a round skin the half toward the eye, which an image, the body turned over, shows wound the
  // other way round; a strip's one face likewise)
  if (wide > .5 && gl_FrontFacing) discard;
  E.y = -E.y;                                         // (from here on the eye is its own image under the water; wxz, fww above: the still water's place and the ripples' footprint there)
#endif
  vec3 n = normalize(vN + 1e-5), vd = E - vW; vd *= inversesqrt(max(dot(vd, vd), 1e-4)); if (dot(n, vd) < 0.) n = -n;
  vec3 L = uLamp - vW; float ld = max(length(L), 1.); L /= ld;
  float inside = 1. - step(${(ve.R-.3).toFixed(2)}, length(vW));
  vec3 lit = uFillCol * uFill * mix(.1, 1., inside) * (.74 + .26 * n.y) + uLampCol * uKey * 1.25 * max(dot(n, L), 0.) * inside * (1. - boatShadeOn(vW, n, footW));   // (our boat's shadow lies on the rigs too)
  // the work lamps' pools (beyond the wall there is no other steady light)
  for (int i = 0; i < 4; i++) { vec3 d = uWork[i].xyz - vW; float dd = max(dot(d, d), 1e-2);
    lit += uWorkCol * uWork[i].w * (.25 + .75 * max(dot(n, d * inversesqrt(dd)), 0.)) / (1. + dd / 240.); }
  // the beacons' turning beams on the steel: an eased lobe about each beacon's own upright axis
  for (int i = 0; i < 3; i++) { vec3 d = vW - uBeaconP[i]; float dd = max(dot(d, d), 1e-2);
    vec2 h = d.xz * inversesqrt(max(dot(d.xz, d.xz), 1e-4)); float lobe = smoothstep(.45, 1., dot(h, uBeam[i].xy)); lobe *= lobe;
    lit += uAmber * uBeam[i].z * lobe * (.3 + .7 * max(dot(n, -d * inversesqrt(dd)), 0.)) / (1. + dd / 70.); }
  // a globe lamp (kind 4) is a little dimmer toward its limb, as a lit ball of glass is
  float limb = mix(1., .7 + .3 * abs(dot(n, vd)), step(3.5, vKind));
  vec3 col = mix(vCol * lit, vCol * vGlow * limb, step(.001, vGlow));
  // THE MOON'S GLOBE (kind 4): its face toward the lamp-sun's place is lit cream, its other face is shaded
  // blue-grey paint, a soft terminator between. uMoonAt (the globe's middle) and uMoonSun (the unit direction
  // from it to the lamp-sun) are set at each draw: the bright side faces the lamp at every phase of the slew
  if (vKind > 3.5) { float mk = clamp((dot(normalize(vW - uMoonAt), uMoonSun) + .12) / .4, 0., 1.); mk = mk * mk * (3. - 2. * mk);
    col = mix(uMoonDark, vCol, mk) * ((.42 + (vGlow - .42) * mk) * limb); }
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
#ifdef THIN
  gl_FragColor.a = cover;                            // THE COVER IT TRULY HAS: its radius over the radius drawn
#endif
#ifdef NET
  // SAFETY NETTING: a mesh of 0.1 m whose strands are a quarter of it. Over a pixel's footprint the strands are
  // counted exactly (a box filter), so that far off the net is its mean cover: a veil
  { vec2 q = netQ, f = netF, q0 = q - .5 * f, q1 = q + .5 * f;      // (the cloth's place and its footprint, taken at the head)
    vec2 cv = ((floor(q1) * .25 + min(fract(q1), .25)) - (floor(q0) * .25 + min(fract(q0), .25))) / f;
    float na = clamp(1. - (1. - cv.x) * (1. - cv.y), 0., 1.);
#ifdef MIRROR
    na = max(na, step(.5, -vPre));                     // (a strip's image, which the netting's image's draw carries, is no veil: whole here, thinned below by its own cover)
#endif
    gl_FragColor = vec4(gl_FragColor.rgb * na, na); }
#endif
#ifdef MIRROR
  // AN IMAGE IN THE SEA, by the law the hero's sea gives: as strong as the water mirrors by the ray's slant, its
  // edge broken by the ripples at the water's own place (their pattern filtered by its footprint), its depth the
  // depth where the eye's ray meets the level ${Fe} m (just over the swell's crest); what stands under the water
  // has no image
  float cosT = cameraPosition.y / max(length(vec3(wxz.x - cameraPosition.x, cameraPosition.y, wxz.y - cameraPosition.z)), 1e-3), gz = 1. - clamp(cosT, 0., 1.);
  float rp = vn(wxz * .55 + uClock * vec2(.1, .16)) * .55 + vn(wxz * 1.9 - uClock * vec2(.27, .12)) * .45;
  float al = (.74 + .24 * gz * gz) * mix(1., mix(smoothstep(.36, .64, rp), .5, smoothstep(.5, 2., fww)), .24) * cover;      // (a thin member's image: by its true cover)
  gl_FragColor = vec4(gl_FragColor.rgb * (.88 * al), gl_FragColor.a * al);
  // THAT DEPTH IS WORKED FROM THE PIXEL'S OWN PLACE, not from what a triangle hands on (uLevel: levelAim), so
  // that every skin of an image has THE VERY SAME level's depth at a pixel, to the last bit; the one thing that
  // then tells two skins apart is the term after it, by each skin's own true depth: the nearer skin stands a
  // little nearer (0.02 of its true depth's share: the same term every part's image of this world carries).
  // EVERY SOLID'S IMAGE IS LAID ONCE, BY ITS PLACE AND NOT BY THE ORDER OF THE CORNERS. In the joined image's
  // draw every imaged solid stands twice (joinDraws). Its FIRST corners (pre 1) lay NO COLOUR and write this
  // depth alone, ONE STEP deeper (2 to the power -24: one step of a 24 bit depth and of a float's from 0.5 up,
  // added last, so the sum is exact), so that when the second come the nearest skin's depth, and one step,
  // already stands at every pixel. The second are blended only where they are NEARER than what stands (the
  // image's paint tests "nearer", not "as near"): the first of them that stands at the nearest depth is, by
  // that one step, and then stands itself; every other skin (the same solid's far side, a solid within or
  // behind another, a skin the depth cannot tell from the nearest) is no nearer and fails. So one skin and no
  // more is blended at a pixel: the nearest, or where the depth cannot tell two apart (from afar: with the
  // world's near plane at 0.4 m a step of the depth is 6 cm of true depth at 90 m, 0.3 m at 200 m) the first of
  // them among the corners, which joinDraws orders by their place. THE STEP IS TYPED FOR A DEPTH OF 24 BITS OR A
  // FLOAT'S (the engine's targets are 24 bit; three r170 gives no coarser one unless a 16 bit depth texture is
  // asked for): under a 16 bit depth it would be no step, and the image would not be laid at all.
  // WHAT IS LOST IN A TIE: a thin member drawn as wide as it is lays its image in this draw after the solids'
  // and, as they do, only where it is NEARER than what stands, so where it stands less than one step before a
  // solid's image the two tie at some pixels and the member's image is lost there (the crane tower's lacing, 2 cm
  // proud of its plates, where a step is 3.4 cm of true depth at 68 m, the nearest the flown line comes to it,
  // and more beyond); where it is drawn wider than it is, its image is the netting's image's draw's, which
  // tests "as near", and is not lost so
  float pre = step(.5, vPre);
  gl_FragDepth = clamp(dot(uLevel.xy, gl_FragCoord.xy) + uLevel.z - .02 * (1. - gl_FragCoord.z), 0., 1.) + pre / 16777216.;
  if (vW.y < 0.) discard;
  gl_FragColor *= 1. - pre;
#endif
}`;function dt(e,o){const l=Ee[e],n=Be[e],r=new m.ShaderMaterial({vertexShader:ke,fragmentShader:Ie,fog:!0,side:m.DoubleSide,uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),uLamp:o.uLamp,uBoat:o.uBoat,uPix:{value:2/720},uLampCol:{value:new m.Color().setRGB(n.color[0],n.color[1],n.color[2])},uFillCol:{value:new m.Color(l.fill)},uAmber:{value:new m.Color("#ff9a1e")},uWorkCol:{value:new m.Color("#ffe2b0")},uKey:{value:n.key},uFill:{value:n.fill},uBeaconP:{value:[0,1,2].map(()=>new m.Vector3(0,-1e4,0))},uBeam:{value:[0,1,2].map(()=>new m.Vector4(1,0,0,0))},uWork:{value:[0,1,2,3].map(()=>new m.Vector4(0,-1e4,0,0))},uClock:{value:0},uMove:{value:Array.from({length:Oe},()=>new m.Matrix4)},uLevel:{value:new m.Vector3(0,0,1)},uMoonAt:{value:new m.Vector3(0,-1e4,0)},uMoonSun:{value:new m.Vector3(0,1,0)},uMoonDark:{value:new m.Color("#4f6190")}}});return r.userData.thin=new m.ShaderMaterial({vertexShader:ke,fragmentShader:Ie,fog:!0,side:m.FrontSide,uniforms:r.uniforms,defines:{THIN:1},transparent:!0,depthWrite:!1}),r}const ct=e=>new m.ShaderMaterial({vertexShader:ke,fragmentShader:Ie,fog:!0,side:m.DoubleSide,uniforms:e.uniforms,defines:{MIRROR:1},transparent:!0,premultipliedAlpha:!0,depthWrite:!0,depthFunc:m.LessDepth,forceSinglePass:!0}),Ue=(e,o)=>new m.ShaderMaterial({vertexShader:ke,fragmentShader:Ie,fog:!0,side:m.DoubleSide,uniforms:e.uniforms,defines:o?{NET:1,MIRROR:1}:{NET:1},transparent:!0,premultipliedAlpha:!0,depthWrite:!1,forceSinglePass:!0}),we=(e,o,l)=>{const n=e.isBufferGeometry?e:e.geometry(),r=o.userData&&o.userData.thin,x=!!r&&n.groups.length>1,A=new m.Mesh(n,x?[o,r]:o);return x&&(A.renderOrder=2),A.frustumCulled=!1,A.name=l,A};function ft(e,o){const l=de.cradle,n=l.len/2,r=l.wide/2,x=-o.H,A=o.dz,a=o.rng,p=o.detail<1,c=Math.cos(l.turn*be),y=-Math.sin(l.turn*be),u=w(c,0,-y),s=w(y,0,c),t=(f,v,E)=>w(f*c+E*y,x+v,A-f*y+E*c),k="#b4bac1",I="#4d535b",g="#f1eee4";for(let f=0;f<3;f++)e.color(k,.86+.2*a()),e.box(t(0,0,(f-1)*l.wide/3),u,z,s,n,.03,l.wide/6-.01);e.color(I);for(const f of[-r+.08,r-.08])e.box(t(0,-.12,f),u,z,s,n+.06,.09,.05);const _=p?5:7;for(let f=0;f<_;f++)e.box(t(-n+l.len*f/(_-1),-.1,0),u,z,s,.05,.06,r);e.color(k,.8),e.box(t(0,.1,-r),u,z,s,n,.1,.015),e.color(k,.7),e.box(t(0,.1,r),u,z,s,n,.1,.015);for(const f of[-n,n])e.box(t(f,.1,0),u,z,s,.015,.1,r);for(let f=0;f<4;f++)e.color(f%2?g:o.paint,1.05),e.box(t(-n+1+a()*(l.len-2),.07+.06*a(),-r-.018),u,z,s,.12+.3*a(),.03+.04*a(),.003);e.color("#c3c8ce");const $=p?5:7;for(let f=0;f<$;f++){const v=-n+l.len*f/($-1);e.tube(t(v,0,-r),t(v,1.15,-r),.03,4,!0),e.tube(t(v,0,r),t(v,.8,r),.03,4,!0)}for(const f of[.62,1.15]){e.tube(t(-n,f,-r),t(n,f,-r),.032,4,!0);for(const v of[-n,n])e.tube(t(v,f,-r),t(v,f>1?.8:f,r),.03,4,!0)}e.tube(t(-n,.8,r),t(n,.8,r),.03,4,!0);for(const f of[-1,1]){const v=f*(n-.45);e.color("#c2562c"),e.tube(t(v,0,-r),t(v,2.3,-r*.45),.05,5,!0),e.tube(t(v,0,r),t(v,2.3,r*.45),.05,5,!0),e.tube(t(v,2.3,-r*.45),t(v,2.3,r*.45),.05,5,!0),e.color("#3a3f46"),e.box(t(v,1.85,0),u,z,s,.14,.24,.2),e.color("#ffd28a").lamp(3.4,0),e.ball(t(v-f*.42,2.02,0),.19,8,4),e.color("#ffc878").lamp(.7,0),e.quad(t(v,.045,-r+.06),t(v-f*1.9,.045,-r+.06),t(v-f*1.9,.045,r-.06),t(v,.045,r-.06)),e.lamp(0,0),e.color(o.rope);for(const E of[-.1,.1])e.tube(w((v+E)*c,0,0),t(v+E,2.3,0),l.rope,4,!0);e.color("#3b3f46"),e.box(w(v*c,.05,0),w(1,0,0),z,w(0,0,1),.3,.16,.14),e.color(I),e.tube(t(v,.02,r),t(v,.02,r+.25),.035,4,!0),e.color("#22252a"),e.tube(t(v-.14,.02,r+.25),t(v+.14,.02,r+.25),.14,6,!1,.14,!0)}const C=p?3:5;for(let f=0;f<C;f++){const v=-3.5+f*.72+.08*a(),E=-.24+.1*(a()-.5),O=f===1,P=f%2===1;e.color(P?g:o.paint,.9+.15*a()),e.tube(t(v,.04,E),t(v,.92,E),.3,9),e.color(O?P?"#fbf9f2":o.paint:"#c9c4b6",O?1.1:1),e.tube(t(v,O?.8:.92,E),t(v,O?.81:.94,E),.29,9,!1,.29,!0),e.color(P?o.paint:g,1.05),e.box(t(v+.1,.66,E-.3),u,z,s,.05,.24,.006)}const Y=6,D=-.2,V=3.2;for(let f=0;f<Y;f++){const v=D+V*f/Y,E=D+V*(f+1)/Y,O=.2+.16*Math.sin(f*1.9+.5),P=.2+.16*Math.sin((f+1)*1.9+.5),L=-r-.07-.05*(f%2);e.color("#e2dccb",.9+.12*a()),e.quad(t(v,1.2,-r-.04),t(E,1.2,-r-.04),t(E,P,L),t(v,O,L)),e.quad(t(v,1.2,-r-.04),t(E,1.2,-r-.04),t(E,1.2,-r+.05),t(v,1.2,-r+.05)),e.quad(t(v,1.2,-r+.05),t(E,1.2,-r+.05),t(E,.7,-r+.09),t(v,.7,-r+.09))}for(let f=0;f<3;f++)e.color("#8a8f6a",.8+.25*a()),e.box(t(1.5+.03*f,.1+f*.08,.12),u,z,s,.6-.04*f,.04,.36-.03*f);e.color("#70757c"),e.box(t(.2,.07,.1),u,z,s,.24,.035,.18),e.color(o.paint),e.box(t(.2,.11,.1),u,z,s,.21,.004,.15);const oe=p?2:3;for(let f=0;f<oe;f++){const v=2.6+f*.9,E=t(v+(f===1?1.5:-1.3)*(.7+.3*a()),3.3+.7*a(),-r-.3-.2*a()),O=t(v,.05,r*.4);e.color("#c8b890"),e.tube(O,E,.024,4,!0),e.color("#8d9299"),e.tube(E,E.clone().add(w(0,.2,0)),.014,4,!0),e.color(f===1?"#f4f1e8":o.paint,1.1),e.tube(E.clone().add(w(-.24,.26,0)),E.clone().add(w(.24,.26,0)),.075,7,!1,.075,!0)}const ie=-4.3,J=-r-.09,d=.12;e.color("#8d97a3"),e.tube(t(ie,1.15,-r),t(ie,d+.3,J),.011,4,!0),e.color("#8a9097"),e.tube(t(ie,d,J),t(ie,d+.3,J),.13,8,!1,.165),e.color(o.paint,.9),e.tube(t(ie,d+.27,J),t(ie,d+.28,J),.15,8,!1,.15,!0);const U=n-.45;return e.color(I),e.tube(t(U,2.3,0),t(U,2.75,0),.03,4,!0),e.box(t(U,2.86,0),u,z,s,.2,.12,.13),e.color("#ffe6b4").lamp(2.6,0),e.box(t(U-.205,2.86,0),u,z,s,.006,.1,.11),e.box(t(U,2.735,0),u,z,s,.17,.006,.1),e.lamp(0,0),{quad:[t(-n,-.2,-r),t(n,-.2,-r),t(n,1.15,-r),t(-n,1.15,-r)],ropes:[-1,1].map(f=>[w(f*(n-.45)*c,0,0),t(f*(n-.45),2.3,0)])}}const Te=(e,o)=>(o-e+540)%360-180,ht=e=>({t:Ve(e+90),r:Ve(e)}),ut=(e,o,l)=>new m.Quaternion().setFromRotationMatrix(new m.Matrix4().makeBasis(e,o,l)),mt=w(1,0,0),pt=w(0,0,1);async function wt(e){const o=e.ctx,l=de.cradle,n=de.rail,r=de.patch,x=e.detail,A=o.core.makeRng(o.core.hashSeed("sky-cradles:"+o.seed)),a=[],p=[],c=l.heights.slice();for(let M=0;M<3;M++)a.push(A()-.5);for(let M=0;M<3+r.cradles.length;M++)p.push([A()*6.283,A()*6.283]);for(let M=c.length-1;M>0;M--){const N=Math.floor(A()*(M+1)),ne=c[M];c[M]=c[N],c[N]=ne}const y=[(A()-.5)*3,(A()-.5)*3],u=(M,N)=>M/(ve.R*Math.cos(N/ve.R))/be,s=u(r.wide/2,0),t=e.bS+u(r.clear,0),k=t+s,I=de.stage.list,g=u(I[0].len/2,0),_=u(I[1].len/2,0),$=e.bD+1.3+g,C=$+g+.5,Y=t-1.3,D=C+(Y-C)*de.stage.mid,V=D-_-.4,oe=D+_+.4,ie=[{bearing:$,...I[0]},{bearing:D,...I[1]},{bearing:k+u(de.stage.at,0),...I[2],spray:!0}],J=[[C,V],[oe,Y]].map(([M,N],ne)=>({b:(M+N)/2+a[ne]*Math.max(0,N-M-1.6),arc:c[ne]+y[ne]}));J.push({b:k+u((r.low[0]+r.low[1])/2+a[2]*(r.low[1]-r.low[0]),0),low:!0,arc:l.lowY});for(const[M,N]of r.cradles)J.push({b:k+u(M,N),arc:N,field:!0});J.sort((M,N)=>Te(M.b,N.b)<0?1:-1);const d=new m.Group;d.name="painters-cradles";const U=[],f=[],v=[],E=w(),O=w();let P=0;for(let M=0;M<J.length;M++){const N=J[M],ne=ht(N.b);xe(N.b,n.arc,n.inset+.55,E);let ce=E.y-l.lowY,h=0;N.low||(xe(N.b,N.arc,l.off+l.len/2*Math.sin(l.turn*be),O),ce=E.y-O.y,h=Math.hypot(O.x,O.z)-Math.hypot(E.x,E.z));const q=new Ae,F=o.core.makeRng(o.core.hashSeed("sky-cradle-"+M+":"+o.seed)),T=ft(q,{H:ce,dz:h,paint:e.paint,rope:e.blue,detail:x,rng:F}),S=new m.Group,Z=we(q,e.mat,"cradle-"+M),B=ut(ne.t.clone().negate(),z,ne.r);if(S.position.copy(E),S.quaternion.copy(B),S.add(Z),d.add(S),P+=q.triangles,S.updateMatrixWorld(!0),v.push({quad:T.quad.map(he=>Z.localToWorld(he)),ropes:T.ropes.map(he=>he.map(ue=>Z.localToWorld(ue))),soft:N.low?1.1:.3,dark:N.low?.24:.42}),N.low){const he=we(Z.geometry,e.image,"image:cradle-"+M);he.renderOrder=1.5,S.add(he),P+=q.triangles}const W=Math.hypot(ce,h),G=(N.low?l.lowSway:l.sway)/W,ee=(N.low?l.lowSway*.6:l.swayIn)/W,fe=2*Math.sqrt(W),se=new m.Quaternion,le=new m.Quaternion,me=(he,ue)=>{se.setFromAxisAngle(pt,he*G),le.setFromAxisAngle(mt,ue*ee),S.quaternion.copy(B).multiply(se).multiply(le),S.updateMatrixWorld(!0)};U.push({name:"cradle "+M+(N.low?" (the low one)":N.field?" (before the unpainted stretch)":""),meshes:[Z],dims:2,set:me,low:!!N.low,at:he=>me(Math.sin(he*2*Math.PI/fe+p[M][0]),Math.sin(he*2*Math.PI/(fe*.83)+p[M][1]))}),f.push({bearing:N.b,arc:N.arc,low:!!N.low,field:!!N.field,H:ce}),await o.yield()}const L=new Ae,Q=e.bD+.4,H=k+u(Math.max(...r.cradles.map(M=>M[0]))+l.len/2+8,0)-Q,j=Math.ceil(H/.75),X=M=>xe(Q+H*M/j,n.arc,n.inset+.55);for(let M=0;M<j;M++)if(L.color(e.blue,.92),L.tube(X(M),X(M+1),.11,5,!0),M%3===0){const N=Q+H*M/j;L.color(e.blue,.8),L.tube(X(M),xe(N,n.arc+.4,.05),.07,4,!0),L.tube(X(M),xe(N,n.arc-1.6,.05),.05,4,!0)}const te=we(L,e.mat,"cradles-rail");return d.add(te),P+=L.triangles,{group:d,movers:U,statics:[te],sites:f,shades:v,stages:ie,field:{bearing:k},triangles:P}}const Ye=`
attribute vec2 aUV; varying vec2 vUV; varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vUV = aUV; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz;
#ifdef MIRROR
  wp.y = -wp.y;                                       // (its image in the sea: the same skin under the still water)
#endif
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,je=[[-.62,.2,.3],[-.25,.34,.42],[.18,.42,.5],[.58,.26,.36],[-.02,.68,.34],[.36,.7,.26],[.86,.12,.19],[-.88,.1,.17]],ze=e=>{const o=String(Math.round(e*1e4)/1e4);return/[.e]/.test(o)?o:o+"."},Ke=([e,o,l])=>`  { vec2 e = q - vec2(${ze(e)} * uCloud.z, ${ze(o)} * uCloud.w); float l = length(e), f = ${ze(l)} * uCloud.w - l; if (f > d) { d2 = d; d = f; n = e; } else d2 = max(d2, f); }`,vt="#80604f",Qe=`
uniform vec3 uFresh, uHaze, uCloudLit, uCloudShade, uLamp, uLampCol, uFillCol, uGrid, uPrimer; uniform float uKey, uFill, uBlush, uLs, uClock; uniform vec4 uBox, uCloud;
varying vec2 vUV; varying vec3 vW;
#ifdef MIRROR
uniform vec3 uLevel;
#endif
#include <fog_pars_fragment>
const float SQ = ${ze(de.patch.square)};
// (h11 AND h21 ARE THE KIT'S OWN hash11 AND hash12, of src/kit/fx.js, carried here as the kit has them: they
// follow "Hash without Sine", David Hoskins, 2014, MIT, whose notice the kit's head names and the site ships:
// covered by section 181 a, nothing brought in anew. vn is the common value noise)
float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
// THE LAW OF FILTERING HERE (fw: the pixel's footprint on the wall, metres: the diagonal of its box). A LINE OR A
// DOT DRAWN WIDER THAN IT IS CARRIES THE COVER IT TRULY HAS, WHOLE (as the kit's wire does: no floor, no share).
// ln: a line of half width w at distance d, never drawn under one footprint wide (half width fw / 2), at the
// strength w over the half width drawn (the ramp's sum across the line is twice the half width drawn, so the
// line's sum is 2 w, its own width, at every footprint). dotc: a round dot of radius r, the same BY AREA: it is
// drawn to the radius rr (r, or half a footprint if that is more) with the same ramp one footprint wide, whose
// sum over the wall is pi (rr rr + fw fw / 12) (a disc and its sloping rim; a cone when rr is half a
// footprint), so it is weighed by r r over (rr rr + fw fw / 12): THE DOT'S SUM IS pi r r, ITS OWN AREA, AT
// EVERY FOOTPRINT (summed in node: 1.000 of it from a footprint of a hundredth of the radius to thirty radii).
// So a hairline far off is a faint line and comes up as the eye nears it.
float ln(float d, float w, float fw){ float ww = max(w, .5 * fw); return clamp((ww - d) / fw + .5, 0., 1.) * (w / ww); }
float dotc(float d, float r, float fw){ float rr = max(r, .5 * fw); return clamp((rr - d) / fw + .5, 0., 1.) * (r * r) / (rr * rr + fw * fw / 12.); }
// LINES IN A ROW (plate seams, rivet rows, a chalk grid, a hatch: half width w, one every P metres, at t = 0, P,
// 2 P ...): their cover over a footprint f metres wide about t, COUNTED EXACTLY (a box filter, as the nets'). A
// line narrower than the footprint carries its true cover, 2 w over f; a footprint wider than the pitch holds
// THE ROW'S OWN MEAN, 2 w over P. A row is never let go to nothing and never to bare primer.
float row(float t, float P, float w, float f){ float k = 2. * w / P, a = (t - .5 * f + w) / P, b = (t + .5 * f + w) / P;
  return ((floor(b) * k + min(fract(b), k)) - (floor(a) * k + min(fract(a), k))) * P / f; }
// an edge's cover: d metres inside it
float cov(float d, float fw){ return clamp(d / fw + .5, 0., 1.); }
// the cloud to be: q in metres from the middle of its flat base. x: metres inside its outline (negative outside);
// yz: the place from the middle of the heap that makes the outline there; w: metres inside the next heap (the drawn-through arcs)
vec4 cloudIn(vec2 q){
  float d = -1e3, d2 = -1e3; vec2 n = vec2(0., 1.);
${je.map(Ke).join(`
`)}
  return vec4(min(d, q.y), n, min(d2, q.y)); }
// THE HEAPS ALREADY PAINTED IN (whole rounded heaps: the cloud's near half). x: metres inside their tops' outline;
// yz: the place from that heap's middle; w: metres inside the next painted heap
vec4 paintIn(vec2 q){
  float d = -1e3, d2 = -1e3; vec2 n = vec2(0., 1.);
${je.filter(e=>e[0]<.1).map(Ke).join(`
`)}
  return vec4(d, n, d2); }
// IS THE WALL'S PLATE AT p (metres along the wall from the stretch's middle, metres up it) STILL BARE PRIMER? The
// plates (5.4 by 2.7 m, staggered) are painted over one by one from the stretch's sides and top inward: a plate
// whose middle stands less than 2.2 to 8.7 m (by its own die) inside the stretch's box is painted already; the
// plates under the cloud to be (its chalked squares' width, from 1 m under its base to 2 m over its top) are all bare
float bareAt(vec2 p){ float r = floor(p.y / 2.7), o = .5 * step(1., mod(r, 2.)), c = floor(p.x / 5.4 + o);
  vec2 m = vec2((c + .5 - o) * 5.4, (r + .5) * 2.7); float d = min(min(m.x - uBox.x, uBox.y - m.x), uBox.w - m.y);
  float under = step(abs(m.x - uCloud.x), uGrid.x + 1.) * step(uCloud.y - uGrid.y - 1., m.y) * step(m.y, uCloud.y + uCloud.w + 2.);
  return max(step(2.2 + 6.5 * h21(vec2(c, r) + 17.3), d), under); }
void main(){
  float x = vUV.x, y = vUV.y, fw = max(length(fwidth(vUV)), 1e-3);
  vec2 f2 = max(1.5 * fwidth(vUV), vec2(1e-3));        // the rows' footprint: a pixel and a half along the wall, and up it
  // near, mid: ramps on variations that are as often light as dark (their mean is nothing: they obey the law as
  // they stand). fine: the rivet heads are told apart while the pixel is under a fifth of their pitch (0.3 m)
  // and are their row's mean once it is two fifths of it
  float near = 1. - smoothstep(.5, 1.6, fw), mid = 1. - smoothstep(.15, .6, fw), fine = 1. - smoothstep(.06, .12, fw);
  // THE STRETCH'S EDGE STEPS PLATE BY PLATE (ragged: never a plain rectangle, no tape, no band): the sky's own
  // painting (the wall as it stands beside it: this skin is clear there) has been carried in over the primer one
  // plate at a time (bareAt), so the bare steel's outline follows the plates' seams, in and out by whole plates;
  // where a bare plate meets a painted one the paint laps over the seam by a brush's wobble (0.1 to 0.7 m)
  vec2 pq = vec2(x / 5.4 + .5 * step(1., mod(floor(y / 2.7), 2.)), y / 2.7), pf = fract(pq), pd = min(pf, 1. - pf) * vec2(5.4, 2.7);
  float soft = max(fw, .35), wob = .1 + .6 * vn(vec2(x / 1.9 + 7., y / 1.3));
  float box = bareAt(vec2(x, y)) * mix(smoothstep(-soft, soft, pf.x * 5.4 - wob), 1., bareAt(vec2(x - 5.4, y))) * mix(smoothstep(-soft, soft, (1. - pf.x) * 5.4 - wob), 1., bareAt(vec2(x + 5.4, y)))
    * mix(smoothstep(-soft, soft, pf.y * 2.7 - wob), 1., bareAt(vec2(x, y - 2.7))) * mix(smoothstep(-soft, soft, (1. - pf.y) * 2.7 - wob), 1., bareAt(vec2(x, y + 2.7)));
  // drips of the sky's paint run down over the primer from the lowest painted plate's seam (each to a bead)
  float drip = 0.;
  for (int i = 0; i < 5; i++){ float fi = float(i), xr = mix(uBox.x + 9., uBox.y - 9., (fi + h11(fi * 3.7 + 1.3)) / 5.), len = 1.5 + 3.5 * h11(fi * 5.1 + 2.);
    float yd = floor(uBox.w / 2.7) * 2.7, go = 1.; for (int r = 0; r < 3; r++){ go *= 1. - bareAt(vec2(xr, yd - 1.35)); yd -= 2.7 * go; }
    float t = (yd - y) / len, dxr = abs(x - xr - .06 * sin(y * 2.1 + fi * 4.));
    // (its two ends are edges like any other: each by its cover over the footprint, metres inside the end)
    drip = max(drip, max(ln(dxr, mix(.09, .045, clamp(t, 0., 1.)), fw) * cov((t + .05) * len, fw) * cov((1. - t) * len, fw), dotc(length(vec2(dxr, (y - yd + len) * .7)), .1, fw))); }
  box *= 1. - drip;
  // BARE PRIMED STEEL from the wall's foot up: PRIMER IN THREE TONES, PLATE BY PLATE (an earth red, a grey, a
  // paler pink earth, by each plate's own die; a pixel wider than a plate takes their mean) on the wall's own
  // plates (5.4 by 2.7 m, staggered). THEIR SEAMS a shade darker (0.06 m wide: rows of lines 2.7 m apart up the
  // wall and 5.4 m apart along it, counted over the footprint): THEIR MEAN far off is 0.06 / 2.7 + 0.06 / 5.4 =
  // 0.033 of a seam's shade. RIVET HEADS (radius 0.035 m, one every 0.3 m, in a row 0.13 m off each seam on
  // either side): near to, each head is a dot (dotc); once the pixel outgrows their pitch (fine) a row is THE
  // MEAN OF ITS HEADS, a band as wide as a head at the strength pi * 0.035 / (2 * 0.3) = 0.18 (a head's area
  // over the band's, per pitch), and the bands are rows of lines again, so far off the rivets are THEIR MEAN,
  // 0.18 * (2 * 0.07 / 2.7 + 2 * 0.07 / 5.4) = 0.014 of a head's shine
  float xs = x + 2.7 * step(1., mod(floor(y / 2.7), 2.));      // (staggered: an odd row's seams stand half a plate along)
  float seam = 1. - (1. - row(xs, 5.4, .03, f2.x)) * (1. - row(y, 2.7, .03, f2.y));
  float rvx = length(vec2((fract(x / .3) - .5) * .3, pd.y - .13)), rvy = length(vec2(pd.x - .13, (fract(y / .3) - .5) * .3));
  float bands = 1. - (1. - min(row(xs - .13, 5.4, .035, f2.x) + row(xs + .13, 5.4, .035, f2.x), 1.)) * (1. - min(row(y - .13, 2.7, .035, f2.y) + row(y + .13, 2.7, .035, f2.y), 1.));
  float rivet = mix(.18 * bands, max(dotc(rvx, .035, fw), dotc(rvy, .035, fw)), fine);
  float tn = h21(floor(pq) + 5.1); vec3 t1 = mix(uPrimer, vec3(.4, .41, .4), .6), t2 = uPrimer * 1.14 + vec3(.025, .015, 0.);
  vec3 tone = mix(mix(mix(uPrimer, t1, step(.45, tn)), t2, step(.75, tn)), uPrimer * .45 + t1 * .3 + t2 * .25, smoothstep(1.2, 3.5, fw));
  vec3 prim = tone * (1. + (vn(vec2(x / 2.3, y / 3.1)) - .5) * .2 * near);
  prim = mix(prim, prim * .68, seam * .7); prim = mix(prim, prim * 1.3 + .02, rivet * (1. - seam));
  vec3 col = prim; float a = box;
  // THE HALF-MADE CLOUD: its near half PAINTED IN as whole rounded heaps (white tops, a warm shade under them and
  // toward its flat base, which is brushed out soft); the rest of it only chalked in outline on the primer
  vec2 q = vec2(x - uCloud.x, y - uCloud.y); vec4 ci = cloudIn(q), pn = paintIn(q);
  float hl = max(length(pn.yz), 1e-3); vec2 hn = pn.yz / hl;
  float st = vn(vec2(atan(hn.y, hn.x + 1e-4) * 4.5, hl / .45)), lit = .56 + .44 * dot(hn, normalize(vec2(uLs * .8, .62)));
  lit = (lit - .12 * (1. - smoothstep(0., 2.5, pn.x - pn.w)) * smoothstep(1., 4., pn.x)) * (.45 + .55 * smoothstep(-.02, .45, q.y / uCloud.w));
  lit = clamp(lit + (vn(q / 2.3) - .5) * .2 + (st - .5) * .14 * mid, 0., 1.);
  vec3 warm = mix(uCloudShade, vec3(.78, .62, .54), .55), white = vec3(1., .985, .95);
  vec3 painted = mix(warm, white, smoothstep(.2, .78, lit));
  painted = mix(painted, painted * vec3(1.06, .9, .82), uBlush * (1. - lit) * .6);
  float pm = cov(pn.x - .1 + .5 * (vn(q / 1.1) - .5) * near, fw) * smoothstep(0., 1.8, q.y + .6 * (vn(vec2(q.x / 1.7, 2.)) - .5)) * box;
  col = mix(col, painted, pm);
  // THE REST OF THE SAME CLOUD, blocked in with chalk on the primer: a pale scumble inside its outline, hatched
  // aslant (plainly one cloud: part painted, part chalked). THE HATCH: strokes 0.2 m wide, 1.13 m apart (a row
  // of lines, counted over the footprint across them): ITS MEAN far off is 0.2 / 1.13 = 0.18 of a stroke
  float ht = (q.x + q.y) * .70711, wash = cov(ci.x - .15, fw) * (1. - pm) * box;      // (ci.x is metres inside the outline, its flat base too: the one edge, by its cover)
  col = mix(col, vec3(.93, .95, .94), wash * (.2 + .3 * row(ht - .56569, 1.13137, .1, max(1.5 * fwidth(ht), 1e-3))));
  // THE CHALK ON THE PRIMER. THE GRID OF SQUARES (lines 0.08 m wide, one every SQ m both ways, at 0.45 of the
  // chalk): rows of lines counted over the footprint; near to a faint grid, far off ITS OWN MEAN, 0.45 * (0.08 /
  // SQ + 0.08 / SQ) = 0.018 of the chalk with squares of 4 m (never nothing). THE CLOUD'S OUTLINE (0.32 m wide)
  // and its drawn-through arcs (0.09 m wide, half as strong): each is ONE line, not a row: under a pixel wider
  // than itself it carries its true cover (ln), which is its own mean over that pixel at every footprint, so no
  // ramp ends it
  float inG = cov(min(min(q.x + uGrid.x, uGrid.x - q.x), min(q.y + uGrid.y, uGrid.z - q.y)) + .06, fw);
  float grid = (1. - (1. - row(q.x, SQ, .04, f2.x)) * (1. - row(q.y, SQ, .04, f2.y))) * inG * .45;
  // (under the base no place is nearer the outline than the base itself, so the line ends by its own ramp there;
  // the drawn-through arcs show from 0.3 m inside the outline on: that edge by its cover)
  float outl = max(ln(abs(ci.x), .16, fw), .5 * ln(abs(ci.w), .045, fw) * cov(ci.x - .3, fw));
  float ch = max(grid, outl) * (1. - pm) * box * .9;        // chalk lies only on the primer
  col = mix(col, vec3(.93, .95, .94), ch);
  // a few test swatches beside the cloud, brushed on the primer: a column of three blues, a column of two whites
  for (int i = 0; i < 5; i++){ float fi = float(i), wh = mod(fi, 2.); vec2 c = vec2(uCloud.x - uCloud.z - 3.6 + 2.2 * wh, uCloud.y + 9. + 2.1 * floor(fi / 2.));
    vec2 e = abs(vec2(x, y) - c) - vec2(.9, .8) - .14 * (vn(vec2(x, y) / .35 + fi * 7.) - .5) * mid;
    float sw = cov(-max(e.x, e.y), fw) * box;
    col = mix(col, mix(mix(uFresh, uHaze, .25 * fi), mix(white, warm, .5 * step(2.5, fi)), wh), sw); }
  // white runs come down under the painted heaps' base (each to a bead)
  float wruns = 0.;
  for (int i = 0; i < 3; i++){ float fi = float(i), xr = uCloud.x + uCloud.z * (-.75 + .3 * fi + .1 * h11(fi * 2.9 + 7.)), len = 1.2 + 2.6 * h11(fi * 4.3 + 5.);
    float t = (uCloud.y - y) / len, dxr = abs(x - xr - .05 * sin(y * 2.6 + fi * 3.));
    wruns = max(wruns, max(ln(dxr, mix(.07, .04, clamp(t, 0., 1.)), fw) * cov((t + .02) * len, fw) * cov((1. - t) * len, fw), dotc(length(vec2(dxr, (y - uCloud.y + len) * .7)), .09, fw))); }
  col = mix(col, vec3(.92, .925, .9), wruns * box);
  // light as the wall's own: the dome's fill and the lamp-sun's key
  vec3 nrm = -normalize(vW), Lv = uLamp - vW; vec3 Ln = Lv * inversesqrt(max(dot(Lv, Lv), 1.));
  col *= uFillCol * uFill + uLampCol * (uKey * .87 * smoothstep(0., .22, clamp(dot(nrm, Ln), 0., 1.)));
  #ifdef USE_FOG
    float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth); col = mix(col, fogColor, ff);
  #endif
  gl_FragColor = vec4(col * a, a);
#ifdef MIRROR
  // ITS IMAGE IN THE SEA, by the law the hero's sea gives (as the rigs' own images are laid): as strong as the
  // water mirrors by the ray's slant, its edge broken by the ripples at the water's own place, its depth the depth
  // where the eye's ray meets the level ${Fe} m, worked from the pixel's own place as theirs is (uLevel, the
  // rigs' own: levelAim); what stands under the water has no image
  { vec3 E = cameraPosition; float k0 = clamp(E.y / max(E.y + vW.y, 1e-3), 0., 1.); vec2 wxz = E.xz + (vW.xz - E.xz) * k0; float fww = max(length(fwidth(wxz)), 1e-4);
    float cosT = E.y / max(length(vec3(wxz.x - E.x, E.y, wxz.y - E.z)), 1e-3), gz = 1. - clamp(cosT, 0., 1.);
    float rp = vn(wxz * .55 + uClock * vec2(.1, .16)) * .55 + vn(wxz * 1.9 - uClock * vec2(.27, .12)) * .45;
    float al = (.74 + .24 * gz * gz) * mix(1., mix(smoothstep(.36, .64, rp), .5, smoothstep(.5, 2., fww)), .24);
    gl_FragColor = vec4(gl_FragColor.rgb * (.88 * al), gl_FragColor.a * al);
    // (TWO STEPS OF THE DEPTH DEEPER THAN ITS OWN: this image is laid before the rigs', and what hangs before the
    // wall, however near it and however far off, then has its image's depth, and the one step its first corners
    // add, nearer than the wall's image: so a rig's image is always laid over the wall's, never lost in a tie)
    gl_FragDepth = clamp(dot(uLevel.xy, gl_FragCoord.xy) + uLevel.z - .02 * (1. - gl_FragCoord.z), 0., 1.) + 2. / 16777216.;
    if (vW.y < 0.) discard; }
#endif
}`;function $e(e,o,l,n){const r=e&&e.shell&&e.shell.shell&&e.shell.shell.geometry,x=[];if(r&&r.index){const a=r.attributes.position.array,p=r.index.array;for(let c=0;c<p.length;c+=3){const y=p[c]*3,u=p[c+1]*3,s=p[c+2]*3,t=(a[y]+a[u]+a[s])/3,k=(a[y+1]+a[u+1]+a[s+1])/3,I=(a[y+2]+a[u+2]+a[s+2])/3;if(k>n||k<-20||Math.abs(Te(o,Le(t,I)))>l)continue;const g=(a[u+1]-a[y+1])*(a[s+2]-a[y+2])-(a[u+2]-a[y+2])*(a[s+1]-a[y+1]),_=(a[u+2]-a[y+2])*(a[s]-a[y])-(a[u]-a[y])*(a[s+2]-a[y+2]),$=(a[u]-a[y])*(a[s+1]-a[y+1])-(a[u+1]-a[y+1])*(a[s]-a[y]);x.push([a[y],a[y+1],a[y+2],a[u],a[u+1],a[u+2],a[s],a[s+1],a[s+2],g,_,$,g*a[y]+_*a[y+1]+$*a[y+2]])}}const A=(a,p,c,y,u,s)=>{const t=a[c]-a[p],k=a[c+1]-a[p+1],I=a[c+2]-a[p+2],g=y-a[p],_=u-a[p+1],$=s-a[p+2];return(k*$-I*_)*a[9]+(I*g-t*$)*a[10]+(t*_-k*g)*a[11]};return a=>{let p=1/0;for(const c of x){const y=c[9]*a.x+c[10]*a.y+c[11]*a.z;if(Math.abs(y)<1e-9)continue;const u=c[12]/y;if(!(u>1&&u<p))continue;const s=a.x*u,t=a.y*u,k=a.z*u,I=-1e-6*(c[9]*c[9]+c[10]*c[10]+c[11]*c[11]);A(c,0,3,s,t,k)>=I&&A(c,3,6,s,t,k)>=I&&A(c,6,0,s,t,k)>=I&&(p=u)}return p<1/0?p:ve.R}}const bt=e=>{const o=Ee[e],l=new m.Color(o.haze).lerp(new m.Color(o.mid),.95).lerp(new m.Color(o.zen),.6),n=.2126*l.r+.7152*l.g+.0722*l.b;return l.setRGB(Math.max(0,n+(l.r-n)*1.05),Math.max(0,n+(l.g-n)*1.05),Math.max(0,n+(l.b-n)*1.05))};function yt(e){const o=de.patch,l=e.look,n=Ee[l],r=Be[l],x=O=>({value:new m.Color(O)}),A=e.detail<1,a=e.bearing,p=o.wide/2+1,c=-.6,y=o.a1+1,u=A?30:44,s=A?16:22,t=o.square,k=$e(e.sky,a,p/ve.R/be+5,140),I=[],g=[],_=[],$=w();for(let O=0;O<=s;O++)for(let P=0;P<=u;P++){const L=-p+2*p*P/u,Q=c+(y-c)*O/s,H=a+L/(ve.R*Math.cos(Q/ve.R))/be;xe(H,Q,0,$).normalize();const j=k($)-.07;I.push($.x*j,$.y*j,$.z*j),g.push(L,Q)}for(let O=0;O<s;O++)for(let P=0;P<u;P++){const L=O*(u+1)+P;_.push(L,L+1,L+u+2,L,L+u+2,L+u+1)}const C=new m.BufferGeometry;C.setAttribute("position",new m.Float32BufferAttribute(I,3)),C.setAttribute("aUV",new m.Float32BufferAttribute(g,2)),C.setIndex(_),C.computeBoundingSphere();const Y=Math.max(-1,Math.min(1,Math.sin((Ze.looks[l].bearing-a)*be)*2.5)),D=new m.ShaderMaterial({vertexShader:Ye,fragmentShader:Qe,fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!1,side:m.DoubleSide,forceSinglePass:!0,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{...m.UniformsUtils.clone(m.UniformsLib.fog),uLamp:e.sky.shadow.uLamp,uFresh:{value:e.fresh},uHaze:x(n.haze),uCloudLit:x(n.cloudLit),uCloudShade:x(n.cloudShade),uLampCol:{value:new m.Color().setRGB((1+r.color[0])/2,(1+r.color[1])/2,(1+r.color[2])/2)},uFillCol:x(n.fill),uPrimer:x(vt),uKey:{value:r.key},uFill:{value:r.fill},uBlush:{value:n.blush},uLs:{value:Y},uBox:{value:new m.Vector4(-o.wide/2,o.wide/2,0,o.a1)},uCloud:{value:new m.Vector4(0,o.cloudBase,o.cloudHalf,o.cloudH)},uGrid:{value:new m.Vector3(Math.ceil(o.cloudHalf*1.08/t)*t,t,Math.ceil(o.cloudH*1.06/t)*t)},uClock:e.clock,uLevel:e.level}}),V=new m.Mesh(C,D);V.frustumCulled=!1,V.renderOrder=1,V.name="unpainted-stretch-and-half-made-cloud";const oe=[],ie=[],J=[],d=16,U=8;for(let O=0;O<=U;O++)for(let P=0;P<=d;P++){const L=-p+2*p*P/d,Q=y*O/U;xe(a+L/(ve.R*Math.cos(Q/ve.R))/be,Q,.5,$),oe.push($.x,$.y,$.z),ie.push(L,Q)}for(let O=0;O<U;O++)for(let P=0;P<d;P++){const L=O*(d+1)+P;J.push(L,L+1,L+d+2,L,L+d+2,L+d+1)}const f=new m.BufferGeometry;f.setAttribute("position",new m.Float32BufferAttribute(oe,3)),f.setAttribute("aUV",new m.Float32BufferAttribute(ie,2)),f.setIndex(J),f.computeBoundingSphere();const v=new m.ShaderMaterial({vertexShader:Ye,fragmentShader:Qe,fog:!0,transparent:!0,premultipliedAlpha:!0,depthWrite:!0,side:m.DoubleSide,forceSinglePass:!0,defines:{MIRROR:1},uniforms:D.uniforms}),E=new m.Mesh(f,v);return E.frustumCulled=!1,E.renderOrder=1.5,E.name="image:unpainted-stretch",{mesh:V,material:D,bearing:a,image:E,imageMaterial:v,triangles:_.length/3+J.length/3}}async function xt(e){const o=de.moon,l=e.detail<1,n=e.blue,r=e.ctx.core.makeRng(e.ctx.core.hashSeed("sky-moon:"+e.ctx.seed))()*2*Math.PI,x=(e.length-o.before)/e.length,A=e.path.pointAt(x,w()),a=e.path.tangentAt(x,w()).setY(0).normalize(),p=w(a.z,0,-a.x),c=A.clone().setY(0).addScaledVector(p,o.near),y=a.clone(),u=p.clone().negate(),s=(i,b,R)=>c.clone().addScaledVector(y,i).addScaledVector(u,R).setY(b),t=new Ae,k=o.pontoon[0]/2,I=o.pontoon[1]/2,g=o.deck;t.color("#d39a26"),t.box(s(0,g/2-.4,0),y,z,u,k,g/2+.4,I),t.color("#1c150d"),t.box(s(0,.5,0),y,z,u,k+.03,.8,I+.03);for(const i of[-1,0,1])for(const b of[-1,1]){const R=s(i*(k-.7),g,b*(I-.7));t.color("#2b3037"),t.tube(R,R.clone().setY(g+3.4),.06,4,!0),t.color("#ffe2a6").lamp(3.2,0),t.tube(R.clone().setY(g+3.4),R.clone().setY(g+3.95),.3,5,!1,.22,!0),t.lamp(0,0)}t.color("#f6f3ea"),t.box(s(0,g-.4,0),y,z,u,k+.05,.36,I+.05),t.color("#c9c5b6"),t.box(s(0,g+.02,0),y,z,u,k-.15,.02,I-.15),t.color("#17191c");for(const i of[-9,-3,3,9])t.tube(s(i,.6,I+.33),s(i,2.8,I+.33),.32,6,!1,.32,!0);const _=(i,b)=>{t.color("#d6a92b");for(const R of[-.3,.3])t.tube(s(i+R,g,b),s(i+R,g+.7,b),.16,6,!1,.2,!0)};for(const i of[-1,1]){for(const ae of[-1,1])_(i*(k-1.1),ae*(I-.8));const b=s(i*(k+7),0,-2.5),R=s(i*(k-1.1),g+.5,-(I-.8));t.color("#f1ecdc"),t.tube(b.clone().setY(-.3),b.clone().setY(.85),.75,8,!1,.75,!0),t.color("#c7492b"),t.tube(b.clone().setY(.45),b.clone().setY(.7),.77,8),t.color("#3a3d44"),t.tube(b.clone().setY(.85),b.clone().setY(1.5),.06,4,!0),t.color("#d9d2bd");let K=R;for(let ae=1;ae<=5;ae++){const re=ae/5,pe=R.clone().lerp(b.clone().setY(.9),re);pe.y-=1.3*4*re*(1-re),t.tube(K,pe,.035,3,!0),K=pe}}t.color("#c3c8ce");const $=l?3:5;for(const i of[-1,1]){for(let b=0;b<=$;b++){const R=-k+2.4+(2*k-4.8)*b/$;t.tube(s(R,g,i*(I-.2)),s(R,g+1.1,i*(I-.2)),.03,4,!0)}for(const b of[.6,1.1])t.tube(s(-k+2.4,g+b,i*(I-.2)),s(k-2.4,g+b,i*(I-.2)),.03,4,!0)}t.color("#f1ede2"),t.box(s(-6.3,g+1.3,-2.2),y,z,u,1.7,1.3,1.5),t.color("#3b4149"),t.box(s(-6.3,g+2.68,-2.2),y,z,u,1.9,.08,1.7),t.color("#2a2f36");for(const i of[-1,0,1])t.box(s(-6.3+i*1,g+1.5,-.68),y,z,u,.36,.6,.02);t.color("#c2562c");for(const i of[-1,1])t.tube(s(6.1+i*.75,g+1.25,-2.6),s(6.1+i*.82,g+1.25,-2.6),1.2,10,!1,1.2,!0);t.color("#1c1f24"),t.tube(s(6.1-.75,g+1.25,-2.6),s(6.1+.75,g+1.25,-2.6),.8,10),t.color("#a8a59c");for(let i=0;i<3;i++)t.box(s(6.3,g+.3+i*.56,3.6),y,z,u,1.8,.26,.9);t.color("#2f353c"),t.box(s(0,g+.13,0),y,z,u,3.9,.11,3.9),t.color("#d6a92b");for(const i of[-1,1])for(const b of[-1,1])t.box(s(i*3.1,g+.7,b*3.1),y,z,u,.8,.46,.8);const C=o.tower/2,Y=g+4.5,D=l?6:8,V=i=>Y+(o.ring-1.2-Y)*i/D,oe=[[-1,-1],[1,-1],[1,1],[-1,1]];t.color(n,.8),oe.forEach(([i,b],R)=>{const[K,ae]=oe[(R+1)%4];t.tube(s(i*3.1,g+1.1,b*3.1),s(i*C,Y,b*C),.2,5,!0),t.tube(s(i*3.1,g+1.1,b*3.1),s(K*3.1,g+1.1,ae*3.1),.16,4,!0),t.tube(s(i*3.1,g+1.1,b*3.1),s(K*C,Y,ae*C),.09,4,!0),t.tube(s(i*C,Y,b*C),s(K*C,Y,ae*C),.09,4,!0)});for(let i=0;i<D;i++)oe.forEach(([b,R],K)=>{const[ae,re]=oe[(K+1)%4],pe=V(i),ye=V(i+1),ge=(i+K)%2;t.color("#2f353c"),t.tube(s(b*C,pe,R*C),s(b*C,ye,R*C),.2,4,!0),t.color(n,.78),t.tube(s(b*C,ye,R*C),s(ae*C,ye,re*C),.08,4,!0),t.tube(s((ge?ae:b)*C,pe,(ge?re:R)*C),s((ge?b:ae)*C,ye,(ge?R:re)*C),.08,4,!0),t.tube(s((ge?b:ae)*C,pe,(ge?R:re)*C),s((ge?ae:b)*C,ye,(ge?re:R)*C),.08,4,!0)});t.color("#3b4149"),oe.forEach(([i,b],R)=>{const[K,ae]=oe[(R+1)%4],re=C-.02;t.quad(s(i*re,V(0),b*re),s(K*re,V(0),ae*re),s(K*re,V(D),ae*re),s(i*re,V(D),b*re))}),t.color(n,.7),t.tube(s(0,o.ring-1.2,0),s(0,o.ring-.1,0),2,12,!1,2,!0);const ie=we(t,e.mat,"moon-crane (pontoon and tower)"),J=we(ie.geometry,e.image,"image:moon-crane");J.renderOrder=1.5,await e.ctx.yield();const d=new Ae,U=w(1,0,0),f=w(0,0,1),v=o.foot,E=o.jib;d.color(n,.75),d.tube(w(0,-.1,0),w(0,.9,0),1.9,12,!1,1.9,!0),d.color(n,.85),d.box(w(.4,1.05,0),U,z,f,2.6,.16,1.7);const O=w(2.5,1.3,3.05);d.color("#ece8dc"),d.box(O,U,z,f,1.5,1.3,1.1),d.color(n,.8),d.box(O.clone().add(w(0,-.85,0)),U,z,f,1.52,.14,1.12),d.color("#3b4149"),d.box(O.clone().add(w(0,1.36,0)),U,z,f,1.65,.06,1.25),d.color("#0c1118"),d.box(O.clone().add(w(1.51,.3,0)),U,z,f,.012,.72,.95);for(const i of[-1,1])d.box(O.clone().add(w(.2,.35,i*1.11)),U,z,f,1.15,.62,.012);const P=w(-.4,o.apex,0);d.color(n,.85);for(const[i,b]of[[1.6,1.1],[1.6,-1.1],[-2.2,1.1],[-2.2,-1.1]])d.tube(w(i,1.2,b),P,.14,4,!0);const L=l?13:19,Q=1.6,H=(i,b)=>{const R=(i-Q)/(E-Q),K=1.05-.45*R,ae=2.3-1.2*R;return b===2?w(i,v+ae,0):w(i,v,(b?1:-1)*K)};for(let i=0;i<L;i++){const b=Q+(E-Q)*i/L,R=Q+(E-Q)*(i+1)/L;d.color("#2f353c");for(let K=0;K<3;K++)d.tube(H(b,K),H(R,K),K===2?.16:.14,4,!0);d.color("#3b4149");for(const K of[0,1])d.quad(H(b,K),H(R,K),H(R,2),H(b,2));d.color(n,.8),d.tube(H(b,0),H(R,2),.06,4,!0),d.tube(H(b,1),H(R,2),.06,4,!0),d.tube(H(b,2),H(R,0),.06,4,!0),d.tube(H(b,2),H(R,1),.06,4,!0),d.tube(H(R,0),H(R,1),.06,4,!0),i%2===0&&d.tube(H(b,0),H(R,1),.05,4,!0)}d.color(n,1.05);for(const i of[.42,.84])d.tube(P,H(Q+(E-Q)*i,2),.05,4,!0);d.color("#ff3a24").lamp(2.2,0),d.ball(P.clone().add(w(0,.35,0)),.28,8,4),d.ball(H(E,2).add(w(0,.35,0)),.24,8,4),d.lamp(0,0),d.color(n,.85);for(const i of[-1,1])d.box(w(-o.tail/2-.4,v,i),U,z,f,o.tail/2-.4,.2,.13);d.color(n,.7),d.box(w(-o.tail/2-.4,v+.2,0),U,z,f,o.tail/2-.8,.03,.9),d.color("#ece8dc"),d.box(w(-5.2,v+1.15,0),U,z,f,1.5,.9,.85),d.color("#a8a59c");for(let i=0;i<4;i++)d.box(w(-o.tail+.38+i*.74,v-1,0),U,z,f,.32,1.35,1.3);d.color(n,1.05);for(const i of[-1,1])d.tube(P,w(-o.tail+.8,v+.2,i),.05,4,!0);const j=o.reach,X=o.globe,te=w(j,v-o.drop-X,0);d.color("#3b4149"),d.box(w(j,v-.28,0),U,z,f,1.2,.2,.75);for(const i of[-1,1])d.tube(w(j+i*1.7,v-.4,0),w(j+i*.7,te.y+X+.9,0),.16,4,!0);d.color("#2f353c");for(const i of[-.5,.5])d.quad(w(j-1.7,v-.4,i),w(j+1.7,v-.4,i),w(j+.7,te.y+X+.9,i),w(j-.7,te.y+X+.9,i));d.color("#4a515b"),d.tube(te.clone().add(w(0,X-.1,0)),te.clone().add(w(0,X+.95,0)),.85,8,!1,.5,!0);const M=l?20:30,N=l?10:14,ne=e.look?1.02:1.08,ce=a.clone(),h=w().crossVectors(ce,z),q=s(0,o.ring,0).addScaledVector(ce,te.x);q.y+=te.y;const F=et(e.look,0).sub(q).normalize(),T=w(F.dot(ce),F.y,F.dot(h)).normalize(),S=w().crossVectors(T,z).normalize(),Z=w().crossVectors(S,T),B=[[.42,.3,.32],[-.3,.45,.26],[.1,-.38,.3]].map(([i,b,R])=>[T.clone().addScaledVector(S,i).addScaledVector(Z,b).normalize(),Math.cos(R)]),W=new m.Color("#fff1d2"),G=(i,b)=>{const R=-Math.PI/2+Math.PI*b/N,K=i/M*2*Math.PI;return w(te.x+Math.cos(K)*Math.cos(R)*X,te.y+Math.sin(R)*X,te.z+Math.sin(K)*Math.cos(R)*X)};for(let i=0;i<N;i++)for(let b=0;b<M;b++){const R=G(b+.5,i+.5).sub(te).normalize(),K=B.some(([ae,re])=>R.dot(ae)>re)?.8:1;d.col.copy(W).multiplyScalar(K),d.lamp(ne,4),d.quad(G(b,i),G(b,i+1),G(b+1,i+1),G(b+1,i))}d.lamp(0,0).color("#6f6a5e"),d.tube(te.clone().add(w(0,-.14,0)),te.clone().add(w(0,.14,0)),X+.09,M);const ee=(i,b,R,K)=>{let ae=i.clone();for(let re=1;re<=K;re++){const pe=re/K,ye=i.clone().lerp(b,pe);ye.y-=R*4*pe*(1-pe),d.tube(ae,ye,.1,4,!0),ae=ye}},fe=l?5:8,se=i=>3+(j-12)*i/fe;d.color("#20242a");for(let i=0;i<fe;i++)ee(w(se(i),v-.12,.3),w(se(i+1),v-.12,.3),1.5,5);ee(w(j-9,v-.12,.3),te.clone().add(w(-.6,X+.95,.2)),3.2,8);const le=s(0,o.ring,0),me=we(d,e.mat,"moon-jib"),he=we(me.geometry,e.image,"image:moon-jib"),ue=new m.Group;he.renderOrder=1.5,ue.name="moon-jib",ue.position.copy(le),ue.add(me,he);const Se=o.slew*be,Re=w(),We=w(),Xe=new m.Matrix4,Ne=i=>{const b=i*Se;return Re.copy(a).multiplyScalar(Math.cos(b)).addScaledVector(p,Math.sin(b))},Ce=i=>{Ne(i),We.crossVectors(Re,z),ue.quaternion.setFromRotationMatrix(Xe.makeBasis(Re,z,We)),ue.updateMatrixWorld(!0)},He=i=>Math.sin(i*2*Math.PI/o.period+r),qe=(i,b=w())=>(Ne(He(i)),b.copy(le).addScaledVector(Re,te.x).setY(le.y+te.y));Ce(0);const Pe=e.mat.uniforms,De=w();return{group:ue,fixed:ie,images:[J],place:c,head:le,globeAt:qe,light:i=>{qe(i,Pe.uMoonAt.value),e.sky.lampAt(i,De),Pe.uMoonSun.value.copy(De).sub(Pe.uMoonAt.value).normalize()},triangles:2*(t.triangles+d.triangles),mover:{name:"the moon's jib and globe",meshes:[me],dims:1,set:Ce,at:i=>Ce(He(i))}}}async function gt(e,o,l,n,r,x){o.updateMatrixWorld(!0);const A=new Set,a=[],p=[],c=new Set,y=new m.Matrix4,u=h=>Array.isArray(h.material)?h.material[0]:h.material;for(const h of r)for(const q of h.meshes)A.add(q);o.traverse(h=>{h.isMesh&&(u(h)===l?a.push(h):u(h)===n&&p.push(h))});const s=[null],t=new Map;for(const h of a)A.has(h)||!h.matrixWorld.equals(y)?s.length<Oe&&(t.set(h,s.length),s.push(h)):t.set(h,0);const k=a.filter(h=>t.has(h)),I=new Set(k.map(h=>h.geometry)),g=p.filter(h=>I.has(h.geometry));for(const h of g)c.add(h.geometry);const _=h=>{const q=h.geometry,F=q.groups.length>1?q.groups[1]:null;return F?[F.start,F.count]:[q.attributes.position.count,0]},$=(h,q,F)=>{const T=h.geometry.attributes.aAxis.array,S=[];let Z=-1,B=-1;for(let W=q;W<q+F;W+=3){const G=W*4,ee=(W+2)*4;Z>=0&&T[G]===T[Z]&&T[G+1]===T[Z+1]&&T[G+2]===T[Z+2]&&T[G+3]===T[Z+3]&&T[ee]===T[B]&&T[ee+1]===T[B+1]&&T[ee+2]===T[B+2]||(Z=G,B=ee,Math.hypot(T[ee]-T[G],T[ee+1]-T[G+1],T[ee+2]-T[G+2])>1e-5&&S.push(W))}return S},C=(h,q)=>{const F=h.geometry.attributes.position.array,T=h.geometry.attributes.normal.array,S=new Float32Array(q/3),Z=Array.from(S,(B,W)=>W);for(let B=0,W=0;B<S.length;B++,W+=9)S[B]=(T[W]*(F[W]+F[W+3]+F[W+6])+T[W+1]*(F[W+1]+F[W+4]+F[W+7])+T[W+2]*(F[W+2]+F[W+5]+F[W+8]))/3;return Z.sort((B,W)=>S[W]-S[B]||B-W)},Y=[[],[],[],[]];for(const h of k){const q=c.has(h.geometry),[F,T]=_(h);if(F&&Y[q?1:0].push([h,0,F,null,q?C(h,F):null]),T){const S=$(h,F,T);S.length&&Y[q?2:3].push([h,F,6*S.length,S])}}const D=Y.map(h=>h.reduce((q,F)=>q+F[2],0)),V=D[1],oe=V+D[0]+D[1]+D[2]+D[3],ie=["position","normal","color","aGlow","aAxis"],J=[3,3,3,2,4],d=J.map(h=>new Float32Array(oe*h)),U=new Float32Array(oe),f=new Float32Array(oe),v=[[0,-1],[0,1],[1,-1],[0,-1],[1,-1],[1,1]];let E=0,O=0;for(const[h,q]of[[Y[1],3],[Y[1],0],[Y[2],0],[Y[3],0],[Y[0],0]])for(const[F,T,S,Z,B]of h){const W=F.geometry.attributes;if(!Z&&B)ie.forEach((G,ee)=>{const fe=J[ee]*3,se=W[G].array;B.forEach((le,me)=>d[ee].set(se.subarray(le*fe,(le+1)*fe),E*J[ee]+me*fe))}),q&&f.fill(q,E,E+S);else if(!Z)ie.forEach((G,ee)=>{const fe=J[ee];d[ee].set(W[G].array.subarray(T*fe,(T+S)*fe),E*fe)});else{const G=W.aAxis.array,ee=W.color.array,fe=W.aGlow.array;let se=E;for(const le of Z)for(const[me,he]of v){const ue=(le+2*me)*4,Se=(le+2-2*me)*4;d[0][se*3]=G[ue],d[0][se*3+1]=G[ue+1],d[0][se*3+2]=G[ue+2],d[1][se*3+1]=1,d[2][se*3]=ee[le*3],d[2][se*3+1]=ee[le*3+1],d[2][se*3+2]=ee[le*3+2],d[3][se*2]=fe[le*2],d[3][se*2+1]=fe[le*2+1],d[4][se*4]=G[Se],d[4][se*4+1]=G[Se+1],d[4][se*4+2]=G[Se+2],d[4][se*4+3]=G[le*4+3],f[se]=he,se++}}U.fill(t.get(F),E,E+S),E+=S,O+=S,O>3e4&&(O=0,await e.yield())}const P=new m.BufferGeometry;ie.forEach((h,q)=>P.setAttribute(h,new m.BufferAttribute(d[q],J[q]))),P.setAttribute("aSlot",new m.BufferAttribute(U,1)),P.setAttribute("aSide",new m.BufferAttribute(f,1)),P.addGroup(V,oe-V,0),D[2]+D[3]&&P.addGroup(V+D[1],D[2]+D[3],1),await e.yield(),P.computeBoundingSphere();const L=new m.Mesh(P,[l,l.userData.thin]);L.name="rigs (every painted body, joined)",L.renderOrder=2.1,L.frustumCulled=!1;const Q=new m.BufferGeometry;for(const h of Object.keys(P.attributes))Q.setAttribute(h,P.attributes[h]);Q.setDrawRange(0,V+D[1]+D[2]),Q.boundingSphere=P.boundingSphere;const H=new m.Mesh(Q,n);H.name="image:rigs (every imaged body, joined)",H.renderOrder=1.56,H.frustumCulled=!1;const j=V+D[1],X=D[2],te=[];if(X){let h=null;o.traverse(B=>{!h&&B.isMesh&&B.material===x&&B.matrixWorld.equals(y)&&(h=B)});const q=h?h.geometry.attributes:null,F=h?q.position.count:0,T=new m.BufferGeometry;ie.forEach((B,W)=>{const G=J[W],ee=new Float32Array((F+X)*G);h&&ee.set(q[B].array.subarray(0,F*G)),ee.set(d[W].subarray(j*G,(j+X)*G),F*G),T.setAttribute(B,new m.BufferAttribute(ee,G))});const S=new Float32Array(F+X),Z=new Float32Array(F+X);if(S.set(U.subarray(j,j+X),F),Z.set(f.subarray(j,j+X),F),T.setAttribute("aSlot",new m.BufferAttribute(S,1)),T.setAttribute("aSide",new m.BufferAttribute(Z,1)),T.boundingSphere=h?h.geometry.boundingSphere:P.boundingSphere,h)h.geometry=T;else{const B=new m.Mesh(T,x);B.name="image:rigs (thin members drawn wider than they are)",B.renderOrder=1.6,B.frustumCulled=!1,te.push(B)}}const M=new Set([...k,...g]),N=[],ne=new m.Group;ne.name="rigs-skins (kept, not drawn)",o.traverse(h=>{(h.isMesh||h.isPoints)&&!M.has(h)&&!h.userData.joined&&N.push(h)});for(const h of[...o.children])ne.add(h);for(const h of N)o.attach(h);o.add(H,L,...te),o.updateMatrixWorld(!0);const ce=l.uniforms.uMove.value;return{skins:ne,pose(){for(let h=1;h<s.length;h++)ce[h].copy(s[h].matrixWorld)},dispose(){ne.traverse(h=>{h.geometry&&h.geometry.dispose()})}}}const At=e=>{let o=0;return e.traverse(l=>{if(!l.isMesh)return;const n=l.geometry,r=n.index?n.index.count:n.attributes.position.count,x=n.drawRange.start,A=Math.min(r,x+n.drawRange.count);o+=(Array.isArray(l.material)?n.groups.reduce((a,p)=>a+Math.max(0,Math.min(A,p.start+p.count)-Math.max(x,p.start)),0):A-x)/3}),o};async function Rt(e,o){const l=o.look,n=o.sky,r=o.length,x=new m.Group;x.name="sky-rigs";const A=o.detail!=null?o.detail:e.quality&&e.quality.detail?e.quality.detail:1,a=dt(l,n.shadow),p=e.core.makeRng(e.core.hashSeed("sky-movers:"+e.seed)),c=2*Math.PI,y={beacons:[p(),p(),p()],weight:p()*c,hook:[p()*c,p()*c],cage:p()*c},u=o.path.pointAt(o.marks.D/r,w()),s=o.path.pointAt(o.marks.E/r,w()),t=Le(u.x,u.z),k=t+Te(t,Le(s.x,s.z)),I=tt(o.path,r,o.marks.C,o.marks.D),g=o.marks.D+Ge.shadow.hold+Ge.shadow.open,_=ot(o.path,r,I,g),$=t+Te(t,_.hi);await e.yield();const C="#"+new m.Color(Ee[l].mid).lerp(new m.Color(Ee[l].haze),.25).getHexString(),Y=ct(a),D=bt(l),V=await wt({ctx:e,detail:A,mat:a,image:Y,bD:t,bS:$,paint:D,blue:C});x.add(V.group),await e.yield();const oe=yt({ctx:e,detail:A,sky:n,look:l,bearing:V.field.bearing,fresh:D,clock:a.uniforms.uClock,level:a.uniforms.uLevel});x.add(oe.mesh,oe.image),await e.yield();const ie=(A<1?21:30)*V.stages.length,J=e.core.makeRng(e.core.hashSeed("sky-stages:"+e.seed)),d=st({Geo:Ae,mesh:we,V:w,UP:z},{mat:a,detail:A,blue:C,paint:D,wide:de.stage.wide,off:de.stage.off,list:V.stages,top:S=>xe(S,de.rail.arc,de.rail.inset+.55),fix:S=>xe(S,de.rail.arc+.6,.05),dice:Array.from({length:ie},()=>J())});x.add(d.mesh),await e.yield();const U=de.front,f=S=>S/ve.R/be,v=Me.list.map(S=>f(S.bays*Me.bay/2+Me.over)),E=Math.max(V.field.bearing+f(de.patch.wide/2+U.gap),k+f(U.pastE))+v[0],O=E+v[0]+f(U.between)+v[1],P=e.core.makeRng(e.core.hashSeed("sky-wall-scaffolds:"+e.seed)),L=nt({Geo:Ae,mesh:we,V:w,UP:z},{mat:a,image:Y,detail:A,blue:C,paint:D,dice:Array.from({length:_e()},()=>P()),list:[{bearing:E,...Me.list[0]},{bearing:O,...Me.list[1]}]});x.add(L.group),await e.yield();const Q=it({V:w},{look:l,list:[...V.shades,...d.shades],wall:S=>$e(n,S,5,140)});x.add(Q.mesh),await e.yield();const H=await xt({ctx:e,detail:A,mat:a,image:Y,look:l,sky:n,path:o.path,length:r,blue:C});x.add(H.fixed,H.group,...H.images),await e.yield();const j=[...V.movers,H.mover],X=[...V.statics,H.fixed,oe.mesh,Q.mesh,d.mesh,...L.statics],te=[],M=at({Geo:Ae,mesh:we,V:w,UP:z},{ctx:e,detail:A,mat:a,sky:n,length:r,ring:o.ring,phases:y});x.add(M.group),te.push(M),j.push(...M.movers),X.push(...M.statics),await e.yield();const N=Ue(a,!1),ne=Ue(a,!0),ce=await rt({Geo:Ae,mesh:we,V:w,UP:z},{ctx:e,detail:A,mat:a,image:Y,net:N,netImage:ne,look:l,path:o.path,length:r,C:o.marks.C,D:o.marks.D,blue:C,phases:y});x.add(ce.group),j.push(...ce.movers),X.push(...ce.statics),await e.yield();const h=await gt(e,x,a,Y,j,ne),q=lt(a.uniforms.uLevel);x.traverse(S=>{S.isMesh&&!Array.isArray(S.material)&&S.material.defines&&S.material.defines.MIRROR&&(S.onBeforeRender=q)}),await e.yield();const F=new m.Vector2,T={object:x,movers:j,statics:X,material:a,skin:oe,sites:V.sites,stages:V.stages,scaffolds:L.sites,shadowWall:{from:I,to:g,lo:_.lo,hi:_.hi,top:_.top},turret:H.head,pontoon:H.place,scaffold:ce,triangles:At(x),moonAt:H.globeAt,dice:{mast:ce.dice,stages:[ie,d.diceRead],scaffolds:[_e(),L.diceRead]},update(S,Z,B){for(const W of j)W.at(Z);H.light(Z);for(const W of te)W.update(S,Z,B);h.pose(),a.uniforms.uClock.value=Z,e.renderer&&(e.renderer.getDrawingBufferSize(F),a.uniforms.uPix.value=2/Math.max(F.y,1))},dispose(){x.traverse(S=>{S.geometry&&S.geometry.dispose()}),h.dispose(),a.dispose(),a.userData.thin.dispose(),Y.dispose(),N.dispose(),ne.dispose(),oe.material.dispose(),oe.imageMaterial.dispose(),Q.material.dispose();for(const S of te)S.dispose&&S.dispose()}};return T.update(0,0,null),T}export{Ae as Geo,de as RIGS,Rt as makeRigs};
