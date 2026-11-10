import*as a from"three";import{clamp as xe,lerp as V,smoothstep as Z}from"../kit/core.js";const w=a.Vector3,bt=["#8FD3F0","#2E7D4F","#B9C94A","#6B4A35","#C9922E","#2FA89A","#E8202A"],He=6.4,xt=6.4,de=-6,Pe=`
uniform float uHcTime; uniform vec3 uHcSun; uniform vec3 uHcSunCol; uniform vec3 uHcAbsorb; uniform vec4 uHcHaze;
uniform float uHcCamY; uniform float uHcStrike; uniform vec4 uHcAvoid; uniform float uHcTide;
uniform float uHcForest; uniform float uHcShadeK; uniform float uHcSil; uniform vec2 uHcCoin;
varying vec3 vHcP;
`,Re=Pe+`
float hcHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float hcNoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hcHash(i), hcHash(i + vec3(1,0,0)), f.x), mix(hcHash(i + vec3(0,1,0)), hcHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hcHash(i + vec3(0,0,1)), hcHash(i + vec3(1,0,1)), f.x), mix(hcHash(i + vec3(0,1,1)), hcHash(i + vec3(1,1,1)), f.x), f.y), f.z); }
float hcCaustic(vec2 p, float t){ float c = 0.0; vec2 q = p;
  for (int i = 0; i < 3; i++){ float fi = float(i) + 1.0;
    q += vec2(sin(q.y * 1.7 + t * 0.9 + fi), cos(q.x * 1.5 - t * 0.7 + fi * 2.0)) * 0.6;
    c += abs(sin(q.x * 1.2 + fi) * sin(q.y * 1.2 - fi)); }
  c = 1.0 - c / 3.0; return pow(clamp(c, 0.0, 1.0), 3.0) * 3.0; }
// canopy shade with drifting coins of sunlight, projected along the sun direction
float hcShade(vec3 p){
  float r = length(p.xz);
#ifdef HC_AMT
  float amt = HC_AMT(p);
#else
  // under the Mother Tree's crown, or (in a world that sets uHcForest) under the mangrove tunnel beyond z = uHcForest
  float amt = max((1.0 - smoothstep(11.0, 25.0, r)) * (1.0 - smoothstep(11.0, 17.0, p.y)), (1.0 - smoothstep(7.0, 12.0, p.y)) * smoothstep(uHcForest - 6.0, uHcForest + 6.0, p.z)) * uHcShadeK;
#endif
  vec2 q = p.xz - uHcSun.xz / max(uHcSun.y, 0.2) * p.y;
  float n = hcNoise(vec3(q * 0.42, uHcTime * 0.08)) * 0.65 + hcNoise(vec3(q * 1.1 + 9.0, uHcTime * 0.13)) * 0.35;
  float coin = smoothstep(0.5, 0.64, n);
  return mix(1.0, mix(uHcCoin.x, uHcCoin.y, coin), amt); }
vec3 hcApply(vec3 col, vec3 alb, vec3 p, float vd){
  float sh = hcShade(p);
  col *= sh;
  if (p.y < 0.0){ float d = -p.y;
    float ca = hcCaustic(p.xz * 0.8 + p.y * 0.25, uHcTime * 1.5);
    col += alb * uHcSunCol * ca * 0.3 * exp(-d * 0.1) * sh;
    col *= mix(vec3(1.0), uHcAbsorb, 1.0 - exp(-d * 0.25));
    float pl = uHcCamY < 0.0 ? vd : d * 1.6;
    col = mix(col, uHcHaze.rgb, 1.0 - exp(-pl * uHcHaze.w)); }
  return col; }
`;function ie(p,M,t,d={}){return p.onBeforeCompile=A=>{Object.assign(A.uniforms,M),A.vertexShader=A.vertexShader.replace("#include <common>",`#include <common>
`+Pe+(d.vHead||"")).replace("#include <beginnormal_vertex>",`#include <beginnormal_vertex>
`+(d.vNormal||"")).replace("#include <begin_vertex>",`#include <begin_vertex>
`+(d.vBody||"")+`
vHcP = transformed;`);let N=A.fragmentShader.replace("#include <common>",`#include <common>
`+(d.pre||"")+Re+(d.fHead||"")).replace("#include <color_fragment>",`#include <color_fragment>
`+(d.fColor||"")).replace("#include <opaque_fragment>",(d.fLit||"")+`
outgoingLight = hcApply(outgoingLight, diffuseColor.rgb, vHcP, length(vViewPosition));
#include <opaque_fragment>`);d.sil&&(N=N.replace("#include <fog_fragment>",`
      #ifdef USE_FOG
        #ifdef FOG_EXP2
          float hcFf = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
          float hcSk = mix(uHcSil, 1.0, smoothstep(2.2, 4.5, vFogDepth * fogDensity));
        #else
          float hcFf = smoothstep(fogNear, fogFar, vFogDepth); float hcSk = 1.0;
        #endif
        // above the line, seen from below through the surface: the arch is a dark silhouette that carries straight on
        // from its leg (same fog), and only melts into the bright mirror higher up
        float hcAb = (vHcP.y >= 0.0 && uHcCamY < 0.0) ? 1.0 : 0.0;
        gl_FragColor.rgb *= 1.0 - 0.62 * hcAb;
        gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor * (uHcCamY < 0.0 ? hcSk : 1.0), hcFf);
        gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor * 1.15, hcAb * smoothstep(1.6, 7.5, vHcP.y) * 0.7);
      #endif`)),d.noFlip&&(N=N.replace("float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;","float faceDirection = 1.0;")),A.fragmentShader=N},p.customProgramCacheKey=()=>"tideline-"+t,p}const Ht=`varying vec2 vRuv; uniform vec3 uSpA; uniform vec3 uSpB; float hcBandK = 0.0;
`,zt=`attribute vec2 aRuv; varying vec2 vRuv;
`,Mt=`
    { float y = vHcP.y;
      float bn = hcNoise(vec3(vRuv.x * 6.0, vRuv.y * 1.3, 3.0));
      diffuseColor.rgb *= 0.72 + 0.56 * bn;
      diffuseColor.rgb *= 0.84 + 0.32 * hcNoise(vec3(vRuv.x * 46.0, vRuv.y * 2.6, 7.0));                    // fissures running along the root
      vec2 lc = vec2(vRuv.x * 15.0, vRuv.y * 12.0), ci = floor(lc), cf = fract(lc) - 0.5; float h = hcHash(vec3(ci, 1.0));
      float lent = smoothstep(0.2, 0.07, length(cf * vec2(1.0, 1.7) + (h - 0.5) * 0.4)) * step(0.55, h) * step(0.0, y);
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.6, 0.52, 0.4), lent * 0.36);
      float damp = smoothstep(1.5 + uHcTide, 0.45 + uHcTide, y) * step(0.0, y);
      diffuseColor.rgb *= mix(1.0, 0.55, damp);
      float band = smoothstep(-0.16, -0.03, y) * (1.0 - smoothstep(0.36 + uHcTide, 0.46 + uHcTide, y + (bn - 0.5) * 0.18));
      float oy = hcNoise(vHcP * 4.0 + 5.0);
      // the barnacle band: every barnacle a pale cone with a dark mouth, grey oysters crusted between them
      vec3 bq = vec3(dot(vHcP, vec3(0.8, 0.36, 0.48)), dot(vHcP, vec3(-0.6, 0.48, 0.64)), dot(vHcP, vec3(0.0, -0.8, 0.6))) * 25.0, bi = floor(bq), bf = fract(bq) - 0.5;
      bf += (vec3(hcHash(bi + 7.0), hcHash(bi + 11.0), hcHash(bi + 17.0)) - 0.5) * 0.45;
      float bh = step(0.22, hcHash(bi + 3.0)), bl = length(bf);
      vec3 barn = mix(vec3(0.3, 0.29, 0.26), vec3(0.8, 0.78, 0.72), (1.0 - smoothstep(0.12, 0.5, bl)) * bh) * (1.0 - 0.75 * smoothstep(0.17, 0.07, bl) * bh);
      barn = mix(barn, vec3(0.47, 0.49, 0.52) * (0.55 + 0.9 * hcNoise(vHcP * 9.0 + 2.0)), smoothstep(0.58, 0.68, oy));
      diffuseColor.rgb = mix(diffuseColor.rgb, barn, band * 0.95);
      hcBandK = band * step(0.0, y);
      if (y < 0.0) {
        float sn = hcNoise(vHcP * 6.0 + 11.0) * 0.5 + hcNoise(vHcP * 17.0 + 3.0) * 0.5;
        vec3 sp = mix(uSpA, uSpB, smoothstep(0.45, 0.6, hcNoise(vHcP * 1.1 + 7.0))) * (0.6 + 0.6 * hcNoise(vHcP * 22.0));
        float m = smoothstep(0.5, 0.6, sn) * smoothstep(-0.1, -0.6, y);
        vec3 silt = mix(diffuseColor.rgb * vec3(0.9, 0.86, 0.7), vec3(0.36, 0.33, 0.23) * (0.55 + 0.9 * bn), 0.6 * smoothstep(-0.1, -0.8, y));   // a skin of silt and turf below the line
        diffuseColor.rgb = mix(silt, sp, m * 0.8);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.34, 0.1), smoothstep(0.58, 0.72, hcNoise(vHcP * 5.3 + 20.0)) * 0.5 * (1.0 - m));
      } }`,St={vHead:zt,vBody:"vRuv = aRuv;",fHead:Ht,fColor:Mt,sil:!0,fLit:`outgoingLight += diffuseColor.rgb * 0.07 * hcBandK;
    if (vHcP.y < 0.0) { vec3 hcUp = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz); float hcRd = clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0);
    outgoingLight *= (0.4 + 0.8 * hcRd) * (0.78 + 0.42 * dot(normal, hcUp)); }`},At={fColor:"diffuseColor.rgb *= 0.7 + 0.6 * hcNoise(vHcP * 24.0);"},Ct={noFlip:!0,vHead:`attribute vec2 aSw;
`,vBody:"transformed.x += aSw.x * (1.0 + 0.55 * sin(uHcTime * 1.3 + aSw.y + transformed.z * 0.4)); transformed.z += aSw.x * 0.35 * sin(uHcTime * 0.9 + aSw.y * 1.7);"},Ft=`vec3 hcQ(vec4 q, vec3 v){ return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
`,Bt={noFlip:!0,vHead:`attribute vec3 iPos; attribute vec4 iQuat; attribute vec4 iData; attribute vec3 iCol; attribute vec3 iN; varying vec3 vLc;
`+Ft,vNormal:"objectNormal = normalize(mix(normalize(iN), hcQ(iQuat, objectNormal), 0.22));",vBody:`
        vec3 lp = hcQ(iQuat, transformed * iData.x);
        float wv = sin(uHcTime * 1.7 + iData.z + iPos.x * 0.3) + 0.5 * sin(uHcTime * 3.3 + iData.z * 1.7);
        lp += vec3(0.075, 0.04, 0.055) * wv * iData.x * (0.4 + uv.y);
        transformed = iPos + lp; vLc = iCol;
        vMapUv = uv * 0.5 + vec2(mod(iData.y, 2.0), floor(iData.y * 0.5)) * 0.5;`,fHead:`varying vec3 vLc; uniform vec3 uLeafK;
`,fColor:"diffuseColor.rgb *= vLc;",fLit:`{ vec3 Lv = normalize((viewMatrix * vec4(uHcSun, 0.0)).xyz); float bl = max(dot(normalize(-vViewPosition), Lv), 0.0); bl = bl * bl * bl;
        outgoingLight += diffuseColor.rgb * (uHcSunCol * bl * uLeafK.x + vec3(0.13, 0.17, 0.08) * uLeafK.y); outgoingLight = min(outgoingLight, vec3(uLeafK.z)); }`},Pt={vHead:`attribute vec4 iA; attribute vec2 iB;
`,vBody:`
        vec3 pp = transformed * iB.y; vec3 bp = iA.xyz; float sc = 1.0;
        float sw = sin(uHcTime * 1.4 + iA.w * 40.0) * 0.18;
        if (iB.x > 0.0) {
          float t = fract(uHcTime / iB.x + iA.w) * iB.x, tf = max(t - 1.2, 0.0), tHit = sqrt(max(bp.y, 0.0) / 4.9), ts = tf - tHit;
          bp.y -= 4.9 * tf * tf; sw *= 1.0 - smoothstep(0.0, 0.3, tf);
          if (ts > 0.0) bp.y = 0.3 - 0.75 * exp(-ts * 1.5) * cos(ts * 5.0);
          sc = (1.0 - smoothstep(iB.x - 1.6, iB.x - 0.4, t)) * smoothstep(0.0, 0.5, t);
        }
        pp.xz += vec2(sw, sw * 0.6) * -pp.y;
        transformed = bp + pp * sc;`};function ze(){return{pos:[],nor:[],col:[],uv:[],idx:[],ext:[]}}function _e(p,M,t){const d=new a.BufferGeometry;return d.setAttribute("position",new a.Float32BufferAttribute(p.pos,3)),d.setAttribute("normal",new a.Float32BufferAttribute(p.nor,3)),d.setAttribute("color",new a.Float32BufferAttribute(p.col,3)),p.uv.length&&d.setAttribute("aRuv",new a.Float32BufferAttribute(p.uv,2)),M&&d.setAttribute(M,new a.Float32BufferAttribute(p.ext,t)),d.setIndex(p.idx),d.computeBoundingSphere(),d}async function ct(p,M,t,d){const A=new a.BufferGeometry;return A.setAttribute("position",new a.Float32BufferAttribute(p.pos,3)),await M.yield(),A.setAttribute("normal",new a.Float32BufferAttribute(p.nor,3)),await M.yield(),A.setAttribute("color",new a.Float32BufferAttribute(p.col,3)),await M.yield(),p.uv.length&&(A.setAttribute("aRuv",new a.Float32BufferAttribute(p.uv,2)),await M.yield()),t&&(A.setAttribute(t,new a.Float32BufferAttribute(p.ext,d)),await M.yield()),A.setIndex(p.idx),await M.yield(),A.computeBoundingSphere(),A}function lt(p){const M=new a.IcosahedronGeometry(1,p),t=M.getAttribute("position"),d=new Map,A=[],N=[];for(let D=0;D<t.count;D++){const Y=Math.round(t.getX(D)*1e4)+","+Math.round(t.getY(D)*1e4)+","+Math.round(t.getZ(D)*1e4);let W=d.get(Y);W===void 0&&(W=A.length/3,d.set(Y,W),A.push(t.getX(D),t.getY(D),t.getZ(D))),N.push(W)}return M.dispose(),{pos:A,idx:N,count:A.length/3}}const J=new w,ne=new w,Le=new w,qe=new w,Ze=new w,ut=new a.Quaternion;function Ve(p,M,t,d,A,N){const D=M.length,Y=p.pos.length/3,W=[0,0,0];let ae=0;J.subVectors(M[1],M[0]).normalize(),ne.set(1,0,0),Math.abs(J.x)>.8&&ne.set(0,0,1),ne.addScaledVector(J,-ne.dot(J)).normalize();for(let _=0;_<D;_++){const ve=M[Math.max(0,_-1)],O=M[Math.min(D-1,_+1)];qe.copy(J),J.subVectors(O,ve).normalize(),Ze.crossVectors(qe,J);const C=Ze.length();C>1e-5&&(ut.setFromAxisAngle(Ze.multiplyScalar(1/C),Math.asin(Math.min(1,C))),ne.applyQuaternion(ut)),ne.addScaledVector(J,-ne.dot(J)).normalize(),Le.crossVectors(J,ne),_>0&&(ae+=M[_].distanceTo(M[_-1]));const ce=t(_),ee=M[_];for(let j=0;j<=d;j++){const U=j/d*Math.PI*2,I=Math.cos(U),le=Math.sin(U),ge=ne.x*I+Le.x*le,$=ne.y*I+Le.y*le,te=ne.z*I+Le.z*le,G=ce*(N?N(_,j%d,ee):1);p.pos.push(ee.x+ge*G,ee.y+$*G,ee.z+te*G),p.nor.push(ge,$,te),A(_,j%d,W),p.col.push(W[0],W[1],W[2]),p.uv.push(j/d,ae)}if(_>0)for(let j=0;j<d;j++){const U=Y+(_-1)*(d+1)+j,I=U+d+1;p.idx.push(U,I,U+1,U+1,I,I+1)}}}function _t(p){const t=document.createElement("canvas");t.width=t.height=256*2;const d=t.getContext("2d");d.clearRect(0,0,256*2,256*2);for(let N=0;N<4;N++){const D=N%2*256,Y=(N>>1)*256;d.save(),d.beginPath(),d.rect(D+2,Y+2,252,252),d.clip();const W=3+N%2;for(let ae=0;ae<W;ae++){const _=D+256*(.5+p.range(-.1,.1)),ve=Y+256*.96,O=-Math.PI/2+(ae-(W-1)/2)*.62+p.range(-.12,.12),C=256*p.range(.62,.82);d.strokeStyle="#8a8266",d.lineWidth=5,d.beginPath(),d.moveTo(_,ve),d.lineTo(_+Math.cos(O)*C,ve+Math.sin(O)*C),d.stroke();const ce=5;for(let ee=1;ee<=ce;ee++)for(const j of[-1,1]){const U=.2+ee/ce*.8,I=_+Math.cos(O)*C*U,le=ve+Math.sin(O)*C*U,ge=O+j*p.range(.6,1.05),$=256*p.range(.2,.27),te=$*p.range(.36,.46);d.save(),d.translate(I,le),d.rotate(ge);const G=Math.floor(p.range(150,255)),ue=d.createLinearGradient(0,-te,0,te);ue.addColorStop(0,`rgb(${G},${G},${G})`),ue.addColorStop(.5,`rgb(${G-50},${G-40},${G-50})`),ue.addColorStop(1,`rgb(${G-20},${G-10},${G-30})`),d.fillStyle=ue,d.beginPath(),d.moveTo(0,0),d.bezierCurveTo($*.25,-te,$*.8,-te*.9,$,0),d.bezierCurveTo($*.8,te*.9,$*.25,te,0,0),d.fill(),d.strokeStyle="rgba(255,255,235,0.55)",d.lineWidth=2,d.beginPath(),d.moveTo($*.05,0),d.lineTo($*.95,0),d.stroke(),d.restore()}}d.restore()}const A=new a.CanvasTexture(t);return A.colorSpace=a.SRGBColorSpace,A.anisotropy=4,A.generateMipmaps=!0,A.minFilter=a.LinearMipmapLinearFilter,A}async function Tt(p,M={}){const t=p.rng,d=p.noise,A=(M.palette&&M.palette.length>=7?M.palette:bt).map(e=>new a.Color(e)),[N,D,Y,W,ae,_,ve]=A,O=(M.sunDir?M.sunDir.clone():new w(-.26,.906,-.33)).normalize(),C=new a.Group;C.name="mother-tree";const ce=t.range(0,Math.PI*2),ee=t.range(.6,2.2),j=t.int(6,8),U=t.range(16.5,19.5),I=t.range(22.5,24),le=t.range(7,8),ge=t.range(23.5,25.5),$=t.range(0,1),te=t.range(-.5,1),G=M.ibis??t.int(340,440),ue=M.fish??5e3,ke=t.int(11,14),Me=new w(t.range(-.6,.6),-2.7,t.range(-1.5,1.5)),Oe=t.range(3.7,4.2),Se=t.sign(),F={uHcTime:{value:0},uHcSun:{value:O},uHcSunCol:{value:new a.Color("#FFF4C8").multiplyScalar(2.2)},uHcAbsorb:{value:new a.Color(.42,.86,.84)},uHcHaze:{value:new a.Vector4(_.r*.75,_.g*.9,_.b*.95,M.underHaze??.035)},uHcCamY:{value:10},uHcStrike:{value:M.strike??0},uHcAvoid:{value:new a.Vector4(0,50,0,0)},uHcBall:{value:new a.Vector4(Me.x,Me.y,Me.z,Oe)},uHcTide:{value:M.tide??0},uHcForest:{value:1e5},uHcShadeK:{value:1},uHcSil:{value:.6},uHcBurst:{value:M.strike??0},uLeafK:{value:new w(.1,1,.85)},uHcCoin:{value:new a.Vector2(.34,1.3)}},Ie=W.clone().lerp(new a.Color("#7a3f2c"),.25+$*.3),ft=Ie.clone().lerp(new a.Color("#b9a58a"),.45),ht=Ie.clone().multiplyScalar(.5),T=new a.Color,Ge=(e,n)=>(o,s,r)=>{const v=.5+.5*Math.sin(e*31+o*1.7+s*2.1);T.copy(ht).lerp(Ie,.35+.65*v).lerp(ft,n*(.3+.4*((s*7+o)%3===0?1:.3))),r[0]=T.r,r[1]=T.g,r[2]=T.b},De=ze(),pt=Math.cos(ce)*ee,dt=Math.sin(ce)*ee,fe=e=>{const n=xe((e-6.6)/11,0,1.3);return new w(pt*n*n+Math.sin(e*.5+ce)*.35*n,e,dt*n*n+Math.cos(e*.43)*.35*n)},Ee=e=>.3+1.9*Z(6.6,9.4,e)-.85*Z(9.6,17.5,e);{const e=[];for(let n=0;n<=14;n++)e.push(fe(6.6+n/14*11.4));Ve(De,e,n=>Ee(e[n].y),10,Ge(1.3,.5),(n,o,s)=>1+.16*d.n3(s.x*.6+o*1.3,s.y*.35,o*.9)+.12*Math.sin(o*1.885+s.y*.2))}const he=fe(18),X=[],Ye=[],je=(e,n,o,s,r,v,l,i)=>{const u=e.clone().lerp(n,.45);u.y+=l,u.x+=t.range(-1,1),u.z+=t.range(-1,1);const g=new a.CatmullRomCurve3([e,u,n],!1,"centripetal").getPoints(v);return Ve(De,g,f=>V(o,s,Math.pow(f/v,.8))*(f===0?1.35:1),r,Ge(i,.6),(f,H,h)=>1+.14*d.n3(h.x*.8,h.y*.8,h.z*.8+H)),g},vt=t.range(0,Math.PI*2);for(let e=0;e<j;e++){const n=vt+e/j*Math.PI*2+t.range(-.25,.25),o=t.range(10.8,16.5),s=fe(o),r=U*t.range(.55,.95),v=new w(he.x+Math.cos(n)*r,I+t.range(-5.5,.5),he.z+Math.sin(n)*r),l=je(s,v,Ee(o)*.5,.16,6,9,t.range(1.5,3.2),e+2);X.push({c:v.clone(),r:t.range(4.4,5.8)});for(let u=3;u<l.length;u++)Ye.push(l[u]);const i=t.int(2,3);for(let u=0;u<i;u++){const g=t.int(3,7),f=l[g],H=n+t.range(-1.2,1.2),h=t.range(5,9.5),z=new w(f.x+Math.cos(H)*h,V(f.y,I,.5)+t.range(.5,5),f.z+Math.sin(H)*h),c=je(f,z,.24,.07,4,5,t.range(.3,1.4),e*7+u);X.push({c:z.clone(),r:t.range(3.6,5)}),Ye.push(c[2],c[3],c[4])}}{const e=new w(he.x+t.range(-2,2),I+le*.55,he.z+t.range(-2,2));je(fe(17.6),e,.9,.14,6,6,.5,77),X.push({c:e,r:t.range(4.4,5.4)})}for(let e=0;e<30;e++){const n=t.range(0,Math.PI*2),o=t.range(-.8,1),s=Math.sqrt(1-Math.min(1,o*o));X.push({c:new w(he.x+Math.cos(n)*s*U*.92,I+o*le*.8,he.z+Math.sin(n)*s*U*.92),r:t.range(3.6,5.2)})}let We=0;for(const e of X)We=Math.max(We,e.c.y+e.r*.72);const Xe=35-We;for(const e of X)e.c.y+=Xe*Z(15,28,e.c.y);await p.yield();const Ue=[],Ae=[],Qe=[],gt=(e,n)=>Math.abs(e.x)<He+n&&e.y<xt&&e.y>de-1;function Ce(e,n){const o=new a.CatmullRomCurve3(e,!1,"centripetal").getPoints(48),s=[0],r=[];for(let c=1;c<=48;c++){const m=o[c].distanceTo(o[c-1]);let x=0;c<48&&(J.subVectors(o[c],o[c-1]).normalize(),qe.subVectors(o[c+1],o[c]).normalize(),x=Math.acos(xe(J.dot(qe),-1,1))),s.push(s[c-1]+m*.35+x*2.4)}for(let c=0,m=0;c<=n.n;c++){const x=s[48]*c/n.n;for(;m<47&&s[m+1]<x;)m++;r.push(o[m].clone().lerp(o[m+1],xe((x-s[m])/Math.max(1e-6,s[m+1]-s[m]),0,1)))}if(!n.free){for(const c of r)if(gt(c,n.r0))return null}const v=r.length,l=t.range(0,100),i=new Array(v);let u=0;const g=[0];for(let c=1;c<v;c++)u+=r[c].distanceTo(r[c-1]),g.push(u);const f=t.range(1.3,2.2),H=t();for(let c=0;c<v;c++){const m=g[c]/u,x=r[c].y;let S=n.r0*(1-(n.fat?.3:.5)*m)*(1+.5*Math.max(0,1-m*10))*(1+.3*Z(.3,-1.6,x));n.fat&&(S*=1+(n.fat-1)*Z(.9,-.7,x)),n.tip?S*=1-Z(.9,1,m)*.9:S*=1+.5*Z(de+1.2,de,x),S*=1+.38*Math.pow(Math.max(0,Math.cos((g[c]/f+H)*6.283)),4),i[c]=Math.max(x<0?.05:.012,S),x<-.5&&x>de+.3&&m<.97&&Ae.push({p:r[c],r:i[c]}),n.tier===0&&x>4.5&&x<12&&c>2&&Math.abs(r[c].x)>2&&Qe.push({p:r[c],r:i[c]})}Ve(De,r,c=>i[c],n.sides,Ge(l,.35),(c,m,x)=>1+.13*d.n3(x.x*1.3+l,x.y*1.3,x.z*1.3+m*.7));const h=r[v-1],z={pts:r,rad:i,tier:n.tier,landR:Math.hypot(h.x,h.z)};return Ue.push(z),z}function Je(e,n,o,s){const r=n-e.x,v=o-e.z,l=Math.hypot(r,v);if(l<.6)return null;const i=-v/l,u=r/l,g=t.range(-1,1),f=Math.max(e.y+s.lift,s.kneeY+.6),H=s.depth,h=t.range(.1,.8),z=t.range(0,6.283),c=n+Math.cos(z)*h+.5,m=o+Math.sin(z)*h,x=[e.clone(),new w(e.x+r*.36+i*g*l*.1,f,e.z+v*.36+u*g*l*.1),new w(e.x+r*.78-i*g*l*.05,V(f,s.kneeY,.5),e.z+v*.78-u*g*l*.05),new w(e.x+r*.96,s.kneeY,e.z+v*.96),new w(n,0,o),new w(V(n,c,.35),-H*.55,V(o,m,.35)),new w(c,-H,m)];return Ce(x,s)}const et=()=>t.chance(.3)?{depth:6.25,tip:!1}:{depth:t.range(2.4,5.6),tip:!0};for(let e=0,n=0;e<600&&n<60;e++){(e&31)===31&&await p.yield();const o=t.range(0,Math.PI*2),s=t.range(7,13.5),r=Math.sin(o)*s,v=Math.cos(o)*s;if(Math.abs(r)<He+.6)continue;const l=t.range(7.4,13.2),i=fe(l),u=Ee(l)*.7,g=new w(i.x+Math.sin(o)*u,l,i.z+Math.cos(o)*u);Je(g,r,v,{n:18,sides:5,r0:t.range(.3,.5),lift:t.range(-.5,1.6),kneeY:t.range(1.6,3.2),tier:0,...et()})&&n++}await p.yield();const Fe=(e,n,o,s)=>{const r=Ue.filter(v=>v.tier===e);for(let v=0,l=0;v<o*12&&l<o&&r.length;v++){const i=t.pick(r),u=t.int(Math.floor(i.pts.length*.25),Math.floor(i.pts.length*.72)),g=i.pts[u];if(g.y<1.3)continue;const f=Math.atan2(g.x,g.z)+t.sign()*t.range(.05,.85),H=t.range(s.l0,s.l1),h=g.x+Math.sin(f)*H,z=g.z+Math.cos(f)*H,c=Math.hypot(h,z);if(c>ge||c<Math.max(6.5,i.landR+.8)||Math.abs(h)<He+.4)continue;const m=Math.min(g.y*.6,t.range(.9,2.6));Je(g,h,z,{n:s.n,sides:s.fat?5:s.sides,r0:Math.min(i.rad[u]*.8,t.range(s.r0,s.r1)),lift:t.range(.3,1.5),kneeY:m,tier:n,fat:s.fat&&l%s.every===0?s.fat:0,...et()})&&l++}};Fe(0,1,80,{l0:4,l1:8,n:13,sides:5,r0:.16,r1:.26}),await p.yield(),Fe(1,2,90,{l0:4,l1:8,n:13,sides:4,r0:.13,r1:.2}),await p.yield(),Fe(2,3,90,{l0:4,l1:8,n:11,sides:4,r0:.1,r1:.16}),await p.yield(),Fe(3,4,80,{l0:4,l1:8,n:11,sides:4,r0:.08,r1:.14,fat:1.8,every:3}),await p.yield(),Fe(4,5,90,{l0:3.5,l1:7.5,n:10,sides:4,r0:.07,r1:.12,fat:2.3,every:2}),await p.yield();{const e=[],n=[];for(const o of Ue)for(let s=1;s<o.pts.length-1;s++){const r=o.pts[s];r.y>2&&r.y<9.5&&Math.abs(r.x)>He+.5&&Math.abs(r.x)<11&&Math.abs(r.z)<24&&e.push(r)}for(let o=0,s=0;o<1400&&s<88&&e.length;o++){(o&63)===63&&await p.yield();const r=t.pick(e),v=Math.sign(r.x)||1,l=v*t.range(He+(v<0?.95:.5),9.2),i=r.z+t.range(-1.8,1.8);let u=Math.abs(i)<24;for(const z of n)if((z[0]-l)*(z[0]-l)+(z[1]-i)*(z[1]-i)<.8){u=!1;break}if(!u)continue;const g=t.chance(.45),f=g?6.25:t.range(3.2,5.7),H=t.range(-.25,.25),h=[r.clone(),new w(V(r.x,l,.65),r.y*.55,V(r.z,i,.65)),new w(l,.25,i),new w(l+.12,-f*.5,i+H),new w(l+.4,-f,i+H*2)];Ce(h,{n:10,sides:6,r0:t.range(.2,.32),tier:6,tip:!g,fat:1.35})&&(n.push([l,i]),s++)}}await p.yield();for(let e=0,n=0;e<900&&n<46;e++){const o=t.pick(Ye),s=Math.atan2(o.x,o.z)+t.range(-.6,.6),r=t.range(.5,3.5),v=o.x+Math.sin(s)*r,l=o.z+Math.cos(s)*r;if(Math.abs(v)<He+.3||Math.abs(o.x)<He+.3||Math.hypot(v,l)>ge)continue;const i=t.chance(.38),u=i?t.range(1.2,7):-t.range(2.2,5.4),g=t.range(-1.6,1.6),f=[o.clone(),new w(V(o.x,v,.25)+g,V(o.y,0,.35),V(o.z,l,.25)-g),new w(V(o.x,v,.8),V(o.y,Math.max(u,0),.75),V(o.z,l,.8)),new w(v,Math.max(u,0)+(i?.6:0),l)];i||f.push(new w(v+.15,u*.5,l),new w(v+.45,u,l)),Ce(f,{n:8,sides:3,r0:t.range(.07,.13),tier:9,tip:!0})&&n++}for(let e=0;e<9;e++){const n=t.range(0,6.283),o=t.range(.2,1.3),s=t.range(7,8.6),r=fe(s),v=t.range(6.7,7.4)-0;Ce([new w(r.x+Math.cos(n)*o*.5,s+.8,r.z+Math.sin(n)*o*.5),new w(r.x+Math.cos(n)*o,(s+v)/2,r.z+Math.sin(n)*o),new w(r.x+Math.cos(n)*o*1.2,v,r.z+Math.sin(n)*o*1.2)],{n:4,sides:3,r0:t.range(.07,.13),tier:3,tip:!0,free:!0})}const re=14;if(M.lintel!==!1){const e=t.sign();Ce([new w(-11.5*e,4.2,re-2.2),new w(-8.6*e,2.1,re-.9),new w(-5*e,.62,re-.1),new w(0,.3,re+.3),new w(5*e,.5,re),new w(8*e,.2,re-.6),new w(9*e,-2.2,re-.9),new w(9.4*e,-4.6,re-1)],{n:22,sides:6,r0:.3,tier:1,tip:!0,free:!0})}await p.yield();const mt=ie(new a.MeshStandardMaterial({vertexColors:!0,roughness:.82,metalness:0}),{...F,uSpA:{value:ae.clone().lerp(new a.Color("#ff6a1a"),.55)},uSpB:{value:new a.Color("#7b3fa8")}},"wood",St);await p.yield();const tt=new a.Mesh(await ct(De,p),mt);tt.name="wood",C.add(tt),await p.yield();{const e=lt(1),n=ze(),o=new w;for(const r of X){const v=n.pos.length/3;for(let l=0;l<e.idx.length;l++)n.idx.push(v+e.idx[l]);for(let l=0;l<e.count;l++){o.set(e.pos[l*3],e.pos[l*3+1],e.pos[l*3+2]);const i=r.r*.64*(1+.28*d.n3(o.x*1.3+r.c.x,o.y*1.3+r.c.y,o.z*1.3+r.c.z));n.pos.push(r.c.x+o.x*i,r.c.y+o.y*i*.7,r.c.z+o.z*i),n.nor.push(o.x*.6,o.y*.6+.7,o.z*.6);const u=.5+.4*Math.max(0,o.y);n.col.push(V(D.r,Y.r,.25)*u,V(D.g,Y.g,.25)*u,V(D.b,Y.b,.25)*u)}}await p.yield();const s=new a.Mesh(_e(n),ie(new a.MeshStandardMaterial({vertexColors:!0,roughness:1}),F,"core",{fLit:"outgoingLight += diffuseColor.rgb * vec3(0.1, 0.13, 0.06);"}));s.name="crown-cores",C.add(s)}let pe=0;for(const e of X)pe=Math.max(pe,Math.hypot(e.c.x,e.c.z)+e.r);{let n=0;for(const L of X)n+=L.r*L.r;const o=[],s=[],r=[],v=[],l=[],i=new a.Quaternion,u=new a.Quaternion,g=new w,f=new w,H=new w(0,0,1),h=new a.Color,z=Y.clone().lerp(ae,.35),c=D.clone().multiplyScalar(.62);let m=0;for(const L of X){(++m&7)===0&&await p.yield();const b=Math.round(4400*L.r*L.r/n);for(let y=0;y<b;y++){f.set(t.gauss(),t.gauss(),t.gauss()).normalize(),f.y<-.45&&t.chance(.6)&&(f.y=-f.y);const B=L.r*t.range(.72,1.1);o.push(L.c.x+f.x*B,L.c.y+f.y*B*.72,L.c.z+f.z*B),g.set(f.x+t.range(-.7,.7),f.y+t.range(-.5,.9),f.z+t.range(-.7,.7)).normalize(),i.setFromUnitVectors(H,g),u.setFromAxisAngle(H,t.range(0,6.283)),i.multiply(u),s.push(i.x,i.y,i.z,i.w),r.push(t.range(2.3,3.8),t.int(0,3),t.range(0,6.283),0);const P=xe(.56+.16*f.dot(O)+.3*f.y+t.range(-.2,.2),0,1);h.copy(c).lerp(Y,Math.pow(P,1.2)),t.chance(.12+.1*Math.max(0,te))&&h.lerp(z,t.range(.2,.7)*P),h.multiplyScalar(t.range(.8,1)),v.push(h.r,h.g,h.b),l.push(f.x*.6,f.y*.6+.75,f.z*.6)}}await p.yield();const x=new a.PlaneGeometry(1,1),S=new a.InstancedBufferGeometry;S.index=x.index,S.setAttribute("position",x.getAttribute("position")),S.setAttribute("normal",x.getAttribute("normal")),S.setAttribute("uv",x.getAttribute("uv")),S.setAttribute("iPos",new a.InstancedBufferAttribute(new Float32Array(o),3)),S.setAttribute("iQuat",new a.InstancedBufferAttribute(new Float32Array(s),4)),S.setAttribute("iData",new a.InstancedBufferAttribute(new Float32Array(r),4)),S.setAttribute("iCol",new a.InstancedBufferAttribute(new Float32Array(v),3)),S.setAttribute("iN",new a.InstancedBufferAttribute(new Float32Array(l),3)),S.instanceCount=o.length/3,S.boundingSphere=new a.Sphere(new w(0,I,0),pe+8),await p.yield();const E=_t(t);await p.yield();const K=ie(new a.MeshStandardMaterial({map:E,alphaTest:.4,side:a.DoubleSide,roughness:1,metalness:0}),F,"leaf",Bt),R=new a.Mesh(S,K);R.name="leaves",C.add(R)}await p.yield();{const e=ze(),n=Y.clone().multiplyScalar(.8),o=new a.Color("#6a4a22"),s=[new w(0,0,0),new w(0,-.12,0),new w(0,-.5,0),new w(0,-.85,0),new w(0,-1,0)],r=[.02,.05,.062,.04,.004];Ve(e,s,h=>r[h],3,(h,z,c)=>{T.copy(n).lerp(o,h/4*.8),h===0&&T.copy(o),c[0]=T.r,c[1]=T.g,c[2]=T.b});const v=_e(e),l=new a.InstancedBufferGeometry;l.index=v.index;for(const h of["position","normal","color"])l.setAttribute(h,v.getAttribute(h));const i=180,u=new Float32Array(i*4),g=new Float32Array(i*2);for(let h=0;h<i;h++){const z=t.pick(X),c=t.range(0,6.283),m=z.r*t.range(.2,.95),x=h<26;let S=z.c.x+Math.cos(c)*m,E=z.c.z+Math.sin(c)*m;x&&Math.abs(S)<3.5&&(S=3.5*Math.sign(S||1)+S),u.set([S,z.c.y-z.r*t.range(.5,.72),E,t()],h*4),g.set([x?t.range(6,11):0,t.range(.7,1.15)],h*2)}l.setAttribute("iA",new a.InstancedBufferAttribute(u,4)),l.setAttribute("iB",new a.InstancedBufferAttribute(g,2)),l.instanceCount=i,l.boundingSphere=new a.Sphere(new w(0,15,0),40);const f=ie(new a.MeshStandardMaterial({vertexColors:!0,roughness:.45}),F,"pod",Pt),H=new a.Mesh(l,f);H.name="pods",C.add(H)}{const e=[],n=[],o=[],s=[],r=[],v=ve,l=new a.Color("#4a2620"),i=new a.Color("#b8433a"),u=new a.Color("#0c0a0a"),g=(b,y,B,P)=>{for(let q=0;q<b.length;q++){const ye=b[Math.max(0,q-1)],we=b[Math.min(b.length-1,q+1)];let k=we[1]-ye[1],oe=we[2]-ye[2];const se=Math.hypot(k,oe)||1;k/=se,oe/=se;for(let be=0;be<B;be++){const Be=be/B*6.283+.6,$e=Math.cos(Be)*y[q],it=Math.sin(Be)*y[q];P.push(b[q][0]+$e,b[q][1]-oe*it,b[q][2]+k*it)}}},f=(b,y,B,P,q,ye)=>{const we=e.length/3;g(b,B,P,e),g(y,B,P,n);for(let k=0;k<b.length;k++)for(let oe=0;oe<P;oe++){const se=q(k);o.push(se.r,se.g,se.b),s.push(0,ye?k/(b.length-1):0)}for(let k=0;k<b.length-1;k++)for(let oe=0;oe<P;oe++){const se=we+k*P+oe,be=we+k*P+(oe+1)%P,Be=se+P,$e=be+P;r.push(se,Be,be,be,Be,$e)}};f([[0,.33,-.2],[0,.4,-.08],[0,.5,.06],[0,.56,.13]],[[0,0,-.26],[0,0,-.1],[0,0,.08],[0,0,.2]],[.012,.085,.098,.04],4,b=>b===0?u:v),f([[0,.55,.12],[0,.71,.16],[0,.84,.19],[0,.8,.28],[0,.69,.35]],[[0,0,.18],[0,.02,.4],[0,.03,.53],[0,0,.63],[0,-.09,.71]],[.04,.028,.044,.018,.004],3,b=>b>=3?l:v,!0);for(const b of[-1,1]){const y=e.length/3,B=b*.036;e.push(B-.01,.36,-.03,B+.01,.36,-.01,B-.008,0,-.01,B+.008,0,.01),n.push(B-.012,-.04,-.18,B+.012,-.04,-.18,B-.009,-.06,-.52,B+.009,-.06,-.52);for(let P=0;P<4;P++)o.push(i.r,i.g,i.b),s.push(0,0);r.push(y,y+2,y+1,y+1,y+2,y+3)}for(const b of[-1,1]){const y=e.length/3;e.push(b*.09,.53,.09,b*.075,.43,-.1,b*.105,.49,-.02,b*.09,.37,-.15,b*.045,.31,-.3),n.push(b*.06,.03,.1,b*.06,.01,-.14,b*.44,.05,.12,b*.4,.02,-.12,b*.86,.04,-.03);for(const[B,P]of[[v,0],[v,0],[v,.5],[v,.5],[u,1]])o.push(B.r,B.g,B.b),s.push(P,0);b>0?r.push(y,y+2,y+1,y+1,y+2,y+3,y+2,y+4,y+3):r.push(y,y+1,y+2,y+1,y+3,y+2,y+2,y+3,y+4)}const H=b=>{const y=new a.BufferGeometry;y.setAttribute("position",new a.Float32BufferAttribute(b,3)),y.setIndex(r),y.computeVertexNormals();const B=y.getAttribute("normal");return y.dispose(),B},h=new a.InstancedBufferGeometry;h.setAttribute("position",new a.Float32BufferAttribute(e,3)),h.setAttribute("normal",H(e)),h.setAttribute("aFly",new a.Float32BufferAttribute(n,3)),h.setAttribute("aFlyN",H(n)),h.setAttribute("color",new a.Float32BufferAttribute(o,3)),h.setAttribute("aW",new a.Float32BufferAttribute(s,2)),h.setIndex(r);const z=38,c=G+z,m=new Float32Array(c*4),x=new Float32Array(c*4),S=new w,E=fe(18).x,K=fe(18).z;for(let b=0;b<c;b++)if(b<G){if(b%11===0&&Qe.length){const y=t.pick(Qe);m.set([y.p.x,y.p.y+y.r*.9,y.p.z,t.range(0,6.283)],b*4)}else{const y=t.pick(X);S.set(t.gauss(),Math.abs(t.gauss())*.9+.25,t.gauss()).normalize(),m.set([y.c.x+S.x*y.r*1.12,y.c.y+S.y*y.r*.8+.5,y.c.z+S.z*y.r*1.12,t.range(0,6.283)],b*4)}x.set([t(),t.range(1.8,2.3),0,0],b*4)}else{const y=t.chance(.15);m.set([E,y?t.range(5,13):t.range(19,37),K,0],b*4),x.set([t(),t.range(1.5,2),1,(y?t.range(pe+9,pe+20):t.range(pe+2,pe+16))*(t.chance(.75)?Se:-Se)],b*4)}h.setAttribute("iA",new a.InstancedBufferAttribute(m,4)),h.setAttribute("iB",new a.InstancedBufferAttribute(x,4)),h.instanceCount=c,h.boundingSphere=new a.Sphere(new w(0,20,0),90);const R=ie(new a.MeshStandardMaterial({vertexColors:!0,roughness:.7,side:a.DoubleSide}),F,"ibis",{vHead:`attribute vec3 aFly; attribute vec3 aFlyN; attribute vec2 aW; attribute vec4 iA; attribute vec4 iB;
`,vNormal:`
        float sd = iB.x, mode = iB.z;
        float lift = (1.0 - mode) * smoothstep(sd * 0.45, sd * 0.45 + 0.3, uHcStrike);
        float fly = max(mode, smoothstep(0.0, 0.25, lift));
        vec3 base = iA.xyz; float yaw = iA.w;
        if (mode > 0.5) { float rad = abs(iB.w), dr = sign(iB.w), ang = sd * 6.283 + uHcTime * dr * 8.0 / rad;
          base += vec3(sin(ang), 0.0, cos(ang)) * rad * (1.0 + 0.12 * sin(ang * 2.0 + sd * 9.0)); base.y += sin(uHcTime * 0.3 + sd * 9.0) * 1.5; yaw = ang + dr * 1.5708; }
        else { vec3 ow = normalize(vec3(base.x, 0.0, base.z) + 0.001);
          base += vec3(0.0, 1.0, 0.0) * lift * (5.0 + sd * 13.0) + ow * lift * lift * (9.0 + sd * 15.0);
          float sa = lift * (0.7 + sd) * 1.1, sc2 = cos(sa), ss2 = sin(sa); base.xz = vec2(base.x * sc2 + base.z * ss2, -base.x * ss2 + base.z * sc2);
          yaw += lift * 3.0; }
        vec3 pp = mix(position, aFly, fly);
        float fl = fly * (mode > 0.5 ? smoothstep(-0.2, 0.6, sin(uHcTime * 0.6 + sd * 20.0)) : 1.0);
        pp.y += (sin(uHcTime * (mode > 0.5 ? 7.0 : 11.0) + sd * 30.0) * 0.36 * fl + 0.1 * fly) * aW.x;
        float pr = smoothstep(0.55, 1.0, sin(uHcTime * 0.8 + sd * 40.0)) * (1.0 - fly);
        pp.z += pr * aW.y * 0.05; pp.y -= pr * aW.y * 0.16;
        pp *= iB.y; float yc = cos(yaw), ys = sin(yaw);
        pp = vec3(pp.x * yc + pp.z * ys, pp.y, -pp.x * ys + pp.z * yc);
        vec3 nn = normalize(mix(objectNormal, aFlyN, fly));
        objectNormal = vec3(nn.x * yc + nn.z * ys, nn.y, -nn.x * ys + nn.z * yc);`,vBody:"transformed = base + pp;",fLit:"outgoingLight += diffuseColor.rgb * 0.1;"}),L=new a.Mesh(h,R);L.name="ibis",C.add(L)}await p.yield();const ot=(e,n)=>{const o=Math.hypot(e,n);return de-.03+.55*(1-Z(0,26,o))-1.3*Z(27,46,o)+.14*d.n2(e*.25,n*.25)*(1-Z(24,30,o))},nt=(e,n)=>d.fbm2(e*.07+3,n*.07-5,3)+.25*Math.sin(e*.21+n*.13),at=()=>{let e=t.pick(Ae);for(let n=0;n<2;n++){const o=t.pick(Ae);Math.abs(o.p.x)<Math.abs(e.p.x)&&(e=o)}return e};{const e=ze(),n=lt(1),o=new w,s=new a.Color,r=[ae.clone().lerp(new a.Color("#ff6a1a"),.6),new a.Color("#7b3fa8"),new a.Color("#e8b83a"),new a.Color("#c2477a"),new a.Color("#ff8a3a")],v=Math.min(300,Ae.length);for(let i=0;i<v;i++){(i&63)===63&&await p.yield();const u=at(),g=t.range(0,6.283),f=t.range(-.5,.5),H=t.range(.09,.2)+u.r*.6,h=t.chance(.25),z=H*t.range(.8,1.3),c=H*(h?t.range(1.8,2.8):t.range(.7,1.2)),m=H*t.range(.8,1.3),x=u.p.x+Math.cos(g)*(u.r+H*.45),S=u.p.y+f*.5,E=u.p.z+Math.sin(g)*(u.r+H*.45),K=t.pick(r),R=e.pos.length/3,L=t.range(0,50);for(let b=0;b<n.idx.length;b++)e.idx.push(R+n.idx[b]);for(let b=0;b<n.count;b++){o.set(n.pos[b*3],n.pos[b*3+1],n.pos[b*3+2]);const y=1+.26*Math.sin(o.x*5+L)*Math.sin(o.y*6+L*1.3)+.2*Math.sin(o.z*7+L*.7)+(h?.25*o.y:-.15*Math.abs(o.y));e.pos.push(x+o.x*z*y,S+o.y*c*y,E+o.z*m*y),e.nor.push(o.x,o.y,o.z),s.copy(K).multiplyScalar(.55+.4*(y-.6)+.25*Math.max(0,o.y)),e.col.push(s.r,s.g,s.b)}}await p.yield();const l=new a.Mesh(_e(e),ie(new a.MeshStandardMaterial({vertexColors:!0,roughness:.9}),F,"sponge",At));l.name="sponges",C.add(l)}await p.yield();{const e=ze(),n=[0,0,0],o=(g,f,H,h,z,c,m,x,S,E,K,R)=>{const L=e.pos.length/3,b=t.range(0,6.283),y=Math.cos(S),B=Math.sin(S);for(let P=0;P<=x;P++){const q=P/x,ye=V(c,m,q)*.5,we=f+h*z*q;for(const k of[-1,1])e.pos.push(g+y*ye*k,we,H+B*ye*k),e.nor.push(-B*.4,.9,y*.4),T.copy(E).lerp(K,q),n[0]=T.r,e.col.push(T.r,T.g,T.b),e.ext.push(q*q*z*R,b);if(P<x){const k=L+P*2;e.idx.push(k,k+1,k+2,k+1,k+3,k+2)}}},s=new a.Color("#2f6a1e"),r=new a.Color("#8fb83a"),v=D.clone().multiplyScalar(.7),l=Y.clone().multiplyScalar(.85);for(let g=0;g<640&&Ae.length;g++){(g&127)===127&&await p.yield();const f=at(),H=t.range(0,6.283);o(f.p.x+Math.cos(H)*f.r*.8,f.p.y,f.p.z+Math.sin(H)*f.r*.8,-1,t.range(.8,2.4),t.range(.14,.3),.02,3,t.range(0,3.14),s,r,.55)}await p.yield();for(let g=0,f=0;g<6e3&&f<900;g++){(g&255)===255&&await p.yield();const H=t.range(0,6.283),h=Math.sqrt(t())*27,z=Math.cos(H)*h,c=Math.sin(H)*h;nt(z,c)<.05||(o(z,ot(z,c)-.05,c,1,t.range(.5,1),t.range(.1,.16),.03,1,t.range(0,3.14),v,l,.5),f++)}await p.yield();const i=ie(new a.MeshStandardMaterial({vertexColors:!0,roughness:.6,side:a.DoubleSide}),F,"sway",Ct),u=new a.Mesh(await ct(e,p,"aSw",2),i);u.name="algae-grass",C.add(u)}if(await p.yield(),M.floor!==!1){const e=ze(),n=22,o=44,s=new a.Color("#E9DDB8").multiplyScalar(.78),r=D.clone().lerp(s,.35),v=_.clone().multiplyScalar(.22);for(let u=0;u<=n;u++)for(let g=0;g<=o;g++){const f=Math.pow(u/n,.85)*46,H=g/o*6.283,h=Math.cos(H)*f,z=Math.sin(H)*f;if(e.pos.push(h,ot(h,z),z),e.nor.push(0,1,0),T.copy(s).lerp(r,Z(0,.25,nt(h,z))*.7).lerp(v,Z(27,45,f)*(M.floorFade??1)),e.col.push(T.r,T.g,T.b),u<n&&g<o){const c=u*(o+1)+g;e.idx.push(c,c+1,c+o+1,c+1,c+o+2,c+o+1)}}const l=_e(e);l.computeVertexNormals();const i=new a.Mesh(l,ie(new a.MeshStandardMaterial({vertexColors:!0,roughness:1}),F,"floor",{fColor:"diffuseColor.rgb *= 0.8 + 0.3 * hcNoise(vec3(vHcP.xz * 2.5 + sin(vHcP.zx * 0.7) * 1.5, 1.0)) + 0.12 * sin(vHcP.x * 9.0 + sin(vHcP.z * 2.0) * 2.0);"}));i.name="sand",C.add(i)}await p.yield();const Ke=()=>a.UniformsUtils.clone(a.UniformsLib.fog),Te={value:new w(0,10,80)},yt=`
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
      #else
        col *= 1.0 - smoothstep(fogNear, fogFar, vFogDepth);
      #endif
    #endif`;{const e=new a.InstancedBufferGeometry,n=[.5,0,0],o=[.17,.14,0],s=[-.36,.035,0],r=[-.36,-.035,0],v=[.17,-.125,0],l=[-.34,0,0],i=[-.52,.15,0],u=[-.52,-.15,0],g=[-.44,0,0];e.setAttribute("position",new a.Float32BufferAttribute([...n,...o,...s,...n,...s,...r,...n,...r,...v,...l,...i,...g,...l,...g,...u,.42,0,0,-.26,0,.06,-.26,0,-.06],3)),e.setAttribute("aNrm",new a.Float32BufferAttribute([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],1));const f=new Float32Array(ue*4);for(let z=0;z<f.length;z++)f[z]=t();e.setAttribute("aS",new a.InstancedBufferAttribute(f,4)),e.instanceCount=ue,e.boundingSphere=new a.Sphere(Me.clone(),45);const H=new a.ShaderMaterial({uniforms:{...Ke(),...F,uSwirl:{value:Se}},fog:!0,clipping:!0,side:a.DoubleSide,vertexShader:Pe+`
        #include <common>
        #include <fog_pars_vertex>
        #include <clipping_planes_pars_vertex>
        attribute vec4 aS; attribute float aNrm; uniform vec4 uHcBall; uniform float uSwirl; uniform float uHcBurst;
        varying vec3 vN; varying vec3 vV; varying float vFlash; varying vec3 vB; varying float vRnd;
        vec3 fishPos(float t, out float flash, out float roll){
          // most of the school rides the outer shell, so from inside it is a swirling wall and from outside a solid ball;
          // the inner shell is a second lane streaming the other way round
          float lat = asin(clamp(aS.y * 2.0 - 1.0, -1.0, 1.0)), shell = mix(0.66, 1.0, sqrt(aS.x)), lane = aS.x < 0.2 ? -1.0 : 1.0;
          float om = uSwirl * lane * (0.5 + 0.16 * sin(lat * 3.0)) / max(shell, 0.5);
          float th = aS.z * 6.2832 + t * om;
          float breathe = 1.0 + 0.13 * sin(t * 0.7) + 0.07 * sin(t * 1.9 + 1.0);
          float lobe = 1.0 + 0.18 * sin(th * 2.0 - t * 0.6 + lat * 2.0) + 0.07 * sin(th * 5.0 + t * 1.3);
          lat += 0.12 * sin(t * 0.8 + aS.w * 6.2832 + th);
          flash = smoothstep(0.1, 1.0, sin(th * 2.0 - t * 2.4 * uSwirl + lat * 3.0));
          roll = 0.62 * sin(th * 3.0 - t * 2.1 * uSwirl + lat * 4.0 + aS.w * 1.6);      // bands of the school roll their flanks to the light together
          return vec3(cos(lat) * cos(th), sin(lat) * 0.56, cos(lat) * sin(th)) * uHcBall.w * shell * breathe * lobe; }
        void main(){
          float f0, f1, r0, r1; vec3 p0 = fishPos(uHcTime, f0, r0), p1 = fishPos(uHcTime + 0.08, f1, r1);
          vec3 fw = normalize(p1 - p0 + vec3(1e-4, 0.0, 0.0));
          float hn = (aS.w - 0.5) * 0.62 + 0.17 * sin(uHcTime * 1.7 + aS.z * 50.0);        // every fish holds its own heading, +-18 degrees and wandering
          fw = normalize(fw + cross(vec3(0.0, 1.0, 0.0), fw) * hn + vec3(0.0, (aS.y - 0.5) * 0.3 * sin(uHcTime * 1.3 + aS.x * 40.0), 0.0) + vec3(1e-4, 0.0, 0.0));
          float burst = uHcBurst * (1.1 + 2.6 * aS.w);
          vec3 P = uHcBall.xyz + p0 * (1.0 + burst);
          fw = normalize(mix(fw, normalize(p0 + 1e-3), clamp(uHcBurst * 3.0, 0.0, 0.9)));
          // the hole round the lens is a tunnel along the line of travel (z): the school parts sideways and streams round it
          vec3 dv = P - uHcAvoid.xyz; dv.z *= 0.55; float dl = length(dv);
          P.xy += dv.xy / max(length(dv.xy), 1e-3) * max(0.0, uHcAvoid.w - dl) * 0.95;
          P.y = clamp(P.y, ${(de+.6).toFixed(1)}, -0.3);
          vec3 sd0 = normalize(cross(vec3(0.0, 1.0, 0.0), fw) + vec3(0.0, 0.0, 1e-4)), up0 = cross(fw, sd0);
          float rc = cos(r0), rs = sin(r0); vec3 sdv = sd0 * rc + up0 * rs, up = up0 * rc - sd0 * rs;
          float dcam = length((modelViewMatrix * vec4(P, 1.0)).xyz);
          float sz = 0.4 * (0.75 + 0.5 * aS.w) * (1.0 + 1.5 * smoothstep(22.0, 85.0, dcam));    // stay a pixel or two tall far off
          float wag = sin(uHcTime * 13.0 + aS.z * 40.0) * smoothstep(0.1, -0.5, position.x) * 0.16;
          vec3 pos = P + (fw * position.x + up * position.y + sdv * (position.z + wag)) * sz;
          vHcP = pos; vFlash = f0; vB = vec3(position.xy, aNrm); vRnd = aS.w;
          vN = normalMatrix * (aNrm > 0.5 ? up : sdv);
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); vV = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
          #include <clipping_planes_vertex>
          #include <fog_vertex>
        }`,fragmentShader:`
        #include <common>
        #include <fog_pars_fragment>
        #include <clipping_planes_pars_fragment>
        `+Re+`
        varying vec3 vN; varying vec3 vV; varying float vFlash; varying vec3 vB; varying float vRnd;
        void main(){
          #include <clipping_planes_fragment>
          float dist = length(vV); vec3 N = normalize(vN), V = vV / max(dist, 1e-4); float nv = dot(N, V); if (nv < 0.0) N = -N;
          vec3 Lv = normalize((viewMatrix * vec4(uHcSun, 0.0)).xyz);
          // dark blue-green back, silver flank with a bright lateral stripe, pale belly, a dark eye
          float yb = vB.z > 0.5 ? (nv > 0.0 ? 0.9 : -0.9) : vB.y / 0.14;
          vec3 alb = mix(vec3(0.86, 0.9, 0.88), vec3(0.6, 0.72, 0.76), smoothstep(-0.9, -0.2, yb));
          alb = mix(alb, vec3(0.08, 0.2, 0.24), smoothstep(0.34, 0.72, yb));
          float stripe = smoothstep(0.2, 0.0, abs(yb - 0.08)) * step(vB.z, 0.5) * smoothstep(-0.36, -0.2, vB.x);
          alb = mix(alb, vec3(0.03, 0.05, 0.05), smoothstep(0.034, 0.02, length(vB.xy - vec2(0.37, 0.025))) * step(vB.z, 0.5));
          float diff = 0.3 + 0.7 * abs(dot(N, Lv));
          float spec = max(dot(reflect(-Lv, N), V), 0.0); spec = spec * spec; spec = spec * spec; spec = spec * spec * spec;
          float glance = 1.0 - abs(nv); glance = glance * glance;
          vec3 env = vec3(0.05, 0.12, 0.12);
          #ifdef USE_FOG
            env = fogColor * 1.7 + 0.04;                 // a silver fish mostly mirrors the water around it
          #endif
          vec3 col = alb * (uHcSunCol * 0.26 * diff + env * (0.6 + 0.4 * diff)) * (0.72 + 0.6 * vRnd);
          // a metallic flank whatever the light: silver-white below the lateral line, blue-green above it
          float flank = (1.0 - smoothstep(0.25, 0.7, yb)) * step(vB.z, 0.5);
          col = mix(col, vec3(0.5, 0.57, 0.58) * (0.6 + 0.55 * diff) * (0.8 + 0.4 * vRnd), flank * 0.78);
          col = mix(col, vec3(0.03, 0.05, 0.05), smoothstep(0.034, 0.02, length(vB.xy - vec2(0.37, 0.025))) * step(vB.z, 0.5));
          // the silver flash: the flank as a mirror for the light coming down through the surface; it fires in bands as the school rolls
          vec3 Ls = normalize((viewMatrix * vec4(normalize(uHcSun + vec3(0.0, 1.3, 0.0)), 0.0)).xyz);
          float mir = max(dot(reflect(-Ls, N), V), 0.0); mir *= mir; mir *= mir; mir = mir * mir * mir;      // ^12
          // the flash: a mirror flank catching the sun, strongest at glancing angles and where the school's wave passes
          vec3 glint = uHcSunCol * (spec * (0.5 + 3.0 * vFlash) + glance * vFlash * 0.7) * (0.35 + 0.65 * stripe)
                     + uHcSunCol * vFlash * vFlash * 0.35 * smoothstep(18.0, 60.0, dist)
                     + max(uHcSunCol, vec3(0.9)) * 1.25 * mir * (0.35 + 0.65 * vFlash) * step(vB.z, 0.5);
          // where the wave of the school rolls its flanks to the light, one fish in five is a blooming white blade
          float fire = smoothstep(0.5, 0.92, vFlash) * (0.55 + 0.45 * sin(uHcTime * 7.0 + vRnd * 61.0)) * mix(0.5, 1.0, smoothstep(2.5, 14.0, dist));
          glint += mix(vec3(1.0, 0.98, 0.9), vec3(0.85, 1.0, 0.97), vRnd) * 3.4 * fire * (0.3 + 0.7 * flank) * (0.45 + 0.55 * stripe + 0.3 * glance);
          col = hcApply(col, vec3(0.0), vHcP, dist);
          float ff = 0.0;
          #ifdef USE_FOG
            #ifdef FOG_EXP2
              ff = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
            #else
              ff = smoothstep(fogNear, fogFar, vFogDepth);
            #endif
            col = mix(col, fogColor, ff);
          #endif
          col += glint * (1.0 - 0.5 * ff) * (vHcP.y < 0.0 ? mix(vec3(1.0), uHcAbsorb, 0.35) : vec3(1.0));    // the glint cuts through half the haze
          gl_FragColor = vec4(col, 1.0);
        }`}),h=new a.Mesh(e,H);h.name="bait-ball",C.add(h)}{const e=ze(),n=new a.Color("#9c8a52"),o=new a.Color("#d9d2b4"),s=new a.Color("#7d6e40"),r=[.5,.47,.4,.28,.12,-.05,-.2,-.33,-.43,-.5],v=[.012,.04,.062,.078,.085,.078,.062,.042,.026,.018],l=[.02,.05,.066,.07,.068,.058,.044,.028,.014,.008],i=6;for(let m=0;m<r.length;m++)for(let x=0;x<=i;x++){const S=x/i*6.283,E=Math.cos(S),K=Math.sin(S);if(e.pos.push(r[m],E*v[m]*(E<0?.8:1),K*l[m]),e.nor.push(0,E,K),T.copy(o).lerp(n,Z(-.5,.2,E)),e.col.push(T.r,T.g,T.b),m<r.length-1&&x<i){const R=m*(i+1)+x;e.idx.push(R,R+1,R+i+1,R+1,R+i+2,R+i+1)}}const u=(m,x,S,E)=>{const K=e.pos.length/3;e.pos.push(...m,...x,...S);for(let R=0;R<3;R++)e.nor.push(...E),e.col.push(s.r,s.g,s.b);e.idx.push(K,K+1,K+2)};u([.16,.07,0],[-.02,.075,0],[-.03,.2,0],[0,.3,1]),u([-.16,.06,0],[-.3,.045,0],[-.31,.16,0],[0,.3,1]);for(const m of[-1,1])u([.26,-.035,m*.06],[.1,-.04,m*.06],[.06,-.09,m*.27],[0,1,0]);for(const m of[-1,1])u([-.12,-.05,m*.04],[-.2,-.045,m*.035],[-.21,-.08,m*.1],[0,1,0]);u([-.44,.02,0],[-.5,-.02,0],[-.74,.21,0],[0,.2,1]),u([-.44,0,0],[-.52,0,0],[-.6,-.1,0],[0,.2,1]);const g=_e(e),f=new a.InstancedBufferGeometry;f.index=g.index;for(const m of["position","normal","color"])f.setAttribute(m,g.getAttribute(m));const H=new Float32Array(ke*4),h=new Float32Array(ke*2);for(let m=0;m<ke;m++){const x=Oe+t.range(1.2,2.1);H.set([x,t.range(-4.6,-1.3),t.range(0,6.283)+m,(t.chance(.75)?-Se:Se)*t.range(1,1.6)/x],m*4),h.set([t.range(1.3,1.8),t()],m*2)}f.setAttribute("iA",new a.InstancedBufferAttribute(H,4)),f.setAttribute("iB",new a.InstancedBufferAttribute(h,2)),f.instanceCount=ke,f.boundingSphere=new a.Sphere(Me.clone(),16);const z=ie(new a.MeshStandardMaterial({vertexColors:!0,roughness:.55,side:a.DoubleSide}),F,"shark",{vHead:`attribute vec4 iA; attribute vec2 iB; uniform vec4 uHcBall;
`,vNormal:`
        float ang = iA.z + uHcTime * iA.w * (1.0 + uHcStrike * 2.0), rad = iA.x * (1.0 + 0.1 * sin(ang * 2.0 + iB.y * 7.0));
        vec3 base = vec3(uHcBall.x + cos(ang) * rad, iA.y + 0.5 * sin(uHcTime * 0.25 + iB.y * 20.0), uHcBall.z + sin(ang) * rad);
        vec3 dv = base - uHcAvoid.xyz; float dl = length(dv); base += dv / max(dl, 1e-3) * max(0.0, uHcAvoid.w + 1.2 - dl);
        vec3 fw = vec3(-sin(ang), 0.0, cos(ang)) * sign(iA.w), zax = cross(fw, vec3(0.0, 1.0, 0.0));
        vec3 pl = position;
        pl.z += sin(uHcTime * 4.2 - pl.x * 5.0 + iB.y * 30.0) * 0.085 * smoothstep(0.35, -0.6, pl.x);
        pl *= iB.x;
        vec3 pw = fw * pl.x + vec3(0.0, pl.y, 0.0) + zax * pl.z;
        objectNormal = normalize(fw * objectNormal.x + vec3(0.0, objectNormal.y, 0.0) + zax * objectNormal.z);`,vBody:"transformed = base + pw;"}),c=new a.Mesh(f,z);c.name="sharks",C.add(c)}const rt=new w(-O.x*.7,-1,-O.z*.7).normalize();{const n=[],o=[],s=[];for(let i=0;i<44;i++){const u=t.range(0,6.283),g=Math.sqrt(t())*21,f=Math.cos(u)*g,H=Math.sin(u)*g,h=t.range(.3,.9),z=t();for(const[c,m]of[[-1,0],[1,0],[-1,1],[1,1]])n.push(f,0,H),o.push(c,m,h,z);s.push(i*4,i*4+2,i*4+1,i*4+1,i*4+2,i*4+3)}const r=new a.BufferGeometry;r.setAttribute("position",new a.Float32BufferAttribute(n,3)),r.setAttribute("aD",new a.Float32BufferAttribute(o,4)),r.setIndex(s),r.boundingSphere=new a.Sphere(new w(0,-3,0),32);const v=new a.ShaderMaterial({uniforms:{...Ke(),...F,uCamL:Te,uRay:{value:rt}},fog:!0,clipping:!0,transparent:!0,depthWrite:!1,blending:a.AdditiveBlending,side:a.DoubleSide,vertexShader:Pe+`
        #include <common>
        #include <fog_pars_vertex>
        #include <clipping_planes_pars_vertex>
        attribute vec4 aD; uniform vec3 uCamL; uniform vec3 uRay; varying vec4 vD;
        void main(){
          vec3 c = position + uRay * aD.y * 7.2 + vec3(sin(uHcTime * 0.3 + aD.w * 30.0), 0.0, cos(uHcTime * 0.23 + aD.w * 17.0)) * 0.5;
          vec3 sd = normalize(cross(uRay, uCamL - c));
          vec3 pos = c + sd * aD.x * aD.z * 0.6 * (1.0 + aD.y * 0.8);
          vHcP = pos; vD = aD;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <clipping_planes_vertex>
          #include <fog_vertex>
        }`,fragmentShader:`
        #include <common>
        #include <fog_pars_fragment>
        #include <clipping_planes_pars_fragment>
        `+Re+`
        varying vec4 vD;
        void main(){
          #include <clipping_planes_fragment>
          float ac = cos(clamp(vD.x, -1.0, 1.0) * 1.5708); ac *= ac; ac *= ac;
          float al = smoothstep(0.0, 0.25, vD.y) * (1.0 - smoothstep(0.5, 1.0, vD.y));
          float fl = 0.55 + 0.45 * sin(uHcTime * 1.1 + vD.w * 40.0 + vD.y * 3.0);
          float streak = 0.6 + 0.4 * hcNoise(vec3(vD.x * 4.0 + vD.w * 9.0, uHcTime * 0.4, vD.w * 5.0));
          vec3 col = uHcSunCol * vec3(0.75, 1.0, 0.85) * ac * al * fl * streak * (uHcCamY < 0.0 ? 0.085 : 0.04);
          ${yt}
          gl_FragColor = vec4(col, 1.0);
        }`}),l=new a.Mesh(r,v);l.name="rays",l.renderOrder=3,C.add(l)}if(M.water!==!1){const e=new a.CircleGeometry(400,72);e.rotateX(-Math.PI/2);const n=new a.ShaderMaterial({uniforms:{...Ke(),...F,uCamL:Te,uTurq:{value:_},uHorizon:{value:N},uZenith:{value:new a.Color("#2F7FD0")},uTree:{value:D.clone().multiplyScalar(.45)}},fog:!0,transparent:!0,depthWrite:!1,side:a.DoubleSide,vertexShader:Pe+`
        #include <common>
        #include <fog_pars_vertex>
        void main(){ vHcP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        #include <common>
        #include <fog_pars_fragment>
        `+Re+`
        uniform vec3 uCamL; uniform vec3 uTurq; uniform vec3 uHorizon; uniform vec3 uZenith; uniform vec3 uTree;
        void main(){
          vec3 p = vHcP, V = uCamL - p; float dist = length(V); V /= dist; float t = uHcTime; vec2 q = p.xz;
          float w1 = cos(q.x * 0.9 + q.y * 0.3 + t * 1.1), w2 = cos(q.y * 1.7 + q.x * 0.5 - t * 1.4);
          vec2 gr = 0.05 * w1 * vec2(1.0, 0.33) + 0.04 * w2 * vec2(0.3, 1.0);
          float n1 = hcNoise(vec3(q * 2.3, t * 0.6)), n2 = hcNoise(vec3(q * 2.3 + vec2(0.2, 0.0), t * 0.6)), n3 = hcNoise(vec3(q * 2.3 + vec2(0.0, 0.2), t * 0.6));
          gr += vec2(n2 - n1, n3 - n1) * 0.55; gr /= 1.0 + dist * 0.015;
          vec3 N = normalize(vec3(-gr.x, 1.0, -gr.y));
          float sh = hcShade(vec3(p.x, 0.0, p.z)), dome = 1.0 - smoothstep(13.0, 27.0, length(q));
          vec3 col; float alpha;
          if (V.y > 0.0) {
            float fr = 0.02 + 0.98 * pow(1.0 - max(dot(N, V), 0.0), 5.0);
            vec3 R = reflect(-V, N); R.y = abs(R.y);
            vec3 sky = mix(uHorizon, uZenith, pow(clamp(R.y, 0.0, 1.0), 0.5));
            sky = mix(sky, uTree, dome * 0.8 * (1.0 - 0.5 * smoothstep(0.9, 1.3, sh)));
            vec3 body = uTurq * (0.5 + 0.3 * sh);
            float glint = pow(max(dot(R, uHcSun), 0.0), 500.0) * 30.0 + smoothstep(0.93, 1.0, hcNoise(vec3(q * 7.0, t * 1.5))) * smoothstep(1.0, 1.25, sh) * 1.2;
            col = mix(body, sky, fr) + uHcSunCol * glint * sh;
            alpha = mix(mix(0.42, 0.97, fr), 1.0, smoothstep(50.0, 220.0, dist));
          } else {      // seen from below: silver mirror with a bright Snell's window overhead
            float win = smoothstep(0.62, 0.74, -V.y + (n1 - 0.5) * 0.12);
            col = mix(uTurq * 0.75 + vec3(0.1) * n1, mix(uHorizon, uZenith, 0.4) * 1.5 * (0.6 + 0.5 * sh), win);
            alpha = mix(0.92, 0.55, win);
          }
          gl_FragColor = vec4(col, alpha);
          #include <fog_fragment>
        }`}),o=new a.Mesh(e,n);o.name="preview-water",o.renderOrder=2,C.add(o)}let st=0;C.traverse(e=>{if(e.isMesh){const n=e.geometry,o=(n.index?n.index.count:n.getAttribute("position").count)/3;st+=o*(n.isInstancedBufferGeometry?n.instanceCount:1)}});const wt={waterY:0,floorY:de,sunDir:O.toArray(),reveal:[0,.25,78],flyThrough:[[0,0,62],[0,0,42],[0,0,26],[0,-1.7,17],[0,-1.9,11],[0,-1.6,0],[0,0,-9],[0,0,-28],[0,0,-48]],duckRoot:{position:[0,.3,re+.3],clearBelow:-1.2,present:M.lintel!==!1},portalSeat:{position:[0,0,-68],facing:[0,0,1]},baitBall:{center:Me.toArray(),radius:Oe},crown:{center:[he.x,I+Xe,he.z],radius:pe},trunkBase:[0,7,0],viewpoints:{front:[0,.25,62],inside:[0,.25,3],side:[58,9,14],under:[0,-1.8,24]}};let me=null,Ne=2.6;const Q=new w;return{object:C,radius:27,height:41,center:new w(0,11,0),anchors:wt,ground:!0,groundY:de-1.45,uniforms:F,triangles:Math.round(st),baitBall:C.children.find(e=>e.name==="bait-ball"),fishCount:ue,airOnly:C.children.filter(e=>["crown-cores","leaves","ibis"].includes(e.name)),seaOnly:C.children.filter(e=>["sponges","algae-grass","sand","bait-ball","sharks","rays"].includes(e.name)),setEye(e){Q.setFromMatrixPosition(e.matrixWorld),C.worldToLocal(Q),Te.value.copy(Q),F.uHcCamY.value=Q.y,me||F.uHcAvoid.value.set(Q.x,Q.y,Q.z,Ne)},update(e,n,o){F.uHcTime.value=n,o&&(Q.setFromMatrixPosition(o.matrixWorld),C.worldToLocal(Q),Te.value.copy(Q),F.uHcCamY.value=Q.y,me||F.uHcAvoid.value.set(Q.x,Q.y,Q.z,Ne)),me&&F.uHcAvoid.value.set(me.x,me.y,me.z,Ne)},setStrike(e,n){F.uHcStrike.value=xe(e,0,1),F.uHcBurst.value=xe(n??e,0,1)},setProgress(e){F.uHcStrike.value=F.uHcBurst.value=xe(e,0,1)},setAvoid(e,n){me=e?new w().copy(e):null,n!==void 0&&(Ne=n)},setLight(e={}){e.sunDir&&(O.copy(e.sunDir).normalize(),rt.set(-O.x*.7,-1,-O.z*.7).normalize()),e.sunColor&&F.uHcSunCol.value.copy(e.sunColor),e.absorb&&F.uHcAbsorb.value.copy(e.absorb),e.haze&&(F.uHcHaze.value.x=e.haze.r,F.uHcHaze.value.y=e.haze.g,F.uHcHaze.value.z=e.haze.b),e.hazeDensity!==void 0&&(F.uHcHaze.value.w=e.hazeDensity)},dispose(){}}}export{Re as HC_FRAG,Pe as HC_PARS,Bt as LEAF_OPTS,Pt as POD_OPTS,At as SPONGE_OPTS,Ct as SWAY_OPTS,Mt as WOOD_FCOLOR,Ht as WOOD_FHEAD,St as WOOD_OPTS,zt as WOOD_VHEAD,Tt as buildHero,_e as finish,ct as finishAsync,lt as icoIndexed,ze as makeBuilder,_t as makeLeafTexture,ie as patch,Ve as tube};
