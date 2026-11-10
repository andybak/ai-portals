import*as e from"three";import{mergeGeometries as Zt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as j,lerp as Mt,smoothstep as G}from"../kit/core.js";const ve=["#EFE6D2","#C8A77E","#6A4A33","#8E9296","#22406F","#5F88B6","#B8382A"],Qt="#2A2522",Vt="#B98B55",At="#7A5230",vo="#D9C7A0",fe={uniforms:{uTime:{value:0},uExposure:{value:1},uSunDir:{value:new e.Vector3(.82,.44,.37).normalize()},uWind:{value:new e.Vector3(-.45,0,-.9).normalize()},uGale:{value:1},uFuzz:{value:1},uPale:{value:new e.Vector2(.5,2400)},uCream:{value:new e.Color(ve[0])},uCool:{value:new e.Color("#DCE6EE")},uPxS:{value:.0027}}},Kt=`
  uniform float uExposure;
  vec3 toScene(vec3 D){ return clamp(D, 0., 1.); }`,Jt=`
  ${Kt}
  uniform float uTime, uGale, uFuzz;
  uniform vec3 uSunDir, uWind, uCream, uCool;
  uniform vec2 uPale;
  const float TAU = 6.2831853;
  float hash11(float n){ return fract(sin(n*127.1 + 3.7)*43758.5453); }
  float hash21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
  float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
  // gusts: a travelling 0..1 field over the ground, used by every loose thing
  float gust(vec3 wp){ return 0.5 + 0.5*sin(dot(wp.xz, uWind.xz)*0.045 - uTime*2.3 + sin(wp.x*0.021 + uTime*0.7)*1.7); }
  float knitAt(vec2 cell, float pat){
    if (pat < 0.5) return 1.;
    if (pat < 1.5) return mod(cell.y, 2.) < 1. ? 1. : 0.;
    if (pat < 2.5) return mod(cell.x, 4.) < 2. ? 1. : 0.;
    if (pat < 3.5) return mod(cell.x + cell.y, 2.) < 1. ? 1. : 0.;
    if (pat < 4.5) return mod(cell.x, 2.) < 1. ? 1. : 0.;
    return 0.;
  }
  // one yarn segment: xy = offset from the yarn's centre line / r, z = roundness (0 outside), w = 0..1 along
  vec4 yarnSeg(vec2 p, vec2 a, vec2 b, float r){
    vec2 pa = p - a, ba = b - a; float t = clamp(dot(pa, ba)/max(dot(ba, ba), 1e-5), 0., 1.);
    vec2 o = (pa - ba*t)/r; float d2 = dot(o, o);
    return vec4(o, sqrt(max(1. - d2, 0.)), t);
  }
  vec4 stitchField(vec2 uv, float pat, float r){
    vec2 fw2 = fwidth(uv); float fw = max(fw2.x, fw2.y);
    float flat_ = smoothstep(0.16, 0.36, fw);
    vec2 cell = floor(uv), f = fract(uv);
    float k = knitAt(cell, pat), ka = knitAt(cell + vec2(0., 1.), pat);
    vec4 best = vec4(0.); float ply = 0.;
    if (k > 0.5) {
      vec4 s; float sg;
      s = yarnSeg(f, vec2(0.5, -0.32), vec2(0.14, 0.78), r); if (s.z > best.z) { best = s; ply = s.w*2.6 + s.x*0.35; }
      s = yarnSeg(f, vec2(0.5, -0.32), vec2(0.86, 0.78), r); if (s.z > best.z) { best = s; ply = s.w*2.6 - s.x*0.35; }
      if (ka > 0.5) {
        s = yarnSeg(f, vec2(0.5, 0.68), vec2(0.14, 1.78), r); if (s.z >= best.z*0.9 && s.z > 0.) { best = s; ply = s.w*2.6 + s.x*0.35; }
        s = yarnSeg(f, vec2(0.5, 0.68), vec2(0.86, 1.78), r); if (s.z >= best.z*0.9 && s.z > 0.) { best = s; ply = s.w*2.6 - s.x*0.35; }
      }
    } else {
      vec4 s;
      s = yarnSeg(f, vec2(-0.08, 0.52), vec2(0.5, 0.80), r); if (s.z > best.z) { best = s; ply = s.w*1.6 + s.y*0.35; }
      s = yarnSeg(f, vec2(1.08, 0.52), vec2(0.5, 0.80), r); if (s.z > best.z) { best = s; ply = s.w*1.6 - s.y*0.35; }
      s = yarnSeg(f, vec2(0.0, 0.30), vec2(0.5, 0.04), r); if (s.z > best.z) { best = s; ply = s.w*1.6 + s.y*0.35 + 0.5; }
      s = yarnSeg(f, vec2(1.0, 0.30), vec2(0.5, 0.04), r); if (s.z > best.z) { best = s; ply = s.w*1.6 - s.y*0.35 + 0.5; }
    }
    float gap = 1. - smoothstep(0., 0.45, best.z);                       // between the yarns: deepest dye-lot
    float twist = smoothstep(0.55, 0.95, abs(sin(ply*TAU)))*(1. - smoothstep(0.3, 0.7, fw*2.5))*0.45*step(0.001, best.z);
    float rec = max(gap, twist) + (1. - k)*0.18;
    vec4 o = vec4(best.z, clamp(rec, 0., 1.), best.xy*(1. - best.z*0.35));
    float fx = smoothstep(0.16, 0.36, fw2.x), fy = smoothstep(0.16, 0.36, fw2.y);
    float wk = (pat < 0.5 || (pat > 1.5 && pat < 2.5) || (pat > 3.5 && pat < 4.5)) ? k : 0.;
    vec4 flatA = vec4(0.62, 0.20 + (1. - k)*0.12, 0., 0.);
    vec4 wale = vec4(0.62, 0.17 + (1. - k)*0.12 + 0.55*wk*(1. - smoothstep(0.03, 0.2, min(f.x, 1. - f.x))), 0., 0.);
    vec4 rowp = vec4(0.62, 0.17 + (1. - k)*0.12 + 0.4*(1. - smoothstep(0.06, 0.26, abs(f.y - (k > 0.5 ? 0.78 : 0.55)))), 0., 0.);
    return mix(mix(o, wale, fy), mix(rowp, flatA, fy), fx);
  }
  float yarnPly(vec2 uvTube, float plies){
    float fw = fwidth(uvTube.x)*plies*0.5 + fwidth(uvTube.y)*plies;
    float s = abs(sin((uvTube.y*plies + uvTube.x*0.55)*3.14159265));
    return (1. - smoothstep(0.0, 0.5, s))*(1. - smoothstep(0.25, 0.6, fw))*0.75;
  }
  // Nr = the normal the fuzz halo is judged by (the fabric's own, not each strand's, so dark wool stays dark)
  vec3 woolShadeR(vec3 base, vec3 N, vec3 Nr, vec3 V, float rec, float dist){
    float nl = dot(N, uSunDir), wrap = clamp(nl*0.5 + 0.5, 0., 1.);
    vec3 shade = base*(0.60 + 0.12*uCool)*uCool;                       // shade side: same wool, a lot deeper and cooler
    vec3 deep = base*base*0.55 + base*0.22;                            // recess: two shades deeper, a little richer
    vec3 c = mix(shade, base, smoothstep(0.30, 0.72, wrap));
    c = mix(c, deep, clamp(rec, 0., 1.)*0.85);
    float e = 1. - abs(dot(Nr, V)); float rim = e*e*e;
    c = mix(c, mix(base, uCream, 0.6), clamp(rim*(0.15 + 0.85*wrap)*0.6*uFuzz, 0., 0.8));   // fuzz halo, strongest toward the light
    float pale = uPale.x*(1. - exp(-dist/max(uPale.y, 1.)));
    return mix(c, uCream, pale);
  }
  vec3 woolShade(vec3 base, vec3 N, vec3 V, float rec, float dist){ return woolShadeR(base, N, N, V, rec, dist); }
  // a real yarn tube: ply twist in the recess, and the halo only when the tube is wide enough on screen to have an edge
  vec3 yarnShade(vec3 base, vec3 N, vec3 V, vec2 uvTube, float plies, float dist){
    float thin = smoothstep(0.08, 0.3, fwidth(uvTube.y));
    vec3 nr = mix(N, V, thin); nr = nr/max(length(nr), 1e-4);
    vec3 nd = mix(N, uSunDir, thin*0.65); nd = nd/max(length(nd), 1e-4);      // a thin yarn is its pigment, not its shaded side
    return woolShadeR(base, nd, nr, V, yarnPly(uvTube, plies)*(1. - thin), dist);
  }
`,eo=`
  uniform float uTime, uGale, uFuzz;
  uniform vec3 uWind;
  const float TAU = 6.2831853;
  float hash11(float n){ return fract(sin(n*127.1 + 3.7)*43758.5453); }
  float gust(vec3 wp){ return 0.5 + 0.5*sin(dot(wp.xz, uWind.xz)*0.045 - uTime*2.3 + sin(wp.x*0.021 + uTime*0.7)*1.7); }
`,to=`
  vec3 fabricShade(vec3 base, vec2 uvSt, float pat, float r, vec3 N, vec3 wp, float extraRec){
    vec4 st = stitchField(uvSt, pat, r);
    vec3 dp1 = dFdx(wp), dp2 = dFdy(wp); vec2 d1 = dFdx(uvSt), d2 = dFdy(uvSt);
    vec3 T = dp1*d2.y - dp2*d1.y, B = dp2*d1.x - dp1*d2.x;
    float inv = 1./max(sqrt(max(dot(T, T), dot(B, B))), 1e-6); T *= inv; B *= inv;
    vec3 n = N*max(st.x, 0.3) + (T*st.z + B*st.w)*0.9;
    n = n/max(length(n), 1e-4);
    vec3 V = cameraPosition - wp; float dist = length(V); V = V/max(dist, 1e-4);
    vec3 nr = N*0.75 + n*0.25; nr = nr/max(length(nr), 1e-4);
    return woolShadeR(base, n, nr, V, clamp(st.y + extraRec, 0., 1.), dist);
  }
`,oo=(n={})=>({...fe.uniforms,...n});function L({vertexShader:n,fragmentShader:s,uniforms:r={},...f}){return new e.ShaderMaterial({uniforms:oo(r),vertexShader:eo+n,fragmentShader:Jt+to+s,...f})}function fo({pattern:n=0,stitch:s=[1.5,1.2],yarn:r=.2,color:f=ve[3],stripe:a=[0,0],stripeColor:u=ve[0],scroll:m=0,vertexColors:y=!1,side:i=e.FrontSide}={}){return L({side:i,uniforms:{uPat:{value:n},uStitch:{value:new e.Vector2(s[0],s[1])},uYarn:{value:r},uColor:{value:new e.Color(f)},uStripe:{value:new e.Vector2(a[0],a[1])},uStripeCol:{value:new e.Color(u)},uScroll:{value:m},uVC:{value:y?1:0}},vertexShader:`
      attribute vec3 color; varying vec3 vW, vN, vC; varying vec2 vUv;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix)*normal; vC = color; vUv = uv;
        gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      uniform float uPat, uYarn, uScroll, uVC; uniform vec2 uStitch, uStripe; uniform vec3 uColor, uStripeCol;
      varying vec3 vW, vN, vC; varying vec2 vUv;
      void main(){
        vec2 st = vUv/max(uStitch, vec2(1e-3)); st.y -= uScroll*uTime;
        vec3 base = mix(uColor, vC, uVC);
        if (uStripe.x > 0.5 && mod(floor(st.y) + uStripe.y, uStripe.x) < 1.) base = uStripeCol;
        vec3 N = vN/max(length(vN), 1e-4); if (!gl_FrontFacing) N = -N;
        gl_FragColor = vec4(toScene(fabricShade(base, st, uPat, uYarn, N, vW, 0.)), 1.);
      }`})}function Pt(n,s=.8,r=6,f=!1){const a=n.length,u=r+1,m=new Float32Array(a*u*3),y=new Float32Array(a*u*3),i=new Float32Array(a*u*2),l=[],d=new e.Vector3,b=new e.Vector3,V=new e.Vector3,x=new e.Vector3,B=new e.Quaternion,z=new e.Vector3;let J=0;for(let w=0;w<a;w++){const we=n[f?(w-1+a)%a:Math.max(w-1,0)],ge=n[f?(w+1)%a:Math.min(w+1,a-1)];d.subVectors(ge,we),d.lengthSq()<1e-10&&d.set(0,1,0),d.normalize(),w===0?(b.set(0,1,0),Math.abs(d.y)>.9&&b.set(1,0,0),b.addScaledVector(d,-b.dot(d)).normalize()):(B.setFromUnitVectors(x,d),b.applyQuaternion(B),b.addScaledVector(d,-b.dot(d)).normalize(),J+=n[w].distanceTo(n[w-1])),V.crossVectors(d,b),x.copy(d);for(let p=0;p<u;p++){const N=p/r*Math.PI*2,ye=Math.cos(N),Y=Math.sin(N),F=(w*u+p)*3;z.copy(b).multiplyScalar(ye).addScaledVector(V,Y),y[F]=z.x,y[F+1]=z.y,y[F+2]=z.z,m[F]=n[w].x+z.x*s,m[F+1]=n[w].y+z.y*s,m[F+2]=n[w].z+z.z*s,i[(w*u+p)*2]=J/(s*2),i[(w*u+p)*2+1]=p/r}if(w<a-1)for(let p=0;p<r;p++){const N=w*u+p;l.push(N,N+u,N+1,N+1,N+u,N+u+1)}}const q=new e.BufferGeometry;return q.setAttribute("position",new e.BufferAttribute(m,3)),q.setAttribute("normal",new e.BufferAttribute(y,3)),q.setAttribute("uv",new e.BufferAttribute(i,2)),q.setIndex(l),q}function po({color:n=ve[4],plies:s=3,slide:r=0,vertexColors:f=!1}={}){return L({uniforms:{uColor:{value:new e.Color(n)},uPlies:{value:s},uSlide:{value:r},uVC:{value:f?1:0}},vertexShader:`
      attribute vec3 color; uniform float uVC; uniform vec3 uColor; varying vec3 vW, vN, vC; varying vec2 vUv;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix)*normal; vUv = uv; vC = mix(uColor, color, uVC);
        gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      uniform float uPlies, uSlide; varying vec3 vW, vN, vC; varying vec2 vUv;
      void main(){ vec3 uColor = vC;
        vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
        gl_FragColor = vec4(toScene(yarnShade(uColor, N, V, vec2(vUv.x - uSlide*uTime, vUv.y), uPlies, dist)), 1.);
      }`})}function ao({color:n=Vt,dark:s=At}={}){return L({uniforms:{uColor:{value:new e.Color(n)},uDark:{value:new e.Color(s)}},vertexShader:`
      varying vec3 vW, vN, vO;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix)*normal; vO = position;
        gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      uniform vec3 uColor, uDark; varying vec3 vW, vN, vO;
      void main(){
        vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
        float ang = atan(vO.z, vO.y + 1e-5);
        float g = vnoise(vec2(vO.x*0.035, ang*2.2 + vO.x*0.004))*0.6 + vnoise(vec2(vO.x*0.11, ang*5.))*0.4;
        float streak = smoothstep(0.42, 0.62, g);
        float ringW = fwidth(vO.x)*0.9;
        float rings = (1. - smoothstep(0.08, 0.2, abs(fract(vO.x*0.22) - 0.5)))*(1. - smoothstep(0.25, 0.6, ringW));
        vec3 base = mix(uColor, uDark, streak*0.55 + rings*0.18);
        float wrap = clamp(dot(N, uSunDir)*0.5 + 0.5, 0., 1.);
        vec3 c = mix(base*0.52*uCool, base, smoothstep(0.34, 0.66, wrap));
        c = mix(c, base*1.18 + 0.03, smoothstep(0.86, 0.97, wrap)*0.5);            // a worn, polished lot; not a highlight
        float e = 1. - abs(dot(N, V)); c = mix(c, uDark*0.7, e*e*e*0.5);
        c = mix(c, uCream, uPale.x*(1. - exp(-dist/max(uPale.y, 1.))));
        gl_FragColor = vec4(toScene(c), 1.);
      }`})}function Nt(n){const s=n.length,r=new Float32Array(s*12),f=new Float32Array(s*12),a=new Float32Array(s*16),u=new Float32Array(s*12),m=new Uint32Array(s*6);for(let i=0;i<s;i++){const l=n[i],d=i*.61803%1;for(let b=0;b<4;b++){const V=(i*4+b)*3;r[V]=l.p.x,r[V+1]=l.p.y,r[V+2]=l.p.z,f[V]=l.n.x*l.len,f[V+1]=l.n.y*l.len,f[V+2]=l.n.z*l.len,u[V]=l.color.r,u[V+1]=l.color.g,u[V+2]=l.color.b;const x=(i*4+b)*4;a[x]=((b&1)-.5)*l.w,a[x+1]=b>>1,a[x+2]=d,a[x+3]=l.id??0}m.set([i*4,i*4+1,i*4+2,i*4+2,i*4+1,i*4+3],i*6)}const y=new e.BufferGeometry;return y.setAttribute("position",new e.BufferAttribute(r,3)),y.setAttribute("aDir",new e.BufferAttribute(f,3)),y.setAttribute("aCorner",new e.BufferAttribute(a,4)),y.setAttribute("aCol",new e.BufferAttribute(u,3)),y.setIndex(new e.BufferAttribute(m,1)),y}function Ft({anchor:n="vec3 fuzzAnchor(vec3 p, float id){ return p; }",uniforms:s={}}={}){return L({transparent:!0,depthWrite:!1,side:e.DoubleSide,uniforms:{uNearFade:{value:new e.Vector2(0,.001)},...s},vertexShader:`
      attribute vec3 aDir, aCol; attribute vec4 aCorner; uniform float uPxS; varying vec3 vC; varying vec3 vUvS; varying float vDist, vEnd;
      ${n}
      void main(){
        vec3 root = (modelMatrix*vec4(fuzzAnchor(position, aCorner.w), 1.)).xyz;
        vec3 d = mat3(modelMatrix)*aDir; float len = length(d);
        float g = gust(root + aCorner.z*40.);
        vec3 tip = d*uFuzz + uWind*len*uFuzz*(0.35 + 0.9*g)*uGale + vec3(0., sin(uTime*7. + aCorner.z*40.)*0.08*len, 0.);
        vec3 toCam = cameraPosition - root; vDist = length(toCam);
        tip *= min(1., vDist*uPxS*30./max(length(tip), 1e-4));                    // no hair longer than about 30 px, whatever the day
        vEnd = abs(dot(tip, toCam))/max(length(tip)*vDist, 1e-4);
        vec3 side = cross(tip, toCam); side = side/max(length(side), 1e-4);
        vec3 w = root + tip*aCorner.y + side*aCorner.x*(1. + 0.5*aCorner.y);
        vC = aCol; vUvS = vec3(aCorner.x/max(abs(aCorner.x)*2., 1e-4) + 0.5, aCorner.y, aCorner.z);
        gl_Position = projectionMatrix*viewMatrix*vec4(w, 1.);
      }`,fragmentShader:`
      uniform vec2 uNearFade; varying vec3 vC; varying vec3 vUvS; varying float vDist, vEnd;
      void main(){
        float x = vUvS.x*7. + vUvS.z*13., fx = fwidth(x);
        float hair = 1. - smoothstep(0.12, 0.42, abs(fract(x + sin(vUvS.y*5. + vUvS.z*30.)*0.25) - 0.5));
        float lenK = 0.45 + 0.55*hash11(floor(x) + vUvS.z*91.);
        hair *= 1. - smoothstep(lenK*0.55, lenK, vUvS.y);
        hair *= 1. - smoothstep(0.3, 0.8, fx);                                               // too fine to be hairs: nothing (never a veil)
        float a = hair*(1. - smoothstep(0.0, 1.0, vUvS.y)*0.5)*0.6*smoothstep(uNearFade.x, uNearFade.y, vDist)*(1. - smoothstep(0.3, 0.7, vEnd));
        vec3 c = mix(vC, uCream, 0.35 + 0.3*vUvS.y);
        c = mix(c, uCream, uPale.x*(1. - exp(-vDist/max(uPale.y, 1.))));
        gl_FragColor = vec4(toScene(c), a);
      }`})}const D=30,k=200,de=k/D,pe=-k/2,ro=5,P=192,he=3.9,no=.62,me=24,xe=`
  uniform float uClock, uXc; uniform vec2 uSlope; uniform vec3 uRows[${me}];
  const float PITCH = ${de.toFixed(5)}, X0 = ${pe.toFixed(1)}, ROWH = ${ro.toFixed(1)}, CY = ${P.toFixed(1)}, ZOFF = ${he.toFixed(2)}, HOPAT = ${no.toFixed(2)};
  float ribX(float i){ return X0 + (i + 0.5)*PITCH; }
  // centre line of the needle holding the fabric at local x: the left needle left of the crossing, the right one right
  vec3 needleAt(float x){ float d = x - uXc, a = abs(d);
    return vec3(x, CY + uSlope.x*a, mix(-ZOFF, ZOFF, smoothstep(-5., 5., d)) - uSlope.y*a); }
  // CASTING OFF. The piece is finished: its rows stand still. The crossing travels once, right to left; rib i's loop
  // is passed over and let go at clock 29 - i + HOPAT. castAt < 0: still a live loop on the left needle.
  float castAt(float i){ return uClock - (29. - i + HOPAT); }
  float sinceHop(float i){ float c = castAt(i); return c < 0. ? 99. : c; }
  float rowsOf(float i, float delay){ return 40.; }
  // the top of the fabric at local x: left of the crossing it hangs 10.5 m under the left needle on its live loops;
  // right of it the cast-off chain hangs free, drooping from the last worked loop down to the selvedge
  vec3 topAt(float x){ float d = x - uXc, a = abs(d), off = smoothstep(0., 9., d); vec3 n = needleAt(x);
    n.y -= 10.5 + off*(1.5 + 0.1*a); n.z = mix(n.z, 1.2 - 0.3*uSlope.y*a, off); return n; }
  // the headland is a landform, not a flat cloth: it bellies seaward toward its foot and its ends wrap back
  float landZ(float x, float depth){
    float sd = clamp(depth/190., 0., 1.), xn = clamp((x - X0)/${(k/2).toFixed(1)} - 1., -1., 1.);
    float belly = sd*sqrt(sd)*46. + 12.*smoothstep(0.82, 1., sd);
    float lump = 7.*sin(x*0.045 + 1.3)*sin(depth*0.031 + x*0.012)*sd + 4.*sin(x*0.11 + depth*0.05)*sd;
    return belly*(1. - 0.5*xn*xn) - 26.*xn*xn*smoothstep(0., 0.6, sd) + lump;
  }
  vec3 rowColor(float r){ int k = int(mod(floor(r), ${me}.)); return uRows[clamp(k, 0, ${me-1})]; }
`;function io(n){const s=j(n,0,29.999),r=Math.floor(s),f=s-r,a=G(.42,.82,f),u=29-r;return{xc:pe+(u+1-a)*de,w:u,f,back:!1,row:0}}function kt(n,s){const r=j(s/190,0,1),f=j((n-pe)/(k/2)-1,-1,1),a=r*Math.sqrt(r)*46+12*G(.82,1,r),u=7*Math.sin(n*.045+1.3)*Math.sin(s*.031+n*.012)*r+4*Math.sin(n*.11+s*.05)*r;return a*(1-.5*f*f)-26*f*f*G(0,.6,r)+u}function so(n){const f=[],a=(i,l)=>f.push(new e.Vector2(i,l));a(0,0),a(.28,.15),a(.62,1),a(1,3.2),a(1.7,9),a(2.5,17),a(3.1,25),a(3.42,33),a(3.5,40);for(let i=1;i<=8;i++)a(3.5,40+i/8*244);const u=n.int(0,2),m=n.range(7.2,8.6);if(a(3.5,285.5),a(3,286.3),a(3,287),a(4.5,287.8),a(4.7,288.6),a(4.5,289.4),a(3.1,290.1),a(3.1,290.8),u===0)for(let i=0;i<=10;i++){const l=-1.15+i/10*(Math.PI/2+1.15);a(Math.max(Math.cos(l)*m,.01),297+Math.sin(l)*m)}else u===1?(a(5.6,291.6),a(m,293.5),a(m+.5,295.5),a(m,297.3),a(5.8,298.6),a(4.6,299.2),a(4.2,300.6),a(3,303),a(1.4,304.6),a(.01,305)):(a(m+1.2,291.8),a(m+1.8,292.8),a(m+1.8,294.6),a(m+1,295.6),a(4.2,296.4),a(3.6,297.6),a(4.4,299.4),a(3.4,301.2),a(1.6,302.2),a(.01,302.5));const y=new e.LatheGeometry(f,22);return y.rotateZ(-Math.PI/2),y}async function ho(n,s={}){const r=n.rng,f=j(s.detail??n.quality?.detail??1,.6,1),a=(s.palette&&s.palette.length>=7?s.palette:ve).map(t=>new e.Color(t)),[u,m,y,i,l,d,b]=a,V=new e.Color(Qt);fe.uniforms.uCream.value.copy(u);const x=new e.Group;x.name="the-needles";const B=-r.range(.24,.29),z=r.range(.27,.33),J=72,q=[[Vt,At],["#C9A46A","#8A6238"],["#A8744A","#6B4429"]],w=r.pick(q),we=[[l,i],[l,i],[l,i],[i,i],[i,i],[l,l],[l,d],[i,d],[y,i],[i,u]],ge=[];{let t=0;for(;t<me;){const o=t===0?we[0]:r.pick(we),c=Math.min(me-t,o[0]===o[1]?2*r.int(1,2):2*r.int(1,3));for(let v=0;v<c;v++)ge.push(o[(t+v)%2].clone());t+=c}}const p={uClock:{value:0},uXc:{value:0},uSlope:{value:new e.Vector2(B,z)},uRows:{value:ge},uDrop:{value:new e.Vector2(-9,0)}};await n.yield();const N=so(r),ye=ao({color:w[0],dark:w[1]}),Y=new e.Mesh(N,ye),F=new e.Mesh(N,ye);Y.frustumCulled=F.frustumCulled=!1;const Oe=new e.Vector3(-1,B,-z).normalize(),be=new e.Vector3(1,B,-z).normalize(),lo=1/Math.abs(Oe.x);Y.quaternion.setFromUnitVectors(new e.Vector3(1,0,0),Oe),F.quaternion.setFromUnitVectors(new e.Vector3(1,0,0),be),x.add(Y,F),await n.yield();const Se=8,ee=56,Qe=D*(Se+1)*(ee+1),Ue=new Float32Array(Qe*3),Ke=new Float32Array(Qe),Je=[];for(let t=0,o=0;t<D;t++)for(let c=0;c<=Se;c++)for(let v=0;v<=ee;v++,o++)if(Ue[o*3]=pe+(t+c/Se)*de,Ue[o*3+1]=Math.pow(v/ee,.8),Ke[o]=t,c<Se&&v<ee){const g=o,A=o+ee+1;Je.push(g,A,g+1,g+1,A,A+1)}await n.yield();const Ce=new e.BufferGeometry;Ce.setAttribute("position",new e.BufferAttribute(Ue,3)),Ce.setAttribute("aRib",new e.BufferAttribute(Ke,1)),Ce.setIndex(Je);const Tt=L({side:e.DoubleSide,uniforms:{...p,uHem:{value:u},uBack:{value:i.clone().lerp(l,.35)}},vertexShader:xe+`
      attribute float aRib; varying vec3 vW; varying vec2 vSt; varying float vHem, vTug, vDepth, vCast;
      void main(){
        float x = position.x, t = position.y; vCast = smoothstep(-1., 2.5, x - uXc);
        vec3 top = topAt(x);
        float sh = sinceHop(aRib);
        float foot = 2.6 + 0.9*sin(uTime*0.9 + aRib*0.7);                   // the finished hem laps in the surf
        float depth = (1. - t)*(top.y - foot), y = top.y - depth;
        float rc = (x - X0)/PITCH, prof = cos(3.14159265*(rc - 0.5)); prof = prof/(0.35 + 0.65*abs(prof));
        float hang = 1. - smoothstep(0., 150., depth);
        float tg = sh - depth/140., tug = smoothstep(0., 0.1, tg)*(1. - smoothstep(0.1, 0.7, tg));
        float free = smoothstep(0., 70., depth)*(1. - 0.6*smoothstep(120., 190., depth));
        float z = top.z*hang + landZ(x, depth) + 2.5*prof + 2.2*tug + (gust(vec3(x*1.4 + y*0.9, 0., y*1.7)) - 0.5)*3.2*free*uGale;
        vSt = vec2(rc, rowsOf(aRib, depth/140.) - depth/ROWH); vHem = y - foot; vTug = tug; vDepth = depth;
        vec4 w = modelMatrix*vec4(x, y, z, 1.); vW = w.xyz;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:xe+`
      uniform vec3 uHem, uBack; uniform vec2 uDrop; varying vec3 vW; varying vec2 vSt; varying float vHem, vTug, vDepth, vCast;
      void main(){
        // the dropped stitch: one rib laddered from the needle down to uDrop.y, only slack rungs left
        float inDrop = step(uDrop.x - 0.2, vSt.x)*step(vSt.x, uDrop.x + 1.2)*step(4.5, vDepth)*step(vDepth, uDrop.y);
        float rung = abs(fract(vDepth/ROWH + 0.18*sin((vSt.x - uDrop.x)*3.14159265)) - 0.5);
        if (inDrop > 0.5 && rung > 0.15) discard;
        vec3 N = cross(dFdx(vW), dFdy(vW)); N = N/max(length(N), 1e-6);
        vec3 V = cameraPosition - vW; if (dot(N, V) < 0.) N = -N;
        float prof = cos(3.14159265*(vSt.x - 0.5));
        float hemTop = 15. + 2.2*sin(vSt.x*TAU*0.5 + 1.), hem = 1. - smoothstep(hemTop - 0.6, hemTop + 0.6, vHem);
        bool isHem = hem > 0.5;
        vec2 uvS = isHem ? vec2(vSt.x*2., vHem/2.4) : vSt;
        vec3 base = isHem ? uHem : rowColor(vSt.y);
        if (inDrop > 0.5) base = mix(base, uHem, 0.35);
        if (!gl_FrontFacing) base = mix(base, uBack, 0.35);
        float groove = (1. - smoothstep(-0.7, 0.3, prof))*0.3;
        vec3 c = fabricShade(base, uvS, isHem ? 1. : 4., isHem ? 0.24 : 0.2, N, vW, groove + (isHem ? 0. : 0.));
        c = mix(c, c*1.06 + 0.02, vTug*0.5);
        // the outline is stitches too: scalloped selvedges and hem, and the live top row is open loops
        vec4 sf = stitchField(uvS, isHem ? 1. : 4., isHem ? 0.24 : 0.2);
        float edgeX = min(vSt.x, ${D}. - vSt.x), sc = 0.10*(0.5 + 0.5*sin(vSt.y*TAU));
        if (edgeX < sc || vHem < 0.9*(0.5 + 0.5*cos(vSt.x*TAU*2.)) || (vDepth < 4.5 && sf.x < 0.05 && vCast < 0.5)) discard;
        gl_FragColor = vec4(toScene(c), 1.);
      }`}),et=new e.Mesh(Ce,Tt);et.frustumCulled=!1,x.add(et),await n.yield();const _=4.5,ze=[];for(let t=0;t<9;t++){const o=t/9;ze.push(new e.Vector3(-1.6+o*.5,-11.8+o*(11.8+_*Math.cos(2.5)),.5+o*(_*Math.sin(2.5)-.5)-Math.sin(o*Math.PI)*.5))}for(let t=0;t<=28;t++){const o=2.5-t/28*5;ze.push(new e.Vector3(-1.1+t/28*2.2,_*Math.cos(o),_*Math.sin(o)))}for(let t=1;t<=9;t++){const o=1-t/9;ze.push(new e.Vector3(1.6-o*.5,-11.8+o*(11.8+_*Math.cos(2.5)),-.5-o*(_*Math.sin(2.5)-.5)+Math.sin(o*Math.PI)*.5))}const tt=Pt(ze,.82,6),te=new e.InstancedBufferGeometry;te.index=tt.index;for(const t of["position","normal","uv"])te.setAttribute(t,tt.getAttribute(t));te.setAttribute("aRib",new e.InstancedBufferAttribute(Float32Array.from({length:D},(t,o)=>o),1)),te.instanceCount=D;const ot=`
    // where a point of loop i (in the loop's own frame: needle along x, ring in yz, feet at y = -11.8) is now
    uniform float uPx; uniform vec3 uCamL;
    vec3 loopPoint(vec3 p, float i){
      float x = ribX(i), d = x - uXc, near = exp(-d*d/34.), up = smoothstep(-11.8, -3., p.y);
      float far = clamp(distance(needleAt(x), uCamL)/300., 0., 1.6);          // the loop in mid-hop is drawn out further the further off we are
      float sh = sinceHop(i), snug = smoothstep(0.05, 0.3, sh)*(1. - smoothstep(0.3, 0.9, sh));
      float big = clamp(distance(needleAt(x), uCamL)*uPx*1.45, 1., 1.9);      // from far off a loop is drawn large enough to count
      p.x += 0.8*p.z*up*big;                                // a stitch sits slanted on its needle, so it shows as a coil
      p.yz *= mix(1., big*(1. + (0.5 + 0.5*far)*near*near - 0.07*snug), up);
      p.y += (7.5 + 7.*far)*near*near*up;                              // the one in mid-hop is plainly lifted between the points
      p.x += (smoothstep(-5., 5., d)*2. - 1.)*uSlope.x*p.y*0.5;
      return needleAt(x) + p;
    }
    // ... and once it has been passed over it is laid down along the edge as one link of the cast-off chain
    vec3 loopNow(vec3 p, float i, out float cst){
      cst = smoothstep(0., 0.9, castAt(i));
      vec3 a = loopPoint(p, i);
      float x = ribX(i); vec2 dir = normalize(vec2(1., uSlope.x - 0.1));
      vec3 q = vec3(-(p.y + 3.6)*0.7, p.z*0.8, p.x*0.9 + 2.2);
      vec3 b = topAt(x) + vec3(dir.x*q.x - dir.y*q.y, dir.y*q.x + dir.x*q.y + 1.2, q.z);
      float arc = sin(3.14159265*cst);
      return mix(a, b, cst) + vec3(0., 6.*arc, 4.*arc);
    }`,He="varying vec3 vW, vN, vC; varying vec2 vUv;",Me={uPx:{value:.002},uCamL:{value:new e.Vector3}},at=`
    ${He} uniform float uPlies;
    void main(){
      vec3 N = vN/max(length(vN), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
      gl_FragColor = vec4(toScene(yarnShade(vC, N, V, vUv, uPlies, dist)), 1.);
    }`,rt=new e.Mesh(te,L({uniforms:{...p,...Me,uPlies:{value:3},uChain:{value:d.clone().lerp(u,.3)}},vertexShader:xe+ot+`
      attribute float aRib; uniform vec3 uCream, uChain; ${He}
      void main(){
        float fat = max(1., distance(needleAt(ribX(aRib)), uCamL)*uPx*1.6/0.82);      // the yarn never thinner than about 3 px
        float cst; vec4 w = modelMatrix*vec4(loopNow(position + normal*0.82*(fat - 1.), aRib, cst), 1.); vW = w.xyz; vUv = uv;
        vN = mat3(modelMatrix)*mix(normal, vec3(-normal.y, normal.z, normal.x), cst);
        vC = rowColor(rowsOf(aRib, 0.) + 0.5); vC = mod(aRib, 2.) < 0.5 ? vC*0.86 : mix(vC, uCream, 0.34);      // every other loop a paler lot: they can be counted
        vC = mix(vC, mod(aRib, 2.) < 0.5 ? uChain : mix(uChain, uCream, 0.45), cst);                              // the chain is the working yarn
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:at}));rt.frustumCulled=!1,x.add(rt),await n.yield();const oe=9,Ve=new e.Vector3(-193+r.range(-4,4),34,6+r.range(-6,6)),ae=64,Rt=8,O=[],E=[],re=[],Ae=[],ne=Ve.clone().add(new e.Vector3(14,ae+6,-3));O.push(new e.Vector3(0,P+5,0)),E.push(ne.clone()),re.push(new e.Vector4(11,0,.1,270)),Ae.push(d.clone().lerp(l,.35));for(let t=0;t<3;t++)O.push(new e.Vector3),E.push(new e.Vector3),re.push(new e.Vector4(t===2?2:4,t===2?1.6:4+t,.5,t===2?70:62-t*18)),Ae.push(b.clone());const Pe=[];for(let t=0;t<5;t++)Pe.push({x:r.range(-88,88),d:r.range(28,150),len:r.range(14,26)}),O.push(new e.Vector3),E.push(new e.Vector3),re.push(new e.Vector4(1.5,r.range(1.6,2.6),.45,Pe[t].len)),Ae.push(r.pick([l,i,d,u]).clone());const nt=[120,60,50,60,28,28,28,28,28],ie=6,Wt=nt.reduce((t,o)=>t+(o+1)*(ie+1),0),Ne=new Float32Array(Wt*3),it=[];for(let t=0,o=0;t<oe;t++)for(let c=0,v=nt[t];c<=v;c++)for(let g=0;g<=ie;g++,o++)if(Ne[o*3]=c/v,Ne[o*3+1]=g/ie*Math.PI*2,Ne[o*3+2]=t,c<v&&g<ie){const A=o,R=o+ie+1;it.push(A,R,A+1,A+1,R,R+1)}await n.yield();const Ge=new e.BufferGeometry;Ge.setAttribute("position",new e.BufferAttribute(Ne,3)),Ge.setIndex(it);const Z={uP0:{value:O},uP1:{value:E},uPar:{value:re},uCol:{value:Ae},uWindL:{value:new e.Vector3(0,0,1)},uPx:Me.uPx,uPlies:{value:3},uCamL:Me.uCamL},st=new e.Mesh(Ge,L({uniforms:{...p,...Z},vertexShader:`
      uniform vec3 uP0[${oe}], uP1[${oe}], uCol[${oe}], uWindL, uCamL; uniform vec4 uPar[${oe}]; uniform float uPx, uClock;
      ${He}
      vec3 curve(int k, float u){
        vec3 a = uP0[k], b = uP1[k]; vec4 par = uPar[k];
        vec3 p = mix(a, b, u); float bow = 4.*u*(1. - u), fk = float(k);
        vec3 ax = b - a; ax = ax/max(length(ax), 1e-3);
        vec3 sd = cross(ax, vec3(0., 1., 0.)); sd = sd/max(length(sd), 0.05); vec3 upv = cross(sd, ax);
        float g = gust(p + fk*37.);
        p.y -= par.x*bow*(1. - 0.12*g);
        p += uWindL*bow*par.x*(0.25 + 0.5*g)*uGale;
        float fl = par.y*u*(0.3 + 0.7*u);
        p += sd*sin(u*8. - uTime*6.1 + fk*1.7)*fl + upv*cos(u*6.3 - uTime*4.7 + fk)*fl*0.7;
        float s = u*par.w/${(de*2).toFixed(3)};
        p += (sd*sin(s*TAU) + upv*sin(s*TAU*0.5 + fk))*par.z*(0.6 + 0.4*sin(s*0.9 + fk*3.));
        return p;
      }
      void main(){
        int k = int(position.z + 0.5); float u = position.x;
        vec3 p = curve(k, u), t = curve(k, min(u + 0.004, 1.)) - curve(k, max(u - 0.004, 0.));
        t = t/max(length(t), 1e-4);
        vec3 n1 = cross(t, vec3(0.31, 0.9, 0.3)); n1 = n1/max(length(n1), 1e-3); vec3 n2 = cross(t, n1);
        vec3 nr = n1*cos(position.y) + n2*sin(position.y);
        float r = (k == 0 ? max(1.5, distance(p, uCamL)*uPx*2.2) : max(0.82, distance(p, uCamL)*uPx*0.9))*(k >= 4 ? 1.25 - 0.5*u : 1.);
        vec4 w = modelMatrix*vec4(p + nr*r, 1.); vW = w.xyz; vN = mat3(modelMatrix)*nr; vC = uCol[k];
        float run = k == 0 ? uTime*7. : 0.;                              // the working yarn runs from the ball to the needle
        vUv = vec2(u*uPar[k].w/(k == 0 ? 3.0 : 1.64) + run, position.y/TAU);
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:at}));st.frustumCulled=!1,x.add(st),await n.yield();const U=new e.Group;U.position.copy(Ve),x.add(U);const lt=new e.Mesh(new e.SphereGeometry(ae-6,40,24),L({uniforms:{uCol:{value:l.clone().lerp(d,.45).multiplyScalar(.84)},uRot:{value:new e.Matrix3}},vertexShader:`
      varying vec3 vW, vO;
      void main(){ vO = position; vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      uniform vec3 uCol; uniform mat3 uRot; varying vec3 vW, vO;
      void main(){      // what shows in the chinks between belts: the yarn wound underneath, a deeper lot
        vec3 n = vO/max(length(vO), 1e-4); float c = dot(n, vec3(0.42, 0.56, 0.71))*${(ae/Rt).toFixed(2)}, fw = fwidth(c);
        float gap = (1. - smoothstep(0.1, 0.3 + fw, abs(fract(c) - 0.5)))*(1. - smoothstep(0.25, 0.6, fw));
        vec3 N = uRot*n; vec3 V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
        vec3 Nr = mix(N, V, 0.65); Nr = Nr/max(length(Nr), 1e-4);
        gl_FragColor = vec4(toScene(woolShadeR(uCol*(0.92 + 0.16*hash11(floor(c))), N, Nr, V, 0.2 + 0.5*gap, dist)), 1.);
      }`}));U.add(lt),await n.yield();const Lt=[[-.48,.46,.75],[.92,.33,.2],[.36,-.28,.89],[-.86,.5,-.14],[.6,-.6,-.5],[.1,.95,.3],[-.7,-.2,.68],[.52,.72,-.46],[-.24,.3,-.92]],ct=9,ut=[16,7,6,6,6,6,5,5,4],Dt=[0,.2,.3,-.3,.35,-.2,.25,.4,-.45],Bt=new e.Quaternion().setFromEuler(new e.Euler(r.range(-.3,.3),r.range(0,Math.PI*2),r.range(-.3,.3))),Q=t=>l.clone().lerp(d,t),Ot=[Q(.36),Q(.62),Q(.86),Q(.28),Q(.74),Q(.48),d.clone().lerp(u,.06)],Ut=r.int(0,6),_e=[],Ee=[],Fe=[];for(const t of[16,10,9,8,6,5,4]){Fe.push(r.range(0,6.28)/6.28);for(let o=0;o<t;o++)Fe.push(r.range(-.5,.5)+.5,r())}let Ht=0;const Ie=()=>Fe[Ht++%Fe.length];for(let t=0;t<ct;t++){const o=new e.Vector3(...Lt[t]).normalize().applyQuaternion(Bt),c=t>=ct-2,v=ae-2+t*1.2+(c?.7:0),g=c?4.2:4,A=c?.6:.42,R=new e.Vector3(.3,.9,.31).cross(o).normalize(),se=o.clone().cross(R),Re=2*g*.96/v,S=Ot[(Ut+t*3)%7],M=Ie()*6.28;for(let X=0;X<ut[t];X++){const jt=Dt[t]+(X-(ut[t]-1)/2)*Re,le=52,K=[],je=[],Yt=v+(Ie()-.5)*.8;for(let h=0;h<=le;h++){const H=h%le/le*Math.PI*2,W=j(jt+.016*Math.sin(2*H+M)+.008*Math.sin(5*H+M*3+X),-.985,.985),ue=Math.sqrt(1-W*W),Be=o.clone().multiplyScalar(W).addScaledVector(R,Math.cos(H)*ue).addScaledVector(se,Math.sin(H)*ue);je.push(Be),K.push(Be.clone().multiplyScalar(Yt))}const bt=8,ce=Pt(K,g,bt),Ye=ce.getAttribute("position"),We=Ye.count,Le=new Float32Array(We*3),De=new Float32Array(We*3),St=new Float32Array(We),Ze=.93+.14*Ie(),$=new e.Vector3,Ct=new e.Vector3,zt=new e.Vector3;for(let h=0;h<We;h++){const H=Math.floor(h/(bt+1)),W=je[H],ue=K[H];$.fromBufferAttribute(Ye,h).sub(ue),Ct.subVectors(K[Math.min(H+1,le)],K[Math.max(H-1,0)]),zt.crossVectors(Ct,W).normalize(),St[h]=$.dot(zt)/g;const Be=$.dot(W);$.addScaledVector(W,Be*(A-1)).add(ue),Ye.setXYZ(h,$.x,$.y,$.z),Le[h*3]=S.r*Ze,Le[h*3+1]=S.g*Ze,Le[h*3+2]=S.b*Ze,De[h*3]=W.x,De[h*3+1]=W.y,De[h*3+2]=W.z}if(ce.setAttribute("color",new e.BufferAttribute(Le,3)),ce.setAttribute("aRad",new e.BufferAttribute(De,3)),ce.setAttribute("aLat",new e.BufferAttribute(St,1)),_e.push(ce),t>=5)for(let h=0;h<le;h+=2)Ee.push({p:K[h],n:je[h],c:S,r:g*A});await n.yield()}}const Gt=new e.Mesh(Zt(_e),L({vertexShader:`
      attribute vec3 color, aRad; attribute float aLat; varying vec3 vW, vN, vR, vC; varying vec2 vUv; varying float vLat;
      void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = mat3(modelMatrix)*normal; vR = mat3(modelMatrix)*aRad; vC = color; vUv = uv; vLat = aLat;
        gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:`
      varying vec3 vW, vN, vR, vC; varying vec2 vUv; varying float vLat;
      void main(){
        vec3 N = vN/max(length(vN), 1e-4), R = vR/max(length(vR), 1e-4), V = cameraPosition - vW; float dist = length(V); V = V/max(dist, 1e-4);
        // a round strand lying among its neighbours: bright on its crown, the deeper lot where it turns down into the gap,
        // a hint of ply along it; the ball's own curve decides the pale halo, not each strand's edge
        float thin = smoothstep(0.25, 0.55, fwidth(vLat)), thinA = smoothstep(0.5, 1.1, fwidth(vLat)), h = sqrt(max(1. - vLat*vLat, 0.));
        float rec = mix(max(1. - smoothstep(0.1, 0.8, h), yarnPly(vUv, 3.)*0.5), 0.22, thin);
        vec3 n = mix(N, R, 0.25 + 0.75*thin); n = n/max(length(n), 1e-4);
        vec3 Rr = mix(R, V, 0.6); Rr = Rr/max(length(Rr), 1e-4);                    // (a quiet halo: the ball is wool to its edge, not a pale ring round a bubble)
        // each wound strand catches the light along its crown (a lighter lot, a little cream in it: wool, not a gloss) and keeps
        // that edge until it is two or three pixels wide, so the belts still read as wound yarn from across the Sound
        vec3 bc = vC*(1. + (0.2*smoothstep(0.5, 1., h) - 0.1*(1. - smoothstep(0., 0.5, h)))*(1. - thinA));
        bc = mix(bc, uCream, 0.08*smoothstep(0.72, 1., h)*(1. - thinA));
        gl_FragColor = vec4(toScene(woolShadeR(bc, n, Rr, V, rec, dist)), 1.);
      }`}));U.add(Gt);for(const t of _e)t.dispose();await n.yield();const vt=[],_t=Math.round(260*f);for(let t=0;t<_t;t++){const o=Ee[r.int(0,Ee.length-1)];vt.push({p:o.p.clone().addScaledVector(o.n,o.r*.9),n:o.n,len:r.range(2.2,4.6),w:r.range(3,6),color:o.c})}const ft=new e.Mesh(Nt(vt),Ft());ft.frustumCulled=!1,U.add(ft);const dt=[],Et=i.clone().lerp(l,.5),It=Math.round(9*f);for(let t=0;t<D;t++)for(let o=0;o<It;o++){const c=r.range(-2.2,2.2),v=new e.Vector3(r.range(-.3,.3),Math.cos(c),Math.sin(c)).normalize();dt.push({p:new e.Vector3(r.range(-1,1),(_+.6)*Math.cos(c),(_+.6)*Math.sin(c)),n:v,len:r.range(1.6,3.2),w:r.range(2.2,3.6),color:Et,id:t})}const pt=new e.Mesh(Nt(dt),Ft({uniforms:{...p,...Me},anchor:xe+ot+"vec3 fuzzAnchor(vec3 p, float id){ float c; return loopNow(p, id, c); }"}));pt.frustumCulled=!1,x.add(pt),await n.yield();const qe=new Float32Array(D*4*3),ht=new Float32Array(D*4),mt=[];for(let t=0;t<D;t++){for(let o=0;o<4;o++)qe[(t*4+o)*3]=(o&1)*2-1,qe[(t*4+o)*3+2]=(o>>1)*2-1,ht[t*4+o]=t;mt.push(t*4,t*4+2,t*4+1,t*4+1,t*4+2,t*4+3)}const ke=new e.BufferGeometry;ke.setAttribute("position",new e.BufferAttribute(qe,3)),ke.setAttribute("aRib",new e.BufferAttribute(ht,1)),ke.setIndex(mt);const Xe=new e.Mesh(ke,L({transparent:!0,depthWrite:!1,uniforms:{...p,uHem:{value:u}},vertexShader:xe+`
      attribute float aRib; varying vec3 vW; varying vec3 vP;
      void main(){
        float sh = sinceHop(aRib), size = mix(5., 19., smoothstep(0.15, 5., sh));
        vP = vec3(position.xz, sh);
        vec4 w = modelMatrix*vec4(ribX(aRib) + position.x*size*0.8, 0.7, landZ(ribX(aRib), 190.) + 4. + position.z*size, 1.); vW = w.xyz;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:`
      uniform vec3 uHem; varying vec3 vW; varying vec3 vP;
      void main(){
        float rad = length(vP.xy), ang = atan(vP.y, vP.x + 1e-5), sh = vP.z;
        float ring = rad*4.2 - sh*0.35, fr = fwidth(ring);
        float bump = abs(fract(ring) - 0.5)*2., seg = 0.5 + 0.5*sin(ang*(5. + 4.*floor(ring)) + floor(ring)*2.4);
        float ridge = (1. - smoothstep(0.35, 0.6 + fr, bump))*smoothstep(0.12, 0.3, seg);
        vec4 st = vec4(ridge, bump*0.5, 0., 0.);
        float a = smoothstep(0.15, 0.5, sh)*(1. - smoothstep(3., 6.5, sh))*smoothstep(0.1, 0.25, rad)*(1. - smoothstep(0.8, 1., rad))*ridge*0.9;
        vec3 V = cameraPosition - vW; float dist = length(V);
        gl_FragColor = vec4(toScene(woolShade(uHem, vec3(0., 1., 0.), V/max(dist, 1e-4), st.y*0.6, dist)), a);
      }`}));Xe.frustumCulled=!1,Xe.renderOrder=2,x.add(Xe),await n.yield();let Te=-1;const T={xc:0,w:0,f:0,back:!1,row:0},qt=new e.Quaternion,I=new e.Vector3,Xt=new e.Matrix4,xt=new e.Vector2,$t=new e.Vector3(.25,0,1).normalize(),wt=new e.Vector3(0,P,0),gt=B*.4;be.set(1,gt,-z).normalize(),F.quaternion.setFromUnitVectors(new e.Vector3(1,0,0),be);const $e=(t,o)=>{const c=t-T.xc,v=Math.abs(c),g=G(0,9,c);return o.set(t,P+B*v-10.5-g*(1.5+.1*v),Mt(Mt(-he,he,G(-5,5,c))-z*v,1.2-.3*z*v,g))};function yt(t,o,c){const v=j(Te>=0?Te:o*.6%30,0,29.6);Object.assign(T,io(v)),fe.uniforms.uTime.value=o,p.uClock.value=v,p.uXc.value=T.xc,wt.set(T.xc,P,0);const g=G(0,.28,T.f)-G(.5,.8,T.f);Y.position.set(T.xc,P,-he).addScaledVector(Oe,-J),F.position.set(T.xc,P-.8*g,he).addScaledVector(be,-(J*.55+6.5*g));const A=Math.PI*2*G(.26,.56,T.f);O[0].set(T.xc+2.5,P+5.2*Math.cos(A)+1.2,5.2*Math.sin(A)),$e(k/2,I);const R=I.y-2.5,se=I.z+2.2;x.updateWorldMatrix(!0,!1);const Re=Z.uWindL.value.copy(fe.uniforms.uWind.value).applyQuaternion(x.getWorldQuaternion(qt).invert());for(let S=0;S<2;S++){const M=re[1+S].w;O[1+S].set(k/2+1.6,R-S*2.5,se),E[1+S].copy(O[1+S]).addScaledVector(Re,M*.9).add(I.set(M*.25,-M*.22,0))}O[3].set(k/2+1.4,R+1,se),E[3].set(k/2+2.2,R-56,se*.75+2);for(let S=0;S<Pe.length;S++){const M=Pe[S],X=O[4+S];$e(M.x,I),X.set(M.x,I.y-M.d,I.z*(1-G(0,150,M.d))+kt(M.x,M.d)+2.2),E[4+S].copy(X).addScaledVector(Re,M.len*.7).add(I.set(0,-M.len*.4,M.len*.45))}U.position.y=Ve.y+Math.sin(o*.55)*2.2,U.quaternion.setFromAxisAngle($t,-o*.2),U.updateWorldMatrix(!1,!1),lt.material.uniforms.uRot.value.setFromMatrix4(Xt.extractRotation(U.matrixWorld)),E[0].set(ne.x,ne.y+Math.sin(o*.55)*2.2,ne.z),c&&(Z.uCamL.value.setFromMatrixPosition(c.matrixWorld),x.worldToLocal(Z.uCamL.value),n.renderer?.getDrawingBufferSize(xt),Z.uPx.value=fe.uniforms.uPxS.value=2/(Math.max(c.projectionMatrix.elements[5],.1)*Math.max(xt.y||720,64)))}yt(0,0,null);const C=(t,o,c)=>new e.Vector3(t,o,c);return{object:x,radius:175,height:215,center:C(-40,118,10),ground:!0,groundY:0,anchors:{crossing:C(0,P,0),rotationY:-2.03,viewpoints:[{position:C(0,106,401),lookAt:C(-30,150,0)},{position:C(-5,58,207),lookAt:C(0,P,0)}],flyThrough:[C(0,106,401),C(-2,92,345),C(-3.5,75,275),C(-5,58,207)],portalSeat:{position:C(-5,58,207),facing:C(0,.24,.97).normalize()},selvedgeTop:C(k/2,P-12,0),selvedgeFoot:C(k/2,0,0),hemLeft:C(-k/2,0,0),ball:Ve.clone(),ballRadius:ae+12,ballFeed:ne.clone(),strandSources:[],knobLeft:C(-260,P+260*B,-260*z),knobRight:C(260,P+260*gt,-260*z)},crossing:wt,uniforms:{...p,...Z},setProgress(t,o=42){Te=1+j(t,0,1)*o*.6},setClock(t){Te=t},setDrop(t,o){p.uDrop.value.set(o>.5?t:-9,o)},ribPoint(t,o,c=new e.Vector3){const v=pe+(t+.5)*de;return $e(v,c),c.set(v,c.y-o,kt(v,o)+3)},update:yt,dispose(){}}}export{to as FABRIC_GLSL,ve as PALETTE,fe as STYLE,eo as WIND_GLSL,Jt as WOOL_GLSL,ho as buildHero,fo as fabricMaterial,Nt as fuzzGeometry,Ft as fuzzMaterial,ao as woodMaterial,L as woolMaterial,po as yarnMaterial,Pt as yarnTubeGeometry};
