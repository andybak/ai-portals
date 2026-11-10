import*as e from"three";import{makePath as Et}from"../kit/core.js";import{buildHero as Vt,buildDressing as Lt,buildCountry as Ht,routePoints as It,makeNearest as qt,planAt as Be,CLOUD_GLSL as mt,CAST_GLSL as Ut,GAP as Xe,DIAMOND as jt,BACK as vt}from"../parts/the-same-minute.js";const Ne=`
uniform vec3 uFogColor; uniform float uFogDensity;
vec3 withFog(vec3 c, float d) { float f = 1.0 - exp(-uFogDensity * uFogDensity * d * d); return mix(c, uFogColor, clamp(f, 0.0, 1.0)); }`,pt=`
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uSkyCol; uniform vec3 uGndCol; uniform vec3 uShadowTone;
vec3 lightOn(vec3 n) { return uSunCol * max(dot(n, uSunDir), 0.0) + mix(uGndCol, uSkyCol, 0.5 + 0.5 * n.y); }`;var Qt={id:"the-same-minute",name:"The Same Minute",category:"bizarre",weirdness:.6,media:["rail","open"],async build(f){const I=f.rng,ce=f.vary||{},he=(f.quality||{detail:1}).detail??1,wt=I(),yt=I(),gt=I(),c=ce.hour==="golden"?!0:ce.hour==="day"||ce.hour==="dawn"?!1:wt<.36,C=yt<.5?1:-1,V=gt<.34,xt=!!ce.rare,S={turf:c?"#8FA63C":"#5FA044",tip:c?"#B2C862":"#9CCB66",deep:c?"#4F8638":"#3F8A42",straw:c?"#B6BC68":"#A8C06C",chalk:V?"#E4E2D8":"#F4F1E6",chalkMean:V?"#DBD9CF":"#EDEAE0",cream:"#F2E6C8",roof:"#E3D3A8",brass:"#B88A3A",red:"#E0241B",white:"#F4F1E6",steam:c?"#FFF4E2":"#FFFFFF",steamShade:c?"#C9B9A8":"#B9CBD6",sea:c?"#3F7396":"#3F82AE",haze:c?"#EFDDBE":"#C9DDE6",zenith:c?"#3E74BC":"#3C7FCC"},D=new e.Scene,Re=new e.Color(S.haze),Ye=.0015;D.fog=new e.FogExp2(Re,Ye);const Y=(c?16:30)*Math.PI/180,Pe=c?new e.Vector2(.995,.02):new e.Vector2(.99,-.12);Pe.normalize();const fe=new e.Vector3(Pe.x*Math.cos(Y)*C,Math.sin(Y),Pe.y*Math.cos(Y)),Je=new e.Color(c?"#FFB872":"#FFF0D2"),et=c?3.9:3.3,We=new e.DirectionalLight(Je,et);We.position.copy(fe).multiplyScalar(100),D.add(We,We.target);const Ge=c?.92:1.1,bt=new e.HemisphereLight(c?"#A9C2E0":"#9CC7E8",c?"#9CA860":"#7FA85A",Ge);D.add(bt);const $={uSunDir:{value:fe},uSunCol:{value:Je.clone().multiplyScalar(et/Math.PI)},uSkyCol:{value:new e.Color("#9CC7E8").multiplyScalar(Ge*.85/Math.PI)},uGndCol:{value:new e.Color(c?"#9CA860":"#7FA85A").multiplyScalar(Ge*.85/Math.PI)},uShadowTone:{value:new e.Color("#2F5F4A")}},de={uCars:{value:[0,1,2,3].map(()=>new e.Vector4(0,-999,0,0))},uStill:{value:[new e.Vector4(0,0,1,0),new e.Vector4(0,0,1,0)]},uCast:{value:new e.Vector4(-fe.x/Math.cos(Y),-fe.z/Math.cos(Y),c?4.4:1/Math.tan(Y),1)},uGate:{value:new e.Vector4(0,9999,0,9999)},uGatePost:{value:new e.Vector4(0,9999,0,9999)}},J={uFogColor:{value:Re},uFogDensity:{value:Ye}},q={value:0},Ee=Et(It(C));await f.yield();const Mt=qt(C),L={x:0,z:jt.knollZ,h:8.5,r:16},H=[[-520,30],[-420,62],[-330,88],[-250,99],[-131,84.5],[0,45.2],[150,24],[200,19.4],[332,6.5],[400,6.5]],Ct=t=>{t=Math.max(-519,Math.min(399,t));let o=0;for(;o<H.length-2&&t>H[o+1][0];)o++;const a=H[o],i=H[o+1],s=(t-a[0])/(i[0]-a[0]),l=o>0?(i[1]-H[o-1][1])/(i[0]-H[o-1][0]):(i[1]-a[1])/(i[0]-a[0]),n=o<H.length-2?(H[o+2][1]-a[1])/(H[o+2][0]-a[0]):(i[1]-a[1])/(i[0]-a[0]),r=i[0]-a[0],u=s*s,y=u*s;return(2*y-3*u+1)*a[1]+(y-2*u+s)*r*l+(-2*y+3*u)*i[1]+(y-u)*r*n},be=(t,o,a)=>{const i=Math.max(0,Math.min(1,(a-t)/(o-t)));return i*i*(3-2*i)};let tt=99;const Me=(t,o)=>{let a=Ct(o)-11e-5*t*t+1.6*f.noise.fbm2(t*.006+7,o*.006,3);const i=Math.hypot(t-L.x,o-L.z);a+=L.h*Math.exp(-(i*i)/(2*L.r*L.r));const s=Mt(t,o);tt=s.dist;const l=be(26,150,s.dist)*(1-.6*be(150,300,o)),n=t+.22*o+26*Math.sin(o*.011+1);a+=l*(7.5*Math.sin(n*.0262+.6)*(.75+.25*Math.sin(o*.009+2))+3.2*Math.sin(n*.057+o*.012+2.4)+2.2*f.noise.fbm2(t*.017+3,o*.017+9,2)),a=a+(Math.min(s.y,s.low)-.42-a)*(1-be(5.5,36,s.dist)),a=Math.max(a,4.5);const r=Math.min(332-o,372-Math.abs(t));return-7+(a+7)*be(-3,9,r)};await f.yield();const ee=256,me=new Uint8Array(ee*ee*4),Ve=I.fork("noise");for(let t=0;t<ee*ee;t++)me[t*4]=Ve()*255|0,me[t*4+1]=Ve()*255|0,me[t*4+2]=Ve()*255|0,me[t*4+3]=255,t%4096===0&&await f.yield();const R=new e.DataTexture(me,ee,ee,e.RGBAFormat,e.UnsignedByteType);R.wrapS=R.wrapT=e.RepeatWrapping,R.magFilter=e.LinearFilter,R.minFilter=e.LinearMipmapLinearFilter,R.generateMipmaps=!0,R.anisotropy=8,R.needsUpdate=!0;const h=160,x=180,P=-400,Le=400,W=-330,ot=345,z=new Float32Array((h+1)*(x+1)),te=new Float32Array((h+1)*(x+1)),Ce=new Float32Array((h+1)*(x+1)*3),Z=new Float32Array((h+1)*(x+1)*3),ve=new Float32Array((h+1)*(x+1));for(let t=0;t<=x;t++){const o=W+(ot-W)*t/x;for(let a=0;a<=h;a++){const i=P+(Le-P)*a/h,s=t*(h+1)+a,l=Me(i,o);z[s]=l,te[s]=tt,Ce[s*3]=i,Ce[s*3+1]=l,Ce[s*3+2]=o}await f.yield()}const oe=(Le-P)/h,ae=(ot-W)/x,O=new Uint32Array(h*x*6);for(let t=0;t<=x;t++){for(let o=0;o<=h;o++){const a=t*(h+1)+o,i=z[t*(h+1)+Math.max(o-1,0)],s=z[t*(h+1)+Math.min(o+1,h)],l=z[Math.max(t-1,0)*(h+1)+o],n=z[Math.min(t+1,x)*(h+1)+o],r=-(s-i)/(2*oe),u=-(n-l)/(2*ae),y=Math.hypot(r,1,u);Z[a*3]=r/y,Z[a*3+1]=1/y,Z[a*3+2]=u/y;const d=4,G=z[t*(h+1)+Math.max(o-d,0)]+z[t*(h+1)+Math.min(o+d,h)]+z[Math.max(t-d,0)*(h+1)+o]+z[Math.min(t+d,x)*(h+1)+o];if(ve[a]=Math.max(-1,Math.min(1,(G-4*z[a])/3.2)),o<h&&t<x){const v=(t*h+o)*6,m=a,T=a+1,A=a+h+1,g=a+h+2;O[v]=m,O[v+1]=A,O[v+2]=T,O[v+3]=T,O[v+4]=A,O[v+5]=g}}t%12===11&&await f.yield()}const U=new e.BufferGeometry;U.setAttribute("position",new e.BufferAttribute(Ce,3)),U.setAttribute("normal",new e.BufferAttribute(Z,3)),U.setIndex(new e.BufferAttribute(O,1)),U.setAttribute("aRail",new e.BufferAttribute(te,1)),U.setAttribute("aHollow",new e.BufferAttribute(ve,1));const Ae=Be(840,C),at=Be(839,C),ne={x:Ae.x-at.x,z:Ae.z-at.z},ke=1,nt={...$,...J,...de,uTime:q,uNoise:{value:R},uTurf:{value:new e.Color(S.turf).multiplyScalar(ke)},uTip:{value:new e.Color(S.tip).multiplyScalar(ke)},uDeep:{value:new e.Color(S.deep).multiplyScalar(ke)},uStraw:{value:new e.Color(S.straw).multiplyScalar(ke)},uWind:{value:V?1.5:1},uWet:{value:V?1:0},uRelief:{value:2.4},uShade:{value:new e.Color(c?"#A0DCD6":"#E0F0E6")},uAmb:{value:c?1.3:1.25},uDesat:{value:c?.1:.12},uWrap:{value:c?.22:.02},uRing:{value:new e.Vector4(Ae.x,Ae.z,ne.x,ne.z)},uHand:{value:C},uSilver:{value:new e.Color(c?"#D8D890":"#BFE28C")},uSheen:{value:c?.18:.13},uLift:{value:new e.Color(.06,.05,.07).multiplyScalar(c?.62:.6)},uKeyWhite:{value:c?.62:0}},rt=`
      ${Ne}
      ${pt}
      ${mt}
      ${Ut}
      uniform sampler2D uNoise; uniform vec3 uTurf; uniform vec3 uTip; uniform vec3 uDeep; uniform vec3 uStraw; uniform vec3 uShade; uniform vec3 uSilver;
      uniform float uTime; uniform float uWind; uniform float uWet; uniform float uRelief; uniform float uAmb; uniform float uDesat; uniform float uWrap; uniform float uHand; uniform float uSheen; uniform vec3 uLift; uniform float uKeyWhite; uniform vec4 uRing;
      // silver gusts running through the tips (long across the slope, short along it)
      float windBand(vec2 p) {
        float g1 = textureLod(uNoise, vec2(p.x * 0.00035 + 0.3, p.y * 0.0011 + uTime * 0.0105 * uWind), 0.0).g;
        float g2 = textureLod(uNoise, vec2(p.x * 0.0009, p.y * 0.0029 + uTime * 0.021 * uWind) + 0.5, 0.0).b;
        return smoothstep(0.44, 0.72, g1) * 0.75 + smoothstep(0.50, 0.80, g2) * 0.5;
      }
      // the broad colour of the down: pale dry crests, deep green hollows, sheep-cropped patches and long drifts
      vec3 swardBase(vec2 p, float hollow, out float lush) {
        float patch1 = textureLod(uNoise, p * 0.0031 + 0.2, 0.0).g, patch2 = textureLod(uNoise, p * 0.00115, 0.0).b, drift = textureLod(uNoise, p * vec2(0.00042, 0.00027) + 0.5, 0.0).r;
        lush = clamp(0.5 + (patch1 - 0.5) * 0.7 + (patch2 - 0.5) * 1.3 + (drift - 0.5) * 1.0 + hollow * 0.45, 0.0, 1.0);
        vec3 c = mix(mix(uTurf, uStraw, 0.55), uTurf, smoothstep(0.08, 0.46, lush));
        c = mix(c, uDeep, smoothstep(0.52, 0.95, lush));
        return mix(c, vec3(dot(c, vec3(0.3, 0.55, 0.15))) * vec3(1.04, 1.0, 0.86), uDesat) * (1.0 - 0.12 * uWet);
      }
      // light on the sward: the key on a relief-steepened normal (a painter's modelling of the hill), cloud and cast
      // shadow taken out of the key only, and a cool blue-green fill that owns the shade. sun is how much key arrives.
      vec3 swardLight(vec3 n, vec3 micro, vec3 w, float hollow, out float sun, out vec3 sheen) {
        // only the shape of the hill is steepened; tussocks and blades tip the normal by their true amount (or a lee slope breaks into blotches)
        vec3 ne = normalize(normalize(vec3(n.x * uRelief, max(n.y, 0.05), n.z * uRelief)) + micro);
        float ndl = clamp(dot(ne, uSunDir) * 1.25 + uWrap, 0.0, 1.0);
        vec2 rq = w.xz - uRing.xy; float along = dot(rq, uRing.zw), across = dot(rq, vec2(-uRing.w, uRing.z));
        // a still pool of cloud shade lies on the turf behind the ring, so the ring glows against something darker than itself.
        // It is lopsided: it stops short of the first metres of the entry leg, which cross behind the ring 50 m off.
        float acm = across * uHand;
        float pool = smoothstep(-10.0, 14.0, along) * (1.0 - smoothstep(120.0, 220.0, along)) * smoothstep(-12.0, 6.0, acm) * (1.0 - smoothstep(55.0, 95.0, acm));
        float cs = max(cloudShade(w.xz, uTime), pool * 0.95);
        float cst = castShade(w);
        sun = ndl * (1.0 - 0.84 * cs) * (1.0 - 0.96 * cst);
        vec3 amb = mix(uGndCol, uSkyCol, 0.5 + 0.5 * ne.y) * uAmb * (1.0 - 0.32 * clamp(hollow, 0.0, 1.0)) * (1.0 - 0.10 * cs) * (1.0 - 0.30 * cst);
        float shadeK = 1.0 - smoothstep(0.0, 0.55, sun);
        // waxy blades carry the sky, and shade is lifted toward the brief's blue-green #2F5F4A: never black, never a dead teal
        sheen = uSkyCol * (0.02 + uSheen * shadeK) + uLift * shadeK;
        vec3 keyC = mix(uSunCol, vec3(dot(uSunCol, vec3(0.3, 0.5, 0.2))), uKeyWhite);   // grass answers a gold key with gold-green, not mustard
        return keyC * sun + amb * mix(vec3(1.0), uShade, shadeK);
      }`,At=new e.ShaderMaterial({uniforms:{...nt,uChalk:{value:new e.Color(S.chalk).multiplyScalar(.8)}},vertexShader:`
        attribute float aRail; attribute float aHollow;
        varying vec3 vW; varying vec3 vN; varying float vDist; varying float vRail; varying float vHollow;
        void main() { vW = position; vN = normal; vRail = aRail; vHollow = aHollow; vec4 mv = viewMatrix * vec4(position, 1.0); vDist = length(mv.xyz); gl_Position = projectionMatrix * mv; }`,fragmentShader:`
        ${rt}
        uniform vec3 uChalk;
        varying vec3 vW; varying vec3 vN; varying float vDist; varying float vRail; varying float vHollow;
        void main() {
          vec2 p = vW.xz;
          // every scale of detail leaves before it is smaller than a pixel is deep at this grazing angle: fine grain by 40 m,
          // tussocks by 72 m, mottle by 150 m; beyond that the down is broad clean tones (crest, hollow, cloud shadow, gust)
          float close = 1.0 - smoothstep(8.0, 40.0, vDist), near = 1.0 - smoothstep(14.0, 55.0, vDist), mid = 1.0 - smoothstep(30.0, 72.0, vDist), far = 1.0 - smoothstep(60.0, 150.0, vDist);
          float lush; vec3 c = swardBase(p, vHollow, lush);
          float patch1 = texture2D(uNoise, p * 0.0031 + 0.2).g;
          float fine = texture2D(uNoise, p * vec2(0.33, 0.21) + 0.23).g, fine2 = texture2D(uNoise, p * vec2(0.17, 0.29) + 0.71).r;
          float blade = texture2D(uNoise, p * vec2(0.115, 0.071)).r;
          float tuss = texture2D(uNoise, p * vec2(0.027, 0.019) + 0.61).b, tuss2 = texture2D(uNoise, p * 0.0094 + 0.13).r;
          float grain = smoothstep(0.30, 0.70, fine) * 0.55 + smoothstep(0.32, 0.68, fine2) * 0.45;
          float wave = windBand(p) * (1.0 - 0.5 * smoothstep(300.0, 700.0, vDist));
          float tip = clamp(0.30 + (blade - 0.5) * 0.9 * near + (tuss - 0.5) * 0.45 * mid + (tuss2 - 0.5) * 0.3 * far + wave * 0.55 - (lush - 0.5) * 0.3, 0.0, 1.0);
          c = mix(c, uTip, tip * 0.52);
          // under the blades the ground is the dark between their roots; where the blades have sunk away it is the sward's mean
          float under = (1.0 - smoothstep(20.0, 44.0, vDist)) * (1.0 - smoothstep(21.0, 26.0, vRail));
          c *= mix(1.0, 0.62 + 0.62 * grain, close) * (1.0 - 0.16 * under);
          c *= 0.92 + 0.16 * mix(0.5, tuss, mid);
          vec3 micro = vec3((tuss - 0.5) * 0.14 * mid + (blade - 0.5) * 0.22 * near, 0.0, (tuss2 - 0.5) * 0.10 * far + (fine2 - 0.5) * 0.24 * near);
          // the verge: dry pale grass and chalk crumbs beside the bed, where the ballast has spilled
          float verge = 1.0 - smoothstep(2.2, 7.0, vRail + (patch1 - 0.5) * 3.0);
          c = mix(c, uStraw * (0.8 + 0.4 * fine), verge * 0.35);
          float crumb = smoothstep(0.80, 0.86, texture2D(uNoise, p * 0.23 + 0.13).g) * (1.0 - smoothstep(1.6, 5.0, vRail + (tuss - 0.5) * 2.0)) * near;
          c = mix(c, uChalk * 1.05, crumb * 0.9);
          c += uSilver * wave * 0.16;                                                                // the silver of turned blades
          // bare chalk where the down breaks off into the cliff
          float steep = 1.0 - smoothstep(0.55, 0.80, vN.y / max(length(vN), 1e-3));
          c = mix(c, uChalk * (0.80 + 0.35 * patch1) * (0.9 + 0.2 * blade), steep);
          float lip = smoothstep(318.0, 327.0, vW.z + (patch1 - 0.5) * 9.0 + (tuss - 0.5) * 3.0 * mid);
          c = mix(c, uChalk * 1.15, lip * 0.85);                                                     // the lip of the cliff: turf worn back to bright chalk
          float sun; vec3 sheen; vec3 lit = swardLight(normalize(vN), micro, vW, vHollow, sun, sheen);
          gl_FragColor = vec4(withFog(c * lit + sheen * (1.0 - steep), vDist), 1.0);
        }`}),it=new e.Mesh(U,At);it.frustumCulled=!1,D.add(it),await f.yield();const He=(t,o)=>{const a=Math.max(0,Math.min(h-.001,(t-P)/oe)),i=Math.max(0,Math.min(x-.001,(o-W)/ae)),s=Math.floor(a),l=Math.floor(i),n=a-s,r=i-l,u=l*(h+1)+s;return(z[u]*(1-n)+z[u+1]*n)*(1-r)+(z[u+h+1]*(1-n)+z[u+h+2]*n)*r},pe=1600,Ie=1350,st=new Uint8Array(pe*Ie),we={x:0,z:0};for(let t=0;t<=(840+vt)*2;t++){Be(-vt+t*.5,C,we);const o=Math.floor((we.x-P)*2),a=Math.floor((we.z-W)*2);for(let i=-5;i<=5;i++)for(let s=-5;s<=5;s++){const l=o+s,n=a+i;if(l<0||n<0||l>=pe||n>=Ie)continue;const r=P+(l+.5)*.5-we.x,u=W+(n+.5)*.5-we.z;r*r+u*u<5.8&&(st[n*pe+l]=1)}t%400===399&&await f.yield()}const kt=(t,o)=>{const a=Math.floor((t-P)*2),i=Math.floor((o-W)*2);return a<0||i<0||a>=pe||i>=Ie?1:1-st[i*pe+a]};await f.yield();const ye=4,Fe=new Float32Array(ye*9),Se=new Float32Array(ye*9),qe=new Float32Array(ye*6);{const t=I.fork("tuft");for(let o=0;o<ye;o++){const a=o/ye*6.283+t.range(-.4,.4),i=t.range(.02,.09),s=t.range(.1,.42),l=o===0?1:t.range(.6,.95);for(let n=0;n<3;n++){const r=(o*3+n)*3;Fe[r]=Math.cos(a)*i,Fe[r+1]=0,Fe[r+2]=Math.sin(a)*i,Se[r]=Math.cos(a)*s,Se[r+1]=l,Se[r+2]=Math.sin(a)*s,qe[(o*3+n)*2]=n===2?1:0,qe[(o*3+n)*2+1]=n===0?-1:n===1?1:0}}}const Ft=new e.ShaderMaterial({uniforms:{...nt},vertexShader:`
        ${rt}
        attribute vec3 aTip; attribute vec2 aK; attribute vec3 aPos; attribute vec4 aRnd; attribute vec4 aGnd;
        varying vec3 vCol; varying float vDist;
        void main() {
          float yaw = aRnd.x * 6.283, cy = cos(yaw), sy = sin(yaw), t = aK.x;
          vec3 toCam = cameraPosition - aPos; float dist = length(toCam);
          vec2 p = aPos.xz;
          float hollow = aGnd.z;
          float lush; vec3 base = swardBase(p, hollow, lush);
          // long in the lush drifts and hollows, cropped short on the dry crests; one tuft in seven is a tussock
          float sc = (0.50 + 0.75 * aRnd.y * aRnd.y) * (0.80 + 0.5 * lush) * (aRnd.z > 0.86 ? 1.5 : 1.0);
          float f0 = mix(20.0, 34.0, aRnd.w);
          float sink = 1.0 - smoothstep(f0, f0 + 12.0, dist);
          vec3 b = vec3(position.x * cy - position.z * sy, 0.0, position.x * sy + position.z * cy) * sc;
          vec3 tp = vec3(aTip.x * cy - aTip.z * sy, aTip.y * sink, aTip.x * sy + aTip.z * cy) * sc * 0.36;
          float wave = windBand(p);
          float sway = sin(uTime * 2.1 + aRnd.w * 6.283 + p.x * 0.31) * 0.035 + sin(uTime * 3.3 + aRnd.w * 17.0) * 0.015;
          tp.xz += vec2(0.15, -0.8) * (sway + 0.13 * wave) * uWind * sc;         // the gusts lay the tips over, uphill
          vec3 root = aPos + b;
          vec3 wp = root + tp * t;
          vec2 sd = vec2(toCam.z, -toCam.x) / max(length(toCam.xz), 1e-3);
          wp.xz += sd * aK.y * max(0.031 * sc, 0.0017 * dist) * (1.0 - t);
          // colour: the ground's own, dark at the root, pale at the tip (their mean over a blade is the ground's mean, so
          // the sward does not change tone where the blades sink away); the light is the ground's light at the root
          vec3 n = normalize(vec3(aGnd.x * 2.0, 1.0, aGnd.y * 2.0));
          float sun; vec3 sheen; vec3 lit = swardLight(n, vec3(0.0), aPos, hollow, sun, sheen);
          float tone = 0.90 + 0.22 * aRnd.y;
          vec3 tipC = mix(base, mix(uTip, uStraw, 0.10 + 0.25 * aRnd.z), 0.50) * (1.24 + 0.30 * wave) * tone;
          vec3 rootC = base * mix(0.95, 0.66, sink) * tone;
          // A blade that has all but sunk away is a sliver under a pixel tall: with antialiasing its colour is read off the
          // sliver's edge and a root-to-tip gradient runs away to black or white specks. So the gradient sinks with the blade.
          float te = t * smoothstep(0.0, 0.6, sink);
          vCol = mix(rootC, tipC, te) * (lit + uSunCol * sun * 0.14 * te) + sheen * (0.55 + 0.35 * te) + uSilver * wave * 0.16 * te;   // tips take a little light through them
          vec4 mv = viewMatrix * vec4(wp, 1.0); vDist = length(mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        ${Ne}
        varying vec3 vCol; varying float vDist;
        void main() { gl_FragColor = vec4(withFog(clamp(vCol, vec3(0.0), vec3(3.0)), vDist), 1.0); }`,side:e.DoubleSide}),b=16,Ue=24,St=15*he*Math.min(1.15,ce.density||1),lt=[],re=I.fork("grass"),j=(t,o)=>{const a=Math.max(0,Math.min(h-.001,(t-P)/oe)),i=Math.max(0,Math.min(x-.001,(o-W)/ae)),s=Math.floor(a),l=Math.floor(i),n=a-s,r=i-l,u=l*(h+1)+s;return(te[u]*(1-n)+te[u+1]*n)*(1-r)+(te[u+h+1]*(1-n)+te[u+h+2]*n)*r};{const t=Math.round(St*b*b),o=new Float32Array(t*3),a=new Uint8Array(t*4),i=new Int8Array(t*4),s=n=>Math.max(-127,Math.min(127,Math.round(n*127)));let l=0;for(let n=W;n<322;n+=b)for(let r=P;r<Le;r+=b){const u=j(r+b/2,n+b/2);if(u>Ue+b*.75)continue;const y=u<13&&j(r,n)<13&&j(r+b,n)<13&&j(r,n+b)<13&&j(r+b,n+b)<13;let d=0,G=0;for(let T=0;T<t;T++){++l%700===0&&await f.yield();const A=r+re()*b,g=n+re()*b,p=re(),w=re(),M=re(),E=re(),k=y?0:j(A,g),F=k<13?1:k>Ue?0:1-.7*(k-13)/(Ue-13);if(p>F||g>322||!kt(A,g))continue;const X=He(A,g),xe=Math.max(0,Math.min(h-1,Math.floor((A-P)/oe))),K=Math.max(0,Math.min(x-1,Math.floor((g-W)/ae))),le=K*(h+1)+xe;o[d*3]=A,o[d*3+1]=X-.02,o[d*3+2]=g,G+=X,a[d*4]=p*9973%1*255,a[d*4+1]=w*255,a[d*4+2]=M*255,a[d*4+3]=E*255;const ue=Math.max(Z[le*3+1],.2);i[d*4]=s(Z[le*3]/ue/2),i[d*4+1]=s(Z[le*3+2]/ue/2),i[d*4+2]=s(ve[le]),i[d*4+3]=0,d++}if(d<8)continue;await f.yield();const v=new e.InstancedBufferGeometry;v.setAttribute("position",new e.BufferAttribute(Fe,3)),v.setAttribute("aTip",new e.BufferAttribute(Se,3)),v.setAttribute("aK",new e.BufferAttribute(qe,2)),v.setAttribute("aPos",new e.InstancedBufferAttribute(o.slice(0,d*3),3)),v.setAttribute("aRnd",new e.InstancedBufferAttribute(a.slice(0,d*4),4,!0)),v.setAttribute("aGnd",new e.InstancedBufferAttribute(i.slice(0,d*4),4,!0)),v.instanceCount=d;const m=new e.Mesh(v,Ft);m.frustumCulled=!1,D.add(m),lt.push({mesh:m,s:new e.Sphere(new e.Vector3(r+b/2,G/d,n+b/2),b*.75+2)}),await f.yield()}}const Dt=46+b*.75,ut=new e.Frustum,ct=new e.Matrix4;await f.yield();const zt=new e.ShaderMaterial({uniforms:{...$,...J,uTime:q,uNoise:{value:R},uSea:{value:new e.Color(S.sea)},uSkyRef:{value:new e.Color(c?"#7FA2C8":"#7FB2DC").multiplyScalar(.8)}},vertexShader:`varying vec3 vW;
        void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,fragmentShader:`
        ${Ne}
        ${pt}
        ${mt}
        uniform sampler2D uNoise; uniform vec3 uSea; uniform vec3 uSkyRef; uniform float uTime;
        varying vec3 vW;
        void main() {
          if (abs(vW.x) < 364.0 && vW.z < 324.0) discard;                                   // no water under the hill
          vec3 v = cameraPosition - vW; float vDist = length(v); v = v / max(vDist, 1e-3);   // the plane is two huge triangles: distance per fragment
          vec2 p = vW.xz;
          float a = texture2D(uNoise, p * 0.021 + vec2(uTime * 0.011, uTime * 0.006)).r, b = texture2D(uNoise, p * 0.033 - vec2(uTime * 0.008, -uTime * 0.012)).g;
          float swell = texture2D(uNoise, p * vec2(0.0011, 0.0034) + vec2(0.0, uTime * 0.004)).b;
          float lines = smoothstep(0.55, 0.9, texture2D(uNoise, p * vec2(0.0007, 0.0105) + vec2(0.0, -uTime * 0.0035)).r) * (1.0 - smoothstep(200.0, 1200.0, vDist));
          vec3 nw = normalize(vec3((a - 0.5) * 0.10 + (swell - 0.5) * 0.05, 1.0, (b - 0.5) * 0.10));
          vec3 r = reflect(-v, nw);
          float lobe = max(dot(r, uSunDir), 0.0); float l2 = lobe * lobe; float l4 = l2 * l2; float l16 = l4 * l4; l16 = l16 * l16;
          float sparkle = smoothstep(0.42, 0.72, a * b * 2.0);
          float fres = 1.0 - max(v.y, 0.0); fres = fres * fres; fres = fres * fres;
          vec3 c = mix(uSea * (0.52 + 0.16 * swell + 0.12 * lines), uSkyRef, 0.06 + 0.36 * fres);          // a band of deep blue, paler only at the very horizon
          // shallows: over the chalk shelf under the land the water is a pale green-blue, scalloped by the swell, with slow
          // threads of foam near the foot of the cliff; deep blue beyond. (Kept darker than any plume standing before it.)
          float shoreD = max(vW.z - 326.0, abs(vW.x) - 366.0);
          float shelf = 1.0 - smoothstep(18.0, 210.0, shoreD + (swell - 0.5) * 110.0 + (a - 0.5) * 24.0);
          c = mix(c, vec3(0.085, 0.40, 0.43) * (0.82 + 0.36 * b), shelf * 0.66);
          float foam = smoothstep(0.60, 0.80, texture2D(uNoise, vec2(p.x * 0.0037 + shoreD * 0.0009, shoreD * 0.021 - uTime * 0.016)).r) * (1.0 - smoothstep(4.0, 46.0, shoreD));
          c = mix(c, vec3(0.62, 0.74, 0.74), foam * 0.42);
          float l64 = l16 * l16; l64 = l64 * l64;
          c += uSunCol * (0.03 * l16 + 0.22 * l64 + 1.6 * l64 * sparkle + 0.35 * l16 * sparkle * sparkle);  // the slow glitter band under the sun
          c *= 1.0 - 0.30 * cloudShade(p * 0.6 + 300.0, uTime * 0.5);                                   // cloud shadows lie on the water too
          gl_FragColor = vec4(withFog(c, vDist * 0.12), 1.0);
        }`}),je=new e.Mesh(new e.PlaneGeometry(7e3,7e3).rotateX(-Math.PI/2),zt);je.position.set(0,0,300),je.frustumCulled=!1,D.add(je),await f.yield();const Tt=new e.ShaderMaterial({uniforms:{uZenith:{value:new e.Color(S.zenith)},uHaze:{value:Re},uUnder:{value:new e.Color(S.turf).multiplyScalar(.4)},uMid:{value:new e.Color(c?"#6A9CD8":"#64A5E6")},uCirrus:{value:new e.Color(c?"#FFE7C4":"#FFFFFF")},uSunDir:$.uSunDir,uSunCol:$.uSunCol,uNoise:{value:R},uTime:q,uWarm:{value:c?1:0}},vertexShader:"varying vec3 vDir; void main() { vDir = position; gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0); }",fragmentShader:`
        uniform vec3 uZenith; uniform vec3 uHaze; uniform vec3 uUnder; uniform vec3 uMid; uniform vec3 uCirrus; uniform vec3 uSunDir; uniform vec3 uSunCol;
        uniform sampler2D uNoise; uniform float uTime; uniform float uWarm; varying vec3 vDir;
        void main() {
          vec3 d = vDir / max(length(vDir), 1e-3);
          float h = clamp(d.y, 0.0, 1.0);
          float k = 1.0 - h; float k2 = k * k;
          vec3 c = mix(uZenith, uMid, k2 * k * (0.75 + 0.25 * k));  // deep overhead and still blue at fifteen degrees; milky only toward the sea line
          float k8 = k2 * k2; k8 = k8 * k8;
          float k16 = k8 * k8; c = mix(c, uHaze, k16 * k16 * 0.36 + k16 * 0.10);
          c = mix(c, vec3(1.0, 0.75, 0.47) * 0.92, uWarm * (k16 * 0.62 + k8 * 0.16));   // the evening: the low sky is gold, the blue only overhead                        // blue down to six degrees; the haze is the last few
          float s = max(dot(d, uSunDir), 0.0); float s2 = s * s; float s8 = s2 * s2; s8 = s8 * s8;
          c += uSunCol * (0.035 * s2 + 0.10 * s8 * s8);             // the warmth round an unseen sun: no disc
          // mares' tails, very high and very slow: the upper sky is never one flat tone, and nothing here competes with a plume
          vec2 q = d.xz / (h + 0.22);
          float c1 = texture2D(uNoise, q * vec2(0.035, 0.105) + vec2(uTime * 0.0006, 0.31)).r;
          float c2 = texture2D(uNoise, q * vec2(0.011, 0.047) + vec2(0.4, uTime * 0.0004)).g;
          float c3 = texture2D(uNoise, q * vec2(0.12, 0.31) + 0.7).b;
          float cir = smoothstep(0.52, 0.86, c1 * 0.55 + c2 * 0.65 + c3 * 0.12 - 0.08) * smoothstep(0.10, 0.42, h) * (1.0 - 0.6 * smoothstep(0.75, 1.0, h));
          c = mix(c, uCirrus * (0.86 + 0.14 * s2), cir * 0.17);
          // a low bank of cumulus standing along the sea horizon (the seaward half of the sky only): the far layer of every downhill view
          vec2 hq = d.xz / max(length(d.xz), 1e-3);
          float az = hq.x * 1.6;                                    // roughly the bearing, across the seaward half
          float hump = (0.5 + 0.5 * sin(az * 3.1 + 0.7)) * (0.55 + 0.45 * sin(az * 7.3 + 2.0));
          float top = 0.010 + 0.030 * hump + (0.012 * abs(sin(az * 19.0 + 1.3)) + 0.006 * abs(sin(az * 47.0 + 0.4)) + 0.003 * abs(sin(az * 113.0))) * (0.4 + 0.6 * hump);   // heaped, round-topped
          float bank = (1.0 - smoothstep(top - 0.006, top + 0.001, d.y)) * smoothstep(-0.003, 0.012, d.y) * smoothstep(-0.2, 0.3, hq.y);
          vec3 bb = mix(uHaze, uMid, 0.7) * 0.94; vec3 bc = mix(bb, uCirrus, clamp(d.y / max(top, 1e-3), 0.0, 1.0) * 0.6);   // blue-grey under, lit above: dimmer than any plume, darker than chalk
          c = mix(c, bc, bank * 0.75);
          c = mix(c, uUnder, 1.0 - smoothstep(-0.09, -0.035, d.y));
          gl_FragColor = vec4(c, 1.0);
        }`,side:e.BackSide,depthWrite:!1,depthTest:!1,fog:!1}),De=new e.Mesh(new e.SphereGeometry(3e3,32,16),Tt);De.renderOrder=-10,De.frustumCulled=!1,D.add(De);const ge=Math.round(17-12*(1-he)),ie=26,_e=8,B=I.fork("clouds"),Q=new Float32Array(ge*ie*4),ze=new Float32Array(ge*ie*3);for(let t=0;t<ge;t++){let o,a,i,s;if(t<_e){const l=[20,-62,-96,60,-130,-40,-80,-114][t]*C*Math.PI/180+B.range(-.03,.03),n=-.42*C,r=.91,u=B.range(2400,2520);o=(n*Math.cos(l)-r*Math.sin(l))*u,a=(n*Math.sin(l)+r*Math.cos(l))*u,i=B.range(270,310),s=B.range(1.35,1.6)}else{const l=Math.max(ge-_e,1),n=Math.PI*(1.05+.9*(t-_e+B.range(.2,.8))/l),r=B.range(900,1700);o=Math.cos(n)*r,a=Math.sin(n)*r*(Math.sin(n)<0?.8:1),i=B.range(250,400),s=B.range(.8,1.5),a<250&&(i=Math.max(i,40+.5*Math.hypot(o,a-173)))}for(let l=0;l<ie;l++){const n=(t*ie+l)*4,r=B.range(-1,1),u=B()*(1-r*r),y=B.range(-20,20),d=B.range(-50,50),G=l<16?1:.55,v=l<16?u:Math.min(1,u*1.25+.15);Q[n]=o+r*150*s+y,Q[n+1]=i+v*78*s,Q[n+2]=a+d*s,Q[n+3]=(58+46*(1-Math.abs(r)))*s*(1-.35*u)*G;const m=(t*ie+l)*3;ze[m]=.8+.2*v,ze[m+1]=(i-Q[n+1])/Math.max(Q[n+3],1),ze[m+2]=(l*.37+t*.11)%1}}await f.yield();const se=new e.InstancedBufferGeometry;{const t=new e.PlaneGeometry(2,2);se.index=t.index,se.setAttribute("position",t.attributes.position)}se.setAttribute("aPS",new e.InstancedBufferAttribute(Q,4)),se.setAttribute("aTone",new e.InstancedBufferAttribute(ze,3)),se.instanceCount=ge*ie;const ht=new e.Vector3,Bt=new e.ShaderMaterial({uniforms:{...J,uTime:q,uNoise:{value:R},uSunView:{value:ht},uLit:{value:new e.Color(c?"#FFF0DC":"#FFFFFF").multiplyScalar(.95)},uBase:{value:new e.Color(c?"#A9B4CC":"#A3BCD6").multiplyScalar(.85)},uRim:{value:new e.Color(c?"#FFC98A":"#FFF6E2")}},vertexShader:`
        attribute vec4 aPS; attribute vec3 aTone; uniform float uTime;
        varying vec2 vUv; varying vec3 vTone; varying float vDist;
        void main() {
          vUv = position.xy; vTone = aTone;
          vec3 c = aPS.xyz; if (dot(c.xz, c.xz) < 2050.0 * 2050.0) c.x = mod(c.x + 3.0 * uTime + 1800.0, 3600.0) - 1800.0;   // the far heaps over the sea stand still
          vec4 mv = viewMatrix * vec4(c, 1.0);
          mv.xy += position.xy * aPS.w;
          vDist = length(mv.xyz);
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        ${Ne}
        uniform vec3 uLit; uniform vec3 uBase; uniform vec3 uRim; uniform vec3 uSunView; uniform sampler2D uNoise; uniform float uTime;
        varying vec2 vUv; varying vec3 vTone; varying float vDist;
        void main() {
          float r2 = dot(vUv, vUv); if (r2 > 1.0) discard;
          float z = sqrt(max(1.0 - r2, 0.0));
          vec2 nq = vUv * 0.21 + vTone.z * 7.0 + vec2(uTime * 0.002, 0.0);
          float er = texture2D(uNoise, nq).r * 0.6 + texture2D(uNoise, nq * 2.7 + 0.3).g * 0.4;      // a curdled edge, not a disc
          float a = smoothstep(0.0, 0.42, z * z + (er - 0.5) * 0.5) * smoothstep(vTone.y - 0.10, vTone.y + 0.16, vUv.y);   // the flat bottom, at the heap's base
          vec3 n = vec3(vUv, z);
          float key = clamp(dot(n, uSunView) * 0.32 + 0.5, 0.0, 1.0);
          float up = clamp(0.5 + 0.5 * vUv.y, 0.0, 1.0);
          vec3 c = mix(uBase, uLit, clamp(key * 0.55 + up * 0.45 + vTone.x - 0.72 + (er - 0.5) * 0.3, 0.0, 1.0)) * vTone.x;
          c += uRim * 0.10 * key * key * (1.0 - z);
          gl_FragColor = vec4(withFog(c, vDist * 0.20), a * 0.94);
        }`,transparent:!0,depthWrite:!1}),Ke=new e.Mesh(se,Bt);Ke.frustumCulled=!1,Ke.renderOrder=-5,D.add(Ke),await f.yield();const N=new e.Group;{const t=V?-1:1,o=I.fork("thorn"),a=[],i=[],s=[],l=new e.Color,n=new e.Vector3,r=new e.Vector3,u=(p,w,M,E,k)=>{const F=p.index?p.toNonIndexed():p;F.applyMatrix4(w),F.computeVertexNormals();const X=F.attributes.position,xe=F.attributes.normal;for(let K=0;K<X.count;K++){if(n.fromBufferAttribute(X,K),r.fromBufferAttribute(xe,K),k){const ue=f.noise.fbm2(n.x*1.7+n.y*.9,n.z*1.7-n.y*.6,2)*k;n.x+=r.x*ue,n.y+=r.y*ue*.5,n.z+=r.z*ue}const le=Math.max(0,Math.min(1,.5+.5*r.y+(k?f.noise.fbm2(n.x*3.1,n.z*3.1+n.y,2)*.35:0)));l.set(M).lerp(y.set(E),le),k>=.5&&r.y>-.3&&f.noise.fbm2(n.x*4.3+7,n.z*4.3-n.y*2,2)>-.08&&l.lerp(y.set("#fbf8ec"),.9),a.push(n.x,n.y,n.z),s.push(r.x,r.y,r.z),i.push(l.r,l.g,l.b)}F.dispose()},y=new e.Color,d=new e.Matrix4,G=new e.Quaternion,v=new e.Euler,m=(p,w,M,E,k,F,X,xe,K)=>d.compose(new e.Vector3(p,w,M),G.setFromEuler(v.set(E,k,F)),new e.Vector3(X,xe,K)),T=new e.CatmullRomCurve3([new e.Vector3(0,-.3,0),new e.Vector3(.1,.9,.1*t),new e.Vector3(-.08,1.8,.5*t),new e.Vector3(.05,2.5,1.3*t),new e.Vector3(0,3,2.3*t)]);u(new e.TubeGeometry(T,14,.2,7),m(0,0,0,0,0,0,1,1,1),"#2e2a22","#6a5c48",.06),u(new e.CylinderGeometry(.2,.38,.6,7),m(0,0,0,0,0,0,1,1,1),"#2e2a22","#5a4e3c",.08);for(const[p,w,M]of[[1.7,.7,2.3],[2.2,-.8,2],[2.6,.25,2.6]]){const E=new e.CatmullRomCurve3([new e.Vector3(0,p,.5*t),new e.Vector3(w*.6,p+.7,(.5+M*.45)*t),new e.Vector3(w,p+.95,(.5+M)*t)]);u(new e.TubeGeometry(E,8,.085,5),m(0,0,0,0,0,0,1,1,1),"#2e2a22","#6a5c48",.03)}await f.yield();const A=15;for(let p=0;p<A;p++){const w=p/(A-1),M=(1.25-.55*w)*o.range(.8,1.1);u(new e.IcosahedronGeometry(M,2),m(o.range(-.9,.9)*(1-.5*w),3.25+o.range(-.25,.4)+.35*Math.sin(w*3.1),(.6+3.9*w+o.range(-.3,.3))*t,0,o.range(0,3),0,1.15,.6,1.35),c?"#2a4a22":"#1f4f2a",c?"#7f9a3a":"#5f9a3e",.5),p%3===2&&await f.yield()}const g=new e.BufferGeometry;g.setAttribute("position",new e.BufferAttribute(new Float32Array(a),3)),g.setAttribute("normal",new e.BufferAttribute(new Float32Array(s),3)),g.setAttribute("color",new e.BufferAttribute(new Float32Array(i),3)),N.add(new e.Mesh(g,new e.MeshLambertMaterial({vertexColors:!0,emissive:new e.Color(c?"#1c2410":"#12260f")}))),N.position.set(L.x,Me(L.x,L.z)-.1,L.z),N.scale.setScalar(1.45)}D.add(N),de.uStill.value[1].set(N.position.x,N.position.z+(V?-4:4),5,9.1),await f.yield(),await f.yield();{const t=[],o=(m,T,A,g,p)=>{const w=new e.BoxGeometry(m,T,A).toNonIndexed();w.translate(0,p,0);const M=new e.Color(g),E=w.attributes.position.count,k=new Float32Array(E*3);for(let F=0;F<E;F++)k[F*3]=M.r,k[F*3+1]=M.g,k[F*3+2]=M.b;w.setAttribute("color",new e.BufferAttribute(k,3)),t.push(w)};o(.26,1,.26,S.white,.5),o(.27,.18,.27,"#1b1b1b",.72),o(.34,.06,.34,"#6C7A84",1.03);let a=0;for(const m of t)a+=m.attributes.position.count;const i=new Float32Array(a*3),s=new Float32Array(a*3),l=new Float32Array(a*3);let n=0;for(const m of t)i.set(m.attributes.position.array,n),s.set(m.attributes.normal.array,n),l.set(m.attributes.color.array,n),n+=m.attributes.position.count*3,m.dispose();const r=new e.BufferGeometry;r.setAttribute("position",new e.BufferAttribute(i,3)),r.setAttribute("normal",new e.BufferAttribute(s,3)),r.setAttribute("color",new e.BufferAttribute(l,3));const u=9,y=new e.InstancedMesh(r,new e.MeshLambertMaterial({vertexColors:!0,emissive:new e.Color(S.white).multiplyScalar(.12)}),u*2),d=new e.Matrix4,G=new e.Quaternion().setFromAxisAngle(new e.Vector3(0,1,0),Math.atan2(ne.x,ne.z)),v={x:0,z:0};for(let m=0;m<u;m++)for(let T=0;T<2;T++){const A=837-m*6.5,g=T?1:-1,p=1.9-.11*m;Be(A,C,v);const w=v.x-ne.z*7*g,M=v.z+ne.x*7*g;d.compose(new e.Vector3(w,Me(w,M)-.05,M),G,new e.Vector3(1,p,1)),y.setMatrixAt(m*2+T,d)}y.frustumCulled=!1,D.add(y)}await f.yield();const _=await Vt(f,{path:Ee,mirror:C,pal:S,light:$,fog:J,heightAt:Me,wind:V?-1:1,rare:xt,detail:he,time:q,cast:de,chalkGain:c?2.1:1.45,carGlow:c?.42:.3,hutGlow:c?.32:.17});D.add(_.object),await f.yield();const ft=(t,o,a)=>{const i=Math.round((t-P)/oe),s=Math.round((o-W)/ae),l=Math.max(1,Math.round(a/oe)),n=Math.max(1,Math.round(a/ae));for(let r=s-n;r<=s+n;r++)for(let u=i-l;u<=i+l;u++)u>=0&&r>=0&&u<=h&&r<=x&&(ve[r*(h+1)+u]=Math.max(ve[r*(h+1)+u],.85))},$e=await Lt(f,{mirror:C,pal:S,light:$,fog:J,time:q,groundAt:He,latAt:j,castDir:de.uCast.value,detail:he,evening:c,wind:V?-1:1,darken:ft});U.attributes.aHollow.needsUpdate=!0,D.add($e.object),await f.yield();const Ze=await Ht(f,{mirror:C,pal:S,light:$,fog:J,time:q,groundAt:He,latAt:j,castDir:de.uCast.value,detail:he,evening:c,wind:V?-1:1,darken:ft,thorn:N.position});U.attributes.aHollow.needsUpdate=!0,D.add(Ze.object),await f.yield();const Te=N.position.clone().add(new e.Vector3(0,3.5,0)).clone(),Nt=new e.Vector3(8*C,34,70),dt=new e.Vector3,Rt=new e.Vector3,Oe=new e.Vector3,Pt=_.state.hut.clone(),Wt=[{at:(t,o)=>{_.carAt(Xe,Math.min(o,.1905),dt);const a=Math.max(0,Math.min(1,(o-.14)/.04));return dt.lerp(Pt,.7*a*a*(3-2*a))},from:.05,to:.215,weight:.5,fade:.3},{at:(t,o)=>(Ee.pointAt(Math.min(Math.max(o,0),1),Te),Te.set(C>0?N.position.x-4:16.6,Te.y+8,N.position.z+(C>0?0:17.6)),Te),from:.235,to:.375,weight:.8,fade:.3},{at:Nt,from:.355,to:.535,weight:.75,fade:.25},{at:(t,o)=>_.carAt(-Xe,o,Rt),from:.5,to:.66,weight:.8,fade:.2},{at:(t,o)=>(_.carAt(-2*Xe,o,Oe),Oe.y+=9,Oe),from:.7,to:.955,weight:.8,fade:.25}],Qe=new e.Vector3,Gt=new e.Matrix3;return{scene:D,path:Ee,duration:44,pace:()=>1,title:"The Same Minute",camera:{fov:42,near:.3,far:4e3,lookAhead:22,sway:.4,bank:.3},pois:Wt,portal:{shape:"circle",radius:7,color:"#FFF6E0",glow:1},post:{exposure:1,bloom:{strength:.25,radius:.6,threshold:.95},grade:{saturation:1.06,contrast:1.03,vignette:.2,grain:.02}},ride:"none",companion:"none",style:"none",carried:_.carried,update(t,o,a,i){q.value=o,a.getWorldPosition(Qe),De.position.copy(Qe),N.rotation.x=Math.sin(o*1.3)*.012,N.rotation.z=Math.sin(o*.9+1)*.01;const s=a.viewCamera||a;ct.copy(s.matrixWorld).invert().premultiply(s.projectionMatrix),ut.setFromProjectionMatrix(ct);for(const l of lt)l.mesh.visible=l.s.center.distanceTo(Qe)<Dt&&ut.intersectsSphere(l.s);_.update(t,o,a,i),$e.update(o,a),Ze.update(o,a),ht.copy(fe).applyMatrix3(Gt.setFromMatrix4(a.matrixWorld).transpose()).normalize()},dispose(){_.dispose(),$e.dispose(),Ze.dispose()}}}};export{Qt as default};
