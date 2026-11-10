import*as t from"three";import{mergeGeometries as Ke}from"three/addons/utils/BufferGeometryUtils.js";import{makePath as zo,clamp as je,lerp as D,smoothstep as R}from"../kit/core.js";import*as Xe from"../kit/fx.js";import{buildHero as Mo}from"../parts/hall-of-strings.js";const H=["#05060a","#1a2440","#cfd8e6","#c47a3a","#e8c98a","#6e6048","#b3122a"],I=40,S=165,G=490,X=-80,ve=106,ot=.576,Ye=[-122,-40,40,100,150],xt=[-80,-66,8,40,66],Me=-15,Ze=480,Wt=69.5,Qe=(a,u)=>D(Ye[a],xt[a],(u-Me)/(Ze-Me)),_t=`
float wHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float wNoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(wHash(i), wHash(i + vec3(1,0,0)), f.x), mix(wHash(i + vec3(0,1,0)), wHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(wHash(i + vec3(0,0,1)), wHash(i + vec3(1,0,1)), f.x), mix(wHash(i + vec3(0,1,1)), wHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
`,He=90,Vt=205,Gt=1.45,at=a=>S-Vt*Math.pow(je((a-He)/(G-He),0,1),Gt),ao=a=>He+(G-He)*Math.pow(je((S-a)/Vt,0,1),1/Gt),no=`
float wBentX(float z){ return 165.0 - 205.0 * pow(clamp((z - 90.0) / 400.0, 0.0, 1.0), 1.45); }
uniform vec3 uKeyDir, uKeyCol, uFillCol, uAmbCol, uPoolC, uHaze, uSpruce; uniform vec2 uPool; uniform float uGobo, uShaftK;
// the pool of the key light: a round spot, or (uGobo, moonlight) four slanted window panes with a transom
float wSpot(vec3 p){ vec3 d = p - uPoolC; vec3 q = d - uKeyDir * dot(d, uKeyDir); float perp = length(q);
  float round = 1.0 - smoothstep(uPool.x * 0.7, uPool.x * 1.2, perp);
  float a = q.z, b = q.x * 1.3 + 0.42 * q.z, bb = abs(fract(b / 30.0) - 0.5) * 30.0;
  float pane = smoothstep(2.6, 4.6, bb) * (1.0 - smoothstep(57.0, 60.5, abs(b))) * (1.0 - smoothstep(70.0, 74.0, abs(a))) * smoothstep(1.4, 3.2, abs(a + 12.0));
  return mix(uPool.y, 1.0, mix(round, pane, uGobo)); }
// how much of the lit shaft a ray from o along R (unit) passes through: a soft column, for mirrors
float wShaft(vec3 o, vec3 R){ vec3 w = o - uPoolC; float b = dot(R, uKeyDir), d = dot(R, w), e = dot(uKeyDir, w), den = max(1.0 - b * b, 0.02);
  float s = (b * e - d) / den, t = (e - b * d) / den; vec3 q = w + R * s - uKeyDir * t; float r = uPool.x * 0.55;
  return exp(-dot(q, q) / (r * r)) * smoothstep(0.0, 20.0, s) * smoothstep(-20.0, 30.0, t) * uShaftK; }
`;function Ne(a,u={}){const c=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...a,uGrain:{value:u.grain??0},uSpec:{value:u.spec??.1},uShin:{value:u.shin??30},uFuzz:{value:u.fuzz??0},uTremble:{value:0},uGain:{value:u.gain??1},uRefl:{value:u.refl??0},uSelfLit:{value:u.self??0},uRim:{value:u.rim??0},uBounce:{value:u.bounce??0},uSpecTint:{value:new t.Color(u.specTint??"#ffffff")},uMetal:{value:u.metal??0}},fog:!0,vertexColors:!0,side:u.side??t.FrontSide,vertexShader:`
      #include <common>
      #include <fog_pars_vertex>
      uniform float uTime, uTremble;
      varying vec3 vW, vN, vC;
      ${u.soft?"attribute float aAlpha; varying float vA;":""}
      void main(){
        ${u.soft?"vA = aAlpha;":""}
        vec3 p = position;
        p += normal * uTremble * 0.22 * sin(uTime * 34.0 + position.x * 1.7 + position.z * 0.9);
        vec4 w = modelMatrix * vec4(p, 1.0);
        vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vC = color;
        vec4 mvPosition = viewMatrix * w;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #include <common>
      #include <fog_pars_fragment>
      uniform float uGrain, uSpec, uShin, uFuzz, uTime, uGain, uRefl, uSelfLit, uRim, uBounce, uPedal, uMetal; uniform sampler2D uEnv; uniform vec3 uPortal, uPortalCol, uCopperC, uSilverC, uSpecTint, uLampP, uLampCol;
      varying vec3 vW, vN, vC;
      ${u.soft?"varying float vA;":""}
      ${_t}
      ${no}
      void main(){
        vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vW);
        vec3 alb = vC;
        if (uGrain > 0.5) {
          float l = vW.x / 0.8, fw = fwidth(l);
          float g = wNoise(vec3(vW.x * 2.6, 0.0, vW.z * 0.03)) * 0.6 + 0.4 * mix(wNoise(vec3(vW.x * 9.0, 3.0, vW.z * 0.08)), 0.5, clamp(fw * 4.0, 0.0, 1.0));
          g = mix(g, 0.5, clamp(fw * 1.2 - 0.3, 0.0, 1.0));
          float line = smoothstep(0.7, 1.0, abs(fract(l) - 0.5) * 2.0);
          alb *= (0.6 + 0.7 * g) * (1.0 - 0.4 * mix(line, 0.15, clamp(fw * 1.5, 0.0, 1.0)));
          alb *= 0.8 + 0.3 * wNoise(vec3(vW.x * 0.03, 1.0, vW.z * 0.012));
          alb *= 0.55 + 0.45 * wNoise(vec3(vW.x * 0.011, 4.0, vW.z * 0.009));                 // broad value structure: the board is not one flat tan
          alb *= 0.74 + 0.5 * wNoise(vec3(vW.x * 0.37, 2.0, vW.z * 0.016)) * wNoise(vec3(vW.x * 0.09, 6.0, vW.z * 0.05)) * 1.6;   // plank-wide figure that survives a grazing view
        } else {
          alb *= 0.76 + 0.48 * (wNoise(vW * 0.5) * 0.6 + wNoise(vW * 2.1) * 0.4);
        }
        float ndv = max(dot(N, V), 0.0);
        if (uFuzz > 0.0) alb *= 0.65 + 0.7 * wNoise(vW * 5.0);
        float spot = wSpot(vW);
        float key = max(dot(N, uKeyDir), 0.0);
        vec3 Li = uKeyCol * (key * spot + 0.2 * pow(1.0 - ndv, 3.0) * spot)
                + uFillCol * (max(-N.y, 0.0) * 1.0 * spot + 0.14) + uAmbCol * (0.7 + 0.3 * N.y) + uHaze * (0.45 + 0.35 * max(N.x, 0.0) + 0.2 * N.y) + vec3(uSelfLit)
                + uLampCol * 0.8 * exp(-dot(vW - uLampP, vW - uLampP) / 40000.0) * max(dot(N, (uLampP - vW) / max(length(uLampP - vW), 1e-3)), 0.0)   // the music-desk lamp warms the keyboard end
                + uKeyCol * uRim * pow(1.0 - ndv, 4.0) + uSpruce * uKeyCol * uBounce * max(-N.y, 0.0) * (0.22 + 0.78 * spot);     // light thrown back up by the lit soundboard
        float sp = pow(max(dot(N, normalize(uKeyDir + V)), 0.0), uShin) * uSpec * spot;
        vec3 col = alb * Li * uGain + uKeyCol * uSpecTint * sp + alb * uFuzz * pow(1.0 - ndv, 2.0) * (uKeyCol * spot + uAmbCol) * 0.8;
        if (uGrain > 0.5) {                                  // the board is lit from above by whichever strings are sounding: music written on the spruce
          float kb = (vW.x + 139.7 - 0.2126 * (vW.z + 17.0)) / 3.172, kt = (vW.x + 138.0) / 3.172;
          float isB = step(-1.0, kb) * step(kb, 25.5) * step(vW.z, 450.0 - 3.42 * kb);
          float isT = (1.0 - isB) * step(25.5, kt) * step(kt, 87.5) * step(vW.z, 43.0 + 350.0 * pow(clamp(1.0 - (kt - 26.0) / 61.0, 0.0, 1.0), 1.5));
          float kk = clamp(mix(kt, kb, isB), 0.0, 87.0), k0 = floor(kk);
          float a0 = texelFetch(uEnv, ivec2(int(k0 + 0.5), 0), 0).g, a1 = texelFetch(uEnv, ivec2(int(min(k0 + 1.0, 87.0) + 0.5), 0), 0).g;
          float am = mix(a0, a1, smoothstep(0.0, 1.0, kk - k0));
          col += alb * mix(uSilverC * 0.55, uCopperC * 1.7, isB) * (am * 1.15 + uPedal * 0.22) * (isB + isT);
        }
        if (uMetal > 0.0) {                                   // cast bronze: a dull metal that carries the room, not a matte stone
          vec3 Rm = reflect(-V, N); float up = smoothstep(-0.25, 0.5, Rm.y), fm = 0.3 + 0.7 * pow(1.0 - ndv, 4.0);
          float pat = wNoise(vW * 0.21 + 5.0) * 0.6 + wNoise(vW * 1.3) * 0.4;
          vec3 env = mix(uSpruce * (uKeyCol * (0.15 + 0.6 * spot) + uAmbCol + uHaze), uHaze * 0.8 + uKeyCol * (0.05 + 0.25 * spot), up);
          col = mix(col, col * 0.6 + uSpecTint * env * 1.7 * fm, uMetal) * (0.8 + 0.4 * pat);
          col += uKeyCol * uSpecTint * pow(max(dot(Rm, uKeyDir), 0.0), 7.0) * 0.4 * spot * uMetal * (0.5 + pat);
          col = mix(col, vec3(0.05, 0.12, 0.1) * (uKeyCol * key * spot + uAmbCol + uHaze), 0.3 * uMetal * smoothstep(0.6, 0.85, wNoise(vW * 0.33 + 7.0)));   // a breath of verdigris
        }
        if (uRefl > 0.0) {
          vec3 R = reflect(-V, N); float fr = 0.05 + 0.6 * pow(1.0 - ndv, 3.0);
          vec3 hz = mix(uHaze, vec3(dot(uHaze, vec3(0.3, 0.5, 0.2))), 0.55);
          float streak = 0.55 + 0.45 * wNoise(vec3(vW.x * 0.9 + vW.z * 0.9, vW.y * 0.04, 3.0)) + 0.25 * wNoise(vec3(vW.x * 4.0 + vW.z * 4.0, vW.y * 0.1, 9.0));
          col += hz * (0.3 + 0.45 * smoothstep(-0.05, 0.3, R.y)) * fr * uRefl;
          // the copper of the string field climbing the lacquer: walls face sideways, so no bounce term reaches them otherwise
          col += uCopperC * uRefl * 0.34 * mix(0.4, 1.0, smoothstep(-80.0, 20.0, vW.z)) * exp(-max(vW.y - 50.0, 0.0) / 16.0) * (0.35 + 0.65 * spot) * (1.0 + 0.8 * uPedal) * (0.6 + 0.4 * streak);
          col += uKeyCol * (0.1 * fr * streak * (0.35 + 0.65 * smoothstep(40.0, 110.0, vW.y)) + 0.22 * wShaft(vW, R) * (0.2 + fr) * streak) * uRefl;
          if (R.y < -0.02) {
            float t = (40.0 - vW.y) / R.y; vec3 Sp = vW + R * t;
            float inside = step(-165.0, Sp.x) * step(Sp.x, wBentX(Sp.z)) * step(14.0, Sp.z) * step(Sp.z, 490.0);
            inside *= smoothstep(14.0, 70.0, Sp.z) * smoothstep(-165.0, -125.0, Sp.x) * 0.7;                // no hard-edged plank where the mirrored board begins
            col += uSpruce * (uKeyCol * uKeyDir.y * wSpot(Sp) + uAmbCol + uHaze) * inside * fr * uRefl * exp(-(t * fogDensity) * (t * fogDensity));
          }
          // the string field in the lacquer: every string a hairline, every sounding string a ribbon of light
          float ry = min(R.y, -0.02), okR = step(R.y, -0.02), rs = abs(R.y) < 0.02 ? -0.02 : R.y, ts = (50.0 - vW.y) / rs; vec3 Q = vW + R * ts;
          float kb = (Q.x + 139.7 - 0.2126 * (Q.z + 17.0)) / 3.172, kt = (Q.x + 138.0) / 3.172;
          float isB = smoothstep(-0.5, 2.0, kb) * step(kb, 25.5) * step(Q.z, 450.0 - 3.42 * kb);
          float isT = (1.0 - isB) * step(25.5, kt) * step(kt, 87.5) * step(Q.z, 43.0 + 350.0 * pow(clamp(1.0 - (kt - 26.0) / 61.0, 0.0, 1.0), 1.5));
          float kk = mix(kt, kb, isB), fk = fwidth(kk);
          vec4 e = texelFetch(uEnv, ivec2(int(clamp(kk, 0.0, 87.0) + 0.5), 0), 0);
          float ln = mix(1.0 - smoothstep(0.12, 0.42, abs(fract(kk + 0.5) - 0.5)), 0.4, clamp(fk * 1.6, 0.0, 1.0));
          float amp = max(e.g, uPedal * 0.09), fl = 1.0 + 1.6 * exp(-e.b * 4.0);
          vec3 sc = mix(mix(uSilverC, vec3(0.5, 0.68, 1.0), 0.4), uCopperC * vec3(1.5, 1.2, 0.9), isB);
          col += sc * (ln * 0.22 * (uKeyCol * wSpot(Q) + uAmbCol) + mix(ln, 1.0, amp) * amp * fl * 1.8) * (isB + isT) * step(0.02, abs(R.y)) * step(0.0, ts) * step(-17.0, Q.z) * (0.25 + fr) * uRefl * exp(-(ts * fogDensity) * (ts * fogDensity));
          // the lit porthole and its shaft, mirrored
          float tp = (uPortal.y - vW.y) / ry; vec2 dp = (vW + R * tp).xz - uPortal.xz;
          vec2 rh = R.xz / max(length(R.xz), 1e-3), tov = uPortal.xz - vW.xz;
          float bx = (rh.x * tov.y - rh.y * tov.x) / 4.5;
          float beam = exp(-bx * bx) * step(0.0, dot(rh, tov)) * smoothstep(-0.5, 0.1, R.y) * exp(-dot(tov, tov) / 4900.0);
          col += uPortalCol * (1.6 * exp(-dot(dp, dp) / 90.0) * okR * step(0.0, tp) + 0.35 * beam) * (0.15 + fr) * uRefl;
        }
        gl_FragColor = vec4(col, ${u.soft?"vA * vA * (3.0 - 2.0 * vA) * 0.6":"1.0"});
        #include <fog_fragment>
      }`});return u.soft&&(c.transparent=!0,c.depthWrite=!1),c}function ye(a,u,c){a.index&&(a=a.toNonIndexed()),a.deleteAttribute("uv"),a.computeVertexNormals();const N=a.attributes.position,F=new Float32Array(N.count*3);for(let M=0;M<N.count;M++){const y=c?c(N.getX(M),N.getY(M),N.getZ(M)):u;F[M*3]=y.r,F[M*3+1]=y.g,F[M*3+2]=y.b}return a.setAttribute("color",new t.BufferAttribute(F,3)),a}function ne(a,u,c,N,F,M,y,C=0){const T=new t.BoxGeometry(a,u,c);return C&&T.rotateY(C),T.translate(N,F,M),ye(T,y)}function Ie(a,u,c,N,F,M,y){const C=[],T=(r,m)=>[a[0]+u[0]*r+c[0]*m,a[1]+u[1]*r+c[1]*m,a[2]+u[2]*r+c[2]*m];for(let r=0;r<N;r++)for(let m=0;m<F;m++){const w=r/N,v=(r+1)/N,p=m/F,f=(m+1)/F;C.push(...T(w,p),...T(v,p),...T(v,f),...T(w,p),...T(v,f),...T(w,f))}const B=new t.BufferGeometry;return B.setAttribute("position",new t.Float32BufferAttribute(C,3)),ye(B,M,y)}function me(a,u,c,N,F,M){const y=[],C=a.length,T=m=>{const w=a[Math.max(0,m-1)],v=a[Math.min(C-1,m+1)];let p=v[0]-w[0],f=v[1]-w[1];const A=Math.hypot(p,f)||1;p/=A,f/=A;const V=f,g=-p,[le,L]=a[m],z=typeof u=="function"?u(m):u,j=c(m),Q=N(m);return[[le-V*z,j,L-g*z],[le+V*z,j,L+g*z],[le+V*z*.8,Q,L+g*z*.8],[le-V*z*.8,Q,L-g*z*.8]]};let B=T(0);for(let m=1;m<C;m++){const w=T(m);for(let v=0;v<4;v++){const p=B[v],f=B[(v+1)%4],A=w[(v+1)%4],V=w[v];y.push(...p,...A,...V,...p,...f,...A)}B=w}const r=new t.BufferGeometry;return r.setAttribute("position",new t.Float32BufferAttribute(y,3)),ye(r,F,M)}function Co(a,u,c,N,F){const M=[],y=a.length,C=m=>{const w=a[Math.max(0,m-1)],v=a[Math.min(y-1,m+1)];let p=v[0]-w[0],f=v[1]-w[1];const A=Math.hypot(p,f)||1;p/=A,f/=A;const V=f,g=-p,[le,L]=a[m],z=u(m),j=c(m);return[[-3.5,z],[-.75,z],[-.45,z-.55],[.45,z-.55],[.75,z],[3.5,z],[3.5,z+.7],[1,z+1.8],[1,j-1.8],[3.5,j-.7],[3.5,j],[.95,j],[.6,j+.6],[-.6,j+.6],[-.95,j],[-3.5,j],[-3.5,j-.7],[-1,j-1.8],[-1,z+1.8],[-3.5,z+.7]].map(([Q,P])=>[le+V*Q,P,L+g*Q])};let T=C(0);const B=T.length;for(let m=1;m<B-1;m++)M.push(...T[0],...T[m+1],...T[m]);for(let m=1;m<y;m++){const w=C(m);for(let v=0;v<B;v++){const p=T[v],f=T[(v+1)%B],A=w[(v+1)%B],V=w[v];M.push(...p,...A,...V,...p,...f,...A)}T=w}const r=new t.BufferGeometry;return r.setAttribute("position",new t.Float32BufferAttribute(M,3)),ye(r,N,F)}function lo(a,u,c=.5,N=.32){const F=[];for(const[y,C,T,B]of a){if(B){const w=[[-c,-c],[c,-c],[c,c],[-c,c]].map(p=>[y+p[0],C,T+p[1]]),v=[[-c,-c],[c,-c],[c,c],[-c,c]].map(p=>[y+p[0]*.6,C+B,T+p[1]*.6]);for(let p=0;p<4;p++){const f=w[p],A=w[(p+1)%4],V=v[(p+1)%4],g=v[p];F.push(...f,...V,...A,...f,...g,...V)}F.push(...v[0],...v[2],...v[1],...v[0],...v[3],...v[2]);continue}const r=[[-c,0,-c],[c,0,-c],[c,0,c],[-c,0,c]].map(w=>[y+w[0],C,T+w[2]]),m=[[-c,0,-c],[c,0,-c],[c,0,c],[-c,0,c]].map(w=>[y+w[0]*.6,C-N,T+w[2]*.6]);for(let w=0;w<4;w++){const v=r[w],p=r[(w+1)%4],f=m[(w+1)%4],A=m[w];F.push(...v,...p,...f,...v,...f,...A)}F.push(...m[0],...m[1],...m[2],...m[0],...m[2],...m[3])}const M=new t.BufferGeometry;return M.setAttribute("position",new t.Float32BufferAttribute(F,3)),ye(M,u)}function Ao(a,u,c,N,F,M){const y=new t.Shape;y.moveTo(-3.4,u),y.lineTo(3.4,u),y.lineTo(1.4,u+1.6),y.lineTo(.45,c-1.4),y.lineTo(1.2,c),y.lineTo(-1.2,c),y.lineTo(-.45,c-1.4),y.lineTo(-1.4,u+1.6),y.closePath();const C=new t.ExtrudeGeometry(y,{depth:6.6,bevelEnabled:!1});return C.translate(0,0,-3.3),C.rotateY(Math.PI/2+F),C.translate(a,0,N),ye(C,M)}function Po(a,u){return new t.ShaderMaterial({uniforms:{...a,uStrA:{value:Ye},uStrB:{value:xt},uLac:{value:new t.Color(H[0])},uBronze:{value:new t.Color(H[5]).multiplyScalar(.5)},uMirror:{value:u.mirror},uFogCol:{value:u.fog.clone()},uFogD:{value:u.fogD}},depthWrite:!1,side:t.DoubleSide,vertexShader:`
      varying vec3 vW;
      void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
      uniform vec3 uLac, uBronze, uFogCol; uniform float uMirror, uFogD, uTime, uPedal; uniform float uStrA[5]; uniform float uStrB[5];
      varying vec3 vW;
      ${_t}
      ${no}
      void main(){
        vec3 n = normalize(vec3(${ot.toFixed(3)}, -1.0, 0.0));
        vec3 Vd = vW - cameraPosition; float d0 = length(Vd); vec3 V = Vd / max(d0, 1e-3);
        vec3 R = reflect(V, n);
        if (vW.x > wBentX(vW.z)) discard;                    // the lid is cut to the wing shape of the case
        float fres = 0.35 + 0.65 * pow(1.0 - abs(dot(V, n)), 3.0);
        vec3 col = uLac * 0.6 + uHaze * 0.4 * fres;
        // the shaft and its lit haze, mirrored: the top of the frame is never an empty black
        col += uKeyCol * (0.15 * wShaft(vW, R) + 0.012) * fres * (1.0 + 0.6 * uPedal);
        if (R.y < -0.02) {
          float t = (${I.toFixed(1)} - vW.y) / R.y; vec3 Sp = vW + R * t;
          float inside = smoothstep(${(-S-10).toFixed(1)}, ${(-S+10).toFixed(1)}, Sp.x) * (1.0 - smoothstep(-10.0, 10.0, Sp.x - wBentX(Sp.z))) * smoothstep(4.0, 24.0, Sp.z) * (1.0 - smoothstep(${(G-10).toFixed(1)}, ${(G+10).toFixed(1)}, Sp.z));
          float g = 0.7 + 0.5 * wNoise(vec3(Sp.x * 0.6, 0.0, Sp.z * 0.02));
          vec3 sb = uSpruce * g * (uKeyCol * uKeyDir.y * wSpot(Sp) + uAmbCol + uHaze + uFillCol * 0.9) * (1.0 + 0.8 * uPedal);
          // string field as a faint sheen of lines over the board
          sb *= 0.8 + 0.2 * sin(Sp.x * 2.0);
          float t2 = (${Wt.toFixed(1)} - vW.y) / R.y; vec3 Q = vW + R * t2; float bar = 0.0;
          float zt = clamp((Q.z - ${Me.toFixed(1)}) / ${(Ze-Me).toFixed(1)}, 0.0, 1.0);
          for (int i = 0; i < 5; i++) { float sx = mix(uStrA[i], uStrB[i], zt); bar = max(bar, 1.0 - smoothstep(3.2, 4.4, abs(Q.x - sx))); }
          bar *= step(${Me.toFixed(1)}, Q.z) * step(Q.z, ${Ze.toFixed(1)});
          sb = mix(sb * inside, uBronze * (uKeyCol * 0.5 * wSpot(Q) + uAmbCol + uHaze), bar);
          float ft = exp(-pow((d0 + t) * uFogD * 0.6, 2.0));
          col += sb * uMirror * fres * ft;
        }
        float f = 1.0 - exp(-pow(d0 * uFogD, 2.0));
        gl_FragColor = vec4(mix(col, uFogCol, f * 0.7), 1.0);
      }`})}function ko(a,u){return new t.ShaderMaterial({uniforms:{...a,uPedalF:a.uPedal,uCopper:{value:new t.Color(H[3])},uSilver:{value:new t.Color(H[2])},uMirror:{value:u.mirror},uFogD:{value:u.fogD}},transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.AdditiveBlending,vertexShader:`
      attribute vec3 iA; attribute vec3 iB; attribute vec4 iInfo;
      uniform sampler2D uEnv; uniform float uTime, uPedal, uPx;
      varying float vV, vEnvF, vAmp, vKind, vSeed, vAge, vT; varying vec3 vW;
      void main(){
        float t = position.x, sd = position.y, amp = 0.0, age = 99.0;
        if (iInfo.x > -0.5) {
          vec4 e = texelFetch(uEnv, ivec2(int(iInfo.x + 0.5), 0), 0); age = e.b;
          amp = max(e.g, uPedal * 0.07 * (0.6 + 0.4 * sin(uTime * 3.1 + iInfo.w * 40.0)));
        }
        float shape = 0.62 * abs(sin(3.14159 * t)) + 0.26 * abs(sin(6.28318 * t)) + 0.14 * abs(sin(9.42478 * t));
        float env = 1.5 * amp * shape;
        vec3 P = mix(iA, iB, t);
        vec4 w = modelMatrix * vec4(P, 1.0); vW = w.xyz;
        vec4 mv = viewMatrix * w;
        vec3 dv = (modelViewMatrix * vec4(iB - iA, 0.0)).xyz; dv /= max(length(dv), 1e-4);
        vec3 sdv = cross(dv, mv.xyz); sdv /= max(length(sdv), 1e-4);
        float dist = length(mv.xyz);
        float hw = max(max(iInfo.y, env), 1.1 * uPx * dist);
        mv.xyz += sdv * sd * hw;
        vV = sd; vEnvF = env / hw; vAmp = amp; vKind = iInfo.z; vSeed = iInfo.w; vAge = age; vT = t;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform vec3 uCopper, uSilver, uKeyCol, uAmbCol; uniform float uMirror, uFogD, uTime, uPedalF;
      varying float vV, vEnvF, vAmp, vKind, vSeed, vAge, vT; varying vec3 vW;
      void main(){
        // only where the line of sight actually meets the lid
        vec3 n = normalize(vec3(${ot.toFixed(3)}, -1.0, 0.0)), p0 = vec3(${(-S).toFixed(1)}, ${ve.toFixed(1)}, 0.0);
        vec3 D = vW - cameraPosition; float dn = dot(D, n);
        float th = dot(p0 - cameraPosition, n) / (abs(dn) > 1e-4 ? dn : 1e-4);
        vec3 H = cameraPosition + D * th;
        float xb = ${S.toFixed(1)} - ${Vt.toFixed(1)} * pow(clamp((H.z - ${He.toFixed(1)}) / ${(G-He).toFixed(1)}, 0.0, 1.0), ${Gt.toFixed(1)});
        float inLid = (1.0 - smoothstep(xb - 45.0, xb - 3.0, H.x)) * smoothstep(${(-S+2).toFixed(1)}, ${(-S+30).toFixed(1)}, H.x) * smoothstep(${X.toFixed(1)}, ${(X+40).toFixed(1)}, H.z) * (1.0 - smoothstep(${(G-40).toFixed(1)}, ${(G+5).toFixed(1)}, H.z));
        inLid *= smoothstep(0.0, 0.14, vT) * (1.0 - smoothstep(0.68, 0.98, vT));
        if (th < 0.0 || th > 1.0 || inLid < 0.01) discard;
        float a = abs(vV);
        vec3 gcol = mix(mix(uSilver, vec3(0.5, 0.68, 1.0), 0.45), uCopper * vec3(1.5, 1.0, 0.62), vKind);
        vec3 base = mix(uSilver * 0.24, uCopper * 0.5, vKind) * (uAmbCol * 1.2 + uKeyCol * 0.5);
        vec3 rgb = base * (1.0 - a) * 0.6 * 0.4 + gcol * (1.0 - a) * 0.3 * uPedalF * (0.7 + 0.3 * sin(uTime * 3.1 + vSeed * 40.0));   // the whole twin glows on a pedal lift
        if (vEnvF > 0.002) {
          float q = a / vEnvF, inside = 1.0 - smoothstep(0.9, 1.0, q);
          float dens = 0.1 + 0.9 * pow(min(q, 1.0), 6.0);
          rgb += gcol * 1.1 * dens * inside * (0.2 + 0.8 * vAmp) * (1.0 + 1.6 * exp(-vAge * 4.0)) * smoothstep(0.0, 0.25, vEnvF);
        }
        float ft = exp(-pow(length(D) * uFogD * 0.6, 2.0));
        gl_FragColor = vec4(rgb * uMirror * 5.0 * ft * inLid, 1.0);
      }`})}function ro(a,u){const c=new t.Color(.8,.74,.6),N=new t.Color(H[2]).multiplyScalar(.72),F=new t.Color(.3,.25,.21),M=new t.Color(.16,.12,.1),y=(P,re,q,we)=>{const nt=[],lt=[],Be=[],ie=new t.Color;for(let se=0;se<=12;se++)for(let Ce=0;Ce<=6;Ce++){const Y=se/12,de=Ce/6,[Ae,St]=P(Y),rt=re(Y),it=(de-.5)*2*rt,Fe=Ce===0?1+.06*Math.cos(se*Math.PI):1,zt=Ae+q[0]*it*Fe,qe=St+q[1]*it*Fe;nt.push(zt,.16*Math.sin(Math.PI*de)*rt+.1*Y-.3*Y*Y,-qe);const he=Y,st=Math.exp(-Math.pow((he-we)/.07,2))+.7*Math.exp(-Math.pow((he-we-.27)/.05,2));ie.copy(c).lerp(N,R(.5,1,he)*.65+.2*(.5+.5*Math.sin(he*31+de*9))).lerp(F,.6*st*(.6+.4*Math.sin(de*11+se))).lerp(M,.75*R(.3,0,de)*(.55+.45*Math.cos(se*Math.PI))).lerp(F,.5*R(.9,1,he));const _e=Math.exp(-(Math.pow((he-.45)/.07,2)+Math.pow((de-.62)/.16,2)));ie.lerp(M,.8*_e),lt.push(ie.r,ie.g,ie.b)}for(let se=0;se<12;se++)for(let Ce=0;Ce<6;Ce++){const Y=se*7+Ce,de=Y+6+1;Be.push(Y,de,Y+1,Y+1,de,de+1)}const We=new t.BufferGeometry;return We.setAttribute("position",new t.Float32BufferAttribute(nt,3)),We.setAttribute("color",new t.Float32BufferAttribute(lt,3)),We.setIndex(Be),We.computeVertexNormals(),We},C=y(P=>[.25+3.75*P,.2+1.3*P+.35*Math.sin(Math.PI*P)],P=>.05+(.3+.95*Math.pow(Math.sin(Math.PI*Math.min(1,P*.97+.03)),.6))*(1-.3*P)*R(1,.86,P),[.33,-.94],.36),T=y(P=>[.25+2*P,-.35-1.8*P],P=>.05+(.22+.95*Math.pow(Math.sin(Math.PI*Math.min(1,P*.96+.04)),.6))*R(1,.82,P),[-.72,-.69],.5);T.translate(0,-.06,0);const B=Ke([C,T]);C.dispose(),T.dispose();const r=Ne(a,{fuzz:.8,spec:.2,shin:12,side:t.DoubleSide,gain:.9,self:.12}),m=new t.Mesh(B,r),w=new t.Mesh(B,r);w.scale.x=-1;const v=(P,re)=>{P.index&&(P=P.toNonIndexed()),P.deleteAttribute("uv");const q=P.attributes.position,we=new Float32Array(q.count*3);for(let xe=0;xe<q.count;xe++){const Ee=re(q.getX(xe),q.getY(xe),q.getZ(xe));we[xe*3]=Ee.r,we[xe*3+1]=Ee.g,we[xe*3+2]=Ee.b}return P.setAttribute("color",new t.BufferAttribute(we,3)),P},p=new t.CapsuleGeometry(.4,2.3,4,10);p.rotateX(Math.PI/2),p.scale(1,.9,1),p.translate(0,0,.3);const f=new t.SphereGeometry(.62,10,8);f.scale(1,.9,1.35),f.translate(0,.08,-.75);const A=new t.SphereGeometry(.4,10,8);A.translate(0,.08,-1.75);const V=[v(p,(P,re,q)=>c.clone().lerp(F,.35+.3*Math.sin(q*7))),v(f,()=>c.clone().lerp(N,.3)),v(A,(P,re,q)=>Math.abs(P)>.24&&q<-1.8?M:F)];for(const P of[-1,1]){const re=new t.CylinderGeometry(.035,.085,2.5,5);re.translate(0,1.25,0),re.rotateX(-1.15),re.rotateY(-P*.5),re.translate(P*.18,.3,-1.95),V.push(v(re,()=>M))}const g=new t.Mesh(Ke(V),r);V.forEach(P=>P.dispose());const le=new t.Group;le.add(m,w,g);const L=u()*6.28,z=new t.Vector3,j=new t.Matrix4,Q=new t.Vector3(0,1,0);return{object:le,phase:L,mat:r,set(P,re,q,we){le.position.copy(P),z.copy(P).sub(re),j.lookAt(z,P,we||Q),le.quaternion.setFromRotationMatrix(j),m.rotation.z=q,w.rotation.z=-q}}}function To(a,u,c){const N=[],F=[],M=[],y=[],C=new t.Color(H[4]),T=(p,f,A,V,g,le,L=0)=>{const z=Math.cos(f);N.push(Math.cos(p)*z*2500,Math.sin(f)*2500,Math.sin(p)*z*2500),F.push(V.r*g,V.g*g,V.b*g),M.push(A,le??a()*6.28,a()),y.push(L)},B=[.035,.085,.14],r=Math.round(133*c);if(u.bokeh>.01)for(let p=0;p<3;p++)for(let f=0;f<r;f++){const A=D(-1.3,1.3,(f+a.range(-.3,.3))/r);if(Math.abs(Math.sin(A*9+p))<.12)continue;const V=B[p]+.03*A*A+a.range(-.006,.006);T(A,V,a.range(.008,.02)*(1-p*.15),C,u.bokeh*a.range(.25,.5))}for(const p of u.lamps)for(let f=0;f<p.n;f++)T(p.az+a.range(-p.spread,p.spread),p.el+a.range(-p.spread,p.spread)*.5,p.size*a.range(.6,1.2),new t.Color(p.color),p.k*a.range(.6,1.1),void 0,p.soft?1:0);const m=new t.BufferGeometry;m.setAttribute("position",new t.Float32BufferAttribute(N,3)),m.setAttribute("aCol",new t.Float32BufferAttribute(F,3)),m.setAttribute("aA",new t.Float32BufferAttribute(M,3)),m.setAttribute("aSoft",new t.Float32BufferAttribute(y,1));const w=new t.ShaderMaterial({uniforms:{uTime:{value:0},uPtScale:{value:400}},transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
      attribute vec3 aCol; attribute vec3 aA; attribute float aSoft; uniform float uTime, uPtScale; varying vec3 vC; varying float vSoft;
      void main(){
        vSoft = aSoft;
        vC = aCol * (0.8 + 0.2 * sin(uTime * (0.5 + aA.z) + aA.y)) * (0.93 + 0.07 * sin(uTime * 7.0 * aA.z + aA.y * 3.0));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = clamp(aA.x * 2.0 * uPtScale * (1.0 + 0.06 * sin(uTime * 0.4 + aA.y)), 2.0, 90.0);
      }`,fragmentShader:`
      varying vec3 vC; varying float vSoft;
      void main(){ float d = length(gl_PointCoord * 2.0 - 1.0); float disc = (1.0 - smoothstep(0.78, 1.0, d)) * (0.55 + 0.45 * smoothstep(0.45, 0.9, d));
        float lamp = (exp(-d * d * 3.5) + 2.2 * exp(-d * d * 40.0)) * (1.0 - smoothstep(0.8, 1.0, d));      // a work-light: hot core, soft falloff
        gl_FragColor = vec4(vC * mix(disc, lamp, vSoft), 1.0); }`}),v=new t.Points(m,w);return v.frustumCulled=!1,v.renderOrder=-3,{object:v,uniforms:w.uniforms}}const Fo={spot:{hero:"spot",keyDir:[.5,.8,.26],fog:"#0a1026",haze:"#465680",hall:"#3a2a18",fogD:.0033,pool:[-85,46,90,120,.3],gobo:0,mirror:.9,bokeh:1,copper:[1.5,0],sat:1.06,lamps:[{az:.18,el:.33,n:34,spread:.035,size:.006,color:"#ffe6b8",k:1.3},{az:.18,el:.33,n:1,spread:0,size:.05,color:"#e8c98a",k:.35,soft:1}],rays:["#cfd8e6",.28],exposure:1.28,tint:"#eef2ff",shadow:"#080d2a",portal:"#dfe6f5"},rehearsal:{hero:"rehearsal",keyDir:[.62,.7,.34],fog:"#131018",haze:"#6c5a56",hall:"#2c2014",fogD:.0027,pool:[-66,46,104,86,.3],gobo:0,mirror:1,bokeh:.35,copper:[1.6,0],sat:.98,lamps:[{az:.35,el:.5,n:5,spread:.3,size:.04,color:"#fff0dc",k:.8,soft:1},{az:-.7,el:.1,n:3,spread:.2,size:.012,color:"#7dffb0",k:.35}],rays:["#ffe2b0",.14],exposure:1.32,tint:"#fff4e4",shadow:"#0e0f1e",portal:"#ffe6c0"},moon:{hero:"moon",keyDir:[-.3,.88,.3],fog:"#050a1e",haze:"#22346e",hall:"#0c1638",fogD:.0034,pool:[5,46,150,95,.34],rayR:44,gobo:1,mirror:.6,bokeh:0,copper:[.8,.4],sat:.8,lamps:[{az:-.9,el:.06,n:2,spread:.3,size:.01,color:"#ff5a4a",k:.4},{az:.4,el:.24,n:3,spread:.5,size:.045,color:"#8fa8ff",k:.2,soft:1}],rays:["#8fb0ff",.13],exposure:1.5,tint:"#dfe8ff",shadow:"#040a26",portal:"#a9c2ff"}};var Vo={id:"hall-of-strings",name:"Hall of Strings",category:"interior",weirdness:.2,media:["interior","tiny","air"],async build(a){const u=a.rng,c=a.vary||{},N=a.quality?.detail??1,F=je(c.density??1,.7,1.3),M=u.fork("look"),y=u.fork("moth"),C=u.fork("geo"),T=c.hour||"any",B=T==="night"?"moon":T==="golden"||T==="dawn"?"rehearsal":T==="day"?"spot":M.pick(["spot","rehearsal","moon"]),r={...Fo[B]};r.fog=new t.Color(r.fog);const m=M.pick(["nocturne","nocturne","toccata","bells"]),w=M.pick(["one","one","two","rosin"]),v=!!c.rare,p=new t.Vector3(r.keyDir[0]+M.range(-.06,.06),r.keyDir[1],r.keyDir[2]+M.range(-.05,.05)).normalize(),f=new t.Scene;f.background=r.fog.clone(),f.fog=new t.FogExp2(r.fog.clone(),r.fogD);const A=await Mo(a,{palette:H,piece:m,light:r.hero,keyDir:p.toArray(),apron:!1,dust:Math.round(12e3*N*F)});f.add(A.object);const V=A.anchors,g=A.uniforms,le=new t.Vector3(r.pool[0]+M.range(-12,12),r.pool[1],r.pool[2]+M.range(-15,15)),L={uTime:g.uTime,uPedal:g.uPedal,uEnv:g.uEnv,uPx:g.uPx,uKeyDir:g.uKeyDir,uKeyCol:g.uKeyCol,uFillCol:g.uFillCol,uAmbCol:g.uAmbCol,uPoolC:{value:le},uPool:{value:new t.Vector2(r.pool[3],r.pool[4])},uHaze:{value:new t.Color(r.haze)},uSpruce:{value:new t.Color(H[4]).multiplyScalar(.5)},uGobo:{value:r.gobo},uShaftK:{value:r.rays[1]>.01?1:.25},uPortal:{value:V.portalSeat.position.clone()},uPortalCol:{value:new t.Color(r.portal)},uCopperC:{value:new t.Color(H[3])},uSilverC:{value:new t.Color(H[2])},uLampP:g.uLampP,uLampCol:g.uLampCol};g.uLampCol.value.multiplyScalar(B==="moon"?.45:1),g.uAmbCol.value.multiplyScalar(3),g.uShaft.value.set(-12,36);{const e=A.parts.strings.material.uniforms,o=e.uCopper.value;o.lerp(new t.Color(1,.5,.2),.35).lerp(new t.Color(H[2]),r.copper[1]).multiplyScalar(r.copper[0]),L.uCopperC.value.copy(o).multiplyScalar(.67),A.parts.dust.material.uniforms.uCopper.value.lerp(new t.Color(H[2]),r.copper[1]),e.uGlow.value*=1.8*(m==="bells"?1.6:m==="toccata"?.7:1),B==="rehearsal"&&g.uShaft.value.set(-30,10)}await a.yield();const z=V.portalSeat.position,j=V.diveDir,Q=[[-16,74,402],[-25,73.5,348],[-36,70,300],[-49,57.5,240],[-84,75,186],[-100,88,124],[-127,78,84],[-146,62,47],[-150,52,23]],P=-153.5,re=5.5,q=5,we=Q.length,xe=e=>e<=270?D(46,35.5,e/270):e<=360?D(35.5,36.5,(e-270)/90):D(36.5,54,R(0,1,(e-360)/270)*.35+.65*(e-360)/270);for(let e=0;e<=630;e+=45){const o=-e*Math.PI/180;Q.push([P+re*Math.cos(o),xe(e),re*Math.sin(o)])}const Ee=we+6,nt=Q.length-1;Q.push([-147.6,60.5,-10],[-144,72,-25]);const lt=Q.length-1;Q.push([-114,88,-44],[-99,97.5,-61]);for(const e of[60,40,20,0])Q.push([z.x-j.x*e,z.y-j.y*e,z.z-j.z*e]);const Be=zo(Q);await a.yield();const ie=[];{const o=new Float32Array(4803),s=new t.Vector3;let n=0;for(let i=0;i<=1600;i++)Be.pointAt(i/1600,s),o[i*3]=s.x,o[i*3+1]=s.y,o[i*3+2]=s.z,(i&511)===511&&await a.yield();for(const i of Q){let d=1e9,k=n;for(let l=n;l<=Math.min(1600,n+300);l++){const h=(o[l*3]-i[0])**2+(o[l*3+1]-i[1])**2+(o[l*3+2]-i[2])**2;h<d&&(d=h,k=l)}n=k,ie.push(k/1600)}}await a.yield();const We=ie[q],se=ie[we],Ce=ie[Ee],Y=ie[nt],de=ie[lt],Ae=[[0,.4],[We,14.4],[se,19.2],[Ce,20.5],[Y,27.4],[de,29.7],[1,39.6]],St=e=>{for(let o=1;o<Ae.length;o++)if(e<=Ae[o][0]){const s=Ae[o-1],n=Ae[o];return D(s[1],n[1],(e-s[0])/Math.max(1e-5,n[0]-s[0]))}return 39.6},rt=e=>{for(let o=1;o<Ae.length;o++)if(e<=Ae[o][1]){const s=Ae[o-1],n=Ae[o];return D(s[0],n[0],(e-s[1])/(n[1]-s[1]))}return 1},it=je(Be.length/14,42,50),Fe=A.parts.strings.geometry,zt=Fe.instanceCount/2,qe=Fe.attributes.iA,he=Fe.attributes.iB,st=Fe.attributes.iInfo,_e=[];for(let e=0;e<zt;e++)_e.push({i:e,key:Math.round(st.getX(e)),bass:st.getZ(e)>.5,ax:qe.getX(e),ay:qe.getY(e),az:qe.getZ(e),bx:he.getX(e),by:he.getY(e),bz:he.getZ(e)});const ut=(e,o)=>{const s=Math.hypot(e.bx-e.ax,e.bz-e.az),n=1-o/s;return[D(e.ax,e.bx,n),D(e.ay,e.by,n),D(e.az,e.bz,n)]},Je=e=>{let o=30;for(const s of _e)Math.abs(s.bx-e)<7&&s.bz>o&&(o=s.bz);return o},Mt=new t.Color(H[4]),Rt=new t.Color(H[3]),io=new t.Color(H[5]),so=new t.Color(H[1]),Ct=new t.Color(H[0]),uo=new t.Color(H[6]),pe=io.clone().multiplyScalar(.8),Se=Ct.clone().lerp(so,B==="rehearsal"?.06:.15).multiplyScalar(B==="rehearsal"?1.3:2),ct=Mt.clone().lerp(Rt,.35).multiplyScalar(.5),J=Mt.clone().lerp(Rt,.4).multiplyScalar(.7);B==="rehearsal"&&pe.multiplyScalar(.6).lerp(new t.Color(.075,.075,.075),.45);const et=(e,o=.05,s=.22)=>(n,i,d)=>e.clone().multiplyScalar(1-s+s*(.5+.5*a.noise.n2(n*o+i*o,d*o)));await a.yield();const ge=[[S,14],[S,52]];for(let e=0;e<=40;e++){const o=D(He,G,e/40);ge.push([at(o),o])}const co=(()=>{const e=[];for(let s=1;s<ge.length;s++){const[n,i]=ge[s-1],[d,k]=ge[s];e.push(-S,I,i,d,I,k,n,I,i,-S,I,i,-S,I,k,d,I,k)}const o=new t.BufferGeometry;return o.setAttribute("position",new t.Float32BufferAttribute(e,3)),ye(o,Mt.clone().multiplyScalar(.5))})(),Lt=new t.Mesh(co,Ne(L,{grain:1,spec:.5,shin:70,refl:.35}));Lt.name="soundboard",f.add(Lt);const ue=[],fe=[],ee=[],Ve=e=>D(53.5,Wt,R(Me,14,e))-(Wt-47.5)*R(425,480,e)+1.5*Math.sin(Math.PI*je(e/430,0,1)),Ge=(e,o)=>Ve(o)-4.2+1.5*Math.abs(Math.sin(Math.PI*(o-30-e*9)/46))*R(14,30,o)*(1-R(410,430,o));for(let e=0;e<5;e++){const o=[];for(let l=0;l<=110;l++){const h=D(Me,Ze,l/110);o.push([Qe(e,h),h])}const n=Math.atan2(xt[e]-Ye[e],Ze-Me);ue.push(Co(o,l=>Ge(e,o[l][1]),l=>Ve(o[l][1])+4.5,pe,et(pe,.04,.3))),await a.yield();const i=[],d=Math.cos(n),k=Math.sin(n);for(let l=22+e*3;l<424;l+=6.5)for(const h of[-2.5,2.5])i.push([Qe(e,l)+h*d,Ge(e,l),l-h*k]),i.push([Qe(e,l)+h*d,Ve(l)+4.5,l-h*k,.3]);for(let l=0;l<i.length;l+=64)ue.push(lo(i.slice(l,l+64),pe.clone().multiplyScalar(1.25))),await a.yield();for(let l=30+e*9;l<420;l+=46)ue.push(Ao(Qe(e,l),Ge(e,l)+.6,Ve(l)+3.9,l,n,pe.clone().multiplyScalar(.8)));await a.yield();for(const l of[-3.45,3.45]){const h=[];for(let W=2;W<=104;W+=2)h.push([o[W][0]+l*d,o[W][1]-l*k]);ee.push(me(h,.2,W=>Ve(h[W][1])+4.32,W=>Ve(h[W][1])+4.68,J.clone().multiplyScalar(1.2))),ee.push(me(h,.2,W=>Ge(e,h[W][1])-.16,W=>Ge(e,h[W][1])+.2,J.clone().multiplyScalar(1)))}await a.yield();for(let l=99+e*9;l<410;l+=46)for(const h of[0,1]){const W=Qe(e,l),te=(Ge(e,l)+Ve(l)+4.5)/2,ce=h?-1.06:1.06,b=h?-1.1:1.1,x=new t.CircleGeometry(1,18);x.scale(4.5,1.45,1),x.rotateY(Math.PI/2+n+h*Math.PI),x.translate(W+ce*d,te,l-ce*k),fe.push(ye(x,Ct.clone().multiplyScalar(.4)));const _=new t.TorusGeometry(1,.07,4,18);_.scale(4.6,1.55,3.5),_.rotateY(Math.PI/2+n+h*Math.PI),_.translate(W+b*d,te,l-b*k),ue.push(ye(_,pe.clone().multiplyScalar(1.5)))}ue.push(ne(9,5.5,4.6,Ye[e],53.6,Me-1.6,pe.clone().multiplyScalar(.95)),ne(10.5,1.2,6,Ye[e],50.6,Me-1.8,pe.clone().multiplyScalar(1.1)))}await a.yield();{const e=new t.Shape;e.moveTo(-46,G),e.lineTo(-46,Je(-40)-12);for(let n=-40;n<=140;n+=9)e.lineTo(n,Je(n)-10);e.lineTo(152,34),e.lineTo(S-1,34);for(let n=1;n<ge.length;n++)e.lineTo(ge[n][0]-1,ge[n][1]-(n===ge.length-1,0));e.closePath();const o=[[76,255],[120,160],[38,305]];for(const[n,i]of o){const d=new t.Path;d.absarc(n,i,8,0,Math.PI*2,!0),e.holes.push(d)}const s=new t.ExtrudeGeometry(e,{depth:4.8,bevelEnabled:!1,curveSegments:20});s.rotateX(Math.PI/2),s.translate(0,45.2,0),ue.push(ye(s,pe,et(pe,.05,.25)));for(const[n,i]of o){const d=new t.CircleGeometry(8.4,24);d.rotateX(-Math.PI/2),d.translate(n,40.3,i),ue.push(ye(d,Ct.clone().multiplyScalar(.4)));const k=new t.TorusGeometry(8.1,.35,5,40);k.rotateX(Math.PI/2),k.translate(n,45.3,i),ee.push(ye(k,J.clone().multiplyScalar(1.5)))}for(const n of[-20,30,62,98,136,156]){const i=Je(n)-6,d=ao(n+4)-4-i;ue.push(ne(2.4,1.3,d,n,45.8,i+d/2,pe.clone().multiplyScalar(1.1)))}for(let n=0;n<40;n++){const i=C.range(-30,150),d=C.range(Je(i)+6,Math.max(Je(i)+7,ao(i+6)-6));o.some(k=>Math.hypot(k[0]-i,k[1]-d)<11)||ue.push(ne(C.range(1,3.4),.6,C.range(2.4,3.4),i,45.5,d,pe.clone().multiplyScalar(1.15)))}}await a.yield();const Kt=new Set,Ht=_e.filter(e=>Kt.has(e.key)?!1:(Kt.add(e.key),!0)),At=Ht.filter(e=>!e.bass&&e.key%2===0),pt=Ht.filter(e=>e.bass&&e.key%2===0),Pt=At.map(e=>ut(e,14)),ft=pt.map(e=>ut(e,24));ue.push(me(Pt.map(e=>[e[0],e[2]]),2.6,()=>I,()=>45.75,ct,et(ct,.2,.3))),ue.push(me(ft.map(e=>[e[0],e[2]]),3,()=>I,e=>ft[e][1]-.55,ct,et(ct,.2,.3))),await a.yield(),ue.push(me(pt.map(e=>[e.bx+.4,e.bz+2.5]),4.5,()=>I,e=>pt[e].by-1.25,pe,et(pe,.06,.25))),ue.push(lo(_e.map(e=>[e.bx,e.by+.25,e.bz+.3]),J,.5,1.5)),await a.yield(),fe.push(Ie([-S,I,G],[0,0,14-G],[0,ve-I,0],8,2,Se)),fe.push(Ie([-S,46,14],[0,0,X-14],[0,ve-46,0],2,2,Se));{const e=ge.map(([s,n],i)=>[s+1.6+(i>1?.4:0),n]);fe.push(me(e,1.6,()=>I-3,()=>I+22,Se)),ee.push(me(e,1.5,()=>I+22,()=>I+23.3,J.clone().multiplyScalar(2))),ee.push(me(ge.map(([s,n])=>[s-.1,n]),.3,()=>I+8.6,()=>I+9.4,J.clone().multiplyScalar(1.3)));const o=s=>ve+ot*(ge[s][0]+S);ee.push(me([[S,X],...ge.slice(1)],1.7,s=>o(s)-1.6,s=>o(s)+.4,J.clone().multiplyScalar(2.2))),ee.push(ne(1.6,1.4,G-X,-S+1.2,ve-1,(G+X)/2,J.clone().multiplyScalar(2)))}await a.yield(),fe.push(Ie([S,46,X],[0,0,14-X],[0,16,0],2,1,Se)),fe.push(Ie([at(G)+2,I,G],[-S-at(G)-2,0,0],[0,22,0],4,1,Se)),fe.push(Ie([-S,44,X],[2*S,0,0],[0,44,0],6,2,Se)),fe.push(Ie([-S,88,X],[2*S,0,0],[0,0,-190],6,3,Se)),fe.push(Ie([-110,88,-168],[220,0,0],[0,78,-26],6,3,Se)),await a.yield();for(let e=0;e<9;e++)fe.push(ne(2.4,70,1.6,-96+e*24,126,-178,Se.clone().multiplyScalar(1.6),0));for(let e=40;e<G;e+=37.5)fe.push(ne(1.4,ve-I,3.2,-S+.7,(ve+I)/2,e,Se.clone().multiplyScalar(1.5)));ee.push(ne(1,1.6,G-14,-S+1,62.4,(G+14)/2,J.clone().multiplyScalar(2))),ee.push(ne(.8,1.6,G-14,-S+.8,86,(G+14)/2,J.clone().multiplyScalar(2)));for(let e=40;e<G;e+=37.5)ee.push(ne(.5,ve-I-6,.8,-S+1.5,(ve+I)/2,e,J.clone().multiplyScalar(2.2)));ee.push(ne(2*S,.9,.7,0,56,X+.6,J.clone().multiplyScalar(1.6)),ne(2*S,.7,.6,0,82,X+.5,J.clone().multiplyScalar(1.4)));for(let e=0;e<12;e++)ee.push(ne(.4,26,.5,-150+e*27.3,69,X+1.9,J.clone().multiplyScalar(1.6)));for(let e=0;e<12;e++)fe.push(ne(1.2,30,1.6,-150+e*27.3,66,X+.9,Se.clone().multiplyScalar(1.5)));ee.push(ne(2.2,1.4,14-X,S-.6,62.4,(14+X)/2,J.clone().multiplyScalar(2))),ee.push(ne(S+at(G),1.4,2.2,(at(G)-S)/2,62.6,G-.6,J.clone().multiplyScalar(2)));for(const e of[60,250,440])ee.push(ne(3,5,26,-S+1.5,ve-3,e,J.clone().multiplyScalar(1.5)));await a.yield();const It=new t.Mesh(Ke(ue),Ne(L,{spec:.6,shin:18,rim:.8,bounce:1.3,specTint:"#b9a27a",metal:B==="rehearsal"?.5:.85}));It.name="struts-plate-bridges",await a.yield();const Et=new t.Mesh(Ke(ee),Ne(L,{spec:1.6,shin:22,rim:1,bounce:1.3,specTint:"#ffd9a0",self:.22}));Et.name="brass-trim",f.add(Et),ee.forEach(e=>e.dispose()),await a.yield();const $t=new t.Mesh(Ke(fe),Ne(L,{spec:1.2,shin:50,refl:B==="rehearsal"?.55:1,self:.05}));$t.name="case",f.add(It,$t),ue.forEach(e=>e.dispose()),fe.forEach(e=>e.dispose()),await a.yield(),await a.yield();const Ot=new t.Color("#4c5d33").multiplyScalar(.8),kt=uo.clone().multiplyScalar(.95),Re=[],po=At.map(e=>ut(e,6)),Tt=pt.map(e=>ut(e,11));{const e=At.findIndex(o=>o.key>=44);Re.push(me(po.slice(e).map(o=>[o[0],o[2]]),1.3,()=>45.2,()=>47.1,kt))}Re.push(me(Tt.map(e=>[e[0],e[2]]),1.5,e=>Tt[e][1]-1.1,e=>Tt[e][1]+1,Ot)),Re.push(me([[-141,-20.4],[-100,-20.4],[-57,-20.4]],1,()=>47.7,()=>49.5,Ot)),Re.push(me([[-54,-20.4],[40,-20.4],[140,-20.4]],1,()=>45.2,()=>46.9,kt)),Re.push(me([[-163,-78.8],[-60,-78.8],[40,-78.8],[163,-78.8]],.95,()=>44.6,()=>48.4,kt));const Ut=Ne(L,{fuzz:1,spec:0,gain:.8}),jt=new t.Mesh(Ke(Re),Ut);jt.name="listing-felt",f.add(jt),Re.forEach(e=>e.dispose()),await a.yield();{const e=u.fork("drift"),o=[],s=new t.Color(.42,.33,.18),n=new t.Color(.45,.36,.2),i=[];for(let l=0;l<16;l++){const h=Pt[Math.floor(e()*Pt.length)];i.push([h[0]+e.range(-3,3),h[2]+e.range(4,9)*(e()<.5?-1:1)])}for(let l=0;l<12;l++){const h=ft[Math.floor(e()*ft.length)];i.push([h[0]+e.range(-3,3),h[2]+e.range(5,10)*(e()<.5?-1:1)])}for(let l=0;l<24;l++)i.push([l<12?e.range(-160,-90):e.range(-90,140),e.range(17,28)]);for(const[l,h]of i){const W=e.range(1.1,2.6),te=e.range(2.5,5),ce=e()*6.28,b=16,x=[],_=[],E=[],oe=[];for(let O=0;O<b;O++){const ae=O/b*6.2832,Z=W*(.7+.2*Math.sin(ae*3+ce)+.14*Math.sin(ae*5+ce*2.3));oe.push([l+Math.cos(ae)*Z*.5,h+Math.sin(ae)*Z*te*.5])}for(let O=0;O<b;O++){const ae=oe[O],Z=oe[(O+1)%b],Te=[D(l,ae[0],.55),D(h,ae[1],.55)],De=[D(l,Z[0],.55),D(h,Z[1],.55)];x.push(l,0,h,De[0],0,De[1],Te[0],0,Te[1],Te[0],0,Te[1],De[0],0,De[1],Z[0],0,Z[1],Te[0],0,Te[1],Z[0],0,Z[1],ae[0],0,ae[1]);for(const U of[n,n,n,n,n,s,n,s,s])_.push(U.r,U.g,U.b),E.push(U===s?0:1)}E[0]=1;for(let O=0;O<E.length;O+=9)E[O]=1;const $=new t.BufferGeometry;$.setAttribute("position",new t.Float32BufferAttribute(x,3)),$.translate(0,I+.12,0),$.computeVertexNormals(),$.setAttribute("color",new t.Float32BufferAttribute(_,3)),$.setAttribute("aAlpha",new t.Float32BufferAttribute(E,1)),o.push($)}const d=Ne(L,{spec:0,gain:1,soft:1});d.polygonOffset=!0,d.polygonOffsetFactor=-2,d.polygonOffsetUnits=-4;const k=new t.Mesh(Ke(o),d);k.name="dust-drifts",f.add(k),o.forEach(l=>l.dispose())}await a.yield();const Xt=new t.BufferGeometry,Ft=ve,Dt=ve+ot*2*S;Xt.setAttribute("position",new t.Float32BufferAttribute([-S,Ft,X,S,Dt,X,S,Dt,G+10,-S,Ft,X,S,Dt,G+10,-S,Ft,G+10],3));const mt=new t.Mesh(Xt,Po(L,r));mt.name="lid",mt.renderOrder=-2,mt.frustumCulled=!1,f.add(mt);const $e=new t.Mesh(Fe,ko(L,r));$e.name="lid-twin",$e.frustumCulled=!1,$e.renderOrder=1;{const e=new t.Vector3(ot,-1,0).normalize(),o=-e.dot(new t.Vector3(-S,ve,0));$e.matrixAutoUpdate=!1,$e.matrix.set(1-2*e.x*e.x,-2*e.x*e.y,-2*e.x*e.z,-2*o*e.x,-2*e.x*e.y,1-2*e.y*e.y,-2*e.y*e.z,-2*o*e.y,-2*e.x*e.z,-2*e.y*e.z,1-2*e.z*e.z,-2*o*e.z,0,0,0,1)}f.add($e),await a.yield();const Oe={value:0},Le=Xe.fxGroup();f.add(Le.object);const fo=le.clone().addScaledVector(p,300);r.rays[1]>.01&&Le.add(Xe.makeGodRays({rng:u.fork("rays"),time:Oe,position:fo.toArray(),direction:p.clone().negate().toArray(),radius:r.rayR??Math.min(r.pool[3],120)*.7,count:24,length:335,width:[8,22],color:r.rays[0],intensity:r.rays[1]*1.2,speed:.6,falloff:.4,fogAmount:.3})),Le.add(Xe.makeGodRays({rng:u.fork("wellrays"),time:Oe,position:[z.x-4,z.y+104,z.z+3],direction:[.04,-1,-.03],radius:7,count:7,length:108,width:[5,11],color:r.rays[0],intensity:Math.max(r.rays[1],.1)*1.2,speed:.8,falloff:.8,fogAmount:.6,near:[1.5,6]}));const Do=Le.add(Xe.makeParticles({rng:u.fork("motes"),preset:"dust",time:Oe,count:Math.round(600*F*N),box:[46,28,46],velocity:[.15,.5,-.1],colors:[H[2],H[4],H[3]],size:[.16,.5],intensity:.4,minAngle:.0012}));let mo=null;w==="rosin"&&(mo=Le.add(Xe.makeParticles({rng:u.fork("rosin"),preset:"dust",time:Oe,count:Math.round(2200*F*N),box:[70,44,70],minAngle:.0014,velocity:[.2,-.9,.1],colors:["#e8c98a","#f4e2b8","#c47a3a"],size:[.08,.24],intensity:1.3})));const ho=2,Nt=[],dt=Le.add(Xe.makeGlows({rng:u.fork("glows"),time:Oe,positions:[[14,120,-150],[0,41,100],[0,41,200],[0,-200,0]],colors:["#ffc88a","#dfe8ff","#dfe8ff",new t.Color("#f3e6c4").multiplyScalar(.2)],size:1,sizes:[B==="moon"?22:34,2.6,2.6,6.5],intensity:B==="moon"?.7:1.5,fogAmount:.5}));{const e=new t.SphereGeometry(1,8,6);e.scale(.34,.2,1.5);const o=e.attributes.position;for(let i=0;i<o.count;i++){const d=o.getZ(i);o.setX(i,o.getX(i)*(d<0?1.25:.6+.4*(1-d/1.5)))}const s=ye(e,new t.Color(H[2]).multiplyScalar(.6)),n=Ne(L,{spec:3,shin:40});for(let i=0;i<ho;i++){const d=new t.Mesh(s,n);f.add(d),Nt.push({m:d,x:i?C.range(20,70):C.range(-136,-122),z0:i?170:70,span:i?150:120,sp:C.range(5,8),ph:C.range(0,100)})}}await a.yield();const ht=To(u.fork("hall"),r,N);f.add(ht.object);const vt=new t.Mesh(new t.SphereGeometry(3e3,32,16),new t.ShaderMaterial({uniforms:{uFogCol:{value:r.fog.clone()},uHall:{value:new t.Color(r.hall)},uTime:g.uTime,uLamp:{value:new t.Vector3(r.lamps[0].az,r.lamps[0].el,r.lamps[0].spread)},uLampCol:{value:new t.Color(r.lamps[0].color).multiplyScalar(r.lamps[0].soft?.07:0)}},side:t.BackSide,depthWrite:!1,vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
        uniform vec3 uFogCol, uHall, uLamp, uLampCol; uniform float uTime; varying vec3 vD;
        void main(){
          vec3 d = normalize(vD); float el = asin(clamp(d.y, -1.0, 1.0)), az = atan(d.z, abs(d.x) + 1e-4);
          float side = smoothstep(-0.15, 0.5, d.x);
          vec3 col = uFogCol * (1.0 - 0.45 * smoothstep(0.1, 0.9, d.y));
          float e1 = (el - 0.1) / 0.2, e2 = (el - 0.34) / 0.08, a2 = (az - 0.18) / 0.3;
          col += uHall * side * (0.22 * exp(-e1 * e1) + 0.1 * exp(-e2 * e2 - a2 * a2));
          float tiers = 0.0;
          for (int i = 0; i < 3; i++) { float e0 = 0.022 + 0.05 * float(i) + 0.03 * az * az; tiers += (1.0 - smoothstep(0.0, 0.012, abs(el - e0))) * (0.6 + 0.4 * sin(az * 40.0 + float(i))); }
          col += uHall * side * tiers * 0.1 * (0.9 + 0.1 * sin(uTime * 0.5));
          float le = (el - uLamp.y) / 0.2, la = (az - uLamp.x) / (0.25 + uLamp.z);
          col += uLampCol * side * exp(-le * le - la * la);                                  // the work-lights' glow in the haze
          gl_FragColor = vec4(col, 1.0);
        }`}));vt.renderOrder=-5,vt.frustumCulled=!1,f.add(vt),await a.yield();const tt=[];(w==="one"||w==="two")&&tt.push({kind:"fly",...ro(L,y)}),w==="two"&&tt.push({kind:"perch",...ro(L,y)}),tt.forEach(e=>f.add(e.object));const Yt=new t.Vector3(-67+y.range(-1,1),74,150+y.range(-6,6)),vo=new t.Vector3(z.x+8.5,z.y+6,z.z),Bt=150+y.range(-10,10),yo=new t.Vector3(Qe(0,Bt),Ge(0,Bt)-1,Bt),wo=new t.Vector3(Ye[0]-xt[0],0,Me-Ze).normalize(),Pe=Yt.clone(),Zt=new t.Vector3(0,0,-1),yt=new t.Vector3;await a.yield();{const e=Math.round(420*N),o=new Float32Array(e*3),s=new Float32Array(e*4),n=u.fork("spiral");for(let l=0;l<e*4;l++)s[l]=n();const i=new t.BufferGeometry;i.setAttribute("position",new t.BufferAttribute(o,3)),i.setAttribute("aD",new t.BufferAttribute(s,4));const d=new t.ShaderMaterial({uniforms:{uTime:g.uTime,uPtScale:g.uPtScale,uO:L.uPortal,uCol:L.uPortalCol},transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
          attribute vec4 aD; uniform float uTime, uPtScale; uniform vec3 uO; varying float vA;
          void main(){
            float c = fract(aD.x + uTime * 0.05 * (0.6 + aD.w));
            float r = mix(4.0 + 13.0 * aD.y, 0.8, c * c), an = aD.z * 6.2832 + c * (7.0 + 5.0 * aD.w) + uTime * 0.2;
            vec3 p = uO + vec3(r * cos(an), mix(3.0 + 30.0 * aD.z * aD.y, -1.5, c * sqrt(c)), r * sin(an));
            vA = smoothstep(0.0, 0.12, c) * (1.0 - smoothstep(0.93, 1.0, c)) * (0.5 + 0.5 * sin(uTime * 5.0 + aD.x * 90.0)) * (0.4 + 0.6 * c);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = clamp((0.2 + 0.26 * aD.w) * uPtScale / max(-mv.z, 0.1), 1.5, 7.0);
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          uniform vec3 uCol; varying float vA;
          void main(){ float d = length(gl_PointCoord * 2.0 - 1.0); gl_FragColor = vec4(uCol * 2.0 * vA * exp(-d * d * 4.0), 1.0); }`}),k=new t.Points(i,d);k.name="porthole-dust",k.frustumCulled=!1,k.renderOrder=4,f.add(k)}await a.yield();{const o=new t.CylinderGeometry(11.5,8,122,40,1,!0);o.translate(z.x,z.y+122/2-1,z.z);const s=new t.ShaderMaterial({uniforms:{uTime:g.uTime,uPedal:g.uPedal,uCol:{value:new t.Color(r.rays[0]).multiplyScalar(.09+.3*r.rays[1])},uFogD:{value:r.fogD},uY0:{value:z.y-1},uH:{value:122},uAx:{value:new t.Vector2(z.x,z.z)}},transparent:!0,depthWrite:!1,side:t.DoubleSide,blending:t.AdditiveBlending,vertexShader:"varying vec3 vW, vN; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
          uniform vec3 uCol; uniform vec2 uAx; uniform float uTime, uPedal, uFogD, uY0, uH; varying vec3 vW, vN;
          ${_t}
          void main(){
            vec3 D = cameraPosition - vW; float d = max(length(D), 1e-3); vec3 N = normalize(vN);
            float ndv = abs(dot(N, D / d)), body = ndv * ndv * ndv;                             // a column of haze, not a tube: the limbs fade out
            float h = clamp((vW.y - uY0) / uH, 0.0, 1.0);
            float st = 0.5 + 0.5 * wNoise(vec3(N.x * 3.2, vW.y * 0.016 - uTime * 0.05, N.z * 3.2 + uTime * 0.03));
            st *= 0.62 + 0.38 * wNoise(vec3(N.x * 9.0 + 4.0, vW.y * 0.05 + uTime * 0.09, N.z * 9.0));
            float k = smoothstep(0.0, 0.03, h) * (1.0 - smoothstep(0.6, 1.0, h)) * mix(1.25, 0.5, h) * smoothstep(7.0, 30.0, d) * smoothstep(8.0, 36.0, length(cameraPosition.xz - uAx)) * exp(-(d * uFogD) * (d * uFogD));
            gl_FragColor = vec4(uCol * body * st * k * (1.0 + 0.5 * uPedal), 1.0);
          }`}),n=new t.Mesh(o,s);n.name="porthole-shaft",n.frustumCulled=!1,n.renderOrder=3,f.add(n)}let Ue=null;if(tt.length){const o=new Float32Array(600),s=new Float32Array(800);for(let d=0;d<200;d++){const k=y()*6.28,l=y.range(-.6,.9),h=y.range(1,5);s.set([Math.cos(k)*Math.cos(l)*h,Math.sin(l)*h,Math.sin(k)*Math.cos(l)*h,y()],d*4)}const n=new t.BufferGeometry;n.setAttribute("position",new t.BufferAttribute(o,3)),n.setAttribute("aD",new t.BufferAttribute(s,4));const i=new t.ShaderMaterial({uniforms:{uAge:{value:99},uO:{value:new t.Vector3},uTime:g.uTime,uPtScale:g.uPtScale,uCol:{value:new t.Color(H[2])}},transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
          attribute vec4 aD; uniform float uAge, uTime, uPtScale; uniform vec3 uO; varying float vA;
          void main(){
            float a = max(uAge, 0.0);
            vec3 p = uO + aD.xyz * (1.0 - exp(-a * 1.6)) * 2.2 + vec3(0.0, -0.9 * a - 0.12 * a * a, 0.0) + 0.5 * vec3(sin(uTime * 1.3 + aD.w * 40.0), 0.0, cos(uTime * 1.1 + aD.w * 23.0));
            vA = step(0.001, uAge) * smoothstep(0.0, 0.2, a) * (1.0 - smoothstep(3.0, 7.0, a)) * (0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * 9.0 + aD.w * 80.0), 4.0));
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = clamp(0.14 * uPtScale / max(-mv.z, 0.1), 1.5, 7.0);
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          uniform vec3 uCol; varying float vA;
          void main(){ float d = length(gl_PointCoord * 2.0 - 1.0); gl_FragColor = vec4(uCol * 1.2 * vA * exp(-d * d * 4.0), 1.0); }`});Ue=new t.Points(n,i),Ue.frustumCulled=!1,Ue.renderOrder=4,f.add(Ue)}await a.yield();let K=null;if(v){const e=_e.find(U=>U.key===4),o=10.32,s=rt(o),n=Be.pointAt(s).z-55,i=je((n-e.az)/(e.bz-e.az),.15,.8),d=new t.Vector3(e.ax,e.ay,e.az),k=new t.Vector3(e.bx,e.by,e.bz),l=k.clone().sub(d),h=l.length();l.normalize();const W=new t.Vector3(l.z,0,-l.x).normalize(),te=96,ce=new t.BufferGeometry,b=new Float32Array((te+1)*6),x=new Float32Array((te+1)*4),_=[];for(let U=0;U<te;U++){const ze=U*2;_.push(ze,ze+1,ze+2,ze+1,ze+3,ze+2)}for(let U=0;U<=te;U++)x.set([U/te,-1,U/te,1],U*4);ce.setAttribute("position",new t.BufferAttribute(b,3)),ce.setAttribute("aSV",new t.BufferAttribute(x,2)),ce.setIndex(_);const E=new t.ShaderMaterial({uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),uKeyCol:g.uKeyCol,uFillCol:g.uFillCol,uAmbCol:g.uAmbCol,uCopper:A.parts.strings.material.uniforms.uCopper,uLen:{value:(1-i)*h},uGlint:{value:0}},fog:!0,side:t.DoubleSide,vertexShader:`
          #include <common>
          #include <fog_pars_vertex>
          attribute vec2 aSV; varying vec2 vSV;
          void main(){ vSV = aSV; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          #include <common>
          #include <fog_pars_fragment>
          uniform vec3 uKeyCol, uFillCol, uAmbCol, uCopper; uniform float uLen, uGlint; varying vec2 vSV;
          void main(){
            float sl = vSV.x * uLen / 0.6, fs = fwidth(sl), nx = clamp(vSV.y, -1.0, 1.0), cyl = sqrt(max(1.0 - nx * nx, 0.0)), hx = (nx - 0.35) / 0.13;
            vec3 base = uCopper * 0.5 * mix(0.5 + 0.5 * (0.5 + 0.5 * sin(6.2832 * sl)), 0.76, clamp(fs * 2.5, 0.0, 1.0));      // the copper winding
            vec3 col = base * (uAmbCol * 1.2 + uKeyCol * 0.6 * cyl + uFillCol * 0.9 * (0.5 - 0.5 * nx)) + uKeyCol * exp(-hx * hx) * (0.3 + 3.0 * uGlint) + uCopper * uGlint * 1.5 * cyl;
            gl_FragColor = vec4(col, 1.0);
            #include <fog_fragment>
          }`}),oe=new t.Mesh(ce,E);oe.frustumCulled=!1,f.add(oe);const $=Math.round(4e3*N),O=new Float32Array($*3),ae=new Float32Array($*3);for(let U=0;U<$;U++){const ze=C();O.set([D(e.ax,e.bx,ze)+C.range(-1,1),D(e.ay,e.by,ze),D(e.az,e.bz,ze)],U*3),ae.set([Math.abs(ze-i)*h/150,C(),C()],U*3)}const Z=new t.BufferGeometry;Z.setAttribute("position",new t.BufferAttribute(O,3)),Z.setAttribute("aD",new t.BufferAttribute(ae,3));const Te=new t.ShaderMaterial({uniforms:{uTau:{value:-1},uTime:g.uTime,uPtScale:g.uPtScale,uCol:{value:new t.Color(H[2])}},transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,vertexShader:`
          attribute vec3 aD; uniform float uTau, uTime, uPtScale; varying float vA;
          void main(){
            float a = max(uTau - aD.x, 0.0);
            vec3 p = position; p.y += (2.0 + 14.0 * aD.y * aD.y) * (1.0 - exp(-a * 2.2)) - 0.5 * a;
            p.x += (aD.z - 0.5) * 5.0 * (1.0 - exp(-a)) + 0.4 * sin(uTime * 0.7 + aD.y * 60.0);
            vA = step(0.001, uTau - aD.x) * smoothstep(0.0, 0.2, a) * (1.0 - smoothstep(3.0, 9.0, a)) * (0.4 + 0.6 * aD.z);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = clamp((0.25 + 0.35 * aD.z) * uPtScale / max(-mv.z, 0.1), 1.5, 10.0);
            gl_Position = projectionMatrix * mv;
          }`,fragmentShader:`
          uniform vec3 uCol; varying float vA;
          void main(){ float d = length(gl_PointCoord * 2.0 - 1.0); gl_FragColor = vec4(uCol * 0.35 * vA * exp(-d * d * 4.0), 1.0); }`}),De=new t.Points(Z,Te);De.frustumCulled=!1,De.renderOrder=4,f.add(De),K={e,T_SNAP:o,tb:i,Av:d,Bv:k,dirS:l,len:h,side:W,N:te,wp:b,wg:ce,whip:oe,whipMat:E,dm:Te,broken:!1,shown:!1}}await a.yield();const go=A.envTexture.image.data,Qt=A.pedalTimes||[15,30],qt=A.parts.strings.material.uniforms,bo=qt.uGlow.value,be=new t.Vector3,wt=new t.Vector3,ke=new t.Vector3,gt=new t.Vector3,xo=new t.Vector3(0,-1,0);let Jt=-1,bt=0,eo=-1,to=0;const oo=(e,o,s)=>{const n=R(0,2.6,o),i=(1-K.tb)*K.len*(1-.7*n),d=(1-Math.exp(-o*5))*Math.exp(-o*.5),k=e*(9+12*n)+17.5*(1-Math.exp(-o*.4)),l=4.4*e*e*d,h=R(2,6,o),W=3.6*Math.sin(Math.min(o,2)/2*Math.PI);return s.copy(K.Bv).addScaledVector(K.dirS,-i*e).addScaledVector(K.side,l*Math.cos(k)+1.3*e*h*Math.sin(e*8+1)),s.y=D(s.y+l*Math.sin(k)+e*e*W,D(K.e.by,46.9,R(0,.12,e)),h*R(0,.1,e)),s};function So(e,o,s,n=0){Oe.value=o,s.getWorldPosition(gt);const i=R(0,.02,n);n===eo&&n>.004?bt=(bt+Math.max(0,Math.min(2,o-to)))%2.4:bt=0,eo=n,to=o;const d=o%2.6,k=R(0,.25,d)*(1-R(2.2,2.58,d)),l=Math.max(.05,D(.3+d,St(n)+bt,i));qt.uGlow.value=bo*D(1.5*k,1,i),A.setProgress(l/40),A.update(e,o,s);let h=0;for(let b=0;b<26;b++)h+=go[b*4+1];Ut.uniforms.uTremble.value=Math.min(1,h*.35+g.uPedal.value*.5),ht.object.position.copy(gt),vt.position.copy(gt),ht.uniforms.uTime.value=o,ht.uniforms.uPtScale.value=g.uPtScale.value,dt.setPosition(0,14+3.2*Math.sin(o*1.2566),120+.5*Math.cos(o*2.513),-150),g.uLampP.value.set(14+3.2*Math.sin(o*1.2566),120+.5*Math.cos(o*2.513),-150);for(let b=0;b<Nt.length;b++){const x=Nt[b],_=o*x.sp/x.span+x.ph,E=Math.floor(_*5),oe=(E+R(.15,.7,_*5-E))/5,$=Math.abs(oe%2-1),O=oe%2<1?-1:1,ae=x.z0+x.span*$,Z=x.x+.35*Math.sin(o*2.1+b);x.m.position.set(Z,40.22,ae),x.m.rotation.y=(O>0?0:Math.PI)+.16*Math.sin(o*13+b*2),dt.setPosition(b+1,Z,40.9,ae)}Le.update(e,o,s);let W=0,te=-1,ce=-1;for(let b=0;b<Qt.length;b++){const x=l-Qt[b];W=Math.max(W,R(0,.3,x)*(1-R(1.4,3.6,x))),x>0&&x<8&&(te=x,ce=b)}for(const b of tt)if(b.kind==="fly"){const x=R(Y-.03,de+.04,n),_=o*.4+b.phase,E=1-x;yt.copy(Yt).lerp(vo,x),Pe.set(yt.x+D(10*Math.cos(_),3*Math.sin(2*_),x),yt.y+2*Math.sin(_*.7)*E,yt.z+D(10,7,x)*Math.sin(_)),Pe.x+=W*2.2*Math.sin(o*9.1)*E,Pe.y+=(W*1.6*Math.sin(o*12.3+1)+.5*Math.sin(o*5.2))*(.3+.7*E),Pe.z+=W*2.2*Math.cos(o*7.7)*E,Zt.set(D(-10*Math.sin(_),6*Math.cos(2*_),x),(.2*Math.cos(_*.7)+W*.4*Math.sin(o*11))*E*8,D(10,7,x)*Math.cos(_)).normalize(),b.set(Pe,Zt,D(.2,.35,x)+.85*E*Math.sin(o*6.2832*3.1*(1+.8*W))+.25*x*Math.sin(o*6.2832*1.5)),b.mat.uniforms.uSelfLit.value=D(.14,.42,x),dt.setSize(3,D(6.5,4.5,x)),dt.setPosition(3,Pe.x,Pe.y+.4,Pe.z)}else be.copy(yo),be.y-=W*.5*Math.abs(Math.sin(o*15)),b.set(be,wo,.75-.7*(.5+.5*Math.sin(o*6.2832+b.phase))+W*.25*Math.sin(o*40),xo);if(Ue){const b=Ue.material.uniforms;te>0&&(te<.25||Jt!==ce)&&(b.uO.value.copy(Pe),Jt=ce),b.uAge.value=te}if(K){const b=l-K.T_SNAP,x=n>.004&&b>=0,_=K.e;if(x!==K.broken&&(K.broken=x,x?he.setXYZ(_.i,_.ax+K.dirS.x*.05,_.ay,_.az+K.dirS.z*.05):he.setXYZ(_.i,_.bx,_.by,_.bz),he.needsUpdate=!0),!x&&K.shown&&(K.wp.fill(0),K.wg.attributes.position.needsUpdate=!0),K.shown=x,K.dm.uniforms.uTau.value=x?b:-1,x){const E=K.N,oe=K.wp;K.whipMat.uniforms.uGlint.value=R(0,.04,b)*(1-R(.08,.3,b)+.22*Math.exp(-b*1.1));for(let $=0;$<=E;$++){const O=$/E;oo(O,b,be),oo(Math.min(1,O+1/E),b,wt),wt.sub(be),$===E&&wt.copy(K.dirS).negate();const ae=.55*(1-R(.7,1,O));ke.copy(gt).sub(be).cross(wt);const Z=ke.length();ke.multiplyScalar(ae/Math.max(Z,1e-4)),oe[$*6]=be.x-ke.x,oe[$*6+1]=be.y-ke.y,oe[$*6+2]=be.z-ke.z,oe[$*6+3]=be.x+ke.x,oe[$*6+4]=be.y+ke.y,oe[$*6+5]=be.z+ke.z}K.wg.attributes.position.needsUpdate=!0}}}return{scene:f,path:Be,duration:it,pace:e=>D(D(1.4,.72,R(se-.1,se+.02,e)),.95,R(Y-.06,Y,e)),title:{spot:"Hall of Strings",rehearsal:"Hall of Strings: Rehearsal",moon:"Hall of Strings by Moonlight"}[B],ride:"none",style:"none",camera:{fov:62,near:.3,far:4e3,lookAhead:22,sway:.8,bank:.25},pois:[{at:[-70,46,215],from:0,to:ie[2]+.02,weight:.6,fade:.3},{at:[-72,47,172],from:ie[2]-.03,to:ie[4]+.01,weight:.8,fade:.3},{at:[-98,44,4],from:ie[4]-.04,to:se-.02,weight:.7,fade:.3},{at:V.canyonLook.clone().add(new t.Vector3(0,4,12)),from:se-.07,to:Y+.02,weight:.96,fade:.2},{at:V.portalSeat.position,from:Y-.12,to:1,weight:.9,fade:.3}],portal:{shape:"circle",radius:7,color:r.portal,glow:.5,tilt:!0,revealDistance:260},post:{exposure:r.exposure,bloom:{strength:.65,radius:.6,threshold:.9},grade:{saturation:r.sat,contrast:1.05,tint:r.tint,shadowTint:r.shadow,vignette:.34,grain:.03,aberration:0}},update:So,dispose(){A.dispose()}}}};export{Vo as default};
