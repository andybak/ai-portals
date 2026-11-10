import*as s from"three";import{clamp as Se,lerp as he,smoothstep as Te}from"../kit/core.js";const Ce=["#F4F1E6","#2A4FA8","#B9B24A","#E58A7A","#1B2450","#3B2A20","#F2A33A"],pe=16,ne=22,G=7,V=30,ge=3,de=90,q=88,Be=0,F=1,Me=2,we=3,De=4,ke=5,Ie=6,qe=7,_e=8,Fe=9,Oe=10,ue=16;class je{constructor(e){const n=e*3;this.pos=new Float32Array(n*3),this.nor=new Float32Array(n*3),this.col=new Float32Array(n*3),this.mh=new Float32Array(n*2),this.n=0,this.max=n,this._m3=new s.Matrix3,this._v=new s.Vector3,this._c=new s.Color}add(e,n,t,d={}){const m=e.attributes.position.array,u=e.attributes.normal.array,l=m.length/3;if(this.n+l>this.max)return;const h=n.elements,v=this._m3.getNormalMatrix(n).elements,f=d.mat??Be,L=d.hinge??0,O=n.determinant()<0;for(let T=0;T<l;T++){const D=O?T%3===1?T+1:T%3===2?T-1:T:T,j=m[D*3],B=m[D*3+1],E=m[D*3+2],P=(this.n+T)*3,W=h[0]*j+h[4]*B+h[8]*E+h[12],U=h[1]*j+h[5]*B+h[9]*E+h[13],b=h[2]*j+h[6]*B+h[10]*E+h[14];this.pos[P]=W,this.pos[P+1]=U,this.pos[P+2]=b;const Z=u[D*3],I=u[D*3+1],R=u[D*3+2];let N=v[0]*Z+v[3]*I+v[6]*R,te=v[1]*Z+v[4]*I+v[7]*R,oe=v[2]*Z+v[5]*I+v[8]*R;const se=Math.hypot(N,te,oe)||1;N/=se,te/=se,oe/=se,this.nor[P]=N,this.nor[P+1]=te,this.nor[P+2]=oe;const Q=d.ao?d.ao(W,U,b):1;this.col[P]=t.r*Q,this.col[P+1]=t.g*Q,this.col[P+2]=t.b*Q;const z=(this.n+T)*2;this.mh[z]=f,this.mh[z+1]=d.wa?d.wa[D]:d.w?d.w(W,U,b):L}this.n+=l}build(){const e=new s.BufferGeometry,n=this.n;return e.setAttribute("position",new s.BufferAttribute(this.pos.slice(0,n*3),3)),e.setAttribute("normal",new s.BufferAttribute(this.nor.slice(0,n*3),3)),e.setAttribute("color",new s.BufferAttribute(this.col.slice(0,n*3),3)),e.setAttribute("aMH",new s.BufferAttribute(this.mh.slice(0,n*2),2)),e}}const d0=new s.Matrix4,Ge=new s.Quaternion,Ue=new s.Euler,Ke=new s.Vector3,Xe=new s.Vector3;function i(o,e,n,t=0,d=0,m=0,u=1,l=u,h=u){return Ge.setFromEuler(Ue.set(t,d,m)),new s.Matrix4().compose(Ke.set(o,e,n),Ge,Xe.set(u,l,h))}const ie=o=>{const e=o.index?o.toNonIndexed():o;return e!==o&&o.dispose(),e.computeVertexNormals(),e},Ze=o=>{const e=o.index?o.toNonIndexed():o;return e!==o&&o.dispose(),e};function g(o,e,n,t){t=Math.min(t,o*.45,e*.45,n*.45);const d=new s.Shape,m=o/2-t,u=e/2-t;d.moveTo(-m,-u),d.lineTo(m,-u),d.lineTo(m,u),d.lineTo(-m,u),d.closePath();const l=new s.ExtrudeGeometry(d,{depth:n-2*t,bevelEnabled:!0,bevelSize:t,bevelThickness:t,bevelSegments:1,steps:1});return l.translate(0,0,-(n-2*t)/2),ie(l)}function ye(o,e,n,t,d=0,m=7,u=!1){const l=[[-e/2,d],[e/2,d],[e/2,d+n]];for(let h=1;h<m;h++){const v=h/m;l.push([e/2*Math.cos(v*Math.PI/2)*(1-.18*Math.sin(v*Math.PI)),d+n+t*Math.pow(Math.sin(v*Math.PI/2),.85)])}l.push([0,d+n+t]);for(let h=m-1;h>=1;h--){const v=h/m;l.push([-e/2*Math.cos(v*Math.PI/2)*(1-.18*Math.sin(v*Math.PI)),d+n+t*Math.pow(Math.sin(v*Math.PI/2),.85)])}l.push([-e/2,d+n]),u&&l.reverse(),o.moveTo(l[0][0],l[0][1]);for(let h=1;h<l.length;h++)o.lineTo(l[h][0],l[h][1]);return o.closePath(),o}function me(o,e=10){return Ze(new s.LatheGeometry(o.map(n=>new s.Vector2(n[0],n[1])),e))}function He(o=8){const e=[],n=(m,u,l)=>e.push(m[0],m[1],m[2],u[0],u[1],u[2],l[0],l[1],l[2]),t=o*2;for(let m=0;m<t;m++){const u=m/t*Math.PI*2,l=(m+1)/t*Math.PI*2,h=[1,.9,.78],v=[0,.14,.02];for(let f=0;f<2;f++){const L=[Math.cos(u)*h[f],Math.sin(u)*h[f],v[f]],O=[Math.cos(l)*h[f],Math.sin(l)*h[f],v[f]],T=[Math.cos(l)*h[f+1],Math.sin(l)*h[f+1],v[f+1]],D=[Math.cos(u)*h[f+1],Math.sin(u)*h[f+1],v[f+1]];n(L,O,T),n(L,T,D)}}for(let m=0;m<o;m++){const u=m/o*Math.PI*2,l=Math.PI/o*.86,h=Math.cos(u),v=Math.sin(u),f=(B,E,P)=>[Math.cos(u+E)*B,Math.sin(u+E)*B,P],L=f(.2,0,.1),O=f(.76,0,.03),T=[h*.5,v*.5,.2],D=f(.5,l,0),j=f(.5,-l,0);n(L,j,T),n(j,O,T),n(O,D,T),n(D,L,T)}for(let m=0;m<8;m++){const u=m/8*Math.PI*2,l=(m+1)/8*Math.PI*2,h=[Math.cos(u)*.24,Math.sin(u)*.24,.05],v=[Math.cos(l)*.24,Math.sin(l)*.24,.05],f=[Math.cos(l)*.12,Math.sin(l)*.12,.22],L=[Math.cos(u)*.12,Math.sin(u)*.12,.22];n(h,v,f),n(h,f,L),n(L,f,[0,0,.27])}const d=new s.BufferGeometry;return d.setAttribute("position",new s.Float32BufferAttribute(e,3)),d.computeVertexNormals(),d}function We(o){const e=[[1,0],[1,.06],[.965,.115],[.905,.125],[.87,.1]],n=o?8:4,t=1.42;for(let u=0;u<=n;u++){const l=.06+(t-.06)*(u/n);e.push([.86*Math.cos(l),.09+.6*Math.sin(l)])}const d=me(e,o?22:12);d.rotateX(Math.PI/2);const m=me([[.13,.655],[.085,.72],[.15,.75],[.175,.805],[.14,.865],[.06,.93],[0,.985]],o?9:6);return m.rotateX(Math.PI/2),[d,m]}const Je=`
attribute vec3 color;
attribute vec2 aMH;
uniform float uTime, uDoor, uWind;
varying vec3 vCol, vN, vL, vW, vP0, vN0, vT;
varying vec2 vMH;
varying float vCD;
#include <fog_pars_vertex>
void main() {
  vec3 p = position, n = normal;
  vP0 = position; vN0 = normal; vMH = aMH; vCol = color;
  float mat = aMH.x > 15.5 ? aMH.x - 16. : aMH.x;
  vec3 an = abs(normal);
  vec3 t = an.z > max(an.x, an.y) ? vec3(1., 0., 0.) : (an.x > an.y ? vec3(0., 0., 1.) : vec3(1., 0., 0.));
  if (abs(mat - 5.) < 0.5) {
    // cloth: aMH.y is how free the vertex is (0 at the rail, 1 at the hem)
    float w = aMH.y, ph = position.x * 0.35 + position.y * 0.22;
    float g = sin(uTime * 1.3 + ph) * 0.6 + sin(uTime * 2.9 + ph * 2.3) * 0.25;
    p.z += w * (0.5 + 0.5 * g + uWind * (2.2 + 1.2 * g));
    p.x += w * 0.25 * sin(uTime * 0.9 + position.y * 0.5) * (1. + uWind);
    p.y += w * uWind * 0.8;
    n = normalize(n + vec3(0.35 * cos(uTime * 1.3 + ph) * w, 0., 0.));
  } else if (abs(mat - 4.) < 0.5) {
    // thatch: the shaggy lower edge of each tier lifts in the wind (aMH.y = 1 on that edge)
    float w = aMH.y, ph = position.x * 1.3 + position.z * 0.9;
    float g = sin(uTime * 2.6 + ph) + 0.5 * sin(uTime * 4.3 + ph * 1.7);
    p.y += w * g * (0.1 + 0.4 * uWind);
    p.xz += normal.xz * w * (0.5 + 0.5 * g) * (0.08 + 0.5 * uWind);
  } else if (abs(mat - 9.) < 0.5) {
    // a lamp flame: aMH.y / 0.45 is the height above the wick
    float h = aMH.y / 0.45, ph = position.z * 1.7;
    p.z += h * h * (0.16 * sin(uTime * 3.1 + ph) + 0.09 * sin(uTime * 7.3 + ph * 2.));
    p.y += h * 0.1 * sin(uTime * 11. + ph);
  } else if (abs(aMH.y) > 0.5) {
    // door leaf: modelled shut in the plane z = -3, swung inward about its hinge by uDoor
    float h = sign(aMH.y), a = uDoor * h, c = cos(a), s = sin(a);
    vec2 d = p.xz - vec2(8. * h, -3.);
    p.xz = vec2(8. * h, -3.) + vec2(d.x * c - d.y * s, d.x * s + d.y * c);
    n.xz = vec2(n.x * c - n.z * s, n.x * s + n.z * c);
    t.xz = vec2(t.x * c - t.z * s, t.x * s + t.z * c);
  }
  vN = n; vL = p; vT = t;
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz;
  vCD = distance(cameraPosition, wp.xyz) / max(length(modelMatrix[0].xyz), 1e-5);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Qe=`
