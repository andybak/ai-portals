import*as n from"three";import{clamp as W,lerp as re,makePath as Pt}from"../kit/core.js";const Qe=["#F6F0E2","#3255A4","#FF48B0","#FFB511","#321871","#FF330C","#323C0B"],V=Math.PI*2,Se={exposure:1,dim:.7,grade:[1.05,1.04]},X=1,Fe=(o,e=new n.Vector3)=>{const a=parseInt(String(o).replace("#",""),16);return e.set((a>>16&255)/255,(a>>8&255)/255,(a&255)/255)},Ne=`
uniform vec3 uSunDir;      // unit vector TOWARD the sun (world space)
uniform vec4 uHaze;        // x: distance by which pink and yellow are gone (8000), y: blue haze tone (.22), z: blue haze distance, w: unused
uniform float uTime;
// shade: light is ink. lit = N.L (-1..1). k scales how much ink the shadow may add (white birds use a small k).
vec3 inkShade(vec3 ink, float lit, float k){
  float s = (1. - smoothstep(-.45, .35, lit)) * k;
  ink.g += (1. - ink.g) * clamp(s * .62, 0., 1.);                 // turning faces take blue first
  ink.r += (1. - ink.r) * smoothstep(.6, 1., s) * .55;            // the deepest shadow adds pink: plum, never grey
  return ink;
}
// haze removes ink: pink and yellow thin to nothing, blue settles to the haze tone
vec3 inkHaze(vec3 ink, float dist){
  float h = clamp(dist / max(uHaze.x, 1.), 0., 1.); h = 1. - (1. - h) * (1. - h);
  float hb = (1. - exp(-dist / max(uHaze.z, 1.))) * smoothstep(0., .08, max(ink.g, max(ink.r, ink.b)));   // paper stays paper
  ink.r *= 1. - h; ink.b *= 1. - h;
  ink.g = mix(ink.g, uHaze.y, hb);
  return ink;
}
vec4 inkOut(vec3 ink, float viewDepth){ return vec4(clamp(ink, 0., 1.), 8. / (8. + max(viewDepth, 0.))); }
float inkHash(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float inkNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(inkHash(i), inkHash(i + vec2(1., 0.)), f.x), mix(inkHash(i + vec2(0., 1.)), inkHash(i + vec2(1., 1.)), f.x), f.y); }
`,Bt="void main(){ gl_Position = vec4(position.xy, 0., 1.); }",At=`precision highp float;
uniform sampler2D tPlates; uniform vec2 uRes; uniform float uPx, uTime, uExposure, uLine, uFarClamp, uDebug, uFibre, uDim;
uniform vec3 uPaper, uPink, uBlue, uYellow, uWander; uniform vec2 uProj, uGrade; uniform mat3 uInvOut, uInvIn;
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
float nearness(float a){ return smoothstep(.242, .6, a); }                 // 0 at 25 m and beyond, 1 inside 5 m
vec3 toLin(vec3 c){ return mix(c / 12.92, pow((max(c, 0.) + .055) / 1.055, vec3(2.4)), step(.04045, c)); }
// inverse of the engine's tone curve (col/.6 -> ACES fit), so that what reaches the screen is the printed colour
vec3 invTone(vec3 d){
  vec3 y = clamp(uInvOut * d, 0., .985);
  vec3 A = 1. - .983729 * y, B = .0245786 - .432951 * y, C = -(.000090537 + .238081 * y);
  vec3 v = (-B + sqrt(max(B * B - 4. * A * C, 0.))) / max(2. * A, vec3(1e-3));
  return max(uInvIn * v, 0.) * .6;
}
void main(){
  vec2 fc = gl_FragCoord.xy, uv = fc / uRes, dp = fc / uPx, px = uPx / uRes;   // dp: design pixels (450 to the page height)
  // ---- register: blue wanders toward lower right (11 s), pink toward upper left (17 s), yellow stays. Never opposed on one axis.
  const vec2 dirB = vec2(.8660, -.5), dirP = vec2(-.3420, .9397);
  float wB = uWander.x * 1.5 * (.5 + .5 * sin(6.28318 * uTime / 11.));
  float wP = uWander.y * 1.2 * (.5 + .5 * sin(6.28318 * uTime / 17. + 1.3));
  vec4 s0 = textureLod(tPlates, uv, 0.); float aC = s0.a;
  float nB = nearness(max(aC, textureLod(tPlates, uv - dirB * 4. * px, 0.).a));
  float nP = nearness(max(aC, textureLod(tPlates, uv - dirP * 4. * px, 0.).a));
  vec2 oB = (dirB * min(wB + 2.5 * nB, 4.) + vec2(.5, .866) * .25 * sin(uTime * .37)) * px;
  vec2 oP = (dirP * min(wP + 2.5 * nP, 4.) + vec2(.94, .342) * .25 * sin(uTime * .29 + 2.)) * px;
  // a plate slips as a whole, but a form thinner than the slip (a wing seen edge-on, a bill, a far tick) would be torn into
  // loose specks of single inks: where a value differs from both its neighbours along the slip, it holds register
  float b1 = textureLod(tPlates, uv - oB, 0.).g, b2 = textureLod(tPlates, uv + oB, 0.).g, b3 = textureLod(tPlates, uv - 2. * oB, 0.).g;
  float p1 = textureLod(tPlates, uv - oP, 0.).r, p2 = textureLod(tPlates, uv + oP, 0.).r, p3 = textureLod(tPlates, uv - 2. * oP, 0.).r;
  float kB = max(clamp((min(abs(s0.g - b1), abs(s0.g - b2)) - abs(b1 - b2)) * 4., 0., 1.), clamp((min(abs(b1 - s0.g), abs(b1 - b3)) - abs(s0.g - b3)) * 4., 0., 1.));
  float kP = max(clamp((min(abs(s0.r - p1), abs(s0.r - p2)) - abs(p1 - p2)) * 4., 0., 1.), clamp((min(abs(p1 - s0.r), abs(p1 - p3)) - abs(s0.r - p3)) * 4., 0., 1.));
  float tb = mix(b1, s0.g, kB), tp = mix(p1, s0.r, kP);
  float ty = uWander.z > 0. ? textureLod(tPlates, uv + uWander.z * vec2(0., 1.) * px, 0.).b : s0.b;
  // ---- blue: round dots, pitch 6 px, 75 degrees; radius from the tone at this pixel. One seed in four: a line screen.
  vec2 q = mat2(.258819, .965926, -.965926, .258819) * dp * (6.28318 / 6.);
  float Td = .5 - .25 * (cos(q.x) + cos(q.y));
  float Tl = .5 - .5 * cos(q.x * 1.2);
  float T = mix(Td, Tl, uLine);
  float e = .3 / sqrt(max(uPx, 1.));
  float tb2 = tb * (1. + 2. * e) - e + smoothstep(.88, .94, tb) * .4;
  float b = smoothstep(-e, e, tb2 - T);
  // ---- pink: static grain of 2 px specks
  vec2 cell = floor(dp * .5);
  float Tp = fract(52.9829189 * fract(dot(cell, vec2(.06711056, .00583715))) + .31 * h21(cell));
  float p = smoothstep(-.06, .06, tp * 1.14 - .07 - Tp);
  // ---- yellow: flat, on or off at 50 percent, times roller bands 90 px deep
  float band = .96 + .04 * sin(6.28318 * dp.y / 90. + 1.7 * sin(dp.x * .013));
  float yl = smoothstep(.42, .58, ty) * band;
  // ---- paper with fibre
  float fib = h21(floor(dp * vec2(.45, 1.6))) * .6 + h21(floor(dp * 1.3 + 7.)) * .4;
  vec3 col = uPaper * (1. - uFibre * fib);
  if (uDebug > .5) { p *= step(abs(uDebug - 1.), .1); b *= step(abs(uDebug - 2.), .1); yl *= step(abs(uDebug - 3.), .1); }
  col *= mix(vec3(1.), uPink, p) * mix(vec3(1.), uBlue, b) * mix(vec3(1.), uYellow, yl);
  vec3 lin = toLin(col) * uDim;
  float l = dot(lin, vec3(.2126, .7152, .0722));
  lin = (lin - .5) / uGrade.y + .5; lin = max(mix(vec3(l), lin, 1. / uGrade.x), 0.);     // undo the grade's contrast and saturation
  gl_FragColor = vec4(invTone(lin) / max(uExposure, .01), 1.);
  float d = clamp(8. * (1. - aC) / max(aC, 1e-5), 13., uFarClamp);
  gl_FragDepth = clamp(((uProj.y - uProj.x * d) / d) * .5 + .5, 0., 1.);
}`;function Tt(o={}){const e=o.palette||Qe,a={uSunDir:{value:(o.sunDir?o.sunDir.clone():new n.Vector3(0,Math.sin(64*Math.PI/180),Math.cos(64*Math.PI/180))).normalize()},uHaze:{value:new n.Vector4(o.hazeInk??8e3,o.hazeTone??.22,o.hazeBlue??5200,0)},uTime:{value:0}},d=s=>new n.Matrix3().set(s[0],s[3],s[6],s[1],s[4],s[7],s[2],s[5],s[8]),f=d([.59719,.076,.0284,.35458,.90834,.13383,.04823,.01566,.83777]),r=d([1.60475,-.10208,-.00327,-.53108,1.10813,-.07276,-.07367,-.00605,1.07602]),p={tPlates:{value:null},uRes:{value:new n.Vector2(800,450)},uPx:{value:1},uTime:a.uTime,uExposure:{value:o.exposure??3},uLine:{value:o.lineScreen?1:0},uFarClamp:{value:o.farClamp??1500},uDim:{value:o.dim??1},uDebug:{value:o.debugPlate??0},uFibre:{value:.03},uPaper:{value:Fe(o.paper||e[0])},uBlue:{value:Fe(e[1])},uPink:{value:Fe(e[2])},uYellow:{value:Fe(e[3])},uWander:{value:new n.Vector3(1,1,0)},uProj:{value:new n.Vector2(-1,-1)},uGrade:{value:new n.Vector2(1,1)},uInvOut:{value:r.clone().invert()},uInvIn:{value:f.clone().invert()}},g=new n.BufferGeometry;g.setAttribute("position",new n.BufferAttribute(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3));const u=new n.ShaderMaterial({uniforms:p,vertexShader:Bt,fragmentShader:At,depthFunc:n.AlwaysDepth,depthTest:!0,depthWrite:!0,fog:!1,toneMapped:!1}),i=new n.Mesh(g,u);i.frustumCulled=!1,i.renderOrder=-1e3,i.layers.set(0),i.name="riso-page";const x={...a,uPx:p.uPx,uSkyTone:{value:new n.Vector4(o.skyTop??.58,o.skyHorizon??.12,o.skyGold??0,o.backdrop===!1?0:1)}},v=new n.Mesh(new n.IcosahedronGeometry(1,4),new n.ShaderMaterial({uniforms:x,side:n.BackSide,depthWrite:!1,depthTest:!1,fog:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:"precision highp float;"+Ne+`
      uniform vec4 uSkyTone; uniform float uPx; varying vec3 vDir;
      void main(){
        vec3 d = vDir / max(length(vDir), 1e-5); float h = d.y;
        float up = smoothstep(0., .66, h);                                   // (the dots swell quickly above the paper horizon, so a level gaze has blue behind its white birds)
        float blue = mix(uSkyTone.y, uSkyTone.x, pow(max(up, 0.), .75));
        blue *= smoothstep(.0, .055, h) * .9 + .1;                         // the band of bare-paper haze on the horizon
        // golden hour: a low band of flat yellow on the sun's side only, thinning away round the horizon; its top edge wanders
        // and is torn into dry-roller streaks, and a sliver of bare paper is left between it and the horizon
        vec2 hz = d.xz / max(length(d.xz), 1e-4), sz = uSunDir.xz / max(length(uSunDir.xz), 1e-4);
        float toSun = smoothstep(-.35, .75, dot(hz, sz));
        float gTop = .02 + (.03 + .045 * inkNoise(hz * 6. + 3.) + .02 * inkNoise(hz * 19.)) * toSun;
        float streak = inkNoise(vec2(dot(hz, vec2(-sz.y, sz.x)) * 25., h * 220.));
        // (its upper edge is not a cut: over about 60 design px the plate thins into paper through its own dot screen, 7 px
        // pitch at 15 degrees, nailed to the page like the blue one)
        float yTone = 1. - smoothstep(gTop - .035, gTop + .07 + .03 * toSun, h + .03 * streak);
        vec2 yq = mat2(.965926, .258819, -.258819, .965926) * (gl_FragCoord.xy / max(uPx, .25)) * (6.28318 / 7.);
        float yT = .5 - .25 * (cos(yq.x) + cos(yq.y));
        float yel = uSkyTone.z * smoothstep(.014, .02, h) * smoothstep(-.07, .07, yTone * 1.16 - .08 - yT) * step(.06, toSun);
        float dn = max(-h, 0.), dist = 1. / max(dn, .004);
        vec2 sp = d.xz * dist;
        float v = sp.y * 5. + inkNoise(sp * vec2(.7, 2.)) * 1.6 + uTime * .08, fw = max(fwidth(v), 1e-4);   // derivative taken outside the branch
        if (h < 0.) {                                                      // below the horizon: a stand-in strait (viewer backdrop)
          float f = abs(fract(v) - .5);
          float lines = (1. - smoothstep(.03 + fw * .5, .03 + fw * 1.5, f)) * (1. - smoothstep(.12, .45, fw)) * smoothstep(.5, .66, inkNoise(sp * vec2(.9, 3.) + 7.));
          float sea = mix(.7, .88, inkNoise(sp * .35)) * (1. - lines * .9);
          blue = mix(.2, mix(uSkyTone.y + .1, sea, smoothstep(0., .07, dn)), uSkyTone.w);
          blue = mix(blue, blue * (.1 + .9 * smoothstep(0., .02, dn)), uSkyTone.w);
          yel = 0.;
        }
        gl_FragColor = vec4(0., clamp(blue, 0., 1.), yel, 0.0004);
      }`}));v.frustumCulled=!1,v.renderOrder=-100,v.layers.set(X),v.name="riso-sky";const w=new Map,l=new n.PerspectiveCamera;l.matrixAutoUpdate=!1,l.matrixWorldAutoUpdate=!1,l.layers.set(X);const h=new n.Vector2,k=new n.Color;let S=!1;const c={page:i,sky:v,shared:a,uniforms:p,layer:X,skyUniforms:x,beforePrint:null};return i.onBeforeRender=(s,B,z)=>{if(S)return;const L=s.getRenderTarget();L?h.set(L.width,L.height):s.getDrawingBufferSize(h);const U=o.samples??(L?L.samples:0),E=h.x+"x"+h.y+"s"+U;let A=w.get(E);if(A)w.delete(E),w.set(E,A);else{if(w.size>=2){const G=w.keys().next().value;w.get(G).dispose(),w.delete(G)}A=new n.WebGLRenderTarget(h.x,h.y,{type:n.HalfFloatType,format:n.RGBAFormat,samples:U,depthBuffer:!0,minFilter:n.LinearFilter,magFilter:n.LinearFilter,generateMipmaps:!1}),A.texture.colorSpace=n.NoColorSpace,w.set(E,A)}l.matrixWorld.copy(z.matrixWorld),l.matrixWorldInverse.copy(z.matrixWorldInverse),l.projectionMatrix.copy(z.projectionMatrix),l.projectionMatrixInverse.copy(z.projectionMatrixInverse),l.near=z.near,l.far=z.far,l.fov=z.fov,l.aspect=z.aspect,l.position.setFromMatrixPosition(z.matrixWorld),v.parent&&(v.position.copy(l.position),v.parent.worldToLocal(v.position),v.scale.setScalar(z.far*.9),v.updateMatrixWorld(!0)),c.beforePrint&&c.beforePrint(l,h);const R=z.projectionMatrix.elements;p.uProj.value.set(R[10],R[14]),p.uRes.value.copy(h),p.uPx.value=Math.max(.5,h.y/450);const I=s.xr.enabled,q=s.shadowMap.autoUpdate,ee=s.autoClear,_=s.getClearAlpha();s.getClearColor(k),S=!0,s.xr.enabled=!1,s.shadowMap.autoUpdate=!1,s.autoClear=!0,s.setRenderTarget(A),s.setClearColor(0,0),s.state.buffers.depth.setMask(!0),s.clear(),s.render(B,l),s.setRenderTarget(L),s.setClearColor(k,_),s.xr.enabled=I,s.shadowMap.autoUpdate=q,s.autoClear=ee,S=!1,p.tPlates.value=A.texture},c.setExposure=s=>{p.uExposure.value=s},c.setGrade=(s=1,B=1)=>{p.uGrade.value.set(s,B)},c.setSun=s=>{a.uSunDir.value.copy(s).normalize()},c.setDebugPlate=s=>{p.uDebug.value=s},c.setTime=s=>{a.uTime.value=s},c.ink=s=>(s.traverse(B=>B.layers.set(X)),s),c.dispose=()=>{for(const s of w.values())s.dispose();w.clear(),p.tPlates.value=null},c}function St(o,e={}){const a={...o.shared,uShadeK:{value:e.shade??1},...e.uniforms||{}};return new n.ShaderMaterial({uniforms:a,side:e.side??n.FrontSide,fog:!1,toneMapped:!1,vertexShader:`
      attribute vec3 ink; varying vec3 vInk, vNormal, vWorld; varying float vDepth;
      uniform float uTime;
      ${e.vertexPre||""}
      void main(){
        vec3 p = position, n = normal, inkV = ink;
        ${e.vertexMain||""}
        #ifdef USE_INSTANCING
          vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.); vNormal = mat3(modelMatrix) * mat3(instanceMatrix) * n;
        #else
          vec4 w = modelMatrix * vec4(p, 1.); vNormal = mat3(modelMatrix) * n;
        #endif
        vWorld = w.xyz; vInk = inkV; vec4 mv = viewMatrix * w; vDepth = -mv.z; gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`precision highp float;
      ${Ne}
      uniform float uShadeK; varying vec3 vInk, vNormal, vWorld; varying float vDepth;
      ${e.fragmentPre||""}
      void main(){
        vec3 ink = vInk; vec3 n = vNormal / max(length(vNormal), 1e-5); if (!gl_FrontFacing) n = -n;
        float lit = dot(n, uSunDir), shadeK = uShadeK;
        ${e.fragmentMain||""}
        ink = inkShade(ink, lit, shadeK);
        ${e.haze===!1?"":"ink = inkHaze(ink, vDepth);"}
        gl_FragColor = inkOut(ink, vDepth);
      }`})}const y=[0,0,0],et=[1,1,0],J=[1,0,1],K=0,tt=1,at=2,Ft=3,H=4,Q=4.25,ot=5,ve=.07,Oe=.632;class nt{constructor(){this.P=[],this.K=[],this.A=[],this.U=[],this.I=[],this.n=0}v(e,a,d,f,r,p=0,g=0){return this.P.push(e,a,d),this.K.push(f[0],f[1],f[2]),this.A.push(r[0],r[1],r[2],r[3]),this.U.push(p,g),this.n++}tri(e,a,d){this.I.push(e,a,d)}quad(e,a,d,f){this.I.push(e,a,d,e,d,f)}build(){const e=new n.BufferGeometry;return e.setAttribute("position",new n.Float32BufferAttribute(this.P,3)),e.setAttribute("ink",new n.Float32BufferAttribute(this.K,3)),e.setAttribute("aPart",new n.Float32BufferAttribute(this.A,4)),e.setAttribute("aUV",new n.Float32BufferAttribute(this.U,2)),e.setIndex(this.I),e.computeVertexNormals(),e}}function st(o,e,a,d=!0){const f=[];for(const u of e){const i=[];for(let x=0;x<a;x++){const v=x/a*V+Math.PI/a,w=Math.sin(v),l=Math.cos(v),h=w<0?.86:1,k=u[5]===Q?1:0;i.push(o.v(l*u[2],u[1]+w*u[3]*h,u[0],u[4],[0,u[5],0,u[6]],k*l*u[2],k*w*u[3]*h))}f.push(i)}for(let u=0;u<f.length-1;u++)for(let i=0;i<a;i++){const x=(i+1)%a;o.quad(f[u][i],f[u][x],f[u+1][x],f[u+1][i])}if(d){const u=o.v(0,e[0][1],e[0][0]-e[0][2]*.6,e[0][4],[0,e[0][5],0,e[0][6]]);for(let i=0;i<a;i++)o.tri(u,f[0][(i+1)%a],f[0][i])}const r=e[e.length-1],p=o.v(0,r[1],r[0]+r[2]*.8,r[4],[0,r[5],0,r[6]]),g=f[f.length-1];for(let u=0;u<a;u++)o.tri(p,g[u],g[(u+1)%a])}const it=o=>.17+.07*Math.sin(Math.min(o/.68,1)*Math.PI*.8)-.03*o,rt=o=>-.17+.05*o;function We(o){const e=new nt,a=o===0;if(st(e,a?[[-.3,.004,.022,.018,y,K,0],[-.25,0,.062,.05,y,K,0],[-.16,-.004,.09,.075,y,K,0],[-.04,-.008,.104,.09,y,K,0],[.08,-.006,.1,.088,y,K,0],[.17,0,.078,.072,y,K,0],[.24,.008,.046,.046,y,H,0],[.33,.012,.033,.034,y,H,.3],[.43,.016,.029,.03,y,H,.65],[.5,.022,.031,.034,y,H,.9],[.545,.03,.041,.044,y,H,1],[.585,.03,.036,.038,y,H,1],[.61,.024,.024,.026,y,H,1]]:[[-.29,.004,.03,.025,y,K,0],[-.17,-.004,.088,.074,y,K,0],[.04,-.008,.104,.09,y,K,0],[.18,0,.074,.07,y,K,0],[.26,.01,.04,.04,y,H,.05],[.46,.018,.03,.031,y,H,.75],[.55,.03,.041,.044,y,H,1],[.61,.024,.024,.026,y,H,1]],a?8:5),st(e,a?[[.605,.022,.021,.023,J,Q,1],[.68,.016,.016,.017,J,Q,1],[.76,.01,.01,.01,J,Q,1],[.835,.004,.003,.003,J,Q,1]]:[[.605,.022,.021,.023,J,Q,1],[.72,.013,.013,.013,J,Q,1],[.835,.004,.003,.003,J,Q,1]],a?6:4,!1),a)for(const x of[-1,1]){const v=[1,1,0],w=[0,H,0,1],l=x*.0425,h=e.v(l,.04,.575,v,w),k=e.v(l,.05,.562,v,w),S=e.v(l,.04,.549,v,w),c=e.v(l,.031,.562,v,w);x>0?e.quad(h,k,S,c):e.quad(c,S,k,h)}{const x=a?4:2,v=[],w=[];for(let l=0;l<=x;l++){const h=l/x*2-1;v.push(e.v(h*.055,.012,-.24,y,[0,ot,0,0])),w.push(e.v(h*.115,.006-Math.abs(h)*.008,-.45+h*h*.035,y,[0,ot,0,1]))}for(let l=0;l<x;l++)e.quad(v[l],v[l+1],w[l+1],w[l])}for(const x of[-1,1]){const v=x*.034,w=a?[[-.16,-.05,.02],[-.3,-.045,.013],[-.41,-.04,.017],[-.52,-.035,.011],[-.63,-.032,.011],[-.68,-.034,.02],[-.76,-.04,.005]]:[[-.16,-.05,.019],[-.5,-.037,.015],[-.76,-.04,.008]],l=[];for(let h=0;h<w.length;h++){const k=[],S=h>=w.length-2?1.8:1;for(let c=0;c<3;c++){const s=c/3*V+Math.PI/2,B=Math.cos(s)*w[h][2]*S,z=Math.sin(s)*w[h][2];k.push(e.v(v+B,w[h][1]+z,w[h][0],J,[0,Ft,x,h/(w.length-1)],B,z))}l.push(k)}for(let h=0;h<l.length-1;h++)for(let k=0;k<3;k++){const S=(k+1)%3;e.quad(l[h][k],l[h][S],l[h+1][S],l[h+1][k])}}const p=a?10:4,g=a?5:2,u=.68,i=Oe+.37;for(const x of[1,-1]){const v=[];for(let c=0;c<=p;c++){const s=c/p*u,B=s/u*Oe,z=it(s),L=rt(s),U=[];for(let E=0;E<=g;E++){const A=E/g,R=Math.pow(A,.85),I=.045+.022*Math.sin(Math.PI*Math.pow(A,.7))*(1-.4*s)-.012*A;U.push(e.v(x*(ve+B),I,re(z,L,R),y,[x*Math.max(B,.001),tt,0,A],B/i,R))}v.push(U)}for(let c=0;c<p;c++)for(let s=0;s<g;s++)x>0?e.quad(v[c][s],v[c+1][s],v[c+1][s+1],v[c][s+1]):e.quad(v[c][s+1],v[c+1][s+1],v[c+1][s],v[c][s]);const w=it(u),l=rt(u),h=8,k=[.33,.37,.37,.34,.3,.26,.22,.19],S=a?[0,.3,.6,.86,1]:[0,.5,1];for(let c=0;c<h;c++){const s=.07+c*.122,B=(-13+9.5*c)*Math.PI/180,z=k[c],L=Oe-.03,U=re(w,l,s),E=.05-.012*s-.0035*c,A=Math.cos(B),R=-Math.sin(B),I=Math.sin(B),q=Math.cos(B),ee=c<6?.03:.036,_=[],G=[],te=!a&&c>=6?[0,1]:S;for(const P of te){const j=ee*(1-.3*P)*(P>.99?.28:P>.8?.8:1),$=L+A*z*P,we=U+R*z*P,be=E+.01*P;_.push(e.v(x*(ve+$+I*j),be,we+q*j,et,[x*($+I*j),at,c,P],($+I*j)/i,1)),G.push(e.v(x*(ve+$-I*j),be,we-q*j,et,[x*($-I*j),at,c,P],($-I*j)/i,-1))}for(let P=0;P<te.length-1;P++)x>0?e.quad(_[P],_[P+1],G[P+1],G[P]):e.quad(G[P],G[P+1],_[P+1],_[P])}}return e.build()}function Ct(){const o=new nt;for(const p of[1,-1]){const u=[[0,.18,0,0],[0,-.17,0,1],[1,-.05,1,.5]].map(i=>o.v(p*(ve+i[0]),.03,i[1],y,[p*Math.max(i[0],.001),tt,0,i[3]],i[2],i[3]));p>0?o.tri(u[0],u[2],u[1]):o.tri(u[1],u[2],u[0])}const e=[0,K,0,0],a=o.v(0,.03,.8,y,e,0,0),d=o.v(.085,.03,.1,y,e,0,0),f=o.v(0,.03,-.62,y,e,0,.2),r=o.v(-.085,.03,.1,y,e,0,0);return o.quad(a,d,f,r),o.build()}const ge=1620,Ce=288,Et=`
attribute vec3 ink; attribute vec4 aPart; attribute vec2 aUV;
#ifndef SOLO
attribute vec4 iA;   // radius, phase offset, height offset, rate factor   (file birds: -, -, metres along the file, -)
attribute vec4 iB;   // seed, size, kind (0 column, 1 file near, 2 file far, 3 funnel, 4 escort), foot (1: radius follows the thermal's profile; escort: group 0 | 1)
#endif
#ifdef FUNNEL
attribute vec4 iC;   // funnel birds: centre of the bird's circle (local x, y, z), bank.  iA = radius, phase, 0, turn rate
#endif               // escort birds: iA = radius, lead on the camera's phase, height below the camera, extra bank
uniform float uTime, uPhase, uAlt, uH, uBubble, uBufH, uMinPx, uWave, uBlack, uChordPx, uStair, uStair2, uHook, uSlant, uCalm;
uniform vec4 uBend; uniform float uLift;
uniform vec2 uLean, uFunBand, uEsc; uniform vec4 uFile; uniform vec4 uSolo; uniform vec4 uBaseC, uRing;
varying vec3 vInk, vN; varying vec4 vPart; varying vec2 vUV; varying float vDepth, vSeed, vPx, vBase, vWhite, vFile;
#ifndef SOLO
// the departing file's line: s metres from its start. It leaves on the line of the last straight (a little to its left and
// above), passes lower left of the ring and from uBend.x on swings away to the left (uBend.y: the slope it settles to,
// uBend.z: metres over which it turns), sinking uBend.w to the metre
vec3 fileAt(float s){
  float e = max(1. - s / 80., 0.), t = max(s - uBend.x, 0.);
  return uFile.xyz + vec3(uHook * e * e + uSlant * s + uBend.y * (t - uBend.z * (1. - exp(-t / max(uBend.z, 1.)))), -uBend.w * s + uLift * (1. - exp(-max(s - 40., 0.) / 40.)), s);
}
#endif
void main(){
  vec3 p = position, n = normal; float part = aPart.y; vWhite = 0.; vFile = 0.;
  float seed, size = 1., env, legDrop, bank = 0., grow = 1., yAlt = 600.;
  vec3 c = vec3(0.), fwd = vec3(0., 0., 1.), outw = vec3(1., 0., 0.), upB = vec3(0., 1., 0.); float endOn = 0., skyK = 0.;
#ifdef SOLO
  seed = uSolo.y; env = uSolo.x; legDrop = uSolo.z;
#else
  seed = iB.x; size = iB.y;
  if (iB.z < .5) {
    yAlt = mod(iA.z + uAlt, max(uH, 1.));
    float r = iA.x * mix(1., mix(.42, 1., smoothstep(0., 520., yAlt)), iB.w);
    float phi = uPhase * iA.w + iA.y;
    c = vec3(r * sin(phi), yAlt, -r * cos(phi)); c.xz += uLean * (yAlt - uAlt);
    fwd = vec3(cos(phi), 0., sin(phi)); outw = vec3(sin(phi), 0., -cos(phi));
    bank = clamp(atan(20. / max(r, 4.)), .1, .62);
    bank += .09 * sin(uTime * .9 + seed * 40.) + .17 * sin(6.28318 * (uTime / max(uWave, 1.) - yAlt / 420.) + seed * .8);
    grow = smoothstep(0., 7., yAlt) * (1. - smoothstep(uH - 5., uH, yAlt));
#ifdef TICK
    // the look back down (uCalm 1): of the column below the lens only one tick in five is left, and none deeper than 380 m,
    // so the page under the rings is sea and coast and not confetti
    grow *= mix(1., step(fract(seed * 7.7), .2) * (1. - smoothstep(140., 380., uAlt - yAlt)), uCalm * smoothstep(30., 60., uAlt - yAlt));
#endif
#ifndef TICK
    grow *= 1. - smoothstep(uFunBand.x - 14., uFunBand.x - 4., yAlt) * (1. - smoothstep(uFunBand.y + 2., uFunBand.y + 10., yAlt));   // the lanes end where the funnel begins: its rings stand alone
#endif
    float lab = 1. - smoothstep(20., 85., yAlt);                                  // labouring up from the scrub
    float cyc = fract(uTime / (9. + 7. * seed) + seed * 7.);
    env = max(lab, smoothstep(0., .03, cyc) * (1. - smoothstep(.1, .14, cyc)));     // a few flaps when it slips out of lift
    float lc = fract(uTime / (13. + 9. * fract(seed * 5.3)) + seed * 3.);
    legDrop = max(lab * .8, smoothstep(0., .06, lc) * (1. - smoothstep(.16, .3, lc)) * step(.55, fract(seed * 9.7)));
  }
#ifdef FUNNEL
  else if (iB.z > 3.5) {
    // the escorts: storks that keep station on the lens (locked to the camera's phase and height). Group 0 is the stair
    // ahead (uStair), group 1 the companions inside the turn for the look back down (uStair2); each waits 46 m below
    float st = mix(uStair, uStair2, iB.w);
    // no escort is nailed to its station: each wanders round it on its own slow periods (uEsc.y is the escorts' clock, which
    // the world runs on with the climb): 3 to 5 m forward and back along the lane (less for the nearest), 2 m across it,
    // 1.3 m in height, so the stair stretches, closes and re-forms as it climbs. uEsc.x stretches the stair's leads.
    float h1 = fract(seed * 7.13), h2 = fract(seed * 13.7), h3 = fract(seed * 23.3), tE = uEsc.y;
    float lead = iA.y * mix(uEsc.x, 1., iB.w);
    float amp = min(.15, abs(lead) * .27 + .015) * mix(1., .55, iB.w);
    float phi = uPhase + lead + amp * (.7 * sin(tE * (.1 + .06 * h1) + seed * 20.) + .3 * sin(tE * (.23 + .1 * h2) + seed * 51.));
    float r = iA.x + 2. * sin(tE * (.09 + .07 * h2) + seed * 31.) * mix(1., .6, iB.w) + .4 * sin(uTime * .17 + seed * 31.);
    yAlt = uAlt + iA.z - (1. - st) * 46. + 1.3 * sin(tE * (.08 + .08 * h3) + seed * 40.) * mix(1., .7, iB.w) + .3 * sin(uTime * .6 + seed * 40.);
    c = vec3(r * sin(phi), yAlt, -r * cos(phi));
    fwd = normalize(vec3(cos(phi), .16, sin(phi))); outw = vec3(sin(phi), 0., -cos(phi));   // nose a little up: the back turns to the lens behind and above
    bank = .44 + iA.w + .07 * sin(uTime * .9 + seed * 40.);
    grow = smoothstep(.02, .3, st) * smoothstep(0., 7., yAlt);
    float cyc = fract(uTime / (9. + 7. * seed) + seed * 7.);
    env = smoothstep(0., .03, cyc) * (1. - smoothstep(.1, .14, cyc)); legDrop = 0.;
  } else if (iB.z > 2.5) {
    // THE FUNNEL: the top turns of the kettle, a cone of rings about the thermal's axis that opens upward. It is built in
    // root-local space (iC.xyz = the centre of the bird's circle, iA.x its radius), so the lens climbs through its wall and
    // then looks back down into it. Like the column it leans with the wind about the lens' own height.
    float phi = iA.y + uTime * iA.w;
    float r = iA.x * (1. + .03 * sin(uTime * .23 + seed * 20.));
    c = iC.xyz + vec3(r * sin(phi), .45 * sin(uTime * .5 + seed * 30.), -r * cos(phi));
    c.xz += uLean * (c.y - uAlt);
    vWhite = 1.;                                                                   // the rings are read from above: broad paper coverts, plum only on the hand and the trailing edge
    fwd = vec3(cos(phi), 0., sin(phi)); outw = vec3(sin(phi), 0., -cos(phi));
    bank = iC.w + .06 * sin(uTime * .9 + seed * 40.) + .08 * sin(6.28318 * (uTime / max(uWave, 1.) - c.y / 420.) + seed * .8);
    yAlt = c.y;
    float cyc = fract(uTime / (9. + 7. * seed) + seed * 7.);
    env = smoothstep(0., .03, cyc) * (1. - smoothstep(.1, .14, cyc));
    float lc = fract(uTime / (13. + 9. * fract(seed * 5.3)) + seed * 3.);
    legDrop = smoothstep(0., .06, lc) * (1. - smoothstep(.16, .3, lc)) * step(.55, fract(seed * 9.7));
  }
#endif
  else {
    float span = iB.z < 1.5 ? ${Ce.toFixed(1)} : ${ge.toFixed(1)};
    float s = mod(iA.z + uTime * uFile.w, span);
    float e = max(1. - s / 80., 0.);
    c = fileAt(s);
    float hk = sign(uHook);                                                        // which way the head of the file hooks in
    float trn = uBend.y * (1. - exp(-max(s - uBend.x, 0.) / max(uBend.z, 1.)));
    fwd = normalize(vec3(-.4 * e * hk + uSlant + trn, -.3, 1.)); { vec3 o1 = cross(vec3(0., 1., 0.), fwd); outw = o1 / max(length(o1), 1e-4); }   // drawn nose-down: the lens, behind and below, is shown the white underside
    bank = .85 * e * hk + .06 * sin(uTime * .8 + seed * 40.);                       // banked hard as it peels off: its white underside is turned to the lens
    grow = smoothstep(0., 8., s) * (iB.z < 1.5 ? 1. : step(${Ce.toFixed(1)}, s) * (1. - smoothstep(${(ge-80).toFixed(1)}, ${ge.toFixed(1)}, s)));
    env = (1. - smoothstep(0., 30., s)) * .5; legDrop = 0.; yAlt = 600.;
  }
#endif
  // ---- where the bird is, how big it is on the page
  vec4 wc = modelMatrix * vec4(c, 1.);
  vec3 toC = wc.xyz - cameraPosition; float dist = max(length(toC), 1e-3);
#ifndef SOLO
  // nothing stands between the lens and the ring: a bird that would cross the portal's disc or its one-radius margin
  // slides outward from the lens-to-ring line instead (uRing.w: 0 until the ring is the subject)
  vec3 ts = (modelMatrix * vec4(uRing.xyz, 1.)).xyz - cameraPosition; float dsr = max(length(ts), 1e-3); ts /= dsr;
  float tA = dot(toC, ts); vec3 pv = toC - ts * tA + vec3(.013, -.021, .008); float pl = max(length(pv), 1e-3);
  float needR = clamp(tA, 0., dsr + 8.) * min(14. / dsr, .7) * uRing.w * step(0., tA) * (1. - smoothstep(dsr + 2., dsr + 8., tA));
  wc.xyz += pv / pl * max(needR - pl, 0.);
  toC = wc.xyz - cameraPosition; dist = max(length(toC), 1e-3);
  wc.xyz += toC / dist * max(uBubble - dist, 0.);                                 // nothing comes within the bubble of the lens
  dist = max(dist, uBubble);
  // the departing file as A DOTTED THREAD. Wherever a bird at its held size would be drawn wider than the gap to the next on
  // the page (the file seen end-on or nearly, and all of it from the last straight), the birds go to their true size (never
  // under 10 design px) and are thinned by halves, bird by bird (every second, every fourth ... by the bird's own number, each
  // fading out at its own distance), so that the gap on the page always stays wider than a bird: separate paper ticks with
  // plum hands, from beside the ring down to the far coast, and never a ladder of rungs or a solid line.
  if (iB.z > .5 && iB.z < 2.5) {
    float sF = mod(iA.z + uTime * uFile.w, iB.z < 1.5 ? ${Ce.toFixed(1)} : ${ge.toFixed(1)});
    vec3 nx = (modelMatrix * vec4(fileAt(sF + 9.), 1.)).xyz - cameraPosition;
    float ppr = projectionMatrix[1][1] * uBufH * .5, ppm = ppr / dist;
    float gap = length(cross(toC / dist, nx / max(length(nx), 1e-3))) * ppr;         // pixels from this bird to the next on the page
    float wide = max(ppm * 2.05 * size, uMinPx * (iB.z < 1.5 ? 3.8 : 1.));           // ... and how wide it would be drawn at its held size
    endOn = smoothstep(.9, 1.7, wide / max(gap, 1e-3)) * smoothstep(34., 80., dist);
    skyK = smoothstep(.02, .045, toC.y / dist);                                     // above the far coast the ground is the dark sky or the base: paper there, and two dot pitches of it
    float wideT = max(ppm * 2.05 * size, uMinPx * mix(1.3, 2., skyK));
    float lv = log2(max((1.25 * wideT + .1 * uMinPx) / max(gap, 1e-3), 1e-3));
    float j = floor(iA.z / 9. + .5);
    float tz = j < .5 ? 8. : mod(j, 2.) > .5 ? 0. : mod(j, 4.) > .5 ? 1. : mod(j, 8.) > .5 ? 2. : mod(j, 16.) > .5 ? 3. : mod(j, 32.) > .5 ? 4. : mod(j, 64.) > .5 ? 5. : 6.;
    grow *= mix(1., 1. - smoothstep(tz - .1, tz + .4, lv), endOn);
    vFile = endOn;
    // ... and each of them is turned to show the lens its whole back (its wing plane square to the line of sight, its body
    // along the file's line on the page): end-on a bird is a hairline, in plan it is a bird
    mat3 MR = mat3(modelMatrix);
    vec3 vd = toC / dist, fdir = nx - toC; fdir -= vd * dot(fdir, vd);
    float fl = length(fdir);
    if (fl > 1e-3 && endOn > 0.) {
      vec3 f2 = mix(fwd, (fdir / fl) * MR, endOn), u2 = mix(upB, (-vd) * MR, endOn);
      fwd = f2 / max(length(f2), 1e-4); upB = u2 / max(length(u2), 1e-4);
      vec3 o2 = cross(upB, fwd); outw = o2 / max(length(o2), 1e-4); upB = cross(fwd, outw);
      bank *= 1. - endOn;
    }
  }
  // is the cloud base behind this bird? (the ray from the lens through it meets the dark underside): then it prints as paper
  float baseY = (modelMatrix * vec4(0., uH, 0., 1.)).y;
  vec2 hit = cameraPosition.xz + toC.xz * ((baseY - cameraPosition.y) / max(toC.y, 1e-3)) - (modelMatrix * vec4(uBaseC.x, uH, uBaseC.y, 1.)).xz;
  vBase = step(.03, toC.y / dist) * (1. - smoothstep(uBaseC.z, uBaseC.z + 90., length(hit * vec2(.89, 1.)))) * uBaseC.w;
  vBase = max(vBase, endOn * skyK);
#else
  vBase = 0.;
#endif
  float pxPerM = projectionMatrix[1][1] * uBufH * .5 / dist;
  vPx = pxPerM * 2.05 * size;
  float big = smoothstep(18., 30., vPx);                                          // thin parts are fattened only on birds drawn as paper
  // ---- a wing seen edge-on is thinner than the dot screen can draw: lean it toward the lens (the side already showing)
  // until its chord covers uChordPx on the page. Never more than half a radian.
  float cbT = cos(bank), sbT = sin(bank);
  mat3 MT = mat3(modelMatrix);
  vec3 axY = MT * (upB * cbT - outw * sbT), axZ = MT * fwd, vv = -toC / dist;
  float vy = dot(vv, axY), vz = dot(vv, axZ);
  float want = min(uChordPx / max(pxPerM * .34 * size, 1e-4), .5);
  float tw = clamp(asin(want) - asin(min(abs(vy), 1.)), 0., .5) * smoothstep(.25, .6, abs(vz)) * (vy * vz > 0. ? -1. : 1.);
  if (part > .5 && part < 2.5) {
    float ct = cos(tw), st = sin(tw); vec2 yz = vec2(p.y - .045, p.z);
    p.y = .045 + yz.x * ct + yz.y * st; p.z = yz.y * ct - yz.x * st;
  }
  // ---- wings: flap about the shoulder, the hand lagging; on set wings the tips ride up and the fingers work
  float d = abs(aPart.x), sg = sign(aPart.x);
  float fph = uTime * (11. + 3. * fract(seed * 3.7)) * mix(1., .72, step(.9, env)) + seed * 50.;
  if (d > 0.) {
    float a = mix(.17, .07, env) + env * (.62 * sin(fph) + .1);                    // set wings: arm lifted, hand drooped, fingers up
#ifdef TICK
    a += .26;                                                                      // a tick keeps a shallow V so it never goes edge-on to nothing
#endif
    float aTip = env * .5 * sin(fph - 1.1) - (1. - env) * (.25 + .03 * sin(uTime * 1.3 + seed * 20.));
    float dOut = max(d - .5, 0.);
    float xl = d * cos(a) + dOut * (cos(a + aTip) - cos(a));
    p.y += d * sin(a) + dOut * (sin(a + aTip) - sin(a));
    p.x = sg * (${ve.toFixed(3)} + xl);
    if (part > 1.5 && part < 2.5) {
      float t = aPart.w, k = aPart.z;
      p.y += t * t * (.075 + .03 * sin(uTime * 1.7 + k * 1.3 + seed * 20.)) * (1. - env * .6) * step(k, 5.5);
      p.z += t * .028 * sin(uTime * .8 + k * .9 + seed * 9.) - t * env * .05 * cos(fph);
    }
  }
  // ---- bill and legs never thinner than 3 px, so the plates still overlap on them when they slip (a solo stork, which the
  // world flies at arm's length and scales up, is fattened by a fifth at most within 8 m: its legs are two hairline red lines)
#ifdef SOLO
  float fatMax = mix(1.2, 3., smoothstep(8., 16., dist));
#else
  float fatMax = 3.;
#endif
  if (part > 4.1 && part < 4.4) p.xy += aUV * (clamp(2.6 / max(pxPerM * .042, 1e-4), 1., fatMax) - 1.) * big;
  // ---- head turns, legs drop and tuck
  if (part > 3.5 && part < 4.5) {
    float yaw = .55 * sin(uTime * .37 + seed * 30.) * smoothstep(.2, .9, sin(uTime * .23 + seed * 11.)) * aPart.w * aPart.w;
    float cy = cos(yaw), sy = sin(yaw); vec2 hz = vec2(p.x, p.z - .26);
    p.x = hz.x * cy + hz.y * sy; p.z = .26 - hz.x * sy + hz.y * cy;
    n.xz = vec2(n.x * cy + n.z * sy, -n.x * sy + n.z * cy);
  }
  if (part > 2.5 && part < 3.5) {
    p.xy += aUV * (clamp(2.2 / max(pxPerM * .03, 1e-4), 1., fatMax) - 1.) * big;
#ifdef SOLO
    p.x -= aPart.z * .022 * uSolo.w; p.xy -= aUV * .35 * uSolo.w;                   // (uSolo.w: seen from below against the cloud, the legs trail as one thin line)
#endif
    float la = legDrop * 1.05, cl = cos(la), sl = sin(la); vec2 yz = vec2(p.y + .05, p.z + .16);
    p.y = -.05 + yz.x * cl + yz.y * sl; p.z = -.16 - yz.x * sl + yz.y * cl;
  }
  // ---- place the bird
  float cb = cos(bank), sb = sin(bank);
  vec3 up = upB;
  float sc = size * grow, zf = 1.;
#ifndef SOLO
  float mn = uMinPx * (1. + .65 * vBase);                                         // paper on the dark base wants two dot pitches
#ifdef FUNNEL
  // modelled birds hold a size on the page: escorts 27 design px, the head of the file 30, the funnel's rings 24 (13 far
  // off: one floor for a far ring bird, by its range alone, from 130 to 300 m)
  mn = uMinPx * (iB.z > 3.5 ? 3.4 : iB.z > 2.5 ? mix(3., 1.6, smoothstep(130., 300., dist)) : 3.8);
#endif
#ifdef TICK
  mn *= mix(1., .36, smoothstep(.45, .8, -toC.y / dist) * smoothstep(200., 700., dist));   // looked down on from the top, the far column must not clot
#endif
  mn = mix(mn, uMinPx * mix(1.3, 2., skyK), endOn);
  float kMin = max(1., mn / max(vPx, 1e-4));                                      // no bird is ever narrower than its minimum on the page
  sc *= kMin;
  zf += .9 * endOn * clamp(kMin - 1., 0., 1.);                                    // a thread bird held at its floor is drawn broader in the chord: a mark, not a hairline
#ifdef FUNNEL
  vPx *= kMin;                                                                    // ... and one held at that size keeps its three inks
#endif
#endif
  vec3 q = vec3(p.x * cb - p.y * sb, p.x * sb + p.y * cb, p.z * zf) * sc;
  vec3 nn = vec3(n.x * cb - n.y * sb, n.x * sb + n.y * cb, n.z);
  mat3 M3 = mat3(modelMatrix);
  vec3 w = wc.xyz + M3 * (outw * q.x + up * q.y + fwd * q.z);
  vN = M3 * (outw * nn.x + up * nn.y + fwd * nn.z);
  vInk = ink; vPart = aPart; vUV = aUV; vSeed = seed;
  vec4 mv = viewMatrix * vec4(w, 1.); vDepth = -mv.z; gl_Position = projectionMatrix * mv;
}`,It=`precision highp float;
${Ne}
uniform float uUnder, uBlack, uGold; uniform vec4 uSolo;
varying vec3 vInk, vN; varying vec4 vPart; varying vec2 vUV; varying float vDepth, vSeed, vPx, vBase, vWhite, vFile;
void main(){
  vec3 n = vN / max(length(vN), 1e-5); if (!gl_FrontFacing) n = -n;
  float lit = dot(n, uSunDir);
  vec3 ink = vInk; float part = vPart.y;
  float black = step(1. - uBlack, fract(vSeed * 17.31));                           // one in ten a black stork (cast variation)
#ifdef TICK
  // far birds: a tick that flips between paper and plum as its bank turns it to and from the sun
  float top = smoothstep(-.02, .14, lit);
  // against the dark cloud base a plum tick would vanish: there it prints as paper with plum tips and a plum trailing edge
  // (a tick of the departing thread: bare paper on the dark sky and base, plum on the pale coast and sea, so it reads on both)
  float thr = vFile * (1. - vBase);
  float flight = max(step(mix(mix(.6, .8, vBase), .3, thr), vUV.x), step(mix(mix(.74, .84, vBase), .5, thr), vUV.y));
  float plum = max(max(flight, (1. - top) * (1. - max(vBase, vFile))), max(black, vFile * (1. - vBase)));
  plum *= 1. - vFile * vBase;                                                      // (a thread tick on the dark sky is bare paper: nothing at that size but the mark)
  ink = vec3(plum, plum, 0.);
#else
  float sWing = vUV.x, cWing = vUV.y;
  float fs = sWing * 30. + cWing * 2.2, lw = max(fwidth(fs), 1e-4), fc = fwidth(cWing) * 1.5 + 1e-4;
  float fkey = clamp(fwidth(vUV.y) * .8, 1e-3, .3);                                        // (taken outside the branches: the paper key of a hand feather, below)
  if (part > .5 && part < 1.5) {
    // the arm: white coverts in front with a scalloped edge, plum secondaries behind, feather gaps knocked out as paper lines
    float edge = mix(.52, .62, vWhite) + .04 * abs(sin(sWing * 3.14159 * 30.));
    float plum = smoothstep(edge - fc, edge + fc, cWing);
    float f = abs(fract(fs) - .5);
    float line = (1. - smoothstep(lw * .7, lw * 1.5, f)) * (1. - smoothstep(.16, .45, lw)) * smoothstep(edge + .03, edge + .1, cWing);
    float row = (1. - smoothstep(fc * .5, fc * 1.3, abs(cWing - .72))) * (1. - smoothstep(.02, .06, fc));
    plum *= 1. - max(line, row * .85);
    plum = max(plum, black * (1. - max(line, row) * .0));
    ink = vec3(plum, plum, 0.);
  }
#ifdef SOLO
  // A solo stork flown against the dark cloud base (uSolo.w = 1): plum flight feathers would be lost in the plum of the cloud,
  // so each is KEYED with bare paper: a finger is a plum shaft between two paper edges with a paper tip, and the plum band
  // of the arm ends in a paper line along the trailing edge (the gaps between its feathers are paper lines already)
  if (uSolo.w > 0.) {
    if (part > 1.5 && part < 2.5) {
      ink *= 1. - uSolo.w * max(smoothstep(.3 - fkey, .3 + fkey, abs(vUV.y)), smoothstep(.9, .97, vPart.w));
    } else if (part > .5 && part < 1.5) ink *= 1. - uSolo.w * smoothstep(.93 - fc, .93 + fc, cWing);
  }
#endif
  if (black > .5 && part < .5) { float belly = (1. - smoothstep(-.03, .02, n.y)) * step(vInk.r, .5); ink = mix(vec3(1., 1., 0.), ink, belly); }
  if (black > .5 && part > 3.5 && part < 4.5 && vInk.b < .5) ink = vec3(1., 1., 0.);
  // light is ink: white takes only a light dot on its shaded side (the underwing 12-15 percent); golden hour lines it with yellow
  // a bird narrower than three dot pitches would be lost in the screen: it becomes a solid tick (no vermilion, shaded side plum)
  float small = (1. - smoothstep(15., 21., vPx)) * (1. - vBase);                    // ... unless the dark base is behind it
  ink = mix(ink, vec3(1., 1., 0.), small * step(.5, ink.b));
  float bare = vFile * vBase * (1. - smoothstep(15., 21., vPx));                    // (a small bird of the thread on the dark sky is bare paper: no vermilion, no plum, no shade)
  ink = mix(ink, vec3(0.), bare);
  float white = 1. - max(ink.r, max(ink.g, ink.b));
  ink.rg = max(ink.rg, vec2(white * small * max(1. - smoothstep(-.02, .14, lit), vFile)));      // (a small bird of the departing thread is plum whichever way it is lit)
  white = 1. - max(ink.r, max(ink.g, ink.b));
  float sh = 1. - smoothstep(-.35, .3, lit);
  ink.g += white * sh * uUnder * (1. - bare);
  ink.b += white * step(.5, uGold) * (smoothstep(-.05, .05, lit) - smoothstep(.3, .42, lit)) * (1. - bare);
#endif
  ink = inkHaze(ink, vDepth * (1. - .8 * vFile));                                  // (the thread keeps its ink through the haze: it is the last thing read)
  gl_FragColor = inkOut(ink, vDepth);
}`;function xe(o,e,a){return new n.ShaderMaterial({uniforms:{...o.shared,...e},defines:a,vertexShader:Et,fragmentShader:It,side:n.DoubleSide,fog:!1,toneMapped:!1})}function Lt(o,e={}){const a=lt(e.height??1280);a.uSolo.value.set(e.flap??0,e.seed??.37,e.legs??0,0);const d=new n.Mesh(e.geometry||We(0),xe(o,a,{SOLO:1}));return d.frustumCulled=!1,d.layers.set(X),d.onBeforeRender=(f,r,p,g,u)=>{const i=f.getRenderTarget(),x=i?i.height:f.domElement.height;u.uniforms.uBufH.value=x,u.uniforms.uChordPx.value=5.5*x/450},d}function lt(o){return{uPhase:{value:0},uAlt:{value:0},uH:{value:o},uBubble:{value:6.5},uBufH:{value:450},uMinPx:{value:2.6},uWave:{value:16},uBlack:{value:0},uChordPx:{value:5.5},uLean:{value:new n.Vector2},uFile:{value:new n.Vector4(-26,o-12,36,11)},uSolo:{value:new n.Vector4(0,0,0,0)},uUnder:{value:.14},uGold:{value:0},uStair:{value:1},uStair2:{value:0},uHook:{value:-6},uSlant:{value:.052},uCalm:{value:0},uBend:{value:new n.Vector4(1e5,0,60,.075)},uLift:{value:0},uRing:{value:new n.Vector4(0,o,0,0)},uFunBand:{value:new n.Vector2(1e6,1e6)},uEsc:{value:new n.Vector2(1,0)},uBaseC:{value:new n.Vector4(0,0,360,0)}}}function He(o,e,a){const d=new n.InstancedBufferGeometry;d.index=o.index;for(const f in o.attributes)d.setAttribute(f,o.attributes[f]);return d.setAttribute("iA",new n.InstancedBufferAttribute(new Float32Array(e),4)),d.setAttribute("iB",new n.InstancedBufferAttribute(new Float32Array(a),4)),d.instanceCount=e.length/4,d}function Dt(o){const e=o.length,a=[],d=[],f=new Array(e);for(let r=0;r<e-1;r++)a.push(o[r+1][0]-o[r][0]),d.push((o[r+1][1]-o[r][1])/a[r]);f[0]=d[0],f[e-1]=d[e-2];for(let r=1;r<e-1;r++)f[r]=d[r-1]*d[r]<=0?0:(d[r-1]+d[r])/2;for(let r=0;r<e-1;r++){if(d[r]===0){f[r]=0,f[r+1]=0;continue}const p=f[r]/d[r],g=f[r+1]/d[r],u=p*p+g*g;if(u>9){const i=3/Math.sqrt(u);f[r]=i*p*d[r],f[r+1]=i*g*d[r]}}return r=>{if(r<=o[0][0])return o[0][1];if(r>=o[e-1][0])return o[e-1][1];let p=0;for(;r>o[p+1][0];)p++;const g=a[p],u=(r-o[p][0])/g,i=u*u,x=i*u;return(2*x-3*i+1)*o[p][1]+(x-2*i+u)*g*f[p]+(-2*x+3*i)*o[p+1][1]+(x-i)*g*f[p+1]}}async function Nt(o,e={}){const a=o.rng.fork?o.rng.fork("stork-kettle"):o.rng,d=o.quality?.detail??1,f=e.palette||Qe,r=e.height??1280,p=e.radius??125,g=36,u=14/g,i={hour:e.hour||(a.chance(.6)?"noon":a.chance(.6)?"golden":"haze"),wind:e.wind||(a.chance(.4)?"east":"calm"),cast:e.cast||a.pick(["white","white","black","packed","thin"]),lineScreen:e.lineScreen??a.chance(.25),paper:e.paper||(a.chance(.35)?"#F2E8D0":f[0]),wander:e.wander||a.pick(["blue","pink","both"])};i.leanDeg=e.leanDeg??(i.wind==="east"?12:a.range(1.5,4));const x=i.hour==="golden"?new n.Vector3(-Math.cos(.436),Math.sin(.436),.12):new n.Vector3(0,Math.sin(1.117),Math.cos(1.117)),v=!e.press,w=v&&e.exposure==null,l=e.press||Tt({palette:f,paper:i.paper,lineScreen:i.lineScreen,sunDir:x,exposure:w?Se.exposure:e.exposure,dim:w?Se.dim:1,backdrop:e.backdrop,hazeInk:i.hour==="haze"?3600:8e3,hazeBlue:i.hour==="haze"?2200:5200,hazeTone:i.hour==="haze"?.15:.22,skyTop:i.hour==="haze"?.44:i.hour==="golden"?.52:.58,skyHorizon:i.hour==="haze"?.04:.12,skyGold:i.hour==="golden"?1:0});w&&l.setGrade(Se.grade[0],Se.grade[1]),v&&l.uniforms.uWander.value.set(i.wander==="pink"?.55:1,i.wander==="blue"?.55:1,0);const h=new n.Group;h.name="stork-kettle",v&&(h.add(l.page),h.add(l.sky)),await o.yield?.();const k=e.spacing??a.range(11.4,12.6),S=e.rise??a.range(1.5,1.75),c=i.cast==="thin"?.72:1,s=e.lanes||[20,28,36,44,52,70],B=[],z=[],L=[],U=[],E=[],A=[],R=[],I=[],q=[],ee=35,_=ee*S+6;s.forEach(t=>{const m=t===g,F=Math.abs(t-g)<10,N=m?0:F?a.range(.5,1.1)*a.sign():t<g?a.range(.9,1.7)*a.sign():-a.range(.8,2),C=m?0:a()*V,D=1-N/(t*u);for(let M=-ee;M<=ee;M++){const O=m?.5:1.2,pe=[t+a.range(-O,O),M*k/t+C+a.range(-.012,.012),((M*S+a.range(-.3,.3))%r+r)%r,D],Z=[a(),a.range(1,1.16),0,0],De=a();if(m&&M>=0&&M<=3)continue;const Ve=m?Math.abs(M)<=12:F&&Math.abs(M)<=6;!Ve&&!m&&De>Math.min(c,.6+.4*d)||(Ve?(B.push(...pe),z.push(...Z)):(L.push(...pe),U.push(...Z)))}});const G=Math.round((e.ticks??5600)*(i.cast==="packed"?1:i.cast==="thin"?.72:.9)*re(.7,1,W((d-.6)/.4,0,1))),te=r-2*_,P=p/125,j=[[20,12,34],[36,13,34],[66,18,40],[100,24,46]].map(t=>({r:t[0]*P+a.range(-2,2),sp:t[1]*a.range(.92,1.08),pitch:t[2]*a.range(.9,1.12)}));let $=0;for(const t of j)t.n=te/t.pitch*V*t.r/t.sp,$+=t.n;const we=G*.94/$;j.forEach(t=>{const m=Math.floor(t.n*we),F=te/t.pitch*V/m,N=a()*V,C=Math.pow(g/t.r,.55)*a.range(.96,1.04);for(let D=0;D<m;D++)E.push(t.r+a.range(-1.6,1.6),D*F+N+a.range(-.02,.02),_+(D+a.range(-.25,.25))/m*te,C),A.push(a(),a.range(.95,1.1),0,1)});for(let t=Math.round(G*.06);t>0;t--){const m=a.range(14,p);E.push(m,a()*V,_+a()*te,Math.pow(g/m,.55)),A.push(a(),a.range(.95,1.1),0,1)}const be=180,Ue=Math.round(Ce/9),ut=e.funnel===!1?0:Ue;for(let t=0;t<Ue;t++){const m=[a(),a.range(.95,1.05),1,0];t<ut?(R.push(0,0,t*9,1),I.push(m[0],m[1]*1.65,1,0),q.push(0,0,0,0)):(L.push(0,0,t*9,1),U.push(...m))}for(let t=0;t<be;t++)E.push(0,0,t*9,1),A.push(a(),1,2,0);await o.yield?.();const b=lt(r);b.uBlack.value=i.cast==="black"?.1:0,b.uGold.value=i.hour==="golden"?1:0,b.uWave.value=e.wavePeriod??16,b.uBubble.value=e.bubble??6.5;const ht=Math.tan(i.leanDeg*Math.PI/180);b.uLean.value.set(-ht,0);const le=We(0);await o.yield?.();const _e=We(1),ct=Ct(),Ee=[xe(l,b,{}),xe(l,b,{}),xe(l,b,{TICK:1})],ye=[[le,B,z],[_e,L,U],[ct,E,A]].map(([t,m,F],N)=>{const C=new n.Mesh(He(t,m,F),Ee[N]);return C.frustumCulled=!1,C.layers.set(X),C.name="storks-lod"+N,h.add(C),C});await o.yield?.();const ke=[],ae=Math.PI/180,dt=(t,m)=>[t*Math.sin(m*ae),-t*Math.cos(m*ae)],ft=g*30*ae*Math.tan(14*ae),pt=Math.tan(12*ae);let ue=15;ke.push([g,ue,-70],[g,ue,-35]);for(let t=90;t<=810;t+=30){const m=dt(g,t);ke.push([m[0],ue,m[1]]),t<810&&(ue+=ft)}for(const t of[28,56,85])ke.push([g,ue+t*pt,t]);const ze=ke.map(t=>new n.Vector3(t[0],t[1],t[2])),mt=Pt(ze),vt=new n.Vector3,Ge=t=>mt.pointAt(W(t,0,1),vt).y,gt=r/1280,je=.86,he=[[0,15],[.114,15],[.26,180],[.4,480],[.5,780],[.59,1010],[.66,1130],[.74,1215],[.8,1244],[.85,1256],[1,0]].map((t,m)=>[t[0],m<2?0:t[1]*gt-Ge(t[0])]);he[he.length-1][1]=he[he.length-2][1];const xt=Dt(he),Me=t=>Ge(t)+xt(W(t,0,1)),Ie=ze[ze.length-1],Pe=Me(je),ce=new n.Vector3(Ie.x,Me(1),Ie.z),ie=e.fileStart||[g+6.7,Pe+15.8,-24];b.uHook.value=e.fileHook??-6,b.uSlant.value=e.fileSlant??.052,b.uFile.value.set(ie[0],ie[1],ie[2],e.fileSpeed??11),b.uRing.value.set(ce.x,ce.y,ce.z,0);const Be=e.fileBend||[96,.8,60,.03];b.uBend.value.set(Be[0],Be[1],Be[2],Be[3]),b.uLift.value=e.fileLift??4.5,e.base&&b.uBaseC.value.set(e.base[0],e.base[1],e.base[2]??360,1),await o.yield?.();const de=(t,m)=>{const F=Math.sin(t*127.1+m*311.7+17.3)*43758.5453;return F-Math.floor(F)},oe=Pe-22,fe=oe-84,wt=e.funnelTurns??5,Ke=t=>re(44,13,t);let qe=0;if(e.funnel!==!1){const t=i.cast==="packed"?.88:i.cast==="thin"?1.2:1,m=wt*V,F=[],N=[],C=[];let D=0,M=0;for(;D<m&&M<280;){const T=D/m,Y=Ke(T),yt=oe-(oe-fe)*T,Re=Math.abs(Y-g)<4,kt=Re?R:F,zt=Re?I:N,Mt=Re?q:C;kt.push(Y+(de(M,1)-.5)*1,.6+D,0,W(12/Y,.27,.62)),zt.push(de(M,2),re(1.3,1.45,T)+de(M,3)*.06,3,0),Mt.push(0,yt+(de(M,4)-.5)*.8,0,W(Math.atan(20/Y),.2,.6)*.8),D+=re(4.2,3.4,T)*t/Y,M++}qe=M,b.uFunBand.value.set(fe,oe);const O=xe(l,b,{FUNNEL:1}),pe=He(_e,F,N);pe.setAttribute("iC",new n.InstancedBufferAttribute(new Float32Array(C),4));const Z=new n.Mesh(pe,O);Z.frustumCulled=!1,Z.layers.set(X),Z.name="storks-rings",h.add(Z),ye.push(Z),Ee.push(O);const De=[[[8.6,34.4,5.6,1.45],[13.5,33.6,6.3,1.4],[19,32.6,6.9,1.36],[25.5,31.6,7.4,1.36],[32.5,30.8,7.8,1.38],[41,30.2,8.1,1.38],[49.5,29.8,8.4,1.4],[8.5,41.5,3.6,1.3],[17,43.5,6.2,1.32],[27.5,45,8.6,1.36]],[[9.5,33.2,4.6,1.45],[15,35.2,7.6,1.4],[21,31.4,5.8,1.38],[28,33.6,9,1.38],[35,29.6,6.8,1.38],[44,31.6,9.6,1.4],[53,28.6,8,1.4],[11,40.5,4.6,1.3],[21,42.5,7.4,1.34],[33,44.5,10.2,1.38]],[[9.2,35.4,6.4,1.45],[12.5,31.8,4.9,1.4],[18,34.2,8.2,1.38],[24,30.2,6.4,1.36],[30,32.6,9.4,1.38],[38,28.8,7.2,1.38],[47,31,10.2,1.4],[7.5,40.6,5.2,1.3],[15,42.8,3.8,1.32],[25,44.6,7.2,1.36]]];(e.escort||[...De[W(Math.round(e.stairLayout??0),0,2)].map((T,Y)=>[T[0],T[1],T[2],T[3],0,Y>6?.08:0]),[8,35.6,5.9,1.4,1,0],[.6,26.7,9.1,1.4,1,.04],[4.4,36.8,11.1,1.4,1,0],[13.7,43,12.5,1.45,1,.06],[8.5,23.2,13,1.45,1,.06],[-5.8,26.8,18.9,1.5,1,.06],[22.7,33.1,13.5,1.5,1,0],[4.1,22.1,26.1,1.55,1,.1]]).forEach((T,Y)=>{R.push(T[1],T[0]/T[1],-T[2],T[5]||0),I.push(de(Y,7),T[3],4,T[4]),q.push(0,0,0,0)});const Je=He(le,R,I);Je.setAttribute("iC",new n.InstancedBufferAttribute(new Float32Array(q),4));const me=new n.Mesh(Je,O);me.frustumCulled=!1,me.layers.set(X),me.name="storks-company",h.add(me),ye.push(me)}const ne=new n.Vector3,Ae=new n.Vector2,bt=e.tickPx??8;let se=a()*V,$e=!1,Ye=0,Le=null,Te=null,Ze=0;const Xe={object:h,radius:p,height:r,center:new n.Vector3(0,r*.5,0),ground:!1,groundY:0,press:l,mood:i,uniforms:b,meshes:ye,materials:Ee,altitudeAt:Me,laneRadius:g,lanes:s,spacing:k,omega:u,styleMaterial:t=>St(l,t),makeSoloStork:(t={})=>Lt(l,{height:r,geometry:le,...t}),setAltitude(t){Te=t},setPhase(t){Le=t},setProgress(t){Te=Me(t)},setStair(t,m=0){b.uStair.value=W(t,0,1),b.uStair2.value=W(m,0,1)},setEscort(t=1,m=0){b.uEsc.value.x=t,Ze=m},setCalm(t){b.uCalm.value=W(t,0,1)},setRing(t){b.uRing.value.w=W(t,0,1)},setBase(t,m,F=360){b.uBaseC.value.set(t,m,F,1)},top:{u:je,altitude:Pe},funnel:{y0:fe,y1:oe,count:qe,radiusAt:t=>Ke(W((oe-t)/(oe-fe),0,1))},get phase(){return se},anchors:{axisBase:new n.Vector3(0,0,0),axisTop:new n.Vector3(0,r,0),entry:new n.Vector3(g,15,-70),entryDir:new n.Vector3(0,0,1),flyThrough:ze,portalSeat:{position:ce,normal:new n.Vector3(0,-Math.sin(12*ae),-Math.cos(12*ae)),radius:7,pathEnd:Ie.clone()},fileStart:new n.Vector3(ie[0],ie[1],ie[2]),fileDir:new n.Vector3(b.uSlant.value,-.075,1).normalize(),fileLength:ge,fileHook:b.uHook.value,fileSlant:b.uSlant.value,ringLook:ce.clone(),viewpoints:[{name:"whole",position:new n.Vector3(900,420,1300),target:new n.Vector3(0,r*.5,0)},{name:"inLane",position:new n.Vector3(g,400,0),target:new n.Vector3(g-6,403,12)},{name:"downTheFunnel",position:new n.Vector3(14,Pe-14,-33),target:new n.Vector3(0,fe,16)}]},update(t,m,F){if(l.shared.uTime.value=m,b.uEsc.value.y=m+Ze,o.renderer&&(o.renderer.getDrawingBufferSize(Ae),b.uBufH.value=Ae.y,b.uMinPx.value=bt*Ae.y/450,b.uChordPx.value=(e.chordPx??5.5)*Ae.y/450),h.updateWorldMatrix(!0,!1),ne.setFromMatrixPosition(F.matrixWorld),h.worldToLocal(ne),b.uAlt.value=W(Te??ne.y,0,r),Le!=null)se=Le;else if(t>0){const N=Math.hypot(ne.x,ne.z),C=Math.atan2(ne.x,-ne.z),D=N>8&&N<110;let M=C-Ye;M-=Math.round(M/V)*V;let O=C-se;O-=Math.round(O/V)*V,!$e||Math.abs(M)>.25?D&&(se+=O):D&&M/t>.15*u?se+=M+Math.sign(O)*Math.min(Math.abs(O),.45*t):se+=u*t,Ye=C,$e=!0}b.uPhase.value=se},dispose(){v&&l.dispose(),ye.some(t=>t.geometry.attributes.position===le.attributes.position)||le.dispose()}};return h.userData.hero=Xe,Xe}export{Ne as INK_GLSL,Nt as buildHero,Tt as makePress,Lt as makeSoloStork,St as styleMaterial};
