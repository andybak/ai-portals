import*as r from"three";const U=Math.PI*2,Ae=(e,s,t)=>Math.min(t,Math.max(s,e)),fe=(e,s,t)=>e+(s-e)*t,be=(e,s,t)=>{const o=Ae((t-e)/(s-e),0,1);return o*o*(3-2*o)},ue=(e,s=1)=>{const t=new r.Color(e);return[t.r*s,t.g*s,t.b*s]},_={PLAIN:0,STONE:1,FLOOR:2,TAPESTRY:3,VELVET:4,GLASS:5,VAULT:6,CARPET:7,WOOD:8,FIRE:9,GOLD:10,DIAL:11,FIRELIT:12};function J(e=8192){let s=e,t=0,o=new Float32Array(s*3),A=new Float32Array(s*3),w=new Float32Array(s*3),f=new Float32Array(s*4);const u=[1,1,1],i=[0,.2,0,0];let c=null,h=null;const d=new r.Vector3,g=a=>h?(d.set(a[0],a[1],a[2]).applyMatrix4(h),[d.x,d.y,d.z]):a,y=a=>{if(t+a<=s)return;for(;t+a>s;)s*=2;const l=(p,C)=>{const H=new Float32Array(s*C);return H.set(p.subarray(0,t*C)),H};o=l(o,3),A=l(A,3),w=l(w,3),f=l(f,4)},D=[0,0,0],T=(a,l,p,C,H,P)=>{const x=t*3,F=t*4;o[x]=a,o[x+1]=l,o[x+2]=p,A[x]=C,A[x+1]=H,A[x+2]=P,c?(c(a,l,p,D),w[x]=D[0],w[x+1]=D[1],w[x+2]=D[2]):(w[x]=u[0],w[x+1]=u[1],w[x+2]=u[2]),f[F]=i[0],f[F+1]=i[1],f[F+2]=i[2],f[F+3]=i[3],t++},M=new r.Vector3,b=new r.Vector3,N=new r.Matrix3,B=new r.Matrix4,R=new r.Quaternion,W=new r.Euler,n=new r.Vector3,v=new r.Vector3,m={col(a,l=1){return u[0]=a[0]*l,u[1]=a[1]*l,u[2]=a[2]*l,m},surf(a,l=.2,p=0,C=0){return i[0]=a,i[1]=l,i[2]=p,i[3]=C,m},shade(a){return c=a,m},tr(a){return h=a?a.clone():null,m},tri(a,l,p){y(3),a=g(a),l=g(l),p=g(p);const C=l[0]-a[0],H=l[1]-a[1],P=l[2]-a[2],x=p[0]-a[0],F=p[1]-a[1],I=p[2]-a[2];let E=H*I-P*F,G=P*x-C*I,k=C*F-H*x;const L=Math.hypot(E,G,k)||1;return E/=L,G/=L,k/=L,T(a[0],a[1],a[2],E,G,k),T(l[0],l[1],l[2],E,G,k),T(p[0],p[1],p[2],E,G,k),m},quad(a,l,p,C){const H=h;return a=g(a),l=g(l),p=g(p),C=g(C),h=null,m.tri(a,l,p),m.tri(a,p,C),h=H,m},grid(a,l,p,C=!1,H=null){const P=a+1,x=new Float32Array(P*(l+1)*3),F=new Float32Array(P*(l+1)*3),I=[0,0,0];for(let k=0;k<=l;k++)for(let L=0;L<=a;L++){p(L/a,k/l,I);const V=(k*P+L)*3;h?(d.set(I[0],I[1],I[2]).applyMatrix4(h),x[V]=d.x,x[V+1]=d.y,x[V+2]=d.z):(x[V]=I[0],x[V+1]=I[1],x[V+2]=I[2])}for(let k=0;k<=l;k++)for(let L=0;L<=a;L++){const V=(k*P+L)*3,te=Math.max(L-1,0),ve=Math.min(L+1,a),z=Math.max(k-1,0),S=Math.min(k+1,l),j=(k*P+te)*3,q=(k*P+ve)*3,Y=(z*P+L)*3,Z=(S*P+L)*3,se=x[q]-x[j],pe=x[q+1]-x[j+1],we=x[q+2]-x[j+2],ge=x[Z]-x[Y],xe=x[Z+1]-x[Y+1],ye=x[Z+2]-x[Y+2];let $=pe*ye-we*xe,K=we*ge-se*ye,X=se*xe-pe*ge;const ne=Math.hypot($,K,X);ne<1e-9?($=0,K=1,X=0):($/=ne,K/=ne,X/=ne),C&&($=-$,K=-K,X=-X),F[V]=$,F[V+1]=K,F[V+2]=X}y(a*l*6);const E=i[3],G=(k,L)=>{const V=(L*P+k)*3;H&&(i[3]=H(k/a,L/l)),T(x[V],x[V+1],x[V+2],F[V],F[V+1],F[V+2])};for(let k=0;k<l;k++)for(let L=0;L<a;L++)C?(G(L,k),G(L,k+1),G(L+1,k+1),G(L,k),G(L+1,k+1),G(L+1,k)):(G(L,k),G(L+1,k),G(L+1,k+1),G(L,k),G(L+1,k+1),G(L,k+1));return i[3]=E,m},geo(a,l={}){const p=a.index?a.toNonIndexed():a;if(l.m)B.copy(l.m);else{const x=l.p||[0,0,0],F=l.r||[0,0,0],I=l.s===void 0?[1,1,1]:typeof l.s=="number"?[l.s,l.s,l.s]:l.s;B.compose(v.set(x[0],x[1],x[2]),R.setFromEuler(W.set(F[0],F[1],F[2],l.order||"XYZ")),n.set(I[0],I[1],I[2]))}h&&B.premultiply(h),N.getNormalMatrix(B);const C=p.attributes.position,H=p.attributes.normal,P=i[3];y(C.count);for(let x=0;x<C.count;x++){M.fromBufferAttribute(C,x),l.sway&&(i[3]=l.sway(M.x,M.y,M.z)),l.warp&&l.warp(M),M.applyMatrix4(B),H?b.fromBufferAttribute(H,x).applyMatrix3(N):b.set(0,1,0);const F=b.length();F>1e-9?b.multiplyScalar(1/F):b.set(0,1,0),T(M.x,M.y,M.z,b.x,b.y,b.z)}return i[3]=P,p!==a&&p.dispose(),a.dispose(),m},box(a,l,p,C,H,P,x){return m.geo(new r.BoxGeometry(C,H,P),{p:[a,l,p],r:x})},rod(a,l,p,C=p,H=6){const P=l[0]-a[0],x=l[1]-a[1],F=l[2]-a[2],I=Math.hypot(P,x,F)||1e-6,E=new r.CylinderGeometry(C,p,I,H,1,!0);return R.setFromUnitVectors(M.set(0,1,0),b.set(P/I,x/I,F/I)),B.compose(v.set((a[0]+l[0])/2,(a[1]+l[1])/2,(a[2]+l[2])/2),R,n.set(1,1,1)),m.geo(E,{m:B.clone()})},tube(a,l,p=5,C=!1){const H=new r.CatmullRomCurve3(a.map(P=>new r.Vector3(P[0],P[1],P[2])),C,"centripetal");return m.geo(new r.TubeGeometry(H,Math.max(2,(a.length-1)*2),l,p,C))},get count(){return t},get triangles(){return t/3},build(){const a=new r.BufferGeometry;return a.setAttribute("position",new r.BufferAttribute(o.slice(0,t*3),3)),a.setAttribute("normal",new r.BufferAttribute(A.slice(0,t*3),3)),a.setAttribute("aCol",new r.BufferAttribute(w.slice(0,t*3),3)),a.setAttribute("aSurf",new r.BufferAttribute(f.slice(0,t*4),4)),a}};return m}const me=`
uniform float uTime;
uniform vec3 uRoomCol;      // colour of the light the glass lets through
uniform vec3 uGlassCol;     // colour of the glass itself, seen against the fire
uniform vec4 uRoomDim;      // half width, length, wall height, crown height
uniform vec4 uWin;          // z of the window centre, sill height, half width, apex height
uniform vec4 uSrc;          // fire: metres behind the wall, height; glass style; beam gain
uniform float uSrcZ;        // how far up the room from the window the fire stands (slants the beams down the room)
uniform vec4 uFlick;        // level of the brazier on -x, on +x, of the neighbour behind door A, behind door B
uniform vec3 uDoorA;        // colour of the light of the neighbour behind the door at z = 0
uniform vec3 uDoorB;        // ... behind the door at z = -L
uniform vec4 uDoorPos;      // x of door A, x of door B, door half width, door apex height
uniform vec4 uAmb;          // bounce gain, soft window gain, haze density, haze gain
uniform vec4 uRing;         // the strike: centre x, centre z, radius, strength
uniform vec3 uRingCol;
uniform vec4 uLook;         // floor style, wall style, vault style, velvet room (0 | 1)
uniform vec4 uNicheA;       // a brazier seen through the open tracery of the passage we came in by: x, y, z, strength
uniform vec4 uNicheB;       // ... of the passage we leave by
uniform vec4 uPhase;        // seeded phases of this room's fires: brazier on -x, on +x, the corridor fire, spare
const vec3 RFIRE = vec3(1.0, 0.36, 0.07);

float rHash(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float rNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(rHash(i), rHash(i + vec2(1., 0.)), f.x), mix(rHash(i + vec2(0., 1.)), rHash(i + vec2(1., 1.)), f.x), f.y); }

// The lancet: q.x across from its centre line, q.y above the sill; hw half width, H apex above the sill.
// Returns (light let through, with the tone of each quarry; 1 on glass and 0 on stone or lead; 1 inside the opening).
vec3 lancetGlass(vec2 q, float hw, float H, float style, float blur){
  float e = 0.05 + blur;
  float ys = H - 1.732 * hw;
  float ax = abs(q.x);
  float dArc = 2. * hw - length(vec2(ax + hw, max(q.y - ys, 0.)));
  float dOut = min(min(hw - ax, dArc), q.y);
  float shape = smoothstep(0., e, dOut);
  float bar = 0.06 * hw + 0.05;
  float border = smoothstep(bar, bar + e, dOut);
  float shw = 0.5 * hw, sx = abs(ax - shw), ysub = ys - 0.15 * hw;
  float dSub = 2. * shw - length(vec2(sx + shw, max(q.y - ysub, 0.)));
  float lights = smoothstep(bar * .5, bar * .5 + e, min(shw - sx, dSub));
  vec2 oc = q - vec2(0., ys + 0.75 * hw);
  float rl = 0.215 * hw, dOc = -1e3;
  dOc = max(dOc, rl - length(oc - vec2(rl, 0.) * 0.95));
  dOc = max(dOc, rl - length(oc + vec2(rl, 0.) * 0.95));
  dOc = max(dOc, rl - length(oc - vec2(0., rl) * 0.95));
  dOc = max(dOc, rl - length(oc + vec2(0., rl) * 0.95));
  float oculus = smoothstep(0.03, 0.03 + e, dOc);
  float glass = border * max(lights, oculus);
  // leaded quarries: diamonds, squares or roundels by style, each pane its own depth of the one colour
  float sc = 0.5 + 0.18 * fract(style * 0.37);
  vec2 d = fract(style * 0.5) < 0.5 ? vec2(q.x + q.y * 0.62, q.x - q.y * 0.62) : q;
  vec2 cell = floor(d / sc), f = fract(d / sc) - 0.5;
  float h = rHash(cell + style * 17.);
  float lw = 0.035;
  float lead = smoothstep(0.5 - lw - 0.6 * e / sc, 0.5 - lw, max(abs(f.x), abs(f.y)));
  float tone = 0.62 + 0.85 * h * h;
  float rnd = smoothstep(0.36, 0.3, length(f)) * step(1.5, style);
  tone *= mix(1., 1.45, rnd);
  float edgeBand = smoothstep(bar * 2.6, bar * 1.2, min(shw - sx, dSub)) * lights;    // a paler border round each light
  tone = mix(tone, 1.5, edgeBand * 0.7);
  float soft = clamp(blur * 1.6, 0., 1.);
  tone = mix(tone, 0.95, soft);
  return vec3(glass * tone * (1. - lead * (1. - soft)), glass, shape);
}

// what the brazier of side s (-1 | +1) throws on the point p: (light through the tracery, 1 / distance falloff)
vec2 roomBeam(vec3 p, float s){
  vec3 S = vec3(s * (uRoomDim.x + uSrc.x), uSrc.y, uWin.x + uSrcZ);
  vec3 d = p - S;
  float m = max(-s * d.x, 0.5);
  float t = min(uSrc.x / m, 1.);
  vec3 Hh = S + d * t;
  float dist = max(length(d), 1.);
  float blur = 0.03 + dist * (1. - t) * 0.012;
  vec3 g = lancetGlass(vec2(Hh.z - uWin.x, Hh.y - uWin.y), uWin.z, uWin.w - uWin.y, uSrc.z, blur);
  return vec2(g.x, clamp(22. / dist, 0., 1.3));
}

// the door of the end wall at z = zw, seen along the ray p + r * t: how much of its glow the ray meets
float roomDoor(vec3 p, vec3 r, float zw, float dx, float blur){
  float sgn = zw < -1. ? -1. : 1.;
  float rz = r.z * sgn;
  if (rz < 0.02) return 0.;
  float t = (zw - p.z) * sgn / rz;
  vec3 h = p + r * t;
  float hw = uDoorPos.z, ys = uDoorPos.w - 1.456 * hw, ax = abs(h.x - dx);
  float dArc = 1.56 * hw - length(vec2(ax + 0.56 * hw, max(h.y - ys, 0.)));
  float d = min(min(hw - ax, dArc), h.y + 0.5);
  return smoothstep(0., 0.3 + blur, d);
}

// the two windows as a polished surface sees them: r is the mirror direction at p
vec3 roomMirror(vec3 p, vec3 r, float rough){
  vec3 acc = vec3(0.);
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1. : 1.;
    float rx = r.x * s;
    if (rx > 0.02) {
      float t = (s * uRoomDim.x - p.x) * s / rx;
      vec3 h = p + r * t;
      vec3 g = lancetGlass(vec2(h.z - uWin.x, h.y - uWin.y), uWin.z, uWin.w - uWin.y, uSrc.z, 0.05 + rough * (0.4 + 0.05 * t));
      vec2 df = (vec2(h.z - uWin.x, h.y) - vec2(0., uSrc.y * 0.5)) / vec2(3.4, 6.5);
      float fire = exp(-dot(df, df));
      acc += uGlassCol * g.x * (1.3 + 3.2 * fire) * (s < 0. ? uFlick.x : uFlick.y);
    }
  }
  acc += uDoorA * uFlick.z * 0.55 * roomDoor(p, r, 0., uDoorPos.x, rough * 2.);
  acc += uDoorB * uFlick.w * 0.55 * roomDoor(p, r, -uRoomDim.y, uDoorPos.y, rough * 2.);
  return acc;
}

// All the light on a point of the room. n: unit normal, v: unit vector to the eye. Returns the diffuse light; spec gets
// the mirror light for a surface of this gloss (0 matt .. 1 mirror).
vec3 roomLight(vec3 p, vec3 n, vec3 v, float gloss, out vec3 spec, out vec3 beamLight){
  vec3 L = vec3(0.); beamLight = vec3(0.);
  for (int i = 0; i < 2; i++) {
    float s = i == 0 ? -1. : 1.;
    float fl = s < 0. ? uFlick.x : uFlick.y;
    vec2 b = roomBeam(p, s);
    vec3 S = vec3(s * (uRoomDim.x + uSrc.x), uSrc.y, uWin.x + uSrcZ);
    vec3 ld = normalize(S - p);
    float nl = max(dot(n, ld), 0.);
    vec3 direct = uRoomCol * (uSrc.w * b.x * b.y * fl);
    beamLight += direct;
    L += direct * nl;
    // the glass as a soft lamp
    vec3 wc = vec3(s * uRoomDim.x, mix(uWin.y, uWin.w, 0.45), uWin.x) - p;
    float wd = max(length(wc), 0.5); vec3 wl = wc / wd;
    float wrap = max(dot(n, wl) * 0.7 + 0.3, 0.);
    float cw = max(s * wl.x, 0.) * 0.8 + 0.2;
    L += uRoomCol * (uAmb.y * fl * wrap * cw * 150. / (150. + wd * wd));
  }
  // what comes through the two doors from the neighbours
  vec3 da = vec3(uDoorPos.x, 5., 1.) - p; float dal = max(length(da), 0.5);
  L += uDoorA * (uFlick.z * max(dot(n, da / dal) * 0.6 + 0.4, 0.) * max(da.z / dal, 0.) * 70. / (70. + dal * dal));
  vec3 db = vec3(uDoorPos.y, 5., -uRoomDim.y - 1.) - p; float dbl = max(length(db), 0.5);
  L += uDoorB * (uFlick.w * max(dot(n, db / dbl) * 0.6 + 0.4, 0.) * max(-db.z / dbl, 0.) * 70. / (70. + dbl * dbl));
  // the room's own colour come back from floor and walls
  float fa = 0.5 * (uFlick.x + uFlick.y);
  float low = 1. - 0.62 * smoothstep(0., uRoomDim.z * 1.25, p.y);                // the bounce is strongest near the lit floor
  float edge = min(uRoomDim.x - abs(p.x), min(-p.z, p.z + uRoomDim.y));
  float corner = 0.5 + 0.5 * smoothstep(-0.5, 3.2, edge + p.y * 0.8);               // dusk where floor and walls meet
  L += uRoomCol * (uAmb.x * fa * (0.62 + 0.38 * n.y) * low);
  L *= mix(corner, 1., 0.8 * uLook.w);
  // the bare fire of the braziers in the corridor, where a passage looks out on it
  vec3 na = uNicheA.xyz - p; float nal = max(length(na), 0.5);
  L += RFIRE * (uNicheA.w * uFlick.z * (max(dot(n, na / nal), 0.) * 0.75 + 0.25) * 30. / (30. + nal * nal));
  vec3 nb = uNicheB.xyz - p; float nbl = max(length(nb), 0.5);
  L += RFIRE * (uNicheB.w * uFlick.w * (max(dot(n, nb / nbl), 0.) * 0.75 + 0.25) * 30. / (30. + nbl * nbl));
  // the strike: a ring of light that runs out across the floor from the clock
  float rd = length(p.xz - uRing.xy);
  float band = (rd - uRing.z) / 3.2;
  L += uRingCol * (uRing.w * exp(-band * band) * exp(-max(p.y, 0.) * 0.09) * 46. / (46. + uRing.z));
  // the windows mirrored
  vec3 r = reflect(-v, n);
  float fres = 0.04 + 0.96 * pow(clamp(1. - dot(n, v), 0., 1.), 5.);
  spec = roomMirror(p, r, 1. - gloss) * mix(fres, 1., gloss * 0.35) * gloss;
  return L;
}

// the coloured air between the eye and the point
vec3 roomHaze(vec3 col, float dist){
  float k = 1. - exp(-dist * uAmb.z);
  float fa = 0.5 * (uFlick.x + uFlick.y);
  return mix(col, uRoomCol * (uAmb.w * fa), k);
}
`,Ce=ue("#ff9a3c");function ke(e,s={}){const t=s.color||ue("#b00f1e"),o=s.glass||t;return{uTime:e.uTime,uRoomCol:{value:new r.Vector3(t[0],t[1],t[2])},uGlassCol:{value:new r.Vector3(o[0],o[1],o[2])},uRoomDim:{value:new r.Vector4(s.hw??13,s.L??36,s.wallH??13,s.crown??22)},uWin:{value:new r.Vector4(s.winZ??-(s.L??36)/2,s.sill??3,s.winHw??2.8,s.winTop??17)},uSrc:{value:new r.Vector4(s.srcBack??9,s.srcY??20,s.glassStyle??0,s.beam??3)},uSrcZ:{value:s.srcZ??0},uFlick:{value:new r.Vector4(1,1,1,1)},uDoorA:{value:new r.Vector3(0,0,0)},uDoorB:{value:new r.Vector3(0,0,0)},uDoorPos:{value:new r.Vector4(s.doorAx??0,s.doorBx??0,s.doorHw??4.7,s.doorTop??12.5)},uAmb:{value:new r.Vector4(s.bounce??.2,s.soft??1,s.haze??.004,s.hazeGain??.5)},uRing:{value:new r.Vector4(0,0,0,0)},uRingCol:{value:new r.Vector3(1.6,.16,.12)},uLook:{value:new r.Vector4(s.floorStyle??0,s.wallStyle??0,s.vaultStyle??0,s.velvet??0)},uNicheA:{value:new r.Vector4(0,0,0,0)},uNicheB:{value:new r.Vector4(0,0,0,0)},uPhase:{value:new r.Vector4(s.phase?s.phase[0]:0,s.phase?s.phase[1]:0,s.phase?s.phase[2]:0,0)}}}const ze=`
attribute vec3 aCol; attribute vec4 aSurf;
uniform float uTime; uniform mat4 uRoomInv;
varying vec3 vP, vP0, vN, vN0, vCol, vV; varying vec4 vSurf; varying float vDist;
void main(){
  vec3 p = position; vP0 = p; vN0 = normal;
  float sw = aSurf.w;
  if (sw > 0.) {
    float ph = p.x * 0.31 + p.z * 0.27;
    p += normal * sw * (0.6 * sin(uTime * 0.9 + ph + p.y * 0.35) + 0.4 * sin(uTime * 1.7 + ph * 2.3 - p.y * 0.5));
  }
  vec4 wp = modelMatrix * vec4(p, 1.);
  mat3 ri = mat3(uRoomInv);
  vP = (uRoomInv * wp).xyz;
  vN = ri * (mat3(modelMatrix) * normal);
  vV = ri * (cameraPosition - wp.xyz);
  vCol = aCol; vSurf = aSurf;
  vec4 mv = viewMatrix * wp; vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,Le=`
