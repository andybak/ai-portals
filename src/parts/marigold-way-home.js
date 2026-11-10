import*as a from"three";import{clamp as Ve,lerp as $,smoothstep as bt}from"../kit/core.js";const Z=Math.PI*2,wt=["#0B1230","#1F47A8","#FF9A1F","#FFD98A","#7A4FB0","#D6336C","#A8492E"],ce=7,lt=3,jt=3.5,me=14,Fe=-14,ke=7,j={z:-10.2,y0:21,spring:31,r:8.75,tr:1.25,td:2.8},ue=i=>me-jt*i,ne=i=>lt*(i+1),pe=i=>22-i,$e=i=>i>=ce-1?Fe:ue(i+1),ea=new a.Matrix4,Ot=new a.Quaternion,Qt=new a.Euler,Rt=new a.Vector3,Ht=new a.Vector3;function E(i,u,t,y=1,w=y,n=y,S=0,C=0,b=0){return new a.Matrix4().compose(Rt.set(i,u,t),Ot.setFromEuler(Qt.set(C,S,b,"YXZ")),Ht.set(y,w,n))}const he=(i,u=10)=>new a.LatheGeometry(i.map(t=>new a.Vector2(Math.max(t[0],.001),t[1])),u),T=i=>new a.Color(i),H=(i,u,t)=>i.clone().lerp(u,t);function ct(){let i=4096,u=new Float32Array(i*3),t=new Float32Array(i*3),y=new Float32Array(i*3),w=new Float32Array(i*4),n=16384,S=new Uint32Array(n),C=0,b=0;const F=new a.Color,B=new a.Matrix3,g=[1e9,1e9,1e9,-1e9,-1e9,-1e9],V=(A,q)=>{const G=new A.constructor(q);return G.set(A),G};return{get vertices(){return b},add(A,q,G,D=[0,0,0],U=0,W=null){const P=A.attributes.position,Q=A.index,z=b,N=P.count,X=P.array,we=A.attributes.normal.array,J=q.elements,Ue=typeof G=="function",O=B.getNormalMatrix(q).elements,te=D[0],ee=D[1],k=D[2],ae=U&&W;if(b+N>i){for(;b+N>i;)i*=2;u=V(u,i*3),t=V(t,i*3),y=V(y,i*3),w=V(w,i*4)}for(let de=0,re=0,ie=z*3,De=z*4;de<N;de++,re+=3,ie+=3,De+=4){const Ce=X[re],Ne=X[re+1],Te=X[re+2];Ue?G(Ce,Ne,Te,F):F.copy(G),ae&&F.multiplyScalar(1+(W()-.5)*U);const Ge=J[0]*Ce+J[4]*Ne+J[8]*Te+J[12],fe=J[1]*Ce+J[5]*Ne+J[9]*Te+J[13],xe=J[2]*Ce+J[6]*Ne+J[10]*Te+J[14];u[ie]=Ge,u[ie+1]=fe,u[ie+2]=xe,Ge<g[0]&&(g[0]=Ge),Ge>g[3]&&(g[3]=Ge),fe<g[1]&&(g[1]=fe),fe>g[4]&&(g[4]=fe),xe<g[2]&&(g[2]=xe),xe>g[5]&&(g[5]=xe);const ve=we[re],qe=we[re+1],se=we[re+2],oe=O[0]*ve+O[3]*qe+O[6]*se,Ae=O[1]*ve+O[4]*qe+O[7]*se,Ke=O[2]*ve+O[5]*qe+O[8]*se,je=Math.sqrt(oe*oe+Ae*Ae+Ke*Ke)||1;t[ie]=oe/je,t[ie+1]=Ae/je,t[ie+2]=Ke/je,y[ie]=F.r,y[ie+1]=F.g,y[ie+2]=F.b,w[De]=0,w[De+1]=te,w[De+2]=ee,w[De+3]=k}const Ee=Q?Q.count:N;if(C+Ee>n){for(;C+Ee>n;)n*=2;S=V(S,n)}if(Q){const de=Q.array;for(let re=0;re<Ee;re++)S[C++]=z+de[re]}else for(let de=0;de<N;de++)S[C++]=z+de;b+=N,A.dispose()},async build(A,q){for(let D=0;D<b;D++)(D&1023)===0&&await q?.yield?.(),w[D*4]=A(u[D*3],u[D*3+1],u[D*3+2],t[D*3],t[D*3+1],t[D*3+2]);const G=new a.BufferGeometry;return G.setAttribute("position",new a.BufferAttribute(u.slice(0,b*3),3)),G.setAttribute("normal",new a.BufferAttribute(t.slice(0,b*3),3)),G.setAttribute("aCol",new a.BufferAttribute(y.slice(0,b*3),3)),G.setAttribute("aAux",new a.BufferAttribute(w.slice(0,b*4),4)),G.setIndex(new a.BufferAttribute(b>65535?S.slice(0,C):Uint16Array.from(S.subarray(0,C)),1)),b&&(G.boundingSphere=new a.Sphere(new a.Vector3((g[0]+g[3])/2,(g[1]+g[4])/2,(g[2]+g[5])/2),.5*Math.hypot(g[3]-g[0],g[4]-g[1],g[5]-g[2])+1)),await q?.yield?.(),G}}}function Se(i,u,t){const y=[],w=[],n=[],S=[];for(let C=0;C<=u;C++)for(let b=0;b<=i;b++){const F=t(b/i,C/u);y.push(F[0],F[1],F[2]),w.push(F[3],F[4]),n.push(F[5]??0,F[6]??0,F[7]??1)}for(let C=0;C<u;C++)for(let b=0;b<i;b++){const F=C*(i+1)+b,B=F+1,g=F+i+1,V=g+1;S.push(F,g,B,B,g,V)}return{P:y,U:w,E:n,I:S,n:(i+1)*(u+1)}}function at(i,u=[]){const t=[],y=[],w=[],n=[];let S=0;i.forEach((b,F)=>{t.push(...b.P),y.push(...b.U),w.push(...b.E);for(let B=0;B<b.I.length;B+=3)u[F]?n.push(S+b.I[B],S+b.I[B+2],S+b.I[B+1]):n.push(S+b.I[B],S+b.I[B+1],S+b.I[B+2]);S+=b.n});const C=new a.BufferGeometry;return C.setAttribute("position",new a.Float32BufferAttribute(t,3)),C.setAttribute("uv",new a.Float32BufferAttribute(y,2)),C.setAttribute("aE",new a.Float32BufferAttribute(w,3)),C.setIndex(n),C.computeVertexNormals(),C}const Ie=`
uniform vec3 uSky, uGround, uWarm; uniform float uTime, uAmb, uPetal, uProgress;
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash22(vec2 p){ float n = hash21(p); return vec2(n, hash21(p + n + 17.17)); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
float flick(vec3 p){ return 0.87 + 0.13 * sin(uTime * 1.7 + p.x * 0.11 + p.z * 0.07) * sin(uTime * 1.13 + p.y * 0.09 + 1.7)
  + 0.04 * sin(uTime * 4.3 + p.x * 0.31 + p.y * 0.2); }
vec3 lightAt(vec3 p, vec3 n, float glow){
  float up = n.y * 0.5 + 0.5;
  vec3 amb = (uSky * (0.3 + 0.7 * up) + uGround * (1. - up) * (1. - up) / (1. + max(p.y, 0.) * 0.045)) * uAmb;
  return amb + uWarm * glow * flick(p);
}`,ge=`#include <fog_pars_vertex>
`,ye=`#include <fog_pars_fragment>
`,xt=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  #else
    col *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
  #endif
#endif`;function be(i,u){const t=new a.ShaderMaterial({uniforms:a.UniformsUtils.merge([a.UniformsLib.fog,u.uniforms||{}]),vertexShader:u.vertexShader,fragmentShader:u.fragmentShader,fog:!0,side:u.side??a.FrontSide,transparent:!!u.transparent,depthWrite:u.depthWrite??!0,blending:u.blending??a.NormalBlending});for(const y in i)t.uniforms[y]=i[y];return t}const Le=`
  vec4 wpos = modelMatrix * vec4(P, 1.); vW = wpos.xyz;
  vec4 mvPosition = viewMatrix * wpos; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