uniform vec3 uSunDir, uSunCol, uSky, uBounce, uDoorCol, uGlowCol, uCoral, uLampCol;
uniform float uDoorStr, uGlow, uTime, uDarkK;
uniform mat4 uArchInv;
uniform vec3 uDark;
uniform vec3 uBoxMin[3];
uniform vec3 uBoxMax[3];
varying vec3 vCol, vN, vL, vW, vP0, vN0, vT;
varying vec2 vMH;
varying float vCD;
#include <fog_pars_fragment>
float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p) { return vn(p) * 0.58 + vn(p * 2.3 + 7.1) * 0.29 + vn(p * 5.1 + 3.7) * 0.13; }
// chip-carved lattice of rosettes, 0 (cut) .. 1 (proud); p in metres
float carve(vec2 p) {
  vec2 c = p / 1.45, f = fract(c) - 0.5;
  float r = length(f), a = atan(f.y, abs(f.x) + 1e-4);
  float pet = 0.5 + 0.5 * cos(a * 8.);
  float h = smoothstep(0.035, 0.1, r) * smoothstep(0.37, 0.3, r) * (0.35 + 0.65 * pet * pet);
  h += smoothstep(0.035, 0.0, abs(r - 0.415)) * 0.9;
  float d = abs(f.x) + abs(f.y);
  h += smoothstep(0.6, 0.68, d) * (0.55 + 0.45 * step(0.5, fract(d * 9.)));
  h += smoothstep(0.08, 0.02, r) * 0.9;
  return clamp(h, 0., 1.);
}
// a chain of oval links along x, each joined to the next by a link seen edge on; p in metres, 0 (ground) .. 1 (proud)
float chainH(vec2 p) {
  float f = fract(p.x / 0.62) - 0.5, v = p.y / 0.26;
  float ring = smoothstep(0.2, 0.08, abs(length(vec2(f * 2.25, v)) - 0.72));
  float bar = smoothstep(0.34, 0.2, abs(v)) * smoothstep(0.26, 0.36, abs(f));
  return max(max(ring, bar) * smoothstep(1.3, 1.05, abs(v)), 0.75 * smoothstep(0.34, 0.12, abs(abs(v) - 2.05)));
}
// the ground of a sunk door panel: a net of small lozenges, each with a cut flower
float panelH(vec2 p) {
  vec2 q = vec2(p.x + p.y, p.x - p.y) / 0.82, f = fract(q) - 0.5;
  float r = length(f), a = atan(f.y, abs(f.x) + 1e-4);
  float h = smoothstep(0.5, 0.42, max(abs(f.x), abs(f.y))) * 0.55;
  h += smoothstep(0.34, 0.26, r) * (0.25 + 0.2 * cos(a * 4.)) + smoothstep(0.1, 0.05, r) * 0.3;
  return clamp(h, 0., 1.);
}
// four-point stars pierced through shutters; 1 = hole
float stars(vec2 p) {
  vec2 f = abs(fract(p / 1.15 + vec2(0., 0.5 * floor(p.x / 1.15))) - 0.5);
  float d = sqrt(f.x) + sqrt(f.y);
  return 1. - smoothstep(0.52, 0.6, d);
}
float boxShadow(vec3 p, vec3 L) {
  vec3 Ld = mix(vec3(1e-4), L, step(vec3(1e-4), abs(L)));
  vec3 inv = 1. / Ld;
  float s = 1.;
  for (int i = 0; i < 3; i++) {
    vec3 t0 = (uBoxMin[i] - p) * inv, t1 = (uBoxMax[i] - p) * inv;
    vec3 a = min(t0, t1), b = max(t0, t1);
    float tn = max(max(a.x, a.y), max(a.z, 0.05)), tf = min(min(b.x, b.y), b.z);
    s *= 1. - 0.92 * smoothstep(0., 1.2, tf - tn);
  }
  return s;
}
void main() {
  float interior = step(15.5, vMH.x);
  float mat = vMH.x - 16. * interior;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  vec3 an = abs(vN0);
  vec2 pc = an.z > max(an.x, an.y) ? vP0.xy : (an.x > an.y ? vP0.zy : vP0.xz);
  vec3 T = normalize(vT + vec3(1e-5, 0., 0.));
  vec3 B = an.y > max(an.x, an.z) ? vec3(0., 0., 1.) : vec3(0., 1., 0.);
  vec3 L = normalize(uSunDir + vec3(0., 1e-5, 0.));
  vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-5, 0.));
  vec3 alb = vCol;
  float gloss = 0., emis = 0., thin = 0., leafAo = 1., leafSh = 1.;
  vec2 bump = vec2(0.);
  if (mat < 0.5) {            // limewashed coral plaster
    float n1 = fbm(pc * 0.33), n2 = fbm(pc * 2.3 + 5.);
    alb *= 0.82 + 0.26 * n1;
    float wallish = 1. - smoothstep(0.4, 0.7, an.y);
    float st = vn(vec2(pc.x * 1.9, pc.y * 0.07 + 3.));
    alb *= 1. - 0.13 * smoothstep(0.55, 0.95, st) * wallish * vec3(1.1, 0.95, 0.8);
    float ragp = smoothstep(0.68, 0.74, fbm(pc * 0.21 + 11.) + 0.2 * smoothstep(26., 2., vP0.y) - 0.1) * (1. - 0.85 * interior);
    float pit = vn(pc * 5.5);
    float rim = ragp * (1. - ragp) * 4.;
    alb = mix(alb, uCoral * (0.6 + 0.55 * pit), ragp * 0.66) * (1. - 0.25 * rim);
    alb *= 1. - 0.25 * smoothstep(8., 0., vP0.y) * wallish * (0.5 + 0.5 * n2);   // damp rising from the ground
    bump = (vec2(fbm(pc * 2.3 + vec2(5.12, 5.)), fbm(pc * 2.3 + vec2(5., 5.12))) - n2) * (1.2 + 3. * ragp);
    // carved plasterwork: the walls of the passage carry a frieze of rosettes between chain borders and a polished dado,
    // its floor is laid in slabs, and the reveal of the doorway is carved all over like the frame it holds
    float sideW = step(0.6, an.x), revl = (1. - interior) * sideW * step(abs(abs(vP0.x) - 8.), 0.15) * step(7.2, vP0.y) * step(vP0.y, 28.9);
    float yb = vP0.y > 18.5 ? 24.4 : 12.4;
    float fr = interior * sideW * step(abs(vP0.y - yb), 1.3) + revl;
    float tro = fbm(vec2(pc.x * 0.55 + 2. * vn(pc * 0.2), pc.y * 1.3) + 9.);       // trowel sweeps, seen in the raking light of the room ahead
    alb *= 1. - interior * (0.14 * tro - 0.06);
    // the passage walls are ruled in the wet plaster into courses of blocks, each a shade of its own, the joints cut in
    vec2 bq = vec2(pc.x / 3.3 + 0.5 * floor(pc.y / 2.05), pc.y / 2.05), bf = abs(fract(bq) - 0.5);
    float crs = interior * sideW * step(11.2, vP0.y) * (1. - step(abs(vP0.y - yb), 1.4));
    float jx = smoothstep(0.468, 0.492, bf.x), jy = smoothstep(0.45, 0.488, bf.y);
    alb *= 1. - crs * (0.34 * max(jx, jy) - 0.12 * (h21(floor(bq) + 3.7) - 0.5));
    bump += crs * vec2(jx * sign(fract(bq.x) - 0.5), jy * sign(fract(bq.y) - 0.5)) * 0.9;
    bump += interior * (vec2(fbm(vec2(pc.x * 0.55 + 0.1, pc.y * 1.3) + 9.), fbm(vec2(pc.x * 0.55, pc.y * 1.3 + 0.1) + 9.)) - fbm(vec2(pc.x * 0.55, pc.y * 1.3) + 9.)) * 1.7;
    if (fr > 0.5) {
      vec2 cq = revl > 0.5 ? vec2(pc.x + 0.05, pc.y - 7.3) : vec2(pc.x, pc.y - yb + 0.725);
      float h0 = carve(cq), hx = carve(cq + vec2(0.035, 0.)), hy = carve(cq + vec2(0., 0.035));
      float band = revl > 0.5 ? 1. : step(abs(vP0.y - yb), 0.74);
      vec2 ch = vec2(pc.x + pc.y, pc.x - pc.y) * 1.6;
      float lk = smoothstep(0.1, 0.2, abs(length(fract(ch) - 0.5) - 0.3));
      bump += mix((fract(ch) - 0.5) * (1. - lk) * 1.6, vec2(h0 - hx, h0 - hy) * 3., band);
      alb *= mix(0.78 + 0.26 * lk, 0.62 + 0.5 * h0, band);
    }
    float dado = interior * sideW * step(vP0.y, 11.1);
    alb *= 1. - dado * 0.2;
    alb = mix(alb, alb * vec3(1.02, 0.9, 0.8), dado * 0.8);
    float flr = interior * step(0.6, an.y) * step(vP0.y, 8.);
    vec2 sl = abs(fract(vec2(vP0.x / 2.667 + 0.5 * floor(vP0.z / 2.25), vP0.z / 2.25)) - 0.5);
    alb *= 1. - flr * (0.4 * smoothstep(0.46, 0.49, max(sl.x, sl.y)) + 0.16 * h21(floor(vec2(vP0.x / 2.667 + 0.5 * floor(vP0.z / 2.25), vP0.z / 2.25))) - 0.1 * smoothstep(5., 1., abs(vP0.x)));
  } else if (mat < 1.5) {     // plain wood: grain along the long way
    float g = vn(vec2(pc.x * 9., pc.y * 0.45)) * 0.6 + vn(vec2(pc.x * 23., pc.y * 1.1)) * 0.4;
    alb *= 0.7 + 0.55 * g;
    bump = vec2(g - vn(vec2(pc.x * 9. + 0.9, pc.y * 0.45)), 0.) * 0.5;
    gloss = 0.12;
  } else if (mat < 2.5) {     // chip-carved wood
    float h0 = carve(pc), hx = carve(pc + vec2(0.035, 0.)), hy = carve(pc + vec2(0., 0.035));
    bump = vec2(h0 - hx, h0 - hy) * 3.2;
    float g = vn(vec2(pc.x * 7., pc.y * 0.6));
    alb *= (0.5 + 0.8 * h0) * (0.8 + 0.4 * g);
    gloss = 0.1 + 0.45 * h0;
  } else if (mat < 3.5) {     // brass
    gloss = 1.;
  } else if (mat < 4.5) {     // thatch
    float s1 = vn(vec2(pc.x * 7., pc.y * 0.6)), s2 = vn(vec2(pc.x * 19., pc.y * 1.7));
    float lay = fract(vP0.y / 1.6 + 0.2 * vn(vec2(pc.x * 0.8, 1.)));
    alb *= (0.55 + 0.6 * s1) * (0.75 + 0.35 * s2) * (0.6 + 0.5 * lay);
    bump = vec2(s2 - 0.5, 0.) * 0.6;
  } else if (mat < 5.5) {     // cotton
    alb *= 0.9 + 0.1 * sin(pc.x * 9.);
    thin = 1.;
  } else if (mat < 6.5) {     // the dark of a window
    emis = 0.55;
  } else if (mat < 7.5) {     // lattice
    vec2 q = vec2(pc.x + pc.y, pc.x - pc.y) / 0.95;
    vec2 f = abs(fract(q) - 0.5);
    float hole = (1. - smoothstep(0.24, 0.31, f.x)) * (1. - smoothstep(0.24, 0.31, f.y));
    alb *= 0.75 + 0.4 * vn(pc * 2.);
    alb = mix(alb, alb * 0.07, hole);
    emis = hole * 0.7;
    bump = vec2(f.x - 0.25, f.y - 0.25) * 0.5 * (1. - hole);
    gloss = 0.1;
  } else if (mat < 8.5) {     // painted shutter with pierced stars and worn edges
    float hole = stars(pc);
    float worn = smoothstep(0.6, 0.72, fbm(pc * 1.1 + 2.));
    float plank = abs(fract(pc.x / 1.1) - 0.5);
    alb = mix(alb, vec3(0.2, 0.13, 0.09), worn * 0.7);
    alb *= 0.8 + 0.3 * vn(vec2(pc.x * 6., pc.y * 0.5));
    alb *= 0.7 + 0.3 * smoothstep(0.0, 0.06, 0.5 - plank);
    alb = mix(alb, vec3(0.012, 0.014, 0.03), hole);
    emis = hole * 0.5;
    gloss = 0.15 * (1. - hole);
  } else if (mat < 9.5) {     // a lamp flame
    alb = vec3(0.);
  } else {                    // a leaf of the great door: oiled hardwood. Stiles and rails stand proud (z > -2.3 when shut)
    // and carry a chain border; the sunk panels are cut in a net of flowers; each boss sits in its own shadow
    float ax = abs(vP0.x), ly = vP0.y - 7.15, face = step(0.7, an.z), proud = step(-2.3, vP0.z);
    float g = vn(vec2(ax * 8., ly * 0.35)) * 0.6 + vn(vec2(ax * 21., ly * 0.9)) * 0.4;
    alb *= 0.6 + 0.6 * g;
    bump = vec2(g - vn(vec2(ax * 8. + 0.8, ly * 0.35)), 0.) * 0.35;
    gloss = 0.3;
    float rd = (fract((ly - 0.75) / 5.05 + 0.5) - 0.5) * 5.05;                 // height above the nearest rail's centre line
    float onStile = step(ax, 0.72) + step(7.28, ax);
    vec2 cp = onStile > 0.5 ? vec2(ly, ax < 4. ? ax - 0.41 : ax - 7.59) : vec2(ax, rd);
    float h0 = chainH(cp), hx = chainH(cp + vec2(0.03, 0.)), hy = chainH(cp + vec2(0., 0.03));
    float sx = vP0.x < 0. ? -1. : 1.;
    vec2 cb = onStile > 0.5 ? vec2(sx * (h0 - hy), h0 - hx) : vec2(sx * (h0 - hx), h0 - hy);
    vec2 pp = vec2(ax, ly);
    float p0 = panelH(pp), px = panelH(pp + vec2(0.03, 0.)), py = panelH(pp + vec2(0., 0.03));
    // the boss this point is nearest to, its contact shade and the shadow it throws toward the hinge, away from the room's light
    vec2 bc = vec2(clamp(floor((ax - 0.525) / 2.25), 0., 2.) * 2.25 + 1.65, clamp(floor((ly - 0.75) / 5.05), 0., 3.) * 5.05 + 3.275);
    vec2 bd = pp - bc; float br = length(bd);
    float seat = smoothstep(1.02, 0.9, br);                                      // a plain turned seat under each dome
    float pan = (1. - proud) * face;
    bump += face * mix(cb * 3.4 * proud, vec2(sx * (p0 - px), p0 - py) * 3. * (1. - seat), pan);
    alb *= mix(1., mix(0.62 + 0.55 * h0, (0.5 + 0.75 * p0) * (1. - seat) + seat * 0.8, pan), face);
    gloss += face * mix(0.35 * h0, 0.3 * p0, pan);
    float edge = min(min(abs(rd) - 0.75, ax - 0.72), 7.28 - ax);                 // distance into the sunk panel from its frame
    leafAo = mix(1., (1. - 0.62 * smoothstep(1.6, 0.86, br)) * (0.55 + 0.45 * smoothstep(0., 0.5, edge)), pan);
    leafSh = mix(1., 1. - 0.8 * smoothstep(1.0, 0.45, length((bd - vec2(1.25, -0.12)) / vec2(1.55, 0.8))), pan);
  }
  N = normalize(N + T * bump.x + B * bump.y);
  float ndl = dot(N, L);
  vec3 amb = mix(uBounce, uSky, 0.5 + 0.5 * N.y);
  vec3 lit;
  float sh = 0.;
  // the open leaves stand inside the passage: light them as the passage is lit
  float inside = max(interior, smoothstep(-3.05, -3.6, vL.z) * step(abs(vL.x), 8.4) * step(vL.y, 29.5) * step(6.5, vL.y));
  // the light of the room ahead, as it falls on whatever stands in the passage: low, from the far end, a little from the middle
  vec3 Lk = normalize(vec3(-sign(vL.x) * 0.42, 0.14, -1.));
  float flick = 0.86 + 0.09 * sin(uTime * 0.9) + 0.05 * sin(uTime * 2.3 + 1.);
  // rippling as the room's curtains and the sea move
  float rip = 0.72 + 0.56 * vn(vec2(vL.z * 0.33 + uTime * 0.8, vL.y * 0.3 + vL.x * 0.2 - uTime * 0.35));
  float leaf = step(0.5, abs(vMH.y)) * (step(mat, 3.5) + step(9.5, mat));
  vec3 key = uDoorCol * uDoorStr * flick * rip, nl = vec3(0.);
  float rk = max(dot(N, Lk), 0.);
  if (inside > 0.5) {
    float zf = clamp(-vL.z / 30., 0., 1.);
    vec3 front = (uSky * 0.95 + uSunCol * 0.1) * exp(-zf * 6.) * clamp(0.55 + 0.8 * N.z, 0.08, 1.2) + uBounce * 0.5 * exp(-zf * 12.) + uDoorCol * uDoorStr * 0.04;
    // walls, floor and benches take the room's light at a rake, so trowel marks and carving stand out; the stretch of wall
    // beside the eye falls back into shade
    float nearK = 0.08 + 0.92 * smoothstep(5., 28., vCD);
    vec3 back = key * 1.05 * exp(-(1. - zf) * 2.5) * clamp(0.2 + 1.5 * rk + 0.38 * max(N.y, 0.), 0.1, 1.6) * (0.62 + 0.38 * smoothstep(30., 14., vL.y)) * nearK;
    // the four lamps in the wall niches: each lights a couple of metres of plaster and leaves the rest to the doors
    for (int i = 0; i < 2; i++) {
      vec3 tl = vec3(sign(vL.x) * 8.47, 16.9, i == 0 ? -13.5 : -25.5) - vL;
      float d2 = dot(tl, tl), fk = 0.84 + 0.1 * sin(uTime * 9.1 + float(i) * 2.3 + sign(vL.x)) + 0.06 * sin(uTime * 15.7 + float(i) * 4.1);
      nl += uLampCol * fk * (max(dot(N, tl * inversesqrt(max(d2, 0.01))), 0.) * 0.75 + 0.25) * (0.8 / (1. + d2 * 0.5) + 1.9 * exp(-d2 * 0.7));
    }
    // the leaves are dark oiled wood: the room ahead is their key light, raking along them so that every rail, link and cut
    // flower has a lit side and each boss throws its shadow; the daylight behind us only fills the near sides
    vec3 fill = (uSky * 0.8 + uSunCol * 0.1) * exp(-zf * 2.6) * clamp(0.32 + 0.9 * N.z, 0.05, 1.2);
    // (the niche lamps count for more on them when the room ahead is dim: by moonlight the wood is still seen to be wood)
    float lampK = 0.15 + 0.55 * smoothstep(1.25, 0.3, dot(uDoorCol, vec3(0.21, 0.72, 0.07)) * uDoorStr);
    vec3 leafLit = key * (0.1 + 1.5 * rk * leafSh) * leafAo + (fill + uLampCol * lampK * (0.45 + 0.55 * rk)) * leafAo + nl * 0.6;
    // the timber overhead takes a little of the lit floor and of the niche lamps, thrown up: the passage has a roof, not a void
    float topK = interior * step(0.5, mat) * step(mat, 2.5) * smoothstep(25.5, 27.5, vL.y);
    vec3 roof = (key * (0.06 + 0.2 * exp(-(1. - zf) * 2.)) + uLampCol * 0.17 + uSky * 0.15 * exp(-zf * 4.)) * (0.45 + 0.55 * max(-N.y, 0.)) * topK;
    lit = mix(front + back + uSky * 0.012 + nl + roof, leafLit, leaf);
  } else {
    sh = boxShadow(vL + N * 0.35, L);
    // the doorway and its frame take the sun as if it stood in front of the house, so both jambs are lit alike,
    // and the light of the room behind spills onto their inner faces
    float dzone = step(abs(vL.x), 13.6) * step(5.5, vL.y) * step(vL.y, 37.) * step(vL.z, 3.2);
    vec3 Ld = normalize(vec3(-sign(vL.x) * 0.45, max(L.y, 0.25), max(abs(L.z), 0.6)));
    ndl = mix(ndl, dot(N, Ld), dzone);
    float d = mix(max(ndl, 0.), abs(ndl) * 0.6 + 0.25, thin);
    // cloud and curtain shade drifting over the front
    float dap = 0.58 + 0.42 * smoothstep(0.25, 0.75, vn(vL.xy * 0.045 + vec2(uTime * 0.2, uTime * 0.07)));
    lit = uSunCol * d * mix(sh, 0.6 + 0.4 * sh, dzone) * dap * mix(1., 0.8, dzone) + amb * (0.78 + 0.22 * dap) + dzone * uDoorCol * uDoorStr * 0.2 * (abs(N.x) * 0.8 + 0.2);
  }
  vec3 col = alb * lit;
  // gloss: a tinted highlight and, on brass, the surroundings
  vec3 Hh = normalize(L + V + vec3(0., 1e-5, 0.));
  float brass = step(0.99, gloss);
  float sp = pow(max(dot(N, Hh), 0.), mix(12., 48., brass)) * sh * step(0., ndl);
  vec3 R = reflect(-V, N);
  float zfc = clamp(-vL.z / 30., 0., 1.);
  // polished brass is a mirror of where it stands. In the open: sky above, ground below, the sun's glare.
  vec3 envOut = mix(uBounce, uSky, smoothstep(-0.4, 0.6, R.y)) * mix(0.45, 1.3, smoothstep(-0.5, 0.8, R.y)) + uSunCol * 0.25 * smoothstep(0.5, 0.95, dot(R, L)) * sh;
  // In the passage: the bright room ahead (one soft band of its colour), the dim day behind, the dark ceiling and the floor,
  // and the niche lamps as small warm glints. All smooth: a dome shows one clean gradient, not a pattern.
  float toRoom = smoothstep(0.1, 0.92, -R.z), up = smoothstep(-0.75, 0.3, R.y);
  vec3 envIn = key * (1.25 * toRoom * toRoom + 0.1) * mix(0.3, 1., up) + uSky * 0.85 * smoothstep(0.15, 0.9, R.z) * exp(-zfc * 2.6) * mix(0.4, 1., up) + uLampCol * 0.07;
  for (int i = 0; i < 4; i++) {
    vec3 tl = vec3((i < 2 ? 8.47 : -8.47), 17.4, (i == 0 || i == 2) ? -13.5 : -25.5) - vL;
    float rl = max(dot(R, tl * inversesqrt(max(dot(tl, tl), 0.01))), 0.), rl2 = rl * rl, rl8 = rl2 * rl2 * rl2 * rl2;
    envIn += uLampCol * (1.5 * pow(rl, 70.) + 0.5 * rl8 / (1. + 0.25 * dot(tl, tl))) * inside * brass;
  }
  vec3 tintB = mix(vCol, vec3(0.92, 0.8, 0.52), 0.3);
  // the underside of every dome and knob sits in its own shade
  float under = 0.42 + 0.58 * smoothstep(-0.8, 0.35, N.y);
  col = mix(col, mix(vCol * (envOut * 1.25 + lit * 0.3), tintB * (envIn * 1.2 + lit * 0.1) * under, inside), brass * 0.88);
  // one crisp highlight in the colour of the room ahead, with a soft bloom of it round it
  // (it stands on the upper shoulder of each dome, clear of the finial, where a mirror would show the room's brightest thing)
  vec3 Hs = normalize(normalize(vec3(-sign(vL.x) * 0.1, 0.62, -0.78)) + V + vec3(0., 1e-5, 0.));
  float nds = max(dot(N, Hs), 0.), nds8 = nds * nds * nds * nds; nds8 *= nds8;
  float hot = pow(nds8, 9.) * 5.2 + nds8 * nds8 * 0.55;
  col += inside * brass * mix(uDoorCol, vec3(1.), 0.22) * uDoorStr * flick * hot;
  vec3 Hk = normalize(Lk + V + vec3(0., 1e-5, 0.));
  float ndh = max(dot(N, Hk), 0.), ndh8 = ndh * ndh * ndh * ndh; ndh8 *= ndh8;
  // oiled wood takes a low sheen from the same light
  col += inside * leaf * (1. - brass) * key * (0.5 + 0.5 * alb / max(max(alb.r, alb.g), max(alb.b, 0.02))) * ndh8 * ndh * gloss * 0.3 * leafSh * leafAo;
  col += uSunCol * sp * gloss * mix(vec3(0.35), vCol * 4., brass) * (1. - inside * leaf);
  // lamplight behind lattice, stars and windows after dark
  col += uGlowCol * uGlow * emis * (0.8 + 0.2 * sin(uTime * 2.3 + vP0.x * 0.7) * sin(uTime * 3.7 + vP0.y));
  // a flame: white-gold at the wick, amber at the tip, soft at its edge
  float fh = clamp(vMH.y / 0.45, 0., 1.), fe = max(dot(N, V), 0.);
  col += step(8.5, mat) * step(mat, 9.5) * uLampCol * mix(vec3(2.6, 2.5, 2.1), vec3(1.5, 0.8, 0.3), smoothstep(0.1, 0.95, fh)) * (0.5 + 0.5 * fe) * (0.85 + 0.15 * sin(uTime * 11. + vP0.z));
  // The dark behind the arch (a world that stands this house behind an arch sets uDarkK, uDark and uArchInv; otherwise nothing).
  // uArchInv takes a world point into the room whose arch it is: the opening is 20 m wide from a sill at 8 to a crown at 36 in
  // the wall's face z = -110. Whatever of the front is further than the 20 m gap from that opening goes into the dark by its
  // metres, wholly at 65 m (the eaves of the thatch); the passage and the open leaves are inside the house and keep their light.
  vec3 ap = (uArchInv * vec4(vW, 1.)).xyz;
  float ad = length(vec3(max(abs(ap.x) - 10., 0.), max(ap.y - 36., 0.) + max(8. - ap.y, 0.), max(-110. - ap.z, 0.)));
  col = mix(col, uDark, smoothstep(20., 65., ad) * (1. - step(0.5, inside)) * uDarkK);
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,$e=`
varying vec2 vUv;
#include <fog_pars_vertex>
void main() { vUv = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Ye=`
uniform vec3 uDoorCol, uShade, uNext, uChina;
uniform float uDoorStr, uTime, uAlpha;
varying vec2 vUv;
#include <fog_pars_fragment>
float h11(float x) { return fract(sin(x * 91.7) * 4375.5); }
void main() {
  // wall coordinates in metres of the room behind: x -35..35, y 0..44, seen at scale 0.27 about eye height 18
  vec2 w = vec2((vUv.x - 0.5) * 16., vUv.y * 22. + 7. - 18.) / 0.27 + vec2(0., 18.);
  float flick = 0.86 + 0.09 * sin(uTime * 0.9) + 0.05 * sin(uTime * 2.3 + 1.);
  float cur = 0.75 + 0.25 * smoothstep(-6., 6., w.x - 14. - 9. * sin(uTime * 0.6));     // a curtain's shadow sliding in
  vec3 wall = uDoorCol * (0.66 + 0.2 * smoothstep(0., 44., w.y)) * cur;
  // tiers of niches
  vec2 cell = vec2(5.8, 7.4), id = floor((w - vec2(0., 3.)) / cell), f = fract((w - vec2(0., 3.)) / cell) - 0.5;
  float nw = 0.3 + 0.08 * h11(id.x + id.y * 7.), top = 0.28 - (f.x * f.x) * 2.2;
  float niche = step(abs(f.x), nw) * step(-0.3, f.y) * step(f.y, top);
  float china = niche * smoothstep(0.17, 0.12, length(vec2(f.x, (f.y + 0.14) * 1.25))) * step(0.3, h11(id.x * 3. + id.y));
  // the central arch, dark, and the speck in it
  float ah = 26. - 0.07 * w.x * w.x + step(abs(w.x), 10.) * 2. * (1. - abs(w.x) / 10.);
  float arch = step(abs(w.x), 10.) * step(8., w.y) * step(w.y, 8. + ah);
  float inWall = step(abs(w.x), 35.) * step(0., w.y) * step(w.y, 44.);
  vec3 col = wall;
  col = mix(col, uShade * 0.5 + uDoorCol * 0.12, niche * (1. - arch));
  col = mix(col, uChina, china * (1. - arch) * 0.9);
  col = mix(col, uShade * 0.06, arch);
  vec2 m = (w - vec2(0., 8.)) / vec2(2.8, 6.9);
  float model = step(abs(m.x), 1.) * step(0., m.y) * step(m.y, 0.82 + 0.18 * (1. - abs(m.x)));
  col = mix(col, uDoorCol * 0.55, model);
  col = mix(col, uNext * 2.2, step(abs(m.x), 0.2) * step(0.08, m.y) * step(m.y, 0.3));
  // floor with a pool of light, ceiling in shade
  float fl = step(w.y, 0.);
  vec3 floorc = uDoorCol * (0.42 + 0.5 * smoothstep(0.0, 1., 1. - abs(w.x * 0.03 + w.y * 0.05 + 0.6))) * (0.8 + 0.2 * sin(w.x * 1.4));
  col = mix(col, floorc, fl);
  col = mix(col, uShade * 0.2 + uDoorCol * 0.05, step(44., w.y));
  col = mix(uShade * 0.12, col, max(inWall, max(fl, step(44., w.y))) );
  vec2 mp = vUv * vec2(16., 22.) * 1.6 + vec2(uTime * 0.11, -uTime * 0.07);
  float mote = step(0.985, h11(floor(mp.x) + floor(mp.y) * 57.)) * smoothstep(0.35, 0.1, length(fract(mp) - 0.5)) * (0.5 + 0.5 * sin(uTime * 1.7 + floor(mp.x)));
  col += uDoorCol * mote * 0.5;
  gl_FragColor = vec4(col * uDoorStr * flick, uAlpha);
  #include <fog_fragment>
}`;function le(o,e,n,t){const d=new s.BufferGeometry;return d.setAttribute("position",new s.Float32BufferAttribute([...o,...e,...n,...o,...n,...t],3)),d.computeVertexNormals(),d}const re=new s.Matrix4,p=(o,e,n=.08)=>o.clone().multiplyScalar(1+(e()-.5)*2*n);function e0(o){const e=[];e.push({x:-29,y:13,w:6.5,hs:7,rise:2.6,kind:"bars"},{x:29,y:13,w:6.5,hs:7,rise:2.6,kind:"bars"}),e.push({x:-30,y:40,w:9,hs:11,rise:4,kind:"shut"},{x:30,y:40,w:9,hs:11,rise:4,kind:"shut"}),e.push({x:0,y:38,w:10,hs:13,rise:4,kind:"balcony"});const n=o.upperWin,t=n===3?27:16,d=n===3?9:7.5;for(let m=0;m<n;m++)e.push({x:(m-(n-1)/2)*t,y:66,w:d,hs:9.5,rise:3.6,kind:m%2===(n===3?1:0)?"curtain":"shut"});return e}async function o0(o,e,n,t,d,m,u){const l=new s.Shape;l.moveTo(-de/2,0),l.lineTo(de/2,0),l.lineTo(de/2,q),l.lineTo(-de/2,q),l.closePath();const h=new s.Path;h.moveTo(-pe/2,G),h.lineTo(-pe/2,G+ne),h.lineTo(pe/2,G+ne),h.lineTo(pe/2,G),h.closePath(),l.holes.push(h);for(const a of d){const c=new s.Path;ye(c,a.w,a.hs,a.rise,a.y,6,!0),c.currentPoint.set(0,0);for(const y of c.curves)y.v1.x+=a.x,y.v2.x+=a.x;l.holes.push(c)}const v=ie(new s.ExtrudeGeometry(l,{depth:ge,bevelEnabled:!1,curveSegments:1}));await u(),v.translate(0,0,-ge),o.add(v,re,e.lime,{ao:(a,c,y)=>y<-.2?.62:1}),v.dispose(),await u();for(const a of d){await u(),o.add(le([a.x-a.w/2-.2,a.y-.2,-2.7],[a.x+a.w/2+.2,a.y-.2,-2.7],[a.x+a.w/2+.2,a.y+a.hs+a.rise+.2,-2.7],[a.x-a.w/2-.2,a.y+a.hs+a.rise+.2,-2.7]),re,e.void,{mat:Ie});const c=new s.Shape;ye(c,a.w+2.4,a.hs+.6,a.rise+1.3,0,6);const y=new s.Path;ye(y,a.w+.1,a.hs+.1,a.rise,.5,6,!0),c.holes.push(y);const S=ie(new s.ExtrudeGeometry(c,{depth:.35,bevelEnabled:!0,bevelSize:.22,bevelThickness:.3,bevelSegments:1,curveSegments:1}));o.add(S,i(a.x,a.y-.6,.05),p(e.lime,t,.04).multiplyScalar(1.04)),S.dispose();const M=g(a.w+3.4,.9,2,.25);o.add(M,i(a.x,a.y-.75,.9),p(e.stone,t)),M.dispose();const A=g(.9,1.6,1.3,.3);for(const w of[-1,1])o.add(A,i(a.x+w*(a.w/2+.6),a.y-1.9,.55),p(e.stone,t));A.dispose()}await u();const f=g(33,4.2,8.6,.5),L=g(33,2.8,5,.45),O=g(33.8,.6,5.6,.2);for(const a of[-1,1])o.add(f,i(a*28,2.1,4.3),p(e.stone,t,.05)),o.add(L,i(a*28,5.6,2.5),p(e.lime,t,.05)),o.add(O,i(a*28,7.2,2.7),p(e.stone,t,.05).multiplyScalar(1.05));f.dispose(),L.dispose(),O.dispose();for(let a=0;a<7;a++){const c=g(22.4-a*.25,1,1.5+(a===6?1.2:0),.18);if(o.add(c,i(0,a+.5,9-a*1.3-(a===6?.2:0)),p(a%2?e.stone:e.lime,t,.06)),c.dispose(),a<6){const y=g(22,1,9-a*1.3-.6,.1);o.add(y,i(0,a+.5,(9-a*1.3-.6)/2),e.stone),y.dispose()}}await u();const T=g(de+1.6,1.5,1.4,.35),D=g(de+.8,.7,.9,.2);for(const a of[33.5,61.5])o.add(T,i(0,a,.4),p(e.stone,t,.04)),o.add(D,i(0,a-1.4,.3),p(e.lime,t,.04));o.add(T,i(0,q-.9,.7,0,0,0,1.02,1.3,1.6),p(e.stone,t,.04)),T.dispose(),D.dispose();const j=g(3.4,q-7,.9,.3);for(const a of[-1,1])o.add(j,i(a*43.2,7+(q-7)/2,.3),p(e.lime,t,.03).multiplyScalar(1.03));j.dispose(),await u();const B=(a,c,y,S)=>{const M=Math.hypot(y-a,S-c),A=g(M+2,4.2,2,.3);o.add(A,i((a+y)/2,q+2.1,(c+S)/2,0,Math.atan2(-(S-c),y-a)),p(e.lime,t,.04)),A.dispose()};B(-44,-1,44,-1),B(-44,-V+1,44,-V+1),B(-44,-1,-44,-V+1),B(44,-1,44,-V+1);const E=[g(5.2,1.5,2.2,.25),g(3.5,1.4,2,.25),g(1.8,1.4,1.8,.25)],P=ie(new s.ConeGeometry(2.3,4.2,4,1));P.rotateY(Math.PI/4);const W=(a,c,y)=>{const S=p(e.lime,t,.06);if(n.merlon===0)for(let M=0;M<3;M++)o.add(E[M],i(a,q+4.9+M*1.4,c,0,y),S);else o.add(E[0],i(a,q+4.9,c,0,y),S),o.add(P,i(a,q+7.6,c,0,y,0,1,1,.42),S)};for(let a=0;a<12;a++)W(-41.25+a*7.5,-1,0);for(let a=0;a<4;a++)for(const c of[-1,1])W(c*44,-5.5-a*6.4,Math.PI/2);E.forEach(a=>a.dispose()),P.dispose(),await u(),o.add(le([-45,q,0],[45,q,0],[45,q,-V],[-45,q,-V]),re,e.stone.clone().multiplyScalar(.9)),n.plinth&&(o.add(le([-de/2,0,12],[de/2,0,12],[de/2,0,0],[-de/2,0,0]),re,e.stone.clone().multiplyScalar(.88)),o.add(le([-de/2,-70,12],[de/2,-70,12],[de/2,0,12],[-de/2,0,12]),re,e.stone.clone().multiplyScalar(.8),{ao:(a,c)=>.35+.65*Te(-40,0,c)})),n.back&&(o.add(le([45,0,0],[45,0,-V],[45,q,-V],[45,q,0]),re,e.lime.clone().multiplyScalar(.96)),o.add(le([-45,0,-V],[-45,0,0],[-45,q,0],[-45,q,-V]),re,e.lime.clone().multiplyScalar(.96)),o.add(le([45,0,-V],[8,0,-V],[8,q,-V],[45,q,-V]),re,e.lime),o.add(le([-8,0,-V],[-45,0,-V],[-45,q,-V],[-8,q,-V]),re,e.lime),o.add(le([8,G+ne,-V],[-8,G+ne,-V],[-8,q,-V],[8,q,-V]),re,e.lime),o.add(le([8,0,-V],[-8,0,-V],[-8,G,-V],[8,G,-V]),re,e.lime)),await u();const U={mat:Be+ue},b=pe/2,Z=G,I=G+ne,R=-ge,N=-V;o.add(le([-b,Z,R],[b,Z,R],[b,Z,N],[-b,Z,N]),re,e.stone,U),o.add(le([-b,I,N],[b,I,N],[b,I,R],[-b,I,R]),re,e.wood.clone().multiplyScalar(.7),{mat:F+ue});const te=(a,c,y,S,M,A=6)=>{const w=[[S-a/2,M],[S+a/2,M],[S+a/2,M+c]];for(let _=1;_<A;_++){const ae=_/A;w.push([S+a/2*Math.cos(ae*Math.PI/2)*(1-.18*Math.sin(ae*Math.PI)),M+c+y*Math.pow(Math.sin(ae*Math.PI/2),.85)])}w.push([S,M+c+y]);for(let _=A-1;_>=1;_--){const ae=_/A;w.push([S-a/2*Math.cos(ae*Math.PI/2)*(1-.18*Math.sin(ae*Math.PI)),M+c+y*Math.pow(Math.sin(ae*Math.PI/2),.85)])}return w.push([S-a/2,M+c]),w.map(_=>new s.Vector2(_[0],_[1]))},oe=t0,se=3,Q=3.3,z=2,r=Z+a0,k=1,C=me([[0,0],[.6,.05],[.25,.3],[.7,.8],[.8,1.3],[.45,1.8],[.2,2],[.3,2.3],[0,2.5]],8),K=me([[0,0],[.5,0],[.6,.15],[.35,.55],[.3,.9],[.62,1.4],[.7,1.8],[.4,2.3],[.2,2.6],[.3,2.8],[0,2.9]],8),$=me([[0,0],[.2,.18],[.24,.4],[.14,.8],[0,1.2]],6),Y=me([[0,0],[.5,0],[.9,.6],[1,1.2],[.8,1.8],[.5,2.1],[.62,2.3],[.5,2.35],[0,2.2]],9),x=g(1.7,2.6,16.5,.3),J=g(1.5,.35,5.2,.15),ee=new s.Shape(te(se+1.2,Q+.35,z+.6,0,-.35,5));ee.holes.push(new s.Path(te(se,Q,z,0,0,5)));const ce=ie(new s.ExtrudeGeometry(ee,{depth:.16,bevelEnabled:!0,bevelSize:.1,bevelThickness:.14,bevelSegments:1,curveSegments:1}));for(const a of[-1,1]){await u();const c=a>0?N:-R,y=a>0?R:-N,S=new s.Shape([[c,Z],[y,Z],[y,I],[c,I]].map(A=>new s.Vector2(A[0],A[1])));for(const A of oe)S.holes.push(new s.Path(te(se,Q,z,a>0?A:-A,r)));const M=ie(new s.ExtrudeGeometry(S,{depth:k,bevelEnabled:!1,curveSegments:1}));o.add(M,i(a*(b+k),0,0,0,-a*Math.PI/2,0),e.lime,{...U,ao:A=>Math.abs(A)>b+.05?.78:1}),M.dispose(),await u(),o.add(x,i(a*(b-.85),Z+1.3,-20.6),p(e.stone,t,.05),U),o.add(J,i(a*(b-.85),Z+2.75,-17.2-(a>0?0:6.4)),a>0?e.kanga.clone().multiplyScalar(.8):e.blue.clone().multiplyScalar(.9),{mat:ke+ue,w:()=>0}),o.add(Y,i(a*(b-.9),Z+2.6,a>0?-26.6:-14.4,0,0,0,.8),p(e.clay,t,.1),U);for(let A=0;A<3;A++){const w=oe[A],_=-a*Math.PI/2;o.add(ce,i(a*(b-.02),r,w,0,_),p(e.lime,t,.05).multiplyScalar(1.04),U);const ae=a>0?le([b+k-.02,r-.2,w+1.7],[b+k-.02,r+5.6,w+1.7],[b+k-.02,r+5.6,w-1.7],[b+k-.02,r-.2,w-1.7]):le([-b-k+.02,r-.2,w-1.7],[-b-k+.02,r+5.6,w-1.7],[-b-k+.02,r+5.6,w+1.7],[-b-k+.02,r-.2,w+1.7]);o.add(ae,re,e.lime.clone().lerp(e.clay,.3).multiplyScalar(.85),U),ae.dispose(),A===1?o.add(K,i(a*(b+.47),r,w,0,0,0,.65),p(e.brass,t,.08),{mat:we+ue}):(o.add(C,i(a*(b+.47),r,w,0,0,0,.6),p(e.brass,t,.08),{mat:we+ue}),o.add($,i(a*(b+.47),r+1.4,w,0,0,0,.4,.62,.4),e.flame,{mat:Fe+ue,w:(xe,be)=>Se((be-r-1.4)/.75,0,1)*.45}))}}x.dispose(),J.dispose(),ce.dispose(),C.dispose(),K.dispose(),$.dispose(),Y.dispose(),await u();const fe=ie(new s.CylinderGeometry(.42,.5,pe,6,1,!0)),H=Math.round(17*m);for(let a=0;a<H;a++)o.add(fe,i(0,I-.5,R-1-(a+.5)*((V-ge-1)/H),0,0,Math.PI/2+(t()-.5)*.03),p(e.wood,t,.25),{mat:F+ue});fe.dispose();const X=g(.9,1.1,V-ge,.2);for(const a of[-1,1])o.add(X,i(a*(b-.5),I-1.3,(R+N)/2),p(e.wood,t,.1),{mat:Me+ue});X.dispose()}const t0=[-13.5,-19.5,-25.5],a0=8;async function s0(o,e,n,t,d){const u=pe/2,l=G+ne,h=He(8),v=He(12),f=We(!1),L=ie(new s.CylinderGeometry(.42,.42,ne+.4,6,1)),O=g(1.45*2,ne-.25,1.3,.1);for(const c of[-1,1]){o.add(L,i(c*(u+.33),G+ne/2,1.05),p(e.wood,t,.1).multiplyScalar(1.15),{mat:F}),o.add(O,i(c*(u+.7+1.45),G+.25+(ne-.25)/2,.75),e.wood,{mat:Me}),o.add(L,i(c*(u+.7+1.45*2+.3),G+ne/2,1,0,0,0,1.1,1,1.1),p(e.wood,t,.1),{mat:F});for(const y of[G+1.7,l-1.6]){const S=g(3.1,3.1,.5,.2);o.add(S,i(c*(u+.7+1.45),y,1.5),p(e.wood,t,.08).multiplyScalar(1.1),{mat:F}),S.dispose(),o.add(h,i(c*(u+.7+1.45),y,1.72,0,0,0,1.4,1.4,1.5),p(e.wood,t,.08).multiplyScalar(1.35),{mat:F})}}L.dispose(),O.dispose();const T=1.45*16,D=g(T,1.45*4,1.5,.12);o.add(D,i(0,l+1.45*2,.85),e.wood,{mat:Me}),D.dispose();const j=g(T-3.2,1.45*2.4,.5,.2);o.add(j,i(0,l+1.45*2,1.75),p(e.wood,t,.06).multiplyScalar(1.12),{mat:F}),j.dispose();const B=n.rosettes,E=(T-3.2)/B;for(let c=0;c<B;c++){const y=(c-(B-1)/2)*E,S=c===(B-1)/2;if(o.add(S?v:h,i(y,l+1.45*2,2,0,0,c*.37%.6,S?1.72:1.42,S?1.72:1.42,1.7),p(e.wood,t,.08).multiplyScalar(S?1.5:1.3),{mat:F}),c<B-1){const M=i(y+E/2,l+2.9,2,0,0,0,.42,.42,.46),A=p(e.brass,t,.1);for(const w of f)o.add(w,M,A,{mat:we})}}const P=ie(new s.CylinderGeometry(.42,.42,T+1.2,6,1));P.rotateZ(Math.PI/2),o.add(P,i(0,l+.15,1.2),p(e.wood,t,.1).multiplyScalar(1.15),{mat:F}),o.add(P,i(0,l+1.45*4+.2,1.1),p(e.wood,t,.1),{mat:F}),P.dispose(),await d();const W=g(pe+6.4,.6,3.6,.2);o.add(W,i(0,G-.05,-.2),p(e.stone,t,.04).multiplyScalar(.9)),W.dispose(),await d();const U=g(3.6,30,1.7,.3),b=g(1.5,31.4,1,.25),Z=g(4.6,2.2,2.4,.35),I=u+.7+1.45*2+.75+1.8;for(const c of[-1,1])o.add(U,i(c*I,G+15,.6),p(e.lime,t,.03).multiplyScalar(1.03)),o.add(b,i(c*(I+2.5),G+15.7,.35),p(e.stone,t,.04)),o.add(Z,i(c*I,G+1.1,.8),p(e.stone,t,.04)),o.add(Z,i(c*I,G+28.9,.8),p(e.stone,t,.04));U.dispose(),b.dispose(),Z.dispose();const R=l+1.45*4+1.5,N=g(2*I+7.5,1.9,3.6,.4),te=g(2*I+4,1.1,2.6,.3),oe=g(.9,.9,1,.15);o.add(N,i(0,R,1.5),p(e.stone,t,.03).multiplyScalar(1.05)),o.add(te,i(0,R+1.45,1.1),p(e.lime,t,.03));for(let c=-11;c<=11;c++)o.add(oe,i(c*1.55,R-1.35,2.1),p(e.lime,t,.06));N.dispose(),te.dispose(),oe.dispose(),await d();const se=ie(new s.TorusGeometry(.5,.16,4,8)),Q=e.stone.clone().multiplyScalar(1.12),z=(c,y,S,M)=>{const A=Math.hypot(S-c,M-y),w=Math.round(A/1.05),_=Math.atan2(M-y,S-c);for(let ae=0;ae<w;ae++){const xe=(ae+.5)/w,be=he(c,S,xe),Pe=he(y,M,xe),ve=new s.Matrix4;ve.multiply(i(be,Pe,1.52,0,0,_)).multiply(i(0,0,0,ae%2?Math.PI/2:0,0,0,1.3,.9,1)),o.add(se,ve,p(Q,t,.07))}};z(-I,G+2.6,-I,G+27.4),z(I,G+2.6,I,G+27.4),se.dispose(),await d();const r=ue,k=t.fork("door-leaves");for(let c=0;c<41;c++)t();const C=G+.15,K=ne-.3,$=Oe+r,Y=g(7.8,K,.5,.12),x=g(.62,K,.85,.17),J=g(6.56,1.5,.8,.17),ee=g(6.5,.2,.3,.09),[ce,fe]=We(!0);for(const c of[-1,1]){const y={hinge:c},S=p(e.leafWood,k,.05);o.add(Y,i(c*4,C+K/2,-2.75),S.clone().multiplyScalar(.86),{...y,mat:$});for(const M of[.41,7.59])o.add(x,i(c*M,C+K/2,-2.575),p(S,k,.05),{...y,mat:$});for(let M=0;M<5;M++){const A=C+.75+M*5.05;if(o.add(J,i(c*4,A,-2.56),p(S,k,.06),{...y,mat:$}),M<4&&o.add(ee,i(c*4,A+.9,-2.42),S.clone().multiplyScalar(1.12),{...y,mat:F+r}),M>0&&o.add(ee,i(c*4,A-.9,-2.42),S.clone().multiplyScalar(1.12),{...y,mat:F+r}),M>0&&M<4)for(let w=0;w<3;w++)o.add(h,i(c*(1.65+w*2.25),A,-2.17,0,0,w*.4+M,.6,.6,.95),p(S,k,.08).multiplyScalar(1.45),{...y,mat:F+r})}await d();for(let M=0;M<4;M++)for(let A=0;A<3;A++){const w=i(c*(1.65+A*2.25),C+3.275+M*5.05,-2.5,0,0,0,.9,.9,.9),_=p(e.brass,k,.07);o.add(ce,w,_,{...y,mat:we+r}),o.add(fe,w,_,{...y,mat:we+r})}await d()}Y.dispose(),x.dispose(),J.dispose(),ee.dispose(),ce.dispose(),fe.dispose();const H=g(1.4,ne-.5,.9,.2),X={hinge:1};o.add(H,i(.15,G+ne/2,-2.1),e.leafWood.clone().multiplyScalar(1.2),{...X,mat:Me+r}),H.dispose(),await d();for(let c=0;c<7;c++){const y=i(.15,G+2.2+c*2.95,-1.66,0,0,0,.36,.36,.42),S=p(e.brass,k,.08);for(const M of f)o.add(M,y,S,{...X,mat:we+r})}const a=me([[0,-.7],[.5,-.5],[.75,0],[.5,.45],[.2,.7],[0,1]],8);return o.add(a,i(.15,l-.9,-1.6,Math.PI/2,0,0,.9,.9,.9),p(e.brass,k,.1),{...X,mat:we+r}),a.dispose(),h.dispose(),v.dispose(),f.forEach(c=>c.dispose()),{hood:[new s.Vector3(-(I+3.4),R-.7,0),new s.Vector3(I+3.4,R+1.6,3)],px:I}}function Ne(o,e,n=5){const t=new s.PlaneGeometry(o,e,6,7),d=t.attributes.position;for(let m=0;m<d.count;m++){const u=d.getX(m),l=d.getY(m);d.setZ(m,Math.sin(u/o*Math.PI*n)*.28*(.4+.6*(.5-l/e)))}return t.translate(0,-e/2,0),ie(t)}async function l0(o,e,n,t,d,m){const l=n.balW*1.45,h=39.6,v=38*1.45,f=5.6,L=me([[.5,0],[.5,.05],[.34,.08],[.44,.15],[.5,.21],[.35,.29],[.29,.5],[.29,.72],[.42,.8],[.3,.86],[.45,.94],[.5,1]],8),O=g(1.1,1.5,f-.4,.25),T=g(2*l+1.6,.9,f+.6,.25),D=Math.round(l/1.6);for(let r=-D;r<=D;r++)o.add(O,i(r*(l/D),h-1,f/2-.2),p(e.wood,t,.12),{mat:F});o.add(T,i(0,h,f/2),p(e.wood,t,.05),{mat:F}),O.dispose(),T.dispose(),await m();const j=n.balW>=10?6:5,B=v-h-.4,E=2*l/j;for(let r=0;r<=j;r++)o.add(L,i(-l+r*E,h+.4,f-.5,0,0,0,1.25,B,1.25),p(e.wood,t,.1).multiplyScalar(1.1),{mat:F});for(const r of[-1,1])o.add(L,i(r*l,h+.4,.9,0,0,0,1.25,B,1.25),p(e.wood,t,.1),{mat:F});await m();const P=(r,k,C,K,$,Y)=>{const x=Y?le([0,C,k],[0,C,r],[0,K,r],[0,K,k]):le([r,C,0],[k,C,0],[k,K,0],[r,K,0]);o.add(x,Y?i(Y*$,0,0,0,0,0,Y,1,1):i(0,0,$),p(e.wood,t,.08),{mat:qe}),x.dispose()},W=h+5.4,U=n.balStyle===0?v-.2:v-3.6,b=n.balStyle===0?W+4.2:v-3.6;P(-l,l,h+.4,W,f-.55,0),P(.9,f-.5,h+.4,W,l,1),P(.9,f-.5,h+.4,W,l,-1),n.balStyle===0?(P(-l,l,b,U,f-.55,0),P(.9,f-.5,b,U,l,1),P(.9,f-.5,b,U,l,-1)):(P(-l,l,U,v-.2,f-.55,0),P(.9,f-.5,U,v-.2,l,1),P(.9,f-.5,U,v-.2,l,-1));const Z=g(2*l+1.2,.7,.9,.2),I=g(.9,.7,f-.4,.2);for(const r of n.balStyle===0?[W,b]:[W,U]){o.add(Z,i(0,r,f-.5),p(e.wood,t,.08).multiplyScalar(1.15),{mat:F});for(const k of[-1,1])o.add(I,i(k*l,r,f/2+.2),p(e.wood,t,.08).multiplyScalar(1.1),{mat:F})}Z.dispose(),I.dispose(),await m(),o.add(le([-l,h+.4,.5],[l,h+.4,.5],[l,v,.5],[-l,v,.5]),re,e.void,{mat:Ie});const R=Ne(E*.9,b-W+1.5);for(let r=0;r<j;r++)(n.balStyle===1||r%2===0)&&o.add(R,i(-l+(r+.5)*E,b-.1,f-1.2),p(e.cloth,t,.05),{mat:ke,w:(k,C)=>Se((b-.1-C)/(b-W+1.5),0,1)});R.dispose(),await m();const N=g(2*l+1,1.45,.7,.08),te=g(.7,1.45,f,.08);o.add(N,i(0,v+1.45/2,f-.35),e.wood.clone().multiplyScalar(1.1),{mat:Me});for(const r of[-1,1])o.add(te,i(r*(l+.15),v+1.45/2,f/2),e.wood.clone().multiplyScalar(1.05),{mat:Me});N.dispose(),te.dispose();const oe=g(2*l+3.6,.8,f+3.2,.3);o.add(oe,i(0,v+1.45+1.5,f/2+.6,.36),p(e.thatch,t,.06),{mat:De}),oe.dispose();const Q=g(2*l+3,1.3,.35,.12);o.add(Q,i(0,v+1.45+.05,f+1.95,-.2),p(e.thatch,t,.06).multiplyScalar(.8),{mat:De}),Q.dispose(),L.dispose(),await m();const z=g(.42,1,.42,.1);for(const r of d)if(r.kind==="shut"){const k=r.hs+r.rise*.45,C=g(r.w/2-.1,k,.34,.1),K=g(.5,k+.3,.55,.12);for(const $ of[-1,1]){const Y=$*t.range(1,1.9),x=p(e.blue,t,.12),J=new s.Matrix4;J.multiply(i(r.x+$*(r.w/2+.1),r.y+k/2,.75,0,Y,0)).multiply(i(-$*(r.w/4),0,0)),o.add(C,J,x,{mat:_e});const ee=new s.Matrix4;ee.multiply(i(r.x+$*(r.w/2+.1),r.y+k/2,.75,0,Y,0)).multiply(i(-$*(r.w/2-.2),0,0)),o.add(K,ee,x.clone().multiplyScalar(.8),{mat:_e})}C.dispose(),K.dispose()}else if(r.kind==="bars"){for(let k=0;k<5;k++)o.add(z,i(r.x+(k-2)*(r.w/5.4),r.y+(r.hs+r.rise)/2,-1,0,.78,0,1,r.hs+r.rise,1),p(e.wood,t,.2).multiplyScalar(.7),{mat:F});o.add(z,i(r.x,r.y+r.hs*.55,-1,0,0,Math.PI/2,1,r.w,1),p(e.wood,t,.2).multiplyScalar(.7),{mat:F})}else if(r.kind==="curtain"){const k=r.hs+r.rise*.5,C=Ne(r.w*.96,k,4);o.add(C,i(r.x,r.y+k,-1.3),p(e.cloth,t,.05),{mat:ke,w:($,Y)=>Se((r.y+k-Y)/k,0,1)*.8}),C.dispose();const K=g(r.w+.6,.4,.4,.1);o.add(K,i(r.x,r.y+k+.1,-1.2),p(e.wood,t,.1),{mat:F}),K.dispose()}return z.dispose(),{balcony:[new s.Vector3(-l-.6,h-.2,0),new s.Vector3(l+.6,v+1.45+2.4,f+.6)],bw:l,ty:v}}async function n0(o,e,n,t,d,m){const u=He(12),l=ie(new s.CylinderGeometry(1.12,1.2,.3,16,1));l.rotateX(Math.PI/2);const h=(E,P,W)=>{o.add(l,i(E,P,.12,0,0,0,W,W,1),p(e.stone,t,.04)),o.add(u,i(E,P,.27,0,0,t()*.5,W,W,W*.8),p(e.lime,t,.03).multiplyScalar(1.05))};if(n.upperWin===3)h(-13.5,73,2.5),h(13.5,73,2.5);else for(const E of[-24,-8,8,24])h(E,73.5,1.9);const v=(d+25.2)/2;h(-v,49,2.1),h(v,49,2.1),h(-36.5,24,1.6),h(36.5,24,1.6),u.dispose(),l.dispose(),await m();const f=new s.Shape;ye(f,2.7,2.3,1.5,0,4);const L=new s.Path;ye(L,1.8,2,1.1,.35,4,!0),f.holes.push(L);const O=ie(new s.ExtrudeGeometry(f,{depth:.16,bevelEnabled:!0,bevelSize:.1,bevelThickness:.14,bevelSegments:1,curveSegments:1})),T=new s.Shape;ye(T,1.9,2,1.15,.3,4);const D=ie(new s.ShapeGeometry(T,1));for(let E=0;E<24;E++){(E&7)===0&&await m();const P=-40.25+E*3.5;o.add(O,i(P,81.4,.04),p(e.lime,t,.04).multiplyScalar(1.03)),o.add(D,i(P,81.4,.03),p(E%3===1?e.blue.clone().lerp(e.lime,.55):e.stone,t,.08).multiplyScalar(.62))}O.dispose(),D.dispose(),await m();const j=g(1,.8,5,.2),B=g(1.4,.5,1.2,.15);for(const E of[-37,-12.5,12.5,37])o.add(j,i(E,q-1.2,2.6,.16),p(e.wood,t,.2),{mat:F}),o.add(B,i(E,q-1.75,4.9,.16),p(e.wood,t,.2).multiplyScalar(.8),{mat:F});j.dispose(),B.dispose()}async function i0(o,e,n,t,d,m,u){const l=n.thatchHalf,h=.8,v=-27.5,f=-13.5,L=98.2,O=110,T=n.thatchHip?l-9:l+2.5,D=l+3.2,j=H=>he(D,T,H),B=H=>he(h,f,H),E=H=>he(v,f,H),P=H=>he(L,O,H),W=[],U=[],b=5,Z=(H,X,a)=>{W.push(H[0],H[1],H[2],X[0],X[1],X[2],a[0],a[1],a[2]),U.push(H[3],X[3],a[3])};for(let H=0;H<b;H++){const X=H/b,a=Math.min(1,(H+1.25)/b),c=.55,y=.75,S=(w,_)=>[[-j(w)-_,B(w)+_],[j(w)+_,B(w)+_],[j(w)+_,E(w)-_],[-j(w)-_,E(w)-_]],M=S(X,c),A=S(a,0);for(let w=0;w<4;w++){const _=M[w],ae=M[(w+1)%4],xe=A[w],be=A[(w+1)%4],Pe=Math.max(2,Math.round(Math.hypot(ae[0]-_[0],ae[1]-_[1])/2.6));let ve=null;for(let ze=0;ze<=Pe;ze++){const Ae=ze/Pe,Re=(t()-.5)*.9-ze%2*.45,Ve=[he(_[0],ae[0],Ae),P(X)-y+Re,he(_[1],ae[1],Ae),1],Ee=[he(xe[0],be[0],Ae),P(a),he(xe[1],be[1],Ae),0];ve&&(Z(ve[0],Ve,Ee),Z(ve[0],Ee,ve[1])),ve=[Ve,Ee]}}}await u();const I=new s.BufferGeometry;I.setAttribute("position",new s.Float32BufferAttribute(W,3)),I.computeVertexNormals(),o.add(I,re,e.thatch,{mat:De,wa:U,ao:(H,X)=>.8+.3*Te(L,O,X)+(t()-.5)*.12}),I.dispose();const R=ie(new s.CylinderGeometry(1,1,2*T+2.4,7,4));R.rotateZ(Math.PI/2),o.add(R,i(0,O-.15,f),e.thatch.clone().multiplyScalar(1.15),{mat:De}),R.dispose(),await u(),o.add(le([-D,L-.3,v],[D,L-.3,v],[D,L-.3,h],[-D,L-.3,h]),re,e.wood.clone().multiplyScalar(.45),{mat:F});const N=ie(new s.CylinderGeometry(.42,.55,1,6,1)),te=g(2*l+3,.8,.8,.2),oe=g(.45,4.6,.45,.1),se=Math.max(3,Math.round(l/4.6));for(const H of[-3.6,-26.2]){for(let X=0;X<=se;X++){const a=-l+2*l*X/se;o.add(N,i(a,q+(L-q)/2,H,(t()-.5)*.04,t()*6,(t()-.5)*.04,1,L-q,1),p(e.wood,t,.2),{mat:F}),X<se&&o.add(oe,i(a+1.5,L-2.1,H,0,0,-.75),p(e.wood,t,.2),{mat:F}),X>0&&o.add(oe,i(a-1.5,L-2.1,H,0,0,.75),p(e.wood,t,.2),{mat:F})}o.add(te,i(0,L-.5,H),p(e.wood,t,.1),{mat:F})}N.dispose(),te.dispose(),oe.dispose(),await u();const Q=me([[0,0],[.55,0],[.9,.5],[1,1],[.8,1.5],[.6,1.7],[.75,1.85],[.62,1.9]],9),z=ie(new s.OctahedronGeometry(1,0)),r=(H,X,a,c)=>{o.add(Q,i(H,X,a,0,t()*6,0,c,c,c),p(e.clay,t,.12));for(let y=0;y<22;y++){const S=t()*6.283,M=Math.sqrt(t())*1.5*c,A=(1.9+t()*2.6)*c,w=c*(.45+t()*.4);o.add(z,i(H+Math.cos(S)*M,X+A,a+Math.sin(S)*M,t()*1.2-.6,S,t()*1.2-.6,w*1.5,w*.35,w*.8),p(e.leaf,t,.35).lerp(e.thatch,t()*.3),{mat:ke,w:()=>.1})}};r(-n.potX,7.5,3.4,1.5),r(n.potX+3,7.5,2.6,1.2),n.thirdPot&&r(-n.potX-9,7.5,2.4,1);const k=Math.round(5*d);for(let H=0;H<k;H++)o.add(Q,i((l+6+t()*6)*(H%2?1:-1),q,-6-t()*16,0,t()*6,0,1.3+t()*.8),p(e.clay,t,.15));Q.dispose(),z.dispose(),await u();const C=-(m.px+8.5),K=G+10,$=new s.Shape;ye($,4.4,3.4,2.4,0,5);const Y=new s.Path;ye(Y,3,3,1.9,.45,5,!0),$.holes.push(Y);const x=ie(new s.ExtrudeGeometry($,{depth:.3,bevelEnabled:!0,bevelSize:.15,bevelThickness:.2,bevelSegments:1,curveSegments:1}));o.add(x,i(C,K,.05),p(e.lime,t,.03).multiplyScalar(1.04)),x.dispose(),o.add(le([-1.5,.45,0],[1.5,.45,0],[1.5,5.3,0],[-1.5,5.3,0]),i(C,K,.08),e.void,{mat:Ie});const J=me([[0,0],[.6,.05],[.25,.3],[.7,.8],[.8,1.3],[.45,1.8],[.2,2],[.3,2.3],[0,2.5]],8);o.add(J,i(C,K+.5,.75,0,0,0,.85),e.brass,{mat:we}),J.dispose();const ee=Ne(4.6,5.2,3),ce=m.bw*n.kangaX,fe=39.6+5.9;return o.add(ee,i(ce,fe,5.75),e.kanga,{mat:ke,w:(H,X)=>Se((fe-X)/5.2,0,1)*.35}),ee.dispose(),{thatch:[new s.Vector3(-D+.5,L-.3,v+.5),new s.Vector3(D-.5,L+2.5,h-.5)],lamp:new s.Vector3(C,K+2,1.5)}}const Le={morning:{sun:[.78,.45,.44],sunColor:["#fff4e0",1.75],sky:["#9db8e8",.5],bounce:["#e8dcc0",.3],door:["#fff3d8",1.8],next:["#B9B24A",1],glow:0,wind:.12},noon:{sun:[.25,.94,.22],sunColor:["#fff0cc",2.25],sky:["#c8d4e8",.34],bounce:["#c89a60",.5],door:["#B9B24A",1.9],next:["#E58A7A",1],glow:0,wind:.2},storm:{sun:[-.35,.55,.75],sunColor:["#d6d27a",.75],sky:["#76828f",.6],bounce:["#8d9458",.36],door:["#E58A7A",2],next:["#1B2450",1],glow:.06,wind:1},sunset:{sun:[-.88,.22,.42],sunColor:["#ff9272",2.3],sky:["#6a58b0",.3],bounce:["#E58A7A",.3],door:["#3348a8",1.5],next:["#F2A33A",1],glow:.14,wind:.25},night:{sun:[.55,.62,.56],sunColor:["#a8c0ff",.95],sky:["#2a3a7a",.34],bounce:["#141c44",.4],door:["#9fd0ff",2.4],next:["#F2A33A",1],glow:1.7,wind:.05}},c0=(o,e=1)=>new s.Color(o).multiplyScalar(e);async function h0(o,e={}){const n=o.rng,t=o.quality?.detail??1,d=(e.palette&&e.palette.length>=7?e.palette:Ce).map(N=>new s.Color(N)),m={upperWin:n.chance(.5)?3:5,balW:n.pick([9,10,11]),balStyle:n.chance(.5)?0:1,merlon:n.chance(.55)?0:1,thatchHalf:n.range(22,31),thatchHip:n.chance(.65),rosettes:n.pick([5,7]),potX:n.range(17,24),thirdPot:n.chance(.5),kangaX:n.range(-.7,.7),back:e.back!==!1,plinth:e.plinth===!0},u=n.range(-1,1),l=e.look&&Le[e.look]?e.look:n.pick(["morning","noon","storm","sunset","night"]),h=d[0].clone().multiplyScalar(.8).lerp(d[3],.03+.03*u),v={lime:h,stone:h.clone().lerp(d[3],.14).lerp(d[5],.12),void:d[4].clone().multiplyScalar(.12),wood:d[5].clone().lerp(new s.Color("#8a5636"),.5+.12*u),brass:d[6].clone().lerp(d[2],.18).multiplyScalar(.85),thatch:d[2].clone().lerp(d[5],.42).lerp(new s.Color("#8f8a78"),.35),blue:d[1].clone().lerp(d[4],n.range(0,.3)),cloth:d[0].clone().multiplyScalar(.84),clay:d[3].clone().lerp(d[5],.35),leaf:d[2].clone().lerp(new s.Color("#2f5a2a"),.6),kanga:n.chance(.5)?d[3].clone().multiplyScalar(.9):d[1].clone().lerp(d[3],.25),flame:d[6].clone()};v.leafWood=d[5].clone().lerp(new s.Color("#7a3f24"),.52+.08*u);const f=e0(m),L=new je(72e3);await o.yield();const O=()=>o.yield();await o0(L,v,m,n,f,t,O),await o.yield();const T=await s0(L,v,m,n,O);await o.yield();const D=await l0(L,v,m,n,f,O);await o.yield(),await n0(L,v,m,n,D.bw,O),await o.yield();const j=await i0(L,v,m,n,t,{px:T.px,bw:D.bw},O);await o.yield();const B=L.build();B.boundingSphere=new s.Sphere(new s.Vector3(0,55,-12),80),B.boundingBox=new s.Box3(new s.Vector3(-50,0,-32),new s.Vector3(50,112,12)),await o.yield();const E=[D.balcony,T.hood,j.thatch],P=new s.ShaderMaterial({vertexShader:Je,fragmentShader:Qe,fog:!0,uniforms:s.UniformsUtils.merge([s.UniformsLib.fog,{uTime:{value:0},uDoor:{value:1.4},uWind:{value:.1},uSunDir:{value:new s.Vector3(.5,.6,.6)},uSunCol:{value:new s.Color(1,1,1)},uSky:{value:new s.Color(.3,.4,.6)},uBounce:{value:new s.Color(.2,.2,.2)},uDoorCol:{value:new s.Color(1,1,1)},uDoorStr:{value:2},uGlow:{value:0},uGlowCol:{value:d[6].clone().multiplyScalar(1.6)},uLampCol:{value:d[6].clone().lerp(new s.Color("#ffd9a0"),.25).multiplyScalar(1.5)},uCoral:{value:h.clone().lerp(d[3],.4).lerp(d[5],.2).multiplyScalar(.8)},uBoxMin:{value:E.map(N=>N[0].clone().addScalar(.3))},uBoxMax:{value:E.map(N=>N[1].clone().addScalar(-.3))},uArchInv:{value:new s.Matrix4},uDark:{value:new s.Color(0,0,0)},uDarkK:{value:0}}])}),W=new s.PlaneGeometry(pe,ne),U=new s.ShaderMaterial({vertexShader:$e,fragmentShader:Ye,fog:!0,transparent:!0,depthWrite:!1,uniforms:s.UniformsUtils.merge([s.UniformsLib.fog,{uTime:{value:0},uAlpha:{value:1},uDoorStr:{value:2},uDoorCol:{value:new s.Color(1,1,1)},uShade:{value:d[4].clone()},uNext:{value:new s.Color(1,1,1)},uChina:{value:d[1].clone().multiplyScalar(.8)}}])}),b=[B,W,P,U],Z={doorCenter:new s.Vector3(0,G+ne/2,0),doorSill:new s.Vector3(0,G,0),doorSize:{w:pe,h:ne},modelScale:1/16,roomOrigin:new s.Vector3(0,0,-V),portalSeat:{position:new s.Vector3(0,18,-1.5),facing:new s.Vector3(0,0,1),radius:7},flyThrough:[[0,18,70],[0,18,30],[0,18,10],[0,18,0],[0,18,-15],[0,18,-V]].map(N=>new s.Vector3(...N)),viewpoints:{front:new s.Vector3(0,30,120),close:new s.Vector3(0,18,14),below:new s.Vector3(-22,10,46)},lookAt:new s.Vector3(0,24,0),balcony:new s.Vector3(0,48,5),thatch:new s.Vector3(0,104,-13),lampNiche:j.lamp.clone()};function I(N,te){const oe=new s.Group;oe.name="house-in-the-niche";const se=new s.Mesh(B,N);se.name="house-front",oe.add(se);const Q=new s.Mesh(W,te);Q.name="room-picture",Q.position.set(0,G+ne/2,-V+.4),Q.visible=e.impostor!==!1,Q.frustumCulled=!0,oe.add(Q);const z=N.uniforms,r=te.uniforms;let k=.1,C=0,K=1;const $=()=>{z.uDoor.value=he(1.26,1.571,Te(0,1,C)),z.uWind.value=k+.5*Te(.3,1,C),r.uAlpha.value=K},Y={object:oe,mesh:se,impostor:Q,radius:64,height:110,center:new s.Vector3(0,46,-6),anchors:Z,ground:!0,groundY:0,uniforms:z,impostorUniforms:r,look:l,looks:Object.keys(Le),config:m,setLight(x={}){const J=(ee,ce)=>{ce!==void 0&&(Array.isArray(ce)?ee.set(ce[0]).multiplyScalar(ce[1]):ee.set(ce))};if(x.sun&&(z.uSunDir.value.set(x.sun[0],x.sun[1],x.sun[2]),z.uSunDir.value.lengthSq()<1e-6&&z.uSunDir.value.set(0,1,0),z.uSunDir.value.normalize()),J(z.uSunCol.value,x.sunColor),J(z.uSky.value,x.sky),J(z.uBounce.value,x.bounce),J(z.uGlowCol.value,x.glowColor),x.door!==void 0){J(z.uDoorCol.value,x.door);const ee=Math.max(z.uDoorCol.value.r,z.uDoorCol.value.g,z.uDoorCol.value.b,.001);Array.isArray(x.door)?(z.uDoorCol.value.multiplyScalar(1/x.door[1]),z.uDoorStr.value=x.door[1]):ee>1&&(z.uDoorCol.value.multiplyScalar(1/ee),z.uDoorStr.value=ee),r.uDoorCol.value.copy(z.uDoorCol.value)}return x.doorStrength!==void 0&&(z.uDoorStr.value=x.doorStrength),r.uDoorStr.value=z.uDoorStr.value,x.next!==void 0&&J(r.uNext.value,x.next),x.glow!==void 0&&(z.uGlow.value=x.glow),x.wind!==void 0&&(k=x.wind,$()),Y},setLook(x){const J=Le[x]||Le.morning;return Y.look=Le[x]?x:"morning",Y.setLight(J)},setProgress(x){C=Se(x,0,1),$()},setImpostor(x){K=Se(x,0,1),Q.visible=K>.003,$()},update(x,J){z.uTime.value=J,r.uTime.value=J},makeLevel(){const x=N.clone(),J=te.clone();b.push(x,J);const ee=I(x,J);return ee.setLook(Y.look),ee},dispose(){for(const x of b)x.dispose()}};return Y}const R=I(P,U);return R.setLook(l),R.setProgress(e.progress??.25),R}export{je as Acc,i as M,ye as archPath,g as bevelBox,We as bossParts,h0 as buildHero,me as lathe,ie as ni,Ze as niSmooth,le as quadGeo,He as rosetteGeo};
