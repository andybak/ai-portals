import*as r from"three";import{makePath as ot,clamp as at,smoothstep as ve}from"../kit/core.js";import{makeSky as nt,makeCloudField as Ue,makeCloudFieldAsync as st,skyDirection as rt}from"../kit/sky.js";import*as oe from"../kit/fauna.js";import*as ge from"../kit/fx.js";import{buildHero as it}from"../parts/storm-bands.js";const lt=["#1a2a5a","#e8c79a","#f6e9d2","#c9743a","#7a3a2a","#2a1a2a","#6fffe0"],ae=Math.PI*2,q=370,K=-260,J=75,Y=60,ne=42,xe=520,ye=190,se=(o,e,l)=>new r.Vector3(o,e,l),we=()=>r.UniformsUtils.clone(r.UniformsLib.fog),Ce=(o,e)=>o.m1*Math.sin(e*ae/1200+o.p1)+o.m2*Math.sin(e*ae/800+o.p2),yt=(o,e,l)=>{const m=e-Ce(o,l)-o.x0;return m-Math.round(m/q)*q},Fe=`
uniform vec4 uLay;      // x0, period, meander amp 1, amp 2
uniform vec2 uLayPh;
float meander(float z) { return uLay.z * sin(z * 0.005235988 + uLayPh.x) + uLay.w * sin(z * 0.007853982 + uLayPh.y); }
float rollX(vec2 xz) { float x = xz.x - meander(xz.y) - uLay.x; return x - floor(x / uLay.y + 0.5) * uLay.y; }
float halfW(float y) { return ${J.toFixed(1)} + ${ne.toFixed(1)} * pow(clamp((-y - ${Y.toFixed(1)}) / ${(-K-Y).toFixed(1)}, 0., 1.), 1.3); }
float hash21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
`,He=o=>{const e=Math.abs(o),l=e<.45?e/.45*.5:e<.8?.5+(e-.45)/.35*.2:.7+(e-.8)/.2*.3;return o<0?-l:l};async function ut(o,e,l,m,c=[]){const z=[],P=[],C=[],L=[];for(const i of m){const v=i.near?48:10,x=[];if(i.near){let a=2700;for(;a>-3900;)x.push(a),a-=a<=1960&&a>180?14:70}else for(let a=2700;a>-3900;a-=95)x.push(a);x.push(-3900);const n=z.length/3,G=v+1;for(let a=0;a<x.length;a++)for(let y=0;y<=v;y++)z.push(i.x,He(y/v*2-1),x[a]),P.push(i.hash,i.flow,i.near?1:.25),L.push(0);const g=Math.max(Math.abs(i.x)-190,0);for(let a=0;a<x.length-1;a++){const y=Math.min(Math.abs(x[a]),Math.abs(x[a+1]));if(!(Math.hypot(g,y)<800&&Math.hypot(Math.abs(i.x)+190,Math.max(Math.abs(x[a]),Math.abs(x[a+1])))<840))for(let R=0;R<v;R++){const B=n+a*G+R,D=B+1,N=B+G,Q=N+1;C.push(B,D,N,D,Q,N)}}await o.yield()}for(const i of c){await o.yield();const v=40,x=v+1,n=[],G=z.length/3;for(let g=-Math.PI;g<Math.PI;)n.push(g),g+=Math.abs(g)<.95?14/i.R:.05;n.push(Math.PI);for(let g=0;g<n.length;g++)for(let a=0;a<=v;a++)z.push(0,He(a/v*2-1),n[g]),P.push(i.hash,i.flow,1),L.push(i.R);for(let g=0;g<n.length-1;g++)for(let a=0;a<v;a++){const y=G+g*x+a,R=y+1,B=y+x,D=B+1;C.push(y,R,B,R,D,B)}}await o.yield();const k=new r.BufferGeometry;k.setAttribute("position",new r.Float32BufferAttribute(z,3)),k.setAttribute("aRoll",new r.Float32BufferAttribute(P,3)),k.setAttribute("aRing",new r.Float32BufferAttribute(L,1)),k.setIndex(C),k.boundingSphere=new r.Sphere(new r.Vector3,9e3);const F=new r.ShaderMaterial({fog:!0,uniforms:{...e,...we()},vertexShader:`
      ${Fe}
      attribute vec3 aRoll; attribute float aRing;
      uniform sampler2D uTexA, uTexB; uniform float uTime;
      varying vec4 vUv; varying vec3 vN0, vTs, vTz, vWorld; varying vec2 vAmp;
      #include <fog_pars_vertex>
      void main() {
        float s = position.y, t = abs(s), sg = s < 0. ? -1. : 1., z = position.z;
        vec3 across = vec3(1., 0., 0.), along = vec3(0., 0., 1.); vec2 c = vec2(position.x + meander(z), z);
        if (aRing > 0.5) { across = vec3(sin(z), 0., cos(z)); along = vec3(cos(z), 0., -sin(z)); c = across.xz * aRing; z *= aRing; }
        vec2 sec, nrm; float arc;
        if (t < 0.5) {
          float a = t * 3.14159265;
          sec = vec2(${J.toFixed(1)} * sin(a), -${Y.toFixed(1)} * (1. - cos(a)));
          nrm = normalize(vec2(${Y.toFixed(1)} * sin(a), ${J.toFixed(1)} * cos(a)));
          arc = t * 200.;
        } else {
          float q = (t - 0.5) * 2.;
          sec = vec2(${J.toFixed(1)} + ${ne.toFixed(1)} * pow(q, 1.3), -${Y.toFixed(1)} - ${(-K-Y+30).toFixed(1)} * q);
          nrm = normalize(vec2(${(-K-Y).toFixed(1)}, 1.3 * ${ne.toFixed(1)} * pow(max(q, 1e-3), 0.3)));
          arc = 100. + q * 350.;
        }
        float zf = z - aRoll.y * uTime;
        vec4 uv = vec4(zf / ${xe.toFixed(1)} + aRoll.x * 7.1, sg * arc / ${xe.toFixed(1)} + aRoll.x * 3.3,
                       zf / ${ye.toFixed(1)} + aRoll.x * 5.7, sg * arc / ${ye.toFixed(1)} + aRoll.x * 9.1);
        // the walls are sampled more coarsely than the crest, so their relief is taken from blurrier mips (no strata)
        float wl = smoothstep(0.46, 0.72, t);
        float hA = textureLod(uTexA, uv.xy, mix(2., 3.2, wl)).r, hB = textureLod(uTexB, uv.zw, mix(3.5, 4.6, wl)).r;
        float amp = mix(27., 15., smoothstep(0.42, 0.9, t));
        float h = amp * ((hA - 0.5) * 1.5 + (hB - 0.45) * 0.9 * aRoll.z * (1. - 0.45 * wl));
        float wS = 1. + 0.17 * sin(z * 0.0047 + aRoll.x * 20.) + 0.08 * sin(z * 0.0131 + aRoll.x * 51.);
        vec3 p = vec3(c.x, sec.y + nrm.y * h, c.y) + across * (sg * (sec.x * mix(wS, 1., smoothstep(0.5, 1., t)) + nrm.x * h));
        if (aRing > 0.5) p.y += 12.; else p.y -= 135. * smoothstep(1065., 905., length(p.xz));   // straight rolls dive under the collar
        vUv = uv; vAmp = vec2(amp, aRoll.z);
        vN0 = across * (sg * nrm.x) + vec3(0., nrm.y, 0.); vTs = across * nrm.y + vec3(0., -sg * nrm.x, 0.); vTz = along;
        vWorld = p;
        vec4 mvPosition = viewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D uTexA, uTexB; uniform vec2 uGradScale; uniform float uTime;
      uniform vec3 uSunDir, uSunCol, uIndigo, uTan, uCream, uRust, uRustDark, uPlum, uBoltCol;
      uniform vec4 uFlash[4];
      varying vec4 vUv; varying vec3 vN0, vTs, vTz, vWorld; varying vec2 vAmp;
      #include <fog_pars_fragment>
      void main() {
        vec4 sa = texture2D(uTexA, vUv.xy), sb = texture2D(uTexB, vUv.zw), sc = texture2D(uTexB, vUv.zw * 2.7 + 0.37);
        vec2 gA = (sa.gb * 2. - 1.) * uGradScale.x, gB = (sb.gb * 2. - 1.) * uGradScale.y, gC = (sc.gb * 2. - 1.) * uGradScale.y;
        float dz = vAmp.x * (1.5 * gA.x / ${xe.toFixed(1)} + 0.9 * gB.x / ${ye.toFixed(1)});
        float ds = vAmp.x * (1.5 * gA.y / ${xe.toFixed(1)} + 0.9 * gB.y / ${ye.toFixed(1)});
        vec3 n0 = normalize(vN0), ts = normalize(vTs), tz = normalize(vTz);
        float depth = clamp(-vWorld.y / 400., 0., 1.);
        float wallK = 1. - 0.7 * smoothstep(0.06, 0.2, depth);                                  // rift walls: soft vapour, not marbled rock
        vec2 sl = vec2(ds, dz) * 0.95 * wallK; sl /= 1. + length(sl) * 0.9;                       // soft-limited slope: billows, not crags
        vec3 N = normalize(n0 - ts * sl.x - tz * sl.y);
        vec2 sf = vec2(gC.y, gC.x) * 0.16 * vAmp.y * wallK; sf /= 1. + length(sf) * 1.5;
        N = normalize(N - ts * sf.x - tz * sf.y);

        float hN = clamp((sa.r - 0.5) * 1.5 + (sb.r - 0.45) * 0.9, -1., 1.) * 0.5 + 0.5;
        float ao = smoothstep(0.15, 0.7, hN);
        // cream crests, tan folds, rust and then dark rust down the rift walls: broad soft gradients, no speckle
        vec3 alb = mix(uTan, uCream, smoothstep(0.2, 0.62, hN + (sc.r - 0.5) * 0.25));
        alb *= mix(0.8, 1., smoothstep(0.08, 0.5, sc.r));                                         // cauliflower creases
        alb = mix(alb, mix(uTan, uRust, 0.8), smoothstep(0.07, 0.3, depth));
        alb = mix(alb, uRustDark, smoothstep(0.3, 0.85, depth));
        alb *= 0.72 * mix(0.9, 1., sc.a);

        vec3 sunL = normalize(uSunDir);
        vec3 Ns = normalize(n0 - ts * sl.x * 0.4 - tz * sl.y * 0.4);                              // the broad form carries the terminator: one clean edge per billow, no speckle
        float ndl = mix(dot(N, sunL), dot(Ns, sunL), 0.85);
        float wallW = smoothstep(0.03, 0.2, depth);                                              // walls take a broad, vaporous terminator
        float lit = smoothstep(mix(-0.02, -0.3, wallW), mix(0.3, 0.6, wallW), ndl) * mix(0.3, 1., ao);
        // the neighbouring roll shades the wall: the wall that faces the sun keeps its light further down
        float sunSide = smoothstep(0.1, 0.6, dot(n0.xz, normalize(sunL.xz)));
        lit *= 1. - smoothstep(mix(0.03, 0.2, sunSide), mix(0.3, 0.55, sunSide), depth) * 0.95;
        vec3 shade = mix(uPlum * 0.9, uRust * 0.4 + uRustDark * 0.25 + uPlum * 0.5, ao);                         // crisp terminators into rust and plum
        shade = mix(shade, alb * mix(uRust, uTan, 0.45) * 0.78, 0.2 * (1. - smoothstep(0.08, 0.5, depth)));
        shade += uIndigo * 0.22 * clamp(N.y, 0., 1.);
        shade = mix(shade, uIndigo * 0.9 + uRustDark * 0.3, smoothstep(0.06, 0.45, depth) * 0.95);  // rifts fall to indigo
        vec3 col = alb * uSunCol * lit + shade * (1. - lit * 0.85) * (0.5 + 0.6 * alb.r);
        col += uRust * (lit * (1. - lit)) * 0.35;                                                // warm bleed along the terminator
        vec3 V = normalize(cameraPosition - vWorld);
        col += uCream * pow(1. - clamp(dot(N, V), 0., 1.), 3.) * 0.12 * lit;                     // powdery edges
        for (int i = 0; i < 4; i++) {                                                            // lightning from inside the rift
          vec3 d = uFlash[i].xyz - vWorld; float dist = length(d);
          col += uBoltCol * (uFlash[i].w * exp(-dist / 170.) * mix(0.45, 1., sb.r) * 2.6);
        }
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),M=new r.Mesh(k,F);return M.name="deck-rolls",M.frustumCulled=!1,M}function ct(o){const e=new r.PlaneGeometry(13e3,13e3,1,1).rotateX(-Math.PI/2),l=new r.ShaderMaterial({fog:!0,uniforms:{...o,...we()},vertexShader:`
      varying vec3 vWorld;
      #include <fog_pars_vertex>
      void main() {
        vWorld = (modelMatrix * vec4(position, 1.)).xyz;
        vec4 mvPosition = viewMatrix * vec4(vWorld, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Fe}
      uniform sampler2D uTexA, uTexB; uniform vec2 uGradScale; uniform float uTime, uStorm;
      uniform vec3 uSunDir, uSunCol, uIndigo, uTan, uCream, uRust, uRustDark, uPlum, uBoltCol;
      uniform vec4 uFlash[4];
      varying vec3 vWorld;
      #include <fog_pars_fragment>
      void main() {
        vec2 p = vWorld.xz;
        if (length(p) < 640.) discard;                               // under the Eye nothing is ever seen
        vec4 a = texture2D(uTexA, vec2(p.x / 760., p.y / 2300. + uTime * 0.0035));
        vec4 b = texture2D(uTexB, vec2(p.x / 240. + a.r * 0.25, p.y / 520. - uTime * 0.011));
        float band = a.r * 0.75 + b.r * 0.45 + (a.a - 0.5) * 0.3;
        vec3 alb = mix(uRustDark * 0.85, uRust, smoothstep(0.3, 0.85, band));
        alb = mix(alb, uPlum * 1.6, smoothstep(0.5, 0.22, band) * 0.8);
        vec2 g = (b.gb * 2. - 1.) * uGradScale.y;
        vec3 N = normalize(vec3(-g.x * 0.5, 1., -g.y * 0.25));
        vec3 sunL = normalize(uSunDir);
        // sunlight only reaches the floor through the rifts: march the ray back up past the roll above
        float lit = 1.;
        vec2 sh = sunL.xz / max(sunL.y, 0.2);
        for (int i = 0; i < 3; i++) {
          float y = ${K.toFixed(1)} * (0.82 - 0.3 * float(i));
          float xr = abs(rollX(p + sh * (y - ${K.toFixed(1)})));
          float hw = halfW(y);
          lit *= smoothstep(hw - 6., hw + 34., xr);
        }
        lit *= smoothstep(0.1, 0.7, dot(N, sunL)) * (0.6 + 0.5 * b.r);
        // billowing rust cloud, dark where it meets the rift walls, smouldering from inside
        vec4 c = texture2D(uTexB, vec2(p.x / 95. + b.r * 0.3, p.y / 230. - uTime * 0.018));
        float occl = smoothstep(${(J+ne-6).toFixed(1)}, ${(J+ne+66).toFixed(1)}, abs(rollX(p)));
        vec3 col = alb * (0.3 + 0.35 * b.r) * (0.55 + 0.9 * c.r) + alb * uSunCol * lit * 0.5;
        col += uRust * 0.55 * pow(b.r, 3.) * (0.6 + 0.4 * sin(uTime * 0.4 + a.r * 9.)) * (0.4 + c.r);
        col *= mix(0.1, 1., occl);
        // sheet lightning walking through the floor cloud, cell by cell
        vec2 cq = p / 380., cid = floor(cq);
        float tk = uTime * 0.85 + hash21(cid) * 9., k = floor(tk), f = fract(tk);
        float on = step(0.93 - uStorm * 0.08, hash21(cid + k * 17.3));
        vec2 cp = (cid + 0.5 + (vec2(hash21(cid + k), hash21(cid - k * 3.1)) - 0.5) * 0.3) * 380.;
        vec2 ce = abs(fract(cq) - 0.5);
        float sheet = on * smoothstep(0., 0.09, f) * exp(-f * 5.) * (0.75 + 0.25 * sin(f * 40.)) * exp(-length(p - cp) / 95.) * (1. - smoothstep(0.34, 0.5, max(ce.x, ce.y)));
        col = mix(col, uIndigo * 0.5 + uPlum * 0.3, 0.12);
        col += uBoltCol * sheet * (0.6 + 1.6 * b.r) * 4. * mix(0.3, 1., occl);
        for (int i = 0; i < 4; i++) {
          float dist = length(uFlash[i].xyz - vWorld);
          col += uBoltCol * (uFlash[i].w * exp(-dist / 210.) * (0.5 + b.r) * 3.2);
        }
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),m=new r.Mesh(e,l);return m.position.y=K,m.name="rust-floor",m.frustumCulled=!1,m}function ft(o){const e=new r.BufferGeometry,l=4200,m=[-90,-170],c=[],z=[];m.forEach((L,k)=>{c.push(-l,L,-l,l,L,-l,l,L,l,-l,L,l);const F=k*4;z.push(F,F+2,F+1,F,F+3,F+2)}),e.setAttribute("position",new r.Float32BufferAttribute(c,3)),e.setIndex(z),e.boundingSphere=new r.Sphere(new r.Vector3,9e3);const P=new r.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...o,...we()},vertexShader:`
      varying vec3 vWorld;
      #include <fog_pars_vertex>
      void main() {
        vWorld = position;
        vec4 mvPosition = viewMatrix * vec4(position, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Fe}
      uniform sampler2D uTexA, uTexB; uniform float uTime, uVeil;
      uniform vec3 uSunCol, uTan, uCream, uRust, uIndigo;
      varying vec3 vWorld;
      #include <fog_pars_fragment>
      void main() {
        vec2 p = vWorld.xz;
        float lvl = step(-130., vWorld.y), dir = lvl * 2. - 1.;
        float hw = halfW(vWorld.y), xr = abs(rollX(p));
        float m = smoothstep(hw + 6., hw + 58., xr) * smoothstep(1150., 1290., length(p));
        float a = texture2D(uTexA, vec2(p.x / 330. + lvl * 0.37, p.y / 1500. + dir * uTime * 0.012)).r;
        float b = texture2D(uTexB, vec2(p.x / 140., p.y / 620. + dir * uTime * 0.021 + lvl * 0.5)).r;
        float alpha = m * smoothstep(0.52, 0.95, a * 0.75 + b * 0.55) * uVeil * mix(0.24, 0.07, lvl);
        float dC = length(cameraPosition - vWorld);
        alpha *= smoothstep(60., 160., dC);
        vec3 col = mix(uRust * 0.45 + uIndigo * 0.3, uTan * 0.7 + uRust * 0.15, lvl * 0.6 + b * 0.3) * (0.4 + 0.35 * lvl);
        gl_FragColor = vec4(col, alpha);
        #include <fog_fragment>
      }`}),C=new r.Mesh(e,P);return C.name="rift-veils",C.frustumCulled=!1,C.renderOrder=1,C}function dt(o,e,l,m){const z=new Uint8Array(2048),P=o.range(.52,.66),C=o.range(.18,.3),L=[],k=[];for(let h=0;h<26;h++)L.push(o());for(let h=0;h<140;h++)k.push(o());const F=(h,T)=>{const d=T*(h.length-1),b=Math.min(Math.floor(d),h.length-2),W=d-b,_=W*W*(3-2*W);return h[b]*(1-_)+h[b+1]*_};for(let h=0;h<512;h++){const T=h/511,d=F(L,T),b=F(k,T);let W=(.16+.62*d*d)*(.62+.38*b);W*=1-.92*Math.exp(-Math.pow((T-P)/.03,2)),W*=1-.7*Math.exp(-Math.pow((T-C)/.015,2)),W*=ve(0,.1,T)*ve(1,.86,T)*(.5+.5*ve(.08,.45,T));const _=.5+.5*Math.sin(T*9+d*2);z[h*4]=255*at(W,0,1),z[h*4+1]=255*_,z[h*4+2]=0,z[h*4+3]=255}const M=new r.DataTexture(z,512,1,r.RGBAFormat);M.magFilter=r.LinearFilter,M.minFilter=r.LinearFilter,M.wrapS=r.ClampToEdgeWrapping,M.needsUpdate=!0;const i=128,v=5200,x=l*Math.PI/180,n=Math.cos(x),G=Math.sin(x),g=[1.78,2.34],a=Math.asin(1/(g[0]*n))-.2,y=[],R=[],B=[],D=se();for(let h=0;h<=i;h++){const T=a+(Math.PI-2*a)*h/i;for(let d=0;d<2;d++)D.set(g[d]*Math.cos(T),-1+g[d]*Math.sin(T)*n,-g[d]*Math.sin(T)*G).normalize().multiplyScalar(v),y.push(D.x,D.y,D.z),R.push(T,d);if(h<i){const d=h*2;B.push(d,d+1,d+2,d+1,d+3,d+2)}}const N=new r.BufferGeometry;N.setAttribute("position",new r.Float32BufferAttribute(y,3)),N.setAttribute("uv",new r.Float32BufferAttribute(R,2)),N.setIndex(B);const Q=new r.ShaderMaterial({transparent:!0,depthWrite:!1,side:r.DoubleSide,blending:r.AdditiveBlending,fog:!1,uniforms:{uRing:{value:M},uNoise:e.uNoise,uTime:e.uTime,uCream:e.uCream,uTan:e.uTan,uBright:{value:m}},vertexShader:`
      varying vec2 vUv; varying float vEl;
      void main() {
        vUv = uv; vEl = normalize(position).y;
        vec4 mv = viewMatrix * vec4(position + cameraPosition, 1.);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform sampler2D uRing, uNoise; uniform float uTime, uBright; uniform vec3 uCream, uTan;
      varying vec2 vUv; varying float vEl;
      void main() {
        vec4 r = texture2D(uRing, vec2(vUv.y, 0.5));
        // ringlets shear slowly past each other (inner lanes orbit faster)
        float lane = floor(vUv.y * 40.);
        float cl = texture2D(uNoise, vec2(vUv.x * 2.2 + uTime * (0.004 + 0.006 * fract(lane * 0.371)), lane * 0.137)).r;
        float d = r.r * (0.78 + 0.44 * cl);
        vec3 col = mix(uTan * 1.25, vec3(1., 0.97, 0.92), r.g * 0.7 + 0.2) * d * uBright;
        col *= smoothstep(0.0, 0.075, vEl);                           // sinks into the limb haze
        gl_FragColor = vec4(col, 1.);
      }`}),w=new r.Mesh(N,Q);return w.name="ring-arch",w.frustumCulled=!1,w.renderOrder=0,w}function ht(o,e,l){const m=new r.SphereGeometry(1,10,8),c=new r.CylinderGeometry(1,1,1,5,1,!0).translate(0,.5,0),z=[],P=[],C=[];for(let n=0;n<m.attributes.position.count;n++)z.push(m.attributes.position.getX(n),m.attributes.position.getY(n),m.attributes.position.getZ(n)),P.push(0);for(let n=0;n<m.index.count;n++)C.push(m.index.array[n]);const L=m.attributes.position.count;for(let n=0;n<c.attributes.position.count;n++)z.push(c.attributes.position.getX(n),c.attributes.position.getY(n),c.attributes.position.getZ(n)),P.push(1);for(let n=0;n<c.index.count;n++)C.push(L+c.index.array[n]);m.dispose(),c.dispose();const k=[],F=[];for(const n of l){const G=Math.round(n.len/o.range(5.5,7)),g=n.len/G;for(let a=0;a<G;a++){const y=a/(G-1);let R=a===0?o.range(4.6,6.4):(.6+1.9*Math.pow(Math.sin(y*Math.PI*(2.5+n.phase))*.5+.5,1.8)+o.range(0,.5))*(1-.25*y);a>2&&o.chance(.09)&&(R=o.range(2.8,4.2)),k.push(n.x,n.top-a*g,n.z,R),F.push(n.phase,y,a===0?0:g,o())}for(let a=0,y=o.int(3,4);a<y;a++){const R=a===0,B=R?o.range(18,30):o.range(28,60),D=R?n.top-3:n.top-n.len+o.range(0,14);k.push(n.x+o.range(-1.6,1.6),D-B,n.z+o.range(-1.6,1.6),.001),F.push(n.phase,(R?.012:1-(D-(n.top-n.len))/n.len)+B*.004,B,o())}}const M=k.length/4,i=new r.InstancedBufferGeometry;i.setAttribute("position",new r.Float32BufferAttribute(z,3)),i.setAttribute("aKind",new r.Float32BufferAttribute(P,1)),i.setIndex(C),i.setAttribute("iA",new r.InstancedBufferAttribute(new Float32Array(k),4)),i.setAttribute("iB",new r.InstancedBufferAttribute(new Float32Array(F),4)),i.instanceCount=M,i.boundingSphere=new r.Sphere(new r.Vector3,9e3);const v=new r.ShaderMaterial({fog:!0,uniforms:{...e,...we()},vertexShader:`
      attribute float aKind; attribute vec4 iA, iB;
      uniform float uTime;
      varying vec3 vN, vWorld, vL; varying vec4 vI; varying float vKind;
      #include <fog_pars_vertex>
      vec3 sway(vec3 p, float t, float ph) {
        float w = t * t * 11. + t * 3.;
        p.x += sin(uTime * 0.31 + ph * 40. + t * 2.6) * w + sin(uTime * 0.07 + ph * 13.) * 5.;
        p.z += cos(uTime * 0.26 + ph * 23. + t * 2.1) * w + cos(uTime * 0.06 + ph * 29.) * 5.;
        p.y += sin(uTime * 0.2 + ph * 51.) * 2.5;
        return p;
      }
      void main() {
        float r = iA.w, t = iB.y;
        vec3 p; vec3 n;
        if (aKind < 0.5) {
          float breathe = 1. + 0.06 * sin(uTime * 0.9 + iB.w * 6.28 - t * 9.);
          p = iA.xyz + position * vec3(r, r * 1.5, r) * breathe; n = normalize(position * vec3(1., 0.67, 1.));
        } else {
          float wd = max(0.2, distance(cameraPosition, iA.xyz) * 0.0013);                  // links stay at least ~1.5 px wide
          p = iA.xyz + vec3(position.x * wd, position.y * iB.z, position.z * wd); n = normalize(vec3(position.x, 0., position.z));
        }
        p = sway(p, clamp(t - (p.y - iA.y) * 0.004, 0., 1.), iB.x);
        vN = n; vWorld = p; vI = vec4(iB.x, t, iB.w, r); vKind = aKind; vL = position;
        vec4 mvPosition = viewMatrix * vec4(p, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D uTexA; uniform float uTime; uniform vec3 uSunDir, uSunCol, uIndigo, uTan, uCream, uRust, uPlum, uCyan;
      varying vec3 vN, vWorld, vL; varying vec4 vI; varying float vKind;
      #include <fog_pars_fragment>
      void main() {
        vec3 N = normalize(vN), V = normalize(cameraPosition - vWorld), L = normalize(uSunDir);
        float ndl = dot(N, L), lit = smoothstep(-0.2, 0.4, ndl), nv = abs(dot(N, V)), fr = pow(1. - nv, 2.2);
        vec3 olive = vec3(0.13, 0.14, 0.04), gold = vec3(0.5, 0.33, 0.08);
        vec3 col;
        if (vKind > 0.5) col = olive * 0.6 * (0.35 + 0.65 * lit) * uSunCol;
        else {
          // a gas bag, not a bead: veined membrane, darker cap and gas line, translucent rim, light coming through the far side
          vec2 muv = vec2(atan(vL.x, vL.z) * 0.159 * 2. + vI.z * 7., vL.y * 0.45 + vI.z * 3.);
          vec4 m = texture2D(uTexA, muv);
          float vein = smoothstep(0.62, 0.86, m.a) * smoothstep(1.2, 2.4, vI.w);                 // only bags big enough to show it
          float gore = pow(abs(sin(atan(vL.x, vL.z) * 3.)), 14.) * smoothstep(1.6, 3., vI.w);
          vec3 alb = mix(olive, gold, smoothstep(0.4, 0.95, vI.z * 0.7 + (vL.y * 0.5 + 0.5) * 0.5 + (m.r - 0.5) * 0.4));
          alb *= 0.75 + 0.5 * m.r;
          alb = mix(alb, olive * 0.45, max(vein * 0.75, gore * 0.5));
          alb = mix(alb, olive * 0.6, smoothstep(0.55, 0.95, vL.y) * 0.7);                       // cap
          col = alb * uSunCol * lit + alb * (uPlum * 1.2 + uIndigo * 0.5) * (1. - lit);
          col += gold * smoothstep(0.3, -0.7, ndl) * 0.6 * (1. - vein * 0.7) * (0.5 + 0.5 * nv);   // sun through the bag
          col += mix(uTan, uCream, 0.5) * fr * (0.18 + 0.45 * lit);                              // membrane rim
          col += uSunCol * pow(max(dot(reflect(-L, N), V), 0.), 24.) * 0.35 * lit;               // wet highlight
          float bead = smoothstep(0.75, 1., sin(vI.y * 16. - uTime * 0.9 + vI.x * 30.));
          col += uCyan * bead * 0.7 * (0.4 + 0.6 * (1. - fr)) * (0.6 + 0.8 * vein);              // a pulse of light walking down the string
        }
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),x=new r.Mesh(i,v);return x.name="bladder-strings",x.frustumCulled=!1,{mesh:x,count:M,triangles:M*(C.length/3)}}var wt={id:"storm-bands",name:"The Storm Bands",category:"alien",weirdness:.5,async build(o){const e=o.rng,l=new r.Scene,m=e.pick(["cream","ochre","rose"]),c=lt.map(t=>new r.Color(t));let z="#1a2a5a",P="#060a1c",C=[.03,.013,.065],L="#fff7ec",k="#17123a";m==="ochre"&&(c[2].offsetHSL(.03,.2,-.09),c[1].offsetHSL(.03,.15,-.07),c[3].offsetHSL(.05,.08,-.02),c[4].offsetHSL(.045,.06,0),L="#fff1d0",k="#0b262e",c[0].offsetHSL(-.09,.05,-.03),z="#0e3040",P="#03090e",C=[.008,.03,.075]),m==="rose"&&(c[2].offsetHSL(-.035,.04,-.01),c[1].offsetHSL(-.035,0,-.02),c[3].offsetHSL(-.028,-.04,-.01),c[4].offsetHSL(-.03,0,0),c[5].offsetHSL(-.04,.12,.02),c[0].offsetHSL(.07,0,.01),L="#fff0f1",k="#26103a",z="#2c1c5e",P="#0a0618",C=[.05,.01,.06]);const F=c.map(t=>"#"+t.getHexString()),M=rt(e.range(40,48),-e.range(105,125)),i=e.sign(),v=125+e.range(-14,14),x=e.range(.2,1),n=e.range(.85,1.2),G=e.range(36,46),g=e.range(.75,1.15),a={x0:v+q/2,m1:e.range(8,14),m2:e.range(4,8),p1:e.range(0,ae),p2:e.range(0,ae)},y=c[1].clone().multiplyScalar(.46*n),R=e.int(1,3),B=[],D=e.range(.75,1.9);for(let t=0;t<R;t++){const s=[3.4,1.9,1.2][t]*e.range(.85,1.2)*(t===0?D:2.6-D);B.push({elevation:[6,5,11.5][t]+e.range(-1,1.5)+s*.25,azimuth:[-i*4.5,i*15,i*29][t]+e.range(-2.5,2.5),size:s,color:["#f1e2c8","#d9b9a0","#c8d4e8"][t],color2:["#8a6c58","#6a4a44","#5a6480"][t],texture:.7,phase:e.range(.16,.34),phaseAngle:e.range(105,150),intensity:1.5,dark:.02,glow:.12,glowColor:"#ffe2b8"})}await o.yield();const N=nt({rng:e,preset:"night",bake:!0,renderer:o.renderer,zenith:P,mid:z,horizon:y,ground:y.clone().multiplyScalar(.8),horizonPow:36,midPow:3.2,groundFalloff:3,sunDirection:M,sunColor:"#fff6ea",sunSize:.42,sunIntensity:13,sunGlow:.25,sunGlowTight:.9,scatter:0,stars:1.15,twinkle:.22,starDensity:1,milkyWay:.45,bodies:B,key:"sun",clouds:!1,clouds2:!1,lightning:0});l.add(N.object);const Q=3e-4*n;l.fog=new r.FogExp2(y,Q),await o.yield();const w=t=>e.range(-t,t),h=e.chance(.5),T=[{position:[79+w(3),70+w(4),1092+w(10)],size:h?68:60,drift:[2,5]},{position:[207+w(4),80+w(5),1040+w(12)],size:h?62:70,drift:[3,6]},{position:[-75+w(18),118+w(12),950+w(25)],size:e.range(105,128),drift:[12,12]},{position:[305+w(14),150+w(16),1245+w(20)],size:e.range(88,108),drift:[8,12]},{position:[18+w(14),250+w(14),846+w(20)],size:e.range(98,118),drift:[8,10]},{position:[-195+w(18),84+w(8),1265+w(25)],size:e.range(122,150),drift:[12,12]}],d=await it(o,{palette:F,sunDir:[M.x,M.y,M.z],pod:T,apronCut:872,wellColor:C});l.add(d.object);const b=d.uniforms;await o.yield();const W=d.anchors.flyThrough,_=d.anchors.portalSeat.position.clone(),be=v+i*e.range(3,12),ee=e.range(72,78),ze=1790,U=ot([[be,ee,ze],[be,ee,ze-95],[v+i*9,ee+1,1545],[v+i*4,ee+5,1395],[v+4,ee+9,1245],[136,86,1085],[124,78,955],W[2],W[3],W[4],[12,_.y+9,478],[1.5,_.y+1,432],[0,_.y,395],_]),Me=U.nearestXZ(W[2].x,W[2].z).u,Z=U.nearestXZ(136,1085).u,Te=[0,1,2,3].map(()=>new r.Vector4(0,-300,0,0)),te={uNoise:b.uNoise,uTexA:b.uTexA,uTexB:b.uTexB,uGradScale:b.uGradScale,uTime:b.uTime,uSunDir:b.uSunDirW,uSunCol:b.uSunCol,uIndigo:b.uIndigo,uTan:b.uTan,uCream:b.uCream,uRust:b.uRust,uRustDark:b.uRustDark,uPlum:b.uPlum,uCyan:b.uCyan,uBoltCol:b.uBoltCol,uLay:{value:new r.Vector4(a.x0,q,a.m1,a.m2)},uLayPh:{value:new r.Vector2(a.p1,a.p2)},uFlash:{value:Te},uStorm:{value:x},uVeil:{value:e.range(.7,1.1)}},Re=[];for(let t=-9;t<=8;t++){const s=a.x0+t*q;Re.push({x:s,hash:e(),flow:(t&1?1:-1)*e.range(5,10),near:Math.abs(s-v)<600})}const Ve=d.anchors.spin||1,Le=[1046,900];l.add(await ut(o,te,a,Re,Le.map((t,s)=>({R:t,hash:e(),flow:Ve*(8+2.6*s+e.range(0,1.5))})))),await o.yield(),l.add(ct(te),ft(te)),l.add(dt(e.fork("ring"),te,G,g)),await o.yield();const re={sunDirection:M,sunColor:"#fff4e2",litColor:c[2].clone().lerp(c[1],.22).multiplyScalar(.9),shadeColor:c[3].clone().lerp(c[4],.5).multiplyScalar(.85),bottomColor:c[5],hazeColor:y,silver:.12,opacity:.9},Be=[],ie=e.fork("crest");for(let t=-3;t<=2;t++)for(let s=-1200;s<1200;s+=200){const f=s+ie.range(0,150),u=a.x0+t*q+Ce(a,f)+ie.range(-12,12);Be.push([u,-20+ie.range(-5,4),f,ie.range(58,84)])}await o.yield();const le=await st({rng:e,...re,mode:"cumulus",at:Be,puffs:9,height:.32,wrap:!0,extent:[q*6,2400],farFade:[760,1080],wind:[0,0,-2.5],avoid:[[0,0,0,1125]]},o.yield);await o.yield();const ue=[],E=e.fork("collar");Le.forEach((t,s)=>{for(let f=-80;f<=80;f+=6.2*1192/t){const u=(f+E.range(-1.5,1.5))*Math.PI/180,S=t+E.range(-30,30),A=Math.sin(u)*S,$=Math.cos(u)*S,p=U.nearestXZ(A,$).dist;p<(s===1?130:105)||ue.push(p<190?[A,-40,$,84]:[A,-26+E.range(-6,6),$,E.range(120,180)*(s===1?.8:1)])}});for(let t=-80;t<=80;t+=4.2){const s=(t+E.range(-1.2,1.2))*Math.PI/180,f=862+E.range(-10,16);ue.push([Math.sin(s)*f,-30+E.range(-5,4),Math.cos(s)*f,E.range(74,108)]);const u=s+.037,S=E.range(825,840);ue.push([Math.sin(u)*S,-45+E.range(-4,4),Math.cos(u)*S,E.range(60,90)])}const Pe=Ue({rng:e,...re,litColor:re.litColor.clone().multiplyScalar(.9),mode:"cumulus",at:ue,puffs:13,height:.3,wind:[0,0,0],farFade:[2600,3600],noiseTexture:le.noiseTexture,avoid:[[0,0,0,790]]});await o.yield();const H=e.fork("towers"),Ke=[[368,915,310],[-350,1045,300],[720,770,380],[-700,640,430],[-620*i,-1180,420],[570*i,-1300,600],[1500*i,-260,400]],Se=[],ce=[];Ke.forEach(([t,s,f],u)=>{const S=u<2?10:u<4?40:90,A=f*(u<1?H.range(.97,1.06):H.range(.88,1.14)),$=u>=4,p={x:t+H.range(-S,S),z:s+H.range(-S,S),W:A};Se.push(p);const j=$?.2:.07,V=$?H.range(.4,.66):.52;ce.push([p.x,-70,p.z,A*.6]),ce.push([p.x+H.range(-.05,.05)*A,A*.2,p.z+H.range(-.05,.05)*A,A*.5]),ce.push([p.x+H.range(-j,j)*A,A*V,p.z+H.range(-j,j)*A,A*($?H.range(.8,1.1):1)])});const De=Ue({rng:e,...re,mode:"cumulus",at:ce,puffs:40,height:.8,wind:[.5,0,.2],farFade:[4300,5600],noiseTexture:le.noiseTexture,opacity:.94,bump:1.05});l.add(le.object,Pe.object,De.object);const Xe=[le,Pe,De];await o.yield();const Ie=[{rift:0,lead:360,dz:48,n:6},{rift:-1,lead:620,dz:-55,n:6},{rift:1,lead:380,dz:75,n:5}],We=Ie.map((t,s)=>{const f=ge.makeLightning({rng:e.fork("bolt"+s),from:[0,-85,0],to:[0,K+4,0],variants:5,branches:6,color:"#b9c8ff",intensity:8,width:2.6,interval:[1.9,2.8,3.5][s]/(.55+.75*x),offset:s*.83,light:!1,glow:.8});return l.add(f.object),f});await o.yield();const ke=(t,s)=>{const f=Math.sin(t*127.1+s*311.7)*43758.5453;return f-Math.floor(f)},qe=T.map(t=>[t.position[0],t.position[2],t.size]),fe=[],I=e.fork("kelp"),Ne=(t,s,f)=>{if(U.nearestXZ(t,s).dist<f)return!1;for(const u of Se)if(Math.hypot(t-u.x,s-u.z)<u.W*.72)return!1;for(const u of qe)if(Math.hypot(t-u[0],s-u[1])<u[2]+22)return!1;for(const u of fe)if(Math.hypot(t-u.x,s-u.z)<26)return!1;return!0},_e=e.range(.45,1);for(const t of[.17,.23,.29,.36,.45,.53,.61,.68,.75])if(I.chance(_e))for(let s=0;s<6;s++){const f=U.pointAt(t+I.range(-.015,.015)),u=I.sign(),S=I.range(95,170),A=f.x+u*S,$=f.z+I.range(-20,20);if(!Ne(A,$,90))continue;const p=Math.hypot(A,$)<800,j=p?I.range(110,140):I.range(170,220);fe.push({x:A,z:$,top:Math.max(f.y,p?20:60)+I.range(70,150),len:j,phase:I()});break}for(let t=0,s=Math.round(2+_e*5),f=0;t<s&&f<80;f++){const u=I.range(-650,800),S=I.range(860,1700);Math.hypot(u,S)<900||!Ne(u,S,130)||Math.hypot(u-be,S-ze)<520||S>1250&&Math.abs(u-v)<230||(fe.push({x:u,z:S,top:I.range(190,330),len:I.range(170,220),phase:I()}),t++)}const Ze=ht(I,te,fe);l.add(Ze.mesh),await o.yield();const $e={sunDir:[M.x,M.y,M.z],sunColor:"#fff4e2",sunIntensity:2.4,sky:"#5262a6",skyIntensity:.7,ground:F[3],groundIntensity:.9},de={rng:e,light:$e,caustics:0,top:"#cdb27a",belly:"#f6e9d2"},X=Se[0],Ge=d.anchors.spin||1,O=[];O.push(oe.makeMantaRay({...de,rng:e.fork("sk1"),count:e.int(9,14),span:5.5,speed:13,center:[Math.max(X.x-X.W*.5,250),112,X.z+X.W*.34],radius:68,height:30})),O.push(oe.makeMantaRay({...de,rng:e.fork("sk2"),count:e.int(5,8),span:6.5,speed:16,cross:{path:U,u:.13,lead:110,span:520,angle:58,side:-i,height:6,window:.2}})),O.push(oe.makeMantaRay({...de,rng:e.fork("sk3"),count:e.int(7,11),span:6,speed:15,center:[-Ge*70,_.y-62,300],radius:165,height:14})),e.chance(.65)?O.push(oe.makeFlock({rng:e.fork("swarm"),species:"starlings",count:1e3,size:17,speed:34,light:$e,center:[-Ge*230,20,150],radius:230,height:50,spread:[150,60,110],body:"#3a2230",belly:"#5a3440",wingC:"#2c1c2a",trail:"#4a2c3a",tip:"#20141e",head:"#2a1a26"})):O.push(oe.makeMantaRay({...de,rng:e.fork("sk4"),count:e.int(8,12),span:7,speed:14,along:{path:U,side:34*i,up:-16,lead:95,from:0,to:.42}}));for(const t of O)l.add(t.object);await o.yield();const he=ge.fxGroup();l.add(he.object),he.add(ge.makeParticles({rng:e.fork("ice"),preset:"dust",count:1500,box:[240,150,240],size:[.3,1],colors:["#fff3dc","#bff6ea","#ffd9a0"],velocity:[.8,.15,2.4],velocityRandom:[.6,.3,.8],intensity:1.5,time:b.uTime}));const Oe=he.add(ge.makeGlow({position:[_.x,_.y,_.z-.6],color:"#a8f7e6",size:60,intensity:.8,rays:.25,depthBias:0,near:[.3,1.6],fogAmount:.2,time:b.uTime})),Ye=se(T[0].position[0],T[0].position[1]+T[0].size*.5,T[0].position[2]),Je=se(),pe=se(),Qe=d.anchors.lookAt.clone(),et=se(X.x-X.W*.15,X.W*.42,X.z+20),tt=Z-.03;return await N.prewarm(o.renderer,null,l),{scene:l,path:U,duration:52,camera:{fov:62,near:1,far:6e3,lookAhead:40,sway:1,bank:.9},pois:[{at:(t,s)=>(U.pointAt(Math.min(s+.1,tt),pe),Je.set(v-i*6,-120,pe.z)),from:.05,to:Z-.1,weight:.3,fade:.35},{at:Ye,from:Z-.13,to:Z+.02,weight:.3,fade:.4},{at:et,from:Z+.02,to:Me-.06,weight:.32,fade:.4},{at:Qe,from:Me-.08,to:.93,weight:.5,fade:.3}],portal:{shape:"circle",radius:9,color:"#bff6ea",glow:1.5,revealDistance:480},post:{exposure:.94,bloom:{strength:.5,radius:.6,threshold:.95},grade:{saturation:1.08,contrast:1.06,tint:L,shadowTint:k,vignette:.34,grain:.02,aberration:0}},update(t,s,f,u){N.update(t,s,f),d.setProgress(u-Me+.6),d.update(t,s,f);for(const p of Xe)p.update(t,s,f);U.pointAt(u,pe);const S=pe.z;for(let p=0;p<We.length;p++){const j=We[p],V=Ie[p];j.update(t,s);const me=j.strike,je=(me%V.n+V.n)%V.n,Ae=Math.max(S-V.lead-Math.abs(V.dz)*(V.dz>0?je:V.n-1-je)+(ke(me,p)-.5)*30,1180),Ee=v+V.rift*q+Ce(a,Ae)+(ke(me,p+7.3)-.5)*110;j.object.position.set(Ee,0,Ae),j.object.rotation.y=ke(me,p+3.1)*ae,Te[p].set(Ee,K+45,Ae,j.flash)}const A=1-ve(Z-.16,Z-.09,u),$=Math.pow(Math.abs(Math.sin(s*2.3)),8)*(.8+.2*Math.sin(s*17));Te[3].set(v+Math.sin(s*.9)*50,K+35,Math.max(S-420-120*Math.sin(s*.37),1200),A*$*.9);for(const p of O)p.update(t,s,f,u);Oe.uniforms.uIntensity.value=.8+.2*Math.sin(s*1.7),he.update(t,s,f)},dispose(){d.dispose(),N.dispose()}}}};export{wt as default};
