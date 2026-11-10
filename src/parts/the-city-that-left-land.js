import*as v from"three";import{clamp as P,lerp as S}from"../kit/core.js";import{RIM as r,STREET as R,LIP as D,HERO as l,sectorAngles as ee,sharedU as O,GLSL_COMMON as I,GLSL_ROCK as te}from"./the-city-that-left-common.js";const ne=Math.PI*2,n=(e,x,h)=>{const q=P((h-e)/(x-e),0,1);return q*q*(3-2*q)},U=e=>e>-353?-8-76*Math.pow(P(-e/353,0,1),1.5)+22*Math.sin(Math.max(e,0)*.006):215+330*(1-Math.exp(Math.min(0,e+675)/330)),he=e=>30-30*n(-60,-306,e)+24*Math.sin(Math.max(e,0)*.004),oe=e=>140+24*n(-80,-330,e),de=-120,pe=830,me=[150,230],fe=(e,x)=>[e*.966-x*.259+18*Math.sin(x*.0093+1.3)+9*Math.sin(e*.021),e*.259+x*.966+16*Math.sin(e*.0081+4)+8*Math.sin(x*.019)],ae=`
float lBedX(float z){ return z > -353. ? -8. - 76.*pow(clamp(-z/353., 0., 1.), 1.5) + 22.*sin(max(z, 0.)*.006) : 215. + 330.*(1. - exp(min(0., z + 675.)/330.)); }
float lRoadX(float z){ return 30. - 30.*(1. - smoothstep(-306., -60., z)) + 24.*sin(max(z, 0.)*.004); }
float lRailX(float z){ return 140. + 24.*(1. - smoothstep(-330., -80., z)); }
`;function se(e,x){const h=(o,t)=>{let z=1.5*e.fbm2(o*.0035+5,t*.0035,3)+.35*e.n2(o*.03,t*.03);const F=70*e.fbm2(o*.002+11,t*.002,3),g=.72+.4*e.fbm2(o*.0045+7,t*.0045,3),W=40-o,_=o-40,E=S(150,40,n(-40,-520,t))*n(S(400,560,n(-200,-700,t)),S(740,1050,n(-200,-700,t)),W+F),B=150*n(440,790,_+F),f=80*n(-1500,-2400,t+F*2),u=60*n(900,1700,t+F);if(z+=Math.max(E,B,f,u)*g,t>-353||t<-675){const b=Math.abs(o-U(t));z-=3.2*(1-n(7,17,b))*(1-n(10,40,z))}const a=Math.abs(o-oe(t));return t>-340&&(z+=1.4*(1-n(3,8,a))),z},q=(o,t)=>x.under(o-l.x,t-l.z)-R,M=(o,t)=>Math.hypot(o-l.x,t-l.z)<r;return{ground:h,hole:q,inHole:M,heightAt:(o,t)=>M(o,t)?q(o,t):h(o,t)}}async function ve(e,x,h,q={}){const M=se(e.noise,h),C=new v.Group,o=420,t=20,z=8,F=54,g=t+1+z+F,W=o+1,_=g*W,E=ee(o,.5,[[1.72,1.25,1.3],[3,.7,.5]]),B=[.7];{let s=.7,i=1;for(;i<F;)s+=s<400?4.5+.05*s:24.5+.13*(s-400),B.push(s),i++}const f=new Float32Array(_*3),u=new Float32Array(_*4);let a=0;for(let s=0;s<W;s++){const i=E[s],d=Math.cos(i),c=Math.sin(i),p=h.under(d*r,c*r),H=h.wallR(i,p);for(let m=0;m<=t;m++){const w=m/t,k=m===t?H:r*(1-Math.pow(1-w,1.3)),y=l.x+d*k,A=l.z+c*k;f[a*3]=y,f[a*3+1]=(m===t?p:h.under(d*k,c*k))-R,f[a*3+2]=A,u[a*4]=.55+.45*w,u[a*4+1]=1,a++}const X=h.wallR(i,R),j=l.x+d*(X+.7),Q=l.z+c*(X+.7),J=M.ground(j,Q);for(let m=1;m<=z;m++){const w=m/z,k=S(p,R-.3,w),y=S(H,h.wallR(i,k),Math.min(1,w*3));f[a*3]=l.x+d*y,f[a*3+1]=S(p-R,J-.3,w),f[a*3+2]=l.z+c*y,u[a*4]=.8+.2*w,u[a*4+1]=1,a++}for(let m=0;m<F;m++){const w=X+B[m],k=l.x+d*w,y=l.z+c*w,A=M.ground(k,y);f[a*3]=k,f[a*3+1]=A,f[a*3+2]=y;const Z=y>-353||y<-675?Math.abs(k-U(y)):99;u[a*4]=1,u[a*4+1]=0,u[a*4+2]=n(14,55,A),u[a*4+3]=(1-n(6,16,Z))*(1-n(10,40,A)),a++}s%24===23&&await e.yield()}const b=new Uint32Array((g-1)*o*6);let N=0;for(let s=0;s<o;s++)for(let i=0;i<g-1;i++){const d=s*g+i,c=d+1,p=(s+1)*g+i+1,H=(s+1)*g+i;b[N++]=d,b[N++]=H,b[N++]=p,b[N++]=d,b[N++]=p,b[N++]=c}await e.yield();const L=new v.BufferGeometry;L.setAttribute("position",new v.BufferAttribute(f,3)),L.setAttribute("bake",new v.BufferAttribute(u,4)),L.setIndex(new v.BufferAttribute(b,1)),L.computeVertexNormals();const G=L.attributes.normal.array;for(let s=0;s<g;s++){const i=s*3,d=(o*g+s)*3;for(let c=0;c<3;c++){const p=(G[i+c]+G[d+c])*.5;G[i+c]=p,G[d+c]=p}}L.computeBoundingSphere(),await e.yield();const $=new v.ShaderMaterial({uniforms:O(x,{uC:{value:new v.Vector2(l.x,l.z)},uSeason:{value:q.season==="blossom"?1:0},uLake:{value:2-h.thick(0)}}),vertexShader:`
      attribute vec4 bake;
      varying vec3 vWorld, vLocal, vN; varying vec4 vBake;
      void main(){
        vLocal = position; vBake = bake; vN = normal;
        vec4 wp = modelMatrix*vec4(position, 1.); vWorld = wp.xyz;
        gl_Position = projectionMatrix*viewMatrix*wp;
      }`,fragmentShader:I+te+ae+`
      uniform vec2 uC; uniform float uSeason, uLake;
      varying vec3 vWorld, vLocal, vN; varying vec4 vBake;
      void main(){
        vec3 p = vLocal, toCam = cameraPosition - vWorld; float dist = length(toCam);
        vec3 v = toCam / max(dist, 1e-4);
        vec3 n = normalize(vN + vec3(0., 1e-5, 0.));
        float kind = clamp(vBake.g, 0., 1.), wood = clamp(vBake.b, 0., 1.), bed = clamp(vBake.a, 0., 1.);
        vec3 fx_ = dFdx(vWorld), fy_ = dFdy(vWorld);
        vec3 nF = cross(fx_, fy_); nF = nF / max(length(nF), 1e-9); if (dot(nF, n) < 0.) nF = -nF;
        vec2 qc = p.xz - uC; float r = length(qc);
        float gap = clamp((${(l.y+D).toFixed(1)} - uLandY)/250., 0., 1.);
        // ---- fields: big enclosures between hedges, each cut into a few strips, some one way and some the other
        vec2 q = vec2(p.x*.966 - p.z*.259, p.x*.259 + p.z*.966) + vec2(18.*sin(p.z*.0093 + 1.3) + 9.*sin(p.x*.021), 16.*sin(p.x*.0081 + 4.) + 8.*sin(p.z*.019));
        vec2 big = vec2(150., 230.), bi = floor(q/big), bf = fract(q/big);
        float turn = step(.62, cH(bi + 3.)), nst = floor(2. + 3.99*cH(bi + 5.));
        float sc = mix(bf.x, bf.y, turn)*nst, si = floor(sc), sf = fract(sc), stripW = mix(big.x, big.y, turn)/nst;
        float h = cH(bi*7.3 + si + turn*31.), h2 = cH(bi*3.1 + si*5.7 + 17.);
        float near = 1. - smoothstep(40., 160., dist);
        vec3 stubble = mix(vec3(.15, .118, .062), vec3(.125, .1, .058), h2), pasture = mix(vec3(.066, .078, .044), vec3(.078, .086, .046), h2);
        vec3 plough = vec3(.055, .043, .036), roots = vec3(.035, .06, .04);
        // in blossom time (uSeason 1) the corn is young and green, the pasture fresh, one strip in seven in yellow flower
        stubble = mix(stubble, mix(vec3(.07, .115, .048), vec3(.09, .13, .05), h2), uSeason);
        pasture = mix(pasture, mix(vec3(.058, .1, .045), vec3(.07, .112, .05), h2), uSeason);
        roots = mix(roots, vec3(.2, .17, .035), uSeason);
        vec3 col = mix(pasture, stubble, step(.5, h)); col = mix(col, plough, step(.8, h)); col = mix(col, roots, step(.92, h));
        // the grain of the work: rows, only where they are near enough to be drawn
        float rows = sin(mix(q.y, q.x, turn)*2.1 + h*40.);
        col *= 1. + rows*.08*(1. - smoothstep(25., 80., dist))*step(.5, h);
        col = mix(col, vec3(.07, .075, .05), smoothstep(250., 1100., dist)*.72);      // far off the fields run together
        col *= .7 + .6*cF(p.xz*.021 + h*9.) ;
        col *= .9 + .2*cN(p.xz*.6)*near;
        vec2 bd = min(bf, 1. - bf)*big; float hedge = 1. - smoothstep(1.6, 3.2, min(bd.x, bd.y) + .8*cN(p.xz*.22));
        float baulk = 1. - smoothstep(.35, .9, min(sf, 1. - sf)*stripW);
        col = mix(col, col*.55 + vec3(.012, .016, .01), baulk*.7);
        // a cart lane along one side of every big field, pale with wear
        float lane = (1. - smoothstep(.9, 1.5, abs(bd.x - 6.)))*step(bd.x, bd.y);
        col = mix(col, vec3(.15, .13, .1)*(.75 + .5*cN(p.xz*.9)), lane*.75);
        // stooks standing in rows on the stubble, each with its own small shade
        vec2 sg = vec2(mix(q.x, q.y, turn)/11., mix(q.y, q.x, turn)/7.), sgi = floor(sg), sgf = fract(sg) - .5 - .5*(vec2(cH(sgi + 3.), cH(sgi + 11.)) - .5);
        float isStub = (1. - uSeason)*step(.5, h)*(1. - step(.8, h))*step(.35, cH(bi*5.1 + si))*step(.4, cH(sgi + 23.))*(1. - lane)*(1. - smoothstep(170., 420., dist));
        float stook = (1. - smoothstep(.035, .06, length(sgf*vec2(1., .64))))*isStub;
        col = mix(col, col*.5, (1. - smoothstep(.04, .13, length((sgf - vec2(.07, .04))*vec2(.7, .6))))*isStub*.5);
        col = mix(col, vec3(.2, .15, .07), stook);
        // the hedges throw long shades away from the afterglow
        vec2 gq = vec2(uGlowAz.x*.966 - uGlowAz.y*.259, uGlowAz.x*.259 + uGlowAz.y*.966);
        vec2 b1 = fract((q + gq*5.)/big), b2 = fract((q + gq*12.)/big); b1 = min(b1, 1. - b1)*big; b2 = min(b2, 1. - b2)*big;
        float shade = max(1. - smoothstep(1.6, 3.4, min(b1.x, b1.y)), .6*(1. - smoothstep(1.6, 4., min(b2.x, b2.y))))*(1. - hedge);
        col *= 1. - .42*shade;
        col = mix(col, vec3(.014, .022, .013)*(.6 + .8*cN(p.xz*.5)), hedge*.95);
        col = mix(col, vec3(.3, .27, .27), hedge*uSeason*.55*step(.5, cN(p.xz*1.3 + 7.))*near);   // the hedges in flower
        // snow lies on everything but the hedges' tops, the road and the bed
        col = mix(col, vec3(.27, .295, .35)*(.7 + .3*cF(p.xz*.03) + .22*cF(vec2(q.x*.045, q.y*.16) + 5.))*(1. - .3*baulk)*(1. - .3*lane)*mix(vec3(1.), vec3(.62, .7, .95), shade), uSnow*(1. - hedge*.7));
        // ---- the old riverbed: gravel and cracked mud, a few pools that give the sky back
        vec3 gravel = mix(vec3(.13, .115, .095), vec3(.075, .068, .06), cF(p.xz*.11))*(.8 + .4*cN(p.xz*1.7)*near);
        col = mix(col, gravel, smoothstep(.25, .7, bed));
        float pool = smoothstep(.6, .68, cF(p.xz*vec2(.05, .016) + 3.))*smoothstep(.8, 1., bed);
        pool = max(pool, step(p.z, -675.)*smoothstep(.5, .8, bed));          // above the town the river still runs
        // ---- the road and the railway
        float dRoad = abs(p.x - lRoadX(p.z)), road = (1. - smoothstep(3.3, 3.8, dRoad))*step(-330., p.z);
        col = mix(col, vec3(.033, .034, .038)*(.85 + .3*cN(p.xz*.5)), road);
        col = mix(col, vec3(.2, .19, .16), road*(1. - smoothstep(.08, .2, dRoad))*step(.5, fract(p.z/9.))*near);
        float dRail = abs(p.x - lRailX(p.z)), rail = (1. - smoothstep(2.6, 3.4, dRail))*step(-345., p.z);
        col = mix(col, vec3(.075, .068, .062)*(.75 + .5*cN(p.xz*1.3)), rail);
        float steel = (1. - smoothstep(.1, .22, abs(dRail - .78)))*rail*near;
        col = mix(col, vec3(.03), rail*near*step(.55, fract(p.z/.75))*(1. - smoothstep(1.2, 1.4, dRail))*.7);
        // ---- woods on the ridges, as dark texture
        col = mix(col, vec3(.011, .018, .013)*(.5 + 1.1*cF(p.xz*.06))*(1. + uSnow*2.5*cN(p.xz*.2)), wood);
        // ---- the field's edge: grass laid flat in slow rings that travel outward from the hole
        float ringK = (1. - smoothstep(20., 75., r - ${r.toFixed(1)}))*(1. - kind)*(1. - road);
        float ring = .5 + .5*sin((r - ${r.toFixed(1)})*.42 - uTime*1.5 + 2.*cN(p.xz*.03));
        col *= 1. + ringK*(ring*ring*.7 - .2);
        // the lip of the hole: torn turf, dark soil, pale subsoil
        float lip = (1. - smoothstep(2., 14., r - ${r.toFixed(1)} - 26.*smoothstep(.38, .8, cF(p.xz*.03 + 2.)) + 5.*cN(p.xz*.2)))*(1. - kind);
        col = mix(col, mix(vec3(.09, .075, .06), vec3(.4, .37, .32), smoothstep(.3, .62, cN(p.xz*.23 + 4.)))*(.6 + .8*cN(p.xz*.8)), lip*.9);
        // ---- light on the open land: the town overhead takes some of the sky; mist lies in the low ground
        float under = (1. - smoothstep(${(r-30).toFixed(1)}, ${(r+150).toFixed(1)}, r))*(1. - gap*.6);
        vec3 lit = col*ctlLight(n)*(1.25 - .6*under);
        // pools and wet gravel mirror the sky
        vec3 rf = reflect(-v, normalize(n + vec3(.02*sin(p.z*.9 + uTime*.7), 0., .02*sin(p.x*1.1 - uTime*.6))));
        float fres = .04 + .96*pow(1. - clamp(dot(n, v), 0., 1.), 4.);
        lit = mix(lit, ctlSky(rf)*(.3 + .7*fres), pool*(1. - kind));
        lit += ctlSky(rf)*fres*.5*steel;
        float mist = (1. - smoothstep(0., 16., p.y))*smoothstep(120., 900., dist)*(1. - kind)*.5*(.6 + .8*cF(p.xz*.004 + vec2(uTime*.003, 0.)));
        lit = mix(lit, uFogCol*1.25 + uFogGlow*.12, clamp(mist, 0., .6));
        // ---- the two lorries' headlamps lie on the road and the verge ahead of them, toward the fence
        for (int li = 0; li < 2; li++) {
          float zL = ${(-103).toFixed(1)} + 15.*float(li);
          vec2 dl = vec2(p.x - (lRoadX(zL) + 1.4), zL - 2.4 - p.z);
          float cone = smoothstep(.4, 3., dl.y)*exp(-max(dl.y, 0.)*.085)*(1. - smoothstep(.2, .5, abs(dl.x)/max(dl.y, 1.5)));
          lit += col*vec3(1., .86, .6)*cone*7.*(1. - kind);
        }
        // ---- the watchers' fires out on the plain, a few to the square kilometre, each with its pool of light
        vec2 fi = floor(p.xz/85.), fc = (fi + .2 + .6*vec2(cH(fi + 1.7), cH(fi + 9.3)))*85.;
        float fOn = step(.74, cH(fi + 4.1))*smoothstep(${(r+30).toFixed(1)}, ${(r+60).toFixed(1)}, length(fc - uC))*(1. - smoothstep(520., 640., length(fc - uC)))*(1. - kind);
        float fd = length(p.xz - fc), fFl = .8 + .2*sin(uTime*9. + cH(fi)*40.) + .12*sin(uTime*23. + cH(fi + 2.)*17.);
        lit += (col*vec3(1., .55, .22)*exp(-fd/6.)*2.2 + vec3(1., .5, .16)*exp(-fd*fd/2.2)*1.5)*fOn*fFl;
        // ---- the hole: the same beds as the keel (they were one rock), lit through the gap
        if (kind > .001) {
          vec3 pk = vec3(qc.x, p.y + ${R.toFixed(1)}, qc.y);
          float flat_ = smoothstep(.3, .62, n.y);
          float wetK, bedF; vec3 facet; vec3 rock = ctlRock(pk, dist, flat_, wetK, facet, bedF);
          float depth = max(-p.y, 0.);
          // soil and fill at the top of the cut, like the rim above
          float soilD = 2.2 + 2.2*cN(vec2(atan(qc.y, qc.x)*${(r*.05).toFixed(2)}, 3.));
          rock = mix(rock, vec3(.05, .038, .03)*(.6 + .8*cN3(pk*vec3(.5, 1.6, .5))), 1. - smoothstep(soilD - .5, soilD + 1.5, depth));
          // under the soil the break is fresh: a pale band of clean rock, and fans of rubble that slid down from the lip
          float aq = atan(qc.y, qc.x)*${r.toFixed(1)};
          rock = mix(rock, vec3(.33, .31, .28)*(.7 + .5*cN3(pk*.5)), smoothstep(soilD, soilD + 2., depth)*(1. - smoothstep(4., 22., depth))*.55*smoothstep(.3, .6, cF3(pk*.06 + 3.)));
          float fan = smoothstep(.55, .78, cF(vec2(aq*.028, 1.3)))*(1. - smoothstep(6., 34. + 14.*cN(vec2(aq*.05, 7.)), depth));
          rock = mix(rock, vec3(.21, .195, .175)*(.45 + 1.1*cN3(pk*1.3)), fan*.7);
          vec2 radial = qc / max(r, 1e-3);
          float wE = .012 + dist*.0005, riser = smoothstep(.85 - wE, .85 + wE, bedF)*step(.5, flat_);
          float fK = 1. - .85*smoothstep(40., 190., dist);                 // seen from far above, the beds are rings, not chips
          vec3 nTread = normalize(vec3(.11, 1., -.07) + facet*.16*fK), nRiser = normalize(vec3(-radial.x, .22, -radial.y) + facet*.5*fK);
          vec3 nh = normalize(mix(normalize(mix(n, nF, .2) + facet*.34*(1. - smoothstep(90., 420., dist))), mix(nTread, nRiser, riser*.4), flat_));
          // how far to the hole's own edge toward the afterglow: the band shows only near the top, the dusk sky deeper
          float bq = dot(qc, uGlowAz), tq = -bq + sqrt(max(bq*bq - dot(qc, qc) + ${(r*r).toFixed(1)}, 0.));
          float slope = depth / max(tq, 1.);
          vec3 roseT = mix(uRose, vec3(dot(uRose, vec3(.3, .5, .2))), .6)*1.3;
          vec3 through = mix(uBand, vec3(dot(uBand, vec3(.3, .5, .2))), .5)*.4*(1. - smoothstep(.0, .1, slope)) + roseT*(1. - smoothstep(.06, .4, slope));
          vec3 Lg = normalize(vec3(uGlowAz.x, .16, uGlowAz.y));
          float rake = clamp(dot(nh, Lg)*mix(.8, 1.25, fK) + mix(.3, .2, fK), 0., 1.);
          float ao = clamp(vBake.r, 0., 1.);
          vec3 hl = rock*(ctlLight(nh)*(.26 + .6*gap)*ao + through*rake*(.5 + .7*gap));
          vec3 rh = reflect(-v, nh);
          float fh = .03 + .97*pow(1. - clamp(dot(nh, v), 0., 1.), 4.);
          hl += ctlSky(rh)*fh*clamp(wetK, 0., 1.)*(.25 + .5*gap)*step(0., rh.y);
          // the shore of the lake is dark and wet
          hl *= .55 + .45*smoothstep(uLake, uLake + 5., p.y);
          lit = mix(lit, hl, kind);
        }
        gl_FragColor = vec4(ctlFog(lit, vWorld - cameraPosition), 1.);
      }`}),K=new v.Mesh(L,$);K.frustumCulled=!1,C.add(K),await e.yield();const V=new v.CircleGeometry(178,48).rotateX(-Math.PI/2),Y=new v.ShaderMaterial({uniforms:O(x,{uC:{value:new v.Vector2(l.x,l.z)}}),vertexShader:`
      varying vec3 vWorld, vLocal;
      void main(){ vec4 wp = modelMatrix*vec4(position, 1.); vWorld = wp.xyz; vLocal = position; gl_Position = projectionMatrix*viewMatrix*wp; }`,fragmentShader:I+`
      uniform vec2 uC;
      varying vec3 vWorld, vLocal;
      void main(){
        vec3 toCam = cameraPosition - vWorld; vec3 v = toCam / max(length(toCam), 1e-4);
        vec2 w = vLocal.xz;
        float t = uTime*.5;
        vec3 n = normalize(vec3(.05*(cN(w*.21 + vec2(t, 0.)) - .5) + .025*sin(w.x*.9 + t*2.1), 1., .05*(cN(w*.23 - vec2(0., t)) - .5) + .025*sin(w.y*1.1 - t*1.7)));
        vec3 r = reflect(-v, n); r.y = abs(r.y);
        // does the mirrored ray leave under the town's rim, or does it meet the keel?
        vec2 q = w, dh = r.xz / max(length(r.xz), 1e-4);
        float bq = dot(q, dh), tq = -bq + sqrt(max(bq*bq - dot(q, q) + ${(r*r).toFixed(1)}, 0.));
        float rise = tq*r.y / max(length(r.xz), 1e-3);
        float room = ${(l.y+D).toFixed(1)} - vWorld.y;
        float open = 1. - smoothstep(room*.86, room*1.04, rise);
        vec3 keel = vec3(.004, .0045, .006) + uGold*.02*step(.93, cN(r.xz*23.));
        float fres = .05 + .95*pow(1. - clamp(dot(n, v), 0., 1.), 4.);
        vec3 col = mix(vec3(.004, .006, .009), mix(keel, ctlSky(r), open), .5 + .5*fres);
        // the afterglow lies on the water as a broken path toward the band
        col += uBand*.5*open*pow(clamp(dot(dh, uGlowAz), 0., 1.), 10.)*(.5 + .5*cN(w*.5 + vec2(t*1.3, 0.)));
        gl_FragColor = vec4(ctlFog(col, vWorld - cameraPosition), 1.);
      }`}),T=new v.Mesh(V,Y);return T.position.set(l.x,2-h.thick(0),l.z),C.add(T),{group:C,mesh:K,material:$,lake:T,shape:M,triangles:b.length/3+48,update(s,i,d,c){const p=2-h.thick(0)+9*c;T.position.y=p,$.uniforms.uLake.value=p}}}export{pe as EAST_CREST_X,me as FIELD,de as PYLON_X,U as bedX,ve as buildLand,fe as fieldQ,se as makeLandShape,oe as railX,he as roadX};