varying vec3 vP, vP0, vN, vN0, vCol, vV; varying vec4 vSurf; varying float vDist;
uniform vec4 uDial;        // dial centre x, y (mesh space), radius, hand glow
const vec3 FIRECOL = vec3(1.0, 0.33, 0.045);
${me}
float carve(vec2 f){ return sin(f.x * 3. + 1.6 * sin(f.y * 2.1)) * sin(f.y * 3. + 1.6 * sin(f.x * 1.9)); }
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV);
  float kind = floor(vSurf.x + 0.5), gloss = vSurf.y, gold = vSurf.z;
  vec3 alb = vCol, emis = vec3(0.);
  vec3 p = vP, p0 = vP0, a0 = abs(vN0);
  vec2 uv; vec3 T, B;
  if (a0.y > 0.7) { uv = p0.xz; T = vec3(1., 0., 0.); B = vec3(0., 0., 1.); }
  else if (a0.x > a0.z) { uv = p0.zy; T = vec3(0., 0., 1.); B = vec3(0., 1., 0.); }
  else { uv = p0.xy; T = vec3(1., 0., 0.); B = vec3(0., 1., 0.); }
  float sheen = 0.;
  float fa = 0.5 * (uFlick.x + uFlick.y);
  if (kind == 1.) {                                   // dressed stone
    vec2 b = uv / vec2(2.4, 1.2); b.x += 0.5 * floor(b.y); vec2 fb = fract(b);
    float joint = smoothstep(0., .035, fb.x) * smoothstep(1., .965, fb.x) * smoothstep(0., .07, fb.y) * smoothstep(1., .93, fb.y);
    alb *= (0.86 + 0.2 * rHash(floor(b))) * mix(0.72, 1., joint) * (0.88 + 0.24 * rNoise(uv * 2.3));
  } else if (kind == 2.) {                            // polished floor: chequer, lozenge or star inlay
    float st = uLook.x;
    vec2 f = uv / 2.6;
    if (st > 0.5 && st < 1.5) f = vec2(f.x + f.y, f.x - f.y) * 0.7071;
    vec2 c = floor(f), ff = fract(f) - 0.5;
    float chk = mod(c.x + c.y, 2.);
    float inlay = st > 1.5 ? smoothstep(0.34, 0.31, abs(ff.x) + abs(ff.y)) : 0.;
    float seam = smoothstep(0.5, 0.485, max(abs(ff.x), abs(ff.y)));
    float veins = rNoise(uv * 1.1 + c * 7.3) * 0.6 + rNoise(uv * 4.3) * 0.4;
    alb *= mix(0.2, 1., mix(chk, 1. - chk, inlay)) * (0.75 + 0.4 * veins) * mix(0.5, 1., seam);
    float star = st > 2.5 ? smoothstep(0.1, 0.08, length(ff)) : 0.;
    gold = max(gold, star);
    alb = mix(alb, vec3(1., 0.62, 0.2), star);
  } else if (kind == 3.) {                            // tapestry: a diaper in gold thread, the pattern of this room
    float ws = uLook.y, motif = 0., shade = 1.;
    if (ws < 0.5) {                                   // lozenges
      vec2 f = uv / 1.25; vec2 ff = fract(f) - .5; vec2 c = floor(f);
      float lz = abs(ff.x) + abs(ff.y);
      motif = smoothstep(0.44, 0.41, lz) * smoothstep(0.26, 0.29, lz) + smoothstep(0.13, 0.1, length(ff));
      shade = mix(1., 0.5, smoothstep(0.26, 0.2, lz) * mod(c.x + c.y, 2.));
    } else if (ws < 1.5) {                            // roundels, each with a quatrefoil
      vec2 f = uv / 1.5; f.x += 0.5 * floor(f.y); vec2 ff = fract(f) - .5;
      float r = length(ff); vec2 q = abs(ff); if (q.y > q.x) q = q.yx;
      motif = smoothstep(0.05, 0.03, abs(r - 0.38)) + smoothstep(0.075, 0.055, length(q - vec2(0.17, 0.))) + smoothstep(0.05, 0.035, r);
      shade = mix(1., 0.55, smoothstep(0.36, 0.33, r));
    } else if (ws < 2.5) {                            // an ogee net with a sprig in every mesh
      vec2 f = uv / vec2(1.5, 2.4);
      float w = 0.24 * sin(f.y * 6.2832);
      float l1 = abs(fract(f.x + w) - 0.5), l2 = abs(fract(f.x - w) - 0.5);
      vec2 g = vec2(fract(f.x * 2. + 0.5) - 0.5, fract(f.y * 2.) - 0.5) * vec2(0.75, 1.2);
      float lz = abs(g.x) * 1.5 + abs(g.y);
      motif = smoothstep(0.06, 0.035, min(l1, l2)) + smoothstep(0.3, 0.27, lz) * smoothstep(0.17, 0.2, lz) + smoothstep(0.09, 0.07, length(g));
      shade = mix(1., 0.6, smoothstep(0.17, 0.14, lz));
    } else {                                          // chevron bands
      vec2 f = uv / vec2(1.3, 1.7);
      float zz = abs(fract(f.x) - 0.5);
      float fy = f.y + zz * 0.9, band = abs(fract(fy) - 0.5);
      vec2 g = vec2(fract(f.x + 0.5) - 0.5, fract(fy + 0.5) - 0.5);
      motif = smoothstep(0.1, 0.07, band) * smoothstep(0.02, 0.04, band) + smoothstep(0.1, 0.08, length(g * vec2(1., 1.3)));
      shade = mix(0.6, 1., step(0.5, fract(fy * 0.5)));
    }
    motif = clamp(motif, 0., 1.);
    float weave = 0.82 + 0.18 * sin(uv.x * 46.) * sin(uv.y * 46.);
    alb *= weave * (0.7 + 0.3 * rNoise(uv * 0.7 + 3.)) * shade;
    gold = max(gold, motif * 0.85);
    alb = mix(alb, vec3(1., 0.62, 0.2), motif * 0.85);
    sheen = 0.15;
  } else if (kind == 4.) {                            // velvet in heavy folds
    float along = a0.y > 0.7 ? p0.x : uv.x;
    float ph = along * 2.1 + 1.1 * sin(along * 0.63 + 1.7) + 0.5 * sin(uv.y * 0.21 + along * 0.3);
    float fold = cos(ph);
    vec3 tn = a0.y > 0.7 ? vec3(1., 0., 0.) : normalize(cross(vec3(0., 1., 0.), n) + vec3(1e-4, 0., 0.));
    n = normalize(n + tn * fold * 0.85);
    alb *= mix(0.5 + 0.5 * sin(ph), 0.72 + 0.28 * sin(ph), uLook.w);
    sheen = 1.;
  } else if (kind == 6.) {                            // vault web: plaster, a painted net, and the glints the dance throws up
    vec2 m = p0.xz * 0.3; float tt = uTime * 0.22;
    float sp = rNoise(m + vec2(tt, -tt * 0.7)) * rNoise(m * 1.9 - vec2(tt * 0.6, tt));
    float glint = smoothstep(0.3, 0.62, sp);
    alb *= 0.8 + 0.25 * rNoise(p0.xz * 0.8);
    vec2 st2 = p0.xz / 3.2; vec2 fs = fract(st2) - .5;
    float star = uLook.z > 0.5 ? smoothstep(0.075, 0.05, length(fs)) * step(0.55, rHash(floor(st2))) : 0.;
    gold = max(gold, star); alb = mix(alb, vec3(1., 0.62, 0.2), star);
    emis += (uRoomCol * 0.5 + FIRECOL * 0.06) * glint * fa * (1. - uLook.w);
  } else if (kind == 7.) {                            // carpet: medallions, a small flower between them, a lighter thread round each
    vec2 f = uv / 3.4; vec2 ff = fract(f) - .5;
    float lz = abs(ff.x) + abs(ff.y);
    float medal = smoothstep(0.4, 0.37, lz) * smoothstep(0.24, 0.27, lz) + smoothstep(0.12, 0.09, lz);
    vec2 g2 = fract(f + 0.5) - .5;
    float flower = smoothstep(0.11, 0.08, length(g2));
    float thread = smoothstep(0.03, 0.012, abs(lz - 0.455));
    alb *= (0.8 + 0.2 * rNoise(uv * 9.)) * mix(1., 0.28, clamp(medal + flower, 0., 1.)) * mix(1., 2.1, thread);
    sheen = 0.35;
  } else if (kind == 8.) {                            // polished carved wood
    vec2 f = uv * 2.3; float e = 0.05;
    float h0 = carve(f) + 0.5 * carve(f * 2.7 + 3.), hx = carve(f + vec2(e, 0.)) + 0.5 * carve((f + vec2(e, 0.)) * 2.7 + 3.), hy = carve(f + vec2(0., e)) + 0.5 * carve((f + vec2(0., e)) * 2.7 + 3.);
    n = normalize(n - (T * (hx - h0) + B * (hy - h0)) * (0.05 / e));
    alb *= 0.8 + 0.15 * h0;
  } else if (kind == 9.) {                            // fire and coals
    float fl = 0.7 + 0.6 * rNoise(vec2(uTime * 5. + uPhase.z, p0.y * 2. + p0.x));
    emis += alb * fl * 3.2; alb = vec3(0.);
  } else if (kind == 12.) {                           // stone lit by a bare brazier (the corridor): the light is in the vertex colour
    vec2 bb = uv / vec2(2.4, 1.2); bb.x += 0.5 * floor(bb.y); vec2 fb = fract(bb);
    float joint = smoothstep(0., .035, fb.x) * smoothstep(1., .965, fb.x) * smoothstep(0., .07, fb.y) * smoothstep(1., .93, fb.y);
    emis += alb * mix(0.6, 1., joint) * (0.8 + 0.4 * rNoise(vec2(uTime * 3.3 + uPhase.z, 7.3)) + 0.15 * rNoise(vec2(uTime * 9.1 + uPhase.z * 1.7, 2.1)));
    alb = vec3(0.);
  } else if (kind == 10.) {                           // gold: chased
    vec2 f = uv * 5.; float e = 0.1;
    float h0 = carve(f), hx = carve(f + vec2(e, 0.)), hy = carve(f + vec2(0., e));
    n = normalize(n - (T * (hx - h0) + B * (hy - h0)) * (0.03 / e));
    gold = 1.;
  } else if (kind == 11.) {                           // the dial: marks and rings, no numerals
    vec2 d = (p0.xy - uDial.xy) / max(uDial.z, 1e-3);
    float r = length(d), a = atan(d.y, d.x + 1e-6);
    float h12 = abs(fract(a / 6.2832 * 12.) - .5), m60 = abs(fract(a / 6.2832 * 60.) - .5);
    float hour = smoothstep(0.1, 0.07, h12 * 2. / max(r, 0.2)) * smoothstep(0.66, 0.68, r) * smoothstep(0.92, 0.9, r);
    float minute = smoothstep(0.2, 0.14, m60) * smoothstep(0.83, 0.845, r) * smoothstep(0.92, 0.905, r);
    float rings = smoothstep(0.012, 0.004, abs(r - 0.94)) + smoothstep(0.008, 0.003, abs(r - 0.62)) + smoothstep(0.008, 0.003, abs(r - 0.3));
    float rose = smoothstep(0.02, 0., abs(r - 0.21 - 0.07 * cos(a * 8.))) * step(r, 0.3);
    float ink = clamp(hour + minute + rings + rose, 0., 1.);
    alb = mix(alb * (0.86 + 0.14 * rNoise(d * 9.)), vec3(0.015), ink);
    emis += alb * uRoomCol * uDial.w;
  }
  vec3 col;
  if (kind == 5.) {                                   // the stained window, the fire behind it
    float s = p.x < 0. ? -1. : 1.;
    vec2 q = vec2(p.z - uWin.x, p.y - uWin.y);
    vec3 g = lancetGlass(q, uWin.z, uWin.w - uWin.y, uSrc.z, 0.);
    vec3 vd = -v;
    float kb = 1.6 / max(abs(vd.x), 0.45);
    vec2 qb = vec2(p.z, p.y) + vd.zy * kb - vec2(uWin.x, uSrc.y * 0.46);
    float fl = s < 0. ? uFlick.x : uFlick.y;
    float lick = rNoise(vec2(qb.x * 0.7 + s * 3., qb.y * 0.45 - uTime * 2.6 - (s < 0. ? uPhase.x : uPhase.y)));
    vec2 df = qb / vec2(3.6 + 1.4 * lick, 6.4 + 2.8 * lick);
    float fire = exp(-dot(df, df)) * (0.75 + 0.5 * lick);
    float fall = 0.55 + 0.45 * exp(-max(q.y - uSrc.y * 0.46 + uWin.y, 0.) * 0.09);
    // the brazier itself, dark against its own fire: a bowl on three legs
    vec2 tb = qb + vec2(0., 2.6);
    float bowl = smoothstep(0.14, 0., length(tb / vec2(2.3, 0.9)) - 1.) * step(tb.y, 0.2);
    float ly = clamp(-tb.y - 0.6, 0., 9.);
    float legs = (smoothstep(0.3, 0.12, abs(abs(tb.x) - 0.5 - 0.3 * ly)) + smoothstep(0.3, 0.12, abs(tb.x))) * step(0.6, -tb.y) * step(-tb.y, 9.6);
    float sil = clamp(bowl + legs, 0., 1.);
    float deep = 1. - 0.6 * uLook.w;                                        // the scarlet panes stay a deep colour
    col = uGlassCol * g.x * fl * (2.1 * fall + 5.5 * fire) * deep + FIRECOL * g.x * fire * fire * fl * 1.1 * (1. - uLook.w);
    col *= mix(1., 0.1, sil);
    vec3 stone = vec3(0.06) * uRoomCol * fa * 0.6;
    col = mix(stone, col, g.y);
  } else {
    vec3 spec, beamL;
    vec3 L = roomLight(p, n, v, gloss, spec, beamL);
    float lm = max(max(L.r, L.g), L.b) * 0.55 + dot(L, vec3(0.3, 0.5, 0.2)) * 0.45;
    if (kind == 2.) { L = mix(L, vec3(1., 0.93, 0.84) * lm, 0.42); spec *= 0.5; }      // the floor takes a whiter key than the walls, so that the dance reads against it
    float gk = 1. - 0.55 * uLook.w;
    vec3 Lw = mix(L, (vec3(1., 0.74, 0.4) * lm * 1.25 * gk + L * 0.3) * (0.45 + 0.55 * pow(clamp(dot(n, v), 0., 1.), 0.6)), gold);
    float sm = max(max(spec.r, spec.g), spec.b);
    vec3 sp = mix(spec, vec3(1., 0.72, 0.36) * sm * 1.6 * gk + spec * 0.4, gold);
    col = alb * Lw + sp + emis;
    float rim = pow(clamp(1. - dot(n, v), 0., 1.), 2.5);
    col += (L + beamL * 0.35) * rim * sheen * (0.25 + 0.5 * uLook.w) * (0.25 + alb * 3.);
  }
  col = roomHaze(col, vDist);
  gl_FragColor = vec4(col, 1.);
}`;function He(e,s={}){return new r.ShaderMaterial({uniforms:{...e,uRoomInv:{value:s.roomInv||new r.Matrix4},uDial:{value:s.dial||new r.Vector4(0,0,1,0)}},vertexShader:ze,fragmentShader:Le,side:s.side??r.DoubleSide})}const re=.66,Ee=["plume","horns","beak","lantern","sunrays","hennin","tricorn","jester","antlers","crescent","turban"],O=[1,1,1],Ye=[.03,.03,.035],ee=[.9,.86,.78],Q=[1,.72,.34],le=(e,s,t,o=1,A=null,w=0,f=U)=>{const u=s.length-1;e.grid(t,u,(i,c,h)=>{const d=c*u,g=Math.min(u-1,Math.floor(d)),y=d-g,D=fe(s[g][0],s[g+1][0],y),T=fe(s[g][1],s[g+1][1],y),M=fe(w,f,i);h[0]=Math.sin(M)*D,h[1]=T,h[2]=Math.cos(M)*D*o},!0,A)};function Se(e,s,t,o,A,w){const f=(i,c=.2,h=0)=>e.surf(i,s+2,c,h);f(6,.15),e.col([.8,.8,.8]),e.geo(new r.SphereGeometry(1,9,7),{p:[0,o,-.02],s:[.25,.3,.27]}),f(5,.75),e.col(w),e.geo(new r.SphereGeometry(1,9,7,0,Math.PI),{p:[0,o-.01,.05],s:[.245,.31,.25]}),f(0,.05),e.col([.004,.004,.006]);for(const i of[-1,1])e.geo(new r.SphereGeometry(1,6,4),{p:[i*.1,o+.05,.265],s:[.06,.035,.03],r:[0,i*.25,i*.2]});const u=(i,c,h,d,g)=>{const y=[c[1]*0-c[2]*1,0,c[0]*1],D=Math.hypot(y[0],y[2])||1;y[0]/=D,y[2]/=D,e.grid(1,4,(T,M,b)=>{const N=d*(.35+1.3*M*(1-M)*2)*(T-.5)*2,B=g*M*M*h;b[0]=i[0]+c[0]*h*M+y[0]*N+g*0,b[1]=i[1]+c[1]*h*M-B*.35,b[2]=i[2]+c[2]*h*M+y[2]*N-B},!1,(T,M)=>.15+.75*M)};if(t==="plume"){f(6,.1),e.col(O);const i=5;for(let c=0;c<i;c++){const h=(c/(i-1)-.5)*1.7;u([Math.sin(h)*.1,o+.24,-.08],[Math.sin(h)*.55,.83,-.12],A.range(1,1.5),.2,.3)}f(3,.8),e.col(Q),e.geo(new r.SphereGeometry(.09,6,4),{p:[0,o+.27,.1]})}else if(t==="horns"){f(3,.8),e.col(Q);for(const i of[-1,1]){const c=[[i*.18,o+.18,0],[i*.5,o+.5,0],[i*.62,o+.95,.05],[i*.42,o+1.32,.12]],h=[.1,.075,.045,.012];for(let d=0;d<3;d++)e.rod(c[d],c[d+1],h[d],h[d+1],5)}}else if(t==="beak"){f(5,.7),e.col(w),e.geo(new r.ConeGeometry(.13,.8,6),{p:[0,o-.07,.58],r:[Math.PI/2+.22,0,0]}),f(6,.1),e.col(O);for(let i=0;i<3;i++){const c=(i-1)*.5;u([Math.sin(c)*.1,o+.25,.02],[Math.sin(c)*.4,.75,-.5],.8,.14,.2)}}else if(t==="lantern"){f(3,.8),e.col(Q);const i=[];for(let c=0;c<=6;c++){const h=(c/6-.5)*Math.PI;i.push([Math.sin(h)*.55,o+.2+Math.cos(h)*.75,-.05])}e.tube(i,.035,4);for(const c of[-.9,0,.9]){const h=Math.sin(c)*.55,d=o+.2+Math.cos(c)*.75;f(3,.8),e.col(Q),e.rod([h,d,-.05],[h,d+.2,-.05],.02,.02,4),e.geo(new r.ConeGeometry(.13,.12,5),{p:[h,d+.5,-.05]}),f(4,.2),e.col(O),e.geo(new r.CylinderGeometry(.11,.09,.28,6),{p:[h,d+.33,-.05]})}}else if(t==="sunrays"){f(3,.8),e.col(Q);for(let i=0;i<11;i++){const c=(i/10-.5)*3.6,h=i%2?.7:1.05,d=.07,g=Math.cos(c),y=Math.sin(c);e.tri([y*.3-g*d,o+g*.3+y*d,-.14],[y*.3+g*d,o+g*.3-y*d,-.14],[y*h,o+g*h,-.2])}e.geo(new r.TorusGeometry(.31,.04,4,12),{p:[0,o,-.14]})}else if(t==="hennin")f(2,.3),e.col(O),e.geo(new r.ConeGeometry(.24,1.35,7),{p:[0,o+.72,-.3],r:[-.42,0,0]}),f(6,.1),e.col(ee),e.grid(2,4,(i,c,h)=>{h[0]=(i-.5)*(.2+.5*c),h[1]=o+1.33-c*1.7,h[2]=-.58-c*.75-.2*Math.sin(c*3)},!1,(i,c)=>.2+.8*c);else if(t==="tricorn")f(0,.3),e.col([.05,.05,.06]),e.geo(new r.CylinderGeometry(.62,.5,.17,3),{p:[0,o+.27,0],r:[0,Math.PI,0]}),e.geo(new r.CylinderGeometry(.22,.27,.22,7),{p:[0,o+.4,0]}),f(3,.8),e.col(Q),e.geo(new r.TorusGeometry(.5,.03,4,3),{p:[0,o+.36,0],r:[Math.PI/2,0,Math.PI/2]}),f(6,.1),e.col(O),u([.2,o+.4,-.05],[.45,.7,-.4],1.1,.2,.35);else if(t==="jester")for(const i of[-1,1]){f(i<0?1:2,.25),e.col(O);const c=[[i*.1,o+.2,0],[i*.5,o+.55,0],[i*.85,o+.4,.05],[i*.98,o+.05,.08]],h=[.2,.14,.08,.03];for(let d=0;d<3;d++)e.rod(c[d],c[d+1],h[d],h[d+1],6);f(3,.9),e.col(Q),e.geo(new r.SphereGeometry(.085,6,4),{p:[i*.99,o-.02,.08]})}else if(t==="antlers"){f(3,.7),e.col(Q);for(const i of[-1,1]){const c=[i*.15,o+.22,-.03],h=[i*.45,o+.75,-.08],d=[i*.7,o+1.35,0];e.rod(c,h,.06,.045,5),e.rod(h,d,.045,.012,5),e.rod(h,[i*.75,o+.85,.12],.035,.01,4),e.rod([i*.56,o+1.02,-.04],[i*.42,o+1.3,.1],.03,.01,4),e.rod([i*.3,o+.5,-.06],[i*.34,o+.72,.2],.03,.01,4)}}else t==="crescent"?(f(3,.9),e.col([.9,.9,.95]),e.geo(new r.TorusGeometry(.62,.075,5,14,Math.PI*1.25),{p:[0,o+.55,-.16],r:[0,0,-Math.PI*.125+Math.PI],s:[1,1,.5]})):(f(2,.3),e.col(O),e.geo(new r.SphereGeometry(1,9,6),{p:[0,o+.22,-.03],s:[.4,.27,.4]}),f(4,.3),e.col(O),e.geo(new r.SphereGeometry(.07,6,4),{p:[0,o+.26,.38]}),f(6,.1),e.col(O),u([0,o+.3,.33],[0,.95,-.2],.95,.13,.25))}function Pe(e,s,t){const o=(w,f=.2,u=0)=>e.surf(w,0,f,u),A=s.wide?1.42:1.22;o(1,.25),e.col(O),le(e,[[.3,1.95],[.5,1.78],[.82,1.3],[A*.86,.72],[A*.97,.26],[A,.04]],16,1,(w,f)=>Math.pow(f,1.3)),o(2,.3),e.col(O),le(e,[[.32,1.98],[.56,1.8],[.9,1.34],[A*.93,.95]],12,1,(w,f)=>.7*f,.5,U-.5),o(1,.3),e.col(O),le(e,[[.3,1.93],[.4,2.28],[.43,2.48],[.33,2.68],[.12,2.78]],8,.78),o(3,.8),e.col(Q),e.geo(new r.TorusGeometry(.31,.04,4,10),{p:[0,1.96,0],r:[Math.PI/2,0,0]}),o(2,.3),e.col(O);for(const w of[-1,1])e.geo(new r.SphereGeometry(.27,7,5),{p:[w*.43,2.56,0],s:[1,.9,.9]});o(0,.2),e.col(ee),e.rod([-.45,2.52,0],[-.66,2.12,.3],.1,.085,5),e.rod([-.66,2.12,.3],[-.7,2.3,.66],.085,.07,5),e.rod([.45,2.52,0],[.62,2.5,.5],.1,.085,5),e.rod([.62,2.5,.5],[.4,2.82,1.02],.085,.07,5),e.rod([0,2.72,0],[0,2.86,0],.1,.09,5),s.ruff&&(e.surf(0,2,.2,0),e.col(ee),e.grid(12,1,(w,f,u)=>{const i=w*U,c=.16+.34*f;u[0]=Math.sin(i)*c,u[1]=2.8+.05*Math.sin(i*6)*f,u[2]=Math.cos(i)*c},!0)),Se(e,0,s.head,3.04,t,s.mask||ee)}function Ge(e,s,t){const o=(w,f=.2,u=0)=>e.surf(w,1,f,u);o(2,.25),e.col(O);for(const w of[-1,1])e.rod([w*.18,1.74,0],[w*.22,.95,.07],.19,.14,5),e.rod([w*.22,.95,.07],[w*.21,.14,0],.14,.1,5);o(0,.4),e.col([.03,.03,.035]);for(const w of[-1,1])e.box(w*.21,.1,.1,.22,.2,.52);o(2,.25),e.col(O),e.geo(new r.SphereGeometry(1,8,5),{p:[0,1.74,0],s:[.44,.36,.36]}),o(1,.3),e.col(O),le(e,[[.34,1.86],[.45,2.3],[.52,2.72],[.4,2.94],[.13,3.04]],8,.72),o(3,.8),e.col(Q),e.geo(new r.TorusGeometry(.36,.045,4,10),{p:[0,1.9,0],r:[Math.PI/2,0,0],s:[1,.75,1]}),o(1,.3),e.col(O),e.rod([.5,2.8,0],[.72,2.3,.3],.13,.1,5),e.rod([.72,2.3,.3],[.7,2.3,.66],.1,.08,5),e.rod([-.5,2.8,0],[-.72,2.5,.5],.13,.1,5),e.rod([-.72,2.5,.5],[-.32,2.36,1.3],.1,.08,5),e.rod([0,2.98,0],[0,3.14,0],.11,.1,5),o(2,.2),e.col(O);const A=s.long?.35:.75;e.grid(9,5,(w,f,u)=>{const i=Math.PI+(w-.5)*3.9,c=.52+.72*Math.pow(f,.8)+.05*Math.sin(w*22)*f;u[0]=Math.sin(i)*c,u[1]=2.96-f*(2.96-A),u[2]=Math.cos(i)*c*.9},!1,(w,f)=>f*f),s.ruff&&(e.surf(0,3,.2,0),e.col(ee),e.grid(12,1,(w,f,u)=>{const i=w*U,c=.18+.36*f;u[0]=Math.sin(i)*c,u[1]=3.08+.05*Math.sin(i*6)*f,u[2]=Math.cos(i)*c},!0)),Se(e,1,s.head,3.34,t,s.mask||ee)}function*De(e,s){const t=J(4096),o=new r.Matrix4;return t.tr(o.makeRotationY(Math.PI/2).setPosition(-re,0,0)),Pe(t,e.lady,s),yield,t.tr(o.makeRotationY(-Math.PI/2).setPosition(re,0,0)),Ge(t,e.gent,s),t.tr(null),yield,t.build()}function Re(e,s){const t=De(e,s);let o=t.next();for(;!o.done;)o=t.next();return o.value}const Fe=`
attribute vec3 aCol; attribute vec4 aSurf;
attribute vec4 iHome;      // x, z of the pair's place in the room, radius of its round, size
attribute vec4 iAnim;      // start angle, turn rate (rad per second of the dance, signed), rate of the round, seed
attribute vec3 iColA; attribute vec3 iColB; attribute vec3 iColC;
uniform float uDance, uStop, uWild, uTime; uniform vec2 uDoorAt;   // uDance: seconds of dance, given by the world from the metres flown
varying vec3 vP, vP0, vN, vCol, vV, vColP, vColC; varying vec4 vSurf; varying float vDist, vSeed, vWho;
vec2 rotY(vec2 q, float a){ float c = cos(a), s = sin(a); return vec2(q.x * c + q.y * s, -q.x * s + q.y * c); }
void main(){
  float who = mod(aSurf.y, 2.), head = step(1.5, aSurf.y), fw = aSurf.w;
  float go = 1. - uStop;
  float sgn = who < 0.5 ? -1. : 1., fx = sgn * ${re.toFixed(2)};
  float th = iAnim.x + iAnim.y * uDance;
  float sd = fract(iAnim.w * 7.31 + who * 0.37);
  // on the clock, and only while they dance: each figure sways and bobs a little in its own time, each pair rocks on its place
  float ck = uTime * (1.1 + 0.6 * sd) + iAnim.w * 40. + who * 2.1;
  float rock = 0.13 * sin(uTime * 0.8 + iAnim.w * 23.) * go;
  vec3 p = position, n = normal;
  vP0 = p;
  p.y *= mix(0.88, 1.2, sd * sd);                                  // unsuited limbs: every figure its own stretch
  float bob = (0.1 * sin(2. * th + 1.3) + 0.06 * sin(ck * 1.6)) * go * uWild;
  vec2 r = p.xz - vec2(fx, 0.); float rl = max(length(r), 1e-3);
  r += r / rl * fw * go * (0.2 + 0.12 * sin(2. * th + sd * 6.) + 0.07 * sin(ck * 1.3)) * uWild;        // skirts and cloaks fly out
  float trail = (-sign(iAnim.y) * fw * 0.5 + 0.14 * sin(ck)) * go;   // and trail the turn; the figure's own sway
  r = rotY(r, trail); n.xz = rotY(n.xz, trail);
  r.x += sgn * fw * 0.24 * go;
  float oa = iAnim.x * 3.7 + iAnim.z * uDance;
  vec2 c = iHome.xy + iHome.z * vec2(cos(oa), 0.7 * sin(oa));
  vec2 td = uDoorAt - c;
  float aT = atan(-td.y, td.x + 1e-4), aF = th + rock + (who < 0.5 ? 0. : 3.14159);
  float dl = clamp(mod(aT - aF + 3.14159, 6.28318) - 3.14159, -1.25, 1.25) * uStop * head;   // masks turn to the last doorway
  r = rotY(r, dl); n.xz = rotY(n.xz, dl);
  r.x += sgn * 0.003 * p.y * p.y * go * uWild;                     // leaning out of the turn
  p.xz = r + vec2(fx, 0.);
  p.y += bob * (1. - 0.6 * fw);
  p.xz = rotY(p.xz, th + rock); n.xz = rotY(n.xz, th + rock);
  p *= iHome.w; p.xz += c;
  vP = p; vN = n; vCol = aCol; vSurf = aSurf; vSeed = iAnim.w; vWho = who;
  vColP = who < 0.5 ? iColA : iColB; vColC = iColC;
  vec4 wp = modelMatrix * vec4(p, 1.);
  vV = (cameraPosition - wp.xyz) * mat3(modelMatrix);
  vec4 mv = viewMatrix * wp; vDist = length(mv.xyz);
  gl_Position = projectionMatrix * mv;
}`,Te=`
varying vec3 vP, vP0, vN, vCol, vV, vColP, vColC; varying vec4 vSurf; varying float vDist, vSeed, vWho;
const vec3 FIRECOL = vec3(1.0, 0.33, 0.045);
${me}
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV);
  float slot = floor(vSurf.x + 0.5), gloss = vSurf.z, gold = 0.;
  vec3 alb = vCol, emis = vec3(0.);
  float fx = vWho < 0.5 ? -${re.toFixed(2)} : ${re.toFixed(2)};
  vec2 rr = vP0.xz - vec2(fx, 0.);
  vec2 uv = vec2(atan(rr.y, rr.x + 1e-4) * 2.2, vP0.y * 1.5);
  float sequin = 0.;
  if (slot == 1.) {
    float kindP = fract(vSeed * 3.17 + vWho * 0.41);
    float pat = 1.;
    if (kindP < 0.3) { vec2 d = vec2(uv.x + uv.y, uv.x - uv.y) * 0.9; pat = mod(floor(d.x) + floor(d.y), 2.); }      // harlequin
    else if (kindP < 0.55) pat = step(0.5, fract(uv.x * 1.6));                                                    // stripes
    else if (kindP < 0.75) pat = step(0.5, fract(uv.y * 1.3 + 0.2 * sin(uv.x * 4.)));                              // flounces
    alb *= vColP * mix(0.4, 1., pat);
    sequin = kindP > 0.2 ? 1. : 0.5;
  } else if (slot == 2.) { alb *= vColC; sequin = 0.5; }
  else if (slot == 3.) { gold = 1.; }
  else if (slot == 4.) { emis = (uGlassCol * 2.2 + vec3(0.12)) * (0.85 + 0.15 * sin(uTime * 9. + vSeed * 40.)); alb = vec3(0.); }
  else if (slot == 6.) { alb *= mix(vColP, vec3(1.), 0.45); }
  vec3 spec, beamL;
  vec3 L = roomLight(vP, n, v, gloss, spec, beamL);
  float lm = max(max(L.r, L.g), L.b) * 0.55 + dot(L, vec3(0.3, 0.5, 0.2)) * 0.45;
  // the figures take a whiter, warmer key than the walls (and never burn out in a beam), so masks and gowns stand clear of the room
  float knee = 2.4 / (2.4 + max(lm - 1., 0.));
  L = mix(L, vec3(1., 0.9, 0.76) * lm, 0.55) * knee; lm *= knee;
  vec3 Lw = mix(L, (vec3(1., 0.74, 0.4) * lm * 1.25 + L * 0.3) * (0.45 + 0.55 * pow(clamp(dot(n, v), 0., 1.), 0.6)), gold);
  float sm = max(max(spec.r, spec.g), spec.b);
  vec3 sp = mix(spec, vec3(1., 0.72, 0.36) * sm * 1.6 + spec * 0.4, gold);
  vec3 col = alb * Lw + sp + emis;
  if (sequin > 0.) {                                                // sequins: each a little mirror for the windows
    vec2 cell = floor(uv * 11.); float h = rHash(cell + vSeed * 31.);
    vec3 jn = normalize(n + (vec3(h, rHash(cell + 1.7), rHash(cell + 5.1)) - 0.5) * 1.1);
    col += roomMirror(vP, reflect(-v, jn), 0.08) * step(0.5, h) * 0.9 * sequin;
  }
  float rim = pow(clamp(1. - dot(n, v), 0., 1.), 3.);
  col += (L * 0.5 + vec3(1., 0.84, 0.62) * lm * 0.5) * rim * 0.55 * (0.35 + alb);
  col = roomHaze(col, vDist);
  gl_FragColor = vec4(col, 1.);
}`,qe=`
attribute vec4 iHome; attribute vec4 iAnim;
uniform float uDance; varying vec2 vQ; varying vec3 vP;
void main(){
  float oa = iAnim.x * 3.7 + iAnim.z * uDance;
  vec2 c = iHome.xy + iHome.z * vec2(cos(oa), 0.7 * sin(oa));
  vQ = position.xz;
  vec3 p = vec3(position.x * 2.3 * iHome.w + c.x, 0.035, position.z * 2.3 * iHome.w + c.y);
  vP = p;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(p, 1.);
}`,Ie=`
varying vec2 vQ; varying vec3 vP;
void main(){ float d = dot(vQ, vQ); float a = 0.62 * exp(-d * 3.2) * smoothstep(1., 0.6, d); gl_FragColor = vec4(0., 0., 0., a); }`;function je(e){const s=new r.Group,t={...e.uniforms,uDance:{value:0},uStop:{value:0},uWild:{value:e.wild??1},uDoorAt:{value:new r.Vector2(e.doorAt[0],e.doorAt[1])}},o=new r.ShaderMaterial({uniforms:t,vertexShader:Fe,fragmentShader:Te,side:r.DoubleSide});let A=0;const w=f=>{const u=f.length,i=new Float32Array(u*4),c=new Float32Array(u*4),h=new Float32Array(u*3),d=new Float32Array(u*3),g=new Float32Array(u*3);return f.forEach((y,D)=>{i.set([y.x,y.z,y.r,y.size],D*4),c.set([y.phase,y.turn,y.round,y.seed],D*4),h.set(y.a,D*3),d.set(y.b,D*3),g.set(y.c,D*3)}),{n:u,H:new r.InstancedBufferAttribute(i,4),A:new r.InstancedBufferAttribute(c,4),CA:new r.InstancedBufferAttribute(h,3),CB:new r.InstancedBufferAttribute(d,3),CC:new r.InstancedBufferAttribute(g,3)}};for(let f=0;f<e.fashions.length;f++){const u=e.pairs.filter(g=>g.fashion===f);if(!u.length)continue;const i=e.geometries?e.geometries[f]:Re(e.fashions[f],e.rng),c=new r.InstancedBufferGeometry,h=w(u);for(const g of["position","normal","aCol","aSurf"])c.setAttribute(g,i.attributes[g]);c.setAttribute("iHome",h.H),c.setAttribute("iAnim",h.A),c.setAttribute("iColA",h.CA),c.setAttribute("iColB",h.CB),c.setAttribute("iColC",h.CC),c.instanceCount=h.n;const d=new r.Mesh(c,o);d.frustumCulled=!1,s.add(d),A+=i.attributes.position.count/3*h.n}if(e.pairs.length){const f=new r.InstancedBufferGeometry,u=w(e.pairs);f.setAttribute("position",new r.BufferAttribute(new Float32Array([-1,0,-1,-1,0,1,1,0,1,-1,0,-1,1,0,1,1,0,-1]),3)),f.setAttribute("iHome",u.H),f.setAttribute("iAnim",u.A),f.instanceCount=u.n;const i=new r.ShaderMaterial({uniforms:{uDance:t.uDance},vertexShader:qe,fragmentShader:Ie,transparent:!0,depthWrite:!1}),c=new r.Mesh(f,i);c.frustumCulled=!1,c.renderOrder=1,s.add(c)}return{object:s,uniforms:t,material:o,triangles:A,count:e.pairs.length}}function ae(e,s,t,o){const A=o*s,w=Math.abs(e)+(o-1)*s;return t+Math.sqrt(Math.max(A*A-w*w,0))}function oe(e,s=16){const t=[[e.c-e.hw,e.y0]];for(let o=0;o<=s;o++){const A=-e.hw+2*e.hw*o/s;t.push([e.c+A,ae(A,e.hw,e.ys,e.k)])}return t.push([e.c+e.hw,e.y0]),t}function ie(e,s){const t=new Set,o=u=>{u>s.u0-1e-6&&u<s.u1+1e-6&&t.add(Math.round(u*1e3)/1e3)},A=Math.max(1,Math.round((s.u1-s.u0)/(s.step||2)));for(let u=0;u<=A;u++)o(s.u0+(s.u1-s.u0)*u/A);for(const u of s.holes||[])for(let i=-8;i<=8;i++)o(u.c+u.hw*i/8);const w=[...t].sort((u,i)=>u-i),f=(u,i)=>{const c=[];let h=s.bottom||0;const d=s.top(u);for(const g of s.holes||[])Math.abs(i-g.c)<g.hw&&(g.y0>h+1e-4?c.push([h,g.y0]):c.push(null),h=Math.min(ae(u-g.c,g.hw,g.ys,g.k),d));return c.push([h,d]),c};for(let u=0;u<w.length-1;u++){const i=w[u],c=w[u+1],h=(i+c)/2,d=f(i,h),g=f(c,h);for(let y=0;y<d.length;y++){if(!d[y]||!g[y]||d[y][1]-d[y][0]<.001&&g[y][1]-g[y][0]<.001)continue;const D=s.at(i,d[y][0]),T=s.at(c,g[y][0]),M=s.at(c,g[y][1]),b=s.at(i,d[y][1]);s.flip?e.quad(T,D,b,M):e.quad(D,T,M,b)}}}function he(e,s,t,o,A,w=16){const f=oe(t,w);for(let u=0;u<f.length-1;u++){const i=f[u],c=f[u+1];e.quad(s.at3(i[0],i[1],o),s.at3(c[0],c[1],o),s.at3(c[0],c[1],A),s.at3(i[0],i[1],A))}}const Me={H:49,baseHw:7,baseD:8.6,doorHw:4.25,doorSill:.5,doorTop:12.1,dialY:34.2,dialR:4.9,pivotY:32.6,pendL:13.6,period:2.6},de=[.05,.043,.046],ce=[1,.72,.34],Be=[.86,.82,.72];function*Ve(e,s){const t=Me,o=t.baseD/2,A=()=>e.col(de).surf(_.WOOD,.85,0,0),w=()=>e.col(ce).surf(_.GOLD,.8,1,0),f=(n,v,m,a)=>{e.quad([n,m,v],[n,m,-v],[n,a,-v],[n,a,v]),e.quad([-n,m,-v],[-n,m,v],[-n,a,v],[-n,a,-v]),e.quad([n,m,-v],[-n,m,-v],[-n,a,-v],[n,a,-v])},u=(n,v,m,a,l)=>{A();for(let C=0;C<3;C++){const H=l*(C+1)/3;e.box(0,n+a*(C+.5)/3,0,(v+H)*2,a/3,(m+H)*2)}w(),e.box(0,n+a*.36,0,(v+l*.36)*2+.16,.14,(m+l*.36)*2+.16);const p=Math.round(v*2/.9);for(let C=0;C<p;C++){const H=(C+.5)/p*2*v-v;e.box(H,n-.22,m+.12,.42,.42,.3)}},i=(n,v,m,a,l)=>{A(),e.geo(new r.CylinderGeometry(l,l*1.08,a-m,7,6,!0),{p:[n,(m+a)/2,v],warp:p=>{const C=p.y*.5,H=Math.cos(C),P=Math.sin(C),x=p.x*H-p.z*P,F=p.x*P+p.z*H;p.x=x*(1+.14*Math.cos(Math.atan2(F,x)*3)),p.z=F*(1+.14*Math.sin(Math.atan2(F,x)*3))}}),w(),e.geo(new r.CylinderGeometry(l*1.25,l*1.55,l*1.4,8),{p:[n,m+l*.7,v]}),e.geo(new r.CylinderGeometry(l*1.7,l*1.15,l*1.6,8),{p:[n,a-l*.8,v]}),e.geo(new r.SphereGeometry(l*1.2,7,5),{p:[n,a-l*1.9,v],s:[1,.5,1]})},c=(n,v,m,a,l,p=.22)=>{A(),e.quad(n(v,m,0),n(a,m,0),n(a-.3,m+.3,-p),n(v+.3,m+.3,-p)),e.quad(n(a,m,0),n(a,l,0),n(a-.3,l-.3,-p),n(a-.3,m+.3,-p)),e.quad(n(a,l,0),n(v,l,0),n(v+.3,l-.3,-p),n(a-.3,l-.3,-p)),e.quad(n(v,l,0),n(v,m,0),n(v+.3,m+.3,-p),n(v+.3,l-.3,-p)),e.quad(n(v+.3,m+.3,-p),n(a-.3,m+.3,-p),n(a-.3,l-.3,-p),n(v+.3,l-.3,-p)),w();for(const[H,P]of[[[v,m],[a,m]],[[a,m],[a,l]],[[a,l],[v,l]],[[v,l],[v,m]]])e.rod(n(H[0],H[1],.03),n(P[0],P[1],.03),.06,.06,4)};A(),e.box(0,.25,0,16.4,.5,11.4),e.box(0,.75,0,15.4,.5,10.4),f(t.baseHw,o,1,13.5);const h={c:0,hw:t.doorHw,y0:t.doorSill,ys:t.doorTop-t.doorHw,k:1};ie(e,{at:(n,v)=>[n,v,o],u0:-t.baseHw,u1:t.baseHw,bottom:1,top:()=>13.5,holes:[h],step:1.4}),he(e,{at3:(n,v,m)=>[n,v,o-m]},h,0,1.1,20),yield,e.col(de,1.6).surf(_.WOOD,.6,0,0),e.quad([-t.doorHw-.6,t.doorSill,o-1.1],[-t.doorHw-.6,t.doorSill,-o],[-t.doorHw-.6,13,-o],[-t.doorHw-.6,13,o-1.1]),e.quad([t.doorHw+.6,t.doorSill,-o],[t.doorHw+.6,t.doorSill,o-1.1],[t.doorHw+.6,13,o-1.1],[t.doorHw+.6,13,-o]),e.quad([-t.doorHw-.6,13,o-1.1],[-t.doorHw-.6,13,-o],[t.doorHw+.6,13,-o],[t.doorHw+.6,13,o-1.1]),e.quad([-t.doorHw-.6,t.doorSill,-o],[-t.doorHw-.6,t.doorSill,o],[t.doorHw+.6,t.doorSill,o],[t.doorHw+.6,t.doorSill,-o]),e.quad([-t.doorHw-.6,t.doorSill,o-1.1],[-t.doorHw-.6,13,o-1.1],[-t.doorHw,13,o-1.1],[-t.doorHw,t.doorSill,o-1.1]),e.quad([t.doorHw,t.doorSill,o-1.1],[t.doorHw,13,o-1.1],[t.doorHw+.6,13,o-1.1],[t.doorHw+.6,t.doorSill,o-1.1]),w(),e.tube(oe(h,18).map(n=>[n[0]*1.045,n[1]+(n[1]>h.ys?.2:0),o+.08]),.16,5),e.tube(oe(h,18).map(n=>[n[0]*1.16,n[1]+(n[1]>h.ys?.72:0),o+.06]),.09,4);for(const n of[-1,1]){yield;for(let v=0;v<2;v++){const m=n*(t.doorHw+.15-v*.5),a=1.6-v*2.3,l=v?4.2:7.6;for(let p=12.9;p>l+1.3;p-=.5)e.geo(new r.TorusGeometry(.16,.045,4,6),{p:[m,p,a],r:[0,Math.round(p*2)%2*Math.PI/2,0]});e.geo(new r.CylinderGeometry(.42,.42,2.4,9),{p:[m,l,a]}),e.geo(new r.SphereGeometry(.42,9,5),{p:[m,l-1.2,a],s:[1,.6,1]}),e.geo(new r.ConeGeometry(.42,.5,9),{p:[m,l+1.45,a]})}c((v,m,a)=>[n*(t.doorHw+.95)+v*n,m,o+a],0,1.8,1.55,12.6,.16),c((v,m,a)=>[n*(t.baseHw+a),m,v*n],-3.6,2.2,3.6,12.4),i(n*(t.baseHw+.25),o+.25,1,13.5,.5)}u(13.5,t.baseHw,o,1,.9),yield;const d=5.25,g=3.5,y=14.5,D=27;A(),f(d,g,y,D);const T={c:0,hw:3.5,y0:15.6,ys:26.2-ae(0,3.5,0,1.4),k:1.4};ie(e,{at:(n,v)=>[n,v,g],u0:-d,u1:d,bottom:y,top:()=>D,holes:[T],step:1.2}),he(e,{at3:(n,v,m)=>[n,v,g-m]},T,0,.5,16),e.quad([-d,y,g],[d,y,g],[d,y,-g],[-d,y,-g]),w(),e.tube(oe(T,16).map(n=>[n[0]*1.03,n[1]+(n[1]>T.ys?.12:0),g+.06]),.13,5),e.col([.3,.02,.03]).surf(_.VELVET,.1,0,0),e.quad([-d+.2,y,-.6],[d-.2,y,-.6],[d-.2,D,-.6],[-d+.2,D,-.6]);for(const n of[-1,1]){c((m,a,l)=>[n*(d+l),a,m*n],-2.6,y+.8,2.6,D-.8),c((m,a,l)=>[n*3.72+(n>0?m:-m),a,g+l],0,y+.6,1.3,D-.6,.12),i(n*(d+.2),g+.2,y,D,.38),w();const v=n<0?21.5:18.2;e.rod([n*2.75,D,.2],[n*2.75,v+1.4,.2],.05,.05,4),e.geo(new r.CylinderGeometry(.5,.5,2.8,10),{p:[n*2.75,v,.2]})}u(27,d,g,1,1.6),yield;const M=7,b=4.3,N=28,B=40;A(),f(M,b,N,B),e.quad([-M,N,b],[M,N,b],[M,B,b],[-M,B,b]),e.col(Be).surf(_.DIAL,.35,0,0),e.geo(new r.CircleGeometry(t.dialR,48),{p:[0,t.dialY,b+.12]}),w(),e.geo(new r.TorusGeometry(t.dialR+.22,.3,6,40),{p:[0,t.dialY,b+.15]}),e.geo(new r.TorusGeometry(t.dialR+.85,.1,4,40),{p:[0,t.dialY,b+.05]});for(const n of[-1,1])for(const v of[-1,1]){const m=n*5.35,a=t.dialY+v*4.75;for(let l=0;l<4;l++)e.geo(new r.TorusGeometry(.42,.09,4,10),{p:[m+Math.cos(l*Math.PI/2)*.42,a+Math.sin(l*Math.PI/2)*.42,b+.08]});e.geo(new r.SphereGeometry(.2,6,4),{p:[m,a,b+.12]})}for(const n of[-1,1])i(n*(M+.25),b+.35,N,B,.46),c((v,m,a)=>[n*(M+a),m,v*n],-3.2,N+1,3.2,B-1);u(B,M,b,1.2,1.1),yield;const R=B+1.2,W=5.6;A(),e.tri([-M-.6,R,b+.5],[M+.6,R,b+.5],[0,R+W,b+.5]),e.quad([M+.6,R,b+.5],[M+.6,R,-b],[0,R+W,-b],[0,R+W,b+.5]),e.quad([-M-.6,R,-b],[-M-.6,R,b+.5],[0,R+W,b+.5],[0,R+W,-b]),w(),e.geo(new r.TorusGeometry(1.25,.14,4,16),{p:[0,R+2.1,b+.56]});for(let n=0;n<4;n++)e.geo(new r.TorusGeometry(.5,.09,4,10),{p:[Math.cos(n*Math.PI/2)*.5,R+2.1+Math.sin(n*Math.PI/2)*.5,b+.58]});for(const n of[-1,1]){e.rod([n*(M+.6),R,b+.56],[0,R+W,b+.56],.14,.14,4);for(let v=1;v<7;v++){const m=v/7;e.geo(new r.SphereGeometry(.24,5,4),{p:[n*(M+.6)*(1-m),R+W*m+.22,b+.56],s:[1,1.5,1]})}for(const v of[b+.3,-b+.3])A(),e.geo(new r.CylinderGeometry(.42,.5,2.6,4),{p:[n*(M+.5),R+1.3,v],r:[0,Math.PI/4,0]}),e.geo(new r.ConeGeometry(.62,3.4,4),{p:[n*(M+.5),R+4.3,v],r:[0,Math.PI/4,0]}),w(),e.geo(new r.SphereGeometry(.26,6,4),{p:[n*(M+.5),R+6.15,v]})}return e.geo(new r.SphereGeometry(.55,8,6),{p:[0,R+W+.6,b+.2]}),e.geo(new r.ConeGeometry(.3,1.8,6),{p:[0,R+W+1.9,b+.2]}),{glass:T,thd:g,hhd:b}}const Oe=`
varying vec3 vP, vP0, vN, vN0, vCol, vV; varying vec4 vSurf; varying float vDist;
${me}
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 v = normalize(vV);
  float fres = 0.05 + 0.95 * pow(clamp(1. - dot(n, v), 0., 1.), 4.);
  float streak = smoothstep(0.35, 0.5, rNoise(vec2((vP0.x + vP0.y * 0.55) * 0.5, 3.))) * 0.035;
  vec3 col = roomMirror(vP, reflect(-v, n), 0.03) * fres * 0.9 + uRoomCol * streak * (0.5 * (uFlick.x + uFlick.y));
  gl_FragColor = vec4(col, 1.);
}`,We=`
attribute vec4 iSeed;      // where on the case (x, y, z) and its own number
uniform float uStroke, uGain, uTime; uniform mat4 uRoomInv;
varying vec2 vQ; varying float vA;
void main(){
  float g = fract(uStroke - iSeed.w * 0.55);
  float h1 = fract(iSeed.w * 17.3), h2 = fract(iSeed.w * 41.7);
  vec3 c = iSeed.xyz;
  c.y -= 2. * g + 11. * g * g * (0.5 + h1);
  c.x += (h1 - 0.5) * 3. * g + 0.5 * sin(uTime * 0.9 + h2 * 20.) * g;
  c.z += 0.6 + 3.5 * g * h2 + 0.5 * cos(uTime * 0.7 + h1 * 20.) * g;
  vA = uGain * smoothstep(0., 0.06, g) * (1. - g) * (1. - g) * (0.4 + 0.6 * h2);
  vQ = position.xy;
  vec4 mv = viewMatrix * modelMatrix * vec4(c, 1.);
  mv.xy += position.xy * (0.09 + 0.12 * h1);
  gl_Position = projectionMatrix * mv;
}`,Ne=`
uniform vec3 uDustCol; varying vec2 vQ; varying float vA;
void main(){ float d = dot(vQ, vQ); gl_FragColor = vec4(uDustCol * vA * exp(-d * 3.) * smoothstep(1., 0.7, d), 1.); }`;async function _e(e,s={}){const t=s.rng||e.rng.fork("clock"),o=Me,A=s.shared||{uTime:{value:0}},w=!s.uniforms,f=ue("#b00f1e"),u=s.uniforms||ke(A,{color:[f[0]*2.3,f[1]*2.3+.012,f[2]*2.3+.01],glass:[f[0]*2.3,f[1]*2.3+.01,f[2]*2.3+.012],hw:23,L:92,wallH:34,crown:54,winZ:-52,sill:4,winHw:4.2,winTop:31,srcBack:10,srcY:30,srcZ:20,beam:9,bounce:.5,soft:2.2,haze:.0016,hazeGain:.2,velvet:1,glassStyle:3}),i=s.roomInv||new r.Matrix4().makeTranslation(0,0,-86.7),c=new r.Vector4(0,o.dialY,o.dialR,0),h=He(u,{roomInv:i,dial:c}),d=new r.Group,g=J(32768),y=Ve(g,t);let D=y.next();for(;!D.done;)await e.yield(),D=y.next();const T=D.value;await e.yield();const M=new r.Mesh(g.build(),h);M.frustumCulled=!1,d.add(M),await e.yield();const b=(z,S,j)=>{const q=J(512);q.col([.012,.012,.014]).surf(_.WOOD,.8,0,0),q.quad([-S,0,0],[S,0,0],[S*.45,z*.7,0],[-S*.45,z*.7,0]),q.quad([-S*.6,-z*.22,0],[S*.6,-z*.22,0],[S,0,0],[-S,0,0]),j?(q.geo(new r.RingGeometry(S*1.5,S*2.6,12),{p:[0,z*.72+S*2.2,0]}),q.tri([-S*1.3,z*.72+S*4.3,0],[S*1.3,z*.72+S*4.3,0],[0,z,0])):q.tri([-S*.45,z*.7,0],[S*.45,z*.7,0],[0,z,0]),q.geo(new r.CircleGeometry(S*2.4,10),{p:[0,-z*.22,0]}),q.col(ce).surf(_.GOLD,.85,1,0),q.geo(new r.CylinderGeometry(S*1.5,S*1.5,.25,10),{r:[Math.PI/2,0,0],p:[0,0,.1]}),q.rod([0,.2,.03],[0,z*.68,.03],S*.16,S*.1,4);const Y=new r.Mesh(q.build(),h);return Y.frustumCulled=!1,Y},N=b(o.dialR*.62,.34,!0),B=b(o.dialR*.9,.24,!1);N.position.set(0,o.dialY,T.hhd+.3),B.position.set(0,o.dialY,T.hhd+.48),d.add(N,B);const R=J(2048);R.col(ce).surf(_.GOLD,.9,1,0),R.box(0,-o.pendL/2,0,.3,o.pendL,.14),R.geo(new r.SphereGeometry(1,20,10),{p:[0,-o.pendL,0],s:[2.35,2.35,.42]});for(const z of[.8,1.45,2.05])R.geo(new r.TorusGeometry(z,.07,4,24),{p:[0,-o.pendL,.36-z*.1]});R.geo(new r.CylinderGeometry(.26,.26,.9,8),{p:[0,-o.pendL-2.7,0]});const W=new r.Mesh(R.build(),h);W.frustumCulled=!1,W.position.set(0,o.pivotY,1.25),d.add(W);const n=J(2048),v=o.doorHw*2,m={c:v/2,hw:o.doorHw,y0:0,ys:o.doorTop-o.doorHw-o.doorSill,k:1};n.col(de).surf(_.WOOD,.85,0,0);for(const z of[0,-.4])ie(n,{at:(S,j)=>[-S,j,z],u0:0,u1:v,bottom:0,top:S=>ae(S-m.c,m.hw,m.ys,1),step:.6,flip:z<0});he(n,{at3:(z,S,j)=>[-z,S,-j]},m,0,.4,18),n.col(ce).surf(_.GOLD,.8,1,0),n.tube(oe({...m,hw:m.hw*.8,ys:m.ys,y0:.9},14).map(z=>[-z[0],z[1]*.93+.2,.04]),.09,4),n.tube(oe({...m,hw:m.hw*.8,ys:m.ys,y0:.9},14).map(z=>[-z[0],z[1]*.93+.2,-.44]),.09,4);for(const z of[2,6,9.5])n.box(-.5,z,.04,1.6,.22,.08),n.box(-.5,z,-.44,1.6,.22,.08);n.geo(new r.TorusGeometry(.42,.08,5,12),{p:[-v+1,5.6,.1]});const a=new r.Mesh(n.build(),h);a.frustumCulled=!1,a.position.set(o.doorHw+.1,o.doorSill,o.baseD/2+.25),a.rotation.y=-1.92,d.add(a);const l=J(512);ie(l,{at:(z,S)=>[z,S,T.thd-.3],u0:-T.glass.hw,u1:T.glass.hw,bottom:T.glass.y0,top:z=>ae(z,T.glass.hw,T.glass.ys,T.glass.k),step:1});const p=new r.ShaderMaterial({uniforms:{...u,uRoomInv:{value:i}},vertexShader:ze,fragmentShader:Oe,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending}),C=new r.Mesh(l.build(),p);C.frustumCulled=!1,C.renderOrder=2,d.add(C),await e.yield();const H=Math.round(520*(e.quality?e.quality.detail:1)),P=new Float32Array(H*4);for(let z=0;z<H;z++){const S=t.pick([[13.6,7.9,5.2],[27.2,6.8,5.1],[40.3,8.1,5.4],[44,5,5],[41.4,8.1,5.4]]);P.set([t.range(-S[1],S[1]),S[0]+t.range(-.4,.6),S[2]-t.range(0,1.2),t()],z*4)}const x=new r.InstancedBufferGeometry;x.setAttribute("position",new r.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,-1,0,1,1,0,-1,1,0]),3)),x.setAttribute("iSeed",new r.InstancedBufferAttribute(P,4)),x.instanceCount=H;const F={uStroke:{value:0},uGain:{value:0},uTime:A.uTime,uRoomInv:{value:i},uDustCol:{value:new r.Vector3(1.5,.3,.2)}},I=new r.Mesh(x,new r.ShaderMaterial({uniforms:F,vertexShader:We,fragmentShader:Ne,transparent:!0,depthWrite:!1,blending:r.AdditiveBlending}));I.frustumCulled=!1,I.renderOrder=3,d.add(I);const E=t.range(0,o.period),G={level:w?1:0,u:w?.7:0,f:0,pulse:0,given:-1},k=z=>(z+E)/o.period,L=z=>{const S=k(z);return S-Math.floor(S)},V=s.uStrike??.6,te=new r.Vector3;return{object:d,radius:12,height:o.H,center:new r.Vector3(0,23,0),ground:!0,groundY:0,anchors:{portal:new r.Vector3(0,o.doorSill+5.8,-.8),portalWidth:8.1,portalHeight:11.3,dial:new r.Vector3(0,o.dialY,T.hhd),gaze:new r.Vector3(0,20,0)},uniforms:u,state:G,strokeAt:L,strokeX:k,strokeNo:z=>Math.floor(k(z)),setStrike(z,S=-1){G.level=z,G.given=S},setU(z){G.u=z},update(z,S,j){w&&(A.uTime.value=S);const q=G.given>=0?Math.min(G.given,1):L(S),Y=G.level;G.f=q,G.pulse=Y*Math.exp(-q*4.5)*be(0,.035,q);const Z=G.u<V?-8*(1-G.u/V):(G.u-V)*3;if(B.rotation.z=-Z/60*U+.004*Math.sin(S*U)*(1-Y),N.rotation.z=-Z/720*U,W.rotation.z=.165*Math.sin(S*U/(o.period*2)+E),a.rotation.y=-1.92+.012*G.pulse*Math.sin(S*31),c.w=.12+.9*G.pulse,te.set(0,0,o.baseD/2).applyMatrix4(d.matrixWorld).applyMatrix4(i),u.uRing.value.set(te.x,te.z,2+q*96,Y*2.4*(1-q)*(1-q)*be(0,.04,q)),F.uStroke.value=q,F.uGain.value=Y,w){const se=.86+.14*Math.sin(S*7.3)*Math.sin(S*3.1);u.uFlick.value.set(se,.9+.1*Math.sin(S*5.7+2),0,0)}},dispose(){}}}export{Me as CLOCK,Ce as FIRE,Ee as HEADS,_ as K,me as ROOM_GLSL,oe as archOutline,he as archReveal,ae as archTop,ie as archWall,_e as buildHero,ue as lin,J as makeBatch,je as makeMasquers,Re as pairGeometry,De as pairParts,He as roomMaterial,ke as roomUniforms};