`;function At(i){return be(i,{vertexShader:ge+`
      attribute vec3 aCol; attribute vec4 aAux; uniform float uSpin;
      varying vec3 vCol, vN, vL, vW; varying vec4 vAux;
      void main(){ vCol = aCol; vAux = aAux; vL = position; vec3 P = position;
        vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        ${Le} }`,fragmentShader:ye+Ie+`
      varying vec3 vCol, vN, vL, vW; varying vec4 vAux;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
        float nz = vnoise(vL.xz * 1.9 + vL.y * 1.3), nz2 = vnoise(vL.xy * 7. + vL.z * 5.);
        vec3 alb = vCol * (0.82 + 0.24 * nz + 0.12 * nz2);
        if (vAux.w > 0.5) { float m = vnoise(vL.xy * 0.21) * 0.6 + vnoise(vL.xy * vec2(1.1, 0.16)) * 0.4; alb *= 0.7 + 0.55 * m; }
        vec3 col = alb * lightAt(vL, n, vAux.x);
        vec3 R = reflect(-V, n);
        float sw = pow(max(dot(R, vec3(0., -0.301, 0.954)), 0.), 14.) + pow(max(dot(R, normalize(vec3(-0.5 * sign(vL.x), 0.2, 0.8))), 0.), 36.);
        float fr = 1. - max(dot(n, V), 0.); fr = fr * fr * fr;
        col += vAux.z * (uWarm * (0.3 + vAux.x) * sw * 1.5 * mix(vec3(1.), vCol * 1.8, 0.65) + uSky * pow(max(R.y, 0.), 6.) * 0.7 + uWarm * vCol * fr * 0.5 * vAux.x);
        col += vCol * vAux.y * (0.8 + 0.2 * flick(vL * 3.));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function $t(i,u,t,y){return be(i,{side:a.DoubleSide,uniforms:{uC1:{value:u},uC2:{value:t},uC3:{value:y}},vertexShader:ge+`
      attribute vec3 aE; varying vec2 vUv; varying vec3 vE, vN, vL, vW;
      void main(){ vUv = uv; vE = aE; vL = position; vec3 P = position;
        vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        ${Le} }`,fragmentShader:ye+Ie+`
      uniform vec3 uC1, uC2, uC3; varying vec2 vUv; varying vec3 vE, vN, vL, vW;
      void main(){
        float u = vUv.x, v = vUv.y;
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.)); if (!gl_FrontFacing) n = -n;
        vec3 alb = vec3(0.80, 0.765, 0.69) * (0.93 + 0.07 * sin(u * 40.) * sin(v * 40.)) * (0.9 + 0.14 * vnoise(vUv * 1.3));
        if (v > 0.) {
          float hem = 2.28 + 0.4 * abs(sin(u * 2.856));
          if (v > hem) discard;
          vec2 lp = vec2(fract(u / 0.55) - 0.5, (v - hem + 0.3) / 0.55);
          if (dot(lp, lp) < 0.036) discard;
          float lace = step(hem - 0.62, v); alb *= 1. - 0.1 * lace;
          float bv = (v - 1.42) / 0.5;
          if (abs(bv) < 1.35) {
            float cu = fract(u / 1.9) - 0.5, c2 = fract(u / 1.9 + 0.5) - 0.5;
            float dia = abs(cu) * 2.2 + abs(bv) * 0.82;
            float ring = step(dia, 0.66) * step(0.46, dia), core = step(dia, 0.26);
            float zig = abs(fract(u / 0.63) - 0.5) * 2.;
            float zz = step(abs(abs(bv) - 1.12 - (zig - 0.5) * 0.3), 0.075);
            vec2 fp = vec2(c2 * 1.9, bv * 0.5); float fr = length(fp);
            float fa = fr > 1e-3 ? atan(fp.y, fp.x) : 0.;
            float flower = step(fr, 0.3 * (0.62 + 0.38 * cos(fa * 6.))), eye = step(fr, 0.085);
            alb = mix(alb, uC1, ring * 0.9); alb = mix(alb, uC3, core * 0.9);
            alb = mix(alb, uC2, zz * 0.85); alb = mix(alb, uC3, flower * 0.9); alb = mix(alb, uC1, eye);
          }
        } else {
          alb = mix(alb, uC1, step(-0.62, v) * step(v, -0.4) * 0.85);
          alb = mix(alb, uC2, step(-0.84, v) * step(v, -0.76) * 0.8);
        }
        vec3 col = alb * lightAt(vL, n, vE.y);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}const Yt=`
  uniform vec3 uP1, uP2, uP3, uP4; uniform float uCell, uGust; varying vec2 vUv; varying vec3 vE, vN, vL, vW;
  void main(){
    vec2 p = (vUv + (vec2(vnoise(vUv * 2.3), vnoise(vUv * 2.3 + 7.7)) - 0.5) * 0.42) / uCell; vec2 ip = floor(p), fp = fract(p); float d1 = 8., d2 = 8.; vec2 id = ip, rv = vec2(0.);
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y)); vec2 r = g + hash22(ip + g) - fp; float d = dot(r, r);
      if (d < d1) { d2 = d1; d1 = d; id = ip + g; rv = r; } else if (d < d2) { d2 = d; }
    }
    float h = hash21(id + 7.7);
    if (vE.x < hash21(id + 3.1) * 2.4 - 0.05) discard;
    if (vW.y < 1. && hash21(id + 4.7) * 0.5 + vnoise(vUv * 0.21 + 3.) * 0.65 < uGust * 0.92) discard;      // the rare gust lifts the road off the floor in patches, bare tile between the clumps
    float crease = smoothstep(0.0, 0.17, sqrt(d2) - sqrt(d1));
    float ha = hash21(id + 5.5) * 6.2832, sheen = clamp(0.85 + 0.8 * dot(rv, vec2(cos(ha), sin(ha))), 0.5, 1.45);
    vec3 base = mix(uP1, uP2, smoothstep(0.8, 1., h) * 0.8); base = mix(base, uP3, smoothstep(0.38, 0.05, h));
    vec2 cc = (id + 0.5) * uCell;
    if (hash21(id + 9.3) < 0.93) {
      if (vUv.y > 60.) {
        vec2 q = cc - vec2(0., 113.5); float r = length(q); float a = r > 1e-3 ? atan(q.y, q.x) : 0.;
        float pa = abs(fract(a * 1.9099 + 0.5) - 0.5) * 2., rp = clamp((r - 3.2) / 5.2, 0., 1.);
        if (r < 2.0) base = uP2 * 0.95;
        else if (r < 3.0) base = uP3 * 0.75;
        else if (r < 8.4 && pa < (1. - rp * rp) * 0.9 * smoothstep(0., 0.2, rp)) base = pa < 0.22 * (1. - rp) ? uP4 : uP2 * 0.92;
        else if (r > 9.0 && r < 9.8) base = uP3 * 0.7;
        else if (r > 9.8 && r < 11.0 && pa > 0.45) base = uP2 * 0.9;
      } else if (vUv.y > -500.) {
        float ax = abs(cc.x); if (ax > 4.7 && ax < 5.5) base = uP2 * 0.92; else if (ax > 5.5 && ax < 5.9) base = uP3 * 0.7;
      }
    }
    float body = (0.25 + 0.75 * crease) * sheen * (0.55 + 0.6 * hash21(id + 1.3)) * (0.8 + 0.4 * vnoise(vUv * 5.3)) * (0.75 + 0.5 * vnoise(vUv * 0.16 + 3.));
    vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
    vec3 col = base * body * (uPetal * vE.z * (0.9 + 0.1 * flick(vL)) + lightAt(vL, n, vE.y) * 0.7);
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`;function Mt(i,u){return be(i,{side:a.DoubleSide,uniforms:{uP1:{value:u.orange.clone()},uP2:{value:H(u.gold,u.orange,.4)},uP3:{value:u.deep.clone()},uP4:{value:(u.magenta||u.deep).clone().multiplyScalar(.8)},uCell:{value:.27}},vertexShader:ge+`
      attribute vec3 aE; varying vec2 vUv; varying vec3 vE, vN, vL, vW;
      void main(){ vUv = uv; vE = aE; vL = position; vec3 P = position;
        vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        ${Le} }`,fragmentShader:ye+Ie+Yt})}const Pt=`vec3 qrot(vec4 q, vec3 v){ return v + 2. * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
`;function zt(i){return be(i,{vertexShader:ge+Pt+`
      attribute vec3 iPos, iCol, iDat; attribute vec4 iQuat; attribute vec2 iSc; uniform float uTime;
      varying vec3 vCol, vDat, vN, vL, vW, vP;
      void main(){ vCol = iCol; vDat = iDat; vP = position;
        float ph = iDat.y * 40.;
        vec3 l = position * vec3(iSc.x, iSc.y, iSc.x);
        l.xz += vec2(sin(uTime * 2.1 + ph), cos(uTime * 1.7 + ph * 1.3)) * 0.06 * iSc.x * position.y;
        vec3 P = iPos + qrot(iQuat, l) + vec3(sin(uTime * 1.3 + ph * 0.7), sin(uTime * 1.9 + ph), 0.) * 0.035 * iSc.x;
        vL = P; vN = normalize(mat3(modelMatrix) * qrot(iQuat, normal) + vec3(0., 1e-5, 0.));
        ${Le} }`,fragmentShader:ye+Ie+`
      varying vec3 vCol, vDat, vN, vL, vW, vP;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
        float r = length(vP.xz); float a = r > 1e-3 ? atan(vP.z, vP.x) : 0.;
        // a pom-pom: rings of small scalloped petals, more of them per ring outwards, each its own shade, a darker heart
        float np0 = 7. + 6. * floor(r * 3.6 + 0.25), p0 = abs(fract(a / 6.2832 * np0 + vDat.y * 7.) - 0.5) * 2.;
        float rr = r * 3.6 + 0.42 * p0 * p0, ri = floor(rr), rf = fract(rr), np = 7. + 6. * ri;
        float pc = a / 6.2832 * np + ri * 0.31 + vDat.y * 7., px = abs(fract(pc) - 0.5) * 2.;
        float ph = hash21(vec2(ri * 7.3 + floor(pc), floor(vDat.y * 97.)));
        float shade = mix(0.3, 1.16, smoothstep(0.05, 0.9, rf)) * (0.72 + 0.5 * ph) * (1. - 0.5 * smoothstep(0.62, 1., px));
        shade *= mix(0.45, 1., smoothstep(0.06, 0.3, r)) * (1. - 0.32 * smoothstep(0.84, 1., r)) * (0.86 + 0.28 * fract(vDat.y * 13.7));
        shade = mix(shade, 0.78, clamp((fwidth(rr) + fwidth(pc)) * 0.38, 0., 1.));
        vec3 alb = vCol * shade * mix(vec3(1.), vec3(1.14, 0.9, 0.66), ph * 0.55);
        float fr = 1. - max(dot(n, V), 0.);
        vec3 col = alb * (lightAt(vL, n, vDat.x) + vDat.z * uPetal * (0.55 + 0.6 * fr * fr + 0.25 * uProgress));
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function St(i){return be(i,{vertexShader:ge+`
      attribute vec3 iPos, iCol, iDat; attribute vec2 iSc; uniform float uPool;
      varying vec3 vCol, vDat, vN, vL, vW, vP;
      void main(){ vCol = iCol; vDat = iDat; vP = position;
        vec3 P = iPos + position * vec3(iSc.x, iSc.y, iSc.x) * vec3(1., 1., 1.);
        if (position.y > 1.01) P.y = iPos.y + iSc.y + (position.y - 1.) * 0.9 * iSc.x * 2.;
        if (position.y < -0.2) { float pr = iSc.x * uPool * (1. - iDat.z) * (0.8 + 0.5 * iDat.y); P = iPos + vec3(position.x * pr, 0.05 + 0.05 * step(dot(position.xz, position.xz), 0.01), position.z * pr); }
        vL = P; vN = normalize(mat3(modelMatrix) * normal + vec3(0., 1e-5, 0.));
        ${Le} }`,fragmentShader:ye+Ie+`
      varying vec3 vCol, vDat, vN, vL, vW, vP;
      void main(){
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 V = normalize(cameraPosition - vW + vec3(0., 1e-4, 0.));
        float h = clamp(vP.y, 0., 1.), f = flick(vL + vDat.y * 30.);
        float drip = step(0.72, vnoise(vec2(atan(vP.z, vP.x + 1e-4) * 2.2 + vDat.y * 9., vP.y * 1.5 + vDat.y * 5.)));
        vec3 col;
        if (vDat.z > 0.5) {
          float rim = 1. - max(dot(n, V), 0.);
          col = vCol * (0.25 + 1.2 * h * h + 0.35 * (1. - rim)) * f + uWarm * rim * rim * 0.5 + vCol * lightAt(vL, n, vDat.x) * 0.5;
          col *= 0.8 + 0.3 * step(0.86, h);
        } else {
          vec3 alb = vCol * (0.9 + 0.12 * drip);
          col = alb * lightAt(vL, n, vDat.x) + uWarm * alb * (smoothstep(0.4, 1., h) * 0.9 + 0.06) * f;
        }
        if (vP.y > 1.02) col = vec3(0.02, 0.012, 0.01);
        if (vP.y < -0.2) col *= 0.62;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}const ut=`
  uniform vec3 uCamPosW, uCamDirW, uWindDir; uniform float uLean, uWind, uGust;
  float wake(vec3 bw, float reach, out vec3 lat, out float ld){
    vec3 rel = bw - uCamPosW; float behind = -dot(rel, uCamDirW);
    lat = rel + uCamDirW * behind; ld = length(lat);
    return smoothstep(-2., 3., behind) * (1. - smoothstep(8., 19., behind)) * (1. - smoothstep(reach * 0.4, reach, ld)) * uLean;
  }`;function Ct(i){return be(i,{transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,vertexShader:ge+ut+`
      attribute vec3 iPos, iInfo; uniform float uTime, uProgress, uFlame;
      varying vec2 vQ; varying float vPh, vK;
      void main(){
        vec3 bw = (modelMatrix * vec4(iPos, 1.)).xyz; float ph = iInfo.y;
        vec3 toC = cameraPosition - bw; float dist = length(toC);
        vec3 right = normalize(cross(vec3(0., 1., 0.), toC) + vec3(1e-4, 0., 0.));
        float s = iInfo.x * (1. + 0.55 * clamp(dist / 110., 0., 3.)) * (1. + 0.18 * uProgress) * uFlame;
        vec3 lat; float ld; float w = wake(bw - uCamDirW * 11., 30., lat, ld);
        vec3 lean = uCamDirW * 0.75 - lat / max(ld, 1e-3) * 0.65; lean.y = 0.;
        float h = max(position.y, 0.) / 1.6;
        float fl = sin(uTime * 9. + ph * 40.) * 0.035 + sin(uTime * 5.3 + ph * 17.) * 0.05;
        float tall = iInfo.z * (1. + 0.1 * sin(uTime * 6.1 + ph * 29.)) * (1. - 0.22 * w) * (1. + 0.22 * uWind);
        vec3 wp = bw + right * position.x * s + vec3(0., 1., 0.) * position.y * s * tall
          + (lean * w * 0.7 + right * fl + uWindDir * uWind * (0.75 + 0.3 * sin(uTime * 7. + ph * 9.))) * h * h * s * 1.6 * tall;
        vQ = position.xy; vPh = ph; vK = 1. / (1. + dist * 0.004);
        vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:ye+`
      uniform vec3 uWarm; uniform float uTime; varying vec2 vQ; varying float vPh, vK;
      void main(){
        float fy = clamp(vQ.y / 1.6, 0., 1.);
        float hw = 0.68 * sqrt(fy) * pow(max(1. - fy, 0.), 0.7) + 1e-3;
        float d = abs(vQ.x) / hw;
        float inY = step(0., vQ.y) * step(vQ.y, 1.6);
        float body = (1. - smoothstep(0.55, 1., d)) * inY, core = (1. - smoothstep(0.1, 0.75, d)) * inY * smoothstep(0.02, 0.3, fy);
        vec3 col = vec3(1., 0.4, 0.06) * body * 2.2 + vec3(1., 0.74, 0.3) * core * 4.2;
        col = mix(col, vec3(0.25, 0.4, 1.) * body * 2., (1. - smoothstep(0.0, 0.2, fy)) * 0.7);
        vec2 hp = vec2(vQ.x, (vQ.y - 0.55) * 0.75);
        col += vec3(1., 0.5, 0.13) * exp(-dot(hp, hp) * 3.2) * 0.2 * (0.85 + 0.15 * sin(uTime * 3.1 + vPh * 21.));
        col *= uWarm / max(uWarm.r, 1e-3);
        ${xt}
        gl_FragColor = vec4(col, 1.);
      }`})}function Bt(i){return be(i,{side:a.DoubleSide,vertexShader:ge+ut+`
      attribute vec3 iPos; attribute vec4 iA, iB; uniform float uTime, uProgress;
      varying vec3 vCol; varying float vShade;
      void main(){
        float yaw = iA.x, tilt = iA.y, size = iA.z, mode = iA.w, ph = iB.w;
        vec3 base = iPos; vec3 l = position * size; l.y += position.x * position.x * size * 0.35;
        vec3 bw = (modelMatrix * vec4(base, 1.)).xyz; vec3 lat; float ld;
        if (mode > 0.5) {
          float T = 7. + 6. * fract(ph * 5.7), tt = fract(uTime / T + ph);
          base.y -= tt * tilt; base.x += sin(tt * 9. + ph * 20.) * 0.9; base.z += tt * 2.2 + sin(tt * 7. + ph * 31.) * 0.6;
          tilt = tt * 13. + ph * 6.; yaw += tt * 5.;
          // a petal that joins the fall as the arch nears grows in with the progress (in about half a second at the quickest, at the flight's own pace;
          // a faster flight shortens it); it used to switch on whole in one frame
          float jf = fract(ph * 11.3), join = max(step(jf, 0.4), smoothstep(jf, jf + 0.03, 0.4 + 0.63 * uProgress));
          l *= smoothstep(0., 0.06, tt) * (1. - smoothstep(0.92, 1., tt)) * join;
          // the kit's near law for petals (nothing at 0.6 m, whole from 2.5 m): a falling petal dwindles before the lens, never a flat shape across it
          l *= smoothstep(0.6, 2.5, length(cameraPosition - (modelMatrix * vec4(base, 1.)).xyz));
        } else {
          float w = wake(bw - uCamDirW * 9., 13., lat, ld) * (0.4 + 0.6 * fract(ph * 7.3));
          float g = smoothstep(0., 1., uGust * 1.7 - fract(ph * 3.1) * 0.7);
          float up = w * (0.3 + 1.4 * fract(ph * 9.7)) + g * (0.4 + 3.2 * fract(ph * 4.9) * fract(ph * 4.9));
          base.y += up; base += uCamDirW * w * 1.5 * step(0.5, uLean);
          base.x += g * sin(uTime * 1.3 + ph * 40.) * 1.2; float cyc = fract(uTime * (0.36 + 0.42 * fract(ph * 8.1)) + ph); base.z -= g * g * (6. + 10. * fract(ph * 2.3)) + g * cyc * 14.;
          l *= mix(1., smoothstep(0., 0.12, cyc) * (1. - smoothstep(0.85, 1., cyc)), g);
          tilt += up * (1.5 + 2. * fract(ph * 6.1)) * sin(uTime * 2.7 + ph * 30.); yaw += up * 1.3;
          tilt += 0.12 * sin(uTime * 1.6 + ph * 50.);
        }
        float c = cos(tilt), s = sin(tilt); l = vec3(l.x, l.y * c - l.z * s, l.y * s + l.z * c);
        c = cos(yaw); s = sin(yaw); l = vec3(l.x * c + l.z * s, l.y, -l.x * s + l.z * c);
        vec3 P = base + l; vCol = iB.rgb; vShade = 0.75 + 0.25 * position.z + 0.2 * position.x * position.x;
        vec4 mvPosition = modelViewMatrix * vec4(P, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:ye+`
      uniform vec3 uSky; uniform float uPetal, uAmb; varying vec3 vCol; varying float vShade;
      void main(){
        vec3 col = vCol * vShade * (uPetal * 0.8 + uSky * uAmb * 0.4);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function Xt(i,u){return be(i,{transparent:!0,depthWrite:!1,side:a.DoubleSide,uniforms:{uViolet:{value:u}},vertexShader:ge+`
      attribute vec3 aBase; attribute float aPh; uniform float uTime, uWind; uniform vec3 uWindDir;
      varying vec2 vUv; varying float vPh;
      void main(){
        float h = uv.y, ph = aPh;
        vec3 c = aBase + vec3(sin(uTime * 0.5 + ph * 9. + h * 3.) * 1.3 * h + sin(uTime * 0.23 + h * 7. + ph) * 0.9 * h * h, h * 17.,
          cos(uTime * 0.4 + ph * 5. + h * 2.6) * 0.9 * h) + uWindDir * uWind * h * h * 9.;
        vec3 cw = (modelMatrix * vec4(c, 1.)).xyz;
        vec3 right = normalize(cross(vec3(0., 1., 0.), cameraPosition - cw) + vec3(1e-4, 0., 0.));
        vec3 wp = cw + right * uv.x * (0.3 + 3.6 * h);
        vUv = uv; vPh = ph;
        vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:ye+Ie+`
      uniform vec3 uViolet; varying vec2 vUv; varying float vPh;
      void main(){
        float h = vUv.y;
        vec2 q = vec2(vUv.x * 1.1 + vPh * 13., h * 4.5 - uTime * 0.32 + vPh * 7.);
        float n = vnoise(q) * 0.6 + vnoise(q * 2.3 + 3.1) * 0.4;
        float wisp = smoothstep(0.25, 0.8, n + 0.25 * sin(h * 9. - uTime * 0.6 + vUv.x * 3.));
        float a = (1. - smoothstep(0.15, 1., abs(vUv.x))) * smoothstep(0., 0.05, h) * pow(max(1. - h, 0.), 1.3) * (0.25 + 0.75 * wisp) * 0.55;
        vec3 col = mix(uWarm * 0.9, uViolet * 0.75 + uWarm * 0.12, smoothstep(0., 0.45, h));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`})}function Ft(i){return be(i,{side:a.DoubleSide,vertexShader:ge+`
      attribute vec3 aCol, aK; uniform float uTime, uWind;
      varying vec2 vUv; varying vec3 vCol, vK, vL, vN, vW;
      void main(){ vUv = uv; vCol = aCol; float zr = step(7.5, aK.x); vK = vec3(aK.x - 8. * zr, aK.yz); vec3 P = position;
        float loose = (1. - clamp(uv.y, 0., 1.)) * step(-0.5, vK.x);
        float wv = sin(uTime * (2.3 + 4. * uWind) + mix(position.x, position.z, zr) * 0.8 + aK.y * 6.) + 0.5 * sin(uTime * 3.7 + position.y * 1.7 + aK.y * 11.);
        float push = wv * loose * (0.28 + 0.9 * uWind) + loose * loose * uWind * 1.2;
        P.z += push * (1. - zr); P.x += push * zr * 0.6; P.y += abs(wv) * loose * 0.06;
        vL = P; vN = normalize(mat3(modelMatrix) * mix(vec3(0.35 * wv * loose, 0., 1.), vec3(1., 0., 0.35 * wv * loose), zr));
        ${Le} }`,fragmentShader:ye+Ie+`
      varying vec2 vUv; varying vec3 vCol, vK, vL, vN, vW;
      void main(){
        vec2 p = vUv;
        if (vK.x > -0.5) {
          if (p.y < 0.07 + 0.075 * abs(sin(p.x * 15.708))) discard;
          vec2 c = p - vec2(0.5, 0.53); float r = length(c * vec2(1., 0.9)); float a = r > 1e-3 ? atan(c.y, c.x) : 0.;
          float inner = step(0.1, p.x) * step(p.x, 0.9) * step(0.2, p.y) * step(p.y, 0.88), cut = 0.;
          if (vK.x < 0.5) cut = step(0.13, r) * step(r, 0.175) + step(0.215, r) * step(r, 0.36) * step(0.15, cos(a * 10.));
          else if (vK.x < 1.5) cut = step(0.095, r) * step(r, 0.33 * (0.55 + 0.45 * cos(a * 6.)));
          else if (vK.x < 2.5) { vec2 q = fract(p * 3.2 + 0.1) - 0.5; cut = step(abs(q.x) + abs(q.y), 0.3); }
          else cut = step(abs(fract(p.y * 3.6 + abs(fract(p.x * 4.) - 0.5)) - 0.5), 0.13);
          if (cut * inner > 0.5) discard;
          if (fract(p.x * 9. + 0.5) < 0.3 && p.y > 0.09 && p.y < 0.15 + 0.03) discard;
        }
        vec3 n = normalize(vN + vec3(0., 1e-4, 0.));
        vec3 col = vCol * (lightAt(vL, n, vK.z) + uWarm * 0.1 * vK.z);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function It(){const i=[],u=[];for(let w=0;w<9;w++){const n=w/9*Z;i.push(Math.cos(n),0,Math.sin(n))}for(let w=0;w<9;w++){const n=(w+.5)/9*Z;i.push(Math.cos(n)*.74,.4,Math.sin(n)*.74)}i.push(0,.62,0);for(let w=0;w<9;w++){const n=(w+1)%9;u.push(w,9+w,n,n,9+w,9+n,9+w,18,9+n)}const y=new a.BufferGeometry;return y.setAttribute("position",new a.Float32BufferAttribute(i,3)),y.setIndex(u),y.computeVertexNormals(),y}const Wt=(()=>{const i=[];for(let u=0;u<8;u++){const t=u/8*Z,y=(u+1)/8*Z,w=u%2?.92:1.06,n=u%2?1.06:.92;i.push(0,-.5,0,Math.cos(y)*n,-.5,Math.sin(y)*n,Math.cos(t)*w,-.5,Math.sin(t)*w)}return i})();function Dt(i,u,t=6){const y=[],w=[],n=i.length,S=new a.Vector3,C=new a.Vector3,b=new a.Vector3,F=new a.Vector3(0,0,1);for(let g=0;g<n;g++){S.subVectors(i[Math.min(g+1,n-1)],i[Math.max(g-1,0)]).normalize(),C.crossVectors(S,F),C.lengthSq()<1e-6&&C.set(1,0,0),C.normalize(),b.crossVectors(S,C);const V=u(g/(n-1),g);for(let A=0;A<t;A++){const q=A/t*Z,G=Math.cos(q)*V,D=Math.sin(q)*V;y.push(i[g].x+C.x*G+b.x*D,i[g].y+C.y*G+b.y*D,i[g].z+C.z*G+b.z*D)}}for(let g=0;g<n-1;g++)for(let V=0;V<t;V++){const A=(V+1)%t,q=g*t,G=q+t;w.push(q+V,q+A,G+V,q+A,G+A,G+V)}const B=new a.BufferGeometry;return B.setAttribute("position",new a.Float32BufferAttribute(y,3)),B.setIndex(w),B.computeVertexNormals(),B}const We=2*(j.spring-j.y0)+Math.PI*j.r;function Zt(i,u){const t=j.spring-j.y0;if(i<t)u.x=-j.r,u.y=j.y0+i,u.rx=-1,u.ry=0;else if(i>We-t)u.x=j.r,u.y=j.y0+(We-i),u.rx=1,u.ry=0;else{const y=Math.PI-(i-t)/j.r;u.rx=Math.cos(y),u.ry=Math.sin(y),u.x=u.rx*j.r,u.y=j.spring+u.ry*j.r}return u}function ft(i,u,t,y){const w=Zt(i,y),n=Math.cos(u),S=Math.sin(u),C=w.x+w.rx*j.tr*n*t,b=w.y+w.ry*j.tr*n*t,F=j.z+j.td*S*t;let B=w.rx*n/j.tr,g=w.ry*n/j.tr,V=S/j.td;const A=Math.hypot(B,g,V)||1;return y.px=C,y.py=b,y.pz=F,y.nx=B/A,y.ny=g/A,y.nz=V/A,y}async function ta(i,u={}){const t=i.rng.fork?i.rng.fork("marigold-altar"):i.rng,y=i.quality?.detail??1,w=u.palette&&u.palette.length>=7?u.palette:wt,n={indigo:T(w[0]),cobalt:T(w[1]),orange:T(w[2]),gold:T(w[3]),violet:T(w[4]),magenta:T(w[5]),terra:T(w[6])};n.deep=H(n.orange,n.terra,.6),n.orange.g*=.86,n.orange.b*=.5;const S=Math.max(12,u.road??46),C=u.roadWidth??10,b=Ve(u.burn??0,0,1),F=u.wall===!1?null:{width:60,height:46,...u.wall||{}},B=new a.Group;B.name="marigold-altar";const g=t.pick([[n.magenta,n.violet,n.orange],[n.cobalt,n.magenta,n.gold],[n.violet,n.orange,n.magenta]]),V=t.pick([[n.magenta,n.violet],[T("#e9dcc4"),n.orange],[n.magenta,n.orange,n.violet,n.cobalt]]),A=t.range(.14,.42),q=t.int(0,2),G=t.int(0,2),D=t.range(0,Z),U=(e=t())=>(e<A?H(n.gold,n.orange,t.range(0,.35)):H(n.orange,n.deep,t.range(0,.45))).multiplyScalar(t.range(.8,1.05)),W={uTime:{value:0},uProgress:{value:0},uAmb:{value:1},uPetal:{value:.85},uFlame:{value:1},uSky:{value:H(n.cobalt,T("#7fa6ff"),.45).multiplyScalar(.55)},uGround:{value:n.orange.clone().multiplyScalar(.3)},uWarm:{value:H(n.gold,n.orange,.55)},uPool:{value:1+2.1*b},uCamPosW:{value:new a.Vector3(0,1e4,0)},uCamDirW:{value:new a.Vector3(0,0,-1)},uLean:{value:0},uWindDir:{value:new a.Vector3(0,0,-1)},uWind:{value:0},uGust:{value:0}},P=ct(),Q=[],z=[],N=[],X=[],we=[],J=[T("#efe3c8"),T("#f3ead6"),T("#e8c98a"),H(n.orange,T("#ffffff"),.25),H(n.magenta,T("#ffffff"),.2)],Ue=[H(n.orange,n.gold,.4),n.magenta.clone(),H(n.cobalt,T("#6fa0ff"),.4),n.violet.clone(),n.orange.clone()];function O(e,o,r,s,l=1){let v,f,c,p;s===0?(v=t.range(.1,.14),f=Math.max(.42,t.range(1.3,2.5)*l*(1-1.15*b)),c=J[t()<.75?t.int(0,1):t.int(2,4)],p=.3):s===1?(v=t.range(.24,.38),f=Math.max(.35,t.range(.55,1.25)*l*(1-.75*b)),c=J[t.int(0,2)],p=.34):(v=t.range(.27,.33),f=t.range(.7,.85),c=Ue[t()<.5?0:t.int(0,4)],p=.25),Q.push({x:e,y:o,z:r,r:v,h:f,kind:s,col:c,fs:p*t.range(.9,1.15)*(1+.08*b),fy:o+(s===2?f*.55:f+v*.5)})}function te(e,o,r,s,l,v,f,c,p=.6,d=1){z.push({x:e,y:o,z:r,nx:s,ny:l,nz:v,r:f,col:c,em:p,tall:d})}for(let e=0;e<ce;e++)for(const o of[-1,1]){const r=ne(e),s=e===ce-1,l=s?10.9:ke+.75,v=pe(e)-.7;for(let f=l+t.range(0,.3);f<v;f+=t.range(.9,1.12))t.chance(.06)||O(o*f,r,ue(e)-t.range(.42,.6),2);if(s)for(let f=0;f<9;f++)O(o*t.range(11,15),r,t.range(-12.9,-8.2),t.chance(.5)?1:0);else{const f=Math.min(v,pe(e+1)-.4);for(let c=l+t.range(0,.3),p=0;c<f;c+=t.range(.72,.9),p++){const d=G===0?1:G===1?.72+.34*Math.sin(c*.9+D+e):p%5<3?1.08:.62;O(o*c,r,$e(e)+t.range(.45,.7),t.chance(.86)?0:1,d)}if(e<4)for(let c=l+t.range(.3,.7);c<f;c+=t.range(1.2,1.9))O(o*c,r,$e(e)+t.range(1.05,1.3),t.chance(.5)?0:1,.62)}we.push({position:new a.Vector3(o*(l+v)*.5,r+1.5,ue(e)-1.75),count:0})}const ee=e=>$(15,C*.5,bt(0,Math.min(S,42),e));for(const e of[-1,1]){for(let o=2.5;o<S-1;o+=t.range(2.6,3.6))O(e*(ee(o)+t.range(1,1.7)),0,me+o,t.chance(.6)?1:0,1.15);for(let o=0;o<16;o++){const r=t.range(0,Z),s=t.range(.3,2.6);O(e*18.6+Math.cos(r)*s,0,me+2.6+Math.sin(r)*s*.8,t.int(0,2),1.2)}}await i.yield?.();const k={crust:T("#c98a3c"),crustD:T("#8a4f1c"),sugar:T("#f1e2c0"),clay:n.terra.clone().multiplyScalar(.85),clayD:T("#2a1a18"),gilt:T("#d9a53a"),giltD:T("#8a5a1a"),orangeF:T("#ff8a1c"),lime:T("#9db53c"),glass:T("#9fc4e6"),white:T("#efe9dc"),cane:T("#5f7029"),caneD:T("#4a2f45"),leaf:T("#5e8a3a"),shoe:H(n.magenta,T("#3a0d14"),.55),wood:T("#7a4a26")},ae=new a.Color;function Ee(e,o,r){const s=t.int(2,3),l=t.range(0,Z);P.add(he([[.02,0],[1.75,0],[1.9,.1],[1.8,.16],[.02,.14]],12),E(e,o,r),n.cobalt.clone().multiplyScalar(.7),[0,.5,0],.1,t);for(let v=0;v<s;v++){const f=l+v/s*Z,c=s===2?.8:.95,p=e+Math.cos(f)*c,d=r+Math.sin(f)*c*.75,h=t.range(.78,.95),m=t.range(0,Z),M=(I,L,K,x)=>{x.copy(k.crustD).lerp(k.crust,Ve(L*1.4+.45,0,1)),t()<.3&&x.lerp(k.sugar,.55)};P.add(new a.SphereGeometry(1,9,6),E(p,o+.5*h,d,h*.86,h*.56,h*.86,m),M);for(let I=0;I<2;I++)P.add(new a.SphereGeometry(1,7,4),E(p,o+.86*h,d,h*.9,h*.2,h*.17,m+I*Math.PI/2,0,0),M);P.add(new a.SphereGeometry(1,6,4),E(p,o+1.08*h,d,h*.22),M)}}function de(e,o,r,s){P.add(he([[.02,0],[.7,0],[1.25,.22],[1.38,.3],[1.3,.34],[.7,.14],[.02,.12]],12),E(e,o,r),k.clay,[0,.35,0],.12,t);const l=s?.3:.36,v=s?k.lime:k.orangeF;for(let f=0,c=3;c>=1;c--,f++)for(let p=0;p<c;p++)for(let d=0;d<c;d++){ae.copy(v).multiplyScalar(t.range(.78,1.08)),s&&t()<.3&&ae.lerp(k.orangeF,.25);const h=e+(p-(c-1)/2)*l*1.95+t.range(-.03,.03),m=r+(d-(c-1)/2)*l*1.95+t.range(-.03,.03),M=ae.clone();P.add(new a.SphereGeometry(l,7,5),E(h,o+.3+l+f*l*1.5,m,1,.93,1,t.range(0,Z),t.range(-.4,.4)),(I,L,K,x)=>{x.copy(M),L>l*.82&&x.multiplyScalar(.45)},[.05,.3,0])}}function re(e,o,r,s,l){const v=Math.min(s,l)*.17,f=[[0,0],[0,.55],[.3,.9],[.55,.62],[.8,.95],[1,.5],[1,0]],c=[],p=[],d=[[-1,-1],[1,-1],[1,1],[-1,1]];for(let K=0;K<4;K++)for(let x=0;x<f.length;x++)c.push(d[K][0]*(s/2-v+f[x][0]*v),d[K][1]*(l/2-v+f[x][0]*v)+l/2,f[x][1]*v*.8);for(let K=0;K<4;K++)for(let x=0;x<f.length-1;x++){const _=K*f.length+x,Y=(K+1)%4*f.length+x;p.push(_,_+1,Y,Y,_+1,Y+1)}let h=new a.BufferGeometry;h.setAttribute("position",new a.Float32BufferAttribute(c,3)),h.setIndex(p),h=h.toNonIndexed(),h.computeVertexNormals();const m=-t.range(.14,.24),M=t.range(-.12,.12),I=E(e,o,r,1,1,1,M,m),L=(K,x,_,Y)=>{Y.copy(k.giltD).lerp(k.gilt,Ve(_/(v*.6),0,1))};P.add(h,I,L,[.04,1,0],.18,t);for(const K of d)P.add(new a.OctahedronGeometry(v*.62,1),I.clone().multiply(E(K[0]*(s/2-v*.5),K[1]*(l/2-v*.5)+l/2,v*.6,1,1,.6)),k.gilt,[.05,1,0]);P.add(new a.SphereGeometry(v*.9,7,4),I.clone().multiply(E(0,l+v*.15,v*.3,1.5,.8,.5)),k.gilt,[.05,1,0]),P.add(new a.BoxGeometry(v*.5,l*.9,v*.3),E(e,o+l*.42,r-l*.2,1,1,1,M,.22),k.wood),X.push(new a.Vector3(e,o+l*.5,r)),O(e+t.sign()*(s*.5+.55),o,r+t.range(.5,.8),1,.9),ie(e-Math.sign(e)*t.range(.2,.5)*s,o,r+t.range(.75,1.05))}function ie(e,o,r){P.add(he([[.02,0],[.24,0],[.26,.03],[.31,.74],[.325,.76],[.29,.74],[.25,.1],[.02,.08]],9),E(e,o,r),k.glass,[.1,1,0]),P.add(new a.CircleGeometry(.28,9),E(e,o+.56,r,1,1,1,0,-Math.PI/2),H(k.glass,n.gold,.35),[.5,1,0])}function De(e,o,r){const s=t.range(1.15,1.45),l=t.pick([n.cobalt,n.magenta,k.white]);P.add(he([[.02,0],[.52,0],[.56,.08],[.26,.22],[.18,.55],[.3,.78],[.62,1.02],[.76,1.36],[.72,1.52],[.63,1.5],[.6,1.34],[.02,1.3]],11),E(e,o,r,s),(v,f,c,p)=>{p.copy(k.clayD).lerp(k.clay,.35),f>1.08&&f<1.24&&p.copy(l).multiplyScalar(.8),f>1.46&&p.lerp(n.orange,.5)},[0,.45,0]),P.add(new a.CircleGeometry(.6,10),E(e,o+1.4*s,r,s,s,s,0,-Math.PI/2),(v,f,c,p)=>{p.setRGB(1,.3,.05).multiplyScalar(t.range(.5,1.3))},[3.2,0,0]),N.push(new a.Vector3(e,o+1.5*s,r))}function Ce(e,o,r,s,l){const v=t.pick([n.cobalt,n.indigo,k.white]);P.add(he([[.02,0],[.46,0],[.5,.06],[.78,.5],[.92,1.1],[.72,1.7],[.42,2.02],[.52,2.26],[.44,2.22],[.36,2]],11),E(e,o,r,s),(c,p,d,h)=>{h.copy(k.clay),p>.82&&p<1.38&&(h.copy(v).multiplyScalar(.75),Math.sin(Math.atan2(d,c)*6)>.3&&p>.95&&p<1.25&&h.copy(k.clay).lerp(n.gold,.5))},[0,.4,0],.1,t);const f=l?9:13;for(let c=0;c<f;c++){const p=t.range(0,Z),d=c===0?1.5:t.range(.25,1.35),h=(l?.75:.95)*s,m=Math.cos(p)*Math.cos(d),M=Math.sin(d),I=Math.sin(p)*Math.cos(d),L=l?H(n.magenta,T("#7a0f3a"),t.range(0,.5)):U();te(e+m*h,o+2.35*s+M*h*(l?1.5:.9),r+I*h,m,M+.4,I,(l?.36:.5)*s*t.range(.85,1.15),L,l?.35:.55,l?2.6:1)}}function Ne(e,o,r){for(const s of[-1,1]){const l=E(e+s*.42-.9,o,r+s*.12,1,1,1,.5+s*.1);P.add(new a.SphereGeometry(1,8,4),l.clone().multiply(E(0,.07,0,.36,.08,.82)),k.clayD),P.add(new a.SphereGeometry(1,8,5),l.clone().multiply(E(0,.24,.36,.34,.24,.46)),k.shoe,[0,.9,0]),P.add(new a.SphereGeometry(1,8,5),l.clone().multiply(E(0,.3,-.34,.33,.33,.42)),k.shoe,[0,.9,0]),P.add(new a.CircleGeometry(.24,8),l.clone().multiply(E(0,.615,-.3,1,1.25,1,0,-Math.PI/2)),k.clayD),P.add(new a.BoxGeometry(.7,.07,.13),l.clone().multiply(E(0,.47,0)),k.shoe,[0,.9,0]),P.add(new a.SphereGeometry(.07,5,3),l.clone().multiply(E(s*.33,.45,0)),k.gilt,[.1,1,0])}P.add(he([[.02,0],[.34,0],[.72,.16],[.78,.24],[.7,.22],[.02,.1]],10),E(e+1,o,r+.2),n.cobalt.clone().multiplyScalar(.8),[0,.6,0]),P.add(he([[.6,.18],[.34,.36],[.02,.48]],9),E(e+1,o,r+.2),k.white,[.03,0,0],.08,t)}function Te(e,o,r){const s=t.range(-.3,.3),l=[n.magenta,n.violet,n.indigo,n.magenta,n.orange],v=(c,p,d,h)=>{const m=Math.floor((c+3)*2.4);h.copy(l[(m%5+5)%5]).multiplyScalar(m%2?.8:.55)};for(let c=0;c<3;c++)P.add(new a.BoxGeometry(2.7-c*.12,.2,1.7-c*.1,12,1,2),E(e,o+.1+c*.2,r+c*.04,1,1,1,s+(c-1)*.03),v);const f=new a.PlaneGeometry(2.5,.55,16,1);f.rotateX(-Math.PI/2),P.add(f,E(e,o+.03,r+1.05,1,1,1,s),(c,p,d,h)=>{h.copy(Math.round((c+3)*6.4)%2?n.magenta:n.indigo).multiplyScalar(.6)})}function Ge(e,o,r,s){const l=t.range(4.6,6.2);for(let v=0;v<3;v++){const f=[],c=(v-1)*.3,p=l+(v-1)*t.range(.2,.5),d=H(k.cane,k.caneD,t.range(0,.6));for(let h=0;h<=14;h++){const m=h/14,M=2*m-1;f.push(new a.Vector3($(e,o,m)+(v-1)*.12*M,r+p*Math.pow(Math.max(1-M*M,0),.62),s+c+Math.sin(m*5+v)*.08))}P.add(Dt(f,(h,m)=>.17*(m%2?1.22:1),6),E(0,0,0),(h,m,M,I)=>{I.copy(d).multiplyScalar(.75+.35*Math.abs(Math.sin(h*3.1+m*2.3)))},[0,.15,0]);for(let h=0;h<3;h++){const m=t.range(.3,.7),M=2*m-1,I=$(e,o,m),L=r+p*Math.pow(1-M*M,.62),K=t.range(1.8,2.8),x=t.sign(),_=t.range(.4,1.2),Y=new a.BufferGeometry;Y.setAttribute("position",new a.Float32BufferAttribute([0,0,-.14,0,0,.14,x*K*.5,.5,_*.5+.12,x*K*.5,.5,_*.5-.12,x*K,-.5,_],3)),Y.setIndex([0,1,2,0,2,3,3,2,4,2,1,0,3,2,0,4,2,3]),Y.computeVertexNormals(),P.add(Y,E(I,L,s+c),k.leaf,[0,.2,0],.3,t)}}}const fe=[];for(let e=0;e<ce-1;e++)for(const o of[-1,1]){const r=ke+1.3,s=pe(e)-1.5,l=Math.max(1,Math.floor((s-r)/3.2));for(let v=0;v<l;v++)fe.push({i:e,sx:o,x:o*(r+(v+.5)*(s-r)/l+t.range(-.25,.25)),y:ne(e),z:ue(e)-1.8+t.range(-.15,.15),w:(s-r)/l})}t.shuffle(fe);const xe=[],ve=(e,o)=>{for(let r=0;r<o;r++)xe.push(e)};ve("frame",12),ve("loaves",8),ve("orange",6),ve("lime",3),ve("censer",6),ve("vase",4),ve("cock",3),ve("shawl",1);const qe=fe.filter(e=>e.i>=1&&e.i<=3&&Math.abs(e.x)<12.5),se=qe[0]||fe[0],oe=qe.find(e=>e!==se&&e.sx!==se.sx)||fe[1];let Ae=new a.Vector3(oe.x,oe.y,oe.z);Ne(se.x,se.y,se.z),O(se.x+.2,se.y,se.z-.75,1,.8),ie(oe.x+1.3,oe.y,oe.z+.3),O(oe.x-1.2,oe.y,oe.z-.5,1,.8);let Ke=0;for(const e of fe){if(e===se||e===oe)continue;await i.yield?.();const o=xe[Ke++%xe.length];if(o==="frame"){const r=t.range(.8,1.4);re(e.x,e.y,e.z-.6,2.1*r*t.range(.85,1.15),2.7*r*t.range(.9,1.2))}else o==="loaves"?Ee(e.x,e.y,e.z):o==="orange"||o==="lime"?de(e.x,e.y,e.z,o==="lime"):o==="censer"?(De(e.x,e.y,e.z),t.chance(.6)&&O(e.x+t.sign()*1.1,e.y,e.z+.3,1,.8)):o==="vase"||o==="cock"?Ce(e.x,e.y,e.z,t.range(1,1.3),o==="cock"):Te(e.x,e.y,e.z);t.chance(.5)&&O(e.x+t.sign()*e.w*.42,e.y,e.z+t.range(-.4,.5),t.chance(.5)?1:0,.8)}const je=t.shuffle([1,2,3,4,5]).slice(0,t.int(1,2));for(const e of je)for(const o of[-1,1]){const r=ke+1+t.range(0,.6),s=pe(e)-1.1;Ge(o*r,o*s,ne(e),ue(e)-1.15),await i.yield?.()}for(const e of[-1,1])Ce(e*12.6,ne(6),-9.6,1.9,!1),Ce(e*14.6,ne(6),-11.6,1.5,q===1);await i.yield?.();const Gt=t.int(7,10);for(let e=0;e<Gt;e++){const o=t.int(1,6),r=e%2?1:-1,s=r*t.range(ke+2.6,pe(o)-2.8),l=ne(o)-1.5,v=ue(o)+.16;if(e%3!==2){te(s,l,v,0,0,1,.62,U(0),.75);for(let f=0;f<8;f++){const c=f/8*Z;te(s+Math.cos(c)*.88,l+Math.sin(c)*.88,v,0,0,1,.36,U(1),.7)}for(let f=0;f<8;f++){const c=(f+.5)/8*Z;for(let p=0;p<2;p++)te(s+Math.cos(c)*(1.42+p*.5),l+Math.sin(c)*(1.42+p*.5)*.9,v,0,0,1,.3-p*.07,U(1),.7)}}else{for(let f=-2;f<=1;f++)te(s,l-f*.6,v,0,0,1,.4,U(),.7);for(const f of[-1.2,-.6,.6,1.2])te(s+f,l+.45,v,0,0,1,.38,U(),.7)}}for(let e=0;e<ce;e++)for(const o of[-1,1]){const r=e===ce-1?10.4:ke+.4,s=pe(e)-.2,l=Math.max(1,Math.round((s-r)/4.4)),v=(s-r)/l;for(let f=0;f<l;f++)for(let c=0;c<=10;c++){const p=c/10,d=(.75+.03*v*v)*(1-(2*p-1)*(2*p-1));te(o*(r+(f+p)*v),ne(e)-.22-d+t.range(-.05,.05),ue(e)+.2+t.range(0,.1),t.range(-.3,.3),t.range(-.2,.4),1,(c===0||c===10?.42:.31)*t.range(.85,1.15),U(),.6)}}await i.yield?.();const R={},Vt=Math.round(1320*$(.75,1,(y-.6)/.4));for(let e=0;e<Vt;e++){const o=t.range(0,We),r=t.range(-.75,Math.PI+.8);ft(o,r,1+t.range(-.04,.1),R);let l=(q===2?Math.sin(o*.9+r*2.2)>.55:q===0?Math.abs((o+3)%6.5-3.25)<.55:!1)?H(n.gold,n.orange,t.range(0,.2)).multiplyScalar(t.range(.9,1.05)):U();if(q===1)for(const v of[We*.5,j.spring-j.y0,We-(j.spring-j.y0)])Math.abs(o-v)<1.5&&Math.abs(r-Math.PI/2)<.75&&(l=H(n.magenta,T("#7a0f3a"),t.range(0,.4)));te(R.px,R.py,R.pz,R.nx,R.ny,R.nz,t.range(.55,1),l,.5)}for(let e=0;e<ce;e++)for(let o=-6.3;o<=6.3;o+=t.range(.5,.66))te(o,ne(e)+.1,ue(e)+.05+t.range(-.06,.06),t.range(-.2,.2),1,.9,t.range(.24,.33),U(0),.9);for(const e of[-1,1])for(let o=0;o<=38;o++){const r=o/38,s=2.6*4*r*(1-r);te(e*$(7.4,pe(6)-.7,r),$(38.2,21.5,r)-s,$(-8,-7.5,r),t.range(-.3,.3),.3,1,t.range(.36,.5),U(),.6)}for(const e of[-1,1])for(let o=.6;o<S;o+=t.range(.7,1.5)/Math.max(y,.6))te(e*(ee(o)-t.range(-.3,.9)),.2,me+o,t.range(-.3,.3),1,t.range(-.3,.3),t.range(.32,.5),U(),.9);await i.yield?.();const kt=H(n.indigo,n.terra,.3).multiplyScalar(.5);for(let e=0;e<ce;e++){const o=ue(e)-.14-Fe,r=pe(e)-.14;P.add(new a.BoxGeometry(r*2,lt-.07,o,12,1,2),E(0,ne(e)-lt/2-.035,Fe+o/2),kt)}if(F){const e=F.width,o=F.height,r=H(H(n.indigo,n.cobalt,.55),T("#8a8aa0"),.14),s=n.terra.clone().multiplyScalar(.75);P.add(new a.PlaneGeometry(e,o,Math.round(e/2),Math.round(o/2)),E(0,o/2,Fe-.06),(l,v,f,c)=>{const p=v+o/2;p<8?c.copy(s):p<8.5?c.copy(n.gold).multiplyScalar(.5):c.copy(r),c.multiplyScalar(1-.45*(p/o))},[0,0,1])}await i.yield?.();const Ye=new Map;for(const e of Q){const o=Math.round(e.x/2.5)+","+Math.round(e.y/3)+","+Math.round(e.z/2.5);let r=Ye.get(o);r||Ye.set(o,r=[0,0,0,0]),r[0]+=e.x,r[1]+=e.fy,r[2]+=e.z,r[3]+=1}const Me=new Float32Array(Ye.size*4);let Xe=0;for(const e of Ye.values())Me[Xe++]=e[0]/e[3],Me[Xe++]=e[1]/e[3],Me[Xe++]=e[2]/e[3],Me[Xe++]=e[3];const le=(e,o,r,s,l,v)=>{let f=0;for(let c=0;c<Me.length;c+=4){const p=Me[c+2]-r;if(p>22||p<-22)continue;const d=Me[c]-e,h=Me[c+1]-o,m=d*d+h*h+p*p;if(m>484)continue;const M=(d*s+h*l+p*v)/Math.sqrt(m+.3)*.62+.38;if(M<=0)continue;const I=1+m*.22;f+=Me[c+3]*M/(I*Math.sqrt(I))}return Math.min(f*.32,1.2)};for(const e of we){let o=0;for(const r of Q)Math.abs(r.x-e.position.x)<8&&Math.abs(r.y+1.5-e.position.y)<1&&o++;e.count=o}const vt=At(W),pt=new a.Mesh(await P.build(le,i),vt);pt.name="offerings",B.add(pt),await i.yield?.();const Ze=[];for(let e=0;e<ce;e++)for(const o of[-1,1]){const r=ne(e),s=ue(e),l=$e(e),v=6.1,f=pe(e),c=Math.round((f-v)/.62);Ze.push(Se(Math.ceil(c/2),2,(p,d)=>{const h=o*$(v,f,p),m=$(s+.04,l,d);return[h,r,m,h,-.001-(s+.04-m),0,le(h,r,m,0,1,0)]})),Ze.push(Se(c,4,(p,d)=>{const h=$(v,f+.04,p),m=d*2.75,M=.12*Math.sin(h*2.4+e*1.7)*d+.05*Math.sin(h*5.3+e)*d*d,I=s+.04+M+.06*d;return[o*h,r-m,I,o*h,m,0,le(o*h,r-m,I,0,.15,1)]})),Ze.push(Se(Math.ceil((s-Fe)/.7),4,(p,d)=>{const h=$(s+.04,Fe+.02,p),m=d*2.75,M=o*(f+.04+.1*Math.sin(h*2.6+e)*d+.06*d);return[M,r-m,h,h+50,m,0,le(M,r-m,h,o,.15,.3)*.9+.05]})),await i.yield?.()}const Lt=at(Ze);await i.yield?.();const ht=new a.Mesh(Lt,$t(W,g[0].clone().multiplyScalar(.85),g[1].clone().multiplyScalar(.85),g[2].clone().multiplyScalar(.9)));ht.name="cloth",B.add(ht),await i.yield?.();const Oe=[];Oe.push(Se(14,Math.ceil(S/2),(e,o)=>{const r=o*S,s=ee(r)+1.2,l=(e*2-1)*s;return[l,.15,me+r,l,r+100,s-Math.abs(l),le(l,.15,me+r,0,1,0),1]})),await i.yield?.();let Je=0;for(let e=0;e<ce;e++){const o=e===0?.15:ne(e-1)+.08,r=ne(e)+.08,s=ue(e)+.09,l=$e(e)+(e===ce-1?0:.09),v=Je;Oe.push(Se(10,2,(c,p)=>{const d=(c*2-1)*7.5,h=$(o,r,p);return[d,h,s,d,v+(h-o),(7.5-Math.abs(d))*2,le(d,h,s,0,.2,1)*.7,$(.42,.78,p)]})),Je+=r-o;const f=Je;Oe.push(Se(10,2,(c,p)=>{const d=(c*2-1)*7.5,h=$(s,l,p);return[d,r,h,d,f+(s-h),(7.5-Math.abs(d))*2,le(d,r,h,0,1,0),p<.25?1.12:p<.75?1:.55]})),Je+=s-l}await i.yield?.(),Oe.push(Se(60,10,(e,o)=>{const r=e*We,s=$(-.95,Math.PI+.95,o);return ft(r,s,.92,R),[R.px,R.py,R.pz,r,s*2.1-1e3,9,le(R.px,R.py,R.pz,R.nx,R.ny,R.nz),.3]})),await i.yield?.();const Nt=Mt(W,n),dt=new a.Mesh(at(Oe),Nt);dt.name="petals",B.add(dt),await i.yield?.();{const e=It(),o=z.length,r=new Float32Array(o*3),s=new Float32Array(o*3),l=new Float32Array(o*3),v=new Float32Array(o*4),f=new Float32Array(o*2),c=new a.Quaternion,p=new a.Quaternion,d=new a.Vector3(0,1,0),h=new a.Vector3;for(let I=0;I<o;I++){const L=z[I];(I&255)===0&&await i.yield?.(),h.set(L.nx,L.ny,L.nz).normalize(),c.setFromUnitVectors(d,h),p.setFromAxisAngle(d,t.range(0,Z)),c.multiply(p),r.set([L.x,L.y,L.z],I*3),s.set([L.col.r,L.col.g,L.col.b],I*3),v.set([c.x,c.y,c.z,c.w],I*4),f.set([L.r,L.r*t.range(.85,1.2)*L.tall],I*2),l.set([le(L.x,L.y,L.z,h.x,h.y,h.z),t(),L.em],I*3)}const m=new a.InstancedBufferGeometry;m.index=e.index,m.setAttribute("position",e.attributes.position),m.setAttribute("normal",e.attributes.normal),m.setAttribute("iPos",new a.InstancedBufferAttribute(r,3)),m.setAttribute("iCol",new a.InstancedBufferAttribute(s,3)),m.setAttribute("iDat",new a.InstancedBufferAttribute(l,3)),m.setAttribute("iQuat",new a.InstancedBufferAttribute(v,4)),m.setAttribute("iSc",new a.InstancedBufferAttribute(f,2)),m.instanceCount=o;const M=new a.Mesh(m,zt(W));M.frustumCulled=!1,M.name="marigold-heads",B.add(M)}await i.yield?.();{const e=he([[1,0],[.97,.95],[.72,1],[.02,.9]],6).toNonIndexed(),o=new a.CylinderGeometry(.1,.12,.35,3,1,!0).toNonIndexed();o.translate(0,1.075,0);const r=[...e.attributes.position.array,...o.attributes.position.array,...Wt],s=new a.BufferGeometry;s.setAttribute("position",new a.Float32BufferAttribute(r,3)),s.computeVertexNormals();const l=Q.length,v=new Float32Array(l*3),f=new Float32Array(l*3),c=new Float32Array(l*3),p=new Float32Array(l*2),d=new Float32Array(l*3),h=new Float32Array(l*3);Q.forEach((x,_)=>{v.set([x.x,x.y,x.z],_*3),f.set([x.col.r,x.col.g,x.col.b],_*3),p.set([x.r,x.h],_*2);const Y=t();c.set([le(x.x,x.y+x.h*.5,x.z,0,.3,.95)*.6,Y,x.kind===2?1:0],_*3),d.set([x.x,x.kind===2?x.y+x.h*.8:x.y+x.h+x.r*.35,x.z],_*3),h.set([x.fs,Y,1+.12*b],_*3)});const m=new a.InstancedBufferGeometry;m.setAttribute("position",s.attributes.position),m.setAttribute("normal",s.attributes.normal),m.setAttribute("iPos",new a.InstancedBufferAttribute(v,3)),m.setAttribute("iCol",new a.InstancedBufferAttribute(f,3)),m.setAttribute("iDat",new a.InstancedBufferAttribute(c,3)),m.setAttribute("iSc",new a.InstancedBufferAttribute(p,2)),m.instanceCount=l;const M=new a.Mesh(m,St(W));M.frustumCulled=!1,M.name="candles",B.add(M);const I=new a.PlaneGeometry(2.6,3.2);I.translate(0,.9,0);const L=new a.InstancedBufferGeometry;L.index=I.index,L.setAttribute("position",I.attributes.position),L.setAttribute("iPos",new a.InstancedBufferAttribute(d,3)),L.setAttribute("iInfo",new a.InstancedBufferAttribute(h,3)),L.instanceCount=l;const K=new a.Mesh(L,Ct(W));K.frustumCulled=!1,K.renderOrder=3,K.name="flames",B.add(K)}await i.yield?.();{const e=new a.BufferGeometry;e.setAttribute("position",new a.Float32BufferAttribute([0,0,-1,.55,0,-.3,.5,0,.5,0,0,1,-.5,0,.5,-.55,0,-.3],3)),e.setIndex([0,5,1,1,5,4,1,4,2,2,4,3]);const o=[],r=[],s=[],l=(m,M,I,L,K,x)=>{const _=U();s.push(m,M,I),o.push(t.range(0,Z),L,K,x),r.push(_.r,_.g,_.b,t())},v=Math.round(900*y),f=Math.round(520*y),c=Math.round(520*y),p=Math.round(190*y);for(let m=0;m<v;m++){const M=t.range(0,S),I=t.sign();l(I*(ee(M)-.4+Math.abs(t.gauss())*1.7),.06,me+M,t.range(-.2,.2),t.range(.16,.3),0)}for(let m=0;m<f;m++){const M=t.range(0,S);l(t.range(-1,1)*ee(M),.24,me+M,t.range(-.3,.3),t.range(.16,.28),0)}await i.yield?.();for(let m=0;m<c;m++){const M=t.int(0,ce-1),I=t.chance(.55),L=I?t.sign()*(6.9+Math.abs(t.gauss())*1.1):t.range(-6.6,6.6);l(L,ne(M)+(Math.abs(L)<7.4?.17:.06),t.range($e(M)+.3,ue(M)-.1),t.range(-.3,.3),t.range(.16,.28),0)}for(let m=0;m<p;m++)ft(t.range(We*.12,We*.88),t.range(1,Math.PI+.3),1.1,R),l(R.px,R.py,R.pz,R.py-j.y0-.2+t.range(0,5),t.range(.2,.34),1);const d=new a.InstancedBufferGeometry;d.index=e.index,d.setAttribute("position",e.attributes.position),d.setAttribute("iPos",new a.InstancedBufferAttribute(new Float32Array(s),3)),d.setAttribute("iA",new a.InstancedBufferAttribute(new Float32Array(o),4)),d.setAttribute("iB",new a.InstancedBufferAttribute(new Float32Array(r),4)),d.instanceCount=s.length/3;const h=new a.Mesh(d,Bt(W));h.frustumCulled=!1,h.name="loose-petals",B.add(h)}await i.yield?.();{const e=[],o=[],r=[],s=[],l=[];let v=0;const f=14;for(const d of N)for(let h=0;h<2;h++){const m=t();for(let M=0;M<=f;M++)for(const I of[-1,1])e.push(d.x,d.y,d.z),o.push(I,M/f),r.push(d.x,d.y-.1,d.z),s.push(m);for(let M=0;M<f;M++){const I=v+M*2;l.push(I,I+1,I+2,I+1,I+3,I+2)}v+=(f+1)*2}const c=new a.BufferGeometry;c.setAttribute("position",new a.Float32BufferAttribute(e,3)),c.setAttribute("uv",new a.Float32BufferAttribute(o,2)),c.setAttribute("aBase",new a.Float32BufferAttribute(r,3)),c.setAttribute("aPh",new a.Float32BufferAttribute(s,1)),c.setIndex(l);const p=new a.Mesh(c,Xt(W,n.violet.clone()));p.frustumCulled=!1,p.renderOrder=2,p.name="incense",B.add(p)}if(F&&u.flags!==!1){const e=[],o=[],r=[],s=[],l=[];let v=0;const f=F.width/2-.8,c=Fe+.5,p=T("#cdbf9f");for(const m of[-1,1])for(const M of[[10.8,40.4,f,37.6,1.6],[12.6,33.6,f,28.6,1.9]]){if(M[1]>F.height-1)continue;const I=M[2]-M[0],L=Math.max(2,Math.floor(I/3.05)),K=x=>[m*$(M[0],M[2],x),$(M[1],M[3],x)-M[4]*4*x*(1-x)];for(let x=0;x<=12;x++){const _=K(x/12);for(const Y of[.11,-.11])e.push(_[0],_[1]+Y,c),o.push(.5,.5),r.push(p.r,p.g,p.b),s.push(-1,0,le(_[0],_[1],c,0,-.3,1))}for(let x=0;x<12;x++){const _=v+x*2;l.push(_,_+1,_+2,_+1,_+3,_+2)}v+=26;for(let x=0;x<L;x++){const _=K((x+.5)/L),Y=V[(x+(m>0?1:0))%V.length].clone().multiplyScalar(.8),Tt=t.int(0,3),qt=t(),_t=le(_[0],_[1]-1.5,c,0,-.3,1)+.12,Ut=2.7,Et=t.range(2.9,3.3),Kt=(K((x+.9)/L)[1]-K((x+.1)/L)[1])/(.8*I/L);for(let Pe=0;Pe<=4;Pe++)for(let Be=0;Be<=4;Be++){const ze=(Be/4-.5)*Ut;e.push(_[0]+ze,_[1]+m*ze*Kt-Pe/4*Et,c+.04+Pe/4*.12),o.push(Be/4,1-Pe/4),r.push(Y.r,Y.g,Y.b),s.push(Tt,qt,_t)}for(let Pe=0;Pe<4;Pe++)for(let Be=0;Be<4;Be++){const ze=v+Pe*5+Be;l.push(ze,ze+5,ze+1,ze+1,ze+5,ze+6)}v+=25}}const d=new a.BufferGeometry;d.setAttribute("position",new a.Float32BufferAttribute(e,3)),d.setAttribute("uv",new a.Float32BufferAttribute(o,2)),d.setAttribute("aCol",new a.Float32BufferAttribute(r,3)),d.setAttribute("aK",new a.Float32BufferAttribute(s,3)),d.setIndex(l);const h=new a.Mesh(d,Ft(W));h.name="flags",B.add(h)}const Qe=new a.Group,ot=new a.Group;{const e=ct(),o=[n.magenta,n.gold,n.cobalt,n.orange];e.add(he([[.02,0],[.07,.14],[.42,.62],[.52,.88],[.44,1.08],[.2,1.2],[.12,1.34],[.17,1.42],[.02,1.45]],12),E(0,0,0,1.25),(s,l,v,f)=>{const c=Math.atan2(v,s);l<.2?f.copy(k.giltD):l>1.1?f.copy(k.wood):f.copy(Math.sin(c*2+l*5)>0?o[Math.floor(l*4.2)%4]:k.wood).multiplyScalar(.9)},[.05,.8,0]);const r=new a.Mesh(await e.build(()=>le(Ae.x,Ae.y+.8,Ae.z,0,.5,.85),i),vt);ot.add(r),Qe.add(ot),Qe.position.copy(Ae),Qe.name="spinning-top",B.add(Qe)}await i.yield?.();const et=19*Math.PI/180,Re=new a.Vector3(0,Math.sin(et),-Math.cos(et)),_e=new a.Vector3(0,29.5,j.z),nt=j.z+(29.5-7)/Math.tan(et),rt={portalSeat:{position:_e.clone(),normal:Re.clone().negate(),tilt:et,width:14,height:17},flyThrough:[new a.Vector3(0,7,nt+70),new a.Vector3(0,7,nt+30),new a.Vector3(0,7.25,nt+8),_e.clone().addScaledVector(Re,-60),_e.clone().addScaledVector(Re,-40),_e.clone().addScaledVector(Re,-20),_e.clone()],lookAt:new a.Vector3(0,24,-8),viewpoints:{door:new a.Vector3(0,7,116),carpet:new a.Vector3(0,7,62),climb:_e.clone().addScaledVector(Re,-30)},foot:new a.Vector3(0,0,me),roadEnd:new a.Vector3(0,.15,me+S),roadWidth:C,censers:N.map(e=>e.clone()),candleGroups:we,frames:X,top:Ae.clone(),keepOut:[]};for(let e=0;e<ce;e++)for(const o of[-1,1])rt.keepOut.push({min:new a.Vector3(o>0?ke:-pe(e),0,Fe),max:new a.Vector3(o>0?pe(e):-ke,ne(e)+3,ue(e))});for(const e of[-1,1])rt.keepOut.push({min:new a.Vector3(e*j.r-1.6,21,j.z-3),max:new a.Vector3(e*j.r+1.6,42,j.z+3)});const tt=new a.Vector3,mt=new a.Vector3,He=new a.Vector3;let gt=!1,it=0,yt=!1;const st=(e,o)=>{o!=null&&e.value.set(o)};return{object:B,radius:30,height:41.5,center:new a.Vector3(0,17,4),anchors:rt,uniforms:W,setProgress(e){W.uProgress.value=Ve(e,0,1)},setWind(e,o,r=1){const s=Math.hypot(e,o);s>1e-4&&W.uWindDir.value.set(e/s,0,o/s),W.uWind.value=Ve(r,0,1)},setGust(e){W.uGust.value=Ve(e,0,1)},setTravel(e,o=1){yt=!0,e&&e.lengthSq()>1e-6&&W.uCamDirW.value.copy(e).normalize(),W.uLean.value=Ve(o,0,1)},setLight(e={}){st(W.uSky,e.sky),st(W.uGround,e.ground),st(W.uWarm,e.warm),e.ambient!==void 0&&(W.uAmb.value=e.ambient),e.petal!==void 0&&(W.uPetal.value=e.petal),e.flame!==void 0&&(W.uFlame.value=e.flame)},update(e,o,r){if(W.uTime.value=o,ot.rotation.y=o*10.5,Qe.rotation.set(.12*Math.sin(o*1.3),0,.12*Math.cos(o*1.3)),!!r){if(r.getWorldPosition(tt),W.uCamPosW.value.copy(tt),!yt&&gt&&e>1e-4){He.subVectors(tt,mt);const s=He.length()/e;if(s<150){if(s>.5){He.multiplyScalar(1/(s*e));const l=W.uCamDirW.value.lerp(He,Math.min(1,e*4));l.lengthSq()>1e-6?l.normalize():l.copy(He)}it+=(bt(2,8,s)-it)*Math.min(1,e*3),W.uLean.value=it}}mt.copy(tt),gt=!0}},dispose(){},ground:!0,groundY:0}}function aa(i,u={}){const t=u.palette&&u.palette.length>=7?u.palette:wt,y=u.points||[[0,0,6],[0,40,6]],w=u.y??.15,n={orange:T(t[2]),gold:T(t[3])};n.deep=H(n.orange,T(t[6]),.6),n.orange.g*=.86,n.orange.b*=.5;const S=u.uniforms||{uTime:{value:0},uProgress:{value:0},uAmb:{value:1},uPetal:{value:1.4},uSky:{value:T(t[1]).multiplyScalar(.45)},uGround:{value:n.orange.clone().multiplyScalar(.3)},uWarm:{value:H(n.gold,n.orange,.55)}},C=[];let b=0;for(let g=0;g<y.length-1;g++){const V=y[g],A=y[g+1],q=Math.hypot(A[0]-V[0],A[1]-V[1]),G=Math.max(1,Math.ceil(q/2));for(let D=g===0?0:1;D<=G;D++){const U=D/G;C.push([$(V[0],A[0],U),$(V[1],A[1],U),$(V[2],A[2],U),b+q*U])}b+=q}const F=Se(8,C.length-1,(g,V)=>{const A=Math.round(V*(C.length-1)),q=C[A],G=C[Math.max(A-1,0)],D=C[Math.min(A+1,C.length-1)];let U=D[0]-G[0],W=D[1]-G[1];const P=Math.hypot(U,W)||1;U/=P,W/=P;const Q=q[2]*.5+.5,z=(g*2-1)*Q,N=Math.min(1.3,Q*.55);return[q[0]+W*z,w,q[1]-U*z,z,q[3]-4e3,(Q-Math.abs(z))*2.4/N,u.glow??0,1]}),B=new a.Mesh(at([F]),Mt(S,n));return B.name="petal-road",{object:B,uniforms:S,material:B.material,update(g,V){u.uniforms||(S.uTime.value=V)}}}const oa={makeBatch:ct,M:E,lathe:he,gridGeo:Se,mergeGrids:at,tubeGeo:Dt,shader:be,litMaterial:At,hex:T,mixc:H,GLSL_COMMON:Ie,FOG_V:ge,FOG_F:ye,FOG_ADD:xt,V_WORLD:Le,WAKE:ut,QROT:Pt};function na(i,u,t,y,w=0){const n=he([[1,0],[.97,.95],[.72,1],[.02,.9]],6).toNonIndexed(),S=new a.CylinderGeometry(.1,.12,.35,3,1,!0).toNonIndexed();S.translate(0,1.075,0);const C=[...n.attributes.position.array,...S.attributes.position.array,...Wt],b=new a.BufferGeometry;b.setAttribute("position",new a.Float32BufferAttribute(C,3)),b.computeVertexNormals(),n.dispose(),S.dispose();const F=u.length,B=new Float32Array(F*3),g=new Float32Array(F*3),V=new Float32Array(F*3),A=new Float32Array(F*2),q=new Float32Array(F*3),G=new Float32Array(F*3);u.forEach((z,N)=>{B.set([z.x,z.y,z.z],N*3),g.set([z.col.r,z.col.g,z.col.b],N*3),A.set([z.r,z.h],N*2);const X=y();V.set([t(z.x,z.y+z.h*.5,z.z,0,.3,.95)*.6,X,z.kind===2?1:0],N*3),q.set([z.x,z.kind===2?z.y+z.h*.8:z.y+z.h+z.r*.35,z.z],N*3),G.set([z.fs,X,1+.12*w],N*3)});const D=new a.InstancedBufferGeometry;D.setAttribute("position",b.attributes.position),D.setAttribute("normal",b.attributes.normal),D.setAttribute("iPos",new a.InstancedBufferAttribute(B,3)),D.setAttribute("iCol",new a.InstancedBufferAttribute(g,3)),D.setAttribute("iDat",new a.InstancedBufferAttribute(V,3)),D.setAttribute("iSc",new a.InstancedBufferAttribute(A,2)),D.instanceCount=F;const U=new a.Mesh(D,St(i));U.frustumCulled=!1,U.name="house-candles";const W=new a.PlaneGeometry(2.6,3.2);W.translate(0,.9,0);const P=new a.InstancedBufferGeometry;P.index=W.index,P.setAttribute("position",W.attributes.position),P.setAttribute("iPos",new a.InstancedBufferAttribute(q,3)),P.setAttribute("iInfo",new a.InstancedBufferAttribute(G,3)),P.instanceCount=F;const Q=new a.Mesh(P,Ct(i));return Q.frustumCulled=!1,Q.renderOrder=3,Q.name="house-flames",{body:U,flames:Q}}async function ra(i,u,t,y,w){const n=It(),S=u.length,C=new Float32Array(S*3),b=new Float32Array(S*3),F=new Float32Array(S*3),B=new Float32Array(S*4),g=new Float32Array(S*2),V=new a.Quaternion,A=new a.Quaternion,q=new a.Vector3(0,1,0),G=new a.Vector3;for(let W=0;W<S;W++){const P=u[W];(W&255)===0&&await w?.yield?.(),G.set(P.nx,P.ny,P.nz),G.lengthSq()<1e-6&&G.set(0,1,0),G.normalize(),V.setFromUnitVectors(q,G),A.setFromAxisAngle(q,y.range(0,Z)),V.multiply(A),C.set([P.x,P.y,P.z],W*3),b.set([P.col.r,P.col.g,P.col.b],W*3),B.set([V.x,V.y,V.z,V.w],W*4),g.set([P.r,P.r*y.range(.85,1.2)*(P.tall??1)],W*2),F.set([t(P.x,P.y,P.z,G.x,G.y,G.z),y(),P.em??.6],W*3)}const D=new a.InstancedBufferGeometry;D.index=n.index,D.setAttribute("position",n.attributes.position),D.setAttribute("normal",n.attributes.normal),D.setAttribute("iPos",new a.InstancedBufferAttribute(C,3)),D.setAttribute("iCol",new a.InstancedBufferAttribute(b,3)),D.setAttribute("iDat",new a.InstancedBufferAttribute(F,3)),D.setAttribute("iQuat",new a.InstancedBufferAttribute(B,4)),D.setAttribute("iSc",new a.InstancedBufferAttribute(g,2)),D.instanceCount=S;const U=new a.Mesh(D,zt(i));return U.frustumCulled=!1,U.name="house-heads",U}function ia(i,u,t){const y=new a.BufferGeometry;y.setAttribute("position",new a.Float32BufferAttribute([0,0,-1,.55,0,-.3,.5,0,.5,0,0,1,-.5,0,.5,-.55,0,-.3],3)),y.setIndex([0,5,1,1,5,4,1,4,2,2,4,3]);const w=u.length,n=new Float32Array(w*3),S=new Float32Array(w*4),C=new Float32Array(w*4);u.forEach((B,g)=>{n.set([B[0],B[1],B[2]],g*3),S.set([t.range(0,Z),t.range(-.25,.25),B[3],0],g*4),C.set([B[4],B[5],B[6],t()],g*4)});const b=new a.InstancedBufferGeometry;b.index=y.index,b.setAttribute("position",y.attributes.position),b.setAttribute("iPos",new a.InstancedBufferAttribute(n,3)),b.setAttribute("iA",new a.InstancedBufferAttribute(S,4)),b.setAttribute("iB",new a.InstancedBufferAttribute(C,4)),b.instanceCount=w;const F=new a.Mesh(b,Bt(i));return F.frustumCulled=!1,F.name="house-loose-petals",F}function sa(i,u,t,y){const w=[],n=[],S=[],C=[],b=[];let F=0;const B=T("#cdbf9f");for(const A of u){const q=!!A.zrow,G=A.face??1,D=(z,N,X)=>{q?w.push(A.z+G*X,N,z):w.push(z,N,A.z+X)},U=(z,N)=>q?t(A.z+G*.3,N,z,G,-.3,0):t(z,N,A.z,0,-.3,1),W=z=>[$(A.x0,A.x1,z),A.y-A.sag*4*z*(1-z)],P=Math.abs(A.x1-A.x0),Q=A.cord??.13;for(let z=0;z<=12;z++){const N=W(z/12);for(const X of[Q,-Q])D(N[0],N[1]+X,0),n.push(.5,.5),S.push(B.r,B.g,B.b),C.push(-1,0,U(N[0],N[1]))}for(let z=0;z<12;z++){const N=F+z*2;b.push(N,N+1,N+2,N+1,N+3,N+2)}F+=26;for(let z=0;z<A.n;z++){const N=W((z+.5)/A.n),X=A.colors[z%A.colors.length].clone().multiplyScalar(.8),we=y.int(0,3)+(q?8:0),J=y(),Ue=U(N[0],N[1]-A.h*.5)+.12,O=A.h*y.range(.94,1.06),te=(W((z+.9)/A.n)[1]-W((z+.1)/A.n)[1])/Math.max(.8*P/A.n,.001)*Math.sign(A.x1-A.x0||1);for(let ee=0;ee<=4;ee++)for(let k=0;k<=4;k++){const ae=(k/4-.5)*A.w;D(N[0]+ae,N[1]+ae*te-ee/4*O,.04+ee/4*.12),n.push(k/4,1-ee/4),S.push(X.r,X.g,X.b),C.push(we,J,Ue)}for(let ee=0;ee<4;ee++)for(let k=0;k<4;k++){const ae=F+ee*5+k;b.push(ae,ae+5,ae+1,ae+1,ae+5,ae+6)}F+=25}}const g=new a.BufferGeometry;g.setAttribute("position",new a.Float32BufferAttribute(w,3)),g.setAttribute("uv",new a.Float32BufferAttribute(n,2)),g.setAttribute("aCol",new a.Float32BufferAttribute(S,3)),g.setAttribute("aK",new a.Float32BufferAttribute(C,3)),g.setIndex(b);const V=new a.Mesh(g,Ft(i));return V.name="house-flags",V}export{ta as buildHero,aa as buildPetalRoad,oa as heroKit,na as makeCandleSet,sa as makeFlagSet,ra as makeHeadSet,ia as makeLoosePetalSet};
