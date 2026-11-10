import*as t from"three";import{makePath as et,clamp as k,smoothstep as tt}from"../kit/core.js";import{COMMON as p,SKY as Ee,makeShared as ot,HALL as O,FIELD as _,HOOP as v,REST as Le,TRACK as c,TRACK_LEN as he,SPHERE_R as F,POINT as fe,sphereS as at,spherePos as Ve}from"../parts/country-with-no-up-glsl.js";import{makePlan as st}from"../parts/country-with-no-up-plan.js";import{buildPeople as rt}from"../parts/country-with-no-up-people.js";import{buildHero as nt}from"../parts/country-with-no-up.js";const it=50,ct=[_.x-_.r-30,_.z],Be=`
uniform vec4 uRc[16], uRn[16], uRcol[16];      // the hero's rings (its NR)
float cosI;
vec3 glassCol(vec3 P, vec3 V, float fp){
  cosI = clamp(-V.y, 0., 1.); float fres = mirrorK(cosI);
  vec3 col = uPal[7]*(0.30 + 0.22*cN(P.xz*0.011 + 3.) + 0.14*cN(P.xz*0.21)*(1. - smoothstep(0.8, 5., fp)));
  vec3 Rr = normalize(vec3(V.x, max(-V.y, 0.004), V.z));
  vec3 refl = skyCol(Rr);
  float dn = dot(Rr, uRn[0].xyz); dn = abs(dn) < 1e-3 ? 1e-3 : dn;
  float t = dot(uRc[0].xyz - P, uRn[0].xyz)/dn; vec3 hp = P + Rr*t - uRc[0].xyz;
  float e = abs(length(hp) - uRc[0].w), w = 9. + 0.03*max(t, 0.);
  refl += uRcol[0].rgb*uRcol[0].w*0.16*step(0., t)*exp(-e*e/(w*w))*(0.35 + 0.9*cN(P.xz*vec2(0.9, 0.11) + vec2(0., uTime*0.2)));
  vec3 oc = P - uSphere.xyz; float b = dot(oc, Rr), c = dot(oc, oc) - uSphere.w*uSphere.w, disc = b*b - c;
  if (disc > 0. && b < 0.) {
    float sd = sqrt(max(disc, 0.)); vec3 N = (oc + Rr*(-b - sd))/uSphere.w;
    float o2 = 1. - clamp(-dot(Rr, N), 0., 1.);
    vec3 ball = vec3(0.50, 0.62, 0.95)*(0.06 + 0.6*o2*o2*o2) + fogLight(P.xz)*0.6*clamp(-N.y + 0.3, 0., 1.);
    refl = mix(refl, ball, smoothstep(0., 6., sd));
  }
  float rl = min(uFogP.z/Rr.y, 1200.), rT = exp(-uFogP.x*rl);
  refl = refl*rT + fogLight(P.xz + Rr.xz*min(rl, 150.)*0.5)*(1. - rT);
  return col + refl*fres;
}`,Ce=`
float rainBand(vec2 p){
  float bz = p.y - uTime*12. + 0.3*p.x + 140.*(cN(p*0.0021 + 4.) - 0.5);
  float m = cN(vec2(bz/330., uRain.y));
  return uRain.x*smoothstep(0.62 - 0.3*uRain.x, 0.76 - 0.3*uRain.x, m);
}`,lt=`
varying vec3 vD;
void main(){ vD = position; vec4 p = projectionMatrix*modelViewMatrix*vec4(position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,dt=p+Ee+Be+`
varying vec3 vD;
void main(){
  vec3 d = normalize(vD); vec3 col; float L = 1.0e5;
  if (d.y >= 0.) col = skyCol(d);
  // the glass runs on beyond its mesh: its far points are asked no further out than 30 km, but the mist is reckoned
  // along the whole ray down to the glass, so no ray near the horizon is counted as missing the mist
  else { L = uEye.y/max(-d.y, 1e-4); float Lp = min(L, 3.0e4); col = glassCol(vec3(uEye.x + d.x*Lp, 0., uEye.z + d.z*Lp), d, 50.); }
  vec4 fg = slabFogRay(d, L);
  // the far mist's low glow: where a ray is lost in the mist beyond the country's edge, the mist there is the glow
  // that lies along the horizon (so the far glass runs up into the horizon's band with no line between them). The
  // place asked is where the ray ends its way through the slab: on the glass, or at the slab's top.
  float tEnd = d.y < 0. ? L : clamp((uFogP.z - uEye.y)/max(d.y, 1e-4), 0., 3.0e4);
  col = col*fg.a + fg.rgb + horizon(d)*(1. - fg.a)*(1. - edgeDim(uEye.xz + d.xz*tEnd));
  col += (cH(gl_FragCoord.xy + fract(uTime)*71.) - 0.5)*0.0012;                       // fine grain: depth, not a flat card
  gl_FragColor = vec4(max(col, 0.), 1.);
}`,ut=p+`
varying vec3 vW;
void main(){ vW = vec3(position.x + uEye.x, 0., position.z + uEye.z); vec4 p = projectionMatrix*viewMatrix*vec4(vW.x, uLift, vW.z, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p; }`,vt=p+Ee+Be+Ce+`
uniform sampler2D uOcc; uniform vec4 uOccR;      // r: where houses stand, g: where the roads run; x0, z0, size
varying vec3 vW;
float occ(vec2 p){ return textureLod(uOcc, (p - uOccR.xy)/uOccR.z, 0.).r; }
void main(){
  vec3 P = vW, V = P - uEye; float dist = length(V); V /= max(dist, 1e-3);
  float fp = max(length(dFdx(P.xz)), length(dFdy(P.xz)));
  vec3 col = glassCol(P, V, fp);                         // (the horizon's band is in it as the glass mirrors it: by the angle of sight, never by how far the eye is)
  // the glass holds the light of what stands on it, most where the roads have worn it bright
  float road = textureLod(uOcc, (P.xz - uOccR.xy)/uOccR.z, 0.).g;
  float grainy = 0.75 + 0.5*cN(P.xz*0.045) - 0.3*cN(P.xz*0.31)*(1. - smoothstep(0.5, 4., fp));
  float ed = edgeDim(P.xz);                              // toward the country's far edge its light on the glass dims away
  col += (townGlow(P.xz)*(0.02 + 0.05*road)*grainy + uPal[7]*0.25*road)*mix(0.3, 1., smoothstep(0.2, 0.8, cosI))*ed;     // seen from above; at a grazing eye the glass is a mirror
  // rain on the glass: a glitter of splashes, and a dry wedge trailing south of every house (the rain comes from the north)
  float rb = rainBand(P.xz);
  if (rb > 0.003) {
    float dry = max(occ(P.xz), max(occ(P.xz + vec2(0., -9.)), max(0.75*occ(P.xz + vec2(0., -20.)), 0.45*occ(P.xz + vec2(0., -33.)))));
    float wet = rb*(1. - clamp(dry*1.3, 0., 1.))*ed;      // the rain glitters by the country's light
    vec2 cid = floor(P.xz/0.35); float ph = fract(cH(cid) + uTime*(1.4 + cH(cid + 7.)));
    float fine = 1. - smoothstep(0.06, 0.4, fp);
    float rr = length(fract(P.xz/0.35) - 0.5 - 0.3*(vec2(cH(cid + 11.), cH(cid + 5.)) - 0.5));
    float splash = step(0.6, cH(cid + 3.))*exp(-ph*7.)*(1. - smoothstep(0.0, 0.06, rr - 0.03 - 0.1*ph));
    col += vec3(0.42, 0.75, 0.85)*wet*(0.55*splash*fine + 0.012 + 0.03*(1. - fine));
  }
  vec4 fg = slabFog(P);
  // beyond the country's edge the glass that is lost in the mist takes the far mist's low glow (as in the dome)
  gl_FragColor = vec4(col*fg.a + fg.rgb + horizon(V)*(1. - fg.a)*(1. - ed), 1.);
}`,ht=p+Ce+`
attribute vec3 aSeed;
uniform vec4 uFocus;            // x, z, box size, -
varying vec3 vW; varying vec2 vQ; varying float vA;
void main(){
  float B = uFocus.z;
  vec2 c = vec2(aSeed.x*B, aSeed.y*B + uTime*30.);
  c = uFocus.xy + (fract((c - uFocus.xy)/B + 0.5) - 0.5)*B;
  float dist = length(vec3(c.x, 0.5, c.y) - uEye), hw = max(0.07, 0.6*dist/uPx);
  vec3 P = vec3(c.x + position.x*hw, 0.56, c.y + position.y*1.25);
  vec2 e = abs(c - uFocus.xy)/B;
  vA = rainBand(c)*(1. - smoothstep(0.4, 0.5, max(e.x, e.y)))*mix(1., 0.07/hw, 0.7)*(0.5 + 0.5*aSeed.z);
  vQ = position.xy; vW = P;
  gl_Position = projectionMatrix*viewMatrix*vec4(P.x, P.y + uLift, P.z, 1.);
}`,ft=p+`
varying vec3 vW; varying vec2 vQ; varying float vA;
void main(){
  float a = clamp(vA, 0., 1.)*(1. - abs(vQ.x))*(1. - smoothstep(0.3, 1., abs(vQ.y)))*(0.55 + 0.45*vQ.y);
  vec4 fg = slabFog(vW);
  gl_FragColor = vec4(vec3(0.55, 0.85, 0.95)*1.9*a*fg.a, 0.);
}`,pt=p+`
attribute vec4 aSeed;
uniform vec4 uBox;              // centre xyz, size
varying vec2 vQ; varying vec3 vW; varying float vA;
// right and up of a card at c that faces the eye's PLACE (never the lens: a card does not turn when the gaze turns)
void faceEye(vec3 c, out vec3 r, out vec3 u){
  vec3 f = uEye - c; float l = length(f); f = l > 1e-4 ? f/l : vec3(0., 0., 1.);
  r = cross(vec3(0., 1., 0.), f); float rl = length(r); r = rl > 1e-3 ? r/rl : vec3(1., 0., 0.);
  u = cross(f, r);
}
void main(){
  float B = uBox.w;
  vec3 c = aSeed.xyz*B + vec3(uTime*0.7, uTime*0.22*(aSeed.w - 0.3), uTime*0.45) + 1.4*vec3(sin(uTime*0.4 + aSeed.w*40.), sin(uTime*0.33 + aSeed.w*23.), cos(uTime*0.37 + aSeed.w*31.));
  c = uBox.xyz + (fract((c - uBox.xyz)/B + 0.5) - 0.5)*B;
  float dist = max(length(c - uEye), 0.05), s = 0.03 + 0.05*aSeed.w;
  vec3 cr, cu; faceEye(c, cr, cu);
  vec3 P = c + (cr*position.x + cu*position.y)*s;
  vec3 e = abs(c - uBox.xyz)/B;
  vA = (1. - smoothstep(0.3, 0.5, max(e.x, max(e.y, e.z))))*smoothstep(0.8, 3., dist)*smoothstep(0.6, 2.0, c.y)*(0.5 + 0.5*sin(uTime*1.7 + aSeed.w*90.))*clamp(s*uPx/dist/2.2, 0., 1.);
  vQ = position.xy; vW = P;
  gl_Position = projectionMatrix*viewMatrix*vec4(P.x, P.y + uLift, P.z, 1.);
}`,gt=p+`
varying vec2 vQ; varying vec3 vW; varying float vA;
void main(){
  float r = min(dot(vQ, vQ), 9.), a = clamp(vA, 0., 1.)*(1. - smoothstep(0.35, 1., r));
  gl_FragColor = vec4(vec3(0.80, 0.86, 0.98)*0.07*a, 0.);
}`,mt=p+`
uniform vec4 uSpot; uniform float uSpotV;      // place and radius; how tall it is for its width (1: round)
varying vec2 vQ; varying vec3 vW;
// right and up of a card at c that faces the eye's PLACE (never the lens: a card does not turn when the gaze turns)
void faceEye(vec3 c, out vec3 r, out vec3 u){
  vec3 f = uEye - c; float l = length(f); f = l > 1e-4 ? f/l : vec3(0., 0., 1.);
  r = cross(vec3(0., 1., 0.), f); float rl = length(r); r = rl > 1e-3 ? r/rl : vec3(1., 0., 0.);
  u = cross(f, r);
}
void main(){
  vec3 cr, cu; faceEye(uSpot.xyz, cr, cu);
  vec3 P = uSpot.xyz + (cr*position.x + cu*position.y*uSpotV)*uSpot.w;
  vQ = position.xy; vW = P;
  gl_Position = projectionMatrix*viewMatrix*vec4(P.x, P.y + uLift, P.z, 1.);
}`,yt=p+`
uniform vec4 uSpotCol, uSpotK;  // colour and strength; core tightness and gain, halo tightness and gain
varying vec2 vQ; varying vec3 vW;
void main(){
  float r2 = min(dot(vQ, vQ), 9.), a = (uSpotK.y*exp(-r2*uSpotK.x) + uSpotK.w*exp(-r2*uSpotK.z))*uSpotCol.a*(1. - smoothstep(0.5, 1., r2));
  vec4 fg = slabFog(vW);
  gl_FragColor = vec4(uSpotCol.rgb*a*fg.a, 0.);
}`,xt=p+`
varying vec3 vL, vN, vW;
void main(){
  vL = position; vN = normal;
  vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz;
  gl_Position = projectionMatrix*viewMatrix*vec4(w.x, w.y + uLift, w.z, 1.);
}`,wt=p+`
varying vec3 vL, vN, vW;
void main(){
  vec3 red = uPal[6], col;
  if (abs(vN.y) > 0.5) {
    vec2 p = vL.xz; float d = max(abs(p.x), abs(p.y)) - 3.25, fw = max(fwidth(d), 1e-4);
    float w = max(0.3, 1.3*fw), rim = 1. - clamp(0.5 - (d + w)/fw, 0., 1.);
    vec2 q = p/6.5;
    float nuc = exp(-dot(q - vec2(0.03, 0.02), q - vec2(0.03, 0.02))/0.010), ch = exp(-dot(q - vec2(-0.1, -0.2), q - vec2(-0.1, -0.2))/0.016) + exp(-dot(q - vec2(0.12, 0.2), q - vec2(0.12, 0.2))/0.012);
    float beat = 0.5 + 0.5*sin(uTime*9.0); beat *= beat; beat *= beat;
    float heart = exp(-dot(q - vec2(0.1, -0.04), q - vec2(0.1, -0.04))/0.0012)*(0.35 + 0.65*beat);
    vec3 inner = uPal[7]*1.4 + red*(0.42*exp(clamp(d, -40., 0.)/1.5) + 0.24*ch + 0.07) + uPal[3]*(0.6*nuc + 1.9*heart);      // a living figure, lit inside
    col = mix(inner, red*3.0*(0.8 + 0.4*smoothstep(-3.25, 3.25, p.y)), rim);
    vec2 ge = p - vec2(0., 3.05); col += uPal[3]*2.6*exp(-dot(ge, ge)/0.10)*(0.7 + 0.3*sin(uTime*2.3));      // its eye: a small glint on its leading edge
  } else col = red*2.4;
  col += uPal[4]*circleLight(vW.xz)*0.25*exp(-max(vW.y, 0.)/40.);
  vec4 fg = slabFog(vW);
  gl_FragColor = vec4(col*fg.a + fg.rgb, 1.);
}`,zt=p+`
attribute vec4 aSeed;
uniform vec3 uTrk0, uTrkD; uniform float uTrkL;      // the hoop's middle; the way down the track; the track's length to the resting ball's skin
varying vec2 vQ; varying float vA;
vec3 onHelix(float s, float a, float z){
  vec3 U = normalize(cross(uTrkD, vec3(1., 0., 0.))), W = cross(uTrkD, U);
  float rad = (0.12 + 0.5*z)*(46. - 0.09*s);           // inside the rings: at most five eighths of a ring's radius at that place
  return uTrk0 + uTrkD*s + (U*cos(a) + W*sin(a))*rad;
}
void main(){
  float v = 6. + 8.*aSeed.w, turn = 0.45;              // metres a second up the track; radians a second about it
  float s = mod(aSeed.x*uTrkL - uTime*v, uTrkL), a = aSeed.y*6.2831853 + uTime*turn;
  float lag = (7. + 6.*fract(aSeed.z*7.13))/v;         // seconds of its own path that the streak shows
  vec3 c0 = onHelix(s, a, aSeed.z), c1 = onHelix(s + v*lag, a - turn*lag, aSeed.z), ax = c1 - c0;
  vec3 f = uEye - 0.5*(c0 + c1); float l = length(f); f = l > 1e-4 ? f/l : vec3(0., 0., 1.);
  vec3 side = cross(ax, f); float sl = length(side); side = sl > 1e-4 ? side/sl : vec3(1., 0., 0.);
  vec3 P = mix(c0, c1, 0.5 + 0.5*position.y) + side*position.x*0.14;
  vA = smoothstep(0., 30., s)*(1. - smoothstep(uTrkL - 50., uTrkL, s))*smoothstep(3., 15., l);
  vQ = position.xy;
  gl_Position = projectionMatrix*viewMatrix*vec4(P.x, P.y + uLift, P.z, 1.);
}`,St=p+`
varying vec2 vQ; varying float vA;
void main(){
  float x = clamp(vQ.x, -1., 1.), head = 0.5 - 0.5*clamp(vQ.y, -1., 1.);       // bright at its head, fading down its tail
  gl_FragColor = vec4(uPal[4]*0.8*vA*(1. - x*x)*head*head, 0.);
}`,Y={transparent:!0,depthWrite:!1,depthTest:!0,blending:t.CustomBlending,blendEquation:t.AddEquation,blendSrc:t.OneFactor,blendDst:t.OneFactor,side:t.DoubleSide},g=tt;function pe(s,Q,R){const V=new t.PlaneGeometry(2,2),S=new t.InstancedBufferGeometry,f=new Float32Array(s*Q);for(let m=0;m<f.length;m++)f[m]=R();return S.index=V.index,S.setAttribute("position",V.attributes.position),S.setAttribute("aSeed",new t.InstancedBufferAttribute(f,Q)),S.instanceCount=s,S}var Rt={id:"country-with-no-up",name:"The Country with No Up",category:"books",placeKind:"bizarre",book:"Flatland",author:"Edwin A. Abbott, 1838 to 1926",weirdness:.95,async build(s){const Q=s.rng,R=s.vary||{},V=s.quality?.detail??1,S=new t.Scene,f={};for(const e of["day","roads","houses","scatter","people","field","home","doors","rain","motes","sway","clock","standin","avenue","blocks"])f[e]=Q.fork(e);const m=f.day,Z=f.clock.range(0,600),H=!!R.rare,ge=m()<1/3||H,me=m.pick([16,20,24]),$=m.pick([8,8,6]),ye=m.pick(["drill","drill","market","procession"]),xe=m.range(.7,1.4),ee=m.pick([0,.55,.8,1]),te=["night","day","golden"].includes(R.hour)?R.hour:R.hour==="dawn"?"golden":m.pick(["day","day","night","golden"]),q={day:{crowd:1,home:.35,rooms:.85,walls:1},night:{crowd:.42,home:1.9,rooms:1.8,walls:1.12},golden:{crowd:.85,home:.6,rooms:1.15,walls:1.4}}[te],De=k(R.density??1,.7,1.3),n=ot();n.uFogP.value.set(.008*xe,.25,7,1.1),n.uAge.value.set(ge?1:0,H?800:1e5,0,0),n.uHour.value.set(q.rooms,q.walls,0,0),n.uRain.value.set(ee,m.range(0,50),0,0),te==="golden"&&(n.uGl.value[0].w=1.5,n.uGlC.value[3].set("#F2B24E"));const G=n.uGl.value;G[0].w*=.1,G[1].w=.035,G[2].w=.035,G[3].w=.04,await s.yield();const oe=[[0,1,480],[0,1,455],[0,1,430],[0,1,405],[0,1.3,385],[.3,3.4,365],[.8,7.6,345],[2,14.5,320],[4,28,286],[6,46,250],[12,92,170],[16,128,90],[15,142,22],[5,134,-38],[-27,112,-90],[-66,84,-134],[-100,60,-178],[-104,42,-228],[-98,42,-272],[-80,44,-310],[-52,52,-345],[-22,68,-372]],_e=e=>[v.x+c.x*e,v.y+c.y*e,v.z+c.z*e],Ne=he-F-1.25*F;for(let e=5;e>=0;e--)oe.push(_e(Ne*e/5));const y=et(oe),A=y.length,i=new t.Vector3,ae=e=>{for(let o=0;o<=A;o+=.5)if(y.posAtDist(o,i),e(i))return o;return A},We=ae(e=>e.y>oe[0][1]+.2),Oe=ae(e=>e.z<O.z),K=ae(e=>Math.hypot(e.x-_.x,e.z-_.z)<_.r);let we=0;for(let e=0,o=-1;e<=K;e+=.5)y.posAtDist(e,i),i.y>o&&(o=i.y,we=e);const Qe={leave:0,touch:Oe,half:K,end:A},ze=y.posAtDist(We,new t.Vector3).z,He=y.posAtDist(we,new t.Vector3).z,se=e=>at(k(e,0,1)*A,Qe),U=[];let re=1e9,ne=-1e9,ie=1e9,ce=-1e9;for(let e=0;e<=A;e+=2)y.posAtDist(e,i),i.y<8&&(U.push(i.x,i.z),re=Math.min(re,i.x),ne=Math.max(ne,i.x),ie=Math.min(ie,i.z),ce=Math.max(ce,i.z));const qe=(e,o,a)=>{if(e<re-a||e>ne+a||o<ie-a||o>ce+a)return!1;for(let r=0;r<U.length;r+=2){const d=U[r]-e,u=U[r+1]-o;if(d*d+u*u<a*a)return!0}return!1};await s.yield();const l=await st(s,{forks:f,clock0:Z,spokes:$,field:ye,crowd:q.crowd*De*(.55+.45*V),home:q.home,squareNear:ct,tooNear:qe});await s.yield();const Se=await rt(s,l,n,{hallSides:me,gates:$,wallColor:"#F2B24E",hallColor:"#F6C878",doors:f.doors});await s.yield();const j=[0,1,2,3,4].map(()=>f.sway.range(0,6.2832)),B=await nt(s,{shared:n,mapObjects:Se.mapObjects,sway:j,standin:f.standin});S.add(Se.group,B.object),await s.yield();const E=(e,o,a={},r={})=>new t.ShaderMaterial({vertexShader:e,fragmentShader:o,uniforms:{...n,...B.uniforms,...r},...a}),L=(e,o)=>(e.frustumCulled=!1,e.renderOrder=o,S.add(e),e),Ge=L(new t.Mesh(new t.SphereGeometry(4300,40,20),E(lt,dt,{side:t.BackSide,depthWrite:!1,depthTest:!1})),-10),N=new t.DataTexture(l.glow,l.glowN,l.glowN,t.RGBAFormat,t.UnsignedByteType);N.minFilter=N.magFilter=t.LinearFilter,N.generateMipmaps=!1,N.needsUpdate=!0,n.uGlow.value=N,n.uGlowR.value.set(l.occ0,l.occ0,1/l.occSize,1);const C=new t.DataTexture(l.occ,l.occN,l.occN,t.RGFormat,t.UnsignedByteType);C.unpackAlignment=1,C.minFilter=C.magFilter=t.LinearFilter,C.generateMipmaps=!1,C.needsUpdate=!0;const Ke=L(new t.Mesh(new t.CircleGeometry(4700,40).rotateX(-Math.PI/2),E(ut,vt,{depthWrite:!1,depthTest:!1},{uOcc:{value:C},uOccR:{value:new t.Vector4(l.occ0,l.occ0,l.occSize,0)}})),-9);Ke.matrixAutoUpdate=!1,await s.yield();const le={value:new t.Vector4(0,380,440,0)},be={value:new t.Vector4(0,20,480,90)},Ue=L(new t.Mesh(pe(Math.round(6e3*(.5+.5*V)),3,f.rain),E(ht,ft,Y,{uFocus:le})),6);Ue.visible=ee>0;const je=L(new t.Mesh(pe(Math.round(800*V),4,f.motes),E(pt,gt,Y,{uBox:be})),8);await s.yield();const Pe=(e,o,a,r=1)=>L(new t.Mesh(new t.PlaneGeometry(2,2),E(mt,yt,Y,{uSpot:e,uSpotCol:o,uSpotK:{value:new t.Vector4(...a)},uSpotV:{value:r}})),1),Te={value:new t.Vector4(fe.x,fe.y,fe.z,44)},ke={value:new t.Vector4(.93,.92,.98,1)},bt=Pe(Te,ke,[60,1.5,5,.1]),Ae=L(new t.Mesh(new t.BoxGeometry(6.5,.5,6.5),E(xt,wt)),0),I=l.sqHome,Me={value:new t.Vector4(I[0],.75,I[1],11)},Ie={value:new t.Vector4(1,.085,.03,.07)},Je=Pe(Me,Ie,[8,.6,3,.12]);Je.renderOrder=4;const Fe=e=>{const o=j[4]+e*.2,a=Ae.position;a.set(I[0]+.6*Math.cos(o),.35,I[1]+.6*Math.sin(o*.73+1.3)),Ae.rotation.y=.5*Math.sin(e*.17+j[4]),n.uSq.value.set(a.x,a.y,a.z,1),Me.value.set(a.x,a.y+.4,a.z,11)};Fe(Z);const Pt=L(new t.Mesh(pe(90,4,s.core.makeRng(s.core.hashSeed("trackmotes:"+s.seed))),E(zt,St,Y,{uTrk0:{value:v},uTrkD:{value:c},uTrkL:{value:he-F}})),6);await s.yield();const Xe=e=>{const o=e.x-v.x,a=e.y-v.y,r=e.z-v.z,d=o*c.x+a*c.y+r*c.z;return Math.hypot(o-c.x*d,a-c.y*d,r-c.z*d)};let Re=K,J=1e9;for(let e=K;e<=A;e+=.5){const o=y.posAtDist(e,i).distanceTo(Le)-F;o<J&&(J=o,Re=e)}const Ye=(e,o)=>{const a=B.ringAt;let r=-1;for(let T=0;T<a.length;T++)a[T]<e&&(r=T);const d=r>=0?a[r]:0,u=r>=1?a[r-1]:0,b=r+1<a.length?a[r+1]:he,P=d+(u-d)*k((b-e)/Math.max(b-d,1),0,1);return o.set(v.x+c.x*P,v.y+c.y*P,v.z+c.z*P)},x=new t.Vector3,h=new t.Vector3,M=new t.Vector3,w=new t.Vector3,Ze=(e,o)=>{Ve(se(o),M),y.pointAt(k(o,0,1),w);const a=w.z-O.z,r=w.z-M.z,d=w.distanceTo(v);x.set(O.x,0,O.z-30),h.set(M.x,Math.max(M.y,0)*.45+45*(1-g(20,110,M.y)),M.z+20),x.lerp(h,1-g(0,O.court,a)),h.set(M.x-40,40,M.z-60),x.lerp(h,1-g(40,115,r)),h.copy(v),h.y-=110*g(60,260,d),x.lerp(h,1-g(-1.2*F,F/4,r));const u=k(o,0,1)*A<Re?0:g(J,2*J,w.distanceTo(Le)-F)*g(1,F,Xe(w));if(u>0){Ye((w.x-v.x)*c.x+(w.y-v.y)*c.y+(w.z-v.z)*c.z,h),x.sub(w),h.sub(w);const b=x.length()||1,P=h.length()||1,T=b+(P-b)*u;x.divideScalar(b),h.divideScalar(P);const D=Math.acos(k(x.dot(h),-1,1)),ve=Math.sin(D);ve>1e-4?x.multiplyScalar(Math.sin((1-u)*D)/ve).addScaledVector(h,Math.sin(u*D)/ve):x.lerp(h,u),x.normalize().multiplyScalar(T).add(w)}return x},X=new t.Vector3,de=new t.Vector3,$e=e=>{y.pointAt(k(e,0,1),X),Ve(se(e),de);const o=X.distanceTo(de)-80;return .55+.45*g(1.2,12,X.y)-.25*g(70,110,o)*(1-g(250,330,o))*g(0,60,X.z-de.z)+.35*(1-g(45,70,o))},z=new t.Vector3,W=new t.Vector3,ue=new t.Vector2;return{scene:S,path:y,duration:it,ride:"none",companion:"none",style:"none",variant:{age:ge?"grey":"colour",rare:H,sides:me,spokes:$,field:ye,hour:te,rain:ee,fog:xe,shutLanes:l.shutLanes},pace:$e,camera:{fov:62,near:.2,nearThrough:.3,far:5e3,sway:.4,bank:.4},pois:[{at:Ze,from:0,to:1,weight:.72,fade:70/A}],portal:{shape:"circle",radius:7,color:"#EDEBFA",glow:.55,tilt:!0,revealDistance:420},post:{exposure:1,bloom:{strength:.48,radius:.55,threshold:.9},grade:{saturation:1.1,contrast:1.08,tint:"#ffffff",shadowTint:"#070A1C",vignette:.35,grain:.02,aberration:0}},update(e,o,a,r){z.setFromMatrixPosition(a.matrixWorld);const d=s.through?Math.min(0,z.y-.9):0,u=o+Z;n.uLift.value=d,n.uEye.value.set(z.x,z.y-d,z.z),n.uTime.value=u,s.renderer&&(s.renderer.getDrawingBufferSize(ue),ue.y>0&&(n.uPx.value=.5*ue.y*a.projectionMatrix.elements[5])),Ge.position.copy(z);const b=n.uEye.value.y;y.tangentAt(k(r,0,1),W);const P=Math.hypot(W.x,W.z)||.001,T=Math.min(190+b,340);le.value.x=z.x+W.x/P*T,le.value.y=z.z+W.z/P*T,be.value.set(z.x,b,z.z,30),H&&(y.pointAt(k(r,0,1),i),n.uAge.value.y=800-2300*g(0,ze-He,ze-i.z)),B.setS(se(r),u),Fe(u);const D=Math.sin(u*6.2832/7+j[3]);Te.value.w=44+8*D,ke.value.w=.85+.3*D,je.visible=!s.through,s.renderer&&B.renderMap(s.renderer)},dispose(){B.dispose()}}}};export{Rt as default};
