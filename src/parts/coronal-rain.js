import*as a from"three";const kt=["#FFB52E","#D9781A","#34160A","#FF4F86","#E9E0FF","#020204","#7A2338"],st=17,Gt=14,P=16,p=Math.PI,Bt=`
#define NL ${st}
#define PI 3.14159265
uniform vec3 uC[NL];      // centre of the base line
uniform vec3 uU[NL];      // centre -> near foot
uniform vec3 uH[NL];      // centre -> crown (leaned)
uniform vec3 uN[NL];      // unit normal of the loop plane
uniform vec4 uSw[NL];     // xyz sideways breathing (metres), w phase
uniform vec4 uRG[NL];     // foot radius, crown radius, gain, half-ellipse length (m)
uniform vec4 uMisc[NL];   // x breathing shape (1 crown sways, 2 crown fixed), y 0 plain / 1 braided / 2 nave rib, z flow speed, w crown violet
uniform vec4 uFoot[NL];   // ground height at the near foot, far foot, and how far s runs past 0 and 1 to reach it
uniform vec4 uEye;        // loop index, metres per unit s at the crown, half width, half length
uniform float uTime;
uniform float uPx;        // world size of one pixel at 1 m
uniform vec2 uFar;        // depth cue start, end

vec3 arcC(int i, float s) {
  float a = PI * s;
  return uC[i] + uU[i] * cos(a) + uH[i] * sin(a) + uSw[i].xyz * (sin(a * uMisc[i].x) * sin(uTime * 0.31 + uSw[i].w));
}
vec3 arcT(int i, float s) {
  float a = PI * s;
  return normalize(uH[i] * cos(a) - uU[i] * sin(a));
}
// a thread inside the bundle: off = (angle0, twist per unit s, radius fraction, wobble rate), side = -1 | 1
vec3 arcOff(int i, float s, vec4 off, float side, out vec3 T) {
  float a = PI * s, sa = sin(a);
  vec3 c = arcC(i, s);
  T = arcT(i, s);
  vec3 Nn = uN[i], Bn = cross(Nn, T);
  float R = mix(uRG[i].x, uRG[i].y, sa);
  float th = off.x + off.y * s;
  float rr = R * off.z * (0.74 + 0.26 * sin(off.w * s + off.x * 3.0));
  float ox = rr * cos(th), oy = rr * sin(th);
  if (abs(uEye.x - float(i)) < 0.5) {
    float d = (s - 0.5) * uEye.y / uEye.w;
    float e1 = max(0.0, 1.0 - d * d);
    float e = uEye.z * e1 * sqrt(e1);
    ox = mix(ox, side * sqrt(ox * ox * 0.4 + e * e), smoothstep(0.0, 6.0, e));
  }
  return c + Nn * ox + Bn * oy;
}
`,Ot=`
uniform vec3 cGold, cAmber, cUmber, cRose, cViolet, cRoseDeep;
uniform float uTime;
float h21(vec2 p) { p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
// value noise, periodic in x with period px
float vnoise(vec2 p, float px) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float x0 = mod(i.x, px), x1 = mod(i.x + 1.0, px);
  return mix(mix(h21(vec2(x0, i.y)), h21(vec2(x1, i.y)), f.x), mix(h21(vec2(x0, i.y + 1.0)), h21(vec2(x1, i.y + 1.0)), f.x), f.y);
}
`,Et=`#include <fog_pars_vertex>
`,Rt=`#include <fog_pars_fragment>
`,qt=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    col *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#endif
`;function Nt(h){return new a.Color(h)}async function Ut(h,g={}){const o=h.rng,C=h.quality?.detail??1,k=(g.palette&&g.palette.length>=7?g.palette:kt).map(Nt),W=g.rain==="heavy",K=!!g.fog,G=new a.Group;G.name="coronal-rain-arcade";const Te=Math.max(9,Math.min(14,g.loops??o.int(9,14))),fe=o.sign(),ve=o.range(-1,1),m=[],it=e=>650+.0019*(e+120)*(e+120)-27;m.push({A:[0,0,650],B:[0,0,-650],h:1040,lean:0,rf:23,rc:28,braided:!0,name:"L1"});let Se=0,ke=0,oe=0,ae=0;const lt=o.range(95,150),ct=o.range(1,1.45);for(let e=1;e<Te;e++){const t=e===1?!0:e===2?!1:(oe+1)/(ae+1)<.55;let n,r;t?(oe++,r=oe,Se+=oe===1?150:o.range(70,115),n=Se):(ae++,r=ae,ke-=ae===1?98:o.range(66,108),n=ke);const l=t?1:-1,f=Math.max(250,(r===1?o.range(780,910):940-r*lt*o.range(.85,1.15))+o.range(-45,45)),i=l*Math.min(30,r===1?o.range(5,8):4+r*o.range(4.5,6.5))*p/180,c=o.range(24,40)*(e<=2?1.08:1),d=-650+r*o.range(35,75)+o.range(-30,30)+(r>2&&o.chance(.3)?o.range(120,300):0);m.push({A:[n,0,it(n)+o.range(-12,12)],B:[n*ct+o.range(-25,25)+(t?20:-10),0,d],h:f,lean:i,rf:c*.46,rc:c*.56,braided:e<=2,name:e===1?"L4":e===2?"L7":"L"+(e+7)})}const F=g.flareAt?new a.Vector3(g.flareAt[0],0,g.flareAt[1]):new a.Vector3(-175+o.range(-20,20),0,330+o.range(-30,30)),Ge=new a.Vector3(F.x+o.range(20,70),0,F.z-o.range(430,520)),Be=300,ft=-o.range(4,12)*p/180;let de=Math.floor((ve+1)*5e5)*31+Te*7919+(fe>0?13:0)>>>0;const s=()=>(de=Math.imul(de,1664525)+1013904223>>>0,de/4294967296);s.range=(e,t)=>e+(t-e)*s();const O=[{A:[-92+s.range(-5,5),0,412+s.range(-12,12)],B:[-80+s.range(-5,5),0,-775+s.range(-15,15)],h:1004+s.range(-8,8),lean:1.2*p/180,rf:10,rc:12,name:"RL"},{A:[90+s.range(-5,5),0,422+s.range(-12,12)],B:[84+s.range(-5,5),0,-768+s.range(-15,15)],h:998+s.range(-8,8),lean:-1.2*p/180,rf:10,rc:12,name:"RR"}],X=[],V=[],M=[],ue=[],ne=[],E=[],R=[],b=[];for(let e=0;e<st;e++)b.push(new a.Vector4),X.push(new a.Vector3),V.push(new a.Vector3(0,0,1)),M.push(new a.Vector3(0,1,0)),ue.push(new a.Vector3(-1,0,0)),ne.push(new a.Vector4),E.push(new a.Vector4(1,1,0,1)),R.push(new a.Vector4(1,0,1,0));const he=new a.Vector3,Oe=new a.Vector3,me=new a.Vector3;function pe(e,t,n,r,l,f,i,c,d,x){he.fromArray(t),Oe.fromArray(n),X[e].copy(he).add(Oe).multiplyScalar(.5),V[e].copy(he).sub(X[e]),me.set(V[e].z,0,-V[e].x).normalize(),M[e].set(0,Math.cos(l),0).addScaledVector(me,Math.sin(l)).multiplyScalar(r),ue[e].copy(V[e]).cross(M[e]).normalize();const u=p*Math.sqrt((V[e].lengthSq()+r*r)/2);return E[e].set(f,i,c,u),R[e].set(e===0?2:1,d===2?2:d?1:0,R[e].z,x),me}m.forEach((e,t)=>{const n=pe(t,e.A,e.B,e.h,e.lean,e.rf,e.rc,1,e.braided,W||t===0?1:o.range(.25,.6)),r=t===0?o.range(5,7):o.range(5,10);ne[t].set(n.x*r,0,n.z*r,o.range(0,6.28)),R[t].z=o.range(.75,1.3),e.len=E[t].w;const l=d=>Math.max(-90,Math.min(0,g.groundAt?g.groundAt(d[0],d[2]):0)),f=l(e.A),i=l(e.B),c=M[t].y;b[t].set(f,i,Math.asin(Math.min(.3,-f/c))/p,Math.asin(Math.min(.3,-i/c))/p),e.ga=f,e.gb=i});const Ee=e=>Math.max(-90,Math.min(0,g.groundAt?g.groundAt(e[0],e[2]):0));O.forEach((e,t)=>{const n=Gt+t,r=pe(n,e.A,e.B,e.h,e.lean,e.rf,e.rc,1,2,W?1:.7),l=s.range(3,4.5);ne[n].set(r.x*l,0,r.z*l,s.range(0,6.28)),R[n].z=s.range(.9,1.3),e.len=E[n].w,e.slot=n;const f=Ee(e.A),i=Ee(e.B),c=M[n].y;b[n].set(f,i,Math.asin(Math.min(.3,-f/c))/p,Math.asin(Math.min(.3,-i/c))/p),e.ga=f,e.gb=i});const ge=m.slice();O.forEach(e=>{ge[e.slot]=e}),pe(P,F.toArray(),Ge.toArray(),1,ft,7,10,0,!1,1),R[P].z=2.2;const vt=new a.Vector4(0,p*650,21,58),Y={uC:{value:X},uU:{value:V},uH:{value:M},uN:{value:ue},uSw:{value:ne},uRG:{value:E},uMisc:{value:R},uFoot:{value:b},uEye:{value:vt},uTime:{value:0},uPx:{value:.0028},uFar:{value:new a.Vector2(g.far?.[0]??1600,g.far?.[1]??5200)},cGold:{value:k[0].clone().lerp(k[3],Math.max(0,-ve)*.06)},cAmber:{value:k[1]},cUmber:{value:k[2]},cRose:{value:k[3].clone().lerp(k[0],Math.max(0,ve)*.08)},cViolet:{value:k[4]},cRoseDeep:{value:k[6]}},D=e=>new a.ShaderMaterial({uniforms:K?{...a.UniformsUtils.clone(a.UniformsLib.fog),...Y,...e.uniforms||{}}:{...Y,...e.uniforms||{}},vertexShader:`#include <common>
`+(K?Et:"")+Bt.replace("#define PI 3.14159265","")+e.vertexShader,fragmentShader:(K?Rt:"")+Ot+e.fragmentShader.replace("//FOG",K?qt:""),fog:K,transparent:e.transparent??!0,depthWrite:e.depthWrite??!1,depthTest:!0,blending:e.blending??a.AdditiveBlending,side:e.side??a.FrontSide}),H=K?`#include <fog_vertex>
`:"";function xe(e,t,n=new a.Vector3){const r=p*t;return n.copy(X[e]).addScaledVector(V[e],Math.cos(r)).addScaledVector(M[e],Math.sin(r))}await h.yield?.();const Re=[],qe=[],Ne=[],Ue=[];let _e=0;function T(e,t,n,r,l,f,i,c,d,x){for(let u=0;u<=r;u++){const w=t+(n-t)*(u/r);for(let y=0;y<=l;y++)Re.push(w,y/l,e),qe.push(f[0],f[1],f[2],f[3]),Ne.push(i,c,d,x)}for(let u=0;u<r;u++)for(let w=0;w<l;w++){const y=_e+u*(l+1)+w,I=y+l+1;Ue.push(y,y+1,I,I,y+1,I+1)}_e+=(r+1)*(l+1)}const L=[];for(let e=0;e<m.length;e++){const t=m[e];if(e%2===1&&await h.yield?.(),T(e,-b[e].z-.004,1+b[e].w+.004,96,8,[0,0,0,0],0,-1,0,o()),!t.braided){T(e,-b[e].z-.004,1+b[e].w+.004,96,6,[0,0,0,0],0,-.52,0,o());continue}const n=[],r=9,l=fe*o.range(4.2,5.6)*2*p*(t.len/2700);for(let f=0;f<r;f++){const i=f%3===0,c=[f/r*2*p+o.range(-.18,.18),l*(i?-.6:1)*o.range(.94,1.06),i?o.range(.32,.42):o.range(.74,.92),o.range(9,17)],d=e===0?Math.cos(c[0]+c[1]*.5)>=0?1:-1:f%2===0?1:-1,x=(i?o.range(3.4,4.3):o.range(2.6,3.7))*(e===0?1:.82);n.push({off:c,side:d,rad:x}),T(e,-b[e].z-.004,1+b[e].w+.004,e===0?240:140,6,c,d,x,1,o())}L[e]=n}for(let e=0;e<12;e++){const t=e%2===0?1:-1,r=[o.sign()*p/2+o.range(-.25,.25),0,.1+.68*((Math.floor(e/2)+o())/6),0];T(0,.5-o.range(.034,.05),.5+o.range(.034,.05),40,5,r,t,o.range(.9,1.5),2,o())}T(P,0,1,96,8,[0,0,0,0],0,-1,1,o()),T(P,0,1,96,6,[0,0,0,0],0,-.5,1,o());for(const e of O){const t=e.slot,n=-b[t].z-.004,r=1+b[t].w+.004,l=[];T(t,n,r,96,8,[0,0,0,0],0,-1,0,s()),T(t,n,r,96,6,[0,0,0,0],0,-.55,0,s());const f=fe*s.range(2.2,3.6);for(let i=0;i<7;i++){const c=i===6,d=[i/6*2*p+s.range(-.3,.3),f*s.range(.9,1.1),c?s.range(.1,.3):s.range(.6,.95),s.range(7,13)],x=c?s.range(2.2,2.8):s.range(1.5,2.3);l.push({off:d,side:1,rad:x}),T(t,n,r,132,6,d,1,x,1,s())}L[t]=l}await h.yield?.();const j=new a.BufferGeometry;j.setAttribute("position",new a.BufferAttribute(new Float32Array(Re),3)),await h.yield?.(),j.setAttribute("aOff",new a.BufferAttribute(new Float32Array(qe),4)),await h.yield?.(),j.setAttribute("aPar",new a.BufferAttribute(new Float32Array(Ne),4)),await h.yield?.(),j.setIndex(new a.BufferAttribute(new Uint32Array(Ue),1)),await h.yield?.(),j.boundingSphere=new a.Sphere(new a.Vector3(0,500,0),1600);const dt=D({vertexShader:`
      attribute vec4 aOff, aPar;
      varying vec3 vN, vView;
      varying vec4 vA;     // s, angle, length coordinate (m), kind
      varying vec4 vB;     // gain, distance, flow, crown violet
      varying vec3 vE;     // local height, width dimming, seed
      void main() {
        float s = position.x; int i = int(position.z + 0.5);
        float kind = aPar.z;
        vec3 T; vec3 c = arcOff(i, s, aOff, aPar.x, T);
        vec3 T2; vec3 c2 = arcOff(i, s + 0.0015, aOff, aPar.x, T2);
        vec3 Ts = normalize(c2 - c);
        vec3 n1 = normalize(cross(Ts, uN[i])), n2 = cross(Ts, n1);
        float len = uRG[i].w, sa = sin(PI * s);
        float r = aPar.y;
        float foot = max(min(s, 1.0 - s), 0.0) * len;             // metres from the nearer foot (0 below the surface: feet sunk into a dish must not flare)
        if (r < 0.0) r = -r * mix(uRG[i].x, uRG[i].y, sa) * (1.0 + 0.07 * sin(s * 31.0 + uTime * 0.21 + aPar.w * 6.0)) * (1.0 + 0.30 * exp(-foot / 45.0));
        else r *= 1.0 + 0.22 * sin(s * len / 41.0 + aPar.w * 40.0 - uTime * 0.5) + 0.25 * exp(-foot / 30.0);
        vec3 wc = (modelMatrix * vec4(c, 1.0)).xyz;
        float dist = length(cameraPosition - wc);
        float rmin = 0.8 * uPx * dist;
        float dim = r / max(r, rmin); r = max(r, rmin);
        float a = position.y * 6.2831853;
        vec3 dir = cos(a) * n1 + sin(a) * n2;
        vec3 p = c + dir * r;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vN = mat3(modelMatrix) * dir; vView = cameraPosition - wp.xyz;
        float fade = 1.0;
        if (kind > 1.5) fade = 1.0 - smoothstep(0.78, 1.04, abs(s - 0.5) * uEye.y / uEye.w);
        vA = vec4(s, position.y, abs(s - 0.5) * len, kind);
        vB = vec4(uRG[i].z * fade, dist, uMisc[i].z, uMisc[i].w);
        // braided loops: the sheath is only a far-off envelope, and never veils the eye
        if (kind < 0.5 && abs(uMisc[i].y - 1.0) < 0.5) vB.x *= 0.5 * smoothstep(350.0, 1500.0, dist) * (abs(uEye.x - float(i)) < 0.5 ? smoothstep(0.03, 0.09, abs(s - 0.5)) : 1.0);
        // nave ribs: thin near their feet (they must not stand as columns in the S), full strength overhead
        if (uMisc[i].y > 1.5) vB.x *= mix(0.22, 1.0, smoothstep(80.0, 430.0, p.y)) * (kind < 0.5 ? 0.55 : 1.15);
        vE = vec3(p.y - (s < 0.5 ? uFoot[i].x : uFoot[i].y), dim, aPar.w);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        ${H}
      }`,fragmentShader:`
      uniform vec2 uFar;
      varying vec3 vN, vView; varying vec4 vA, vB; varying vec3 vE;
      void main() {
        float kind = vA.w, s = vA.x;
        float ndv = abs(dot(normalize(vN), normalize(vView)));
        float edge = 1.0 / max(ndv, 0.25);                                  // thin gas: brightest at the silhouette
        float flow = uTime * vB.z;
        float ang = vA.y + vE.z + s * 0.6;
        float th, I;
        if (kind < 0.5) {
          // far off a thread is thinner than a pixel: draw the noise out along the loop and lift the floor, so a
          // distant arch is one continuous glowing curve (both legs), not a string of beads
          float farT = smoothstep(800.0, 2400.0, vB.y), ls = 1.0 + 3.0 * farT;
          float t1 = vnoise(vec2(ang * 22.0 + s * 3.0, vA.z / (120.0 * ls) + flow * 0.55 / ls), 22.0);
          float t2 = vnoise(vec2(ang * 52.0 - s * 5.0, vA.z / (70.0 * ls) + flow * 0.9 / ls + 7.3), 52.0);
          float l1 = smoothstep(0.5 - 0.2 * farT, 0.92, t1), l2 = smoothstep(0.58 - 0.2 * farT, 0.97, t2);
          th = mix(l1 * 0.75 + l2 * 0.65, 0.42, 0.55 * farT);
          I = min(0.9, (mix(0.014, 0.085, farT) + 0.4 * th) * (0.55 + 0.45 * min(edge, 2.6)));
        } else {
          float t1 = vnoise(vec2(ang * 13.0, vA.z / 60.0 + flow * 1.3), 13.0);
          float t2 = vnoise(vec2(ang * 31.0, vA.z / 24.0 + flow * 2.1 + 3.1), 31.0);
          float t3 = vnoise(vec2(ang * 3.0, vA.z / 150.0 + flow * 0.6), 3.0);
          float l1 = smoothstep(0.42, 0.85, t1), l2 = smoothstep(0.5, 0.95, t2);
          float t4 = vnoise(vec2(ang * 67.0, vA.z / 9.0 + flow * 4.0 + 1.7), 67.0);
          float fine = 1.0 - smoothstep(60.0, 420.0, vB.y);                 // hair-fine threads, only near the lens
          th = (l1 * 0.7 + l2 * 0.6 + smoothstep(0.55, 0.95, t4) * 0.4 * fine) * (0.35 + 1.0 * t3) * mix(1.0, 0.55 + 0.9 * t4, fine);
          I = min(0.9, (0.045 * (1.0 - 0.7 * vB.w * smoothstep(0.9, 1.0, sin(3.14159265 * s))) + 0.33 * th) * (0.4 + 0.6 * edge)) * mix(1.0, 1.7, smoothstep(200.0, 1200.0, vB.y));
          if (kind > 1.5) I = min(0.75, (0.2 + 0.5 * th) * (0.4 + 0.6 * edge));
        }
        float sa = sin(3.14159265 * s);
        vec3 hot = mix(cGold, vec3(1.0, 0.93, 0.78), 0.55);
        vec3 col = mix(cAmber, cGold, smoothstep(0.0, 0.6, th));
        col = mix(col, hot, 0.45 * smoothstep(0.7, 1.3, th));
        // crowns: gold -> pale gold-white -> violet-white on the thread crests (never through grey)
        float cv = vB.w * smoothstep(0.9, 1.0, sa);
        col = mix(col, vec3(1.0, 0.9, 0.82), smoothstep(0.0, 0.5, cv) * 0.6);
        col = mix(col, cViolet, smoothstep(0.35, 1.0, cv) * (0.4 + 0.6 * smoothstep(0.1, 0.8, th)));
        if (kind > 1.5) col = cViolet;
        else I *= 1.0 - 0.3 * cv;
        // feet: gold-hot and dissolving into the surface
        float y = vE.x;
        col = mix(col, mix(cGold, hot, 0.5), 0.6 * exp(-max(y, 0.0) / 70.0));
        I *= (1.0 + 0.7 * exp(-max(y, 0.0) / 40.0)) * smoothstep(-2.0, 14.0, y);
        float f = smoothstep(uFar.x, uFar.y, vB.y);
        float lum = dot(col, vec3(0.3, 0.55, 0.15));
        col = mix(col, cViolet * lum, f * 0.6) * (1.0 - 0.5 * f);
        col *= I * vB.x * vE.y;
        //FOG
        gl_FragColor = vec4(max(col, 0.0), 1.0);
      }`}),we=new a.Mesh(j,dt);we.frustumCulled=!1,we.renderOrder=2,G.add(we),await h.yield?.();const Ie=`
    // returns head position s; q = fall progress 0..1, grow = condensation 0..1, alive = visibility
    float dropS(int i, vec4 A, vec4 Tm, out float q, out float grow, out float alive) {
      float ph = fract(uTime / Tm.x + Tm.y);
      if (A.w > 0.5) {                                   // bead: evenly spaced, quick, foot to shoulder
        q = ph; grow = 1.0; alive = smoothstep(0.0, 0.05, ph) * (1.0 - smoothstep(0.62, 1.0, ph));
        return A.y > 0.0 ? ph * A.z : 1.0 - ph * A.z;
      }
      grow = smoothstep(0.0, 0.22, ph);
      q = clamp((ph - 0.25) / 0.70, 0.0, 1.0);
      float d = (30.0 * q + 55.0 * q * q) / 85.0;       // 30 -> 140 m/s
      alive = smoothstep(0.0, 0.05, ph) * (1.0 - smoothstep(0.935, 0.955, ph));
      float s0 = A.z + A.y * 0.006 * min(ph, 0.25) * 4.0;
      return mix(s0, A.y > 0.0 ? 1.0 + uFoot[i].w : -uFoot[i].z, d);
    }`,A=[],Z=[],q=[],ut=Math.round(2400*C),Ce=Math.round(60*C),ht=Math.round(360*C),mt=Math.round(8*C),J=o.shuffle([...Array(m.length-3).keys()].map(e=>e+3)),pt=new Set([0,1,2,...W?J:J.slice(0,2)]),gt=new Set([0,1,2,...W?J:J.slice(1,1+Math.ceil(J.length*.6))]),re=[];for(let e=0;e<m.length;e++)for(const t of[-1,1]){if(!(t<0?pt:gt).has(e))continue;const n=W?o.int(2,4):e<3&&t<0?2:o.int(1,2);for(let r=0;r<n;r++){const l=m[e].len*.5/85/.7;re.push({loop:e,dir:t,count:o.int(20,60)*(e<3&&t<0?1.5:1),period:l*o.range(.9,1.3),phase:(r+o.range(0,.6))/n+e*.37,th:o.range(0,6.28),rho:o.range(.2,.8),strand:o.int(0,8)})}}const xt=re.reduce((e,t)=>e+t.count,0);let Ke=Ce;const wt=re.filter(e=>e.dir<0&&e.loop<3).length;for(const e of re){const t=m[e.loop],n=Math.max(6,Math.round(e.count*ut/xt)),r=e.dir<0&&e.loop<3?Math.min(Ke,Math.ceil(Ce/wt)):0;Ke-=r;for(let f=0;f<n;f++){let i,c=o.sign();if(t.braided){const u=L[e.loop][(e.strand+o.int(0,2))%9];i=[u.off[0]+o.range(-.05,.05),u.off[1],u.off[2],u.off[3]],c=u.side}else i=[e.th+o.gauss()*.45,0,Math.max(.05,Math.min(.95,e.rho+o.gauss()*.16)),0];const d=f<r,x=d||o.chance(.12);A.push({A:[e.loop,e.dir,.5+e.dir*o.range(.004,.075),d?.25:0],off:i,T:[e.period,e.phase+o.range(0,.08),x?o.range(6,14):o.range(2.6,6.5),c],knot:d})}const l=e.dir<0?t.A:t.B;Z.push({x:l[0],z:l[2],period:e.period,phase:e.phase%1,r:15,loop:e.loop,near:e.dir<0})}for(const e of O)for(const t of[-1,1]){const n=t<0?4:2,r=e.len*.5/85/.7,l=r*s.range(.95,1.1),f=s();for(let i=0;i<n;i++){const c=f+(i+s.range(-.08,.08))/n,d=Math.round((t<0?26:18)*(.5+.5*C)),x=Math.floor(s()*7);for(let w=0;w<d;w++){const y=L[e.slot][(x+Math.floor(s()*3))%7],I=t<0&&w<mt;A.push({A:[e.slot,t,.5+t*s.range(.006,.085),I?.25:0],off:[y.off[0]+s.range(-.06,.06),y.off[1],y.off[2],y.off[3]],T:[l,c+s.range(0,.07),I?s.range(6,11):s()<.2?s.range(5,8):s.range(2.6,5.5),1],knot:I})}const u=t<0?e.A:e.B;Z.push({x:u[0],z:u[2],period:l,phase:c%1,r:15,loop:e.slot,near:t<0})}}m.forEach((e,t)=>{q.push({x:e.A[0],z:e.A[2],r:e.rf,loop:t,near:!0}),q.push({x:e.B[0],z:e.B[2],r:e.rf,loop:t,near:!1})}),O.forEach(e=>{q.push({x:e.A[0],z:e.A[2],r:e.rf,loop:e.slot,near:!0}),q.push({x:e.B[0],z:e.B[2],r:e.rf,loop:e.slot,near:!1})});const se=[];for(let e=0;e<m.length;e++)se.push([e,1]),e>2&&o.chance(.4)&&se.push([e,-1]);const De=Math.max(4,Math.floor(ht/(se.length+6)));for(const[e,t]of se){const n=m[e],r=n.braided?3:1,l=o.range(.36,.44),f=o.range(95,130);for(let i=0;i<r;i++){const c=n.braided?L[e][(i*3+1+e)%9]:null,d=c?c.off:[o.range(0,6.28),0,o.range(.3,.9),0],x=l*n.len/f,u=o();for(let w=0;w<De;w++)A.push({A:[e,t,l,1],off:d,T:[x,u+w/De,o.range(10,20),c?c.side:1],knot:!1})}}for(const e of O){const t=s.range(.34,.4),n=t*e.len/s.range(100,125);for(let r=0;r<2;r++){const l=L[e.slot][r*3+1],f=s(),i=Math.max(4,Math.round(9*C));for(let c=0;c<i;c++)A.push({A:[e.slot,1,t,1],off:l.off,T:[n,f+c/i,s.range(10,18),1],knot:!1})}}await h.yield?.(),A.sort((e,t)=>(t.knot?1:0)-(e.knot?1:0));const yt=A.filter(e=>e.knot).length,He=new Float32Array(A.length*4),Le=new Float32Array(A.length*4),je=new Float32Array(A.length*4);A.forEach((e,t)=>{He.set(e.A,t*4),Le.set(e.off,t*4),je.set(e.T,t*4)});const ie=4,Qe=[],$e=[];for(let e=0;e<=ie;e++)Qe.push(-1,e/ie,0,1,e/ie,0);for(let e=0;e<ie;e++){const t=e*2;$e.push(t,t+1,t+2,t+2,t+1,t+3)}const z=new a.InstancedBufferGeometry;z.setAttribute("position",new a.Float32BufferAttribute(Qe,3)),z.setIndex($e),z.setAttribute("aA",new a.InstancedBufferAttribute(He,4)),z.setAttribute("aOff",new a.InstancedBufferAttribute(Le,4)),z.setAttribute("aT",new a.InstancedBufferAttribute(je,4)),z.instanceCount=A.length;const bt=D({side:a.DoubleSide,vertexShader:Ie+`
      attribute vec4 aA, aOff, aT;
      varying vec2 vUV; varying vec4 vP, vQ;
      void main() {
        int i = int(aA.x + 0.5);
        float q, grow, alive; float sH = dropS(i, aA, aT, q, grow, alive);
        float len = uRG[i].w, bead = step(0.5, aA.w), size = aT.z;
        float headLen = mix(size * 0.7, size, bead);
        float kn = step(0.2, aA.w) * (1.0 - bead);                                    // this drop carries a modelled knot
        float tail = mix((40.0 + 80.0 * q) * (0.7 + 0.06 * size) * (1.0 + 0.35 * kn), 0.0, bead) + headLen;   // 40 m while it hangs, 60-120 m (knots to 160 m) falling
        float s = clamp(sH + aA.y * (headLen - position.y * tail) / len, -uFoot[i].z, 1.0 + uFoot[i].w);
        vec3 T; vec3 c = arcOff(i, s, aOff, aT.w, T);
        vec3 wc = (modelMatrix * vec4(c, 1.0)).xyz, Tw = mat3(modelMatrix) * T;
        vec3 V = cameraPosition - wc; float dist = length(V);
        vec3 sv = normalize(cross(Tw, V) + vec3(1e-4, 0.0, 0.0));
        float w0 = size * 0.5 * grow * (1.0 + 0.9 * kn);                             // a knot's head is its soft halo
        float w = mix(w0 * mix(1.0, 0.3 / (1.0 + 0.9 * kn), position.y), 2.2, bead);
        float wmin = 0.8 * uPx * dist, wr = sqrt(w / max(w, wmin)), dim = wr * (0.45 + 0.55 * wr);
        w = max(w, wmin);
        wc += sv * position.x * w;
        vUV = position.xy;
        float fd = smoothstep(uFar.x, uFar.y, dist);
        vP = vec4(bead + 0.25 * kn, alive * dim * (1.0 - 0.45 * fd) * mix(0.42, 1.0, smoothstep(50.0, 260.0, dist)), headLen / tail, aT.y * 37.0 + aOff.x);   // close to the lens a drop covers many pixels: thinner, so a shower never sums to white
        vQ = vec4(q, tail / max(max(w0, wmin), 0.01), grow, uMisc[i].w);
        vec4 mvPosition = viewMatrix * vec4(wc, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        ${H}
      }`,fragmentShader:`
      varying vec2 vUV; varying vec4 vP, vQ;
      void main() {
        float x = vUV.x, y = vUV.y, hy = vP.z;
        float ex = exp(-x * x * 3.2) * (1.0 - x * x);
        vec3 col;
        if (vP.x > 0.5) {
          float cap = ex * smoothstep(0.0, 0.16, y) * (1.0 - smoothstep(0.25, 1.0, y));
          col = (cGold * 0.85 + vec3(1.0, 0.92, 0.75) * 0.45 * cap) * cap;
        } else {
          float dy = (y - hy) * vQ.y;
          float kn = step(0.2, vP.x);
          float head = exp(-(x * x * 2.6 + dy * dy * 1.1)) * (1.0 - x * x) * vQ.z;
          float lumps = 0.45 + 0.75 * vnoise(vec2(y * vQ.y * 0.22 + vP.w, vP.w * 3.0), 4096.0);
          float tl = pow(max(1.0 - y, 0.0), 1.3) * smoothstep(0.0, hy, y) * ex * lumps * (0.6 + 0.4 * smoothstep(0.0, 0.1, vQ.x)) * (1.0 + 0.7 * kn);
          head *= 0.5 + 0.5 * smoothstep(0.0, 0.08, vQ.x);
          col = cRoseDeep * (tl + head * 0.25 * kn) + cRose * (tl * 0.85 + head * mix(1.0, 0.16, kn)) + vec3(1.0, 0.82, 0.9) * (head * head * mix(0.6, 0.04, kn) + tl * tl * 0.25 * kn);
        }
        col *= vP.y;
        //FOG
        gl_FragColor = vec4(max(col, 0.0), 1.0);
      }`}),ye=new a.Mesh(z,bt);ye.frustumCulled=!1,ye.renderOrder=4,G.add(ye),await h.yield?.();const We=`
    float lump(vec3 p, float sd, float amp) {
      return 1.0 + amp * (sin(p.x * 2.9 + sd * 9.0) * sin(p.y * 3.3 + sd * 5.0) * sin(p.z * 2.6 + sd * 7.0)
                 + 0.36 * sin(p.x * 6.1 + sd * 3.0 + uTime * 0.9) * sin(p.y * 5.3 - sd) * sin(p.z * 6.7 + sd * 2.0)
                 + 0.14 * sin(p.x * 13.0 + sd) * sin(p.y * 12.0 + uTime * 1.3) * sin(p.z * 11.0));
    }
    // a knot: a lumpy head drawn out behind (-z) into a short teardrop, longer the faster it falls (q)
    vec3 shp(vec3 p, float sd, float q) {
      vec3 v = p * lump(p, sd, 0.27);
      float back = smoothstep(0.1, -1.0, p.z);
      v.z *= mix(1.2, 1.9 + 2.1 * q, back);
      v.xy *= 1.0 - 0.62 * back * (0.5 + 0.5 * q);
      return v;
    }
    // the climb blob: a smooth teardrop 4.7 radii long whose tail thins to a wavering point
    vec3 tear(vec3 p, float sd, float q) {
      vec3 v = p * lump(p, sd, 0.1);
      float back = smoothstep(0.25, -1.0, p.z);
      v.z *= mix(1.15, 3.6, back);
      v.xy *= 1.0 - 0.84 * back * back;
      v.xy += vec2(sin(v.z * 0.9 + uTime * 1.7), cos(v.z * 0.7 + uTime * 1.3)) * 0.1 * back;
      return v;
    }
    vec3 shpN(vec3 p, float sd, float q, out vec3 P0) {
      vec3 t1 = normalize(cross(p, vec3(0.31, 0.9, 0.3))), t2 = cross(p, t1);
      P0 = SHAPE(p, sd, q);
      return normalize(cross(SHAPE(normalize(p + t1 * 0.07), sd, q) - P0, SHAPE(normalize(p + t2 * 0.07), sd, q) - P0));
    }`,Xe=`
      varying vec3 vN, vView, vL; varying vec4 vK;     // vK: gain, seed, gold 0..1, dissolve threshold
      void main() {
        vec3 n = normalize(vN);
        float ndv = abs(dot(n, normalize(vView)));
        float mott = vnoise(vL.xy * 2.3 + vL.z * 1.7 + vK.y, 4096.0);
        float m2 = vnoise(vL.yz * 5.1 - vL.x * 2.3 + vK.y * 3.0 + uTime * 0.35, 4096.0);
        if (vK.w < mott) discard;
        float thick = pow(ndv, 2.4), core = thick * thick;         // soft to the rim, even on a long body seen side-on
        vec3 deep = mix(cRoseDeep * 1.4, cAmber, vK.z), body = mix(cRose, cGold, vK.z), hot = mix(vec3(1.0, 0.76, 0.86), vec3(1.0, 0.94, 0.78), vK.z);
        vec3 col = deep * thick * (0.3 + 0.4 * mott) + body * core * mix(0.45 + 0.5 * mott, 0.4 + 0.4 * mott, vK.z) * (0.7 + 0.6 * m2)
                 + hot * core * core * core * mix(0.34 + 0.3 * m2, 0.4 + 0.3 * m2, vK.z)
                 + cGold * max(0.0, -n.y) * 0.14 * thick * (1.0 - vK.z);       // the ground is the lamp
        col *= vK.x;
        //FOG
        gl_FragColor = vec4(max(col, 0.0), clamp(thick * 0.8 * vK.x, 0.0, 1.0));
      }`,be=new a.IcosahedronGeometry(1,3),Q=new a.InstancedBufferGeometry;Q.setAttribute("position",be.getAttribute("position")),Q.setAttribute("aA",z.getAttribute("aA")),Q.setAttribute("aOff",z.getAttribute("aOff")),Q.setAttribute("aT",z.getAttribute("aT")),Q.instanceCount=yt;const Ye=D({vertexShader:Ie+We.replace(/SHAPE/g,"shp")+`
      attribute vec4 aA, aOff, aT;
      varying vec3 vN, vView, vL; varying vec4 vK;
      void main() {
        int i = int(aA.x + 0.5);
        float q, grow, alive; float sH = dropS(i, aA, aT, q, grow, alive);
        vec3 T; vec3 c = arcOff(i, sH, aOff, aT.w, T);
        vec3 m = T * aA.y, n1 = normalize(cross(m, uN[i])), n2 = cross(m, n1);
        float sd = aT.y * 17.3 + aOff.x, ca = cos(sd * 5.0 + uTime * 0.25), sn = sin(sd * 5.0 + uTime * 0.25);
        vec3 p = position; p.xy = mat2(ca, -sn, sn, ca) * p.xy;
        vec3 P0; vec3 nl = shpN(p, sd, q, P0);
        float r = aT.z * 0.5 * grow * alive;
        vec3 lp = c + (n1 * P0.x + n2 * P0.y + m * P0.z) * r;
        vec4 wp = modelMatrix * vec4(lp, 1.0);
        vN = mat3(modelMatrix) * (n1 * nl.x + n2 * nl.y + m * nl.z); vView = cameraPosition - wp.xyz; vL = P0;
        vK = vec4(1.0 - 0.4 * smoothstep(uFar.x, uFar.y, length(vView)), sd, 0.0, 2.0);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        ${H}
      }`,fragmentShader:Xe}),Ze=e=>(e.blending=a.CustomBlending,e.blendEquation=a.AddEquation,e.blendSrc=a.OneFactor,e.blendDst=a.OneMinusSrcAlphaFactor,e);Ze(Ye);const Ae=new a.Mesh(Q,Ye);Ae.frustumCulled=!1,Ae.renderOrder=5,G.add(Ae);const le=D({uniforms:{uFade:{value:0}},vertexShader:We.replace(/SHAPE/g,"tear")+`
      uniform float uFade;
      varying vec3 vN, vView, vL; varying vec4 vK;
      void main() {
        vec3 P0; vec3 nl = shpN(position, 3.7, 1.0, P0);
        vec4 wp = modelMatrix * vec4(P0, 1.0);
        vN = mat3(modelMatrix) * nl; vView = cameraPosition - wp.xyz; vL = P0;
        vK = vec4(0.95 * uFade, 3.7, 1.0, uFade * 1.3 - 0.15);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        ${H}
      }`,fragmentShader:Xe});Ze(le);const S=new a.Mesh(be,le);S.scale.setScalar(5.5),S.visible=!1,S.frustumCulled=!1,S.renderOrder=5,G.add(S);const Je=new a.PlaneGeometry(2,1,1,10);Je.translate(0,.5,0);const et={value:new a.Vector3},tt={value:new a.Vector3(0,1,0)},At=D({side:a.DoubleSide,uniforms:{uFade:le.uniforms.uFade,uBP:et,uBA:tt},vertexShader:`
      uniform vec3 uBP, uBA;
      varying vec2 vUV;
      void main() {
        vec3 c = uBP + uBA * (18.0 - position.y * 84.0);            // 18 m ahead of the body's centre to 66 m behind it
        vec3 wc = (modelMatrix * vec4(c, 1.0)).xyz, aw = mat3(modelMatrix) * uBA;
        vec3 sv = normalize(cross(aw, cameraPosition - wc) + vec3(1e-4, 0.0, 0.0));
        wc += sv * position.x * 18.0;
        vUV = position.xy;
        vec4 mvPosition = viewMatrix * vec4(wc, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        ${H}
      }`,fragmentShader:`
      uniform float uFade;
      varying vec2 vUV;
      void main() {
        float xm = vUV.x * 18.0, m = 18.0 - vUV.y * 84.0;
        float halo = exp(-(xm * xm / 105.0 + m * m / (m > 0.0 ? 80.0 : 380.0)));
        float streak = 0.35 + 0.95 * vnoise(vec2(xm * 0.33 + 3.0, m * 0.08 + uTime * 1.5), 4096.0);
        float tail = (1.0 - step(0.0, m)) * exp(m / 24.0) * exp(-xm * xm / (10.0 + 0.5 * abs(m))) * streak * smoothstep(0.0, 9.0, -m);
        vec3 col = cGold * 0.3 * halo + mix(cAmber, cGold, 0.45) * 0.4 * tail + vec3(1.0, 0.9, 0.7) * 0.07 * halo * halo;
        col *= uFade * (1.0 - vUV.x * vUV.x) * smoothstep(0.0, 0.07, vUV.y) * (1.0 - smoothstep(0.8, 1.0, vUV.y));
        //FOG
        gl_FragColor = vec4(max(col, 0.0), 1.0);
      }`}),ee=new a.Mesh(Je,At);ee.visible=!1,ee.frustumCulled=!1,ee.renderOrder=4,G.add(ee),await h.yield?.();const N=[],U=[],B=[];for(const e of q){const t=ge[e.loop],n=e.near?t.ga:t.gb;N.push(e.x,n+3.5,e.z,e.r*3.4),U.push(1,0,.32,0),B.push(0),N.push(e.x,n,e.z,e.r*2.6),U.push(1,0,.16,0),B.push(1)}for(const e of Z){const t=ge[e.loop],n=e.near?t.ga:t.gb;N.push(e.x,n+3.8,e.z,34),U.push(e.period,e.phase,0,2.6),B.push(0),N.push(e.x,n,e.z,30),U.push(e.period,e.phase,0,1.5),B.push(1)}N.push(F.x,0,F.z,50),U.push(1,0,0,0),B.push(2),N.push(F.x,4,F.z,58),U.push(1,0,0,0),B.push(3);const _=new a.InstancedBufferGeometry;_.setAttribute("position",new a.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),_.setIndex([0,1,2,0,2,3]),_.setAttribute("aS",new a.InstancedBufferAttribute(new Float32Array(N),4)),_.setAttribute("aF",new a.InstancedBufferAttribute(new Float32Array(U),4)),_.setAttribute("aG",new a.InstancedBufferAttribute(new Float32Array(B),1)),_.instanceCount=B.length;const ot={value:0},Mt=D({side:a.DoubleSide,uniforms:{uKernel:ot},vertexShader:`
      attribute vec4 aS, aF; attribute float aG;
      uniform float uKernel;
      varying vec2 vUV; varying vec4 vG; varying float vR;
      void main() {
        float f = fract(uTime / aF.x + aF.y + 0.13);
        float pulse = smoothstep(0.0, 0.02, f) * (1.0 - smoothstep(0.08, 0.2, f));
        float I = aF.z * (0.85 + 0.15 * sin(uTime * 1.7 + aS.x)) + aF.w * pulse;
        if (aG > 1.5) I = uKernel * 4.0;
        vec3 c = (modelMatrix * vec4(aS.xyz, 1.0)).xyz;
        float flat_ = step(abs(aG - 1.5), 1.0) < 0.5 ? 1.0 : 0.0;       // kinds 0 and 3 lie on the surface
        vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
        vec3 wp = flat_ > 0.5 ? c + vec3(position.x, 0.0, position.y) * aS.w
                              : c + right * position.x * aS.w + vec3(0.0, 1.0, 0.0) * (position.y * 0.5 + 0.42) * aS.w;
        vUV = position.xy;
        vG = vec4(I, flat_, f / 0.2, aG);
        vR = flat_ * step(0.01, aF.w) * (1.0 - min(f / 0.2, 1.0));
        vec4 mvPosition = viewMatrix * vec4(wp, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        ${H}
      }`,fragmentShader:`
      varying vec2 vUV; varying vec4 vG; varying float vR;
      void main() {
        float d = length(vUV), edge = 1.0 - smoothstep(0.7, 1.0, d);
        float kq = step(1.5, vG.w);
        float g = exp(-d * d * mix(6.0, 9.0, kq)), g2 = exp(-d * d * mix(22.0, 40.0, kq));
        float ring = exp(-(d - vG.z * 0.85) * (d - vG.z * 0.85) * 90.0) * vR;
        vec3 tint = vG.w > 1.5 ? cViolet : cRose;
        vec3 col = (tint * (g * 0.8 + ring * 0.6) + vec3(1.0, 0.9, 0.93) * g2 * 0.7) * vG.x * edge;
        if (vG.y < 0.5) col *= 0.75 + 0.25 * smoothstep(-0.84, -0.6, vUV.y);
        //FOG
        gl_FragColor = vec4(max(col, 0.0), 1.0);
      }`}),Me=new a.Mesh(_,Mt);Me.frustumCulled=!1,Me.renderOrder=3,G.add(Me);const zt=new a.Vector3().copy(M[P]),ze=new a.Vector3(0,209,480),at=new a.Vector3(0,1040,0),$=new a.Vector3().subVectors(at,ze).normalize(),ce=new a.Vector3,Pt=new a.Vector3(0,0,1),nt=new a.Vector3(0,-$.z,$.y),rt=new a.Vector3().copy($).multiplyScalar(Math.cos(.733)).addScaledVector(nt,Math.sin(.733)*.8).add(new a.Vector3(Math.sin(.733)*.6,0,0)).normalize();function Pe(e,t){ot.value=Math.max(0,Math.min(1,e));const n=Math.max(0,Math.min(1,t)),r=1-(1-n)*(1-n);M[P].copy(zt).multiplyScalar(Math.max(4,Be*r)),E[P].z=Math.min(1,n*6)*(1.5-.6*n),E[P].w=p*Math.sqrt((V[P].lengthSq()+M[P].lengthSq())/2)}function Fe(e,t=1){S.visible=ee.visible=!!e&&t>.01,S.visible&&(S.position.copy(e),S.quaternion.setFromUnitVectors(Pt,rt),et.value.copy(e),tt.value.copy(rt),le.uniforms.uFade.value=t)}const te=h.core?.smoothstep??((e,t,n)=>{const r=Math.max(0,Math.min(1,(n-e)/(t-e)));return r*r*(3-2*r)});function Ft(e){Pe(te(.606,.615,e)*(1-te(.615,.66,e)),te(.61,.675,e));const t=te(.725,.755,e)*(1-te(.895,.93,e));if(t>.01){const n=Math.max(0,Math.min(1,(e-.74)/.19)),r=1-.38*n;ce.copy(ze).addScaledVector($,Math.max(0,(e-.74)/.26)*960+90),ce.x-=25*r,ce.addScaledVector(nt,-18*r),Fe(ce,t)}else Fe(null)}Pe(0,0);const v=(e,t,n)=>new a.Vector3(e,t,n),Ve=e=>v(m[e].A[0],m[e].ga,m[e].A[2]),Vt={worldOffset:v(0,0,-3040),entry:v(0,400,3040),crown:v(0,1040,0),eye:{center:v(0,1040,0),halfWidth:19,halfLength:45},portalSeat:{position:v(0,1040,0),normal:$.clone().negate(),radius:10,clearWidth:38},climbLine:{from:ze.clone(),to:at.clone(),dir:$.clone()},flyThrough:[v(-120,85,1140),v(-30,86,1010),v(60,88,900),v(88,90,800),v(78,96,720),v(63,104,650),v(30,135,575),v(6,180,510),v(0,209,480),v(0,1040,0)],legPass:{L1:Ve(0),L4:Ve(1),L7:Ve(2),camera:v(88,90,800),look:v(40,150,560)},spotCentre:v(-120,0,1140),spot2Centre:v(150,0,-660),feet:q,splashes:Z,kernel:F.clone(),flareLoop:{from:F.clone(),to:Ge.clone(),height:Be},loops:m.map((e,t)=>({name:e.name,near:v(...e.A),far:v(...e.B),crown:xe(t,.5),braided:e.braided,radius:e.rc})),ribs:O.map(e=>({name:e.name,near:v(...e.A),far:v(...e.B),crown:xe(e.slot,.5),radius:e.rc}))},Tt=new a.Vector2;function St(e,t,n){if(Y.uTime.value=t,n){let r=720;h.renderer?.getDrawingBufferSize&&(r=Math.max(1,h.renderer.getDrawingBufferSize(Tt).y)),Y.uPx.value=2/(Math.max(.1,n.projectionMatrix.elements[5])*r)}}return{object:G,radius:700,height:1070,center:v(0,480,0),anchors:Vt,update:St,setProgress:Ft,setFlare:Pe,setBlob:Fe,loopPoint:xe,splashes:Z,feet:q,uniforms:Y,dispose(){be.dispose()},ground:!0,groundY:0}}export{Ut as buildHero};
