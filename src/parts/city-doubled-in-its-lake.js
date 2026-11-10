import*as _ from"three";const mt=.32,H={LIME:0,TIMBER:1,STONE:2,SLATE:3,CLOTH:4,LEAF:5,GLASS:6,LAMP:7,ROOM:8,BOAT:9,ROCK:10,PAVE:11};function at(){const t=[],n=[],o=[],d=[],h=[],l=[];let m=0,L=[1,1,1],i=0;const b={kind(u){return m=u,b},col(u){return L=u,b},move(u){return i=u,b},get count(){return t.length/3},get triangles(){return l.length/3},vert(u,e,a,f,c,x,k=0,v=0,s=i,r=L){return t.push(u,e,a),n.push(f,c,x),o.push(r[0],r[1],r[2]),d.push(m,s),h.push(k,v),t.length/3-1},tri(u,e,a){l.push(u,e,a)},lift(u,e){for(let a=u*3+1;a<t.length;a+=3)t[a]+=e;return b},turn(u,e,a,f){const c=Math.cos(f),x=Math.sin(f);for(let k=u*3;k<t.length;k+=3){const v=t[k]-e,s=t[k+2]-a,r=n[k],w=n[k+2];t[k]=e+v*c-s*x,t[k+2]=a+v*x+s*c,n[k]=r*c-w*x,n[k+2]=r*x+w*c}return b},quad(u,e,a,f,c,x){if(!c){const M=e[0]-u[0],y=e[1]-u[1],S=e[2]-u[2],A=f[0]-u[0],R=f[1]-u[1],D=f[2]-u[2];let T=y*D-S*R,V=S*A-M*D,z=M*R-y*A;const I=Math.hypot(T,V,z)||1;c=[T/I,V/I,z/I]}const k=x||[0,0,1,0,1,1,0,1],v=b.vert(u[0],u[1],u[2],c[0],c[1],c[2],k[0],k[1]),s=b.vert(e[0],e[1],e[2],c[0],c[1],c[2],k[2],k[3]),r=b.vert(a[0],a[1],a[2],c[0],c[1],c[2],k[4],k[5]),w=b.vert(f[0],f[1],f[2],c[0],c[1],c[2],k[6],k[7]);return l.push(v,s,r,v,r,w),b},box(u,e,a,f,c,x,k=""){return k.includes("x")||b.quad([u,e,a],[u,e,x],[u,c,x],[u,c,a],[-1,0,0]),k.includes("X")||b.quad([f,e,x],[f,e,a],[f,c,a],[f,c,x],[1,0,0]),k.includes("y")||b.quad([u,e,a],[f,e,a],[f,e,x],[u,e,x],[0,-1,0]),k.includes("Y")||b.quad([u,c,x],[f,c,x],[f,c,a],[u,c,a],[0,1,0]),k.includes("z")||b.quad([f,e,a],[u,e,a],[u,c,a],[f,c,a],[0,0,-1]),k.includes("Z")||b.quad([u,e,x],[f,e,x],[f,c,x],[u,c,x],[0,0,1]),b},room(u,e,a,f,c,x,k=!1){return b.quad([u,e,x],[u,e,a],[u,c,a],[u,c,x],[1,0,0],[1,0,0,0,0,1,1,1]),b.quad([f,e,a],[f,e,x],[f,c,x],[f,c,a],[-1,0,0],[0,0,1,0,1,1,0,1]),k||b.quad([u,e,x],[f,e,x],[f,e,a],[u,e,a],[0,1,0],[0,1,1,1,1,0,0,0]),b.quad([u,c,a],[f,c,a],[f,c,x],[u,c,x],[0,-1,0],[0,0,1,0,1,1,0,1]),b.quad([u,e,a],[f,e,a],[f,c,a],[u,c,a],[0,0,1],[0,0,1,0,1,1,0,1]),b},build(){const u=new _.BufferGeometry;return u.setAttribute("position",new _.Float32BufferAttribute(t,3)),u.setAttribute("normal",new _.Float32BufferAttribute(n,3)),u.setAttribute("color",new _.Float32BufferAttribute(o,3)),u.setAttribute("aK",new _.Float32BufferAttribute(d,2)),u.setAttribute("uv",new _.Float32BufferAttribute(h,2)),u.setIndex(t.length/3>65535?new _.Uint32BufferAttribute(l,1):new _.Uint16BufferAttribute(l,1)),u}};return b}const ot=t=>{const n=new _.Color(t);return[n.r,n.g,n.b]},J=(t,n)=>[t[0]*n,t[1]*n,t[2]*n],ht=(t,n,o)=>[t[0]+(n[0]-t[0])*o,t[1]+(n[1]-t[1])*o,t[2]+(n[2]-t[2])*o],pt=980,St=`
uniform vec4 uBreath;   // xy = the air's bearing (unit), z = speed m/s, w = half width m
// five bands cross the bay with the air, each at its own speed, each broken along its length into patches; the
// law repeats every ${pt} m along the bearing, so a band that leaves on one side is the one that comes in
float breathBand(vec2 xz, float t) {
  float s = dot(xz, uBreath.xy), c = dot(xz, vec2(-uBreath.y, uBreath.x)), sum = 0.;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    float centre = t * uBreath.z * (0.74 + 0.13 * fi) + 137. + 211. * fi;
    float a = (mod(s - centre + ${pt/2}., ${pt}.) - ${pt/2}.) / (uBreath.w * (0.75 + 0.14 * fi));
    float pt = 0.5 + 0.5 * sin(c * 0.021 + 2.4 * fi + 1.3 * sin(c * 0.0083 + fi));
    sum += exp(-min(a * a, 30.)) * smoothstep(0.22, 0.55, pt);
  }
  return min(sum, 1.4);
}`,Wt=`
attribute vec3 color; attribute vec2 aK;
#ifdef INST
attribute vec4 iA; attribute vec3 iC;
#endif
uniform float uTime, uSide, uNight, uHand; uniform vec3 uSunDir;
${St}
varying vec3 vP, vN, vC, vL, vV; varying vec2 vK, vUv; varying vec4 vA; varying float vSunF;
void main() {
  vec3 p = position, n = normal;
  vSunF = 1.;
  vec4 A = vec4(0.); vec3 tint = vec3(1.);
  #ifdef INST
  A = iA; tint = iC;
  #endif
  float kind = aK.x, w = aK.y, ph = A.x * 6.2832;
  vL = position;
  if (kind > 3.5 && kind < 4.5) {
    // cloth: w = 0 at the rod, 1 at the hem
    float amp = w * w * (0.26 + 0.2 * A.z);
    float s1 = sin(uTime * (0.8 + 0.5 * A.z) + ph + p.y * 0.9), s2 = sin(uTime * 0.37 + ph * 1.7 + p.x * 1.3);
    p.z += amp * (0.62 * s1 + 0.38 * s2);
    p.x += amp * 0.34 * sin(uTime * 0.53 + ph * 2.3 + p.y * 1.1);
    // (round 5, C6) A PENNANT ON A MAST (the instance's second figure is 1; it is laid on its side, the rod at
    // the mast). (Round 5 flew it level with a quick wave running out along it.)
    // (round 5 mending 2, the guard: a level pennant reads as a floating beam, and the lake is windless.) A PENNANT
    // HANGS FROM ITS MAST IN A SOFT SAG AND LIFTS SLOWLY, each on its own clock: it curls down from the mast in an
    // arc, its fly from 100 degrees under the level (hanging) to 46 (lifted), never level; no quick wave runs in it
    #ifdef INST
    // (ROUND 5 MENDING 4, the guard: that arc read as a white crescent, a sickle.) A PENNANT HANGS STRAIGHT DOWN
    // from its yard, a strip of cloth: the whole strip sways from the yard as one straight line, a few degrees
    // on a slow clock of its own (its free end a metre to and fro), and one soft fold and a half travels down it;
    // never an arc
    if (A.y > 0.5) {
      float Ly = length(instanceMatrix[1].xyz), sw = 0.2 * sin(uTime * (0.34 + 0.1 * A.z) + ph) + 0.06 * sin(uTime * 0.83 + ph * 2.1);
      p.z += Ly * w * sw + 0.13 * w * sin(w * 8. - uTime * 0.7 + ph);
      p.x += 0.35 * w * sin(uTime * 0.27 + ph * 1.3);
    }
    #endif
  } else if (kind > 6.5 && kind < 7.5) {
    // lamp on its chain: the pivot is the local origin, the lamp hangs toward -y
    // (ONLY A HUNG LAMP SWINGS (an instance). A lantern's glass built into the merged mesh has no local origin:
    // it swung by its height over the plane, 1.4 m to and fro on the high street, and stood beside its post
    // like a lamp on a cross arm. It keeps to its seat now)
    #ifdef INST
    p.x += -p.y * 0.07 * sin(uTime * 1.25 + ph);
    p.z += -p.y * 0.05 * sin(uTime * 0.93 + ph * 1.3);
    #endif
  } else if (kind > 8.5 && kind < 9.5) {
    // boat: roll about its length (local z) and bob
    float th = 0.04 * sin(uTime * 0.8 + ph);
    p.y += p.x * th + 0.02 * sin(uTime * 0.61 + ph * 1.9);
    p.x -= p.y * th;
  } else if (kind > 4.5 && kind < 5.5) {
    p.x += w * 0.022 * sin(uTime * 0.7 + ph + p.y * 0.21);
    p.z += w * 0.015 * sin(uTime * 0.53 + ph * 1.4);
  }
  vec4 cp = vec4(p, 1.);
  #ifdef INST
  cp = instanceMatrix * cp; n = mat3(instanceMatrix) * n;
  // the open front of a room looks along its own +z: the sun enters by the front only
  // (a column of no length, an instance scaled away, is no bearing: its length is guarded)
  vec3 zc = mat3(instanceMatrix) * vec3(0., 0., 1.);
  vSunF = dot(zc / max(length(zc), 1e-5), uSunDir);
  #endif
  // the breath of air shivers the lower city where its band passes (by place and clock)
  float sh = (0.5 - 0.5 * uSide) * breathBand(cp.xz, uTime);
  cp.x += sh * 0.07 * sin(cp.y * 7. + uTime * 9.); cp.z += sh * 0.07 * sin(cp.y * 6.3 + uTime * 8.1 + 1.7);
  // (round 4, B3) WHERE A PATCH OF LONG RIPPLES PASSES THE DOUBLE BENDS SOFTLY, by day: the lower city sways there
  // by 6 cm at most, slowly, in waves 3.5 m long up its height (the same drifting patches as the sheet's near
  // ripples); between the patches it stands clear and at rest
  // (round 5 mending 1: THE LENS-KEYED BEND OF ROUND 5, C1 IS GONE WHOLE. It followed the lens, which is what a
  // reflection does; the lower city is a built city and no law here moves a built point by the lens. The breath
  // band above and these drifting patches, which go by place and clock, are all that sways it)
  float rbK = (0.5 - 0.5 * uSide) * (1. - uNight) * smoothstep(0.2, 0.8, sin(dot(cp.xz, vec2(0.021, 0.013)) + uTime * 0.25) * sin(dot(cp.xz, vec2(-0.012, 0.019)) - uTime * 0.18));
  cp.x += rbK * 0.06 * sin(cp.y * 1.8 + uTime * 1.6 + cp.z * 0.3); cp.z += rbK * 0.06 * sin(cp.y * 1.6 + uTime * 1.3 + cp.x * 0.3);
  // a room's things (w = 2) keep their own colours; the cover and the carpet (red below zero) take the dealt colour
  vP = cp.xyz; vN = normalize(n); vC = color.r < -0.5 ? tint : (A.w > 1.5 || (kind > 8.5 && kind < 9.5 && w > 0.5) ? color : color * tint); vK = aK; vUv = uv; vA = A;
  // (round 5, A1) the house's wall behind a gallery (a room's face flagged 2 or 3) is painted in metres: the room's
  // own width, height and depth go with it in place of the face's uv (x: width, y: height; flag 3: x is the depth)
  #ifdef INST
  // (round 5 mending 2: on every face of a room, so the back wall can be painted in metres too)
  if (kind > 7.5 && kind < 8.5) vUv = vec2(length(instanceMatrix[w > 2.5 ? 2 : 0].xyz), length(instanceMatrix[1].xyz));
  #endif
  vec4 mv = viewMatrix * modelMatrix * cp;
  vV = mv.xyz;
  gl_Position = projectionMatrix * mv;
}`,kt=`
uniform vec3 uSkyTop, uSkyHor, uSunDir, uSunGlow;
vec3 skyLaw(vec3 d) {
  float h = clamp(d.y, 0., 1.);
  vec3 c = mix(uSkyHor, uSkyTop, 1. - pow(max(1. - h, 0.), 3.2));
  float s = max(dot(normalize(d), uSunDir), 0.);
  // a clear morning gradient: a warm band low on the sun's side, a soft glow about the sun (nothing blown out)
  c += uSunGlow * (0.3 * pow(s, 4.) * (1. - 0.7 * h) + 0.32 * pow(s, 40.));
  // (round 3, A3) NOTHING FLAT AND PALE: by the warmth of the hour's glow (red over blue: none by night, next
  // to none at noon) the low sky on the sun's side goes to peach and gold, the low sky across from the sun to a
  // band of rose under the blue (the first hour's sky seen with the sun behind), and both fade out by a quarter
  // of the way up
  float warm = min(1., 1.3 * max(uSunGlow.r - uSunGlow.b, 0.));
  float sa = max(0.5 + 0.5 * dot(normalize(d.xz + 1e-5), normalize(uSunDir.xz + 1e-5)), 0.);
  // (square to the sun the low sky was a flat pallor: both bands reach round to meet there)
  // (round 5, B1: bolder: the peach and gold stand higher (a third of the way up) and fuller on the sun's side;
  // the water's sheen takes the same law, so the lake carries that gold toward the sun)
  c = mix(c, vec3(1.06, 0.72, 0.4), warm * 0.86 * pow(max(1. - h, 0.), 4.2) * pow(sa, 1.2));
  c = mix(c, vec3(0.86, 0.6, 0.62), warm * 0.46 * pow(max(1. - h, 0.), 5.) * (1. - sa) * smoothstep(0., 0.06, h));
  return c;
}`,Mt=`
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }`,Qt=`
uniform float uTime, uSide, uHand, uLampGain, uJoin, uNight, uLake;
uniform vec3 uSunCol, uAmbSky, uAmbGround, uTone;
uniform vec4 uHaze, uShadeRect;
uniform sampler2D uShade;
uniform sampler2D uOcc; uniform vec4 uOccRect;
${kt}
${Mt}
varying vec3 vP, vN, vC, vL, vV; varying vec2 vK, vUv; varying vec4 vA; varying float vSunF;
void main() {
  vec3 N = normalize(vN), alb = vC, emis = vec3(0.);
  float vDist = length(vV);
  float kind = vK.x, indoor = clamp(vA.w, 0., 1.), ao = 1., two = 0.;
  // a face's own two axes in the city's space (along the wall, up it; or the plan on a floor)
  vec2 tang = abs(N.y) > 0.6 ? vP.xz : vec2(dot(vP.xz, normalize(vec2(-N.z, N.x) + 1e-5)), vP.y);
  float fw = clamp(1. - vDist / 90., 0., 1.);
  float gq = fwidth(tang.x / 0.17);
  float n1 = vn(tang * vec2(0.9, 0.11) + 3.1), n2 = vn(tang * 2.3);
  float sunCut = 1., vineK = 0., outW = 0., wdK = 0., wdF = 0.;
  vec3 wdC = vec3(0.);
  if (kind > 13.5) {
    // A BASTION'S WALL (kind WALL; vUv.x = metres along it, vUv.y = 0 at its foot and 1 at its head, vK.y = its
    // height there): to each bay of 6.4 m a pilaster and between them a tall blind arch, recessed, hung 2.6 m under
    // the head; a string course and a coping. The relief is drawn by its own light: the recess is a tone deeper,
    // and where the sun rakes along the wall the arch's sunward jamb and head and each pilaster throw their shadow.
    // (vUv.y = metres over the wall's foot. Where the head slopes, as on the rising street and the lanes' flights,
    // each bay's arch is hung level from the height at the bay's own middle: the arches step up with the slope)
    float Hl = vK.y, h = vUv.y, bx = (fract(vUv.x / 6.4) - 0.5) * 6.4, aR = 2.0;
    float du2 = dFdx(vUv.x) * dFdx(vUv.x) + dFdy(vUv.x) * dFdy(vUv.x);
    float Hc = Hl - bx * (dFdx(Hl) * dFdx(vUv.x) + dFdy(Hl) * dFdy(vUv.x)) / max(du2, 1e-8), hsp = Hc - 2.6 - aR;
    vec2 T = normalize(vec2(-N.z, N.x) + 1e-5);
    float sg = sign(dFdx(vUv.x) * dFdx(tang.x) + dFdy(vUv.x) * dFdy(tang.x));
    float rake = dot(T, uSunDir.xz) * sg, rk = clamp(abs(rake) * 1.6, 0., 1.), sw = sign(rake) * rk;
    float ad = h < hsp ? abs(bx) : length(vec2(bx, h - hsp));
    // (under the lanes' lower flights the wall stood blank beside the line where it comes to the quay: a bay whose
    // head is 5.2 m and more carries its blind arch (it was 7 m), a low one under a low head)
    float inA = step(5.2, Hc) * (1. - smoothstep(aR - 0.07, aR + 0.07, ad)) * step(0.25, h);
    vec2 q = vec2(bx + sw * 0.9, h + 0.32);
    float adq = q.y < hsp ? abs(q.x) : length(vec2(q.x, q.y - hsp));
    float below = 1. - step(Hl - 1.5, h), pil = smoothstep(2.55, 2.65, abs(bx)) * below;
    float shA = inA * step(aR, adq), shP = (1. - pil) * below * step(2.6, abs(bx + sw * 0.7));
    // (mending 5, step 3a: under a lane's flight the string course and its shade ran as a ruled
    // dark bar down the wall beside the lens.) Where the head climbs steeper than one in three (the flights; the
    // rising street is one in five and keeps it) no string course is drawn: the stepped parapet is the stair's line
    float lvl = 1. - smoothstep(0.3, 0.45, abs(dFdx(Hl) * dFdx(vUv.x) + dFdy(Hl) * dFdy(vUv.x)) / max(du2, 1e-8));
    float band = lvl * step(Hl - 1.5, h) * step(h, Hl - 1.1), under = lvl * step(Hl - 1.78, h) * below, cope = step(Hl - 0.28, h);
    // (the recess a quarter darker and the pier a tenth lighter, to read from across the lake)
    // (ROUND 5 MENDING 5, step 1a: in shade the relief was too faint to read, the wall one plane.) THE RECESS IS
    // SHADOWED: a third darker, and darker yet in the half metre under the arch's head and by its jambs (the
    // shade a recess keeps without the sun); the pier a seventh lighter
    alb *= (1. - 0.34 * inA - 0.16 * inA * smoothstep(aR - 0.55, aR, ad)) * (1. + 0.14 * pil) * (1. + 0.1 * band + 0.14 * cope) * (1. - 0.24 * under);
    sunCut = 1. - 0.78 * max(max(shA, shP), under);
    // (round 5, A4) NO LARGE BLANK WALL: GREEN HANGS AND CLIMBS on a bastion's wall. In about a third of its bays
    // a curtain of leaves hangs from the coping, 1.5 to 8 m long at the bay's middle with a ragged hem; in about
    // a third green climbs from the foot beside the arch; the rest are bare stone (by the bay's own figure)
    // (the lead's eye: the green stood as large angular patches, a triangle beside the islet, zigzags like cut
    // paper over the opening. It is A TRAILING FRINGE UNDER THE COPING and nothing else: in one bay in four, never
    // wider than its bay (it dies away toward the pilasters), hanging a fifth of the wall's height at most (0.6
    // to 3.6 m), its lower edge soft and broken by a small leaf noise; none climbs from the foot)
    float hv = h21(vec2(floor(vUv.x / 6.4), 3.7)), bxr = abs(bx) / 3.2;
    float depV = min(0.2 * Hl, 0.6 + 2.2 * vn(vec2(vUv.x * 0.8, 2.)) + 0.9 * vn(vec2(vUv.x * 2.9, 5.))) * (0.55 + 0.45 * vn(vUv * 1.3));
    float hang = step(hv, 0.25) * (1. - smoothstep(0.45, 0.95, bxr)) * (1. - smoothstep(-0.45, 0.45, (Hl - h) - depV * (1. - bxr * bxr)));
    vineK = hang * step(6., Hl) * smoothstep(0.1, 0.3, Hl - h);
    sunCut = mix(sunCut, 1., vineK);
    // (ROUND 5 MENDING 5, step 1a) HERE AND THERE A DOORWAY OR A SHUTTERED WINDOW in a blind arch's recess, on the
    // walls that stand on a terrace (their foot over the plane): in one bay in five a plank door 1.5 by 2.4 m, in
    // one in four a shuttered window 1.2 by 1.6 m higher up, each in a surround of paler stone (laid over the stone)
    float hd = h21(vec2(floor(vUv.x / 6.4), 8.3)), onT = step(7., Hc) * step(0.5, vP.y - h), hw = clamp(hsp * 0.55, 3.4, 7.);
    float dK = step(hd, 0.2), wK = step(0.55, hd) * step(hd, 0.8);
    float dIn = step(abs(bx), 0.75) * step(0.25, h) * step(h, 2.65), dFr = step(abs(bx), 0.93) * step(0.25, h) * step(h, 2.83);
    float wIn = step(abs(bx), 0.6) * step(hw, h) * step(h, hw + 1.6), wFr = step(abs(bx), 0.76) * step(hw - 0.2, h) * step(h, hw + 1.76);
    wdK = onT * (dK * dIn + wK * wIn); wdF = onT * (dK * dFr + wK * wFr) * (1. - wdK);
    wdC = dK > 0.5 ? vec3(0.2, 0.13, 0.08) * (0.78 + 0.22 * step(0.12, fract(bx / 0.25 + 0.5)))
      : (hd < 0.68 ? vec3(0.17, 0.27, 0.2) : vec3(0.19, 0.27, 0.37)) * (1. - 0.2 * step(fract(h * 4.5), 0.12) * fw) * (1. - 0.5 * step(abs(bx), 0.03));
  }
  if (kind > 12.5 && kind < 13.5) {
    // a far arcade: the round arch of each bay is cut out of the stone panel; a paler ring of voussoirs round it
    float ax = (fract(vUv.x) - 0.5) * vK.y, aR = min(vK.y * 0.5 - 0.42, 1.7), asp = 2.5 - aR;
    float ad = vUv.y < asp ? abs(ax) : length(vec2(ax, vUv.y - asp));
    if (ad < aR) discard;
    alb *= 1. + 0.14 * (1. - smoothstep(0.2, 0.26, ad - aR));
  }
  if (kind > 11.5 && kind < 12.5) {
    // the rail: turned balusters cut out of the panel, a solid top and foot; the gaps close with the pixel's footprint
    // (round 3, C6: the built balustrades (the streets', the terraces', the causeway's: the merged mesh) have
    // STONE BALUSTERS, stout and turned, 0.27 m apart; the galleries' own rails (instanced) are as they were)
    #ifdef INST
    float bx = abs(fract(tang.x / 0.17) - 0.5), v = clamp(vUv.y, 0., 1.);
    float hw = 0.13 + 0.11 * sin(v * 11.) * sin(v * 3.14159);
    #else
    float bx = abs(fract(tang.x / 0.27) - 0.5), v = clamp(vUv.y, 0., 1.);
    float hw = 0.2 + 0.15 * sin(v * 6.5 + 0.4) * sin(v * 3.14159);
    #endif
    hw = mix(hw, 0.5, smoothstep(0.3, 0.9, gq));
    // (round 5, B0, the lead's eye: behind a gallery's rail the dark shutters read as red or green speckle: the
    // lace of balusters one or two pixels apart over a dark leaf. A GALLERY'S RAIL CLOSES TO A PLAIN PANEL as soon
    // as its balusters are under three pixels apart; the built stone balustrades are as they were)
    // (the speckle was the wall's own, see the room's branch; closed from five pixels a baluster
    // the rails stood as heavy boards along the quay: they close between five and two and a half pixels a baluster)
    #ifdef INST
    hw = mix(hw, 0.5, smoothstep(0.2, 0.4, gq));
    #endif
    indoor = 0.;
    if (vA.w < 0.5) {
      if (v > 0.06 && v < 0.9 && bx > hw) discard;
      alb *= 0.8 + 0.3 * vn(vec2(tang.x * 0.7, tang.y * 13.)) * fw;
    } else {
      // a limewashed parapet: a coping, a stain under it, three small drain slots
      alb *= (0.86 + 0.18 * n1) * (1. - 0.25 * smoothstep(0.86, 0.9, v) * (1. - smoothstep(0.9, 0.94, v)));
    }
  } else if (kind < 0.5) {
    // limewash: long stains running down, a mottle, a darker foot
    alb *= 0.84 + 0.2 * n1 - 0.1 * n2 * fw;
  } else if (kind < 1.5 || (kind > 8.5 && kind < 9.5)) {
    alb *= 0.8 + 0.3 * vn(vec2(tang.x * 0.7, tang.y * 13.)) * fw + 0.1 * n2;
    // (mending 5, step 3c) THE JETTY'S DECK (the quad's second figure 7; vUv = metres along, across): planks
    // 0.26 m wide laid across, each of its own weathered tone with a dark seam between (both die away where a
    // plank is under a pixel wide), and along each side an edge beam 0.2 m wide, a tone deeper, with its own seam
    if (kind < 1.5 && vK.y > 6.5 && vK.y < 7.5) {
      float px = vUv.x / 0.26, pf = clamp(1.6 - fwidth(px) * 1.6, 0., 1.), eb = step(1.4, abs(vUv.y));
      float seam = step(fract(px), 0.1) * pf, tone = 0.84 + 0.32 * (h21(vec2(floor(px), 3.)) - 0.5) * pf;
      alb = vC * mix(tone * (1. - 0.5 * seam) * (0.92 + 0.16 * vn(vec2(vUv.x * 7., vUv.y * 0.9))), 0.62 + 0.1 * vn(vec2(vUv.x * 0.6, 7.)), eb);
      alb *= 1. - 0.45 * step(1.34, abs(vUv.y)) * (1. - eb);
    }
  } else if (kind < 2.5 || kind > 10.5) {
    // stone and paving: joints, staggered courses
    // (round 3, C1) PAVING IS OF SMALLER COURSED STONES (0.5 by 0.27 m), closer in tone to one another
    float pav = step(10.5, kind) * step(kind, 11.5) * step(0.6, abs(N.y));
    vec2 b = tang / mix(vec2(0.9, 0.42), vec2(0.5, 0.27), pav); b.x += 0.5 * floor(b.y);
    vec2 f = abs(fract(b) - 0.5);
    float joint = smoothstep(0.46, 0.5, max(f.x, f.y)) * fw;
    alb *= (0.86 + (0.22 - 0.1 * pav) * h21(floor(b)) * fw) * (1. - 0.4 * joint) * (0.9 + 0.2 * n1);
    // ON THE QUAY (6 m from the water's edge at 270 m, 1.2 m over the plane, and so again in the double): a pale
    // kerb of long stones at the edge, a damp darker margin behind it, a drain line 1.9 m in, and a worn paler
    // band where feet have gone, 3 to 4.6 m in
    float qd = length(vP.xz) - 270., onQ = pav * step(1.12, abs(vP.y)) * step(abs(vP.y), 19.3) * step(0., qd) * step(qd, 6.2);
    // (the rising street and the street on to the bridge have the same kerb, drain and worn band)
    float kerb = onQ * (1. - smoothstep(0.34, 0.38, qd));
    alb = mix(alb, alb * 1.16 / max(0.6, 1. - 0.4 * joint), kerb);
    alb *= 1. - onQ * (1. - kerb) * (0.2 * (1. - smoothstep(0.38, 1.5 + 0.5 * n1, qd)) + 0.34 * (1. - smoothstep(0.03, 0.06, abs(qd - 1.9))));
    alb *= 1. + 0.1 * onQ * smoothstep(2.8, 3.3, qd) * (1. - smoothstep(4.3, 4.9, qd)) * (0.5 + 0.5 * n1);
    if (kind < 2.5 || kind > 13.5) { vec2 b2 = tang / vec2(2.7, 1.26); b2.x += 0.5 * floor(b2.y); alb *= 0.9 + 0.18 * h21(floor(b2) + 7.); }
    // a weathered darker foot where a wall stands in the water (by its height over the plane; a green cast)
    if (abs(N.y) < 0.6 && kind > 1.5) alb *= mix(vec3(0.5, 0.57, 0.47), vec3(1.), smoothstep(0.15, 1.3 + 0.7 * n1, abs(vP.y)));
  } else if (kind < 3.5) {
    // (ROUND 5 MENDING 5, L6) A ROOF READS AS A ROOF FROM ABOVE, on every house: fine courses of slate (a third of
    // a metre, faint), and on a hipped roof's slopes (second figure 1) a shaded eave course and a cap along the
    // ridge and down each hip, paler than a dark roof and darker than a pale one
    float hipK = step(0.5, vK.y), row = fract(vUv.y * mix(9., 20., hipK));
    alb *= 0.8 + mix(0.25, 0.14, hipK) * row * fw + 0.12 * n2;
    float capR = max(smoothstep(0.555, 0.585, vUv.y), 1. - smoothstep(0.012, 0.035, min(vUv.x, 1. - vUv.x)));
    alb *= mix(1., mix(1.9, 0.58, smoothstep(0.13, 0.19, dot(vC, vec3(0.3, 0.5, 0.2)))), hipK * capR);
    alb *= 1. - hipK * 0.25 * (1. - smoothstep(0.015, 0.045, vUv.y)) * (1. - capR);
  } else if (kind < 4.5) {
    // cloth: plain fields in worn tones; some carry one pale band at the hem (no stripes anywhere)
    // (the guard: a striped awning, a red-and-white striped cloth beside the quay. The weave's ribs
    // stood as six pale stripes across every cloth, and the pale hem on a red cloth read red and white.) THE
    // CLOTH IS PLAIN: the ribs are a thirtieth, the hem band a faint one and none on a red cloth
    float st = step(0.84, vUv.y) * step(vUv.y, 0.95) * step(0.5, vA.w) * step(alb.r, 1.5 * alb.g);
    alb = mix(alb, vec3(0.86, 0.83, 0.72), st * 0.3);
    alb *= 0.97 + 0.03 * sin(vUv.x * 40.);
    alb *= 1. + (0.1 + 0.14 * vK.y) * sin(vUv.x * 6.5 + vUv.y * 2.2 + uTime * (1.7 + 0.5 * vA.z) + vA.x * 6.2832);
    two = 1.; indoor = 0.;
  } else if (kind < 5.5) {
    // leaves: dark green, never black (in shade the foliage takes half as much again of the sky's fill)
    // (round 3, C4: a crown has A LIT AND A SHADED SIDE: three tenths of the two-sided law, not all of it)
    alb *= 0.8 + 0.5 * vn(vP.xy * 3.1 + vP.z * 2.7); two = 0.3; ao = 1.5;
    // (stage F: the leaves stir: a dapple of light and dark travels through every crown, hedge and creeper)
    alb *= 1. + 0.22 * sin(uTime * 2.4 + 9. * vn(vP.xz * 0.9 + vP.y * 0.7) + vP.y * 2.1);
  } else if (kind < 6.5) {
    // the looking glass and the panes: the sky turned back, and a glint
    vec3 cam = vec3(cameraPosition.x * uHand, cameraPosition.y * uSide, cameraPosition.z);
    vec3 R = reflect(normalize(vP - cam), N); R.y = abs(R.y);
    alb = vec3(0.02); emis = skyLaw(R) * 0.8 + uSunGlow * 3. * pow(max(dot(R, uSunDir), 0.), 90.);
  } else if (kind < 7.5) {
    // (round 4, D1) NO HARD WHITE SPECKS ON THE QUAY: by day a burning lamp is amber, not a blown white square
    // (its light is held under the amber before the flicker is laid on it); by night it is as it was
    vec3 lampC = vC * vK.y * vA.y * uLampGain;
    lampC = mix(lampC, min(lampC, vec3(1.3, 0.82, 0.36)), 1. - uNight);
    emis = lampC * (0.88 + 0.12 * sin(uTime * 7.3 + vA.x * 40.) * sin(uTime * 3.1 + vA.x * 17.));
    #ifndef INST
    // a join's lantern, the bright line on a water stair, a chain's ring of light: they burn always (no instance)
    // (round 4, D1: by day at six tenths: warm, not white)
    emis = vC * vK.y * (0.82 + 0.08 * sin(uTime * 2.1 + vP.x * 0.7 + vP.z * 0.9)) * (1. - 0.4 * (1. - uNight));
    // (ROUND 5 MENDING 6, M3c: ONE LAW FOR EVERY RING OF LIGHT ON THE WATER BY NIGHT. A chain's ring (second figure
    // 2) lies half under the quay's face, so by night it stood on the dark water as a white crescent: by night it
    // is a fifth as bright, a ripple on dark water; by day it is as it was)
    emis *= 1. - 0.8 * uNight * step(1.5, vK.y);
    #endif
    alb *= 0.5;
  } else if (kind < 8.5) {
    // the room: boards on the floor, a pale ceiling, the back in deeper shade
    if (N.y > 0.6) { alb = vec3(0.55, 0.39, 0.2) * (0.8 + 0.3 * step(0.08, fract(vL.x * 9.)) * fw + 0.15 * n2); }
    else if (N.y < -0.6) { alb = vec3(0.82, 0.78, 0.68); }
    else { alb = mix(alb, vec3(0.62, 0.5, 0.4), 0.22 * step(0.03, vA.w) * step(vA.w, 0.47)) * (0.9 + 0.12 * n1); }
    ao = 0.5 + 0.5 * smoothstep(-0.5, 0.5, vL.z);
    indoor = 1.;
    // (round 5, A1) THE HOUSE'S WALL BEHIND THE GALLERY (the face flagged 2; vUv = the room's width and height in
    // metres): limewash in the house's tone; in every bay of about 4 m A WIDE DOORWAY with its two leaves folded
    // back on the wall, and beside it A WINDOW with a sill, its shutters open or closed (by the room's own
    // figures); a lintel over each, a threshold of stone. The openings are cut out: the room is seen through them
    // (from the west terrace the harbour's houses, seen from behind and from the side, were open
    // racks: no shell stands behind them, and a room's box seen FROM OUTSIDE showed its dark inside faces.) THE
    // BACK AND THE SIDE OF A HOUSE ARE WALL: a room's upright face seen from outside is the house's own wash, out
    // of doors, with a closed shutter of the house's tone to each half bay
    #ifdef INST
    if (!gl_FrontFacing && vK.y < 1.5 && abs(N.y) < 0.6 && vA.w > 0.03 && vA.w < 0.47) {
      float hkO = fract(vA.w * 23.7 + 0.13), xO = abs(fract((vL.x + vL.z) * 2.) - 0.5), yO = (vL.y + 0.5) * 2.7;
      vec3 shO = hkO < 0.35 ? vec3(0.17, 0.27, 0.2) : hkO < 0.65 ? vec3(0.19, 0.27, 0.37) : vec3(0.27, 0.17, 0.1);
      alb = mix(min(vC, vec3(0.9)) * (0.94 + 0.1 * n1), shO, step(xO, 0.2) * step(0.95, yO) * step(yO, 2.1));
      outW = 1.; N = -N; ao = 0.95; indoor = 0.; // (no lamp's wash on it: it stands out of doors, by day and night)
    }
    #endif
    // (round 5 mending 2, the guard) ONE THING OF THE ROOM STANDS PLAIN AGAINST ITS BACK WALL in each half bay, by
    // the room's own figures: a table under its cloth with a jug, a bed's foot and head, a wardrobe with its glass
    // catching the light, or two shelves of jars. Painted on the back wall in metres, flat, as such things stand
    #ifdef INST
    if (gl_FrontFacing && vK.y < 0.5 && vL.z < -0.495 && abs(vL.y) < 0.499 && vA.w > 0.03 && vA.w < 0.47) {
      float nB = max(1., floor(vUv.x / 4.6 + 0.5)), bm = vUv.x / nB, uB = (vL.x + 0.5) * nB, yB = (vL.y + 0.5) * vUv.y;
      // (ROUND 5 MENDING 4, the guard: the four small things were not made out from the quay.) ONE THING TO A BAY,
      // LARGE, OF STRONG CONTRAST, BEHIND THE BAY'S OWN DOORWAY (the wall's figure for the bay is this one): a dark
      // table 2 m long with a white runner and a jug, a white bed under a dark head board, or a dark wardrobe
      // 2.1 m high with its glass catching the light
      float rB = h21(vec2(floor(uB) * 3. + floor(vA.x * 91. + 0.25), floor(vA.z * 57. + 0.25)));
      float xs = (fract(uB) - 0.5) * bm - (rB < 0.5 ? -1. : 1.) * bm * 0.19 * step(2.7, bm), xt = abs(xs), kd = floor(fract(rB * 13.) * 3.);
      vec3 tim = vec3(0.15, 0.095, 0.055), th = alb;
      if (kd < 0.5) {
        th = mix(th, tim, step(xt, 1.) * step(yB, 0.95));
        th = mix(th, vec3(0.92, 0.89, 0.8), step(xt, 0.32) * step(0.45, yB) * step(yB, 0.98));
        th = mix(th, vec3(0.62, 0.4, 0.2), step(abs(xs - 0.6), 0.12) * step(0.95, yB) * step(yB, 1.32));
      } else if (kd < 1.5) {
        th = mix(th, tim, step(xt, 1.05) * step(yB, 1.55));
        th = mix(th, vec3(0.95, 0.94, 0.9), step(xt, 0.95) * step(0.3, yB) * step(yB, 1.08));
      } else {
        th = mix(th, tim, step(xt, 0.8) * step(yB, 2.1));
        th = mix(th, vec3(1.25, 1.32, 1.3), step(xt, 0.25) * step(0.45, yB) * step(yB, 1.85));
      }
      alb = th;
    }
    #endif
    // (an enfilade, the fourth figure 0.48, has its own first partition and door for a wall: none is drawn here)
    if (vK.y > 1.5 && vA.w > 0.47) discard;
    // (the fronts read as racks of cells: each bay's side walls ran out to the rail. THE
    // GALLERY RUNS UNBROKEN ALONG THE HOUSE: before the wall a room's box has no side faces (posts alone part the
    // bays); the rooms are laid the bay's whole width, so floor and ceiling run through)
    #ifdef INST
    if (vK.y < 1.5 && vA.w > -0.5 && vA.w < 0.47 && abs(vL.x) > 0.4995 && vL.z > 0.125) discard;
    #endif
    if (vK.y > 1.5 && vK.y < 2.5) {
      float W = vUv.x, nbW = max(1., floor(W / 4.6 + 0.5)), bwm = W / nbW, uW = (vL.x + 0.5) * nbW, cellW = floor(uW);
      float bxW = (fract(uW) - 0.5) * bwm, yW = (vL.y + 0.5) * vUv.y;
      // (round 5, B0: THE SPECKLE'S CAUSE: the bay's figure was hashed from the room's own figures
      // as they reach the fragment, and the last bit of their interpolation changed the hash from pixel to pixel:
      // two paintings of the same wall in a dither, red or green dots on white. The figures are taken whole
      // (to the nearest of 91 and 57 steps) before the hash: one painting to a bay, solid leaves)
      // (a quarter step is added, not a half: a stone storey's walk has the figures 0.5 and 0.5, on the half step)
      float r1 = h21(vec2(cellW * 3. + floor(vA.x * 91. + 0.25), floor(vA.z * 57. + 0.25))), r2 = fract(r1 * 7.31), sd = r1 < 0.5 ? -1. : 1.;
      // (the harbour's houses, bays of 3 m, read as open racks: a doorway of
      // 1.5 m with its leaves took the whole bay. IN A NARROW BAY (under 3.6 m) the doorway is 1 m wide, its
      // leaves 0.3 m, and a small window stands beside it from 2.7 m: wall to both sides of every opening)
      float nar = step(bwm, 3.6), hasW = step(2.7, bwm), dw = mix(0.68 + 0.1 * r2, 0.5, nar), ww = mix(0.42, 0.3, nar), lf = mix(0.46, 0.3, nar);
      float dX = abs(bxW - sd * bwm * 0.19 * hasW), wX = abs(bxW + sd * bwm * 0.28) + 9. * (1. - hasW);
      float inD = step(dX, dw) * step(0.06, yW) * step(yW, 2.16), inWy = step(0.92, yW) * step(yW, 2.04);
      float shut = step(0.6, fract(r1 * 13.7));
      // (round 5 mending 1) A CURTAIN IN THE OPEN DOORWAY, in every second doorway (by the room's own figure): it
      // hangs from one jamb across a third to two thirds of the opening, of linen or a worn ochre; its free edge
      // sways slowly with the world's clock, most at its foot, and soft folds travel through it (no thing
      // is laid for it and no stream is drawn)
      float cuS = fract(r1 * 5.9) < 0.5 ? -1. : 1., cuX = (bxW - sd * bwm * 0.19 * hasW) * cuS, cuT = uTime * (1.1 + 0.8 * r2) + r1 * 40.;
      // (round 5 mending 2, the guard: a narrow pale curtain read as an upright shape of a person's height: it
      // covers HALF THE OPENING AND MORE, 52 to 78 hundredths of it, so it reads as cloth)
      float cuE = dw * (0.05 + 0.5 * fract(r1 * 3.1)) + (0.13 * sin(cuT) + 0.05 * sin(cuT * 3.7 + yW * 3.)) * (1.15 - yW / 2.16);
      float curt = inD * step(0.5, fract(r1 * 29.3)) * step(cuX, cuE); // (in every second doorway)
      if (inD * (1. - curt) + step(wX, ww) * inWy * (1. - shut) > 0.5) discard;
      float hk = fract(vA.w * 23.7 + 0.13);
      // (the shutters were too pale to read: a muted green, a blue-grey, a brown, here and there a
      // deep red, each a full tone under the wall)
      // (B0: A SHUTTER IS A SOLID LEAF IN ONE MUTED TONE: grey-green, blue-grey, brown; a deep red on one house in
      // ten; a few thin level lines near the lens (see louv), plain further off)
      vec3 shC = hk < 0.35 ? vec3(0.17, 0.27, 0.2) : hk < 0.65 ? vec3(0.19, 0.27, 0.37) : hk < 0.9 ? vec3(0.27, 0.17, 0.1) : vec3(0.25, 0.085, 0.07); // (the red is deeper and duller)
      shC = mix(shC, vec3(0.2, 0.13, 0.08), step(vA.w, 0.02));
      // (at 1.32 times the room's tone every far wall burnt to one white: the wall keeps its
      // house's own wash, bone, cream, ochre, rose or grey-green (A3); a far room's tone is already the lighter)
      alb = min(vC, vec3(0.9)) * (0.94 + 0.1 * n1) * (1. - 0.12 * step(yW, 0.5));
      // (far off the louvres broke into a stipple: they are whole within 8 m of the eye and gone by 18 m)
      float louv = 1. - 0.22 * step(fract(yW * 4.5), 0.09) * (1. - smoothstep(8., 18., vDist));
      float leafD = step(dw, dX) * step(dX, dw + lf) * step(0.06, yW) * step(yW, 2.16);
      float leafW = step(wX, ww + (lf - 0.04) * (1. - shut)) * inWy;
      alb = mix(alb, shC * louv, max(leafD, leafW));
      float lint = step(dX, dw + lf + 0.05) * step(2.16, yW) * step(yW, 2.32) + step(wX, ww + lf + 0.05) * (step(2.04, yW) * step(yW, 2.15) + step(0.82, yW) * step(yW, 0.92));
      alb = mix(alb, vec3(0.8, 0.76, 0.68), min(lint + step(dX, dw + 0.12) * step(yW, 0.06), 1.));
      alb = mix(alb, mix(vec3(0.8, 0.77, 0.68), vec3(0.62, 0.5, 0.3), step(0.7, fract(r1 * 17.3))) * (0.74 + 0.26 * sin(cuX * 15. + cuT * 3.1 + yW * 2.)), curt);
      ao = 0.86;
    } else if (vK.y > 2.5) { alb = min(vC, vec3(0.9)) * (0.94 + 0.1 * n1); ao = 0.9; }
    // a window's pane (the instance's fourth figure is -1): a lamp behind it shows through
    if (vA.w < -0.5) { indoor = 0.; emis = vec3(1., 0.68, 0.34) * vA.y * uLampGain * (0.35 + 0.3 * n2) * (0.9 + 0.1 * sin(uTime * 2.3 + vA.x * 40.)); }
  } else {
    // rock: beds and a mottle
    alb *= 0.7 + 0.35 * vn(vec2(tang.x * 0.15, tang.y * 0.9)) + 0.15 * n2 * fw;
  }
  // (round 5, A4: the green on a bastion's wall took the stone's courses and read as green
  // blocks: it is laid over the finished stone, a leaf mottle of its own, small and soft)
  // (B0: two leaf tones, a deep green and a paler olive, in soft patches; the fringe is three quarters opaque)
  // the wall's doorway or shuttered window and its surround of paler stone, over the finished stone
  if (wdK + wdF > 0.) { alb = mix(alb, min(vC * 1.2, vec3(0.86)), wdF); alb = mix(alb, wdC, wdK); }
  if (vineK > 0.) alb = mix(alb, mix(vec3(0.15, 0.28, 0.1), vec3(0.3, 0.36, 0.14), smoothstep(0.35, 0.65, vn(vUv * 0.9 + 3.))) * (0.7 + 0.35 * vn(vUv * 3.3) + 0.3 * vn(vUv * 9.1) * fw), 0.78 * vineK);
  vec2 suv = (vP.xz - uShadeRect.xy) * uShadeRect.zw;
  float hs = texture2D(uShade, suv).r;
  float inSun = smoothstep(hs - 0.4, hs + 1.1, vP.y);
  // (beyond the shade map's rectangle nothing of the city shades: the far shore stands in the sun)
  inSun = mix(inSun, 1., step(0.5, max(abs(suv.x - 0.5), abs(suv.y - 0.5))));
  // (round 4, A1) SHADOWS THAT ARE SEEN, at no triangle's and no call's cost but the shapes named below.
  // (a) A THING'S OWN SHADOW: a paving quad laid by the builders along the sun's bearing with the weight -1
  // is the same paving standing in that thing's cast shade (posts, lamp posts, the quay's things, the trees)
  float pavK = step(10.5, kind) * step(kind, 11.5) * step(0.6, N.y);
  inSun *= 1. - pavK * step(vK.y, -0.5);
  // (b) THE BALUSTRADE'S STRIPED SHADOW on the promenade's paving (the rising street and the street on to the
  // harbour, 270 to 276.4 m from the centre, above the quay's deck): the line from the paving toward the sun is
  // followed to the rail's circle; under the coping's height it is shaded by the plinth, by the coping, or by a
  // baluster (the rail's own pitch and turned width); far off the stripes run together into their mean
  float rP = length(vP.xz), shL = length(uSunDir.xz);
  // (round 4, A-ii) (c) A HOUSE BLOCK'S LONG SLANTED SHADOW on the bastion face, the terrace and the side wall
  // beside it, from the map of the houses' tops: a place dr behind its tier's front line is reached by the
  // sun's light only across the tier's own houses on the sun's side, as far along the tier as dr times the
  // light's slant; it is shaded where a house stands there higher than that line (which climbs by the sun's height).
  // A front stands on the line itself (dr = 0) and is never shaded by its neighbours
  float kT = floor((rP - uOccRect.z - 0.5) / uOccRect.w);
  if (indoor < 0.5 && kT >= 0. && kT < uOccRect.y && shL > 0.01 && uNight < 0.5) {
    vec2 sH = uSunDir.xz / shL, rad = -vP.xz / rP; float cr = dot(sH, rad), ct = dot(sH, vec2(-rad.y, rad.x));
    float drT = rP - (uOccRect.z + kT * uOccRect.w), aT = atan(vP.x, -vP.z);
    if (cr > 0.08 && abs(ct) > 0.05) {
      float tMax = min(drT * abs(ct) / cr, 40.), blk = 0.;
      for (int i = 0; i < 7; i++) {
        float sT = 0.8 + (tMax - 0.8) * (float(i) + 0.5) / 7.;
        float topT = texture2D(uOcc, vec2((aT - sign(ct) * sT / rP) / (2. * uOccRect.x) + 0.5, (kT + 0.5) / uOccRect.y)).r;
        blk = max(blk, step(0.8, tMax) * smoothstep(0., 0.5, topT - vP.y - uSunDir.y / shL * sT / abs(ct)));
      }
      inSun *= 1. - blk;
    }
  }
  if (pavK > 0.5 && vP.y > 1.32 && vP.y < 19.4 && rP > 270.1 && rP < 276.4 && shL > 0.01) {
    vec2 sh = uSunDir.xz / shL; float pd = dot(vP.xz, sh), disc = pd * pd - (rP * rP - 270.06 * 270.06);
    if (pd < 0. && disc > 0.) {
      float tS = -pd - sqrt(disc), hg = tS * uSunDir.y / shL; vec2 qS = vP.xz + sh * tS;
      float bxS = abs(fract(atan(qS.x, -qS.y) * 270.06 / 0.27) - 0.5), vS = clamp(hg / 1.02, 0., 1.);
      float bal = 1. - smoothstep(-0.03, 0.03, bxS - (0.2 + 0.15 * sin(vS * 6.5 + 0.4) * sin(vS * 3.14159)));
      // (round 5, C7: the stripes read as a striped ramp up the street: they are plain to 9 m from the lens and an
      // even band of shade from 24 m)
      // (the guard's third asking: on the rising street the rail's and the plinth's arcs and
      // the stripes between read as a fan-pattern pavement. The balusters' own shadows are plain only within 4 m of
      // the lens; from 6.5 m the whole is ONE even half shade with a soft far edge and no arcs in it)
      float farS = smoothstep(4., 6.5, vDist), solid = mix(min(step(hg, 0.07) + step(0.9, hg), 1.), 0.5, farS);
      bal = mix(bal, 0.5, farS);
      inSun *= 1. - (1. - smoothstep(1.06 - 0.5 * farS, 1.08 + 0.15 * farS, hg)) * max(bal, solid);
    }
  }
  float ndl = dot(N, uSunDir); ndl = mix(max(ndl, 0.), 0.35 + 0.65 * abs(ndl), two);
  // inside a room the sun reaches only a little way in from the open front
  float isRoom = step(7.5, kind) * step(kind, 8.5);
  // THE LOW SUN IN A ROOM: where the open front faces the sun (vSunF = the cosine between them) the light goes in
  // under the floor above and lies on the floor, the side walls and the back wall up to the height that floor's
  // edge lets it reach (rooms 5 m deep and 2.7 m high: the line falls by depth x sin(sun's height) / vSunF)
  float sunLine = 0.5 - (0.5 - vL.z) * 1.85 * uSunDir.y / max(vSunF, 0.03);
  float reach = mix(1., smoothstep(-0.05, 0.05, sunLine - vL.y) * step(0.03, vSunF), isRoom);
  // indoors the sun comes by the open front only, and only when that front faces it; the things of a room stand in
  // it near the front and in shade further in
  float front = mix(1., smoothstep(0.02, 0.3, vSunF) * mix(smoothstep(-0.4, 1.3, vL.z), 1., isRoom), indoor);
  // (round 5, A1) BEHIND THE HOUSE'S WALL the sun comes only by the doorway and the windows: the room's own faces
  // further in than the wall (0.12 of its depth), and the things that stand in it, take two fifths of the sun
  // (a room's things are laid in metres from its middle: the wall stands 0.6 back; before it they are on the gallery)
  float behindW = (isRoom * step(vK.y, 1.5) * step(vL.z, 0.115) + (1. - isRoom) * indoor * step(vL.z, 0.6)) * (1. - outW);
  // (a room's face seen from outside is a wall in the open air: the sun falls on it as on any wall)
  reach = mix(reach, 1., outW); front = mix(front, 1., outW);
  // (the doorways did not read: by day a quarter of the sun and half the sky's fill go in)
  // (and after its second half: an eighth of the sun: on a sunlit front the doorway is the dark thing in the wall)
  vec3 direct = uSunCol * ndl * inSun * reach * front * sunCut * (1. - 0.87 * behindW);
  ao *= 1. - 0.5 * behindW * (1. - uNight);
  // (the doorways stood blue-black: the fill behind the wall is a warm grey by day, see below)
  vec3 amb = mix(uAmbGround, uAmbSky, N.y * 0.5 + 0.5) * ao * mix(1., 0.62, indoor);
  amb = mix(amb, vec3(dot(amb, vec3(0.38))) * vec3(1.12, 0.96, 0.8), 0.85 * behindW * (1. - uNight));
  // STONE IN SHADE IS A COOL PALE GREY, never blue and never dark: stone, rock, paving, arcade and wall take the
  // fill's brightness half as much again and nearly without its blue (pale stone throws the light back and forth)
  float stone = step(1.5, kind) * step(kind, 2.5) + step(9.5, kind) * step(kind, 11.5) + step(12.5, kind);
  amb = mix(amb, vec3(dot(amb, vec3(0.34))) * vec3(0.97, 1., 1.06) * 1.5, stone * (1. - indoor));
  // (round 3, A5) WHERE THE WATER STARTS: by day every stone wall, pier, rock and pile that stands in the lake has
  // a DAMP FOOT, two fifths darker over its lowest half metre (and so again in the double), and at the plane
  // itself a fine line of the sky's light, the water's skin seen from across the bay (upright faces only)
  float wetK = (stone + step(0.5, kind) * step(kind, 1.5)) * (1. - indoor) * (1. - uNight) * step(abs(N.y), 0.5);
  // (THE WATERLINE: across the bay a fine bright line with a dark band over it, and under it in the double, marks
  // where the water starts)
  // (ROUND 5 MENDING 5, L7: ONE HEIGHT EVERYWHERE, whatever the eye's distance: the damp band is whole to 0.8 m and
  // out by 1.33, 0.56 darker; the skin's line is 0.2 m high. A line finer than a pixel is not left to flicker:
  // it is weighed by the share of the pixel's own footprint that it fills (fwidth of the height), nothing more)
  float skinH = 0.2, dampH = 0.8, fpy = max(fwidth(vP.y), 0.02);
  // (MENDING 6, M1: A MOORING PILE (timber, second figure 8) IS OF ONE TONE from the plane to its top: it takes
  // no damp band, wherever it stands; the skin's fine line at the plane it keeps, as every foot in the water does)
  float pileK = step(0.5, kind) * step(kind, 1.5) * step(7.5, vK.y);
  alb *= 1. - 0.56 * wetK * (1. - pileK) * (1. - smoothstep(dampH, dampH * 1.67, abs(vP.y)));
  // (L8: PLAIN ALL ROUND THE BAY: its strength is 0.8, the same at every wall's, pier's, pile's and quay's foot)
  emis += uSkyHor * 0.8 * wetK * clamp((min(skinH, vP.y + 0.5 * fpy) - max(0., vP.y - 0.5 * fpy)) / fpy, 0., 1.);
  // THE WATER'S LIGHT PLAYS UNDER EVERY ARCH by day: on stone that faces down (an arch's soffit, the crown most,
  // nothing on its upright springing) a net of bright wavering lines travels by the clock, as under any bridge
  // over lit water; the same in the double; none by night. (ROUND 5 MENDING 5, L5) ONE LAW OF THE STONE'S HEIGHT
  // OVER THE PLANE, the same under the quay's arches, the causeway's, the jetty's and every other: whole to 9 m,
  // fading out by 24 (it had one reach on the shore and a higher one out over the lake)
  float underH = 1. - smoothstep(9., 24., abs(vP.y));
  float under = stone * (1. - indoor) * (1. - uNight) * (1. - smoothstep(-0.45, -0.1, N.y)) * underH;
  if (under > 0.) {
    // (under the causeway's arches that net read as a stretched cobble texture: it is FINE AND
    // FAINT, at the scale of the stones (its meshes a third of a metre, not a metre), two fifths as bright, and
    // it moves half as fast)
    vec2 cq = vP.xz * 3.4 + vP.y * 2.2;
    float c1 = sin(cq.x * 1.9 + 1.4 * sin(cq.y * 1.3 + uTime * 1.05)), c2 = sin(cq.y * 2.3 + 1.2 * sin(cq.x * 1.7 - uTime * 0.85));
    emis += vec3(1., 0.93, 0.78) * 0.12 * under * pow(max(1. - 0.5 * abs(c1 + c2), 0.), 5.) * (1. - smoothstep(25., 60., vDist));
  }
  // (stage F: a face turned from the sun takes a fifth less of the fill, so the shaded arm and the
  // shaded side of every bastion and tower stand deeper against the lit ones; level floors keep it whole)
  // (the bay's two arms read close in tone; pale stone turned from the sun, which lies
  // there in broad bands, takes a sixth less again)
  amb *= mix(0.8 - 0.13 * stone * (1. - indoor), 1., smoothstep(-0.25, 0.25, dot(N, uSunDir)));
  // (pale stone square to the sun burnt out to white; it takes four fifths of the sun, a little
  // less of its blue: cream to honey)
  // (the lead's eye on the causeway: its sunlit stone read a little mustard: HONEY, a touch less
  // yellow: stone takes a little less of the sun's green and a little more of its blue)
  direct *= mix(vec3(1.), vec3(0.83, 0.745, 0.76), stone * (1. - indoor));
  // (round 3, A1) LIMEWASH, TIMBER AND TILE IN SHADE ARE COOL AND NEVER BLUE: they take the fill with two thirds
  // of its blue taken out; and what stands in the cast shade (the dawn line, the hill's shadow) takes a quarter
  // less of the fill, so the shaded tier is a third to a half darker than the lit ones over it and never black
  // (cloth in the shade went navy, the boats black, the slate roofs blue: cloth and boats take the
  // same law, slate takes the fill nearly grey, and a boat's dark hull half as much fill again)
  float plain = step(kind, 1.5) + step(2.5, kind) * step(kind, 4.5) + step(8.5, kind) * step(kind, 9.5);
  float slateK = step(2.5, kind) * step(kind, 3.5), boatK = step(8.5, kind) * step(kind, 9.5);
  amb = mix(amb, vec3(dot(amb, vec3(0.34))) * vec3(0.96, 1., 1.1) * (1.12 + 1.1 * boatK), (0.66 + 0.26 * slateK) * plain * (1. - indoor) * (1. - uNight));
  // (by day only: the night law is kept as it was)
  amb *= mix(0.76, 1., max(inSun, uNight));
  // (round 4, A1/A2) A CAST SHADOW IS COOL VIOLET-GREY: where stone or paving lies in cast shade by day the fill
  // loses a fifth of its red and a quarter of its green and keeps its blue (a shadow across warm paving reads
  // violet-grey, never brown and never navy)
  // (and so is a stone face turned from the sun: lavender-grey, a tenth deeper)
  // (round 4, A-ii) HIGH UP THE SHADE IS LIGHT: a face in shade (cast, or turned from the sun) takes more of the
  // fill the higher it stands, so the upper tiers' shaded side is a light lavender-grey; and THE UPPER TIERS AND
  // THE CREST CATCH THE GOLD FIRST
  float litK = inSun * smoothstep(-0.2, 0.15, dot(N, uSunDir));
  // (round 5, B1: the shade stays a half darker: that lift is a quarter, not nine tenths)
  // (ROUND 5 MENDING 5, L7: BY PLACE, not by the eye's distance: the lift grows with the HEIGHT over the plane,
  // none at the quay, whole from 60 m up: the upper tiers stand under more open sky)
  amb *= 1. + 0.25 * smoothstep(6., 60., abs(vP.y)) * (1. - uNight) * (1. - indoor) * (1. - litK);
  direct *= 1. + (1. - uNight) * (-0.08 + 0.33 * smoothstep(20., 100., vP.y));
  // (the shade stood purple, not violet-grey: the cast is two thirds of what it was)
  amb *= mix(vec3(0.86, 0.83, 1.), vec3(1.), max(max(inSun, uNight), 1. - stone));
  amb *= mix(vec3(0.93, 0.9, 1.), vec3(1.), max(max(smoothstep(-0.2, 0.15, dot(N, uSunDir)), uNight), max(1. - stone, indoor)));
  // a lamp left burning washes its room (drawn by place: the lamp hangs at the room's middle)
  vec3 lw = vec3(1., 0.72, 0.38) * vA.y * uLampGain * indoor * 1.1 / (1. + 9. * dot(vL - vec3(0., 0.2, -0.1), vL - vec3(0., 0.2, -0.1)));
  float flame = 0.87 + 0.13 * sin(uTime * 2.3 + vA.x * 40.) + 0.045 * sin(uTime * 7.1 + vA.x * 17.);
  lw *= (isRoom + 0.6 * (1. - isRoom)) * flame;
  // (round 3, A2) THE ROOMS' LIGHT READS WARM AGAINST THE SHADE: where the front stands in the cast shade the
  // lamp's wash is twice as strong and a little redder, and reaches the whole room (by day only: the night law
  // is kept as it was)
  // (round 4, A3) GLOW IN THE SHADE: a front is in shade when it stands in cast shade OR is turned from the sun
  // (the west horn's fronts at the opening were dark hollow bays): there, by day, every room has its warm
  // wash whether its lamp was dealt lit or not (the back wall, the ceiling and the things in it glow; the wash
  // is strongest at the room's middle), and a lit lamp's wash is twice as strong as in a sunlit room
  float shF = (1. - uNight) * max(1. - inSun, 1. - smoothstep(0.02, 0.22, vSunF));
  lw *= mix(vec3(1.), vec3(2.1, 1.9, 1.5), shF);
  lw += vec3(1., 0.7, 0.36) * 0.62 * shF * indoor * (isRoom + 0.5 * (1. - isRoom)) / (1. + 4. * dot(vL - vec3(0., 0.2, -0.1), vL - vec3(0., 0.2, -0.1)));
  // (round 4, A-ii: the sunlit fronts stood dull brown, their rooms dark behind the raking sun's line: a room in
  // a front turned to the sun takes a share of the sun's own light on all its walls, so a lit front is warm
  // cream to gold, a shaded one lavender with its warm points)
  // (round 5, A1: that light now lies on the house's wall; the room behind it takes a third of it, a dark doorway)
  // (ROUND 5 MENDING 5, L7: ONE SHARE EVERYWHERE, a quarter of the sun's light, whatever the eye's distance)
  lw += uSunCol * 0.25 * indoor * (1. - shF) * (1. - uNight) * smoothstep(0., 0.4, vSunF) * (1. - 0.67 * behindW);
  // (round 5, B1) THE GRADE: GOLD AGAINST BLUE-VIOLET, by day and out of doors. A face in the sun takes its fill
  // warm and a fifth smaller (the bounce of lit stone, not the grey of the sky), so sunlit stone is a full
  // gold-apricot and not cream; a face in shade (cast, or turned from the sun) takes it blue-violet, so the shaded
  // side is a clear blue-violet about a half under the lit one, near and far; roofs, towers and every edge that
  // looks toward the sun take A WARM RIM (the low sun grazing them), strongest high on the hill
  // (the house's wall behind a gallery, a room's flagged face, stands out of doors for this law: it is most of a
  // front now. B4: THE SHADE GLOWS WARM THROUGH ITS OPENINGS: the wall itself takes a fifth of the room's lamp
  // wash, and behind it, on a front in shade, the wash is stronger, so a shaded front is blue-violet with warm
  // doorways and windows)
  float wallF = max(isRoom * step(1.5, vK.y), outW);
  // (ROUND 5 MENDING 5, L7: that wash is twice as strong on every shaded front, whatever the eye's distance)
  lw *= mix(1., 0.2, wallF * (1. - uNight)) * (1. + behindW * shF);
  // (round 5 mending 2, the book guard: from the quay every doorway was a dark hole by day.) BY DAY THE ROOMS ARE
  // SEEN INTO: in three rooms of four (the room's own figures, which its things share) what lies behind the
  // house's wall, the room's faces and the things in it, takes a warm light (the day off the floor, strongest
  // low), so the back wall stands lit through the doorway and the room's things stand plain against it; half as
  // much on a front in shade, where the rooms already glow. Not by night (the night law is kept)
  // (the guard: a few near openings read dark blue: the one room in four that had none of it. EVERY room takes
  // the warm light by day, that fourth at seven tenths of it)
  // (the quay's arcade openings read blue-grey: a stone storey's walk, whose fourth figure is 0, had none of
  // this light: it takes seven tenths of it too)
  // (the walk is known by its figures, 0.5, 0, 0.5, 0: nothing of the merged mesh and no window pane takes it)
  float seenK = behindW * (1. - uNight) * max(step(0.03, vA.w), 0.7 * step(abs(vA.x - 0.5) + abs(vA.z - 0.5) + abs(vA.w), 0.01)) * mix(0.7, 1., step(0.25, h21(vec2(floor(vA.x * 91. + 0.25), floor(vA.z * 57. + 0.25)) + 7.))) * (1. - 0.5 * shF);
  // (with eight tenths of that light the back wall stood as pale as the sunlit wall round the doorway: six tenths)
  lw += vec3(1., 0.8, 0.52) * 0.6 * seenK * mix(1., mix(1.12, 0.78, clamp(vL.y + 0.5, 0., 1.)), isRoom);
  float dayK = (1. - uNight) * (1. - indoor * (1. - wallF)), litB = inSun * smoothstep(-0.1, 0.35, dot(N, uSunDir));
  amb = mix(amb, amb * vec3(1.05, 0.8, 0.5) * 0.8, dayK * litB);
  // (ROUND 5 MENDING 5, step 1c: the bastions' and terraces' walls in shade stood as flat lilac planes.) A WALL IN
  // SHADE IS STONE IN SHADE: on the kind WALL the shade's cast is a warm grey with a breath of violet, not the
  // blue-violet of the limewashed fronts
  amb = mix(amb, dot(amb, vec3(0.34)) * mix(vec3(0.8, 0.82, 1.3), vec3(1.02, 0.9, 1.0), step(13.5, kind)) * 0.86, 0.8 * dayK * (1. - litB));
  float rimB = pow(max(1. - abs(dot(N, normalize(cameraPosition - vP))), 0.), 3.) * smoothstep(-0.3, 0.4, dot(N, uSunDir)) * inSun;
  direct += uSunCol * 0.4 * rimB * dayK * (0.4 + 0.6 * smoothstep(10., 70., vP.y));
  // (round 5, D1, the guard, BY NIGHT only; by day nothing is changed): THE ROOFS ARE LIT ENOUGH TO SHOW (a roof
  // takes the night sky's fill seven tenths stronger), and THE FAR HILLS STAND DARKER THAN THE SKY (the ranges
  // beyond 900 m, which the haze had made as pale as the horizon, keep half of their tone after it)
  // (from the west terrace by night the near roofs stood a loud blue and the hills were paler than the sky:
  // the roofs' lift is 0.45, the ranges keep 8 hundredths: dark outlines under the stars)
  amb *= 1. + 0.45 * uNight * step(2.5, kind) * step(kind, 3.5);
  vec3 col = alb * (direct + amb + lw) + emis;
  float haze =1. - exp(-vDist * uHaze.a * mix(1., ${(1-mt).toFixed(2)}, 0.5 - 0.5 * uSide));
  col = mix(col, uHaze.rgb, clamp(haze, 0., 1.));
  // (ROUND 5 MENDING 5, L7: the far ranges by their PLACE: rock from 900 to 1400 m of the bay's centre and beyond)
  col *= 1. - 0.92 * uNight * step(9.5, kind) * step(kind, 10.5) * smoothstep(900., 1400., length(vP.xz));
  // (WHAT STANDS ON THE OPEN LAKE IS DARK BY NIGHT: it keeps 0.15 of its light, a dark shape on the dark
  // water. THE LAW READS THE THING ITSELF: the two rocks with their houses and the islets' footing stones
  // are a mesh of their own whose material carries uLake 1 (everything else 0), so a rock is dark as a whole
  // wherever it stands; no edge in the plane is read)
  col *= 1. - 0.85 * uNight * uLake;
  // a join belongs to both cities: under the plane it takes the lower tone
  gl_FragColor = vec4(col * mix(uTone, vec3(${(1-mt).toFixed(2)}, ${(1-mt/2).toFixed(2)}, 1.), uJoin * step(vP.y, 0.)), 1.);
}`;function De(){return{uTime:{value:0},uHand:{value:1},uLampGain:{value:1},uSunCol:{value:new _.Color(1,1,1)},uAmbSky:{value:new _.Color(.3,.4,.6)},uAmbGround:{value:new _.Color(.2,.2,.2)},uHaze:{value:new _.Vector4(.7,.8,.9,6e-4)},uShadeRect:{value:new _.Vector4(0,0,1,1)},uShade:{value:null},uOccRect:{value:new _.Vector4(1.4,8,276,13)},uOcc:{value:null},uSkyTop:{value:new _.Color(.3,.5,.8)},uSkyHor:{value:new _.Color(.8,.88,.95)},uSunDir:{value:new _.Vector3(0,1,0)},uSunGlow:{value:new _.Color(1,.8,.6)},uBreath:{value:new _.Vector4(1,0,6,9)},uNight:{value:0}}}function Gt(t){const n=new _.Group,o=new _.Group;o.scale.y=-1;const d=new _.Vector3(1-mt,1-mt/2,1),h=new _.Vector3(1,1,1),l=(u,e)=>new _.ShaderMaterial({vertexShader:Wt,fragmentShader:Qt,defines:u?{INST:1}:{},side:_.DoubleSide,uniforms:{...t,uSide:{value:e},uTone:{value:e>0?h:d},uJoin:{value:0},uLake:{value:0}}}),m={up:[l(!1,1),l(!0,1)],low:[l(!1,-1),l(!0,-1)]},L=l(!1,1);L.uniforms.uJoin.value=1;const i={up:l(!1,1),low:l(!1,-1)};i.up.uniforms.uLake.value=i.low.uniforms.uLake.value=1;const b={upper:n,lower:o,mats:m,tone:d,joinMat:L,lakePair:i,triangles:0,calls:0,meshes:[],add(u,e){const a=u.isInstancedMesh?1:0;u.material=e?e.up:m.up[a];let f;a?(f=new _.InstancedMesh(u.geometry,e?e.low:m.low[1],u.count),f.instanceMatrix=u.instanceMatrix):f=new _.Mesh(u.geometry,e?e.low:m.low[0]),f.renderOrder=u.renderOrder,u.frustumCulled=!1,f.frustumCulled=!1,u.matrixAutoUpdate=!1,f.matrixAutoUpdate=!1,n.add(u),o.add(f),u.userData.twin=f;const c=u.geometry.index,x=(c?c.count:u.geometry.attributes.position.count)/3;return b.triangles+=2*x*(a?u.count:1),b.calls+=2,b.meshes.push(u),u}};return b}function Yt(t,n){const o=new _.InstancedMesh(t,void 0,Math.max(1,n.length)),d=new Float32Array(o.count*4),h=new Float32Array(o.count*3);for(let l=0;l<n.length;l++){const m=n[l];o.setMatrixAt(l,m.m);const L=m.a||[0,0,0,0],i=m.c||[1,1,1];d.set(L,l*4),h.set(i,l*3)}return n.length||o.setMatrixAt(0,new _.Matrix4().makeScale(0,0,0)),t.setAttribute("iA",new _.InstancedBufferAttribute(d,4)),t.setAttribute("iC",new _.InstancedBufferAttribute(h,3)),o.instanceMatrix.needsUpdate=!0,o}const st=Math.PI/180;function Fe(t,n={}){const d=t.range(.36,.46),h={RQ:270,QW:6,DECK:1.2,TP:13,TR:18,HD:8,ST:5,FLOOR:3,ROOMD:5,PROUD:.22,EAVE:.6,aMax:75*st,NT:5,steep:d,aI:(56+t.range(-1.2,1.2))*st,inletW:30,inletD:32,FB:10.5,RIMF:6,bay:t.range(3.5,4.4)};h.alpha=h.inletW/2/h.RQ,h.rHead=h.RQ+h.inletD,h.rPier=h.RQ+h.QW,h.rFront=h.rHead-5.5,h.rHQ=h.rFront-1.6,h.rimY=h.DECK+h.RIMF*h.FLOOR,h.pos=(u,e)=>[u*Math.sin(e),-u*Math.cos(e)],h.polar=(u,e)=>[Math.hypot(u,e),Math.atan2(u,-e)],h.tierR=u=>h.RQ+h.QW+h.TP*u,h.tierY=u=>h.DECK+h.TR*u,h.tiersAt=u=>Math.max(3,Math.round(h.NT*(1-h.steep*(u/h.aMax)*(u/h.aMax)))),h.laneHalf=12.5,h.rampA1=h.aI-h.alpha-h.FB/293,h.rampA0=h.rampA1-(h.rimY-h.DECK)*5/(h.RQ+3);const l=h.rampA0/st-t.range(10.1,13.1),m=16,L=l+64-3*m;h.lanes=[t(),t(),t()].sort((u,e)=>u-e).map((u,e)=>({a:(-64+u*L+e*m)*st})).concat([{a:l*st}]);const i=[-70].concat(h.lanes.map(u=>u.a/st),[h.rampA1/st+2]),b=i.slice(1).map((u,e)=>[i[e]+6,u-6]).filter(u=>u[1]-u[0]>2);return h.towers=[0,1,2].map(()=>{const u=b.splice(Math.floor(t()*b.length),1)[0],e=(u[0]+t()*(u[1]-u[0]))*st;return{a:e,k:Math.min(h.tiersAt(e-5*st),h.tiersAt(e),h.tiersAt(e+1.5*st))-1}}),h.belv=[.3,.57,.7].map(u=>h.rampA0+(h.rampA1-h.rampA0)*u),h.rampY=u=>u>h.rampA1+1e-4?h.DECK:h.DECK+(h.rimY-h.DECK)*Math.max(0,(u-h.rampA0)/(h.rampA1-h.rampA0)),h.aLaneE=()=>h.aI-h.alpha-h.FB/293,h.aLaneW=()=>h.aLaneE(),h.aBastE=()=>h.aI+h.alpha+h.FB/293,h.zone=(u,e)=>{if(Math.abs(e)>h.aMax)return"out";if(u<h.RQ)return"water";const a=e-h.aI;return u<h.rHead&&Math.abs(a)<h.alpha||u>h.rPier&&u<h.rHead&&a>=h.alpha&&e<h.aBastE()?"water":u<h.rHead&&e>h.aLaneE()&&e<h.aBastE()?"bastion":u<h.RQ+h.QW?"quay":"tier"},h.ground=(u,e)=>{const a=h.zone(u,e);if(a==="out"||a==="water")return 0;if(a==="quay")return h.rampY(e);if(a==="bastion")return h.rimY;const f=Math.floor((u-h.tierR(0))/h.TP),c=h.tiersAt(e);return f>=c?h.tierY(c)+Math.min(14,(u-h.tierR(c))*.5):u-h.tierR(f)<h.HD?h.tierY(f):h.tierY(f+1)},h.top=(u,e)=>{const a=h.zone(u,e),f=h.ground(u,e);if(a==="bastion")return f+(Math.abs(e-h.aI)>h.alpha+5.5/u&&u<h.rHead?6.5:0);if(a!=="tier")return f;const c=Math.floor((u-h.tierR(0))/h.TP),x=h.tiersAt(e);return c>=x?f:h.tierY(c+1)},h}const Ut={x0:-456,z0:-456,x1:456,z1:40,nx:256,nz:136};async function Vt(t,n,o){const d=Ut,h=d.nx,l=d.nz,m=(d.x1-d.x0)/h,L=(d.z1-d.z0)/l,i=new Float32Array(h*l),b=new Uint16Array(h*l);for(let v=0;v<l;v++){for(let s=0;s<h;s++){const r=d.x0+(s+.5)*m,w=d.z0+(v+.5)*L,M=t.polar(r,w);i[v*h+s]=Math.max(t.top(M[0],M[1]),t.extraTop?t.extraTop(r,w):0)}v%24===23&&await o()}const u=Math.hypot(n.x,n.z)||1,e=n.x/u,a=n.z/u,f=n.y/u,c=3.2,x=Math.min(150,Math.ceil(150/Math.max(.12,f)/c));for(let v=0;v<l;v++){for(let s=0;s<h;s++){const r=d.x0+(s+.5)*m,w=d.z0+(v+.5)*L;let M=-50;const y=i[v*h+s]+.5;for(let S=1;S<=x;S++){const A=2+S*c,R=Math.floor((r+e*A-d.x0)/m),D=Math.floor((w+a*A-d.z0)/L);if(R<0||D<0||R>=h||D>=l)break;if(i[D*h+R]<=y)continue;const T=i[D*h+R]-f*A;T>M&&(M=T)}b[v*h+s]=_.DataUtils.toHalfFloat(M)}(v%12===11||v<9&&v%3===2)&&await o()}const k=new _.DataTexture(b,h,l,_.RedFormat,_.HalfFloatType);return k.magFilter=_.LinearFilter,k.minFilter=_.LinearFilter,k.wrapS=k.wrapT=_.ClampToEdgeWrapping,k.needsUpdate=!0,{texture:k,rect:new _.Vector4(d.x0,d.z0,1/(d.x1-d.x0),1/(d.z1-d.z0))}}function jt(t,n){const h=t.aMax+.12,l=new Float32Array(2048*8).fill(-50),m=new Uint16Array(2048*8);for(const i of n){if(i.kind!=="tier")continue;const b=Math.hypot(i.x,i.z),u=Math.atan2(i.x,-i.z),e=Math.floor((b-t.tierR(0)+2)/t.TP);if(e<0||e>=8)continue;const a=i.y0+i.floors*t.FLOOR+.6,f=i.w/2/b,c=Math.max(0,Math.round((u-f+h)/(2*h)*2048)),x=Math.min(2047,Math.round((u+f+h)/(2*h)*2048));for(let k=c;k<=x;k++)l[e*2048+k]=Math.max(l[e*2048+k],a)}for(let i=0;i<2048*8;i++)m[i]=_.DataUtils.toHalfFloat(l[i]);const L=new _.DataTexture(m,2048,8,_.RedFormat,_.HalfFloatType);return L.magFilter=_.NearestFilter,L.minFilter=_.NearestFilter,L.wrapS=L.wrapT=_.ClampToEdgeWrapping,L.needsUpdate=!0,{texture:L,rect:new _.Vector4(h,8,t.tierR(0),t.TP)}}function _t(t){const n=[-t.aMax],o=2.5*st,d=[t.aLaneW(),t.aLaneE(),t.aI-t.alpha,t.aI+t.alpha,t.aBastE(),t.aMax];let h=-t.aMax;for(;h<t.aMax-1e-6;){let l=Math.min(h+o,t.aMax);for(const m of d)m>h+1e-6&&m<l-1e-6&&(l=m);l-h>1e-5&&n.push(l),h=l}return n}function Jt(t,n,o=null,d=null){const h=at(),l=_t(t),m=e=>e>t.aLaneW()&&e<t.aBastE(),L=t.rHead,i=e=>{const a=t.tiersAt(e),f=m(e),c=[];f&&c.push([L,t.rimY,H.STONE],[L,t.tierY(2),H.PAVE]);for(let v=0;v<a;v++){const s=t.tierR(v),r=s+t.HD,w=t.tierR(v+1);f&&w<=L+.01||((!f||s>=L-.01)&&c.push([s,t.tierY(v),H.PAVE],[r,t.tierY(v),H.STONE]),c.push([r,t.tierY(v+1),H.PAVE],[w,t.tierY(v+1),H.PAVE]))}const x=t.tierR(a),k=t.tierY(a);return c.push([x,k,H.ROCK],[x+26,k+13,H.ROCK],[x+70,k-8,H.ROCK]),c},b=(e,a,f)=>{h.kind(H.STONE).col(n.bastion);for(let c=0;c+1<e.length;c++){const x=t.pos(e[c][0],a),k=t.pos(e[c+1][0],a),v=[[x[0],0,x[1]],[k[0],0,k[1]],[k[0],e[c+1][1],k[1]],[x[0],e[c][1],x[1]]];h.quad(v[0],v[1],v[2],v[3],[Math.cos(a)*f,0,Math.sin(a)*f])}};let u="";for(let e=0;e+1<l.length;e++){const a=l[e],f=l[e+1],c=(a+f)/2,x=t.zone(t.RQ+20,c),k=i(c),v=k.length+":"+k[0][0]+":"+(x==="tier"||m(c)?1:0);v!==u&&(b(k,a,-1),e>0&&b(i((l[e-1]+a)/2),a,1)),u=v;for(let s=0;s+1<k.length;s++){const[r,w,M]=k[s],[y,S]=k[s+1],A=t.pos(r,a),R=t.pos(r,f),D=t.pos(y,a),T=t.pos(y,f);if(h.kind(M).col(M===H.ROCK?n.rock:M===H.STONE?n.bastion:n.pave),M===H.STONE){h.kind(H.WALL).move(S-w).quad([A[0],w,A[1]],[R[0],w,R[1]],[T[0],S,T[1]],[D[0],S,D[1]],null,[a*r,0,f*r,0,f*r,S-w,a*r,S-w]).move(0);const V=Math.abs(Math.sin(e*12.9898+s*78.233)*43758.5453)%1;if(V<.3){const z=r-.22,I=(f-a)*z,K=[-Math.sin(c),0,Math.cos(c)],C=Math.max(2,Math.min(6,Math.floor(I/1.1)));h.kind(H.LEAF).col(J(n.leaf[V<.15?0:1],.8)).move(1);for(let B=0;B<C;B++){const q=a+(f-a)*(.1+.8*B/C),j=a+(f-a)*(.1+.8*(B+1)/C),O=t.pos(z,q),p=t.pos(z,j),g=1.2+3.6*(Math.abs(Math.sin((e*31+s*17+B)*3.71)*9173.13)%1);h.quad([O[0],S-g,O[1]],[p[0],S-g*.8,p[1]],[p[0],S-.14,p[1]],[O[0],S-.14,O[1]],K)}h.move(0)}continue}if(h.quad([A[0],w,A[1]],[R[0],w,R[1]],[T[0],S,T[1]],[D[0],S,D[1]]),M===H.PAVE&&s>0&&k[s-1][0]===r&&k[s-1][1]<w&&k[s-1][2]!==H.ROCK){const V=r-.14,z=t.pos(V,a),I=t.pos(V,f),K=w+1.15,C=[-Math.sin(c),0,Math.cos(c)];h.kind(H.STONE).col(n.parapet),h.quad([z[0],w-.5,z[1]],[I[0],w-.5,I[1]],[I[0],w,I[1]],[z[0],w,z[1]],C),h.quad([z[0],K,z[1]],[I[0],K,I[1]],[R[0],K,R[1]],[A[0],K,A[1]],[0,1,0]),h.quad([z[0],K-.12,z[1]],[I[0],K-.12,I[1]],[I[0],K,I[1]],[z[0],K,z[1]],C),h.kind(H.RAIL).quad([A[0],w,A[1]],[R[0],w,R[1]],[R[0],K-.06,R[1]],[A[0],K-.06,A[1]],C)}}}b(i((l[l.length-2]+l[l.length-1])/2),l[l.length-1],1);for(const e of t.lanes)for(let a=0;a<t.tiersAt(e.a);a++)for(let f=0;f<3;f++){const c=(t.tierY(a+1)-t.tierY(a))/3,x=2.2,k=t.tierR(a)+t.HD-(3-f)*x,v=k+x,s=t.tierY(a),r=(a%2?1:-1)*(f%2?-1:1),w=5.5/v,M=2,y=s+f*c,S=y+c,A=K=>e.a+r*w*(2*K-1),R=Math.atan2(c,11),D=Math.cos(R),T=Math.sin(R);for(let K=0;K<M;K++){const C=K/M,B=(K+1)/M,q=A(C),j=A(B),O=(q+j)/2,p=y+c*C,g=y+c*B,E=t.pos(k,q),N=t.pos(k,j),F=t.pos(v,q),Q=t.pos(v,j),G=[-Math.sin(O),0,Math.cos(O)];h.kind(H.PAVE).col(n.pave),h.quad([E[0],p,E[1]],[N[0],g,N[1]],[Q[0],g,Q[1]],[F[0],p,F[1]],[-r*T*Math.cos(O),D,-r*T*Math.sin(O)]),h.kind(H.WALL).col(J(n.bastion,.93));const U=p-s,W=g-s,Y=q*k,$=j*k,X=h.vert(E[0],s,E[1],G[0],0,G[2],Y,0,U),Z=h.vert(N[0],s,N[1],G[0],0,G[2],$,0,W),tt=h.vert(N[0],g,N[1],G[0],0,G[2],$,W,W),P=h.vert(E[0],p,E[1],G[0],0,G[2],Y,U,U);h.tri(X,Z,tt),h.tri(X,tt,P)}for(let K=0;K<5;K++){const C=A(K/5),B=A((K+1)/5),q=(C+B)/2,j=y+c*K/5,O=y+c*(K+1)/5,p=O+.95,g=[-Math.sin(q),0,Math.cos(q)],E=t.pos(k,C),N=t.pos(k,B),F=t.pos(k+.3,C),Q=t.pos(k+.3,B),G=C*k,U=B*k;h.kind(H.WALL).col(J(n.bastion,.97));const W=h.vert(E[0],j,E[1],g[0],0,g[2],G,2.2-(p-j),5),Y=h.vert(N[0],O,N[1],g[0],0,g[2],U,2.2-(p-O),5),$=h.vert(N[0],p,N[1],g[0],0,g[2],U,2.2,5),X=h.vert(E[0],p,E[1],g[0],0,g[2],G,2.2,5);h.tri(W,Y,$),h.tri(W,$,X),h.kind(H.STONE).col(n.parapet).quad([E[0],p,E[1]],[N[0],p,N[1]],[Q[0],p,Q[1]],[F[0],p,F[1]],[0,1,0])}const V=A(1),z=t.pos(k,V),I=t.pos(v,V);if(h.kind(H.WALL).move(S-s).col(J(n.bastion,.78)).quad([z[0],s,z[1]],[I[0],s,I[1]],[I[0],S,I[1]],[z[0],S,z[1]],[r*Math.cos(V),0,r*Math.sin(V)],[2,0,4.4,0,4.4,S-s,2,S-s]).move(0),f>0){const K=A(0),C=t.pos(k,K),B=t.pos(v,K);h.kind(H.WALL).move(y-s).col(n.bastion).quad([B[0],s,B[1]],[C[0],s,C[1]],[C[0],y,C[1]],[B[0],y,B[1]],[-r*Math.cos(K),0,-r*Math.sin(K)],[2,0,4.2,0,4.2,y-s,2,y-s]).move(0)}if(f===0)for(const K of[-1,1]){const C=t.tierR(a)+t.HD,B=K>0?Math.ceil((e.a*C+6.4)/6.4):Math.floor((e.a*C-6.4)/6.4),q=B*6.4/C,j=.75/C,O=s+13,p=[-Math.sin(q),0,Math.cos(q)],g=[3.2,.3,3.2,.3,3.2,.3,3.2,.3],E=t.pos(C-1.2,q-j),N=t.pos(C-1.2,q+j),F=t.pos(C-.45,q-j),Q=t.pos(C-.45,q+j),G=t.pos(C,q-j),U=t.pos(C,q+j);h.kind(H.WALL).move(5).col(J(n.bastion,1.03)),h.quad([E[0],s,E[1]],[N[0],s,N[1]],[Q[0],O,Q[1]],[F[0],O,F[1]],p,g),h.col(n.parapet).quad([F[0],O,F[1]],[Q[0],O,Q[1]],[U[0],O+1.1,U[1]],[G[0],O+1.1,G[1]],[p[0]*.6,.8,p[2]*.6],g),h.col(J(n.bastion,.86));for(const[W,Y,$,X]of[[E,F,G,-1],[N,Q,U,1]])h.quad([$[0],s,$[1]],[W[0],s,W[1]],[Y[0],O,Y[1]],[$[0],O+1.1,$[1]],[Math.cos(q)*X,0,Math.sin(q)*X],g);h.move(0)}}return o&&d&&Xt(h,t,n,o,d),h}const $t=30;function Xt(t,n,o,d,h){n.flank=[],n.lanes.forEach((l,m)=>{for(let L=0;L<n.tiersAt(l.a);L++){const i=n.tierY(L),b=(n.tierY(L+1)-i)/3,u=n.tierR(L)+n.HD,e=n.pos(u,l.a),a=d(e[0],i+2,e[1])<$t,f=n.laneHalf/n.tierR(L)*u,c=[],x=t.triangles;let k=0;for(const s of[-1,1]){const r=l.a*u+s*5.5,w=l.a*u+s*f;c.push({R:u,u0:Math.min(r,w),u1:Math.max(r,w),m:s<0?[1.9,.8]:[.8,1.9],foot:()=>0,head:()=>3*b,top:()=>3*b-.14,door:!0,lv:[b,2*b]})}for(let s=1;s<3;s++){const r=u-(3-s)*2.2,w=5.5/(r+2.2),M=(L%2?1:-1)*(s%2?-1:1),y=S=>Math.max(0,Math.min(1,((S/r-l.a)/(M*w)+1)/2));c.push({R:r,u0:(l.a-w)*r,u1:(l.a+w)*r,m:[1.1,1.1],foot:S=>(s-y(S))*b,head:S=>(s+y(S))*b,top:S=>(s+(Math.min(4,Math.floor(y(S)*5))+1)/5)*b+.9,door:!1,lv:[s*b]})}const v=[];for(const s of c)k+=Zt(t,n,o,s,i,a,h,v);a&&n.flank.push({lane:m,tier:L,arches:k,tris:t.triangles-x,things:v})}})}function Zt(t,n,o,d,h,l,m,L){const i=(v,s,r)=>{const w=n.pos(d.R-r,v/d.R);return[w[0],h+s,w[1]]},b=(d.u0+d.u1)/2/d.R,u=[-Math.sin(b),0,Math.cos(b)],e=(v,s,r,w,M)=>t.quad(i(v,r,M),i(s,r,M),i(s,w,M),i(v,w,M),u),a=(v,s,r,w,M)=>t.quad(i(v,s,0),i(v,s,w),i(v,r,w),i(v,r,0),[Math.cos(b)*M,0,Math.sin(b)*M]),f=(v,s,r,w,M)=>t.quad(i(v,r,0),i(s,r,0),i(s,r,w),i(v,r,w),[0,M,0]),c=(v,s,r,w,M)=>{e(v,s,r,w,M),a(v,r,w,M,-1),a(s,r,w,M,1),f(v,s,w,M,1),f(v,s,r,M,-1)};let x=0;const k=[];for(let v=Math.ceil(d.u0/6.4-.5);(v+.5)*6.4<d.u1;v++){const s=(v+.5)*6.4,r=d.head(s),w=m(),M=m.chance(.5),y=[m.range(1.2,3),m.range(1.2,3),m.range(1.2,3)],S=m.pick(o.shutter);if(r>=5.2&&k.push([s,r-2.6]),!l||r<5.2||s<d.u0+d.m[0]||s>d.u1-d.m[1])continue;const A=d.door&&w<.6,R=A?.85:.8,D=A?2.5:2,T=Math.min(d.foot(s-R-.3),d.foot(s+R+.3)),V=Math.max(d.foot(s-R-.3),d.foot(s+R+.3)),z=A?V+.16:d.door?2.4:V+1.7;z+D+.35>r-2.6||(t.kind(H.STONE).col(o.parapet).move(0),A?c(s-R-.3,s+R+.3,T,z,.45):c(s-R-.25,s+R+.25,z-.14,z,.3),c(s-R-.22,s-R,z,z+D,.22),c(s+R,s+R+.22,z,z+D,.22),c(s-R-.22,s+R+.22,z+D,z+D+.25,.22),t.kind(H.TIMBER).col(S),e(s-R,s-.02,z,z+D,.03),e(s+.02,s+R,z,z+D,.03),M&&(t.kind(H.LEAF).col(J(o.leaf[v&1],.8)).move(1),y.forEach((I,K)=>{const C=s-1.5+K,B=d.top(C+.5);e(C,C+1,B-I,B,.06)}),t.move(0)),x++,L.push({at:i(s,z,0),door:A,grn:M}))}if(l)for(const v of d.lv){const s=[d.u0].concat(...k.filter(r=>r[1]>v).map(r=>[r[0]-2.05,r[0]+2.05]),[d.u1]);t.kind(H.STONE).col(o.parapet).move(0);for(let r=0;r<s.length;r+=2){const w=Math.max(d.u0,s[r]),M=Math.min(d.u1,s[r+1]);M-w>.3&&(e(w,M,v-.14,v+.14,.1),f(w,M,v+.14,.1,1),f(w,M,v-.14,.1,-1))}}return x}function Pt(t,n,o,d,h=()=>!0){const l=[],m=o.lime,L=n.int(0,m.length-1),i=m[0],b=m[4],u=()=>{const y=n(),S=n.range(.9,1.05),A=y<.45?i:y<.75?b:ht(n.chance(.5)?m[L]:n.pick(m),i,.5);return[A[0]*S,A[1]*S,A[2]*S]},e=(y=0,S=1)=>{const A=n();return y===0&&S>14*st?A<.55?4:5:A<.3?4:A<.62?5:A<.87||y===0?6:7},a=(y,S,A,R,D,T,V,z,I,K=0)=>{const C=d(y,R+V*1.5,S);l.push({x:y,z:S,yaw:A,y0:R,w:D,nb:T,floors:V,depth:z,kind:I,see:K,tint:u(),d:C,lod:K===2?0:C<52?K===1?1:0:C<110?1:2,roof:n(),chim:n.chance(.16)&&I!=="flank",ph:n(),mason:n.chance(.45)}),f.push(l[l.length-1])},f=l.order=[],c=y=>{const S=Math.sin(y.yaw),A=Math.cos(y.yaw),R=y.y0+y.floors*t.FLOOR+1.5;return[[-.5,0],[.5,0],[-.5,1],[.5,1],[0,.5]].every(([D,T])=>h("house",y.x+A*D*y.w-S*T*y.depth,R,y.z-S*D*y.w-A*T*y.depth,0,0))},x=[],k=t.tierR(0);let v=t.aBastE(),s=1/0;for(let y=t.aBastE();y<t.aMax;y+=1/k)for(let S=t.DECK+2;S<t.rimY+8;S+=2){const A=t.pos(k,y),R=d(A[0],S,A[1]);R<s&&(s=R,v=y)}const r=t.gardenLen=(v-t.aBastE())*k+3*t.bay;for(let y=0;y<t.NT;y++){const S=t.tierR(y),A=t.lanes.map(V=>[V.a-t.laneHalf/S,V.a+t.laneHalf/S]);t.tierR(y)<t.rHead-.5&&A.push([t.aLaneW()-1.2/S,t.aBastE()+(y===0?r:.1)/S]),y===0&&x.push({k:0,r:S,a0:t.aBastE()+.6/S,a1:t.aBastE()+(r-.6)/S}),A.sort((V,z)=>V[0]-z[0]);let R=-t.aMax+2/S,D=null,T=!0;for(;R<t.aMax-6/S;){let V=n.chance(.3)?2:n.chance(.6)?3:4,z=t.bay*n.range(.92,1.1),I=V*z,K=e(y,R),C="tier";const B=n.chance(.2)?n.range(3,7.5):.12,q=y>0&&n.chance(.1),j=n.range(12,19),O=t.towers.find(U=>!U.stands&&U.k===y&&U.a>=R&&U.a<R+((q?Math.max(I,j):I)+B)/S);O?(V=2,I=2*t.bay*.95,K=9,C="tower"):q&&(I=j);const p=A.find(U=>U[1]>R);let g=R+I/S+B/S,E=!1;if(p&&R>=p[0]){R=p[1],T=!0;continue}p&&R+I/S>p[0]-5/S&&(I=(p[0]-R)*S,V=Math.max(1,Math.round(I/t.bay)),g=p[1],E=!0,C==="tower"&&(C="tier",K=4));const N=R+I/2/S,F=R+I/S;if(R=g,t.tiersAt(N)<=y||t.tiersAt(F)<=y||I<2.8){D&&(D.openR=!0),T=!0;continue}if(q&&!E&&C!=="tower"){x.push({k:y,r:S,a0:N-I/2/S,a1:F}),D&&(D.openR=!0),T=!0;continue}const Q=t.pos(S,N),G=y===0?t.rampY(N-I/2/S):t.tierY(y);if(a(Q[0],Q[1],-N,G,I,V,K,t.ROOMD,C),!c(l[l.length-1])){l.pop().gone=!0,G<t.tierY(y)+.01&&x.push({k:y,r:S,a0:N-I/2/S,a1:F}),D&&(D.openR=!0),T=!0;continue}G>t.tierY(y)+.01&&(l[l.length-1].back=t.tierY(1)-G),C==="tower"&&(O.stands=!0),C==="tower"&&D&&(D.openR=!0),D=l[l.length-1],D.openL=T||C==="tower",T=B>2||E||C==="tower",T&&(D.openR=!0)}D&&(D.openR=!0)}for(const y of[-1]){const S=t.tierR(1)+1,A=y<0?t.aLaneE()+.8/S:t.aI+t.alpha+1.2/S,R=y<0?t.aI-t.alpha-1.2/S:t.aBastE()-.8/S;x.push({k:1,r:S,a0:A,a1:R})}l.gardens=x;const w=Math.round(t.inletD/(2*t.bay*1)),M=t.inletD/w;for(let y=0;y<w;y++){const S=t.RQ+(y+.5)*M;for(const A of[-1,1]){if(A>0&&y>0)continue;const R=A>0?t.QW:M,D=t.aI+A*t.alpha,T=t.pos(A>0?t.RQ+R/2:S,D),V=Math.atan2(-A*Math.cos(D),-A*Math.sin(D));a(T[0],T[1],V,t.DECK,R,2,t.RIMF,t.ROOMD,"flank",2),y===0&&(l[l.length-1][A<0?"openL":"openR"]=!0),A>0&&(l[l.length-1].openL=l[l.length-1].openR=!0)}}for(const y of[-1,1]){const S=t.FB/293*t.RQ-5.3,A=t.aI+y*(t.alpha+(5.3+S/2)/t.RQ),R=t.pos(t.RQ,A);a(R[0],R[1],-A,t.DECK,S,1,t.RIMF,4.4,"flank"),l[l.length-1][y<0?"openL":"openR"]=!0}t.headLots=[[2.2,8.3,5],[13.9,6.4,4],[22.5,9,6],[34.5,6.2,5]];for(const[y,S,A]of t.headLots){const R=t.aI-t.alpha+(y+S/2)/t.rFront,D=t.pos(t.rFront,R);a(D[0],D[1],-R,t.DECK,S,2,A,t.ROOMD,"harbour",2),l[l.length-1].openL=l[l.length-1].openR=!0}t.eastLots=[[2.2,6,4],[10.6,6.4,6]];for(const[y,S,A]of t.eastLots){const R=t.rPier+y+S/2,D=t.aBastE()-5.6/R,T=t.pos(R,D);a(T[0],T[1],Math.atan2(-Math.cos(D),-Math.sin(D)),t.DECK,S,2,A,t.ROOMD,"harbour",2),l[l.length-1].openL=l[l.length-1].openR=!0}for(const y of[t.isle,t.isle2])if(y)for(const S of[1,-1]){const[A,R,D,T]=y,V=3*t.bay*.95;a(A+D*t.ROOMD*S,R+T*t.ROOMD*S,Math.atan2(D*S,T*S),y===t.isle?2:t.DECK,V,3,5,t.ROOMD,"tower",2);const z=l[l.length-1];z.openL=z.openR=!0,z.back=99}for(const[y,S,A,R]of t.gates||[]){a(y,S,Math.atan2(A,R),t.rimY,6,2,n.chance(.5)?4:3,t.ROOMD,"tier");const D=l[l.length-1];D.openL=D.openR=!0,D.verandasOnly=!0}for(const[y,S,A,R,D,T]of t.moleRow||[])a(y,S,Math.atan2(A,R),t.DECK,D,2,T,t.ROOMD,"harbour",2),l[l.length-1].openL=l[l.length-1].openR=!0;for(let y=l.length-1;y>=0;y--){const S=l[y];(S.kind==="harbour"||S.kind==="tower"||S.verandasOnly)&&S.openL&&S.openR&&!c(S)&&(S.gone=!0,l.splice(y,1))}return l}const te=.3,ee=.9,Be=new _.Matrix4,rt=new _.Matrix4,wt=new _.Matrix4,nt=new _.Matrix4,dt=(t,n)=>n%4===0&&!t.verandasOnly&&(n===0||t.floors>7);function xt(t,n){const o=t.tiersAt(n.a),d=t.tierR(o)+5,h=6*t.bay*.95,l=Math.sin(n.a*57)>0?1:-1,m=b=>n.a+b*(n.half+(h/2+3.5)/d),L=b=>t.tiersAt(m(b))===o&&t.tiersAt(m(b)+b*(h/2)/d)===o,i=L(l)||!L(-l)?l:-l;return{nt:o,rF:d,w:h,sd:i,level:L(i),a:m(i),yH:t.tierY(o)+5,y0:t.tierY(o)+9}}function oe(t,n,o,d){const h=xt(t,n),l=t.pos(h.rF,h.a),m=[.74,.52,.27];return{x:l[0],z:l[1],yaw:-h.a,y0:h.y0,w:h.w,nb:6,floors:7,depth:t.ROOMD,kind:"crest",see:0,tint:m,d:d(l[0],h.y0+13,l[1]),lod:1,roof:.2,chim:!1,ph:.37,mason:!1,openL:!0,openR:!0,verandasOnly:!0,back:0,own:!0}}function ae(t){return new _.Matrix4().makeTranslation(t.x,t.y0,t.z).multiply(rt.makeRotationY(t.yaw))}async function Nt(t,n,o,d,h){let l=0;const m={rooms:[],roomsF:[],roomsL:[],roomsR:[],rails:[],curtN:[],curtF:[],lamps:[],posts:[],sets:[[],[],[],[],[],[],[]],toprail:[],stats:{lit:0,cloth:0}},L=(i,b,u,e,a,f,c)=>new _.Matrix4().copy(i).multiply(wt.makeTranslation(b,u,e)).multiply(nt.makeScale(a,f,c));for(const i of h.own?n:n.order||n){if(!i.own!=!h.own)continue;h.rest&&++l%60===0&&await h.rest();const b=ae(i),u=i.lod===2?1:i.nb,e=i.w/u,a=ht(i.tint,[.62,.5,.4],.22),f=i.mason||i.kind==="tower"?i.lod===0?ht(d.parapet,i.tint,.1):J(i.tint,1.04):d.timber,c=0,x=o.cloth.range(te,ee),k=x*Math.min(1.25,h.density+.1),v=r=>i.lod===0&&(i.see===2||h.distToLine(b.elements[12],b.elements[13]+r,b.elements[14])<40),s=()=>{o.lamps.chance(h.night>.5?.78:.5*x*h.density)&&o.lamps.range(.7,1.15),o.rooms(),o.rooms();const r=o.cloth();o.cloth(),o.cloth(),o.cloth.pick(d.cloth),o.cloth.chance(.4),r<k&&(o.cloth.range(.7,1.15),o.cloth.range(2.1,2.55),r>=.43*k&&o.cloth.chance(.5))};if(i.gone){for(let r=0;r<i.floors;r++)for(let w=0;w<i.nb;w++)dt(i,r)?o.cloth():s();continue}for(let r=0;r<i.floors;r++){const w=r*t.FLOOR+.14;if(dt(i,r)){const A=t.FLOOR-.3,R=ht(d.bastion,[.62,.5,.4],.12);(i.lod===2?m.roomsF:m.rooms).push({m:L(b,0,w+A/2,-i.depth/2-.02,i.w-.1,A,i.depth),a:[.5,0,.5,0],c:R}),r>0&&m.rails.push({m:L(b,0,w,.06,i.w,.98,1),a:[.5,0,.5,0],c:d.parapet});for(let D=0;D<i.nb;D++){const T=i.w/i.nb,V=Math.min(T/2-.42,1.7),z=D*7+Math.round(i.ph*97),I=V*1.15,K=z%2?1:-1;o.cloth()>=k||((v(w)?m.curtN:m.curtF).push({m:L(b,-i.w/2+(D+.5)*T+K*(V-I/2),w+2.56,-.5,I,2.32,1),a:[z*.37%1,0,z*.61%1,0],c:ht([.72,.66,.55],d.cloth[(z>>1)%5],.16)}),m.stats.cloth++)}continue}let M=null,y=null;for(let A=0;A<u;A++){const R=-i.w/2+(A+.5)*e,D=e-.34,T=t.FLOOR-.3,V=h.night>.5?.78:.5*x*h.density;let z=o.lamps.chance(V)?o.lamps.range(.7,1.15):0;const I=o.rooms(),K=o.rooms();i.own&&(z=K>.84?.75+.4*I:0);const C=i.kind==="tier"&&r===1&&i.lod===0&&i.d<30&&i.y0<t.tierY(1)-1&&K>.86,B=C?7.6:i.depth;C&&(z=1.1),z>0&&m.stats.lit++;const q={m:L(b,R,w+T/2,-B/2,C?D:e-.012,T,B),a:[I,z,K,C?.48:.05+.4*i.ph],c:C?a:i.tint},j=A===0&&i.openL,O=A===u-1&&i.openR&&!j;if((j?m.roomsL:O?m.roomsR:i.lod===2?m.roomsF:m.rooms).push(q),m.rails.push({m:L(b,R,w,-.07,D,.98,1),a:[I,0,K,c],c:f}),j||O){const X=j?-1:1,Z=new _.Matrix4().copy(b).multiply(wt.makeTranslation(X*(i.w/2-.1),w,-B/2)).multiply(rt.makeRotationY(X*Math.PI/2)).multiply(nt.makeScale(B,.98,1));m.rails.push({m:Z,a:[I,0,K,c],c:f})}const p=o.cloth(),g=o.cloth(),E=o.cloth(),N=o.cloth.pick(d.cloth),F=o.cloth.chance(.4)?1:0,Q=p<k,G=d.cloth[1],U=d.cloth[5],W=Q&&M&&y&&M[2]>.3&&(N===G&&y===U||N===U&&y===G)?d.cloth[6]:N;if(y=M,M=Q?W:null,Q){const X=p<.43*k,Z=X?D*o.cloth.range(.55,.92):o.cloth.range(.7,1.15),tt=X?o.cloth.range(.7,1.5):o.cloth.range(2.1,2.55),P=X?R:R+(o.cloth.chance(.5)?-1:1)*(D/2-Z/2-.05);(v(w)?m.curtN:m.curtF).push({m:L(b,P,w+T-.04,-.2,Z,tt,1),a:[g,0,E,F],c:W}),m.stats.cloth++}const Y=q.m.elements,$=i.see===2?0:i.own?20:i.lod===0?h.distToLine(Y[12],Y[13],Y[14]):999;$>9&&$<42&&!Q&&E>.6&&!C&&(m.curtN.push({m:L(b,R+(g-.5)*(D-1.2),w+1,0,.7+.5*g,.5+.2*E,1),a:[g,0,E,0],c:g<.5?d.cloth[6]:[.86,.84,.78]}),m.stats.cloth++),$<42&&(m.toprail.push({m:L(b,R,w+.98,-.07,D,1,1),a:[0,0,0,0],c:f}),$<31&&m.lamps.push({m:L(b,R+(K-.5)*.5,w+T,C?-1.7-I*.8:-.8-I*.6,1,1,1),a:[I,z,K,0],c:[1,.78,.45]}),(C||$<24)&&m.sets[C?6:Math.floor(K*5.999)].push({m:L(b,R,w,-i.depth/2,Math.min(1,D/3.3)*(I<.5?1:-1),1,1),a:[I,z,K,2],c:d.cloth[Math.floor(I*4.999)]}))}for(let A=u;A<i.nb;A++)s();const S=i.own||i.lod===0&&(i.see===2||h.distToLine(b.elements[12],b.elements[13]+w+1.4,b.elements[14])<44);if(S){for(const A of[i.openL?-1:0,i.openR?1:0])if(A)for(const R of[.5,1])m.posts.push({m:L(b,A*(i.w/2-.1),w-.14,-i.depth*R+.1,1,t.FLOOR,1),a:[0,0,0,0],c:d.timber})}if(S)for(let A=0;A<=u;A++)m.posts.push({m:L(b,Math.max(-i.w/2+.2,Math.min(i.w/2-.2,-i.w/2+A*e)),w-.14,t.PROUD,1,t.FLOOR,1),a:[0,0,0,0],c:d.timber})}}return m}async function ne(t,n,o,d=null,h=()=>!0){const l=at(),m=[];let L=0;for(const i of n){let R=function(){return S<.07?J(ht(o.tile,[.48,.085,.04],.6),.88+.26*i.ph):S<.47?J(o.slate,.95+.3*i.ph):S<.57?J(ht(o.slate,[.27,.28,.12],.55),.9+.24*i.ph):S<.8?J(ht(o.slate,[.1,.33,.3],.68),.92+.2*i.ph):J([.3,.19,.11],.85+.3*i.ph)};d&&++L%40===0&&await d();const b=Math.cos(i.yaw),u=Math.sin(i.yaw),e=i.floors*t.FLOOR,a=i.w/2,f=i.kind==="flank"||i.kind==="back"||i.kind==="side",c=i.kind==="tier"?t.HD:i.kind==="back"?t.ROOMD:f?5.5:i.depth+.3,x=i.lod===2?1:i.nb,k=i.w/x,v=(B,q,j)=>[i.x+B*b+j*u,i.y0+q,i.z-B*u+j*b],s=(B,q,j)=>[B*b+j*u,q,-B*u+j*b],r=(B,q,j,O,p)=>l.quad(v(B[0],B[1],B[2]),v(q[0],q[1],q[2]),v(j[0],j[1],j[2]),v(O[0],O[1],O[2]),s(p[0],p[1],p[2])),w=i.roof<.35?o.timber:J(i.tint,1.07),M=(B,q)=>{const j=.3*B[0]+.5*B[1]+.2*B[2];return J(ht(B,[j,j,j*1.03],q),.9)},y=i.kind==="harbour",S=y?i.roof<.5?.3:i.roof<.78?.7:.9:i.roof,A=i.own?J(o.slate,.8):y?J(M(R(),.5),i.roof<.5?.8:i.roof<.78?1.2:.9):M(R(),S<.07?.5:.34);for(const B of[-1,1]){const q=B*a,j=B<0?i.openL:i.openR,O=i.depth;if(!j){const E=i.kind==="tier"&&i.y0<=t.DECK+.1;if(l.kind(E?H.STONE:H.LIME).col(E?ht(o.bastion,i.tint,.25):i.tint),r([q,0,0],[q,0,-c],[q,e,-c],[q,e,0],[B,0,0]),i.kind!=="tier"||i.y0>t.DECK+.1)continue;const N=q+B*.035,F=(G,U,W,Y,$=0)=>r([N+B*$,W,G],[N+B*$,W,U],[N+B*$,Y,U],[N+B*$,Y,G],[B,0,0]);l.kind(H.STONE).col(o.bastion),F(0,-.55,0,e),F(.04,-.63,t.FLOOR-.22,t.FLOOR,.03);for(let G=1;G<i.floors;G++)F(-.55,-c,G*t.FLOOR-.1,G*t.FLOOR+.08);l.col(o.parapet),F(-1.5,-2.7,0,2.3,.01),r([N,.16,-1.4],[N,.16,-2.8],[N+B*.34,.16,-2.8],[N+B*.34,.16,-1.4],[0,1,0]),r([N+B*.34,0,-1.4],[N+B*.34,0,-2.8],[N+B*.34,.16,-2.8],[N+B*.34,.16,-1.4],[B,0,0]),l.kind(H.TIMBER).col(o.shutter[Math.floor(i.ph*97)%o.shutter.length]),F(-1.65,-2.55,.16,2.15,.03),l.kind(H.ROOM).col(J(i.tint,.4)),F(-1.85,-2.35,2.75,3.5,.01);const Q=v(N+B*.06,2.95,-2.1);l.kind(H.LAMP).col([3.2,2.4,1.3]).move(1).box(Q[0]-.09,Q[1],Q[2]-.09,Q[0]+.09,Q[1]+.26,Q[2]+.09,"y").move(0),l.kind(H.LEAF).col(J(o.leaf[0],.8+.3*i.ph)),F(-3.6,-6.2,0,2.2+1.4*i.ph,.05);continue}l.kind(H.STONE).col(o.bastion),r([q,0,0],[q,0,-c],[q,t.FLOOR,-c],[q,t.FLOOR,0],[B,0,0]),c>O+.1&&r([q,t.FLOOR,-O],[q,t.FLOOR,-c],[q,e,-c],[q,e,-O],[B,0,0]);const p=q+B*t.EAVE,g=q+B*(t.PROUD-.01);for(let E=1;E<=i.floors;E++){const N=E*t.FLOOR;l.kind(H.STONE).col(o.bastion),r([q+B*.02,N-.16,.02],[q+B*.02,N-.16,-O],[q+B*.02,Math.min(e,N+.14),-O],[q+B*.02,Math.min(e,N+.14),.02],[B,0,0]),!(E===1||E===i.floors&&!f||i.kind==="harbour"||i.kind==="flank")&&(l.kind(H.SLATE).col(A),l.quad(v(p,N-.2,t.EAVE),v(p,N-.2,-O),v(q,N+.02,-O),v(q,N+.02,t.EAVE),s(B*.355,.935,0),[0,0,1,0,1,.34,0,.34]),l.kind(H.TIMBER).col(o.timber),r([p,N-.27,t.EAVE],[p,N-.27,-O],[p,N-.2,-O],[p,N-.2,t.EAVE],[B,0,0]))}l.kind(H.TIMBER).col(o.timber);for(const E of[-O+.1,-O+.34,-O/2-.12,-O/2+.12])r([g,t.FLOOR,E-.035],[g,t.FLOOR,E+.035],[g,e-.2,E+.035],[g,e-.2,E-.035],[B,0,0])}const D=i.back===void 0?t.TR:Math.max(0,i.back);e>D+.1&&!f&&(l.kind(H.LIME).col(i.tint),r([a,D,-c],[-a,D,-c],[-a,e,-c],[a,e,-c],[0,0,-1]));const T=t.PROUD-.01;for(let B=0;B<i.floors;B++){if(dt(i,B)||B>0&&!dt(i,B-1))continue;let q=B+1;for(;q<i.floors&&!dt(i,q);)q++;l.kind(H.TIMBER).col(o.timber);for(let j=0;j<=i.nb;j++){const O=Math.max(-a+.2,Math.min(a-.2,-a+j*i.w/i.nb));for(const p of[-.12,.12])r([O+p-.035,B*t.FLOOR,T],[O+p+.035,B*t.FLOOR,T],[O+p+.035,q*t.FLOOR-.2,T],[O+p-.035,q*t.FLOOR-.2,T],[0,0,1])}}for(let B=0;B<=i.floors;B++){const q=Math.max(0,B*t.FLOOR-.16),j=Math.min(e,B*t.FLOOR+.14),O=B*t.FLOOR,p=t.EAVE,g=B<i.floors&&dt(i,B)||B>0&&dt(i,B-1);l.kind(g?H.STONE:i.roof<.35?H.TIMBER:H.LIME).col(g?o.bastion:w),r([-a,q,.02],[a,q,.02],[a,j,.02],[-a,j,.02],[0,0,1]),!(B===0||dt(i,B-1)||B===i.floors&&!f||i.kind==="harbour"||i.kind==="flank")&&(l.kind(H.SLATE).col(A),l.quad(v(-a,O-.2,p),v(a,O-.2,p),v(a,O+.02,.02),v(-a,O+.02,.02),s(0,.935,.355),[0,0,1,0,1,.34,0,.34]),l.kind(H.TIMBER).col(o.timber),r([-a,O-.27,p],[a,O-.27,p],[a,O-.2,p],[-a,O-.2,p],[0,0,1]),i.lod<2&&l.col(J(o.timber,.8)).quad(v(-a,O-.16,.02),v(a,O-.16,.02),v(a,O-.27,p),v(-a,O-.27,p),s(0,-1,0)))}const V=J(o.bastion,.94+.1*i.ph),z=i.w/i.nb,I=Math.min(z/2-.42,1.7),K=2.5-I,C=.45;for(let B=0;B<i.floors;B++){if(!dt(i,B))continue;const q=B*t.FLOOR;if(i.lod>0||i.d>27){l.kind(H.ARCADE).col(V).move(z),l.quad(v(-a,q,.01),v(a,q,.01),v(a,q+3,.01),v(-a,q+3,.01),s(0,0,1),[0,0,i.nb,0,i.nb,3,0,3]),l.move(0);continue}for(let j=0;j<i.nb;j++){const O=-a+(j+.5)*z,p=O-z/2,g=O+z/2;l.kind(H.STONE).col(V),r([p,q,.01],[O-I,q,.01],[O-I,q+3,.01],[p,q+3,.01],[0,0,1]),r([O+I,q,.01],[g,q,.01],[g,q+3,.01],[O+I,q+3,.01],[0,0,1]);for(let N=0;N<5;N++){const F=Math.PI*N/5,Q=Math.PI*(N+1)/5,G=(F+Q)/2,U=O-I*Math.cos(F),W=O-I*Math.cos(Q),Y=q+K+I*Math.sin(F),$=q+K+I*Math.sin(Q);l.col(V),r([U,Y,.01],[W,$,.01],[W,q+3,.01],[U,q+3,.01],[0,0,1]),l.col(J(V,.74)),r([U,Y,.01],[U,Y,-C],[W,$,-C],[W,$,.01],[Math.cos(G),-Math.sin(G),0])}l.col(J(V,.8)),r([O-I,q,.01],[O-I,q,-C],[O-I,q+K,-C],[O-I,q+K,.01],[1,0,0]),r([O+I,q,-C],[O+I,q,.01],[O+I,q+K,.01],[O+I,q+K,-C],[-1,0,0]);const E=j+Math.round(i.ph*53);if(i.d>9&&i.d<26&&E%4!==1&&Math.atan2(i.x,-i.z)>t.rampA0-.05&&Math.atan2(i.x,-i.z)<t.rampA1+.012){const N=1.3+.2*(E%4),F=.75+.07*(E%3);l.kind(H.LEAF).col(J(o.leaf[(E>>1)%2],.78)).move(1),r([g-.28,q+3-N,.09],[g+.28,q+3-N,.09],[g+F,q+3.02,.09],[g-F,q+3.02,.09],[0,.2,.98]),l.move(0)}}}if(f){l.kind(H.PAVE).col(o.pave),r([-a,e,0],[a,e,0],[a,e,-c],[-a,e,-c],[0,1,0]),l.kind(H.STONE).col(J(o.parapet,.7)),r([-a,e-.3,.03],[a,e-.3,.03],[a,e,.03],[-a,e,.03],[0,0,1]);const B=-a+(i.cutRail===-1?4.8:0),q=a-(i.cutRail===1?4.8:0);r([B,e+1.1,.03],[q,e+1.1,.03],[q,e+1.1,-.2],[B,e+1.1,-.2],[0,1,0]),l.kind(H.RAIL),r([B,e,.03],[q,e,.03],[q,e+1.1,.03],[B,e+1.1,.03],[0,0,1]);const j=Math.max(1,Math.round((q-B)/3.4));for(let O=0;O<j;O++){const p=B+(q-B)*(O+.5)/j,g=p-.2,E=p+.2,N=-.3,F=.1,Q=e+1.3;l.kind(H.STONE).col(J(o.parapet,.8)),r([g,e,F],[E,e,F],[E,Q,F],[g,Q,F],[0,0,1]),r([E,e,N],[g,e,N],[g,Q,N],[E,Q,N],[0,0,-1]),r([g,e,N],[g,e,F],[g,Q,F],[g,Q,N],[-1,0,0]),r([E,e,F],[E,e,N],[E,Q,N],[E,Q,F],[1,0,0]),r([g,Q,F],[E,Q,F],[E,Q,N],[g,Q,N],[0,1,0])}}else{const B=i.own?2.6:.9,q=i.own?2:.3,j=a+q,O=B,p=-c-q,g=j,E=(O-p)/2,N=Math.min(g,E),F=Math.max(0,Math.round((i.y0-t.DECK)/t.TR)-1),Q=N*(i.kind==="tower"?1.5:.5+.11*F),G=g-N,U=E-N,W=(O+p)/2,Y=e-.1,$=Math.hypot(Q,N),X=N/$,Z=Q/$;l.kind(H.SLATE).col(A).move(1),l.quad(v(-j,Y,O),v(j,Y,O),v(G,Y+Q,W+U),v(-G,Y+Q,W+U),s(0,X,Z),[0,0,1,0,1,.6,0,.6]),l.quad(v(j,Y,p),v(-j,Y,p),v(-G,Y+Q,W-U),v(G,Y+Q,W-U),s(0,X,-Z),[0,0,1,0,1,.6,0,.6]),l.quad(v(j,Y,O),v(j,Y,p),v(G,Y+Q,W-U),v(G,Y+Q,W+U),s(Z,X,0),[0,0,1,0,1,.6,0,.6]),l.quad(v(-j,Y,p),v(-j,Y,O),v(-G,Y+Q,W+U),v(-G,Y+Q,W-U),s(-Z,X,0),[0,0,1,0,1,.6,0,.6]);const tt=i.own?.5:.1;if(l.move(0).kind(H.TIMBER).col(i.own?J(o.timber,.3):o.timber),r([-j,Y-tt,O],[j,Y-tt,O],[j,Y,O],[-j,Y,O],[0,0,1]),i.own)for(const P of[-1,1])r([P*j,Y-tt,P>0?O:p],[P*j,Y-tt,P>0?p:O],[P*j,Y,P>0?p:O],[P*j,Y,P>0?O:p],[P,0,0]);if(l.col(J(o.timber,i.own?.22:.8)),r([-j,e-.16,.02],[j,e-.16,.02],[j,Y-tt,O],[-j,Y-tt,O],[0,-1,0]),i.chim&&i.kind==="tier"){const P=(i.ph-.5)*(i.w-1.4),et=-c+1.2,it=e+.3,ct=e+Q+.9;l.kind(H.LIME).col(J(i.tint,.92)),r([P-.3,it,et+.3],[P+.3,it,et+.3],[P+.3,ct,et+.3],[P-.3,ct,et+.3],[0,0,1]),r([P+.3,it,et-.3],[P-.3,it,et-.3],[P-.3,ct,et-.3],[P+.3,ct,et-.3],[0,0,-1]),r([P-.3,it,et-.3],[P-.3,it,et+.3],[P-.3,ct,et+.3],[P-.3,ct,et-.3],[-1,0,0]),r([P+.3,it,et+.3],[P+.3,it,et-.3],[P+.3,ct,et-.3],[P+.3,ct,et+.3],[1,0,0]),m.push({p:v(P,ct,et),d:i.d,ph:i.ph})}}}for(const i of n.gardens||[]){const b=t.pos(i.r,i.a0),u=t.pos(i.r,i.a1),e=t.pos(i.r+.3,i.a0),a=t.pos(i.r+.3,i.a1),f=t.tierY(i.k),c=(i.a0+i.a1)/2,x=[-Math.sin(c),0,Math.cos(c)];l.kind(H.STONE).col(o.parapet),l.quad([b[0],f+1,b[1]],[u[0],f+1,u[1]],[a[0],f+1,a[1]],[e[0],f+1,e[1]],[0,1,0]),l.kind(H.RAIL).quad([b[0],f,b[1]],[u[0],f,u[1]],[u[0],f+1,u[1]],[b[0],f+1,b[1]],x);const k=(i.a1-i.a0)*i.r,v=Math.max(3,Math.round(k/3.4)),s=f+2.8,r=(A,R,D)=>{const T=t.pos(A,R);return[T[0],D,T[1]]},w=i.a0+.8/i.r,M=i.a1-.8/i.r,y=i.r+1,S=i.r+4.4;l.kind(H.TIMBER).col(o.timber);for(let A=0;A<=v;A++){const R=w+(M-w)*A/v;if([y,S].every(D=>{const T=t.pos(D,R);return h("pergola post",T[0],s,T[1])})){for(const D of[y,S]){const T=t.pos(D,R);l.box(T[0]-.07,f,T[1]-.07,T[0]+.07,s,T[1]+.07,"yY")}l.quad(r(y-.4,R-.06/y,s+.1),r(S+.4,R-.06/S,s+.1),r(S+.4,R+.06/S,s+.1),r(y-.4,R+.06/y,s+.1),[0,1,0]),l.quad(r(y-.4,R,s-.04),r(S+.4,R,s-.04),r(S+.4,R,s+.1),r(y-.4,R,s+.1),[Math.cos(R),0,Math.sin(R)])}}for(const A of[y,S])l.quad(r(A,w,s-.16),r(A,M,s-.16),r(A,M,s),r(A,w,s),x);l.kind(H.LEAF).col(J(o.leaf[0],.9)).move(.3),l.quad(r(y-.2,w,s+.16),r(y-.2,w+(M-w)*.68,s+.16),r(S+.2,w+(M-w)*.68,s+.16),r(S+.2,w,s+.16),[0,1,0]),l.move(0)}return{g:l,chimneys:m}}H.RAIL=12,H.ARCADE=13,H.WALL=14;const ut=.12;function se(){const t={},n=(i,b=0)=>(i.move(2).quad([-.5,-.5,ut],[.5,-.5,ut],[.5,.5,ut],[-.5,.5,ut],[0,0,1]),b&&i.move(3).quad([b*.5,-.5,-.5],[b*.5,-.5,ut],[b*.5,.5,ut],[b*.5,.5,-.5],[b,0,0]),i.move(0));t.room=n(at().kind(H.ROOM).room(-.5,-.5,-.5,.5,.5,.5)).build(),t.roomF=n(at().kind(H.ROOM).room(-.5,-.5,-.5,.5,.5,.5,!0)).build();const o=i=>{const b=at().kind(H.ROOM),u=-i*.5;return b.quad([u,-.5,i*.5],[u,-.5,-i*.5],[u,.5,-i*.5],[u,.5,i*.5],[i,0,0],[1,0,0,0,0,1,1,1]),b.quad([-.5,-.5,.5],[.5,-.5,.5],[.5,-.5,-.5],[-.5,-.5,-.5],[0,1,0],[0,1,1,1,1,0,0,0]),b.quad([-.5,.5,-.5],[.5,.5,-.5],[.5,.5,.5],[-.5,.5,.5],[0,-1,0]),b.quad([-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5],[0,0,1]),n(b,i).build()};t.roomL=o(-1),t.roomR=o(1),t.rail=at().kind(H.RAIL).quad([-.5,0,0],[.5,0,0],[.5,1,0],[-.5,1,0],[0,0,1]).build(),t.toprail=at().kind(H.TIMBER).box(-.5,-.05,-.06,.5,.05,.06,"xXyz").build();const d=(i,b)=>{const u=at().kind(H.CLOTH);for(let e=0;e<=b;e++)for(let a=0;a<=i;a++)u.vert(a/i-.5,-e/b,0,0,0,1,a/i,e/b,e/b);for(let e=0;e<b;e++)for(let a=0;a<i;a++){const f=e*(i+1)+a,c=f+1,x=f+i+1,k=x+1;u.tri(f,x,c),u.tri(c,x,k)}return u.build()};t.clothN=d(1,4),t.clothF=d(1,1);const h=at().kind(H.LAMP).col([.25,.2,.15]).move(0);h.quad([-.012,0,0],[.012,0,0],[.012,-.7,0],[-.012,-.7,0],[0,0,1]),h.col([3.6,3.6,3.6]).move(1);const l=[[.13,-.84,0],[0,-.84,.13],[-.13,-.84,0],[0,-.84,-.13]];for(let i=0;i<4;i++){const b=l[i],u=l[(i+1)%4],e=(b[0]+u[0])*3.8,a=(b[2]+u[2])*3.8,f=h.vert(0,-.68,0,e,.5,a),c=h.vert(b[0],b[1],b[2],e,.5,a),x=h.vert(u[0],u[1],u[2],e,.5,a);h.tri(f,c,x);const k=h.vert(0,-1,0,e,-.5,a),v=h.vert(b[0],b[1],b[2],e,-.5,a),s=h.vert(u[0],u[1],u[2],e,-.5,a);h.tri(k,s,v)}t.lamp=h.build();const m=at().kind(H.TIMBER),L=.933;for(const i of[-.12,.12]){const u=[0,1,2].map(a=>[i+.06*Math.sin(a*2.094),.06*Math.cos(a*2.094)-.02]);for(let a=0;a<3;a+=2){const f=u[a],c=u[(a+1)%3],x=(f[0]+c[0])/2-i,k=(f[1]+c[1])/2+.02,v=Math.hypot(x,k);m.quad([f[0],0,f[1]],[c[0],0,c[1]],[c[0],L,c[1]],[f[0],L,f[1]],[x/v,0,k/v])}const e=Math.sign(i);m.tri(m.vert(i,.77,.03,e,0,0),m.vert(i,.905,.37,e,0,0),m.vert(i,.905,.03,e,0,0))}return m.quad([-.19,.895,.05],[.19,.895,.05],[.19,L,.05],[-.19,L,.05],[0,0,1]),t.post=m.build(),t}const Et=[-1,0,0];function ie(t){const n=ot("#c9a66b"),o=ot("#b08d5c"),d=[.86,.84,.78],h=(u,e,a,f,c)=>{const x=Math.cos(c),k=Math.sin(c),v=(r,w,M)=>[e+r*x+M*k,w,a-r*k+M*x],s=f/2;u.kind(H.TIMBER).col(o),u.quad(v(-s,.44,.17),v(s,.44,.17),v(s,.44,-.17),v(-s,.44,-.17),[0,1,0]),u.quad(v(-s,.38,.17),v(s,.38,.17),v(s,.44,.17),v(-s,.44,.17),[k,0,x]);for(const r of[-s+.08,s-.08])u.quad(v(r,0,.15),v(r,0,-.15),v(r,.38,-.15),v(r,.38,.15),[x,0,-k])},l=(u,e,a,f)=>{u.kind(H.TIMBER).col(n).box(e-f,0,a,e+f,.95,a+.48,"yz"),u.col(o).quad([e-f,.46,a+.485],[e+f,.46,a+.485],[e+f,.5,a+.485],[e-f,.5,a+.485],[0,0,1]),u.kind(H.GLASS).col([1,1,1]).quad([e-f*.85,1.2,a+.03],[e+f*.85,1.2,a+.03],[e+f*.85,1.7,a+.03],[e-f*.85,1.7,a+.03],[0,0,1])},m=(u,e,a)=>{u.kind(H.TIMBER).col(n).box(e-.6,.7,a-.4,e+.6,.76,a+.4,"y");for(const f of[-.49,.49])u.quad([e+f,0,a-.3],[e+f,0,a+.3],[e+f,.7,a+.3],[e+f,.7,a-.3],[f>0?1:-1,0,0]);u.kind(H.LIME).col(d).quad([e-.6,.765,a+.2],[e+.6,.765,a+.2],[e+.6,.765,a-.2],[e-.6,.765,a-.2],[0,1,0]),u.col([.92,.9,.86]);for(const f of[-.3,.3])u.quad([e+f-.1,.775,a+.1],[e+f+.1,.775,a+.1],[e+f+.1,.775,a-.1],[e+f-.1,.775,a-.1],[0,1,0]);u.col(t.jug).box(e-.06,.77,a-.33,e+.06,1,a-.21,"yYz")},L=(u,e,a)=>{u.kind(H.TIMBER).col(n).box(e-.55,.12,a-1,e+.55,.42,a+1,"y"),u.quad([e-.57,0,a-1.02],[e+.57,0,a-1.02],[e+.57,.9,a-1.02],[e-.57,.9,a-1.02],[0,0,1]),u.kind(H.LIME).col(d).box(e-.4,.42,a-.92,e+.4,.55,a-.55,"yxXz"),u.col(Et).box(e-.55,.42,a-.45,e+.55,.5,a+1,"yz")},i=(u,e,a,f)=>{u.kind(H.LIME).col(ht(t.pot[1],t.parapet,.3)).box(e-.17,0,a-.17,e+.17,.4,a+.17,"yYz"),u.kind(H.LEAF).col(t.leaf[f%2]).box(e-.3,.4,a-.3,e+.3,.9,a+.3,"yz")},b=[0,1,2,3,4,5,6].map(()=>at());return m(b[0],-.2,1.5),h(b[0],-.2,2.12,1.1,0),h(b[0],-.2,.88,1.1,0),l(b[0],.75,-2.48,.6),L(b[1],-.85,-1.4),l(b[1],.8,-2.48,.5),h(b[1],.6,1.45,.8,1.2),re(b,{wood:n,dark:o,linen:d,bench:h,chest:l,table:m,pal:t}),i(b[0],1.25,2.1,0),i(b[1],-1.2,2.05,1),i(b[2],1.2,2,0),i(b[3],1.25,1,1),i(b[4],-1.2,2.1,0),i(b[4],1.2,2.1,1),i(b[5],-1.25,1.9,1),b.map(u=>u.build())}function re(t,n){const{wood:o,dark:d,linen:h,bench:l,chest:m,table:L,pal:i}=n;let b=t[2];b.kind(H.TIMBER).col(o).box(-1,.72,-2.48,.5,.78,-1.8,"y");for(const e of[-.95,.45])b.quad([e,0,-2.45],[e,0,-1.85],[e,.72,-1.85],[e,.72,-2.45],[e>0?1:-1,0,0]);b.kind(H.LIME).col(h).quad([-.5,.785,-1.9],[-.1,.785,-1.9],[-.1,.785,-2.2],[-.5,.785,-2.2],[0,1,0]);for(let e=0;e<3;e++){const a=1.25+e*.42;b.kind(H.TIMBER).col(d).box(-1.3,a,-2.48,1.3,a+.04,-2.22,"zxXY");for(let f=0;f<5;f++){const c=-1.2+f*.5+.11*((e*3+f*5)%4),x=.16+.05*((e+f)%3);b.kind(H.LIME).col(i.cloth[(e*2+f)%5]).box(c,a+.04,-2.46,c+x,a+.27+.03*(f%2),-2.26,"yzxX")}}l(b,-.3,-1.35,.5,0),b=t[3],b.kind(H.TIMBER).col(o).box(-1.3,0,-2.48,1.3,.86,-1.9,"yz"),b.col(o).box(-1.35,1.92,-2.44,1.35,1.96,-2.4,"");const u=[ot("#b9763f"),ot("#c08a4a"),ot("#b9763f")];for(let e=0;e<6;e+=2){const a=-1.1+e*.44,f=.11+.035*(e*2%3),c=1.66-f;b.kind(H.LIME).col(ht(i.timber,u[e%3],.1));const x=b.vert(a,c,-2.38,0,0,1),k=[];for(let v=0;v<8;v++)k.push(b.vert(a+f*Math.cos(v*.7854),c+f*Math.sin(v*.7854),-2.38,0,0,1));for(let v=0;v<8;v++)b.tri(x,k[v],k[(v+1)%8]);b.quad([a-.012,c+f,-2.38],[a+.012,c+f,-2.38],[a+.012,1.92,-2.38],[a-.012,1.92,-2.38],[0,0,1])}b.col(i.jug).box(.7,.86,-2.3,.92,1.16,-2.08,"y"),L(b,.1,-.55),l(b,.1,.12,1.1,0),b=t[4],b.kind(H.LIME).col(h).quad([-1.25,.012,.5],[1.25,.012,.5],[1.25,.012,-1.9],[-1.25,.012,-1.9],[0,1,0]),b.col(Et).quad([-1.08,.02,.33],[1.08,.02,.33],[1.08,.02,-1.73],[-1.08,.02,-1.73],[0,1,0]),b.col(h).quad([-.4,.028,-.2],[.4,.028,-.2],[.4,.028,-1.2],[-.4,.028,-1.2],[0,1,0]),b.kind(H.TIMBER).col(o).box(-.5,0,-2.48,.5,.42,-2.05,"yz"),b=t[5],b.kind(H.TIMBER).col(o).box(-1.25,0,-2.48,1.25,2.1,-1.92,"yz"),b.col(d).box(-1.3,2.1,-2.48,1.3,2.18,-1.88,"yz");for(const e of[-.42,.42])b.quad([e-.012,.06,-1.915],[e+.012,.06,-1.915],[e+.012,2.05,-1.915],[e-.012,2.05,-1.915],[0,0,1]);for(const e of[-.84,.84])for(const a of[.18,1.14])b.quad([e-.3,a,-1.914],[e+.3,a,-1.914],[e+.3,a+.8,-1.914],[e-.3,a+.8,-1.914],[0,0,1]);b.kind(H.GLASS).col([1,1,1]).quad([-.36,.95,-1.912],[.36,.95,-1.912],[.36,1.4,-1.912],[-.36,1.4,-1.912],[0,0,1]),l(b,.2,-.9,.9,0),b=t[6];for(const e of[-.1,-2.6]){b.kind(H.LIME).col([.8,.76,.66]),b.quad([-1.7,0,e],[-.55,0,e],[-.55,2.7,e],[-1.7,2.7,e],[0,0,1]),b.quad([.55,0,e],[1.7,0,e],[1.7,2.7,e],[.55,2.7,e],[0,0,1]),b.quad([-.55,2.1,e],[.55,2.1,e],[.55,2.7,e],[-.55,2.7,e],[0,0,1]),b.kind(H.TIMBER).col(d);for(const a of[-1,1])b.quad([a*.55,0,e+.01],[a*.63,0,e+.01],[a*.63,2.18,e+.01],[a*.55,2.18,e+.01],[0,0,1]);b.quad([-.55,2.1,e+.01],[.55,2.1,e+.01],[.55,2.18,e+.01],[-.55,2.18,e+.01],[0,0,1]);for(const a of[-1,1])b.quad([a*.55,0,e],[a*.55,0,e-.14],[a*.55,2.1,e-.14],[a*.55,2.1,e],[-a,0,0])}b.kind(H.LIME).col(Et).quad([-.4,.015,2],[.4,.015,2],[.4,.015,-4.9],[-.4,.015,-4.9],[0,1,0]),l(b,-1.1,1,1,1.5708),m(b,0,-5.08,.5)}function lt(t,n,o,d,h,l,m,L,i=!0,b=8,u=0,e=0){const a=o[0]-n[0],f=o[1]-n[1],c=Math.hypot(a,f),x=a/c,k=f/c,v=c/2,s=(w,M,y=0)=>[n[0]+x*w-l[0]*y,M+u,n[1]+k*w-l[1]*y],r=[l[0],0,l[1]];t.kind(H.STONE).col(L.quay),v-h>.01&&(t.quad(s(0,0),s(v-h,0),s(v-h,d),s(0,d),r),t.quad(s(v+h,0),s(c,0),s(c,d),s(v+h,d),r));for(let w=0;w<b;w++){const M=Math.PI*w/b,y=Math.PI*(w+1)/b,S=v-h*Math.cos(M),A=v-h*Math.cos(y),R=h*Math.sin(M),D=h*Math.sin(y);t.kind(H.STONE).col(L.quay),d>Math.max(R,D)+.01&&t.quad(s(S,R),s(A,D),s(A,d),s(S,d),r);const T=(M+y)/2,V=[x*Math.cos(T),-Math.sin(T),k*Math.cos(T)];if(t.col(J(L.quay,.62)).quad(s(S,R),s(S,R,m),s(A,D,m),s(A,D),V),e>0){const z=(h+e)/h,I=v-h*z*Math.cos(M),K=v-h*z*Math.cos(y);if(e>=1){const C=(S+A)/2,B=(R+D)/2,q=(I+K)/2;t.col(J(L.quay,1.36)).quad(s(S,R,-.08),s(C,B,-.08),s(q,B*z,-.08),s(I,R*z,-.08),r),t.col(J(L.quay,1.08)).quad(s(C,B,-.08),s(A,D,-.08),s(K,D*z,-.08),s(q,B*z,-.08),r)}else t.col(J(L.quay,w%2?1.32:1.2)).quad(s(S,R,-.08),s(A,D,-.08),s(K,D*z,-.08),s(I,R*z,-.08),r)}}return i&&t.kind(H.ROOM).col(J(L.quay,.3)).quad(s(v-h,0,m),s(v+h,0,m),s(v+h,h,m),s(v-h,h,m),r),t}function he(t,n){const o=at(),d=.86,h=5/t.RQ,l=[],m=(f,c)=>{const x=Math.max(1,Math.round((c-f)/h)),k=(c-f)/x;for(let v=0;v<x;v++){const s=f+v*k,r=s+k,w=(s+r)/2,M=t.pos(t.RQ,s),y=t.pos(t.RQ,r),S=t.pos(t.RQ+t.QW,s),A=t.pos(t.RQ+t.QW,r);lt(o,M,y,t.DECK,d,[-Math.sin(w),Math.cos(w)],1.3,n,!0,6);const R=t.rampY(s),D=s>t.rampA1?t.DECK:t.rampY(Math.min(r,t.rampA1)),T=[-Math.sin(w),0,Math.cos(w)];if(o.kind(H.PAVE).col(n.pave).quad([M[0],R,M[1]],[y[0],D,y[1]],[A[0],D,A[1]],[S[0],R,S[1]],[0,1,0]),D>t.DECK+.01){o.kind(H.WALL).col(n.bastion);const V=R-t.DECK,z=D-t.DECK,I=s*t.RQ,K=r*t.RQ,C=o.vert(M[0],t.DECK,M[1],T[0],0,T[2],I,0,V),B=o.vert(y[0],t.DECK,y[1],T[0],0,T[2],K,0,z),q=o.vert(y[0],D,y[1],T[0],0,T[2],K,z,z),j=o.vert(M[0],R,M[1],T[0],0,T[2],I,V,V);if(o.tri(C,B,q),o.tri(C,q,j),v%3===1&&V>3){const g=t.pos(t.RQ-.2,s+k*.15),E=t.pos(t.RQ-.2,s+k*.55),N=t.pos(t.RQ-.2,s+k*.9),F=Q=>R+(D-R)*Q-.06;o.kind(H.LEAF).col(J(n.leaf[v%2],.8)).move(1),o.quad([g[0],F(.15)-2.6,g[1]],[E[0],F(.55)-3.8,E[1]],[E[0],F(.55),E[1]],[g[0],F(.15),g[1]],T),o.quad([E[0],F(.55)-3.1,E[1]],[N[0],F(.9)-1.7,N[1]],[N[0],F(.9),N[1]],[E[0],F(.55),E[1]],T),o.move(0)}o.kind(H.STONE);const O=t.pos(t.RQ+.22,s),p=t.pos(t.RQ+.22,r);o.col(n.parapet).quad([M[0],R+1.15,M[1]],[y[0],D+1.15,y[1]],[p[0],D+1.15,p[1]],[O[0],R+1.15,O[1]],[0,1,0]),o.kind(H.RAIL).quad([M[0],R,M[1]],[y[0],D,y[1]],[y[0],D+1.12,y[1]],[M[0],R+1.12,M[1]],T)}l.push({a:w,x:(M[0]+y[0])/2,z:(M[1]+y[1])/2})}};m(-t.aMax,t.aLaneE()),m(t.aBastE(),t.aMax);for(const f of t.belv||[]){const c=f-2.6/t.RQ,x=f+2.6/t.RQ,k=t.rampY(c),v=t.rampY(x),s=t.RQ-2.6,r=t.RQ-3.3,w=(S,A,R)=>{const D=t.pos(S,A);return[D[0],R,D[1]]},M=[-Math.sin(f)*.97,.24,Math.cos(f)*.97],y=[Math.cos(f),0,Math.sin(f)];o.kind(H.PAVE).col(n.pave).quad(w(t.RQ,c,k),w(t.RQ,x,v),w(s,x,v),w(s,c,k),[0,1,0]),o.kind(H.STONE).col(J(n.bastion,1.04)),o.quad(w(r,c,0),w(r,x,0),w(s,x,v),w(s,c,k),M),o.quad(w(t.RQ,c,0),w(r,c,0),w(s,c,k),w(t.RQ,c,k),[-y[0],0,-y[2]]),o.quad(w(r,x,0),w(t.RQ,x,0),w(t.RQ,x,v),w(s,x,v),y),o.col(n.parapet),o.quad(w(s,c,k-.45),w(s,x,v-.45),w(s,x,v),w(s,c,k),[-Math.sin(f),0,Math.cos(f)]),o.kind(H.RAIL),o.quad(w(s,c,k),w(s,x,v),w(s,x,v+1.05),w(s,c,k+1.05),[-Math.sin(f),0,Math.cos(f)]),o.quad(w(t.RQ,c,k),w(s,c,k),w(s,c,k+1.05),w(t.RQ,c,k+1.05),[-y[0],0,-y[2]]),o.quad(w(s,x,v),w(t.RQ,x,v),w(t.RQ,x,v+1.05),w(s,x,v+1.05),y)}const L=(f,c,x,k,v)=>{const s=t.pos(f,c),r=t.pos(x,k),w=Math.hypot(r[0]-s[0],r[1]-s[1]),M=Math.max(1,Math.round(w/3.9));for(let y=0;y<M;y++){const S=[s[0]+(r[0]-s[0])*y/M,s[1]+(r[1]-s[1])*y/M],A=[s[0]+(r[0]-s[0])*(y+1)/M,s[1]+(r[1]-s[1])*(y+1)/M];lt(o,S,A,t.DECK,d,v,1.1,n,!0,6)}},i=t.aI-t.alpha,b=t.aI+t.alpha,u=t.aBastE(),e=(i+u)/2;L(t.RQ,i,t.rHQ,i,[Math.cos(i),Math.sin(i)]),L(t.rHQ,i,t.rHQ,u,[-Math.sin(e),Math.cos(e)]),L(t.rPier,b,t.RQ,b,[-Math.cos(b),-Math.sin(b)]);const a=u-5.9/t.rPier;return L(t.rHQ,a,t.rPier,a,[-Math.cos(a),-Math.sin(a)]),L(t.rHQ,u,t.rPier,u,[-Math.cos(u),-Math.sin(u)]),{g:o,rings:l}}function le(t,n){const o=at(),d=t.rimY,h=t.rHead+.02,l=(s,r,w)=>{const M=t.pos(s,r);return[M[0],w,M[1]]},m=(s,r)=>[Math.cos(s)*r,0,Math.sin(s)*r],L=(s,r)=>[Math.sin(s)*r,0,-Math.cos(s)*r],i=t.aI-t.alpha,b=t.aI+t.alpha,u=t.aLaneE(),e=t.aLaneW(),a=t.aBastE();for(const[s,r]of[[u,i],[b,a]]){const w=s===b?b:i-5.3/t.RQ,M=s===b?b+5.3/t.RQ:i;o.kind(H.WALL).move(d).col(n.bastion).quad(l(t.RQ,w,0),l(t.RQ,M,0),l(t.RQ,M,d),l(t.RQ,w,d),L((s+r)/2,-1),[.55,0,5.85,0,5.85,d,.55,d]).move(0);const y=s===b?t.rPier:h;o.kind(H.PAVE).col(n.pave).quad(l(t.RQ,s,d),l(t.RQ,r,d),l(y,r,d),l(y,s,d),[0,1,0]),s!==b&&(o.kind(H.STONE).col(n.parapet),o.quad(l(t.RQ,s,d-.4),l(t.RQ,r,d-.4),l(t.RQ,r,d),l(t.RQ,s,d),L((s+r)/2,-1)),o.quad(l(t.RQ,s,d+1.1),l(t.RQ,r,d+1.1),l(t.RQ+.2,r,d+1.1),l(t.RQ+.2,s,d+1.1),[0,1,0]),o.kind(H.RAIL).quad(l(t.RQ,s,d),l(t.RQ,r,d),l(t.RQ,r,d+1.1),l(t.RQ,s,d+1.1),L((s+r)/2,-1)))}const f=[0,0,h-t.RQ,0,h-t.RQ,d,0,d];o.kind(H.WALL).move(d).col(n.bastion),o.quad(l(t.RQ,u,0),l(h,u,0),l(h,u,d),l(t.RQ,u,d),m(u,-1),f);const c=t.rPier,x=b+5.5/c,k=[0,0,c-t.RQ,0,c-t.RQ,d,0,d];o.quad(l(c,a,0),l(t.RQ,a,0),l(t.RQ,a,d),l(c,a,d),m(a,1),k),o.quad(l(c,x,0),l(c,a,0),l(c,a,d),l(c,x,d),L(a,1),[0,0,(a-x)*c,0,(a-x)*c,d,0,d]),o.move(0),o.kind(H.STONE).col(n.parapet).quad(l(c,x,d+1.1),l(c,a,d+1.1),l(c-.2,a,d+1.1),l(c-.2,x,d+1.1),[0,1,0]),o.kind(H.RAIL).quad(l(c,x,d),l(c,a,d),l(c,a,d+1.1),l(c,x,d+1.1),L(a,1));const v=(a-i)*h;o.kind(H.WALL).move(d).col(n.bastion).quad(l(h,i,0),l(h,a,0),l(h,a,d),l(h,i,d),L(t.aI,-1),[0,0,v,0,v,d,0,d]).move(0),o.kind(H.PAVE).col(n.pave).quad(l(t.rFront-1.6,i,t.DECK),l(t.rFront-1.6,a,t.DECK),l(h,a,t.DECK),l(h,i,t.DECK),[0,1,0]);{const s=a-5.9/c,r=t.rFront-1.6;o.quad(l(c,s,t.DECK),l(r,s,t.DECK),l(r,a,t.DECK),l(c,a,t.DECK),[0,1,0])}for(const s of[t.isle,t.isle2])if(s){const[r,w,M,y]=s,S=s===t.isle?1.5:2.4,A=t.ROOMD+S,R=1.5*t.bay*.95+S,D=s===t.isle?2:t.DECK,T=(I,K,C)=>[r+M*I-y*K,C,w+y*I+M*K],V=s===t.isle,z=V?.18:0;if(o.kind(H.PAVE).col(n.pave).quad(T(-A-z,-R-z,D),T(-A-z,R+z,D),T(A+z,R+z,D),T(A+z,-R-z,D),[0,1,0]),o.kind(H.STONE).col(n.quay),!V)for(const I of[1,-1])o.quad(T(A*I,-R,0),T(A*I,R,0),T(A*I,R,D),T(A*I,-R,D),[M*I,0,y*I]),o.quad(T(-A,R*I,0),T(A,R*I,0),T(A,R*I,D),T(-A,R*I,D),[-y*I,0,M*I]);if(V)for(const I of[1,-1]){const B=Math.min(1.25,R/5-.22),q=Math.min(1.25,A/4-.22),j=(O,p)=>{const g=T(O,p,0);return[g[0],g[2]]};for(let O=0;O<5;O++)lt(o,j(A*I,-R+2*R*O/5),j(A*I,-R+2*R*(O+1)/5),D,B,[M*I,y*I],1,n,!0,6);for(let O=0;O<4;O++)lt(o,j(-A+2*A*O/4,R*I),j(-A+2*A*(O+1)/4,R*I),D,q,[-y*I,M*I],1,n,!0,6);o.kind(H.STONE).col(n.parapet),o.quad(T((A+z)*I,-R-z,D-.24),T((A+z)*I,R+z,D-.24),T((A+z)*I,R+z,D),T((A+z)*I,-R-z,D),[M*I,0,y*I]),o.quad(T(-A-z,(R+z)*I,D-.24),T(A+z,(R+z)*I,D-.24),T(A+z,(R+z)*I,D),T(-A-z,(R+z)*I,D),[-y*I,0,M*I])}if(V){for(let I=0;I<5;I++){const K=A+z+.4*I,C=K+.4,B=D*(5-I)/6;o.kind(H.PAVE).col(J(n.pave,.96)).quad(T(K,-1.3,B),T(K,1.3,B),T(C,1.3,B),T(C,-1.3,B),[0,1,0]),o.kind(H.STONE).col(J(n.quay,1.06)).quad(T(C,-1.3,0),T(C,1.3,0),T(C,1.3,B),T(C,-1.3,B),[M,0,y]);for(const q of[1,-1])o.quad(T(K,1.3*q,0),T(C,1.3*q,0),T(C,1.3*q,B),T(K,1.3*q,B),[-y*q,0,M*q])}for(const[I,K]of[[A+3.3,-2.2],[A+3.3,2.2],[A+1.6,5.4]]){const C=T(I,K,0);qt(o,n,C[0],C[2])}}for(const[I,K]of V?[]:[[.4,.8],[.9,.4]]){const C=A+I,B=R+I;o.kind(H.PAVE).col(J(n.pave,.94)).quad(T(-C,-B,K),T(-C,B,K),T(C,B,K),T(C,-B,K),[0,1,0]),o.kind(H.STONE).col(J(n.quay,1.06));for(const q of[1,-1])o.quad(T(C*q,-B,0),T(C*q,B,0),T(C*q,B,K),T(C*q,-B,K),[M*q,0,y*q]),o.quad(T(-C,B*q,0),T(C,B*q,0),T(C,B*q,K),T(-C,B*q,K),[-y*q,0,M*q])}for(const I of[1,-1]){const K=T((A-.5)*I,(R-.5)*I,0);o.kind(H.STONE).col(J(n.quay,.8)).box(K[0]-.16,D,K[2]-.16,K[0]+.16,D+.62,K[2]+.16)}if(s===t.isle2){const I=t.pos(t.RQ+1.5,t.aMax),K=Math.hypot(I[0]-r,I[1]-w),C=(I[0]-r)/K,B=(I[1]-w)/K,q=Math.min(A/Math.max(.001,Math.abs(C*M+B*y)),R/Math.max(.001,Math.abs(B*M-C*y)))-.4,j=K-q+.4,O=1.2,p=Math.min(3,Math.max(1.8,(j-7)/2)),g=p+.55,E=j/2-p-.5,N=j/2+p+.5,F=(G,U,W)=>[r+C*(q+G)-B*U,W,w+B*(q+G)+C*U],Q=(G,U)=>{const W=F(G,U,0);return[W[0],W[2]]};for(const G of[1,-1]){const U=[-B*G,0,C*G];lt(o,Q(E,O*G),Q(N,O*G),g,p,[U[0],U[2]],G>0?2*O:.01,n,!1,8,0,.25),o.kind(H.STONE).col(n.quay),o.quad(F(0,O*G,0),F(E,O*G,0),F(E,O*G,g),F(0,O*G,D),U),o.quad(F(N,O*G,0),F(j,O*G,0),F(j,O*G,D),F(N,O*G,g),U),o.col(n.parapet);for(const[W,Y,$,X]of[[0,D,E,g],[E,g,N,g],[N,g,j,D]])o.quad(F(W,O*G,Y),F($,O*G,X),F($,O*G,X+.6),F(W,O*G,Y+.6),U)}o.kind(H.PAVE).col(n.pave);for(const[G,U,W,Y]of[[0,D,E,g],[E,g,N,g],[N,g,j,D]])o.quad(F(G,-O,U),F(W,-O,Y),F(W,O,Y),F(G,O,U),[0,1,0])}}return{g:o,bridges:[]}}function Ke(t,n){const o=at(),d=Math.min(22,t.rimY-3.4),h=6,l=2*d+h,m=3,L=t.rimY,i=t.pos(t.RQ,t.aI+t.alpha+3.2/t.RQ),b=t.pos(t.RQ,-t.aMax),u=Math.hypot(b[0]-i[0],b[1]-i[1]),e=[(b[0]-i[0])/u,(b[1]-i[1])/u];let a=[-e[1],e[0]];a[1]>0&&(a=[e[1],-e[0]]);const f=(O,p)=>[i[0]+e[0]*O+a[0]*p,i[1]+e[1]*O+a[1]*p],c=Math.floor((u-16)/l),x=(u-c*l)/2,k=[],v=(O,p,g,E)=>{const N=f(O,g),F=f(p,g),Q=p-O,G=Q<4?-Q/2:3.2-Q/2,U=G+Q;o.kind(H.WALL).move(L).col(n.bastion).quad([N[0],0,N[1]],[F[0],0,F[1]],[F[0],L,F[1]],[N[0],L,N[1]],[a[0]*E,0,a[1]*E],[G,0,U,0,U,L,G,L]).move(0)},s=(x-8)/2;for(const[O,p,g,E]of[[2,x,0,2],[u-x,u-2,u-2,u]]){for(const N of[1,-1])s<5?v(Math.min(O,g),Math.max(p,E),m*N,N):v(g,E,m*N,N);s<5||(lt(o,f(O,m),f(p,m),L,s,a,2*m,n,!1,10,0,1.2),lt(o,f(O,-m),f(p,-m),L,s,[-a[0],-a[1]],0,n,!1,10,0,1.2))}if(s>=5&&L-s>7.5){const O=s+2.6,p=L-.56-O,g=x-.6,E=f(.3,m+.07),N=f(x-.3,m+.07);o.kind(H.WALL).move(p).col(n.bastion).quad([E[0],O,E[1]],[N[0],O,N[1]],[N[0],O+p,N[1]],[E[0],O+p,E[1]],[a[0],0,a[1]],[3.2-g/2,0,3.2+g/2,0,3.2+g/2,p,3.2-g/2,p]).move(0)}for(let O=0;O<c;O++){const p=x+O*l,g=p+l;lt(o,f(p,m),f(g,m),L,d,a,2*m,n,!1,14,0,1.5),lt(o,f(p,-m),f(g,-m),L,d,[-a[0],-a[1]],0,n,!1,14,0,1.5),k.push({s:(p+g)/2,p:f((p+g)/2,0)})}const r=(O,p,g)=>{const E=f(O,p);return[E[0],g,E[1]]};for(let O=0;O<=c;O++)for(const p of[1,-1]){const g=x+O*l,E=m*p,N=(m+1.3)*p,F=L-3.2,Q=[a[0]*p,0,a[1]*p];o.kind(H.STONE).col(J(n.quay,1.08)),o.quad(r(g-1.7,N,0),r(g+1.7,N,0),r(g+1.7,N,F),r(g-1.7,N,F),Q),o.quad(r(g-1.7,E,0),r(g-1.7,N,0),r(g-1.7,N,F),r(g-1.7,E,F+1.6),[-e[0],0,-e[1]]),o.quad(r(g+1.7,N,0),r(g+1.7,E,0),r(g+1.7,E,F+1.6),r(g+1.7,N,F),[e[0],0,e[1]]),o.quad(r(g-1.7,N,F),r(g+1.7,N,F),r(g+1.7,E,F+1.6),r(g-1.7,E,F+1.6),[Q[0]*.63,.78,Q[2]*.63])}for(const O of[1,-1]){const p=m*O,g=(m+.16)*O,E=[a[0]*O,0,a[1]*O];o.kind(H.STONE).col(n.parapet),o.quad(r(0,g,L-.55),r(u,g,L-.55),r(u,g,L-.05),r(0,g,L-.05),E),o.quad(r(0,p,L-.55),r(u,p,L-.55),r(u,g,L-.55),r(0,g,L-.55),[0,-1,0]);const N=x,F=u-x,Q=Math.max(1,Math.round((F-N)/3)),G=L-1.25,U=L-.55,W=.25;for(let Y=0;Y<Q;Y++){const $=N+(F-N)*(Y+.5)/Q;o.quad(r($-W,p,G),r($+W,p,G),r($+W,g,U),r($-W,g,U),[E[0]*.97,-.22,E[2]*.97]);for(const X of[1,-1])o.tri(...[r($+W*X,p,G),r($+W*X,p,U),r($+W*X,g,U)].map(Z=>o.vert(Z[0],Z[1],Z[2],e[0]*X,0,e[1]*X)))}}o.kind(H.PAVE).col(n.pave).quad(r(0,m,L),r(u,m,L),r(u,-m,L),r(0,-m,L),[0,1,0]),o.kind(H.STONE).col(n.parapet);for(const O of[1,-1]){const p=m*O,g=(m-.35)*O,E=[a[0]*O,0,a[1]*O];o.kind(H.STONE).col(n.parapet).quad(r(0,p,L+1.1),r(u,p,L+1.1),r(u,g,L+1.1),r(0,g,L+1.1),[0,1,0]),o.quad(r(0,p,L+.98),r(u,p,L+.98),r(u,p,L+1.1),r(0,p,L+1.1),E),o.kind(H.RAIL).quad(r(0,p,L),r(u,p,L),r(u,p,L+1),r(0,p,L+1),E)}const w=[],M=[],y=t.ROOMD+.3;for(let O=0;O<=c;O++)for(const p of[1,-1]){const g=f(x+O*l,(m-.17)*p);w.push({x:g[0],z:g[1],y0:L+1.1,y1:L+4.3,ax:-a[0]*p,az:-a[1]*p})}for(const O of[1,2,c-3])for(const p of[1,-1]){if(O<1||O>c-1)continue;const g=x+O*l,E=m*p,N=(m+y+.4)*p,F=[a[0]*p,0,a[1]*p],Q=f(g,(m+y)*p);M.push([Q[0],Q[1],F[0],F[2]]),o.kind(H.STONE).col(J(n.quay,1.08)),o.quad(r(g-3,N,0),r(g+3,N,0),r(g+3,N,L),r(g-3,N,L),F),o.quad(r(g-3,E,0),r(g-3,N,0),r(g-3,N,L),r(g-3,E,L),[-e[0],0,-e[1]]),o.quad(r(g+3,N,0),r(g+3,E,0),r(g+3,E,L),r(g+3,N,L),[e[0],0,e[1]]),o.kind(H.PAVE).col(n.pave).quad(r(g-3,E,L),r(g+3,E,L),r(g+3,N,L),r(g-3,N,L),[0,1,0])}{const p=Math.min(23,x-.7),g=m,E=m+7.4,N=Math.max(1,Math.round((p-1)/3.7));for(let F=0;F<N;F++)lt(o,f(1+(p-1)*F/N,E),f(1+(p-1)*(F+1)/N,E),t.DECK,.86,a,1.1,n,!0,6);o.kind(H.STONE).col(n.quay),o.quad(r(1,g,0),r(1,E,0),r(1,E,t.DECK),r(1,g,t.DECK),[-e[0],0,-e[1]]),o.quad(r(p,E,0),r(p,g,0),r(p,g,t.DECK),r(p,E,t.DECK),[e[0],0,e[1]]),o.kind(H.PAVE).col(n.pave).quad(r(1,g,t.DECK),r(p,g,t.DECK),r(p,E,t.DECK),r(1,E,t.DECK),[0,1,0]),t.moleRow=[[2.6,5.4,5],[10,6.4,6],[18.4,4.4,4]].filter(([F,Q])=>F+Q<=p-.2).map(([F,Q,G])=>{const U=f(F+Q/2,E-1.5);return[U[0],U[1],a[0],a[1],Q,G]})}const S=Math.min(c-1,1),A=x+(S+.5)*l,R=[a[0],a[1]],D=f(A,m+5),T=D[0]*R[0]+D[1]*R[1],V=D[0]*D[0]+D[1]*D[1]-t.RQ*t.RQ,z=-T+Math.sqrt(T*T-V),I=Math.max(40,Math.min(100,z-44)),K=1.6,C=2.2,B=[-R[1],R[0]],q=(O,p,g)=>[D[0]+R[0]*O+B[0]*p,g,D[1]+R[1]*O+B[1]*p];o.kind(H.TIMBER).col([.42,.37,.3]).move(7),o.quad(q(0,K,C),q(I,K,C),q(I,-K,C),q(0,-K,C),[0,1,0],[0,K,I,K,I,-K,0,-K]).move(0),o.col(ht(n.deck,[.27,.21,.145],.5)),o.quad(q(0,K,C-.25),q(I,K,C-.25),q(I,-K,C-.25),q(0,-K,C-.25),[0,-1,0]);for(const O of[1,-1])o.quad(q(0,K*O,C-.25),q(I,K*O,C-.25),q(I,K*O,C),q(0,K*O,C),[B[0]*O,0,B[1]*O]);o.quad(q(I,K,C-.25),q(I,-K,C-.25),q(I,-K,C),q(I,K,C),[R[0],0,R[1]]);const j=[];for(let O=3;O<I;O+=6.25)for(const p of[1,-1]){const g=Math.round(O/6.25)%3===0?C+.45:C+.22,E=(K+.12)*p;o.kind(H.TIMBER).col(J(n.timber,1.12)).quad(q(O-.11,E-.11,g),q(O+.11,E-.11,g),q(O+.11,E+.11,g),q(O-.11,E+.11,g),[0,1,0]);const N=q(O-.11,E-.11,0),F=q(O+.11,E+.11,g);if(o.kind(H.TIMBER).col(J(n.timber,.8)),o.quad(q(O-.11,E-.11,0),q(O+.11,E-.11,0),q(O+.11,E-.11,g),q(O-.11,E-.11,g),[-B[0],0,-B[1]]),o.quad(q(O-.11,E+.11,0),q(O+.11,E+.11,0),q(O+.11,E+.11,g),q(O-.11,E+.11,g),[B[0],0,B[1]]),o.quad(q(O-.11,E-.11,0),q(O-.11,E+.11,0),q(O-.11,E+.11,g),q(O-.11,E-.11,g),[-R[0],0,-R[1]]),o.quad(q(O+.11,E-.11,0),q(O+.11,E+.11,0),q(O+.11,E+.11,g),q(O+.11,E-.11,g),[R[0],0,R[1]]),j.push({x:(N[0]+F[0])/2,z:(N[2]+F[2])/2,top:g}),Math.round(O/6.25)%2===1){const Q=q(O,E,0);w.push({x:Q[0],z:Q[2],y0:C-.05,y1:C+1.1,ax:0,az:0})}}return{g:o,S:i,E:b,d:e,nb:a,L:u,lead:x,pitch:l,R:d,half:m,gd:y,deckY:L,centres:k,at:f,posts:w,gates:M,jetty:{J0:D,jd:R,jn:B,JL:I,jw:K,jy:C,piles:j,sJ:A}}}function ce(t){const n=at().kind(H.BOAT).col([1,1,1]),o=[[-2.5,.42],[-1.3,.7],[0,.76],[1.3,.6],[2.5,.03]];for(let d=0;d+1<o.length;d++){const[h,l]=o[d],[m,L]=o[d+1];for(const i of[1,-1])n.quad([i*l*.72,.01,h],[i*L*.72,.01,m],[i*L,.5,m],[i*l,.5,h],[i*.92,-.38,0]),n.col([.42,.36,.3]),n.quad([i*(l+.03),.39,h],[i*(L+.03),.39,m],[i*(L+.03),.54,m],[i*(l+.03),.54,h],[i*.98,.2,0]),n.quad([i*(L+.03),.54,m],[i*(L-.07),.54,m],[i*(l-.07),.54,h],[i*(l+.03),.54,h],[0,1,0]),n.col([1,1,1]);n.move(1).col([.6,.5,.36]).quad([-l*.72,.03,h],[l*.72,.03,h],[L*.72,.03,m],[-L*.72,.03,m],[0,1,0]).move(0).col([1,1,1])}return n.quad([-.42,.01,-2.5],[.42,.01,-2.5],[.42,.5,-2.5],[-.42,.5,-2.5],[0,0,-1]),n.move(1).col([.24,.2,.16]).box(-.05,.03,-2.3,.05,.06,2.1,"y"),n.col([.8,.7,.52]).box(-.7,.3,-1,.7,.34,-.72,"y").box(-.7,.3,-.1,.7,.34,.16,"y").box(-.62,.3,1,.62,.34,1.24,"y").box(-.44,.3,-2.45,.44,.34,-1.95,"y"),n.col([.9,.84,.68]).box(-.4,.36,-1.9,-.34,.4,1.3,"y").box(-.47,.36,1.3,-.27,.39,1.9,"y").box(.3,.36,-1.5,.36,.4,1.7,"y").box(.23,.36,-2.1,.43,.39,-1.5,"y"),n.col([.3,.26,.2]).quad([-.04,.5,2.5],[.04,.5,2.5],[.04,.02,3.5],[-.04,.02,3.5],[0,.9,.44]).move(0),n.build()}function de(){const t=at().kind(H.BOAT).col([1,1,1]),n=.16,o=[[n,0,0],[0,0,n],[-n,0,0],[0,0,-n]];for(let d=0;d<4;d++){const h=o[d],l=o[(d+1)%4],m=[(h[0]+l[0])*3,.6,(h[2]+l[2])*3],L=t.vert(0,n,0,m[0],m[1],m[2]),i=t.vert(h[0],0,h[2],m[0],m[1],m[2]),b=t.vert(l[0],0,l[2],m[0],m[1],m[2]);t.tri(L,i,b)}return t.build()}function ue(){return at().kind(H.LEAF).col([1,1,1]).move(.35).quad([-.09,.012,-.05],[.09,.012,-.05],[.09,.012,.05],[-.09,.012,.05],[0,1,0]).build()}const bt=[12,20],fe=13,Rt=2.4,me=10,Lt=8,pe=2.5,ft=2.2,vt=1.5;function qt(t,n,o,d){const h=Rt,l=h-.24,m=.15,L=h/2,i=o+m+.02;t.kind(H.TIMBER).move(8).col(J(n.timber,.75)).box(o-m,0,d-m,o+m,l,d+m,"yY"),t.quad([o-m,l,d-m],[o-m,l,d+m],[o+m,h,d+m],[o+m,h,d-m],[-.62,.78,0]),t.quad([o+m,l,d-m],[o+m,l,d+m],[o+m,h,d+m],[o+m,h,d-m],[1,0,0]);for(const b of[1,-1])t.quad([o-m,l,d+m*b],[o+m,l,d+m*b],[o+m,h,d+m*b],[o+m,h,d+m*b],[0,0,b]);t.move(0).col([.2,.2,.22]);for(const[b,u,e,a]of[[.09,.125,-.125,.125],[-.125,-.09,-.125,.125],[-.09,.09,-.125,-.09],[-.09,.09,.09,.125]])t.box(i,L+b,d+e,i+.035,L+u,d+a,"x");return L}const At=[2,3],yt=[15,40],gt=68;function we(t,n,o,d,h,l,m=[],L=()=>0,i=null){const b=[],u=[],e=[],a=[],f=[];let c=o;const x=(p,g)=>{for(const E of m)if(Math.hypot(p-E.x,g-E.z)<E.r)return!1;return!0},k=[],v=(p,g,E)=>{const N=Math.max(-2.5,Math.min(2.5,(g-p[0])*p[2]+(E-p[1])*p[3]));return Math.hypot(g-p[0]-p[2]*N,E-p[1]-p[3]*N)},s=1.5,r=[[-2.5,.45],[-1.3,.73],[0,.79],[1.3,.63],[2.5,.06]],w=p=>[1,-1].flatMap(g=>(g>0?r:[...r].reverse()).map(([E,N])=>[p[0]+p[2]*E+p[3]*N*g,p[1]+p[3]*E-p[2]*N*g])),M=(p,g,E)=>{const N=E[0]-g[0],F=E[1]-g[1],Q=Math.max(0,Math.min(1,((p[0]-g[0])*N+(p[1]-g[1])*F)/(N*N+F*F||1)));return Math.hypot(p[0]-g[0]-N*Q,p[1]-g[1]-F*Q)},y=(p,g,E)=>(g[0]-p[0])*(E[1]-p[1])-(g[1]-p[1])*(E[0]-p[0]),S=(p,g)=>{let E=1/0;for(let N=0;N<p.length;N++)for(let F=0;F<g.length;F++){const Q=p[N],G=p[(N+1)%p.length],U=g[F],W=g[(F+1)%g.length];if(y(Q,G,U)*y(Q,G,W)<0&&y(U,W,Q)*y(U,W,G)<0)return 0;E=Math.min(E,M(Q,U,W),M(U,Q,G))}return E},A=p=>{const g=w(p);return k.some(E=>Math.hypot(E[0]-p[0],E[1]-p[1])<8&&S(E.o||(E.o=w(E)),g)<s)},R=(p,g)=>g&&k.some(E=>v(E,g[0],g[1])<ft-.01)||p&&u.some(E=>v(p,E.x,E.z)<ft-.01)||p&&A(p),D=(p,g,E,N,F,Q,G=!1)=>{const U=Math.atan2(E,N),W=J(c.pick(d.boat),c.range(.85,1.1)),Y=[c(),0,c(),0],$=3/Math.hypot(E,N);if(G&&!l("post",F,Rt,Q)||![0,-1,1].every(it=>l("boat",p+E*$*it,.6,g+N*$*it,3.4))||!x(p,g))return;const X=[p,g,E*$/3,N*$/3];if(R(X,[F,Q]))return;k.push(X),b.push({m:new _.Matrix4().makeTranslation(p,0,g).multiply(rt.makeRotationY(U)),a:Y,c:W});const Z=(F-p)*X[2]+(Q-g)*X[3],tt=F-p-X[2]*Z,P=Q-g-X[3]*Z,et=.5/(Math.hypot(tt,P)||1);u.push({x:F,z:Q,wp:G,b:[p,g],g:[p+X[2]*Z+tt*et,g+X[3]*Z+P*et],road:c!==o}),f.push({x:p,z:g})},T=[],V=(p,g,E,N,F)=>{const Q=g*vt,G=E*vt,U=N*ft,W=F*ft,Y=L(p[0]+Q+U,0,p[1]+G+W)>=L(p[0]+Q-U,0,p[1]+G-W)?1:-1;D(p[0]+Q+U*Y,p[1]+G+W*Y,g,E,p[0],p[1],!0)},z=(p,g,E,N)=>{if(T.some(G=>Math.hypot(G[0]-p[0],G[1]-p[1])<fe))return;T.push(p);const F=Math.cos(N),Q=Math.sin(N);V(p,g[0]*F+E[0]*Q,g[1]*F+E[1]*Q,E[0]*F-g[0]*Q,E[1]*F-g[1]*Q)},I=(p,g)=>p<.67?J([.6,.45,.29],.82+.3*g[0]):J(d.timber,1.05+.25*g[2]),K=Math.round(22*h);for(let p=0;p<K;p++){const g=o.range(-70,49)*st,E=o.range(bt[0],bt[1]),N=o.range(.05,.4);z(t.pos(t.RQ-E,g),[-Math.cos(g),-Math.sin(g)],[-Math.sin(g),Math.cos(g)],N)}const C=(p,g,E)=>{const N=p[0]+g*vt,F=p[1]+E*vt,Q=E*ft,G=-g*ft,U=L(N+Q,0,F+G)<=L(N-Q,0,F-G)?1:-1;D(p[0],p[1],g,E,N+Q*U,F+G*U,!0)};for(let p=0;p<Math.round(6*h);p++){const g=o.chance(.6),E=o.range(t.RQ+6,t.rHQ-6),N=o.range(t.aI-t.alpha+4/t.rHQ,t.aI+t.alpha-4/t.rHQ);if(g){C(t.pos(t.rHQ-3.1,N),Math.sin(N),-Math.cos(N));continue}C(t.pos(E,t.aI-t.alpha+3/E),-Math.cos(t.aI),-Math.sin(t.aI))}const B=n.jetty;for(let p=0;p<Math.round(3*h);p++){const g=o.range(6,B.JL-8),E=o.chance(.5)?1:-1,N=o.range(bt[0],bt[1])*E,F=o.range(.05,.4);z([B.J0[0]+B.jd[0]*g+B.jn[0]*N,B.J0[1]+B.jd[1]*g+B.jn[1]*N],[-B.jd[0],-B.jd[1]],[B.jn[0]*E,B.jn[1]*E],F)}{const p=-(n.half+n.gd+me),g=3+Math.floor(o()*3);Array.from({length:Lt},(N,F)=>[o(),F]).sort((N,F)=>N[0]-F[0]).forEach(([,N],F)=>{const Q=n.lead+n.pitch*(1.5+(N-(Lt-1)/2)/4),G=n.at(Q,p-(N%2?pe:0)),U=Q<B.sJ?-1:1,W=o.range(.05,.4),Y=Math.cos(W),$=Math.sin(W),X=-n.nb[0]*Y+n.d[0]*U*$,Z=-n.nb[1]*Y+n.d[1]*U*$;F<g?V(G,X,Z,n.d[0]*U*Y+n.nb[0]*$,n.d[1]*U*Y+n.nb[1]*$):l("post",G[0],Rt,G[1])&&!R(null,G)&&u.push({x:G[0],z:G[1],wp:!0})})}for(let p=0;p<Math.round(46*h);p++){const g=o.range(-72,60)*st,E=t.RQ-o.range(2,26)*(o.chance(.7)?1:2.4),N=t.pos(E,g),F=new _.Matrix4().makeTranslation(N[0],0,N[1]).multiply(rt.makeRotationY(o()*6.28)),Q=o.chance(.3),G=[o(),0,o(),0],U=o();x(N[0],N[1])&&(Q?l("float",N[0],.2,N[1])&&e.push({m:F,a:G,c:I(U,G)}):a.push({m:F.multiply(nt.makeScale(1.6,1,1.6)),a:G,c:d.leaf[Math.floor(U*d.leaf.length)]}))}for(let p=0;p<3;p++){const g=o.range(t.rPier+2,t.rHQ-5),E=o.range(t.aI-t.alpha+5/g,t.aI+t.alpha-4/g),N=t.pos(g,E),F=[o(),0,o(),0],Q=o();x(N[0],N[1])&&l("float",N[0],.4,N[1])&&e.push({m:new _.Matrix4().makeTranslation(N[0],0,N[1]).multiply(nt.makeScale(2.2,2.2,2.2)),a:F,c:I(Q,F)})}const q=m[1],j=(p,g)=>{if(!q||!q.head)return!1;const E=q.foot[0]-q.head[0],N=q.foot[2]-q.head[2],F=Math.max(0,Math.min(1,((p-q.head[0])*E+(g-q.head[2])*N)/(E*E+N*N)));return Math.hypot(p-q.head[0]-E*F,g-q.head[2]-N*F)<5};for(let p=0;p<38;p++){const g=t.rPier+1.5+(t.rHQ-t.rPier-4)*o(),E=t.aI+t.alpha-7/g,N=t.aBastE()-6.6/g,F=t.pos(g,E+(N-E)*o()),Q=o()*6.2832,G=[o(),0,o(),0],U=o(),W=o.range(.85,1.1);if(j(F[0],F[1]))continue;const Y=new _.Matrix4().makeTranslation(F[0],0,F[1]).multiply(rt.makeRotationY(Q));p===5||p===20?l("boat",F[0],.6,F[1],3.4)&&!R([F[0],F[1],Math.sin(Q),Math.cos(Q)],null)&&(k.push([F[0],F[1],Math.sin(Q),Math.cos(Q)]),b.push({m:Y,a:G,c:J(d.boat[Math.floor(U*d.boat.length)],W)}),f.push({x:F[0],z:F[1]})):p%4===1?l("float",F[0],.4,F[1])&&e.push({m:Y.multiply(nt.makeScale(2.2,2.2,2.2)),a:G,c:I(U,G)}):a.push({m:Y.multiply(nt.makeScale(4.2,1,4.2)),a:G,c:d.leaf[Math.floor(U*d.leaf.length)]})}if(t.isle2){const[p,g,E,N]=t.isle2,F=-N,Q=E,G=t.ROOMD+2.4+1.5,U=1.5*t.bay*.95+2.4+1.5;[[-3.7,G,0],[4.1,G,0],[U,-1.6,1],[-U,2.2,1]].forEach(([W,Y,$],X)=>{const Z=p+F*W+E*Y,tt=g+Q*W+N*Y,P=J(o.pick(d.boat),o.range(.85,1.1)),et=[o(),0,o(),0];!l("boat",Z,.6,tt,3.4)||R($?[Z,tt,E,N]:[Z,tt,F,Q],null)||(k.push($?[Z,tt,E,N]:[Z,tt,F,Q]),b.push({m:new _.Matrix4().makeTranslation(Z,0,tt).multiply(rt.makeRotationY($?Math.atan2(E,N):Math.atan2(F,Q))),a:et,c:P}),f.push({x:Z,z:tt}))})}const O=t.nearRock;if(O&&i){const p=[Math.cos(O.yaw),Math.sin(O.yaw)],g=[-p[1],p[0]],E=L(O.x+g[0]*O.B,0,O.z+g[1]*O.B)<=L(O.x-g[0]*O.B,0,O.z-g[1]*O.B)?1:-1,N=At[0]+Math.floor(i()*(At[1]-At[0]+1));c=i;const F=(Q,G)=>O.feet?Math.min(...O.feet.map(U=>Math.min(...U.map((W,Y)=>M([Q,G],W,U[(Y+1)%U.length]))))):1/0;for(let Q=0;Q<N;Q++){const G=1.2*((Q+i.range(.3,.7))/N-.5),U=Math.min(Math.max(i.range(yt[0],yt[1]),yt[0]+2.7),yt[1]-2.7),W=i.range(.05,.4);let Y=O.feet?0:O.B*1.15*Math.sqrt(1-G*G)+U;for(;Y<120&&F(O.x+p[0]*G*gt+g[0]*E*Y,O.z+p[1]*G*gt+g[1]*E*Y)<U;)Y+=.5;const $=(n.nb[0]*g[0]+n.nb[1]*g[1])*E>=0?1:-1;z([O.x+p[0]*G*gt+g[0]*E*Y,O.z+p[1]*G*gt+g[1]*E*Y],[-n.d[0],-n.d[1]],[n.nb[0]*$,n.nb[1]*$],W)}c=o}return{boats:b,posts:u,floats:e,leaves:a,rings:f}}function be(t,n,o,d){const h=at(),l=[],m=[],L=[],i=(s,r,w,M,y,S,A,R,D=1)=>{const T=(E,N,F)=>[s[0]+r[0]*E+w[0]*N,F,s[1]+r[1]*E+w[1]*N],I=Math.round((y+S)/.18),K=y-I*.18,C=I*.36,B=[w[0],0,w[1]],q=[r[0],0,r[1]],j=Math.hypot(.18,.36),O=[-r[0]*.18/j,.36/j,-r[1]*.18/j];for(let E=0;E<I;E++){const N=E*.36,F=N+.36,Q=y-E*.18,G=Q-.18;h.kind(H.STONE).col(J(A,.5)).quad(T(N,0,G),T(N,M,G),T(N,M,Q),T(N,0,Q),q),h.kind(H.PAVE).col(J(R,(E%2?1.14:.8)*(G<0?D<1?.46*D/.55:1.5:1))).quad(T(N,0,G),T(F,0,G),T(F,M,G),T(N,M,G),[0,1,0]),D>.6&&D<1&&h.col(J(o.hall,G<0?.7:.95)).quad(T(F-.07,0,G+.006),T(F,0,G+.006),T(F,M,G+.006),T(F-.07,M,G+.006),[0,1,0])}h.kind(H.PAVE).col(J(R,D<1?.36*D/.55:1)).quad(T(C,-.5,K),T(C+3.4,-.5,K),T(C+3.4,M+.5,K),T(C,M+.5,K),[0,1,0]),h.kind(H.STONE).col(A).quad(T(C+3.4,-.5,K-1),T(C+3.4,M+.5,K-1),T(C+3.4,M+.5,K),T(C+3.4,-.5,K),q);for(const[E,N]of[[-.5,-1],[M+.5,1]]){const F=[w[0]*N,0,w[1]*N],Q=E-N*.5;h.kind(H.STONE).col(J(A,D)),h.quad(T(0,E,K-1),T(C+3.4,E,K-1),T(C+3.4,E,K),T(0,E,y),F),h.col(D<1?J(A,D*1.12):J(o.hall,.96)),h.quad(T(0,E,y),T(C,E,K),T(C,E,K+.95),T(0,E,y+.95),F),h.quad(T(0,Q,y),T(C,Q,K),T(C,Q,K+.95),T(0,Q,y+.95),[-F[0],0,-F[2]]),h.quad(T(0,E,y+.95),T(C,E,K+.95),T(C,Q,K+.95),T(0,Q,y+.95),O);for(let G=0;G<=4;G++){const U=C*G/4,W=y-(y-K)*G/4,Y=E-N*.25,$=T(U-.27,Y-.27,0),X=T(U+.27,Y+.27,0),Z=T(U,Y,0);h.kind(H.STONE).col(o.hall),h.quad(T(U-.27,Y-.27,W-.3),T(U+.27,Y-.27,W-.3),T(U+.27,Y-.27,W+1.45),T(U-.27,Y-.27,W+1.45),[-w[0],0,-w[1]]),h.quad(T(U-.27,Y+.27,W-.3),T(U+.27,Y+.27,W-.3),T(U+.27,Y+.27,W+1.45),T(U-.27,Y+.27,W+1.45),B),h.quad(T(U-.27,Y-.27,W-.3),T(U-.27,Y+.27,W-.3),T(U-.27,Y+.27,W+1.45),T(U-.27,Y-.27,W+1.45),[-r[0],0,-r[1]]),h.quad(T(U+.27,Y-.27,W-.3),T(U+.27,Y+.27,W-.3),T(U+.27,Y+.27,W+1.45),T(U+.27,Y-.27,W+1.45),q),h.quad(T(U-.27,Y-.27,W+1.45),T(U+.27,Y-.27,W+1.45),T(U+.27,Y+.27,W+1.45),T(U-.27,Y+.27,W+1.45),[0,1,0]);const tt=W+1.5<0?.24:.17;h.kind(H.LAMP).col(W+1.5<0?[5.2,3.9,2.1]:[3.2,2.4,1.3]).move(1).box(Z[0]-tt,W+1.5,Z[2]-tt,Z[0]+tt,W+1.92,Z[2]+tt,"y").move(0),L.push([Z[0],W+1.7,Z[2]])}}const p=y/.18*.36;h.kind(H.LAMP).col([2.2,2.3,2.4]).move(1).quad(T(p-.16,0,.012),T(p+.16,0,.012),T(p+.16,M,.012),T(p-.16,M,.012),[0,1,0]).move(0);const g=T(C/2,M/2,0);return l.push({x:g[0],z:g[2],r:Math.max(C/2,M/2)+6,head:T(0,0,y),foot:T(C+3.4,M,K)}),T},b=(s,r,w,M=.17)=>{const y=Math.hypot(r[0]-s[0],r[1]-s[1],r[2]-s[2]),S=Math.max(8,Math.round(y/(M*3.2)));for(const D of[1,-1]){const T=(r[0]-s[0])/S,V=D*(r[1]-s[1])/S,z=(r[2]-s[2])/S;h.kind(H.TIMBER).col([.2,.19,.18]);const I=M<.2?1.02:1.2;for(let K=0;K<S;K++){M<.2&&h.kind(H.LIME).col(K%2?[.33,.34,.36]:[.13,.135,.15]);const C=[s[0]+T*K,D*s[1]+V*K,s[2]+z*K],B=[C[0]+T*I,C[1]+V*I,C[2]+z*I],q=K%2?[w[0]*M,0,w[1]*M]:[0,M,0];h.quad([C[0]-q[0],C[1]-q[1],C[2]-q[2]],[B[0]-q[0],B[1]-q[1],B[2]-q[2]],[B[0]+q[0],B[1]+q[1],B[2]+q[2]],[C[0]+q[0],C[1]+q[1],C[2]+q[2]],K%2?[0,1,0]:[w[0],0,w[1]])}}const A=Math.abs(s[1])+.3;for(const D of[s,r])h.kind(H.STONE).col(J(o.hall,.9)).box(D[0]-.26-w[0]*.3,-A,D[2]-.26-w[1]*.3,D[0]+.26-w[0]*.3,A,D[2]+.26-w[1]*.3);const R=[(s[0]+r[0])/2,.014,(s[2]+r[2])/2];h.kind(H.LAMP).col([.75,.8,.85]).move(2);for(let D=0;D<10;D++){const T=D*.6283,V=T+.6283,z=M*3,I=M*4.6;h.quad([R[0]+Math.cos(T)*z,R[1],R[2]+Math.sin(T)*z],[R[0]+Math.cos(V)*z,R[1],R[2]+Math.sin(V)*z],[R[0]+Math.cos(V)*I,R[1],R[2]+Math.sin(V)*I],[R[0]+Math.cos(T)*I,R[1],R[2]+Math.sin(T)*I],[0,1,0])}h.move(0),m.push([s,r])},u=[Math.cos(d),Math.sin(d)],e=[-Math.sin(d),Math.cos(d)],a=t.pos(t.RQ,d-3/t.RQ);i(a,e,u,6,t.DECK,3,o.bastion,o.pave,.55);const f=(s,r,w)=>{const M=t.pos(s,r);return[M[0],w,M[1]]};for(const s of[-30,-21.5,-13,13,21.5,30]){const r=d+(s-2.8)/t.RQ,w=d+(s+2.8)/t.RQ;b(f(t.RQ-.32,r,1.9),f(t.RQ-.32,w,-1.9),e,.16)}const c=t.aI-t.alpha+26.4/t.rHQ,x=[-Math.sin(c),Math.cos(c)],k=[Math.cos(c),Math.sin(c)],v=t.pos(t.rHQ,c-3/t.rHQ);i(v,x,k,6,t.DECK,5,o.bastion,J(o.pave,.82),.8);for(const s of[-8.6,8.6])b(f(t.rHQ-.3,c+(s-1.8)/t.rHQ,2.5),f(t.rHQ-.3,c+(s+1.8)/t.rHQ,-2.5),x,.21);return{g:h,stairs:l,chains:m,lights:L,stairEnd:l[0].foot,chain:m[0],reach:4.2}}function ve(t,n,o,d,h,l,m=()=>!0){const L=at(),i=[],b=n.jetty,u=(f,c,x,k)=>{for(let s=0;s<5;s++){const r=s/5,w=(s+1)/5,M=A=>[f[0]+(c[0]-f[0])*A,f[1]+(c[1]-f[1])*A-x*4*A*(1-A),f[2]+(c[2]-f[2])*A],y=M(r),S=M(w);L.quad([y[0],y[1]-k,y[2]],[S[0],S[1]-k,S[2]],[S[0],S[1]+k,S[2]],[y[0],y[1]+k,y[2]],[0,.4,.9])}};for(let f=0;f<d.posts.length;f++){const c=d.posts[f],x=qt(L,o,c.x,c.z);c.g&&(L.kind(H.CLOTH).col([.5,.42,.3]).move(0),u([c.x,x,c.z],[c.g[0],.5,c.g[1]],.25,.02))}for(const f of[-1])for(let c=t.RQ+1;c<t.rHead;c+=h.range(2.6,5.2)){const x=t.aI+f*(t.alpha+.15/c),k=t.pos(c,x),v=t.rimY+1.1,s=h.range(.13,.19),r=h.pick(o.pot),w=h.pick(o.leaf);m("pot",k[0],v+.78,k[1])&&(L.kind(H.LIME).col(r).box(k[0]-s,v,k[1]-s,k[0]+s,v+.3,k[1]+s,"y"),L.kind(H.LEAF).col(w).move(.2),L.quad([k[0]-.24,v+.28,k[1]],[k[0]+.24,v+.28,k[1]],[k[0]+.2,v+.78,k[1]],[k[0]-.2,v+.78,k[1]],[0,.5,.86]),L.quad([k[0],v+.28,k[1]-.24],[k[0],v+.28,k[1]+.24],[k[0],v+.78,k[1]+.2],[k[0],v+.78,k[1]-.2],[.86,.5,0]),L.move(0))}const e=6,a=(f,c,x,k,v)=>{const r={m:new _.Matrix4().makeTranslation(f+Math.cos(v)*.5,x+k-.1,c-Math.sin(v)*.5).multiply(rt.makeRotationY(v)).multiply(nt.makeScale(.8,2.6,1)),a:[h(),0,h(),0],c:h.pick(o.pennant)};m("mast",f,x+k,c)&&(L.kind(H.TIMBER).col(o.timber).box(f-.07,x,c-.07,f+.07,x+k,c+.07,"y"),i.push(r))};for(const f of[-1,1]){const c=t.lanes[3].a+f*e/t.RQ,x=t.pos(t.RQ+1.1,c);a(x[0],x[1],t.DECK,6.5,-c)}return{g:L,cloth:i}}function It(t,n,o,d,h){const l=d(0,0,0),m=d(1,0,0),L=d(0,1,0),i=[m[0]-l[0],0,m[2]-l[2]],b=[L[0]-l[0],0,L[2]-l[2]],u=x=>[-x[0],0,-x[2]],e=(x,k,v,s,r,w)=>{t.quad(d(x,k,w),d(s,k,w),d(s,r,w),d(x,r,w),[0,1,0]),t.quad(d(x,k,v),d(s,k,v),d(s,k,w),d(x,k,w),u(b)),t.quad(d(x,r,v),d(s,r,v),d(s,r,w),d(x,r,w),b),t.quad(d(x,k,v),d(x,r,v),d(x,r,w),d(x,k,w),u(i)),t.quad(d(s,k,v),d(s,r,v),d(s,r,w),d(s,k,w),i)},a=[.5,.39,.26],f=[.74,.62,.4],c=n.cloth[Math.floor(h*n.cloth.length)%n.cloth.length];if(o===7){t.kind(H.TIMBER).col(a),e(-1.85,-.05,0,-1.75,.05,2.4),e(1.75,-.05,0,1.85,.05,2.4),t.col(J(a,.7)),e(-1.8,-.012,2.24,1.8,.012,2.27),e(-1.83,-.5,2.02,-1.77,-.05,2.07),t.kind(H.CLOTH);for(const[x,k,v,s]of[[-1.4,-.6,1.25,[.86,.83,.76]],[-.4,.3,.8,c],[.55,1.45,1.05,[.8,.78,.71]]])t.col(s),e(x,-.015,2.25-v,k,.015,2.26);t.kind(H.LAMP).col([1,.56,.18]).move(1),e(-1.88,-.56,1.74,-1.72,-.4,2.02),t.move(0);return}if(o===0){t.kind(H.TIMBER).col(a),e(-.9,-.4,0,-.1,.4,.6),e(.1,-.35,0,.85,.35,.46),t.col(J(a,.8)),e(-.6,-.3,.6,.1,.3,1),t.col(J(a,.6));for(const[x,k]of[[-1.3,-.9],[1.3,-.9],[-1.3,.9],[1.3,.9]])e(x-.035,k-.035,0,x+.035,k+.035,k<0?2.05:2.35);t.kind(H.CLOTH).col(c).quad(d(-1.45,-1.05,2.02),d(1.45,-1.05,2.02),d(1.45,1,2.36),d(-1.45,1,2.36),[0,1,0],[0,0,1,0,1,.8,0,.8])}else if(o===1)t.kind(H.TIMBER).col(f),e(-.7,-.3,0,-.1,.3,.42),e(.05,-.28,0,.6,.27,.36),t.col(J(f,.86)),e(-.5,-.24,.42,0,.24,.74),t.col([.62,.55,.42]),e(.85,-.3,0,1.45,.3,.14),e(.95,-.2,.14,1.35,.2,.26);else if(o===2)t.kind(H.TIMBER).col(a),e(-.85,-.2,.42,.85,.2,.48),e(-.75,-.17,0,-.67,.17,.42),e(.67,-.17,0,.75,.17,.42),t.kind(H.CLOTH).col(c).quad(d(.2,-.24,.49),d(.7,-.24,.49),d(.7,.24,.49),d(.2,.24,.49),[0,1,0],[0,0,1,0,1,.8,0,.8]),t.quad(d(.2,-.24,.49),d(.7,-.24,.49),d(.7,-.26,.2),d(.2,-.26,.2),u(b),[0,0,1,0,1,.8,0,.8]),t.kind(H.LIME).col([.9,.88,.82]),e(-.35,-.05,.48,-.25,.05,.58);else if(o===3){t.kind(H.TIMBER).col(J(a,.7)),e(-.04,-.04,0,.04,.04,2.45);const x=(k,v,s,r,w)=>{const M=(y,S,A)=>[y[0]+(S[0]-y[0])*A,y[1]+(S[1]-y[1])*A,y[2]+(S[2]-y[2])*A];for(let y=0;y<=9;y++)t.quad(M(k,v,y/9.2),M(k,v,y/9.2+.02),M(r,s,y/9.2+.02),M(r,s,y/9.2),w);for(let y=0;y<=7;y++)t.quad(M(k,r,y/7.15),M(v,s,y/7.15),M(v,s,y/7.15+.017),M(k,r,y/7.15+.017),w)};t.kind(H.CLOTH).col([.5,.47,.4]),x(d(-.04,.03,2.4),d(.05,.03,2.4),d(1.5,.75,.03),d(.2,1,.03),b),x(d(-.05,.02,2.4),d(.03,.04,2.4),d(.1,1,.03),d(-1.2,.5,.03),b),t.col([.4,.43,.42]),x(d(-.04,-.03,2.4),d(.04,-.03,2.4),d(.9,-.55,.35),d(-.7,-.7,.2),u(b))}else if(o===4){t.kind(H.TIMBER).col(a),e(-.8,-.45,.5,.8,.45,.58),e(-.8,-.45,.58,.8,-.41,.85),e(-.8,.41,.58,.8,.45,.85),t.col(J(a,.55)),e(-.35,-.55,0,.35,-.49,.7),e(-.35,.49,0,.35,.55,.7);for(const x of[-.38,.38])t.quad(d(.8,x-.03,.54),d(.8,x+.03,.54),d(2,x+.03,.03),d(2,x-.03,.03),[0,1,0]);t.col(f),e(-.5,-.3,.58,.2,.3,.9)}else if(o===5){t.kind(H.TIMBER).col(J(a,.7)),e(-.05,-.5,0,.05,-.42,1.5),e(-.05,.42,0,.05,.5,1.5),e(-.05,-.5,1.5,.05,.5,1.58),t.col([.82,.74,.56]);for(const x of[-.3,-.12])t.quad(d(-1.9,x,.03),d(-1.9,x+.07,.03),d(1.6,x+.07,2.6),d(1.6,x,2.6),b);t.col(J(a,.9)).quad(d(-2.4,.2,.03),d(-2.4,.3,.03),d(2.2,.3,3.3),d(2.2,.2,3.3),b),t.kind(H.CLOTH).col([.86,.82,.72]).quad(d(-1.4,.18,.62),d(-1.4,.36,.72),d(1.5,.36,2.86),d(1.5,.18,2.76),b,[0,0,1,0,1,.8,0,.8])}else{t.kind(H.STONE).col(n.parapet),e(-.9,-.3,0,.9,.3,.2),e(-.9,0,.2,.9,.3,.4);for(const[x,k,v]of[[-.6,-.15,.2],[.1,-.15,.2],[-.3,.15,.4],[.55,.15,.4]])t.kind(H.LIME).col(n.pot[Math.floor((h*7+x*3+9)%n.pot.length)]),e(x-.13,k-.13,v,x+.13,k+.13,v+.26),t.kind(H.LEAF).col(J(n.leaf[0],.9)),e(x-.17,k-.17,v+.26,x+.17,k+.17,v+.56);t.kind(H.TIMBER).col(a),e(1.2,-.3,0,3.4,-.25,.06),e(1.2,.1,0,3.4,.15,.06);for(let x=0;x<6;x++)e(1.4+x*.36,-.3,.02,1.44+x*.36,.15,.05)}}function ye(t,n,o,d,h=null,l=()=>!0){const m=h?Math.hypot(h.x,h.z):0,L=m?-h.x/m:0,i=m?-h.z/m:0,b=m?Math.max(.14,h.y/m):1,u=(w,M,y,S,A=()=>t.DECK,R=n.pave)=>{if(!m||d>.5)return;let D=Math.min(S/b,9);for(let I=0;I<6&&(Math.hypot(w+L*D,M+i*D)>t.RQ+5.85||Math.hypot(w+L*D,M+i*D)<t.RQ+.1);I++)D*=.8;const T=i*y,V=-L*y,z=[[w-T,M-V],[w-T+L*D,M-V+i*D],[w+T+L*D,M+V+i*D],[w+T,M+V]];e.kind(H.PAVE).col(R).move(-1).quad(...z.map(([I,K])=>[I,A(I,K)+.022,K]),[0,1,0]).move(0)},e=at(),a=[],f=[],c=[.25,.24,.23],x=(w,M,y)=>a.push({m:new _.Matrix4().makeTranslation(w,M,y),a:[o(),o.chance(d>.5?.95:.8)?o.range(.8,1.15):0,o(),0],c:[1,.78,.45]});for(let w=-t.aMax+.03;w<t.aMax-.03;w+=15/t.RQ){if(w>t.rampA0&&w<t.aBastE()+2/t.RQ||Math.abs(w-t.lanes[3].a)*t.RQ<7)continue;const M=t.pos(t.RQ+.55,w),y=t.pos(t.RQ+.55,w+.5/t.RQ),S=t.pos(t.RQ+.55,w+.36/t.RQ),A=t.DECK+3.5,R=t.DECK+2.35;if(x(y[0],A,y[1]),!l("lamp post",M[0],A+.06,M[1])){a.pop();continue}e.kind(H.STONE).col(n.bastion).box(M[0]-.17,t.DECK,M[1]-.17,M[0]+.17,R,M[1]+.17,"yY"),e.col(n.parapet).box(M[0]-.23,R,M[1]-.23,M[0]+.23,R+.13,M[1]+.23,""),e.kind(H.TIMBER).col([.5,.48,.44]).box(M[0]-.045,R+.13,M[1]-.045,M[0]+.045,A+.06,M[1]+.045,"yY"),e.quad([M[0],A-.04,M[1]],[y[0],A-.04,y[1]],[y[0],A+.04,y[1]],[M[0],A+.04,M[1]],[-Math.sin(w),0,Math.cos(w)]),e.quad([M[0],A-.5,M[1]],[S[0],A-.05,S[1]],[S[0],A-.01,S[1]],[M[0],A-.42,M[1]],[-Math.sin(w),0,Math.cos(w)]),u(M[0],M[1],.17,3.5)}const k=(w,M,y,S)=>{const A=M-.42+S;e.kind(H.STONE).col(n.parapet).box(w-.14,M,y-.14,w+.14,M+.2,y+.14,"y"),S>0&&e.kind(H.TIMBER).col(c).box(w-.035,M+.2,y-.035,w+.035,A+.62,y+.035,"yY"),e.kind(H.TIMBER).col(c),e.box(w-.14,A+.62,y-.14,w+.14,A+.66,y+.14,""),e.kind(H.LAMP).col([1,.56,.18]).move(1).box(w-.1,A+.66,y-.1,w+.1,A+.98,y+.1,"yY"),e.kind(H.TIMBER).col(c).move(0);const R=[[-.11,-.11],[.11,-.11],[.11,.11],[-.11,.11]];for(let D=0;D<4;D++){const T=R[D],V=R[(D+1)%4],z=(T[0]+V[0])*2,I=(T[1]+V[1])*2;e.tri(e.vert(w+T[0],A+.98,y+T[1],z,.7,I),e.vert(w+V[0],A+.98,y+V[1],z,.7,I),e.vert(w,A+1.05,y,z,.7,I))}},v=(w,M)=>{const y=Math.atan2(w,-M);return y>t.rampA1?t.rimY:t.rampY(y)};(t.belv||[]).forEach((w,M)=>{if(t.belvTree&&t.belvTree[M]){const y=t.pos(t.RQ+.5,w);u(y[0],y[1],.65,6,v)}});const s=(w,M,y,S,A,R)=>{const T=[];S.forEach(([V,z],I)=>{for(let K=0;K<8;K++){const C=K/8*6.2832,B=Math.cos(C),q=Math.sin(C),j=V*(1+A*Math.sin(K*2.4+I*1.7+R));T.push(e.vert(w+B*j,M+z,y+q*j,B,.3+.6*I/S.length,q))}});for(let V=0;V+1<S.length;V++)for(let z=0;z<8;z++){const I=T[V*8+z],K=T[V*8+(z+1)%8],C=T[(V+1)*8+(z+1)%8],B=T[(V+1)*8+z];e.tri(I,K,C),e.tri(I,C,B)}};for(let w=t.rampA0+5/t.RQ;w<t.aI+t.alpha;w+=13/t.RQ){const M=t.pos(t.RQ+.06,w),y=(w>t.rampA1?t.rimY:t.rampY(w))+1.15;w<t.aI-t.alpha&&!(w>t.rampA1-9/t.RQ&&w<t.aI+2/t.RQ)&&k(M[0],y,M[1],w>t.rampA1-40/t.RQ&&w<t.aI?0:.22);for(const S of[3.4,8.1]){const A=w+S/t.RQ,R=t.pos(t.RQ+.38,A),D=A>t.rampA1?t.rimY:t.rampY(A),T=.17+.05*o();if(A>t.aI-t.alpha)continue;const V=o.pick(n.pot),z=o()*6.28,I=A>t.rampA1-20/t.RQ&&A<t.rampA1;u(R[0],R[1],.27,I?1.9:.8,v),d<.5&&e.kind(H.PAVE).col(J(n.pave,.66)).move(-1).quad(...[[-.4,0],[0,.4],[.4,0],[0,-.4]].map(([K,C])=>[R[0]+K,v(R[0]+K,R[1]+C)+.027,R[1]+C]),[0,1,0]).move(0),e.kind(H.LIME).col(V[0]>V[2]?[.74,.44,.29]:[.8,.77,.7]),s(R[0],D,R[1],[[T*.8,0],[T*1.3,.3],[T*1.42,.35],[T*1.2,.36]],0,0),e.kind(H.LEAF).col(J(n.leaf[z<3.14?0:1],.8)).move(.2),s(R[0],D,R[1],I?[[.16,.3],[.3,.6],[.27,1.05],[.17,1.5],[.03,1.9]]:[[.17,.3],[.31,.46],[.27,.64],[.13,.78],[.02,.82]],.16,z),e.move(0)}}for(const w of t.belv||[]){const M=w+2.1/t.RQ,y=t.pos(t.RQ-2.25,M),S=y[0],A=y[1],R=t.rampY(M);e.kind(H.STONE).col(n.parapet).box(S-.2,R,A-.2,S+.2,R+.45,A+.2,"y"),e.kind(H.TIMBER).col(c).box(S-.05,R+.45,A-.05,S+.05,R+2.7,A+.05,"yY"),e.box(S-.13,R+2.7,A-.13,S+.13,R+2.76,A+.13,"");const D=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let T=0;T<4;T++){const V=D[T],z=D[(T+1)%4],I=(V[0]+z[0])/2,K=(V[1]+z[1])/2;e.kind(H.LAMP).col([.8,.46,.15]).move(1);const C=e.vert(S+V[0]*.11,R+2.76,A+V[1]*.11,I,0,K),B=e.vert(S+z[0]*.11,R+2.76,A+z[1]*.11,I,0,K),q=e.vert(S+z[0]*.12,R+3.2,A+z[1]*.12,I,0,K),j=e.vert(S+V[0]*.12,R+3.2,A+V[1]*.12,I,0,K);e.tri(C,B,q),e.tri(C,q,j),e.kind(H.TIMBER).col(c).move(0),e.tri(e.vert(S+V[0]*.13,R+3.2,A+V[1]*.13,I,.7,K),e.vert(S+z[0]*.13,R+3.2,A+z[1]*.13,I,.7,K),e.vert(S,R+3.27,A,I,.7,K))}}[21,13,5].forEach((w,M)=>{const y=t.rampA1-w/275.15,S=t.pos(275.15,y),A=t.rampY(y),R=5+.3*M;e.kind(H.LIME).col(n.pot[M%2]).box(S[0]-.36,A,S[1]-.36,S[0]+.36,A+.5,S[1]+.36,"y"),f.push({m:new _.Matrix4().makeTranslation(S[0],A+.42,S[1]).multiply(rt.makeRotationY(1.7*M)).multiply(nt.makeScale(1.1,R,1.1)),a:[.27+.31*M,0,.6-.2*M,0],c:J(n.cypress[0],.95+.07*M)})});for(const w of t.posts||[]){const M=w.x+w.ax*.65,y=w.z+w.az*.65,S=w.y1;e.kind(H.TIMBER).col(c).box(w.x-.06,w.y0,w.z-.06,w.x+.06,S,w.z+.06,"yY"),(w.ax||w.az)&&e.quad([w.x,S-.3,w.z],[M,S-.03,y],[M,S+.03,y],[w.x,S+.03,w.z],[-w.az,0,w.ax]),x(M,S,y)}const r=w=>Math.abs(Math.sin(w*12.9898+4.1)*43758.5453)%1;for(let w=0,M=-8*st;M<t.rampA0-5/t.RQ;M+=9/t.RQ,w++){const y=t.pos(t.RQ+.34,M+4.5/t.RQ);if(e.kind(H.STONE).col(J(n.quay,1.1)).box(y[0]-.17,t.DECK,y[1]-.17,y[0]+.17,t.DECK+.44,y[1]+.17,"y"),e.kind(H.TIMBER).col(c).box(y[0]-.2,t.DECK+.27,y[1]-.2,y[0]+.2,t.DECK+.33,y[1]+.2,""),u(y[0],y[1],.19,.5),Math.abs(M-t.lanes[3].a)*t.RQ<9)continue;const S=t.RQ+4.1+1.1*r(w),A=t.pos(S,M+(r(w+50)-.5)*2.4/t.RQ),R=[Math.cos(M),Math.sin(M)],D=[Math.sin(M),-Math.cos(M)];It(e,n,(w*3+Math.floor(r(w+9)*2))%8,(T,V,z)=>[A[0]+R[0]*T+D[0]*V,t.DECK+z,A[1]+R[1]*T+D[1]*V],r(w+20)),u(A[0],A[1],.85,1.3)}for(let w=0,M=t.rampA0+7/t.RQ;M<t.rampA1-27/t.RQ;M+=11/t.RQ,w++){const y=t.pos(t.RQ+5.2,M),S=[Math.cos(M),Math.sin(M)],A=[Math.sin(M),-Math.cos(M)];It(e,n,[2,6,1][w%3],(R,D,T)=>[y[0]+S[0]*R+A[0]*D,t.rampY(M+R/t.RQ)+T,y[1]+S[1]*R+A[1]*D],r(w+70))}return{g:e,lamps:a,trees:f}}function ge(){const t=at().kind(H.LEAF).col([1,1,1]),n=12,o=[[.1,.15],[.2,.36],[.36,.47],[.54,.45],[.72,.34],[.88,.18],[1,.02]],d=(h,l)=>{const[m,L]=o[h],i=l%n/n*6.2832,b=L*(1+.15*Math.sin(l%n*2.4+h*1.9)*(h>0&&h<6?1:.3)),u=.035*Math.sin(h*2.3),e=.035*Math.cos(h*1.7),a=.25+.9*m*m;return t.vert(u+Math.cos(i)*b,m,e+Math.sin(i)*b,Math.cos(i),a,Math.sin(i),0,0,m*m)};for(let h=0;h+1<o.length;h++)for(let l=0;l<n;l++){const m=d(h,l),L=d(h,l+1),i=d(h+1,l+1),b=d(h+1,l);t.tri(m,L,i),t.tri(m,i,b)}return t.kind(H.TIMBER).col([.35,.28,.2]).move(0).box(-.05,0,-.05,.05,.14,.05,"yY"),t.build()}function ke(t,n,o,d,h,l=[],m=()=>!0){const L=[],i=f=>[o.leaf[0][0]*.5*f,o.leaf[0][1]*.95*f,o.leaf[0][2]*1.2*f],b=(f,c,x,k=1)=>{const v=t.pos(f,c),s=n.range(6.5,11),r=s*n.range(.2,.27),w=n(),M=.2+.8*n(),y=w<.4,S=w>.857,A={m:new _.Matrix4().makeTranslation(v[0],x,v[1]).multiply(rt.makeRotationY(n()*6.28)).multiply(y?nt.makeScale(r*2.4*k,k<1?r*2.4*k*1.05:s*.66,r*2.4*k):nt.makeScale(r,s,r)),a:[n(),0,n(),0],c:J(n.pick(o.cypress),n.range(.8,1.15))};y&&(A.c=i(.74+.3*(M-.2))),S||L.push(A)},u=xt(t,h),e=n()*6.2832;for(let f=-t.aMax+.02;f<t.aMax-.02;f+=n.range(4,8)/330/d){const c=t.tiersAt(f),x=n.chance(.75)?n.range(2.5,4.5):n.range(8,20),k=Math.sin(f*23+e)+.6*Math.sin(f*61+1+2.7*e)>.7,v=Math.sin(f*140+e),s=x+(k?12+5*v:x<5?1.6*v+1:0);if(!(Math.abs(f-h.a)<h.half+.02&&s<16)){if(Math.abs(f-u.a)<(u.w/2+3)/u.rF&&s<16){b(t.tierR(c)+17+s*.2,f,t.tierY(c)+8.2);continue}b(t.tierR(c)+s,f+(k?0:.006*Math.sin(f*310)),t.tierY(c)+Math.min(13,s*.5)-.3)}}for(const f of t.lanes)for(let c=0;c<t.tiersAt(f.a);c++){const x=t.tierR(c)+3.2,k=c%2?1:-1;for(const v of[.11,.89])b(x,f.a+k*(11/x)*(2*v-1),t.tierY(c),c?1:.55)}for(const f of t.belv||[]){const c=t.pos(t.RQ-1.75,f),x=n.range(2.8,4.5);(n.chance(.25)?[]:L).push({bay:f,m:new _.Matrix4().makeTranslation(c[0],t.rampY(f)-.1,c[1]).multiply(rt.makeRotationY(n()*6.28)).multiply(nt.makeScale(1.15,x,1.15)),a:[n(),0,n(),0],c:J(o.cypress[1],n.range(1.1,1.35))})}for(const[f,c]of[[-1,t.aI-t.alpha]])for(const x of[279.5,285.5]){const k=t.pos(x,c+f*3.6/x),v=n.range(5.2,6.6);L.push({m:new _.Matrix4().makeTranslation(k[0],t.rimY-.1,k[1]).multiply(rt.makeRotationY(n()*6.28)).multiply(nt.makeScale(1.25,v,1.25)),a:[n(),0,n(),0],c:J(o.cypress[0],n.range(.9,1.1))})}for(const f of l){const c=n.int(2,3);for(let x=0;x<c;x++){const k=f.a0+(f.a1-f.a0)*(x+n.range(.25,.75))/c,v=t.pos(f.r+n.range(2.2,5.6),k),s=n.range(7,12),r=n.chance(.6),w=s*(r?n.range(.6,.85):n.range(.22,.3));L.push({m:new _.Matrix4().makeTranslation(v[0],t.tierY(f.k),v[1]).multiply(rt.makeRotationY(n()*6.28)).multiply(nt.makeScale(w,r?s*.75:s,w)),a:[n(),0,n(),0],c:r?i(n.range(.7,1.05)):J(n.pick(o.cypress),n.range(.7,1.05))})}}const a=L.filter(f=>{const c=f.m.elements,x=Math.hypot(c[0],c[2]);return m("tree",c[12],c[13]+c[5],c[14])&&m("tree",c[12],c[13]+.6*c[5],c[14],x/2+2.5,1/0)});return t.belvTree=(t.belv||[]).map(f=>a.some(c=>c.bay===f)),a}function Me(t,n,o){n=Object.assign({},n,{hall:ht(n.hall,[.84,.6,.34],.4)});const d=at(),h=t.tiersAt(o.a),l=t.tierR(h)+3,m=t.tierY(h)+5,L=12.5,i=10,b=o.arches,u=o.a-o.half,e=o.a+o.half,a=(V,z,I)=>{const K=t.pos(V,z);return[K[0],I,K[1]]},f=[-Math.sin(o.a),Math.cos(o.a)];d.kind(H.STONE).col(n.bastion).quad(a(l-.6,u,m-5.5),a(l-.6,e,m-5.5),a(l-.6,e,m),a(l-.6,u,m),[f[0],0,f[1]]),d.kind(H.PAVE).col(n.pave).quad(a(l-.6,u,m),a(l-.6,e,m),a(l+i,e,m),a(l+i,u,m),[0,1,0]);const c=l*Math.sin((e-u)/b/2)-.8+3.4,x=L+c;d.kind(H.STONE).col(J(n.hall,1.08)).quad(a(l-.3,u,m+L-.45),a(l-.3,e,m+L-.45),a(l-.3,e,m+L+.12),a(l-.3,u,m+L+.12),[f[0],0,f[1]]);for(const[V,z,I]of[[m,4.4,L],[m+L,2.2,c]])for(let K=0;K<b;K++){const C=u+(e-u)*K/b,B=u+(e-u)*(K+1)/b,q=t.pos(l,C),j=t.pos(l,B),O=Math.hypot(j[0]-q[0],j[1]-q[1])/2-.8;lt(d,q,j,I-z,O,f,3.2,{quay:n.hall},!0,8,V+z);const p=t.pos(l,C+(B-C)*.8/(O+.8)/2),g=t.pos(l,B-(B-C)*.8/(O+.8)/2),E=[f[0],0,f[1]];d.kind(H.STONE).col(n.hall),d.quad([q[0],V,q[1]],[p[0],V,p[1]],[p[0],V+z,p[1]],[q[0],V+z,q[1]],E),d.quad([g[0],V,g[1]],[j[0],V,j[1]],[j[0],V+z,j[1]],[g[0],V+z,g[1]],E),d.kind(H.ROOM).col(J(n.hall,.3)).quad([p[0]-f[0]*3.2,V,p[1]-f[1]*3.2],[g[0]-f[0]*3.2,V,g[1]-f[1]*3.2],[g[0]-f[0]*3.2,V+z,g[1]-f[1]*3.2],[p[0]-f[0]*3.2,V+z,p[1]-f[1]*3.2],E)}d.kind(H.LIME).col(n.hall),d.quad(a(l,u,m),a(l+i,u,m),a(l+i,u,m+x),a(l,u,m+x),[-Math.cos(o.a),0,-Math.sin(o.a)]),d.quad(a(l+i,e,m),a(l,e,m),a(l,e,m+x),a(l+i,e,m+x),[Math.cos(o.a),0,Math.sin(o.a)]),d.quad(a(l+i,u,m),a(l+i,e,m),a(l+i,e,m+x),a(l+i,u,m+x),[-f[0],0,-f[1]]),d.kind(H.SLATE).col(n.slate);const k=l+i/2,v=m+x+2.6,s=.012;d.quad(a(l-.5,u-s/4,m+x),a(l-.5,e+s/4,m+x),a(k,e-s,v),a(k,u+s,v),[f[0]*.5,.86,f[1]*.5],[0,0,1,0,1,1,0,1]),d.quad(a(l+i+.5,e+s/4,m+x),a(l+i+.5,u-s/4,m+x),a(k,u+s,v),a(k,e-s,v),[-f[0]*.5,.86,-f[1]*.5],[0,0,1,0,1,1,0,1]),d.quad(a(l-.5,u-s/4,m+x),a(k,u+s,v),a(k,u+s,v),a(l+i+.5,u-s/4,m+x),[-Math.cos(o.a)*.6,.8,-Math.sin(o.a)*.6]),d.quad(a(l+i+.5,e+s/4,m+x),a(k,e-s,v),a(k,e-s,v),a(l-.5,e+s/4,m+x),[Math.cos(o.a)*.6,.8,Math.sin(o.a)*.6]);const r=xt(t,o),w=(r.w/2+.9)/r.rF,M=r.a-w,y=r.a+w,S=r.rF-1.1,A=r.rF+t.ROOMD+1.2,R=t.tierY(h)-20,D=[-Math.sin(r.a),0,Math.cos(r.a)],T=[Math.cos(r.a),0,Math.sin(r.a)];return d.kind(H.STONE).col(n.bastion),d.quad(a(S,M,R),a(S,y,R),a(S,y,r.y0),a(S,M,r.y0),D),d.quad(a(S,M,R),a(A,M,R),a(A,M,r.y0),a(S,M,r.y0),[-T[0],0,-T[2]]),d.quad(a(A,y,R),a(S,y,R),a(S,y,r.y0),a(A,y,r.y0),T),d.col(J(n.hall,1.08)).quad(a(S-.06,M,r.yH-.3),a(S-.06,y,r.yH-.3),a(S-.06,y,r.yH+.15),a(S-.06,M,r.yH+.15),D),d.kind(H.PAVE).col(n.pave).quad(a(S,M,r.y0),a(S,y,r.y0),a(A,y,r.y0),a(A,M,r.y0),[0,1,0]),{g:d,top:r.y0+25,r0:l,y0:m}}const Tt=[70,110],Ht=[2,1.5],xe=[4,5],Dt=[12,16],Ft=[8,11],Ce=[3,7],Bt=.67;function Ee(t,n=1){const o=xe[0]+Math.floor(t()*2),d=t.chance(.5)?1:-1,h=(o>4?[[3,3.8],[6.4,7],[4.8,5.4]]:[[3,4.4],[5.6,7]]).map(e=>n*t.range(e[0],e[1])),l={la:n*t.range(8,10.2),lb:n*t.range(7,10),h:n*t.range(Dt[0],Dt[1]),great:!0,m:7},m={la:t.range(11,12.5),lb:t.range(9.5,10.5),h:n*t.range(Ft[0],Ft[1]),house:!0,m:8},L={la:n*t.range(4,5.3),lb:n*t.range(3,4.5),h:h[1],m:6},i={la:n*t.range(2.8,3.8),lb:n*t.range(2.2,3.2),h:h[0],m:6};l.s=l.la,m.s=1.85*l.la+m.la,L.s=m.s+m.la+.8*L.la,i.s=L.s+L.la+.5*i.la;const b=(i.s+i.la)/2,u=[l,m,L,i];if(o>4){const e=n*t.range(2.5,3.5);u.push({la:n*t.range(3,4.5),lb:e,h:h[2],m:6,s:1.85*l.la*t.range(.8,1.1),b:(t.chance(.5)?1:-1)*(12.7-1.12*e)})}for(const e of u){e.a=d*(b-e.s),e.b===void 0&&(e.b=e.house||e.great?0:n*t.range(-3,3));const a=e.great?[t.range(2,4.5),t.range(5.5,8)]:[t.range(1,.45*e.h/n)],f=e.great?[-.38,.04,.42]:[-.25,.25],c=Math.floor(t()*f.length);e.pts=e.house?[]:f.map((x,k)=>[e.a+x*e.la+n*t.range(-.5,.5),e.b+n*t.range(-.8,.8),e.h-n*(k===c?0:a.shift())])}return{A:b,crags:u}}function Kt(t,n,o,d,h){const l=(c,x,k)=>{const v=[x[0]-c[0],x[1]-c[1],x[2]-c[2]],s=[k[0]-c[0],k[1]-c[1],k[2]-c[2]],r=[v[1]*s[2]-v[2]*s[1],v[2]*s[0]-v[0]*s[2],v[0]*s[1]-v[1]*s[0]],w=Math.hypot(r[0],r[1],r[2])||1;t.col(J(h,d.range(.8,1.08))),t.tri(...[c,x,k].map(M=>t.vert(M[0],M[1],M[2],r[0]/w,r[1]/w,r[2]/w)))},m=o.m,L=o.pts,i=[],b=[],u=[],e=o.house?0:d()*6.2832;for(let c=0;c<m;c++){const x=e+(c+(o.house?0:d.range(-.25,.25)))/m*6.2832,k=o.house?d.range(.95,1.06):d.range(.88,1.06),v=Math.cos(x),s=Math.sin(x),r=o.house?1/Math.max(Math.abs(v),Math.abs(s)):1,w=v*r*o.la*k,M=s*r*o.lb*k;let y=0;for(let R=1;R<L.length;R++)Math.abs(L[R][0]-o.a-.6*w)<Math.abs(L[y][0]-o.a-.6*w)&&(y=R);const S=o.house?o.h-d.range(0,2.6):L[y][2]*d.range(.4,.75),A=Math.max(.3,1-S*(o.house?d.range(.08,.14):d.range(.15,.3))/Math.hypot(w,M));i.push([w,M,0]),b.push([w*A,M*A,S]),u.push(y)}const a=o.great?2*o.lb/(Math.max(...i.map(c=>c[1]))-Math.min(...i.map(c=>c[1]))):1;for(const c of[i,b])c.forEach((x,k)=>{c[k]=n(o.a+x[0],o.b+x[1]*a,x[2])});const f=o.house?[n(o.a,o.b,o.h)]:L.map(c=>n(c[0],c[1],c[2]));for(let c=0;c<m;c++){const x=(c+1)%m,k=Math.sign(u[x]-u[c]);l(i[x],i[c],b[c]),l(i[x],b[c],b[x]),l(b[x],b[c],f[u[c]]);for(let v=u[c];v!==u[x];v+=k)l(b[x],f[v],f[v+k])}return i}const Re=[2,3],Ct=[1,3],zt=[.5,1.6],Ae=t=>{const n=(t.quay[0]+t.quay[1]+t.quay[2])/3;return t.quay.map((o,d)=>Bt*(.25*o+.75*n)*(d>1?1.05:1))};function Te(t,n,o,d,h,l){const m=Ae(o),L=n.pos(n.RQ+1.5,n.aMax);n.footing=[];const i=(b,u,e,a,f,c)=>{const x=f-e,k=c-a,v=Math.max(0,Math.min(1,((b-e)*x+(u-a)*k)/(x*x+k*k||1)));return Math.hypot(b-e-x*v,u-a-k*v)};for(const b of[n.isle,n.isle2])if(b){const[u,e,a,f]=b,c=b===n.isle,x=c?1.5+.18:2.4+.9,k=n.ROOMD+x,v=1.5*n.bay*.95+x;for(const s of[1,-1])for(const r of[1,-1]){const w=Re[0]+Math.floor(d()*2);for(let M=0;M<w;M++){const y=(w>2?[22,45,68][M]:[30,60][M])*st+d.range(-.1,.1),S=d.range(Ct[0],Ct[1])/2,A=d.range(.35,.6),R=d.range(zt[0],zt[1]),D=s*Math.cos(y),T=r*Math.sin(y),V=D*a-T*f,z=D*f+T*a,I=s*k+D*S*.9,K=r*v+T*S*.9,C=u+a*I-f*K,B=e+f*I+a*K,q=h("stone",C,R,B)&&[-1,-.5,0,.5,1].every(j=>{const O=C+j*S*V,p=B+j*S*z;return!(l.boats||[]).some(g=>{const E=g.m.elements;return i(O,p,E[12]-3*E[8],E[14]-3*E[10],E[12]+3*E[8],E[14]+3*E[10])<.8+.5+A})&&!(l.posts||[]).some(g=>Math.hypot(g.x-O,g.z-p)<.65+A)&&!(!c&&i(O,p,u,e,L[0],L[1])<1.2+.5+A)});Kt(q?t.kind(H.ROCK).move(0):at(),(j,O,p)=>[C+j*V-O*z,p,B+j*z+O*V],{a:0,b:0,la:S,lb:A,h:R,m:5,pts:[[d.range(-.2,.2)*S,0,R]]},d,m),n.footing.push({isle:c?1:2,x:C,z:B,h:R,ok:q})}}}}function Oe(t,n,o,d=null,h=null,l=null){let m=at().kind(H.ROCK);const L=120,i=m;if(o.farIsles=[1,-1].map(b=>{const u=o.pos(t.range(200,290),b*t.range(100,165)*st);return[u[0],u[1],t.range(0,3.14)]}),o.nearRock=null,d&&h){const b=d.at(0,0)[0]*o.farIsles[0][0]>=0?0:1,u=o.farIsles[b],e=(Math.hypot(u[0],u[1])-200)/90,a=(Math.abs(Math.atan2(u[0],-u[1]))/st-100)/65,f=u[2]/3.14,c=d.at(d.lead+(1+a)*d.pitch,-d.half),x=Tt[0]+e*(Tt[1]-Tt[0]),k=(T,V)=>{let z=1/0;for(let I=3;I<28;I+=2)z=Math.min(z,h(T,I,V));return z},v=[];for(let T=0;T<=300;T+=2)v.push(k(c[0]-d.nb[0]*T,c[1]-d.nb[1]*T));let s=v.indexOf(Math.min(...v));for(;s<v.length-1&&v[s]<x;)s++;s*=2;const r=c[0]-d.nb[0]*s,w=c[1]-d.nb[1]*s,M=Math.atan2(d.d[1],d.d[0]),y=.05+.25*f,S=30,A=o.isle2||[r,w],R=T=>Math.min(...[-1,1].map(V=>Math.hypot(r+V*S*Math.cos(T)-A[0],w+V*S*Math.sin(T)-A[1]))),D=R(M+y)>=R(M-y)?M+y:M-y;o.farIsles[b]=[r,w,D],o.nearRock={k:b,x:r,z:w,yaw:D,A:S,B:15*1.5,off:+k(r,w).toFixed(1)}}for(const[b,u,e,a]of[[1500,30,100,.5],[2050,70,190,.62],[2700,120,300,.76]]){const f=[t()*6.28,t()*6.28,t()*6.28,t()*6.28],c=k=>u+(e-u)*Math.pow(.5+.25*Math.sin(3*k+f[0])+.15*Math.sin(7*k+f[1])+.1*Math.sin(13*k+f[2]),1.5)*(.75+.25*Math.sin(2*k+f[3])),x=(k,v,s)=>[Math.sin(k)*v,s,-Math.cos(k)*v];m.col([n.far[0]*a,n.far[1]*a,n.far[2]*a*1.5]);for(let k=0;k<L;k++){const v=k/L*6.2832,s=(k+1)/L*6.2832,r=(v+s)/2;m.quad(x(s,b,0),x(v,b,0),x(v,b+260,c(v)),x(s,b+260,c(s)),[-Math.sin(r)*.5,.86,Math.cos(r)*.5])}}return m=at(),o.farIsles.forEach(([b,u,e],a)=>{let f=b,c=u,x=0,k=0,v=null;const s=!!o.nearRock&&o.nearRock.k===a,r=!!l,w=s?o.nearRock.A:34,M=s?o.nearRock.B:15,y=s?Ht[1]:1,S=Math.cos(e),A=Math.sin(e),R=(p,g,E)=>[f+(Math.cos(p)*w*S-Math.sin(p)*M*A)*g,E*y,c+(Math.cos(p)*w*A+Math.sin(p)*M*S)*g],D=12,T=[],V=[];for(let p=0;p<D;p++)T.push(t.range(.78,1.15)),V.push(1.4+(.35+.65*t())*(.8+9*Math.pow(Math.max(0,Math.cos(p/D*6.2832)),1.2)));m.kind(H.ROCK);for(let p=0;p<(r?0:D);p++){const g=(p+1)%D,E=p/D*6.2832,N=(p+1)/D*6.2832,F=[f,2.2,c];m.col(J(n.rock,.86+.14*(p%3))),m.quad(R(N,T[g],0),R(E,T[p],0),R(E,T[p]*.7,V[p]),R(N,T[g]*.7,V[g])),m.quad(R(N,T[g]*.7,V[g]),R(E,T[p]*.7,V[p]),F,F,[0,1,0])}if(r){const p=s?o.nearRock:{},g=(W,Y,$)=>[b+W*S-Y*A,$,u+W*A+Y*S],E=(n.quay[0]+n.quay[1]+n.quay[2])/3,N=n.quay.map((W,Y)=>Bt*(.25*W+.75*E)*(Y>1?1.05:1)),F=Ee(l,y/Ht[1]),Q=F.crags[2],G=F.crags[3];p.crags=F.crags,p.A=F.A,p.B=13,p.feet=p.crags.map(W=>Kt(m,g,W,l,N).map(Y=>[Y[0],Y[2]]));const U=p.crags.find(W=>W.house);[f,,c]=g(U.a,U.b,0),x=U.h-1.2,k=e%Math.PI,k>Math.PI/2&&(k-=Math.PI),v=g((Q.a+G.a)/2,(Q.b+G.b)/2,.5*G.h)}const z=m.count,I=f-6,K=f+5,C=c-3.5,B=c+3.5,q=7.8,j=9.5;m.kind(H.STONE).col(n.bastion).box(I-2.5,r?Math.max(-2.6,.05-x):.4,C-2.5,K+2.5,2.05,B+2.5,"y"),m.kind(H.LIME).col(J(n.lime[a?0:1],.92)).box(I,2,C,K,q,B,"yY");for(let p=0;p<2;p++){const g=2.5+p*2.7,E=(N,F,Q,G,U)=>m.quad([F,Q,C-U],[N,Q,C-U],[N,G,C-U],[F,G,C-U],[0,0,-1]);m.kind(H.ROOM).col(J(n.wall,.3)),E(I+.3,K-.3,g,g+2.2,.04),m.kind(H.STONE).col(n.parapet),E(I+.3,K-.3,g,g+.8,.1);for(let N=0;N<4;N++)E(I+.3+N*3.4,I+.6+N*3.4,g,g+2.2,.12)}m.kind(H.SLATE).col(J(n.slate,.9)),m.quad([I-.6,q,B+.6],[K+.6,q,B+.6],[K-3,j,c],[I+3,j,c]),m.quad([K+.6,q,C-.6],[I-.6,q,C-.6],[I+3,j,c],[K-3,j,c]),m.quad([I-.6,q,C-.6],[I-.6,q,B+.6],[I+3,j,c],[I+3,j,c],[-.5,.86,0]),m.quad([K+.6,q,B+.6],[K+.6,q,C-.6],[K-3,j,c],[K-3,j,c],[.5,.86,0]),m.kind(H.ROOM).col(J(n.wall,.22));for(let p=0;p<2;p++)for(let g=0;g<2;g++){const E=2.9+g*2.7,N=C+1.3+p*3.3;m.quad([K+.05,E,N+1.1],[K+.05,E,N],[K+.05,E+1.6,N],[K+.05,E+1.6,N+1.1],[1,0,0])}r&&m.lift(z,x).turn(z,f,c,k);const O=[[2,.12],[4.2,.14],[5,.7],[7,1],[9.2,.72],[10.4,.05]];if(a&&!r)for(let p=0;p<5;p++){const g=N=>[f-25*S+Math.cos(N)*2.6,1.2,c-25*A+Math.sin(N)*1.8],E=[f-25.4*S,4.1,c-25.4*A];m.kind(H.ROCK).col(J(n.rock,.86)).quad(g((p+1)*1.2566),g(p*1.2566),E,E)}for(const[p,g,E,N]of r&&s?[]:a?[[-10.5,1,2.4,.64],[-15.5,-2,2.9,.74],[-20,1.5,2,.55]]:[[-12,1,2.5,.36],[-16.5,-1.6,3,.4],[-21,1.2,2.1,.33]])for(let F=0;F+1<O.length;F++)for(let Q=0;Q<7;Q++){const G=v?v[0]+(p+15.5)*.5*S:f+p*S,U=v?v[2]+(p+15.5)*.5*A+g*.6:c+p*A+g,W=v?v[1]:0,Y=Q/7*6.2832,$=(Q+1)/7*6.2832,X=(Y+$)/2,Z=(tt,P)=>[G+Math.cos(tt)*E*P[1],W+P[0]*N,U+Math.sin(tt)*E*P[1]];m.kind(F<1?H.TIMBER:H.LEAF).col(F<1?n.timber:J(n.leaf[0],.8)),m.quad(Z($,O[F]),Z(Y,O[F]),Z(Y,O[F+1]),Z($,O[F+1]),[Math.cos(X),F>3?.8:F<2?0:.15,Math.sin(X)])}if(s&&(m.kind(H.TIMBER).col(n.timber).move(0).box(f-.07,j+x,c-.07,f+.07,j+6+x,c+.07,"y"),o.nearRock.mast=[f,j+6+x,c]),r&&s){const p=l.chance(.5)?1:-1,g=2+Math.floor(l()*2),E=[[0,.5],[.22,1],[.6,.78],[1,.05]],N=m.count;for(let F=0;F<g;F++){const Q=(p>0?K:I)+p*l.range(1.1,1.6),G=c+(F-(g-1)/2)*2.6+l.range(-.4,.4),U=l.range(3.6,6),W=.55+.05*U;m.kind(H.LEAF).col(J(n.cypress[F%2],l.range(.9,1.1)));for(let Y=0;Y+1<E.length;Y++)for(let $=0;$<6;$++){const X=$/6*6.2832,Z=($+1)/6*6.2832,tt=(X+Z)/2,P=(et,it)=>[Q+Math.cos(et)*W*it[1],2.05+x+U*it[0],G+Math.sin(et)*W*it[1]];m.quad(P(Z,E[Y]),P(X,E[Y]),P(X,E[Y+1]),P(Z,E[Y+1]),[Math.cos(tt),.2,Math.sin(tt)])}}m.turn(N,f,c,k)}}),{g:i,rocks:m}}function Se(t,n){const o=new _.ShaderMaterial({uniforms:{...t,uLow:{value:n}},depthWrite:!1,depthTest:!1,side:_.BackSide,vertexShader:`varying vec3 vD; void main() { vD = position; vec4 p = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
      if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:`uniform float uTime, uNight; uniform vec3 uLow; varying vec3 vD;
      ${kt}
      ${Mt}
      void main() {
        vec3 d = normalize(vD); float low = step(d.y, 0.); d.y = abs(d.y);
        // (round 3, B-ii) THE SECOND SKY AT THE WELL'S FOOT IS THE PALE DAWN SKY, not the zenith's strong blue: by
        // day the lower dome's heights above 0.25 are drawn together (straight down is the sky 24 degrees up, with
        // its clouds), so nothing under the plane is darker or more saturated than the sky seen overhead
        float yRaw = d.y;
        d.y -= 0.8 * max(d.y - 0.25, 0.) * low * (1. - uNight);
        // (the level part is stretched to the new height; to normalize the vector brought the straight-down
        // direction back to the zenith)
        d.xz = normalize(d.xz + 1e-5) * sqrt(max(1. - d.y * d.y, 0.));
        vec3 c = skyLaw(d);
        // (round the lower pole the sun's side and the far side ran together into a point;
        // there the sky is the mean of the two sides, the same all round)
        c = mix(c, 0.5 * (c + skyLaw(vec3(-d.x, d.y, -d.z))), low * (1. - uNight) * smoothstep(0.55, 0.92, yRaw));
        // the sun's disc by day (small, not blown out; by night no disc is drawn: the moon is never in the lens)
        float s = dot(d, uSunDir);
        c += uSunGlow * 2.6 * smoothstep(0.99962, 0.99985, s) * (1. - uNight);
        // a few long thin clouds lying level, low in the sky (bands along the horizon, never spokes from overhead),
        // touched pink on the sun's side; they drift by the clock
        vec2 az = normalize(d.xz + 1e-5);
        // (round 4, D1: NO LONG STRAIGHT STREAK: by day every band rises and falls a degree or two along its
        // length (yc) and is broken into lengths by a slow noise round the horizon (brk); by night as it was)
        // (the bands were long and straight: they bend twice as much and
        // the lengths are half as long)
        float dK = 1. - uNight, yc = d.y + dK * (0.04 * (3. * az.y - 4. * az.y * az.y * az.y) + 0.06 * vn(az * 4.3 + 2.));
        float brk = mix(1., smoothstep(0.35, 0.6, vn(az * 5.2 + 4.)), dK);
        float cl = vn(vec2(az.x * 2.3 + 5. + uTime * 0.004, yc * 34.)) * vn(vec2(az.y * 2.3 + 9. - uTime * 0.003, yc * 21. + 3.));
        float m = smoothstep(0.34, 0.6, cl) * smoothstep(0.05, 0.11, d.y) * (1. - smoothstep(0.26, 0.42, d.y));
        // (round 3, A3) by day a second, higher flight of long clouds (they stand over the crest in the opening),
        // and all of them catch the low sun: pink across from it, gold toward it, by the warmth of the hour's glow
        // (by night the clouds are as they were)
        float wm = min(1., 1.3 * max(uSunGlow.r - uSunGlow.b, 0.)) * (1. - uNight);
        float c2 = vn(vec2(az.x * 1.7 + 2. - uTime * 0.003, yc * 23. + 7.)) * vn(vec2(az.y * 1.7 + 4. + uTime * 0.002, yc * 15. + 1.));
        // (the clouds stood as broad white arcs; they are thinner, broken along their length by a
        // finer noise, and plainly salmon across from the sun and gold toward it)
        float wisp = 0.55 + 0.45 * vn(vec2(az.x * 9. + az.y * 7., d.y * 60.));
        m = max(m * mix(1., wisp, wm), (1. - uNight) * smoothstep(0.4, 0.62, c2) * wisp * smoothstep(0.24, 0.34, d.y) * (1. - smoothstep(0.5, 0.7, d.y)));
        vec3 cc = uSkyHor * mix(1.04, 0.42, wm) + uSunGlow * vec3(0.5, 0.26, 0.3) * (0.35 + 0.65 * pow(max(s, 0.), 2.));
        cc += wm * mix(vec3(0.66, 0.24, 0.2), vec3(0.8, 0.42, 0.1), smoothstep(-0.3, 0.8, s));
        // (no cloud is drawn round the lower dome's pole by day: the clouds ran together
        // into a point straight under the lens)
        // (round 5, C5, the guard's must-fix: the long ribbon and the cut ends) BY DAY THE CLOUDS ARE A FEW SOFT
        // FEATHERED SHAPES, not bands: round the horizon eight places, a cloud in rather more than half of them,
        // each a long lens (15 to 26 degrees long, 2 to 4 high, 7 to 25 degrees up) that thins away to nothing
        // at both ends and all round, its edge broken by a fine noise; two or three are seen at once. They
        // drift by the clock. By night the bands are as they were
        float phi = atan(az.x, az.y) + uTime * 0.0015, cellC = floor(phi / 0.63), mD = 0.;
        for (int k = -1; k < 2; k++) {
          float ci = cellC + float(k), hc = h21(vec2(ci, 7.3)), pc = (ci + 0.25 + 0.5 * h21(vec2(ci, 1.9))) * 0.63;
          float yc0 = 0.13 + 0.3 * h21(vec2(ci, 4.1)), Lc = 0.13 + 0.1 * hc, Hc2 = 0.017 + 0.02 * h21(vec2(ci, 8.8));
          float e = length(vec2((phi - pc) / Lc, (d.y - yc0 - 0.02 * sin((phi - pc) * 6.)) / Hc2));
          // (the guard: a cloud read as one ribbon:
          // on the other hand's side of the dome two long neighbours lie end to end. Every cloud is BROKEN ALONG ITS
          // LENGTH by a slow noise, a third of it open sky in gaps of 3 to 5 degrees, and none is over 21 degrees long)
          // (cut across, a cloud showed a straight cut end. At a gap the cloud's HEIGHT
          // draws in to a fifth and it thins away: every piece is a feathered lens of its own)
          float gp = smoothstep(0.24, 0.66, vn(vec2(phi * 11. + ci * 3.7, 0.5)));
          e = length(vec2((phi - pc) / min(Lc, 0.18), (d.y - yc0 - 0.02 * sin((phi - pc) * 6.)) / (Hc2 * (0.2 + 0.8 * gp))));
          mD = max(mD, step(0.42, hc) * step(-4.5, ci) * step(ci, 3.5) * (1. - smoothstep(0.15, 1., e + 0.7 * (vn(vec2(phi * 16., d.y * 110.)) - 0.5))) * smoothstep(0., 0.55, gp));
        }
        m = mix(m, mD, dK);
        m *= 1. - low * (1. - uNight) * smoothstep(0.7, 0.95, yRaw);
        c = mix(c, cc, m * (0.55 + 0.25 * wm) * (1. - 0.8 * uNight));
        // stars by night
        vec2 sq = d.xz / (d.y + 0.35) * 70., g = floor(sq); float st = h21(g);
        float dot2 = length(fract(sq) - 0.5 - 0.3 * (vec2(h21(g + 3.), h21(g + 9.)) - 0.5));
        c += uNight * vec3(0.8, 0.85, 1.) * step(0.975, st) * (1. - smoothstep(0.04, 0.16, dot2)) * (0.6 + 0.4 * sin(uTime * 2. + st * 300.)) * smoothstep(0.05, 0.3, d.y);
        gl_FragColor = vec4(c * mix(vec3(1.), uLow, low), 1.);
      }`}),d=new _.Mesh(new _.SphereGeometry(3e3,32,20),o);return d.renderOrder=-1,d.frustumCulled=!1,{mesh:d,mat:o}}const Ot=40;function Ne(t,n,o,d){const h=[],l=d.jetty,m={uJet:{value:new _.Vector4(l.J0[0],l.J0[1],l.jd[0],l.jd[1])},uJetL:{value:new _.Vector2(l.JL,l.jw)},uCw:{value:new _.Vector4(d.S[0],d.S[1],d.d[0],d.d[1])},uCwP:{value:new _.Vector4(d.lead,d.pitch,d.pitch/2-d.R,d.L)},uIsle:{value:new _.Vector4(...(n.isle||[1e5,1e5]).slice(0,2),...(n.isle2||[1e5,1e5]).slice(0,2))}};for(let b=0;b<Ot;b++){const u=o[b];h.push(u?new _.Vector3(u.x,u.z,u.ph):new _.Vector3(0,0,-1))}const L=new _.ShaderMaterial({transparent:!0,depthWrite:!1,uniforms:{...t,...m,uBoats:{value:h},uPlan:{value:new _.Vector4(n.RQ,n.aMax,n.aI,n.alpha)},uRHead:{value:n.rHQ},uDock:{value:new _.Vector2(n.rPier,n.aBastE()-n.aI-n.alpha)}},vertexShader:"varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`uniform float uTime, uHand, uRHead, uNight; uniform vec4 uPlan, uHaze, uJet, uCw, uCwP, uIsle; uniform vec2 uJetL, uDock; uniform vec3 uBoats[${Ot}]; varying vec3 vW;
      ${kt}
      ${Mt}
      ${St}
      void main() {
        vec2 p = vec2(vW.x * uHand, vW.z);
        vec3 V = normalize(vec3(cameraPosition.x * uHand, cameraPosition.y, cameraPosition.z) - vec3(p.x, 0., p.y));
        float dist = length(cameraPosition - vW);
        float fres = pow(1. - clamp(V.y, 0., 1.), 5.);
        // NOT ICE: by day the sheet, seen low, turns back the sky from a little way up (the
        // water is never dead flat: its small slopes show the bluer sky over the pale rim), not the horizon's pallor
        vec3 sky = skyLaw(vec3(-V.x, max(V.y, mix(0.13, 0.02, uNight)), -V.z));
        // distance to the shore: the quay's front, the inlet's flanks and head
        float r = length(p), a = atan(p.x, -p.y + 1e-4), da = abs(a - uPlan.z);
        float d = uPlan.x - r;
        // (inside the inlet only: out in the bay the flanks' lines are no shore)
        // (round 3, B1: behind the pier, uDock.x from the centre, the harbour's water goes on east by the angle
        // uDock.y; its shores there are the pier's inland face and the east arm's cut end; uRHead is the head's quay)
        float sA = a - uPlan.z, eE = uPlan.w + uDock.y * step(uDock.x, r), hb = 0.;
        if (sA > -uPlan.w && sA < eE && r > uPlan.x) {
          hb = 1.;
          d = min(min((sA + uPlan.w) * r, (eE - sA) * r), uRHead - r);
          if (sA > uPlan.w) d = min(d, r - uDock.x);
        }
        else if (da < uPlan.w) d = length(vec2((uPlan.w - da) * r, uPlan.x - r));
        d = mix(d, 40., step(uPlan.y, abs(a)));
        // the jetty's piles and the causeway's piers stand in the water too: the skin goes round each of them
        vec2 qj = p - uJet.xy; float js = dot(qj, uJet.zw), jo = abs(dot(qj, vec2(-uJet.w, uJet.z)));
        float dpile = length(vec2(abs(mod(clamp(js, 0., uJetL.x) - 3. + 3.125, 6.25) - 3.125) + max(js - uJetL.x, 0.) + max(-js, 0.), jo - uJetL.y - 0.12)) - 0.16;
        vec2 qc = p - uCw.xy; float cs = dot(qc, uCw.zw), co = abs(dot(qc, vec2(-uCw.w, uCw.z)));
        float dsp = abs(mod(cs - uCwP.x + 0.5 * uCwP.y, uCwP.y) - 0.5 * uCwP.y) - uCwP.z;
        if (cs < uCwP.x || cs > uCwP.w - uCwP.x) dsp = max(max(-cs, cs - uCwP.w), 0.);
        float dpier = length(max(vec2(dsp, co - 4.3), 0.));
        d = min(d, min(dpile, dpier));
        d = max(d, 0.);
        float lap = 0.5 + 0.5 * sin(d * 7. - uTime * 1.1 + 4. * vn(p * 0.35));
        float skin = exp(-d * 2.6) * (0.55 + 0.45 * lap) + 0.22 * exp(-d * 0.45) * smoothstep(0.55, 0.95, lap);
        // rings about the boats (each boat on its own phase)
        // (round 3, A5) and SLOW WIDE RINGS: about each boat a few broad rings (5 m from crest to crest) go out
        // 40 m and more, slowly, so the open lake's reflection is seen to be water (by day; seen from far too)
        float ring = 0., wide = 0.;
        for (int i = 0; i < ${Ot}; i++) {
          vec3 b = uBoats[i]; float db = length(p - b.xy);
          ring += step(0., b.z) * exp(-db * 0.42) * smoothstep(0.75, 1., sin(db * 4.2 - uTime * 1.4 + b.z * 6.28)) * smoothstep(0.7, 1.6, db);
          wide += step(0., b.z) * exp(-db * 0.1) * smoothstep(0.4, 1., sin(db * 1.26 - uTime * 0.7 + b.z * 6.28)) * smoothstep(2., 6., db);
        }
        // (ROUND 5 MENDING 5, L7: BY PLACE AND CLOCK ONLY. The rings die out within 25 m of the boat. Only the eye's
        // place is read: a ring, like any fine line, is weighed by the pixel's own footprint on the plane,
        // fp in metres: whole while the footprint is under a quarter of the way from crest to crest, gone at half)
        float fp = max(length(dFdx(p)), length(dFdy(p)));
        wide = min(wide, 1.) * (1. - uNight) * (1. - smoothstep(1.25, 2.5, fp));
        // (round 4, B3) RINGS ROUND THE PIERS AND THE PILES by day: from each of the causeway's piers and the
        // jetty's piles slow rings go out some 12 m (2.4 m from crest to crest, bent a little by a noise), a
        // soft brightening of the sheet that crosses the double and leaves it clear between
        float dpp = min(dpier, dpile);
        float ringP = (1. - uNight) * exp(-dpp * 0.2) * smoothstep(0.7, 1., sin(dpp * 2.6 - uTime * 1.5 + 3. * vn(p * 0.2))) * smoothstep(0.3, 1.2, dpp);
        wide = max(wide, ringP * (1. - smoothstep(0.6, 1.2, fp)));
        // the breath of air: fine ripples inside the band
        float br = breathBand(p, uTime);
        float rip = 0.5 + 0.5 * sin(dot(p, uBreath.xy) * 5.5 + uTime * 4.5 + 5. * vn(p * 0.9 + uTime * 0.2));
        float foot = clamp(1. - dist / 160., 0., 1.);
        // THE SHEET'S BODY: clear where we look steeply down, a sheen that grows toward the grazing angle (graz) and
        // with the distance (far), silver far off; by night a darker sheet than the sky
        float graz = 1. - clamp(V.y, 0., 1.), far = smoothstep(120., 900., dist);
        float alpha = 0.05 + 0.5 * graz * graz * graz + 0.3 * far * graz + 0.16 * uNight;
        // (seen steeply, as from over the harbour's mouth, the sheet is clearer yet: little sheen there)
        float steep = 0.5 + 0.5 * smoothstep(0.25, 0.7, graz);
        alpha *= steep;
        // (ROUND 5 MENDING 5, L7: the breath band is drawn by place and clock only; its shiver in the lower city is
        // the same everywhere. By day the band's brightening and its flecks, some 18 m across, are weighed by the
        // pixel's footprint on the plane like the rings: whole under 3 m, gone at 9 m, half the band's width)
        br *= mix(1. - smoothstep(3., 9., fp), 1., uNight);
        alpha += skin * 0.7 + ring * 0.4 * foot + (0.09 + 0.08 * (1. - uNight)) * br + 0.12 * wide;
        // the lake breathes: a slow, long swell changes how much sky the sheet turns back, everywhere, by place and clock
        float sw = sin(uTime * 1.9 + 9. * vn(p * 0.045) + p.x * 0.02);
        alpha += (0.05 * sw + 0.05 + 0.04 * vn(p * 0.11 + uTime * 0.03) * foot) * steep;
        // a fine sparkle: small glints that come and go by place and clock, thick inside a breath of air, thin
        // elsewhere, and (by night) the lamps' glitter lying on the water before the quay
        vec2 sc = floor(p * 5.5); float sr = h21(sc), tw = 0.5 + 0.5 * sin(uTime * (2.5 + 4. * sr) + sr * 40.);
        // (round 3, A5: by day a third of the flecks outside a breath of air, and fewer inside one)
        // (fewer yet by day: the white specks read as grain on the mirror)
        float glint = step(0.965 + 0.029 * (1. - uNight) - (0.33 - 0.1 * (1. - uNight)) * min(br, 1.), sr) * tw * tw * tw * (1. - smoothstep(0.1, 0.45, length(fract(p * 5.5) - 0.5)));
        float lampGlit = uNight * exp(-d * 0.05) * step(0.82, sr) * tw * (1. - smoothstep(0.1, 0.45, length(fract(p * 5.5) - 0.5)));
        float near = clamp(1. - dist / 260., 0., 1.);
        // (stage F) THE LAKE IS ALIVE EVERYWHERE, by the world's clock and by place: two trains of long low ripples
        // cross it (7 m and 11 m from crest to crest, bent by a slow noise); they change how much sky the sheet
        // turns back and brighten and darken it a tenth. Not where we look steeply down (the double stays clear)
        // (round 3, stage D: a second, finer noise bends both trains by day, so no crest runs straight for long)
        float bend = 2.6 * (1. - uNight) * vn(p * 0.19 + 3.);
        float wv = sin(dot(p, vec2(0.83, 0.56)) * 0.9 + uTime * 1.5 + 4. * vn(p * 0.05) + bend) * sin(dot(p, vec2(-0.5, 0.87)) * 0.55 - uTime * 1.1 + 3. * vn(p * 0.031 + 7.) - bend);
        float wvk = smoothstep(0.3, 0.8, graz) * (1. - 0.6 * far);
        // (round 3, A5) NO RULED LINES: by day the long ripples come in drifting patches (a slow noise), not in
        // trains across the whole lake, and inside the bay they are half as strong
        // (the patches are wide, most of the lake, and inside the bay the ripples are three quarters as strong)
        wvk *= mix(smoothstep(0.2, 0.45, vn(p * 0.011 + vec2(-uTime * 0.02, uTime * 0.015) + 3.)) * mix(0.75, 1., smoothstep(uPlan.y, uPlan.y + 0.12, abs(a))), 1., uNight);
        alpha += 0.09 * wv * wvk;
        // GENTLE LONG RIPPLES ON THE NEAR WATER by day. LIGHT ON WATER, BY THE ANGLE AT WHICH THE WATER IS SEEN
        // (the eye's place against the water's, nothing else): seen low, the long ripples above change the sheen (wvk); seen steeply, the
        // same long ripples pass in slow drifting patches as soft bands of a little more sheen (the lower city
        // itself sways a hand's breadth where they pass: see the vertex law), and between the patches the
        // double is clear
        float nearR = (1. - uNight) * (1. - smoothstep(0.3, 0.8, graz)) * smoothstep(0.2, 0.8, sin(dot(p, vec2(0.021, 0.013)) + uTime * 0.25) * sin(dot(p, vec2(-0.012, 0.019)) - uTime * 0.18));
        alpha += 0.09 * nearR * (0.5 + 0.5 * wv);
        // (stage F) CAT'S-PAWS: patches of ruffled water drift by the clock over half the open lake; inside a patch
        // the sheet shivers finely. INSIDE THE BAY (the crescent's own water, where the city's double lies) they are
        // faint, a fifth brighter and darker, and there is none within 30 m of the quay, in the basin or by a pier;
        // BEYOND THE HORNS they are plain: two fifths, and the ruffled sheet turns back a quarter more of the sky.
        // None within 35 m of either islet's tower (its double stands in calm water too)
        // (ROUND 5 MENDING 5, L5) ONE STRENGTH ON ALL OPEN WATER OUTSIDE THE BAY. kOut is 1 on the open lake: beyond
        // the horns, and on the lake side of the causeway's line from 6 to 40 m off it and on outward, along its
        // whole length (no city's double lies there). Everywhere kOut is 1 the cat's-paws are plain and lie over a
        // little more of the lake, the fine quick shiver inside one is plainer by day, and the long ripples are two
        // thirds stronger: the same figures beyond the horns as beyond the causeway. By place and clock only; the
        // bay's own water, where the city's double lies, is as it was
        float outC = smoothstep(6., 40., -dot(qc, vec2(-uCw.w, uCw.z))) * step(0., cs) * step(cs, uCwP.w);
        float kOut = max(smoothstep(uPlan.y, uPlan.y + 0.12, abs(a)), outC);
        alpha += 0.06 * wv * wvk * kOut;
        float openK = max(smoothstep(30., 90., d), kOut) * smoothstep(0.35, 0.8, graz);
        openK *= smoothstep(35., 60., min(length(p - uIsle.xy), length(p - uIsle.zw)));
        float paw = smoothstep(0.38 - 0.08 * kOut, 0.56 - 0.08 * kOut, vn(p * 0.018 + vec2(uTime * 0.05, -uTime * 0.03))) * openK;
        float shv = sin(dot(p, vec2(0.6, 0.8)) * 2.6 + uTime * 5.2 + 6. * vn(p * 0.6 + uTime * 0.3)) * (1. - 0.8 * far);
        alpha += paw * (0.07 + 0.19 * kOut + 0.1 * shv);
        // the sheet's own colour: the sky turned back, drawn toward a cool deep tint so that the plane is not the sky
        // (round 3, A5: by day a deeper, greener tint and more of it, so the lake is deep water under the pale
        // houses and never a pale pane; a breath band is a tenth brighter, a slow wide ring a little brighter too;
        // the flecks keep the glow's colour and lose their white)
        // (the bay's water was a pale pane over the double: the tint deeper and half the sheet's colour by day)
        vec3 tint = mix(vec3(0.14, 0.3, 0.4), vec3(0.012, 0.02, 0.045), uNight);
        float dayK = 1. - uNight;
        vec3 col = mix(sky * (1. + 0.08 * sw + (0.1 * wvk + 0.4 * paw * kOut) * wv + (0.2 + (0.2 + 0.7 * dayK) * kOut) * paw * shv +dayK * (0.1 * min(br, 1.) + 0.1 * wide)), tint, 0.3 + 0.25 * uNight + dayK * (0.2 + 0.14 * smoothstep(0.85, 1., graz))) + uSunGlow * 0.5 * skin;
        col += (uSunGlow * 1.2 + 0.25 * uNight + 0.06 * dayK) * glint * near * (0.3 + 0.7 * rip) + vec3(1., 0.72, 0.38) * lampGlit * near * 1.6;
        alpha += 0.55 * glint * near + 0.6 * lampGlit * near;
        // THE LOW SUN'S GLITTER PATH, by day (light on water, a mirror's law): where the line from the water to
        // the eye, turned back by the sheet, bears toward the sun (8 degrees to each side) a path of sparks lies on
        // the water from under the sun toward the eye, each spark a cell of a third of a metre on its own clock,
        // warm as the glow; it lies on the sun's side of the lake only
        float gAz = smoothstep(0.985, 0.9985, dot(normalize(-V.xz + 1e-5), normalize(uSunDir.xz + 1e-5)));
        // (ROUND 5 MENDING 5, L8: A LONGER PATH. The sparks reach out from the lens's side to where the sheet is seen
        // at two fifths of the sun's own height (they were whole only at the sun's height: a short patch); beyond
        // them the far path below carries on to the horizon. Light on water: the sun's bearing, its height, the clock)
        float gEl = smoothstep(0.01, max(0.4 * uSunDir.y, 0.03), V.y) * (1. - smoothstep(uSunDir.y + 0.12, uSunDir.y + 0.6, V.y));
        vec2 gc = floor(p * 3.); float gr = h21(gc + 17.), gt = 0.5 + 0.5 * sin(uTime * (3. + 5. * gr) + gr * 40.);
        // (round 4, D1: NO HARD WHITE SPECKS ON THE WATER: each spark is round and soft in its cell, not a hard
        // square, and by day the fine sparkle elsewhere is at half strength)
        float gK = dayK * gAz * gEl * (0.22 + 0.78 * step(0.5, gr) * gt * gt * (1. - smoothstep(0.15, 0.5, length(fract(p * 3.) - 0.5))));
        col -= 0.5 * dayK * (uSunGlow * 1.2 + 0.06) * glint * near * (0.3 + 0.7 * rip); alpha -= 0.27 * dayK * glint * near;
        col += uSunGlow * 1.5 * gK; alpha += 0.5 * gK;
        // (round 4, B4: ONE WATER ALL THE WAY OUT: round 3's shimmer is gone (its noise read as tiled cells and
        // its opaque sheet as a pale matte plate with an edge). The far open water keeps the sheet's own sheen
        // and carries A SLOW SPARSE GLITTER by day, coming in softly with the distance from the quay, so no edge
        // is drawn anywhere; none round the islets, none by night)
        // (ROUND 5 MENDING 5, L5: BY PLACE AND CLOCK ONLY: where it lies is the open water outside the bay, or 70 to
        // 190 m and more out from the quay's front, and nothing else; no term asks how steeply the water is seen)
        float shimK = dayK * max(kOut, smoothstep(70., 190., uPlan.x - r)) * smoothstep(35., 70., min(length(p - uIsle.xy), length(p - uIsle.zw)));
        // (sparks of a third of a metre stood as a grain of white specks on the far water, with an edge where they
        // began. They are SOFT GLINTS, in two sizes: 5 m across from 60 to 700 m off and 20 m across beyond 350 m,
        // one cell in five, each swelling and fading on its own slow clock; seen low each is a short level dash
        // of light, and toward the horizon they close up into a sheen)
        vec2 q1 = p / 5., q2 = p / 20. + 0.37; float r1 = h21(floor(q1) + 31.), r2 = h21(floor(q2) + 57.);
        float s1 = (1. - smoothstep(0.12, 0.48, length(fract(q1) - 0.5))) * smoothstep(60., 150., dist) * (1. - smoothstep(350., 700., dist));
        float s2 = (1. - smoothstep(0.12, 0.48, length(fract(q2) - 0.5))) * smoothstep(350., 700., dist);
        float g1 = step(0.8, r1) * pow(0.5 + 0.5 * sin(uTime * (1.2 + 2.2 * r1) + r1 * 40.), 2.) * s1;
        float g2 = step(0.8, r2) * pow(0.5 + 0.5 * sin(uTime * (1.2 + 2.2 * r2) + r2 * 40.), 2.) * s2;
        // THE SUN'S PATH GOES ON TO THE HORIZON (the open water's own life): under the sun's bearing the same
        // glints stand thick (every second cell) and quick (the sparks' clock) from 60 m off to the hills, over a
        // steady warm sheen (see gFar below); on the eye's side the sparks above carry it on
        // (far off the path is broad, 20 degrees to each side of the sun's bearing, full within 6)
        float gAzF = smoothstep(0.94, 0.9945, dot(normalize(-V.xz + 1e-5), normalize(uSunDir.xz + 1e-5)));
        // (L8: the steady warm sheen is twice as strong in the path's core, the 8 degrees to each side of the sun's
        // bearing, and beyond the sun's own double it comes in from 40 to 160 m off, not from 150 to 400: one path
        // from the lens to the hills. Where the sheet is seen at the sun's own height, the place of the sun under
        // the plane, it is as it was: the lower sun stays plain)
        float gFar = max(smoothstep(150., 400., dist), smoothstep(40., 160., dist) * (1. - smoothstep(0.45 * uSunDir.y, 0.85 * uSunDir.y, V.y)));
        float gP = dayK * gAzF * smoothstep(0.003, 0.03, V.y) * ((0.25 + 0.3 * gAz) * gFar
          + step(0.5, r1) * pow(0.5 + 0.5 * sin(uTime * (3. + 5. * r1) + r1 * 70.), 2.) * s1 + step(0.5, r2) * pow(0.5 + 0.5 * sin(uTime * (3. + 5. * r2) + r2 * 70.), 2.) * s2);
        col += uSunGlow * 1.3 * gP; alpha += 0.5 * gP;
        // the open lake's two islets stand in calm water: within 35 to 110 m of each the sheet is
        // clear (their doubles are seen) and carries no glint
        float dI = min(${n.farIsles.map(b=>`length(p - vec2(${b[0].toFixed(1)}, ${b[1].toFixed(1)}))`).join(", ")});
        float gS = shimK * (g1 + g2) * smoothstep(40., 110., dI);
        col += (uSunGlow * 0.7 + 0.16) * gS; alpha += 0.4 * gS;
        alpha *= mix(0.45, 1., smoothstep(35., 110., dI));
        // THE HARBOUR'S WATER IS THE SAME PALE MIRROR AS EVERYWHERE, never a navy pool: seen 20 to 50 degrees
        // down the clear sheet showed the second sky's deep zenith between the houses' doubles. By day, inside
        // the inlet, the sheet turns back the pale low sky (the sky's light lying on the water) by two fifths
        // where the water is seen less than some 50 degrees down (light on water, by that angle), the doubles
        // plain through it; seen straight down into (the well) it is clear as it was
        // (round 5, C1) THE WATER DARKENS SOFTLY TOWARD EVERY QUAY (depth under the wall): within some 12 m of
        // a shore the sheet is up to a quarter darker and a little less clear, by day, fading out evenly
        // (not in the harbour, which is all near a shore: a quarter of it there)
        float shoreK = dayK * exp(-d * 0.16) * (1. - skin) * (1. - 0.75 * hb);
        col *= 1. - 0.26 * shoreK; alpha += 0.14 * shoreK;
        float hbK = hb * dayK * smoothstep(0.2, 0.55, graz);
        col = mix(col, skyLaw(vec3(-V.x, 0.14, -V.z)) * 0.94, 0.55 * hbK); alpha = max(alpha, 0.42 * hbK);
        gl_FragColor = vec4(col, clamp(alpha, 0., 0.93));
      }`}),i=new _.Mesh(new _.PlaneGeometry(7e3,7e3).rotateX(-Math.PI/2),L);return i.renderOrder=2,i.frustumCulled=!1,{mesh:i,mat:L}}const Le=12;function qe(t,n,o){const d=[];n.forEach((b,u)=>{const e=u<3||b.d<60?14:8;for(let a=0;a<e;a++)d.push({p:b.p,ph:(a+b.ph)/e,sd:b.ph,sz:e>8?1.7:1.35})});const h=new _.InstancedBufferGeometry;h.setAttribute("position",new _.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),h.setIndex([0,1,2,0,2,3]);const l=new Float32Array(Math.max(1,d.length)*4),m=new Float32Array(Math.max(1,d.length)*2);d.forEach((b,u)=>{l.set([b.p[0],b.p[1],b.p[2],b.ph],u*4),m.set([b.sd,b.sz],u*2)}),h.setAttribute("iP",new _.InstancedBufferAttribute(l,4)),h.setAttribute("iS",new _.InstancedBufferAttribute(m,2)),h.instanceCount=d.length;const L=b=>new _.ShaderMaterial({transparent:!0,depthWrite:!1,uniforms:{...t,uTone:{value:b>0?new _.Vector3(1,1,1):o}},vertexShader:`attribute vec4 iP; attribute vec2 iS; uniform float uTime; varying vec2 vQ; varying float vK;
      void main() {
        float k = fract(uTime * 0.085 + iP.w);
        // (the guard: the smoke read as PALE CONES, steam jets. A
        // dab grew from 0.35 to 1.85 of its size over the rise: a cone. It is A THREAD now: it grows from 0.3 to
        // 0.85 only, and leans a little down the air as it rises, all one way, each chimney's by its own measure)
        vec3 c = iP.xyz; c.y += k * ${Le}.; c.x += 0.22 * k * sin(k * 5. + iS.x * 40.) + 0.8 * (0.9 + 0.5 * sin(iS.x * 17.)) * k * k; c.z += 0.22 * k * sin(k * 4.1 + iS.x * 23.) + 0.6 * (0.9 + 0.5 * sin(iS.x * 17.)) * k * k;
        vec4 mv = viewMatrix * modelMatrix * vec4(c, 1.);
        mv.xy += position.xy * (0.3 + 0.55 * k) * iS.y;
        vQ = position.xy; vK = k + (iS.y > 1.5 ? 2. : 0.); gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`uniform vec3 uSunCol, uAmbSky, uTone; varying vec2 vQ; varying float vK;
      void main() {
        float d = clamp(1. - dot(vQ, vQ), 0., 1.);
        float body = step(1.5, vK), kk = vK - 2. * body;
        // (mending 2, step 2: THINNER AND GREYER by day: the narrow dabs lie three and four deep, so each is a little
        // over half as dense as it was, and the day's tone is drawn six tenths of the way to its own grey, a fifth deeper)
        // (mending 4: the near chimneys' threads are a third narrower (see the dabs' size above) and half as dense
        // again at their middle: one thin grey thread, above and below)
        float a = d * d * sin(3.14159 * clamp(kk, 0., 1.)) * (0.3 + 0.34 * body);
        // (round 3, A6) BY DAY THE SMOKE IS THIN AND GREY-BLUE, never an opaque white (it read as fountain jets
        // or standing shapes): the sky's fill with a little grey of the sun's strength, at a little over half the
        // night's density; by night (the sun's light bluer than red) its tone is as it was (mending 2: thinner too)
        float day = step(uSunCol.b, uSunCol.r);
        vec3 sc = mix(uAmbSky * 0.8 + uSunCol * 0.3, uAmbSky * 0.72 + vec3(0.062, 0.064, 0.068) * dot(uSunCol, vec3(1.)), day);
        sc = mix(sc, mix(sc, vec3(dot(sc, vec3(0.3333))), 0.6) * 0.8, day);
        gl_FragColor = vec4(sc * uTone, a * mix(1., 0.7, day));
      }`});return{mesh:new _.Mesh(h,void 0),pair:{up:L(1),low:L(-1)},count:d.length}}function Ie(){return{lime:["#f1e3c6","#e6b98a","#d99a8a","#9fb8a8","#f6f1e6"].map(ot),timber:ot("#a8967c"),deck:ot("#8a6a48"),slate:ot("#5f6a72"),quay:ot("#d3c7ab"),pave:ot("#c4bca9"),tile:ot("#a9745c"),parapet:ot("#e2dac6"),wall:ot("#cfc5ae"),rock:ot("#8f8779"),far:ot("#6f8473"),bastion:ot("#e4dccb"),hall:ot("#f6f1e6"),jug:ot("#2f6f7f"),cloth:["#e3dccb","#8c3a2e","#efe6d2","#d6ccb4","#c0913a","#34405f","#6b7046","#e3dccb","#efe6d2","#d6ccb4","#cfc8b8","#e9e0cc"].map(ot),pennant:["#a3977b","#a3977b","#a3977b"].map(ot),boat:["#2f6f7f","#b9482f","#e6d9b8","#6f8f4a"].map(ot),pot:["#b9482f","#c98a5a","#9fb8a8"].map(ot),leaf:["#6f8f4a","#8aa05a","#9aa55c"].map(ot),cypress:["#33583c","#3c6644"].map(ot),shutter:["#6f8f8a","#8a9a74","#96705f","#857f6f","#627886"].map(ot)}}async function ze(t,n){const{P:o,C:d,look:h,S:l}=n,m=n.palette||Ie(),L=()=>t.yield(),i=new _.Group,b=Gt(h),u=[];i.add(b.upper,b.lower);const e=W=>{const Y=W.build?W.build():W;return u.push(Y),b.add(new _.Mesh(Y))},a=(W,Y)=>(u.push(W),b.add(Yt(W,Y))),f=Math.min(1,Math.max(.4,n.detail??1)),c=(W,Y=f)=>Y>=1?W:W.filter(($,X)=>X*.618034%1<Y),x=o.ruled={gone:{},near:{}},k=(W,Y,$,X,Z=0,tt)=>n.keep(Y,$,X,Z,tt)?(x.near[W]=Math.min(x.near[W]??1/0,n.distToLine(Y,$,X)),!0):((x.gone[W]=x.gone[W]||[]).push([Math.round(Y),Math.round($),Math.round(X)]),!1),v=await Vt(o,n.sunDir,t.yield);h.uShade.value=v.texture,h.uShadeRect.value.copy(v.rect),h.uNight.value=n.night,await L(),e(Jt(o,m,n.distToLine,l.flank)),await L();const s=Pt(o,l.houses,m,n.distToLine,k);s.push(oe(o,n.hall,m,n.distToLine));const r=jt(o,s);h.uOcc.value=r.texture,h.uOccRect.value.copy(r.rect),await L();const w=await ne(o,s,m,L,k);await L(),e(w.g),await L();const M=await Nt(o,s,{rooms:l.rooms,cloth:l.cloth,lamps:l.lamps},m,{density:n.density,night:n.night,distToLine:n.distToLine,rest:L}),y=l.crest,S=await Nt(o,s,{rooms:y,cloth:y,lamps:y},m,{density:n.density,night:n.night,distToLine:n.distToLine,own:!0});for(const W of["rooms","roomsF","roomsL","roomsR","rails","curtN","curtF","lamps","posts","toprail"])M[W].push(...S[W]);S.sets.forEach((W,Y)=>M.sets[Y].push(...W)),M.stats.lit+=S.stats.lit,M.stats.cloth+=S.stats.cloth,await L();const A=he(o,m);e(A.g),await L();const R=le(o,m);e(R.g),e(d.g),await L();const D=Me(o,m,n.hall);e(D.g);const T=Oe(l.shore,m,o,d,n.distToLine,l.road);e(T.g);const V=be(o,d,m,n.aStair),z=V.g.build(),I=new _.Mesh(z,b.joinMat);u.push(z),I.frustumCulled=!1,i.add(I);const K=we(o,d,l.boats,m,n.density,k,V.stairs.concat([o.isle,o.isle2].filter(Boolean).map(W=>({x:W[0],z:W[1],r:15}))),n.distToLine,l.road);Te(T.rocks,o,m,l.flank,k,K);const C=T.rocks.build();u.push(C),b.add(new _.Mesh(C),b.lakePair);const B=ve(o,d,m,K,l.boats,n.density,k);e(B.g),await L();const q=se(),j=ie(m);a(q.room,M.rooms),await L(),a(q.roomF,M.roomsF),await L();for(const[W,Y]of[[q.roomL,M.roomsL],[q.roomR,M.roomsR]])Y.length?a(W,Y):u.push(W);a(q.rail,M.rails),await L(),a(q.toprail,M.toprail);const O=[];if(n.rare)for(let W=0;W<=n.hall.arches;W++){const Y=n.hall.a-n.hall.half+2*n.hall.half*W/n.hall.arches,$=o.pos(D.r0-.25,Y);O.push({m:new _.Matrix4().makeTranslation($[0],D.y0+9.2,$[1]).multiply(rt.makeRotationY(-Y)).multiply(nt.makeScale(1.1,6.4,1)),a:[l.rare(),0,l.rare(),W%2],c:m.pennant[W%3]})}const p=new _.Matrix4().makeRotationZ(Math.PI/2);let g=0;const E=J(m.pennant[0],n.night>.5?.3:1),N=[o.isle,o.isle2].filter(Boolean);if(s.filter(W=>!W.own&&(W.verandasOnly||W.kind==="tower"&&N.some(Y=>Math.hypot(W.x-Y[0],W.z-Y[1])<12)&&g++%2===0)).forEach(W=>{const Y=W.kind==="tower"?W.depth:W.depth/2,$=W.y0+W.floors*o.FLOOR+(W.kind==="tower"?3.4:1.2),X=W.x-Math.sin(W.yaw)*Y,Z=W.z-Math.cos(W.yaw)*Y,tt=l.pennant.range(-.5,1.7),P=[l.pennant(),1,l.pennant(),0],et=()=>new _.Matrix4().makeTranslation(X,$+6.1,Z).multiply(rt.makeRotationY(tt));M.posts.push({m:new _.Matrix4().makeTranslation(X,$,Z).multiply(nt.makeScale(.8,6.3,.8)),a:[0,0,0,0],c:m.timber}),M.posts.push({m:et().multiply(p).multiply(nt.makeScale(.6,1.25,.6)),a:[0,0,0,0],c:m.timber}),O.push({m:et().multiply(wt.makeTranslation(-.68,-.06,0)).multiply(nt.makeScale(.75,4.2,1)),a:P,c:E})}),o.nearRock&&o.nearRock.mast){const[W,Y,$]=o.nearRock.mast,X=l.road.range(-.5,1.7),Z=()=>new _.Matrix4().makeTranslation(W,Y-.2,$).multiply(rt.makeRotationY(X));M.posts.push({m:Z().multiply(p).multiply(nt.makeScale(.6,1.25,.6)),a:[0,0,0,0],c:J(m.timber,n.night>.5?.15:1)}),O.push({m:Z().multiply(wt.makeTranslation(-.68,-.06,0)).multiply(nt.makeScale(.75,4.2,1)),a:[l.road(),1,l.road(),0],c:J(E,n.night>.5?.4:1)})}a(q.clothN,M.curtN.concat(B.cloth,O)),await L(),a(q.clothF,c(M.curtF,.4+.6*f)),await L();const F=ke(o,l.trees,m,n.density,n.hall,s.gardens,k),Q=.3+.7*f,G=W=>Q>=1||W*.618034%1<Q;o.belvTree=(o.belv||[]).map(W=>F.some((Y,$)=>Y.bay===W&&G($)));const U=ye(o,m,l.lamps,n.night,n.sunDir,k);e(U.g),a(q.lamp,M.lamps.concat(U.lamps)),a(q.post,M.posts),await L();for(let W=0;W<7;W++)M.sets[W].length?a(j[W],c(M.sets[W])):u.push(j[W]);return await L(),a(ce(m),K.boats),a(de(),c(K.floats)),a(ue(),c(K.leaves)),a(ge(),c(F.concat(U.trees),Q)),await L(),He(t,n,{root:i,dbl:b,owned:u,shade:v,houses:s,shells:w,L:M,lay:K,furn:B,hall:D,joins:V,bast:R,quay:A,pal:m})}function He(t,n,o){const{root:d,dbl:h,owned:l}=o,{look:m,P:L}=n,i=k=>{for(let v=0;v<=6;v++)if(n.distToLine(k.p[0],k.p[1]+v*2,k.p[2])<6.5)return!1;return!0},b=o.shells.chimneys.filter(i).sort((k,v)=>k.d-v.d).slice(0,Math.max(4,Math.round(14*n.density*Math.min(1,n.detail??1)))),u=qe(m,b,h.tone);u.mesh.renderOrder=3,h.add(u.mesh,u.pair),u.mesh.userData.twin.renderOrder=1,l.push(u.mesh.geometry);const e=Se(m,h.tone);d.add(e.mesh);const a=Ne(m,L,o.lay.rings.map((k,v)=>({x:k.x,z:k.z,ph:o.lay.boats[v].a[0]})),n.C);d.add(a.mesh),l.push(e.mesh.geometry,a.mesh.geometry);const f=[...h.mats.up,...h.mats.low,h.joinMat,h.lakePair.up,h.lakePair.low,u.pair.up,u.pair.low,e.mat,a.mat],c=new _.Vector3;let x=0;return x=o.joins.g.triangles,{object:d,radius:460,height:150,center:new _.Vector3(0,40,-270),P:L,dbl:h,dome:e,water:a,houses:o.houses,lay:o.lay,furn:o.furn,joins:o.joins,hall:o.hall,bast:o.bast,chimneys:b,stats:{triangles:h.triangles+x+2+1200,calls:h.calls+3,lit:o.L.stats.lit,cloth:o.L.stats.cloth+o.furn.cloth.length,boats:o.lay.boats.length,rooms:o.L.rooms.length+o.L.roomsF.length,houses:o.houses.length},anchors:{},update(k,v,s){m.uTime.value=v,s.getWorldPosition(c),e.mesh.position.set(c.x*m.uHand.value,c.y,c.z)},dispose(){for(const k of l)k.dispose();for(const k of f)k.dispose();o.shade.texture.dispose(),m.uOcc.value&&m.uOcc.value.dispose()},ground:!1}}export{pt as BREATH_SPAN,Dt as CRAG_GREAT,Ft as CRAG_HOUSE,Ce as CRAG_LOW,xe as CRAG_N,$t as FLANK_NEAR,zt as FOOT_H,Re as FOOT_N,Ct as FOOT_OUT,St as GLSL_BREATH,kt as GLSL_SKY,H as KIND,mt as LOWER_TONE,Ot as MAX_BOATS,pe as MOOR_STAG,At as ROAD_N,yt as ROAD_OFF,gt as ROAD_SPAN,Ht as ROCK_BIG,Tt as ROCK_OFF,Bt as ROCK_TONE,Ut as SHADE_RECT,Le as SMOKE_RISE,lt as archPanel,ce as boatGeo,Kt as buildCrag,ze as buildHero,oe as crestHouse,xt as crestLot,Ee as dealCrags,de as floatGeo,ae as houseMatrix,we as layBoats,Pt as layHouses,Nt as layRooms,ke as layTrees,ue as leafGeo,ot as lin,le as makeBastion,Ke as makeCauseway,Se as makeDome,Gt as makeDoubler,Oe as makeFarShore,Xt as makeFlankWalls,Te as makeFooting,ve as makeFurniture,at as makeGeo,Me as makeHall,Yt as makeInstanced,be as makeJoins,De as makeLook,jt as makeOccMap,Ie as makePalette,Fe as makePlan,he as makeQuay,Vt as makeShadeMap,ne as makeShells,qe as makeSmoke,ye as makeStreetThings,Jt as makeTerrain,Ne as makeWater,ht as mixc,J as mulc,Ae as rockTone,ie as roomSets,dt as stoneAt,ge as treeGeo,se as unitGeos,_t as wedgeAngles};
