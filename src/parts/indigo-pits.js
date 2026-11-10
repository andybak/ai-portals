import*as e from"three";import{clamp as we,lerp as E,smoothstep as j}from"../kit/core.js";const mt=["#EDE6D6","#C99A5A","#10173A","#27479A","#A9C7EA","#B6C23A","#F26B1D"],O=-.5,Je=7,ke=8.6,et=6,R=39.6,de=1.3,N=-1.3,G=Math.PI*2,K=`
  uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uHazeCol, uZenCol;
  uniform float uTime, uHaul, uWind, uShade0; uniform vec3 uShadeY; float uShade;
  void setShade(float y){ uShade = uShade0 * mix(uShadeY.z, 1., smoothstep(uShadeY.x, uShadeY.y, y)); }
  float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
  float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  vec2 h22(vec2 p){ float n = h21(p); return vec2(n, h21(p + n + 17.17)); }
  float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
  float fbm2(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * vn2(p); p = p * 2.03 + 11.7; a *= .5; } return s; }
  float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    float n = i.x + i.y * 57. + i.z * 113.;
    return mix(mix(mix(h11(n), h11(n + 1.), f.x), mix(h11(n + 57.), h11(n + 58.), f.x), f.y),
               mix(mix(h11(n + 113.), h11(n + 114.), f.x), mix(h11(n + 170.), h11(n + 171.), f.x), f.y), f.z); }
  vec3 skyAt(vec3 d){ float h = clamp(d.y, 0., 1.); vec3 c = mix(uHazeCol, uZenCol, pow(h, .6));
    float s = max(dot(d, uSunDir), 0.); return c + uSunCol * (.10 * pow(s, 8.) + .25 * pow(s, 64.)); }
`,We=`
  uniform float uTwist;
  float twistAt(float h){ return uTwist * (1. - smoothstep(3., 14., h)); }
  vec2 twistXZ(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(p.x * c + p.y * s, -p.x * s + p.y * c); }
`,Ve=`
  uniform vec3 uRamp[5]; uniform vec3 uResLo, uResHi, uRaffia; uniform vec4 uPat; uniform float uSeed, uGlow;
  float gFwd = 0.;
  // h = metres above the liquor (already nudged by the caller)
  vec3 dyeRamp(float h){
    vec3 c = mix(uRamp[0], uRamp[1], smoothstep(1.2, 5., h));
    c = mix(c, uRamp[2], smoothstep(4., 8., h));
    c = mix(c, uRamp[3], smoothstep(7., 12.5, h));
    return mix(c, uRamp[4], smoothstep(16., 27., h));
  }
  float frontNudge(vec2 q){ return (vn2(q * vec2(.9, .22) + vec2(0., uTime * .05)) - .5) * 3.2 + (vn2(q * vec2(3.1, .9) + 7.) - .5) * 1.1; }
  // one roundel: returns resist amount (x), halo (y), disc mask (z), radial coord (w)
  vec4 roundel(vec2 d, float R, float id){
    float r = length(d), a = atan(d.y, d.x + 1e-5);
    float wob = 1. + .10 * sin(a * 3. + id * 40.) + .06 * sin(a * 7. + id * 91.);
    float rr = r / (R * wob);
    float pleat = vn2(vec2(a * 7. + id * 13., rr * 2.2)) * .6 + vn2(vec2(a * 19. + id * 5., rr * 5.)) * .4;
    float ring = smoothstep(.30, .46, rr) * (1. - smoothstep(.86, 1.02, rr));
    float inner = (1. - smoothstep(.05, .13, rr)) * .9;
    float rings2 = .5 + .5 * sin(rr * 30. + pleat * 4.);
    float res = ring * (.55 + .45 * pleat) * (.75 + .25 * rings2) + inner;
    float halo = (1. - smoothstep(.95, 1.5, rr)) * smoothstep(.8, 1.0, rr);
    return vec4(clamp(res, 0., 1.), halo, 1. - smoothstep(.98, 1.04, rr), rr);
  }
  // q = (x across, metres along the cloth). Returns resist 0..1; bind = raffia-bound disc mask info.
  float resist(vec2 q, float fine, out vec4 rd, out float rid){
    vec2 w = q + (vec2(vn2(q * .7 + uSeed), vn2(q * .7 + 31. + uSeed)) - .5) * .22;
    float px = uPat.y, py = uPat.z, R = uPat.w, res = 0.;
    float row = floor(w.y / py), fy = w.y - (row + .5) * py;
    float odd = mod(row, 2.);
    float xo = (uPat.x < .5 || uPat.x > 1.5) ? odd * .5 * px : 0.;
    float col = floor((w.x + xo) / px + .5), fx = w.x + xo - col * px;
    float cx = col * px - xo;
    rid = h21(vec2(col + 3., row) + uSeed);
    float Rr = R * (uPat.x > 1.5 ? mix(.55, 1., odd) : 1.) * (.9 + .2 * rid);
    float inside = step(abs(cx), 3. - Rr * 1.05);
    rd = roundel(vec2(fx, fy), Rr, rid) * inside;
    res = max(rd.x, rd.y * .35);
    if (uPat.x > .5 && uPat.x < 1.5) {          // four satellite dots
      vec2 s = abs(vec2(fx, fy)) - vec2(px * .5, py * .27); float sr = length(s) / (R * .26);
      res = max(res, (1. - smoothstep(.75, 1.05, sr)) * smoothstep(.25, .5, sr) * .9 + (1. - smoothstep(1., 1.7, sr)) * .2);
    }
    // stitched resist lines between the rows
    float ly = w.y - row * py; ly = ly > py * .5 ? ly - py : ly;
    float zz = uPat.x < .5 ? 0. : (uPat.x < 1.5 ? (abs(fract(w.x / .5) - .5) - .25) * .36 : (abs(fract(w.x / 1.5) - .5) - .25) * 1.1);
    float d1 = abs(abs(ly - zz) - .11), aaL = .018 + fine;
    float dash = smoothstep(.18, .30, abs(fract(w.x * 7. + vn2(w * 3.) * .5) - .5) + .12);
    res = max(res, (1. - smoothstep(.022, .022 + aaL, d1)) * dash * .9 * step(abs(w.x), 2.82));
    // selvedge lines and a row of pin dots
    float se = abs(abs(w.x) - 2.78);
    res = max(res, (1. - smoothstep(.02, .02 + aaL, se)) * dash * .8);
    vec2 pd = vec2(abs(w.x) - 2.55, fract(w.y / .32) * .32 - .16);
    res = max(res, (1. - smoothstep(.035, .06 + fine, length(pd))) * .8);
    return clamp(res, 0., 1.);
  }
  // shared lighting of a cloth point: N must face the viewer
  vec3 clothLight(vec3 alb, vec3 N, float thin){
    float ndl = dot(N, uSunDir);
    float front = max(ndl, 0.), back = max(-ndl, 0.);
    vec3 amb = mix(uGndCol, uSkyCol, N.y * .5 + .5) * 1.0 + uSkyCol * .25;
    // seen against the sun the cloth is stained glass: its own colour, lifted and saturated, at full strength
    // as soon as the sun is behind it at all, and stronger still looking up through it toward the sun
    vec3 tcol = pow(alb + 1e-4, vec3(.6));
    float lum = dot(tcol, vec3(.3, .5, .2)); tcol = max(mix(vec3(lum), tcol, 1.9), 0.);
    tcol *= mix(vec3(1.), vec3(.8, .93, 1.06), smoothstep(.45, .95, lum));
    vec3 c = alb * (uSunCol * uShade * (front * .8 + .05) + amb);
    float bk = 1. - smoothstep(-.13, .03, ndl);
    // (the light that comes through is taken half-way to white first, so a low red sun does not turn the blue to green)
    vec3 sunT = mix(uSunCol, vec3(dot(uSunCol, vec3(.3, .5, .2))), .55);
    // (and its strength is rolled off above 1, so a hard white sun deepens the blue instead of bleaching it to cyan)
    float sl = max(dot(sunT, vec3(.3, .5, .2)), 1e-3);
    float tl = sl * uShade * (bk * (.55 + .45 * pow(back + 1e-4, .55)) * thin * uGlow * (1. + .8 * gFwd + 1.1 * gFwd * gFwd * gFwd * gFwd));
    tl = min(tl, 1.) + .5 * (1. - 1. / (1. + max(tl - 1., 0.)));
    c += min(tcol, vec3(1.15)) * (sunT / sl) * tl;
    return c;
  }
`,Ce=`#include <common>
#include <fog_pars_vertex>
`,Ae=`#include <common>
#include <fog_pars_fragment>
`;class tt{constructor(){this.P=[],this.N=[],this.C=[],this.U=[],this.A=[],this.V=[],this.I=[],this.n=0}vert(r,a,s,F,g,M,v,S,k,C,w,y,x,b,n,p,A){return this.P.push(r,a,s),this.N.push(F,g,M),this.C.push(v,S,k),this.U.push(C,w),this.A.push(y,x,b),this.V.push(n,p,A),this.n++}add(r,a,s={}){const F=(r.index,r),g=F.attributes.position,M=F.attributes.normal,v=F.attributes.uv,S=new e.Matrix3().getNormalMatrix(a),k=new e.Vector3,C=new e.Vector3,w=new e.Color,y=this.n,x=s.piv||[0,0,0],b=s.uvScale||[1,1];for(let n=0;n<g.count;n++)k.fromBufferAttribute(g,n).applyMatrix4(a),C.fromBufferAttribute(M,n).applyMatrix3(S).normalize(),s.colorFn?s.colorFn(k.x,k.y,k.z,w,n):w.copy(s.color),this.vert(k.x,k.y,k.z,C.x,C.y,C.z,w.r,w.g,w.b,v?v.getX(n)*b[0]:0,v?v.getY(n)*b[1]:0,s.kind||0,s.phase||0,s.mat||0,x[0],x[1],x[2]);if(F.index){const n=F.index.array;for(let p=0;p<n.length;p++)this.I.push(y+n[p])}else for(let n=0;n<g.count;n++)this.I.push(y+n);r.dispose()}build(){const r=new e.BufferGeometry;return r.setAttribute("position",new e.Float32BufferAttribute(this.P,3)),r.setAttribute("normal",new e.Float32BufferAttribute(this.N,3)),r.setAttribute("color",new e.Float32BufferAttribute(this.C,3)),r.setAttribute("uv",new e.Float32BufferAttribute(this.U,2)),r.setAttribute("aAnim",new e.Float32BufferAttribute(this.A,3)),r.setAttribute("aPiv",new e.Float32BufferAttribute(this.V,3)),r.setIndex(this.I),r}async buildAsync(r){const a=new e.BufferGeometry;for(const[s,F,g]of[["position",this.P,3],["normal",this.N,3],["color",this.C,3],["uv",this.U,2],["aAnim",this.A,3],["aPiv",this.V,3]])a.setAttribute(s,new e.Float32BufferAttribute(F,g)),await r.yield?.();return a.setIndex(this.I),a}}const wt=new e.Vector3,J=new e.Vector3,kt=new e.Vector3,Vt=new e.Vector3;function He(i){const r=i.clone().normalize(),a=Math.abs(r.y)<.95?new e.Vector3(0,1,0).cross(r).normalize():new e.Vector3(1,0,0).cross(r).normalize(),s=r.clone().cross(a).normalize();return{d:r,u:a,w:s}}function W(i,r,a,s){const F=r.distanceTo(a),g=s.rings||Math.max(2,Math.ceil(F/(s.step||.5))),M=s.radial||10,{d:v,u:S,w:k}=He(wt.copy(a).sub(r)),C=s.bow||0,w=s.bowDir||S,y=new e.Color,x=i.n,b=s.piv||[0,0,0];for(let n=0;n<=g;n++){const p=n/g,A=p*F,T=s.radiusFn(p,A);J.copy(r).addScaledVector(v,A).addScaledVector(w,Math.sin(p*Math.PI)*C);for(let Y=0;Y<=M;Y++){const B=Y/M*G,d=Math.cos(B),U=Math.sin(B),f=T*(s.lump?1+s.lump*Math.sin(B*3+A*.7+(s.phase0||0)):1),Pe=S.x*d+k.x*U,X=S.y*d+k.y*U,se=S.z*d+k.z*U;s.colorFn(p,B,y,J.y+X*f),i.vert(J.x+Pe*f,J.y+X*f,J.z+se*f,Pe,X,se,y.r,y.g,y.b,Y/M,(s.v0||0)+A,s.kind||0,s.phase||0,s.mat||0,b[0],b[1],b[2])}}for(let n=0;n<g;n++)for(let p=0;p<M;p++){const A=x+n*(M+1)+p,T=A+M+1;i.I.push(A,A+1,T,A+1,T+1,T)}if(s.cap)for(const n of[0,1]){const p=n,A=p*F,T=s.radiusFn(p,A)*.35;J.copy(r).addScaledVector(v,A+(n?1:-1)*s.radiusFn(p,A)*.35),s.colorFn(p,0,y,J.y),y.multiplyScalar(.8);const Y=i.vert(J.x,J.y,J.z,v.x*(n?1:-1),v.y*(n?1:-1),v.z*(n?1:-1),y.r,y.g,y.b,.5,(s.v0||0)+A,s.kind||0,s.phase||0,s.mat||0,b[0],b[1],b[2]),B=x+(n?g:0)*(M+1);for(let d=0;d<M;d++)n?i.I.push(B+d,B+d+1,Y):i.I.push(B+d+1,B+d,Y)}}function ye(i,r,a,s={}){const F=new e.CatmullRomCurve3(r,!1,"centripetal"),g=F.getLength(),M=s.segs||Math.max(2,Math.ceil(g/(s.step||.6))),v=s.radial||6,S=F.computeFrenetFrames(M,!1),k=i.n,C=s.color,w=s.piv||[0,0,0],y=new e.Vector3;for(let x=0;x<=M;x++){F.getPointAt(x/M,y);const b=S.normals[x],n=S.binormals[x],p=s.shadeFn?s.shadeFn(x/M):1;for(let A=0;A<=v;A++){const T=A/v*G,Y=Math.cos(T),B=Math.sin(T),d=b.x*Y+n.x*B,U=b.y*Y+n.y*B,f=b.z*Y+n.z*B;i.vert(y.x+d*a,y.y+U*a,y.z+f*a,d,U,f,C.r*p,C.g*p,C.b*p,A/v,x/M*g,s.kind||0,s.phase||0,1,w[0],w[1],w[2])}}for(let x=0;x<M;x++)for(let b=0;b<v;b++){const n=k+x*(v+1)+b,p=n+v+1;i.I.push(n,n+1,p,n+1,p+1,p)}}function Q(i,r,a,s,F,g,M,v,S={}){const k=F/2,C=r.clone().addScaledVector(a,-k),w=r.clone().addScaledVector(a,k),y=v.range(.85,1.05),x=v.range(0,6);W(i,C,w,{rings:g*4,radial:12,mat:1,kind:S.kind||0,piv:S.piv,phase:S.phase,v0:v.range(0,9),radiusFn:b=>{const n=b*g,p=n-Math.floor(n);return s+.5*(S.thick||.11)*(.35+Math.sin(p*Math.PI))+.012*Math.sin(n*2.3+x)},colorFn:(b,n,p)=>{const A=b*g,T=A-Math.floor(A),Y=(.55+.45*Math.sin(T*Math.PI))*y*(.9+.1*Math.sin(Math.floor(A)*12.9+x));p.copy(M).multiplyScalar(Y)}})}function Le(i,r,a,s,F,g,M,v,S,k={}){const C=new e.IcosahedronGeometry(1,1),w=C.attributes.position,y=S.range(0,100);for(let n=0;n<w.count;n++){const p=w.getX(n),A=w.getY(n),T=w.getZ(n),Y=1+.22*Math.sin(p*3.1+y)*Math.sin(A*2.7+y*1.3)+.12*Math.sin(T*5.3+y*.7);w.setXYZ(n,p*Y,Math.max(A*Y,-.55),T*Y)}C.computeVertexNormals();const x=new e.Matrix4().compose(new e.Vector3(r,a,s),new e.Quaternion().setFromEuler(new e.Euler(S.range(-.3,.3),S.range(0,G),S.range(-.3,.3))),new e.Vector3(F,g,M)),b=S.range(.75,1.1);i.add(C,x,{colorFn:(n,p,A,T)=>{T.copy(v).multiplyScalar(b*(.7+.3*j(a-g*.5,a+g*.6,p)))},mat:4,kind:k.kind||0,piv:k.piv,phase:k.phase})}function yt(i){return new e.ShaderMaterial({uniforms:i,fog:!0,vertexColors:!0,vertexShader:Ce+K+`
      attribute vec3 aAnim, aPiv;
      uniform float uDrumAng, uBasketDy, uRopeLen;
      varying vec3 vN, vW, vL, vCol; varying vec2 vUv; varying float vMat;
      vec2 rot(vec2 p, float a){ float c = cos(a), s = sin(a); return vec2(p.x * c - p.y * s, p.x * s + p.y * c); }
      void main(){
        vec3 p = position, n = normal; float k = aAnim.x;
        if (k > .5 && k < 1.5) { p -= aPiv; p.yz = rot(p.yz, uDrumAng); n.yz = rot(n.yz, uDrumAng); p += aPiv; }
        else if (k < 2.5 && k > 1.5) { p.y += uBasketDy; p.xz += vec2(sin(uTime * .8), cos(uTime * .63)) * .05; }
        else if (k < 3.5 && k > 2.5) { p.y = aPiv.y + (p.y - aPiv.y) * uRopeLen; }
        else if (k < 4.5 && k > 3.5) { p -= aPiv; float a1 = .055 * sin(uTime * .9 + aAnim.y), a2 = .04 * sin(uTime * .67 + aAnim.y * 1.7);
          p.xy = rot(p.xy, a1); n.xy = rot(n.xy, a1); p.yz = rot(p.yz, a2); n.yz = rot(n.yz, a2); p += aPiv; }
        else if (k > 4.5) { p -= aPiv; float a = uTime * .22 + aAnim.y; p.xz = rot(p.xz, a); n.xz = rot(n.xz, a);
          p.xy = rot(p.xy, .05 * sin(uTime * 1.3 + aAnim.y)); p += aPiv; p.y += .035 * sin(uTime * 1.1 + aAnim.y);
          p.xz += vec2(cos(uTime * .09 + aAnim.y), sin(uTime * .09 + aAnim.y)) * .5; }
        vL = p; vUv = uv; vMat = aAnim.z; vCol = color;
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * n);
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Ae+K+`
      uniform float uAmbK;
      varying vec3 vN, vW, vL, vCol; varying vec2 vUv; varying float vMat;
      void main(){
        setShade(vW.y);
        vec3 N = normalize(vN + vec3(1e-5, 0., 0.)); vec3 alb = vCol; float m = vMat, bump = 0., gloss = 0.;
        float fw = fwidth(vUv.y) + 1e-4;
        if (m < .5) {                       // palm trunk: leaf-scar rings, fibre, mottling
          float j = vn2(vec2(vUv.x * 5., floor(vUv.y / .9))) * .35;
          float ring = fract(vUv.y / .9 + j + .08 * sin(vUv.x * 6.2832));
          float scar = smoothstep(.0, .10 + fw, ring) * (1. - smoothstep(.82, .98, ring));
          float fib = vn2(vec2(vUv.x * 46., vUv.y * 1.3)) * .6 + vn2(vec2(vUv.x * 110., vUv.y * 3.)) * .4;
          float mot = fbm2(vec2(vUv.x * 4., vUv.y * .6));
          alb *= mix(.52, 1., scar) * (.74 + .42 * fib) * (.8 + .4 * mot);
          alb = mix(alb, alb * vec3(1.12, 1.02, .82), smoothstep(.5, .8, mot) * .5);
          bump = (scar - .5) * .5 + (fib - .5) * .3;
        } else if (m < 1.5) {               // rope: laid strands
          float tw = sin((vUv.x * 3. + vUv.y * 9.) * 6.2832);
          float fib = vn2(vec2(vUv.x * 60., vUv.y * 30.));
          float tf = 1. - smoothstep(.12, .45, fw * 9.); tw *= tf;
          alb *= (.62 + .38 * smoothstep(-.6, .7, tw)) * (.8 + .35 * fib * tf); bump = tw * .4;
        } else if (m < 2.5) {               // cement lip: speckle, cracks, wear
          float sp = vn3(vL * 9.) * .5 + vn3(vL * 31.) * .5;
          float cr = abs(fbm2(vL.xz * 1.1 + 3.) - .5);
          float cfw = fwidth(cr) + 1e-4; float crack = (1. - smoothstep(.6, 1.5, cr / cfw)) * (1. - smoothstep(.01, .05, cfw));
          float wear = fbm2(vL.xz * .45 + 9.);
          alb *= (.78 + .34 * sp) * (1. - .3 * crack);
          alb = mix(alb, alb * vec3(1.1, 1.06, .98) + .03, smoothstep(.45, .7, wear) * .5);
          bump = (sp - .5) * .5 - crack * .3;
        } else if (m < 3.5) {               // basket weave
          vec2 g = vec2(vUv.x * 28., vUv.y * 9.); float o = mod(floor(g.x) + floor(g.y), 2.);
          vec2 f = fract(g); float st = o > .5 ? sin(f.x * 3.1416) : sin(f.y * 3.1416); st = mix(.64, st, 1. - smoothstep(.15, .5, fw * 9.));
          alb *= (.5 + .6 * st) * (.85 + .3 * vn2(g * .7)); bump = st * .5;
        } else if (m < 4.5) {               // stone
          float sp = vn3(vL * 7.) * .6 + vn3(vL * 23.) * .4; alb *= .75 + .45 * sp; bump = (sp - .5) * .4;
        } else if (m < 5.5) {               // drum staves: grain along the axis (uv.y), seams round it
          float seam = abs(fract(vUv.x * 14.) - .5); float sm = smoothstep(.0, .06, seam);
          float st = h11(floor(vUv.x * 14.) + 3.);
          float gr = vn2(vec2(vUv.x * 90., vUv.y * 1.6 + st * 9.)) * .6 + vn2(vec2(vUv.x * 30., vUv.y * .5)) * .4;
          alb *= mix(.4, 1., sm) * (.72 + .5 * gr) * (.82 + .3 * st); bump = (gr - .5) * .3 + (sm - 1.) * .6;
        } else {                            // wound cloth on the drum: glazed indigo with faint bands
          float bands = vn2(vec2(vUv.y * 3., vUv.x * 2.)) * .5 + .5 * sin(vUv.x * 30. + vUv.y * 2.);
          float wv = sin(vUv.y * 90.) * sin(vUv.x * 400.);
          alb *= .8 + .25 * bands + .06 * wv; gloss = .35;
        }
        N = normalize(N + (dFdx(bump) * cross(N, vec3(0., 1., 0.)) + vec3(0., 1., 0.) * dFdy(bump)) * 2.5 + vec3(0., 1e-5, 0.));
        vec3 V = normalize(cameraPosition - vW + vec3(1e-5));
        float ndl = dot(N, uSunDir);
        float dif = smoothstep(-.12, .5, ndl) * max(ndl * .85 + .15, 0.);
        vec3 amb = mix(uGndCol, uSkyCol, N.y * .5 + .5) * uAmbK + uGndCol * uSunCol * (.5 - .5 * N.y) * .5;
        vec3 c = alb * (uSunCol * uShade * dif + amb);
        float fr = clamp(1. - dot(N, V), 0., 1.), rim = fr * fr * fr;
        c += alb * uSkyCol * rim * .35;
        // a rim of light down the sunward edge, strongest looking toward the sun
        c += (alb * 1.4 + .02) * uSunCol * uShade * fr * fr * (.2 + .8 * smoothstep(-.25, .45, ndl)) * (.4 + .6 * smoothstep(-.2, .7, dot(-V, uSunDir)));
        vec3 H = normalize(uSunDir + V + vec3(1e-5));
        c += uSunCol * uShade * pow(max(dot(N, H), 0.), 40.) * gloss * step(0., ndl);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`})}const xe=28,Fe=230,at=30;function xt(){const i=[],r=[],a=[],s=[],F=O-.2,g=R-F,M=Fe+at;for(let S=0;S<=M;S++){let k,C,w,y,x,b;if(S<=Fe){const n=S/Fe;k=F+g*n,C=0,w=0,y=1,x=g*n-.2,b=1}else{const n=(S-Fe)/at*Math.PI*1.55;k=R+de*Math.sin(n),C=N+de*Math.cos(n),w=Math.sin(n),y=Math.cos(n),x=g-.2+n*de,b=0}for(let n=0;n<=xe;n++){const p=(n/xe-.5)*et;i.push(p,k,C),r.push(0,w,y),a.push(p,x,b)}}for(let S=0;S<M;S++)for(let k=0;k<xe;k++){const C=S*(xe+1)+k,w=C+xe+1;s.push(C,C+1,w,C+1,w+1,w)}const v=new e.BufferGeometry;return v.setAttribute("position",new e.Float32BufferAttribute(i,3)),v.setAttribute("normal",new e.Float32BufferAttribute(r,3)),v.setAttribute("aS",new e.Float32BufferAttribute(a,3)),v.setIndex(s),v.boundingSphere=new e.Sphere(new e.Vector3(0,20,0),24),v}function gt(i){return new e.ShaderMaterial({uniforms:i,fog:!0,side:e.DoubleSide,vertexShader:Ce+K+We+`
      attribute vec3 aS;
      varying vec3 vN, vW; varying vec3 vS; varying float vSlope;
      void main(){
        vec3 p = position, n = normal; float x = aS.x, h = max(position.y - (${O.toFixed(2)}), 0.);
        float e = sin(clamp(h / 40.1, 0., 1.) * 3.14159) * aS.z;
        float env = pow(e + 1e-4, .7) * uWind;
        float t = uTime;
        float a1 = .16 * h - 1.9 * t + .25 * x, a2 = .47 * h - 3.1 * t - .7 * x + 1.3, a3 = 1.25 * h - 5.2 * t + 1.6 * x, a4 = .05 * h - .45 * t;
        float z = env * (.62 * sin(a1) + .2 * sin(a2) + .07 * sin(a3) + .5 * sin(a4));
        float dzh = env * (.62 * .16 * cos(a1) + .2 * .47 * cos(a2) + .07 * 1.25 * cos(a3));
        float dzx = env * (.62 * .25 * cos(a1) - .2 * .7 * cos(a2) + .07 * 1.6 * cos(a3));
        // tension folds: vertical pleats gathered toward the drum and into the liquor
        float gather = (.35 + .65 * smoothstep(24., 40., h) + .5 * (1. - smoothstep(0., 5., h))) * aS.z;
        float f1 = x * 4.4 + 1.5 * sin(h * .21 + 1.) + .4 * sin(t * .8 + h * .3), f2 = x * 9.7 - h * .13;
        z += gather * (.075 * sin(f1) + .03 * sin(f2));
        dzx += gather * (.075 * 4.4 * cos(f1) + .03 * 9.7 * cos(f2));
        p.z += z; p.x *= 1. - .035 * e - .02 * smoothstep(30., 40., h) * aS.z;
        if (aS.z > .5) { n = normalize(vec3(-dzx, -dzh, 1.)); float tw = twistAt(h); p.xz = twistXZ(p.xz, tw); n.xz = twistXZ(n.xz, tw); }
        vSlope = dzh; vS = vec3(x, aS.y, h);
        vec4 w = modelMatrix * vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix) * n);
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Ae+K+Ve+`
      uniform vec3 uFoam;
      varying vec3 vN, vW; varying vec3 vS; varying float vSlope;
      void main(){
        setShade(vW.y);
        float x = vS.x, h = vS.z; vec2 q = vec2(x, vS.y - uHaul);
        float fine = fwidth(q.y) * 1.2;
        vec3 N = normalize(vN + vec3(0., 0., 1e-5)); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vW + vec3(1e-5));
        // fine cloth folds (do not travel with the pattern: they belong to the hanging)
        float fn = vn2(vec2(x * 3.3, h * .5 - uTime * .25)) - .5;
        N = normalize(N + vec3(dFdx(fn), 0., 0.) * 6. + vec3(1e-5));
        // the dye and its uneven front
        float hn = max(h + frontNudge(vec2(x, h)) * smoothstep(.5, 4., h), 0.);
        vec3 dyed = dyeRamp(hn);
        float mott = fbm2(q * vec2(1.4, 1.1) + uSeed);
        dyed *= .78 + .44 * mott;
        vec4 rd; float rid;
        float res = resist(q, fine, rd, rid);
        vec3 pale = mix(uResLo, uResHi, smoothstep(1.5, 19., hn));
        pale = mix(pale, dyed, .16 + .12 * mott);
        vec3 alb = mix(dyed, pale, res * .94);
        float thin = mix(.85, 1.05, res) * mix(1., .62, smoothstep(13., 30., hn));
        // raffia still bound round the lowest roundels
        float thr = 2.4 + 2.6 * rid;
        float bound = rd.z * (1. - smoothstep(thr - .7, thr, h));
        float wind = .5 + .5 * sin(rd.w * 34. + vn2(q * 9.) * 3.);
        float knot = 1. - smoothstep(.0, .22, rd.w);
        vec3 raf = uRaffia * (.5 + .55 * wind) * (1.15 - .5 * rd.w) + uRaffia * knot * .25;
        alb = mix(alb, raf, bound * .92); thin *= 1. - .75 * bound;
        // weave, faded with distance
        float wf = fwidth(q.x) * 190.;
        float weave = sin(q.x * 190.) * sin(q.y * 190.);
        float slub = vn2(vec2(q.x * 3., q.y * 60.)) * .5 + vn2(vec2(q.x * 60., q.y * 3.)) * .5;
        alb *= 1. + .10 * weave * (1. - smoothstep(.6, 2.2, wf)) + .16 * (slub - .5);
        // liquor sheeting down: dark rivulets that slide downward, wet low down
        float wet = 1. - smoothstep(1., 15., h);
        float rvA = 1. - smoothstep(8., 30., h);
        float rpath = x * 3.2 + .4 * sin(h * .5 + x * 2.) + vn2(vec2(x * 2., h * .35)) * .9 + .1 * sin(h * 2.3 + x * 9.);
        float rw = max(.1, fwidth(rpath) * 1.3), rl = abs(fract(rpath) - .5), rid2 = floor(rpath);
        float run = smoothstep(.4, .6, vn2(vec2(rid2 * 7.3, h * .16 + uTime * .55 + rid2 * 3.1)));      // each thread runs in lengths that slide down
        float riv = (1. - smoothstep(rw * .5, rw, rl)) * run * min(1., .24 / rw) * rvA * (1. - res * .5);
        float bead = (1. - smoothstep(rw * .7, rw * 1.3, rl)) * run * smoothstep(.75, .95, fract(h * .16 + uTime * .55 + rid2 * 3.1 + vn2(vec2(rid2, 3.)))) * rvA;
        riv = clamp(riv + bead * .4, 0., 1.);
        alb *= 1. - .7 * riv; thin *= 1. - .6 * riv; alb *= mix(1., .8, wet);
        // bronze foam torn up the first metre
        float fo = vn2(vec2(x * 4., (h - uHaul) * 1.6)) * .7 + vn2(vec2(x * 13., (h - uHaul) * 5.)) * .3;
        float foam = smoothstep(.1, .5, fo - h * .42 + .28) * (1. - smoothstep(1.4, 2.4, h));
        float bub = vn2(vec2(x * 40., (h - uHaul) * 40.));
        alb = mix(alb, uFoam * (.7 + .6 * bub), foam * .85); thin *= 1. - .4 * foam;
        // doubled selvedges and fold shadow
        float edge = smoothstep(2.84, 2.93, abs(x));
        alb *= 1. - .35 * edge; thin *= 1. - .45 * edge;
        float foldSh = 1. - .5 * clamp(abs(vSlope) * 1.6, 0., .6);
        float fwd = max(dot(-V, uSunDir), 0.); gFwd = fwd * fwd * fwd;
        vec3 c = clothLight(alb, N, thin) * foldSh;
        // wet glints: sun on the film and along the rivulets
        vec3 H = normalize(uSunDir + V + vec3(1e-5));
        float nh = max(dot(N, H), 0.);
        float spark = step(.82, vn2(vec2(x * 55., h * 55. + uTime * 3.)));
        c += uSunCol * uShade * (pow(nh, 90.) * (1.5 * wet + 3. * riv) + pow(nh, 14.) * (.10 * wet + .5 * riv * spark)) * step(0., dot(N, uSunDir));
        float back = max(-dot(N, uSunDir), 0.);
        c += uSunCol * uShade * riv * spark * back * vec3(.5, .9, .5) * 1.2 * wet;
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`})}function bt(i){return new e.ShaderMaterial({uniforms:i,fog:!0,vertexShader:Ce+`
      varying vec3 vW, vL;
      void main(){ vL = position; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz;
        vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Ae+K+Ve+We+`
      uniform vec3 uFoam, uLiquor; uniform mat4 uInvModel, uModel;
      varying vec3 vW, vL;
      float ringAt(vec2 p, vec2 c, float age){ float d = length(p - c), r = age * 1.5;
        return sin((d - r) * 16.) * exp(-abs(d - r) * 3.5) * (1. - age) * smoothstep(0., .08, age); }
      float hgtAt(vec2 p){
        float hgt = 0.;
        float wake = exp(-abs(p.y) * .7) * (1. - smoothstep(2.6, 3.8, abs(p.x)));
        hgt += wake * .5 * sin(abs(p.y) * 9. - uTime * 5. + vn2(p * 2.) * 3.);
        for (int i = 0; i < 9; i++) {
          float fi = float(i), per = 1.6 + h11(fi + 2.) * 1.4, tt = uTime / per + h11(fi * 7.3);
          float cyc = floor(tt), age = fract(tt);
          vec2 hh = h22(vec2(fi + 1., cyc + uSeed));
          vec2 c = vec2((i < 6 ? (mod(fi, 2.) < .5 ? -3. : 3.) + (hh.x - .5) * .5 : (hh.x - .5) * 5.6), (hh.y - .5) * (i < 6 ? .9 : .5));
          hgt += ringAt(p, c, age) * .6;
        }
        return hgt + (fbm2(p * .9 + vec2(uTime * .07, -uTime * .05)) - .5) * .5;
      }
      void main(){
        setShade(vW.y);
        vec2 p = twistXZ(vL.xz, -uTwist); float r = length(p);      // the cloth's own frame where it leaves the liquor
        vec3 V = normalize(cameraPosition - vW + vec3(1e-5));
        // ripples: wake where the cloth leaves, drip rings under both selvedges, slow swell
        float wake = exp(-abs(p.y) * .7) * (1. - smoothstep(2.6, 3.8, abs(p.x)));
        float h0 = hgtAt(p), hx = hgtAt(p + vec2(.06, 0.)), hz = hgtAt(p + vec2(0., .06));
        vec3 Nl = normalize(vec3(-(hx - h0) / .06 * .07, 1., -(hz - h0) / .06 * .07));
        Nl.xz = twistXZ(Nl.xz, uTwist);
        vec3 N = normalize(mat3(uModel) * Nl);
        vec3 R = reflect(-V, N); R.y = abs(R.y) + 1e-3;
        float fres = .08 + .92 * pow(clamp(1. - dot(N, V), 0., 1.), 4.);
        // what the mirror holds: haze sky, the sun, and the whole length standing in it
        vec3 refl = skyAt(normalize(R)); float clothM = 0.;
        float sg = max(dot(normalize(R), uSunDir), 0.);
        refl += uSunCol * uShade * (pow(sg, 900.) * 14. + pow(sg, 120.) * .6);
        vec3 Rl = normalize(mat3(uInvModel) * R); Rl.xz = twistXZ(Rl.xz, -uTwist);
        float tz = -p.y / (abs(Rl.z) > 1e-4 ? Rl.z : 1e-4);
        if (tz > 0.) {
          vec3 hit = vec3(p.x, vL.y, p.y) + Rl * tz; float hh = hit.y - (${O.toFixed(2)});
          float m = (1. - smoothstep(2.9, 3.02, abs(hit.x))) * step(0., hh) * (1. - smoothstep(39.6, 41., hh));
          if (m > 0.) {
            vec2 q = vec2(hit.x, hh - uHaul); vec4 rd; float rid;
            float res = resist(q, .03, rd, rid);
            float hn = max(hh + frontNudge(vec2(hit.x, hh)) * smoothstep(.5, 4., hh), 0.);
            vec3 dyed = dyeRamp(hn) * (.78 + .44 * fbm2(q * vec2(1.4, 1.1) + uSeed));
            vec3 alb = mix(dyed, mix(uResLo, uResHi, smoothstep(1.5, 19., hn)), res * .9);
            vec3 cn = vec3(0., 0., Rl.z > 0. ? -1. : 1.); cn.xz = twistXZ(cn.xz, uTwist);
            vec3 cc = clothLight(alb, normalize(mat3(uModel) * cn), mix(.85, 1.2, res) * mix(1., .62, smoothstep(13., 30., hn)));
            refl = mix(refl, cc, m); clothM = m;
          }
        }
        // the liquor itself and its raft of bronze foam turning round a clear dark centre
        float ang = atan(p.y, p.x + 1e-5) + uTime * .06 + r * .12;
        vec2 fp = vec2(cos(ang), sin(ang)) * r;
        float fo = fbm2(fp * .55 + uSeed) + .35 * vn2(fp * 2.3);
        float raft = smoothstep(.80, .90, fo + .17 * smoothstep(2.6, 4.6, r) - .2 * smoothstep(5.6, 6.9, r) + .22 * wake * step(abs(p.x), 3.2) + .1 * (vn2(fp * 6.) - .5));
        raft *= smoothstep(1.2, 2.6, r + abs(p.y) * .8 + wake * 2.);
        float edgeFoam = smoothstep(6.55, 6.95, r + (vn2(p * 3.) - .5) * .5);
        raft = max(raft, edgeFoam * .7 * smoothstep(.3, .6, vn2(fp * 1.7 + 4.)));
        float bub = vn2(fp * 14.) * .6 + vn2(fp * 37.) * .4;
        float ndl = max(dot(N, uSunDir), 0.);
        vec3 amb = uSkyCol * 1.1;
        vec3 foamC = uFoam * (.3 + 1.1 * bub * bub) * (uSunCol * uShade * ndl * .8 + amb);
        foamC += uSunCol * uShade * step(.86, bub) * .35 * vec3(1., .8, .5);
        vec3 deep = uLiquor * (uSunCol * uShade * .25 + amb);
        vec3 c = mix(deep, refl, clamp(fres + mix(.10, .5, clothM), 0., 1.));
        // the vat's copper skin drifting between the foam
        float skin = smoothstep(.5, .72, fbm2(fp * .7 + uSeed * 3. + 5.) + .12 * (vn2(fp * 5.) - .5)) * smoothstep(.8, 2.2, r) * (1. - raft) * (1. - wake);
        float ir = clamp(1. - dot(N, V), 0., 1.);
        vec3 film = mix(vec3(1.0, .47, .2), vec3(.62, .3, .78), ir * ir) * (.8 + .4 * vn2(fp * 9. + 3.));
        c = mix(c, film * (refl * 1.15 + amb * .22 + uSunCol * uShade * (.06 + .5 * pow(sg, 24.))), skin * .7 * (1. - clothM * .6));
        c = mix(c, foamC + refl * .06, raft * .9);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`})}function St(i,r){return new e.ShaderMaterial({uniforms:i,fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:Ce+`
      varying vec3 vL; varying vec2 vWxz;
      void main(){ vL = position; vWxz = (modelMatrix * vec4(position, 1.)).xz; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Ae+K+Ve+`
      uniform vec3 uEarth, uStain, uSunLocal, uLegA[4], uLegB[4]; uniform vec4 uRunnel; uniform float uWet;
      uniform sampler2D uYardShade; uniform vec4 uYardXf; uniform float uYardOn; uniform vec3 uYardPos, uYardAmb;
      `+(r||"float yardCut(vec2 p){ return 0.; }")+`
      varying vec3 vL; varying vec2 vWxz;
      float segShadow(vec2 p, vec3 A, vec3 B, float rad){
        float ly = max(uSunLocal.y, .05);
        vec2 a = A.xz - uSunLocal.xz * (A.y / ly), b = B.xz - uSunLocal.xz * (B.y / ly);
        vec2 ab = b - a; float t = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
        float d = length(p - a - ab * t), hgt = mix(A.y, B.y, t), pen = .12 + hgt * .028;
        return (1. - smoothstep(rad - pen, rad + pen, d)) * (1. - .45 * smoothstep(8., 46., hgt));
      }
      void main(){
        setShade(0.);
        vec2 p = vL.xz; float r = length(p), ang = atan(p.y, p.x + 1e-5);
        // what needs the neighbouring pixels (the crack's width, the yard map's level) is taken before the cut: past a discard it is not defined
        float crv = abs(fbm2(p * .8 + 20.) - .5), crw = fwidth(crv) + 1e-4;
        vec2 yuv = (vWxz - uYardXf.xy) * uYardXf.zw; vec3 yardT = vec3(1.);
        if (uYardOn > .5) yardT = texture2D(uYardShade, yuv).rgb;
        if (yardCut(vWxz) > .5) discard;
        // packed ochre earth: mottling, pebbles, hairline cracks, pale worn footpaths
        float mo = fbm2(p * .35 + 4.), fi = vn2(p * 6.) * .6 + vn2(p * 19.) * .4;
        float peb = smoothstep(.78, .9, vn2(p * 11. + 50.));
        float cr = (1. - smoothstep(.6, 1.6, crv / crw)) * (1. - smoothstep(.01, .06, crw));
        vec3 alb = uEarth * (.72 + .4 * mo) * (.82 + .32 * fi);
        float path = (1. - smoothstep(.9, 2.4, abs(r - 11.2 + 1.3 * sin(ang * 2. + uSeed)))) * .8;
        path = max(path, (1. - smoothstep(1., 2.6, abs(p.x + 1.5 * sin(p.y * .12 + uSeed)))) * smoothstep(9., 13., p.y) * .8);
        alb = mix(alb, uEarth * 1.28 * (.9 + .12 * fi), path * (.5 + .4 * mo));
        alb *= 1. - .35 * cr * (1. - path); alb = mix(alb, alb * .55 + .04, peb * .7);
        // the blue halo: soaked at the lip, splashed and tracked further out
        float halo = exp(-max(r - ${ke.toFixed(1)}, 0.) / 3.0) * (.5 + .8 * mo);
        float splash = .6 * smoothstep(.6, .95, vn2(p * 1.6 + 9.) * .7 + .3 * vn2(p * 4.7 + 2.) + .25 * exp(-max(r - 9., 0.) / 5.)) * (1. - smoothstep(12., 19., r));
        float drag = (1. - smoothstep(.5, 1.6, abs(p.x) - .8)) * smoothstep(8., 9., abs(p.y)) * (1. - smoothstep(10., 17., abs(p.y))) * .5 * step(0., -p.y);
        float st = clamp(halo + splash * .7 + drag, 0., 1.);
        alb = mix(alb, uStain * (.6 + .5 * fi), st * .72);
        // run-off runnel: thin blue water trickling away from the lip
        vec2 rd = vec2(cos(uRunnel.x), sin(uRunnel.x)); float al = dot(p, rd), ac = dot(p, vec2(-rd.y, rd.x));
        ac += .9 * sin(al * .42 + uRunnel.y) + .25 * sin(al * 1.3 + uRunnel.y * 2.);
        float rw = .16 + .1 * vn2(vec2(al * .8, 3.)) + .5 * (1. - smoothstep(8., 10., al));
        float run = (1. - smoothstep(rw, rw + .1, abs(ac))) * step(7.5, al);
        float bank = (1. - smoothstep(rw, rw + .9, abs(ac))) * step(7.5, al);
        alb = mix(alb, alb * .55 + uStain * .25, bank * .7);
        float flow = vn2(vec2(al * 3. - uTime * 1.6, ac * 9.)) * .6 + vn2(vec2(al * 9. - uTime * 3.4, ac * 20.)) * .4;
        // wet look (after rain): darker, puddled
        float pud = smoothstep(.55, .7, fbm2(p * .22 + 77.)) * uWet;
        alb *= 1. - .45 * uWet;
        // light: hard sun with the cloth's stained-glass shadow, trunk and drum shadows, contact shade
        float ly = max(uSunLocal.y, .05);
        vec3 sunT = vec3(1.);
        float tz = -p.y / (abs(uSunLocal.z) > 1e-4 ? uSunLocal.z : 1e-4);
        if (tz > 0.) {
          float hy = ly * tz - (${O.toFixed(2)}), hx = p.x + uSunLocal.x * tz;
          float pen = .05 + hy * .012;
          float m = (1. - smoothstep(3. - pen, 3. + pen, abs(hx))) * smoothstep(-.2, .3, hy) * (1. - smoothstep(40.3, 41.3, hy));
          if (m > 0.) {
            vec2 q = vec2(hx, hy - uHaul); vec4 rr; float rid;
            float res = resist(q, .02 + hy * .01, rr, rid);
            float hn = max(hy + frontNudge(vec2(hx, hy)) * smoothstep(.5, 4., hy), 0.);
            vec3 dyed = dyeRamp(hn);
            vec3 tc = pow(mix(dyed, mix(uResLo, uResHi, smoothstep(1.5, 19., hn)), res * .9) + 1e-4, vec3(.72));
            sunT = mix(sunT, tc * mix(.55, .32, smoothstep(13., 30., hn)) * mix(1., 1.5, res), m);
          }
        }
        float sh = 0.;
        for (int i = 0; i < 4; i++) sh = max(sh, segShadow(p, uLegA[i], uLegB[i], i < 3 ? .5 : 1.25));
        sunT *= 1. - .88 * sh;
        float contact = 1. - .5 * exp(-max(r - ${ke.toFixed(1)}, 0.) * 1.6);
        for (int i = 0; i < 3; i++) contact *= 1. - .7 * exp(-length(p - uLegA[i].xz) * .9);
        vec3 ambK = vec3(1.);
        if (uYardOn > .5) {
          sunT *= yardT;
          float op = smoothstep(.1, .7, dot(textureLod(uYardShade, yuv, 4.).rgb, vec3(.3, .5, .2)));
          ambK = mix(uYardAmb, vec3(1.), op);
        }
        vec3 c = alb * (uSunCol * uShade * ly * sunT + (uSkyCol * contact + uGndCol * .2) * ambK);
        // water in the runnel and puddles mirrors the haze
        vec3 skyR = skyAt(normalize(vec3(.2 * (flow - .5), 1., .2 * (flow - .5)))) * .55 + uStain * .25;
        c = mix(c, skyR * (.8 + .5 * flow) + uSunCol * uShade * step(.93, flow) * 1.5 * sunT, run * .9);
        c = mix(c, skyAt(vec3(0., 1., 0.)) * .5 * (sunT * .5 + .5), pud * .8);
        float a = 1. - smoothstep(16., 25.5, r + (mo - .5) * 2.);
        gl_FragColor = vec4(c, a);
        #include <fog_fragment>
      }`})}function Mt(i,r,a){const s=[],F=[],g=[],M=[];for(let C=0;C<i;C++){const w=r();let y,x,b;w<.72?(y=r.sign()*r.range(2.82,2.98),x=.8+17*Math.pow(r(),1.7),b=r.range(-.35,.35)):w<.9?(y=r.range(-2.9,2.9),x=.5+3.5*r(),b=r.range(-.25,.25)):(y=r.sign()*r.range(2.8,2.98),x=r.range(17,30),b=r.range(-.4,.4));const n=Math.sqrt(2*(x-O)/9.8),p=n+r.range(.15,1.4),A=r(),T=C*4;for(let Y=0;Y<4;Y++)s.push(y,x,b,A),F.push(Y%2?1:-1,Y<2?0:1,1/p,r()),M.push(y,x,b);g.push(T,T+1,T+2,T+1,T+3,T+2)}const v=new e.BufferGeometry;v.setAttribute("position",new e.Float32BufferAttribute(M,3)),v.setAttribute("aD",new e.Float32BufferAttribute(s,4)),v.setAttribute("aE",new e.Float32BufferAttribute(F,4)),v.setIndex(g),v.boundingSphere=new e.Sphere(new e.Vector3(0,14,0),20);const S=new e.ShaderMaterial({uniforms:a,transparent:!0,depthWrite:!1,blending:e.AdditiveBlending,side:e.DoubleSide,vertexShader:K+We+`
      attribute vec4 aD, aE; uniform vec2 uPx;
      varying vec2 vQ; varying float vA, vY0;
      void main(){
        float tt = uTime * aE.z + aD.w, age = fract(tt), per = 1. / aE.z;
        float tf = age * per, drop = 4.9 * tf * tf, y = aD.y - drop;
        float vel = 9.8 * tf, len = clamp(vel * .05, .14, 1.1);
        float alive = step(${O.toFixed(2)}, y) ;
        // a bead swells at the hem before it lets go
        float hang = 1. - smoothstep(0., .12, tf);
        vec3 c = vec3(aD.x + sin(tt * 3. + aD.w * 40.) * .03, y + aE.y * len, aD.z + sin(aD.y * .16 - uTime * 1.9) * .3 * uWind * hang);
        c.xz = twistXZ(c.xz, twistAt(aD.y + .5));
        vec4 mv = modelViewMatrix * vec4(c, 1.);
        float w = max(.028 + .03 * hang, -mv.z * uPx.y * .85);
        mv.x += aE.x * w * alive;
        vQ = vec2(aE.x, aE.y); vA = alive * (.55 + .45 * aE.w) * min(1., (.028 + .03 * hang) / w * 2.2); vY0 = aD.y;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:K+`
      uniform vec3 uDripLo, uDripHi;
      varying vec2 vQ; varying float vA, vY0;
      void main(){
        setShade(vY0);
        float a = (1. - vQ.x * vQ.x) * (.35 + .65 * (1. - vQ.y) * (1. - vQ.y)) * smoothstep(0., .08, 1. - vQ.y);
        vec3 col = mix(uDripLo, uDripHi, smoothstep(2., 14., vY0));
        gl_FragColor = vec4(col * (uSunCol * uShade * .9 + uSkyCol * .6) * a * vA, 1.);
      }`}),k=new e.Mesh(v,S);return k.renderOrder=3,k}const Ge={noon:{sun:[-.269,.883,-.385],sunCol:["#fff3dc",2.5],sky:["#8fa6d6",.42],gnd:["#c99a5a",.2],haze:["#ede6d6",.95],zen:["#a9bcd8",.8],wet:0},evening:{sun:[.62,.3,-.72],sunCol:["#ffcf96",2.3],sky:["#9a86c8",.36],gnd:["#b0764a",.16],haze:["#f0c8a8",.8],zen:["#8f86c4",.6],wet:0},rain:{sun:[-.3,.84,-.45],sunCol:["#ffffff",2.7],sky:["#3f6fd0",.5],gnd:["#7a6248",.14],haze:["#9cc0ee",.85],zen:["#2a5fc8",.8],wet:1},night:{sun:[-.35,.8,-.48],sunCol:["#b8c8ff",.5],sky:["#2a3a78",.22],gnd:["#1a2040",.1],haze:["#27325e",.5],zen:["#0c1230",.5],wet:0}},Re=(i,r,a)=>new e.Color().setHSL((i%1+1)%1,r,a);async function Ct(i,r={}){const a=i.rng.fork?i.rng.fork("indigo-hero"):i.rng,s=i.quality?.detail??1,F=(r.palette&&r.palette.length>=6?r.palette:mt).map(t=>new e.Color(t)),[g,M,v,S,k,C]=F,w=Ge[r.look]||Ge.noon,y=t=>new e.Color(t[0]).multiplyScalar(t[1]),x={},b={};C.getHSL(x),S.getHSL(b);const n=a.range(-.012,.012),p=[C.clone().lerp(Re(x.h+.012,.9,.42),.5),Re(E(x.h,b.h,.47)+n,.92,.235),Re(E(x.h,b.h,.72)+n,.92,.225),Re(b.h-.015,.8,.34),S.clone().lerp(v,.74)],A=r.pattern??a.int(0,2),T=[[0,1.45,1.9,.5],[1,1.5,2.25,.5],[2,1.95,2.35,.64]][A],Y=a.sign(),B=r.cwSide??Y,d=e.UniformsUtils.merge([e.UniformsLib.fog,{}]);Object.assign(d,{uSunDir:{value:new e.Vector3(...w.sun).normalize()},uSunLocal:{value:new e.Vector3(...w.sun).normalize()},uSunCol:{value:y(w.sunCol)},uSkyCol:{value:y(w.sky)},uGndCol:{value:y(w.gnd)},uHazeCol:{value:y(w.haze)},uZenCol:{value:y(w.zen)},uTime:{value:0},uHaul:{value:0},uWind:{value:1},uTwist:{value:0},uGlow:{value:.62},uAmbK:{value:1},uShade0:{value:1},uShadeY:{value:new e.Vector3(-100,-99,1)},uYardShade:{value:null},uYardXf:{value:new e.Vector4(0,0,1,1)},uYardOn:{value:0},uYardPos:{value:new e.Vector3},uYardAmb:{value:new e.Vector3(1,1,1)},uWet:{value:w.wet},uRamp:{value:p},uSeed:{value:a.range(0,50)},uPat:{value:new e.Vector4(...T)},uResLo:{value:g.clone().lerp(C,.22).multiplyScalar(.92)},uResHi:{value:g.clone().lerp(k,.55).multiplyScalar(.9)},uRaffia:{value:M.clone().lerp(g,.35)},uFoam:{value:new e.Color("#7c6a4c").lerp(M,.18).multiplyScalar(.72)},uLiquor:{value:v.clone().multiplyScalar(.22)},uEarth:{value:M.clone().lerp(g,.12).multiplyScalar(.37)},uStain:{value:S.clone().lerp(v,.1).multiplyScalar(.95)},uDripLo:{value:C.clone().lerp(g,.45).multiplyScalar(.8)},uDripHi:{value:k.clone().lerp(g,.4).multiplyScalar(.7)},uDrumAng:{value:0},uBasketDy:{value:0},uRopeLen:{value:1},uInvModel:{value:new e.Matrix4},uModel:{value:new e.Matrix4},uPx:{value:new e.Vector2(.001,.001)},uRunnel:{value:new e.Vector4(a.range(-.5,.5)+(B>0?2.6:.5),a.range(0,6),0,0)},uLegA:{value:[]},uLegB:{value:[]}});const U=new e.Group;U.name="indigo-pits-hero";const f=new tt,Pe=new e.Color,X=new e.Color("#a8987a").lerp(M,.18),se=new e.Color("#5d5140"),q=new e.Color("#b59c6c").lerp(M,.2),ge=new e.Color("#33281d"),ot=new e.Color("#b8b1a0").lerp(g,.2).multiplyScalar(.5),Ie=new e.Color("#8d8270"),nt=M.clone().lerp(g,.12).multiplyScalar(.5),be=new e.Color("#84684a"),Se=S.clone().lerp(v,.5);{const t=[[6.96,-.9],[6.98,-.3],[7,-.04],[7.05,.07],[7.2,.14],[7.62,.15],[8.05,.13],[8.36,.07],[8.6,0],[8.8,-.08]].reverse().map(u=>new e.Vector2(u[0],u[1])),o=new e.LatheGeometry(t,144),l=o.attributes.position,c=o.attributes.normal,h=[];for(let u=0;u<9;u++)h.push([a.range(0,G),a.range(.08,.2),a.range(.03,.09)]);const V=7+a.int(0,3),P=a.range(0,1);for(let u=0;u<l.count;u++){const m=l.getX(u),z=l.getY(u),L=l.getZ(u),_=Math.hypot(m,L),H=Math.atan2(L,m);let ae=.05*i.noise.n2(Math.cos(H)*3.1,Math.sin(H)*3.1)+.02*i.noise.n2(Math.cos(H)*11,Math.sin(H)*11+5),ne=z>-.02?.025*i.noise.n2(m*.9,L*.9):0;for(const Z of h){let ie=Math.abs(H-Z[0]+Math.PI);ie=Math.abs((ie%G+G)%G-Math.PI),ie<Z[1]&&z>0&&(ne-=Z[2]*(1-ie/Z[1])*(_<7.5?1:.3))}const oe=(_+ae*(z>-.1?1:.3))/_;l.setXYZ(u,m*oe,z+ne,L*oe)}o.computeVertexNormals();for(let u=0;u<t.length;u++){const m=u,z=144*t.length+u;c.setXYZ(z,c.getX(m),c.getY(m),c.getZ(m))}await i.yield?.(),f.add(o,new e.Matrix4,{mat:2,colorFn:(u,m,z,L)=>{const _=Math.hypot(u,z),H=Math.atan2(z,u);L.copy(ot),Math.abs((H/G+1+P)*V%1-.5)<.012*V/7&&m>0&&L.multiplyScalar(.55);const ne=i.noise.n2(Math.cos(H)*7,Math.sin(H)*7)*.5+.5,oe=i.noise.n2(H*23,1.7)*.5+.5;let Z=j(7.9,7.05,_)*(.55+.45*ne)+j(.55,.9,oe)*j(8.6,7.4,_)*.6;Z+=(1-j(0,1.2,Math.abs(Math.abs(u)-3.2)))*.25*(Math.abs(z)<7.6?1:0),m<-.03&&(Z=1),L.lerp(Se,we(Z,0,1)*.86),m<-.03&&L.multiplyScalar(E(.25,.7,j(-.9,-.03,m))*(.8+.2*Math.sin(m*60))),_>8.4&&L.lerp(nt,.5)}})}await i.yield?.();const ce=()=>a.range(-.12,.12),rt=new e.Vector3(5.3,R,N),lt=new e.Vector3(-5.3,R,N),Oe=new e.Vector3(11.15+ce(),-.4,1.5+ce()*.5),Xe=new e.Vector3(-11.15+ce(),-.4,1.5+ce()*.5),Ee=new e.Vector3(7+ce()*2,-.4,-9.5+ce()),Te=(t,o,l)=>t.clone().add(o.clone().sub(t).multiplyScalar((l-t.y)/(o.y-t.y))),D=[{foot:Oe,top:Te(Oe,rt,45.2),name:"right"},{foot:Xe,top:Te(Xe,lt,45),name:"left"},{foot:Ee,top:Te(Ee,new e.Vector3(0,44.6,-2.32),45.5),name:"back"}],re=(t,o)=>t.foot.clone().lerp(t.top,(o-t.foot.y)/(t.top.y-t.foot.y)),ue=(t,o)=>E(.56,.3,we((o-t.foot.y)/(t.top.y-t.foot.y),0,1)),it=(t,o,l)=>(c,h,V,P)=>{const u=Math.sin(Math.floor((c*52+t)*1)*12.9898+t)*.5+.5;V.copy(se).lerp(X,.55+.45*j(1,30,P)).multiplyScalar(.82+.3*u);const m=.9+.1*Math.sin(h+2);V.multiplyScalar(m),P<3.2&&V.lerp(Se,(1-j(.2,3.2,P))*(.35+.3*Math.sin(h*3+t))),P<.5&&V.multiplyScalar(.6)};for(let t=0;t<3;t++){const o=D[t],l=a.range(0,50),c=a.range(0,6),h=o.top.clone().sub(o.foot).normalize();W(f,o.foot,o.top,{step:.3,radial:14,mat:0,bow:a.range(.12,.3),bowDir:new e.Vector3(a.range(-1,1),0,a.range(-1,1)).normalize(),lump:.035,phase0:c,v0:a.range(0,30),radiusFn:(m,z)=>{const L=z/.9%1;return E(.56,.3,m)*(1+.055*(L<.85?L/.85-.5:(1-L)/.15-.5))*(1+.25*Math.exp(-z*.7))},colorFn:it(l)}),await i.yield?.();const V=He(h),P=a.range(0,Math.PI);for(const m of[-1,1]){const z=V.u.clone().multiplyScalar(Math.cos(P)*m).addScaledVector(V.w,Math.sin(P)*m),L=o.top.clone().addScaledVector(h,a.range(1.1,1.5)).addScaledVector(z,a.range(.45,.7));W(f,o.top.clone().addScaledVector(h,-.35),L,{rings:5,radial:8,mat:0,cap:!0,bow:.08,bowDir:z,v0:a.range(0,9),radiusFn:_=>E(.24,.11,_),colorFn:(_,H,ae)=>ae.copy(X).multiplyScalar(.8+.25*_)})}for(const m of[a.range(13,16),a.range(28,31)])Q(f,re(o,m),h,ue(o,m)+.03,a.range(1.5,2.2),9,q,a);const u=6+a.int(0,2);for(let m=0;m<u;m++){const z=m/u*G+a.range(-.3,.3),L=a.range(.85,1.25),_=a.range(.32,.6);Le(f,o.foot.x+Math.cos(z)*L-h.x*.4,.05+_*.2,o.foot.z+Math.sin(z)*L-h.z*.4,_*a.range(.9,1.3),_*.75,_,Ie,a)}await i.yield?.()}d.uLegA.value=[D[0].foot.clone().setY(0),D[1].foot.clone().setY(0),D[2].foot.clone().setY(0),new e.Vector3(-3.6,R,N)],d.uLegB.value=[D[0].top.clone(),D[1].top.clone(),D[2].top.clone(),new e.Vector3(3.6,R,N)],await i.yield?.();const ee=44.2,le=-1.98;W(f,new e.Vector3(-5.9,ee-.05,le),new e.Vector3(5.9,ee+.08,le),{step:.4,radial:10,mat:0,cap:!0,bow:.1,bowDir:new e.Vector3(0,1,0),v0:3,radiusFn:t=>.27-.05*Math.abs(t-.5),colorFn:(t,o,l)=>l.copy(X).multiplyScalar(.78+.2*Math.sin(t*40)*Math.sin(t*7))});const Ze=new e.Vector3(1,0,0);for(let t=0;t<3;t++){const o=D[t],l=re(o,ee),c=o.top.clone().sub(o.foot).normalize();Q(f,l,c,ue(o,ee)+.03,1.5,10,q,a),Q(f,new e.Vector3(l.x+(t===2?0:Math.sign(l.x)*.1),ee,le),Ze,.28,1.3,9,q,a),ye(f,[l.clone().add(new e.Vector3(.25,.5,0)),new e.Vector3(l.x+.3,ee-.35,(l.z+le)/2),l.clone().add(new e.Vector3(-.25,.5,0)),new e.Vector3(l.x-.3,ee+.4,(l.z+le)/2),l.clone().add(new e.Vector3(.25,.5,0))],.07,{color:q,segs:20,radial:5});const h=a.range(1.6,3.2);ye(f,[l.clone().add(new e.Vector3(.3,-.6,.3)),l.clone().add(new e.Vector3(.42,-.6-h*.5,.42)),l.clone().add(new e.Vector3(.4,-.6-h,.5))],.06,{color:q,segs:8,radial:5,shadeFn:V=>1-.3*V})}await i.yield?.();for(const t of[0,1]){const o=re(D[2],33.5+t),l=re(D[t],36-t*.6),c=l.clone().sub(o).normalize();W(f,o.clone().addScaledVector(c,-.7),l.clone().addScaledVector(c,.8),{step:.4,radial:9,mat:0,cap:!0,bow:.08,bowDir:new e.Vector3(0,1,0),v0:11*t,radiusFn:h=>E(.21,.16,h),colorFn:(h,V,P)=>P.copy(X).multiplyScalar(.72+.12*Math.sin(h*31))}),Q(f,o,c,.24,.9,7,q,a),Q(f,l,c,.2,.9,7,q,a),Q(f,re(D[2],33.5+t),D[2].top.clone().sub(D[2].foot).normalize(),ue(D[2],34)+.03,1,7,q,a),Q(f,l,D[t].top.clone().sub(D[t].foot).normalize(),ue(D[t],36)+.03,1,7,q,a)}await i.yield?.();for(let t=2.6,o=0;t<43;t+=1.55,o++){const l=re(D[2],t),c=(o%2?.5:-.5)+a.range(-.15,.15),h=ue(D[2],t),V=new e.Vector3(Math.cos(c),a.range(-.05,.1),Math.sin(c)*.4).normalize();W(f,l.clone().addScaledVector(V,-(h+.55)),l.clone().addScaledVector(V,h+.55),{rings:2,radial:6,mat:0,cap:!0,v0:o,radiusFn:()=>.075,colorFn:(P,u,m)=>m.copy(se).lerp(X,.3+.5*Math.abs(P-.5))})}await i.yield?.();const te=[0,R,N],st=new e.Vector3(...te),ct=new e.Matrix4().makeRotationZ(-Math.PI/2),ut=t=>new e.Matrix4().makeTranslation(t,R,N).multiply(ct),I=B*6.75;W(f,new e.Vector3(-6.3+(B<0?-1.1:0),R,N),new e.Vector3(6.3+(B>0?1.1:0),R,N),{rings:16,radial:8,mat:5,kind:1,piv:te,cap:!0,radiusFn:()=>.24,colorFn:(t,o,l)=>l.copy(be).multiplyScalar(.7+.25*Math.sin(o*4))}),W(f,new e.Vector3(-3.42,R,N),new e.Vector3(3.42,R,N),{rings:6,radial:20,mat:5,kind:1,piv:te,radiusFn:()=>.98,colorFn:(t,o,l)=>l.copy(be)}),W(f,new e.Vector3(-3.03,R,N),new e.Vector3(3.03,R,N),{rings:24,radial:28,mat:6,kind:1,piv:te,radiusFn:t=>de-.035-.03*Math.pow(Math.abs(t-.5)*2,6),colorFn:(t,o,l)=>{l.copy(p[4]).multiplyScalar(.8+.25*Math.sin(o*2+t*9)+(Math.abs(t-.5)>.47?.5:0))}});for(const t of[-1,1]){const o=new e.RingGeometry(.96,de-.04,28,3);f.add(o,new e.Matrix4().makeTranslation(t*3.03,R,N).multiply(new e.Matrix4().makeRotationY(t*Math.PI/2)),{mat:6,kind:1,piv:te,colorFn:(V,P,u,m)=>{const z=Math.hypot(P-R,u-N);m.copy(p[4]).lerp(k,.25+.2*Math.sin(z*90)).multiplyScalar(.7)}});const l=[[.26,-.13],[1.5,-.13],[1.72,-.08],[1.78,0],[1.72,.08],[1.5,.13],[.26,.13]].map(V=>new e.Vector2(V[0],V[1]));f.add(new e.LatheGeometry(l,24),ut(t*3.5),{mat:5,kind:1,piv:te,uvScale:[1,.5],colorFn:(V,P,u,m)=>{const z=Math.hypot(P-R,u-N),L=Math.atan2(u-N,P-R);m.copy(be).multiplyScalar((.75+.25*Math.sin(Math.floor((L/G+.5)*8)*3.3))*(z>1.6?.7:1)*(z<.5?.6:1))}});const c=6,h=a.range(0,1);for(let V=0;V<c;V++){const P=(V+h)/c*G,u=Math.cos(P),m=Math.sin(P);W(f,new e.Vector3(t*3.5,R+u*.3,N+m*.3),new e.Vector3(t*3.5,R+u*2.55,N+m*2.55),{rings:3,radial:6,mat:0,kind:1,piv:te,cap:!0,v0:V,radiusFn:z=>E(.1,.07,z),colorFn:(z,L,_)=>_.copy(X).multiplyScalar(.6+.4*z)})}}await i.yield?.(),W(f,new e.Vector3(I-.5,R,N),new e.Vector3(I+.5,R,N),{rings:2,radial:14,mat:5,kind:1,piv:te,cap:!0,radiusFn:()=>.78,colorFn:(t,o,l)=>l.copy(be).multiplyScalar(.8)}),Q(f,new e.Vector3(I,R,N),Ze,.8,.8,7,ge.clone().lerp(q,.35),a,{kind:1,piv:te,thick:.13});for(const t of[0,1]){const o=re(D[t],R),l=D[t].top.clone().sub(D[t].foot).normalize(),c=ue(D[t],R);for(const h of[-.4,.4])W(f,new e.Vector3(o.x,R-.75,N+h),new e.Vector3(o.x+(t?.2:-.2),R+.6,N+h*1.15),{rings:2,radial:7,mat:0,cap:!0,radiusFn:()=>.12,colorFn:(V,P,u)=>u.copy(se).lerp(X,V)});Q(f,o.clone().addScaledVector(l,-.75),l,c+.03,1.3,10,q,a),Q(f,o.clone().addScaledVector(l,.9),l,c+.03,.7,6,q,a)}await i.yield?.();const fe=R,$=N-.8-.07,he=33.2;ye(f,[new e.Vector3(I,fe,$),new e.Vector3(I,fe-.5,$),new e.Vector3(I,fe-1,$)],.085,{color:ge.clone().lerp(q,.3),segs:2,radial:6,kind:3,piv:[I,fe,$]});{const t=[[.02,0],[.62,.03],[.86,.4],[.95,.95],[.9,1.35],[.97,1.42],[.97,1.5],[.84,1.5],[.8,1.3]].map(c=>new e.Vector2(c[0],c[1])),o=he-3.1,l=new e.Color("#a98a52").lerp(M,.3);f.add(new e.LatheGeometry(t,20),new e.Matrix4().makeTranslation(I,o,$).multiply(new e.Matrix4().makeScale(.9,1,.9)),{mat:3,kind:2,uvScale:[1,1],colorFn:(c,h,V,P)=>{P.copy(l).multiplyScalar(.65+.35*j(o,o+1.5,h)),h>o+1.38&&P.multiplyScalar(.7)}});for(let c=0;c<7;c++){const h=a.range(0,G),V=c===0?0:a.range(.25,.55);Le(f,I+Math.cos(h)*V,o+1.45+(c===0?.25:a.range(-.05,.12)),$+Math.sin(h)*V,.36,.3,.36,Ie,a,{kind:2})}for(let c=0;c<3;c++){const h=c/3*G+.4;ye(f,[new e.Vector3(I+Math.cos(h)*.95,o+1.46,$+Math.sin(h)*.95),new e.Vector3(I+Math.cos(h)*.4,o+2.4,$+Math.sin(h)*.4),new e.Vector3(I,he,$)],.06,{color:ge.clone().lerp(q,.3),segs:5,radial:5,kind:2})}Le(f,I,he,$,.16,.2,.16,ge.clone().lerp(q,.4),a,{kind:2})}if(await i.yield?.(),r.props!==!1){const t=a.shuffle([.9,2.3,3.9,5.4]);for(let u=0;u<2;u++){const m=t[u]+a.range(-.25,.25),z=Math.cos(m),L=Math.sin(m),_=a.range(0,6),H=new e.Vector3(z*5.5,-2.4,L*5.5),ae=new e.Vector3(z*7.04,.1,L*7.04),ne=ae.clone().sub(H).normalize(),oe=H.clone().addScaledVector(ne,a.range(8.2,9.6)),Z=[ae.x,ae.y,ae.z];W(f,H,oe,{step:.6,radial:7,mat:0,kind:4,phase:_,piv:Z,cap:!0,bow:.12,bowDir:new e.Vector3(-L,0,z),v0:u*5,radiusFn:qe=>E(.17,.12,qe),colorFn:(qe,pt,ze,vt)=>{ze.copy(X).multiplyScalar(.85),ze.lerp(Se,1-j(.2,2.6,vt))}});const ie=new e.Vector3(-L,0,z);W(f,oe.clone().addScaledVector(ie,-.55),oe.clone().addScaledVector(ie,.55),{rings:2,radial:6,mat:0,kind:4,phase:_,piv:Z,cap:!0,radiusFn:()=>.075,colorFn:(qe,pt,ze)=>ze.copy(X).multiplyScalar(.75)}),Q(f,oe.clone().addScaledVector(ne,-.12),ne,.1,.3,4,q,a,{kind:4,piv:Z,phase:_,thick:.06})}const o=t[2]+a.range(-.2,.2),l=Math.cos(o)*4.4,c=Math.sin(o)*4.4,h=M.clone().lerp(g,.35).multiplyScalar(.85),V=[[.02,-.5],[.36,-.42],[.56,-.16],[.62,.06],[.57,.08],[.51,-.13],[.31,-.35],[.02,-.41]].map(u=>new e.Vector2(u[0],u[1])),P=[l,O+.22,c];f.add(new e.LatheGeometry(V,18),new e.Matrix4().makeTranslation(l,O+.22,c),{mat:4,kind:5,phase:a.range(0,6),piv:P,colorFn:(u,m,z,L)=>{const _=Math.hypot(u-l,z-c);L.copy(h),_<.53&&m>O-.2&&L.lerp(Se,.75),L.multiplyScalar(.8+.2*Math.sin(Math.atan2(z-c,u-l)*9))}}),W(f,new e.Vector3(l+.55,O+.25,c),new e.Vector3(l+1.25,O+.5,c+.1),{rings:3,radial:6,mat:4,kind:5,piv:P,cap:!0,bow:.06,bowDir:new e.Vector3(0,1,0),radiusFn:u=>E(.12,.07,u),colorFn:(u,m,z)=>z.copy(h)})}await i.yield?.();const dt=yt(d),pe=new e.Mesh(await f.buildAsync(i),dt);pe.name="solids",pe.geometry.computeBoundingSphere(),pe.geometry.boundingSphere.radius+=26,U.add(pe),await i.yield?.();const De=new e.Mesh(xt(),gt(d));De.name="rising-length",U.add(De),await i.yield?.();const Ne=new e.CircleGeometry(Je+.04,72);Ne.rotateX(-Math.PI/2),Ne.translate(0,O,0);const Ye=new e.Mesh(Ne,bt(d));Ye.name="liquor",U.add(Ye);let ve=null;if(r.apron!==!1){const t=new e.RingGeometry(ke-.1,26,72,1);t.rotateX(-Math.PI/2),t.translate(0,.02,0),ve=new e.Mesh(t,St(d,r.apronCutGLSL)),ve.name="apron",ve.renderOrder=1,U.add(ve)}const ft=Math.max(60,Math.round((r.drips??320)*s)),_e=Mt(ft,a.fork?a.fork("drips"):a,d);_e.name="drips",U.add(_e),await i.yield?.();const je=[];for(let t=0;t<=12;t++){const o=t/12,l=E(-.7,G,o),c=E(17.5,13.5,j(0,1,o)),h=E(5.5,30,j(.05,1,o));je.push(new e.Vector3(c*Math.cos(l),h,-c*Math.sin(l)))}const Qe={clothBase:new e.Vector3(0,O,0),clothTop:new e.Vector3(0,R,0),clothNormal:new e.Vector3(0,0,1),clothWidth:et,center:new e.Vector3(0,20,0),gazeAt:t=>new e.Vector3(0,we(t,1,38),0),flyThrough:je,viewpoints:{arrive:new e.Vector3(0,5.5,60),waterline:new e.Vector3(15,5.5,14),closest:new e.Vector3(2,23.5,13.6),drumPass:new e.Vector3(12,29,7),leave:new e.Vector3(13.5,30,0)},legs:D.map(t=>({foot:t.foot.clone().setY(0),top:t.top.clone(),name:t.name})),perches:[new e.Vector3(-2.2,ee+.3,le),new e.Vector3(2.9,ee+.3,le),D[0].top.clone().add(new e.Vector3(0,1.3,0)),D[2].top.clone().add(new e.Vector3(0,1.3,0))],drum:st.clone(),basket:new e.Vector3(I,he-3.1,$),pitRadius:Je,lipRadius:ke,liquorY:O,clearRadius:12.4,wellRadius:27,sunDir:new e.Vector3(...Ge.noon.sun).normalize(),exitDir:new e.Vector3(0,0,-1)};let Me=null,$e=1;const Be=new e.Vector2,Ue=new e.Matrix4,ht=new e.Matrix3,me=(t,o,l=1)=>{o!==void 0&&(o.isColor?t.value.copy(o):t.value.set(o),l!==1&&t.value.multiplyScalar(l))},Ke={object:U,radius:13,height:46.5,center:Qe.center.clone(),anchors:Qe,ground:!0,groundY:-.92,uniforms:d,clothGLSL:Ve,commonGLSL:K,pattern:A,counterweightSide:B,parts:{solid:pe,cloth:De,liquor:Ye,apron:ve,drips:_e},setProgress(t,o=41){Me=we(t,0,1)*o*2},setHaul(t){Me=t},setWind(t){$e=we(t,0,2)},setTwist(t){d.uTwist.value=t},setGlow(t){d.uGlow.value=t},setLight(t={}){t.sunDir&&d.uSunDir.value.copy(t.sunDir).normalize(),me(d.uSunCol,t.sunColor),me(d.uSkyCol,t.skyColor),me(d.uGndCol,t.groundColor),me(d.uHazeCol,t.hazeColor),me(d.uZenCol,t.zenithColor),t.shade!==void 0&&(d.uShade0.value=t.shade),t.shadeY&&d.uShadeY.value.set(t.shadeY[0],t.shadeY[1],t.shadeY[2]??0),t.yardShade&&(d.uYardShade.value=t.yardShade.map,d.uYardXf.value.copy(t.yardShade.xf),d.uYardOn.value=1,t.yardShade.amb&&d.uYardAmb.value.copy(t.yardShade.amb)),t.wet!==void 0&&(d.uWet.value=t.wet)},update(t,o,l){d.uTime.value=o%3600;const c=Me!==null?Me:o*2;d.uHaul.value=c%600,d.uDrumAng.value=-(c/de%G);const h=c*.26%23;if(d.uBasketDy.value=-h,d.uRopeLen.value=fe-he+h,d.uWind.value=$e,d.uYardPos.value.setFromMatrixPosition(U.matrixWorld),d.uModel.value.copy(U.matrixWorld),Ue.copy(U.matrixWorld).invert(),d.uInvModel.value.copy(Ue),d.uSunLocal.value.copy(d.uSunDir.value).applyMatrix3(ht.setFromMatrix4(Ue)).normalize(),l&&i.renderer){i.renderer.getDrawingBufferSize(Be);const V=l.isPerspectiveCamera?Math.tan(l.fov*Math.PI/360):.5;d.uPx.value.set(2*V/Math.max(Be.x,1),2*V/Math.max(Be.y,1))}},dispose(){}};return Ke.update(0,0,null),Ke}export{tt as Acc,K as GLSL_COMMON,Q as addLashing,ye as addRope,Le as addStone,W as addTube,Ct as buildHero,He as frameOf};
