import*as t from"three";import{clamp as ue,lerp as G,smoothstep as X}from"../kit/core.js";const Fe=["#1a2a5a","#e8c79a","#f6e9d2","#c9743a","#7a3a2a","#2a1a2a","#6fffe0"],O=Math.PI*2,U=800,q=150,ve=55,we=250,be=200,oe=1180;function ne(a){const m=12*Math.exp(-Math.pow((a-U-40)/60,2)),s=-ve*X(U+40,U-110,a),i=ue((U-75-a)/(U-75-q),0,1),w=-(we-ve)*Math.pow(i,1.5),g=X(q+20,q-60,a),M=-be*g-40*(1-X(0,q,a))*g;return m+s+w+M}const de=`
#define TAU 6.28318530718
const float RIM = ${U.toFixed(1)}, WELL = ${q.toFixed(1)}, CLIFF = ${ve.toFixed(1)};
const float DEPTH = ${we.toFixed(1)}, WELL_DEPTH = ${be.toFixed(1)}, R_OUT = ${oe.toFixed(1)};
const float LN_OUT = ${Math.log(oe).toFixed(5)}, DL = 0.4;
uniform sampler2D uNoise;
uniform float uTime, uSpin, uArms, uTwist, uWRim;
float eyeProfile(float r) {
  float q = (r - RIM - 40.) / 60.;
  float lip = 12. * exp(-q * q);
  float cliff = -CLIFF * smoothstep(RIM + 40., RIM - 110., r);
  float t = clamp((RIM - 75. - r) / (RIM - 75. - WELL), 0., 1.);
  float fun = -(DEPTH - CLIFF) * t * sqrt(t);
  float w = smoothstep(WELL + 20., WELL - 60., r);
  float well = -WELL_DEPTH * w - 40. * (1. - smoothstep(0., WELL, r)) * w;
  return lip + cliff + fun + well;
}
// angular velocity of the vortex at radius r (rad/s): rim = one turn per 90 s, faster inward, still outside
float eyeOmega(float r) {
  return uWRim * pow(RIM / clamp(r, 60., RIM), 0.6) * (1. - smoothstep(RIM + 20., R_OUT - 40., r));
}
float hash1(float n) { return fract(sin(n * 127.1 + 3.7) * 43758.5453); }
// Differential rotation without wind-up: the disc is a stack of rigidly rotating log-spaced rings,
// each sampling the same spiral-warped noise at its own angle; neighbours cross-fade by radius.
vec4 swirl(float r, float th, float m, float k, float c, vec2 gx, vec2 gy) {
  float lr = log(max(r, 12.));
  float L = max((LN_OUT - lr) / DL, 0.);
  float i = floor(L), f = fract(L);
  f = f * f * (3. - 2. * f);
  float r0 = R_OUT * exp(-DL * i), r1 = R_OUT * exp(-DL * (i + 1.));
  float a0 = fract(eyeOmega(r0) * uTime / TAU), a1 = fract(eyeOmega(r1) * uTime / TAU);
  float u = (th + uSpin * k * lr) / TAU;
  vec2 uv0 = vec2((u - uSpin * a0) * m + hash1(i), lr * c + hash1(i + 7.3));
  vec2 uv1 = vec2((u - uSpin * a1) * m + hash1(i + 1.), lr * c + hash1(i + 8.3));
  vec4 s = mix(NTEX(uv0, gx, gy), NTEX(uv1, gx, gy), f);
  return (s - 0.5) / sqrt(f * f + (1. - f) * (1. - f)) + 0.5;
}
float reliefAmp(float r) {
  float a = clamp(r * 0.05, 5., 38.);
  a *= mix(0.45, 1., smoothstep(WELL - 70., WELL + 60., r));       // calmer inside the well
  a *= mix(1., 0.32, smoothstep(RIM + 30., R_OUT - 80., r));              // flattening into the deck
  return a;
}
// relief in metres above the base profile, plus the raw fields for colouring
float eyeRelief(float r, float th, vec2 g1x, vec2 g1y, vec2 g2x, vec2 g2y, out vec4 A, out vec4 B) {
  A = swirl(r, th, uArms, uTwist, uArms / TAU / 5.0, g1x, g1y);
  B = swirl(r, th, uArms * 3., uTwist * 0.85, uArms * 3. / TAU / 2.2, g2x, g2y);
  float h = (A.r - 0.5) * 1.5 + (B.g - 0.45) * 0.9;
  return h * reliefAmp(r);
}
`;async function Ie(a,m,s=256){const i=[{p:4,oct:5,mode:0},{p:6,oct:4,mode:1},{p:16,oct:4,mode:0},{p:5,oct:4,mode:2}],w=new Uint8Array(s*s*4),g=new Float32Array(s*s),M=[];for(let v=0;v<4;v++){g.fill(0);const{p:y,oct:F,mode:d}=i[v];let h=1;for(let e=0;e<F;e++){const o=y<<e;if(o>s/2)break;const n=new Float32Array(o*o);for(let r=0;r<n.length;r++)n[r]=a();const S=o/s;for(let r=0;r<s;r++){r%16===0&&await m.yield?.();const B=r*S,_=Math.floor(B),P=B-_,b=P*P*(3-2*P),I=_%o*o,C=(_+1)%o*o;for(let L=0;L<s;L++){const E=L*S,N=Math.floor(E),z=E-N,D=z*z*(3-2*z),k=N%o,K=(N+1)%o;let Y=G(G(n[I+k],n[I+K],D),G(n[C+k],n[C+K],D),b);d===1?Y=Math.abs(Y*2-1):d===2&&(Y=1-Math.abs(Y*2-1),Y*=Y),g[r*s+L]+=Y*h}}h*=.5,await m.yield?.()}let f=1/0,l=-1/0;for(let e=0;e<g.length;e++)e%8192===0&&await m.yield?.(),g[e]<f&&(f=g[e]),g[e]>l&&(l=g[e]);const p=255/(l-f),u=new Float32Array(g.length);for(let e=0;e<g.length;e++)e%8192===0&&await m.yield?.(),w[e*4+v]=(g[e]-f)*p,u[e]=(g[e]-f)/(l-f);M.push(u)}const A=new t.DataTexture(w,s,s,t.RGBAFormat);return A.wrapS=A.wrapT=t.RepeatWrapping,A.magFilter=t.LinearFilter,A.minFilter=t.LinearMipmapLinearFilter,A.generateMipmaps=!0,A.anisotropy=1,A.needsUpdate=!0,{tex:A,floats:M,size:s}}async function Me(a,m,s,i,w){const g=i*i,M=new Float32Array(g),A=new Float32Array(g);let v=1e-6;const y=i/(2*w);for(let f=0;f<i;f++){f%16===0&&await a.yield?.();const l=(f-w+i)%i*i,p=(f+w)%i*i,u=f*i;for(let e=0;e<i;e++){const o=(e-w+i)%i,n=(e+w)%i,S=(m[u+n]-m[u+o])*y,r=(m[p+e]-m[l+e])*y;M[u+e]=S,A[u+e]=r,Math.abs(S)>v&&(v=Math.abs(S)),Math.abs(r)>v&&(v=Math.abs(r))}}const F=v*.75,d=new Uint8Array(g*4);for(let f=0;f<g;f++)f%4096===0&&await a.yield?.(),d[f*4]=m[f]*255,d[f*4+1]=ue(127.5+127.5*M[f]/F,0,255),d[f*4+2]=ue(127.5+127.5*A[f]/F,0,255),d[f*4+3]=s[f]*255;const h=new t.DataTexture(d,i,i,t.RGBAFormat);return h.wrapS=h.wrapT=t.RepeatWrapping,h.magFilter=t.LinearFilter,h.minFilter=t.LinearMipmapLinearFilter,h.generateMipmaps=!0,h.needsUpdate=!0,{tex:h,scale:F}}const ie=(a,m,s)=>{const i=Math.sin(a*127.1+m*311.7+s*74.7)*43758.5453;return i-Math.floor(i)},Re=a=>new t.Color(a),se=()=>t.UniformsUtils.clone(t.UniformsLib.fog);async function Pe(a,m){const i=[],w=(l,p,u,e=1)=>{for(let o=0;o<u;o++)i.push(l+(p-l)*Math.pow(o/u,e))};w(5,q-30,9),w(q-30,q+30,8),w(q+30,U-90,58),w(U-90,U+40,17),w(U+40,oe,20,1.15),i.push(oe);const g=i.length,M=353,A=new Float32Array(g*M*3),v=new Float32Array(g*M*2);for(let l=0;l<g;l++)for(let p=0;p<M;p++){p===0&&l%8===0&&await m.yield?.();const u=i[l],e=p/352*O-a.uSpin.value*a.uTwist.value*Math.log(Math.max(u,12)),o=l*M+p;A[o*3]=Math.sin(e)*u,A[o*3+1]=ne(u),A[o*3+2]=Math.cos(e)*u,v[o*2]=u,v[o*2+1]=e}const y=new Uint32Array((g-1)*352*6);let F=0;for(let l=0;l<g-1;l++)for(let p=0;p<352;p++){p===0&&l%16===0&&await m.yield?.();const u=l*M+p,e=u+1,o=u+M,n=o+1;y[F++]=u,y[F++]=o,y[F++]=e,y[F++]=e,y[F++]=o,y[F++]=n}const d=new t.BufferGeometry;d.setAttribute("position",new t.BufferAttribute(A,3)),d.setAttribute("aPolar",new t.BufferAttribute(v,2)),d.setIndex(new t.BufferAttribute(y,1)),d.boundingSphere=new t.Sphere(new t.Vector3(0,-200,0),oe+120);const h=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:{...a,...se()},vertexShader:`
      #define NTEX(uv, gx, gy) textureLod(uNoise, uv, gx.x)
      ${de}
      attribute vec2 aPolar; uniform float uApronCut;
      varying vec2 vPolar; varying vec3 vWorld;
      #include <fog_pars_vertex>
      void main() {
        float r = aPolar.x, th = aPolar.y;
        vec4 A, B;
        float h = eyeProfile(r) + eyeRelief(r, th, vec2(3.5), vec2(0.), vec2(4.7), vec2(0.), A, B);   // blurrier than the grid can resolve: no faceted crests
        h -= 95. * smoothstep(uApronCut - 52., uApronCut + 4., r);     // the cut edge curls down into the world's collar cloud: never a floating razor edge
        vec3 p = vec3(sin(th) * r, h, cos(th) * r);
        vPolar = aPolar;
        vWorld = (modelMatrix * vec4(p, 1.)).xyz;
        vec4 mvPosition = viewMatrix * vec4(vWorld, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      #define NTEX(uv, gx, gy) texture2D(uNoise, uv)
      ${de}
      uniform sampler2D uTexA, uTexB;      // (height, dH/du, dH/dv, spare): A = band fbm + ridged, B = billow + fine fbm
      uniform vec2 uGradScale;
      uniform vec3 uSunDir, uSunCol, uIndigo, uTan, uCream, uRust, uRustDark, uPlum, uBoltCol;
      uniform vec4 uFlash[3];
      uniform mat4 uInvModel; uniform float uApronCut; uniform vec3 uWell;
      varying vec2 vPolar; varying vec3 vWorld;
      #include <fog_pars_fragment>
      // fragment fast path: ring parameters once per pixel, one fetch per ring returns height AND its gradient
      float gF, gNorm, gA0, gA1; vec4 gH;
      void ringSetup(float lr) {
        float L = max((LN_OUT - lr) / DL, 0.);
        float i = floor(L);
        gF = fract(L); gF = gF * gF * (3. - 2. * gF);
        gNorm = sqrt(gF * gF + (1. - gF) * (1. - gF));
        float r0 = R_OUT * exp(-DL * i), r1 = r0 * exp(-DL);
        gA0 = fract(eyeOmega(r0) * uTime / TAU); gA1 = fract(eyeOmega(r1) * uTime / TAU);
        gH = vec4(hash1(i), hash1(i + 7.3), hash1(i + 1.), hash1(i + 8.3));
      }
      vec4 swirlT(sampler2D tex, float lr, float th, float m, float k, float c, float lod) {
        float u = (th + uSpin * k * lr) / TAU;
        vec2 uv0 = vec2((u - uSpin * gA0) * m + gH.x, lr * c + gH.y);
        vec2 uv1 = vec2((u - uSpin * gA1) * m + gH.z, lr * c + gH.w);
        return mix(textureLod(tex, uv0, lod), textureLod(tex, uv1, lod), gF);
      }
      float lodOf(vec2 uv) {
        vec2 dx = dFdx(uv), dy = dFdy(uv);
        return max(0., 0.5 * log2(max(dot(dx, dx), dot(dy, dy)) * 65536. + 1e-12));
      }
      void main() {
        float r = vPolar.x, th = vPolar.y, lr = log(max(r, 12.));
        float mA = uArms, kA = uTwist, cA = uArms / TAU / 5.0;
        float mB = uArms * 3., kB = uTwist * 0.85, cB = uArms * 3. / TAU / 2.2;
        float mC = uArms * 9., kC = uTwist * 0.7, cC = uArms * 9. / TAU / 1.6;
        // mip levels from the continuous coordinates (the per-ring offsets would break the derivatives)
        float lodA = lodOf(vec2((th + uSpin * kA * lr) / TAU * mA, lr * cA));
        float lodB = lodOf(vec2((th + uSpin * kB * lr) / TAU * mB, lr * cB));
        float lodC = lodOf(vec2((th + uSpin * kC * lr) / TAU * mC, lr * cC));
        ringSetup(lr);
        vec4 sa = swirlT(uTexA, lr, th, mA, kA, cA, lodA);
        vec4 sb = swirlT(uTexB, lr, th, mB, kB, cB, lodB);
        vec4 sc = swirlT(uTexB, lr, th, mC, kC, cC, lodC);
        // same channel layout the shading below was written for: A.r bands, A.a ridged, B.g billow, C.g billow, C.b fine
        vec4 A = vec4((sa.r - 0.5) / gNorm + 0.5, 0., 0., (sa.a - 0.5) / gNorm + 0.5);
        vec4 B = vec4(0., (sb.r - 0.5) / gNorm + 0.5, 0., 0.);
        vec4 C = vec4(0., (sc.r - 0.5) / gNorm + 0.5, (sc.a - 0.5) / gNorm + 0.5, 0.);
        // analytic normal: chain rule from texture gradients to (radius, angle)
        vec2 gA = (sa.gb * 2. - 1.) * (uGradScale.x / gNorm);
        vec2 gB = (sb.gb * 2. - 1.) * (uGradScale.y / gNorm);
        float amp = reliefAmp(r);
        float dAth = gA.x * mA / TAU, dAlr = gA.x * uSpin * kA * mA / TAU + gA.y * cA;
        float dBth = gB.x * mB / TAU, dBlr = gB.x * uSpin * kB * mB / TAU + gB.y * cB;
        float dHth = amp * (1.5 * dAth + 0.9 * dBth) / r;
        float dHr = amp * (1.5 * dAlr + 0.9 * dBlr) / r;
        float dPr = (eyeProfile(r + 2.) - eyeProfile(r - 2.)) * 0.25;
        vec3 er = vec3(sin(th), 0., cos(th)), et = vec3(cos(th), 0., -sin(th));
        float apron = smoothstep(RIM + 30., R_OUT - 80., r);
        float bs = mix(mix(0.9, 1.35, smoothstep(230., 600., r)), 3.4, apron);   // the flattened apron keeps its billow in the shading
        vec3 N = normalize(vec3(0., 1., 0.) - er * (dPr + dHr * bs) - et * (dHth * bs));
        N = normalize(N + (er * (C.b - 0.5) + et * (C.g - 0.5)) * 0.3);

        // ragged outer edge: the feeder arms dissolve into the deck
        float edge = (r - (RIM + 45.)) / (R_OUT - RIM - 140.);
        float thr = A.r * 0.8 + B.g * 0.45 + (C.b - 0.5) * 0.5 - 0.08;
                if (edge > thr || r > uApronCut) discard;
        float thin = smoothstep(0.16, 0., thr - edge);              // cloud thins toward its torn edge

        float hN = clamp((A.r - 0.5) * 1.5 + (B.g - 0.45) * 0.9, -1., 1.) * 0.5 + 0.5;
        float ao = smoothstep(0.08, 0.72, hN);

        // band colour: cream crests, tan flanks, rust lanes, more rust toward the well
        float bz = A.a * 0.8 + (A.r - 0.5) * 0.4 + (C.b - 0.5) * 0.16 + 0.06;
        bz -= smoothstep(520., 170., r) * 0.2;
        bz += smoothstep(RIM - 120., RIM + 80., r) * 0.22;
        float rimK = smoothstep(RIM - 75., RIM - 5., r);            // the cliff and its crest are plain cream: no hard band edge on the silhouette
        bz = mix(bz, max(bz, 0.7), rimK);
        vec3 alb = mix(uRust, uTan, smoothstep(0.22, 0.46, bz));
        alb = mix(alb, uCream, smoothstep(0.44, 0.66, bz));
        alb = mix(alb, uRustDark, (1. - smoothstep(0.08, 0.3, hN)) * 0.4 * (1. - 0.8 * rimK));
        alb *= mix(0.76, 1.0, C.b) * 0.86;

        vec3 sunL = normalize(uSunDir);
        float ndl = dot(N, sunL);
        float lit = smoothstep(-0.12, 0.36, ndl);
        float y = (uInvModel * vec4(vWorld, 1.)).y;
        float sunReach = 1. - smoothstep(-200., -292., y);
        // the bowl's own terminator: the wall under the sun-side rim sits in shade
        float macro = dot(normalize(vec3(0., 1., 0.) - er * dPr * 1.7), sunL);
        lit *= mix(0.12, 1., smoothstep(0.3, 0.68, macro));
        lit *= sunReach * mix(0.5, 1., ao) * mix(1., mix(0.72, 1.04, smoothstep(0.15, 0.7, B.g)), apron);
        vec3 shade = mix(uPlum * 0.85, mix(uRustDark, uRust, 0.3) * 0.62, ao);
        shade += uIndigo * 0.2 * clamp(N.y, 0., 1.);
        vec3 col = alb * uSunCol * lit + shade * (1. - lit * 0.8) * (0.55 + 0.6 * alb.r);
        col += uRust * (lit * (1. - lit)) * 0.5;                    // warm bleed along the terminator

        col = mix(col, mix(uRust, uTan, 0.45) * 0.42, thin * 0.6);
        // depth: funnel falls to indigo, the well to violet-black
        float dz = smoothstep(-165., -300., y);
        col = mix(col, uIndigo * (0.9 + 0.7 * ao) + col * 0.3, dz * 0.75);
        float wz = smoothstep(-250., -390., y);
        col = mix(col, uWell * (0.6 + ao), wz);

        // lightning: slot 0 is the well bolt, 1 and 2 are sheet flashes inside the bands
        vec3 lp = (uInvModel * vec4(vWorld, 1.)).xyz;
        for (int i = 0; i < 3; i++) {
          vec3 d = uFlash[i].xyz - lp;
          float dist = length(d);
          float R = i == 0 ? 130. : 75.;
          float blot = mix(0.5, 1., B.g) * mix(0.65, 1., A.r);
          float wrap = clamp(dot(N, d / max(dist, 1.)) * 0.5 + 0.65, 0., 1.);
          col += uBoltCol * (uFlash[i].w * exp(-dist / R) * blot * wrap * (i == 0 ? 3.6 : 3.0));
        }
        if (!gl_FrontFacing) col = mix(uPlum, uRustDark, 0.45) * (0.45 + 0.6 * ao);     // underside, only ever seen from outside
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),f=new t.Mesh(d,h);return f.name="eye",f}function Be(a){const m=[{y:-335,r:150,a:.9,li:1},{y:-272,r:168,a:.55,li:0}],s=[],i=[],w=[],g=[],M=64,A=10;m.forEach(d=>{const h=d.li,f=s.length/3;for(let l=0;l<=A;l++)for(let p=0;p<=M;p++){const u=l/A*d.r,e=p/M*O;s.push(Math.sin(e)*u,d.y,Math.cos(e)*u),i.push(u/d.r,e),w.push(h,d.a)}for(let l=0;l<A;l++)for(let p=0;p<M;p++){const u=f+l*(M+1)+p,e=u+1,o=u+M+1,n=o+1;g.push(u,o,e,e,o,n)}});const v=new t.BufferGeometry;v.setAttribute("position",new t.Float32BufferAttribute(s,3)),v.setAttribute("aRT",new t.Float32BufferAttribute(i,2)),v.setAttribute("aLayer",new t.Float32BufferAttribute(w,2)),v.setIndex(g);const y=new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...a,...se()},vertexShader:`
      attribute vec2 aRT, aLayer;
      varying vec2 vRT, vLayer; varying vec3 vLocal;
      #include <fog_pars_vertex>
      void main() {
        vRT = aRT; vLayer = aLayer; vLocal = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D uNoise; uniform float uTime, uSpin;
      uniform vec3 uIndigo, uBoltCol, uWell; uniform vec4 uFlash[3];
      varying vec2 vRT, vLayer; varying vec3 vLocal;
      #include <fog_pars_fragment>
      void main() {
        float rn = vRT.x, th = vRT.y;
        float w = 0.24 + vLayer.x * 0.1;
        float lr = log(rn * 6. + 0.4);
        vec2 gx = dFdx(vec2(th / 6.2832 * 3., lr * 0.5)), gy = dFdy(vec2(th / 6.2832 * 3., lr * 0.5));
        gx = clamp(gx, -0.05, 0.05); gy = clamp(gy, -0.05, 0.05);
        float sp = (th + uSpin * 2.6 * lr) / 6.2832;
        vec4 n1 = textureGrad(uNoise, vec2((sp - uSpin * fract(uTime * w / 6.2832)) * 3. + vLayer.x * 0.37, lr * 0.5), gx, gy);
        vec4 n2 = textureGrad(uNoise, vec2((sp - uSpin * fract(uTime * w * 1.7 / 6.2832)) * 6. + 0.5, lr * 1.1 + 0.3), gx * 2., gy * 2.);
        float dens = n1.r * 0.65 + n2.g * 0.5;
        float alpha = smoothstep(0.28, 0.85, dens + (1. - vLayer.x) * -0.08 + vLayer.x * 0.3);
        alpha *= (1. - smoothstep(0.62, 1.0, rn)) * vLayer.y;
        vec3 violet = uWell * 2.4, deep = uWell * 0.42;
        vec3 col = mix(deep, mix(violet, uIndigo * 0.5, n2.g * 0.6), smoothstep(0.35, 0.9, dens));
        col *= mix(1.0, 0.45, vLayer.x);
        col += uWell * 5.2 * pow(1. - rn, 2.) * (0.55 + 0.45 * sin(uTime * 0.7 + lr * 3.)) * 0.6;   // faint violet heart
        vec3 d = uFlash[0].xyz - vLocal;
        float fall = exp(-length(d.xz) / 85.);
        col += uBoltCol * uFlash[0].w * fall * (0.35 + dens * dens * 1.6) * 4.0;
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`}),F=new t.Mesh(v,y);return F.name="well-mist",F.renderOrder=2,F}const Ce=`
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float fogK = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float fogK = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    gl_FragColor.rgb *= 1.0 - fogK;
  #endif`;function _e(a,m,s=6){const i=[],w=[],g=[],M=[],A=new t.Vector3(0,1,0),v=new t.Vector3,y=new t.Vector3,F=new t.Vector3,d=(p,u,e,o)=>{for(let n=0;n<p.length-1;n++){const S=p[n],r=p[n+1];v.subVectors(r,S).normalize(),y.crossVectors(v,Math.abs(v.y)>.9?new t.Vector3(1,0,0):A).normalize(),F.crossVectors(v,y).normalize();const B=n/(p.length-1),_=(n+1)/(p.length-1);for(const P of[y,F]){const b=i.length/3,I=G(u,e,B),C=G(u,e,_);i.push(S.x-P.x*I,S.y-P.y*I,S.z-P.z*I,S.x+P.x*I,S.y+P.y*I,S.z+P.z*I,r.x-P.x*C,r.y-P.y*C,r.z-P.z*C,r.x+P.x*C,r.y+P.y*C,r.z+P.z*C),w.push(o,-1,B,o,1,B,o,-1,_,o,1,_),g.push(b,b+1,b+2,b+1,b+3,b+2)}}};for(let p=0;p<s;p++){let u=p/s*O+a.range(-.4,.4);const e=[];let o=a.range(8,60),n=-455;const S=q-6,r=-258,B=11;for(let I=0;I<=B;I++){const C=I/B,L=G(o,S,Math.pow(C,1.6)),E=G(n,r,C),N=I===0||I===B?0:1;u+=a.range(-.12,.12)*N,e.push(new t.Vector3(Math.sin(u)*L+a.range(-9,9)*N,E+a.range(-6,6)*N,Math.cos(u)*L+a.range(-9,9)*N))}const _=a.range(240,360),P=a.int(9,13);for(let I=1;I<=P;I++){const C=G(S,_,I/P);u+=a.range(-.11,.11),e.push(new t.Vector3(Math.sin(u)*C,ne(C)+a.range(8,17),Math.cos(u)*C))}d(e,3.2,1.6,p),M.push(e[B-2].clone().lerp(e[B+1],.5));const b=a.int(3,5);for(let I=0;I<b;I++){const C=a.int(3,e.length-3),L=[e[C].clone()],E=new t.Vector3().subVectors(e[C+1],e[C]).normalize();E.applyAxisAngle(A,a.range(.5,1.1)*a.sign());const N=a.int(3,6);for(let z=1;z<=N;z++){const D=L[z-1].clone().addScaledVector(E,a.range(10,18));D.x+=a.range(-5,5),D.z+=a.range(-5,5);const k=Math.hypot(D.x,D.z);D.y=k>q?ne(k)+a.range(7,15):D.y+a.range(-8,4),L.push(D)}d(L,1.5,.5,p)}}const h=new t.BufferGeometry;h.setAttribute("position",new t.Float32BufferAttribute(i,3)),h.setAttribute("aBolt",new t.Float32BufferAttribute(w,3)),h.setIndex(g);const f=new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending,side:t.DoubleSide,uniforms:{...m,...se()},vertexShader:`
      attribute vec3 aBolt; uniform vec2 uStrike; uniform float uTime;
      varying vec2 vB;
      #include <fog_pars_vertex>
      void main() {
        vB = aBolt.yz;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
        if (abs(aBolt.x - uStrike.x) > 0.5 || uStrike.y < 0.02) gl_Position = vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec2 uStrike; uniform vec3 uBoltCol; uniform float uTime;
      varying vec2 vB;
      #include <fog_pars_fragment>
      void main() {
        float core = 1. - abs(vB.x);
        float I = uStrike.y * (0.75 + 0.25 * sin(vB.y * 31. + uTime * 47.));
        vec3 col = mix(uBoltCol, vec3(1.), core * core) * (core * core * I * 9.);
        gl_FragColor = vec4(col, 1.);
        ${Ce}
      }`}),l=new t.Mesh(h,f);return l.name="bolts",l.renderOrder=1,l.frustumCulled=!1,{mesh:l,flashPos:M}}function Le(a,m,s){const i=[],w=[],g=(y,F,d,h,f,l)=>{i.push(y,F,d,h),w.push(a(),l,f,a.range(.75,1))};for(let y=0;y<380;y++){const F=U+a.range(-62,34)+a.gauss()*8,d=a.range(26,54),h=a()*O,f=Math.atan2(Math.sin(h-.15),Math.cos(h-.15));Math.abs(f)<.3||g(F,h,d*a.range(.2,.36)+(F<U-20?6:0),d,a.range(1.1,1.7),0)}for(let y=0;y<170;y++){const F=G(U+90,oe-60,Math.pow(a(),.55)),d=a.range(44,86),h=a()*O,f=Math.atan2(Math.sin(h-.13),Math.cos(h-.13));Math.abs(f)<.34||g(F,h,d*a.range(.06,.16),d*.5,a.range(2.4,3.6),0)}for(let y=0;y<270;y++){const F=a.int(0,4),d=a(),h=G(215,735,Math.sqrt(d))+a.range(-18,18),f=F*O/5-s*Math.log(h/200)+a.gauss()*.14,l=a.range(15,32)*(.6+h/900);g(h,f,a.range(10,30)*(.5+h/800),l,a.range(1.8,3.2),1)}const M=new t.InstancedBufferGeometry;M.setAttribute("position",new t.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),M.setIndex([0,1,2,0,2,3]),M.setAttribute("aP",new t.InstancedBufferAttribute(new Float32Array(i),4)),M.setAttribute("aS",new t.InstancedBufferAttribute(new Float32Array(w),4)),M.instanceCount=i.length/4;const A=new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...m,...se()},vertexShader:`
      #define NTEX(uv, gx, gy) textureLod(uNoise, uv, gx.x)
      ${de}
      attribute vec4 aP, aS;
      uniform vec3 uSunDir;
      varying vec2 vQ; varying vec4 vS; varying vec3 vSunView; varying float vY, vNear;
      #include <fog_pars_vertex>
      void main() {
        float r = aP.x;
        float th = aS.y > 0.5 ? aP.y * uSpin + uSpin * eyeOmega(r) * uTime : aP.y;   // rim billows stay put
        float bob = sin(uTime * 0.31 + aS.x * 40.) * 2.5;
        vec3 c = vec3(sin(th) * r, eyeProfile(r) + aP.z + bob, cos(th) * r);
        vY = c.y;
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
        vNear = smoothstep(25., 110., -mvPosition.z) * mix(0.6, 1., smoothstep(120., 260., -mvPosition.z));    // dissolve rather than fill the screen if the camera comes close
        float breathe = 1. + 0.06 * sin(uTime * 0.23 + aS.x * 17.);
        mvPosition.xy += position.xy * aP.w * breathe * vec2(aS.z, 1.);
        vQ = position.xy; vS = aS;
        vSunView = normalize((viewMatrix * modelMatrix * vec4(uSunDir, 0.)).xyz);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D uNoise; uniform float uTime;
      uniform vec3 uSunCol, uIndigo, uTan, uCream, uRust, uRustDark, uPlum;
      varying vec2 vQ; varying vec4 vS; varying vec3 vSunView; varying float vY, vNear;
      #include <fog_pars_fragment>
      void main() {
        vec2 q = vQ;
        vec2 nuv = q * vec2(0.34, 0.2) + vec2(vS.x * 7.31, vS.x * 3.17) + vec2(uTime * 0.004, 0.);
        vec4 n = texture2D(uNoise, nuv);
        vec4 n2 = texture2D(uNoise, nuv * 2.7 + 0.37);
        float d = length(q);
        float a = 1. - smoothstep(0.06, 0.92, d + (n.g - 0.45) * 1.0 + (n2.b - 0.5) * 0.45);     // edges eaten by the noise
        a *= smoothstep(-0.95, -0.15, q.y + (n.r - 0.5) * 0.5) * vNear;
        if (a < 0.01) discard;
        // a small cumulus, not a smudge: sun-struck cream top and sun side, rust and plum underneath
        vec3 Nv = normalize(vec3(q * 1.0 + (vec2(n.r, n2.g) - 0.5) * 1.1, sqrt(max(0.04, 1. - d * d))));
        float top = smoothstep(-0.6, 0.45, q.y + (n.r - 0.5) * 0.8);
        float lit = smoothstep(-0.2, 0.45, dot(Nv, vSunView)) * mix(0.65, 1., n.g) * mix(0.3, 1., top);
        vec3 alb = uCream * 0.8 * mix(0.86, 1., vS.w);
        vec3 shade = mix(uPlum * 1.3 + uRustDark * 0.4, uRust * 0.5 + uPlum * 0.4, 0.25 + 0.75 * n.g);
        vec3 col = alb * uSunCol * lit + shade * (1. - lit * 0.85) + uRust * lit * (1. - lit) * 0.35;
        float dz = smoothstep(-120., -270., vY);
        col = mix(col, uIndigo * 0.5 + col * 0.25, dz * 0.75);
        gl_FragColor = vec4(col, a * mix(0.9, 0.62, vS.y));
        #include <fog_fragment>
      }`}),v=new t.Mesh(M,A);return v.name="scud",v.renderOrder=3,v.frustumCulled=!1,v}function Ne(a){const w=new Float32Array(4941),g=new Float32Array(1647*2);for(let e=0;e<=26;e++){const o=e/26;let n;if(o<.42){const r=o/.42;n=.4*Math.sqrt(Math.max(0,1-(1-r)*(1-r)))}else{const r=(o-.42)/.58,B=r*r*(3-2*r);n=G(.4,.2,Math.pow(B,.9))+.1*Math.pow(X(.8,1,o),2)}const S=1-o-.03*Math.sin(o*Math.PI);for(let r=0;r<61;r++){const B=r/60*O,_=Math.sin(5*B),P=1-.075*Math.exp(-Math.pow(_/.24,2))*X(.02,.18,o),b=e*61+r,I=n*P;w[b*3]=Math.sin(B)*I,w[b*3+1]=S,w[b*3+2]=Math.cos(B)*I,g[b*2]=r/60,g[b*2+1]=o}}const M=[];for(let e=0;e<26;e++)for(let o=0;o<60;o++){const n=e*61+o,S=n+1,r=n+61,B=r+1;M.push(n,r,S,S,r,B)}const A=new t.BufferGeometry;A.setAttribute("position",new t.BufferAttribute(w,3)),A.setAttribute("uv",new t.BufferAttribute(g,2)),A.setIndex(M),A.computeVertexNormals();const v=A.attributes.normal;for(let e=0;e<=26;e++){const o=e*61,n=e*61+60,S=v.getX(o)+v.getX(n),r=v.getY(o)+v.getY(n),B=v.getZ(o)+v.getZ(n),_=Math.hypot(S,r,B)||1;v.setXYZ(o,S/_,r/_,B/_),v.setXYZ(n,S/_,r/_,B/_)}const y=[],F=[],d=[],h=[],f=new t.SphereGeometry(1,14,10);{const e=f.attributes.position,o=f.attributes.normal,n=0;for(let r=0;r<e.count;r++)y.push(e.getX(r)*.13,.5+e.getY(r)*.21,e.getZ(r)*.13),d.push(o.getX(r),o.getY(r),o.getZ(r)),F.push(0,0,0,0);const S=f.index.array;for(let r=0;r<S.length;r++)h.push(n+S[r]);f.dispose()}const l=(e,o,n,S,r,B,_,P,b,I)=>{const C=y.length/3,L=Math.cos(I),E=Math.sin(I);for(let N=0;N<=_;N++){const z=N/_,D=G(r,B,Math.pow(z,.7))*(P===2?1+.35*Math.sin(z*19+b*9):1),k=n-S*z;if(y.push(e-L*D,k,o-E*D,e+L*D,k,o+E*D),d.push(-E,0,L,-E,0,L),F.push(P,z,b,-1,P,z,b,1),N<_){const K=C+N*2;h.push(K,K+1,K+2,K+1,K+3,K+2)}}},p=14;for(let e=0;e<p;e++){const o=e/p*O+a.range(-.1,.1),n=.27;l(Math.sin(o)*n,Math.cos(o)*n,.02,a.range(.75,1.2),.03,.008,20,1,a(),o+Math.PI/2+a.range(-.5,.5))}for(let e=0;e<4;e++){const o=e/4*O+.4,n=.06,S=a.range(.55,.8),r=a();l(Math.sin(o)*n,Math.cos(o)*n,.34,S,.075,.02,16,2,r,o),l(Math.sin(o)*n,Math.cos(o)*n,.34,S,.075,.02,16,2,r,o+Math.PI/2)}const u=new t.BufferGeometry;return u.setAttribute("position",new t.Float32BufferAttribute(y,3)),u.setAttribute("normal",new t.Float32BufferAttribute(d,3)),u.setAttribute("aK",new t.Float32BufferAttribute(F,4)),u.setIndex(h),{bell:A,solids:u}}const Ae=`
  attribute vec4 aInst;                 // phase, tint, glow, fade
  uniform float uTime;
  float pulseAt(float t) { return sin(uTime * 0.85 + aInst.x * 6.2832 - t * 3.0); }
`;function De(a){const m=new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...a,...se()},vertexShader:`
      ${Ae}
      varying vec2 vUv; varying vec3 vN, vWorld; varying vec4 vInst;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv; vInst = aInst;
        float t = uv.y;
        vec3 p = position;
        float sw = 1. + 0.075 * pulseAt(t) * smoothstep(0.15, 1., t);
        sw += 0.05 * sin(uv.x * 62.83 + uTime * 1.4 + aInst.x * 9.) * smoothstep(0.84, 1., t);
        p.xz *= sw;
        p.y += 0.025 * pulseAt(0.) * (1. - t);
        mat4 m = modelMatrix * instanceMatrix;
        vWorld = (m * vec4(p, 1.)).xyz;
        vN = normalize(mat3(m) * normal);
        vec4 mvPosition = viewMatrix * vec4(vWorld, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D uNoise; uniform float uTime;
      uniform vec3 uSunDir, uSunCol, uIndigo, uTan, uCream, uRust, uRustDark, uPlum, uCyan;
      uniform mat4 uInvModel;
      varying vec2 vUv; varying vec3 vN, vWorld; varying vec4 vInst;
      #include <fog_pars_fragment>
      void main() {
        vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vWorld);
        float nv = abs(dot(N, V)), fr = pow(1. - nv, 2.0);
        float t = vUv.y;
        // veins: trunk lines down the gores, branching capillaries from the ridged noise
        float gore = exp(-pow(sin(vUv.x * 31.4159) / 0.085, 2.));
        vec4 n1 = texture2D(uNoise, vec2(vUv.x * 3. + vInst.x, t * 1.3 + vInst.y));
        vec4 n2 = texture2D(uNoise, vec2(vUv.x * 7. + vInst.y, t * 3.1 + vInst.x));
        float vein = max(smoothstep(0.6, 0.82, n1.a), smoothstep(0.66, 0.86, n2.a) * 0.7);
        vein = max(vein, gore * 0.85) * smoothstep(0.03, 0.2, t);
        float mott = n2.g;

        vec3 sunL = normalize(uSunDir);
        float ndl = dot(N, sunL);
        float lit = smoothstep(-0.2, 0.45, ndl);
        float thru = smoothstep(0.2, -0.8, ndl);
        vec3 base = mix(mix(uRust, uTan, 0.25 + 0.3 * vInst.y), uCream, smoothstep(0.04, 0.72, t + (mott - 0.5) * 0.3));
        base = mix(base, uTan, smoothstep(0.8, 1., t) * 0.6) * 0.8;
        vec3 col = base * uSunCol * lit * (0.8 + 0.2 * mott) + mix(uPlum, uRustDark, 0.5) * (1. - lit) * 0.7 + base * uTan * thru * 0.3;
        col = mix(col, uRustDark * 0.5, vein * 0.8);
        col += uCream * fr * lit * 0.35;
        float y = (uInvModel * vec4(vWorld, 1.)).y;
        col = mix(col, uIndigo * 0.4 + col * 0.3, smoothstep(-110., -280., y) * 0.7);

        // inner light: strongest looking straight through the bag, pulsing, bleeding along the veins
        float beat = 0.6 + 0.4 * sin(uTime * 0.85 + vInst.x * 6.2832);
        float inner = pow(nv, 1.6) * smoothstep(0.05, 0.4, t) * (1. - smoothstep(0.75, 1., t) * 0.6);
        beat *= mix(0.3, 1., smoothstep(60., 260., distance(cameraPosition, vWorld)));   // close by, the glow must not clip to white
        col += uCyan * vInst.z * beat * (inner * 0.5 + vein * 1.1 * (0.4 + inner) + fr * 0.2) * 1.5;

        float alpha = mix(0.62, 0.97, fr) + vein * 0.3;
        if (!gl_FrontFacing) alpha *= 0.55;
        gl_FragColor = vec4(col, clamp(alpha, 0., 1.) * vInst.w);
        #include <fog_fragment>
      }`}),s=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:{...a,...se()},vertexShader:`
      ${Ae}
      attribute vec4 aK;
      varying vec4 vK, vInst; varying vec3 vN, vWorld;
      #include <fog_pars_vertex>
      void main() {
        vK = aK; vInst = aInst;
        vec3 p = position;
        float t = aK.y, ph = aK.z;
        if (aK.x > 0.5) {
          float amp = aK.x > 1.5 ? 0.05 : 0.11;
          p.x += sin(uTime * 0.7 + ph * 6.28 + t * 5.0 + aInst.x * 5.) * t * t * amp;
          p.z += cos(uTime * 0.55 + ph * 9.1 + t * 4.0) * t * t * amp + t * t * (aK.x > 1.5 ? 0.16 : 0.42);   // drag behind
          p.y += 0.05 * pulseAt(1.) * t;
          p.xz *= 1. + 0.075 * pulseAt(1.) * (1. - t);
        } else {
          p.xz *= 1. + 0.1 * pulseAt(0.5);
        }
        mat4 m = modelMatrix * instanceMatrix;
        vWorld = (m * vec4(p, 1.)).xyz;
        vN = normalize(mat3(m) * normal);
        vec4 mvPosition = viewMatrix * vec4(vWorld, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime;
      uniform vec3 uSunDir, uSunCol, uIndigo, uTan, uCream, uRust, uRustDark, uPlum, uCyan;
      varying vec4 vK, vInst; varying vec3 vN, vWorld;
      #include <fog_pars_fragment>
      void main() {
        float t = vK.y;
        float beat = (0.6 + 0.4 * sin(uTime * 0.85 + vInst.x * 6.2832)) * mix(0.3, 1., smoothstep(60., 260., distance(cameraPosition, vWorld)));
        vec3 col;
        if (vK.x < 0.5) {
          vec3 V = normalize(cameraPosition - vWorld);
          float rim = 1. - abs(dot(normalize(vN), V));
          col = uCyan * vInst.z * beat * (3.2 + 2.2 * (1. - rim)) + vec3(0.5, 0.9, 1.) * (1. - rim) * beat;
        } else {
          float lit = 0.45 + 0.55 * abs(dot(normalize(vN), normalize(uSunDir)));
          vec3 base = vK.x > 1.5 ? mix(uTan, uRust, t * 0.8) : mix(uRust, vec3(0.42, 0.36, 0.1), t);
          col = base * uSunCol * lit * 0.6 * (1. - 0.3 * abs(vK.w));
          float bead = smoothstep(0.72, 1., sin(t * 26. - uTime * 1.6 + vK.z * 20.));
          col += uCyan * vInst.z * (bead * (0.4 + 2.6 * t) + (1. - t) * (1. - t) * beat * 1.3);
        }
        gl_FragColor = vec4(col * vInst.w, 1.);
        #include <fog_fragment>
      }`});return{membrane:m,solid:s}}async function We(a,m={}){const s=a.rng.fork?a.rng.fork("storm-eye"):a.rng,i=(m.palette&&m.palette.length>=7?m.palette:Fe).map(Re),w=m.spin??s.sign(),g=s.int(4,6),M=s.range(2.8,3.8),A=s.range(-.012,.012),v=s.range(-.06,.1);i[3].offsetHSL(A,v,0),i[4].offsetHSL(A,v*.5,0),i[1].offsetHSL(A*.5,0,0);const y=s.range(1,90),F=[s.range(3.2,4.3),s.range(4.8,6),s.range(6.6,8.2)],d=m.revealU??.6,h=new t.Vector3().fromArray(m.sunDir||[-.38,.82,.43]).normalize(),f=new t.Color(m.sunColor||"#fff4e2").multiplyScalar(m.sunIntensity??1.1),l=await Ie(s.fork?s.fork("tex"):s,a),p=l.tex;await a.yield?.();const u=await Me(a,l.floats[0],l.floats[3],l.size,2),e=await Me(a,l.floats[1],l.floats[2],l.size,6);await a.yield?.();const o={uNoise:{value:p},uTexA:{value:u.tex},uTexB:{value:e.tex},uGradScale:{value:new t.Vector2(u.scale,e.scale)},uTime:{value:0},uSpin:{value:w},uArms:{value:g},uTwist:{value:M},uWRim:{value:O/90},uSunDir:{value:h},uSunDirW:{value:h.clone()},uSunCol:{value:f},uIndigo:{value:i[0]},uTan:{value:i[1]},uCream:{value:i[2]},uRust:{value:i[3]},uRustDark:{value:i[4]},uPlum:{value:i[5]},uCyan:{value:i[6]},uBoltCol:{value:new t.Color(.62,.74,1)},uFlash:{value:[new t.Vector4(0,-300,0,0),new t.Vector4(0,-100,0,0),new t.Vector4(0,-100,0,0)]},uStrike:{value:new t.Vector2(0,0)},uInvModel:{value:new t.Matrix4},uApronCut:{value:m.apronCut??1e6},uWell:{value:new t.Vector3().fromArray(m.wellColor||[.03,.013,.065])}},n=new t.Group;n.name="storm-bands-eye";const S=await Pe(o,a);n.add(S),await a.yield?.(),n.add(Be(o));const r=_e(s.fork?s.fork("bolts"):s,o,6);n.add(r.mesh),n.add(Le(s.fork?s.fork("scud"):s,o,M)),await a.yield?.();const B=Math.max(0,Math.min(10,m.floaters??6)),_=m.attendants===!1?0:2,P=B+_+(Array.isArray(m.pod)?Math.min(m.pod.length,12):0),b=s.fork?s.fork("floaters"):s,I=new t.Vector3(0,ne(350)+120,350),C=[];for(let c=0;c<B;c++)C.push({wall:!0,size:b.range(38,76),phase:(c+b.range(-.22,.22))/B,bob:b.range(0,O),hover:b.range(10,26)});const L=[];for(let c=0;c<_;c++){const T=b.range(40,50),x=c===0?-1:1,R=new t.Vector3(x*(85+b.range(-4,4)),I.y-T*.55+b.range(-6,6),I.z-b.range(70,88));C.push({wall:!1,size:T,base:R,bob:b.range(0,O),yaw:b.range(-.5,.5)}),L.push(R.clone().setY(R.y+T*.5))}const E=Array.isArray(m.pod)?m.pod.slice(0,12):[];for(const c of E)C.push({wall:!1,size:c.size??50,base:new t.Vector3().fromArray(c.position),bob:b.range(0,O),yaw:c.yaw??b.range(-.6,.6),drift:c.drift||[0,0]});const N=280,z=62*Math.PI/180,D=236*Math.PI/180,k=new t.Vector3,K=new t.Quaternion,Y=new t.Vector3,ce=new t.Matrix4,fe=new t.Euler;function he(c,T,x){const R=((c.phase+T/N)%1+1)%1,H=w*(z+D*R),$=G(645,112,Math.pow(R,.85)),V=X(0,.06,R),Q=X(.88,1,R),j=ue($*.05,5,38)*.8;let J=ne(Math.max($,q+25))+j+c.hover+c.size*.95+Math.sin(T*.21+c.bob)*4;J-=(1-V)*c.size*1.7+Q*190,x.pos.set(Math.sin(H)*$,J,Math.cos(H)*$);const me=w*Math.cos(H)-Math.sin(H)*.25,ee=-w*Math.sin(H)-Math.cos(H)*.25;return x.yaw=Math.atan2(-me,-ee),x.scale=c.size*(.3+.7*V)*(1-.8*X(.93,1,R)),x.fade=V*(1-X(.95,1,R)),x}const Z={pos:new t.Vector3,yaw:0,scale:1,fade:1};let te=null,ae=null,re=null;if(P>0){const c=Ne(b),T=De(o);T.membrane.uniforms.uSunDir=o.uSunDirW,T.solid.uniforms.uSunDir=o.uSunDirW;const x=new Float32Array(P*4);for(let R=0;R<P;R++)x[R*4]=b(),x[R*4+1]=b(),x[R*4+2]=b.range(.8,1.15),x[R*4+3]=1;re=new t.InstancedBufferAttribute(x,4),re.setUsage(t.DynamicDrawUsage),c.bell.setAttribute("aInst",re),c.solids.setAttribute("aInst",re),ae=new t.InstancedMesh(c.solids,T.solid,P),te=new t.InstancedMesh(c.bell,T.membrane,P),ae.frustumCulled=te.frustumCulled=!1,ae.name="floater-solids",te.name="floater-membrane",te.renderOrder=4,n.add(ae,te)}function pe(c){if(P){for(let T=0;T<P;T++){const x=C[T];let R=1;x.wall?(he(x,c,Z),k.copy(Z.pos),Y.setScalar(Math.max(Z.scale,.001)),R=Z.fade,fe.set(.1,Z.yaw,0,"YXZ")):(k.copy(x.base),k.y+=Math.sin(c*.24+x.bob)*3.5,k.x+=Math.sin(c*.13+x.bob*2)*2,x.drift&&(k.x+=Math.sin(c*.05+x.bob)*x.drift[0],k.z+=Math.cos(c*.043+x.bob*1.7)*x.drift[1]),Y.setScalar(x.size),fe.set(.04*Math.sin(c*.2+x.bob),x.yaw+Math.sin(c*.07+x.bob)*.3,0,"YXZ")),K.setFromEuler(fe),ce.compose(k,K,Y),ae.setMatrixAt(T,ce),te.setMatrixAt(T,ce),re.array[T*4+3]=R}ae.instanceMatrix.needsUpdate=!0,te.instanceMatrix.needsUpdate=!0,re.needsUpdate=!0}}pe(0);function ge(c,T){const x=F[T],R=Math.floor(c/x),H=c-R*x,$=ie(R,T,y),V=ie(R,T+9.1,y),Q=ie(R+.5,T+3.7,y),j=H-$*x*.5;let J=0;if(j>=0&&j<1){const me=2+Math.floor(V*3);for(let ee=0;ee<me;ee++){const ye=j-ee*(.09+.06*ie(R,ee,T));ye>=0&&(J+=Math.exp(-ye*12)*(ee===0?1:.55+.45*ie(ee,R,3.3)))}}return{I:Math.min(J,1.3),h2:V,h3:Q}}let le=-1;function xe(c){const T=o.uFlash.value,x=ge(c,0);let R=Math.floor(x.h3*6)%6,H=x.I;if(le>=0){const V=X(d-.004,d+.004,le)*(1-X(d+.03,d+.06,le));if(V>.01){const Q=.5+.5*Math.abs(Math.sin(c*21))*(.6+.4*Math.sin(c*57)),j=V*Q*1.25;j>H&&(H=j,R=Math.floor(c*3.5)%6)}}const $=r.flashPos[R];T[0].set($.x,$.y,$.z,H),o.uStrike.value.set(R,H);for(let V=1;V<3;V++){const Q=ge(c,V),j=G(230,720,Q.h2),J=Q.h3*O;T[V].set(Math.sin(J)*j,ne(j)+4,Math.cos(J)*j,Q.I*.85)}}xe(0);const W=(c,T,x)=>new t.Vector3(c,T,x),Se={portalSeat:{position:I.clone(),facing:W(0,0,1)},flyThrough:[W(150,95,1250),W(135,80,1e3),W(115,68,815),W(75,40,660),W(35,-5,540),W(8,-32,462),W(0,I.y,450),I.clone()],viewpoints:[{position:W(60,60,1900),lookAt:W(0,-40,0),note:"edge-on: the Eye is a dark notch in the deck horizon"},{position:W(115,68,815),lookAt:W(0,-150,0),note:"rim reveal: the deck falls away and the spiral opens"},{position:W(35,-5,540),lookAt:W(-w*260,-120,-140),note:"banked pass along the inner wall, Floaters beyond"}],lookAt:W(0,-150,0),wellCenter:W(0,-250,0),rimRadius:U,wellRadius:q,apronRadius:oe-30,attendants:L,spin:w,floaterPosition(c,T,x=new t.Vector3){const R=C[Math.max(0,Math.min(B-1,c))];return R?(he(R,T,Z),x.copy(Z.pos).setY(Z.pos.y+Z.scale*.5)):x.set(0,0,0)}},Te=new t.Vector3;return{object:n,radius:U,height:520,center:new t.Vector3(0,90,0),anchors:Se,uniforms:o,ground:!1,groundY:0,setProgress(c){le=c},update(c,T,x){o.uTime.value=T,o.uInvModel.value.copy(n.matrixWorld).invert(),o.uSunDirW.value.copy(Te.copy(h).transformDirection(n.matrixWorld)),xe(T),pe(T)},dispose(){p.dispose(),u.tex.dispose(),e.tex.dispose()}}}export{We as buildHero};
