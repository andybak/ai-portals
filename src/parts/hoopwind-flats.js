import*as e from"three";const _=Math.PI*2,z=110,E=105.35,Q=104.2,O=32,te=28.9,rt=["#C9C0AE","#B9B3E6","#F28FA6","#F5B24A","#58C7B0","#E8DCC0","#5B4C8C"];function it(){return{pos:[],aA:[],aB:[],idx:[],n:0,seams:[]}}function We(t,s,o,r){const b=[];let h=0;for(;h<s;){const p=o*t.range(.4,1.8);b.push(p),h+=p}const x=s/h,v=[],m=b.map(()=>.26+t.range(-.09,.09));m.push(m[0]);let w=0,i=0,f=0;for(const p of b){const n=p*x,l=n/s*_,c=t();f<=0&&t.chance(.12)&&(f=t.int(1,2));const d=f>0;f--;const u=r*(d?t.range(1.3,1.9):t.range(.25,.8)),S=Math.min(.16,n*.1)/n;v.push({a:w,h:1,edge:1,seed:c,amp:u,skew:m[i]}),v.push({a:w+l*t.range(.38,.52),h:t.range(.38,.55),edge:0,seed:c,amp:u,skew:(m[i]+m[i+1])*.5}),v.push({a:w+l*(1-S),h:0,edge:1,seed:c,amp:u,skew:m[i+1]}),w+=l,i++}return v}async function Ie(t,s,o,r,b,h,x,v,m){const w=t.n,i=s.length,f=o.length+1;for(let p=0;p<f;p++){(p&31)===0&&await m.yield?.();const n=o[p%o.length],l=p===o.length?_:n.a,c=x*(Math.sin(l*9+1.3)*.6+Math.sin(l*23+4.1)*.4);for(let d=0;d<i;d++){const u=s[d],S=u.r-r,g=u.z,F=Math.hypot(S,g)||1,V=u.terr*(n.amp*n.h+c),C=u.r+S/F*V,A=u.z+g/F*V,T=l+n.skew*Math.hypot(u.r-v,u.z*.6)/u.r,R=Math.cos(T),L=Math.sin(T);t.pos.push(C*R,C*L,A),t.aA.push(u.kind,u.wear,n.h,n.edge),t.aB.push(l*h,u.pc,n.seed)}}for(let p=0;p<f-1;p++){(p&127)===0&&await m.yield?.();for(let n=0;n<i-1;n++){const l=w+p*i+n,c=l+i,d=l+1,u=c+1;b?t.idx.push(l,d,c,c,d,u):t.idx.push(l,c,d,c,u,d)}}t.seams.push({a:w,b:w+(f-1)*i,n:i}),t.n+=f*i}function Ee(t){const s=t.map(o=>({terr:0,wear:0,kind:0,pc:0,...o}));for(let o=t.length-1;o>=0;o--){const r=s[o];s.push({...r,z:-r.z})}return s}const st=[{r:110,z:0,terr:.04,wear:1},{r:109.62,z:.3,terr:.14,wear:.9},{r:109.05,z:.86,terr:.38,wear:.7},{r:108.2,z:1.38,terr:1,wear:.05},{r:107.35,z:1.52,terr:1},{r:106.7,z:1.4,terr:.8},{r:106.3,z:1.12,terr:.45},{r:106.18,z:.8,terr:.1},{r:106.18,z:.8,kind:1,pc:-1},{r:105.92,z:.93,kind:1,pc:-.6},{r:105.5,z:1.02,kind:1,pc:-.2},{r:105.1,z:.98,kind:1,pc:.2},{r:104.78,z:.8,kind:1,pc:.6},{r:104.58,z:.5,kind:1,pc:1},{r:104.58,z:.5,terr:.12},{r:104.3,z:.24,terr:.1},{r:103.85,z:.05}],lt=[{r:32.3,z:.06},{r:31.85,z:.34,terr:.3},{r:31.4,z:.66,terr:.7},{r:30.7,z:.86,terr:1},{r:29.9,z:.72,terr:.8,wear:.1},{r:29.2,z:.3,terr:.2,wear:.85},{r:te,z:0,terr:.04,wear:1}];function ct(t,s){const o=[],r=_/s,b=t()*_,h=v=>v*v*(3-2*v),x=(v,m,w,i,f,p,n,l,c,d)=>{const u=[],S=t()*_,g=t.range(1.4,2.6),F=t.range(.006,.014)*(l?.6:1);for(let V=0;V<=f;V++){const C=V/f,A=w+(i-w)*C,T=v+(m-v)*h(C)+F*Math.sin(Math.PI*C)*Math.sin(C*g*Math.PI+S);let R=p+(n-p)*C;c&&(R+=c*Math.exp(-(w-A)/2.2)),d&&(R+=d*Math.exp(-(A-i)/1.3)),u.push({x:A*Math.cos(T),y:A*Math.sin(T),w:R,r:A,th:T})}return o.push({pts:u,level:l,seed:t()}),m};for(let v=0;v<s;v++){const m=b+v*r+t.range(-.16,.16)*r,w=t.range(72,83),i=t.range(47,58),f=t.range(47,58);x(m,m,Q+.5,w,18,.82,.64,0,.9,0);let p=0;for(const n of[-1,1]){const l=p++?f:i,c=m+n*r*.25*(1+t.range(-.14,.14));x(m,c,w,l,14,.56,.44,1,0,0);for(const d of[-1,1]){const u=c+d*r*.125*(1+t.range(-.16,.16));x(c,u,l,O-.1,11,.36,.2,2,0,.22)}}}return o.off=b,o}async function ut(t,s,o){let b=0;for(const h of s){(b++&7)===0&&await o.yield?.();const x=t.n,v=h.pts,m=v.length;let w=0;for(let i=0;i<m;i++){const f=v[i],p=v[Math.max(0,i-1)],n=v[Math.min(m-1,i+1)];let l=n.x-p.x,c=n.y-p.y;const d=Math.hypot(l,c)||1;l/=d,c/=d,i>0&&(w+=Math.hypot(f.x-v[i-1].x,f.y-v[i-1].y));const u=1+.12*Math.sin(w*1.9+h.seed*40);for(let S=0;S<6;S++){const g=S/6*_,F=Math.cos(g)*f.w*.5*u,V=Math.sin(g)*f.w*.4*u;t.pos.push(f.x-c*F,f.y+l*F,V),t.aA.push(2,0,0,0),t.aB.push(w,h.level,h.seed)}}for(let i=0;i<m-1;i++)for(let f=0;f<6;f++){const p=x+i*6+f,n=x+(i+1)*6+f,l=x+i*6+(f+1)%6,c=x+(i+1)*6+(f+1)%6;t.idx.push(p,l,n,n,l,c)}t.n+=m*6}}async function ft(t,s){const o=t.index,r=t.getAttribute("position"),b=new e.BufferAttribute(new Float32Array(r.count*3),3);t.setAttribute("normal",b);const h=new e.Vector3,x=new e.Vector3,v=new e.Vector3,m=new e.Vector3,w=new e.Vector3,i=new e.Vector3,f=new e.Vector3,p=new e.Vector3;for(let n=0,l=o.count;n<l;n+=3){n%3072===0&&await s.yield?.();const c=o.getX(n+0),d=o.getX(n+1),u=o.getX(n+2);h.fromBufferAttribute(r,c),x.fromBufferAttribute(r,d),v.fromBufferAttribute(r,u),f.subVectors(v,x),p.subVectors(h,x),f.cross(p),m.fromBufferAttribute(b,c),w.fromBufferAttribute(b,d),i.fromBufferAttribute(b,u),m.add(f),w.add(f),i.add(f),b.setXYZ(c,m.x,m.y,m.z),b.setXYZ(d,w.x,w.y,w.z),b.setXYZ(u,i.x,i.y,i.z)}for(let n=0,l=b.count;n<l;n++)(n&2047)===0&&await s.yield?.(),h.fromBufferAttribute(b,n),h.normalize(),b.setXYZ(n,h.x,h.y,h.z);b.needsUpdate=!0}async function dt(t,s){const o=new e.BufferGeometry;o.setAttribute("position",new e.Float32BufferAttribute(t.pos,3)),await s.yield?.(),o.setAttribute("aA",new e.Float32BufferAttribute(t.aA,4)),o.setAttribute("aB",new e.Float32BufferAttribute(t.aB,3)),await s.yield?.(),o.setIndex(t.n>65535?new e.Uint32BufferAttribute(t.idx,1):new e.Uint16BufferAttribute(t.idx,1)),await s.yield?.(),await ft(o,s),await s.yield?.();const r=o.attributes.normal.array;for(const b of t.seams)for(let h=0;h<b.n;h++){const x=(b.a+h)*3,v=(b.b+h)*3;let m=r[x]+r[v],w=r[x+1]+r[v+1],i=r[x+2]+r[v+2];const f=Math.hypot(m,w,i)||1;m/=f,w/=f,i/=f,r[x]=r[v]=m,r[x+1]=r[v+1]=w,r[x+2]=r[v+2]=i}return o.boundingSphere=new e.Sphere(new e.Vector3(0,0,0),z+4),o}async function ht(t,s,o,r){const b=document.createElement("canvas");b.width=b.height=o;const h=b.getContext("2d"),x=o,v=x/(2*z),m=n=>(.5+n/(2*z))*x,w=n=>(.5-n/(2*z))*x;h.fillStyle="#000",h.fillRect(0,0,x,x),await r.yield?.(),h.globalCompositeOperation="lighter",h.lineCap="round",h.lineJoin="round";for(let n=0;n<260;n++){(n&31)===0&&await r.yield?.();const l=Math.sqrt(t.range(.09,.92))*z,c=t()*_,d=m(l*Math.cos(c)),u=w(l*Math.sin(c)),S=t.range(3,15)*v,g=h.createRadialGradient(d,u,0,d,u,S);g.addColorStop(0,"rgba(0,0,255,"+t.range(.1,.3).toFixed(3)+")"),g.addColorStop(1,"rgba(0,0,255,0)"),h.fillStyle=g,h.fillRect(d-S,u-S,S*2,S*2)}const i=(n,l,c,d,u,S)=>{h.strokeStyle=S,h.lineWidth=Math.max(1,u*v),h.beginPath(),h.moveTo(m(n),w(l)),h.lineTo(m(c),w(d)),h.stroke()},f=(n,l,c,d,u,S)=>{let g=n,F=l,V=c;const C=5,A=t.range(-.5,.5);for(let T=0;T<C;T++){const R=Math.hypot(g,F);let G=Math.atan2(-F,-g)-V;G=Math.atan2(Math.sin(G),Math.cos(G)),V+=G*.16+A/C;const U=g+Math.cos(V)*d/C,j=F+Math.sin(V)*d/C,oe=Math.hypot(U,j);if(oe>Q-.3||oe<O+.3||R<O)return;i(g,F,U,j,u*(1-.5*T/C),"rgba(0,255,0,0.85)"),S>0&&T>0&&t.chance(.7)&&f(U,j,V+t.sign()*t.range(.5,1),d*t.range(.3,.5),u*.55,S-1),g=U,F=j}};for(const n of s){await r.yield?.();const l=n.pts;let c=t.sign(),d=t.range(0,3);for(let u=1;u<l.length;u++){const S=l[u-1],g=l[u],F=Math.hypot(g.x-S.x,g.y-S.y),V=Math.atan2(g.y-S.y,g.x-S.x);d+=F;const C=1.6+g.r*.026;for(;d>C;){await r.yield?.(),d-=C;const A=t(),T=g.r*t.range(.07,.17)*(n.level===0?1.25:1);f(S.x+(g.x-S.x)*A,S.y+(g.y-S.y)*A,V+c*t.range(.45,.95),T,.3,2),c=-c}}}for(const n of s){await r.yield?.();for(let l=1;l<n.pts.length;l++){const c=n.pts[l-1],d=n.pts[l],u=(c.w+d.w)*.5;i(c.x,c.y,d.x,d.y,u*3.4,"rgba(255,0,0,0.16)"),i(c.x,c.y,d.x,d.y,u*2,"rgba(255,0,0,0.3)"),i(c.x,c.y,d.x,d.y,u*1.05,"rgba(255,0,0,1)")}}await r.yield?.();const p=new e.CanvasTexture(b);return p.colorSpace=e.NoColorSpace,p.anisotropy=8,p.generateMipmaps=!0,p.minFilter=e.LinearMipmapLinearFilter,p.magFilter=e.LinearFilter,p}const N=`
const float PI = 3.14159265;
const float RR = ${z.toFixed(1)};
const float RO = ${Q.toFixed(2)};
const float RI = ${O.toFixed(2)};
uniform float uTime, uRoll, uDrum, uGroundY;
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol;
vec3 nrm(vec3 v){ return v / max(length(v), 1e-5); }
float hash11(float n){ return fract(sin(n) * 43758.5453); }
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y);
}
float fbm(vec2 p){ return vnoise(p) * .5 + vnoise(p * 2.03 + 7.1) * .3 + vnoise(p * 4.1 + 3.7) * .2; }
vec2 unroll(vec2 p){ float c = cos(uRoll), s = sin(uRoll); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
// drum displacement of the membrane (metres along the hub axis); p = disc coordinates that turn with the wheel
float drumH(vec2 p){
  float r = length(p);
  float e = clamp((r - RI) / (RO - RI), 0., 1.);
  float env = sin(PI * e);
  vec2 q = unroll(p);
  float a = atan(q.y, q.x + step(r, 1e-4));
  float h = .55 * sin(2. * a - .9 * uTime) + .42 * sin(3. * a + 1.4 * uTime + 2. * e)
          + .3 * sin(5. * a - 2.1 * uTime) * sin(2. * PI * e) + .11 * sin(q.x * .33 + q.y * .07 + uTime * 4.6);
  return h * env * uDrum;
}
float fogF(float depth, float density, float nearV, float farV){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1. - exp(-density * density * depth * depth);
    #else
      return smoothstep(nearV, farV, depth);
    #endif
  #else
    return 0.;
  #endif
}
`,vt=`
attribute vec4 aA; attribute vec3 aB;
varying vec4 vA; varying vec3 vB; varying vec3 vN; varying vec3 vW; varying vec3 vP;
#include <fog_pars_vertex>
${N}
void main(){
  vec3 p = position; vec3 n = normal;
  if (aA.x > 1.5) {
    float h = drumH(p.xy), d = 1.5;
    float hx = (drumH(p.xy + vec2(d, 0.)) - h) / d, hy = (drumH(p.xy + vec2(0., d)) - h) / d;
    p.z += h; n = n - vec3(hx, hy, 0.) * n.z;
  }
  vA = aA; vB = aB; vP = position;
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz; vN = nrm(mat3(modelMatrix) * n);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,mt=`
uniform vec3 uHorn, uAmber, uRose, uOchre, uPlum, uSalt;
uniform vec2 uBead;
varying vec4 vA; varying vec3 vB; varying vec3 vN; varying vec3 vW; varying vec3 vP;
#include <fog_pars_fragment>
${N}
void main(){
  vec3 N = nrm(vN);
  vec3 V = nrm(cameraPosition - vW);
  float kind = vA.x, wear = vA.y, h = vA.z, edge = vA.w;
  float s = vB.x, seed = vB.z;
  float fw = fwidth(s);
  float isVein = step(1.5, kind);
  float isGlass = step(.5, kind) * (1. - isVein);
  float rr = length(vP.xy);
  float n1 = fbm(vec2(s * .35, vP.z * .6 + seed * 9.));
  float n2 = vnoise(vec2(s * 3.1, vP.z * 2.3 + rr * 2.3));
  float nl = dot(N, uSunDir);
  float dif = max(nl, 0.), back = max(-nl, 0.);
  vec3 hemi = mix(uGndCol, uSkyCol, N.y * .5 + .5);
  vec3 H = nrm(uSunDir + V + vec3(0., 1e-4, 0.));
  float nh = max(dot(N, H), 1e-4);
  float lit1 = step(0., nl);

  // ---- horn
  // pale ivory, built in annuli like a ram's horn: three or four fine growth rings to every terrace, each rising
  // fast and falling slowly, amber only in the creases (no long fibres: those read as timber)
  vec3 horn = uHorn * (.68 + .26 * n1);
  float streak = vnoise(vec2(s * .12 + seed * 3., rr * 6. + vP.z * 4.));
  horn *= .93 + .14 * streak;
  float gl = s / .36 + .9 * n1 + seed * 3.;
  float gf = fract(gl), gA = clamp(1. - fw * 4.5, 0., 1.) * (1. - isVein);
  float gstep = smoothstep(0., .16, gf) * (1. - .6 * gf);
  horn *= mix(1., .66 + .46 * gstep, gA);
  horn = mix(horn, uAmber * .5, gA * (1. - smoothstep(0., .14, gf)) * .55 * step(.45, hash21(vec2(floor(gl), 7.))));
  float band = smoothstep(.34, .04, h) * (.3 + .7 * seed);
  horn = mix(horn, uAmber * .46, band * .5 * (1. - isVein));
  float rid = sin(s * 38. + n2 * 2.5), ridA = clamp(1. - fw * 23., 0., 1.);
  horn *= 1. - .17 * ridA * (.5 + .5 * rid);
  float rid2 = smoothstep(.72, 1., sin(s * 11.3 + n1 * 5.)) * clamp(1. - fw * 7., 0., 1.);
  horn *= 1. - .2 * rid2;
  float crev = edge * (1. - h);
  horn *= 1. - .62 * crev * crev;
  horn = mix(horn, vec3(.8, .76, .66), .4 * edge * smoothstep(.6, 1., h));
  float lich = smoothstep(.46, .68, fbm(vec2(s * .21 + 3., vP.z * .9 + seed * 5.))) * smoothstep(.5, .05, h) * (1. - isVein);
  vec3 lichCol = mix(uRose * .62, uOchre, step(.55, fract(seed * 7.31)));
  horn = mix(horn, lichCol * (.7 + .5 * n2), lich * .75);
  // the hub ring is never run on: its keel keeps its horn (ivory, amber bands) instead of wearing to chalk,
  // and it takes the sun a little under the rim's so its lit side never clips when we pass it in the eye
  float hubK = smoothstep(42., 35., rr) * (1. - isVein);
  float kw = smoothstep(.3, .8, wear + (n2 - .5) * .4 + (n1 - .5) * .3) * (1. - .3 * hubK);
  horn = mix(horn, horn * vec3(1.1, 1.07, 1.) + uHorn * .08, hubK);      // the same pale horn as the rim, a pale hem round the opening
  horn = mix(horn, vec3(.9, .89, .86), kw);          // the keel, worn chalk white where it runs
  // veins: dark plum horn with knuckled rings
  vec3 veinCol = mix(uPlum * .6, uHorn * .42, .25 + .5 * n1) * (1. - .25 * (.5 + .5 * rid) * ridA);
  horn = mix(horn, veinCol, isVein);
  // salt dust clings low on the wheel
  float dust = smoothstep(10., 0., vW.y - uGroundY) * (.25 + .5 * n2) * (1. - isGlass);
  horn = mix(horn, uSalt, dust * (.18 + .3 * crev));
  // in shade the horn takes the lilac of the sky (the pan under the Wheel lies in its shadow and gives little back)
  vec3 fill = mix(hemi, mix(uGndCol * .6, uSkyCol * 2.9, N.y * .5 + .5), 1. - isVein);
  vec3 col = horn * (uSunCol * dif * (1. - .3 * hubK) + fill);
  col += horn * uAmber * uSunCol * back * .035 * (1. - isVein);        // thick horn lets very little amber through
  float sp = pow(nh, 36.) * .3 + pow(nh, 240.) * kw * 5. * step(.5, n2);
  col += uSunCol * sp * lit1 * (1. - .6 * isVein);
  float vf = 1. - max(dot(N, V), 0.);
  col += isVein * vec3(.9, .24, .2) * uSunCol * vf * vf * (.2 + .8 * back) * .55;   // thin vein edges let the sun through

  // ---- ballast tube: amber glass, plum bead riding ahead of the contact
  vec2 q = unroll(vP.xy);
  float ang = atan(q.x, -q.y + step(rr, 1e-4));       // 0 at the contact, negative ahead (toward -X)
  float arc = ang * ${E.toFixed(2)};
  float pc = vB.y;
  float along = -arc - uBead.x + .7 * sin(uTime * 1.1);
  float halfL = uBead.y + .8 * pc * sin(uTime * 1.7) + .4 * sin(uTime * 2.9 + pc * 2.);
  float endd = abs(along) - halfL;
  // (the slug rides inside the glass: amber wall on either side of it, a rounded meniscus at each end)
  float bead = smoothstep(.45, -.45, endd) * smoothstep(.86, .6, abs(pc) + smoothstep(-3.5, 0., endd) * .5);
  float behind = -along - halfL;
  float drops = step(0., behind) * smoothstep(22., 0., behind) * smoothstep(.7, .8, vnoise(vec2(s * 1.1, pc * 2.5 + seed)));
  bead = max(bead, drops * .85);
  float thick = 1. - pc * pc * .6;
  vec3 honey = mix(uAmber, vec3(1., .74, .3), .2);                   // clear glass, lit from behind: the plum slug reads dark in it
  // a rod of honey glass: clear down its middle (the terraces behind show dimly through it), dense toward its edges
  vec3 through = col * mix(honey, vec3(1.), .5) * 1.3;
  float dense = mix(.12, .96, pc * pc);
  vec3 g = mix(through, honey * (.2 + .34 * thick) * (uSunCol * dif * .8 + hemi), dense);
  vec3 slug = mix(uPlum, vec3(.5, .1, .42), .45) * (.34 + .3 * thick);      // plum wine: a colour, not a gap in the glass
  g = mix(g, slug * (uSunCol * (dif * .8 + back * .35) + hemi * 1.5), bead);
  float clear = 1. - bead * .94;
  float fwd = max(dot(-V, uSunDir), 0.); fwd *= fwd; fwd *= fwd;
  g += honey * uSunCol * clear * (.22 + .78 * thick * thick) * (back * .5 + fwd * .8 + .2) * .42 * (.35 + .65 * dense);     // darker toward its edges, like a rod of glass
  float bub = smoothstep(.86, .96, vnoise(vec2(s * 2.2 - uTime * .9, pc * 4. + uTime * .35)));
  g += honey * .3 * bub * clear;
  float f1 = 1. - max(dot(N, V), 0.); f1 *= f1; f1 *= f1;
  g += uSkyCol * f1 * mix(1.5, .5, bead) + uSunCol * pow(nh, 160.) * 6. * lit1;
  float hl = smoothstep(.07, 0., abs(pc + .4));                               // one hard line of window light along the glass
  g += (uSkyCol * 3.2 + uSunCol * .9 * lit1) * hl * (1. - .4 * bead);
  g += uAmber * uAmber * uSunCol * smoothstep(.22, 0., abs(pc - .5)) * .7 * clear * lit1;   // caustic on the far wall
  col = mix(col, g, isGlass);

  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,je=`
uniform sampler2D uVein;
uniform vec3 uT0, uT1, uT2;      // transmittance of sea-green (eye), amber, rose (rim)
uniform vec4 uBand;              // band edges e1, e2, softness, seed
uniform vec3 uVeinA;             // trunk count, angle of trunk 0, pane density
// p: disc coordinates turning with the wheel. returns the tint of the pane at that point
vec3 paneTint(vec2 p, float e, float a){
  float k = uVeinA.x * (a - uVeinA.y);
  // the bands are scalloped by the veins: rose runs inward along each trunk, green reaches out between forks
  float wob = .042 * cos(k) * smoothstep(0., .5, e) - .028 * cos(2. * k) + .022 * cos(4. * k) * (1. - e)
            + .03 * sin(a * 5. + uBand.w) + .13 * (vnoise(p * .04 + uBand.w) - .5);
  float ee = e + wob;
  vec3 t = mix(uT0, uT1, smoothstep(uBand.x - uBand.z, uBand.x + uBand.z, ee));
  t = mix(t, uT2, smoothstep(uBand.y - uBand.z, uBand.y + uBand.z, ee));
  return mix(t, vec3(1.), .2 * smoothstep(.4, 0., e));      // paler toward the eye
}
// reticulation between the venules, like the cells of a dragonfly wing (F2 - F1 of a jittered grid, periodic in x)
float cellEdge(vec2 p){
  vec2 i = floor(p), f = fract(p); float d1 = 8., d2 = 8.;
  for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
    vec2 g = vec2(float(x), float(y));
    vec2 c = i + g; c.x = mod(c.x, 256.);
    vec2 r = g + vec2(hash21(c), hash21(c + 17.3)) - f; float d = dot(r, r);
    if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
  }
  return sqrt(d2) - sqrt(d1);
}
// transmittance of the membrane at p given the vein map sample; fades = (stretch ripples, radial fibres, cells) 0..1
vec3 paneT(vec2 p, vec4 tx, vec3 fades, out vec3 tint, out float thick){
  float r = length(p);
  float e = clamp((r - RI) / (RO - RI), 0., 1.);
  float a = atan(p.y, p.x + step(r, 1e-4));
  tint = paneTint(p, e, a);
  float rip = .5 + .5 * sin(r * 2.1 + 5. * vnoise(p * .06) + 2. * vnoise(p * .31));
  float fine = .5 + .5 * sin(r * 14. + 6. * vnoise(p * .21));
  float fib = vnoise(vec2(a * 220., r * .07));
  float hem = smoothstep(.022, 0., e) + smoothstep(.982, 1., e);
  thick = uVeinA.z * (.78 + .1 * rip + .05 * fine * fades.x + .13 * fib * fades.y + .75 * tx.b)
        + 1.5 * tx.g + 3.5 * tx.r + 1.6 * hem;
  if (fades.z > 0.) thick += .85 * smoothstep(.1, 0., cellEdge(vec2(a * 40.7437, r * .55))) * fades.z * (1. - tx.r);
  return pow(max(tint, vec3(.02)), vec3(thick)) * (1. - .8 * tx.r) * (1. - .4 * tx.g) * (1. - .3 * hem);
}
`,pt=`
varying vec3 vW; varying vec3 vN; varying vec3 vRad; varying vec2 vP; varying float vDepth;
${N}
void main(){
  vec3 p = position;
  float h = drumH(p.xy), d = 1.2;
  float hx = (drumH(p.xy + vec2(d, 0.)) - h) / d, hy = (drumH(p.xy + vec2(0., d)) - h) / d;
  p.z += h;
  vP = position.xy;
  vec4 wp = modelMatrix * vec4(p, 1.);
  vW = wp.xyz;
  vN = nrm(mat3(modelMatrix) * vec3(-hx * 3., -hy * 3., 1.));   // tilt exaggerated so the sheen visibly slides
  vRad = mat3(modelMatrix) * vec3(position.xy / max(length(position.xy), 1e-3), 0.);
  vec4 mv = viewMatrix * wp;
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,gt=`
uniform vec3 fogColor; uniform float fogDensity, fogNear, fogFar;
uniform float uGlow, uClear, uCells;
varying vec3 vW; varying vec3 vN; varying vec3 vRad; varying vec2 vP; varying float vDepth;
${N}
${je}
void main(){
  float r = length(vP);
  vec4 tx = texture2D(uVein, vP / (2. * RR) + .5);
  float fwr = fwidth(r);
  float fineFade = clamp(1. - fwr * 9., 0., 1.);
  vec3 fades = vec3(fineFade, clamp(1. - fwr / max(r, 1.) * 160., 0., 1.), clamp(1.3 - fwr * 8., 0., 1.) * uCells);
  vec3 tint; float thick;
  vec3 T = paneT(vP, tx, fades, tint, thick) * uClear;
  #ifdef PASS_MULTIPLY
    gl_FragColor = vec4(T, 1.);
  #else
    vec3 V = nrm(cameraPosition - vW);
    vec3 N = nrm(vN);
    if (dot(N, V) < 0.) N = -N;
    float k1 = cos(r * 2.1 + 5. * vnoise(vP * .06) + 2. * vnoise(vP * .31)) * .035 + cos(r * 14. + 6. * vnoise(vP * .21)) * .02 * fineFade;
    vec3 N2 = nrm(N + vRad * k1);
    float nl = dot(N, uSunDir);
    float veil = (1. - .85 * tx.r) * (1. - .5 * tx.g);
    // sunlit side: a milky sheen with dark veins
    vec3 sat = T * T / max(max(T.r, max(T.g, T.b)), 1e-3);
    vec3 milk = mix(sat, vec3(.9), .38) * (.17 + .1 * tx.b + .04 * thick);
    vec3 col = milk * (uSunCol * max(nl, 0.) + mix(uGndCol, uSkyCol, N.y * .5 + .5)) * veil;
    // backlit side: the pane glows with its own tint, like held-up sea glass
    float bl = max(-nl, 0.);
    float gl = smoothstep(0., .5, bl) * (.55 + .45 * bl);
    float fwd = max(dot(-V, uSunDir), 0.); fwd *= fwd; fwd *= fwd * fwd;
    col += sat * uSunCol * (gl * uGlow + fwd * .55);            // (.55: looking sunward through it must not clip)
    // sheen sliding over the stretch ripples, sky in the grazing reflection
    vec3 H = nrm(uSunDir + V + vec3(0., 1e-4, 0.));
    float nh = max(dot(N2, H), 1e-4);
    col += uSunCol * (pow(nh, 60.) * .6 + pow(nh, 18.) * .3 + pow(nh, 5.) * .12) * step(0., nl) * veil;
    float f1 = 1. - max(dot(N2, V), 0.); float fr = f1 * f1 * f1;
    col += uSkyCol * fr * .8;
    // vein bodies catch a little light of their own
    col += vec3(.2, .15, .16) * tx.r * (uSunCol * max(nl, 0.) + uSkyCol) * .5;
    float ff = fogF(vDepth, fogDensity, fogNear, fogFar);
    gl_FragColor = vec4(col * (1. - ff) + fogColor * ff * (1. - T), 1.);
  #endif
}`,wt=`
varying vec2 vD; varying float vH; varying float vDepth;
${N}
void main(){
  vec4 wp = modelMatrix * vec4(position.xy * RR, 0., 1.);
  float h = wp.y - uGroundY;
  vec3 gp = wp.xyz - uSunDir * (h / max(uSunDir.y, .05));
  gp.y = uGroundY + .08;
  vD = position.xy * RR; vH = h;
  vec4 mv = viewMatrix * vec4(gp, 1.);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
}`,yt=`
uniform vec3 fogColor; uniform float fogDensity, fogNear, fogFar;
uniform float uClear, uSoft, uShadowK;
uniform vec3 uFloor, uAmberT;
uniform vec2 uBead;
varying vec2 vD; varying float vH; varying float vDepth;
${N}
${je}
void main(){
  float rm = length(vD);
  float hh = max(vH, 0.);
  float wm = .35 + .014 * hh * uSoft;                    // penumbra, metres in the disc: crisp at the foot
  float c = cos(uRoll), s = sin(uRoll);
  vec2 p = vec2(c * vD.x + s * vD.y, -s * vD.x + c * vD.y);   // into the turning frame of the pane
  vec4 tx = texture2D(uVein, p / (2. * RR) + .5, clamp(log2(1. + hh * .06 * max(uSoft, 0.)), 0., 5.));
  if (rm > RR + wm) discard;
  vec3 tint; float thick;
  vec3 T = paneT(p, tx, vec3(0.), tint, thick) * uClear;
  float ang = atan(vD.x, -vD.y + step(rm, 1e-4));
  float bead = smoothstep(1., -1., abs(-ang * ${E.toFixed(2)} - uBead.x) - uBead.y);
  vec3 tube = uAmberT * .62 * (1. - bead);      // the amber window passes amber; the bead in it casts plain lilac
  vec3 Tt = vec3(1.);
  Tt = mix(Tt, vec3(0.), smoothstep(${te.toFixed(1)} - wm, ${te.toFixed(1)} + wm, rm));
  Tt = mix(Tt, T, smoothstep(32.3 - wm, 32.3 + wm, rm));
  Tt = mix(Tt, tube, smoothstep(104.5 - wm, 104.5 + wm, rm));
  Tt = mix(Tt, vec3(.1, .09, .13), smoothstep(108.3 - wm, 108.3 + wm, rm));      // rim, keel and bead cast plain lilac (no tint of the glass)      // the rim is horn: it passes nothing and casts plain lilac (the sky fill)
  Tt = mix(Tt, vec3(1.), smoothstep(RR - wm, RR + wm, rm));
  float ff = fogF(vDepth, fogDensity, fogNear, fogFar);
  vec3 o = uFloor + (1. - uFloor) * Tt;
  gl_FragColor = vec4(mix(vec3(1.), o, (1. - ff) * uShadowK), 1.);
}`,$e=`
// ballistic position on the fan: u 0 (straight back) .. 1 (out to the side), side -1/+1, tt seconds since leaving the keel
vec3 fanPos(float u, float side, float tt, float jit){
  float phi = mix(.22, 1.32, u);
  float w = sin(u * 7. + uTime * 2.3 + side) * .5 + .5;
  float sp = mix(13.5, 8., u) * (.9 + .16 * w) * (1. + jit);
  float el = mix(.78, .28, u) + .06 * sin(u * 11. - uTime * 3.1) + jit;
  vec3 v = vec3(cos(phi) * sp * cos(el) + 5., sp * sin(el), side * sin(phi) * sp * cos(el));
  return vec3(0., .15, side * .6) + v * tt + vec3(0., -4.9 * tt * tt, 0.);
}
vec3 saltLight(vec3 wpos, vec3 org, vec3 discN, vec3 shadeTint){
  float sgn = dot(uSunDir, discN);
  float inSh = smoothstep(-.6, .6, -dot(wpos - org, discN) * (sgn < 0. ? -1. : 1.));
  // warm where the low sun strikes it, the Wheel's own tint inside its shadow, lilac from the sky: never white, never over the bloom threshold
  return uSunCol * vec3(1., .93, .8) * .7 * mix(vec3(1.), shadeTint, inSh * .5) + uSkyCol * vec3(.95, .92, 1.15) * 1.1;
}
`,bt=`
attribute vec4 aS; attribute vec4 aS2;
uniform vec3 uSalt, uShadeTint, uDiscN;
uniform float uFan;
varying vec2 vUv; varying float vAl; varying vec3 vCol; varying float vSeed;
#include <fog_pars_vertex>
${N}
${$e}
void main(){
  float skirt = step(.6, aS.y);
  float life = mix(1.15, 3.4, skirt) * (.8 + .4 * aS2.w);
  float t = fract(uTime / life + aS.x), tt = t * life;
  float side = aS.z < .5 ? -1. : 1.;
  // fan: grains riding the same arcs as the sheet, a little scattered about it
  vec3 pf = fanPos(aS.w, side, tt, (aS2.x - .5) * .12) + vec3((aS2.z - .5) * 1.6, 0., 0.);
  float sf = mix(.14, 1.05, t) * (.6 + .8 * aS2.w);
  float af = smoothstep(0., .05, t) * (1. - t) * smoothstep(-.4, .5, pf.y) * .75;
  // skirt: salt smoke left behind, streaming back low over the pan
  float spk = mix(8., 19., aS2.x);
  vec3 pk = vec3(1.5 + spk * tt, .5 + (.5 + 3.2 * aS2.y) * sqrt(t), (aS.z - .5) * (3. + 16. * t) * (.5 + aS.w));
  float sk = mix(1.2, 5., t) * (.6 + .8 * aS2.w);
  float ak = smoothstep(0., .1, t) * (1. - t) * .1;
  vec3 p = mix(pf, pk, skirt);
  float size = mix(sf, sk, skirt);
  vAl = mix(af, ak, skirt) * uFan;
  vec4 wc = modelMatrix * vec4(p, 1.);
  vec4 org = modelMatrix * vec4(0., 0., 0., 1.);
  vCol = uSalt * saltLight(wc.xyz, org.xyz, uDiscN, uShadeTint) * (.9 + .2 * aS2.y);
  vUv = position.xy; vSeed = aS.x * 31.;
  vec4 mvPosition = viewMatrix * wc;
  vAl *= smoothstep(1.5, 7., -mvPosition.z);
  mvPosition.xy += position.xy * size;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,xt=`
uniform vec3 uSalt, uShadeTint, uDiscN;
varying vec2 vUv; varying vec3 vCol; varying float vNear;
#include <fog_pars_vertex>
${N}
${$e}
void main(){
  vec3 p = fanPos(position.x, position.z, position.y * 1.15, 0.);
  p.y = max(p.y, .06);
  vec4 wc = modelMatrix * vec4(p, 1.);
  vec4 org = modelMatrix * vec4(0., 0., 0., 1.);
  vCol = uSalt * saltLight(wc.xyz, org.xyz, uDiscN, uShadeTint);
  vUv = vec2(position.x + position.z * 3.7, position.y);
  vec4 mvPosition = viewMatrix * wc;
  vNear = smoothstep(2.5, 9., -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,St=`
uniform float uFan;
varying vec2 vUv; varying vec3 vCol; varying float vNear;
#include <fog_pars_fragment>
${N}
void main(){
  float u = fract(vUv.x * .999), v = vUv.y;
  // thrown grains in streaks: fine across the fan, long along each arc
  float st = vnoise(vec2(vUv.x * 30., v * 4. - uTime * 3.4)) * .4 + vnoise(vec2(vUv.x * 83., v * 9. - uTime * 5.3)) * .33
           + vnoise(vec2(vUv.x * 190., v * 17. - uTime * 8.)) * .27;
  float a = smoothstep(.3, .58, st + .26 * (1. - v));
  a *= smoothstep(0., .04, v) * (1. - v * v) * smoothstep(1., .82, v) * smoothstep(0., .12, u) * smoothstep(1., .8, u) * uFan * vNear;      // (the sheet holds together all the way out and tears into streaks at its edge: a 14 m fan)
  a = min(a * 1.5, .94);
  if (a < .004) discard;
  gl_FragColor = vec4(min(vCol * mix(vec3(.8, .76, .95), vec3(1.06, 1.02, .96), smoothstep(.45, .8, st)), vec3(.98)), a);      // each streak lit on its crest, lilac in its own shade
  #include <fog_fragment>
}`,kt=`
varying vec2 vUv; varying float vAl; varying vec3 vCol; varying float vSeed;
#include <fog_pars_fragment>
${N}
void main(){
  float d = length(vUv);
  float br = vnoise(vUv * 2.3 + vSeed);
  float a = smoothstep(1., .15, d + (br - .5) * .5) * vAl;
  if (a < .004) discard;
  gl_FragColor = vec4(min(vCol * mix(vec3(.82, .78, .96), vec3(1.04, 1., .95), smoothstep(.3, .75, br + .3 * vUv.y)), vec3(.98)), a);      // lit from above and sunward, lilac beneath
  #include <fog_fragment>
}`,Mt=`
attribute vec4 aO; attribute vec4 aQ; attribute float aW;
uniform float uScatter, uLean, uGather;
varying vec3 vCol;
#include <fog_pars_vertex>
${N}
void main(){
  float hub = step(.5, aQ.w);
  float rad = aO.w * (1. + uScatter * (.6 + 1.6 * aQ.x));
  // uGather: the hub flock draws in and wheels ACROSS the eye instead of round it (the world calls it as we come at the eye)
  rad *= mix(1., .16 + .62 * aQ.z, hub * uGather);
  float th = aQ.x * 6.2832 + uTime * aQ.y / max(aO.w, 1.) + uScatter * 2.5 * aQ.x;
  float al = mix(aQ.z * 6.2832, 0., hub), be = mix(.1 + .5 * fract(aQ.z * 7.7), 1.5708 - uLean, hub);
  vec3 e1 = vec3(cos(al), 0., sin(al));
  vec3 e2 = vec3(-sin(al) * cos(be), sin(be), cos(al) * cos(be));
  vec3 rdir = cos(th) * e1 + sin(th) * e2;
  vec3 c = aO.xyz + rdir * rad + (e1 * (fract(aQ.x * 5.3) - .5) * 30. + e2 * (fract(aQ.z * 3.7) - .5) * 22.) * hub * uGather;
  c.y += sin(uTime * .7 + aQ.x * 40.) * 1.5 + uScatter * 6. * (aQ.z - .3);
  vec3 fwd = -sin(th) * e1 + cos(th) * e2;
  vec3 upG = nrm(vec3(0., 1., 0.) - rdir * mix(.6, 1.5, hub));
  vec3 right = nrm(cross(fwd, upG));
  vec3 up = cross(right, fwd);
  // wing beat: bursts of flapping, then a glide
  float beat = sin(uTime * (7. + 3. * aQ.z) + aQ.x * 60. - aW * .9);
  float glide = smoothstep(-.2, .5, sin(uTime * .45 + aQ.x * 20.));
  vec3 lp = position;
  lp.y += aW * (beat * .5 * (1. - .75 * glide) + .12 * glide) * abs(lp.z);
  vec4 wc = modelMatrix * vec4(c, 1.);
  float dist = length(cameraPosition - wc.xyz);
  float sc = .65 * clamp(dist / 42., 1., 3.6);          // never under about 1% of the frame's height
  vec3 wp = wc.xyz + mat3(modelMatrix) * (fwd * lp.x + up * lp.y + right * lp.z) * sc;
  vec3 nW = nrm(mat3(modelMatrix) * (up + right * sign(lp.z) * aW * beat * .4));
  float under = step(lp.y, -.01);
  vec3 alb = mix(vec3(.07, .06, .1), vec3(.3, .29, .31), under * .6 + .15 * aW);
  vCol = alb * (uSunCol * max(dot(nW, uSunDir), 0.) + mix(uGndCol, uSkyCol, .5 + .5 * nW.y) * 1.2);
  vec4 mvPosition = viewMatrix * vec4(wp, 1.);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,At=`
varying vec3 vCol;
#include <fog_pars_fragment>
void main(){
  gl_FragColor = vec4(vCol, 1.);
  #include <fog_fragment>
}`;function Ct(){const t=[],s=[],o=[],r=(f,p,n,l=0)=>(t.push(f,p,n),s.push(l),t.length/3-1),b=r(.52,-.02,0),h=r(-.42,0,0),x=r(.08,.075,0),v=r(.06,-.065,0),m=r(.08,0,.07),w=r(.08,0,-.07);o.push(b,x,m,b,m,v,b,w,x,b,v,w,h,m,x,h,v,m,h,x,w,h,w,v);for(const f of[1,-1]){const p=r(.2,.01,.06*f),n=r(-.1,.01,.06*f),l=r(.16,.02,.46*f,.6),c=r(-.07,.02,.42*f,.6),d=r(-.2,0,1*f,1);o.push(p,n,l,n,c,l,l,c,d);const u=r(-.4,0,.02*f),S=r(-.82,0,.13*f),g=r(-.58,0,0);o.push(u,S,g)}const i=new e.BufferGeometry;return i.setAttribute("position",new e.Float32BufferAttribute(t,3)),i.setAttribute("aW",new e.Float32BufferAttribute(s,1)),i.setIndex(o),i}async function Tt(t,s={}){const o=t.rng.fork?t.rng.fork("grand-wheel"):t.rng,r=Math.min(1,Math.max(.6,s.detail??t.quality?.detail??1)),b=(s.palette&&s.palette.length>=7?s.palette:rt).map(a=>new e.Color(a)),[h,x,v,m,w,i,f]=b,p=(a,y)=>{const k=a.clone().offsetHSL(y,0,0).convertLinearToSRGB();return new e.Vector3(k.r,k.g,k.b)},n=o.range(-.018,.018),l=p(w,n),c=p(m,n*.6),d=p(v,n),u=o.range(.24,.33),S=u+o.range(.27,.35);let g=s.lean??e.MathUtils.degToRad(7);const F=s.beadAhead??23,V=(s.beadLength??26)*.5*o.range(.94,1.06),C=s.veins??13,A={uTime:{value:0},uRoll:{value:0},uDrum:{value:s.drum??1},uGroundY:{value:0},uSunDir:{value:new e.Vector3(.1,.276,-.956).normalize()},uSunCol:{value:new e.Color("#FFF1DC").multiplyScalar(.95)},uSkyCol:{value:x.clone().multiplyScalar(.42)},uGndCol:{value:h.clone().multiplyScalar(.3)}},T=a=>Object.assign(e.UniformsUtils.merge([e.UniformsLib.fog]),A,a),R=new e.Group;R.name="grand-wheel";const L=new e.Group;L.rotation.x=g,R.add(L);const G=new e.Group;G.position.set(0,z,0),L.add(G);const U=it(),j=We(o,_*108,s.terrace??1.5,.26);await Ie(U,Ee(st),j,107.6,!1,108,.07,z,t),await t.yield?.();const oe=We(o,_*30.6,1.25,.2);await Ie(U,Ee(lt),oe,30.7,!1,30.6,.04,te,t),await t.yield?.();const ae=ct(o,C);await t.yield?.(),await ut(U,ae,t),await t.yield?.();const qe=await dt(U,t);await t.yield?.();const Qe=m.clone().lerp(i,.35).multiplyScalar(.7),ke={value:new e.Vector2(F,V)},Ke=new e.ShaderMaterial({uniforms:T({uHorn:{value:i},uAmber:{value:m},uRose:{value:v},uOchre:{value:Qe},uPlum:{value:f},uSalt:{value:h},uBead:ke}),vertexShader:vt,fragmentShader:mt,fog:!0}),Ye=new e.Mesh(qe,Ke);G.add(Ye),await t.yield?.();const fe=await ht(o,ae,r>=1?2048:1024,t);await t.yield?.();const ne=40,$=208,re=new Float32Array((ne+1)*($+1)*3),Me=[];for(let a=0,y=0;a<=ne;a++){const k=O+(Q-O)*(a/ne);for(let M=0;M<=$;M++){const P=M/$*_;re[y++]=k*Math.cos(P),re[y++]=k*Math.sin(P),re[y++]=0}}await t.yield?.();for(let a=0;a<ne;a++)for(let y=0;y<$;y++){const k=a*($+1)+y,M=k+$+1;Me.push(k,M,k+1,M,M+1,k+1)}await t.yield?.();const K=new e.BufferGeometry;K.setAttribute("position",new e.BufferAttribute(re,3)),K.setIndex(Me),K.boundingSphere=new e.Sphere(new e.Vector3,z),await t.yield?.();const de={uVein:{value:fe},uT0:{value:l},uT1:{value:c},uT2:{value:d},uBand:{value:new e.Vector4(u,S,o.range(.11,.16),o.range(0,40))},uGlow:{value:s.glow??.9},uCells:{value:r>=.8?1:0},uClear:{value:s.clear??.92},uVeinA:{value:new e.Vector3(C,ae.off,s.density??2)}},Ae={vertexShader:pt,fragmentShader:gt,fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendEquation:e.AddEquation},Xe=new e.ShaderMaterial({...Ae,uniforms:T(de),defines:{PASS_MULTIPLY:1},blendSrc:e.ZeroFactor,blendDst:e.SrcColorFactor,blendSrcAlpha:e.ZeroFactor,blendDstAlpha:e.OneFactor}),Ze=new e.ShaderMaterial({...Ae,uniforms:T(de),blendSrc:e.OneFactor,blendDst:e.OneFactor,blendSrcAlpha:e.ZeroFactor,blendDstAlpha:e.OneFactor}),Ce=new e.Mesh(K,Xe);Ce.renderOrder=2,G.add(Ce);const Te=new e.Mesh(K,Ze);Te.renderOrder=3,G.add(Te);let W=null;const he={value:new e.Vector3(.3,.29,.42)};if(s.shadow!==!1){const a=new e.PlaneGeometry(2.12,2.12),y=new e.ShaderMaterial({uniforms:T({...de,uVeinA:{value:new e.Vector3(C,ae.off,s.shadowDensity??1.25)},uSoft:{value:s.shadowSoft??1},uShadowK:{value:s.shadowStrength??1},uFloor:he,uAmberT:{value:c},uBead:ke}),vertexShader:wt,fragmentShader:yt,fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.ZeroFactor,blendDst:e.SrcColorFactor,blendSrcAlpha:e.ZeroFactor,blendDstAlpha:e.OneFactor,polygonOffset:!0,polygonOffsetFactor:-4,polygonOffsetUnits:-4});s.shadowTarget&&(y.depthTest=!1,y.polygonOffset=!1),W=new e.Mesh(a,y),W.position.set(0,z,0),W.renderOrder=1,W.frustumCulled=!1,L.add(W)}await t.yield?.();const ve=new e.PlaneGeometry(2,2),ze=Math.round(760*r),Je=Math.round(150*r),ie=ze+Je,Y=new Float32Array(ie*4),Fe=new Float32Array(ie*4);for(let a=0;a<ie;a++){Y[a*4]=o(),Y[a*4+1]=a<ze?0:1,Y[a*4+2]=o(),Y[a*4+3]=o();for(let y=0;y<4;y++)Fe[a*4+y]=o()}const q=new e.InstancedBufferGeometry;q.setAttribute("position",ve.attributes.position),q.setIndex(ve.index),q.setAttribute("aS",new e.InstancedBufferAttribute(Y,4)),q.setAttribute("aS2",new e.InstancedBufferAttribute(Fe,4)),q.instanceCount=ie;const Ve={value:new e.Vector3(0,0,1)},me={uSalt:{value:h.clone().lerp(new e.Color(1,1,1),.3).multiplyScalar(.84)},uShadeTint:{value:d.clone().multiplyScalar(.85)},uDiscN:Ve,uFan:{value:s.fan??1}},et=new e.ShaderMaterial({uniforms:T(me),vertexShader:bt,fragmentShader:kt,fog:!0,transparent:!0,depthWrite:!1}),se=new e.Mesh(q,et);se.frustumCulled=!1,se.renderOrder=4,R.add(se),await t.yield?.();const pe=30,X=18,ge=[],Re=[];for(const a of[-1,1]){const y=ge.length/3;for(let k=0;k<=pe;k++)for(let M=0;M<=X;M++)ge.push(k/pe,Math.pow(M/X,1.4),a);for(let k=0;k<pe;k++)for(let M=0;M<X;M++){const P=y+k*(X+1)+M,B=P+X+1;Re.push(P,B,P+1,B,B+1,P+1)}}const we=new e.BufferGeometry;we.setAttribute("position",new e.Float32BufferAttribute(ge,3)),we.setIndex(Re);const tt=new e.ShaderMaterial({uniforms:T(me),vertexShader:xt,fragmentShader:St,fog:!0,transparent:!0,depthWrite:!1,side:e.DoubleSide}),ye=new e.Mesh(we,tt);ye.frustumCulled=!1,ye.renderOrder=4,R.add(ye),se.renderOrder=5,await t.yield?.();let be=null;const Be={value:0},De={value:g},Pe={value:0},Z=s.pickers===!1?0:Math.round((s.pickers??300)*r);if(Z>0){const a=Ct(),y=new e.InstancedBufferGeometry;y.setAttribute("position",a.attributes.position),y.setAttribute("aW",a.attributes.aW),y.setIndex(a.index);const k=new Float32Array(Z*4),M=new Float32Array(Z*4),P=z*Math.cos(g),B=z*Math.sin(g);for(let D=0;D<Z;D++){const J=o.chance(.36);if(J){const ee=o.sign()*o.range(4,17);k[D*4]=o.range(-3,3),k[D*4+1]=P+o.range(-3,3)-ee*Math.sin(g),k[D*4+2]=B+ee*Math.cos(g),k[D*4+3]=o.range(33,54)}else{const ee=o();k[D*4]=o.range(20,55)+130*ee*ee,k[D*4+1]=o.range(30,180),k[D*4+2]=B+o.range(-30,30),k[D*4+3]=o.range(7,30)}M[D*4]=o(),M[D*4+1]=o.range(9,15)*o.sign(),M[D*4+2]=o(),M[D*4+3]=J?1:0}y.setAttribute("aO",new e.InstancedBufferAttribute(k,4)),y.setAttribute("aQ",new e.InstancedBufferAttribute(M,4)),y.instanceCount=Z;const Se=new e.ShaderMaterial({uniforms:T({uScatter:Be,uLean:De,uGather:Pe}),vertexShader:Mt,fragmentShader:At,fog:!0,side:e.DoubleSide});be=new e.Mesh(y,Se),be.frustumCulled=!1,R.add(be)}await t.yield?.();const xe={},_e=()=>{const a=Math.cos(g),y=Math.sin(g),k=Math.tan(g),M=new e.Vector3(0,z*a,z*y),P=new e.Vector3(0,-y,a),B=(Se,D,J)=>new e.Vector3(Se,D-J*y,D*k+J*a);Object.assign(xe,{contact:new e.Vector3(0,0,0),heading:new e.Vector3(-1,0,0),hub:M,discNormal:P,eye:{position:M.clone(),normal:P.clone(),radius:te},bead:new e.Vector3(-z*Math.sin(F/E),(z-E*Math.cos(F/E))*a,(z-E*Math.cos(F/E))*y),sunSide:new e.Vector3(0,0,-1),portalSeat:null,flyThrough:[new e.Vector3(95,8,30),new e.Vector3(45,8,16),new e.Vector3(8,8,13.6),new e.Vector3(-27,8.5,14.2),B(-38,30,13.5),B(-40,58,13.5),B(-33,82,13.5),B(-20,97,11),B(-10,101,0),B(-20,102,-14),B(-42,102,-34)],viewpoints:{reveal:{position:new e.Vector3(766,6,643),target:M.clone()},contact:{position:new e.Vector3(10,8,13.6),target:new e.Vector3(-14,3,1)},face:{position:B(-40,58,13.5),target:M.clone()},eye:{position:B(-20,97,11),target:B(-30,101,-40)},sunward:{position:new e.Vector3(-70,60,-170),target:M.clone()}},bands:{greenToAmber:O+u*(Q-O),amberToRose:O+S*(Q-O),tints:{green:l,amber:c,rose:d}}})};_e();let Ge=!1,le=0,Ne=!1,Le=null,H=null,I=null,Oe=0;const ot=o()*_,at=s.sunDir?new e.Vector3().fromArray(s.sunDir).normalize():new e.Vector3(.1,.276,-.956).normalize(),ce=new e.Vector3,Ue=new e.Vector3,He=new e.Quaternion,nt=()=>{let a=R;for(;a.parent;)a=a.parent;a===Le&&(H||Oe%90)||(Le=a,H=I=null,a.traverse(y=>{!H&&y.isDirectionalLight&&(H=y),!I&&y.isHemisphereLight&&(I=y)}))},ue={object:R,radius:z+2,height:2*z,center:new e.Vector3(0,z*Math.cos(g),z*Math.sin(g)),anchors:xe,ground:!0,groundY:0,uniforms:A,veinTexture:fe,setRoll(a){Ge=!0,le=a},setLean(a){g=a,L.rotation.x=a,De.value=a,_e(),ue.center.copy(xe.hub)},setLight(a){Ne=!0,a.sunDir&&A.uSunDir.value.copy(a.sunDir).normalize(),a.sunColor&&A.uSunCol.value.copy(a.sunColor),a.skyColor&&A.uSkyCol.value.copy(a.skyColor),a.groundColor&&A.uGndCol.value.copy(a.groundColor)},setScatter(a){Be.value=Math.min(1,Math.max(0,a))},setProgress(a){ue.setScatter(a)},setGather(a){Pe.value=Math.min(1,Math.max(0,a))},setDrum(a){A.uDrum.value=a},setFan(a){me.uFan.value=a},update(a,y){Oe++,A.uTime.value=y,Ge||(le=ot+y*_/35),G.rotation.z=le,A.uRoll.value=le%_,R.updateWorldMatrix(!0,!1),A.uGroundY.value=ce.setFromMatrixPosition(R.matrixWorld).y,L.updateWorldMatrix(!1,!1),Ve.value.set(0,0,1).transformDirection(L.matrixWorld),Ne||(nt(),H?(H.getWorldPosition(ce),H.target.getWorldPosition(Ue),ce.sub(Ue).lengthSq()>1e-8&&A.uSunDir.value.copy(ce.normalize()),A.uSunCol.value.copy(H.color).multiplyScalar(H.intensity/Math.PI)):(R.getWorldQuaternion(He),A.uSunDir.value.copy(at).applyQuaternion(He)),I&&(A.uSkyCol.value.copy(I.color).multiplyScalar(I.intensity/Math.PI),A.uGndCol.value.copy(I.groundColor).multiplyScalar(I.intensity/Math.PI)));const k=A.uSunCol.value,M=A.uSkyCol.value,P=Math.max(A.uSunDir.value.y,.05);s.shadowTarget?he.value.set(0,0,0):he.value.set(M.r/Math.max(k.r*P+M.r,1e-4),M.g/Math.max(k.g*P+M.g,1e-4),M.b/Math.max(k.b*P+M.b,1e-4)),W&&(W.visible=A.uSunDir.value.y>.03)},get shadowMesh(){return W},dispose(){fe.dispose(),ve.dispose()}};return ue.update(0,0),ue}export{Tt as buildHero};
