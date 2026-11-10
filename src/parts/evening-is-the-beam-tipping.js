import*as c from"three";import{clamp as et,lerp as We,smoothstep as rt}from"../kit/core.js";const ut=["#F08A2C","#F6EBC8","#3E73B8","#C9402E","#6F9E5B","#2B2F5E","#C8A24A"],tt=6,ye=Math.PI/180,ge=new c.Vector3(.5,0,.866).normalize(),Te=240,Fe=360,at=400,nt=`
uniform float uTime, uEve, uAirMax, uAirFar, uShadowOn, uShadowRange, uShadowSpan;
uniform vec2 uShadeY;
uniform vec3 uLightDir, uTint, uAirWarm, uAirCool;
uniform sampler2D uShadowMap;
uniform mat4 uShadowMat;
float mobHash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float mobNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mobHash(i), mobHash(i + vec2(1., 0.)), f.x), mix(mobHash(i + vec2(0., 1.)), mobHash(i + vec2(1., 1.)), f.x), f.y); }
float mobTap(vec2 uv){ return textureLod(uShadowMap, uv, 0.).r; }
// 1 = in the window's light, 0 = in another piece's shadow. soft scales the edge (1 for pieces).
// A shadow is ONE clean shape with ONE even soft edge: every tap compares whole texels of the depth picture (in or
// out, nothing between) and blends the four answers by the tap's place among them, so the outline is smooth and
// there is no depth arithmetic across an outline (that drew crack lines and blocks where casters stood behind each
// other). The edge has one fixed width (1.3 m radius), the same on every face. A caster further than MOB_REACH metres
// up the light casts nothing on a piece: in this room such a shadow has melted into the air, and a face wears the
// shadow of its neighbour, never the stacked blur of a whole tier.
const float MOB_REACH = 125.;
float mobIn(ivec2 t, ivec2 hi, float zb, float zf){ float d = texelFetch(uShadowMap, clamp(t, ivec2(0), hi), 0).r; return step(d, zb) * step(zf, d); }
float mobLitIn(vec3 wp, vec3 wn, float soft, vec2 fc){
  vec4 s = uShadowMat * vec4(wp + wn * 0.5, 1.);
  if (uShadowOn < 0.5 || s.x < 0.004 || s.x > 0.996 || s.y < 0.004 || s.y > 0.996) return 1.;
  vec2 res = vec2(textureSize(uShadowMap, 0)); ivec2 hi = ivec2(res) - 1;
  float z = s.z - 0.5, zb = z - 1.0 / max(uShadowRange, 1.), zf = z - MOB_REACH / max(uShadowRange, 1.);
  float rad = 1.3 * soft / max(uShadowSpan, 1.) * res.x;            // in texels
  vec2 base = s.xy * res - 0.5;
  float occ = 0.;
  for (int i = 0; i < 16; i++) {
    float fi = float(i);
    float a = fi * 2.39996, rr = sqrt((fi + 0.5) / 16.) * rad;
    vec2 q = base + vec2(cos(a), sin(a)) * rr, f = fract(q); ivec2 t = ivec2(floor(q));
    occ += mix(mix(mobIn(t, hi, zb, zf), mobIn(t + ivec2(1, 0), hi, zb, zf), f.x),
               mix(mobIn(t + ivec2(0, 1), hi, zb, zf), mobIn(t + ivec2(1, 1), hi, zb, zf), f.x), f.y);
  }
  return 1. - smoothstep(0.06, 0.94, occ / 16.);
}
float mobLit(vec3 wp, vec3 wn, float soft, vec2 fc){ return mobLitIn(wp, wn, soft, fc) * (1. - smoothstep(uShadeY.x, uShadeY.y, wp.y)); }
// two values, nothing else: the pot, or the pot times the one tint
vec3 mobValue(vec3 pot, float lit){ return pot * mix(uTint, vec3(1.), lit); }
// distance pales into the room's air: apricot toward the window, blue-grey away from it
vec3 mobAir(vec3 col, vec3 wp, float k){
  vec3 v = wp - cameraPosition; float d = length(v);
  float side = 0.5 - 0.5 * dot(v / max(d, 1e-3), uLightDir);
  return mix(col, mix(uAirCool, uAirWarm, side), clamp(d / max(uAirFar, 1.), 0., 1.) * uAirMax * k);
}
`;function ht(o,u={}){const n=u.palette&&u.palette.length>=7?u.palette:ut,d=a=>new c.Color(a),f={sun:d(n[0]),moon:d(n[1]),cloud:d("#F4F1EA"),bird:d(n[2]),boat:d(n[3]),hill:d(n[4]),night:d(n[5]),brass:d(n[6]),thread:d("#D9CDB8"),plyLight:d("#E6D3A8"),plyDark:d("#B98F5A"),room:d("#C99A93"),roomEve:d("#7E6A86"),patch:d("#F6C79A"),airCool:d("#8FA1C2")},e=900,h=700,l=1400,r=1,V=u.shadowSize||2048,b=new c.WebGLRenderTarget(V,Math.round(V*h/e),{type:c.HalfFloatType,format:c.RGBAFormat,minFilter:c.LinearFilter,magFilter:c.LinearFilter,depthBuffer:!0,stencilBuffer:!1,generateMipmaps:!1});b.texture.colorSpace=c.NoColorSpace;const A={uTime:{value:0},uEve:{value:0},uViewH:{value:450},uLightDir:{value:new c.Vector3(.5,-.3,.8).normalize()},uTint:{value:new c.Vector3(.66,.6,.7)},uAirWarm:{value:f.patch.clone()},uAirCool:{value:f.airCool.clone()},uAirMax:{value:.45},uAirFar:{value:900},uShadowMap:{value:b.texture},uShadowMat:{value:new c.Matrix4},uShadowOn:{value:0},uShadowRange:{value:l},uShadowSpan:{value:e},uShadeY:{value:new c.Vector2(540,610)},uPlyLight:{value:f.plyLight},uPlyDark:{value:f.plyDark},uCream:{value:f.moon}},Y=u.tilt||[14.5,-14.5],G=u.eve||[0,1],K=u.elev||[17,8],ae=a=>rt(.05,.95,a),ie=a=>We(Y[0],Y[1],ae(a))*ye;let _=0;function D(a){_=et(a,0,1);const i=We(G[0],G[1],ae(_)),t=We(K[0],K[1],i)*ye;A.uEve.value=i,A.uLightDir.value.set(.53*Math.cos(t),-Math.sin(t),.848*Math.cos(t)).normalize(),A.uTint.value.set(Math.pow(We(.66,.52,i),2.2),Math.pow(We(.6,.5,i),2.2),Math.pow(We(.7,.68,i),2.2))}D(0);const N=new c.OrthographicCamera(-e/2,e/2,h/2,-h/2,1,1+l);N.layers.set(r);const Q=new c.ShaderMaterial({side:c.BackSide,vertexShader:`void main(){
      #ifdef USE_INSTANCING
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.);
      #else
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
      #endif
    }`,fragmentShader:"void main(){ gl_FragColor = vec4(gl_FragCoord.z - 0.5, 0., 0., 1.); }"}),le=new c.Vector3(0,300,0),ke=new c.Color().setRGB(.5,0,0),Be=new c.Color,De=new c.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),Ce=new c.Vector3(0,1,0),ze=new c.Vector3;function Ne(){const a=A.uLightDir.value;N.position.copy(le).addScaledVector(a,-l*.5),N.up.copy(Ce),N.lookAt(ze.copy(le)),N.updateMatrixWorld(!0),A.uShadowMat.value.copy(De).multiply(N.projectionMatrix).multiply(N.matrixWorldInverse)}const re=new c.Scene,ee=new c.InstancedMesh(new c.PlaneGeometry(1,1),Q,1);ee.layers.set(r),ee.frustumCulled=!1,re.add(ee);const Me={target:b,camera:N,layer:r,material:Q,width:e,height:h,focus(a){le.copy(a)},compile(a){if(!a)return;Ne();const i=a.getRenderTarget();a.setRenderTarget(b),a.compile(re,N,re),a.setRenderTarget(i)},render(a,i){if(!a)return;Ne();const t=a.getRenderTarget(),M=i.overrideMaterial,m=i.background,S=a.autoClear,C=i.fog;i.fog=null,a.getClearColor(Be);const z=a.getClearAlpha();i.overrideMaterial=Q,i.background=null,a.autoClear=!0,a.setRenderTarget(b),a.setClearColor(ke,1),a.render(i,N),a.setRenderTarget(t),a.setClearColor(Be,z),i.overrideMaterial=M,i.background=m,a.autoClear=S,i.fog=C,A.uShadowOn.value=1}},ce=new c.ShaderMaterial({uniforms:A,vertexShader:`
      attribute vec3 aEdge, iColA, iColB, iAccA, iAccB; attribute vec4 iAccBox, iMisc, iHand;
      varying vec3 vWP, vWN, vON, vOP, vEdge, vCA, vCB, vAA, vAB; varying vec2 vUv; varying vec4 vBox, vMisc, vHand;
      void main(){
        vHand = iHand;
        vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.);
        vWP = wp.xyz; vWN = mat3(modelMatrix) * mat3(instanceMatrix) * normal; vON = normal; vOP = position;
        vEdge = aEdge; vUv = uv; vCA = iColA; vCB = iColB; vAA = iAccA; vAB = iAccB; vBox = iAccBox; vMisc = iMisc;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:nt+`
      uniform vec3 uPlyLight, uPlyDark;
      varying vec3 vWP, vWN, vON, vOP, vEdge, vCA, vCB, vAA, vAB; varying vec2 vUv; varying vec4 vBox, vMisc, vHand;
      void main(){
        vec3 n = vWN / max(length(vWN), 1e-4);
        vec2 fw = fwidth(vOP.xy) + 1e-4; float fe = fwidth(vEdge.x) + 1e-4;
        float fy = fwidth(vUv.y), fz = fwidth(vOP.z) * (5. / ${tt.toFixed(1)}) + 1e-4;
        // the per-piece seed is the same on every corner, but an interpolated varying still differs in its last bits
        // from triangle to triangle and pixel to pixel: it is snapped to the 64ths paint() wrote before anything reads it
        float sq = floor(vMisc.w * 64. + 0.5), seed = sq / 64., day = step(0.5, vON.z + 0.75);
        // the pot
        float inb = smoothstep(-fw.x, fw.x, vOP.x - vBox.x) * smoothstep(-fw.x, fw.x, vBox.z - vOP.x)
                  * smoothstep(-fw.y, fw.y, vOP.y - vBox.y) * smoothstep(-fw.y, fw.y, vBox.w - vOP.y);
        float eb = (vMisc.y > vMisc.x) ? smoothstep(-fe, fe, vEdge.x - vMisc.x) * smoothstep(-fe, fe, vMisc.y - vEdge.x) * smoothstep(0.35, 0.65, vEdge.z) : 1.;
        vec3 pot = mix(mix(vCB, vCA, day), mix(vAB, vAA, day), inb * eb);
        // the maker's spiral, one brush line in the accent pot on the evening face (asked for with box = [2000, pitch,
        // -1, outer radius]; the sun alone carries it): it wanders a little, starts off-centre and stops where he lifted the brush
        if (vBox.x > 1500.) {
          float rr = length(vOP.xy), th = rr > 0.5 ? atan(vOP.y, vOP.x) : 0.;
          float wob = 1.2 * (mobNoise(vOP.xy * 0.09 + seed) - 0.5), fr = max(fw.x, fw.y);
          float sp = abs(mod(rr + wob - vBox.y * th / 6.2832 + 0.5 * vBox.y, max(vBox.y, 1.)) - 0.5 * vBox.y);
          float hwS = 0.9 + 0.35 * mobNoise(vOP.xy * 0.05 + seed * 3.);
          float ln = (1. - smoothstep(hwS - fr, hwS + fr, sp)) * smoothstep(3.2, 4.6, rr) * (1. - smoothstep(vBox.w - 0.4, vBox.w + 0.4, rr + 0.35 * th));
          pot = mix(pot, vAB, ln * (1. - day));
        }
        // the hand
        // fine streaks fade before the pixel grid can beat with them; a broad stroke carries the brush to 100 m and more
        // every mark is gone before its period is five pixels: nothing can screen, weave or crawl
        float near = 1. - smoothstep(0.03, 0.08, fy), nearG = 1. - smoothstep(0.008, 0.022, fy), near2 = 1. - smoothstep(0.14, 0.36, fy);
        float broad = mobNoise(vec2(vUv.x * 0.018 + seed * 2.3, vUv.y * 0.55 + seed * 1.7 + day * 5.)) - 0.5;
        float streak = mobNoise(vec2(vUv.x * 0.045 + seed * 7.1, vUv.y * 2.4 + seed * 3.3 + day * 9.)) - 0.5;
        // lap bands: the coat laid in broad passes along the long axis. The band coordinate is the face's own smooth
        // uv (continuous over the whole cap), the seam wanders a metre or two, its edge is a ramp never under three
        // pixels wide, each band's value is a hash of two WHOLE numbers, and the laps fade out before a band is ~15 px
        float ly = vUv.y / max(vHand.w, 1.) + 0.18 * (mobNoise(vec2(vUv.x * 0.03, seed * 5. + day * 3.)) - 0.5);
        float fly = fwidth(ly) + 1e-5, lapI = floor(ly), lapW2 = min(max(0.07, 3. * fly), 0.5);
        float lapT = smoothstep(0.5 - lapW2, 0.5 + lapW2, ly - lapI), lapS = mod(sq, 89.) + day * 31.;
        float lap = (mix(mobHash(vec2(lapI, lapS)), mobHash(vec2(lapI + 1., lapS)), lapT) - 0.5) * (1. - smoothstep(0.02, 0.045, fly));
        float grain = mobNoise(vec2(vUv.x * 0.3 + seed, vUv.y * 9.));
        float thin = smoothstep(0.55, 0.95, mobNoise(vec2(vUv.x * 0.02 + seed * 3., vUv.y * 0.3 + day * 4.)));
        pot *= 1. + 0.09 * streak * near + 0.07 * broad * near2 + vHand.z * lap;
        pot = mix(pot, uPlyLight, thin * grain * 0.12 * nearG);
        float chipN = mobNoise(vOP.xy * 0.2 + seed * 11. + day * 3.) + 0.3 * (1. - clamp(vEdge.x / 1.4, 0., 1.));
        float chipT = 1.03 - 0.36 * clamp(vMisc.z, 0., 1.);
        float chip = step(0.01, vMisc.z) * smoothstep(chipT, chipT + 0.03, chipN) * (1. - smoothstep(0.9, 1.4, vEdge.x));
        pot = mix(pot, uPlyLight * (0.95 + 0.07 * grain), chip);
        // the pencil line, 0.8 m inside one cut; the two great pieces were drawn with a softer, broader lead (vHand.y)
        float hw = max(vHand.y, 0.02);
        float pl = (1. - smoothstep(hw - fe, hw + fe, abs(vEdge.x - 0.8))) * (1. - smoothstep(1.7 * hw, 5.7 * hw, fe)) * step(0.5, vEdge.y);
        pl *= 0.55 + 0.45 * mobNoise(vec2(vUv.x * 1.3, vUv.y * 1.3 + seed));
        pot = mix(pot, pot * 0.5, pl * (0.6 + 0.3 * step(0.12, hw)));
        // the bare five-ply edge
        float f = (vOP.z / ${tt.toFixed(1)} + 0.5) * 5.;
        float tri = abs(fract((f - 0.5) * 0.5) * 2. - 1.);
        float dark = 1. - smoothstep(0.5 - fz, 0.5 + fz, tri);
        vec3 wall = mix(uPlyLight, uPlyDark, dark) * (0.97 + 0.06 * mobNoise(vec2(vUv.x * 0.25, floor(f) + seed)));
        pot = mix(wall, pot, step(0.5, abs(vON.z)));
        // two values and the air
        float lit = smoothstep(0.0, 0.1, dot(n, -uLightDir)) * mobLit(vWP, n, 1., gl_FragCoord.xy);
        gl_FragColor = vec4(min(mobAir(mobValue(pot, lit), vWP, vHand.x), vec3(1.)), 1.);
      }`}),pe=(a,i,t,M=.75,m=.7)=>new c.ShaderMaterial({uniforms:{...A,uColor:{value:a},uShine:{value:i},uVanish:{value:t},uMinPx:{value:M},uBandLen:{value:0},uBand0:{value:f.boat},uBand1:{value:f.moon},uBand2:{value:f.night},uFade:{value:0}},side:c.DoubleSide,vertexShader:`
      uniform float uViewH, uVanish, uMinPx; attribute float aR; attribute vec3 aT;
      varying vec3 vWP, vWN, vT; varying vec2 vUv; varying float vCov;
      void main(){
        mat4 m = modelMatrix * instanceMatrix;
        vec4 wp = m * vec4(position, 1.);
        vec3 wn = mat3(m) * normal; wn /= max(length(wn), 1e-5);
        float dist = length(wp.xyz - cameraPosition);
        float pxm = 2. * dist / max(projectionMatrix[1][1] * uViewH, 1.);
        wp.xyz += wn * max(uMinPx * pxm - aR * length(m[1].xyz), 0.) * step(1e-4, aR);
        // how much of the drawn width is really wire (1 near the lens; far off the wire is held at its least width)
        vCov = clamp(aR * length(m[1].xyz) / max(uMinPx * pxm, 1e-4), 0., 1.);
        if (uVanish > 0.) wp.xyz = mix(m[3].xyz, wp.xyz, 1. - smoothstep(uVanish * 0.6, uVanish, dist));
        vWP = wp.xyz; vWN = wn; vUv = uv; vT = mat3(m) * aT;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:nt+`
      uniform vec3 uColor, uCream, uBand0, uBand1, uBand2; uniform float uShine, uBandLen, uFade;
      varying vec3 vWP, vWN, vT; varying vec2 vUv; varying float vCov;
      void main(){
        vec3 n = vWN / max(length(vWN), 1e-4);
        vec3 v = cameraPosition - vWP; v /= max(length(v), 1e-3);
        // Brass alone shines. The half-way direction between the lens and the window is laid flat across the wire
        // (its part along the wire is taken out), so ONE cream line runs the whole length of every wire whatever the
        // angle it is seen from, also end-on and from below. The flank turned to that direction is the pot colour,
        // the far flank the shadow value: two values and the line, nothing else.
        vec3 h = v - uLightDir + vec3(0., 0.35, 0.);
        float tl = length(vT);
        if (tl > 1e-3) { vec3 a = vT / tl; h -= a * dot(a, h); }
        h /= max(length(h), 1e-3);
        float nh = dot(n, h);
        float flank = mix(smoothstep(-0.05, 0.3, dot(n, -uLightDir)), smoothstep(-0.45, -0.05, nh), step(0.01, uShine));
        float lit = flank * mobLit(vWP, n, 1., gl_FragCoord.xy);
        // draw lines from the die run along the wire (uv.y is the angle round it): nothing crosses it
        float fl = fwidth(vUv.y * 9.) + 1e-4;
        float draw = (1. - smoothstep(0.06 - fl, 0.06 + fl, abs(fract(vUv.y * 9. + 0.37) - 0.5))) * (1. - smoothstep(0.15, 0.45, fl));
        vec3 pot = uColor * (0.95 + 0.1 * mobNoise(vec2(vUv.y * 46., 0.5))) * (1. - 0.16 * draw * step(0.01, uShine));
        // the great rod alone is painted: sleeves of matte pot colour, 9 m in every 40 m, along its sun arm (uBandLen =
        // the rod's length in metres; 0 on every other wire). Paint does not shine: no cream line on a sleeve.
        float sM = vUv.x * uBandLen, fs = fwidth(sM) + 1e-4, ci = floor(sM / 40.), cf = sM - ci * 40.;
        float band = step(0.5, uBandLen) * smoothstep(-fs, fs, cf - 14.) * (1. - smoothstep(-fs, fs, cf - 23.)) * (1. - smoothstep(236., 238., sM));
        float k3 = mod(ci, 3.);
        pot = mix(pot, k3 < 0.5 ? uBand0 : (k3 < 1.5 ? uBand1 : uBand2), band);
        vec3 col = mobValue(pot, mix(lit, smoothstep(-0.05, 0.3, dot(n, -uLightDir)) * mobLit(vWP, n, 1., gl_FragCoord.xy), band));
        col = mix(col, uCream, smoothstep(0.80, 0.97, nh) * uShine * (0.3 + 0.7 * lit) * (1. - band));
        // (uFade 1, the far wire: it keeps its least width and trades opacity, as the linen does, down to three tenths)
        gl_FragColor = vec4(min(mobAir(col, vWP, ${m.toFixed(2)}), vec3(1.)), mix(1., max(0.3, vCov), uFade));
      }`}),be=pe(f.brass,.8,0),Ye=pe(f.brass,.85,0,1.3,.3);Ye.uniforms.uBandLen.value=Te+Fe;const ot=pe(f.thread,0,450),Ee=pe(f.brass,.8,0);Ee.uniforms.uFade.value=1,Ee.transparent=!0;const Ue=(a,i)=>{const t=pe(f.brass,.5,0);return t.uniforms.uShadeY={value:new c.Vector2(a,i)},t},Re=new c.ShaderMaterial({uniforms:{...A,uColor:{value:f.thread}},transparent:!0,depthWrite:!1,side:c.DoubleSide,vertexShader:`
      uniform float uViewH, uShadowOn, uShadowRange; uniform sampler2D uShadowMap; uniform mat4 uShadowMat; uniform vec2 uShadeY;
      attribute vec3 iBow; varying vec3 vWP; varying float vA, vLit;
      void main(){
        mat4 m = modelMatrix * instanceMatrix;
        float t = position.x;
        vec3 ax = m[0].xyz;
        vec3 p = m[3].xyz + ax * t + iBow * (4. * t * (1. - t));
        vec3 tv = ax + iBow * (4. - 8. * t);
        vec3 toC = cameraPosition - p; float dist = length(toC);
        vec3 sd = cross(tv, toC); sd /= max(length(sd), 1e-4);
        float pxm = 2. * dist / max(projectionMatrix[1][1] * uViewH, 1.);
        float hw = max(0.125, 0.75 * pxm);
        p += sd * position.y * hw;
        vA = (0.125 / hw) * (1. - smoothstep(380., 820., dist));
        vec4 s = uShadowMat * vec4(p, 1.);
        float inside = step(0.004, s.x) * step(s.x, 0.996) * step(0.004, s.y) * step(s.y, 0.996) * uShadowOn;
        vLit = 1. - inside * step(textureLod(uShadowMap, s.xy, 0.).r, s.z - 0.5 - 2.5 / max(uShadowRange, 1.));
        vLit *= 1. - smoothstep(uShadeY.x, uShadeY.y, p.y);
        vWP = p;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:`
      uniform vec3 uColor, uTint, uAirWarm, uAirCool, uLightDir; uniform float uAirMax, uAirFar;
      varying vec3 vWP; varying float vA, vLit;
      void main(){
        vec3 col = uColor * mix(uTint, vec3(1.), vLit);
        vec3 v = vWP - cameraPosition; float d = length(v);
        float side = 0.5 - 0.5 * dot(v / max(d, 1e-3), uLightDir);
        col = mix(col, mix(uAirCool, uAirWarm, side), clamp(d / max(uAirFar, 1.), 0., 1.) * uAirMax);
        gl_FragColor = vec4(min(col, vec3(1.)), clamp(vA, 0., 1.));
      }`}),Ge=new c.ShaderMaterial({uniforms:{...A,uRoom:{value:f.room},uRoomEve:{value:f.roomEve},uPatch:{value:f.patch}},side:c.BackSide,depthWrite:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
      uniform vec3 uRoom, uRoomEve, uPatch, uLightDir; uniform float uEve; varying vec3 vDir;
      void main(){
        vec3 d = vDir / max(length(vDir), 1e-4);
        vec3 base = mix(uRoom, uRoomEve, uEve);
        vec3 col = base * mix(1., 0.6, smoothstep(0.02, 0.85, d.y));
        col = mix(col, base * vec3(0.9, 0.8, 0.84), (1. - smoothstep(-0.9, 0., d.y)));
        vec2 lh = uLightDir.xz / max(length(uLightDir.xz), 1e-3);
        float f = -(d.x * lh.x + d.z * lh.y);
        vec2 q = vec2(d.x * lh.y - d.z * lh.x, d.y + uLightDir.y * 0.6) / max(f, 0.15);
        float win = smoothstep(0.15, 0.4, f) * (1. - smoothstep(0.2, 0.3, abs(q.x))) * (1. - smoothstep(0.36, 0.48, abs(q.y - 0.08)));
        float bars = 1. - 0.28 * max(1. - smoothstep(0.012, 0.05, abs(q.x)), 1. - smoothstep(0.012, 0.05, abs(q.y - 0.1)));
        col = mix(col, mix(uPatch, uPatch * vec3(0.9, 0.78, 0.8), uEve) * bars, win * 0.9);
        gl_FragColor = vec4(min(col, vec3(1.)), 1.);
      }`});function je(a,i={}){const t=a.length,M=i.wobble??.4,m=i.seed??0,S=i.inset??1.6,C=i.long==="y",z=i.line||[.06,.4],O=tt/2,w=a.map(s=>[s[0],s[1]]),E=new Array(t),p=new Array(t),x=new Float32Array(t+1),I=()=>{for(let s=0;s<t;s++){const T=w[s],B=w[(s+1)%t],F=B[0]-T[0],P=B[1]-T[1],g=Math.hypot(F,P)||1e-6;E[s]=[P/g,-F/g],x[s+1]=x[s]+g}for(let s=0;s<t;s++){const T=E[(s+t-1)%t],B=E[s],F=T[0]+B[0],P=T[1]+B[1],g=Math.hypot(F,P)||1e-6;p[s]=[F/g,P/g]}};if(I(),M>0){const s=x[t],T=s*.085/(2*Math.PI);for(let B=0;B<t;B++){const F=2*Math.PI*x[B]/s,P=M*o.noise.n2(Math.cos(F)*T+m*13.7,Math.sin(F)*T-m*5.3);w[B][0]+=p[B][0]*P,w[B][1]+=p[B][1]*P}I()}const Z=(s,T)=>{let B=1e9;for(let F=0;F<t;F++){const P=w[F],g=w[(F+1)%t],H=g[0]-P[0],v=g[1]-P[1],y=et(((s-P[0])*H+(T-P[1])*v)/(H*H+v*v+1e-9),0,1),R=P[0]+H*y-s,k=P[1]+v*y-T,oe=R*R+k*k;oe<B&&(B=oe)}return Math.sqrt(B)},X=new Float32Array(t),j=new Array(t);for(let s=0;s<t;s++){let T=S;const B=Math.min(3,1/Math.max(.2,p[s][0]*E[s][0]+p[s][1]*E[s][1]));for(let F=0;F<4&&!(Z(w[s][0]-p[s][0]*T*B,w[s][1]-p[s][1]*T*B)>=T*.9);F++)T=F===3?0:T*.5;X[s]=T,j[s]=[w[s][0]-p[s][0]*T*B,w[s][1]-p[s][1]*T*B]}const J=4*t+4*t+2*t,fe=new Float32Array(J*3),xe=new Float32Array(J*3),W=new Float32Array(J*2),q=new Float32Array(J*3),$=[],U=(s,T,B,F,P,g,H,v,y,R,k,oe)=>{fe[s*3]=T,fe[s*3+1]=B,fe[s*3+2]=F,xe[s*3]=P,xe[s*3+1]=g,xe[s*3+2]=H,W[s*2]=v,W[s*2+1]=y,q[s*3]=R,q[s*3+1]=k,q[s*3+2]=oe},se=x[t];for(let s=0;s<t;s++){const T=x[s]/se,B=(z[0]<=z[1]?T>=z[0]&&T<=z[1]:T>=z[0]||T<=z[1])?1:0,F=p[s][1]>.25?1:0,P=w[s],g=j[s];U(s,P[0],P[1],O,0,0,1,C?P[1]:P[0],C?P[0]:P[1],0,B,F),U(t+s,g[0],g[1],O,0,0,1,C?g[1]:g[0],C?g[0]:g[1],X[s],B,F),U(2*t+s,P[0],P[1],-O,0,0,-1,C?P[1]:P[0],C?P[0]:P[1],0,B,F),U(3*t+s,g[0],g[1],-O,0,0,-1,C?g[1]:g[0],C?g[0]:g[1],X[s],B,F),U(8*t+s,g[0],g[1],O,0,0,1,C?g[1]:g[0],C?g[0]:g[1],9,0,0),U(9*t+s,g[0],g[1],-O,0,0,-1,C?g[1]:g[0],C?g[0]:g[1],9,0,0);const H=(s+1)%t;$.push(s,H,t+H,s,t+H,t+s,2*t+s,3*t+H,2*t+H,2*t+s,3*t+s,3*t+H);const v=E[(s+t-1)%t],y=E[s],R=E[H],k=.82,oe=v[0]*y[0]+v[1]*y[1]>k?p[s]:y,Qe=R[0]*y[0]+R[1]*y[1]>k?p[H]:y,ve=4*t+4*s,Je=w[H];U(ve,P[0],P[1],O,oe[0],oe[1],0,x[s],O,0,0,0),U(ve+1,P[0],P[1],-O,oe[0],oe[1],0,x[s],-O,0,0,0),U(ve+2,Je[0],Je[1],-O,Qe[0],Qe[1],0,x[s+1],-O,0,0,0),U(ve+3,Je[0],Je[1],O,Qe[0],Qe[1],0,x[s+1],O,0,0,0),$.push(ve,ve+1,ve+2,ve,ve+2,ve+3)}const te=c.ShapeUtils.triangulateShape(j.map(s=>new c.Vector2(s[0],s[1])),[]);for(const s of te){let[T,B,F]=s;const P=j[T],g=j[B],H=j[F];if((g[0]-P[0])*(H[1]-P[1])-(g[1]-P[1])*(H[0]-P[0])<0){const v=B;B=F,F=v}$.push(8*t+T,8*t+B,8*t+F,9*t+T,9*t+F,9*t+B)}const ne=new c.BufferGeometry;return ne.setAttribute("position",new c.BufferAttribute(fe,3)),ne.setAttribute("normal",new c.BufferAttribute(xe,3)),ne.setAttribute("uv",new c.BufferAttribute(W,2)),ne.setAttribute("aEdge",new c.BufferAttribute(q,3)),ne.setIndex(J>65535?new c.BufferAttribute(new Uint32Array($),1):new c.BufferAttribute(new Uint16Array($),1)),ne.computeBoundingSphere(),ne.userData.outline=w,ne}function Ae(){const a=[],i=[],t=[],M=[],m=[],S=[],C=new c.Vector3,z=new c.Vector3,O=new c.Vector3,w=new c.Vector3,E={sweep(p,x,I=6,Z=!1){const X=p.length,j=a.length/3;let J=0;for(let W=0;W<X;W++){const q=p[Z?(W+X-1)%X:Math.max(W-1,0)],$=p[Z?(W+1)%X:Math.min(W+1,X-1)];C.subVectors($,q).normalize(),W===0&&(z.set(0,0,1),Math.abs(C.z)>.9&&z.set(0,1,0)),z.addScaledVector(C,-z.dot(C)),z.lengthSq()<1e-8&&z.set(C.y,-C.x,0),z.normalize(),O.crossVectors(C,z),W>0&&(J+=p[W].distanceTo(p[W-1]));for(let U=0;U<=I;U++){const se=U/I*Math.PI*2,te=Math.cos(se),ne=Math.sin(se);w.set(0,0,0).addScaledVector(z,te).addScaledVector(O,ne),a.push(p[W].x+w.x*x,p[W].y+w.y*x,p[W].z+w.z*x),i.push(w.x,w.y,w.z),t.push(J,U/I),M.push(x),m.push(C.x,C.y,C.z)}}const fe=I+1,xe=Z?X:X-1;for(let W=0;W<xe;W++){const q=(W+1)%X;for(let $=0;$<I;$++){const U=j+W*fe+$,se=j+q*fe+$;S.push(U,U+1,se,U+1,se+1,se)}}return E},ball(p,x){const I=new c.IcosahedronGeometry(x,1),Z=I.attributes.position,X=a.length/3;for(let j=0;j<Z.count;j++){w.fromBufferAttribute(Z,j);const J=w.length()||1;a.push(p.x+w.x,p.y+w.y,p.z+w.z),i.push(w.x/J,w.y/J,w.z/J),t.push(0,.3),M.push(x),m.push(0,0,0),S.push(X+j)}return I.dispose(),E},file(p,x){for(let I=0;I<a.length;I+=3){const Z=a[I]*p.x+a[I+1]*p.y+a[I+2]*p.z;Z>x&&(a[I]-=p.x*(Z-x),a[I+1]-=p.y*(Z-x),a[I+2]-=p.z*(Z-x),i[I]=p.x,i[I+1]=p.y,i[I+2]=p.z)}return E},geo(){const p=new c.BufferGeometry;return p.setAttribute("position",new c.Float32BufferAttribute(a,3)),p.setAttribute("normal",new c.Float32BufferAttribute(i,3)),p.setAttribute("uv",new c.Float32BufferAttribute(t,2)),p.setAttribute("aR",new c.Float32BufferAttribute(M,1)),p.setAttribute("aT",new c.Float32BufferAttribute(m,3)),p.setIndex(S),p.computeBoundingSphere(),p}};return E}const ue=()=>Ae().sweep([new c.Vector3(0,0,0),new c.Vector3(1,0,0)],1,8).geo();function Se(a,i,t=2,M=5){const m=[],S=i*1.05,C=t*i*M,z=Math.asin(Math.min(S/a,.9)),O=Math.max(8,Math.round(t*10));for(let w=0;w<O;w++){const E=w/O,p=E*t*Math.PI*2;m.push(new c.Vector3(S*Math.cos(p),-a-C*(1-E),S*Math.sin(p)))}for(let w=0;w<=22;w++){const E=-Math.PI/2+z+w/22*(Math.PI*2-2*z);m.push(new c.Vector3(a*Math.cos(E),a*Math.sin(E),0))}for(let w=1;w<=O;w++){const E=w/O,p=Math.PI-E*t*Math.PI*2;m.push(new c.Vector3(S*Math.cos(p),-a-C*E,S*Math.sin(p)))}return Ae().sweep(m,i,6).geo()}function Ve(){const a=[],i=[];for(let m=0;m<=8;m++)if(a.push(m/8,-1,0,m/8,1,0),m<8){const S=m*2;i.push(S,S+2,S+1,S+1,S+2,S+3)}const M=new c.BufferGeometry;return M.setAttribute("position",new c.Float32BufferAttribute(a,3)),M.setIndex(i),M}function Oe(a=1){const i=o.core?o.core.makeRng(a*977+13):(()=>.5),t=Ae().ball(new c.Vector3(0,0,0),.42);for(let M=0;M<2;M++){const m=i()*6.283,S=3+2*i(),C=.2+.5*i(),z=(i()-.5)*1.6,O=[];for(let w=0;w<=7;w++){const E=w/7,p=m+z*E;O.push(new c.Vector3(Math.cos(p)*S*.75*E,(C*E-(.5+C)*E*E)*S,Math.sin(p)*S*.75*E))}t.sweep(O,.125,4)}return t.geo()}const qe=a=>{const i=new c.BufferGeometry;for(const t in a.attributes)i.setAttribute(t,a.attributes[t]);return i.setIndex(a.index),i.boundingSphere=a.boundingSphere,i.userData=a.userData,i};function Xe(a,i,t=!0){const M=qe(a),m=(C,z,O)=>{const w=new c.InstancedBufferAttribute(new Float32Array(i*z),z);if(O)for(let E=0;E<i*z;E++)w.array[E]=O[E%z];M.setAttribute(C,w)};m("iColA",3,[1,1,1]),m("iColB",3,[1,1,1]),m("iAccA",3,[1,1,1]),m("iAccB",3,[1,1,1]),m("iAccBox",4,[1,1,-1,-1]),m("iMisc",4,[0,0,0,0]),m("iHand",4,[1,.07,.05,13]);const S=new c.InstancedMesh(M,ce,i);return S.frustumCulled=!1,t&&S.layers.enable(r),S}function Ze(a,i,t){const M=a.geometry.attributes,m=(z,O)=>{O&&z.setXYZ(i,O.r,O.g,O.b)};m(M.iColA,t.day),m(M.iColB,t.eve||t.day),m(M.iAccA,t.dayAcc||t.day),m(M.iAccB,t.eveAcc||t.eve||t.day);const S=t.box||[1,1,-1,-1],C=t.edge||[0,0];M.iAccBox.setXYZW(i,S[0],S[1],S[2],S[3]),M.iMisc.setXYZW(i,C[0],C[1],t.chip??0,Math.round((t.seed??0)*64)/64),M.iHand.setXYZW(i,t.air??1,t.lineW??.07,t.lap??.05,t.lapW??13);for(const z of["iColA","iColB","iAccA","iAccB","iAccBox","iMisc","iHand"])M[z].needsUpdate=!0}function He(a,i,t=be,M=!1){const m=new c.InstancedMesh(a,t,i);return m.frustumCulled=!1,M&&m.layers.enable(r),m}function we(a){const i=Ve();i.setAttribute("iBow",new c.InstancedBufferAttribute(new Float32Array(a*3),3));const t=new c.InstancedMesh(i,Re,a);return t.frustumCulled=!1,t.renderOrder=2,t}const Le=new c.Matrix4,he=new c.Vector3,de=new c.Vector3,Pe=new c.Vector3,L=Le.elements;function $e(a,i,t,M,m){he.subVectors(M,t);const S=he.length()||1e-6;de.set(0,1,0),Math.abs(he.y)>.99*S&&de.set(1,0,0),Pe.crossVectors(he,de).normalize(),de.crossVectors(Pe,he).normalize(),L[0]=he.x,L[1]=he.y,L[2]=he.z,L[3]=0,L[4]=de.x*m,L[5]=de.y*m,L[6]=de.z*m,L[7]=0,L[8]=Pe.x*m,L[9]=Pe.y*m,L[10]=Pe.z*m,L[11]=0,L[12]=t.x,L[13]=t.y,L[14]=t.z,L[15]=1,a.setMatrixAt(i,Le),a.instanceMatrix.needsUpdate=!0}function _e(a,i,t,M,m){L[0]=M.x-t.x,L[1]=M.y-t.y,L[2]=M.z-t.z,L[3]=0,L[4]=0,L[5]=1,L[6]=0,L[7]=0,L[8]=0,L[9]=0,L[10]=1,L[11]=0,L[12]=t.x,L[13]=t.y,L[14]=t.z,L[15]=1,a.setMatrixAt(i,Le),a.instanceMatrix.needsUpdate=!0;const S=a.geometry.attributes.iBow;m?S.setXYZ(i,m.x,m.y,m.z):S.setXYZ(i,0,0,0),S.needsUpdate=!0}const Ke=new c.Vector2;return{GLSL:nt,pal:f,U:A,plyMaterial:ce,wireMaterial:be,farWireMaterial:Ee,beamMaterial:Ye,linenMaterial:ot,shadeWire:Ue,threadMaterial:Re,roomMaterial:Ge,shadow:Me,PLY:tt,eveAt:ae,tiltAt:ie,setProgress:D,get progress(){return _},shape:(a,i,t)=>gt(f,a,i,t),slab:je,wireBuilder:Ae,tubeGeo:ue,loopGeo:Se,threadGeo:Ve,knotGeo:Oe,pieceMesh:Xe,paint:Ze,wireMesh:He,threadMesh:we,setTube:$e,setThread:_e,update(a,i,t){A.uTime.value=i,o.renderer&&o.renderer.getDrawingBufferSize&&(A.uViewH.value=Math.max(64,o.renderer.getDrawingBufferSize(Ke).y))},dispose(){b.dispose(),Q.dispose(),ee.geometry.dispose()}}}function dt(o){const u=[],d=o.range(3,4.2),f=o.range(0,1),e=[];for(let h=0;h<24;h++)e.push(o.range(.82,1.12));for(let h=0;h<24;h++)for(let l=0;l<12;l++){const r=(l+.5)/12,V=(h+r+f)/24*Math.PI*2,b=Math.pow(Math.sin(r*Math.PI),.62),A=45-d*e[h]*(1-b)-(e[h]-1)*1.2;u.push([Math.cos(V)*A,Math.sin(V)*A])}return u}function ft(o,u=30){const n=u/30,d=o.range(56,66)*ye,f=o.range(14,19)*n,e=o.range(-.5,-.2),h=[],l=u*Math.cos(d),r=u*Math.sin(d),V=Math.hypot(l-f,r),b=Math.atan2(r,l-f),A=44,Y=30;for(let D=0;D<=A;D++){const N=d+D/A*(Math.PI*2-2*d);h.push([u*Math.cos(N),u*Math.sin(N)])}for(let D=1;D<Y;D++){const N=Math.PI*2-b-D/Y*(Math.PI*2-2*b);h.push([f+V*Math.cos(N),V*Math.sin(N)])}let G=0,K=0,ae=0;for(let D=0;D<h.length;D++){const N=h[D],Q=h[(D+1)%h.length],le=N[0]*Q[1]-Q[0]*N[1];G+=le,K+=(N[0]+Q[0])*le,ae+=(N[1]+Q[1])*le}K/=3*G,ae/=3*G;const ie=Math.cos(e),_=Math.sin(e);return h.map(D=>{const N=D[0]-K,Q=D[1]-ae;return[N*ie-Q*_,N*_+Q*ie]})}function st(o){let u=-1e9,n=1e9;for(let d=0;d<o.length;d++){const f=o[d],e=o[(d+1)%o.length];if(f[0]<=0!=e[0]<=0){const h=f[1]+(e[1]-f[1])*(-f[0]/(e[0]-f[0]));h>u&&(u=h),h<n&&(n=h)}}return{top:u,bot:n}}async function bt(o,u={}){const n=o.rng,d=et(u.detail??1,.6,1),f=!u.style,e=u.style||ht(o,{palette:u.palette}),h=e.pal,l=(v,y,R)=>new c.Vector3(v,y,R),r=new c.Group;r.name="beam-sun-moon",await o.yield();const V=dt(n),b=ft(n,u.moonR||30),A=n.range(1,40),Y=n.range(1,40),G=n.range(0,1),K=n.chance(.5),ae=n.range(-2.5,-.7),ie=n.int(1,999),_=[0,0,0,0,0,0].map(()=>n.range(0,Math.PI*2)),D=[0,0,0,0,0,0,0,0].map(()=>n.range(0,Math.PI*2)),N=n.range(-.5,.5),Q=u.sunTurn||[.36,.64],le=e.slab(V,{seed:A,long:"x",line:[.02+.03*G,.31+.03*G]});await o.yield();const ke=e.slab(b,{seed:Y,long:"y",line:[.1,.42]}),Be=st(le.userData.outline),De=st(ke.userData.outline),Ce=e.pieceMesh(le,1),ze=e.pieceMesh(ke,1),Ne={air:.55,lineW:.2,lap:.13,lapW:24,eveAcc:h.moon,box:[2e3,8.5,-1,33]};e.paint(Ce,0,{day:h.sun,eve:h.boat,chip:.3,seed:A,...Ne}),e.paint(ze,0,{day:h.moon,eve:h.moon,chip:0,seed:Y,air:.6,lineW:.16,lap:.07,lapW:16}),r.add(Ce,ze),await o.yield();const re=.8,ee=2.2,Me=3,ce=u.ringR||7.5,pe=u.ringW||.5,be=u.hookY||640,Ye=(K?3:2)*re*Me,ot=(K?2:3)*re*Me,Ee=ee+re*Me,Ue=e.wireMesh(e.tubeGeo(),1,e.beamMaterial,!0),Re=e.wireMesh(e.loopGeo(ee,re,K?3:2,Me),1,e.wireMaterial,!0),Ge=e.wireMesh(e.loopGeo(ee,re,K?2:3,Me),1,e.wireMaterial,!0),je=e.wireMesh(e.loopGeo(ee,re,1,Me),1,e.wireMaterial,!0),Ae=l(0,at,0),ue=l(0,at+12.5+ce,0),Se=l(ge.x*Math.cos(10*ye),Math.sin(10*ye),ge.z*Math.cos(10*ye)).normalize().applyAxisAngle(l(0,1,0),u.ringYaw||0),Ve=l(0,1,0).cross(Se).normalize(),Oe=Se.clone().cross(Ve).normalize(),qe=[],Xe=Math.round(56*d);for(let v=0;v<Xe;v++){const y=v/Xe*Math.PI*2;qe.push(ue.clone().addScaledVector(Ve,ce*Math.cos(y)).addScaledVector(Oe,ce*Math.sin(y)))}const Ze=Ve.clone().multiplyScalar(Math.cos(ae)).addScaledVector(Oe,Math.sin(ae)),He=[],we=u.hookSize||1,Le=be+6*we+20;for(let v=0;v<=4;v++)He.push(l(-3.2*we,Le-v*5,0));for(let v=0;v<=16;v++){const y=v/16*Math.PI*1.42;He.push(l(-3.2*we*Math.cos(y),be+6*we-3.2*we*Math.sin(y),0))}const he=e.wireBuilder().sweep(qe,pe,Math.round(10*d),!0).file(Ze,ue.dot(Ze)+ce+pe*.25).geo(),de=e.wireMesh(he,1,e.wireMaterial,!0);de.setMatrixAt(0,new c.Matrix4);const Pe=e.wireMesh(e.wireBuilder().sweep(He,.9*we,6).geo(),1,e.shadeWire(be-12,be+2),!0);Pe.setMatrixAt(0,new c.Matrix4),r.add(Pe),r.add(Ue,Re,Ge,je,de),await o.yield();const L=ue.clone().addScaledVector(Oe,-ce),$e=ue.clone().addScaledVector(Oe,ce),_e=l(0,be+3.7*we,0),Ke=l(0,at+ee,0),a=e.threadMesh(4),i=e.wireMesh(e.knotGeo(ie),8,e.linenMaterial,!1);e.setThread(a,2,Ke,L),e.setThread(a,3,$e,_e),r.add(a,i),f&&e.shadow.compile(o.renderer),await o.yield();const t=l(0,0,0),M=l(0,0,0),m=l(0,1,0).cross(ge).normalize(),S=l(0,1,0),C=v=>{const y=Math.cos(v),R=Math.sin(v);t.copy(ge).multiplyScalar(y).addScaledVector(S,-R),M.copy(S).multiplyScalar(y).addScaledVector(ge,R)},z=(v,y)=>y.copy(Ae).addScaledVector(M,-Ee).addScaledVector(t,v),O=v=>Math.PI-.15+Math.PI*rt(Q[0],Q[1],v),w=(v,y,R=l(0,0,0))=>(C(e.tiltAt(y)),z(v,R)),E=(v,y=l(0,0,0))=>(w(-Te,v,y),y.y-=70,y),p=(v,y=l(0,0,0))=>(w(Fe,v,y),y.y-=55,y),x={u:0,tilt:0,sunPos:l(0,0,0),moonPos:l(0,0,0),sunYaw:0,moonYaw:0,sunBottom:l(0,0,0),moonBottom:l(0,0,0),sunEnd:l(0,0,0),moonEnd:l(0,0,0)};let I=-1,Z=null,X=null;const j=new c.Matrix4,J=l(0,0,0),fe=l(0,0,0),xe=l(0,0,0),W=l(0,0,0),q=l(0,0,0),$=l(0,0,0),U={scene:null},se=(v,y,R,k)=>{xe.crossVectors(y,R),j.makeBasis(y,R,xe).setPosition(k),v.setMatrixAt(0,j),v.instanceMatrix.needsUpdate=!0},te=(v,y,R,k)=>{j.makeRotationY(R).setPosition(k),v.setMatrixAt(y,j),v.instanceMatrix.needsUpdate=!0};function ne(v){const y=I>=0?I:1-Math.abs(v/30%2-1);(f||I<0)&&e.setProgress(y);const R=e.tiltAt(y)+(.34*Math.sin(v*.71+_[0])+.13*Math.sin(v*1.63+_[1]))*ye;C(R),z(-Te,x.sunEnd),z(Fe,x.moonEnd),z(-Te+ee+Ye,W),z(Fe-ee-ot,q),e.setTube(Ue,0,W,q,re),fe.copy(t).multiplyScalar(-1),se(Re,M,fe,x.sunEnd),J.copy(M).multiplyScalar(-1),se(Ge,J,t,x.moonEnd),se(je,t,M,Ae);const k=Z!==null?Z:O(y)+.07*Math.sin(v*.37+_[2])+.03*Math.sin(v*1.1+_[3]),oe=X!==null?X:Math.PI+N+.3*Math.sin(v*.29+_[4])+.08*Math.sin(v*.83+_[5])-.5*e.eveAt(y);x.u=y,x.tilt=R,x.sunYaw=k,x.moonYaw=oe,x.sunPos.copy(x.sunEnd),x.sunPos.y-=70,x.moonPos.copy(x.moonEnd),x.moonPos.y-=55,x.sunBottom.copy(x.sunPos),x.sunBottom.y+=Be.bot,x.moonBottom.copy(x.moonPos),x.moonBottom.y+=De.bot,te(Ce,0,k,x.sunPos),te(ze,0,oe,x.moonPos),W.copy(x.sunEnd),W.y-=ee,q.copy(x.sunPos),q.y+=Be.top-.4,$.copy(m).multiplyScalar(.5*Math.sin(v*.71+_[0]+.6)),e.setThread(a,0,W,q,$),te(i,0,D[0]+k*.5,W),te(i,1,k+D[1],q),W.copy(x.moonEnd),W.y-=ee,q.copy(x.moonPos),q.y+=De.top-.4,$.copy(m).multiplyScalar(-.6*Math.sin(v*.71+_[0]+.9)),e.setThread(a,1,W,q,$),te(i,2,D[2]+oe*.5,W),te(i,3,oe+D[3],q)}te(i,4,D[4],Ke),te(i,5,D[5],L),te(i,6,D[6],$e),te(i,7,D[7],_e),ne(0);const s=l(.866,0,-.5),T=ue.clone().addScaledVector(Se,-62),B=(v,y)=>w(v,y).addScaledVector(s,6).add(l(0,9+Ee,0)),F=E(.58).add(l(56,2,0)),P={portalSeat:{position:ue.clone(),normal:Se.clone().multiplyScalar(-1),radius:ce-pe},ringAxis:Se.clone(),pivot:Ae.clone(),hook:_e.clone(),ceilingY:Le,ringR:ce,sunPlumb:l(-ge.x*Te,0,-ge.z*Te),moonPlumb:l(ge.x*Fe,0,ge.z*Fe),flyThrough:[l(-40,262,-728),l(-46,264,-600),l(-56,280,-400),l(-62,300,-290),F,B(-205,.7),B(-150,.76),B(-100,.82),T,ue.clone(),ue.clone().addScaledVector(Se,30)],viewpoints:{entry:l(-40,262,-728),sunFace:E(.52).add(l(56,-6,-70)),aboveBeam:B(-150,.76),reveal:T.clone()}};let g=null;(u.stage??f)&&(g=new c.Mesh(new c.SphereGeometry(2600,24,12),e.roomMaterial),g.renderOrder=-.5,g.frustumCulled=!1,r.add(g));let H=null;return{object:r,radius:170,height:300,center:l(0,370,0),anchors:P,style:e,state:x,ground:!1,groundY:0,pieces:{sun:Ce,moon:ze,sunSeed:A,moonSeed:Y,sunEnds:Be,moonEnds:De,sunHand:Ne},setProgress(v){I=et(v,0,1)},setSunYaw(v){Z=v},setMoonYaw(v){X=v},beamPoint:w,sunCentre:E,moonCentre:p,sunYawAt:O,update(v,y,R){if(ne(y),g&&R&&(g.position.setFromMatrixPosition(R.matrixWorld),r.worldToLocal(g.position)),!!f){if(e.update(v,y,R),!H){let k=r;for(;k.parent;)k=k.parent;k.isScene&&(H=k)}H&&(r.updateMatrixWorld(!0),e.shadow.focus(W.set(0,330,0).applyMatrix4(r.matrixWorld)),e.shadow.render(o.renderer,H))}},dispose(){f&&e.dispose()}}}const it=o=>{const u=Math.sin(o*127.1+311.7)*43758.5453;return u-Math.floor(u)};function Ie(o,u=4){const n=[];for(const e of o)e[2]?n.push(e,e,e):n.push(e);const d=n.length,f=[];for(let e=0;e<d;e++){const h=n[(e+d-1)%d],l=n[e],r=n[(e+1)%d],V=n[(e+2)%d];if(l!==r)for(let b=0;b<u;b++){const A=b/u,Y=A*A,G=Y*A;f.push([.5*(2*l[0]+(r[0]-h[0])*A+(2*h[0]-5*l[0]+4*r[0]-V[0])*Y+(3*l[0]-h[0]-3*r[0]+V[0])*G),.5*(2*l[1]+(r[1]-h[1])*A+(2*h[1]-5*l[1]+4*r[1]-V[1])*Y+(3*l[1]-h[1]-3*r[1]+V[1])*G)])}}return f}function me(o){let u=0,n=0,d=1e9,f=-1e9;for(let r=0;r<o.length;r++){const V=o[r],b=o[(r+1)%o.length],A=V[0]*b[1]-b[0]*V[1];u+=A,n+=(V[0]+b[0])*A,d=Math.min(d,V[1]),f=Math.max(f,V[1])}n/=3*u;const e=(d+f)/2,h=o.map(r=>[r[0]-n,r[1]-e]),l=st(h);return{outline:h,top:l.top,bot:l.bot,dx:n,dy:e}}function ct(o,u){const n=[4,3,5,4][o%4],d=u/60,f=[];for(let b=0;b<n;b++){const A=n===1?.5:b/(n-1),Y=1-Math.abs(A-.5-(it(o*7+1)-.5)*.3)*1.5,G=(7.5+6.5*Y+3*(it(o*13+b*3.1)-.5))*d*(5/(n+1.2));f.push({x:(A-.5)*(u-16*d)*1,y:G*(.42+.5*Y*it(o*5+b)),r:G})}const e=u/2;f[0].x=-e+f[0].r,f[n-1].x=e-f[n-1].r;const h=[];for(let b=0;b<n;b++)for(let A=205;A>=-25;A-=7){const Y=f[b],G=Y.x+Y.r*Math.cos(A*ye),K=Y.y+Y.r*Math.sin(A*ye);if(K<0)continue;let ae=!1;for(let ie=0;ie<n;ie++)if(ie!==b){const _=f[ie];(G-_.x)*(G-_.x)+(K-_.y)*(K-_.y)<_.r*_.r*.998&&(ae=!0)}ae||h.push([G,K])}const l=h[0][0],r=h[h.length-1][0],V=[[l,0],[l*.5+r*.5,0],[r,0]];for(let b=h.length-1;b>=0;b--)h[b][1]>.6&&V.push(h[b]);return V}function lt(o){const u=o%2?1.25:1,n=o%2?.82:1,d=[[8.6,0,1],[7.5,.95],[6.2,1.35],[5,1.5],[4.2,2.1],[3.5,5],[2-u,8.6],[-.4*u-.4,11.9],[-3.2*u,14.2],[-6.2*u,15,1],[-4.3*u,12.5],[-2.7*u,9.7],[-1.9,6.9],[-2,4.5],[-2.7,2.6],[-4.6,1.6],[-6.2,1.5],[-8.6,2.5],[-12,4.3,1],[-9.3,2],[-7.5,.7]],f=d.map(e=>e.slice());f.push([-6.7,0,1]);for(let e=d.length-1;e>=1;e--){const h=d[e];f.push([h[0],-h[1]*(h[1]>3?n:1),h[2]])}return Ie(f,3)}function vt(o){const u=[[[-9,9.5,8],[7,6.5,7]],[[-12,6,6],[0,10,7],[12,5.5,6]],[[-6,7,9],[10,10.5,7]]][o%3],n=[3.5,-18,-1][o%3],d=[],f=e=>{let h=2.6;for(const l of u){const r=(e-l[0])/l[2];h+=l[1]*Math.exp(-r*r)}return Math.min(h,13.4)};for(let e=20;e>=-20;e-=1){if(e<=n+8&&e>n){const h=(n+8-e)/2,l=f(e)-.9;h%1===0&&(d.push([e,l,1]),d.push([e-.35,l+2.3,1]));continue}d.push([e,f(e),e===20||e===-20?1:0])}return Ie([[-20,0,1],[0,0,1],[20,0,1],...d],2)}function mt(o){const u=o%2?4.5:0,n=[];for(let d=17;d>=-17;d-=.75){const f=Math.abs(Math.sin(Math.PI*(d-u)/12)),e=6.9-3.1*Math.pow(f,.8);n.push([d-.9*(1-f)*(1-f),e])}return[[-17,0],[-6,0],[6,0],[17,0],...n]}function pt(o){const u=o%2===1,n=[[-9.3,3.1,1],[-8.3,1.3],[-6,.25],[0,0],[5.5,.3],[8,1.5],[9.7,3.3,1],[7.2,2.8],[5.2,2.7,1]],d=u?[[5.6,6.5],[4.6,11.2,1],[-3.4,13.6,1],[-4.1,8],[-4.4,2.7,1]]:[[4.4,6.2],[2.2,10.2],[-1.6,14.2,1],[-2.6,8.5],[-3.6,2.7,1]];return Ie([...n,...d,[-7,2.8]],3)}function wt(){const o=[[13,0,1],[11.6,.55],[9,.6],[5.4,.9],[3.6,1.9],[3.1,5.2],[1.6,9.6],[-.9,13],[-4,15,1],[-3.4,11],[-3,7],[-3.6,3.6],[-5.6,2.1],[-8,1.7],[-10.2,1.3,1]],u=o.map(n=>n.slice());u.push([-9.4,0]);for(let n=o.length-1;n>=1;n--){const d=o[n];u.push([d[0],-d[1],d[2]])}return Ie(u,3)}function xt(){return Ie([[9,0],[7,2.2],[3,3.6],[-1,3.4],[-4.5,1.7],[-6.4,1.2],[-9,4.3,1],[-8,0],[-9,-4.3,1],[-6.4,-1.2],[-4.5,-1.7],[-1,-3.2],[3,-3.4],[7,-2]],3)}function yt(){return Ie([[-20,0,1],[0,0,1],[20,0,1],[20,4.5,1],[17,4.5,1],[13.5,9,1],[10,4.5,1],[8,4.5,1],[3,12.5,1],[-2,6,1],[-4,6,1],[-8.5,10.5,1],[-13,6,1],[-15,6,1],[-15,8.4,1],[-17,8.4,1],[-17,5,1],[-20,5,1]],2)}function gt(o,u,n=0,d){const f=[-1e4,-1e4,1e4,1e4],e=u==="cloud"?1:d||1,h=r=>e===1?r:r.map(V=>[V[0]*e,V[1]*e,V[2]]);if(u==="goose"){const r=me(h(wt()));return{...r,slab:{long:"y",seed:61,line:[.02,.2],inset:1.2},paint:{day:o.cloud,eve:o.night,dayAcc:o.sun,eveAcc:o.sun,box:[10.4*e-r.dx,-1.5*e-r.dy,14*e-r.dx,1.5*e-r.dy],seed:23}}}if(u==="fish"){const r=me(h(xt()));return{...r,slab:{long:"x",seed:63,line:[.05,.3],inset:1},paint:{day:o.boat,eve:o.night,dayAcc:o.moon,eveAcc:o.sun,box:[5.6*e-r.dx,.6*e-r.dy,7.2*e-r.dx,2*e-r.dy],seed:29}}}if(u==="roof")return{...me(h(yt())),slab:{long:"x",seed:67,line:[.02,.3],inset:1.6,wobble:.25},paint:{day:o.boat,eve:o.night,dayAcc:o.boat,eveAcc:o.moon,box:f,edge:[.9*e,1.7*e],seed:31}};if(u==="cumulus"){const r=d||60,V=me(ct(n,r).map(A=>[A[0],A[1]*1.7])),b=-V.dy;return{...V,slab:{long:"x",seed:15+n,line:[.55,.9]},paint:{day:o.cloud,eve:o.moon,dayAcc:o.cloud,eveAcc:o.sun,box:[-1e4,b+r*.045,1e4,b+r*.125],chip:0,seed:5+n}}}if(u==="climber"){const r=me(h(lt(n)).map(V=>[-V[1],V[0]]));return{...r,slab:{long:"x",seed:25+n,line:[.02,.2],inset:1.2},paint:{day:o.bird,eve:o.night,dayAcc:o.moon,eveAcc:o.moon,box:[-1.7*e-r.dx,4.3*e-r.dy,1.7*e-r.dx,7.1*e-r.dy],seed:9+n}}}if(u==="cloud"){const r=d||60,V=me(ct(n,r)),b=-V.dy;return{...V,slab:{long:"x",seed:11+n,line:[.55,.9]},paint:{day:o.cloud,eve:o.moon,dayAcc:o.cloud,eveAcc:o.sun,box:[-1e4,b+r*.035,1e4,b+r*.1],chip:n===3?1:0,seed:3+n}}}if(u==="swallow"){const r=me(h(lt(n)));return{...r,slab:{long:"y",seed:21+n,line:[.02,.2],inset:1.2},paint:{day:o.bird,eve:o.night,dayAcc:o.moon,eveAcc:o.moon,box:[4.3*e-r.dx,-1.7*e-r.dy,7.1*e-r.dx,1.7*e-r.dy],seed:7+n}}}if(u==="hill")return{...me(h(vt(n))),slab:{long:"x",seed:31+n,line:[.02,.3],inset:2.4},paint:{day:o.hill,eve:o.night,dayAcc:o.hill,eveAcc:o.moon,box:f,edge:[1.1*e,2*e],seed:13+n}};if(u==="wave")return{...me(h(mt(n))),slab:{long:"x",seed:41+n,line:[.02,.25],inset:1.6},paint:{day:o.bird,eve:o.night,dayAcc:o.bird,eveAcc:o.moon,box:f,edge:[0*e,.9*e],seed:17+n}};const l=me(h(pt(n)));return{...l,slab:{long:"x",seed:51+n,line:[.1,.3],inset:1},paint:{day:o.boat,eve:o.night,dayAcc:o.moon,eveAcc:o.sun,box:[-1e4,2.75*e-l.dy,1e4,1e4],seed:19+n}}}export{bt as buildHero,ht as makeStyle};
