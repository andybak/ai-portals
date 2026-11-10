import*as e from"three";import{mergeGeometries as Ke}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as ht,clamp as te,lerp as Y,smoothstep as k}from"../kit/core.js";import{makeSky as gt,makeCloudFieldAsync as bt,makeLightRig as yt}from"../kit/sky.js";import*as Ae from"../kit/water.js";import*as pe from"../kit/flora.js";import*as Q from"../kit/fauna.js";import{buildHero as wt}from"../parts/the-green-room.js";const se=470,xt=38,St=66,le=Math.PI,he=le/180,$=(o,a)=>{if(a<=o[0][0])return o[0][1];for(let i=1;i<o.length;i++)if(a<=o[i][0]){const g=o[i-1],l=o[i];return Y(g[1],l[1],k(g[0],l[0],a))}return o[o.length-1][1]},ge=(o,a,i,g)=>k(a,a+g,o)*(1-k(i-g,i,o)),Mt=[[0,-3.5,13.5],[.03,-3.4,13.4],[.055,-3,12.6],[.085,-1.6,8.6],[.125,.3,3.3],[.17,-.5,2.1],[.22,2.8,6],[.27,.2,2.3],[.33,2.5,5.5],[.4,4.4,8.2],[.47,4.2,7.6],[.53,3.4,6.6],[.6,4.06,6.4],[.66,4.06,5.8],[.72,2.5,3.6],[.8,.5,3.5],[.87,-.8,5],[.935,-1.15,6.1],[1,-1.5,7.2]],At=[[0,0],[.125,3],[.3,8],[.48,10],[.6,-15],[.7,-17],[.83,-14]],zt=[[0,-30],[.03,-30],[.06,-12],[.085,12],[.125,50],[.3,68],[.5,72],[.62,52],[.72,56]],Nt=[[0,-75],[.1,-70],[.2,-50],[.48,-48],[.6,-25.5],[.66,-28],[.76,-48]],Xe=[[0,50],[.12,70],[.3,96],[.6,93],[.8,94],[1,98]],Ye=[[0,-12.5],[.12,-15],[.3,-11.5],[.7,-12],[.86,-17],[1,-23]];function kt(o,a,i){const g=St-(1-o)*se;return i.lz=Y($(At,o),g,k(.76,.88,o)),i.zp=(1-o)*se+i.lz,i.mouthZ=Math.min(Y($(zt,o),i.zp,k(.72,.8,o)),84),i.foamZ=$(Nt,o),i.pinch=k(a.pinch[0],a.pinch[0]+.07,o)*(1-k(a.pinch[1],a.pinch[1]+.07,o)),i.rad=Y(1,a.rmin,i.pinch),i.reveal=k(.28,.42,o)*(1-a.dim*i.pinch)*a.reveal,i.spit=te((o-.655)/.13,0,1),i.leap=o<.7?te((o-.425)/.045,0,1.6):te((o-.865)/.045,0,1.6),i}const Ct={morning:{pal:["#083040","#0c5f6e","#2fc7a0","#7fd6e0","#eafff6","#ffd9a8","#ffb23e"],sun:[24,25],sky:{preset:"goldenHour",zenith:"#58c4d0",mid:"#a4dccc",horizon:"#ffd9a8",ground:"#0c5f6e",scatterColor:"#ffb23e",scatter:.6,sunColor:"#ffdca6",sunIntensity:12,sunSize:1.7},exposure:1,fog:55e-5,portal:"#ffd27e",tint:"#fff3e0",shadow:"#03222b",bloom:.5,wood:"#e9d6ab"},noon:{pal:["#062c3e","#0a6676","#20c6ac","#8ee6e8","#f4fffb","#dcf4ea","#fff3d2"],sun:[57,32],sky:{preset:"day",zenith:"#34b0c2",mid:"#7fd6da",horizon:"#dff5ec",ground:"#0a6676",scatterColor:"#fffbe6",scatter:.35,sunColor:"#fffaf0",sunIntensity:13,sunSize:1.4},exposure:.94,fog:45e-5,portal:"#eafff6",tint:"#f6fffb",shadow:"#02242e",bloom:.42,wood:"#eedcb4"},late:{pal:["#072a36","#0b5560","#2ab894","#7fd0c8","#f6f4e0","#ffc88e","#ff9a3a"],sun:[15,-52],sky:{preset:"goldenHour",zenith:"#54b6b8",mid:"#a8d4b8",horizon:"#ffc88e",ground:"#0b5560",scatterColor:"#ff9a3a",scatter:.75,sunColor:"#ffc27a",sunIntensity:12,sunSize:1.9},exposure:1.02,fog:6e-4,portal:"#ffb866",tint:"#ffefd6",shadow:"#04242a",bloom:.55,wood:"#e6cc9c"},night:{pal:["#020d14","#06303a","#0c6e6c","#2fb8b4","#aeeaea","#17474f","#7ff2e2"],sun:[36,22],sky:{preset:"night",zenith:"#03141a",mid:"#082e34",horizon:"#1a4f55",ground:"#041a20",sunElevation:-30,scatterColor:"#2a8a84",cloudLit:"#6cc4ba",cloudShade:"#103a42"},exposure:1.2,fog:8e-4,portal:"#8ff6e6",tint:"#e8fffb",shadow:"#01131a",bloom:.62,wood:"#9fb8b0"}},ze=`
float h21(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }`,Ft=`
varying vec3 vP, vN, vW;
void main(){ vP = position; vN = normalize(mat3(modelMatrix)*normal); vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,Tt=`
uniform vec3 uSun, uKey, uAmb, uSky, uWood; uniform float uTime;
varying vec3 vP, vN, vW;
${ze}
void main(){
  vec3 N = normalize(vN), V = normalize(vW - cameraPosition);
  float grain = vn(vec2(vP.x*46., vP.z*1.4))*.6 + vn(vec2(vP.x*140., vP.z*4.))*.4;
  vec3 alb = uWood*(.66 + .46*grain);
  alb = mix(alb, uWood*.3, smoothstep(.013, .006, abs(vP.x)));                  // stringer
  alb = mix(alb, uWood*.45, smoothstep(.2, .9, vn(vec2(vP.x*9., vP.z*.9 + 4.)))*.35);
  float nl = max(dot(N, uSun), 0.);
  vec3 col = alb*(uAmb + uKey*(.14 + .55*nl));
  float fr = pow(1. - max(dot(-V, N), 0.), 4.);
  col = mix(col, uSky, .07 + .55*fr);
  vec2 bp = vP.xz*vec2(52., 40.), bi = floor(bp), bf = fract(bp) - .5;          // beads
  float bh = h21(bi); vec2 bo = (vec2(h21(bi + 3.1), h21(bi + 7.7)) - .5)*.5;
  float bd = length(bf - bo), br = .1 + .17*bh, bead = step(.7, bh)*smoothstep(br, br*.6, bd)*step(0., N.y);
  col = mix(col, col*.6 + uSky*.3, bead);
  col += (uKey*1.6 + uSky*.6)*bead*smoothstep(br*.5, 0., length(bf - bo - vec2(.05, -.06)))*(.55 + .45*sin(uTime*9. + bh*40.));
  col += uKey*pow(max(dot(reflect(V, N), uSun), 0.), 36.)*.7;
  gl_FragColor = vec4(col, 1.);
}`,Pt=`
attribute vec4 aSeed; uniform float uTime, uAmt;
varying vec2 vUv; varying float vA, vSheet;
void main(){
  vec4 s = aSeed; float sheet = step(s.x, .14);                    // a few big soft streaks make the sheet under the drops
  float life = .3 + .4*s.z; float age = fract(uTime/life + s.w)*life;
  vec3 o = vec3(.19 + .07*s.x, .0, 1.05 + .8*fract(s.x*7.3));
  vec3 v = vec3(1. + 2.2*s.y, .6 + 1.9*s.z*s.y, -(2. + 4.*s.w))*mix(1., .8, sheet);
  vec3 p = o + v*age + vec3(0., -4.9*age*age, 0.);
  vec3 vel = v + vec3(0., -9.8*age, 0.);
  float sz = (.0024 + .0095*s.y*s.y*s.y + .003*fract(s.w*9.1))*(1. + age*1.6);    // sizes spread four to one
  vec4 mv = modelViewMatrix*vec4(p, 1.);
  vec4 m2 = modelViewMatrix*vec4(p + vel*.02, 1.);
  vec2 ax = m2.xy - mv.xy; float al = length(ax); ax = al > 1e-5 ? ax/al : vec2(1., 0.);
  float len = sz*(1.2 + 1.2*s.z) + al*mix(.1, 1.7, sheet), wid = sz*mix(1., 5.5, sheet);
  mv.xy += ax*position.x*len + vec2(-ax.y, ax.x)*position.y*wid;
  vA = uAmt*smoothstep(0., .04, age)*(1. - smoothstep(life*.4, life, age))*mix(.3 + .7*s.z, .09, sheet);
  vUv = position.xy; vSheet = sheet; gl_Position = projectionMatrix*mv;
}`,Ut=`
uniform vec3 uCol; varying vec2 vUv; varying float vA, vSheet;
void main(){
  float d = length(vUv); if (d > 1. || vA < .003) discard;
  float f = mix(pow(1. - d, 1.6), (1. - d)*(1. - d), vSheet);
  gl_FragColor = vec4(uCol*f*vA, 1.);
}`,_t=`
uniform float uTime, uFlap;
varying vec3 vN, vW, vP;
void main(){
  vec3 p = position; float ax = abs(p.x), k = pow(ax/2.6, 1.5);
  float beat = sin(uTime*3.1 - ax*.9);
  p.y += uFlap*(beat*.95 - .25)*k;                                   // wings beat, the wave running out to the tips
  p.x *= 1. - uFlap*.12*k*(beat*.5 + .5);                            // and the tips curl in at the top of the stroke
  float tk = max(0., -1.16 - p.z)*uFlap;                             // whip tail: shorter, trailing in a moving curve
  p.z += tk*.42; p.x += sin(tk*1.5 - uTime*1.6)*.2*tk; p.y += (cos(tk*1.1 - uTime*1.1) - 1.)*.12*tk;
  vP = position;
  vN = mat3(modelMatrix)*normal; vec4 w = modelMatrix*vec4(p, 1.);
  w.xyz += uFlap*vec3(0., sin(w.z*2.1 + uTime*2.9)*.06, sin(w.y*2.6 + uTime*2.4)*.08);   // seen through moving water
  vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w;
}`,Rt=`
uniform vec3 uDark, uHalo, uSun; uniform float uAlpha, uFlap;
varying vec3 vN, vW, vP;
void main(){
  vec3 V = normalize(vW - cameraPosition); float nv = abs(dot(normalize(vN + vec3(0., 1e-5, 0.)), V));
  float rim = 1. - nv; rim *= rim;
  float a = smoothstep(0., .2, nv)*.93, edge = 0.;
  if (uFlap > .5) {                                                  // the manta: its outline melts into the water
    float s = clamp(abs(vP.x)/2.6, 0., 1.);
    float zl = 2.3*(.42 - .56*pow(s, 1.35)), zt = 2.3*(-.5 + .375*pow(s, .75));
    float cc = clamp((vP.z - zl)/min(zt - zl, -1e-3), 0., 1.);
    float e = min(min(cc, 1. - cc)*(zl - zt), (1. - s)*2.6);         // metres in from the edge of the wing
    float soft = smoothstep(0., .62, e);
    soft = max(soft, step(vP.z, -1.2)*step(abs(vP.x), .12)*.8);      // the tail
    soft = max(soft, step(.9, vP.z)*.55);                            // cephalic lobes
    a = .74*(.04 + .96*soft); edge = 1. - soft;
    edge = edge*edge*.55 + .3*exp(-(pow(abs(vP.x) - .8, 2.)/.3 + pow(vP.z - .25, 2.)/.22));   // pale shoulder marks
  }
  vec3 col = mix(uDark, uHalo*(.55 + 1.1*max(dot(V, uSun), 0.)), clamp(rim*(1. + uFlap) + edge, 0., 1.));
  gl_FragColor = vec4(col, uAlpha*a);
}`,Bt=`
#include <fog_pars_vertex>
attribute vec4 aSeed; attribute float aShade;
uniform float uTime;
varying float vShade, vVis;
void main(){
  vec4 s = aSeed; float T = 2.2 + 2.8*s.w, c = uTime/T + s.x*9., cyc = floor(c), ph = fract(c);
  float h1 = fract(sin(cyc*12.9898 + s.y*78.233)*43758.5453), h2 = fract(sin(cyc*39.346 + s.z*11.135)*24634.6345);
  vec3 o = vec3(mix(-56., -10., h1*h1), .7, mix(-20., 108., h2));
  float fl = clamp(ph/.46, 0., 1.), ang = (s.y - .5)*1.1, dist = 13. + 12.*s.z, hy = .3 + .75*s.z;
  vec3 dir = vec3(-sin(ang)*.6, 0., cos(ang));
  vec3 c0 = o + dir*dist*fl; c0.y += hy*sin(fl*3.14159);
  float vis = step(ph, .46)*smoothstep(0., .06, fl)*(1. - smoothstep(.94, 1., fl));
  vec3 fw = normalize(dir*dist + vec3(0., hy*3.14159*cos(fl*3.14159), 0.));
  vec3 rt = normalize(cross(vec3(0., 1., 0.), fw)), up = cross(fw, rt);
  vec3 p = position*3.1*vis;
  p.y += abs(p.x)*sin(uTime*46. + s.x*30.)*.22;
  vec4 mvPosition = modelViewMatrix*vec4(c0 + rt*p.x + up*p.y + fw*p.z, 1.);
  vShade = aShade; vVis = vis;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Gt=`
#include <fog_pars_fragment>
uniform vec3 uBody, uWing;
varying float vShade, vVis;
void main(){
  if (vVis < .01) discard;
  gl_FragColor = vec4(mix(uBody, uWing, vShade), 1.);
  #include <fog_fragment>
}`,Wt=`
attribute vec4 aSeed;
uniform float uTime, uHeroZ, uMouthZ;
varying float vA; varying vec2 vUv;
void main(){
  vec3 box = vec3(96., 46., 130.), ctr = cameraPosition + vec3(-26., 8., 38.);
  vec3 fall = normalize(vec3(.12, -1., .05));
  vec3 p = mod(aSeed.xyz*box + fall*uTime*(15. + 5.*aSeed.w) - ctr, box) - box*.5 + ctr;
  float lz = p.z - uHeroZ;
  float inTube = step(-9.5, p.x)*step(p.y, 17.)*step(lz, uMouthZ + 4.);
  float d = distance(p, cameraPosition);
  vec3 side = normalize(cross(fall, p - cameraPosition) + vec3(1e-4, 0., 0.));
  float w = max(.01, d*.0011);
  p += fall*position.y*(.55 + .5*aSeed.w) + side*position.x*w;
  vA = (1. - inTube)*smoothstep(1.5, 5., d)*(1. - smoothstep(48., 66., d))*clamp(.01/w*1.4, .25, 1.);
  vUv = position.xy;
  gl_Position = projectionMatrix*viewMatrix*vec4(p, 1.);
}`,Vt=`
uniform vec3 uCol; varying float vA; varying vec2 vUv;
void main(){ if (vA < .004) discard; gl_FragColor = vec4(uCol, vA*.42*(1. - abs(vUv.y))); }`,It=`
varying vec3 vN; varying float vY;
void main(){ vN = normalize(mat3(modelMatrix)*normal + vec3(0., 1e-5, 0.)); vY = position.y; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }`,Zt=`
uniform vec3 uSun, uLow, uHigh, uHaze, uRim;
varying vec3 vN; varying float vY;
void main(){
  vec3 N = normalize(vN); float lit = clamp(dot(N, uSun)*.7 + .45, 0., 1.);
  vec3 col = mix(uLow, uHigh, lit)*(.72 + .28*smoothstep(0., 700., vY));
  col += uRim*pow(1. - abs(N.y), 2.)*max(dot(N, uSun), 0.)*.4;
  col = mix(col, uHaze, clamp(.36 + .58*exp(-max(vY, 0.)/230.), 0., .97));
  gl_FragColor = vec4(col, 1.);
}`,jt=`
attribute float aKind; varying vec2 vUv; varying float vK;
void main(){ vec3 p = position; if (aKind > .5) p.x += uv.y*uv.y*120.; vUv = uv; vK = aKind; gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.); }`,Dt=`
uniform vec3 uFall, uSmoke; uniform float uTime;
varying vec2 vUv; varying float vK;
${ze}
void main(){
  float e = 1. - abs(vUv.x*2. - 1.), a; vec3 col;
  if (vK < .5) { float n = vn(vec2(vUv.x*3., vUv.y*36. + uTime*1.7)); a = smoothstep(0., .5, e)*(.5 + .5*n)*smoothstep(1., .9, vUv.y)*.9; col = uFall; }
  else { float n = vn(vec2(vUv.x*3. + 9., vUv.y*5. - uTime*.13))*.6 + vn(vec2(vUv.x*7., vUv.y*11. - uTime*.22))*.4;
    a = smoothstep(.3, .7, n)*e*(1. - vUv.y)*smoothstep(0., .06, vUv.y)*.55; col = uSmoke; }
  gl_FragColor = vec4(col, a);
}`,Et=`
#include <fog_pars_vertex>
uniform float uTime, uBelly;
varying vec2 vUv; varying vec3 vW;
void main(){
  vec3 p = position; float b = sin(uv.x*3.14159)*sin(uv.y*3.14159);
  p.x -= b*uBelly*(1. + .14*sin(uTime*2.3 + uv.y*5.)) + sin(uTime*7.5 + uv.y*13. + uv.x*5.)*.05*uBelly*uv.x*uv.x;
  vUv = uv; vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz;
  vec4 mvPosition = viewMatrix*w; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Lt=`
#include <fog_pars_fragment>
uniform vec3 uSun, uKey, uAmb, uCloth;
varying vec2 vUv; varying vec3 vW;
void main(){
  vec3 N = normalize(cross(dFdx(vW), dFdy(vW)) + vec3(1e-5, 0., 0.)), V = normalize(vW - cameraPosition);
  float nl = abs(dot(N, uSun)), back = pow(max(dot(V, uSun), 0.), 3.);
  float seam = .86 + .14*step(.12, abs(fract(vUv.y*6.) - .5)*2.);
  vec3 col = uCloth*seam*(uAmb + uKey*(.25 + .6*nl + .9*back));
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Ht=`
#include <fog_pars_vertex>
varying vec2 vUv;
void main(){ vUv = uv; vec4 mvPosition = modelViewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ot=`
#include <fog_pars_fragment>
uniform vec3 uCol; uniform float uTime;
varying vec2 vUv;
${ze}
void main(){
  float n = vn(vec2(vUv.x*6., vUv.y*16. + uTime*2.6))*.6 + vn(vec2(vUv.x*15., vUv.y*36. + uTime*4.4))*.4;
  float v = abs(vUv.x*2. - 1.), arm = smoothstep(.22, 0., abs(v - .12 - vUv.y*.8));
  float a = (arm*.85 + (1. - v)*(1. - vUv.y)*.45)*smoothstep(.22, .6, n)*(1. - vUv.y)*smoothstep(0., .03, vUv.y);
  gl_FragColor = vec4(uCol, a*.85);
  #include <fog_fragment>
}`,w=e.Vector3,Ne=(o,a,i=1)=>{const g=new e.Color(a).multiplyScalar(i),l=o.attributes.position.count,u=new Float32Array(l*3);for(let t=0;t<l;t++)u[t*3]=g.r,u[t*3+1]=g.g,u[t*3+2]=g.b;return o.setAttribute("color",new e.BufferAttribute(u,3)),o.attributes.uv&&o.deleteAttribute("uv"),o},ce=(o,a,i,g,l,u,t)=>{const p=new e.BoxGeometry(g,l,u);return p.translate(o,a,i),Ne(p,t)},K=(o,a,i,g)=>{const l=new w(...o),u=new w(...a),t=u.clone().sub(l),p=new e.CylinderGeometry(i,i,t.length(),6,1);return p.applyQuaternion(new e.Quaternion().setFromUnitVectors(new w(0,1,0),t.clone().normalize())),l.add(u).multiplyScalar(.5),p.translate(l.x,l.y,l.z),Ne(p,g)};function ke(o,a,i,g,l,u,t=0,p=0){const S=[],b=[];for(let s=0;s<=14;s++){const n=s/14*2-1,r=Math.abs(n),m=a/2*Math.pow(Math.max(1-Math.pow(r,2.4),0),.6)+.015,h=l+g*Math.pow(r,2.6),A=-i*(1-Math.pow(r,3))+(l+g)*Math.pow(r,6),R=Y(A,h,.42),P=n*o/2;S.push(t-m,p+h,P,t-m*.78,p+R,P,t,p+A,P,t+m*.78,p+R,P,t+m,p+h,P,t,p+h-.06,P)}for(let s=0;s<14;s++)for(let n=0;n<6;n++){const r=s*6+n,m=s*6+(n+1)%6,h=r+6,A=m+6;b.push(r,m,h,m,A,h)}const v=new e.BufferGeometry;return v.setAttribute("position",new e.Float32BufferAttribute(S,3)),v.setIndex(b),v.computeVertexNormals(),Ne(v,u)}function Qe(o,a,i,g=.22,l=10){const u=[],t=[],p=[],x=new w(...o),S=new w(...a),b=new w(...i),v=new w,s=new w;for(let r=0;r<=l;r++)for(let m=0;m<=l;m++){const h=m/l,A=r/l*(1-g*Math.sin(h*le));v.copy(S).lerp(b,h).sub(x),s.copy(x).addScaledVector(v,A),u.push(s.x,s.y,s.z),t.push(r/l,h)}for(let r=0;r<l;r++)for(let m=0;m<l;m++){const h=r*(l+1)+m;p.push(h,h+l+1,h+1,h+1,h+l+1,h+l+2)}const n=new e.BufferGeometry;return n.setAttribute("position",new e.Float32BufferAttribute(u,3)),n.setAttribute("uv",new e.Float32BufferAttribute(t,2)),n.setIndex(p),n}function Kt(){const i=[],g=[];for(let u=0;u<=24;u++){const t=Y(-1.3,2,u/24),p=te((t-.1)/1.9,0,1),x=.275*Math.pow(Math.max(1-Math.pow(p,2.3),0),.55)+.002,S=.13*Math.pow(te((t-.5)/1.5,0,1),2.2),b=.034*(.3+.7*Math.min(1,x/.2));for(let v=0;v<12;v++){const s=v/12*le*2,n=Math.cos(s),r=Math.sin(s);i.push(x*Math.sign(n)*Math.pow(Math.abs(n),.6),S+b*r*(r>0?1:.7),t)}}for(let u=0;u<24;u++)for(let t=0;t<12;t++){const p=u*12+t,x=u*12+(t+1)%12,S=p+12,b=x+12;g.push(p,x,S,x,b,S)}const l=new e.BufferGeometry;return l.setAttribute("position",new e.Float32BufferAttribute(i,3)),l.setIndex(g),l.computeVertexNormals(),l}function $e(o,a){const i=new e.InstancedBufferGeometry;i.setAttribute("position",new e.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),i.setIndex([0,1,2,0,2,3]);const g=new Float32Array(o*4);for(let l=0;l<g.length;l++)g[l]=a();return i.setAttribute("aSeed",new e.InstancedBufferAttribute(g,4)),i.instanceCount=o,i.boundingSphere=new e.Sphere(new w,1e5),i}function Xt(o,a){const i=[],g=[],l=(n,r,m,h)=>{i.push(...n,...r,...m),g.push(h,h,h)},u=[0,0,.2],t=[0,0,-.2],p=[.03,0,0],x=[-.03,0,0],S=[0,.036,0],b=[0,-.036,0];for(const[n,r]of[[p,S],[S,x],[x,b],[b,p]])l(u,n,r,n===S||r===S?.12:.3),l(t,r,n,.15);for(const n of[-1,1])l([n*.03,0,.07],[n*.31,.02,-.05],[n*.03,0,-.07],1);l([0,0,-.16],[0,.07,-.3],[0,-.09,-.31],.5);const v=new e.InstancedBufferGeometry;v.setAttribute("position",new e.Float32BufferAttribute(i,3)),v.setAttribute("aShade",new e.Float32BufferAttribute(g,1));const s=new Float32Array(o*4);for(let n=0;n<s.length;n++)s[n]=a();return v.setAttribute("aSeed",new e.InstancedBufferAttribute(s,4)),v.instanceCount=o,v.boundingSphere=new e.Sphere(new w,1e5),v}function Yt(o,a){const t=[],p=[],x=[[-180,20,900,640],[260,90,700,540],[-540,-90,540,460],[640,-40,440,420],[40,280,400,620],[-860,60,250,330],[930,30,210,300]].map(b=>[b[0]+o.range(-70,70),b[1]+o.range(-50,50),b[2]*o.range(.85,1.12),b[3]]);for(let b=0;b<=40;b++)for(let v=0;v<=60;v++){const s=(v/60-.5)*2300,n=(b/40-.5)*1500;let r=0;for(const m of x){const h=Math.hypot(s-m[0],(n-m[1])*1.25)/m[3];h<1&&(r=Math.max(r,m[2]*Math.pow(1-h,1.45))+0)}r*=.72+.5*a.ridged2(s*.0021+3,n*.0021,4),r+=40*a.fbm2(s*.006,n*.006,3)*k(0,120,r),t.push(s,Math.max(r,-4),n)}for(let b=0;b<40;b++)for(let v=0;v<60;v++){const s=b*61+v,n=s+1,r=s+60+1,m=r+1;p.push(s,r,n,n,r,m)}const S=new e.BufferGeometry;return S.setAttribute("position",new e.Float32BufferAttribute(t,3)),S.setIndex(p),S.computeVertexNormals(),S}function Qt(o,a,i){const u=[0,0,0],t=[],p=[],x=new e.Color("#f1e2b8"),S=new e.Color("#a89a72"),b=new e.Color,v=(n,r)=>{const m=Math.hypot(n/1.5,r)/i;return 2.6*Math.pow(Math.max(1-m,0),1.4)*(1+.25*a.n2(n*.08,r*.08))-.75};u[1]=v(0,0),t.push(x.r,x.g,x.b);for(let n=1;n<=10;n++)for(let r=0;r<30;r++){const m=r/30*le*2,h=n/10*i*(1+.12*a.n2(Math.cos(m)*1.7,Math.sin(m)*1.7+9)),A=Math.cos(m)*h*1.5,R=Math.sin(m)*h,P=v(A,R);u.push(A,P,R),b.copy(S).lerp(x,k(-.1,.7,P)).multiplyScalar(.8+.2*a.n2(A*.3,R*.3+5)),t.push(b.r,b.g,b.b)}for(let n=0;n<30;n++)p.push(0,1+(n+1)%30,1+n);for(let n=1;n<10;n++)for(let r=0;r<30;r++){const m=1+(n-1)*30+r,h=1+(n-1)*30+(r+1)%30,A=m+30,R=h+30;p.push(m,h,A,h,R,A)}const s=new e.BufferGeometry;return s.setAttribute("position",new e.Float32BufferAttribute(u,3)),s.setAttribute("color",new e.Float32BufferAttribute(t,3)),s.setIndex(p),s.computeVertexNormals(),s.userData.hAt=v,s}var ao={id:"the-green-room",name:"The Green Room",category:"ocean",weirdness:.05,media:["water","open"],async build(o){const{rng:a,noise:i}=o,g=o.vary||{},l=o.quality?.detail??1,u=new e.Scene,t=(c,f=1)=>new e.Color(c).multiplyScalar(f),p=c=>"#"+c.getHexString(),x=a(),S=a(),b={dawn:"morning",day:"noon",golden:"late",night:"night"}[g.hour]||(x<.22?"late":x<.44?"noon":x<.6?"night":"morning"),v=Ct[b],s=b==="night";let n=S<.4?"glassy":S<.66?"rain":"big";s&&n==="rain"&&(n="glassy");const r=n==="rain",m=n==="big",h=a.chance(.68),A=a.chance(.3),R=o.core.makeRng(o.core.hashSeed(o.seed+":cast"))()<.28,P=!!g.rare,be=g.density??1,Ce={pinch:m?[.49,.675]:[.5,.66],rmin:m?.4:.42,reveal:m?s?.92:.82:r?.9:1,dim:s?.3:.45},d=v.pal.slice();r&&(d[6]=p(t(d[6]).lerp(t(d[4]),.4)),d[5]=p(t(d[5]).lerp(t("#b9d6cf"),.55))),m&&(d[0]=p(t(d[0],.8)),d[1]=p(t(d[1],.86)));const ye=(v.sun[0]+a.range(-2,3))*he,Fe=(v.sun[1]+a.range(-4,4))*he,X=new w(Math.sin(Fe)*Math.cos(ye),Math.sin(ye),Math.cos(Fe)*Math.cos(ye)),Te=Math.atan2(X.x,-X.z)/he,Pe=Math.asin(X.y)/he,oe={rng:a,...v.sky,clouds:!1,clouds2:{coverage:.3,stretch:1,opacity:.45,lit:d[4],shade:d[3]}};s?Object.assign(oe,{bake:!0,renderer:o.renderer,clouds2:!1,bodyOverrides:{0:{elevation:Pe,azimuth:Te,size:2.4}}}):(oe.sunElevation=Pe,oe.sunAzimuth=Te),r&&Object.assign(oe,{clouds:{coverage:.58,softness:.42,lit:"#f3f0e2",shade:"#5f8f90",opacity:.9},clouds2:!1,sunIntensity:7,zenith:"#7fbcc0"});const W=gt(oe);u.add(W.object);const we=W.colorAt(new w(-.25,.025,1).normalize(),new e.Color);u.fog=new e.FogExp2(we,v.fog*(r?1.5:1));const Ue=yt(W,{bounce:.5});u.add(Ue.object),await o.yield();const _e=t(d[1]).lerp(t(d[2]),.35).multiplyScalar(.62),C=await wt(o,{palette:d,sunDir:X.toArray(),reefSpeed:0,swell:m?1.1:1,plume:n==="glassy"?2.3:1.3,rain:r?1:0,cast:R?"trevally":"dolphin",bio:s?.4:0,reefColors:b==="noon"?["#ffb23e","#ffd9a8"]:null,sea:p(_e.clone().lerp(t(d[2]),s?.12:.3))});u.add(C.object);const Je=C.state.swell;await o.yield();const qe=7-7*Ce.rmin,j=ht(Mt.map(([c,f,y])=>[c>.59&&c<.67?qe:f,c<.05?y*Math.max(1,Je):y,c*se])),F={},ae=new w,J=new w;let D=0;const xe=c=>{j.pointAt(c,ae);const f=te(ae.z/se,0,1);return kt(f,Ce,F),D=ae.z-F.lz,f};xe(0);const et=s?Ae.waterLight(W,{zenith:"#07282e",mid:"#0d444a",horizon:"#236a6c",scatterColor:"#2f9a92"}):Ae.waterLight(W),ne=new w(-58+a.range(-10,8),0,790+a.range(-40,60)),Re=Ae.makeOcean({rng:a.fork("sea"),light:et,preset:"calm",level:-.32,height:m?.16:.1,radius:3600,deep:p(_e),scatter:d[2],foamColor:d[4],shallowColor:d[3],glow:s?"#0f6e6c":"#000000",shallows:[{x:ne.x,z:ne.z,radius:66,falloff:40}]});u.add(Re.object),await o.yield();const Be=[];for(let c=0;c<6;c++)Be.push([Y(-800,520,(c+a())/6),a.range(80,190),a.range(1250,2500),a.range(230,430)]);const Ge=await bt({rng:a,sky:W,at:Be,height:.55,puffs:40,wind:[1.4,0,.5],silver:2.4,fogFade:.3},o.yield);u.add(Ge.object),await o.yield();const V={value:0},ue={value:X},re=new e.Mesh(Yt(a.fork("island"),i),new e.ShaderMaterial({uniforms:{uSun:ue,uLow:{value:t(d[0]).lerp(t(d[2]),.22)},uHigh:{value:t(d[2],.72).lerp(t(d[6]),s?.05:.14)},uHaze:{value:we},uRim:{value:t(d[6])}},vertexShader:It,fragmentShader:Zt,side:e.DoubleSide}));re.position.set(-820+a.range(-160,160),0,4400),re.rotation.y=a.range(-.3,.3),re.frustumCulled=!1;{const c=new e.BufferGeometry,f=(T,N,G,O,ee,me,vt,mt,pt)=>{vt.push(T-ee,N,O,T+ee,N,O,T+ee,G,O,T-ee,G,O),mt.push(0,0,1,0,1,1,0,1),pt.push(me,me,me,me)},y=[],z=[],M=[];f(-150,0,330,-275,9,0,y,z,M),f(330,4,250,-610,38,1,y,z,M),c.setAttribute("position",new e.Float32BufferAttribute(y,3)),c.setAttribute("uv",new e.Float32BufferAttribute(z,2)),c.setAttribute("aKind",new e.Float32BufferAttribute(M,1)),c.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]);const U=new e.Mesh(c,new e.ShaderMaterial({uniforms:{uTime:V,uFall:{value:t(d[4],s?.5:.92)},uSmoke:{value:t(d[4],s?.3:.8).lerp(we,.3)}},vertexShader:jt,fragmentShader:Dt,transparent:!0,depthWrite:!1,side:e.DoubleSide}));U.frustumCulled=!1,U.renderOrder=1,re.add(U)}u.add(re),await o.yield();const We=Qt(a.fork("islet"),i,26),tt=We.userData.hAt,Ve=new e.Mesh(We,new e.MeshLambertMaterial({vertexColors:!0}));Ve.position.copy(ne),u.add(Ve);const ot=pe.makeWind({direction:[1,.25],strength:1.7,speed:1.2});await o.yield();const Se=pe.windMaterial({wind:ot});await o.yield();{const c=[];for(let y=0;y<8;y++){await o.yield();const z=a.range(0,6.283),M=Math.sqrt(a())*15,U=Math.cos(z)*M*1.5,T=Math.sin(z)*M,N=pe.palmGeometry({rng:a.fork("palm"+y),height:a.range(11,15.5),detail:1,curve:a.range(.3,.9)});N.rotateY(a.range(0,6.283)),N.translate(U,tt(U,T)-.25,T),c.push(N)}await o.yield();const f=Ke(c);if(f){const y=new e.Mesh(f,Se);y.position.copy(ne),u.add(y),c.forEach(z=>z.dispose())}else for(const y of c){const z=new e.Mesh(y,Se);z.position.copy(ne),u.add(z)}}await o.yield();const Ie=t(d[6],s?.5:1),Ze=t(d[3],.42).add(t(d[2],.16)),I=new e.Group;{const c=[];let f,y;const z=s?2.2:1;h?(c.push(ke(9,.8,.5,.6,.4,"#4a2f1a"),ke(5.6,.36,.22,.2,.12,"#5a3a20",2.5,-.05),K([0,.44,1.3],[2.5,.16,1.3],.07,"#6b4a2a"),K([0,.44,-1.3],[2.5,.16,-1.3],.07,"#6b4a2a"),K([0,.3,.9],[0,5.6,.2],.1,"#7a5632"),K([0,.7,3.5],[0,7.7,-1.3],.08,"#7a5632"),K([0,.7,3.5],[0,1.7,-4.3],.08,"#7a5632"),ce(0,.5,-1.3,.5,.3,1.7,"#8a6a3a")),f=Qe([0,.75,3.45],[0,1.75,-4.2],[0,7.6,-1.25]),y=.6):(c.push(ke(6.8,2.1,.55,.32,.55,"#e4dcc2"),ce(0,1.25,-.9,1.3,1.1,1.5,"#cfc7ab"),ce(0,1.86,-.9,1.7,.1,2,"#b9792c"),ce(0,.62,1.4,1.5,.12,1.6,"#9a7a4a"),ce(0,.62,-3.25,.36,.75,.42,"#2a3a3c"),K([0,1.9,-.4],[0,4.3,-.5],.06,"#6b4a2a"),K([.6,.9,-2.4],[1.7,2.9,-4.4],.05,"#3a2a1a"),K([-.6,.9,-2.4],[-1.7,2.9,-4.4],.05,"#3a2a1a")),f=Qe([0,4.3,-.5],[0,3.55,-.52],[0,3.9,-2.4],0,6),y=.1);const M=Ke(c);if(c.forEach(N=>N.dispose()),z!==1){const N=M.attributes.color.array;for(let G=0;G<N.length;G++)N[G]=Math.min(N[G]*z,1)}I.add(new e.Mesh(M,new e.MeshLambertMaterial({vertexColors:!0,side:e.DoubleSide}))),I.add(new e.Mesh(f,new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),{uTime:V,uBelly:{value:y},uSun:ue,uKey:{value:Ie},uAmb:{value:Ze.clone().multiplyScalar(1.3)},uCloth:{value:t("#c98a2e")}}),vertexShader:Et,fragmentShader:Lt,side:e.DoubleSide,fog:!0})));const U=new e.PlaneGeometry(h?3.6:4.6,26,1,8);U.rotateX(-le/2),U.translate(h?.9:0,.1,-15.5);const T=new e.Mesh(U,new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),{uTime:V,uCol:{value:t(d[4],s?.75:.85)}}),vertexShader:Ht,fragmentShader:Ot,transparent:!0,depthWrite:!1,fog:!0}));T.renderOrder=2,I.add(T),I.traverse(N=>{N.frustumCulled=!1})}const je=a.range(-2.5,2.5);I.position.set($(Ye,0)+je,.56,D+$(Xe,0)),u.add(I),await o.yield();const fe=Q.makeFauna(u,{light:Q.lightFrom(u)}),at={body:"#f3f6f2",belly:"#ffffff",wingC:"#e9efec",trail:"#dfe8e4",tip:"#20282a",head:"#f6f6ee",tailC:"#f6f8f6",beak:"#30383a"},nt={body:"#1c2a2c",belly:"#2a3a3a",wingC:"#16201f",trail:"#22302f",tip:"#0c1212",head:"#1a2424",tailC:"#141c1c",beak:"#6a7068"},rt={body:"#8a7a62",belly:"#d8d0b8",wingC:"#6e6250",trail:"#4a4238",tip:"#2a2622",head:"#efe6c8",tailC:"#6a5e4c",beak:"#d8a85a"};s?fe.add(Q.makeFireflies({rng:a.fork("bio"),path:j,uFrom:.02,uTo:1,count:Math.round(320*be*l),spread:5,lift:[-2.5,5],clear:1.2,color:p(t(d[6],.5)),color2:p(t(d[3],.5)),size:.15,blink:1.6})):(fe.add(Q.makeFlock({rng:a.fork("frigate"),species:"eagles",count:be>1.1?3:2,size:2.3,palette:nt,soarRadius:8,soarLift:2.5,spread:[9,2.5,9],along:{path:j,side:4.5,up:8.2,lead:80,from:-.05,to:.84}})),fe.add(Q.makeFlock({rng:a.fork("terns"),species:"gulls",count:A?1:3,size:A?3.4:2,palette:A?rt:at,spread:[1.6,1,4],wander:[1.5,.7,.8,.9],bank:2.4,glide:A?.55:.2,amp:A?.6:.75,dihedral:.3,along:{path:j,side:-3.2,up:A?2.6:2.2,lead:A?16:19,from:.1,to:.37}})));const De=new e.Mesh(Xt(Math.round(48*be*l),a.fork("fish")),new e.ShaderMaterial({uniforms:Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),{uTime:V,uBody:{value:t(d[1],.5).lerp(t(d[4]),.3)},uWing:{value:t(d[4],.7).add(t(d[6],.9))}}),vertexShader:Bt,fragmentShader:Gt,side:e.DoubleSide,fog:!0}));De.frustumCulled=!1,C.object.add(De);const Ee=c=>new e.ShaderMaterial({uniforms:{uTime:V,uFlap:{value:c},uAlpha:{value:0},uSun:ue,uDark:{value:c?t(d[0],.4).lerp(t(d[2],.5),.35):t(d[0],.32)},uHalo:{value:t(d[2],c?.75:.6).add(t(d[6],c?.6:.32))}},vertexShader:_t,fragmentShader:Rt,transparent:!0,depthWrite:!1,depthFunc:e.GreaterDepth,side:e.DoubleSide}),Z=new e.Mesh(Q.turtleGeometry({}),Ee(0));Z.frustumCulled=!1,Z.renderOrder=2,Z.scale.setScalar(2.1),C.object.add(Z);let _=null;P&&(_=new e.Mesh(Q.mantaGeometry({}),Ee(1)),_.frustumCulled=!1,_.renderOrder=2,_.matrixAutoUpdate=!1,C.object.add(_));const E=new e.Group;E.matrixAutoUpdate=!1,E.visible=!1;const it=t(d[5],.5).add(t(d[3],.3)),Le=new e.Mesh(Kt(),new e.ShaderMaterial({uniforms:{uTime:V,uSun:ue,uKey:{value:Ie.clone().multiplyScalar(.85)},uAmb:{value:Ze},uSky:{value:it},uWood:{value:t(v.wood)}},vertexShader:Ft,fragmentShader:Tt,side:e.DoubleSide})),He={uTime:V,uAmt:{value:1},uCol:{value:t(d[6],1.5).add(t(d[4],1))}},Me=new e.Mesh($e(Math.round(460*l),a.fork("spray")),new e.ShaderMaterial({uniforms:He,vertexShader:Pt,fragmentShader:Ut,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending}));Le.frustumCulled=Me.frustumCulled=!1,Me.renderOrder=6,E.add(Le,Me),u.add(E);let ie=null;if(r){ie={uTime:V,uHeroZ:{value:0},uMouthZ:{value:0},uCol:{value:t(d[4],.8)}};const c=new e.Mesh($e(Math.round(1700*l),a.fork("rain")),new e.ShaderMaterial({uniforms:ie,vertexShader:Wt,fragmentShader:Vt,transparent:!0,depthWrite:!1,side:e.DoubleSide}));c.frustumCulled=!1,c.renderOrder=5,u.add(c)}await o.yield();const Oe=new w,st=new w,lt=new w,ct=new w,ut=[{at:()=>lt.copy(I.position).setY(9),from:0,to:.11,weight:.3},{at:(c,f)=>(j.pointAt(f,J),P?Oe.copy(C.shaftOrigin).setZ(C.shaftOrigin.z+D-1.5):Oe.set(7.7,8,J.z+5.6)),from:.3,to:.52,weight:P?.6:.62},{at:(c,f)=>(j.pointAt(f,J),st.set(J.x+9.8,J.y+.5,J.z+1.7)),from:.515,to:.69,weight:.7,fade:.4},{at:(c,f)=>(xe(f),ct.set(ae.x+.5,5.6,D+F.foamZ+4)),from:.535,to:.675,weight:.85,fade:.3}],de=new w,L=new w,B=new w,H=new w,q=new w,ft=new w(0,1,0),ve=new e.Matrix4,$t=new w(1,1,1),dt=(c,f,y,z)=>{const M=xe(z);V.value=f,C.object.position.z=D,C.setTube({radius:F.rad,mouthZ:F.mouthZ,foamZ:F.foamZ}),C.setReveal(F.reveal),C.setSpit(F.spit),C.setLeap(F.leap),C.setPod(Math.min(F.lz+3,F.mouthZ-47)),C.setTrail(k(.14,.2,M)*(1-k(.9,.97,M))),C.setScroll(D+f*4),C.update(c,f,y),W.update(c,f,y),Ue.update(c,f,y),Ge.update(c,f,y),Re.update(c,f,y),pe.updateWind(Se,f),fe.update(c,f,y,z),ie&&(ie.uHeroZ.value=D,ie.uMouthZ.value=F.mouthZ),I.position.set($(Ye,M)+je,.56+.06*Math.sin(f*1.3),D+$(Xe,M)+2.5*Math.sin(f*.21)),I.rotation.set(.03*Math.sin(f*1.1),.05*Math.sin(f*.3),.05*Math.sin(f*.8+1)-(h?.06:0));const U=ge(M,.17,.34,.03);if(Z.material.uniforms.uAlpha.value=U,Z.visible=U>.01,Z.visible&&(Z.position.set(-2.9+.5*Math.sin(f*.9),-.9,F.lz+(.268-M)*se*.4),Z.rotation.set(f*1.3,f*.8,.6+.4*Math.sin(f*.7))),_){const T=ge(M,.29,.57,.04);if(_.material.uniforms.uAlpha.value=T,_.visible=T>.01,_.visible){const N=13*(1-k(.3,.4,M))-2.2-11*k(.48,.56,M);B.copy(X).negate(),H.set(0,.12*Math.sin(f*.6),1).addScaledVector(B,-B.z).normalize(),L.crossVectors(B,H).normalize(),B.crossVectors(H,L),ve.makeBasis(L,B,H),q.copy(C.shaftOrigin).addScaledVector(X,3),q.z+=N,q.y+=.35*Math.sin(f*.8),_.matrix.copy(ve).setPosition(q),_.matrixWorldNeedsUpdate=!0}}if(E.visible=z>0,E.visible){j.tangentAt(z,de),H.set(de.x*.7,de.y*.6,de.z).normalize(),L.crossVectors(ft,H).normalize(),B.crossVectors(H,L);const T=.5*k(2.5,8.5,ae.y)*(1-k(.86,.95,M))*k(.1,.16,M)+.03*Math.sin(f*2.1),N=.006+.016*ge(M,.02,.17,.04)+.05*F.spit*(1-F.spit),G=Math.cos(T),O=Math.sin(T);q.copy(L),L.multiplyScalar(G).addScaledVector(B,O),B.multiplyScalar(G).addScaledVector(q,-O);const ee=(1-k(0,.02,z))*1.3;ve.makeBasis(L,B,H).setPosition(y.position.x+.1*O,y.position.y-.93-ee+N*Math.sin(f*37),y.position.z+N*.5*Math.sin(f*29+1)),E.matrix.copy(ve),E.matrixWorldNeedsUpdate=!0,He.uAmt.value=.75+.5*ge(M,.02,.2,.04)+.6*F.spit*(1-F.spit)*4*.5}};return await W.prewarm(o.renderer,null,u),{scene:u,path:j,duration:xt,title:s?"The Green Room by Moonlight":r?"The Green Room in Rain":"The Green Room",camera:{fov:66,near:.25,far:7e3,lookAhead:14,sway:1,bank:1.8},pois:ut,portal:{shape:"circle",radius:7,color:v.portal,glow:1,revealDistance:230},post:{exposure:v.exposure*(r?1.05:1),bloom:{strength:v.bloom,radius:.7,threshold:.92},grade:{saturation:r?1:1.08,contrast:1.05,tint:v.tint,shadowTint:v.shadow,vignette:.36,grain:.02,aberration:0}},ride:"none",update:dt,dispose(){W.dispose?.()}}}};export{ao as default};
