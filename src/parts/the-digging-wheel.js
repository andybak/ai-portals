import*as h from"three";const m={x:80,y:32,R:10},_=-5,O=new h.Vector3(-.5,.4,.77).normalize(),Y=16,A=20,Z=9.81,C=24,z=20,Q={cut:{x1:174,z0:-131,z1:-26.5,eastX0:150,eastZ1:-8.3},pass:{x0:174,x1:181.2,knife:-34.5},rows:7.2,combine:{x:177.6,z:-41,yaw:0},tractor:{x:153,z:-57,yaw:0},trailer:{x:153,z:-64.5,yaw:0}},w={x0:8,x1:m.x,top0:24,bot0:18,rise:10.5,zS:-2.3,zN:-7.7},D=n=>w.top0+(n-w.x0)/(w.x1-w.x0)*w.rise,J=n=>w.bot0+(n-w.x0)/(w.x1-w.x0)*w.rise,ee=n=>D(n)+.95,S={from:[-14,13.5],to:[-84,10.5],w:3.4,h:3},te=n=>S.from[1]+(n-S.from[0])/(S.to[0]-S.from[0])*(S.to[1]-S.from[1])+S.h/2,oe={from:[-86,10],to:[-108,17],w:2.6,h:2.2},se={x:-112,z:_,R:13,H:14},ae=[[-84.4,9.5,135.5],[-81.8,9.5,126.9],[-75,9.2,113.5],[-63.2,8.2,97.3],[-44.5,6,76.5],[-32.5,5,62],[-19.5,4.6,39.5],[-12.6,4.6,31.6],[-4.6,4.7,27.1],[4.6,4.9,25.6],[22,6.5,25.6],[44,19.5,27],[62,30,30.5],[80,35.6,26.5],[92,40.3,29],[105,42.8,36],[120,51.5,51],[135,60.5,60.5],[150,64,51.5],[172.75,61,28.75],[179.97,59.9,18.24],[182.95,58.7,5.9],[183.75,57.4,-8.5],[184.54,56,-22.85],[183.21,54.9,-35.19],[178.06,53.7,-46.44],[171.5,52.7,-56.2],[165,51.58,-66]],ne=13,re=(n,e=1)=>{const o=new h.Color(n);return[o.r*e,o.g*e,o.b*e]},ie=[.1,.105,.115],he=[.74,.73,.7],ce=[.215,.23,.235],ue=[.44,.18,.11],le=[.43,.33,.21],de=[.02,.02,.022],xe=[.1,.105,.11],fe=[.4,.42,.4],ve=[.035,.05,.065];function me(n){let e=n>>>0;const o=()=>{e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296};return o.range=(t,s)=>t+(s-t)*o(),o}function pe(n,e){return n.core.makeRng(n.core.hashSeed(e+":"+n.seed))}function F(n){return 2*Math.PI*((n%A+A)%A)/A}function we(n,e){const o=F(e),t=Math.cos(o),s=Math.sin(o),a=n[0]-m.x,r=n[1]-m.y;return[m.x+t*a-s*r,m.y+s*a+t*r,n[2]]}function ye(){const n=o=>Array.from({length:o},()=>new h.Vector3),e=o=>Array.from({length:o},()=>new h.Vector4);return{uSun:{value:O.clone()},uT:{value:0},uWheel:{value:new h.Vector3(m.x,m.y,m.R)},uHaze:{value:new h.Vector3(.8,.8,.78)},uBoxC:{value:n(C)},uBoxH:{value:n(C)},uBoxR:{value:Array.from({length:C},()=>new h.Vector2(1,0))},uBoxN:{value:0},uCapA:{value:e(z)},uCapB:{value:e(z)},uCapN:{value:0}}}function ge(n,e,o,t=0){const s=n.uBoxN.value;return s>=C?-1:(n.uBoxC.value[s].set(e[0],e[1],e[2]),n.uBoxH.value[s].set(o[0],o[1],o[2]),n.uBoxR.value[s].set(Math.cos(t),Math.sin(t)),n.uBoxN.value=s+1,s)}function be(n,e,o,t,s=t){const a=n.uCapN.value;return a>=z?-1:(n.uCapA.value[a].set(e[0],e[1],e[2],t),n.uCapB.value[a].set(o[0],o[1],o[2],s),n.uCapN.value=a+1,a)}const E=`
#ifndef DW_HEAD
#define DW_HEAD
  uniform vec3 uSun;      // toward the sun
  uniform float uT;       // the world's clock, seconds
  uniform vec3 uWheel;    // the hub's x, y and the radius the teeth sweep
  uniform vec3 uHaze;     // the far air's colour
#endif
`,H=E+`
  const vec3 SUNC = vec3(1.0, 0.76, 0.44) * 1.5;            // the low gold sun (round three e: deeper and stronger against a lower, bluer fill)
  float hash1(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vnoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
    return mix(mix(mix(hash1(i), hash1(i + vec3(1,0,0)), f.x), mix(hash1(i + vec3(0,1,0)), hash1(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash1(i + vec3(0,0,1)), hash1(i + vec3(1,0,1)), f.x), mix(hash1(i + vec3(0,1,1)), hash1(i + vec3(1,1,1)), f.x), f.y), f.z); }
  float fbm(vec3 p){ float a = 0.5, s = 0.; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = p * 2.03 + 7.1; a *= 0.5; } return s / 0.9375; }
  // what the sky and the lit ground give a face that looks along n
  vec3 skyAmb(vec3 n){ return mix(vec3(0.52, 0.40, 0.24) * 0.20, vec3(0.34, 0.46, 0.74) * 0.34, n.y * 0.5 + 0.5); }
  // the air between the lens and the place wp: its depth, and (round three e) the direction of sight against the sun's,
  // by which the air toward the sun is gold. (The lens's place is read in this world's shaders only as light itself
  // needs it: here for the air; in faceNormal to light a face on the side that is seen; in the land's shaders for the
  // ears' sheen and the stand's own shade toward the sun and for the light through leaves.)
  vec3 hazeK(vec3 col, vec3 wp, float k){ vec3 v = wp - cameraPosition; float d = length(v); float f = 1. - exp(-d * k);
    float g = max(dot(v / max(d, 1e-3), uSun), 0.);           // (the air toward the sun is gold: the look's own direction, read as the air's light needs it)
    return mix(col, mix(uHaze, vec3(1.0, 0.80, 0.52), 0.7 * g * g * g), f); }
  vec3 haze(vec3 col, vec3 wp){ return hazeK(col, wp, 0.0007); }      // (round three e: the air nearly twice as dense as it was, 0.00038)
`,L=E+`
  // the wheel's angle now (radians, anticlockwise seen from +z; one turn in 20 s)
  float wheelTurn(){ return 6.2831853 * mod(uT, 20.0) / 20.0; }
  // a point turned by the angle a about the hub's axis (the line through (uWheel.x, uWheel.y) parallel to z)
  vec3 turnedBy(vec3 p, float a){ float c = cos(a), s = sin(a); vec2 d = p.xy - uWheel.xy;
    return vec3(uWheel.xy + vec2(c * d.x - s * d.y, s * d.x + c * d.y), p.z); }
  // a point of the wheel as built, where the wheel has carried it now (buckets rise on the +x side)
  vec3 turned(vec3 p){ return turnedBy(p, wheelTurn()); }
  vec3 movedMore(vec3 p, vec4 mark, vec4 aux);              // kinds 2 and up: defined by opts.motion (or the default)
  vec3 moved(vec3 p, vec4 mark, vec4 aux){
    if (mark.x < 0.5) return p;                             // KIND 0: it stands
    if (mark.x < 1.5) return turned(p);                     // KIND 1: it turns with the wheel
    return movedMore(p, mark, aux);                         // KINDS 2 and up
  }
`,P=`
  vec3 movedMore(vec3 p, vec4 mark, vec4 aux){ return p; }
`,R=E+`
  uniform vec3 uBoxC[${C}]; uniform vec3 uBoxH[${C}]; uniform vec2 uBoxR[${C}]; uniform int uBoxN;
  uniform vec4 uCapA[${z}]; uniform vec4 uCapB[${z}]; uniform int uCapN;
  // a ray from o along d against a box of half sizes h about the origin: 1 in its shadow, soft at the shadow's edge
  // (the ray's miss distance past the box's edge is worked from the gap between its entry and exit times)
  float boxCut(vec3 o, vec3 d, vec3 h){
    d = mix(d, vec3(1e-4), vec3(lessThan(abs(d), vec3(1e-4))));
    vec3 m = 1. / d, n = m * o, k = abs(m) * h, t1 = -n - k, t2 = -n + k;
    float tN = max(max(t1.x, t1.y), t1.z), tF = min(min(t2.x, t2.y), t2.z);
    vec3 ad = abs(d); float di = dot(step(vec3(tN), t1), ad), dj = dot(step(t2, vec3(tF)), ad);
    float miss = (tN - tF) * di * dj / sqrt(di * di + dj * dj + 1e-8), soft = 0.10 + 0.010 * max(tN, 0.);
    return (1. - smoothstep(-soft, soft, miss)) * smoothstep(0., 0.3, tF);
  }
  // the same against a round bar from a.xyz (radius a.w) to b.xyz (radius b.w)
  float capCut(vec3 o, vec3 d, vec4 a, vec4 b){
    vec3 u = b.xyz - a.xyz, w = o - a.xyz; float B = dot(d, u), Cc = dot(u, u), D = dot(d, w), E = dot(u, w);
    float s = clamp((E - B * D) / max(Cc - B * B, 1e-5), 0., 1.), t = max(0., B * s - D); s = clamp((E + B * t) / Cc, 0., 1.);
    float dist = length(w + d * t - u * s), r = mix(a.w, b.w, s), soft = 0.15 + 0.012 * t;
    return (1. - smoothstep(r - soft, r + soft, dist)) * smoothstep(0., 0.5, t);
  }
  float shade(vec3 p){ float sh = 0.;
    // the wheel: a disc in the plane z = 0.2 about the hub, its rim toothed by the sixteen buckets as they go round
    if (p.z < -1.6) { float t = (0.2 - p.z) / uSun.z; vec2 q = (p + uSun * t).xy - uWheel.xy; float r = length(q);
      float k = abs(fract((atan(q.y, q.x) - 6.2831853 * mod(uT, 20.0) / 20.0) / 0.3926991 - 0.236) - 0.5);
      float edge = mix(uWheel.z - 1.9, uWheel.z - 0.15, smoothstep(0.06, 0.2, k)), soft = 0.2 + 0.012 * t;
      sh = max(sh, 1. - smoothstep(edge - soft, edge + soft, r)); }
    // the wheel's boom: a slab 72 m long that climbs 10.5 m to the hub (a box in a frame sheared by that climb)
    { float kx = 10.5 / 72.; vec3 o = vec3(p.x - (uWheel.x - 35.4), p.y - (uWheel.y - 0.5 - kx * (uWheel.x - p.x)), p.z + 5.);
      sh = max(sh, boxCut(o, vec3(uSun.x, uSun.y - kx * uSun.x, uSun.z), vec3(36.6, 2.9, 2.6))); }
    // the machine's big masses and whatever else is in the table
    for (int i = 0; i < ${C}; i++) { if (i < uBoxN) { float c = uBoxR[i].x, s = uBoxR[i].y; vec3 o = p - uBoxC[i];
      sh = max(sh, boxCut(vec3(c * o.x - s * o.z, o.y, s * o.x + c * o.z), vec3(c * uSun.x - s * uSun.z, uSun.y, s * uSun.x + c * uSun.z), uBoxH[i])); } }
    for (int i = 0; i < ${z}; i++) { if (i < uCapN) sh = max(sh, capCut(p, uSun, uCapA[i], uCapB[i])); }
    return sh * 0.94; }
  vec3 faceNormal(vec3 wp){ vec3 n = normalize(cross(dFdx(wp), dFdy(wp))); return dot(n, wp - cameraPosition) > 0. ? -n : n; }
  float footprint(vec3 wp){ vec3 w = fwidth(wp); return max(length(w) * 0.7071, 1e-4); }
  // THE CLOUDS' DRIFTING SHADOWS ON WHAT STANDS IN THE PIT: how much of the sun a cloud takes from the steel, the works,
  // the coach and the pickup at a place. It is the land's own field (its cloudCutL and pitCloud hold the same figures:
  // the same pattern at the same place and clock), so that a shadow that darkens the pit's floor darkens what stands on
  // it: on the machine's own ground 0.78 of the whole, as the floor there; easing to none over the last 28 m before the
  // lip at the wheel's end (the lip stands ${(m.x+10.2).toFixed(1)} m out south of the cut front and ${(m.x+6.2).toFixed(1)} m north of it), as the
  // floor does there; whole beyond 230 m of the machine's axis. By the place alone: the height is not asked.
  float cloudOn(vec3 wp){ vec2 p = wp.xz; float r = length(p), lipr = mix(${(m.x+6.2).toFixed(1)}, ${(m.x+10.2).toFixed(1)}, smoothstep(-3., 5., p.y));
    float far = max(smoothstep(130., 230., r), 0.78 * mix(1., smoothstep(0., 28., lipr - r), smoothstep(20., 50., p.x)));
    if (far <= 0.) return 0.; vec2 q = p - vec2(9., -4.) * uT; return 0.68 * far * smoothstep(0.535, 0.57, fbm(vec3(q / 270., 4.4))); }
  // the sun's cut AT THE FRAGMENT'S OWN PLACE (the bodies' shadows and the clouds' together), worked once however many
  // ask (lit() and a surface's own law of light both may): call it only with the fragment's own world place
  float gCut = -1.;
  float shadeOnce(vec3 wp){ if (gCut < 0.) gCut = 1. - (1. - shade(wp)) * (1. - cloudOn(wp)); return gCut; }
  vec3 lit(vec3 col, vec3 n, vec3 wp){ float ndl = max(dot(n, uSun), 0.), cut = ndl > 0. ? shadeOnce(wp) : 0.;
    return col * (SUNC * ndl * (1. - cut) + skyAmb(n)); }
`,I=`
  vec3 surface(vec3 base, vec3 p0, vec3 wp, vec3 n, float foot){ return base; }
`;function V(n,e={}){return new h.ShaderMaterial({side:h.DoubleSide,uniforms:n,vertexShader:`${L}
      ${e.motion||P}
      attribute vec3 color; attribute vec4 mark; attribute vec4 aux; varying vec3 vW, vP0, vC;
      void main(){ vP0 = position; vC = color; vW = moved(position, mark, aux); gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.); }`,fragmentShader:`${H}${R}
      ${e.surface||I}
      varying vec3 vW, vP0, vC;
      void main(){ vec3 n = faceNormal(vW); vec3 col = surface(vC, vP0, vW, n, footprint(vW));
        gl_FragColor = vec4(haze(lit(col, n, vW), vW), 1.); }`})}const p=(1+Math.sqrt(5))/2,$=[[-1,p,0],[1,p,0],[-1,-p,0],[1,-p,0],[0,-1,p],[0,1,p],[0,-1,-p],[0,1,-p],[p,0,-1],[p,0,1],[-p,0,-1],[-p,0,1]],G=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]],q=[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]],N=[0,0,0,0];class Ce{constructor(e=3072){this.n=0,this.cap=e,this.P=new Float32Array(e*3),this.C=new Float32Array(e*3),this.M=new Float32Array(e*4),this.A=new Float32Array(e*4),this.mark=N,this.aux=N}_room(e){if(this.n+e<=this.cap)return;let o=this.cap;for(;this.n+e>o;)o*=2;const t=(s,a)=>{const r=new Float32Array(o*a);return r.set(s.subarray(0,this.n*a)),r};this.P=t(this.P,3),this.C=t(this.C,3),this.M=t(this.M,4),this.A=t(this.A,4),this.cap=o}tri(e,o,t,s){this._room(3);const a=this.P,r=this.C,u=this.M,l=this.A,d=this.mark,x=this.aux;let i=this.n*3,c=this.n*4;a[i]=e[0],a[i+1]=e[1],a[i+2]=e[2],a[i+3]=o[0],a[i+4]=o[1],a[i+5]=o[2],a[i+6]=t[0],a[i+7]=t[1],a[i+8]=t[2];for(let v=0;v<3;v++,i+=3,c+=4)r[i]=s[0],r[i+1]=s[1],r[i+2]=s[2],u[c]=d[0],u[c+1]=d[1],u[c+2]=d[2],u[c+3]=d[3],l[c]=x[0],l[c+1]=x[1],l[c+2]=x[2],l[c+3]=x[3];this.n+=3}quad(e,o,t,s,a){this.tri(e,o,t,a),this.tri(e,t,s,a)}boxM(e,o){const t=[],s=e.elements;for(const a of[-.5,.5])for(const r of[-.5,.5])for(const u of[-.5,.5])t.push([s[0]*u+s[4]*r+s[8]*a+s[12],s[1]*u+s[5]*r+s[9]*a+s[13],s[2]*u+s[6]*r+s[10]*a+s[14]]);for(const a of q)this.quad(t[a[0]],t[a[1]],t[a[2]],t[a[3]],o)}box(e,o,t,s,a,r,u,l=0,d=0){this.boxM(T.compose(U.set(e,o,t),K.setFromEuler(j.set(0,l,d,"YZX")),X.set(s,a,r)),u)}beam(e,o,t,s,a){const r=new h.Vector3(e[0],e[1],e[2]),u=new h.Vector3(o[0],o[1],o[2]),l=u.clone().sub(r),d=l.length();l.normalize();const x=new h.Vector3(0,1,0).cross(l);x.lengthSq()<1e-6&&x.set(1,0,0),x.normalize();const i=l.clone().cross(x).normalize();this.boxM(T.makeBasis(l.clone().multiplyScalar(d),i.multiplyScalar(s),x.multiplyScalar(t)).setPosition(r.add(u).multiplyScalar(.5)),a)}prism(e,o,t,s,a,r=a,u=!0){const l=e.length;let d=0,x=0;for(const[i,c]of e)d+=i/l,x+=c/l;for(let i=0;i<l;i++){const[c,v]=e[i],[g,b]=e[(i+1)%l];this.quad(s(c,v,o),s(g,b,o),s(g,b,t),s(c,v,t),a),u&&(this.tri(s(d,x,o),s(c,v,o),s(g,b,o),r),this.tri(s(d,x,t),s(c,v,t),s(g,b,t),r))}}cyl(e,o,t,s,a){const r=new h.Vector3(e[0],e[1],e[2]),u=new h.Vector3(o[0],o[1],o[2]),l=u.clone().sub(r).normalize(),d=new h.Vector3(0,1,0).cross(l);d.lengthSq()<1e-6&&d.set(1,0,0),d.normalize();const x=l.clone().cross(d),i=f=>Array.from({length:s},(y,W)=>{const M=W/s*Math.PI*2,k=Math.cos(M)*t,B=Math.sin(M)*t;return[f.x+d.x*k+x.x*B,f.y+d.y*k+x.y*B,f.z+d.z*k+x.z*B]}),c=i(r),v=i(u),g=[r.x,r.y,r.z],b=[u.x,u.y,u.z];for(let f=0;f<s;f++){const y=(f+1)%s;this.quad(c[f],c[y],v[y],v[f],a),this.tri(g,c[f],c[y],a),this.tri(b,v[f],v[y],a)}}lump(e,o,t,s,a,r){const u=t.range(.7,1.35),l=t.range(.5,1),d=t.range(.7,1.35),x=o/1.902,i=$.map(f=>{const y=t.range(.62,1.28);return[e[0]+f[0]*x*u*y,e[1]+f[1]*x*l*y,e[2]+f[2]*x*d*y]}),c=t.range(.8,1.15),v=[s[0]*c,s[1]*c,s[2]*c],g=this.mark,b=this.aux;a&&(this.mark=a),r&&(this.aux=r);for(const f of G)this.tri(i[f[0]],i[f[1]],i[f[2]],v);this.mark=g,this.aux=b}geometry(){const e=new h.BufferGeometry,o=this.n;return e.setAttribute("position",new h.BufferAttribute(this.P.slice(0,o*3),3)),e.setAttribute("color",new h.BufferAttribute(this.C.slice(0,o*3),3)),e.setAttribute("mark",new h.BufferAttribute(this.M.slice(0,o*4),4)),e.setAttribute("aux",new h.BufferAttribute(this.A.slice(0,o*4),4)),e}mesh(e,o={}){const t=new h.Mesh(this.geometry(),o.material||V(e,o));return t.frustumCulled=!1,t}get triangles(){return this.n/3}}const T=new h.Matrix4,U=new h.Vector3,K=new h.Quaternion,j=new h.Euler,X=new h.Vector3;export{w as BOOM,S as BRIDGE,he as BRIGHT,re as C,xe as DARK,le as EARTH,Z as G,ve as GLASS,L as GLSL_CLOCK,H as GLSL_COMMON,P as GLSL_MOTION_DEFAULT,R as GLSL_SHADE,I as GLSL_SURFACE_DEFAULT,ce as GREY,Ce as Geo,Q as HARVEST,se as HEAP,de as HOLLOW,C as MAX_BOXES,z as MAX_CAPS,Y as N_BUCKETS,ue as OXIDE,fe as PALE,ae as ROUTE,ne as SPEED,oe as SPOUT,ie as STEEL,O as SUN,m as WHEEL,A as WHEEL_PERIOD,_ as ZC,ge as addShadowBox,be as addShadowCap,ee as beltY,J as boomBot,D as boomTop,te as bridgeY,me as fixedRng,V as makeMaterial,ye as makeUniforms,pe as namedRng,we as turnedAt,F as wheelAngle};
