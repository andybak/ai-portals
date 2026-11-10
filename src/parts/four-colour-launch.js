import*as e from"three";import{clamp as me,lerp as ge,smoothstep as Ae}from"../kit/core.js";const Ce=["#EDE3C8","#22A7DB","#D9338A","#F6D21C","#16120E","#E4562A","#3F4EA3"],X=12,ct={flat:1,exposure:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0,aberration:0}},He=c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4),Xe=c=>{const l=String(c).replace("#","");return[0,2,4].map(s=>He(parseInt(l.slice(s,s+2),16)/255))},te=`
  uniform float uTime, uPx;            // seconds; world metres per pixel at 1 m distance
  uniform vec2 uReg;                   // plate registration: clip-space x offset of the magenta and of the cyan plate
  uniform vec3 uNoon;                  // unit vector toward the (never drawn) sun
  uniform vec3 uK, uPaperC;            // key black and bare paper, as scene values
  uniform vec4 uShip[${X}];    // lift (m), tilt about x, tilt about z, gantry arm angle
  uniform vec4 uShipB[${X}];   // burst star scale, flame light 0..1, shiver 0..1, speed 0..1
  uniform vec4 uPad[${X}];     // pad centre xyz (hero space), w = signed x offset of the gantry mast
  uniform vec4 uDrift[${X}];   // how far the ship has flown from over its pad: x, z (m); w = long-lens gain (ship drawn 1 + w times its size when far)
  uniform vec4 uShadow[8];             // moving blob shadows: xz centre, radius, strength (world space)
  float h11(float n){ return fract(sin(n*127.1)*43758.5453); }
  float h21(vec2 p){ p = fract(p*vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x*p.y); }
  float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f);
    return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
  float tri(float x){ return abs(fract(x) - 0.5)*2.; }
  mat2 rot2(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
  // the brush wobble of a hull line, from where the vertex is on the object
  float wobble(vec3 p){ return 0.72 + 0.56*vn2(vec2(p.x + p.z*0.7, p.y)*0.21 + 3.1) ; }
  // darkening of tone under the moving shadows, 0..1, at a world position (dots swell with it)
  float shadowAt(vec3 w){ float s = 0.;
    for (int i = 0; i < 8; i++){ vec4 b = uShadow[i]; float d = length(w.xz - b.xy)/max(b.z, 1e-3); s = max(s, b.w*(1. - smoothstep(0.55, 1.05, d))); }
    return s; }
`,Pe=`
  attribute vec2 aRig;
  // moves a hero-space point p and a direction n by the rig; returns the moved point
  // gZoom: the comic's long lens. A ship far down the row is drawn larger than life (about its own pad, the whole
  // ship, gantry and star together), easing to true size as the sled comes within 320 m, so the row reads from the entry.
  float gZoom = 1.;
  vec3 rig(vec3 p, inout vec3 n){
    if (aRig.x < -0.5) return p;
    int i = int(aRig.x + 0.5); vec4 s = uShip[i], b = uShipB[i], pad = uPad[i];
    float Z = 1. + uDrift[i].w; gZoom = Z;
    if (aRig.y < 0.5) return pad.xyz + (p - pad.xyz)*Z;
    if (aRig.y < 1.5 || (aRig.y > 3.5 && aRig.y < 4.5)){
      vec3 c = pad.xyz + vec3(0., 40., 0.), q = p - c;
      if (aRig.y > 3.5) q.y = -41. + (q.y + 41.)*b.w;                         // speed lines grow out of the tail
      mat2 rx = rot2(s.y), rz = rot2(s.z);
      q.yz = rx*q.yz; n.yz = rx*n.yz; q.xy = rz*q.xy; n.xy = rz*n.xy;
      float sh = b.z*0.22; q.x += sh*sin(uTime*31. + float(i)); q.z += sh*sin(uTime*27. + 1.7);
      return c + q*Z + vec3(uDrift[i].x, s.x + 40.*(Z - 1.), uDrift[i].y);                    // lift, and the flight down the row that leans the column
    }
    if (aRig.y < 2.5){ vec3 c = pad.xyz + vec3(pad.w, 0., 0.), q = p - c; mat2 r = rot2(s.w); q.xz = r*q.xz; n.xz = r*n.xz; return pad.xyz + (c - pad.xyz + q)*Z; }
    if (aRig.y < 3.5){ vec3 c = pad.xyz + vec3(0., 7., 0.); return pad.xyz + (c - pad.xyz + (p - c)*b.x)*Z; }
    vec3 c = pad.xyz; float k = 1./(1. + s.x*0.03); return c + ((p - c)*vec3(k, 1., k) + vec3(-s.x*0.25, 0., s.x*0.35)*k)*vec3(Z, 1., Z);
  }
`;function Je(c=Ce,l={}){const s=Ce.map((a,o)=>c&&c[o]||a),M=a=>new e.Color(a),d={paper:M(s[0]),cyan:M(s[1]),magenta:M(s[2]),yellow:M(s[3]),black:M(s[4]),orange:M(s[5]),violet:M(s[6])},v=s.map(Xe),i=[0,1,2].map(a=>v[1][a]*v[3][a]/Math.max(v[0][a],.001));d.green=new e.Color().setRGB(i[0],i[1],i[2],e.LinearSRGBColorSpace);const p=(a,o,f)=>new e.Vector3(...["r","g","b"].map(g=>o[g]>.02?Math.min(a[g]/o[g],4):f?f[g]:1)),h=p(d.magenta,d.paper),m={r:h.x,g:h.y,b:h.z},u=p(d.cyan,d.paper),F={r:u.x,g:u.y,b:u.z},I={yellow:p(d.yellow,d.paper),cyan:u,magenta:h,magentaOnYellow:p(d.orange,d.yellow,m),cyanOnYellow:p(d.green,d.yellow,F)},t=a=>Array.from({length:a},()=>new e.Vector4),w={uTime:{value:0},uPx:{value:.002},uReg:{value:new e.Vector2(.0012,-3e-4)},uNoon:{value:new e.Vector3(.42,.86,-.29).normalize()},uK:{value:d.black},uPaperC:{value:d.paper},uShip:{value:t(X)},uShipB:{value:t(X)},uPad:{value:t(X)},uDrift:{value:t(X)},uShadow:{value:t(8)}},k=[],P=a=>(k.push(a),a),N=(a={})=>P(new e.ShaderMaterial({uniforms:{...w},side:a.side??e.FrontSide,vertexShader:`
      ${te} ${Pe}
      attribute vec3 color; attribute vec3 aMark;
      varying vec3 vCol, vN, vP, vVN; varying vec2 vMark; varying float vFine;
      void main(){ vec3 n = normal; vec3 p = rig(position, n); vP = position; vCol = color; vMark = aMark.xy;
        vN = mat3(modelMatrix)*n; vVN = normalMatrix*n;
        // fine bracing (aMark.z < 0) loses its spotted black with its outline once a bay is under a few pixels: a far
        // gantry is bare paper with a few strokes (arms, mast head), so the ships beside it stand clear
        vec4 wp = modelMatrix*vec4(p, 1.);
        vFine = aMark.z < 0. ? smoothstep(4., 7., 6./max(uPx*length(cameraPosition - wp.xyz), 1e-5)) : 1.;
        gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:`
      ${te}
      varying vec3 vCol, vN, vP, vVN; varying vec2 vMark; varying float vFine;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.)); vec3 vn = normalize(vVN + vec3(0., 0., 1e-5));
        if (!gl_FrontFacing){ n = -n; vn = -vn; }
        // spotted black: a toothed, noise-feathered threshold on the facing to noon
        float teeth = (tri(dot(vP, vec3(0.37, 0.21, 0.29))) - 0.5)*0.26 + (vn2(vP.xy*0.33 + vP.z*0.19) - 0.5)*0.34;
        float e = dot(n, uNoon) + teeth; float thr = mix(-2.2, -0.08, vMark.x);
        float aa = fwidth(e)*0.75 + 1e-4; float k = (1. - smoothstep(thr - aa, thr + aa, e))*vFine;
        // chrome: one black squiggle riding the view-space normal, broken into dashes along the height
        float c = vn.x*0.92 + vn.y*0.2 + 0.05*sin(vP.y*0.41) + 0.03*sin(vP.y*1.37 + 1.);
        float w = 0.035 + 0.03*vn2(vec2(vP.y*0.11, 7.)); float ca = fwidth(c)*0.75 + 1e-4;
        float sq = (1. - smoothstep(w - ca, w + ca, abs(c + 0.6)))*smoothstep(0.38, 0.42, vn2(vec2(vP.y*0.045, 3.)));
        k = max(k, sq*vMark.y);
        gl_FragColor = vec4(mix(vCol, uK, k), 1.);
      }`})),y=(a={})=>P(new e.ShaderMaterial({uniforms:{...w,uWidth:{value:a.width??1}},side:e.BackSide,vertexShader:`
      ${te} ${Pe}
      uniform float uWidth; attribute vec3 aHullN; attribute vec3 aMark;
      void main(){ vec3 n = aHullN; vec3 p = rig(position, n);
        vec4 w = modelMatrix*vec4(p, 1.); vec3 wn = normalize(mat3(modelMatrix)*n + vec3(0., 1e-5, 0.));
        float shade = 0.5 - 0.5*dot(wn, uNoon); float dist = length(cameraPosition - w.xyz);
        float wd = abs(aMark.z)*uWidth*mix(0.5, 1.55, shade)*wobble(position);
        wd = abs(aMark.z) > 0. ? max(wd, 1.5*uPx*dist) : 0.;
        if (aMark.z < 0.) wd *= smoothstep(4., 7., 6./max(uPx*dist, 1e-5));       // fine bracing: dropped when a bay is under a few pixels
        w.xyz += wn*wd; gl_Position = projectionMatrix*viewMatrix*w; }`,fragmentShader:"uniform vec3 uK; void main(){ gl_FragColor = vec4(uK, 1.); }"})),z={transparent:!0,depthWrite:!1,blending:e.CustomBlending,blendEquation:e.AddEquation,blendSrc:e.DstColorFactor,blendDst:e.ZeroFactor,blendSrcAlpha:e.ZeroFactor,blendDstAlpha:e.OneFactor},B={yellow:[0,0],magenta:[1,0],cyan:[0,1]},x=(a,o)=>a==="magenta"&&o==="yellow"?I.magentaOnYellow:a==="cyan"&&o==="yellow"?I.cyanOnYellow:I[a],V=(a="cyan",o="paper",f={})=>P(new e.ShaderMaterial({uniforms:{...w,uF:{value:x(a,o)},uRegW:{value:new e.Vector2(...B[a])},uGain:{value:f.gain??1}},...z,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-4,vertexShader:`
      ${te} ${Pe}
      uniform vec2 uRegW; uniform float uGain;
      attribute vec3 iPos, iNrm; attribute vec4 iTone;
      varying vec2 vUv; varying vec2 vK;
      void main(){ vec3 n = iNrm; vec3 c = rig(iPos, n);
        vec4 w = modelMatrix*vec4(c, 1.); vec3 wn = normalize(mat3(modelMatrix)*n + vec3(0., 1e-5, 0.));
        float light = aRig.x > -0.5 ? uShipB[int(aRig.x + 0.5)].y : 0.;
        float tone = clamp((iTone.x + iTone.z*shadowAt(w.xyz) + iTone.w*light)*uGain, 0., 1.);
        vec3 toCam = cameraPosition - w.xyz; float dist = length(toCam);
        float pitch = iTone.y*gZoom; float px = pitch/max(uPx*dist, 1e-5); float f = smoothstep(2.6, 4.6, px);       // 1 = real discs, 0 = flat tint
        if (aRig.x > -0.5) tone *= mix(0.3, 1., f);                      // a far ship's screen drops out toward bare paper (distance is printed, not fogged)
        float r = pitch*sqrt(tone*0.3183)*1.02; float hs = mix(pitch*0.5, r*1.08, f);
        if (tone < 0.004 || dot(wn, toCam) < 0.) hs = 0.;
        vec3 t = normalize(cross(wn, abs(wn.y) > 0.9 ? vec3(1., 0., 0.) : vec3(0., 1., 0.))), b = cross(wn, t);
        w.xyz += (t*position.x + b*position.y)*hs + wn*(0.03 + dist*0.0006);
        vUv = position.xy*mix(1., 1.08, f); vK = vec2(f, mix(tone, 1., f));
        gl_Position = projectionMatrix*viewMatrix*w; gl_Position.x += dot(uReg, uRegW)*gl_Position.w; }`,fragmentShader:`
      uniform vec3 uF; varying vec2 vUv; varying vec2 vK;
      void main(){ float d = length(vUv); float aa = fwidth(d)*0.8 + 1e-4;
        float a = mix(1., 1. - smoothstep(1. - aa, 1. + aa, d), vK.x)*vK.y;
        if (a < 0.004) discard;
        gl_FragColor = vec4(mix(vec3(1.), uF, a), 1.); }`})),R=(a="magenta",o="yellow")=>P(new e.ShaderMaterial({uniforms:{...w,uF:{value:x(a,o)},uRegW:{value:new e.Vector2(...B[a])}},...z,polygonOffset:!0,polygonOffsetFactor:-12,polygonOffsetUnits:-4,side:e.FrontSide,vertexShader:`
      ${te} ${Pe}
      uniform vec2 uRegW;
      void main(){ vec3 n = normal; vec3 p = rig(position, n);
        gl_Position = projectionMatrix*modelViewMatrix*vec4(p, 1.); gl_Position.x += dot(uReg, uRegW)*gl_Position.w; }`,fragmentShader:"uniform vec3 uF; void main(){ gl_FragColor = vec4(uF, 1.); }"})),A=new e.Vector2;return{palette:s,ink:d,factor:I,uniforms:w,plateBlend:z,paperMaterial:N,hullMaterial:y,dotMaterial:V,plateMaterial:R,tick:(a,o,f,g)=>{w.uTime.value=o,g&&f&&(g.getDrawingBufferSize(A),w.uPx.value=2/(Math.max(f.projectionMatrix.elements[5],.001)*Math.max(A.y,1)))},materials:k}}function Le(){const c=[],l=[],s=[],M=[],d=[],v=[],i=[];let p=0;const h=new e.Vector3,m=new e.Vector3,u=new e.Vector3,F=(t,w,k,P,N,y,z,B,x,V,R,A=1)=>{h.set(w,k,P),m.set(N,y,z),u.set(B,x,V),t.m&&(h.applyMatrix4(t.m),m.transformDirection(t.m),u.transformDirection(t.m));const n=R||t.col,a=t.rig||[-1,0],o=t.mark||[0,0,.25];return c.push(h.x,h.y,h.z),l.push(m.x,m.y,m.z),s.push(u.x,u.y,u.z),M.push(n.r,n.g,n.b),d.push(a[0],a[1]),v.push(o[0],o[1],o[2]*A),p++};return{get vertexCount(){return p},get triCount(){return i.length/3},vert:F,tri:(t,w,k)=>i.push(t,w,k),lathe(t,w,k){const P=t.length,N=p;for(let y=0;y<P;y++){const z=t[Math.max(0,y-1)],B=t[Math.min(P-1,y+1)],x=t[y];let V=B[0]-z[0],R=B[1]-z[1];y>0&&t[y-1][0]===x[0]&&t[y-1][1]===x[1]?(V=B[0]-x[0],R=B[1]-x[1]):y<P-1&&t[y+1][0]===x[0]&&t[y+1][1]===x[1]&&(V=x[0]-z[0],R=x[1]-z[1]);const A=Math.hypot(V,R)||1,n=R/A,a=-V/A;for(let o=0;o<=w;o++){const f=o/w*Math.PI*2,g=Math.cos(f),T=Math.sin(f);F(k,x[0]*g,x[1],x[0]*T,n*g,a,n*T,n*g,a,n*T,x[2],x[3]??1)}}for(let y=0;y<P-1;y++)for(let z=0;z<w;z++){const B=N+y*(w+1)+z,x=B+w+1;t[y][0]>1e-4&&i.push(B,x,B+1),t[y+1][0]>1e-4&&i.push(B+1,x,x+1)}},beam(t,w,k,P,N,y=[0,1,0]){const z=new e.Vector3(...t),B=new e.Vector3(...w),x=B.clone().sub(z),V=x.length()||1;x.multiplyScalar(1/V);const R=new e.Vector3(...y);Math.abs(x.dot(R))>.95&&R.set(1,0,0);const A=new e.Vector3().crossVectors(R,x).normalize(),n=new e.Vector3().crossVectors(x,A),a=(f,g,T)=>z.clone().addScaledVector(x,T>0?V:0).addScaledVector(A,f*k*.5).addScaledVector(n,g*P*.5),o=[[A,1,0,0],[A,-1,0,0],[n,0,1,0],[n,0,-1,0],[x,0,0,1],[x,0,0,-1]];for(const[f,g,T,S]of o){const C=g+T+S,K=f.clone().multiplyScalar(C),L=[],J=[[-1,-1],[1,-1],[1,1],[-1,1]];for(const[re,ae]of J){const q=g||re,E=T||(g?re:ae),D=S||ae,_=a(q,E,D),Y=A.clone().multiplyScalar(q).addScaledVector(n,E).addScaledVector(x,D*.5).normalize();L.push(F(N,_.x,_.y,_.z,K.x,K.y,K.z,Y.x,Y.y,Y.z))}(g?C:T?-C:C)<0?i.push(L[0],L[2],L[1],L[0],L[3],L[2]):i.push(L[0],L[1],L[2],L[0],L[2],L[3])}},plate(t,w,k,P=.35,N){const y=t.length;let z=0,B=0;for(const n of t)z+=n[0]/y,B+=n[1]/y;let x=0;for(let n=0;n<y;n++){const a=t[n],o=t[(n+1)%y];x+=a[0]*o[1]-o[0]*a[1]}const V=x>0?1:-1,R=e.ShapeUtils.triangulateShape(t.map(n=>new e.Vector2(n[0],n[1])),[]),A=[];for(let n=0;n<y;n++){const a=t[(n+y-1)%y],o=t[(n+1)%y],f=t[n];let g=(o[1]-a[1])*V,T=-(o[0]-a[0])*V;const S=Math.hypot(g,T)||1;g/=S,T/=S,A.push(F(k,f[0],f[1],0,g,T,0,g,T,0))}for(const n of[1,-1]){const a=t.map(o=>F(k,ge(o[0],z,P),ge(o[1],B,P),n*w*.5,0,0,n,0,0,n,N));for(const o of R){const f=t[o[0]],g=t[o[1]],T=t[o[2]];(g[0]-f[0])*(T[1]-f[1])-(g[1]-f[1])*(T[0]-f[0])>0===n>0?i.push(a[o[0]],a[o[1]],a[o[2]]):i.push(a[o[0]],a[o[2]],a[o[1]])}for(let o=0;o<y;o++){const f=(o+1)%y;n*V>0?i.push(A[o],A[f],a[f],A[o],a[f],a[o]):i.push(A[o],a[f],A[f],A[o],a[o],a[f])}}},build(){const t=new e.BufferGeometry,w=(k,P)=>new e.BufferAttribute(new Float32Array(k),P);return t.setAttribute("position",w(c,3)),t.setAttribute("normal",w(l,3)),t.setAttribute("aHullN",w(s,3)),t.setAttribute("color",w(M,3)),t.setAttribute("aRig",w(d,2)),t.setAttribute("aMark",w(v,3)),t.setIndex(new e.BufferAttribute(new Uint32Array(i),1)),t.computeBoundingSphere(),t}}}function Ee(){const c=[],l=[],s=[],M=[];return{get count(){return c.length/3},add(d,v,i,p,h=0,m=0,u=[-1,0]){c.push(d.x,d.y,d.z),l.push(v.x,v.y,v.z),s.push(i,p,h,m),M.push(u[0],u[1])},build(d,v=1e5){const i=new e.InstancedBufferGeometry,p=(m,u)=>new e.InstancedBufferAttribute(new Float32Array(m),u);i.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),i.setIndex([0,1,2,0,2,3]),i.setAttribute("iPos",p(c,3)),i.setAttribute("iNrm",p(l,3)),i.setAttribute("iTone",p(s,4)),i.setAttribute("aRig",p(M,2)),i.instanceCount=c.length/3,i.boundingSphere=new e.Sphere(new e.Vector3,v);const h=new e.Mesh(i,d);return h.frustumCulled=!1,h.renderOrder=5,h}}}function Ne(c,l,s,M){if(c==="teardrop"){const v=Math.pow(Math.sin(Math.PI*Math.pow(me(l,0,1),.62)),.8);return s*(.3+1.05*v)*(1-.72*Ae(.55,1,l))}if(c==="stacked"){let v=0;const i=[[.13,1.3],[.36,1.1],[.56,.9],[.72,.7],[.85,.5],[.94,.32]];for(const[p,h]of i){const m=(l-p)/(h*.1*M.fat);Math.abs(m)<1&&(v=Math.max(v,s*h*Math.sqrt(1-m*m)))}return Math.max(v,s*.3*(1-l))}const d=Math.sin(Math.PI*Math.pow(me(l,0,1),M.low));return s*(.6+.4*Math.pow(Math.max(d,0),.9))*(1-Ae(.5,1,l)*.93)*M.fat}function Qe(c,l,s,M,d,v,i,p,h,m){const u=M.ink,F=h.height,I=h.radius,t=3.2,w=[d,1],k=new e.Matrix4().makeTranslation(v,0,i),P={m:k,col:u.paper,rig:w,mark:[0,1,.42]},N=q=>Ne(h.fleet,me((q-t-4)/(F-8),0,1),I,h),y=[[0,t+3.2,u.black],[I*.36,t+3.2,u.black],[I*.66,t+.2,u.black],[I*.7,t+.2],[I*.7,t+.2],[I*.47,t+3.4],[N(t+4)*.98,t+4]],z=20,B=[h.belt1,h.belt2],x=t+4+(F-8)*h.noseAt;for(let q=0;q<=z;q++){const E=t+4+(F-8)*(q/z),D=Math.max(N(E),.5),_=E>=x-.001,Y=B.some(W=>Math.abs(q/z-W)<.5/z);_&&y[y.length-1][2]!==u.yellow&&q>0&&y.push([D,E,u.paper],[D,E,u.yellow]),Y&&!_?y.push([D,E-.35],[D+.3,E-.35,u.black],[D+.3,E+.35,u.black],[D,E+.35]):y.push([D,E,_?u.yellow:u.paper])}const V=t+F-4;y.push([.42,V+.3,u.yellow],[.2,V+.9,u.paper,.7],[.14,V+4.6,u.paper,.7],[.5,V+5,u.yellow],[.62,V+5.6,u.yellow],[.42,V+6.2,u.yellow],[0,V+6.5,u.yellow]),c.lathe(y,16,P),l.lathe(y.filter(q=>q[2]===u.yellow&&q[1]<=V+.4),16,{m:k,col:u.orange,rig:w});const R=Math.max(N(t+10),I*.5)-.6,A=h.finSpan,n=h.finH,a=[[R,t+n],[R+A*.42,t+n*.56],[R+A*.93,t+5.2],[R+A,t-2.2],[R+A*.62,t+2.6],[R+.4,t+3.4]];for(let q=0;q<h.fins;q++){const E=h.finPhase+q/h.fins*Math.PI*2,D=new e.Matrix4().makeTranslation(v,0,i).multiply(new e.Matrix4().makeRotationY(E)),_={m:D,col:u.yellow,rig:w,mark:[.55,0,.38]};c.plate(a,1.5,_,.3),l.plate(a,1.5,{m:D,col:u.orange,rig:w},.3);const Y=D.clone().multiply(new e.Matrix4().makeTranslation(R+A*.97,0,0));c.lathe([[0,t-2.9,u.black],[.75,t-2.9,u.black],[.75,t-2.9],[1.15,t-1.2],[1.25,t+2],[1,t+4.6],[.45,t+6.6],[0,t+7.4]],8,{m:Y,col:u.paper,rig:w,mark:[0,0,.26]});const W=D.clone().multiply(new e.Matrix4().makeTranslation(R+A*.97,0,0));for(let ve=0;ve<2;ve++){const oe=(ve-.5)*1.3,Me=22+20*m(),ce={m:W,col:u.black,rig:[d,4],mark:[0,0,0]},we=c.vert(ce,oe-.34,t-3.2,0,0,0,1,0,0,1),be=c.vert(ce,oe+.34,t-3.2,0,0,0,1,0,0,1),ue=c.vert(ce,oe,t-3.2-Me,0,0,0,1,0,0,1),pe=c.vert(ce,oe,t-3.2,-.34,1,0,0,1,0,0),ie=c.vert(ce,oe,t-3.2,.34,1,0,0,1,0,0);c.tri(we,be,ue),c.tri(we,ue,be),c.tri(pe,ie,ue),c.tri(pe,ue,ie)}}const o=t+4+(F-8)*h.portAt,f=N(o),g=Math.atan2(-.55,-p*.83),T=new e.Matrix4().makeTranslation(v,o,i).multiply(new e.Matrix4().makeRotationY(-g)).multiply(new e.Matrix4().makeTranslation(f-.25,0,0)).multiply(new e.Matrix4().makeRotationZ(-Math.PI/2)),S=h.portR;c.lathe([[0,.5,u.cyan],[S*.72,.5,u.cyan],[S*.72,.5],[S*.8,.95],[S,.95],[S*1.08,.5],[S*1.08,0]],14,{m:T,col:u.paper,rig:w,mark:[0,0,.22]}),c.plate([[-.12*S,.1*S],[.2*S,.42*S],[.34*S,.3*S],[.02*S,-.04*S]],.05,{m:T.clone().multiply(new e.Matrix4().makeTranslation(0,.56,0)).multiply(new e.Matrix4().makeRotationX(-Math.PI/2)),col:u.paper,rig:w,mark:[0,0,0]},.05);const C=new e.Vector3,K=new e.Vector3,L=1.5,J=Math.cos(.26),le=Math.sin(.26),re=Math.atan2(-.8,-p*.6)+h.bandTurn,ae=I*1.5;for(let q=-8;q<70;q++)for(let E=-12;E<=12;E++){const D=t+9+(q*J+E*le)*L,_=(E*J-q*le)*L;if(D<t+11||D>x-2||Math.abs(_)>ae*.5)continue;const Y=N(D);if(Y<1.2)continue;const W=re+(_+1.6*Math.sin(D*.09+d))/Y,ve=1-Math.abs(_)/(ae*.5),oe=.72*Math.pow(ve,.8)*(.55+.45*Ae(t+11,t+30,D));oe<.03||(K.set(Math.cos(W),.12,Math.sin(W)).normalize(),C.set(v+Math.cos(W)*Y,D,i+Math.sin(W)*Y),s.c.add(C,K,oe,L,0,0,w))}for(let q=0;q<16;q++){const E=t+5.5+q*1.4,D=N(E),_=Math.max(6,Math.round(Math.PI*2*D/1.5));for(let Y=0;Y<_;Y++){const W=(Y+q%2*.5)/_*Math.PI*2;K.set(Math.cos(W),-.15,Math.sin(W)).normalize(),C.set(v+Math.cos(W)*D,E,i+Math.sin(W)*D),s.y.add(C,K,0,1.5,0,.85*(1-q/17),w)}}}function Ge(c,l,s,M,d,v,i,p){const h=l.ink,m=new e.Matrix4().makeTranslation(M,0,d),u={m,col:h.paper,rig:[s,0],mark:[.5,0,.3]};c.lathe([[27,-1.2],[27,-.1],[27,-.1],[25.6,.3,h.yellow],[22.6,.3,h.yellow],[22.6,.3],[9,.3],[9,.3,h.black],[7.6,-.9,h.black],[0,-.9,h.black]],20,u);const F={m,col:h.black,rig:[s,5],mark:[0,0,0]},I=c.vert(F,-5,.36,7,0,1,0,0,1,0),t=[];for(let n=0;n<44;n++){const a=n/44*Math.PI*2,o=(n%2?1:.84)*(.9+.2*p()),f=12.5*o,g=17*o;t.push(c.vert(F,-5+Math.cos(a)*f*.8-Math.sin(a)*g*.25,.36,7+Math.sin(a)*g,0,1,0,0,1,0))}for(let n=0;n<44;n++)c.tri(I,t[(n+1)%44],t[n]);const w=i.mastOff*v,k=i.mastH,P=2.6,N={m,col:h.paper,rig:[s,0],mark:[.9,0,.13]},y=[[-1,-1],[1,-1],[1,1],[-1,1]],z={...N,mark:[.9,0,-.13]};for(const[n,a]of y)c.beam([w+n*P*1.25,.3,a*P*1.25],[w+n*P*.8,k,a*P*.8],.7,.7,z,[n,0,a]);const B=8;for(let n=0;n<B;n++){const a=.3+(k-.3)*(n/B),o=.3+(k-.3)*((n+1)/B),f=ge(1.25,.8,n/B)*P,g=ge(1.25,.8,(n+1)/B)*P;for(let T=0;T<4;T++){const S=y[T],C=y[(T+1)%4],K=(n+T)%2;c.beam([w+S[0]*g,o,S[1]*g],[w+C[0]*g,o,C[1]*g],.34,.34,z);const L=K?S:C,J=K?C:S;c.beam([w+L[0]*f,a,L[1]*f],[w+J[0]*g,o,J[1]*g],.3,.3,z)}}c.lathe([[0,k],[3.4,k],[3.4,k],[3.6,k+.8,h.yellow],[3.6,k+.8],[.5,k+1.2],[.3,k+7],[.3,k+7,h.orange],[1,k+7.8,h.orange],[1,k+8.6,h.orange],[0,k+9.4,h.orange]],8,{m:new e.Matrix4().makeTranslation(M+w,0,d),col:h.paper,rig:[s,0],mark:[.6,0,.2]});const x={m,col:h.yellow,rig:[s,2],mark:[.9,0,.14]};i.armsAt.forEach((n,a)=>{const o=k*n,f=v*(i.armReach[a]+.6);c.beam([w-v*P,o,-.9],[f,o-1.2,-.7],.5,.6,x),c.beam([w-v*P,o,.9],[f,o-1.2,.7],.5,.6,x),c.beam([w-v*P,o+3.2,0],[f+v*2,o-.9,0],.36,.36,x),c.beam([f,o-1.2,-2.2],[f,o-1.2,2.2],.8,1.8,{...x,col:h.paper})});const V=new e.Vector3(-v*.42,.12,-.9).normalize(),R=[];for(let n=0;n<48;n++){const a=n/48*Math.PI*2,o=n%2?16+5*p():30+13*p();R.push([Math.cos(a)*o*1.15,Math.sin(a)*o])}const A=new e.Matrix4().lookAt(V,new e.Vector3,new e.Vector3(0,1,0)).setPosition(M+V.x*9,7+V.y*9,d+V.z*9);c.plate(R,.5,{m:A,col:h.paper,rig:[s,3],mark:[0,0,.55]},.08)}const et=`
  uniform vec2 uRegW; uniform vec4 uFoot[${X}], uFootT[${X}]; attribute float aShip;
  varying vec3 vW, vAx, vT, vS; varying vec2 vTh; varying float vR, vSeed, vV, vL;
  // the column is the ship's own wake: a cubic from the tail (leaving along the ship's axis) down the way it flew to
  // its foot, which stands on the pad while the ship is young and follows it up the trajectory afterwards
  void main(){ int i = int(aShip + 0.5); vec4 s = uShip[i], b = uShipB[i], pad = uPad[i], ft = uFoot[i], fd = uFootT[i];
    float v = position.y, lift = s.x, on = b.y, det = fd.w;
    vec3 ax = vec3(sin(s.z)*cos(s.y), cos(s.z)*cos(s.y), -sin(s.y));
    float Zm = 1. + uDrift[i].w;
    vec3 B0 = pad.xyz + vec3(uDrift[i].x, 40.*Zm + lift, uDrift[i].y) - ax*36.4*Zm, B3 = pad.xyz + ft.xyz + vec3(0., 0.2, 0.);
    float L = max(length(B0 - B3), 0.5);
    vec3 B1 = B0 - ax*L*0.36, B2 = B3 + fd.xyz*L*0.36;
    float u = 1. - v;
    vec3 c = B0*u*u*u + B1*3.*u*u*v + B2*3.*u*v*v + B3*v*v*v;
    vec3 T = normalize((B1 - B0)*u*u + (B2 - B1)*2.*u*v + (B3 - B2)*v*v + vec3(0., -1e-4, 0.));
    vec3 Bn = normalize(cross(T, vec3(1., 0., 0.)) + vec3(0., 0., 1e-5)), S = cross(Bn, T);
    float r = mix(3.2, 8.4, sqrt(v))*(1. + 0.6*smoothstep(0.75, 1., v)*(1. - det)/(1. + lift*0.02))*on;
    r *= (1. + 0.07*sin(v*40. - uTime*9. + aShip*2.))*mix(Zm, 1., v*v);
    if (on > 0.01) r = max(r, 1.6*uPx*length(cameraPosition - (modelMatrix*vec4(c, 1.)).xyz));      // a far column never thins under 3 px
    r *= 1. - 0.94*det*smoothstep(0.45, 1., v);                                                      // a wake that has left the pad tapers to a point
    vec4 w = modelMatrix*vec4(c + (S*position.x + Bn*position.z)*r, 1.);
    vW = w.xyz; vAx = (modelMatrix*vec4(c, 1.)).xyz; vTh = position.xz; vR = max(r, 0.01); vSeed = aShip*1.7; vV = v;
    vT = T; vS = S; vL = ft.w - v*L;
    gl_Position = projectionMatrix*viewMatrix*w; gl_Position.x += dot(uReg, uRegW)*gl_Position.w; }`,tt=c=>`
  uniform vec3 uYellow, uF; varying vec3 vW, vAx, vT, vS; varying vec2 vTh; varying float vR, vSeed, vV, vL;
  void main(){
    vec3 T = normalize(vT + vec3(0., -1e-5, 0.)), S = normalize(vS - T*dot(vS, T) + vec3(1e-5, 0., 0.)), Bn = cross(T, S);
    vec3 V = normalize(cameraPosition - vAx + vec3(0., 1e-4, 0.)); vec3 Vh = normalize(V - T*dot(V, T) + S*1e-4);
    vec3 N = normalize(S*vTh.x + Bn*vTh.y + S*1e-5);
    float x = sqrt(max(1. - dot(N, Vh)*dot(N, Vh), 0.));                  // 0 on the centre line, 1 at the silhouette
  float pour = vL*0.085 + uTime*2.6 + vSeed;                           // bands pour downward
    float saw = fract(pour), lick = saw*saw*0.16 + 0.05*sin(pour*2.1 + N.x*3.);
    float saw2 = fract(pour*0.63 + 0.4), lick2 = saw2*saw2*0.13;
    float fw = fwidth(x) + 1e-4;
    ${c?`
    // magenta plate: discs on a lattice wrapped round the column (angle, height), tone taken at each disc's centre
    float th = atan(vTh.y, abs(vTh.x) + abs(vTh.y) > 1e-4 ? vTh.x : 1.), pitch = 2.3, nA = max(floor(6.2832*vR/pitch + 0.5), 6.);
    vec2 g = vec2(th/6.2832*nA, (vL + uTime*22.)/pitch); g.x += floor(g.y)*0.5;
    vec2 cell = floor(g), f = fract(g) - 0.5;
    float thc = (cell.x + 0.5 - floor(g.y)*0.5)/nA*6.2832; vec3 Nc = S*cos(thc) + Bn*sin(thc);
    float xc = sqrt(max(1. - dot(Nc, Vh)*dot(Nc, Vh), 0.));
    float tone = smoothstep(0.52, 0.86, xc - lick2*0.6);
    float d = length(f*vec2(6.2832*vR/nA, pitch))/pitch, rad = sqrt(tone*0.3183)*1.25, aa = fwidth(d) + 1e-4;
    float a = max(1. - smoothstep(rad - aa, rad + aa, d), smoothstep(0.84 - fw, 0.84 + fw, x - lick2*0.6));
    a *= step(x, 0.999)*smoothstep(0.0, 0.03, vV);
    if (a < 0.004) discard;
    gl_FragColor = vec4(mix(vec3(1.), uF, a), 1.);`:`
    float core = 1. - smoothstep(0.31 - fw, 0.31 + fw, x + lick - 0.08);
    float edgeW = max(0.06, 1.3*fw); float edge = smoothstep(1. - edgeW - fw, 1. - edgeW + fw, x + lick2*0.35);
    vec3 col = mix(uYellow, uPaperC, core); col = mix(col, uK, edge);
    gl_FragColor = vec4(col, 1.);`}
  }`;function $e(c,l,s){return new e.ShaderMaterial({uniforms:{...c.uniforms,...s,uYellow:{value:c.ink.yellow},uF:{value:c.factor.magentaOnYellow},uRegW:{value:new e.Vector2(l?1:0,0)}},vertexShader:te+et,fragmentShader:te+tt(l),...l?{...c.plateBlend,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-2}:{}})}function at(c,l,s){const M=[],d=[],v=[];for(let p=0;p<c;p++){const h=M.length/3;for(let m=0;m<=s;m++){const u=Math.pow(m/s,1.5);for(let F=0;F<=l;F++){const I=F/l*Math.PI*2;M.push(Math.cos(I),u,Math.sin(I)),d.push(p)}}for(let m=0;m<s;m++)for(let u=0;u<l;u++){const F=h+m*(l+1)+u,I=F+l+1;v.push(F,F+1,I,F+1,I+1,I)}}const i=new e.BufferGeometry;return i.setAttribute("position",new e.BufferAttribute(new Float32Array(M),3)),i.setAttribute("aShip",new e.BufferAttribute(new Float32Array(d),1)),i.setIndex(v),i.boundingSphere=new e.Sphere(new e.Vector3,1e5),i}function ot(c,l,s,M){const d=[],v=[];for(let u=0;u<l;u++)for(let F=0;F<s;F++){const I=F/s,t=Math.pow(M(),.7);d.push(u,M(),M()*(.3+M()*6.5*t),ge(2.6,8.5,Math.pow(M(),1.6))*(1.15-.4*t)),v.push(M()*Math.PI*2,9+t*46,M()*M()*9*(1-t*.7),I*40)}const i=new e.InstancedBufferGeometry;i.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0,-1,-1,1,1,-1,1,1,1,1,-1,1,1]),3)),i.setIndex([0,1,2,0,2,3,4,5,6,4,6,7]),i.setAttribute("iA",new e.InstancedBufferAttribute(new Float32Array(d),4)),i.setAttribute("iB",new e.InstancedBufferAttribute(new Float32Array(v),4)),i.instanceCount=l*s,i.boundingSphere=new e.Sphere(new e.Vector3,1e5);const p={value:new Float32Array(X).fill(-1)},h=new e.ShaderMaterial({uniforms:{...c.uniforms,uSmoke:p,uCyan:{value:c.ink.cyan}},vertexShader:`
      ${te}
      uniform float uSmoke[${X}]; attribute vec4 iA, iB;
      varying vec2 vUv; varying vec3 vK;       // vK: layer, rim radius in ball radii, dots flat 0..1
      varying float vSize;
      void main(){ int i = int(iA.x + 0.5); float age = uSmoke[i] - iA.z;
        float grow = age > 0. ? 1. - exp(-age*0.9) : 0.; float roll = 1. - exp(-max(age, 0.)*0.3);
        float size = iA.w*grow*(1. + 0.07*sin(uTime*1.1 + iB.w));
        vec3 c = uPad[i].xyz + vec3(cos(iB.x), 0., sin(iB.x))*iB.y*roll;
        c.xz += vec2(0.9, 0.5)*max(age - 6., 0.)*0.35*(0.4 + iA.y);                        // the pile drifts off downwind
        float corr = mix(0.3, 1., smoothstep(5., 15., abs(c.x)));                          // the sled's corridor down the rail stays mostly clear
        size *= corr;
        size = min(size, 0.4 + 0.16*abs(c.x));                                              // near the rail the pile is small scallops: no lobe blanks the frame
        c.y += 0.2 + size*0.5 + iB.z*roll*corr + 0.4*sin(uTime*0.7 + iB.w*1.7)*grow;
        vec4 mv = viewMatrix*modelMatrix*vec4(c, 1.); float dist = max(-mv.z, 0.1);
        float lw = max(min(0.34, size*0.14 + 0.04), 1.6*uPx*dist), R = size + (position.z > 0.5 && size > 0.01 ? lw : 0.);
        mv.xy += position.xy*R;
        // slide the two discs along the view ray (not along z), so the outline stays concentric with its ball
        mv.xyz *= 1. + (position.z > 0.5 ? size*0.5 + 0.2 : -min(size*0.3, dist*0.3))/dist;
        vUv = position.xy*R/max(size, 1e-3); vSize = size;
        vK = vec3(position.z, R/max(size, 1e-3), smoothstep(2.6, 4.6, 1.7/max(uPx*dist, 1e-5)));
        gl_Position = projectionMatrix*mv; }`,fragmentShader:`
      ${te}
      uniform vec3 uCyan; varying vec2 vUv; varying vec3 vK; varying float vSize;
      void main(){ float r = length(vUv);
        if (vK.x > 0.5){ if (r > vK.y) discard; gl_FragColor = vec4(uK, 1.); return; }
        if (r > 1.) discard;
        vec3 nv = vec3(vUv, sqrt(max(1. - r*r, 0.))); vec3 n = nv*mat3(viewMatrix);
        vec2 st = n.xz/max(1. - n.y, 0.05); float cells = max(floor(vSize*2./1.7 + 0.5), 2.);
        vec2 g = rot2(0.26)*st*cells; vec2 cc = floor(g) + 0.5, f = g - cc;
        vec2 sc = (cc*rot2(0.26))/cells; float q = dot(sc, sc), nyc = (q - 1.)/(q + 1.);
        float tone = 0.66*smoothstep(-0.02, -0.62, nyc);
        float d = length(f), rad = sqrt(tone*0.3183)*1.05, aa = fwidth(d) + 1e-4;
        float a = mix(tone, 1. - smoothstep(rad - aa, rad + aa, d), vK.z)*step(n.y, 0.6);
        gl_FragColor = vec4(mix(uPaperC, uCyan, a), 1.); }`}),m=new e.Mesh(i,h);return m.frustumCulled=!1,{mesh:m,uSmoke:p}}const nt=`
  float screen(vec2 p, float pitch, float angle, float tone){
    vec2 g = rot2(angle)*p/pitch; vec2 f = fract(g) - 0.5;
    float px = 1./max(length(fwidth(g)), 1e-5);                       // pixels per cell
    float d = length(f), rad = sqrt(clamp(tone, 0., 1.)*0.3183)*1.02, aa = 0.8/px;
    float disc = 1. - smoothstep(rad - aa, rad + aa, d);
    return mix(clamp(tone, 0., 1.), disc, smoothstep(2.6, 4.6, px));
  }`;function rt(c,l={}){const s=new e.Group,M=Math.round((l.count??9e3)*(l.detail??1)),d=l.radius??2500,v=`
    void main(){ vec4 p = projectionMatrix*viewMatrix*vec4(cameraPosition + position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,i=new e.Mesh(new e.SphereGeometry(d,24,12),new e.ShaderMaterial({uniforms:{...c.uniforms,uDome:{value:l.domeColor||c.ink.paper}},side:e.BackSide,depthWrite:!1,depthTest:!1,vertexShader:v,fragmentShader:"uniform vec3 uDome; void main(){ gl_FragColor = vec4(uDome, 1.); }"}));i.renderOrder=l.domeOrder??-20,i.frustumCulled=!1,s.add(i);const h=(l.moons??[{dir:[-.62,.62,.48],size:9,crescent:!0},{dir:[.55,.2,.81],size:3.6,ring:!0}]).map(n=>({...n,d:new e.Vector3(...n.dir).normalize(),c:Math.cos((n.size*.5+.5)*Math.PI/180)})),m=[],u=[],F=new e.Vector3,I=Math.PI*(3-Math.sqrt(5)),t=Math.round(M/(1-Math.sin(8*Math.PI/180))),w=Math.sqrt(2*Math.PI/t);for(let n=0;n<t;n++){const a=1-(n+.5)/t,o=Math.asin(a);if(o<8*Math.PI/180)break;const f=Math.sqrt(1-a*a),g=n*I;if(F.set(Math.cos(g)*f,a,Math.sin(g)*f),h.some(S=>F.dot(S.d)>S.c))continue;const T=l.tone?l.tone(o,n):.02+.7*Math.pow(Ae(8*Math.PI/180,1.45,o),.85);T<=0||(m.push(F.x,F.y,F.z),u.push(w*Math.sqrt(T/Math.PI)*1.05))}const k=new e.InstancedBufferGeometry;k.setAttribute("position",new e.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),k.setIndex([0,1,2,0,2,3]),k.setAttribute("iPos",new e.InstancedBufferAttribute(new Float32Array(m),3)),k.setAttribute("iRad",new e.InstancedBufferAttribute(new Float32Array(u),1)),k.instanceCount=u.length,k.boundingSphere=new e.Sphere(new e.Vector3,1e6);const P=new e.Mesh(k,new e.ShaderMaterial({uniforms:{...c.uniforms,uF:{value:l.solid||l.factor||c.factor.cyan},uR:{value:d},uSolid:{value:l.solid?1:0},uBreathe:{value:l.breathe??0}},...l.solid?{depthWrite:!1}:c.plateBlend,depthTest:!0,depthFunc:e.LessEqualDepth,side:e.DoubleSide,vertexShader:`
      ${te}
      uniform float uR, uSolid, uBreathe; attribute vec3 iPos; attribute float iRad; varying vec2 vUv;
      void main(){ vec3 n = iPos; vec3 t = normalize(cross(n, vec3(0.03, 1., 0.011))), b = cross(n, t);
        float rad = max(iRad*(1. + uSolid*0.35*sin(uTime*(1.3 + 2.*h11(iPos.x*7.)) + iPos.z*40.))*(1. + uBreathe*sin(uTime*1.6 - iPos.y*11. + iPos.x*4. + iPos.z*2.)), 1.1*uPx);                                 // never a sub-pixel pinprick
        vec3 w = cameraPosition + (n + (t*position.x + b*position.y)*rad*1.1)*uR; vUv = position.xy*1.1;
        vec4 p = projectionMatrix*viewMatrix*vec4(w, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; p.x += uReg.y*p.w; gl_Position = p.xyww; }`,fragmentShader:`uniform vec3 uF; uniform float uSolid; varying vec2 vUv;
      void main(){ float d = length(vUv), aa = fwidth(d) + 1e-4, a = 1. - smoothstep(1. - aa, 1. + aa, d);
        if (uSolid > 0.5){ if (a < 0.5) discard; gl_FragColor = vec4(uF, 1.); return; }
        if (a < 0.004) discard; gl_FragColor = vec4(mix(vec3(1.), uF, a), 1.); }`}));P.renderOrder=-10,P.frustumCulled=!1,s.add(P);const N=[],y=[],z=new e.Vector3,B=new e.Vector3,x=new e.Vector3,V=(n,a,o,f,g)=>{const T=N.length/3;B.crossVectors(n.d,new e.Vector3(0,1,0)).normalize(),x.crossVectors(B,n.d);for(let S=0;S<=o;S++){const[C,K,L]=a(S/o),J=f*L;for(const le of[-1,1]){const re=Math.hypot(C,K)||1,ae=1+le*J/re;z.copy(n.d).addScaledVector(B,Math.tan(C*ae*Math.PI/180)).addScaledVector(x,Math.tan(K*ae*Math.PI/180)).normalize().multiplyScalar(d*.99),N.push(z.x,z.y,z.z)}}for(let S=0;S<o;S++){const C=T+S*2;y.push(C,C+1,C+2,C+1,C+3,C+2)}};for(const n of h){const a=n.size*.5;V(n,o=>{const f=o*Math.PI*2;return[Math.cos(f)*a,Math.sin(f)*a,.7+.5*Math.sin(f*1+2.2)*Math.sin(f*1+2.2)]},64,a*.035+.05),n.crescent&&V(n,o=>{const f=-2.2+o*2.5,g=Math.sin(o*Math.PI);return[Math.cos(f)*a*(1-.17*g),Math.sin(f)*a*(1-.17*g),.02+g]},40,a*.17),n.ring&&V(n,o=>{const f=.55+o*Math.PI*1.62;return[Math.cos(f)*a*2.1*.94+Math.sin(f)*a*.3,Math.sin(f)*a*.55-Math.cos(f)*a*.5,.5+.5*Math.sin(o*Math.PI)]},48,.09)}const R=new e.BufferGeometry;R.setAttribute("position",new e.BufferAttribute(new Float32Array(N),3)),R.setIndex(y);const A=new e.Mesh(R,new e.ShaderMaterial({uniforms:{...c.uniforms},side:e.DoubleSide,depthWrite:!1,depthFunc:e.LessEqualDepth,vertexShader:v,fragmentShader:"uniform vec3 uK; void main(){ gl_FragColor = vec4(uK, 1.); }"}));if(A.renderOrder=(l.domeOrder??-20)+.1,A.frustumCulled=!1,s.add(A),l.moonFill){const n=[],a=[];for(const g of h){const T=g.size*.5,S=n.length/3;B.crossVectors(g.d,new e.Vector3(0,1,0)).normalize(),x.crossVectors(B,g.d),z.copy(g.d).multiplyScalar(d*.99),n.push(z.x,z.y,z.z);for(let C=0;C<=40;C++){const K=C/40*Math.PI*2;z.copy(g.d).addScaledVector(B,Math.tan(Math.cos(K)*T*Math.PI/180)).addScaledVector(x,Math.tan(Math.sin(K)*T*Math.PI/180)).normalize().multiplyScalar(d*.99),n.push(z.x,z.y,z.z)}for(let C=0;C<40;C++)a.push(S,S+1+C,S+2+C)}const o=new e.BufferGeometry;o.setAttribute("position",new e.BufferAttribute(new Float32Array(n),3)),o.setIndex(a);const f=new e.Mesh(o,new e.ShaderMaterial({uniforms:{uC:{value:l.moonFill}},side:e.DoubleSide,depthWrite:!1,depthFunc:e.LessEqualDepth,vertexShader:v,fragmentShader:"uniform vec3 uC; void main(){ gl_FragColor = vec4(uC, 1.); }"}));f.renderOrder=(l.domeOrder??-20)+.05,f.frustumCulled=!1,s.add(f)}return{object:s,dots:P,dome:i,moons:A}}function it(c,l,s,M){const d=new e.Group,v=c.ink,i=s.length*.5+80;l.beam([0,-.8,-i],[0,-.8,i],60,1.6,{col:v.paper,rig:[-1,0],mark:[.7,0,.3]});for(let m=-i+20;m<i;m+=45)for(const u of[-1,1])l.beam([u*22,-9,m],[u*22,-1.6,m],3,3,{col:v.paper,rig:[-1,0],mark:[.9,0,.25]});l.beam([0,.5,-i],[0,.5,i],1.2,.6,{col:v.orange,rig:[-1,0],mark:[.4,0,.14]});const p=rt(c,{detail:M,domeOrder:-.5});d.add(p.object);const h=new e.Mesh(new e.PlaneGeometry(9e3,9e3).rotateX(-Math.PI/2),new e.ShaderMaterial({uniforms:{...c.uniforms,uY:{value:v.yellow},uM:{value:v.magenta},uO:{value:v.orange},uC:{value:v.cyan}},vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",fragmentShader:`
      ${te} ${nt}
      uniform vec3 uY, uM, uO, uC; varying vec3 vW;
      void main(){ float dist = length(cameraPosition - vW); vec2 p = vW.xz;
        vec2 pm = p + vec2(viewMatrix[0][0], viewMatrix[2][0])*uReg.x*dist*0.6;                // the magenta plate, slipped
        float sh = shadowAt(vW), far = smoothstep(260., 420., dist), drop = smoothstep(900., 1700., dist);
        float ty = 0.78 + 0.1*sh, tm = (0.5 + 0.4*sh)*(1. - drop);
        float ay = 1. - (1. - screen(p, 3., 0., ty*(1. - far)))*(1. - screen(p, 12., 0., ty*far));
        float am = 1. - (1. - screen(pm, 3., 1.309, tm*(1. - far)))*(1. - screen(pm, 12., 1.309, tm*far));
        float ac = screen(p, 12., 0.2618, 0.3*drop);
        vec3 col = mix(mix(uPaperC, uM, am), mix(uY, uO, am), ay); col = mix(col, uC, ac*(1. - ay));
        gl_FragColor = vec4(col, 1.); }`}));return h.position.y=-9,d.add(h),{group:d,sky:p}}async function ut(c,l={}){const s=c.rng,M=me(l.detail??c.quality?.detail??1,.6,1),d=null,v=(r,b)=>d&&d.has(r)?Number(d.get(r)):b;d&&d.get("stage")==="0"&&(l={...l,stage:!1});const i=l.style||Je(l.palette||Ce,{exposure:l.exposure}),p=i.uniforms,h=i.ink,m=Math.min(l.count??12,X),u=l.spacing??90,F=l.side??38,I=l.duration??41,t=l.firstIgnition??2.5,w=l.ignitionEvery??3,k=(()=>{const r=s();return r<.6?"needle":r<.82?"teardrop":"stacked"})(),P=d&&d.get("fleet")||l.fleet||k,N=s.chance(.08),y=d?d.get("mis")==="1":l.misprint??N,z={fleet:P,length:u*(m-1),fins:P==="teardrop"?4:3,finPhase:s.range(0,6.28),radius:P==="needle"?s.range(5.6,6.4):P==="teardrop"?s.range(6.6,7.4):s.range(6.4,7),low:s.range(.52,.7),fat:s.range(.94,1.06),noseAt:s.range(.8,.88),finSpan:s.range(10.5,13.5),finH:s.range(26,36),belt1:s.range(.16,.24),belt2:s.range(.56,.68),portAt:s.range(.6,.72),portR:s.range(1.7,2.3),bandTurn:s.range(-.25,.25)},B=Le(),x=Le(),V={y:Ee(),c:Ee()},R=[],A=[],n=[];await c.yield();for(let r=0;r<m;r++){const b=r%2?-1:1,O=b*F,H=-z.length*.5+r*u,Z={...z,height:90*s.range(.95,1.04),mastOff:s.range(21.5,23),mastH:s.range(76,84),finPhase:0,armsAt:[.3,.58,.84],armReach:[]};Z.finPhase=(b>0?0:Math.PI)+Math.PI/Z.fins+s.range(-.12,.12),Z.armReach=Z.armsAt.map(he=>Ne(P,me((Z.mastH*he-7.2)/(Z.height-8),0,1),Z.radius,Z)),Qe(B,x,V,i,r,O,H,b,Z,s),Ge(B,i,r,O,H,b,Z,s),p.uPad.value[r].set(O,0,H,Z.mastOff*b),R.push({position:[O,0,H],side:b,height:Z.height});for(let he=0;he<5;he++){const $=he%3,j=Z.mastH*Z.armsAt[$]+.9,U=s.range(.15,.9);n.push({ship:r,side:b,x:O+ge(b*(Z.mastOff-2.6),b*(Z.armReach[$]+1.5),U),y:j-1.2*U,z:H+(s.chance(.5)?.8:-.8)})}A.push({lean:s.range(.1,.22),yaw:s.range(-.07,.07)+b*.03,arm:(s.chance(.5)?1:-1)*s.range(1.5,2.1),slip:r%2?-1:1,lift:0,t:-1,tilt:0,sgn:b,a0:(l.pitchOver&&l.pitchOver[r])??3.6,A:r>=m-3?4.5:3.6,vy:r>=m-3?22:15}),await c.yield()}const a=new e.Group;let o=null;l.stage!==!1&&(o=it(i,B,z,M),a.add(o.group),await c.yield());const f=B.build();await c.yield();const g=new e.Mesh(f,i.paperMaterial()),T=new e.Mesh(f,i.hullMaterial()),S=new e.Mesh(x.build(),i.plateMaterial("magenta","yellow"));S.renderOrder=4;const C=V.y.build(i.dotMaterial("yellow","paper")),K=V.c.build(i.dotMaterial("cyan","paper")),L=r=>Array.from({length:r},()=>new e.Vector4(0,0,0,0)),J={uFoot:{value:L(X)},uFootT:{value:L(X)}};for(const r of J.uFootT.value)r.set(0,1,0,0);const le=at(m,12,22),re=new e.Mesh(le,$e(i,!1,J)),ae=new e.Mesh(le,$e(i,!0,J));ae.renderOrder=4;const q=ot(i,m,Math.round(200*M),s);for(const r of[g,T,S,re,ae])r.frustumCulled=!1,a.add(r);const E=st(i,n,q.uSmoke,s);a.add(C,K,q.mesh,E),await c.yield();let D=d&&d.has("tj")?Number(d.get("tj")):null;const _=r=>(r=me(r,0,1),r*r*(3-2*r)),Y=1.2,W={A:4.5,Vy1:22,Vy2:9,ty:4,Vz:115,tz:5,cap:.55,fan:.2},ve=(r,b,O)=>{if(r<=0)return 0;const H=O/b;return r<H?.5*b*r*r:.5*b*H*H+O*(r-H)},oe=(r,b,O)=>r<=0?0:Math.min(b*r,O),Me=(r,b)=>r<=0?0:r-b*(1-Math.exp(-r/b)),ce=(r,b)=>r<=0?0:1-Math.exp(-r/b),we=(r,b,O)=>(O.h=ve(r,b.A,b.vy)-(b.vy-W.Vy2)*Me(r-b.a0-1,W.ty),O.z=W.Vz*Me(r-b.a0,W.tz),O.vy=oe(r,b.A,b.vy)-(b.vy-W.Vy2)*ce(r-b.a0-1,W.ty),O.vz=W.Vz*ce(r-b.a0,W.tz),O.x=b.yaw*O.h*.5+b.sgn*W.fan*O.z,O),be=r=>r<=0||r>1.3?0:_(r/.07)*Math.exp(-r*2.6)*Math.cos(r*Math.PI*5)*(1-_((r-.95)/.35)),ue=l.lastIgnition??null,pe=l.ignitions||null,ie=r=>pe&&pe[r]!=null?pe[r]:r===m-1&&ue!==null?ue:t+w*r,je=(r,b)=>ie(r)-ie(b),Ie=l.rest??.0015,qe=l.slip??.016,_e=new e.Matrix4,ze=new e.Vector3,ye=[],G={},se={},Se=new e.Vector3(0,0,-1e4),Ke=l.longLens??(l.stage===!1?1.1:0),ee={on:!1,x:0,y:0,z:0,tilt:0},De=(r,b=new e.Vector3)=>{const O=R[r].position,H=p.uDrift.value[r];return b.set(O[0]+H.x,40+A[r].lift,O[2]+H.y)},Ze=(r,b=new e.Vector3)=>{const O=A[r].tilt||0;return De(r,b).add(ze.set(0,-38*Math.cos(O),-38*Math.sin(O)))};function Oe(r,b,O){i.tick(r,b,O,c.renderer);const H=D!==null?D:(b+14)%(t+w*m+22);let Z=0;ye.length=0,a.updateWorldMatrix(!0,!1),O&&(O.getWorldPosition(Se),a.worldToLocal(Se));for(let $=0;$<m;$++){const j=A[$],U=H-ie($),fe=U-Y,de=R[$].position;j.t=U;const Be=J.uFoot.value[$],Te=J.uFootT.value[$];let Ve=0;if($===m-1&&ee.on){const ne=ee.tilt;j.tilt=ne,j.lift=ee.y-de[1]-40+40*Math.cos(ne),p.uDrift.value[$].set(ee.x-de[0],ee.z-de[2]+40*Math.sin(ne),0,0),p.uShip.value[$].set(j.lift,-ne,0,j.arm*_((U-.1)/1.1)),Be.set(0,0,0,Math.hypot(ee.x-de[0],ee.y-de[1],ee.z-de[2])+3.4),Te.set(0,1,0,0),Ve=_(fe/1.5)*60}else{we(fe,j,G),j.lift=G.h,Ve=Math.hypot(G.vy,G.vz);const ne=Math.atan2(G.vz,Math.max(G.vy,.001)),ke=G.vz>0?W.cap*Math.tanh(ne/W.cap):0;j.tilt=ke,p.uDrift.value[$].set(G.x,G.z,0,0),p.uShip.value[$].set(G.h,-ke,Math.atan(j.yaw*.5)*_(G.h/60)+j.sgn*.16*(G.vz/W.Vz),j.arm*_((U-.1)/1.1));const xe=fe<=9?0:Math.min((fe-9)*1.6,fe-5),We=G.h+G.z+3.4;if(xe<=0)Be.set(0,0,0,We),Te.set(0,1,0,0);else{we(xe,j,se);const Re=Math.max(Math.hypot(se.vy,se.vz),.001);Be.set(se.x,3.6+se.h,se.z,We),Te.set(j.sgn*W.fan*se.vz/Re,se.vy/Re,se.vz/Re,_(xe/1.5))}}{const ne=p.uDrift.value[$],ke=de[0]+ne.x-Se.x,xe=de[2]+ne.y-Se.z;ne.w=Ke*_((Math.hypot(ke,xe)-320)/540)}const Ye=U<=0?0:U<.15?_(U/.15):1-_((U-.15)/.6);p.uShipB.value[$].set(Ye,_(U/.45),U>0?1-_((U-1)/1.6):0,me(Ve/45,0,1)),q.uSmoke.value[$]=U,Z+=be(U)*j.slip,U>0&&ye.push($)}ye.sort(je);let he=0;y&&m>=12&&(he=.05*_((H-ie(7))/.12)*(1-_((H-ie(11))/.12))),p.uReg.value.set(Ie+Z*qe+he,-Ie*.3-Z*qe*.25),a.updateWorldMatrix(!0,!1),_e.copy(a.matrixWorld);for(let $=0;$<4;$++){const j=ye[ye.length-1-$],U=p.uShadow.value[$];if(j===void 0){U.set(0,0,1,0);continue}const fe=R[j].position;ze.set(fe[0],0,fe[2]).applyMatrix4(_e),U.set(ze.x,ze.z,14+44*(1-Math.exp(-A[j].t*.3)),.75*_(A[j].t/1.5))}}Oe(0,0,null);const Q=z.length*.5,Fe=R[m-1].position,Ue={pads:R,extent:{halfLength:Q+30,halfWidth:F+30,deckY:0},rail:[[0,3,-Q-80],[0,3,Q-70]],flyThrough:[[0,3,-Q-80],[0,3,-Q*.5],[0,3,0],[0,3,Q-70],[0,12,Q-15],[0,45,Q+40],[0,124,Q+120],[0,181,Q+160]],portalSeat:{position:[0,181,Q+160],normal:[0,-Math.sin(55*Math.PI/180),-Math.cos(55*Math.PI/180)],radius:7,pitchDeg:55},viewpoints:{entry:[0,3,-Q-600],staircase:[0,3,-Q+2*u],beside:[0,3,Fe[2]-u*1.5],climb:[0,60,Q+60]},lastShip:[Fe[0],45,Fe[2]],ignition:{first:t,every:w,duration:I,last:ue,hold:Y}};return{object:a,radius:v("hr",l.viewRadius??150),height:v("hh",190),center:new e.Vector3(v("hx",0),v("hy",60),v("hz",Q*.5)),anchors:Ue,style:i,fleet:P,misprint:y,ground:!1,groundY:0,sky:o?o.sky:null,setProgress(r){D=r*I},setClock(r){D=r},setEscort(r,b,O,H){if(r===null){ee.on=!1;return}ee.on=!0,ee.x=r,ee.y=b,ee.z=O,ee.tilt=H},ignitionTime:ie,shipPosition:De,shipTail:Ze,shipAge:r=>A[r].t,update:Oe,dispose(){for(const r of[S,C,K,re,ae,q.mesh,E,g,T])r.geometry.dispose(),r.material.dispose()}}}function st(c,l,s,M){const d=[],v=[],i=[];for(const u of l){const F=M()*Math.PI*2,I=M.range(.15,.75),t=Math.sqrt(1-I*I);d.push(u.ship,M(),M.range(0,.45),M.range(.85,1.35)),v.push(u.x,u.y,u.z),i.push(Math.cos(F)*t*.6-u.side*.75*t,I,Math.sin(F)*t*.6-.55*t)}const p=new e.InstancedBufferGeometry;p.setAttribute("position",new e.BufferAttribute(new Float32Array([0,0,1,1,0,-.15,0,0,-1.2,0,0,1,-1,0,-.15,0,0,-1.2]),3)),p.setAttribute("aE",new e.BufferAttribute(new Float32Array([1,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,1]),3)),p.setAttribute("iA",new e.InstancedBufferAttribute(new Float32Array(d),4)),p.setAttribute("iP",new e.InstancedBufferAttribute(new Float32Array(v),3)),p.setAttribute("iD",new e.InstancedBufferAttribute(new Float32Array(i),3)),p.instanceCount=l.length,p.boundingSphere=new e.Sphere(new e.Vector3,1e5);const h=new e.ShaderMaterial({uniforms:{...c.uniforms,uSmoke:s},side:e.DoubleSide,vertexShader:`
      ${te}
      uniform float uSmoke[${X}]; attribute vec4 iA; attribute vec3 iP, iD, aE; varying vec3 vE;
      void main(){ int i = int(iA.x + 0.5); float age = uSmoke[i] - iA.z, fly = clamp(age*3., 0., 1.);
        float a = max(age, 0.);
        vec3 d = normalize(iD + vec3(0., 1e-4, 0.));
        vec3 c = iP + d*(34.*(1. - exp(-a*1.3)) + 11.*a) + vec3(sin(a*1.7 + iA.y*40.), 0.6*sin(a*2.3 + iA.y*20.), cos(a*1.3 + iA.y*9.))*2.5*fly;
        vec3 f = normalize(vec3(d.x, d.y*0.35, d.z) + vec3(1e-4, 0., 0.)), r = normalize(cross(f, vec3(0., 1., 0.)) + vec3(0., 0., 1e-4)), u = cross(r, f);
        float flap = mix(1.05 + 0.08*sin(uTime*2. + iA.y*30.), 0.95*sin(uTime*13. + iA.y*50.), fly);
        float s = iA.w*1.3*(1. - smoothstep(9., 14., a));
        vec3 q = vec3(position.x*cos(flap), abs(position.x)*sin(flap), position.z)*s;
        vE = aE; gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(c + r*q.x + u*q.y + f*q.z, 1.); }`,fragmentShader:`
      ${te}
      varying vec3 vE;
      void main(){ float e = min(vE.x, min(vE.y, vE.z)); float w = max(0.07, 1.2*fwidth(e));
        gl_FragColor = vec4(mix(uK, uPaperC, smoothstep(w, w*1.3 + 1e-4, e)), 1.); }`}),m=new e.Mesh(p,h);return m.frustumCulled=!1,m}export{Ce as DEFAULT_PALETTE,X as MAX_SHIPS,ct as POST,Pe as RIG_GLSL,nt as SCREEN_GLSL,te as STYLE_GLSL,ut as buildHero,rt as buildSky,Ee as makeDots,Le as makeGeo,Je as makeStyle};
