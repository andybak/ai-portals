import*as d from"three";import*as we from"../kit/fx.js";const E=Math.PI*2,Le=new d.Vector3(0,1,0),pe=we.GLSL_HASH+we.GLSL_VALUE_NOISE+we.GLSL_FBM,ae=(e,t,o)=>Math.min(o,Math.max(t,e)),Z=(e,t,o)=>e+(t-e)*o,he=(e,t,o)=>{const f=ae((o-e)/(t-e),0,1);return f*f*(3-2*f)},de=`
uniform float uTime; uniform vec3 uSunDir, uSunCol, uShade, uSkyTop, uGlow, uGlowDir, uFogC; uniform vec2 uBand; uniform float uFogD;
float sunAt(float y){ return smoothstep(uBand.x, uBand.y, y); }
vec3 skyLight(vec3 n){
  float up = clamp(n.y*.5+.5, 0., 1.);
  float east = clamp(dot(n, uGlowDir)*.5+.5, 0., 1.);
  return uShade*.9 + uSkyTop*up + uGlow*(.2+.7*east*east);
}
vec3 fogged(vec3 c, float d){ float f = 1.-exp(-uFogD*uFogD*d*d); return mix(c, uFogC, clamp(f, 0., 1.)); }
// the world's own rule for the dawn's rose and first gold: below the sun's band they fall wherever the land leaves
// the way to the east open (the canyon's gaps, the dawn side of the shore); tSunTop is the world's shade map
uniform sampler2D tSunTop; uniform vec4 uSunBox; uniform vec3 uRSun, uRGlow;
vec3 dawnRose(vec3 P, vec3 N){
  float top = texture2D(tSunTop, (P.xz - uSunBox.xy)*uSunBox.zw).b;
  float open = smoothstep(-1.5, 3., P.y - top)*(1. - smoothstep(uBand.x, uBand.y, P.y));
  return mix(uRGlow*1.3, uRSun*.5, smoothstep(45., 105., P.y))*open*clamp(dot(N, uSunDir)*.75 + .25, 0., 1.);
}
`,Be=`
uniform vec3 uRSky, uRShade, uRFire; uniform vec4 uRLake;
vec3 rockLight(vec3 P, vec3 N, float ao, float sunK){
  vec3 amb = mix(uRShade, uRSky, N.y*.5+.5);
  float gl = max(dot(N, uGlowDir), 0.);
  vec3 glow = uRGlow*(.16+.84*gl*gl);
  vec2 dl = P.xz - uRLake.xy; float rl = length(dl), kk = min(1., uRLake.z*.75/max(rl, 1e-3));
  vec3 Lv = vec3(uRLake.x + dl.x*kk, uRLake.w, uRLake.y + dl.y*kk) - P; float ll = length(Lv);
  float fire = max(dot(N, Lv/max(ll, 1e-3)), 0.)/(1.+ll*ll/1800.)*(1.-smoothstep(165., 215., rl));
  return uRSun*sunK*max(dot(N, uSunDir), 0.) + (amb+glow)*ao + uRFire*fire;
}
`,ze={real:{sea:[62,104,146,188,232],spouts:[48,92,138,182,226],gates:[290,332,374,416,458,500,542,584],ripple:[262,630],fire:[690,725,760,795,830],whirls:[700,762,824],vents:[712,776,842],rings:[985,1165],arcs:[965,1015,1070,1125,1180,1230],cleft:[860,945],stream:[950,1312]},demo:{sea:[14,37,60,83,106],spouts:[8,30,54,78,100],gates:[135,150,165,180,195,210,225,240],ripple:[128,247],fire:[272,296,320,344,368],whirls:[280,320,360],vents:[290,330,366],rings:[400,472],arcs:[393,409,427,445,463,481],cleft:[382,392],stream:[392,512]}};function Ie(e,t){const o=typeof t.line!="function",f=C=>Z(Z(Z(9,6,he(118,132,C)),14,he(248,264,C)),18,he(378,394,C)),W=o?C=>({p:new d.Vector3(C-260,f(C),0),t:new d.Vector3(1,0,0)}):t.line,A=C=>{const{p:H,t:c}=W(C),g=new d.Vector3(c.x,0,c.z);g.lengthSq()<1e-8&&g.set(1,0,0),g.normalize();const m=new d.Vector3(-g.z,0,g.x),s=new d.Vector3().crossVectors(m,c).normalize();return{p:H.clone(),t:c.clone().normalize(),fwd:g,right:m,n:s}},R=(C,H)=>new d.Color(C??H),G=(t.sunDir?t.sunDir.clone():new d.Vector3(.8627,.0872,.4981)).normalize(),B=new d.Vector3(Math.sin(105*Math.PI/180),.07,-Math.cos(105*Math.PI/180)).normalize(),U=t.sunBand||{y0:60,y1:150},p=t.fog||null,l={uTime:t.time&&typeof t.time=="object"?t.time:{value:0},uSunDir:{value:G},uSunCol:{value:R(t.sunColor,"#ffcf9a")},uShade:{value:R(t.shadeColor,"#3a3f7a")},uSkyTop:{value:R(t.skyTop,"#3f62b0")},uGlow:{value:R(t.skyGlow,"#ff9f78")},uGlowDir:{value:B},uBand:{value:new d.Vector2(U.y0,U.y1)},uFogC:{value:R(p&&p.color,"#5a6ea6")},uFogD:{value:p?p.density:0}},y=t.light||{};l.uRSun=y.uSunCol||{value:R(t.sunColor,"#ffcf9a").multiplyScalar(2.4)},l.uRSky=y.uSkyCol||{value:new d.Color(.196,.294,.665)},l.uRShade=y.uShadeCol||{value:new d.Color(.108,.117,.27)},l.uRGlow=y.uGlowCol||{value:new d.Color(.7,.392,.28)},l.uRFire=y.uFireCol||{value:new d.Color(2.4,.79,.144)},l.uRLake=y.uLake||{value:new d.Vector4(0,0,95,o?-1e4:t.lakeY??110)};const N=d.DataUtils.toHalfFloat,D=!o&&t.sunTop&&t.sunTop.texture?t.sunTop:null,X=new d.DataTexture(new Uint16Array([N(0),N(0),N(-6e4),N(1)]),1,1,d.RGBAFormat,d.HalfFloatType);X.needsUpdate=!0,l.tSunTop={value:D?D.texture:X},l.uSunBox={value:D&&D.box?D.box:new d.Vector4(0,0,1,1)};const i=o?{...l,uBand:{value:new d.Vector2(-1e3,-999)}}:l,T=typeof t.groundAt=="function"?t.groundAt:typeof t.floorAt=="function"?t.floorAt:null;return{demo:o,line:W,triad:A,U:l,UHigh:i,fog:p,places:o?ze.demo:ze.real,seaY:o?0:t.seaY??0,lakeY:o?0:t.lakeY??110,lake:o?null:t.lake||{x:0,z:0,r:95},groundAt:(C,H,c)=>{if(o||!T)return c;const g=T(C,H);return Number.isFinite(g)?g:c},pillars:Array.isArray(t.pillars)?t.pillars:null,ledges:!o&&Array.isArray(t.ledges)?t.ledges:null,sunTop:o?null:t.sunTop||null,detail:ae(t.detail??(e.quality&&e.quality.detail)??1,.4,1),density:ae(t.density??(e.vary&&e.vary.density)??1,.7,1.3),rng:C=>e.core.makeRng(e.core.hashSeed(C+":"+e.seed))}}function ve(e){const t={n:0,index:[],a:{}};for(const o of Object.keys(e))t.a[o]={size:e[o],data:[]};return t}function me(e){const t=new d.BufferGeometry;for(const o of Object.keys(e.a))t.setAttribute(o,new d.Float32BufferAttribute(e.a[o].data,e.a[o].size));return t.setIndex(e.n>65535?new d.Uint32BufferAttribute(e.index,1):new d.Uint16BufferAttribute(e.index,1)),t.computeBoundingSphere(),t}const Ce=`
  uniform vec4 uGustA[6], uGustB[6], uGustC[6];
  float gustAt(int i, float x, float t){
    vec4 A = uGustA[i], B = uGustB[i], C = uGustC[i];
    float len = max(C.w, 1.), sh = C.z*t, g = 0.;
    for (int j = 0; j < 5; j++) {
      float c = j < 4 ? A[j] : C.x, hl = j < 4 ? B[j] : C.y;
      float d = abs(mod(x - c - sh + .5*len, len) - .5*len);
      g = max(g, step(.5, hl)*(1. - smoothstep(.45*hl, max(hl, .5), d)));
    }
    return g;
  }`;async function be(e,t,o,f){const W=o.length,A=W*4,R=new Float32Array(A*3),G=new Float32Array(A*2),B=new Float32Array(A*3),U=new Float32Array(A*4),p=new Float32Array(A*4),l=new Float32Array(A*3),y=new Float32Array(A*4),N=A>65535?new Uint32Array(W*6):new Uint16Array(W*6),D=[-1,1,1,-1],X=[-1,-1,1,1],i=[0,0,0,0],T=[1,1,1];for(let g=0;g<W;g++){const m=o[g],s=m.gate||i,v=m.col||T,x=m.p,w=m.v,V=m.grav||0,F=m.alpha??1;for(let Y=0;Y<4;Y++){const Q=g*4+Y,K=Q*2,_=Q*3,q=Q*4;R[_]=x[0],R[_+1]=x[1],R[_+2]=x[2],G[K]=D[Y],G[K+1]=X[Y],B[_]=w[0],B[_+1]=w[1],B[_+2]=w[2],U[q]=m.life,U[q+1]=m.phase,U[q+2]=m.s0,U[q+3]=m.s1,p[q]=m.kind,p[q+1]=V,p[q+2]=m.seed,p[q+3]=F,l[_]=v[0],l[_+1]=v[1],l[_+2]=v[2],y[q]=s[0],y[q+1]=s[1],y[q+2]=s[2],y[q+3]=s[3]}const P=g*4,j=g*6;N[j]=P,N[j+1]=P+1,N[j+2]=P+2,N[j+3]=P,N[j+4]=P+2,N[j+5]=P+3,(g&2047)===2047&&await e.yield()}const C=new d.BufferGeometry;C.setAttribute("position",new d.BufferAttribute(R,3)),C.setAttribute("aCorner",new d.BufferAttribute(G,2)),C.setAttribute("aVel",new d.BufferAttribute(B,3)),C.setAttribute("aLife",new d.BufferAttribute(U,4)),C.setAttribute("aLook",new d.BufferAttribute(p,4)),C.setAttribute("aTintC",new d.BufferAttribute(l,3)),C.setAttribute("aGate",new d.BufferAttribute(y,4)),C.setIndex(new d.BufferAttribute(N,1)),C.computeBoundingSphere(),await e.yield(),C.boundingSphere.radius+=70;const H=new d.ShaderMaterial({uniforms:{...t},transparent:!0,depthWrite:!1,blending:d.CustomBlending,blendSrc:d.OneFactor,blendDst:d.OneMinusSrcAlphaFactor,vertexShader:Ce+`
      uniform float uTime;
      attribute vec2 aCorner; attribute vec3 aVel, aTintC; attribute vec4 aLife, aLook, aGate;
      varying vec2 vC; varying vec3 vTint, vW; varying vec4 vLook; varying float vAge, vFade;
      void main(){
        float age = fract(uTime/max(aLife.x, .01) + aLife.y), tt = age*aLife.x, kind = aLook.x;
        vec3 c = position + aVel*tt + vec3(0., -.5*aLook.y*tt*tt, 0.);
        float wound = step(5.5, kind)*step(kind, 7.5), petal = step(7.5, kind);
        float wa = aLook.z*6.2832 + tt*1.1 + uTime*.35;
        c.xz += wound*vec2(cos(wa), sin(wa))*(.7 + 2.6*age*age + 1.3*sin(tt*.7 + aLook.z*40.))*mix(.45, 1., step(6.5, kind));
        float size = mix(aLife.z, aLife.w, age);
        vec4 mv = viewMatrix*modelMatrix*vec4(c, 1.);
        vec2 off = aCorner*size;
        float streak = step(.5, kind)*step(kind, 1.5) + step(2.5, kind)*step(kind, 3.5);
        vec3 vel = (viewMatrix*vec4(aVel + vec3(0., -aLook.y*tt, 0.), 0.)).xyz;
        float sp = length(vel.xy);
        vec2 d = vel.xy/max(sp, 1e-3);
        vec2 so = d*aCorner.y*size*(1. + min(sp*.16, 5.)) + vec2(-d.y, d.x)*aCorner.x*size;
        off = mix(off, so, streak*step(1e-3, sp));
        // a petal turns and flips as it flies
        float spin = aLook.z*40. + uTime*(1.2 + aLook.z*2.);
        vec2 pc = aCorner*vec2(1., .62);
        pc = vec2(pc.x*cos(spin) - pc.y*sin(spin), pc.x*sin(spin) + pc.y*cos(spin));
        pc.x *= .3 + .7*abs(sin(uTime*(1.7 + aLook.z*3.) + aLook.z*90.));
        off = mix(off, pc*size, petal);
        mv.y += petal*sin(tt*1.3 + aLook.z*50.)*.45;
        mv.xy += off;
        gl_Position = projectionMatrix*mv;
        float front = aGate.y + aGate.z*sin(uTime*.349 + aGate.w);
        float gate = mix(1., 1.-smoothstep(.02, .06, abs(aGate.x - front)), step(1e-4, aGate.z));
        // a negative amp marks a canyon gate's clock: shown only between two moments (x to y) of that gate's cycle
        float gtau = mod(uTime + aGate.w, ${te.cycle.toFixed(1)});
        gate = mix(gate, smoothstep(aGate.x - .5, aGate.x + .5, gtau)*(1.-smoothstep(aGate.y - .3, aGate.y + 1.2, gtau)), step(aGate.z, -1e-4));
        // media thin only close to the lens, by the TRUE distance from it (2.5 m down to 0.6 m); what must not come
        // near the lens is kept off the line by place
        // a petal of an arc (its gate carries its place along the arc in metres and the arc's number) shows while a gust
        // of that arc passes the place it flies at
        float ofArc = petal*step(.5, aGate.y);
        float gst = gustAt(int(clamp(aGate.y, 1., 6.) - .5), aGate.x + length(aVel)*(tt - .5*aLife.x), uTime);
        vFade = gate*mix(1., gst, ofArc)*smoothstep(.6, 2.5, length(mv.xyz))*aLook.w;
        vC = aCorner; vTint = aTintC; vLook = aLook; vAge = age; vW = (modelMatrix*vec4(c, 1.)).xyz;
      }`,fragmentShader:pe+de+`
      varying vec2 vC; varying vec3 vTint, vW; varying vec4 vLook; varying float vAge, vFade;
      void main(){
        float kind = vLook.x, r = length(vC), age = clamp(vAge, 0., 1.);
        float soft = step(kind, .5) + step(3.5, kind)*step(kind, 6.5);
        float fire = step(1.5, kind)*step(kind, 3.5) + step(6.5, kind)*step(kind, 7.5), petal = step(7.5, kind);
        float dusty = step(3.5, kind)*step(kind, 4.5);
        float nz = fbm(vC*1.7 + vLook.z*37. + vec2(0., age*1.3));
        float aSoft = smoothstep(1., .2, r + (nz-.5)*mix(.9, .3, dusty))*smoothstep(1., .72, r)*smoothstep(0., .1, age)*(1.-smoothstep(.55, 1., age));
        float aHard = smoothstep(1., .55, r)*smoothstep(0., .04, age)*(1.-smoothstep(.9, 1., age));
        float aFire = smoothstep(1., .1, r + (nz-.5)*.8)*smoothstep(0., .06, age)*(1.-smoothstep(.7, 1., age));
        float a = mix(aHard, aSoft, soft);
        a = mix(a, aFire, step(1.5, kind)*step(kind, 2.5) + step(6.5, kind)*step(kind, 7.5));
        a = mix(a, smoothstep(1., .78, r)*smoothstep(0., .12, age)*(1.-smoothstep(.86, 1., age)), petal);
        // a petal finer than a pixel gives its cover, as a mip does (by the quad's own footprint)
        a *= mix(1., 1. - smoothstep(1.2, 4., max(fwidth(vC.x), fwidth(vC.y))), petal);
        float sun = sunAt(vW.y);
        vec3 lit = mix(vec3(.7, .8, 1.), vec3(1.1, .98, .84), sun) + uGlow*.12;
        // spray and dust take the dawn's rose and gold where they pass through a band of it
        lit += dawnRose(vW, uSunDir)*mix(.2, .3, dusty);
        lit = mix(lit, min(lit, vec3(.95)), dusty);
        vec3 col = vTint*lit*mix(.8 + .35*nz, .78 + .3*fract(vLook.z*17.), petal);
        // fire cools as it ages: pale yellow, orange, deep red; it goes out while it glows
        float heat = clamp(1.25 - age*1.25 - r*.35 + (nz-.5)*.4, 0., 1.);
        vec3 fc = mix(vec3(.5, .03, .006), vec3(.9, .06, .01), smoothstep(.05, .35, heat));
        fc = mix(fc, vec3(1., .254, .023), smoothstep(.3, .65, heat));
        fc = mix(fc, vec3(1., .6, .2), smoothstep(.8, 1., heat));
        fc *= .6 + .85*heat;
        col = mix(col, fc*vTint, fire);
        a *= vFade*mix(1., smoothstep(.1, .42, heat), fire);
        col = fogged(col, distance(vW, cameraPosition)*mix(1., .5, fire));
        float keep = mix(1., .25 + .75*(1.-heat), fire);
        gl_FragColor = vec4(col*a, a*keep);
      }`}),c=new d.Mesh(C,H);return c.renderOrder=f||6,{mesh:c,triangles:o.length*2}}function ge(e,t){const o=t.nu,f=t.nv,W=e.n,A=new d.Vector3,R=new d.Vector3,G=new d.Vector3;let B=0,U=null;for(let p=0;p<=o;p++){const l=p/o,y=t.point(l),N=t.across(l),D=t.half(l);U&&(B+=y.distanceTo(U)),U=y,R.subVectors(t.point(Math.min(1,l+.002)),t.point(Math.max(0,l-.002))).normalize(),G.crossVectors(R,N).normalize(),t.out&&G.dot(t.out(l))<0&&G.negate();const X=t.cup?t.cup(l):0;for(let i=0;i<=f;i++){const T=i/f*2-1;A.copy(y).addScaledVector(N,D*T).addScaledVector(G,-X*D*T*T),e.a.position.data.push(A.x,A.y,A.z),e.a.normal.data.push(G.x,G.y,G.z),e.a.uv.data.push(l,T),e.a.aMet.data.push(B,D*T),t.extra&&t.extra(e,l,T,A)}}for(let p=0;p<o;p++)for(let l=0;l<f;l++){const y=W+p*(f+1)+l,N=y+f+1;e.index.push(y,N,y+1,y+1,N,N+1)}return e.n+=(o+1)*(f+1),B}function Fe(e,t,o,f,W,A,R){const G=p=>{const l=Z(t*o,-t*f,p),y=W+A*4*p*(1-p);return new d.Vector3(e.p.x+e.right.x*l,y,e.p.z+e.right.z*l)},B=p=>{const l=-t*(o+f),y=A*4*(1-2*p),N=Math.hypot(l,y)||1,D=t*y/N,X=-t*l/N;return new d.Vector3(e.right.x*D,X,e.right.z*D)};return{point:G,across:p=>{const l=typeof R=="function"?R(p):R,y=B(p);return new d.Vector3(e.fwd.x*Math.cos(l)+y.x*Math.sin(l),y.y*Math.sin(l),e.fwd.z*Math.cos(l)+y.z*Math.sin(l)).normalize()},out:B}}async function Pe(e,t){const o=e.rng("led-sea"),f=ve({position:3,normal:3,uv:2,aMet:2,aArch:4}),W=[[1.3,0],[.84,.09],[.5,.1],[.15,.085],[-.3,0]],A=[];for(let c=0;c<e.places.sea.length;c++){const g=e.triad(e.places.sea[c]),m=o.sign(),s=o.range(30,36),v=o.range(30,36),x=Math.max(e.seaY+o.range(26,29),g.p.y+17.2)+(c===4?1:0),w=e.seaY-1.5,V=x-w,F=o.range(6.6,8),P=o.range(3.9,4.6),j=o(),Y=o()*E,K=Fe(g,m,s,v,w,V,u=>.88-.14*Math.pow(Math.abs(2*u-1),2)),_=W[Math.min(c,W.length-1)],q=o.range(7,11),a=o.range(17,26),n=o()*E,k=u=>Z(P,F,Math.pow(Math.abs(2*u-1),1.6))*(1+.2*Math.sin(u*q+n)+.11*Math.sin(u*a+n*2)),r=Math.round(96*(.6+.4*e.detail));ge(f,{nu:r,nv:12,point:K.point,across:K.across,out:K.out,half:k,cup:()=>.16,extra:u=>u.a.aArch.data.push(j,_[0],_[1],Y)}),await e.yield();const b=u=>{const S=K.point(u),I=K.across(u),O=k(u)*.9;return S.addScaledVector(I,-O)},h=u=>Math.max(.05,Math.min(2.5,(b(u).y-e.seaY)*.45)),z=u=>{const S=ae((Math.abs(2*u-1)-.15)/.25,0,1);return h(u)*(1+.8*S*S*(3-2*S))};ge(f,{nu:r,nv:4,point:u=>{const S=b(u);return S.y-=z(u),S},across:()=>new d.Vector3(0,-1,0),half:z,extra:u=>u.a.aArch.data.push(j+2,_[0],_[1],Y)}),await e.yield();let L=1e9,M=1e9;for(let u=-16;u<=16;u+=1){const S=e.line(e.places.sea[c]+u).p;for(let I=2;I<=38;I++){const O=I/40,J=b(O),ee=Math.min(3,h(O)*1.2);L=Math.min(L,Math.hypot(J.x-S.x,J.y-ee-S.y,J.z-S.z)),u===0&&Math.hypot(J.x-S.x,J.z-S.z)<6&&(M=Math.min(M,J.y-ee-S.y))}}A.push({F:g,side:m,dA:s,dB:v,y0:w,H:V,seed:j,A:K,fr:_,ph:Y,half:k,iceClear:L,iceOver:M}),await e.yield()}const R=new d.ShaderMaterial({uniforms:{...e.U},transparent:!0,depthWrite:!1,side:d.DoubleSide,blending:d.CustomBlending,blendSrc:d.OneFactor,blendDst:d.OneMinusSrcAlphaFactor,vertexShader:`
      uniform float uTime; attribute vec2 aMet; attribute vec4 aArch;
      varying vec2 vUv, vMet; varying vec4 vArch; varying vec3 vN, vW; varying float vFront;
      void main(){
        vUv = uv; vMet = aMet; vArch = aArch;
        vFront = aArch.y + aArch.z*sin(uTime*.349 + aArch.w);
        float wet = 1.-smoothstep(vFront-.03, vFront+.03, uv.x);
        vec3 p = position + normal*((sin(aMet.x*.33 - uTime*2.1 + aArch.x*40.)*.55 + sin(aMet.x*.9 - uTime*4. + aMet.y*.7)*.22)*wet);
        // spray ice is lumpy: the frozen part swells and pits where it stands (nothing of it moves)
        float sd0 = fract(aArch.x);
        p += normal*((sin(aMet.x*.83 + sd0*40.)*sin(aMet.y*1.17 + sd0*17.)*.75 + sin(aMet.x*2.1 + aMet.y*1.7 + sd0*9.)*.35)*(1.-wet)*step(aArch.x, 1.5));
        vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal);
        gl_Position = projectionMatrix*viewMatrix*w;
        #ifdef FIRM
        // the firm pass draws the band's dense body only: what hangs under it stays out
        if (aArch.x > 1.5) gl_Position = vec4(2., 2., 2., 1.);
        #endif
      }`,fragmentShader:pe+de+`
      varying vec2 vUv, vMet; varying vec4 vArch; varying vec3 vN, vW; varying float vFront;
      void main(){
        float u = clamp(vUv.x, 0., 1.), v = clamp(vUv.y, -1., 1.), e = 1.-abs(v);
        float ice = smoothstep(vFront-.012, vFront+.012, u);
        float hung = step(1.5, vArch.x), sd = fract(vArch.x);
        if (hung > .5) {
          // the veil under the running water: streaks that fall and break into drops; under the ice: icicles
          float vv = v*.5+.5;
          float kd = 1. + .8*smoothstep(.15, .4, abs(2.*u - 1.));
          // DISTINCT ICICLES under the ice: separate tapering spikes with gaps between, crisp by their own footprint;
          // under the running water the same law draws separate falling strands, not a smear
          float cell = vMet.x*2.1 + sd*13., fr = fract(cell), hh = hash11(floor(cell) + sd*7.);
          float len = (.3 + .7*hh*hh)*.6*step(.3, hh);
          float wd = clamp(1.-abs(2.*fr-1.)*1.25, 0., 1.);
          float dI = len*pow(wd, 1.3)/kd - vv;
          float ai2 = clamp(dI/max(fwidth(dI), 1e-4) + .5, 0., 1.);
          float lenW = (.2 + .8*hh*hh)*.62*(.7 + .3*sin(uTime*(1.1 + hh*2.3) + hh*40.))*step(.38, hh);
          float dW = lenW*pow(wd, 1.1) - vv;
          float aS = clamp(dW/max(fwidth(dW), 1e-4) + .5, 0., 1.);
          // THE TORN CURTAIN under the running water, at every clock: fingers and tatters of unequal length (2 to 9 m)
          // that fall with the water and break into holes and drops; white where thick, glassy blue-green where thin
          float fl = .22 + .78*smoothstep(.25, .75, fbm(vec2(vMet.x*.19 + sd*61., uTime*.09)));
          float rag = fbm(vec2(vMet.x*1.1 + sd*17., vv*2.4 - uTime*1.5));
          float tat = fl - vv + (rag - .5)*.55;
          float holes = fbm(vec2(vMet.x*.5 + sd*90., vv*1.5 - uTime*1.25));
          float veil = smoothstep(0., .22, tat)*smoothstep(.28, .52, holes + (1. - vv)*.38);
          float aV = max(veil, aS*.85);
          vec3 cV = mix(vec3(.38, .64, .66), vec3(.84, .91, .97), smoothstep(.25, .8, veil + .3*wd*aS));
          vec3 c2 = mix(cV, mix(vec3(.42, .6, .82), vec3(.8, .9, .97), wd), ice);
          float a2 = mix(aV, ai2, ice);
          c2 = fogged(min(c2 + c2*dawnRose(vW, uSunDir)*.25 + uGlow*.04, vec3(.9, .94, .97)), distance(vW, cameraPosition));
          gl_FragColor = vec4(c2*a2, a2);
          return;
        }
        vec2 q = vec2(vMet.x*.16 - uTime*1.7, vMet.y*.85) + sd*31.;
        float n1 = fbm(q), n2 = fbm(q*vec2(2.3, 2.7) + 5.);
        // torn along both edges into fingers that run with the water, more and more toward the falling foot
        float tear = mix(.5, .92, u);
        float fing = fbm(vec2(vMet.x*.09 - uTime*.95, vMet.y*1.5) + vArch.x*77.);
        float hole = fbm(vec2(vMet.x*.055 - uTime*.5, vMet.y*.22) + sd*19.);
        // A BROAD RAGGED SHEET: whole down to its low edge, where the torn curtain hangs; its upper edge torn into lumps
        // and tongues of spray thrown 0.5 to 2.5 m up at uneven places (sized in metres on the sheet), never a clean curve
        float hM = abs(vMet.y)/max(abs(v), .08);
        float tg = fbm(vec2(vMet.x*.42 - uTime*1.1, uTime*.21) + sd*41.), tg2 = fbm(vec2(vMet.x*1.6 - uTime*2.4, 7.) + sd*13.);
        float cutT = min(2.7 - 2.3*smoothstep(.3, .72, tg) + (tg2 - .5)*1.1, .7*hM)/max(hM, .5);
        float top = mix(1., (1. - v) - cutT - tear*.15*fing, smoothstep(.02, .1, v));
        float bot = (1. + v) - .04 + (n2 - .5)*.1;
        float bodyv = min(top, bot + .25)*1.25 + (n1-.5)*.4*tear + (n2-.5)*.2 - smoothstep(.52, .78, hole)*(.2 + .8*u);
        float aw = smoothstep(0., .16, bodyv);
        // the ice: lumpy and whole, its low edge a fringe of icicles
        float ni = fbm(vec2(vMet.x*.45, vMet.y*.7) + vArch.x*17.);
        float ai = smoothstep(0., .06, e*1.7 + (ni-.5)*1.1 - .12);
        vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
        float up = clamp(n.y*.5+.5, 0., 1.), east = clamp(dot(n, uGlowDir), 0., 1.);
        // RUNNING WATER IS WHITE AND RAGGED: torn curtains of foam with gaps between, never a smooth coloured band
        float streak = fbm(vec2(vMet.x*.5 - uTime*5.2, vMet.y*2.4) + vArch.x*5.);
        float edge = 1.-smoothstep(0., .42, bodyv);
        float foam = smoothstep(.42, .74, streak*.55 + n2*.3 + edge*.62 + u*.1);
        vec3 cw = mix(vec3(.66, .75, .86), vec3(.93, .97, 1.), clamp(.2 + .45*up + .45*foam, 0., 1.));
        float thin = smoothstep(.3, .58, streak*.5 + n2*.36 + n1*.26 + edge*.3);
        cw = mix(vec3(.38, .64, .66), cw, clamp(thin*smoothstep(.02, .4, bodyv) + foam*.3, 0., 1.));
        float lump = fbm(vec2(vMet.x*1.3, vMet.y*1.6) + vArch.x*3.);
        float lump2 = fbm(vec2(vMet.x*.42, vMet.y*.5) + sd*11.);
        vec3 ci = mix(vec3(.4, .58, .8), vec3(.79, .905, 1.), clamp(up*1.05 - .1 + (lump-.5)*.8 + (lump2-.5)*1.1, 0., 1.));
        ci *= .82 + .3*lump2;
        vec3 alb = mix(cw, ci, ice);
        // WHITE WATER AND ICE KEEP THEIR FORM: lit they stay under full white, pale blue in the creases and underneath
        float sunI = sunAt(vW.y)*clamp(dot(n, uSunDir), 0., 1.);
        vec3 col = alb*(.66 + .22*up + .3*sunI) + alb*dawnRose(vW, n)*.4 + uGlow*east*east*.1;
        col = min(col, vec3(.9, .94, .97));
        float a = mix(aw*thin, ai, ice);
        col = fogged(col, distance(vW, cameraPosition));
        #ifdef FIRM
        // the firm pass: where the body is dense it is opaque and writes depth, so no second outline shows through it
        gl_FragColor = vec4(col, 1.);
        if (a < .6) discard;
        #else
        gl_FragColor = vec4(col*a, a);
        #endif
      }`}),G=new d.Mesh(me(f),R);G.renderOrder=2,t.add(G);const B=new d.Mesh(G.geometry,new d.ShaderMaterial({uniforms:R.uniforms,defines:{FIRM:1},side:d.DoubleSide,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:1,vertexShader:R.vertexShader,fragmentShader:R.fragmentShader}));t.add(B),await e.yield();const U=[],p=e.rng("led-sea-spray"),l=.5+.5*e.detail,y=9.8,N=[.95,.98,1],D=[.74,.8,.87],X=(c,g)=>{for(let m=0;m<Math.round(12*g*l);m++)U.push({p:[c.x+p.range(-3.5,3.5),e.seaY+.4,c.z+p.range(-3.5,3.5)],v:[p.range(-.5,.5),p.range(.8,1.8),p.range(-.5,.5)],life:p.range(3,5),phase:p(),s0:1.3,s1:p.range(3,4.6),kind:0,seed:p(),alpha:.34,col:D});for(let m=0;m<Math.round(14*g*l);m++){const s=p.range(5,9);U.push({p:[c.x+p.range(-4,4),e.seaY,c.z+p.range(-5,5)],v:[p.range(-2.2,2.2),s,p.range(-2.2,2.2)],life:2*s/y,phase:p(),s0:p.range(.15,.25),s1:.18,kind:1,grav:y,seed:p(),alpha:.5,col:D})}};for(const c of A){const g=c.fr[0]-c.fr[1];g>.04&&X(c.A.point(.02),1),c.fr[0]>1&&X(c.A.point(.98),1.3);const m=Math.round(34*l*ae(g,0,1));for(let s=0;s<m;s++){const v=p.range(.05,Math.max(.06,Math.min(.3,g-.02))),x=c.fr[0]>1&&s&1?1-v:v,w=c.A.point(x),V=c.A.across(x),F=c.half(x)*p.range(.7,1.02),P=w.y-V.y*F,j=Math.max(1,P-e.seaY),Y=c.A.point(Math.min(1,x+.01)).sub(w).normalize(),Q=Y.y*3;U.push({p:[w.x-V.x*F,P,w.z-V.z*F],v:[Y.x*3+p.range(-.6,.6),Q,Y.z*3+p.range(-.6,.6)],life:(Q+Math.sqrt(Q*Q+2*y*j))/y,phase:p(),s0:p.range(.14,.24),s1:.18,kind:1,grav:y,seed:p(),alpha:.5,col:D})}if(c.fr[1]>0)for(let s=0;s<Math.round(46*l);s++){const v=ae(c.fr[0]+c.fr[1]*p.range(-1,1),.02,.98),x=c.A.point(v),w=c.A.out(v);U.push({p:[x.x+p.range(-3,3),x.y+p.range(-1.5,1.5),x.z+p.range(-3,3)],v:[w.x*3+p.range(-2,2),w.y*3+p.range(0,3),w.z*3+p.range(-2,2)],life:p.range(1.2,2.2),phase:p(),s0:1.3,s1:p.range(2.8,4.6),kind:0,seed:p(),alpha:.5,col:D,gate:[v,c.fr[0],c.fr[1],c.ph]})}}await e.yield();const i=e.rng("led-sea-foam"),T=Math.round(108*l),C=[];for(const c of A)for(const g of[.015,.985]){const m=c.A.point(g),s=[];for(let v=0;v<6;v++)s.push({an:i()*E,r:i.range(2.5,7),ph:i(),spread:i.range(.8,2)});C.push({f:m,patches:s})}for(const c of C)for(let g=0;g<T;g++){const m=c.patches[g%6],s=m.an+i.range(-1,1)*m.spread/m.r,v=m.r+i.range(-1,1)*m.spread,x=Math.cos(s),w=Math.sin(s),V=i.range(.4,1.2);U.push({p:[c.f.x+x*v,e.seaY+.2,c.f.z+w*v],v:[x*V,0,w*V],life:i.range(3,5),phase:m.ph+i.range(-.08,.08),s0:i.range(.25,.7),s1:i.range(.7,2.6),kind:0,seed:i(),alpha:i.range(.22,.46),col:D})}await e.yield();const H=await be(e,e.U,U,6);return t.add(H.mesh),e.note.sea=A.map((c,g)=>({s:e.places.sea[g],iceClear:+c.iceClear.toFixed(2),lowestOverLens:+c.iceOver.toFixed(2),side:c.side})),{triangles:f.index.length/3*2+H.triangles,calls:3}}const te={cycle:21,close:4.5,stand:11,open:4.5,step:21/8,spacing:42};function De(e,t){const o=t.rng,f=t.L,W=t.W/2,A=t.root,R=4,G=8,B=[o.range(.42,.58),o.range(.42,.58)],U=[o.range(.06,.34),o.range(.06,.34)],p=[o.range(.06,.15),o.range(.06,.15)],l=[o.int(2,4),o.int(2,4)],y=[0,1].map(()=>{const a=o()<.5,n=[0,1,2,3,4].map(()=>o.range(.3,1.7));return[0,1,2,3].map(k=>{const r=k%2===0===a,b=o(),h=o();return{gap:n[k],end:n[k+1],deep:r?1.7+1.3*b:.5+.8*b,len:r?4+6*h:1.2+2.3*h,rise:o.range(.3,3.2),fall:o.range(.4,5)}})}),N=[0,1,2,3].map(()=>o.range(0,.4)),D=[0,.25+o.range(-.07,.07),.5+o.range(-.07,.07),.75+o.range(-.07,.07),1],X=o.range(.45,.55),i=(a,n)=>{const k=W*(1-B[a]*ae(n/f,0,1));let r=0,b=0,h=y[a][l[a]-1].end;for(let M=0;M<l[a];M++)h+=y[a][M].gap;for(let M=0;M<l[a];M++){const u=y[a][M];b+=u.gap;const S=f*(.05+.8*b/h),I=Math.min(u.deep,.35*W*(1-B[a]*S/f)),O=S+Math.max(u.rise,u.len),J=O+u.fall,ee=n<S?0:n<S+u.rise?I*(n-S)/u.rise:n<O?I:n<J?I*(J-n)/u.fall:0;ee>r&&(r=ee)}r+=.9*g(a,n,a?W:-W);const z=f*(1-U[a]);let L=k-r;return n>z&&(L=Z(L,p[a]*t.W,(n-z)/(f-z))),Math.max(L,.3)},T=a=>t.tFoot*(1-(1-X)*ae(a/f,0,1)),C=Math.ceil((f+A)/5)+2,H=Math.ceil(t.W/5)+2,c=[0,1].map(()=>{const a=[];for(let n=0;n<C*H;n++)a.push(o());return a}),g=(a,n,k)=>{const r=(n+A)/5,b=(k+W)/5,h=Math.min(C-2,Math.max(0,Math.floor(r))),z=Math.min(H-2,Math.max(0,Math.floor(b))),L=he(0,1,r-h),M=he(0,1,b-z),u=c[a];return .45*Z(Z(u[z*C+h],u[z*C+h+1],L),Z(u[(z+1)*C+h],u[(z+1)*C+h+1],L),M)},m=[o.int(2,4),o.int(2,4)],s=[0,1].map(()=>[0,1,2,3].map(()=>({at:o(),slope:o.range(-.7,.7),toHead:o()<.7,jog:[0,1,2,3,4,5,6,7].map(()=>o.range(-1.7,1.7))}))),v=Math.max(14,Math.round((f+A)/.9)),x=[],w=[[],[]],V=(f+A)/v;for(let a=0;a<=v;a++){const n=-A+(f+A)*a/v;x.push(n),w[0].push(i(0,n)),w[1].push(i(1,n))}for(const a of s)for(const n of a){let k=0;n.edge=n.jog.map(r=>k+=1.2+2.6*Math.abs(r)/1.7)}const F=(a,n)=>{let k=0;for(;k<7&&a.edge[k]<n+W;)k++;return k},P=(a,n,k)=>{const r=[];for(let h=0;h<m[a];h++){const z=s[a][h];r.push(f*(.1+.8*(h+z.at)/m[a])+z.slope*k+z.jog[F(z,k)])}r.sort((h,z)=>h-z);let b=0;for(let h=0;h<r.length;h++)h&&(r[h]=Math.max(r[h],r[h-1]+2.2)),b+=ae((s[a][h].toHead?n-r[h]:r[h]-n)/V+.5,0,1);return b},j=(a,n,k)=>{const r=N[a]*(.25+.75*g(a&1,x[n],a*5-W)/.45),b=-Math.max(w[0][n]-r,.25),h=Math.max(w[1][n]-r,.25);return[n===v?f-r:x[n],Z(b,h,k/G)]},Y=(a,n,k,r,b,h,z=0)=>{const L=Math.cos(t.pose),M=Math.sin(t.pose),u=a*L-k*M,S=a*M+k*L;return e.a.position.data.push(t.hinge.x+t.inw.x*u+t.upn.x*S+t.tan.x*n,t.hinge.y+t.inw.y*u+t.upn.y*S+t.tan.y*n,t.hinge.z+t.inw.z*u+t.upn.z*S+t.tan.z*n),e.a.normal.data.push(r,b,h),e.a.aLoc.data.push(a,n,k),e.a.aHinge.data.push(t.hinge.x,t.hinge.y,t.hinge.z),e.a.aInw.data.push(t.inw.x,t.inw.y,t.inw.z),e.a.aTan.data.push(t.tan.x,t.tan.y,t.tan.z),e.a.aUpn.data.push(t.upn.x,t.upn.y,t.upn.z),e.a.aTurn.data.push(t.aC,t.aO,t.phase,t.kind),e.a.aTint.data.push(t.seed,t.bed+z),e.n++},Q=[];for(const a of[0,1]){const n=a?R-1:0,k=e.n,r=[],b=a?1:-1;for(let h=0;h<=v;h++){r.push([]);for(let z=0;z<=G;z++){const L=j(n,h,z),M=T(L[0]),u=.4*g(a,L[0],L[1]);r[h].push([L[0],L[1],a?M-u:u,P(a,L[0],L[1])])}}for(let h=0;h<=v;h++)for(let z=0;z<=G;z++){const L=r[Math.max(0,h-1)][z],M=r[Math.min(v,h+1)][z],u=r[h][Math.max(0,z-1)],S=r[h][Math.min(G,z+1)],I=r[h][z],O=(M[2]-L[2])/Math.max(M[0]-L[0],.001),J=(S[2]-u[2])/Math.max(S[1]-u[1],.001),ee=Math.hypot(O,J,1);Y(I[0],I[1],I[2],-b*O/ee,-b*J/ee,b/ee,I[3]/23)}for(let h=0;h<v;h++)for(let z=0;z<G;z++){const L=k+h*(G+1)+z,M=L+G+1;e.index.push(L,M,L+1,L+1,M,M+1)}Q.push(r)}const K=[];for(let a=0;a<=v;a++)K.push([a,0]);for(let a=1;a<=G;a++)K.push([v,a]);for(let a=v-1;a>=0;a--)K.push([a,G]);for(let a=G-1;a>=1;a--)K.push([0,a]);const _=K.length,q=(a,n)=>{for(let k=0;k<_;k++){const r=(k+1)%_;e.index.push(a[k],a[r],n[r],a[k],n[r],n[k])}};for(let a=0;a<R;a++){const n=K.map(([b,h])=>j(a,b,h)),k=[],r=[];for(let b=0;b<_;b++){const[h,z]=K[b],L=n[(b+_-1)%_],M=n[(b+1)%_],u=n[b],S=T(u[0]);let I=M[1]-L[1],O=-(M[0]-L[0]);const J=Math.hypot(I,O)||1;I/=J,O/=J,k.push(Y(u[0],u[1],a===0?Q[0][h][z][2]:S*D[a],I,O,0)),r.push(Y(u[0],u[1],a===R-1?Q[1][h][z][2]:S*D[a+1],I,O,0))}if(q(k,r),a<R-1){const b=N[a+1]>=N[a]?1:-1,h=[],z=[];for(let L=0;L<_;L++){const[M,u]=K[L],S=n[L],I=j(a+1,M,u);h.push(Y(S[0],S[1],T(S[0])*D[a+1],0,0,b*.4)),z.push(Y(I[0],I[1],T(I[0])*D[a+1],0,0,b*.4))}q(h,z)}}return{wide:t.W/f,head:t.tFoot*X}}function je(e,t){const o=[[0,2,6,4],[1,5,7,3],[0,4,5,1],[2,3,7,6],[0,1,3,2],[4,6,7,5]];for(const f of t.chunks){const W=Math.cos(f.rot[0]),A=Math.sin(f.rot[0]),R=Math.cos(f.rot[1]),G=Math.sin(f.rot[1]),B=Math.cos(f.rot[2]),U=Math.sin(f.rot[2]),p=[];for(let l=0;l<8;l++){const y=(l&1?1:-1)*f.sx*(1+f.jit[l*3]),N=(l&2?1:-1)*f.sw*(1+f.jit[l*3+1]),D=(l&4?1:-1)*f.sy*(1+f.jit[l*3+2]),X=y*W-N*A,i=y*A+N*W,T=X*R-D*G,C=X*G+D*R,H=i*B-C*U,c=i*U+C*B;p.push([f.x+T,f.w+H,f.y+c])}for(const l of o){const y=p[l[0]],N=p[l[1]],D=p[l[3]],X=[N[0]-y[0],N[1]-y[1],N[2]-y[2]],i=[D[0]-y[0],D[1]-y[1],D[2]-y[2]];let T=[X[1]*i[2]-X[2]*i[1],X[2]*i[0]-X[0]*i[2],X[0]*i[1]-X[1]*i[0]];const C=Math.hypot(T[0],T[1],T[2])||1,H=[(y[0]+p[l[2]][0])/2-f.x,(y[1]+p[l[2]][1])/2-f.w,(y[2]+p[l[2]][2])/2-f.y],c=T[0]*H[0]+T[1]*H[1]+T[2]*H[2]<0?-1:1;T=[c*T[0]/C,c*T[1]/C,c*T[2]/C];const g=e.n;for(const m of l){const s=p[m];e.a.position.data.push(t.hinge.x+t.inw.x*s[0]+t.upn.x*s[2]+t.tan.x*s[1],t.hinge.y+t.inw.y*s[0]+t.upn.y*s[2]+t.tan.y*s[1],t.hinge.z+t.inw.z*s[0]+t.upn.z*s[2]+t.tan.z*s[1]),e.a.normal.data.push(T[0],T[1],T[2]),e.a.aLoc.data.push(s[0],s[1],s[2]),e.a.aHinge.data.push(t.hinge.x,t.hinge.y,t.hinge.z),e.a.aInw.data.push(t.inw.x,t.inw.y,t.inw.z),e.a.aTan.data.push(t.tan.x,t.tan.y,t.tan.z),e.a.aUpn.data.push(t.upn.x,t.upn.y,t.upn.z),e.a.aTurn.data.push(0,0,t.phase,2),e.a.aTint.data.push(t.seed,t.bed+f.tint),e.n++}e.index.push(g,g+1,g+2,g,g+2,g+3)}}}const Re=(e,t,o,f,W)=>{if(f===null)return t+e*(o-t);const A=Math.max(0,f-W-t),R=Math.max(0,o-f-W),G=e*(A+R);return G<A?t+G:f+W+(G-A)};function Ge(e){const t=e.rng("led-canyon-plan"),o=[],f=t()*te.cycle;let W=null,A=null;for(let R=0;R<e.places.gates.length;R++){const G=e.places.gates[R],B=-1,U=Re(t(),16,30,W,3),p=Re(t(),33,50,A,4);W=U,A=p,o.push({s:G,k:R,side:B,L:U,lean:p*Math.PI/180,d:t.range(19.4,20.4),W:U*t.range(.55,.8),tFoot:ae(U*t.range(.16,.22),4,6.5),back:t.range(38,50)*Math.PI/180,yaw:-B*t.range(.63,.77),phase:f-R*te.step})}return o}function _e(e){const t={places:ze.real,rng:o=>e.core.makeRng(e.core.hashSeed(o+":"+e.seed))};return Ge(t).map(o=>({s:o.s,d0:o.side<0?-o.d+.6:o.d-o.L,d1:o.side<0?-o.d+o.L:o.d-.6,halfS:o.W/2+.3,depth:Math.min(4,o.tFoot),yaw:o.yaw}))}const Ve=3.6;async function Oe(e,t){const o=Ge(e),f=ve({position:3,normal:3,aLoc:3,aHinge:3,aInw:3,aTan:3,aUpn:3,aTurn:4,aTint:2}),W=[],A=async(i,T,C,H,c,g,m,s)=>{let v=1.2,x=!1,w=0;for(let V=1.2;V<=Math.PI/2+g+1e-6;V+=.05){let F=!0;const P=Math.cos(V),j=Math.sin(V);for(let Y=6;Y<=H&&F;Y+=4)for(const Q of[-.46,0,.46]){const K=Y*P-c*j,_=Y*j+c*P,q=s*Q,a=i.x+T.x*K+C.x*_+m.x*q,n=i.y+T.y*K+C.y*_+m.y*q,k=i.z+T.z*K+C.z*_+m.z*q;if(e.groundAt(a,k,-1e9)>n-.4){F=!1;break}}if(++w%3===0&&await e.yield(),!F){if(x)break;continue}v=V,x=!0}return v};for(const i of o){const T=e.triad(i.s),C=T.p.y-6,H=T.t.clone().multiplyScalar(Math.cos(i.yaw)).addScaledVector(T.right,Math.sin(i.yaw)).normalize(),c=T.right.clone().multiplyScalar(Math.cos(i.yaw)).addScaledVector(T.t,-Math.sin(i.yaw)).normalize(),m=(r=>{const b=T.p.x+c.x*r,h=T.p.z+c.z*r;return new d.Vector3(b,e.groundAt(b,h,C)-.3,h)})(i.side*i.d),s=c.clone().multiplyScalar(-i.side),v=m.clone().sub(T.p).dot(T.n),x=Math.abs(m.clone().sub(T.p).dot(c)),w=i.L,V=[];for(let r=-26;r<=26;r+=.75)V.push(e.line(i.s+r).p);const F=(r,b,h,z,L,M=V)=>{let u=1e9;const S=Math.cos(L),I=Math.sin(L);for(let O=0;O<=h;O+=1.5)for(let J=-6;J<=6;J++){const ee=J/6*z*.5*(1-.42*ae(O/h,0,1)),re=r.x+(b.x*S+T.n.x*I)*O+H.x*ee,ce=r.y+(b.y*S+T.n.y*I)*O+H.y*ee,fe=r.z+(b.z*S+T.n.z*I)*O+H.z*ee;for(const ie of M){const ne=Math.hypot(re-ie.x,ce-ie.y,fe-ie.z);ne<u&&(u=ne)}}return u};let P=Math.max(i.lean,Math.asin(Math.min(1,Ve/Math.hypot(x,v)))+Math.atan2(-v,x));for(let r=0;r<60&&!(F(m,s,w,i.W,P)>=Ve);r++)P+=.012,r&1&&await e.yield();await e.yield();const j=await A(m,s,T.n,w,i.tFoot,i.back,H,i.W),Y=[];for(let r=-72;r<=72;r+=1.5)Y.push(e.line(Math.max(0,i.s+r)).p);const Q=F(m,s,w,i.W,j,Y);await e.yield();const K=e.rng("led-canyon-slab"+i.k),_=K(),q=K(),a=De(f,{tan:H,upn:T.n,root:3,kind:0,phase:i.phase,pose:Math.PI/2,rng:K,hinge:m,inw:s,L:w,W:i.W,tFoot:i.tFoot,aC:P,aO:j,seed:_,bed:q});await e.yield();const n=e.rng("led-canyon-rubble"+i.k),k=[];for(let r=0,b=Math.round(i.W*2.2);r<b;r++){const h=n(),z=.15+.85*h*h*h,L=.35+5.2*Math.pow(n(),1.7),M=n.range(-1,1)*(i.W*.5+1.2),u=z*n.range(.7,1.3),S=z*n.range(.6,1.2),I=z*n.range(.35,.8),O=[n()*E,n()*E,n()*E],J=n.range(-.5,.5),ee=n(),re=[];for(let ue=0;ue<24;ue++)re.push(n.range(-.45,.45));const ce=m.x+s.x*L+H.x*M,fe=m.z+s.z*L+H.z*M,ie=e.groundAt(ce,fe,m.y),ne=Math.hypot(u,S,I)*1.45,xe=(ie-m.y-s.y*L-H.y*M)/Math.max(T.n.y,.5);k.push({x:L,w:M,y:Math.min(xe+J*z,.55*L-ne),sx:u,sw:S,sy:I,rot:O,jit:re,tint:ee})}je(f,{tan:H,upn:T.n,hinge:m,inw:s,phase:i.phase,seed:_,bed:q,chunks:k}),W.push({s:i.s,th:P,L:w,openL:j,dL:x,yL:v,yaw:i.yaw,P:T.p.clone(),ax:H,cr:c,up:T.n.clone(),hL:m,inwL:s,wL:i.W,phase:i.phase,clearLong:F(m,s,w,i.W,P),clearOpenLong:Q,tL:i.tFoot,dealt:i.lean,...a})}await e.yield();const R=me(f);R.boundingSphere.radius+=40,await e.yield();const G=d.DataUtils.toHalfFloat,B=new d.DataTexture(new Uint16Array([G(0),G(0),G(-6e4),G(1)]),1,1,d.RGBAFormat,d.HalfFloatType);B.needsUpdate=!0;const U=new d.ShaderMaterial({side:d.DoubleSide,uniforms:{...e.U,tSunTop:{value:e.sunTop?e.sunTop.texture:B},uSunBox:{value:e.sunTop?e.sunTop.box:new d.Vector4(0,0,1,1)}},vertexShader:`
      uniform float uTime;
      attribute vec3 aLoc, aHinge, aInw, aTan, aUpn; attribute vec4 aTurn; attribute vec2 aTint;
      varying vec3 vLoc, vN, vW; varying vec2 vTint; varying float vKind, vFace, vSide;
      float gateShut(float tau){ return smoothstep(0., ${te.close.toFixed(2)}, tau)*(1.-smoothstep(${(te.close+te.stand).toFixed(2)}, ${(te.close+te.stand+te.open).toFixed(2)}, tau)); }
      float plateUp(float tau){ return smoothstep(0., 2.6, tau)*(1.-smoothstep(3.4, 8., tau)); }
      void main(){
        float tau = mod(uTime + aTurn.z, ${te.cycle.toFixed(1)});
        float c = aTurn.w > .5 ? plateUp(tau) : gateShut(tau);
        float ang = mix(aTurn.y, aTurn.x, c), ca = cos(ang), sa = sin(ang);
        vec3 p = aHinge + aInw*(aLoc.x*ca - aLoc.z*sa) + aUpn*(aLoc.x*sa + aLoc.z*ca) + aTan*aLoc.y;
        vec3 n = aInw*(normal.x*ca - normal.z*sa) + aUpn*(normal.x*sa + normal.z*ca) + aTan*normal.y;
        vLoc = aLoc; vTint = aTint; vKind = aTurn.w; vFace = abs(normal.z); vSide = normal.z;
        vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*n);
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:we.GLSL_NOISE+de+Be+`
      varying vec3 vLoc, vN, vW; varying vec2 vTint; varying float vKind, vFace, vSide;
      void main(){
        vec3 n = normalize(vN);
        // the canyon's own beds: on a slab's edges the strata show one over another with dark seams; a broad face
        // shows the two or three beds that have broken off it, each in its own tone (no net of joints is drawn on it)
        float nA = vnoise(vec3(vLoc.xy*.55, vLoc.z*.9 + vTint.x*31.)), nB = vnoise(vec3(vLoc.xy*.13, vTint.x*17.)), nC = vnoise(vLoc*2.3);
        float rub = step(1.5, vKind), face = max(smoothstep(.5, .9, vFace), rub);
        // on the edges the beds lie one over another in fine level stripes; a broad face shows the beds that have broken
        // off it, each in its own tone (the face toward the line starts from one bed, the back from another)
        float bc = mix((vLoc.z + .12*nB)/.45, vSide > 0. ? 7.5 : .5, face) + floor(vTint.y*23.);
        float bi = floor(bc), bf = bc - bi, hsh = hash11(bi*7.13 + 3.), hs2 = hash11(floor(bc/5.)*3.7 + 1.);
        hsh = mix(hsh, .05 + .95*hsh, face);
        vec3 bed = mix(vec3(.479, .138, .045), vec3(.658, .323, .102), smoothstep(.25, .45, hsh));
        bed = mix(bed, vec3(.807, .624, .352), smoothstep(.62, .8, hsh));
        bed = mix(bed, bed*vec3(.8, .62, .6), hs2*.5*(1.-.4*face));
        // no pale line along a slab's edge: there the beds lean two thirds of the way toward the broad face's own bed and stand darker
        float hF = .05 + .95*hash11(floor(vTint.y*23.)*7.13 + 3.);
        vec3 bedF = mix(mix(vec3(.479, .138, .045), vec3(.658, .323, .102), smoothstep(.25, .45, hF)), vec3(.807, .624, .352), smoothstep(.62, .8, hF));
        bed = mix(bed, bedF*.76, .66*(1. - face));
        float seam = mix(smoothstep(0., .1, bf)*(1.-smoothstep(.9, 1., bf)), .3 + .7*smoothstep(0., .07, bf)*(1.-smoothstep(.93, 1., bf)), face);
        // a broad face's tone: soft stains that run down the face (long streaks along its length, stronger and damp
        // toward the foot). Nothing on a broad face can close into a ring: no pit, no crack, no round patch
        float damp = 1. - smoothstep(-1., 9., vLoc.x);
        if (rub > .5) {
          float nM = vnoise(vec3(vLoc.xy*.31, vTint.x*41.)), nM2 = vnoise(vec3(vLoc.xy*.21 + 9., vTint.x*13.));
          bed = mix(bed, bed*vec3(.7, .6, .6), smoothstep(.42, .66, nM2));
          bed *= (.55+.45*seam)*(.8+.4*nA)*(.86+.28*nC)*(.66+.6*nB)*(.66+.62*nM)*(1. - .42*damp);
        } else {
          float sA = vnoise(vec3(vLoc.x*.05, vLoc.y*.34 + (vSide > 0. ? 3. : 0.), vTint.x*41.)), sB = vnoise(vec3(vLoc.x*.08 + 9., vLoc.y*.95, vTint.x*13.));
          float stain = smoothstep(.36, .7, sA*.62 + sB*.38);
          bed = mix(bed, bed*vec3(.62, .55, .57), face*stain*(.7 + .3*damp));
          bed *= (.55+.45*seam)*mix(.8+.4*nA, .9+.2*nA, face)*(.86+.28*nC)*mix(1., (.66+.6*nB)*(1. - .42*damp), face);
        }
        bed = mix(bed, bed*vec3(.86, .9, 1.), face*damp*.6);
        // CLOSE RANGE: thin sharp strata lines and pits, crisp. Each fades by its own footprint on the
        // screen, as a mip does: it is gone where one pixel covers a good part of the pattern's own step
        float fpx = fwidth(vLoc.x) + fwidth(vLoc.y) + fwidth(vLoc.z);
        float sc2 = vLoc.z*3.3 + vTint.x*5.;
        float sh2 = hash11(floor(sc2)*1.7 + 2.);
        float thin = (1. - smoothstep(.06, .06 + 1.5*fwidth(sc2), abs(fract(sc2) - .5)))*step(.3, sh2)*(.45 + .55*sh2)*(1. - smoothstep(.2, .55, fwidth(sc2)))*(1. - face);
        // (pits on the edges only: a broad face and the rubble carry no pit, no crack and no closed mark of any kind)
        float pn = vnoise(vec3(vLoc.xy*4.2, vLoc.z*4.2 + vTint.x*9.)), pw = fwidth(pn) + 1e-4;
        float pit = smoothstep(.73 - pw, .73 + pw, pn)*(1. - smoothstep(.15, .45, fpx*4.2))*(1. - face);
        bed *= 1. - clamp(.42*thin + .34*pit, 0., .75);
        float top = texture2D(tSunTop, (vW.xz - uSunBox.xy)*uSunBox.zw).b;
        float sunK = sunAt(vW.y)*smoothstep(-1.5, 3., vW.y - top);
        float ao = mix(.78, 1., face)*(.75+.25*seam);
        vec3 col = bed*(rockLight(vW, n, ao, sunK) + dawnRose(vW, n)) + uRSky*(.045+.04*n.y)*ao;
        col = fogged(col, distance(vW, cameraPosition));
        gl_FragColor = vec4(col, 1.);
      }`}),p=new d.Mesh(R,U);t.add(p);const l=e.rng("led-canyon-dust"),y=[],N=[.58,.39,.29],D=Math.max(6,Math.round(18*e.detail));for(const i of W)for(const[T,C,H]of[[i.hL,i.inwL,i.wL]])for(const c of[[.3,te.close-.2],[te.close+te.stand+.1,te.close+te.stand+te.open-.2]])for(let g=0;g<D;g++){const m=l.range(-.5,.5)*H,s=l.range(-2.6,-.6),v=l.range(.3,1.5),x=l.range(-.5,.5);y.push({p:[T.x+i.ax.x*m+C.x*s,T.y+1,T.z+i.ax.z*m+C.z*s],v:[-C.x*v+i.ax.x*x,l.range(.1,.45),-C.z*v+i.ax.z*x],life:l.range(3,5),phase:l(),s0:l.range(.8,1.2),s1:l.range(2,3.2),kind:4,seed:l(),alpha:.2,col:N,gate:[c[0],c[1],-1,i.phase]})}await e.yield();const X=await be(e,e.U,y,5);return t.add(X.mesh),e.gates=W,e.note.canyon=W.map(i=>({s:i.s,clearLong:+i.clearLong.toFixed(2),clearOpenLong:+i.clearOpenLong.toFixed(2),thickLong:+i.tL.toFixed(2),long:+i.L.toFixed(1),leanLong:+(i.th*180/Math.PI).toFixed(1),openLong:+(i.openL*180/Math.PI).toFixed(1),yaw:+(i.yaw*180/Math.PI).toFixed(1),raised:+((i.th-i.dealt)*180/Math.PI).toFixed(1),wide:+i.wide.toFixed(3),head:+i.head.toFixed(2)})),{triangles:f.index.length/3+X.triangles,calls:2}}async function Ne(e,t){const o=e.rng("led-crater"),f=ve({position:3,normal:3,uv:2,aMet:2,aArch:4}),W=(s,v,x)=>{let w=x;if(e.lake)for(;w>20;w-=1){const V=s.p.x+s.right.x*v*w-e.lake.x,F=s.p.z+s.right.z*v*w-e.lake.z;if(Math.hypot(V,F)<e.lake.r-8)break}return w},A=[];for(let s=0;s<e.places.fire.length;s++){const v=e.triad(e.places.fire[s]),x=o.sign(),w=o.range(38,44),V=o.range(38,44),F=W(v,x,w),P=W(v,-x,V),j=Math.max(e.lakeY+o.range(31,38),v.p.y+17.5),Y=e.lakeY-.5,Q=j-Y,K=o.range(3.4,4),_=o(),q=o.range(0,E),a=Fe(v,x,F,P,Y,Q,b=>.9-.15*Math.pow(Math.abs(2*b-1),2)),n=b=>K*(.9+.45*Math.pow(Math.abs(2*b-1),2.2)),k=Math.round(88*(.6+.4*e.detail));ge(f,{nu:k,nv:10,point:a.point,across:a.across,out:a.out,half:n,cup:()=>.12,extra:b=>b.a.aArch.data.push(_,q,K,s)});const r=o.range(3.2,4.4);ge(f,{nu:k,nv:5,point:b=>{const h=a.point(b),z=a.across(b);return h.addScaledVector(z,n(b)*.55),h.y+=r,h},across:()=>new d.Vector3(0,1,0),half:()=>r,extra:b=>b.a.aArch.data.push(_+2,q,K,s)}),A.push({F:v,side:x,dA:F,dB:P,y0:Y,H:Q,seed:_,ph:q,hw:K,A:a,half:n}),await e.yield()}const R=new d.ShaderMaterial({uniforms:{...e.U},transparent:!0,depthWrite:!1,side:d.DoubleSide,blending:d.CustomBlending,blendSrc:d.OneFactor,blendDst:d.OneMinusSrcAlphaFactor,vertexShader:`
      uniform float uTime; attribute vec2 aMet; attribute vec4 aArch;
      varying vec2 vUv, vMet; varying vec4 vArch; varying vec3 vW;
      void main(){
        vUv = uv; vMet = aMet; vArch = aArch;
        vec3 p = position + normal*(sin(aMet.x*.4 - uTime*3.1 + aArch.x*50.)*.5 + sin(aMet.x*.17 + uTime*1.3 + aArch.x*20.)*.6);
        vec4 w = modelMatrix*vec4(p, 1.); vW = w.xyz;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:pe+de+`
      varying vec2 vUv, vMet; varying vec4 vArch; varying vec3 vW;
      void main(){
        float u = clamp(vUv.x, 0., 1.), v = clamp(vUv.y, -1., 1.), e = 1.-abs(v);
        float hung = step(1.5, vArch.x), sd = fract(vArch.x);
        if (hung > .5) {
          // the crest: tongues that rise, tear and go out in dark smoke
          float cv = v*.5+.5;
          float f1 = fbm(vec2(vMet.x*.3 - uTime*.8 + sd*40., cv*1.5 - uTime*1.5));
          float f2 = fbm(vec2(vMet.x*1. - uTime*1.6 + sd*70., cv*3. - uTime*3.));
          float sw = .8 + .2*sin(uTime*.4586 + vArch.y);
          float tongue = (f1*.8 + f2*.42)*sw - cv*(.78 + .5*f1) + .1;
          float tw = clamp(fwidth(tongue)*1.5, .004, .11);
          float ca = max(smoothstep(.1 - tw, .1 + tw, tongue), smoothstep(0., .1, tongue)*.25)*smoothstep(0., .025, u)*smoothstep(0., .04, 1.-u)*smoothstep(0., .14, cv)*(1.-smoothstep(.9, 1., cv));
          float ch = clamp(tongue*1.7 + (1.-cv)*.2, 0., 1.)*.8;
          vec3 cc = mix(vec3(.195, .007, .002), vec3(1., .068, .01), smoothstep(.08, .34, ch));
          cc = mix(cc, vec3(1., .254, .023), smoothstep(.34, .72, ch));
          cc *= .7 + .7*ch;
          float sm = (1.-smoothstep(.05, .22, ch))*ca;
          cc = mix(cc, vec3(.035, .022, .028), sm*.85);
          cc = fogged(cc, distance(vW, cameraPosition)*.5);
          gl_FragColor = vec4(cc*ca, ca*mix(.9, .65, sm));
          return;
        }
        // fire runs along the band from the fountain to the far foot; tongues tear off its far, upper edge
        float flow = vMet.x*.2 - uTime*2.5, vv = v*.5+.5;
        float t1 = fbm(vec2(flow*1.2, vMet.y*.3 - uTime*1.1) + vArch.x*31.);
        float t2 = fbm(vec2(flow*3. + 7., vMet.y*.75 - uTime*2.1) + vArch.x*53.);
        float t3 = fbm(vec2(flow*.5, vMet.y*.2 - uTime*.5) + vArch.x*7.);
        // each band swells and thins on a slow clock of its own and never goes out
        float swell = .8 + .2*sin(uTime*.4586 + vArch.y);
        float ends = smoothstep(0., .025, u)*smoothstep(0., .04, 1.-u);
        float reach = (.6 + .5*t1)*swell;
        float env = smoothstep(0., 1., vv/(.06 + .34*t2*t1))*(1.-smoothstep(reach*.55, min(reach + .12, .97), vv));
        // CRISP WHERE A PIXEL IS SMALL: the body's edge is as sharp as its own footprint allows; outside it a narrow soft glow
        float ex = env*(1. + (t2-.5)*.6), ew = clamp(fwidth(ex)*1.5, .004, .1);
        float a = max(smoothstep(.16 - ew, .16 + ew, ex), smoothstep(.03, .16, ex)*.28)*ends;
        // a pale thread at the core, an orange body, deep red frayed edges, dark smoke at the fringe
        float cd = (vv - .27)/.19, core = exp(-cd*cd);
        float heat = clamp((.3 + .7*core + (t2-.5)*.55 + (t3-.5)*.3)*env, 0., 1.);
        vec3 col = mix(vec3(.195, .007, .002), vec3(1., .068, .01), smoothstep(.1, .34, heat));
        col = mix(col, vec3(1., .254, .023), smoothstep(.34, .7, heat));
        float hw = clamp(fwidth(heat)*1.5, .004, .07);
        col = mix(col, vec3(1., .72, .3), smoothstep(.9 - hw, .9 + hw, heat));
        col *= .7 + .75*heat;
        float smoke = (1.-smoothstep(.06, .24, heat))*a;
        col = mix(col, vec3(.035, .022, .028), smoke*.85);
        col = fogged(col, distance(vW, cameraPosition)*.5);
        float keep = mix(.95, .7, smoke);
        gl_FragColor = vec4(col*a, a*keep);
      }`}),G=new d.Mesh(me(f),R);G.renderOrder=3,t.add(G),e.fireArches=A,await e.yield();const B=[],U=e.rng("led-crater-spatter"),p=.5+.5*e.detail,l=9.8,y=[1,1,1],N=e.rng("led-crater-vents"),D=e.places.vents.map(()=>e.demo?50:N.range(34,60)),X=[];for(let s=e.places.fire[0]-60;s<=e.places.fire[4]+60;s+=3)X.push(e.line(s).p);const i=(s,v,x)=>{for(const w of X)if(Math.hypot(s-w.x,v-w.z)<x)return!0;return!1},T=(s,v,x,w,V,F)=>{for(let P=0;P<Math.round(v*p);P++){const j=U.range(x,w);B.push({p:[s.x+U.range(-2,2),e.lakeY+.3,s.z+U.range(-2,2)],v:[U.range(-V,V),j,U.range(-V,V)],life:2*j/l,phase:U(),s0:F*U.range(.8,1.3),s1:F*.45,kind:2,grav:l,seed:U(),alpha:1,col:y})}};for(const s of A){T(s.A.point(.01),70,12.5,17.7,3.2,1.9),T(s.A.point(.99),34,5,9.5,4.5,1.3);for(let v=0;v<Math.round(44*p);v++){const x=U.range(.04,.3),w=v&1?1-x:x,V=s.A.point(w),F=Math.max(2,V.y-e.lakeY),P=Math.abs(2*w-1)>.7;B.push({p:[V.x+U.range(-2,2),V.y-1,V.z+U.range(-3,3)],v:[U.range(-1,1),U.range(-1,1),U.range(-1,1)],life:Math.sqrt(2*F/(P?l:4)),phase:U(),s0:P?.9:.3,s1:P?.5:.18,kind:P?2:3,grav:P?l:4,seed:U(),alpha:1,col:y})}}const C=e.lake?[e.lake.x,e.lake.z,e.lake.r-6]:null,H=e.triad((e.places.fire[0]+e.places.fire[4])/2),c=e.rng("led-crater-embers");for(let s=0;s<Math.round(520*p*e.density);s++){const v=Math.sqrt(c())*(C?C[2]:75),x=c()*E,w=(C?C[0]:H.p.x)+Math.cos(x)*v,V=(C?C[1]:H.p.z)+Math.sin(x)*v,F=c.range(2.5,6),P={p:[w,e.lakeY+.5,V],v:[c.range(-.8,.8),F,c.range(-.8,.8)],life:c.range(6,11),phase:c(),s0:c.range(.24,.42),s1:.14,kind:3,grav:-.2,seed:c(),alpha:1,col:y};i(w,V,15)||B.push(P)}const g=(s,v)=>{let x=v;if(e.lake)for(;Math.abs(x)>30&&!(Math.hypot(s.p.x+s.right.x*x-e.lake.x,s.p.z+s.right.z*x-e.lake.z)<e.lake.r-12);x-=Math.sign(x)*2);return new d.Vector3(s.p.x+s.right.x*x,e.lakeY,s.p.z+s.right.z*x)};for(let s=0;s<e.places.vents.length;s++)T(g(e.triad(e.places.vents[s]),D[s]),30,4,8.5,3.5,1.2);await e.yield();const m=await be(e,e.U,B,7);return t.add(m.mesh),{triangles:f.index.length/3+m.triangles,calls:2}}function He(e,t){const o=t.nu,f=t.nv,W=e.n,A=t.rng,R=t.billow,G=t.girth,B=t.tufts,U=A.int(3,5),p=A.int(6,9),l=A()*E,y=A()*E,N=A(),D=new d.Vector3().crossVectors(t.e1,t.e2).normalize(),X=(c,g)=>{const m=c/E*R.na,s=g/E*R.nb,v=Math.floor(m),x=Math.floor(s),w=m-v,V=s-x,F=w*w*(3-2*w),P=V*V*(3-2*V),j=(Y,Q)=>R.lat[(Y%R.na+R.na)%R.na*R.nb+(Q%R.nb+R.nb)%R.nb];return(Z(Z(j(v,x),j(v+1,x),F),Z(j(v,x+1),j(v+1,x+1),F),P)-.5)*R.deep},i=(c,g)=>{const m=c/E*B.na,s=g/E*B.nb,v=Math.floor(m),x=Math.floor(s),w=m-v,V=s-x,F=w*w*(3-2*w),P=V*V*(3-2*V),j=(Y,Q)=>B.lat[(Y%B.na+B.na)%B.na*B.nb+(Q%B.nb+B.nb)%B.nb];return(Z(Z(j(v,x),j(v+1,x),F),Z(j(v,x+1),j(v+1,x+1),F),P)-.5)*B.deep},T=c=>ae(Z(G.thin,G.thick,Math.pow(.5+.5*Math.cos(c-G.at),G.pow))*(1+.13*Math.sin(c*2+G.p2)+.09*Math.sin(c*3+G.p3)),2,3.75),C=c=>t.R+.15*Math.sin(c*2+y)+.1*Math.sin(c*5+l),H=(c,g)=>{const m=Math.cos(g),s=T(c),v=X(c,g)/R.deep+.5,x=Math.max(0,-m),w=x*x;let V=s*(1+.016*Math.sin(g*2+c*p+l)+.01*Math.sin(g*3-c*U*2+y))+(v-.5)*R.deep*(1-w)+w*Math.max(0,t.R-s-t.clear)*v+i(c,g);return m<0&&C(c)+m*V<t.clear&&(V=(C(c)-t.clear)/-m),V};for(let c=0;c<=o;c++){const g=c/o*E,m=Math.cos(g),s=Math.sin(g),v=new d.Vector3(t.e1.x*m+t.e2.x*s,t.e1.y*m+t.e2.y*s,t.e1.z*m+t.e2.z*s),x=T(g),w=C(g);for(let V=0;V<=f;V++){const F=V/f*E,P=Math.cos(F),j=Math.sin(F),Y=v.x*P+D.x*j,Q=v.y*P+D.y*j,K=v.z*P+D.z*j,_=H(g,F);e.a.position.data.push(t.c.x+v.x*w+Y*_,t.c.y+v.y*w+Q*_,t.c.z+v.z*w+K*_);const q=(H(g+.01,F)-H(g-.01,F))/(.02*(w+x*P)),a=(H(g,F+.03)-H(g,F-.03))/(.06*x),n=-t.e1.x*s+t.e2.x*m,k=-t.e1.y*s+t.e2.y*m,r=-t.e1.z*s+t.e2.z*m,b=-v.x*j+D.x*P,h=-v.y*j+D.y*P,z=-v.z*j+D.z*P;let L=Y-(q*n+a*b),M=Q-(q*k+a*h),u=K-(q*r+a*z);const S=Math.hypot(L,M,u)||1;L/=S,M/=S,u/=S,e.a.normal.data.push(L,M,u),e.a.uv.data.push(X(g,F)/R.deep+.5,V/f),e.a.aRing.data.push(N,t.R*g,x,t.roll)}}for(let c=0;c<o;c++)for(let g=0;g<f;g++){const m=W+c*(f+1)+g,s=m+f+1;e.index.push(m,s,m+1,m+1,s,s+1)}e.n+=(o+1)*(f+1)}async function Ye(e,t){const o=e.rng("led-summit"),f=e.rng("led-summit-billows"),W=e.rng("led-summit-girth"),A=e.rng("led-summit-tufts");let R=0,G=0;const B=ve({position:3,normal:3,uv:2,aRing:4});for(let a=0;a<e.places.rings.length;a++){const n=e.triad(e.places.rings[a]),k=Math.round(128*(.6+.4*e.detail)),r=A.range(.7,1.3),b=[];for(let S=0;S<952;S++)b.push(A());const h={lat:b,na:68,nb:14,deep:.45},z=[],L=f.range(1.1,1.7);for(let S=0;S<216;S++){const I=f()<.5,O=f()*.25;z.push(I?1-O:O)}const M={lat:z,na:27,nb:8,deep:L},u={thin:W.range(2,2.4),thick:W.range(3.3,3.75),at:-Math.PI/2+W.sign()*W.range(.35,.8),pow:W.range(.8,1.6),p2:W()*E,p3:W()*E};He(B,{c:n.p,e1:n.right,e2:n.n,R:13,clear:8.6,nu:k,nv:28,rng:o,billow:M,girth:u,tufts:h,roll:r}),await e.yield()}let U=1e18;{const a=[];for(let r=e.places.cleft[0]-40;r<=e.places.stream[1];r+=2)a.push(e.line(r).p);const n=B.a.position.data,k=n.length/3;for(let r=0;r<k;r++){const b=n[r*3],h=n[r*3+1],z=n[r*3+2];let L=1e18;for(const M of a){const u=b-M.x,S=h-M.y,I=z-M.z,O=u*u+S*S+I*I;O<L&&(L=O)}L<U&&(U=L),(r&255)===255&&await e.yield()}}const p={vertexShader:`
      uniform float uTime; attribute vec4 aRing;
      varying vec3 vN, vW; varying vec2 vUv; varying vec4 vRing;
      void main(){
        vUv = uv; vRing = aRing;
        vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz; vN = normalize(mat3(modelMatrix)*normal);
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:pe+de+`
      varying vec3 vN, vW; varying vec2 vUv; varying vec4 vRing;
      // one lump: round on its crown, sharp in its crease
      float lump(vec3 p){ return 1. - abs(2.*vnoise(p) - 1.); }
      void main(){
        vec3 n = normalize(vN);
        // ROLLING CLOUD, FORM AT EVERY SCALE: lumps on lumps (about 3 m, 1.2 m and 0.5 m across) read at the point of
        // the body's own round, which turns about the tube on the ring's clock from the ring's dealt start (it rolls).
        // Each scale gives its mean where a lump is finer than its own footprint on the screen (fine detail only).
        float a = vRing.y/13., rr = max(vRing.z, 1.);
        // (one turning speed for the whole ring, the dealt speed at a tube of 3 m: the lumps are never wound up)
        float b = vUv.y*6.2832 - (uTime*vRing.w + vRing.x*40.)/3.;
        vec3 q = vec3(cos(a)*(13. + rr*cos(b)), sin(a)*(13. + rr*cos(b)), rr*sin(b)) + vRing.x*57.;
        float fw = length(fwidth(q));
        float w1 = 1. - smoothstep(.25, .7, fw/3.), w2 = 1. - smoothstep(.25, .7, fw/1.2), w3 = 1. - smoothstep(.25, .7, fw/.5);
        float h1 = lump(q/3.), h2 = lump(q/1.2 + 7.), h3 = lump(q/.5 + 19.);
        float H = .55*(h1 - .5)*w1 + .3*(h2 - .5)*w2 + .12*(h3 - .5)*w3;
        // the surface's normal leans with the lumps' own slope (the height's gradient along the surface, in metres)
        vec3 dpx = dFdx(vW), dpy = dFdy(vW), r1 = cross(dpy, n), r2 = cross(n, dpx);
        float det = dot(dpx, r1);
        vec3 nb = normalize(abs(det)*n - sign(det)*(dFdx(H)*r1 + dFdy(H)*r2));
        // LIGHT: the sun's direction and the surface's own normal, nothing of the eye. Each lump is warm white on its
        // sun side and blue-violet in its creases, deeper in the deep hollows; the lit side passes into the shaded one
        // over a good part of a lump's round; no rim is drawn; the brightest tone stays under white
        float sk = sunAt(vW.y), ds = dot(nb, uSunDir);
        float crease = smoothstep(.12, .62, vUv.x);
        float hollow = clamp(.5 + H/.6, 0., 1.)*mix(.55, 1., crease);
        float term = smoothstep(-.3, .5, ds + (h1 - .5)*.2);
        // the deep hollows of the lit side go toward the shade's blue-violet (no side of a ring stands as one tone)
        term *= mix(.7, 1., smoothstep(.15, .6, hollow));
        vec3 shade = mix(vec3(.17, .18, .4), vec3(.4, .43, .68), clamp(hollow*(.35 + .65*(nb.y*.5 + .5)), 0., 1.)) + uGlow*.05;
        vec3 lit = vec3(.76, .705, .63)*mix(.62, 1., hollow)*(.78 + .22*smoothstep(0., .9, ds));
        // the fine lumps light and shade the lit side where a pixel is finer than they are (their mean is kept)
        lit *= mix(1., .74 + .5*smoothstep(.25, .75, h2*.6 + h3*.4), w3);
        vec3 col = mix(shade, lit, term*sk);
        col = fogged(col, distance(vW, cameraPosition));
        gl_FragColor = vec4(min(col, vec3(.82)), 1.);
      }`},l=new d.ShaderMaterial({uniforms:{...e.UHigh},...p}),y=new d.Mesh(me(B),l);t.add(y),R+=B.index.length/3,G+=1,await e.yield();const N=ve({position:3,normal:3,uv:2,aMet:2,aArch:4}),D=[];let X=0;const i=e.rng("led-summit-arcs"),T=Array.from({length:6},()=>new d.Vector4),C=Array.from({length:6},()=>new d.Vector4),H=Array.from({length:6},()=>new d.Vector4(0,0,0,1)),c={uGustA:{value:T},uGustB:{value:C},uGustC:{value:H}},g=[],m=(a,n)=>{const k=i.range(-6,9),r=i.range(36,50),b=i.range(6,12);let h=null;if(e.ledges)for(const M of e.ledges){if(!M||!Number.isFinite(M.x+M.y+M.z))continue;const u=M.x-a.p.x,S=M.z-a.p.z,I=u*a.right.x+S*a.right.z,O=u*a.fwd.x+S*a.fwd.z;if(I*n<16||M.y<a.p.y-18||M.y>a.p.y+12)continue;const J=Math.hypot(I,O*1.6)+Math.abs(M.y-a.p.y)*.8;(!h||J<h.score)&&(h={L:M,score:J})}if(h&&h.score<150)return X++,new d.Vector3(h.L.x,h.L.y,h.L.z);let z=null;if(e.pillars)for(const M of e.pillars){const u=M.x-a.p.x,S=M.z-a.p.z,I=u*a.right.x+S*a.right.z,O=u*a.fwd.x+S*a.fwd.z;if(I*n<16)continue;const J=Math.hypot(I,O*1.6);(!z||J<z.score)&&(z={P:M,score:J})}if(z&&z.score<170){const M=z.P,u=a.p.x-M.x,S=a.p.z-M.z,I=Math.hypot(u,S)||1,O=(M.radius||8)*.8,J=(M.foot??a.p.y-30)+10,ee=(M.top??a.p.y+40)-10;return new d.Vector3(M.x+u/I*O,ae(a.p.y+k,J,Math.max(J,ee)),M.z+S/I*O)}const L=n*r;return new d.Vector3(a.p.x+a.right.x*L,a.p.y-b,a.p.z+a.right.z*L)};for(let a=0;a<e.places.arcs.length;a++){const n=e.triad(e.places.arcs[a]),k=i.sign(),r=m(n,k),b=m(n,-k),h=i(),z=i()*E,L=n.p.clone().addScaledVector(Le,i.range(13.5,17)).addScaledVector(n.fwd,i.range(-3,3)),M=L.clone().multiplyScalar(2).addScaledVector(r,-.5).addScaledVector(b,-.5),u=$=>new d.Vector3().addScaledVector(r,(1-$)*(1-$)).addScaledVector(M,2*$*(1-$)).addScaledVector(b,$*$),S=r.distanceTo(L)+L.distanceTo(b),I=[0];for(let $=1;$<=64;$++)I.push(I[$-1]+u($/64).distanceTo(u(($-1)/64)));const O=I[64],J=$=>{const ye=ae($,0,1)*64,se=Math.min(63,Math.floor(ye));return Z(I[se],I[se+1],ye-se)},ee=i.int(3,5),re=[0,1,2,3,4].map(()=>i.range(15,30)),ce=[0,1,2,3,4].map(()=>i.range(.5,1.5)),fe=i(),ie=i.range(5.5,8),ne=Math.max(1,Math.min(ee,Math.floor(O/23)));let xe=0,ue=0;for(let $=0;$<ne;$++)xe+=re[$],ue+=ce[$];const We=Math.min(1,(O-19*ne)/Math.max(xe-15*ne,1e-6)),Ae=re.map($=>15+($-15)*Math.max(0,We));let Me=0;for(let $=0;$<ne;$++)Me+=Ae[$];const Ue=Math.max(0,O-Me-4*ne),le=[0,0,0,0,0],oe=[0,0,0,0,0];let ke=fe*O;for(let $=0;$<ne;$++)oe[$]=Ae[$]/2,ke+=oe[$],le[$]=ke,ke+=oe[$]+4+Ue*ce[$]/ue;a<6&&(T[a].set(le[0],le[1],le[2],le[3]),C[a].set(oe[0],oe[1],oe[2],oe[3]),H[a].set(le[4],oe[4],ie,O)),g.push({gusts:ne,run:+O.toFixed(1),inGusts:+(Me/O).toFixed(2)});for(const $ of[0,1]){const ye=se=>{const Se=u(Math.min(1,se+.002)).sub(u(Math.max(0,se-.002))).normalize(),Te=new d.Vector3().crossVectors(Se,Le).normalize();return $?new d.Vector3().crossVectors(Te,Se).normalize():Te};ge(N,{nu:Math.round(ae(S/2.2,40,90)),nv:4,point:u,across:ye,half:()=>11,extra:se=>se.a.aArch.data.push(h+$*.37,z,S,a)})}D.push({point:u,len:S,sAt:J,ph:z,i:a}),await e.yield()}e.note&&(e.note.summit={ringNearest:+Math.sqrt(U).toFixed(2),arcFeetOnTrees:X,arcFeet:e.places.arcs.length*2,gusts:g}),await e.yield();const s=new d.ShaderMaterial({uniforms:{...e.UHigh,...c},transparent:!0,depthWrite:!1,side:d.DoubleSide,blending:d.CustomBlending,blendSrc:d.OneFactor,blendDst:d.OneMinusSrcAlphaFactor,vertexShader:`
      uniform float uTime; attribute vec2 aMet; attribute vec4 aArch;
      varying vec2 vUv, vMet; varying vec4 vArch; varying vec3 vW;
      void main(){
        vUv = uv; vMet = aMet; vArch = aArch;
        vec4 w = modelMatrix*vec4(position, 1.); vW = w.xyz;
        gl_Position = projectionMatrix*viewMatrix*w;
      }`,fragmentShader:pe+de+Ce+`
      varying vec2 vUv, vMet; varying vec4 vArch; varying vec3 vW;
      void main(){
        float u = clamp(vUv.x, 0., 1.);
        // GUSTS, NOT A RIBBON: the blossom's density at this place: the arc's travelling gusts along it, and across it
        // a breadth of 10 to 18 m that changes along the arc, its edges ragged and soft; all in the arc's own metres
        int ia = int(vArch.w + .5);
        float xs = vMet.x - uGustC[ia].z*uTime;
        float br = mix(5., 9., smoothstep(.25, .75, fbm(vec2(xs*.05, vArch.x*13.))));
        float rag = fbm(vec2(xs*.22, vMet.y*.22) + vArch.x*31.);
        float dens = gustAt(ia, vMet.x, uTime)*(1. - smoothstep(.25, 1., abs(vMet.y)/br + (rag - .5)*.5));
        // petals: small bright cells running along the band, about one cell in eight at the densest (the flying
        // petals, which have depth, carry the blossom; the sheet is its mist)
        vec2 q = vec2(vMet.x - uTime*7., vMet.y)*2.6 + vArch.x*57.;
        vec2 id = floor(q), f = fract(q) - .5;
        float h = hash12(id), on = step(1. - .12*dens, h);
        float ang = h*31. + uTime*(1.5 + h*2.);
        vec2 r = vec2(f.x*cos(ang) - f.y*sin(ang), (f.x*sin(ang) + f.y*cos(ang))*(1.6 + sin(ang*1.7)));
        float petal = on*smoothstep(.34, .2, length(r));
        // finer than a pixel the petals give their mean, as a mip does (by the pattern's own footprint)
        float fine = 1. - smoothstep(.35, 1.1, max(fwidth(q.x), fwidth(q.y)));
        petal = mix(.12*dens*.16, petal, fine);
        float mott = fbm(vec2(vMet.x*.3 - uTime*1.4, vMet.y*.9) + vArch.x*9.);
        // THE BODY'S TRUE COVER, the same at every distance: the petals' own mean (0.12 of the cells, each 0.16
        // covered: 0.018 at the densest) and a mist of 0.014 to 0.044: about 0.06 at the most, nothing between gusts
        float haze = dens*(.014 + .03*mott);
        float ends = smoothstep(0., .04, u)*smoothstep(0., .04, 1.-u);
        float a = clamp(petal*.95 + haze, 0., 1.)*ends;
        float sun = sunAt(vW.y);
        vec3 pink = mix(vec3(1., .33, .5), vec3(1., .58, .72), fract(h*7.3));
        vec3 pc = mix(pink, vec3(1.), step(.72, fract(h*3.1))*.3);
        pc = mix(vec3(1., .5, .64), pc, fine);
        vec3 body = mix(vec3(1., .42, .58), vec3(1., .8, .86), mott);
        pc = mix(body, pc, clamp(petal/max(petal + haze, 1e-3), 0., 1.));
        vec3 col = pc*(mix(vec3(.42, .4, .62), vec3(1.05, .95, .86), sun))*.86;
        col = fogged(col, distance(vW, cameraPosition));
        gl_FragColor = vec4(col*a, a);
      }`}),v=new d.Mesh(me(N),s);v.renderOrder=5,t.add(v),R+=N.index.length/3,G+=1,await e.yield();const x=[],w=e.rng("led-summit-steam"),V=.5+.5*e.detail,F=e.rng("led-summit-petals"),P=e.rng("led-summit-drift");for(const a of D)a.deep=P.range(.5,.8);const j=()=>{const a=F();return F()<.08?[1,.9,.92]:[.96,Z(.323,.578,a),Z(.479,.716,a)]},Y=(a,n,k,r,b,h,z)=>{x.push({p:[a.x+k.x-n.x*r*b*.5,a.y+k.y-n.y*r*b*.5,a.z+k.z-n.z*r*b*.5],v:[n.x*r,n.y*r,n.z*r],life:b,phase:F(),s0:h,s1:h,kind:8,seed:F(),alpha:1,col:j(),gate:z})},Q=a=>{const n=F()*E,k=Math.acos(F.range(-1,1)),r=a*Math.abs(F.gauss())*.62;return new d.Vector3(Math.sin(k)*Math.cos(n)*r,Math.cos(k)*r,Math.sin(k)*Math.sin(n)*r)};for(const a of D){const n=Math.round(1400*V*e.density);for(let k=0;k<n;k++){const r=F(),b=a.point(r),h=a.point(Math.min(1,r+.004)).sub(a.point(Math.max(0,r-.004))).normalize(),z=a.sAt(r),L=Z(4,6.5,.5+.5*Math.sin(z*.11+a.ph)),M=Q(L*.75).add(Q(L*.75));M.y*=a.deep,Y(b,h,M,F.range(6.5,10),F.range(1.6,2.8),F.range(.26,.46),[z,a.i+1,0,0])}await e.yield()}for(let a=0;a<Math.round(1300*V*e.density);a++){const n=e.triad(F.range(e.places.stream[0],e.places.stream[1])),k=F()*E,r=F.range(6.5,11);Y(n.p.addScaledVector(n.right,Math.cos(k)*r).addScaledVector(n.n,Math.sin(k)*r),n.t,Q(.6),F.range(8,12),F.range(2.4,3.8),F.range(.15,.26))}for(let a=0;a<Math.round(520*V*e.density);a++){const n=e.triad(F.range(e.places.cleft[0],e.places.cleft[1]+10)),k=F.sign();Y(n.p.addScaledVector(n.right,k*F.range(8.5,12)).addScaledVector(n.n,F.range(-4,4)),n.t,Q(.8),F.range(6,9),F.range(2,3.4),F.range(.2,.34))}await e.yield();const K=e.rng("led-summit-steam-places"),_=[],q=e.places.cleft[1];for(let a=e.places.cleft[0]+4;a<q;a+=(e.demo?5:9)*(a>q-32?1.8:1))for(const n of[-1,1])_.push({s:a+K.range(-3,3),lat:n*K.range(10.5,13)});for(const a of _){const n=e.triad(a.s),k=n.p.x+n.right.x*a.lat,r=n.p.z+n.right.z*a.lat,b=e.groundAt(k,r,n.p.y-8),h=26,z=Math.round(h*V),L=he(q-45,q-15,a.s),M=Z(.85,.55,L),u=Z(1.6,1,L);for(let S=0;S<h;S++){const I=w.range(5,7.5),O={p:[k+w.range(-1,1)*u,b+.3,r+w.range(-1,1)*u],v:[w.range(-.3,.3),w.range(2,3.2),w.range(-.3,.3)],life:I,phase:(S+w())/z,s0:1.6*M,s1:w.range(3.6,5.6)*M,kind:0,seed:w(),alpha:Z(.11,.075,L),col:[1,.97,.94]};S<z&&x.push(O)}}if(x.length){await e.yield();const a=await be(e,{...e.UHigh,...c},x,6);t.add(a.mesh),R+=a.triangles,G+=1}return{triangles:R,calls:G}}async function Ke(e,t={}){const o=new d.Group,f={sea:new d.Group,canyon:new d.Group,crater:new d.Group,summit:new d.Group};for(const l of Object.keys(f))f[l].name="led-"+l,o.add(f[l]);const W={triangles:{},calls:{},errors:[]};o.userData.ledNotes=W;let A=null,R=0,G=0;try{A=Ie(e,t)}catch(l){W.errors.push("env: "+(l&&l.message))}const B={sea:Pe,canyon:Oe,crater:Ne,summit:Ye},U=[];if(A){A.ctx=e,A.note=W,A.yield=async()=>{e&&typeof e.yield=="function"&&await e.yield()},await A.yield();for(const l of Object.keys(B)){try{const y=await B[l](A,f[l]);W.triangles[l]=y.triangles,W.calls[l]=y.calls,R+=y.triangles,G+=y.calls,y.update&&U.push(y.update)}catch(y){for(W.errors.push(l+": "+(y&&y.message));f[l].children.length;)f[l].remove(f[l].children[0])}await A.yield()}}W.errors.length&&typeof console<"u"&&console.error("[led matter] "+W.errors.join(" | "));const p=!A||A.demo;return{object:o,sets:f,info:W,triangles:R,calls:G,radius:p?150:900,height:p?60:300,center:p?new d.Vector3(0,14,0):new d.Vector3(0,100,200),ground:!0,groundY:0,update(l,y,N){if(A){t.time&&typeof t.time=="object"||(A.U.uTime.value=y),A.fog&&(A.U.uFogD.value=A.fog.density,A.fog.color&&A.fog.color.isColor&&A.U.uFogC.value.copy(A.fog.color));for(const D of U)D(l,y,N)}},dispose(){}}}export{Ke as buildHero,_e as gateHollows};
