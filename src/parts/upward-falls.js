import*as s from"three";const ze=x=>Math.min(1,Math.max(0,x)),Ie=(x,a,D)=>{const U=ze((D-x)/(a-x));return U*U*(3-2*U)},Me=(x,a,D)=>x+(a-x)*D,Je=`
uniform sampler2D tNoise;
float nR(vec2 p){ return texture2D(tNoise, p).r; }
float nG(vec2 p){ return texture2D(tNoise, p).g; }
float nB(vec2 p){ return texture2D(tNoise, p).b; }
float nA(vec2 p){ return texture2D(tNoise, p).a; }
`,Qe=`
uniform vec4 uGale;
float galeRun(vec2 xz){ return -xz.y + uGale.w * xz.x; }                               // metres along the gale's run
float galeTau(vec2 xz){ return fract(uGale.x - galeRun(xz) * uGale.z) * uGale.y; }     // seconds since the front crossed
float galeTauRun(float run){ return fract(uGale.x - run * uGale.z) * uGale.y; }
// the gust itself: slams in behind the front, blows for three quarters of the period, dies away; then a lull of some
// four seconds before the next front
float galeGust(float tau){ return smoothstep(0., .35, tau) * (1. - smoothstep(uGale.y * .68, uGale.y * .82, tau)); }
// how far a fall has failed: the gust has it within two seconds of the front, holds it six tenths of the period, lets it
// go over the next three seconds: it is down again and pouring through the lull, until the next front takes it
float galeFail(float tau){ return smoothstep(.2, 1.9, tau) * (1. - smoothstep(uGale.y * .6, uGale.y * .6 + 2.8, tau)); }
`,Xe=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uBounce; uniform float uTime; uniform vec4 uScud;   // uScud: wind x, wind z (m/s), amount, 1 / size
float scudShade(vec3 wp){
  vec2 p = (wp.xz + uSunDir.xz * ((700. - wp.y) / max(uSunDir.y, .12)) - uScud.xy * uTime) * uScud.w;
  float n = nR(p) * .62 + nG(p * 2.7 + .31) * .38;
  return 1. - uScud.z * smoothstep(.5, .64, n);
}
`;function et(x={}){const a={period:x.period??19.5,wave:x.wave??1250,skew:x.skew??.45,phase:0,uniform:{value:new s.Vector4(0,x.period??19.5,1/(x.wave??1250),x.skew??.45)},start:x.start??0,set(D){const U=(D-a.start)/a.period;a.phase=U-Math.floor(U),a.uniform.value.x=a.phase},run:(D,U)=>-U+a.skew*D,tauRun:D=>{const U=a.phase-D/a.wave;return(U-Math.floor(U))*a.period},tau:(D,U)=>a.tauRun(-U+a.skew*D),gust:D=>Ie(0,.35,D)*(1-Ie(a.period*.68,a.period*.82,D)),fail:D=>Ie(.2,1.9,D)*(1-Ie(a.period*.6,a.period*.6+2.8,D))};return a}async function it(x,a,D=4){const $=Y=>{const w=new Float32Array(Y*Y);for(let G=0;G<w.length;G++)w[G]=x();return w},T=[$(8),$(16),$(32),$(64)],re=[$(8),$(16),$(32),$(64)],o=[$(8),$(16),$(32)],Ce=[$(32),$(64),$(128)],K=(Y,w,G,R)=>{const g=G*w,Q=R*w,Te=Math.floor(g),Ge=Math.floor(Q);let ee=g-Te,ae=Q-Ge;ee=ee*ee*(3-2*ee),ae=ae*ae*(3-2*ae);const _e=Te%w,Ve=(Te+1)%w,C=Ge%w,X=(Ge+1)%w;return Me(Me(Y[C*w+_e],Y[C*w+Ve],ee),Me(Y[X*w+_e],Y[X*w+Ve],ee),ae)},Ae=new Uint8Array(256*256*4);for(let Y=0;Y<256;Y++){for(let w=0;w<256;w++){const G=w/256,R=Y/256,g=(Y*256+w)*4,Q=K(T[0],8,G,R)*.5+K(T[1],16,G,R)*.27+K(T[2],32,G,R)*.15+K(T[3],64,G,R)*.08,Te=K(re[0],8,G,R)*.5+K(re[1],16,G,R)*.27+K(re[2],32,G,R)*.15+K(re[3],64,G,R)*.08,Ge=1-Math.abs(2*K(o[0],8,G,R)-1),ee=1-Math.abs(2*K(o[1],16,G,R)-1),ae=1-Math.abs(2*K(o[2],32,G,R)-1),_e=K(Ce[0],32,G,R)*.5+K(Ce[1],64,G,R)*.3+K(Ce[2],128,G,R)*.2;Ae[g]=255*ze((Q-.5)*1.5+.5),Ae[g+1]=255*ze((Te-.5)*1.5+.5),Ae[g+2]=255*ze(Ge*Ge*.55+ee*ee*.3+ae*ae*.15),Ae[g+3]=255*ze((_e-.5)*1.4+.5)}(Y&3)===3&&a&&await a()}const le=new s.DataTexture(Ae,256,256,s.RGBAFormat);return le.wrapS=le.wrapT=s.RepeatWrapping,le.magFilter=s.LinearFilter,le.minFilter=s.LinearMipmapLinearFilter,le.generateMipmaps=!0,le.anisotropy=D,le.needsUpdate=!0,le}function tt(x){return new s.ShaderMaterial({uniforms:x,fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-6,blending:s.CustomBlending,blendSrc:s.OneFactor,blendDst:s.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec3 aTan; attribute vec4 aS, aF, aW; attribute float aL;
      uniform float uPx, uTime;
      ${Qe}
      varying vec2 vUv; varying vec4 vI; varying vec3 vW; varying float vH, vK, vL;
      #include <fog_pars_vertex>
      void main(){
        float t = aS.y, sr = aS.z, H = aF.y;
        float fail = galeFail(galeTauRun(aF.x)), tk = mix(1.08, aF.z, fail);
        float below = max(t - tk - .03 * sr, 0.), w = smoothstep(0., .14, below);
        vec3 pos = position;
        pos.xz += aW.xy * aW.z * (below * 1.8 + below * below * 6.) * (.7 + .6 * sr);
        pos.y += H * below * .8 * w;
        vec3 along = normalize(aTan + vec3(aW.x, .0, aW.y) * 1.2 * w);
        // the ribbon: broader where the water breaks on a ledge and where the wind spreads it, never thinner than a pixel
        // and a half; its width lies across its own run and is turned to the eye's place
        vec3 toEye = cameraPosition - pos; float dist = length(toEye);
        float hw = max(aF.w * (1. + 1.1 * aS.w + 6. * w) * mix(1. - .3 * t, 1. + .6 * t, aW.w), dist * uPx * .75);
        vec3 ax = normalize(cross(along, toEye) + vec3(1e-5, 0., 0.));
        pos += ax * hw * aS.x;
        vUv = vec2(aS.x, t); vW = pos; vH = H; vK = aW.w; vL = aL;
        vI = vec4(w, below, sr, aS.w);
        vec4 mvPosition = viewMatrix * vec4(pos, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv; varying vec4 vI; varying vec3 vW; varying float vH, vK, vL;
      #include <fog_pars_fragment>
      ${Je}
      ${Xe}
      void main(){
        float across = vUv.x, t = vUv.y, w = vI.x, below = vI.y, sr = vI.z, br = vI.w;
        // the water's own grain runs down the strand, faster the further it has fallen; in the wind it slows and stops
        float ph = sqrt(max(t + .02, 0.) * vH) * .2 - uTime * sqrt(max(vH, 0.)) * .045 * (1. - w);
        float n = nA(vec2(sr * 7.3 + across * .07, ph)), nb = nR(vec2(sr * 3.1 + across * .15, ph * .37 + .3));
        float edge = 1. - smoothstep(mix(.62, 0., w), 1., abs(across));          // (in the wind it has no edge: a veil)
        // streaks with rock showing between them on a riser, a whole white sheet where it breaks on a ledge
        float body = mix(.62 + .38 * smoothstep(.3, .62, n), 1., br);
        // (a sheet: broad soft streaks, thinner than a strand)
        body = mix(body, (.34 + .66 * smoothstep(.3, .7, nA(vec2(sr * 5.1 + across * .8, ph * .7)))) * mix(.62, .9, br), vK);
        // torn where the wind has had it longest, gone a little way under the kink
        float fray = 1. - smoothstep(.0, .075, below + (nb - .5) * .05 * w);
        body = mix(body, .5 + .5 * nb, w);
        float a = edge * body * fray * (1. - .72 * w);
        // (white water in the sun is warm and bright; in the rock's shade it has only the sky's blue)
        vec3 lit = uSunCol * (.08 + .92 * vL * scudShade(vW)) + uSkyCol * 1.15 + vec3(.03, .04, .055);
        vec3 col = mix(vec3(.8, .89, .93), vec3(1.03), max(n, br)) * lit;
        // the lip: glassy, the lake's colour seen through it, with bright threads
        float glass = 1. - smoothstep(3. / vH, 10. / vH, t);
        col = mix(col, (vec3(.3, .58, .58) + vec3(.6) * smoothstep(.55, .75, n)) * lit, glass * .7);
        a = mix(a, edge * .93, glass);
        #ifdef USE_FOG
          col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
        #endif
        gl_FragColor = vec4(col * a, a);
      }`})}function at(x){return new s.ShaderMaterial({uniforms:x,fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide,blending:s.CustomBlending,blendSrc:s.OneFactor,blendDst:s.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec3 iP0, iP1, iP2, iP3; attribute vec4 iM, iN, iL;
      uniform float uTime; uniform vec3 uSunDir;
      ${Qe}
      varying vec2 vUv, vE; varying vec3 vW; varying vec4 vS; varying float vSun;
      #include <fog_pars_vertex>
      void main(){
        float age = fract(iM.y + uTime * iM.w), lap = 1. / iM.w, tau = galeTauRun(iM.x), k = 1. - age, kind = iN.w;
        vec4 bz = vec4(k * k * k, 3. * k * k * age, 3. * k * age * age, age * age * age);
        vec3 c = iP0 * bz.x + iP1 * bz.y + iP2 * bz.z + iP3 * bz.w;
        float size = iM.z * (.55 + iN.z * age), fail = galeFail(tau), str;
        // (a veil on the chute goes with the failing water and is gone at the rim; a veil of the banner (kind 0.3) leaves
        // the rim a second and a half after its fall failed, the time the water takes up the chute, and thins all its way)
        if (kind < .2) str = galeFail(tau - age * lap) * fail * smoothstep(.03, .18, age) * (1. - smoothstep(.7, 1., age));
        else if (kind < .5) str = galeFail(tau - age * lap - 1.5) * fail * smoothstep(0., .1, age) * (1. - smoothstep(.4, 1., age));
        // (no water reaches the foot of a blown fall: its foot's cloud goes while it is held)
        else if (kind < 3.5) str = (kind < 1.5 ? 1. - fail : (kind < 2.5 ? 1. : fail)) * smoothstep(0., .15, age) * (1. - smoothstep(.5, 1., age));
        else str = smoothstep(0., .4, tau) * (1. - smoothstep(1.2, 4.2, tau)) * smoothstep(0., .2, age) * (1. - smoothstep(.45, 1., age));
        vec3 toEye = cameraPosition - c; float dist = length(toEye); toEye /= max(dist, 1e-3);
        c += toEye * min(size * .3, dist * .3) * step(kind, 3.5);                  // it stands clear of the rock it climbs
        vec3 rt = normalize(cross(vec3(0., 1., 0.), toEye) + vec3(1e-5, 0., 0.)), up = cross(toEye, rt);
        // a puff of a fall's mist is a wisp drawn out along its own way (the track's run there, seen square to the eye);
        // smoke on the lake lies flat
        vec3 tg = (iP1 - iP0) * k * k + 2. * (iP2 - iP1) * k * age + (iP3 - iP2) * age * age;
        vec3 sx = normalize(cross(tg, toEye) + vec3(1e-5, 0., 0.)), sy = cross(toEye, sx);
        // (a veil of the banner is nearly five times as long as it is broad, drawn out along the flow)
        // (on the chute; off the rim a veil is broader, three times as long as broad)
        vec3 pos = kind < .5 ? c + (sx * position.x * mix(.5, .66, step(.2, kind)) + sy * position.y * mix(2.4, 2., step(.2, kind))) * size : (kind < 3.5 ? c + (sx * position.x + sy * position.y * 1.7) * size : c + (rt * position.x + up * position.y * .17) * size);
        vE = vec2(sx.y, dot(sx, uSunDir));                                           // which of its long edges is the upper one, which looks to the sun
        float a3 = age * 3.; vSun = a3 < 1. ? mix(iL.x, iL.y, a3) : (a3 < 2. ? mix(iL.y, iL.z, a3 - 1.) : mix(iL.z, iL.w, a3 - 2.));
        vUv = position.xy; vW = pos; vS = vec4(iN.x, str * iN.y, age, iN.w);
        vec4 mvPosition = viewMatrix * vec4(pos, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv, vE; varying vec3 vW; varying vec4 vS; varying float vSun;
      #include <fog_pars_fragment>
      ${Je}
      ${Xe}
      void main(){
        float r2 = dot(vUv, vUv), seed = vS.x;
        // a puff is thin: thickest at its middle, gone well inside its own square; a plume is many of them, one over
        // another, so that it is thinner at its edges than at its heart and what stands behind shows through
        float g = exp(-r2 * 3.) * (1. - smoothstep(.55, 1., r2));
        // billows drifting up through the puff eat it from its edge inward
        float n = nR(vUv * .23 + seed * vec2(3.1, 7.7) - vec2(0., uTime * .05)) * .6 + nG(vUv * .55 + seed * 5.3 - vec2(uTime * .02, uTime * .11)) * .4;
        // (the banner's spray is a veil drawn out along its own way: dense at its core, feathering to nothing at its edge,
        // streaked along the flow, the streaks running on down the wind; the rock or the sky is seen between them)
        float veil = 1. - step(.5, vS.w), x2 = vUv.x * vUv.x, y2 = vUv.y * vUv.y;
        g = mix(g, exp(-(x2 * 2.6 + y2 * 1.7)) * (1. - smoothstep(.5, 1., max(x2, y2))), veil);
        float sv = nA(vec2(vUv.x * .21 + seed * 3.1, vUv.y * .05 - uTime * .2 + seed * 7.7)) * .55 + nR(vec2(vUv.x * .37 + seed * 5.3, vUv.y * .085 - uTime * .31)) * .45;
        n = mix(n, sv, veil);
        // (a banner's veil is torn as it goes: whole near the rim, streaks and rags toward its end)
        float torn = veil * step(.2, vS.w) * vS.z * vS.z * .2;
        float a = g * smoothstep(mix(.3, .33, veil) + torn, mix(.78, .7, veil) + torn, n + g * mix(.36, .32, veil)) * vS.y * mix(1.25, 1.2, veil);
        vec3 V = normalize(cameraPosition - vW);
        // thin water in the air: in the rock's shade it has the sky's blue-grey; where the sun finds it it is gold-white,
        // and brightest when the sun stands behind it
        float fwd = pow(max(dot(-V, uSunDir), 0.), 5.), lit = vSun * mix(1., scudShade(vW), .7);
        // (a veil has a body: its edge toward the sun is lit, its heart and its under side keep the sky's blue-grey, and
        // the densest streaks in it are the brightest)
        float body = (1. + .4 * clamp(vUv.x * vE.y * 1.6, -1., 1.)) * (1. - .55 * smoothstep(.15, .55, g * n)) * (1. - .35 * clamp(-vUv.x * vE.x * 1.6, 0., 1.)) + .5 * smoothstep(.56, .8, sv);
        vec3 col = uSkyCol * 1.3 + vec3(.04, .05, .07) + uSunCol * (.6 + .16 * n + 1.1 * fwd) * (.05 + .95 * lit) * mix(1., body, veil);
        // a bow where it stands at the bow's angle from the point opposite the sun
        float bw = dot(V, uSunDir), bow = smoothstep(.722, .74, bw) * (1. - smoothstep(.766, .784, bw)) * lit;
        col += vec3(1. - smoothstep(.738, .758, bw), 1. - smoothstep(0., .015, abs(bw - .752)), smoothstep(.746, .766, bw)) * bow * .9 * uSunCol;
        #ifdef USE_FOG
          col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
        #endif
        gl_FragColor = vec4(col * a, a);
      }`})}function ot(x){return new s.ShaderMaterial({uniforms:x,fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-6,blending:s.CustomBlending,blendSrc:s.OneFactor,blendDst:s.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec3 aTan, aN; attribute vec4 aS, aF, aW, aG;
      uniform float uPx, uTime;
      ${Qe}
      varying vec2 vUv, vL; varying vec4 vI; varying vec3 vW, vAx;
      #include <fog_pars_vertex>
      void main(){
        float sr = aS.z, e = aG.z, m = aF.y;
        float tau = galeTauRun(aF.x), fail = galeFail(tau), tk = mix(1.08, aF.w, fail), above = tk - aG.x;
        float speed = .5 / (uGale.z * uGale.y);
        float str = galeFail(tau - aG.y * .5 / speed) * fail * smoothstep(0., .035, above) * aG.w;     // (off the rim the spray goes at the front's own speed)
        vec3 pos = position + aW.xyz * (1. - smoothstep(0., .13, above));          // the rope leaves the column at its kink
        // it writhes on the rock and whips off the rim: waves that run up it with the water
        float ph = (m - uTime * speed) * .05 + sr * 6.283, wob = (.3 + 5.5 * e) * aS.y * (.55 + .45 * galeGust(tau));
        pos += aN * sin(ph + 1.5 * sin(ph * .37)) * wob * mix(.25, 1., smoothstep(0., .12, e)) + cross(aTan, aN) * cos(ph * 1.31 + 1.7) * wob * .6 * smoothstep(0., .12, e);
        vec3 toEye = cameraPosition - pos; float dist = length(toEye);
        // (knots of water travel up it: it swells and thins as they pass; never thinner than a pixel and a half)
        float hw = max(aF.z * (1. + .35 * sin((m - uTime * speed) * .16 + sr * 40.)), dist * uPx * .75) * step(.004, str);
        vec3 ax = normalize(cross(aTan, toEye) + vec3(1e-5, 0., 0.));
        pos += ax * hw * aS.x;
        str *= clamp(aF.z / max(hw, 1e-4) * 1.4 + .3, 0., 1.);                       // (where the pixel's breadth has widened it, it is fainter)
        // (vL.y: 1 where the ribbon has its own breadth, 0 where it is as narrow as it may be drawn)
        vUv = vec2(aS.x, m); vW = pos; vAx = ax; vL = vec2(aW.w, clamp(aF.z / max(hw, 1e-4) * 2. - .7, 0., 1.)); vI = vec4(str, e, sr, speed);
        vec4 mvPosition = viewMatrix * vec4(pos, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv, vL; varying vec4 vI; varying vec3 vW, vAx;
      #include <fog_pars_fragment>
      ${Je}
      ${Xe}
      void main(){
        float a = vUv.x, str = vI.x, e = clamp(vI.y, 0., 1.), sr = vI.z, core = 0., fl = vUv.y - uTime * vI.w;
        // (its edge wanders as the water runs: no straight side)
        a += (nR(vec2(sr * 5.3, fl * .013)) - .5) * mix(.3, .5, core) * (1. - a * a);
        // (and no even breadth: a knot of water fills its ribbon, the stretch between two knots is a thread less than half as
        // broad, and knots and threads run up it with the water)
        a /= mix(1., mix(.42, 1., smoothstep(.3, .62, nR(vec2(sr * 3.1, fl * .0041)) * .65 + nA(vec2(sr * 6.7, fl * .011)) * .35)), vL.y);
        float cyl = sqrt(max(1. - a * a, 0.));
        // streaks along the flow, and knots: both run up the rope
        float st = nA(vec2(a * mix(.016, .034, core) + sr * 7.3, fl * .0026)), st2 = nA(vec2(a * mix(.011, .021, core) + sr * 3.7, fl * .0063 + .4));
        float knot = nR(vec2(sr * 3.1 + a * .012, fl * .0041));
        float dens = (st * .6 + st2 * .4) * .75 + knot * .5, rag = nA(vec2(a * .045 + sr * 1.7, fl * .0085 + .7));
        // whole near the rock, its sides ragged with tufts of spray; torn to strands as it goes, the strands to beads
        float tear = smoothstep(0., 1., e), th = mix(.16, .46, tear);
        float body = smoothstep(th, th + .26, dens * (.5 + .5 * cyl) + (rag - .5) * .4 * (1. - cyl));   // (soft: spray, not cord)
        // (a filament is no even cord: thick knots of water and thin stretches between them, travelling; toward its end
        // it comes apart into a chain of beads, each its own length, and the last of them fly on alone)
        float bead = smoothstep(.42, .6, nA(vec2(sr * 9.1, fl * .0075)) * .7 + nR(vec2(sr * 4.3, fl * .0031)) * .3);
        body *= mix(.3, 1., smoothstep(.3, .52, knot)) * mix(1., bead, smoothstep(.12, .6, e));
        float al = body * str * .97 * (1. - smoothstep(.8, 1., e)) * (1. - smoothstep(.8, 1., abs(a))) * mix(mix(.6, 1., cyl), cyl * cyl, vL.y);   // (its edge feathers where it has breadth to)
        // a body of white water: its side toward the sun is lit, its heart and its under side keep the sky's blue-grey;
        // against the sun its thin edge is bright and its heart dark
        vec3 V = normalize(cameraPosition - vW), N = normalize(vAx * a * .95 + V * max(cyl, .15));
        float lit = vL.x * scudShade(vW), sunny = clamp(dot(N, uSunDir) * .5 + .5, 0., 1.), fwd = pow(max(dot(-V, uSunDir), 0.), 4.), thick = cyl * dens;
        float heart = 1. - mix(.15, .45, core) * smoothstep(.2, .6, thick), crest = smoothstep(.36, .66, st * .6 + st2 * .4);
        vec3 col = (uSkyCol * 1.15 + vec3(.03, .04, .055)) * (.8 + .2 * N.y)
                 + uSunCol * lit * ((.72 + .42 * sunny) * heart * (.62 + .45 * crest) + fwd * (1. - thick) * .8 + crest * crest * crest * sunny * .3);   // (brighter than the veils it runs in)
        float bw = dot(V, uSunDir), bow = smoothstep(.722, .74, bw) * (1. - smoothstep(.766, .784, bw)) * lit * e;
        col += vec3(1. - smoothstep(.738, .758, bw), 1. - smoothstep(0., .015, abs(bw - .752)), smoothstep(.746, .766, bw)) * bow * .7 * uSunCol;
        #ifdef USE_FOG
          col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
        #endif
        gl_FragColor = vec4(col * al, al);
      }`})}function nt(x){return new s.ShaderMaterial({uniforms:x,fog:!0,transparent:!0,depthWrite:!1,side:s.DoubleSide,blending:s.CustomBlending,blendSrc:s.OneFactor,blendDst:s.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec3 iP, iV; attribute vec4 iD, iE;
      uniform float uPx, uTime;
      ${Qe}
      varying vec2 vUv; varying vec3 vW; varying vec3 vS;
      #include <fog_pars_vertex>
      void main(){
        float age = fract(iD.y + uTime / iD.z), t = age * iD.z, tau = galeTauRun(iD.x), speed = .5 / (uGale.z * uGale.y);
        float str = galeFail(tau - iE.x * .5 / speed - t) * galeFail(tau) * smoothstep(0., .1, age) * (1. - smoothstep(.65, 1., age));
        vec3 c = iP + iV * t - vec3(0., .5 * iE.w, 0.) * t * t, vel = iV - vec3(0., iE.w, 0.) * t;
        vec3 toEye = cameraPosition - c; float dist = length(toEye), sp = max(length(vel), 1e-3);
        vec3 along = vel / sp, ax = normalize(cross(along, toEye) + vec3(1e-5, 0., 0.));
        float wd = max(iE.y, dist * uPx * .65) * step(.004, str), len = wd * 2.6;
        vec3 pos = c + along * position.y * len + ax * position.x * wd;
        vUv = position.xy; vW = pos; vS = vec3(str * min(1., iE.y / max(wd, 1e-4) + .35), iE.z, iD.w);
        vec4 mvPosition = viewMatrix * vec4(pos, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vUv; varying vec3 vW; varying vec3 vS;
      #include <fog_pars_fragment>
      ${Je}
      ${Xe}
      void main(){
        // a round soft bead at its head, a short thin streak behind it along its flight
        float yy = (vUv.y - .55) * 2.6, bead = 1. - smoothstep(.2, 1., vUv.x * vUv.x + yy * yy);
        float tail = (1. - smoothstep(.12, .7, abs(vUv.x))) * smoothstep(-1., .3, vUv.y) * (1. - step(.55, vUv.y)) * .45;
        float a = max(bead, tail) * vS.x;
        vec3 V = normalize(cameraPosition - vW);
        float lit = vS.y * scudShade(vW), fwd = pow(max(dot(-V, uSunDir), 0.), 4.);
        vec3 col = uSkyCol * 1.25 + vec3(.04, .05, .07) + uSunCol * lit * (.8 + 1.2 * fwd);
        #ifdef USE_FOG
          col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth));
        #endif
        gl_FragColor = vec4(col * a, a);
      }`})}async function st(x,a={}){const D=new s.Group,U=a.gale||et({}),$=a.falls||[],T=a.wind||[.62,-.785],re=a.light||{},o=a.rng||x.rng.fork("hero"),Ce=a.fog||(()=>s.UniformsUtils.clone(s.UniformsLib.fog)),K=a.clearOf||(()=>1e9),Ae=a.sunAt||(()=>1),le={tNoise:re.tNoise,uGale:U.uniform,uTime:re.uTime,uSunDir:re.uSunDir,uSunCol:re.uSunCol,uSkyCol:re.uSkyCol,uBounce:re.uBounce,uScud:re.uScud},Y={value:.0016},w={mistClear:1/0,puffs:0,strandClear:1/0,ropeClear:1/0,ropes:0,drops:0},G=C=>C.long?.7:C.seep?.5:.6,R=[];{const C=[],X=[],n=[],ye=[],ue=[],Pe=[],xe=[],b={},r=[];let j=1;for(const c of $){const V=c.top-c.foot,te=c.long?15:c.seep?3:5,_=c.long?84:40,e=U.run(c.x,c.z),v=G(c),h=c.long?.42:c.seep?.2:.45,u=T[0]*c.tan[0]+T[1]*c.tan[1]>=0?1:-1,F=(c.long?.05:.075)*V,E=c.long?4:c.seep?1:2;for(let L=0;L<te+E;L++){const S=L>=te?1:0,t=S?(L-te+.5)/E:(L+.5)/te,f=S?c.width/E*.6:c.width/te*o.range(.4,.82),M=(t*2-1+o.range(-.1,.1))*c.width*.5,I=o(),A=o.range(.6,1.5),oe=o()*6.283,p=o.range(1.7,2.7),B=o()*6.283,m=C.length/3;r.length=0;for(let i=0;i<=_;i++){const d=i/_,N=M*(1+h*d)+(Math.sin(d*7*A+oe)*.11+Math.sin(d*7*p+B)*.06)*Ie(0,.12,d)*(1+d)*c.width*(S?.4:1);c.face(N,c.top-V*d,b),r.push(b.x,b.y,b.z),w.strandClear=Math.min(w.strandClear,K(b.x,b.y,b.z))}for(let i=0;i<=_;i++){const d=Math.max(0,i-1)*3,N=Math.min(_,i+1)*3;let O=r[N]-r[d],k=r[N+1]-r[d+1],he=r[N+2]-r[d+2];const fe=Math.hypot(O,k,he)||1;O/=fe,k/=fe,he/=fe;const ce=ze(1.25-1.6*Math.abs(k))*Ie(0,.04,i/_);c.long&&!S&&ce>.6&&(i&1)===0&&L%3===1&&i<_-4&&R.push([r[i*3],r[i*3+1],r[i*3+2],i/_<v?2:1]),((i&1)===0||i===_)&&(j=Ae(r[i*3]+c.out[0]*1.5,r[i*3+1]+.5,r[i*3+2]+c.out[1]*1.5));for(let ne=-1;ne<=1;ne+=2)C.push(r[i*3],r[i*3+1],r[i*3+2]),X.push(O,k,he),n.push(ne,i/_,I,ce),Pe.push(j),ye.push(e,V,v,f),ue.push(c.tan[0]*u,c.tan[1]*u,F,S)}for(let i=0;i<_;i++){const d=m+i*2;xe.push(d,d+1,d+2,d+1,d+3,d+2)}a.yield&&L%3===2&&await a.yield()}a.yield&&await a.yield()}const l=new s.BufferGeometry;l.setAttribute("position",new s.Float32BufferAttribute(C,3)),l.setAttribute("aTan",new s.Float32BufferAttribute(X,3)),l.setAttribute("aS",new s.Float32BufferAttribute(n,4)),l.setAttribute("aF",new s.Float32BufferAttribute(ye,4)),l.setAttribute("aW",new s.Float32BufferAttribute(ue,4)),l.setAttribute("aL",new s.Float32BufferAttribute(Pe,1)),l.setIndex(xe);const Fe=new s.Mesh(l,tt({...Ce(),...le,uPx:Y}));Fe.frustumCulled=!1,Fe.renderOrder=4,D.add(Fe)}a.yield&&await a.yield();const g=a.ropeRng||o.fork("rope"),Q=[-T[1],T[0]],Te=new Map;{const C={},X={};for(const n of $){const ye=n.top-n.foot,ue=G(n),Pe=U.run(n.x,n.z),xe=T[0]*n.tan[0]+T[1]*n.tan[1]>=0?1:-1,b=n.long?.42:n.seep?.2:.45,r=n.long?1.8:n.seep?.5:1,j=n.long?18:n.seep?4:10,l=n.long?44:n.seep?16:20,Fe=n.long?30:n.seep?12:18,c=l+Fe,V=n.top-ye*ue,te=n.width*.5*(1+b*ue)+(n.long?3:n.seep?.75:3),_=te+(n.seep?2.5:Math.min(26,Math.max(8,.09*ye))),e=n.top-.3,v=t=>(1.5+2.6*ze((t-V)/(n.top-V)))*r,h=Math.max(n.foot+1,n.top-ye*(ue+.12)),u=t=>h+(e-h)*(t/l),F=[],E=(t,f)=>(n.face(xe*t,f,C),(C.x-X.x)*n.out[0]+(C.z-X.z)*n.out[1]>4);for(let t=0;t<=l;t++){const f=u(t);n.face(0,f,X);let M=2;for(;M<=60&&!E(M,f);M+=2);let I=M-2;if(M<=60)for(let A=M-1.5;A<M&&!E(A,f);A+=.5)I=A;F.push(I),a.yield&&(t&7)===7&&await a.yield()}for(let t=0;t<=l;t++)F[t]=Math.min(F[Math.max(0,t-1)],F[t],F[Math.min(l,t+1)]);const L=t=>{const f=ze((t-h)/(e-h))*l,M=Math.min(l-1,Math.floor(f)),I=Me(F[M],F[M+1],f-M);return xe*Math.max(Math.min(te+(_-te)*Math.pow(ze((t-V)/(n.top-V)),1.15),I-v(t)),n.width*.25)},S={up:g.range(14,24)*(n.long?2.2:n.seep?.6:1),reach:g.range(46,70)*(n.long?2:n.seep?.5:1),rise:g.range(.4,.7)+(n.long?.1:0),side:g.range(-6,6)*r,rim:[0,0,0]};n.face(L(e),e,C),S.rim[0]=C.x+n.out[0],S.rim[1]=e,S.rim[2]=C.z+n.out[1],Te.set(n,{H:ye,keep:ue,run:Pe,sgn:xe,fanK:b,big:r,NSr:j,nRock:l,nBan:Fe,NRr:c,yk:V,yTop:e,yBot:h,girth:v,rowY:u,axis:L,way:S}),a.yield&&await a.yield()}for(let n=0;n<4;n++)g()}const Ge=a.detail??1;let ee=null;{const C=[],X=[],n=[],ye=[],ue=[],Pe=[],xe=[],b={},r={},j={},l=re.uSunDir?re.uSunDir.value:{x:0,z:0},Fe=l.x*Q[0]+l.z*Q[1]>=0?1:-1,c=(e,v,h,u,F,E,L,S,t,f,M,I,A=-1,oe=1)=>{let p=1/0;if(!(t>=Ge)){for(let B=0;B<=4;B++){const m=B/4,i=1-m,d=i*i*i,N=3*i*i*m,O=3*i*m*m,k=m*m*m;p=Math.min(p,K(e[0]*d+v[0]*N+h[0]*O+u[0]*k,e[1]*d+v[1]*N+h[1]*O+u[1]*k,e[2]*d+v[2]*N+h[2]*O+u[2]*k)-L*(.55+M*m)*(I===4?.22:I<.5?2.7:2))}if(!(p<=25)){w.mistClear=Math.min(w.mistClear,p),w.puffs++,C.push(e[0],e[1],e[2]),X.push(v[0],v[1],v[2]),n.push(h[0],h[1],h[2]),ye.push(u[0],u[1],u[2]),ue.push(F,E,L,S),Pe.push(t,f*(.3+.7*Ie(25,110,p)),M,I);for(let B=0;B<4;B++){if(A>=0){xe.push(A);continue}const m=B/3,i=1-m,d=i*i*i,N=3*i*i*m,O=3*i*m*m,k=m*m*m;xe.push(oe*Ae(e[0]*d+v[0]*N+h[0]*O+u[0]*k,e[1]*d+v[1]*N+h[1]*O+u[1]*k+2,e[2]*d+v[2]*N+h[2]*O+u[2]*k))}}}};for(const e of $){const v=e.top-e.foot,h=U.run(e.x,e.z),u=G(e),F=e.long?1.5:e.seep?.6:1,E=T[0]*e.tan[0]+T[1]*e.tan[1]>=0?1:-1,L=e.seep?.3:1,S=e.seep?.6:1,t=Te.get(e),f=t.way,M=[f.rim[0]+e.out[0]*3,f.rim[1]+f.up,f.rim[2]+e.out[1]*3],I=[f.rim[0]+T[0]*f.reach+Q[0]*f.side,f.rim[1]+f.up*.9+f.rise*f.reach,f.rim[2]+T[1]*f.reach+Q[1]*f.side];for(let A=0,oe=e.long?230:Math.round(116*L);A<oe;A++){const p=Me(u+.04,1,Math.pow(o(),.8)),B=o.range(-.5,.5)*e.width*(1+.45*p),m=E*o.range(4,16)*F,i=o.range(4.6,7.8)*(e.long?1.8:S),d=1/o.range(4.5,6),N=o(),O=o(),k=e.long?o.range(70,150):o.range(170,260)*S,he=e.long?o.range(30,90):o.range(80,160)*S,fe=o.range(2,3.1),ce=o.range(-18,18);e.long&&o.range(.1,.32);const ne=ce/18,De=e.long?(k-70)/80:(k/S-170)/90,Ue=e.long?(he-30)/60:(he/S-80)/80,Z=e.long?Me(.7,1.45,De):Me(.5,1.25,De),P=1-Z,Ee=e.top-v*p,ie=Math.max(Ee,t.yBot),se=ne*(3+14*Z)*t.big,H=(Ue-.5)*24*Z*t.big,be=ne*1.3,de=.55+.45*ze(.5+.35*ne*Fe+.6*(Ue-.5));if(A%5<2){const ve=Me(ie,t.yTop,.4),J=Me(ie,t.yTop,.75);e.face(B,Ee,b),e.face(t.axis(ve)+be*t.girth(ve),ve,r),e.face(t.axis(J)+be*t.girth(J),J,j);const q=[j.x+e.out[0]*2,j.y,j.z+e.out[1]*2];e.face(t.axis(t.yTop)+be*t.girth(t.yTop),t.yTop,j),c([b.x,b.y,b.z],[r.x+e.out[0]*2,r.y,r.z+e.out[1]*2],q,[j.x+e.out[0]*3,j.y+5*t.big,j.z+e.out[1]*3],h,N,i*.6,d*1.3,O,e.long?.5:.52,fe*.4,0,-1,de)}else{const ve=t.yTop-(2+10*Ue)*t.big,J=2/3;e.face(t.axis(ve)+be*t.girth(ve),ve,b);const q=[b.x+e.out[0]*2,b.y,b.z+e.out[1]*2],ge=[Me(q[0],M[0],Z),Me(q[1],M[1]+(Ue-.5)*8*t.big,Z),Me(q[2],M[2],Z)],pe=[P*P*q[0]+2*Z*P*M[0]+Z*Z*I[0]+Q[0]*se,P*P*q[1]+2*Z*P*M[1]+Z*Z*I[1]+H,P*P*q[2]+2*Z*P*M[2]+Z*Z*I[2]+Q[1]*se];c(q,[q[0]+(ge[0]-q[0])*J,q[1]+(ge[1]-q[1])*J,q[2]+(ge[2]-q[2])*J],[pe[0]+(ge[0]-pe[0])*J,pe[1]+(ge[1]-pe[1])*J,pe[2]+(ge[2]-pe[2])*J],pe,h,N,i*(e.long?1.2:.9),d*(e.long?1.25:1.5),O,e.long?.6:.58,fe*(e.long?.9:.8),.3,-1,de)}a.yield&&(A&31)===31&&await a.yield()}a.yield&&await a.yield();for(let A=0,oe=e.long?84:Math.round(22*L);A<oe;A++){const p=u+o.range(-.02,.2),B=o.range(-.6,.6)*e.width*(1+.5*p),m=E*o.range(10,30)*F,i=o.range(4.6,8)*(e.long?1.7:S),d=1/o.range(3,5),N=o(),O=o(),k=o.range(.03,.09)*v,he=o.range(1,1.7);e.face(B,e.top-v*p,b),e.face(B+m*.5,e.top-v*p+k*.5,r),e.face(B+m,e.top-v*p+k,j),c([b.x,b.y,b.z],[(b.x*2+r.x)/3,(b.y*2+r.y)/3,(b.z*2+r.z)/3],[r.x,r.y,r.z],[j.x,j.y,j.z],h,N,i*.6,d,O,e.long?.34:.3,he*.6,3)}a.yield&&await a.yield();for(let A=0,oe=e.long?120:Math.round(30*L);A<oe;A++){const p=o.range(-.6,.6)*e.width*(e.long?1.5:1.2),B=o.range(1,7)*F,m=o.range(4.6,8.4)*(e.long?1.8:S),i=1/o.range(3.5,6),d=o(),N=o(),O=o.range(14,30)*(e.long?2.2:1),k=o.range(8,22)*F,he=o.range(1,1.8),fe=e.px+e.tan[0]*p+e.out[0]*B,ce=e.pz+e.tan[1]*p+e.out[1]*B,ne=e.foot+1.5,De=e.tan[0]*E*.85+e.out[0]*.3,Ue=e.tan[1]*E*.85+e.out[1]*.3;c([fe,ne,ce],[fe+De*k*.2,ne+O*.45,ce+Ue*k*.2],[fe+De*k*.55,ne+O*.8,ce+Ue*k*.55],[fe+De*k,ne+O,ce+Ue*k],h,d,m,i,N,e.long?.38:.3,he,1)}}{const e=$.find(h=>h.long),v=e?U.run(e.x,e.z):0;for(let h=0;e&&h<Math.min(40,R.length);h++){const u=R[Math.floor(h*R.length/Math.min(40,R.length))],F=o.range(4,7.5),E=1/o.range(2.2,3.6),L=o(),S=o(),t=u[0]+e.out[0]*1.5,f=u[2]+e.out[1]*1.5;c([t,u[1],f],[t+e.out[0]*2,u[1]+3,f+e.out[1]*2],[t+e.out[0]*3,u[1]+6,f+e.out[1]*3],[t+e.out[0]*4,u[1]+9,f+e.out[1]*4],v,L,F,E,S,.3,1.3,u[3])}}a.yield&&await a.yield();for(const[e,v,h]of a.smoke||[]){const u=o.range(22,46),F=o.range(1.5,5),E=1/o.range(2.4,3.6),L=o(),S=o(),t=h*.13;c([e,t,v],[e+T[0]*u*.33,t+F*.4,v+T[1]*u*.33],[e+T[0]*u*.66,t+F*.8,v+T[1]*u*.66],[e+T[0]*u,t+F,v+T[1]*u],U.run(e,v),L,h,E,S,.24,.9,4,1)}const V=new s.PlaneGeometry(2,2),te=ue.length/4,_=(e,v)=>new s.InstancedBufferAttribute(new Float32Array(e),v);V.setAttribute("iP0",_(C,3)),V.setAttribute("iP1",_(X,3)),V.setAttribute("iP2",_(n,3)),V.setAttribute("iP3",_(ye,3)),V.setAttribute("iM",_(ue,4)),V.setAttribute("iN",_(Pe,4)),V.setAttribute("iL",_(xe,4)),te&&(ee=new s.InstancedMesh(V,at({...Ce(),...le}),te),ee.frustumCulled=!1,ee.renderOrder=5,D.add(ee))}a.yield&&await a.yield();let ae=null;{const C=[],X=[],n=[],ye=[],ue=[],Pe=[],xe=[],b=[],r={},j={},l=[],Fe=[],c=[],V=[],te=[],_=[],e=U.wave/U.period,v=(t,f,M,I,A)=>{const oe=1-I;for(let p=0;p<3;p++)A[p]=oe*oe*t[p]+2*I*oe*f[p]+I*I*M[p];return A};for(const t of $){const{H:f,keep:M,run:I,sgn:A,fanK:oe,big:p,NSr:B,nRock:m,nBan:i,NRr:d,yk:N,yTop:O,girth:k,rowY:he,axis:fe,way:ce}=Te.get(t),ne=(P,Ee,ie)=>{const se=ce.up*(1+ie*g.range(-.5,.5)),H=ce.reach*Ee*(1+ie*g.range(-.5,.4)),be=ce.rise*(1+ie*g.range(-.6,.6))*H,de=ce.side+ie*g.range(-12,12)*p;return[[P[0]+t.out[0]*3,P[1]+se,P[2]+t.out[1]*3],[P[0]+T[0]*H+Q[0]*de,P[1]+se*.9+be,P[2]+T[1]*H+Q[1]*de],se+H]},De=Math.abs(he(m)-he(0))/m,Ue=Math.min(.47/p,6.2832/(8*De)),Z=Math.min(.83/p,6.2832/(6*De));for(let P=0;P<B;P++){a.yield&&(P&1)===1&&await a.yield();const Ee=0,ie=P/B*6.283+g.range(-.5,.5),se=Math.max(g.range(26,50)*p,9*De),H=g()*6.283,be=g()*6.283,de=g.range(.25,1.5),ve=g.range(.7,1.4),J=(P+.5)/B,q=g.range(.35,1);l.length=0;let ge=0,pe=1/0,$e=1,je=null,qe=null,Be=0;const Le=[0,0,0],Ne=[0,0,0];for(let y=0;y<=d;y++){let z,W,me,we=0,Se,ke=0,Oe=0,We;if(y<=m){W=he(y),We=(t.top-W)/f;const Re=ze((W-N)/(t.top-N)),Ye=6.2832*(W-t.foot)/se+ie;t.face(fe(W)+k(W)*(de*Math.sin(Ye)+.3*Math.sin((W-t.foot)*Ue+H)+.17*Math.sin((W-t.foot)*Z+be)),W,r);const He=.4+.3*k(W)*(.5+.5*Math.cos(Ye));if(z=r.x+t.out[0]*He,me=r.z+t.out[1]*He,Se=(.2+.3*Re)*p*ve,t.face((J-.5)*t.width*.85*(1+oe*We),W,j),ke=j.x-r.x,Oe=j.z-r.z,y===m){Le[0]=z,Le[1]=W,Le[2]=me;const Ze=ne(Le,1,.5);je=Ze[0],qe=Ze[1]}}else we=(y-m)/i,v(Le,je,qe,we*q,Ne),z=Ne[0],W=Ne[1],me=Ne[2],Se=(.5-.3*we)*p*ve;if(y>0){const Re=(y-1)*9;ge+=Math.hypot(z-l[Re],W-l[Re+1],me-l[Re+2])}y===m&&(Be=ge),We=y<=m?We:-(ge-Be)/f,((y&1)===0||y===d)&&($e=Ae(z+t.out[0]*1.5,W+.5,me+t.out[1]*1.5)),pe=Math.min(pe,K(z,W,me)-Se-(.3+5.5*we)*1.2*p),l.push(z,W,me,ge,Se,We,we,ke,Oe),Fe[y]=$e}if(pe<=25)continue;w.ropeClear=Math.min(w.ropeClear,pe),w.ropes++;const Ke=C.length/3;for(let y=0;y<=d;y++){const z=y*9,W=Math.max(0,y-1)*9,me=Math.min(d,y+1)*9;let we=l[me]-l[W],Se=l[me+1]-l[W+1],ke=l[me+2]-l[W+2];const Oe=Math.hypot(we,Se,ke)||1;we/=Oe,Se/=Oe,ke/=Oe;const We=y<=m,Re=We?t.tan[0]*A:Q[0],Ye=We?t.tan[1]*A:Q[1];for(let He=-1;He<=1;He+=2)C.push(l[z],l[z+1],l[z+2]),X.push(we,Se,ke),n.push(Re,0,Ye),ye.push(He,p,de+ie,Ee),ue.push(I,l[z+3],l[z+4],M),Pe.push(l[z+7],0,l[z+8],Fe[y]),xe.push(l[z+5],Math.max(0,l[z+3]-Be),l[z+6],ze(y/3))}for(let y=0;y<d;y++){const z=Ke+y*2;b.push(z,z+1,z+2,z+1,z+3,z+2)}}for(let P=0,Ee=t.long?2200:t.seep?90:380;P<Ee;P++){const ie=O,se=[0,0,0],H=[0,0,0],be=[0,0,0];a.yield&&(P&31)===31&&await a.yield(),t.face(fe(ie)+k(ie)*g.range(-1,1),ie,r),se[0]=r.x+t.out[0],se[1]=ie,se[2]=r.z+t.out[1];const de=ne(se,1,1),ve=.04+.96*Math.pow(g(),1.5),J=g.range(.4,.8)*.5*e*(t.seep?.55:1),q=g.range(1.3,2.4)*(t.seep?.7:1),ge=g.range(5,9),pe=g.range(.22,.5)*(t.long?1.4:t.seep?.7:1),$e=g(),je=g(),qe=g.range(-2,6)*(t.seep?.5:1),Be=g.range(-5,5)*(t.seep?.5:1);if(je>=Ge)continue;v(se,de[0],de[1],ve,H),v(se,de[0],de[1],Math.min(1,ve+.02),be);let Le=be[0]-H[0],Ne=be[1]-H[1],Ke=be[2]-H[2];const y=Math.hypot(Le,Ne,Ke)||1,z=Le/y*J*.7+T[0]*J*.55+Q[0]*Be,W=Ne/y*J*.7+qe,me=Ke/y*J*.7+T[1]*J*.55+Q[1]*Be;let we=1/0;for(let Se=0;Se<=4;Se++){const ke=q*Se/4;we=Math.min(we,K(H[0]+z*ke,H[1]+W*ke-.5*ge*ke*ke,H[2]+me*ke)-1)}we<=25||(w.ropeClear=Math.min(w.ropeClear,we),w.drops++,c.push(H[0],H[1],H[2]),V.push(z,W,me),te.push(I,$e,q,je),_.push(ve*de[2],pe,Ae(H[0],H[1],H[2]),ge))}a.yield&&await a.yield()}const h=new s.BufferGeometry,u=(t,f)=>new s.Float32BufferAttribute(t,f);h.setAttribute("position",u(C,3)),h.setAttribute("aTan",u(X,3)),h.setAttribute("aN",u(n,3)),h.setAttribute("aS",u(ye,4)),h.setAttribute("aF",u(ue,4)),h.setAttribute("aW",u(Pe,4)),h.setAttribute("aG",u(xe,4)),h.setIndex(b);const F=new s.Mesh(h,ot({...Ce(),...le,uPx:Y}));F.frustumCulled=!1,F.renderOrder=6,D.add(F);const E=new s.BufferGeometry,L=te.length/4,S=(t,f)=>new s.InstancedBufferAttribute(new Float32Array(t),f);E.setAttribute("position",u([-1,-1,0,3,-1,0,-1,3,0],3)),E.setAttribute("iP",S(c,3)),E.setAttribute("iV",S(V,3)),E.setAttribute("iD",S(te,4)),E.setAttribute("iE",S(_,4)),L&&(ae=new s.InstancedMesh(E,nt({...Ce(),...le,uPx:Y}),L),ae.frustumCulled=!1,ae.renderOrder=7,D.add(ae))}a.yield&&await a.yield();const _e=new s.Vector2,Ve=Math.tan((a.fov??60)*Math.PI/360);return{object:D,radius:1400,height:700,center:new s.Vector3(300,250,-700),anchors:{},uniforms:le,gale:U,facts:w,update(C,X){U.set(X),x.renderer&&(x.renderer.getDrawingBufferSize(_e),Y.value=2*Ve/Math.max(1,_e.y))},dispose(){ee&&ee.dispose(),ae&&ae.dispose()},ground:!1,groundY:0}}export{Qe as GLSL_GALE,Xe as GLSL_LIGHT,Je as GLSL_NOISE,st as buildHero,et as makeGale,it as makeNoiseTexture};
