import*as s from"three";import{makePath as Co,clamp as Q0,lerp as o0,smoothstep as X,bell as de}from"../kit/core.js";import{makeSky as Ao}from"../kit/sky.js";import*as j0 from"../kit/fx.js";import{buildHero as Do,stepNormals as Wo}from"../parts/dew-garden.js";const je=["#ffe6b8","#bfe3a0","#5f9e3a","#2e5a22","#3a2a1a","#e8f4ff","#ff5a7a"],I=Math.PI*2,V=(e=0,v=0,S=0)=>new s.Vector3(e,v,S),pe=`
  uniform float uTime; uniform vec3 uWindV;
  vec3 swayOff(float sp, float rp, float amp, float s) {
    float gust = 0.6 + 0.4 * sin(uTime * 0.21 + sp * 0.37);
    float nod = (sin(uTime * 0.8 + sp) * 0.7 + sin(uTime * 1.9 + rp) * 0.3) * gust;
    float a = amp * s * s * uWindV.z;
    vec2 d = uWindV.xy * nod * a + vec2(-uWindV.y, uWindV.x) * sin(uTime * 1.3 + rp * 1.7) * a * 0.3;
    return vec3(d.x, -abs(nod) * a * 0.12, d.y);
  }`;function Ze(e,v,S,x,W,z,k){const d=.6+.4*Math.sin(v*.21+x*.37),D=(Math.sin(v*.8+x)*.7+Math.sin(v*1.9+W)*.3)*d,w=z*k*k*S.z,b=Math.sin(v*1.3+W*1.7)*w*.3;return e.set(S.x*D*w-S.y*b,-Math.abs(D)*w*.12,S.y*D*w+S.x*b)}const Oe=`
  float hash11(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  vec3 hue(float h) { return clamp(abs(fract(h + vec3(0.0, 0.6667, 0.3333)) * 6.0 - 3.0) - 1.0, 0.0, 1.0); }
  float vn3(vec3 p) {
    vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    float n = i.x + i.y * 57.0 + i.z * 113.0;
    return mix(mix(mix(hash11(n), hash11(n + 1.0), f.x), mix(hash11(n + 57.0), hash11(n + 58.0), f.x), f.y),
               mix(mix(hash11(n + 113.0), hash11(n + 114.0), f.x), mix(hash11(n + 170.0), hash11(n + 171.0), f.x), f.y), f.z);
  }`,Xt=`
  float fogF() {
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
      #else
        return smoothstep(fogNear, fogFar, vFogDepth);
      #endif
    #else
      return 0.0;
    #endif
  }`,at=()=>s.UniformsUtils.merge([s.UniformsLib.fog]);function Po(e){return new s.ShaderMaterial({fog:!0,side:s.DoubleSide,vertexColors:!0,uniforms:{...at(),uTime:e.uTime,uWindV:e.uWindV,uSunDir:e.uSunDir,uSunCol:e.uSunCol,uLeafSun:e.uLeafSun,uSkyCol:e.uSkyCol,uGroundCol:e.uGroundCol,uShade:e.uShade,uMist:e.uMist,uMistCol:e.uMistCol},vertexShader:`
      attribute vec4 aData; attribute vec4 iVar; attribute vec3 iCol;
      varying vec3 vCol; varying vec3 vN; varying vec3 vW; varying vec2 vUv; varying vec4 vData; varying vec3 vTint;
      #include <fog_pars_vertex>
      ${pe}
      void main() {
        vCol = color; vUv = uv; vData = aData;
        vec3 p = position, n = normal;
        #ifdef USE_INSTANCING
          float isBlade = step(0.5, aData.z) * step(aData.z, 1.5);
          float b = iVar.w * isBlade;
          n = normalize(vec3(n.x, n.y - 2.0 * b * p.y * n.z, n.z));
          p.z += b * p.y * p.y;
          mat4 im = modelMatrix * instanceMatrix;
          vec3 sc = vec3(dot(im[0].xyz, im[0].xyz), dot(im[1].xyz, im[1].xyz), dot(im[2].xyz, im[2].xyz));
          vec4 wp = im * vec4(p, 1.0);
          vN = normalize(mat3(im) * (n / sc));
          wp.xyz += swayOff(iVar.x, iVar.y, iVar.z, aData.y);
          vTint = mix(vec3(1.0), iCol, aData.w);
        #else
          vec4 wp = modelMatrix * vec4(p, 1.0);
          vN = normalize(mat3(modelMatrix) * n);
          vTint = vec3(1.0);
        #endif
        vW = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uLeafSun, uSkyCol, uGroundCol, uMist, uMistCol; uniform vec2 uShade;
      varying vec3 vCol; varying vec3 vN; varying vec3 vW; varying vec2 vUv; varying vec4 vData; varying vec3 vTint;
      #include <fog_pars_fragment>
      ${Oe}
      void main() {
        vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vW), L = uSunDir;
        vec3 alb = vCol * vTint; float thin = vData.x, kind = vData.z, gloss = 0.0, fuzz = 0.0, glow = 0.0, edge = 0.0;
        if (kind > 0.5 && kind < 1.5) {                 // grass blade: parallel veins, pale midrib
          float rib = 0.5 + 0.5 * cos(vUv.x * 22.0);
          alb *= 0.84 + 0.22 * rib;
          alb = mix(alb, alb * 1.3 + vec3(0.02, 0.03, 0.0), 1.0 - smoothstep(0.0, 0.16, abs(vUv.x)));
          thin *= 0.75 + 0.35 * rib; gloss = 0.25;
        } else if (kind < 2.5) { if (kind > 1.5) {      // clover leaflet: pale chevron, side veins
          float ch = abs(vUv.y - 0.36 - 0.3 * abs(vUv.x));
          float band = 1.0 - smoothstep(0.03, 0.1, ch);
          alb = mix(alb, alb * 1.45 + vec3(0.06, 0.08, 0.05), band * 0.65);
          float vein = smoothstep(0.78, 1.0, abs(fract(vUv.y * 9.0 - abs(vUv.x) * 3.0) - 0.5) * 2.0);
          alb *= 1.0 + 0.2 * vein - 0.25 * (1.0 - smoothstep(0.0, 0.07, abs(vUv.x)));
        } } else if (kind < 3.5) {                      // toadstool cap: pale warts
          vec2 g = vUv * 4.3; vec2 c = floor(g), f = fract(g) - 0.5;
          vec2 o = (vec2(hash21(c), hash21(c + 7.3)) - 0.5) * 0.5;
          float sz = 0.1 + 0.17 * hash21(c + 3.1);
          float spot = 1.0 - smoothstep(sz, sz + 0.05, length(f - o));
          // the skin: crimson at the crown paling to orange-red at the margin, cloudy, finely pitted, with the margin's
          // radial grooves; each wart is a crumb of veil standing on the skin, with a shadow round its foot
          float rr = clamp(length(vUv), 0.0, 1.0), ang = atan(vUv.y, abs(vUv.x) < 1e-5 ? 1e-5 : vUv.x) * 86.0;
          g = vUv / max(rr, 1e-4) * asin(min(rr, 0.999)) * 3.4; c = floor(g); f = fract(g) - 0.5;      // warts laid out along the dome's arc, so they stay round down its steep side
          o = (vec2(hash21(c), hash21(c + 7.3)) - 0.5) * 0.5; sz = 0.1 + 0.17 * hash21(c + 3.1);
          spot = 1.0 - smoothstep(sz, sz + 0.05, length(f - o));
          float cloud = vn3(vW * 1.1 + 5.0), pit = vn3(vW * 7.0 + 2.0);
          alb *= mix(vec3(0.74, 0.6, 0.62), vec3(1.14, 1.12, 0.98), smoothstep(0.15, 1.0, rr)) * (0.74 + 0.42 * cloud) * (0.9 + 0.2 * pit);
          alb *= 1.0 - 0.24 * smoothstep(0.93, 0.995, rr) * (0.5 + 0.5 * cos(ang)) * (1.0 - smoothstep(1.2, 2.6, fwidth(ang)));
          float foot = (1.0 - smoothstep(sz + 0.04, sz + 0.15, length(f - o))) * (1.0 - spot);
          alb *= 1.0 - 0.42 * foot;
          alb = mix(alb, vec3(0.8, 0.76, 0.68) * (0.78 + 0.34 * vn3(vW * 9.0 + 1.0)), spot); thin *= 1.0 - 0.7 * spot; gloss = 0.5 * (1.0 - spot) * (0.35 + 0.9 * cloud);
        } else if (kind < 4.5) {                        // petal: fine streaks
          alb *= 0.9 + 0.1 * sin(vUv.x * 9.0) * sin(vUv.y * 3.0 + 1.0);
        } else if (kind < 5.5) {                        // moss: mottled fuzz
          float m = 0.55 * vn3(vW * 0.9) + 0.45 * vn3(vW * 2.6 + 7.0);
          float tuft = vn3(vW * 7.0 + 3.0), fine = vn3(vW * 19.0);
          alb *= (0.3 + 0.95 * m) * (0.45 + 0.7 * tuft + 0.45 * fine * fine);
          alb = mix(alb, alb * vec3(1.35, 1.25, 0.6), smoothstep(0.55, 0.9, tuft * 0.6 + fine * 0.5));   // pale sporophyte tips
          thin *= 0.25 + 0.75 * m; fuzz = 0.3 + 1.0 * fine * tuft;
        } else if (kind < 6.5) {                        // ladybird wing case: black spots, lacquer
          vec2 g = vec2(vUv.x * 2.0, vUv.y * 3.0); vec2 c = floor(g), f = fract(g) - 0.5;
          vec2 o = (vec2(hash21(c + 1.3), hash21(c + 5.7)) - 0.5) * 0.3;
          float spot = 1.0 - smoothstep(0.2, 0.25, length(f - o));
          alb = mix(alb, vec3(0.012), spot); gloss = 1.1; glow = 0.5; thin = max(thin, 0.5);   // lacquer the low sun shines through: red even against the light
        } else if (kind < 7.5) {                        // tulip petal: feathered streaks, pale base
          alb *= 0.84 + 0.16 * sin(vUv.x * 16.0 + sin(vUv.y * 5.0) * 1.5);
          alb = mix(alb, vec3(0.85, 0.8, 0.45), (1.0 - smoothstep(0.0, 0.3, vUv.y)) * 0.55);
          thin *= 0.7 + 0.3 * vUv.y;
          edge = smoothstep(0.84, 1.0, vUv.y) * 0.9 + smoothstep(0.78, 1.0, abs(vUv.x)) * 0.35;     // the rim of the cup catches the sun
        } else if (kind < 8.5) {                        // gills
          float gl = abs(fract(vUv.x * 70.0) - 0.5) * 2.0; alb *= 0.55 + 0.5 * gl; thin *= 0.5 + 0.5 * gl;
        } else if (kind < 9.5) { gloss = 1.2; glow = 1.0; }   // damselfly / beetle body: enamel
        else if (kind < 10.5) {                         // wet pebble, soil crumb, snail skin: speckled, glossy, a lit edge toward the sun
          float sp = vn3(vW * 5.0), sp2 = vn3(vW * 17.0 + 3.0);
          alb *= (0.55 + 0.6 * sp) * (0.8 + 0.4 * step(0.62, sp2)); gloss = 0.55; edge = 0.55;
        } else {                                        // snail shell: amber, dark bands that follow the whorl, growth lines, lacquer
          float band = smoothstep(0.26, 0.44, abs(fract(vUv.x * 3.0 + 0.12) - 0.5));
          alb *= mix(vec3(0.4, 0.17, 0.06), vec3(1.0), band) * (0.84 + 0.16 * sin(vUv.y * 380.0)); gloss = 1.0; edge = 0.2;
        }
        float ndl = dot(N, L);
        vec3 amb = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5);
        vec3 col = alb * (amb + uLeafSun * max(ndl * 0.8 + 0.2, 0.0) * 1.3);
        float toSun = max(dot(-V, L), 0.0);
        col += alb * (0.35 + 0.65 * alb) * uLeafSun * max(-ndl, 0.0) * thin * (0.9 + 1.5 * toSun * toSun);   // through a leaf the light comes out green whatever the hour: uLeafSun
        col += alb * uSkyCol * thin * 1.3 * max(-N.y, 0.0);       // sky light coming down through leaves and petals seen from below
        float rim = pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 3.0);
        vec3 lit = mix(uSunCol, alb * 2.2, 0.6) * rim * (0.1 + 1.2 * toSun * toSun * toSun) * (0.35 + 0.65 * thin);
        lit += mix(alb, vec3(0.75, 0.95, 0.35), 0.5) * uSunCol * fuzz * rim * (0.35 + 2.6 * toSun * toSun);                         // moss: a lime halo of back-lit fuzz
        lit += alb * glow * (0.3 + 0.5 * max(N.y, 0.0) + 1.8 * rim);                                                                // insect enamel catches the back-light
        lit += uSunCol * alb * edge * (0.25 + 1.5 * rim + 1.3 * max(-ndl, 0.0)) * (0.35 + 0.65 * toSun);                            // lit edges: tulip rims, wet stones
        vec3 R = reflect(-V, N);
        lit += gloss * (uSunCol * 2.5 * pow(max(dot(R, L), 0.0), 50.0) + uSkyCol * 0.5 * pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 2.0));
        float sh = smoothstep(0.0, uShade.y, vW.y);
        col *= mix(vec3(0.5, 0.75, 0.62) * uShade.x, vec3(1.0), sh);
        col += lit * mix(0.62, 1.0, sh);                // the deep shade at soil level dims the body colour more than the lights on its edges
        // the bed straight behind the Web lies in the band's shadow, deep green, so that the beads have the dark behind them;
        // the tulip cups stand up into the light and keep their colour
        col *= 1.0 - (kind > 6.5 && kind < 7.5 ? 0.2 : 0.74) * (1.0 - smoothstep(62.0 + max(0.0, -vW.z - 30.0) * 0.5, 112.0 + max(0.0, -vW.z - 30.0) * 0.5, abs(vW.x))) * (1.0 - smoothstep(-24.0, -4.0, vW.z));
        col = mix(col, uMistCol, uMist.x * (1.0 - exp(-vFogDepth * uMist.y)) * (1.0 - smoothstep(0.0, uMist.z, vW.y)) * (0.2 + 0.8 * smoothstep(-50.0, 20.0, vW.z)) * (0.76 + 0.24 * smoothstep(148.0, 184.0, vW.z)));   // no gold veil behind the Web: its beads need the dark; and a quarter less of it over the open ground of the clearing than among the blades
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function u0(){return{p:[],c:[],uv:[],d:[],i:[],n:0}}function S0(e,v,S,x,W,z,k,d){return e.p.push(v,S,x),e.c.push(W.r,W.g,W.b),e.uv.push(z,k),e.d.push(d[0],d[1],d[2],d[3]),e.n++}function Z0(e,v,S,x,W){e.i.push(v,S,x,x,S,W)}function f0(e){const v=new s.BufferGeometry;return v.setAttribute("position",new s.Float32BufferAttribute(e.p,3)),v.setAttribute("color",new s.Float32BufferAttribute(e.c,3)),v.setAttribute("uv",new s.Float32BufferAttribute(e.uv,2)),v.setAttribute("aData",new s.Float32BufferAttribute(e.d,4)),v.setIndex(e.i),v.computeVertexNormals(),v}const Fo=new s.Color,V0=(e,v,S,x=1)=>Fo.copy(e).lerp(v,S).multiplyScalar(x).clone();function h0(e,v,S,x,W,z=[-1,1]){const k=e.n;for(let d=0;d<=S;d++)for(let D=0;D<=v;D++){const w=D/v,b=d/S,y=x(w,b);S0(e,y[0],y[1],y[2],y[3],o0(z[0],z[1],w),b,[W[0],y[4]??W[1],W[2],W[3]])}for(let d=0;d<S;d++)for(let D=0;D<v;D++){const w=k+d*(v+1)+D;Z0(e,w,w+1,w+v+1,w+v+2)}}function N0(e,v,S,x,W,z,k){const d=e.n,D=v.length,w=V(),b=V(),y=V();for(let p=0;p<D;p++){const A=p/(D-1);w.copy(v[Math.min(D-1,p+1)]).sub(v[Math.max(0,p-1)]).normalize(),b.set(1,0,0),Math.abs(w.x)>.9&&b.set(0,0,1),y.crossVectors(w,b).normalize(),b.crossVectors(y,w).normalize();const C=x(A),_=W(A),j=z(A);for(let P=0;P<=S;P++){const T=P/S*I,N=Math.cos(T)*C,F=Math.sin(T)*C;S0(e,v[p].x+b.x*N+y.x*F,v[p].y+b.y*N+y.y*F,v[p].z+b.z*N+y.z*F,_,P/S,A,[k[0],j,k[2],k[3]])}}for(let p=0;p<D-1;p++)for(let A=0;A<S;A++){const C=d+p*(S+1)+A;Z0(e,C,C+S+1,C+1,C+S+2)}}function Vo(e,v,S,x){const W=e.n;for(let z=0;z<v.length;z++){const[k,d,D,w,b]=v[z];for(let y=0;y<=S;y++){const p=y/S*I,A=Math.cos(p)*k,C=Math.sin(p)*k,_=w===3;S0(e,A,d,C,D,_?A/x:y/S,_?C/x:k/x,[b,0,w,0])}}for(let z=0;z<v.length-1;z++)for(let k=0;k<S;k++){const d=W+z*(S+1)+k;Z0(e,d,d+S+1,d+1,d+S+2)}}const Lo=[0,.1,.24,.42,.6,.8,1],Ee=e=>.5*(e<.25?.72+.28*(e/.25):Math.pow(Math.max(0,1-(e-.25)/.75),.8)),Xe=e=>{const v=e[3].clone().multiplyScalar(.75),S=e[2].clone(),x=e[1].clone().lerp(e[2],.35),W=e[1].clone().lerp(e[0],.35);return z=>z<.3?V0(v,S,z/.3):z<.75?V0(S,x,(z-.3)/.45):V0(x,W,(z-.75)/.25)};function Kt(e,v=Lo,S=!1){const x=u0(),W=Xe(e);for(let z=0;z<v.length;z++){const k=v[z],d=Math.max(Ee(k),.03),D=W(k),w=[o0(.55,1,X(0,.5,k)),k,1,1];if(S){if(S0(x,-d,k,0,D,-1,k,w),S0(x,d,k,0,D,1,k,w),z>0){const b=(z-1)*2;Z0(x,b,b+1,b+2,b+3)}}else if(S0(x,-d,k,0,D,-1,k,w),S0(x,0,k,-d*.42,D,0,k,w),S0(x,d,k,0,D,1,k,w),z>0){const b=(z-1)*3;Z0(x,b,b+1,b+3,b+4),Z0(x,b+1,b+2,b+4,b+5)}}return f0(x)}function Ke(e,v,S,x,W=5.2){const z=u0(),k=Xe(e),d=18,D=S+W,w=[[0,0],[-.08*v,D*.95],[.72*v,D*1.32],[v,S]],b=(y,p)=>{const A=1-y;return A*A*A*w[0][p]+3*A*A*y*w[1][p]+3*A*y*y*w[2][p]+y*y*y*w[3][p]};for(let y=0;y<=d;y++){const p=y/d,A=b(p,0),C=b(p,1),_=b(Math.min(1,p+.01),0)-b(Math.max(0,p-.01),0),j=b(Math.min(1,p+.01),1)-b(Math.max(0,p-.01),1),P=Math.hypot(_,j)||1,T=.5*x*(p<.2?.75+.25*(p/.2):Math.pow(Math.max(0,1-(p-.2)/.8),.7))+.05,N=k(Math.min(1,p*1.15)),F=_/P,q=-j/P,Z=[o0(.55,1,X(0,.4,p)),Math.sqrt(p),1,1];if(S0(z,-T,C,A,N,-1,p,Z),S0(z,0,C-F*T*.42,A-q*T*.42,N,0,p,Z),S0(z,T,C,A,N,1,p,Z),y>0){const K=(y-1)*3;Z0(z,K,K+1,K+3,K+4),Z0(z,K+1,K+2,K+4,K+5)}}return f0(z)}function me(e,v,S=10,x=4,W=2.7,z=!1){const k=u0(),d=e[2].clone().lerp(e[1],.3).multiplyScalar(.8),D=e[2].clone().lerp(e[1],.25),w=e[1].clone().multiplyScalar(.95),b=[];for(let C=0;C<=5;C++){const _=C/5;b.push(V(x*_*_,S*(_-.06*Math.sin(_*Math.PI)),.5*Math.sin(_*3)))}N0(k,z?[b[0],b[2],b[5]]:b,z?3:5,C=>o0(.3,.14,C),()=>d,C=>C,[.5,0,0,1]);const y=b[5],p=[];for(let C=0;C<3;C++){const _=C/3*I+.4,j=Math.cos(_),P=Math.sin(_),T=v.range(.1,.28),N=v.range(.1,.22);p.push({ca:j,sa:P,droop:T,cup:N}),h0(k,z?2:4,z?3:4,(F,q)=>{const Z=F*2-1,K=Math.pow(Math.sin(Math.PI*Math.pow(q,.72)*.94+.04),.7)*.66,Q=q*(1-.2*Math.pow(1-Math.abs(Z),2)*X(.55,1,q)),B=Q*W*1.05+.12,M0=Z*K*W,E=-T*W*Q*Q+N*W*Math.abs(Z)*K-.03;return[y.x+j*B-P*M0,y.y+E,y.z+P*B+j*M0,V0(D,w,q*.6+.4*Math.abs(Z)),1]},[.95,1,2,1])}const A=f0(k);return A.userData.rim=(C,_,j,P)=>{const{ca:T,sa:N,droop:F,cup:q}=p[C],Z=Math.pow(Math.sin(Math.PI*Math.pow(_,.72)*.94+.04),.7)*.66,K=_*(1-.2*Math.pow(1-Math.abs(j),2)*X(.55,1,_)),Q=K*W*1.05+.12,B=j*Z*W;return P.set(y.x+T*Q-N*B,y.y-F*W*K*K+q*W*Math.abs(j)*Z-.03,y.z+N*Q+T*B)},A}function To(e,v,S=16){const x=u0(),W=e[2].clone().multiplyScalar(.8),z=new s.Color(.8,.79,.74),k=z.clone().lerp(e[6],.22),d=new s.Color(.85,.6,.08),D=new s.Color(.6,.36,.04),w=[];for(let P=0;P<=5;P++){const T=P/5;w.push(V(1.4*Math.sin(T*1.9),S*T,.8*T*T))}N0(x,w,5,P=>o0(.26,.16,P),()=>W,P=>P,[.4,0,0,1]);const b=w[5],y=.3,p=Math.cos(y),A=Math.sin(y),C=(P,T,N)=>[b.x+P,b.y+T*p-N*A,b.z+T*A+N*p],_=26;for(let P=0;P<_;P++){const T=P/_*I+v.range(-.05,.05),N=v.range(1.75,2.25),F=v.range(.2,.26),q=v.range(-.05,.25),Z=Math.cos(T),K=Math.sin(T);h0(x,1,2,(Q,B)=>{const M0=.6+B*N,E=(Q*2-1)*F*(B<.5?.6+.8*B:1-.5*(B-.5)*2),L=C(Z*M0-K*E,.12-q*B*B*N*.5+.08*(1-Math.abs(Q*2-1)),K*M0+Z*E);return[L[0],L[1],L[2],B<.1?k:V0(z,k,B*B*.5),1]},[.9,1,4,0])}h0(x,8,3,(P,T)=>{const N=T*1.35,F=Math.sin(N)*.78,q=P*I,Z=C(Math.cos(q)*F,.16+(Math.cos(N)-.22)*.5,Math.sin(q)*F);return[Z[0],Z[1],Z[2],V0(D,d,1-T*.6),1]},[.2,1,0,0]),h0(x,8,1,(P,T)=>{const N=o0(.2,.85,T),F=P*I,q=C(Math.cos(F)*N,-.5+.55*T,Math.sin(F)*N);return[q[0],q[1],q[2],W,1]},[.3,1,0,1]);const j=f0(x);return j.userData.top=b.clone(),j}function Bo(e){const v=u0(),S=e[2].clone().lerp(e[1],.5).multiplyScalar(.8),x=e[1].clone().lerp(e[6],.25).multiplyScalar(.75),W=[];for(let z=0;z<=4;z++)W.push(V(0,z/4,0));return N0(v,W,6,z=>o0(.42,.26,z),z=>V0(S,x,z),z=>z,[.6,0,0,1]),f0(v)}const Rt=1.55,Qt=.62;function Go(){const e=[],v=[],S=[],W=Rt-.3,z=.02;for(const[w,b]of[[z,0],[0,z]]){const y=e.length/3;e.push(-w,.4,-b,w,.4,b,-w,W,-b,w,W,b),v.push(0,-1,1,-1,0,-1,1,-1),S.push(y,y+1,y+2,y+2,y+1,y+3)}for(const[w,b]of[[.04,0],[0,.04]]){const y=e.length/3;e.push(-w*.4,.4-.04,-b*.4,w*.4,.4-.04,b*.4,-w,.4+.1,-b,w,.4+.1,b,-w*.4,.4+.3,-b*.4,w*.4,.4+.3,b*.4),v.push(0,-2,1,-2,0,-2,1,-2,0,-2,1,-2),S.push(y,y+1,y+2,y+2,y+1,y+3,y+2,y+3,y+4,y+4,y+3,y+5)}const k=e.length/3,d=10;e.push(0,W,0),v.push(0,0);for(let w=0;w<=d;w++){const b=w/d*I;e.push(Math.cos(b)*Qt,Rt,Math.sin(b)*Qt),v.push(w/d,1)}for(let w=0;w<d;w++)S.push(k,k+1+w,k+2+w);const D=new s.BufferGeometry;return D.setAttribute("position",new s.Float32BufferAttribute(e,3)),D.setAttribute("uv",new s.Float32BufferAttribute(v,2)),D.setIndex(S),D}function _o(e){const v=u0(),S=4.8,x=new s.Color(.74,.69,.58),W=x.clone().multiplyScalar(.7),z=new s.Color(.78,.72,.6),k=e[6].clone().lerp(new s.Color(.8,.05,.03),.6).multiplyScalar(.8),d=k.clone().multiplyScalar(.75);return Vo(v,[[0,0,W,0,.15],[1.45,.05,W,0,.15],[1.6,.7,x,0,.15],[1.05,1.7,x,0,.15],[.8,4.4,x,0,.15],[1.5,4.5,x,0,.5],[.85,5.2,x,0,.3],[.8,6.25,x,0,.15],[.8,6.25,z,8,.55],[4.55,5.95,z,8,.6],[4.55,5.95,d,3,.3],[4.8,6.15,d,3,.3],[4.6,6.9,k,3,.25],[3.8,7.8,k,3,.2],[2.5,8.55,k,3,.2],[1.1,8.95,k,3,.2],[0,9.05,k,3,.2]],20,S),f0(v)}function No(e,v,S,x=3){const W=new s.IcosahedronGeometry(1,x),z=W.attributes.position,k=u0(),d=e[3].clone().multiplyScalar(.7),D=e[2].clone().lerp(e[1],.45),w=v.range(0,9),b=v.range(0,9);for(let _=0;_<z.count;_++){let j=z.getX(_),P=z.getY(_),T=z.getZ(_);const N=1+.1*Math.sin(j*4+w)*Math.sin(T*4+b)+.13*S.n3(j*1.7+w,P*1.7,T*1.7+b)+.03*S.n3(j*4+b,P*4,T*4+w);j*=N,T*=N,P=P*.6*N,P<0&&(P=-.12*(1-Math.exp(P*9))),S0(k,j,P,T,V0(d,D,X(-.1,.6,P)),j,T,[.7,1,5,1]),_%3===2&&k.i.push(_-2,_-1,_)}W.dispose();const y=f0(k),p=y.attributes.position,A=y.attributes.normal,C=V();for(let _=0;_<p.count;_++)C.set(p.getX(_),Math.max(.05,p.getY(_))/.36,p.getZ(_)).normalize(),A.setXYZ(_,C.x,C.y,C.z);return y}function Re(e){const v=new s.IcosahedronGeometry(1,e),S=v.attributes.position,x=u0(),W=new s.Color(1,1,1);for(let w=0;w<S.count;w++){const b=S.getX(w),y=S.getY(w),p=S.getZ(w),A=1+.16*Math.sin(b*2.7+1.3)*Math.sin(p*3.1+.4)+.12*Math.sin(y*3.7+b*1.9);S0(x,b*A,y*A,p*A,W,b*.5+.5,p*.5+.5,[0,0,10,1]),w%3===2&&x.i.push(w-2,w-1,w)}v.dispose();const z=f0(x),k=z.attributes.position,d=z.attributes.normal,D=V();for(let w=0;w<k.count;w++)D.set(k.getX(w),k.getY(w),k.getZ(w)).normalize(),d.setXYZ(w,D.x,D.y,D.z);return z}function qo(){const e=u0(),v=new s.Color(.9,.88,.84);return h0(e,2,3,(S,x)=>{const W=S*2-1,z=.3*Math.pow(Math.sin(Math.PI*(.08+.9*x)),.6);return[W*z,.16*W*W+.22*x*x-.05,x-.5,v,0]},[.9,0,4,1]),f0(e)}function Qe(e,v,S=!1){const x=u0(),W=21,z=e[2].clone().lerp(e[1],.2).multiplyScalar(.7),k=e[2].clone().lerp(e[3],.3),d=e[1].clone().multiplyScalar(.8),D=new s.Color(.82,.82,.82),w=[];for(let p=0;p<=4;p++){const A=p/4;w.push(V(1.3*Math.sin(A*2.2),W*A,.8*A*A))}N0(x,S?[w[0],w[2],w[4]]:w,S?3:5,p=>o0(.62,.42,p),()=>z,p=>p*.8,[.3,0,0,0]);for(let p=0;p<2;p++){const A=p*Math.PI+v.range(-.5,.5),C=Math.cos(A),_=Math.sin(A),j=v.range(13,17),P=v.range(1.6,2.2);h0(x,S?1:2,S?3:5,(T,N)=>{const F=T*2-1,q=P*Math.sin(Math.PI*Math.pow(N,.6)*.97+.03),Z=.6+6*N*N,K=j*N*(1-.18*N),Q=Z-Math.abs(F)*.6,B=F*q+.7*Math.sin(N*5+p);return[C*Q-_*B,K,_*Q+C*B,V0(k,d,N),N*.6]},[.85,0,1,0])}const b=w[4],y=10.5;for(let p=0;p<6;p++){const A=p%2,C=p/6*I,_=A?.86:1;h0(x,S?2:3,S?3:5,(j,P)=>{const T=j*2-1,N=(.6+3.5*Math.pow(Math.sin(Math.min(1,P*1.25)*Math.PI*.5),.8)-.75*X(.6,1,P))*_,F=.78*Math.pow(Math.sin(Math.PI*(.12+.86*P)),.55)*(1-.55*X(.7,1,P)),q=C+T*F;return[b.x+Math.cos(q)*N,b.y-.2+P*y*(1-.1*T*T),b.z+Math.sin(q)*N,D,.8]},[.9,.8,7,1])}return f0(x)}function Ho(e){return new s.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,uniforms:{...at(),uTime:e.uTime,uWindV:e.uWindV,uSunDir:e.uSunDir,uSunCol:e.uSunCol,uViewH:e.uViewH,uGain:e.uDewGain,uDewCol:e.uDewCol,uSkyZen:e.uSkyZen,uSkyHor:e.uSkyHor,uSkyMid:e.uSkyMid,uCloudLit:e.uCloudLit,uGrassA:e.uGrassA,uGrassB:e.uGrassB,uSoil:e.uSoil,uBandCol:e.uBandCol,uStool:e.uStool},vertexShader:`
      attribute vec4 iPos; attribute vec4 iSw; attribute vec4 iDat;
      uniform float uViewH;
      varying vec2 vUv; varying vec3 vW; varying vec2 vDat; varying float vLod; varying float vDim; varying float vBig;
      #include <fog_pars_vertex>
      ${pe}
      const float Q = 2.4;
      void main() {
        vec3 p = iPos.xyz + swayOff(iSw.x, iSw.y, iSw.z, iSw.w);
        float r = iPos.w * (1.0 + 0.05 * sin(uTime * 3.1 + iDat.x * 40.0));
        float gone = 0.0, stretch = 1.0;
        if (iDat.y > 0.5) {
          float t = fract(uTime / iDat.z + iDat.w) * iDat.z, grow = iDat.z - 2.4, tf = max(0.0, t - grow);
          r *= 0.25 + 0.75 * smoothstep(0.0, grow * 0.8, t);
          p.y -= 0.5 * 9.0 * tf * tf;
          gone = step(p.y, 0.6); stretch = 1.0 + min(tf, 1.0) * 0.6;
        }
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vec4 mvPosition = viewMatrix * wp;
        float pxPerM = projectionMatrix[1][1] * uViewH * 0.5 / max(-mvPosition.z, 0.1);
        float rpx = r * pxPerM, rr = max(r, 1.3 / pxPerM);
        vLod = smoothstep(1.6, 4.5, rpx); vDim = clamp(rpx / 1.3, 0.0, 1.0); vBig = smoothstep(9.0, 30.0, rpx);
        vec2 ext = position.xy * Q * rr * (1.0 - gone);
        ext.x *= 1.0 + 0.04 * sin(uTime * 2.3 + iDat.x * 17.0); ext.y *= stretch * (1.0 - 0.04 * sin(uTime * 2.3 + iDat.x * 17.0));
        mvPosition.xy += ext;
        vUv = position.xy * Q; vDat = iDat.xw;
        vW = wp.xyz + vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]) * ext.x + vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]) * ext.y;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uDewCol, uSkyZen, uSkyHor, uSkyMid, uCloudLit, uGrassA, uGrassB, uSoil, uBandCol;
      uniform vec4 uStool;
      uniform float uGain, uTime;
      varying vec2 vUv; varying vec3 vW; varying vec2 vDat; varying float vLod; varying float vDim; varying float vBig;
      #include <fog_pars_fragment>
      ${Xt}
      ${Oe}
      const float Q = 2.4;
      vec3 env(vec3 d) {
        float h = d.y, az = atan(d.x, abs(d.z) < 1e-5 ? 1e-5 : d.z);
        // the hour's own sky: its horizon colour at the grass tips, through the mid band to the colour overhead, with a few soft clouds
        vec3 sky = mix(uSkyHor * 0.92, uSkyMid, smoothstep(0.26, 0.56, h));
        sky = mix(sky, uSkyZen, smoothstep(0.5, 0.96, h));
        float cl = smoothstep(0.52, 0.7, vn3(vec3(d.x * 2.6, h * 4.5, d.z * 2.6) + 3.7)) * smoothstep(0.3, 0.46, h) * (1.0 - smoothstep(0.86, 0.985, h));
        sky = mix(sky, mix(uCloudLit, uSkyZen * 0.7, smoothstep(0.42, 0.92, h)), cl * 0.8);
        float sd = max(dot(d, uSunDir), 0.0);
        sky += uSunCol * (4.0 * smoothstep(0.984, 0.997, sd) + 0.7 * pow(sd, 40.0) + 0.15 * pow(sd, 6.0));
        float c1 = az * 8.0, c2 = az * 21.0 + 1.7;
        float t1 = 0.2 + 0.42 * hash11(floor(c1) + 3.0) * (1.0 - 2.0 * abs(fract(c1) - 0.5));
        float t2 = 0.08 + 0.34 * hash11(floor(c2) + 31.0) * (1.0 - 2.0 * abs(fract(c2) - 0.5));
        float tp = max(t1, t2);
        float gm = 1.0 - smoothstep(tp - 0.015, tp + 0.015, h);
        vec3 grass = mix(uGrassB * 0.6, uGrassA * 0.85, smoothstep(-0.2, tp, h)) * (0.5 + 0.8 * hash11(floor(c2) + 5.0));
        grass += uSunCol * uGrassA * 0.55 * pow(sd, 3.0);
        grass = mix(grass, uSoil, smoothstep(0.2, 0.75, -h));
        // beyond the grass tips, toward the sunrise, the dark band of the neighbours' crowns
        float bt = 0.3 + 0.07 * sin(az * 5.0 + 1.0) + 0.04 * sin(az * 13.0);
        sky = mix(sky, uBandCol, (1.0 - smoothstep(bt - 0.04, bt + 0.03, h)) * (1.0 - smoothstep(-0.35, 0.15, d.z)) * (1.0 - 0.75 * smoothstep(0.93, 0.99, sd)));
        vec3 col = mix(sky, grass, gm);
        // the toadstool that stands beyond the big drop: a red cap with pale warts on a cream stem
        float cs = dot(d, uStool.xyz);
        if (cs > 0.6 && uStool.w > 0.0) {
          vec3 rs = cross(vec3(0.0, 1.0, 0.0), uStool.xyz); rs = rs / max(length(rs), 1e-4);
          vec2 q = vec2(dot(d, rs), d.y - uStool.y) / cs;
          float cap = (1.0 - smoothstep(0.85, 1.0, length(vec2(q.x / 0.2, (q.y - 0.005) / 0.12)))) * smoothstep(-0.004, 0.012, q.y);
          float stem = (1.0 - smoothstep(0.026, 0.04, abs(q.x) * (1.0 + 1.3 * smoothstep(-0.2, 0.0, q.y)))) * smoothstep(-0.27, -0.24, q.y) * (1.0 - smoothstep(0.0, 0.01, q.y));
          vec2 wg = q * 26.0; float wart = 1.0 - smoothstep(0.16, 0.3, length(fract(wg) - 0.5 - 0.25 * (vec2(hash11(floor(wg.x) + 7.0 * floor(wg.y)), hash11(floor(wg.y) + 3.0)) - 0.5)));
          col = mix(col, vec3(0.7, 0.66, 0.56) * (0.5 + 0.5 * smoothstep(-0.03, 0.03, q.x)), stem * uStool.w);
          col = mix(col, mix(vec3(0.62, 0.05, 0.03) * (0.55 + 0.6 * smoothstep(-0.1, 0.12, q.y)), vec3(0.8, 0.76, 0.68), wart * 0.9), cap * uStool.w);
        }
        return col;
      }
      void main() {
        float r = length(vUv);
        vec3 L = uSunDir, V = normalize(vW - cameraPosition);
        float toSun = max(dot(V, L), 0.0); toSun = toSun * toSun * toSun;
        vec3 rdir = normalize(vec3(hash11(vDat.x * 91.0), hash11(vDat.x * 57.0 + 3.0), hash11(vDat.y * 33.0 + 7.0)) - 0.5 + vec3(0.0, 0.0, 1e-4));
        float sp = max(0.5 + 0.5 * sin(vDat.x * 6.283 + dot(cameraPosition, rdir) * 1.1 + uTime * 0.7), 0.0);
        float spark = pow(sp, 14.0);
        vec3 rb = mix(vec3(1.0), hue(vDat.y + dot(cameraPosition, vec3(0.043, 0.031, 0.027))) * 1.35, 0.6);
        vec4 near = vec4(0.0);
        if (r < 1.0) {
          vec3 n = vec3(vUv, sqrt(max(1.0 - r * r, 0.0)));
          vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
          vec3 upv = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
          vec3 fwd = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
          vec3 tang = right * n.x + upv * n.y;
          vec3 Nw = tang + fwd * n.z;
          vec3 c = env(normalize(V - tang * 1.75)) * vec3(0.95, 1.0, 1.05) * 1.15;
          vec3 rf = reflect(V, Nw);
          float fres = pow(clamp(1.0 - n.z, 0.0, 1.0), 3.0);
          c = mix(c, env(rf), 0.07 + 0.6 * fres);
          // glass: the picture darkens toward the edge and the outline is dark; the light the drop gathers comes out as a
          // crescent inside the edge away from the sun, with only a thread of rim light round the rest
          c *= mix(1.0, 0.26, smoothstep(0.5, 0.93, r));
          vec2 sdir = vec2(dot(L, right), dot(L, upv)); float sl = length(sdir); sdir = sl > 1e-3 ? sdir / sl : vec2(0.0, 1.0);
          float away = clamp(0.5 - 0.5 * dot(vUv / max(r, 1e-3), sdir), 0.0, 1.0);
          float cres = smoothstep(0.6, 0.88, r) * (1.0 - smoothstep(0.92, 1.0, r)) * away * away;
          c += uSunCol * (cres * (0.45 + 1.3 * toSun) + smoothstep(0.93, 0.985, r) * (0.07 + 0.3 * toSun));
          c += uSunCol * 8.0 * pow(clamp(dot(rf, L), 0.0, 1.0), 160.0);
          vec2 wq = vUv - vec2(-0.4, 0.44); wq = vec2(wq.x * 0.77 + wq.y * 0.64, -wq.x * 0.64 + wq.y * 0.77) * vec2(3.6, 9.0);
          c += (uSkyZen + vec3(0.35)) * 0.55 * (1.0 - smoothstep(0.5, 1.0, length(wq)));      // the sky's window on its shoulder
          float a = 1.0 - smoothstep(1.0 - max(fwidth(r), 1e-4) * 1.5, 1.0, r);
          near = vec4(c * a, a);
        }
        vec2 q = mix(vUv, (vUv - vec2(0.56, 0.66)) * 6.5, vBig);
        float star = exp(-dot(q, q) * 2.6) + 0.55 * exp(-abs(q.x) * 9.0 - abs(q.y) * 1.7) + 0.55 * exp(-abs(q.y) * 9.0 - abs(q.x) * 1.7);
        star *= 1.0 - smoothstep(Q * 0.55, Q, r);
        near.rgb += mix(rb, vec3(1.0), 0.6 * vBig) * uSunCol * (spark + 0.35 * vBig) * star * 2.6 * uGain * (0.3 + 0.7 * toSun);
        float fa = exp(-r * r * 4.5);
        float fstar = (fa + 0.5 * (exp(-abs(vUv.x) * 7.0 - abs(vUv.y) * 1.3) + exp(-abs(vUv.y) * 7.0 - abs(vUv.x) * 1.3))) * (1.0 - smoothstep(Q * 0.5, Q, r));
        float dim = mix(0.4, 1.0, vDim);
        vec3 fc = (uDewCol * 0.24 + uSunCol * (0.14 + 0.6 * toSun)) * fa * dim + rb * uSunCol * spark * fstar * 6.0 * uGain * (0.35 + 0.65 * toSun) * mix(0.6, 1.0, vDim);
        vec4 o = mix(vec4(fc, fa * 0.5 * dim), near, vLod);
        o.rgb = mix(o.rgb, fogColor * o.a, fogF());
        gl_FragColor = o;
      }`})}function Io(e){return new s.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:s.DoubleSide,uniforms:{...at(),uTime:e.uTime,uWindV:e.uWindV,uSunDir:e.uSunDir,uSunCol:e.uSunCol},vertexShader:`
      attribute vec4 iVar;
      varying vec2 vUv; varying vec3 vW; varying vec2 vLoc; varying float vFade;
      #include <fog_pars_vertex>
      ${pe}
      void main() {
        vUv = uv; vLoc = position.xz; vFade = iVar.w;
        vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
        wp.xyz += swayOff(iVar.x, iVar.y, iVar.z, 1.0);
        vW = wp.xyz;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol;
      varying vec2 vUv; varying vec3 vW; varying vec2 vLoc; varying float vFade;
      #include <fog_pars_fragment>
      ${Xt}
      void main() {
        float toSun = max(dot(normalize(vW - cameraPosition), uSunDir), 0.0); toSun *= toSun;
        float a = 0.55;
        if (vUv.y >= 0.0) {                             // the pappus: thirty fine filaments, each ending in a bright tuft
          float f = abs(fract(atan(vLoc.y, abs(vLoc.x) < 1e-5 ? 1e-5 : vLoc.x) * 4.775) - 0.5) * 2.0;
          a = smoothstep(0.72, 0.97, f) * (0.24 + 0.5 * vUv.y) + smoothstep(0.86, 1.0, vUv.y) * 0.9 * smoothstep(0.3, 0.9, f) + 0.045 + 0.07 * min(vUv.y * vUv.y, 1.0);   // bright tips, a soft glow between the hairs
        }
        a *= vFade * (1.0 - fogF());
        vec3 col = mix(vec3(1.0), uSunCol, 0.45) * (0.5 + 0.85 * toSun);
        if (vUv.y < 0.0) col *= vec3(0.62, 0.5, 0.36);  // the stalk: straw brown, not a white bar
        if (vUv.y < -1.5) { col = vec3(0.1, 0.06, 0.035); a = 0.85 * vFade * (1.0 - fogF()); }   // the seed hanging under it: dark against the light
        gl_FragColor = vec4(col * a, a);
      }`})}const Ye=15;function Uo(){const e=[],v=[],S=[],x=[],z=Rt-.3,k=(D,w)=>{const b=e.length/3,y=D.length,p=new s.Vector3;for(let A=0;A<y;A++){p.subVectors(D[Math.min(y-1,A+1)],D[Math.max(0,A-1)]).normalize();for(const C of[-1,1])e.push(D[A].x,D[A].y,D[A].z),v.push(p.x,p.y,p.z,C),S.push(w,A/(y-1));if(A>0){const C=b+(A-1)*2;x.push(C,C+1,C+2,C+2,C+1,C+3)}}};k([new s.Vector3(0,.4-.04,0),new s.Vector3(0,.4+.3,0)],1),k([new s.Vector3(0,.4+.25,0),new s.Vector3(0,z,0)],0);for(let D=0;D<Ye;D++){const w=D/Ye*I+.7*Math.sin(D*2.4),b=Qt*(.82+.3*Math.abs(Math.sin(D*1.7+.4))),y=.26+.14*Math.sin(D*3.1),p=[];for(let A=0;A<=3;A++){const C=A/3,_=b*Math.pow(C,1.25),j=y*Math.pow(C,.55);p.push(new s.Vector3(Math.cos(w)*_,z+j,Math.sin(w)*_))}k(p,2)}{const D=e.length/3;for(const[w,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])e.push(0,z+.14,0),v.push(w,b,0,0),S.push(3,0);x.push(D,D+1,D+2,D+2,D+1,D+3)}const d=new s.BufferGeometry;return d.setAttribute("position",new s.Float32BufferAttribute(e,3)),d.setAttribute("aT",new s.Float32BufferAttribute(v,4)),d.setAttribute("aK",new s.Float32BufferAttribute(S,2)),d.setIndex(x),d}function jo(e){return new s.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:s.DoubleSide,uniforms:{...at(),uSunDir:e.uSunDir,uSunCol:e.uSunCol,uViewH:e.uViewH},vertexShader:`
      attribute vec4 aT; attribute vec2 aK; attribute vec4 iVar;
      uniform float uViewH;
      varying vec3 vK; varying vec3 vW; varying vec2 vQ; varying float vFade;
      #include <fog_pars_vertex>
      void main() {
        mat4 im = modelMatrix * instanceMatrix;
        float scl = length(im[0].xyz);
        vec4 wp = im * vec4(position, 1.0);
        vec4 mvPosition = viewMatrix * wp;
        float pxPerM = projectionMatrix[1][1] * uViewH * 0.5 / max(-mvPosition.z, 0.1), thin = 1.0;
        vQ = vec2(0.0);
        if (aK.x > 2.5) { mvPosition.xy += aT.xy * ${(Qt*1.5).toFixed(3)} * scl; vQ = aT.xy; }
        else {
          vec3 tv = mat3(viewMatrix) * (mat3(im) * aT.xyz); tv = tv / max(length(tv), 1e-5);
          vec3 side = cross(tv, mvPosition.xyz / max(length(mvPosition.xyz), 1e-4)); side = side / max(length(side), 1e-4);
          float w0 = (aK.x > 1.5 ? 0.02 : aK.x > 0.5 ? 0.085 : 0.03) * scl, w = max(w0, 1.35 / pxPerM);
          thin = clamp(w0 / w, 0.0, 1.0);
          mvPosition.xyz += side * aT.w * w * 0.5; vQ.x = aT.w;
        }
        vK = vec3(aK, thin); vFade = iVar.w; vW = wp.xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol;
      varying vec3 vK; varying vec3 vW; varying vec2 vQ; varying float vFade;
      #include <fog_pars_fragment>
      ${Xt}
      void main() {
        vec3 V = vW - cameraPosition; V = V / max(length(V), 1e-4);
        float toSun = clamp(dot(V, uSunDir), 0.0, 1.0); toSun *= toSun;
        vec3 warm = mix(vec3(1.0), uSunCol, 0.5), col; float a;
        if (vK.x > 2.5) {                                // the glow in the cup
          vec2 gq = clamp(vQ, -1.0, 1.0); float r2 = clamp(dot(gq, gq), 0.0, 1.0);
          a = (1.0 - r2) * (1.0 - r2) * (0.15 + 0.3 * toSun); col = warm * 1.3;
        } else {
          float ax = clamp(vQ.x, -1.0, 1.0), across = 1.0 - ax * ax, th = clamp(vK.z, 0.0, 1.0);      // the across coordinate held to its own range before it is squared
          if (vK.x > 1.5) {                              // a hair: faint at the root, a bright point at its tip
            float tip = smoothstep(0.74, 1.0, vK.y);
            a = across * (0.3 + 0.3 * vK.y + 0.6 * tip) * th; col = warm * (0.7 + 0.9 * toSun) * (1.0 + 1.5 * tip);
          } else if (vK.x > 0.5) { a = across * 0.9 * th; col = vec3(0.1, 0.06, 0.035); }      // the seed, dark against the light
          else { a = across * 0.6 * th; col = vec3(0.62, 0.5, 0.36) * (0.5 + 0.6 * toSun); }      // the stalk, straw
        }
        a = clamp(a, 0.0, 1.0) * vFade * (1.0 - fogF());
        gl_FragColor = vec4(col * a, a);
      }`})}function Zo(e){return new s.ShaderMaterial({transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,uniforms:{uTime:e.uTime,uAmount:e.uBokeh},vertexShader:`
      attribute vec4 iPos; attribute vec4 iCol;
      uniform float uTime;
      varying vec2 vUv; varying vec3 vCol;
      void main() {
        vec3 wc = iPos.xyz + vec3(cameraPosition.x, 0.0, cameraPosition.z);
        wc.x += sin(uTime * 0.13 + iCol.w) * 4.0; wc.y += sin(uTime * 0.19 + iCol.w * 1.7) * 2.0;
        vec4 mv = viewMatrix * vec4(wc, 1.0);
        float s = iPos.w * (0.9 + 0.1 * sin(uTime * 0.7 + iCol.w * 3.0));
        mv.xy += position.xy * s;
        vUv = position.xy;
        vCol = iCol.rgb * (0.55 + 0.45 * sin(uTime * (0.5 + fract(iCol.w) * 1.3) + iCol.w * 5.0));
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      uniform float uAmount;
      varying vec2 vUv; varying vec3 vCol;
      void main() {
        float r = length(vUv);
        float a = (1.0 - smoothstep(0.9, 1.0, r)) * (0.5 + 0.5 * smoothstep(0.55, 0.93, r));
        gl_FragColor = vec4(vCol * a * uAmount, 1.0);
      }`})}function Oo(e,v){return new s.ShaderMaterial({fog:!0,uniforms:{...at(),uSunDir:e.uSunDir,uSunCol:e.uSunCol,uLeafSun:e.uLeafSun,uSkyCol:e.uSkyCol,uMist:e.uMist,uMistCol:e.uMistCol,uSoil:{value:v[4].clone().multiplyScalar(.42)},uMoss:{value:v[3].clone().lerp(v[2],.35).multiplyScalar(.8)},uLime:{value:v[1].clone().multiplyScalar(.6)}},vertexShader:`
      varying vec3 vW; varying vec3 vN;
      #include <fog_pars_vertex>
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vW = wp.xyz; vN = normal;
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uLeafSun, uSkyCol, uSoil, uMoss, uLime, uMist, uMistCol;
      varying vec3 vW; varying vec3 vN;
      #include <fog_pars_fragment>
      ${j0.GLSL_NOISE}
      void main() {
        vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
        float m = fbmLo(vW.xz * 0.045), d = 0.6 * vnoise(vW.xz * 0.5 + 7.0) + 0.4 * vnoise(vW.xz * 1.3), g = vnoise(vW.xz * 2.3);
        // the clearing floor is mossier than the soil under the blades
        float clr = (1.0 - smoothstep(34.0, 64.0, abs(vW.x))) * smoothstep(-70.0, -10.0, vW.z) * (1.0 - smoothstep(170.0, 205.0, vW.z));
        clr = max(clr, 0.8 * (1.0 - smoothstep(-50.0, 20.0, vW.z)));                         // and the lawn runs on under the flowerbed
        float moss = smoothstep(0.32, 0.56, m + (d - 0.5) * 0.35 + 0.3 * clr);
        float nearF = exp(-vFogDepth * 0.016), midF = exp(-vFogDepth * 0.005);
        vec3 d1 = vnoised(vW.xz * 1.5 + 3.0), d2 = vnoised(vW.xz * 6.0 + 11.0);
        vec3 alb = mix(uSoil * (0.55 + 0.9 * d), mix(uMoss, uLime, d * g) * (0.6 + 0.8 * g), moss);
        alb *= mix(1.0, 0.62 + 0.76 * d1.x, midF) * mix(1.0, 0.7 + 0.6 * d2.x, nearF);
        // crumbs of dark soil and small pebbles, each with a lit edge toward the sun
        vec2 cg = vW.xz * 0.85, cc = floor(cg), co = 0.2 + 0.6 * hash22(cc);
        float ch = hash12(cc + 9.0), cr = 0.07 + 0.2 * hash12(cc + 3.0);
        vec2 cv = fract(cg) - co; float cd = length(cv);
        float crumb = (1.0 - smoothstep(cr * 0.75, cr, cd)) * step(0.4, ch) * midF;
        float crumbLit = crumb * smoothstep(-0.2, 0.9, dot(cv / max(cd, 1e-3), normalize(uSunDir.xz))) * smoothstep(cr * 0.35, cr * 0.9, cd);
        alb = mix(alb, mix(uSoil * 0.35, uSoil * 1.5 + 0.03, step(0.78, ch)), crumb * (1.0 - 0.6 * moss));
        N = normalize(N + vec3(d1.y, 0.0, d1.z) * -0.22 * midF + vec3(d2.y, 0.0, d2.z) * -0.1 * nearF);
        // long light and shadow streaks thrown toward the camera by the blades
        vec2 sp = vec2(dot(vW.xz, vec2(-uSunDir.z, uSunDir.x)), dot(vW.xz, uSunDir.xz));
        float streak = smoothstep(0.4, 0.68, 0.65 * vnoise(vec2(sp.x * 0.2, sp.y * 0.016)) + 0.35 * vnoise(vec2(sp.x * 0.55, sp.y * 0.04) + 3.0));
        float ndl = max(dot(N, uSunDir), 0.0);
        vec3 col = alb * (uSkyCol * 0.5 + uLeafSun * (0.12 + 2.6 * ndl) * streak);
        col += mix(uSunCol, alb * 5.0, 0.6 * moss) * streak * mix(0.3, 0.1, moss) * pow(max(dot(reflect(-V, N), uSunDir), 0.0), 12.0) * (0.3 + g);   // wet soil shines, moss only glows
        col += mix(uSunCol, uLeafSun, 0.6) * alb * 2.2 * crumbLit * (0.3 + 0.7 * streak);
        // wet sparkles: tiny beads of water on the soil that flash as the camera moves
        vec2 sg = vW.xz * 2.6, sc = floor(sg); float sh = hash12(sc + 17.0);
        float sdot = 1.0 - smoothstep(0.05, 0.22, length(fract(sg) - 0.25 - 0.5 * hash22(sc + 5.0)));
        float tw = pow(max(0.5 + 0.5 * sin(sh * 311.0 + dot(cameraPosition, vec3(1.3, 0.9, 1.1)) * 1.4), 0.0), 6.0);
        float toSunG = max(dot(-V, uSunDir), 0.0);
        col += uSunCol * 3.2 * sdot * tw * step(0.9, sh) * nearF * (0.25 + 0.75 * toSunG * toSunG) * (0.35 + 0.65 * streak);
        col *= 1.0 - 0.74 * (1.0 - smoothstep(62.0 + max(0.0, -vW.z - 30.0) * 0.5, 112.0 + max(0.0, -vW.z - 30.0) * 0.5, abs(vW.x))) * (1.0 - smoothstep(-24.0, -4.0, vW.z));
        col = mix(col, uMistCol, uMist.x * (1.0 - exp(-vFogDepth * uMist.y)) * (1.0 - smoothstep(0.0, uMist.z, vW.y)) * (0.2 + 0.8 * smoothstep(-50.0, 20.0, vW.z)) * (0.76 + 0.24 * smoothstep(148.0, 184.0, vW.z)));   // no gold veil behind the Web: its beads need the dark; and a quarter less of it over the open ground of the clearing than among the blades
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function Eo(e,v,S,x,W,z,k,d){return new s.ShaderMaterial({transparent:!0,depthWrite:!1,uniforms:{uHaze:{value:v},uCrown:{value:S},uLeaf:{value:x},uWood:{value:W},uSunX:{value:z},uSunY:{value:d},uHazeK:{value:k},uSunCol:e.uSunCol,uTime:e.uTime},vertexShader:`
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      uniform vec3 uHaze, uCrown, uLeaf, uWood, uSunCol; uniform float uSunX, uSunY, uTime, uHazeK; varying vec2 vUv;
      float h1(float n) { return fract(sin(n * 91.7) * 43758.5); }
      float n1(float x) { float i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h1(i), h1(i + 1.0), f); }
      void main() {
        float x = (vUv.x - 0.5) * 3800.0, y = vUv.y * 520.0 - 20.0;
        float sx = (x - uSunX) / 180.0, gap = exp(-sx * sx);                       // the parting where the sun stands
        float sw = 0.25 * sin(uTime * 0.3 + x * 0.004);
        // the trees: three ranks of big soft crowns, the nearer ones lower and darker
        float c1 = 352.0 + 60.0 * (n1(x * 0.0062 + 3.0) - 0.5) + 30.0 * abs(sin(x * 0.0113 + 2.3 + sw)) + 14.0 * abs(sin(x * 0.037 + 0.4 + 2.0 * sw)) + 30.0 * smoothstep(300.0, 1200.0, abs(x - uSunX));
        c1 = mix(c1, uSunY - 62.0, gap);
        float c2 = 236.0 + 50.0 * (n1(x * 0.0091 + 17.0) - 0.5) + 24.0 * abs(sin(x * 0.017 + 0.7 - sw)) + 11.0 * abs(sin(x * 0.051 + 1.9 + 1.5 * sw));
        c2 = mix(c2, uSunY - 112.0, gap * 0.9);
        float a1 = 1.0 - smoothstep(c1 - 30.0, c1 + 16.0, y), a2 = 1.0 - smoothstep(c2 - 22.0, c2 + 10.0, y);
        float mot = n1(x * 0.021 + y * 0.013) * n1(x * 0.0083 - y * 0.031 + 5.0);
        vec3 far = uCrown * (0.75 + 0.9 * mot) + uHaze * (0.07 + 0.25 * uHazeK);
        far += uSunCol * 0.2 * smoothstep(c1 - 46.0, c1 + 4.0, y) * (0.25 + 0.75 * exp(-sx * sx * 0.12));             // light catching the tops
        vec3 mid = mix(uCrown, uLeaf, 0.45) * (0.55 + 1.0 * n1(x * 0.033 - y * 0.02 + 9.0) * n1(x * 0.012 + y * 0.04)) + uHaze * (0.025 + 0.2 * uHazeK);
        mid += uSunCol * 0.1 * smoothstep(c2 - 30.0, c2 + 2.0, y) * (0.3 + 0.7 * exp(-sx * sx * 0.2));
        vec3 col = mix(far, mid, a2); float a = a1 + a2 * (1.0 - a1);
        // the fence in front of them: boards that melt into each other, the sun grazing its top rail
        float bx = x / 11.0, id = floor(bx), f = fract(bx);
        float top = 104.0 + 4.0 * sin(x * 0.0043 + 1.3) + 1.5 * (h1(id) - 0.5);
        float fa = 1.0 - smoothstep(top - 9.0, top + 5.0, y);
        float tone = mix(h1(id), h1(id + 1.0), smoothstep(0.3, 0.7, f));
        vec3 fc = uWood * (0.7 + 0.6 * tone) + uHaze * (0.05 + 0.16 * uHazeK) + uSunCol * 0.14 * smoothstep(top - 16.0, top, y) * exp(-sx * sx * 0.3);
        col = mix(col, fc, fa); a = a + fa * (1.0 - a);
        // shrubs and tall weeds along its foot, a blur of deep green
        float hh = 64.0 + 18.0 * sin(x * 0.019 + 0.7) + 11.0 * sin(x * 0.047 + 2.1 + 0.3 * sin(uTime * 0.4 + x * 0.01)) + 6.0 * sin(x * 0.11 + uTime * 0.25);
        float hm = 1.0 - smoothstep(hh - 18.0, hh + 8.0, y);
        vec3 lf = uLeaf * (0.7 + 0.7 * n1(x * 0.027 + y * 0.05) * n1(x * 0.071 + 2.0)) + uHaze * (0.06 + 0.2 * uHazeK);
        col = mix(col, lf, hm * 0.92);
        col = mix(col, uHaze, uHazeK * 0.45 * (1.0 - smoothstep(0.0, 90.0, y)));   // ground mist at its foot
        gl_FragColor = vec4(col, a * 0.97);
      }`})}function Xo(e,v){return new s.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:s.AdditiveBlending,side:s.DoubleSide,uniforms:{...at(),uTime:e.uTime,uCol:{value:v},uAmount:e.uShafts},vertexShader:`
      attribute vec4 aDir; attribute vec4 aA;
      varying vec2 vUv; varying float vPh; varying float vFace; varying float vDepth; varying float vLen;
      #include <fog_pars_vertex>
      void main() {
        vec3 wp0 = position + aDir.xyz * aDir.w * aA.y;
        vec4 mvPosition = viewMatrix * vec4(wp0, 1.0);
        vec3 tv = normalize(mat3(viewMatrix) * aDir.xyz);
        vec3 side = cross(tv, normalize(mvPosition.xyz));
        float sl = length(side);
        side = side / max(sl, 1e-4);
        mvPosition.xyz += side * aA.x * aA.z * (0.75 + 0.9 * aA.y);
        vUv = vec2(aA.x, aA.y); vPh = aA.w; vFace = smoothstep(0.035, 0.16, sl); vDepth = -mvPosition.z; vLen = aDir.w * aA.y;      // metres from where the shaft leaves the Web
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCol; uniform float uAmount, uTime;
      varying vec2 vUv; varying float vPh; varying float vFace; varying float vDepth; varying float vLen;
      #include <fog_pars_fragment>
      ${Xt}
      void main() {
        float across = clamp(1.0 - abs(vUv.x), 0.0, 1.0); across = across * across * (3.0 - 2.0 * across);      // the across coordinate held to its own range before it is squared
        float along = smoothstep(0.0, 0.05, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.y));
        float dust = 0.72 + 0.28 * sin(vUv.y * 23.0 - uTime * 0.5 + vPh) * sin(vUv.y * 7.0 + uTime * 0.23 + vPh * 2.0);
        float breathe = 0.75 + 0.25 * sin(uTime * 0.37 + vPh * 3.0);
        float a = across * along * dust * breathe * vFace * smoothstep(5.0, 26.0, vDepth) * (1.0 - 0.8 * fogF()) * (0.4 + 0.6 * smoothstep(0.0, 100.0, vLen));
        gl_FragColor = vec4(uCol * a * uAmount, 1.0);
      }`})}function $e(e,v,S,x=[4,16],W=1){return new s.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide,uniforms:{...at(),uTime:e.uTime,uSunDir:e.uSunDir,uSunCol:e.uSunCol,uCol:{value:new s.Color(v)},uFlap:{value:new s.Vector3(...S)},uVein:{value:new s.Vector2(...x)},uGlint:{value:W}},vertexShader:`
      attribute vec3 aW;      // side sign, phase, hinge height
      uniform float uTime; uniform vec3 uFlap;
      varying vec2 vUv; varying vec3 vW; varying vec3 vN;
      #include <fog_pars_vertex>
      void main() {
        vUv = uv;
        float an = (uFlap.z + uFlap.y * sin(uTime * uFlap.x + aW.y)) * aW.x;
        vec3 p = position; p.y -= aW.z;
        float c = cos(an), s = sin(an);
        p.xy = vec2(p.x * c - p.y * s, p.x * s + p.y * c); p.y += aW.z;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vW = wp.xyz; vN = normalize(mat3(modelMatrix) * vec3(-s, c, 0.0));
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uCol; uniform vec2 uVein; uniform float uGlint;
      varying vec2 vUv; varying vec3 vW; varying vec3 vN;
      #include <fog_pars_fragment>
      void main() {
        vec3 V = normalize(vW - cameraPosition), N = normalize(vN);
        float toSun = max(dot(V, uSunDir), 0.0);
        float lon = smoothstep(0.86, 1.0, abs(fract(vUv.x * uVein.x * 0.5 + 0.5) - 0.5) * 2.0);                       // long veins
        float crs = smoothstep(0.84, 1.0, abs(fract(vUv.y * uVein.y + vUv.x * 0.7) - 0.5) * 2.0) * 0.55;               // cross veins
        float vein = min(1.0, lon + crs);
        float edge = smoothstep(0.82, 1.0, abs(vUv.x)), lead = smoothstep(0.7, 1.0, vUv.x);
        float stigma = smoothstep(0.84, 0.87, vUv.y) * (1.0 - smoothstep(0.92, 0.95, vUv.y)) * smoothstep(0.35, 0.6, vUv.x);   // the dark cell near the tip
        float sheen = pow(clamp(1.0 - abs(dot(N, V)), 0.0, 1.0), 2.0);
        float back = toSun * toSun, rim = min(1.0, vein + edge);
        float sliver = pow(max(dot(reflect(V, N), uSunDir), 0.0), 26.0);
        float a = clamp(0.07 + 0.1 * sheen + (0.34 + 0.4 * back) * vein + 0.6 * edge + 0.6 * stigma + 0.85 * sliver * uGlint, 0.0, 1.0);
        vec3 col = uCol * (0.3 + 0.3 * sheen) * (1.0 - 0.3 * vein) + uSunCol * (0.04 + 1.1 * back * rim + 2.4 * sliver) * (0.6 + 0.4 * lead) * uGlint;
        col = mix(col, vec3(0.02, 0.02, 0.03), stigma * 0.85);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`})}const Y0=(e,v,S,x,W,z,k)=>(d,D)=>{const w=d*I,b=D*Math.PI,y=x*Math.sin(b)*Math.cos(w),p=W*Math.cos(b),A=z*Math.sin(b)*Math.sin(w);return[e+y,v+p,S+A,k(y/x,p/W,A/z),0]};function Ko(e,v,S,x){const W=new s.Group;W.name="ladybird";const z=new s.Color(.016,.014,.014),k=new s.Color(.8,.78,.7),d=u0(),D=x.clone().multiplyScalar(.8);h0(d,14,8,Y0(0,.17,-.08,.47,.2,.6,(A,C)=>C>.1?D:z),[0,0,6,0]),h0(d,14,8,Y0(0,.24,.42,.37,.27,.27,(A,C,_)=>Math.abs(A)>.42&&_>-.1&&C>-.1?k:z),[0,0,9,0]),h0(d,8,5,Y0(0,.2,.68,.2,.16,.15,(A,C,_)=>Math.abs(A)>.5&&C>.2&&_>0?k:z),[0,0,9,0]);for(const A of[-1,1])N0(d,[V(A*.08,.26,.78),V(A*.2,.34,.95),V(A*.36,.3,1.02)],4,()=>.018,()=>z,()=>0,[0,0,9,0]);W.add(new s.Mesh(f0(d),v));const w=V(0,.44,.24),b=[],y=[];for(const A of[-1,1]){const C=u0();h0(C,9,10,(Z,K)=>{const Q=Z*Math.PI*.5,B=Math.pow(Math.sin(Math.PI*(.1+.88*K)),.55),M0=A*(.012+.52*Math.sin(Q)*B),E=.1+.42*Math.cos(Q)*B-.2*Math.sin(Q),L=.3-1.02*K;return[M0,E-w.y,L-w.z,x,0]},[.1,0,6,0],[0,1]);const _=new s.Mesh(f0(C),v);_.position.copy(w),W.add(_),b.push(_);const j=[],P=[],T=[],N=[];for(let Z=0;Z<=5;Z++){const K=Z/5,Q=.34*Math.sin(Math.PI*(.08+.9*K))**.7;if(j.push(.05+1.5*K,0,Q*.5,.05+1.5*K,0,-Q),P.push(-1,K,1,K),T.push(0,0,0,0,0,0),Z>0){const B=(Z-1)*2;N.push(B,B+1,B+2,B+2,B+1,B+3)}}const F=new s.BufferGeometry;F.setAttribute("position",new s.Float32BufferAttribute(j,3)),F.setAttribute("uv",new s.Float32BufferAttribute(P,2)),F.setAttribute("aW",new s.Float32BufferAttribute(T,3)),F.setIndex(N);const q=new s.Mesh(F,e.ladyWingMat);q.position.set(A*.1,.4,.12),q.scale.set(A,1,1),q.visible=!1,W.add(q),y.push(q)}const p=[];for(let A=0;A<2;A++){const C=u0();for(let j=0;j<3;j++){const P=(j+A)%2?1:-1,T=.38-j*.36;N0(C,[V(P*.28,.12,T),V(P*.62,.26,T+(j-1)*-.08),V(P*.82,0,T+(j-1)*-.2),V(P*.9,-.02,T+(j-1)*-.26)],4,N=>o0(.04,.02,N),()=>z,()=>0,[0,0,9,0])}const _=new s.Mesh(f0(C),v);W.add(_),p.push(_)}return{group:W,cases:b,wings:y,tripods:p}}function Ro(e,v,S,x,W){const z=new s.Group;z.name="damselfly";const k=new s.Color(W),d=new s.Color(.012,.016,.03),D=k.clone().lerp(new s.Color(.75,.9,1),.55),w=k.clone().lerp(new s.Color(.02,.2,.12),.5).multiplyScalar(.7),b=u0(),y=[],p=10;for(let F=0;F<=p*3;F++){const q=F/(p*3);y.push(V(0,.1-.1*q-.42*q*q,-.42-3.75*q))}N0(b,y,7,F=>(.125-.04*F)*(1+.16*Math.pow(Math.abs(Math.sin(F*p*Math.PI)),6))*(F>.84?1.3:1),F=>{const q=F*p%1;return F>.84?F>.97?d:D:q<.2||q>.9?d:k},()=>0,[0,0,9,0]),h0(b,10,7,Y0(0,.12,.12,.31,.36,.66,(F,q)=>q>.25&&Math.abs(F)<.3||q>-.1&&Math.abs(F)>.55&&Math.abs(F)<.85?d:k),[0,0,9,0]),h0(b,8,4,Y0(0,.14,.78,.17,.15,.2,()=>d),[0,0,9,0]),h0(b,8,5,Y0(0,.18,1,.36,.17,.17,(F,q,Z)=>Z>.3&&q<.4?D:d),[0,0,9,0]);for(const F of[-1,1])h0(b,8,6,Y0(F*.4,.2,1.02,.2,.2,.2,(q,Z)=>Z>.1?w:k),[0,0,9,0]);for(const F of[-1,1])for(let q=0;q<3;q++)N0(b,[V(F*.16,-.14,.5-q*.22),V(F*.34,-.36,.68-q*.2),V(F*.2,-.5,.92-q*.16)],3,()=>.022,()=>d,()=>0,[0,0,9,0]);z.add(new s.Mesh(f0(b),v));const A=[],C=[],_=[],j=[],P=.44;for(const F of[-1,1])for(let q=0;q<2;q++){const Z=.36-q*.3,K=q?3:3.25,Q=q?.5:.2,B=q*1.9+(F>0?0:.15),M0=A.length/3,E=9;for(let L=0;L<=E;L++){const r0=L/E,nt=.03+.4*Math.pow(Math.sin(Math.PI*Math.min(1,.04+.9*Math.pow(r0,1.5))),.8)*(.25+.75*X(0,.3,r0)),d0=F*(.1+K*r0),Tt=Z-Q*K*r0;if(A.push(d0,P,Tt+nt*.45,d0,P,Tt-nt*.55),C.push(1,r0,-1,r0),_.push(F,B,P,F,B,P),L>0){const i0=M0+(L-1)*2;j.push(i0,i0+1,i0+2,i0+2,i0+1,i0+3)}}}const T=new s.BufferGeometry;T.setAttribute("position",new s.Float32BufferAttribute(A,3)),T.setAttribute("uv",new s.Float32BufferAttribute(C,2)),T.setAttribute("aW",new s.Float32BufferAttribute(_,3)),T.setIndex(j);const N=new s.Mesh(T,S);return N.frustumCulled=!1,N.renderOrder=2.5,z.add(N),{group:z}}function Qo(e){const v=new s.Group;v.name="snail";const S=new s.Color(.8,.48,.17),x=new s.Color(.92,.74,.36),W=new s.Color(.66,.6,.47),z=new s.Color(.38,.33,.25),k=new s.Color(.03,.03,.035),d=u0(),D=[];for(let P=0;P<=18;P++){const T=P/18,N=X(.72,1,T);D.push(V(.5*Math.sin(T*5),1.3+.5*Math.sin(T*Math.PI)+3.4*N*N,-12+27*T))}N0(d,D,10,P=>.3+2.6*Math.pow(Math.sin(Math.PI*Math.min(1,.03+.95*Math.pow(P,.8))),.6)*(1-.35*X(.72,1,P)),P=>V0(z,W,.25+.75*P),()=>0,[.3,0,10,0]);const w=V(.4,9.2,-2.5),b=76,y=14,p=.105,A=5.2*Math.PI,C=d.n;for(let P=0;P<=b;P++){const T=P/b*A,N=Math.exp(-p*T),F=5.3*N,q=3.9*N*(P===b?.05:1),Z=Math.cos(T-1.9),K=Math.sin(T-1.9),Q=w.x+6.2*(1-N),B=w.y+K*F,M0=w.z+Z*F,E=V0(S,x,.5+.5*Math.sin(T*.9));for(let L=0;L<=y;L++){const r0=L/y*I,nt=q*Math.cos(r0);S0(d,Q+q*Math.sin(r0),B+K*nt,M0+Z*nt,E,L/y,T/A,[.55,0,11,0])}}for(let P=0;P<b;P++)for(let T=0;T<y;T++){const N=C+P*(y+1)+T;Z0(d,N,N+y+1,N+1,N+y+2)}v.add(new s.Mesh(f0(d),e));const _=D[18],j=[];for(const[P,T,N]of[[-1,5.2,1],[1,5.2,1],[-1,1.8,0],[1,1.8,0]]){const F=u0();N0(F,[V(0,0,0),V(0,T*.5,T*.12),V(0,T,T*.16)],6,Z=>o0(.36,.2,Z),Z=>V0(W,z,Z*.6),()=>0,[.4,0,10,0]),h0(F,6,4,Y0(0,T+.15,T*.16,.42,.42,.42,()=>N?k:z),[0,0,9,0]);const q=new s.Mesh(f0(F),e);q.position.set(_.x+P*(N?.75:1),_.y+(N?.9:-.5),_.z+(N?-.6:.6)),q.userData={sx:P,up:N},v.add(q),j.push(q)}return{group:v,horns:j}}function c0(e,v,S,x=30){const W=new s.BufferGeometry;for(const p of Object.keys(e.attributes))W.setAttribute(p,e.attributes[p]);W.setIndex(e.index);const z=S.length,k=new Float32Array(z*4),d=new Float32Array(z*3),D=new s.InstancedMesh(W,v,Math.max(1,z)),w=new s.Box3,b=V();for(let p=0;p<z;p++){const A=S[p];D.setMatrixAt(p,A.m),k.set(A.v,p*4),d.set(A.c||[1,1,1],p*3),w.expandByPoint(b.setFromMatrixPosition(A.m))}D.count=z,W.setAttribute("iVar",new s.InstancedBufferAttribute(k,4)),W.setAttribute("iCol",new s.InstancedBufferAttribute(d,3));const y=new s.Sphere;return z&&w.getBoundingSphere(y),y.radius+=x,D.boundingSphere=y,W.boundingSphere=y.clone(),D.userData.sharedGeometry=!0,D}const oa=new s.Matrix4,Je=new s.Quaternion,Yt=new s.Euler,Lt=V(),Yo=V();function s0(e,v,S,x,W,z,k,d,D){return Yt.set(W,x,z,"YXZ"),Je.setFromEuler(Yt),new s.Matrix4().compose(Yo.set(e,v,S),Je,Lt.set(k,d??k,D??k))}const $o={first:{sun:"#ffb27e",horizon:"#ff9c76",scatter:"#ff7a5c",zenith:"#2a3a86",mid:"#b98fb4",fog:"#c98e8a",elev:[13.2,14],sunI:9,skyK:[.5,.62,1],amb:.44,shade:.3,mist:1,mistCol:"#f09aa0",fogD:.0031,dew:1.4,pollen:.35,exposure:1,sat:1.12,band:"#1e2c5c",bandLeaf:"#173a44",cloudLit:"#ffae96",cloudShade:"#56508c",cover:[.3,.5],shafts:.8,tint:"#ffeee6",shadow:"#080a1c",leaf:"#c6d4ae",veil:"#a8848c"},sunrise:{sun:"#ffe0aa",horizon:"#ffb984",scatter:"#ffc878",zenith:"#2e58a8",mid:"#f2bd80",fog:"#f6c896",elev:[14.8,16],sunI:10,skyK:[.8,.9,1],amb:.52,shade:.4,mist:1,mistCol:"#ffd27a",fogD:.0028,dew:1,pollen:.8,exposure:.95,sat:1.1,band:"#1c4a5c",bandLeaf:"#1a4c3a",cloudLit:"#ffd9b0",cloudShade:"#8a86b8",cover:[.18,.4],shafts:1,tint:"#fff6e6",shadow:"#06140a"},mist:{sun:"#fff0c4",horizon:"#ffe2ac",scatter:"#fff0b8",zenith:"#6a98cc",mid:"#f6e6c4",fog:"#f4e2b4",elev:[16.4,17.4],sunI:11,skyK:[.9,.95,1],amb:.6,shade:.5,mist:1.4,mistCol:"#ffe6a0",fogD:.0033,dew:.8,pollen:1.5,exposure:.78,sat:1.16,band:"#2e5866",bandLeaf:"#2c5a44",cloudLit:"#fff4dc",cloudShade:"#aab4cc",cover:[.1,.25],shafts:1.45,tint:"#fffaea",shadow:"#0a1a10"}};var aa={id:"dew-garden",name:"The Dew Garden",category:"domestic",weirdness:.15,media:["air","tiny"],async build(e){const{rng:v,noise:S}=e,x=new s.Scene,W=e.vary||{},z=v.fork("visit");let k=["sunrise","first","mist","sunrise"][Math.floor(z()*4)];W.hour==="dawn"||W.hour==="night"?k="first":W.hour==="golden"?k="sunrise":W.hour==="day"&&(k="mist");const d=$o[k],D=!!W.rare,w=Q0(W.density??1,.7,1.3),b=Q0(e.quality?.detail??1,.5,1),y={mirror:v.chance(.5)?-1:1,elev:v.range(d.elev[0],d.elev[1]),az:v.range(-2,2),mist:v.range(.8,1.2)*d.mist,wind:v.range(.7,1.35),windAng:v.range(0,I),toadstools:v.int(9,13),ringR:v.range(26,33),ringZ:v.range(84,104),tulips:v.pick([["#ff5a7a","#ffd9e2","#ff8a3c"],["#ffc83a","#ff5a7a","#fff3e0"],["#b65cff","#ff5a7a","#ffe6b8"],["#ff3d55","#ffb23a","#ff7aa0"]]),damsel:v.pick(["#1f6dff","#12b0d8","#3450ff"]),lady:v.pick(["#d81e12","#e8560c","#c4101c"]),dew:v.range(.85,1.2)*d.dew*w,clocks:v.int(5,8),daisies:Math.round(v.int(40,60)*w),clouds:v.range(d.cover[0],d.cover[1])},p=je.map(t=>new s.Color(t));p[0].set(d.sun);const A=je.slice();A[0]=d.sun;const C={blades:v.fork("blades"),dew:v.fork("dew"),flora:v.fork("flora"),fauna:v.fork("fauna"),fx:v.fork("fx"),floor:v.fork("floor")};await e.yield();const _=Ao({rng:v.fork("sky"),preset:"dawn",sunElevation:y.elev,sunAzimuth:y.az,zenith:d.zenith,mid:d.mid,horizon:d.horizon,ground:"#4a4a26",scatterColor:d.scatter,scatter:.45,scatterPow:3.2,scatterHigh:.05,scatterFall:3.6,horizonPow:3,midPow:2.1,sunColor:d.sun,sunSize:1.25,sunIntensity:d.sunI,sunGlow:.85,sunGlowTight:.4,stars:0,quality:.5,clouds:{coverage:y.clouds,lit:d.cloudLit,shade:d.cloudShade,silver:1.6,haze:.3,opacity:.8},clouds2:{lit:d.cloudLit,shade:d.cloudShade,opacity:.24,coverage:.45}});x.add(_.object),await e.yield();{const t=_.object.children.find(o=>o.name==="skyLower");if(t&&_.object.geometry?.attributes?.position?.count===17&&t.geometry?.attributes?.position?.count===17){const o=(i,a,r)=>{const m=[i,a,r],l=[];for(let c=0;c<16;c++){const f=c/16*I+.137;m.push(Math.cos(f),-.045,Math.sin(f)),l.push(0,1+c,1+(c+1)%16)}const u=new s.BufferGeometry;return u.setAttribute("position",new s.Float32BufferAttribute(m,3)),u.setIndex(l),u};_.object.geometry.dispose(),_.object.geometry=o(.043,1,.071),t.geometry.dispose(),t.geometry=o(-.037,-1,.059)}}const j=_.sunDirection.clone().normalize(),P=new s.Color(d.fog).multiplyScalar(.6);x.fog=new s.FogExp2(P,d.fogD),x.background=P.clone(),x.userData.visit={hour:k,rare:D,dens:w,mirror:y.mirror},await e.yield();const T=p[5].clone().lerp(new s.Color("#6fa8e8"),.6).multiplyScalar(.8),N=[new s.Color(d.horizon),new s.Color(d.mid).lerp(new s.Color(d.cloudShade),.55),new s.Color(d.cloudShade).lerp(new s.Color(d.zenith),.4)],F={uTime:{value:0},uWindV:{value:V(Math.cos(y.windAng),Math.sin(y.windAng),y.wind)},uSunDir:{value:j},uSunCol:{value:p[0].clone().multiplyScalar(1.05)},uLeafSun:{value:new s.Color(d.leaf||d.sun).multiplyScalar(1.05)},uSkyCol:{value:T.clone().lerp(p[0],.35).multiply(new s.Color(...d.skyK)).multiplyScalar(d.amb)},uGroundCol:{value:p[3].clone().multiplyScalar(.32)},uShade:{value:new s.Vector2(d.shade,7.5)},uMist:{value:V(.7*y.mist,.012,9)},uMistCol:{value:d.veil?new s.Color(d.veil):new s.Color(d.sun).lerp(new s.Color(d.mistCol),.45).multiplyScalar(.66)},uViewH:{value:1080},uDewGain:{value:1},uBokeh:{value:1},uDewCol:{value:p[5].clone()},uSkyHor:{value:N[0]},uSkyMid:{value:N[1]},uSkyZen:{value:N[2]},uCloudLit:{value:new s.Color(d.cloudLit)},uGrassA:{value:p[1].clone().multiplyScalar(.95)},uGrassB:{value:p[3].clone().multiplyScalar(.8)},uSoil:{value:p[4].clone().multiplyScalar(.5)},uBandCol:{value:new s.Color(d.band).lerp(new s.Color(d.bandLeaf),.4).multiplyScalar(.9)},uStool:{value:new s.Vector4(0,0,-1,0)}},q=F.uWindV.value,Z=Po(F);await e.yield(),F.ladyWingMat=$e(F,"#d8c8a0",[0,0,0],[1.2,2.5]);const K=34,Q=1.3,B=y.mirror,M0=()=>v.range(-1.5,1.5),E=Co([[40*B,5.6,420],[37.5*B,8.6,394],[29*B,7.4,358],[17*B,6,328],[(1+M0())*B,5.6,304],[(-15+M0())*B,5.6,280],[-22*B,6.2,252],[-17*B,7.5,226],[-6.5*B,9,204],[-2.6*B,11.2,186],[-4.8*B,12.6,165],[-6.5*B,12,142],[-3.6*B,12.6,120],[1.8*B,13.8,100],[6.2*B,16,82],[3.4*B,19,66],[0,22.4,52],[0,25.9,37],[0,29.4,22],[0,K,0]]),L=V(),r0=V(),nt=V(),d0=t=>{const o=E.pointAt(t,V()),i=E.tangentAt(t,V());return{p:o,t:i,n:V(i.z,0,-i.x).normalize()}};await e.yield();const Tt=177,i0={x:-21*B,z:139,s:1.55},W0={x:-14.6*B,y:15.4,z:110,R:6.6,yaw:.87*B},q0={x:21.5*B,z:73},ut=V(Math.cos(W0.yaw),0,-Math.sin(W0.yaw)),ve=V(W0.x,W0.y,W0.z),O0=[-1,1].map(t=>({x:W0.x+ut.x*t*8.3,z:W0.z+ut.z*t*8.3,sg:t})),Bt=(t,o)=>{const i=46+6*S.n2(o*.03,5.1)-32*X(148,184,o);return Math.min(i-Math.abs(t),o+14,184-o)},to=(t,o)=>(1.6*S.fbm2(t*.012,o*.012,3)+.45*S.n2(t*.08,o*.08)-.5)*o0(1,.35,X(-12,6,Bt(t,o))),$t=(t,o,i)=>Math.min(to(t,o),i.y-4.3-3.5*(1-X(.03,.1,i.u))+Math.max(0,i.dist-9)*.3),a0=(t,o)=>$t(t,o,E.nearestXZ(t,o));{const i=new Float32Array(35148),a=new Uint32Array(11500*6);await e.yield();for(let l=0,u=0;l<=115;l++){for(let c=0;c<=100;c++,u+=3){const f=c*8-400,g=l*8-460+130;i[u]=f,i[u+1]=a0(f,g),i[u+2]=g}await e.yield()}for(let l=0,u=0;l<115;l++)for(let c=0;c<100;c++,u+=6){const f=c+101*l,g=f+100+1;a[u]=f,a[u+1]=g,a[u+2]=f+1,a[u+3]=g,a[u+4]=g+1,a[u+5]=f+1}const r=new s.BufferGeometry;r.setAttribute("position",new s.BufferAttribute(i,3)),r.setIndex(new s.BufferAttribute(a,1)),await e.yield(),await Wo(r,()=>e.yield()),await e.yield();const n=new s.Mesh(r,Oo(F,p));n.name="soil",n.renderOrder=.5,x.add(n);const m=new s.Mesh(new s.PlaneGeometry(4200,4200).rotateX(-Math.PI/2),n.material);m.position.set(0,-3.2,-300),m.name="soil",m.renderOrder=.6,x.add(m)}await e.yield();const k0=(t,o)=>(t*q.x+o*q.y)*.045,z0=(t,o,i,a=0)=>{const r=t.H*(1-.2*t.bend*t.bend);let n=o*r,m=t.bend*t.H*o*o;if(a){const g=r,h=2*t.bend*t.H*o,M=Math.hypot(g,h);n+=h/M*a,m-=g/M*a}const l=Math.cos(t.lean),u=Math.sin(t.lean),c=n*l-m*u,f=n*u+m*l;return i.set(t.x+f*Math.sin(t.rot),t.y+c,t.z+f*Math.cos(t.rot))};for(const t of O0)Object.assign(t,{y:a0(t.x,t.z)-.3,rot:Math.atan2(ut.x*t.sg,ut.z*t.sg)+.5*t.sg*B,lean:0,H:t.sg>0?28:33,W:2,bend:.17,amp:.3,sp:k0(t.x,t.z),rp:0,tint:1.06,warm:.5,lod:0,giant:!0,d:E.nearestXZ(t.x,t.z).dist});const ge=t=>[t.x/Q,(t.y+.9)/Q,t.z/Q],ye=[];for(const t of O0)for(const o of[.36,.76])ye.push(ge(z0(t,o,V())));const E0=await Do(e,{palette:A,hubHeight:(K+.9)/Q,scale:Q,sunDir:j.toArray(),sunColor:d.sun,sky:[N[0].getHex(),N[2].getHex()],miniWeb:{c:ge(ve),ex:ut.toArray(),R:W0.R/Q,moor:ye,detail:b},wild:{x:q0.x/Q,z:q0.z/Q,rot:0,H:32,lean:B}});E0.object.position.set(0,-.9,0),E0.object.updateMatrixWorld(!0),x.add(E0.object);const xe=V(0,K,0),Jt=[],te=[],we=t=>e.core.makeRng(e.core.hashSeed(t+":"+e.seed)),L0={};for(const t of["blade-grid","giants","blade-dew","ring","young","clover","daisies","clocks","moss","litter"])L0[t]=we("dew-garden-loop-"+t);const J={};for(const t of["elder","tufts","mini","flies"])J[t]=we("dew-garden-new-"+t);for(const t of O0)t.rp=J.mini()*I;await e.yield();const ft=d0(.208),ht=d0(.365),dt=d0(.47),Gt=3,ee=2.1,T0=ft.p.clone().addScaledVector(ft.n,-6.7*B).add(V(0,2.6,0)),y0=ft.p.clone().addScaledVector(ft.n,-13.9*B).addScaledVector(ft.t,-2.5);y0.y=a0(y0.x,y0.z)-.3;const st=T0.clone().add(V(0,Gt*.86,0)),P0={reach:Math.hypot(st.x-y0.x,st.z-y0.z),rot:Math.atan2(st.x-y0.x,st.z-y0.z),tipY:st.y-y0.y,sp:k0(y0.x,y0.z),rp:C.blades()*I,amp:.2},pt=d0(.125),l0=pt.p.clone().addScaledVector(pt.n,10.5*B),$0=pt.p.clone().addScaledVector(pt.n,-8*B);l0.y=a0(l0.x,l0.z)-.3,$0.y=pt.p.y+3.4;const p0={reach:Math.hypot($0.x-l0.x,$0.z-l0.z),rot:Math.atan2($0.x-l0.x,$0.z-l0.z),tipY:$0.y-l0.y,sp:k0(l0.x,l0.z),rp:1.7,amp:.16},B0=t=>E.nearestXZ(t.x,t.z).u*E.length,oe=(t,o,i,a,r,n,m,l,u,c=C.blades)=>({x:t,z:o,y:a0(t,o)-.3,rot:i,lean:a,H:r,W:n,bend:m,amp:l,sp:k0(t,o),rp:c()*I,tint:u}),mt=ht.p.clone().addScaledVector(ht.n,-7.5*B),ae=Math.atan2(ht.t.x,ht.t.z)+.5*B,x0=oe(mt.x-Math.sin(ae)*1,mt.z-Math.cos(ae)*1,ae,0,16.5,2.9,.3,.2,1.08),C0=V(dt.p.x+dt.n.x*9*B,0,dt.p.z+dt.n.z*9*B),_t=dt.p.y+5.5,n0={x:-37*B,z:48,r:17,ry:1.33*B,s:1.3},vt=[[y0.x,y0.z,3.2],[l0.x,l0.z,3.2],[x0.x,x0.z,4.2],[C0.x,C0.z,5]];D&&vt.push([n0.x,n0.z,n0.r]);const gt=d0(.285),X0={x:gt.p.x-gt.n.x*8.5*B,z:gt.p.z-gt.n.z*8.5*B,s:1.3};vt.push([X0.x,X0.z,8.5]);{const t=V(X0.x-T0.x,5.95*X0.s-T0.y,X0.z-T0.z).normalize();F.uStool.value.set(t.x,t.y,t.z,1)}vt.push([i0.x,i0.z,8.5],[q0.x,q0.z,7],[O0[0].x,O0[0].z,2.6],[O0[1].x,O0[1].z,2.6]);const Nt=(t,o)=>Math.hypot(t-i0.x,o-i0.z)<13||Math.hypot(t-W0.x,o-W0.z)<13||Math.hypot(t-q0.x,o-q0.z)<13,ne=[],be=(t,o,i,a,r=0)=>{const n=Math.max(0,t),m=Math.max(n,o),l=Math.max(1,Math.ceil((m-n)/2.5));for(let u=0;u<=l;u++){const c=E.posAtDist(n+(m-n)*u/l,V()),f=i.x-c.x,g=i.z-c.z,h=Math.hypot(f,g);ne.push({x:c.x,z:c.z,y:c.y,dx:f/h,dz:g/h,len:h,slope:(i.y-c.y)/h,r:a,beyond:r})}},qt=(t,o,i,a,r=0)=>be(t*E.length,o*E.length,i,a,r);qt(.07,.208,T0,Gt+1,0),be(B0($0),B0(T0),T0,Gt+1,22),qt(.27,.36,V(mt.x,ht.p.y,mt.z),2.8,0),qt(.38,.47,V(C0.x,_t,C0.z),1.55*ee+1.2,16),qt(.45,.64,V(0,K-4,0),26,0);const yt=(t,o,i)=>{let a=1e9;for(const r of ne){const n=t-r.x,m=o-r.z,l=n*r.dx+m*r.dz;if(l<2||l>r.len+r.beyond)continue;const u=o0(1.4,r.r,Math.min(1,l/r.len))+i;Math.abs(n*r.dz-m*r.dx)<u&&(a=Math.min(a,r.y+r.slope*l-u))}return a},xt=[x0,...O0],Me=[],ze=[.24,.34],rt=[.2,.55];{const o=L0["blade-grid"];let i=0;for(let f=-150;f<472;f+=1.7){await e.yield(),i++;for(let g=-178;g<198;g+=1.7){const h=g+o()*1.7,M=f+o()*1.7,G=E.nearestXZ(h,M),U=G.dist,H=Bt(h,M),t0=S.n2(h*.045,M*.045),e0=S.n2(h*.16+9,M*.16),Y=7.2+2.6*X(rt[0],rt[0]+.06,G.u)*(1-X(rt[1]-.05,rt[1],G.u))*(.6+.4*e0);let O,$=1,w0=1,v0=!1,g0=0;if(H>0){if(H<2.5||Math.abs(M)<4&&Math.abs(h)<27*Q)continue;O=.17*(.5+.8*X(-.5,.5,t0)),$=.24,v0=!0}else if(U<Y)O=.55,v0=!0;else{const U0=Math.abs(h)<125&&M>-70&&M<205;if(O=U<24?.85:U<60?.3*w:(U0?.105:.042)*w*b,U>60&&($=1.25,w0=1.8),M>10&&M<200&&H>-34){const ct=X(192,166,M),he=Q0(-H/34,0,1);$*=o0(o0(1.7,1,he),o0(2.7,1.25,he),ct),U>24&&(O=Math.max(O,o0(.5,.12,he)*ct)),w0*=1+.25*ct}if(M>180&&M<250&&U<30&&($*=1+.5*X(250,205,M),U<22&&(O*=.6)),M<-6&&Math.abs(h)<150?(g0=1,$*=o0(.5,.78,X(-20,-130,M)),w0=1.5,O=.62*b*(.6+.5*X(-.6,.3,t0))):G.u>rt[0]&&G.u<rt[1]&&U<30?(O*=.16+.95*X(-.25,.3,t0),$*=.72+.4*X(-.3,.5,t0)):O*=.6+.6*X(-.5,.4,S.n2(h*.035,M*.035)),G.u<.07&&U<26&&($*=1.3),G.u>.47&&G.u<.6&&U<17&&H<-3&&(O*=.36),G.u>.455&&G.u<.62&&U<26&&H<=0&&(E.tangentAt(G.u,r0),E.pointAt(G.u,L),((h-L.x)*r0.z-(M-L.z)*r0.x)*B<0)){const ct=X(.455,.49,G.u);O*=1-.9*ct,$*=1-.5*ct}}if(o()>O||Math.hypot(h-27.5*Q,M)<15||Math.hypot(h+27.5*Q,M)<15)continue;let F0=!1;for(const U0 of vt)Math.hypot(h-U0[0],M-U0[1])<U0[2]&&(F0=!0);if(F0)continue;const Vt=$t(h,M,G)-.3;let b0=(U<26?o.range(10,18):o.range(8,15))*$,fe=o.range(.05,.42),Et=o()*I;if(H<=0&&U<Y){if(b0=Math.min(o.range(.9,2.3)+2.2*X(7.2,Y,U),G.y-Vt-2.7),b0<.7)continue;fe=o.range(.1,.5)}if(H<=0&&U<40&&ne.length){const U0=yt(h,M,1.1+.07*b0);if(Vt+b0>U0){if(b0=U0-Vt,b0<1.6)continue;v0=v0||b0<5}}const So=v0?(.3+.07*b0)*o.range(.8,1.3)*(g0?1.5:1):(.5+.04*b0)*o.range(.85,1.3)*w0;!v0&&U<18&&(E.pointAt(G.u,L),Math.sin(Et)*(L.x-h)+Math.cos(Et)*(L.z-M)>0&&(b0*.9+Vt-G.y<8.5||U-fe*b0<4.5)&&(Et+=Math.PI));const ko=(H>0||g0||U>44)&&b0<23?2:(v0||U>15.5)&&b0<26?1:0;xt.push({x:h,z:M,y:Vt,rot:Et,lean:o.range(-.1,.1),H:b0,W:So,bend:fe,amp:b0*o.range(.035,.07),sp:k0(h,M),rp:o()*I,tint:o.range(.82,1.15)*(g0?o0(.32,.95,X(.05,.4,S.n2(h*.055+M*.004,M*.011+7)))*o0(.5,1,Math.max(X(26,58,Math.abs(h)),X(-44,-66,M))):1),d:U,u:G.u,warm:o(),lod:ko,zone:g0})}}const a=L0.giants;for(let f=0;f<9;f++){const g=153-f*12.5+a.range(-3,3),h=(f%2?1:-1)*B,M=a.range(31,40),G=a.range(.28,.46);let U=Math.max(10.5,5+27*(165-g)/165)+a.range(0,2.5),H=null;const t0=Math.atan2(h*a.range(.25,.9),a.range(.5,1));for(let Y=0;Y<12;Y++,U+=1){H=oe(h*U,g,t0,a.range(-.06,.06),M,(.5+.04*M)*a.range(1.05,1.3),G,M*.045,a.range(.95,1.15),a);let O=!0;for(let $=.3;$<=1.001;$+=.05)z0(H,$,L),E.distanceTo(L.x,L.y,L.z)<8.5+H.amp*$*$&&(O=!1);if(O)break}const e0=D&&Math.hypot(H.x-n0.x,H.z-n0.z)<n0.r+3||Nt(H.x,H.z);H.warm=a(),H.lod=0,H.giant=!0,e0||(xt.push(H),Me.push(H));for(let Y=0;Y<2;Y++){const O=a()*I,$=a.range(1.5,4),w0=oe(H.x+Math.cos(O)*$+h*2,H.z+Math.sin(O)*$,a()*I,a.range(-.1,.1),M*a.range(.35,.6),1.5,a.range(.2,.45),1,a.range(.85,1.1),a);let v0=!e0;for(let g0=.3;g0<=1.001;g0+=.1)z0(w0,g0,L),E.distanceTo(L.x,L.y,L.z)<9.5&&(v0=!1);v0&&(w0.warm=a(),w0.lod=0,xt.push(w0))}}await e.yield();const r=[Kt(p),Kt(p,[0,.3,.65,1]),Kt(p,[0,.34,.7,1],!0)],n=new Map;await e.yield();const m=xt.slice().sort((f,g)=>g.z-f.z);await e.yield();let l=0;for(const f of m){++l%250===0&&await e.yield();const g=f.H*(1-.2*f.bend*f.bend),h=f.tint,M=f.warm??.5,G={m:s0(f.x,f.y,f.z,f.rot,f.lean,0,f.W,g,f.W),v:[f.sp,f.rp,f.amp,f.bend*f.H/f.W],c:f.zone&&h<.6?[h*.8,h,h*1.12]:[h*(.92+.2*M),h,h*(1-.25*M)]},U=((f.zone?0:1+Math.floor((f.z+150)/78))*2+(f.x<0?0:1))*3+(f.lod??0);n.has(U)||n.set(U,[]),n.get(U).push(G)}await e.yield();for(const f of[...n.keys()].sort((g,h)=>h-g)){const g=f%3,h=c0(r[g],Z,n.get(f),32);h.name=["blades","blades-mid","blades-far"][g],h.renderOrder=-.2,x.add(h),f<6&&te.push(h),await e.yield()}const u=c0(Ke(p,P0.reach,P0.tipY,1.9),Z,[{m:s0(y0.x,y0.y,y0.z,P0.rot,0,0,1),v:[P0.sp,P0.rp,P0.amp,0],c:[1.06,1.1,.9]}],20);u.name="drop-blade",x.add(u),await e.yield();const c=c0(Ke(p,p0.reach,p0.tipY,1.7),Z,[{m:s0(l0.x,l0.y,l0.z,p0.rot,0,0,1),v:[p0.sp,p0.rp,p0.amp,0],c:[1,1.08,.9]}],20);c.name="necklace-blade",x.add(c),await e.yield()}await e.yield();const J0={pos:[],sw:[],dat:[]};let A0=C.dew;const m0=(t,o,i,a,r,n,m=0,l=A0)=>{J0.pos.push(t.x,t.y,t.z,o),J0.sw.push(i,a,r,n),J0.dat.push(l(),m,m?l.range(5,11):0,l())};A0=L0["blade-dew"];for(const t of xt){if(t===x0||t.sg)continue;const o=A0;if(t.zone){if(o()<.15*Math.min(1.2,y.dew)){const r=o.range(.22,.5);z0(t,1,L),L.y-=r*.5,m0(L,r,t.sp,t.rp,t.amp,1)}continue}if(!(t.d<34))continue;const i=t.d<16?1:.55;if(o()<.42*i*y.dew){const r=o.range(.14,.42)*(o()<.12?1.7:1);z0(t,1,L),L.y-=r*.85,E.distanceTo(L.x,L.y,L.z)>6+r&&m0(L,r,t.sp,t.rp,t.amp,1,o()<.2?1:0)}const a=o()<.5*i*y.dew?o.int(1,3):0;for(let r=0;r<a;r++){const n=o.range(.35,.95),m=o.range(.08,.26);z0(t,n,L,m*.8+.1),E.distanceTo(L.x,L.y,L.z)>6&&m0(L,m,t.sp,t.rp,t.amp,n)}}for(const t of Me){const o=A0,i=o.range(.35,.6);z0(t,1,L),L.y-=i*.85,m0(L,i,t.sp,t.rp,t.amp,1,o()<.4?1:0);for(let a=0;a<6;a++){const r=o.range(.45,.97),n=o.range(.14,.4);z0(t,r,L,n*.8+.1),m0(L,n,t.sp,t.rp,t.amp,r)}}A0=C.dew,await e.yield();const R=C.flora,K0=[],Ht=[];{const t=[],o=L0.ring;A0=o;for(let a=0;a<y.toadstools;a++){const r=Math.PI/2+((a+.5)/y.toadstools-.5)*(I-1.9)+o.range(-.12,.12),n=y.ringR*o.range(.92,1.08),m=o.range(.75,1.25),l=Math.cos(r)*n,u=y.ringZ+Math.sin(r)*n*1.15;let c=l;{const g=E.nearestXZ(l,u),h=4.8*m+8.2;g.dist<h&&(E.pointAt(g.u,L),c=L.x+(l<L.x?-h:h))}if(Nt(c,u))continue;const f=a0(c,u)-.25;Ht.push({x:c,y:f,z:u,s:m}),t.push({m:s0(c,f,u,o()*I,o.range(-.08,.08),o.range(-.08,.08),m),v:[0,0,0,0]});for(let g=0;g<3;g++){const h=o.range(.4,3.3)*m,M=o()*I,G=o.range(.25,.55);L.set(c+Math.cos(M)*h,f+(9.05*m-.085*h*h/m)+G*.7,u+Math.sin(M)*h),m0(L,G,0,0,0,0)}for(let g=0;g<2;g++){const h=o()*I,M=o.range(2.5,6)*m,G=o.range(1.6,3.6);K0.push({m:s0(c+Math.cos(h)*M,a0(c+Math.cos(h)*M,u+Math.sin(h)*M)-.1,u+Math.sin(h)*M,o()*I,0,0,G,G*o.range(.7,1.1),G),v:[0,0,0,0],c:[o.range(.85,1.2),1,.9]})}}A0=C.dew;{const{x:a,z:r,s:n}=i0,m=a0(a,r)-.3,l=a<0?-1:1;Ht.push({x:a,y:m,z:r,s:n}),t.push({m:s0(a,m,r,J.elder()*I,.04,.05*l,n),v:[0,0,0,0]});for(let g=0;g<9;g++){const h=J.elder.range(.4,4.1)*n,M=J.elder()*I,G=J.elder.range(.32,.7);L.set(a+Math.cos(M)*h,m+(9.05*n-.085*h*h/n)+G*.7,r+Math.sin(M)*h),m0(L,G,0,0,0,0,0,J.elder)}for(let g=0;g<5;g++){const h=g/5*I+J.elder.range(-.3,.3),M=J.elder.range(.3,.55);L.set(a+Math.cos(h)*4.66*n,m+5.95*n-M*.8,r+Math.sin(h)*4.66*n),m0(L,M,0,0,0,0,g<2?1:0,J.elder)}const u=a+l*7.5,c=r-12,f=.92;Ht.push({x:u,y:a0(u,c)-.25,z:c,s:f}),t.push({m:s0(u,a0(u,c)-.25,c,J.elder()*I,-.06,.05,f),v:[0,0,0,0]});for(let g=0;g<3;g++){const h=J.elder.range(-1.2,1.2)+(l>0?Math.PI:0),M=J.elder.range(8.2,10.5),G=J.elder.range(.3,.5),U=a+Math.cos(h)*M,H=r+Math.sin(h)*M;t.push({m:s0(U,a0(U,H)-.2,H,J.elder()*I,.06,.06,G),v:[0,0,0,0]})}for(let g=0;g<5;g++){const h=J.elder()*I,M=J.elder.range(3,9.5),G=J.elder.range(1.8,3.8),U=a+Math.cos(h)*M,H=r+Math.sin(h)*M;K0.push({m:s0(U,a0(U,H)-.1,H,J.elder()*I,0,0,G,G*J.elder.range(.45,.75),G),v:[0,0,0,0],c:[J.elder.range(.85,1.2),1,.9]})}}{const{x:a,z:r,s:n}=X0,m=a0(a,r)-.3;t.push({m:s0(a,m,r,R()*I,.05,-.04,n),v:[0,0,0,0]});for(let l=0;l<5;l++){const u=R.range(.4,3.6)*n,c=R()*I,f=R.range(.3,.6);L.set(a+Math.cos(c)*u,m+(9.05*n-.085*u*u/n)+f*.7,r+Math.sin(c)*u),m0(L,f,0,0,0,0)}for(let l=0;l<2;l++){const u=R()*I,c=R.range(3.4,5.2),f=R.range(.3,.45),g=a+Math.cos(u)*c,h=r+Math.sin(u)*c;t.push({m:s0(g,a0(g,h)-.2,h,R()*I,.06,.06,f),v:[0,0,0,0]})}for(let l=0;l<4;l++){const u=R()*I,c=R.range(2.5,7),f=R.range(1.6,3.4),g=a+Math.cos(u)*c,h=r+Math.sin(u)*c;K0.push({m:s0(g,a0(g,h)-.1,h,R()*I,0,0,f,f*R.range(.45,.7),f),v:[0,0,0,0],c:[R.range(.85,1.2),1,.9]})}}for(let a=0;a<4;a++){const r=L0.young,n=r.range(-36,36),m=r.range(24,170),l=r.range(.35,.55);Math.abs(Math.hypot(n,(m-y.ringZ)/1.15)-y.ringR)<8||Nt(n,m)||t.push({m:s0(n,a0(n,m)-.2,m,r()*I,.05,.05,l),v:[0,0,0,0]})}const i=c0(_o(p),Z,t,14);i.name="toadstools",x.add(i)}const wt=11.8,bt=4;await e.yield();{const t=[],o=[],i=L0.clover;A0=i;const a=(u,c,f,g,h,M)=>{const G=E.nearestXZ(u,c);if(G.dist<M)return!1;const U=$t(u,c,G)-.2,H=u+bt*g*Math.cos(f),t0=c-bt*g*Math.sin(f),e0=U+wt*g,Y=E.nearestXZ(H,t0),O=e0-Y.y;if(O<6.4&&Math.hypot(Math.max(0,Y.dist-2.9*g),O)<6.6||e0+.8>yt(H,t0,3*g)||e0>yt(u,c,1))return!1;for(const F0 of vt)if(Math.hypot(u-F0[0],c-F0[1])<F0[2]-1)return!1;const $=k0(u,c),w0=i()*I,v0=.55*g,g0=i.range(.85,1.15);if(h.push({m:s0(u,U,c,f,0,0,g),v:[$,w0,v0,0],c:[g0,g0,g0*i.range(.85,1.05)]}),i()<.36*y.dew&&g>.5){const F0=i.range(.25,.55)*Math.min(1,g);L.set(H,e0+F0*.55,t0),m0(L,F0,$,w0,v0,1)}return!0};for(let u=0;u<170;u++){const c=d0(i.range(ze[0]-.005,ze[1]+.005)),f=i.sign(),g=7.5+15*i()*i();a(c.p.x+c.n.x*g*f,c.p.z+c.n.z*g*f,Math.atan2(c.n.z*f,-c.n.x*f)+i.range(-.5,.5),i.range(.96,1.2),t,7.5)}for(let u=0;u<120;u++){const c=i()<.6?i.range(.03,.26):i.range(.4,.56),f=d0(c),g=i.sign(),h=i.range(8,34);a(f.p.x+f.n.x*h*g,f.p.z+f.n.z*h*g,i()*I,i.range(.55,.95),t,8)}for(let u=0;u<15;u++){const c=i.range(-40,40),f=i.range(20,172),g=i.int(12,22);for(let h=0;h<g;h++){const M=c+i.gauss()*7,G=f+i.gauss()*7;if(Bt(M,G)<2||G<12)continue;let U=!1;for(const H of Ht)Math.hypot(M-H.x,G-H.z)<5.5*H.s&&(U=!0);U||a(M,G,i()*I,i.range(.32,.6),o,0)}}A0=C.dew,await e.yield();const r=me(p,i,wt,bt,2.7),n=me(p,i,wt,bt,2.7,!0);await e.yield();const m=c0(r,Z,t,16),l=c0(n,Z,o,12);m.name="clover-roof",l.name="clover-floor",x.add(m,l),Jt.push({m,c:t.map(u=>V().setFromMatrixPosition(u.m)),r:18})}await e.yield();const It=t=>46+6*S.n2(t*.03,5.1)-32*X(148,184,t);{const t=To(p,R,16),o=t.userData.top,i=[],a=L0.daisies;A0=a;for(let n=0;n<y.daisies*3&&i.length<y.daisies;n++){let m,l,u;if(a()<.68)l=a.range(18,176),m=a.sign()*(It(l)-a.range(2,16)),u=a.range(.85,1.5);else{const M=d0(a.range(.03,.6)),G=a.range(9.5,32)*a.sign();m=M.p.x+M.n.x*G,l=M.p.z+M.n.z*G,u=a.range(.6,1)}const c=a()*I,f=a0(m,l)-.2;if(L.set(o.x,o.y,o.z).multiplyScalar(u).applyAxisAngle(V(0,1,0),c).add(r0.set(m,f,l)),E.distanceTo(L.x,L.y,L.z)<9.5||E.nearestXZ(m,l).dist<7.5||L.y+2>yt(L.x,L.z,2.5)||D&&Math.hypot(m-n0.x,l-n0.z)<n0.r||L.y>10&&Math.abs(L.x)<30&&l<182)continue;const g=k0(m,l),h=a()*I;i.push({m:s0(m,f,l,c,0,0,u),v:[g,h,.9*u,0]}),a()<.3&&(L.y+=.5*u,m0(L,a.range(.2,.4),g,h,.9*u,1))}for(const[n,m,l]of[[146,1,0],[122,1,3],[91,-1,14]]){const u=a.range(1.05,1.25),c=a()*I;for(let f=Math.max(12,6+27*(165-n)/165)+l,g=0;g<12;g++,f+=1){const h=m*B*f,M=n+a.range(-3,3),G=a0(h,M)-.2;if(L.set(o.x,o.y,o.z).multiplyScalar(u).applyAxisAngle(V(0,1,0),c).add(r0.set(h,G,M)),E.distanceTo(L.x,L.y,L.z)<11.5+2.4*u||Nt(h,M))continue;const U=k0(h,M),H=a()*I;i.push({m:s0(h,G,M,c,0,0,u),v:[U,H,.8*u,0]}),L.y+=.5*u,m0(L,.5,U,H,.8*u,1);break}}A0=C.dew;const r=c0(t,Z,i,30);r.name="daisies",x.add(r),await e.yield()}const eo=Io(F),oo=Go();await e.yield();const Mt=[];for(let t=0;t<100;t++){const o=1-2*(t+.5)/100,i=Math.sqrt(1-o*o),a=t*2.39996;Mt.push(V(Math.cos(a)*i,o,Math.sin(a)*i))}const se=V(0,1,0),tt={c:V(),sp:0,rp:0,amp:0,hs:1},et=[];let ao=0;{const t=[],o=[],i=[];o.cen=[],i.cen=[];const a=(m,l,u,c,f,g=i,h=C.flora)=>{const M=a0(m,l)-.3,G=c?1.7:.9,U=s0(m,M,l,h()*I,h.range(-.05,.05),h.range(-.05,.05),G,u,G),H=V(0,1,0).applyMatrix4(U),t0=k0(m,l),e0=h()*I,Y=c?.45:u*.055;t.push({m:U,v:[t0,e0,Y,0]}),K0.push({m:s0(H.x,H.y-.1*f,H.z,0,0,0,.6*f),v:[t0,e0,Y,0],c:[2.2,1.7,1.2]}),c&&Object.assign(tt,{c:H,sp:t0,rp:e0,amp:Y,hs:f}),g.cen.push(H);for(let O=0;O<Mt.length;O++){const $=new s.Quaternion().setFromUnitVectors(se,Mt[O]);if(c&&Mt[O].y>-.6&&h()<.5&&ao++%3===0){et.push({q:$,d:Mt[O]});continue}g.push({m:new s.Matrix4().compose(H,$,Lt.set(f,f,f)),v:[t0,e0,Y,1]})}if(c)for(let O=0;O<48;O++){const $=1-(O+.5)/48*1.4,w0=Math.sqrt(1-$*$),v0=O*2.39996+1.3,g0=V(Math.cos(v0)*w0,$,Math.sin(v0)*w0),F0=new s.Quaternion().setFromUnitVectors(se,g0);O%5===0?et.push({q:F0,d:g0}):O%3===1&&g.push({m:new s.Matrix4().compose(H,F0,Lt.set(f,f,f)),v:[t0,e0,Y,1]})}return H};a(C0.x,C0.z,_t-a0(C0.x,C0.z)+.3,!0,ee,o);const r=L0.clocks;for(let m=0,l=0;m<60&&l<y.clocks;m++){let u,c,f;if(l<y.clocks-2)c=r.range(24,172),u=r.sign()*(It(c)-r.range(4,20)),f=r.range(19,31);else{const g=d0(r.range(.04,.3)),h=r.range(13,30)*r.sign();u=g.p.x+g.n.x*h,c=g.p.z+g.n.z*h,f=r.range(15,21)}E.distanceTo(u,f,c)<12||Math.hypot(u-27.5,c)<16||Math.hypot(u+27.5,c)<16||f+2>yt(u,c,2.5)||D&&Math.hypot(u-n0.x,c-n0.z)<n0.r+2||(a(u,c,f,!1,r.range(.95,1.3),l<y.clocks-2?i:o,r),l++)}const n=c0(Bo(p),Z,t,34);n.name="dandelion-stems",x.add(n),await e.yield();for(const m of[o,i])if(m.length){const l=c0(oo,eo,m,6);l.name="dandelion-clocks",l.renderOrder=3,x.add(l),Jt.push({m:l,c:m.cen,r:8})}}const G0=c0(Uo(),jo(F),et.map(()=>({m:new s.Matrix4,v:[0,0,0,1]})),1e5);G0.name="flying-seeds",G0.frustumCulled=!1,G0.renderOrder=3,G0.instanceMatrix.setUsage(s.DynamicDrawUsage);const re=G0.geometry.attributes.iVar;re.setUsage(s.DynamicDrawUsage),x.add(G0);const zt=_t-a0(C0.x,C0.z),no=B0(mt),so=B0(C0)-zt;et.forEach((t,o)=>{const i=.5-.5*(t.d.x*q.x+t.d.z*q.y),a=(o*.618034+.11)%1,r=(o*.754878+.47)%1,n=(o*.56984+.3)%1;t.mR=o0(no,so,Q0(.6*i+.4*J.tufts(),0,1)),t.lead=o0(2,5,r*r*.5+r*.5)*zt,t.lat=o0(-1,1,a)*(3+.6*t.lead)+J.tufts.range(-1.5,1.5),t.up=o0(-1,11,n)+J.tufts.range(-1,1),t.drift=J.tufts.range(-.02,.02),t.ph=J.tufts()*I,t.spin=J.tufts.range(-.35,.35),t.tx=J.tufts.range(-.45,.45),t.tz=J.tufts.range(-.45,.45),t.life=J.tufts.range(6,8.5)*zt}),await e.yield();const Se=[];{const t=(r,n,m,l,u,c)=>{const f=Math.round(34*b);for(let g=0;g<f;g++){const h=c()*I,M=l*Math.sqrt(c())*.92,G=r+Math.cos(h)*M,U=m+Math.sin(h)*M,H=c.range(.5,1.25),t0=n+u*.6*Math.sqrt(Math.max(0,1-M/l*(M/l)))-.05,e0=c.range(.9,1.5);Se.push({m:s0(G,t0,U,c()*I,c.range(-.25,.25),c.range(-.25,.25),.07,H,.07),v:[k0(G,U),c()*I,H*.12,1.5],c:[1.5*e0,1.35*e0,.7*e0]})}};for(const r of E0.anchors.stemBases)for(let n=0;n<4;n++){const m=R()*I,l=R.range(4,11),u=R.range(2,4.5),c=r.x*Q+Math.cos(m)*l,f=r.z*Q+6+Math.sin(m)*l*.7;K0.push({m:s0(c,a0(c,f)-.1,f,R()*I,0,0,u,u*.8,u),v:[0,0,0,0],c:[1,1,.9]})}const o=L0.moss;await e.yield();for(let r=0;r<64;r++){r%16===15&&await e.yield();const n=d0(o.range(.01,.6)),m=o.range(5.5,19)*o.sign(),l=o.range(1.4,3.6)*(Math.abs(m)<8?.75:1),u=n.p.x+n.n.x*m,c=n.p.z+n.n.z*m,f=l*o.range(.6,1),g=a0(u,c)-.1;g+f*.6>n.p.y-3.4||(K0.push({m:s0(u,g,c,o()*I,0,0,l,f,l),v:[0,0,0,0],c:[o.range(.8,1.2),1,.9]}),Math.abs(m)<15&&t(u,g,c,l,f,o))}for(let r=0;r<26;r++){const n=R.range(18,176),m=R.range(-1,1)*(It(n)-4),l=R.range(2,5.5);K0.push({m:s0(m,a0(m,n)-.15,n,R()*I,0,0,l,l*R.range(.5,.8),l),v:[0,0,0,0],c:[R.range(.85,1.25),1,.85]})}await e.yield();const i=c0(No(p,R,S,3),Z,K0,8);i.name="moss",x.add(i),await e.yield();const a=c0(Kt(p,[0,.5,1],!0),Z,Se,4);a.name="moss-hairs",x.add(a)}await e.yield();{const t=L0.litter,o=[],i=[],a=[],r=[],n=y.tulips.map(g=>new s.Color(g)),m=Math.round(900*w*b);A0=t;for(let g=0;g<m;g++){g%128===127&&await e.yield();const h=t.range(0,.6),M=d0(h),G=t.gauss()*6.5,U=M.p.x+M.n.x*G+t.range(-1,1),H=M.p.z+M.n.z*G+t.range(-1,1);if(Math.abs(G)>17||Bt(U,H)>0)continue;const t0=a0(U,H),e0=t();if(e0<.14){const Y=t.range(.3,.9),O=t.range(.28,.7);o.push({m:s0(U,t0+Y*.12,H,t()*I,t.range(-.3,.3),t.range(-.3,.3),Y*t.range(.8,1.4),Y*t.range(.45,.7),Y),v:[0,0,0,0],c:[O*1.05,O,O*.9]})}else if(e0<.5){const Y=t.range(.14,.42),O=t.range(.35,.8);i.push({m:s0(U,t0+Y*.3,H,t()*I,t()*3,t()*3,Y*t.range(.8,1.5),Y,Y),v:[0,0,0,0],c:[O*.75,O*.55,O*.38]})}else if(e0<.74){const Y=t.range(.8,1.9),O=t()<.45?n[t.int(0,2)]:new s.Color(.82,.8,.76);a.push({m:s0(U,t0+.12,H,t()*I,t.range(-.2,.2),t.range(-.25,.25),Y),v:[k0(U,H),t()*I,.05,0],c:[O.r,O.g,O.b]})}else if(e0<.9){const Y=t.range(.09,.2),O=t.range(.9,1.25);wt*Y<M.p.y-t0-3&&r.push({m:s0(U,t0-.1,H,t()*I,0,0,Y),v:[k0(U,H),t()*I,.5*Y,0],c:[O,O*1.05,O*.85]})}else{const Y=t.range(.12,.34);L.set(U,t0+Y*.9,H),m0(L,Y,0,0,0,0)}}const l=c0(Re(1),Z,o,4);l.name="pebbles",x.add(l),await e.yield();const u=c0(Re(0),Z,i,4);u.name="crumbs",x.add(u),await e.yield();const c=c0(qo(),Z,a,4);c.name="petals",x.add(c),await e.yield(),A0=C.dew;const f=c0(me(p,C.floor,wt,bt,2.7,!0),Z,r,4);f.name="sprouts",x.add(f)}await e.yield();{const t=[],o=[],i=y.tulips.map(l=>new s.Color(l).multiplyScalar(.9)),a=(l,u,c,f,g)=>{const h=S.n2(u*.006+3,c*.02),M=i[h>.25?1:h<-.3?2:0].clone().offsetHSL(R.range(-.015,.015),0,R.range(-.04,.04));l.push({m:s0(u,f,c,R()*I,R.range(-.04,.04),R.range(-.04,.04),g),v:[k0(u,c),R()*I,1.3*g,0],c:[M.r,M.g,M.b]})};for(const[l,u,c,f,g]of[[-60,10,150,.6,t],[-84,11.5,190,.7,t],[-112,13.5,230,.8,t],[-146,16,270,.94,o],[-188,19,300,1.1,o]])for(let h=-c;h<=c;h+=u){if(R()<.06)continue;const M=h+R.range(-4,4),G=l+R.range(-7,7);Math.abs(M)<72-(l+60)*.12||a(g,M,G,a0(M,G)-.5,f*R.range(.86,1.14))}const r=Math.round(5*(.6+.4*b));for(let l=0;l<r;l++){const u=-256-l*52-l*l*4,c=1.3+l*.22,f=24+l*5,g=320+l*50;for(let h=-g;h<=g;h+=f){if(R()<.1)continue;const M=h+R.range(-10,10);Math.abs(M)<72-(u+60)*.12||a(o,M,u+R.range(-12,12),-3.6,c*R.range(.85,1.2))}}const n=c0(Qe(p,R,!1),Z,t,60),m=c0(Qe(p,R,!0),Z,o,60);n.name="tulips",m.name="tulips-far",x.add(n,m),te.push(n,m)}await e.yield(),m0(V(T0.x,st.y+.2,T0.z),.66,P0.sp,P0.rp,P0.amp,1),m0(T0,Gt,P0.sp,P0.rp,P0.amp,1);{const t=p0.tipY+5.2,o=[0,-.08*p0.reach,.72*p0.reach,p0.reach],i=[0,t*.95,t*1.32,p0.tipY],a=(r,n)=>{const m=1-r;return m*m*m*n[0]+3*m*m*r*n[1]+3*m*r*r*n[2]+r*r*r*n[3]};[[.36,.5],[.45,.72],[.54,.98],[.63,1.2],[.72,.92],[.81,.7],[.9,.52]].forEach(([r,n])=>{const m=a(r,o);m0(L.set(l0.x+Math.sin(p0.rot)*m,l0.y+a(r,i)-n*.9-.3,l0.z+Math.cos(p0.rot)*m),n,p0.sp,p0.rp,p0.amp,Math.sqrt(r))})}let St;{const t=new s.InstancedBufferGeometry;t.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),t.setIndex([0,1,2,2,1,3]),t.setAttribute("iPos",new s.InstancedBufferAttribute(new Float32Array(J0.pos),4)),t.setAttribute("iSw",new s.InstancedBufferAttribute(new Float32Array(J0.sw),4)),t.setAttribute("iDat",new s.InstancedBufferAttribute(new Float32Array(J0.dat),4)),t.instanceCount=J0.pos.length/4,St=new s.Mesh(t,Ho(F)),St.name="dew",St.frustumCulled=!1,St.renderOrder=2,x.add(St)}await e.yield();{const t=P.clone().lerp(new s.Color(d.zenith),.7),o=new s.Mesh(new s.PlaneGeometry(3800,520),Eo(F,t,new s.Color(d.band),new s.Color(d.bandLeaf),p[4].clone().lerp(new s.Color(d.band),.5).multiplyScalar(.5),j.x/Math.max(.2,-j.z)*1040,k==="mist"?.75:k==="first"?.5:.3,j.y/Math.max(.2,-j.z)*1040+18));o.position.set(0,240,-960),o.name="band",o.renderOrder=-.5,x.add(o);const i=Math.round(200*b),a=new Float32Array(i*4),r=new Float32Array(i*4),n=C.fx,m=[p[0],p[0],p[0],p[1],p[1],p[5],p[5],p[6]],l=Math.atan2(j.x,-j.z);for(let f=0;f<i;f++){const g=n()<.78?l+n.gauss()*.55:n()*I,h=n.range(230,520),M=n.pick(m),G=n.range(.07,.24)*(n()<.12?2.2:1);if(a.set([Math.sin(g)*h,1+78*n()*n(),-Math.cos(g)*h,n.range(5,16)*h/350],f*4),r.set([M.r*G,M.g*G,M.b*G,n()*40],f*4),f>=i*.75){const U=l+n.range(-.75,.75),H=n.range(540,780),t0=n.pick([p[0],p[1],p[1],p[6],p[5]]),e0=n.range(.05,.13);a.set([Math.sin(U)*H,n.range(4,58),-Math.cos(U)*H,n.range(12,30)],f*4),r.set([t0.r*e0,t0.g*e0,t0.b*e0,n()*40],f*4)}}const u=new s.InstancedBufferGeometry;u.setAttribute("position",new s.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),u.setIndex([0,1,2,2,1,3]),u.setAttribute("iPos",new s.InstancedBufferAttribute(a,4)),u.setAttribute("iCol",new s.InstancedBufferAttribute(r,4)),u.instanceCount=i;const c=new s.Mesh(u,Zo(F));c.name="bokeh",c.frustumCulled=!1,c.renderOrder=1,x.add(c)}const ot=Ko(F,Z,C.fauna,new s.Color(y.lady).multiplyScalar(.85)),ke=2.4;ot.group.scale.setScalar(ke),x.add(ot.group);const kt=z0(x0,.3,V()),ro=$e(F,"#d6f0ff",[44,.5,.2],[5,26],1.3),io=[0,1].map(t=>{const o=Ro(F,Z,ro,C.fauna,t?new s.Color(y.damsel).offsetHSL(.04,0,.03):y.damsel);return o.group.scale.setScalar(t?1.9:2.2),x.add(o.group),o});let _0=null;if(D){_0=Qo(Z),_0.group.position.set(n0.x,a0(n0.x,n0.z)-.5,n0.z),_0.group.rotation.y=n0.ry,_0.group.scale.setScalar(n0.s),x.add(_0.group);const t=u0(),o=new s.Color(.62,.66,.56),i=[];let a=n0.x-Math.sin(n0.ry)*12,r=n0.z-Math.cos(n0.ry)*12,n=n0.ry+Math.PI;for(let l=0;l<=26;l++)i.push([a,r,n]),n=o0(n,Math.PI+.25*Math.sin(l*.7),.16),a+=Math.sin(n)*3,r+=Math.cos(n)*3;h0(t,1,26,(l,u)=>{const c=i[Math.round(u*26)],f=(l*2-1)*3.2*(1-.5*u),g=c[0]+Math.cos(c[2])*f,h=c[1]-Math.sin(c[2])*f;return[g,a0(g,h)+.14,h,o,0]},[0,0,10,0]);const m=new s.Mesh(f0(t),Z);m.name="snail-trail",x.add(m)}await e.yield();const R0={value:0},H0=j0.fxGroup();x.add(H0.object);const Ut=new s.Color(d.sun).lerp(new s.Color(d.mistCol),.4);H0.add(j0.makeMist({rng:C.fx,time:R0,count:k==="mist"?64:40,area:[320,5,320],center:[0,3.2,0],size:[18,38],color:Ut.clone().multiplyScalar(.8),opacity:.2*y.mist,drift:[q.x*.9,0,q.y*.9],follow:!0})),await e.yield();{const t=[],o=C.fx;for(let i=0;i<18;i++){const a=o.range(34,170),r=o.range(-1,1)*(It(Math.max(20,a))+12);t.push([r,o.range(2.5,5.5),a])}H0.add(j0.makeMist({rng:C.fx,time:R0,positions:t,size:[24,46],color:new s.Color(d.mistCol).lerp(new s.Color("#ffffff"),.3).multiplyScalar(.7),opacity:.1*y.mist,drift:[0,0,0],flatten:.3}))}await e.yield(),H0.add(j0.makeParticles({rng:C.fx,preset:"pollen",time:R0,density:.8*d.pollen*b,size:[.07,.18]})),await e.yield();const Ce=V(j.x,0,j.z).normalize();let Ae=null;for(const[t,o]of[[.035,-9],[.11,10],[.23,-10],[.3,9],[.36,-7],[.42,9],[.48,-9]]){const i=d0(t+.04),a=i.p.clone().addScaledVector(i.n,o*B);a.y=0;const r=Ce.clone().multiplyScalar(-.64).add(V(0,-.77,0)).normalize(),n=a.clone().addScaledVector(r,-62);H0.add(j0.makeGodRays({rng:C.fx,time:R0,position:n,direction:r,radius:12,count:9,length:66,width:[1,3.6],color:Ut,intensity:.34*d.shafts,falloff:.9,speed:.6,fogAmount:.3})),await e.yield()}{const t=d0(0),o=[],i=[];for(const[a,r,n]of[[210,40,1.7],[130,20,.9]]){const m=t.p.clone().addScaledVector(Ce,a);o.push([m.x,r,m.z]),i.push(n)}Ae=H0.add(j0.makeGlows({rng:C.fx,time:R0,positions:o,sizes:i,size:42,color:Ut,intensity:1,core:.1,halo:1.4,flicker:.05,fogAmount:.2,depthBias:0,near:[.05,.4]}))}const lo=H0.add(j0.makeGlow({rng:C.fx,time:R0,position:tt.c,size:3.3*ee,color:new s.Color(d.sun).lerp(new s.Color("#ffffff"),.4),intensity:.3,core:.3,halo:1.1,fogAmount:.4,depthBias:0,near:[.3,1.2]})),De=H0.add(j0.makeGlow({rng:C.fx,time:R0,size:430,color:new s.Color(d.sun).lerp(new s.Color(d.scatter),.6),intensity:.22,core:.2,halo:1.25,rays:.3,fogAmount:0,depthBias:0,near:[.01,.02],minAngle:0,renderOrder:-.4}));De.object.frustumCulled=!1,await e.yield(),F.uShafts={value:0};{const t=C.fx,o=30,i=[],a=[],r=[],n=[],m=j.clone().negate();for(let c=0;c<o;c++){let f=0,g=0;for(let O=0;O<8&&(f=t.range(-38,38)*Q,g=t.range(9,K+34),!(Math.hypot(f,g-K)>12.5*Q));O++);const h=Math.min(210,(g-1.5)/Math.max(.08,j.y))*t.range(.8,1),M=t.range(1.3,3.6),G=t()*I,U=i.length/3,H=6,t0=f+j.x*8,e0=g+j.y*8,Y=j.z*8;for(let O=0;O<=H;O++)for(const $ of[-1,1])i.push(t0,e0,Y),a.push(m.x,m.y,m.z,h+8),r.push($,O/H,M,G);for(let O=0;O<H;O++){const $=U+O*2;n.push($,$+1,$+2,$+2,$+1,$+3)}}const l=new s.BufferGeometry;l.setAttribute("position",new s.Float32BufferAttribute(i,3)),l.setAttribute("aDir",new s.Float32BufferAttribute(a,4)),l.setAttribute("aA",new s.Float32BufferAttribute(r,4)),l.setIndex(n);const u=new s.Mesh(l,Xo(F,Ut.clone().multiplyScalar(.3*.85*d.shafts)));u.name="web-shafts",u.frustumCulled=!1,u.renderOrder=3.5,x.add(u)}await e.yield();const co=new s.Vector2,We=V(),D0=V(),I0=V(),Pe=V(),Fe=new s.Matrix4,Ct=new s.Quaternion,jt=new s.Quaternion,ie=new s.Matrix4,At=V(),Zt=V(),uo=V(),le=V(),fo=F.uMist.value.x;let Ve=!0;const ho=E.length-B0(V(-2.6*B,0,184));function Le(t,o,i,a){const r=Math.min(1,t+.03+.07*o);return E.pointAt(r,i),E.tangentAt(r,a),i.x+=a.z*(-5.5+15*o)*B,i.z-=a.x*(-5.5+15*o)*B,i.y+=-1.5+16*o*o,i}const it=Math.PI/180,Ot=V(),Dt=V(),lt=V(),po=V(),mo=V(),ce=V(),vo=[{at:T0,a0:.06,a1:.12,b0:.2,b1:.25,w:.9,cap:40*it},{at:V(X0.x,gt.p.y+3,X0.z),a0:.2,a1:.24,b0:.26,b1:.3,w:.7,cap:35*it},{at:ce,a0:.27,a1:.31,b0:.39,b1:.44,w:.8,cap:35*it,lady:!0},{at:V(C0.x,_t,C0.z),a0:.39,a1:.44,b0:.45,b1:.5,w:.8,cap:35*it},{at:xe,a0:.44,a1:.5,b0:.57,b1:.63,w:.85,cap:60*it}],Te=(t,o)=>o*Math.tanh(t/o),go=14*it;function yo(t,o){E.pointAt(o,Ot),E.pointAt(Math.min(1,o+22/E.length),Dt),Dt.sub(Ot).normalize();const i=Math.atan2(Dt.x,-Dt.z),a=Math.asin(Q0(Dt.y,-1,1));let r=0,n=0;for(const c of vo){const f=c.w*X(c.a0,c.a1,o)*(1-X(c.b0,c.b1,o));if(f<=0)continue;if(c.lady){const M=o0(.2,.345,X(.06,.3,o)),G=X(.335,.357,o);z0(x0,M,ce,.3),G>0&&ce.lerp(Le(o,X(.41,.5,o),lt,po),G*G*(3-2*G))}lt.copy(c.at).sub(Ot);const g=Math.max(lt.length(),.001);let h=Math.atan2(lt.x,-lt.z)-i;h=Math.atan2(Math.sin(h),Math.cos(h)),r+=f*Te(h,c.cap),n+=f*Te(Math.asin(Q0(lt.y/g,-1,1))-a,go)}const m=i+r,l=a+n,u=Math.cos(l);return mo.set(Math.sin(m)*u,Math.sin(l),-Math.cos(m)*u).multiplyScalar(200).add(Ot)}const Be=[];{const t=B0(W0)-B0(i0);for(const o of[V(i0.x,10.5,i0.z),ve,V(q0.x,22,q0.z)]){const i=E.nearestXZ(o.x,o.z),a=i.u*E.length-i.dist;Be.push({at:o,from:(a-t)/E.length,to:a/E.length,weight:.2})}}const xo=new s.Quaternion().setFromAxisAngle(V(0,0,1),-.45*B);function Ge(t,o){const i=o0(.2,.345,X(.06,.3,o)),a=.42*Ee(i)*x0.W+.04;z0(x0,i,kt,a),z0(x0,i+.01,D0,a),z0(x0,i-.01,I0,a),D0.sub(I0).normalize(),z0(x0,i,I0,a+1).sub(kt).normalize(),Pe.crossVectors(I0,D0).normalize(),Ct.setFromRotationMatrix(Fe.makeBasis(Pe,I0,D0)),kt.add(Ze(We,t,q,x0.sp,x0.rp,x0.amp,i));const r=X(.3,.335,o),n=X(.335,.357,o),m=X(.41,.5,o),l=ot.group;n>0&&(Le(o,m,D0,r0),D0.y+=Math.sin(t*2.3)*.35,D0.x+=Math.sin(t*1.7)*.4,kt.addScaledVector(I0,1.6*Math.min(1,n*6)).lerp(D0,n*n*(3-2*n)),r0.y=.5+.3*m,jt.setFromRotationMatrix(Fe.lookAt(uo,r0.normalize().negate(),se)).multiply(xo),Ct.slerp(jt,X(0,.5,n))),l.visible=m<.985,l.position.copy(kt),l.quaternion.copy(Ct),l.scale.setScalar(ke*(1-.5*m));const u=i*x0.H*9+Math.sin(t*1.3)*.3*(1-r);ot.tripods[0].rotation.y=Math.sin(u)*.2*(1-n),ot.tripods[1].rotation.y=-Math.sin(u)*.2*(1-n);const c=X(.35,1,r),f=X(.6,1,r);for(let g=0;g<2;g++){const h=g?1:-1;ot.cases[g].rotation.set(.3*r,-h*1.05*r,h*.55*r);const M=ot.wings[g];M.visible=c>.02,M.scale.set(h*Math.max(.05,c),1,Math.max(.05,c)),M.rotation.set(0,h*.7*(1-c),h*(.3+.6*Math.sin(t*46+g))*f)}}function _e(t,o){le.copy(tt.c).add(Ze(We,t,q,tt.sp,tt.rp,tt.amp,1));const i=tt.hs,a=o*E.length;for(let r=0;r<et.length;r++){const n=et[r],m=a-n.mR;let l=1;if(m<=0)ie.compose(le,n.q,Lt.set(i,i,i));else{const u=X(0,2*zt,m),c=Q0(a+n.lead-.08*m,0,E.length),f=i;E.posAtDist(c,D0),E.tangentAtDist(c,r0);const g=(n.lat+n.drift*m)*B;D0.x+=r0.z*g+Math.sin(t*.5+n.ph)*.9,D0.z+=-r0.x*g+Math.cos(t*.43+n.ph)*.9,D0.y+=n.up+.03*m+Math.sin(t*.7+n.ph*1.7)*.7,I0.lerpVectors(le,D0,u),Yt.set(n.tx+.17*Math.sin(t*.6+n.ph),t*n.spin+n.ph,n.tz+.17*Math.cos(t*.5+n.ph*1.3)),jt.setFromEuler(Yt),Ct.copy(n.q).slerp(jt,X(0,.6,u)),I0.y-=Rt*.6*u*f,ie.compose(I0,Ct,Lt.set(f,f,f)),l=1-X(n.life-1.5*zt,n.life,m)}G0.setMatrixAt(r,ie),re.setW(r,l)}G0.instanceMatrix.needsUpdate=!0,re.needsUpdate=!0}let ue=0;for(const t of et)ue=Math.max(ue,t.mR+t.life);const Wt=B0(V(-3.2*B,0,Tt)),Ne=B0(i0),qe=B0(W0),He=B0(q0),wo=E.nearestXZ(i0.x,i0.z).dist,bo=V(-9.5*B,22.5,54),Mo=V(34*B,12,22),Pt=V(),Ft=V(),zo=[J.flies()*I,J.flies()*I];function Ie(t,o,i){if(t===0){const r=X(Wt+15,qe,o),n=X(qe,He,o),m=Math.min(E.length,Math.max(o,Wt+.2*(o-Wt))+wo*(o0(3,1,X(Wt,Ne,o))+1.5*n));E.posAtDist(m,i),E.tangentAtDist(m,r0);const l=(o0(26,-17,r)-24*n)*B;return i.x+=r0.z*l,i.z-=r0.x*l,i.y+=4.5-6.3*Math.sin(Math.PI*r)+30*n*n,i}const a=X(Wt,He,o);return i.lerpVectors(Mo,bo,a+.25*(o-Ne)/E.length),i.y-=5*Math.sin(Math.PI*a),i}function Ue(t,o){for(let i=0;i<2;i++){const a=io[i].group,r=zo[i],n=o*E.length;Ie(i,n,Pt),Ie(i,n+2,Ft).sub(Pt);const m=Math.atan2(Ft.x,Ft.z),l=Ft.length(),u=i===0&&l>1e-4?-Math.asin(Q0(Ft.y/l,-.6,.6))*.6:0;a.position.set(Pt.x+Math.sin(t*1.7+r)*.7,Pt.y+Math.sin(t*2.3+r*2)*.6,Pt.z+Math.sin(t*1.3+r*3)*.7),a.rotation.set(-.1+u+.08*Math.sin(t*1.1+r),m+.18*Math.sin(t*.7+r),.12*Math.sin(t*.9+r))}}return Ge(0,0),_e(0,0),Ue(0,0),{scene:x,path:E,duration:46,ride:"none",pace:t=>1-.3*de(t,.12,.24,.4)-.24*de(t,.38,.49,.4)-.2*de(t,.68,.9,.4),camera:{fov:62,near:.3,far:2600,lookAhead:22,sway:.7,bank:.8},pois:[{at:yo,from:.03,to:.67,weight:1,fade:.06},{at:xe,from:.5,to:1,weight:.75},...Be],portal:{shape:"circle",radius:9,color:"#ffd98a",glow:1.2,revealDistance:190},post:{exposure:d.exposure*.93,bloom:{strength:.42,radius:.6,threshold:1.05},grade:{saturation:d.sat,contrast:1.1,tint:d.tint,shadowTint:d.shadow,vignette:.34,grain:.02,aberration:0}},update(t,o,i,a){F.uTime.value=o,R0.value=o,e.renderer?.getDrawingBufferSize&&(F.uViewH.value=e.renderer.getDrawingBufferSize(co).y||1080),i.getWorldPosition(At),i.getWorldDirection(Zt);for(const l of Jt){let u=!1;for(const c of l.c)if((c.x-At.x)*Zt.x+(c.y-At.y)*Zt.y+(c.z-At.z)*Zt.z>-l.r){u=!0;break}l.m.visible!==u&&(l.m.visible=u)}De.object.position.copy(At).addScaledVector(j,1500),_.update(t,o,i),H0.update(t,o,i);const r=(1-a)*E.length,n=X(.62,1,a);E0.setProgress(n),E0.uniforms.uGain.value=o0(.5,1.3,1-X(2*K,ho,r))-.3*(1-X(.5*K,2*K,r)),E0.update(t,o,i),Ae.uniforms.uIntensity.value=1*(1-X(.03,.15,a)),lo.uniforms.uIntensity.value=.3*(1-.5*X(.43,.52,a)),F.uShafts.value=X(.46,.62,a),F.uBokeh.value=1-.55*(1-X(K,3*K,r)),F.uMist.value.x=fo*o0(1,.55,X(.5,.66,a));const m=a>.3;if(m!==Ve){Ve=m;for(const l of te)l.visible=m}Ge(o,a),Ue(o,a);{const l=a*E.length<ue+5;l!==G0.visible&&(G0.visible=l),l&&_e(o,a)}if(_0){const l=5*X(.45,1,a);_0.group.position.x=n0.x+Math.sin(n0.ry)*l,_0.group.position.z=n0.z+Math.cos(n0.ry)*l,_0.group.rotation.z=.015*Math.sin(o*.5);for(const u of _0.horns){const c=u.userData;u.rotation.set(.5+.22*Math.sin(o*.7+c.sx)+(c.up?0:.7),0,-c.sx*(.32+.14*Math.sin(o*.9+c.sx*2+c.up)))}}},dispose(){E0.dispose()}}}};export{aa as default};
