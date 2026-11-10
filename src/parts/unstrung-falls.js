import*as c from"three";import{clamp as we,lerp as B,smoothstep as U}from"../kit/core.js";import{mergeGeometries as Tt}from"three/addons/utils/BufferGeometryUtils.js";const ta=["#06070F","#1B2C66","#5B6B86","#C4D2E4","#F2F0E8","#E4533F","#EAF4FF"];function aa(m){return new c.Color(m)}function oa(m={}){const w=(m.palette&&m.palette.length>=7?m.palette:ta).map(g=>new c.Color(g)),h=w[2].clone().lerp(w[3],.42),R={uTime:{value:0},uTone:{value:.6/(m.exposure??1.3)},uResY:{value:450},uMoon:{value:(m.moon?m.moon.clone():new c.Vector3(.62,.56,-.55)).normalize()},uVelvet:{value:w[0]},uBlue:{value:w[1]},uSlate:{value:w[2]},uSilver:{value:w[3]},uPearl:{value:w[4]},uCoral:{value:w[5]},uGlint:{value:w[6]},uThread:{value:h},uGlintGain:{value:m.glintGain??1.6},uGust:{value:0},uDeep:{value:new c.Color(m.deep??w[1])},uNavy:{value:m.navy?new c.Color(m.navy):w[1].clone().lerp(w[2],.4)}},y=new c.Vector2,C={uniforms:R,palette:w,exposure:m.exposure??1.3,setExposure(g){C.exposure=g,R.uTone.value=.6/g},setMoon(g){R.uMoon.value.copy(g).normalize()},update(g,f){R.uTime.value=g,f&&(R.uResY.value=f.getDrawingBufferSize(y).y)},sceneColor(g){return aa(g,C.exposure)}};return C}const le=`
  uniform float uTime, uTone, uResY, uGlintGain, uGust;
  uniform vec3 uMoon, uVelvet, uBlue, uSlate, uSilver, uPearl, uCoral, uGlint, uThread, uDeep, uNavy;
  float hash1(float n){ return fract(sin(n*12.9898 + 4.137)*43758.5453); }
  float hash2(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7)))*43758.5453); }
  // every colour leaves through this: under post.flat the display-linear colour is the scene value
  vec3 toScene(vec3 D){ return max(D, 0.); }
  // THE bead. body: display-linear colour; lined: 0..1 silver lining; n, v, ax, m: unit normal, direction to the eye,
  // axis of the hole, direction to the moon (all in one space); seed: per bead. Returns rgb = display colour, a = glint.
  vec4 beadShade(vec3 body, float lined, vec3 n, vec3 v, vec3 ax, vec3 m, float seed){
    float nv = clamp(dot(n, v), 0., 1.), rim = 1. - nv;
    vec3 c = body*(1. - 0.36*rim*rim);
    vec3 sd = cross(ax, v); float sl = dot(sd, sd);
    float d = abs(dot(n, sd))*inversesqrt(max(sl, 1e-4));
    float stripe = (1. - smoothstep(0.14, 0.34, d))*smoothstep(0.03, 0.25, sl);
    c = mix(c, mix(body, uGlint, 0.8), lined*stripe*0.85);
    c = mix(c, uThread*0.42 + body*0.12, smoothstep(0.925, 0.96, abs(dot(n, ax))));      // the hole: thread seen down it
    vec3 hv = m + v; hv *= inversesqrt(max(dot(hv, hv), 1e-4));
    float tri = abs(fract(seed*13.7 + uTime*0.045)*2. - 1.);
    float g = smoothstep(0.80, 0.97, dot(n, hv))*smoothstep(0.52, 0.78, tri);
    g *= 0.2 + 0.8*smoothstep(0.25, 0.7, dot(body, vec3(0.3333)));      // a dark bead takes a faint glint: only pearl, silver and crystal flash (and bloom)
    return vec4(c, g);
  }
  // display colour + glint -> scene value; the glint is the only thing bright enough to bloom
  vec3 beadOut(vec4 cg){ return toScene(mix(cg.rgb, uGlint, cg.a))*(1. + cg.a*uGlintGain); }
`,ra=`
  // tangent frame from a continuous uv (metres): T along rows (u), B across (v), both in the space of P and N
  void rowFrame(vec3 P, vec2 uv, vec3 N, out vec3 T, out vec3 B){
    vec3 dpx = dFdx(P), dpy = dFdy(P); vec2 dx = dFdx(uv), dy = dFdy(uv);
    float sg = (dx.x*dy.y - dx.y*dy.x) < 0. ? -1. : 1.;
    vec3 t = (dpx*dy.y - dpy*dx.y)*sg; t -= N*dot(N, t);
    float l = dot(t, t);
    vec3 alt = cross(N, vec3(0.13, 1., 0.21)); alt *= inversesqrt(max(dot(alt, alt), 1e-6));
    T = l > 1e-14 ? t*inversesqrt(l) : alt;
    B = cross(N, T)*sg;
  }
  // g: lattice coordinates in beads (x along the row, y = row). roll < 0: stitched bead, hole along the row.
  // roll >= 0: a loose bead rolling along the row, two tones (colA / colB) turning by angle roll.
  // turn (stitched beads only): 0 shows colA, 1 shows colB, between them the bead is caught turning on its thread.
  // colW: the wrong bead (about one in 22). px: pixels per bead. Returns display rgb + glint.
  vec4 beadRows(vec2 g, vec3 T, vec3 B, vec3 N, vec3 v, vec3 m, vec3 colA, vec3 colB, vec3 colW, float lined, float px, float roll, float turn){
    float row = floor(g.y), col = floor(g.x);
    vec2 f = (fract(g)*2. - 1.)*vec2(1.03, roll >= 0. ? 1.04 : 1.13);
    float seed = hash2(vec2(col, row) + 0.37);
    float wrong = step(hash2(vec2(col*1.7 + 3.1, row*2.3 + 0.7)), 0.045);
    float r2 = dot(f, f);
    vec3 nl = vec3(f, sqrt(max(1. - r2, 0.03)));
    vec3 n = T*nl.x + B*nl.y + N*nl.z; n *= inversesqrt(max(dot(n, n), 1e-6));
    vec3 body = colA, ax = T;
    if (roll >= 0.) {
      float th = roll + seed*6.283; float cs = cos(th), sn = sin(th);
      ax = normalize(B + T*(seed - 0.5)*0.8);
      body = mix(colA, colB, smoothstep(-0.06, 0.06, nl.x*cs + nl.z*sn));
    }
    if (roll < 0. && turn > 0.002) {                                   // a strung two-tone bead turned on its thread
      float th = (min(turn, 1.) - 0.5)*3.14159;
      body = turn > 0.998 ? colB : mix(colA, colB, smoothstep(-0.07, 0.07, nl.y*cos(th) + nl.z*sin(th)));
    }
    body = mix(body, colW, wrong);
    vec4 bead = beadShade(body, lined, n, v, ax, m, seed);
    float aa = 2.4/max(px, 1.);
    float inside = 1. - smoothstep(1. - aa, 1., sqrt(r2));
    vec3 backM = roll >= 0. ? mix(colA, colB, 0.5)*0.5 : uVelvet*1.4 + colA*0.10;
    vec3 back = backM*(roll >= 0. ? 0.8 + 0.4*hash2(vec2(col, row)*1.3 + 5.) : 1.);   // loose: more beads underneath
    vec3 gap = mix(back, uThread*0.9, (1. - smoothstep(0.10, 0.24, abs(f.y)))*step(roll, -0.5));
    vec3 avg = mix(backM, mix(mix(colA, colB, roll >= 0. ? 0.5 : turn), colW, 0.045)*0.9, 0.70);
    float k = smoothstep(3., 6.5, px);
    return vec4(mix(avg, mix(gap, bead.rgb, inside), k), bead.a*inside*k*smoothstep(6., 13., px));      // (beads too small to count keep no glint: a far surface is a soft sheen)
  }
`;function ie(m){const w=new c.InstancedBufferGeometry;return w.setAttribute("position",new c.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),w.setIndex([0,1,2,0,2,3]),w.instanceCount=m,w.boundingSphere=new c.Sphere(new c.Vector3,1e5),w}function ce(m,{header:w="",body:h="",uniforms:R={},defines:y={}}={}){return new c.ShaderMaterial({uniforms:{...m.uniforms,...R},defines:y,alphaToCoverage:!0,vertexShader:`
      ${le}
      varying vec2 vQ; varying vec3 vAx, vE1, vColA, vColB, vVP; varying vec4 vPar; varying float vPx;
      ${w}
      void main(){
        vec3 C = vec3(0.); float R = 0.5; vec3 AX = vec3(0., 1., 0.), E1 = vec3(1., 0., 0.);
        float LEN = 0., KIND = 0., LINED = 0., SEED = 0.; vec3 COLA = uPearl, COLB = uPearl;
        ${h}
        vec4 mv = viewMatrix*modelMatrix*vec4(C, 1.);
        mat3 nm = mat3(viewMatrix*modelMatrix);
        vec3 ax = nm*AX, e1 = nm*E1;
        float al = length(ax.xy);
        vec2 a2 = al > 1e-3 ? ax.xy/al : vec2(1., 0.);
        float ext = LEN*al;
        float pxr = R*projectionMatrix[1][1]*uResY*0.5/max(-mv.z, 0.05);
        float grow = max(1., 1.2/max(pxr, 1e-3));                 // never thinner than 2.4 px
        vec2 q = position.xy*vec2(1. + ext, 1.);
        mv.xy += (a2*q.x + vec2(-a2.y, a2.x)*q.y)*R*grow;
        vQ = q; vAx = ax; vE1 = e1; vColA = COLA; vColB = COLB; vPar = vec4(ext, KIND, LINED, SEED); vPx = pxr*2.; vVP = mv.xyz;
        vec4 cp = projectionMatrix*mv, cf = projectionMatrix*(mv + vec4(0., 0., R*0.85, 0.));   // depth of the bead's near face
        cp.z = cf.z*cp.w/max(cf.w, 1e-4);
        gl_Position = (R > 1e-4 && cf.w > 0.02) ? cp : vec4(0., 0., 2., 1.);
      }`,fragmentShader:`
      ${le}
      varying vec2 vQ; varying vec3 vAx, vE1, vColA, vColB, vVP; varying vec4 vPar; varying float vPx;
      void main(){
        float ext = vPar.x, kind = vPar.y;
        vec3 ax = vAx*inversesqrt(max(dot(vAx, vAx), 1e-6));
        float al = length(ax.xy);
        vec2 a2 = al > 1e-3 ? ax.xy/al : vec2(1., 0.);
        float dx = max(abs(vQ.x) - ext, 0.)*(vQ.x < 0. ? -1. : 1.);
        float r2 = dx*dx + vQ.y*vQ.y;
        float fac = kind > 0.5 ? max(sqrt(r2), abs(vQ.y) + max(abs(dx) - 0.28, 0.)*0.8*al) : sqrt(r2);
        if (fac > 1.) discard;
        vec3 n = vec3(a2*dx + vec2(-a2.y, a2.x)*vQ.y, sqrt(max(1. - r2, 0.)));
        vec3 e1 = vE1 - ax*dot(vE1, ax); e1 *= inversesqrt(max(dot(e1, e1), 1e-6));
        vec3 e2 = cross(ax, e1);
        if (kind > 0.5) {                                          // faceted crystal: 6 facets round, two tiers
          float az = atan(dot(n, e2), dot(n, e1) + 1e-5);
          float aq = (floor(az/1.0472) + 0.5)*1.0472;
          float la = dot(n, ax);
          n = normalize((e1*cos(aq) + e2*sin(aq))*0.80 + ax*(la < 0. ? -0.6 : 0.6));
          n = normalize(mix(n, vec3(0., 0., 1.), 0.15));
        }
        vec3 v = normalize(-vVP);
        vec3 mo = mat3(viewMatrix)*uMoon;
        vec3 body = mix(vColA, vColB, smoothstep(-0.05, 0.05, dot(n, e1)));
        vec4 cg = beadShade(body, vPar.z, n, v, ax, mo, vPar.w);
        if (kind > 0.5) cg.rgb *= 0.86 + 0.2*hash1(floor(atan(dot(n, e2), dot(n, e1) + 1e-5)/1.0472) + vPar.w*7.);
        if (kind > 0.5) cg.a *= 0.6;
        float k = smoothstep(3., 6., vPx);                         // tiny beads: flat body colour, no hole, no glint
        cg = mix(vec4(mix(vColA, vColB, 0.5)*0.9, 0.), cg, k);
        cg.a *= smoothstep(6., 13., vPx);
        gl_FragColor = vec4(beadOut(cg), 1.);
      }`})}function st(m,{header:w="",vertex:h="",fragHeader:R="",fragment:y="",uniforms:C={},side:g=c.FrontSide}={}){return new c.ShaderMaterial({uniforms:{...m.uniforms,...C},side:g,vertexShader:`
      ${le}
      varying vec3 vVP, vVN, vWP; varying vec2 vRow; varying vec4 vAux;
      ${w}
      void main(){
        vec3 P = position, NRM = normal; vec2 ROW = uv; vec4 AUX = vec4(0.);
        ${h}
        vec4 wp = modelMatrix*vec4(P, 1.); vec4 mv = viewMatrix*wp;
        vVP = mv.xyz; vWP = P; vVN = mat3(viewMatrix*modelMatrix)*NRM; vRow = ROW; vAux = AUX;
        gl_Position = projectionMatrix*mv;
      }`,fragmentShader:`
      ${le}
      ${ra}
      varying vec3 vVP, vVN, vWP; varying vec2 vRow; varying vec4 vAux;
      ${R}
      void main(){
        vec3 N = vVN*inversesqrt(max(dot(vVN, vVN), 1e-8)); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(-vVP), M = mat3(viewMatrix)*uMoon;
        vec2 uv = vRow; vec4 AUX = vAux;
        float PITCH = 1.2, SCROLL = 0., SHEAR = 0., ROLL = -1., LINED = 0., FLAT = 0., BRICK = 1., TURN = 0., DARK = 0., GLINT = 1.;
        vec3 FARC = uVelvet*1.6 + uBlue*0.22;
        vec3 COLA = uBlue, COLB = uSilver, COLW = uSlate;
        // GRAZE: 1 seen square on, 0 at a grazing angle, where a sheet's beads would be foreshortened into flat tiles
        vec2 ja = dFdx(vRow), jb = dFdy(vRow);
        float GRAZE = smoothstep(0.28, 0.55, abs(ja.x*jb.y - ja.y*jb.x)/max(max(dot(ja, ja), dot(jb, jb)), 1e-9));
        ${y}
        vec3 T, B; rowFrame(vVP, uv, N, T, B);
        vec2 fw = fwidth(uv); float px = PITCH/max(max(fw.x, fw.y), 1e-5);
        // a sheet seen at a grazing angle would show its beads foreshortened into flat tiles: there it goes to its rows'
        // flat tints instead (and the loose and real beads that lie on it carry the picture)
        float graze = GRAZE;
        FLAT = 1. - (1. - FLAT)*graze;
        vec2 g = uv/PITCH; float row = floor(g.y);
        float sp = SCROLL*(1. + SHEAR*(hash1(row) - 0.5))/PITCH;
        g.x += 0.5*mod(row, 2.)*BRICK + (ROLL >= 0. ? hash1(row + 9.) : 0.) - sp;
        vec4 cg = beadRows(g, T, B, N, V, M, COLA, COLB, COLW, LINED, px*(1. - FLAT), ROLL < 0. ? -1. : sp*2., TURN);
        // DARK: a sheet that lies under impostor beads shows dark backing cloth wherever its own rows are too fine to draw
        cg.rgb = mix(cg.rgb, FARC, DARK*(1. - smoothstep(3., 6.5, px*(1. - FLAT))));
        // a bead of a sheet seen at a grazing angle is foreshortened flat: it keeps no glint (no white ovals on a floor)
        cg.a *= GLINT*graze;
        gl_FragColor = vec4(beadOut(cg), 1.);
      }`})}function Et(m,{header:w="",body:h="",uniforms:R={},twist:y=.55,tone:C=1}={}){return new c.ShaderMaterial({uniforms:{...m.uniforms,...R},vertexShader:`
      ${le}
      varying vec2 vUv; varying vec3 vVN, vVP;
      ${w}
      void main(){
        vec3 CEN = position, NRM = normal; float RAD = 0.25;
        ${h}
        vec4 mc = viewMatrix*modelMatrix*vec4(CEN, 1.);
        float minR = 0.8*max(-mc.z, 0.05)/(projectionMatrix[1][1]*uResY*0.5);
        vec3 n = mat3(viewMatrix*modelMatrix)*NRM;
        vec4 mv = mc + vec4(n*max(RAD, minR), 0.);
        vUv = uv; vVN = n; vVP = mv.xyz;
        gl_Position = projectionMatrix*mv;
      }`,fragmentShader:`
      ${le}
      varying vec2 vUv; varying vec3 vVN, vVP;
      void main(){
        vec3 n = vVN*inversesqrt(max(dot(vVN, vVN), 1e-8)); vec3 v = normalize(-vVP);
        float ph = vUv.y*2. + vUv.x*${y.toFixed(3)};
        float w = fwidth(ph);
        float ply = abs(fract(ph)*2. - 1.);                                   // 0 in the groove between plies
        float groove = mix(0.82, smoothstep(0.0, 0.5, ply)*0.42 + 0.58, 1. - smoothstep(0.25, 0.6, w));
        float nv = clamp(dot(n, v), 0., 1.);
        vec3 c = uThread*${C.toFixed(3)}*groove*(0.72 + 0.28*nv);
        gl_FragColor = vec4(toScene(c), 1.);
      }`})}function lt(m,w=.2,h=5,R=!1,y=0){const C=new c.CatmullRomCurve3(m,R,"centripetal"),g=C.getLength(),f=Math.max(3,Math.round(g/Math.max(w*5,.8))),F=C.computeFrenetFrames(f,R),N=[],k=[],Ee=[],qe=[],L=[],T=new c.Vector3;for(let K=0;K<=f;K++){C.getPointAt(K/f,T);for(let Z=0;Z<=h;Z++){const I=Z/h*Math.PI*2,O=F.normals[K],ae=F.binormals[K];N.push(T.x,T.y,T.z),k.push(O.x*Math.cos(I)+ae.x*Math.sin(I),O.y*Math.cos(I)+ae.y*Math.sin(I),O.z*Math.cos(I)+ae.z*Math.sin(I)),Ee.push(K/f*g,Z/h),qe.push(w,y*(K/f)**2)}}for(let K=0;K<f;K++)for(let Z=0;Z<h;Z++){const I=K*(h+1)+Z,O=I+h+1;L.push(I,O,I+1,I+1,O,O+1)}const E=new c.BufferGeometry;return E.setAttribute("position",new c.Float32BufferAttribute(N,3)),E.setAttribute("normal",new c.Float32BufferAttribute(k,3)),E.setAttribute("uv",new c.Float32BufferAttribute(Ee,2)),E.setAttribute("aRad",new c.Float32BufferAttribute(qe,2)),E.setIndex(L),E}const na={header:"attribute vec2 aRad;",body:`
  RAD = aRad.x;
  CEN = position + vec3(sin(uTime*0.63 + position.y*0.07), 0., cos(uTime*0.51 + position.x*0.09))*aRad.y*(1. + 1.5*uGust);`};function sa(m,w="uThread*0.42",h=c.FrontSide){return new c.ShaderMaterial({uniforms:m.uniforms,side:h,vertexShader:"varying vec3 vN, vP; void main(){ vec4 mv = modelViewMatrix*vec4(position, 1.); vN = normalMatrix*normal; vP = mv.xyz; gl_Position = projectionMatrix*mv; }",fragmentShader:`${le} varying vec3 vN, vP; void main(){ float nv = abs(dot(vN*inversesqrt(max(dot(vN, vN), 1e-8)), normalize(-vP)));
      gl_FragColor = vec4(toScene((${w})*(0.62 + 0.38*nv)), 1.); }`})}const Y=256,it=160,Be=4,Re=8.6,be=9,Te=28,ft=12,Xe=6,vt=`
  uniform sampler2D uCurve; uniform float uSLen, uRunH; uniform vec3 uCurveC, uSpanN, uDangA;
  uniform vec4 uRun;         // the rare run. x: 1 = staged (the lowest twelve are crystal), y: seconds since the thread jerked (< 0 before), z: the jerk's kick (m), w: lift of the lightened span (m)
  vec3 strandAt(float s){
    float u = clamp(s/uSLen, 0., 1.);
    vec4 t = textureLod(uCurve, vec2(u*${((Y-1)/Y).toFixed(6)} + ${(.5/Y).toFixed(6)}, 0.5), 0.);
    vec3 p = t.xyz*${it.toFixed(1)} + uCurveC;
    float sw = max(t.w, 0.), dw = max(-t.w, 0.);
    p += uSpanN*(sw*(sin(uTime*0.42 + s*0.012)*2.6 + sin(uTime*0.23 + 1.7)*1.2));
    p.y += sw*sin(uTime*0.31 + s*0.02)*0.8;
    float ph = uTime*0.628 - dw*0.9;
    p += uDangA*((sin(ph) + 0.4*sin(ph*2.3 + 1.3))*dw*dw*(2.2 + 3.*uGust) + uRun.z*dw*dw);
    p.y += uRun.w*sw;
    return p;
  }
  // frame at s: t along the thread, b1/b2 across
  void strandFrame(float s, out vec3 c, out vec3 t, out vec3 b1, out vec3 b2){
    c = strandAt(s);
    vec3 d = strandAt(s + 2.) - strandAt(s - 2.);
    t = d*inversesqrt(max(dot(d, d), 1e-6));
    vec3 r = cross(t, vec3(1., 0., 0.02)); b1 = r*inversesqrt(max(dot(r, r), 1e-6)); b2 = cross(t, b1);
  }
  uniform vec4 uDrop;        // x: metres slid down the tail, y: metres fallen, z: 1 while the lowest ball exists, w: turn
  uniform vec4 uSlip;        // x: slip 0..1, y: highest strung slot, z: feed offset for slots above it, w: balls gone
  uniform vec3 uRelease;     // where the lowest ball left the thread
  // centre and frame of ball slot i; returns its scale (0 = not there)
  float ballFrame(float i, out vec3 c, out vec3 t, out vec3 b1, out vec3 b2){
    float s = ${be.toFixed(1)} + (i - uSlip.x)*${Re.toFixed(2)};
    float sc = 1., fallR = 0.;
    bool run = uRun.x > 0.5 && uRun.y > 0. && i < 11.5;       // the run: the lowest twelve slide off the frayed end in one train
    if (run) {
      float need = i*${Re.toFixed(2)} + 7.4, ti = sqrt(need/6.5);
      s = ${be.toFixed(1)} + i*${Re.toFixed(2)} - min(6.5*uRun.y*uRun.y, need);
      if (uRun.y > ti) { float tf = uRun.y - ti; fallR = min(13.*ti, 20.)*tf + 4.9*tf*tf; if (fallR > uRunH) sc = 0.; }
    }
    else if (i < 0.5) { s = ${be.toFixed(1)} - uDrop.x; sc = uDrop.z; }
    else if (i > uSlip.y + 0.5) s += uSlip.z;
    sc *= 1. - smoothstep(uSLen - 11., uSLen - 5., s);
    strandFrame(s, c, t, b1, b2);
    float a = i*2.4 + uSlip.w*2.4 + sin(uTime*0.21 + i*1.7)*0.2;
    if (run) { c.y -= fallR; float w = fallR*0.06, cw = cos(w), sw = sin(w); vec3 t2 = t*cw + b2*sw; b2 = b2*cw - t*sw; t = t2; }
    else {
      if (i < 0.5 && uDrop.y > 0.) { c = uRelease + vec3(0., -uDrop.y, 0.); }
      if (i < 0.5) {                                              // the falling ball turns slowly about a level axis
        float w = uDrop.w, cw = cos(w), sw = sin(w);
        vec3 t2 = t*cw + b2*sw; b2 = b2*cw - t*sw; t = t2;
      }
    }
    float ca = cos(a), sa = sin(a);
    vec3 x1 = b1*ca + b2*sa; b2 = b2*ca - b1*sa; b1 = x1;
    return sc;
  }
`;async function da(m,w={}){const h=m.rng,R=we(w.detail??m.quality?.detail??1,.6,1),y=w.mirror?-1:1,C=w.style||oa({palette:w.palette,exposure:w.exposure??1.3,moon:w.moon}),g=new c.Group;g.name="unstrung-falls-hero";const f=c.Vector3,F={lipW:24*h.range(.92,1.1),sagY:150+h.range(-4,4),claspX:60+h.range(-7,7),claspY:236+h.range(-5,5),phase0:h.int(0,4),hook:h.range(.75,1.25),lean:h.range(-1,1),coneH:26*h.range(.92,1.1),dangX:h.range(5,9),heapSeed:h.range(0,100),wallSeed:h.range(0,100),ringTurn:h.range(0,6.28)},N=92,k=F.lipW,Ee=w.light?new c.Vector3(-w.light.x,w.light.y,-w.light.z).normalize():null,qe=new f(-34*y,160,-115),L=qe.clone();L.y+=1.6;const T=new f(F.claspX*y,F.claspY,-290),E=new f(T.x-L.x,0,T.z-L.z).normalize(),K=16*Math.PI/180,Z=E.clone().multiplyScalar(Math.cos(K)).addScaledVector(new f(E.z,0,-E.x),-Math.sin(K)),I=new f(Z.x*.866,.5,Z.z*.866).normalize(),O=new f(0,1,0).addScaledVector(I,-I.y).normalize(),ae=new f().crossVectors(O,I).normalize(),_=T.clone().addScaledVector(O,-10.4),qt=Math.hypot(_.x-L.x,_.z-L.z),ke=44.7,$t=e=>e<ke?F.sagY+(L.y-F.sagY)*((ke-e)/ke)**2:F.sagY+(_.y-F.sagY)*((e-ke)/(qt-ke))**1.8,$e=[];for(const e of[[F.dangX+3,-38,21],[F.dangX+2.6,-24,20],[F.dangX+1.4,-11,17],[5.5,-1.6,9.5]])$e.push(new f(L.x+e[0]*y,L.y+e[1],L.z+e[2]));$e.push(L.clone());for(const e of[12,27,ke,70,100,130,165])$e.push(new f(L.x+E.x*e,$t(e),L.z+E.z*e));$e.push(_.clone());const ct=new c.CatmullRomCurve3($e,!1,"centripetal");ct.arcLengthDivisions=600;const de=ct.getSpacedPoints(Y-1),Q=ct.getLength(),mt=Math.min(Te-1,Math.floor((Q-12.5-be)/Re));await m.yield();let pt=0,xt=1e9;for(let e=0;e<Y;e++){const t=de[e].distanceToSquared(L);t<xt&&(xt=t,pt=e)}const oe=pt/(Y-1)*Q,Ue=new f(0,180,-200),Ye=new Float32Array(Y),Ve=new Uint16Array(Y*4);for(let e=0;e<Y;e++){const t=e/(Y-1)*Q;Ye[e]=t<oe?-((oe-t)/oe):Math.sin(Math.PI*(t-oe)/(Q-oe)),Ve[e*4]=c.DataUtils.toHalfFloat((de[e].x-Ue.x)/it),Ve[e*4+1]=c.DataUtils.toHalfFloat((de[e].y-Ue.y)/it),Ve[e*4+2]=c.DataUtils.toHalfFloat((de[e].z-Ue.z)/it),Ve[e*4+3]=c.DataUtils.toHalfFloat(Ye[e])}const ge=new c.DataTexture(Ve,Y,1,c.RGBAFormat,c.HalfFloatType);ge.minFilter=ge.magFilter=c.LinearFilter,ge.wrapS=ge.wrapT=c.ClampToEdgeWrapping,ge.needsUpdate=!0;const wt=new f(-E.z,0,E.x),bt=new f(.8*y,0,.6).normalize(),G={uCurve:{value:ge},uSLen:{value:Q},uCurveC:{value:Ue},uSpanN:{value:wt},uDangA:{value:bt},uDrop:{value:new c.Vector4(0,0,1,0)},uSlip:{value:new c.Vector4(0,mt,1e4,F.phase0)},uRelease:{value:new f},uRun:{value:new c.Vector4(w.run?1:0,-1,0,0)},uRunH:{value:30}},gt=C.uniforms;function re(e,t=new f,a=-1){const o=we(e/Q,0,1)*(Y-1),r=Math.min(Y-2,Math.floor(o)),n=o-r;if(t.lerpVectors(de[r],de[r+1],n),a>=0){const s=B(Ye[r],Ye[r+1],n),d=Math.max(s,0),l=Math.max(-s,0);t.addScaledVector(wt,d*(Math.sin(a*.42+e*.012)*2.6+Math.sin(a*.23+1.7)*1.2)),t.y+=d*Math.sin(a*.31+e*.02)*.8;const i=a*.628-l*.9;t.addScaledVector(bt,(Math.sin(i)+.4*Math.sin(i*2.3+1.3))*l*l*(2.2+3*gt.uGust.value))}return t}{const t=Be-.4,a=[];for(let b=0;b<16;b++){const A=(-.5+(b+.5)/16)*Math.PI,$=Math.max(5,Math.round(2*Math.PI*t*Math.cos(A)/.83));for(let ze=0;ze<$;ze++){const X=(ze+b%2*.5)/$*Math.PI*2;a.push([Math.cos(A)*Math.cos(X),Math.sin(A),Math.cos(A)*Math.sin(X),b])}}const o=a.length*Te,r=new Float32Array(o*3),n=new Float32Array(o*4);let s=0;for(let b=0;b<Te;b++){const A=h.int(0,a.length-1),$=h.chance(.5)?h.int(0,a.length-1):-1,ze=h.chance(.4)?h.int(3,12):-1;for(let X=0;X<a.length;X++,s++){const D=a[X];r[s*3]=D[0],r[s*3+1]=D[1],r[s*3+2]=D[2];const nt=D[3]<1||D[3]>14,V=D[3]===1||D[3]===14,Dt=nt||V&&X%2===0?4:D[3]===7||D[3]===8?3:0;n[s*4]=b,n[s*4+1]=X===A||X===$?1:Dt,n[s*4+2]=h(),n[s*4+3]=D[3]===ze?.93:1}b%6===5&&await m.yield()}const d=ie(o);d.setAttribute("aO",new c.InstancedBufferAttribute(r,3)),d.setAttribute("aI",new c.InstancedBufferAttribute(n,4));const l=ce(C,{uniforms:G,header:vt+"attribute vec3 aO; attribute vec4 aI;",body:`
      vec3 bc, t, b1, b2; float sc = ballFrame(aI.x, bc, t, b1, b2);
      vec3 o = b1*aO.x + t*aO.y + b2*aO.z;
      C = bc + o*(${t.toFixed(2)}*aI.w*sc); R = 0.43*sc;
      R *= smoothstep(1.0, 1.7, 0.86*projectionMatrix[1][1]*uResY*0.5/max(-(viewMatrix*modelMatrix*vec4(bc, 1.)).z, 0.05));   // too far to count: the ball's disc stands in
      vec3 tr = cross(t, o); AX = tr*inversesqrt(max(dot(tr, tr), 1e-5)); E1 = o;
      float cry = max(step(mod(aI.x + uSlip.w + 0.5, 5.), 1.), uRun.x*step(aI.x, 11.5));
      KIND = cry; LINED = cry; SEED = aI.z + aI.x*0.137;
      float cor = step(3.5, aI.y);
      vec3 pearlRow = aI.y > 2.5 ? uSilver : (aI.y > 1.5 ? uSlate : (aI.y > 0.5 ? uBlue : uPearl));
      vec3 cryRow = aI.y > 1.5 ? mix(uSilver, uGlint, 0.5) : (aI.y > 0.5 ? uPearl : uSilver);
      COLA = mix(mix(pearlRow, cryRow, cry), uCoral, cor); COLB = COLA; LINED = max(LINED, step(2.5, aI.y))*(1. - cor); KIND *= 1. - cor;
      // moonlight: each ball has a lit side (its own rows) and a shaded side (midnight beads; slate on a crystal), the
      // change made bead by bead, and a thin silver rim of beads round its limb
      vec3 ow = mat3(modelMatrix)*o; ow *= inversesqrt(max(dot(ow, ow), 1e-6));
      vec3 vd = (modelMatrix*vec4(bc, 1.)).xyz - cameraPosition; vd *= inversesqrt(max(dot(vd, vd), 1e-6));
      float lit = max(step(fract(aI.z*7.31 + 0.13), smoothstep(-0.7, -0.3, dot(ow, uMoon))), cor);
      float limb = step(abs(dot(ow, vd)), 0.2)*(1. - lit);
      cry *= 1. - cor;
      vec3 shade = mix(uDeep, uSlate, cry);
      COLA = mix(mix(shade, uSilver, limb), COLA, lit); COLB = COLA; LINED = max(LINED*lit, limb); KIND *= max(lit, 1. - cry);`}),i=new c.Mesh(d,l);i.frustumCulled=!1,i.name="strand-beads",g.add(i);const v=new c.IcosahedronGeometry(Be-.62,2),u=new c.InstancedBufferGeometry;u.setAttribute("position",v.getAttribute("position")),v.index&&u.setIndex(v.index);const x=new Float32Array(Te);for(let b=0;b<Te;b++)x[b]=b;u.setAttribute("aSlot",new c.InstancedBufferAttribute(x,1)),u.instanceCount=Te,u.boundingSphere=new c.Sphere(new f,1e5);const M=new c.ShaderMaterial({uniforms:{...gt,...G},vertexShader:`${le}${vt} attribute float aSlot; varying vec3 vN, vP, vRim; varying float vCry, vFar;
        void main(){ vec3 bc, t, b1, b2; float sc = ballFrame(aSlot, bc, t, b1, b2); vec3 o = b1*position.x + t*position.y + b2*position.z;
          // distance makes beads bigger and fewer: from the river, through the notch, every third ball stands for three,
          // so the strand over the lip is a row of separate pale discs on its thread; the rest grow in as we come up the gorge
          float dfar = smoothstep(300., 380., length((viewMatrix*modelMatrix*vec4(bc, 1.)).xyz));
          sc *= mod(floor(aSlot - uSlip.x + 0.5) + 2., 3.) > 0.5 ? 1. - dfar : 1. + 0.35*dfar;
          vFar = 1. - smoothstep(1.0, 1.7, 0.86*projectionMatrix[1][1]*uResY*0.5/max(-(viewMatrix*modelMatrix*vec4(bc, 1.)).z, 0.05));
          vec4 mv = viewMatrix*modelMatrix*vec4(bc + o*sc*(1. + ${(.62/(Be-.62)).toFixed(3)}*vFar), 1.);
          vRim = (mv.xyz - (viewMatrix*modelMatrix*vec4(bc, 1.)).xyz)/(${Be.toFixed(1)}*max(sc, 0.3));      /* across the ball's disc, -1..1 */
          vec3 ow = mat3(modelMatrix)*o; vRim.z = dot(ow*inversesqrt(max(dot(ow, ow), 1e-6)), uMoon);     /* the moon's side of the ball */
          vN = mat3(viewMatrix*modelMatrix)*o; vP = mv.xyz; vCry = max(step(mod(aSlot + uSlip.w + 0.5, 5.), 1.), uRun.x*step(aSlot, 11.5));
          gl_Position = sc > 0.01 ? projectionMatrix*mv : vec4(0., 0., 2., 1.); }`,fragmentShader:`${le} varying vec3 vN, vP, vRim; varying float vCry, vFar;
        void main(){ float nv = clamp(dot(vN*inversesqrt(max(dot(vN, vN), 1e-8)), -vP*inversesqrt(max(dot(vP, vP), 1e-8))), 0., 1.);
          // far off a ball is one pale disc with a darker rim, so a row of them reads as beads on a thread
          vec3 disc = mix(uPearl, mix(uSilver, uGlint, 0.5), vCry)*(1. - 0.5*smoothstep(0.55, 0.98, length(vRim.xy)));
          disc = mix(mix(uDeep, uSlate, vCry), disc, smoothstep(-0.56, -0.44, vRim.z));                         // its shaded side
          gl_FragColor = vec4(toScene(mix(mix(uThread*0.5, uSlate*0.62, vCry)*(0.6 + 0.4*nv), disc, clamp(vFar, 0., 1.))), 1.); }`}),p=new c.Mesh(u,M);p.frustumCulled=!1,p.name="strand-backing",g.add(p),v.dispose()}await m.yield();{const e=[],t=[],a=[],o=[],r=(l,i,v,u,x)=>{const M=e.length/3;for(let p=0;p<=v;p++)for(let b=0;b<=u;b++){const A=B(l,i,p/v),$=b/u*Math.PI*2;e.push(A,$,x),t.push(A,b/u),a.push(A,$,x)}for(let p=0;p<v;p++)for(let b=0;b<u;b++){const A=M+p*(u+1)+b,$=A+u+1;o.push(A,$,A+1,A+1,$,$+1)}};r(3.5,Q,250,6,0);for(let l=1;l<=5;l++)r(0,6.5-l*.5,9,3,l);const n=new c.BufferGeometry;n.setAttribute("position",new c.Float32BufferAttribute(e,3)),n.setAttribute("uv",new c.Float32BufferAttribute(t,2)),n.setAttribute("aT",new c.Float32BufferAttribute(a,3)),n.setIndex(o),n.boundingSphere=new c.Sphere(new f,1e5);const s=Et(C,{uniforms:G,header:vt+"attribute vec3 aT;",body:`
      vec3 c, t, b1, b2; strandFrame(aT.x, c, t, b1, b2);
      RAD = 0.26;
      if (aT.z > 0.5) {
        float k = 1. - aT.x/6.5, a = aT.z*1.9 + 0.4;
        c += (b1*cos(a) + b2*sin(a))*(k*k*(0.55 + 0.3*sin(uTime*0.8 + aT.z*2.1)) + 0.12) + t*(k*k*0.4*sin(aT.z*5.));
        RAD = 0.08;
      }
      CEN = c; NRM = b1*cos(aT.y) + b2*sin(aT.y);`}),d=new c.Mesh(n,s);d.frustumCulled=!1,d.name="strand-thread",g.add(d)}await m.yield();const J={p:[],ax:[],k:[]},ue=(e,t,a,o,r,n,s,d,l,i=0)=>{J.p.push(e,t,a,o),J.ax.push(r,n,s),J.k.push(d,l,h(),i)},he=new f,ee=new f,_e=new f;function yt(e,t,a,o,r,n=.75){const s=new c.CatmullRomCurve3(e,!1,"centripetal"),d=s.getLength(),l=Math.max(4,Math.round(d/(o*.9))),i=s.computeFrenetFrames(l,!1),v=p=>B(t,a,p**.8)*(1+.1*Math.sin(p*17+t));for(let p=0;p<=l;p++){const b=p/l,A=v(b),$=Math.max(4,Math.round(2*Math.PI*A/o));s.getPointAt(b,he);const ze=h.int(0,$-1),X=h.chance(.12)?.9:1;for(let D=0;D<$;D++){const nt=(D+p%2*.5)/$*Math.PI*2;ee.copy(i.normals[p]).multiplyScalar(Math.cos(nt)).addScaledVector(i.binormals[p],Math.sin(nt)),_e.crossVectors(i.tangents[p],ee);const V=r(p,D,l,D===ze);Ee&&(ee.dot(Ee)+.22*(Math.sin(p*12.9898+D*78.233)*43758.5453%1)>.12?V[0]===0?(V[0]=3,V[2]=0):V[0]===3&&(V[0]=2,V[2]=1):(V[0]===2||V[0]===3)&&(V[0]=1,V[2]=0)),ue(he.x+ee.x*A*X,he.y+ee.y*A*X,he.z+ee.z*A*X,o*.5,_e.x,_e.y,_e.z,V[0],V[1],V[2])}}const u=new c.TubeGeometry(s,l,1,10,!1),x=u.getAttribute("position"),M=u.getAttribute("normal");for(let p=0;p<x.count;p++){const b=Math.floor(p/11)/l,A=v(b)-o*n*.5;x.setXYZ(p,x.getX(p)+M.getX(p)*(A-1),x.getY(p)+M.getY(p)*(A-1),x.getZ(p)+M.getZ(p)*(A-1))}return u}const Ie=[],We=[];{const e=[[8.32,.76,4,0,0],[9.98,.86,2,1,1],[11.62,.8,3,0,0]];for(const[a,o,r,n,s]of e){const d=Math.round(2*Math.PI*a/(o*2.03)),l=h.int(0,d-1);for(let i=0;i<d;i++){const v=i/d*Math.PI*2+F.ringTurn,u=Math.cos(v),x=Math.sin(v);he.copy(T).addScaledVector(O,u*a).addScaledVector(ae,x*a),ee.copy(O).multiplyScalar(-x).addScaledVector(ae,u),ue(he.x,he.y,he.z,o,ee.x,ee.y,ee.z,i===l?r===4?3:1:r,n,s)}}const t=[];for(let a=0;a<40;a++){const o=a/40*Math.PI*2;t.push(T.clone().addScaledVector(O,Math.cos(o)*9.98).addScaledVector(ae,Math.sin(o)*9.98))}Ie.push(lt(t,1.15,6,!0));for(let a=0;a<6;a++){const o=a*1.05;ue(_.x+Math.cos(o)*.7,_.y+.5+a%2*.7,_.z+Math.sin(o)*.7,.62,Math.cos(o*2),.3,Math.sin(o*2),5,2,0)}Ie.push(lt([_.clone(),_.clone().add(new f(1.2*y,-3,.8)),_.clone().add(new f(1.6*y,-8,1.4)),_.clone().add(new f(1.2*y,-13,1.2))],.2,4,!1,2.2))}await m.yield();const At=new f(-45*y,82,-127);{const e=F.lean*3.5,t=F.hook,a=[At.clone(),new f((-46+e*.5)*y,106,-125),new f((-43+e)*y,131,-121.5),new f((-38+e*.4)*y,150,-118.4),new f(L.x-.9*y,L.y-2.9,L.z-1.4),new f(L.x+.5*y,L.y-2.2,L.z+.6),new f(L.x+1.6*y*t,L.y-.4,L.z+2.2*t),new f(L.x+1.9*y*t,L.y+3.2*t,L.z+2.6*t)];We.push(yt(a,8.2,.85,1.7,(n,s,d,l)=>{if(l)return[1,0,0];const i=n%9;return i===0?[3,0,0]:i===1||i===8?[2,2,1]:[(n+s)%13===0?2:0,n>d-7?2:0,(n+s)%13===0?1:0]}));const o=[];for(let n=0;n<=30;n++){const s=n/10*Math.PI*2,d=150-1.1*n/10;o.push(new f((-38+e*.4)*y+Math.cos(s)*3.1,d-2+Math.sin(s)*.5,-118.4+Math.sin(s)*3.1))}Ie.push(lt(o,.2,4,!1));const r=o[30];Ie.push(lt([r.clone(),r.clone().add(new f(.6,-4,.8)),r.clone().add(new f(1,-11,1))],.16,4,!1,2.6))}await m.yield();const la=T.clone().addScaledVector(O,12.6);{const e=y,t=(o,r,n)=>T.clone().addScaledVector(I,o).addScaledVector(O,r).addScaledVector(ae,n*e),a=[t(34,-128,30),t(30,-84,27),t(24,-42,21),t(15,-6,13),t(7,12.5,5),t(1.2,15.6,.6),t(-2.6,14.4,-.4),t(-3.8,11.6,-.6)];We.push(yt(a,15,1.3,3,(o,r,n,s)=>{if(s)return[1,0,0];const d=o%7;return d===0?[2,0,1]:[d===3&&r%2===0?1:0,0,0]},.8))}await m.yield();const dt=m.noise;function Ze(e,t,a,o=!1){const r=new Float32Array((e+1)*(t+1)*3),n=new Float32Array((e+1)*(t+1)*2),s=[],d=[0,0,0,0,0];for(let i=0,v=0;i<=t;i++)for(let u=0;u<=e;u++,v++)a(u/e,i/t,d),r[v*3]=d[0],r[v*3+1]=d[1],r[v*3+2]=d[2],n[v*2]=d[3],n[v*2+1]=d[4];for(let i=0;i<t;i++)for(let v=0;v<e;v++){const u=i*(e+1)+v,x=u+e+1;s.push(u,u+1,x,u+1,x+1,x)}const l=new c.BufferGeometry;if(l.setAttribute("position",new c.BufferAttribute(r,3)),l.setAttribute("uv",new c.BufferAttribute(n,2)),l.setIndex(s),l.computeVertexNormals(),o){const i=l.getAttribute("normal");for(let v=0;v<=t;v++){const u=v*(e+1),x=u+e,M=i.getX(u)+i.getX(x),p=i.getY(u)+i.getY(x),b=i.getZ(u)+i.getZ(x),A=Math.hypot(M,p,b)||1;i.setXYZ(u,M/A,p/A,b/A),i.setXYZ(x,M/A,p/A,b/A)}}return l}const ye=-72,fe=60,Ae=74,Ke=112,Vt=e=>{const t=Math.abs(Math.cos(e)),a=Math.abs(Math.sin(e));return 1/Math.pow(Math.pow(t/Ae,2.6)+Math.pow(a/fe,2.6),1/2.6)},Ce=(e,t,a)=>{const o=Vt(e)*t;return a[0]=Math.sin(e)*o*y,a[2]=ye+Math.cos(e)*o,a},Ne=e=>1-U(k*.5-.5,k*.5+5,Math.abs(e)),Qe=(e,t)=>{const a=U(.55,.95,Math.cos(e)),o=B(98+7*dt.n2(e*1.3,F.wallSeed)+7*Math.pow(Math.abs(Math.sin(e*5.5+F.wallSeed)),6),Ke,a);return B(o,N-.6,a*Ne(t))},q=120,ne=new Float32Array(q+1),S=[0,0,0],j=[0,0,0];for(let e=1;e<=q;e++)Ce((e-1)/q*Math.PI*2-Math.PI,1,S),Ce(e/q*Math.PI*2-Math.PI,1,j),ne[e]=ne[e-1]+Math.hypot(j[0]-S[0],j[2]-S[2]);const Kt=e=>{const t=we(e,0,1)*q,a=Math.min(q-1,Math.floor(t));return B(ne[a],ne[a+1],t-a)},Je=(e,t,a)=>{const o=e*Math.PI*2-Math.PI,r=Math.min(t/.8,1),n=Math.max(0,(t-.8)/.2),s=.1*Math.pow(Math.abs(Math.sin(o*5.5+F.wallSeed)),4)*(1-.7*U(.75,.95,Math.cos(o)))+.02*dt.n2(o*5,r*3+F.wallSeed),d=1+Math.pow(1-r,2.2)*.22+s*(1-n)-n*.14-.02*Math.sin(r*3.1);Ce(o,d,a);const l=Qe(o,a[0]);return a[1]=B(-6,l,r)-n*n*3.5,a[3]=Kt(e),a[4]=B(-6,Ke,r)*(l/Ke)+n*12+(l-100),a};await m.yield();const Ct=new Float32Array((q+1)*27*5);{const e=[0,0,0,0,0];for(let t=0,a=0;t<=26;t++){for(let o=0;o<=q;o++,a++)Je(o/q,t/26,e),Ct.set(e,a*5);t%3===2&&await m.yield()}}let Mt=0;const Lt=Ze(q,26,(e,t,a)=>{for(let o=0;o<5;o++)a[o]=Ct[Mt+o];Mt+=5},!0);await m.yield();{const e=new Float32Array((q+1)*27);for(let t=0,a=0;t<=26;t++)for(let o=0;o<=q;o++,a++)e[a]=Math.max(0,(t/26-.8)/.2);Lt.setAttribute("aOv",new c.BufferAttribute(e,1))}const Gt=st(C,{header:"attribute float aOv;",vertex:"AUX.x = aOv;",fragment:`
    vec2 pc = (floor(uv/37.) + 0.5)*37. + (vec2(hash2(floor(uv/37.)), hash2(floor(uv/37.) + 7.3)) - 0.5)*20.;
    vec2 pd = uv - pc; uv -= pd*exp(-dot(pd, pd)/40.)*0.42;                      // a pucker: tension pulled too tight
    PITCH = 1.2; float rw = floor(uv.y/PITCH), cl = floor(uv.x/PITCH + 0.5*mod(rw, 2.));
    float zz = abs(mod(cl*0.5 + 600., 26.) - 13.), band = mod(rw - zz + 800., 17.);
    // the fall's two flanks are calm dark planes: midnight, the zigzag in a close navy, no pale bead anywhere (the gust
    // does not turn them: the pour is the one bright thing here)
    COLA = band < 4. ? uNavy : uDeep; COLB = COLA; COLW = uNavy;
    // far off, where its rows are too fine to draw, the wall is one plain midnight mass (the dark flank of the white
    // stroke); the coping that turns in over the basin lies under real beads and is dark backing cloth
    DARK = 1.; FARC = uDeep;
    if (AUX.x > 0.03) { FLAT = 1.; FARC = uVelvet*1.6 + uBlue*0.22; }`}),St=new c.Mesh(Lt,Gt);St.name="bastion",g.add(St),await m.yield();{const e=[0,0,0,0,0],t=1.2,a=r=>{let n=1;for(;n<q&&ne[n]<r;)n++;return(n-1+(r-ne[n-1])/Math.max(ne[n]-ne[n-1],1e-6))/q},o=Math.floor(ne[q/2]/t);for(let r=6;r<98;r++)for(let n=-36;n<=36;n++){n===-36&&r%8===0&&await m.yield();const s=o+n,d=a((s+.5-.5*(r%2))*t);Je(d,.4,e);const l=Math.abs(e[0]);if(l<k*.5-1.5||l>k*.5+25||r<40&&l<k*.5+2.5)continue;const i=d*Math.PI*2-Math.PI,v=Qe(i,e[0]),u=(((r+.5)*t-(v-100))*Ke/v+6)/(Ke+6);if(u>.985||u<.05)continue;Je(d,u*.8,e);const x=Math.abs((s*.5+600)%26-13),M=((r-x+800)%17+17)%17,p=h()<.045;let b=0,A=0;M<4&&(b=6),p&&(b=1),l<k*.5+5&&(s*7+r*3)%5<2&&(b=1,A=1),ue(e[0]+Math.sin(i)*.3*y,e[1],e[2]+Math.cos(i)*.3,t*.49,Math.cos(i)*y,0,-Math.sin(i),b,3,A)}await m.yield();for(let r=0;r<3;r++){const n=160-r*7;for(let s=0;s<n;s++){const d=(s+.5*(r%2))/n,l=d*Math.PI*2-Math.PI;if(Je(d,.8+.2*(.27+r*.3),e),Ne(e[0])*U(.55,.95,Math.cos(l))>.2)continue;let i=(s+r*3)%9===0?3:r===1?s%13===5?1:2:0;Math.cos(l)>.45&&(i=i===0?0:i===1?1:6),ue(e[0],e[1]+.35,e[2],1.26,Math.cos(l)*y,0,-Math.sin(l),i,0,i===2?1:0)}}}for(let e=0;e<300;e++){const t=(e+.5)/300*Math.PI*2-Math.PI;Ce(t,.985,S),Ce(t+.01,.985,j);const a=Qe(t,S[0]),o=Ne(S[0])*U(.55,.95,Math.cos(t));if(o>.5)continue;const r=Math.hypot(j[0]-S[0],j[2]-S[2])||1,n=o>.02,s=Math.cos(t)>.45,d=e%11===3?1:e%5===0?3:2;if(s&&Math.abs(S[0])<40){const l=e%3===1?4:e%3===0?3:2;ue(S[0],a+.7,S[2],1.2,(j[0]-S[0])/r,0,(j[2]-S[2])/r,l,5,l===2?1:0);continue}ue(S[0],a+.5,S[2],n?.95:e%5===0?1.15:.82,(j[0]-S[0])/r,0,(j[2]-S[2])/r,s?d===1?1:d===3?6:0:d,e%5===0?0:2,s||e%5===0?0:1)}for(let e=-1;e<=1;e+=2){let t=1e9,a=1e9,o=1e9,r=0;for(let n=0;n<300;n++){const s=e*n*.002;Ce(s,.99,S);const d=Ne(S[0])*U(.55,.95,Math.cos(s));if(d>.985||d<.03)continue;const l=Qe(s,S[0])+.35;if(!(Math.hypot(S[0]-t,l-a,S[2]-o)<2.3)){t=S[0],a=l,o=S[2];{const i=r%3===1?4:r%3===0?3:2;J.p.push(t,a,o,1.2+.14*(r*7%3===0?1:0)),J.ax.push(.25*e,.2,1),J.k.push(i,5,(r*.61803+(e>0?.13:.57))%1,i===2?1:0),r++}}}}const ve=(e,t)=>{const a=Math.hypot(e/(fe-4),(t-ye)/(Ae-4)),o=5.5*Math.exp(-((e+24*y)**2+(t+99)**2)/520)+2.2*dt.n2(e*.045+F.heapSeed,t*.045),r=U(-34,0,t);return B(N+4.5+o*(1-.6*a*a),N+.35,r)-U(.86,1.02,a)*(1-r*Ne(e))*1.4},jt=Ze(56,18,(e,t,a)=>{const o=e*Math.PI*2-Math.PI;Ce(o,.03+.93*Math.sqrt(t),a);const r=U(.8,.98,Math.cos(o))*Ne(a[0]);r>0&&t>.8&&(a[2]=B(a[2],Math.max(a[2],1.2),r*(t-.8)*5)),a[1]=ve(a[0],a[2]),a[3]=a[2],a[4]=a[0]},!0),Ge={uFlow:{value:0}},Ht=st(C,{uniforms:Ge,side:c.DoubleSide,fragHeader:"uniform float uFlow;",fragment:`
    PITCH = 1.25; ROLL = 1.; SHEAR = 0.8; SCROLL = uFlow*1.1; BRICK = 0.;
    // a dark bed of slate and midnight rounds; every third lane is pearls creeping to the lip (and the loose pearls lie on it)
    COLA = uSlate; COLB = mix(uSlate, uBlue, 0.6); COLW = uSilver; LINED = 0.;
    // (round 4: the heap's beads are real rounds now, 'heap-carpet'; this sheet is only the dark cloth seen between them)
    FLAT = 1.; DARK = 1.; FARC = mix(uSlate, uBlue, 0.6)*0.5 + uVelvet;   // (seen at a grazing angle the heap is one calm dark cloth under its loose pearls)`}),Ft=new c.Mesh(jt,Ht);Ft.name="heap",g.add(Ft),await m.yield();const Pe=28,zt=26,ut=F.coneH,Me=100,je=(e,t)=>{const a=Math.hypot(e,(t-Pe)*(t<Pe?1.25:.86))/zt,o=ut*Math.pow(Math.max(0,1-a),1.25)*(1-.25*Math.exp(-a*a*30)),r=.9*Math.cos(we(e/17,-1.5,1.5))+3.5*U(15,24,Math.abs(e))-8*U(27,34,Math.abs(e))-.4;return Math.max(o+r*(1-Math.min(1,o/6)),r)},se=44,Le=64,et=new Float32Array((se+1)*(Le+1));for(let e=0;e<=se;e++)for(let t=1;t<=Le;t++){const a=B(-34,34,e/se),o=B(-3,Me,(t-1)/Le),r=B(-3,Me,t/Le);et[t*(se+1)+e]=et[(t-1)*(se+1)+e]+Math.hypot(r-o,je(a,r)-je(a,o))}const Xt=Ze(se,Le,(e,t,a)=>{a[0]=B(-34,34,e),a[2]=B(-3,Me,t),a[1]=je(a[0],a[2]);const o=Math.round(e*se),r=Math.round(t*Le);a[3]=et[r*(se+1)+o]-et[20*(se+1)+o]+B(-3,Me,20/Le),a[4]=a[0]}),Ut=st(C,{uniforms:Ge,side:c.DoubleSide,fragHeader:"uniform float uFlow;",fragment:`
    PITCH = 1.4; ROLL = 1.; SHEAR = 0.7; SCROLL = uFlow*3.; BRICK = 0.;
    float dn = smoothstep(50., 90., uv.x);                 // the cone is a heap of pearls; downstream the bed goes to slate and midnight under the rolling pearls
    COLA = mix(uPearl, uSlate, dn); COLB = mix(uSilver, mix(uSlate, uBlue, 0.6), dn); COLW = mix(uSlate, uSilver, dn); LINED = mix(0.5, 0.15, dn);
    if (mod(floor(uv.y/PITCH), 5.) < 1.) { COLA = mix(uSilver, uNavy, dn); COLB = mix(mix(uSilver, uGlint, 0.6), uBlue, dn); LINED = 1. - dn; }
    GLINT = 1. - 0.5*dn;
    // (round 4: close to and seen at a grazing angle, as from the climb, the cone is dark cloth under its loose pearls, never a pale striped sheet)
    float gzb = (1. - GRAZE)*(1. - smoothstep(38., 62., length(vVP)));
    // (round 6: and wherever it is looked down on from near by, as the steady camera does on the climb: cloth, not foreshortened ovals)
    float obl = (1. - smoothstep(0.6, 0.85, abs(ja.x*jb.y - ja.y*jb.x)/max(max(dot(ja, ja), dot(jb, jb)), 1e-9)))*(1. - smoothstep(45., 80., length(vVP)));
    gzb = max(gzb, obl); FLAT = max(FLAT, obl);
    DARK = gzb; FARC = mix(uSlate, uDeep, 0.5); COLA = mix(COLA, uSlate, gzb); COLB = mix(COLB, mix(uSlate, uDeep, 0.6), gzb); LINED *= 1. - gzb;`}),Bt=new c.Mesh(Xt,Ut);Bt.name="cone-and-bed",g.add(Bt);for(let e=-1;e<=1;e+=2)for(let t=0;t<2;t++)for(let a=46+t*1.6;a<Me+2;a+=3.15){const o=e*(19.5+t*3.3+Math.sin(a*.11)*1.2),r=1.5-t*.25;ue(o,je(o,a)+r*.7,a,r,.2*e,.1,1,(Math.round(a)+t)%9===0?1:t?0:e<0?2:0,0,t?0:e<0?1:0)}await m.yield();const P=9.8,Oe=25,W=Oe/P,z=7,Rt=e=>e<W?.5*P*e*e:.5*P*W*W+Oe*(e-W),Se=`
    uniform vec3 uCamL, uCamF; uniform float uFlow, uSurge; uniform vec4 uClrA, uClrB;
    float fallD(float t){ return t < ${W.toFixed(4)} ? ${(.5*P).toFixed(2)}*t*t : ${(.5*P*W*W).toFixed(3)} + ${Oe.toFixed(1)}*(t - ${W.toFixed(4)}); }
    float bedYg(vec2 p){
      float dz = (p.y - ${Pe.toFixed(1)})*(p.y < ${Pe.toFixed(1)} ? 1.25 : 0.86);
      float r = length(vec2(p.x, dz))/${zt.toFixed(1)};
      float cone = ${ut.toFixed(3)}*pow(max(0., 1. - r), 1.25)*(1. - 0.25*exp(-r*r*30.));
      float river = 0.9*cos(clamp(p.x/17., -1.5, 1.5)) + 3.5*smoothstep(15., 24., abs(p.x)) - 8.*smoothstep(27., 34., abs(p.x)) - 0.4;
      return max(cone + river*(1. - min(1., cone/6.)), river);
    }
    // a tumbling frame from a seed and two angles: the hole axis turns, and the bead turns about it
    void tumble(float seed, float th, float ph, out vec3 ax, out vec3 e1){
      float a = seed*61.7, z = fract(seed*17.3)*2. - 1., s = sqrt(max(1. - z*z, 0.));
      vec3 k = vec3(s*cos(a), z, s*sin(a));
      vec3 u = cross(k, vec3(0.31, 0.2, 0.93)); u *= inversesqrt(max(dot(u, u), 1e-5)); vec3 w = cross(k, u);
      ax = u*cos(th) + w*sin(th);
      vec3 c = cross(ax, k); e1 = k*cos(ph) + c*sin(ph);
    }
    // keep a clear tube round the eye: anything nearer than 3 m is pushed out sideways
    // (and out of a cone round the line of sight for the first six metres, so no bead sits against the lens)
    // (round 7) a clear cone from the eye to something that flies with us (q: its place and its radius; radius 0 = none):
    // the loose beads part round it, so it is seen whole against the beads behind
    vec3 clearCone(vec3 c, vec4 q){
      vec3 ax = q.xyz - uCamL; float L = max(length(ax), 1e-3); ax /= L;
      vec3 d = c - uCamL; float al = dot(d, ax); vec3 lat = d - ax*al; float ll = length(lat);
      float qw = max(q.w, 1e-3);
      float need = q.w*clamp(al/L, 0., 1.)*(1. - smoothstep(L + qw, L + qw*2.5, al))*step(0., al);
      return c + lat/max(ll, 1e-3)*max(0., need - ll);
    }
    vec3 keepClear(vec3 c){
      vec3 d = c - uCamL; float l = length(d); c += d/max(l, 1e-3)*max(0., 3.2 - l);
      d = c - uCamL; float al = dot(d, uCamF);
      vec3 lat = d - uCamF*al; float ll = length(lat);
      float need = (0.9 + 0.6*max(al, 0.))*(1. - smoothstep(7.5, 12., al))*step(0., al);
      c += lat/max(ll, 1e-3)*max(0., need - ll);
      return clearCone(clearCone(c, uClrA), uClrB);
    }
    void looseLook(float seed, out vec3 ca, out vec3 cb, out float kind, out float lined){
      float h = fract(seed*91.3);
      ca = uPearl; cb = mix(uPearl, uSilver, 0.9); kind = 0.; lined = 0.4;
      if (h < 0.24) { ca = uSilver; cb = mix(uSilver, uGlint, 0.55); lined = 1.; }
      if (h < 0.07) { kind = 1.; }
      if (h > 0.975) { ca = uSlate; cb = uSlate; lined = 0.; }
    }`,H={uCamL:{value:new f(0,-999,0)},uCamF:{value:new f(0,0,-1)},uFlow:Ge.uFlow,uSurge:{value:0},uClrA:{value:new c.Vector4(0,-999,0,0)},uClrB:{value:new c.Vector4(0,-999,0,0)}},ht=(e,t,a)=>{let o=3;for(let r=0;r<80&&!(N+.4+a-Rt(o)<je(e,.6+t*o)+a);r++,o+=.04);return o};{const a=new Float32Array(15),o=new Float32Array(465);for(let l=0;l<=14;l++)a[l]=ht(B(-.5,.5,l/14)*k,z,0)+.25;const r=(l,i,v)=>{const u=i/30*a[l],x=B(-.5,.5,l/14)*k;return v[0]=x*(1+.1*i/30),v[1]=N+.35-Rt(u),v[2]=.4+z*u-1.4*Math.sin(l/14*Math.PI),v};for(let l=0;l<=14;l++)for(let i=1;i<=30;i++)r(l,i-1,S),r(l,i,j),o[i*15+l]=o[(i-1)*15+l]+Math.hypot(j[1]-S[1],j[2]-S[2]);const n=Ze(14,30,(l,i,v)=>{const u=Math.round(l*14),x=Math.round(i*30);r(u,x,v),v[3]=o[x*15+u],v[4]=v[0]}),s=st(C,{uniforms:{...Ge,uSurge:H.uSurge,uCoreFar:{value:.8}},side:c.DoubleSide,header:"uniform float uSurge;",vertex:`P.x *= 1. + 0.9*uSurge*smoothstep(0., 9., ${(N+.35).toFixed(2)} - P.y);`,fragHeader:"uniform float uFlow, uCoreFar;",fragment:`
      float dC = length(vVP); PITCH = dC > 225. ? 6. : (dC > 70. ? 3. : 1.5);     // distance makes beads bigger and fewer: from the river the fall is four lanes of 6 m pearls pouring, not a blank stroke
      ROLL = 1.; SHEAR = 0.5; SCROLL = uFlow*15.; FLAT = 0.25; COLA = uPearl; COLB = mix(uPearl, uSilver, 0.7); COLW = uSilver; LINED = 0.3; BRICK = 0.; DARK = 1.; FARC = uPearl;
      // far off the core is the shadowed inside of the fall (slate rounds on midnight): the big pearls tumbling in front of it are the white
      // close to, the core is drawn as its lanes' flat tints (pearl and silver by turns: streaks of the flow) behind the loose beads, never as flat discs
      float nearC = 1. - smoothstep(18., 40., dC);
      // (round 4: close to and square on, the core is rows of slate rounds on midnight pouring behind the loose pearls)
      // (and wherever the sheet is seen at a grazing angle, as it is all the way up the climb: never a flat pale striped surface)
      float gz = max(nearC, (1. - GRAZE)*(1. - smoothstep(110., 160., dC)));
      float fc = max(uCoreFar, gz);                             // (at every distance: the pearls tumbling before it are the white, the core is the dark behind them)
      // (round 6) close to (the steady camera looks down on it from 8 m) the core is plain dark cloth behind the loose pearls: one flat
      // slate-midnight tone, never rows printed on a smooth sheet
      FLAT = max(FLAT, nearC);
      // (and within 100 m wherever the sheet is not seen square on, as the steady camera sees it looking down the pour: cloth, not foreshortened ovals)
      float sqC = abs(ja.x*jb.y - ja.y*jb.x)/max(max(dot(ja, ja), dot(jb, jb)), 1e-9);
      FLAT = max(FLAT, (1. - smoothstep(0.6, 0.85, sqC))*(1. - smoothstep(60., 110., dC)));
      FLAT = max(FLAT, 1. - smoothstep(70., 120., dC));        // (and square on within 70 m too: its rows are drawn only from the river and the gorge, where they stand for the far pour)
      FARC = mix(FARC, mix(uSlate, uDeep, 0.5), gz);
      COLA = mix(COLA, uSlate, fc); COLB = mix(COLB, mix(uSlate, uDeep, 0.6), fc); COLW = mix(COLW, uSlate, fc); FARC = mix(FARC, mix(uSlate, uDeep, 0.45), fc); LINED *= 1. - fc; GLINT = 1. - fc;
      // (round 7) within some 55 m the core's beads are real rounds ('core-carpet'): the sheet is the dark thread-shadow between them
      FARC = mix(mix(uDeep, uVelvet, 0.45), FARC, smoothstep(40., 62., dC));`}),d=new c.Mesh(n,s);d.name="pour-core",g.add(d)}await m.yield();{const e=R<.8?.66:.5,t=Math.hypot(z,Oe),a=i=>{const v=Math.min(i,W),u=P*v/z;return .5*v*Math.sqrt(z*z+P*P*v*v)+z*z/(2*P)*Math.log(u+Math.sqrt(u*u+1))+Math.max(i-W,0)*t},o=Math.floor(k*.5/e),r=[];for(let i=-o;i<=o;i++){const v=i*e,u=ht(v,z,0)+.25,x=Math.ceil(a(u)/e);for(let M=0;M<x;M++)r.push(v,M,u);(i+o)%8===7&&await m.yield()}const n=r.length/3,s=ie(n);s.setAttribute("aK",new c.InstancedBufferAttribute(new Float32Array(r),3));const d=ce(C,{uniforms:H,header:Se+`attribute vec3 aK;
      float arcD(float t){
        float tt = min(t, ${W.toFixed(4)}), q = ${(P/z).toFixed(4)}*tt;
        return 0.5*tt*sqrt(${(z*z).toFixed(2)} + ${(P*P).toFixed(3)}*tt*tt) + ${(z*z/(2*P)).toFixed(4)}*log(q + sqrt(q*q + 1.)) + max(t - ${W.toFixed(4)}, 0.)*${t.toFixed(3)};
      }
      float arcStep(float t, float s){ float vy = min(${P.toFixed(2)}*t, ${Oe.toFixed(1)}); return max(t + (s - arcD(t))*inversesqrt(${(z*z).toFixed(2)} + vy*vy), 0.); }`,body:`
      float lane = floor(aK.x/${e.toFixed(3)} + 0.5), v = 8.5*(1. + 0.7*(hash1(lane*1.37 + 3.) - 0.5));
      float cyc = uFlow*v/${e.toFixed(3)} + hash1(lane + 9.), kc = floor(cyc), f = cyc - kc;
      float seed = hash2(vec2(lane, aK.y - kc) + 0.37);
      float s = (aK.y + f)*${e.toFixed(3)};                        // metres down the mean arc from the lip
      float t = min(s/${z.toFixed(1)}, sqrt(s/${(.5*P).toFixed(2)}) + 0.2);
      t = arcStep(t, s); t = arcStep(t, s); t = arcStep(t, s); t = arcStep(t, s);
      float tl = aK.z, vy = min(${P.toFixed(2)}*t, ${Oe.toFixed(1)});
      float y = ${(N+.35).toFixed(2)} - fallD(t);
      float x = (aK.x + (fract(seed*23.7) - 0.5)*0.07)*(1. + 0.1*t/max(tl, 0.1));
      x *= 1. + 0.9*uSurge*smoothstep(0., 9., ${(N+.35).toFixed(2)} - y);
      vec3 p = vec3(x, y, 0.4 + ${z.toFixed(1)}*t - 1.4*sin((aK.x/${k.toFixed(2)} + 0.5)*3.14159));
      float r = ${(.46*e).toFixed(3)}*(0.8 + 0.2*fract(seed*7.3))*smoothstep(0.02, 0.3, t)*(1. - smoothstep(tl - 0.4, tl - 0.12, t));
      r *= 1. - smoothstep(48., 64., length(p - uCamL));          // far off the sheet's own rows stand for them
      vec3 nr = vec3(0., ${z.toFixed(1)}, vy)*inversesqrt(${(z*z).toFixed(2)} + vy*vy);
      C = p + nr*r*0.6; R = r; SEED = seed;
      float spin = seed*40. + s/${(.46*e).toFixed(3)}*0.35;
      AX = normalize(vec3(1., (fract(seed*5.3) - 0.5)*0.9, (fract(seed*9.1) - 0.5)*0.9));
      vec3 fw = vec3(0., -vy, ${z.toFixed(1)}); fw -= AX*dot(fw, AX); fw *= inversesqrt(max(dot(fw, fw), 1e-5));
      E1 = fw*cos(spin) + cross(AX, fw)*sin(spin);
      float h = fract(seed*91.3);
      COLA = uSlate; COLB = mix(uSlate, uBlue, 0.45); LINED = 0.;
      if (h < 0.36) { COLA = uBlue; COLB = mix(uBlue, uSlate, 0.3); }
      if (h > 0.8) { COLA = uSilver; COLB = mix(uSilver, uGlint, 0.45); LINED = 1.; }`}),l=new c.Mesh(s,d);l.frustumCulled=!1,l.name="core-carpet",g.add(l)}const tt=14;{const e=Math.round(13500*R),t=new Float32Array(e*4),a=new Float32Array(e*4);for(let s=0;s<e;s++){const d=h()-.5,l=h()<.12,i=l?h.range(.45,.62):h.range(.25,.42),v=Math.pow(h(),1.7),u=z-.6+v*4.6,x=d*k,M=ht(x*(1+.04*4),u,i)-.04*h(),p=h.range(-1,1)*1.25+d*1.3;t[s*4]=h(),t[s*4+1]=d,t[s*4+2]=i,t[s*4+3]=u,a[s*4]=M,a[s*4+1]=Math.sin(p),a[s*4+2]=Math.cos(p)*(h()<.2?-.3:1),a[s*4+3]=h.range(.6,1.25)*(l?.7:1),s%400===399&&await m.yield()}const o=ie(e);o.setAttribute("aA",new c.InstancedBufferAttribute(t,4)),o.setAttribute("aB",new c.InstancedBufferAttribute(a,4));const r=ce(C,{uniforms:H,header:Se+"attribute vec4 aA, aB;",body:`
      float seed = aA.x, r = aA.z, v0 = aA.w, tL = aB.x, bs = aB.w;
      float t = fract(uTime/${tt.toFixed(1)} + seed)*${tt.toFixed(1)};
      const float tA = 1.5;
      float h1 = 5.2*bs, b1 = sqrt(8.*h1/9.8), h2 = h1*0.2, b2 = b1*0.45;
      float x0 = aA.y*${k.toFixed(2)};
      vec3 p; float spin, sc = smoothstep(0., 0.35, t), roll = 0.;
      if (t < tA) {                                             // the last metres of heap, gathering speed to the lip
        float k = t/tA; p = vec3(x0, ${(N+.35).toFixed(2)} + r*0.8 + 0.5*(1. - k)*(1. - k), -5.2 + 5.6*k*k + (v0 - 7.)*0.3*k);
        spin = 5.6*k*k/r;
      } else {
        float tf = t - tA, tt = min(tf, tL);
        float fan = 1. + 0.9*uSurge*smoothstep(0., 0.9, tt);          // the surge doubles the width of the pour
        vec2 land = vec2(x0*(1. + 0.04*tL)*fan, 0.4 + v0*tL);
        p = vec3(x0*(1. + 0.04*tt)*fan, ${(N+.35).toFixed(2)} + r - fallD(tt), 0.4 + v0*tt);
        spin = 5.6/r + tt*(1.2 + 2.6*fract(seed*7.7));
        if (tf > tL) {
          float q = tf - tL;                                    // since landing
          vec2 dir = vec2(aB.y, aB.z);
          float d1 = min(q, b1)*5.4*bs, d2 = clamp(q - b1, 0., b2)*4.2*bs, d3 = max(q - b1 - b2, 0.)*3.6;
          vec2 xz = land + dir*(d1 + d2) + mix(dir, vec2(dir.x*0.3, 1.), smoothstep(0., 3., q - b1 - b2))*d3;
          float hop = q < b1 ? 4.*h1*(q/b1)*(1. - q/b1) : (q < b1 + b2 ? 4.*h2*((q - b1)/b2)*(1. - (q - b1)/b2) : 0.);
          p = vec3(xz.x, bedYg(xz) + r*0.9 + hop, xz.y);
          spin += (d1 + d2 + d3)/r;
          sc *= 1. - smoothstep(${(tt-1.2).toFixed(1)}, ${(tt-.1).toFixed(1)}, t);
          roll = smoothstep(0., 2.5, q - b1 - b2);
        }
      }
      // distance makes beads bigger and fewer: seen from down the river the pour is a few hundred great pearls
      // tumbling (each standing for the many behind it), and they come down to their own size as we come near
      float gd = max(1., length((modelMatrix*vec4(p, 1.)).xyz - cameraPosition)/26.), gk = mix(gd, 1., roll);
      float keep = 1. - smoothstep(0.75, 1.15, fract(seed*37.7)*gk*gk*0.5);
      p.y += r*(gk - 1.)*0.8*step(tA, t);
      // (within a dozen metres of the eye half of them are let go, shrinking as they come: the climb is through separate pearls, not a wall of them)
      float thin = mix(step(fract(seed*53.3), 0.5), 1., smoothstep(4., 8.5, length(p - uCamL)));
      C = keepClear(p); R = r*sc*mix(gk*keep, 1., roll)*thin; SEED = seed;
      {
        // (round 7) a great near pearl is seen whole: one whose disc the frame's edge would cut by more than a third
        // comes down to the size of the crowd as it leaves (the few of 60-120 px stay inside the picture)
        vec4 vq = viewMatrix*modelMatrix*vec4(C, 1.); float dq = max(-vq.z, 0.05);
        vec2 pj = vec2(projectionMatrix[0][0], projectionMatrix[1][1])/dq, nq = abs(vq.xy*pj), rq = max(R*pj, vec2(1e-5));
        float over = max((nq.x + rq.x*0.34 - 1.)/rq.x, (nq.y + rq.y*0.34 - 1.)/rq.y);
        R *= mix(1., min(1., 0.085/rq.y), smoothstep(-0.25, 0.3, over)*step(0., -vq.z));
      }
      tumble(seed, spin*0.37, spin, AX, E1);
      looseLook(seed, COLA, COLB, KIND, LINED);
      // far off the pour is one white stroke: its separate beads go to plain pearl before they go under a few pixels
      float farK = smoothstep(105., 190., length((modelMatrix*vec4(C, 1.)).xyz - cameraPosition));
      farK *= roll;                                             // (the great pearls of the fall keep their two tones and their hole: they are seen turning)
      COLA = mix(COLA, uPearl*1.1, farK); COLB = mix(COLB, uPearl*1.1, farK); KIND *= step(farK, 0.5); LINED *= 1. - farK;
      // (round 6) the necklace's coral seeds pour with its pearls: one bead in twenty-five of the fall is coral, the warm accent of the whole flight
      float corK = step(fract(seed*71.7), 0.04); COLA = mix(COLA, uCoral, corK); COLB = mix(COLB, uCoral, corK); KIND *= 1. - corK; LINED *= 1. - corK;
      if (gk > 1.6 && COLA.r > 0.8) COLA *= 1.07;               // moonlit pearl, just bright enough to bloom`}),n=new c.Mesh(o,r);n.frustumCulled=!1,n.name="pour-beads",g.add(n)}await m.yield();const Yt=38;{const e=Math.round(7200*R),t=new Float32Array(e*4),a=new Float32Array(e*4);for(let s=0;s<e;s++){let d=0,l=0;for(let x=0;x<8&&(d=h.range(-1,1)*(fe-6),l=ye+h.range(-1,1)*(Ae-6),!(Math.hypot(d/(fe-7),(l-ye)/(Ae-7))<1&&l<-7));x++);s%3===0&&(d=h.range(-16,16),l=h.range(-70,-8));const i=we(d*.3+h.range(-.5,.5)*k*.6,-k*.47,k*.47),v=-5.2,u=(h()<.1?h.range(.5,.7):h.range(.26,.44))*(s%3===0?1.4:1);t[s*4]=h(),t[s*4+1]=d,t[s*4+2]=l,t[s*4+3]=u,a[s*4]=ve(d,l),a[s*4+1]=ve(B(d,i,1/3),B(l,v,1/3)),a[s*4+2]=ve(B(d,i,2/3),B(l,v,2/3)),a[s*4+3]=i,s%200===199&&await m.yield()}const o=ie(e);o.setAttribute("aA",new c.InstancedBufferAttribute(t,4)),o.setAttribute("aB",new c.InstancedBufferAttribute(a,4));const r=ce(C,{uniforms:H,header:Se+"attribute vec4 aA, aB;",body:`
      float seed = aA.x, r = aA.w;
      float t = fract(uTime/${Yt.toFixed(1)} + seed), w = t*t*(0.35 + 0.65*t);
      vec2 a = aA.yz, b = vec2(aB.w, -5.2), xz = mix(a, b, w);
      float yE = ${(N+.9).toFixed(2)}, w3 = w*3.;
      float y = w3 < 1. ? mix(aB.x, aB.y, w3) : (w3 < 2. ? mix(aB.y, aB.z, w3 - 1.) : mix(aB.z, yE, w3 - 2.));
      vec2 d = b - a; float dl = length(d); d /= max(dl, 1e-3);
      C = keepClear(vec3(xz.x, y + r*0.75, xz.y)); R = r*smoothstep(0., 0.05, t)*(1. - smoothstep(0.965, 1., t)); SEED = seed;
      float spin = w*dl/r + seed*40.;
      AX = normalize(vec3(d.y, (fract(seed*5.3) - 0.5)*0.9, -d.x) + 1e-3);
      vec3 fw = vec3(d.x, 0., d.y); fw -= AX*dot(fw, AX); fw *= inversesqrt(max(dot(fw, fw), 1e-5));
      E1 = fw*cos(spin) + cross(AX, fw)*sin(spin);
      looseLook(seed, COLA, COLB, KIND, LINED);`}),n=new c.Mesh(o,r);n.frustumCulled=!1,n.name="heap-beads",g.add(n)}await m.yield();{const e=R<.8?1.6:1.3,t=ye-Ae,a=[],o=[],r=(v,u)=>{const x=Math.hypot(v/(fe-4),(u-ye)/(Ae-4));return(1-U(.93,.995,x))*(1-U(-5.5,-2.2,u))};let n=0;for(let v=-Math.ceil(fe/e);v<=Math.ceil(fe/e);v++)for(let u=0;t+u*e<0;u++){const x=v*e,M=t+u*e,p=r(x,M),b=r(x,M+e);++n%250===0&&await m.yield(),!(p<=0&&b<=0)&&(a.push(x,M,ve(x,M),ve(x,M+e)),o.push(v,u,p,b))}const s=a.length/4,d=ie(s);d.setAttribute("aA",new c.InstancedBufferAttribute(new Float32Array(a),4)),d.setAttribute("aB",new c.InstancedBufferAttribute(new Float32Array(o),4));const l=ce(C,{uniforms:H,header:Se+"attribute vec4 aA, aB;",body:`
      float lane = aB.x, v = 1.1*(1. + 0.8*(hash1(lane*1.37 + 3.) - 0.5));
      float cyc = uFlow*v/${e.toFixed(2)} + hash1(lane + 9.), kc = floor(cyc), f = cyc - kc;
      float seed = hash2(vec2(lane, aB.y - kc) + 0.37);
      float r = ${(.5*e).toFixed(3)}*(0.84 + 0.16*fract(seed*7.3))*mix(aB.z, aB.w, f);
      vec3 p = vec3(aA.x, mix(aA.z, aA.w, f) + r*0.5 + 0.42*fract(seed*3.1), aA.y + ${e.toFixed(2)}*f);
      C = keepClear(p); R = r; SEED = seed;
      float spin = seed*40. + uFlow*v/${(.5*e).toFixed(3)};
      AX = normalize(vec3(1., (fract(seed*5.3) - 0.5)*0.8, (fract(seed*9.1) - 0.5)*0.8));
      vec3 fw = vec3(0., 0., 1.); fw -= AX*dot(fw, AX); fw *= inversesqrt(max(dot(fw, fw), 1e-5));
      E1 = fw*cos(spin) + cross(AX, fw)*sin(spin);
      float h = fract(seed*91.3);
      if (hash1(lane*3.17 + 1.3) < 0.36) {                        // a lane of pearls (about one lane in three, a slate bead here and there in it)
        COLA = uPearl; COLB = mix(uPearl, uSilver, 0.8); LINED = 0.3;
        if (h < 0.13) { COLA = uSlate; COLB = uSlate; LINED = 0.; }
      } else {                                                    // slate and midnight rounds
        COLA = uSlate; COLB = mix(uSlate, uBlue, 0.6); LINED = 0.;
        if (h < 0.42) { COLA = uBlue; COLB = mix(uBlue, uSlate, 0.3); }
        if (h > 0.93) { COLA = h > 0.965 ? uPearl : uSilver; COLB = mix(uSilver, uGlint, 0.5); LINED = h > 0.965 ? 0.3 : 1.; }
      }`}),i=new c.Mesh(d,l);i.frustumCulled=!1,i.name="heap-carpet",g.add(i)}await m.yield();{const t=Me-36,a=23,o=Math.floor(t/1.5),r=110,n=a*o+r,s=new Float32Array(n*4);let d=0;for(let u=0;u<a;u++)for(let x=0;x<o;x++,d++)s[d*4]=h(),s[d*4+1]=(u-(a-1)/2)*1.32,s[d*4+2]=(x+h.range(-.12,.12))*1.5,s[d*4+3]=h.range(.4,.56);for(let u=0;u<r;u++,d++)s[d*4]=h(),s[d*4+1]=h.range(-13,13),s[d*4+2]=h()*t,s[d*4+3]=-h.range(.62,.9);const l=ie(n);l.setAttribute("aA",new c.InstancedBufferAttribute(s,4));const i=ce(C,{uniforms:H,header:Se+"attribute vec4 aA;",body:`
      float seed = aA.x, r = abs(aA.w), big = step(aA.w, 0.);
      float sp = mix(3.*(1. + 0.5*(hash1(aA.y*3.1) - 0.5)), 1.3, big);
      float d = aA.z + uFlow*sp, zz = mod(d, ${t.toFixed(1)});
      vec2 xz = vec2(aA.y, ${36 .toFixed(1)} + zz);
      C = keepClear(vec3(xz.x, bedYg(xz) + r*(1. - 0.25*big), xz.y)); SEED = seed;
      R = r*smoothstep(0., 7., zz)*(1. - smoothstep(${(t-7).toFixed(1)}, ${t.toFixed(1)}, zz));
      float spin = d/r;
      AX = normalize(vec3(1., (fract(seed*5.3) - 0.5)*0.8, (fract(seed*9.1) - 0.5)*0.8));
      vec3 fw = vec3(0., 0., 1.); fw -= AX*dot(fw, AX); fw *= inversesqrt(max(dot(fw, fw), 1e-5));
      E1 = fw*cos(spin) + cross(AX, fw)*sin(spin);
      looseLook(seed, COLA, COLB, KIND, LINED);`}),v=new c.Mesh(l,i);v.frustumCulled=!1,v.name="river-beads",g.add(v)}{const e=Math.round(700*R),t=new Float32Array(e*4);for(let n=0;n<e;n++)t[n*4]=(n+.5)/e,t[n*4+1]=Math.sin(n*12.9898)*43758.5453%1,t[n*4+2]=Math.sin(n*78.233+1.3)*12543.117%1,t[n*4+3]=Math.abs(Math.sin(n*39.425+.7)*9631.77%1);const a=ie(e);a.setAttribute("aA",new c.InstancedBufferAttribute(t,4));const o=ce(C,{uniforms:H,header:Se+"attribute vec4 aA;",body:`
      float seed = aA.x, T = 2.4 + 1.6*aA.w, t = fract(uTime/T + seed*7.)*T;
      vec2 p0 = vec2(aA.y*${(k*.62).toFixed(2)}, ${(Pe-1).toFixed(1)} + aA.z*5.);
      float vy = 8. + 9.*aA.w, tl = 2.*vy/9.8, ta = min(t, tl);
      vec3 p = vec3(p0.x + aA.y*4.5*ta, bedYg(p0) + 0.6 + vy*ta - 4.9*ta*ta, p0.y + (1.5 + 4.*fract(seed*91.))*ta);
      float gd = max(1., length((modelMatrix*vec4(p, 1.)).xyz - cameraPosition)/30.);
      float keep = 1. - smoothstep(0.7, 1.1, fract(seed*37.7)*gd*0.42);
      C = keepClear(p); SEED = seed;
      R = (0.14 + 0.16*fract(seed*23.))*gd*keep*smoothstep(0., 0.2, t)*(1. - smoothstep(tl - 0.5, tl, t));
      float spin = seed*40. + t*(3. + 4.*aA.w); tumble(seed, spin*0.4, spin, AX, E1);
      COLA = uPearl*(gd > 1.6 ? 1.07 : 1.); COLB = mix(uPearl, uSilver, 0.7); LINED = 0.4;
      if (fract(seed*11.) < 0.25) { COLA = uSilver; COLB = mix(uSilver, uGlint, 0.55); LINED = 1.; }`}),r=new c.Mesh(a,o);r.frustumCulled=!1,r.name="foot-spray",g.add(r)}const Fe={...H,uRun:G.uRun,uRunH:G.uRunH,uBurst:{value:new c.Vector4(0,-999,0,-1)},uBurstKind:{value:0}};{const t=new Float32Array(6e3);for(let n=0;n<1500;n++){const s=Math.pow(h(),.7);t[n*4]=h(),t[n*4+1]=h()*Math.PI*2,t[n*4+2]=h.range(2,13)*(1.15-s*.6),t[n*4+3]=3+s*13}const a=ie(1500);a.setAttribute("aA",new c.InstancedBufferAttribute(t,4));const o=ce(C,{uniforms:Fe,header:Se+"attribute vec4 aA; uniform vec4 uBurst, uRun; uniform float uBurstKind, uRunH;",body:`
      float seed = aA.x, tb = uBurst.w, fan = step(fract(seed*11.3), 0.24);
      float r = mix(0.34 + 0.3*fract(seed*23.1), 0.5 + 0.55*fract(seed*23.1), fan);
      if (uRun.x > 0.5 && uRun.y > 0.) {                          // the run: twelve bursts, one as each ball of the train lands
        float need = floor(seed*12.)*${Re.toFixed(2)} + 7.4, ti = sqrt(need/6.5), v = min(13.*ti, 20.);
        tb = uRun.y - ti - (-v + sqrt(v*v + 19.6*max(uRunH, 1.)))/9.8;
      }
      float vy = mix(aA.w*0.7, 15. + 9.*fract(seed*5.7), fan), hz = mix(aA.z, 1.5 + 6.*fract(seed*3.9), fan);
      float tl = 2.*vy/9.8, ta = min(tb, tl);
      vec2 dir = vec2(cos(aA.y), sin(aA.y));
      vec3 p = uBurst.xyz + vec3(dir.x*hz*ta, vy*ta - 4.9*ta*ta + r, dir.y*hz*ta);
      // the surge: from where it landed, under the eye, to the lip, all of it there 5.4 s after the impact
      float k = clamp((tb - tl)/max(5.4 - tl, 1.), 0., 1.)*(1. - fan); float k1 = 1. - (1. - k)*(1. - k), ke = k1*k1*(3. - 2.*k1);      // (round 7: it leaves the mound fast and slows to the lip)
      vec2 cfw = uCamF.xz*inversesqrt(max(dot(uCamF.xz, uCamF.xz), 1e-4));
      // (round 6: the gaze stays up on the necklace, so the surge is aimed further ahead of the eye, where the frame's lower edge meets the heap)
      vec2 a = p.xz, b = uCamL.xz + cfw*(30. + 16.*fract(seed*29.3)) + dir*8.*fract(seed*17.), c = vec2(clamp(p.x*0.2, -10., 10.), -5.);
      vec2 sq = mix(mix(a, b, ke), mix(b, c, ke), ke);
      float gy = mix(${(N+5).toFixed(2)}, ${(N+.9).toFixed(2)}, smoothstep(-34., 0., sq.y)) + r;
      // (round 7) the surge leaves the mound in great bounds (the ball fell 35 m): a band of tumbling pearls in the air under the
      // necklace, seen from the lingering place, settling to a roll as it comes under the eye to the lip
      float hopA = (3.5 + 7.5*fract(seed*13.7))*smoothstep(0., 0.07, k)*(1. - smoothstep(0.3, 0.72, k));
      hopA *= smoothstep(16., 32., length(sq - uCamL.xz));        // (never up at the eye: within 16 m of us the surge is on the heap, rolling under)
      gy += 0.5*abs(sin(tb*5. + seed*40.))*(1. - min(hopA, 1.)) + hopA*abs(sin(tb*1.7 + seed*40.));
      p = mix(p, vec3(sq.x, gy, sq.y), smoothstep(0., 0.12, k));
      C = keepClear(p); SEED = seed;
      float sz = mix(1. - smoothstep(0.85, 1., k), 1. - smoothstep(tl, tl + 1.1, tb), fan);
      R = tb < 0. ? 0. : r*smoothstep(0., 0.1, tb)*sz*mix(1., 0.75, ke)*(1. + 0.5*(1. - fan)*smoothstep(0., 0.2, k));     // (the surge's pearls are seen from further off now: half as big again)
      float spin = seed*30. + ta*(2. + 3.*fract(seed*3.3)) + ke*60./max(r, 0.1);
      tumble(seed, spin*0.4, spin, AX, E1);
      float h = fract(seed*91.3);
      COLA = mix(uPearl, uSilver, uBurstKind); COLB = mix(mix(uPearl, uSilver, 0.9), mix(uSilver, uGlint, 0.5), uBurstKind);
      KIND = uBurstKind*step(0.5, fract(seed*7.)); LINED = mix(0.4, 1., uBurstKind);
      if (h < 0.16) { COLA = uSlate; COLB = mix(uSlate, uBlue, 0.5); LINED = 0.; KIND = 0.; }
      else if (h < 0.36) { COLA = uSilver; COLB = mix(uSilver, uGlint, 0.55); LINED = 1.; KIND = step(h, 0.22); }
      else if (h < 0.43) { COLA = uCoral; COLB = uCoral; LINED = 0.; KIND = 0.; }      // (round 6: the seeds of the ball's coral caps)
      else if (fan > 0.5) COLA *= 1.07;`}),r=new c.Mesh(a,o);r.frustumCulled=!1,r.name="burst-beads",g.add(r)}await m.yield();{const e=J.p.length/4,t=ie(e);t.setAttribute("aP",new c.InstancedBufferAttribute(new Float32Array(J.p),4)),t.setAttribute("aAx",new c.InstancedBufferAttribute(new Float32Array(J.ax),3)),t.setAttribute("aK",new c.InstancedBufferAttribute(new Float32Array(J.k),4));const a=ce(C,{header:"attribute vec4 aP, aK; attribute vec3 aAx;",body:`
      C = aP.xyz; R = aP.w; SEED = aK.z; LINED = aK.w;
      AX = aAx*inversesqrt(max(dot(aAx, aAx), 1e-6));
      vec3 e = cross(AX, vec3(0.2, 0.9, 0.4)); E1 = e*inversesqrt(max(dot(e, e), 1e-5));
      float ci = aK.x;
      COLA = ci < 0.5 ? uDeep : (ci < 1.5 ? uSlate : (ci < 2.5 ? uSilver : (ci < 3.5 ? uPearl : (ci < 4.5 ? uCoral : (ci < 5.5 ? uThread : uNavy)))));
      COLB = COLA; KIND = aK.y > 0.5 && aK.y < 1.5 ? 1. : 0.; LEN = aK.y > 1.5 && aK.y < 2.5 ? 0.4 : 0.;
      if (aK.y > 4.5) {                                           // a bead of the notch's lit rim: it turns its dark side to us as we come near
        float nr = 1. - smoothstep(24., 60., length((modelMatrix*vec4(C, 1.)).xyz - cameraPosition));
        COLA = mix(COLA, mod(floor(aK.z*40.), 2.) < 0.5 ? uNavy : uDeep, nr); COLB = COLA; LINED *= 1. - nr;
      } else if (aK.y > 2.5) {                                    // a bead of the headwall: far off it goes to the wall's plain midnight
        float far = smoothstep(120., 200., length((modelMatrix*vec4(C, 1.)).xyz - cameraPosition));
        if (ci < 0.5) COLA = uDeep;
        COLA = mix(COLA, uDeep, far); COLB = COLA; LINED *= 1. - far;
      }`}),o=new c.Mesh(t,a);o.frustumCulled=!1,o.name="fixed-beads",g.add(o);const r=Tt(We.map(l=>(l.deleteAttribute("uv"),l)),!1);We.forEach(l=>l.dispose());const n=new c.Mesh(r,sa(C,"uVelvet*1.6 + uBlue*0.22"));n.name="horn-backing",g.add(n);const s=Tt(Ie,!1);Ie.forEach(l=>l.dispose());const d=new c.Mesh(s,Et(C,na));d.frustumCulled=!1,d.name="loose-thread",g.add(d)}await m.yield();const De=1.5,He=7.4,at=2*He/De,_t=new f,me=new f,ot=new f;let kt=null;function It(e,t,a,o){const r=e-(t-(a*Xe+De));return re(be-He,o.rel,Math.max(r,0)),o.H=Math.max(6,o.rel.y-(ve(o.rel.x,o.rel.z)+Be*.8)),o.tImp=(-at+Math.sqrt(at*at+2*P*o.H))/P,o}const pe={rel:_t,H:0,tImp:0},xe={rel:me,H:0,tImp:0},te=new f;function Nt(e,t,a){w.style||C.update(t,m.renderer),Ge.uFlow.value=t,a&&(ot.setFromMatrixPosition(a.matrixWorld),me.set(0,0,-1).applyMatrix4(a.matrixWorld),g.worldToLocal(ot),g.worldToLocal(me),H.uCamL.value.copy(ot),H.uCamF.value.copy(me).sub(ot).normalize());const o=Math.max(0,kt??t),r=Math.floor(o/Xe),n=o-r*Xe,s=r%ft;It(t,o,r,pe);const d=n-De,l=d>pe.tImp;G.uRelease.value.copy(pe.rel),G.uDrop.value.set(n<De?He*(n/De)**2:He,d>0?at*d+.5*P*d*d:0,l?0:1,Math.max(d,0)*.55);const i=we((n-.6)/4.4,0,1),v=i*i*i*(i*(i*6-15)+10),u=mt-s,x=s===ft-1?(1-v)*(Q-4-be-(u+1)*Re+Re):1e4;G.uSlip.value.set(v,u,x,r+F.phase0);let M=r,p=d-pe.tImp;p<0?(M=r-1,M>=0?(It(t,o,M,xe),p=n+Xe-De-xe.tImp):p=-1):(xe.rel.copy(pe.rel),xe.H=pe.H),Fe.uBurst.value.set(xe.rel.x,xe.rel.y-xe.H-Be*.5,xe.rel.z,p),Fe.uBurstKind.value=(M+F.phase0)%5===0?1:0,G.uRun.value.x>.5&&(G.uRunH.value=pe.H,G.uRun.value.y>0?(re(1.5,me,t),Fe.uBurst.value.set(me.x,me.y-pe.H-Be*.5,me.z,1),Fe.uBurstKind.value=1):(Fe.uBurstKind.value=1,n<.001&&(Fe.uBurst.value.w=-1)))}Nt(0,0,null);const Pt=new f(E.z,0,-E.x).multiplyScalar(y),rt=[];for(let e=oe+26;e<Q-62;e+=24){const t=re(e);rt.push(t.addScaledVector(Pt,12).add(new f(0,5.5,0)))}const Ot=T.clone().addScaledVector(I,-70),Wt=[new f(0,7,96),new f(0,8,62),new f(0,13,51.5),new f(0,100.5,8.2),new f(0,103,-10),new f(-6*y,108,-42),new f(-13*y,121,-84),...rt,Ot,T.clone()],Zt={lip:new f(0,N,0),lipWidth:k,coneTop:new f(0,ut,Pe),riverEnd:new f(0,0,Me),climbFoot:new f(0,13,51.5),climbTop:new f(0,100.5,8.2),crest:new f(0,101,-4),snagTip:qe.clone(),snagBase:At.clone(),tailTip:re(0),dropFrom:re(be),impact:re(be-He).setY(ve(de[0].x,de[0].z)),strandLow:re(oe+46),strandTie:_.clone(),strandLine:[0,.15,.3,.45,.6,.75,.9,1].map(e=>re(oe+(Q-oe)*e)),strandLeft:Pt,basinCentre:new f(0,N+5,ye),basinRadii:new c.Vector2(fe,Ae),pinnacleFoot:T.clone().addScaledVector(I,34).addScaledVector(O,-128).addScaledVector(ae,30*y),portalSeat:{position:T.clone(),axis:I.clone(),facing:I.clone().negate(),up:O.clone(),radius:7,opening:7.55,tilt:30},portalApproach:Ot,flyThrough:Wt,viewpoints:{entry:new f(0,6,300),faceOn:new f(0,40,120),crest:new f(0,101,-4),besideStrand:rt[Math.min(2,rt.length-1)]}},Qt=190,Jt=250,ea=new f(0,125,-110);return{object:g,radius:Qt,height:Jt,center:ea,anchors:Zt,style:C,lipY:N,strandLength:Q,strandPoint:re,update:Nt,setCycle(e){kt=e},cycleSpan:ft*Xe,setRun(e,t=0,a=0){G.uRun.value.y=e,G.uRun.value.z=t,G.uRun.value.w=a},setSurge(e){H.uSurge.value=we(e,0,1)},setClear(e,t,a){te.copy(e),g.worldToLocal(te),H.uClrA.value.set(te.x,te.y,te.z,a),te.copy(t),g.worldToLocal(te),H.uClrB.value.set(te.x,te.y,te.z,a)},setGust(e){C.uniforms.uGust.value=we(e,0,1)},dispose(){ge.dispose()},ground:!1,groundY:0}}export{ta as PALETTE,ra as ROWS_GLSL,le as STYLE_GLSL,na as TAIL_THREAD,sa as backingMaterial,ce as beadMaterial,ie as beadQuadGeometry,da as buildHero,oa as createStyle,st as rowMaterial,aa as sceneColorFor,Et as threadMaterial,lt as threadTubeGeometry};
