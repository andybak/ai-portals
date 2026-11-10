import*as f from"three";import{clamp as at,lerp as et,smoothstep as rt}from"../kit/core.js";const yt=["#2b3f8f","#8a6fb5","#ff9e6b","#ffd9a8","#f7efe6","#5a4a78","#ff4f3a"],c=(o,u,t)=>new f.Vector3(o,u,t),it=`
vec3 bobOff(vec2 b, float t){
  return vec3(sin(t*0.23+b.x*1.7)*0.5, sin(t*0.31+b.x), cos(t*0.19+b.x*2.3)*0.5)*b.y;
}
// staggered burner timer: x = phase within the cycle; flame is short, the envelope glow lingers
float flareX(float seed, float t){ float per = 9.0 + 6.0*fract(seed*7.31); return fract(t/per + seed); }
float flameOf(float x){ return smoothstep(0.0,0.03,x)*(1.0-smoothstep(0.17,0.21,x)); }
float glowOf(float x){ return smoothstep(0.0,0.07,x)*(1.0-smoothstep(0.2,0.46,x)); }
`,st=`
uniform vec3 uSunDir, uSunCol; uniform float uSunOn;
void sunLight(out vec3 L, out vec3 col){
  #if NUM_DIR_LIGHTS > 0
    L = directionalLights[0].direction; col = directionalLights[0].color;
  #else
    L = vec3(0.0,1.0,0.0); col = vec3(0.0);
  #endif
  if (uSunOn > 0.5) { L = normalize((viewMatrix*vec4(uSunDir, 0.0)).xyz); col = uSunCol; }
}
vec3 skyLight(vec3 n){
  vec3 irr = ambientLightColor;
  #if NUM_HEMI_LIGHTS > 0
    for (int i = 0; i < NUM_HEMI_LIGHTS; i++) irr += getHemisphereLightIrradiance(hemisphereLights[i], n);
  #endif
  return irr;
}
float hash1(float n){ return fract(sin(n*127.1)*43758.5453); }
float hash2(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x), mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x), f.y); }
float tri(float x){ return abs(fract(x)-0.5)*2.0; }
`;function lt(o){const u=[],t=[],e=[],m=[],d=[],i=[],b=[],l={m:null,nm:new f.Matrix3,bob:[0,0,0,0],t:0},p=new f.Vector3;function M(s,h,y,n,a,r,z,w,L,D,F,R,A=0){return l.m&&(p.set(s,h,y).applyMatrix4(l.m),s=p.x,h=p.y,y=p.z,p.set(n,a,r).applyMatrix3(l.nm).normalize(),n=p.x,a=p.y,r=p.z),u.push(s,h,y),t.push(n,a,r),e.push(z,w,L),m.push(D,F),d.push(R,A||l.t),i.push(l.bob[0],l.bob[1],l.bob[2],l.bob[3]),u.length/3-1}function v(s,h,y){for(let n=0;n<h;n++)for(let a=0;a<y;a++){const r=s+n*(y+1)+a,z=r+1,w=r+y+1,L=w+1;b.push(r,w,z,z,w,L)}}const I=new f.Vector3,C=new f.Vector3,S=new f.Vector3,g=new f.Vector3,P=new f.Quaternion,x=new f.Vector3;function k(s,h,y,n,a,r={}){const z=s.length,w=u.length/3;let L=0;const D=1+(r.jit??.1)*(o()-.5)*2;for(let F=0;F<z;F++){const R=r.closed?s[F===0?z-2:F-1]:s[Math.max(F-1,0)],A=r.closed?s[F===z-1?1:F+1]:s[Math.min(F+1,z-1)];I.subVectors(A,R).normalize(),F===0?(x.set(0,1,0),Math.abs(I.y)>.9&&x.set(1,0,0),C.crossVectors(I,x).normalize()):(P.setFromUnitVectors(g,I),C.applyQuaternion(P).normalize(),L+=s[F].distanceTo(s[F-1])),S.crossVectors(I,C),g.copy(I);const B=F/(z-1),E=typeof h=="function"?h(B):h,U=r.t?r.t(B):0,j=s[F],q=r.col2?et(n.r,r.col2.r,B):n.r,H=r.col2?et(n.g,r.col2.g,B):n.g,_=r.col2?et(n.b,r.col2.b,B):n.b;for(let N=0;N<=y;N++){const Q=N/y*Math.PI*2+(r.rot||0),G=Math.cos(Q),$=Math.sin(Q),O=C.x*G+S.x*$,Y=C.y*G+S.y*$,W=C.z*G+S.z*$;M(j.x+O*E,j.y+Y*E,j.z+W*E,O,Y,W,q*D,H*D,_*D,N/y*(r.uRep||1),L,a,U)}}if(v(w,z-1,y),r.cap)for(const F of[0,z-1]){const R=s[F],A=F===0?-1:1;I.subVectors(s[Math.min(F+1,z-1)],s[Math.max(F-1,0)]).normalize();const B=M(R.x,R.y,R.z,I.x*A,I.y*A,I.z*A,n.r*D,n.g*D,n.b*D,.5,0,a,r.t?r.t(F?1:0):0),E=w+F*(y+1);for(let U=0;U<y;U++)b.push(B,E+U,E+U+1)}}function V(s,h,y,n,a={}){const r=u.length/3,z=a.cx||0,w=a.cz||0;let L=0;const D=1+(a.jit??.08)*(o()-.5)*2;for(let F=0;F<s.length;F++){const R=s[F],A=s[Math.max(F-1,0)],B=s[Math.min(F+1,s.length-1)],E=2/(R.n||2),U=Math.max(R.a,.001),j=Math.max(R.b??R.a,.001),q=B.y-A.y,H=B.a-A.a,_=Math.hypot(q,H)||1,N=q/_,Q=-H/_;F>0&&(L+=Math.hypot(R.y-A.y,R.a-A.a));const G=R.col||y,$=a.uLen??Math.PI*(U+j);for(let O=0;O<=h;O++){const Y=O/h*Math.PI*2,W=Math.cos(Y),J=Math.sin(Y),ht=U*Math.sign(W)*Math.abs(W)**E,ot=j*Math.sign(J)*Math.abs(J)**E;let tt=Math.sign(W)*Math.abs(W)**(2-E)/U,nt=Math.sign(J)*Math.abs(J)**(2-E)/j;const Mt=Math.hypot(tt,nt)||1;tt=tt/Mt*N,nt=nt/Mt*N,M(z+ht,R.y,w+ot,tt,Q,nt,G.r*D,G.g*D,G.b*D,O/h*$,L,n,0)}}v(r,s.length-1,h)}function T(s,h,y,n,a,r=0){const z=[];for(let w=0;w<=6;w++){const L=w/6,D=Math.sin(L*Math.PI)**(.75+r*(1-L));z.push({y:(L-.5)*h,a:s*D})}V(z,y,n,a)}return{st:l,tube:k,loft:V,blob:T,vert:M,grid:v,I:b,setM(s){l.m=s,s&&l.nm.getNormalMatrix(s)},setBob(s,h){l.bob=[s[0],s[1],(h||s)[0],(h||s)[1]]},tris:()=>b.length/3,geometry(s=!0){const h=new f.BufferGeometry;return h.setAttribute("position",new f.Float32BufferAttribute(u,3)),h.setAttribute("normal",new f.Float32BufferAttribute(t,3)),h.setAttribute("color",new f.Float32BufferAttribute(e,3)),h.setAttribute("uv",new f.Float32BufferAttribute(m,2)),h.setAttribute("aMT",new f.Float32BufferAttribute(d,2)),s&&h.setAttribute("aBob",new f.Float32BufferAttribute(i,4)),h.setIndex(b),h}}}function pt(o,u,t,e){const m=[];for(let d=0;d<=e;d++){const i=d/e,b=c().lerpVectors(o,u,i);b.y-=t*4*i*(1-i),m.push(b)}return m}function ct(o,u,t,e,m={}){const d=m.rmax??.39,i=m.mouth??.09,b=m.s0??.6,l=m.bulge??.028,p=m.fat??1.15,M=[];for(let x=0;x<u;x++){const k=x/u;M.push([i+(d-i)*Math.sin(k*Math.PI/2)**p,k*b])}for(let x=0;x<=t;x++){const k=x/t*Math.PI/2;M.push([Math.max(d*Math.cos(k),.0015),b+(1-b)*Math.sin(k)])}const v=M.length,I=[],C=[],S=[];for(let x=0;x<v;x++){const[k,V]=M[x],T=Math.sin(Math.PI*at(V*1.02,0,1))**.6;for(let s=0;s<=o;s++){const h=s/o,y=h*Math.PI*2,n=h*e%1,a=1-(2*n-1)**2,r=k*(1+l*T*(a-.6));I.push(Math.cos(y)*r,V,Math.sin(y)*r),C.push(h,V)}}for(let x=0;x<v-1;x++)for(let k=0;k<o;k++){const V=x*(o+1)+k,T=V+1,s=V+o+1,h=s+1;S.push(V,s,T,T,s,h)}const g=new f.BufferGeometry;g.setAttribute("position",new f.Float32BufferAttribute(I,3)),g.setAttribute("uv",new f.Float32BufferAttribute(C,2)),g.setIndex(S),g.computeVertexNormals();const P=g.attributes.normal;for(let x=0;x<v;x++){const k=x*(o+1),V=k+o,T=P.getX(k)+P.getX(V),s=P.getY(k)+P.getY(V),h=P.getZ(k)+P.getZ(V),y=Math.hypot(T,s,h)||1;P.setXYZ(k,T/y,s/y,h/y),P.setXYZ(V,T/y,s/y,h/y)}return g}function ut(o,u,t){const e=t.length,m=new f.InstancedMesh(o,u,e),d=new Float32Array(e*3),i=new Float32Array(e*3),b=new Float32Array(e*3),l=new Float32Array(e*4),p=new Float32Array(e*4),M=new f.Matrix4;return t.forEach((v,I)=>{M.makeScale(v.h,v.h,v.h).setPosition(v.pos),m.setMatrixAt(I,M),d.set([v.colA.r,v.colA.g,v.colA.b],I*3),i.set([v.colB.r,v.colB.g,v.colB.b],I*3),b.set([v.colC.r,v.colC.g,v.colC.b],I*3),l.set([v.pattern,v.seed,v.gores,v.hero?1:0],I*4),p.set([v.bob[0],v.bob[1],v.spin[0],v.spin[1]],I*4)}),o.setAttribute("iColA",new f.InstancedBufferAttribute(d,3)),o.setAttribute("iColB",new f.InstancedBufferAttribute(i,3)),o.setAttribute("iColC",new f.InstancedBufferAttribute(b,3)),o.setAttribute("iPar",new f.InstancedBufferAttribute(l,4)),o.setAttribute("iBob",new f.InstancedBufferAttribute(p,4)),m.frustumCulled=!1,m}function xt(o){return new f.ShaderMaterial({side:f.DoubleSide,fog:!0,lights:!0,uniforms:f.UniformsUtils.merge([f.UniformsLib.lights,f.UniformsLib.fog,{uSunDir:{value:new f.Vector3(0,1,0)},uSunCol:{value:new f.Color(0,0,0)},uSunOn:{value:0},uTime:{value:0},uGlow:{value:0},uFlame:{value:0}}]),vertexShader:`
      attribute vec3 iColA, iColB, iColC; attribute vec4 iPar, iBob;
      uniform float uTime, uGlow, uFlame;
      varying vec2 vUv; varying vec3 vN, vV, vA, vB, vC; varying vec4 vPar; varying vec2 vG;
      #include <fog_pars_vertex>
      ${it}
      void main(){
        float a = iBob.w + uTime*iBob.z, c = cos(a), s = sin(a);
        vec3 p = position, n = normal; p.xz = mat2(c,-s,s,c)*p.xz; n.xz = mat2(c,-s,s,c)*n.xz;
        vec4 wp = instanceMatrix*vec4(p,1.0); wp.xyz += bobOff(iBob.xy, uTime);
        vec4 mvPosition = modelViewMatrix*wp;
        vN = normalMatrix*normalize(mat3(instanceMatrix)*n); vV = mvPosition.xyz;
        vUv = uv; vA = iColA; vB = iColB; vC = iColC; vPar = iPar;
        float x = flareX(iPar.y, uTime);
        vG = mix(vec2(glowOf(x)*0.8, flameOf(x)), vec2(uGlow, uFlame), iPar.w);
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime;
      varying vec2 vUv; varying vec3 vN, vV, vA, vB, vC; varying vec4 vPar; varying vec2 vG;
      #include <common>
      #include <lights_pars_begin>
      #include <fog_pars_fragment>
      ${st}
      float band(float x, float a, float b, float f){ return smoothstep(a-f, a+f, x)*(1.0-smoothstep(b-f, b+f, x)); }
      vec3 pattern(vec2 uv, out float tape){
        float gores = vPar.z, id = vPar.x, s = uv.y;
        float g = uv.x*gores, gi = floor(g), td = tri(g), alt = mod(gi, 2.0);
        float fg = fwidth(g)+1e-4, fs = fwidth(s)+1e-5;
        vec3 A = vA, B = vB, C = vC, col;
        if (id < 2.5) {                                   // ---- the Flagship: crimson field, gold heraldry
          col = A*mix(1.0, 0.7, alt);
          if (id > 0.5 && id < 1.5) { float d1 = floor(g*0.5+s*gores*0.33), d2 = floor(g*0.5-s*gores*0.33+64.0); col = A*mix(1.0, 0.58, mod(d1+d2, 2.0)); }
          if (id > 1.5) { float sp = fract((g+s*gores*0.85)/4.0); col = mix(col, B*0.92, band(sp, 0.04, 0.2, 0.012)); }
          col = mix(col, B, band(td, 0.80, 0.90, fg*1.5)*0.9);                     // gold piping beside every seam
          float low = 1.0-smoothstep(0.165-fs, 0.165+fs, s);                       // candy-striped lower cone
          col = mix(col, mix(B, A*0.85, alt), low);
          col = mix(col, C, band(s, 0.165, 0.182, fs));
          float z1 = s+(td-0.5)*0.045;                                              // double chevron
          col = mix(col, B, band(z1, 0.235, 0.262, fs*1.5)); col = mix(col, C, band(z1, 0.285, 0.296, fs*1.5));
          float eq = band(s, 0.485, 0.645, fs);                                     // the great gold belt
          float sb = (s-0.565)/0.08, dia = td+abs(sb);                              // diamonds centred on the gores
          vec3 belt = mix(B, A*0.9, 1.0-smoothstep(0.62-fg, 0.62+fg, dia));
          belt = mix(belt, C, 1.0-smoothstep(0.2-fg, 0.2+fg, dia));
          belt = mix(belt, A*0.75, band(abs(sb), 0.80, 0.90, fs*12.0));
          col = mix(col, belt, eq);
          col = mix(col, C, band(s, 0.468, 0.485, fs)+band(s, 0.645, 0.662, fs));
          float z2 = s-(td-0.5)*0.04; col = mix(col, B, band(z2, 0.745, 0.768, fs*1.5));
          float cr = smoothstep(0.865-fs*2.0, 0.865+fs*2.0, s-(td-0.5)*0.06);      // scalloped gold crown, sunburst
          col = mix(col, mix(B, A*0.9, alt*smoothstep(0.92, 0.925, s)), cr);
          col = mix(col, C, smoothstep(0.972, 0.976, s));
          col = mix(col, A*0.18, 1.0-smoothstep(0.03-fs, 0.03+fs, s));              // scorched skirt
          col = mix(col, B, band(s, 0.03, 0.043, fs));
        } else {                                          // ---- consorts and guard
          if (id < 3.5) col = mix(A, B, alt);
          else if (id < 4.5) { float sp = mod(floor(g+s*gores*0.75), 3.0); col = sp < 0.5 ? A : (sp < 1.5 ? B : C); }
          else if (id < 5.5) { float zz = s*7.0+(tri(g*0.5)-0.5)*0.45; col = mix(A, B, band(fract(zz*0.5), 0.5, 1.0, fs*5.0)); }
          else if (id < 6.5) { float d1 = floor(g*0.5+s*gores*0.4), d2 = floor(g*0.5-s*gores*0.4+64.0); col = mod(d1+d2, 2.0) < 0.5 ? A : B; }
          else { col = A*mix(1.0, 0.78, alt); float bz = abs(s-0.56+(td-0.5)*0.07);
            col = mix(col, B, 1.0-smoothstep(0.075, 0.075+fs*2.0, bz)); col = mix(col, C, band(bz, 0.095, 0.115, fs)); }
          col = mix(col, C, smoothstep(0.9, 0.9+fs*2.0, s+(td-0.5)*0.05));
          col = mix(col, B, smoothstep(0.972, 0.976, s));
          col = mix(col, C, band(s, 0.035, 0.06, fs));
          col = mix(col, A*0.2, 1.0-smoothstep(0.035-fs, 0.035+fs, s));
        }
        tape = smoothstep(0.955-fg, 0.955+fg, td);
        float rows = 30.0, pf = fwidth(s*rows);
        float seam = smoothstep(0.93-pf, 0.93+pf, tri(s*rows+0.5))*(1.0-smoothstep(0.3, 0.9, pf));
        float tone = hash2(vec2(gi, floor(s*rows)));
        col *= mix(1.0, 0.9+0.2*tone, 1.0-smoothstep(0.2, 0.8, pf));               // panel-to-panel dye variation
        col *= 1.0-0.16*seam;
        return col;
      }
      void main(){
        float tape; vec3 alb = pattern(vUv, tape);
        alb *= mix(1.0, 0.5, tape);
        vec3 V = normalize(-vV), n = normalize(vN); bool inside = !gl_FrontFacing; if (inside) n = -n;
        vec3 L, sunC; sunLight(L, sunC);
        float ndl = dot(n, L), vdl = dot(V, -L);
        // gore puff: soft self shading in the valleys beside each tape
        float puff = 1.0-pow(tri(vUv.x*vPar.z), 3.0)*0.22;
        vec3 col = alb*puff*(sunC*saturate((ndl+0.3)/1.3)+skyLight(n))*RECIPROCAL_PI;
        // sunlight carried through the fabric: the shaded side glows with its own dye, most of all against the sun
        vec3 dye = alb*alb*1.6+alb*0.25;
        col += dye*sunC*RECIPROCAL_PI*saturate(0.25-ndl)*(0.3+0.95*pow(saturate(vdl), 1.5))*(inside ? 1.6 : 1.0);
        float fr = pow(1.0-saturate(dot(n, V)), 3.0);
        col += sunC*fr*(0.06+0.9*pow(saturate(vdl), 2.0))*RECIPROCAL_PI*(0.4+alb);
        col += sunC*pow(saturate(dot(n, normalize(L+V))), 30.0)*0.07;
        // the lantern: burner light soaking through the cloth, hot near the mouth, tapes and seams in silhouette
        float s = vUv.y, G = vG.x;
        float fall = mix(1.12, 0.55, smoothstep(0.0, 1.0, s))*smoothstep(0.0, 0.05, s);
        float flick = 0.92+0.08*sin(uTime*19.0+s*9.0)*sin(uTime*7.3+vUv.x*40.0)+0.1*vG.y*vnoise(vec2(vUv.x*14.0, s*6.0-uTime*1.6));
        vec3 warm = vec3(1.0, 0.72, 0.42);
        vec3 lant = alb*(1.15+alb)*warm*fall*flick*mix(0.8, 1.05, saturate(dot(n, V)));
        col += lant*G*(inside ? 1.6 : 0.85)*mix(1.0, 0.35, tape);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function vt(o){return new f.ShaderMaterial({side:f.DoubleSide,fog:!0,lights:!0,vertexColors:!0,defines:o?{INST:1}:{},uniforms:f.UniformsUtils.merge([f.UniformsLib.lights,f.UniformsLib.fog,{uSunDir:{value:new f.Vector3(0,1,0)},uSunCol:{value:new f.Color(0,0,0)},uSunOn:{value:0},uTime:{value:0},uFlame:{value:0},uFirePos:{value:new f.Vector3(0,9.8,0)},uFireR2:{value:40}}]),vertexShader:`
      attribute vec2 aMT;
      #ifdef INST
        attribute vec4 iBob, iPar;
      #else
        attribute vec4 aBob;
      #endif
      uniform float uTime, uFlame, uFireR2; uniform vec3 uFirePos;
      varying vec3 vN, vV, vCol; varying vec2 vUv; varying float vMat, vFire;
      #include <fog_pars_vertex>
      ${it}
      void main(){
        vec3 p = position, n = normal; vec3 d; float fl, r2;
        #ifdef INST
          float a = iBob.w + uTime*iBob.z, c = cos(a), s = sin(a);
          p.xz = mat2(c,-s,s,c)*p.xz; n.xz = mat2(c,-s,s,c)*n.xz;
          d = p - vec3(0.0, 3.3, 0.0); fl = flameOf(flareX(iPar.y, uTime)); r2 = 5.0;
          vec4 wp = instanceMatrix*vec4(p, 1.0); wp.xyz += bobOff(iBob.xy, uTime);
          n = normalize(mat3(instanceMatrix)*n);
        #else
          d = p - uFirePos; fl = uFlame; r2 = uFireR2;
          vec4 wp = vec4(p + mix(bobOff(aBob.xy, uTime), bobOff(aBob.zw, uTime), aMT.y), 1.0);
        #endif
        vFire = fl*clamp(dot(normal, -normalize(d))*0.6+0.55, 0.0, 1.0)/(1.0+dot(d, d)/r2);
        vec4 mvPosition = modelViewMatrix*wp;
        vN = normalMatrix*n; vV = mvPosition.xyz; vCol = color; vUv = uv; vMat = aMT.x;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime;
      varying vec3 vN, vV, vCol; varying vec2 vUv; varying float vMat, vFire;
      #include <common>
      #include <lights_pars_begin>
      #include <fog_pars_fragment>
      ${st}
      void main(){
        vec3 V = normalize(-vV), n = normalize(vN); if (dot(n, V) < 0.0) n = -n;
        vec3 L, sunC; sunLight(L, sunC);
        vec3 alb = vCol; float spec = 0.03, gloss = 10.0, m = vMat;
        float fw = fwidth(vUv.x)+fwidth(vUv.y);
        if (m < 0.5) { alb *= 0.78+0.4*vnoise(vec2(vUv.x*30.0, vUv.y*2.5)); }
        else if (m < 1.5) {
          float row = vUv.y*9.0, stake = vUv.x*5.0, fade = 1.0-smoothstep(0.1, 0.45, fw*9.0);
          float over = sin((stake+mod(floor(row), 2.0)*0.5)*6.2832);
          float w = (0.58+0.42*over)*(1.0-pow(tri(row+0.5), 3.0)*0.8);
          alb *= mix(0.72, 0.42+0.8*w, fade);
          alb *= 1.0-0.25*smoothstep(0.80, 0.86, tri(vUv.y*0.9+0.5));          // cane hoops that still read far off
          alb *= 0.86+0.28*vnoise(vUv*vec2(0.9, 2.6));
        }
        else if (m < 2.5) { float fade = 1.0-smoothstep(0.1, 0.5, fwidth(vUv.y)*14.0);
          alb *= mix(0.86, 0.68+0.34*sin(vUv.x*12.566+vUv.y*14.0), fade); }
        else if (m < 3.5) { alb *= 0.9+0.2*vnoise(vUv*5.0); }
        else if (m < 4.5) { spec = 1.2; gloss = 36.0; }
        float ndl = dot(n, L);
        vec3 col = alb*(sunC*saturate((ndl+0.2)/1.2)+skyLight(n))*RECIPROCAL_PI;
        col += sunC*alb*pow(saturate(dot(n, normalize(L+V))), gloss)*spec;
        col += sunC*RECIPROCAL_PI*pow(1.0-saturate(dot(n, V)), 3.0)*pow(saturate(dot(V, -L)), 2.0)*0.6;
        col += alb*vec3(1.0, 0.5, 0.17)*vFire*(1.7+0.3*sin(uTime*23.0));
        if (m > 4.5 && m < 5.5) col = vCol*(4.2+0.6*sin(uTime*9.0+vUv.y*30.0));
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function At(o){return new f.ShaderMaterial({side:f.DoubleSide,fog:!0,lights:!0,defines:o?{STREAMER:1}:{},uniforms:f.UniformsUtils.merge([f.UniformsLib.lights,f.UniformsLib.fog,{uSunDir:{value:new f.Vector3(0,1,0)},uSunCol:{value:new f.Color(0,0,0)},uSunOn:{value:0},uTime:{value:0}}]),vertexShader:`
      attribute float aFree; attribute vec4 iA, iB, iC, iD, iE;
      uniform float uTime;
      varying vec3 vN, vV, vCol; varying float vFree; varying vec2 vUv;
      #include <fog_pars_vertex>
      ${it}
      void main(){
        vec3 T = iB.xyz, Nn = iC.xyz, D = cross(Nn, T);
        float size = iA.w, ph = iB.w, asp = iC.w, f = aFree; vec3 lp, n;
        #ifdef STREAMER
          float x = position.x*size*asp, k = x*0.8-uTime*4.4+ph;
          float w1 = sin(k), w2 = sin(x*1.9-uTime*6.8+ph*1.7), env = f*(0.35+0.65*f);
          lp = T*x + D*(position.y*size*(1.0+0.15*w2*f)+f*f*size*asp*0.13+sin(k*0.7+1.3)*0.45*env*size) + Nn*(w1*0.75+w2*0.25)*env*size;
          n = normalize(Nn - T*cos(k)*0.4*env*size + D*w2*0.3*f);
        #else
          float w = sin(uTime*5.3+ph+f*2.6+position.x*2.0), w2 = sin(uTime*3.1+ph*2.3);
          lp = T*position.x*size + D*(-position.y*size*asp*(1.0-0.08*w2*f)) + Nn*(w*0.2+w2*0.14+0.12)*f*size + T*w2*0.07*f*size;
          n = normalize(Nn + D*(w*0.5+0.2)*f - T*cos(uTime*5.3+ph+f*2.6+position.x*2.0)*0.35*f);
        #endif
        vec3 bo = mix(bobOff(iD.xy, uTime), bobOff(iD.zw, uTime), iE.w);
        vec4 mvPosition = modelViewMatrix*vec4(iA.xyz+lp+bo, 1.0);
        vN = normalMatrix*n; vV = mvPosition.xyz; vCol = iE.rgb; vFree = f; vUv = position.xy;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec3 vN, vV, vCol; varying float vFree; varying vec2 vUv;
      #include <common>
      #include <lights_pars_begin>
      #include <fog_pars_fragment>
      ${st}
      void main(){
        vec3 V = normalize(-vV), n = normalize(vN); if (dot(n, V) < 0.0) n = -n;
        vec3 L, sunC; sunLight(L, sunC);
        vec3 alb = vCol;
        #ifdef STREAMER
          alb *= mix(1.0, 0.62, smoothstep(0.24, 0.28, abs(vUv.y)*(1.0+vFree)));   // darker selvedge
          alb = mix(alb, alb*0.7+0.2, step(0.5, fract(vUv.x*5.0))*0.25);           // faint barring along the tail
        #else
          alb *= mix(0.8, 1.08, smoothstep(0.0, 0.12, vFree));                      // hem at the line
        #endif
        float ndl = dot(n, L);
        vec3 col = alb*(sunC*(saturate(ndl)*0.75+0.12)+skyLight(n))*RECIPROCAL_PI;
        col += alb*alb*sunC*RECIPROCAL_PI*saturate(-ndl)*(0.5+1.4*pow(saturate(dot(V, -L)), 2.0));  // back-lit cloth
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function St(o){const u=[],t=[],e=[];if(o){for(let i=0;i<=22;i++){const b=i/22,l=.5*(1-.55*b);for(let p=0;p<3;p++){let M=(p-1)*l,v=b;i===22&&p===1&&(v=b-.09),u.push(v,M,0),t.push(b)}}for(let i=0;i<22;i++)for(let b=0;b<2;b++){const l=i*3+b,p=l+1,M=l+3,v=M+1;e.push(l,M,p,p,M,v)}}else{for(let i=0;i<=4;i++){const b=i/4,l=.5*(1-b);for(let p=0;p<3;p++)u.push((p-1)*l,-b,0),t.push(b)}for(let i=0;i<4;i++)for(let b=0;b<2;b++){const l=i*3+b,p=l+1,M=l+3,v=M+1;e.push(l,M,p,p,M,v)}}const m=new f.BufferGeometry;return m.setAttribute("position",new f.Float32BufferAttribute(u,3)),m.setAttribute("aFree",new f.Float32BufferAttribute(t,1)),m.setIndex(e),m}function ft(o,u){const t=o.length,e=St(u),m=new Float32Array(t*4),d=new Float32Array(t*4),i=new Float32Array(t*4),b=new Float32Array(t*4),l=new Float32Array(t*4);o.forEach((M,v)=>{m.set([M.pos.x,M.pos.y,M.pos.z,M.size],v*4),d.set([M.tan.x,M.tan.y,M.tan.z,M.phase],v*4),i.set([M.nrm.x,M.nrm.y,M.nrm.z,M.asp],v*4),b.set([M.bobA[0],M.bobA[1],M.bobB[0],M.bobB[1]],v*4),l.set([M.col.r,M.col.g,M.col.b,M.t],v*4)});for(const[M,v]of[["iA",m],["iB",d],["iC",i],["iD",b],["iE",l]])e.setAttribute(M,new f.InstancedBufferAttribute(v,4));const p=new f.InstancedMesh(e,At(u),t);return p.frustumCulled=!1,p}function dt(o){const u=c(0,-1,0).addScaledVector(o,o.y);return u.lengthSq()<1e-4&&u.set(1,0,0),u.normalize(),c().crossVectors(o,u).normalize()}function wt(o){const u=new f.CylinderGeometry(1,1,1,14,10,!0);u.translate(0,.5,0);const t=new f.PlaneGeometry(2,2),e=[],m=[],d=[],i=[],b=[];let l=0;for(const[P,x]of[[u,0],[t,1]]){const k=P.attributes.position,V=P.attributes.normal,T=P.attributes.uv;for(let s=0;s<k.count;s++)e.push(k.getX(s),k.getY(s),k.getZ(s)),m.push(V.getX(s),V.getY(s),V.getZ(s)),d.push(T.getX(s),T.getY(s)),i.push(x);for(let s=0;s<P.index.count;s++)b.push(P.index.getX(s)+l);l+=k.count,P.dispose()}const p=new f.BufferGeometry;p.setAttribute("position",new f.Float32BufferAttribute(e,3)),p.setAttribute("normal",new f.Float32BufferAttribute(m,3)),p.setAttribute("uv",new f.Float32BufferAttribute(d,2)),p.setAttribute("aKind",new f.Float32BufferAttribute(i,1)),p.setIndex(b);const M=o.length,v=new Float32Array(M*4),I=new Float32Array(M*4),C=new f.ShaderMaterial({side:f.DoubleSide,fog:!0,transparent:!0,depthWrite:!1,blending:f.AdditiveBlending,uniforms:f.UniformsUtils.merge([f.UniformsLib.fog,{uTime:{value:0},uFlame:{value:0}}]),vertexShader:`
      attribute float aKind; attribute vec4 iBob, iPar;
      uniform float uTime, uFlame;
      varying vec2 vUv; varying float vKind, vF, vSeed; varying vec3 vN, vV;
      #include <fog_pars_vertex>
      ${it}
      void main(){
        float F = max(mix(flameOf(flareX(iPar.y, uTime)), uFlame, iPar.w), 0.06);
        vec3 bo = bobOff(iBob.xy, uTime); vec4 mvPosition;
        if (aKind < 0.5) {
          float v = position.y, prof = mix(0.4, 1.0, smoothstep(0.0, 0.25, v))*(1.0-pow(v, 1.7));
          vec3 p = vec3(position.x*prof, v*(0.14+0.86*F), position.z*prof);
          p.xz += vec2(sin(uTime*13.0+v*8.0+iPar.y*40.0), cos(uTime*11.0+v*7.0+iPar.y*17.0))*0.16*v*v;
          vec4 wp = instanceMatrix*vec4(p, 1.0); wp.xyz += bo; mvPosition = modelViewMatrix*wp;
          vN = normalMatrix*normalize(mat3(instanceMatrix)*normal);
        } else {
          vec4 c = instanceMatrix*vec4(0.0, 0.3, 0.0, 1.0); c.xyz += bo; mvPosition = modelViewMatrix*c;
          mvPosition.xy += position.xy*iPar.x*(0.35+0.65*F); vN = vec3(0.0, 0.0, 1.0);
        }
        vV = mvPosition.xyz; vUv = uv; vKind = aKind; vF = F; vSeed = iPar.y;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime;
      varying vec2 vUv; varying float vKind, vF, vSeed; varying vec3 vN, vV;
      #include <common>
      #include <fog_pars_fragment>
      ${st.slice(st.indexOf("float hash1"))}
      void main(){
        vec3 col;
        if (vKind < 0.5) {
          float v = vUv.y, xx = abs(vUv.x*2.0-1.0);
          float n = vnoise(vec2(xx*7.0, v*3.5-uTime*5.5+vSeed*9.0))*0.6+vnoise(vec2(xx*15.0, v*8.0-uTime*9.5))*0.4;
          float body = saturate(n*1.5+0.6-v*1.5);
          float edge = pow(abs(dot(normalize(vN), normalize(-vV))), 0.7);
          vec3 c = mix(vec3(1.0, 0.3, 0.04), vec3(1.0, 0.78, 0.4), saturate(body*1.7-0.35))*5.0;
          c = mix(c, vec3(0.3, 0.5, 1.0)*4.0, 1.0-smoothstep(0.02, 0.15, v));
          col = c*body*edge*(0.25+0.75*smoothstep(0.0, 0.4, vF));
        } else {
          float r = length(vUv*2.0-1.0), g = exp(-r*r*5.5)*(1.0-smoothstep(0.65, 1.0, r));
          col = vec3(1.0, 0.52, 0.2)*g*(0.55*vF+0.03);
        }
        #ifdef USE_FOG
          #ifdef FOG_EXP2
            col *= exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
          #else
            col *= 1.0-smoothstep(fogNear, fogFar, vFogDepth);
          #endif
        #endif
        gl_FragColor = vec4(col, 1.0);
      }`}),S=new f.InstancedMesh(p,C,M),g=new f.Matrix4;return o.forEach((P,x)=>{g.makeScale(P.r,P.h,P.r).setPosition(P.pos),S.setMatrixAt(x,g),v.set([P.glow,P.seed,0,P.hero?1:0],x*4),I.set([P.bob[0],P.bob[1],0,0],x*4)}),p.setAttribute("iPar",new f.InstancedBufferAttribute(v,4)),p.setAttribute("iBob",new f.InstancedBufferAttribute(I,4)),S.frustumCulled=!1,S.renderOrder=6,S}const X=(o,u,t,e,m)=>{const d=2/t,i=Math.cos(e),b=Math.sin(e);return c(o*Math.sign(i)*Math.abs(i)**d,m,u*Math.sign(b)*Math.abs(b)**d)},Z=(o,u,t,e,m)=>{const d=[];for(let i=0;i<=m;i++)d.push(X(o,u,t,i%m/m*Math.PI*2,e));return d};function mt(o,u,t,e,m,d,i,b,l){const p=e.distanceTo(m),M=Math.max(8,Math.round(p/1.8)),v=pt(e,m,d,M);o.setBob(i,b),o.tube(v,l.rad??.05,4,l.rope,2,{t:g=>g});const I=Math.max(1,Math.floor(p*(1-(l.skip0||0)-(l.skip1||0))/(l.size*(l.gap??1.12)))),C=t.int(0,l.cols.length-1),S=c().subVectors(m,e);for(let g=0;g<I;g++){const P=et(l.skip0||0,1-(l.skip1||0),(g+.5)/I),x=c().lerpVectors(e,m,P);x.y-=d*4*P*(1-P);const k=S.clone();k.y-=d*4*(1-2*P),k.normalize();const V=l.cols[(g+C)%l.cols.length].clone().multiplyScalar(.9+t()*.2);u.push({pos:x,size:l.size,tan:k,phase:t()*6.283,nrm:dt(k),asp:l.asp??1.35,bobA:i,bobB:b,t:P,col:V})}if(l.lamps){const g=Math.max(2,Math.round(p/l.lamps));for(let P=1;P<g;P++){const x=P/g,k=c().lerpVectors(e,m,x);k.y-=d*4*x*(1-x)-.32,o.st.t=x,o.setM(new f.Matrix4().setPosition(k)),o.blob(l.lampR??.2,(l.lampR??.2)*2.1,6,l.lampCol,5),o.setM(null),o.st.t=0}}}function K(o,u,t,e,m,d,i,b){const l=e.clone().add(c(u.range(-.12,.12),u.range(-.08,.05),u.range(-.12,.12))).normalize();o.push({pos:t,size:d,tan:l,phase:u()*6.283,nrm:dt(l),asp:m/d,bobA:b,bobB:b,t:0,col:i})}function Ct(o,u,t,e,m,d,i,b){const l=17*m,p=e.y+5*m,M=.85*m,v=M*1.14,I=t()*6.283,C=T=>[l*(.09+.3*Math.sin(T*Math.PI/2)**1.1)+.1*m,p+l*.6*T],S=(T,s,h,y)=>o.push({pos:T,size:M,tan:s,phase:t()*6.283,nrm:h,asp:1.35,bobA:d,bobB:d,t:0,col:i[y%i.length].clone().multiplyScalar(.9+t()*.2)});for(let T=0;T<6;T++){const s=I+(T+.5)/6*Math.PI*2,h=Math.cos(s),y=Math.sin(s),n=T%2?1:-1;let a=v*.5,[r,z]=C(.05),w=T;for(let L=1;L<=90;L++){const[D,F]=C(.05+.92*L/90),R=D-r,A=F-z,B=Math.hypot(R,A);if(a+=B,a>=v){a-=v;const E=c(h*R/B,A/B,y*R/B),U=c(h*A/B,-R/B,y*A/B),j=c(-y*n,0,h*n);S(c(e.x+h*D,F,e.z+y*D),E,U.multiplyScalar(.75).addScaledVector(j,.66).normalize(),w++)}r=D,z=F}}const g=l*.39*1.035,P=p+l*.6,x=12,k=Math.max(3,Math.round(g*Math.PI*2/x/v)),V=.95*m;for(let T=0;T<x;T++)for(let s=0;s<k;s++){const h=(s+.5)/k,y=I+(T+h)/x*Math.PI*2,n=Math.cos(y),a=Math.sin(y),r=Math.PI*2/x,z=c(-a*g*r,-V*Math.PI*Math.cos(Math.PI*h),n*g*r).normalize();S(c(e.x+n*g,P-V*Math.sin(Math.PI*h),e.z+a*g),z,dt(z),T*k+s)}K(u,t,c(e.x,p+l+.1*m,e.z),b,t.range(11,14)*m,1.25*m,i[1],d)}function bt(o,u,t,e,m,d=.42){const i=Math.max(4,Math.round(u.distanceTo(t)/.42)),b=pt(u,t,e,i),l=c().subVectors(t,u).cross(c(0,1,0));l.lengthSq()<.001&&l.set(1,0,0),l.normalize().multiplyScalar(d/2);const p=b.map(v=>v.clone().add(l)),M=b.map(v=>v.clone().sub(l));o.tube(p,.035,4,m.rope,2),o.tube(M,.035,4,m.rope,2);for(let v=1;v<i;v++)o.tube([p[v],M[v]],.032,4,m.wood,0,{jit:.3})}function gt(o,u,t,e,m,d,i){const b=new f.Matrix4().makeRotationY(i).setPosition(e,m,d);o.setM(b);const l=u.pick(t.coats),p=u.range(.92,1.06),M=t.skin;if(o.loft([{y:0,a:.11,b:.1},{y:.45*p,a:.14,b:.12},{y:.86*p,a:.17,b:.13},{y:1.15*p,a:.2,b:.13},{y:1.42*p,a:.23,b:.13},{y:1.5*p,a:.1,b:.09},{y:1.56*p,a:.06,b:.06,col:M}],8,l,6,{jit:.2}),o.setM(new f.Matrix4().makeRotationY(i).setPosition(e,m+1.67*p,d)),o.blob(.115,.27,8,M,6),u.chance(.7)){o.setM(new f.Matrix4().makeRotationY(i).setPosition(e,m+1.76*p,d));const v=u.range(.08,.2);o.loft([{y:0,a:.2},{y:.015,a:.115},{y:v,a:.12},{y:v,a:.01}],8,t.hat,6)}o.setM(null)}function kt(o,u,t,e,m,d,i,b,l,p){const v=()=>new f.Matrix4;o.setBob(d);for(const n of[-1.9,1.9]){const a=[];for(let r=0;r<=12;r++){const z=et(-5.9,5.9,r/12),w=Math.max(0,Math.abs(z)-4.3);a.push(c(z,.14+w*w*.42,n))}o.tube(a,.15,6,t.woodDk,0,{cap:!0});for(const r of[-3.2,-1.1,1.1,3.2])o.tube([c(r,.14,n),c(r,.72,n*.96)],.09,5,t.wood,0)}for(const n of[-3.2,0,3.2])o.tube([c(n,.52,-2.7),c(n,.52,2.7)],.11,4,t.woodDk,0,{rot:Math.PI/4,cap:!0});const I=[[.62,.02,.02],[.62,4.3,2.5],[.78,4.75,2.95],[1.4,5,3.15],[2.2,5.15,3.3],[3,5.38,3.52]].map(([n,a,r])=>({y:n,a,b:r,n:3.1}));o.loft(I,44,t.wicker,1,{jit:0}),o.loft([{y:.97,a:.02,b:.02,n:3.1},{y:.97,a:4.8,b:3,n:3.1}],44,t.wood,0),o.tube(Z(5.4,3.54,3.1,3.03,48),.19,7,t.leather,6,{closed:!0}),o.tube(Z(5.1,3.25,3.1,1.8,48),.075,5,t.woodDk,0,{closed:!0}),o.tube(Z(4.82,3,3.1,.82,48),.09,5,t.woodDk,0,{closed:!0});for(let n=0;n<14;n++){const a=(n+.5)/14*Math.PI*2;o.tube(I.slice(1).map(r=>X(r.a*1.012,r.b*1.018,3.1,a,r.y)),.07,4,t.leather,6)}const C=16+u.int(0,4);for(let n=0;n<C;n++){const a=(n+u.range(-.2,.2))/C*Math.PI*2,r=u.range(.7,1.5),z=X(5.42,3.56,3.1,a,3),w=X(5.62,3.78,3.1,a,3-r);o.tube([z,w.clone().setY(w.y+.3)],.03,4,t.rope,2),o.setM(v().makeRotationY(u()*6).setPosition(w)),o.blob(u.range(.22,.3),u.range(.55,.72),7,u.chance(.25)?t.sackDk:t.sack,3,.9),o.setM(null)}const S=12;for(let n=0;n<S;n++){const a=(n+.5)/S*Math.PI*2;o.tube([X(5.2,3.35,3.1,a,3),X(4.25,2.8,3.1,a,4.5)],.085,5,t.wood,0),o.tube([X(5.25,3.4,3.1,a,3.1),X(4.45,2.95,3.1,a+Math.PI*2/S,4.4)],.028,4,t.rope,2)}o.tube(Z(4.8,3.12,3.1,3.72,40),.04,4,t.rope,2,{closed:!0}),o.tube(Z(4.3,2.84,3.1,4.5,44),.13,6,t.woodDk,0,{closed:!0}),o.loft([{y:4.56,a:.02,b:.02,n:3.1},{y:4.56,a:4.25,b:2.8,n:3.1}],40,t.wood,0),o.loft([[4.5,4.25,2.8],[5.1,4.34,2.9],[5.68,4.5,3.05]].map(([n,a,r])=>({y:n,a,b:r,n:3.1})),40,t.wickerLt,1,{jit:0}),o.tube(Z(4.52,3.07,3.1,5.7,44),.15,7,t.leather,6,{closed:!0});const g=36;for(let n=0;n<g;n++){const a=n/g*Math.PI*2,r=(n+1)/g*Math.PI*2,z=(a+r)/2,w=n%2?t.gold:t.crimson,L=X(4.42,2.95,3.1,a,4.42),D=X(4.42,2.95,3.1,r,4.42),F=X(4.52,3.05,3.1,z,3.62-n%2*.12),R=Math.cos(z),A=Math.sin(z),B=o.vert(L.x,L.y,L.z,R,0,A,w.r,w.g,w.b,0,0,3),E=o.vert(D.x,D.y,D.z,R,0,A,w.r,w.g,w.b,1,0,3),U=o.vert(F.x,F.y,F.z,R,0,A,w.r*.8,w.g*.8,w.b*.8,.5,1,3);o.I.push(B,E,U)}const P=9,x=1.9;for(let n=0;n<6;n++){const a=(n+.5)/6*Math.PI*2,r=X(4.4,2.95,3.1,a,5.7),z=c(Math.cos(a)*x,P,Math.sin(a)*x),w=[];for(let L=0;L<=8;L++){const D=L/8,F=c().lerpVectors(r,z,D),R=Math.sin(D*Math.PI)*.5;F.x+=Math.cos(a)*R,F.z+=Math.sin(a)*R,w.push(F)}o.tube(w,L=>.1-.03*L,5,t.iron,6)}o.tube(Z(x,x,2,P,28),.13,7,t.brass,4,{closed:!0}),o.tube(Z(1.35,1.35,2,8.25,20),.07,5,t.iron,6,{closed:!0});for(let n=0;n<4;n++){const a=n/4*Math.PI*2+.4;o.tube([c(Math.cos(a)*1.35,8.25,Math.sin(a)*1.35),c(Math.cos(a)*x,P,Math.sin(a)*x)],.05,4,t.iron,6)}for(const n of[-.62,.62]){o.loft([[8.15,.02],[8.15,.3],[8.3,.36],[9.25,.36],[9.4,.3],[9.62,.44],[9.66,.4]].map(([r,z])=>({y:r,a:z})),12,t.brass,4,{cx:n});const a=[];for(let r=0;r<=40;r++){const z=r/40*Math.PI*7;a.push(c(n+Math.cos(z)*.45,8.45+r/40*.8,Math.sin(z)*.45))}o.tube(a,.045,4,t.brassDk,4),o.tube([c(n,8.15,0),c(n*2,7.2,.3),c(n*3.2,5.9,.9)],.045,4,t.iron,6)}for(const[n,a]of[[-3.1,-1.6],[3.1,-1.6],[-3.1,1.6],[3.1,1.6]])o.loft([[4.58,.02],[4.58,.36],[5.75,.36,t.crimson],[5.9,.36],[6.1,.24],[6.16,.02]].map(([r,z,w])=>({y:r,a:z,col:w})),10,t.tank,4,{cx:n,cz:a});const k=16;for(let n=0;n<k;n++){const a=n/k*Math.PI*2;o.tube([c(Math.cos(a)*x,P,Math.sin(a)*x),c(Math.cos(a)*p,l+.05,Math.sin(a)*p)],.04,4,t.rope,2)}for(let n=0;n<8;n++){const a=(n+.5)/8*Math.PI*2;o.tube([X(4.5,3.05,3.1,a,5.75),c(Math.cos(a)*p,l+.05,Math.sin(a)*p)],.035,4,t.rope,2)}o.tube(Z(p*1.005,p*1.005,2,l,40),.11,6,t.leather,6,{closed:!0});const V=[];b.forEach((n,a)=>{const r=X(5.3,3.5,3.1,n,2.75),z=c(Math.cos(n),0,Math.sin(n)),w=r.clone().addScaledVector(z,3.3);w.y=3.55,V.push(w),o.tube([r.clone().addScaledVector(z,-.6),r,c().lerpVectors(r,w,.5).setY(3.05),w],D=>.13-.06*D,6,t.wood,0,{cap:!0}),o.tube([w,X(4.5,3.05,3.1,n,5.72)],.03,4,t.rope,2);const L=w.clone().addScaledVector(z,-.5);L.y-=.75,o.tube([w.clone().addScaledVector(z,-.5).setY(3.4),L.clone().setY(L.y+.2)],.02,4,t.iron,6),o.setM(v().setPosition(L)),o.blob(.2,.42,7,t.lamp,5),o.loft([{y:.17,a:.2},{y:.3,a:.03}],7,t.brassDk,4),o.setM(null)});for(let n=0;n<6;n++){const a=X(4.55,3.1,3.1,(n+.5)/6*Math.PI*2+.26,6.25);o.tube([a.clone().setY(5.7),a],.035,4,t.iron,6),o.setM(v().setPosition(a.x,a.y+.18,a.z)),o.blob(.17,.36,7,t.lamp,5),o.setM(null)}for(const n of[-1,1]){const a=c(n*4.45,5.6,0),r=c(n*6.3,9.6,0);o.tube([a,r],z=>.09-.045*z,5,t.wood,0,{cap:!0}),o.setM(v().setPosition(r)),o.blob(.13,.26,6,t.brass,4),o.setM(null),K(m,u,r.clone().setY(r.y-.5),i,u.range(9,12),1.25,n<0?t.crimson:t.gold,d)}const T=u.sign();bt(o,c(1.6*T,3.1,3.62),c(1.9*T,-7.5,4.3),0,t),bt(o,c(-.4,P,x),c(-.6,l,p*.98),-.35,t),bt(o,c(-2.2*T,1,2.2),c(-2.4*T,4.5,2),0,t);const s=-3.6*T,h=-8.5-u.range(0,2.5);o.tube(pt(c(s,.6,-1.2),c(s-.6,h+1.3,-1.6),-.25,10),.045,4,t.rope,2),o.tube([c(s-.6,h+1.4,-1.6),c(s-.6,h,-1.6)],.07,5,t.iron,6,{cap:!0});for(let n=0;n<4;n++){const a=n/4*Math.PI*2+.5,r=[];for(let z=0;z<=5;z++){const w=z/5*2;r.push(c(s-.6+Math.cos(a)*Math.sin(w)*.55,h+.05+(1-Math.cos(w))*.42-.1,-1.6+Math.sin(a)*Math.sin(w)*.55))}o.tube(r,z=>.06-.03*z,4,t.iron,6)}const y=[[3.6,.97,2.2],[-3.9,.97,1.9],[.6,.97,2.6],[-1.5,.97,-2.5],[2.9,4.56,2],[-2.6,4.56,2.1],[.2,4.56,-2.2],[-.2,4.56,.6]];return u.shuffle(y).slice(0,6).forEach(([n,a,r])=>gt(o,u,t,n+u.range(-.3,.3),a,r,u()*6.283)),V}function zt(o,u,t){o.loft([[0,.02,.02],[0,.82,.72],[.12,.92,.82],[.7,.98,.88],[1.3,1.06,.95]].map(([m,d,i])=>({y:m,a:d,b:i,n:2.8})),16,t.wicker,1,{jit:0}),o.tube(Z(1.07,.96,2.8,1.31,18),.07,5,t.leather,6,{closed:!0}),o.tube(Z(.94,.84,2.8,.1,18),.05,4,t.woodDk,0,{closed:!0});for(let m=0;m<4;m++){const d=(m+.5)/4*Math.PI*2,i=X(1.02,.92,2.8,d,1.3),b=c(Math.cos(d)*.7,3,Math.sin(d)*.7);o.tube([i,c().lerpVectors(i,b,.5).multiply(c(1.12,1,1.12)),b],.045,4,t.iron,6)}o.tube(Z(.7,.7,2,3,12),.05,5,t.brass,4,{closed:!0}),o.loft([[2.6,.02],[2.6,.2],[3.1,.2],[3.22,.27]].map(([m,d])=>({y:m,a:d})),8,t.brass,4);for(let m=0;m<8;m++){const d=m/8*Math.PI*2;o.tube([c(Math.cos(d)*.7,3,Math.sin(d)*.7),c(Math.cos(d)*1.53,5.02,Math.sin(d)*1.53)],.022,3,t.rope,2)}o.tube(Z(1.535,1.535,2,5,20),.045,4,t.leather,6,{closed:!0});for(let m=0;m<5;m++){const d=m/5*Math.PI*2+.3,i=X(1.2,1.08,2.8,d,.75);o.setM(new f.Matrix4().setPosition(i)),o.blob(.14,.36,6,t.sack,3,.9),o.setM(null)}gt(o,u,t,.3,.1,.25,1),gt(o,u,t,-.35,.1,-.2,3.6)}function Pt(o,u){const t=u.map(P=>new f.Color(P)),[e,m,d,i,b,l,p]=t,M={};i.getHSL(M);const v=new f.Color().setHSL(et(M.h,.118,.7)+o.range(-.008,.008),.92,.52);p.getHSL(M);const I=new f.Color().setHSL((M.h-.014+o.range(-.008,.006)+1)%1,Math.min(1,M.s),M.l*.8).multiplyScalar(.8),C=(P,x)=>P.clone().multiplyScalar(x),S=(P,x,k)=>new f.Color(P,x,k),g={blue:C(e,.95),lav:C(m,.9),peach:C(d,.8),pgold:C(i,.8),cream:C(b,.8),dusk:C(l,.9),crimson:I,gold:C(v,.86),wicker:S(.46,.3,.14),wickerLt:S(.56,.39,.19),wood:S(.3,.17,.085),woodDk:S(.16,.09,.05),rope:S(.6,.5,.34),brass:S(.72,.5,.18),brassDk:S(.42,.27,.1),iron:S(.07,.07,.085),leather:S(.2,.09,.05),sack:S(.55,.47,.36),sackDk:S(.36,.28,.22),tank:S(.45,.44,.46),lamp:S(1,.6,.24),skin:S(.55,.36,.26),hat:S(.05,.045,.05)};return g.coats=[C(e,.5),C(l,.6),C(I,.7),S(.08,.08,.1),C(b,.6),S(.2,.13,.08)],g.flagCols=[g.crimson,g.gold,g.cream,g.peach,g.blue,g.lav],g.ways=[[g.blue,g.cream,g.peach],[g.lav,g.pgold,g.dusk],[g.peach,g.dusk,g.cream],[g.cream,g.crimson,g.gold],[g.blue,g.peach,g.cream],[g.dusk,g.lav,g.cream],[g.gold,g.blue,g.cream],[g.crimson,g.cream,g.gold]],g}async function It(o,u={}){const t=o.rng.fork?o.rng.fork("cloud-armada-hero"):o.rng,e=Pt(t,u.palette&&u.palette.length>=7?u.palette:yt),m=u.piece==="guard"?"guard":"flagship",d=new f.Group;d.name="cloud-armada-"+m;const i=lt(t),b=[],l=[],p=[],M=[],v=[],I=c(t.sign(),-.2,t.range(-.3,.3)).normalize(),C={};let S,g,P,x=null;const k=(A,B,E,U,j)=>{const q=[t()*6.283,j],H=[t.sign()*t.range(.025,.07),t()*6.283],_=t();return M.push({pos:A.clone().setY(A.y+5*B),h:17*B,colA:E[0],colB:E[1],colC:E[2],pattern:U,seed:_,gores:t.pick([12,12,24]),hero:!1,bob:q,spin:H}),v.push({pos:A.clone(),s:B,bob:q,spin:H,seed:_}),p.push({pos:A.clone().setY(A.y+3.25*B),r:.3*B,h:2.7*B,glow:3.6*B,seed:_,hero:!1,bob:q}),q};if(m==="flagship"){const A=[t()*6.283,.7],B=13,E=45,U=.09*E,j=t.pick([20,24,24,28]);x={pos:c(0,B,0),h:E,colA:e.crimson,colB:e.gold,colC:e.cream,pattern:t.int(0,2),seed:t(),gores:j,hero:!0,bob:A,spin:[0,t()*6.283]};const H=[[50,60,74,-31,-21],[130,60,74,-33,-22],[2,62,80,12,28],[182,60,78,4,20],[238,58,74,32,46],[304,62,82,26,42]].map(([O,Y,W,J,ht])=>{const ot=(O+t.range(-9,9))*Math.PI/180,tt=t.range(Y,W);return{th:ot,base:c(Math.cos(ot)*tt,t.range(J,ht),Math.sin(ot)*tt),s:t.range(.86,1.1)}}),_=kt(i,t,e,b,l,A,I,H.map(O=>O.th),B,U);await o.yield?.();const N=t.shuffle(e.ways.slice()),Q=t.shuffle([3,4,5,6,7,3,4]);C.consorts=[],H.forEach((O,Y)=>{const W=k(O.base,O.s,N[Y],Q[Y],t.range(.9,1.6));C.consorts.push(O.base.clone().setY(O.base.y+12*O.s)),mt(i,b,t,_[Y],O.base,t.range(5,9),A,W,{rad:.075,rope:e.rope,size:1.55,cols:[N[Y][0],N[Y][1],e.cream,e.crimson,e.gold],skip0:.05,skip1:.06,lamps:5.5,lampCol:e.lamp}),K(l,t,O.base.clone().setY(O.base.y+.2),I,t.range(6,9)*O.s,.9,t.pick([N[Y][0],N[Y][1]]),W);const J=Math.atan2(_[Y].z,_[Y].x);mt(i,b,t,_[Y],c(Math.cos(J)*17.9,B+.585*E,Math.sin(J)*17.9),4.6,A,A,{rad:.04,rope:e.rope,size:1.4,cols:[e.gold,e.cream,e.crimson],skip0:.04,skip1:.03})}),i.setBob(A);const G=B+E;i.tube(Z(1.7,1.7,2,G-.22,24),.12,6,e.brass,4,{closed:!0}),i.tube([c(0,G-.3,0),c(0,G+4,0)],O=>.13-.07*O,6,e.wood,0,{cap:!0});for(let O=0;O<4;O++){const Y=O/4*Math.PI*2;i.tube([c(Math.cos(Y)*1.7,G-.2,Math.sin(Y)*1.7),c(0,G+2.6,0)],.03,4,e.rope,2)}i.setM(new f.Matrix4().setPosition(0,G+4.1,0)),i.blob(.24,.5,8,e.brass,4),i.setM(null),K(l,t,c(0,G+3.7,0),I,t.range(17,22),2.1,e.crimson,A),K(l,t,c(0,G+2.5,0),I,t.range(11,14),1.5,e.gold,A);for(const O of[-.62,.62])p.push({pos:c(O,9.6,0),r:.62,h:6.4,glow:6.5,seed:t(),hero:!0,bob:A});S=80,g=62,P=c(0,30,0);const $=17.5+40;C.flyThrough=[c(-150,21,$+7),c(-75,24,$+1.5),c(0,27,$),c(75,30,$+2.5),c(150,34,$+9)],C.burner=c(0,9.8,0),C.envelopeCenter=c(0,38,0),C.crown=c(0,G,0),C.gondola=c(0,3.5,0),C.viewpoints=[{position:c(-95,22,$+4),target:c(0,30,0)},{position:c(-6,27,$),target:c(0,28,0)},{position:c(48,6,44),target:c(0,24,0)}]}else{const E=c(0,46,0),U=[],j=t.shuffle([[e.crimson,e.gold,e.cream],[e.blue,e.cream,e.gold],[e.lav,e.peach,e.cream]]),q=t.pick([3,4,6,7]),H=[];for(let _=0;_<6;_++){const N=_*Math.PI/3,Q=c(Math.cos(N)*48,46+Math.sin(N)*48,0);U.push(Q);const G=Q.clone().setY(Q.y-3),$=k(G,1,j[_%3],_%3===0?q:q===3?4:3,.45);H.push($),K(l,t,G.clone().setY(G.y+.3),I,t.range(8,11),1.1,j[_%3][0],$),K(l,t,G.clone().setY(G.y+1.3),I,t.range(5,7),.8,j[_%3][1],$),K(l,t,Q.clone(),c(I.x*.35,-1,0).normalize(),t.range(12,16),1.3,_%2?e.gold:e.crimson,$)}for(let _=0;_<6;_++){const N=(_+1)%6;mt(i,b,t,U[_],U[N],4.5,H[_],H[N],{rad:.07,rope:e.rope,size:2,cols:[e.crimson,e.gold,e.cream],skip0:.03,skip1:.03,lamps:4,lampR:.24,lampCol:e.lamp}),mt(i,b,t,U[_],U[N],10.5,H[_],H[N],{rad:.05,rope:e.rope,size:1.25,cols:[e.blue,e.cream,e.peach,e.lav],skip0:.04,skip1:.04})}S=62,g=46+48*.866+20,P=E.clone(),C.portalSeat={position:E.clone(),normal:c(0,0,1)},C.portalRadius=10,C.corners=U,C.flyThrough=[c(0,46,320),c(0,46,160),c(0,46,60),c(0,46,0)],C.viewpoints=[{position:c(0,46,230),target:E.clone()},{position:c(40,40,110),target:E.clone()}]}await o.yield?.();const V=[],T=xt();if(V.push(T),x){const A=x.gores;d.add(ut(ct(A*6,24,22,A,{bulge:.03}),T,[x]))}await o.yield?.(),d.add(ut(ct(72,14,13,12,{bulge:.034,fat:1.1}),T,M));const s=vt(!1);V.push(s);const h=new f.Mesh(i.geometry(!0),s);h.frustumCulled=!1,d.add(h),await o.yield?.();{const A=lt(t);zt(A,t,e);const B=A.geometry(!1),E=v.length,U=new f.Matrix4,j=vt(!0);V.push(j);const q=new f.InstancedMesh(B,j,E),H=new Float32Array(E*4),_=new Float32Array(E*4);v.forEach((N,Q)=>{U.makeScale(N.s,N.s,N.s).setPosition(N.pos),q.setMatrixAt(Q,U),H.set([0,N.seed,0,0],Q*4),_.set([N.bob[0],N.bob[1],N.spin[0],N.spin[1]],Q*4)}),B.setAttribute("iPar",new f.InstancedBufferAttribute(H,4)),B.setAttribute("iBob",new f.InstancedBufferAttribute(_,4)),q.frustumCulled=!1,d.add(q)}const y=ft(b,!1),n=ft(l,!0),a=wt(p);V.push(y.material,n.material,a.material),d.add(y,n,a);let r=0,z=0,w=u.autoFlare===!1;const L=(A,B=A)=>{w=!0,r=at(A,0,1),z=at(B,0,1)},D=A=>{r=rt(.12,.2,A)*(1-rt(.66,.74,A)),z=rt(.12,.36,A)*(1-rt(.72,1,A))**1.4},F=A=>{w=!0,D(at(A,0,1))},R=(A,B)=>{for(const E of V)E.uniforms.uSunOn&&(E.uniforms.uSunOn.value=A?1:0,A&&(E.uniforms.uSunDir.value.copy(A).normalize(),E.uniforms.uSunCol.value.copy(B)))};return u.sun&&R(u.sun.direction,u.sun.color),{object:d,radius:S,height:g,center:P,anchors:C,piece:m,ground:!1,groundY:0,setProgress:F,setBurn:L,setSun:R,update(A,B){w||D(((B-5)/14%1+1)%1);const E=r*(.9+.1*Math.sin(B*31)*Math.sin(B*17.3));for(const U of V)U.uniforms.uTime.value=B,U.uniforms.uFlame&&(U.uniforms.uFlame.value=E),U.uniforms.uGlow&&(U.uniforms.uGlow.value=z)},dispose(){}}}function Ft(o,u={}){const t=o.rng.fork?o.rng.fork("cloud-armada-fleet"):o.rng,e=Pt(t,u.palette&&u.palette.length>=7?u.palette:yt),m=new f.Group;m.name="cloud-armada-fleet";const d=(u.wind||c(1,-.2,.1)).clone().normalize(),i={near:{env:[],gon:[]},far:{env:[],gon:[]}},b=[],l=[],p=[],M=[e.ways[0],e.ways[1],e.ways[2],e.ways[4],e.ways[5],e.ways[6],[e.cream,e.peach,e.lav],[e.pgold,e.dusk,e.cream],[e.peach,e.cream,e.blue],[e.lav,e.cream,e.gold]],v=[e.ways[3],e.ways[7],[e.gold,e.crimson,e.cream]],I=[[[e.gold,e.cream,e.blue],[e.pgold,e.blue,e.cream],[e.peach,e.cream,e.gold],[e.cream,e.gold,e.peach]],[e.ways[1],e.ways[5],[e.lav,e.cream,e.peach],[e.cream,e.lav,e.dusk]],[e.ways[0],e.ways[4],[e.blue,e.pgold,e.dusk],[e.dusk,e.peach,e.blue]]],C=u.theme==null?null:I[(u.theme%3+3)%3];for(const s of u.balloons||[]){const h=s.s??1,y=s.pos,n=t.chance(s.hot??.12)?t.pick(v):C&&t.chance(.55)?t.pick(C):t.pick(M),a=[t()*6.283,s.bob??t.range(1.2,2.6)],r=[t.sign()*t.range(.03,.09),t()*6.283],z=t(),w=s.near?i.near:i.far;w.env.push({pos:y.clone().setY(y.y+5*h),h:17*h,colA:n[0],colB:n[1],colC:n[2],pattern:t.pick([3,4,5,6,7,3,4,7]),seed:z,gores:t.pick([12,12,24]),hero:!1,bob:a,spin:r}),w.gon.push({pos:y.clone(),s:h,bob:a,spin:r,seed:z}),b.push({pos:y.clone().setY(y.y+3.25*h),r:.3*h,h:2.7*h,glow:3.6*h,seed:z,hero:!1,bob:a}),s.near&&K(l,t,y.clone().setY(y.y+.2*h),d,t.range(7,11)*h,.95*h,t.pick([n[0],n[1]]),a),s.dressed&&Ct(p,l,t,y,h,a,[e.gold,e.crimson,e.cream,n[1]],d)}const S=[],g=xt();S.push(g);let P=0;const x=(s,h)=>{P+=(s.index?s.index.count:s.attributes.position.count)/3*h};if(i.near.env.length){const s=ct(48,10,10,12,{bulge:.034,fat:1.1});x(s,i.near.env.length),m.add(ut(s,g,i.near.env))}if(i.far.env.length){const s=ct(24,6,7,12,{bulge:.034,fat:1.1});x(s,i.far.env.length),m.add(ut(s,g,i.far.env))}const k=vt(!0);S.push(k);const V=(s,h)=>{const y=s.length;if(!y){h.dispose();return}const n=new f.InstancedMesh(h,k,y),a=new f.Matrix4,r=new Float32Array(y*4),z=new Float32Array(y*4);s.forEach((w,L)=>{a.makeScale(w.s,w.s,w.s).setPosition(w.pos),n.setMatrixAt(L,a),r.set([0,w.seed,0,0],L*4),z.set([w.bob[0],w.bob[1],w.spin[0],w.spin[1]],L*4)}),h.setAttribute("iPar",new f.InstancedBufferAttribute(r,4)),h.setAttribute("iBob",new f.InstancedBufferAttribute(z,4)),n.frustumCulled=!1,x(h,y),m.add(n)};{const s=lt(t);zt(s,t,e),V(i.near.gon,s.geometry(!1))}{const s=lt(t),h=2.8;s.loft([[0,.02,.02],[0,.84,.74],[1.3,1.06,.95]].map(([y,n,a])=>({y,a:n,b:a,n:h})),8,e.wicker,1,{jit:0}),s.tube(Z(1.07,.96,h,1.31,8),.09,3,e.leather,6,{closed:!0});for(let y=0;y<4;y++){const n=(y+.5)/4*Math.PI*2,a=X(1.02,.92,h,n,1.3),r=c(Math.cos(n)*.7,3,Math.sin(n)*.7);s.tube([a,r],.07,3,e.iron,6),s.tube([r,c(Math.cos(n)*1.53,5.02,Math.sin(n)*1.53)],.05,3,e.rope,2)}s.tube(Z(.7,.7,2,3,6),.09,3,e.brass,4,{closed:!0}),V(i.far.gon,s.geometry(!1))}if(b.length){const s=wt(b);S.push(s.material),x(s.geometry,b.length),m.add(s)}if(l.length){const s=ft(l,!0);S.push(s.material),x(s.geometry,l.length),m.add(s)}if(p.length){const s=ft(p,!1);S.push(s.material),x(s.geometry,p.length),m.add(s)}const T=(s,h)=>{for(const y of S)y.uniforms.uSunOn&&(y.uniforms.uSunOn.value=s?1:0,s&&(y.uniforms.uSunDir.value.copy(s).normalize(),y.uniforms.uSunCol.value.copy(h)))};return u.sun&&T(u.sun.direction,u.sun.color),{object:m,count:b.length,triangles:Math.round(P),setSun:T,update(s,h){for(const y of S)y.uniforms.uTime.value=h},dispose(){}}}export{Ft as buildFleet,It as buildHero};
