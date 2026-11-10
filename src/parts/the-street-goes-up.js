import*as x from"three";const P={z0:-426,z1:910,floorY:3,sCrease:220,R:40,wallX:260,rimY:374,thick:30,avenueZ:-60,canalZ:875},$e=Math.PI/2,ke=P.sCrease+P.R*$e,ce=ke+(P.rimY-P.floorY-P.R),he=(e,t,a)=>Math.min(a,Math.max(t,e)),Pe=(e,t,a)=>{const o=he((a-e)/(t-e),0,1);return o*o*(3-2*o)},ve=(e,t,a)=>e+(t-e)*a;function ye(e,t={}){const a=he((e-P.sCrease)/P.R,0,$e),o=Math.cos(a),i=Math.sin(a);return t.a=a,t.ax=o,t.ay=i,t.ux=-i,t.uy=o,t.gx=Math.min(e,P.sCrease)+P.R*i,t.gy=P.floorY+P.R*(1-o)+Math.max(e-ke,0),t}const ge={};function qe(e,t,a,o=new x.Vector3){return ye(e,ge),o.set(ge.gx+a*ge.ux,ge.gy+a*ge.uy,t)}const Qe=new x.Matrix4,We=new x.Matrix4;function se(e,t,a,o,i,d=new x.Matrix4){return ye(e,ge),Qe.set(ge.ax,ge.ux,0,ge.gx+a*ge.ux,ge.ay,ge.uy,0,ge.gy+a*ge.uy,0,0,1,t,0,0,0,1),o&&Qe.multiply(We.makeRotationY(o)),i!==void 0&&i!==1&&(typeof i=="number"?Qe.scale(Se.set(i,i,i)):Qe.scale(i)),d.copy(Qe)}const Se=new x.Vector3;function bt(e,t,a,o=new x.Vector3){const i=he(a,P.z0,P.z1),d=a-i;let r,n,h,s;const l=P.sCrease,f=P.floorY+P.R;if(e>=l&&t<=f&&e<=P.wallX+60){const g=e-l,y=t-f,b=Math.max(Math.hypot(g,y),.001),z=l+P.R*g/b,S=f+P.R*y/b,L=e-z,F=t-S;s=Math.max(Math.hypot(L,F,d),.001),r=L/s,n=F/s,h=d/s}else{const g=e-he(e,0,l),y=t-P.floorY,b=Math.max(Math.hypot(g,y,d),.001),z=e-P.wallX,S=t-he(t,f,P.rimY),L=Math.max(Math.hypot(z,S,d),.001),F=Pe(-8,8,b-L);r=ve(g/b,z/L,F),n=ve(y/b,S/L,F),h=ve(d/b,d/L,F),s=ve(b,L,F)}let v=1-Pe(60,90,s);e>P.wallX&&(v=0);const m=-r*v,u=-n*v-(1-v),p=-h*v,w=Math.max(Math.hypot(m,u,p),.001);return o.set(m/w,u/w,p/w)}const le=16,ae=19,_e=23,De={tall:34,house:5,foot:3,top:1.7,n:12},V={plot:8,every:8,open:2,first:8},lo=P.z0+V.first+(V.every-V.open-.5)*V.plot,oe={wall:5,depth:4.5,tree:3.9,aside:2.4,gap:2.2,kitchen:7.4,eaves:5.74,head:2.15,shoulder:5.12,every:14,mouth:2.4,trunk:2.9,crown:2,top:6.2,small:.8,big:1.18,great:[1.45,1.75],sway:.03};oe.reach=oe.top*oe.great[1]*(1+oe.sway);const ue={z0:P.z0+V.first-V.plot/2,plots:Math.ceil((P.z1-6-P.z0-V.first)/V.plot),rows:Math.floor((ce-6-le)/ae)+1};function io(){const e=document.createElement("canvas");e.width=ue.plots,e.height=ue.rows;const t=new x.CanvasTexture(e);return t.magFilter=t.minFilter=x.NearestFilter,t.generateMipmaps=!1,t.flipY=!1,t.wrapS=t.wrapT=x.ClampToEdgeWrapping,{tex:t,fill(a){const o=e.getContext("2d"),i=o.createImageData(ue.plots,ue.rows),d=i.data;for(let r=3;r<d.length;r+=4)d[r]=255;for(const r of a){if(r.yard)continue;const n=Math.round((r.s-le)/ae),h=Math.round((r.z-ue.z0)/V.plot-.5);n>=0&&n<ue.rows&&h>=0&&h<ue.plots&&(d[(n*ue.plots+h)*4]=255)}o.putImageData(i,0,0),t.needsUpdate=!0}}}const co=`mod(vL.z - (${lo.toFixed(1)}), ${(V.every*V.plot).toFixed(1)})`,Oe=`
uniform vec3 uSun; uniform vec3 uSunInv; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uBounce;
uniform vec3 uShade; uniform vec3 uFogCol; uniform float uFogD; uniform vec3 uHazeSun; uniform vec3 uZenith;
uniform vec3 uGlow; uniform vec3 uGlowDir; uniform float uLift;
float slabShadow(vec3 p) {
  vec3 t1 = (vec3(260., 3., -426.) - p) * uSunInv, t2 = (vec3(290., 374., 910.) - p) * uSunInv;
  vec3 lo = min(t1, t2), hi = max(t1, t2);
  float tn = max(max(lo.x, lo.y), lo.z), tf = min(min(hi.x, hi.y), hi.z);
  return (tf > max(tn, 0.) + .02) ? 0. : 1.;
}
// the fold read backwards: plan s and height over the town's ground of a point near the land
vec2 planOf(vec3 p) {
  if (p.x > 220. && p.y < 43.) {
    vec2 v = p.xy - vec2(220., 43.);
    return vec2(220. + 40. * atan(max(v.x, 1e-4), max(-v.y, 1e-4)), 40. - length(v));
  }
  float hf = p.y - 3., hw = 260. - p.x;
  return (p.y < 43. || hf < hw) ? vec2(min(p.x, 220.), hf) : vec2(282.832 + p.y - 43., hw);
}
// the shade one terrace throws on the next: the rows are long prisms across the street, so the sun's
// ray is followed in the plane of (s, h) to the eave and the ridge of the first row toward the sun
float rowShade(vec3 p) {
  vec2 q = planOf(p);
  float a = clamp((q.x - 220.) / 40., 0., 1.5708);
  vec2 al = vec2(cos(a), sin(a));
  float ls = dot(uSun.xy, al), lh = dot(uSun.xy, vec2(-al.y, al.x));
  float lsa = max(abs(ls), 1e-3);
  float k = ls >= 0. ? ceil((q.x + 5.4 - ${le}.) / ${ae}.) : floor((q.x - 5.4 - ${le}.) / ${ae}.);
  float c = ${le}. + k * ${ae}.;
  float rise = lh / lsa;
  float hE = q.y + rise * (abs(c - q.x) - 5.), hR = q.y + rise * abs(c - q.x);
  float open = min(smoothstep(-.5, .5, hE - 7.5), smoothstep(-.5, .5, hR - 11.));
  return open * smoothstep(0., .06, lh);
}
// the shade the tall things throw: each steeple, mill, chimney, tower and pier is a round shaft from A to B
// (its radius at each end in w); the sun's ray from p is tried against every shaft, the edge softer with distance
uniform vec4 uCastA[${_e}]; uniform vec4 uCastB[${_e}];
float castShade(vec3 p) {
  float lit = 1.;
  for (int i = 0; i < ${_e}; i++) {
    vec3 a = uCastA[i].xyz - p, b = uCastB[i].xyz - p;
    float ta = dot(a, uSun), tb = dot(b, uSun);
    vec3 a2 = a - uSun * ta, ab = (b - uSun * tb) - a2;
    float h = clamp(dot(-a2, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
    float d = length(a2 + ab * h), t = mix(ta, tb, h), r = mix(uCastA[i].w, uCastB[i].w, h);
    float soft = .5 + max(t, 0.) * .035;
    lit *= 1. - (1. - smoothstep(r - soft, r + soft, d)) * smoothstep(r * .6, r * 1.6 + 1., t);
  }
  return lit;
}
vec3 lit(vec3 albedo, vec3 n, vec3 p, float contact, float open) {
  float sh = slabShadow(p) * open * castShade(p);
  float ndl = max(dot(n, uSun), 0.);
  float direct = smoothstep(0., .22, ndl) * sh;
  float upw = n.y * .5 + .5;
  // the fill: sky from above, the sea's and the streets' bounce from below, a little of the sun's own
  // colour thrown back off the lit town on what faces away from it
  vec3 hemi = mix(uBounce, uSkyCol, upw) * .5 + uSunCol * .04 * (1. - upw);
  vec3 sun = uSunCol * (.3 + .78 * ndl);
  // what the sun does not reach keeps the fill alone, drawn toward a blue-grey: shade is never black
  // and even in the shade the sky is brightest round the sun: what is turned that way takes more of it, and
  // a little of the hour's own colour
  float toSun = dot(n, uSun) * .5 + .5;
  vec3 shade = hemi * (uShade * 2.25 + .1) * (.76 + .4 * toSun) + uSunCol * uSunCol * (.1 * toSun * toSun);
  // where the town about it lies in the sun, what is turned from the sun is lit warm by the sunlit setts and
  // walls it faces: most what faces the ground, least what faces the sky
  shade += uSunCol * vec3(1., .88, .72) * (.2 * slabShadow(p) * (1. - .62 * upw));
  // the open shade of the late hour: the whole sky lights what the sun does not, and the sea under the sun, a
  // floor of gold from the land's foot to the horizon, throws its colour back on every face turned to it
  float gl = max(dot(n, uGlowDir), 0.);
  shade = shade * uLift + uGlow * (gl * (.35 + .65 * gl));
  vec3 c = albedo * mix(shade, sun + hemi * .62, direct);
  return c * mix(.6, 1., contact);
}
// share: how much of the haze a thing takes. The town's great things (its water, its towers, mills, arches and
// trams) are cleaner-edged and stronger in colour than the terraces about them and hold their own through the haze.
vec3 airFogShare(vec3 c, vec3 p, float share) {
  vec3 dv = p - cameraPosition; float dist = max(length(dv), 1e-3);
  float f = (1. - exp(-uFogD * dist)) * share;
  // the haze is warmer and brighter toward the sun
  float sd = max(dot(dv / dist, uSun), 0.);
  return mix(c, uFogCol + uHazeSun * sd * sd * sd, clamp(f, 0., 1.));
}
vec3 airFog(vec3 c, vec3 p) { return airFogShare(c, p, 1.); }
`;function ho(){return{uSun:{value:new x.Vector3(-.9,.31,.31)},uSunInv:{value:new x.Vector3(1,1,1)},uSunCol:{value:new x.Color("#FFF1D6")},uSkyCol:{value:new x.Color("#D4E6EF")},uBounce:{value:new x.Color("#7FA6C0")},uShade:{value:new x.Vector3(.35,.43,.57)},uFogCol:{value:new x.Color("#D4E6EF")},uFogD:{value:42e-5},uHazeSun:{value:new x.Color(.1,.07,.03)},uZenith:{value:new x.Color("#4E8FCF")},uGlow:{value:new x.Color(0,0,0)},uGlowDir:{value:new x.Vector3(-.6,-.4,-.7).normalize()},uLift:{value:1},uTime:{value:0},uPlan:{value:null},uCastA:{value:Array.from({length:_e},()=>new x.Vector4(0,-900,0,0))},uCastB:{value:Array.from({length:_e},()=>new x.Vector4(0,-901,0,0))}}}class ne{constructor(){this.p=[],this.n=[],this.c=[],this.l=[],this.k=[],this.m=null,this.count=0}tri(t,a,o,i,d=0){const r=a[0]-t[0],n=a[1]-t[1],h=a[2]-t[2],s=o[0]-t[0],l=o[1]-t[1],f=o[2]-t[2];let v=n*f-h*l,m=h*s-r*f,u=r*l-n*s;const p=Math.max(Math.hypot(v,m,u),1e-9);v/=p,m/=p,u/=p;const w=this.m;for(const g of[t,a,o]){if(w){const y=w.elements,b=g[0],z=g[1],S=g[2];this.p.push(y[0]*b+y[4]*z+y[8]*S+y[12],y[1]*b+y[5]*z+y[9]*S+y[13],y[2]*b+y[6]*z+y[10]*S+y[14]);const L=y[0]*v+y[4]*m+y[8]*u,F=y[1]*v+y[5]*m+y[9]*u,T=y[2]*v+y[6]*m+y[10]*u,q=Math.max(Math.hypot(L,F,T),1e-9);this.n.push(L/q,F/q,T/q)}else this.p.push(g[0],g[1],g[2]),this.n.push(v,m,u);this.c.push(i.r,i.g,i.b),this.l.push(g[0],g[1],g[2]),this.k.push(d)}this.count++}quad(t,a,o,i,d,r=0){this.tri(t,a,o,d,r),this.tri(t,o,i,d,r)}box(t,a,o,i,d,r,n,h=0,{top:s=!0,bottom:l=!1,topCol:f=null,topKind:v=null}={}){const m=t-i/2,u=t+i/2,p=a,w=a+d,g=o-r/2,y=o+r/2;this.quad([u,p,g],[u,w,g],[u,w,y],[u,p,y],n,h),this.quad([m,p,y],[m,w,y],[m,w,g],[m,p,g],n,h),this.quad([m,p,g],[m,w,g],[u,w,g],[u,p,g],n,h),this.quad([u,p,y],[u,w,y],[m,w,y],[m,p,y],n,h),s&&this.quad([m,w,g],[m,w,y],[u,w,y],[u,w,g],f||n,v??h),l&&this.quad([m,p,y],[m,p,g],[u,p,g],[u,p,y],n,h)}gable(t,a,o,i,d,r,n,h,s=.5){const l=t-i/2-s,f=t+i/2+s,v=o-d/2,m=o+d/2,u=a-s*r/(i/2),p=a+r;this.quad([l,u,v],[l,u,m],[t,p,m],[t,p,v],n,2),this.quad([f,u,m],[f,u,v],[t,p,v],[t,p,m],n,2),this.tri([t-i/2,a,v],[t,p,v],[t+i/2,a,v],h,1),this.tri([t+i/2,a,m],[t,p,m],[t-i/2,a,m],h,1)}stem(t,a,o,i,d,r,n,h,s=0,l=!1){for(let f=0;f<n;f++){const v=f/n*Math.PI*2,m=(f+1)/n*Math.PI*2,u=Math.cos(v),p=Math.sin(v),w=Math.cos(m),g=Math.sin(m),y=[t+i*u,a,o+i*p],b=[t+i*w,a,o+i*g],z=[t+d*w,a+r,o+d*g],S=[t+d*u,a+r,o+d*p];d>0?this.quad(y,S,z,b,h,s):this.tri(y,[t,a+r,o],b,h,s),l&&d>0&&this.tri(S,[t,a+r,o],z,h,s)}}build(){const t=new x.BufferGeometry;return t.setAttribute("position",new x.Float32BufferAttribute(this.p,3)),t.setAttribute("normal",new x.Float32BufferAttribute(this.n,3)),t.setAttribute("aCol",new x.Float32BufferAttribute(this.c,3)),t.setAttribute("aLocal",new x.Float32BufferAttribute(this.l,3)),t.setAttribute("aKind",new x.Float32BufferAttribute(this.k,1)),t.computeBoundingSphere(),t}}const fo=`
attribute vec3 aCol; attribute vec3 aLocal; attribute float aKind;
#ifdef HOUSE
attribute vec3 iWall; attribute vec3 iRoof;
#endif
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying float vK; varying float vH;
uniform float uTime;
void main() {
  vec4 p = vec4(position, 1.); vec3 n = normal; vH = .5;
  #ifdef USE_INSTANCING
  float id = float(gl_InstanceID);
  // a thing's own number, from the place it stands: the same over the whole of it
  vH = fract(sin(dot(instanceMatrix[3].xyz, vec3(12.9898, 78.233, 37.719))) * 43758.5453);   // (BROUGHT IN: the published hash form, see this file's head)
  // wings beat and washing stirs, each by the clock and its own number
  if (aKind > 7.5 && aKind < 8.5) p.y += abs(aLocal.z) * sin(uTime * 11. + id * 1.7) * .75;
  if (aKind > 6.5 && aKind < 7.5) p.x += sin(uTime * 2.9 + aLocal.z * 1.6 + id * 2.1) * .42 * clamp(4.4 - aLocal.y, 0., 1.6);
  // a tree's head stirs in the air, the more the higher, each by the clock and its own number
  if (aKind > 13.5 && aKind < 14.5) { p.x += sin(uTime * 1.3 + id * 1.9) * ${oe.sway.toFixed(3)} * aLocal.y; p.z += sin(uTime * 1.03 + id * 2.7) * ${(oe.sway*.6).toFixed(3)} * aLocal.y; }
  p = instanceMatrix * p; n = mat3(instanceMatrix) * n;
  #endif
  vec4 w = modelMatrix * p; vW = w.xyz;
  vec3 nn = mat3(modelMatrix) * n; vN = nn / max(length(nn), 1e-4);
  vC = aCol; vL = aLocal; vK = aKind;
  #ifdef HOUSE
  if (aKind > 1.5 && aKind < 2.5) vC = iRoof * aCol; else if (aKind > .5 && aKind < 1.5) vC = iWall * aCol;
  #endif
  gl_Position = projectionMatrix * viewMatrix * w;
}`,uo=`
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec3 vL; varying float vK; varying float vH;
uniform float uTime; uniform sampler2D uPlan;
${Oe}
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
void main() {
  vec3 n = vN / max(length(vN), 1e-4);
  if (!gl_FrontFacing) n = -n;
  float wet = 0.;
  vec3 alb = vC; float contact = 1.; float open = 1.; float k = floor(vK + .5);
  vec3 toEye = cameraPosition - vW; vec3 v = toEye / max(length(toEye), 1e-3);
  vec3 glint = vec3(0.);
  float px = max(fwidth(vL.x) + fwidth(vL.y) + fwidth(vL.z), 1e-4);     // metres across one pixel
  #ifdef HOUSE
  open = rowShade(vW);
  // the town was built quarter by quarter, each of its own kiln and quarry: districts a hundred metres and more
  // across are a little lighter or darker, warmer or cooler than their neighbours
  vec2 plan = vec2(planOf(vW).x, vW.z);
  float qa = vnoise(plan * .0085 + 3.7), qb = vnoise(plan * .0062 + 41.3);
  alb *= mix(.8, 1.16, smoothstep(.25, .75, qa)) * mix(vec3(1.06, 1., .92), vec3(.93, 1., 1.1), smoothstep(.3, .7, qb));
  // and house by house: no two roofs of a terrace have weathered alike, nor two fronts been painted in one year,
  // so a terrace is a row of houses and not one long bar, from the next street as from across the harbour
  float own = clamp(vH, 0., 1.), own2 = fract(own * 7.31);
  if (k == 2.) alb *= mix(.74, 1.22, own) * mix(vec3(1.07, 1., .92), vec3(.95, 1., 1.06), own2);
  else if (k == 1.) alb *= mix(.82, 1.16, own2);
  #endif
  if (k == 1.) {
    // a house wall: courses of brick or washed plaster, sash windows in floors of three metres with stone
    // sills and lintels, a darker foot, and the eaves' shade under the roof
    float u = vL.x + vL.z + 40.; float fine = clamp(1. - px * 1.6, 0., 1.);
    vec2 cell = vec2(u / 2.5, vL.y / 3.); vec2 f = fract(cell); float below = step(.2, vL.y) * step(vL.y, 7.02);
    float win = step(.27, f.x) * step(f.x, .73) * step(.3, f.y) * step(f.y, .8) * below;
    float sash = step(.21, f.x) * step(f.x, .79) * step(.22, f.y) * step(f.y, .88) * below - win;
    float bars = win * max(step(abs(f.x - .5), .025), step(abs(f.y - .55), .02));
    float isBrick = smoothstep(1.25, 1.7, vC.r / max(vC.b, .02) * .5);
    vec2 bq = vec2(u * 1.6 + .5 * floor(vL.y * 4.4), vL.y * 4.4);
    float brick = (.84 + .3 * h21(floor(bq))) * (1. - .22 * step(.86, fract(bq.y)));
    float wash = .9 + .2 * h21(floor(vec2(u * .35, vL.y * .22) + floor(vW.z / 8.) * 3.1));
    alb *= mix(1., mix(wash, brick, isBrick), fine * .85);
    // rain streaks under each sill and soot toward the eaves
    alb *= 1. - .12 * fine * step(f.y, .22) * step(.27, f.x) * step(f.x, .73) * below;
    float seen = max(dot(n, v), 0.); float fr = 1. - seen; fr *= fr;
    float pane = h21(floor(cell) + floor(vW.z / 8.) * 7.3);
    vec3 glass = mix(vec3(.05, .07, .10), uSkyCol * .8, .16 + .2 * pane + .6 * fr);
    alb = mix(alb, vec3(.9, .88, .82), sash * mix(.12, .9, fine));
    vec3 rv = reflect(-v, n); float toGlow = max(dot(rv, vec3(uGlowDir.x, -uGlowDir.y, uGlowDir.z)), 0.);
    glass += uGlow * (toGlow * toGlow * (.25 + 1.5 * pane * pane));
    alb = mix(alb, glass, win * mix(.28, 1., fine));
    // the panes sit a brick's length in from the face: the reveal shades a band under the lintel and down one jamb
    alb *= 1. - .5 * win * fine * max(step(.71, f.y), step(f.x, .325));
    alb = mix(alb, vec3(.88, .86, .8), bars * fine);
    // a pane throws the sun back along its mirrored ray: a bright window here and there
    vec3 rf = reflect(-uSun, n); float sp = max(dot(rf, v), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp;
    glint = uSunCol * win * (1. - bars) * sp * sp * (.4 + 1.6 * pane) * 1.6;
    contact = smoothstep(-.6, 3.2, vL.y) * (1. - .3 * smoothstep(5.9, 7., vL.y) * step(vL.y, 7.02));
  } else if (k == 2.) {
    // a roof: courses of slate or tile, each one a shade its own, a pale ridge, lichen in long stains
    float fine = clamp(1.15 - px * 1.6, 0., 1.);
    float run = abs(vL.x) * 2.3 + vL.y * .4;
    float row = fract(run); float t = h21(floor(vec2(vL.z * 1.5 + .5 * floor(run), run)));
    float stain = h21(floor(vec2(vL.z * .9 + floor(vW.z / 8.) * 1.7, 3.))) * smoothstep(0., 3., abs(vL.x));
    float joint = fract(vL.z * 1.5 + .5 * floor(run));
    alb *= mix(1., (.64 + .36 * smoothstep(0., .22, row)) * (.78 + .44 * t) * (1. - .2 * (1. - smoothstep(0., .1, joint))), fine);
    alb *= 1. - .2 * stain;
    // slates replaced and weathered in patches a few courses across, which hold where the courses run together
    alb *= mix(1., .88 + .24 * h21(floor(vec2(vL.z * .55 + floor(run * .25) * .37, run * .25))), clamp(1.3 - px * .45, 0., 1.));
    alb = mix(alb, alb * 1.35 + .03, (1. - smoothstep(.15, .5, abs(vL.x))) * step(9.2, vL.y) * fine);
    contact = .86 + .14 * smoothstep(0., 2.5, abs(vL.x));
    alb *= 1. - .42 * smoothstep(3.55, 3.75, abs(vL.z)) * clamp(1.7 - px * 1.1, 0., 1.);
  } else if (k == 3.) {
    // the town's ground. Between two terraces a lane: flagged pavements under the house fronts, a kerb, and
    // a cobbled carriageway with a gutter down its middle; on the open places, larger flags.
    float fine = clamp(1. - px * 2., 0., 1.);
    float lane = mod(vL.x - ${le}., ${ae}.);                    // 0 at a row's centre, 5..14 the lane
    float inLane = (1. - step(.5, vL.y)) * step(5., lane) * step(lane, 14.);
    float walk = inLane * (1. - step(6.6, lane) * step(lane, 12.4));
    float kerb = inLane * (step(abs(lane - 6.6), .14) + step(abs(lane - 12.4), .14));
    float gutter = inLane * step(abs(lane - 9.5), .2);
    vec2 cb = mix(vec2(vL.x, vL.z) * 1.4, vec2(vL.x, vL.z + .5 * floor(vL.x * .6)) * vec2(.6, .45), walk);
    float t = h21(floor(cb)); vec2 cf = abs(fract(cb) - .5);
    // a street that goes up: flagged pavements under the terraces' end walls, pale kerbs, and a carriageway of
    // grey setts that crosses every lane; the lanes between the terraces are of darker setts
    float st = ${co};
    float inStreet = (1. - step(.5, vL.y)) * step(st, ${(V.open*V.plot).toFixed(1)});
    float carriage = inStreet * step(3., st) * step(st, ${(V.open*V.plot-3).toFixed(1)});
    walk = max(walk * (1. - carriage), inStreet - carriage);
    kerb = max(kerb * (1. - inStreet), inStreet * (step(abs(st - 3.), .2) + step(abs(st - ${(V.open*V.plot-3).toFixed(1)}), .2)));
    gutter *= 1. - inStreet;
    alb *= mix(1., .66, inLane * (1. - walk) * (1. - carriage));
    alb = mix(alb, alb * .8, walk);
    alb = mix(alb, vec3(.265, .248, .226), carriage);
    alb *= mix(1., (.84 + .28 * t) * (1. - .28 * smoothstep(.36, .5, max(cf.x, cf.y))), fine);
    // the setts are worn pale in two tracks where the carts' wheels run, down every lane and up every street, and
    // laid in bands: every few courses one of darker stone goes across from kerb to kerb
    float broad = clamp(1.3 - px * .45, 0., 1.);
    float ruts = inLane * (1. - walk) * (1. - carriage) * (2. - smoothstep(.25, .6, abs(lane - 8.3)) - smoothstep(.25, .6, abs(lane - 10.7)))
      + carriage * (2. - smoothstep(.3, .7, abs(st - 5.6)) - smoothstep(.3, .7, abs(st - 10.4)));
    alb *= 1. + .17 * ruts * broad;
    float across = mix(vL.z, vL.x, carriage);
    alb *= 1. - .13 * step(fract(across / 3.4), .14) * (inLane * (1. - walk) + carriage) * (1. - min(ruts, 1.)) * broad;
    alb = mix(alb, vec3(.56, .53, .47), kerb * mix(.12, 1., fine));
    // the open places are laid in broad flags, course by course, each a tone of its own
    vec2 fl = vec2(vL.x / 3.2, vL.z / 2.2 + .5 * floor(vL.x / 3.2)); vec2 ff = abs(fract(fl) - .5);
    float fans = step(1.5, vL.y);
    float flagged = step(.5, vL.y) * (1. - fans) * clamp(1. - px * .45, 0., 1.);
    alb *= mix(1., (.9 + .2 * h21(floor(fl) + 2.)) * (1. - .22 * smoothstep(.44, .5, max(ff.x, ff.y))), flagged);
    // the squares are set in fans of small setts, pale and dark by turns, scallop over scallop
    vec2 sc = vec2(vL.z / 4.4, vL.x / 2.2); float rowS = floor(sc.y);
    vec2 sf = vec2(fract(sc.x + .5 * mod(rowS, 2.)) - .5, fract(sc.y) * .5);
    float ringS = fract(length(sf) * 7.);
    alb *= mix(1., mix(.8, 1.07, smoothstep(.35, .5, ringS) * (1. - smoothstep(.85, 1., ringS))) * (.94 + .12 * h21(vec2(rowS, floor(sc.x + .5 * mod(rowS, 2.)))) ), fans * clamp(1. - px * .5, 0., 1.));
    alb *= 1. - .3 * gutter * fine;
    // worn tracks and damp: broad stains that never repeat row to row
    float damp = h21(floor(vec2(vL.x / ${ae}., vL.z * .11))) * .5 + h21(floor(vec2(vL.x * .21, vL.z * .05))) * .5;
    alb *= .9 + .2 * damp;
    // THE BACK GARDENS. The terraces stand back to back in pairs: of the lanes between them every other one is no
    // street but two rows of gardens, one behind each house, walled in brick plot from plot and back to back down
    // the middle: grass and a path to the back gate, beds of vegetables, a flagged yard. Where no house stands the
    // ground is left bare setts. On the wall they are the same gardens, hanging.
    float rowK = floor((vL.x - ${le}.) / ${ae}.), upper = step(9.5, lane);
    float plotAt = (vL.z - (${ue.z0.toFixed(1)})) / ${V.plot.toFixed(1)}, plotJ = floor(plotAt);
    vec2 cellG = vec2(plotJ, rowK + upper);
    float hasHouse = textureLod(uPlan, (cellG + .5) / vec2(${ue.plots}., ${ue.rows}.), 0.).r;
    float garden = inLane * (1. - step(.5, mod(rowK + 64., 2.))) * step(.5, hasHouse);
    if (garden > 0.) {
      float gd = mix(lane - 5., 14. - lane, upper);            // metres from the house's back wall, 0 to 4.5
      float gz = fract(plotAt) * ${V.plot.toFixed(1)};       // metres across the plot
      float g1 = h21(cellG + 3.3), g2 = h21(cellG + 17.9), g3 = h21(cellG + 41.1);
      float nearby = clamp(1.25 - px * 1.3, 0., 1.), told = clamp(1.4 - px * .5, 0., 1.);
      // grass, each lawn a green of its own, mown in stripes or let go
      vec3 grass = mix(vec3(.105, .165, .06), vec3(.19, .225, .09), g2) * (.88 + .24 * vnoise(vec2(vL.x, vL.z) * .9));
      grass = mix(grass, vec3(.24, .22, .11), .6 * step(.86, g3));       // one lawn in seven is parched
      grass *= 1. + .1 * nearby * (step(.5, fract(gz * .8)) - .5) * step(g3, .5);
      vec3 gcol = grass;
      // a flagged path from the back door to the gate in the back wall
      float pathZ = 1.6 + 4.8 * g3;
      float pathOn = step(abs(gz - pathZ), .45);
      // some are flagged yards with a bed along the back wall, some kitchen gardens in rows of dark earth and
      // green across the plot; the rest are lawn with a border of flowers down one side
      if (g1 > .78) {
        vec2 fq = vec2(gd / .9, gz / .9 + .5 * floor(gd / .9)); vec2 fa = abs(fract(fq) - .5);
        vec3 yard = vec3(.34, .31, .27) * (.86 + .28 * h21(floor(fq) + cellG));
        yard *= 1. - .25 * nearby * smoothstep(.42, .5, max(fa.x, fa.y));
        gcol = mix(yard, grass * .8, step(3.3, gd));
        pathOn = 0.;
      } else if (g1 > .52) {
        float bedRow = fract(gz / 1.1);
        vec3 earth = vec3(.14, .1, .07), leaf = mix(vec3(.1, .2, .06), vec3(.2, .27, .08), h21(vec2(floor(gz / 1.1), g2 * 9.)));
        vec3 beds = mix(mix(earth, leaf, .55), mix(earth, leaf, smoothstep(.2, .35, bedRow) * (1. - smoothstep(.75, .9, bedRow))), nearby);
        gcol = mix(grass, beds, step(1.2, gd) * (1. - pathOn));
      } else {
        float side = step(.5, g2);
        float border = step(mix(gz, ${V.plot.toFixed(1)} - gz, side), 1.25) * (1. - pathOn);
        vec2 fq = floor(vec2(gd, gz) * 2.6);
        float bloom = step(.72, h21(fq + cellG * 3.));
        vec3 flower = mix(vec3(.75, .2, .16), mix(vec3(.85, .65, .12), vec3(.8, .78, .7), step(.5, h21(fq + 9.))), step(.4, h21(fq + 5.)));
        gcol = mix(gcol, mix(vec3(.07, .14, .05), flower, bloom * nearby), border);
      }
      gcol = mix(gcol, vec3(.4, .36, .3) * (.9 + .2 * h21(floor(vec2(gd * 1.3, 2.)) + cellG)), pathOn * told);
      // the walls: brick, plot from plot and back to back down the middle of the lane, with a foot of shade beside
      // them; they hold as far as a wall can be told
      float wallD = min(min(gz, ${V.plot.toFixed(1)} - gz), 4.5 - gd);
      float wallOn = 1. - smoothstep(.16, .22, wallD);
      gcol *= 1. - .28 * (1. - smoothstep(.2, .9, wallD)) * told;
      gcol = mix(gcol, vec3(.33, .2, .15) * (.85 + .3 * g3), wallOn * told);
      alb = mix(alb, gcol * (.92 + .16 * damp), garden);
    }
    open = vL.y > .5 ? 1. : mix(rowShade(vW), 1., carriage * .6);
    contact = mix(1., .78 + .22 * smoothstep(5., 7.4, lane) * (1. - smoothstep(11.6, 14., lane)), (1. - step(.5, vL.y)) * step(4.9, lane) * step(lane, 14.1));
  } else if (k == 4.) {
    float st = h21(floor(vec2(vW.y * .35 + sin(vW.z * .02) * 3., 7.)));
    alb *= .82 + .3 * st;
    if (abs(n.y) > .7) {
      // the level top: grey rock dressed flat long ago and cracked along its joints into many-sided flags the
      // size of a doorstep, lichened in patches
      vec2 gq = vW.xz * vec2(.44, .37), gi = floor(gq), gf = fract(gq);
      float d1 = 8., d2 = 8., cid = 0.;
      for (int a = -1; a <= 1; a++) for (int b = -1; b <= 1; b++) {
        vec2 o = vec2(float(a), float(b));
        vec2 r = o + vec2(h21(gi + o), h21(gi + o + 17.3)) - gf; float d = dot(r, r);
        if (d < d1) { d2 = d1; d1 = d; cid = h21(gi + o + 5.1); } else if (d < d2) d2 = d;
      }
      float fineT = clamp(1.25 - px * 1.1, 0., 1.);
      float crack = 1. - smoothstep(0., .09, sqrt(d2) - sqrt(d1));
      float grain = vnoise(vW.xz * 2.1) * .5 + vnoise(vW.xz * .23 + 5.) * .5;
      alb = mix(alb, vec3(dot(alb, vec3(.33))) * vec3(.96, 1., 1.06), .72);
      alb *= mix(1., (.86 + .24 * cid) * (1. - .42 * crack), fineT) * (.88 + .24 * grain);
      // lichen: ochre and pale stains that keep to some flags and not others
      float lich = smoothstep(.55, .8, vnoise(vW.xz * .11 + 21.) * .6 + cid * .4);
      alb = mix(alb, alb * vec3(1.16, 1.08, .8), lich * .5);
      alb *= 1. + .2 * (1. - smoothstep(260., 266., vW.x));
      // rain stands in the hollows of the top, level, and holds the sky
      float hollow = vnoise(vW.xz * vec2(.13, .085) + 3.) * .7 + vnoise(vW.xz * .41 + 11.) * .3;
      alb *= 1. - .3 * smoothstep(.52, .66, hollow);
      wet = smoothstep(.665, .685, hollow);
    }
  } else if (k == 9.) {
    // dressed stone in courses, the joints breaking from course to course; long stains of weather run down it
    float fine = clamp(1. - px * 1.6, 0., 1.);
    vec2 b = vec2((vL.x + vL.z) * .7 + .5 * floor(vL.y / .75), vL.y / .75);
    vec2 bf = abs(fract(b) - .5);
    alb *= mix(1., (.84 + .3 * h21(floor(b))) * (1. - .36 * smoothstep(.4, .5, max(bf.x * .55 + .225, bf.y))), fine);
    float stain = vnoise(vec2((vL.x + vL.z) * .55, vL.y * .06)) * .6 + vnoise(vec2((vL.x + vL.z) * .12, vL.y * .2) + 4.) * .4;
    alb *= .84 + .3 * stain;
  } else if (k == 10.) {
    // a vault of brick: rings of bricks laid across its width, bonded ring to ring, each brick a tone of its own
    // and a burnt header here and there, pale lime in the joints; every twelfth ring is a rib of dressed stone.
    // Damp comes through at the edges and runs down the curve in long dark streaks, and lime weeps white beside it
    float along = vL.x + vL.y * .6;
    float fine = clamp(1.2 - px * 1.2, 0., 1.), broad = clamp(1.3 - px * .5, 0., 1.);
    vec2 b = vec2(vL.z * 1.1 + .5 * floor(along * 3.4), along * 3.4);
    vec2 bf = abs(fract(b) - .5); float id = h21(floor(b));
    float joint = smoothstep(.41, .5, max(bf.x * 3.3 - 1.15, bf.y));
    vec3 brickC = alb * (.8 + .34 * id); brickC = mix(brickC, brickC * vec3(.6, .56, .62), step(.9, id));
    vec3 lime = vec3(.8, .76, .68) * (dot(alb, vec3(.34)) + .34);
    alb = mix(alb, mix(brickC, lime, joint), fine);
    float ringNo = floor(along * 3.4), rib = step(mod(ringNo, 12.), .5);
    alb = mix(alb, vec3(.8, .77, .7) * (.86 + .2 * h21(vec2(ringNo, floor(vL.z * .9)))) * (1. - .3 * joint * fine), rib * broad);
    float streak = vnoise(vec2(vL.z * 2.4, along * .1)) * .65 + vnoise(vec2(vL.z * 6.5 + 3., along * .23)) * .35;
    float fromEdge = smoothstep(.4, 2.5, abs(vL.z)) * .6 + .4;
    alb *= 1. - .5 * smoothstep(.5, .78, streak) * fromEdge;
    alb = mix(alb, vec3(.84, .82, .76), .55 * smoothstep(.74, .9, vnoise(vec2(vL.z * 3.1 + 9., along * .16))) * fromEdge);
    alb *= .88 + .24 * vnoise(vec2(vL.z * .5, along * .3));
    // the arris at each edge of the vault is in the ring's own shade
    contact = 1. - .28 * smoothstep(1.7, 2.6, abs(vL.z));
  } else if (k == 11.) {
    // a round stack of brick: courses round it, the bond breaking from course to course, each brick a tone of its
    // own; long stains of rain down it and soot thickening toward the crown
    float fine = clamp(1. - px * 1.4, 0., 1.);
    float ang = atan(vL.z, abs(vL.x) < 1e-4 ? 1e-4 : vL.x);
    vec2 b = vec2(ang * 3.8197 + .5 * floor(vL.y * 2.6), vL.y * 2.6);
    vec2 bf = abs(fract(b) - .5);
    alb *= mix(1., (.78 + .4 * h21(floor(b))) * (1. - .34 * smoothstep(.36, .5, max(bf.x * .5 + .25, bf.y))), fine);
    alb *= .82 + .3 * vnoise(vec2(ang * 2.5, vL.y * .09));
    float sootUp = smoothstep(${(De.tall*.5).toFixed(1)}, ${De.tall.toFixed(1)}, vL.y);
    alb = mix(alb, alb * vec3(.42, .4, .42), sootUp * (.55 + .45 * vnoise(vec2(ang * 1.7 + 3., vL.y * .2))));
  } else if (k == 12.) {
    // a church's slating: small slates in level courses, the bond breaking from course to course, each slate a
    // tone of its own; every few metres up a band of paler, greener slate with a toothed lower edge, and long
    // stains of weather down the slope
    float fine = clamp(1.15 - px * 1.6, 0., 1.);
    float across = vL.x * .8 + vL.z * 1.3;
    float run = vL.y * 3.; float row = fract(run), course = floor(run);
    vec2 sl = vec2(across * 2.2 + .5 * course, course);
    float t = h21(floor(sl)), joint = fract(sl.x);
    float tooth = abs(fract(across * .45) - .5) * 1.1;
    float band = 1. - step(.21, fract((vL.y - 9.3 + tooth) / 6.5));
    alb = mix(alb, vec3(.37, .44, .38), band * .85);
    alb *= mix(1., (.66 + .34 * smoothstep(0., .25, row)) * (.8 + .4 * t) * (1. - .2 * (1. - smoothstep(0., .1, joint))), fine);
    alb *= .9 + .2 * vnoise(vec2(across * .35, vL.y * .9));
  } else if (k == 13.) {
    if (vL.y < .5) {
      // a churchyard's turf, in the yard's own axes: rough grass, paler where it is worn and deeper in the damp,
      // daisies in it; and gravel paths from the gate to the west door, from the side gate, and round the church
      float fine = clamp(1.1 - px * 1.8, 0., 1.);
      vec2 q = vL.xz;
      float gate = max(abs(q.x) - 1.2, max(-21. - q.y, q.y + 6.));
      vec2 rb = abs(q - vec2(0., 9.5)) - vec2(8.6, 16.4);
      float ring = abs(length(max(rb, 0.)) + min(max(rb.x, rb.y), 0.)) - .8;
      float side = max(abs(q.y - 8.) - 1., max(-27. - q.x, q.x + 8.));
      float path = 1. - smoothstep(0., .3, min(min(gate, ring), side));
      float broadN = vnoise(q * .16 + 7.) * .6 + vnoise(q * .55) * .4;
      alb *= .74 + .5 * broadN;
      alb = mix(alb, vec3(.3, .29, .13), .5 * smoothstep(.5, .8, vnoise(q * .31 + 31.)));
      alb *= mix(1., .78 + .44 * h21(floor(q * 5.5)), fine);
      alb = mix(alb, vec3(.93, .92, .84), step(.972, h21(floor(q * 3.1) + 9.)) * step(.55, broadN) * fine * .8);
      vec3 gravel = vec3(.62, .55, .44) * mix(1., .8 + .4 * h21(floor(q * 7.)), fine);
      alb = mix(alb, gravel, path);
    } else {
      // leaves: sprays of darker and lighter green, deeper in toward the bole
      float fine = clamp(1.1 - px * 1.2, 0., 1.);
      vec3 q = vL * vec3(1.7, 1.1, 1.7);
      alb *= .78 + .44 * vnoise(q.xz + q.y * 1.3);
      alb *= mix(1., .72 + .56 * h21(floor(vec2(q.x + q.z, q.y * 2.6) * 2.2)), fine);
    }
  } else if (k == 5.) {
    float band = step(1.55, vL.y) * step(vL.y, 2.5); float f = fract(vL.x / 1.4 + .5);
    float win = band * step(.14, f) * step(f, .86);
    alb = mix(alb, vec3(.12, .17, .22), win);
    alb = mix(alb, vec3(.9, .86, .74), step(2.5, vL.y) * step(vL.y, 2.75));
  } else if (k == 14.) {
    // leaves: each tree a green of its own, from holly-dark to lime, and one in a dozen a copper beech
    float tree = clamp(vH, 0., 1.), tree2 = fract(tree * 9.7);
    alb *= mix(.72, 1.22, tree2) * mix(vec3(.9, 1., .95), vec3(1.2, 1.04, .7), tree * tree);
    alb = mix(alb, vec3(.21, .08, .06) * mix(.8, 1.2, tree2), step(.92, fract(tree * 3.3)));
  }
  vec3 c = lit(alb, n, vW, contact, open) + glint * slabShadow(vW) * open;
  if (wet > 0.) {
    float fr = 1. - max(v.y, 0.); fr *= fr;
    float rip = vnoise(vW.xz * 2.3 + vec2(uTime * .6, uTime * .35));
    vec3 pool = mix(uFogCol, uZenith, .62) * (.72 + .2 * fr) * (.92 + .16 * rip);
    vec3 rs = reflect(-v, vec3(0., 1., 0.)); float sp = max(dot(rs, uSun), 0.); sp *= sp; sp *= sp; sp *= sp; sp *= sp; sp *= sp;
    c = mix(c, pool + uSunCol * sp * sp * 2.5 * slabShadow(vW), wet * .92);
  }
  #ifdef HOUSE
  gl_FragColor = vec4(airFog(c, vW), 1.);
  #else
  gl_FragColor = vec4(airFogShare(c, vW, (k == 3. || k == 4. || k == 14.) ? 1. : .5), 1.);
  #endif
}`;function yt(e,t=!1){return new x.ShaderMaterial({uniforms:{...e},vertexShader:fo,fragmentShader:uo,side:x.DoubleSide,defines:t?{HOUSE:1}:{}})}const xa=new x.Vector3;function Fe(e,t,a,o,i,d,r,n=3,h=2,s=0){const l=[o];let f=o;for(;f<i-1e-6;){let u;f<P.sCrease?u=Math.min(i,P.sCrease):f<ke?u=Math.min(i,ke,f+h):u=i,l.push(u),f=u}const v={},m={};for(let u=0;u+1<l.length;u++){const p=l[u],w=l[u+1];ye(p,v),ye(w,m);const g=(y,b,z)=>{e.p.push(y.gx+d*y.ux,y.gy+d*y.uy,z),e.n.push(y.ux,y.uy,0),e.c.push(r.r,r.g,r.b),e.l.push(b,s,z),e.k.push(n)};g(v,p,t),g(v,p,a),g(m,w,a),g(v,p,t),g(m,w,a),g(m,w,t),e.count+=2}}function Et(e,t,a,o,i,d){let r=a;const n={},h={};for(;r<o-1e-6;){const s=r<P.sCrease?Math.min(o,P.sCrease):r<ke?Math.min(ke,r+4):o;ye(r,n),ye(s,h);const l=P.thick,f=[n.gx,n.gy,t],v=[h.gx,h.gy,t],m=[h.gx-l*h.ux,h.gy-l*h.uy,t],u=[n.gx-l*n.ux,n.gy-l*n.uy,t];d?e.quad(f,v,m,u,i,4):e.quad(f,u,m,v,i,4),r=s}}const c={brick:new x.Color("#B8573B"),plaster:new x.Color("#E9D8B6"),sea:new x.Color("#3A77A6"),sky:new x.Color("#D4E6EF"),slate:new x.Color("#5C656F"),rock:new x.Color("#8C8176"),enamel:new x.Color("#E2B13C"),tile:new x.Color("#A06A55"),cobble:new x.Color("#9A8E80"),paving:new x.Color("#C2B49A"),stone:new x.Color("#B9AE9C"),dark:new x.Color("#2E343B"),white:new x.Color("#F2EBDD"),wood:new x.Color("#6B4A34"),iron:new x.Color("#3A3F46"),stack:new x.Color("#A0705E"),post:new x.Color("#D9D2C2")};async function po(e,t,a){const o=new ne,i=P.z0,d=P.z1,r=P.avenueZ,n=P.canalZ,h=[i,-100,r-10,r+10,79,139,300,460,700,n-8,n-5,n+5,n+8,d];for(let u=0;u+1<h.length;u++){const p=h[u],w=h[u+1],g=p===r-10,y=p===n-5,b=p===n-8||p===n+5;if(y)continue;const z=g?c.paving:b?c.stone:c.cobble;Fe(o,p,w,0,ce,b?.4:0,z,3,2,g||b?1:0)}await e.yield(),Fe(o,n-5,n+5,0,ce,-1.2,c.dark,3,2,1),Fe(o,-100,-70,195,310,.06,c.paving.clone().lerp(c.cobble,.3),3,2,2),Fe(o,i,d,0,9,.05,c.stone,3,2,1),await e.yield();const s=c.rock;{const u=P.thick,p={},w={};let g=0;for(;g<ce-1e-6;){const y=g<P.sCrease?P.sCrease:g<ke?Math.min(ke,g+4):ce;ye(g,p),ye(y,w);for(let b=0;b<8;b++){const z=ve(i,d,b/8),S=ve(i,d,(b+1)/8);o.quad([p.gx-u*p.ux,p.gy-u*p.uy,z],[w.gx-u*w.ux,w.gy-u*w.uy,z],[w.gx-u*w.ux,w.gy-u*w.uy,S],[p.gx-u*p.ux,p.gy-u*p.uy,S],s,4)}g=y}Et(o,i,0,ce,s,!0),Et(o,d,0,ce,s,!1);for(let y=0;y<8;y++){const b=ve(i,d,y/8),z=ve(i,d,(y+1)/8);o.quad([P.wallX,P.rimY,b],[P.wallX,P.rimY,z],[P.wallX+u,P.rimY,z],[P.wallX+u,P.rimY,b],s,4),o.quad([0,P.floorY,z],[0,P.floorY,b],[0,P.floorY-u,b],[0,P.floorY-u,z],c.stone,4)}}await e.yield();for(const u of[r-2,r+2])Fe(o,u-1.5,u+1.5,2,ce,.07,c.cobble.clone().multiplyScalar(.72),3,2,1);for(const u of[r-9.6,r+9.6])Fe(o,u-.4,u+.4,9,ce,.3,c.white,0,2,1);for(let u=14;u<ce-4;u+=9.5)Fe(o,r-.25,r+.25,u,u+4,.09,c.white,0,2,1);await e.yield();for(const u of[r-2.7,r-1.3,r+1.3,r+2.7])Fe(o,u-.16,u+.16,2,ce,.14,c.iron,0,2,1);const l={up:!0,quay:0,top:1},f={up:!1,quay:1,top:0},v={};for(const u of[j.rail0+j.clearOf,ce-j.clearOf-j.cross])for(const p of[l,f]){const g=j.cross/36;for(let y=0;y<36;y++){const b=r+Ht(u+(y+.5)*g,p,v).z;for(const z of[-.7,.7])Fe(o,b+z-.16,b+z+.16,u+y*g,u+(y+1)*g,.15,c.iron,0,2,1)}}const m=new x.Mesh(o.build(),a);return m.frustumCulled=!1,m.matrixAutoUpdate=!1,t.add(m),m}const xe=e=>ke+(e-P.floorY-P.R),rt={z:350,r:75};function It(e=0){return{clock:{s:26,z:-367},millUp:{s:61,z:-266},steepleUp:{s:135,z:-178},clockLying:{s:xe(345),z:715},steepleLying:{s:xe(83),z:25},square:{s0:xe(79),s1:xe(139),z0:79,z1:139},carousel:{s:xe(104),z:112},fountain:{s:xe(118),z:130},mills:[{s:xe(128),z:170},{s:xe(146),z:220},{s:xe(232),z:470}],lake:{s:xe(226+e),z:rt.z,r:rt.r},chimneys:[499,512,525,538,551].map(t=>({s:le+Math.ceil((xe(245)-le)/ae)*ae,z:t})),balloon:{s:le+9*ae,z:-186,half:12},balloonWall:{s:le+Math.round((xe(270)-le)/ae)*ae,z:614,half:12},balloonTop:{s:le+Math.round((xe(325)-le)/ae)*ae,z:752,half:12},viaduct:{s0:xe(273.9),z0:667.13,s1:ce,z1:624.75,h:44},tramPlace:{s0:195,s1:310,z0:-100,z1:-70}}}const lt={tower:7,deep:10,naveEnd:22.5},it={foot:5,hub:18,sailsOff:5.2,reach:10.2},ct={wide:4,deep:5.5,turned:6.5};function je(e,t,a,o=!1){if(!o&&Ut(t,a)||Math.abs(a-P.avenueZ)<14.5||Math.abs(a-P.canalZ)<12.5)return!0;const i=e.tramPlace;if(a>i.z0-4&&a<i.z1+4&&t>i.s0-5&&t<i.s1+5)return!0;const d=e.square;if(a>d.z0-4&&a<d.z1+4&&t>d.s0-5&&t<d.s1+5||Math.hypot(t-e.lake.s,a-e.lake.z)<e.lake.r+8)return!0;for(const m of[e.clock,e.clockLying,e.millUp,...e.mills])if(Math.abs(t-m.s)<12&&Math.abs(a-m.z)<11)return!0;for(const m of[e.millUp,...e.mills])if(Math.abs(a-(m.z-it.sailsOff))<ct.turned+1.5&&Math.abs(t-m.s)<it.reach+ct.deep)return!0;for(const m of[e.steepleUp,e.steepleLying])if(Math.abs(t-m.s)<lt.deep/2+5&&a>m.z-lt.tower/2-4&&a<m.z+lt.naveEnd+4)return!0;for(const m of[e.balloon,e.balloonWall,e.balloonTop])if(Math.abs(t-m.s)<ae/2&&Math.abs(a-m.z)<m.half)return!0;const r=e.chimneys;if(Math.abs(t-r[0].s)<10&&a>r[0].z-9&&a<r[4].z+9)return!0;const n=e.viaduct,h=n.s1-n.s0,s=n.z1-n.z0,l=Math.hypot(h,s),f=((t-n.s0)*h+(a-n.z0)*s)/l,v=((t-n.s0)*s-(a-n.z0)*h)/l*(s<0?1:-1);return f>-8&&f<l+4&&v>-11&&v<15}const re={zBefore:17.5,zAfter:38.5,sBelow:26.5,sAbove:20,wall:1.4,yew:9.5,gate:1.7,sideGate:8,approach:8,clear:.8};function mo(e,t,a,o){for(const i of[e.steepleUp,e.steepleLying])if(t>i.s-re.sBelow&&t<i.s+re.sAbove&&a+o>i.z-re.zBefore&&a-o<i.z+re.zAfter)return!0;return!1}function Bt(e,t,a,o){for(const i of[e.steepleUp,e.steepleLying]){const d=t-i.s,r=a-i.z;if(d>-re.sBelow-o&&d<re.sAbove+o&&r>-re.zBefore-o&&r<re.zAfter+o)return!0}return!1}function vo(e,t,a,o){for(const i of[e.steepleUp,e.steepleLying]){const d=t-i.s,r=a-i.z;if(Math.abs(d)<re.gate+o&&r<=-re.zBefore&&r>-re.zBefore-re.approach-o||Math.abs(r-re.sideGate)<re.gate+o&&d<=-re.sBelow&&d>-re.sBelow-re.approach-o)return!0}return!1}const Rt=[[-20.5,-13.5,9],[14,-14,7.5],[-20,32.5,8],[13.5,33,9.5],[-15.5,19,7]],Pt=[[-19.5,-3,8],[14.5,9,9]];function wo(e){const t=[];for(let a=-re.zBefore+3;a<=re.zAfter-3;a+=3.3)for(let o=-re.sBelow+2.5;o<=re.sAbove-2.4;o+=2.1){const i=e.range(-.22,.22),d=e.range(-.2,.2),r=e(),n=e.range(1.1,1.75),h=e.range(.75,1.05),s=e(),l=e.range(-.07,.07);if(e()>.8)continue;const f=o+i,v=a+d;Math.abs(f)<10.4&&v>-9.2&&v<27.5||Math.abs(f)<2.6&&v<-3||Math.abs(v-8)<2.4&&f<-8||[...Rt,...Pt].some(m=>Math.hypot(f-m[0],v-m[1])<3.4)||t.push({x:f,z:v,kind:r,tall:n,wide:h,tone:s,lean:l})}return t}function xo(e,t){const a=re,o=c.stone.clone().multiplyScalar(.9),i=c.white,d=new x.Color(.132,.168,.07),r=-a.sBelow,n=a.sAbove,h=-a.zBefore,s=a.zAfter;e.quad([r,.12,h],[r,.12,s],[n,.12,s],[n,.12,h],d,13);const l=(m,u,p,w)=>{const g=Math.hypot(p-m,w-u),y=Math.abs(p-m)>Math.abs(w-u);e.box((m+p)/2,0,(u+w)/2,y?g:.6,a.wall,y?.6:g,o,9,{topCol:i})};l(r,h,-1.7,h),l(1.7,h,n,h),l(r,s,n,s),l(n,h,n,s),l(r,h,r,6.3),l(r,9.7,r,s);for(const[m,u]of[[-1.9,h],[1.9,h],[r,6.1],[r,9.9]])e.box(m,0,u,.9,2.3,.9,o,9,{topCol:i}),e.stem(m,2.3,u,.62,0,.7,4,i,0);for(const[m,u]of[[-1.5,h+.3],[1.5,h+.3],[-1.5,h+2.5],[1.5,h+2.5]])e.box(m,0,u,.28,2.7,.28,c.wood,0,{top:!1});e.quad([-2.2,2.5,h-.2],[-2.2,2.5,h+3],[0,4.3,h+3],[0,4.3,h-.2],c.tile,2),e.quad([2.2,2.5,h+3],[2.2,2.5,h-.2],[0,4.3,h-.2],[0,4.3,h+3],c.tile,2);for(const m of[h+.3,h+2.5])e.tri([-1.6,3,m],[0,4.3,m],[1.6,3,m],c.wood,0);for(const m of t){const u=m.tone<.2?c.slate.clone().multiplyScalar(1.3):m.tone>.82?i:o.clone().multiplyScalar(.8+.3*m.tone);if(m.kind<.09){e.box(m.x,0,m.z,1.1,.9,2.2,u,9,{topCol:i});continue}if(m.kind<.3){e.box(m.x,0,m.z,1,.35,.7,u,0),e.box(m.x,.35,m.z,.3,m.tall+.9,.26,i,0),e.box(m.x,m.tall+.45,m.z,1.2,.28,.26,i,0);continue}const p=m.tall,w=m.wide/2,g=m.lean*p;e.quad([m.x-w,0,m.z-.12],[m.x-w+g,p,m.z-.12],[m.x+w+g,p,m.z-.12],[m.x+w,0,m.z-.12],u,0),e.quad([m.x+w,0,m.z+.12],[m.x+w+g,p,m.z+.12],[m.x-w+g,p,m.z+.12],[m.x-w,0,m.z+.12],u,0),e.quad([m.x-w,0,m.z+.12],[m.x-w+g,p,m.z+.12],[m.x-w+g,p,m.z-.12],[m.x-w,0,m.z-.12],u,0),e.quad([m.x+w,0,m.z-.12],[m.x+w+g,p,m.z-.12],[m.x+w+g,p,m.z+.12],[m.x+w,0,m.z+.12],u,0),e.tri([m.x-w+g,p,m.z],[m.x+g,p+w*.8,m.z],[m.x+w+g,p,m.z],u,0)}const f=new x.Color("#4C7244"),v=new x.Color("#72934A");for(const[m,u,p]of Rt){const w=p*.3,g=p-1.8;e.box(m,0,u,.7,2,.7,c.wood,0,{top:!1});for(let y=0;y<3;y++){const b=1.8+g*y*.3,z=w*(1-.24*y),S=y===2?0:z*.5;e.stem(m,b,u,z*.45,z,.5,9,f.clone().multiplyScalar(.7+.14*y),13),e.stem(m,b+.5,u,z,S,(y===2?g*.4:g*.36)-.5,9,f.clone().multiplyScalar(.92+.16*y),13)}}for(const[m,u,p]of Pt){const w=p*.36;e.box(m,0,u,.5,p*.42,.5,c.wood,0,{top:!1}),e.stem(m,p*.36,u,w*.4,w*.9,p*.14,10,v.clone().multiplyScalar(.78),13),e.stem(m,p*.5,u,w*.9,w,p*.18,10,v.clone().multiplyScalar(.9),13),e.stem(m,p*.68,u,w,w*.78,p*.17,10,v,13),e.stem(m,p*.85,u,w*.78,w*.3,p*.15,10,v.clone().multiplyScalar(1.12),13,!0)}}const ht=[{kind:"green",row:24,rows:4,plot:54,plots:8},{kind:"green",row:16,rows:2,plot:12,plots:6},{kind:"green",row:20,rows:2,plot:140,plots:10},{kind:"hall",row:18,rows:2,plot:20,plots:10},{kind:"hall",row:16,rows:2,plot:108,plots:10},{kind:"chapel",row:18,rows:2,plot:8,plots:5},{kind:"chapel",row:30,rows:2,plot:80,plots:5},{kind:"school",row:28,rows:2,plot:68,plots:6},{kind:"school",row:18,rows:2,plot:128,plots:6},{kind:"works",row:20,rows:2,plot:32,plots:6},{kind:"stores",row:22,rows:2,plot:48,plots:6},{kind:"stores",row:18,rows:2,plot:154,plots:7}],Wt=6.6,Ot=2.3,bo=e=>{const t=P.z0+V.first-V.plot/2,a=e.plot+e.plots-1,o=e.plot%V.every===V.every-V.open,i=a%V.every===V.every-1;return{s0:le+e.row*ae-Wt,s1:le+(e.row+e.rows-1)*ae+Wt,z0:t+e.plot*V.plot+(o?Ot:0),z1:t+(a+1)*V.plot-(i?Ot:0)}},Gt=ht.map(bo);function Ut(e,t){for(const a of Gt)if(e>a.s0&&e<a.s1&&t>a.z0&&t<a.z1)return!0;return!1}function Nt(e,t,a,o,i,d,r,n,h){const s=Math.max(1,Math.ceil((i-o)/7)),l=(i-o)/s/2,f=e.m,v=new x.Matrix4,m=d/2;for(let u=0;u<s;u++)e.m=v.copy(t).multiply(We.makeTranslation(a,0,o+(2*u+1)*l)),e.quad([-m,r,-l],[-m,r,l],[0,r+n,l],[0,r+n,-l],h,2),e.quad([m,r,l],[m,r,-l],[0,r+n,-l],[0,r+n,l],h,2);e.m=f}function Ze(e,t,a,o,i,d,r,n,h,s,l,f=1){const v=e.m,m=new x.Matrix4().copy(t).multiply(We.makeTranslation(a,0,o)),u=.45*h/(d/2);i&&m.multiply(We.makeRotationY($e));const p=n/7,w=7+h/p;return e.m=new x.Matrix4().copy(m).scale(Se.set(1,p,1)),e.box(0,0,0,d,7,r,s,f,{top:!1}),e.tri([-d/2,7,-r/2],[0,w,-r/2],[d/2,7,-r/2],s,f),e.tri([d/2,7,r/2],[0,w,r/2],[-d/2,7,r/2],s,f),Nt(e,m,0,-r/2-.4,r/2+.4,d+.9,n-u,h+u,l),e.m=v,m}function gt(e,t,a,o,i){const d=e.m,r=i/9,n=new x.Color("#72934A").multiplyScalar(.82);e.m=new x.Matrix4().copy(t).multiply(We.makeTranslation(a,0,o)).scale(Se.set(r,r,r)),e.box(0,0,0,.55,3.4,.55,c.wood,0,{top:!1}),e.stem(0,2.8,0,1,3.1,1.9,7,n.clone().multiplyScalar(.74),13),e.stem(0,4.7,0,3.1,2.7,2.1,7,n.clone().multiplyScalar(.94),13),e.stem(0,6.8,0,2.7,0,2.2,7,n.clone().multiplyScalar(1.14),13),e.m=d}const yo=.16,$t=.5/1.4,Mt=new x.Color(.126,.167,.068),go=new x.Color(.29,.21,.13);function Mo(e,t){const a=new x.Matrix4().copy(t).multiply(We.makeTranslation(0,yo,0)),o=new x.Color,i=d=>[d[0],0,d[1]];return(d,r)=>{const n=e.m,h=e.l.length;e.m=a,o.copy(r).multiplyScalar(1/(.84*.9)),d.length===3?e.tri(i(d[0]),i(d[1]),i(d[2]),o,3):e.quad(i(d[0]),i(d[1]),i(d[2]),i(d[3]),o,3);for(let s=h;s<e.l.length;s+=3)e.l[s]=$t,e.l[s+1]=0,e.l[s+2]=$t;e.m=n}}function zo(e,t,a,o,i){const d=go,r=c.stone,n=2.6,h=1.3,s=a-n,l=o-n,f=Math.hypot(s,l),v=h*f/l,m=h*f/s,u=(g,y,b,z)=>i([[g,y],[g,z],[b,z],[b,y]],d);u(-a,-o,a,-l),u(-a,l,a,o),u(-a,-l,-s,l),u(s,-l,a,l);let p=0;const w=(g,y)=>{const b=g-3,z=Math.max(1,Math.round(2*b/9));for(let S=0;S<=z;S++){const L=-b+2*b*S/z,F=y(L);gt(e,t,F[0],F[1],8+3*Math.abs(Math.sin(++p*12.9898+a)))}};for(const g of[-1,1]){i([[g*s,-l+m],[g*s,l-m],[g*v,0]],Mt),i([[-s+v,g*l],[s-v,g*l],[0,g*m]],Mt);const y=-l/f*h,b=s/f*h;i([[-s+y,-g*l+g*b],[-s-y,-g*l-g*b],[s-y,g*l-g*b],[s+y,g*l+g*b]],d),w((l-m)*(1-4.2/(s-v)),z=>[g*(s-4.2),z]),w((s-v)*(1-4.2/(l-m)),z=>[z,g*(l-4.2)])}if(a>30){e.stem(0,0,0,4.4,4.4,.8,8,r,9,!0);for(let g=0;g<8;g++)e.box(3.8*Math.cos(g*Math.PI/4),.8,3.8*Math.sin(g*Math.PI/4),.24,3.1,.24,c.white,0,{top:!1});e.stem(0,3.9,0,4.9,0,2.3,8,new x.Color("#5E9C8A"),0)}else o>30?(e.stem(0,0,0,7.4,7.4,.55,16,r,9),e.stem(0,.55,0,7.4,6.6,.01,16,r,0),e.stem(0,.4,0,6.6,.01,.01,16,new x.Color("#3E8F8A"),0)):(e.box(0,0,0,3.2,.6,3.2,r,9),e.stem(0,.6,0,1,.55,7.4,4,r,9),e.stem(0,8,0,.55,0,1.1,4,r,9))}function ko(e,t,a,o,i){const d=c.brick.clone().lerp(c.rock,.3),r=new x.Color(.62,.72,.76),n=2*o-18;Ze(e,t,0,0,!1,17,n,8.5,5,d,i),e.box(0,12.6,0,3.4,2,n-10,r,0,{top:!1}),Nt(e,t,0,5.4-n/2,n/2-5.4,4.6,14.5,1,i);for(const h of[-1,1])Ze(e,t,h*9.4,0,!0,9,6.2,7,3.4,d,i);e.box(0,7.85,0,17.3,.45,n+.3,c.stone,0,{top:!1})}function So(e,t,a,o,i){const d=c.plaster.clone().multiplyScalar(.8),r=c.slate.clone().multiplyScalar(1.5).lerp(c.sea,.1),n=c.dark,h=a-1.6,s=o-1.6,l=-7,f=13,v=4.8;i([[-h,-s],[-h,s],[h,s],[h,-s]],Mt),e.box(0,0,(l+f)/2,2*v,7,f-l,d,9,{top:!1}),e.quad([-v-.4,6.5,l],[-v-.4,6.5,f+.3],[0,13,f+.3],[0,13,l],r,12),e.quad([v+.4,6.5,f+.3],[v+.4,6.5,l],[0,13,l],[0,13,f+.3],r,12),e.tri([v,7,f],[0,13,f],[-v,7,f],d,9),e.tri([-v,7,l],[0,13,l],[v,7,l],d,9);for(const p of[-1,1])for(let w=l+3;w<f;w+=4.4)e.quad([p*(v+.05),2.3,w-.6],[p*(v+.05),5.6,w-.6],[p*(v+.05),5.6,w+.6],[p*(v+.05),2.3,w+.6],n,0);e.quad([-1,3,f+.05],[1,3,f+.05],[1,8,f+.05],[-1,8,f+.05],n,0);const m=l-2.4;e.box(0,0,m,5.4,15.5,5.4,d,9),e.box(0,15.5,m,6,.5,6,c.white,0,{bottom:!0});for(const[p,w]of[[1,0],[-1,0],[0,-1]]){const g=p*2.75,y=m+w*2.75,b=Math.abs(w)*.6,z=Math.abs(p)*.6;e.quad([g-b,11.5,y-z],[g+b,11.5,y+z],[g+b,14.3,y+z],[g-b,14.3,y-z],n,0)}e.stem(0,16,m,3.1,0,10.5,8,r,12);const u=(p,w,g,y)=>e.box((p+g)/2,0,(w+y)/2,Math.abs(g-p)+.5,1.3,Math.abs(y-w)+.5,d,9,{topCol:c.white});u(-h,-s,-h,s),u(h,-s,h,s),u(-h,s,h,s),u(-h,-s,-2,-s),u(2,-s,h,-s),[[-10,-13,9],[10,-12,8],[-10.5,4,10],[10.5,8,9.5],[-9,14.5,8.5]].forEach(([p,w,g])=>gt(e,t,p,w,g))}function Ao(e,t,a,o){const i=c.brick.clone().lerp(c.plaster,.18),d=c.tile.clone().lerp(c.rock,.2),r=a-1.4,n=o-1.4;Ze(e,t,5.5,0,!1,9,2*o-14,7.4,4.2,i,d);for(const l of[-1,1])Ze(e,t,-1,l*(o-12),!0,9.6,13,7.4,4.2,i,d),e.box(5.5,9.4,l*7,1.3,4.4,1.3,c.stack,0,{top:!1}),gt(e,t,-10.5,l*5,8+l);e.box(5.5,11,0,1.8,2.8,1.8,c.white,0,{top:!1}),e.stem(5.5,13.8,0,1.5,0,2.8,4,c.slate,0);const h=i.clone().multiplyScalar(.85),s=(l,f,v,m)=>e.box((l+v)/2,0,(f+m)/2,Math.abs(v-l)+.45,2.1,Math.abs(m-f)+.45,h,9,{topCol:c.white});s(r,-n,r,n),s(-r,-n,r,-n),s(-r,n,r,n),s(-r,-n,-r,-2.2),s(-r,2.2,-r,n)}function Co(e,t,a,o){const i=new x.Color("#8C5646"),d=c.iron,r=new x.Color("#9AA09E"),n=c.brick.clone().lerp(c.rock,.3),h=-o+a+.6,s=a-3.6,l=20;e.stem(0,0,h,s,s,8.6,l,i,0),e.stem(0,8.6,h,s-.5,s-.5,4.6,l,i.clone().multiplyScalar(1.12),0),e.stem(0,8.3,h,s+.12,s+.12,.5,l,d,0),e.stem(0,12.9,h,s-.38,s-.38,.4,l,d,0),e.stem(0,13.2,h,s-.5,0,1.8,l,r,0);for(let f=0;f<10;f++){const v=f*Math.PI/5;e.box((s+1.1)*Math.cos(v),0,h+(s+1.1)*Math.sin(v),.6,17,.6,d,0,{top:!1})}for(const f of[8.4,16.3])e.stem(0,f,h,s+1.1,s+1.1,.7,10,d,0);Ze(e,t,0,o-8.5,!0,10,2*a-10,6.5,3.6,n,c.slate.clone().multiplyScalar(1.3)),e.m=new x.Matrix4().copy(t).multiply(We.makeTranslation(a-4.6,0,o-16.4)),e.box(0,0,0,3.4,2.4,3.4,n,9),e.stem(0,2.4,0,1.45,1,14,8,n,11),e.stem(0,16.4,0,1.2,1.2,.6,8,c.dark,0),e.m=t}function Lo(e,t,a,o){const i=[c.brick.clone().lerp(c.rock,.35),c.brick.clone().lerp(c.rock,.15).multiplyScalar(.8),c.stone.clone().lerp(c.brick,.3)],d=[c.slate.clone().multiplyScalar(1.35),c.tile.clone().lerp(c.rock,.25)],r=Math.floor((2*o-5)/10),n=2*a-9;for(let h=0;h<r;h++){const s=Ze(e,t,0,(h-(r-1)/2)*10,!0,10,n,9.5+h%2*1.2,3.6,i[h%3],d[h%2]);e.m=s;for(const l of[-1,1]){const f=l*(n/2+.06);e.quad([-1.1,7.6,f],[1.1,7.6,f],[1.1,10.2,f],[-1.1,10.2,f],c.dark,0),e.quad([-1.7,0,f],[1.7,0,f],[1.7,3.4,f],[-1.7,3.4,f],c.wood,0)}e.m=t}}async function qo(e,t,a){if(!ht.length)return null;const o=new ne,i=new x.Color("#A9B0B4").multiplyScalar(.92),d=c.tile.clone().lerp(c.rock,.15),r=c.cobble.clone().multiplyScalar(.74),n=c.cobble.clone().multiplyScalar(.66);let h=0;for(let l=0;l<ht.length;l++){const f=ht[l],v=Gt[l],m=(v.s1-v.s0)/2,u=(v.z1-v.z0)/2,p=se((v.s0+v.s1)/2,(v.z0+v.z1)/2,0,0,1),w=Mo(o,p);o.m=p,f.kind!=="green"&&f.kind!=="chapel"&&w([[-m,-u],[-m,u],[m,u],[m,-u]],f.kind==="works"?n:r),f.kind==="green"?zo(o,p,m,u,w):f.kind==="hall"?ko(o,p,m,u,h++?d:i):f.kind==="chapel"?So(o,p,m,u,w):f.kind==="school"?Ao(o,p,m,u):f.kind==="works"?Co(o,p,m,u):Lo(o,p,m,u),await e.yield()}const s=new x.Mesh(o.build(),yt(a.uniforms));return s.frustumCulled=!1,s.matrixAutoUpdate=!1,t.add(s),s}function Fo(e,t,a,o,i,d,r,n){const h=Math.min(t,a),s=Math.max(t,a);e.quad([a,d,o],[a,r,o],[a,r,i],[a,d,i],n,1),e.quad([h,d,o],[h,r,o],[s,r,o],[s,d,o],n,1),e.quad([s,d,i],[s,r,i],[h,r,i],[h,d,i],n,1),e.quad([h,r,o],[h,r,i],[s,r,i],[s,r,o],n,2)}const _t=["turned","cross","wing","wing2"];function To(e){const t=new ne,a=new x.Color(1,1,1),o=7,i=new x.Matrix4;if(e==="turned"){t.box(0,0,0,10,o,8,a,1,{top:!1});const d=o+3.6;t.m=i.makeRotationY($e).scale(Se.set(1,1,10/7)),t.quad([-4,o,-3.5],[-4,o,3.5],[0,d,3.5],[0,d,-3.5],a,2),t.quad([4,o,3.5],[4,o,-3.5],[0,d,-3.5],[0,d,3.5],a,2),t.tri([-4,o,-3.5],[0,d,-3.5],[4,o,-3.5],a,2),t.tri([4,o,3.5],[0,d,3.5],[-4,o,3.5],a,2),t.m=null,t.box(2.2,o+2.4,0,1.3,3.2,1.5,c.stack,0,{top:!1})}else if(e==="cross"){const r=o+2.6,n=5*(1-2.6/3.4),h=-1.2;t.m=i.makeTranslation(-3.3,0,h).multiply(We.makeRotationY(-$e));for(const s of[-1,1])t.quad([s*2.3,o,2],[0,r,2],[0,r,n-3.3],[s*2.3,o,1.7],a,2);t.tri([-2.3,o,1.72],[0,r,1.72],[2.3,o,1.72],a,2),t.m=null}else Fo(t,5,7.4,-.2,3.4,0,e==="wing2"?5.9:3.2,a);return t.build()}function Eo(e,t){const a=new ne,o=new x.Color(1,1,1),i=c.white,d=c.tile,r=7,n=3.4;if(a.box(0,0,0,10,r,8,o,1,{top:!1}),a.gable(0,r,0,10,8,n,o,o,t?.5:0),!t)return a.box(2.2,r+1.2,e%2?2.6:-2.6,1.3,4.2,1.5,c.stack,0,{top:!1}),a.build();const h=e%2?2.6:-2.6,s=(l,f)=>{a.box(l,r+1.2,f,1.3,3.55,1.6,c.stack,9,{top:!1}),a.box(l,r+4.75,f,1.56,.45,1.86,c.stone,0,{bottom:!0,topCol:c.dark});for(const v of[-.42,.42])a.stem(l,r+5.2,f+v,.32,.24,.9,6,d,0)};s(2.2,h),(e===1||e===2)&&s(-2.2,-h),a.box(-5.4,0,e<2?-2:2,.8,.4,2,c.stone,0),a.box(-5.15,.4,e<2?-2:2,.3,2.4,1.2,c.wood,0),(e===1||e===3)&&a.box(-2.6,r+.9,.6,2,1.5,1.8,o,1,{topCol:o,topKind:2}),e>=2&&a.box(-5.6,.5,-1.2,1.2,5.2,2.6,o,1,{topCol:o,topKind:2}),(e===0||e===3)&&a.box(6.2,0,1.6,2.4,3.2,3.6,o,1,{topCol:o,topKind:2}),a.box(0,r-.35,0,10.2,.35,8.02,i,0,{top:!1}),a.box(0,r+n-.16,0,.56,.34,8.3,c.stack,0);for(const l of[-5.62,5.62])a.box(l,r-.62,0,.24,.24,8.1,c.iron,0);if(e===0||e===2){const l=e?-1.9:1.9,f=.562,v=.827,m=(u,p,w)=>[5.5-5.5*u+f*w,r-.34+3.74*u+v*w,p];a.quad(m(.3,l-.95,.07),m(.3,l+.95,.07),m(.62,l+.95,.07),m(.62,l-.95,.07),i,0),a.quad(m(.34,l-.75,.12),m(.34,l+.75,.12),m(.58,l+.75,.12),m(.58,l-.75,.12),c.dark.clone().lerp(c.sea,.35),0)}return a.build()}async function Io(e,t,a,o,i,d){const r=[];for(let y=0;le+ae*y+6<ce;y++)r.push(le+ae*y);const n=[e.rng.fork("floor"),e.rng.fork("bend"),e.rng.fork("wall")],h=[c.brick.clone().lerp(c.rock,.22),c.brick.clone().lerp(c.rock,.12).multiplyScalar(.84),c.brick.clone().lerp(c.plaster,.3),c.plaster.clone().lerp(c.brick,.2).multiplyScalar(.84),c.plaster.clone().lerp(c.rock,.3).multiplyScalar(.74),c.plaster.clone().lerp(c.enamel,.34).multiplyScalar(.76)],s=[c.slate.clone().lerp(c.rock,.15).multiplyScalar(1.3),c.tile.clone().lerp(c.rock,.3).multiplyScalar(.9),c.slate.clone().lerp(c.rock,.15).multiplyScalar(1.7),c.tile.clone()],l=[];for(let y=0;y<8+_t.length;y++)l.push([]);const f=[],v=new x.Vector3,m=e.core.makeRng(e.core.hashSeed("wall-teeth:"+e.seed));let u=!1;for(const y of r){r.indexOf(y)%6===5&&await e.yield();const b=y<P.sCrease?n[0]:y<ke?n[1]:n[2];let z=0,S=0,L=1,F=0;for(let T=0,q=P.z0+V.first;q<P.z1-6;T++,q+=V.plot){const k=T%V.every;k===0&&(u=m()<1/6);const M=m(),A=m(),C=m(),E=m(),R=m();k===0&&(z=b.int(0,3),S=b.int(0,3),L=b.range(.9,1.25),F=b.int(0,5));const G=b()<.7?z:b.int(0,3),W=b()<.62,U=W?F:b.int(0,5),D=b()<.8?S:b.int(0,3),J=he(L+b.range(-.1,.12),.86,1.33),N=b()<.5;if(k>=V.every-V.open||je(o,y,q,!0))continue;const K=e.noise.n2(y*.0062+3.1,q*.0048-1.7)+.35*e.noise.n2(y*.021,q*.017)>-.08,H=O=>(K?1:0)+(O&2),Z=e.noise.n2(y*.0083-6.4,q*.0069+2.9)+.3*e.noise.n2(y*.024+5,q*.02)>.12,ee=O=>(Z?3:0)+O%3;qe(y,q,5,v);const _=i.distanceTo(v.x,v.y,v.z)<d,$=k===0?-1:k===V.every-V.open-1?1:0,B=$!==0&&!je(o,y,q+$*V.plot,!0),I={s:y,z:B?q+$:q,sy:J,yaw:B?$*$e:N?Math.PI:0,wall:W?ee(U):U,roof:H(D),near:_,model:G};mo(o,y,I.z,B?ct.turned:ct.wide)||Ut(y,q)?I.yard=!0:_?l[G].push(I):(I.high=he(I.sy*(C<1/7?1.2+.2*E:C>8/9?.74+.1*E:1),.64,1.55),u||M<1/8?l[8].push(I):(l[4+G].push(I),A<1/6&&l[9].push(I),!B&&(G===0||G===3)&&R<.6&&l[R<.15?11:10].push(I))),f.push(I)}}await e.yield();const p=new x.Matrix4,w=new x.Vector3,g=[];for(let y=0;y<l.length;y++){const b=l[y];if(!b.length)continue;const z=y<8?Eo(y%4,y<4):To(_t[y-8]),S=new Float32Array(b.length*3),L=new Float32Array(b.length*3),F=new x.InstancedMesh(z,a,b.length);for(let T=0;T<b.length;T++){const q=b[T];se(q.s,q.z,0,q.yaw,w.set(1,q.near?q.sy:q.high,1),p),F.setMatrixAt(T,p);const k=Math.sin(q.s*12.9898+q.z*78.233)*43758.5453,M=k-Math.floor(k)<1/6,A=h[q.wall],C=s[M?q.roof^1:q.roof];S[T*3]=A.r,S[T*3+1]=A.g,S[T*3+2]=A.b,L[T*3]=C.r,L[T*3+1]=C.g,L[T*3+2]=C.b,T%150===149&&await e.yield()}z.setAttribute("iWall",new x.InstancedBufferAttribute(S,3)),z.setAttribute("iRoof",new x.InstancedBufferAttribute(L,3)),F.frustumCulled=!1,F.matrixAutoUpdate=!1,t.add(F),g.push(F),await e.yield()}return await qo(e,t,a),{all:f,meshes:g}}function Bo(e,t,a){const o=new x.Mesh(new x.SphereGeometry(5200,32,16),new x.ShaderMaterial({uniforms:{...a,uDeep:{value:c.sea.clone()}},vertexShader:`varying vec3 vD; void main() { vD = position; vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
      if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:`varying vec3 vD; uniform vec3 uSun; uniform vec3 uSunCol; uniform vec3 uFogCol; uniform vec3 uHazeSun; uniform vec3 uZenith; uniform vec3 uDeep; uniform float uTime;
      float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
      // one rank of heaped cloud standing on a level base: x runs round the horizon, el is the height above it
      vec4 heaps(float x, float el, float base, float tall, float th, vec3 lightC, vec3 shadeC) {
        float heap = vnoise(vec2(x, 1.7)) * .6 + vnoise(vec2(x * 2.3 + 3., 5.1)) * .4;
        float grow = smoothstep(th, th + .34, heap);
        float top = base + tall * grow * (.6 + .4 * vnoise(vec2(x * 5. + 1., 9.3)));
        top += tall * .1 * (vnoise(vec2(x * 13., el * 70.)) - .5) * grow;
        float body = step(th + .005, heap) * smoothstep(base - .0015, base + .0025, el) * (1. - smoothstep(top - .005, top, el));
        float h = clamp((el - base) / max(top - base, 1e-3), 0., 1.);
        float billow = vnoise(vec2(x * 9. + 4., el * 55.));
        vec3 c = mix(shadeC, lightC, smoothstep(.1, .85, h * .75 + billow * .4));
        return vec4(c, body);
      }
      void main() {
        vec3 d = vD / max(length(vD), 1e-4);
        float up = clamp(d.y, 0., 1.);
        float sd = max(dot(d, uSun), 0.);
        float s2 = sd * sd, s8 = s2 * s2 * s2 * s2, s64 = s8 * s8 * s8 * s8 * s8 * s8 * s8 * s8;
        // the horizon is the haze's own tone, as the far land and sea are; the blue deepens overhead
        vec3 hor = uFogCol + uHazeSun * s2 * sd;
        vec3 c = mix(hor, uZenith, 1. - exp(-up * 4.));
        c = mix(c, mix(uDeep, uFogCol, .58), step(d.y, 0.));
        c += uSunCol * (.08 * s8 + .5 * s64 * s64 * s64 + 5. * smoothstep(.99965, .9998, sd));
        float el = atan(d.y, max(length(d.xz), 1e-4));
        float az = atan(d.z, d.x + step(abs(d.x) + abs(d.z), 1e-5) * 1e-3);
        // mares' tails high up: long thin streaks, drifting slowly
        float streak = vnoise(vec2(az * 2.2 + uTime * .006, el * 26. - az * 3.)) * .6 + vnoise(vec2(az * 7. - uTime * .004, el * 60. - az * 9.)) * .4;
        c = mix(c, vec3(1.) * (.72 + .28 * uSunCol), .2 * smoothstep(.6, .88, streak) * smoothstep(.12, .3, el) * (1. - smoothstep(.5, .85, el)));
        // two ranks of heaped cloud along the horizon, level-based, the nearer taller; each drifts on the clock
        vec3 lightC = mix(vec3(1.), uSunCol * uSunCol, .6) * 1.02, shadeC = mix(hor, vec3(.56, .63, .76), .55);
        vec4 far = heaps(az * 11. + uTime * .0025, el, .012, .035, .44, mix(lightC, hor, .45), mix(shadeC, hor, .5));
        c = mix(c, far.rgb, far.a * .85);
        vec4 near = heaps(az * 4.6 + 20. + uTime * .004, el, .03, .15, .44, lightC, shadeC);
        c = mix(c, near.rgb, near.a * .93);
        // and here and there a great tower of cloud standing over them, upright as a mast
        vec4 tower = heaps(az * 2.1 + 40. + uTime * .005, el, .055, .34, .56, lightC * 1.03, mix(shadeC, vec3(.6, .66, .78), .4));
        c = mix(c, tower.rgb, tower.a * .95);
        gl_FragColor = vec4(c, 1.);
      }`,side:x.BackSide,depthWrite:!1,depthTest:!1,fog:!1}));o.renderOrder=-10,o.frustumCulled=!1,t.add(o);const i=new x.PlaneGeometry(24e3,24e3,1,1);i.rotateX(-Math.PI/2);const d=new x.Mesh(i,new x.ShaderMaterial({uniforms:{...a,uDeep:{value:c.sea.clone()}},vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`varying vec3 vW; uniform float uTime; uniform vec3 uDeep;
      ${Oe}
      float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
      // the shade the two level clouds lay on the sea: each an oval with a broken edge, found along the sun's ray
      float cloudLit(vec3 p) {
        float lit = 1.;
        vec4 cl[2]; cl[0] = vec4(${((te.x0+te.x1)/2).toFixed(1)}, ${((te.z0+te.z1)/2).toFixed(1)}, ${((te.x1-te.x0)/2).toFixed(1)}, ${((te.z1-te.z0)/2).toFixed(1)});
        cl[1] = vec4(${((ie.x0+ie.x1)/2).toFixed(1)}, ${((ie.z0+ie.z1)/2).toFixed(1)}, ${((ie.x1-ie.x0)/2).toFixed(1)}, ${((ie.z1-ie.z0)/2).toFixed(1)});
        float high[2]; high[0] = ${((te.y0+te.y1)/2).toFixed(1)}; high[1] = ${((ie.y0+ie.y1)/2).toFixed(1)};
        for (int i = 0; i < 2; i++) {
          vec2 q = p.xz + uSun.xz * (high[i] / max(uSun.y, .08));
          vec2 d = (q - cl[i].xy) / cl[i].zw;
          float r = dot(d, d) + .4 * (vnoise(q * .021 + 3.) - .5) + .2 * (vnoise(q * .06) - .5);
          lit *= 1. - .4 * (1. - smoothstep(.45, 1.02, r));
        }
        return lit;
      }
      void main() {
        vec3 toEye = cameraPosition - vW; float dist = max(length(toEye), 1e-3); vec3 v = toEye / dist;
        vec2 p = vW.xz; float t = uTime;
        float calm = 1. / (1. + dist * .004); float far = 1. / (1. + dist * dist * .0000012);
        float fg0 = min(1. - exp(-uFogD * 1.6 * dist), .62);
        // the swell: four trains of waves crossing
        vec2 g = vec2(0.);
        g += vec2(.8, .6) * cos(dot(p, vec2(.8, .6)) * .09 + t * .55) * .22 * far;
        g += vec2(-.5, .86) * cos(dot(p, vec2(-.5, .86)) * .21 + t * .9) * .16 * far * calm;
        g += vec2(.95, -.3) * cos(dot(p, vec2(.95, -.3)) * .53 + t * 1.5) * .12 * calm * calm;
        g += vec2(.2, .98) * cos(dot(p, vec2(.2, .98)) * 1.3 + t * 2.3) * .10 * calm * calm;
        vec3 n = vec3(-g.x, 1., -g.y); n /= max(length(n), 1e-4);
        float fr = 1. - max(dot(n, v), 0.); fr = fr * fr; fr = .04 + .96 * fr * fr * (1. - .2 * fr);
        vec3 refl = reflect(-v, n); refl.y = abs(refl.y);
        vec3 skyc = mix(uFogCol, uZenith, 1. - exp(-refl.y * 3.2));
        float sh = slabShadow(vW);
        vec3 water = uDeep * (.34 + .5 * max(dot(n, uSun), 0.) * sh) * mix(uShade, vec3(1.), .55 + .45 * sh);
        // sunlit water takes the hour's colour; the slab's shade on it stays cool
        water *= mix(vec3(1.), uSunCol * uSunCol, .45 * sh);
        float paw = vnoise(p * .06 + vec2(t * .5, t * .23)) * .6 + vnoise(p * .017 - vec2(t * .12, t * .19)) * .4;
        water *= .82 + .36 * paw;
        // the harbour's shallows off the quay are paler and greener; clouds' shadows cross the open sea
        float shoal = smoothstep(-190., -4., vW.x) * step(vW.x, 2.) * smoothstep(-520., -430., vW.z) * (1. - smoothstep(915., 1000., vW.z));
        water = mix(water, vec3(.16, .46, .47) * (.5 + .5 * sh), shoal * .5);
        float cloudSh = smoothstep(.3, .7, vnoise(p * .0042 + vec2(t * .011, t * .006)) * .65 + vnoise(p * .011 - vec2(t * .008, 0.)) * .35);
        water *= mix(.66, 1.1, cloudSh);
        float underCloud = cloudLit(vW); water *= underCloud;
        vec3 c = mix(water, skyc * mix(.86, 1., cloudSh), clamp(fr, 0., 1.) * (.6 + .4 * paw)) * (.5 + .5 * underCloud);
        // whitecaps: flecks that drift with the wind and come and go, in two sizes of cell fixed in the water,
        // the longest a rowing boat's length, so from high on the wall they are specks far below;
        // each size shows where a pixel is finer than its flecks and fades out where it is not
        float pxl = max(fwidth(p.x) + fwidth(p.y), 1e-4), cap = 0.;
        vec2 capCell = vec2(3.5, 9.);
        for (int i = 0; i < 2; i++) {
          float cs = capCell[i];
          vec2 wc = (p + vec2(3.2, 1.9) * t) / cs + float(i) * 17.3;
          vec2 wi = floor(wc), wf = fract(wc) - .5;
          float life = fract(h21(wi) * 7. + t * .42);
          float one = step(.8, h21(wi + 3.7)) * smoothstep(0., .2, life) * (1. - smoothstep(.35, .7, life));
          one *= 1. - smoothstep(.08, .4, length(vec2(wf.x * .55, wf.y * 2.2) + vec2(0., .25 * sin(wf.x * 9. + h21(wi) * 6.))));
          cap = max(cap, one * (1. - smoothstep(.12, .4, pxl / cs)) * smoothstep(.003, .01, pxl / cs));
        }
        // the long swell from seaward, seen as bands of lighter and darker water, and the wind's streaks along it
        float swell = sin(dot(p, vec2(.8, .6)) * .09 + t * .55) * .5 + sin(dot(p, vec2(-.5, .86)) * .21 + t * .9) * .3 + sin(dot(p, vec2(.74, .67)) * .037 - t * .2) * .4;
        float streaks = vnoise(vec2(dot(p, vec2(.6, -.8)) * .05, dot(p, vec2(.8, .6)) * .004 + t * .01));
        c *= 1. + (.11 * swell + .1 * (streaks - .5)) * mix(1., .45, fg0);
        // cat's paws: the breeze ruffles the water in patches that run before it, in sun and in shade alike
        float ruffle = vnoise((p + vec2(8.2, 4.1) * t) * .03) * .6 + vnoise((p + vec2(11., 2.4) * t) * .075) * .4;
        float pawEdge = smoothstep(.45, .56, ruffle);
        c *= mix(.8, 1.07, pawEdge) * (1. + .14 * (vnoise((p + vec2(9., 3.) * t) * .31) - .5) * pawEdge);
        c = mix(c, vec3(.93, .96, .97) * (.5 + .5 * sh), cap * .6);
        // the water's facets throw the bright sky back in short glints that come and go, in sun and in shade
        float gl = 0.;
        vec4 glCell = vec4(.75, 3., 12., 48.);
        for (int i = 0; i < 4; i++) {
          float cs = glCell[i];
          vec2 gc = p / cs + float(i) * 9.1; vec2 gi = floor(gc), gf = fract(gc) - .5;
          float gph = t * 1.9 + h21(gi) * 6.;
          float one = mix(step(.915, h21(gi + floor(gph) * 1.37)), step(.915, h21(gi + (floor(gph) + 1.) * 1.37)), smoothstep(.25, .75, fract(gph)));
          one *= 1. - smoothstep(.18, .5, length(vec2(gf.x * .7, gf.y * 1.5)));
          gl = max(gl, one * (1. - smoothstep(.14, .45, pxl / cs)) * smoothstep(.003, .01, pxl / cs));
        }
        c += (skyc * .5 + uSunCol * .3 * sh) * gl * (1. - smoothstep(.3, .6, fg0));
        // glitter on the sun's road, never brighter than a soft sparkle
        // far off the swell's facets are finer than the eye: the road there is one soft gleam, broken by the cat's paws
        float flat_ = smoothstep(60., 520., dist);
        vec3 nR = vec3(-g.x * (1. - .85 * flat_), 1., -g.y * (1. - .85 * flat_)); nR /= max(length(nR), 1e-4);
        vec3 reflR = reflect(-v, nR); reflR.y = abs(reflR.y);
        float sd = max(dot(reflR, uSun), 0.); float s4 = sd * sd; s4 *= s4; float s32 = s4 * s4; s32 *= s32 * s32;
        s32 *= mix(1., .55 + .7 * ruffle, flat_);
        float tw = h21(floor(p * 1.7) + floor(t * 2.) * .37);
        float tw2 = h21(floor(p * 1.7) + floor(t * 2. + 1.) * .37);
        float spark = mix(tw, tw2, smoothstep(0., 1., fract(t * 2.)));
        c += uSunCol * min(1.4, s32 * (.5 + 1.6 * spark * calm * 2.)) * sh;
        // and all along the road the same facets flash the sun itself, each for a moment
        c += uSunCol * min(.9, s32 * 3.) * gl * sh;
        // vapour lies on the water: far water is paler and bluer than land as far off
        gl_FragColor = vec4(mix(c, mix(uDeep, uFogCol, .58), fg0), 1.);
      }`}));return d.frustumCulled=!1,d.matrixAutoUpdate=!1,t.add(d),{sky:o,sea:d}}const Ae=[],Dt={morning:{sun:[-.52,.45,.73],col:"#FFF1D6",gain:1.08,zenith:"#4E8FCF",fog:"#D4E6EF",haze:[.2,.13,.04]},noon:{sun:[-.45,.85,.28],col:"#FFFFFF",gain:1,zenith:"#3F86CC",fog:"#D4E6EF",haze:[.06,.06,.05]},gold:{sun:[.2,.36,-.91],col:"#FFC98A",gain:1.25,shade:[.47,.45,.56],lift:1.9,glow:.5,zenith:"#4F84C6",fog:"#F2CC9C",haze:[.42,.24,.06],bounce:"#A6A3B4",fill:"#B4CBF0"}};function Ro(e,t){const a=e.uCastA.value,o=e.uCastB.value;let i=0;const d=(s,l,f,v,m,u,p,w)=>{i>=_e||(qe(s,l,f,Se),a[i].set(Se.x,Se.y,Se.z,v),qe(m,u,p,Se),o[i].set(Se.x,Se.y,Se.z,w),i++)};for(const s of[t.steepleLying,t.steepleUp])d(s.s,s.z,0,4.2,s.s,s.z,29,4.2),d(s.s,s.z,29,3.8,s.s,s.z,55,.3),d(s.s,s.z+4,4.5,5.2,s.s,s.z+lt.naveEnd-3,4.5,5.2);for(const s of[...t.mills,t.millUp])d(s.s,s.z,0,4.8,s.s,s.z,20,1.6);for(const s of t.chimneys)d(s.s,s.z,0,De.foot+.6,s.s,s.z,De.tall,De.top+.3);for(const s of[t.clock,t.clockLying])d(s.s,s.z,0,4.4,s.s,s.z,38,3.6);const r=t.viaduct,n=ft(t),h=n.len/de.arches;d(r.s0,r.z0,r.h,3.2,r.s1,r.z1,r.h,3.2);for(let s=0;s<=de.arches&&i<_e;s++)d(r.s0+s*h*n.ds,r.z0+s*h*n.dz,0,2.9,r.s0+s*h*n.ds,r.z0+s*h*n.dz,r.h,2.9)}async function ba(e,t,a){const o=ho(),i=io();o.uPlan.value=i.tex;const d=Dt[a.hour]||Dt.morning;o.uSun.value.set(d.sun[0],d.sun[1],d.sun[2]).normalize(),o.uSunInv.value.set(1/o.uSun.value.x,1/o.uSun.value.y,1/o.uSun.value.z),o.uSunCol.value.set(d.col).multiplyScalar(d.gain),d.shade&&o.uShade.value.set(d.shade[0],d.shade[1],d.shade[2]),o.uZenith.value.set(d.zenith),o.uFogCol.value.set(d.fog),o.uHazeSun.value.setRGB(d.haze[0],d.haze[1],d.haze[2]),d.bounce&&o.uBounce.value.set(d.bounce),d.fill&&o.uSkyCol.value.set(d.fill),d.lift&&(o.uLift.value=d.lift),d.glow&&o.uGlow.value.copy(o.uSunCol.value).multiplyScalar(d.glow),o.uGlowDir.value.set(o.uSun.value.x-.6,-.4,o.uSun.value.z).normalize();const r=new x.Group;t.add(r),Ro(o,It(a.lakeLift||0));const n={ctx:e,scene:t,group:r,air:o,opts:a,path:a.path,P:It(a.lakeLift||0),tick:[],hour:d,town:yt(o,!1),houseMat:yt(o,!0),free:[]},{sky:h,sea:s}=Bo(e,t,o);n.sky=h,n.sea=s,await e.yield(),n.land=await po(e,r,n.town),await e.yield(),n.houses=await Io(e,r,n.houseMat,n.P,n.path,110),i.fill(n.houses.all),n.free.push(i.tex),await e.yield();for(const f of Ae)await f(n),await e.yield();const l=new x.Vector3;return{group:r,air:o,places:n.P,D:n,update(f,v,m){o.uTime.value=v,m.getWorldPosition(l),h.position.copy(l);for(let u=0;u<n.tick.length;u++)n.tick[u](v,m)},dispose(){for(const f of n.free)f.dispose()}}}function Po(e){const t=c.plaster.clone().multiplyScalar(.82),a=c.white,o=c.dark,i=c.slate.clone().multiplyScalar(1.15).lerp(c.sea,.14),d=c.slate.clone().multiplyScalar(1.55).lerp(c.sea,.1),r=new x.Color("#A9B0B4"),n=(l,f,v,m,u,p)=>[l[0]+f[0]*m+v[0]*p,l[1]+u,l[2]+f[1]*m+v[1]*p],h=(l,f,v,m,u,p=o)=>{const w=m/2,g=w+.28;e.quad(n(l,f,v,-g,-.25,.08),n(l,f,v,g,-.25,.08),n(l,f,v,g,u,.08),n(l,f,v,-g,u,.08),a,0),e.tri(n(l,f,v,-g,u,.08),n(l,f,v,g,u,.08),n(l,f,v,0,u+g*1.5,.08),a,0),e.quad(n(l,f,v,-w,0,.16),n(l,f,v,w,0,.16),n(l,f,v,w,u,.16),n(l,f,v,-w,u,.16),p,0),e.tri(n(l,f,v,-w,u,.16),n(l,f,v,w,u,.16),n(l,f,v,0,u+w*1.5,.16),p,0)},s=[[1,0],[-1,0],[0,1],[0,-1]];e.box(0,0,13,10,8,19,t,9,{top:!1}),e.quad([-5.4,7.6,3.5],[-5.4,7.6,22.5],[0,12,22.5],[0,12,3.5],d,12),e.quad([5.4,7.6,22.5],[5.4,7.6,3.5],[0,12,3.5],[0,12,22.5],d,12),e.tri([5,8,22.5],[0,12,22.5],[-5,8,22.5],t,9),e.box(0,11.85,13,.5,.32,19.2,r,0);for(const l of[-1,1]){for(const f of[6.5,10.5,14.5,18.5])h([l*5,2.6,f],[0,1],[l,0],1,3);for(const f of[8.5,12.5,16.5,21.9])e.box(l*5.45,0,f,.9,4.4,.8,t,9,{topCol:a}),e.box(l*5.25,4.4,f,.5,2.2,.7,t,9,{topCol:a})}h([0,3,22.5],[1,0],[0,1],1.8,3.6),e.box(0,12,22.3,.26,1.7,.26,a,0),e.box(0,12.9,22.3,1.1,.26,.26,a,0),e.box(0,0,0,7,22,7,t,9);for(const l of[7,14.5])e.box(0,l,0,7.4,.5,7.4,a,0,{bottom:!0});for(const[l,f]of[[1,1],[1,-1],[-1,1],[-1,-1]])e.box(l*3.55,0,f*3.55,1.5,7,1.5,t,9,{topCol:a}),e.box(l*3.5,7,f*3.5,1.2,7.5,1.2,t,9,{topCol:a}),e.box(l*3.4,14.5,f*3.4,.7,4.3,.7,t,9,{topCol:a});for(const[l,f]of s){const v=[l*3.5,0,f*3.5],m=[-f,l],u=[l,f];f<=0&&h(n(v,m,u,0,f<0?7.9:8.6,0),m,u,f<0?1.5:1.1,f<0?4.2:3.2);for(const p of[-1.15,1.15])h(n(v,m,u,p,16.3,0),m,u,.8,2.8);for(const p of[-1,1])e.tri(n(v,m,u,p*2.5,28,0),n(v,m,u,p*2.5,25.4,0),n(v,m,u,p*.25,28,0),t,0)}h([0,.5,-3.5],[1,0],[0,-1],1.9,2.6,c.wood);for(const[l,f]of[[-3,-3],[3,-3],[3,3],[-3,3]])e.box(l,22,f,1,6,1,t,0,{top:!1});e.box(0,28,0,7.3,.55,7.3,t,0,{bottom:!0}),e.box(0,28.55,0,7.6,.45,7.6,a,0,{bottom:!0}),e.stem(0,29,0,4.4,0,26,8,i,12);for(let l=0;l<8;l++){const f=l*Math.PI/4,v=Math.cos(f),m=Math.sin(f),u=[0,55.02,0];e.tri([4.4*v-.24*m,29,4.4*m+.24*v],[4.64*v,29,4.64*m],u,r,0),e.tri([4.64*v,29,4.64*m],[4.4*v+.24*m,29,4.4*m-.24*v],u,r,0)}for(const[l,f]of s){const v=[l*4.3,30.6,f*4.3],m=[-f,l],u=[l,f],p=(w,g,y)=>n(v,m,u,w,g,y);e.quad(p(-.75,0,0),p(.75,0,0),p(.75,2,0),p(-.75,2,0),t,0),e.tri(p(-.75,2,0),p(.75,2,0),p(0,3.1,0),t,0);for(const w of[-1,1])e.quad(p(w*.75,0,0),p(w*.75,2,0),p(w*.75,2,-1.6),p(w*.75,0,-1.6),t,0),e.quad(p(w*.95,1.75,.15),p(0,3.25,.15),p(0,3.25,-1.9),p(w*.95,1.75,-1.9),i,12);h(p(0,.45,0),m,u,.6,1)}e.stem(0,54.2,0,.5,.5,.9,5,c.enamel,0,!0),e.box(0,55,0,.16,2,.16,c.iron,0,{top:!1}),e.box(0,55.9,0,1.9,.12,.12,c.enamel,0),e.box(0,55.9,0,.12,.12,1.9,c.enamel,0),e.box(0,56.7,0,2.2,.1,.1,c.enamel,0),e.quad([-.5,57,0],[.45,57,0],[.55,57.55,0],[-.45,57.5,0],c.enamel,0),e.tri([-.45,57.1,0],[-1.15,58,0],[-.3,57.5,0],c.enamel,0),e.tri([.4,57.4,0],[.95,57.75,0],[.45,57.98,0],c.enamel,0)}function Wo(e){const t=new x.Color("#8A6A2E");for(const a of[-1.2,1.2])e.stem(a,23.2,0,1,.45,1.5,7,t,0,!0),e.box(a,24.7,0,.2,3.3,.2,c.iron,0,{top:!1})}function Oo(e){e.stem(0,0,0,5,3.2,17,8,c.plaster.clone().multiplyScalar(.9),1),e.stem(0,17,0,3.6,0,3.4,8,c.slate,2),e.box(0,17.2,-3.2,1,1.6,3.4,c.wood,0)}function Go(e){const t=c.white,a=c.wood;for(let o=0;o<4;o++){const i=o*Math.PI/2,d=Math.cos(i),r=Math.sin(i),n=(h,s,l)=>[h*d-s*r,h*r+s*d,l];e.quad(n(-.25,0,.15),n(.25,0,.15),n(.25,10,.15),n(-.25,10,.15),a,0),e.quad(n(.25,2.2,0),n(2.4,2.2,.5),n(2.4,9.8,.5),n(.25,9.8,0),t,6);for(const h of[-.04,.04]){for(let s=0;s<=6;s++){const l=2.2+s*1.245;e.quad(n(.25,l,h),n(2.4,l,.5+h),n(2.4,l+.14,.5+h),n(.25,l+.14,h),a,0)}e.quad(n(2.3,2.2,.48+h),n(2.44,2.2,.5+h),n(2.44,9.8,.5+h),n(2.3,9.8,.48+h),a,0),e.quad(n(1.28,2.2,.24+h),n(1.38,2.2,.26+h),n(1.38,9.8,.26+h),n(1.28,9.8,.24+h),a,0)}}e.stem(0,-.6,0,.6,.6,1.2,6,a,0,!0)}function Uo(e){const t=c.plaster.clone().multiplyScalar(.88),a=c.white,o=c.dark.clone().lerp(c.sea,.45),i=new x.Color("#5E9C8A");e.box(0,0,0,9.6,1.2,9.6,c.stone.clone().multiplyScalar(.8),9),e.box(0,1.2,0,9,2.8,9,c.stone,9),e.box(0,4,0,7,26,7,t,9);for(const[d,r]of[[-3.3,-3.3],[3.3,-3.3],[3.3,3.3],[-3.3,3.3]])e.box(d,4,r,.9,26,.9,a,9,{top:!1});for(const d of[11,18,25])e.box(0,d,0,7.7,.6,7.7,a,0,{bottom:!0});for(let d=0;d<4;d++){const r=d*Math.PI/2,n=Math.cos(r),h=Math.sin(r),s=(u,p,w)=>[u*n+w*h,p,-u*h+w*n],l=(u,p,w,g,y,b)=>e.quad(s(u,p,y),s(w,p,y),s(w,g,y),s(u,g,y),b,0);for(const u of[6.2,13.2,20.2])l(-1.15,u-.3,1.15,u+3.9,3.53,a),l(-.75,u,.75,u+3.5,3.58,o),l(-.06,u,.06,u+3.5,3.62,a),l(-.75,u+2.2,.75,u+2.32,3.62,a),l(-1.4,u-.6,1.4,u-.3,3.7,a);l(-1.3,1.2,1.3,4,4.52,a),l(-1,1.2,1,3.3,4.55,c.wood),l(-1,3.42,1,3.85,4.55,o),l(-.04,1.2,.04,3.3,4.57,c.dark),l(-4.5,1.25,-1.3,1.75,4.52,c.rock),l(1.3,1.25,4.5,1.75,4.52,c.rock);for(const u of[6.2,13.2,20.2])for(const p of[-2.2,2.2])l(p-.44,u+.4,p+.44,u+3.1,3.53,a),l(p-.24,u+.62,p+.24,u+2.9,3.58,o),l(p-.56,u+.18,p+.56,u+.4,3.66,a);const f=(u,p,w,g)=>{for(let y=0;y<12;y++){const b=y/12*Math.PI*2,z=(y+1)/12*Math.PI*2;e.quad(s(u*Math.cos(b),27.3+u*Math.sin(b),w),s(p*Math.cos(b),27.3+p*Math.sin(b),w),s(p*Math.cos(z),27.3+p*Math.sin(z),w),s(u*Math.cos(z),27.3+u*Math.sin(z),w),g,0)}};f(0,1.05,3.56,o),f(1.05,1.42,3.6,a);for(const u of[-.5,0,.5])l(-.9,27.3+u-.07,.9,27.3+u+.07,3.62,a);const v=4.06,m=(u,p,w,g)=>{for(let y=0;y<24;y++){const b=y/24*Math.PI*2,z=(y+1)/24*Math.PI*2;e.quad(s(u*Math.cos(b),33+u*Math.sin(b),w),s(p*Math.cos(b),33+p*Math.sin(b),w),s(p*Math.cos(z),33+p*Math.sin(z),w),s(u*Math.cos(z),33+u*Math.sin(z),w),g,0)}};m(0,2.55,v,a),m(2.55,2.8,v+.03,c.dark),m(2.8,2.95,v+.03,c.enamel);for(let u=0;u<12;u++){const p=u/12*Math.PI*2,w=Math.cos(p),g=Math.sin(p),y=u%3?.05:.1;e.quad(s(1.95*w-y*g,33+1.95*g+y*w,v+.05),s(1.95*w+y*g,33+1.95*g-y*w,v+.05),s(2.4*w+y*g,33+2.4*g-y*w,v+.05),s(2.4*w-y*g,33+2.4*g+y*w,v+.05),c.dark,0)}l(-.09,33,.09,35,v+.08,c.dark),e.quad(s(0,32.9,v+.08),s(0,33.1,v+.08),s(1.45,33.85,v+.08),s(1.45,33.65,v+.08),c.dark,0)}e.box(0,30,0,8,6,8,a,0),e.box(0,29.5,0,8.6,.5,8.6,t,0,{bottom:!0}),e.box(0,36,0,8.7,.45,8.7,t,0,{bottom:!0});for(const[d,r]of[[-3.8,-3.8],[3.8,-3.8],[3.8,3.8],[-3.8,3.8]])e.stem(d,36.45,r,.5,0,1.9,4,i,0);e.stem(0,36.45,0,4.6,0,3.4,8,i,2),e.stem(0,39.6,0,.3,.3,.4,5,c.enamel,0,!0)}const ya={tall:26.6};function No(e){const t=new x.Color("#A8322A"),a=c.white,o=12;e.stem(0,0,0,4.4,3.8,2.6,o,c.stone,9);for(let i=0;i<5;i++){const d=3.5-.24*i,r=3.5-.24*(i+1);e.stem(0,2.6+i*3.4,0,d,r,3.4,o,i%2?t:a,0)}e.stem(0,19.6,0,3.4,3.4,.4,o,c.iron,0,!0);for(let i=0;i<o;i++){const d=i/o*Math.PI*2;e.box(3.3*Math.cos(d),20,3.3*Math.sin(d),.1,1.1,.1,c.iron,0,{top:!1})}e.stem(0,21.05,0,3.35,3.35,.1,o,c.iron,0),e.stem(0,20,0,1.8,1.8,3,o,new x.Color(.86,.9,.82),0);for(let i=0;i<6;i++){const d=i/6*Math.PI*2;e.box(1.82*Math.cos(d),20,1.82*Math.sin(d),.14,3,.14,c.iron,0,{top:!1})}e.stem(0,23,0,2.3,0,2.6,o,t,0),e.stem(0,25.5,0,.35,.35,.6,5,c.enamel,0,!0),e.box(0,26.1,0,.1,.5,.1,c.iron,0)}function $o(e){const t=De,a=c.brick.clone().lerp(c.rock,.22),o=c.dark.clone().lerp(a,.3),i=t.tall,d=i-t.house-3.2,r=f=>ve(t.foot,t.top,(f-t.house)/d);e.box(0,0,0,8,t.house,8,a.clone().multiplyScalar(.86),1),e.box(0,t.house-.5,0,8.5,.5,8.5,c.stone,0,{bottom:!0}),e.stem(0,t.house,0,t.foot+.5,t.foot+.3,1.2,t.n,c.stone,9),e.stem(0,t.house,0,t.foot,t.top,d,t.n,a,11);for(let f=1;f<=4;f++){const v=t.house+f*d/5,m=r(v)+.09;e.stem(0,v-.2,0,m,m-.005,.4,t.n,c.iron,0)}let n=t.house+d;e.stem(0,n-.9,0,t.top+.14,t.top+.12,.6,t.n,c.stone,0);for(let f=0;f<3;f++){const v=t.top+.3+.3*f;e.stem(0,n,0,v-.3,v,.35,t.n,o,0),e.stem(0,n+.35,0,v,v,.55,t.n,f%2?o:a.clone().multiplyScalar(.62),11),n+=.9}e.stem(0,n,0,t.top+.9,t.top+.5,.5,t.n,o,0);const h=t.top-.25,s=t.top+.5,l=c.dark.clone().multiplyScalar(.45);for(let f=0;f<t.n;f++){const v=f/t.n*Math.PI*2,m=(f+1)/t.n*Math.PI*2;e.quad([h*Math.cos(v),i,h*Math.sin(v)],[s*Math.cos(v),i,s*Math.sin(v)],[s*Math.cos(m),i,s*Math.sin(m)],[h*Math.cos(m),i,h*Math.sin(m)],o,0)}e.stem(0,i-.1,0,h,.01,-3,t.n,l,0)}const de={arches:4,pier:4,half:2.6,spring:15,rise:12.5};function _o(e,t,a){const o=c.stone.clone().lerp(c.brick,.12),i=o.clone().multiplyScalar(.74),d=c.brick.clone().lerp(c.stone,.3),r=de.arches,n=t/r,h=de.half,s=a-de.spring,l=de.pier/2,f=20;for(let p=0;p<=r;p++){e.box(p*n,0,0,de.pier,s,h*2,o,9,{top:!1}),e.box(p*n,0,0,de.pier+1.2,2.5,h*2+1.2,i,0),e.box(p*n,s-.8,0,de.pier+.8,.8,h*2+.6,c.white,0,{bottom:!0});for(let w=9;w<s-4;w+=9)e.box(p*n,w,0,de.pier+.5,.5,h*2+.4,c.white,0,{bottom:!0})}for(let p=0;p<r;p++){const w=p*n+l,g=n-de.pier,y=F=>s+de.rise*Math.sqrt(Math.max(0,1-(2*F-1)**2));for(let F=0;F<f;F++){const T=F/f,q=(F+1)/f,k=w+T*g,M=w+q*g,A=y(T),C=y(q);e.quad([k,A,-h],[k,a-1,-h],[M,a-1,-h],[M,C,-h],o,9),e.quad([M,C,h],[M,a-1,h],[k,a-1,h],[k,A,h],o,9),e.quad([k,A,h],[k,A,-h],[M,C,-h],[M,C,h],d,10)}const b=w+g/2,z=g/2,S=de.rise,L=1.1;for(let F=0;F<f;F++){const T=Math.PI*F/f,q=Math.PI*(F+1)/f,k=F%2?c.white:c.post,M=_=>[b-z*Math.cos(_),s+S*Math.sin(_)],A=_=>[b-(z+L)*Math.cos(_),s+(S+L)*Math.sin(_)],C=M(T),E=M(q),R=A(T),G=A(q),W=T+(q-T)*.09,U=M(W),D=A(W),J=k.clone().multiplyScalar(.9+.14*((p*7+F*13)%5/4)),N=(_,$)=>[b-(z+L+$)*Math.cos(_),s+(S+L+$)*Math.sin(_)],K=N(T,.38),H=N(q,.38),Z=N(T,.85),ee=N(q,.85);for(const _ of[-1,1]){const $=(B,I,O,X,Y,Q)=>{const me=_*(h+Y);_<0?e.quad([B[0],B[1],me],[I[0],I[1],me],[O[0],O[1],me],[X[0],X[1],me],Q,0):e.quad([X[0],X[1],me],[O[0],O[1],me],[I[0],I[1],me],[B[0],B[1],me],Q,0)};$(U,D,G,E,.12,J),$(C,R,D,U,.1,i),$(R,K,H,G,.2,c.white),$(K,Z,ee,H,.02,i)}}e.box(p*n,s,0,de.pier,a-1-s,h*2,o,9,{top:!1})}e.box(r*n,s,0,de.pier,a-1-s,h*2,o,9,{top:!1});const v=o.clone().lerp(c.white,.35),m=c.dark.clone().lerp(o,.25),u=d.clone().multiplyScalar(.8);for(let p=0;p<=r;p++){const w=p*n;for(const g of[-1,1]){const y=g*h;for(let S=0;S<3;S++){const L=1.5-.5*S,F=s*S/3;e.box(w,F,y+g*L/2,de.pier-1.2+.4*(2-S),s/3,L,S%2?o:i,9,{topCol:v})}e.box(w,s,y+g*.2,1.6,a-1-s,.4,v,9,{top:!1});const b=s+de.rise*.72,z=y+g*.42;for(let S=0;S<12;S++){const L=S/12*Math.PI*2,F=(S+1)/12*Math.PI*2,T=(k,M,A)=>[w+k*Math.cos(M),b+k*Math.sin(M),A],q=(k,M,A,C)=>g>0?e.tri(k,M,A,C,0):e.tri(k,A,M,C,0);q(T(0,0,z+g*.02),T(1.25,L,z+g*.02),T(1.25,F,z+g*.02),m),q(T(1.25,L,z+g*.1),T(1.75,L,z+g*.1),T(1.75,F,z+g*.1),c.white),q(T(1.25,L,z+g*.1),T(1.75,F,z+g*.1),T(1.25,F,z+g*.1),c.white)}}}for(let p=0;p<r;p++){const w=p*n+n/2;for(const g of[-1,1])e.box(w,s+de.rise-.5,g*(h+.3),1.5,2.6,.6,c.white,0,{bottom:!0});for(const g of[-1,1])for(let y=0;y<f;y++){const b=n-de.pier,z=p*n+l,S=y/f,L=(y+1)/f,F=T=>s+de.rise*Math.sqrt(Math.max(0,1-(2*T-1)**2));e.quad([z+S*b,F(S)-.02,g*h],[z+L*b,F(L)-.02,g*h],[z+L*b,F(L)-.02,g*(h-.5)],[z+S*b,F(S)-.02,g*(h-.5)],u,0)}}for(let p=-1;p<=t+1;p+=2.6)for(const w of[-1,1])e.box(p,a-1.9,w*(h+.35),.7,.9,.7,v,0,{bottom:!0});e.box(t/2,a-1,0,t+4,1,h*2+1.6,c.white,0,{bottom:!0});for(const p of[-h-.45,h+.45])e.box(t/2,a,p,t+4,1.25,.45,o,9,{top:!1}),e.box(t/2,a+1.25,p,t+4.4,.3,.75,c.white,0,{bottom:!0});for(let p=0;p<=r;p++)for(const w of[-1,1])e.box(p*n,a-1,w*(h+1),3.2,2.7,.9,v,9,{topCol:c.white,bottom:!0});for(const p of[-.75,.75])e.box(t/2,a,p,t+2,.18,.14,c.iron,0)}const Ce=Math.PI/2,jt=[-Ce-1,-Ce-.75,-Ce-.5,-Ce+.5,-Ce+.75,-Ce+1,Ce-1,Ce-.75,Ce-.5,Ce+.5,Ce+.75,Ce+1,.2,Math.PI-.2],Vt={len:15,width:2.4};function ft(e){const t=e.viaduct,a=t.s1-t.s0,o=t.z1-t.z0,i=Math.hypot(a,o);return{len:i,yaw:-Math.atan2(o,a),ds:a/i,dz:o/i}}Ae.push(async e=>{const{P:t,ctx:a}=e,o=new ne,i=new x.Matrix4;for(const b of[t.steepleUp,t.steepleLying])o.m=se(b.s,b.z,0,0,1,i),Po(o),Wo(o);await a.yield();const d=wo(a.core.makeRng(a.core.hashSeed("churchyard:"+a.seed)));for(const b of[t.steepleUp,t.steepleLying])o.m=se(b.s,b.z,0,0,1,i),xo(o,d);await a.yield();for(const b of[t.millUp,...t.mills])o.m=se(b.s,b.z,0,0,1,i),Oo(o);for(const b of[t.clock,t.clockLying])o.m=se(b.s,b.z,0,0,1,i),Uo(o);await a.yield();for(const b of t.chimneys)o.m=se(b.s,b.z,0,0,1,i),$o(o);const r=ft(t);o.m=se(t.viaduct.s0,t.viaduct.z0,0,r.yaw,1,i),_o(o,r.len,t.viaduct.h),await a.yield(),o.m=null;const n=t.square;Fe(o,n.z0,n.z1,n.s0,n.s1,.08,c.paving,3,2,2);for(const b of[t.balloon,t.balloonWall,t.balloonTop])Fe(o,b.z-b.half,b.z+b.half,b.s-ae/2+2,b.s+ae/2-2,.06,c.paving.clone().lerp(c.cobble,.3),3,2,2);o.m=se(t.carousel.s,t.carousel.z,0,0,1,i),o.stem(0,0,0,10.4,10.4,.5,20,c.stone,0,!0),o.m=se(t.fountain.s,t.fountain.z,0,0,1,i),o.stem(0,0,0,be.basin,be.basin,1.1,20,c.stone,0),o.stem(0,0,0,be.basin-.7,be.basin-.7,1.1,20,c.stone.clone().multiplyScalar(.8),0),o.stem(0,.75,0,be.basin-.7,.01,.01,20,new x.Color("#3E8F8A"),0);for(let b=0;b<20;b++){const z=b/20*Math.PI*2,S=(b+1)/20*Math.PI*2,L=be.land-.9,F=be.land+.9;o.quad([L*Math.cos(z),.8,L*Math.sin(z)],[L*Math.cos(S),.8,L*Math.sin(S)],[F*Math.cos(S),.8,F*Math.sin(S)],[F*Math.cos(z),.8,F*Math.sin(z)],c.white,0)}o.stem(0,0,0,.9,.6,1.6,8,c.stone,0),o.stem(0,1.6,0,.6,2,.6,10,c.stone,0,!0);const h=new x.Color(.74,.86,.93);for(let b=0;b<be.n;b++){const z=b/be.n*Math.PI*2,S=Math.cos(z),L=Math.sin(z);for(let F=0;F<18;F++){const T=F/18,q=(F+1)/18,k=.16+.3*T,M=.16+.3*q,A=At(T),C=At(q),E=Ct(T),R=Ct(q);o.quad([A*S-k*L,E,A*L+k*S],[A*S+k*L,E,A*L-k*S],[C*S+M*L,R,C*L-M*S],[C*S-M*L,R,C*L+M*S],h,0),o.quad([(A-k)*S,E,(A-k)*L],[(A+k)*S,E,(A+k)*L],[(C+M)*S,R,(C+M)*L],[(C-M)*S,R,(C-M)*L],h,0)}}o.m=se(t.lake.s,t.lake.z,0,0,1,i);const s=c.dark.clone().lerp(c.stone,.3);for(let b=0;b<48;b++){const z=b/48*Math.PI*2,S=(b+1)/48*Math.PI*2,L=t.lake.r,F=t.lake.r+5,T=[L*Math.cos(z),1.5,L*Math.sin(z)],q=[L*Math.cos(S),1.5,L*Math.sin(S)],k=[F*Math.cos(S),1.5,F*Math.sin(S)],M=[F*Math.cos(z),1.5,F*Math.sin(z)];o.quad(T,q,k,M,b%2?c.stone:c.paving,0),o.quad(M,k,[k[0],0,k[2]],[M[0],0,M[2]],c.stone,0),o.quad(q,T,[T[0],.3,T[2]],[q[0],.3,q[2]],s,0);const A=(z+S)/2;o.box((L+.7)*Math.cos(A),1.5,(L+.7)*Math.sin(A),.5,.8,.5,c.iron,0)}await a.yield();for(const b of jt){const z=Math.cos(b),S=Math.sin(b),L=t.lake.r,F=Vt.len,T=Vt.width/2,q=(k,M,A)=>[k*z-M*S,A,k*S+M*z];o.quad(q(L,-T,1.45),q(L,T,1.45),q(L-F,T,1.45),q(L-F,-T,1.45),c.wood,0);for(const k of[-T,T])o.quad(q(L,k,1.45),q(L-F,k,1.45),q(L-F,k,1),q(L,k,1),c.wood.clone().multiplyScalar(.7),0);for(let k=1;k<=4;k++)for(const M of[-T,T]){const A=q(L-F*k/4,M,.2);o.box(A[0],A[1],A[2],.4,2.1,.4,c.dark,0)}}o.m=se(ce-1,P.canalZ,0,0,1,i),o.box(-2,0,-6.4,6,3.4,2.6,c.stone,0),o.box(-2,0,6.4,6,3.4,2.6,c.stone,0),o.box(.6,-1.4,0,1.2,1.5,10.4,c.stone.clone().multiplyScalar(.8),0),o.m=null;const l=P.wallX,f=P.rimY,v=P.canalZ,m=c.stone.clone().lerp(c.white,.25),u=c.stone.clone().multiplyScalar(.8);for(const[b,z]of[[P.z0,v-6.5],[v+6.5,P.z1]])o.box(l+1.1,f,(b+z)/2,2.2,.9,z-b,m,9),o.box(l+P.thick-1.1,f,(b+z)/2,2.2,.9,z-b,m,9);await a.yield();for(const b of[-1,1]){const z=v+b*9.5,S=l+3.6;o.box(S,f,z,6.4,1.2,6.4,u,9),o.box(S,f+1.2,z,5,6.8,5,c.stone,9,{top:!1});for(const L of[-1,1])o.box(S-2.55,f+3.2,z+L*1.2,.2,2.8,1,c.dark,0,{top:!1});o.box(S,f+8,z,6,.7,6,c.white,0,{bottom:!0}),o.stem(S,f+8.7,z,3.9,0,2.6,4,c.slate,2)}o.box(l+6,f,v,12,.45,12.4,u,9),await a.yield();const p=t.viaduct.z1+40,w=new x.Matrix4,g=P.z1-12;for(const[b,z]of[[p,v-6.5],[v+6.5,P.z1-1]]){o.box(l+.3,f+1.9,(b+z)/2,.12,.12,z-b,c.iron,0);for(let S=b;S<=z;S+=2.5)o.box(l+.3,f+.9,S,.1,1,.1,c.iron,0,{top:!1})}for(let b=p+5,z=0;b<P.z1-4;b+=12.5,z++)Math.abs(b-v)<13||Math.abs(b-g)<6||(o.m=w.makeTranslation(l+1.4,f+.9,b),Ue(o),z%2&&(o.m=w.makeTranslation(l+3.6,f,b+6.25),Lt(o)));o.m=w.makeTranslation(l+6.6,f,g),No(o),o.m=null;const y=new x.Mesh(o.build(),e.town);y.frustumCulled=!1,y.matrixAutoUpdate=!1,e.group.add(y)});const j={speed:6.3,n:11,carLen:14,couple:14.6,railOut:2,lift:.25,rail0:2,end:30,ease:4,clearOf:56,cross:18,haltTop:18};j.lo=j.rail0+j.end+j.couple/2,j.hi=ce-j.end-j.couple/2,j.run=(j.hi-j.lo)/j.speed+j.ease;{const e=P.sCrease+P.R*$e/2,t=2*(j.hi-e)/j.speed+j.ease+j.haltTop;let a=1/0;for(let o=0;o<4*j.n;o++){const i=t*j.n/(o+.5)-2*j.run-j.haltTop;i>=.75*j.haltTop&&i<a&&(a=i)}j.haltQuay=a,j.period=2*j.run+j.haltTop+a}function Do(e,t,a={}){const o=j.period,i=e+t*o/j.n,d=Math.floor(i/o),r=i-d*o,n=j.run,h=j.ease,s=j.speed,l=j.hi-j.lo,f=r<n+j.haltTop,v=f?r:r-n-j.haltTop,m=v>=n?l:v<h?s*v*v/(2*h):v>n-h?l-s*(n-v)*(n-v)/(2*h):s*(v-h/2),u=p=>((p+t)%2+2)%2;return a.up=r<n,a.s=f?j.lo+m:j.hi-m,a.top=u(d),a.quay=u(r<n?d-1:d),a}function Ht(e,t,a={}){const o=j.rail0+j.clearOf,i=ce-j.clearOf-j.cross,d=j.railOut,r=e<(o+i)/2,n=he((e-(r?o:i))/j.cross,0,1),h=n*n*(3-2*n),s=6*n*(1-n)/j.cross,l=r?t.quay:t.top,f=r?t.up&&l===0:!t.up&&l===0,v=r?!t.up&&l===1:t.up&&l===1;return f?(a.z=-d+2*d*h,a.slope=2*d*s):v?(a.z=d-2*d*h,a.slope=-2*d*s):(a.z=t.up?d:-d,a.slope=0),a}function jo(e){const t=c.enamel,a=j.carLen-.8;e.box(0,.25,0,a-2.4,.7,1.8,c.dark,0,{top:!1}),e.box(0,.8,0,a,2.6,2.8,t,5,{top:!1,bottom:!0}),e.box(0,3.4,0,a+.3,.3,3,t,0,{bottom:!0}),e.box(0,3.7,0,a-3,.3,1.5,t.clone().lerp(c.white,.4),0),e.box(a*.3,4,0,.12,1.5,.12,c.iron,0)}function Vo(e){const t=new x.Color("#2E7A55");e.box(0,.2,0,9,.9,1.9,c.dark,0,{top:!1}),e.box(4.6,.5,0,.3,.5,2.3,c.brick,0),e.box(1.2,1.1,0,6.2,2,2,t,0);for(const a of[-.6,1.4,3.4])e.box(a,1.05,0,.22,2.1,2.08,c.enamel,0);e.box(-3,1.1,0,2.6,3,2.5,t,0,{topCol:c.dark}),e.stem(3.2,3.1,0,.42,.55,1.5,7,c.dark,0,!0),e.stem(1.2,3.1,0,.5,.3,.6,6,c.enamel,0,!0)}function Ho(e){e.box(0,.2,0,8.4,.7,1.8,c.dark,0,{top:!1}),e.box(0,.8,0,9.6,2.6,2.5,c.plaster.clone().multiplyScalar(.95),5,{top:!1,bottom:!0}),e.box(0,.8,0,9.64,.75,2.54,c.brick,0,{top:!1}),e.box(0,3.4,0,9.8,.3,2.7,c.white,0,{bottom:!0})}function Yt(e,t=c.enamel){const a=new x.Color("#A8322A"),o=c.wood.clone().lerp(c.enamel,.25);e.box(0,0,0,2.4,1.7,2.4,o,0,{bottom:!0}),e.box(0,1.7,0,2.7,.3,2.7,c.wood,0,{bottom:!0});const i=12.6,d=8,r=10,n=16,h=-1.25,s=l=>{const f=h+l/r*(Math.PI/2-h);return[d*Math.cos(f),i+d*Math.sin(f)*1.08]};for(let l=0;l<r;l++){const[f,v]=s(l),[m,u]=s(l+1);for(let p=0;p<n;p++){const w=p/n*Math.PI*2,g=(p+1)/n*Math.PI*2,y=l===r-1||l===4?a:p%2?t:c.plaster,b=[f*Math.cos(w),v,f*Math.sin(w)],z=[f*Math.cos(g),v,f*Math.sin(g)],S=[m*Math.cos(g),u,m*Math.sin(g)],L=[m*Math.cos(w),u,m*Math.sin(w)];if(l===r-1?e.tri(b,[0,u,0],z,y,0):e.quad(b,L,S,z,y,0),l===0&&(e.quad(b,z,[z[0]*.8,v-1.3,z[2]*.8],[b[0]*.8,v-1.3,b[2]*.8],a,0),p%4===0)){const F=Math.cos(w),T=Math.sin(w),q=.07;e.quad([b[0]*.8-q*T,v-1.3,b[2]*.8+q*F],[b[0]*.8+q*T,v-1.3,b[2]*.8-q*F],[1.3*F+q*T,2,1.3*T-q*F],[1.3*F-q*T,2,1.3*T+q*F],c.dark,0)}}}}function Kt(e,t,a){const o=new x.Vector3,i=new x.Vector3,d=new x.Vector3,r=new x.Vector3(0,0,1),n=s=>{const l=t[Math.max(s-1,0)],f=t[Math.min(s+1,t.length-1)],v=t[s];return o.subVectors(f,l).normalize(),i.crossVectors(o,r).normalize(),d.crossVectors(o,i),[[1,1],[-1,1],[-1,-1],[1,-1]].map(([m,u])=>[v.x+(i.x*m+d.x*u)*a,v.y+(i.y*m+d.y*u)*a,v.z+(i.z*m+d.z*u)*a])};let h=n(0);for(let s=1;s<t.length;s++){const l=n(s),f=(s>>2)%2?c.white:c.enamel.clone().lerp(c.wood,.35);for(let v=0;v<4;v++)e.quad(h[v],h[(v+1)%4],l[(v+1)%4],l[v],f,0);h=l}}const Xe=["#E2B13C","#3E8F8A","#D9703A"];function Yo(e,t,a){const o=[];for(let d=0;d<=t+1e-6;d+=2)o.push(new x.Vector3(0,d,0));Kt(e,o,.24),e.stem(0,0,0,1.6,1.6,.5,10,c.stone,0,!0);const i=e.m;e.m=(i?i.clone():new x.Matrix4).multiply(new x.Matrix4().makeTranslation(0,t,0)),Yt(e,a),e.m=i}function Zt(e,t,a){const o=dt(t.x-.4,t.y,t.z,Math.round(ut.reach/ut.step),ut.step,0,void 0),i=o.map(h=>h.clone().sub(t));Kt(e,i,.3);const d=i[i.length-1],r=new x.Vector3().subVectors(d,i[i.length-2]).normalize(),n=new x.Quaternion().setFromUnitVectors(new x.Vector3(0,1,0),r);return e.m=new x.Matrix4().compose(d,n,new x.Vector3(1,1,1)),Yt(e,a),e.m=null,e.m=new x.Matrix4().makeRotationZ(Math.PI/2),e.stem(0,0,0,1.6,1.6,.5,10,c.stone,0,!0),e.m=null,{end:o[o.length-1]}}const fe={horses:12,canopy:7.3,eave:7.2,roof:8.2,ringOut:8.7,ringIn:5.2,bob:.55,horse:1.25};function Ko(e){const t=c.white;e.box(0,1.5,0,2.5,1.05,.8,t,0,{bottom:!0}),e.box(1.35,2.2,0,.6,1.3,.55,t,0),e.box(1.95,3,0,1.1,.55,.5,t,0,{bottom:!0}),e.box(-1.5,1.7,0,.5,.9,.25,c.dark,0);for(const[a,o]of[[.9,.28],[.9,-.28],[-.9,.28],[-.9,-.28]])e.box(a+(a>0?.25:-.25),.35,o,.28,1.2,.22,t,0,{bottom:!0});e.box(0,2.55,0,1,.22,.9,new x.Color("#A8322A"),0),e.box(1,2.45,0,.3,.5,.86,c.enamel,0)}function Xt(e,t){const a=(e/50%1+1)%1,o=a<.42?Pe(0,.42,a):a<.5?1:a<.92?1-Pe(.5,.92,a):0;return ve(40,t-6,o)}const Ve={n:56,every:.3,rise:4.2},ut={rope:40,reach:108,step:1.5};Ae.push(async e=>{const{P:t,ctx:a,group:o,town:i}=e,d=(N,K)=>{const H=K?new x.InstancedMesh(N,i,K):new x.Mesh(N,i);return H.frustumCulled=!1,H.matrixAutoUpdate=!1,o.add(H),H},r=new x.Matrix4,n=new x.Matrix4,h=new x.Matrix4;let s=new ne;Go(s);const l=s.build(),f=[t.millUp,...t.mills].map((N,K)=>({mesh:d(l),base:se(N.s,N.z-it.sailsOff,it.hub,0,1,new x.Matrix4),ph:K*.9}));s=new ne;const v=new x.Color("#A8322A"),m=c.white,u=c.sea.clone().lerp(c.dark,.25),p=c.enamel,w=fe.horses;for(let N=0;N<24;N++){const K=N/24*Math.PI*2,H=(N+1)/24*Math.PI*2,Z=Math.cos(K),ee=Math.sin(K),_=Math.cos(H),$=Math.sin(H),B=fe.canopy,I=fe.eave,O=N%2?v:m;s.quad([B*Z,I,B*ee],[2.6*Z,I+4.6,2.6*ee],[2.6*_,I+4.6,2.6*$],[B*_,I,B*$],O,0),s.tri([2.6*Z,I+4.6,2.6*ee],[0,I+fe.roof,0],[2.6*_,I+4.6,2.6*$],N%2?m:v,0);const X=Math.cos((K+H)/2),Y=Math.sin((K+H)/2);s.tri([B*Z,I,B*ee],[B*_,I,B*$],[B*X,I-1.1,B*Y],N%2?u:p,0),s.quad([9.9*Z,.75,9.9*ee],[2.4*Z,.75,2.4*ee],[2.4*_,.75,2.4*$],[9.9*_,.75,9.9*$],N%2?c.wood:c.wood.clone().lerp(c.plaster,.35),0),s.quad([9.9*Z,.75,9.9*ee],[9.9*_,.75,9.9*$],[9.9*_,.3,9.9*$],[9.9*Z,.3,9.9*ee],N%2?v:p,0),s.quad([2.4*Z,.75,2.4*ee],[2.4*Z,I+.4,2.4*ee],[2.4*_,I+.4,2.4*$],[2.4*_,.75,2.4*$],N%2?c.sky:p,0)}for(let N=0;N<w;N++){const K=(N+.5)/w*Math.PI*2,H=N%2?fe.ringOut:fe.ringIn;s.box(H*Math.cos(K),.75,H*Math.sin(K),.2,fe.eave-.4,.2,p,0,{top:!1}),N%2&&(s.m=new x.Matrix4().makeRotationY(-K),s.box(fe.ringOut/2+1.2,fe.eave+.1,0,fe.ringOut-2.2,.3,.3,v,0),s.m=null)}s.stem(0,fe.eave+fe.roof-.3,0,.55,.55,.9,6,p,0,!0);const g=d(s.build());s=new ne,Ko(s);const y=d(s.build(),fe.horses);await a.yield(),s=new ne,jo(s);const b=d(s.build(),j.n*2);s=new ne,Vo(s);const z=d(s.build());s=new ne,Ho(s);const S=d(s.build(),3),L=ft(t),F=se(t.viaduct.s0,t.viaduct.z0,0,L.yaw,1,new x.Matrix4),T=new x.Color(Xe[(e.opts.gala||0)%Xe.length]);s=new ne,Yo(s,ut.rope,T);const q=d(s.build()),k=se(t.balloon.s,t.balloon.z,0,0,1,new x.Matrix4),M=qe(t.balloonWall.s,t.balloonWall.z,0,new x.Vector3);s=new ne,Zt(s,M,T);const A=d(s.build()),C=new x.Matrix4().makeTranslation(M.x,M.y,M.z),E=qe(t.balloonTop.s,t.balloonTop.z,0,new x.Vector3);s=new ne,Zt(s,E,new x.Color(Xe[((e.opts.gala||0)+1)%Xe.length]));const R=d(s.build()),G=new x.Matrix4().makeTranslation(E.x,E.y,E.z);await a.yield();const W=Math.PI*2,U=new x.Vector3(fe.horse,fe.horse,fe.horse),D={},J={};e.tick.push(N=>{for(const H of f)H.mesh.matrix.copy(H.base).multiply(n.makeRotationZ(N*W/9+H.ph));se(t.carousel.s,t.carousel.z,0,N*W/12,1,g.matrix);for(let H=0;H<fe.horses;H++){const Z=(H+.5)/fe.horses*W,ee=H%2?fe.ringOut:fe.ringIn;r.copy(g.matrix).multiply(h.makeTranslation(ee*Math.cos(Z),.75+fe.bob*(1+Math.sin(N*W/3+H*2.4)),ee*Math.sin(Z))).multiply(n.makeRotationY(Math.PI/2-Z)).scale(U),y.setMatrixAt(H,r)}y.instanceMatrix.needsUpdate=!0;for(let H=0;H<j.n;H++){Do(N,H,D);for(let Z=0;Z<2;Z++){const ee=D.s+(Z?-.5:.5)*j.couple;Ht(ee,D,J),se(ee,P.avenueZ+J.z,j.lift,(Z?Math.PI:0)-Math.atan(J.slope),1,r),b.setMatrixAt(H*2+Z,r)}}b.instanceMatrix.needsUpdate=!0;const K=Xt(N,L.len);z.matrix.copy(F).multiply(h.makeTranslation(K,t.viaduct.h+.1,0));for(let H=0;H<3;H++)r.copy(F).multiply(h.makeTranslation(K-10.2-H*10.4,t.viaduct.h+.1,0)),S.setMatrixAt(H,r);S.instanceMatrix.needsUpdate=!0,q.matrix.copy(k).multiply(n.makeRotationX(.05*Math.sin(N*W/11))).multiply(h.makeRotationZ(.06*Math.sin(N*W/17+1))),A.matrix.copy(C).multiply(n.makeRotationY(.018*Math.sin(N*W/13))).multiply(h.makeRotationX(.03*Math.sin(N*W/19+1))),R.matrix.copy(G).multiply(n.makeRotationY(.02*Math.sin(N*W/15+2))).multiply(h.makeRotationX(.03*Math.sin(N*W/21+4)))})});function Zo(e){return new x.ShaderMaterial({uniforms:{...e,uDeep:{value:c.sea.clone().multiplyScalar(.9)}},vertexShader:`attribute vec3 aLocal; attribute float aKind; varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vF;
      void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normal; vL = aLocal; vF = aKind; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`varying vec3 vW; varying vec3 vN; varying vec3 vL; varying float vF; uniform float uTime; uniform vec3 uDeep;
      ${Oe}
      float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
      void main() {
        vec3 n = vN / max(length(vN), 1e-4); if (!gl_FrontFacing) n = -n;
        vec3 toEye = cameraPosition - vW; vec3 v = toEye / max(length(toEye), 1e-3);
        vec2 q = vec2(vL.x - vF * uTime, vL.z);
        float r1 = vnoise(q * vec2(.35, .9) + vec2(0., uTime * .15)), r2 = vnoise(q * vec2(.9, 2.1) - vec2(uTime * .3, 0.));
        float rip = r1 * .6 + r2 * .4;
        float fr = 1. - max(dot(n, v), 0.); fr = .05 + .95 * fr * fr * fr;
        vec3 refl = reflect(-v, n); 
        vec3 skyc = mix(uFogCol, uZenith, 1. - exp(-abs(refl.y) * 3.2));
        float sh = slabShadow(vW);
        float ndl = max(dot(n, uSun), 0.) * sh;
        vec3 c = uDeep * (.6 + .6 * ndl) * (.86 + .3 * rip);
        c = mix(c, skyc, clamp(fr * .55 + (rip - .5) * .18, 0., .5));
        float glint = smoothstep(.55, .95, r2 * r1 * 2.) * (.2 + ndl);
        c += uSunCol * glint * .12;
        float foam = clamp(vL.y, 0., 1.);
        // white water: long streaks drawn out along the fall, finer ones among them
        vec2 qs = q + vec2(0., .5 * sin(q.x * .13) + .25 * sin(q.x * .31 + 2.));
        float streak = vnoise(qs * vec2(.045, 1.7)) * .5 + vnoise(qs * vec2(.11, 4.3) + 5.) * .32 + vnoise(qs * vec2(.3, 9.) + 2.) * .18;
        c = mix(c * mix(1., .8, foam), vec3(.95, .97, .99) * (.6 + .5 * ndl + .2), foam * (.3 + .7 * smoothstep(.3, .68, streak)) * (.85 + .15 * r2));
        gl_FragColor = vec4(airFog(c, vW), 1.);
      }`,side:x.DoubleSide})}const zt=10;function Xo(e,t){const a=[];for(let o=0;o<zt;o++)a.push(new x.Vector4(1e4,1e4,0,1));return new x.ShaderMaterial({uniforms:{...e,uBoat:{value:a},uR:{value:t},uDeep:{value:new x.Color("#0F5A55")},uShoal:{value:new x.Color("#58AE96")}},vertexShader:`attribute vec3 aLocal; varying vec3 vW; varying vec3 vL;
      void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vL = aLocal; gl_Position = projectionMatrix * viewMatrix * w; }`,side:x.DoubleSide,fragmentShader:`varying vec3 vW; varying vec3 vL; uniform float uTime; uniform float uR; uniform vec4 uBoat[${zt}];
      uniform vec3 uDeep; uniform vec3 uShoal;
      ${Oe}
      float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
      void main() {
        vec2 p = vL.xz; float r = length(p);
        float px = max(fwidth(p.x) + fwidth(p.y), 1e-4);
        vec3 toEye = cameraPosition - vW; float dist = max(length(toEye), 1e-3); vec3 v = toEye / dist;
        // wind waves: three trains of crests of three lengths, crossing the lake in its own plane
        vec2 w0 = vec2(.26, .966), w1 = vec2(.5, .866), w2 = vec2(-.44, .9);
        float warp = vnoise(p * .045 + vec2(uTime * .03, 0.)) * 5.;
        // the shorter trains wander and break, so no two crests cross the same way twice
        float wander = vnoise(p * .17 + vec2(3., uTime * .05)) * 4.2, ruffle = vnoise(p * .37 - vec2(uTime * .08, 7.)) * 5.;
        float a0 = dot(p, w0) * .42 + warp * .8 - uTime * .7, a1 = dot(p, w1) * 1.5 + warp + wander - uTime * 1.3, a2 = dot(p, w2) * 3.1 - warp * .7 + ruffle - uTime * 2.;
        float f0 = clamp(1.4 - px * .22, 0., 1.), f1 = clamp(1.3 - px * .8, 0., 1.), f2 = clamp(1.2 - px * 1.7, 0., 1.);
        vec2 g = w0 * cos(a0) * .10 * f0 + w1 * cos(a1) * .10 * f1 + w2 * cos(a2) * .06 * f2;
        // the water's normal: the wall's own up, leaned by the waves' slope (up the wall is world y, across is world z)
        vec3 n = vec3(-1., -g.x, -g.y); n /= max(length(n), 1e-4);
        float sh = slabShadow(vW);
        float ndl = max(dot(n, uSun), 0.) * sh;
        // deep green in the middle, jade over the shoals by the shore, darker where a gust lies on it
        float shoal = smoothstep(uR - 16., uR - 1., r);
        float gust = vnoise(p * .028 + vec2(uTime * .05, -uTime * .02)) * .6 + vnoise(p * .09 - vec2(uTime * .06, 0.)) * .4;
        vec3 c = mix(uDeep, uShoal, shoal * .7) * (.62 + .55 * ndl) * (.8 + .4 * gust) * mix(uShade * 1.5, vec3(1.), .5 + .5 * sh);
        // crest lines: the pale backs of the waves, long ones first
        float crest = smoothstep(.55, 1., sin(a0)) * .5 * f0 + smoothstep(.7, 1., sin(a1 + 2. * gust)) * .26 * f1 * gust + smoothstep(.8, 1., sin(a2)) * .12 * f2 * (1. - gust);
        c += (uShoal * .5 + uZenith * .25) * crest * (.2 + .5 * gust) * (.5 + .5 * sh);
        // where the waves are finer than the eye can part, their pale backs and the shoals' green run together into
        // one even field of jade, brighter than any one trough
        float evenJade = 1. - f1;
        c = mix(c, uShoal * (.78 + .5 * ndl) * mix(uShade * 1.6, vec3(1.), .5 + .5 * sh) * (.9 + .25 * gust) * 1.25, evenJade * .7);
        float fr = 1. - max(dot(n, v), 0.); fr = fr * fr; fr = fr * fr;
        vec3 refl = reflect(-v, n);
        c = mix(c, mix(uFogCol, uZenith, 1. - exp(-abs(refl.y) * 3.2)) * .8, clamp(fr, 0., .2) * (1. - .7 * evenJade));
        // each boat's wake: a pale curl that follows it round its ring and widens behind
        float wake = 0.;
        for (int i = 0; i < ${zt}; i++) {
          vec2 d = p - uBoat[i].xy; float rr = length(d);
          float ang = atan(d.y, abs(d.x) < 1e-4 ? 1e-4 : d.x);
          float behind = fract((uBoat[i].z - ang) * uBoat[i].w / 6.2831853);
          float wide = .5 + behind * 9.;
          wake += (1. - smoothstep(wide * .5, wide, abs(rr - 8.))) * (1. - smoothstep(0., .42, behind)) * step(rr, 30.);
        }
        c = mix(c, vec3(.82, .93, .9) * (.45 + .55 * sh + .2), clamp(wake, 0., 1.) * .6 * (.6 + .4 * vnoise(p * 1.3 - uTime * .4)));
        // the lap at the shore, coming and going
        float lap = smoothstep(uR - 2.6, uR - .9, r + 1.2 * vnoise(p * .35 + uTime * .25) + .5 * sin(uTime * .9 + r));
        c = mix(c, vec3(.86, .95, .92) * (.5 + .5 * sh + .15), lap * .55);
        // glitter on the waves' backs where they turn the sun to the eye
        float sd = max(dot(refl, uSun), 0.); float s4 = sd * sd; s4 *= s4; float s16 = s4 * s4; s16 *= s16;
        // the sparkle is the small waves' own: two fine smooth ripples running through each other, bright only where
        // both crest, and gone to an even sheen where a ripple is finer than the eye can part
        float fs = clamp(1.25 - px * 2.4, 0., 1.);
        float rp = vnoise(p * 2.9 + vec2(uTime * 1.1, -uTime * .7)) * vnoise(p * 4.3 - vec2(uTime * .9, uTime * 1.3) + 9.);
        float tw = smoothstep(.34, .62, rp) * fs;
        float s64 = s16 * s16; s64 *= s64;
        c += uSunCol * min(.75, (s64 + s16 * .08) * (.3 + .9 * tw)) * sh;
        // and by the same ripples a fine grain of lighter and darker water close to, in sun and shade alike
        c *= 1. + .16 * (rp - .25) * fs;
        gl_FragColor = vec4(airFogShare(c, vW, .4), 1.);
      }`})}const pe={v:29,lean:12*Math.PI/180,g:9.81,width:10,thick:1.5};function kt(e,t=new x.Vector3){const a=pe.v*Math.sin(pe.lean),o=pe.v*Math.cos(pe.lean);return t.set(P.wallX+a*e,P.rimY+o*e-.5*pe.g*e*e,P.canalZ)}Ae.push(async e=>{const{P:t,ctx:a,group:o,air:i}=e,d=Zo(i),r=[],n=[],h=[],s=[],l=(q,k,M,A,C,E,R,G,W,U)=>{r.push(q,k,M),n.push(A,C,E),h.push(R,G,W),s.push(U)},f={},v={},m=P.canalZ,u=5;for(let q=0;q<ce-1e-6;){const k=q<P.sCrease?P.sCrease:q<ke?Math.min(ke,q+2):ce;ye(q,f),ye(k,v);const M=[f.gx,f.gy,m-u],A=[f.gx,f.gy,m+u],C=[v.gx,v.gy,m+u],E=[v.gx,v.gy,m-u];l(...M,f.ux,f.uy,0,q,0,-u,3),l(...A,f.ux,f.uy,0,q,0,u,3),l(...C,v.ux,v.uy,0,k,0,u,3),l(...M,f.ux,f.uy,0,q,0,-u,3),l(...C,v.ux,v.uy,0,k,0,u,3),l(...E,v.ux,v.uy,0,k,0,-u,3),q=k}{const q=[],k=[],M=new x.Vector3,A=t.lake.r,C=(G,W)=>{qe(t.lake.s+G,t.lake.z+W,.7,M),q.push(M.x,M.y,M.z),k.push(G,0,W)};for(let G=0;G<48;G++){const W=G/48*Math.PI*2,U=(G+1)/48*Math.PI*2;C(0,0),C(A*Math.cos(W),A*Math.sin(W)),C(A*Math.cos(U),A*Math.sin(U))}const E=new x.BufferGeometry;E.setAttribute("position",new x.Float32BufferAttribute(q,3)),E.setAttribute("aLocal",new x.Float32BufferAttribute(k,3)),e.lakeMat=Xo(i,A);const R=new x.Mesh(E,e.lakeMat);R.frustumCulled=!1,R.matrixAutoUpdate=!1,o.add(R)}await a.yield();const p=pe.v*Math.cos(pe.lean),w=(p+Math.sqrt(p*p+2*pe.g*P.rimY))/pe.g,g=new x.Vector3,y=new x.Vector3,b=64,z=10,S=q=>{const k=w*q/b,M=w*Math.max(q-1,0)/b,A=w*Math.min(q+1,b)/b;kt(k,g),kt(M,y);const C=y.x,E=y.y;kt(A,y);const R=y.x-C,G=y.y-E,W=Math.max(Math.hypot(R,G),.001),U=G/W,D=-R/W,J=k/w,N=u*(1+.6*J),K=pe.thick*(1+2.2*J),H=.5+.5*Pe(0,.35,J),Z=[];for(let ee=0;ee<=z;ee++){const _=ee/z*Math.PI*2,$=Math.cos(_),B=Math.sin(_);Z.push([g.x+U*K*B,g.y+D*K*B,m+N*$,U*B,D*B,$*.6,H,N*$])}return{ring:Z,sp:pe.v,x:g.x,y:g.y,along:ce+pe.v*k}};let L=S(0);for(let q=1;q<=b;q++){const k=S(q),M=Math.hypot(k.x-L.x,k.y-L.y);for(let A=0;A<z;A++)for(const[C,E]of[[L.ring[A],L.along],[L.ring[A+1],L.along],[k.ring[A+1],k.along],[L.ring[A],L.along],[k.ring[A+1],k.along],[k.ring[A],k.along]])l(C[0],C[1],C[2],C[3],C[4],C[5],E,C[6],C[7],pe.v);L=k,q%16===0&&await a.yield()}const F=new x.BufferGeometry;F.setAttribute("position",new x.Float32BufferAttribute(r,3)),F.setAttribute("normal",new x.Float32BufferAttribute(n,3)),F.setAttribute("aLocal",new x.Float32BufferAttribute(h,3)),F.setAttribute("aKind",new x.Float32BufferAttribute(s,1));const T=new x.Mesh(F,d);T.frustumCulled=!1,T.matrixAutoUpdate=!1,o.add(T)});function Je(e,t,a,o,i,d,r=1.2){const n=[[-t/2,a*.34],[-t*.32,a/2],[t*.22,a/2],[t/2,0]];for(let h=0;h+1<n.length;h++){const[s,l]=n[h],[f,v]=n[h+1];e.quad([s,-r,l*.7],[s,o,l],[f,o,v],[f,-r,v*.7],i,0),e.quad([f,-r,-v*.7],[f,o,-v],[s,o,-l],[s,-r,-l*.7],i,0),e.quad([s,o,-l],[f,o,-v],[f,o,v],[s,o,l],d,0)}e.quad([-t/2,-r,-a*.24],[-t/2,o,-a*.34],[-t/2,o,a*.34],[-t/2,-r,a*.24],i,0)}const Le={L:16,B:4.2,lane:2.4,gap:46,speed:2.4,ease:24};function Qo(e){const t=Le.L,a=Le.B,o=1.1,i=.4,d=c.dark,r=c.brick.clone().multiplyScalar(.7),n=[[-t/2,0],[-t*.3,a/2],[t*.3,a/2],[t/2,0]];for(let h=0;h+1<n.length;h++){const[s,l]=n[h],[f,v]=n[h+1];e.quad([s,-i,l*.7],[s,o,l],[f,o,v],[f,-i,v*.7],d,0),e.quad([f,-i,-v*.7],[f,o,-v],[s,o,-l],[s,-i,-l*.7],d,0),e.quad([s,o,-l],[f,o,-v],[f,o,v],[s,o,l],r,0)}e.box(0,o,0,3,1.6,3,c.plaster,0)}const we={hull:8,mast:12,deck:.9,heel:.2,ring:8};function Jo(e){Je(e,we.hull,2.6,we.deck,c.white,c.wood,.5),e.box(.4,we.deck,0,.22,we.mast,.22,c.wood,0,{top:!1}),e.tri([.2,2.2,.05],[.2,we.mast+.6,.05],[-3.9,2.4,.5],c.plaster,6),e.tri([.7,2,0],[.7,we.mast-1.5,0],[3.9,1.3,.2],c.brick,6)}const ea={heel:.07};function ta(e){Je(e,we.hull,2.6,we.deck,c.brick.clone().multiplyScalar(.8),c.plaster,.5),e.box(0,we.deck-.25,0,we.hull*.9,.25,2.7,c.white,0,{top:!1}),e.box(.4,we.deck,0,.24,we.mast,.24,c.wood,0,{top:!1}),e.box(-1.7,we.deck+1.5,0,4.2,.5,.5,c.plaster,0)}function oa(e){Je(e,13,3.8,1.6,c.dark,c.wood);for(const[t,a]of[[2.2,13],[-3.2,10]])e.box(t,1.6,0,.3,a,.3,c.wood,0,{top:!1}),e.quad([t-2.6,3.2,.3],[t+2.2,2.8,.3],[t+1.4,a,.3],[t-2.9,a+1.2,.3],c.brick.clone().multiplyScalar(.9),6)}function aa(e){Je(e,48,9,4.2,c.dark,c.wood,2),e.box(0,3.4,0,47,.6,9.2,c.white,0,{top:!1}),e.box(21,4.2,0,14,.3,.3,c.wood,0);for(const t of[-15,0,14]){e.box(t,4.2,0,.6,32,.6,c.wood,0,{top:!1});const a=.62,o=Math.cos(a),i=Math.sin(a);for(let d=0;d<3;d++){const r=9+d*8.2,n=8-d*1.6,h=(s,l,f)=>{const v=(s*2-1)*n,m=.5+f*(1-(s*2-1)**2);return[t+m*o+v*i,l,-m*i+v*o]};e.quad(h(0,r+6.7,0),h(1,r+6.7,0),h(1,r+7,0),h(0,r+7,0),c.wood,0);for(let s=0;s<4;s++){const l=s/4,f=(s+1)/4;e.quad(h(l,r,1.6),h(f,r,1.6),h(f,r+6.6,.5),h(l,r+6.6,.5),s%2?c.plaster:c.white,6)}}}}function sa(e){Je(e,52,9,4.5,c.dark,c.wood,2),e.box(0,.2,0,51.5,.8,9.1,c.brick,0,{top:!1}),e.box(-2,4.5,0,24,3,6.6,c.white,5),e.box(-4,7.5,0,8,2.4,5,c.white,0),e.stem(2,7.5,0,1.5,1.5,7.5,10,c.enamel,0),e.stem(2,15,0,1.55,1.55,1.4,10,c.dark,0,!0);for(const t of[-19,17])e.box(t,4.5,0,.4,16,.4,c.wood,0,{top:!1})}const et=[{x:-105,z:rt.z+rt.r+150,yaw:.5},{x:-80,z:P.canalZ+15,yaw:1.2},{x:-230,z:P.z1+230,yaw:-.64},{x:30,z:P.z1+840,yaw:-.64}],Te={n:4,x0:60,x1:250,z0:P.z1+380,z1:P.z1+700,gap:9},Ie={cuts:10,every:1.5,wide:7},tt=1.45,St=1.6,Qt={x:-12,z:-339};Ae.push(async e=>{const{P:t,ctx:a,group:o,town:i,opts:d}=e,r=(B,I)=>{const O=I?new x.InstancedMesh(B,i,I):new x.Mesh(B,i);return O.frustumCulled=!1,O.matrixAutoUpdate=!1,o.add(O),O};let n=new ne;aa(n);const h=r(n.build());n=new ne,sa(n);const s=r(n.build(),et.length);n=new ne,oa(n);const l=r(n.build(),6+Te.n);await a.yield();const f=a.rng.fork("luggers"),v=[];for(let B=0;B<6;B++)v.push({x:f.range(-190,-60),z:-230+B*290+f.range(-60,60),r:f.range(22,40),ph:f()*6.283,per:f.range(44,58)});for(const B of v)B.rx=B.r,B.rz=1.6*B.r;for(const B of v)for(const I of et)Math.abs(B.z-I.z)<170&&(B.x=Math.min(B.x,I.x-115));const m=a.core.makeRng(a.core.hashSeed("fleet:"+a.seed)),u=(Te.z1-Te.z0)/Te.n;for(let B=0;B<Te.n;B++){const I=m.range(20,28),O=u/2-I-Te.gap;v.push({x:m.range(Te.x0+1.6*I+Te.gap,Te.x1-1.6*I-Te.gap),z:Te.z0+u*(B+.5)+m.range(-O,O),r:I,rx:1.6*I,rz:I,ph:m()*6.283,per:m.range(44,58)})}const p=v.length*Ie.cuts*6,w=new Float32Array(p*3),g=new Float32Array(p*3),y=new Float32Array(p*3);for(let B=0;B<p;B++)g[B*3+1]=1;const b=new x.Color(.9,.95,.97),z=c.sea.clone().lerp(c.white,.35);for(let B=0;B<v.length;B++)for(let I=0;I<Ie.cuts;I++)for(let O=0;O<6;O++){const X=O===2||O===4||O===5?I+1:I,Y=b.clone().lerp(z,X/Ie.cuts),Q=((B*Ie.cuts+I)*6+O)*3;y[Q]=Y.r,y[Q+1]=Y.g,y[Q+2]=Y.b}const S=new x.BufferGeometry;S.setAttribute("position",new x.BufferAttribute(w,3)),S.setAttribute("normal",new x.BufferAttribute(g,3)),S.setAttribute("aCol",new x.BufferAttribute(y,3)),S.setAttribute("aLocal",new x.BufferAttribute(new Float32Array(p*3),3)),S.setAttribute("aKind",new x.BufferAttribute(new Float32Array(p),1));const L=r(S),F=(B,I,O)=>{const X=I*6.283185/B.per+B.ph;return O.x=B.x+B.rx*Math.cos(X),O.z=B.z+B.rz*Math.sin(X),O.a=X,O},T={},q={},k=d.boats||8;n=new ne,Jo(n);const M=r(n.build(),k);n=new ne,Qo(n);const A=r(n.build(),8);n=new ne,ta(n);const C=[];for(const B of jt)for(const I of[-1,1]){const O=t.lake.r-(I>0?8:12.5),X=Math.cos(B),Y=Math.sin(B);C.push({s:t.lake.s+O*X-I*3.3*Y,z:t.lake.z+O*Y+I*3.3*X,yaw:-B})}const E=r(n.build(),C.length);await a.yield();const R=new x.Matrix4,G=new x.Matrix4,W=new x.Quaternion,U=new x.Euler,D=new x.Vector3,J=new x.Vector3(1,1,1),N=new x.Vector3(tt,tt,tt),K=new x.Vector3(St,St,St),H=e.lakeMat.uniforms.uBoat.value,Z=Math.PI*2,ee=ce-30-10-3*Le.gap,_=2*a.core.makeRng(a.core.hashSeed("barges:"+a.seed))(),$=(B,I,O,X,Y,Q)=>(U.set(Q*Math.sin(X*Z/7.3+Y),O,Q*.6*Math.sin(X*Z/5.1+Y*1.7),"YXZ"),R.compose(D.set(B,.25*Math.sin(X*Z/6.1+Y),I),W.setFromEuler(U),J));e.tick.push(B=>{h.matrix.copy($(Qt.x,Qt.z,Math.PI/2,B,.4,.02));for(let I=0;I<et.length;I++){const O=et[I];s.setMatrixAt(I,$(O.x,O.z,O.yaw,B,I*2.1,.012).scale(N))}s.instanceMatrix.needsUpdate=!0;for(let I=0;I<v.length;I++){const O=v[I],X=B*Z/O.per+O.ph;l.setMatrixAt(I,$(O.x+O.rx*Math.cos(X),O.z+O.rz*Math.sin(X),-Math.atan2(O.rz*Math.cos(X),-O.rx*Math.sin(X)),B,O.ph,.05).scale(K));for(let Y=0;Y<Ie.cuts;Y++){F(O,B-1.2-Y*Ie.every,T),F(O,B-1.2-(Y+1)*Ie.every,q);const Q=(I*Ie.cuts+Y)*18,me=(Ye,no,Ke)=>{const ro=no/Ie.cuts,st=Ie.wide*.5*Math.sin(Math.PI*Math.min(1,.12+ro)),wt=O.rx*Math.cos(Ye.a),xt=O.rz*Math.sin(Ye.a),nt=Math.max(Math.hypot(wt,xt),.001);w[Ke]=Ye.x-wt/nt*st,w[Ke+1]=.3,w[Ke+2]=Ye.z-xt/nt*st,w[Ke+3]=Ye.x+wt/nt*st,w[Ke+4]=.3,w[Ke+5]=Ye.z+xt/nt*st};me(T,Y,Q),me(q,Y+1,Q+6),w[Q+13]=.3;const Ne=w[Q+6],so=w[Q+8],Ft=w[Q+9],Tt=w[Q+11];w[Q+6]=Ft,w[Q+8]=Tt,w[Q+9]=w[Q],w[Q+11]=w[Q+2],w[Q+12]=Ft,w[Q+14]=Tt,w[Q+15]=Ne,w[Q+16]=.3,w[Q+17]=so}}l.instanceMatrix.needsUpdate=!0,S.attributes.position.needsUpdate=!0;for(let I=0;I<k;I++){const O=t.lake.z-52+(k>1?104*I/(k-1):52),X=t.lake.s+(I%2?-8:8),Y=B*Z/(26+I%3*5)*(I%2?-1:1)+I*1.9,Q=-Math.sin(Y)*(I%2?-1:1),me=Math.cos(Y)*(I%2?-1:1);se(X+we.ring*Math.cos(Y),O+we.ring*Math.sin(Y),.7,-Math.atan2(me,Q),1,R),R.multiply(G.makeRotationX(we.heel*Math.sin(B*Z/6.7+I*2.3))),M.setMatrixAt(I,R),H[I].set(X-t.lake.s,O-t.lake.z,(Y%Z+Z)%Z,I%2?-1:1)}M.instanceMatrix.needsUpdate=!0;for(let I=0;I<C.length;I++){const O=C[I];se(O.s,O.z,.7,O.yaw,1,R),R.multiply(G.makeRotationX(ea.heel*Math.sin(B*Z/(5.3+I%5*.7)+I*1.3))),E.setMatrixAt(I,R)}E.instanceMatrix.needsUpdate=!0;for(let I=0;I<8;I++){const O=I<4?1:-1,X=(Le.speed*B/ee+_+(O>0?0:1))%2;let Y=(X<1?X:2-X)*ee;Y<Le.ease?Y=Le.ease/2+Y*Y/(2*Le.ease):Y>ee-Le.ease&&(Y=ee-Le.ease/2-(ee-Y)*(ee-Y)/(2*Le.ease)),se(10+Y+I%4*Le.gap,P.canalZ+O*Le.lane,.1,0,1,R),A.setMatrixAt(I,R)}A.instanceMatrix.needsUpdate=!0})});function dt(e,t,a,o,i,d,r){const n=[new x.Vector3(e,t,a)],h=new x.Vector3,s=new x.Vector3(e,t,a);for(let l=0;l<o;l++){bt(s.x,s.y,s.z,h);const f=Math.max(-h.y,0);if(h.multiplyScalar(-1),h.z-=d*f*f,s.addScaledVector(h.normalize(),i),r!==void 0&&s.y>r){s.y=r,n.push(s.clone());break}n.push(s.clone())}return n}function Jt(e,t){const a=(o,i)=>`vec4(${((o.x0+o.x1)/2).toFixed(1)}, ${((o.z0+o.z1)/2).toFixed(1)}, ${(2/((o.x1-o.x0)*i)).toFixed(6)}, ${(2/((o.z1-o.z0)*i)).toFixed(6)})`;return new x.ShaderMaterial({uniforms:{...e},vertexShader:`attribute vec3 aLocal; varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vZ;
      void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normal; vL = aLocal; vec4 e = viewMatrix * w;
        vZ = vec3(e.z, projectionMatrix[2][2], projectionMatrix[3][2]); gl_Position = projectionMatrix * e; }`,fragmentShader:`varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vZ; uniform float uTime;
      ${Oe}
      float h31(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float vn3(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
                   mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
      void main() {
        vec3 n = vN / max(length(vN), 1e-4);
        vec3 toEye = cameraPosition - vW; vec3 v = toEye / max(length(toEye), 1e-3);
        // vL: x = how far along (the wall's bank is marked far along), y = softness of the edge here (0 the hard cloud, the bank a little soft), z = drift speed
        vec3 q = vW * .11; q.z += uTime * .11 * vL.z; q.y -= uTime * .02;
        vec3 qa = vec3(vL.x * .16 - uTime * 1.05, q.x + q.y, q.z);
        float soft = ${t?"0.":"vL.y"};
        float tuft = vn3(q * 2.3 + 7. + soft * vec3(0., -uTime * .9, 0.));
        float puff = ${t?"vn3(q)":"mix(vn3(q - n * (uTime * .05)), vn3(qa), soft)"} * .6 + tuft * .4;
        float facing = abs(dot(n, v));
        float a = smoothstep(.12, .62, facing * (.55 + .9 * puff));
        a *= mix(1., .82, min(soft, 1.));
        float ndl = dot(n, uSun) * .5 + .5;
        float sf = min(soft, 1.);
        vec3 body = mix(vec3(.30, .29, .30), vec3(1.), max(1. - sf, smoothstep(30., 120., vL.x) * .55));
        vec3 c = body * mix(uShade * 1.25, vec3(1.), .45 + .55 * ndl) * mix(vec3(1.), uSunCol, .4) * mix(.76 + .36 * puff, .62 + .6 * puff, 1. - sf);
        ${t?`// A HEAP OF CLOUD IS LIT AS ONE SKIN: its light is of fields of its own place, never lump by lump. Its cut is
        // not wholly so: the skin is left out where the lump's own skin turns from the eye (a, above: the lump's own
        // facing), and only the threshold of that cut is of the place. vL.x is the corner's height in the whole
        // cloud. How far out toward the heap's edge a point lies is read from its own place: its share of the heap's
        // oval in plan (the deck's or the lower floor's, told by its height).
        float hk = clamp(vL.x, 0., 1.);
        vec4 ov = vW.y > ${((ie.y1+te.y0)/2).toFixed(1)} ? ${a(te,Ge.deck)} : ${a(ie,Ge.floor)};
        vec2 od = (vW.xz - ov.xy) * ov.zw; float oval = length(od);
        float ek = clamp(oval, 0., 1.);
        // the skin's facing, by place. The heap's own shape gives it a small part: up where it stands above the heap's
        // middle (which lifts toward the edge as the base does), down under it, outward at the edge. The billows give
        // it the greater part: two fields of the place, broad heaves and on them billows of a house's size, and the
        // skin leans as each field falls away, so that each has a side to the sun and a side away from it. No lump's
        // own facing is in it, so no join between lumps can show as a line in the light
        vec2 og = od * ov.zw; og *= smoothstep(.45, 1., ek) * .4 / max(length(og), 1e-5);
        vec3 nf = vec3(og.x, clamp((hk - .36 - .33 * min(oval * oval, 1.)) * 8., -1., 1.) * .5, og.y);
        vec3 qb = q * 1.35 + 11.; float b0 = vn3(qb);
        vec3 swell = vec3(vn3(qb + vec3(.3, 0., 0.)), vn3(qb + vec3(0., .3, 0.)), vn3(qb + vec3(0., 0., .3))) - b0;
        vec3 qh = q * .4 + 23.; float h0 = vn3(qh);
        vec3 heave = vec3(vn3(qh + vec3(.3, 0., 0.)), vn3(qh + vec3(0., .3, 0.)), vn3(qh + vec3(0., 0., .3))) - h0;
        vec3 nb = nf - swell * 9. - heave * 7.; nb /= max(length(nb), 1e-4);
        // crowns and tops in the sun, flanks, hollows and the level base in the heap's own shade, cool under and
        // paler toward the sky; the sea's glow warms what is turned down to it
        float lw = clamp(dot(nb, uSun) * .62 + .54, 0., 1.);
        float topness = clamp(nb.y * .5 + .5, 0., 1.);
        float crown = smoothstep(.05, .6, hk * .5 + topness * .55);
        // where either field stands high (a crown) the sun reaches sooner, and where it lies low later; and the
        // hollows between the billows keep at most two fifths of the sun whatever the hour. All of it is of the
        // place, so it is the same seen from above and from below
        float hollow = smoothstep(.3, .56, b0 * .55 + puff * .45);
        float sunny = smoothstep(.36, .62, lw + (puff - .5) * .3 + (b0 - .5) * .7 + (h0 - .5) * .6) * crown * mix(.4, 1., hollow);
        vec3 under = mix(uShade * .92 + .04, uSkyCol * .8, .25);
        vec3 shadeC = mix(under, vec3(.68, .74, .86), topness * .45);
        c = mix(shadeC, mix(vec3(1.), uSunCol, .5), sunny) * (.86 + .24 * b0);
        float gl = max(dot(nb, uGlowDir), 0.); c += uGlow * gl * .45 * (1. - sunny);
        // its skin breaks up toward the heap's edge, in bays and tongues: there only the tufts where the billows stand
        // highest are left, and well beyond the oval the last of them thin to nothing. For this cut the way out is
        // measured from the point's place held inside a room smaller than the heap's box (rl: that room's half
        // breadths, metres from the heap's middle; smaller than the box by 25 and 27 m for the floor, a little
        // more than a lump's half breadth, and by 12 and 14.5 m for the deck, two thirds of one), which is about
        // the room the lumps' middles have: so a lump that stands against the box's side is thinned as its middle
        // lies, and not more for its outer skin, and the heap keeps its cover. Of the house-size billows it is the
        // crowns that are left and the hollows that go first (b0 lowers the threshold where it stands high)
        float lobe = vn3(q * .42 + 17.);
        vec2 rl = vW.y > ${((ie.y1+te.y0)/2).toFixed(1)} ? vec2(33., 143.) : vec2(32., 58.);
        float oc = length(min(abs(vW.xz - ov.xy), rl) * ov.zw);
        float thr = mix(.3, .9, smoothstep(.3, 1., oc)) + .8 * smoothstep(1.15, 1.45, oval) + ((lobe - .5) * 1.7 - (b0 - .5) * .6 + (tuft - .5) * .45) * smoothstep(.15, .6, oc);
        // THE CUT IS ONE PIXEL SOFT: the skin's strength goes from nothing to whole across one pixel's own footprint
        // of the cut, no wider and no narrower. A pixel of that soft edge is laid ${Ge.back} m back in the depth
        // buffer, so that cloud lying close behind it is drawn whole through it and no sky shows in the seam
        float cut = a - thr; a = clamp(cut / max(fwidth(cut), 1e-4) + .5, 0., 1.);
        if (a <= 0.) discard;
        float ze = vZ.x - (a < 1. ? ${Ge.back}. : 0.);
        gl_FragDepth = .5 + .5 * (vZ.y * ze + vZ.z) / max(-ze, 1e-3);`:""}
        ${t?"":`// the thin cloud lying on the wall (its lumps are marked far along, and are no smoke) lets the roofs show through
        // it lies in the lanes between the terraces in rolls, thinning to nothing against the house fronts on either
        // hand and thickest in mid lane; above the roofs' height it is one bank again. (These lines are the bank's
        // alone: no lump of the level heaps is marked far along, so their drawing leaves them out.)
        vec2 pl = planOf(vW); float laneAt = mod(pl.x - ${le}., ${ae}.);
        float inLaneMist = smoothstep(5.2, 8.2, laneAt) * (1. - smoothstep(10.8, 13.8, laneAt));
        float rolls = smoothstep(.3, .72, puff) * (.45 + .55 * smoothstep(.3, .7, vn3(q * .45 + 5.)));
        a *= mix(1., .4 * rolls * mix(inLaneMist, 1., smoothstep(9., 13., pl.y)), step(390., vL.x) * (1. - step(.5, soft)));`}
        gl_FragColor = vec4(airFog(c, vW), ${t?"a":"a * smoothstep(0., 1., vL.x * .6 + (1. - min(soft, 1.)))"});
      }`,transparent:!0,depthWrite:!!t,side:x.DoubleSide})}async function ot(e,t,a,o,i,d,r,n){const h=Math.max(1,Math.round((o.x1-o.x0)/(i.x*1.25))),s=Math.max(1,Math.round((o.y1-o.y0)/(i.y*1.25))),l=Math.max(1,Math.round((o.z1-o.z0)/(i.z*1.25))),f=9,v=6,m=[];for(let u=0;u<h;u++){for(let p=0;p<s;p++)for(let w=0;w<l;w++){const g=a.range(.75,1.15),y=Math.min(i.x*g,(o.x1-o.x0)/2),b=Math.min(i.y*g,(o.y1-o.y0)/2),z=Math.min(i.z*g,(o.z1-o.z0)/2),S=he(ve(o.x0,o.x1,(u+a.range(.2,.8))/h),o.x0+y,o.x1-y),L=he(ve(o.y0,o.y1,(p+a.range(.2,.8))/s),o.y0+b,o.y1-b),F=he(ve(o.z0,o.z1,(w+a.range(.2,.8))/l),o.z0+z,o.z1-z);if(r&&!r(S,L,F))continue;let T=b,q=L,k=0;if(n){k=he(n.of(S,F),0,1),T=b*(1-.6*k*k)*(.45+.55*Pe(-.5,.6,t.noise.n2(S*.045+11,F*.045-5)));const M=Math.max(o.y1-o.y0-2*T,0);q=o.y0+T+M*he(.6*k*k+.3*(.5+.5*t.noise.n2(S*.07-3,F*.07+8)),0,1)}m.length=0;for(let M=0;M<=v;M++)for(let A=0;A<=f;A++){const C=-Math.PI/2+Math.PI*M/v,E=Math.PI*2*A/f,R=Math.cos(C)*Math.cos(E),G=Math.sin(C),W=Math.cos(C)*Math.sin(E),U=1-.22*(.5+.5*t.noise.n3(S*.05+R*1.3,L*.05+G*1.3,F*.05+W*1.3));m.push([S+R*y*U,q+G*T*U,F+W*z*U,R,G,W])}for(let M=0;M<v;M++)for(let A=0;A<f;A++){const C=M*(f+1)+A,E=C+1,R=C+f+1,G=R+1;for(const W of[C,R,E,E,R,G]){const U=m[W],D=Math.hypot(U[3],U[4],U[5])||1;e.pos.push(U[0],U[1],U[2]),e.nor.push(U[3]/D,U[4]/D,U[5]/D),n?e.loc.push((U[1]-n.y0)/n.tall,k,d):e.loc.push(40,0,d)}}}await t.yield()}}const He={r0:1.5,r1:4.6,gap:.6,gapR:.6,beat:.9},Me={r0:2.8,r1:14,pow:.85,apart:.6,dwindle:.85,gap:.8,gapR:.5,gapEnd:1.4,beat:1.6},na={coal:".055, .045, .038",grey:".4, .37, .34",pale:.75,farPale:1.05,thinFrom:.6},Ee={size0:.6,size1:1.4,lump0:.8,lump1:1.12,off:.3};Ee.reach=Ee.size1*(Ee.lump1+Ee.off*Math.sqrt(3)/2);function eo(e,t,a,o,i,d,r,n,h){const s=[0];for(let p=1;p<t.length;p++)s.push(s[p-1]+t[p].distanceTo(t[p-1]));const l=s[s.length-1],f=(p,w)=>{let g=1;for(;g<t.length-1&&s[g]<p;)g++;return w.lerpVectors(t[g-1],t[g],he((p-s[g-1])/Math.max(s[g]-s[g-1],1e-6),0,1))},v=[];for(let p=0;p<l;p+=o(p/l))v.push(p);v.push(l);const m=new x.Vector3,u=new x.Vector3;for(let p=0;p<v.length-1;p++){const w=v[p]/l,g=v[p+1]/l,y=p===0?0:a(w),b=p===v.length-2?0:a(g);f(v[p],m),f(v[p+1],u);const z=e.pos.length/3;for(let S=0;S<=n;S++)for(let L=0;L<=h;L++){const F=-Math.PI/2+Math.PI*S/n,T=Math.PI*2*L/h;e.pos.push(m.x,m.y,m.z),e.next.push(u.x,u.y,u.z),e.dir.push(Math.cos(F)*Math.cos(T),Math.sin(F),Math.cos(F)*Math.sin(T)),e.puff.push(y,b,p,r),e.age.push(w,g,i,d)}for(let S=0;S<n;S++)for(let L=0;L<h;L++){const F=z+S*(h+1)+L,T=F+1,q=F+h+1,k=q+1;S>0&&e.idx.push(F,q,T),S<n-1&&e.idx.push(T,q,k)}}return v.length-1}function ra(e,t){return new x.ShaderMaterial({uniforms:{...e},vertexShader:`attribute vec3 aNext; attribute vec3 aDir; attribute vec4 aPuff; attribute vec4 aAge;
      varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vA; varying vec3 vC; varying vec3 vQ; uniform float uTime;
      float h11(float x) { return fract(sin(x * 127.1 + 3.7) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float h31(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float vn3(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
                   mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
      void main() {
        // aPuff: radius here, radius at the next station, the station's number, the line's own number
        // aAge: how far along its line this station is (0 the mouth .. 1 the end), the same for the next, the fire's kind, the beat in seconds
        float ph = uTime / max(aAge.w, .05) + h11(aPuff.w) * 7.;
        float f = fract(ph), id = aPuff.z - floor(ph) + aPuff.w * 131.;
        vec3 hs = vec3(h11(id), h11(id + 17.3), h11(id + 41.9));
        float age = mix(aAge.x, aAge.y, f);
        float R = mix(aPuff.x, aPuff.y, f) * (${Ee.size0.toFixed(2)} + ${(Ee.size1-Ee.size0).toFixed(2)} * hs.x);
        // each puff rides a little off the line, its own way, so the train's edge is never a ruled line
        vec3 c = mix(position, aNext, f) + (hs - .5) * (R * ${Ee.off.toFixed(2)} * smoothstep(0., .08, age));
        // its skin stands in and out in lumps that roll slowly round it
        vec3 roll = vec3(0., uTime * .13, 0.) + id * 3.31;
        float lump = ${Ee.lump0.toFixed(2)} + ${(Ee.lump1-Ee.lump0).toFixed(2)} * vn3(aDir * 1.7 + roll);
        vec3 w = c + aDir * (R * lump);
        vW = w; vN = aDir; vL = aDir * lump * 1.9 + roll; vA = vec3(age, aAge.z, hs.y);
        // THE COLUMN'S OWN BODY. Its axis here runs from this station to the next. vC is the way out from that axis to
        // this corner of the skin, in shares of the puff's radius: the column's own normal, the same on every puff that
        // passes. vQ is the corner's place in a field that belongs to the column and not to the puff: the way out from
        // the line in shares of the station's radius, and along the line the puff's own number and the corner's share
        // of a gap beyond it, laid off along one fixed slant; so the field travels up with the train, and two puffs
        // that touch read the same billow where their skins meet.
        // The gap that share is told in is reckoned at each station from that station's radius and share of the line
        // (the same formulas as the makers' gapAt:
        // ROPE_SMOKE's, STEAM_SMOKE's), and between two stations it goes evenly from the one to the other. So it does
        // not step when a puff passes a station, however the gaps grow or the last stretch is cut short. Between two
        // inner stations it is the gap the makers laid. On the first and the last stretch of every line it is not: the
        // station in the mouth and the one at the end carry no radius, so the gap told there is 0.60 m on a rope and
        // 0.80 m on a steamer, where the makers laid 1.50 and 2.20 at the mouth. (The axis
        // still turns at a station where the line bends, and there the field does step as a puff passes: at the
        // most .38 of the field's unit on a rope's puff, .22 on its flank, at the rope's sharpest bend of some 11
        // degrees; .17 on a steamer's. A billow of a puff's size is .59 of that unit across.)
        vec3 ax = aNext - position; ax /= max(length(ax), 1e-3);
        vec3 out0 = w - mix(position, aNext, f);
        float along = dot(out0, ax); out0 -= ax * along;
        vec2 lay = mix(vec2(${He.gap.toFixed(2)}) + ${He.gapR.toFixed(2)} * aPuff.xy,
          vec2(${Me.gap.toFixed(2)}) + aPuff.xy * mix(vec2(${Me.gapR.toFixed(2)}), vec2(${Me.gapEnd.toFixed(2)}), smoothstep(${(Me.apart-.25).toFixed(2)}, 1., aAge.xy)), step(.5, aAge.z));
        vQ = out0 * (1.1 / max(mix(aPuff.x, aPuff.y, f), .8)) + vec3(-.55, .6, -.4) * (aPuff.z - floor(ph) + along / mix(lay.x, lay.y, f)) + aPuff.w * 7.3;
        vC = out0 / max(R, 1e-3);
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
      }`,fragmentShader:`varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vA; varying vec3 vC; varying vec3 vQ; uniform float uTime;
      ${Oe}
      float h31(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float vn3(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(mix(h31(i), h31(i + vec3(1., 0., 0.)), f.x), mix(h31(i + vec3(0., 1., 0.)), h31(i + vec3(1., 1., 0.)), f.x), f.y),
                   mix(mix(h31(i + vec3(0., 0., 1.)), h31(i + vec3(1., 0., 1.)), f.x), mix(h31(i + vec3(0., 1., 1.)), h31(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
      void main() {
        vec3 n = vN / max(length(vN), 1e-4);
        vec3 toEye = cameraPosition - vW; vec3 v = toEye / max(length(toEye), 1e-3);
        float age = clamp(vA.x, 0., 1.), steam = step(.5, vA.y);
        // ONE BODY: the light falls on the column, not on each ball. The skin is lit by the way out from the column's
        // own axis, with a sixth of the puff's own normal left in it; so the side to the sun and the side in shade
        // run the column's length, and a puff's crown and its under side are lit as the flank they stand on
        vec3 nc = vC / max(length(vC), .25);
        vec3 nl = mix(n, nc, .84); nl /= max(length(nl), 1e-4);
        // the billows are the column's too (vQ): broad masses that span two or three puffs, and on them the billows
        // of a puff's own size, each with a side to the sun and a side away from it
        vec3 qb = vQ * 1.7; float b0 = vn3(qb), broad = vn3(vQ * .55 + 31.);
        vec3 swell = vec3(vn3(qb + vec3(.3, 0., 0.)), vn3(qb + vec3(0., .3, 0.)), vn3(qb + vec3(0., 0., .3))) - b0;
        vec3 qc = vQ * .55 + 31.;
        vec3 heave = vec3(vn3(qc + vec3(.3, 0., 0.)), vn3(qc + vec3(0., .3, 0.)), vn3(qc + vec3(0., 0., .3))) - broad;
        vec3 nb = nl - swell * 1.8 - heave * 4.; nb /= max(length(nb), 1e-4);
        float fine = vn3(vQ * 3.9 + 9.);
        float lw = clamp(dot(nb, uSun) * .62 + .46, 0., 1.);
        float sunny = smoothstep(.24, .86, lw + (fine - .5) * .14);
        float hollow = smoothstep(.2, .65, b0 * .75 + fine * .25);
        // coal smoke: brown-black and dense where it is born, warm grey as it spreads, near white where it thins
        float pale = ${t.pale.toFixed(2)} * mix(1., ${t.farPale.toFixed(2)}, steam);
        float k1 = smoothstep(0., mix(.2, .34, steam), age), k2 = smoothstep(mix(.16, .3, steam), 1., age);
        vec3 body = mix(vec3(${t.coal}), vec3(${t.grey}), k1); body = mix(body, vec3(.9, .89, .87), k2 * pale);
        body *= .88 + .24 * broad;
        vec3 lit = body * mix(vec3(1.), uSunCol, .45) * 1.12;
        // in its own shade a puff takes the sky from above all the same: its crown is paler than its underside
        float skyward = nb.y * .5 + .5;
        vec3 shade = body * (uShade * 1.1 + .1) * mix(.82, 1., hollow) * mix(.78, 1.2, skyward) + uSkyCol * (.05 * skyward);
        vec3 c = mix(shade, lit, sunny * mix(.7, 1., hollow));
        float gl = max(dot(nb, uGlowDir), 0.); c += uGlow * gl * .3 * (1. - sunny);
        // smoke between the eye and the sun lets the light through at its thin edges
        float facing = abs(dot(n, v));
        float through = max(dot(-v, uSun), 0.); through *= through;
        c += uSunCol * mix(.25, .6, age) * through * (1. - facing) * (1. - facing);
        // the puff's edge breaks into tufts; an old puff of a steamer's column is eaten away from its edge inward
        // (the chimneys' ropes are not: steam is 0 for them)
        float grainE = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);   // (BROUGHT IN: the published hash form, see this file's head)
        float thin = smoothstep(${t.thinFrom.toFixed(2)}, 1., age) * steam;
        float thr = mix(.4, .8, thin) + (grainE - .5) * .24;
        if (facing * (.82 + .9 * mix(b0, vn3(vL * 3.7 + 23.), .55)) < thr) discard;
        gl_FragColor = vec4(airFog(c, vW), 1.);
      }`})}const te={x0:110,x1:200,y0:355,y1:367,z0:425,z1:740},ie={x0:92,x1:206,y0:337,y1:353,z0:735,z1:905},la={x0:251,x1:261,y0:349,y1:371,z0:600,z1:715},Ge={deck:1.02,floor:1.04,back:80},pt=4.5,ia=7;Ae.push(async e=>{const{P:t,ctx:a,group:o,air:i,opts:d}=e,r={pos:[],nor:[],loc:[]},n={pos:[],nor:[],loc:[]},h=Math.tan(25*Math.PI/180)*(d.breeze||0),s=new x.Vector3,l={pos:[],next:[],dir:[],puff:[],age:[],idx:[]};let f=0;for(const M of t.chimneys){qe(M.s,M.z,De.tall-1.2,s);const A=dt(s.x,s.y,s.z,150,1.5,h,(te.y0+te.y1)/2+2),C=E=>ve(He.r0,He.r1,Math.sqrt(E));eo(l,A,C,E=>He.gap+He.gapR*C(E),0,He.beat,f++,5,8),await a.yield()}const v=52*tt,m=2.5,u=Math.tan(17*Math.PI/180)+1.2*h,p=v/3;for(const M of et){const A=tt,C=2.2,E=Math.round(m*v/C),R=dt(M.x+2*A*Math.cos(M.yaw),16.6*A,M.z-2*A*Math.sin(M.yaw),E,C,u,void 0),G=R[0].y,W=Math.max(R[R.length-1].y-G,.001);for(const D of R){const J=he((D.y-G)/W,0,1);D.z-=p*J*J,D.x+=6*J*Math.sin(D.y*.026+M.z),D.z+=4.5*J*Math.sin(D.y*.019+1.3+M.x)}const U=D=>(Me.r0+Me.r1*Math.pow(D,Me.pow))*(1-Me.dwindle*Pe(Me.apart,1,D));eo(l,R,U,D=>Me.gap+U(D)*ve(Me.gapR,Me.gapEnd,Pe(Me.apart-.25,1,D)),1,Me.beat,f++,4,7),await a.yield()}await a.yield();const w=a.rng.fork("cloud"),g=(te.x0+te.x1)/2,y=(te.z0+te.z1)/2,b=(te.x1-te.x0)/2,z=(te.z1-te.z0)/2,S=(M,A)=>(C,E,R)=>((C-(M.x0+M.x1)/2)/((M.x1-M.x0)/2*A))**2+((R-(M.z0+M.z1)/2)/((M.z1-M.z0)/2*A))**2<1+.3*a.noise.n2(C*.03+7,R*.03),L=M=>S(te,M),F=(M,A,C=M)=>({y0:C.y0,tall:C.y1-C.y0,of:(E,R)=>Math.sqrt(((E-(M.x0+M.x1)/2)/((M.x1-M.x0)/2*A))**2+((R-(M.z0+M.z1)/2)/((M.z1-M.z0)/2*A))**2)});await ot(n,a,w,te,{x:17,y:6,z:19},pt,L(Ge.deck),F(te,Ge.deck)),await a.yield(),await ot(n,a,w,{...te,x0:te.x0+8,x1:te.x1-8,y0:te.y0+3},{x:11,y:4.5,z:12},pt,L(.78),F(te,.78,te)),await a.yield();const T=r.loc.length/3;await ot(r,a,w,la,{x:4.5,y:6.5,z:9},2,(M,A,C)=>!je(t,xe(A),C));for(let M=T;M<r.loc.length/3;M++)r.loc[M*3]=400,r.loc[M*3+1]=.15,r.loc[M*3+2]=ia;const q=a.rng.fork("cloud floor");await ot(n,a,q,ie,{x:20,y:6.5,z:22},pt,S(ie,Ge.floor),F(ie,Ge.floor)),await ot(n,a,q,{...ie,x0:ie.x0+10,x1:ie.x1-10,y0:ie.y0+5},{x:12,y:4.5,z:13},pt,S(ie,.8),F(ie,.8,ie));const k=[Jt(i,!0),Jt(i,!1)];for(const[M,A]of[[0,n],[1,r]]){await a.yield();const C=new x.BufferGeometry;C.setAttribute("position",new x.Float32BufferAttribute(A.pos,3)),C.setAttribute("normal",new x.Float32BufferAttribute(A.nor,3)),C.setAttribute("aLocal",new x.Float32BufferAttribute(A.loc,3));const E=new x.Mesh(C,k[M]);E.frustumCulled=!1,E.matrixAutoUpdate=!1,E.renderOrder=3+M*2,o.add(E)}{await a.yield();const M=new x.BufferGeometry;M.setAttribute("position",new x.Float32BufferAttribute(l.pos,3)),M.setAttribute("aNext",new x.Float32BufferAttribute(l.next,3)),M.setAttribute("aDir",new x.Float32BufferAttribute(l.dir,3)),M.setAttribute("aPuff",new x.Float32BufferAttribute(l.puff,4)),M.setAttribute("aAge",new x.Float32BufferAttribute(l.age,4)),M.setIndex(l.idx);const A=new x.Mesh(M,ra(i,na));A.frustumCulled=!1,A.matrixAutoUpdate=!1,o.add(A)}});function mt(e,t){return new x.ShaderMaterial({uniforms:{...e,uPx:{value:450}},vertexShader:`attribute vec3 aCol; attribute float aSize; varying vec3 vC; varying vec3 vW; uniform float uPx;
      void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vC = aCol; vec4 p = projectionMatrix * viewMatrix * w;
        gl_Position = p; gl_PointSize = clamp(aSize * projectionMatrix[1][1] * uPx * .5 / max(p.w, .1), 1.5, 400.); }`,fragmentShader:`varying vec3 vC; varying vec3 vW;
      ${Oe}
      void main() { vec2 d = gl_PointCoord * 2. - 1.; float r2 = dot(d, d); if (r2 > 1.) discard;
        vec3 n = vec3(d.x, -d.y, sqrt(max(1. - r2, 0.)));
        float l = .55 + .45 * max(dot(n, vec3(-.5, .6, .6)), 0.);
        vec3 c = vC * l * (uSunCol * .8 + .35) * mix(.7, 1., slabShadow(vW));
        gl_FragColor = vec4(airFog(c, vW), ${t===2?".8 * (1. - r2) * (1. - r2 * .4)":t?".75 * (1. - r2 * .6)":"1."}); }`,transparent:!!t,depthWrite:!t})}const be={n:6,rise:12,period:2.4,drops:1500,basin:8.4,land:6.6},At=e=>1+(be.land-1)*e,Ct=e=>2.2+46*e*(1-e)-1.3*e;Ae.push(async e=>{const{P:t,ctx:a,group:o,air:i,opts:d}=e,r=Math.round(be.drops*he(d.detail||1,.5,1)),n=new Float32Array(r*3),h=new Float32Array(r*3),s=new Float32Array(r),l=a.rng.fork("jets"),f=new Float32Array(r),v=new Float32Array(r*2);for(let _=0;_<r;_++){f[_]=l(),v[_*2]=l.range(-.5,.5),v[_*2+1]=l.range(-.5,.5),s[_]=l.range(.22,.5);const $=l.range(.8,1);h[_*3]=.72*$,h[_*3+1]=.88*$,h[_*3+2]=1*$}const m=new x.BufferGeometry;m.setAttribute("position",new x.BufferAttribute(n,3)),m.setAttribute("aCol",new x.BufferAttribute(h,3)),m.setAttribute("aSize",new x.BufferAttribute(s,1));const u=mt(i,!0),p=new x.Points(m,u);p.frustumCulled=!1,p.matrixAutoUpdate=!1,p.renderOrder=6,o.add(p);const w=ye(t.fountain.s,{});await a.yield();const g={bunch:12,size:5.2},y=60,b=new Float32Array(y*3),z=new Float32Array(y*3),S=new Float32Array(y),L=[c.enamel,c.brick,c.plaster,c.sea,c.white],F=a.rng.fork("toys"),T=[],q=qe(t.square.s1-1,(t.square.z0+t.square.z1)/2,2,new x.Vector3),k=dt(q.x,q.y,q.z,150,2,0,void 0);e.toyRoad=k;for(let _=0;_<y;_++){const $=L[_%L.length];z[_*3]=$.r,z[_*3+1]=$.g,z[_*3+2]=$.b,S[_]=g.size,T.push({ph:Math.floor(_/g.bunch)*g.bunch/y+_%g.bunch*.0035+F.range(-.006,.006),oz:F.range(-22,22),ox:F.range(-2.5,2.5),oy:F.range(-2.5,2.5),wob:F()*6.283})}const M=new x.BufferGeometry;M.setAttribute("position",new x.BufferAttribute(b,3)),M.setAttribute("aCol",new x.BufferAttribute(z,3)),M.setAttribute("aSize",new x.BufferAttribute(S,1));const A=mt(i,!1),C=new x.Points(M,A);C.frustumCulled=!1,C.matrixAutoUpdate=!1,o.add(C),C.visible=!!d.rare;const E=Ve.n,R=new Float32Array(E*3),G=new Float32Array(E*3).fill(.95),W=new Float32Array(E),U=new x.BufferGeometry;U.setAttribute("position",new x.BufferAttribute(R,3)),U.setAttribute("aCol",new x.BufferAttribute(G,3)),U.setAttribute("aSize",new x.BufferAttribute(W,1));const D=mt(i,2),J=new x.Points(U,D);J.frustumCulled=!1,J.matrixAutoUpdate=!1,J.renderOrder=6,o.add(J);const N=ft(t),K=new x.Vector3,H=new x.Vector3,Z=new x.Vector2,ee=Math.PI*2;e.tick.push(_=>{a.renderer.getDrawingBufferSize(Z),u.uniforms.uPx.value=Z.y,A.uniforms.uPx.value=Z.y,D.uniforms.uPx.value=Z.y;for(let $=0;$<E;$++){const B=((_-$*Ve.every)%(E*Ve.every)+E*Ve.every)%(E*Ve.every),I=_-B,O=Xt(I,N.len)+3.2;qe(t.viaduct.s0+O*N.ds,t.viaduct.z0+O*N.dz,t.viaduct.h+5,K);for(let X=Ve.rise*B;X>0;X-=1.5)bt(K.x,K.y,K.z,H),K.addScaledVector(H,-Math.min(1.5,X));R[$*3]=K.x,R[$*3+1]=K.y+.5*Math.sin($*2.7+B),R[$*3+2]=K.z+.6*Math.sin($*1.9+B*1.3),W[$]=(2.2+1.05*B)*Math.min(1,(E*Ve.every-B)*.5)}U.attributes.position.needsUpdate=!0,U.attributes.aSize.needsUpdate=!0;for(let $=0;$<r;$++){const B=(_/be.period+f[$])%1,I=$%be.n,O=I/be.n*ee,X=Ct(B),Y=At(B),Q=Math.cos(O)*Y+v[$*2]*B,me=Math.sin(O)*Y+v[$*2+1]*B,Ne=t.fountain.s+Q;n[$*3]=w.gx+(Ne-t.fountain.s)*w.ax+X*w.ux,n[$*3+1]=w.gy+(Ne-t.fountain.s)*w.ay+X*w.uy,n[$*3+2]=t.fountain.z+me}if(m.attributes.position.needsUpdate=!0,d.rare){const $=k.length-1;for(let B=0;B<y;B++){const I=T[B],O=((_/40+I.ph)%1+1)%1*$,X=Math.min(Math.floor(O),$-1),Y=O-X,Q=k[X],me=k[X+1],Ne=Math.min(1,O/12);b[B*3]=ve(Q.x,me.x,Y)+I.ox*Ne,b[B*3+1]=ve(Q.y,me.y,Y)+I.oy*Ne+.4*Math.sin(_*ee/5+I.wob),b[B*3+2]=ve(Q.z,me.z,Y)+I.oz,S[B]=g.size*Math.min(1,O/4)*Math.min(1,($-O)/12)}M.attributes.position.needsUpdate=!0,M.attributes.aSize.needsUpdate=!0}})});const ca={x0:150,x1:215,y0:55,y1:95,z0:-15,z1:65},ha=[{x0:150,x1:212,y0:252,y1:300,z0:430,z1:492},{x0:150,x1:204,y0:326,y1:350,z0:572,z1:692}],fa={x0:198,x1:219,y0:318,y1:366,z0:688,z1:742},ua={x0:-260,x1:-40,y0:14,y1:80,z0:-250,z1:560},da=[{x0:150,x1:220,y0:358,y1:384,z0:775,z1:860},{x0:294,x1:352,y0:380,y1:420,z0:720,z1:856}];function to(e,t,a,o){const i=t*.42;e.tri([i*.5,0,0],[-i*.5,.12*t,0],[-i*.2,0,.1*t],a,0),e.tri([i*.5,0,0],[-i*.2,0,-.1*t],[-i*.5,.12*t,0],a,0),e.tri([i*.5,0,0],[-i*.2,0,.1*t],[-i*.2,0,-.1*t],a,0),e.tri([i*.25,.02,.05*t],[-i*.3,.02,.05*t],[-i*.1,.02,t/2],o,8),e.tri([i*.25,.02,-.05*t],[-i*.1,.02,-t/2],[-i*.3,.02,-.05*t],o,8),e.tri([-i*.5,.05,0],[-i*.85,.05,.08*t],[-i*.85,.05,-.08*t],a,0)}function at(e,t,a,o,i,d){const r=[];let n=null;for(let h=0;h<t;h++){if(h%d===0){const s=e.range(o,Math.min(i,(a.x1-a.x0)/2-4)),l=e.range(o,Math.min(i,(a.z1-a.z0)/2-4)),f=e.range(2,Math.min(12,(a.y1-a.y0)/2-4));n={a:s,b:f,c:l,cx:e.range(a.x0+s+3,a.x1-s-3),cy:e.range(a.y0+f+3,a.y1-f-3),cz:e.range(a.z0+l+3,a.z1-l-3),per:e.range(15,24)*(s+l)/50,ph:e()*6.283,tilt:e()*6.283,dir:e.sign()}}r.push({g:n,lag:e.range(0,.5),ox:e.range(-3,3),oy:e.range(-3,3),oz:e.range(-3,3)})}return r}const pa=Math.PI*2;function oo(e,t,a){const o=e.g,i=o.dir*(t*pa/Math.max(o.per,6))+o.ph-e.lag;return a.set(o.cx+o.a*Math.cos(i)+e.ox,o.cy+o.b*Math.sin(i+o.tilt)+e.oy,o.cz+o.c*Math.sin(i)+e.oz)}Ae.push(async e=>{const{ctx:t,group:a,town:o,opts:i}=e,d=(i.detail||1)*he(i.density||1,.8,1.2),r=Math.round(60*d),n=Math.round(20*d),h=Math.round(36*d),s=r+2*n+h,l=Math.round(40*d),f=Math.round(22*d),v=l+2*f;let m=new ne;to(m,1.7,new x.Color("#6E7682"),new x.Color("#A9B0BA"));const u=new x.InstancedMesh(m.build(),o,s);m=new ne,to(m,2.6,c.white,new x.Color("#DDE3E8"));const p=new x.InstancedMesh(m.build(),o,v);for(const k of[u,p])k.frustumCulled=!1,k.matrixAutoUpdate=!1,a.add(k);const w=at(t.rng.fork("pigeons"),r,ca,14,28,10);ha.forEach((k,M)=>{for(const A of at(t.rng.fork("wall pigeons "+M),n,k,12,26,10))w.push(A)});for(const k of at(t.rng.fork("clock pigeons"),h,fa,4.5,6.5,8))w.push(k);const g=at(t.rng.fork("gulls"),l,ua,18,60,5);da.forEach((k,M)=>{for(const A of at(t.rng.fork("rim gulls "+M),f,k,12,26,4))g.push(A)}),await t.yield();const y=new x.Vector3,b=new x.Vector3,z=new x.Vector3,S=new x.Vector3,L=new x.Vector3,F=new x.Vector3,T=new x.Matrix4,q=(k,M,A,C,E)=>{oo(A,C,y),oo(A,C+.05,b),z.subVectors(b,y),z.lengthSq()<1e-10&&z.set(1,0,0),z.normalize(),E?S.set(0,1,0):(bt(y.x,y.y,y.z,F),S.copy(F).multiplyScalar(-1)),L.crossVectors(z,S),L.lengthSq()<1e-8&&L.set(0,0,1),L.normalize(),S.crossVectors(L,z),T.makeBasis(z,S,L).setPosition(y),k.setMatrixAt(M,T)};e.tick.push(k=>{for(let M=0;M<s;M++)q(u,M,w[M],k,!1);for(let M=0;M<v;M++)q(p,M,g[M],k,M<l);u.instanceMatrix.needsUpdate=!0,p.instanceMatrix.needsUpdate=!0})}),Ae.push(async e=>{const{ctx:t,group:a,town:o,air:i,opts:d,P:r}=e,n=(d.detail||1)*(d.density||1),h=t.rng.fork("small"),s=e.houses.all.filter(C=>C.near),l=Math.min(s.length,Math.round(700*n)),f=Math.min(s.length,Math.round(400*n)),v=h.shuffle(s.slice()),m=[],u=[];for(const[C,E]of[[1,0],[0,1]])for(let R=0;R<4;R++){const G=R*2.25,W=G+2.25,U=.4+.36*R,D=.4+.36*(R+1),J=[[-U*C,G,-U*E],[U*C,G,U*E],[D*C,W,D*E],[-D*C,W,-D*E]];for(const N of[0,1,2,0,2,3])m.push(...J[N]),u.push(N===1||N===2?1:-1,J[N][1],0)}const p=new x.BufferGeometry;p.setAttribute("position",new x.Float32BufferAttribute(m,3)),p.setAttribute("aLocal",new x.Float32BufferAttribute(u,3));const w=new x.ShaderMaterial({uniforms:{...i},vertexShader:`attribute vec3 aLocal; varying vec3 vL; varying vec3 vW; varying vec3 vT; varying float vId; uniform float uTime;
      void main() { vec3 p = position; float id = float(gl_InstanceID); vId = id;
        float k = aLocal.y / 9.; p.x += sin(uTime * 1.3 + id * 1.3 + aLocal.y * .5) * 1.3 * k * k; p.z += cos(uTime * 1.1 + id * 2.1 + aLocal.y * .4) * 1.3 * k * k;
        vec3 across = mat3(modelMatrix * instanceMatrix) * (abs(position.x) > abs(position.z) ? vec3(1., 0., 0.) : vec3(0., 0., 1.));
        vT = across / max(length(across), 1e-6);
        vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.); vW = w.xyz; vL = aLocal; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`varying vec3 vL; varying vec3 vW; varying vec3 vT; varying float vId; uniform float uTime;
      ${Oe}
      float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }   // (BROUGHT IN: the published hash form, see this file's head)
      float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
      void main() {
        // metres of the model: y up the blade, wide its half width there, px the pixel's footprint on it
        float y = vL.y, k = clamp(y / 9., 0., 1.), wide = .4 + .16 * y;
        float px = max(fwidth(vL.x * wide), fwidth(y));
        // the smoke's own line: plumb in the pot, swinging wider the higher it is, the swing travelling up with the smoke
        float cu = (sin(y * 1.05 - uTime * 2.1 + vId * 2.7) * .22 + sin(y * 2.3 - uTime * 3.1 + vId * 5.1) * .08) * smoothstep(.03, .6, k);
        float d = (vL.x - cu) / .6;
        // the billows ride up with it, a broad scale and a fine one, their rows bent sideways
        vec2 p = vec2((vL.x - cu) * wide, y - uTime * 2.2);
        p.x += sin(p.y * 1.3 + vId) * .6 * k;
        vec2 p1 = p * vec2(.7, .38) + vId * 3.7;
        float n0 = vnoise(p1), n1 = n0, n2 = vnoise(p * vec2(2., 1.1) + vec2(17. + vId, uTime * .4));
        float f1 = smoothstep(.4, 1.2, px / 1.4), f2 = smoothstep(.4, 1.2, px / .5);
        n1 = mix(n1, .5, f1); n2 = mix(n2, .5, f2);
        float nn = n1 * .65 + n2 * .35;
        // dense at the pot, torn at the tip: the body thins and the billows bite deeper the higher it is
        float dens = (1. - d * d) * mix(1.25, .7, k) + (nn - .5) * mix(.5, 2.6, sqrt(k)) * mix(.3 + .7 * min(d * d, 1.), 1., k * k);
        float thr = mix(.25, .45, k), soft = mix(.18, .34, k);
        // it is thin air: whole only in its heart, thinner toward the cut (less so near the pot, where it is densest),
        // and streaked by the fine billows
        float a = smoothstep(thr - soft, thr + soft, dens) * mix(mix(.55, .3, k), 1., smoothstep(0., mix(.5, .9, k), dens - thr)) * (mix(.75, .6, k) + .8 * (n2 - .5) + .5 * (n1 - .5));
        // a blade seen on edge, or small on the screen, is too narrow to carry the plume's shape: the plume fades to
        // its own mean across the blade (reckoned from these same lines: .385 at the pot, .14 at the tip). The blade
        // is two of vL.x wide, so one over its width in pixels is half of vL.x's change from pixel to pixel: the
        // fade begins at .12 of that (a blade about 8 pixels wide) and is whole at .5 (2 pixels wide)
        float whole = smoothstep(.12, .5, fwidth(vL.x) * .5);
        a = mix(clamp(a, 0., 1.), mix(.385, .14, k), whole);
        a *= smoothstep(0., .05, k) * (1. - smoothstep(.72, 1., k)) * mix(.92, .42, smoothstep(.1, .75, k));
        // the flank turned to the sun is lit, the other lies in the smoke's own shade; each billow has its own two sides
        float slope = (vnoise(p1 + vec2(.3, 0.)) - n0) * (1. - f1);
        float lw = mix(clamp(.5 + (clamp(d, -1., 1.) * .9 - slope * 3.) * clamp(dot(vT, uSun) * 1.6, -1., 1.), 0., 1.), .5, whole);
        vec3 tone = mix(vec3(.6, .59, .58), vec3(.97), smoothstep(0., .4, k));
        vec3 c = tone * mix(uShade * 1.15 + .08, uSunCol * .5 + .5, lw * mix(.35, 1., slabShadow(vW)));
        gl_FragColor = vec4(airFog(c, vW), clamp(a, 0., 1.));
      }`,transparent:!0,depthWrite:!1,side:x.DoubleSide}),g=new x.InstancedMesh(p,w,Math.max(l,1));g.frustumCulled=!1,g.matrixAutoUpdate=!1,g.renderOrder=4,a.add(g);const y=new ne,b=[c.white,c.plaster,c.sea.clone().lerp(c.white,.4),c.enamel,c.white,c.brick.clone().lerp(c.white,.5)];y.box(0,0,-3.6,.26,4.7,.26,c.post,0,{top:!1}),y.box(0,0,3.6,.26,4.7,.26,c.post,0,{top:!1}),y.box(0,4.4,0,.08,.08,7.2,c.white,0,{top:!1});for(let C=0;C<5;C++){const E=-3.1+C*1.3,R=E+1,G=4.4,W=4.4-(1+.5*(C*7%3)/2);y.quad([0,G,E],[0,G,R],[0,W,R],[0,W,E],b[(C*5+1)%b.length],7)}const z=new x.InstancedMesh(y.build(),o,Math.max(f,1));z.frustumCulled=!1,z.matrixAutoUpdate=!1,a.add(z),await t.yield();const S=new x.Matrix4,L=new x.Vector3,F=[1,.8,.62,.46,.32],T={lit:.3,small:.52},q=C=>{const E=Math.round((C.s-le)/ae),R=Math.round((C.z-ue.z0)/V.plot-.5),G=t.core.hashSeed("pot:"+E+":"+R);if((G&65535)/65536>=T.lit)return 0;const W=(G>>>16)/65536;return T.small+(1-T.small)*W*W},k=(C,E,R,G)=>{for(let W=0;W<=9;W+=1.5){const U=W*G;qe(C,E,R+U,L);const D=W/9,J=(.4+.16*W+1.3*1.42*D*D)*G;if(e.path.distanceTo(L.x,L.y,L.z)<Math.hypot(J+2,e.path.length/640))return!1}return!0};let M=0;for(let C=0;C<v.length&&M<l;C++){const E=v[C],R=E.model%2?2.6:-2.6,G=Math.cos(E.yaw),W=Math.sin(E.yaw),U=q(E);if(!U)continue;const D=E.s+2.2*G+R*W,J=E.z-2.2*W+R*G,N=F.map(K=>U*K).find(K=>k(D,J,13*E.sy,K));if(N){if(E.yard){g.setMatrixAt(M++,S.makeScale(0,0,0));continue}g.setMatrixAt(M++,se(D,J,13*E.sy,0,N,S))}}g.count=M,await t.yield();const A=e.washing={mesh:z,candidates:[],most:0,hung:[],half:0,wide:0,low:1/0,high:-1/0};for(let C=0;C<y.p.length;C+=3){const E=y.p[C],R=y.p[C+1],G=y.p[C+2],W=y.k[C/3]===7?.42*he(4.4-R,0,1.6):0;A.half=Math.max(A.half,Math.abs(G)),A.wide=Math.max(A.wide,Math.abs(E)+W),A.low=Math.min(A.low,R),A.high=Math.max(A.high,R)}z.count=0;for(let C=0;C<v.length;C++){const E=v[v.length-1-C],R=Math.round((E.s-le)/ae),G=R%2?-1:1,W=E.s+G*9.5;if(W>ce-1||E.yard)continue;const U=Math.round((E.z-ue.z0)/V.plot-.5),D=ue.z0+(U+.5)*V.plot;je(r,W,D-3.6)||je(r,W,D+3.6)||A.candidates.push({s:W,z:D,place:Math.min(R,R+G)*1e3+U})}A.most=f});const vt={drops:900,dv:1.5,side:6.2};Ae.push(async e=>{const{ctx:t,group:a,air:o,opts:i}=e,d=Math.round(vt.drops*he(i.detail||1,.5,1)),r=new Float32Array(d*3),n=new Float32Array(d*3),h=new Float32Array(d),s=t.rng.fork("spray"),l=[],f=pe.v*Math.sin(pe.lean),v=pe.v*Math.cos(pe.lean),m=(v+Math.sqrt(v*v+2*pe.g*P.rimY))/pe.g;for(let y=0;y<d;y++){const b=s()<.7;l.push({ph:s(),span:b?s.range(2.5,6.5):m,dx:s.range(-1,1)*vt.dv,dy:s.range(-1,1)*vt.dv,z:s.range(-1,1)*vt.side}),h[y]=b?s.range(.35,1):s.range(.6,1.6);const z=s.range(.82,1);n[y*3]=.86*z,n[y*3+1]=.93*z,n[y*3+2]=1*z}const u=new x.BufferGeometry;u.setAttribute("position",new x.BufferAttribute(r,3)),u.setAttribute("aCol",new x.BufferAttribute(n,3)),u.setAttribute("aSize",new x.BufferAttribute(h,1));const p=mt(o,!0),w=new x.Points(u,p);w.frustumCulled=!1,w.matrixAutoUpdate=!1,w.renderOrder=6,a.add(w),await t.yield();const g=new x.Vector2;e.tick.push(y=>{t.renderer.getDrawingBufferSize(g),p.uniforms.uPx.value=g.y;for(let b=0;b<d;b++){const z=l[b],S=((y/z.span+z.ph)%1+1)%1*z.span;r[b*3]=P.wallX+(f+z.dx)*S,r[b*3+1]=P.rimY+(v+z.dy)*S-.5*pe.g*S*S,r[b*3+2]=P.canalZ+z.z*(1+.1*S)}u.attributes.position.needsUpdate=!0})});function Ue(e){const t=c.iron,a=c.white;e.box(0,0,0,.8,.6,.8,t,0),e.box(0,.6,0,.3,5.2,.3,t,0,{top:!1}),e.box(0,5.6,0,.22,.22,2.4,t,0);for(const o of[-1.05,1.05])e.stem(0,5.8,o,.2,.5,.5,6,a,0),e.stem(0,6.3,o,.5,0,.5,6,t,0)}function Lt(e){e.box(0,.45,0,.6,.1,2.4,c.wood,0,{bottom:!0}),e.box(.3,.55,0,.1,.6,2.4,c.wood,0);for(const t of[-1,1])e.box(0,0,t,.5,.45,.12,c.iron,0,{top:!1})}function Re(e,t){const a=c.white,o=c.post;e.box(0,0,0,2,1,3.4,c.wood,0);const i=[c.enamel,new x.Color("#A8322A"),new x.Color("#5E8F4E"),c.plaster];for(let d=0;d<4;d++)e.box(-.2,1,-1.2+d*.8,1.3,.3+.1*(d%2),.62,i[d],0);for(const[d,r,n]of[[-1.3,-1.9,2.5],[-1.3,1.9,2.5],[1.1,-1.9,3.3],[1.1,1.9,3.3]])e.box(d,0,r,.14,n,.14,o,0,{top:!1});for(let d=0;d<6;d++){const r=-2.1+d*.7,n=r+.7,h=d%2?a:t;e.quad([-1.6,2.45,r],[-1.6,2.45,n],[1.25,3.35,n],[1.25,3.35,r],h,6),e.quad([-1.6,2.45,n],[-1.6,2.45,r],[-1.6,2,r],[-1.6,2,n],d%2?t:a,6)}}function qt(e){const t=c.sea.clone().lerp(c.dark,.3);e.stem(0,0,0,1.5,1.5,3.1,8,t,0),e.stem(0,.9,0,1.56,1.56,1.5,8,c.plaster,0),e.stem(0,3.1,0,2.1,2.1,.25,8,c.white,0,!0),e.stem(0,3.35,0,1.9,0,1.7,8,c.slate,2),e.stem(0,4.9,0,.3,.3,.5,5,c.enamel,0,!0)}function ma(e){const t=c.iron,a=c.sky.clone().multiplyScalar(.8);e.box(0,.5,1.1,8.4,2.1,.12,a,0,{top:!1}),e.box(0,0,1.1,8.6,.5,.2,c.enamel,0);for(const o of[-4.2,0,4.2])e.box(o,0,1.1,.16,2.7,.16,t,0,{top:!1}),e.box(o,0,-1,.16,2.7,.16,t,0,{top:!1});e.box(0,2.7,0,9.2,.18,2.9,c.enamel.clone().lerp(c.white,.2),0,{bottom:!0}),e.box(0,.45,.7,6,.1,.5,c.wood,0,{bottom:!0})}const Be={len:10.1,high:4.4,sag:.7,flags:11},ze={edge:2,pitch:14,mid:7,lamps:11,lime:1.2,yardRow:13,yardLimes:[[-13,-12],[13,-12],[-13,2],[13,2]]},ao=e=>[0,1,2,3,4].map(t=>e.s1-ze.edge-t*ze.pitch);function va(e){const t=[new x.Color("#A8322A"),c.enamel,c.white,c.sea.clone().lerp(c.white,.25)],a=o=>Be.high-Be.sag*4*o*(1-o);for(let o=0;o<Be.flags;o++){const i=o/Be.flags,d=(o+1)/Be.flags,r=i*Be.len,n=d*Be.len;e.quad([0,a(i)+.05,r],[0,a(d)+.05,n],[0,a(d)-.05,n],[0,a(i)-.05,r],c.dark,0),e.tri([0,a(i),r+.08],[0,a(d),n-.08],[0,(a(i)+a(d))/2-1.3,(r+n)/2],t[o%t.length],7)}}Ae.push(async e=>{const{P:t,ctx:a,group:o,town:i}=e,d=new ne,r=new x.Matrix4,n=Math.PI/2,h=(k,M,A,C,E)=>{d.m=se(M,A,.08,C,1,r),k(d,E)},s=[new x.Color(Xe[(e.opts.gala||0)%Xe.length]),new x.Color("#A8322A"),c.sea.clone().lerp(c.dark,.2)],l=[],f=t.tramPlace,v=[f.z0+1.5,(f.z0+f.z1)/2,f.z1-1.5];let m=0;for(let k=f.s0+5;k<=f.s1-5;k+=12.5,m++){for(const M of v)h(Ue,k,M,0);for(let M=0;M<2;M++)l.push({s:k,z:v[M],yaw:0,stretch:(v[M+1]-v[M])/Be.len});if(k+12.5>f.s1-5)break;for(const M of[4,8.5])h(Re,k+M,f.z0+8,n,s[(m*2+(M>5?1:0))%3]),h(Re,k+M,f.z1-8.5,-n,s[(m*2+(M>5?2:1))%3]);h(Lt,k+6.25,f.z0+3.2,n),m%3===0&&h(ma,k+6.25,f.z1-3.4,Math.PI),m%3===1&&h(qt,k+6.25,(f.z0+f.z1)/2,0)}await a.yield();const u=t.square,p=t.carousel,w=t.fountain;for(let k=0;k<4;k++){const M=2+k*14;h(Ue,u.s0+2,u.z0+M,n),h(Ue,u.s1-2,u.z1-M,n),h(Ue,u.s0+M+14,u.z0+2,0),h(Ue,u.s1-M-14,u.z1-2,0)}for(let k=0;k<8;k++){const M=u.z0+6+k*6.8;h(Re,u.s0+6,M,Math.PI,s[k%3]),Math.hypot(u.s1-6-w.s,M-w.z)>be.basin+4&&h(Re,u.s1-6,M,0,s[(k+1)%3])}const g=13.2,y=[];for(let k=0;k<8;k++){const M=(k+.5)*Math.PI/4;y.push([p.s+g*Math.sin(M),p.z+g*Math.cos(M)])}for(let k=0;k<8;k++){const[M,A]=y[k],[C,E]=y[(k+1)%8];h(Ue,M,A,Math.atan2(C-M,E-A)+n),l.push({s:M,z:A,yaw:Math.atan2(C-M,E-A),stretch:Math.hypot(C-M,E-A)/Be.len})}for(let k=0;k<8;k++){const M=k*Math.PI/4,A=w.s+11.2*Math.sin(M),C=w.z+11.2*Math.cos(M);C>u.z1-2||A>u.s1-2||Math.hypot(A-p.s,C-p.z)<g+2.5||h(Lt,A,C,M-n)}h(qt,u.s0+12,u.z0+9,0),h(qt,u.s1-12,u.z0+9,0);for(let k=0;k<5;k++)h(Re,u.s0+20+k*5,u.z0+7.6,-n,s[k%3]),h(Re,u.s0+20+k*5,u.z0+10.4,n,s[(k+2)%3]);await a.yield();const b=(k,M,A,C,E)=>{d.m=se(M,A,0,C,1,r),k(d,E)},z=ao(u);for(let k=1;k<z.length;k++){b(Ue,z[k],u.z1+ze.lamps,n),l.push({s:z[k],z:u.z1-ze.edge,yaw:0,stretch:(ze.lamps+ze.edge)/Be.len});const M=(z[k-1]+z[k])/2,A=k%2===0;b(Re,M+4,u.z1+ze.mid,A?n:-n,s[(k-1)%3]),b(Re,M-4,u.z1+ze.mid,A?-n:n,s[k%3])}const S=t.mills[0];for(let k=0;k<4;k++)b(Re,S.s-9+k*6,S.z-ze.yardRow,-n,s[(k+2)%3]);d.m=null;const L=new x.Mesh(d.build(),i);L.frustumCulled=!1,L.matrixAutoUpdate=!1,o.add(L),await a.yield();const F=new ne;va(F);const T=new x.InstancedMesh(F.build(),i,l.length),q=new x.Vector3;l.forEach((k,M)=>{T.setMatrixAt(M,se(k.s,k.z,.9,k.yaw,q.set(1,1,k.stretch),r))}),T.frustumCulled=!1,T.matrixAutoUpdate=!1,o.add(T)});function wa(e){const t=c.wood.clone().multiplyScalar(.8),a=new x.Color(.058,.108,.045),o=oe.crown;e.stem(0,0,0,.26,.16,oe.trunk,3,t,0);const i=oe.top-2*o,d=(f,v,m)=>{const u=[];for(let p=0;p<6;p++){const w=(p+.5*f)*Math.PI/3,g=o*m*(.86+.26*Math.abs(Math.sin(p*2.4+f*1.3)));u.push([g*Math.cos(w),i+2*o*(v+.05*Math.sin(p*1.7+f)),g*Math.sin(w)])}return u},r=d(0,.3,.9),n=d(1,.68,.84),h=[0,i,0],s=[.2,oe.top,-.15],l=f=>a.clone().multiplyScalar(f);for(let f=0;f<6;f++){const v=(f+1)%6;e.tri(h,r[f],r[v],l(.72),14),e.tri(r[f],n[f],r[v],l(.92+.1*(f%2)),14),e.tri(r[v],n[f],n[v],l(1+.12*(f%3)/2),14),e.tri(n[f],s,n[v],l(1.16+.1*(f%2)),14)}}Ae.push(async e=>{const{P:t,ctx:a,group:o,town:i}=e,d=e.opts.detail||1,r=a.core.makeRng(a.core.hashSeed("gardens:"+a.seed)),n=[],h=new Set;let s=0;for(const b of e.houses.all){++s%400===0&&await a.yield();const z=r(),S=r(),L=r(),F=r(),T=r(),q=Math.round((b.s-le)/ae),k=q%2?-1:1;if(b.yard||(h.add(q*1e3+Math.round((b.z-ue.z0)/V.plot-.5)),z>=1/oe.every||T>=d))continue;const M=ue.z0+(Math.round((b.z-ue.z0)/V.plot-.5)+.5)*V.plot,A=b.s+k*(oe.wall+oe.tree),C=M-k*oe.aside,E=oe.small+(oe.big-oe.small)*L,R=oe.head*E,G=qe(A,C,oe.shoulder*E),W=N=>{const K=ye(N);return Math.abs((G.x-K.gx)*K.ax+(G.y-K.gy)*K.ay)},U=W(b.s),D=W(b.s+k*ae);U-R>=oe.eaves&&Math.hypot(Math.max(U-oe.kitchen,0),oe.gap)>=R&&D-R>=oe.kitchen&&!je(t,A,C)&&!Bt(t,A,C,oe.crown*E+re.clear)&&n.push({s:A,z:C,yaw:F*Math.PI*2,scale:E})}await a.yield();const l=Math.ceil(ue.plots/V.every),f=V.every-V.open-1;for(let b=0;b+1<ue.rows;b+=2){const z=le+b*ae+ae/2;for(let S=0;S<l;S++)for(const L of[-1,1]){const F=r(),T=r(),q=r(),k=S*V.every+(L<0?0:f);if(!h.has(b*1e3+k)&&!h.has((b+1)*1e3+k))continue;const M=ue.z0+(k+.5)*V.plot+L*(V.plot/2+oe.mouth),A=oe.great[0]+(oe.great[1]-oe.great[0])*T,C=oe.crown*A+re.clear;q<1/6||je(t,z,M)||M<P.z0+4||M>P.z1-4||Bt(t,z,M,C)||vo(t,z,M,C)||n.push({s:z,z:M,yaw:F*Math.PI*2,scale:A})}}ao(t.square).forEach((b,z,S)=>{z&&n.push({s:(S[z-1]+b)/2,z:t.square.z1+ze.mid,yaw:1.9*(z-1)+.7,scale:ze.lime})}),ze.yardLimes.forEach(([b,z],S)=>n.push({s:t.mills[0].s+b,z:t.mills[0].z+z,yaw:2.3*S+.2,scale:ze.lime})),await a.yield();const v=new ne,m=new x.Matrix4;wa(v);const u=new x.InstancedMesh(v.build(),i,Math.max(n.length,1));u.count=n.length;for(let b=0;b<n.length;b++){const z=n[b];u.setMatrixAt(b,se(z.s,z.z,0,z.yaw,z.scale,m)),b%300===299&&await a.yield()}u.frustumCulled=!1,u.matrixAutoUpdate=!1,o.add(u),await a.yield();const p=e.washing,w=.3,g=oe.sway*Math.hypot(1,.6),y=(b,z)=>{let S=0;for(let L=0;L<v.p.length;L+=9)for(let F=0;F<3;F++){const T=L+F*3,q=L+(F+1)%3*3,k=v.k[L/3]===14?g:0,M=v.p[T],A=v.p[T+1],C=v.p[T+2],E=v.p[q],R=v.p[q+1],G=v.p[q+2];for(const W of R===A?[0,1]:[he((b-A)/(R-A),0,1),he((z-A)/(R-A),0,1)]){const U=A+(R-A)*W;U>b-1e-6&&U<z+1e-6&&(S=Math.max(S,Math.hypot(M+(E-M)*W,C+(G-C)*W)+k*U))}}return S};if(p){const b=y(0,oe.top),z={},S={},L=q=>{for(const k of n){const M=Math.max(Math.abs(q.z-k.z)-p.half,0);if(M>=b*k.scale+w)continue;ye(k.s,z),ye(q.s,S);let A=1/0,C=-1/0,E=1/0,R=-1/0;for(const G of[-p.wide,p.wide])for(const W of[p.low,p.high]){const U=S.gx+G*S.ax+W*S.ux-z.gx,D=S.gy+G*S.ay+W*S.uy-z.gy,J=U*z.ax+D*z.ay,N=U*z.ux+D*z.uy;A=Math.min(A,J),C=Math.max(C,J),E=Math.min(E,N),R=Math.max(R,N)}if(Math.hypot(Math.max(A,-C,0),M)<y((E-w)/k.scale,(R+w)/k.scale)*k.scale+w)return!1}return!0},F=new Set;let T=0;for(const q of p.candidates){if(p.hung.length>=p.most)break;++T%40===0&&await a.yield(),!(F.has(q.place)||!L(q))&&(F.add(q.place),p.mesh.setMatrixAt(p.hung.length,se(q.s,q.z,0,0,1,m)),p.hung.push({i:p.hung.length,s:q.s,z:q.z}))}p.mesh.count=p.hung.length,p.mesh.instanceMatrix.needsUpdate=!0}});export{Oe as AIR_GLSL,ut as BALLOON,la as BANK,Le as BARGE,we as BOAT,Be as BUNTING,fe as CAROUSEL,_e as CASTERS,De as CHIMNEY,fa as CLOCK_BOX,te as DECK,Te as FLEET,ie as FLOOR,Xe as GALA,oe as GARDEN,ua as GULL_BOX,ne as Geo,Dt as HOURS,be as JET,Vt as JETTY,rt as LAKE,zt as LAKE_BOATS,jt as LAKE_JETTIES,P as LAND,pe as LEAP,ya as LIGHT,St as LUGGER_SCALE,ze as MARKET,it as MILL,ea as MOORED,ca as PIGEON_BOX,ue as PLAN,Ee as PUFF,na as PUFF_TONE,Qt as QUAY_SHIP,da as RIM_BOXES,He as ROPE_SMOKE,le as ROW0,ae as ROW_STEP,vt as SPRAY,Ve as STEAM,et as STEAMERS,tt as STEAMER_SCALE,Me as STEAM_SMOKE,lt as STEEPLE,V as STREET,ce as S_RIM,ke as S_WALL,c as TONE,j as TRAM,de as VIADUCT,Ie as WAKE,ha as WALL_BOXES,ht as WALL_THINGS,re as YARD,Pt as YARD_LIMES,Rt as YARD_TREES,ye as basisAt,vo as beforeYardGate,ba as buildDevice,Io as buildHouses,po as buildLand,Bo as buildSkyAndSea,Bt as byYard,wo as dealGraves,bt as downAt,qe as fold,mo as inYard,je as keptClear,kt as leapPoint,ho as makeAirUniforms,It as makePlaces,yt as makeTownMaterial,ao as marketPosts,Fe as ribbon,dt as riseLine,se as standAt,Po as steepleModel,Ut as thingAt,bo as thingGround,Xt as trainAt,Do as tramPairAt,Ht as tramTrackAt,ft as viaductLine,xe as yToS,xo as yardModel};
