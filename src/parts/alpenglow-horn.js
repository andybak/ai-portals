import*as o from"three";const Ae={H:1500,faceAz:[220,310,40,130],faceR:[1050,950,900,1e3],pow:1.22,tc:400,split:240},lo=Math.PI/180,ge=Ae.faceAz.map(c=>[Math.sin(c*lo),-Math.cos(c*lo)]),G=[-ge[0][1],ge[0][0]],ie=c=>Math.min(1,Math.max(0,c)),m=(c,T,I)=>{const Q=ie((I-c)/(T-c));return Q*Q*(3-2*Q)},g=(c,T,I)=>c+(T-c)*I,No=c=>{const T=Math.sin(c*91.7+13.1)*43758.5453;return T-Math.floor(T)},uo=(c,T)=>Ae.tc+T*Ae.split*(1-m(.34,1,c));function zo(c,T=!1){const{H:I,faceR:Q,pow:x}=Ae;return(P,_,z)=>{let u=-1e9,D=0,H=-1e9;const V=Math.hypot(P,_),q=Math.min(1,V/500)*70,y=P+c.n2(P*.0016+9.1,_*.0016)*q+46*Math.exp(-V/260),Y=_+c.n2(P*.0016,_*.0016-4.7)*q-18*Math.exp(-V/260);for(let $=0;$<4;$++){const de=(y*ge[$][0]+Y*ge[$][1])/Q[$];de>u?(H=u,u=de,D=$):de>H&&(H=de)}const U=Math.exp(-Math.max(0,u-H)*18),Z=1-u,Ne=I*Math.sign(Z)*Math.pow(Math.abs(Z),x),te=ie(u*3.2)*ie((1.25-u)*2.2),ce=D===0?P*G[0]+_*G[1]:P*-ge[D][1]+_*ge[D][0];let B=Ne+c.fbm2(P*.0019+3.1,_*.0019-7.7,3)*120*te;B+=70*Math.exp(-Math.pow((u-.3)/.07,2))*U-55*Math.exp(-Math.pow((u-.42)/.05,2))*U,B+=U*c.n2(P*.011+5,_*.011)*26*te;const le=c.ridged2(ce*.0072+D*13.7,u*1.5+c.n2(P*.003,_*.003)*.25,3);B+=(le-.42)*115*te*(1-.5*U),B+=c.n2(P*.019,_*.019)*9*te;let W=0,oe=0;const ze=y*ge[0][0]+Y*ge[0][1],De=y*G[0]+Y*G[1],ye=Math.atan2(De-ze,De+ze),E=ye*420,xe=Math.floor(E/58),Me=No(xe),et=E/58-xe,Le=u+.028*(Me-.5)+.006*c.n2(E*.03,2.2),Ve=1-m(1.15,1.5,Math.abs(ye)),Ue=1-.8*Math.exp(-Math.pow((Math.abs(E)-108)/30,2)),Ye=m(.25,.325,Le)*Ve,ue=Ye*(1-m(.347,.36,Le))*(.8+.2*Me)*(.86+.14*m(.03,.14,Math.min(et,1-et)))*Ue;if(B+=ue*135,W=Math.max(ue,Ye*(1-m(.375,.39,Le))*Ue),D===0){const $=ce-Ae.tc;for(const he of[-1,1]){const be=(ce-uo(u,he))/36,Ee=Math.exp(-be*be)*m(.37,.46,u)*(1-m(1,1.12,u));B-=Ee*42,oe=Math.max(oe,Ee)}if(T){const he=($+470)/34,be=Math.exp(-he*he)*m(.3,.4,u)*(1-m(1,1.12,u));B-=be*38,oe=Math.max(oe,be)}const de=Math.exp(-($*$)/28900)*m(.84,1,u)*(1-m(1,1.3,u));B+=de*16,W=Math.max(W,de*.8)}return z&&(z.d=u,z.face=D,z.t=ce,z.ice=W,z.coul=oe,z.gl=ue,z.lat=E),B}}const Je=`
float hh(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(hh(i), hh(i + vec3(1,0,0)), f.x), mix(hh(i + vec3(0,1,0)), hh(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hh(i + vec3(0,0,1)), hh(i + vec3(1,0,1)), f.x), mix(hh(i + vec3(0,1,1)), hh(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fb(vec3 p){ return vn(p) * .5 + vn(p * 2.13 + 7.1) * .3 + vn(p * 4.71 + 3.3) * .2; }
`,_o=Je,Do={sunDir:[-.93,.03,.25],sunCol:[3.2,.9,.62],sky:[.07,.17,.5],ground:[.02,.035,.09],bounce:[.5,.2,.17],fogColor:"#3E5E96",fogDensity:35e-5,shadowY:[800,1e3],shadowDrop:0,moon:0,ember:0,edge:16,glowY:[900,1500],moonDir:[0,1,0],moonCol:[0,0,0]};function Uo(c){return new o.ShaderMaterial({uniforms:c,fog:!0,vertexShader:`
      attribute vec4 aM;
      varying vec3 vW, vN; varying vec4 vM;
      #include <fog_pars_vertex>
      void main(){
        vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vM = aM;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uSunDir, uSunCol, uSky, uGround, uBounce, uMoonDir, uMoonCol; uniform vec2 uGlowY; uniform float uShadowY, uMoon, uEmber, uEdge;
      varying vec3 vW, vN; varying vec4 vM;
      #include <fog_pars_fragment>
      ${Je}
      void main(){
        vec3 N = normalize(vN);
        float dist = length(vW - cameraPosition), lodK = (1. - smoothstep(500., 2600., dist));
        // rock structure: beds dipping across the face, joints down the fall line, blocky breakup
        vec3 q = vW * .011;
        float n1 = fb(q), n2 = fb(q * 3.7 + 11.), n3 = vn(vW * .16) * lodK;
        float bedC = vW.y * .052 + dot(vW.xz, vec2(.014, .009)) + n1 * 5.;
        float bed = smoothstep(.0, .3, abs(fract(bedC) - .5)) * .5 + .5 * vn(vec3(floor(bedC) * 3.3, 1., 2.));
        float joint = smoothstep(.36, .5, abs(fract(dot(vW.xz, vec2(.021, -.017)) + n2 * .8) - .5) * 2. * .5 + .25 * n3);
        // perturb the normal with the same structure (cheap finite difference of two noises)
        float e = 9.;
        vec3 g = vec3(fb((vW + vec3(e,0,0)) * .011 * 3.7 + 11.) - n2, fb((vW + vec3(0,e,0)) * .011 * 3.7 + 11.) - n2, fb((vW + vec3(0,0,e)) * .011 * 3.7 + 11.) - n2);
        vec3 Nd = normalize(N - g * 2.6 - vec3(0., (bed - .6) * .5, 0.) * (1. - N.y));
        // snow and ice: ledges, snowfields in the hollows, couloirs, the hanging glacier (fine breakup only when near)
        float up = Nd.y + (n1 - .5) * .22 + (n2 - .5) * .3 * lodK;
        float field = smoothstep(.5, .72, fb(vW * .0031 + 4.) + (N.y - .55) * .9);
        float snow = smoothstep(.7, .82, up) * (.55 + .45 * field) + field * smoothstep(.42, .62, N.y) * .85;
        snow = max(snow, smoothstep(.35, .8, vM.y) * .96);
        snow = max(snow, smoothstep(.3, .75, vM.z) * smoothstep(.3, .6, Nd.y + .25));
        snow = clamp(snow, 0., 1.);
        vec3 rock = mix(vec3(.2, .155, .14), vec3(.4, .32, .28), n1) * (.62 + .5 * bed) * (.7 + .3 * joint) * (.85 + .3 * n3);
        rock = mix(rock, rock * vec3(.55, .5, .5), smoothstep(.55, .9, fb(vec3(vW.x * .004, vW.y * .0012, vW.z * .004))) * .7);   // dark water streaks
        vec3 ice = mix(vec3(.52, .6, .72), vec3(.64, .67, .72), n2);
        // the hanging glacier: transverse crevasses open across its back, and its front is a cliff of blue seracs split by dark clefts
        float gla = smoothstep(.3, .8, vM.y);
        float slot = (1. - smoothstep(.06, .2, abs(fract(vM.x * 62. + n1 * 2.2) - .5))) * gla * smoothstep(.5, .8, N.y);
        ice = mix(ice, vec3(.2, .36, .58), slot * .8);
        float cliff = smoothstep(.12, .6, vM.y) * (1. - smoothstep(.5, .82, N.y));
        float flute = vn(vec3(vM.w * .03, vW.y * .011, 3.)) * .7 + vn(vec3(vM.w * .09, vW.y * .03, 5.)) * .3, cleft = smoothstep(.52, .68, flute);
        ice = mix(ice, mix(vec3(.5, .7, .9), vec3(.15, .3, .54), cleft) * (.84 + .3 * n3 + .2 * bed), cliff);
        vec3 alb = mix(rock, ice, snow);
        float iceK = cliff * snow;
        // the level shadow line: above it the low sun, below it only sky and the bounce of the lit wall
        float lit = smoothstep(uShadowY - uEdge, uShadowY + uEdge, vW.y + (n1 - .5) * uEdge);
        float ndl = max(dot(Nd, uSunDir), 0.), wrap = max(dot(Nd, uSunDir) * .5 + .5, 0.);
        float cool = (1. - smoothstep(uShadowY, uShadowY + 220., vW.y));                       // the lowest lit rock is the reddest
        vec3 sunC = uSunCol * mix(vec3(1., 1.08, 1.05), vec3(.9, .6, .66), cool * (1. - uMoon));
        vec3 sun = sunC * (ndl * .92 + wrap * wrap * .08) * mix(lit, 1., uMoon);
        sun += uSunCol * uEmber * smoothstep(uGlowY.x, uGlowY.y, vW.y + (n1 - .5) * 90.) * (.3 + .7 * wrap);   // afterglow: the summit as a dull ember
        vec3 moonL = uMoonCol * (max(dot(Nd, uMoonDir), 0.) * .8 + .2 * max(dot(N, uMoonDir) * .5 + .5, 0.));        // the risen moon: a cool second key
        float hemi = Nd.y * .5 + .5;
        vec3 fill = mix(uGround, uSky, hemi) * (.62 + .3 * N.y);
        vec3 bnc = uBounce * (1. - lit) * max(Nd.y * .7 + .3, 0.) * smoothstep(-100., 500., vW.y) * (1. - uMoon);
        vec3 col = alb * (fill + bnc + moonL) + mix(alb, vec3(.9, .82, .84), iceK * .7) * sun + vec3(.04, .09, .16) * cliff * (uSky.b + uSky.g) * (1. - cleft);   // (ice in the sun glows pale, not purple)
        col += alb * uSunCol * snow * pow(max(dot(reflect(-uSunDir, Nd), normalize(cameraPosition - vW)), 0.), 18.) * .25 * lit;
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`})}function Co(c){const I=z=>{const u=new Float32Array(z*z);for(let D=0;D<u.length;D++)u[D]=c();return u},Q=[I(8),I(16),I(32),I(64)],x=new Uint8Array(16384*4),P=(z,u,D,H)=>{const V=D*u,q=H*u,y=Math.floor(V),Y=Math.floor(q);let U=V-y,Z=q-Y;U=U*U*(3-2*U),Z=Z*Z*(3-2*Z);const Ne=y%u,te=(y+1)%u,ce=Y%u,B=(Y+1)%u;return g(g(z[ce*u+Ne],z[ce*u+te],U),g(z[B*u+Ne],z[B*u+te],U),Z)};for(let z=0;z<128;z++)for(let u=0;u<128;u++){const D=u/128,H=z/128,V=P(Q[0],8,D,H),q=P(Q[1],16,D,H),y=P(Q[2],32,D,H),Y=P(Q[3],64,D,H),U=(z*128+u)*4;x[U]=255*(V*.5+q*.3+y*.14+Y*.06),x[U+1]=255*(q*.5+y*.3+Y*.2),x[U+2]=255*(y*.6+Y*.4),x[U+3]=255}const _=new o.DataTexture(x,128,128,o.RGBAFormat);return _.wrapS=_.wrapT=o.RepeatWrapping,_.magFilter=o.LinearFilter,_.minFilter=o.LinearMipmapLinearFilter,_.generateMipmaps=!0,_.needsUpdate=!0,_}async function Bo(c,T={}){const I=c.rng.fork("horn"),Q=c.core.makeNoise(I.int(1,1e9)),x={...Do,...T.look||{}},P=!!T.rare,_=!!T.foehn,z=T.detail??1,u=Ae.H,D=zo(Q,P),H=T.floorAt||(()=>-1e4),V=new o.Group,q=e=>e&&e.isVector3?e.clone():e&&e.isColor?new o.Vector3(e.r,e.g,e.b):new o.Vector3(e[0],e[1],e[2]),y={...o.UniformsUtils.clone(o.UniformsLib.fog),uSunDir:{value:q(x.sunDir).normalize()},uSunCol:{value:q(x.sunCol)},uSky:{value:q(x.sky)},uGround:{value:q(x.ground)},uBounce:{value:q(x.bounce)},uShadowY:{value:900},uMoon:{value:x.moon||0},uEmber:{value:x.ember||0},uTime:{value:0},uEdge:{value:x.edge??16},uGlowY:{value:new o.Vector2(x.glowY[0],x.glowY[1])},uMoonDir:{value:q(x.moonDir).normalize()},uMoonCol:{value:q(x.moonCol)}},Y={uSunDir:y.uSunDir,uSunCol:y.uSunCol,uSky:y.uSky,uGround:y.uGround,uBounce:y.uBounce,uShadowY:y.uShadowY,uMoon:y.uMoon,uEmber:y.uEmber,uTime:y.uTime,uEdge:y.uEdge,uGlowY:y.uGlowY,uMoonDir:y.uMoonDir,uMoonCol:y.uMoonCol},U=()=>o.UniformsUtils.clone(o.UniformsLib.fog),Z=-300,Ne=1320,te=-1050,ce=1010,B=162,le=172,W=ge[0],oe=(B+1)*(le+1),ze=new Float32Array(oe*3),De=new Float32Array(oe*3),ye=new Float32Array(oe*4),E=new Float32Array(oe),xe=new Float32Array(oe),Me={};for(let e=0,n=0;e<=le;e++){for(let a=0;a<=B;a++,n++){const s=Z+(Ne-Z)*(a/B),i=te+(ce-te)*(e/le),l=W[0]*s+G[0]*i,r=W[1]*s+G[1]*i,t=D(l,r,Me);ze[n*3]=l,ze[n*3+1]=t,ze[n*3+2]=r,E[n]=t,xe[n]=H(l,r),ye[n*4]=Me.d,ye[n*4+1]=Me.ice,ye[n*4+2]=Me.coul,ye[n*4+3]=Me.lat}(e&3)===3&&await c.yield()}const et=(Ne-Z)/B,Le=(ce-te)/le,Ve=B+1,Ue=new o.Vector3;for(let e=0,n=0;e<=le;e++)for(let a=0;a<=B;a++,n++){const s=E[n+(a<B?1:0)]-E[n-(a>0?1:0)],i=E[n+(e<le?Ve:0)]-E[n-(e>0?Ve:0)],l=s/(et*(a>0&&a<B?2:1)),r=i/(Le*(e>0&&e<le?2:1));Ue.set(-(W[0]*l+G[0]*r),1,-(W[1]*l+G[1]*r)).normalize(),De[n*3]=Ue.x,De[n*3+1]=Ue.y,De[n*3+2]=Ue.z}await c.yield();const Ye=[];for(let e=0;e<le;e++)for(let n=0;n<B;n++){const a=e*Ve+n,s=a+1,i=a+Ve,l=i+1;Math.max(E[a]-xe[a],E[s]-xe[s],E[i]-xe[i],E[l]-xe[l])<-25||(Math.abs(E[a]-E[l])<Math.abs(E[s]-E[i])?Ye.push(a,l,s,a,i,l):Ye.push(a,i,s,s,i,l))}await c.yield();const ue=new o.BufferGeometry;ue.setAttribute("position",new o.BufferAttribute(ze,3)),ue.setAttribute("normal",new o.BufferAttribute(De,3)),ue.setAttribute("aM",new o.BufferAttribute(ye,4)),ue.setIndex(Ye),ue.computeBoundingSphere();const $=Uo({...U(),...Y}),de=new o.Mesh(ue,$);de.frustumCulled=!1,V.add(de),await c.yield();const he=Co(I.fork("n"));await c.yield();const be=_?820:420,Ee=new o.Vector3(.72,.1,-.69).normalize(),fo=new o.ShaderMaterial({uniforms:{...U(),...Y,tN:{value:he},uLen:{value:be}},fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
      uniform float uTime, uLen; varying vec2 vUv; varying vec3 vW;
      #include <fog_pars_vertex>
      void main(){ vUv = uv; vec3 p = position;
        float s = uv.x; p.y += sin(s * 7. - uTime * .9) * 14. * s + sin(s * 17. - uTime * 1.7 + p.z) * 5. * s;
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D tN; uniform float uTime, uShadowY, uMoon, uEmber; uniform vec3 uSunCol, uSky, uMoonCol; varying vec2 vUv; varying vec3 vW;
      #include <fog_pars_fragment>
      void main(){
        float s = vUv.x, v = vUv.y * 2. - 1.;
        vec2 q = vec2(s * 2.2 - uTime * .085, vUv.y * .9);
        float n = texture2D(tN, q).r * .6 + texture2D(tN, q * 2.3 + vec2(-uTime * .06, .3)).g * .4;
        float env = (1. - smoothstep(.15, 1., abs(v + (n - .5) * .7))) * smoothstep(0., .035, s) * (1. - smoothstep(.45, 1., s));
        float a = clamp(env * smoothstep(.34, .78, n + env * .35) * 1.15, 0., 1.) * (1. - .45 * s);
        float lit = mix(smoothstep(uShadowY - 30., uShadowY + 30., vW.y), 1., uMoon);
        vec3 col = uSunCol * (.3 + .2 * n) * lit + uSky * .9 + uSunCol * uEmber * .4 + uMoonCol * .25;
        #ifdef USE_FOG
        col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
        #endif
        gl_FragColor = vec4(col * a, a);
      }`}),Gt=e=>{const n=new o.PlaneGeometry(1,1,36,4),a=n.attributes.position,s=new o.Vector3(0,1,0),i=new o.Vector3().crossVectors(Ee,s).normalize(),l=new o.Vector3,r=s.clone().multiplyScalar(Math.cos(e)).addScaledVector(i,Math.sin(e));for(let d=0;d<a.count;d++){const v=a.getX(d)+.5,C=a.getY(d)*2,b=16+150*Math.pow(v,.8)*(_?1.2:1);l.set(0,u-6+40*v,0).addScaledVector(Ee,v*be-12).addScaledVector(r,C*b*.5+b*.22*v),a.setXYZ(d,l.x,l.y,l.z)}const t=new o.Mesh(n,fo);return t.frustumCulled=!1,t.renderOrder=2,t};if(V.add(Gt(0),Gt(1.25)),await c.yield(),_){const e=[],n=[],a=[];for(const[t,d,v,C]of[[1,0,34,0],[.74,30,26,1],[.5,54,18,2],[.62,-26,14,3]]){const b=e.length/3;for(let S=0;S<=6;S++)for(let f=0;f<40;f++){const A=S/6,F=f/40*Math.PI*2,k=Math.cos(F)*A,w=Math.sin(F)*A;e.push(k*780*t,d*.8+v*.7*(1-A*A),w*270*t),n.push(k,w,C)}for(let S=0;S<6;S++)for(let f=0;f<40;f++){const A=b+S*40+f,F=b+S*40+(f+1)%40,k=A+40,w=F+40;a.push(A,k,F,F,k,w)}}const l=new o.BufferGeometry;l.setAttribute("position",new o.Float32BufferAttribute(e,3)),l.setAttribute("aU",new o.Float32BufferAttribute(n,3)),l.setIndex(a);const r=new o.Mesh(l,new o.ShaderMaterial({uniforms:{...U(),...Y,tN:{value:he}},fog:!0,transparent:!0,depthWrite:!1,side:o.DoubleSide,vertexShader:`attribute vec3 aU; varying vec3 vW, vU;
        #include <fog_pars_vertex>
        void main(){ vU = aU; vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        }`,fragmentShader:`uniform sampler2D tN; uniform vec3 uSunCol, uSky; uniform float uTime, uMoon; varying vec3 vW, vU;
        #include <fog_pars_fragment>
        void main(){ float r = length(vU.xy);
          vec2 q = vU.xy * vec2(.42, 1.9) + vec2(uTime * .0035 + vU.z * .37, vU.z * .21);          // streaks drawn out along the wind
          float n = texture2D(tN, q).r * .65 + texture2D(tN, q * 2.7 + .31).g * .35;
          float a = (1. - smoothstep(.16, 1., r + (n - .5) * .75)) * (.4 - .05 * vU.z);
          float under = smoothstep(-40., 60., vW.y - cameraPosition.y);                             // seen from below: the lit belly
          float edge = smoothstep(.25, .95, r);
          vec3 belly = uSunCol * mix(vec3(.62, .3, .27), vec3(1.05, .5, .38), edge) * (.75 + .5 * n);
          vec3 top = uSunCol * vec3(.8, .62, .6) * .6;
          vec3 col = mix(top, belly, under) * (1. - uMoon) + uSky * (.55 + .6 * uMoon) + vec3(.05, .07, .11) * uMoon * (.6 + n);
          gl_FragColor = vec4(col, a);
          #include <fog_fragment>
        }`}));r.position.set(120,u+170,-90),r.rotation.y=.75,r.renderOrder=2,r.frustumCulled=!1,V.add(r),await c.yield()}const tt=T.timing||{},gt=Ae.faceR[0],Po=.3,R=.5,yt=1.3,Te=tt.crack??.16,fe=tt.fall??.195,K=tt.hit??.238,qe=tt.foot??.5,Ce=e=>m(.95,1.25,e),vo=(e,n,a)=>(n===2?Ae.tc-470*(1-m(.9,1,e))-250*Ce(e):uo(e,n))+a*(56+(n===2?300:219)*Ce(e)),ot=76,Pe=13,Vt=[];for(const e of P?[-1,1,2]:[-1,1]){const n=new Float32Array(ot*Pe*3);for(let a=0;a<ot;a++)for(let s=0;s<Pe;s++){const i=g(.34,yt,a/(ot-1)),l=vo(i,e,s/(Pe-1)*2-1),r=i*gt,t=W[0]*r+G[0]*l,d=W[1]*r+G[1]*l,v=(a*Pe+s)*3;n[v]=t,n[v+1]=Math.max(D(t,d),H(t,d)),n[v+2]=d}Vt.push(n),await c.yield()}const j=(e,n,a,s)=>{const i=Vt[n===2?2:n<0?0:1],l=ie((e-.34)/(yt-.34))*(ot-1.001),r=ie(a*.5+.5)*(Pe-1.001),t=Math.floor(l),d=Math.floor(r),v=l-t,C=r-d,b=(t*Pe+d)*3,S=b+Pe*3;for(let f=0;f<3;f++)s[f]=g(g(i[b+f],i[b+3+f],C),g(i[S+f],i[S+3+f],C),v);return s},Ie=e=>{if(e<=K)return R;if(e<qe){const a=(e-K)/(qe-K);return R+.5*(.3*a*a+.7*a)}const n=ie((e-qe)/(1-qe));return 1+.215*(1-Math.pow(1-n,1.7))},je=[],M=I.fork("billows"),ve=P?[-1,1,2]:[-1,1],Yt=Math.round((P?174:150)*(.6+.4*z)),Et=P?102:92,Tt=12;for(let e=0;e<Yt;e++){const n=M(),a=e%3===0?-n:Math.pow(n,.8)*(M()<.8?1:-1);je.push({kind:0,side:ve[e%ve.length],w:a,ph:M(),rate:M.range(.045,.085),smax:M.range(8.5,16.5),hf:M.range(.75,1.15),seed:M()*50,lobe:M.range(-1,1)})}for(let e=0;e<Et;e++)je.push({kind:1,side:ve[e%ve.length],w:M.range(-.9,.9),ph:M(),rate:M.range(.025,.045),smax:M.range(17,27),hf:M.range(.8,1.5),seed:M()*50,lobe:M.range(-1,1)});for(let e=0;e<Tt;e++)je.push({kind:2,side:e%2?1:-1,w:M.range(-.9,.9),ph:M(),rate:0,smax:M.range(20,34),hf:M.range(.3,1),seed:M()*50,lobe:0});const nt=Yt,mo=Et+Tt,ho=je.length;await c.yield();const Rt=(e,n)=>{const a=new o.IcosahedronGeometry(1,e),s=new o.InstancedBufferGeometry;s.setAttribute("position",a.attributes.position),s.setAttribute("normal",a.attributes.normal),a.index&&s.setIndex(a.index);const i=new o.InstancedBufferAttribute(new Float32Array(n*4),4),l=new o.InstancedBufferAttribute(new Float32Array(n*4),4);return i.setUsage(o.DynamicDrawUsage),l.setUsage(o.DynamicDrawUsage),s.setAttribute("aP",i),s.setAttribute("aR",l),s.instanceCount=n,a.dispose(),{g:s,P:i,R:l}},at=Rt(3,nt);await c.yield();const rt=Rt(2,mo);await c.yield();const Lt=`
      uniform vec3 uSunDir, uSunCol, uSky, uGround, uBounce, uMoonDir, uMoonCol; uniform float uShadowY, uMoon; varying vec3 vN, vW, vP; varying float vAo, vSoft; varying vec2 vB;
      #include <fog_pars_fragment>
      ${Je}
      // cellular lumps: xyz = offset from the nearest lump centre, w = squared distance to it (no lookups, no derivatives)
      vec4 cell(vec3 p){ vec3 b = floor(p - .5); vec4 best = vec4(0., 0., 0., 9.);
        for (int k = 0; k < 8; k++) { float fk = float(k); vec3 g = b + vec3(mod(fk, 2.), mod(floor(fk * .5), 2.), floor(fk * .25));
          vec3 c = g + .5 + (vec3(hh(g), hh(g + 17.3), hh(g + 41.7)) - .5) * .72, d = p - c; float dd = dot(d, d); if (dd < best.w) best = vec4(d, dd); }
        return best; }
      void main(){
        vec4 c1 = cell(vP), c2 = cell(vP * 2.4 + 5.3); float f1 = sqrt(c1.w), f2 = sqrt(c2.w), b3 = vn(vP * 5.7);
        vec3 N = normalize(normalize(vN) + c1.xyz * 1.5 + c2.xyz * .75 + (b3 - .5) * .25), V = normalize(cameraPosition - vW);
        float crease = (.3 + .7 * (1. - smoothstep(.3, .78, f1))) * (.62 + .38 * (1. - smoothstep(.25, .72, f2))) * (.9 + .2 * b3); crease = mix(crease, .56 + .5 * crease, vSoft);     // dark blue creases between the lumps
        float hemi = N.y * .5 + .5, lit = mix(smoothstep(uShadowY - 20., uShadowY + 20., vW.y), 1., uMoon);
        float under = smoothstep(-.12, .6, (vW.y - vB.x) / max(vB.y, 1.));                   // the foot of the cloud stays in its own blue shade
        vec3 fill = mix(uGround * 1.5 + uSky * .14, uSky, smoothstep(.0, 1., hemi)) * mix(.5, 1., under);
        vec3 bnc = uBounce * 1.75 * pow(max(hemi, 0.), 1.5) * (1. - lit) * (1. - uMoon) * under;   // rose from the lit wall on every top
        vec3 sun = uSunCol * (max(dot(N, uSunDir), 0.) * .7 + .2) * lit;                    // the crown that boils up into the sun
        float rim = pow(1. - max(dot(N, V), 0.), 2.5);
        // by moonlight (uMoonCol is black in the other looks) the powder is ghost-white: a wrapped silver key from the moon that stands
        // behind it, a bright rim on every lump's moonward edge, and creases that stay blue instead of going black
        float mk = min(dot(uMoonCol, vec3(.8)), 1.), mwrap = dot(N, uMoonDir) * .5 + .5;
        vec3 moonL = uMoonCol * (mwrap * mwrap * 1.5 + .2) * mix(.75, 1., under);
        float mrim = pow(1. - max(dot(N, V), 0.), 2.) * max(dot(-V, uMoonDir), 0.) * smoothstep(.25, .7, mwrap);
        float shade = vAo * crease; shade = mix(shade, .42 + .58 * shade, mk * .55);
        vec3 col = vec3(.78, .82, .9) * (fill * (1. + .4 * mk) + bnc + sun + moonL) * shade;
        col += (uSky * .28 + uBounce * .4 * hemi) * rim * under * (.4 + .6 * crease) + uMoonCol * mrim * 3. * (.5 + .5 * crease);
        float l = max(col.r, max(col.g, col.b)); col *= 1. / (1. + max(l - .5 - .24 * mk, 0.) * 1.1);     // stays mid-tone: never a white wall behind the portal
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`,qt=new o.ShaderMaterial({uniforms:{...U(),...Y},fog:!0,vertexShader:`
      attribute vec4 aP; attribute vec4 aR; uniform float uTime; varying vec3 vN, vW, vP; varying float vAo, vSoft; varying vec2 vB;
      #include <fog_pars_vertex>
      ${Je}
      void main(){
        vec3 p = position; float sd = aR.y, t = uTime * .22;
        float n = vn(p * 1.5 + sd + vec3(0., t, t * .6)), n2 = vn(p * 3.6 + sd * 1.7 - vec3(t, 0., t));
        float r = .66 + .5 * n + .26 * n2;                                  // cauliflower lumps that boil
        vec3 q = p * r; vec3 nn = normalize(p * (.55 + n * .9 + n2 * .35) + normal * .2);
        float c = cos(aR.x), s = sin(aR.x);                                 // roll forward and under, about the across-flow axis
        q = vec3(q.x, q.y * c - q.z * s, q.y * s + q.z * c); nn = vec3(nn.x, nn.y * c - nn.z * s, nn.y * s + nn.z * c);
        vAo = .45 + .55 * smoothstep(.72, 1.28, r); vP = q * 2.1 + aR.y; vB = aR.zw; vSoft = 0.;
        vec3 wp = (modelMatrix * vec4(aP.xyz + q * aP.w, 1.)).xyz; vW = wp; vN = normalize(mat3(modelMatrix) * nn);
        vec4 mvPosition = viewMatrix * vec4(wp, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Lt}),It=new o.Mesh(at.g,qt);It.frustumCulled=!1,V.add(It);const jt=new o.Mesh(rt.g,qt);jt.frustumCulled=!1,V.add(jt),await c.yield();const Se=26,ne=9,Oe=ve.length,st=new Float32Array(Oe*Se*ne*3),it=new Float32Array(Oe*Se*ne*3),ct=new Float32Array(Oe*Se*ne*3),Ot=[];for(let e=0;e<Oe;e++)for(let n=0;n<Se-1;n++)for(let a=0;a<ne-1;a++){const s=(e*Se+n)*ne+a;Ot.push(s,s+ne,s+1,s+1,s+ne,s+ne+1)}const He=new o.BufferGeometry,xt=new o.BufferAttribute(st,3),Mt=new o.BufferAttribute(it,3),bt=new o.BufferAttribute(ct,3);xt.setUsage(o.DynamicDrawUsage),Mt.setUsage(o.DynamicDrawUsage),bt.setUsage(o.DynamicDrawUsage),He.setAttribute("position",xt),He.setAttribute("normal",Mt),He.setAttribute("aB",bt),He.setIndex(Ot);const po=new o.ShaderMaterial({uniforms:{...U(),...Y},fog:!0,side:o.DoubleSide,vertexShader:`
      attribute vec3 aB; uniform float uTime; varying vec3 vN, vW, vP; varying float vAo, vSoft; varying vec2 vB;
      #include <fog_pars_vertex>
      ${Je}
      void main(){
        vec3 p = position; float t = uTime * .2;
        float n = vn(p * .03 + vec3(0., t, t * .6)), n2 = vn(p * .075 - vec3(t, 0., t));
        p += normal * ((n - .3) * 44. + (n2 - .5) * 20.) * aB.z;            // lumps that boil
        vAo = .62 + .5 * n; vP = p * .05; vB = aB.xy; vSoft = .4;
        vec4 wp = modelMatrix * vec4(p, 1.); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:Lt}),Ht=new o.Mesh(He,po);Ht.frustumCulled=!1,V.add(Ht);const X=new o.Vector3(W[0]*.78,.62,W[1]*.78).normalize(),ae=[0,0,0],re=[0,0,0],lt=[0,0,0],Kt=new o.Vector3,Xt=new o.Vector3,ut=new o.Vector3,_e=e=>m(0,.08,e)*Math.pow(Math.max(0,1-e),.5);await c.yield();const wo=48,Ke=Math.round((P?170:130)*z)+24,Xe=new Float32Array(Ke*4),St=new Float32Array(Ke*2),Qt=[];for(let e=0;e<Ke;e++)Qt.push({side:ve[e%ve.length],w:M.range(-1,1),ph:M(),rate:M.range(.03,.07),L:M.range(.08,.6),size:M.range(50,110),rise:M.range(.2,2.2),seed:M(),skirt:e%5<2});const dt=new o.PlaneGeometry(1,1),Be=new o.InstancedBufferGeometry;Be.setAttribute("position",dt.attributes.position),Be.setAttribute("uv",dt.attributes.uv),Be.setIndex(dt.index);const kt=new o.InstancedBufferAttribute(Xe,4),At=new o.InstancedBufferAttribute(St,2);kt.setUsage(o.DynamicDrawUsage),At.setUsage(o.DynamicDrawUsage),Be.setAttribute("aP",kt),Be.setAttribute("aA",At),Be.instanceCount=Ke,dt.dispose();const go=new o.ShaderMaterial({uniforms:{...U(),...Y,tN:{value:he}},fog:!0,transparent:!0,depthWrite:!1,blending:o.CustomBlending,blendSrc:o.OneFactor,blendDst:o.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 aP; attribute vec2 aA; varying vec2 vUv; varying vec3 vW; varying vec2 vA;
      #include <fog_pars_vertex>
      void main(){ vUv = uv; vA = aA; vec3 c = (modelMatrix * vec4(aP.xyz, 1.)).xyz;
        vec4 mvPosition = viewMatrix * vec4(c, 1.); float dz = max(-mvPosition.z, 1.); if (aA.x < 1.5) mvPosition.xyz *= max(.5, (dz - 48.) / dz);
        mvPosition.xy += position.xy * aP.w; vW = c + vec3(0., position.y * aP.w, 0.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform sampler2D tN; uniform vec3 uSunCol, uSky, uGround, uBounce, uMoonCol; uniform float uShadowY, uTime, uMoon; varying vec2 vUv; varying vec3 vW; varying vec2 vA;
      #include <fog_pars_fragment>
      void main(){
        vec2 c = vUv * 2. - 1.; float r = length(c);
        float n = texture2D(tN, vUv * .7 + vA.y * 7. + vec2(0., -uTime * .012)).r;
        float dust = step(1.5, vA.x), a = (1. - smoothstep(.2, 1., r + (n - .5) * .7)) * (vA.x - 2. * dust);
        float lit = mix(smoothstep(uShadowY - 40., uShadowY + 40., vW.y), 1., uMoon), top = c.y * .5 + .5;   // (alpha > 1 marks the serac's ice dust: whiter)
        vec3 col = mix(vec3(.6, .66, .78), vec3(.9, .93, .98), dust) * (mix(uGround * 1.6 + uSky * .25, uSky, top) * (1. + 1.1 * dust) + uBounce * 1.1 * top * (1. - lit) * (1. - uMoon) + uSunCol * (.3 + .25 * dust) * lit + uMoonCol * (.3 + .55 * top));
        #ifdef USE_FOG
        col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
        #endif
        gl_FragColor = vec4(col * a, a);
      }`}),Nt=new o.Mesh(Be,go);Nt.frustumCulled=!1,Nt.renderOrder=3,V.add(Nt),await c.yield();const se=6,ft=14,zt=44,yo=se+ft+zt,Dt=252,Zt=new o.BoxGeometry(1,1,1,3,3,3),Qe=Zt.attributes.position;for(let e=0;e<Qe.count;e++){const n=Qe.getX(e),a=Qe.getY(e),s=Qe.getZ(e),i=d=>{const v=Math.sin(d*127.1+n*311.7+a*74.7+s*201.3)*43758.5453;return v-Math.floor(v)-.5},l=Math.abs(n)*Math.abs(s)*4,r=Math.max(0,n*.9+a*.8+s*.5-.5),t=1-.17*l*l;Qe.setXYZ(e,n*t*(1-.24*(a+.5))-r*.9+.17*i(1),a-r*.8+.13*i(2),s*t*(1-.14*(a+.5))-r*.5+.17*i(3))}const xo=new o.ShaderMaterial({uniforms:{...U(),...Y},fog:!0,vertexShader:`varying vec3 vW; varying float vK;
      #include <fog_pars_vertex>
      void main(){ vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.); vW = wp.xyz; vK = step(14., length(instanceMatrix[0].xyz));   // the tower is pale; the bounding blocks are dark
      vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
      #include <fog_vertex>
      }`,fragmentShader:`uniform vec3 uSunDir, uSunCol, uSky, uGround, uBounce; uniform float uShadowY, uMoon; varying vec3 vW; varying float vK;
      #include <fog_pars_fragment>
      void main(){ vec3 fx = dFdx(vW), fy = dFdy(vW), c = cross(fx, fy); vec3 N = c / max(length(c), 1e-6);
        float lit = mix(smoothstep(uShadowY - 24., uShadowY + 24., vW.y), 1., uMoon), hemi = N.y * .5 + .5;
        vec3 alb = mix(vec3(.1, .125, .19), vec3(.52, .7, .9) * (.78 + .22 * step(.35, fract(vW.y * .07 + vW.x * .03))), vK);   // blue ice in beds
        vec3 col = alb * (mix(uGround * 1.5, uSky * (1. + .9 * vK * (1. - .7 * lit)), hemi) + uBounce * 1.2 * hemi * (1. - lit) * (1. - uMoon) * vK) + mix(alb, vec3(1., .94, .92), vK * .8) * uSunCol * (max(dot(N, uSunDir), 0.) * .55 + .22) * lit * vec3(1., .86, .74);   // (in the sun the ice glows pale rose)
        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`}),Fe=new o.InstancedMesh(Zt,xo,yo);Fe.frustumCulled=!1,Fe.instanceMatrix.setUsage(o.DynamicDrawUsage),V.add(Fe),await c.yield();const p=I.fork("ice"),vt=[],$t=[],Jt=[],Ut=new o.Vector3(W[0]+G[0],0,W[1]+G[1]).normalize(),pe=(()=>{const e={};let n=.3,a=!1;for(;n<.5;n+=.004)if(D((W[0]*1050+G[0]*950)*n,(W[1]*1050+G[1]*950)*n,e),e.gl>.5)a=!0;else if(a&&e.gl<.02)break;const s=(W[0]*1050+G[0]*950)*n+Ut.x*14,i=(W[1]*1050+G[1]*950)*n+Ut.z*14;return new o.Vector3(s,D(s,i)-6,i)})();await c.yield();for(let e=0;e<se;e++)vt.push({y:(e+.5)*(Dt/se),sx:112-e*10+p.range(-6,6),sy:Dt/se*1.36,sz:82-e*7+p.range(-5,5),ox:p.range(-5,5)+(e%2?7:-7),oz:p.range(-6,6),yaw:(e%2?.4:-.3)+p.range(-.25,.25),ax:new o.Vector3(p.range(-1,1),p.range(-.4,.4),p.range(-1,1)).normalize(),spin:p.range(3,8),side:e%2?1:-1,w:p.range(-.6,.6)});for(let e=0;e<ft;e++){const n=e%se,a=vt[n],s=p.range(0,6.283);Jt.push({k:n,off:new o.Vector3(Math.cos(s)*a.sx*.42,p.range(-.3,.45)*a.sy,Math.sin(s)*a.sz*.42),sx:p.range(26,44),sy:p.range(36,68),sz:p.range(24,40),yaw:p.range(0,6.283),lead:p.range(.002,.012),fly:p.range(.6,2.2),ax:new o.Vector3(p.range(-1,1),p.range(-.4,.4),p.range(-1,1)).normalize(),spin:p.range(4,10)})}for(let e=0;e<zt;e++)$t.push({side:ve[e%ve.length],w:Math.pow(p(),.8)*(e%4===0?-1:1),lead:p.range(.01,.05),size:p.range(3.6,8.5),hop:p.range(4,15),sp:p.range(1.6,3.2),ph:p()*6.28,ax:new o.Vector3(p.range(-1,1),p.range(-1,1),p.range(-1,1)).normalize()});x.shadowY==="serac"&&(x.shadowY=[pe.y+122,pe.y+300]);const Mo=x.shadowDrop==="low"?Math.max(0,x.shadowY[0]-660):x.shadowDrop||0,h=[0,0,0],Re=new o.Matrix4,ke=new o.Quaternion,Ct=new o.Quaternion,mt=new o.Quaternion,J=new o.Vector3,Pt=new o.Vector3,_t=new o.Vector3,bo=new o.Vector3(G[0]*.35-.99*.65,0,G[1]*.35+.139*.65).normalize(),So=Ut,eo=new o.Vector3,to=new o.Vector3(0,1,0);{const e=j(R,-1,0,h),n=[0,0,0];j(R,1,0,n),eo.set((e[0]+n[0])/2,(e[1]+n[1])/2,(e[2]+n[2])/2)}let Bt=0,oo=!1;await c.yield();const Ze=(e,n,a,s)=>{const i=vt[e],l=ie((n-Te)/(fe-Te)),r=ie((n-fe)/(K-fe)),t=ie((r-.05-(se-1-e)*.05)/.62),d=.5*Math.pow(l,1.5)+.55*r;if(mt.setFromAxisAngle(bo,-d),a.set(i.ox,i.y,i.oz).applyQuaternion(mt).add(pe).addScaledVector(So,8),t>0){j(R+.01,i.side,i.w,h);const v=Math.pow(t,1.15),C=a.y;a.x=g(a.x,h[0],v),a.z=g(a.z,h[2],v),a.y=C-(C-h[1]-6)*t*t}return s&&(s.setFromAxisAngle(to,i.yaw+.55).premultiply(mt),t>0&&s.premultiply(Ct.setFromAxisAngle(i.ax,t*t*i.spin))),t},no=e=>g(150,170,m(.9,1.12,e))+100*Math.exp(-Math.pow((e-1.03)/.07,2)),Ft=(e,n)=>128-64*n+.85*(no(e)-150),Wt=e=>.016*Math.sin(e*8.3+1.3)+.01*Math.sin(e*19+4);function ao(e,n){y.uShadowY.value=g(x.shadowY[0],x.shadowY[1],e)-Mo*Math.exp(-e/.045),y.uTime.value=n;const a=Ie(e),s=Ie(e-.05),i=m(K,K+.03,e),l=m(K+.05,K+.08,e);for(let r=0;r<ho;r++){const t=je[r];let d=0,v=-9999,C=0,b=0,S=0,f=0,A=1;if(t.kind===2){const w=(e-(K-.008))/.1;w>0&&w<1&&(j(R+.035*w*(1+t.w),t.side,t.w*.8,h),b=t.smax*m(0,.22,w)*(1-m(.62,1,w)),d=h[0],C=h[2],f=h[1],A=200,v=h[1]+b*.3+t.hf*150*(1-(1-w)*(1-w)),S=n*.7+t.seed)}else{const w=(t.ph+n*t.rate)%1,L=t.side===2?s:a,ee=t.side===2?l:i,N=Ce(L),O=no(L),$e=L-.065*N*t.w*t.w+Wt(t.w)*N,We=Math.min(L,1.035)-.004,Ge=Ft(L,N),io=.1+.9*Math.sqrt(Math.max(0,1-t.w*t.w));let me=0;if(ee>0)if(t.kind===0){const we=m(0,.55,w),co=ie((w-.3)/.7),wt=$e-(4+18*we+g(92,170,N)*Math.pow(co,1.3))/gt;wt>R-.012&&(j(wt,t.side,t.w,h),b=t.smax*m(0,.1,w)*(1-m(.82,1,w))*g(2,1,N)*ee*m(R-.012,R+.03,wt),me=O*t.hf*(1-.4*Math.pow(Math.abs(t.w),4))*.9*Math.pow(we,.75)*(1-.3*co),me=g(Ge*_e((We-wt)/.31)*io*(.8+.2*we)+b*(.1+.25*t.hf),me,N),d=h[0]+X.x*me*(1-N),C=h[2]+X.z*me*(1-N),f=h[1],A=O,v=h[1]+b*.25*N+me*g(X.y,1,N),S=n*(.4+t.rate*5)+t.seed)}else{const we=$e-.03-Math.pow(w,1.1)*(.2+.05*(1-N));we>R-.012&&(j(we,t.side,t.w,h),b=t.smax*g(.6+.85*_e((We-we)/.31),1,N)*m(0,.15,w)*(1-m(.7,1,w))*ee*m(R-.012,R+.03,we),me=g(Math.min(O*.72,Ge*_e((We-we)/.31)*io)+b*.2+w*t.hf*30,O*.72+w*t.hf*70,N),d=h[0]+X.x*me*(1-N),C=h[2]+X.z*me*(1-N),f=h[1],A=O*1.6,v=h[1]+me*g(X.y,1,N),S=n*(.3+t.rate*5)+t.seed)}}const F=r<nt?at:rt,k=r<nt?r:r-nt;F.P.setXYZW(k,d,v,C,b),F.R.setXYZW(k,S,t.seed,f,A)}at.P.needsUpdate=at.R.needsUpdate=rt.P.needsUpdate=rt.R.needsUpdate=!0;for(let r=0;r<Oe;r++){const t=ve[r],d=t===2?s:a,v=t===2?l:i,C=Ce(d),b=Math.min(d,1.035)-.004,S=Ft(d,C);for(let f=0;f<Se;f++){const A=f/(Se-1),F=b-A*.31,k=v*m(R-.012,R+.05,F),w=S*_e(A)*k,L=S*k*(_e(A+.02)-_e(A-.02))/(.04*.31*gt);j(F,t,-.98,ae),j(F,t,.98,re),j(F-.01,t,0,lt),Kt.set(re[0]-ae[0],re[1]-ae[1],re[2]-ae[2]).normalize(),Xt.set(lt[0]-(ae[0]+re[0])*.5,lt[1]-(ae[1]+re[1])*.5,lt[2]-(ae[2]+re[2])*.5).normalize();for(let ee=0;ee<ne;ee++){const N=ee/(ne-1)*2-1,O=((r*Se+f)*ne+ee)*3,$e=Math.sqrt(Math.max(0,1-N*N)),We=w*(.1+.9*$e)-7*N*N-(w<1?8:0),Ge=(N+1)*.5;st[O]=g(ae[0],re[0],Ge)+X.x*We,st[O+1]=g(ae[1],re[1],Ge)+X.y*We,st[O+2]=g(ae[2],re[2],Ge)+X.z*We,ut.copy(X).multiplyScalar(1.05-N*N).addScaledVector(Kt,N*1.1).addScaledVector(Xt,-L).normalize(),it[O]=ut.x,it[O+1]=ut.y,it[O+2]=ut.z,ct[O]=g(ae[1],re[1],Ge),ct[O+1]=Math.max(S,1),ct[O+2]=Math.min(1,w/60)*(.35+.65*$e)}}}xt.needsUpdate=Mt.needsUpdate=bt.needsUpdate=!0;for(let r=0;r<Ke;r++){const t=Qt[r];let d=0,v=-9999,C=0,b=0,S=0;if(r<wo){const f=(e-(Te-.004))/.14,A=r%se,F=Math.floor(r/se);if(f>0&&f<1){const k=m(fe,fe+.012,e),w=Ze(A,e,Pt,null),L=Ze(A,Math.max(fe,e-.0045*F*k),J,null);d=g(pe.x+t.w*52,J.x+t.w*9,k),v=g(pe.y+4+t.rise*22+F*26,J.y+t.rise*6,k),C=g(pe.z+(t.seed-.5)*46,J.z+(t.seed-.5)*9,k),b=g(24+30*t.seed,30+5*F+14*t.seed+26*L*L,k),S=2+g(.2*(1-.7*m(.15,.7,(e-Te)/(fe-Te))),(.8-.065*F)*m(0,.1,w)*m(.03,.2,L)*(1-.6*m(.8,1,L)),k)*m(0,.05,f)*(1-m(.72,1,f))}}else{const f=(t.ph+n*t.rate)%1,A=t.side===2?s:a,F=t.side===2?l:i,k=Ce(A),w=A-.065*k*t.w*t.w+Wt(t.w)*k,L=t.skirt?w+.008+.02*f:w-.02-f*t.L;if(F>0&&L>R){j(L,t.side,t.w,h),b=t.skirt?t.size*(.55+.5*f):t.size*(.6+.9*f)*g(1.5,1,k);const ee=t.skirt?0:(Ft(A,k)*_e(ie((Math.min(A,1.035)-.004-L)/.31))*.85+(26+34*t.rise)*(.35+.65*f))*(1-k);d=h[0]+X.x*ee,C=h[2]+X.z*ee,v=h[1]+b*.2+X.y*ee+(t.skirt?0:t.rise*g(40,62,k)*f),S=(t.skirt?.36:g(.56,.34,k))*m(0,.16,f)*(1-m(.5,1,f))*F*m(R,R+.04,L)}}Xe[r*4]=d,Xe[r*4+1]=v,Xe[r*4+2]=C,Xe[r*4+3]=b,St[r*2]=S,St[r*2+1]=t.seed}kt.needsUpdate=!0,At.needsUpdate=!0;for(let r=0;r<se;r++){const t=vt[r],d=Ze(r,e,J,ke),v=d>=.97?0:1;Re.compose(J,ke,_t.set(t.sx*v,t.sy*v,t.sz*v)),Fe.setMatrixAt(r,Re)}for(let r=0;r<ft;r++){const t=Jt[r],d=Ze(t.k,e+t.lead*m(fe-.01,fe+.01,e),J,ke),v=d>=.97?0:1;Pt.copy(t.off).multiplyScalar(1+t.fly*d).applyQuaternion(mt),J.add(Pt),J.y-=40*d*t.fly*.3,ke.multiply(Ct.setFromAxisAngle(to,t.yaw)),d>0&&ke.premultiply(Ct.setFromAxisAngle(t.ax,d*t.spin)),Re.compose(J,ke,_t.set(t.sx*v,t.sy*v,t.sz*v)),Fe.setMatrixAt(se+r,Re)}for(let r=0;r<zt;r++){const t=$t[r],d=t.side===2?e-.05:e,v=Ie(d),C=Ce(v),b=v-.065*C*t.w*t.w+Wt(t.w)*C+t.lead,S=m(K+.02,K+.06,d);j(b,t.side,t.w,h);const f=Math.abs(Math.sin(n*t.sp+t.ph));J.set(h[0],h[1]+t.size*.4+f*t.hop,h[2]),ke.setFromAxisAngle(t.ax,n*t.sp*1.3+t.ph),Re.compose(J,ke,_t.setScalar(t.size*S)),Fe.setMatrixAt(se+ft+r,Re)}Fe.instanceMatrix.needsUpdate=!0}ao(0,0);const ko=new o.Vector3(0,u,0),ht=[0,0,0],pt=[0,0,0],Ao=(e,n=new o.Vector3,a=0)=>{if(e<K)Ze(4,e,n,null);else{const s=Ie(e),i=Ce(s),l=s-.065*i*a*a-.02;j(l,-1,a,ht),j(l,1,a,pt),n.set((ht[0]+pt[0])/2,(ht[1]+pt[1])/2+50,(ht[2]+pt[2])/2)}return n.add(V.position)},ro=new o.Vector3,so=new o.Vector3;return j(1,1,0,h),ro.set(h[0],h[1],h[2]),j(yt-.05,1,0,h),so.set(h[0],h[1],h[2]),{object:V,radius:1100,height:u,center:new o.Vector3(-250,760,300),ground:!0,groundY:0,anchors:{summit:ko,seracBand:pe.clone(),burst:eo.clone(),foot:ro,runout:so,bannerDir:Ee.clone(),faceNormal:new o.Vector3(W[0],0,W[1]),faceLateral:new o.Vector3(G[0],0,G[1])},uniforms:y,heightAt:(e,n)=>D(e,n),frontD:Ie,frontAt:Ao,timing:{crack:Te,fall:fe,hit:K,foot:qe},seracY:[pe.y,pe.y+Dt],setU(e){oo=!0,Bt=e},update(e,n){oo||(Bt=n*.03%1),ao(Bt,n)},dispose(){he.dispose()}}}export{Ae as HORN,_o as HORN_NOISE_GLSL,Bo as buildHero,uo as couloirT,zo as makeHornHeight};
