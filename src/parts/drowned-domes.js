import*as p from"three";const Z=Math.PI/180,ve=[[-195,466,8,1],[-146,404,7,0],[-96.2,236,7,1],[-71.8,248,8,0],[-61,137,9,1],[-35.2,13.9,10,1],[-32,67,7,0],[-217,-61,9,0],[-221,-21,8,1]],De=[-300,-44],P=-11,F=(e,t=1)=>{const r=new p.Color(e);return[r.r*t,r.g*t,r.b*t]},M={lime:F("#E6E8E1",.93),limeDark:F("#E6E8E1",.7),plinth:F("#7F8A82",2.1),gold:F("#E8B030"),blue:F("#1D4E9E"),lead:F("#7d8790"),shingle:F("#aeb4b6"),copper:F("#2a7462",.8),silver:F("#b9c1c6",.9),green:F("#3d5f55",.8),slab:F("#7fd6d8"),snow:[.77,.77,.77],roof:F("#b9b7a6"),log:F("#3a2f26"),bed:F("#525c5e"),stone:F("#a9a89c",1.1),tree:F("#9aa08c")},l={LIME:0,GOLD:1,BLUE:2,LEAD:3,GREEN:4,SLAB:5,SNOW:6,ROOF:7,BED:8,PLAIN:9,FRESCO:10,LOG:11,LAMP:12,GLOW:13,ARC:14,BRIDGE:15,SPRUCE:16,CHAIN:17,SWING:18,COPPER:19,SILVER:20,CITY:21,DRUM:22,TILE:23,BIRD:24},Te=new p.Vector3,ge=new p.Vector3,_e=new p.Matrix3;class ce{constructor(t=512){this.cap=t,this.count=0;const r=this.cap;this.p=new Float32Array(r*3),this.n=new Float32Array(r*3),this.c=new Float32Array(r*3),this.u=new Float32Array(r*2),this.m=new Float32Array(r)}grow(t){let r=this.cap;for(;r<t;)r*=2;const s=this.count,i=(a,n)=>{const f=new Float32Array(r*n);return f.set(a.subarray(0,s*n)),f};this.p=i(this.p,3),this.n=i(this.n,3),this.c=i(this.c,3),this.u=i(this.u,2),this.m=i(this.m,1),this.cap=r}add(t,r,s,i,a){let n=t;t.index&&(n=t.userData.ni||(t.userData.ni=t.toNonIndexed()));const f=n.attributes.position,d=n.attributes.normal,w=n.attributes.uv;_e.getNormalMatrix(r);const b=this.count,h=f.count;b+h>this.cap&&this.grow(b+h);const m=this.p,c=this.n,g=this.c,v=this.u,y=this.m;for(let u=0;u<h;u++){const x=b+u,E=x*3,L=x*2;Te.fromBufferAttribute(f,u).applyMatrix4(r),m[E]=Te.x,m[E+1]=Te.y,m[E+2]=Te.z,ge.fromBufferAttribute(d,u).applyMatrix3(_e);const z=ge.length()||1;c[E]=ge.x/z,c[E+1]=ge.y/z,c[E+2]=ge.z/z,g[E]=s[0],g[E+1]=s[1],g[E+2]=s[2],a?(v[L]=a[0],v[L+1]=a[1]):(v[L]=w?w.getX(u):0,v[L+1]=w?w.getY(u):0),y[x]=i}this.count=b+h}build(){const t=new p.BufferGeometry,r=this.count;return t.setAttribute("position",new p.BufferAttribute(this.p.slice(0,r*3),3)),t.setAttribute("normal",new p.BufferAttribute(this.n.slice(0,r*3),3)),t.setAttribute("color",new p.BufferAttribute(this.c.slice(0,r*3),3)),t.setAttribute("uv",new p.BufferAttribute(this.u.slice(0,r*2),2)),t.setAttribute("aMat",new p.BufferAttribute(this.m.slice(0,r),1)),t.computeBoundingSphere(),t}async buildAsync(t){const r=new p.BufferGeometry,s=this.count,i=(a,n)=>a.length<=n*1.15?a.subarray(0,n):a.slice(0,n);return r.setAttribute("position",new p.BufferAttribute(i(this.p,s*3),3)),this.p=null,await t.yield(),r.setAttribute("normal",new p.BufferAttribute(i(this.n,s*3),3)),this.n=null,await t.yield(),r.setAttribute("color",new p.BufferAttribute(i(this.c,s*3),3)),this.c=null,await t.yield(),r.setAttribute("uv",new p.BufferAttribute(i(this.u,s*2),2)),this.u=null,r.setAttribute("aMat",new p.BufferAttribute(i(this.m,s),1)),this.m=null,r.boundingSphere=new p.Sphere(new p.Vector3(-110,0,250),4e3),await t.yield(),r}}const It=new p.Matrix4,Qe=new p.Quaternion,Xe=new p.Euler,dt=new p.Vector3,ht=new p.Vector3;function k(e,t,r,s=1,i=1,a=1,n=0,f=0,d=0){return Xe.set(f,n,d,"YXZ"),Qe.setFromEuler(Xe),new p.Matrix4().compose(ht.set(e,t,r),Qe,dt.set(s,i,a))}const o={};async function ft(e){if(o.bell)return;o.box=new p.BoxGeometry(1,1,1).translate(0,.5,0),o.cyl=new p.CylinderGeometry(1,1,1,10,1,!0).translate(0,.5,0),o.cyl16=new p.CylinderGeometry(1,1,1,18,1,!1).translate(0,.5,0),o.cone8=new p.ConeGeometry(1,1,8,1,!0).translate(0,.5,0),o.cone=new p.ConeGeometry(1,1,14,1,!0).translate(0,.5,0),o.ball=new p.SphereGeometry(1,10,8),o.ball6=new p.SphereGeometry(1,6,4),o.oct=new p.OctahedronGeometry(1,0),await e.yield();const t=new p.BufferGeometry,r=[-.5,0,.5],s=[.5,0,.5],i=[0,1,.5],a=[-.5,0,-.5],n=[.5,0,-.5],f=[0,1,-.5],d=[r,s,i,n,a,f,r,i,f,r,f,a,s,n,f,s,f,i].flat();t.setAttribute("position",new p.Float32BufferAttribute(d,3)),t.setAttribute("uv",new p.Float32BufferAttribute([r,s,i,n,a,f,r,i,f,r,f,a,s,n,f,s,f,i].flatMap(c=>[c[0]+.5,c[1]]),2)),t.computeVertexNormals(),o.prism=t,await e.yield();const w=[[0,.5],[.08,.72],[.2,.93],[.33,1],[.45,.95],[.57,.78],[.68,.55],[.77,.36],[.85,.22],[.92,.12],[1,.02]],b=new p.CatmullRomCurve3(w.map(([c,g])=>new p.Vector3(g,c*2.4,0)));o.onion=new p.LatheGeometry(b.getPoints(22).map(c=>new p.Vector2(Math.max(c.x,.01),c.y)),20),await e.yield(),o.onionLo=new p.LatheGeometry(b.getPoints(13).map(c=>new p.Vector2(Math.max(c.x,.01),c.y)),14),o.onionFar=new p.LatheGeometry(b.getPoints(9).map(c=>new p.Vector2(Math.max(c.x,.01),c.y)),10),o.cyl8=new p.CylinderGeometry(1,1,1,8,1,!1).translate(0,.5,0),o.cyl12=new p.CylinderGeometry(1,1,1,12,1,!1).translate(0,.5,0),await e.yield(),o.onionC=new p.LatheGeometry(b.getPoints(7).map(c=>new p.Vector2(Math.max(c.x,.01),c.y)),8),o.onionS=new p.LatheGeometry(b.getPoints(6).map(c=>new p.Vector2(Math.max(c.x,.01),c.y)),6),o.cyl6=new p.CylinderGeometry(1,1,1,6,1,!0).translate(0,.5,0),o.pyr=new p.ConeGeometry(1,1,4,1,!0).rotateY(Math.PI/4).translate(0,.5,0),await e.yield();{const c=new p.PlaneGeometry(1,1,1,6).translate(0,.5,0),g=c.clone().rotateY(Math.PI/2),v=[],y=[],u=[];for(const E of[c,g]){const L=E.toNonIndexed();v.push(...L.attributes.position.array),y.push(...L.attributes.normal.array),u.push(...L.attributes.uv.array)}const x=new p.BufferGeometry;x.setAttribute("position",new p.Float32BufferAttribute(v,3)),x.setAttribute("normal",new p.Float32BufferAttribute(y,3)),x.setAttribute("uv",new p.Float32BufferAttribute(u,2)),o.chain=x}const h=(c,g)=>{const v=[],y=[],u=[];for(let E=0;E<=g;E++)for(let L=0;L<=c;L++){const z=L/c,I=E/g,A=(I-.5)*Math.PI,C=Math.pow(Math.sin(Math.min(1,z*3.2)*Math.PI/2),.7)*Math.pow(1-Math.pow(z,2.2),.55)*(1-.3*z),q=1+.22*Math.sin(z*17+E*1.3)+.12*Math.sin(z*41+E*2.9),X=.5*C*q,H=Math.sin(A),Y=Math.cos(A)*C*(.8+.2*Math.sin(z*23+1));v.push(H*X+.07*Math.sin(z*9)*C,Math.max(Y,0)*(1-.35*H),z),y.push(z,I)}for(let E=0;E<g;E++)for(let L=0;L<c;L++){const z=E*(c+1)+L,I=z+1,A=z+c+1,C=A+1;u.push(z,I,C,z,C,A)}const x=new p.BufferGeometry;return x.setAttribute("position",new p.Float32BufferAttribute(v,3)),x.setAttribute("uv",new p.Float32BufferAttribute(y,2)),x.setIndex(u),x.computeVertexNormals(),x};o.drift=h(12,6),o.driftLo=h(7,4),o.mound=new p.SphereGeometry(1,9,3,0,Math.PI*2,0,Math.PI/2),o.icicle=new p.ConeGeometry(1,1,5,1,!0).rotateX(Math.PI).translate(0,-.5,0),o.face=new p.PlaneGeometry(1,1).translate(0,.5,.5),o.disc=new p.CircleGeometry(1,10).rotateX(-Math.PI/2).translate(0,1,0),await e.yield();const m=[[.05,1],[.35,.98],[.5,.8],[.58,.45],[.75,.2],[1,0],[1.08,-.04]];o.bell=new p.LatheGeometry(m.map(([c,g])=>new p.Vector2(c,g)),14)}const Me=48,Pe=`
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p + n * 17.3 + 3.1)); }
  float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
    return mix(mix(h21(i), h21(i+vec2(1.,0.)), f.x), mix(h21(i+vec2(0.,1.)), h21(i+vec2(1.,1.)), f.x), f.y); }
  float fb(vec2 p){ return 0.55*vn(p) + 0.3*vn(p*2.13+3.7) + 0.15*vn(p*4.31+9.1); }
  float segD(vec2 p, vec2 a, vec2 b){ vec2 pa = p-a, ba = b-a; float h = clamp(dot(pa,ba)/max(dot(ba,ba),1e-4), 0., 1.); return length(pa-ba*h); }
  uniform float uLaneK, uSnakeK;        // how wide our wind-swept lane is: 1 on a clear day, narrower in a hoar morning or a ground blizzard
  float laneD(vec2 p){                  // metres to our track (the slalom line, the sweep west of the tower, the avenue)
    float d = min(segD(p, vec2(-226.6,556.3), vec2(-41.,165.)), segD(p, vec2(-41.,165.), vec2(-15.,118.)));
    d = min(d, min(segD(p, vec2(-15.,118.), vec2(0.,75.)), segD(p, vec2(0.,75.), vec2(-7.9,29.9))));
    d = min(d, min(segD(p, vec2(-7.9,29.9), vec2(-28.2,-22.3)), segD(p, vec2(-28.2,-22.3), vec2(-48.,-46.))));
    return min(d, min(segD(p, vec2(-48.,-46.), vec2(-81.,-56.8)), min(segD(p, vec2(-81.,-56.8), vec2(-155.,-46.)), segD(p, vec2(-155.,-46.), vec2(-300.,-44.)))));
  }
  float snowTh(vec2 p, float cover){    // how much of the drift noise counts as a tongue here
    float ld = laneD(p); float nearT = 1. - smoothstep(100., 140., length(p));      // (round the tower the tongues come to within 10 m of our track)
    float lane = mix(smoothstep(26. * uLaneK, 90. * uLaneK, ld), smoothstep(10. * uLaneK, 40. * uLaneK, ld), nearT);
    return mix(0.93, 0.64 - (cover - 1.) * 0.12, lane);            // (on our own track every weather has the clear day's threshold: no drift lies across it)
  }
  float snowApron(vec2 p){ return 1. - smoothstep(15., 30., length((p - vec2(-297., -44.)) * vec2(1., 0.7))); }   // the drift banked against the gate (hides the buried rim of the portal)
  float snowAt(vec2 p, float cover){
    vec2 pj = p + (vec2(vn(p * 0.6), vn(p * 0.6 + 7.3)) - 0.5) * 2.2;          // the edge of a drift is scalloped and feathered, not a drawn curve
    vec2 w = vec2(dot(pj, vec2(0.788,-0.616)), dot(pj, vec2(0.616,0.788)));
    float n = fb(vec2(w.x*0.03, w.y*0.1)) * 0.7 + fb(vec2(w.x*0.011+7., w.y*0.028)) * 0.5;
    float th = snowTh(p, cover);
    return max(smoothstep(th, th + 0.06, n), snowApron(p));
  }
  // the same with its far level of detail: where a tongue is finer than a pixel (px = a pixel's footprint on the ice, metres) the drifts are a thin even
  // veil instead of stripes that shimmer, so the far ice is a calm mirror and whatever lies mirrored there is whole
  float snowLod(vec2 p, float cover, float px){
    float k = smoothstep(5., 16., px);
    return mix(snowAt(p, cover), max(0.2 * clamp((0.9 - snowTh(p, cover)) / 0.26, 0., 1.4), snowApron(p)), k);
  }
  // frosted bands: matt, wind-scoured streaks of rime lying across the black mirror, long down the wind. They are strongest round the
  // cathedral and the tower (within 200 m of the tower), where the mirror is broken into lengths, and faint elsewhere; our own track stays clear
  float satinN(vec2 p){                 // the bands themselves (the mirror is broken by them everywhere, our own track included)
    vec2 w = vec2(dot(p, vec2(0.788, -0.616)), dot(p, vec2(0.616, 0.788)));
    float n = vn(vec2(w.x * 0.011 + 3., w.y * 0.085)) * 0.62 + vn(vec2(w.x * 0.035 + 7., w.y * 0.27 + 2.)) * 0.38;
    return smoothstep(0.48, 0.6, n + 0.1 * (vn(p * 0.9) - 0.5)) * mix(0.5, 1., 1. - smoothstep(130., 260., length(p)));
  }
  float satinAt(vec2 p){                // as they show on the ice and in the mirrors: faint within a few metres of our own track, which the wind keeps polished
    return satinN(p) * mix(0.2, 1., smoothstep(4., 12., laneD(p)));
  }
  float softRefl(float ndv){ return 0.08 + 0.87 * smoothstep(0., 1., 1. - clamp(ndv * 18., 0., 1.)); }
  // snow snakes streaming north-east: thin sunlit streamers gathered in bands, meandering. fa = a pixel's footprint across the wind:
  // the streamers are drawn at the octave that footprint can hold (a hand wide under the eye, metres wide far off), cross-faded, so they never shimmer
  float filam(vec2 w, float wy, float tw, float sc, float th){
    float f = smoothstep(0.3 + th, 0.62 + th, vn(vec2(w.x * 0.035 - tw * 0.32, wy * 2.4 * sc)) * vn(vec2(w.x * 0.1 - tw * 0.9, wy * 6. * sc + 5.)));
    f *= 0.5 + 0.5 * vn(vec2(w.x * 0.9 - tw * 6., wy * 14. * sc));   // grain: blown snow is combed into fine threads along the wind, never a smooth ribbon
    f *= 0.55 + 0.45 * vn(vec2(w.x * 0.3 - tw * 2.4, wy * 1.1 * sc + 9.));   // and comes in puffs
    return f * f * 3.;                                               // a bright core in a gauzy skirt
  }
  float snakeAt(vec2 p, float tw, float sk1, float fa, float thin){     // thin 0..1: fewer streamers (our own wind-swept track), each as bright
    vec2 w = vec2(dot(p, vec2(0.788, -0.616)), dot(p, vec2(0.616, 0.788)));
    float wy = w.y + sin(w.x * 0.06 + tw * 0.5) * 1.3 + sin(w.x * 0.021 - tw * 0.23) * 2.8 + sin(w.x * 0.19 - tw * 1.3 + w.y * 0.23) * 0.45;
    float band = smoothstep(0.56 - 0.16 * sk1, 0.84 - 0.14 * sk1, vn(vec2(w.x * 0.02 - tw * 0.18, wy * 0.16)));
    // (never finer than a soft wisp a metre and more across: hair-thin streamers read as scratches)
    float lv = clamp(log2(max(fa, 0.22) / 0.05), 0., 5.5); float l0 = floor(lv); float sA = exp2(-l0);
    float fil = mix(filam(w, wy, tw, sA, 0.13 * thin - 0.09 * sk1), filam(w, wy + 31.7, tw, sA * 0.5, 0.13 * thin - 0.09 * sk1), lv - l0);   // (a ground blizzard is told by its streamers)
    return band * mix(fil, 0.2, smoothstep(2.5, 6., fa)) * (1. - 0.11 * lv);          // (the broad far streamers are gauzier)
  }
  // the ground blizzard's veil: loose snow smoking over the ice in long sheets combed down the wind, 16 m and more from our own track
  float gauzeAt(vec2 p, float tw){
    vec2 w = vec2(dot(p, vec2(0.788, -0.616)), dot(p, vec2(0.616, 0.788)));
    float g = smoothstep(0.3, 0.7, vn(vec2(w.x * 0.012 - tw * 0.2, w.y * 0.05)) * 0.6 + vn(vec2(w.x * 0.04 - tw * 0.55, w.y * 0.19 + 3.)) * 0.4);
    g *= 0.55 + 0.45 * vn(vec2(w.x * 0.5 - tw * 3., w.y * 6.));                // (combed into threads: never a smooth milky sheet)
    return g * smoothstep(16., 38., laneD(p)) * clamp(uSnakeK - 1., 0., 1.);
  }
  // low mist lying on the far ice in slow banks down the wind: how much of it stands between the eye and a point y metres up, dist metres off.
  // The feet of the distant city stand in it and its domes rise clear; nothing within 70 m of the eye is touched
  uniform float uMistK; uniform vec3 uMistCol;
  float mistAt(vec2 p, float y, float dist, float t){
    vec2 w = vec2(dot(p, vec2(0.788, -0.616)), dot(p, vec2(0.616, 0.788)));
    float bank = 0.6 + 0.4 * vn(vec2(w.x * 0.0035 - t * 0.012, w.y * 0.011 + 3.));
    return uMistK * (1. - exp(-max(dist - 70., 0.) * 0.0042)) * exp(-max(y, 0.) * 0.08) * bank;
  }
  // ---- WHAT LIES ON THE ICE, across the sky and the mirror images alike (the ice shader draws these, the mirror shader gives way to them) ----
  // a line of true width tw seen with a pixel footprint w across it: full where it is wider than a pixel, fading as it gets finer
  float hair(float d, float w, float tw){ float r = max(tw, w) * 0.5; return (1. - smoothstep(r, r + w + 0.003, d)) * min(1., 1.5 * tw / max(w, 1e-4)); }
  // snow banked round every wall and drum that pierces the ice near our track, with a short drift in its lee (north-east): metres to the nearest
  // of it, negative inside. uFootA: x, z, half-width of a square foot (0 for a round one), radius; uFootB: cos and sin of its yaw, the drift's length and root radius
  uniform vec4 uFootA[${Me}]; uniform vec4 uFootB[${Me}];
  float footD(vec2 p){
    float d = 60.;
    for (int i = 0; i < ${Me}; i++) {
      vec4 a = uFootA[i], b = uFootB[i]; vec2 q = p - a.xy;
      vec2 r = abs(vec2(b.x * q.x - b.y * q.y, b.y * q.x + b.x * q.y)) - a.z;
      float df = length(max(r, 0.)) + min(max(r.x, r.y), 0.) - a.w;                          // to the wall itself
      float h = clamp(dot(q, vec2(0.788, -0.616)) / max(b.z, 0.1), 0., 1.);
      float dt = length(q - vec2(0.788, -0.616) * (b.z * h)) - b.w * (1. - h);              // to the drift in its lee
      d = min(d, min(df - 0.5, dt));
    }
    return d + 2.5 * (1. - smoothstep(2.5, 7., laneD(p)));                                    // (our own track is wind-swept to the last metre)
  }
  // a frost flower: a ragged clump of hoar feathers, each its own size and turned its own way, most cells bare (q in cells)
  float frostFl(vec2 q, float sd){ vec2 i = floor(q); vec2 o = h22(i + sd); vec2 d = fract(q) - 0.25 - 0.5 * o; float ang = atan(d.y + 1e-6, d.x + 1e-5);
    float sz = 0.06 + 0.3 * o.x * o.x;                                                         // (small ones far commoner than large)
    float r = length(d) * (1. + 0.3 * sin(ang * 5. + o.x * 6.28) + 0.2 * sin(ang * 11. + o.y * 6.28)) * (0.75 + 0.5 * vn(q * 6. + o * 5.));
    return (1. - smoothstep(sz * 0.45, sz, r)) * smoothstep(0.25, 0.6, vn(q * 9. + o * 9.)) * step(0.45, h21(i + sd + 2.9)); }
  // x: the white collar and lee drift (fd = footD, fw = its screen footprint, both taken outside every branch); y: the frost that feathers out from it and
  // the frost flowers that grow in clusters round every foot; z: the dark tide ring of wind-scoured wet ice between the bank and the flowers.
  // They fade where they are finer than a pixel; far off the feet of things stand in the low mist
  vec3 footCue(vec2 p, float fd, float fw, float dist){
    float nz = (vn(p * 1.3 + 4.1) - 0.5) * 0.7 + (vn(p * 4.7 + 9.) - 0.5) * 0.3;               // a scalloped, feathered edge
    float e = max(0.12, fw * 0.75); float far = 1. - smoothstep(70., 130., dist);
    float snow = (1. - smoothstep(-e, e, fd + nz)) * far;
    float frost = (1. - smoothstep(0.1, 2.2, fd + nz * 1.6)) * (0.3 + 0.7 * smoothstep(0.3, 0.7, vn(p * 0.8 + 7.3))) * far * 0.3;
    float ring = smoothstep(1.2, 2.2, fd + nz) * (1. - smoothstep(4., 9., fd + nz * 4.)) * smoothstep(0.42, 0.62, vn(p * 0.37 + 3.3));      // clusters, bare ice between
    float fine = 1. - smoothstep(0.12, 0.5, fw);
    float flw = max(frostFl(p * 1.25, 3.1), 0.8 * frostFl(p * 2.7 + 5., 7.7));
    frost = max(frost, ring * far * mix(0.16, 0.75 * flw, fine));
    float tide = smoothstep(0.55, 0.85, fd + nz * 0.5) * (1. - smoothstep(1.3, 2.3, fd + nz)) * far;
    return vec3(snow, frost, tide);
  }
  // a few thin drifts of blown snow lying across the polished ice down the wind, each a pace or two wide and some tens of metres long, tapering
  float wispAt(vec2 p){
    vec2 w = vec2(dot(p, vec2(0.788, -0.616)), dot(p, vec2(0.616, 0.788)));
    float wy = w.y + (vn(vec2(w.x * 0.04, w.y * 0.03) + 5.) - 0.5) * 2.4;
    float n = vn(vec2(w.x * 0.022 + 11., wy * 0.6));
    float core = smoothstep(0.86, 0.9, n + 0.03 * (vn(vec2(w.x * 0.7, wy * 6.)) - 0.5));                 // (few, narrow and clean-edged: a drift, not a veil)
    core *= smoothstep(0.42, 0.56, vn(vec2(w.x * 0.004 + 3., wy * 0.11 + 17.)));                           // (and whole reaches of ice have none)
    core *= smoothstep(0.34, 0.56, vn(vec2(w.x * 0.1 + 5., wy * 0.8 + 2.)));                               // (each broken into scalloped lengths of a dozen metres: never one long blade)
    return core * smoothstep(7., 17., laneD(p));                                                            // (combed along the wind; our own track is swept clean)
  }
  // fine runner scratches along our own track only: hairlines the yachts ahead of us have cut, a plank's width apart, coming and going.
  // sl = laneD(p) + a slow wander, fw = its screen footprint (taken outside every branch)
  float scratchAt(vec2 p, float sl, float fw){
    float s = hair(abs(sl - 0.8), fw, 0.006) * smoothstep(0.52, 0.66, vn(p * 0.13 + 1.1));               // (short stretches, finer than a crack)
    s += hair(abs(sl - 2.1), fw, 0.005) * smoothstep(0.55, 0.68, vn(p * 0.11 + 5.7));
    s += hair(abs(sl - 3.4), fw, 0.006) * smoothstep(0.52, 0.66, vn(p * 0.15 + 9.2));
    return min(s, 1.);
  }
  float scratchW(vec2 p){ return (vn(p * 0.035 + 2.3) - 0.5) * 1.2; }
  // a faint sheen: the ice is not one glass. Broad soft lanes of duller ice lie down the wind between the polished ones, and at grazing angles a
  // slight cool haze lies on all of it (ndv = the height of the eye over the distance): over the sky and over every mirror image alike
  float sheenAt(vec2 p){
    vec2 w = vec2(dot(p, vec2(0.788, -0.616)), dot(p, vec2(0.616, 0.788)));
    return smoothstep(0.3, 0.72, vn(vec2(w.x * 0.006 + 2., w.y * 0.045)) * 0.6 + vn(vec2(w.x * 0.017 + 9., w.y * 0.13 + 4.)) * 0.4);
  }
  float hazeAt(vec2 p, float ndv){ return (0.045 + 0.07 * sheenAt(p)) * smoothstep(0., 1., 1. - clamp(ndv * 5., 0., 1.)); }
  // THE ONE CRACK that races us from under our runner to the tower's foot (the world runs uCrack 0..1 along it and lets uCrackF fall once it has run):
  // a CRACK, not a line: short straight runs with a kink every few metres and a smaller one every pace, forking twice into forks that wander off 30 m.
  // raceD: x = distance to it (stem and forks), y = metres along its run, z = its length, w = signed distance to the stem alone.
  // raceP: x = its dark core (open water a finger wide), y = the white lips of shattered ice either side, ragged and broken into flakes, widest
  // behind the running head, z = the ice dust glowing at the head. wC = the screen footprint of raceD's x, taken outside every branch.
  // The ice draws it and the mirror gives way to it (raceK)
  uniform float uCrack, uCrackF; uniform vec2 uCrackA;
  float raceJ(float rs){
    float z1 = rs / 7., z2 = rs / 1.3, z3 = rs / 3.1;      // long straight runs joined by oblique ones, a sharp sideways jog every few paces, a kink every pace
    return (mix(h21(vec2(floor(z1), 3.)), h21(vec2(floor(z1) + 1., 3.)), smoothstep(0.3, 0.7, fract(z1))) - 0.5) * 4.2
      + (mix(h21(vec2(floor(z3), 5.)), h21(vec2(floor(z3) + 1., 5.)), smoothstep(0.38, 0.62, fract(z3))) - 0.5) * 1.5
      + (mix(h21(vec2(floor(z2), 9.)), h21(vec2(floor(z2) + 1., 9.)), fract(z2)) - 0.5) * 0.8;
  }
  vec4 raceD(vec2 p){
    vec2 rba = vec2(-7., 13.) - uCrackA; float rlen = max(length(rba), 1.); vec2 rdir = rba / rlen;
    vec2 rrel = p - uCrackA; float rs = dot(rrel, rdir);
    float rt = dot(rrel, vec2(-rdir.y, rdir.x)) - raceJ(rs) * (0.3 + 0.7 * sin(clamp(rs / rlen, 0., 1.) * 3.14159));
    rt -= 9. * max(0., 1. - abs(rs - 67.) / 46.);      // (it goes round the green copper dome that stands on its straight line 67 m along: a crack does not run through a drum)
    float rf1 = rs - rlen * 0.38, rf2 = rs - rlen * 0.66; float d = abs(rt);
    if (rf1 > 0. && rf1 < 34.) d = min(d, abs(rt - rf1 * 0.42 - raceJ(rs + 57.) * 0.5 * min(rf1 * 0.2, 1.)) + max(rf1 - 30., 0.) * 0.3);
    if (rf2 > 0. && rf2 < 28.) d = min(d, abs(rt + rf2 * 0.5 - raceJ(rs + 131.) * 0.5 * min(rf2 * 0.2, 1.)) + max(rf2 - 24., 0.) * 0.3);
    return vec4(d, rs, rlen, rt);
  }
  // its side cracks: short hairlines that leave the stem at a slant, one to a cell of 2.3 m, a few cells bare, each its own length (in the stem's own
  // frame: s metres along, t metres across)
  float raceF1(float s, float t, float ci){ vec2 h = h22(vec2(ci, 4.7)); float sg = h.x > 0.5 ? 1. : -1.; float L = 0.45 + 2.4 * h.y * h.y;
    float s0 = (ci + 0.2 + 0.6 * h.x) * 2.3; float sl = (fract(h.x * 7.3) - 0.3) * 1.5;
    return h.y < 0.14 ? 9. : segD(vec2(s, t), vec2(s0, 0.), vec2(s0 + sl * L, sg * L)); }
  float raceFd(vec4 rd){ float ci = floor(rd.y / 2.3); return min(raceF1(rd.y, rd.w, ci), min(raceF1(rd.y, rd.w, ci - 1.), raceF1(rd.y, rd.w, ci + 1.))); }
  // fD, wF: the distance to the nearest side crack and its screen footprint (9 and 1 where they are not wanted)
  vec3 raceP(vec4 rd, float wC, float dist, vec2 p, float fD, float wF){
    float head = uCrack * rd.z, fresh = clamp((uCrackF - 0.35) / 0.65, 0., 1.), on = step(0.001, uCrack);
    float run = step(0., rd.y) * (1. - smoothstep(head - 1.5, head, rd.y)) * on;
    float wv = vn(vec2(rd.y * 0.9, 3.));                                                       // its width comes and goes along its run
    float coreW = 0.04 + 0.12 * wv * wv;
    float core = hair(rd.x, wC, coreW) * (1. - smoothstep(0.04, 0.22, wC));
    // the lips: a rim of crushed ice hugging the core, a hand wide, broken into flakes, wider where the crack kinks and for the metres behind its head
    float nearHead = smoothstep(head - 45., head - 6., rd.y) * fresh;                              // (behind the running head while it is fresh: whole for the last 6 m, easing back to flakes by 45 m behind it)
    float lw = coreW + 0.05 + 0.1 * smoothstep(0.5, 0.9, vn(vec2(rd.y * 0.45, 9.))) + 0.12 * exp(-abs(rd.y - head) * 0.6) * fresh + dist * mix(0.001, 0.005, fresh);   // (drawn a little wider with distance, so the head can be followed to the tower)
    float lips = hair(rd.x, wC, coreW + 1.2 * lw) * mix((0.12 + 0.88 * smoothstep(0.3, 0.6, vn(p * 9.3 + 1.7))) * (0.5 + 0.5 * smoothstep(0.25, 0.5, vn(p * 3.1 + 8.))), 1., nearHead);   // (flakes and gaps: never an even band, but whole and bright behind the running head)
    // the fracture plane under the surface catches the light: a milky gleam that dies a pace from the crack
    float milk = exp(-rd.x * 3.4) * 0.2 * (0.35 + 0.65 * vn(vec2(rd.y * 0.3, 5.))) * (1. - smoothstep(15., 60., dist));
    float fea = hair(fD, wF, 0.02) * 0.7 * step(0., rd.y) * (1. - smoothstep(head - 4., head - 1., rd.y)) * (1. - smoothstep(25., 70., dist));
    float back = mix(mix(0.35, 0.75, fresh), 1., smoothstep(head - 45., head - 6., rd.y));
    // the ice dust thrown up at its running head: a small ragged puff that travels with the tip
    float glow = exp(-rd.x / (0.35 + dist * 0.01)) * exp(-abs(rd.y - head) * 0.4) * step(uCrack, 0.999) * step(-3., rd.y) * on * smoothstep(0.2, 0.75, vn(p * 1.9 - uCrack * vec2(140., 90.)));
    return vec3(core * run, max(lips, max(milk, fea)) * run * back, glow * 0.7) * (uCrackF * (1. - smoothstep(190., 330., dist)) * mix(0.5, 1., smoothstep(3., 10., dist)));
  }
  float raceK(vec4 rd, float wC, float dist, vec2 p){ vec3 k = raceP(rd, wC, dist, p, 9., 1.); return clamp(k.y + k.z + 0.5 * k.x, 0., 1.); }
`;function mt(){return{uSun:{value:new p.Vector3(-.771,.208,.602)},uSunCol:{value:new p.Color("#FFF1D6")},uSunK:{value:3.4},uSky:{value:new p.Color("#5E8FD8")},uGnd:{value:new p.Color("#BFD3E8")},uHemiK:{value:1.8},uZen:{value:new p.Color("#1D4E9E")},uHor:{value:new p.Color("#C6DBEE")},uTime:{value:0},uFogCol:{value:new p.Color("#C6DBEE")},uFogDen:{value:55e-5},uCover:{value:1},uDeep:{value:new p.Color("#0A2440")},uLampR:{value:0},uWinK:{value:.4},uGlowK:{value:0},uRime:{value:0},uMirK:{value:1},uUnderK:{value:1},uWind:{value:1},uSnakeK:{value:.3},uLaneK:{value:1},uRimeW:{value:.3},uMistK:{value:0},uMistCol:{value:new p.Color("#dfe9f4")},uMid:{value:new p.Color("#4E86C8")},uCrack:{value:0},uCrackF:{value:1},uCrackA:{value:new p.Vector2(-76,224)},uFootA:{value:Array.from({length:Me},()=>new p.Vector4(1e5,1e5,0,1))},uFootB:{value:Array.from({length:Me},()=>new p.Vector4(1,0,1,.1))}}}const Ze=`
  vec3 giltLeaf(vec2 uv, vec3 N, vec3 V, float fwS, float occ){
    vec2 sc = vec2(uv.x * 40., uv.y * 14.); sc.x += 0.5 * floor(sc.y); vec2 f = fract(sc) - vec2(0.5, 0.2);
    float lod = (1. - smoothstep(0.3, 1.1, fwS)) * step(0.01, uv.y);
    float seam = smoothstep(0.4, 0.5, length(f)) * lod;                                         // dulled seams, streaked green
    float tone = mix(1., 0.74 + 0.52 * h21(floor(sc) + 3.3), lod);                              // every leaf its own age
    float bev = mix(1., 1.16 - 0.36 * smoothstep(-0.15, 0.4, f.y), lod);                        // the rounded lower edge of each scale catches the light
    vec3 R = reflect(-V, N);
    vec3 env = mix(uHor, uZen, smoothstep(0., 0.7, R.y) * 0.8); if (R.y < 0.) env = mix(uHor, vec3(0.05, 0.1, 0.16), smoothstep(0., 0.3, -R.y));
    float fr0 = clamp(1. - dot(N, V), 0., 1.); float fr = 0.6 + 0.4 * fr0 * fr0 * fr0;
    float rs = max(dot(R, uSun), 0.); float rs4 = rs * rs; rs4 *= rs4; float rs12 = rs4 * rs4 * rs4; float rs96 = rs12 * rs12; rs96 *= rs96; rs96 *= rs96;
    float hl = rs96 * 9. + rs12 * 1.3;                                                          // the gilt highlight (HDR 4 to 6)
    float ndl = max(dot(N, uSun), 0.);
    vec3 hemi = mix(uGnd, uSky, 0.5 + 0.5 * N.y) * uHemiK;
    vec3 base = vec3(0.93, 0.56, 0.13) * (uSunCol * uSunK * (0.12 + 0.5 * ndl) * occ + hemi * 0.5) * 0.3183;      // the leaf's own deep gold
    vec3 metal = vec3(1.0, 0.68, 0.22) * (env * 1.1 * fr + uSunCol * hl * min(uSunK * 0.3, 1.) * occ);            // what it mirrors: the sky and the sun
    vec3 col = (base * 1.45 + metal * 0.6) * tone * bev;
    return mix(col, vec3(0.16, 0.26, 0.14) * (uSunCol * uSunK * (0.2 + 0.8 * ndl) * occ + hemi) * 0.3183, seam * 0.5);
  }`,vt=`
  attribute float aMat; uniform float uTime;
  varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec2 vUv; varying float vM;
  void main(){
    vec4 wp = modelMatrix * vec4(position, 1.0);
    if (wp.y < 0.) wp.y *= 0.76;
    vec3 wn = mat3(modelMatrix) * normal;
    if (aMat > 12.5 && aMat < 13.5 && color.b > 0.2) {      // the tent canvas bellies with the gusts and drums (pinned along ridge, eaves and ends)
      float env = sin(clamp(uv.x, 0., 1.) * 3.14159) * sin(clamp(uv.y, 0., 1.) * 3.14159);
      wp.xyz += wn * env * (0.08 + 0.05 * sin(uTime * 2.1 + wp.x) + 0.025 * sin(uTime * 11. + wp.x * 3. + wp.y * 4.));
    }
    if (aMat > 16.5 && aMat < 17.5) {                        // stay chains bow down the wind and sway, pinned at the dome and at the cross
      float bow = sin(clamp(uv.y, 0., 1.) * 3.14159);
      wp.xz += vec2(0.788, -0.616) * bow * (0.09 + 0.07 * sin(uTime * 2.3 + wp.x * 0.7 + wp.z * 0.4) + 0.03 * sin(uTime * 7.1 + wp.y * 3.));
      wp.y -= 0.05 * bow;
    }
    if (aMat > 17.5 && aMat < 18.5) {                        // shutters and yard gates swing slowly in the current, each about its own hinge (uv = the hinge's x, z)
      float ph = uv.x * 0.37 + uv.y * 0.23; float sa = 0.5 * sin(uTime * 0.6 + ph) + 0.14 * sin(uTime * 1.7 + ph * 2.3);
      float cs = cos(sa), sn = sin(sa); vec2 dq = wp.xz - uv;
      wp.xz = uv + vec2(cs * dq.x - sn * dq.y, sn * dq.x + cs * dq.y);
      wn.xz = vec2(cs * wn.x - sn * wn.z, sn * wn.x + cs * wn.z);
    }
    if (aMat > 23.5 && aMat < 24.5) {                        // a perched crow bobs, shuffles a step along its ledge and settles again (uv.x = its own phase, uv.y = the height of its feet)
      float ph = uv.x * 6.2832; float bob = max(sin(uTime * 0.9 + ph * 3.), 0.); bob *= bob;
      wp.y += (wp.y - uv.y) * 0.22 * bob * sin(uTime * 7. + ph) + 0.03 * bob;
      wp.xz += vec2(sin(ph * 2.), cos(ph * 2.)) * 0.07 * sin(uTime * 0.35 + ph);
    }
    vW = wp.xyz; vN = wn; vC = color; vUv = uv; vM = aMat;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }`,ct=`
  uniform vec3 uSun, uSunCol, uSky, uGnd, uZen, uHor, uFogCol, uDeep; uniform float uSunK, uHemiK, uTime, uFogDen, uLampR, uGlowK, uRime, uUnderK, uRimeW, uWinK;
  varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec2 vUv; varying float vM;
  ${Pe}
  ${Ze}
  // the shadow one onion dome of the cathedral throws along the sun's ray (all in the cathedral's own frame): q the point, d the unit way to the sun on the
  // ground, y the point's height, ty the ray's rise per metre, a the dome's axis, R its radius, y1 the top of its drum
  float domeSh(vec2 q, vec2 d, float y, float ty, vec2 a, float R, float y1){
    float t0 = dot(a - q, d); float dp = length((a - q) - d * t0); float h = y + max(t0, 0.) * ty;
    float sq = clamp((h - y1) / (2.4 * R), 0., 1.);
    float r = h < y1 ? 0.62 * R : R * (sq < 0.33 ? mix(0.5, 1., smoothstep(0., 0.33, sq)) : mix(1., 0.02, pow(clamp((sq - 0.33) / 0.67, 0., 1.), 1.3)));
    return (1. - smoothstep(r - 0.3, r + 0.3, dp)) * step(0., t0) * (1. - smoothstep(y1 + 2.4 * R, y1 + 2.4 * R + 0.4, h));
  }
  vec2 gridAB(vec2 xz){ vec2 q = xz - vec2(-205., 510.); return vec2(dot(q, vec2(0.42, -0.908)), dot(q, vec2(0.908, 0.42))); }
  float ringAt(float d){ return 1. - smoothstep(uLampR - 30., uLampR, d); }          // the lamp ring spreading from the tower (0 while uLampR is 0)
  float footRime(float y, float along){ return 1. - smoothstep(0.1, 0.42, y + (vn(vec2(along * 1.3, 5.)) - 0.5) * 0.3); }      // a ragged band a hand to a foot and a half up the wall
  float litAt(vec2 xz){                                                              // ... taken house by house
    vec2 ab = gridAB(xz); vec2 id = vec2(floor((ab.x + 148.) / 16.), floor((ab.y + 25.) / 25.));
    vec2 c = vec2(-205., 510.) + vec2(0.42, -0.908) * (id.x * 16. - 140.) + vec2(0.908, 0.42) * (id.y * 25. - 12.5);
    return ringAt(length(c) + (h21(id + 3.7) - 0.5) * 50.);
  }
  void main(){
    vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
    vec3 toC = cameraPosition - vW; float dist = length(toC); vec3 V = toC / max(dist, 1e-3);
    vec3 alb = vC; float spec = 0.; float m = floor(vM + 0.5); float occ = 1.; float glow = 0.; float csK = 0.;
    vec3 R = reflect(-V, N);
    float up = N.y; float side = 1. - smoothstep(0.35, 0.6, abs(up));
    float hY = vW.y < 0. ? vW.y / 0.76 : vW.y;                 // true height (the vertex shader squashes y under the ice)
    float fwY = fwidth(hY); float tq = (vW.x + vW.z) * 0.5; float fwT = fwidth(tq);
    float bxx = dot(vW.xz, vec2(-N.z, N.x)); float fwB = fwidth(bxx);          // (derivatives are taken here, outside the branches)
    float fq = dot(vW, vec3(1.3, 2.1, 0.7)); float fwQ = fwidth(fq); float fwP = fwidth(vW.x) + fwidth(vW.z); float fwU = fwidth(vUv.x);
    float cglow = 0.; bool lw = m < 0.5 || (m > 20.5 && m < 23.5); float rmK = 0.; float fwS = fwidth(vUv.x * 40.);                          // (limewash and the city's walls and drums are lit alike)
    vec3 emis = vec3(0.);
    if (m < 0.5) {                       // limewash: brick courses, rust tears under the cornices, damp at the ice, snow on ledges
      alb *= 0.9 + 0.1 * vn(vW.xy * 0.8 + vW.z * 0.8);
      // (the soffit of each cornice lies exactly on its level, so the test below starts a little under it: no speckle)
      float e = 16.3 - vW.y; float cs = step(-0.05, e) * (1. - smoothstep(0.2, 3.2, e)); float bc = step(0., e) * (1. - smoothstep(0.5, 8., e));
      float corn = step(-0.95, e) * step(e, 0.03);
      float lw = (vn(vec2(tq * 1.7, 4.)) - 0.5) * 0.3; float lip = step(-0.9, e) * (1. - smoothstep(0.1, 0.24, e + 0.9 + lw));
      e = 30.1 - vW.y; cs = max(cs, step(-0.05, e) * (1. - smoothstep(0.2, 3.0, e))); bc = max(bc, step(0., e) * (1. - smoothstep(0.5, 7., e))); lip = max(lip, step(-0.9, e) * (1. - smoothstep(0.1, 0.24, e + 0.9 + lw))); corn = max(corn, step(-0.95, e) * step(e, 0.03));
      e = 42.1 - vW.y; cs = max(cs, step(-0.05, e) * (1. - smoothstep(0.2, 2.6, e))); bc = max(bc, step(0., e) * (1. - smoothstep(0.5, 6., e))); lip = max(lip, step(-0.9, e) * (1. - smoothstep(0.1, 0.24, e + 0.9 + lw))); corn = max(corn, step(-0.95, e) * step(e, 0.03));
      e = 52.1 - vW.y; cs = max(cs, step(-0.05, e) * (1. - smoothstep(0.2, 2.2, e))); bc = max(bc, step(0., e) * (1. - smoothstep(0.5, 5., e))); lip = max(lip, step(-0.9, e) * (1. - smoothstep(0.1, 0.24, e + 0.9 + lw))); corn = max(corn, step(-0.95, e) * step(e, 0.03));
      e = 59.1 - vW.y; cs = max(cs, step(-0.05, e) * (1. - smoothstep(0.2, 2.0, e))); bc = max(bc, step(0., e) * (1. - smoothstep(0.5, 4., e))); lip = max(lip, step(-0.9, e) * (1. - smoothstep(0.1, 0.24, e + 0.9 + lw))); corn = max(corn, step(-0.95, e) * step(e, 0.03));
      lip *= side * step(100., abs(vW.x + 150.));          // snow lipping over each cornice of the tower (not the gate)
      float pl = step(vC.r * 1.1, vC.g) * step(hY, 2.45);  // the grey-green plinth
      // brick courses (not on the cornice fascias or the plinth; gone before a course is a pixel)
      float row = floor(hY * 3.3);
      float cf = side * (1. - smoothstep(0.06, 0.3, fwY * 3.3)) * (1. - smoothstep(0.04, 0.2, fwB * 1.6)) * (1. - corn) * (1. - pl);
      float bq = bxx * 1.6 + 0.5 * row;
      alb *= 1. - cf * (0.13 * max(1. - step(0.13, fract(hY * 3.3)), 1. - step(0.07, fract(bq))) + 0.07 * (h21(vec2(floor(bq), row)) - 0.5));
      alb *= 1. - 0.05 * side * step(0.75, fract(hY * 0.55)) * (1. - pl);
      // lost limewash: brick showing in ragged patches, more of it low on the wall; long grey weather stains
      float offT = step(17., length(vW.xz)) * (1. - step(vW.x, -287.) * step(abs(vW.z + 44.), 15.));   // (the gate's facade is treated like the tower's)
      // (away from the tower the lost patches are smaller and rarer: a church wall 25 m off must not read as camouflage)
      // (near the tower, where a course is several pixels high, a lost patch ends along the courses and at the brick ends: whole bricks showing, not smooth blots)
      float stepK = (1. - offT) * (1. - smoothstep(0.1, 0.25, fwY * 3.3));
      vec2 fl = mix(vec2(bxx, hY), vec2((floor(bq) + 0.5 - 0.5 * row) / 1.6, (row + 0.5) / 3.3), stepK);
      float flake = smoothstep(mix(0.7, 0.78, offT), mix(0.74, 0.82, offT), fb(vec2(fl.x, fl.y * 1.5) * mix(0.5, 1.2, offT) + 3.) + 0.14 * (vn(vec2(fl.x * 3.1, fl.y * 3.7)) - 0.5) + 0.07 * (1. - smoothstep(2.4, 6., hY)))
        * side * (1. - pl) * (1. - corn) * step(0.3, hY) * mix(1., 0.5, smoothstep(10., 14., hY) * (1. - offT));
      alb = mix(alb, vec3(0.4, 0.23, 0.16) * (0.75 + 0.5 * mix(0.5, h21(vec2(floor(bq), row)), cf)), flake * mix(0.45 + 0.3 * vn(vec2(bxx * 5.3, hY * 6.1)), 0.3 + 0.2 * vn(vec2(bxx * 5.3, hY * 6.1)), offT) * (1. - smoothstep(0.3, 1.2, fwY * 3.3)));
      alb = mix(alb, vec3(0.6, 0.58, 0.52), 0.55 * flake * stepK * cf * max(1. - step(0.13, fract(hY * 3.3)), 1. - step(0.07, fract(bq))));      // pale mortar between the bared bricks
      alb *= 1. - 0.1 * side * (1. - pl) * smoothstep(0.45, 0.8, vn(vec2(bxx * 1.1 + 7., hY * 0.05)));
      // rusticated plinth: 0.6 m courses of 1.2 m blocks, staggered, with sunk joints and a light chamfer
      float fy = hY / 0.6; float prow = floor(fy); float fxb = bxx / 1.2 + 0.5 * prow;
      float jy = smoothstep(0.4 - fwY * 1.7, 0.47, abs(fract(fy) - 0.5)); float jx = smoothstep(0.44 - fwB * 0.85, 0.485, abs(fract(fxb) - 0.5));
      float pk = pl * side * (1. - smoothstep(0.25, 0.8, fwY * 1.7));
      float bvy = fract(fy), bvx = fract(fxb), nj = (1. - jy) * (1. - jx);
      alb *= 1. + pk * (0.2 * (h21(vec2(floor(fxb), prow)) - 0.5) - 0.42 * max(jy, jx) + (0.3 * smoothstep(0.76, 0.9, bvy) - 0.2 * (1. - smoothstep(0.1, 0.24, bvy))
        + 0.14 * (1. - smoothstep(0.06, 0.13, bvx)) - 0.14 * smoothstep(0.87, 0.94, bvx)) * nj + 0.16 * (vn(vec2(bxx * 5., hY * 7.)) - 0.5));
      alb *= mix(1., 1.28, pl * step(0., hY));                                                               // (pale dressed stone above the ice, not a dark slab)
      alb = mix(alb, vec3(dot(alb, vec3(0.3333))), 0.45 * pl);                                               // grey-green stone, not glazed tile
      alb = mix(alb, vec3(0.77), 0.35 * smoothstep(0.25, 0.45, fract(fy) - 0.5) * (1. - 0.5 * jy) * pk * step(0., hY));   // rime caught on the top of each block
      float tears = vn(vec2(tq * 1.6, vW.y * 0.06)) * vn(vec2(tq * 0.45 + 5., vW.y * 0.16 + 3.));
      alb = mix(alb, vec3(0.4, 0.22, 0.12), smoothstep(0.25, 0.65, tears) * 0.5 * bc * side * (1. - smoothstep(0.25, 0.8, fwT)));
      float damp = (1. - smoothstep(0., 4.5, hY + (vn(vec2(tq * 0.5, 2.)) - 0.5) * 3.)) * step(0., vW.y) * side;
      alb = mix(alb, alb * vec3(0.62, 0.66, 0.62), damp * mix(0.35, 0.15, pl));
      // THE TIDE LINE: a dark, wet, ice-glazed band a metre up every wall and drum that stands in the ice (the rime at the very foot lies white under it)
      alb = mix(alb, alb * vec3(0.46, 0.53, 0.56), 0.8 * step(0., vW.y) * side * (1. - smoothstep(0.95, 1.5, hY + (vn(vec2(bxx * 0.9, 7.)) - 0.5) * 0.7)));
      // CARVED SURROUNDS on a church wall that stands out of the ice (the wall's top rides in its uv): a colonnette either side of every window with a
      // ring at its middle and a cap, an ogee head over the archivolt, and a painted dado: a brick-red band with a chain of white lozenges
      float wtop = floor(vUv.y / 64. + 0.01) * 0.25;
      float surK = step(0.03, fract(vM)) * step(fract(vM), 0.08) * side * step(4., wtop) * step(0.3, hY) * (1. - smoothstep(0.08, 0.3, fwB));
      if (surK > 0.001) {
        float bwid = max(mod(vUv.y, 64.), 1.6); float bx = vUv.x - floor(vUv.x / bwid + 0.5) * bwid; float ax = abs(bx);
        float y0 = wtop * 0.28 - 0.3, y1 = wtop * 0.7;
        float coln = (1. - smoothstep(0.1, 0.14, abs(ax - 1.12))) * step(y0, hY) * step(hY, y1 + 0.25);
        float ringc = (1. - smoothstep(0.16, 0.2, abs(ax - 1.12))) * max(1. - smoothstep(0.1, 0.14, abs(hY - (y0 + y1) * 0.5)), 1. - smoothstep(0.12, 0.16, abs(hY - y1 - 0.2)));
        float og = hY - y1; float ogee = step(0., og) * step(og, 1.9) * (1. - smoothstep(0.07, 0.12, abs(ax - 1.3 * pow(clamp(1. - og / 1.9, 0., 1.), 0.6))));
        float rel = max(max(coln, ringc), ogee);
        float shd = (1. - smoothstep(0.0, 0.14, abs(ax - 1.34))) * step(y0, hY) * step(hY, y1) * (1. - rel);
        alb = mix(alb, alb * 1.13 + 0.02, rel * surK); alb *= 1. - 0.3 * shd * surK;
        float dz = hY - 1.6; float dado = step(0., dz) * step(dz, 0.5);
        float loz = 1. - smoothstep(0.1, 0.14, abs(fract(bxx / 0.5) - 0.5) + abs(dz - 0.25) * 1.6);
        alb = mix(alb, mix(vec3(0.42, 0.13, 0.08), vec3(0.74, 0.72, 0.64), loz), dado * surK * 0.85);
      }
      // a drowned church's walls under the ice (flagged in the mat id): bays between lesenes, round-headed windows in one or two tiers, a string course,
      // silt banked at the foot: a building going down into the dark, never a pale pane lying in the water
      float bodyK = step(0.03, fract(vM)) * step(fract(vM), 0.08) * side * (1. - smoothstep(-1.2, -0.5, hY)) * (1. - smoothstep(0.25, 0.9, fwB));
      if (bodyK > 0.001) {
        float hb = hY + 11.; float bwid = max(mod(vUv.y, 64.), 1.6); float bay = floor(vUv.x / bwid + 0.5); float bx = vUv.x - bay * bwid;      // (uv: metres along the wall from its middle, the width of a bay)
        float wy1 = hb - 1.3, wy2 = hb - 6.0;
        float win = max(step(abs(bx), 0.5) * step(0., wy1) * step(wy1, 1.9), step(length(vec2(bx, wy1 - 1.9)), 0.5) * step(1.9, wy1));
        win = max(win, max(step(abs(bx), 0.5) * step(0., wy2) * step(wy2, 2.3), step(length(vec2(bx, wy2 - 2.3)), 0.5) * step(2.3, wy2)));
        float arch = max(step(length(vec2(bx, wy1 - 1.9)), 0.72) * step(1.9, wy1), step(length(vec2(bx, wy2 - 2.3)), 0.72) * step(2.3, wy2)) * (1. - win);
        float les = smoothstep(bwid * 0.5 - 0.36, bwid * 0.5 - 0.3, abs(bx)); float lsh = (1. - smoothstep(0.0, 0.16, abs(abs(bx) - (bwid * 0.5 - 0.46)))) * (1. - les);
        float strc = step(4.15, hb) * step(hb, 4.5), ssh = step(3.9, hb) * step(hb, 4.15);
        alb *= 1. + bodyK * (0.14 * max(les, strc) - 0.3 * max(lsh, ssh) * (1. - win) + 0.08 * arch);
        alb = mix(alb, vec3(0.025, 0.04, 0.065), win * bodyK);
        alb = mix(alb, alb * vec3(0.42, 0.5, 0.46), bodyK * (1. - win) * (1. - smoothstep(0.2, 2.6, hb + (vn(vec2(bxx * 0.7, 3.)) - 0.5) * 1.6)));
        glow = win * bodyK * ringAt(length(vW.xz)) * 0.3 * step(0.35, h21(vec2(bay + floor(vW.x * 0.05) * 3., floor(hb / 5.) + 7.)));      // (on the rare visit some of them are lit)
      }
      if (hY < -1. && pl > 0.5) glow = ringAt(length(vW.xz)) * 0.035 * (1. - smoothstep(0., 6., hY + 11.)) * side;       // (the square's lamps wash the foot of the tower's plinth)
      alb = mix(alb, vec3(0.77), max(smoothstep(0.55, 0.8, up), lip));
      alb = mix(alb, vec3(0.77), 0.85 * footRime(hY, bxx) * step(0., vW.y) * side);             // snow and rime banked against the foot of the wall: the line of the ice
      occ = 1. - 0.8 * cs * step(up, 0.5) * (1. - lip);
      // the cathedral's shadow on the bell tower: its walls and its five domes, cut out of the low sun on the tower's face across the lane
      if (dot(vW.xz, vW.xz) < 300. && vW.y > 0.) {
        float sl = max(length(uSun.xz), 1e-3); vec2 sd = uSun.xz / sl; float ty = uSun.y / sl;
        vec2 rc = vW.xz - vec2(-35.2, 13.9); vec2 cq = vec2(0.913 * rc.x - 0.408 * rc.y, 0.408 * rc.x + 0.913 * rc.y);
        vec2 cd = vec2(0.913 * sd.x - 0.408 * sd.y, 0.408 * sd.x + 0.913 * sd.y);
        vec2 cds = vec2(abs(cd.x) < 1e-3 ? 1e-3 : cd.x, abs(cd.y) < 1e-3 ? 1e-3 : cd.y);
        vec2 t1 = (vec2(-11.) - cq) / cds, t2 = (vec2(11.) - cq) / cds;
        float tn = max(min(t1.x, t2.x), min(t1.y, t2.y)), tf = min(max(t1.x, t2.x), max(t1.y, t2.y));
        float csh = step(max(tn, 0.), tf) * (1. - smoothstep(8.0, 8.8, vW.y + max(tn, 0.) * ty));
        csh = max(csh, domeSh(cq, cd, vW.y, ty, vec2(0.), 5., 15.4));
        csh = max(csh, max(domeSh(cq, cd, vW.y, ty, vec2(-6.82, -6.82), 3.5, 11.55), domeSh(cq, cd, vW.y, ty, vec2(6.82, -6.82), 3.5, 11.55)));
        csh = max(csh, max(domeSh(cq, cd, vW.y, ty, vec2(-6.82, 6.82), 3.5, 11.55), domeSh(cq, cd, vW.y, ty, vec2(6.82, 6.82), 3.5, 11.55)));
        occ = min(occ, 1. - 0.92 * csh); csK = csh;
      }
      // the tower's base tier: analytic raking shadows of the pilasters on the wall and of the reveal in the blind arch
      vec2 tl = vec2(0.3907 * vW.x + 0.9205 * vW.z, -0.9205 * vW.x + 0.3907 * vW.z);
      if (max(abs(tl.x), abs(tl.y)) < 9.6 && vW.y > 2.4 && vW.y < 16.3 && side > 0.5) {
        vec2 sl = vec2(0.3907 * uSun.x + 0.9205 * uSun.z, -0.9205 * uSun.x + 0.3907 * uSun.z);
        vec2 nl = vec2(0.3907 * N.x + 0.9205 * N.z, -0.9205 * N.x + 0.3907 * N.z);
        bool zf = abs(nl.y) > abs(nl.x);
        float fxl = zf ? tl.x : tl.y; float dn = zf ? abs(tl.y) : abs(tl.x);
        float snf = zf ? sl.y * sign(nl.y) : sl.x * sign(nl.x); float stf = zf ? sl.x : sl.y;
        if (snf > 0.02) {
          float k = clamp(stf / snf, -5., 5.), ky = clamp(uSun.y / snf, 0., 5.);
          float mid = fxl + 0.225 * k, hw = 0.5 + abs(0.225 * k);
          float d4 = min(min(abs(mid + 8.1), abs(mid + 6.3)), min(abs(mid - 6.3), abs(mid - 8.1)));
          float rk = (1. - smoothstep(hw - 0.07, hw + 0.07, d4)) * step(8.9, dn) * step(dn, 9.1);
          vec2 ap = vec2(fxl + 0.4 * k, vW.y + 0.4 * ky);
          float ad = ap.y > 9.9 ? length(vec2(ap.x, ap.y - 9.9)) - 3. : abs(ap.x) - 3.;
          rk = max(rk, smoothstep(-0.07, 0.07, ad) * step(8.5, dn) * step(dn, 8.8) * step(abs(fxl), 3.2));
          occ = min(occ, 1. - 0.88 * rk);
        }
      }
    } else if (m < 1.5) {                // gilt: fish-scale leaf, green at the seams
      vec2 sc = vec2(vUv.x * 40., vUv.y * 14.); sc.x += 0.5 * floor(sc.y); vec2 f = fract(sc) - vec2(0.5, 0.2);
      float seam = smoothstep(0.42, 0.5, length(f));
      alb = mix(alb, vec3(0.16, 0.26, 0.14), seam * 0.5 * step(0.01, vUv.y));      // (the look under the ice; above it giltLeaf, further down, sets the metal)
      spec = 0.;
    } else if (m < 2.5) {                // cobalt with rings of eight-pointed gilt stars
      vec2 st = vec2(fract(vUv.x * 8.) - 0.5, fract(vUv.y * 4.) - 0.5) * vec2(1., 1.25);
      float r = length(st); float a = atan(st.y, st.x + 1e-5);
      float star = 1. - smoothstep(0.0, 0.03, r - 0.13 - 0.1 * abs(cos(a * 4.)));
      alb = mix(alb, vec3(0.83, 0.45, 0.04), star); spec = star + 0.15;
    } else if (m < 3.5) {                // lead ribs / aspen shingles, snow packed on the windward flank
      alb *= 0.75 + 0.25 * smoothstep(0.1, 0.3, abs(fract(vUv.x * 16.) - 0.5)) * (0.8 + 0.2 * step(0.5, fract(vW.y * 2.)));
      float dry = step(0., vW.y);                                                             // (no snow lies on a roof under the ice: there it is dark, weed-grown timber in courses)
      float wsn = smoothstep(0.15, 0.6, dot(N, vec3(-0.75, 0.3, 0.59)) + (vn(vec2(vW.y * 1.3, tq * 0.9)) - 0.5) * 0.7) * dry;
      alb = mix(alb, vec3(0.77), max(smoothstep(0.6, 0.85, up) * 0.8 * dry, wsn * 0.7)); spec = 0.25 * (1. - wsn);
      alb *= mix(0.42 * (0.7 + 0.3 * step(0.35, fract(hY * 1.6))) * (0.8 + 0.4 * vn(vec2(vUv.x * 60., hY * 2.))), 1., dry);
    } else if (m < 4.5) { alb *= 0.8 + 0.2 * vn(vW.xz * 0.7);
    } else if (m < 5.5) {                // upthrust ice slab: turquoise, glows where thin
      float t1 = clamp(1. - abs(dot(N, V)), 0., 1.);
      alb = mix(vec3(0.03, 0.16, 0.22), vec3(0.5, 0.86, 0.9), t1 * t1);                       // dark glassy core, bright rim
      alb *= 0.7 + 0.6 * vn(vW.xz * 1.7 + vW.y * 2.3); alb *= 0.85 + 0.3 * vn(vW.xy * 5.3 + vW.z * 4.1);
      float fi = floor(fq * 0.8);                                                             // white fracture planes at irregular spacings (a hash per plane)
      alb += 0.3 * step(0.62, h21(vec2(fi, 7.))) * (1. - smoothstep(0.03, 0.09, abs(fract(fq * 0.8) - 0.5))) * (1. - smoothstep(0.1, 0.4, fwQ));
      alb = mix(alb, vec3(0.42, 0.62, 0.66), 0.5 * smoothstep(0.5, 0.8, fb(vW.xz * 1.1 + vW.y * 1.7 + 4.)));     // milky, bubbled ice clouding the glass
      float back = max(dot(-V, uSun), 0.);
      emis = vec3(0.35, 0.85, 0.9) * uSunCol * (uSunK * 0.3183 * 0.5) * back * back * (1. - smoothstep(-0.2, 0.3, dot(N, uSun)));   // the sun coming through, brightest where the slab is thin
      emis *= (0.25 + 1.1 * vn(vW.xy * 2.3 + vW.z * 1.9) * vn(vW.xz * 4.7 + vW.y * 3.1 + 5.)) * (1. - 0.5 * step(0.8, fract(fq * 0.45)) * (1. - smoothstep(0.2, 0.8, fwQ)));
      alb = mix(alb, vec3(0.77), smoothstep(0.2, 0.55, up + (vn(vW.xz * 2.1) - 0.5) * 0.3)); spec = 0.5 * t1 * t1 * (1. - smoothstep(0.2, 0.55, up));
      float icl = step(0.95, vC.r);                                                           // (an icicle: clear pale ice with a bright rim)
      alb = mix(alb, mix(vec3(0.5, 0.64, 0.76), vec3(0.86, 0.94, 1.0), t1), icl); emis *= 1. + icl; spec = mix(spec, 0.9, icl);
    } else if (m < 6.5) {                // snow: wind-sculpted, combed along the wind into ridges (sastrugi), never a smooth pale blade
      alb *= 0.93 + 0.07 * vn(vW.xz * 2.3);
      vec2 ws = vec2(dot(vW.xz, vec2(0.788, -0.616)), dot(vW.xz, vec2(0.616, 0.788)));
      float rip = vn(vec2(ws.x * 0.3, ws.y * 2.2 + vW.y * 3.)) * 0.6 + vn(vec2(ws.x * 1.1 + 3., ws.y * 6. + vW.y * 7.)) * 0.4;
      float rpk = (1. - smoothstep(0.3, 2.5, fwP)) * step(0.02, vW.y);
      alb *= mix(1., 0.5 + 0.85 * rip, rpk);
      alb = mix(alb, alb * vec3(0.56, 0.7, 1.0), 0.75 * rpk * (1. - smoothstep(0.28, 0.56, rip)));      // (cobalt in the troughs between the wind ridges)
    } else if (m < 7.5) {                // roofs under the ice, silted pale: plank roofs, and one house in three under sheet iron (rust red or green)
      vec2 nh = N.xz / max(length(N.xz), 1e-3); float alongR = dot(vW.xz, vec2(-nh.y, nh.x));      // metres along the ridge
      float iron = max(step(vC.b * 1.5, vC.r), step(vC.r * 1.25, vC.g));                            // (flagged by the roof's own colour)
      float slope = step(0.25, abs(up));
      alb *= vec3(1.2, 1.27, 1.27); alb *= 0.8 + 0.4 * vn(vW.xz * 0.5);        // (silted pale, as the town always was: the ridge cap, the silt in the lee and the courses lie on it)
      float rl = 1. - smoothstep(0.25, 0.9, fwP * 2.2); float rl2 = 1. - smoothstep(1.2, 5., fwP * 2.2);
      if (iron > 0.5) {                  // sheet iron: standing seams up the slope, rust running down the sheets, a sheet gone here and there
        float sm = abs(fract(alongR / 0.75) - 0.5);
        alb *= 1. - rl * 0.5 * (1. - smoothstep(0.03, 0.09, sm)) * slope; alb *= 1. + rl * 0.22 * smoothstep(0.38, 0.46, sm) * slope;
        alb *= 0.72 + 0.56 * vn(vec2(alongR * 0.9, vUv.y * 2.3));
        alb = mix(alb, vec3(0.3, 0.13, 0.07), 0.45 * smoothstep(0.5, 0.8, vn(vec2(alongR * 2.3 + 3., vUv.y * 1.1))) * rl2);
        alb *= 1. - 0.25 * rl2 * (1. - smoothstep(0.0, 0.08, abs(fract(vUv.y * 2.) - 0.5))) * slope;        // the lap between the two rows of sheets
        alb = mix(alb, vec3(0.02, 0.028, 0.035), 0.9 * rl * step(0.955, h21(vec2(floor(alongR / 0.75), floor(vUv.y * 2.) + 3.))) * slope);
      } else {                           // boards: courses that hold to 80 m (a dark shadow line under each lap, pale silt on the ledge above it), a board lost here and there
        float bd = alongR * 2.2; vec2 bc = vec2(floor(bd), floor(vUv.y * 3.));
        alb *= 0.8 + 0.2 * step(0.2, fract(bd));
        float lapF = fract(vUv.y * 4.), lapI = floor(vUv.y * 4.);
        alb *= 1. - rl2 * (0.62 * (1. - smoothstep(0.0, 0.2, lapF)) * step(0.26, vUv.y) + 0.16 * (h21(vec2(lapI, floor(vW.x * 0.07) + floor(vW.z * 0.07))) - 0.5));
        alb = mix(alb, vec3(0.86, 0.9, 0.9), 0.42 * rl2 * smoothstep(0.72, 0.95, lapF) * step(vUv.y, 0.74));
        alb *= 1. - 0.3 * rl * (1. - smoothstep(0.0, 0.1, fract(vUv.y * 3.))) * step(0.34, vUv.y);
        alb *= 1. + rl * 0.3 * (h21(bc + 1.3) - 0.5);
        alb = mix(alb, vec3(0.02, 0.028, 0.035), 0.9 * rl * step(0.93, h21(bc + 5.7)) * step(0.06, fract(vUv.y * 3.)) * step(vUv.y, 0.95));
      }
      alb *= 0.35 + 0.65 * smoothstep(0.0, 0.12, vUv.y);                              // dark eaves
      // the ridge: a capping board pale with silt, a dark line of shadow under it; pale silt drifted in the lee of the ridge like snow
      alb *= 1. - 0.55 * rl2 * smoothstep(0.83, 0.87, vUv.y) * (1. - smoothstep(0.89, 0.92, vUv.y)) * slope;
      alb = mix(alb, vec3(0.8, 0.86, 0.9), (0.35 + 0.5 * rl2) * smoothstep(0.91, 0.94, vUv.y));
      alb = mix(alb, vec3(0.86, 0.9, 0.9), 0.45 * smoothstep(0.52, 0.8, fb(vW.xz * 0.35 + 2.)) * smoothstep(0.1, 0.5, vUv.y));
    } else if (m < 8.5) {                // the bed: black streets, pale yards, drowned-grass squares (grid aligned to the main street)
      vec2 ab = gridAB(vW.xz);
      float street = 1. - smoothstep(6., 8., abs(mod(ab.y + 25., 50.) - 25.));
      street = max(street, 1. - smoothstep(5., 7., abs(mod(ab.x + 48., 96.) - 48.)));
      float chd = dot(vW.xz - vec2(-25., 125.), vec2(0.42, -0.908)) / 16.; float ch = exp(-chd * chd);
      // yards: one plot per house, each its own tint, a dark fence line round it, furrows in every other one
      vec2 pc = vec2((ab.x + 148.) / 16., (ab.y + 25.) / 25.); vec2 pid = floor(pc); vec2 pf = fract(pc);
      float fl = min(min(pf.x, 1. - pf.x) * 16., min(pf.y, 1. - pf.y) * 25.); float ph = h21(pid + 1.7);
      vec3 yard = alb * 1.6 * (0.8 + 0.4 * ph) * (0.9 + 0.2 * vn(vW.xz * 0.6));
      yard *= 1. - 0.12 * step(0.5, ph) * step(0.5, fract(ab.x * 0.7)) * (1. - smoothstep(0.3, 1.2, fwP));
      yard *= 1. - 0.75 * (1. - smoothstep(0.15, 0.3 + fwP, fl)) * (1. - smoothstep(1., 4., fwP));
      alb = mix(yard, vec3(0.012, 0.014, 0.016), max(street * 0.92, ch));
      float sq = 1. - smoothstep(0., 2., max(abs(ab.x - 334.) - 37., abs(ab.y) - 13.5));
      sq = max(sq, 1. - smoothstep(30., 37., length(vW.xz)));
      vec3 grass = vec3(0.4, 0.46, 0.3) * (0.7 + 0.6 * vn(vW.xz * 1.3)) * (0.8 + 0.2 * step(0.25, fract(ab.x * 0.5)) * step(0.25, fract(ab.y * 0.5)));
      float tsq = 1. - smoothstep(30., 37., length(vW.xz));                                // (the cathedral square round the tower is cobbled: setts in courses, worn pale down the middle of each lane)
      vec3 cob = vec3(0.4, 0.4, 0.37) * (0.75 + 0.5 * vn(vW.xz * 0.9)) * (0.72 + 0.28 * step(0.16, fract(ab.x * 1.2 + 0.5 * floor(ab.y * 1.2))) * step(0.16, fract(ab.y * 1.2)) * (1. - smoothstep(0.5, 1.6, fwP)))
        * (0.85 + 0.3 * h21(floor(vec2(ab.x * 1.2 + 0.5 * floor(ab.y * 1.2), ab.y * 1.2))));
      grass = mix(grass, cob, tsq);
      alb = mix(alb, grass, sq * (1. - ch));
      // the lime avenue on its rise of ground: pale gravel between dark verges, drowned grass under the trees
      float avz = abs(vW.z + 44.); float avk = smoothstep(-304., -299., vW.x) * (1. - smoothstep(-56., -50., vW.x)) * (1. - smoothstep(15., 19., avz));
      vec3 gravel = vec3(0.62, 0.66, 0.6) * (0.82 + 0.36 * vn(vW.xz * 2.7)) * (0.9 + 0.1 * step(0.3, fract(vW.x * 0.5)));
      gravel *= 0.86 + 0.14 * smoothstep(0.3, 0.9, abs(avz - 1.6));                    // two wheel ruts
      vec3 avg = vec3(0.34, 0.42, 0.3) * (0.7 + 0.6 * vn(vW.xz * 0.9)) * (0.85 + 0.3 * vn(vW.xz * 4.3));
      vec3 avc = mix(gravel, vec3(0.02, 0.025, 0.03), smoothstep(4.2, 4.6, avz));
      avc = mix(avc, avg, smoothstep(6.3, 6.9, avz));
      alb = mix(alb, avc, avk);
      float front = abs(mod(ab.y + 25., 50.) - 25.) - 7.6;
      float ha = mod(ab.x + 148., 16.) - 8.; float wc = (fract(ha / 4.17 + 0.5) - 0.5) * 4.17;
      float hk = step(12., abs(mod(ab.x + 48., 96.) - 48.)) * step(24., abs(ab.x - 423.)) * step(44., length(vW.xz - vec2(-60., 200.))) * step(36., length(vW.xz));   // (only where houses stand)
      glow = exp(-front * front * 0.3) * exp(-wc * wc * 0.5) * step(abs(ha), 6.25) * litAt(vW.xz) * 0.17 * (1. - avk) * hk * step(0.22, h21(pid + 5.3));   // window light lying in pools on the street
      vec2 av = vec2(mod(vW.x + 67.8, 11.6) - 5.8, abs(vW.z + 44.) - 6.);
      glow += exp(-dot(av, av) * 0.09) * step(-300., vW.x) * step(vW.x, -52.) * ringAt(length(vW.xz)) * 0.45;   // pools under the avenue lamps
      vec2 sp = mod(vW.xz + 9., 18.) - 9.;                                                  // (the squares are lit in pools under their lamps, not evenly)
      glow += sq * ringAt(length(vW.xz)) * (0.008 + 0.075 * exp(-dot(sp, sp) * 0.035));
    } else if (m < 9.5) {                // plain
    } else if (m < 10.5) {               // faded fresco: ochre, terracotta and blue blotches under a chalk bloom
      alb = mix(vec3(0.62, 0.3, 0.17), vec3(0.16, 0.3, 0.58), smoothstep(0.38, 0.62, vn(vec2(vW.z * 0.6, vW.y * 0.9))));
      alb = mix(alb, vec3(0.78, 0.58, 0.2), smoothstep(0.5, 0.75, vn(vec2(vW.z * 1.4 + 5., vW.y * 1.8))));
      alb *= 0.75 + 0.25 * step(0.12, abs(fract(vW.z * 0.45) - 0.5) * 2.);
      alb = mix(alb, vec3(0.8, 0.8, 0.76), 0.2 + 0.35 * vn(vW.zy * 2.6));
    } else if (m < 11.5) {               // log wall: courses, white carved frames, an eaves board; the panes light with the lamp ring
      alb *= 0.7 + 0.3 * step(0.3, fract(vUv.y * 9.));
      vec2 wq = vec2(abs(fract(vUv.x * 3.) - 0.5), vUv.y);
      float fr = (1. - smoothstep(0.23, 0.26, wq.x)) * smoothstep(0.27, 0.3, wq.y) * (1. - smoothstep(0.76, 0.79, wq.y));
      float pane = (1. - smoothstep(0.14, 0.16, wq.x)) * smoothstep(0.36, 0.38, wq.y) * (1. - smoothstep(0.67, 0.69, wq.y));
      pane *= smoothstep(0.012, 0.03, wq.x) * smoothstep(0.01, 0.025, abs(wq.y - 0.53));                  // glazing bars
      alb = mix(alb, vec3(0.74, 0.76, 0.72), fr * side); alb = mix(alb, vec3(0.02, 0.03, 0.04), pane * side);
      alb = mix(alb, vec3(0.66, 0.68, 0.64), smoothstep(0.9, 0.93, vUv.y) * side);
      float wid = h21(vec2(floor(vUv.x * 3.) + floor(vW.x * 0.09) * 7., floor(vW.z * 0.09)));
      glow = pane * side * max(litAt(vW.xz) * step(0.22, wid) * (0.55 + 0.45 * wid), uWinK * step(0.86, wid));   // (a few panes are lit whatever the hour: someone is still home)
    } else if (m < 12.5) {               // street lamp head
      glow = max(ringAt(length(vW.xz)) * 1.6, step(0.6, vC.r) * uWinK * 0.8);      // (a dormer's lit pane is flagged by its colour)
    } else if (m < 13.5) {               // lantern, lit canvas (above the ice): light running over the drumming canvas
      if (vC.b > 0.2) alb *= 1. + 0.16 * sin(clamp(vUv.x, 0., 1.) * 3.14159) * sin(clamp(vUv.y, 0., 1.) * 3.14159) * sin(uTime * 11. + vW.x * 3. + vW.y * 4.);
    } else if (m < 14.5) {               // market arcade: white wall, dark arched openings
      vec2 ab = gridAB(vW.xz); float al = abs(dot(N.xz, vec2(0.42, -0.908))) > 0.7 ? ab.y : ab.x;
      float ax = (fract(al / 4.35 + 0.5) - 0.5) * 4.35; float hy = hY + 11.;
      float inA = max(step(abs(ax), 1.45) * step(hy, 2.7), step(length(vec2(ax, hy - 2.7)), 1.45) * step(2.7, hy)) * side;
      alb = mix(alb, vec3(0.012, 0.016, 0.022), inA);
      float lampA = exp(-(ax * ax + (hy - 1.7) * (hy - 1.7)) * 2.6);                    // a lamp hung in the arch: a warm core, the arch dark round it
      glow = inA * ringAt(length(vW.xz)) * (0.35 + 0.3 * h21(vec2(floor(al / 4.35 + 0.5), 2.))) * lampA;      // (the arcade's lamps come on with the town's windows, on the rare visit)
    } else if (m < 15.5) {               // bridge stone: ashlar, three arched openings between the piers
      vec2 ab = gridAB(vW.xz); float bx = mod(ab.x - 402., 14.) - 7.; float by = hY + 8.4;
      float open = by < 0. ? step(abs(bx), 4.6) : step(length(vec2(bx, by)), 4.6);
      if (open > 0.5 && abs(ab.x - 423.) < 21. && abs(up) < 0.5) discard;
      alb *= 0.78 + 0.22 * vn(vW.xz * 1.1 + vW.y * 0.7); alb *= 0.85 + 0.15 * step(0.1, fract(hY * 1.6));
      // built stone, not a card with a hole in it: darker under the ice, a paler ring of voussoirs with their joints round each opening, a dark soffit
      alb *= 0.7;
      float vr = length(vec2(bx, max(by, 0.))); float vous = (1. - smoothstep(0.26, 0.4, abs(vr - 4.95))) * step(abs(ab.x - 423.), 21.) * step(abs(up), 0.5) * step(-5.5, by);
      alb *= 1. + vous * (0.3 + 0.3 * step(0.14, fract(atan(max(by, 0.) + 1e-4, bx + 1e-4) * 3.5)));
      if (up < -0.5 || (abs(up) < 0.5 && abs(dot(N.xz, vec2(0.42, -0.908))) > 0.7)) alb *= 0.4;
      if (up > 0.5) { float pr = floor(ab.x * 0.8); alb *= (0.7 + 0.3 * step(0.1, fract(ab.x * 0.8))) * (0.8 + 0.2 * step(0.08, fract(ab.y * 0.7 + 0.5 * pr))) * (0.85 + 0.3 * h21(vec2(pr, floor(ab.y * 0.7 + 0.5 * pr)))); }
    } else if (m < 16.5) {               // spruce bough: ragged skirts, needle streaks, snow packed on the windward flank
      float rag = 0.15 + 0.4 * h21(vec2(floor(vUv.x * 26.), floor(vW.y * 1.4) + 3.));
      if (vUv.y < rag) discard;
      alb *= 0.5 + 1.0 * vn(vec2(vUv.x * 46., vUv.y * 5. + vW.y));
      alb *= 0.55 + 0.45 * smoothstep(rag, rag + 0.3, vUv.y);
      float wsn = smoothstep(0.2, 0.65, dot(N, vec3(-0.75, 0.3, 0.59)) + (vn(vec2(vUv.x * 9., vW.y * 2.3)) - 0.5) * 0.9);
      alb = mix(alb, vec3(0.77), wsn * 0.75);
    } else if (m < 17.5) {               // stay chain: links, hoar on the upper side
      alb *= 0.6 + 0.4 * step(0.5, fract(vUv.y * 9.));
      alb = mix(alb, vec3(0.77), 0.45);
    } else if (m > 18.5 && m < 19.5) {   // green copper, verdigris running down it, gilt ribs on the meridians
      float rib = 1. - smoothstep(0.035, 0.07, abs(fract(vUv.x * 16.) - 0.5));
      alb *= 0.72 + 0.5 * vn(vec2(vUv.x * 70., vUv.y * 7.)); alb = mix(alb, vec3(0.5, 0.78, 0.66), 0.25 * smoothstep(0.55, 0.9, vn(vec2(vUv.x * 23. + 4., vUv.y * 3.))));
      alb = mix(alb, vec3(0.83, 0.5, 0.08), rib); spec = rib + 0.1;
    } else if (m > 19.5 && m < 20.5) {   // silver aspen shingles in stepped courses, each a little its own grey
      vec2 sc = vec2(vUv.x * 36., vUv.y * 16.); sc.x += 0.5 * floor(sc.y); vec2 f = fract(sc);
      alb *= (0.58 + 0.42 * smoothstep(0.0, 0.55, f.y)) * (0.84 + 0.16 * step(0.09, f.x)) * (0.82 + 0.36 * h21(floor(sc) + 2.3)); spec = 0.22;
    } else if (m > 20.5 && m < 21.5) {   // a wall of the massed city: storeys of round-headed windows between lesenes, a string course over each storey
      float top = floor(vUv.y + 0.02), bw = fract(vUv.y + 0.02) * 16., sth = 2. + clamp(vM - 21., 0., 0.45) * 40.;
      float dn = mod(max(top - hY, 0.), sth);                                       // metres down from the top of this storey
      if (bw < 0.4) {                    // a kremlin wall: swallowtail merlons cut out of its top, a walk shadow under them, weather stains
        float mq = fract(vUv.x / 3.2);
        if (hY > top - 1.6 && (mq > 0.6 || (hY > top - 0.55 && abs(mq - 0.3) < 0.085))) discard;
        alb *= 1. - 0.3 * side * step(top - 2.15, hY) * step(hY, top - 1.6);                 // the shadow under the wall walk
        alb *= 1. + 0.08 * side * step(top - 2.6, hY) * step(hY, top - 2.15);
        alb *= 1. - 0.14 * side * smoothstep(0.4, 0.8, vn(vec2(vUv.x * 0.9, hY * 0.07)));
        alb *= 0.9 + 0.1 * step(0.14, fract(hY * 1.1)) * (1. - smoothstep(0.1, 0.5, fwY));
        alb = mix(alb, alb * vec3(0.6, 0.66, 0.62), side * (1. - smoothstep(0., 2.2, hY + (vn(vec2(vUv.x * 0.5, 2.)) - 0.5) * 1.6)) * step(0., hY));
      } else {
        float bx = vUv.x - floor(vUv.x / bw + 0.5) * bw; float ww = min(0.2 * bw, 1.15);
        float y0 = 0.36 * sth, y1 = 0.76 * sth;
        float win = max(step(abs(bx), ww) * step(y0, dn) * step(dn, y1), step(length(vec2(bx, dn - y0)), ww) * step(dn, y0));
        float arch = step(length(vec2(bx, dn - y0)), ww + 0.4) * step(dn, y0) * (1. - win);
        float les = smoothstep(bw * 0.5 - 0.42, bw * 0.5 - 0.34, abs(bx));
        float lsh = (1. - smoothstep(0., 0.22, abs(abs(bx) - (bw * 0.5 - 0.56)))) * (1. - les);
        float band = step(dn, 0.5), bsh = step(0.5, dn) * step(dn, 0.95);
        float kf = side * (1. - smoothstep(0.5, 2.4, fwB / ww));                    // (gone where a window is finer than a pixel: the wall keeps its average)
        alb *= 1. + kf * (0.1 * max(les, band) - 0.26 * max(lsh, bsh) * (1. - win) + 0.07 * arch);
        alb = mix(alb, vec3(0.035, 0.05, 0.085), win * kf);
        alb *= 1. - 0.13 * (1. - kf) * side;
        alb *= 1. - 0.1 * side * smoothstep(0.45, 0.8, vn(vec2(vUv.x * 0.8 + top, hY * 0.06)));      // weather stains
        alb *= mix(1., 0.8 + 0.2 * smoothstep(0., 5., hY), side * step(0., hY));                     // darker and damp toward the ice
        cglow = win * kf * step(0.8, h21(vec2(floor(vUv.x / bw + 0.5) + top * 3.1, floor((top - hY) / sth) + 1.7)));   // a few panes lit at dawn, dusk and by night
      }
      alb = mix(alb, vec3(0.77), smoothstep(0.55, 0.8, up));
      alb = mix(alb, alb * vec3(0.46, 0.53, 0.56), 0.8 * step(0., vW.y) * side * (1. - smoothstep(0.95, 1.5, hY + (vn(vec2(bxx * 0.9, 7.)) - 0.5) * 0.7)));      // the tide line
      alb = mix(alb, vec3(0.77), 0.85 * footRime(hY, vUv.x) * step(0., vW.y) * side);
    } else if (m > 21.5 && m < 22.5) {   // a drum: eight slit windows between flat pilasters, a cornice ring under the dome
      float sl = abs(fract(vUv.x * 8.) - 0.5); float kf = side * (1. - smoothstep(0.015, 0.07, fwU * 8.));
      float win = step(sl, 0.12) * step(0.4, vUv.y) * step(vUv.y, 0.82);
      if (fract(vM + 0.01) > 0.1) {      // a wall tower's shaft: two staggered rows of arrow slits, machicolation under the gallery, courses, a damp foot
        float rowA = step(0.34, vUv.y) * step(vUv.y, 0.47), rowB = step(0.62, vUv.y) * step(vUv.y, 0.75);
        win = step(abs(fract(vUv.x * 6. + 0.5 * rowB) - 0.5), 0.08) * max(rowA, rowB);
        alb *= 1. - 0.45 * step(0.9, vUv.y) * step(0.5, fract(vUv.x * 18.)) * kf - 0.14 * step(0.86, vUv.y) * step(vUv.y, 0.9);
        alb *= 0.9 + 0.1 * step(0.14, fract(hY * 1.1)) * (1. - smoothstep(0.1, 0.5, fwY));
        alb = mix(alb, alb * vec3(0.6, 0.66, 0.62), side * (1. - smoothstep(0., 2.4, hY)) * step(0., hY));
      } else
      alb *= 1. + kf * (0.08 * step(0.36, sl) - 0.12 * step(0.3, sl) * step(sl, 0.36)) + 0.07 * step(0.92, vUv.y) - 0.14 * step(0.86, vUv.y) * step(vUv.y, 0.92);
      alb = mix(alb, vec3(0.035, 0.05, 0.085), win * kf); alb *= 1. - 0.08 * (1. - kf);
      cglow = win * kf * step(0.72, h21(vec2(floor(vUv.x * 8.), floor(vW.x * 0.3) + floor(vW.z * 0.3))));
      alb = mix(alb, alb * vec3(0.46, 0.53, 0.56), 0.8 * step(0., vW.y) * side * (1. - smoothstep(0.95, 1.5, hY + (vn(vec2(bxx * 0.9, 7.)) - 0.5) * 0.7)));      // the tide line
      alb = mix(alb, vec3(0.77), 0.85 * footRime(hY, bxx) * step(0., vW.y) * side);
    } else if (m > 22.5 && m < 23.5) {   // a frieze of glazed tiles in a moulded frame: green, ochre, cobalt and cream, a rosette in each
      vec2 tq2 = vec2(bxx, hY) / 0.42; vec2 ti = floor(tq2), tf = fract(tq2) - 0.5; float th = h21(ti + 1.7);
      float lodT = (1. - smoothstep(0.15, 0.7, (fwB + fwY) / 0.42)) * side;
      vec3 tc = th < 0.3 ? vec3(0.08, 0.34, 0.2) : th < 0.55 ? vec3(0.72, 0.48, 0.1) : th < 0.8 ? vec3(0.07, 0.19, 0.5) : vec3(0.7, 0.68, 0.6);
      float ros = 1. - smoothstep(0.0, 0.04, length(tf) - 0.2 - 0.09 * cos(atan(tf.y, tf.x + 1e-5) * 4.));
      vec3 tile = mix(tc, th < 0.55 ? vec3(0.78, 0.74, 0.62) : vec3(0.76, 0.48, 0.09), ros);
      tile *= 1. - 0.6 * smoothstep(0.42, 0.5, max(abs(tf.x), abs(tf.y)));
      alb = mix(vC, tile, lodT); spec = 0.3 * lodT;
    }                                    // (18: shutters and gates are plain; 24: a perched crow)
    vec3 col;
    if (vW.y < -0.02) {                  // under the ice: refracted sun 48 deg off vertical, light ribbons, absorption
      vec3 Lw = normalize(vec3(-0.72, 0.6, 0.2));   // refracted sun, swung west so the roof slopes along the main street part
      float ndl = max(dot(N, Lw), 0.);
      float rib = vn(vW.xz * 0.21 + vec2(uTime * 0.11, -uTime * 0.07)); rib = 1. - abs(rib * 2. - 1.); rib = rib * rib * rib * rib;
      float rib2 = vn(vW.xz * 0.33 - vec2(uTime * 0.09, uTime * 0.05) + 7.); rib2 = 1. - abs(rib2 * 2. - 1.); rib *= rib2 * rib2 * 2.2;
      col = alb * (uSunCol * (uSunK * 0.5 * ndl * (0.75 + 1.9 * rib * max(up, 0.))) + vec3(0.085, 0.13, 0.19) * (uHemiK * 0.5556 * uUnderK) * (0.55 + 0.45 * up));
      // white walls just under the ice take the sky's light through it and lose it with depth: plinth, drums and gate are seen going down into the dark
      if (lw) { col *= mix(1., exp(hY * 0.06), side);      // (and the sun reaches less of a wall the deeper it stands)
        col += alb * vec3(0.25, 0.4, 0.5) * (uHemiK * 0.5556) * exp(hY * mix(0.25, 0.5, step(0.5, uGlowK))) * side; }
      col *= vec3(0.64, 0.84, 1.0);
      float apr = smoothstep(-10., 40., vW.z);                                             // the town along the main street (the lime avenue of the last run keeps its paler bed)
      if (m > 6.5 && m < 7.5) col *= mix(vec3(1.38, 1.24, 1.08), vec3(1.34, 1.23, 1.09), apr);                               // (the pale roofs are what tells the town: sunlit slopes warm against the blue)
      float pathLen = -vW.y * (1. + 0.15 / max(V.y, 0.2)) + dist * 0.004;
      // THE TOWN LIES BELOW THE SURFACE: the water takes the red first and the green next, so roofs and walls go a little bluer and dimmer with
      // depth, but lightly: the brief's town is 'pale silted roofs on black streets, big legible shapes (rows, square, arcade, bridge)', and at
      // the full strength of round 11 (0.12, 0.07, 0.022) the rows and the arcade no longer read
      col *= mix(vec3(1.), exp(-clamp(pathLen, 0., 60.) * vec3(0.05, 0.028, 0.009)) * 0.96, apr);
      col = mix(uDeep * 0.9, col, exp(-pathLen * 0.105));
      col += vec3(1.0, 0.5, 0.13) * glow * mix(5.5, 7.5, apr) * exp(-pathLen * 0.045);
    } else {
      if (uRime > 0.001) {               // hoar morning: everything furred white on its upper and windward sides
        float rm = uRime * smoothstep(0.25, 0.9, 0.6 * up + 0.4 * dot(N, vec3(-0.75, 0., 0.59)) + 0.25 * (vn(vW.xz * 7. + vW.y * 9.) - 0.5));
        float rw = m > 23.5 ? 0. : ((m > 0.5 && m < 2.5) || (m > 18.5 && m < 20.5)) ? uRimeW : ((m > 8.5 && m < 9.5) || (m > 12.5 && m < 13.5)) ? 0.2 : 0.8;   // light on gilt, stars, yachts and lanterns, none on a bird
        alb = mix(alb, vec3(0.77), rm * rw); spec *= 1. - rm * rw * 0.6; rmK = rm * rw;
      }
      float ndl = max(dot(N, uSun), 0.);
      if (m > 5.5 && m < 6.5) ndl = 0.34 + 0.66 * ndl;      // (snow scatters the low sun through itself: a bank is white on top like the drifts the ice shader lays, blue only in its lee)
      vec3 hemi = mix(uGnd, uSky, 0.5 + 0.5 * up) * uHemiK + uHor * 0.5 * max(-up, 0.) + uGnd * 0.35 * (1. - abs(up));
      // (the light thrown up off the ice wavers on the walls as the blown snow crosses it: slow soft ripples, never a flicker)
      float wv = vn(vec2(bxx * 0.3 + uTime * 0.36, hY * 0.42 - uTime * 0.5)) * 0.6 + vn(vec2(bxx * 0.8 - uTime * 0.45, hY * 1.1 + uTime * 0.3) + 3.7) * 0.4;
      // (and the spindrift streaming off the cornices throws soft travelling shadows on the sunlit faces: strongest in the lane by the tower)
      float sdw = smoothstep(0.42, 0.78, vn(vec2(bxx * 0.22 - uTime * 0.8, hY * 0.3 + uTime * 0.42)) * 0.65 + vn(vec2(bxx * 0.6 - uTime * 1.5, hY * 0.75 + uTime * 0.7) + 5.1) * 0.35);
      if (lw) occ *= 1. - sdw * mix(0.07, 0.24, 1. - smoothstep(50., 90., length(vW.xz))) * (1. - abs(up));
      if (lw) hemi += uSunCol * uSunK * (1. - abs(up)) * max(1. - smoothstep(0., 0.5, ndl), 0.7 * csK)
        * (0.3 * (1. - smoothstep(0., 30., vW.y)) + 0.22 * (1. - smoothstep(0., 7., vW.y))) * (0.6 + 0.8 * wv);           // sun bounced up off the ice onto the shaded faces
      // the rare visit: the lamps of the drowned square burn under the ice and throw a warm wavering light up the feet of the tower and the cathedral
      if (m < 0.5) hemi += vec3(1.0, 0.5, 0.17) * 2.6 * ringAt(length(vW.xz)) * (1. - abs(up)) * (1. - smoothstep(0.5, 12., vW.y)) * (1. - smoothstep(40., 56., length(vW.xz))) * (0.3 + 1.5 * wv * wv);
      if (m < 0.5) { vec2 rc2 = vW.xz - vec2(-35.2, 13.9);       // the tower's sunlit face throws its light back across the lane onto the cathedral's shaded wall
        hemi += uSunCol * uSunK * 0.2 * max(dot(N, vec3(0.913, 0., -0.408)), 0.) * (1. - smoothstep(15., 21., length(rc2))) * (0.4 + 0.6 * smoothstep(0., 9., vW.y)); }
      col = alb * (uSunCol * uSunK * ndl * occ + hemi * (0.7 + 0.3 * occ)) * 0.3183;
      vec3 pd = vW - vec3(-300., 2.6, -44.); float spill = 1. - smoothstep(4., 12.5, length(pd));
      col += alb * vec3(0.72, 0.86, 1.0) * spill * 0.55;                                                // the portal's light on the vault and the snow sill
      if (m > 12.5 && m < 13.5) {                                                                       // lanterns; canvas lit from inside by the stove
        vec2 tc = vW.xz - vec2(-198., 526.); float along = dot(tc, vec2(0.13, -0.99));
        float cg = exp(-dot(tc, tc) * 0.16) * (1. - 0.75 * smoothstep(0.2, 2.5, vW.y)) * (0.9 + 0.1 * sin(uTime * 7.) * sin(uTime * 2.3 + 1.));
        cg *= (0.75 + 0.25 * vn(vW.xy * 2.1 + vW.z)) * (0.6 + 0.4 * smoothstep(0.04, 0.1, abs(fract(along * 0.9 + 0.5) - 0.5)));
        col += vec3(1.0, 0.5, 0.16) * uGlowK * mix(4., 2.5 * cg + 0.12, step(0.2, vC.b));
      }
      col += emis * (1. - 0.6 * smoothstep(0.2, 0.55, up));
      col += vec3(1.0, 0.55, 0.16) * cglow * uGlowK * 2.4;                                              // the city's lit panes
      if (spec > 0.) {
        vec3 env = mix(uHor, uZen, smoothstep(0., 0.7, R.y) * 0.8); if (R.y < 0.) env = mix(uHor, vec3(0.05, 0.1, 0.16), smoothstep(0., 0.3, -R.y));
        float fr0 = clamp(1. - dot(N, V), 0., 1.); float fr = 0.6 + 0.4 * fr0 * fr0 * fr0;
        float hl = pow(max(dot(R, uSun), 0.), 90.) * 9. + pow(max(dot(R, uSun), 0.), 12.) * 1.3;
        vec3 mcol = (m < 2.5 || (m > 18.5 && m < 19.5)) ? vec3(1.0, 0.72, 0.28) : vec3(0.8, 0.9, 1.0);
        vec3 metal = mcol * (env * 1.25 * fr + uSunCol * hl * min(uSunK * 0.3, 1.));
        col = mix(col, metal + col * 0.35, clamp(spec, 0., 1.) * 0.85);
      }
      if (m > 0.5 && m < 1.5) {          // gilt: the same leaf the mirror image shows (rime lies white on it in a hoar morning)
        vec3 gl = giltLeaf(vUv, N, V, fwS, occ);
        if (vW.y > 63. && dot(vW.xz, vW.xz) < 4.) gl *= 1.6;                                           // the spire carries 600 m
        col = mix(gl, col, rmK);
      }
    }
    float f = 1. - exp(-dist * dist * uFogDen * uFogDen);
    col = mix(col, uFogCol, f);
    if (vW.y > -0.02) col = mix(col, uMistCol, mistAt(vW.xz, vW.y, dist, uTime));
    gl_FragColor = vec4(col, 1.0);
  }`;function pt(e){return new p.ShaderMaterial({uniforms:e,vertexShader:vt,fragmentShader:ct,vertexColors:!0,side:p.DoubleSide})}function wt(e){return new p.ShaderMaterial({uniforms:e,vertexColors:!0,side:p.DoubleSide,transparent:!0,depthWrite:!0,polygonOffset:!0,polygonOffsetFactor:0,polygonOffsetUnits:-30,vertexShader:`
      attribute float aMat; uniform float uTime;
      varying vec3 vQ; varying vec3 vN; varying vec3 vC; varying float vH; varying float vM; varying float vT; varying vec3 vVm; varying vec2 vUv; varying float vUnder;
      void main(){
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vT = 1. - smoothstep(15., 17., length(wp.xz));          // 1 on the bell tower
        float y = max(wp.y, 0.);
        vec3 pm = vec3(wp.x, -y, wp.z);
        vVm = cameraPosition - pm;                             // from the mirrored point to the eye
        float cy = max(cameraPosition.y, 0.05);
        // the mirror is a true, whole image: black ice is a plate, not water. Only a breath of sway with height, so it lives
        // (a wall that goes down under the ice is mirrored from the waterline up)
        float wob = sin(y * 0.55 + uTime * 1.2 + wp.z * 0.05) * 0.011 * y / (1. + y * 0.03);
        vec3 side = normalize(vec3(cameraPosition.z - wp.z, 0., wp.x - cameraPosition.x) + vec3(1e-4, 0., 0.));
        pm += side * wob;
        // (slid a little nearer than the ice along the same ray: the same pixel, safely in front; the mirror of a nearer thing lies nearer still and
        // the mirror writes depth, so a drum's mirror hides the wall mirrored behind it: one surface, not a stack of panes.
        // The slide is 0.98 t0 / (1 + 0.05 t0), a collineation centred on the eye: it keeps planes plane, so a long wall of two triangles lies
        // exactly where each of its points belongs and never cuts through the mirror of the building behind it; the 0.98 keeps the mirror of a
        // tall thing, which lands close under the eye, clear of the ice sheet's own depth)
        float t0 = cy / max(cy + y, 1e-3);
        float t = 0.98 * t0 / (1. + 0.05 * t0) * (1. - 0.00012 * floor(fract(aMat) * 5. + 0.5));
        vec3 q = cameraPosition + (pm - cameraPosition) * t;
        vQ = cameraPosition + (pm - cameraPosition) * t0;      // where the ray meets the ice itself: frost, drifts and ripples lie exactly where the ice shows them
        vH = y; vUnder = step(wp.y, 0.02); vN = mat3(modelMatrix) * normal; vC = color; vM = aMat;
        gl_Position = projectionMatrix * viewMatrix * vec4(q, 1.0);
      }`,fragmentShader:`
      uniform vec3 uSun, uSunCol, uSky, uGnd, uFogCol, uMid, uHor, uZen; uniform float uSunK, uHemiK, uFogDen, uCover, uMirK, uTime, uWind, uRime, uRimeW;
      varying vec3 vQ; varying vec3 vN; varying vec3 vC; varying float vH; varying float vM; varying float vT; varying vec3 vVm; varying vec2 vUv; varying float vUnder;
      ${Pe}
      ${Ze}
      void main(){
        float fa = fwidth(dot(vQ.xz, vec2(0.616, 0.788)));          // (taken before the discard)
        float fpx = fwidth(vQ.x) + fwidth(vQ.z);
        float fdF = footD(vQ.xz); float fwF = clamp(fwidth(fdF), 0.01, 3.);                 // what lies on the ice over the mirror: collars and lee drifts at every foot,
        vec4 rcD = raceD(vQ.xz); float wCr = clamp(fwidth(rcD.x), 0.003, 0.7); float slS = laneD(vQ.xz) + scratchW(vQ.xz); float fwS = clamp(fwidth(slS), 0.003, 0.7);      // runner scratches along our track
        // WHERE THIS PIXEL REALLY LIES ON A MIRRORED WALL. The slide onto the ice is right at the vertices, but across a big face (a long wall is two
        // triangles) every varying is interpolated over the slid triangle, not over the wall: heights and uv came out stretched, so the merlons and
        // windows of a far wall were drawn over most of its mirror, as arcs of ripples. P0 = the mirrored point as interpolated (on the wall's plane,
        // but not on this pixel's ray); X = where the ray through this pixel meets that plane; height and uv are carried from P0 to X along their
        // own screen gradients (they are affine on the face, so this is exact). Walls and drums only; a dome's small triangles need none of it
        vec3 N0 = normalize(vN + vec3(0., 1e-5, 0.)); vec3 P0 = cameraPosition - vVm;
        // (a drum, or a wall seen nearly edge on, takes the upright plane that faces the eye instead of its own)
        vec3 rd = vQ - cameraPosition; vec3 rdn = rd / max(length(rd), 1e-4); vec3 pn = vec3(N0.x, -N0.y, N0.z);
        if (abs(dot(rdn, pn)) < 0.15 || vM > 21.5) pn = vec3(rdn.x, 0., rdn.z) / max(length(rdn.xz), 1e-3);
        float den = dot(rd, pn); den = abs(den) < 1e-5 ? (den < 0. ? -1e-5 : 1e-5) : den;
        vec3 dX = rd * (dot(-vVm, pn) / den) + vVm;                                           // X - P0
        float flat1 = (vM < 0.5 || vM > 20.5) ? 1. : 0.; if (dot(dX, dX) > 90000.) flat1 = 0.;
        dX *= flat1;
        vec3 dPx = dFdx(P0), dPy = dFdy(P0); float gE = dot(dPx, dPx), gF = dot(dPx, dPy), gG = dot(dPy, dPy), gD = gE * gG - gF * gF;
        vec2 ab = gD > 1e-14 ? vec2(dot(dX, dPx) * gG - dot(dX, dPy) * gF, dot(dX, dPy) * gE - dot(dX, dPx) * gF) / gD : vec2(0.);
        vec2 uvT = vUv + ab.x * dFdx(vUv) + ab.y * dFdy(vUv);
        float hT = max(vH + ab.x * dFdx(vH) + ab.y * dFdy(vH), 0.);
        float bxx = dot(P0.xz + dX.xz, vec2(-N0.z, N0.x));                                    // metres along the mirrored wall
        float fwH = fwidth(hT), fwB = fwidth(bxx); float fwSm = fwidth(uvT.x * 40.);
        // only the near side of each mirrored thing is drawn (mirroring turns the winding round, so that is the back-facing side):
        // a dome's far, sunlit side no longer shines through its near one
        if (vUnder > 0.999 || gl_FrontFacing) discard;                // (a face wholly under the ice has no mirror; one that crosses the surface is mirrored from the waterline)
        if (vM > 5.5 && vM < 6.5 && hT < 1.2) discard;               // (a low drift has no mirror worth drawing: it showed as a stray pale patch)
        if (vM > 4.5 && vM < 5.5) discard;                           // (nor have the glassy slabs of the ice-shove collars: they showed as torn shards at the waterline)
        vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
        vec3 toC = cameraPosition - vQ; float dist = length(toC);
        float ndv = max(toC.y, 0.) / max(dist, 1e-3);
        float m = floor(vM + 0.5);
        float ndl = max(dot(N, uSun), 0.);
        float nv = abs(dot(vec3(N.x, -N.y, N.z), normalize(vVm + vec3(0., 1e-4, 0.))));        // roundness: a mirrored dome darkens toward its rim
        vec3 alb = vC; if (N.y > 0.7 && (m < 0.5 || (m > 20.5 && m < 23.5))) alb = vec3(0.77);
        float sdM = 1. - smoothstep(0.35, 0.6, abs(N.y));
        float tideM = 0.8 * sdM * (1. - smoothstep(0.95, 1.5, hT + (vn(vec2(bxx * 0.9, 7.)) - 0.5) * 0.7));      // the tide line of every wall and drum, mirrored
        float rimeM = 0.85 * (1. - smoothstep(0.1, 0.42, hT + (vn(vec2(bxx * 1.3, 5.)) - 0.5) * 0.3)) * sdM;       // and the rime banked at its foot
        if (m > 0.5 && m < 1.5) {            // gilt: giltLeaf, below (the same leaf as the dome above the ice)
        } else if (m > 1.5 && m < 2.5) {     // the rings of gilt stars
          vec2 st = vec2(fract(uvT.x * 8.) - 0.5, fract(uvT.y * 4.) - 0.5) * vec2(1., 1.25);
          float star = 1. - smoothstep(0.0, 0.03, length(st) - 0.13 - 0.1 * abs(cos(atan(st.y, st.x + 1e-5) * 4.)));
          alb = mix(alb, vec3(0.83, 0.45, 0.04) * 1.6, star);
        } else if (m > 18.5 && m < 19.5) {   // and the gilt ribs
          alb = mix(alb, vec3(0.83, 0.45, 0.04) * 1.6, 1. - smoothstep(0.035, 0.07, abs(fract(uvT.x * 16.) - 0.5)));
        } else if (m < 0.5) {                // limewash keeps its brick courses and its plinth blocks: a wall close by lies in the ice as masonry, not as a pale pane
          float sd = 1. - smoothstep(0.35, 0.6, abs(N.y)); float pl = step(vC.r * 1.1, vC.g) * step(hT, 2.45);
          float row = floor(hT * 3.3); float bq = bxx * 1.6 + 0.5 * row;
          float cf = sd * (1. - smoothstep(0.06, 0.3, fwH * 3.3)) * (1. - smoothstep(0.04, 0.2, fwB * 1.6)) * (1. - pl);
          alb *= 1. - cf * (0.14 * max(1. - step(0.13, fract(hT * 3.3)), 1. - step(0.07, fract(bq))) + 0.08 * (h21(vec2(floor(bq), row)) - 0.5));
          alb *= 0.9 + 0.14 * vn(vec2(bxx * 0.5, hT * 0.4) + 3.);
          float fy = hT / 0.6; float fxb = bxx / 1.2 + 0.5 * floor(fy);
          float pj = max(smoothstep(0.4, 0.47, abs(fract(fy) - 0.5)), smoothstep(0.44, 0.485, abs(fract(fxb) - 0.5))) * pl * sd * (1. - smoothstep(0.25, 0.8, fwH * 1.7));
          alb *= mix(1., 1.25, pl) * (1. - 0.4 * pj);
          alb = mix(alb, alb * vec3(0.46, 0.53, 0.56), tideM); alb = mix(alb, vec3(0.77), rimeM);
        } else if (m > 20.5 && m < 21.5) {   // the city's walls keep their windows (and the kremlin wall its merlons) in the mirror
          float top = floor(uvT.y + 0.02), bw = fract(uvT.y + 0.02) * 16., sth = 2. + clamp(vM - 21., 0., 0.45) * 40.;
          float dn = mod(max(top - hT, 0.), sth); float mk = 1. - smoothstep(110., 380., dist);
          if (bw < 0.4) { if (hT > top - 1.6 && fract(uvT.x / 3.2) > 0.6) discard; }
          else { float bx = uvT.x - floor(uvT.x / bw + 0.5) * bw; float ww = min(0.2 * bw, 1.15); float y0 = 0.36 * sth, y1 = 0.76 * sth;
            float win = max(step(abs(bx), ww) * step(y0, dn) * step(dn, y1), step(length(vec2(bx, dn - y0)), ww) * step(dn, y0)) * step(abs(N.y), 0.5);
            alb = mix(alb, vec3(0.035, 0.05, 0.085), win * mk); alb *= 1. - 0.13 * (1. - mk); }
          alb = mix(alb, alb * vec3(0.46, 0.53, 0.56), tideM); alb = mix(alb, vec3(0.77), rimeM);
        } else if (m > 21.5 && m < 22.5) {
          float win = step(abs(fract(uvT.x * 8.) - 0.5), 0.12) * step(0.4, uvT.y) * step(uvT.y, 0.82) * (1. - smoothstep(110., 380., dist));
          if (fract(vM + 0.01) > 0.1) win = step(abs(fract(uvT.x * 6.) - 0.5), 0.08) * step(0.34, uvT.y) * step(uvT.y, 0.47) * (1. - smoothstep(110., 380., dist));
          alb = mix(alb, vec3(0.035, 0.05, 0.085), win);
          alb = mix(alb, alb * vec3(0.46, 0.53, 0.56), tideM); alb = mix(alb, vec3(0.77), rimeM);
        }
        float rmK = 0.;
        if (uRime > 0.001) {                 // hoar morning: the rime that furs the thing itself lies in its image too
          float rm = uRime * smoothstep(0.25, 0.9, 0.6 * N.y + 0.4 * dot(N, vec3(-0.75, 0., 0.59)) + 0.25 * (vn((P0.xz + dX.xz) * 7. + hT * 9.) - 0.5));
          float rw = m > 23.5 ? 0. : ((m > 0.5 && m < 2.5) || (m > 18.5 && m < 20.5)) ? uRimeW : ((m > 8.5 && m < 9.5) || (m > 12.5 && m < 13.5)) ? 0.2 : 0.8;
          alb = mix(alb, vec3(0.77), rm * rw); rmK = rm * rw;
        }
        vec3 col = alb * (uSunCol * uSunK * ndl + mix(uGnd, uSky, 0.5 + 0.5 * N.y) * uHemiK) * 0.3183;
        if (m > 0.5 && m < 1.5) {            // gilt: the very leaf the dome shows, seen from the eye's own image under the ice
          vec3 gl = giltLeaf(uvT, N, normalize(vec3(vVm.x, -vVm.y, vVm.z) + vec3(0., 1e-4, 0.)), fwSm, 1.);
          if (vT > 0.5 && hT > 63.) gl *= 1.6;
          col = mix(gl, col, rmK);
        }
        // how strongly the ice mirrors depends on how far off the pixel lies on the ice, not on how high the thing mirrored stands:
        // the tower's streak runs unbroken from its foot toward the eye, and the roofs under the nearest 30 m still show through it
        bool wall = vT < 0.5 && (m < 0.5 || (m > 8.5 && m < 9.5) || m > 20.5);         // limewash and its dark windows away from the tower: one solid mirrored building
        if (wall && (m < 0.5 || m > 20.5)) col += alb * uSunCol * uSunK * 0.3183 * 0.25 * (1. - abs(N.y)) * (1. - smoothstep(0., 0.5, ndl));   // the ice's bounce on shaded walls, as above the ice
        col *= (wall || (m > 0.5 && m < 1.5)) ? 0.88 + 0.12 * nv : 0.6 + 0.4 * nv;
        float dxz = length(toC.xz);
        // (the tower's streak survives the snow tongues as a paler mark, so it reaches toward us from the first frame; under the eye the mirror
        // thins, so the plinth is seen going down to the cobbles)
        // (the ice is a mirror from under the runner outward: a dome 13 m off lies whole and clean in it; only close under the tower the streak
        // thins, by how near the EYE is to the tower, so the plinth is seen going down)
        float heelK = smoothstep(45., 95., length(cameraPosition.xz));
        float flo = mix(wall ? mix(0.8, 0.97, smoothstep(2., 9., dxz)) : 0.86, mix(0.62, 0.8, heelK), vT);      // (the bell tower lies in the ice like every dome, close by too)
        float snw = snowLod(vQ.xz, uCover, fpx);                                            // (a drift tongue near by hides the tower's mirror almost wholly: it is crossed, not printed over)
        float a = mix(flo, 0.94, smoothstep(10., 120., dxz)) * (wall ? 1. : 0.93 + 0.07 * softRefl(ndv)) * uMirK * (1. - mix(1., mix(0.88, 0.6, smoothstep(120., 300., dxz)), vT) * snw);
        a = min(a * mix(1., 1.8, smoothstep(150., 400., dxz) * vT), 0.95);
        if (m > 0.5 && m < 1.5) a = min(a * 1.35, 0.95);                              // gilt mirrors hardest: the near end of the tower's streak is gold
        a *= wall ? 1. : 0.88 + 0.12 * vn(vQ.xz * 0.6);
        // THE MIRROR IS WHOLE: crisp and nearly as strong as the thing itself from the waterline to the cross. Nothing dissolves it with height and
        // nothing breaks it into dashes; only what really lies on the ice hides it: a drift tongue, a frosted band off our track, blown snow, far mist
        float sat = satinAt(vQ.xz) * (1. - 0.8 * smoothstep(0.5, 2.2, fa)) * (1. - 0.85 * smoothstep(35., 100., dist));   // (far off, where a band is finer than a pixel, the mirror is whole)
        a *= 1. - 0.72 * sat;                                                          // frosted bands break the mirror into lengths (away from our own track)
        a *= 1. - 0.2 * smoothstep(50., 74., hT);                                      // (the very top of the bell tower's long streak is a little fainter)
        if (m > 0.5 && m < 1.5) a = max(a, 0.9 * uMirK * (1. - snw) * (1. - 0.72 * sat) * (1. - smoothstep(40., 60., dxz)));   // (gilt close by lies in the ice as deep gold)
        float lane = smoothstep(8. * uLaneK, 45. * uLaneK, laneD(vQ.xz));
        a *= 1. - clamp(snakeAt(vQ.xz, uTime * uWind, clamp(uSnakeK - 1., 0., 1.2), fa, 1. - lane) * mix(0.7, 1., lane) * min(uSnakeK, 1.6) * mix(0.6, 0.3, vT), 0., 0.8);   // snow snakes cross it
        a *= 1. - 0.6 * gauzeAt(vQ.xz, uTime * uWind);
        a *= 1. - mistAt(vQ.xz, 0., dist, uTime);                                      // (the far ice lies under low mist: a mirror fades into it)
        // WHAT LIES ON THE ICE LIES ACROSS THE MIRROR: the snow collar and lee drift at every foot, the frost feathering out from it, a few thin drifts of
        // blown snow, the runner scratches along our track; and at grazing angles the cool haze of the surface itself veils the image a little
        // (never its edges: the mirror stays crisp). These are what say "a sheet of ice with an image in it", not "a second dome hanging below"
        vec3 fc = footCue(vQ.xz, fdF, fwF, dist);
        a *= (1. - fc.x) * (1. - 0.75 * fc.y);
        col *= 1. - 0.4 * fc.z;                                                        // (the dark tide ring of scoured ice lies across the image too)
        a *= 1. - raceK(rcD, wCr, dist, vQ.xz);                                               // (the racing crack runs across every image in the ice)
        a *= 1. - 0.92 * wispAt(vQ.xz) * (1. - smoothstep(0.6, 2.4, fa)) * (1. - smoothstep(50., 110., dist));
        a *= 1. - 0.17 * scratchAt(vQ.xz, slS, fwS) * (1. - smoothstep(6., 16., dist));
        // AN IMAGE IN ICE IS A LITTLE DARKER AND COOLER THAN THE THING ITSELF (the ice keeps a share of the light); its edges stay as crisp as they were
        col *= vec3(0.74, 0.79, 0.87);
        col = mix(col, mix(uMid, uHor, 0.55), hazeAt(vQ.xz, ndv) * (m > 0.5 && m < 1.5 ? 0.6 : 1.));
        float f = 1. - exp(-dist * dist * uFogDen * uFogDen);
        col = mix(col, uFogCol, f);
        gl_FragColor = vec4(col, a);
      }`})}function Ue(e,t,r,s,i){const a=new p.Shape;a.moveTo(-e/2,0),a.lineTo(e/2,0),a.lineTo(e/2,t),a.lineTo(-e/2,t),a.lineTo(-e/2,0);const n=new p.Path;return n.moveTo(-r,s),n.lineTo(-r,i),n.absarc(0,i,r,Math.PI,0,!0),n.lineTo(r,s),n.lineTo(-r,s),a.holes.push(n),a}async function ut(e,t){const r=-67*Z,s=M,i=(b,h,m,c,g,v,y=0)=>new p.Matrix4().makeRotationY(r).multiply(k(b,h,m,c,g,v,y));e.add(o.box,i(0,P,0,17.2,17-P,17.2),s.lime,l.LIME),e.add(o.box,i(0,P,0,19.4,2.4-P,19.4),s.plinth,l.LIME),e.add(o.box,i(0,2.4,0,19.7,.25,19.7),s.snow,l.SNOW),e.add(o.box,i(0,16.3,0,20,.9,20),s.lime,l.LIME),e.add(o.box,i(0,15.75,0,18.7,.55,18.7),s.lime,l.LIME);const a=new p.ExtrudeGeometry(Ue(18,13.9,3,1,7.5),{depth:.4,bevelEnabled:!1,curveSegments:10});await t.yield();const n=new p.Shape;n.moveTo(-3,0),n.lineTo(3,0),n.lineTo(3,6.5),n.absarc(0,6.5,3,0,Math.PI,!1),n.lineTo(-3,0);const f=new p.ShapeGeometry(n,10),d=$e(7741);for(let b=0;b<4;b++){const h=b*Math.PI/2,m=(c,g,v,y,u,x)=>i(0,0,0,1,1,1,h).multiply(k(c,g,v,y,u,x));e.add(a,m(0,2.4,8.6,1,1,1),s.lime,l.LIME);for(const c of[-8.1,-6.3,6.3,8.1])e.add(o.box,m(c,2.65,9.225,1,12.6,.45),s.lime,l.LIME),e.add(o.box,m(c,2.65,9.25,1.3,.7,.6),s.lime,l.LIME),e.add(o.box,m(c,15.1,9.25,1.3,.65,.6),s.lime,l.LIME);e.add(f,m(0,3.4,8.63,1,1,1),s.limeDark,l.LIME+G),e.add(o.box,m(0,2.65,9,7.4,.75,.5),s.lime,l.LIME),e.add(o.box,m(0,12.9,9.05,1.1,1.3,.35),s.lime,l.LIME),e.add(o.box,m(0,14.05,9,11,.95,.12),Oe,l.TILE+G);for(const c of[13.93,15.02])e.add(o.box,m(0,c,9.02,11.2,.09,.12),s.gold,l.GOLD);e.add(o.ball6,m(0,13.55,9.42,.3,.3,.16),s.gold,l.GOLD),ke(e,d,m,-9.6,9.6,2.42,9.82,.8,.25,.95),ke(e,d,m,-9.8,9.8,16.3,9.92,1,.5,1.9),ke(e,d,m,-3.6,3.6,2.68,9.22,.7,.15,.5);for(const[c,g,v]of[[-7.2+d()*3,2.65,9.6],[3+d()*5,2.65,9.62],[(d()-.5)*5,3.4,9.05],[(d()-.5)*16,17.2,9.7]])Je(e,m(c,g,v,1,1,1).multiply(k(0,0,0,1,1,1,(d()-.5)*2.4+Math.PI)),d());await t.yield()}await t.yield();const w=[[15,17.2,31],[12.5,31,43],[10,43,53],[8,53,60]];for(const[b,h,m]of w){const c=m-h-.9,g=b*.25,v=c*.56,y=new p.ExtrudeGeometry(Ue(b,c,g,1,v),{depth:1.3,bevelEnabled:!1,curveSegments:9});await t.yield();for(let u=0;u<4;u++){const x=u*Math.PI/2,E=(L,z,I,A=1,C=1,q=1)=>i(0,0,0,1,1,1,x).multiply(k(L,z,I,A,C,q));e.add(y,E(0,h,b/2-1.3),s.lime,l.LIME);for(const L of[g+.75,g+1.55])for(const z of[-1,1])e.add(o.cyl,E(z*L,h+.6,b/2+.28,.3,v+.6,.3),s.lime,l.LIME);e.add(o.box,E(0,h,b/2+.1,b*.86,.6,.9),s.lime,l.LIME),e.add(o.box,E(0,h+v+1.2,b/2+.1,g*2+4.2,.45,.8),s.lime,l.LIME),e.add(o.prism,E(0,h+c-1.9,b/2+.25,g*2+3.6,1.7,.6),s.lime,l.LIME),await t.yield()}e.add(o.box,i(0,m-.9,0,b+1.7,.9,b+1.7),s.lime,l.LIME),e.add(o.box,i(0,h,0,b-2.6,.5,b-2.6),s.limeDark,l.LIME),await t.yield()}e.add(o.cyl16,i(0,60,0,3.3,.9,3.3),s.lime,l.LIME),e.add(o.ball,i(0,60.8,0,3.4,3.6,3.4),s.lead,l.LEAD),e.add(o.cone,i(0,63.6,0,.75,8.6,.75),s.gold,l.GOLD),e.add(o.ball,i(0,72.1,0,.5,.5,.5),s.gold,l.GOLD),e.add(o.box,i(0,72.4,0,.14,1.9,.14),s.gold,l.GOLD),e.add(o.box,i(0,73.5,0,.9,.12,.12),s.gold,l.GOLD),e.add(o.box,i(0,73,0,.55,.1,.12,0,0,.3),s.gold,l.GOLD)}let ne=null;const $e=e=>{let t=(e|0)>>>0||1;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)};function ke(e,t,r,s,i,a,n,f,d,w){const b=ne||e;for(let h=s+t()*f;h<i;h+=f*(.5+t())){const m=d+(w-d)*t()*t(),c=.035+.05*t()+m*.035;t()<.18||b.add(o.icicle,r(h,a,n,c,m,c),[1,1,1],l.SLAB)}}function Je(e,t,r){const s=(d,w,b,h,m,c,g=0)=>t.clone().multiply(k(d,w,b,h,m,c,0,g)),i=[r,t.elements[13]],a=[.012,.012,.016],n=[.2,.21,.24],f=ne||e;f.add(o.ball6,s(0,.24,0,.12,.14,.25,-.35),n,l.BIRD,i);for(const d of[-1,1])f.add(o.ball6,s(d*.085,.26,.05,.05,.1,.25,-.3),a,l.BIRD,i);f.add(o.oct,s(0,.45,-.19,.09,.1,.11),a,l.BIRD,i),f.add(o.oct,s(0,.44,-.33,.028,.03,.09),a,l.BIRD,i),f.add(o.oct,s(0,.21,.26,.11,.025,.26,.35),a,l.BIRD,i)}function _(e,t,r,s,i,a,n,f){const d=e.isVoid?e:ne||e,w=t.slab||t,b=f?new ce(64):null;let h=d;for(let m=0;m<a;m++){const c=(m+t()*.6)/a*Math.PI*2,g=i+t()*1.2,v=.8+t()*2.6,y=.4+t()*n,u=.12+t()*.18,x=-c+Math.PI/2+(t()-.5),E=(t()-.5)*1.3,L=(t()-.5)*.7,z=r+Math.cos(c)*g,I=s+Math.sin(c)*g;f&&(h=(f==="track"?Ke(z,I)<1.7:Math.abs((z+17)*-.932+(I-6.6)*.363)<6.5)?b:d),h.add(w()<.45?o.prism:o.box,k(z,-.3,I,v,y,u,x,E,L),M.slab,l.SLAB);for(let A=0;A<2;A++){const C=c+(w()-.5)*.5,q=g+(A?.5:-.45)+(w()-.5)*.5;h.add(o.prism,k(r+Math.cos(C)*q,-.15,s+Math.sin(C)*q,.5+w()*.4,.35+w()*.55,.07+w()*.1,x+(w()-.5)*1.6,(A?1:-1)*(.5+w()*.6),(w()-.5)*.9),M.slab,l.SLAB)}}}function Q(e,t,r,s,i,a,n,f=0){const d=(h,m,c,g,v,y,u=0)=>k(t,r,s,1,1,1,n,a,0).multiply(k(h,m,c,g,v,y,0,0,u)),w=i/2.2,b=f>1?.3:.11*Math.sqrt(w);if(e.add(f?o.ball6:o.ball,d(0,.25*w,0,.32*w,.32*w,.32*w),M.gold,l.GOLD),e.add(o.box,d(0,.4,0,b,i,b),M.gold,l.GOLD),e.add(o.box,d(0,.4+i*.68,0,i*.5,b*.9,b*.9),M.gold,l.GOLD),!(f>1)&&(e.add(o.box,d(0,.4+i*.85,0,i*.24,.09,.1),M.gold,l.GOLD),e.add(o.box,d(0,.4+i*.32,0,i*.34,.09,.1,.42),M.gold,l.GOLD),f<1))for(const h of[-1,1])e.add(o.chain,d(h*.5*w,-.9*w,0,.07,1.9*w,.07,h*.55),M.lead,l.CHAIN)}const Ne=Math.atan2(.788,-.616);function pe(e,t,r,s,i,a=1){const n=i?o.driftLo:o.drift,f=Math.min(.42+.07*s,.85);e=ne||e,e.add(n,k(t+.788*s*.3,-.01,r-.616*s*.3,s*1.35*a,f,s*2.3*a,Ne+.07),M.snow,l.SNOW),i||e.add(o.driftLo,k(t+.788*s*.9+.616*s*.5,-.01,r-.616*s*.9+.788*s*.5,s*.7*a,f*.6,s*1.9*a,Ne-.12),M.snow,l.SNOW);const d=Math.abs(Math.sin(t*12.9898+r*78.233)*43758.5453)%1,w=s*2.7*a;for(const[b,h,m]of[[.84+.2*d,.42-.9*d,.42],[1.22+.25*d,-.3+.75*d,.3]]){const c=t+.788*(s*.3+w*b)+.616*s*h,g=r-.616*(s*.3+w*b)+.788*s*h,v=s*.9*a*m;Ke(c,g)<v||Ke(c+.788*w*m*.9,g-.616*w*m*.9)<v||e.add(o.driftLo,k(c,-.01,g,s*1.35*a*m,f*(.35+.3*m),w*m*.9,Ne+.5*(d-.5)),M.snow,l.SNOW)}}async function et(e,t,r,s,i,a,n={}){const[f,d,w]=r,b=i===void 0?r[3]:i,h=w/2,m=n.lod||0,c=[M.blue,M.gold,M.copper,M.silver][b]||M.blue,g=[l.BLUE,l.GOLD,l.COPPER,l.SILVER][b]||l.BLUE;let v=1+t()*2;n.drum!==void 0&&(v=n.drum),e.add(o.cyl16,k(f,P+4,d,h*.62,v-P-4,h*.62),M.lime,l.LIME),e.add(o.cyl16,k(f,v-.35,d,h*.7,.35,h*.7),M.lime,l.LIME);for(let L=0;L<8;L++){const z=L/8*Math.PI*2;e.add(o.face,k(f+Math.cos(z)*h*.63,-.2,d+Math.sin(z)*h*.63,.5,v-.4,.12,-z+Math.PI/2),M.limeDark,l.LIME+G)}if(v>3.4){const L=Math.min(v-1.8,4.2);for(let z=0;z<8;z++){const I=(z+.5)/8*Math.PI*2;e.add(o.face,k(f+Math.cos(I)*h*.612,v-.9-L,d+Math.sin(I)*h*.612,.11*h,L,.16,-I+Math.PI/2),ee,l.PLAIN+B),e.add(o.disc,k(f+Math.cos(I)*h*.6,v-.9,d+Math.sin(I)*h*.6,.055*h,.14,.055*h,-I+Math.PI/2,Math.PI/2),ee,l.PLAIN+B)}e.add(o.cyl16,k(f,v-1.3-L,d,h*.66,.22,h*.66),M.lime,l.LIME),e.add(o.cyl,k(f,v-.86,d,h*.635,.46,h*.635),Oe,l.TILE+G),m||e.add(o.cyl,k(f,v-.03,d,h*.58,.2,h*.58),M.gold,l.GOLD)}await a.yield(),e.add(m?o.onionLo:o.onion,k(f,v,d,h,h,h,t()*6),c,g);const y=v+2.4*h;Q(e,f,y-.25,d,2.2,(4+t()*14)*Z*(t()<.5?-1:1),t()*6.28),await a.yield();const u=n.slim?.55:1;e.add(o.cone,k(f,-6.5+s*.013,d,h*2.75*u,2.9,h*2.75*u),M.green,l.GREEN),Ce(e,k(f,P,d,h*3.6*u,4.5+s*.013,h*3.6*u,.44),h*3.6*u,h*3.6*u>14?5:3);const x=t()*6.28,E=h*1.9;return!m&&!n.slim&&(e.add(o.cyl,k(f+Math.cos(x)*E,-7,d+Math.sin(x)*E,h*.3,3.2,h*.3),M.lime,l.LIME),e.add(o.onionLo,k(f+Math.cos(x)*E,-3.8,d+Math.sin(x)*E,h*.45,h*.45,h*.45),M.green,l.GREEN)),_(e,t,f,d,h*.75,m?6:9,1.3),pe(e,f,d,h,m),[f,y+2.4,d]}const re=[[-224,497,8.5,0,5.5],[-232,491,4.5,1,0],[-221,488.5,5,1,0],[-162.3,508.3,7,3,0],[-159,447,10,2,6],[-166,384,9,3,5.5],[-55,160,9,2,5,1],[-12,141,9,0,0],[-90,76,9,3,5],[-87.5,1,8,1,4],[-114,-7,10,2,6],[-147,-62,9,1,4.5,1],[-171,-26,11,0,5,1],[-281,-66,8,1,0,1],[-281,-22,8,0,0,1],[-50,-70,11,1,6],[-66,-18,9,2,4,1],[-98,-76,8,1,0],[-128,-86,7,3,0],[10,94,9,0,5],[-84,-40,10,0,5,1]],ze=(e,t,r,s)=>[[0,0,e,s,r],[-1,-1,t,1-s,0],[1,-1,t,1-s,0],[-1,1,t,1-s,0],[1,1,t,1-s,0]],le=[{x:-35.2,z:13.9,ry:.42,w:22,top:7.6,lod:1,domes:[[-1,-1,7,0,0],[1,-1,7,0,0],[-1,1,7,0,0],[1,1,7,0,0]],bel:null,hi:1},{x:-131,z:288,ry:.42,w:15,top:5.6,lod:1,domes:ze(10,4.6,11.8,1),bel:null,hi:1},{x:-29,z:199,ry:.42,w:0,top:0,lod:1,domes:[[9.5,2,5,1,2.6]],bel:[0,0,7,10,10]},{x:102,z:103,ry:.3,w:15,top:8,lod:1,domes:[[0,0,10,1,12.9],[0,5.2,4,0,10.6]],bel:[0,-14,5.6,16.3,11]},{x:-348,z:-84,ry:0,w:20,top:9,lod:1,domes:ze(12,5.6,16.3,1),bel:null},{x:-352,z:0,ry:0,w:14,top:7.5,lod:1,domes:[[0,0,9,1,12.8],[0,-4.6,4.4,0,10],[0,4.6,4.4,0,10]],bel:null},{x:-187,z:-203,ry:.5,w:14,top:7.5,lod:2,domes:[[0,0,9,0,12.9]],bel:[-12,0,5,27,11]},{x:-60,z:-226,ry:.2,w:18,top:9,lod:2,domes:ze(15.5,5,16.3,1),bel:null},{x:325,z:125,ry:.9,w:16,top:7,lod:2,domes:[[0,0,10,1,12.5],[-6.5,0,6,0,10],[6.5,0,6,0,10]],bel:null},{x:224,z:296,ry:.42,w:16,top:8,lod:2,domes:ze(10,4.6,14,0),bel:[13,4,5,29,12]},{x:-600,z:-170,ry:.1,w:18,top:9,lod:2,domes:[[0,0,16,1,15]],bel:[0,15,6,16.3,13]},{x:-450,z:-290,ry:.6,w:16,top:8,lod:2,domes:ze(10,4.6,14,1),bel:null},{x:-520,z:110,ry:.3,w:16,top:8,lod:2,domes:[[0,0,11,1,14]],bel:[-13,2,5.5,26,12]},{x:-96.2,z:236,ry:.42,w:11,top:4.4,lod:1,domes:[[-1,-1,3.2,1,0],[1,-1,3.2,1,0],[-1,1,3.2,1,0],[1,1,3.2,1,0]],bel:null,hi:1},{x:-71.8,z:248,ry:.42,w:11,top:4.8,lod:1,domes:[[-1,-1,3,0,0],[1,-1,3,0,0],[-1,1,3,0,0],[1,1,3,0,0]],bel:null,hi:1}],tt={2:7.2,3:7.8,5:15.4,6:4.6},ie=[-365,-125],U={x:-131,z:441,ry:.42+Math.PI/2,w:14,top:8.5,lod:1,hi:1,domes:[[0,0,9,1,15.5],[-1,-1,4.6,0,0],[1,-1,4.6,0,0],[-1,1,4.6,0,0],[1,1,4.6,0,0]],bel:[-15.5,0,6,15,9]},$=[U.x+Math.cos(U.ry)*U.bel[0],U.z-Math.sin(U.ry)*U.bel[0]],N={x:-192,z:398,ry:.62,w:13,top:4.6,lod:1,hi:1,domes:[[0,0,9,0,10.4],[-1,-1,4,1,0],[1,-1,4,1,0],[-1,1,4,1,0],[1,1,4,1,0]],bel:[-11.5,1,4.6,8.6,7]},J=[N.x+Math.cos(N.ry)*N.bel[0]+Math.sin(N.ry)*N.bel[1],N.z-Math.sin(N.ry)*N.bel[0]+Math.cos(N.ry)*N.bel[1]],ot=[-205,510],Ae=[.42,-.908],at=[.908,.42],Ge=Math.atan2(Ae[0],Ae[1]),Fe=(e,t)=>[ot[0]+Ae[0]*e+at[0]*t,ot[1]+Ae[1]*e+at[1]*t],bt=[...ve.map(e=>[e[0],e[1],e[2]*2+9]),...re.map(e=>[e[0],e[1],e[2]*2+9]),...le.map(e=>[e.x,e.z,Math.max(e.w,8)*.75+12]),[ie[0],ie[1],16],[U.x,U.z,23],[$[0],$[1],13],[N.x,N.z,21],[J[0],J[1],11],[-198,526,20],[...Fe(338,11),10],...[[103,-11],[185,11],[7,11],[333,8]].map(([e,t])=>[...Fe(e,t),6]),[16,24,6]],we=[];for(let e=0;20+e*32<306;e++){const[t,r]=Fe(20+e*32,(e%2?-1:1)*12.45);bt.some(s=>Math.hypot(t-s[0],r-s[1])<s[2])||we.push([t,r,we.length%3])}const st=[1.65,1.2,.4],Wt=[...re.map(e=>[e[0],e[1],e[2]]),[-35.2,13.9,15],[-131,288,13],[-96.2,236,13],[-71.8,248,13],[-29,199,18],[-348,-84,20],[-352,0,15],[-365,-125,20],[U.x,U.z,16],[$[0],$[1],11],[N.x,N.z,13],[J[0],J[1],8]],Tt=[...re.map(e=>[e[0],e[1],e[2]*2+9]),...le.map(e=>[e.x,e.z,Math.max(e.w,8)*.75+12]),[ie[0],ie[1],16],[U.x,U.z,23],[$[0],$[1],13],[N.x,N.z,21],[J[0],J[1],11],...we.map(e=>[e[0],e[1],8])],Le=(e,t,r)=>[e.x+Math.cos(e.ry)*t+Math.sin(e.ry)*r,e.z-Math.sin(e.ry)*t+Math.cos(e.ry)*r],At=[[0,0,9.7,0,-67*Z],...ve.filter((e,t)=>t!==2&&t!==3&&t!==5).map(e=>[e[0],e[1],0,e[2]*.31+.1,0]),...re.map(e=>[e[0],e[1],0,e[2]*.31+.1,0]),...le.filter(e=>e.lod<2&&e.w>0).map(e=>[e.x,e.z,e.w/2,0,e.ry]),...le.filter(e=>e.lod<2&&e.bel).map(e=>[...Le(e,e.bel[0],e.bel[1]),e.bel[2]/2,0,e.ry]),...le.filter(e=>e.lod<2&&e.w===0).flatMap(e=>e.domes.map(t=>[...Le(e,t[0],t[1]),0,t[2]*.31+.1,0])),[U.x,U.z,U.w/2,0,U.ry],[$[0],$[1],U.bel[2]/2,0,U.ry],[...Le(U,-U.w/2-2.75,0),2.9,0,U.ry],[...Le(U,U.w/2+.6,0),0,3.4,0],[N.x,N.z,N.w/2,0,N.ry],[J[0],J[1],N.bel[2]/2,0,N.ry],...we.map(e=>[e[0],e[1],0,st[e[2]],0])],Se=[.03,.045,.07],ee=[.06,.1,.19],K=[.6,.42,.24],Oe=[.3,.31,.25],G=.2,B=.4,yt=.05;function Ce(e,t,r,s,i=0){const a=o.box.userData.ni||(o.box.userData.ni=o.box.toNonIndexed()),n=a.attributes.position,f=a.attributes.normal,d=new Float32Array(n.count*2);for(let b=0;b<n.count;b++)d[b*2]=(Math.abs(f.getX(b))>.5?n.getZ(b):n.getX(b))*r,d[b*2+1]=Math.min(r/s,60)+64*Math.round(i*4);const w=new p.BufferGeometry;w.setAttribute("position",n),w.setAttribute("normal",f),w.setAttribute("uv",new p.BufferAttribute(d,2)),e.add(w,t,M.lime,l.LIME+yt)}function nt(e,t,r,s,i,a,n,f,d,w,b){const h=f>1?o.cyl8:o.cyl12;if(e.add(h,k(t,i,r,s*.62,a-i,s*.62),M.lime,l.LIME),e.add(h,k(t,a-.4,r,s*.72,.4,s*.72),M.lime,l.LIME),f<2)for(let m=0;m<8;m++){const c=(m+.5)/8*Math.PI*2,g=Math.min(a-i-1.2,4.5);g>.8&&e.add(o.face,k(t+Math.cos(c)*s*.61,a-.8-g,r+Math.sin(c)*s*.61,.16*s,g,.18,-c+Math.PI/2),Se,l.PLAIN+B)}e.add(f>1?o.onionFar:o.onionLo,k(t,a,r,s,s,s,b),n?M.gold:M.blue,n?l.GOLD:l.BLUE),Q(e,t,a+2.4*s-.25,r,d,w,b,f>1?2:1)}function xt(e,t,r,s,i,a,n,f,d,w){const b=d>1?-.5:P,h=a*.95,m=a*.24,c=d>1?o.cyl8:o.cyl12,g=(u,x,E,L,z,I,A=0)=>k(r,0,s,1,1,1,i).multiply(k(u,x,E,L,z,I,A));d<2?Ce(e,g(0,b,0,a,n-h-b,a),a,1):e.add(o.box,g(0,b,0,a,n-h-b,a),M.lime,l.LIME);for(const u of[-1,1])for(const x of[-1,1])e.add(o.box,g(u*(a-m)/2,n-h,x*(a-m)/2,m,h*.78,m),M.lime,l.LIME);if(e.add(o.box,g(0,n-h*.22,0,a,h*.22,a),M.lime,l.LIME),e.add(o.box,g(0,n,0,a+.9,.9,a+.9),M.lime,l.LIME),d<2){e.add(o.box,g(0,n-h-.3,0,a+.5,.3,a+.5),M.lime,l.LIME),e.add(o.bell,g(0,n-h*.22-a*.24,0,a*.17,a*.22,a*.17),[.12,.11,.08],l.PLAIN);for(let u=0;u<4;u++)e.add(o.face,k(r,0,s,1,1,1,i+u*Math.PI/2).multiply(k(0,Math.max(1.2,n-h-6),a/2,.7,2.6,.16)),Se,l.PLAIN+B);_(e,t,r,s,a*.7,6,1.1),pe(e,r,s,a*.62,1)}const v=n+.9,y=a*.2;e.add(c,g(0,v,0,a*.5,.9,a*.5),M.lime,l.LIME),e.add(o.cone8,g(0,v+.9,0,a*.6,f,a*.6,.39),M.shingle,l.LEAD),e.add(c,g(0,v+.9+f*.84,0,y*.62,f*.16+.5,y*.62),M.lime,l.LIME),e.add(d>1?o.onionFar:o.onionLo,g(0,v+1.4+f,0,y,y,y),w?M.gold:M.blue,w?l.GOLD:l.BLUE),Q(e,r,v+1.4+f+2.4*y-.2,s,d>1?3:2.2,(t()-.5)*.16,i,d>1?2:1)}async function Re(e,t,r,s,i){const{x:a,z:n,ry:f,w:d,top:w,lod:b}=r,h=b>1?-.5:P,m=b>1?o.cyl8:o.cyl12;if(d>0){b<2?Ce(e,k(a,h,n,d,w-h,d,f),d,3,r.hi?w:0):e.add(o.box,k(a,h,n,d,w-h,d,f),M.lime,l.LIME),e.add(o.box,k(a,w,n,d-.7,.3,d-.7,f),M.snow,l.SNOW);const v=d/6-.15,y=r.hi?.7:1,u=$e(Math.round(a*7+n*13)+99),x=de(a,n)<24;for(let E=0;E<4;E++){const L=(z,I,A,C,q,X,H=0)=>k(a,0,n,1,1,1,f+E*Math.PI/2).multiply(k(z,I,A,C,q,X,0,H));for(let z=-1;z<=1;z++)e.add(m,L(z*d/3,w-.1,d/2-(r.hi?.72:.62),v,.6,v*y,Math.PI/2),M.lime,l.LIME),b<2&&e.add(o.disc,L(z*d/3,w+v*y*.42,d/2-.1,v*.2,.14,v*.2,Math.PI/2),ee,l.PLAIN+B),b<2&&w>4&&e.add(o.face,L(z*d/3,w*.28,d/2,r.hi?1.1:.75,w*.42,.16),ee,l.PLAIN+B),r.hi&&w>4&&(e.add(o.disc,L(z*d/3,w*.7,d/2+.08,.55,.16,.55,Math.PI/2),ee,l.PLAIN+B),e.add(o.disc,L(z*d/3,w*.7,d/2+.02,.85,.14,.85,Math.PI/2),K,l.LIME+G),e.add(o.box,L(z*d/3,w*.28-.3,d/2+.12,1.7,.22,.3),M.lime,l.LIME)),r.hi&&e.add(o.disc,L(z*d/3,w-.1+v*y*.4,d/2-.14,v*.5,.12,v*y*.42,Math.PI/2),M.limeDark,l.LIME+G);if(b<2)for(const z of[-1,1])e.add(o.box,L(z*(d/2-.4),-.3,d/2,.9,w+.3,.22),M.lime,l.LIME);if(r.hi){for(const I of[-1,1])e.add(o.box,L(I*d/6,-.3,d/2,.7,w+.3,.2),M.lime,l.LIME);if(e.add(o.box,L(0,w-.86,d/2,d+.5,.52,.3),Oe,l.TILE+G),e.add(o.box,L(0,w-.97,d/2+.03,d+.3,.09,.3),M.gold,l.GOLD),w>4){const I=Math.round(d/2.2);for(let A=0;A<I;A++){const C=(A+.5-I/2)*(d-2.4)/I;Math.abs(Math.abs(C)-d/6)<.8||(e.add(o.face,L(C,w-2,d/2+.03,.8,.8,.1),M.limeDark,l.LIME+G),e.add(o.disc,L(C,w-1.2,d/2+.03,.4,.1,.4,Math.PI/2),M.limeDark,l.LIME+G))}}const z=t.slab||t;for(let I=0;I<6;I++){const A=(z()-.5)*(d-2),C=E===1?.45:1;(ne||e).add(z()<.5?o.prism:o.box,L(A,-.25,d/2+.35+z()*.9,.9+z()*2.2,(.35+z()*.9)*C,.1+z()*.14,(z()-.5)*.7,-.25-z()*.5),M.slab,l.SLAB)}if(w>4&&(ke(e,u,L,-d/2+.3,d/2-.3,w-.97,d/2+.2,x?.75:1.5,.2,.8),x))for(let I=-1;I<=1;I++)ke(e,u,L,I*d/3-.8,I*d/3+.8,w*.28-.3,d/2+.24,.42,.12,.45);for(let I=0;I<(x?2:1);I++)u()<.8&&Je(e,L((u()-.5)*(d-2),w+.28,d/2-.55,1,1,1).multiply(k(0,0,0,1,1,1,(u()-.5)*2.6+Math.PI)),u())}}b<2&&_(r.hi?Object.assign(new ce(64),{isVoid:!0}):e,t,a,n,d*.74,10,1.2),r.hi&&w>4||pe(e,a,n,d*.6,1),await i.yield()}const c=Math.cos(f),g=Math.sin(f);for(let v=0;v<r.domes.length;v++){let[y,u,x,E,L]=r.domes[v];L===0&&(y*=d*.31,u*=d*.31,L=w+2.2+x*.25);const z=a+c*y+g*u,I=n-g*y+c*u,A=x/2;nt(e,z,I,A,d>0?w-.2:P+4,L,s?1-E:E,b,Math.max(2.2,x*(b>1?.36:.3)),(2+t()*7)*Z*(t()<.5?-1:1),t()*6.28),d===0&&(_(e,t,z,I,A*.75,6,1.2),pe(e,z,I,A,1)),await i.yield()}if(r.bel){const[v,y,u,x,E]=r.bel;xt(e,t,a+c*v+g*y,n-g*v+c*y,f,u,x,E,b,s?0:1),await i.yield()}}async function gt(e,t,r){const[s,i]=ie,a=.25,n=M,f=(h,m,c,g,v=1,y=1,u=1)=>k(s,0,i,1,1,1,a+h*Math.PI/2).multiply(k(m,c,g,v,y,u));e.add(o.box,f(0,0,P,0,9.6,16.3-P,9.6),n.lime,l.LIME),e.add(o.box,f(0,0,P,0,10.6,1.6-P,10.6),n.plinth,l.LIME),e.add(o.box,f(0,0,1.6,0,10.8,.22,10.8),n.snow,l.SNOW),e.add(o.box,f(0,0,16.3,0,10.8,.9,10.8),n.lime,l.LIME);const d=new p.ExtrudeGeometry(Ue(7.6,12.9,1.9,1,7.4),{depth:1,bevelEnabled:!1,curveSegments:6});await r.yield();const w=new p.Shape;w.moveTo(-1.8,0),w.lineTo(1.8,0),w.lineTo(1.8,5.2),w.absarc(0,5.2,1.8,0,Math.PI,!1),w.lineTo(-1.8,0);const b=new p.ExtrudeGeometry(w,{depth:.14,bevelEnabled:!1,curveSegments:6});for(let h=0;h<4;h++){e.add(b,f(h,0,4.2,4.78),Se,l.PLAIN+B);for(const m of[-1,1])e.add(o.box,f(h,m*4.15,1.8,4.92,.9,14.5,.3),n.lime,l.LIME);e.add(d,f(h,0,17.2,2.8),n.lime,l.LIME),await r.yield()}e.add(o.box,f(0,0,17.2,0,5.5,.4,5.5),n.limeDark,l.LIME),e.add(o.box,f(0,0,30.1,0,8.8,.9,8.8),n.lime,l.LIME),e.add(o.box,f(0,0,26.6,0,5.6,.3,.3),[.12,.11,.08],l.PLAIN),e.add(o.bell,f(0,0,24.3,0,1.2,2.2,1.2),[.12,.11,.08],l.PLAIN),e.add(o.cyl12,f(0,0,31,0,2.7,3.2,2.7),n.lime,l.LIME);for(let h=0;h<8;h++){const m=(h+.5)/8*Math.PI*2;e.add(o.face,k(s+Math.cos(m)*2.68,31.6,i+Math.sin(m)*2.68,.5,1.9,.16,-m+Math.PI/2),Se,l.PLAIN+B)}e.add(o.ball,f(0,0,34.2,0,2.95,2.8,2.95),n.lead,l.LEAD),e.add(o.cone,f(0,0,36.4,0,.6,5.6,.6),n.gold,l.GOLD),Q(e,s,41.8,i,2.4,.03,a,1),_(e,t,s,i,7.2,10,1.1),pe(e,s,i,5.4,1)}async function Mt(e,t,r,s){const i=U,{x:a,z:n,ry:f,w:d,top:w}=i;await Re(e,t,i,r,s);const b=(y,u,x,E,L,z,I=0,A=0)=>k(a,0,n,1,1,1,f).multiply(k(y,u,x,E,L,z,I,A)),h=-(d/2+2.75),m=5.4;e.add(o.box,b(h,P,0,5.7,m-P,8.4),M.lime,l.LIME),e.add(o.box,b(h,m-.5,0,5.75,.4,8.8),K,l.LIME+G),e.add(o.prism,b(h,m,0,9.2,2.3,5.7,Math.PI/2),M.green,l.LEAD);for(const y of[-1,1])for(const u of[-1.35,1.35])e.add(o.face,b(h+u,1.3,y*4.2,.85,1.9,.16,y<0?Math.PI:0),ee,l.PLAIN+B),e.add(o.disc,b(h+u,3.2,y*4.28,.425,.16,.425,y<0?Math.PI:0,Math.PI/2),ee,l.PLAIN+B),e.add(o.disc,b(h+u,3.2,y*4.22,.7,.14,.7,y<0?Math.PI:0,Math.PI/2),K,l.LIME+G),e.add(o.box,b(h+u,1,y*4.3,1.4,.2,.3),M.lime,l.LIME);await s.yield();const c=d/2+.6,g=w-2.2;e.add(o.cyl12,b(c,P,0,3.3,g-P,3.3),M.lime,l.LIME),e.add(o.cyl12,b(c,g-.45,0,3.5,.45,3.5),K,l.LIME),e.add(o.ball,b(c,g,0,3.45,2.3,3.45),M.green,l.LEAD);for(const y of[-1,0,1])e.add(o.face,b(c+Math.cos(y)*3.26,1.4,Math.sin(y)*3.26,.75,2.5,.16,-y+Math.PI/2),ee,l.PLAIN+B),e.add(o.box,b(c+Math.cos(y)*3.3,1.1,Math.sin(y)*3.3,1.2,.2,.3,-y+Math.PI/2),M.lime,l.LIME);const v=Le(i,c+.9,0);nt(e,v[0],v[1],1.7,g+.6,g+3.8,r?0:1,1,2.2,.06,1.2);for(const y of[-1,1])e.add(o.mound,b(h+y*1.2,-.01,5.2,2.4,.5,1.3,.3*y),M.snow,l.SNOW);await s.yield()}function kt(e,t,r,s,i){const[a,n,f]=r,d=(5+t()*12)*Z*(t()<.5?-1:1),w=t()*6.28,b=((s>>1)+i)%2;f===0?(e.add(o.cyl8,k(a,-7,n,1,5.3,1),M.lime,l.LIME),e.add(o.onionC,k(a,-1.75,n,1.7,1.7,1.7,w),b?M.gold:M.blue,b?l.GOLD:l.BLUE),Q(e,a,2.1,n,2,d,w,1)):f===1?(e.add(o.cone8,k(a,-6.5,n,3.3,10.2,3.3,Ge),M.shingle,l.LEAD),e.add(o.cyl8,k(a,3.1,n,.3,1,.3),M.lime,l.LIME),e.add(o.onionS,k(a,4,n,.62,.62,.62),b?M.gold:M.blue,b?l.GOLD:l.BLUE),Q(e,a,5.3,n,1.8,d*.6,w,1)):(e.add(o.cone8,k(a,-5,n,.75,7.6,.75),M.gold,l.GOLD),e.add(o.onionS,k(a,-7.2,n,2,2,2),M.green,l.GREEN),Q(e,a,2.4,n,2.2,d,w,1)),e.add(o.cone8,k(a,-8.7,n,4.4,2.2,4.4,Ge),M.green,l.GREEN),Ce(e,k(a,P,n,6.4,2.5,6.4,Ge),6.4,1),_(e,t,a,n,st[f]+.4,5,.9,"track"),pe(e,a,n,1.5,1,1.5)}async function zt(e,t,r){const[s,i]=De,a=M,n=(m,c,g,v=1,y=1,u=1,x=0)=>k(s,0,i,1,1,1,Math.PI/2).multiply(k(m,c,g,v,y,u,x)),f=new p.Shape;f.moveTo(-13,-5),f.lineTo(13,-5),f.lineTo(13,15),f.lineTo(-13,15),f.lineTo(-13,-5);const d=new p.Path;d.moveTo(-8,-5),d.lineTo(-8,2),d.absarc(0,2,8,Math.PI,0,!0),d.lineTo(8,-5),d.lineTo(-8,-5),f.holes.push(d),e.add(new p.ExtrudeGeometry(f,{depth:8,bevelEnabled:!1,curveSegments:14}),n(0,0,-4),a.lime,l.LIME);const w=[.6,.42,.24],b=(m,c,g,v)=>{const y=new p.Shape;y.moveTo(c,-5),y.lineTo(c,2),y.absarc(0,2,c,0,Math.PI,!1),y.lineTo(-c,-5),y.lineTo(-m,-5),y.lineTo(-m,2),y.absarc(0,2,m,Math.PI,0,!0),y.lineTo(m,-5),y.lineTo(c,-5);const u=new p.ExtrudeGeometry(y,{depth:g,bevelEnabled:!1,curveSegments:14});e.add(u,n(0,0,4),v,l.LIME),e.add(u,n(0,0,-4-g),v,l.LIME)};await r.yield(),b(8,9.7,.45,a.lime),await r.yield(),b(8,9.1,.9,w),await r.yield(),b(8,8.5,1.35,a.lime),await r.yield();for(const m of[-1,1]){e.add(o.box,n(0,12.3,m*4.05,21,1.55,.16),[.6,.45,.3],l.FRESCO+G);for(const c of[-10.6,10.6])e.add(o.box,n(c,-5,m*4.55,1,18.3,1.9),a.lime,l.LIME),e.add(o.box,n(c,13.3,m*4.3,1.3,.65,1.7),a.lime,l.LIME);for(const c of[-12.2,12.2])e.add(o.box,n(c,13.3,m*4.2,2,.65,1.1),a.lime,l.LIME);for(const c of[-8.6,0,8.6])e.add(o.cyl16,n(c,17.2+(c===0?.5:0),m*4.25,1.2,1.2,.2,0).multiply(k(0,0,0,1,1,1,0,Math.PI/2)),[.6,.45,.3],l.FRESCO)}for(const m of[-1,1]){e.add(o.box,n(0,13.5,m*4.3,26.4,.45,.5),a.limeDark,l.LIME+G);for(const c of[-1,1])e.add(o.box,n(c*10.6,1.5,m*4.6,1.5,.7,2.2),w,l.LIME),e.add(o.box,n(c*10.6,12.2,m*4.6,1.4,.4,2.1),w,l.LIME),e.add(o.box,n(c*12.25,3.2,m*4.58,1.05,7.4,.12),a.limeDark,l.LIME+G),e.add(o.cyl16,n(c*12.25,10.6,m*4.58,.525,.525,.12).multiply(k(0,0,0,1,1,1,0,Math.PI/2)),a.limeDark,l.LIME+G),e.add(o.box,n(c*12.25,2.75,m*4.62,1.5,.4,.3),w,l.LIME),e.add(o.cyl16,n(c*8.15,10.2,m*4.02,1.3,1.3,.22).multiply(k(0,0,0,1,1,1,0,Math.PI/2)),w,l.LIME+G),e.add(o.cyl16,n(c*8.15,10.2,m*4.02,1.02,1.02,.3).multiply(k(0,0,0,1,1,1,0,Math.PI/2)),[.6,.45,.3],l.FRESCO+G)}await r.yield(),e.add(o.box,n(0,13.95,0,28,.45,10),w,l.LIME),e.add(o.box,n(0,14.4,0,28.8,.8,10.8),a.lime,l.LIME);for(const m of[-12.2,12.2])for(const c of[-4.2,4.2])e.add(o.box,n(m,-5,c,1.6,20,.7),a.lime,l.LIME);const h=(m,c)=>{const g=new p.Shape;return g.moveTo(-m/2,0),g.bezierCurveTo(-m/2,c*.8,-m*.1,c*.62,0,c),g.bezierCurveTo(m*.1,c*.62,m/2,c*.8,m/2,0),g.lineTo(-m/2,0),new p.ExtrudeGeometry(g,{depth:8.6,bevelEnabled:!1,curveSegments:10})};for(const m of[-8.6,0,8.6])e.add(h(8.6,m===0?5.8:4.6),n(m,15.2,-4.3),a.lime,l.LIME);for(const m of[-4.3,4.3,-12.6,12.6])e.add(o.ball6,n(m,15.25,0,1.5,.75,4.6),a.snow,l.SNOW);for(const m of[-1,1])e.add(o.ball6,n(2.5,15.2,m*4.9,9,.35,.55),a.snow,l.SNOW);e.add(o.cyl16,n(0,17,0,4.4,3.4,4.4),a.lime,l.LIME),e.add(o.cone8,n(0,20.4,0,5.3,11.5,5.3,.39),a.shingle,l.LEAD),e.add(o.cyl16,n(0,30.4,0,.95,1.6,.95),a.lime,l.LIME),e.add(o.onion,n(0,31.9,0,1.75,1.75,1.75),a.blue,l.BLUE),Q(e,s,35.85,i,2.6,.06,1.57),await r.yield();for(const m of[-1,1]){e.add(o.box,n(m*73,-5,0,120,5.9,2.6),a.lime,l.LIME);for(let c=0;c<30;c++)e.add(o.box,n(m*(15+c*4),.9,0,1.7,.5+t()*.9,2.6),a.lime,l.LIME);e.add(o.cyl16,n(m*133,-5,0,6,9.4,6),a.lime,l.LIME),e.add(o.cyl16,n(m*133,3.5,0,6.5,.5,6.5),a.lime,l.LIME);for(let c=0;c<12;c++){const g=c/12*Math.PI*2;e.add(o.box,n(m*133+Math.cos(g)*6.1,4,Math.sin(g)*6.1,1.5,1.3,.7,-g+Math.PI/2),a.lime,l.LIME)}e.add(o.cone8,n(m*133,4.6,0,6.3,9.5,6.3),a.shingle,l.LEAD),e.add(o.cyl,n(m*133,13.6,0,.16,1.5,.16),a.gold,l.GOLD),e.add(o.ball6,n(m*133,15.2,0,.42,.42,.42),a.gold,l.GOLD),await r.yield()}e.add(o.ball,n(0,-.05,0,9.5,.4,6),a.snow,l.SNOW),_(e,t,s+5,i-15,3,6,1),await r.yield(),_(e,t,s+5,i+15,3,6,1)}const Ee=[[-226.6,556.3],[-41,165],[-15,118],[0,75],[-7.9,29.9],[-28.2,-22.3],[-48,-46],[-81,-56.8],[-155,-46],[-300,-44]];let qe=null;function St(e){qe=e}function Ke(e,t){return qe?qe(e,t):de(e,t)-6}function de(e,t){let r=1e9;for(let s=0;s<Ee.length-1;s++){const i=Ee[s][0],a=Ee[s][1],n=Ee[s+1][0]-i,f=Ee[s+1][1]-a,d=Math.min(1,Math.max(0,((e-i)*n+(t-a)*f)/(n*n+f*f)));r=Math.min(r,Math.hypot(e-i-n*d,t-a-f*d))}return r}const Be=[],T=M.lime.map(e=>e*.9),he=[T,T,T,[.74,.68,.52],[.68,.53,.45]],fe=[M.blue,M.gold,M.copper,M.silver],me=[l.BLUE,l.GOLD,l.COPPER,l.SILVER];function ue(e,t,r,s,i,a,n,f,d,w,b=1){a=Math.round(a);const h=o.box.userData.ni||(o.box.userData.ni=o.box.toNonIndexed()),m=h.attributes.position,c=h.attributes.normal,g=new Float32Array(m.count*2);for(let y=0;y<m.count;y++){const u=Math.abs(c.getX(y))>.5,x=u?n:i,E=Math.max(2*Math.floor(x/9)+1,b);g[y*2]=(u?m.getZ(y):m.getX(y))*x,g[y*2+1]=a+(w>0?Math.min(x/E,15)/16:0)}const v=new p.BufferGeometry;return v.setAttribute("position",m),v.setAttribute("normal",c),v.setAttribute("uv",new p.BufferAttribute(g,2)),e.add(v,k(t,r,s,i,a-r,n,f),d,l.CITY+(w>0?Math.min(Math.max((w-2)/40,0),.45):0)),a}function Ye(e,t,r,s,i,a){const n=Math.max(.28,i*.1);e.add(o.box,k(t,r,s,n,i,n,a),M.gold,l.GOLD),e.add(o.box,k(t,r+i*.66,s,i*.5,n,n,a),M.gold,l.GOLD)}function Ie(e,t,r,s,i,a,n,f,d){e.add(f>1?o.cyl6:o.cyl,k(t,i,r,s*.62,a-i,s*.62),T,l.DRUM),e.add(f>1?o.onionS:f?o.onionC:o.onionLo,k(t,a,r,s,s,s,d),fe[n],me[n]);const w=a+2.4*s;return f?Ye(e,t,w-.2,r,Math.max(2.6,s*.8),d):Q(e,t,w-.25,r,Math.max(2.4,s*.62),.04,d,1),w}function R(e,t){const{x:r,z:s,ry:i,w:a,lod:n}=t,f=Math.max(1,Math.round(t.top/6.5)),d=ue(e,r,n===0?P:-1.5,s,a,t.top,a,i,t.col,Math.round(t.top)/f);e.add(o.box,k(r,d-.15,s,a+.9,.55,a+.9,i),t.band||T,l.LIME),e.add(o.pyr,k(r,d+.4,s,a*.74,1.2+a*.12,a*.74,i),t.roof||M.green,l.LEAD);const w=t.D/2;if(Ie(e,r,s,w,d,Math.round(d+2.2+t.D*.6),t.kind,n,i),t.five){const b=w*.52,h=Math.cos(i),m=Math.sin(i),c=a*.31;for(const[g,v]of[[-1,-1],[1,-1],[-1,1],[1,1]])Ie(e,r+h*g*c+m*v*c,s-m*g*c+h*v*c,b,d,Math.round(d+1.6+b),t.kind2,n?2:1,i)}}function be(e,t){const{x:r,z:s,ry:i,w:a}=t,n=Math.max(1,Math.round(t.top/6.5)),f=ue(e,r,t.near?P:-1.5,s,a,t.top,a,i,t.col,Math.round(t.top)/n);e.add(o.box,k(r,f-.15,s,a+.9,.55,a+.9,i),T,l.LIME);const d=a*.4,w=Math.round(a*.45),b=a*.085+.5,h=f+w+t.th*.86,m=t.th*.14+.6;e.add(o.cyl,k(r,f,s,d,w,d),T,l.DRUM),e.add(o.cone8,k(r,f+w-.2,s,d*1.14,t.th,d*1.14,i),t.roof||M.shingle,t.roofMat||l.LEAD),e.add(o.cyl6,k(r,h,s,b*.62,m,b*.62),T,l.LIME),e.add(o.onionS,k(r,h+m-.1,s,b,b,b),fe[t.kind],me[t.kind]),Ye(e,r,h+m+2.4*b-.3,s,Math.max(2.6,b*1.7),i)}function te(e,t){const{x:r,z:s,ry:i}=t;let a=t.near?P:-1.5,n=t.w,f=0;for(let d=0;d<t.tiers.length;d++){const w=Math.round(f+t.tiers[d]);ue(e,r,a,s,n,w,n,i,t.col,d?w-a:w),e.add(o.box,k(r,w-.1,s,n+1,.6,n+1,i),T,l.LIME),a=w+.5,f=a,d<t.tiers.length-1&&(n*=.8)}t.spire?(e.add(o.cyl,k(r,a-.5,s,n*.42,2.2,n*.42),T,l.DRUM),e.add(o.cone8,k(r,a+1.6,s,n*.56,2.4,n*.56,i),M.lead,l.LEAD),e.add(o.cone8,k(r,a+3.2,s,n*.17,n*1.7,n*.17),M.gold,l.GOLD),Ye(e,r,a+3+n*1.7,s,3,i)):Ie(e,r,s,n*.5,a-.5,Math.round(a+2),t.kind,Math.max(t.lod,1),i)}function He(e,t,r,s,i,a,n,f){const d=f?P:-1.5;n?(f&&e.add(o.cyl,k(t,d,r,s,.4-d,s),T,l.LIME),e.add(o.cyl,k(t,f?0:d,r,s,i-(f?0:d),s),T,l.DRUM+.2)):ue(e,t,d,r,s*1.8,i,s*1.8,.42,T,Math.round(i)/2,3),e.add(n?o.cyl:o.box,k(t,Math.round(i)-.3,r,s*(n?1.16:2.1),1.6,s*(n?1.16:2.1),.42),T,l.LIME),e.add(o.cone8,k(t,Math.round(i)+1.3,r,s*1.36,a,s*1.36,.39),M.shingle,l.LEAD),e.add(o.box,k(t,Math.round(i)+1+a,r,.3,2.2,.3),M.gold,l.GOLD)}function Ve(e,t,r,s,i,a,n){const f=s-t,d=i-r;ue(e,(t+s)/2,n?P:-1.5,(r+i)/2,Math.hypot(f,d),a,2.4,Math.atan2(-d,f),T,0)}function Lt(e,t,r,s,i){const n=ue(e,t,-1.5,r,30,18,30,s,T,6),f=30/6-.15;e.add(o.box,k(t,n-.15,r,31,.6,31,s),K,l.LIME);for(let h=0;h<4;h++)for(let m=-1;m<=1;m++)e.add(o.cyl8,k(t,0,r,1,1,1,s+h*Math.PI/2).multiply(k(m*30/3,n+.2,30/2-.6,f,.6,f*.8,0,Math.PI/2)),T,l.LIME);e.add(o.pyr,k(t,n+.4,r,30*.72,4,30*.72,s),M.green,l.LEAD),Ie(e,t,r,10,n,36,i(1),0,s);const d=Math.cos(s),w=Math.sin(s),b=30*.32;for(const[h,m]of[[-1,-1],[1,-1],[-1,1],[1,1]])Ie(e,t+d*h*b+w*m*b,r-w*h*b+d*m*b,4.75,n,26,i(0),1,s)}async function Et(e,t,r,s){const i=v=>s&&v<2?1-v:v;let a=20240917;const n=()=>(a=Math.imul(a,1664525)+1013904223>>>0,a/4294967296),f=[];Be.length=0;const d=(v,y,u)=>{const x=Math.min(1,Math.max(0,(u-v)/(y-v)));return x*x*(3-2*x)},w=v=>v<-84?100:v<-10?100+(v+84)/74*60:v<70?160+(v+10)/80*12:172-(v-70)/80*44,b=(v,y,u)=>{if(de(v,y)<58+u*.3||y<175&&Math.abs((v-(32.5-.445*y))*.914)<13+u||Math.abs(v+250)<11+u&&y>-210&&y<90||v<-45&&y>-84||v<-272||Math.hypot(v,y)<32+u)return!1;for(const x of ve)if(Math.hypot(v-x[0],y-x[1])<x[2]+6+u)return!1;for(const x of re)if(Math.hypot(v-x[0],y-x[1])<x[2]+6+u)return!1;for(const x of le)if(Math.hypot(v-x.x,y-x.z)<Math.max(x.w,8)*.75+(x.bel?20:8)+u)return!1;if(Math.hypot(v-ie[0],y-ie[1])<14+u)return!1;for(const x of f)if(Math.hypot(v-x[0],y-x[1])<x[2]+u+3)return!1;return!0},h=(v,y,u)=>(f.push([v,y,u]),de(v,y)<125&&Be.push([v,y,u+7]),de(v,y)<135);Lt(e,118,-95,.42,i),h(118,-95,24),await r.yield(),te(e,{x:150,z:-62,ry:.42,w:10,tiers:[18,11,9,8],spire:1,col:T,lod:1}),h(150,-62,8),await r.yield(),be(e,{x:-64,z:-172,ry:.42,w:15,top:12,th:33,col:T,kind:i(1),roof:fe[i(0)],roofMat:me[i(0)]}),h(-64,-172,11),await r.yield(),te(e,{x:-198,z:-158,ry:.3,w:10,tiers:[18,11,9,8],spire:1,col:he[3],lod:1}),h(-198,-158,8),await r.yield(),R(e,{x:-152,z:-146,ry:.42,w:22,top:13,D:10,kind:i(0),kind2:i(1),five:1,lod:h(-152,-146,17)?0:1,col:T,band:K}),await r.yield(),be(e,{x:6,z:-204,ry:.3,w:14,top:11,th:29,col:he[3],kind:i(0),roof:M.copper,roofMat:l.COPPER}),h(6,-204,10),await r.yield(),R(e,{x:150,z:-196,ry:.5,w:24,top:15,D:11,kind:i(1),kind2:i(0),five:1,lod:1,col:T,band:K}),h(150,-196,18),await r.yield(),te(e,{x:206,z:-138,ry:.42,w:9,tiers:[14,9,7,6],spire:0,kind:i(1),col:T,lod:1}),h(206,-138,8),await r.yield(),R(e,{x:96,z:12,ry:.42,w:17,top:10,D:8,kind:i(1),kind2:i(0),five:1,lod:h(96,12,13)?0:1,col:T,band:K}),await r.yield(),be(e,{x:82,z:-44,ry:.42,w:11,top:9,th:17,col:T,kind:i(1),roof:fe[i(1)],roofMat:me[i(1)]}),h(82,-44,9),await r.yield(),te(e,{x:132,z:58,ry:.42,w:7.5,tiers:[12,7,6],spire:1,col:T,lod:1}),h(132,58,7),await r.yield(),R(e,{x:-30,z:-136,ry:.42,w:18,top:11,D:8.5,kind:i(1),kind2:i(0),five:1,lod:h(-30,-136,14)?0:1,col:T,band:K}),await r.yield(),R(e,{x:12,z:304,ry:.42,w:20,top:12,D:9.5,kind:i(1),kind2:i(0),five:1,lod:1,col:T,band:K}),h(12,304,15),be(e,{x:40,z:276,ry:.42,w:12,top:9,th:21,col:he[3],kind:i(1),roof:M.copper,roofMat:l.COPPER}),h(40,276,9),te(e,{x:-16,z:276,ry:.42,w:8.5,tiers:[14,9,7,6],spire:1,col:T,lod:1}),h(-16,276,7),await r.yield(),R(e,{x:44,z:326,ry:.42,w:11,top:8,D:7,kind:i(0),five:0,lod:1,col:he[4]}),h(44,326,8),R(e,{x:-22,z:322,ry:.42,w:10,top:7,D:6.4,kind:i(2),five:0,lod:1,col:T}),h(-22,322,8);{const v=[[-42,300,-30,252],[-30,252,32,240],[32,240,66,284],[66,284,58,344],[58,344,-8,352],[-8,352,-42,300]];for(const[y,u,x,E]of v)Ve(e,y,u,x,E,6,!1),He(e,y,u,3.6,13,8,1,!1),h(y,u,6)}await r.yield(),be(e,{x:-38,z:372,ry:.42,w:13,top:10,th:24,col:T,kind:i(1),roof:fe[i(0)],roofMat:me[i(0)]}),h(-38,372,10),R(e,{x:-6,z:388,ry:.42,w:16,top:10,D:8,kind:i(1),kind2:i(0),five:1,lod:1,col:he[3],band:K}),h(-6,388,12),R(e,{x:-50,z:340,ry:.42,w:10,top:7,D:6.6,kind:i(3),five:0,lod:1,col:T}),h(-50,340,8),await r.yield();{const v=[[-42,300,-68,338],[-68,338,-52,408],[-52,408,-14,420],[-14,420,20,398],[20,398,-8,352]];for(const[y,u,x,E]of v)Ve(e,y,u,x,E,6,!1),u>300&&(He(e,y,u,3.6,12,8,1,!1),h(y,u,6))}await r.yield(),R(e,{x:-238,z:198,ry:.42,w:18,top:11,D:9,kind:i(0),kind2:i(1),five:1,lod:1,col:T,band:K}),h(-238,198,14),te(e,{x:-214,z:216,ry:.42,w:8,tiers:[13,8,7],spire:1,col:he[3],lod:1}),h(-214,216,7),R(e,{x:-260,z:218,ry:.42,w:10,top:7,D:6.6,kind:i(1),five:0,lod:1,col:T}),h(-260,218,8),await r.yield();const m=[[-298,-124,-270,-120],[-228,-116,-150,-100],[-150,-100,-62,-104],[-62,-104,48,-93],[100,-84,160,-10],[160,-10,172,70],[172,70,128,150]];for(const[v,y,u,x]of m){const E=de((v+u)/2,(y+x)/2)<125;if(Ve(e,v,y,u,x,7,E),E){const L=Math.ceil(Math.hypot(u-v,x-y)/12);for(let z=0;z<=L;z++)Be.push([v+(u-v)*z/L,y+(x-y)*z/L,10])}}await r.yield();const c=[[-270,-120,5.2,20,12,1],[-228,-116,5.2,20,12,1],[-150,-100,4.6,17,10,1],[-62,-104,4.6,18,10,1],[48,-93,5.2,21,12,1],[100,-84,5.2,21,12,1],[160,-10,4.8,17,10,1],[172,70,4.6,16,9,1],[128,150,4.6,15,9,1],[-193,-104,3.4,12,7,1],[-106,-102,3.4,12,7,1],[-7,-98,3.4,12,7,1],[130,-47,3.4,12,7,1],[152,110,3.4,11,7,1]];for(const v of c)He(e,v[0],v[1],v[2],v[3],v[4],v[5],de(v[0],v[1])<125),h(v[0],v[1],v[2]+2);await r.yield();let g=0;for(let v=-322;v<170;v+=42,g++)for(let y=-282+g%2*21;y<290;y+=42){const u=y+(n()-.5)*24,x=v+(n()-.5)*24,E=n(),L=n(),z=n(),I=n(),A=n(),C=x<-116,q=x>=-116&&u>32.5-.445*x+18&&u<w(x)-13;if(!(C||q)||A<.1)continue;const X=u*.926+x*.377,H=u*.377-x*.926,Y=Math.min(62,Math.max(28,62-.13*Math.abs(X-25)))*(C?.55+.45*d(10,120,-112-x):.5+.25*d(40,140,u))*(.85+.3*I),V=he[Math.floor(L*5)],j=i(z<.3?0:z<.7?1:z<.85?2:3),oe=.42+(I-.5)*.5,We=I<.3?[M.shingle,l.LEAD]:I<.55?[M.copper,l.COPPER]:I<.8?[fe[i(0)],me[i(0)]]:[fe[i(1)],me[i(1)]];if(E<.38){const S=Math.min(30,Math.max(10,(Y-5)/1.45));if(!b(u,x,S*.75))continue;R(e,{x:u,z:x,ry:oe,w:S,top:S*.62,D:S*.5,kind:j,kind2:j===i(1)?i(0):i(1),five:1,lod:h(u,x,S*.75)?0:1,col:V,band:L>.5?K:T})}else if(E<.6){const S=Math.min(18,Math.max(8,(Y-5)/1.87));if(!b(u,x,S*.75))continue;R(e,{x:u,z:x,ry:oe,w:S,top:S*.75,D:S*.62,kind:j,five:0,lod:h(u,x,S*.75)?0:1,col:V,roof:I>.5?M.shingle:M.green})}else if(E<.8){const S=Math.min(18,Math.max(8,(Y*1.15-3)/3.1));if(!b(u,x,S*.75))continue;be(e,{x:u,z:x,ry:oe,w:S,top:S*.7,th:S*1.7,col:V,kind:j,roof:We[0],roofMat:We[1],near:h(u,x,S*.75)})}else{const S=Math.min(13,Math.max(6,(Y*1.2-3)/4.1));if(!b(u,x,S))continue;te(e,{x:u,z:x,ry:oe,w:S,tiers:[S*1.5,S,S*.8],spire:z>.55?1:0,kind:j,col:V,lod:1,near:h(u,x,S)})}await r.yield()}for(const[v,y,u,x]of[[300,430,18,1],[430,320,20,0],[372,-24,22,1],[500,130,20,1],[336,-262,22,0],[-424,-424,22,1],[-700,-330,24,1],[-560,-40,20,0]])R(t,{x:v,z:y,ry:.42,w:u,top:u*.62,D:u*.44,kind:i(x),kind2:i(1-x),five:1,lod:2,col:T}),te(t,{x:v+u*1.1,z:y-u*.5,ry:.42,w:u*.42,tiers:[u*.8,u*.5,u*.4],spire:x,kind:i(1),col:T,lod:2}),await r.yield()}async function Ct(e,t={}){await ft(e),await e.yield();const r=e.rng.fork("domes-hero"),s=e.core&&e.core.makeRng?e.core.makeRng(e.core.hashSeed("drowned-domes:slabs:"+e.seed)):null;s&&(r.slab=s);const i=t.uniforms||mt(),a=new p.Group,n=new ce(102e3),f=new ce(64e3);ne=f,await e.yield(),await ut(n,e),await e.yield(),_(n,r,0,0,13.5,22,1.1,!0),await e.yield();const d=[];for(let W=0;W<ve.length;W++)d.push(await et(n,r,ve[W],W,t.gilt?t.gilt[W]:void 0,e,W===5||W===2||W===3?{slim:!0,drum:tt[W]}:W===6?{drum:tt[6]}:{slim:W>=7})),await e.yield();await e.yield(),await zt(n,r,e),await e.yield();const w=e.core&&e.core.makeRng?e.core.makeRng(e.core.hashSeed("drowned-domes:lesser:"+e.seed)):r,b=t.flip?1:0;s&&(w.slab=s);const h=new ce(292e3);for(let W=0;W<re.length;W++){const D=re[W],O=1.5+w()*w()*(W>=6?5:3.5);await et(h,w,D,9+W,b&&D[3]<2?1-D[3]:D[3],e,{lod:1,drum:D[4]||O,slim:!!D[5]}),await e.yield()}for(const W of le)await Re(h,w,W,b,e),await e.yield();await gt(h,w,e),await e.yield();{const W=e.core&&e.core.makeRng?e.core.makeRng(e.core.hashSeed("drowned-domes:sobor:"+e.seed)):w;s&&(W.slab=s),await Mt(h,W,b,e),await e.yield()}{const W=O=>{const ae=e.core&&e.core.makeRng?e.core.makeRng(e.core.hashSeed("drowned-domes:"+O+":"+e.seed)):w;return s&&(ae.slab=s),ae};await Re(h,W("sunk"),N,b,e),await e.yield();const D=W("tips");for(let O=0;O<we.length;O++)kt(h,D,we[O],O,b),await e.yield()}const m=new ce(1e5);await e.yield(),await Et(m,f,e,b),await e.yield(),ne=null;const c=await n.buildAsync(e),g=await h.buildAsync(e),v=await m.buildAsync(e),y=await f.buildAsync(e);await e.yield();const u=pt(i);await e.yield();const x=new p.Mesh(c,u);x.frustumCulled=!1,a.add(x);const E=wt(i);await e.yield();const L=new p.Mesh(c,E);L.frustumCulled=!1,L.renderOrder=3,a.add(L);const z=new p.Mesh(g,u);z.frustumCulled=!1,a.add(z);const I=new p.Mesh(g,E);I.frustumCulled=!1,I.renderOrder=3,a.add(I),await e.yield();const A=new p.Mesh(v,u);A.frustumCulled=!1,a.add(A);const C=new p.Mesh(v,E);C.frustumCulled=!1,C.renderOrder=3,a.add(C);const q=new p.Mesh(y,u);q.frustumCulled=!1,a.add(q),a.userData.cityTris=Math.round((v.attributes.position.count+y.attributes.position.count)/3),await e.yield();const X=new p.MeshStandardMaterial({color:"#4b4a3a",metalness:.6,roughness:.45,side:p.DoubleSide}),H=new p.Group;H.position.set(0,41.2,0),H.rotation.y=-67*Z;const Y=new p.Mesh(o.bell.clone().scale(1.5,2,1.5).translate(0,-2.6,0),X),V=new p.Mesh(new p.BoxGeometry(.07,5,.07).translate(0,-2.5,0),new p.MeshStandardMaterial({color:"#8d8572",roughness:1}));V.position.y=-2.6,Y.add(V),H.add(Y),a.add(H);const j=new p.Mesh(new p.BoxGeometry(6,.4,.4),X);j.position.set(0,41.4,0),j.rotation.y=-67*Z,a.add(j),await e.yield();const oe=W=>new p.ShaderMaterial({uniforms:Object.assign({},i,{uPlA:{value:W}}),transparent:!0,depthWrite:!1,side:p.DoubleSide,vertexShader:`varying vec2 vUv; varying vec3 vW; uniform float uTime;
      void main(){ vUv = uv; vec3 p = position; p.y += sin(uv.x * 5. - uTime * 1.3) * 1.4 * uv.x + uv.x * uv.x * 5.; p.z += sin(uv.x * 3.3 - uTime * 0.9 + 1.) * 1.8 * uv.x;
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`varying vec2 vUv; varying vec3 vW; uniform float uTime, uFogDen, uSunK, uHemiK, uPlA; uniform vec3 uSunCol, uFogCol, uSky, uGnd;
      ${Pe}
      void main(){
        float n = fb(vec2(vUv.x * 7. - uTime * 1.5, vUv.y * 3. + vUv.x * 2.)) * fb(vec2(vUv.x * 2.2 - uTime * 0.6, vUv.y * 1.5 + 4.));
        float a = smoothstep(0.1, 0.42, n) * (1. - vUv.x) * smoothstep(0., 0.07, vUv.x) * (1. - abs(vUv.y * 2. - 1.));
        float dist = length(cameraPosition - vW); float f = 1. - exp(-dist * dist * uFogDen * uFogDen);
        gl_FragColor = vec4(mix((uSunCol * uSunK * 0.5 + mix(uGnd, uSky, 0.6) * uHemiK) * (0.3183 * 0.85), uFogCol, f), a * uPlA);        // lit by the hour
      }`}),We=Math.atan2(.616,.788),S=oe(.75),rt=oe(1.5);await e.yield();for(const[W,D,O,ae,ye,se]of[[-9.5,16.4,4,15,13,-67*Z],[-24.6,8,9.2,17,9,.42+Math.PI/2]]){const it=new p.PlaneGeometry(ye,ae,12,3).translate(ye/2,0,0).rotateZ(-Math.PI/2),xe=new p.Mesh(it,rt);xe.position.set(W,D,O),xe.rotation.y=se,xe.renderOrder=6,xe.frustumCulled=!1,a.add(xe)}{const W=new p.PlaneGeometry(24,4,12,2).translate(12,0,0),D=new p.Mesh(W,S);D.position.set(-35.2,9.6,13.9),D.rotation.y=Math.atan2(.616,.788),D.renderOrder=6,D.frustumCulled=!1,a.add(D)}for(const[W,D,O,ae]of[[60.2,46,9,0],[53.2,34,7,0],[60.4,44,12,1],[43.2,26,6,0],[17.2,30,6,0],[31,30,6,0]]){const ye=new p.PlaneGeometry(D,O,20,3).translate(D/2,0,0);ae&&ye.rotateX(-Math.PI/2);const se=new p.Mesh(ye,S);se.position.set(2.5,W+(ae?0:O*.35),-2),se.rotation.y=We,se.renderOrder=6,se.frustumCulled=!1,a.add(se)}await e.yield();const lt={towerBase:new p.Vector3(0,0,0),spireTip:new p.Vector3(0,74,0),belfry:new p.Vector3(0,38,0),domes:d.map(W=>new p.Vector3(W[0],W[1],W[2])),domeCentres:ve.map(W=>new p.Vector3(W[0],0,W[1])),portalSeat:new p.Vector3(De[0],2.6,De[1]),portalNormal:new p.Vector3(1,0,0)};let je=t.swing||.32;return{object:a,radius:320,height:74,center:new p.Vector3(0,26,0),anchors:lt,uniforms:i,geometry:c,surfaceMaterial:u,mirrorMaterial:E,setSwing(W){je=W},update(W,D,O){i.uTime.value=D,Y.rotation.x=Math.sin(D*1.15)*je,V.rotation.x=-Y.rotation.x*.7+.25+Math.sin(D*2.3)*.08,V.rotation.z=.3+Math.sin(D*1.7)*.1},dispose(){},ground:!0,groundY:0}}export{ce as Acc,P as BED_Y,le as CHURCHES,Be as CITY_KEEP,M as COL,ve as DOMES,tt as DRUMS,re as EXTRA,At as FEET,De as GATE,Pe as GLSL_COMMON,Tt as KEEPOUT,k as M,l as MAT,Me as NFOOT,Wt as SHADOWS,U as SOBOR,N as SUNK,we as TIPS,ie as TOWER2,o as UNIT,Et as buildCity,Ct as buildHero,pe as driftTail,pt as makeSurfaceMaterial,mt as makeUniforms,Je as perch,St as setLane};
