import*as h from"three";import{clamp as Ae,lerp as De,smoothstep as be}from"../kit/core.js";const Ve=["#ffe6b8","#bfe3a0","#5f9e3a","#2e5a22","#3a2a1a","#e8f4ff","#ff5a7a"],we=Math.PI*2,s=(e=0,a=0,r=0)=>new h.Vector3(e,a,r),We=`
  float fogF() {
    #ifdef USE_FOG
      #ifdef FOG_EXP2
        return 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
      #else
        return smoothstep(fogNear, fogFar, vFogDepth);
      #endif
    #else
      return 0.0;
    #endif
  }`,Te=`
  vec3 floraSway(vec3 q, float s) {
    vec3 p = q;
    p.x += s * (sin(uTime * 0.8 + q.y * 0.11) * 0.35 + sin(uTime * 2.1 + q.y * 0.4 + q.z) * 0.08);
    p.z += s * (sin(uTime * 0.63 + q.y * 0.09 + 1.7) * 0.3);
    p.y += s * sin(uTime * 1.3 + q.x * 0.3) * 0.08;
    return p;
  }`,ke=`
  uniform float uTime;
  uniform vec4 uTremor;   // xy origin in the web plane, z seconds since release, w strength
  uniform vec3 uHub;      // xy hub centre, z pluck amount (progress driven)
  uniform float uWind;
  float gWave = 0.0;      // 0..1 where the tremor front is passing (drives a flash of sparkle)
  vec3 webDisp(vec3 p, float pin) {
    float d = distance(p.xy, uTremor.xy), t = uTremor.z;
    float front = d - t * 15.0;
    float w = sin(front * 1.5) * exp(-front * front * 0.035) * exp(-t * 0.45);
    w += sin(t * 10.0 - d * 0.3) * exp(-t * 1.3) * exp(-d * 0.07) * 0.6;
    w *= uTremor.w;
    gWave = exp(-front * front * 0.03) * exp(-t * 0.4) * uTremor.w * pin * step(0.02, t);
    float dh = distance(p.xy, uHub.xy);
    float hubW = sin(dh * 0.9 - uTime * 5.0) * uHub.z * exp(-dh * 0.04);
    w += hubW * 0.35; gWave += max(hubW, 0.0) * pin * 0.6;
    float breeze = sin(uTime * 0.55 + p.x * 0.06) * 0.32 + sin(uTime * 0.91 + p.y * 0.08 + 1.3) * 0.2
                 + sin(uTime * 2.3 + p.x * 0.21 + p.y * 0.17) * 0.05;
    return p + vec3(0.0, w * 0.3, w * 0.5 + breeze * uWind) * pin;
  }`,Fe=`
  vec3 hue(float h) { return clamp(abs(fract(h + vec3(0.0, 0.6667, 0.3333)) * 6.0 - 3.0) - 1.0, 0.0, 1.0); }
  float hash11(float n) { return fract(sin(n * 127.1) * 43758.5453); }
  float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`;function qe(e){return new h.ShaderMaterial({fog:!0,side:h.DoubleSide,vertexColors:!0,uniforms:{...h.UniformsUtils.merge([h.UniformsLib.fog]),uTime:e.uTime,uWind:e.uWind,uSunDirW:e.uSunDirW,uSunCol:e.uSunCol,uSkyCol:e.uSkyCol,uGroundCol:e.uGroundCol,uSpotCol:e.uSpotCol},vertexShader:`
      attribute vec3 aLoc; attribute vec2 aData;
      uniform float uTime; uniform float uWind;
      varying vec3 vCol; varying vec3 vN; varying vec3 vW; varying vec3 vLoc; varying vec2 vData;
      #include <fog_pars_vertex>
      ${Te}
      void main() {
        vCol = color; vLoc = aLoc; vData = aData;
        vec3 p = floraSway(position, aData.y * uWind);
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDirW, uSunCol, uSkyCol, uGroundCol, uSpotCol;
      varying vec3 vCol; varying vec3 vN; varying vec3 vW; varying vec3 vLoc; varying vec2 vData;
      #include <fog_pars_fragment>
      ${Fe}
      void main() {
        vec3 N = normalize(vN); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(cameraPosition - vW), L = normalize(uSunDirW);
        vec3 alb = vCol; float thin = vData.x;
        if (vLoc.z >= 0.0) {                       // foxglove bell
          float t = vLoc.z, inside = gl_FrontFacing ? 0.0 : 1.0;
          float lower = smoothstep(0.05, 0.7, vLoc.y);
          vec2 g = vec2(atan(vLoc.x, abs(vLoc.y) < 1e-5 ? 1e-5 : vLoc.y) * 2.6, t * 7.0);
          vec2 c = floor(g), f = fract(g) - 0.5;
          vec2 o = (vec2(hash21(c), hash21(c + 7.3)) - 0.5) * 0.45;
          float dsp = length(f - o), sz = 0.12 + 0.14 * hash21(c + 3.1);
          float zone = lower * smoothstep(0.3, 0.55, t) * step(0.25, hash21(c + 1.7));
          float spot = (1.0 - smoothstep(sz, sz + 0.05, dsp)) * zone;
          float halo = (1.0 - smoothstep(sz + 0.08, sz + 0.2, dsp)) * zone;
          alb = mix(alb, mix(alb, vec3(0.78, 0.72, 0.7), 0.55), inside * (0.35 + 0.65 * lower));
          alb = mix(alb, vec3(0.8, 0.76, 0.74), halo * mix(0.25, 0.9, inside));
          alb = mix(alb, uSpotCol, spot * mix(0.62, 1.0, inside));
          alb *= 0.9 + 0.1 * sin(atan(vLoc.x, abs(vLoc.y) < 1e-5 ? 1e-5 : vLoc.y) * 10.0);
          alb *= mix(1.0, 0.35 + 0.65 * smoothstep(0.25, 0.95, t), inside);
          thin *= mix(1.0, 0.55 + 0.45 * t, inside);       // faint ribs
        } else if (vLoc.z < -1.5 && vLoc.z > -2.5) { // leaf veins
          float u = vLoc.x, v = vLoc.y;
          float side = abs(fract(v * 8.0 - abs(u) * 1.6) - 0.5) * 2.0;
          float vein = smoothstep(0.82, 1.0, side) * 0.6 + (1.0 - smoothstep(0.0, 0.07, abs(u)));
          float cell = abs(fract(v * 40.0 + u * 13.0) - 0.5) * abs(fract(u * 9.0 - v * 7.0) - 0.5);
          alb *= 0.86 + 0.5 * cell;
          alb = mix(alb, alb * 1.5 + vec3(0.03, 0.05, 0.0), clamp(vein, 0.0, 1.0) * 0.5);
        } else if (vLoc.z < -2.5) {                // moss
          vec2 q = vW.xz * 2.2; float m = hash21(floor(q)) * 0.5 + hash21(floor(q * 3.1)) * 0.5;
          alb *= 0.65 + 0.7 * m; thin *= m;
        }
        float ndl = dot(N, L);
        vec3 amb = mix(uGroundCol, uSkyCol, N.y * 0.5 + 0.5);
        vec3 col = alb * (amb + uSunCol * max(ndl * 0.8 + 0.2, 0.0) * 1.3);
        float toSun = max(dot(-V, L), 0.0);
        vec3 through = alb * (0.35 + 0.65 * alb) * uSunCol * max(-ndl, 0.0) * thin * (0.9 + 1.3 * toSun * toSun);
        col += through;
        float rim = pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 3.0);
        col += mix(uSunCol, alb * 2.2, 0.6) * rim * (0.1 + 1.2 * toSun * toSun * toSun) * (0.35 + 0.65 * thin);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`})}function Pe(){return{p:[],c:[],l:[],d:[],i:[],n:0}}function Ce(e,a,r,V,i,b,W,u,n,U){return e.p.push(a,r,V),e.c.push(i.r,i.g,i.b),e.l.push(b,W,u),e.d.push(n,U),e.n++}function $e(e){const a=new h.BufferGeometry;return a.setAttribute("position",new h.Float32BufferAttribute(e.p,3)),a.setAttribute("color",new h.Float32BufferAttribute(e.c,3)),a.setAttribute("aLoc",new h.Float32BufferAttribute(e.l,3)),a.setAttribute("aData",new h.Float32BufferAttribute(e.d,2)),a.setIndex(e.i),a.computeVertexNormals(),a}async function Be(e,a){const r=e.attributes.position.array,V=e.index.array,i=new Float32Array(r.length);for(let b=0;b<V.length;b+=3){const W=V[b]*3,u=V[b+1]*3,n=V[b+2]*3,U=r[n]-r[u],ie=r[n+1]-r[u+1],m=r[n+2]-r[u+2],G=r[W]-r[u],I=r[W+1]-r[u+1],S=r[W+2]-r[u+2],A=ie*S-m*I,M=m*G-U*S,g=U*I-ie*G;i[W]+=A,i[W+1]+=M,i[W+2]+=g,i[u]+=A,i[u+1]+=M,i[u+2]+=g,i[n]+=A,i[n+1]+=M,i[n+2]+=g,b%3e3===2997&&await a?.()}for(let b=0;b<i.length;b+=3){const W=Math.hypot(i[b],i[b+1],i[b+2])||1;i[b]/=W,i[b+1]/=W,i[b+2]/=W,b%9e3===8997&&await a?.()}e.setAttribute("normal",new h.BufferAttribute(i,3))}const _e=new h.Color;function ge(e,a,r,V=1){return _e.copy(e).lerp(a,r).multiplyScalar(V).clone()}function Re(e,a,r,V,i={}){const b=a.length,W=s(),u=s(),n=s(),U=s(.13,.2,.97).normalize(),ie=e.n;for(let m=0;m<b;m++){const G=a[Math.max(0,m-1)].p,I=a[Math.min(b-1,m+1)].p;W.subVectors(I,G).normalize(),u.crossVectors(W,U).normalize(),n.crossVectors(W,u).normalize();const S=m/(b-1),A=a[m].r;for(let M=0;M<r;M++){const g=M/r*we,ee=A*(1+(i.ridges||0)*Math.cos(g*(i.ridgeN||5))),q=Math.cos(g)*ee,T=Math.sin(g)*ee;Ce(e,a[m].p.x+u.x*q+n.x*T,a[m].p.y+u.y*q+n.y*T,a[m].p.z+u.z*q+n.z*T,V(S,M),0,0,-1,i.thin??.15,i.swayFn?i.swayFn(S):0)}}for(let m=0;m<b-1;m++)for(let G=0;G<r;G++){const I=(G+1)%r,S=ie+m*r+G,A=ie+m*r+I,M=S+r,g=A+r;e.i.push(S,A,M,A,g,M)}}function Le(e,a,r,V,i,b,W,u,n,U,ie=1,m=14,G=11){const I=e.n,S=s(),A=s();for(let M=0;M<G;M++){const g=M/(G-1),ee=.07+.165*be(0,.42,g)+.085*Math.pow(be(.68,1,g),1.6),q=.06+.15*Math.sin(Math.PI*Math.pow(g,.7))-.03*g,T=be(.66,1,g)*u;S.copy(r).addScaledVector(V,g*W).addScaledVector(i,.12*W*g*g);for(let N=0;N<m;N++){const te=N/m*we,$=Math.cos(te),ye=Math.sin(te);let t=W*De(q,ee,u)*(1+.1*Math.cos(te*4+.6)*T);const y=1+.16*Math.max($,0)*Math.sin(Math.PI*Math.min(1,g*1.1)),v=W*.2*Math.pow(Math.max($,0),1.5)*T-W*.05*Math.max(-$,0)*T;A.copy(S).addScaledVector(i,$*t*y).addScaledVector(b,ye*t).addScaledVector(V,v).addScaledVector(i,.06*W*T*T*Math.max($,0));let x=ge(a.cream,a.accent,be(.08,.42,g)*(1-U)*(.86+.14*Math.max(-$,0)),n);x=ge(x,a.cream,.22*be(.88,1,g)*u),x=ge(x,a.bud,(1-u)*(.75-.5*g)),x=ge(x,a.calyx,1-be(.05,.2,g)),Ce(e,A.x,A.y,A.z,x,ye,$,g,.95,(.45+.55*g)*ie)}}for(let M=0;M<G-1;M++)for(let g=0;g<m;g++){const ee=(g+1)%m,q=I+M*m+g,T=I+M*m+ee;e.i.push(q,q+m,T,T,q+m,T+m)}return S}async function Ge(e,a,r,V,i){const{bx:b,H:W,sideSign:u,col:n}=V,U=a.range(-1.6,1.6)+u*.8,ie=a.range(-.6,.6),m=a.range(3.5,6.5),G=a.range(0,we),I=(l,c=s())=>{const w=Math.max(0,l-.86)/.14;return c.set(b+U*l*l+Math.sin(l*5+G)*.35*l,W*(l-.035*w*w),ie*l*l+m*w*w)},S=l=>De(1,.17,Math.pow(l,.75))*(1+.5*Math.exp(-l*30)),A=new h.Color("#4a2a3a"),M=[];for(let l=0;l<=44;l++){const c=l/44;M.push({p:I(c),r:S(c)})}Re(e,M,10,(l,c)=>{const w=r.n2(l*23+b,c*.9)*.5+.5;return ge(ge(n.deep,n.grass,.25+.5*l+.25*w),A,.35*be(.3,.9,l)*w,.75+.3*w)},{ridges:.07,ridgeN:5,thin:.25});{const l=a.range(5.5,7.5),c=a.range(1.3,2.1),w=8,D=22,E=a.range(-1,1),B=a.range(-1,1),pe=Ce(e,b+E,c,B,ge(n.grass,n.lime,.3,.7),0,0,-3,.5,0),ve=e.n;for(let X=1;X<=w;X++)for(let oe=0;oe<D;oe++){const ne=X/w,de=oe/D*we,Se=l*ne*(1+.22*r.n2(Math.cos(de)*1.3+b,Math.sin(de)*1.3+ne)),re=b+E+Math.cos(de)*Se,Y=B+Math.sin(de)*Se,_=r.fbm2(re*.45,Y*.45,3),se=Math.max(-.3,c*Math.pow(Math.cos(ne*Math.PI*.5),.7)*(1+.35*_)+.35*_*(1-ne)-.3*ne*ne);Ce(e,re,se,Y,ge(ge(n.deep,n.grass,.5+.5*_),n.soil,be(.75,1,ne)*.7,.6+.25*_),0,0,-3,.5,0)}for(let X=0;X<D;X++)e.i.push(pe,ve+(X+1)%D,ve+X);for(let X=0;X<w-1;X++)for(let oe=0;oe<D;oe++){const ne=(oe+1)%D,de=ve+X*D+oe,Se=ve+X*D+ne;e.i.push(de,Se,de+D,Se,Se+D,de+D)}}const g=[],ee=s(0,1,0),q=s(),T=s(),N=s(),te=s(),$=s(),ye=s(),t=s(),y=(l,c,w,D,E,B,pe,ve)=>{q.set(Math.sin(c),0,Math.cos(c));const X=6,oe=12,ne=a.range(0,we),de=a.range(.22,.4),Se=e.n,re=(Y,_)=>_.copy(l).addScaledVector(q,w*Y*Math.cos(E)).addScaledVector(ee,w*(Math.sin(E)*Y-(Math.sin(E)*.9+B)*Y*Y));for(let Y=0;Y<=oe;Y++){const _=Y/oe;re(_,$),re(_+.02,ye),N.subVectors(ye,$).normalize(),T.crossVectors(ee,q).normalize(),T.applyAxisAngle(N,pe*_),te.crossVectors(T,N).normalize();const se=D*.5*Math.pow(Math.sin(Math.PI*Math.pow(_,.72)),.85)+.12*(1-_);for(let me=0;me<=X;me++){const xe=me/X*2-1,Me=Math.abs(xe),o=Me*se*de+Math.sin(_*17+ne+xe*2)*.09*se*xe*xe-.25*se*Me*Me*_;t.copy($).addScaledVector(T,xe*se).addScaledVector(te,o),t.y<.3&&(t.y=.3+(t.y-.3)*.1);const p=r.n2(t.x*.5,t.z*.5+t.y*.3)*.5+.5,f=ge(ge(n.deep,n.grass,.35+.45*_+.2*p),n.lime,.25*(1-Me)*p,ve*(.8+.25*p-.12*Me));Ce(e,t.x,t.y,t.z,f,xe,_,-2,.9,.5*_*_),me===X/2&&Y===oe&&g.push({p:t.clone(),r:a.range(.22,.42),kind:"leaf"})}}for(let Y=0;Y<oe;Y++)for(let _=0;_<X;_++){const se=Se+Y*(X+1)+_,me=se+1,xe=se+X+1,Me=xe+1;e.i.push(se,me,xe,me,Me,xe)}},v=u>0?-Math.PI/2:Math.PI/2,x=l=>{if(V.free)return!0;let c=Math.atan2(Math.sin(l-v),Math.cos(l-v));return Math.abs(c)>.62},L=V.leafK??1,j=a.int(8,10),C=a.range(0,we);for(let l=0;l<j;l++){await i?.();let c=C+l/j*we+a.range(-.2,.2);x(c)||(c+=(a.chance(.5)?1:-1)*.75);const w=I(.012+.012*(l%3));w.x+=Math.sin(c)*.8,w.z+=Math.cos(c)*.8,y(w,c,a.range(13,19)*L,a.range(4.6,6.6)*L,a.range(.55,.95),a.range(0,.05),a.range(-.5,.5),a.range(.85,1.05))}const R=a.int(5,7);for(let l=0;l<R;l++){await i?.();const c=.07+l/R*.25+a.range(-.01,.01);let w=C+l*2.4+a.range(-.3,.3);x(w)||(w+=Math.PI*.6),x(w)||(w+=Math.PI*.6);const D=I(c),E=S(c)*.8;D.x+=Math.sin(w)*E,D.z+=Math.cos(w)*E;const B=1-l/R*.45;y(D,w,a.range(8,11)*B,a.range(2.6,3.6)*B,a.range(.5,.85),a.range(.1,.3),a.range(-.6,.6),a.range(.9,1.1))}const F=s(),P=s(),ae=s(),ue=s(),fe=s(),d=s(),z=a.int(40,46),Z=.37,O=.965,he=V.bias??u*.4;await i?.();for(let l=0;l<z;l++){await i?.();const c=l/(z-1),w=De(Z,O,Math.pow(c,.92)),D=1-be(.72,.9,c),E=he+((l*.618034+V.phase)%1-.5)*2*De(1.15,.7,c)+a.range(-.12,.12),B=De(5.4,1.5,Math.pow(c,1.15))*a.range(.9,1.1),pe=De(a.range(.55,.85),a.range(-.25,.25),1-D);q.set(Math.sin(E),0,Math.cos(E)),I(w,d);const ve=S(w);F.copy(q).multiplyScalar(Math.cos(pe)).addScaledVector(ee,-Math.sin(pe)).normalize(),P.copy(ee).multiplyScalar(-1).addScaledVector(F,F.y).normalize(),ae.crossVectors(F,P).normalize(),fe.copy(d).addScaledVector(q,ve+.22*B).addScaledVector(ee,.1*B);const X=ge(n.deep,n.grass,.6,.8);Re(e,[{p:d.clone().addScaledVector(q,ve*.7),r:.07*B*.5+.05},{p:d.clone().addScaledVector(q,ve+.1*B).addScaledVector(ee,.09*B),r:.045*B*.5+.04},{p:fe.clone().addScaledVector(F,.02*B),r:.07*B}],5,()=>X,{thin:.2,swayFn:de=>.4*de});const oe=a.range(.8,1.1),ne=a.range(0,.18)+(V.blush||0);V.lite?ue.copy(Le(e,n,fe,F,P,ae,B,D,oe,ne,1,c>.7?8:c>.4?10:12,c>.7?6:c>.4?8:10)):ue.copy(Le(e,n,fe,F,P,ae,B,D,oe,ne)),D>.9&&g.push({p:ue.clone().addScaledVector(P,B*.3).addScaledVector(F,B*.2),r:a.range(.16,.34)*(.6+B/9),kind:"bell",f:c,L:B})}return{stemAt:I,radiusAt:S,height:W,tips:g}}async function He(e,a,r,V){const{hy:i,stems:b,nDrops:W}=r,u=0,n=8,U=[],ie=o=>{const p=Math.max(Math.abs(o.x-u)/25,Math.abs(o.y-i)/24.4);return(1-be(.5,1.04,p))*(1-be(0,1.5,Math.abs(o.z)))},m=(o,p,f,H=0)=>{const k=o.distanceTo(p),Q=Math.max(1,Math.round(k/f)),K=[];for(let J=0;J<=Q;J++){const le=J/Q,ce=o.clone().lerp(p,le);ce.y-=H*k*4*le*(1-le),K.push(ce)}return K},G=(o,p,f,H,k=0,Q=1,K=0)=>{U.push({pts:o,width:p,kind:f,rand:H,s0:k,w:Q,lod:K,emph:f==="radial"?1.7:f==="spiral"?K===0?1:K===1?.8:.62:1.4})},I=(o,p,f)=>{let H=Ae(p/o.height,0,1);for(let Q=0;Q<3;Q++)H=Ae(H+(p-o.stemAt(H).y)/o.height,0,1);const k=o.stemAt(H);return k.x+=f*o.radiusAt(H)*.85,k},[S,A]=b,M=i+24.3,g=Math.max(1.9,i-24),ee=(o,p)=>{const f=I(S,o,1);return f.x+=p,f.z=0,f},q=(o,p)=>{const f=I(A,o,-1);return f.x-=p,f.z=0,f},T=()=>e.range(-2.2,2.2),N=s(-16+T(),M+e.range(-.4,.5),0),te=s(16+T(),M+e.range(-.4,.5),0),$=s(u+e.range(-4,4),i+23.6,0),ye=s(u+e.range(-4,4),Math.max(2.3,i-23.6),0),t=ee(i+14+T(),2.7),y=ee(i-13+T(),2.7),v=q(i+14+T(),2.7),x=q(i-13+T(),2.7),L=s(-15+T(),g+e.range(0,.5),0),j=s(15+T(),g+e.range(0,.5),0),C=[N,$,te,v,x,j,ye,L,y,t];for(let o=0;o<C.length;o++)G(m(C[o],C[(o+1)%C.length],1.4,.004),.055,"frame",e(),0,.5);const R=(o,p)=>G(m(o,p,1.2,.012),.045,"guy",e(),0,.45),F=(o,p,f,H)=>{for(const k of H)R(o,I(p,k,f))};F(N,S,1,[i+28.2,i+24.5]),F(te,A,-1,[i+28.2,i+24.5]),F(t,S,1,[t.y+2.4,t.y-2]),F(v,A,-1,[v.y+2.4,v.y-2]),F(y,S,1,[y.y+2,y.y-2.6]),F(x,A,-1,[x.y+2,x.y-2.6]),F(L,S,1,[4.6,1.3]),F(j,A,-1,[4.6,1.3]);const P=I(S,i+30.5,1),ae=I(A,i+30.5,-1),ue=m(P,ae,1.5,.014);G(ue,.06,"guy",e(),0,.5);const fe=o=>{let p=ue[0];for(const f of ue)Math.abs(f.x-o)<Math.abs(p.x-o)&&(p=f);return p};R($,fe($.x)),R(N,fe(N.x-3)),R(te,fe(te.x+3));const d=36,z=e.range(0,we),Z=[],O=[],he=(o,p)=>{let f=60;for(let H=0;H<C.length;H++){const k=C[H],Q=C[(H+1)%C.length],K=Q.x-k.x,J=Q.y-k.y,le=o*J-p*K;if(Math.abs(le)<1e-6)continue;const ce=((k.x-u)*J-(k.y-i)*K)/le,ze=((k.x-u)*p-(k.y-i)*o)/le;ce>0&&ze>=-.001&&ze<=1.001&&ce<f&&(f=ce)}return f};let l=99;for(let o=0;o<d;o++){const p=z+(o+e.range(-.22,.22))/d*we,f={x:Math.cos(p),y:Math.sin(p)};Z.push(f);const H=he(f.x,f.y);O.push(H),l=Math.min(l,H)}const c=Math.min(23,l-.5),w=n+1,D=28,E=(c-w)/D,B=(o,p)=>s(u+Z[o].x*p,i+Z[o].y*p,0);for(let o=0;o<d;o++)G(m(B(o,n),B(o,O[o]),1.3),.06,"radial",e(),0,.8);for(const[o,p]of[[n,.08],[n+.5,.04]]){const f=[];for(let H=0;H<=d;H++){const k=m(B(H%d,o),B((H+1)%d,o),.8,.01);H<d?f.push(...k.slice(0,-1)):f.push(k[0])}G(f,p,"hub",e(),0,o===n?1.6:1)}await V?.();const pe=[],ve=e.int(0,2);for(let o=0;o<ve;o++)pe.push({i0:e.int(0,d-1),span:e.int(2,3),t0:e.int(8,22),n:e.int(3,6)});const X=e();let oe=0,ne=null;for(let o=0;o<=D*d;o++){o%36===35&&await V?.();const p=o%d,f=o/d,H=Math.min(c,w+E*f+a.n2(o*.37,3.1)*.08+a.n2(p*.9,f*.25)*.1),k=B(p,H);if(ne){let Q=!1;for(const le of pe)(p-le.i0+d)%d<le.span&&f>=le.t0&&f<le.t0+le.n&&(Q=!0);const K=ne.distanceTo(k),J=Math.floor((o-1)/d);Q||G(m(ne,k,K/3+.01,.03+.02*e()),.03,"spiral",X,oe,1,J%4===0?0:J%2===0?1:2),oe+=K}ne=k}await V?.();let de=0;for(const o of U){o.len=0;for(let p=1;p<o.pts.length;p++)o.len+=o.pts[p].distanceTo(o.pts[p-1]);de+=o.len*o.w}const Se=de/W,re={pos:[],dir:[],a:[],lod:[],idx:[],n:0},Y={pos:[],dat:[],lod:[],n:0,cands:[]},_=s(),se=s(),me=s(),xe=(o,p,f)=>f.subVectors(o[Math.min(o.length-1,p+1)],o[Math.max(0,p-1)]).normalize();let Me=0;for(const o of U){++Me%12===0&&await V?.();let p=o.s0;const f=o.pts;for(let k=0;k<f.length-1;k++){const Q=f[k],K=f[k+1],J=Q.distanceTo(K);xe(f,k,_),xe(f,k+1,se);const le=ie(Q),ce=ie(K);re.pos.push(Q.x,Q.y,Q.z,Q.x,Q.y,Q.z,K.x,K.y,K.z,K.x,K.y,K.z),re.dir.push(_.x,_.y,_.z,o.width,_.x,_.y,_.z,o.width,se.x,se.y,se.z,o.width,se.x,se.y,se.z,o.width),re.a.push(-1,p,o.rand,le,1,p,o.rand,le,-1,p+J,o.rand,ce,1,p+J,o.rand,ce);for(let ze=0;ze<4;ze++)re.lod.push(o.lod,o.emph);re.idx.push(re.n,re.n+1,re.n+2,re.n+2,re.n+1,re.n+3),re.n+=4,p+=J}const H=Math.max(o.kind==="spiral"?1:0,Math.round(o.len*o.w/Se+e.range(-.3,.3)));for(let k=0;k<H;k++){const Q=(k+.5+e.range(-.18,.18))/H*o.len;let K=0,J=0;for(;J<f.length-2&&K+f[J].distanceTo(f[J+1])<Q;)K+=f[J].distanceTo(f[J+1]),J++;const le=f[J].distanceTo(f[J+1])||1;me.copy(f[J]).lerp(f[J+1],Ae((Q-K)/le,0,1));let ce;o.kind==="spiral"?ce=e.chance(.11)?e.range(.14,.3):.032+.075*Math.pow(e(),2):o.kind==="hub"?ce=.06+.1*Math.pow(e(),1.5):o.kind==="radial"?ce=e.chance(.1)?e.range(.12,.26):.035+.06*Math.pow(e(),2):ce=.04+.09*Math.pow(e(),2);const ze=ie(me);Y.pos.push(me.x,me.y-ce*.6,me.z,ce),Y.dat.push(e(),ze,e(),0),Y.lod.push(o.lod),ce>.1&&ze>.45&&o.kind!=="hub"&&me.y>6&&Y.cands.push(Y.n),Y.n++}}return{TH:re,DR:Y,R0:n,R1:c,pitch:E,poly:C,hub:s(u,i,0)}}function Ie(e,a,r,V){const i=s().fromArray(V.c),b=s().fromArray(V.ex).normalize(),W=s(0,1,0),u=V.R,n=17,U=.42,ie=13,m=(t,y,v=s())=>v.copy(i).addScaledVector(b,t).addScaledVector(W,y),G=[],I=(t,y,v,x,L,j,C,R,F)=>{const P=[];for(let ae=0;ae<=v;ae++){const ue=ae/v,fe=t.clone().lerp(y,ue);fe.y-=x*t.distanceTo(y)*4*ue*(1-ue),P.push(fe)}G.push({pts:P,width:L,kind:j,lod:C,emph:R*2.3,pin:F,rand:r()})},S=[];for(let t=0;t<6;t++){const y=t/6*we+.5+r.range(-.16,.16),v=u*r.range(1.06,1.22);S.push(s(Math.cos(y)*v,Math.sin(y)*v,0))}for(let t=0;t<6;t++)I(m(S[t].x,S[t].y),m(S[(t+1)%6].x,S[(t+1)%6].y),5,.006,.05,"frame",0,1.3,.2);for(const t of V.moor){const y=s().fromArray(t);let v=0,x=1e9;for(let C=0;C<6;C++){const R=m(S[C].x,S[C].y).distanceTo(y);R<x&&(x=R,v=C)}I(m(S[v].x,S[v].y),y,5,.012,.045,"guy",0,1.3,0);const L=(v+(r()<.5?1:5))%6,j=S[v].clone().lerp(S[L],.42);I(m(j.x,j.y),y.clone().add(s(0,r.range(-1.1,1.1),0)),5,.014,.04,"guy",0,1.2,0)}const A=(t,y)=>{let v=u*1.3;for(let x=0;x<6;x++){const L=S[x],j=S[(x+1)%6],C=j.x-L.x,R=j.y-L.y,F=t*R-y*C;if(Math.abs(F)<1e-6)continue;const P=(L.x*R-L.y*C)/F,ae=(L.x*y-L.y*t)/F;P>0&&ae>=-.001&&ae<=1.001&&P<v&&(v=P)}return v},M=[],g=r.range(0,we);for(let t=0;t<n;t++){const y=g+(t+r.range(-.2,.2))/n*we,v={x:Math.cos(y),y:Math.sin(y)};M.push(v),I(m(v.x*U,v.y*U),m(v.x*A(v.x,v.y),v.y*A(v.x,v.y)),5,0,.05,"radial",0,1.6,.3)}{const t=[];for(let y=0;y<=n;y++)t.push(m(M[y%n].x*U,M[y%n].y*U));G.push({pts:t,width:.06,kind:"hub",lod:0,emph:3,pin:.3,rand:r()})}const ee=(u-.9)/ie;let q=null,T=0;for(let t=0;t<=ie*n;t++){const y=t%n,v=t/n,x=Math.min(u,.9+ee*v+.05*Math.sin(t*1.7)),L=m(M[y].x*x,M[y].y*x);if(q){const j=Math.floor((t-1)/n);G.push({pts:[q,q.clone().lerp(L,.5).add(s(0,-.035*q.distanceTo(L),0)),L],width:.03,kind:"spiral",lod:j%3===0?0:j%3===1?1:2,emph:2.6,pin:.3,rand:.37,s0:T}),T+=q.distanceTo(L)}q=L}const N=s(),te=s(),$=s(),ye=(t,y,v)=>v.subVectors(t[Math.min(t.length-1,y+1)],t[Math.max(0,y-1)]).normalize();for(const t of G){let y=t.s0||0,v=0;const x=t.pts;for(let C=0;C<x.length-1;C++){const R=x[C],F=x[C+1],P=R.distanceTo(F);ye(x,C,N),ye(x,C+1,te),e.pos.push(R.x,R.y,R.z,R.x,R.y,R.z,F.x,F.y,F.z,F.x,F.y,F.z),e.dir.push(N.x,N.y,N.z,t.width,N.x,N.y,N.z,t.width,te.x,te.y,te.z,t.width,te.x,te.y,te.z,t.width),e.a.push(-1,y,t.rand,t.pin,1,y,t.rand,t.pin,-1,y+P,t.rand,t.pin,1,y+P,t.rand,t.pin);for(let ae=0;ae<4;ae++)e.lod.push(t.lod,t.emph);e.idx.push(e.n,e.n+1,e.n+2,e.n+2,e.n+1,e.n+3),e.n+=4,y+=P,v+=P}const L=(t.kind==="spiral"?.24:t.kind==="guy"?.8:.42)/(V.detail??1),j=Math.max(t.kind==="spiral"?1:0,Math.round(v/L+r.range(-.3,.3)));for(let C=0;C<j;C++){const R=(C+.5+r.range(-.2,.2))/j*v;let F=0,P=0;for(;P<x.length-2&&F+x[P].distanceTo(x[P+1])<R;)F+=x[P].distanceTo(x[P+1]),P++;$.copy(x[P]).lerp(x[P+1],Ae((R-F)/(x[P].distanceTo(x[P+1])||1),0,1));const ae=t.kind==="spiral"?r.chance(.07)?r.range(.13,.22):.035+.06*Math.pow(r(),2):r.chance(.1)?r.range(.13,.24):.04+.06*Math.pow(r(),2);a.pos.push($.x,$.y-ae*.6,$.z,ae),a.dat.push(r(),t.pin,r(),0),a.lod.push(t.lod),a.n++}}}function Ne(e){return new h.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,blending:h.AdditiveBlending,side:h.DoubleSide,uniforms:{...h.UniformsUtils.merge([h.UniformsLib.fog]),uTime:e.uTime,uTremor:e.uTremor,uHub:e.uHub,uWind:e.uWind,uViewH:e.uViewH,uScl:e.uScl,uPitch:e.uPitch,uSunDirW:e.uSunDirW,uSunCol:e.uSunCol,uDewCol:e.uDewCol,uGain:e.uGain},vertexShader:`
      attribute vec4 aDir; attribute vec4 aA; attribute vec2 aLod;
      uniform float uViewH, uScl, uPitch;
      varying float vVis;
      varying float vS; varying float vRand; varying float vSide; varying float vFade; varying vec3 vW; varying float vWave;
      #include <fog_pars_vertex>
      ${ke}
      void main() {
        vec3 p = webDisp(position, aA.w);
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vec4 mvPosition = viewMatrix * wp;
        vec3 tv = normalize(mat3(modelViewMatrix) * aDir.xyz);
        vec3 side = cross(tv, normalize(mvPosition.xyz));
        side = side / max(length(side), 1e-4);
        float pxPerM = projectionMatrix[1][1] * uViewH * 0.5 / max(-mvPosition.z, 0.1);
        float minW = 1.25 / pxPerM;
        float w = max(aDir.w * uScl, minW);
        vFade = clamp(aDir.w * uScl / minW, 0.0, 1.0);
        // from far off only every fourth turn of the spiral is drawn, so that it reads as separate rings and not as a haze;
        // the turns between fade in as they come to stand a few pixels apart
        float pitchPx = uPitch * uScl * pxPerM;
        float vis = aLod.x < 0.5 ? 1.0 : (aLod.x < 1.5 ? smoothstep(2.2, 4.0, 2.0 * pitchPx) : smoothstep(2.2, 4.0, pitchPx));
        vVis = vis * aLod.y;
        mvPosition.xyz += side * aA.x * w * 0.5;
        vS = aA.y; vRand = aA.z; vSide = aA.x; vW = wp.xyz; vWave = gWave;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDirW, uSunCol, uDewCol; uniform float uGain;
      varying float vVis;
      varying float vS; varying float vRand; varying float vSide; varying float vFade; varying vec3 vW; varying float vWave;
      #include <fog_pars_fragment>
      ${We}
      ${Fe}
      void main() {
        float prof = smoothstep(0.0, 0.6, 1.0 - min(abs(vSide), 1.0));      // the across coordinate held to its own range
        vec3 V = normalize(vW - cameraPosition);
        float toSun = max(dot(V, normalize(uSunDirW)), 0.0); toSun *= toSun;
        vec3 col = uDewCol * 0.05 + uSunCol * (0.04 + 0.24 * toSun);       // the silk itself: fine silver lines
        float cam = dot(cameraPosition, vec3(0.31, 0.23, 0.17));
        float ph = vS * 0.55 + cam * 0.9 + vRand * 40.0;
        float g = pow(max(0.5 + 0.5 * sin(ph), 0.0), 18.0);
        float g2 = pow(max(0.5 + 0.5 * sin(ph * 0.37 + vRand * 17.0 + 1.3), 0.0), 56.0);
        vec3 rb = hue(vS * 0.045 + cam * 0.11 + vRand);
        col += mix(uSunCol, rb * 1.4, 0.85) * (g * 0.3 + g2 * 6.0) * uGain * (0.35 + 0.65 * toSun);
        col *= 1.0 + 1.8 * vWave;
        float fd = clamp(vFade, 0.0, 1.0);
        col *= prof * mix(0.3, 1.0, fd * fd) * vVis * (1.0 - fogF());      // a thread thinner than a pixel is drawn a pixel wide and that much dimmer: seen from inside, the Web is a lace over the garden, not a veil
        gl_FragColor = vec4(col, 1.0);
      }`})}function je(e){return new h.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,premultipliedAlpha:!0,uniforms:{...h.UniformsUtils.merge([h.UniformsLib.fog]),uTime:e.uTime,uTremor:e.uTremor,uHub:e.uHub,uWind:e.uWind,uViewH:e.uViewH,uScl:e.uScl,uPitch:e.uPitch,uSunDirW:e.uSunDirW,uSunCol:e.uSunCol,uDewCol:e.uDewCol,uGain:e.uGain,uFall:e.uFall,uSkyZen:e.uSkyZen,uSkyHor:e.uSkyHor,uGrassA:e.uGrassA,uGrassB:e.uGrassB,uSoil:e.uSoil},vertexShader:`
      attribute vec4 iPos; attribute vec4 iData;
      uniform vec4 uFall;   // x falling instance, y seconds since release, z regrowing instance, w gravity
      uniform float uViewH, uScl, uPitch;
      attribute float iLod; varying float vVis;
      varying vec2 vUv; varying vec4 vData; varying float vLod; varying float vDim; varying float vFallF; varying vec3 vW; varying float vWave; varying vec3 vCls;
      #include <fog_pars_vertex>
      ${ke}
      ${Te}
      const float Q = 3.0;
      void main() {
        float id = float(gl_InstanceID);
        float isFall = 1.0 - step(0.5, abs(id - uFall.x));
        float isPrev = 1.0 - step(0.5, abs(id - uFall.z));
        float t = uFall.y;
        vec3 p = webDisp(iPos.xyz, iData.y);
        p = floraSway(p, iData.w * uWind);
        float r = iPos.w * uScl * (1.0 + 0.05 * sin(uTime * 3.1 + iData.x * 40.0));
        r *= mix(1.0, smoothstep(0.2, 5.0, t), isPrev);
        r *= mix(1.0, 1.8, isFall);
        p.y -= isFall * 0.5 * uFall.w * t * t;
        float gone = isFall * (1.0 - step(0.3, p.y));
        vec4 wp = modelMatrix * vec4(p, 1.0);
        vec4 mvPosition = viewMatrix * wp;
        float pxPerM = projectionMatrix[1][1] * uViewH * 0.5 / max(-mvPosition.z, 0.1);
        float rpx = r * pxPerM;
        float rr = max(r, 1.5 / pxPerM);
        vLod = smoothstep(1.8, 5.0, rpx);
        vDim = clamp(rpx / 1.5, 0.0, 1.0);
        float pitchPx = uPitch * uScl * pxPerM;
        vVis = iLod < 0.5 ? 1.0 : (iLod < 1.5 ? smoothstep(2.2, 4.0, 2.0 * pitchPx) : smoothstep(2.2, 4.0, pitchPx));
        // the fat beads (about one in nine) carry the sparks; a quarter of those throw a long star flare (a bigger quad)
        float fat = smoothstep(0.1, 0.16, iPos.w), starI = step(0.72, iData.z) * step(0.5, fat) * (1.0 - smoothstep(3.0, 9.0, rpx)), qs = 1.0 + 2.6 * starI;
        vCls = vec3(fat, starI, qs);
        vec2 ext = position.xy * Q * rr * qs * (1.0 - gone);
        ext.y *= 1.0 + isFall * min(t, 1.2) * 0.6;
        mvPosition.xy += ext;
        vUv = position.xy * Q * qs; vData = iData; vFallF = isFall; vWave = gWave;
        vW = wp.xyz + vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]) * ext.x + vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]) * ext.y;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDirW, uSunCol, uDewCol, uSkyZen, uSkyHor, uGrassA, uGrassB, uSoil;
      uniform float uGain, uTime;
      varying float vVis;
      varying vec2 vUv; varying vec4 vData; varying float vLod; varying float vDim; varying float vFallF; varying vec3 vW; varying float vWave; varying vec3 vCls;
      #include <fog_pars_fragment>
      ${We}
      ${Fe}
      const float Q = 3.0;
      vec3 env(vec3 d, vec3 L) {
        float h = d.y, az = atan(d.x, abs(d.z) < 1e-5 ? 1e-5 : d.z);
        vec3 sky = mix(uSkyHor, uSkyZen, smoothstep(0.0, 0.55, h));
        float blades = 0.7 + 0.3 * sin(az * 37.0 + h * 9.0) * sin(az * 11.0 + 2.0);
        vec3 grd = mix(uGrassA * blades, uGrassB, smoothstep(0.0, 0.4, -h));
        grd = mix(grd, uSoil, smoothstep(0.4, 0.85, -h));
        vec3 c = mix(grd, sky, smoothstep(-0.03, 0.03, h - 0.05 - 0.05 * sin(az * 23.0) * sin(az * 7.0 + 1.0)));
        float sd = max(dot(d, L), 0.0);
        c += uSunCol * (9.0 * smoothstep(0.972, 0.994, sd) + 1.5 * pow(sd, 30.0) + 0.3 * pow(sd, 6.0));
        return c;
      }
      void main() {
        float r = length(vUv);
        vec3 L = normalize(uSunDirW);
        vec3 V = normalize(vW - cameraPosition);
        float toSun = max(dot(V, L), 0.0); toSun = toSun * toSun * toSun;
        vec3 rdir = normalize(vec3(hash11(vData.x * 91.0), hash11(vData.x * 57.0 + 3.0), hash11(vData.z * 33.0 + 7.0)) - 0.5 + vec3(0.0, 0.0, 1e-4));
        float sp = max(0.5 + 0.5 * sin(vData.x * 6.283 + dot(cameraPosition, rdir) * 1.1 + uTime * 0.7), 0.0);
        float spark = max(pow(sp, mix(46.0, 20.0, vCls.x)) + vWave * (0.15 + 0.6 * sp * sp), vFallF);
        vec3 rb = mix(vec3(1.0), hue(vData.z + dot(cameraPosition, vec3(0.043, 0.031, 0.027))) * 1.35, 0.62);
        vec4 near = vec4(0.0);
        if (r < 1.0) {
          vec3 n = vec3(vUv, sqrt(max(1.0 - r * r, 0.0)));
          vec3 right = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
          vec3 upv = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
          vec3 fwd = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
          vec3 tang = right * n.x + upv * n.y;
          vec3 Nw = tang + fwd * n.z;
          vec3 c = env(normalize(V - tang * 1.75), L) * vec3(0.95, 1.0, 1.05) * 1.25;
          vec3 rf = reflect(V, Nw);
          float fres = pow(clamp(1.0 - n.z, 0.0, 1.0), 3.0);
          c = mix(c, env(rf, L), 0.06 + 0.6 * fres);
          // glass: a dark outline, the gathered light as a crescent inside the edge away from the sun, a thread of rim light
          c *= mix(1.0, 0.26, smoothstep(0.5, 0.93, r));
          vec2 sdir = vec2(dot(L, right), dot(L, upv)); float sl = length(sdir); sdir = sl > 1e-3 ? sdir / sl : vec2(0.0, 1.0);
          float away = clamp(0.5 - 0.5 * dot(vUv / max(r, 1e-3), sdir), 0.0, 1.0);
          float cres = smoothstep(0.6, 0.88, r) * (1.0 - smoothstep(0.92, 1.0, r)) * away * away;
          c += uSunCol * (cres * (0.5 + 2.2 * toSun) + smoothstep(0.93, 0.985, r) * (0.1 + 0.8 * toSun));
          c += uSunCol * 8.0 * pow(clamp(dot(rf, L), 0.0, 1.0), 160.0);
          vec2 wq = vUv - vec2(-0.4, 0.44); wq = vec2(wq.x * 0.77 + wq.y * 0.64, -wq.x * 0.64 + wq.y * 0.77) * vec2(3.6, 9.0);
          c += (uSkyZen + vec3(0.35)) * 0.55 * (1.0 - smoothstep(0.5, 1.0, length(wq)));
          float a = 1.0 - smoothstep(1.0 - max(fwidth(r), 1e-4) * 1.5, 1.0, r);
          near = vec4(c * a, a);
        }
        float aT = mix(9.0, 4.5, vCls.y), aL = mix(1.7, 0.42, vCls.y), reach = Q * vCls.z;
        float arms = exp(-abs(vUv.x) * aT - abs(vUv.y) * aL) + exp(-abs(vUv.y) * aT - abs(vUv.x) * aL);
        float star = exp(-r * r * 2.4) + 0.6 * arms;
        star *= 1.0 - smoothstep(reach * 0.55, reach, r);
        near.rgb += rb * uSunCol * spark * star * 3.0 * uGain * (0.3 + 0.7 * toSun) * (0.6 + 0.4 * vCls.x + 1.2 * vCls.y);
        float fa = exp(-r * r * 4.5);
        float fstar = fa + (0.3 + 0.5 * vCls.y) * arms;
        fstar *= 1.0 - smoothstep(reach * 0.5, reach, r);
        // sub-pixel drops are drawn at a minimum size, so their light is cut by the area they really cover:
        // from far away the web stays a lace of threads with separate glints instead of a solid bright disc
        float dim = mix(0.05, 1.0, pow(vDim, 1.5));
        vec3 fc = (uDewCol * 0.2 + uSunCol * (0.1 + 0.5 * toSun)) * fa * dim * (0.3 + 2.0 * vCls.x)
                + rb * uSunCol * spark * fstar * 9.0 * uGain * (0.35 + 0.65 * toSun) * mix(0.4, 1.0, vDim) * (0.35 + 0.75 * vCls.x + 1.3 * vCls.y);
        vec4 far = vec4(fc, fa * 0.5 * dim) * vVis;     // the beads of the turns not yet drawn are not drawn either
        vec4 o = mix(far, near, vLod);
        float ff = fogF();
        o.rgb = mix(o.rgb, fogColor * o.a, ff);
        gl_FragColor = o;
      }`})}async function Oe(e,a={}){const r=e.rng.fork?e.rng.fork("dew-garden-web"):e.rng,V=d=>e.core.makeRng(e.core.hashSeed(d+":"+e.seed)),i=V("dew-garden-web-round3"),b=V("dew-garden-wilding"),W=e.noise,u=(a.palette&&a.palette.length>=7?a.palette:Ve).map(d=>new h.Color(d)),n=a.hubHeight??26,U=a.period??6,ie=a.drops??6e3,m=s().fromArray(a.sunDir||[0,.2,-1]).normalize(),G=new h.Color(a.sunColor||a.palette?.[0]||Ve[0]),I=new h.Color(1,1,1),S=u[5].clone().lerp(new h.Color("#6fa8e8"),.6).multiplyScalar(.8),A={uTime:{value:0},uTremor:{value:new h.Vector4(0,n-12,0,1)},uHub:{value:s(0,n,0)},uWind:{value:1},uViewH:{value:1080},uScl:{value:a.scale??1},uPitch:{value:.5},uGain:{value:1},uFall:{value:new h.Vector4(-1,0,-1,5.5)},uSunDirW:{value:m.clone()},uSunCol:{value:G},uDewCol:{value:u[5].clone()},uSkyZen:{value:a.sky?new h.Color(a.sky[1]):S},uSkyHor:{value:a.sky?new h.Color(a.sky[0]):u[0].clone().multiplyScalar(.95)},uGrassA:{value:u[1].clone().multiplyScalar(.95)},uGrassB:{value:u[3].clone().multiplyScalar(.8)},uSoil:{value:u[4].clone().multiplyScalar(.5)},uSkyCol:{value:S.clone().lerp(u[0],.35).multiplyScalar(.5)},uGroundCol:{value:u[3].clone().multiplyScalar(.3)},uSpotCol:{value:u[6].clone().multiplyScalar(.14)}},M=new h.Group;M.name="dew-garden-web",M.scale.setScalar(a.scale??1);const g=r(),ee=g>.8?.5:0,q=u[6].clone().offsetHSL(g>.5&&g<=.8?r.range(-.09,-.05):r.range(-.03,.03),0,g>.5&&g<=.8?-.06:r.range(-.03,.04)).multiplyScalar(.78),T={deep:u[3],grass:u[2],lime:u[1],soil:u[4].clone().multiplyScalar(.7),accent:q,cream:u[0].clone().lerp(I,.35).multiplyScalar(.78),bud:u[1].clone().lerp(u[2],.45),calyx:u[2].clone().lerp(u[3],.35)},N=[],te=[],$=()=>e.yield?.(),ye=qe(A);for(const d of[-1,1]){const z=Pe();if(N.push(await Ge(z,r,W,{bx:d*27.5,H:n+23+r.range(11,15),sideSign:d,col:T,phase:r(),blush:ee},$)),await e.yield?.(),d>0&&a.caught!==!1)for(const[he,l,c,w]of[[-12.6,6.4,4.3,-1],[13.4,-5.6,3.9,1],[-9.8,-11.2,3.1,-1]]){const D=s(w*i.range(.15,.4),-.84,.46).normalize(),E=s(w*.2,-.25,-1);E.addScaledVector(D,-E.dot(D)).normalize();const B=s().crossVectors(D,E).normalize(),pe=s(he,n+l,.5).addScaledVector(D,-.5*c),ve=Le(z,T,pe,D,E,B,c,1,i.range(.85,1.05),i.range(0,.12)+ee,.25);te.push({p:ve.clone().addScaledVector(E,c*.3).addScaledVector(D,c*.2),r:i.range(.34,.5)})}const Z=new h.BufferGeometry;Z.setAttribute("position",new h.Float32BufferAttribute(z.p,3)),Z.setAttribute("color",new h.Float32BufferAttribute(z.c,3)),await e.yield?.(),Z.setAttribute("aLoc",new h.Float32BufferAttribute(z.l,3)),Z.setAttribute("aData",new h.Float32BufferAttribute(z.d,2)),Z.setIndex(z.i),await e.yield?.(),await Be(Z,$),await e.yield?.();const O=new h.Mesh(Z,ye);O.name="foxgloves",M.add(O),await e.yield?.()}const t=await He(r,W,{hy:n,stems:N,nDrops:ie},$);await e.yield?.();{const d=t.TH,z=d.pos.length/12,Z=a.fatBeads??28;for(let O=0,he=0;O<600&&he<Z;O++){const l=Math.floor(i()*z)*12,c=(d.pos[l]+d.pos[l+6])/2,w=(d.pos[l+1]+d.pos[l+7])/2,D=Math.hypot(c,w-n);if(D<t.R0+.8||D>t.R0+5.2||Math.abs(d.pos[l+2])>.01)continue;const E=i.range(.24,.4);t.DR.pos.push(c,w-E*.6,0,E),t.DR.dat.push(i(),1,i(),0),t.DR.lod.push(0),t.DR.n++,he++}for(const O of te)t.DR.pos.push(O.p.x,O.p.y-O.r*.8,O.p.z,O.r),t.DR.dat.push(i(),0,i(),.25),t.DR.lod.push(0),t.DR.n++}a.miniWeb&&Ie(t.TH,t.DR,V("dew-garden-mini-web"),a.miniWeb),await e.yield?.();let y=null;if(a.wild){const d=a.wild,z=Pe(),Z=Math.cos(d.rot),O=Math.sin(d.rot),he=await Ge(z,b,W,{bx:0,H:d.H,sideSign:d.lean??1,col:T,phase:b(),blush:ee,bias:0,leafK:d.leafK??.6,free:!0,lite:!0},$);await e.yield?.();for(let c=0;c<z.p.length;c+=3){const w=z.p[c],D=z.p[c+2];z.p[c]=d.x+w*Z+D*O,z.p[c+2]=d.z-w*O+D*Z}await e.yield?.();for(const c of he.tips){const w=c.kind==="bell",D=w&&c.f<.55;if(!D&&!b.chance(.4))continue;const E=D?b.range(.3,.5)*(.6+c.L/9):c.r,B=c.p.x,pe=c.p.z;t.DR.pos.push(d.x+B*Z+pe*O,c.p.y-E*.8,d.z-B*O+pe*Z,E),t.DR.dat.push(b(),0,b(),w?1:.5),t.DR.lod.push(0),t.DR.n++}const l=new h.BufferGeometry;l.setAttribute("position",new h.Float32BufferAttribute(z.p,3)),l.setAttribute("color",new h.Float32BufferAttribute(z.c,3)),await e.yield?.(),l.setAttribute("aLoc",new h.Float32BufferAttribute(z.l,3)),l.setAttribute("aData",new h.Float32BufferAttribute(z.d,2)),l.setIndex(z.i),await e.yield?.(),await Be(l,$),await e.yield?.(),y=new h.Mesh(l,ye),y.name="foxglove-wild",M.add(y),await e.yield?.()}const v=new h.BufferGeometry;v.setAttribute("position",new h.Float32BufferAttribute(t.TH.pos,3)),v.setAttribute("aDir",new h.Float32BufferAttribute(t.TH.dir,4)),v.setAttribute("aA",new h.Float32BufferAttribute(t.TH.a,4)),v.setAttribute("aLod",new h.Float32BufferAttribute(t.TH.lod,2)),A.uPitch.value=t.pitch,v.setIndex(t.TH.idx),v.boundingSphere=new h.Sphere(s(0,n,0),42);const x=new h.Mesh(v,Ne(A));x.name="silk",x.renderOrder=1,a.miniWeb&&(x.frustumCulled=!1),M.add(x);const L=t.DR;for(const d of N)for(const z of d.tips)r.chance(z.kind==="bell"?.42:.5)&&(L.pos.push(z.p.x,z.p.y-z.r*.8,z.p.z,z.r),L.dat.push(r(),0,r(),z.kind==="bell"?1:.5),L.lod.push(0),L.n++);const j=new h.InstancedBufferGeometry;j.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,-1,1,0,1,1,0],3)),j.setIndex([0,1,2,2,1,3]),j.setAttribute("iPos",new h.InstancedBufferAttribute(new Float32Array(L.pos),4)),j.setAttribute("iData",new h.InstancedBufferAttribute(new Float32Array(L.dat),4)),j.setAttribute("iLod",new h.InstancedBufferAttribute(new Float32Array(L.lod),1)),j.instanceCount=L.n;const C=new h.Mesh(j,je(A));C.name="dew",C.frustumCulled=!1,C.renderOrder=2,M.add(C),await e.yield?.();const R=L.cands.length?r.shuffle(L.cands.slice()):[0],F=s(0,n,0),P={portalSeat:{position:s(0,n,0),normal:s(0,0,1),radius:7},hubRadius:t.R0,flyThrough:[s(0,n,170),s(0,n,110),s(0,n,50),s(0,n,0),s(0,n,-40)],approachDir:s(0,0,-1),viewpoints:{reveal:s(0,n-2,165),mid:s(-6,n,90),close:s(4,n+1,34),oblique:s(44,n-8,62)},damselCross:[[s(-34,n+5,26),s(34,n-4,33)],[s(30,n-9,24),s(-32,n+8,30)]],stemBases:N.map(d=>d.stemAt(0)),stemTops:N.map(d=>d.stemAt(1)),sunDir:m.clone(),fallingDrop:F},ae=new h.Vector2;let ue=0;const fe={object:M,radius:38,height:Math.max(N[0].height,N[1].height),center:s(0,n,0),anchors:P,wild:y,ground:!0,groundY:0,uniforms:A,setProgress(d){ue=Ae(d,0,1),A.uHub.value.z=ue*ue*.6,A.uGain.value=1+.8*ue},setSun(d,z){d&&(m.copy(d.isVector3?d:s().fromArray(d)).normalize(),P.sunDir.copy(m)),z!==void 0&&G.set(z)},update(d,z){A.uTime.value=z,A.uSunDirW.value.copy(m).transformDirection(M.matrixWorld),e.renderer?.getDrawingBufferSize&&(A.uViewH.value=e.renderer.getDrawingBufferSize(ae).y||1080);const Z=Math.max(0,Math.floor(z/U)),O=Math.max(0,z-Z*U),he=R[Z*7%R.length],l=Z>0?R[(Z-1)*7%R.length]:-1,c=L.pos[he*4],w=L.pos[he*4+1];A.uFall.value.set(he,O,l,5.5),A.uTremor.value.set(c,w,O,1),F.set(c,Math.max(0,w-.5*5.5*O*O),0)},dispose(){}};return fe.update(0,0),fe}export{Oe as buildHero,Be as stepNormals};
