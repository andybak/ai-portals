import*as p from"three";import{makePath as Nt,clamp as at,lerp as Y,smoothstep as n0}from"../kit/core.js";import{buildHero as Ot,makeLines as J0,makeTrail as jt,GLSL_INK as yt,GLSL_WET as St,GLSL_FOG_PARS_V as Ft,GLSL_FOG_PARS_F as Dt,GLSL_FOG_MIX as Ct}from"../parts/corniche-120.js";const S0=1020,L0=1050,T0=1.2,p0=61,X=13,Zt=80,ot=30,h0=(S0+L0)/(Zt-ot),$=ot*h0,u0=160,qt=440,O0=172,It=$-u0-qt-O0,Ut=40*Math.PI/180,Y0=140,j0=150,h=(t,s,o)=>new p.Vector3(t,s,o),Ht={dusk:{palette:["#0A0418","#1B0F4A","#3A1470","#FF2BD6","#19F0FF","#FF5A7A","#FFB000"],top:"#150b3c",mid:"#3A1470",hor:"#b03a5c",horK:.5,below:"#0b0520",fog:"#241050",sun:"#FFB000",sun2:"#ff4a8a",stars:.22,crescent:0,inkGain:1,cityGain:1,band:.74,exposure:1,tint:"#fff4ff",shadow:"#06021a",glow:.6},night:{palette:["#05020e","#0c0730","#24105a","#FF2BD6","#19F0FF","#FF5A7A","#FFB000"],top:"#0b0630",mid:"#22106a",hor:"#5a22a8",horK:1.3,below:"#04020c",fog:"#0f0730",sun:"#FFB000",sun2:"#FFB000",stars:.66,crescent:1,inkGain:1.15,cityGain:1.13,band:.9,exposure:1.05,tint:"#f4f0ff",shadow:"#03010e",glow:1},dawn:{palette:["#06101c","#0d2f4a","#1f5a70","#FF2BD6","#19F0FF","#FF8A9A","#FFC24a"],top:"#082338",mid:"#14606a",hor:"#d9627c",horK:.55,below:"#06141f",fog:"#12384c",sun:"#FFC24a",sun2:"#ff6a8a",stars:.08,crescent:0,inkGain:1,cityGain:1,band:.74,exposure:1,tint:"#f6fbff",shadow:"#02101a",glow:.5}};function Kt(t){const s=[[u0,0],[73,-1/Y0],[147,1/Y0],[147,-1/Y0],[73,1/Y0],[It,Ut/It],[O0,0]],o=i=>{let y=0;for(const[M,b]of s){if(i<y+M)return b;y+=M}return 0},c=i=>{let y=0;for(let M=-4;M<=4;M++)y+=o(i+M*6);return y/9},a=1,e=Math.round(($+j0)/a),f=new Float64Array(e+1),w=new Float64Array(e+1),r=new Float64Array(e+1);let m=14,A=S0,v=0;f[e]=m,w[e]=A,r[e]=0;for(let i=e-1;i>=0;i--){const y=-j0+(i+.5)*a;v-=c(y)*a,m-=Math.sin(v)*a,A+=Math.cos(v)*a,f[i]=m,w[i]=A,r[i]=v}const g=i=>{const y=at((i+j0)/a,0,e),M=Math.min(e-1,Math.floor(y)),b=y-M,x=Y(r[M],r[M+1],b);return{x:Y(f[M],f[M+1],b),z:Y(w[M],w[M+1],b),psi:x,tx:Math.sin(x),tz:-Math.cos(x),k:c(i)}},n=[];for(let i=0;i<$-1;i+=t)n.push(g(i));return{at:g,pts:n,kAt:c}}function $t(t,s,o,c,a=0){const e=new p.Color(t.top).offsetHSL(a,0,0),f=new p.Color(t.mid).offsetHSL(a,0,0),w=new p.Color(t.hor).offsetHSL(a*1.5,0,0).multiplyScalar(t.horK),r=[];for(let g=0;g<9;g++){const n=g/8,i=new p.Color;n<.45?i.copy(w).lerp(f,Math.pow(n/.45,.8)):i.copy(f).lerp(e,(n-.45)/.55),r.push(i.multiplyScalar(t.band))}const m=[];for(let g=0;g<3;g++)m.push(new p.Vector4(c.range(-1.6,.4),(7+g*5.5+c.range(-1,1))*Math.PI/180,c.range(.22,.42),c.range(.6,1.2)));const A=new p.ShaderMaterial({depthWrite:!1,depthTest:!1,side:p.BackSide,fog:!1,uniforms:{uBand:{value:r},uBelow:{value:new p.Color(t.below)},uSunDir:{value:s},uSunA:{value:new p.Color(t.sun)},uSunB:{value:new p.Color(t.sun2)},uMag:{value:new p.Color(t.palette[3])},uBeat:o.uBeat,uTime:{value:0},uStars:{value:t.stars},uCrescent:{value:t.crescent},uCloud:{value:m},uSeed:{value:c.range(0,50)},uGlow:{value:t.glow}},vertexShader:`
      varying vec3 vDir;
      void main() { vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      varying vec3 vDir;
      uniform vec3 uBand[9]; uniform vec3 uBelow, uSunDir, uSunA, uSunB, uMag; uniform vec4 uCloud[3];
      uniform float uBeat, uTime, uStars, uCrescent, uSeed, uGlow;
      float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
      void main() {
        vec3 d = normalize(vDir + vec3(0.0, 0.0, 1e-5));
        float el = asin(clamp(d.y, -1.0, 1.0)), e = degrees(el);
        float w = max(fwidth(e), 1e-4) * 0.75;
        float f = smoothstep(2.6 - w, 2.6 + w, e) + smoothstep(6.0 - w, 6.0 + w, e) + smoothstep(10.5 - w, 10.5 + w, e) + smoothstep(16.0 - w, 16.0 + w, e)
          + smoothstep(23.0 - w, 23.0 + w, e) + smoothstep(32.0 - w, 32.0 + w, e) + smoothstep(44.0 - w, 44.0 + w, e) + smoothstep(60.0 - w, 60.0 + w, e);
        float fi = floor(min(f, 7.999));
        vec3 col = mix(uBand[int(fi)], uBand[int(fi) + 1], f - fi);
        // the city's glow: the low bands ahead of us (toward the bay) are lifted in magenta, band by band, so the
        // towers stand against light
        float az = atan(d.x, -d.z + 1e-5);
        col += uMag * 0.10 * uGlow * exp(-f * 0.62) * (1.0 - smoothstep(0.55, 1.05, abs(az)));
        // the sun: a disc cut by slits that step downward once a beat
        float ca = clamp(dot(d, uSunDir), -1.0, 1.0);
        float ang = acos(ca), R = 0.0785, wa = max(fwidth(ang), 1e-5);
        float disc = 1.0 - smoothstep(R - wa, R + wa, ang);
        float sunEl = asin(clamp(uSunDir.y, -1.0, 1.0));
        float sy = (el - sunEl) / R;
        float stepB = floor(uBeat) + smoothstep(0.0, 0.3, fract(uBeat));
        float sl = fract(sy * 3.0 + stepB), duty = 0.12 + 0.3 * (0.5 - 0.5 * sy);
        float wsl = max(fwidth(sy * 3.0), 1e-4);
        float slit = smoothstep(duty - wsl, duty + wsl, sl) * (1.0 - smoothstep(1.0 - wsl, 1.0, sl));
        slit = mix(slit, 1.0, smoothstep(0.35, 0.8, sy));
        vec3 sunC = mix(uSunB, uSunA, smoothstep(-1.0, 0.3, sy)) * 1.55;
        // night: a thin crescent with the same slits
        vec3 off = normalize(uSunDir + vec3(0.02, 0.022, 0.012));
        float ang2 = acos(clamp(dot(d, off), -1.0, 1.0));
        float bite = 1.0 - smoothstep(R - wa, R + wa, ang2);
        float shape = disc * mix(1.0, 1.0 - bite, uCrescent) * mix(slit, max(slit, 0.6), uCrescent);
        col = mix(col, sunC, shape);
        col += uSunA * 0.07 * exp(-ang * ang / 0.09) * (1.0 - 0.6 * uCrescent);
        // plus-mark stars in the top bands, twinkling on the sixteenths
        vec2 sp = d.xz / (0.45 + max(d.y, 0.0)) * 6.5;
        vec2 cell = floor(sp), q = fract(sp) - 0.5;
        float hs = h21(cell);
        vec2 o = (vec2(h21(cell + 3.1), h21(cell + 7.7)) - 0.5) * 0.6;
        vec2 a = abs(q - o); float ws = max(fwidth(sp.x) + fwidth(sp.y), 1e-4) * 0.6;
        float arm = 0.07 + 0.05 * h21(cell + 1.3);
        float plus = (1.0 - smoothstep(ws * 0.6, ws * 1.5, min(a.x, a.y))) * (1.0 - smoothstep(arm, arm + ws, max(a.x, a.y)));
        float tw = 0.45 + 0.55 * step(0.45, h21(cell + floor(uBeat * 4.0) * 0.37));
        col += vec3(0.75, 0.95, 1.0) * plus * step(1.0 - uStars, hs) * tw * smoothstep(16.0, 26.0, e) * 1.25;
        // three cloud bars: pairs of parallel lines sliding slowly right
        for (int i = 0; i < 3; i++) {
          vec4 c = uCloud[i];
          float da = az - (c.x + uTime * 0.006 * c.w);
          da = mod(da + 3.14159, 6.28318) - 3.14159;
          float m = 1.0 - smoothstep(c.z * 0.85, c.z, abs(da));
          float de = abs(abs(el - c.y) - 0.0065);
          float we = max(w * 0.0233, 1e-5);
          col += uMag * (1.0 - smoothstep(we * 0.5, we * 1.6, de)) * m * 0.8;
        }
        col = mix(uBelow, col, smoothstep(-w, w, e));
        gl_FragColor = vec4(col, 1.0);
      }`}),v=new p.Mesh(new p.SphereGeometry(5200,48,24),A);return v.renderOrder=-1,v.frustumCulled=!1,v}function Qt(t,s,o,c){const a=[],e=[],f=[],r=Math.round(($+j0)/4);for(let g=0;g<=r;g++){const n=-j0+g*4,i=s.at(n),y=Y(4.5,3.5,n0($-O0,$-20,n)),M=Math.cos(i.psi),b=Math.sin(i.psi);if(a.push(i.x-M*y,p0,i.z-b*y,i.x+M*y,p0,i.z+b*y),e.push(-y,n,y,y,n,y),g<r){const x=g*2;f.push(x,x+1,x+2,x+1,x+3,x+2)}}const m=new p.BufferGeometry;m.setAttribute("position",new p.BufferAttribute(new Float32Array(a),3)),m.setAttribute("aR",new p.BufferAttribute(new Float32Array(e),3)),m.setIndex(f);const A=new p.ShaderMaterial({uniforms:t,fog:!0,side:p.DoubleSide,defines:{SONG:o,RAIN:c?1:0},vertexShader:`
      attribute vec3 aR; varying vec3 vR; varying vec3 vP; varying float vD;
      ${Ft}
      void main() {
        vR = aR; vP = position;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vD = -mv.z; gl_Position = projectionMatrix * mv;
        #ifdef USE_FOG
          vFogDepth = -mv.z;
        #endif
      }`,fragmentShader:`
      varying vec3 vR; varying vec3 vP; varying float vD;
      uniform vec3 uFill, uHaze; uniform float uBeat, uBeatLen;
      ${yt} ${St} ${Dt}
      float hash1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
      void main() {
        float x = vR.x, s = vR.y, hw = vR.z;
        float wx = fwidth(x), ws = fwidth(s);
        float dim = mix(1.0, 0.36, clamp(vD / 1500.0, 0.0, 1.0));
        vec3 col = mix(uFill, uHaze * 0.16, clamp(vD / 2200.0, 0.0, 1.0));
        vec3 cA = ink(0.0, vP.z);
        float kerb = lineP(abs(abs(x) - hw + 0.25), wx, 0.14);
        float lane = lineP(abs(abs(x) - hw + 0.7), wx, 0.05) * 0.35;
        col += hot(cA, kerb) * dim + cA * lane * dim;
        // surface joints on the sixteenths and dotted lane guides, so the tarmac streaks when we lean over it
        float jp = uBeatLen * 0.25;
        float joint = lineP(abs(fract(s / jp + 0.5) - 0.5) * jp, ws, 0.06) * 0.4 * step(abs(x), hw - 0.3);
        float guide = lineP(abs(abs(x) - 2.3), wx, 0.045) * 0.55 * step(fract(s / (jp * 0.5)), 0.5);
        guide += lineP(abs(abs(x) - 1.2), wx, 0.04) * 0.4 * step(0.5, fract(s / (jp * 0.5)));
        col += cA * (joint + guide) * dim * (1.0 - smoothstep(200.0, 600.0, vD));
        // centre dashes laid one per beat (in pairs for the half-time song, four short for the broken beat)
        float ds = fract(s / uBeatLen);
        #if SONG == 1
          float dmask = step(ds, 0.1) + step(0.16, ds) * step(ds, 0.26);
        #elif SONG == 2
          float d4 = fract(ds * 4.0); float dmask = step(d4, 0.42) * smoothstep(0.0, 0.02, d4);
        #else
          float dmask = step(ds, 0.3);
        #endif
        float dash = lineP(abs(x), wx, 0.12) * dmask;
        col += mix(cA, vec3(1.0), 0.3) * dash * 1.2 * dim;
        // the dash's faint sheen on the tarmac either side of it
        col += cA * 0.12 * dmask * (1.0 - smoothstep(0.1, 0.8, abs(x))) * dim * (1.0 - smoothstep(120.0, 400.0, vD));
        // launch straight: chevrons on the surface chasing forward under the wheel
        float L0 = ${($-O0).toFixed(1)};
        float cb = floor(s / (uBeatLen * 0.5)), cs = s - cb * uBeatLen * 0.5;
        float chev = lineP(abs(cs - 8.0 + abs(x) * 1.1) * 0.67, max(ws, wx), 0.16) * step(abs(x), hw - 0.9) * step(0.5, abs(x)) * smoothstep(L0 - 30.0, L0 + 40.0, s);
        col += cA * chev * (0.3 + 1.5 * exp(-5.0 * fract(uBeat * 0.5 - cb / 8.0))) * dim;
        // oncoming traffic on the far lane: pairs of headlight dashes
        float gap = uBeatLen * 3.0;
        float q = (s + uBeat * uBeatLen * 0.75) / gap;
        float cell = floor(q), f = fract(q) * gap;
        float on = step(0.15, hash1(cell));
        float lx = -2.35 + (hash1(cell + 7.0) - 0.5) * 0.5;
        float hd = lineP(abs(abs(x - lx) - 0.62), wx, 0.13) * (1.0 - smoothstep(4.5, 6.0, f)) * smoothstep(0.0, 0.4, f) * on;
        float fan = (1.0 - smoothstep(0.0, 1.9, abs(x - lx))) * smoothstep(34.0, 6.0, f) * step(6.0, f) * on * 0.16;
        col += hot(cA, hd) * 1.25 * dim + cA * fan * dim;
        // the road is wet: the light of the hoops, the palms and the cliff lies on it as broken strokes that shimmer
        // on the beat, and the headlamp's amber under the fan
        vec3 cB = ink(1.0, vP.z);
        float wmask = step(abs(x), hw - 0.35), wfade = 1.0 - smoothstep(40.0, 260.0, vD);
        col += (cB * 0.5 * wetStreak(x, s, wx, ws, uBeat, 0.5, 4.0, 3.0) + cA * 0.32 * wetStreak(x + 0.3, s + 2.0, wx, ws, uBeat, 1.1, 7.0, 11.0)) * wfade * dim * wmask;
        col += uAmber * 0.42 * wetLamp(x, s, wx, ws, vD) * wmask;
        #if RAIN == 1
          // rain doubled on the road as short broken dashes, stepping on the sixteenths
          vec2 rc = vec2(floor(x / 0.45), floor(s / 3.2));
          float rh = hash1(rc.x * 13.7 + rc.y * 3.1 + floor(uBeat * 4.0) * 0.61);
          float rd = lineP(abs(fract(x / 0.45) - 0.5) * 0.45, wx, 0.035) * step(fract(s / 3.2), 0.4) * step(0.9, rh);
          col += cA * rd * 0.7 * dim * (1.0 - smoothstep(60.0, 220.0, vD));
        #endif
        ${Ct}
        gl_FragColor = vec4(col, 1.0);
      }`}),v=new p.Mesh(m,A);return v.frustumCulled=!1,v}function Jt(t,s){const o=[[-52,-66],[-40,-61.4],[-34,-50],[-28,-32],[-20,-15],[-14.5,-4],[-11.6,-.12],[-4.3,-.12]],c=[[4.3,0],[5.6,0],[7.2,.07],[10,.17],[15,.3],[23,.47],[34,.64],[50,.8],[70,.92],[95,1],[112,.96]],a=o.length+c.length,e=w=>Y(Y(120,14,n0(660,1e3,w)),2.5,n0(1030,1170,w))*(.9+.1*Math.sin(w*.013));function f(w,r,m){const A=n0($-64,$-24,w);let v,g;if(r<o.length){v=o[r][0],g=o[r][1];const M=at((-v-11.6)/30,0,1);v-=M*7*s.fbm2(w*.011,r*1.9+3,3),r<o.length-2&&(v=Y(v,-4.6-(o.length-2-r)*.5,A),g=Y(g,-66,A*(r<5?1:.6)))}else{const M=c[r-o.length],b=e(w),x=Y(.42,1,at(b/120,0,1));v=5.6+(M[0]-5.6)*(M[0]>5.6?x:1),g=M[1]*b-.12;const F=at((M[0]-5.6)/40,0,1);v+=F*9*s.fbm2(w*.012+40,r*1.7,3)+F*2.5*Math.sin(w*.045+r),g+=F*.1*b*s.fbm2(w*.02+9,r*.9,2),M[0]>4.4&&(v=Y(v,4.6+(r-o.length)*.4,A),g=Y(g,-66,A))}const n=t.at(w),i=Math.cos(n.psi),y=Math.sin(n.psi);return m.set(n.x+i*v,p0+g,n.z+y*v)}return{point:f,NP:a,nL:o.length,H:e}}function Yt(t,s){const o=[],c=[],a=[],e=h(0,0,0),f=u0-2,w=$-22,r=5,m=Math.round((w-f)/r),A=s.NP;for(let i=0;i<=m;i++){const y=f+i/m*(w-f);for(let M=0;M<A;M++)s.point(y,M,e),o.push(e.x,e.y,e.z),c.push(y,M);if(i<m)for(let M=0;M<A-1;M++){const b=i*A+M;a.push(b,b+1,b+A,b+1,b+A+1,b+A)}}const v=new p.BufferGeometry;v.setAttribute("position",new p.BufferAttribute(new Float32Array(o),3)),v.setAttribute("aD",new p.BufferAttribute(new Float32Array(c),2)),v.setIndex(a);const g=new p.ShaderMaterial({uniforms:t,fog:!0,side:p.DoubleSide,vertexShader:`
      attribute vec2 aD; varying float vS, vJ;
      varying vec3 vP; varying float vD;
      ${Ft}
      void main() {
        vP = position; vS = aD.x; vJ = aD.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vD = length(mv.xyz); gl_Position = projectionMatrix * mv;
        #ifdef USE_FOG
          vFogDepth = -mv.z;
        #endif
      }`,fragmentShader:`
      varying vec3 vP; varying float vD; varying float vS, vJ;
      uniform vec3 uFill, uHaze; uniform float uBeat, uBeatLen;
      ${yt} ${Dt}
      float hash1(float n) { return fract(sin(n * 127.1) * 43758.5453); }
      void main() {
        float y = vP.y, wy = fwidth(y), wsd = fwidth(vS);
        float far = clamp(vD / 1500.0, 0.0, 1.0), dim = mix(1.0, 0.4, far);
        float c1 = lineP(abs(fract(y / 2.0 + 0.5) - 0.5) * 2.0, wy, 0.07) * (1.0 - smoothstep(0.6, 1.6, wy));
        // strata ticks: short vertical strokes every 10 m of road, broken by height, on the rock close to us
        float nearK = 1.0 - smoothstep(90.0, 150.0, vD);
        float tk = floor(vS / 5.0 + 0.5);
        float tick = lineP(abs(vS - tk * 5.0), wsd, 0.08) * step(fract(y / 6.0 + hash1(tk)), 0.45) * 0.6 * nearK;
        // close rock: metre contours between the 2 m ones
        float c05 = lineP(abs(fract(y + 0.5) - 0.5), wy, 0.05) * (1.0 - smoothstep(0.25, 0.7, wy)) * (1.0 - smoothstep(30.0, 60.0, vD));
        // a band of light that leaves the rider on every beat and runs down the wall ahead along the 10 m strata
        float strata = exp(-6.0 * fract(uBeat * 1.25 - vS / (uBeatLen * 4.0))) * (1.0 - smoothstep(150.0, 420.0, vD));
        float c5 = lineP(abs(fract(y / 10.0 + 0.5) - 0.5) * 10.0, wy, 0.14) * (1.0 - 0.6 * smoothstep(1.5, 4.0, wy));
        // a slow pulse of brightness climbing the contours once a bar
        float climb = 0.75 + 0.5 * exp(-4.0 * fract(uBeat * 0.25 - y / 240.0));
        vec3 c = ink(1.0, vP.z);
        vec3 col = mix(uFill, uHaze * 0.16, smoothstep(0.1, 1.3, far));
        // the seaward verge (profile points 6..7, 7.3 m wide) is flat, so contours leave it bare: dotted lines along it
        // that streak past, and a firm line on its lip where the rock drops to the sea
        float vj = vJ - 6.0, wj = fwidth(vJ) * 7.3, hd = fract(vS / 5.2);
        float verge = (lineP(abs(vj - 0.22) * 7.3, wj, 0.045) * step(hd, 0.5) + lineP(abs(vj - 0.5) * 7.3, wj, 0.045) * step(0.5, hd) + lineP(abs(vj - 0.76) * 7.3, wj, 0.045) * step(hd, 0.5))
          * 0.5 * step(0.0, vj) * step(vj, 1.0) * (1.0 - smoothstep(120.0, 320.0, vD));
        float lip = lineP(abs(vj) * 6.0, wj, 0.1) * 0.75 * step(vJ, 6.5) * step(5.0, vJ);
        tick += verge + lip;
        col += (c * (c1 * mix(0.45, 0.8, nearK) + c05 * 0.4 + tick + c5 * strata * 0.9) * climb + hot(c, c5) * 0.7 * mix(0.8, 1.2, climb - 0.75)) * dim;
        ${Ct}
        gl_FragColor = vec4(col, 1.0);
      }`}),n=new p.Mesh(v,g);return n.frustumCulled=!1,n}function Xt(t,s,o,c){const a=[],e=[],f=[],r=[-j0,-70,0,60,120,u0],m=p0+4,A=15;r.forEach((b,x)=>{const F=s.at(b),N=Math.cos(F.psi),W=Math.sin(F.psi);for(let L=0;L<=28;L++){const E=L/28*Math.PI*2,r0=Math.cos(E)*A,R=Math.sin(E)*A;if(a.push(F.x+N*r0,m+R,F.z+W*r0),e.push(E,b),x<r.length-1&&L<28){const K=x*29+L;f.push(K,K+1,K+28+1,K+1,K+28+2,K+28+1)}}});const v=new p.BufferGeometry;v.setAttribute("position",new p.BufferAttribute(new Float32Array(a),3)),v.setIndex(f),v.setAttribute("aD",new p.BufferAttribute(new Float32Array(e),2));const g=new p.Mesh(v,new p.ShaderMaterial({uniforms:c,side:p.DoubleSide,fog:!1,vertexShader:`
      attribute vec2 aD; varying vec2 vA; varying vec3 vP;
      void main() { vA = aD; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,fragmentShader:`
      varying vec2 vA; varying vec3 vP;
      uniform vec3 uFill; uniform float uBeat, uBeatLen;
      ${yt} ${St}
      void main() {
        float wa = fwidth(vA.x) * 15.0, wd = fwidth(vA.y);
        float q = vA.x / 0.14, st = wetH(floor(q) + 2.0);
        float dl = abs(fract(q) - 0.5) * 0.14 * 15.0;
        float sg = fract(vA.y / (uBeatLen * 0.5) + uBeat + st * 5.0);
        float on = mix(smoothstep(0.0, 0.04, sg) * (1.0 - smoothstep(0.3, 0.42, sg)), 0.36, smoothstep(1.0, 4.0, wd));
        float l = lineP(dl, wa, 0.06) * on * step(0.55, st) * step(-0.26, sin(vA.x)) * (1.0 - smoothstep(0.5, 1.2, wa));
        vec3 col = uFill * 0.7 + mix(ink(1.0, vP.z), ink(0.0, vP.z), step(0.72, st)) * l * (0.22 + 0.3 * exp(-6.0 * fract(uBeat * 1.25 - vA.y / (uBeatLen * 4.0))));
        gl_FragColor = vec4(col, 1.0);
      }`}));g.frustumCulled=!1,o.add(g);const n=(b,x,F,N,W,L,E,r0,R)=>{const K=s.at(b),l0=Math.cos(K.psi),F0=Math.sin(K.psi);let t0=null;for(let d0=0;d0<=W;d0++){const M0=Y(F,N,d0/W),v0=h(K.x+l0*Math.cos(M0)*x,m+Math.sin(M0)*x,K.z+F0*Math.cos(M0)*x);t0&&t.add(t0,v0,L,E,r0,R),t0=v0}},i=-.27,y=Math.PI+.27;for(let b=-3;b*h0<u0-5;b++){const x=b*h0,F=(b%4+4)%4/4,N=W=>2+(W/h0/4%1+1)%1;n(x,14.5,i,y,22,.5,0,N(x),1),n(x+.9,14.1,i,y,22,.25,0,N(x),.45);for(let W=1;W<4;W++)n(x+W*h0/4,14.6,i,y,16,.2,1,N(x+W*h0/4),.9)}n(u0-.3,14.7,i,y,26,.6,1,-1,1.1);const M=h0/4;[.3,.72,1.14,Math.PI-1.14,Math.PI-.72,Math.PI-.3].forEach((b,x)=>{for(let F=-j0+x%2*M*.5;F<u0;F+=M){const N=s.at(F),W=s.at(Math.min(u0,F+M*.62)),L=Math.cos(b)*14.6,E=m+Math.sin(b)*14.6;t.add(h(N.x+Math.cos(N.psi)*L,E,N.z+Math.sin(N.psi)*L),h(W.x+Math.cos(W.psi)*L,E,W.z+Math.sin(W.psi)*L),.24,1,2+(F/h0/4%1+1)%1,.5)}})}function te(t,s){let o=null;for(let c=u0+6;c<$-4;c+=10){const a=s.at(c),e=n0($-O0,$-20,c),f=-Y(5.3,3.65,e),w=a.x+Math.cos(a.psi)*f,r=a.z+Math.sin(a.psi)*f,m=h(w,p0,r),A=h(w,p0+.95,r),v=h(w,p0+.5,r);if(t.add(m,A,.2,0,-1,.75),o&&(t.add(o.t,A,.22,0,-1,.65),t.add(o.m,v,.14,0,-1,.3)),o={t:A,m:v},c<$-O0-10)for(const g of[c,c+5]){const n=s.at(g),i=s.at(g+.7);t.add(h(n.x+Math.cos(n.psi)*4.85,p0+.1,n.z+Math.sin(n.psi)*4.85),h(i.x+Math.cos(i.psi)*4.85,p0+.1,i.z+Math.sin(i.psi)*4.85),.16,0,2+(g/h0/4%1+1)%1,.8)}if(Math.round(c/10)%2===0&&c<$-70){const g=a.x+Math.cos(a.psi)*5.1,n=a.z+Math.sin(a.psi)*5.1;t.add(h(g,p0,n),h(g,p0+.7,n),.2,1,-1,.6)}}}function ee(t){for(let e=0;e<12;e++){const f=-L0+e*h0+(e===0?.6:0),w=(11-e)/12;for(let r=0;r<5;r++){const m=17.3-r*1.4,A=X+14-r*1.7,v=X+25-r*2.2,g=1-r*.13,n=[h(-m,X,f),h(-m,A,f),h(0,v,f),h(m,A,f),h(m,X,f)];for(let i=0;i<4;i++)t.add(n[i],n[i+1],r===0?.42:.26,1,w,g*.55)}for(const r of[1,-1])t.add(h(r*17.3,X+14,f),h(r*11.7,X+7.2,f),.2,1,w,.3)}const s=-L0+.6,o=8.6,c=X+T0,a=[h(-o,X,s),h(-o,X+6.3,s),h(0,X+10.5,s),h(o,X+6.3,s),h(o,X,s)];for(let e=0;e<4;e++)t.add(a[e],a[e+1],.3,0,11/12,1.2);for(const[e,f,w]of[[7.8,0,1.2],[8.6,1,1]])for(let r=0;r<16;r++){const m=r/16*Math.PI*2,A=(r+1)/16*Math.PI*2;Math.sin((m+A)/2)*e<-T0+.2||t.add(h(Math.cos(m)*e,Math.max(X,c+Math.sin(m)*e),s-.3),h(Math.cos(A)*e,Math.max(X,c+Math.sin(A)*e),s-.3),.24,f,11/12,w)}for(const e of[1,-1])for(let f=0;f<8;f++){const w=f/8,r=(f+1)/8,m=e*Y(13.2,7.4,w),A=e*Y(13.2,7.4,r);t.add(h(m,X+.06,-L0+120*(1-w)),h(A,X+.06,-L0+120*(1-r)),.45,0,2+(-(120*(1-w))/h0/4%1+1)%1,1.6)}}function ae(t,s){const o=[[0,4.2],[12,3.3],[24,2.6],[26,3.6],[30.5,1.7]],c=8,a=(e,f,w)=>h(s.x+Math.cos(w/c*Math.PI*2)*f,s.y+e,s.z+Math.sin(w/c*Math.PI*2)*f);o.forEach(([e,f],w)=>{for(let r=0;r<c;r++)t.add(a(e,f,r),a(e,f,r+1),.3,0,-1,w===3?.9:.6)});for(let e=0;e<c;e++)t.add(a(0,4.2,e),a(12,3.3,e),.26,0,-1,.55),t.add(a(12,3.3,e),a(24,2.6,e),.26,0,-1,.55),t.add(a(12,3.3,e),a(24,2.6,e+1),.16,0,-1,.25),t.add(a(26,1.7,e),a(30.5,1.7,e),.2,0,-1,.7),t.add(a(30.5,1.7,e),h(s.x,s.y+34,s.z),.2,0,-1,.6),t.add(a(24,2.6,e),a(26,3.6,e),.2,0,-1,.5);return h(s.x,s.y+28.2,s.z)}function oe(t,s,o,c,a){for(let e=0;e<4;e++){const f=e/4*Math.PI,w=Math.cos(f)*c,r=Math.sin(f)*c*(e===2?1.25:1);t.add(h(s.x-o.x*w,s.y-r*.55+c*.5,s.z-o.z*w),h(s.x+o.x*w,s.y+r+c*.5,s.z+o.z*w),.14,a,-1,.55)}}function Wt(t,s,o,c,a,e,f,w,r){const m=()=>s.push(o.x,o.y,o.z,e);let A=o.clone();const v=h(0,0,0);for(let n=1;n<=4;n++){const i=n/4,y=h(o.x+a.x*i*i,o.y+c*i,o.z+a.z*i*i);t.add(A,y,.2,w,-1,.8),m(),A=y,n===4&&v.copy(y)}const g=f.range(0,6.28);for(let n=0;n<9;n++){const i=g+n/9*Math.PI*2+f.range(-.2,.2),y=Math.cos(i),M=Math.sin(i),b=f.range(3.4,4.6),x=f.range(.5,1.4);let F=v.clone();for(const[N,W]of[[.36,.55],[.72,.42],[1,-.28]]){const L=h(v.x+y*b*N,v.y+x*W*1.6-(N>.9?.9:0),v.z+M*b*N);t.add(F,L,.16,r,-1,.85),m(),F=L}}}const se=`
  attribute vec4 aQ; uniform vec3 uEye, uTravel; uniform float uTime, uLife;`,ne=`
  {
    vec3 rel = aQ.xyz - uEye; float dd = dot(rel, rel);
    float gust = exp(-dd / 8000.0);
    vec3 wind = uTravel * (3.2 * gust) + vec3(sin(uTime * 1.3 + aQ.w * 0.7), 0.0, cos(uTime * 1.1 + aQ.w * 1.3)) * 0.4;
    float ha = max(A.y - aQ.y, 0.0) / 12.0, hb = max(B.y - aQ.y, 0.0) / 12.0;
    A += wind * ha * ha * 2.2; B += wind * hb * hb * 2.2;
    A.y -= gust * ha * ha * 1.2; B.y -= gust * hb * hb * 1.2;
    // each palm flares for a quarter of a beat on the off-beat, the flare running down the row away from us
    float fl = exp(-9.0 * fract(uBeat - 0.5 - aQ.w * 0.125));
    gMul = (0.5 + 1.3 * fl * uLife) * mix(0.4, 1.0, uLife) * mix(1.0, 0.22, clamp(sqrt(dd) / 700.0, 0.0, 1.0));
  }`;function Lt(t,s,o){const c=J0(t,o),a=h(0,0,0);for(let g=0;g<s;g++)c.add(a,a,.2,0,-1,0);const e=c.build(null,!0),f=e.geometry.attributes,w=f.aA.array,r=f.aB.array,m=f.aW.array;let A=0;const v={mesh:e,begin(){A=0},seg(g,n,i,y,M,b,x,F,N){if(A>=s)return;const W=A*3,L=A*4;w[W]=g,w[W+1]=n,w[W+2]=i,r[W]=y,r[W+1]=M,r[W+2]=b,m[L]=x,m[L+1]=F,m[L+2]=-1,m[L+3]=N,A++},put(g,n,i=1){const y=g.o,M=g.r,b=g.u,x=g.f;v.seg(y.x+M.x*n[0]+b.x*n[1]+x.x*n[2],y.y+M.y*n[0]+b.y*n[1]+x.y*n[2],y.z+M.z*n[0]+b.z*n[1]+x.z*n[2],y.x+M.x*n[3]+b.x*n[4]+x.x*n[5],y.y+M.y*n[3]+b.y*n[4]+x.y*n[5],y.z+M.z*n[3]+b.z*n[4]+x.z*n[5],n[6],n[7],n[8]*i)},end(){e.geometry.instanceCount=Math.max(1,A),A===0&&(m[3]=0),f.aA.needsUpdate=f.aB.needsUpdate=f.aW.needsUpdate=!0}};return v}const Rt=()=>({o:h(0,0,0),r:h(1,0,0),u:h(0,1,0),f:h(0,0,-1)});function G(t,s,o,c,a,e=!1){for(let f=0;f<s.length-(e?0:1);f++){const w=s[f],r=s[(f+1)%s.length];t.push([w[0],w[1],w[2],r[0],r[1],r[2],o,c,a])}}function re(){const t=[];G(t,[[-.95,.3,-2.7],[.95,.3,-2.7],[.95,.3,2.7],[-.95,.3,2.7]],.09,1,.8,!0),G(t,[[-.95,.85,-2.7],[.95,.85,-2.7],[.95,.85,2.5],[-.95,.85,2.5]],.09,1,.9,!0);for(const c of[-1,1]){G(t,[[c*.95,.85,-.9],[c*.95,1.38,-2.75],[c*.95,.3,-2.7]],.09,1,1),G(t,[[c*.95,.3,2.7],[c*.95,.85,2.5]],.09,1,.7),G(t,[[c*.82,.85,.75],[c*.76,1.32,.42]],.09,1,.8);for(const a of[-1.7,1.7])G(t,[[c*.95,.3,a-.42],[c*.95,.02,a-.2],[c*.95,.02,a+.2],[c*.95,.3,a+.42]],.09,1,.5);t.push([c*.52,.7,-2.74,c*.86,.7,-2.74,.16,2,1.7])}return G(t,[[-.76,1.32,.42],[.76,1.32,.42]],.09,1,.8),G(t,[[-.55,1.2,-.25],[-.4,1.42,-.2],[-.25,1.2,-.25]],.09,1,.8,!0),{segs:t,scarf:[-.4,1.3,-.3],lat:2.7,tail:.86}}function ie(){const t=[];for(const a of[.4,3.3])G(t,[[-1.25,a,-5.6],[1.25,a,-5.6],[1.25,a,5.6],[-1.25,a,5.6]],.1,1,.9,!0);for(const a of[-1,1]){for(const e of[-5.6,5.6])G(t,[[a*1.25,.4,e],[a*1.25,3.3,e]],.1,1,.9);for(const e of[1.6,2.7])G(t,[[a*1.25,e,-5.6],[a*1.25,e,5.6]],.1,0,.55);for(let e=-5.6+1.4;e<5.6-.5;e+=1.4)G(t,[[a*1.25,1.6,e],[a*1.25,2.7,e]],.1,0,.4);t.push([a*.7,.85,-5.6-.03,a*1.12,.85,-5.6-.03,.18,2,1.7]),t.push([a*.95,3.1,-5.6-.03,a*1.12,3.1,-5.6-.03,.14,2,1.2])}return G(t,[[-.95,1.7,-5.6],[.95,1.7,-5.6],[.95,2.8,-5.6],[-.95,2.8,-5.6]],.1,0,.6,!0),{segs:t,scarf:null,lat:2.85,tail:1.12}}function le(){const t=[];for(const o of[-.72,.75]){const c=[];for(let a=0;a<8;a++)c.push([0,.34+Math.sin(a*Math.PI/4)*.34,o+Math.cos(a*Math.PI/4)*.34]);G(t,c,.07,1,.8,!0)}G(t,[[0,.34,-.72],[0,.8,-.5],[0,.82,.3],[0,.34,.75]],.07,1,.8),G(t,[[0,.8,-.5],[0,1.02,-.95]],.07,1,.8),G(t,[[0,.9,-.3],[0,1.36,.08],[0,1.52,.28]],.07,0,1),G(t,[[-.24,1.3,.05],[.24,1.3,.05]],.07,0,.9);for(const o of[-1,1])G(t,[[o*.24,1.3,.05],[o*.32,1,.55],[0,.95,.5]],.07,0,.8);return G(t,[[-.1,1.5,.22],[0,1.66,.3],[.1,1.5,.22],[0,1.44,.34]],.07,0,.9,!0),t.push([-.14,.9,-.97,.14,.9,-.97,.16,2,1.8]),{segs:t,scarf:[0,1.5,.15],lat:2.2,tail:.14}}function ce(){const t=[];return G(t,[[-9,1.3,0],[-7,0,0],[6,0,0],[9.5,1.7,0],[-9,1.3,0]],.5,0,.9),G(t,[[0,1.4,0],[0,25,0]],.5,0,.9),G(t,[[-.4,24,0],[-8.5,3.2,0],[-.4,3.2,0]],.5,1,1),G(t,[[.5,21.5,0],[8.8,2.4,0],[.6,2.4,0]],.5,1,.8),t}function fe(){const t=[];G(t,[[-120,11,0],[-112,0,0],[104,0,0],[124,12,0],[-120,11,0]],.9,0,1),G(t,[[-84,11,0],[-84,19,0],[72,19,0],[78,11.6,0]],.9,0,.8),G(t,[[-62,19,0],[-62,26,0],[50,26,0],[54,19,0]],.9,0,.7);for(const o of[-40,-8,24])G(t,[[o-6,26,0],[o-9,41,0],[o+1,41,0],[o+4,26,0]],.9,1,1);G(t,[[96,12,0],[96,30,0]],.9,0,.6),G(t,[[-104,11,0],[-104,24,0]],.9,0,.6);for(let o=-104;o<100;o+=9)t.push([o,5.5,0,o+4,5.5,0,.8,1,.9]);for(let o=-78;o<68;o+=9)t.push([o,15,0,o+4,15,0,.7,1,.7]);for(let o=-56;o<46;o+=9)t.push([o,22.5,0,o+4,22.5,0,.7,1,.6]);return t}const he=-.23,Mt=.52,bt=-.17;function ue(t,s){const o=new p.Color(s[4]),c=new p.Color(s[3]),a=new p.Color(s[0]),e=Object.assign({},t,{uInkA:{value:o.clone()},uInkB:{value:c.clone()},uInkA2:{value:o.clone()},uInkB2:{value:c.clone()},uWipeZ:{value:1e9},uSplit:{value:0}}),f=o.clone(),w=Object.assign({},e,{uInkA:{value:f},uInkA2:{value:f}}),r=[],m=new p.Group;m.matrixAutoUpdate=!1,m.frustumCulled=!1;const A=J0(e,{depthTest:!1,renderOrder:22}),v=(l,P,C=0,j=.9,Z=.011)=>A.add(h(l[0],l[1],l[2]),h(P[0],P[1],P[2]),Z,C,-1,j*.78),g=(l,P,C,j,Z=!1)=>{for(let I=0;I<l.length-(Z?0:1);I++)v(l[I],l[(I+1)%l.length],P,C,j)},n=[],i=[],y=l=>{const P=n.length/3;for(const C of l)n.push(C[0],C[1],C[2]);for(let C=1;C<l.length-1;C++)i.push(P,P+C,P+C+1)},M=[[-.34,-.315,-.72],[-.3,-.315,-.74],[-.14,-.325,-.8],[0,-.335,-.81],[.14,-.325,-.8],[.3,-.315,-.74],[.34,-.315,-.72]];g(M,0,1,.014),g(M.map(l=>[l[0],l[1]-.014,l[2]]),0,.5,.008);for(const l of[-1,1]){for(const U of[.016,-.016])v([l*.34,-.315+U,-.72],[l*.475,-.327+U,-.655],0,.9,.01);v([l*.475,-.305,-.655],[l*.475,-.349,-.655],0,.9);const P=l*.405,C=-.318,j=-.685,Z=[];for(let U=0;U<10;U++){const c0=U/10*Math.PI*2;Z.push([P+Math.cos(c0)*.072,C+Math.sin(c0)*.05+.006,j+l*Math.cos(c0)*.03])}if(y(Z),g(Z,1,.95,.012,!0),l<0)for(let U=-1;U<=1;U++)v([P+U*.034,C+.05,j],[P+U*.036,C+.014,j-.004],1,.6,.008);const I=[[P-.062,C-.03,j+.02],[P+.062,C-.03,j+.02],[l*.5+.1,-.5,-.5],[l*.5-.1,-.5,-.5]];y(I),v(I[0],I[3],1,.8),v(I[1],I[2],1,.8),v([l*.27,-.317,-.752],[l*(Mt-.09),bt-.03,-.84],0,.8);const Q=l*Mt,g0=bt,T=-.84,q=.088,i0=.044,z0=[[Q-q,g0-i0*.6,T],[Q-q*.8,g0+i0,T],[Q+q*.8,g0+i0,T],[Q+q,g0-i0*.6,T],[Q+q*.7,g0-i0,T],[Q-q*.7,g0-i0,T]];for(let U=0;U<6;U++)r.push([z0[U],z0[(U+1)%6]])}const b=[];for(let l=0;l<=12;l++){const P=l/6-1,C=1-P*P;b.push([.33*P,-.3+.095*C,-1.02-.1*C])}g(b,0,.75,.011),v(b[0],[-.2,-.322,-.78],0,.5),v(b[12],[.2,-.322,-.78],0,.5);const x=[0,-.3,-.92],F=.076,N=[];for(let l=0;l<16;l++){const P=l/16*Math.PI*2;N.push([x[0]+Math.cos(P)*(F+.016),x[1]+Math.sin(P)*(F+.016),x[2]+.004])}y(N);const W=l=>Math.PI*(1.18-l/11*1.36);for(let l=0;l<12;l++){const P=W(l),C=Math.cos(P),j=Math.sin(P);v([x[0]+C*F*.8,x[1]+j*F*.8,x[2]],[x[0]+C*F,x[1]+j*F,x[2]],l>=9?1:3,l>=9?1:.7,.009)}const L=[];for(let l=0;l<=14;l++){const P=Math.PI*(1.22-l/14*1.44);L.push([x[0]+Math.cos(P)*(F+.012),x[1]+Math.sin(P)*(F+.012),x[2]])}g(L,0,.6,.008);const E=[[-.2,-.7,-.5],[-.135,-.44,-.66],[-.06,-.365,-.76],[.06,-.365,-.76],[.135,-.44,-.66],[.2,-.7,-.5]];y(E),g(E,0,.85,.013);const r0=[];for(let l=0;l<8;l++){const P=l/8*Math.PI*2;r0.push([Math.cos(P)*.026,-.378+Math.sin(P)*.007,-.74])}g(r0,1,.6,.008,!0);for(const l of[-1,1])v([l*.05,-.337,-.805],[l*.055,-.365,-.762],0,.5,.009);const R=A.build();m.add(R);const K=new p.BufferGeometry;K.setAttribute("position",new p.BufferAttribute(new Float32Array(n),3)),K.setIndex(i);const l0=new p.Mesh(K,new p.MeshBasicMaterial({color:a.clone().multiplyScalar(.85),side:p.DoubleSide,depthTest:!1,depthWrite:!1,transparent:!0,opacity:.7,fog:!1}));l0.renderOrder=20,l0.frustumCulled=!1,m.add(l0);const F0={uBeat:t.uBeat,uA:{value:f},uB:{value:c},uAmber:{value:new p.Color(s[6])},uFill:{value:a},uCar:{value:new p.Vector2(0,0)}},t0=new p.BufferGeometry,d0=[],M0=[],v0=[];for(const l of[-1,1]){const P=l*Mt,C=bt,j=-.84,Z=.088,I=.044,Q=d0.length/3,g0=[[-Z,-I*.6],[-Z*.8,I],[Z*.8,I],[Z,-I*.6],[Z*.7,-I],[-Z*.7,-I]];for(const T of g0)d0.push(P+T[0],C+T[1],j),M0.push(T[0]/Z,T[1]/I,l);for(let T=1;T<5;T++)v0.push(Q,Q+T,Q+T+1)}t0.setAttribute("position",new p.BufferAttribute(new Float32Array(d0),3)),t0.setAttribute("aM",new p.BufferAttribute(new Float32Array(M0),3)),t0.setIndex(v0);const b0=new p.Mesh(t0,new p.ShaderMaterial({uniforms:F0,depthTest:!1,depthWrite:!1,transparent:!0,side:p.DoubleSide,fog:!1,vertexShader:"attribute vec3 aM; varying vec3 vM; void main() { vM = aM; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",fragmentShader:`
      varying vec3 vM; uniform float uBeat; uniform vec3 uA, uB, uAmber, uFill; uniform vec2 uCar;
      void main() {
        vec2 p = vM.xy; float hz = 0.2, w = max(fwidth(p.y), 1e-4);
        vec3 col = uFill * 0.9;
        float below = max(hz - p.y, 0.02), zz = 1.0 / below;
        float road = step(p.y, hz);
        float ex = abs(abs(p.x - vM.z * 0.15) - below * 0.95);
        col += uA * (1.0 - smoothstep(w, w * 2.5, ex)) * road * 0.9;
        float dsh = step(fract(zz * 0.55 - uBeat), 0.4) * (1.0 - smoothstep(w * 0.8, w * 2.2, abs(p.x - vM.z * 0.15))) * road;
        col += mix(uA, vec3(1.0), 0.4) * dsh * (1.0 - smoothstep(4.0, 14.0, zz));
        col += uB * (1.0 - smoothstep(w, w * 2.5, abs(p.y - hz))) * 0.6;
        col += uB * 0.1 * step(hz, p.y) * step(fract(p.y * 3.0), 0.5);
        // what we have just overtaken: two amber dots shrinking in the right-hand mirror
        float cy = hz - 0.9 / max(uCar.x, 0.9), sp = uCar.y / max(uCar.x, 1.0) * 1.1;
        float cx = vM.z * 0.15 - 0.5 * (hz - cy);
        float dot2 = 1.0 - smoothstep(0.03, 0.09, min(length(p - vec2(cx - sp, cy)), length(p - vec2(cx + sp, cy))) / max(0.25, 2.0 / max(uCar.x, 1.0)));
        col += uAmber * 1.6 * dot2 * step(0.0, vM.z) * step(1.0, uCar.x) * (1.0 - smoothstep(120.0, 220.0, uCar.x));
        gl_FragColor = vec4(col, 1.0);
      }`}));b0.renderOrder=21,b0.frustumCulled=!1,m.add(b0);const y0=Lt(w,32,{depthTest:!1,renderOrder:23});m.add(y0.mesh);const X0=new p.Matrix4;return{group:m,mU:F0,update(l,P,C,j,Z,I,Q=1,g0=!1){g0&&f.copy(t.uInkA2.value),l>0&&f.lerp(t.uInkA2.value,1-Math.pow(1-.08,l*60));const T=W(Y(7.2,11,Z)+.25*Math.sin(j*7.3)*(.3+Z));y0.begin(),y0.seg(x[0]-Math.cos(T)*.012,x[1]-Math.sin(T)*.012,x[2]-.002,x[0]+Math.cos(T)*F*.92,x[1]+Math.sin(T)*F*.92,x[2]-.002,.013,2,1.5);const q=Math.floor((C%4+4)%4),i0=C-Math.floor(C);for(let a0=0;a0<4;a0++){const f0=a0===q?.55+1.1*Math.exp(-3.5*i0):.22,Z0=-.054+a0*.036;y0.seg(Z0-.011,-.354,-.905,Z0+.011,-.354,-.905,.014,0,f0*1.25*I)}for(let a0=0;a0<r.length;a0++){const f0=r[a0];y0.seg(f0[0][0],f0[0][1],f0[0][2],f0[1][0],f0[1][1],f0[1][2],.011,0,.9*.78)}const z0=(Z-.5)*.03,U=.405,c0=-.318,D0=-.685;for(let a0=-1;a0<=1;a0++)y0.seg(U+a0*.034,c0+.05-z0*.4,D0,U+a0*.036,c0+.014-z0,D0-.004,.008,1,.6);y0.end(),X0.makeTranslation(Math.sin(j*37)*.0012,Math.sin(j*53+1)*.0016+Math.sin(j*2.1)*.002+he-.55*(1-Q),0),m.matrix.multiplyMatrices(P.matrixWorld,X0),m.matrixWorldNeedsUpdate=!0}}}var we={id:"corniche-120",name:"Corniche at 120 BPM",category:"bizarre",media:["open"],weirdness:.55,async build(t){const s=t.rng,o=t.vary||{},c=t.quality?.detail??1,a=o.density??1,e=s(),f=s(),w=s(),r=s(),m=s.shuffle([0,1,2]),A=-s.range(42,68)*Math.PI/180,v=s.sign(),g=s.range(-.05,.05),n=o.hour,i=n==="night"?"night":n==="dawn"||n==="day"?"dawn":n==="golden"||e<.5?"dusk":e<.76?"night":"dawn",y=Ht[i],M=f<.5?0:f<.75?1:2,b=w<.4?"convertible":w<.7?"rival":"coach",x=r<.3,F=!!o.rare,N=4*Math.PI/180,W=h(Math.sin(A)*Math.cos(N),Math.sin(N),-Math.cos(A)*Math.cos(N)),L=new p.Scene;L.background=new p.Color(y.below),L.fog=new p.Fog(new p.Color(y.fog),500,5400);const E=new p.Group;E.name="corniche-root",L.add(E);const r0=await Ot(t,{palette:y.palette,rollDir:v,beatLength:h0,seaRadius:4300,sunDir:W.toArray(),song:M,inkGain:y.inkGain,cityGain:y.cityGain,beatOffset:ot,gantryZ:-L0});E.add(r0.object);const R=r0.uniforms,K=r0.anchors;R.uTime={value:0},R.uTravel={value:h(0,0,-1)},R.uLife={value:1},R.uRainOn={value:0},await t.yield();const l0=Kt(15),F0=l0.pts.map(d=>[d.x,p0+T0,d.z]);for(const d of K.ride)F0.push(d.p);for(let d=-20;d>-L0+5;d-=20)F0.push([14*(1-n0(40,350,-d)),X+T0,d]);F0.push([0,X+T0,-L0]);const t0=Nt(F0,{samples:900}),d0=t0.length;await t.yield();const M0=$t(y,W,R,s.fork("sky"),g);E.add(M0),await t.yield(),E.add(Qt(R,l0,M,i==="night")),await t.yield();const v0=Jt(l0,t.noise);await t.yield(),E.add(Yt(R,v0)),await t.yield();const b0=J0(R);Xt(b0,l0,E,R),te(b0,l0),ee(b0),await t.yield();const y0=h(0,0,0),X0=h(0,0,0),l=ae(b0,v0.point(1112,v0.nL+5,h(0,0,0)).clone()),P=s.fork("agave");for(let d=u0+12;d<1010;d+=P.range(2.5,6.5)/a){const u=P.chance(.72),V=u?v0.nL+P.int(2,5):P.int(3,5),S=P();v0.point(d,V,y0),v0.point(d,V+1,X0),y0.lerp(X0,S);const O=l0.at(d);oe(b0,y0,{x:O.tx,z:O.tz},P.range(.8,1.9),0)}const C=b0.build();E.add(C,jt(R,C)),await t.yield();const j=J0(R,{pre:se,xform:ne}),Z=[],I=s.fork("palms");let Q=0;for(let d=u0+16;d<$-O0+50;d+=12.5/a){const u=l0.at(d),V=Math.cos(u.psi),S=Math.sin(u.psi),O=-9.7+I.range(-.5,.5),_=I.range(.8,2.6);Wt(j,Z,h(u.x+V*O,p0-.12,u.z+S*O),I.range(9,14),{x:-V*_+u.tx*I.range(-1,1),z:-S*_+u.tz*I.range(-1,1)},Q++,I,1,0),Q%12===0&&await t.yield()}Q=0;for(let d=-34;d>-L0+14;d-=h0/(2*a)){for(const u of[-1,1])Wt(j,Z,h(u*15.4,X,d+I.range(-1,1)),I.range(9,13),{x:u*I.range(.4,1.8),z:I.range(-1,1)},Q,I,0,1);Q++,Q%8===0&&await t.yield()}const g0=j.build({aQ:{array:new Float32Array(Z),size:4}});E.add(g0),await t.yield();let T=null;if(i==="night"){const d=J0(R,{pre:"uniform vec3 uEye; uniform float uRainOn;",xform:`{
          vec3 box = vec3(150.0, 70.0, 220.0);
          float t = floor(uBeat * 4.0) * 0.25 + 0.25 * smoothstep(0.0, 0.7, fract(uBeat * 4.0));
          vec3 p = aA * box; p.y -= t * 46.0; p.x += t * 14.0;
          p = mod(p - uEye + box * 0.5, box) - box * 0.5 + uEye;
          A = p; B = p + vec3(0.42, -1.4, 0.0) * (0.8 + aA.x);
          gMul = uRainOn;
        }`}),u=s.fork("rain"),V=Math.round(800*a*c);for(let S=0;S<V;S++){const O=h(u(),u(),u());d.add(O,O,.05,0,-1,.5)}E.add(d.build())}else if(i==="dawn"){const d=J0(R),u=s.fork("mist");for(const V of[9,19,30,43,55])for(let S=0;S<13;S++){const O=u.range(-1100,1100),_=u.range(60,1e3),q0=u.range(140,520),J=V+u.range(-1.6,1.6);d.add(h(O-q0,J,_),h(O+q0,J,_+u.range(-20,20)),.45,3,-1,u.range(.1,.24))}T=d.build(),E.add(T)}await t.yield();const q=Lt(R,1500);E.add(q.mesh);const i0=b==="convertible"?re():b==="coach"?ie():le(),z0=x?fe():ce(),U=[];for(const d of i0.segs)if(d[7]===2){const u=(d[0]+d[3])/2;U.push([u,d[1],d[2],u,d[1],d[2]-3.2,.1,2,.4],[u,d[1],d[2]-3.2,u,d[1],d[2]-6.4,.1,2,.2])}const c0=[0,0,0,0,0,0,.08,0,1.1],D0=s.fork("boats"),a0=[];for(let d=0;d<12;d++){const u=d<8;a0.push({x:u?-D0.range(70,760):D0.range(70,430),z:D0.range(140,980),v:D0.range(2.5,6)*D0.sign(),ph:D0.range(0,6)})}const f0=s.fork("gulls"),Z0=[],st=l0.at(420),Gt=[h(st.x-Math.cos(st.psi)*150,52,st.z-Math.sin(st.psi)*150),h(-190,44,560),h(-120,50,-330)];for(let d=0;d<48;d++)Z0.push({c:Gt[d<22?0:d<36?1:2],r:f0.range(25,95),w:f0.range(.12,.3)*f0.sign(),ph:f0.range(0,6.28),h:f0.range(-18,22),span:f0.range(2.2,3.4)});await t.yield();const nt=ue(R,y.palette);L.add(nt.group);const ht=new p.Mesh(new p.PlaneGeometry(2,2),new p.ShaderMaterial({depthTest:!1,depthWrite:!1,transparent:!0,fog:!1,blending:p.CustomBlending,blendEquation:p.AddEquation,blendSrc:p.ZeroFactor,blendDst:p.SrcColorFactor,vertexShader:"void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",fragmentShader:"void main() { float l = mod(floor(gl_FragCoord.y), 3.0) < 1.0 ? 0.88 : 1.0; gl_FragColor = vec4(vec3(l), 1.0); }"}));ht.renderOrder=30,ht.frustumCulled=!1,L.add(ht),await t.yield();const R0=h(0,0,0),tt=h(0,0,-1),ut=h(0,1,0),G0=h(0,1,0),V0=h(0,0,0),m0=h(0,0,0),A0=h(0,0,0),w0=h(0,0,0),E0=h(0,0,0),rt=h(0,0,0),dt=new p.Quaternion,it=h(0,1,0),e0=Rt(),H=Rt(),pt={p:h(0,0,0),up:h(0,1,0),tangent:h(0,0,-1),axis:h(0,0,0),roll:0},Et=d0/40,_t=.09;let mt=-1,wt=0;const vt=ot-.5,gt=ot+S0/h0-.6,lt=4,Tt=b==="rival"?.275:.25,et=Tt*d0,ct=[[0,.45],[u0/d0,.3],[.18,.3],[.22,.5],[.31,.55],[.375,1],[.46,.8],[.6,.78],[.7,.9],[1,.92]],Vt=d=>{for(let u=1;u<ct.length;u++)if(d<=ct[u][0]){const V=ct[u-1],S=ct[u];return Y(V[1],S[1],n0(V[0],S[0],d))}return .9},ft=(d,u)=>(t0.posAtDist(d,u.o),t0.tangentAtDist(d,u.f),d>$-2&&u.o.z>0&&u.o.z<S0?u.u.copy(K.frameInto(S0-u.o.z,pt).up):u.u.set(0,1,0),u.r.crossVectors(u.f,u.u).normalize(),u),xt=(d,u,V,S,O,_,q0=0)=>{V0.crossVectors(u,V).normalize();const J=V0,o0=S*.5;for(let B0=0;B0<3;B0++){const P0=Math.sin(O-B0*.85),k0=B0===0?_:_*(B0===1?.4:.2),C0=-q0*B0,U0=S*(.16+.2*P0),H0=S*(.06+.42*P0),K0=d.x+u.x*C0,I0=d.y+u.y*C0,N0=d.z+u.z*C0;for(let x0=-1;x0<=1;x0+=2){const D=K0+J.x*o0*x0+V.x*U0,z=I0+J.y*o0*x0+V.y*U0,B=N0+J.z*o0*x0+V.z*U0;q.seg(K0,I0,N0,D,z,B,.1*S,0,k0),q.seg(D,z,B,K0+J.x*S*x0+V.x*H0,I0+J.y*S*x0+V.y*H0,N0+J.z*S*x0+V.z*H0,.08*S,0,k0)}}};function zt(d,u,V,S){const O=S>0,_=S*d0,q0=Math.abs(S-Math.max(mt,0))>.05;O&&Math.abs(S-mt)<1e-9?wt+=d:wt=0,mt=S;const J=O?_/h0:u*2,o0=J+wt*2;if(R0.setFromMatrixPosition(V.matrixWorld),tt.set(0,0,-1).transformDirection(V.matrixWorld),ut.set(0,1,0).transformDirection(V.matrixWorld),E.quaternion.identity(),E.position.set(0,0,0),O){if(_>$-2&&R0.z>0&&R0.z<S0)G0.copy(K.frameInto(S0-R0.z,pt).up);else{t0.tangentAtDist(_-12,m0),t0.tangentAtDist(_+22,A0);const D=-Math.asin(at(m0.z*A0.x-m0.x*A0.z,-1,1))/34,z=.63*Math.tanh(D*Y0*1.6);t0.tangentAtDist(_,m0),V0.crossVectors(m0,it).normalize(),G0.copy(it).multiplyScalar(Math.cos(z)).addScaledVector(V0,Math.sin(z))}if(G0.addScaledVector(tt,-G0.dot(tt)),G0.lengthSq()>1e-6){G0.normalize();const D=Math.atan2(V0.crossVectors(G0,ut).dot(tt),G0.dot(ut));dt.setFromAxisAngle(tt,D),E.quaternion.copy(dt),E.position.copy(R0).sub(w0.copy(R0).applyQuaternion(dt))}}E.updateMatrixWorld(!0),M0.position.copy(R0);const B0=F?1-n0(47.6,48.4,J)*(1-n0(56,56.7,J)):1;r0.setBeat(o0),r0.setEnergy(B0);let P0=m[0],k0=m[0],C0=0;J>=gt+lt?P0=k0=m[2]:J>=gt?(P0=m[1],k0=m[2],C0=(J-gt)/lt):J>=vt+lt?P0=k0=m[1]:J>=vt&&(P0=m[0],k0=m[1],C0=(J-vt)/lt),r0.setKey(P0,k0,P0===k0?1e9:R0.z+25-C0*C0*3400),R.uSplit.value=Y(P0===2?1:0,k0===2?1:0,n0(.1,.8,C0)),R.uTime.value=u,R.uLife.value=B0,R.uRainOn.value=O?n0((u0-10)/d0,(u0+40)/d0,S):0,M0.material.uniforms.uTime.value=u,O?(t0.tangentAtDist(_,R.uTravel.value),R.uVel.value.copy(R.uTravel.value).multiplyScalar(Et*_t*n0(0,.012,S))):R.uVel.value.set(0,0,0),r0.update(d,u,V),T&&(T.position.x=Math.sin(u*.05)*60),q.begin();const U0=o0*Math.PI*.5,H0=Math.cos(U0),K0=Math.sin(U0);if(q.seg(l.x,l.y,l.z,l.x+H0*520,l.y-6,l.z+K0*520,1.3,0,1.2),q.seg(l.x,l.y,l.z,l.x-H0*70,l.y,l.z-K0*70,.9,0,.5),O){const D=.7*(1-.7*n0(.8,.9,S));ft(_+5,e0),w0.copy(e0.o).addScaledVector(e0.u,.07-T0),m0.copy(e0.r),ft(_+20,e0),E0.copy(e0.o).addScaledVector(e0.u,.07-T0),A0.copy(e0.r),ft(_+36,e0),rt.copy(e0.o).addScaledVector(e0.u,.07-T0);for(let z=-2;z<=2;z++){const B=z*.22,k=z*.95,s0=z*1.75;q.seg(w0.x+m0.x*B,w0.y+m0.y*B,w0.z+m0.z*B,E0.x+A0.x*k,E0.y+A0.y*k,E0.z+A0.z*k,.1,2,1.5),q.seg(E0.x+A0.x*k,E0.y+A0.y*k,E0.z+A0.z*k,rt.x+e0.r.x*s0,rt.y+e0.r.y*s0,rt.z+e0.r.z*s0,.1,2,D)}}let I0=0;{let D=et+(_-et)*.6,z=i0.lat;if(b==="rival"){const B=30+14*Math.sin(_*.011),k=n0(et-260,et+40,_);D=_+Y(B,-(_-et)*.4-2,k),z=2.3+1.1*Math.sin(_*.019)*(1-k)}if(I0=_-D,D>u0-60&&D<$-8&&I0<60){const B=l0.at(D);if(H.r.set(Math.cos(B.psi),0,Math.sin(B.psi)),H.u.set(0,1,0),H.f.set(B.tx,0,B.tz),b==="rival"){const k=.6*Math.tanh(B.k*Y0*1.6);H.u.set(H.r.x*Math.sin(k),Math.cos(k),H.r.z*Math.sin(k)),H.r.crossVectors(H.f,H.u)}H.o.set(B.x+Math.cos(B.psi)*z,p0,B.z+Math.sin(B.psi)*z);for(let k=0;k<i0.segs.length;k++)q.put(H,i0.segs[k]);for(let k=0;k<U.length;k++)q.put(H,U[k]);if(i0.scarf){const k=i0.scarf;for(let s0=0;s0<3;s0++){const W0=u-s0*.07;let $0=k[0],Q0=k[1],At=k[2];c0[8]=s0===0?1.1:s0===1?.45:.22;for(let _0=1;_0<=8;_0++){const Bt=k[0]+Math.sin(W0*11-_0*.9)*.05*_0,Pt=k[1]+Math.cos(W0*9-_0*.8)*.045*_0+.02*_0,kt=k[2]-.5*_0;c0[0]=$0,c0[1]=Q0,c0[2]=At,c0[3]=Bt,c0[4]=Pt,c0[5]=kt,q.put(H,c0),$0=Bt,Q0=Pt,At=kt}}}}}if(x){const D=-900+u*5%420,z=610;H.o.set(D,.25*(K.seaLine(D,z,o0)-z-o0*1.5),z),H.r.set(1,0,0),H.u.set(0,1,0),H.f.set(0,0,1);for(let B=0;B<z0.length;B++)q.put(H,z0[B])}else for(let D=0;D<a0.length;D++){const z=a0[D],B=z.x+Math.sin(u*.02*z.v+z.ph)*90,k=z.z,s0=.45*(K.seaLine(B,k,o0)-k-o0*1.5),W0=.1*Math.sin(o0*.8+z.ph)+s0*.03,$0=Math.cos(u*.02*z.v+z.ph)*z.v>=0?1:-1;H.o.set(B,s0,k),H.r.set($0,0,0),H.u.set(0,Math.cos(W0),Math.sin(W0)),H.f.set(0,-Math.sin(W0),Math.cos(W0));for(let Q0=0;Q0<z0.length;Q0++)q.put(H,z0[Q0])}const N0=.45+.55*B0,x0=Math.PI*2;if(O&&S>.1&&S<.31){const D=n0(.235,.3,S),z=1-n0(.105,.15,S);for(let B=0;B<12;B++){ft(_+7+B*3.3+70*z+40*D,e0);const k=-(10.5+B%4*1.8)-95*D*D*(1+.1*B),s0=-.5+B%3*1.1+.4*Math.sin(u*1.7+B)-48*D*D;w0.copy(e0.o).addScaledVector(e0.r,k),w0.y+=s0,xt(w0,e0.f,it,1.5,x0*o0+B*.5,.95*N0)}}if(O&&_>$-450&&_<$+S0+200){const D=_-$+58+26*Math.sin(o0*.2);for(let z=0;z<20;z++){const B=Math.max(4+z*3,D+z*5.5),k=K.frameInto(Math.min(B,S0),pt),s0=Math.max(0,B-S0);V0.crossVectors(k.tangent,k.up).normalize();const W0=(z%2*2-1)*Math.ceil(z/2)*1.25,$0=2.2+.9*Math.sin(z*1.3+u*1.4)+s0*.3;w0.copy(k.axis).addScaledVector(V0,W0).addScaledVector(k.up,$0),w0.z-=s0,m0.copy(k.tangent),xt(w0,m0,E0.copy(k.up),1.7,x0*o0+z*.35,.9*N0)}}for(let D=0;D<Z0.length;D++){const z=Z0[D],B=z.ph+u*z.w;w0.set(z.c.x+Math.cos(B)*z.r,z.c.y+z.h+Math.sin(B*2+D)*4,z.c.z+Math.sin(B)*z.r),m0.set(-Math.sin(B)*Math.sign(z.w),0,Math.cos(B)*Math.sign(z.w)),xt(w0,m0,it,z.span,x0*o0+D*.7,.8*N0,Math.abs(z.w)*z.r*.08)}q.end(),nt.mU.uCar.value.set(I0>1&&I0<230?I0:0,i0.tail),nt.update(d,V,o0,u,O?Vt(S)+.03*Math.sin(o0*Math.PI):.45,1,O?n0(0,.012,S):0,q0)}return zt(0,0,{matrixWorld:t0.frameAt(0)},0),nt.mU.uA.value.lerp(R.uInkA2.value,.08),{scene:L,path:t0,duration:40,title:i==="night"?"Corniche at 120 BPM, after midnight":i==="dawn"?"Corniche at 120 BPM, first light":"Corniche at 120 BPM",ride:"none",style:"none",companion:"none",camera:{fov:78,near:.3,far:6e3,lookAhead:45,sway:0,bank:0},pois:[{at:[0,70,300],from:.24,to:.385,weight:.3}],portal:{shape:"circle",radius:7,color:"#fff2ff",glow:1,revealDistance:1200},post:{exposure:y.exposure,bloom:{strength:.38,radius:.5,threshold:.9},grade:{saturation:1.12,contrast:1.06,tint:y.tint,shadowTint:y.shadow,vignette:.38,grain:.02,aberration:0}},update:zt,dispose(){r0.dispose()}}}};export{we as default};
