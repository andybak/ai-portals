import*as t from"three";import{makePath as Qt}from"../kit/core.js";import{buildHero as Lt,ENGRAVE_GLSL as qe,FOG_FRAG as pe,PALETTE as Yt}from"../parts/engraved-sea-chart.js";const G=(x,R,D)=>{const ee=Math.min(1,Math.max(0,(D-x)/(R-x)));return ee*ee*(3-2*ee)},Je=(x,R,D)=>x+(R-x)*D,H=Math.PI*2,jt=[[.342,.94,.0698,.55],[-.6,.8,.17,.9],[.9,-.436,.31,1.3],[.2,-.98,.53,1.7]],Pe=`
uniform float uSeaT; uniform vec4 uSeaA; uniform vec4 uHill; uniform vec4 uRingP;
vec3 seaHG(vec2 p){
  float calm = mix(.3, 1., smoothstep(25., 100., length(p-uRingP.xy)));
  vec3 r = vec3(0.); float a;
  a = dot(p, vec2(.342, .94))*.0698-uSeaT*.55; r += uSeaA.x*vec3(sin(a), cos(a)*.0698*vec2(.342, .94));
  a = dot(p, vec2(-.6, .8))*.17-uSeaT*.9;      r += uSeaA.y*vec3(sin(a), cos(a)*.17*vec2(-.6, .8));
  a = dot(p, vec2(.9, -.436))*.31-uSeaT*1.3;   r += uSeaA.z*vec3(sin(a), cos(a)*.31*vec2(.9, -.436));
  a = dot(p, vec2(.2, -.98))*.53-uSeaT*1.7;    r += uSeaA.w*vec3(sin(a), cos(a)*.53*vec2(.2, -.98));
  r *= calm;
  vec2 q = p-uHill.xy, hd = uRingP.zw; float s = dot(q, hd), l = dot(q, vec2(-hd.y, hd.x));
  float ks = s < 0. ? 3.14159/120. : 3.14159/53.;
  float as = min(abs(s)*ks, 3.14159), al = min(abs(l)*3.14159/130., 3.14159);
  float ps = .5+.5*cos(as), pl = .5+.5*cos(al);
  float dps = -.5*sin(as)*ks*sign(s), dpl = -.5*sin(al)*3.14159/130.*sign(l);
  r.x += uHill.z*ps*pl;
  r.yz += uHill.z*(dps*pl*hd+ps*dpl*vec2(-hd.y, hd.x));
  return r;
}
float heroSea(vec2 p){ return seaHG(p).x; }
`;function $t(x){return(R,D,ee)=>{const ae=x.uSeaA.value,we=x.uSeaT.value,K=x.uRingP.value,ce=x.uHill.value,M=Je(.3,1,G(25,100,Math.hypot(R-K.x,D-K.y)));let w=0;const T=[ae.x,ae.y,ae.z,ae.w];for(let I=0;I<4;I++){const C=jt[I];w+=T[I]*Math.sin((R*C[0]+D*C[1])*C[2]-we*C[3])}const V=R-ce.x,Q=D-ce.y,X=V*K.z+Q*K.w,j=-V*K.w+Q*K.z,q=.5+.5*Math.cos(Math.min(Math.abs(X)*Math.PI/(X<0?120:53),Math.PI)),N=.5+.5*Math.cos(Math.min(Math.abs(j)*Math.PI/130,Math.PI));return ee?w*M:w*M+ce.z*q*N}}function ve(){const x=[],R=[],D=[],ee=[],ae=[],we=[],K=new t.Vector3,ce=new t.Vector3,M={m:[0,.3,0,0],mat:new t.Matrix4,nm:new t.Matrix3,extra:0};return M.xf=w=>(w?M.mat.copy(w):M.mat.identity(),M.nm.getNormalMatrix(M.mat),M),M.set=(w,T=.3,V=0,Q=0)=>(M.m=[w,T,V,Q],M),M.v=(w,T,V,Q,X,j,q,N,I)=>{K.set(w,T,V).applyMatrix4(M.mat),ce.set(Q,X,j).applyMatrix3(M.nm);const C=ce.length();return C>1e-9?ce.multiplyScalar(1/C):ce.set(0,1,0),x.push(K.x,K.y,K.z),R.push(ce.x,ce.y,ce.z),D.push(q,N),ee.push(M.m[0],M.m[1],M.m[2],I??M.m[3]),we.push(M.extra),x.length/3-1},M.tri=(w,T,V)=>{ae.push(w,T,V)},M.quad=(w,T,V,Q)=>{ae.push(w,T,V,w,V,Q)},M.grid=(w,T,V,Q=[1,1],X=null,j=!1)=>{const q=[0,0,0],N=[0,0,0],I=[0,0,0],C=x.length/3,te=.002;for(let S=0;S<=T;S++)for(let U=0;U<=w;U++){const b=U/w,_=S/T;V(b,_,q),V(b+te,_,N),V(b,_+te,I);const le=N[0]-q[0],Y=N[1]-q[1],oe=N[2]-q[2],L=I[0]-q[0],ne=I[1]-q[1],Me=I[2]-q[2],W=j?_*Q[1]:b*Q[0],E=j?b*Q[0]:_*Q[1];M.v(q[0],q[1],q[2],Y*Me-oe*ne,oe*L-le*Me,le*ne-Y*L,W,E,X?X(b,_):void 0)}for(let S=0;S<T;S++)for(let U=0;U<w;U++){const b=C+S*(w+1)+U;M.quad(b,b+1,b+w+2,b+w+1)}return M},M.tube=(w,T,V=8,Q=!1,X=!0)=>{const j=w.length,q=new t.Vector3,N=new t.Vector3(0,1,0),I=new t.Vector3,C=new t.Vector3,te=x.length/3;let S=0;for(let U=0;U<j;U++){const b=w[U],_=w[Math.max(0,U-1)],le=w[Math.min(j-1,U+1)];q.set(le[0]-_[0],le[1]-_[1],le[2]-_[2]).normalize(),U===0&&(N.set(0,1,0),Math.abs(q.y)>.9&&N.set(1,0,0)),I.crossVectors(q,N).normalize(),C.crossVectors(I,q).normalize(),N.copy(C),U>0&&(S+=Math.hypot(b[0]-_[0],b[1]-_[1],b[2]-_[2]));const Y=typeof T=="function"?T(U/(j-1)):T;for(let oe=0;oe<=V;oe++){const L=oe/V*H,ne=Math.cos(L),Me=Math.sin(L),W=I.x*ne+C.x*Me,E=I.y*ne+C.y*Me,xe=I.z*ne+C.z*Me,be=oe/V*H*Math.max(Y,.05);M.v(b[0]+W*Y,b[1]+E*Y,b[2]+xe*Y,W,E,xe,Q?S:be,Q?be:S)}}for(let U=0;U<j-1;U++)for(let b=0;b<V;b++){const _=te+U*(V+1)+b;M.quad(_,_+V+1,_+V+2,_+1)}if(X)for(const U of[0,j-1]){const b=w[U],_=w[U===0?1:j-2],le=M.v(b[0],b[1],b[2],b[0]-_[0],b[1]-_[1],b[2]-_[2],0,0);for(let Y=0;Y<V;Y++){const oe=te+U*(V+1)+Y;U===0?M.tri(le,oe,oe+1):M.tri(le,oe+1,oe)}}return M},M.lathe=(w,T=16,V=!1,Q=null)=>M.grid(T,w.length-1,(X,j,q)=>{const N=Math.min(w.length-1.001,Math.max(0,j*(w.length-1))),I=Math.floor(N),C=N-I,te=(w[I][0]+(w[I+1][0]-w[I][0])*C)*(Q?Q(X,j):1),S=w[I][1]+(w[I+1][1]-w[I][1])*C,U=-X*H;q[0]=Math.cos(U)*te,q[1]=S,q[2]=Math.sin(U)*te},V?[1,w[w.length-1][1]-w[0][1]||1]:[H*Math.max(...w.map(X=>X[0]))*.7,1],null,V),M.blob=(w,T,V,Q,X,j,q,N,I=.18,C=-2)=>{const te=new t.IcosahedronGeometry(1,q),S=te.attributes.position.array,U=x.length/3;for(let b=0;b<S.length;b+=3){let _=S[b],le=S[b+1],Y=S[b+2];const oe=1+I*(N?N.n3(_*1.7+w*.1,le*1.7+T*.1,Y*1.7+V*.1):0);let L=le*oe;L<C&&(L=C+(L-C)*.2),M.v(w+_*oe*Q,T+L*X,V+Y*oe*j,_/Q,(L<C+.01?-3:le)/X,Y/j,T+L*X,Math.atan2(Y,_)*(Q+j)*.5)}for(let b=0;b<S.length/3;b+=3)M.tri(U+b,U+b+1,U+b+2);return te.dispose(),M},M.count=()=>ae.length/3,M.build=(w=!1)=>{const T=new t.BufferGeometry;return T.setAttribute("position",new t.Float32BufferAttribute(x,3)),T.setAttribute("normal",new t.Float32BufferAttribute(R,3)),T.setAttribute("aHatch",new t.Float32BufferAttribute(D,2)),T.setAttribute("aM",new t.Float32BufferAttribute(ee,4)),w&&T.setAttribute("aE",new t.Float32BufferAttribute(we,1)),T.setIndex(ae),T.computeBoundingSphere(),T},M}function de(x,R,D={}){const ee=!!D.outline,ae={...t.UniformsUtils.clone(t.UniformsLib.fog),...x,...R,uPxW:{value:D.px??2.2},...D.uniforms||{}},we=D.vBody||"wp = modelMatrix*vec4(p, 1.); wn = normalize(mat3(modelMatrix)*n);",K=`
    attribute vec2 aHatch; attribute vec4 aM;
    uniform float uTime, uResY, uPxW, uT; uniform vec3 uKey;
    varying vec3 vWP, vWN; varying vec2 vH; varying vec4 vM;
    #include <fog_pars_vertex>
    ${Pe}
    ${D.vHead||""}
    void main(){
      vec3 p = position, n = normal; vec4 wp; vec3 wn; vec2 hh = aHatch;
      ${we}
      ${ee?`float dpt = max(-(viewMatrix*wp).z, .1);
      wp.xyz += wn*min(dpt*2./(projectionMatrix[1][1]*uResY)*uPxW*(1.+.7*clamp(-dot(wn, uKey), 0., 1.)), ${D.maxW||".5"});`:""}
      vWP = wp.xyz; vWN = wn; vH = hh; vM = aM;
      vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,ce=ee?`
    uniform vec3 uPaper, uInk, uInkFar;
    ${pe}
    void main(){
      float f = eFog();
      vec3 ink = mix(uInk, uInkFar, smoothstep(0., .5, f));
      gl_FragColor = vec4(mix(ink, eFogCol(), smoothstep(.3, 1., f)), 1.);
    }`:`
    ${qe}
    ${pe}
    uniform float uT;
    varying vec3 vWP, vWN; varying vec2 vH; varying vec4 vM;
    ${D.fHead||""}
    void main(){
      vec2 h = vH; float w = fwidth(h.x);
      vec3 N = normalize(vWN+vec3(0., 1e-5, 0.)); if(!gl_FrontFacing) N = -N;
      float sel = vM.x, washAmt = vM.y, edge = 0., alpha = 1.;
      float tone = clamp(.86*smoothstep(.7, -.9, dot(N, uKey))+.12*smoothstep(.1, -.9, N.y)+vM.z, 0., 1.);
      float fog = eFog();
      ${D.fBody||""}
      vec3 wash = sel < .5 ? uPaper : sel < 1.5 ? uWashA : sel < 2.5 ? uWashB : sel < 3.5 ? uAged : uGold;
      float gold = step(3.5, sel)*step(sel, 4.5);
      float cov = max(eInk(clamp(tone, 0., 1.), h, w), edge);
      cov = mix(cov, 1., step(4.5, sel)*step(sel, 5.5)*.94);
      vec3 col = eCompose(cov*(1.-.7*gold), wash, washAmt*(.8+.5*tone), fog, eFogCol(), eGrain(vWP-cameraPosition));
      float spark = .5+.5*smoothstep(.45, .8, eN2(vWP.xz*1.7+vWP.y*2.3+uTime*.9));
      col = mix(col, uGold*(.95+1.55*spark), gold*(1.-fog)*(1.-.8*cov));
      gl_FragColor = vec4(col, alpha);
    }`,M=new t.ShaderMaterial({fog:!0,uniforms:ae,vertexShader:K,fragmentShader:ce,side:ee?t.BackSide:D.side??t.FrontSide});return D.decal&&(M.blending=t.CustomBlending,M.blendSrc=t.SrcAlphaFactor,M.blendDst=t.OneMinusSrcAlphaFactor,M.depthTest=!1,M.depthWrite=!1),D.transparent&&(M.transparent=!0,M.depthWrite=!1),M}const Kt=["proof","hand","sanguine","hand","sanguine","proof","night"],Zt={hand:{name:"The Engraved Sea",pal:Yt,night:0},proof:{name:"The Engraved Sea: First Proof",pal:["#EFE7D2","#D9CDAE","#8E8676","#1F1812","#D6CBAE","#CFC0A2","#E2A93A"],night:0},sanguine:{name:"The Engraved Sea: Sanguine",pal:["#E8D3AC","#D3B78C","#B97F66","#6E2418","#DDAE86","#C8687A","#E2A93A"],night:0},night:{name:"The Engraved Sea: Night Plate",pal:["#1C2740","#2B3760","#6F7890","#B9AF93","#8FCDBE","#E59AAE","#E2A93A"],night:1}};function Ot(x,R,D){return new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...x,...R,uDense:{value:D.dense},uTint:{value:D.tint},uNearFade:{value:D.nearFade}},vertexShader:`
      varying vec3 vWP; varying vec2 vUv;
      #include <fog_pars_vertex>
      void main(){ vec4 wp = modelMatrix*vec4(position, 1.); vWP = wp.xyz; vUv = uv;
        vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${qe}
      ${pe}
      uniform float uDense, uTint, uNearFade;
      varying vec3 vWP; varying vec2 vUv;
      void main(){
        float v = (vUv.x+vUv.y*.16)*uDense, w = fwidth(v);
        float edge = smoothstep(0., .22, vUv.x)*smoothstep(1., .78, vUv.x);
        float body = edge*smoothstep(1.02, .8, vUv.y)*(.75+.25*eN2(vec2(vUv.x*9., uTime*.15)));
        float tone = clamp(body*(.5+.4*eN2(vec2(vUv.x*5.+uTime*.05, vUv.y*2.))), 0., 1.);
        float cov = eLines(v, vUv.y*90.+uTime*8., w, tone);
        float foot = smoothstep(.0, .05, vUv.y);
        float f = eFog();
        float near = smoothstep(uNearFade*.35, uNearFade, distance(vWP, cameraPosition));
        vec3 ink = mix(uInk*1.5, uInkFar, smoothstep(0., .5, f));
        float tint = uTint*body*foot;
        float a = max(cov*foot, tint)*(1.-smoothstep(.55, 1., f))*near;
        vec3 col = mix(mix(uAged*.8, uWashA*.6, .5), ink, clamp(cov*foot/max(max(cov*foot, tint), 1e-3), 0., 1.));
        gl_FragColor = vec4(col, a);
      }`})}var to={id:"engraved-sea-chart",name:"The Engraved Sea",category:"ocean",weirdness:.45,media:["water"],async build(x){const R=x.rng,D=x.noise,ee=x.vary||{},ae=x.quality?.detail??1,we=Math.min(1.3,Math.max(.7,ee.density??1)),K=new t.Scene,ce=[];let M=R.pick(["hand","sanguine","proof","hand","sanguine","hand","night","proof"]);const w=R.pick(["fair","gale","calm","fair"]),T=R.pick(["galleon","caravel","galleon","galley"]);Number.isFinite(Number(x.seed))&&(M=Kt[Math.abs(Math.floor(Number(x.seed)))%7]),ee.hour==="night"?M="night":ee.hour==="golden"?M="sanguine":ee.hour==="day"&&M==="night"?M="hand":ee.hour==="dawn"&&M==="night"&&(M="proof");const V=Zt[M],Q=V.pal,X=!!ee.rare,j=w==="calm"?.44:w==="gale"?1.42:1,q=[-.82,.5,.28],N={uSeaT:{value:0},uSeaA:{value:new t.Vector4(2.5,.55,.28,.14).multiplyScalar(j)},uHill:{value:new t.Vector4(0,0,0,0)},uRingP:{value:new t.Vector4(0,0,.6428,-.766)}},I=$t(N),C=await Lt(x,{palette:Q,keyDir:q,stage:!1,seaGLSL:Pe,seaUniforms:N});await x.yield();const te=C.anchors.course,S=C.style.uniforms,b=Qt([0,40,80,120,160,200,240,280,300,315,330,345,360,376.8,395,420,440,460,480,500,512,521,532,546,560,574,588].map(e=>{const r=te(e);return e===521&&(r.y=21.7),r})),_=42,le=b.length,Y=te(588),oe=te(522);N.uRingP.value.x=Y.x,N.uRingP.value.y=Y.z,N.uHill.value.x=oe.x,N.uHill.value.y=oe.z;const L=new t.Vector3(.6428,0,-.766),ne=new t.Vector3(-.766,0,-.6428),Me=new t.Color(Q[0]).multiplyScalar(.94);K.fog=new t.Fog(Me,w==="gale"?50:w==="calm"?130:90,w==="gale"?820:w==="calm"?1800:1350);const W={...N,uResY:{value:900},uT:{value:0},uBurin:{value:0},uWhale:{value:0},uCam:{value:new t.Vector3},uNight:{value:V.night},uGloom:{value:new t.Vector4(0,0,80,0)}},E=(e,r,f=0,a=!1)=>{const o=new t.Mesh(e,r);return o.frustumCulled=a,o.renderOrder=f,K.add(o),o},xe=de(S,W,{side:t.DoubleSide,vBody:`float fl = aM.w; p += n*fl*(sin(uTime*2.3+aHatch.x*.9+aHatch.y*.5)*.6+sin(uTime*5.1+aHatch.y*1.7)*.25);
        wp = modelMatrix*vec4(p, 1.); wn = normalize(mat3(modelMatrix)*n);`}),be=de(S,W,{outline:!0,vBody:`float fl = aM.w; p += n*fl*(sin(uTime*2.3+aHatch.x*.9+aHatch.y*.5)*.6+sin(uTime*5.1+aHatch.y*1.7)*.25);
        wp = modelMatrix*vec4(p, 1.); wn = normalize(mat3(modelMatrix)*n);`});K.add(C.object),C.setProgress(0);const Ft=E(new t.SphereGeometry(2400,40,24),new t.ShaderMaterial({side:t.BackSide,depthWrite:!1,depthTest:!1,uniforms:{...S,uNight:W.uNight,uCrease:{value:new t.Vector3(.42,.55,-.72).normalize()},uMoon:{value:new t.Vector3(-.5,.4,-.77).normalize()}},vertexShader:"varying vec3 vD; void main(){ vD = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }",fragmentShader:`
        ${qe}
        uniform float uNight; uniform vec3 uCrease, uMoon;
        varying vec3 vD;
        void main(){
          vec3 d = normalize(vD);
          float el = asin(clamp(d.y, -1., 1.));
          float v = el*el*sign(el)*240.+el*40., w = fwidth(v);
          vec2 q = d.xz/(1.+abs(d.y))*16.; vec2 wq = fwidth(q); float fq = max(wq.x, wq.y)+1e-5;
          float md = distance(d, uMoon), fm = fwidth(md)+1e-5;
          float tone = smoothstep(.07, 1.1, el)*.34;
          float cov = eLines(v, atan(d.z, d.x+1e-5)*200., w, tone)*.75;
          float fox = smoothstep(.7, .8, eN3(d*13.))*.12+smoothstep(.78, .84, eN3(d*41.+7.))*.1;
          float cr = dot(d, uCrease);
          float fold = (1.-smoothstep(0., .01, abs(cr)))*.14+smoothstep(0., .03, cr)*(1.-smoothstep(.03, .5, cr))*.09;
          vec3 col = eCompose(cov, uAged, .1+fox+fold+.25*smoothstep(.4, -.1, el), 0., uPaper, eGrain(d));
          if(uNight > .5){
            vec2 c = floor(q); float hs = eHash2(c);
            vec2 f = q-c-.5-(vec2(eHash2(c+3.1), eHash2(c+7.7))-.5)*.55;
            float sz = .05+.07*hs;
            float lm = min(min(abs(f.x), abs(f.y)), min(abs(f.x+f.y), abs(f.x-f.y))*.707);
            float star = (1.-smoothstep(fq*.7, fq*1.7, lm))*(1.-smoothstep(sz, sz+fq, length(f)))*step(.66, hs)*smoothstep(.03, .14, d.y);
            star *= .65+.35*sin(uTime*2.+hs*40.);
            float disc = 1.-smoothstep(.085-fm, .085+fm, md);
            float cut = 1.-smoothstep(.085-fm, .085+fm, distance(d, normalize(uMoon+vec3(.05, .025, 0.))));
            float rule = smoothstep(.2, .32, abs(fract(dot(d, vec3(.25, 1., 0.))*80.)-.5));
            float rim = 1.-smoothstep(fm*1.2, fm*2.4, abs(md-.085));
            float cres = disc*(1.-cut)*(.55+.45*rule);
            col = mix(col, uInk*1.5, max(max(star, cres), rim*.5*(1.-cut)));
          }
          gl_FragColor = vec4(col, 1.);
        }`}),-1);E(new t.CylinderGeometry(1800,1800,40,200,1,!0),new t.ShaderMaterial({side:t.BackSide,uniforms:{...S},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position, 1.); }",fragmentShader:`
        uniform vec3 uPaper, uInk, uInkFar;
        varying vec2 vUv;
        void main(){
          float deg = vUv.x*360., wd = fwidth(deg)+1e-5, y = vUv.y;
          float blk = smoothstep(.25-wd*.25, .25+wd*.25, abs(fract(deg*.25)-.5));
          float tick = 1.-smoothstep(.1, .1+wd, abs(fract(deg)-.5));
          float cov = y < .1 ? 1. : y < .52 ? blk : y < .6 ? 1. : y < .9 ? tick : 1.;
          vec3 ink = mix(uInk*1.5, uInkFar, .5);
          gl_FragColor = vec4(mix(mix(uPaper*.9, ink, cov), uPaper*.94, .3), 1.);
        }`}),-.9).position.set(60,19,-20),await x.yield();const rt=`wp = modelMatrix*vec4(p, 1.); wn = normalize(mat3(modelMatrix)*n);
      wp.xyz += wn*(1.2*sin(uTime*.35+aM.w*3.+p.x*.03+p.y*.05)); wp.x += uTime*aM.w*.9; hh.x = wp.y*.42;`,Bt=de(S,W,{vBody:rt,fBody:`float under = step(N.y, -.5); float hu = vH.y*.3, wu = fwidth(hu);
        h = mix(h, vec2(hu, (vWP.x-uTime*vM.w*.9)*.7+vWP.z*.7), under); w = mix(w, wu, under);
        float lee = smoothstep(.4, -.8, dot(N, uKey));
        tone = clamp(mix(.04+.5*smoothstep(.25, -.6, N.y)+.3*lee, .4+.08*lee, under)+vM.z, 0., 1.); washAmt = vM.y*(1.-smoothstep(.2, .7, fog));`}),It=de(S,W,{outline:!0,vBody:rt,px:2,maxW:"3."}),fe=R.fork("clouds"),Ee=e=>8*(e*2)*(e*2),lt={},Ct=e=>{const r=new Float32Array(8*e*e*9);let f=0;for(let a=0;a<8;a++){const o=a&1?1:-1,c=a&2?1:-1,u=a&4?1:-1,i=o*c*u<0,s=(n,l)=>{const p=o*n,h=c*l,d=u*(e-n-l),v=Math.hypot(p,h,d)||1;r[f++]=p/v,r[f++]=h/v,r[f++]=d/v};for(let n=0;n<e;n++)for(let l=0;l<e-n;l++)s(n,l),i?(s(n,l+1),s(n+1,l)):(s(n+1,l),s(n,l+1)),l<e-n-1&&(s(n+1,l),i?(s(n,l+1),s(n+1,l+1)):(s(n+1,l+1),s(n,l+1)))}return r};for(const e of[3,4,5])lt[e]=Ct(e*2),await x.yield();const Qe=(3+(w==="gale"?2:0))*(4*Ee(5)+7*Ee(3))+9*(3*Ee(4)+7*Ee(3)),Ge=new Float32Array(Qe*9),Le=new Float32Array(Qe*9),ct=new Float32Array(Qe*6),De=new Float32Array(Qe*12);let ue=0;const Ae=[0,0,0,0];await x.yield();const Ye=(e,r,f,a,o,c,u,i,s,n=0)=>{const l=lt[u],p=-.3,h=Math.floor(l.length/18)*9;for(let d=n===2?h:0;d<(n===1?h:l.length)&&ue*3<Ge.length;d+=3,ue++){const v=l[d],m=l[d+1],g=l[d+2],A=1+.07*D.n3(v*2.1+e*.05,m*2.1+r*.05,g*2.1+f*.05);let y=m*A;const F=y<p;F&&(y=p+(y-p)*.1);const P=e+v*A*a,z=f+g*A*c,k=v/a,B=(F?-4:m)/o,Z=g/c,O=Math.hypot(k,B,Z)||1;Ge[ue*3]=P,Ge[ue*3+1]=r+(y-p)*o,Ge[ue*3+2]=z,Le[ue*3]=k/O,Le[ue*3+1]=B/O,Le[ue*3+2]=Z/O,ct[ue*2+1]=P*i+z*s,De[ue*4]=Ae[0],De[ue*4+1]=Ae[1],De[ue*4+2]=Ae[2],De[ue*4+3]=Ae[3]}},Be=async(e,r,f,a,o,c)=>{Ae[0]=o?1:3,Ae[1]=o?.5:.25,Ae[2]=o?.1:0,Ae[3]=c;let u=e-10,i=f+40;const s=Math.hypot(u,i);s<120?(u=0,i=-1):(u/=s,i/=s);const n=r-.06*a,l=o?4:3,p=o?.66:.78,h=[];for(let d=0;d<l;d++){const v=l===1?0:d/(l-1)*2-1,m=a*.4*fe.range(.85,1.12)*(1-.28*v*v),g=e+v*a*.7,A=f+fe.range(-.12,.12)*a;Ye(g,n,A,m*1.2,m*p,m,o?5:4,u,i,1),await x.yield(),Ye(g,n,A,m*1.2,m*p,m,o?5:4,u,i,2),h.push([g,A,m]),await x.yield()}for(let d=0;d<5;d++){const v=(d+fe.range(.2,.8))/5*2-1,m=a*fe.range(.2,.27);Ye(e+v*a*1.02,n,f+(d%2?1:-1)*fe.range(.2,.36)*a,m*1.15,m*p*1.05,m,3,u,i),d===2&&await x.yield()}await x.yield();for(let d=0;d<2;d++){const v=h[(d+(o?1:0))%h.length],m=v[2]*fe.range(.52,.66);Ye(v[0]+fe.range(-.3,.3)*v[2],n+v[2]*p*.62,v[1]+fe.range(-.2,.2)*v[2],m*1.1,m*.82,m,3,u,i)}await x.yield()};await Be(0,112,-34,96,!0,.15);const Ie=Y.clone().addScaledVector(L,360);await Be(Ie.x-90,150,Ie.z-60,150,!0,.1),await Be(Ie.x+110,172,Ie.z+90,170,!0,.1);for(let e=0;e<9;e++){const r=e/9*H+fe.range(-.2,.2),f=fe.range(380,1050);await Be(60+Math.cos(r)*f,fe.range(150,300),-40+Math.sin(r)*f,fe.range(70,150),!1,fe.range(.6,1.6))}const Tt=[],je=(e,r,f,a,o,c)=>{const u=new t.PlaneGeometry(a,o,1,1);u.translate(0,o/2,0);const i=u.attributes.position;for(let n=0;n<i.count;n++)i.setZ(n,(o-i.getY(n))*(c.slant??.24));const s=E(u,Ot(S,W,c),2);return s.position.set(e,-1,r),s.rotation.y=f,Tt.push(s),s};w!=="calm"&&je(0,-30,0,130,106,{dense:46,tint:.2,nearFade:110}),je(Ie.x,Ie.z,Math.atan2(-L.x,-L.z),760,190,{dense:150,tint:.5,nearFade:60,slant:.2}),w==="gale"&&(await Be(-330,120,-170,110,!0,.12),await Be(300,126,60,120,!0,.12),je(-330,-170,.5,150,112,{dense:52,tint:.24,nearFade:110}),je(300,60,-.7,160,118,{dense:56,tint:.24,nearFade:110})),await x.yield();const ze=new t.BufferGeometry;ze.setAttribute("position",new t.BufferAttribute(Ge,3)),ze.setAttribute("normal",new t.BufferAttribute(Le,3)),ze.setAttribute("aHatch",new t.BufferAttribute(ct,2)),ze.setAttribute("aM",new t.BufferAttribute(De,4)),ze.setDrawRange(0,ue),ze.boundingSphere=new t.Sphere(new t.Vector3(60,150,-40),2400),await x.yield(),E(ze,Bt,0),E(ze,It,0),await x.yield();const et=[];for(let e=0;e<17;e++)et.push(new t.Vector4(0,-60,0,4));{const f=[],a=[];for(let c=0;c<=120;c++){const u=2.5*Math.pow(760,c/120);for(let i=0;i<=160;i++){const s=i/160*H;f.push(Math.cos(s)*u,0,Math.sin(s)*u)}}for(let c=0;c<120;c++)for(let u=0;u<160;u++){const i=c*161+u;a.push(i,i+1,i+160+2,i,i+160+2,i+160+1)}const o=new t.BufferGeometry;o.setAttribute("position",new t.Float32BufferAttribute(f,3)),o.setIndex(a),o.boundingSphere=new t.Sphere(new t.Vector3,4e3),E(o,new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...S,...W,uCaps:{value:et},uGale:{value:w==="gale"?1:w==="calm"?-1:0}},vertexShader:`
          uniform vec3 uCam;
          varying vec3 vWP;
          #include <fog_pars_vertex>
          ${Pe}
          void main(){
            vec3 wp = vec3(position.x+uCam.x, 0., position.z+uCam.z);
            wp.y = heroSea(wp.xz);
            vWP = wp;
            vec4 mvPosition = viewMatrix*vec4(wp, 1.); gl_Position = projectionMatrix*mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          ${qe}
          ${pe}
          ${Pe}
          uniform vec4 uCaps[17], uGloom; uniform float uGale, uNight;
          varying vec3 vWP;
          float capShadow(vec3 p, vec3 L, vec3 a, vec3 b, float r){
            vec3 ab = b-a, ao = p-a; float abL = dot(ab, L);
            float A = dot(ab, ab)-abL*abL;
            float t = clamp((dot(ao, ab)-dot(ao, L)*abL)/max(A, 1e-3), 0., 1.);
            vec3 c = a+ab*t-p; float s = dot(c, L);
            vec3 d = c-L*max(s, 0.);
            return (1.-smoothstep(r*.8, r*1.9, length(d)))*step(0., s);
          }
          void main(){
            vec2 p = vWP.xz;
            vec3 hg = seaHG(p);
            float sw = dot(p, vec2(.342, .94));
            float v = sw-uSeaT*7.88+3.*sin(dot(p, vec2(.9, -.3))*.045+uSeaT*.25)+1.6*eN2(p*.03)+hg.x*.7;
            float w = fwidth(v);
            float sh = 0.;
            for(int i = 0; i < 16; i++) sh = max(sh, capShadow(vWP, uKey, uCaps[i].xyz, uCaps[i+1].xyz, .5*(uCaps[i].w+uCaps[i+1].w)));
            float lee = hg.y*uKey.x+hg.z*uKey.z;
            float cs = smoothstep(.56, .7, eN2((p-vec2(uTime*2.6, uTime*.7))*.0085));
            float gloom = uGloom.w*(1.-smoothstep(uGloom.z*.3, uGloom.z, distance(p, uGloom.xy)));
            float tone = (.25+clamp(lee*1.9, -.16, .5)-.035*hg.x+.15*cs+.08*uGale)*(1.-.22*uNight)+.5*sh+gloom;
            tone = clamp(tone, .03, .95);
            float cov = eInk(tone, vec2(v, dot(p, vec2(.94, -.342))), w);
            vec3 col = eCompose(cov, uWashA, .1+.3*tone+.22*sh+.07*cs, eFog(), eFogCol(), eGrain(vWP-cameraPosition));
            gl_FragColor = vec4(col, 1.);
          }`}),-.5)}await x.yield();const ut=de(S,W,{decal:!0,side:t.DoubleSide,vBody:"wp = modelMatrix*vec4(p, 1.); wp.y += heroSea(wp.xz)+.12; wn = vec3(0., 1., 0.);",fBody:"tone = clamp(vM.z, 0., 1.); alpha = 1.-smoothstep(.5, .95, fog);"}),Vt=e=>{const r=ve(),f=(o,c,u,i,s,n=72)=>{r.set(u,i,s),r.grid(n,1,(l,p,h)=>{const d=l*H,v=o+(c-o)*p;h[0]=Math.cos(d)*v,h[1]=0,h[2]=-Math.sin(d)*v},[H*c,c-o])};f(e*1,e*1.09,3,.5,.42),f(e*1.09,e*1.115,5,0,0),f(e*.985,e*1,5,0,0);const a=(o,c,u,i,s,n,l)=>{const p=Math.cos(o),h=Math.sin(o),d=c>e*.7?7:4,v=u/c;for(const m of[-1,1]){m<0?r.set(0,0,l):r.set(s,n,s===0?.04:.1);const g=Math.cos(o+m*i)*u,A=Math.sin(o+m*i)*u,y=p*c,F=h*c;let P=-1,z=-1;for(let k=0;k<=d;k++){const B=k/d,Z=y*B,O=F*B;let J,re;if(B<=v)J=g*(B/v),re=A*(B/v);else{const Xe=(B-v)/(1-v);J=g+(y-g)*Xe,re=A+(F-A)*Xe}const ye=r.v(Z,0,O,0,1,0,0,B*c),Fe=r.v(J,0,re,0,1,0,m*Math.hypot(J-Z,re-O),B*c);k>0&&(m>0?r.quad(P,z,Fe,ye):r.quad(P,ye,Fe,z)),P=ye,z=Fe}}};for(let o=0;o<32;o++)o%2===1&&a(o/32*H,e*.44,e*.2,H/64,1,.6,.5);for(let o=0;o<32;o+=2)o%4===2&&a(o/32*H,e*.62,e*.2,H/40,2,.7,.66);f(e*.5,e*.56,4,.5,0),f(e*.56,e*.575,5,0,0),f(e*.485,e*.5,5,0,0);for(let o=0;o<32;o+=4)o%8===4&&a(o/32*H,e*.8,e*.17,H/20,4,.5,.8);for(let o=0;o<32;o+=8)a(o/32*H,e*.98,e*.17,H/16,0,0,.86);return f(0,e*.075,4,.5,0,24),f(e*.075,e*.09,5,0,0,24),r.build()},Wt=(()=>{const e=ve();return e.set(4,.5,0),e.grid(1,6,(r,f,a)=>{const o=f*2-1,c=.035*(1-Math.abs(o))+.004;a[0]=o,a[1]=0,a[2]=(r-.5)*2*c},[.07,2]),e.build()})(),tt=[{p:te(70),R:40,a0:Math.PI/2},{p:Y.clone(),R:35,a0:Math.atan2(-L.z,L.x)},{p:new t.Vector3(560,0,-260),R:48,a0:.5}],ot=[];for(const e of tt){const r=E(Vt(e.R),ut,-.3);r.position.set(e.p.x,0,e.p.z),r.rotation.y=e.a0;const f=E(Wt,ut,-.29);f.position.set(e.p.x,.1,e.p.z),f.scale.setScalar(e.R*.92),f.userData.a0=e.a0+.3,ot.push(f),await x.yield()}await x.yield();const Gt=3+1.3*j;{const e=[],r=[],f=[],a=[];for(const c of tt)for(let u=0;u<16;u++){const i=-c.a0+u/16*H,s=Math.cos(i),n=Math.sin(i),l=c===tt[1]?12:c.R*.09,p=34,h=e.length/3;for(let d=0;d<=p;d++){const v=l+(1500-l)*Math.pow(d/p,2.2);for(const m of[-1,1])e.push(c.p.x+s*v,Gt,c.p.z+n*v),r.push(s,n,v),f.push(m)}for(let d=0;d<p;d++){const v=h+d*2;a.push(v,v+1,v+3,v,v+3,v+2)}}const o=new t.BufferGeometry;o.setAttribute("position",new t.Float32BufferAttribute(e,3)),o.setAttribute("aDir",new t.Float32BufferAttribute(r,3)),o.setAttribute("aSide",new t.Float32BufferAttribute(f,1)),o.setIndex(a),o.boundingSphere=new t.Sphere(new t.Vector3,4e3),E(o,new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...S,...W},vertexShader:`
          uniform float uTime, uResY; uniform vec3 uCam; uniform vec4 uRingP;
          attribute vec3 aDir; attribute float aSide;
          varying float vSide, vA;
          #include <fog_pars_vertex>
          void main(){
            vec3 wp = position;
            wp.y += .07*sin(uTime*13.+aDir.z*.21)*smoothstep(0., 30., aDir.z)+.25*sin(uTime*.9+aDir.z*.013);
            vec4 mvPosition = viewMatrix*vec4(wp, 1.);
            vec3 vt = normalize((viewMatrix*vec4(aDir.x, 0., aDir.y, 0.)).xyz+vec3(1e-5, 0., 0.));
            vec2 sd = normalize(vec2(-vt.y, vt.x)+vec2(1e-5, 0.));
            float depth = max(-mvPosition.z, .1);
            float pxw = depth*2./(projectionMatrix[1][1]*uResY);
            float nearRose = 1.-smoothstep(260., 420., distance(wp.xz, uRingP.xy));      // the fan converging on the exit rose
            float hw = max(.05+.05*nearRose, mix(1.05, 2.2, nearRose)*pxw);
            mvPosition.xy += sd*aSide*hw;
            vSide = aSide;
            vA = mix(min(1., .05/hw*1.6+.6), 1., nearRose)*smoothstep(11., 19., length(wp.xz-uCam.xz));
            gl_Position = projectionMatrix*mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uPaper, uInk, uInkFar;
          varying float vSide, vA;
          ${pe}
          void main(){
            float f = eFog();
            float a = vA*(1.-smoothstep(.45, 1., abs(vSide)))*(1.-smoothstep(.35, .9, f));
            gl_FragColor = vec4(mix(uInk, uInkFar, smoothstep(.1, .7, f)), a);
          }`}),1)}const $e=new t.Group;K.add($e);{const e=ve();e.set(4,.5,.05),e.grid(72,14,(o,c,u)=>{const i=o*H,s=c*H,n=1+.1*Math.cos(i*36)*(.5+.5*Math.cos(s)),l=.95*(1+.16*Math.cos(s*3))*n,p=8.45+Math.cos(s)*l;u[0]=Math.cos(i)*p,u[1]=Math.sin(i)*p,u[2]=Math.sin(s)*l},[H*8.45,H*.95],null,!0);for(let o=0;o<4;o++){const c=o*H/4+H/8;e.blob(Math.cos(c)*9.5,Math.sin(c)*9.5,0,.9,.9,.7,1,null,0)}const r=e.build(),f=new t.Mesh(r,xe),a=new t.Mesh(r,be);f.frustumCulled=a.frustumCulled=!1,$e.add(f,a),$e.position.copy(b.end),$e.quaternion.setFromUnitVectors(new t.Vector3(0,0,1),b.endTangent.clone().negate().normalize())}await x.yield();const Dt=(()=>{const e=document.createElement("canvas");e.width=512,e.height=256;const r=e.getContext("2d");r.fillStyle="#000",r.fillRect(0,0,512,256),r.strokeStyle="#fff",r.lineWidth=9,r.lineCap="round",r.lineJoin="round";const f={1:[[[.38,.28],[.55,.12],[.55,.9]]],2:[[[.27,.3],[.33,.15],[.52,.1],[.7,.2],[.7,.4],[.27,.9],[.76,.9]]],3:[[[.27,.14],[.7,.14],[.46,.45],[.7,.6],[.66,.84],[.42,.92],[.24,.8]]],4:[[[.62,.9],[.62,.1],[.22,.65],[.8,.65]]],7:[[[.24,.12],[.76,.12],[.42,.9]],[[.42,.5],[.68,.5]]],9:[[[.7,.3],[.6,.13],[.4,.12],[.29,.3],[.38,.48],[.58,.48],[.7,.3],[.68,.7],[.48,.92],[.3,.84]]],A:[[[.5,.24],[.5,.88]],[[.3,.36],[.7,.36]],[[.18,.58],[.24,.76],[.5,.9],[.76,.76],[.82,.58]],[[.1,.66],[.18,.58],[.28,.64]],[[.72,.64],[.82,.58],[.9,.66]],[[.5,.24],[.43,.17],[.5,.1],[.57,.17],[.5,.24]]]};["7","12","4","23","9","31","A","A"].forEach((c,u)=>{const i=u%4*128,s=Math.floor(u/4)*128,n=c.length;for(let l=0;l<n;l++)for(const p of f[c[l]])r.beginPath(),p.forEach((h,d)=>{const v=i+14+(n===1?20+h[0]*60:l*50+h[0]*50),m=s+18+h[1]*92;d?r.lineTo(v,m):r.moveTo(v,m)}),r.stroke()});const o=new t.CanvasTexture(e);return o.generateMipmaps=!0,o.minFilter=t.LinearMipmapLinearFilter,o.anisotropy=4,o})();{const e=Math.round(300*ae*we),r=[],f=[],a=R.fork("glyphs");for(let u=0;u<e;u++){const i=a.range(10,640),s=te(Math.min(i,588)),n=a.chance(.5)?1:-1,l=n*a.range(7,150)*(a.chance(.6)?.4:1),p=b.tangentAt(Math.min(1,i/588));r.push(s.x-p.z*l,s.z+p.x*l,a.range(2.6,5.5),a.range(-.5,.5)+Math.atan2(p.x,-p.z)),f.push(Math.min(7,Math.floor(a()*8)),a.range(0,6.28))}const o=new t.InstancedBufferGeometry;o.instanceCount=e,o.setAttribute("position",new t.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,.5,0,.5,-.5,0,.5],3)),o.setIndex([0,2,1,0,3,2]),o.setAttribute("iG",new t.InstancedBufferAttribute(new Float32Array(r),4)),o.setAttribute("iH",new t.InstancedBufferAttribute(new Float32Array(f),2)),o.boundingSphere=new t.Sphere(new t.Vector3,4e3);const c=new t.ShaderMaterial({fog:!0,side:t.DoubleSide,depthTest:!1,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.SrcAlphaFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...S,...W,uAtlas:{value:Dt}},vertexShader:`
          uniform float uTime; attribute vec4 iG; attribute vec2 iH;
          varying vec2 vUv;
          #include <fog_pars_vertex>
          ${Pe}
          void main(){
            float r = iG.w+.14*sin(uTime*.6+iH.y), c = cos(r), s = sin(r);
            vec2 o = vec2(position.x*c-position.z*s, position.x*s+position.z*c)*iG.z;
            vec3 hg = seaHG(iG.xy);
            vec3 wp = vec3(iG.x+o.x, hg.x+dot(hg.yz, o)+.14, iG.y+o.y);
            vUv = (vec2(position.x+.5, .5-position.z)+vec2(mod(iH.x, 4.), floor(iH.x/4.)))*vec2(.25, .5);
            vec4 mvPosition = viewMatrix*vec4(wp, 1.); gl_Position = projectionMatrix*mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uPaper, uInk, uInkFar; uniform sampler2D uAtlas;
          varying vec2 vUv;
          ${pe}
          void main(){
            float f = eFog();
            float a = smoothstep(.3, .62, texture2D(uAtlas, vUv).r)*(1.-smoothstep(.3, .8, f))*.9;
            gl_FragColor = vec4(mix(uInk, uInkFar, smoothstep(0., .5, f)), a);
          }`});E(o,c,-.28)}await x.yield();{const e=Math.round(3600*ae*(.55+.45*j)),r=new Float32Array(e*4),f=R.fork("ticks");for(let o=0;o<e;o++)r[o*4]=f.range(0,320),r[o*4+1]=f.range(0,320),r[o*4+2]=f(),r[o*4+3]=f.range(.45,.95)*(w==="gale"?1.3:1);const a=new t.InstancedBufferGeometry;a.instanceCount=e,a.setAttribute("position",new t.Float32BufferAttribute([-1,0,0,1,0,0,1,2,0,-1,2,0],3)),a.setIndex([0,1,2,0,2,3]),a.setAttribute("iT",new t.InstancedBufferAttribute(r,4)),a.boundingSphere=new t.Sphere(new t.Vector3,4e3),E(a,new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...S,...W},vertexShader:`
          uniform vec3 uCam; attribute vec4 iT;
          varying vec2 vQ; varying float vRoll, vFl;
          #include <fog_pars_vertex>
          ${Pe}
          void main(){
            vec2 c = uCam.xz+mod(iT.xy-uCam.xz, 320.)-160.;
            float a = dot(c, vec2(.342, .94))*.0698-uSeaT*.55+(iT.z-.5)*1.1;
            float crest = smoothstep(.5, .93, sin(a));
            float dist = length(c-uCam.xz);
            float s = iT.w*crest*(1.-smoothstep(70., 120., dist))*smoothstep(9., 17., dist);
            vec3 right = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0])+vec3(1e-5, 0., 0.));
            float fl = iT.z > .5 ? 1. : -1.;
            vec3 wp = vec3(c.x, heroSea(c)-.12*s, c.y)+right*position.x*s+vec3(0., position.y*s, 0.);
            vQ = vec2(position.x*fl, position.y-1.); vRoll = cos(a); vFl = step(1e-3, s);
            vec4 mvPosition = viewMatrix*vec4(wp, 1.); gl_Position = projectionMatrix*mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uPaper, uInk, uInkFar;
          varying vec2 vQ; varying float vRoll, vFl;
          ${pe}
          void main(){
            float wq = fwidth(vQ.y)+1e-4, hw = max(.06, .9*wq);
            vec2 q = vQ;
            vec2 q1 = q-vec2(.05, -.1); float r1 = length(q1), ang = atan(q1.y, q1.x+1e-5);
            float open = .25+.5*vRoll;                                          // the scroll unrolls past the crest
            float m1 = smoothstep(-.9, -.5, ang)*(1.-smoothstep(2.1+open, 2.5+open, ang));
            float d = abs(r1-.6)+(1.-m1)*4.;
            d = min(d, abs(q.y+.86+.1*q.x)+smoothstep(.75, .98, abs(q.x))*4.);
            float f = eFog();
            float a = (1.-smoothstep(hw, hw+wq*1.3, d))*(1.-smoothstep(.3, .55, wq))*(1.-smoothstep(.3, .85, f))*vFl*.9;
            gl_FragColor = vec4(mix(uInk, uInkFar, smoothstep(0., .5, f)), a);
          }`}),1.5)}await x.yield();const Ce=new t.Group;K.add(Ce);const at=[];{const e=T!=="galleon",r=T==="galley",f=r?37:e?31:40,a=ve(),o=h=>(e?3.9:4.7)*Math.pow(Math.sin(Math.PI*Math.min(1,h*.9+.07)),.55),c=h=>(r?2.6:e?3.4:4.3)+(r?3.2:e?4.2:6.2)*Math.pow(Math.max(0,1-h*1.6),1.6)+2.4*Math.pow(h,4),u=(h,d,v)=>{const m=(d-.5)*Math.PI,g=o(h),A=c(h),y=Math.pow(Math.max(0,Math.cos(m)),1.15);v[0]=g*Math.sign(m)*Math.pow(Math.abs(Math.sin(m)),.62)*(1-.1*(1-y)),v[1]=A-(A+2.6)*y,v[2]=(.5-h)*f};a.set(3,.6,.2),a.grid(26,12,u,[f,15],null,!0),a.set(3,.4,.08),a.grid(18,2,(h,d,v)=>{v[0]=(d*2-1)*o(h)*.93,v[1]=c(h)-.5,v[2]=(.5-h)*f},[f,6]),a.set(3,.6,.3),a.grid(4,4,(h,d,v)=>{const m=o(0)*(.55+.45*d);v[0]=(h*2-1)*m,v[1]=-2+(c(0)+2)*d,v[2]=f/2+.3*Math.sin(Math.PI*h)},[3,6]);const i=[0,0,0];a.set(5,0,0);for(let h=0;h<(e?5:8);h++)for(const d of[.2,.8]){const v=.2+h*(e?.12:.085);u(v,d,i);const m=i[0]+Math.sign(i[0])*.08,g=i[1],A=i[2],y=Math.sign(i[0]),F=a.v(m,g-.4,A-.45,y,.2,0,0,0),P=a.v(m,g-.4,A+.45,y,.2,0,0,0),z=a.v(m+y*.05,g+.4,A+.45,y,.2,0,0,0),k=a.v(m+y*.05,g+.4,A-.45,y,.2,0,0,0);a.quad(F,P,z,k)}(r?[[.52,24]]:e?[[.62,25],[.3,20]]:[[.5,38],[.76,31],[.22,26]]).forEach(([h,d],v)=>{const m=(.5-h)*f,g=c(h)-.5;if(a.set(3,.5,.25),a.tube([[0,g,m],[0,g+d*.5,m],[0,g+d,m]],y=>.42-.24*y,7),e||v===2){const y=Math.cos(1.05),F=Math.sin(1.05),P=z=>{const k=z[0],B=z[2]-m;return z[0]=k*y+B*F,z[2]=m-k*F+B*y,z};a.set(3,.5,.25),a.tube([P([-.4,g+d*.34,m-d*.34]),P([.2,g+d*.7,m+.2]),P([.5,g+d*1.02,m+d*.33])],.16,5),a.set(3,.55,.24),a.grid(8,7,(z,k,B)=>{const Z=1-k;B[0]=-.4+.9*z-(2.2+d*.05)*Math.sin(Math.PI*z)*Math.sin(Math.PI*k*.8+.3)*Z,B[1]=g+d*(.34+.68*z)-k*d*(.24+.38*z),B[2]=m-d*.34+d*.67*z*(1-.25*k)+.6*k,P(B)},[d*.5,d*.35],(z,k)=>.3*Math.sin(Math.PI*z)*k)}else{const y=[[.3,.62,7.5,6.2],[.66,.86,5.6,4.4],[.89,.99,3.8,3]].slice(0,v===0?3:2);for(const[F,P,z,k]of y){const B=g+d*F,Z=g+d*P,O=d/38;a.set(3,.5,.25),a.tube([[-k*O-.4,Z,m-.5],[k*O+.4,Z,m-.5]],.15,5),a.set(3,.55,.24),a.grid(8,6,(J,re,ye)=>{const Fe=(z+(k-z)*re)*O;ye[0]=(J*2-1)*Fe,ye[1]=B+(Z-B)*re+.5*Math.pow(Math.abs(J*2-1),2)*(1-re),ye[2]=m-.6-(1.8+1.6*O)*Math.sin(Math.PI*J)*Math.sin(Math.PI*(.15+.85*re))},[z*O*2,Z-B],(J,re)=>.22*Math.sin(Math.PI*J)*Math.sin(Math.PI*re))}}a.set(0,0,.42);for(const y of[-1,1])a.grid(1,3,(F,P,z)=>{const k=o(h)*.95;z[0]=y*k*(1-P*.96),z[1]=g+d*.66*P,z[2]=m+(F-.5)*3.4*(1-P)+1.2*(1-P)},[3.4,d*.66]);a.set(2,.85,.1),a.grid(7,1,(y,F,P)=>{P[0]=.5*Math.sin(y*5),P[1]=g+d+.4-F*(1.3-y*1.1)-.5*y,P[2]=m-y*(6+d*.08)},[7,1.3],y=>.45*y)}),a.set(3,.5,.25),a.tube([[0,c(.93)-.2,-f*.42],[0,c(1)+3.4,-f*.5-7.5]],h=>.3-.14*h,6),a.set(4,.5,0);for(const h of[-1.5,0,1.5])a.blob(h,c(0)+1.3+(h===0?.7:0),f/2+.5,.42,.6,.42,1,null,0);const n=a.build(),l=new t.Mesh(n,xe),p=new t.Mesh(n,be);if(l.frustumCulled=p.frustumCulled=!1,Ce.add(l,p),r)for(const h of[-1,1]){const d=ve();for(let y=0;y<10;y++){const F=.24+y*.058,P=(.5-F)*f,z=h*o(F)*.97,k=c(F)-.75,B=h*(o(F)+7.4);d.set(3,.5,.3),d.tube([[z-h*1.2,k+.5,P-.1],[z,k,P],[B,-.4,P+.5]],.12,5),d.set(0,0,.16),d.grid(2,1,(Z,O,J)=>{J[0]=B-h*.5+h*Z*1.9,J[1]=-.4-Z*.35+(O-.5)*.12,J[2]=P+.5+(O-.5)*.7},[1.9,.7])}const v=d.build(),m=new t.Group;m.matrixAutoUpdate=!1,m.userData.sd=h;const g=new t.Mesh(v,xe),A=new t.Mesh(v,be);g.frustumCulled=A.frustumCulled=!1,m.add(g,A),Ce.add(m),at.push(m)}}await x.yield();const ft=new t.Vector3(-42,22,170);{const r=[],f=[],a=new Float32Array(120),o=R.fork("gulls"),c=4;for(const s of[-1,1])for(let n=0;n<=c;n++)for(const l of[-1,1])r.push(0,0,0),f.push(n/c,s,l);const u=[];for(let s=0;s<2;s++)for(let n=0;n<c;n++){const l=s*(c+1)*2+n*2;u.push(l,l+1,l+3,l,l+3,l+2)}for(let s=0;s<30;s++)a[s*4]=o(),a[s*4+1]=o.range(7,30),a[s*4+2]=o.range(-7,12),a[s*4+3]=o.range(7,12)*(o.chance(.5)?1:-1);const i=new t.InstancedBufferGeometry;i.instanceCount=30,i.setAttribute("position",new t.Float32BufferAttribute(r,3)),i.setAttribute("aW",new t.Float32BufferAttribute(f,3)),i.setIndex(u),i.setAttribute("iA",new t.InstancedBufferAttribute(a,4)),i.boundingSphere=new t.Sphere(new t.Vector3,4e3),E(i,new t.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...S,...W,uGullC:{value:ft}},vertexShader:`
          uniform float uTime, uResY; uniform vec3 uGullC;
          attribute vec3 aW; attribute vec4 iA;
          varying vec2 vQ;
          #include <fog_pars_vertex>
          vec3 wingPt(float t){
            float ang = iA.x*6.283+uTime*iA.w/iA.y;
            vec3 rad = vec3(cos(ang), 0., sin(ang));
            vec3 c = uGullC+rad*iA.y*vec3(1., 0., .75)+vec3(0., iA.z+1.5*sin(uTime*.6+iA.x*20.), 0.);
            float flap = sin(uTime*(5.5+iA.x*2.)+iA.x*30.);
            float glide = smoothstep(-.2, .6, sin(uTime*.5+iA.x*11.));
            float lift = mix(flap, .25, glide)*t*.75-t*t*.5*(.4+.4*flap*(1.-glide))+.22*sin(t*3.14159);
            return c+rad*aW.y*t*1.25+vec3(0., lift, 0.);
          }
          void main(){
            vec4 p0 = viewMatrix*vec4(wingPt(aW.x), 1.), p1 = viewMatrix*vec4(wingPt(aW.x+.1), 1.);
            vec2 dir = p1.xy-p0.xy; dir = dir/max(length(dir), 1e-5);
            float depth = max(-p0.z, .1), pxw = depth*2./(projectionMatrix[1][1]*uResY);
            float hw = max(.085*(1.-.6*aW.x), .8*pxw);
            vec4 mvPosition = p0; mvPosition.xy += vec2(-dir.y, dir.x)*aW.z*hw;
            vQ = vec2(aW.z, min(1., .085/hw+.35));
            gl_Position = projectionMatrix*mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uPaper, uInk, uInkFar;
          varying vec2 vQ;
          ${pe}
          void main(){
            float f = eFog();
            gl_FragColor = vec4(mix(uInk, uInkFar, smoothstep(0., .5, f)), vQ.y*(1.-smoothstep(.4, 1., abs(vQ.x)))*(1.-smoothstep(.4, .95, f)));
          }`}),3)}const me=[];{const e=ve();e.set(1,.8,.45),e.grid(4,2,(n,l,p)=>{const h=Math.sin(Math.PI*Math.min(1,n*1.1))*.13+.01;p[0]=0,p[1]=(l-.5)*2*h+(n<.12?(l-.5)*.35*(1-n/.12):0),p[2]=(.5-n)*1},[1,.3]),e.set(2,.7,.16);for(const n of[-1,1])e.grid(2,1,(l,p,h)=>{h[0]=n*l*.95,h[1]=.03+l*.2,h[2]=-.25+p*.3*(1-l*.8)+l*.6},[.9,.4],l=>.12*l);const r=e.build(),f=80,a=new Float32Array(f*4),o=new Float32Array(f*4),c=R.fork("fish"),u=new t.Vector3;for(let n=0;n<f;n++){const l=n>=40,p=l?c.range(29.3,31.6):c.range(2.6,6.2),h=p*14,d=c.chance(.5)?1:-1,v=te(h);b.tangentAt(Math.min(1,h/588),u),u.y=0,u.normalize();const m=c.range(11,19),g=d*c.range(8.5,11),A=-d*c.range(6.2,8.2),y=c.range(11.5,13.2),F=v.x+u.x*m-u.z*g,P=v.z+u.z*m+u.x*g;a[n*4]=F,a[n*4+1]=-.4,a[n*4+2]=P,a[n*4+3]=p;const z=u.x*14.5-u.z*A,k=u.z*14.5+u.x*A;o[n*4]=z,o[n*4+1]=y,o[n*4+2]=k,o[n*4+3]=c();const B=2*y/9.5;n%2===0&&me.push([F,P,.3,3.2,1,p,1,0],[F+z*B,P+k*B,.3,3.6,1,p+B,1,0])}const i=new t.InstancedBufferGeometry;i.index=r.index,i.instanceCount=f;for(const n of["position","normal","aHatch","aM"])i.setAttribute(n,r.attributes[n]);i.setAttribute("iS",new t.InstancedBufferAttribute(a,4)),i.setAttribute("iV",new t.InstancedBufferAttribute(o,4)),i.boundingSphere=new t.Sphere(new t.Vector3,4e3);const s={side:t.DoubleSide,vHead:"attribute vec4 iS, iV;",vBody:`float age = uT-iS.w, dur = 2.*iV.y/9.5, on = step(0., age)*step(age, dur);
          vec3 vel = vec3(iV.x, iV.y-9.5*age, iV.z);
          vec3 fw = normalize(vel), rt = normalize(cross(fw, vec3(0., 1., 0.))+vec3(1e-5, 0., 0.)), up = cross(rt, fw);
          p.y += aM.w*sin(uTime*38.+iV.w*30.)*.9; p *= 1.55*on;
          vec3 c = iS.xyz+vec3(iV.x*age, iV.y*age-4.75*age*age, iV.z*age);
          wp = vec4(c+rt*p.x+up*p.y-fw*p.z, 1.); wn = normalize(rt*n.x+up*n.y-fw*n.z);`};E(i,de(S,W,s),0),E(i,de(S,W,{...s,outline:!0,px:1.6,maxW:".06"}),0)}const nt=[];{const e=ve(),r=[];for(let a=0;a<=14;a++){const o=a/14,c=-.9+o*2.3;r.push([0,Math.sin(c)*.9-.25*o*o,-1.5+o*3-.5*(1-Math.cos(c))+.6])}e.set(1,.75,.08),e.tube(r,a=>.06+.5*Math.pow(Math.sin(Math.PI*Math.min(1,.06+a*.9)),.7)*(.55+.45*(1-a)),10,!0),e.set(2,.8,.1),e.grid(3,2,(a,o,c)=>{c[0]=(o-.5)*.08,c[1]=.42+a*.8,c[2]=.35+o*.9-a*(.15+.6*o)+.3*a},[.8,.9]);for(const a of[-1,1])e.grid(3,1,(o,c,u)=>{u[0]=a*o*.9,u[1]=.62-.25*o*o,u[2]=1.6+o*.55+c*.5*(1-o*.6)},[.9,.5]);e.set(0,0,.2),e.tube([[0,-.66,-1.1],[0,-.98,-1.8]],a=>.2-.12*a,6,!0);const f=e.build();for(let a=0;a<3;a++){const o=new t.Group,c=new t.Mesh(f,xe),u=new t.Mesh(f,be);c.frustumCulled=u.frustumCulled=!1,o.add(c,u),o.visible=!0,o.scale.setScalar(.001),K.add(o),nt.push(o)}}await x.yield();const it=te(376.8),Ut=e=>37+3.5*Math.sin(e*.21)+2*Math.sin(e*.53+1),Ke=(e,r)=>r.copy(it).addScaledVector(L,e-376.8).addScaledVector(ne,Ut(e)).setY(0),ht=e=>e+.6*(1-G(24.4,28,e)),dt=e=>Je(396,656,1-Math.pow(1-Math.min(1,Math.max(0,(ht(e)-25)/7.5)),1.6)),pt={value:new t.Vector3(0,-40,0)},vt={uniforms:{uWhaleBlow:pt},vHead:"attribute float aE; uniform float uBurin, uWhale; uniform vec3 uWhaleBlow;",vBody:`float code = floor(aE*.001+.01), key = aE-code*1000., k = clamp((uBurin-key)/30., 0., 1.);
        float rise = k*k*(3.-2.*k)+.12*sin(k*9.42)*(1.-k);
        if(code > 2.5 && code < 3.5) p.y = mix(p.y, 4.4, smoothstep(.02, .15, uWhale));
        if(code > 4.5){ float sp = smoothstep(.12, .3, uWhale)*(1.-smoothstep(.55, .8, uWhale));
          p = uWhaleBlow+(p-uWhaleBlow)*sp*(.88+.12*sin(uTime*6.+p.y*.7)); }
        p.y = -5.+(p.y+5.)*rise-step(.5, code)*smoothstep(.3, 1., uWhale)*30.;
        wp = modelMatrix*vec4(p, 1.); wn = normalize(mat3(modelMatrix)*n*vec3(1., max(rise, .05), 1.));`},Ue=[];{const e=ve(),r=R.fork("isles"),f=new t.Matrix4,a=[[1,-5],[.99,0],[.9,.13],[.72,.4],[.5,.68],[.28,.88],[.11,.98],[.002,1]];for(let c=0;c<20;c++){const u=404+c*12.4+r.range(-2,2),i=52+r.range(0,10)+(c%3===1?r.range(8,20):0),s=r.range(14,22)+7*G(470,530,u)*(1-G(560,600,u)),n=r.range(10.5,14.5)+2.5*G(520,600,u),l=it.clone().addScaledVector(L,u-376.8).addScaledVector(ne,i),p=X&&c===14,h=r.range(0,50);if(e.extra=u-6+(p?1e3:0),e.xf(f.makeTranslation(l.x,0,l.z)),p){e.set(1,.6,.12),e.blob(0,1,0,24,9,11,2,D,.08),e.set(4,.5,0),e.blob(14,2.4,8.6,2.3,1.7,.8,2,null,0),e.set(5,0,0),e.blob(14.3,2.4,9.3,.7,1.4,.4,1,null,0),e.extra=u-6+3e3,e.set(1,.6,.34),e.blob(14,2.4,8.8,2.55,1.95,1.05,2,null,0),e.extra=u-6+5e3,e.set(0,0,.3);for(let v=0;v<10;v++){const m=v%5*.42-.84+(v<5?0:Math.PI),g=.5+.5*(v*7%5)/4,A=[];for(let y=0;y<=8;y++){const F=y/8,P=g*(2*F+10*F*F),z=20*(1-(1.55*F-1)*(1.55*F-1));A.push([6+Math.cos(m)*P,9.4+z,Math.sin(m)*P*.8])}e.tube(A,y=>.05+.07*Math.sin(Math.PI*Math.min(1,y*1.15)),4,!1)}pt.value.set(l.x+6,9.4,l.z),e.extra=u-6+1e3,e.set(1,.7,.3),e.tube([[-21,2,0],[-27,6,0],[-31,12.5,0]],v=>3.4-2.4*v,8,!0);for(const v of[-1,1])e.grid(5,3,(m,g,A)=>{A[0]=-31-3*m*m+3.5*g*(1-m*.5),A[1]=12.5+2.2*Math.sin(m*2.2)-g*1.2*m,A[2]=v*m*8.5},[8,4]);e.set(3,.6,.2),e.grid(8,5,(v,m,g)=>{const A=1.6*Math.sin(Math.PI*v);g[0]=-6+(v-.5)*7,g[1]=10.2+1.6*m-1.4*(1-Math.pow(Math.abs(m*2-1),2))*0-A*0,g[2]=(m-.5)*2*A},[7,3]),e.tube([[-6,10,0],[-6,19,0]],.16,5),me.push([l.x,l.z,20,26,1,-1,0,u-6])}else{e.set(1,.6,.2),e.lathe(a.map(([m,g])=>[m*n,g<0?g:g*s]),22,!1,(m,g)=>1+(.26*D.n2(Math.cos(m*H)*1.3+h,Math.sin(m*H)*1.3+g*1.5)+.1*D.n2(Math.cos(m*H)*4+h,Math.sin(m*H)*4+g*5))*Math.min(1,g*3));const v=r.range(0,H);e.set(1,.6,.28),e.blob(Math.cos(v)*n*.62,s*.2,Math.sin(v)*n*.62,n*.5,s*.34,n*.5,2,D,.25),me.push([l.x,l.z,n*.97,15,.9,-1,0,u-6])}await x.yield();const d=Math.round(22*ae*we);for(let v=0;v<d;v++){const m=r.range(0,H),g=p?r.range(0,.6):r.range(.08,.86);let A=p?9.6*Math.sqrt(Math.max(0,1-g*g)):s;if(!p){for(let y=2;y<a.length;y++)if(g<=a[y-1][0]&&g>=a[y][0]){const F=(a[y-1][0]-g)/(a[y-1][0]-a[y][0]);A=Je(a[y-1][1],a[y][1],F)*s}}Ue.push(l.x+Math.cos(m)*g*(p?20:n),A-.4,l.z+Math.sin(m)*g*(p?9:n),u-6+(p?1e3:0),r.range(2.4,3.8),r.range(0,H))}}e.xf(null),await x.yield();const o=e.build(!0);await x.yield(),E(o,de(S,W,vt),0),E(o,de(S,W,{...vt,outline:!0,px:2.3,maxW:".6"}),0)}await x.yield();{const e=Ue.length/6,r=[],f=[],a=[],o=3;for(let s=0;s<3;s++){const n=r.length/3;for(let l=0;l<=o;l++)for(const p of[-1,1])r.push(0,0,0),f.push(s-1,l/o,p);for(let l=0;l<o;l++){const p=n+l*2;a.push(p,p+1,p+3,p,p+3,p+2)}}const c=new Float32Array(e*4),u=new Float32Array(e*2);for(let s=0;s<e;s++)c.set(Ue.slice(s*6,s*6+4),s*4),u[s*2]=Ue[s*6+4],u[s*2+1]=Ue[s*6+5];const i=new t.InstancedBufferGeometry;i.instanceCount=e,i.setAttribute("position",new t.Float32BufferAttribute(r,3)),i.setAttribute("aK",new t.Float32BufferAttribute(f,3)),i.setIndex(a),i.setAttribute("iP",new t.InstancedBufferAttribute(c,4)),i.setAttribute("iQ",new t.InstancedBufferAttribute(u,2)),i.boundingSphere=new t.Sphere(new t.Vector3,4e3),E(i,new t.ShaderMaterial({fog:!0,side:t.DoubleSide,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...S,...W},vertexShader:`
          uniform float uTime, uResY, uBurin, uWhale;
          attribute vec3 aK; attribute vec4 iP; attribute vec2 iQ;
          #include <fog_pars_vertex>
          void main(){
            float key = mod(iP.w, 1000.), k = clamp((uBurin-key)/30., 0., 1.), rise = k*k*(3.-2.*k)+.12*sin(k*9.42)*(1.-k);
            float grow = smoothstep(.7, 1., k);
            vec3 base = vec3(iP.x, -5.+(iP.y+5.)*rise-step(1000., iP.w)*smoothstep(.3, 1., uWhale)*30., iP.z);
            vec3 right = normalize(vec3(viewMatrix[0][0], 0., viewMatrix[2][0])+vec3(1e-5, 0., 0.));
            float t = aK.y, h = iQ.x*grow;
            float lean = aK.x*.42+.16+.12*sin(uTime*3.1+iQ.y+aK.x)+.07*sin(uTime*7.3+iQ.y*3.);
            vec3 wp = base+vec3(0., t*h*(1.-.12*abs(aK.x)), 0.)+right*(lean*t*t*h*.7+aK.x*t*h*.12);
            vec4 mvPosition = viewMatrix*vec4(wp, 1.);
            float pxw = max(-mvPosition.z, .1)*2./(projectionMatrix[1][1]*uResY);
            mvPosition.x += aK.z*max(.11*(1.-.75*t), .75*pxw)*step(.01, grow);
            gl_Position = projectionMatrix*mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uPaper, uInk, uInkFar;
          ${pe}
          void main(){ float f = eFog(); vec3 ink = mix(uInk, uInkFar, smoothstep(0., .5, f)); gl_FragColor = vec4(mix(ink, eFogCol(), smoothstep(.3, 1., f)), 1.); }`}),0)}const ke=new t.Group;K.add(ke);{const e=ve();e.set(0,0,.3),e.tube([[0,-.6,-.4],[0,.5,1],[0,4.4,6.2]],l=>.1+.42*Math.min(1,l*2.4),4,!1),e.set(3,.75,.15),e.xf(new t.Matrix4().makeTranslation(0,4.4,6.2).multiply(new t.Matrix4().makeRotationX(.93))),e.lathe([[.02,-.2],[.5,0],[.62,.5],[.8,1.3],[1.35,2],[1.5,2.6],[1.1,3.1],[.02,3.25]],14,!0),e.xf(null);const r=e.build(),f=new t.Mesh(r,xe),a=new t.Mesh(r,be);f.frustumCulled=a.frustumCulled=!1,ke.add(f,a),ke.scale.setScalar(.001),ke.rotation.y=Math.atan2(-L.x,-L.z);const o=[],c=[],u=[],i=new t.Vector3,s=new t.Vector3;for(let l=396,p=0;l<=656;l+=1.5,p++){Ke(l,i),Ke(l+.5,s),s.sub(i).normalize();for(const h of[-1,1])o.push(i.x,0,i.z),c.push(l,h,-s.z,s.x);if(l+1.5<=656){const h=p*2;u.push(h,h+1,h+3,h,h+3,h+2)}}const n=new t.BufferGeometry;n.setAttribute("position",new t.Float32BufferAttribute(o,3)),n.setAttribute("aD",new t.Float32BufferAttribute(c,4)),n.setIndex(u),n.boundingSphere=new t.Sphere(new t.Vector3,4e3),E(n,new t.ShaderMaterial({fog:!0,side:t.DoubleSide,depthTest:!1,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.SrcAlphaFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...S,...W},vertexShader:`
          uniform float uResY, uBurin; attribute vec4 aD;
          varying vec2 vQ;
          #include <fog_pars_vertex>
          ${Pe}
          void main(){
            vec3 wp = position; 
            vec4 mv0 = viewMatrix*vec4(wp.x, 0., wp.z, 1.);
            float pxw = max(-mv0.z, .1)*2./(projectionMatrix[1][1]*uResY);
            wp.xz += aD.zw*aD.y*max(.34, 1.5*pxw);
            wp.y = heroSea(wp.xz)+.16;
            vQ = vec2(aD.y, uBurin-aD.x);
            vec4 mvPosition = viewMatrix*vec4(wp, 1.); gl_Position = projectionMatrix*mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          uniform vec3 uPaper, uInk, uInkFar;
          varying vec2 vQ;
          ${pe}
          void main(){
            float f = eFog();
            vec3 ink = mix(uInk*.25, uInk*1.4, smoothstep(0., 40., vQ.y));
            float a = smoothstep(0., .6, vQ.y)*(1.-smoothstep(.55, 1., abs(vQ.x)))*(1.-smoothstep(.45, .95, f));
            gl_FragColor = vec4(mix(ink, uInkFar, smoothstep(0., .6, f)), a);
          }`}),-.27)}{const e=ve();e.set(6,.9,.1),e.grid(26,1,(n,l,p)=>{const h=n*H*2.6,d=.75*(.5+.5*n);p[0]=Math.cos(h)*d,p[1]=Math.sin(h)*d,p[2]=(n-.5)*4.4+(l-.5)*.75},[9,.75]);const r=e.build(),f=52,a=new Float32Array(f*4),o=new Float32Array(f*4),c=R.fork("swarf"),u=new t.Vector3;for(let n=0;n<f;n++){const l=n<40?25.3+n/40*7+c.range(0,.15):24.5+(n-40)*.14+c.range(0,.1);Ke(dt(l),u),a[n*4]=u.x,a[n*4+1]=1.5,a[n*4+2]=u.z,a[n*4+3]=l;const p=c.range(-5,9),h=c.range(6,15);o[n*4]=L.x*h-ne.x*p,o[n*4+1]=c.range(9,15),o[n*4+2]=L.z*h-ne.z*p,o[n*4+3]=c.range(2,7)*(c.chance(.5)?1:-1)}const i=new t.InstancedBufferGeometry;i.index=r.index,i.instanceCount=f;for(const n of["position","normal","aHatch","aM"])i.setAttribute(n,r.attributes[n]);i.setAttribute("iS",new t.InstancedBufferAttribute(a,4)),i.setAttribute("iV",new t.InstancedBufferAttribute(o,4)),i.boundingSphere=new t.Sphere(new t.Vector3,4e3);const s={side:t.DoubleSide,vHead:"attribute vec4 iS, iV;",vBody:`float age = uT-iS.w, on = step(0., age)*(1.-smoothstep(2.6, 3.4, age))*smoothstep(0., .25, age);
          float a = age*iV.w, c = cos(a), s = sin(a);
          p = vec3(p.x*c-p.z*s, p.y, p.x*s+p.z*c)*on; n = vec3(n.x*c-n.z*s, n.y, n.x*s+n.z*c);
          vec3 ctr = iS.xyz+vec3(iV.x*age, iV.y*age-4.9*age*age, iV.z*age); ctr.y = max(ctr.y, .3);
          wp = vec4(ctr+p, 1.); wn = normalize(n);`};E(i,de(S,W,s),0),E(i,de(S,W,{...s,outline:!0,px:1.8,maxW:".12"}),0)}await x.yield(),me.push([Y.x+ne.x*6,Y.z+ne.z*6,1.3,11,1,-1,0,0],[Y.x-ne.x*6,Y.z-ne.z*6,1.3,11,1,-1,0,0]);const Ht=me.length;me.push([-42,150,7,16,.9,-1,0,0]);const _t=me.length;me.push([0,0,0,.001,1,-1,0,0]);let Te;await x.yield();{const e=me.length,r=[],f=[],a=5,o=30,c=new Float32Array(e*4),u=new Float32Array(e*4);for(let s=0;s<=a;s++)for(let n=0;n<=o;n++)r.push(s/a,n/o*H,0);for(let s=0;s<a;s++)for(let n=0;n<o;n++){const l=s*(o+1)+n;f.push(l,l+o+1,l+o+2,l,l+o+2,l+1)}me.forEach((s,n)=>{c.set(s.slice(0,4),n*4),u.set(s.slice(4,8),n*4)});const i=new t.InstancedBufferGeometry;i.instanceCount=e,i.setAttribute("position",new t.Float32BufferAttribute(r,3)),i.setIndex(f),Te=new t.InstancedBufferAttribute(c,4),Te.setUsage(t.DynamicDrawUsage),i.setAttribute("iA",Te),i.setAttribute("iB",new t.InstancedBufferAttribute(u,4)),i.boundingSphere=new t.Sphere(new t.Vector3,4e3),E(i,new t.ShaderMaterial({fog:!0,side:t.DoubleSide,depthTest:!1,depthWrite:!1,blending:t.CustomBlending,blendSrc:t.SrcAlphaFactor,blendDst:t.OneMinusSrcAlphaFactor,uniforms:{...t.UniformsUtils.clone(t.UniformsLib.fog),...S,...W},vertexShader:`
          uniform float uT, uBurin; attribute vec4 iA, iB;
          varying vec3 vR; varying vec3 vK;
          #include <fog_pars_vertex>
          ${Pe}
          void main(){
            float age = uT-iB.y;
            float life = iB.y < 0. ? 1. : step(0., age)*clamp(1.-age/2.6, 0., 1.);
            float grow = iB.y < 0. ? 1. : clamp(age/1.8, .05, 1.);
            float rs = iB.w > 0. ? smoothstep(iB.w, iB.w+30., uBurin) : 1.;
            float d = position.x*iA.w*grow, r = iA.z*rs+d;
            vec3 wp = vec3(iA.x+cos(position.y)*r, 0., iA.y+sin(position.y)*r);
            wp.y = heroSea(wp.xz)+.14;
            vR = vec3(d, position.y, r); vK = vec3(iA.w*grow, iB.z, iB.x*life*rs);
            vec4 mvPosition = viewMatrix*vec4(wp, 1.); gl_Position = projectionMatrix*mvPosition;
            #include <fog_vertex>
          }`,fragmentShader:`
          ${qe}
          ${pe}
          varying vec3 vR; varying vec3 vK;
          void main(){
            float d = vR.x, lifeR = clamp(1.-d/max(vK.x, .01), 0., 1.);
            float ph = d/1.9-uTime*.33*(1.-vK.y), wph = fwidth(d)/1.9+1e-4;
            float arc = vR.y*vR.z;
            float brk = smoothstep(.75-lifeR*.85, 1.05-lifeR*.85, eN1(arc*.16+floor(ph+.5)*7.3));
            brk *= mix(1., step(.45, fract(arc*.8)), vK.y);
            float hw = wph*(.9+1.7*lifeR*lifeR)*brk;
            float lines = (1.-smoothstep(hw-wph*.7, hw+wph*.7, abs(fract(ph+.5)-.5)))*step(1e-5, hw)*(.45+.55*lifeR);
            lines *= 1.-smoothstep(.22, .45, wph);
            float dark = (1.-smoothstep(0., 1.8, d))*.4*(1.-vK.y);
            float f = eFog();
            float a = max(lines, dark)*vK.z*(1.-smoothstep(.45, 1., f));
            vec3 ink = mix(uInk, uInkFar, smoothstep(0., .5, f));
            gl_FragColor = vec4(mix(ink, uWashA*.6, dark*(1.-lines)), a);
          }`}),-.26)}await x.yield();const Ve=new t.Group;K.add(Ve);const Se=e=>-3.95+1.8*((-e-.5)/13.9);{const e=ve(),r=[];for(let i=0;i<=7;i++){const s=-.5-i/7*13.9;r.push([0,Se(s),s])}e.set(3,.7,.24),e.tube(r,i=>.31-.14*i,10),e.set(0,0,.55);for(let i=0;i<9;i++){const s=-4.6-i*1.08,n=.33-.14*((-s-.5)/13.9);e.tube([[0,Se(s+.12),s+.12],[0,Se(s-.12),s-.12]],n+.035,10,!0,!1)}e.set(3,.5,.42);for(let i=0;i<5;i++){const s=-5.2-i*.16;for(const n of[-1,1])e.tube([[n*.2,Se(s)+.24,s],[n*.36,Se(s)-.5,s-.1],[n*.2,Se(s)-1.5,s-.5]],.055,4,!1,!1)}const f=-9.6,a=Se(f)-.46;e.set(3,.6,.3),e.tube([[-4.4,a+.1,f],[-2,a,f],[2,a,f],[4.4,a+.1,f]],i=>.085+.06*Math.sin(Math.PI*i),6);for(let i=0;i<6;i++)e.set(0,0,i%2?.2:.11),e.grid(3,8,(s,n,l)=>{const p=(i+s)/6,h=Math.sin(Math.PI*p),d=Math.sin(Math.PI*(.08+.84*n));l[0]=(p*2-1)*4.15*(1-.17*n),l[1]=a-.1-n*(3.5-.7*h*n)+.2*(1-n)*Math.pow(Math.abs(p*2-1),2),l[2]=f-.1-1.35*h*d-.25*n},[8.3/6,3.4],(s,n)=>.085*Math.sin(Math.PI*(i+s)/6)*n);e.set(5,0,0);for(let i=0;i<12;i++){const s=(i+.5)/12,n=(s*2-1)*4,l=f-.16-1.35*Math.sin(Math.PI*s)*Math.sin(Math.PI*.36);e.tube([[n,a-1.05,l-.05],[n+.04,a-1.42,l-.1]],.035,4,!1,!1)}{e.set(6,.62,.34),e.blob(0,-4.34,-7.86-.1,.5,.52,.58,3,D,.1);for(const p of[-1,1])e.tube([[p*.3,-4.34+.36,-7.86-.28],[p*.4,-4.34+.6,-7.86-.24],[p*.47,-4.34+.78,-7.86-.14]],h=>.15-.11*h,6,!0);const n=(p,h,d,v,m,g)=>{const A=[],y=Math.cos(p),F=Math.sin(p),P=g*2.399;for(let z=0;z<=10;z++){const k=z/10,B=Math.max(0,(k-.7)/.3)*4.4,Z=.11+.03*Math.sin(P*3);let O=.36+d*(.86*k-.3*k*k),J=-7.86+v+d*.95*Math.pow(k,.85);const re=.2*d*Math.sin(k*5.4+P)*Math.min(1,k*2.5);O+=Z*(1-Math.cos(B)),J-=Z*Math.sin(B)*1.2,A.push([h*(F*O+y*re),-4.34+y*O-F*re*.8-.3*d*k*k,J])}e.set(6,.64,.24+.1*(g%3===0?1:0)+(v<.1?.08:0)),e.tube(A,z=>m*(1-.78*Math.pow(z,1.3))+.012,7,!0)};let l=0;for(const p of[-1,1]){for(const[h,d]of[[46,1.3],[72,1.45],[100,1.5],[130,1.35],[162,1.2]])n(h*Math.PI/180,p,d,-.02,.22,l++);for(const[h,d]of[[30,.92],[59,1.05],[88,1]])n(h*Math.PI/180,p,d,.3,.19,l++)}}for(const i of[-1,1]){const s=p=>{const h=[];for(let d=0;d<=6;d++){const v=d/6;h.push([i*(2.5-2*Math.pow(v,1.4)),-3.2+p-1*v+.5*Math.sin(Math.PI*v)*.4,-1.2-7.2*v])}return h};e.set(3,.7,.32),e.tube(s(0),.12,6),e.tube(s(-.75),.1,6);const n=s(0),l=s(-.75);e.set(3,.6,.45);for(let p=1;p<6;p++)e.tube([n[p],l[p]],.07,4,!1,!1)}e.set(3,.6,.4),e.grid(6,10,(i,s,n)=>{const l=2.3-1.85*Math.pow(s,1.4);n[0]=(i*2-1)*l,n[1]=-4.15-.85*s,n[2]=-1.2-7*s},[4,7]),e.set(2,.9,.1),e.grid(9,1,(i,s,n)=>{n[0]=.12+i*2.7,n[1]=Se(-14.4)+.12-s*.55*(1-i*.85)-.3*i*i,n[2]=-14.35-i*.9},[2.7,.55],i=>.3*i);const o=e.build(),c=new t.Mesh(o,xe),u=new t.Mesh(o,de(S,W,{outline:!0,px:2,maxW:".05",vBody:`float fl = aM.w; p += n*fl*(sin(uTime*2.3+aHatch.x*.9+aHatch.y*.5)*.6+sin(uTime*5.1+aHatch.y*1.7)*.25);
        wp = modelMatrix*vec4(p, 1.); wn = normalize(mat3(modelMatrix)*n);`}));c.frustumCulled=u.frustumCulled=!1,Ve.add(c,u)}await x.yield();{const r=[],f=[],a=[],o=R.fork("spray");for(let i=0;i<80;i++){const s=i%2?1:-1,n=o(),l=o.range(1.5,5.5),p=o.range(7.5,10.8),h=o();for(let v=0;v<4;v++)r.push(s,l,p),f.push((v&1)*2-1,v>>1,n,h);const d=i*4;a.push(d,d+1,d+3,d,d+3,d+2)}const c=new t.BufferGeometry;c.setAttribute("position",new t.Float32BufferAttribute(r,3)),c.setAttribute("aS",new t.Float32BufferAttribute(f,4)),c.setIndex(a);const u=new t.Mesh(c,new t.ShaderMaterial({fog:!1,transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...S,...W},vertexShader:`
          uniform float uTime, uResY; attribute vec4 aS;
          varying vec2 vQ; varying float vA;
          vec3 arc(float a){ return vec3(position.x*(.9+position.y*a), -7.6+position.z*a-4.9*a*a, -6.6-2.5*a+5.5*a*a+aS.w*1.5); }
          void main(){
            float cyc = fract(uTime*(.55+.25*aS.w)+aS.z), age = cyc*1.9;
            vec4 p0 = modelViewMatrix*vec4(arc(age), 1.), p1 = modelViewMatrix*vec4(arc(max(age-.085, 0.)), 1.);
            vec4 mvPosition = mix(p0, p1, aS.y);
            vec2 dir = p1.xy-p0.xy; dir = dir/max(length(dir), 1e-4);
            float pxw = max(-mvPosition.z, .1)*2./(projectionMatrix[1][1]*uResY), hw = max(.028, .75*pxw);
            mvPosition.xy += vec2(-dir.y, dir.x)*aS.x*hw;
            vQ = aS.xy; vA = smoothstep(0., .2, age)*(1.-smoothstep(1.3, 1.9, age))*min(1., .028/hw+.5);
            gl_Position = projectionMatrix*mvPosition;
          }`,fragmentShader:`
          uniform vec3 uInk; varying vec2 vQ; varying float vA;
          void main(){ float tp = sin(3.14159*clamp(vQ.y, 0., 1.)); gl_FragColor = vec4(uInk, vA*(1.-smoothstep(tp*.9-.3, tp*.9+.05, abs(vQ.x)))*.85); }`}));u.frustumCulled=!1,u.renderOrder=4,Ve.add(u)}await x.yield();const mt={value:0},gt={value:0},wt={value:new t.Vector2(.16,.08)};{const e=Math.round(760*ae),r=[],f=[],a=[],o=R.fork("rain");for(let u=0;u<e;u++){const i=o(),s=o(),n=o(),l=o.range(1.8,3.6);for(let h=0;h<4;h++)r.push(i,s,n),f.push((h&1)*2-1,h>>1,l,u/e);const p=u*4;a.push(p,p+1,p+3,p,p+3,p+2)}const c=new t.BufferGeometry;c.setAttribute("position",new t.Float32BufferAttribute(r,3)),c.setAttribute("aQ",new t.Float32BufferAttribute(f,4)),c.setIndex(a),c.boundingSphere=new t.Sphere(new t.Vector3,4e3),E(c,new t.ShaderMaterial({transparent:!0,depthWrite:!1,side:t.DoubleSide,uniforms:{...S,...W,uRainAmt:mt,uRainThick:gt,uGust:wt},vertexShader:`
          uniform float uTime, uResY, uRainAmt, uRainThick; uniform vec3 uCam; uniform vec2 uGust; attribute vec4 aQ;
          varying vec2 vQ; varying float vA;
          void main(){
            vec3 box = vec3(56., 44., 56.);
            vec3 p = position*box; float sp = 30.*(.8+.4*fract(position.x*7.3));
            p.y -= uTime*sp; p.xz += uGust*uTime*sp;
            vec3 top = uCam+mod(p-uCam, box)-box*.5;
            float sl = aQ.z*(1.+.6*uRainThick);                                  // under the arch the strokes are longer and heavier
            vec3 bot = top+vec3(uGust.x*sl, -sl, uGust.y*sl);
            vec4 vt = viewMatrix*vec4(top, 1.), vb = viewMatrix*vec4(bot, 1.);
            vec4 mvPosition = mix(vt, vb, aQ.y);
            vec2 dir = vb.xy-vt.xy; dir = dir/max(length(dir), 1e-4);
            float depth = max(-mvPosition.z, .1), pxw = depth*2./(projectionMatrix[1][1]*uResY);
            float hmin = mix(.02, .042, uRainThick), hw = min(max(hmin, mix(.8, 1.25, uRainThick)*pxw), mix(2.2, 2.7, uRainThick)*pxw);
            mvPosition.xy += vec2(-dir.y, dir.x)*aQ.x*hw;
            float dist = distance(top, uCam);
            vQ = aQ.xy; vA = step(aQ.w, uRainAmt)*smoothstep(.9, 2.4, dist)*(1.-smoothstep(20., 27., dist))*step(.2, bot.y)*min(1., hmin/hw*2.4+.15)*mix(1., 1.25, uRainThick);
            gl_Position = projectionMatrix*mvPosition;
          }`,fragmentShader:`
          uniform vec3 uInk; varying vec2 vQ; varying float vA;
          void main(){ float tp = pow(max(sin(3.14159*clamp(vQ.y, 0., 1.)), 0.), .6); gl_FragColor = vec4(uInk*1.2, vA*(1.-smoothstep(tp*.9-.35, tp*.9+.05, abs(vQ.x)))*.8); }`}),3.5)}await x.yield();const ie=new t.Vector3,xt=new t.Quaternion,Nt=new t.Vector3,Ze=new t.Vector3,We=new t.Vector3,he=new t.Vector3,yt=new t.Vector3,Mt=new t.Euler(0,0,0,"YXZ"),Rt=new t.Vector2,bt=e=>24*G(.362,.485,e)*(1-G(.52,.58,e)),At=e=>20*G(.362,.44,e)*(1-G(.52,.58,e)),qt=new t.Vector3,Oe=C.anchors.head.clone(),zt=it.clone().addScaledVector(ne,-38).setY(0),se=new t.Vector3(-42,0,150);for(const e of nt)e.rotation.order="YXZ";Ce.rotation.order="YXZ";const St=(e,r)=>{const f=150-8.5*Math.min(e,7)-3*Math.max(0,e-7)-6*(1-Math.exp(-Math.max(0,e-7)/2.5));return r.set(-42-34*G(6,14,e),0,f)};function Pt(e,r,f,a){const o=a*_,c=a*le;f.matrixWorld.decompose(ie,xt,Nt),Ze.set(0,0,-1).applyQuaternion(xt),x.renderer&&(W.uResY.value=x.renderer.getDrawingBufferSize(Rt).y),W.uCam.value.copy(ie),W.uT.value=o,N.uSeaT.value=r,N.uHill.value.z=12.5*G(440,526,c),Ft.position.copy(ie),C.setProgress(C.progressFromU(a));const u=bt(a),i=At(a);C.setSurge(u,i),W.uGloom.value.set(0,-8-u-i*.5,95,.46*G(.362,.41,a)*(1-G(.5,.56,a)));const s=c-376.8+Je(-20,170,G(25.6,30,o))+85*G(24.2,25.1,o)*(1-G(25.6,28.5,o));C.setPacing(G(24.4,25,o),s,G(35,38.2,o),zt,L),C.update(e,r,f);const n=C.capsules;for(let $=0;$<17;$++)et[$].set(n[$*4],n[$*4+1],n[$*4+2],n[$*4+3]);const l=w==="calm"?0:1-G(30,85,Math.hypot(ie.x,ie.z+8)),p=(1-G(38,80,Math.hypot(ie.x,ie.z+8+u+i*.5)))*G(.3,.37,a)*(1-G(.5,.55,a)),h=G(.46,.5,a);mt.value=Math.max(w==="gale"?.55:0,l*.9,p*(1-.4*h)),gt.value=p*(1-.75*h),wt.value.set(.16+.07*Math.sin(r*.7),.08+.05*Math.sin(r*.43+1)),St(o,se),St(o+.5,he);const d=I(se.x,se.z);Ce.position.set(se.x,d*.55-.2,se.z),Ce.rotation.set((I(se.x,se.z-12)-I(se.x,se.z+12))*.012,Math.atan2(-(he.x-se.x),-(he.z-se.z)),-.13-.05*Math.sin(r*.7)+.16*G(6,9,o)*(1-G(12,16,o))),Te.setXYZW(Ht,se.x,se.z+2,7,16),Te.needsUpdate=!0;for(let $=0;$<at.length;$++){const ge=at[$],He=ge.userData.sd,_e=r*1.7,Ne=.34*Math.sin(_e),Re=.085+.085*Math.cos(_e);ge.matrix.set(1,0,0,0,Re*He,1,0,-Re*3.6,Ne*He,0,1,-Ne*3.6,0,0,0,1),ge.matrixWorldNeedsUpdate=!0}o<24.6?he.set(se.x,24,se.z+20).lerp(yt.set(Oe.x-4,Oe.y+20,Oe.z+6),G(10.5,15,o)):he.copy(zt).addScaledVector(L,s-30).setY(30),ft.lerp(he,o<.01||e<=0?1:1-Math.exp(-Math.min(e,.1)*1.4)),b.tangentAt(a,We);const v=Math.asin(Math.max(-1,Math.min(1,We.y))),m=Math.hypot(We.x,We.z)||1,g=We.x/m,A=We.z/m,y=G(26,27.3,o)*(1-G(36.6,38,o));for(let $=0;$<3;$++){const ge=nt[$],He=15+$*4.6,_e=9.5+$*2.3+7*G(36,38,o),Ne=r*1.3+$*2.2,Re=ie.x+g*He+A*_e,kt=ie.z+A*He-g*_e;ge.position.set(Re,I(Re,kt)+2.5*Math.sin(Ne)-1.1,kt),ge.rotation.set(Math.cos(Ne)*.8,Math.atan2(-g,-A),0),ge.scale.setScalar(Math.max(.001,1.35*y))}const F=dt(o);W.uBurin.value=ht(o)<25?0:F,Ke(F,he),ke.position.set(he.x,I(he.x,he.z)+.2,he.z);const P=G(24.2,24.7,o)*(1-G(32.5,33.3,o));ke.rotation.x=.05*Math.sin(r*23),ke.scale.setScalar(Math.max(.001,2.6*P)),Te.setXYZW(_t,he.x,he.z,1.1*P,.001+10*P),W.uWhale.value=X?G(35.3,39.5,o):0;for(let $=0;$<ot.length;$++){const ge=ot[$];ge.rotation.y=ge.userData.a0+.1*Math.sin(r*.8+$*2)+.03*Math.sin(r*2.9+$)}const z=Math.atan2(-g,-A);let B=Math.atan2(-Ze.x,-Ze.z)-z;B=Math.atan2(Math.sin(B),Math.cos(B));const Z=z+B*.55,O=-Math.sin(Z),J=-Math.cos(Z),re=I(ie.x+O*11,ie.z+J*11,!0),ye=I(ie.x-O*15,ie.z-J*15,!0),Fe=I(ie.x,ie.z,!0),Xe=Math.max(-.045,Math.min(.045,(re-ye)/26*.5)),st=Math.asin(Math.max(-1,Math.min(1,Ze.y))),Et=(st>.1?.1+(st-.1)*.62:st)*.95-.07*G(.745,.84,a)-.09*G(.9,.97,a);Mt.set(Et+Xe,Z,-B*.12+.012*Math.sin(r*.6)),Ve.quaternion.setFromEuler(Mt),Ve.position.copy(ie),Ve.position.y+=Math.max(-1,Math.min(1,Fe*.3))-.15}return Pt(0,0,{matrixWorld:new t.Matrix4().makeTranslation(b.start.x,b.start.y,b.start.z)},0),{scene:K,path:b,duration:_,title:V.name,camera:{fov:62,near:.3,far:5e3,sway:.3,bank:.4},pois:[{at:()=>yt.copy(se).setY(16),from:.02,to:.16,weight:.2},{at:(e,r)=>qt.set(7,30,-9-bt(r)-At(r)*.75),from:.362,to:.468,weight:.64},{at:Oe.clone().setY(13),from:.43,to:.575,weight:.6,fade:.2793},{at:b.end.clone(),from:.66,to:1,weight:.8}],portal:{shape:"circle",radius:7,color:"#F0C24E",glow:.8,tilt:!0,revealDistance:260},post:{exposure:1,bloom:{strength:.35,radius:.55,threshold:1.1},grade:{saturation:1,contrast:1.03,tint:"#ffffff",shadowTint:"#000000",vignette:.3,grain:.018,aberration:0}},ride:"none",style:"none",update:Pt,dispose(){C.dispose()}}}};export{to as default};
