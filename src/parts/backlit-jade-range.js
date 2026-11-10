import*as n from"three";import{clamp as O,lerp as se,smoothstep as M}from"../kit/core.js";const lt=["#EEF5E4","#8FCB86","#3F8F5A","#0B2318","#D9DCCB","#A4522A","#C8372C"],z=3300,_=-160,k=360,P=100,E=160,Y=40,Xe=1.5;async function ut(y,x={}){const i=y.rng.fork?y.rng.fork("lit-wall"):y.rng,F=y.noise,C=(x.palette&&x.palette.length>=7?x.palette:lt).map(e=>new n.Color(e)),J=x.hour||"day",le=J==="night",ye=J==="sunrise"||J==="golden"||J==="dawn",Se=x.weather==="gale",S=x.mirror?-1:1,q=i.range(-500,500),Q=i.range(-500,500),ce=-1150+i.range(-90,90),Me=[{x:ce,h:i.range(820,920),w:i.range(250,310),p:1.1},{x:i.range(-80,320),h:i.range(480,620),w:i.range(320,430),p:1.4},{x:i.range(820,1080),h:i.range(330,470),w:i.range(250,340),p:1.3},{x:i.range(-620,-380),h:i.range(160,300),w:i.range(120,180),p:1.2},{x:i.range(430,640),h:i.range(120,260),w:i.range(100,160),p:1.2}],Ie=i.range(8e-5,14e-5),$e=i.range(60,130),ue=i.range(52,66),Ze=ue*i.range(.38,.46),ke=[],Ae=[];for(let e=-1500+i.range(0,150);e<1500;e+=i.range(300,520))ke.push({x:e,w:i.range(90,230),s:i.range(.35,1.2),top:i.range(900,1750),lean:i.range(-.12,.12)});for(let e=-1400+i.range(0,200);e<1500;e+=i.range(380,620))Ae.push({x:e,w:i.range(140,220),s:i.range(.5,1),top:i.range(1100,1700),lean:i.range(-.08,.08)});const je=(e,t,o)=>{let a=0;for(const r of e){const s=1-Math.abs(t-r.x-r.lean*(r.top-o))/(r.w*(.55+.45*M(r.top,0,o)));s>0&&(a=Math.max(a,r.s*s*s*(3-2*s)*Math.pow(M(r.top,-150,o),1.2)))}return a},fe=e=>M(1650,1130,Math.abs(e)),X=e=>Ie*e*e+$e*1.7*F.n2(e/950+q,7.7)+38*F.n2(e/310+Q,2.2)-60,Fe=e=>{let t=1620+90*F.n2(e/760+q,1.3);for(const o of Me)t+=o.h*Math.exp(-1.7*Math.pow(Math.abs(e-o.x)/o.w,o.p));return t+=110*F.ridged2(e/170+q,4.1,3)-50+12*F.n2(e/23+q,9.2),t};let ve=0;for(let e=0;e<=200;e++)ve=Math.max(ve,Fe(-1650+e*16.5));const Ye=2500-ve,me=e=>{const t=fe(e);return 240+(Fe(e)+Ye-240)*Math.pow(t,.75)},ee=(e,t)=>{const o=1-Math.abs(Math.sin(Math.PI*e/t));return o*o*o},Je=(e,t,o)=>{const a=Math.max(0,o-t),r=fe(e),s=O(.95+.6*F.n2(e/430+q,t/900+3.1),.5,1.5),v=(9+.066*Math.min(a,1e3))*s,u=e+22*F.n2(e/190+Q,a/420)+a*.03*Math.sin(e/260),l=M(0,50,a)*(1-M(850,1500,a)),f=(ee(u,ue)*(12+.07*Math.min(a,800))+ee(u+13,Ze)*(2+.008*Math.min(a,600)))*l,h=je(ke,e,t),c=M(1650,-150,t),d=h*560+40*M(60,800,a)*ee(e+.05*a,410),m=520*Math.pow(c,1.5)*M(0,500,a),g=F.fbm2(e/95+q,t/95+Q,3)*(2+34*c)+F.ridged2(e/230+Q,t/310,2)*70*c*c;return Math.max(1.5,v+f+d+m+g)*(.3+.7*r)},et=(e,t,o)=>{const a=Math.max(0,o-t),r=fe(e),s=O(.95+.6*F.n2(e/430+q,t/900+3.1),.5,1.5),v=(6+.06*Math.min(a,1e3))*s,u=M(0,50,a)*(1-M(850,1500,a)),l=ee(e*1.07+31+a*.02,ue*1.2)*(5+.02*Math.min(a,800))*u,f=je(Ae,e,t)*420,h=540*Math.pow(M(1650,-150,t),1.5)*M(0,500,a),c=F.fbm2(e/120+Q,t/120+q,2)*(2+26*M(600,1700,a));return Math.max(1.5,v+l+f+h+c)*(.3+.7*r)},p=k+1,W=P+1,T=new Float32Array(p),I=new Float32Array(p),D=new Float32Array(p*W),G=new Float32Array(p*W),he=e=>1-Math.pow(1-e,Xe);for(let e=0;e<p;e++){const t=-z/2+z*e/k;T[e]=me(t),I[e]=X(t)}for(let e=0;e<p;e++){const t=-z/2+z*e/k,o=T[e],a=e===0||e===k?0:1;for(let r=0;r<W;r++){const s=_+(o-_)*he(r/P),v=r*p+e,u=r===P?0:1;D[v]=I[e]+Je(t,s,o)*u*a-(1-u)*3,G[v]=I[e]-et(t,s,o)*u*a-(1-u)*3}(e&15)===15&&await y.yield()}const Te=n.MathUtils.degToRad(x.sunElevation??(ye?6:le?30:24)),Be=n.MathUtils.degToRad(x.sunAzimuth??0),ze=e=>new n.Vector3(Math.sin(Be)*Math.cos(e),Math.sin(e),-Math.cos(Be)*Math.cos(e)).normalize(),V=ze(Te),de=ze(Te+n.MathUtils.degToRad(2)),Pe=(e,t,o)=>{const a=O((e+z/2)/z*k,0,k-.001),r=a|0,s=a-r,v=T[r]+(T[r+1]-T[r])*s;if(t>=v)return v-t;const u=O((t-_)/(v-_),0,1),l=Math.min((1-Math.pow(1-u,1/Xe))*P,P-.001),f=l|0,h=l-f,c=f*p+r,d=(1-s)*(1-h),m=s*(1-h),g=(1-s)*h,ie=s*h,be=D[c]*d+D[c+1]*m+D[c+p]*g+D[c+p+1]*ie,L=G[c]*d+G[c+1]*m+G[c+p]*g+G[c+p+1]*ie;return Math.min(be-o,o-L,(v-t)*.9)},pe=(e,t,o,a,r)=>{let s=0,v=0,u=Pe(e,t,o);for(let l=0;l<44;l++){const f=Math.max(1.5,Math.abs(u)*.7,u<0?v*.14:0),h=v+f,c=t+a.y*h*r,d=Pe(e+a.x*h*r,c,o+a.z*h*r);if(u>0&&d>0?s+=f:u>0?s+=f*u/(u-d):d>0&&(s+=f*d/(d-u)),u=d,v=h,h>2400||c>2560||c<_||s>1100)break}return s},we=p*W,K=E+1,Ce=Y+1,tt=K*Ce,Ge=we+tt,U=new Float32Array(Ge*3),b=new Float32Array(Ge*4);for(let e=0;e<W;e++){for(let t=0;t<p;t++){const o=e*p+t,a=-z/2+z*t/k,r=_+(T[t]-_)*he(e/P),s=D[o];U[o*3]=a*S,U[o*3+1]=r,U[o*3+2]=s,b[o*4]=pe(a,r,s-.5,V,1),b[o*4+1]=b[o*4]>800?b[o*4]:pe(a,r,s-.5,de,1);let v=0,u=0;for(let f=-10;f<=10;f+=2){const h=O(t+f,0,k);v+=D[e*p+h]-I[h],u++}v/=u;const l=O((v-(s-I[t]))/(10+.02*(T[t]-r)),0,1);b[o*4+2]=1-.62*l,b[o*4+3]=T[t]-r}await y.yield()}for(let e=0;e<W;e++)for(let t=0;t<2;t++)b[e*p*4+t]=b[(e*p+3)*4+t],b[(e*p+k)*4+t]=b[(e*p+k-3)*4+t];for(let e=0;e<Ce;e++){for(let t=0;t<K;t++){const o=we+e*K+t,a=t/E*k,r=e/Y*P,s=Math.min(a|0,k-1),v=a-s,u=Math.min(r|0,P-1),l=r-u,f=-z/2+z*t/E,h=se(T[s],T[s+1],v),c=_+(h-_)*he(e/Y),d=u*p+s,m=se(se(G[d],G[d+1],v),se(G[d+p],G[d+p+1],v),l);U[o*3]=f*S,U[o*3+1]=c,U[o*3+2]=m;const g=pe(f,c,m+.5,V,-1);b[o*4]=t===0||t===E?900:g,b[o*4+1]=b[o*4],b[o*4+2]=.75+.25*M(900,100,h-c),b[o*4+3]=h-c}(e&3)===3&&await y.yield()}await y.yield();const A=new Uint32Array((k*P+E*Y)*6);let j=0;const Le=(e,t,o,a,r)=>{r?(A[j++]=e,A[j++]=o,A[j++]=t,A[j++]=t,A[j++]=o,A[j++]=a):(A[j++]=e,A[j++]=t,A[j++]=o,A[j++]=t,A[j++]=a,A[j++]=o)};for(let e=0;e<P;e++)for(let t=0;t<k;t++){const o=e*p+t;Le(o,o+1,o+p,o+p+1,S<0)}for(let e=0;e<Y;e++)for(let t=0;t<E;t++){const o=we+e*K+t;Le(o,o+1,o+K,o+K+1,S>0)}const N=new n.BufferGeometry;N.setAttribute("position",new n.BufferAttribute(U,3)),N.setAttribute("aData",new n.BufferAttribute(b,4)),N.setIndex(new n.BufferAttribute(A,1)),await y.yield(),N.computeVertexNormals(),await y.yield(),N.computeBoundingSphere(),await y.yield(),N.computeBoundingBox(),await y.yield();const ot=new n.Vector3(...[C[1].r,C[1].g,C[1].b].map(e=>-90/Math.log(O(e,.03,.9)))),nt=le?new n.Color(.42,.56,.8):ye?new n.Color(2.3,1.55,.62):new n.Color(1.72,1.72,1.6),at=le?new n.Color(.02,.035,.07):x.season==="autumn"?new n.Color(.2,.3,.34):new n.Color(.075,.24,.3),w={uSunA:{value:V.clone()},uSunB:{value:de.clone()},uProg:{value:0},uTime:{value:0},uFogK:{value:1},uLift:{value:0},uSkS:{value:-1e5},uSkSp:{value:1},uSkMin:{value:4},uMfp:{value:ot},uSunCol:{value:nt},uSkyCol:{value:at},uPale:{value:C[0]},uApple:{value:C[1]},uCloud:{value:C[4]},uDeep:{value:C[2]},uDark:{value:C[3]},uMirror:{value:S}},te=`
    float jh(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
    float jn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
      return mix(mix(mix(jh(i), jh(i + vec3(1,0,0)), f.x), mix(jh(i + vec3(0,1,0)), jh(i + vec3(1,1,0)), f.x), f.y),
                 mix(mix(jh(i + vec3(0,0,1)), jh(i + vec3(1,0,1)), f.x), mix(jh(i + vec3(0,1,1)), jh(i + vec3(1,1,1)), f.x), f.y), f.z); }`,Oe=new n.ShaderMaterial({fog:!0,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{}]),vertexShader:`
      attribute vec4 aData;
      uniform vec3 uSunA, uSunB; uniform float uProg, uFogK, uMirror;
      varying vec3 vObj, vNw, vWorld, vSunW, vFrontW, vXw; varying vec4 vData;
      #include <fog_pars_vertex>
      void main(){
        vObj = position; vData = aData;
        vec4 wp = modelMatrix * vec4(position, 1.); vWorld = wp.xyz;
        vNw = mat3(modelMatrix) * normal;
        vec3 s = mix(uSunA, uSunB, uProg); s.x *= uMirror;
        vSunW = normalize(mat3(modelMatrix) * s);
        vFrontW = normalize(mat3(modelMatrix) * vec3(0., 0.55, 0.83));
        vXw = normalize(mat3(modelMatrix) * vec3(1., 0., 0.));
        vec4 mvPosition = viewMatrix * wp;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
        #ifdef USE_FOG
          vFogDepth *= uFogK;
        #endif
      }`,fragmentShader:`
      uniform vec3 uMfp, uSunCol, uSkyCol, uPale, uApple, uDeep, uDark; uniform float uProg, uTime, uLift;
      varying vec3 vObj, vNw, vWorld, vSunW, vFrontW, vXw; varying vec4 vData;
      #include <fog_pars_fragment>
      ${te}
      // carved facets, fixed in the stone: x = distance to the nearest edge between two facets, yzw = the facet's random triple,
      // dir = from the facet's middle toward this point (the way its bevelled edge leans)
      vec4 facet(vec3 p, out vec3 dir){
        vec3 i = floor(p), f = fract(p), id = vec3(.5), rb = vec3(0., 1., 0.); float d1 = 8., d2 = 8.;
        for (int z = -1; z <= 1; z++) for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
          vec3 g = vec3(float(x), float(y), float(z)); float h = jh(i + g + 3.7);
          vec3 o = fract(h * vec3(1., 57.31, 193.7) + vec3(0., .31, .67));
          vec3 r = g + .1 + .8 * o - f; float q = dot(r, r);
          if (q < d1) { d2 = d1; d1 = q; id = o; rb = r; } else if (q < d2) d2 = q;
        }
        dir = -rb * inversesqrt(max(d1, 1e-6));
        return vec4(sqrt(d2) - sqrt(d1), id);
      }
      void main(){
        vec3 N = vNw * inversesqrt(max(dot(vNw, vNw), 1e-8));
        vec3 toCam = cameraPosition - vWorld;
        float dist = max(length(toCam), 1e-3);
        vec3 V = toCam / dist;
        vec3 S = normalize(vSunW + vec3(0., 1e-5, 0.));
        float px = max(length(fwidth(vObj)), 1e-3);              // metres per pixel, taken once, outside any loop
        float depth = vData.w, ao = vData.z;

        // ---- veins and inclusions, fixed in the stone
        vec3 q = vObj * vec3(1., .6, 1.);
        vec3 wq = q + 90. * vec3(jn(q / 310. + 4.), jn(q / 310. + 19.), jn(q / 310. + 31.));
        float f1 = 1. - smoothstep(60., 120., px), f2 = 1. - smoothstep(14., 28., px), f3 = 1. - smoothstep(2.2, 4.5, px);
        float n1 = jn(wq / 240.), n2 = jn(wq / 58. + 7.3), n3 = jn(wq / vec3(9., 30., 9.) + 3.1);
        float vein = smoothstep(.56, .86, n1) * f1 * .7 + smoothstep(.6, .9, n2) * f2 * .45 + (1. - smoothstep(0., .07, abs(n2 - .47))) * f2 * .3;
        float moss = smoothstep(.56, .8, jn(wq / 130. + 11.)) * f1 + smoothstep(.62, .85, n3) * f3 * .5;
        float k = 1. + .3 * ((n1 * 2. - 1.) * f1 * .7 + (n2 * 2. - 1.) * f2 * .5) + .55 * moss - .32 * vein;
        // ---- the carver's planes: standing facets in two sizes (95 x 210 m and 30 x 64 m), each with its own tilt and a little
        // more or less stone behind it, and a narrow bevel whose upper side carries a thin line of light: the flanks break into
        // crisp planes instead of soft mottling. Weaker in the fluted fin, where the ribs are the form; each size gives way to
        // its mean before its bevel is under two pixels.
        float lowK = mix(.35, 1., smoothstep(120., 650., depth));
        float fA = (1. - smoothstep(18., 40., px)) * lowK, fB = (1. - smoothstep(5.5, 12., px)) * lowK;
        vec3 fq = vObj + 24. * (vec3(jn(vObj / 170. + 5.), jn(vObj / 170. + 17.), jn(vObj / 170. + 29.)) - .5), dA, dB;
        vec4 FA = facet(fq / vec3(95., 210., 95.) + 3.3, dA), FB = facet(fq / vec3(30., 64., 30.) + 11.7, dB);
        float wA = max(.1, 2.4 * px / 95.), wB = max(.12, 2.4 * px / 30.);
        float bA = (1. - smoothstep(0., wA, FA.x)) * fA, bB = (1. - smoothstep(0., wB, FB.x)) * fB;
        dA = normalize(dA * vec3(1., .45, 1.)); dB = normalize(dB * vec3(1., .47, 1.));
        float eF = max(bA * bA * max(dA.y, 0.), bB * bB * max(dB.y, 0.) * .6), crease = max(bA * bA * max(-dA.y, 0.), bB * bB * max(-dB.y, 0.) * .6);
        k *= mix(1., .82 + .4 * FA.y, .8 * fA) * mix(1., .9 + .22 * FB.z, fB);
        vec3 tiltF = (FA.yzw - .5) * vec3(1., .4, 1.) * (.4 * fA) + (FB.yzw - .5) * vec3(1., .4, 1.) * (.26 * fB) + dA * (bA * .5) + dB * (bB * .35);

        // ---- carver's tool marks: fine striations along the fall line, bending the normal when near
        float fs = 1. - smoothstep(.35, .8, px);
        float dtool = cos(vObj.x * 3.1 + 2.5 * jn(vObj * vec3(.2, .05, .2))) * 1.55 + cos(vObj.x * .82 + vObj.y * .11) * .41;
        vec3 Nb = N - vXw * (dtool * .05 * fs) + tiltF;
        N = Nb * inversesqrt(max(dot(Nb, Nb), 1e-8));

        // ---- transmitted light: Beer-Lambert through the baked thickness
        // uLift (the world raises it while the wall is only a horn seen above the gorge's notch): the stone reads thinner and
        // the forward phase is filled in, so what shows above the notch burns white-celadon
        float L = max(mix(vData.x, vData.y, uProg), 0.) * k * (1. - .93 * uLift);
        // the ladder, on the palette: under 15 m white-celadon (blooms), to 120 m apple, to 400 m deep, then black-green
        vec3 T = mix(uPale * 1.02, uApple * .74, smoothstep(7., 52., L));
        T = mix(T, uDeep * .5, smoothstep(90., 400., L));
        T = mix(T, uDark * .5, smoothstep(330., 950., L));
        float c = dot(-V, S);                                    // 1 when we look straight at the sun through the rock
        float fwd = clamp(c * .5 + .5, 0., 1.);
        float phase = mix(.35 + .65 * fwd * fwd * fwd, .95, uLift);
        // cirrus veils crossing the sun dim the wall in slow sliding bands
        float cir = jn(vec3(vObj.x * .0011 - uTime * .036, vObj.y * .00045 + uTime * .004, 2.7));
        float veil = 1. - .34 * smoothstep(.42, .72, cir);
        vec3 trans = min(uSunCol * T * phase * veil, vec3(1.6));
        // milky inclusions scatter a little light of their own where the stone is not too thick
        trans += uPale * vein * .16 * exp(-L / 260.) * veil;
        // the hidden sun: a white-hot bloom where the view ray meets it, coloured by the rock in between
        float cs = max(c, 1e-4);
        float hot = pow(cs, 1400.) * 7. + pow(cs, 160.) * .8 + pow(cs, 24.) * .1;
        vec3 bloomT = exp(-L / (uMfp * 2.6));
        vec3 col = trans * mix(1., ao, .6) + uSunCol * bloomT * hot * veil;

        // ---- surface: black-green floor, sky fill, one broad waxy highlight
        float hemi = N.y * .5 + .5;
        col += (uDark * (.9 + 1.5 * hemi) * (1. + .5 * vein) + uSkyCol * .05 * hemi * hemi) * ao;
        vec3 Ls = normalize(vFrontW + vec3(0., 1e-5, 0.));
        vec3 Hh = Ls + V; Hh *= inversesqrt(max(dot(Hh, Hh), 1e-6));
        float nh = max(dot(N, Hh), 0.), a2 = .55 * .55 * .55 * .55;
        float dd = nh * nh * (a2 - 1.) + 1.;
        float ggx = a2 / (3.14159 * dd * dd);
        float fres = .04 + .96 * pow(clamp(1. - dot(V, Hh), 0., 1.), 5.);
        col += mix(uSkyCol, vec3(dot(uSkyCol, vec3(.4))), .5) * ggx * fres * max(dot(N, Ls), 0.) * ao * 3.5;
        // the sunward face (never seen from the flight, seen from the orbit): plain waxy diffuse
        float lit = max(dot(N, S), 0.);
        col += mix(uDeep, uPale, .12 + .16 * vein) * uSunCol * lit * (.3 - .1 * moss) * (.5 + .5 * ao);
        // a thin bright rim where the surface turns away from us toward the light
        float rim = pow(clamp(1. - dot(N, V), 0., 1.), 4.) * smoothstep(-.2, .5, c);
        col += uSunCol * T * rim * .35;
        // the edge between two facets is thin stone: a line of light; the cut beside it lies in shade
        col *= 1. - .22 * crease;
        col += uSunCol * mix(T, uApple, .5) * eF * (.05 + .16 * fwd * fwd) * veil * mix(.6, 1., ao);

        gl_FragColor = vec4(col, 1.);
        #include <fog_fragment>
      }`});Object.assign(Oe.uniforms,w);const _e=new n.Mesh(N,Oe);_e.name="lit-wall";const H=new n.Group;H.name="backlit-jade-range-hero",H.add(_e);const ge=e=>new n.Vector3(e*S,me(e),X(e)-3),qe=[];for(let e=0;e<=24;e++)qe.push(ge(1500-e*125));const De=e=>{let t=e,o=0;for(let a=e-160;a<=e+160;a+=4){const r=me(a);r>o&&(o=r,t=a)}return ge(t)},Ve=Me.slice(0,5).map(e=>De(e.x)).sort((e,t)=>t.y-e.y),oe=De(ce),Ue=(x.wind?new n.Vector3().copy(x.wind):new n.Vector3(-.8*S,.2,-.56)).normalize(),Ne=[];let $=null;if(x.plumes!==!1){const e=[];for(const m of Ve)e.push({p:m,len:i.range(520,780),w:i.range(120,180),a:1});const t=Math.round(18*(y.quality?.detail??1));for(let m=0;m<t;m++){const g=i.range(-1300,1300);e.push({p:ge(g),len:i.range(170,400),w:i.range(50,95),a:i.range(.6,.95)})}const o=28,a=(o+1)*2,r=e.length,s=new Float32Array(r*a*3),v=new Float32Array(r*a*4),u=new Float32Array(r*a*3),l=new Uint16Array(r*o*6);let f=0,h=0;e.forEach((m,g)=>{m.a===1&&Ne.push(m.p.clone());const ie=m.len*(Se?2:1),be=i.range(0,100);for(let L=0;L<=o;L++)for(let B=-1;B<=1;B+=2)s[f*3]=m.p.x,s[f*3+1]=m.p.y-6,s[f*3+2]=m.p.z,v[f*4]=L/o,v[f*4+1]=B,v[f*4+2]=ie,v[f*4+3]=m.w,u[f*3]=be,u[f*3+1]=m.a*(Se?1.25:1),u[f*3+2]=g,f++;for(let L=0;L<o;L++){const B=g*a+L*2;l[h++]=B,l[h++]=B+2,l[h++]=B+1,l[h++]=B+1,l[h++]=B+2,l[h++]=B+3}});const c=new n.BufferGeometry;c.setAttribute("position",new n.BufferAttribute(s,3)),c.setAttribute("aP",new n.BufferAttribute(v,4)),c.setAttribute("aQ",new n.BufferAttribute(u,3)),c.setIndex(new n.BufferAttribute(l,1)),c.boundingSphere=new n.Sphere(new n.Vector3(0,2e3,0),3200);const d=new n.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:n.DoubleSide,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{}]),vertexShader:`
        attribute vec4 aP; attribute vec3 aQ;
        uniform vec3 uWind; uniform float uTime, uFogK;
        varying vec2 vUv; varying vec3 vQ; varying float vLen, vFwd;
        #include <fog_pars_vertex>
        void main(){
          float t = aP.x, len = aP.z;
          vec3 p = position + uWind * (len * t);
          // the plume lifts and snakes as it leaves the crest
          p.y += len * .1 * t * t + sin(t * 5. - uTime * .55 + aQ.x) * len * .035 * t;
          p.z += cos(t * 3.7 - uTime * .4 + aQ.x * 1.7) * len * .03 * t;
          vec4 wp = modelMatrix * vec4(p, 1.);
          vec3 dirW = normalize(mat3(modelMatrix) * uWind);
          vec3 view = cameraPosition - wp.xyz;
          vec3 side = cross(dirW, view) + vec3(0., 1e-4, 0.);
          side *= inversesqrt(max(dot(side, side), 1e-8));
          float w = aP.w * (.1 + .9 * sqrt(t + .002)) * (1. + .15 * sin(uTime * .3 + aQ.x + t * 4.));
          wp.xyz += side * w * aP.y;
          vUv = vec2(t, aP.y); vQ = aQ; vLen = len;
          vFwd = dot(normalize(-view + vec3(0., 1e-4, 0.)), dirW);
          vec4 mvPosition = viewMatrix * wp;
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
          #ifdef USE_FOG
            vFogDepth *= uFogK;
          #endif
        }`,fragmentShader:`
        uniform vec3 uSunCol, uPale; uniform float uTime, uLift;
        varying vec2 vUv; varying vec3 vQ; varying float vLen, vFwd;
        #include <fog_pars_fragment>
        ${te}
        void main(){
          float t = vUv.x, e = vUv.y;
          vec3 q = vec3(t * vLen / 85. - uTime * .33, e * 1.6 + vQ.x, vQ.x * 3. + uTime * .05);
          float n = jn(q) * .6 + jn(q * 2.3 + 5.) * .28 + jn(q * 5.1 + 9.) * .12;
          float edge = 1. - e * e; edge *= edge;
          float a = edge * smoothstep(0., .05, t) * pow(max(1. - t, 0.), .8) * (1. - t * .4) * smoothstep(.16, .64, n + .3 * (1. - t)) * vQ.y;
          // lit from behind: brightest where thin and near the crest, never far above 1 so only its core blooms
          vec3 col = mix(uPale * 1.05, uSunCol * .92, smoothstep(.3, .9, n) * (1. - t * .5)) * (1. + .5 * uLift);   // lit from behind: as bright as the crest it leaves
          gl_FragColor = vec4(col, clamp(a * .9, 0., 1.));
          #include <fog_fragment>
        }`});Object.assign(d.uniforms,{uWind:{value:Ue},uTime:w.uTime,uFogK:w.uFogK,uSunCol:w.uSunCol,uPale:w.uPale,uLift:w.uLift}),$=new n.Mesh(c,d),$.name="spindrift",$.renderOrder=2,$.frustumCulled=!1,H.add($)}const ne=X(0),xe=x.skeinLine?.from?new n.Vector3().copy(x.skeinLine.from):new n.Vector3(1250*S,i.range(520,700),ne+i.range(900,1300)),He=x.skeinLine?.to?new n.Vector3().copy(x.skeinLine.to):new n.Vector3(-1450*S,xe.y+i.range(160,320),ne+i.range(700,1e3));let R=null;const We=new n.Vector2;if(x.skein!==!1){const t=i.int(4,5),o=new Float32Array(165),a=new Float32Array(220),r=new Uint16Array(99),s=[[0,0,.3],[0,0,-.42],[-.78,0,-.1],[.78,0,-.1],[0,.02,.75]];for(let l=0;l<11;l++){const f=Math.abs(l-t),h=l<t?-1:1,c=f*3+(f?i.range(-.9,.9):0),d=h*f*1.3+(f?i.range(-.55,.55):0);for(let m=0;m<5;m++){const g=l*5+m;o.set(s[m],g*3),a[g*4]=c,a[g*4+1]=d,a[g*4+2]=f*.2+i.range(-.03,.03),a[g*4+3]=m}r.set([l*5,l*5+1,l*5+2,l*5,l*5+3,l*5+1,l*5+2,l*5+4,l*5+3],l*9)}const v=new n.BufferGeometry;v.setAttribute("position",new n.BufferAttribute(o,3)),v.setAttribute("aG",new n.BufferAttribute(a,4)),v.setIndex(new n.BufferAttribute(r,1));const u=new n.ShaderMaterial({fog:!0,side:n.DoubleSide,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{}]),vertexShader:`
        attribute vec4 aG;
        uniform vec3 uFrom, uTo; uniform float uTime, uVH, uFogK, uSkS, uSkSp, uSkMin;
        varying float vGlow, vTip;
        #include <fog_pars_vertex>
        void main(){
          vec3 line = uTo - uFrom; float len = max(length(line), 1.); vec3 dir = line / len;
          vec3 right = cross(dir, vec3(0., 1., 0.)) + vec3(1e-5, 0., 0.); right *= inversesqrt(max(dot(right, right), 1e-8));
          vec3 up = cross(right, dir);
          vec3 c0 = uFrom + dir * (uSkS > -9000. ? uSkS : len * .5);
          vec4 q0 = projectionMatrix * viewMatrix * modelMatrix * vec4(c0, 1.);
          float k0 = max(1., uSkMin / max(1.56 * projectionMatrix[1][1] * uVH * .5 / max(q0.w, 1e-3), 1e-5));
          float sp = max(uSkSp, k0 * .5);                   // the V opens with the size the birds are drawn at
          float back = aG.x * sp;
          float s = fract(uTime * 18. / (len + 400.) + .35) * (len + 400.) - 200. - back;   // 18 m/s, wraps past both ends
          if (uSkS > -9000.) s = uSkS - back;                                               // or the world keys the lead's place to the flight
          float show = smoothstep(-30., 60., s) * (1. - smoothstep(len - 60., len + 30., s));
          // the line snakes: each bird repeats the leader's weave a little later
          float wv = sin(uTime * .45 - aG.x * .035) * 5. + sin(uTime * .21 - aG.x * .011) * 9.;
          vec3 c = uFrom + dir * s + right * (aG.y * sp + wv) + up * (aG.y * sp * 1.5 + (sin(uTime * .33 - aG.x * .03) * 3. + sin(uTime * .19 - aG.x * .012) * 4.) * min(sp, 3.));
          // wings never glide: 2.8 beats a second, each bird a fifth of a beat behind the one ahead
          float ph = 6.2832 * (uTime * 2.8 - aG.z);
          float isTip = step(1.5, aG.w) * step(aG.w, 3.5);
          vec3 l = position; l.y += isTip * sin(ph) * .52; l.x *= 1. - isTip * .18 * (1. - cos(ph));
          vec4 cc = projectionMatrix * viewMatrix * modelMatrix * vec4(c, 1.);
          float pxPerM = projectionMatrix[1][1] * uVH * .5 / max(cc.w, 1e-3);
          float k = max(1., uSkMin / max(1.56 * pxPerM, 1e-5)) * show;
          vec3 p = c + (right * l.x + up * l.y + dir * l.z) * k;
          vGlow = .5 + .5 * sin(ph + 1.9);            // brightest on the downbeat, a wave down the line
          vTip = isTip;
          vec4 mvPosition = viewMatrix * modelMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
          #ifdef USE_FOG
            vFogDepth *= uFogK;
          #endif
        }`,fragmentShader:`
        uniform vec3 uPale, uRind;
        varying float vGlow, vTip;
        #include <fog_pars_fragment>
        void main(){
          vec3 col = uPale * (.5 + .55 * vGlow * vGlow);
          col = mix(col, uRind * .12, smoothstep(.8, 1., vTip));     // dark primaries at the wingtips
          gl_FragColor = vec4(col, 1.);
          #include <fog_fragment>
        }`});Object.assign(u.uniforms,{uFrom:{value:xe},uTo:{value:He},uTime:w.uTime,uVH:{value:900},uFogK:w.uFogK,uSkS:w.uSkS,uSkSp:w.uSkSp,uSkMin:w.uSkMin,uPale:w.uPale,uRind:{value:C[5]}}),R=new n.Mesh(v,u),R.name="far-skein",R.frustumCulled=!1,H.add(R)}let ae=null;if(x.cloudApron!==!1){const a=x.cloudY??60,r=new Float32Array(3936*3),s=new Uint16Array(3840*6);let v=0,u=0;for(let c=0;c<=40;c++)for(let d=0;d<96;d++){const m=5200*Math.pow(c/40,1.5),g=d/96*Math.PI*2;r[v++]=Math.sin(g)*m,r[v++]=a,r[v++]=Math.cos(g)*m+300}for(let c=0;c<40;c++)for(let d=0;d<96;d++){const m=c*96+d,g=c*96+(d+1)%96;s[u++]=m,s[u++]=g,s[u++]=m+96,s[u++]=g,s[u++]=g+96,s[u++]=m+96}const l=new n.BufferGeometry;l.setAttribute("position",new n.BufferAttribute(r,3)),l.setIndex(new n.BufferAttribute(s,1)),l.boundingSphere=new n.Sphere(new n.Vector3(0,a,300),5300);const f=`
      float cloudH(vec2 p, float t){
        vec2 f = p + vec2(.0, 1.) * t * 5.;                       // the sea drifts slowly toward +Z (the gorge)
        float h = jn(vec3(f / 420., t * .012)) * .55 + jn(vec3(f / 150. + 7., t * .03)) * .3;
        float b = jn(vec3(f / 52. + 3., t * .05)); return h + b * b * .22;
      }`,h=new n.ShaderMaterial({fog:!0,transparent:!0,side:n.DoubleSide,uniforms:n.UniformsUtils.merge([n.UniformsLib.fog,{}]),vertexShader:`
        uniform float uTime, uFogK; varying vec3 vObj; varying float vH;
        #include <fog_pars_vertex>
        ${te}
        ${f}
        void main(){
          vec3 p = position; vH = cloudH(p.xz, uTime); p.y += vH * 70. - 30.; vObj = p;
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
          #ifdef USE_FOG
            vFogDepth *= uFogK;
          #endif
        }`,fragmentShader:`
        uniform vec3 uCloud, uPale, uApple, uSunCol; uniform float uTime;
        varying vec3 vObj; varying float vH;
        #include <fog_pars_fragment>
        ${te}
        ${f}
        void main(){
          float px = max(length(fwidth(vObj.xz)), 1e-3);
          float h = cloudH(vObj.xz, uTime);
          float fine = jn(vec3(vObj.xz / 17. + 2., uTime * .08)) * (1. - smoothstep(5., 12., px));
          float crest = smoothstep(.38, .82, h + fine * .12);
          // grey-green in the wall's shade (+Z), white on billow crests and on the far, sunlit shore (-Z)
          float lee = smoothstep(-700., 500., vObj.z) * (1. - smoothstep(2600., 4600., vObj.z));
          vec3 shade = mix(uCloud, vec3(.62, .72, .7), .35) * mix(.46, .8, crest) + uApple * .04 * lee;
          vec3 sunlit = mix(uCloud * .7, uPale * .98, crest) * (uSunCol / 1.72);
          vec3 col = mix(sunlit, shade, lee) + uPale * .22 * crest * crest * crest;
          float r = length(vObj.xz - vec2(0., 300.)) / 5200.;
          gl_FragColor = vec4(col, 1. - smoothstep(.72, .98, r));
          #include <fog_fragment>
        }`});Object.assign(h.uniforms,{uTime:w.uTime,uFogK:w.uFogK,uCloud:w.uCloud,uPale:w.uPale,uApple:w.uApple,uSunCol:w.uSunCol}),ae=new n.Mesh(l,h),ae.name="cloud-apron",ae.renderOrder=1,H.add(ae)}const re=new n.Vector3(500*S,120,3360),Ke=(re.z-X(500))/Math.max(-V.z,.2),rt=new n.Vector3(re.x+V.x*S*Ke,re.y+V.y*Ke,X(500)),Z=new n.Vector3((ce+1e3)*S,230,oe.z+2070),it=[[450,-120,60],[300,-92,30],[150,-45,8],[60,0,0],[0,0,0]].map(e=>new n.Vector3(Z.x+e[0]*S,Z.y+e[1],Z.z+e[2])),Re=e=>new n.Vector3(e.x*S,e.y,e.z),st={sunDir:Re(V),sunDirEnd:Re(de),hornTop:oe,summits:Ve,crest:qe,sunBloom:rt,plumeRoots:Ne,wind:Ue.clone(),viewpoints:{reveal:{position:re,lookAt:new n.Vector3(0,1150,ne)},col:{position:Z,lookAt:new n.Vector3(oe.x,1400,oe.z)}},flyThrough:it,portalSeat:{position:Z.clone(),facing:new n.Vector3(S,0,0)},skeinLine:{from:xe,to:He,s:w.uSkS,spread:w.uSkSp,minPx:w.uSkMin}},Ee=x.maxHaze??6e-5;let Qe=0;return{object:H,radius:1500,height:2500,center:new n.Vector3(0,1150,ne),anchors:st,ground:!0,groundY:0,setProgress(e){Qe=O(e,0,1),w.uProg.value=Qe},setLift(e){w.uLift.value=O(e,0,1)},update(e,t,o){w.uTime.value=t;let a=H;for(;a.parent;)a=a.parent;const r=a.fog;w.uFogK.value=r&&r.isFogExp2&&r.density>Ee?Ee/r.density:1,R&&y.renderer&&(y.renderer.getDrawingBufferSize(We),R.material.uniforms.uVH.value=We.y)},dispose(){}}}export{ut as buildHero};
