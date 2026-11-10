import*as o from"three";import{makePath as bt,lerp as de,smoothstep as O}from"../kit/core.js";import{buildHero as St,craneGeometry as Mt,GLSL_PAPER_LIGHT as Xe,FLY_THROUGH as At}from"../parts/paper-kingdom.js";const zt=["#f4ecdc","#e6dcc6","#c9bda2","#8a8272","#2a2a3a","#1f3fa8","#e23a2a"],Ze=-1.5,Ie=`
  float h11(float p){ p = fract(p * .1031); p *= p + 33.33; p *= p + p; return fract(p); }
  float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float vnoise(vec3 p){
    vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    float n = i.x + i.y * 57. + i.z * 113.;
    return mix(mix(mix(h11(n), h11(n + 1.), f.x), mix(h11(n + 57.), h11(n + 58.), f.x), f.y),
               mix(mix(h11(n + 113.), h11(n + 114.), f.x), mix(h11(n + 170.), h11(n + 171.), f.x), f.y), f.z);
  }
`;function De(t,n={}){return new o.ShaderMaterial({side:o.DoubleSide,fog:!0,vertexColors:!0,defines:n,uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:t.uTime,uU:t.uU,uLightDir:t.uLightDir,uSun:t.uSun,uAmbSky:t.uAmbSky,uAmbShade:t.uAmbShade,uWarm:t.uWarm,uWind:t.uWind,uCloudT:t.uTime,uShadowCol:t.uShadowCol},vertexShader:`
      attribute vec3 aBary; attribute vec4 aAnim;
      #ifdef SHADOW
        attribute vec3 aGn; uniform vec3 uLightDir;
      #endif
      #ifdef QUILL
        attribute vec4 aQ, aQ2; attribute float aU;
      #endif
      uniform float uTime, uU, uWind;
      varying vec3 vView, vCol, vBary, vWorld;
      #include <fog_pars_vertex>
      void main(){
        vec3 p = position; vec3 col = color; float sw = aAnim.x, seed = 0., scl = 1.;
        #ifdef USE_INSTANCING
          seed = fract(instanceMatrix[3].x * .137 + instanceMatrix[3].z * .291);
          scl = length(instanceMatrix[1].xyz);
        #endif
        #ifdef USE_INSTANCING_COLOR
          col *= instanceColor;
        #endif
        #ifdef QUILL
          float open = smoothstep(aU - .13, aU - .025, uU);
          open = clamp(open * .94 + .06 + .06 * sin(uTime * .8 + seed * 40.), 0., 1.);
          if (aQ2.w > .5) {
            float s = mix(.6, 1., open), curl = mix(1., .40, open);
            float th = aQ.w - (1. - aQ.x) * aQ2.x * curl;
            float r = aQ.z * s * (.10 + .90 * aQ.x);
            vec2 c = aQ2.yz - aQ.z * s * vec2(cos(aQ.w), sin(aQ.w));
            p = vec3(c + r * vec2(cos(th), sin(th)), aQ.y);
          }
          sw = p.y * p.y * .035;
        #endif
        #ifdef DEER
          float graze = smoothstep(.5, .9, sin(uTime * .23 + seed * 30.));
          float ang = aAnim.y * (.10 * sin(uTime * .6 + seed * 17.) + graze * .9);
          vec2 q = p.yz - vec2(.95, .45); float cs = cos(ang), sn = sin(ang);
          p.yz = vec2(cs * q.x - sn * q.y, sn * q.x + cs * q.y) + vec2(.95, .45);
          p.x += aAnim.z * sin(uTime * 2.3 + seed * 9.) * .04;
        #endif
        vec4 wp = vec4(p, 1.);
        #ifdef USE_INSTANCING
          wp = instanceMatrix * wp;
        #endif
        wp = modelMatrix * wp;
        float ws = sw * scl * uWind;
        wp.x += ws * (sin(uTime * 1.15 + wp.x * .045 + wp.z * .03 + seed * 6.) + .4 * sin(uTime * 2.7 + wp.z * .11));
        wp.z += ws * .7 * cos(uTime * .93 + wp.z * .05 + seed * 4.);
        #ifdef SHADOW
          vec3 O = instanceMatrix[3].xyz + aGn * .5;
          vec3 Ls = normalize(vec3(uLightDir.x, max(uLightDir.y, .5), uLightDir.z));
          wp.xyz -= Ls * (dot(wp.xyz - O, aGn) / max(dot(Ls, aGn), .3));
        #endif
        vec4 mvPosition = viewMatrix * wp;
        vView = mvPosition.xyz; vWorld = wp.xyz; vCol = col; vBary = aBary;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vView, vCol, vBary, vWorld;
      #include <fog_pars_fragment>
      ${Ie}
      ${Xe}
      uniform vec3 uShadowCol;
      void main(){
      #ifdef SHADOW
        gl_FragColor = vec4(mix(uShadowCol, vec3(4.), smoothstep(380., 640., -vView.z)), 1.);   // MIN-blended: never darkens twice
      #else
        vec3 alb = vCol;
        vec3 fp = vWorld * vec3(.33, .9, .33);
        alb *= .93 + .11 * (vnoise(fp) * .6 + vnoise(fp * 4.3 + 11.) * .4);
        #ifdef CREASE
          float ed = min(min(vBary.x, vBary.y), vBary.z), aa = fwidth(ed) + 1e-5;
          float line = (1. - smoothstep(aa * .5, aa * 1.5, ed)) * (1. - smoothstep(.05, .22, aa));
          line *= mix(1., .4, smoothstep(250., 1400., -vView.z));
          alb *= 1. - .05 * (1. - smoothstep(0., .10, ed));          // the sheet darkens a little into each fold
          alb = mix(alb, alb * vec3(.64, .63, .76), line * .75);
        #endif
        vec3 n;
        gl_FragColor = vec4(paperLight(alb * .8, vView, 1., 1., n) * 1.06 + alb * vec3(.065, .065, .095), 1.);
      #endif
        #include <fog_fragment>
      }`})}function Ct(t,n){const m=De(t,{...n,SHADOW:""});return m.transparent=!0,m.depthWrite=!1,m.blending=o.CustomBlending,m.blendEquation=o.MinEquation,m.blendSrc=o.OneFactor,m.blendDst=o.OneFactor,m.polygonOffset=!0,m.polygonOffsetFactor=-2,m.polygonOffsetUnits=-2,m}function we(){const t=[],n=[],m=[],l=[],a=(d,h,v,A,x)=>{t.push(d[0],d[1],d[2]),n.push(h.r,h.g,h.b),m.push(v,A,x),l.push(d[3]||0,d[4]||0,d[5]||0,0)},i={count:0,tri(d,h,v,A){a(d,A,1,0,0),a(h,A,0,1,0),a(v,A,0,0,1),i.count++},quad(d,h,v,A,x){a(d,x,1,1,0),a(h,x,0,1,0),a(v,x,0,1,1),a(d,x,1,1,0),a(v,x,0,1,1),a(A,x,0,1,0),i.count+=2},geometry(){const d=new o.BufferGeometry;return d.setAttribute("position",new o.Float32BufferAttribute(t,3)),d.setAttribute("color",new o.Float32BufferAttribute(n,3)),d.setAttribute("aBary",new o.Float32BufferAttribute(m,3)),d.setAttribute("aAnim",new o.Float32BufferAttribute(l,4)),d}};return i}function Tt(t,n,m,l,a){const i=m.clone().add(new o.Vector3(.022,.03,-.012)).normalize(),d=new o.ShaderMaterial({side:o.BackSide,depthWrite:!1,fog:!1,uniforms:{uTime:t.uTime,uSky:{value:n},uSunDir:{value:m},uSunDir2:{value:i},uSunCol:{value:l},uPin:{value:a}},vertexShader:`
      varying vec3 vDir;
      void main(){ vDir = position; vec4 p = projectionMatrix * vec4(mat3(viewMatrix) * position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:`
      uniform vec3 uSky, uSunDir, uSunDir2, uSunCol, uPin; uniform float uTime; varying vec3 vDir;
      ${Ie}
      void main(){
        vec3 d = normalize(vDir); float el = asin(clamp(d.y, -1., 1.)), az = atan(d.z, d.x);
        vec3 col = uSky * mix(1.07, .86, smoothstep(-.05, .95, d.y));
        float f1 = vnoise(vec3(az * 16., el * 240., 1.)), f2 = vnoise(vec3(az * 170. + el * 110., el * 34., 5.)), f3 = vnoise(vec3(d * 7.));
        col *= .93 + .07 * f1 + .05 * f2 + .05 * f3;
        // pinholes
        vec2 g = vec2(az, el) * 57.2958 / 3.2, id = floor(g), f = fract(g) - .5;
        float h = h21(id); vec2 off = (vec2(h21(id + 7.3), h21(id + 3.1)) - .5) * .7;
        float r = length((f - off) * vec2(cos(el), 1.));
        float pin = step(.80, h) * (1. - smoothstep(.02, .05, r)) * smoothstep(.16, .42, d.y);
        col += uPin * pin * (1.9 + 1.5 * sin(uTime * (1. + h * 3.) + h * 50.));
        // tissue sun: a paler ragged sheet behind a red disc
        float ang = acos(clamp(dot(d, uSunDir), -1., 1.)), ang2 = acos(clamp(dot(d, uSunDir2), -1., 1.));
        float R = .108, aa = fwidth(ang) + 1e-4;
        float wob = (vnoise(d * 46.) - .5) * .010;
        float disc = 1. - smoothstep(R - aa, R + aa, ang + wob * .4);
        float disc2 = 1. - smoothstep(R * 1.26 - aa, R * 1.26 + aa, ang2 + wob * 2.);
        col = mix(col, mix(col, uSunCol * 1.25, .26), disc2);
        col += uSunCol * .35 * exp(-ang * ang / .05) * (1. - disc);
        vec3 tissue = uSunCol * (.84 + .16 * vnoise(d * 150.) + .12 * vnoise(d * 30.));        // below 1: stays tissue red, no clip to orange
        col = mix(col, tissue, disc);
        gl_FragColor = vec4(col, 1.);
      }`}),h=new o.Mesh(new o.SphereGeometry(1,32,20),d);return h.frustumCulled=!1,h.renderOrder=-10,h.name="paper-sky",h}function kt(t,n,m,l){const a=new o.PlaneGeometry(1,1).translate(0,.5,0),i=new o.InstancedBufferGeometry;i.setAttribute("position",a.getAttribute("position")),i.setIndex(a.getIndex());const d=[],h=[],v=[],A=t.chance(.5)?1:-1;[{r:2700,y:[240,560],w:[700,1300],sp:.006,n:t.int(7,10)},{r:2250,y:[460,820],w:[520,1e3],sp:-.0105,n:t.int(6,9)},{r:1850,y:[640,1050],w:[380,760],sp:.017,n:t.int(5,8)}].forEach((T,k)=>{for(let F=0;F<T.n;F++){const _=(F+t.range(.1,.9))/T.n*Math.PI*2,U=t.range(T.y[0],T.y[1]),G=t.range(T.w[0],T.w[1]),I=t(),V=l[(k+(t.chance(.25)?1:0))%3];for(const J of[1,0])d.push(_,U,T.r+J*12,G),h.push(T.sp*A,I,J,k),v.push(V.r,V.g,V.b)}}),i.setAttribute("aC",new o.InstancedBufferAttribute(new Float32Array(d),4)),i.setAttribute("aS",new o.InstancedBufferAttribute(new Float32Array(h),4)),i.setAttribute("aTone",new o.InstancedBufferAttribute(new Float32Array(v),3)),i.instanceCount=d.length/4;const y=new o.ShaderMaterial({side:o.DoubleSide,fog:!1,uniforms:{uTime:n.uTime,uSky:{value:m}},vertexShader:`
      attribute vec4 aC, aS; attribute vec3 aTone; uniform float uTime;
      varying vec2 vUv; varying vec4 vS; varying vec3 vTone;
      void main(){
        float a = aC.x + uTime * aS.x;
        vec3 ctr = vec3(cameraPosition.x + cos(a) * aC.z, aC.y, cameraPosition.z + sin(a) * aC.z);
        vec3 tang = vec3(-sin(a), 0., cos(a));
        vec3 p = ctr + tang * position.x * aC.w + vec3(0., position.y * aC.w * .40, 0.);
        p += aS.z * (tang * aC.w * .012 - vec3(0., aC.w * .016, 0.));
        vUv = vec2(position.x + .5, position.y); vS = aS; vTone = aTone;
        gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
      }`,fragmentShader:`
      uniform vec3 uSky; varying vec2 vUv; varying vec4 vS; varying vec3 vTone;
      ${Ie}
      void main(){
        float x = vUv.x, y = vUv.y, s = vS.y;
        float env = pow(max(sin(3.14159 * x), 0.), .55);
        float lob = max(abs(sin(x * 7. + s * 31.)), abs(sin(x * 11.3 + s * 17.)) * .8);
        float tear = (vnoise(vec3(vUv * vec2(70., 28.), s * 9.)) - .5) * .028;
        float top = .10 + env * (.30 + .55 * lob) + tear, bottom = .10 + .025 * sin(x * 23. + s * 9.) - tear;
        if (y < bottom || y > top || x < .015 || x > .985) discard;
        vec3 col = vTone * (.95 + .07 * vnoise(vec3(vUv * vec2(260., 40.), s)));
        col = mix(col, col * 1.10, 1. - smoothstep(0., .035, top - y));       // the torn edge shows the white core
        col *= mix(.90, 1., smoothstep(0., .30, y - bottom));
        if (vS.z > .5) col = uSky * vec3(.80, .79, .86);
        gl_FragColor = vec4(col, 1.);
      }`}),s=new o.Mesh(i,y);return s.frustumCulled=!1,s.renderOrder=-5,s.name="paper-clouds",s}function Bt(t,n,m,l){const a=new o.PlaneGeometry(1,1),i=new o.InstancedBufferGeometry;i.setAttribute("position",a.getAttribute("position")),i.setIndex(a.getIndex());const d=new Float32Array(m*3),h=new Float32Array(m*4),v=new Float32Array(m*3);for(let y=0;y<m;y++){d.set([t(),t(),t()],y*3),h.set([t(),t(),t(),t.range(.26,.62)],y*4);const s=t.chance(.09)?l[1]:t.chance(.05)?l[2]:l[0];v.set([s.r,s.g,s.b],y*3)}i.setAttribute("aP",new o.InstancedBufferAttribute(d,3)),i.setAttribute("aS",new o.InstancedBufferAttribute(h,4)),i.setAttribute("aCol",new o.InstancedBufferAttribute(v,3)),i.instanceCount=m;const A=new o.ShaderMaterial({side:o.DoubleSide,fog:!0,uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:n.uTime,uCloudT:n.uTime,uLightDir:n.uLightDir,uSun:n.uSun,uAmbSky:n.uAmbSky,uAmbShade:n.uAmbShade,uWarm:n.uWarm,uBox:{value:new o.Vector3(150,80,150)},uDrift:{value:new o.Vector2(t.range(-2.4,2.4),t.range(-2.4,2.4))}},vertexShader:`
      attribute vec3 aP, aCol; attribute vec4 aS; uniform float uTime; uniform vec3 uBox; uniform vec2 uDrift;
      varying vec3 vView, vCol;
      #include <fog_pars_vertex>
      void main(){
        vec3 base = aP * uBox;
        base.y -= uTime * (.9 + aS.x * 1.5);
        base.x += sin(uTime * .5 + aS.y * 40.) * 3. + uTime * uDrift.x; base.z += cos(uTime * .41 + aS.z * 40.) * 3. + uTime * uDrift.y;
        vec3 rel = mod(base - cameraPosition + uBox * .5, uBox) - uBox * .5;
        float a = uTime * (1.4 + aS.x * 2.6) + aS.y * 60., b = uTime * (1.0 + aS.z * 2.) + aS.x * 30.;
        vec3 ax = normalize(vec3(cos(a), sin(b) * .8, sin(a) * cos(b) + .2));
        vec3 ay = normalize(cross(ax, vec3(sin(b * .7), cos(a * .6) + .3, .3)));
        vec3 q = abs(rel) / (uBox * .5);
        float fade = smoothstep(2., 6., length(rel)) * (1. - smoothstep(.85, 1., max(q.x, max(q.y, q.z))));
        vec3 wp = cameraPosition + rel + (ax * position.x * 1.7 + ay * position.y) * aS.w * fade;
        vec4 mvPosition = viewMatrix * vec4(wp, 1.);
        vView = mvPosition.xyz; vCol = aCol;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vView, vCol;
      #include <fog_pars_fragment>
      ${Xe}
      void main(){ vec3 n; gl_FragColor = vec4(paperLight(vCol * .82, vView, 1., 1., n), 1.);
        #include <fog_fragment>
      }`}),x=new o.Mesh(i,A);return x.frustumCulled=!1,x.name="paper-scraps",x}function Pt(t,n,m,l,a){const i=n.n,d=new Float32Array((i+1)*6),h=new Float32Array((i+1)*4),v=[];for(let s=0;s<=i;s++){const T=a*(1+1.6*O(900,2200,Math.hypot(n.x[s]-230,n.z[s]-80)))+n.w[s];if(d.set([n.x[s]-n.nx[s]*T,Ze,n.z[s]-n.nz[s]*T,n.x[s]+n.nx[s]*T,Ze,n.z[s]+n.nz[s]*T],s*6),h.set([-1,s*n.step,1,s*n.step],s*4),s<i){const k=s*2;v.push(k,k+1,k+2,k+1,k+3,k+2)}}const A=new o.BufferGeometry;A.setAttribute("position",new o.BufferAttribute(d,3)),A.setAttribute("uv",new o.BufferAttribute(h,2)),A.setIndex(v);const x=new o.ShaderMaterial({side:o.DoubleSide,fog:!0,uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:t.uTime,uInk:{value:m},uPaper:{value:l},uSkyC:t.uSkyC},vertexShader:`
      varying vec2 vUv; varying vec3 vView;
      #include <fog_pars_vertex>
      void main(){ vUv = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.); vView = mvPosition.xyz; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uInk, uPaper, uSkyC; uniform float uTime; varying vec2 vUv; varying vec3 vView;
      #include <fog_pars_fragment>
      ${Ie}
      void main(){
        float x = vUv.x, v = vUv.y;
        float bend = sin(v * .021) * .5 + sin(v * .008 + 1.7) * .4;
        float n1 = vnoise(vec3(x * 2.2 + bend, v * .028 - uTime * .30, 1.));
        float n2 = vnoise(vec3(x * 6.5 + bend * 2., v * .075 - uTime * .62, 7.));
        float n3 = vnoise(vec3(x * 22., v * .26 - uTime * 1.3, 3.));
        vec3 deep = uInk * .26, mid = uInk * .56, pale = mix(uInk, uPaper, .50);
        vec3 col = mix(deep, mid, smoothstep(.47, .50, n1));
        col = mix(col, uInk * .92, smoothstep(.66, .68, n2) * .8);
        float streak = smoothstep(.77, .785, n3) * smoothstep(.44, .50, n2);
        col = mix(col, pale, streak * .85);
        // ink soaking into the paper banks: a pale wavering shore line, then a darker bleed
        float e = 1. - abs(x), wv = .035 * sin(v * .31 + uTime * 1.2) + .02 * sin(v * .83 - uTime * .9);
        col = mix(col, deep, (1. - smoothstep(.10, .22, e + wv)) * .6);
        col = mix(col, pale, 1. - smoothstep(.035, .05, e + wv * .5));
        float fres = pow(1. - abs(dot(normalize(vView), normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz))), 4.);
        col = mix(col, uSkyC * .9, fres * .45);
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),y=new o.Mesh(A,x);return y.frustumCulled=!1,y.name="ink-river",y}function Ft(t,n,m){const l=we(),a=[0,.44,.52],i=[0,.44,-.52],d=[0,-.03,.24],h=[0,-.03,-.24];for(const v of[-1,1]){const A=[v*.25,.3,0];l.tri(a,d,A,v>0?t:n),l.tri(d,h,A,v>0?t:n),l.tri(h,i,A,v>0?t:n),l.tri([v*.045,.27,.2],[v*.045,.27,-.2],[0,.7,0],v>0?n:t),l.tri([v*.1,.012,-.5],[v*.42,.012,-1.55],[v*.2,.012,-1.4],m),l.tri([v*.06,.012,.5],[v*.34,.012,-.3],[v*.24,.012,-.4],m)}return l.geometry()}function st(t,n,m){const l=we();for(const a of[-1,1]){const i=a>0?t:n;l.quad([0,1,-.6],[0,1.05,.5],[a*.2,.62,.5],[a*.2,.6,-.56],i),l.tri([a*.2,.64,.5],[a*.2,.64,.3],[a*.15,0,.44],n),l.tri([a*.2,.62,-.34],[a*.2,.62,-.56],[a*.15,0,-.5],n),l.tri([0,1.05,.38],[a*.13,.72,.5],[0,1.62,.86,0,1],i),l.tri([0,1.62,.86,0,1],[a*.085,1.5,.9,0,1],[0,1.44,1.22,0,1],i),l.tri([a*.07,1.6,.86,0,1],[a*.24,1.8,.78,0,1,a],[a*.05,1.67,.8,0,1],n),l.tri([0,1,-.6],[0,.82,-.72,0,0,1],[a*.05,.95,-.58],t),m&&(l.tri([a*.05,1.63,.84,0,1],[a*.34,2.2,.66,0,1],[a*.11,1.72,.8,0,1],n),l.tri([a*.2,1.9,.76,0,1],[a*.42,2.02,.96,0,1],[a*.25,1.99,.73,0,1],n),l.tri([a*.27,2.05,.7,0,1],[a*.2,2.36,.5,0,1],[a*.31,2.14,.68,0,1],n))}return l.geometry()}function It(t){const n=we(),m=6,l=[[.22,.62,.36],[.46,.84,.27],[.68,1,.17]];for(const[a,i,d]of l)for(let h=0;h<m;h++){const v=h/m*Math.PI*2,A=(h+1)/m*Math.PI*2,x=h%2?.93:1,y=a*a*.02,s=i*i*.03;n.tri([Math.cos(v)*d,a,Math.sin(v)*d,y],[Math.cos(A)*d,a,Math.sin(A)*d,y],[0,i,0,s],t.clone().multiplyScalar(x))}return n.quad([-.03,0,0],[.03,0,0],[.03,.3,0],[-.03,.3,0],t.clone().multiplyScalar(.7)),n.quad([0,0,-.03],[0,0,.03],[0,.3,.03],[0,.3,-.03],t.clone().multiplyScalar(.7)),n.geometry()}function Dt(t){const n=we(),m=12,l=[0,.42,0];for(let a=0;a<m;a++){const i=Math.PI*(-.08+1.16*a/m),d=Math.PI*(-.08+1.16*(a+1)/m),h=a%2?.05:-.05,v=a%2?-.05:.05,A=.58,x=[Math.cos(i)*A,.42+Math.sin(i)*A,h,.03+.03*Math.sin(i)],y=[Math.cos(d)*A,.42+Math.sin(d)*A,v,.03+.03*Math.sin(d)];n.tri(l,x,y,t.clone().multiplyScalar(a%2?.92:1))}return n.quad([-.025,0,0],[.025,0,0],[.025,.44,0],[-.025,.44,0],t.clone().multiplyScalar(.7)),n.geometry()}function qt(t){const n=we(),m=7;for(let l=0;l<m;l++){const a=-.5+l/m,i=a+1/m,d=(a+i)/2,h=d*.5,v=.75+.25*Math.sin(l*2.4);n.tri([a,0,0],[i,0,0],[d+h,v,.12*Math.sin(l*1.7),.1],t.clone().multiplyScalar(l%2?.94:1))}return n.geometry()}function _t(t,n){const m=we(),l=6;for(let a=0;a<l;a++){const i=a/l*Math.PI*2,d=i+.38,h=i-.38,v=.3;m.tri([0,1,0,.12],[Math.cos(h)*v*.6,1.07,Math.sin(h)*v*.6,.13],[Math.cos(i)*v,1.17,Math.sin(i)*v,.15],t.clone().multiplyScalar(.95)),m.tri([0,1,0,.12],[Math.cos(i)*v,1.17,Math.sin(i)*v,.15],[Math.cos(d)*v*.6,1.07,Math.sin(d)*v*.6,.13],t)}return m.tri([-.022,0,0],[.022,0,0],[0,1,0,.12],n),m.tri([0,.3,0,.01],[.26,.52,.05,.04],[.03,.5,0,.03],n),m.geometry()}function Et(t,n){const m=[],l=[],a=[],i=[],d=[],A=(k,F,_,U,G,I,V)=>{m.push(k,F,_),l.push(U.r,U.g,U.b),a.push(...G),i.push(...I),d.push(...V)},x=k=>{for(let F=0;F+1<k.length;F++){const _=k[F],U=k[F+1],G=(I,V,J)=>A(I.x,I.y,V,I.col,J,[I.q[0],V,I.q[2],I.q[3]],I.q2);G(_,-.075,[1,1,0]),G(U,-.075,[0,1,0]),G(U,.075,[0,1,1]),G(_,-.075,[1,1,0]),G(U,.075,[0,1,1]),G(_,.075,[0,1,0])}},y=t.clone().multiplyScalar(.86);x([0,.3,.62,1].map(k=>({x:.012*Math.sin(k*9),y:k,col:y,q:[0,0,0,0],q2:[0,0,0,0]})));const s=[[0,1,.36,-Math.PI/2,1,3.3],[0,.82,.29,0,-1,3],[0,.82,.27,Math.PI,1,3],[0,.55,.21,.2,-1,2.6],[0,.52,.19,Math.PI-.2,1,2.6]];for(const[k,F,_,U,G,I]of s){const V=[];for(let J=0;J<=28;J++){const ge=J/28;V.push({x:k,y:F,col:t.clone().lerp(n,Math.pow(1-ge,2.2)),q:[ge,0,_,U],q2:[G*I*Math.PI*2,k,F,1]})}x(V)}const T=new o.BufferGeometry;return T.setAttribute("position",new o.Float32BufferAttribute(m,3)),T.setAttribute("color",new o.Float32BufferAttribute(l,3)),T.setAttribute("aBary",new o.Float32BufferAttribute(a,3)),T.setAttribute("aQ",new o.Float32BufferAttribute(i,4)),T.setAttribute("aQ2",new o.Float32BufferAttribute(d,4)),T.userData.tris=m.length/9,T}function Gt(t,n,m,l,a){const i=Mt(),d=new o.InstancedBufferGeometry;d.setAttribute("position",new o.Float32BufferAttribute(i.P,3)),d.setAttribute("aWing",new o.Float32BufferAttribute(i.W,3));const h=[],v=[],A=[];for(const s of m)for(let T=0;T<s.count;T++)h.push(s.center[0],s.center[1],s.center[2]),v.push(s.rx,s.rz,s.speed,s.phase+(s.stream?T/s.count*Math.PI*2:t.gauss()*.16)),A.push(t.gauss()*s.spread,t.gauss()*s.spread*.4,t.gauss()*s.spread,t()+(t.chance(.08)?2:0)+(s.size>1.9?4:0));d.setAttribute("iC",new o.InstancedBufferAttribute(new Float32Array(h),3)),d.setAttribute("iR",new o.InstancedBufferAttribute(new Float32Array(v),4)),d.setAttribute("iO",new o.InstancedBufferAttribute(new Float32Array(A),4)),d.instanceCount=h.length/3;const x=new o.ShaderMaterial({side:o.DoubleSide,fog:!0,uniforms:{...o.UniformsUtils.clone(o.UniformsLib.fog),uTime:n.uTime,uCloudT:n.uTime,uLightDir:n.uLightDir,uSun:n.uSun,uAmbSky:n.uAmbSky,uAmbShade:n.uAmbShade,uWarm:n.uWarm,uPaper:{value:l},uRed:{value:a}},vertexShader:`
      attribute vec3 aWing, iC; attribute vec4 iR, iO; uniform float uTime;
      varying vec3 vView; varying float vRed, vShade;
      #include <fog_pars_vertex>
      vec2 rot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
      vec3 loop(float a, float sd){ float amp = min(1., iR.x / 60.); return iC + vec3(cos(a) * iR.x, (sin(a * 2. + sd * 6.) * 7. + sin(a * 3. + sd) * 3.) * amp, sin(a) * iR.y) + iO.xyz; }
      void main(){
        float rnd = fract(iO.w), flag = floor(iO.w + .001), big = step(3.5, flag);
        float a = iR.w + uTime * iR.z;
        vec3 q0 = loop(a, rnd), q1 = loop(a + .01 * sign(iR.z), rnd);
        vec3 fwd = normalize(q1 - q0), right = normalize(cross(vec3(0., 1., 0.), fwd)), up = cross(fwd, right);
        float fl = uTime * (5.5 + rnd * 2.5) + rnd * 50.;
        float glide = smoothstep(.55, .9, sin(uTime * .31 + rnd * 40.));
        float a1 = mix(.12 + .78 * sin(fl), .32, glide), a2 = mix(.5 * sin(fl - 1.1), .08, glide);
        vec3 p = position;
        if (aWing.y > .5) {
          float s = aWing.x; vec2 root = vec2(s * .12, .12), mid = vec2(s * .85, .2), q = p.xy;
          if (aWing.y > 1.5) q = mid + rot(q - mid, s * a2);
          p.xy = root + rot(q - root, s * a1);
        }
        float camD = length((viewMatrix * vec4(q0, 1.)).xyz);
        p *= mix(2.3, 3.4, big) * (.8 + .45 * fract(rnd * 7.31)) * smoothstep(7., 22., camD);
        vec4 mvPosition = viewMatrix * vec4(q0 + right * p.x + up * p.y + fwd * p.z, 1.);
        vView = mvPosition.xyz; vRed = step(1.5, mod(flag, 4.)); vShade = aWing.z;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uRed, uPaper; varying vec3 vView; varying float vRed, vShade;
      #include <fog_pars_fragment>
      ${Xe}
      void main(){ vec3 n; gl_FragColor = vec4(paperLight(mix(uPaper, uRed, vRed) * vShade * .82, vView, 1., 1., n), 1.);
        #include <fog_fragment>
      }`}),y=new o.Mesh(d,x);return y.frustumCulled=!1,y.name="paper-wild-cranes",y}const Nt=[{name:"noon",sky:[.725,.595,.4],ink:"#1f3fa8",sun:[1.19,.97,.67],amb:[.24,.25,.37],shade:[.13,.14,.34],el:.72,sunEl:.15,disc:[.64,.085,.06],tint:"#fff1dc",warm:0},{name:"evening",sky:[.745,.495,.335],ink:"#34268e",sun:[1.24,.865,.54],amb:[.23,.22,.37],shade:[.14,.125,.36],el:.38,sunEl:.115,disc:[.66,.07,.045],tint:"#ffe6cc",warm:.5},{name:"morning",sky:[.7,.635,.475],ink:"#15509a",sun:[1.145,.995,.735],amb:[.25,.265,.385],shade:[.14,.16,.35],el:.82,sunEl:.17,disc:[.76,.25,.22],tint:"#fff4e0",warm:-.3}];var Ut={id:"paper-kingdom",name:"The Paper Kingdom",category:"bizarre",weirdness:.8,async build(t){const n=t.rng,m=t.noise,l=new o.Scene,a=(e,r,c)=>new o.Vector3(e,r,c),i=n.pick(Nt),d=n(),h=d<.16,v=!h&&d<.32,A=zt.slice();A[5]=i.ink,h&&(A[6]="#e8481f");const x=A.map(e=>new o.Color(e)),y=new o.Color(1,1,1),s=(e,r,c)=>e.clone().lerp(r,c),T=new o.Color("#e9a92c"),k=x[0].clone(),F=x[6],_=x[5],U=i.el+n.range(-.05,.05),G=a(-.6,U,.4+n.range(-.12,.12)).normalize(),I=new o.Color(i.sky[0],i.sky[1],i.sky[2]),V=n.range(.7,1.5),J=n.pick([350,600,600,1e3,1500]),ge=()=>n.range(-7,7),H=e=>n.range(-e,e),ae=[560+ge(),35,62+ge()],qe=[-820,410+H(50)],ze=Math.atan2(qe[1]-ae[2],qe[0]-ae[0]),ie=ze-.03+H(.012),ct=a(Math.cos(ze),i.sunEl+n.range(-.01,.015),Math.sin(ze)).normalize(),Q=[ae,[ae[0]+Math.cos(ie)*68,34,ae[2]+Math.sin(ie)*68],[440,36,130],[385,16,166],[322,19,186],[252,27,176]],He=[ae[0]+Math.cos(ie)*150,ae[2]+Math.sin(ie)*150],$e=(e,r)=>15*Math.exp(-((e-He[0])**2+(r-He[1])**2)/5600),lt=At.map(e=>a(e[0],e[1],e[2])),N=bt([...Q,...lt]);await t.yield();const _e=(e,r)=>N.nearestXZ(e,r).u,Ee=_e(152,124),me=_e(18,84),Ye=Ee*N.length,Ke=150,Ce=20,Je=.9,ut=e=>{const r=e*N.length-Ye;return r+Ke+Je*Math.max(0,r-Ce)},ft=e=>{const r=e-Ke;return(Ye+(r>Ce?Ce+(r-Ce)/(1+Je):r))/N.length},dt=(e,r,c=22)=>{const b=N.nearestXZ(e,r);return b.u<me+.004&&b.dist<c?b.y-9+Math.max(0,b.dist-8)*.9:1e9},W=await St(t,{palette:A,lightDir:[G.x,G.y,G.z],cranes:n.int(850,1100),holeFill:!1,confetti:1200,ceiling:dt,craneAccent:h?"#e9a92c":null});W.uniforms.uSun.value.setRGB(...i.sun),W.uniforms.uAmbSky.value.setRGB(...i.amb),W.uniforms.uAmbShade.value.setRGB(...i.shade),l.add(W.object);const et=W.anchors,tt=ft(et.tower.wave),mt=_e(0,-44);await t.yield();const pt=new o.Color(x[0].r*(.85*i.amb[0]+.065),x[0].g*(.85*i.amb[1]+.065),x[0].b*(.85*i.amb[2]+.095)).multiplyScalar(.92),Y={uTime:{value:0},uU:{value:0},uWind:{value:V},uSkyC:{value:I},uShadowCol:{value:pt},uLightDir:W.uniforms.uLightDir,uSun:W.uniforms.uSun,uAmbSky:W.uniforms.uAmbSky,uAmbShade:W.uniforms.uAmbShade,uWarm:W.uniforms.uWarm},xe=[[1900,-480],[1350,-330+H(60)],[950,-150+H(40)],[730,-30+H(14)],[Q[0][0]-Math.cos(ie)*4,Q[0][2]-Math.sin(ie)*4],[Q[1][0],Q[1][2]],[Q[0][0]+Math.cos(ie)*132,Q[0][2]+Math.sin(ie)*132],[398,158],[352,232],[300+H(10),294],[208,340+H(10)],[70,356+H(14)],[-110,340+H(20)],[-300,304+H(30)],[-540,330+H(40)],qe,[-1250,450+H(80)],[-1900,560]],nt=new o.CatmullRomCurve3(xe.map(e=>a(e[0],0,e[1])),!1,"centripetal"),j=440,Te=nt.getSpacedPoints(j),D={n:j,x:new Float32Array(j+1),z:new Float32Array(j+1),nx:new Float32Array(j+1),nz:new Float32Array(j+1),step:nt.getLength()/j};for(let e=0;e<=j;e++){const r=Te[Math.max(0,e-1)],c=Te[Math.min(j,e+1)],b=c.x-r.x,w=c.z-r.z,p=Math.hypot(b,w)||1;D.x[e]=Te[e].x,D.z[e]=Te[e].z,D.nx[e]=-w/p,D.nz[e]=b/p}D.w=new Float32Array(j+1);for(let e=0;e<=j;e++)D.w[e]=$e(D.x[e],D.z[e]);const $=(e,r)=>{let c=1e12,b=0;for(let w=0;w<=j;w++){const p=D.x[w]-e,C=D.z[w]-r,g=p*p+C*C;g<c&&(c=g,b=w)}return $.i=b,Math.sqrt(c)};$(xe[4][0],xe[4][1]);const vt=$.i;$(xe[6][0],xe[6][1]);const ht=$.i,at=n.range(.13,.17),Ge=N.pointAt(at),ee=N.tangentAt(at);ee.y=0,ee.normalize();const ot=n.chance(.75)?1:-.9,pe=a(-ee.z,0,ee.x).multiplyScalar(Math.sign(ot)),se={x:Ge.x+pe.x*80,z:Ge.z+pe.z*80,top:Ge.y+(ot>0?4:-10)},Ne=230,Le=80;let ce=0;const K=(e,r)=>{const c=$(e,r)-$e(e,r);ce=c;const b=Math.max(Math.abs(e)-156,Math.abs(r)-158),w=Math.min(c-22,b-10),p=O(50,560,w),C=O(8,170,w);let g=1.2+(m.fbm2(e*.02,r*.02,2)*.5+.5)*1.6;if(g+=C*(m.fbm2(e*.0085+3,r*.0085,3)*.5+.5)*36,p>0){const te=m.ridged2(e*.0015+7,r*.0015-3,3);g+=Math.pow(p,1.25)*(30+430*Math.pow(te,1.4))}const z=e-se.x,P=r-se.z,u=z*pe.x+P*pe.z,f=z*ee.x+P*ee.z,S=Math.exp(-(u/19)*(u/19))*O(78,30,Math.abs(f));S>.003&&(g=de(g,Math.max(g,se.top+3*Math.sin(f*.09)),S));const M=e-ae[0],q=r-ae[2],X=Math.hypot(M,q);if(X>200){let te=Math.atan2(q,M)-ze;te=Math.atan2(Math.sin(te),Math.cos(te));const fe=34+X*.028+900*O(.07,.26,Math.abs(te));g>fe&&(g=fe)}const L=N.nearestXZ(e,r),Z=L.y-11+Math.max(0,L.dist-12)*.75;g>Z&&(g=Z);const ue=17+70*O(650,1700,Math.hypot(e-Ne,r-Le));return c<ue+16&&(g=de(-5,g,O(ue,ue+16,c))),b<14&&(g=de(-.4,g,O(0,14,b))),g},yt=(e,r,c)=>c.set(K(e-2,r)-K(e+2,r),4,K(e,r-2)-K(e,r+2)).normalize(),ve=De(Y,{CREASE:""});{const c=B=>B*(900+1700*Math.pow(B,6)),b=new Float32Array(31329),w=new Float32Array(31329),p=new Float32Array(31329),C=new Float32Array(31329),g=n.fork("terrain");for(let B=0;B<=176;B++){for(let E=0;E<=176;E++){const R=E===0||B===0||E===176||B===176?0:.62,oe=Ne+c(-1+2*(E+(g()-.5)*R)/176),re=Le+c(-1+2*(B+(g()-.5)*R)/176),ne=B*177+E;b[ne]=oe,p[ne]=re,w[ne]=K(oe,re),C[ne]=ce}(B<8||B%6===5)&&await t.yield()}const z=30976*2,P=new Float32Array(z*9),u=new Float32Array(z*9),f=new Float32Array(z*9),S=x[0].clone(),M=s(x[0],x[1],.55),q=s(x[1],x[2],.6),X=s(x[0],y,.7),L=new o.Color;let Z=0;const ue=(B,E,R)=>{const oe=(w[B]+w[E]+w[R])/3,re=(C[B]+C[E]+C[R])/3,ne=Math.max(w[B],w[E],w[R])-Math.min(w[B],w[E],w[R]);L.copy(S).lerp(M,1-O(3,12,oe)).lerp(X,O(200,330,oe)).lerp(q,(1-O(26,44,re))*.8),L.multiplyScalar(1+(g()-.5)*.08-.05*O(4,30,ne)),g()<.07&&(L.r*=.93,L.g*=.93),te(B,0),te(E,1),te(R,2)},te=(B,E)=>{P[Z]=b[B],P[Z+1]=w[B],P[Z+2]=p[B],u[Z]=L.r,u[Z+1]=L.g,u[Z+2]=L.b,f[Z+E]=1,Z+=3};await t.yield();for(let B=0;B<176;B++){for(let E=0;E<176;E++){const R=B*177+E,oe=R+1,re=R+177,ne=re+1;g()<.5?(ue(R,re,oe),ue(oe,re,ne)):(ue(R,re,ne),ue(R,ne,oe))}(B<4||(B&7)===7)&&await t.yield()}const fe=new o.BufferGeometry;fe.setAttribute("position",new o.BufferAttribute(P,3)),fe.setAttribute("color",new o.BufferAttribute(u,3)),fe.setAttribute("aBary",new o.BufferAttribute(f,3));const je=new o.Mesh(fe,ve);je.frustumCulled=!1,je.name="paper-land",l.add(je)}await t.yield(),l.add(Pt(Y,D,_,k,19)),await t.yield(),l.add(Tt(Y,I,ct,new o.Color(i.disc[0],i.disc[1],i.disc[2]),new o.Color(1,.72,.36))),l.add(kt(n.fork("clouds"),Y,I,[s(I,y,.72),s(I,y,.42),I.clone().multiplyScalar(1.1)])),l.fog=new o.FogExp2(I.clone().multiplyScalar(1.04),4e-4),l.background=I.clone(),await t.yield();const he=new o.Matrix4,We=new o.Quaternion,ke=new o.Euler,Re=a(1,1,1),Be=a(0,0,0),Lt=a(0,1,0),le=(e,r,c,b)=>{const w=new o.InstancedMesh(e,r,Math.max(1,c.length));return w.count=c.length,c.forEach((p,C)=>{he.compose(Be.set(p.x,p.y,p.z),We.setFromEuler(ke.set(p.tilt||0,p.yaw||0,0,"YXZ")),Re.set(p.s,p.sy||p.s,p.s)),w.setMatrixAt(C,he),w.setColorAt(C,p.col)}),w.frustumCulled=!1,w.name=b,l.add(w),w},be=(e,r,c)=>Math.abs(e)<156+c&&Math.abs(r)<158+c,Oe=a(0,0,0),Se=a(0,0,0),ye=(e,r)=>(N.pointAt(e,Oe),N.tangentAt(e,Se),Se.y=0,Se.normalize(),{x:Oe.x-Se.z*r,z:Oe.z+Se.x*r}),Ue=e=>{const r=e();return r<.45?k.clone():r<.8?s(x[0],y,.1):x[1].clone()},Pe=a(0,1,0),Fe=()=>{},Me=(e,r,c,b,w)=>{const p=[];if(c.forEach((P,u)=>{N.nearestXZ(P.x,P.z).dist<150&&p.push(u)}),!p.length)return;const C=e.clone(),g=new Float32Array(p.length*3),z=new o.InstancedMesh(C,Ct(Y,r),p.length);p.forEach((P,u)=>{const f=c[P];he.compose(Be.set(f.x,f.y,f.z),We.setFromEuler(ke.set(f.tilt||0,f.yaw||0,0,"YXZ")),Re.set(f.s,f.sy||f.s,f.s)),z.setMatrixAt(u,he),yt(f.x,f.z,Pe),g[u*3]=Pe.x,g[u*3+1]=Pe.y,g[u*3+2]=Pe.z}),C.setAttribute("aGn",new o.InstancedBufferAttribute(g,3)),w&&C.setAttribute("aU",new o.InstancedBufferAttribute(new Float32Array(p.map(P=>w[P])),1)),z.frustumCulled=!1,z.renderOrder=1,z.name=b,l.add(z)};{const e=n.fork("forest"),r=[],c=[],b=(p,C,g)=>{const z=ye(p,C);if(be(z.x,z.z,18))return;const P=K(z.x,z.z);if(ce<36)return;const u=N.nearestXZ(z.x,z.z);if(u.dist<10+.62*g||ce<52&&$.i>=vt&&$.i<=ht)return;for(const M of r)if(Math.hypot(M.x-z.x,M.z-z.z)<(M.s+g)*.33)return;const f=ye(Math.max(0,u.u-.07),0),S=Math.atan2(z.x-f.x,z.z-f.z)+(e.chance(.5)?1:-1)*e.range(.4,.95);r.push({x:z.x,y:P-.3,z:z.z,s:g,yaw:S,col:e.chance(.05)?s(F,y,.16):Ue(e)}),c.push(u.u),Fe(z.x,P,z.z,g*.4)};for(let p=0;p<520;p++){const C=e.chance(.5)?1:-1,g=C*(14+110*Math.pow(e(),1.3));b(e.range(.265,.6),g,e.range(15,27)+Math.abs(g)*.1),(p&63)===63&&await t.yield()}for(let p=0;p<60;p++)b(e.range(.02,.26),(e.chance(.5)?1:-1)*e.range(42,140),e.range(13,22));const w=Et(y,v?s(_,y,.18):s(x[2],x[1],.7));await t.yield(),Me(w,{QUILL:""},r,"quill-shadows",c),await t.yield(),w.setAttribute("aU",new o.InstancedBufferAttribute(new Float32Array(c),1)),le(w,De(Y,{CREASE:"",QUILL:""}),r,"quilled-forest")}await t.yield();{const e=n.fork("flora"),r=[],c=[],b=[],w=[],p=(u,f)=>{if(e.chance(.045))return v&&e.chance(.5)?s(_,y,.3):h&&e.chance(.4)?T.clone():s(F,y,.12);const S=Ue(e),M=Math.abs(Math.sin(u*12.9898+f*78.233)*43758.5453)%1;return M<.037?s(F,y,.12):M<.068?s(_,y,.25):S},C=(u,f,S)=>{if(be(u,f,12))return;const M=K(u,f);if(ce<32)return;const q=N.nearestXZ(u,f);if(q.dist<10+.6*S)return;const X=ye(Math.max(0,q.u-.05),0);r.push({x:u,y:M-.2,z:f,s:S,yaw:Math.atan2(X.x-u,X.z-f)+e.range(-.5,.5),col:p(u,f)}),Fe(u,M,f,S*.3)};for(let u=0;u<90;u++){const f=e()*4,S=e.range(14,70),M=Math.floor(f),q=(f-M)*2-1,X=M===0?156+S:M===1?-156-S:q*(156+S),L=M===2?158+S:M===3?-158-S:q*(158+S);C(X,L,e.range(9,19))}await t.yield();for(let u=0;u<130;u++){const f=ye(e.range(.03,.66),(e.chance(.5)?1:-1)*e.range(18,130));C(f.x,f.z,e.range(8,16))}for(let u=0;u<1100;u++){(u&127)===127&&await t.yield();const f=Ne+e.range(-780,700),S=Le+e.range(-720,660);if(be(f,S,12)||m.n2(f*.006+40,S*.006)<-.12)continue;const M=K(f,S);if(ce<30||M>150)continue;const q=e.range(7,16);N.nearestXZ(f,S).dist<12+.4*q||(c.push({x:f,y:M-.3,z:S,s:q,sy:q*e.range(1.15,1.8),yaw:e()*6.28,col:p(f,S)}),Fe(f,M,S,q*.34))}await t.yield();const g=(u,f)=>{if(be(u,f,3))return;const S=K(u,f);if(ce<22)return;const M=e.range(2.4,5);b.push({x:u,y:S-.1,z:f,s:M,sy:M*e.range(.7,1.4),yaw:e()*6.28,tilt:e.range(-.2,.2),col:e.chance(.025)?F.clone():Ue(e)})};for(let u=0;u<3e3;u++){const f=ye(e.range(0,.7),(e.chance(.5)?1:-1)*(4+90*Math.pow(e(),1.6)));g(f.x,f.z),(u&255)===255&&await t.yield()}for(let u=0;u<700;u++){const f=e()*4,S=e.range(3,46),M=Math.floor(f),q=(f-M)*2-1;g(M===0?156+S:M===1?-156-S:q*(156+S),M===2?158+S:M===3?-158-S:q*(158+S)),(u&255)===255&&await t.yield()}await t.yield();for(let u=0;u<420;u++){const f=ye(e.range(.06,.68),(e.chance(.5)?1:-1)*e.range(7,64));if(be(f.x,f.z,4))continue;const S=K(f.x,f.z);if(ce<24)continue;const M=e();w.push({x:f.x,y:S-.1,z:f.z,s:e.range(3.4,7),yaw:e()*6.28,tilt:e.range(-.12,.12),col:M<.3?s(F,y,.1):h&&M<.52?T.clone():M<.92?k.clone():s(_,y,.3)})}await t.yield();const z=Dt(y),P=It(y);Me(z,{},r,"fan-shadows"),Me(P,{},c,"cone-shadows"),await t.yield(),le(z,ve,r,"paper-fans"),le(P,ve,c,"paper-cones"),await t.yield(),le(qt(y),ve,b,"paper-fringe"),le(_t(y,s(x[3],y,.35)),ve,w,"paper-flowers")}await t.yield();const wt=a(se.x,se.top+6,se.z);{const e=n.fork("deer"),r=e.int(5,7),c=[],b=[],w=e.range(13,17),p=s(x[3],x[4],e.range(.1,.4)),C=Math.atan2(ee.x,ee.z);for(let u=0;u<r;u++){const f=(u-(r-1)/2)*w+e.range(-3,3),S=e.range(-2.5,2.5),M=se.x+ee.x*f+pe.x*S,q=se.z+ee.z*f+pe.z*S,X=K(M,q),L=u===r-1?e.range(4.2,5):e.range(6.4,8.2),Z={x:M,y:X-.15,z:q,s:L,yaw:C+(e.chance(.3)?Math.PI:0)+e.range(-.5,.5),col:y.clone()};(u===1||u===r-2&&e.chance(.5)?c:b).push(Z),Fe(M,X,q,L*.55)}const g=De(Y,{CREASE:"",DEER:""}),z=st(p,p.clone().multiplyScalar(.72),!0),P=st(p,p.clone().multiplyScalar(.72),!1);Me(z,{DEER:""},c,"stag-shadows"),Me(P,{DEER:""},b,"doe-shadows"),le(z,g,c,"paper-stags"),le(P,g,b,"paper-does")}$(770,-40);const rt=$.i*D.step;$(-200,338);const gt=$.i*D.step,Ve=gt-rt,Qe=n.int(9,14),Ae=[];{const e=n.fork("boats"),r=[];for(let c=0;c<Qe;c++)Ae.push({off:(c+e.range(.1,.9))/Qe*Ve,speed:e.range(3,5.6),lat:e.range(-9,9),s:e.range(13,18),ph:e()*20}),r.push({x:0,y:-50,z:0,s:1,col:c%5===2?s(F,y,.06):c%7===4?s(_,y,.3):k.clone()});Ae.mesh=le(Ft(y,y.clone().multiplyScalar(.9),s(_,y,.6)),ve,r,"paper-boats")}const it=e=>{for(let r=0;r<Qe;r++){const c=Ae[r],b=(c.off+e*c.speed)%Ve,w=(rt+b)/D.step,p=Math.min(j-1,Math.floor(w)),C=w-p,g=de(D.nx[p],D.nx[p+1],C),z=de(D.nz[p],D.nz[p+1],C),P=O(0,60,b)*O(0,60,Ve-b),u=c.s*P;Be.set(de(D.x[p],D.x[p+1],C)+g*c.lat,Ze-.02*c.s+Math.sin(e*1.3+c.ph)*.15,de(D.z[p],D.z[p+1],C)+z*c.lat),ke.set(Math.sin(e*.8+c.ph*2)*.05,Math.atan2(z,-g)+Math.sin(e*.3+c.ph)*.12,Math.sin(e*1.1+c.ph)*.07,"YXZ"),he.compose(Be,We.setFromEuler(ke),Re.set(u,u,u)),Ae.mesh.setMatrixAt(r,he)}Ae.mesh.instanceMatrix.needsUpdate=!0};it(0);{const e=n.fork("wild"),r=e.chance(.5)?1:-1,c=[{center:[Q[3][0]-30,42,Q[3][2]+24],rx:112,rz:70,speed:.11*r,phase:e()*6.28,count:e.int(14,26),spread:9,size:1.7},{center:[-260,150,520],rx:330,rz:180,speed:-.05*r,phase:e()*6.28,count:e.int(24,40),spread:24,size:2.6},{center:[Q[1][0]-50,98,Q[1][2]-110],rx:110,rz:70,speed:-.09*r,phase:e()*6.28,count:e.int(9,18),spread:8,size:1.7}];c.push({center:[Q[2][0]+20,66,Q[2][2]+6],rx:92,rz:58,speed:.1*r,phase:e()*6.28,count:e.int(8,16),spread:7,size:1.7}),c.push({center:[150,72,140],rx:150,rz:100,speed:.075*r,phase:e()*6.28,count:e.int(36,50),spread:4,size:2.6,stream:!0}),c.push({center:[0,37,30],rx:22,rz:125,speed:.12*r,phase:e()*6.28,count:40,spread:2.2,size:1.7,stream:!0});const b=n.fork("scraps"),w=n.fork("wild-mirror");c.push({center:[0,38.5,-28],rx:15,rz:97,speed:-.12*r,phase:w()*6.28,count:36,spread:2,size:1.7,stream:!0}),l.add(Gt(e,Y,c,k,h?T:F)),l.add(Bt(b,Y,J,[k,F,s(_,y,.2)]))}await t.yield();const xt=et.portalSeat.position.clone();return{scene:l,path:N,duration:48,style:"none",camera:{fov:62,near:.5,far:4400,lookAhead:26,sway:.6,bank:.4},pois:[{at:wt,from:.04,to:.2,weight:.3},{at:a(40,18,60),from:.33,to:Ee-.08,weight:.45},{at:a(0,14,60),from:Ee-.08,to:me-.13,weight:.45},{at:a(-15,42,-60),from:me-.15,to:me+.03,weight:.6},{at:xt,from:me+.01,to:me+.16,weight:.5}],portal:{shape:"circle",radius:7.5,color:"#ffe2b0",glow:1.1,revealDistance:300},post:{exposure:1.06,bloom:{strength:.42,radius:.6,threshold:1.08},grade:{saturation:1.06,contrast:1.05,tint:i.tint,shadowTint:"#141226",vignette:.3,grain:.035,aberration:0}},update(e,r,c,b){Y.uTime.value=r,Y.uU.value=b,W.update(e,r,c),W.setWave(ut(b)),W.setCranes((b-tt)/(mt-tt)),it(r)},dispose(){W.dispose()}}}};export{Ut as default};
