import*as p from"three";import{ShaderPass as f}from"three/addons/postprocessing/ShaderPass.js";import*as h from"../kit/core.js";import{STYLES as n}from"../extras.js";const{smoothstep:d,makeRng:m,hashSeed:x}=h,g=`precision highp float;
uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uTime, uStrength, uSeed, uScale; uniform vec3 uAccent; varying vec2 vUv;
float luma(vec3 c){ return dot(c, vec3(.2126,.7152,.0722)); }
vec3 src(vec2 uv){ return texture2D(tDiffuse, clamp(uv, 0., 1.)).rgb; }
float hash21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
vec2 hash22(vec2 p){ vec3 p3=fract(vec3(p.xyx)*vec3(.1031,.1030,.0973)); p3+=dot(p3,p3.yzx+33.33); return fract((p3.xx+p3.yz)*p3.zy); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash21(i),hash21(i+vec2(1,0)),f.x), mix(hash21(i+vec2(0,1)),hash21(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vnoise(p); p=p*2.03+17.1; a*=.5; } return s; }
// one screen pixel in uv, and one "design" pixel (a css pixel) in uv: size brushes and dots with px
vec2 texel(){ return 1./uRes; }
vec2 px(){ return uScale/uRes; }
// Sobel edge strength on luminance, sampled r design pixels apart (0 flat .. ~1 hard edge)
float edge(vec2 uv, float r){ vec2 d=px()*r;
  float tl=luma(src(uv+d*vec2(-1,1))), t=luma(src(uv+d*vec2(0,1))), tr=luma(src(uv+d*vec2(1,1)));
  float l=luma(src(uv+d*vec2(-1,0))), rr=luma(src(uv+d*vec2(1,0)));
  float bl=luma(src(uv+d*vec2(-1,-1))), b=luma(src(uv+d*vec2(0,-1))), br=luma(src(uv+d*vec2(1,-1)));
  float gx=-tl-2.*l-bl+tr+2.*rr+br, gy=-tl-2.*t-tr+bl+2.*b+br; return length(vec2(gx,gy)); }
// 9-tap soft blur, r design pixels
vec3 blur(vec2 uv, float r){ vec2 d=px()*r; vec3 s=src(uv)*.25;
  s+=(src(uv+d*vec2(1,0))+src(uv-d*vec2(1,0))+src(uv+d*vec2(0,1))+src(uv-d*vec2(0,1)))*.125;
  s+=(src(uv+d)+src(uv-d)+src(uv+d*vec2(1,-1))+src(uv+d*vec2(-1,1)))*.0625; return s; }
vec3 rgb2hsv(vec3 c){ vec4 K=vec4(0.,-1./3.,2./3.,-1.); vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g)); vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r)); float d=q.x-min(q.w,q.y); return vec3(abs(q.z+(q.w-q.y)/(6.*d+1e-10)), d/(q.x+1e-10), q.x); }
vec3 hsv2rgb(vec3 c){ vec3 p=abs(fract(c.xxx+vec3(1.,2./3.,1./3.))*6.-3.); return c.z*mix(vec3(1.),clamp(p-1.,0.,1.),c.y); }
// paper: fibre and tooth, ~1 mean
float paper(vec2 uv, float scale){ vec2 p=uv*uRes/uScale/scale; return .5+.5*(fbm(p*.9)*.6+vnoise(p*vec2(.35,2.4))*.25+hash21(floor(p*2.))*.15); }
`,y=`
void main(){ vec3 base = src(vUv); vec3 styled = clamp(style(vUv, base), 0., 1.); gl_FragColor = vec4(mix(base, styled, uStrength), 1.); }`,b="varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }";class z{constructor(t){this.e=t,this.passes=new Map,this.active=null,this.activeId=null,this.k=0}async _pass(t){if(this.passes.has(t))return this.passes.get(t);const e=n.find(c=>c.id===t);if(!e)return null;const s=e.glsl?e:(await e.load()).default,a=new f({uniforms:{tDiffuse:{value:null},uRes:{value:new p.Vector2(1,1)},uTime:{value:0},uStrength:{value:0},uSeed:{value:0},uScale:{value:1},uAccent:{value:new p.Color(1,.3,.2)},...s.uniforms||{}},vertexShader:b,fragmentShader:g+s.glsl+y});return a.styleDef={...e,...s},this.passes.set(t,a),a}async prepare(t){const e=this.e.settings.style;let s=null;if(e&&e!=="auto"&&e!=="off")s=e;else if(e==="auto"&&t.world.style!=="none"&&n.length){const a=m(x(t.seed+":style")),c=n.filter(v=>!(v.avoid||[]).includes(t.def.category)),r=c.find(v=>v.id===t.world.style);r?s=r.id:c.length&&a.chance(.16)&&(s=a.pick(c).id)}if(t.styleId=s,t.styleManual=!!(e&&e!=="auto"&&e!=="off"),s){const a=await this._pass(s);if(!a)t.styleId=null;else{const c=this.e.renderer;try{c.setRenderTarget(null),await c.compileAsync(a.fsQuad._mesh,this.e.camera)}catch{}}}}enter(t){this.seed=t.seed%1e3/1e3}update(t,e,s,a){const c=e.styleId,r=c?this.passes.get(c):null,v=e.styleManual||a?1:d(.03,.11,s)*(1-d(.8,.92,s)),i=r?v*(this.e.settings.styleStrength??1):0,o=this.e.post;if(i>.004){this.active!==r&&(o.setStylePass(r),this.active=r);const l=r.uniforms,u=this.e.pr;l.uStrength.value=i,l.uTime.value=this.e.time,l.uSeed.value=this.seed,l.uScale.value=u*Math.max(1,this.e.h/900),l.uRes.value.set(Math.round(this.e.w*u),Math.round(this.e.h*u)),l.uAccent.value.copy(e.post.tint),this.activeId=c}else this.active&&(o.setStylePass(null),this.active=null,this.activeId=null);this.k=i}}export{g as STYLE_PRELUDE,z as StyleLens};
