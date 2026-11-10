import*as o from"three";import{clamp as le,lerp as we,smoothstep as et,makeRng as zt}from"../kit/core.js";const Kt=["#1B55B8","#F8FBFF","#7EA4DE","#DDE8F3","#FFF0D2","#2A323D","#D9352B"],xe=Math.PI*2,tt=`
uniform vec3 uSun, uSunCol, uSky, uShade, uCamL;
uniform float uSunI, uTime;
float hash31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float hash21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash21(i), hash21(i+vec2(1,0)), f.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x), f.y); }
// snow BRDF: soft shoulder so sun-facing faces do not clip, hard enough to keep a terminator
vec3 snowLight(vec3 N, vec3 V, float shadow, float ao, vec3 alb){
  float ndl = dot(N, uSun);
  float lit = (1. - exp(-2.6 * max(ndl + 0.06, 0.))) * (1. - shadow);
  float up = N.y * 0.5 + 0.5;
  vec3 amb = uShade * (0.50 + 0.42 * up) + vec3(0.80, 0.86, 1.0) * 0.13 * (1. - up);
  float term = smoothstep(-0.35, 0.05, ndl) * (1. - smoothstep(0.05, 0.5, ndl));
  vec3 c = alb * (uSunCol * uSunI * lit + amb * ao);
  c += alb * uSunCol * 0.10 * term * (1. - shadow);
  float fr = 1. - max(dot(N, V), 0.); fr *= fr * fr;
  c += uSky * 0.55 * fr * (1. - 0.7 * lit);
  return c;
}
// pin-point sparkle that shifts with the view
float sparkle(vec3 p, vec3 V, float dist, float cell){
  vec3 q = p * cell; vec3 id = floor(q);
  float h = hash31(id);
  float ph = fract(h * 17.3 + dot(V, vec3(h * 9.1 - 4.5, 5.3, 7.7 - h * 11.)) * 2.2);
  vec3 f = fract(q) - 0.5;
  float d = dot(f, f);
  return step(0.9, h) * smoothstep(0.8, 1.0, ph) * smoothstep(0.2, 0.02, d) * (1. - smoothstep(30., 110., dist));
}
`;function Fe(a,h,r,C){const Z=a.H,ie=r*(C+1)+1,m=new Float32Array(ie*3),T=new Float32Array(ie*3),$=.8,ce=Math.tan(a.lean),D=(f,c)=>{let g=Z*ce*Math.pow(f,1.45),I=Z*f,K=a.wob*Math.sin(f*3.1+a.ph);if(f>$){const U=(f-$)/(1-$);g+=a.hook*Math.sin(U*1.35),I-=a.drop*U*U}c[0]=g,c[1]=I,c[2]=K},_=f=>{let c=a.baseR*(1+.42*Math.exp(-f*8))*(1-.6*Math.pow(f,1.25));if(c+=a.baseR*a.sh*Math.exp(-Math.pow((f-a.ts)/.075,2)),c-=a.baseR*.2*Math.exp(-Math.pow((f-a.ts-.115)/.045,2)),c+=a.baseR*a.head*Math.exp(-Math.pow((f-.9)/.06,2)),f>.9){const g=(f-.9)/.1;c*=Math.sqrt(Math.max(0,1-g*g))*.92+.08*(1-g)}return Math.max(c,.02)},k=[0,0,0],d=[0,0,0];let w=0;for(let f=0;f<=C;f++){const c=f/C,g=Math.min(.995,c+.05*Math.sin(c*Math.PI)*(c-.3));D(Math.min(1,g+.02),d),D(Math.max(0,g-.02),k);let I=d[1]-k[1],K=-(d[0]-k[0]);const U=Math.hypot(I,K)||1;I/=U,K/=U,I<.25&&(I=.25,K=-Math.sqrt(1-.0625)),D(g,k);const ze=_(g);for(let he=0;he<r;he++){const te=he/r*xe,M=Math.cos(te),ye=Math.sin(te),Ve=h.n3(M*1.1+a.ph,g*5,ye*1.1),ue=(g*a.tiers+.22*Ve+a.ph)%1,ke=Math.sin(Math.PI*Math.pow(ue<0?ue+1:ue,.68)),oe=Math.abs(h.n3(M*2.1-a.ph,g*9+3.1,ye*2.1)),be=Math.max(-M,0),Pe=Math.max(M,0),Q=be*be*(.5+.5*Math.sin(te*6+g*11+a.ph*5)),N=et(.02,.14,g)*(1-et(.86,.98,g));let ae=1+N*(.21*(ke-.55)+.24*(oe-.3)+.2*Q)+.24*Pe*(1-.5*g),re=0;for(let E=0;E<2;E++){let Ae=te-a.armA[E];Ae=Math.atan2(Math.sin(Ae),Math.cos(Ae)),re+=a.armS[E]*Math.exp(-Math.pow(Ae/.5,2))*Math.exp(-Math.pow((g-a.armT[E])/.07,2))}ae+=re;const fe=ze*ae;m[w*3]=k[0]+M*fe*I,m[w*3+1]=Math.max(-.4,k[1]+M*fe*K-re*a.baseR*.9-N*.25*(ke-.5)*ze*.5),m[w*3+2]=k[2]+ye*fe*a.flat,T[w*3]=le(.62+.9*(ae-1)+.25*g,.35,1);const H=Math.exp(-Math.pow((te<Math.PI?te:te-xe)/.55-a.winA,2))*Math.exp(-Math.pow((g-a.winT)/.05,2));T[w*3+1]=H>.45&&ke<.75?1:0,T[w*3+2]=g,w++}}D(1,k),m[w*3]=k[0],m[w*3+1]=k[1]-.02,m[w*3+2]=k[2],T[w*3]=1,T[w*3+1]=0,T[w*3+2]=1;const q=[];for(let f=0;f<C;f++)for(let c=0;c<r;c++){const g=f*r+c,I=f*r+(c+1)%r,K=g+r,U=I+r;q.push(g,K,I,I,K,U)}const L=C*r;for(let f=0;f<r;f++)q.push(L+f,w,L+(f+1)%r);const B=new o.BufferGeometry;return B.setAttribute("position",new o.BufferAttribute(m,3)),B.setAttribute("color",new o.BufferAttribute(T,3)),B.setIndex(q),B.computeVertexNormals(),B}function Ht(a){const h=a();return{H:8,lean:a.range(.17,.33),hook:a.range(.8,1.7),drop:a.range(.4,1.3),wob:a.range(.1,.4),ph:a.range(0,6.28),baseR:we(1.25,1.85,h),sh:a.range(.3,.58),ts:a.range(.62,.74),head:a.range(.2,.34),tiers:a.range(3.5,6.5),flat:a.range(.82,1),armA:[a.range(1.1,2),-a.range(1.1,2)],armT:[a.range(.5,.7),a.range(.42,.66)],armS:[a.range(.15,.6),a.chance(.7)?a.range(.15,.55):0],winA:a.range(-.6,.6),winT:a.range(.3,.48)}}function Ot(a,h){return new o.ShaderMaterial({fog:h,vertexColors:!0,uniforms:a,vertexShader:`
      attribute vec3 aInst;   // seed, needle window on/off, foot y
      uniform float uTime; uniform vec3 uCamL;
      varying vec3 vN, vP, vC; varying vec2 vI; varying float vH;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position; float t = color.b;
        vec4 ip = instanceMatrix * vec4(0., 0., 0., 1.);
        // gusts cross the forest as slow waves; heads nod downwind
        float g = sin(uTime * 1.1 + ip.x * 0.09 - ip.z * 0.05 + aInst.x * 6.) + 0.5 * sin(uTime * 2.7 + aInst.x * 40.);
        p.x += t * t * (0.10 + 0.07 * g);
        p.y -= t * t * t * 0.05 * g;
        vec4 lp = instanceMatrix * vec4(p, 1.);
        // per-figure low-frequency warp so no two instances share a silhouette
        float w = smoothstep(0.05, 0.5, t);
        lp.x += w * 0.45 * sin(lp.y * 0.55 + aInst.x * 31.);
        lp.z += w * 0.40 * sin(lp.y * 0.47 + aInst.x * 17.);
        vP = lp.xyz; vN = normalize(mat3(instanceMatrix) * normal); vC = color; vI = aInst.xy; vH = lp.y - aInst.z;
        vec4 mvPosition = modelViewMatrix * lp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${tt}
      uniform sampler2D uShadow; uniform vec4 uShRect; uniform vec3 uNeedle;
      varying vec3 vN, vP, vC; varying vec2 vI; varying float vH;
      #include <common>
      #include <fog_pars_fragment>
      float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
        return mix(mix(mix(hash31(i), hash31(i+vec3(1,0,0)), f.x), mix(hash31(i+vec3(0,1,0)), hash31(i+vec3(1,1,0)), f.x), f.y),
                   mix(mix(hash31(i+vec3(0,0,1)), hash31(i+vec3(1,0,1)), f.x), mix(hash31(i+vec3(0,1,1)), hash31(i+vec3(1,1,1)), f.x), f.y), f.z); }
      void main(){
        vec3 Vv = uCamL - vP; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
        vec3 Ng = normalize(vN);
        vec3 N = Ng;
        float fade = 1. - smoothstep(35., 130., dist);
        float nearK = 1. - smoothstep(2.5, 12., dist), farK = smoothstep(30., 110., dist);
        // rime crust: cauliflower bumps, finer feathering on the windward side
        vec3 b1 = sin(vP * 5.6 + 1.7 * sin(vP.zxy * 3.4 + vI.x * 9.));
        vec3 b2 = sin(vP.yzx * 11.0 + 2.0 * sin(vP * 6.1));
        // close up: 2-4 cm crust grains and rime feathers combed into the wind
        vec3 b3 = sin(vP.zxy * 43. + 2.5 * sin(vP * 21. + vI.x * 5.));
        float fins = sin(vP.y * 37. + 4. * b1.x + vP.z * 15.);
        float windward = max(-N.x, 0.);
        N = normalize(N + fade * (0.15 * b1 + (0.07 + 0.12 * windward) * b2) + nearK * (0.12 * b3 + vec3(0., 0.12 * windward * fins, 0.04 * fins)));
        // the rime crust itself, read within 18 m: plates and feathers combed along the wind at three scales, with
        // blue pits between them, so a figure passing the shoulder is a surface and not a white mass
        float nearR = 1. - smoothstep(5., 18., dist), fineK = 1. - smoothstep(2.5, 8., dist);
        vec3 rq = vP * vec3(0.42, 1., 1.) + vI.x * 13.;
        float r1h = vn3(rq * 10.), r2h = vn3(rq * 25. + 7.3), r3h = vn3(rq * 55. + 3.1);
        float rh = 0.55 * r1h + 0.3 * r2h + 0.15 * mix(0.5, r3h, fineK);
        vec3 dpx = dFdx(vP), dpy = dFdy(vP);
        float dhx = dFdx(rh), dhy = dFdy(rh);
        vec3 c1 = cross(dpy, Ng), c2 = cross(Ng, dpx);
        float det = dot(dpx, c1);
        vec3 grad = (dhx * c1 + dhy * c2) * (det < 0. ? -1. : 1.) / max(abs(det), 1e-7);
        grad /= max(1., length(grad) / 24.);
        N = normalize(N - nearR * 0.034 * grad);
        float cav = smoothstep(0.27, 0.45, rh);                       // 0 in the pits between the plates
        // shadow thrown by upwind neighbours, read just sunward of the foot (four soft taps), fading with height
        // and on steep faces, where one texel is stretched over metres of surface
        vec2 suv = (vP.xz + normalize(uSun.xz + vec2(1e-4)) * (2.6 + vH * 1.3) - uShRect.xy) / uShRect.zw;
        vec2 spx = vec2(0.003, 0.0015);
        float sh = 0.25 * (texture2D(uShadow, suv + spx).r + texture2D(uShadow, suv - spx).r
                 + texture2D(uShadow, suv + vec2(spx.x, -spx.y)).r + texture2D(uShadow, suv + vec2(-spx.x, spx.y)).r);
        sh *= (1. - smoothstep(1.0, 6.0, vH)) * 0.85 * (0.25 + 0.75 * smoothstep(0.08, 0.5, abs(Ng.y)));
        sh *= step(0.002, suv.x) * step(suv.x, 0.998) * step(0.002, suv.y) * step(suv.y, 0.998);   // nothing outside the baked map
        float ao = vC.r * vC.r * (0.7 + 0.3 * smoothstep(0., 2.5, vH));
        ao = mix(ao, 0.92, 0.75 * farK);
        ao *= mix(1., 0.76 + 0.24 * cav, nearR);
        sh = max(sh, nearR * 0.38 * (1. - cav) * (1. - smoothstep(0.55, 0.95, dot(N, uSun))));   // the sun does not reach into the pits
        float streak = vn3(vP * vec3(1.3, 10., 10.) + vI.x * 7.);    // feathered fins lying along the wind
        vec3 alb = vec3(0.72, 0.735, 0.76);
        alb *= 1. - nearK * (0.07 * (0.5 + 0.5 * b3.x * b3.y) + 0.07 * (0.5 + 0.5 * fins) * windward) + 0.05 * nearK * b2.x;
        alb *= 1. + nearR * (0.16 * (streak - 0.5) + 0.1 * (rh - 0.5));
        float win = vC.g * step(0.5, vI.y);
        alb = mix(alb, uNeedle * (0.6 + 0.8 * hash31(floor(vP * 9.))), win);
        alb *= 0.86 + 0.14 * vC.r;
        vec3 c = snowLight(N, V, sh, ao, alb);
        // crown and shoulders catch the sky and the low sun even from uphill; a warm rim on the sun side
        float ndl = dot(N, uSun), crown = smoothstep(0.15, 0.85, N.y);
        float far2 = smoothstep(80., 210., dist);                     // seen from the bowl the forest is a crowd of figures: each keeps a blue side
        c += alb * uSunCol * uSunI * (0.3 * crown * (0.35 + 0.65 * smoothstep(1., 5., vH)) + 0.2 * farK * (1. - far2) * smoothstep(-0.6, 0.3, ndl)) * (1. - sh);
        c *= mix(vec3(1.), vec3(0.6, 0.72, 1.0), far2 * (1. - smoothstep(-0.2, 0.4, dot(Ng, uSun))));
        c += alb * uSky * 0.2 * crown;
        float rim = 1. - max(dot(N, V), 0.); rim *= rim;
        c += uSunCol * uSunI * 0.3 * rim * smoothstep(-0.45, 0.25, ndl) * (1. - sh) * (1. - win);
        float sp = sparkle(vP, V, dist, 16.) * (1. - win) * smoothstep(1.5, 6., dist);
        c += uSunCol * sp * 5.0 * max(ndl + 0.2, 0.) * (1. - sh);
        gl_FragColor = vec4(c, 1.);
        #include <fog_fragment>
      }`})}function ot(a,h,r,C){return new o.ShaderMaterial({fog:h,uniforms:a,transparent:!!r,depthWrite:!r,polygonOffset:!!r,polygonOffsetFactor:-2,polygonOffsetUnits:-2,defines:r?{TRACK:1}:C?{WORLD:1}:{},vertexShader:`
      varying vec3 vP, vN;
      #ifdef TRACK
      attribute vec2 aTrk; varying vec2 vT;   // x = cross coordinate (+ toward the sun), y = arc position s
      #elif defined(WORLD)
      attribute vec2 aRS; varying vec2 vRS;   // x = rock amount, y = baked terrain shadow
      #else
      attribute float aEdge; varying float vE;
      #endif
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        vP = position; vN = normal;
        #ifdef TRACK
        vT = aTrk;
        #elif defined(WORLD)
        vRS = aRS;
        #else
        vE = aEdge;
        #endif
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${tt}
      uniform sampler2D uShadow; uniform vec4 uShRect; uniform float uS, uSparkle; uniform vec3 uRock;
      varying vec3 vP, vN;
      #ifdef TRACK
      varying vec2 vT;
      #elif defined(WORLD)
      varying vec2 vRS;
      #else
      varying float vE;
      #endif
      #include <common>
      #include <fog_pars_fragment>
      void main(){
        vec3 Vv = uCamL - vP; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
        vec3 N = normalize(vN);
        float fade = 1. - smoothstep(40., 160., dist);
        // sastrugi: wind-combed ridges running along X, plus soft pillows
        vec2 q = vP.xz;
        float e = 0.35;
        float h0 = vnoise(vec2(q.x * 0.22, q.y * 1.5)) + 0.5 * vnoise(vec2(q.x * 0.6 + 7., q.y * 3.7)) + 1.4 * vnoise(q * 0.13);
        float hx = vnoise(vec2((q.x + e) * 0.22, q.y * 1.5)) + 0.5 * vnoise(vec2((q.x + e) * 0.6 + 7., q.y * 3.7)) + 1.4 * vnoise((q + vec2(e, 0.)) * 0.13);
        float hz = vnoise(vec2(q.x * 0.22, (q.y + e) * 1.5)) + 0.5 * vnoise(vec2(q.x * 0.6 + 7., (q.y + e) * 3.7)) + 1.4 * vnoise((q + vec2(0., e)) * 0.13);
        float nearK = 1. - smoothstep(10., 45., dist);
        N = normalize(N + fade * 0.55 * (1. + 1.1 * nearK) * vec3(h0 - hx, 0., h0 - hz));
        vec2 suv = (vP.xz - uShRect.xy) / uShRect.zw;
        vec2 px = 0.6 / uShRect.zw;
        float sh = 0.4 * texture2D(uShadow, suv).r + 0.15 * (texture2D(uShadow, suv + vec2(px.x, 0.)).r + texture2D(uShadow, suv - vec2(px.x, 0.)).r
                 + texture2D(uShadow, suv + vec2(0., px.y)).r + texture2D(uShadow, suv - vec2(0., px.y)).r);
        sh = smoothstep(0.08, 0.8, sh) * 0.96;
        sh *= step(0.002, suv.x) * step(suv.x, 0.998) * step(0.002, suv.y) * step(suv.y, 0.998);   // nothing outside the baked map
        vec3 alb = vec3(0.74, 0.755, 0.78) * (0.93 + 0.07 * vnoise(q * 0.5));
        // wind ripples: long pale and dull streaks lying across the fall line, so the snow moves under the tips
        alb *= 1. + 0.12 * fade * (vnoise(vec2(q.x * 0.1 + 3., q.y * 0.85)) + 0.5 * vnoise(vec2(q.x * 0.33, q.y * 2.7)) - 0.75);
        float ao = 1., a = 1., glint = 1.;
        #ifdef TRACK
        // painted trench: c in -1..1 is the groove; + side is toward the sun. The sun-side wall and the
        // floor lie in blue shadow, the far wall's top catches the sun as a bright sliver, lips are raised.
        float c = vT.x, ac = abs(c);
        float inside = 1. - smoothstep(0.86, 1.0, ac);
        float wallSh = smoothstep(-1.0, -0.45, -c * 1.0) ;            // 1 over most of the floor, 0 at far-wall top
        float trench = inside * (1. - smoothstep(0.55, 0.98, -c));
        sh = max(sh, trench * 0.97);
        ao = mix(1., 0.62 + 0.3 * smoothstep(1.0, -0.6, c), inside);
        float lip = smoothstep(1.0, 1.25, ac) * (1. - smoothstep(1.4, 2.3, ac));
        N = normalize(N + vec3(uSun.x, 0., uSun.z) * (lip * sign(c) * 0.55 + inside * step(c, -0.5) * 0.9));
        alb *= 1. + 0.06 * lip;
        a = (1. - smoothstep(1.7, 2.4, ac)) * step(vT.y, uS) * smoothstep(0., 0.8, uS - vT.y + 0.8);
        glint = 1. - inside;
        if (a < 0.01) discard;
        #elif defined(WORLD)
        // the world's terrain: rock shows through on ribs and walls, large shadows are baked per vertex
        // snow lies in streaks down the fall line of the flanks (they fall away along X); a wide, soft threshold
        float rkN = 0.6 * vnoise(vec2(q.y * 0.2 + 5., q.x * 0.045 + vP.y * 0.05)) + 0.4 * vnoise(vec2(q.x * 0.21 + vP.y * 0.3, q.y * 0.21 - vP.y * 0.2));
        float rk = smoothstep(0.3, 0.74, vRS.x + 1.0 * (rkN - 0.5) * step(0.02, vRS.x) * (1. - smoothstep(0.85, 1.1, vRS.x)));
        sh = max(sh, clamp(vRS.y, 0., 1.) * 0.96);
        float strata = vnoise(vec2(q.x * 0.35 + q.y * 0.2, vP.y * 1.7)) * 0.8 + mix(0.5, vnoise(vec2(q.x * 1.3, vP.y * 5.0 + q.y)), fade * fade) * 0.2;
        // exposed rock is never a slab: snow lies in streaks down the flank and on every ledge between the beds
        float soft = 1. - smoothstep(0.9, 1.15, vRS.x);              // (not on the cliff wall, which stays dark)
        float chute = smoothstep(0.42, 0.6, vnoise(vec2(q.x * 0.09 + vP.y * 0.06, q.y * 0.7 + 2.)));
        float shelf = smoothstep(0.56, 0.68, vnoise(vec2(q.x * 0.13 + q.y * 0.1 + 4., vP.y * 0.85)));
        rk *= 1. - max(0.9 * chute * soft, 0.8 * shelf * (0.4 + 0.6 * soft));
        alb = mix(alb, uRock * (0.45 + 1.3 * strata), rk);
        N = normalize(mix(N, normalize(vN + 0.4 * vec3(strata - 0.5, 0., vnoise(q * 0.9) - 0.5)), rk));
        glint = 1. - rk;
        #else
        if (vE + 0.25 * (vnoise(q * 0.07) - 0.5) < 0.03) discard;
        #endif
        #ifdef WORLD
        // wind drifts: low swells that give the open faces a lit side and a blue side
        float d0 = vnoise(q * vec2(0.05, 0.09)), dx1 = vnoise((q + vec2(3., 0.)) * vec2(0.05, 0.09)), dz1 = vnoise((q + vec2(0., 3.)) * vec2(0.05, 0.09));
        N = normalize(N + (1. - rk) * 3.4 * vec3(d0 - dx1, 0., d0 - dz1));
        // wind ripples a few metres long, combed across the fall line and strongest on the steep open faces,
        // so the bowl is never one flat sheet: every ripple has a lit flank and a blue one
        float steep = clamp((1. - vN.y) * 5., 0.25, 1.);
        vec2 rq = q * vec2(0.19, 0.46) + 3.7 * vec2(vnoise(q * 0.021), vnoise(q * 0.021 + 9.));
        float m0 = vnoise(rq) + 0.5 * vnoise(rq * 2.3 + 5.);
        float mx = vnoise(rq + vec2(0.19, 0.)) + 0.5 * vnoise(rq * 2.3 + vec2(0.437, 0.) + 5.);
        float mz = vnoise(rq + vec2(0., 0.46)) + 0.5 * vnoise(rq * 2.3 + vec2(0., 1.058) + 5.);
        float midK = (1. - rk) * steep * (1. - smoothstep(160., 420., dist));
        N = normalize(N + midK * 2.6 * vec3(m0 - mx, 0., m0 - mz));
        alb *= 1. + 0.1 * midK * (m0 - 0.75);
        #endif
        vec3 col = snowLight(N, V, sh, ao, alb);
        #ifdef WORLD
        vec3 rockC = alb * (uSunCol * uSunI * max(dot(N, uSun), 0.) * (1. - sh) + uShade * 0.55 + vec3(0.30, 0.33, 0.40) * 0.62);   // slate in the shade, not ultramarine
        col = mix(col, rockC, rk);
        #endif
        float sp = sparkle(vec3(vP.x, 0., vP.z), V, dist, 9.) + 0.6 * sparkle(vec3(vP.x, 3., vP.z), V, dist * 2.5, 28.);
        col += uSunCol * sp * 6.0 * uSparkle * (1. - sh) * glint * smoothstep(0., 0.25, dot(N, uSun));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`})}async function Wt(a,h,r,C){const m=document.createElement("canvas");m.width=512,m.height=1024;const T=m.getContext("2d");T.fillStyle="#000",T.fillRect(0,0,512,1024);const $=512/h.w,ce=1024/h.d,D=Math.hypot(r.x,r.z)||.001,_=-r.x/D,k=-r.z/D,d=D/Math.max(r.y,.08),w=[[0,1.35],[.06,1.2],[.25,.95],[.5,.72],[.62,.62],[.7,.78],[.78,.5],[.84,.36],[.91,.5],[.97,.3],[1,.05]];for(let L=0;L<3;L++){const B=[1.45,1.15,.9][L];T.fillStyle=["rgba(255,255,255,0.3)","rgba(255,255,255,0.45)","rgba(255,255,255,1)"][L];for(const f of a){const c=f.h*d+f.h*.25*_,g=f.s*f.w;T.beginPath();for(let I=-1;I<=1;I+=2)for(let K=0;K<w.length;K++){const U=I<0?w[K]:w[w.length-1-K],ze=U[0]*c-(L<2?.3:0),he=(U[1]*g*B+(B-.9)*U[0]*1.2)*I,te=f.x+_*ze-k*he,M=f.z+k*ze+_*he,ye=(te-h.x0)*$,Ve=(M-h.z0)*ce;I<0&&K===0?T.moveTo(ye,Ve):T.lineTo(ye,Ve)}T.closePath(),T.fill()}await C.yield()}const q=new o.CanvasTexture(m);return q.colorSpace=o.NoColorSpace,q.flipY=!1,q.wrapS=q.wrapT=o.ClampToEdgeWrapping,q.minFilter=o.LinearMipmapLinearFilter,q.magFilter=o.LinearFilter,q.generateMipmaps=!0,q.anisotropy=4,q}function Ut(a,h){return new o.ShaderMaterial({fog:h,uniforms:a,transparent:!0,depthWrite:!1,vertexShader:`
      attribute vec3 aO, aV; attribute vec4 aP; attribute float aM;   // aP: birth s | phase, life, size, rnd
      uniform float uTime, uS, uSpeed, uBombT, uBombH, uPlumeA, uScat; uniform vec3 uCamL, uSun, uWind, uBombO, uComp;
      varying vec2 vUv, vSunXY; varying float vA, vScat, vR, vK, vLit, vFan;
      #include <common>
      #include <fog_pars_vertex>
      void main(){
        float life = aP.y, age; vec3 o = aO;
        float fan = step(0.15, aM) * step(aM, 0.5);                // a fan thrown to the sun's side
        if (aM < 0.5) age = (uS - aP.x) / uSpeed;                 // born when the companion passed
        else if (aM < 1.5) age = fract(uTime / life + aP.w) * life; // ambient loop
        else { age = uBombT - aP.x; o += uBombO; }                 // snow bomb
        float k = age / life;
        float alive = step(0., age) * step(k, 1.);
        k = clamp(k, 0., 1.);
        float d = (1. - exp(-1.5 * age)) / 1.5;
        vec3 p; float size = aP.z, alpha;
        if (aM < 1.5) {
          p = o + aV * d + uWind * (age * 1.6 + age * age * 0.35) * (aM < 0.5 ? 1. : 0.6);
          p.y -= 0.55 * age * age * (aM < 0.5 ? 1. - 0.55 * fan : 0.3);
          p.y = max(p.y, o.y - 0.2 - 0.45 * p.z * 0. );
          p += 0.35 * age * vec3(sin(uTime * 1.3 + aP.w * 40.), sin(uTime * 1.7 + aP.w * 23.), cos(uTime * 1.1 + aP.w * 31.));
          size *= 0.3 + 1.25 * sqrt(k);
          alpha = smoothstep(0., 0.05, k) * pow(1. - k, 1.6 - 0.35 * fan);
          if (aM > 0.5) alpha *= 0.3 * smoothstep(0., 0.2, k);
          else {
            alpha *= mix(1., smoothstep(0., 0.3, k), step(uPlumeA, 0.999)) * mix(uPlumeA, min(uPlumeA + 0.17, 1.), smoothstep(0.25, 0.5, age)) * (1. - 0.2 * fan);
            // the sight line from the eye to the red jacket stays open: plumes thin out round it
            vec3 ab = uComp - uCamL, ap = p - uCamL;
            float tt = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-3), 0., 1.);
            float ds = length(ap - ab * tt);
            alpha *= mix(0.1, 1., smoothstep(0.4 * size + 0.3, 1.05 * size + 1.3, ds));
          }
        } else {
          float tHit = 0.9, fall = min(age, tHit);
          p = o + aV * 0.25 * fall + vec3(0., -uBombH * (fall / tHit) * (fall / tHit), 0.) + uWind * 0.5 * fall;
          float b = max(age - tHit, 0.);
          float bd = (1. - exp(-3. * b)) / 3.;
          p += vec3(aV.x, abs(aV.y) * 0.7 + 1.5, aV.z) * 2.6 * bd + uWind * b * 1.5;
          size *= mix(0.45, 1.0 + 1.6 * sqrt(b / 1.5), step(tHit, age));
          alpha = age < tHit ? 0.95 : pow(max(1. - b / 1.5, 0.), 1.5);
        }
        alpha *= alive;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
        mvPosition.xy += position.xy * size * alive * vec2(1., 1. + 0.45 * fan);      // a fan stands taller than it is wide
        gl_Position = projectionMatrix * mvPosition;
        vec3 toP = p - uCamL; float dl = length(toP);
        float ct = dot(toP / max(dl, 1e-3), uSun);
        float fs = max(ct, 0.); fs *= fs;
        vScat = min(fs * fs * fs * 2.0 + fs * 0.55, 1.5) * uScat;
        // the sun-side fan takes the light over a much wider angle, and far more of it
        vScat = mix(vScat, max(vScat, 1.45 * smoothstep(0.08, 0.72, ct) * uScat), fan); vFan = fan;
        vec2 sxy = (modelViewMatrix * vec4(uSun, 0.)).xy; vSunXY = sxy / max(length(sxy), 0.2);                          // forward scatter: flares toward the sun only
        vLit = 0.5 - 0.5 * ct;                                      // front-lit when the sun is behind the camera
        vUv = position.xy; vA = alpha * (aM > 0.5 && aM < 1.5 ? smoothstep(3., 12., dl) : smoothstep(3.5 + 1.5 * fan, 14. + 8. * fan, dl)); vR = aP.w; vK = (aM > 0.5 && aM < 1.5) ? max(k, 0.7) : k;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${tt}
      varying vec2 vUv, vSunXY; varying float vA, vScat, vR, vK, vLit, vFan;
      #include <common>
      #include <fog_pars_fragment>
      void main(){
        float r2 = dot(vUv, vUv);
        if (r2 > 1. || vA < 0.004) discard;
        vec2 w = vUv * 2.3 + vR * 17.;
        float n = vnoise(w + vec2(0., -uTime * 0.4)) * 0.5 + vnoise(w * 2.3 + 3.) * 0.32 + vnoise(w * 5.3 + vec2(7., -uTime * 0.6)) * 0.18;
        float body = 1. - r2;
        float sc = min(vScat, 0.7 + 1.0 * vFan);
        // the veil thins where it ignites, so the fan keeps its structure and its blue core
        float a = body * smoothstep(0.05 + 0.3 * vK, 0.7, n * 0.7 + body * 0.6) * vA * (1. - (0.4 - 0.2 * vFan) * min(vScat, 1.));
        // two tones and nothing between: a blue core in its own shade, and a sunward limb that is brighter than the
        // snow behind it (so it reads as light, never as grey haze) and burns white-gold against the sun
        float core = body * (0.5 + 0.5 * n);
        float rimK = 1. - core;
        float wisp = 0.3 + 1.5 * smoothstep(0.3, 0.8, vnoise(w * 1.7 + vec2(vR * 31., -uTime * 0.7)));
        float limb = 0.3 + 0.8 * dot(vUv, vSunXY) + 0.2 * vUv.y + 0.45 * (n - 0.5) + 0.35 * rimK;
        float sunny = smoothstep(0.3, 0.8, limb) * (0.45 + 0.55 * vLit) + 0.3 * rimK * rimK + 0.35 * min(sc, 1.);
        sunny = clamp((sunny - 0.32 * core * (1. - 0.6 * vLit)) * mix(1., 0.55 + 0.45 * wisp, vFan), 0., 1.);
        vec3 c = mix(uShade * 0.9 + 0.02, uSunCol * uSunI * (1.05 + 1.6 * sc * mix(0.5 + 0.5 * rimK, (0.2 + 0.8 * rimK) * wisp, vFan)) + uShade * 0.4, sunny);
        // diamond dust riding in the plume: white glints that hang for two seconds
        vec2 gq = vUv * 24. + vR * 50., gid = floor(gq);
        float gt = uTime * 0.5 + vR * 9. + hash21(gid) * 3., gph = fract(gt);
        float gl = step(0.982, hash21(gid + floor(gt) * 7.31)) * smoothstep(0.3, 0.0, length(fract(gq) - 0.5)) * smoothstep(0., 0.12, gph) * smoothstep(1., 0.7, gph);
        c += vec3(5.5) * gl * (0.45 + 1.2 * sc) * body;
        gl_FragColor = vec4(c, clamp(a, 0., 1.));
        #include <fog_fragment>
      }`})}function Et(a){return new o.ShaderMaterial({uniforms:a,transparent:!0,depthWrite:!1,blending:o.AdditiveBlending,vertexShader:`
      attribute vec4 aD;
      uniform float uTime, uPx; uniform vec3 uCamL, uWind, uSun;
      varying float vTw;
      void main(){
        const float B = 56.;
        vec3 p = position + (uWind * 0.8 + vec3(0., -0.12, 0.)) * uTime + 0.4 * sin(uTime * 0.3 + aD.xyz * 6.28);
        p = mod(p - uCamL + 0.5 * B, B) - 0.5 * B + uCamL;
        vec3 toP = p - uCamL; float dl = length(toP);
        float tw = 0.5 + 0.5 * sin(uTime * (1.5 + 3. * aD.x) + aD.y * 60. + dot(toP, vec3(1.7, 2.3, 1.1)));
        tw *= tw; tw *= tw; tw *= tw;
        vTw = tw * smoothstep(1.5, 5., dl) * (1. - smoothstep(18., 28., dl)) * (0.35 + 0.65 * aD.w);
        vec4 mv = modelViewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uPx * (1.3 + 1.4 * aD.z) * clamp(9. / max(dl, 1.), 0.6, 1.6);
      }`,fragmentShader:`
      varying float vTw;
      void main(){
        vec2 d = gl_PointCoord - 0.5; float r = dot(d, d) * 4.;
        if (r > 1. || vTw < 0.01) discard;
        float f = 1. - r; f *= f;
        gl_FragColor = vec4(vec3(2.6) * vTw * f, 1.);
      }`})}function Gt(a){const h=new o.Color(a[6]).multiplyScalar(.95),r=new o.Color(a[5]),C=r.clone().multiplyScalar(.45),Z=h.clone(),ie=[],m=(d,w,q)=>{d=d.index?d.toNonIndexed():d,d.deleteAttribute("uv");const L=d.attributes.position.count,B=new Float32Array(L*3),f=d.attributes.normal;for(let c=0;c<L;c++){const g=q?.8+.2*f.getY(c):1;B[c*3]=w.r*g,B[c*3+1]=w.g*g,B[c*3+2]=w.b*g}d.setAttribute("color",new o.BufferAttribute(B,3)),ie.push(d)},T=new o.Vector3(0,1,0),$=new o.Vector3,ce=new o.Quaternion,D=new o.Matrix4,_=(d,w,q,L,B=1,f=1)=>{$.set(w[0]-d[0],w[1]-d[1],w[2]-d[2]);const c=$.length(),g=new o.CapsuleGeometry(q,c,3,8);g.scale(B,1,f),ce.setFromUnitVectors(T,$.normalize()),D.compose(new o.Vector3((d[0]+w[0])/2,(d[1]+w[1])/2,(d[2]+w[2])/2),ce,new o.Vector3(1,1,1)),g.applyMatrix4(D),m(g,L,!0)};for(const d of[-1,1]){const w=new o.BoxGeometry(.1,.025,1.75,1,1,8),q=w.attributes.position;for(let f=0;f<q.count;f++){const c=q.getZ(f);c>.55&&q.setY(f,q.getY(f)+Math.pow((c-.55)/.33,2)*.13),q.setX(f,q.getX(f)*(1-.5*et(.7,.875,Math.abs(c))))}w.translate(d*.19,.02,.1),w.computeVertexNormals(),m(w,C,!1);const L=new o.BoxGeometry(.105,.03,.12);L.translate(d*.19,.09,.84),L.rotateX(0),m(L,Z,!1),_([d*.19,.06,.02],[d*.19,.5,.16],.075,C),_([d*.19,.5,.16],[d*.14,.86,-.14],.095,r),_([d*.25,1.36,.06],[d*.42,1.1,.22],.07,h),_([d*.42,1.1,.22],[d*.5,.97,.46],.06,h),_([d*.5,.97,.46],[d*.51,.95,.54],.065,C),_([d*.51,.96,.52],[d*.66,.2,-.55],.022,C);const B=new o.CylinderGeometry(.06,.06,.012,8);B.translate(d*.65,.26,-.5),m(B,C,!1)}_([0,.88,-.14],[0,1.4,.1],.2,h,1.05,.78),_([0,.82,-.15],[0,.95,-.12],.19,r,1,.8),_([0,1.02,-.2],[0,1.3,-.1],.13,r,1.1,.7);const k=new o.SphereGeometry(.13,10,8);return k.scale(1,1.08,1.1),k.translate(0,1.6,.17),m(k,C,!0),_([0,1.42,.1],[0,1.5,.13],.1,h),ie}async function Xt(a,h={}){const r=a.rng.fork?a.rng.fork("snow-ghosts-hero"):a.rng,C=a.noise,Z=(h.palette&&h.palette.length>=7?h.palette:Kt).slice(),ie=a.quality?.detail??1,m=h.length??300,T=h.width??180,$=(h.density??1)*r.range(.85,1.15),ce=h.speed??22,D=!0,{mergeGeometries:_}=await import("three/addons/utils/BufferGeometryUtils.js"),k=new o.Vector3;if(h.sunDir)k.copy(h.sunDir).normalize();else{const e=24*Math.PI/180,t=75*Math.PI/180;k.set(-Math.sin(t)*Math.cos(e),Math.sin(e),-Math.cos(t)*Math.cos(e))}const d=new o.Vector3(1,0,r.range(-.12,.12)).normalize(),w=r.range(.8,1.3),q=r.range(-50,50),L=r.range(-50,50),B=(e,t)=>.448*t+28e-5*t*t+1.5*C.fbm2(e*.011+q,t*.011+L,3)+.35*C.n2(e*.045-L,t*.045+q),f=B(0,0),c=h.heightAt||((e,t)=>B(e,t)-f),g=r.range(60,70),I=r.range(6.2,8.2),K=r.range(0,xe),U=r.range(0,xe),ze=r.range(3,7),he=e=>I*Math.sin(xe*e/g+K)+ze*Math.sin(xe*e/270+U),te=h.glade?0:he(0),M=h.glade||(e=>he(e)-te),ye=r.range(1,1.6),Ve=r.range(.7,1.5),ue=e=>M(e)+ye*Math.sin(xe*e/g+K+Ve)+.4*Math.sin(xe*e/23+U),ke=(e,t,n)=>(n.set(c(e-.6,t)-c(e+.6,t),2*.6,c(e,t-.6)-c(e,t+.6)).normalize(),n),oe=new o.Group;oe.name="snow-ghosts-hero";const be=e=>new o.Color(e),Pe=Math.max(h.top??m/2,m/2),Q={x0:-T/2-14,z0:-m/2-14,w:T+60,d:Pe+m/2+28},N={...o.UniformsUtils.clone(o.UniformsLib.fog),uSun:{value:k.clone()},uSunCol:{value:be(Z[4])},uSunI:{value:.92},uSky:{value:be(Z[0]).lerp(be(Z[2]),.45)},uShade:{value:be(Z[2]).multiplyScalar(.9)},uCamL:{value:new o.Vector3(0,30,80)},uTime:{value:0},uShadow:{value:null},uShRect:{value:new o.Vector4(Q.x0,Q.z0,Q.w,Q.d)},uNeedle:{value:new o.Color("#0b1a12")},uS:{value:0},uSpeed:{value:ce},uWind:{value:d.clone().multiplyScalar(w)},uBombT:{value:-1},uBombH:{value:6},uBombO:{value:new o.Vector3},uPx:{value:2},uSparkle:{value:1},uRock:{value:be(Z[5])},uPlumeA:{value:1},uScat:{value:1},uComp:{value:new o.Vector3(0,1,0)}},ae=()=>{const e={};for(const t in N)e[t]=N[t];for(const t in o.UniformsLib.fog)e[t]={value:N[t].value};return e},re=6,fe=[];for(let e=0;e<re;e++){const t=Ht(r),n=Fe(t,C,26,30);await a.yield();const s=Fe(t,C,20,22),u=Fe(t,C,13,14),i=Fe(t,C,9,9),v=Fe(t,C,6,5),S=s.attributes.position,y=S.count-1;fe.push({prm:t,gate:n,hi:s,mid:u,lo:i,far:v,top:new o.Vector3(S.getX(y),S.getY(y),S.getZ(y))}),await a.yield()}await a.yield();const H=[],E=[],Ae=m/2-6,Ee=-m/2+4,Be=h.trackTop??Ae,at=h.trackBottom??Ee;let Ge=0;for(let e=Ae-4;e>Ee+5;e-=1){const t=M(e-.5)-M(e+.5);if(Ge!==0&&Math.sign(t)!==Math.sign(Ge)){const n=Math.sign(M(e)-M(e+6))||1,s=r.range(1.12,1.36),u=r.int(0,re-1),i=M(e)+n*(3+.42*fe[u].prm.baseR*s+(n<0?.5:0)+(n*k.x>0?1.4:0)),v=e+r.range(-1.5,1.5),S={x:i,z:v,sy:s,sxz:s*r.range(.8,.95),f:u,yaw:r.range(-.3,.3),gate:!0,hi:!0,side:n};H.push(S),E.push(S)}t!==0&&(Ge=t)}const Ne=(h.spacing??11.5)/Math.sqrt($),kt=Ne*.866,nt=h.count??520,Pt=h.thin??46,ne=[];for(let e=0,t=-m/2+5;t<Pe-3;t+=kt,e++)for(let n=-T/2+4+(e&1)*Ne*.5;n<T/2-4;n+=Ne){const s=n+r.range(-.32,.32)*Ne,u=t+r.range(-.32,.32)*Ne,i=le(1+.2*r.gauss(),.62,1.38),v=Math.abs(s-M(u));if(v<5.4+1.7*i||h.keep&&!h.keep(s,u)||C.n2(s*.013+9,u*.013-4)>.5&&r.chance(.85))continue;const S=(u+m/2)/Pt+.25*C.n2(s*.03,7.7);if(S<1&&r()>S*S)continue;if(Pe>m/2+1){const A=(Pe-u)/60+.3*C.n2(s*.03+4.1,u*.03);if(A<1&&r()>A*A*A)continue}let y=!0;for(const A of E)if(Math.hypot(A.x-s,A.z-u)<6.5){y=!1;break}y&&ne.push({x:s,z:u,sy:i,sxz:i*r.range(.82,1.18),f:r.int(0,re-1),yaw:r.range(-.5,.5),gate:!1,hi:v<26,dg:v})}for(let e=ne.length-1;e>=0;e--){const t=ne[e];(t.dg>112||t.dg>72&&C.n2(t.x*.37+2.2,t.z*.37-5.1)>.42)&&ne.splice(e,1)}{const e=zt("sg-inner:"+a.seed);let t=e.sign();for(let n=Pe-26;n>Ee+8;n-=e.range(7,9)){t=-t;const s=e.range(.95,1.3),u=e.range(7.6,10)+(t*k.x>0?.8:0),i=n+e.range(-1.2,1.2),v=M(i)+t*u,S=e.int(0,re-1),y=e.range(-.5,.5),A=s*e.range(.82,1.05);if(h.keep&&!h.keep(v,i)||Math.abs(v-M(i-5))<6.4||Math.abs(v-M(i+5))<6.4)continue;let R=!0;for(const x of H)if(Math.hypot(x.x-v,x.z-i)<6.2){R=!1;break}if(R){for(const x of ne)if(Math.hypot(x.x-v,x.z-i)<5.6){R=!1;break}}R&&ne.push({x:v,z:i,sy:s,sxz:A,f:S,yaw:y,gate:!1,hi:!0,dg:Math.abs(v-M(i))-3})}}ne.length+H.length>nt&&(r.shuffle(ne),ne.length=Math.max(0,nt-H.length));let je=H.length;const st=Math.round((h.near??72)*(.6+.4*ie));ne.sort((e,t)=>e.dg-t.dg);const At=Math.round(st*.5);for(const e of ne)e.hi&&je<st?(je++,e.mid=je>At):e.hi=!1,e.far=!e.hi&&e.dg>58,H.push(e);const Ct=H.length;for(const e of h.extra||[])H.push({x:e.x,z:e.z,y:e.y,sy:e.scale,sxz:e.scale*.92,f:(H.length*5+1)%re,yaw:H.length*.618%1-.5,gate:!1,hi:e.hi!==!1,extra:!0,dg:0});await a.yield();for(const e of H)e.extra||(e.y=c(e.x,e.z)-.25),e.h=8*e.sy,e.s=e.sxz,e.w=fe[e.f].prm.baseR/1.5,e.seed=r();await a.yield();const Vt=H.slice(0,Ct).concat((h.casters||[]).map(e=>({x:e.x,z:e.z,h:e.h,s:1,w:e.r/1.2}))),Xe=await Wt(Vt,Q,k,a);N.uShadow.value=Xe,await a.yield();const qt=Ot(ae(),D);let qe=0;{const e=new o.Matrix4,t=new o.Quaternion,n=new o.Vector3(0,1,0),s=new o.Vector3,u=new o.Vector3;let i=0;for(let v=0;v<re;v++)for(const S of["gate","hi","mid","lo","far"]){const y=H.filter(z=>z.f===v&&(z.gate?"gate":z.hi?z.mid?"mid":"hi":z.far?"far":"lo")===S);if(!y.length)continue;const A=fe[v][S],R=new o.InstancedMesh(A,qt,y.length),x=new Float32Array(y.length*3);y.forEach((z,l)=>{t.setFromAxisAngle(n,z.yaw),e.compose(s.set(z.x,z.y,z.z),t,u.set(z.sxz,z.sy,z.sxz)),R.setMatrixAt(l,e);const p=z.hi&&(z.seed>.72||z.gate&&(z.side<0||i<3));p&&z.gate&&i++,x[l*3]=z.seed,x[l*3+1]=p?1:0,x[l*3+2]=z.y,z.top=fe[v].top.clone().applyMatrix4(e)}),A.setAttribute("aInst",new o.InstancedBufferAttribute(x,3)),R.instanceMatrix.needsUpdate=!0,R.frustumCulled=!1,R.name=`ghosts-${v}-${S}`,oe.add(R),qe+=A.index.count/3*y.length}}await a.yield();const Me=new o.Vector3;if(h.snow!==!1){const n=-T/2-12,s=-m/2-12,u=T+24+20,i=m+24,v=new Float32Array(6161*3),S=new Float32Array(v.length),y=new Float32Array(6161);let A=0;for(let l=0;l<=100;l++)for(let p=0;p<=60;p++){const b=n+p/60*u,V=s+l/100*i;v[A*3]=b,v[A*3+1]=c(b,V),v[A*3+2]=V,ke(b,V,Me),S[A*3]=Me.x,S[A*3+1]=Me.y,S[A*3+2]=Me.z,y[A]=le(Math.min(b-n,n+u-b,V-s,s+i-V)/14,0,1),A++}const R=[];for(let l=0;l<100;l++)for(let p=0;p<60;p++){const b=l*61+p,V=b+1,F=b+60+1,j=F+1;R.push(b,F,V,V,F,j)}const x=new o.BufferGeometry;x.setAttribute("position",new o.BufferAttribute(v,3)),x.setAttribute("normal",new o.BufferAttribute(S,3)),x.setAttribute("aEdge",new o.BufferAttribute(y,1)),x.setIndex(R);const z=new o.Mesh(x,ot(ae(),D,!1));z.name="snow",z.frustumCulled=!1,oe.add(z),qe+=R.length/3}await a.yield();const O=Math.round((Be-at)/.72),it=(Be-at)/O,P=new Float32Array((O+1)*3),J=new Float32Array(O+1),Ie=new Float32Array(O+1);for(let e=0;e<=O;e++){(e&255)===255&&await a.yield();const t=Be-e*it,n=ue(t);P[e*3]=n,P[e*3+1]=c(n,t),P[e*3+2]=t,e&&(J[e]=J[e-1]+Math.hypot(P[e*3]-P[e*3-3],P[e*3+1]-P[e*3-2],P[e*3+2]-P[e*3-1]));const s=2.5;Ie[e]=le((ue(t+s)-2*n+ue(t-s))/(s*s)/.06,-1,1)}const de=J[O],rt=e=>{let t=0,n=O;for(;n-t>1;){const s=t+n>>1;J[s]>e?n=s:t=s}return t+le((e-J[t])/Math.max(J[t+1]-J[t],1e-4),0,1)},lt=e=>{const t=le((Be-e)/it,0,O),n=Math.min(O-1,Math.floor(t));return we(J[n],J[n+1],t-n)},Le=(e,t)=>{const n=Math.min(O-1,Math.max(0,Math.floor(e))),s=le(e-n,0,1);return t.set(we(P[n*3],P[n*3+3],s),we(P[n*3+1],P[n*3+4],s),we(P[n*3+2],P[n*3+5],s))},Ye=(e,t)=>{const n=Math.max(0,e-1),s=Math.min(O,e+1),u=P[s*3]-P[n*3],i=P[s*3+2]-P[n*3+2],v=Math.hypot(u,i)||1;return t.set(-i/v,0,u/v)};{const e=[-2.4,-1.3,-1,-.5,.5,1,1.3,2.4],t=[.012,.075,.055,.03,.03,.055,.075,.012],n=(O+1)*16,s=new Float32Array(n*3),u=new Float32Array(n*3),i=new Float32Array(n*2),v=[],S=new o.Vector3;let y=0;for(let x=0;x<=O;x++){(x&63)===63&&await a.yield(),Ye(x,S);const z=Math.sign(S.x*k.x+S.z*k.z)||1,l=Math.abs(Ie[x]),p=.135*(1+.45*l),b=.3+.08*l;for(let V=0;V<2;V++)for(let F=0;F<8;F++){const j=(V?b:-b)+e[F]*p,ee=P[x*3]+S.x*j,ge=P[x*3+2]+S.z*j;if(s[y*3]=ee,s[y*3+1]=c(ee,ge)+t[F]*(1+l),s[y*3+2]=ge,ke(ee,ge,Me),u[y*3]=Me.x,u[y*3+1]=Me.y,u[y*3+2]=Me.z,i[y*2]=e[F]*z,i[y*2+1]=J[x],x<O&&F<7){const Y=y,Ce=y+1,Se=y+16,Te=y+17;S.x>0?v.push(Y,Ce,Se,Ce,Te,Se):v.push(Y,Se,Ce,Ce,Se,Te)}y++}}const A=new o.BufferGeometry;A.setAttribute("position",new o.BufferAttribute(s,3)),A.setAttribute("normal",new o.BufferAttribute(u,3)),A.setAttribute("aTrk",new o.BufferAttribute(i,2)),A.setIndex(v);const R=new o.Mesh(A,ot(ae(),D,!0));R.material.side=o.DoubleSide,R.name="tracks",R.frustumCulled=!1,R.renderOrder=1,oe.add(R),qe+=v.length/3}await a.yield();const ct=_(Gt(Z),!1),se=new o.Mesh(ct,new o.ShaderMaterial({fog:D,vertexColors:!0,uniforms:ae(),vertexShader:`varying vec3 vN, vC;
      #include <common>
      #include <fog_pars_vertex>
      void main(){ vN = normalize(mat3(modelMatrix) * normal); vC = color; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
      }`,fragmentShader:`uniform vec3 uSun, uSunCol, uShade; uniform float uSunI; varying vec3 vN, vC;
      #include <common>
      #include <fog_pars_fragment>
      void main(){ vec3 N = normalize(vN); float ndl = dot(N, uSun);
        vec3 l = uSunCol * uSunI * 1.25 * smoothstep(-0.1, 0.6, ndl) + uShade * (0.55 + 0.3 * N.y) + vec3(0.30, 0.32, 0.36) * (0.6 - 0.4 * N.y);
        gl_FragColor = vec4(vC * l, 1.);
      #include <fog_fragment>
      }`}));se.name="companion",se.matrixAutoUpdate=!1,se.frustumCulled=!1,se.scale.setScalar(1.12),oe.add(se),qe+=ct.attributes.position.count/3,await a.yield();{const e=[],t=[],n=[],s=[],u=new o.Vector3,i=r.fork?r.fork("powder"):r,v=(l,p,b,V,F,j,ee)=>{Ye(p,u);const ge=P[p*3+3]-P[p*3-3],Y=P[p*3+4]-P[p*3-2],Ce=P[p*3+5]-P[p*3-1],Se=Math.hypot(ge,Y,Ce)||1,Te=(20+60*(b+l())/V)*Math.PI/180,xt=(2.6+9.5*F)*l.range(.6,1)*(.75+.35*Math.sin((Te-.35)*3)),yt=j*xt*Math.cos(Te)*(ee?.8:1),Je=l.range(-1,2),_t=xt*Math.sin(Te)*(ee?1.12:1),bt=j*l.range(1.5,2.5),Mt=P[p*3]+u.x*bt,St=P[p*3+2]+u.z*bt;e.push(Mt,c(Mt,St)+.25,St),t.push(u.x*yt+ge/Se*Je+l.range(-.6,.6),_t+Y/Se*Je*.5,u.z*yt+Ce/Se*Je+l.range(-.6,.6)),ee?n.push(J[p]+l.range(1.8,2.8),(1.6+.8*F)*l.range(.85,1.15),(1+1.5*F)*l.range(.8,1.25),l()):n.push(J[p]+l.range(1.8,2.8),(1.2+1.3*F)*l.range(.8,1.15),(.9+1.7*F)*l.range(.8,1.25),l()),s.push(ee?.3:0)},S=[];for(let l=2;l<O-1;l++){const p=h.plumeScale?h.plumeScale(P[l*3+2]):1;if(p<.04)continue;const b=Ie[l]*p,V=Math.abs(b);Ye(l,u);const F=-Math.sign(b)||1,j=F*(u.x*k.x+u.z*k.z)>0&&V>.22,ee=1+(V>.4?1:0)+(V>.6?1:0)+(V>.8?1:0)+(j&&V>.5?1:0),ge=1+(V>.4?1:0)+(V>.75?1:0)+(j&&V>.5?1:0);for(let Y=0;Y<ge;Y++)v(i,l,Y,ee,V,F,j);for(let Y=ge;Y<ee;Y++)S.push([l,Y,ee,V,F,j]);(l&255)===255&&await a.yield()}const y=s.length,A=H.filter(l=>l.hi&&l.top);for(const l of A)if(!(!l.gate&&i.chance(.45)))for(let p=0;p<2;p++){const b=p?1:i.range(.6,.8);e.push(we(l.x,l.top.x,b)+i.range(-.4,.6),we(l.y,l.top.y,b)+.2,l.top.z+i.range(-.5,.5)),t.push(d.x*1.6,-i.range(.6,1.6),d.z*1.6+i.range(-.3,.3)),n.push(0,i.range(3,5.5),i.range(.7,1.4),i()),s.push(1)}const R=Math.round(90*ie);for(let l=0;l<R;l++){const p=i.range(-m/2+10,m/2-10),b=M(p)+i.range(-38,30);e.push(b,c(b,p)+.3,p),t.push(d.x*6,.25,d.z*6),n.push(0,i.range(3.5,6),i.range(2.2,4.2),i()),s.push(1)}for(let l=0;l<22;l++){const p=i.range(0,xe),b=Math.sqrt(i());e.push(Math.cos(p)*b*.6,i.range(-.4,.5),Math.sin(p)*b*.6),t.push(Math.cos(p)*(.4+b),i.range(.2,1),Math.sin(p)*(.4+b)),n.push(i.range(0,.1),2.4,i.range(.9,1.7),i()),s.push(2)}{const l=i.fork?i.fork("fan-more"):zt("sg-fan-more:"+a.seed),p=s.length;for(const b of S)v(l,...b);for(const[b,V]of[[e,3],[t,3],[n,4],[s,1]]){const F=b.splice(y*V,(p-y)*V);for(const j of F)b.push(j)}}const x=new o.InstancedBufferGeometry;x.setAttribute("position",new o.BufferAttribute(new Float32Array([-1,-1,0,1,-1,0,1,1,0,-1,1,0]),3)),x.setIndex([0,1,2,0,2,3]),x.setAttribute("aO",new o.InstancedBufferAttribute(new Float32Array(e),3)),x.setAttribute("aV",new o.InstancedBufferAttribute(new Float32Array(t),3)),x.setAttribute("aP",new o.InstancedBufferAttribute(new Float32Array(n),4)),x.setAttribute("aM",new o.InstancedBufferAttribute(new Float32Array(s),1)),x.instanceCount=s.length;const z=new o.Mesh(x,Ut(ae(),D));z.name="powder",z.frustumCulled=!1,z.renderOrder=3,oe.add(z),qe+=s.length*2}if(h.dust!==!1){const e=Math.round(1400*ie),t=new Float32Array(e*3),n=new Float32Array(e*4);for(let i=0;i<e;i++)t[i*3]=r.range(0,56),t[i*3+1]=r.range(0,56),t[i*3+2]=r.range(0,56),n[i*4]=r(),n[i*4+1]=r(),n[i*4+2]=r(),n[i*4+3]=r();const s=new o.BufferGeometry;s.setAttribute("position",new o.BufferAttribute(t,3)),s.setAttribute("aD",new o.BufferAttribute(n,4));const u=new o.Points(s,Et(N));u.name="diamond-dust",u.frustumCulled=!1,u.renderOrder=4,oe.add(u)}await a.yield();const W=new o.Vector3,De=new o.Vector3(0,0,-1),ve=new o.Vector3,me=new o.Vector3,X=new o.Vector3,_e=new o.Vector3,Ke=new o.Vector3,Re=new o.Vector3,He=new o.Matrix4,Oe=new o.Matrix4;let We=!1,ht=0;const Ze=e=>{e=le(e,0,de),N.uS.value=e;const t=rt(e);Le(t,W),Le(Math.max(0,t-1.5),_e),Le(Math.min(O,t+1.5),Ke),X.subVectors(Ke,_e).normalize(),De.copy(X),X.y*=.45,X.normalize();const n=Math.min(O,Math.round(t)),s=Ie[n];ke(W.x,W.z,Re),Re.y+=1.2,Re.normalize(),ve.crossVectors(Re,X).normalize();const u=Math.sign(ve.x)*Math.sign(s)||0;me.copy(Re).addScaledVector(ve,u*Math.tan(.52*Math.abs(s))).normalize(),ve.crossVectors(me,X).normalize(),me.crossVectors(X,ve).normalize(),He.makeBasis(ve,me,X);const i=1.2,v=1-.1*Math.abs(s);Oe.makeScale(i,i*v,i),se.matrix.copy(He).multiply(Oe).setPosition(W.x,W.y-.1,W.z),se.matrixWorldNeedsUpdate=!0,se.visible=e<de-.5||We,N.uComp.value.set(W.x,W.y+1.1,W.z)},Tt=e=>{We=!0,ht=le(e,0,1),Ze(ht*de)},Nt=(e,t,n=!0,s=.5)=>{We=!0,W.copy(e),De.copy(t).normalize(),X.copy(De),me.set(0,1,0),ve.crossVectors(me,X).normalize(),me.crossVectors(X,ve).normalize();const u=.42*s,i=Math.cos(u),v=Math.sin(u);_e.copy(me).multiplyScalar(i).addScaledVector(X,v),Ke.copy(X).multiplyScalar(i).addScaledVector(me,-v),He.makeBasis(ve,_e,Ke),Oe.makeScale(1.2,1.2*(1-.3*s),1.2),N.uComp.value.set(W.x,W.y+1,W.z),se.matrix.copy(He).multiply(Oe).setPosition(W.x,W.y,W.z),se.matrixWorldNeedsUpdate=!0,se.visible=n},Rt=e=>lt(e)/de,ut=lt(-8),Ft=h.progress??ut/de;Ze(Ft*de);const ft=E.length?E.reduce((e,t)=>Math.abs(t.z+2)<Math.abs(e.z+2)?t:e):null,dt=(e,t)=>{const n=E[Math.max(0,Math.min(E.length-1,e|0))];if(!n||!n.top){N.uBombT.value=-1;return}const s=we(n.y,n.top.y,.78),u=we(n.x,n.top.x,.6)-n.side*1.2;N.uBombO.value.set(u,s,n.z),N.uBombH.value=Math.max(1,s-c(u,n.z)-.3),N.uBombT.value=t};let vt=!1;const Bt=(e={})=>{e.sun&&N.uSun.value.copy(e.sun).normalize(),e.sunColor&&N.uSunCol.value.set(e.sunColor),e.sky&&N.uSky.value.set(e.sky),e.shade&&N.uShade.value.set(e.shade),e.intensity!=null&&(N.uSunI.value=e.intensity)},G=(e,t,n)=>new o.Vector3(e,t,n),mt=[];for(let e=m/2;e>=-m/2-.01;e-=10){const t=M(e);mt.push(G(t,c(t,e)+1.5,e))}const pe=-m/2,Ue=M(pe),pt=c(Ue,pe),It=G(M(pe)-M(pe+8),c(Ue,pe)-c(M(pe+8),pe+8),-8).normalize(),$e=24,gt=M($e),Lt={flyThrough:mt,gladeX:M,heightAt:c,trackPoint:(e,t=new o.Vector3)=>Le(rt(le(e,0,1)*de),t),companion:W,companionHeading:De,gates:E.map(e=>({position:G(e.x,e.y+.25,e.z),top:e.top?e.top.clone():G(e.x,e.y+e.h,e.z),side:e.side})),entry:{position:G(M(m/2),c(M(m/2),m/2)+1.5,m/2),facing:G(0,-.45,-.89).normalize()},exit:{position:G(Ue,pt+1.5,pe),facing:It},portalSeat:{position:G(Ue,pt-95,pe-190),facing:G(0,.87,.5).normalize(),note:"not built here: the brief seats the 14 m portal in a cloud well ~150 m out from the cliff foot, beyond the lower treeline on the glade axis; this is only a suggested spot"},viewpoints:{heroFrame:{position:G(gt,c(gt,$e)+1.5,$e),gaze:G(ue(-8),c(ue(-8),-8)+1.5,-8)},aerial:{position:G(40,c(40,50)+30,50),gaze:G(0,4,0)},fromBelow:{position:G(M(-60)+4,c(M(-60)+4,-60)+3,-60),gaze:G(0,6,0)}},sun:k.clone(),wind:d.clone(),shadow:{texture:Xe,rect:Q,uvOf:(e,t,n=new o.Vector2)=>n.set((e-Q.x0)/Q.w,(t-Q.z0)/Q.d)}},Qe=new o.Vector3,wt=new o.Vector2,Dt=(e,t,n)=>{if(N.uTime.value=t,n&&(n.getWorldPosition(Qe),oe.worldToLocal(Qe),N.uCamL.value.copy(Qe)),a.renderer&&(a.renderer.getDrawingBufferSize(wt),N.uPx.value=Math.max(1.5,wt.y/450*1.7)),!We){const s=de+45,u=((ut+ce*(t-12))%s+s)%s;Ze(u)}if(!vt&&ft){const s=((t-10.9)%7+7)%7;dt(E.indexOf(ft),s<2.6?s:-1)}};return{object:oe,radius:8,height:60,center:new o.Vector3(0,7,0),anchors:Lt,update:Dt,setProgress:Tt,progressAtZ:Rt,setLight:Bt,setCompanionPose:Nt,makeSnowMaterial:()=>ot(ae(),D,!1,!0),shareUniforms:ae,setBomb:(e,t)=>{vt=!0,dt(e,t)},uniforms:N,info:{triangles:Math.round(qe),ghosts:H.length,ghostsNear:H.filter(e=>e.hi).length,extent:{width:T,length:m,yTop:c(0,m/2),yBottom:c(0,-m/2),tallest:11},trackLength:de,turns:E.length,seedNotes:{gladeWavelength:g,gladeAmplitude:I,density:$,windStrength:w}},dispose(){Xe.dispose()},ground:!1,groundY:0}}export{Xt as buildHero};
