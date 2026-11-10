import*as i from"three";import{EffectComposer as d}from"three/addons/postprocessing/EffectComposer.js";import{RenderPass as b}from"three/addons/postprocessing/RenderPass.js";import{UnrealBloomPass as p}from"three/addons/postprocessing/UnrealBloomPass.js";import{ShaderPass as h}from"three/addons/postprocessing/ShaderPass.js";const g={exposure:1,bloomStrength:.45,bloomRadius:.65,bloomThreshold:.9,saturation:1.05,contrast:1.04,tint:"#ffffff",shadowTint:"#000000",vignette:.32,grain:.025,aberration:0,flat:0,fov:62};function D(s={}){const e={...g,...s};return s.bloom&&(e.bloomStrength=s.bloom.strength??e.bloomStrength,e.bloomRadius=s.bloom.radius??e.bloomRadius,e.bloomThreshold=s.bloom.threshold??e.bloomThreshold),s.grade&&Object.assign(e,s.grade),e.tint=new i.Color(e.tint),e.shadowTint=new i.Color(e.shadowTint),e}const x=["exposure","bloomStrength","bloomRadius","bloomThreshold","saturation","contrast","vignette","grain","aberration","flat","fov"];function M(s,e,a,t){for(const r of x)t[r]=s[r]+(e[r]-s[r])*a;return t.tint.copy(s.tint).lerp(e.tint,a),t.shadowTint.copy(s.shadowTint).lerp(e.shadowTint,a),t}const T={uniforms:{tDiffuse:{value:null},uExposure:{value:1},uSaturation:{value:1},uContrast:{value:1},uTint:{value:new i.Color(1,1,1)},uShadowTint:{value:new i.Color(0,0,0)},uVignette:{value:.3},uGrain:{value:.02},uAberration:{value:0},uTime:{value:0},uFade:{value:1},uFlat:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`precision highp float;
    uniform sampler2D tDiffuse; uniform float uExposure,uSaturation,uContrast,uVignette,uGrain,uAberration,uTime,uFade,uFlat;
    uniform vec3 uTint,uShadowTint; varying vec2 vUv;
    vec3 RRTAndODTFit(vec3 v){ vec3 a=v*(v+.0245786)-.000090537; vec3 b=v*(.983729*v+.4329510)+.238081; return a/b; }
    vec3 aces(vec3 c){
      const mat3 inM=mat3(vec3(.59719,.07600,.02840),vec3(.35458,.90834,.13383),vec3(.04823,.01566,.83777));
      const mat3 outM=mat3(vec3(1.60475,-.10208,-.00327),vec3(-.53108,1.10813,-.07276),vec3(-.07367,-.00605,1.07602));
      c=inM*c; c=RRTAndODTFit(c); c=outM*c; return clamp(c,0.,1.); }
    vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(c,vec3(1./2.4))-.055, step(.0031308,c)); }
    float hash(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
    void main(){
      vec2 c = vUv-.5; float r2 = dot(c,c);
      vec3 col;
      if(uAberration>0.0001){ vec2 o=c*r2*uAberration;
        col=vec3(texture2D(tDiffuse,vUv+o).r, texture2D(tDiffuse,vUv).g, texture2D(tDiffuse,vUv-o).b);
      } else col=texture2D(tDiffuse,vUv).rgb;
      col = max(col,0.)*uExposure*uTint;
      col = mix(aces(col/.6), clamp(col,0.,1.), uFlat);
      float l = dot(col, vec3(.2126,.7152,.0722));
      col = mix(vec3(l), col, uSaturation);
      col = (col-.5)*uContrast+.5;
      col += uShadowTint*(1.-smoothstep(0.,.6,l))*.5;
      col *= mix(1., smoothstep(.95,.15,r2*1.9), uVignette);
      col = toSRGB(clamp(col,0.,1.));
      col += (hash(gl_FragCoord.xy+fract(uTime)*311.7)-.5)*uGrain;
      gl_FragColor = vec4(col*uFade,1.);
    }`},S={uniforms:{tDiffuse:{value:null},uTexel:{value:new i.Vector2(1/1280,1/720)}},vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`precision highp float;
    uniform sampler2D tDiffuse; uniform vec2 uTexel; varying vec2 vUv;
    // Bit tests as well as isnan(): a shader compiler that assumes no value is ever not-a-number may drop
    // comparisons, but cannot drop these. True for not-a-number, infinity and anything beyond +-60000.
    bool badf(float x){ return isnan(x) || isinf(x) || (floatBitsToUint(x) & 0x7fffffffu) > 0x476a6000u; }
    vec4 clean(vec2 uv){
      vec3 c = textureLod(tDiffuse, uv, 0.).rgb;
      bool bad = badf(c.r) || badf(c.g) || badf(c.b);
      return bad ? vec4(0.) : vec4(clamp(c, -400., 400.), 1.);
    }
    void main(){
      vec4 c = clean(vUv);
      if (c.a < .5) {
        // fill the hole with what surrounds it: look further out (1, 3, 9 ... 243 pixels) until something valid is found
        float r = 1.; vec2 d = uTexel * .7, e = vec2(uTexel.x, -uTexel.y) * .7;
        for (int i = 0; i < 6; i++) {
          c = clean(vUv + vec2(uTexel.x, 0.) * r) + clean(vUv - vec2(uTexel.x, 0.) * r) + clean(vUv + vec2(0., uTexel.y) * r) + clean(vUv - vec2(0., uTexel.y) * r)
            + clean(vUv + d * r) + clean(vUv - d * r) + clean(vUv + e * r) + clean(vUv - e * r);
          if (c.a > .5) break;
          r *= 3.;
        }
        c.rgb = c.a > .5 ? c.rgb / c.a : vec3(0.);
      }
      float a = textureLod(tDiffuse, vUv, 0.).a;   // the bloom pass weighs each pixel by this, so it must pass through unchanged
      gl_FragColor = vec4(c.rgb, badf(a) ? 1. : clamp(a, 0., 1.));
    }`};class F{constructor(e,a,t,r,u=4,o=i.HalfFloatType){this.renderer=e;const n=new i.WebGLRenderTarget(a*r,t*r,{type:o,samples:u});this.composer=new d(e,n),this.composer.setPixelRatio(r),this.composer.setSize(a,t),this.renderPass=new b(new i.Scene,new i.PerspectiveCamera),this.bloom=new p(new i.Vector2(a,t),.5,.6,.9);for(const l of this.bloom.separableBlurMaterials){const c=.5*l.defines.KERNEL_RADIUS,m=Math.ceil(2.5*c)+1,f=[];for(let v=0;v<m;v++)f.push(Math.exp(-.5*v*v/(c*c)));l.defines.KERNEL_RADIUS=m,l.uniforms.gaussianCoefficients.value=f,l.needsUpdate=!0}this.final=new h(T),this.guard=new h(S),this.composer.addPass(this.renderPass),this.composer.addPass(this.guard),this.composer.addPass(this.bloom),this.composer.addPass(this.final),this.guard.uniforms.uTexel.value.set(1/Math.max(1,a*r),1/Math.max(1,t*r)),o!==i.HalfFloatType&&(this.bloom.enabled=!1)}prewarm(e,a){const t=this.renderer,r=this.final.fsQuad._mesh.geometry,u=[],o=this.bloom,n=(l,c)=>{if(l){t.setRenderTarget(c?null:e);try{u.push(t.compileAsync(new i.Mesh(r,l),a))}catch{}}};try{if(n(this.guard.material,!1),o.enabled){n(o.materialHighPassFilter,!1);for(const l of o.separableBlurMaterials||[])n(l,!1);n(o.compositeMaterial,!1),n(o.blendMaterial,!1)}n(this.final.material,!1),n(this.final.material,!0)}finally{t.setRenderTarget(null)}return Promise.allSettled(u)}get bloomTexture(){return this.bloom.enabled?this.bloom.renderTargetsHorizontal[0].texture:null}setSize(e,a,t){this.composer.setPixelRatio(t),this.composer.setSize(e,a),this.guard.uniforms.uTexel.value.set(1/Math.max(1,e*t),1/Math.max(1,a*t))}setSamples(e){for(const a of[this.composer.renderTarget1,this.composer.renderTarget2])a.samples=e,a.dispose()}dispose(){this.guard.dispose(),this.bloom.dispose(),this.final.dispose(),this.composer.dispose()}setStylePass(e){this.stylePass&&this.composer.removePass(this.stylePass),this.stylePass=e||null,e&&this.composer.addPass(e)}render(e,a,t,r,u=1){this.renderPass.scene=e,this.renderPass.camera=a,this.bloom.strength=t.bloomStrength,this.bloom.radius=t.bloomRadius,this.bloom.threshold=t.bloomThreshold;const o=this.final.uniforms;o.uExposure.value=t.exposure,o.uSaturation.value=t.saturation,o.uContrast.value=t.contrast,o.uTint.value.copy(t.tint),o.uShadowTint.value.copy(t.shadowTint),o.uVignette.value=t.vignette,o.uGrain.value=t.grain,o.uAberration.value=t.aberration,o.uFlat.value=t.flat||0,o.uTime.value=r,o.uFade.value=u,this.composer.render()}}export{g as POST_DEFAULTS,F as Post,M as blendPost,D as normalizePost};
