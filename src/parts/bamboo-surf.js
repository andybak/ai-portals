import*as c from"three";const lt=["#3E8E63","#B9D94A","#1F4B4A","#A9CFA0","#59636E","#EDF1F2","#E3912B"],pe=6,_e=52,Ee=34,Be=`
  uniform float uTime;
  uniform vec4 uWind;
  uniform vec4 uPart;
  uniform vec4 uLane;
  uniform vec4 uBand;
  float bsPulse(float ph){
    float r = smoothstep(0.0, 0.2, ph);
    float d = max(ph - 0.2, 0.0);
    return r*exp(-d*4.2)*(0.8 + 0.2*cos(d*21.0))*(1.0 - smoothstep(0.86, 1.0, ph));
  }
  // x: swell (110 m apart, 26 m/s), y: ripple (30 m, 30 m/s); both 0..1, fast rise, damped spring-back
  vec2 bsGust(vec2 p, float t){
    float a = dot(p, uWind.xy);
    float c = dot(p, vec2(-uWind.y, uWind.x));
    float w = sin(c*0.045 + uWind.w)*7.0 + sin(c*0.11 + t*0.2 + uWind.w*2.0)*2.5;
    float s = bsPulse(fract((26.0*t - a - w)/110.0 + uWind.w*0.31));
    float r = bsPulse(fract((30.0*t - a + w*0.4)/30.0 + 0.37));
    return vec2(s, r);
  }
  // THE SWELL the world sends across its crest flight (uBand: xy the centre of the circle its fronts lie on, z the
  // radius of one of them, w on): a front every 110 m, without end. How hard a culm is bowed by it: a fast rise at the
  // front, a slow spring-back
  float bsSwell(vec2 p){
    if (uBand.w <= 0.0) return 0.0;
    vec2 e = p - uBand.xy;
    float cW = atan(e.y, e.x)*uBand.z;
    float s = uBand.z - length(e) - (sin(cW*0.045 + uWind.w)*7.0 + sin(cW*0.11 + uTime*0.2 + uWind.w*2.0)*2.5 + sin(cW*0.017 + uWind.w*1.7)*12.0);
    float sm = s - 110.0*floor(s/110.0);
    return uBand.w*smoothstep(-2.0, 9.0, sm)*exp(-max(sm - 9.0, 0.0)/26.0)*(1.0 - smoothstep(60.0, 100.0, sm));
  }
  uniform vec3 uGlades[16];
  float bsGlade(vec2 p){
    float m = 0.0;
    for (int i = 0; i < 16; i++) m = max(m, 1.0 - smoothstep(uGlades[i].z*0.45, uGlades[i].z, length(p - uGlades[i].xy)));
    return m;
  }
  // 1 under the fern layer, 0 on the narrow litter paths that wander through it (mirrored in JS as fernCover)
  float bsFernCover(vec2 p){
    vec2 w = p + vec2(sin(p.y*0.21 + 1.3), sin(p.x*0.17 + 4.1))*2.2;
    float a = sin(w.x*0.39 + 0.8*sin(w.y*0.23));
    float b = sin(w.y*0.33 + 0.9*sin(w.x*0.19) + 2.0);
    float g = sin(p.x*0.071 + p.y*0.043 + 1.0)*sin(p.y*0.063 - p.x*0.031);
    return smoothstep(0.06, 0.2, abs(a*b) + 0.35*max(g, 0.0));
  }
  float bsLaneX(float z){ return uLane.x*sin(z*uLane.y + uLane.z); }
  // xy: unit direction of the splay (forward and outward from the lane), z: opening 0..1.1
  vec3 bsPart(vec2 p, float q){
    float a = uPart.z - p.y;
    float dx = p.x - bsLaneX(p.y);
    float m = smoothstep(-6.0, 6.0, a)*(1.0 - smoothstep(uPart.w - 8.0, uPart.w + 6.0, a))*(1.0 - smoothstep(13.0, 24.0, abs(dx)));
    float x = max((uPart.x - a - 5.0*q)/9.0, 0.0);
    float o = (1.0 - exp(-2.4*x)*cos(3.4*x))*m*(1.0 - uPart.y);
    return vec3(normalize(vec2(clamp(dx/3.0, -1.0, 1.0)*0.9, -0.5)), o);
  }
  // 1 on the floor of the gully head once the parting has opened the crowns above it (light floods in behind the front)
  float bsPartLit(vec2 p){
    float a = uPart.z - p.y;
    return (1.0 - uPart.y)*smoothstep(-14.0, 6.0, uPart.x - a)*smoothstep(-8.0, 4.0, a)*(1.0 - smoothstep(64.0, 82.0, a))*(1.0 - smoothstep(18.0, 32.0, abs(p.x - bsLaneX(p.y))));
  }
  // A culm as a progressive curve. base: foot. P: (height, suppleness, lean azimuth, lean at tip in rad).
  // s: arc length up the stem. Angle at s = tip angle x (s/H)^1.6, integrated so length is kept;
  // the gust is read later the higher up the stem, so the bow travels to the tip and whips.
  // Returns the point; tang = stem direction there; wg = (swell, ripple, parting) felt at this height.
  vec3 bsCulm(vec3 base, vec4 P, float s, out vec3 tang, out vec3 wg){
    float q = clamp(s/max(P.x, 1.0), 0.0, 1.15);
    vec2 g = bsGust(base.xz, uTime - 0.42*q);
    vec3 pt = bsPart(base.xz, q);
    float calm = 1.0 - 0.85*pt.z;
    vec2 A = uWind.xy*((0.50*g.x + 0.12*g.y)*P.y*uWind.z*calm);
    A += pt.xy*(pt.z*0.82*min(P.y, 1.1));
    A += uWind.xy*(0.5*bsSwell(base.xz)*min(P.y, 1.2)*min(uWind.z, 1.0));
    A += vec2(sin(uTime*0.9 + base.x*0.31 + P.z*3.0), cos(uTime*0.73 + base.z*0.27 + P.z))*(0.03*P.y);
    A += vec2(cos(P.z), sin(P.z))*P.w;
    float ang = length(A);
    vec2 d = A/max(ang, 1e-4);
    float th = min(ang*pow(max(q, 1e-4), 1.6), 1.35);
    float a2 = th*th;
    float hx = s*th*(1.0/2.6 - a2/34.8);
    float hy = s*(1.0 - a2/8.4 + a2*a2/177.6);
    tang = vec3(d.x*sin(th), cos(th), d.y*sin(th));
    wg = vec3(g, pt.z);
    return base + vec3(d.x*hx, hy, d.y*hx);
  }
`,ct=`
  float bsBandQ(vec2 p, float dist, vec2 c, float R){
    vec2 e = p - c; float r = length(e);
    float cW = atan(e.y, e.x)*R;
    float wv = sin(cW*0.045 + uWind.w)*7.0 + sin(cW*0.11 + uTime*0.2 + uWind.w*2.0)*2.5 + sin(cW*0.017 + uWind.w*1.7)*12.0;
    float s = R - r - wv;
    s -= 110.0*floor(s/110.0);
    return s/(21.0*(1.0 + min(dist, 1400.0)/520.0));
  }
  float bsBandK(float q){ return smoothstep(0.0, 0.36, q)*(1.0 - smoothstep(0.44, 1.0, q)); }
  vec3 bsBandHue(vec3 cel){ vec3 h = cel*vec3(0.9, 1.08, 0.9); return h/max(dot(h, vec3(0.3, 0.55, 0.15)), 0.05); }
`,Ve=`
  #include <common>
  #include <lights_pars_begin>
  uniform float uSunGain;
  uniform vec3 uSunTint;
  vec3 bsSunDir(){
    #if NUM_DIR_LIGHTS > 0
      return directionalLights[0].direction;
    #else
      return vec3(0.0, 1.0, 0.0);
    #endif
  }
  vec3 bsSunCol(){
    #if NUM_DIR_LIGHTS > 0
      return directionalLights[0].color*uSunTint*(uSunGain*0.3183);
    #else
      return vec3(0.0);
    #endif
  }
  vec3 bsAmb(vec3 n){
    vec3 irr = ambientLightColor;
    #if NUM_HEMI_LIGHTS > 0
      irr += getHemisphereLightIrradiance(hemisphereLights[0], n);
    #endif
    return irr*0.3183;
  }
  float bsHash(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
  float bsNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
    return mix(mix(bsHash(i), bsHash(i + vec2(1.0, 0.0)), f.x), mix(bsHash(i + vec2(0.0, 1.0)), bsHash(i + vec2(1.0, 1.0)), f.x), f.y); }
`,Ne=()=>c.UniformsUtils.clone(c.UniformsLib.fog),qe=()=>c.UniformsUtils.clone(c.UniformsLib.lights),se=a=>new c.Color(a),oe=(a,r,e)=>{const s=Math.min(1,Math.max(0,(e-a)/(r-a)));return s*s*(3-2*s)},Ue=a=>a-Math.floor(a);function $e(a,r){const e=a+Math.sin(r*.21+1.3)*2.2,s=r+Math.sin(a*.17+4.1)*2.2,h=Math.sin(e*.39+.8*Math.sin(s*.23)),p=Math.sin(s*.33+.9*Math.sin(e*.19)+2),m=Math.sin(a*.071+r*.043+1)*Math.sin(r*.063-a*.031);return oe(.06,.2,Math.abs(h*p)+.35*Math.max(m,0))}function Xe(a){const r=oe(0,.2,a),e=Math.max(a-.2,0);return r*Math.exp(-e*4.2)*(.8+.2*Math.cos(e*21))*(1-oe(.86,1,a))}function ut(a){return new c.ShaderMaterial({fog:!0,lights:!0,uniforms:{...qe(),...Ne(),...a},vertexShader:`
      attribute vec3 aBase; attribute vec4 aCulm; attribute vec4 aLook;
      uniform float uPx; uniform vec4 uBreak, uOld;
      varying vec3 vN, vV, vG; varying vec4 vS; varying vec3 vK; varying vec2 vBk;
      #include <fog_pars_vertex>
      ${Be}
      void main(){
        float q = position.y;
        float s = q*aCulm.x;
        vec3 T, wg;
        vec3 c = bsCulm(aBase, aCulm, s, T, wg);
        float r = aLook.x*(1.0 - 0.82*q*sqrt(q))*(1.0 + 0.22*exp(-s*2.2));
        vec3 n1 = normalize(cross(T, vec3(1.0, 0.0, 0.0)));
        vec3 n2 = cross(n1, T);
        vec3 nrm = n1*position.x + n2*position.z;
        vec4 mvPosition = modelViewMatrix*vec4(c, 1.0);
        float old = uOld.w*(1.0 - smoothstep(uOld.z*0.7, uOld.z, length(aBase.xz - uOld.xy)));
        float rr = max(r, (0.75 + 0.25*min(old, 2.0))*uPx*length(mvPosition.xyz));          // never thinner than 1.5 px (the lit clump's veterans 2.5: they are the mark at the end of the aisle)
        vec3 nv = normalize(normalMatrix*nrm);
        mvPosition.xyz += nv*rr;
        vN = nv; vV = mvPosition.xyz; vG = wg; vG.x = max(vG.x, bsGlade(aBase.xz)*0.9);
        vS = vec4(s, atan(position.z, position.x + 1e-5), aLook.y, aLook.z);
        vK = vec3(q, r/rr, aLook.w);
        vBk = vec2(uBreak.w*(1.0 - smoothstep(uBreak.z*0.5, uBreak.z, length(aBase.xz - uBreak.xy))), old);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uJade, uLime, uDeep, uCeladon, uWhite, uSlate;
      uniform float uSnow, uBreakSun; uniform vec2 uFill;
      varying vec3 vN, vV, vG; varying vec4 vS; varying vec3 vK; varying vec2 vBk;
      #include <fog_pars_fragment>
      ${Ve}
      void main(){
        float s = vS.x, age = vS.z, seed = vS.w;
        float n = s/vK.z + seed*7.0;
        float fw = fwidth(n);
        float detail = 1.0 - smoothstep(0.22, 0.7, fw);
        float fb = fract(n);
        float f0 = abs(fract(n + 0.5) - 0.5);
        float node = (1.0 - smoothstep(0.012, 0.035 + fw, f0))*detail;
        float wax = smoothstep(0.87, 0.93, fb)*(1.0 - smoothstep(0.955, 0.985, fb))*detail;
        // colour by age: powder blue-green shoots of this year, jade, then greyer and lichened, then straw
        vec3 young = mix(uJade, vec3(0.42, 0.74, 0.66), 0.62);
        vec3 old = mix(uJade, vec3(0.42, 0.44, 0.27), 0.6);
        vec3 dead = vec3(0.50, 0.44, 0.30);
        vec3 alb = mix(young, uJade, smoothstep(0.1, 0.35, age));
        alb = mix(alb, old, smoothstep(0.55, 0.9, age));
        alb = mix(alb, dead, smoothstep(1.05, 1.2, age));
        float blot = bsNoise(vec2(vS.y*1.6 + seed*31.0, s*0.9)) * bsNoise(vec2(vS.y*4.0, s*3.1 + seed*9.0));
        alb = mix(alb, vec3(0.55, 0.60, 0.50), smoothstep(0.22, 0.5, blot)*smoothstep(0.45, 0.95, age)*0.7);     // lichen
        alb *= 0.82 + 0.3*fb*detail + 0.16*(bsNoise(vec2(vS.y*9.0, s*0.35 + seed*5.0)) - 0.5);                  // internode gradient, streaks
        alb = mix(alb, uWhite*0.7, wax*(0.5 - 0.3*smoothstep(0.6, 1.0, age)));
        alb *= 1.0 - 0.72*node;
        float sh = bsNoise(vec2(vS.y*2.5 + seed*17.0, 3.0))*0.7;
        alb = mix(alb, vec3(0.20, 0.13, 0.07)*(0.7 + 0.6*bsNoise(vec2(vS.y*14.0, s*2.0))), 1.0 - smoothstep(0.35 + sh, 0.6 + sh, s)); // brown sheath at the foot
        alb = mix(alb, vec3(0.20, 0.36, 0.14), (1.0 - smoothstep(0.4, 2.6, s))*smoothstep(0.35, 0.75, bsNoise(vec2(vS.y*3.0 + seed, s*2.0)))*0.6);  // moss
        vec3 N = normalize(vN), V = normalize(-vV), L = bsSunDir();
        float crown = smoothstep(0.5, 0.92, vK.x);
        float open = mix(uFill.x + (1.0 - uFill.x)*smoothstep(0.05, 0.75, vG.x + vG.z), 1.0, crown);     // the gust is the shutter (uFill.x: what leaks through when it is shut)
        float lit = clamp(vBk.y, 0.0, 4.0);                                                // (the clump the world stands in a shaft of its own: its stems take the whole beam)
        vec3 sun = bsSunCol()*mix(mix(vec3(1.0), uLime*1.9, 0.6), vec3(1.0), max(crown, vBk.x))*mix(max(open, min(lit, 1.0)), 1.0, vBk.x)*(1.0 + uBreakSun*vBk.x + lit);     // (vBk.x: under the break in the cloud the sun is whole)
        float ndl = max(dot(N, L), 0.0);
        vec3 amb = bsAmb(N)*mix(0.7*uFill.y, 1.0, crown) + (uJade*0.7 + uDeep + uLime*0.12)*bsAmb(vec3(0.0, 1.0, 0.0))*(0.8*uFill.y)*(1.0 - crown);
        vec3 col = alb*(amb + sun*(ndl*0.9 + 0.1));
        vec3 Hh = normalize(L + V + vec3(0.0, 1e-4, 0.0));
        float ndv = clamp(dot(N, V), 0.0, 1.0);
        float fres = (1.0 - ndv)*(1.0 - ndv);
        col += sun*pow(max(dot(N, Hh), 0.0), 36.0)*0.55*(1.0 - 0.5*node);                // wet highlight
        col += bsAmb(vec3(0.0, 1.0, 0.0))*fres*fres*0.35*mix(0.5, 1.0, crown);            // wet sheen from the sky
        col = mix(col, uWhite*(amb + sun*0.6)*0.8, uSnow*smoothstep(0.2, 0.8, N.y*0.0 + blot*2.0)*0.35);
        col = mix(col, mix(uDeep, uJade, 0.4)*(amb*1.3 + sun*0.3), (1.0 - vK.y)*0.4);                    // widened far stems read thinner
        col *= mix(0.3, 1.0, max(smoothstep(0.1, 1.9, s), 0.5*min(lit, 1.0)));                                                   // every culm stands in its own shade
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function ft(a,r){const e=[],s=[];for(let p=0;p<=r;p++){const m=Math.pow(p/r,.9);for(let b=0;b<a;b++){const f=b/a*Math.PI*2;e.push(Math.cos(f),m,Math.sin(f))}}for(let p=0;p<r;p++)for(let m=0;m<a;m++){const b=p*a+m,f=p*a+(m+1)%a,v=b+a,l=f+a;s.push(b,v,f,f,v,l)}const h=new c.InstancedBufferGeometry;return h.setAttribute("position",new c.Float32BufferAttribute(e,3)),h.setIndex(s),h}function ge(a,r,e,s){a.setAttribute(r,new c.InstancedBufferAttribute(new Float32Array(e),s))}function We(a,r,e,s){const h=ft(r,e),p=[],m=[],b=[];for(const v of a)p.push(v.x,v.y,v.z),m.push(v.h,v.stiff,v.leanAz,v.lean),b.push(v.r,v.age,v.seed,v.node);ge(h,"aBase",p,3),ge(h,"aCulm",m,4),ge(h,"aLook",b,4),h.instanceCount=a.length;const f=new c.Mesh(h,s);return f.frustumCulled=!1,f}function dt(a){const e=document.createElement("canvas");e.width=e.height=512;const s=e.getContext("2d");s.clearRect(0,0,512,512);const h=(f,v,l,d,w,k)=>{s.save(),s.translate(f,v),s.rotate(l);const o=Math.round(k*255);s.fillStyle=`rgb(${o},${o},${o})`,s.beginPath(),s.moveTo(0,0),s.quadraticCurveTo(d*.3,-w,d,0),s.quadraticCurveTo(d*.3,w,0,0),s.fill(),s.strokeStyle="rgba(255,255,255,0.35)",s.lineWidth=1,s.beginPath(),s.moveTo(0,0),s.lineTo(d*.9,0),s.stroke(),s.restore()},p=(f,v,l,d,w,k)=>{const o=Math.max(3,Math.round(d/(w>0?26:11)));let L=f,D=v,j=l;for(let S=0;S<o;S++){const F=L+Math.cos(j)*d/o,G=D+Math.sin(j)*d/o;s.strokeStyle="rgb(110,110,110)",s.lineWidth=k,s.beginPath(),s.moveTo(L,D),s.lineTo(F,G),s.stroke(),L=F,D=G,j+=a.range(-.1,.1);const W=(S+1)/o;if(w>0&&S>0&&a.chance(.72)){const N=S%2?1:-1;p(L,D,j+N*a.range(.45,.9),d*(.36-.16*W)*a.range(.8,1.2),w-1,Math.max(1.2,k*.55))}if(w===0){const N=a.int(2,3);for(let X=0;X<N;X++)h(L,D,j+a.range(-1.1,1.1),a.range(16,28),a.range(3,4.8),a.range(.5,1))}}for(let S=0;S<4;S++)h(L,D,j+(S-1.5)*.42+a.range(-.1,.1),a.range(18,30),a.range(3.2,5),a.range(.6,1))},m=(f,v,l,d)=>{s.beginPath(),s.moveTo(f,v);const w=[];for(let k=1;k<24;k++){const o=k/24;w.push([o,d*Math.pow(Math.sin(Math.PI*Math.pow(o,.72)),.75)*(k%2?1:a.range(.55,.85))])}for(const[k,o]of w)s.lineTo(f+o,v+(l-v)*k);s.lineTo(f,l);for(const[k,o]of w.reverse())s.lineTo(f-o*a.range(.85,1),v+(l-v)*k);s.closePath(),s.clip()};s.save(),m(128,510,4,118),p(128,510,-Math.PI/2,470,2,4);for(const f of[-.3,.3,-.16,.16])p(128,510,-Math.PI/2+f,a.range(300,420),2,2.5);for(const f of[-.55,.55])p(128,470,-Math.PI/2+f,200,1,2);s.restore(),s.save(),m(384,382,4,116),p(384,382,-Math.PI/2,350,2,3.5);for(const f of[-.34,.34,-.18,.18])p(384,382,-Math.PI/2+f,a.range(230,320),2,2.5);for(const f of[-.6,.6])p(384,340,-Math.PI/2+f,150,1,2);s.restore(),s.save(),s.beginPath(),s.rect(258,388,252,122),s.clip(),s.strokeStyle="rgb(110,110,110)",s.lineWidth=3,s.beginPath(),s.moveTo(258,450),s.lineTo(508,450),s.stroke();for(let f=0;f<26;f++){const v=f/25,l=262+v*240,d=56*Math.sin(Math.PI*Math.min(1,.12+v*.95))*(1-.35*v)+5;h(l,450,-Math.PI/2+.35,d,5.5,a.range(.6,1)),h(l,450,Math.PI/2-.35,d,5.5,a.range(.6,1))}s.restore();const b=new c.CanvasTexture(e);return b.colorSpace=c.NoColorSpace,b.generateMipmaps=!0,b.minFilter=c.LinearMipmapLinearFilter,b.magFilter=c.LinearFilter,b.anisotropy=4,b}function vt(){const a=[],r=[],e=[];[0,Math.PI/3,-Math.PI/3].forEach((p,m)=>{const b=Math.cos(p),f=Math.sin(p),v=a.length/3;for(let l=0;l<=3;l++)for(let d=0;d<2;d++){const w=d-.5,k=l/3;a.push(b*w,k,f*w),r.push(m===1?1-d:d,k)}for(let l=0;l<3;l++){const d=v+l*2;e.push(d,d+1,d+2,d+1,d+3,d+2)}});const h=new c.InstancedBufferGeometry;return h.setAttribute("position",new c.Float32BufferAttribute(a,3)),h.setAttribute("uv",new c.Float32BufferAttribute(r,2)),h.setIndex(e),h}function ht(a){return new c.ShaderMaterial({fog:!0,lights:!0,side:c.DoubleSide,uniforms:{...qe(),...Ne(),...a},vertexShader:`
      attribute vec3 aBase; attribute vec4 aCulm; attribute vec4 aSpray; attribute vec4 aTint;
      uniform vec4 uFlower, uBreak, uBreak2;
      varying vec2 vUv; varying vec3 vN, vV; varying vec4 vF; varying vec3 vBand;
      #include <fog_pars_vertex>
      ${Be}
      ${ct}
      void main(){
        float kind = aSpray.w, y = position.y, L = aSpray.z;
        vec3 T, wg;
        vec3 c = bsCulm(aBase, aCulm, aSpray.x*aCulm.x, T, wg);
        vec3 outw = vec3(cos(aSpray.y), 0.0, sin(aSpray.y));
        vec3 ref = vec3(-outw.z, 0.0, outw.x);
        vec3 d0 = normalize(mix(outw*0.85 + T*0.55, T, kind));
        vec3 nrm0 = normalize(cross(ref, d0));
        vec3 side = cross(d0, nrm0);
        float gs = clamp(wg.x + 0.45*wg.y, 0.0, 1.2)*uWind.z*(1.0 - 0.8*wg.z);
        vec3 pt = bsPart(aBase.xz, 1.0);
        float yy = y*sqrt(y);
        vec3 off = d0*y + (side*position.x + nrm0*position.z)*(0.44 + 0.1*kind);
        off += (outw*aTint.y - vec3(0.0, aTint.x, 0.0))*y*y;                              // nod and droop
        off += vec3(uWind.x, -0.12, uWind.y)*(gs*0.62/(1.0 + 0.7*gs)*yy) + vec3(pt.x, 0.1, pt.y)*(pt.z*0.6*yy);   // streaming (capped: a spray keeps its arch in the hardest gust)
        float fl = sin(uTime*(7.0 + aTint.z*5.0) + aTint.z*40.0 + y*5.0)*(0.015 + 0.07*gs + 0.09*pt.z)*y;
        off += nrm0*fl + side*(fl*0.6);
        vec3 p = c + off*L;
        vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
        vec3 nw = normalize(nrm0*0.35*sign(nrm0.y + 1e-4) + vec3(0.0, 0.8, 0.0) + d0*0.3 + outw*(0.55*(1.0 - kind)*uBand.w));   // (seen from above, on the crest: a crown is lit on the side its sprays turn to the sun)
        vN = normalize(normalMatrix*nw); vV = mvPosition.xyz;
        vUv = mix(vec2(uv.x*0.48 + 0.01, uv.y*0.98 + 0.01), vec2(0.51 + uv.x*0.48, 0.26 + uv.y*0.73), kind);
        float below = clamp(((modelMatrix*vec4(p, 1.0)).y - cameraPosition.y)/6.0, 0.0, 1.0);
        float flo = uFlower.w*(1.0 - smoothstep(uFlower.z*0.6, uFlower.z, length(aBase.xz - uFlower.xy)))*step(aTint.z, 0.86);
        vF = vec4(clamp(gs + pt.z*0.8, 0.0, 1.0), below, aTint.w, min(aTint.z, 0.999) + 2.0*step(0.25 + 0.5*fract(aTint.z*7.0), flo));   // w: a number per plume, +2 where it has flowered
        // (the same band the world lays over its crown sheet and tufts: see SEA_BAND there)
        vBand = vec3(uBand.w*bsBandK(bsBandQ(aBase.xz, length(mvPosition.xyz), uBand.xy, uBand.z)), max(uBreak.w*(1.0 - smoothstep(uBreak.z*0.5, uBreak.z, length(aBase.xz - uBreak.xy))), uBreak2.w*(1.0 - smoothstep(uBreak2.z*0.5, uBreak2.z, length(aBase.xz - uBreak2.xy)))), uBand.w);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D uAtlas;
      uniform vec3 uJade, uLime, uDeep, uCeladon, uWhite, uGold;
      uniform float uSnow, uYellow, uBreakSun; uniform vec2 uFill;
      varying vec2 vUv; varying vec3 vN, vV; varying vec4 vF; varying vec3 vBand;
      #include <fog_pars_fragment>
      ${Ve}
      vec3 bsBandHue(vec3 cel){ vec3 h = cel*vec3(0.9, 1.08, 0.9); return h/max(dot(h, vec3(0.3, 0.55, 0.15)), 0.05); }
      void main(){
        vec4 tx = texture2D(uAtlas, vUv, -0.8);
        float dist = length(vV);
        float rnd = fract(vF.w), flw = step(1.5, vF.w);
        float clump = bsNoise(vUv*vec2(26.0, 52.0) + rnd*50.0)*0.6 + bsNoise(vUv*vec2(60.0, 120.0))*0.4;   // leaf clumps fixed to the card: far sprays stay feathery
        // seen from under the canopy (vF.y): a spray is bunches of leaves with sky between them, not a stippled card;
        // thin where the blurred cut-out is thin (its edges and tips), and there the sky's light comes through the leaf
        float under = vF.y;
        clump = mix(clump, bsNoise(vUv*vec2(7.0, 15.0) + rnd*50.0)*0.62 + bsNoise(vUv*vec2(17.0, 36.0) + 3.0)*0.38, under);
        float thin = 1.0 - smoothstep(0.28, 0.8, texture2D(uAtlas, vUv, 2.6).a);
        if (tx.a < mix(0.4, 0.16 + 0.42*clump, smoothstep(18.0, 70.0, dist))) discard;
        float lum = max(tx.r/max(tx.a, 0.3), 0.35)*mix(1.0, 0.6 + 0.8*clump, smoothstep(18.0, 70.0, dist));
        float shade = vF.z;                                    // 1 at the crown top, lower inside the crown
        vec3 alb = mix(uDeep*1.1, mix(uJade, uLime, 0.12 + 0.3*shade*rnd), 0.25 + 0.75*shade)*(0.5 + 0.55*lum)*(0.8 + 0.4*fract(rnd*7.31));
        alb = mix(alb, vec3(0.74, 0.66, 0.20)*(0.7 + 0.5*lum), uYellow*step(0.7, rnd)*0.85);
        alb = mix(alb, mix(vec3(0.44, 0.33, 0.09), vec3(0.86, 0.64, 0.17), shade)*(0.45 + 0.6*lum)*(0.8 + 0.4*fract(rnd*7.31)), flw);       // the flowered slope: crowns gone straw-gold
        float tipK = smoothstep(0.4, 0.9, vUv.y)*(0.25 + 0.75*shade);
        alb = mix(alb, uCeladon*(0.76 + 0.3*lum), min(max(vF.x*(1.0 - 0.75*vBand.z)*(0.5 + 0.5*clump)*tipK, vF.y*0.22), 0.55));     // pale undersides on the wave face: the outer, upper leaves only (above the crowns only a little: there the swell band is the pale thing)
        alb = mix(alb, mix(uJade, uLime, 0.72)*(0.62 + 0.5*lum), 0.42*vBand.z*shade*smoothstep(0.3, 0.9, vUv.y)*(1.0 - flw)*(1.0 - 0.8*uSnow));   // above the crown sea the top sprays stand in the open: lime
        alb *= 0.5 + 0.6*vUv.y;                                                              // darker toward the stem, inside the crown
        float sn = uSnow*smoothstep(0.6, 0.97, shade)*smoothstep(0.45, 0.65, clump*0.55 + lum*0.45)*(1.0 - 0.6*vF.x)*smoothstep(0.3, 0.46, rnd);   // a third of the sprays have shed their load
        alb = mix(alb*mix(vec3(1.0), vec3(0.4, 0.66, 0.74), uSnow), uWhite*0.8, sn);
        vec3 N = normalize(vN), V = normalize(-vV), L = bsSunDir();
        float shut = max(0.15, uFill.x + 0.06);
        float open = mix(shut + (1.0 - shut)*smoothstep(0.05, 0.7, vF.x), 1.0, smoothstep(0.35, 0.8, shade));
        vec3 sun = bsSunCol()*mix(open, 1.0, vBand.y)*(1.0 + uBreakSun*vBand.y);            // (vBand.y: under the break in the cloud the sun is whole)
        float ndl = dot(N, L)*0.5 + 0.5;
        float tr = max(dot(V, -L), 0.0); tr = tr*tr*tr;                                   // light through the leaf
        vec3 col = alb*(bsAmb(N)*(0.35 + 0.65*shade) + sun*ndl*ndl*0.9)*mix(1.0, 0.5 + 0.7*thin, under) + uLime*sun*(tr*0.5*lum + vF.y*0.12*lum*(0.2 + 1.6*thin))*(1.0 - 0.8*flw);
        col += mix(uJade, uLime, 0.45 + 0.5*thin)*bsAmb(vec3(0.0, 1.0, 0.0))*(under*thin*(0.35 + 0.65*shade)*(0.5 + 0.6*lum)*(1.0 - 0.8*flw)*(1.0 - 0.7*uSnow));   // back-lit edges
        // in the swell band the leaves are turned over: pale celadon against whatever is round them (lit by the whole sky)
        vec3 lightAll = bsSunCol()*0.405 + bsAmb(vec3(0.0, 1.0, 0.0))*1.5;
        float bandL = clamp(dot(lightAll, vec3(0.3, 0.55, 0.15))*0.3, 0.12, 0.5)*(0.74 + 0.3*shade);
        vec3 bandC = bsBandHue(uCeladon)*min(max(bandL, 1.05*dot(col, vec3(0.3, 0.55, 0.15))), 0.56);
        // only the outer tips of a crown turn (its stems and body stay green), far off as close by: no crown is veiled whole
        col = mix(col, bandC, vBand.x*(0.08 + 0.66*tipK)*(1.0 - 0.5*flw));
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function Ke(a,r,e,s,h,p={}){const m=vt(),b=[],f=[],v=[],l=[];let d=0;const w=p.arch??1;if(p.low){for(const o of a)if(!(o.age>1.05||!o.near))for(let L=0;L<p.low;L++)b.push(o.x,o.y,o.z),f.push(o.h,o.stiff,o.leanAz,o.lean),v.push(r.range(.42,.66),r.range(0,6.2832),r.range(4.6,6.4)*(o.plume??o.h/24),0),l.push(r.range(.4,.8),r.range(.05,.25),r(),r.range(.3,.55)),d++}if(!p.low)for(const o of a){if(o.age>1.05)continue;const L=o.near?s:h,D=r.range(0,Math.PI*2);for(let j=p.from??0;j<L;j++){const S=j===0,F=S?0:j/L,G=S?.985:1-.07-(o.span??.45)*F*r.range(.85,1.1),W=S?r.range(4.6,6):r.range(3.6,4.8)*(1-.25*F),N=S?o.leanAz+r.range(-.5,.5):D+j*2.4+r.range(-.3,.3);b.push(o.x,o.y,o.z),f.push(o.h,o.stiff,o.leanAz,o.lean),v.push(G,N,W*(o.plume??o.h/24)*(o.near?1:1.28),S?1:0),l.push(S?r.range(.35,.6):r.range(.18,.4)*w,S?r.range(.25,.5):r.range(0,.15)+.1*(w-1),r(),(S?1:1-.75*F)*r.range(.85,1)),d++}}ge(m,"aBase",b,3),ge(m,"aCulm",f,4),ge(m,"aSpray",v,4),ge(m,"aTint",l,4),m.instanceCount=d;const k=new c.Mesh(m,e);return k.frustumCulled=!1,k.userData.count=d,k}function mt(a,r,e,s){const p=r*2+4,m=new c.PlaneGeometry(p,p,44,44);m.rotateX(-Math.PI/2);const b=m.attributes.position;for(let l=0;l<b.count;l++){const d=b.getX(l),w=b.getZ(l);b.setY(l,e(d,w)+17.8+1.6*s.fbm2(d*.06,w*.06,3))}const f=new c.ShaderMaterial({fog:!0,lights:!0,side:c.DoubleSide,uniforms:{...qe(),...Ne(),...a,uStandR:{value:r}},vertexShader:`
      varying vec3 vP, vV; varying vec3 vG;
      #include <fog_pars_vertex>
      ${Be}
      void main(){
        vec2 g = bsGust(position.xz, uTime - 0.4);
        vec3 pt = bsPart(position.xz, 1.0);
        vec3 p = position;
        p.y -= 2.3*g.x*uWind.z + 0.5*g.y*uWind.z + 3.0*pt.z;
        p.xz += uWind.xy*(g.x*2.5*uWind.z) + pt.xy*(pt.z*5.0);
        vP = position; vG = vec3(g, pt.z);
        vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
        vV = mvPosition.xyz;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uJade, uLime, uDeep, uCeladon;
      uniform float uStandR; uniform vec4 uWind; uniform sampler2D uAtlas;
      varying vec3 vP, vV; varying vec3 vG;
      #include <fog_pars_fragment>
      ${Ve}
      void main(){
        vec2 q = vP.xz - uWind.xy*(vG.x*1.5);
        float f = bsNoise(q*0.33)*0.42 + bsNoise(q*0.9 + 7.0)*0.28 + bsNoise(q*2.6)*0.17 + bsNoise(q*7.0)*0.13;
        float edge = smoothstep(uStandR - 12.0, uStandR - 1.0, length(vP.xz));
        float thr = 0.34 + 0.16*vG.x + 1.3*vG.z + edge*0.7;
        if (f < thr) discard;
        // lace of real lance leaves: two rotated tilings of the spray atlas (explicit gradients: no seam lines)
        vec2 ua = q*vec2(0.42, 0.21);
        vec2 ub = vec2(q.x*0.8 - q.y*0.6, q.x*0.6 + q.y*0.8)*vec2(0.36, 0.18) + vec2(0.37, 0.61);
        vec2 sc = vec2(0.48, 0.98);
        vec4 ta = textureGrad(uAtlas, fract(ua)*sc + 0.01, dFdx(ua)*sc, dFdy(ua)*sc);
        vec4 tb = textureGrad(uAtlas, fract(ub)*sc + 0.01, dFdx(ub)*sc, dFdy(ub)*sc);
        float la = max(ta.a, tb.a), lum = max(ta.r, tb.r);
        if (la < mix(0.34, 0.12, smoothstep(25.0, 90.0, length(vV)))) discard;
        float body = smoothstep(thr, thr + 0.2, f);
        vec3 sun = bsSunCol();
        vec3 up = bsAmb(vec3(0.0, 1.0, 0.0));
        vec3 col;
        if (gl_FrontFacing) {                                   // seen from above: shadowed leaf mass between plumes
          float lf = bsNoise(q*3.1 + 5.0)*0.6 + bsNoise(q*9.0)*0.4;
          vec3 alb = mix(uDeep, uJade, 0.45 + 0.4*body*lf)*(0.7 + 0.5*lf)*(0.6 + 0.5*lum);
          alb = mix(alb, uCeladon*0.8, vG.x*0.4*lf);
          col = alb*(up*0.7 + sun*0.3*body*lf);
        } else {                                                // from below: translucent ceiling, lime where the sun is on it
          float lit = bsNoise(q*0.21 + 3.0);
          col = mix(uDeep*0.6, uJade*0.8, body)*(0.5 + 0.6*lum)*up*0.7 + uLime*sun*(0.10 + 0.25*lit*lit)*(0.3 + 0.7*lum)*(0.5 + vG.x);
        }
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),v=new c.Mesh(m,f);return v.frustumCulled=!1,v}function pt(a,r,e,s,h){const p=new Float32Array(r*12),m=new Float32Array(r*9),b=new Float32Array(r*9),f=[[-.2,-.5],[.2,-.5],[0,.9]];for(let w=0;w<r;w++){const k=e(),o=e(),L=e(),D=(w/r<h?-1:1)*(.05+.95*e()),j=e();for(let S=0;S<3;S++){const F=w*12+S*4,G=w*9+S*3;p[F]=k,p[F+1]=o,p[F+2]=L,p[F+3]=D,m[G]=f[S][0],m[G+1]=f[S][1],m[G+2]=j}}const v=new c.BufferGeometry;v.setAttribute("position",new c.BufferAttribute(b,3)),v.setAttribute("aSeed",new c.BufferAttribute(p,4)),v.setAttribute("aCorner",new c.BufferAttribute(m,3));const l=new c.ShaderMaterial({fog:!0,lights:!0,side:c.DoubleSide,uniforms:{...qe(),...Ne(),...a,uBox:{value:new c.Vector3(s*2+16,46,s*2+16)},uLeafC:{value:new c.Vector3(0,24,0)}},vertexShader:`
      attribute vec4 aSeed; attribute vec3 aCorner;
      uniform vec3 uBox; uniform float uPx; uniform vec3 uGully; uniform vec3 uLeafC;
      varying vec3 vC; varying float vL;
      #include <fog_pars_vertex>
      ${Be}
      void main(){
        float rnd = aCorner.z, sd = abs(aSeed.w);
        vec3 p; float vis; vec3 drift;
        if (aSeed.w > 0.0) {                                    // ambient: a treadmill box blown along the wind
          vec3 p0 = aSeed.xyz*uBox;
          float sp = 15.0 + 11.0*rnd;
          p.xz = mod(p0.xz + uWind.xy*(sp*uTime) - uLeafC.xz, uBox.xz) - 0.5*uBox.xz + uLeafC.xz;
          p.y = mod(p0.y - (1.2 + 1.5*sd)*uTime + 2.0*sin(uTime*0.8 + sd*30.0) - uLeafC.y, uBox.y) - 0.5*uBox.y + uLeafC.y;
          vec3 ed = abs(p - uLeafC)/uBox;
          float edge = 1.0 - smoothstep(0.40, 0.49, max(ed.x, max(ed.y, ed.z)));
          vec2 g = bsGust(p.xz, uTime);
          float gg = max(g.x, 0.5*g.y)*uWind.z;
          p.xz += uWind.xy*(gg*5.0);
          p.y += gg*2.0*sin(sd*50.0 + uTime*2.0);
          vis = (0.12 + 0.88*smoothstep(0.08, 0.55, gg)*step(sd, 0.2 + 0.8*gg))*edge;
          drift = vec3(uWind.x, 0.0, uWind.y);
        } else {                                                // the leaf wall of the parting
          float a = uPart.x + 4.0 - aSeed.z*aSeed.z*30.0;
          float z = uPart.z - a;
          float t = clamp(a/uPart.w, 0.0, 1.6);
          float spread = 5.0 + 9.0*t;
          p.x = bsLaneX(z) + (aSeed.x - 0.5)*2.0*spread + sin(uTime*3.0 + sd*40.0)*0.8;
          p.z = z;
          p.y = uGully.x + uGully.y*max(a, 0.0) + 0.6 + aSeed.y*(9.0 + 22.0*t) + smoothstep(0.7, 1.5, t)*aSeed.y*16.0
                + 1.2*sin(uTime*2.3 + sd*60.0);
          vis = smoothstep(0.0, 5.0, uPart.x)*(1.0 - smoothstep(uPart.w + 20.0, uPart.w + 55.0, a))*smoothstep(-34.0, -18.0, a)*1.25;
          drift = vec3(0.0, 0.25, -1.0);
        }
        float ang = uTime*(5.0 + 9.0*rnd) + sd*60.0;
        vec3 e1 = normalize(drift*1.2 + vec3(cos(ang), 0.5*sin(ang*1.3), sin(ang))*0.8 + vec3(0.0, 0.01, 0.0));
        vec3 e2 = normalize(cross(e1, vec3(sin(ang*0.7), 0.9, cos(ang*0.7))) + vec3(0.0, 0.0, 1e-3));
        vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
        float dist = length(mvPosition.xyz);
        float size = max(0.2 + 0.12*rnd, 1.7*uPx*min(dist, 90.0))*vis*smoothstep(1.5, 5.5, dist);
        vec3 o = (e1*aCorner.y + e2*aCorner.x)*size;
        mvPosition = modelViewMatrix*vec4(p + o, 1.0);
        vC = vec3(rnd, sd, e2.y);
        vL = vis;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uJade, uLime, uCeladon, uGold, uWhite;
      uniform float uYellow, uSnow;
      varying vec3 vC; varying float vL;
      #include <fog_pars_fragment>
      ${Ve}
      void main(){
        if (vL < 0.02) discard;
        vec3 alb = mix(mix(uJade, uLime, vC.x), uCeladon, step(0.72, vC.y)*0.8);
        alb = mix(alb, vec3(0.62, 0.55, 0.30), step(vC.x, 0.14));
        alb = mix(alb, vec3(0.82, 0.70, 0.22), uYellow*step(0.45, fract(vC.y*7.0)));
        alb = mix(alb, uWhite, uSnow*step(0.4, fract(vC.y*5.0)));
        vec3 col = alb*(bsAmb(vec3(0.0, 1.0, 0.0))*0.8 + bsSunCol()*(0.35 + 0.4*abs(vC.z)));
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),d=new c.Mesh(v,l);return d.frustumCulled=!1,d}function Oe(a,r,e={}){const s=e.fronds??5,h=e.segs??2,p=[],m=[],b=[],f=[];for(let o=0;o<s;o++){const L=(o+.37*Math.sin(o*2.4))/s*Math.PI*2+.3,D=Math.cos(L),j=Math.sin(L),S=p.length/3,F=.82+.26*Math.abs(Math.sin(o*1.7+.6)),G=.75+.45*Math.abs(Math.sin(o*2.9+1.1));for(let W=0;W<=h;W++)for(let N=0;N<2;N++){const X=W/h,de=(N-.5)*.56*(1-.25*X),xe=X*F;p.push(D*xe-j*de,X,j*xe+D*de),m.push(.505+X*.485,.005+N*.235),b.push(G,o*1.3)}for(let W=0;W<h;W++){const N=S+W*2;f.push(N,N+1,N+2,N+1,N+3,N+2)}}const v=new c.InstancedBufferGeometry;v.setAttribute("position",new c.Float32BufferAttribute(p,3)),v.setAttribute("uv",new c.Float32BufferAttribute(m,2)),v.setAttribute("aFr",new c.Float32BufferAttribute(b,2)),v.setIndex(f);const l=[],d=[];for(const o of r)l.push(o.x,o.y,o.z),d.push(o.rot,o.size,o.seed,o.tone);ge(v,"aPos",l,3),ge(v,"aRot",d,4),v.instanceCount=r.length;const w=new c.ShaderMaterial({fog:!0,lights:!0,side:c.DoubleSide,uniforms:{...qe(),...Ne(),...a},vertexShader:`
      attribute vec3 aPos; attribute vec4 aRot; attribute vec2 aFr;
      varying vec2 vUv; varying vec4 vF; varying vec3 vV;
      #include <fog_pars_vertex>
      ${Be}
      void main(){
        float c = cos(aRot.x), s = sin(aRot.x), t = position.y;
        vec3 l = vec3(c*position.x - s*position.z, 0.0, s*position.x + c*position.z);
        vec2 g = bsGust(aPos.xz, uTime - 0.15);
        float gg = clamp(g.x + 0.6*g.y, 0.0, 1.0)*uWind.z;
        // the arch: up fast, over, and down a little at the tip; gusts press it flat and run a shiver along it
        float arch = (2.3*t - 1.75*t*t)*aFr.x*(0.78 - 0.42*gg);
        float lift = arch + 0.05*t*sin(uTime*(5.0 + aRot.z*3.0) + aRot.z*30.0 + aFr.y)*(0.3 + gg);
        vec3 p = aPos + (l*(1.0 - 0.12*t*aFr.x) + vec3(0.0, lift, 0.0))*aRot.y;
        p.xz += uWind.xy*(gg*0.45*t*aRot.y);
        vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
        float gl = bsGlade(aPos.xz);
        vUv = uv; vF = vec4(max(max(g.x, bsPartLit(aPos.xz)), gl*0.9), aRot.w, t, gl); vV = mvPosition.xyz;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D uAtlas; uniform vec3 uJade, uLime, uDeep, uCeladon, uWhite; uniform vec2 uFill; uniform float uSnow;
      varying vec2 vUv; varying vec4 vF; varying vec3 vV;
      #include <fog_pars_fragment>
      ${Ve}
      void main(){
        vec4 tx = texture2D(uAtlas, vUv);
        float dist = length(vV);
        if (tx.a < mix(0.35, 0.2, smoothstep(14.0, 50.0, dist))) discard;
        // dim jade, darker at the crown and along the edges of each frond, a paler midrib
        vec3 alb = mix(uDeep*1.25, mix(uJade, uLime, 0.2), 0.3 + 0.6*vF.y)*(0.55 + 0.6*tx.r)*(0.5 + 0.62*vF.z);
        alb = mix(alb, uCeladon*0.7, vF.x*0.16*(1.0 - vF.w));
        alb = mix(alb, uWhite*0.75, uSnow*smoothstep(0.45, 0.9, vF.z)*0.5);
        float open = max(uFill.x + (1.0 - uFill.x)*smoothstep(0.05, 0.75, vF.x)*0.5, vF.w);   // a gust or the opened V lets in half the light; only a shaft's pool is fully lit
        vec3 upA = bsAmb(vec3(0.0, 1.0, 0.0))*uFill.y;
        // the trunk-space fill, and a little of it passed through the frond itself (brighter toward the tips): dim jade over teal, never black
        vec3 col = alb*(upA*1.35 + bsSunCol()*mix(vec3(1.0), uLime*1.9, 0.6)*open*(0.62 + 0.9*vF.w*vF.z)) + mix(uDeep, uJade, 0.3)*upA*(0.08 + 0.2*vF.z)*(0.6 + 0.5*tx.r);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),k=new c.Mesh(v,w);return k.frustumCulled=!1,k}function Ze(a,r,e){const s=new c.InstancedBufferGeometry;s.setAttribute("position",new c.Float32BufferAttribute([-1,0,-1,1,0,-1,-1,0,1,1,0,1],3)),s.setIndex([0,2,1,1,2,3]);const h=[],p=[];for(const f of r){const v=e(f.x,f.z);h.push(f.x,v+.07,f.z,.75+f.r*7+.5*f.seed),p.push((e(f.x+.6,f.z)-e(f.x-.6,f.z))/1.2,(e(f.x,f.z+.6)-e(f.x,f.z-.6))/1.2)}ge(s,"aFoot",h,4),ge(s,"aSl",p,2),s.instanceCount=r.length;const m=new c.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{...Ne(),uDeep:a.uDeep},vertexShader:`
      attribute vec4 aFoot; attribute vec2 aSl;
      varying vec2 vQ;
      #include <fog_pars_vertex>
      void main(){
        vQ = position.xz;
        vec2 o = position.xz*aFoot.w;
        vec4 mvPosition = modelViewMatrix*vec4(aFoot.x + o.x, aFoot.y + dot(aSl, o), aFoot.z + o.y, 1.0);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uDeep;
      varying vec2 vQ;
      #include <fog_pars_fragment>
      void main(){
        float d = length(vQ);
        float a = (1.0 - smoothstep(0.08, 1.0, d));
        gl_FragColor = vec4(uDeep*0.1, a*a*0.66);
        #include <fog_fragment>
      }`}),b=new c.Mesh(s,m);return b.frustumCulled=!1,b.renderOrder=1,b}function Ye(a,r){const e=r.length,s=new Float32Array(e*12),h=new Float32Array(e*16),p=new Float32Array(e*16),m=new Float32Array(e*12),b=[];for(let d=0;d<e;d++){const w=r[d],k=w.dir||[0,0,0],o=Math.round(Ue(w.seed??d*.6180339+.37)*64)/64;for(let D=0;D<4;D++)s.set([w.x,w.y,w.z],d*12+D*3),h.set([D&1?1:-1,D>>1,w.w,w.len],d*16+D*4),p.set([w.gain??1,o,w.hit??.78,w.rays??3],d*16+D*4),m.set(k,d*12+D*3);const L=d*4;b.push(L,L+1,L+2,L+1,L+3,L+2)}const f=new c.BufferGeometry;f.setAttribute("position",new c.BufferAttribute(s,3)),f.setAttribute("aShaft",new c.BufferAttribute(h,4)),f.setAttribute("aRay",new c.BufferAttribute(p,4)),f.setAttribute("aDir",new c.BufferAttribute(m,3)),f.setIndex(b);const v=new c.ShaderMaterial({fog:!1,lights:!0,transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,side:c.DoubleSide,uniforms:{...qe(),...a},vertexShader:`
      attribute vec4 aShaft, aRay; attribute vec3 aDir;
      varying vec3 vA, vC; varying vec4 vR;
      ${Be}
      #include <common>
      #include <lights_pars_begin>
      void main(){
        #if NUM_DIR_LIGHTS > 0
          vec3 L = directionalLights[0].direction;
        #else
          vec3 L = vec3(0.0, 1.0, 0.0);
        #endif
        if (dot(aDir, aDir) > 0.5) L = normalize(mat3(viewMatrix)*aDir);      // a ray of its own (a few degrees off the sun's: gaps fan the light)
        vec2 g = bsGust(position.xz, uTime - 0.55);
        vec3 pt = bsPart(position.xz, 1.0);
        vec4 mv = modelViewMatrix*vec4(position, 1.0);
        vec3 c = mv.xyz - L*(aShaft.y*aShaft.w);
        vec3 sd = cross(L, c/max(length(c), 1e-3));
        sd = sd/max(length(sd), 1e-3);
        c += sd*(aShaft.x*abs(aShaft.z)*(1.0 + 0.4*aShaft.y));
        float stand = step(aShaft.z, 0.0);
        vA = vec3(aShaft.x, aShaft.y, aRay.x*max(clamp(g.x*1.15 + pt.z, 0.0, 1.2), stand*(1.55 + 0.6*g.x)));
        vC = c;
        vR = vec4(g.x, aRay.y, aRay.z, aRay.w);
        gl_Position = projectionMatrix*vec4(c, 1.0);
      }`,fragmentShader:`
      uniform vec3 uLime, uShaftCol; uniform float uSunGain, uTime;
      varying vec3 vA, vC; varying vec4 vR;
      float shH(float n){ return fract(sin(n*12.9898 + 4.1)*43758.5453); }
      void main(){
        // the seed and the ray count are the same at a sheet's four corners, but an interpolated value can still differ in
        // its last bit from pixel to pixel, and the hash would turn that into a stipple: round them first
        float x = vA.x, y = vA.y, seed = floor(vR.y*64.0 + 0.5)/64.0, hit = vR.z, nr = max(floor(vR.w + 0.5), 1.0);
        float env = 1.0 - x*x; env *= env;
        float rays = 0.0;
        for (int i = 0; i < 5; i++) {
          float fi = float(i);
          float h1 = shH(seed*37.0 + fi*1.7), h2 = shH(seed*91.0 + fi*5.3), h3 = shH(seed*53.0 + fi*9.1);
          float c = ((fi + 0.22 + 0.56*h1)/nr)*1.76 - 0.88;                        // the rays stand apart across the sheet, dark between
          float w = mix(0.055, 0.17, h2)*(3.3/(nr + 0.6));                         // and no two are the same width
          float dx = (x - c)/w;
          float top = smoothstep(0.26*h3, 0.26*h3 + 0.18, y);                      // every ray starts at its own gap
          float breathe = 0.8 + 0.2*sin(uTime*(0.45 + 0.6*h1) + h2*20.0) + 0.3*vR.x;
          rays += step(fi + 0.5, nr)*exp(-dx*dx)*(0.62 + 0.38*h3)*top*breathe;
        }
        float dust = 0.93 + 0.07*sin(x*7.0 + seed*40.0 + 1.6*sin(uTime*0.5 + seed*9.0) + y*2.0);
        // the beam thins as it comes down into the ferns (it ends in the lit pool on the floor, not in a hard edge)
        float v = smoothstep(0.0, 0.1, y)*(1.0 - 0.7*smoothstep(hit - 0.24, hit + 0.04, y))*(1.0 - smoothstep(hit + 0.02, min(hit + 0.26, 1.0), y));
        float nearK = smoothstep(3.0, 17.0, length(vC));                             // a sheet that passes the lens fades out there: no wash across the frame
        gl_FragColor = vec4(uShaftCol*(sqrt(env)*min(rays, 1.25)*dust*v*vA.z*nearK*0.15*uSunGain), 1.0);
      }`}),l=new c.Mesh(f,v);return l.frustumCulled=!1,l.renderOrder=3,l}function gt(a,r){const e=r.length,s=new Float32Array(e*12),h=new Float32Array(e*16),p=new Float32Array(e*4),m=[];for(let l=0;l<e;l++){const d=r[l],w=d.seed??Ue(l*.6180339+.23);for(let o=0;o<4;o++)s.set([d.x,d.y,d.z],l*12+o*3),h.set([o&1?1:-1,o>>1?1:-1,d.r,d.gain??1],l*16+o*4),p[l*4+o]=w;const k=l*4;m.push(k,k+1,k+2,k+1,k+3,k+2)}const b=new c.BufferGeometry;b.setAttribute("position",new c.BufferAttribute(s,3)),b.setAttribute("aH",new c.BufferAttribute(h,4)),b.setAttribute("aS",new c.BufferAttribute(p,1)),b.setIndex(m);const f=new c.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,side:c.DoubleSide,uniforms:{...Ne(),...a},vertexShader:`
      attribute vec4 aH; attribute float aS;
      varying vec3 vH; varying vec2 vD;
      ${Be}
      void main(){
        vec2 g = bsGust(position.xz, uTime - 0.5);
        vec4 mv = modelViewMatrix*vec4(position, 1.0);
        float d = length(mv.xyz);
        mv.xy += aH.xy*vec2(1.0, 0.62)*(aH.z*(1.0 + 0.1*sin(uTime*0.4 + aS*20.0)));
        vH = vec3(aH.xy, aH.w*(0.7 + 0.55*g.x)*smoothstep(5.0, 20.0, d));
        vD = vec2(d, aS);
        gl_Position = projectionMatrix*mv;
      }`,fragmentShader:`
      uniform vec3 uShaftCol; uniform float uSunGain, uTime;
      varying vec3 vH; varying vec2 vD;
      #include <fog_pars_fragment>
      float hlH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
      float hlN(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
        return mix(mix(hlH(i), hlH(i + vec2(1.0, 0.0)), f.x), mix(hlH(i + vec2(0.0, 1.0)), hlH(i + vec2(1.0, 1.0)), f.x), f.y); }
      void main(){
        float f = max(1.0 - dot(vH.xy, vH.xy), 0.0); f = f*f;
        float n = hlN(vH.xy*1.5 + vec2(vD.y*17.0 + uTime*0.07, vD.y*5.0 - uTime*0.04))*0.6 + hlN(vH.xy*3.6 + vec2(vD.y*3.0 - uTime*0.11, vD.y*9.0))*0.4;
        float fogK = 1.0;
        #ifdef FOG_EXP2
          fogK = exp(-fogDensity*fogDensity*vD.x*vD.x);
        #endif
        gl_FragColor = vec4(uShaftCol*(f*(0.3 + 0.95*n)*vH.z*0.15*uSunGain*fogK), 1.0);
      }`}),v=new c.Mesh(b,f);return v.frustumCulled=!1,v.renderOrder=3,v}function xt(a,r,e,s,h,p){const m=[],b=[],f=[],d=r+6;m.push(0,e(0,0),0),b.push(0);for(let S=1;S<=26;S++)for(let F=0;F<72;F++){const G=d*Math.pow(S/26,.85),W=(F+S%2*.5)/72*Math.PI*2,N=Math.cos(W)*G,X=Math.sin(W)*G;m.push(N,e(N,X),X),b.push(0)}for(let S=0;S<72;S++)f.push(0,1+(S+1)%72,1+S);for(let S=1;S<26;S++)for(let F=0;F<72;F++){const G=1+(S-1)*72+F,W=1+(S-1)*72+(F+1)%72,N=G+72,X=W+72;f.push(G,W,N,W,X,N)}const w=new c.IcosahedronGeometry(1,2),k=w.attributes.position,o=9;for(let S=0;S<o;S++){const F=h.range(-r*.6,r*.75),G=h.sign(),W=h.range(5.5,16),N=p(F)+G*W,X=h.range(1.2,3.2),de=h.range(.7,1.6),xe=h.range(1.2,3),Fe=e(N,F)+de*.25,ve=h.range(0,6.28),ze=m.length/3,C=new Map;for(let Y=0;Y<k.count;Y++){const Ce=k.getX(Y).toFixed(3)+","+k.getY(Y).toFixed(3)+","+k.getZ(Y).toFixed(3);if(C.has(Ce)){f.push(C.get(Ce));continue}let re=k.getX(Y),Q=k.getY(Y),ce=k.getZ(Y);const Me=1+.32*s.fbm3(re*1.3+S*9,Q*1.3,ce*1.3,3);Q=Math.round(Q*3.2)/3.2*.6+Q*.4,re*=Me*X,Q*=Me*de,ce*=Me*xe;const Se=re*Math.cos(ve)-ce*Math.sin(ve),ee=re*Math.sin(ve)+ce*Math.cos(ve),ie=m.length/3;m.push(N+Se,Fe+Q,F+ee),b.push(1),C.set(Ce,ie),f.push(ie)}}w.dispose();const L=new c.BufferGeometry;L.setAttribute("position",new c.Float32BufferAttribute(m,3)),L.setAttribute("aRock",new c.Float32BufferAttribute(b,1)),L.setIndex(f),L.computeVertexNormals();const D=Qe(a,r),j=new c.Mesh(L,D);return j.frustumCulled=!1,j}function Qe(a,r){return new c.ShaderMaterial({fog:!0,lights:!0,uniforms:{...qe(),...Ne(),...a,uStandR:{value:r}},vertexShader:`
      attribute float aRock;
      varying vec3 vP, vN, vNo, vV; varying float vRock; varying vec2 vG;
      #include <fog_pars_vertex>
      ${Be}
      void main(){
        vP = position; vNo = normal; vN = normalize(normalMatrix*normal); vRock = aRock;
        vG = bsGust(position.xz, uTime - 0.6) + vec2(bsPart(position.xz, 1.0).z, 0.0);
        vec4 mvPosition = modelViewMatrix*vec4(position, 1.0);
        vV = mvPosition.xyz;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uJade, uLime, uDeep;
      uniform float uStandR; uniform vec2 uFill;
      varying vec3 vP, vN, vNo, vV; varying float vRock; varying vec2 vG;
      #include <fog_pars_fragment>
      ${Ve}
      ${Be}
      // one fallen lance leaf in each cell of p: x coverage, y a tone for it (aa: half a pixel in cell units)
      vec2 bsLeaf(vec2 p, float aa){
        vec2 i = floor(p), f = fract(p) - 0.5;
        float h = bsHash(i + 3.7), h2 = bsHash(i*1.31 + 17.0);
        f -= (vec2(h, h2) - 0.5)*0.3;
        float a = h*18.85, c = cos(a), s = sin(a);
        vec2 r = vec2(c*f.x + s*f.y, c*f.y - s*f.x);
        float x = r.x/(0.3 + 0.1*h2);
        float w = 0.085*(1.0 - x*x);
        float cov = (1.0 - smoothstep(w - aa, w + aa, abs(r.y)))*step(abs(x), 1.0)*step(0.22, fract(h*7.3));
        return vec2(cov, h2);
      }
      // rounded stones in the cells of pc laid over the grit (base) (aaP: a pixel in cell units)
      vec3 bsPebbles(vec3 base, vec2 pc, float aaP){
        float keep = 1.0 - smoothstep(0.18, 0.5, aaP);
        vec2 ci = floor(pc), cf = fract(pc); float md = 9.0, id = 0.0;
        for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
          vec2 g = vec2(float(i), float(j)), o = vec2(bsHash(ci + g + 1.7), bsHash((ci + g)*1.31 + 9.0));
          float dd = length(g + 0.15 + 0.7*o - cf);
          if (dd < md) { md = dd; id = bsHash(ci + g + 5.3); }
        }
        float rad = 0.24 + 0.2*id, dome = sqrt(max(1.0 - md*md/(rad*rad), 0.0));
        float cov = (1.0 - smoothstep(rad - aaP - 0.02, rad, md))*step(0.25, fract(id*5.7))*keep;
        vec3 peb = mix(mix(vec3(0.15, 0.12, 0.10), vec3(0.40, 0.25, 0.18), fract(id*3.3)), vec3(0.36, 0.35, 0.31), step(0.7, fract(id*9.1)))*(0.45 + 0.75*dome);
        return mix(base*(1.0 - 0.35*keep*(1.0 - smoothstep(rad, rad + 0.12, md))), peb, cov);
      }
      void main(){
        vec2 q = vP.xz;
        float dist = length(vV);
        float n2 = bsNoise(q*1.7 + 11.0), n3 = bsNoise(q*7.0);
        vec2 qr = vec2(q.x*0.8 - q.y*0.6, q.x*0.6 + q.y*0.8);
        vec2 qt = vec2(q.x*0.6 + q.y*0.8, q.y*0.6 - q.x*0.8);
        float n4 = bsNoise(qr*5.3 + 3.0), n5 = bsNoise(qt*12.7 + 9.0);
        // straw leaf litter on dark soil: a matted layer, then single fallen leaves and sheath scraps at two sizes
        vec3 litter = mix(vec3(0.10, 0.078, 0.05), vec3(0.34, 0.28, 0.15), clamp(0.15 + 0.45*n2 + 0.25*n4 + 0.25*n5, 0.0, 1.0));
        vec2 pa = qr*4.6, pb = qt*2.3 + 5.5;
        float aaA = clamp(length(fwidth(pa))*0.6, 0.004, 0.5), aaB = clamp(length(fwidth(pb))*0.6, 0.004, 0.5);
        vec2 la = bsLeaf(pa, aaA), lb = bsLeaf(pb, aaB), lc = bsLeaf(pa*1.37 + 9.1, aaA*1.37);
        float fa = 1.0 - smoothstep(0.12, 0.42, aaA), fb = 1.0 - smoothstep(0.12, 0.42, aaB);
        vec3 leafA = mix(vec3(0.66, 0.57, 0.31), vec3(0.34, 0.22, 0.10), step(0.55, la.y));
        vec3 leafC = mix(vec3(0.58, 0.52, 0.26), vec3(0.42, 0.47, 0.17), step(0.8, lc.y));
        vec3 leafB = mix(vec3(0.52, 0.40, 0.22), vec3(0.24, 0.15, 0.08), step(0.5, lb.y));
        litter = mix(litter, leafB, lb.x*fb*0.9);
        litter = mix(litter, leafC, lc.x*fa*0.9);
        litter = mix(litter, leafA, la.x*fa);
        litter = mix(litter, vec3(0.30, 0.25, 0.135), (1.0 - fa)*0.35);                 // far off the leaves melt into straw
        // under the fern layer: the shade between the fronds, never lawn
        float cover = bsFernCover(q + (vec2(n4, n2) - 0.5)*0.9);
        float dxl = abs(q.x - bsLaneX(q.y));
        float bed = (1.0 - smoothstep(2.2, 3.8, dxl))*step(q.y, 152.0)*smoothstep(-52.0, -30.0, q.y);     // the stream line and the lane up the gully
        cover *= 1.0 - bed;
        vec3 under = mix(uDeep*1.05, mix(uJade, uLime, 0.15)*0.44, clamp(n3*0.55 + n5*0.45, 0.0, 1.0))*(0.75 + 0.5*n2);
        under = mix(under, mix(uDeep, uJade, 0.55)*0.5*(0.8 + 0.4*n4), smoothstep(30.0, 85.0, dist));         // far off it is the fern tops one sees
        vec3 wetBed = mix(vec3(0.07, 0.065, 0.05), vec3(0.20, 0.17, 0.12), n3*0.6 + 0.4*n5);
        // the washed bank: cobbles and pebbles bedded in dark grit, each its own tone, wet on top (two sizes; they melt
        // into the grit with distance). (The pixel footprints are taken here, outside any loop or branch.)
        vec2 pcA = qr*2.1 + 3.3, pcB = qt*5.2;
        float aaPA = clamp(length(fwidth(pcA)), 0.004, 1.0), aaPB = clamp(length(fwidth(pcB)), 0.004, 1.0);
        if (bed > 0.01) { wetBed = bsPebbles(wetBed, pcA, aaPA); wetBed = bsPebbles(wetBed, pcB, aaPB); }
        vec3 alb = mix(mix(litter, wetBed, bed*smoothstep(0.0, 6.0, q.y)), under, cover);
        float up = clamp(normalize(vNo).y, 0.0, 1.0);
        vec3 moss = mix(uDeep*0.9, mix(uJade, uLime, 0.3)*0.72, n3*0.6 + 0.4*n5)*(0.8 + 0.4*n4);
        vec3 stone = mix(vec3(0.36, 0.19, 0.13), vec3(0.55, 0.33, 0.22), bsNoise(vec2(vP.y*3.0 + n2*0.6, (q.x - q.y)*0.05)));
        stone *= (0.75 + 0.5*n3)*0.8;
        float wet = clamp(vRock - 1.0, 0.0, 1.0);                               // stones standing in the stream: dark, bare
        stone = mix(stone, vec3(0.19, 0.16, 0.14)*(0.6 + 0.6*n3), wet);
        vec3 rk = mix(stone, moss*mix(1.2, 0.8, wet), smoothstep(0.35, 0.7, up + 0.3*n2 - 0.1)*(1.0 - 0.35*wet));
        float steep = 1.0 - smoothstep(0.55, 0.8, up);
        alb = mix(alb, mix(stone, moss, 0.35*n2), steep*0.8);                   // bare rock, a little moss, where the bank is steep
        alb = mix(alb, rk, min(vRock, 1.0));
        vec2 dq = q - uWind.xy*uTime*3.0;
        float dap = smoothstep(0.35, 0.75, bsNoise(dq*0.16)*0.6 + bsNoise(dq*0.5)*0.4);
        float pool = bsGlade(q + (vec2(n2, n4) - 0.5)*1.4);
        float gst = max(vG.x, pool);
        float open = uFill.x*(0.45 + 1.1*dap) + 0.7*smoothstep(0.05, 0.7, gst)*(0.08 + 0.92*dap);        // dim dapple always, flood of light behind a front
        open = max(open, pool*pool*(0.55 + 0.45*dap));                                                    // a shaft's pool of light
        open = max(open, bsPartLit(q)*(0.3 + 0.3*dap));                                                   // the gully head under the opened V
        open = mix(open, 1.0, smoothstep(uStandR - 5.0, uStandR + 3.0, length(q)));       // open ground beyond the stand
        vec3 N = normalize(vN);
        vec3 sun = bsSunCol()*mix(vec3(1.0), uLime*1.9, 0.6)*open*(0.35 + 0.65*max(dot(N, bsSunDir()), 0.0))*mix(1.0, 0.35 + 0.4*up, min(vRock, 1.0));
        vec3 upA = bsAmb(vec3(0.0, 1.0, 0.0));
        vec3 col = alb*(bsAmb(N)*(1.15*uFill.y) + (uJade*0.8 + uLime*0.2)*upA*(0.5*uFill.y) + sun*mix(1.0, 0.75 + 0.95*pool, cover)) + uDeep*upA*(uFill.y*(0.16 + 0.2*cover));   // under the ferns only a shaft's pool glows: never lawn
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}const et=1.1,bt=`
  // warm 0..1: a coat sitting in a shaft: the shade side keeps its orange and the fill carries a little of the gold
  vec3 bsFurW(vec3 alb, vec3 N, vec3 V, vec3 L, vec3 upV, float fur, float lit, float amb, vec3 rimC, float furK, float warm){
    float nl = dot(N, L), key = smoothstep(-0.25, 0.7, nl);
    float skyUp = 0.5 + 0.5*dot(N, upV);
    float rim = 1.0 - clamp(dot(N, V), 0.0, 1.0); rim = rim*rim*rim;
    vec3 a = alb*mix(1.0, 0.5 + 0.9*fur, furK);
    vec3 shadeA = mix(a, vec3(dot(a, vec3(0.3, 0.55, 0.15)))*vec3(0.78, 0.95, 1.2), mix(0.5, 0.16, warm)*furK);
    vec3 sun = bsSunCol()*lit; sun = mix(sun, vec3(dot(sun, vec3(0.3, 0.55, 0.15))), 0.3);
    vec3 fill = bsAmb(N)*(0.38 + 0.62*skyUp*skyUp)*amb;
    fill = mix(fill, vec3(dot(fill, vec3(0.3, 0.55, 0.15)))*vec3(1.22, 1.0, 0.72), 0.6*warm*furK);
    vec3 col = mix(shadeA, a, key)*(fill*(0.62 + 0.3*warm) + sun*(key*0.95));
    col += rimC*(sun*(rim*smoothstep(-0.2, 0.45, nl)*0.5) + fill*(rim*0.3))*mix(1.0, 0.35 + 0.65*fur, furK);
    return col;
  }
  vec3 bsFur(vec3 alb, vec3 N, vec3 V, vec3 L, vec3 upV, float fur, float lit, float amb, vec3 rimC, float furK){
    return bsFurW(alb, N, V, L, upV, fur, lit, amb, rimC, furK, 0.0);
  }
`;function yt(a,r,e={}){const s=[],h=[],p=[],m=[],b=[],f=[];let v=2654435769^Math.imul(r.length*7919+Math.round((e.seed||0)*1e3),104729)|0;const l=()=>{v=v+1831565813|0;let i=Math.imul(v^v>>>15,1|v);return i=i+Math.imul(i^i>>>7,61|i)^i,((i^i>>>14)>>>0)/4294967296},d=e.rich??0,w=se(a),k=w.clone().lerp(se("#b0682a"),.5-.32*d),o=se("#33261e"),L=w.clone().lerp(se("#fff0cc"),.66-.3*d),D=w.clone().lerp(se("#ffd98a"),.6-.45*d),j=se("#b2ccf6"),S=se("#84a3d8"),F=se("#221a15"),G=w.clone().lerp(se("#fff4d0"),.75-.45*d),W=se("#0a0807"),N=se("#e3eaf3"),X=w.clone().lerp(o,.6),de=r==="sit",xe=r==="leap",Fe=r==="perch",ve=r==="head",ze=de||Fe||ve?{D:[-1,0,0],G:[-.3,-1,0],cap:[0,1,0]}:xe?{D:[0,1,0],G:[-1,-.12,0],cap:[0,1,0]}:{D:[0,0,1],G:[0,-1,.28],cap:[0,1,0]},C=(i,u)=>i[0]*u[0]+i[1]*u[1]+i[2]*u[2],Y=i=>{const u=Math.hypot(i[0],i[1],i[2])||1;return[i[0]/u,i[1]/u,i[2]/u]},Ce=(i,u)=>[i[1]*u[2]-i[2]*u[1],i[2]*u[0]-i[0]*u[2],i[0]*u[1]-i[1]*u[0]],re=(i,u,A,M,_=0)=>(s.push(i[0],i[1],i[2]),h.push(u[0],u[1],u[2]),p.push(A.r,A.g,A.b),m.push(M),b.push(_),s.length/3-1),Q=e.backK??1,ce=(i,u,A=k)=>{const M=C(i,ze.D);return L.clone().lerp(A,oe(-.8-.18*d,-.42*d,M)).lerp(o,oe(0,.55,M)*u*Q)},Me=e.fine??1,Se=(i,u,A,M,_,R,Ae,te,U)=>{M*=.55+.45*Me,_*=Me;const O=Y([u[0]*U+A[0],u[1]*U+A[1],u[2]*U+A[2]]);let T=Ce(O,u);Math.hypot(T[0],T[1],T[2])<.05&&(T=Ce(O,[.3,.2,.9])),T=Y(T);const J=[i[0]-u[0]*.012,i[1]-u[1]*.012,i[2]-u[2]*.012],q=_*.5,K=Y([u[0]+O[0]*.6,u[1]+O[1]*.6,u[2]+O[2]*.6]),he=re([J[0]-T[0]*q,J[1]-T[1]*q,J[2]-T[2]*q],u,R,te),B=re([J[0]+T[0]*q,J[1]+T[1]*q,J[2]+T[2]*q],u,R,te),$=re([i[0]+O[0]*M,i[1]+O[1]*M,i[2]+O[2]*M],K,Ae,te);f.push(he,B,$)},ee=(i,u,A,M,_=10,R=8,Ae=0)=>{const te=s.length/3;for(let U=0;U<=R;U++)for(let O=0;O<=_;O++){const T=U/R*Math.PI,J=O/_*Math.PI*2,q=[Math.sin(T)*Math.cos(J),Math.cos(T),Math.sin(T)*Math.sin(J)],K=[i[0]+u[0]*q[0],i[1]+u[1]*q[1],i[2]+u[2]*q[2]],he=Y([q[0]/u[0],q[1]/u[1],q[2]/u[2]]);re(K,he,A(K,he),0,Ae)}for(let U=0;U<R;U++)for(let O=0;O<_;O++){const T=te+U*(_+1)+O,J=T+1,q=T+_+1,K=q+1;f.push(T,J,q,J,K,q)}if(M)for(let U=0;U<M.n;U++){const O=l()*2-1,T=l()*6.2832,J=Math.sqrt(1-O*O),q=[J*Math.cos(T),O,J*Math.sin(T)],K=[i[0]+u[0]*q[0],i[1]+u[1]*q[1],i[2]+u[2]*q[2]],he=Y([q[0]/u[0],q[1]/u[1],q[2]/u[2]]),B=M.len[0]+(M.len[1]-M.len[0])*l();(!M.keep||M.keep(K,he))&&Se(K,he,M.comb||ze.G,B,M.wid*(.7+.6*l()),A(K,he).clone().multiplyScalar(.62),(M.tip||G).clone().lerp(A(K,he),.25+.45*l()),0,M.lift??.55)}},ie=(i,u,A,M,_,R=6,Ae=4)=>{const te=i.length,U=(te-1)*Ae,O=s.length/3,T=[],J=[],q=B=>i[Math.min(te-1,Math.max(0,B))];for(let B=0;B<=U;B++){const $=Math.min(B/Ae,te-1-1e-6),I=Math.floor($),V=$-I,ae=q(I-1),Z=q(I),fe=q(I+1),le=q(I+2),be=[0,0,0];for(let H=0;H<3;H++)be[H]=.5*(2*Z[H]+(fe[H]-ae[H])*V+(2*ae[H]-5*Z[H]+4*fe[H]-le[H])*V*V+(3*Z[H]-ae[H]-3*fe[H]+le[H])*V*V*V);T.push(be),J.push(u[I]+(u[I+1]-u[I])*V)}let K=null;const he=[];for(let B=0;B<=U;B++){const $=T[Math.max(B-1,0)],I=T[Math.min(B+1,U)],V=Y([I[0]-$[0],I[1]-$[1],I[2]-$[2]]);if(!K)K=Y(Ce(V,Math.abs(V[1])<.9?[0,1,0]:[1,0,0]));else{const Z=C(K,V);K=Y([K[0]-V[0]*Z,K[1]-V[1]*Z,K[2]-V[2]*Z])}const ae=Ce(V,K);he.push([V,K,ae]);for(let Z=0;Z<R;Z++){const fe=Z/R*Math.PI*2,le=Math.cos(fe),be=Math.sin(fe),H=[K[0]*le+ae[0]*be,K[1]*le+ae[1]*be,K[2]*le+ae[2]*be],Le=[T[B][0]+H[0]*J[B],T[B][1]+H[1]*J[B],T[B][2]+H[2]*J[B]];re(Le,H,A(Le,H,B/U),M?M(B/U):0)}}for(let B=0;B<U;B++)for(let $=0;$<R;$++){const I=O+B*R+$,V=O+B*R+($+1)%R,ae=I+R,Z=V+R;f.push(I,ae,V,V,ae,Z)}if(_)for(let B=0;B<_.n;B++){const $=.04+.94*l(),I=Math.min(U-1,Math.floor($*U)),[V,ae,Z]=he[I],fe=l()*6.2832,le=Math.cos(fe),be=Math.sin(fe),H=[ae[0]*le+Z[0]*be,ae[1]*le+Z[1]*be,ae[2]*le+Z[2]*be],Le=[T[I][0]+H[0]*J[I],T[I][1]+H[1]*J[I],T[I][2]+H[2]*J[I]],He=_.len[0]+(_.len[1]-_.len[0])*l(),Re=A(Le,H,$);Se(Le,H,_.comb==="along"?V:_.comb||ze.G,He,_.wid*(.7+.6*l()),Re.clone().multiplyScalar(.62),(_.tip||G).clone().lerp(Re,.3+.4*l()),M?M($):0,_.lift??.5)}},ye=ve?[null,null,null,[[0,0,0],[.11,.115,.105]]]:Fe?[[[-.04,.15,0],[.2,.16,.2]],[[.01,.36,0],[.18,.27,.17]],[[.03,.53,0],[.21,.17,.21]],[[.115,.755,0],[.11,.115,.105]]]:de?[[[-.03,.16,0],[.21,.16,.2]],[[0,.36,0],[.18,.27,.17]],[[-.01,.52,0],[.21,.17,.21]],[[.06,.73,0],[.11,.115,.105]]]:xe?[[[-.14,-.01,0],[.2,.135,.15]],[[0,0,0],[.3,.15,.16]],[[.14,.03,0],[.19,.17,.2]],[[.39,.08,0],[.11,.11,.1]]]:[[[0,-.2,.25],[.13,.12,.13]],[[0,0,.23],[.15,.25,.145]],[[0,.13,.27],[.185,.17,.13]],[[.02,.36,.2],[.1,.105,.1]]],Te=e.fur??1,ne=e.hi?1:0;ve||(ee(ye[0][0],ye[0][1],(i,u)=>ce(u,.85),{n:Math.round(70*Te),len:[.1,.17],wid:.06,lift:.8}),ee(ye[1][0],ye[1][1],(i,u)=>ce(u,1),{n:Math.round(110*Te),len:[.11,.19],wid:.06,lift:.8}),ee(ye[2][0],ye[2][1],(i,u)=>ce(u,.55,D),{n:Math.round(170*Te),len:[.18,.34],wid:.06,lift:.6,tip:G,keep:(i,u)=>C(u,ze.D)>-.6}));const we=ye[3][0],Ge=ye[3][1][0]/.11;if(e.head!==!1){const i=(A,M,_)=>[we[0]+A*Ge,we[1]+M*Ge,we[2]+_*Ge],u=(A,M,_)=>[A*Ge,M*Ge,_*Ge];ee(we,ye[3][1],(A,M)=>M[0]>.66?j:w.clone().lerp(L,.35*oe(.1,.6,M[0])).lerp(o,oe(.25,.6,C(M,ze.cap)-.35*M[0])*.9),{n:Math.round(70*Te*(1+ne)),len:[.06,.12],wid:.04,lift:1.1,comb:[-.5,-.4,0],tip:D,keep:(A,M)=>M[0]<.45},ne?14:10,ne?10:8),ee(i(.06,-.006,0),u(.054,.08,.076),(A,M)=>j.clone().lerp(S,.55*oe(.35,.95,Math.abs(M[2]))+.25*oe(.2,.9,-M[1])),null,ne?12:8,ne?9:6,1),ee(i(.082,.056,0),u(.034,.022,.072),()=>o,null,8,5);for(const A of[-1,1])ee(i(.099,.02,A*.037),u(.014,.017,.02),()=>W,null,ne?8:6,ne?6:4,1);if(ee(i(.096,-.05,0),u(.038,.032,.048),()=>N,null,8,6,1),ee(i(.112,-.012,0),u(.015,.015,.024),(A,M)=>j.clone().lerp(N,.5*oe(0,1,M[1])),null,6,5,1),ne){for(const A of[-1,1])ee(i(.1245,-.012,A*.0095),u(.0055,.007,.007),()=>W,null,5,4,1);ee(i(.131,-.058,0),u(.006,.0045,.03),()=>se("#3a1a16"),null,6,4,1);for(const A of[-1,1])ee(i(.1115,.027,A*.033),u(.0045,.0045,.0045),()=>se("#dfe6ee"),null,4,3,1)}}const Pe=(i,u,A)=>ce(u,.6,w).lerp(X,.4*A),ke={n:Math.round(34*Te),len:[.07,.12],wid:.045,lift:.8},ue=(i,u)=>ee(i,u,()=>F,null,6,4,1);if(!ve)if(Fe){const i=Math.tan(e.slope??.55);for(const u of[-1,1]){const A=.35+.05*u,M=A*i+.03,_=.15-.03*u,R=_*i+.025;ie([[.07,.56,u*.17],[.24,.5*(.56+M)+.03,u*.22],[A,M,u*.055]],[.062,.05,.036],Pe,null,ke),ue([A+.02,M-.005,u*.05],[.05,.034,.045]),ie([[0,.14,u*.13],[.21,.33+.5*R,u*.26],[_,R,u*.08]],[.082,.062,.04],Pe,null,ke),ue([_+.03,R-.005,u*.075],[.062,.03,.045])}}else if(de)for(const i of[-1,1])ie([[.04,.52,i*.17],[.17,.32,i*.21],[.25,.2,i*.1]],[.062,.05,.036],Pe,null,ke),ue([.26,.19,i*.1],[.045,.035,.045]),ie([[.02,.14,i*.13],[.25,.3,i*.18],[.31,.04,i*.13]],[.082,.062,.04],Pe,null,ke),ue([.34,.03,i*.13],[.06,.03,.04]);else if(xe){const i=[[[.16,.02,.14],[.36,.2,.3],[.56,.36,.34]],[[.16,0,-.14],[.42,-.02,-.28],[.66,.02,-.3]]],u=[[[-.2,0,.1],[-.38,.1,.26],[-.64,.1,.3]],[[-.2,-.02,-.1],[-.3,-.2,-.24],[-.52,-.34,-.24]]];for(const A of i)ie(A,[.062,.05,.036],Pe,null,ke),ue(A[2],[.045,.035,.04]);for(const A of u)ie(A,[.08,.058,.038],Pe,null,ke),ue(A[2],[.055,.035,.04])}else for(const i of[-1,1])ie([[i*.13,.2,.2],[i*.21,.31,.03],[i*.05,.44+i*.05,-.08]],[.062,.05,.036],Pe,null,ke),ue([i*.04,.45+i*.05,-.085],[.04,.035,.04]),ie([[i*.1,-.2,.22],[i*.23,-.1,.02],[i*.06,-.33-i*.04,-.07]],[.08,.058,.038],Pe,null,ke),ue([i*.05,-.34-i*.04,-.08],[.045,.035,.045]);if(!ve){const i=et,u=e.tailFree??0,A=e.tailW??1,M=e.tail||(Fe?[[-.2,.1,0],[-.36,-.04,.02],[-.44,-.36,.035],[-.44,-.74,.01],[-.39,-1.06,-.03],[-.29,-1.26,-.06]]:de?[[-.17,.1,0],[-.46,.06,.06],[-.8,.045,.02],[-1.12,.04,-.06]]:xe?[[-.27,.02,0],[-.62,.1,0],[-.98,.17,0],[-1.34,.2,0]]:[[0,-.26,.33],[0,-.26,.33+i/3],[0,-.26,.33+2*i/3],[0,-.26,.33+i]]),_=M.map((R,Ae)=>{const te=Ae/(M.length-1);return .043+.012*Math.sin(te*Math.PI)-(.02+.014*(e.tailThin||0))*te*te});ie(M,_,(R,Ae,te)=>o.clone().lerp(w,.2+.6*oe(.05,.55,te)).lerp(L,oe(.65,1,te)*.85),R=>A*(u>0?oe(u,1,R):R),{n:Math.round(90*Te),len:[.08,.15],wid:.05,lift:e.tailLift??.9,comb:"along",tip:G},6,5)}return{position:s,normal:h,color:p,tail:m,smooth:b,index:f,headAt:we}}function tt(a,r,e){const s=yt(e,"cling"),h=new c.InstancedBufferGeometry;h.setAttribute("position",new c.Float32BufferAttribute(s.position,3)),h.setAttribute("normal",new c.Float32BufferAttribute(s.normal,3)),h.setAttribute("aCol",new c.Float32BufferAttribute(s.color,3)),h.setAttribute("aTail",new c.Float32BufferAttribute(s.tail,1)),h.setAttribute("aSm",new c.Float32BufferAttribute(s.smooth,1)),h.setIndex(s.index);const p=[],m=[],b=[];for(const l of r){const d=l.culm;p.push(d.x,d.y,d.z),m.push(d.h,d.stiff,d.leanAz,d.lean),b.push(l.s,l.az,l.scale,l.seed)}ge(h,"aBase",p,3),ge(h,"aCulm",m,4),ge(h,"aGrip",b,4),h.instanceCount=r.length;const f=new c.ShaderMaterial({fog:!0,lights:!0,side:c.DoubleSide,uniforms:{...qe(),...Ne(),...a},vertexShader:`
      attribute vec3 aBase, aCol; attribute vec4 aCulm, aGrip; attribute float aTail, aSm;
      varying vec3 vN, vV, vC, vO; varying float vSm;
      #include <fog_pars_vertex>
      ${Be}
      void main(){
        vec3 T, wg;
        vO = position;
        vec3 c = bsCulm(aBase, aCulm, aGrip.x, T, wg);
        vec3 outw = vec3(cos(aGrip.y), 0.0, sin(aGrip.y));
        vec3 Z = outw - T*dot(outw, T); Z = Z/max(length(Z), 1e-3);
        vec3 X = cross(T, Z);
        float gs = clamp(wg.x + 0.5*wg.y + wg.z, 0.0, 1.3);
        vec3 lp = position;
        lp.z += 0.02*sin(uTime*2.1 + aGrip.w*20.0)*(1.0 - aTail);                 // breathing, shifting grip
        vec3 p = c + (X*lp.x + T*lp.y + Z*lp.z)*aGrip.z;
        vec3 n = X*normal.x + T*normal.y + Z*normal.z;
        // tail: built straight out from the rump; at rest it hangs, in a gust it streams downwind (or along the splay),
        // sagging along its length, with a travelling flutter
        vec3 pd = bsPart(aBase.xz, 1.0);
        vec3 dw = normalize(mix(vec3(uWind.x, -0.38, uWind.y), vec3(pd.x*1.1, -0.3, pd.y*0.55), min(pd.z, 1.0)) + vec3(0.0, 1e-3, 0.0));
        float k = clamp(0.25 + 0.75*gs, 0.0, 1.0);
        vec3 dt = normalize(mix(vec3(0.0, -1.0, 0.0) + Z*0.3, dw, k));
        float len = ${et.toFixed(2)}*aGrip.z*aTail;
        vec3 fl = cross(dw, vec3(0.0, 1.0, 0.0))*sin(uTime*(6.0 + 3.0*gs) - aTail*5.0 + aGrip.w*9.0)*(0.05 + 0.12*gs)*aTail;
        p += (dt - Z)*len - vec3(0.0, 0.16, 0.0)*(aTail*len*k) + fl*aGrip.z;
        vec4 mvPosition = modelViewMatrix*vec4(p, 1.0);
        vN = normalize(normalMatrix*n); vV = mvPosition.xyz; vC = aCol; vSm = aSm;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uGold;
      varying vec3 vN, vV, vC, vO; varying float vSm;
      #include <fog_pars_fragment>
      ${Ve}
      ${bt}
      void main(){
        vec3 V = normalize(-vV), L = bsSunDir();
        vec3 N = normalize(vN); N = faceforward(N, -V, N);
        // a lit side and a shaded side, a dark belly, and a gold rim against the sky; the face and hands are bare skin
        float fur = bsNoise(vO.xy*vec2(70.0, 22.0) + vO.z*31.0)*0.6 + bsNoise(vO.zy*vec2(160.0, 50.0))*0.4;       // combed fur, darker in the partings
        vec3 col = bsFur(vC*0.76, N, V, L, normalize(mat3(viewMatrix)*vec3(0.0, 1.0, 0.0)), fur, 1.0, 1.5, mix(uGold, vec3(1.0, 0.92, 0.75), 0.55), 1.0 - clamp(vSm, 0.0, 1.0));
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),v=new c.Mesh(h,f);return v.frustumCulled=!1,v}async function wt(a,r={}){const e=a.rng.fork?a.rng.fork("bamboo-surf-hero"):a.rng,s=e,h=a.noise,p=a.quality?.detail??1,m=(r.palette&&r.palette.length>=7?r.palette:lt).map(se),b=r.hour||r.weather||"storm",f=r.season||"summer",v=Math.min(1.3,Math.max(.5,r.density??1)),l=56,d=r.lane?.amp??e.range(1.6,3.2)*e.sign(),w=r.lane?.freq??e.range(.045,.07),k=r.lane?.ph??e.range(0,6.28),o=t=>d*Math.sin(t*w+k),L=e.range(4.5,6.5),D=e.range(11.5,14.5),j=e.range(0,50),S=(t,n)=>{const g=D*Math.pow(oe(34,-46,n),1.3)*(1-.75*oe(-46,-84,n)),y=t-o(n),z=(1-Math.exp(-(y*y)/100))*L*oe(-46,-12,n),x=h.fbm2(t*.035+j,n*.035,3)*1.7*(.3+.7*oe(3,12,Math.abs(y))),P=Math.hypot(t,n);return(g+z+x)*(1-oe(l-14,l+6,P))-1.5*oe(l+1,l+6,P)},F=typeof r.heightFn=="function"?r.heightFn:S,G=new c.Vector2(.7071,-.7071),W=e.range(0,6.28),N=m[0].clone(),X=m[1].clone(),de=m[2].clone(),xe=m[3].clone(),Fe=new c.Vector3(1,1,1);let ve=1;const ze=X.clone().lerp(se("#ffffff"),.25);b==="noon"?(ve=.12,N.lerp(de,.35),X.lerp(m[3],.5),xe.lerp(se("#cfd9d8"),.75)):b==="evening"?(Fe.set(1.3,.85,.45),ze.set("#ffd27a").lerp(X,.25)):b==="night"&&(Fe.set(.75,.85,1.15),N.lerp(de,.3),X.lerp(se("#c8d6e0"),.55),xe.lerp(se("#d6dde2"),.8),ze.set("#dfe8ff"));const C={uTime:{value:0},uPx:{value:.002},uWind:{value:new c.Vector4(G.x,G.y,1,W)},uBand:{value:new c.Vector4(1,0,0,0)},uOld:{value:new c.Vector4(0,0,1,0)},uBreak:{value:new c.Vector4(0,0,300,0)},uBreakSun:{value:0},uBreak2:{value:new c.Vector4(0,0,300,0)},uPart:{value:new c.Vector4(-100,0,pe,_e)},uLane:{value:new c.Vector4(d,w,k,0)},uGlades:{value:Array.from({length:16},()=>new c.Vector3(1e5,1e5,1))},uGully:{value:new c.Vector3},uSunGain:{value:ve},uSunTint:{value:Fe},uJade:{value:N},uLime:{value:X},uDeep:{value:de},uCeladon:{value:xe},uSlate:{value:m[4]},uWhite:{value:m[5]},uGold:{value:m[6]},uShaftCol:{value:ze},uAtlas:{value:null},uSnow:{value:f==="snow"?1:0},uYellow:{value:f==="spring"?1:0},uFill:{value:new c.Vector2(.22,1.35)},uFlower:{value:new c.Vector4(0,0,1,0)}},Y=F(o(pe),pe),Ce=F(o(pe-_e),pe-_e);C.uGully.value.set(Y,(Ce-Y)/_e,0);const re=new c.Group;re.name="bamboo-surf-hero";const Q=new c.Group;Q.name="bamboo-surf-stand",re.add(Q);const ce=ut(C);C.uAtlas.value=dt(e.fork?e.fork("atlas"):e);const Me=ht(C);await a.yield?.();const Se=(t,n,g,y={},z=null)=>{const x=z||s,P=y.r??x.range(.06,.09)*(g?1:.92),E=x();return{x:t,z:n,y:y.y??F(t,n)-.15,near:g,h:y.h??x.range(22,26)*(.86+P*1.9),r:P,stiff:x.range(.82,1.18)*(.075/P)**.35,leanAz:Math.atan2(G.y,G.x)+x.gauss()*1.1,lean:x.range(.05,.3)*(f==="snow"?1.6:1),age:y.age??(E<.16?x.range(0,.22):E<.7?x.range(.3,.6):x.range(.65,1)),seed:x(),node:x.range(.3,.42)}},ee=1.5,ie=new Map,ye=(t,n,g)=>{const y=Math.floor(t/ee),z=Math.floor(n/ee);for(let x=-1;x<=1;x++)for(let P=-1;P<=1;P++){const E=ie.get(y+x+","+(z+P));if(E){for(const me of E)if((me.x-t)**2+(me.z-n)**2<g*g)return!1}}return!0},Te=t=>{const n=Math.floor(t.x/ee)+","+Math.floor(t.z/ee);ie.has(n)||ie.set(n,[]),ie.get(n).push(t)},ne=[],we=[],Ge=Math.round(260*v),Pe=Math.round(548*v*(.6+.4*p));for(let t=0;ne.length<Ge&&t<Ge*30;t++){const n=e.range(-l+3,l-2),g=e.sign(),y=4.7+9.3*Math.pow(e(),1.25),z=o(n)+g*y;if(Math.hypot(z,n)>l-1.5||!ye(z,n,1.25))continue;const x=Se(z,n,!0);ne.push(x),Te(x)}for(let t=0;we.length<Pe&&t<Pe*30;t++){const n=e.range(0,6.2832),g=(l-1)*Math.sqrt(e()),y=Math.cos(n)*g,z=Math.sin(n)*g;if(Math.abs(y-o(z))<14||!ye(y,z,1.5)||h.n2(y*.05+9,z*.05)<-.45&&e.chance(.7))continue;const x=Se(y,z,!1);we.push(x),Te(x)}for(let t=0;t<12;t++){const n=e.range(-l*.7,l*.8),g=o(n)+e.sign()*e.range(7,30);if(Math.hypot(g,n)>l-4)continue;const y=Se(g,n,Math.abs(g-o(n))<14,{age:1.25,h:e.range(13,19),r:.055});y.lean=e.range(.55,.95),y.leanAz=e.range(0,6.28),y.stiff=.3,(y.near?ne:we).push(y)}for(const t of ne.concat(we)){if(t.age<1.05||t.z>pe+10||t.z<pe-_e-16)continue;const n=t.x-o(t.z);Math.abs(n)<32&&(t.leanAz=Math.atan2(-.35,n<0?-1:1),t.lean=Math.min(t.lean,.6))}let ke=0;for(const t of ne){const n=t.x-o(t.z),g=9,y=g/t.h,z=(.65*t.stiff+t.lean+.04)*Math.pow(y,1.6),x=g*z/2.6,P=Math.max(2.5+x+t.r,4.5)-Math.abs(n);P>0&&(t.x+=Math.sign(n)*P,t.y=F(t.x,t.z)-.15,ke++)}const ue=[];if(r.monkeys!==!1)for(let t=0;t<6;t++){const n=t%2?1:-1,g=pe-13-Math.floor(t/2)*12-(n>0?5:0),y=8+t%3*1.7;let z=null,x=1e9;for(const P of ne){if(P.age>1.05||P.monkey)continue;const E=P.x-o(P.z);if(Math.sign(E)!==n)continue;const me=(P.z-g)**2+(Math.abs(E)-y)**2;me<x&&(x=me,z=P)}if(!z||x>36){const P=g,E=o(P)+n*y;z=Se(E,P,!0),ne.push(z)}z.monkey=!0,z.r=.09,z.h=Math.max(z.h,25),z.age=e.range(.6,.85),z.lean=Math.min(z.lean,.12),ue.push({culm:z,s:e.range(12.5,17),az:Math.atan2(-.4,-n)+e.range(-.5,.5),scale:e.range(1.1,1.3)*(r.monkeyScale??1),seed:e()})}await a.yield?.();const i=We(ne,6,10,ce),u=We(we,4,5,ce);Q.add(i,u,Ze(C,ne,F));const A=ne.concat(we),M=Ke(A,e,Me,5,3);Q.add(M),await a.yield?.(),r.shell!==!1&&Q.add(mt(C,l,F,h)),r.ground!==!1&&Q.add(xt(C,l,F,h,e,o)),await a.yield?.();const _=[],R=Math.round(1200*(.5+.5*p));for(let t=0;t<R*3&&_.length<R;t++){const n=e.range(0,6.2832),g=(l+2)*Math.sqrt(e()),y=Math.cos(n)*g,z=Math.sin(n)*g,x=Math.abs(y-o(z));x<1.6||x>16&&e.chance(.45)||_.push({x:y,y:F(y,z)-.05,z,rot:e.range(0,6.28),size:e.range(.9,1.7),seed:e(),tone:e()})}await a.yield?.();{const t=a.core?.makeRng?a.core.makeRng(a.core.hashSeed("bs-ferns:"+a.seed)):e,n=[],g=[],y=Math.round(1300*(.5+.5*p)),z=Math.round(500*(.5+.5*p));for(let E=0;E<y*4&&n.length<y;E++){const me=t.range(-l+1,l+1),De=o(me)+t.sign()*(3+13.5*Math.pow(t(),1.4));Math.hypot(De,me)>l+2||$e(De,me)<.5||n.push({x:De,y:F(De,me)-.06,z:me,rot:t.range(0,6.28),size:t.range(1,1.75),seed:t(),tone:t()})}for(let E=0;E<z*4&&g.length<z;E++){const me=t.range(0,6.2832),De=(l+2)*Math.sqrt(t()),Ie=Math.cos(me)*De,je=Math.sin(me)*De;Math.abs(Ie-o(je))<15||$e(Ie,je)<.5||g.push({x:Ie,y:F(Ie,je)-.06,z:je,rot:t.range(0,6.28),size:t.range(1.2,2.1),seed:t(),tone:t()})}await a.yield?.();const x=Oe(C,n),P=Oe(C,g,{fronds:4,segs:1});x.name=P.name="bamboo-surf-ferns",Q.add(x,P)}await a.yield?.();const Ae=Math.round((f==="summer"?8e3:9e3)*(.5+.5*p)),te=pt(C,Ae,e,l,.36);re.add(te),await a.yield?.();const U=[];for(let t=0;t<16;t++){const n=e.range(-l*.75,l*.8),g=o(n)+(t%3===0?e.range(-3,3):e.sign()*e.range(6,30));Math.hypot(g,n)>l-6||U.push({x:g,y:F(g,n)+e.range(20,23),z:n,w:e.range(1.3,2.8),len:e.range(26,34)})}const O=Ye(C,U);Q.add(O);let T=null;ue.length&&(T=tt(C,ue,"#"+m[6].getHexString()),Q.add(T)),await a.yield?.();const J=[],q=a.core?.makeRng?a.core.makeRng(a.core.hashSeed("bs-boughs:"+a.seed)):e;function K(t,n={}){const g=[],y=[];for(const x of t){const P=Se(x.x,x.z,x.near!==!1,{y:x.y,h:x.h,r:x.r,age:x.age},n.rng);x.lean!==void 0&&(P.lean=x.lean),x.leanAz!==void 0&&(P.leanAz=x.leanAz),x.stiff!==void 0&&(P.stiff=x.stiff),x.plume!==void 0&&(P.plume=x.plume),x.span!==void 0?P.span=x.span:n.span!==void 0&&P.near&&(P.span=n.span),(P.near?g:y).push(P)}const z=new c.Group;return z.name="bamboo-surf-planted",g.length&&n.culms!==!1&&z.add(We(g,6,10,ce)),g.length&&n.culms!==!1&&n.feet!==!1&&z.add(Ze(C,g,F)),y.length&&n.culms!==!1&&z.add(We(y,4,5,ce)),n.plumes!==!1&&z.add(Ke(g.concat(y),n.rng||e,Me,n.perNear??5,n.perFar??3,{arch:n.arch,from:n.from})),n.boughs&&g.length&&z.add(Ke(g,q,Me,0,0,{low:n.boughs})),re.add(z),J.push(z),z}function he(t,n={}){const g=[],y=[];for(const P of t){let E=P.share!==void 0?g[P.share]:null;E||(E=Se(P.x,P.z,!0,{h:P.h??e.range(25,27.5),r:.09,age:e.range(.6,.85)}),E.lean=P.lean??e.range(.03,.09),E.monkey=!0),g.push(E),y.push({culm:E,s:P.s,az:P.az,scale:P.scale??1.5,seed:e()})}const z=g.filter((P,E)=>g.indexOf(P)===E),x=new c.Group;return x.name="bamboo-surf-monkeys",x.add(We(z,6,10,ce),Ke(z,e,Me,n.sprays??2,2),tt(C,y,"#"+m[6].getHexString())),Q.add(x),{group:x,rest:y.map(be)}}const B=(t,n,g)=>new c.Vector3(t,n,g),$=t=>F(o(t),t),I=F(0,-46)+26,V=I+6,ae=[],Z=14,fe=$(Z)+3,le=Z-(V-fe)/Math.tan(Math.PI/6);for(const t of[l+30,l,40,26])ae.push(B(o(Math.min(t,l)),Math.max($(Math.min(t,l)),0)+3,t));for(let t=0;t<=6;t++){const n=t/6,g=n*n*(3-2*n),y=Z+(le-Z)*n;ae.push(B(o(y)*(1-g),fe+(V-fe)*(.35*n+.65*g),y))}ae.push(B(0,V,le-30),B(0,V,le-70));const be=t=>{const n=t.culm,g=t.s/n.h,y=n.lean*Math.pow(g,1.6),z=t.s*y/2.6;return B(n.x+Math.cos(n.leanAz)*z,n.y+t.s,n.z+Math.sin(n.leanAz)*z)},H={flyThrough:ae,partingStart:B(o(pe),$(pe),pe),partingEnd:B(o(pe-_e),$(pe-_e),pe-_e),portalSeat:{position:B(0,I+6,le-70),facing:B(0,0,1)},viewpoints:{mouth:B(o(24),$(24)+3,24),insideV:B(o(-8)*.6,fe+(V-fe)*.3,-8),above:B(0,V,le-8),flank:B(l+16,14,6)},monkeys:ue.map(be),windDir:B(G.x,0,G.y),sunSide:B(-.45,.42,.79).normalize(),crownTop:I};let Le=null,He=1;const Re=r.uPart??.565,at=r.duration??41,ot=t=>{const n=_e/Ee+3;C.uPart.value.x=t>=0?t*Ee:-100,C.uPart.value.y=oe(n,n+2.5,t)},Je=new c.Vector2,nt=(t,n,g)=>{const y=t*G.x+n*G.y,z=-t*G.y+n*G.x,x=Math.sin(z*.045+W)*7+Math.sin(z*.11+g*.2+W*2)*2.5;return[Xe(Ue((26*g-y-x)/110+W*.31)),Xe(Ue((30*g-y+x*.4)/30+.37))]},st=l,it=D+28,rt=B(0,15,-4);return{object:re,radius:st,height:it,center:rt,anchors:H,ground:!0,groundY:-1.4,heightAt:F,laneX:o,plant:K,own:Q,leaves:te,monkeyList:ue,addFerns:(t,n)=>Oe(C,t,n),addShafts:t=>Ye(C,t),addHalos:t=>gt(C,t),groundMaterial:()=>Qe(C,1e6),setGlade(t,n,g,y){C.uGlades.value[t].set(n,g,y)},setLitClump(t,n,g,y){C.uOld.value.set(t,n,g,y)},setLeafCenter(t){te.material.uniforms.uLeafC.value.copy(t)},wind:{glsl:Be,uniforms:C,gust:nt,dir:G},stats:{culms:A.length,plumes:M.userData.count,monkeys:ue.length,pushed:ke},setProgress(t){Le=(t-Re)*at},setParting(t){Le=t},setWind(t){He=t},setSun(t){C.uSunGain.value=ve*t},setFill(t,n){C.uFill.value.set(t,n)},addMonkeys:he,update(t,n,g){C.uTime.value=n,C.uWind.value.z=He,g&&a.renderer&&(a.renderer.getDrawingBufferSize(Je),C.uPx.value=2/(Math.max(g.projectionMatrix.elements[5],.001)*Math.max(Je.y,1)));const y=Le!==null?Le:n%18-9.5;ot(y)},dispose(){}}}export{ct as GLSL_BAND,bt as GLSL_FUR,Ve as GLSL_LIGHT,Be as GLSL_WIND,et as MONKEY_TAIL,wt as buildHero,$e as fernCover,yt as furMonkey};
